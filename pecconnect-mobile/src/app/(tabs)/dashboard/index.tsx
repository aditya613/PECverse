import React from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, RefreshControl } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/utils/api';
import { colors } from '@/theme/colors';
import { GlassCard } from '@/components/ui/GlassCard';
import { AnimatedPressable } from '@/components/ui/AnimatedPressable';
import { FAB } from '@/components/ui/FAB';
import { useAuthStore } from '@/stores/useAuthStore';
import { useRouter } from 'expo-router';
import { useTimetable } from '@/hooks/useTimetable';
import { ClassCard } from '@/components/timetable/ClassCard';
import { DashboardMessWidget } from '@/components/dashboard/DashboardMessWidget';
import { AttendanceWidget } from '@/components/dashboard/AttendanceWidget';
import { SkeletonCard } from '@/components/ui/SkeletonCard';
import { DashboardNextClassWidget } from '@/components/dashboard/DashboardNextClassWidget';

import { LinearGradient } from 'expo-linear-gradient';

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

export default function DashboardScreen() {
  const user = useAuthStore(state => state.user);
  const router = useRouter();

  // Fetch real announcements from backend API
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

  const getGreeting = () => {
    const hours = today.getHours();
    if (hours < 12) return 'Good morning,';
    if (hours < 17) return 'Good afternoon,';
    return 'Good evening,';
  };

  // Fetch real timetable classes for today from API hook
  const { classes: todayClasses, isLoading: isTimetableLoading } = useTimetable(todayStr);

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#090D16', '#1A233A', '#0B132B']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={refetch}
            tintColor={colors.accent}
          />
        }
      >
        {/* Top Header Row with Greeting & Profile Pill */}
        <View style={styles.headerRow}>
          <View style={styles.greetingGroup}>
            <Text style={styles.greetingText}>{getGreeting()}</Text>
            <Text style={styles.nameText}>
              {user?.name ? user.name.split(' ')[0] : 'Student'} 👋
            </Text>
            <Text style={styles.studentMetaText}>
              {user?.roll_no || 'Student'} • {user?.courseClass?.branch?.code || 'PEC'} • {user?.role === 'cr' ? 'CR' : 'Student'}
            </Text>
          </View>
          <AnimatedPressable onPress={() => router.push('/profile' as any)} scaleTo={0.92}>
            <View style={styles.avatarPill}>
              <Text style={styles.avatarPillText}>
                {user?.name ? user.name.split(' ').map(n => n[0]).join('').substring(0, 2) : 'ME'}
              </Text>
            </View>
          </AnimatedPressable>
        </View>

        {/* LIVE COUNTDOWN WIDGET */}
        {!isTimetableLoading && todayClasses.length > 0 && (
          <DashboardNextClassWidget todayClasses={todayClasses} />
        )}

        {/* TODAY'S CLASSES CARD CONTAINER */}
        <GlassCard style={styles.scheduleCardWrapper}>
          <View style={styles.scheduleCardHeader}>
            <View>
              <Text style={styles.scheduleTitle}>Today's Classes</Text>
              <Text style={styles.scheduleSubtitle}>
                {isTimetableLoading ? 'Loading...' : `${todayClasses.length} Classes scheduled`}
              </Text>
            </View>
            <AnimatedPressable onPress={() => router.push('/(tabs)/timetable')} scaleTo={0.94}>
              <View style={styles.viewScheduleBtn}>
                <Text style={styles.viewScheduleBtnText}>View Schedule</Text>
              </View>
            </AnimatedPressable>
          </View>

          {isTimetableLoading ? (
            <View style={styles.classesVerticalList}>
              <SkeletonCard type="class" />
              <SkeletonCard type="class" />
            </View>
          ) : todayClasses.length === 0 ? (
            <View style={styles.emptyBox}>
              <Text style={styles.emptyText}>No classes scheduled for today! 🎉</Text>
            </View>
          ) : (
            <View style={styles.classesVerticalList}>
              {todayClasses.map((cls) => (
                <ClassCard key={cls.id} data={cls} />
              ))}
            </View>
          )}
        </GlassCard>

        {/* MESS MENU WIDGET (Connected to backend API store) */}
        <DashboardMessWidget />

        {/* BUNK MANAGER WIDGET (Connected to backend API hook) */}
        <AttendanceWidget />

        {/* LATEST UPDATES / FEED */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Latest Updates</Text>
        </View>

        {/* Real Announcements Feed */}
        <View style={styles.feedContainer}>
          {isLoading && !isRefetching ? (
            <>
              <SkeletonCard type="announcement" />
              <SkeletonCard type="announcement" />
            </>
          ) : !announcements || announcements.length === 0 ? (
            <GlassCard style={styles.emptyBox}>
              <Text style={styles.emptyText}>No announcements posted yet.</Text>
            </GlassCard>
          ) : (
            announcements.map((item) => (
              <GlassCard key={item.id} style={styles.feedPostCard}>
                <View style={styles.feedPostHeader}>
                  <View style={styles.authorGroup}>
                    <View style={styles.authorAvatar}>
                      <Text style={styles.authorAvatarText}>{item.author.name[0]}</Text>
                    </View>
                    <View>
                      <Text style={styles.authorName}>{item.author.name}</Text>
                      <Text style={styles.postTimestamp}>
                        {new Date(item.created_at).toLocaleDateString(undefined, {
                          month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                        })}
                      </Text>
                    </View>
                  </View>
                </View>

                <View style={styles.postContentBox}>
                  <Text style={styles.postTitleText}>{item.title}</Text>
                  <Text style={styles.postDetailText}>{item.body}</Text>
                </View>
              </GlassCard>
            ))
          )}
        </View>

        {/* Bottom padding */}
        <View style={{ height: 90 }} />
      </ScrollView>

      {/* FAB for CRs */}
      {(user?.role === 'cr' || user?.role === 'superadmin') && (
        <FAB onPress={() => router.push('/post-announcement')} />
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
    paddingHorizontal: 18,
    gap: 16,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  greetingGroup: {
    gap: 2,
  },
  greetingText: {
    fontSize: 15,
    fontWeight: '500',
    color: colors.secondaryLabel,
  },
  nameText: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.label,
    letterSpacing: -0.5,
  },
  studentMetaText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.tertiaryLabel,
    marginTop: 4,
  },
  avatarPill: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.cardBackgroundElevated,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarPillText: {
    color: colors.label,
    fontSize: 15,
    fontWeight: '700',
  },
  scheduleCardWrapper: {
    padding: 16,
    gap: 14,
  },
  scheduleCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  scheduleTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.label,
  },
  scheduleSubtitle: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.secondaryLabel,
    marginTop: 2,
  },
  viewScheduleBtn: {
    backgroundColor: 'rgba(59, 130, 246, 0.15)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  viewScheduleBtnText: {
    color: colors.accent,
    fontSize: 12,
    fontWeight: '700',
  },
  classesVerticalList: {
    gap: 10,
  },
  emptyBox: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: colors.secondaryLabel,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
    marginBottom: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.label,
  },
  viewAllText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.accent,
  },
  feedContainer: {
    gap: 12,
  },
  feedPostCard: {
    padding: 16,
    gap: 12,
  },
  feedPostHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  authorGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  authorAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  authorAvatarText: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '700',
  },
  authorName: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.label,
  },
  postTimestamp: {
    fontSize: 11,
    fontWeight: '500',
    color: colors.tertiaryLabel,
  },
  postContentBox: {
    gap: 6,
  },
  postTitleText: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.label,
  },
  postDetailText: {
    fontSize: 13,
    color: colors.secondaryLabel,
    lineHeight: 18,
  },
});
