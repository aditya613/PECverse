import React from 'react';
import { ViewStyle, StyleSheet, ViewProps, View, Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import { colors } from '@/theme/colors';

interface GlassCardProps extends ViewProps {
  children: React.ReactNode;
  intensity?: number;
  elevated?: boolean;
}

export function GlassCard({ children, style, intensity = 40, elevated = false, ...props }: GlassCardProps) {
  return (
    <View style={styles.shadowWrapper}>
      <BlurView 
        intensity={intensity}
        tint="dark"
        style={[
          styles.card, 
          elevated && styles.elevatedCard,
          style
        ]} 
        {...props}
      >
        {children}
      </BlurView>
    </View>
  );
}

const styles = StyleSheet.create({
  shadowWrapper: {
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.35,
        shadowRadius: 20,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  card: {
    backgroundColor: colors.glassBackground, // Translucent glass surface
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: colors.glassBorder, // Ultra-thin frosted border
    overflow: 'hidden',
  },
  elevatedCard: {
    backgroundColor: 'rgba(26, 38, 61, 0.65)',
    borderColor: colors.glowBorder,
  },
});
