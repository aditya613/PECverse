import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  RefreshControl,
  Image,
  TextInput,
  ScrollView,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { useRouter, Stack } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { useTheme } from '@/theme/colors';
import {
  fetchMarketplaceItems,
  MarketplaceItem,
  MarketplaceCategory,
  getFullImageUrl,
} from '@/utils/marketplaceApi';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 36) / 2;

const CATEGORIES: { id: MarketplaceCategory; label: string; icon: string }[] = [
  { id: 'all', label: 'All Items', icon: 'sparkles' },
  { id: 'cycles', label: 'Cycles', icon: 'bicycle' },
  { id: 'academics', label: 'Academics & Drafters', icon: 'book' },
  { id: 'hostel', label: 'Hostel Gear', icon: 'bed' },
  { id: 'electronics', label: 'Electronics', icon: 'hardware-chip' },
  { id: 'fashion', label: 'Lab Coats & Wear', icon: 'shirt' },
  { id: 'others', label: 'Others', icon: 'grid' },
];

export default function MarketplaceFeed() {
  const insets = useSafeAreaInsets();
  const { colors, isDark } = useTheme();
  const router = useRouter();

  const [selectedCategory, setSelectedCategory] = useState<MarketplaceCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState<'latest' | 'price_asc' | 'price_desc'>('latest');
  const [onlyFree, setOnlyFree] = useState(false);

  const { data, isLoading, refetch, isRefetching } = useQuery({
    queryKey: ['marketplaceItems', selectedCategory, sortOption, onlyFree],
    queryFn: () =>
      fetchMarketplaceItems({
        category: selectedCategory === 'all' ? undefined : selectedCategory,
        sort: sortOption,
        max_price: onlyFree ? 0 : undefined,
        status: 'available',
      }),
  });

  const filteredItems = useMemo(() => {
    if (!data?.data) return [];
    if (!searchQuery.trim()) return data.data;

    const q = searchQuery.toLowerCase().trim();
    return data.data.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        (item.location && item.location.toLowerCase().includes(q))
    );
  }, [data?.data, searchQuery]);

  const cycleSort = () => {
    if (sortOption === 'latest') setSortOption('price_asc');
    else if (sortOption === 'price_asc') setSortOption('price_desc');
    else setSortOption('latest');
  };

  const sortLabel = {
    latest: 'Latest',
    price_asc: 'Price: Low → High',
    price_desc: 'Price: High → Low',
  }[sortOption];

  const renderItem = ({ item, index }: { item: MarketplaceItem; index: number }) => {
    const isSold = item.status === 'sold';
    const isFree = item.price === 0;

    return (
      <Animated.View entering={FadeInUp.delay(Math.min(index * 35, 300)).springify()}>
        <Pressable
          style={[
            styles.card,
            {
              backgroundColor: colors.cardBackground,
              borderColor: colors.cardBorder,
            },
          ]}
          onPress={() => router.push(`/marketplace/${item.id}` as any)}
        >
          {/* Image Container */}
          <View style={[styles.imageContainer, { backgroundColor: isDark ? '#1F1F23' : '#F1F5F9' }]}>
            {item.image_url ? (
              <Image
                source={{ uri: getFullImageUrl(item.image_url) || '' }}
                style={styles.image}
                resizeMode="cover"
              />
            ) : (
              <View style={styles.placeholderImage}>
                <Ionicons name="cart-outline" size={36} color={colors.tertiaryLabel} />
              </View>
            )}

            {/* Price Badge */}
            <View
              style={[
                styles.priceBadge,
                isFree
                  ? { backgroundColor: '#10B981' }
                  : { backgroundColor: isDark ? 'rgba(0,0,0,0.75)' : 'rgba(15,23,42,0.85)' },
              ]}
            >
              <Text style={styles.priceText}>
                {isFree ? '🎁 FREE' : `₹${item.price.toLocaleString('en-IN')}`}
              </Text>
            </View>

            {/* Sold Overlay */}
            {isSold && (
              <View style={styles.soldOverlay}>
                <View style={styles.soldBadge}>
                  <Text style={styles.soldText}>SOLD</Text>
                </View>
              </View>
            )}
          </View>

          {/* Details */}
          <View style={styles.cardContent}>
            <Text style={[styles.itemTitle, { color: colors.label }]} numberOfLines={2}>
              {item.title}
            </Text>

            <View style={styles.metaRow}>
              <View style={[styles.conditionChip, { backgroundColor: colors.secondarySystemBackground }]}>
                <Text style={[styles.conditionText, { color: colors.secondaryLabel }]}>
                  {item.condition === 'like_new' ? 'Like New' : item.condition === 'good' ? 'Good' : 'Fair'}
                </Text>
              </View>
              {item.location && (
                <Text style={[styles.locationText, { color: colors.tertiaryLabel }]} numberOfLines={1}>
                  📍 {item.location}
                </Text>
              )}
            </View>

            <View style={[styles.divider, { backgroundColor: colors.separator }]} />

            <View style={styles.cardFooter}>
              <Text style={[styles.sellerName, { color: colors.secondaryLabel }]} numberOfLines={1}>
                {item.user?.name || 'Student'}
              </Text>
              <Text style={[styles.timeText, { color: colors.tertiaryLabel }]}>
                {item.created_at
                  ? new Date(item.created_at).toLocaleDateString(undefined, {
                      month: 'short',
                      day: 'numeric',
                    })
                  : ''}
              </Text>
            </View>
          </View>
        </Pressable>
      </Animated.View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.systemBackground }]}>
      <Stack.Screen
        options={{
          title: 'Campus Marketplace',
          headerShown: true,
          headerStyle: { backgroundColor: colors.cardBackground },
          headerTintColor: colors.label,
          headerShadowVisible: false,
          headerRight: () => (
            <Pressable
              onPress={() => router.push('/marketplace/my-listings' as any)}
              style={[styles.myListingsBtn, { backgroundColor: colors.secondarySystemBackground }]}
            >
              <Ionicons name="person-outline" size={15} color={colors.label} />
              <Text style={[styles.myListingsBtnText, { color: colors.label }]}>My Items</Text>
            </Pressable>
          ),
        }}
      />

      {/* Top Search & Filter Bar */}
      <View style={[styles.searchSection, { backgroundColor: colors.cardBackground, borderBottomColor: colors.separator }]}>
        <View style={[styles.searchBar, { backgroundColor: colors.secondarySystemBackground, borderColor: colors.cardBorder }]}>
          <Ionicons name="search" size={18} color={colors.secondaryLabel} style={{ marginLeft: 10 }} />
          <TextInput
            style={[styles.searchInput, { color: colors.label }]}
            placeholder="Search cycles, drafters, coolers, books..."
            placeholderTextColor={colors.tertiaryLabel}
            value={searchQuery}
            onChangeText={setSearchQuery}
            returnKeyType="search"
          />
          {searchQuery.length > 0 && (
            <Pressable onPress={() => setSearchQuery('')} style={{ padding: 6 }}>
              <Ionicons name="close-circle" size={18} color={colors.tertiaryLabel} />
            </Pressable>
          )}
        </View>

        {/* Categories Scroll */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesContainer}
        >
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <Pressable
                key={cat.id}
                onPress={() => setSelectedCategory(cat.id)}
                style={[
                  styles.categoryPill,
                  {
                    backgroundColor: isSelected ? colors.accent : colors.secondarySystemBackground,
                    borderColor: isSelected ? colors.accent : colors.cardBorder,
                  },
                ]}
              >
                <Ionicons
                  name={cat.icon as any}
                  size={14}
                  color={isSelected ? '#FFFFFF' : colors.secondaryLabel}
                />
                <Text
                  style={[
                    styles.categoryText,
                    { color: isSelected ? '#FFFFFF' : colors.secondaryLabel },
                  ]}
                >
                  {cat.label}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        {/* Filter Quick Actions (Sort & Free Toggle) */}
        <View style={styles.filterActionsRow}>
          <Pressable
            onPress={cycleSort}
            style={[styles.filterActionChip, { backgroundColor: colors.secondarySystemBackground }]}
          >
            <Ionicons name="swap-vertical" size={14} color={colors.accent} />
            <Text style={[styles.filterActionText, { color: colors.label }]}>{sortLabel}</Text>
          </Pressable>

          <Pressable
            onPress={() => setOnlyFree(!onlyFree)}
            style={[
              styles.filterActionChip,
              onlyFree
                ? { backgroundColor: '#10B981' }
                : { backgroundColor: colors.secondarySystemBackground },
            ]}
          >
            <Ionicons name="gift-outline" size={14} color={onlyFree ? '#FFFFFF' : colors.secondaryLabel} />
            <Text
              style={[
                styles.filterActionText,
                { color: onlyFree ? '#FFFFFF' : colors.secondaryLabel },
              ]}
            >
              🎁 Free Only
            </Text>
          </Pressable>

          <Text style={[styles.resultsCount, { color: colors.tertiaryLabel }]}>
            {filteredItems.length} {filteredItems.length === 1 ? 'item' : 'items'}
          </Text>
        </View>
      </View>

      {/* Main Grid Feed */}
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.accent} />
          <Text style={[styles.loadingText, { color: colors.secondaryLabel }]}>
            Loading campus listings...
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredItems}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          columnWrapperStyle={styles.columnWrapper}
          contentContainerStyle={[
            styles.listContainer,
            { paddingBottom: insets.bottom + 90 },
          ]}
          renderItem={renderItem}
          refreshControl={
            <RefreshControl
              refreshing={isRefetching}
              onRefresh={refetch}
              tintColor={colors.accent}
            />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <View style={[styles.emptyIconCircle, { backgroundColor: colors.accent + '15' }]}>
                <Ionicons name="pricetags-outline" size={42} color={colors.accent} />
              </View>
              <Text style={[styles.emptyTitle, { color: colors.label }]}>No Items Found</Text>
              <Text style={[styles.emptySubtitle, { color: colors.secondaryLabel }]}>
                {searchQuery
                  ? 'Try searching with a different keyword or category.'
                  : 'Be the first to list a cycle, drafter, books, or hostel gear!'}
              </Text>
              <Pressable
                style={[styles.emptySellBtn, { backgroundColor: colors.accent }]}
                onPress={() => router.push('/marketplace/post' as any)}
              >
                <Ionicons name="add-circle" size={18} color="#FFFFFF" />
                <Text style={styles.emptySellBtnText}>Post a Free Listing</Text>
              </Pressable>
            </View>
          }
        />
      )}

      {/* Floating Action Button (+ Sell Item) */}
      <Pressable
        style={[styles.fab, { backgroundColor: colors.accent }]}
        onPress={() => router.push('/marketplace/post' as any)}
      >
        <Ionicons name="add" size={26} color="#FFFFFF" />
        <Text style={styles.fabText}>Sell Item</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  myListingsBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 14,
    marginRight: 8,
  },
  myListingsBtnText: {
    fontSize: 12,
    fontWeight: '600',
  },
  searchSection: {
    paddingTop: 10,
    paddingBottom: 10,
    borderBottomWidth: 1,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
    height: 40,
  },
  searchInput: {
    flex: 1,
    paddingHorizontal: 8,
    fontSize: 14,
  },
  categoriesContainer: {
    paddingHorizontal: 12,
    paddingTop: 10,
    paddingBottom: 6,
    gap: 8,
  },
  categoryPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '600',
  },
  filterActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingTop: 6,
    gap: 8,
  },
  filterActionChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  filterActionText: {
    fontSize: 11,
    fontWeight: '600',
  },
  resultsCount: {
    marginLeft: 'auto',
    fontSize: 11,
    fontWeight: '500',
  },
  listContainer: {
    padding: 12,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  card: {
    width: CARD_WIDTH,
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
  },
  imageContainer: {
    width: '100%',
    height: CARD_WIDTH * 0.9,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  placeholderImage: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  priceBadge: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  priceText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  soldOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  soldBadge: {
    backgroundColor: '#EF4444',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
    transform: [{ rotate: '-10deg' }],
  },
  soldText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 12,
    letterSpacing: 1,
  },
  cardContent: {
    padding: 10,
  },
  itemTitle: {
    fontSize: 13,
    fontWeight: '700',
    lineHeight: 18,
    minHeight: 36,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 6,
  },
  conditionChip: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  conditionText: {
    fontSize: 10,
    fontWeight: '600',
  },
  locationText: {
    fontSize: 10,
    fontWeight: '500',
    flex: 1,
  },
  divider: {
    height: 1,
    marginVertical: 8,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sellerName: {
    fontSize: 11,
    fontWeight: '500',
    flex: 1,
    marginRight: 4,
  },
  timeText: {
    fontSize: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 13,
  },
  emptyContainer: {
    paddingTop: 60,
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  emptyIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  emptySubtitle: {
    fontSize: 13,
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 19,
  },
  emptySellBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 20,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 20,
  },
  emptySellBtnText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 13,
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  fabText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
});
