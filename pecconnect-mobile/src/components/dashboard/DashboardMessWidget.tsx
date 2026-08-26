import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { colors } from '@/theme/colors';
import { useMessStore } from '@/stores/useMessStore';
import { useMesses, useMessMenu } from '@/hooks/useMess';
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
  const { data: menu, isLoading } = useMessMenu(selectedMessId);
  
  const selectedMessName = messes?.find(m => m.id === selectedMessId)?.name || 'Shivalik Hostel';

  const todayJs = new Date().getDay();
  const todayBackend = todayJs === 0 ? 7 : todayJs;
  
  const todayMenu = React.useMemo(() => {
    if (!menu) return null;
    return menu.find(m => m.day_of_week === todayBackend);
  }, [menu, todayBackend]);

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

          {isLoading ? (
            <Text style={{ color: colors.secondaryLabel, fontSize: 13 }}>Loading today's menu...</Text>
          ) : todayMenu ? (
            <Text style={{ color: colors.label, fontSize: 14, lineHeight: 22 }} numberOfLines={3}>
              {todayMenu.items}
            </Text>
          ) : (
            <Text style={{ color: colors.secondaryLabel, fontSize: 13 }}>
              Tap to view today's complete menu.
            </Text>
          )}
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
