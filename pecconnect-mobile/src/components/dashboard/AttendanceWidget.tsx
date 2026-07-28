import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '@/theme/colors';
import { useRouter } from 'expo-router';
import { useAttendance } from '@/hooks/useAttendance';
import { AnimatedPressable } from '@/components/ui/AnimatedPressable';
import { GlassCard } from '@/components/ui/GlassCard';

export function AttendanceWidget() {
  const router = useRouter();
  const { subjects } = useAttendance();

  let totalAttended = 0;
  let totalClasses = 0;

  if (subjects && subjects.length > 0) {
    subjects.forEach(sub => {
      totalAttended += sub.attended_classes;
      totalClasses += (sub.attended_classes + sub.bunked_classes);
    });
  }

  const aggregatePercentage = totalClasses === 0 ? 0 : Math.round((totalAttended / totalClasses) * 100);
  const safeBunks = Math.max(0, Math.floor((totalAttended - 0.75 * totalClasses) / 0.75));
  const classesToAttend = Math.max(0, 3 * totalClasses - 4 * totalAttended);

  return (
    <View style={styles.container}>
      <AnimatedPressable onPress={() => router.push('/attendance')} scaleTo={0.98}>
        <GlassCard style={styles.card}>
          <Text style={styles.sectionHeaderTitle}>Attendance Manager</Text>
          
          <View style={styles.contentRow}>
            {/* Left Arc Progress Badge */}
            <View style={styles.gaugeBox}>
              <View style={[styles.ringWrapper, { borderColor: totalClasses === 0 ? colors.separator : (aggregatePercentage >= 75 ? colors.accent : colors.destructive) }]}>
                <Text style={styles.percentageNum}>{aggregatePercentage}%</Text>
                <Text style={styles.percentageLabel}>Overall{'\n'}Aggregate</Text>
              </View>
            </View>

            {/* Right Status Information */}
            <View style={styles.infoBox}>
              {totalClasses === 0 ? (
                <>
                  <Text style={[styles.statusBadgeText, { color: colors.secondaryLabel }]}>No Data</Text>
                  <Text style={styles.statusDescription}>Add subjects to track attendance.</Text>
                </>
              ) : aggregatePercentage >= 75 ? (
                <>
                  <Text style={styles.statusBadgeText}>On track! 🎉</Text>
                  <Text style={styles.statusDescription}>
                    You can safely miss {safeBunks} class{safeBunks !== 1 ? 'es' : ''}.
                  </Text>
                </>
              ) : (
                <>
                  <Text style={[styles.statusBadgeText, { color: colors.destructive }]}>Action needed ⚠️</Text>
                  <Text style={styles.statusDescription}>
                    You must attend the next {classesToAttend} class{classesToAttend !== 1 ? 'es' : ''} to reach 75%.
                  </Text>
                </>
              )}
            </View>
          </View>
        </GlassCard>
      </AnimatedPressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  card: {
    padding: 16,
    gap: 12,
  },
  sectionHeaderTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.label,
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  gaugeBox: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  ringWrapper: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 5,
    borderColor: colors.accent,
    backgroundColor: 'rgba(59, 130, 246, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  percentageNum: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.label,
    fontVariant: ['tabular-nums'],
  },
  percentageLabel: {
    fontSize: 8,
    fontWeight: '600',
    color: colors.secondaryLabel,
    textAlign: 'center',
  },
  infoBox: {
    flex: 1,
    gap: 4,
  },
  statusBadgeText: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.success,
  },
  statusDescription: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.secondaryLabel,
    lineHeight: 18,
  },
});
