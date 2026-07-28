import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '@/theme/colors';

interface RadialProgressGaugeProps {
  percentage: number;
  size?: number;
  strokeWidth?: number;
  subtitle?: string;
  statusText?: string;
}

export function RadialProgressGauge({
  percentage,
  size = 140,
  strokeWidth = 10,
  subtitle = 'Overall Aggregate',
  statusText,
}: RadialProgressGaugeProps) {
  // Determine color based on threshold
  const getGaugeColor = (pct: number) => {
    if (pct >= 85) return colors.accent;
    if (pct >= 75) return colors.warning;
    return colors.destructive;
  };

  const gaugeColor = getGaugeColor(percentage);

  return (
    <View style={styles.container}>
      <View style={[styles.gaugeContainer, { width: size, height: size, borderRadius: size / 2 }]}>
        {/* Outer track circle ring styling */}
        <View 
          style={[
            styles.outerRing, 
            { 
              width: size, 
              height: size, 
              borderRadius: size / 2, 
              borderWidth: strokeWidth, 
              borderColor: 'rgba(59, 130, 246, 0.15)' 
            }
          ]} 
        />
        {/* Animated accent arc ring styling */}
        <View 
          style={[
            styles.activeArc, 
            { 
              width: size, 
              height: size, 
              borderRadius: size / 2, 
              borderWidth: strokeWidth, 
              borderColor: gaugeColor,
              borderLeftColor: 'transparent',
              borderBottomColor: 'transparent',
            }
          ]} 
        />
        
        {/* Inner Content */}
        <View style={styles.innerContent}>
          <Text style={styles.percentageText}>{percentage}%</Text>
          <Text style={styles.subtitleText}>{subtitle}</Text>
        </View>
      </View>

      {statusText && (
        <View style={styles.statusContainer}>
          <Text style={styles.statusText}>{statusText}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  gaugeContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  outerRing: {
    position: 'absolute',
  },
  activeArc: {
    position: 'absolute',
    transform: [{ rotate: '45deg' }],
  },
  innerContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  percentageText: {
    fontSize: 32,
    fontWeight: '800',
    color: colors.label,
    fontVariant: ['tabular-nums'],
  },
  subtitleText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.secondaryLabel,
    marginTop: 2,
  },
  statusContainer: {
    marginTop: 12,
    alignItems: 'center',
  },
  statusText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.success,
  },
});
