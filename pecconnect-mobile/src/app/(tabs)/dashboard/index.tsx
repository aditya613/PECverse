import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, RefreshControl, TextInput, Alert } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/utils/api';
import { useTheme } from '@/theme/colors';
import { useAuthStore } from '@/stores/useAuthStore';
import { useRouter } from 'expo-router';
import { useTimetable } from '@/hooks/useTimetable';
import { DashboardMessWidget } from '@/components/dashboard/DashboardMessWidget';
import { AttendanceWidget } from '@/components/dashboard/AttendanceWidget';
import { SkeletonCard } from '@/components/ui/SkeletonCard';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

interface Announcement {
  id: number;
  title: string;
  body: string;
  created_at: string;
  author: {
    name: string;
    profile_photo?: string;
  };
}

const QUICK_ACCESS = [
  { id: 'timetable', title: 'Schedule', icon: 'calendar', color: '#3B82F6', route: '/(tabs)/timetable' },
  { id: 'attendance', title: 'Attendance', icon: 'checkbox', color: '#10B981', route: '/attendance' },
  { id: 'mess', title: 'Mess Menu', icon: 'restaurant', color: '#F59E0B', route: '/mess' },
  { id: 'notes', title: 'Resources', icon: 'folder-open', color: '#8B5CF6', route: '/(tabs)/notes' },
  { id: 'freshers', title: 'Explore', icon: 'compass', color: '#EC4899', route: '/clubs' },
];

