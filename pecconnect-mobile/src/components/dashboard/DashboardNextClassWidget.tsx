import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '@/theme/colors';
import { GlassCard } from '@/components/ui/GlassCard';
import { SymbolView } from 'expo-symbols';
import { MergedClass } from '@/components/timetable/ClassCard';
import Animated, { FadeIn } from 'react-native-reanimated';

interface Props {
  todayClasses: MergedClass[];
}

export function DashboardNextClassWidget({ todayClasses }: Props) {
  const [minutesRemaining, setMinutesRemaining] = useState<number | null>(null);
  const [nextClass, setNextClass] = useState<MergedClass | null>(null);

  useEffect(() => {
    // Find the next class
    const upcoming = todayClasses.find(c => c.isNext);
    setNextClass(upcoming || null);

    if (!upcoming) {
      setMinutesRemaining(null);
      return;
    }

    const calculateTime = () => {
      const now = new Date();
      const currentMinutes = now.getHours() * 60 + now.getMinutes();
      
      if (!upcoming?.start_time) {
        setMinutesRemaining(null);
        return;
      }

      const [startH, startM] = (upcoming.start_time || '0:0').split(':').map(Number);
      const startMinutes = (startH || 0) * 60 + (startM || 0);

      const diff = startMinutes - currentMinutes;
      setMinutesRemaining(diff > 0 ? diff : 0);
    };

    // Calculate immediately
    calculateTime();

    // Update every minute
    const interval = setInterval(calculateTime, 60000);
    return () => clearInterval(interval);
  }, [todayClasses]);

  if (!nextClass || minutesRemaining === null || minutesRemaining > 120) {
    // Don't show if there's no next class, or if it's more than 2 hours away to avoid clutter
    return null;
  }

  return (
    <Animated.View entering={FadeIn}>
      <GlassCard style={styles.card}>
        <View style={styles.iconContainer}>
          <SymbolView name="timer" tintColor={colors.accent} style={styles.icon} />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.titleText}>Next Class in {minutesRemaining} min{minutesRemaining !== 1 ? 's' : ''}</Text>
          <Text style={styles.subjectText} numberOfLines={1}>{nextClass.subject}</Text>
          {nextClass.room && (
            <Text style={styles.roomText}>{nextClass.room}</Text>
          )}
        </View>
      </GlassCard>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 16,
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    borderColor: 'rgba(59, 130, 246, 0.3)',
    borderRadius: 20,
    borderWidth: 1,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(59, 130, 246, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    width: 24,
    height: 24,
  },
  textContainer: {
    flex: 1,
    gap: 2,
  },
  titleText: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.label,
  },
  subjectText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.secondaryLabel,
  },
  roomText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#34D399',
  },
});
