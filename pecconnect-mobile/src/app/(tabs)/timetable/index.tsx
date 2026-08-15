import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, RefreshControl, Alert } from 'react-native';
import { colors } from '@/theme/colors';
import { useAuthStore } from '@/stores/useAuthStore';
import { DateRibbon } from '@/components/timetable/DateRibbon';
import { ClassCard, MergedClass } from '@/components/timetable/ClassCard';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import { api } from '@/utils/api';
import { useTimetable } from '@/hooks/useTimetable';
import { AnimatedPressable } from '@/components/ui/AnimatedPressable';
import { SkeletonCard } from '@/components/ui/SkeletonCard';

export default function TimetableScreen() {
  const user = useAuthStore(state => state.user);
  const router = useRouter();

  // Generate date list for current week
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  const initialDate = `${year}-${month}-${day}`;

  const [selectedDate, setSelectedDate] = useState(initialDate);

  // Generate 21 days (3 days ago + today + 17 days ahead)
  const weekDates = Array.from({ length: 21 }, (_, i) => {
    const d = new Date();
    d.setDate(today.getDate() - 3 + i); // Start from 3 days ago

    // Construct date string using local time to prevent UTC timezone shifts
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const dNum = String(d.getDate()).padStart(2, '0');
    const dateStr = `${y}-${m}-${dNum}`;

    const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
    const dayNum = d.getDate();
    return { dayName, dayNum, fullDate: dateStr };
  });

  const queryClient = useQueryClient();
  const { classes, activeHoliday, isLoading, isRefetching, refetch } = useTimetable(selectedDate);
  const isCrOrAdmin = user?.role === 'cr' || user?.role === 'superadmin';

  const exceptionMutation = useMutation({
    mutationFn: async (data: any) => {
      return await api.post('/timetables/exceptions', data);
    },
    onSuccess: () => {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      queryClient.invalidateQueries({ queryKey: ['timetables'] });
    },
    onError: (err: any) => {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert('Error', err.response?.data?.message || 'Failed to update exception');
    }
  });

  const deleteTimetableMutation = useMutation({
    mutationFn: async (id: number) => {
      return await api.delete(`/timetables/${id}`);
    },
    onSuccess: () => {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      queryClient.invalidateQueries({ queryKey: ['timetables'] });
    },
    onError: (err: any) => {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert('Error', err.response?.data?.message || 'Failed to delete class permanently');
    }
  });

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

  const selectedDateObj = new Date(selectedDate + 'T12:00:00');
  const formattedDayTitle = selectedDateObj.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric'
  });

  return (
    <View style={styles.container}>
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor={colors.accent} />}
      >
        {/* Header Bar */}
        <View style={styles.headerRow}>
          <Text style={styles.headerTitle}>Timetable</Text>
          <View style={styles.headerIconsRow}>
            <View style={styles.iconCircle}>
              <Text style={styles.headerIconEmoji}>📅</Text>
            </View>
          </View>
        </View>

        {/* Date Ribbon Horizontal Capsule Bar */}
        <DateRibbon
          dates={weekDates}
          selectedDate={selectedDate}
          todayDate={initialDate}
          onSelectDate={setSelectedDate}
        />

        {/* Schedule List Section */}
        <View style={styles.scheduleSection}>
          <Text style={styles.dayTitleText}>{formattedDayTitle}</Text>

          {isLoading && !isRefetching ? (
            <View style={styles.classesList}>
              <SkeletonCard type="class" />
              <SkeletonCard type="class" />
              <SkeletonCard type="class" />
              <SkeletonCard type="class" />
            </View>
          ) : activeHoliday ? (
            <View style={styles.holidayContainer}>
              <Text style={styles.holidayEmoji}>🌴</Text>
              <Text style={styles.holidayTitle}>Holiday Declared!</Text>
              <Text style={styles.holidayReason}>{activeHoliday.reason || 'No classes today. Enjoy your day off!'}</Text>
            </View>
          ) : classes.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No classes scheduled for this day.</Text>
            </View>
          ) : (
            <View style={styles.classesList}>
              {classes.map((cls) => (
                <ClassCard key={cls.id} data={cls} onPress={handleClassPress} />
              ))}
            </View>
          )}
        </View>

        {/* Bottom padding for tab bar */}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Floating Action Button for CRs */}
      {isCrOrAdmin && (
        <View style={styles.fabPositionWrapper}>
          <AnimatedPressable
            onPress={() => router.push('/manage-timetable')}
            scaleTo={0.92}
          >
            <View style={styles.suggestPillBtn}>
              <Text style={styles.plusSymbol}>+</Text>
              <Text style={styles.suggestBtnText}>Add</Text>
            </View>
          </AnimatedPressable>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.systemBackground,
  },
  contentContainer: {
    paddingTop: 54,
    gap: 8,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 4,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.label,
    letterSpacing: -0.5,
  },
  headerIconsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.cardBackground,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  headerIconEmoji: {
    fontSize: 14,
  },
  scheduleSection: {
    paddingHorizontal: 20,
    gap: 12,
    marginTop: 8,
  },
  dayTitleText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.label,
    marginBottom: 4,
  },
  classesList: {
    gap: 10,
  },
  emptyContainer: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 15,
    color: colors.secondaryLabel,
  },
  holidayContainer: {
    paddingVertical: 40,
    alignItems: 'center',
    backgroundColor: 'rgba(59, 130, 246, 0.05)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.2)',
    marginTop: 20,
  },
  holidayEmoji: {
    fontSize: 48,
    marginBottom: 16,
  },
  holidayTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.accent,
    marginBottom: 8,
  },
  holidayReason: {
    fontSize: 15,
    color: colors.label,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  fabPositionWrapper: {
    position: 'absolute',
    bottom: 90,
    right: 20,
  },
  suggestPillBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.accent,
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 24,
    gap: 6,
    shadowColor: colors.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 6,
  },
  plusSymbol: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '800',
  },
  suggestBtnText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '700',
  },
});
