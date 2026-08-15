import { View, Text, StyleSheet, ScrollView, Pressable, Linking } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '@/theme/colors';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';

export default function ExploreScreen() {
  const insets = useSafeAreaInsets();

  const handleLink = (url: string) => {
    Linking.openURL(url);
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.header} edges={['top']}>
        <Text style={styles.headerTitle}>Explore</Text>
      </SafeAreaView>

      <ScrollView contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 100 }]}>
        
        <Animated.View entering={FadeInDown.delay(100).springify()}>
          <Text style={styles.sectionTitle}>Essential Resources</Text>
          
          <Pressable style={styles.linkCard} onPress={() => handleLink('https://linktr.ee/Orientation2026PEC')}>
            <View style={[styles.iconBox, { backgroundColor: 'rgba(32, 138, 239, 0.15)' }]}>
              <Ionicons name="link" color={colors.accent} size={24} />
            </View>
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>Official Linktree</Text>
              <Text style={styles.cardDesc}>Important documents, groups, and notices.</Text>
            </View>
            <Ionicons name="chevron-forward" color={colors.cardBorder} size={20} />
          </Pressable>

          <Pressable style={styles.linkCard} onPress={() => handleLink('https://pec.ac.in/')}>
            <View style={[styles.iconBox, { backgroundColor: 'rgba(139, 92, 246, 0.15)' }]}>
              <Ionicons name="school" color="#8B5CF6" size={24} />
            </View>
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>PEC Website</Text>
              <Text style={styles.cardDesc}>Academic calendar and curriculum details.</Text>
            </View>
            <Ionicons name="chevron-forward" color={colors.cardBorder} size={20} />
          </Pressable>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(200).springify()}>
          <Text style={styles.sectionTitle}>Groups (Coming Soon)</Text>
          <View style={styles.comingSoonCard}>
            <Ionicons name="people" color={colors.secondaryLabel} size={32} />
            <Text style={styles.comingSoonText}>Interest-based groups and clubs will open up after orientation week!</Text>
          </View>
        </Animated.View>

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
  scrollContent: {
    padding: 16,
    gap: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.label,
    marginBottom: 12,
  },
  linkCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.cardBackground,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    marginBottom: 12,
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.label,
    marginBottom: 4,
  },
  cardDesc: {
    fontSize: 13,
    color: colors.secondaryLabel,
  },
  comingSoonCard: {
    backgroundColor: colors.secondarySystemBackground,
    padding: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    borderStyle: 'dashed',
  },
  comingSoonText: {
    color: colors.secondaryLabel,
    textAlign: 'center',
    fontSize: 14,
    lineHeight: 20,
  }
});
