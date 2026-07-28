import React from 'react';
import { ViewStyle, StyleSheet, ViewProps, View, Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import { colors } from '@/theme/colors';

interface GlassCardProps extends ViewProps {
  children: React.ReactNode;
  intensity?: number;
  elevated?: boolean;
}

export function GlassCard({ children, style, intensity = 30, elevated = false, ...props }: GlassCardProps) {
  return (
    <View style={styles.shadowWrapper}>
      <View 
        style={[
          styles.card, 
          elevated && styles.elevatedCard,
          style
        ]} 
        {...props}
      >
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  shadowWrapper: {
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.25,
        shadowRadius: 16,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  card: {
    backgroundColor: colors.cardBackground,
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    overflow: 'hidden',
  },
  elevatedCard: {
    backgroundColor: colors.cardBackgroundElevated,
    borderColor: colors.glowBorder,
  },
});
