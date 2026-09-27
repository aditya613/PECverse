import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl, Alert } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/theme/colors';
import { useAuthStore } from '@/stores/useAuthStore';
import { DateRibbon } from '@/components/timetable/DateRibbon';
import { MergedClass } from '@/components/timetable/ClassCard';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import { api } from '@/utils/api';
import { useTimetable } from '@/hooks/useTimetable';
import { fetchDatesheet } from '@/utils/datesheetApi';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { AnimatedPressable } from '@/components/ui/AnimatedPressable';
import { trackScreen, trackEvent } from '@/utils/analytics';

export default function TimetableScreen() {
  const user = useAuthStore(state => state.user);
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const queryClient = useQueryClient();
  const { colors, isDark } = useTheme();

  // Generate date list for 21 days (3 days ago + today + 17 days ahead)
  const today = new Date();
  const todayYear = today.getFullYear();
  const todayMonth = String(today.getMonth() + 1).padStart(2, '0');
  const todayDay = String(today.getDate()).padStart(2, '0');
  const todayDateStr = `${todayYear}-${todayMonth}-${todayDay}`;

  const [selectedDate, setSelectedDate] = useState(todayDateStr);

  React.useEffect(() => {
    trackScreen('timetable');
  }, []);

  const handleDateChange = (newDate: string) => {
    setSelectedDate(newDate);
    trackEvent('timetable_date_select', { date: newDate });
  };

  const weekDates = Array.from({ length: 21 }, (_, i) => {
    const d = new Date();
    d.setDate(today.getDate() - 3 + i);

    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const dNum = String(d.getDate()).padStart(2, '0');
    const dateStr = `${y}-${m}-${dNum}`;

    const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
    const dayNum = d.getDate();
    return { dayName, dayNum, fullDate: dateStr };
  });

  const { classes = [], activeHoliday, isLoading, isRefetching, refetch } = useTimetable(selectedDate);
  const isCrOrAdmin = user?.role === 'cr' || user?.role === 'superadmin';

  // Check if student has a Mid Term Exam today
  const { data: datesheetData } = useQuery({
    queryKey: ['datesheet-mid-term-2026', user?.class_id],
    queryFn: () => fetchDatesheet(user?.class_id),
  });

  const examToday = React.useMemo(() => {
    if (!datesheetData) return null;
    const exams = datesheetData.user_mapping?.my_exams || [];
    return exams.find((e) => e.exam_date === selectedDate) || null;
  }, [datesheetData, selectedDate]);

  const deleteHolidayMutation = useMutation({
    mutationFn: async (holidayId: number) => {
      return await api.delete(`/timetables/holiday/${holidayId}`);
    },
    onSuccess: () => {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      queryClient.invalidateQueries({ queryKey: ['timetables'] });
      Alert.alert('Success', 'Holiday removed. Regular schedule is now active.');
    },
    onError: (err: any) => {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert('Error', err.response?.data?.message || 'Failed to remove holiday');
    }
  });

  const handleRemoveHoliday = () => {
    if (!activeHoliday) return;
    Alert.alert(
      'Cancel Holiday?',
      'Are you sure you want to remove this holiday and resume regular classes?',
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Yes, Resume Classes',
          style: 'destructive',
          onPress: () => deleteHolidayMutation.mutate(activeHoliday.id)
        }
      ]
    );
  };

  const handleClassPress = (cls: MergedClass) => {
    if (!isCrOrAdmin) return;
    Haptics.selectionAsync();

    const baseId = parseInt(cls.id.split('-')[1] || cls.id);

    router.push({
      pathname: '/manage-class-options' as any,
      params: {
        timetableId: baseId,
        date: selectedDate,
        subject: cls.subject,
        start_time: cls.start_time,
        end_time: cls.end_time,
        room: cls.room || ''
      }
    });
  };

  const CARD_THEMES = isDark ? [
    { bg: '#064E3B20', border: '#10B981', text: '#34D399', badgeBg: '#10B98125' },
    { bg: '#1E3A8A20', border: '#3B82F6', text: '#60A5FA', badgeBg: '#3B82F625' },
    { bg: '#7C2D1220', border: '#F59E0B', text: '#FBBF24', badgeBg: '#F59E0B25' },
    { bg: '#4C1D9520', border: '#8B5CF6', text: '#A78BFA', badgeBg: '#8B5CF625' },
  ] : [
    { bg: '#ECFDF5', border: '#059669', text: '#059669', badgeBg: '#D1FAE5' },
    { bg: '#EFF6FF', border: '#2563EB', text: '#2563EB', badgeBg: '#DBEAFE' },
    { bg: '#FFFBEB', border: '#D97706', text: '#D97706', badgeBg: '#FEF3C7' },
    { bg: '#F5F3FF', border: '#7C3AED', text: '#7C3AED', badgeBg: '#EDE9FE' },
  ];

  const parsedDate = new Date(selectedDate + 'T00:00:00');
  const formattedHeaderDate = parsedDate.toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' });

  return (
    <View style={[styles.container, { backgroundColor: colors.systemBackground }]}>
      {/* Header Bar */}
      <SafeAreaView style={[styles.header, { backgroundColor: colors.cardBackground, borderBottomColor: colors.cardBorder }]} edges={['top']}>
        <View style={styles.headerRow}>
          <View>
            <Text style={[styles.headerTitle, { color: colors.label }]}>Schedule</Text>
            <Text style={[styles.headerSubtitle, { color: colors.secondaryLabel }]}>{formattedHeaderDate}</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <AnimatedPressable
              style={[
                styles.datesheetPill,
                { backgroundColor: 'rgba(245, 158, 11, 0.15)', borderColor: 'rgba(245, 158, 11, 0.35)' }
              ]}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                router.push('/datesheet' as any);
              }}
            >
              <Ionicons name="document-text" size={13} color="#F59E0B" />
              <Text style={styles.datesheetPillText}>Mid-Terms</Text>
            </AnimatedPressable>

            <AnimatedPressable
              style={[
                styles.rosterPill,
                { backgroundColor: colors.secondarySystemBackground, borderColor: colors.cardBorder }
              ]}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                router.push('/class-roster' as any);
              }}
            >
              <Ionicons name="people" size={13} color={colors.accent} />
              <Text style={[styles.rosterPillText, { color: colors.label }]}>Classmates</Text>
            </AnimatedPressable>
          </View>
        </View>

        {/* Date-Wise Selection Ribbon (21-Day Calendar) */}
        <DateRibbon
          dates={weekDates}
          selectedDate={selectedDate}
          todayDate={todayDateStr}
          onSelectDate={(dateStr) => {
            Haptics.selectionAsync();
            handleDateChange(dateStr);
          }}
        />
      </SafeAreaView>

      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 110 }]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor={colors.accent} />
        }
      >
        {/* Mid Term Exam Highlight Card if student has an exam today */}
        {examToday && (
          <Animated.View entering={FadeInDown.springify()} style={{ marginBottom: 12 }}>
            <AnimatedPressable
              style={[
                styles.examTodayCard,
                {
                  backgroundColor: colors.cardBackground,
                  borderColor: colors.cardBorder,
                  borderLeftColor: colors.accent,
                  borderLeftWidth: 3.5,
                },
              ]}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                router.push('/datesheet' as any);
              }}
            >
              <View style={styles.examTodayTop}>
                <View style={[styles.examTodayTagBadge, { backgroundColor: colors.accent + '15' }]}>
                  <Ionicons name="school" size={12} color={colors.accent} />
                  <Text style={[styles.examTodayTagText, { color: colors.accent }]}>EXAM TODAY</Text>
                </View>
                <View style={[styles.examTodayTimeBadge, { backgroundColor: isDark ? '#27272A' : '#F1F5F9' }]}>
                  <Ionicons name="time-outline" size={11} color={colors.secondaryLabel} />
                  <Text style={[styles.examTodayTimeText, { color: colors.secondaryLabel }]}>{examToday.time_slot}</Text>
                </View>
              </View>

              <Text style={[styles.examTodayTitle, { color: colors.label }]}>
                {examToday.subject_code} • {examToday.subject_name}
              </Text>

              {examToday.matched_regular_subject && (
                <View style={styles.examTodayMatchRow}>
                  <Ionicons name="link" size={11} color={colors.accent} />
                  <Text style={[styles.examTodayMatchText, { color: colors.accent }]} numberOfLines={1}>
                    Matches {examToday.matched_regular_subject}
                  </Text>
                </View>
              )}

              <View style={[styles.examTodayFooter, { borderTopColor: colors.separator }]}>
                <Text style={[styles.examTodayRoomText, { color: colors.secondaryLabel }]} numberOfLines={1}>
                  📍 {examToday.seating_rooms || 'Dept Examination Halls'}
                </Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                  <Text style={[styles.examTodayViewText, { color: colors.accent }]}>Datesheet</Text>
                  <Ionicons name="arrow-forward" size={12} color={colors.accent} />
                </View>
              </View>
            </AnimatedPressable>
          </Animated.View>
        )}

        {activeHoliday ? (
          <View style={[styles.holidayContainer, { backgroundColor: colors.accent + '10', borderColor: colors.accent + '30' }]}>
            <Text style={styles.holidayEmoji}>🌴</Text>
            <Text style={[styles.holidayTitle, { color: colors.accent }]}>Holiday Declared!</Text>
            <Text style={[styles.holidayReason, { color: colors.label }]}>{activeHoliday.reason || 'No classes today. Enjoy your day off!'}</Text>
            {isCrOrAdmin && (
              <AnimatedPressable
                onPress={handleRemoveHoliday}
                style={styles.cancelHolidayButton}
                disabled={deleteHolidayMutation.isPending}
              >
                <Text style={styles.cancelHolidayButtonText}>
                  {deleteHolidayMutation.isPending ? 'Removing...' : 'Cancel Holiday (Resume Classes)'}
                </Text>
              </AnimatedPressable>
            )}
          </View>
        ) : (classes || []).length === 0 ? (
          !examToday ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="calendar-outline" size={48} color={colors.tertiaryLabel} />
              <Text style={[styles.emptyTitle, { color: colors.label }]}>No Classes Scheduled</Text>
              <Text style={[styles.emptyText, { color: colors.secondaryLabel }]}>No classes scheduled for {formattedHeaderDate}.</Text>
            </View>
          ) : (
            <View style={styles.examDayNotice}>
              <Text style={[styles.examDayNoticeText, { color: colors.secondaryLabel }]}>
                Regular lectures are suspended during Mid-Term Examination sessions.
              </Text>
            </View>
          )
        ) : (
          <View style={styles.timelineWrapper}>
            {(classes || []).map((cls: MergedClass, index: number) => {
              const theme = CARD_THEMES[index % CARD_THEMES.length];
              const isCancelled = cls.status === 'cancelled';
              const isRescheduled = cls.status === 'rescheduled';
              const isExtra = cls.status === 'extra';

              return (
                <Animated.View
                  key={cls.id}
                  entering={FadeInDown.delay(index * 40).springify()}
                  style={styles.timelineRow}
                >
                  {/* Left Hour Label */}
                  <View style={styles.hourCol}>
                    <Text style={[styles.hourText, { color: colors.secondaryLabel }]}>{cls.start_time.substring(0, 5)}</Text>
                  </View>

                  {/* Class Card */}
                  <AnimatedPressable
                    style={[
                      styles.scheduleCard,
                      {
                        backgroundColor: isCancelled ? (isDark ? '#27272A' : '#F1F5F9') : theme.bg,
                        borderColor: isCancelled ? colors.cardBorder : theme.border + '35',
                        borderLeftColor: isCancelled ? '#EF4444' : theme.border
                      }
                    ]}
                    onPress={() => handleClassPress(cls)}
                    disabled={!isCrOrAdmin}
                  >
                    <View style={styles.cardMain}>
                      <View style={styles.subjectRow}>
                        <Text style={[styles.subjectText, { color: isCancelled ? colors.secondaryLabel : colors.label }, isCancelled && styles.strikethrough]}>
                          {cls.subject}
                        </Text>
                        {isCancelled && (
                          <View style={styles.cancelledBadge}>
                            <Text style={styles.cancelledBadgeText}>CANCELLED</Text>
                          </View>
                        )}
                        {isRescheduled && (
                          <View style={styles.rescheduledBadge}>
                            <Text style={styles.rescheduledBadgeText}>RESCHEDULED</Text>
                          </View>
                        )}
                        {cls.isActive && !isCancelled && (
                          <View style={{ backgroundColor: '#EF4444', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6 }}>
                            <Text style={{ color: 'white', fontSize: 10, fontWeight: '800' }}>LIVE</Text>
                          </View>
                        )}
                        {cls.isNext && !cls.isActive && !isCancelled && (
                          <View style={{ backgroundColor: '#F59E0B', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6 }}>
                            <Text style={{ color: 'white', fontSize: 10, fontWeight: '800' }}>UP NEXT</Text>
                          </View>
                        )}
                      </View>
                      <Text style={[styles.teacherText, { color: colors.secondaryLabel }]}>{cls.teacher || 'Department Faculty'}</Text>
                      <Text style={[styles.durationTag, { color: isDark ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.6)' }]}>
                        {cls.start_time.substring(0, 5)} - {cls.end_time.substring(0, 5)}
                      </Text>
                    </View>

                    <View style={[styles.roomPill, { backgroundColor: isCancelled ? colors.cardBorder : theme.badgeBg }]}>
                      <Text style={[styles.roomPillText, { color: isCancelled ? colors.secondaryLabel : theme.text }]}>
                        {cls.room || 'TBA'}
                      </Text>
                    </View>
                  </AnimatedPressable>
                </Animated.View>
              );
            })}
          </View>
        )}

        {/* CR Manage Action Button */}
        {isCrOrAdmin && (
          <View style={styles.bottomActionContainer}>
            <AnimatedPressable
              style={[styles.crActionBtn, { backgroundColor: colors.accent }]}
              onPress={() => router.push('/manage-timetable')}
            >
              <Ionicons name="settings" size={18} color="#FFFFFF" />
              <Text style={styles.crActionBtnText}>Add Class / Holidays</Text>
            </AnimatedPressable>
          </View>
        )}

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 8,
    borderBottomWidth: 1,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 4,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  headerSubtitle: {
    fontSize: 13,
    fontWeight: '600',
  },
  datesheetPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 11,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
  },
  datesheetPillText: {
    color: '#F59E0B',
    fontSize: 12,
    fontWeight: '800',
  },
  rosterPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
  },
  rosterPillText: {
    fontSize: 12,
    fontWeight: '700',
  },
  scrollContent: {
    padding: 16,
    gap: 16,
  },
  timelineWrapper: {
    gap: 12,
  },
  timelineRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  hourCol: {
    width: 54,
    paddingTop: 14,
  },
  hourText: {
    fontSize: 12,
    fontWeight: '700',
  },
  scheduleCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  cardMain: {
    flex: 1,
    gap: 3,
  },
  subjectRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 6,
  },
  subjectText: {
    fontSize: 15,
    fontWeight: '800',
  },
  strikethrough: {
    textDecorationLine: 'line-through',
  },
  cancelledBadge: {
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  cancelledBadgeText: {
    color: '#EF4444',
    fontSize: 10,
    fontWeight: '800',
  },
  rescheduledBadge: {
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  rescheduledBadgeText: {
    color: '#F59E0B',
    fontSize: 10,
    fontWeight: '800',
  },
  teacherText: {
    fontSize: 12,
  },
  durationTag: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: 2,
  },
  roomPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
  },
  roomPillText: {
    fontSize: 12,
    fontWeight: '800',
  },
  bottomActionContainer: {
    alignItems: 'center',
    marginTop: 16,
  },
  crActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 22,
    paddingVertical: 12,
    borderRadius: 20,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  crActionBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  holidayContainer: {
    paddingVertical: 40,
    alignItems: 'center',
    borderRadius: 20,
    borderWidth: 1,
    marginTop: 20,
  },
  holidayEmoji: {
    fontSize: 48,
    marginBottom: 16,
  },
  holidayTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 8,
  },
  holidayReason: {
    fontSize: 15,
    textAlign: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  cancelHolidayButton: {
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    borderColor: 'rgba(239, 68, 68, 0.3)',
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 14,
    marginTop: 6,
  },
  cancelHolidayButtonText: {
    color: '#EF4444',
    fontSize: 13,
    fontWeight: '700',
  },
  emptyContainer: {
    paddingVertical: 60,
    alignItems: 'center',
    gap: 8,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: '700',
    marginTop: 6,
  },
  emptyText: {
    fontSize: 13,
    textAlign: 'center',
  },
  examTodayCard: {
    borderRadius: 16,
    borderWidth: 1.5,
    padding: 14,
    marginBottom: 6,
  },
  examTodayTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  examTodayTagBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  examTodayTagText: {
    color: '#F59E0B',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  examTodayTimeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(56, 189, 248, 0.12)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  examTodayTimeText: {
    color: '#38BDF8',
    fontSize: 11,
    fontWeight: '700',
  },
  examTodayTitle: {
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 6,
    lineHeight: 22,
  },
  examTodayMatchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginBottom: 8,
  },
  examTodayMatchText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#3B82F6',
  },
  examTodayFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(245, 158, 11, 0.2)',
  },
  examTodayRoomText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#10B981',
    flex: 1,
    marginRight: 8,
  },
  examTodayViewText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#F59E0B',
  },
  examDayNotice: {
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  examDayNoticeText: {
    fontSize: 12,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});
