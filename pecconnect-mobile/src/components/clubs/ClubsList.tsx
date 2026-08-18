import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable, TextInput, ActivityIndicator, Linking } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/theme/colors';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown, ZoomIn } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { useClubs, Club } from '@/hooks/useClubs';
import { useRouter } from 'expo-router';

const CATEGORIES = ['All', 'Technical', 'Cultural', 'Sports', 'Social'];

export function ClubsList({ showBackButton = false }: { showBackButton?: boolean }) {
  const insets = useSafeAreaInsets();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const { colors, isDark } = useTheme();
  const router = useRouter();
  
  const { clubs, isLoading, refetch, isRefetching } = useClubs(selectedCategory);

  const filteredClubs = clubs.filter(club => 
    club.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    club.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
    club.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderClubCard = ({ item, index }: { item: Club; index: number }) => {
    return (
      <Animated.View 
        entering={FadeInDown.delay(Math.min(index * 60, 300)).springify()} 
        style={[styles.clubCardContainer]}
      >
        <Pressable
          onPress={() => router.push(`/club/${item.id}` as any)}
          style={({ pressed }) => [
            styles.clubCard, 
            { backgroundColor: colors.cardBackground, borderColor: colors.cardBorder },
            pressed && { opacity: 0.7 }
          ]}
        >
          <View style={[styles.clubIconContainer, { backgroundColor: item.color + '15', borderColor: item.color + '30' }]}>
          <Ionicons name={item.icon_name as any || 'people'} size={26} color={item.color} />
        </View>

        <View style={styles.clubInfo}>
          <View style={styles.clubHeaderRow}>
            <Text style={[styles.clubName, { color: colors.label }]} numberOfLines={1}>{item.name}</Text>
          </View>
          <View style={styles.badgeRow}>
            <Text style={[styles.membersCount, { color: colors.secondaryLabel }]}>{item.members_count}+ Members</Text>
            <Text style={[styles.dotSeparator, { color: colors.tertiaryLabel }]}>•</Text>
            <View style={[styles.categoryPill, { backgroundColor: item.color + '20' }]}>
              <Text style={[styles.categoryPillText, { color: item.color }]}>{item.category}</Text>
            </View>
          </View>
          <Text style={[styles.clubDescription, { color: colors.secondaryLabel }]} numberOfLines={2}>{item.description}</Text>
        </View>

        </Pressable>
      </Animated.View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.systemBackground }]}>
      <SafeAreaView style={[styles.header, { backgroundColor: colors.cardBackground, borderBottomColor: colors.cardBorder }]} edges={['top']}>
        <View style={styles.headerTitleRow}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            {showBackButton && (
              <Pressable onPress={() => router.back()} style={{ marginRight: 12 }}>
                <Ionicons name="chevron-back" size={28} color={colors.label} />
              </Pressable>
            )}
            <View>
              <Text style={[styles.headerTitle, { color: colors.label }]}>Explore Clubs</Text>
              <Text style={[styles.headerSubtitle, { color: colors.secondaryLabel }]}>Find your community & squad</Text>
            </View>
          </View>
          <Pressable 
            style={[styles.linktreeBtn, { backgroundColor: colors.accent + '15', borderColor: colors.accent + '30' }]}
            onPress={() => Linking.openURL('https://linktr.ee/Orientation2026PEC')}
          >
            <Ionicons name="link" size={18} color={colors.accent} />
          </Pressable>
        </View>

        {/* Search Bar */}
        <View style={[styles.searchContainer, { backgroundColor: colors.secondarySystemBackground, borderColor: colors.cardBorder }]}>
          <Ionicons name="search" size={18} color={colors.tertiaryLabel} style={styles.searchIcon} />
          <TextInput
            style={[styles.searchInput, { color: colors.label }]}
            placeholder="Search clubs, squads, keywords..."
            placeholderTextColor={colors.tertiaryLabel}
            value={searchQuery}
            onChangeText={setSearchQuery}
            clearButtonMode="while-editing"
          />
        </View>

        {/* Category Pills */}
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={CATEGORIES}
          keyExtractor={(item) => item}
          contentContainerStyle={styles.categoriesList}
          renderItem={({ item }) => {
            const isSelected = selectedCategory === item;
            return (
              <Pressable
                onPress={() => {
                  Haptics.selectionAsync();
                  setSelectedCategory(item);
                }}
                style={[
                  styles.categoryChip, 
                  { backgroundColor: isSelected ? colors.accent : colors.secondarySystemBackground, borderColor: isSelected ? colors.accent : colors.cardBorder }
                ]}
              >
                <Text style={[styles.categoryChipText, { color: isSelected ? '#FFFFFF' : colors.secondaryLabel }]}>
                  {item}
                </Text>
              </Pressable>
            );
          }}
        />
      </SafeAreaView>

      {isLoading ? (
        <ActivityIndicator size="large" color={colors.accent} style={{ marginTop: 60 }} />
      ) : (
        <FlatList
          data={filteredClubs}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderClubCard}
          contentContainerStyle={[
            styles.listContent,
            { paddingBottom: insets.bottom + 100 }
          ]}
          refreshing={isRefetching}
          onRefresh={refetch}
          ListEmptyComponent={
            <Animated.View entering={ZoomIn} style={styles.emptyContainer}>
              <Ionicons name="compass-outline" size={56} color={colors.tertiaryLabel} />
              <Text style={[styles.emptyTitle, { color: colors.label }]}>No Clubs Found</Text>
              <Text style={[styles.emptySubtitle, { color: colors.secondaryLabel }]}>Try searching with different keywords or switch categories.</Text>
            </Animated.View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 12,
    borderBottomWidth: 1,
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
    paddingTop: 8,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 13,
    fontWeight: '500',
    marginTop: 2,
  },
  linktreeBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 44,
    borderWidth: 1,
    marginBottom: 14,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
  },
  categoriesList: {
    gap: 8,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  categoryChipText: {
    fontSize: 13,
    fontWeight: '600',
  },
  listContent: {
    padding: 16,
    gap: 12,
  },
  clubCardContainer: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 4,
  },
  clubCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
  },
  clubIconContainer: {
    width: 52,
    height: 52,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
    borderWidth: 1,
  },
  clubInfo: {
    flex: 1,
    marginRight: 12,
  },
  clubHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  clubName: {
    fontSize: 15,
    fontWeight: '700',
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  membersCount: {
    fontSize: 12,
    fontWeight: '600',
  },
  dotSeparator: {
    fontSize: 12,
    marginHorizontal: 6,
  },
  categoryPill: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  categoryPillText: {
    fontSize: 11,
    fontWeight: '700',
  },
  clubDescription: {
    fontSize: 12,
    lineHeight: 16,
  },
  joinButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    minWidth: 72,
    alignItems: 'center',
    justifyContent: 'center',
  },
  joinButtonText: {
    fontSize: 13,
    fontWeight: '700',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    gap: 12,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  emptySubtitle: {
    fontSize: 13,
    textAlign: 'center',
    paddingHorizontal: 32,
  },
});
