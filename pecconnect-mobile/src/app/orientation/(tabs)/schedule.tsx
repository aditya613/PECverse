import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '@/theme/colors';
import Animated, { FadeInDown, FadeIn } from 'react-native-reanimated';
import { SymbolView } from 'expo-symbols';

const DAY1_SCHEDULE = [
  { time: '08:30 AM', duration: '60 min', event: 'Attendance', venue: 'Respective Venues', type: 'admin', icon: 'person.badge.shield.checkmark.fill' },
  { time: '09:30 AM', duration: '30 min', event: 'Welcome Kit', venue: 'Main Auditorium', type: 'fun', icon: 'gift.fill' },
  { time: '10:00 AM', duration: '35 min', event: 'Welcoming & Inaugural', venue: 'Main Auditorium', type: 'ceremony', icon: 'sparkles' },
  { time: '10:40 AM', duration: '30 min', event: 'Chief Guest Address', venue: 'Main Auditorium', type: 'ceremony', icon: 'mic.fill' },
  { time: '11:10 AM', duration: '50 min', event: 'Felicitation & Deans Address', venue: 'Main Auditorium', type: 'admin', icon: 'graduationcap.fill' },
  { time: '12:00 PM', duration: '15 min', event: 'Address By DSA', venue: 'Main Auditorium', type: 'admin', icon: 'person.fill' },
  { time: '12:15 PM', duration: '30 min', event: 'Dispersal to Hostels', venue: 'Campus', type: 'logistics', icon: 'figure.walk' },
  { time: '12:45 PM', duration: '75 min', event: 'Lunch Break', venue: 'Respective Mess/Hostels', type: 'break', icon: 'fork.knife' },
  { time: '02:00 PM', duration: '120 min', event: 'Department Visit(s)', venue: 'Respective Departments', type: 'academic', icon: 'building.columns.fill' },
  { time: '04:00 PM', duration: '30 min', event: 'Snacks', venue: 'Departments', type: 'break', icon: 'cup.and.saucer.fill' },
  { time: '04:30 PM', duration: '30 min', event: 'Institute Tour', venue: 'Campus', type: 'fun', icon: 'map.fill' },
];

const getColorForType = (type: string) => {
  switch (type) {
    case 'ceremony': return '#8B5CF6';
    case 'admin': return '#3B82F6';
    case 'break': return '#10B981';
    case 'fun': return '#F59E0B';
    case 'academic': return '#EF4444';
    default: return colors.secondaryLabel;
  }
};

export default function ScheduleScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.header} edges={['top']}>
        <Text style={styles.headerTitle}>Orientation Week</Text>
        <Text style={styles.headerSubtitle}>Day 1 • August 19, 2026</Text>
      </SafeAreaView>

      <ScrollView contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 100 }]} showsVerticalScrollIndicator={false}>
        {DAY1_SCHEDULE.map((item, index) => {
          const itemColor = getColorForType(item.type);
          
          return (
            <Animated.View 
              key={index} 
              entering={FadeInDown.delay(index * 50).springify()} 
              style={styles.card}
            >
              <View style={styles.timeColumn}>
                <Text style={styles.timeText}>{item.time}</Text>
                <Text style={styles.durationText}>{item.duration}</Text>
              </View>
              
              <View style={[styles.divider, { backgroundColor: itemColor }]} />
              
              <View style={styles.contentColumn}>
                <View style={styles.eventHeader}>
                  <SymbolView name={item.icon as any} tintColor={itemColor} size={16} />
                  <Text style={styles.eventText}>{item.event}</Text>
                </View>
                <Text style={styles.venueText}>{item.venue}</Text>
              </View>
            </Animated.View>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.systemBackground,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: 'rgba(20, 20, 25, 0.9)',
    borderBottomWidth: 1,
    borderBottomColor: colors.cardBorder,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.label,
  },
  headerSubtitle: {
    fontSize: 15,
    color: colors.accent,
    fontWeight: '600',
    marginTop: 4,
  },
  scrollContent: {
    padding: 16,
    paddingTop: 24,
    gap: 16,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: colors.cardBackground,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  timeColumn: {
    width: 80,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  timeText: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.label,
  },
  durationText: {
    fontSize: 12,
    color: colors.secondaryLabel,
    marginTop: 4,
  },
  divider: {
    width: 3,
    borderRadius: 2,
    marginHorizontal: 16,
  },
  contentColumn: {
    flex: 1,
    justifyContent: 'center',
  },
  eventHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  eventText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.label,
    flex: 1,
  },
  venueText: {
    fontSize: 14,
    color: colors.secondaryLabel,
  },
});
