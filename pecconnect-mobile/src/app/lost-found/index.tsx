import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable, RefreshControl, Image } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { fetchLostAndFoundItems, LostAndFoundItem } from '@/utils/lostAndFoundApi';
import { useTheme } from '@/theme/colors';
import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import { BlurView } from 'expo-blur';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function LostAndFoundFeed() {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'lost' | 'found'>('lost');

  const { data: items, isLoading, refetch, isRefetching } = useQuery({
    queryKey: ['lostAndFound', activeTab],
    queryFn: () => fetchLostAndFoundItems(activeTab, 'active'),
  });

  const renderItem = ({ item, index }: { item: LostAndFoundItem; index: number }) => (
    <Animated.View entering={FadeInUp.delay(index * 50).springify()}>
      <Pressable 
        style={[styles.card, { backgroundColor: colors.cardBackground, borderColor: colors.cardBorder }]}
        onPress={() => router.push(`/lost-found/${item.id}`)}
      >
        <View style={styles.cardHeader}>
          <View style={styles.authorInfo}>
            <View style={[styles.avatar, { backgroundColor: colors.accent + '20' }]}>
              <Text style={[styles.avatarText, { color: colors.accent }]}>
                {item.user.name.charAt(0).toUpperCase()}
              </Text>
            </View>
            <View>
              <Text style={[styles.authorName, { color: colors.label }]}>{item.user.name}</Text>
              <Text style={[styles.authorBranch, { color: colors.secondaryLabel }]}>{item.user.branch}</Text>
            </View>
          </View>
          <Text style={[styles.dateText, { color: colors.tertiaryLabel }]}>
            {new Date(item.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
          </Text>
        </View>

        <Text style={[styles.title, { color: colors.label }]}>{item.title}</Text>
        <Text style={[styles.description, { color: colors.secondaryLabel }]} numberOfLines={3}>
          {item.description}
        </Text>

        {item.image_url && (
          <Image source={{ uri: item.image_url }} style={styles.image} resizeMode="cover" />
        )}

        <View style={styles.cardFooter}>
          {item.location && (
            <View style={styles.locationBadge}>
              <Ionicons name="location-outline" size={14} color={colors.secondaryLabel} />
              <Text style={[styles.locationText, { color: colors.secondaryLabel }]}>{item.location}</Text>
            </View>
          )}
          
          <View style={styles.statsRow}>
            <Ionicons name="chatbubble-outline" size={16} color={colors.secondaryLabel} />
            <Text style={[styles.statsText, { color: colors.secondaryLabel }]}>{item.comments_count}</Text>
          </View>
        </View>
      </Pressable>
    </Animated.View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.systemBackground }]}>
      <Stack.Screen 
        options={{ 
          title: 'Lost & Found',
          headerShown: true,
          headerStyle: { backgroundColor: colors.cardBackground },
          headerTintColor: colors.label,
        }} 
      />

      <View style={[styles.tabsRow, { backgroundColor: colors.cardBackground, borderBottomColor: colors.cardBorder }]}>
        <Pressable 
          style={[styles.tab, activeTab === 'lost' && [styles.activeTab, { borderBottomColor: colors.accent }]]}
          onPress={() => setActiveTab('lost')}
        >
          <Text style={[styles.tabText, activeTab === 'lost' ? { color: colors.accent, fontWeight: '700' } : { color: colors.secondaryLabel }]}>
            Lost Items
          </Text>
        </Pressable>
        <Pressable 
          style={[styles.tab, activeTab === 'found' && [styles.activeTab, { borderBottomColor: colors.accent }]]}
          onPress={() => setActiveTab('found')}
        >
          <Text style={[styles.tabText, activeTab === 'found' ? { color: colors.accent, fontWeight: '700' } : { color: colors.secondaryLabel }]}>
            Found Items
          </Text>
        </Pressable>
      </View>

      <FlatList
        data={items?.data || []}
        keyExtractor={item => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={[styles.listContent, { paddingBottom: Math.max(insets.bottom + 80, 100) }]}
        refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor={colors.accent} />}
        ListEmptyComponent={
          !isLoading ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="search-outline" size={48} color={colors.tertiaryLabel} />
              <Text style={[styles.emptyText, { color: colors.secondaryLabel }]}>No {activeTab} items reported.</Text>
            </View>
          ) : null
        }
      />

      <BlurView intensity={80} style={[styles.fabContainer, { bottom: Math.max(insets.bottom + 20, 30) }]} tint="dark">
        <Pressable 
          style={[styles.fab, { backgroundColor: colors.accent }]} 
          onPress={() => router.push('/post-lost-found')}
        >
          <Ionicons name="add" size={28} color="#FFF" />
        </Pressable>
      </BlurView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabsRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
  },
  tab: {
    flex: 1,
    paddingVertical: 14,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 3,
  },
  tabText: {
    fontSize: 15,
    fontWeight: '600',
  },
  listContent: {
    padding: 16,
    paddingBottom: 100,
    gap: 16,
  },
  card: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    gap: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  authorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 16,
    fontWeight: '700',
  },
  authorName: {
    fontSize: 14,
    fontWeight: '700',
  },
  authorBranch: {
    fontSize: 12,
  },
  dateText: {
    fontSize: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginTop: 4,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  locationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  locationText: {
    fontSize: 12,
    fontWeight: '500',
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statsText: {
    fontSize: 13,
    fontWeight: '600',
  },
  emptyContainer: {
    paddingTop: 60,
    alignItems: 'center',
    gap: 12,
  },
  emptyText: {
    fontSize: 15,
  },
  fabContainer: {
    position: 'absolute',
    bottom: 30,
    right: 24,
    borderRadius: 28,
    overflow: 'hidden',
  },
  fab: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
});
