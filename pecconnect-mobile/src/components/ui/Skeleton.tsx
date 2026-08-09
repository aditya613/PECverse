import React, { useEffect } from 'react';
import { View, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  withDelay,
} from 'react-native-reanimated';
import { colors } from '@/theme/colors';

interface SkeletonProps {
  style?: StyleProp<ViewStyle>;
  delay?: number;
}

export function Skeleton({ style, delay = 0 }: SkeletonProps) {
  const opacity = useSharedValue(0.3);

  useEffect(() => {
    opacity.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(0.7, { duration: 800 }),
          withTiming(0.3, { duration: 800 })
        ),
        -1, // infinite
        true // reverse
      )
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <Animated.View style={[styles.skeleton, animatedStyle, style]} />
  );
}

const styles = StyleSheet.create({
  skeleton: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 8,
  },
});
