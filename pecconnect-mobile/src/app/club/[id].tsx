import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Linking } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useQueryClient } from '@tanstack/react-query';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/theme/colors';
import { Ionicons } from '@expo/vector-icons';
import { Club } from '@/hooks/useClubs';
import Animated, { FadeInUp, FadeInDown } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

export default function ClubDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { colors, isDark } = useTheme();
  const queryClient = useQueryClient();

  // Find the club from the react-query cache
  let foundClub: Club | undefined;
  const queries = queryClient.getQueriesData({ queryKey: ['clubs'] });
  for (const [queryKey, data] of queries) {
    if (Array.isArray(data)) {
      const match = data.find((c: Club) => c.id.toString() === id);
      if (match) {
        foundClub = match;
        break;
      }
    }
  }

  if (!foundClub) {
    return (
      <View style={[styles.container, { backgroundColor: colors.systemBackground, justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ color: colors.label }}>Club not found</Text>
        <Pressable onPress={() => router.back()} style={{ marginTop: 20 }}>
          <Text style={{ color: colors.accent }}>Go Back</Text>
        </Pressable>
      </View>
    );
  }

  const handleJoinPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (foundClub?.join_link) {
      Linking.openURL(foundClub.join_link);
    } else {
      alert('Join link is not available yet.');
    }
  };

  const handleWebsitePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (foundClub?.website_link) {
      Linking.openURL(foundClub.website_link);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.systemBackground }]} edges={['top', 'bottom']}>
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: colors.cardBorder }]}>
        <Pressable 
          style={[styles.backButton, { backgroundColor: colors.secondarySystemBackground }]}
          onPress={() => router.back()}
        >
          <Ionicons name="chevron-back" size={24} color={colors.label} />
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Hero Section */}
        <Animated.View entering={FadeInUp.delay(100).springify()} style={styles.heroContainer}>
          <View style={[styles.iconWrapper, { backgroundColor: foundClub.color + '20', borderColor: foundClub.color + '40' }]}>
            <Ionicons name={foundClub.icon_name as any || 'people'} size={48} color={foundClub.color} />
          </View>
          <Text style={[styles.clubName, { color: colors.label }]}>{foundClub.name}</Text>
          
          <View style={styles.badgeRow}>
            <View style={[styles.badge, { backgroundColor: foundClub.color + '20' }]}>
              <Text style={[styles.badgeText, { color: foundClub.color }]}>{foundClub.category}</Text>
            </View>
            <View style={[styles.badge, { backgroundColor: colors.secondarySystemBackground }]}>
              <Ionicons name="people" size={14} color={colors.secondaryLabel} style={{ marginRight: 4 }} />
              <Text style={[styles.badgeText, { color: colors.secondaryLabel }]}>{foundClub.members_count}+ Members</Text>
            </View>
          </View>
        </Animated.View>

        {/* Action Buttons */}
        <Animated.View entering={FadeInDown.delay(200).springify()} style={styles.actionsContainer}>
          <Pressable
            style={[styles.primaryButton, { backgroundColor: foundClub.color }]}
            onPress={handleJoinPress}
          >
            <Text style={styles.primaryButtonText}>Join Club</Text>
            <Ionicons name="arrow-forward" size={18} color="#FFF" style={{ marginLeft: 8 }} />
          </Pressable>

          {foundClub.website_link && (
            <Pressable
              style={[styles.secondaryButton, { borderColor: colors.cardBorder, backgroundColor: colors.cardBackground }]}
              onPress={handleWebsitePress}
            >
              <Ionicons name="globe-outline" size={20} color={colors.label} style={{ marginRight: 8 }} />
              <Text style={[styles.secondaryButtonText, { color: colors.label }]}>Visit Website</Text>
            </Pressable>
          )}
        </Animated.View>

        {/* Description */}
        <Animated.View entering={FadeInDown.delay(300).springify()} style={[styles.section, { backgroundColor: colors.cardBackground, borderColor: colors.cardBorder }]}>
          <Text style={[styles.sectionTitle, { color: colors.label }]}>About Us</Text>
          <Text style={[styles.descriptionText, { color: colors.secondaryLabel }]}>
            {foundClub.long_description || foundClub.description}
          </Text>
        </Animated.View>

        {/* Faculty Advisor / Additional Info */}
        {foundClub.faculty_advisor ? (
          <Animated.View entering={FadeInDown.delay(400).springify()} style={[styles.section, { backgroundColor: colors.cardBackground, borderColor: colors.cardBorder }]}>
            <View style={styles.infoRow}>
              <Ionicons name="person-circle-outline" size={24} color={foundClub.color} style={{ marginRight: 12 }} />
              <View style={{ flex: 1 }}>
                <Text style={[styles.infoLabel, { color: colors.tertiaryLabel }]}>Faculty Advisor</Text>
                <Text style={[styles.infoValue, { color: colors.label }]}>{foundClub.faculty_advisor}</Text>
              </View>
            </View>
          </Animated.View>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 60,
  },
  heroContainer: {
    alignItems: 'center',
    marginBottom: 32,
    paddingTop: 10,
  },
  iconWrapper: {
    width: 96,
    height: 96,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    marginBottom: 20,
  },
  clubName: {
    fontSize: 26,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 16,
    letterSpacing: -0.5,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 13,
    fontWeight: '700',
  },
  actionsContainer: {
    gap: 12,
    marginBottom: 32,
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 16,
  },
  primaryButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 16,
    borderWidth: 1,
  },
  secondaryButtonText: {
    fontSize: 15,
    fontWeight: '600',
  },
  section: {
    padding: 20,
    borderRadius: 20,
    borderWidth: 1,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
  },
  descriptionText: {
    fontSize: 15,
    lineHeight: 24,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 15,
    fontWeight: '500',
  }
});
