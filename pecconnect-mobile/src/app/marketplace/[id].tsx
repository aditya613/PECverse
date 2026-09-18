import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Pressable,
  Linking,
  Alert,
  ActivityIndicator,
  Share,
} from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/theme/colors';
import {
  fetchMarketplaceItem,
  updateMarketplaceItemStatus,
  deleteMarketplaceItem,
  reportMarketplaceItem,
  getFullImageUrl,
} from '@/utils/marketplaceApi';

export default function MarketplaceItemDetails() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const { colors, isDark } = useTheme();
  const router = useRouter();
  const queryClient = useQueryClient();

  const [isReporting, setIsReporting] = useState(false);

  const { data: item, isLoading, error, refetch } = useQuery({
    queryKey: ['marketplaceItem', id],
    queryFn: () => fetchMarketplaceItem(id),
    enabled: !!id,
  });

  // Toggle Sold Mutation
  const toggleStatusMutation = useMutation({
    mutationFn: (newStatus: 'available' | 'sold') =>
      updateMarketplaceItemStatus(id, newStatus),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['marketplaceItem', id] });
      queryClient.invalidateQueries({ queryKey: ['marketplaceItems'] });
      queryClient.invalidateQueries({ queryKey: ['myMarketplaceListings'] });
    },
    onError: (err: any) => {
      Alert.alert('Error', err.response?.data?.message || 'Failed to update status');
    },
  });

  // Delete Listing Mutation
  const deleteMutation = useMutation({
    mutationFn: () => deleteMarketplaceItem(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['marketplaceItems'] });
      queryClient.invalidateQueries({ queryKey: ['myMarketplaceListings'] });
      Alert.alert('Success', 'Listing deleted successfully');
      router.back();
    },
    onError: (err: any) => {
      Alert.alert('Error', err.response?.data?.message || 'Failed to delete listing');
    },
  });

  const confirmDelete = () => {
    Alert.alert(
      'Delete Listing',
      'Are you sure you want to permanently delete this listing?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => deleteMutation.mutate() },
      ]
    );
  };

  const handleWhatsApp = async () => {
    if (!item) return;
    const phone = item.contact_whatsapp || item.contact_phone;
    if (!phone) {
      Alert.alert('No WhatsApp', 'The seller did not provide a WhatsApp contact number.');
      return;
    }

    // Clean phone number: remove non-digits
    let cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.length === 10) {
      cleanPhone = '91' + cleanPhone; // Add India country code if 10 digits
    }

    const sellerName = item.user?.name || 'Seller';
    const message = encodeURIComponent(
      `Hi ${sellerName}! I saw your listing for "${item.title}" on PECverse Marketplace. Is it still available?`
    );
    const webUrl = `https://wa.me/${cleanPhone}?text=${message}`;
    const appUrl = `whatsapp://send?phone=${cleanPhone}&text=${message}`;

    try {
      await Linking.openURL(webUrl);
    } catch (err) {
      try {
        await Linking.openURL(appUrl);
      } catch (err2) {
        Alert.alert('WhatsApp Error', 'Could not open WhatsApp. You can call the seller directly.');
      }
    }
  };

  const handleCall = async () => {
    if (!item) return;
    const phone = item.contact_phone || item.contact_whatsapp;
    if (!phone) {
      Alert.alert('No Phone Number', 'The seller did not provide a direct phone number.');
      return;
    }
    const cleanPhone = phone.replace(/\D/g, '');
    try {
      await Linking.openURL(`tel:${cleanPhone}`);
    } catch (e) {
      Alert.alert('Call Error', 'Unable to initiate phone call on this device.');
    }
  };

  const handleShare = async () => {
    if (!item) return;
    try {
      await Share.share({
        title: item.title,
        message: `Check out "${item.title}" for ${
          item.price === 0 ? 'FREE' : `₹${item.price}`
        } on PECverse Campus Marketplace!`,
      });
    } catch (e) {
      // Ignore
    }
  };

  const handleReport = () => {
    Alert.prompt
      ? Alert.prompt(
          'Report Listing',
          'Please specify why this listing is inappropriate, misleading, or spam:',
          [
            { text: 'Cancel', style: 'cancel' },
            {
              text: 'Report',
              style: 'destructive',
              onPress: async (text?: string) => {
                if (!text || text.trim() === '') return;
                try {
                  setIsReporting(true);
                  await reportMarketplaceItem(id, text.trim());
                  Alert.alert('Reported', 'Thank you for reporting. Our moderators will review it.');
                } catch (e: any) {
                  Alert.alert('Error', e.response?.data?.message || 'Failed to submit report');
                } finally {
                  setIsReporting(false);
                }
              },
            },
          ],
          'plain-text'
        )
      : Alert.alert(
          'Report Listing',
          'Do you want to report this listing as spam or inappropriate?',
          [
            { text: 'Cancel', style: 'cancel' },
            {
              text: 'Report Spam',
              style: 'destructive',
              onPress: async () => {
                try {
                  await reportMarketplaceItem(id, 'Spam / Misleading / Inappropriate');
                  Alert.alert('Reported', 'Thank you for reporting.');
                } catch (e: any) {
                  Alert.alert('Error', e.response?.data?.message || 'Failed to submit report');
                }
              },
            },
          ]
        );
  };

  if (isLoading) {
    return (
      <View style={[styles.loadingCenter, { backgroundColor: colors.systemBackground }]}>
        <ActivityIndicator size="large" color={colors.accent} />
        <Text style={[styles.loadingText, { color: colors.secondaryLabel }]}>Loading details...</Text>
      </View>
    );
  }

  if (error || !item) {
    return (
      <View style={[styles.loadingCenter, { backgroundColor: colors.systemBackground }]}>
        <Ionicons name="alert-circle-outline" size={48} color={colors.destructive} />
        <Text style={[styles.errorTitle, { color: colors.label }]}>Listing Unavailable</Text>
        <Text style={[styles.errorSubtitle, { color: colors.secondaryLabel }]}>
          This item could not be loaded or may have been removed by the seller.
        </Text>
        <View style={{ flexDirection: 'row', gap: 12, marginTop: 16 }}>
          <Pressable
            style={[styles.backBtn, { backgroundColor: colors.secondarySystemBackground, minWidth: 100 }]}
            onPress={() => refetch()}
          >
            <Text style={[styles.backBtnText, { color: colors.label }]}>Retry</Text>
          </Pressable>
          <Pressable
            style={[styles.backBtn, { backgroundColor: colors.accent, minWidth: 140 }]}
            onPress={() => router.back()}
          >
            <Text style={styles.backBtnText}>Back to Feed</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  const isOwner = !!item.is_owner;
  const isSold = item.status === 'sold';
  const isFree = item.price === 0;

  const categoryLabels: Record<string, string> = {
    cycles: '🚲 Cycle',
    academics: '📐 Academics & Drafters',
    hostel: '🛏️ Hostel Essentials',
    electronics: '💻 Electronics',
    fashion: '🥼 Lab Coats & Wear',
    others: '🏷️ Other Gear',
  };

  const conditionLabels: Record<string, string> = {
    like_new: '✨ Like New',
    good: '👍 Good Condition',
    fair: '👌 Fair / Usable',
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.systemBackground }]}>
      <Stack.Screen
        options={{
          title: item.title,
          headerShown: true,
          headerStyle: { backgroundColor: colors.cardBackground },
          headerTintColor: colors.label,
          headerRight: () => (
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              <Pressable onPress={handleShare}>
                <Ionicons name="share-outline" size={22} color={colors.label} />
              </Pressable>
              {!isOwner && (
                <Pressable onPress={handleReport} disabled={isReporting}>
                  <Ionicons name="flag-outline" size={20} color={colors.secondaryLabel} />
                </Pressable>
              )}
            </View>
          ),
        }}
      />

      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 90 },
        ]}
      >
        {/* Hero Image */}
        <View style={[styles.heroImageContainer, { backgroundColor: isDark ? '#18181B' : '#F1F5F9' }]}>
          {item.image_url ? (
            <Image
              source={{ uri: getFullImageUrl(item.image_url) || '' }}
              style={styles.heroImage}
              resizeMode="cover"
            />
          ) : (
            <View style={styles.heroPlaceholder}>
              <Ionicons name="cart-outline" size={64} color={colors.tertiaryLabel} />
              <Text style={[styles.placeholderText, { color: colors.tertiaryLabel }]}>
                No photo attached
              </Text>
            </View>
          )}

          {/* Sold Stamp */}
          {isSold && (
            <View style={styles.soldBanner}>
              <Text style={styles.soldBannerText}>THIS ITEM IS SOLD</Text>
            </View>
          )}
        </View>

        <View style={styles.body}>
          {/* Price & Status Row */}
          <View style={styles.priceRow}>
            <View>
              <Text style={[styles.priceTag, { color: isFree ? '#10B981' : colors.label }]}>
                {isFree ? '🎁 FREE / DONATION' : `₹${item.price.toLocaleString('en-IN')}`}
              </Text>
              <Text style={[styles.postedDate, { color: colors.tertiaryLabel }]}>
                Listed on{' '}
                {new Date(item.created_at).toLocaleDateString(undefined, {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </Text>
            </View>

            <View
              style={[
                styles.statusBadge,
                isSold
                  ? { backgroundColor: colors.destructiveBg }
                  : { backgroundColor: colors.successBg },
              ]}
            >
              <View
                style={[
                  styles.statusDot,
                  { backgroundColor: isSold ? colors.destructive : colors.success },
                ]}
              />
              <Text
                style={[
                  styles.statusText,
                  { color: isSold ? colors.destructive : colors.success },
                ]}
              >
                {isSold ? 'SOLD' : 'AVAILABLE'}
              </Text>
            </View>
          </View>

          {/* Title */}
          <Text style={[styles.title, { color: colors.label }]}>{item.title}</Text>

          {/* Tag Chips Row */}
          <View style={styles.chipsRow}>
            <View style={[styles.chip, { backgroundColor: colors.secondarySystemBackground }]}>
              <Text style={[styles.chipText, { color: colors.label }]}>
                {categoryLabels[item.category] || '🏷️ General'}
              </Text>
            </View>
            <View style={[styles.chip, { backgroundColor: colors.secondarySystemBackground }]}>
              <Text style={[styles.chipText, { color: colors.label }]}>
                {conditionLabels[item.condition] || 'Good'}
              </Text>
            </View>
          </View>

          {/* Location Badge */}
          {item.location && (
            <View style={[styles.locationCard, { backgroundColor: colors.cardBackground, borderColor: colors.cardBorder }]}>
              <Ionicons name="location" size={18} color={colors.accent} />
              <View style={{ flex: 1 }}>
                <Text style={[styles.locationHeading, { color: colors.secondaryLabel }]}>Pick-up Location</Text>
                <Text style={[styles.locationValue, { color: colors.label }]}>{item.location}</Text>
              </View>
            </View>
          )}

          {/* Description Section */}
          <View style={[styles.sectionCard, { backgroundColor: colors.cardBackground, borderColor: colors.cardBorder }]}>
            <Text style={[styles.sectionTitle, { color: colors.label }]}>Item Description</Text>
            <Text style={[styles.descriptionText, { color: colors.secondaryLabel }]}>
              {item.description}
            </Text>
          </View>

          {/* Seller Profile Card */}
          <View style={[styles.sectionCard, { backgroundColor: colors.cardBackground, borderColor: colors.cardBorder }]}>
            <Text style={[styles.sectionTitle, { color: colors.label }]}>Seller Information</Text>
            <View style={styles.sellerRow}>
              <View style={[styles.sellerAvatar, { backgroundColor: colors.accent + '25' }]}>
                {item.user?.profile_photo ? (
                  <Image source={{ uri: getFullImageUrl(item.user.profile_photo) || '' }} style={styles.avatarImg} />
                ) : (
                  <Text style={[styles.avatarInitial, { color: colors.accent }]}>
                    {item.user?.name ? item.user.name.charAt(0).toUpperCase() : 'S'}
                  </Text>
                )}
              </View>
              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <Text style={[styles.sellerNameText, { color: colors.label }]}>
                    {item.user?.name || 'PEC Student'}
                  </Text>
                  <Ionicons name="checkmark-circle" size={16} color={colors.accent} />
                </View>
                <Text style={[styles.sellerBranchText, { color: colors.secondaryLabel }]}>
                  {item.user?.branch || 'Punjab Engineering College'}
                </Text>
              </View>
            </View>
          </View>

          {/* Campus Safety Notice */}
          <View style={[styles.safetyCard, { backgroundColor: colors.secondarySystemBackground }]}>
            <Ionicons name="shield-checkmark-outline" size={20} color={colors.accent} style={{ marginTop: 2 }} />
            <View style={{ flex: 1 }}>
              <Text style={[styles.safetyTitle, { color: colors.label }]}>Safe Campus Trading</Text>
              <Text style={[styles.safetySubtitle, { color: colors.secondaryLabel }]}>
                Always meet on campus (Hostels, Nescafe, or StuC) to inspect items in person before paying. Never send advance payment.
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Sticky Action Bar */}
      <View
        style={[
          styles.bottomBar,
          {
            backgroundColor: colors.cardBackground,
            borderTopColor: colors.separator,
            paddingBottom: insets.bottom + 10,
          },
        ]}
      >
        {isOwner ? (
          <View style={styles.ownerActionsRow}>
            <Pressable
              style={[
                styles.ownerStatusBtn,
                { backgroundColor: isSold ? colors.accent : '#10B981' },
              ]}
              onPress={() => toggleStatusMutation.mutate(isSold ? 'available' : 'sold')}
              disabled={toggleStatusMutation.isPending}
            >
              <Ionicons
                name={isSold ? 'refresh-outline' : 'checkmark-done-outline'}
                size={18}
                color="#FFFFFF"
              />
              <Text style={styles.ownerStatusBtnText}>
                {isSold ? 'Re-list as Available' : 'Mark as Sold'}
              </Text>
            </Pressable>

            <Pressable
              style={[styles.ownerDeleteBtn, { backgroundColor: colors.destructiveBg }]}
              onPress={confirmDelete}
              disabled={deleteMutation.isPending}
            >
              <Ionicons name="trash-outline" size={18} color={colors.destructive} />
            </Pressable>
          </View>
        ) : (
          <View style={styles.buyerActionsRow}>
            {(item.contact_phone || item.contact_whatsapp) && (
              <Pressable
                style={[styles.callBtn, { backgroundColor: colors.secondarySystemBackground, borderColor: colors.cardBorder }]}
                onPress={handleCall}
              >
                <Ionicons name="call" size={18} color={colors.label} />
                <Text style={[styles.callBtnText, { color: colors.label }]}>Call</Text>
              </Pressable>
            )}

            <Pressable
              style={[styles.whatsappBtn, { backgroundColor: '#25D366' }]}
              onPress={handleWhatsApp}
            >
              <Ionicons name="logo-whatsapp" size={20} color="#FFFFFF" />
              <Text style={styles.whatsappBtnText}>Chat on WhatsApp</Text>
            </Pressable>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingCenter: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginTop: 12,
  },
  errorSubtitle: {
    fontSize: 13,
    textAlign: 'center',
    marginTop: 6,
    marginBottom: 20,
  },
  backBtn: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  backBtnText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  scrollContent: {
    paddingBottom: 24,
  },
  heroImageContainer: {
    width: '100%',
    height: 280,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroPlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    marginTop: 8,
    fontSize: 13,
  },
  soldBanner: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(239, 68, 68, 0.9)',
    paddingVertical: 8,
    alignItems: 'center',
  },
  soldBannerText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 13,
    letterSpacing: 1,
  },
  body: {
    padding: 16,
    gap: 14,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  priceTag: {
    fontSize: 26,
    fontWeight: '800',
  },
  postedDate: {
    fontSize: 11,
    marginTop: 2,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 14,
  },
  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    lineHeight: 26,
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  chipText: {
    fontSize: 12,
    fontWeight: '600',
  },
  locationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  locationHeading: {
    fontSize: 11,
    fontWeight: '500',
  },
  locationValue: {
    fontSize: 13,
    fontWeight: '600',
    marginTop: 1,
  },
  sectionCard: {
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    gap: 8,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  descriptionText: {
    fontSize: 14,
    lineHeight: 22,
  },
  sellerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 4,
  },
  sellerAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  avatarImg: {
    width: '100%',
    height: '100%',
  },
  avatarInitial: {
    fontSize: 18,
    fontWeight: '700',
  },
  sellerNameText: {
    fontSize: 14,
    fontWeight: '700',
  },
  sellerBranchText: {
    fontSize: 12,
    marginTop: 2,
  },
  safetyCard: {
    flexDirection: 'row',
    gap: 10,
    padding: 14,
    borderRadius: 12,
  },
  safetyTitle: {
    fontSize: 12,
    fontWeight: '700',
  },
  safetySubtitle: {
    fontSize: 11,
    lineHeight: 16,
    marginTop: 2,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingTop: 12,
    paddingHorizontal: 16,
    borderTopWidth: 1,
  },
  ownerActionsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  ownerStatusBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 48,
    borderRadius: 24,
  },
  ownerStatusBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
  ownerDeleteBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buyerActionsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  callBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingHorizontal: 18,
    height: 48,
    borderRadius: 24,
    borderWidth: 1,
  },
  callBtnText: {
    fontWeight: '600',
    fontSize: 14,
  },
  whatsappBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 48,
    borderRadius: 24,
  },
  whatsappBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
});
