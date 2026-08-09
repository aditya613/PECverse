import React from 'react';
import { View, StyleSheet } from 'react-native';
import { colors } from '@/theme/colors';
import { GlassCard } from '@/components/ui/GlassCard';
import { Skeleton } from './Skeleton';

interface Props {
  type?: 'class' | 'announcement';
}

export function SkeletonCard({ type = 'class' }: Props) {
  if (type === 'announcement') {
    return (
      <GlassCard style={styles.card}>
        <View style={styles.headerRow}>
          <Skeleton style={styles.avatar} delay={0} />
          <View style={styles.detailsColumn}>
            <Skeleton style={styles.titleLine} delay={100} />
            <Skeleton style={styles.subtitleLine} delay={200} />
          </View>
        </View>
        <View style={styles.bodyColumn}>
          <Skeleton style={styles.textLineFull} delay={300} />
          <Skeleton style={styles.textLineMedium} delay={400} />
        </View>
      </GlassCard>
    );
  }

  // Default: Class card skeleton
  return (
    <GlassCard style={styles.card}>
      <View style={styles.timeColumn}>
        <Skeleton style={styles.timeBlock} delay={0} />
        <Skeleton style={styles.timeBlock} delay={100} />
      </View>
      <View style={styles.detailsColumn}>
        <Skeleton style={styles.titleLine} delay={200} />
        <Skeleton style={styles.subtitleLine} delay={300} />
        <Skeleton style={styles.subtitleLineShort} delay={400} />
      </View>
    </GlassCard>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 16,
    gap: 14,
    backgroundColor: colors.cardBackground,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    width: '100%',
  },
  bodyColumn: {
    width: '100%',
    marginTop: 12,
    gap: 8,
  },
  timeColumn: {
    justifyContent: 'center',
    alignItems: 'flex-start',
    width: 48,
    gap: 8,
  },
  detailsColumn: {
    flex: 1,
    gap: 8,
    justifyContent: 'center',
  },
  // Skeleton Pieces
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  timeBlock: {
    width: 40,
    height: 14,
    borderRadius: 4,
  },
  titleLine: {
    width: '70%',
    height: 18,
    borderRadius: 6,
  },
  subtitleLine: {
    width: '50%',
    height: 14,
    borderRadius: 4,
  },
  subtitleLineShort: {
    width: '30%',
    height: 14,
    borderRadius: 4,
  },
  textLineFull: {
    width: '90%',
    height: 14,
    borderRadius: 4,
  },
  textLineMedium: {
    width: '60%',
    height: 14,
    borderRadius: 4,
  },
});
