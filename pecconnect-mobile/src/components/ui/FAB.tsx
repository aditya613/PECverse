import React from 'react';
import { StyleSheet, ViewStyle, Pressable } from 'react-native';
import { SymbolView } from 'expo-symbols';
import { colors } from '@/theme/colors';
import { AnimatedPressable } from './AnimatedPressable';
import * as Haptics from 'expo-haptics';

interface FABProps {
  onPress: () => void;
  iconName?: string;
  style?: ViewStyle;
}

export function FAB({ onPress, iconName = 'plus', style }: FABProps) {
  const normalizedIcon = iconName.startsWith('sf:') ? iconName.replace('sf:', '') : iconName;

  return (
    <AnimatedPressable 
      style={[styles.fab, style]} 
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        onPress();
      }}
    >
      <SymbolView name={normalizedIcon as any} style={styles.icon} tintColor="#ffffff" />
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    bottom: 110,
    right: 24,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.accent,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 8,
    zIndex: 100,
  },
  icon: {
    width: 24,
    height: 24,
  },
});
