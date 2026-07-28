import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { colors } from '@/theme/colors';
import * as Haptics from 'expo-haptics';
import { useMemo, useEffect, useRef } from 'react';

interface Props {
  selectedDate: string; // YYYY-MM-DD
  onSelectDate: (date: string) => void;
}

export function DaySelector({ selectedDate, onSelectDate }: Props) {
  const scrollViewRef = useRef<ScrollView>(null);

  // Generate an array of dates: 7 days in the past, 30 days in the future
  const dates = useMemo(() => {
    const list = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = -7; i <= 30; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      
      const isToday = i === 0;
      
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const dayStr = String(d.getDate()).padStart(2, '0');
      const dateString = `${year}-${month}-${dayStr}`;
      const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
      const dayNum = d.getDate();

      list.push({
        id: dateString,
        dateString,
        dayName,
        dayNum,
        isToday
      });
    }
    return list;
  }, []);

  // Auto-scroll to today or selected date on mount
  useEffect(() => {
    // A small delay ensures the layout has been calculated
    setTimeout(() => {
      const index = dates.findIndex(d => d.id === selectedDate);
      if (index !== -1 && scrollViewRef.current) {
        // Approximate width of each item + gap = ~70px. Centers the item loosely.
        scrollViewRef.current.scrollTo({ x: index * 60 - 150, animated: true });
      }
    }, 100);
  }, []);

  return (
    <View style={styles.container}>
      <ScrollView 
        ref={scrollViewRef}
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {dates.map((dateObj) => {
          const isSelected = selectedDate === dateObj.id;
          return (
            <Pressable
              key={dateObj.id}
              onPress={() => {
                Haptics.selectionAsync();
                onSelectDate(dateObj.id);
              }}
              style={[
                styles.pill,
                isSelected && styles.pillSelected,
                dateObj.isToday && !isSelected && styles.pillToday
              ]}
            >
              <Text style={[
                styles.dayName,
                isSelected ? styles.textSelected : (dateObj.isToday ? styles.textToday : undefined)
              ]}>
                {dateObj.dayName}
              </Text>
              <Text style={[
                styles.dayNum,
                isSelected ? styles.textSelected : (dateObj.isToday ? styles.textToday : undefined)
              ]}>
                {dateObj.dayNum}
              </Text>
              {dateObj.isToday && <View style={[styles.dot, isSelected && styles.dotSelected]} />}
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  scrollContent: {
    paddingHorizontal: 20,
    gap: 12,
  },
  pill: {
    width: 60,
    height: 75,
    borderRadius: 20, // Continuous curve feeling
    backgroundColor: colors.secondarySystemBackground,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'transparent',
    gap: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  pillToday: {
    borderColor: colors.accent,
  },
  pillSelected: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  dayName: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.secondaryLabel,
    textTransform: 'uppercase',
  },
  dayNum: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.label,
  },
  textSelected: {
    color: '#FFFFFF',
  },
  textToday: {
    color: colors.accent,
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.accent,
    position: 'absolute',
    bottom: 8,
  },
  dotSelected: {
    backgroundColor: '#FFFFFF',
  }
});
