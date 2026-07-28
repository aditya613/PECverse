import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { colors } from '@/theme/colors';
import { AnimatedPressable } from '@/components/ui/AnimatedPressable';

interface DateItem {
  dayName: string; // e.g. "Mon"
  dayNum: number;  // e.g. 20
  fullDate: string; // "2026-07-20"
}

interface DateRibbonProps {
  dates: DateItem[];
  selectedDate: string;
  todayDate: string;
  onSelectDate: (dateStr: string) => void;
}

export function DateRibbon({ dates, selectedDate, todayDate, onSelectDate }: DateRibbonProps) {
  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
      >
        {dates.map((item) => {
          const isSelected = item.fullDate === selectedDate;
          const isToday = item.fullDate === todayDate;
          return (
            <AnimatedPressable
              key={item.fullDate}
              onPress={() => onSelectDate(item.fullDate)}
              scaleTo={0.94}
            >
              <View style={[styles.pill, isSelected && styles.selectedPill]}>
                <Text style={[styles.dayName, isSelected && styles.selectedText, isToday && !isSelected && styles.todayText]}>
                  {item.dayName}
                </Text>
                <Text style={[styles.dayNum, isSelected && styles.selectedText, isToday && !isSelected && styles.todayText]}>
                  {item.dayNum}
                </Text>
                {/* Subtle indicator dot for "Today" */}
                {isToday && (
                  <View style={[styles.todayDot, isSelected && styles.todayDotSelected]} />
                )}
              </View>
            </AnimatedPressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 12,
  },
  scrollContainer: {
    paddingHorizontal: 16,
    gap: 10,
    flexDirection: 'row',
  },
  pill: {
    width: 48,
    height: 64,
    borderRadius: 18,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  selectedPill: {
    backgroundColor: colors.accent, // Electric Blue pill
  },
  dayName: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.secondaryLabel,
  },
  dayNum: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.label,
    fontVariant: ['tabular-nums'],
  },
  selectedText: {
    color: '#FFFFFF',
  },
  todayText: {
    color: colors.accent,
  },
  todayDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.accent,
    position: 'absolute',
    bottom: 6,
  },
  todayDotSelected: {
    backgroundColor: '#FFFFFF',
  },
});