export default function DashboardScreen() {
  const user = useAuthStore(state => state.user);
  const router = useRouter();
  const { colors, isDark } = useTheme();

  // Fetch announcements
  const { data: announcements, isLoading, refetch, isRefetching } = useQuery({
    queryKey: ['announcements'],
    queryFn: async () => {
      const res = await api.get('/announcements');
      return res.data as Announcement[];
    },
  });

  const today = new Date();
  const y = today.getFullYear();
  const m = String(today.getMonth() + 1).padStart(2, '0');
  const dNum = String(today.getDate()).padStart(2, '0');
  const todayStr = `${y}-${m}-${dNum}`;

  const formattedDate = today.toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'short' });

  const getGreeting = () => {
    const hours = today.getHours();
    if (hours < 12) return 'Good Morning,';
    if (hours < 17) return 'Good Afternoon,';
    return 'Good Evening,';
  };

  const { classes: todayClasses = [], activeHoliday, isLoading: isTimetableLoading, refetch: refetchTimetable } = useTimetable(todayStr);

  const handleRefresh = () => {
    refetch();
    refetchTimetable();
  };

  const handleQuickAccess = (item: typeof QUICK_ACCESS[0]) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (item.route) {
      router.push(item.route as any);
    } else {
      Alert.alert(item.title, 'Viewing latest announcements from PEC administration.');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.systemBackground }]}>
      <ScrollView
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={handleRefresh}
            tintColor={colors.accent}
          />
        }
      >
        {/* Top App Header */}
        <View style={styles.topHeader}>
          <View style={styles.brandRow}>
            <View style={[styles.crestBox, { backgroundColor: colors.accent, overflow: 'hidden' }]}>
              <Image
                source={require('../../../../assets/images/icon.png')}
                style={{ width: '100%', height: '100%' }}
                resizeMode="cover"
              />
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'flex-end' }}>
              <Text style={[styles.brandTitle, { color: colors.label }]}>PEC</Text>
              <Text style={[styles.brandSub, { color: colors.accent }]}>verse</Text>
            </View>
          </View>

          <View style={styles.headerActions}>
            <Pressable
              style={[styles.iconCircle, { backgroundColor: colors.cardBackground, borderColor: colors.cardBorder }]}
              onPress={() => Alert.alert('Notifications', 'You are up to date with all notices.')}
            >
              <Ionicons name="notifications-outline" size={20} color={colors.label} />
              <View style={styles.unreadDot} />
            </Pressable>

            <Pressable
              style={[styles.avatarCircle, { backgroundColor: colors.accent + '20', borderColor: colors.accent + '50' }]}
              onPress={() => router.push('/(tabs)/profile')}
            >
              <Text style={[styles.avatarText, { color: colors.accent }]}>
                {user?.name ? user.name.trim().split(/\s+/).map(n => n?.[0] || '').join('').substring(0, 2).toUpperCase() : 'ME'}
              </Text>
            </Pressable>
          </View>
        </View>

        {/* Greeting Banner */}
        <View style={styles.greetingSection}>
          <Text style={[styles.greetingText, { color: colors.label }]}>
            {getGreeting()} {user?.name ? user.name.split(' ')[0] : 'Student'}
          </Text>
        </View>

        {/* Universal Search Bar */}
        <View style={[styles.searchBar, { backgroundColor: colors.cardBackground, borderColor: colors.cardBorder }]}>
          <Ionicons name="search" size={18} color={colors.tertiaryLabel} style={{ marginRight: 8 }} />
          <TextInput
            style={[styles.searchInput, { color: colors.label }]}
            placeholder="Search people, notes, events..."
            placeholderTextColor={colors.tertiaryLabel}
          />
          <Ionicons name="options-outline" size={20} color={colors.secondaryLabel} />
        </View>

        {/* Quick Access Grid */}
        <View style={styles.sectionHeaderRow}>
          <Text style={[styles.sectionTitle, { color: colors.label }]}>Quick Access</Text>
          <Text style={[styles.sectionAction, { color: colors.accent }]}>See All</Text>
        </View>

        <View style={styles.quickAccessRow}>
          {QUICK_ACCESS.map((item, index) => (
            <Animated.View key={item.id} entering={FadeInDown.delay(index * 30).springify()} style={styles.quickAccessCol}>
              <Pressable style={styles.quickAccessCard} onPress={() => handleQuickAccess(item)}>
                <View style={[styles.quickIconBox, { backgroundColor: item.color + '15', borderColor: item.color + '30' }]}>
                  <Ionicons name={item.icon as any} size={22} color={item.color} />
                </View>
                <Text style={[styles.quickAccessTitle, { color: colors.secondaryLabel }]}>{item.title}</Text>
              </Pressable>
            </Animated.View>
          ))}
        </View>

        {/* Help Juniors Banner */}
        <Pressable
          style={[styles.helpJuniorsBanner, { backgroundColor: 'rgba(59, 130, 246, 0.1)', borderColor: 'rgba(59, 130, 246, 0.3)' }]}
          onPress={() => {
            Haptics.selectionAsync();
            router.push('/(tabs)/dashboard/help-juniors' as any);
          }}
        >
          <View style={styles.helpJuniorsIconBox}>
            <Ionicons name="chatbubbles" size={24} color={colors.accent} />
          </View>
          <View style={styles.helpJuniorsTextGroup}>
            <Text style={[styles.helpJuniorsTitle, { color: colors.label }]}>Help the Freshers!</Text>
            <Text style={[styles.helpJuniorsSub, { color: colors.secondaryLabel }]}>Answer pending questions from the new batch</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={colors.accent} />
        </Pressable>

        {/* Today's Schedule Card */}
        <View style={[styles.scheduleCard, { backgroundColor: colors.cardBackground, borderColor: colors.cardBorder }]}>
          <View style={styles.scheduleHeader}>
            <Text style={[styles.scheduleTitle, { color: colors.label }]}>Today's Schedule</Text>
            <Text style={[styles.scheduleDate, { color: colors.secondaryLabel }]}>{formattedDate}</Text>
          </View>

          {isTimetableLoading ? (
            <View style={{ paddingVertical: 10 }}>
              <SkeletonCard type="class" />
            </View>
          ) : activeHoliday ? (
            <View style={[styles.holidayBox, { backgroundColor: colors.accent + '10' }]}>
              <Text style={styles.holidayEmoji}>🌴</Text>
              <Text style={[styles.holidayTitle, { color: colors.accent }]}>Holiday Declared!</Text>
              <Text style={[styles.holidayReason, { color: colors.label }]}>{activeHoliday.reason || 'No classes today. Enjoy your day off!'}</Text>
            </View>
          ) : (todayClasses || []).length === 0 ? (
            <View style={styles.emptyBox}>
              <Text style={[styles.emptyText, { color: colors.secondaryLabel }]}>No classes scheduled for today.</Text>
            </View>
          ) : (
            <View style={styles.timelineList}>
              {(() => {
                const activeOrNext = (todayClasses || []).filter(c => c.isActive || c.isNext);
                if (activeOrNext.length === 0) {
                  return (
                    <View style={styles.emptyBox}>
                      <Text style={[styles.emptyText, { color: colors.secondaryLabel }]}>All classes are done for today! 🎉</Text>
                    </View>
                  );
                }
                return activeOrNext.map((cls, idx) => {
                  const colorsArr = ['#10B981', '#3B82F6', '#F59E0B', '#8B5CF6'];
                  const accentColor = colorsArr[idx % colorsArr.length];
                  return (
                    <View key={cls.id} style={styles.timelineItem}>
                      <Text style={[styles.timeTag, { color: colors.secondaryLabel }]}>{cls.start_time.substring(0, 5)}</Text>
                      <View style={[styles.timelineLine, { backgroundColor: accentColor }]} />
                      <View style={styles.classDetails}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                          <Text style={[styles.subjectName, { color: colors.label }]} numberOfLines={1}>{cls.subject}</Text>
                          {cls.isActive && (
                            <View style={{ backgroundColor: '#EF4444', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 }}>
                              <Text style={{ color: 'white', fontSize: 9, fontWeight: '800' }}>LIVE</Text>
                            </View>
                          )}
                          {cls.isNext && !cls.isActive && (
                            <View style={{ backgroundColor: '#F59E0B', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 }}>
                              <Text style={{ color: 'white', fontSize: 9, fontWeight: '800' }}>UP NEXT</Text>
                            </View>
                          )}
                        </View>
                        <Text style={[styles.teacherName, { color: colors.secondaryLabel }]}>{cls.teacher || 'Course Faculty'}</Text>
                      </View>
                      <View style={[styles.roomBadge, { backgroundColor: colors.secondarySystemBackground, borderColor: colors.cardBorder }]}>
                        <Text style={[styles.roomText, { color: colors.secondaryLabel }]}>{cls.room || 'TBA'}</Text>
                      </View>
                    </View>
                  );
                });
              })()}
            </View>
          )}

          <Pressable
            style={[styles.viewFullTimetableBtn, { borderTopColor: colors.separator }]}
            onPress={() => router.push('/(tabs)/timetable')}
          >
            <Text style={[styles.viewFullText, { color: colors.accent }]}>View Full Timetable</Text>
            <Ionicons name="chevron-forward" size={16} color={colors.accent} />
          </Pressable>
        </View>

        {/* Upcoming Event / Spotlight Card (Temporarily Commented Out)
        <View style={styles.sectionHeaderRow}>
          <Text style={[styles.sectionTitle, { color: colors.label }]}>Upcoming Event</Text>
          <Pressable onPress={() => {
            Haptics.selectionAsync();
            router.push('/orientation/(tabs)/explore' as any);
          }}>
            <Text style={[styles.sectionAction, { color: colors.accent }]}>See All</Text>
          </Pressable>
        </View>

        <Pressable
          style={[styles.eventCard, { backgroundColor: colors.cardBackground, borderColor: 'rgba(139, 92, 246, 0.3)' }]}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            router.push('/orientation/(tabs)/explore' as any);
          }}
        >
          <View style={styles.eventIconBox}>
            <Ionicons name="trophy" size={24} color="#8B5CF6" />
          </View>
          <View style={styles.eventDetails}>
            <Text style={[styles.eventHeading, { color: colors.label }]}>CodeRush 4.0</Text>
            <Text style={[styles.eventSub, { color: colors.secondaryLabel }]}>Annual Coding Competition • Cash Prizes</Text>
          </View>
          <View style={[styles.eventDateBadge, { backgroundColor: colors.secondarySystemBackground, borderColor: colors.cardBorder }]}>
            <Text style={[styles.eventDay, { color: colors.label }]}>24</Text>
            <Text style={styles.eventMonth}>MAY</Text>
          </View>
        </Pressable>
        */}

        {/* Mess Menu Widget */}
        <DashboardMessWidget />

        {/* Attendance Bunk Manager Widget */}
        <AttendanceWidget />

        {/* Class Announcements / Notices Widget */}
        {(announcements || []).length > 0 && (
          <>
            <View style={[styles.sectionHeaderRow, { marginTop: 16 }]}>
              <Text style={[styles.sectionTitle, { color: colors.label }]}>Class Notices</Text>
            </View>
            <View style={{ gap: 12, paddingHorizontal: 16 }}>
              {(announcements || []).slice(0, 3).map((ann: any) => (
                <View key={ann.id} style={{ backgroundColor: colors.cardBackground, padding: 16, borderRadius: 16, borderWidth: 1, borderColor: colors.cardBorder }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8, gap: 10 }}>
                    <View style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: colors.accent + '20', alignItems: 'center', justifyContent: 'center' }}>
                      <Ionicons name="notifications" size={18} color={colors.accent} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontSize: 15, fontWeight: '700', color: colors.label }}>{ann.title}</Text>
                      <Text style={{ fontSize: 12, color: colors.secondaryLabel }}>{new Date(ann.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</Text>
                    </View>
                  </View>
                  <Text style={{ fontSize: 14, color: colors.label, lineHeight: 22 }}>
                    {ann.body.replace(/\*\*/g, '')}
                  </Text>
                </View>
              ))}
            </View>
          </>
        )}

        {/* Bottom padding for tab bar */}
        <View style={{ height: 110 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingTop: 54,
    paddingHorizontal: 18,
    gap: 16,
  },
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  crestBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandTitle: {
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  brandSub: {
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  iconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    position: 'relative',
  },
  unreadDot: {
    position: 'absolute',
    top: 9,
    right: 9,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EF4444',
  },
  avatarCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  avatarText: {
    fontSize: 13,
    fontWeight: '800',
  },
  greetingSection: {
    gap: 2,
    marginTop: 4,
  },
  greetingText: {
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  greetingSub: {
    fontSize: 14,
    fontWeight: '500',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 44,
    borderWidth: 1,
    marginTop: 4,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 6,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
  },
  sectionAction: {
    fontSize: 12,
    fontWeight: '600',
  },
  quickAccessRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  quickAccessCol: {
    alignItems: 'center',
    width: '18%',
  },
  quickAccessCard: {
    alignItems: 'center',
    gap: 6,
  },
  quickIconBox: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  quickAccessTitle: {
    fontSize: 11,
    fontWeight: '600',
    textAlign: 'center',
  },
  scheduleCard: {
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    gap: 14,
    marginBottom: 8,
  },
  helpJuniorsBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    marginBottom: 24,
  },
  helpJuniorsIconBox: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(59, 130, 246, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  helpJuniorsTextGroup: {
    flex: 1,
  },
  helpJuniorsTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 2,
  },
  helpJuniorsSub: {
    fontSize: 12,
  },
  scheduleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  scheduleTitle: {
    fontSize: 16,
    fontWeight: '800',
  },
  scheduleDate: {
    fontSize: 12,
    fontWeight: '600',
  },
  timelineList: {
    gap: 12,
  },
  timelineItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeTag: {
    width: 55,
    fontSize: 12,
    fontWeight: '700',
  },
  timelineLine: {
    width: 3,
    height: 36,
    borderRadius: 2,
    marginRight: 12,
  },
  classDetails: {
    flex: 1,
  },
  subjectName: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 2,
  },
  teacherName: {
    fontSize: 12,
  },
  roomBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
  },
  roomText: {
    fontSize: 11,
    fontWeight: '700',
  },
  viewFullTimetableBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 10,
    borderTopWidth: 1,
    gap: 4,
  },
  viewFullText: {
    fontSize: 13,
    fontWeight: '700',
  },
  eventCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
  },
  eventIconBox: {
    width: 46,
    height: 46,
    borderRadius: 14,
    backgroundColor: 'rgba(139, 92, 246, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  eventDetails: {
    flex: 1,
  },
  eventHeading: {
    fontSize: 15,
    fontWeight: '800',
    marginBottom: 2,
  },
  eventSub: {
    fontSize: 12,
  },
  eventDateBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
  },
  eventDay: {
    fontSize: 14,
    fontWeight: '900',
  },
  eventMonth: {
    fontSize: 10,
    fontWeight: '700',
    color: '#8B5CF6',
  },
  holidayBox: {
    alignItems: 'center',
    paddingVertical: 20,
    borderRadius: 14,
  },
  holidayEmoji: {
    fontSize: 32,
    marginBottom: 6,
  },
  holidayTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 2,
  },
  holidayReason: {
    fontSize: 13,
  },
  emptyBox: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 13,
  },
});
