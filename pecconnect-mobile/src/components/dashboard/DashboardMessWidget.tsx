import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { colors } from '@/theme/colors';
import { useMessStore } from '@/stores/useMessStore';
import { useMesses } from '@/hooks/useMess';
import { useRouter } from 'expo-router';
import { AnimatedPressable } from '@/components/ui/AnimatedPressable';
import { GlassCard } from '@/components/ui/GlassCard';

export function DashboardMessWidget() {
  const router = useRouter();
  const { selectedMessId, loadMessId } = useMessStore();
  
  useEffect(() => {
    loadMessId();
  }, []);

  const { data: messes } = useMesses();
  const selectedMessName = messes?.find(m => m.id === selectedMessId)?.name || 'Shivalik Hostel';

  return (
    <View style={styles.container}>
      <AnimatedPressable onPress={() => router.push('/mess')} scaleTo={0.98}>
        <GlassCard style={styles.card}>
          <View style={styles.headerRow}>
            <Text style={styles.titleText}>
              Mess Menu <Text style={styles.subtext}>- {selectedMessName}</Text>
            </Text>
            <Text style={styles.arrowText}>›</Text>
          </View>

          <Text style={{ color: colors.secondaryLabel, fontSize: 13 }}>
            Tap to view today's complete menu.
          </Text>
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
    gap: 14,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  titleText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.label,
  },
  subtext: {
    color: colors.secondaryLabel,
    fontWeight: '500',
    fontSize: 14,
  },
  arrowText: {
    fontSize: 22,
    color: colors.secondaryLabel,
    fontWeight: '400',
  },
  mealRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  },
  mealPill: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderRadius: 16,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
    gap: 6,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.cardBackgroundElevated,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  mealEmoji: {
    fontSize: 20,
  },
  mealName: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.secondaryLabel,
  },
});
