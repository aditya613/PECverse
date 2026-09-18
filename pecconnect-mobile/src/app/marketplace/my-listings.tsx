import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  Image,
  Alert,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { useTheme } from '@/theme/colors';
import {
  fetchMyMarketplaceListings,
  updateMarketplaceItemStatus,
  deleteMarketplaceItem,
  MarketplaceItem,
} from '@/utils/marketplaceApi';

export default function MyMarketplaceListingsScreen() {
  const insets = useSafeAreaInsets();
  const { colors, isDark } = useTheme();
  const router = useRouter();
  const queryClient = useQueryClient();

  const [activeTab, setActiveTab] = useState<'available' | 'sold'>('available');

  const { data, isLoading, refetch, isRefetching } = useQuery({
    queryKey: ['myMarketplaceListings'],
    queryFn: fetchMyMarketplaceListings,
  });

  const toggleStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: number; status: 'available' | 'sold' }) =>
      updateMarketplaceItemStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myMarketplaceListings'] });
      queryClient.invalidateQueries({ queryKey: ['marketplaceItems'] });
    },
    onError: (err: any) => {
      Alert.alert('Error', err.response?.data?.message || 'Failed to update status');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteMarketplaceItem(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myMarketplaceListings'] });
      queryClient.invalidateQueries({ queryKey: ['marketplaceItems'] });
    },
    onError: (err: any) => {
      Alert.alert('Error', err.response?.data?.message || 'Failed to delete listing');
    },
  });

  const confirmDelete = (item: MarketplaceItem) => {
    Alert.alert(
      'Delete Listing',
      `Are you sure you want to delete "${item.title}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => deleteMutation.mutate(item.id) },
      ]
    );
  };

  const filteredItems = (data?.items || []).filter((item) => item.status === activeTab);

  const renderItem = ({ item, index }: { item: MarketplaceItem; index: number }) => {
    const isSold = item.status === 'sold';
    const isFree = item.price === 0;

    return (
      <Animated.View entering={FadeInUp.delay(index * 40).springify()}>
        <Pressable
          style={[
            styles.card,
            { backgroundColor: colors.cardBackground, borderColor: colors.cardBorder },
          ]}
          onPress={() => router.push(`/marketplace/${item.id}` as any)}
        >
          {/* Thumbnail */}
          <View style={[styles.thumbnailContainer, { backgroundColor: isDark ? '#1F1F23' : '#F1F5F9' }]}>
            {item.image_url ? (
              <Image source={{ uri: item.image_url }} style={styles.thumbnail} resizeMode="cover" />
            ) : (
              <Ionicons name="cart-outline" size={24} color={colors.tertiaryLabel} />
            )}
          </View>

          {/* Info */}
          <View style={styles.infoCol}>
            <Text style={[styles.title, { color: colors.label }]} numberOfLines={1}>
              {item.title}
            </Text>
            <Text style={[styles.price, { color: isFree ? '#10B981' : colors.accent }]}>
              {isFree ? '🎁 FREE' : `₹${item.price.toLocaleString('en-IN')}`}
            </Text>
            <Text style={[styles.dateText, { color: colors.tertiaryLabel }]}>
              Listed{' '}
              {new Date(item.created_at).toLocaleDateString(undefined, {
                month: 'short',
                day: 'numeric',
              })}
            </Text>
          </View>

          {/* Actions */}
          <View style={styles.actionCol}>
            <Pressable
              style={[
                styles.statusToggleBtn,
                { backgroundColor: isSold ? colors.accent + '20' : '#10B98120' },
              ]}
              onPress={() =>
                toggleStatusMutation.mutate({
                  id: item.id,
                  status: isSold ? 'available' : 'sold',
                })
              }
              disabled={toggleStatusMutation.isPending}
            >
              <Ionicons
                name={isSold ? 'refresh-outline' : 'checkmark-circle-outline'}
                size={14}
                color={isSold ? colors.accent : '#10B981'}
              />
              <Text
                style={[
                  styles.statusToggleText,
                  { color: isSold ? colors.accent : '#10B981' },
                ]}
              >
                {isSold ? 'Re-list' : 'Mark Sold'}
              </Text>
            </Pressable>

            <Pressable style={styles.deleteIconBtn} onPress={() => confirmDelete(item)}>
              <Ionicons name="trash-outline" size={16} color={colors.destructive} />
            </Pressable>
          </View>
        </Pressable>
      </Animated.View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.systemBackground }]}>
      <Stack.Screen
        options={{
          title: 'My Listings',
          headerShown: true,
          headerStyle: { backgroundColor: colors.cardBackground },
          headerTintColor: colors.label,
        }}
      />

      {/* Tabs */}
      <View style={[styles.tabsHeader, { backgroundColor: colors.cardBackground, borderBottomColor: colors.separator }]}>
        <Pressable
          style={[
            styles.tabBtn,
            activeTab === 'available' && { borderBottomColor: colors.accent, borderBottomWidth: 2 },
          ]}
          onPress={() => setActiveTab('available')}
        >
          <Text
            style={[
              styles.tabText,
              { color: activeTab === 'available' ? colors.accent : colors.secondaryLabel },
            ]}
          >
            Active ({data?.summary?.active || 0})
          </Text>
        </Pressable>

        <Pressable
          style={[
            styles.tabBtn,
            activeTab === 'sold' && { borderBottomColor: colors.accent, borderBottomWidth: 2 },
          ]}
          onPress={() => setActiveTab('sold')}
        >
          <Text
            style={[
              styles.tabText,
              { color: activeTab === 'sold' ? colors.accent : colors.secondaryLabel },
            ]}
          >
            Sold ({data?.summary?.sold || 0})
          </Text>
        </Pressable>
      </View>

      {/* Feed */}
      {isLoading ? (
        <View style={styles.loadingCenter}>
          <ActivityIndicator size="large" color={colors.accent} />
          <Text style={[styles.loadingText, { color: colors.secondaryLabel }]}>Loading your items...</Text>
        </View>
      ) : (
        <FlatList
          data={filteredItems}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={[
            styles.listContent,
            { paddingBottom: insets.bottom + 30 },
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
              <Ionicons name="pricetags-outline" size={48} color={colors.tertiaryLabel} />
              <Text style={[styles.emptyTitle, { color: colors.label }]}>
                {activeTab === 'available' ? 'No Active Listings' : 'No Sold Items Yet'}
              </Text>
              <Text style={[styles.emptySubtitle, { color: colors.secondaryLabel }]}>
                {activeTab === 'available'
                  ? 'Got anything you want to sell or donate to college juniors?'
                  : 'Items you mark as sold will appear here.'}
              </Text>
              {activeTab === 'available' && (
                <Pressable
                  style={[styles.postBtn, { backgroundColor: colors.accent }]}
                  onPress={() => router.push('/marketplace/post' as any)}
                >
                  <Ionicons name="add-circle" size={18} color="#FFFFFF" />
                  <Text style={styles.postBtnText}>Post an Item</Text>
                </Pressable>
              )}
            </View>
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
  tabsHeader: {
    flexDirection: 'row',
    borderBottomWidth: 1,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 14,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabText: {
    fontSize: 13,
    fontWeight: '700',
  },
  listContent: {
    padding: 14,
    gap: 10,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 14,
    borderWidth: 1,
    gap: 12,
  },
  thumbnailContainer: {
    width: 64,
    height: 64,
    borderRadius: 10,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  thumbnail: {
    width: '100%',
    height: '100%',
  },
  infoCol: {
    flex: 1,
    gap: 2,
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
  },
  price: {
    fontSize: 13,
    fontWeight: '700',
  },
  dateText: {
    fontSize: 11,
  },
  actionCol: {
    alignItems: 'flex-end',
    gap: 6,
  },
  statusToggleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 8,
  },
  statusToggleText: {
    fontSize: 11,
    fontWeight: '700',
  },
  deleteIconBtn: {
    padding: 4,
  },
  loadingCenter: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 13,
  },
  emptyContainer: {
    paddingTop: 80,
    alignItems: 'center',
    paddingHorizontal: 30,
    gap: 6,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginTop: 10,
  },
  emptySubtitle: {
    fontSize: 12,
    textAlign: 'center',
  },
  postBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 16,
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 20,
  },
  postBtnText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 13,
  },
});
