import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withRepeat, 
  withSequence, 
  withTiming 
} from 'react-native-reanimated';
import { colors } from '@/theme/colors';
import { GlassCard } from '@/components/ui/GlassCard';
import { AnimatedPressable } from '@/components/ui/AnimatedPressable';

export interface MergedClass {
  id: string;
  start_time: string;
  end_time: string;
  subject: string;
  teacher?: string | null;
  room?: string | null;
  status: 'normal' | 'cancelled' | 'rescheduled' | 'extra';
  reason?: string | null;
  isActive?: boolean;
  isNext?: boolean;
}

interface Props {
  data: MergedClass;
  onPress?: (data: MergedClass) => void;
}

export function ClassCard({ data, onPress }: Props) {
  const isCancelled = data.status === 'cancelled';
  const isRescheduled = data.status === 'rescheduled';
  const isExtra = data.status === 'extra';

  // Pulsing animation for active class
  const pulseOpacity = useSharedValue(0.1);

  useEffect(() => {
    if (data.isActive) {
      pulseOpacity.value = withRepeat(
        withSequence(
          withTiming(0.6, { duration: 1000 }),
          withTiming(0.1, { duration: 1000 })
        ),
        -1, // infinite
        true // reverse
      );
    }
  }, [data.isActive]);

  const pulsingStyle = useAnimatedStyle(() => ({
    opacity: pulseOpacity.value,
  }));

  // Extract clean HH:MM string
  const formatTime = (timeStr: string) => {
    if (!timeStr) return '';
    return timeStr.length > 5 ? timeStr.substring(0, 5) : timeStr;
  };

  return (
    <AnimatedPressable onPress={() => onPress?.(data)} scaleTo={0.98}>
      <GlassCard 
        style={[
          styles.card,
          isCancelled && styles.cancelledCard,
          data.isActive && styles.activeCardBase
        ]}
      >
        {/* Animated Glowing Overlay for Active Class */}
        {data.isActive && (
          <Animated.View style={[styles.activeGlowOverlay, pulsingStyle]} pointerEvents="none" />
        )}

        {/* Left vertical status indicator stripe */}
        <View 
          style={[
            styles.verticalStripe,
            isCancelled ? styles.stripeRed : (data.isActive ? styles.stripeGreen : styles.stripeBlue)
          ]} 
        />

        {/* Time Column */}
        <View style={styles.timeColumn}>
          <Text style={[styles.timeText, isCancelled && styles.dimmedText]}>
            {formatTime(data.start_time)}
          </Text>
          <Text style={[styles.timeText, isCancelled && styles.dimmedText]}>
            {formatTime(data.end_time)}
          </Text>
        </View>

        {/* Details Column */}
        <View style={styles.detailsColumn}>
          <View style={styles.headerRow}>
            <Text 
              style={[
                styles.subjectTitle, 
                isCancelled && styles.strikethrough
              ]}
              numberOfLines={3}
            >
              {data.subject}
            </Text>
            {isCancelled && (
              <View style={styles.cancelledBadge}>
                <Text style={styles.cancelledBadgeText}>CANCELLED</Text>
              </View>
            )}
            {data.isActive && !isCancelled && (
              <View style={styles.activeBadge}>
                <Text style={styles.activeBadgeText}>HAPPENING NOW</Text>
              </View>
            )}
          </View>

          {/* Location / Room Tag */}
          {data.room && (
            <Text style={[styles.roomText, isCancelled && styles.dimmedText]}>
              {data.room}
            </Text>
          )}

          {/* Teacher or Note */}
          {data.teacher && !isCancelled && (
            <Text style={styles.teacherText}>{data.teacher}</Text>
          )}

          {isCancelled && data.reason && (
            <Text style={styles.reasonText}>Note: {data.reason}</Text>
          )}
        </View>
      </GlassCard>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 14,
    backgroundColor: colors.cardBackground,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  cancelledCard: {
    backgroundColor: 'rgba(239, 68, 68, 0.04)',
    borderColor: 'rgba(239, 68, 68, 0.2)',
  },
  activeCardBase: {
    borderColor: colors.accent,
    backgroundColor: 'rgba(59, 130, 246, 0.08)',
    overflow: 'hidden', // so the overlay doesn't bleed out
  },
  activeGlowOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(59, 130, 246, 0.15)',
    borderWidth: 2,
    borderColor: 'rgba(59, 130, 246, 0.8)',
    borderRadius: 20,
  },
  verticalStripe: {
    width: 4,
    height: '80%',
    borderRadius: 2,
  },
  stripeBlue: {
    backgroundColor: colors.accent,
  },
  stripeGreen: {
    backgroundColor: colors.success,
  },
  stripeRed: {
    backgroundColor: colors.destructive,
  },
  timeColumn: {
    justifyContent: 'center',
    alignItems: 'flex-start',
    width: 48,
    gap: 4,
  },
  timeText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.label,
    fontVariant: ['tabular-nums'],
  },
  detailsColumn: {
    flex: 1,
    gap: 3,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 8,
  },
  subjectTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.label,
    flex: 1,
  },
  strikethrough: {
    textDecorationLine: 'line-through',
    color: colors.secondaryLabel,
  },
  roomText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#34D399', // Emerald accent for location
  },
  teacherText: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.secondaryLabel,
  },
  dimmedText: {
    color: colors.tertiaryLabel,
  },
  cancelledBadge: {
    backgroundColor: colors.destructiveBg,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  cancelledBadgeText: {
    color: colors.destructive,
    fontSize: 10,
    fontWeight: '800',
  },
  activeBadge: {
    backgroundColor: colors.successBg,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  activeBadgeText: {
    color: colors.success,
    fontSize: 10,
    fontWeight: '800',
  },
  reasonText: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.destructive,
    marginTop: 2,
  },
});
