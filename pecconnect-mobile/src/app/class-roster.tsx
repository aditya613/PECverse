import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  TextInput,
  RefreshControl,
  ActivityIndicator,
  Alert,
  Image,
} from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { Stack, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import * as Clipboard from 'expo-clipboard';
import Animated, { FadeInUp, FadeInDown } from 'react-native-reanimated';
import { useTheme } from '@/theme/colors';
import {
  fetchClassMembers,
  ClassMember,
  getFullImageUrl,
} from '@/utils/classRosterApi';

type SortOption = 'roll_no' | 'name' | 'latest';

export default function ClassRosterScreen() {
  const insets = useSafeAreaInsets();
  const { colors, isDark } = useTheme();
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState<SortOption>('roll_no');

  const { data, isLoading, isError, refetch, isRefetching } = useQuery({
    queryKey: ['classMembers', sortOption],
    queryFn: () => fetchClassMembers({ sort: sortOption }),
  });

  const classInfo = data?.class;
  const stats = data?.stats;
  const rawMembers = data?.members || [];
  const isViewerCr = !!stats?.is_viewer_cr;

  // Filter members by search keyword (name or roll number)
  const filteredMembers = useMemo(() => {
    if (!searchQuery.trim()) return rawMembers;
    const q = searchQuery.toLowerCase().trim();
    return rawMembers.filter(
      (m) =>
        m.name.toLowerCase().includes(q) ||
        (m.roll_no && m.roll_no.toLowerCase().includes(q))
    );
  }, [rawMembers, searchQuery]);

  const cycleSort = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (sortOption === 'roll_no') setSortOption('name');
    else if (sortOption === 'name') setSortOption('latest');
    else setSortOption('roll_no');
  };

  const sortLabel = {
    roll_no: 'Roll No',
    name: 'Name (A-Z)',
    latest: 'Recently Joined',
  }[sortOption];

  // CR Action: Copy Roll Numbers to Clipboard
  const handleCopyRollNumbers = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    const validRolls = filteredMembers
      .map((m) => m.roll_no?.trim())
      .filter((r): r is string => !!r);

    if (validRolls.length === 0) {
      Alert.alert('No Roll Numbers', 'None of the students in this list have a registered roll number yet.');
      return;
    }

    const commaSeparated = validRolls.join(', ');
    await Clipboard.setStringAsync(commaSeparated);

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    Alert.alert(
      'Copied to Clipboard!',
      `Copied ${validRolls.length} roll numbers.\n\nReady to paste into WhatsApp, attendance records, or spreadsheets.`,
      [{ text: 'OK' }]
    );
  };

  // Helper to generate a consistent avatar background color from name
  const getAvatarColor = (name: string) => {
    const palette = [
      '#3B82F6', '#6366F1', '#8B5CF6', '#EC4899', 
      '#10B981', '#14B8A6', '#F59E0B', '#06B6D4'
    ];
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return palette[Math.abs(hash) % palette.length];
  };

  const renderMember = ({ item, index }: { item: ClassMember; index: number }) => {
    const avatarBg = getAvatarColor(item.name);
    const initials = item.name
      .trim()
      .split(/\s+/)
      .map((n) => n[0] || '')
      .join('')
      .substring(0, 2)
      .toUpperCase();

    const formattedDate = item.joined_at
      ? new Date(item.joined_at).toLocaleDateString(undefined, {
          month: 'short',
          day: 'numeric',
        })
      : null;

    return (
      <Animated.View entering={FadeInUp.delay(Math.min(index * 25, 250)).springify()}>
        <View
          style={[
            styles.memberCard,
            {
              backgroundColor: colors.cardBackground,
              borderColor: item.is_cr ? colors.accent + '40' : colors.cardBorder,
            },
          ]}
        >
          {/* Avatar */}
          <View style={styles.avatarContainer}>
            {item.profile_photo ? (
              <Image
                source={{ uri: getFullImageUrl(item.profile_photo) || '' }}
                style={styles.avatarImg}
              />
            ) : (
              <View style={[styles.avatarFallback, { backgroundColor: avatarBg }]}>
                <Text style={styles.avatarText}>{initials || 'ST'}</Text>
              </View>
            )}
            {item.is_cr && (
              <View style={styles.crStarBadge}>
                <Ionicons name="star" size={10} color="#FFFFFF" />
              </View>
            )}
          </View>

          {/* Details */}
          <View style={styles.memberInfo}>
            <View style={styles.nameRow}>
              <Text style={[styles.memberName, { color: colors.label }]} numberOfLines={1}>
                {item.name}
              </Text>
              {item.is_cr && (
                <View style={[styles.crPill, { backgroundColor: colors.accent + '20' }]}>
                  <Text style={[styles.crPillText, { color: colors.accent }]}>CR</Text>
                </View>
              )}
            </View>

            <View style={styles.metaRow}>
              {item.roll_no ? (
                <View style={[styles.rollChip, { backgroundColor: colors.secondarySystemBackground }]}>
                  <Ionicons name="id-card-outline" size={12} color={colors.secondaryLabel} />
                  <Text style={[styles.rollText, { color: colors.label }]}>{item.roll_no}</Text>
                </View>
              ) : (
                <Text style={[styles.pendingText, { color: colors.tertiaryLabel }]}>Roll No Pending</Text>
              )}

              {formattedDate && (
                <Text style={[styles.joinedText, { color: colors.tertiaryLabel }]}>
                  Joined {formattedDate}
                </Text>
              )}
            </View>
          </View>
        </View>
      </Animated.View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.systemBackground }]}>
      <Stack.Screen
        options={{
          title: 'Class Roster',
          headerShown: true,
          headerStyle: { backgroundColor: colors.cardBackground },
          headerTintColor: colors.label,
          headerShadowVisible: false,
        }}
      />

      {/* Top Banner / Summary Card */}
      {classInfo && (
        <Animated.View entering={FadeInDown.duration(250)} style={styles.headerBanner}>
          <View
            style={[
              styles.classCard,
              { backgroundColor: colors.cardBackground, borderColor: colors.cardBorder },
            ]}
          >
            <View style={styles.classCardTop}>
              <View style={{ flex: 1 }}>
                <Text style={[styles.classGroupName, { color: colors.label }]}>
                  {classInfo.group_name}
                </Text>
                <Text style={[styles.branchSubtitle, { color: colors.secondaryLabel }]}>
                  {classInfo.branch} • Year {classInfo.year}
                </Text>
              </View>

              <View style={[styles.countBadge, { backgroundColor: colors.accent + '15' }]}>
                <Ionicons name="people" size={16} color={colors.accent} />
                <Text style={[styles.countBadgeText, { color: colors.accent }]}>
                  {stats?.total_enrolled || 0}
                </Text>
              </View>
            </View>

            {/* CR Info & Actions */}
            <View style={[styles.classCardDivider, { backgroundColor: colors.separator }]} />

            <View style={styles.classCardBottom}>
              <View style={styles.crDisplayRow}>
                <Ionicons name="shield-checkmark" size={15} color={colors.accent} />
                <Text style={[styles.crLabelText, { color: colors.secondaryLabel }]}>Class Rep:</Text>
                <Text style={[styles.crNameText, { color: colors.label }]} numberOfLines={1}>
                  {classInfo.cr?.name || 'Not appointed'}
                </Text>
              </View>

              {/* CR Copy Roster Action */}
              {isViewerCr && (
                <Pressable
                  style={[styles.copyRosterBtn, { backgroundColor: colors.accent }]}
                  onPress={handleCopyRollNumbers}
                >
                  <Ionicons name="copy-outline" size={13} color="#FFFFFF" />
                  <Text style={styles.copyRosterBtnText}>Copy Rolls</Text>
                </Pressable>
              )}
            </View>
          </View>
        </Animated.View>
      )}

      {/* Search & Sort Bar */}
      <View style={[styles.searchSection, { backgroundColor: colors.systemBackground }]}>
        <View
          style={[
            styles.searchBar,
            { backgroundColor: colors.cardBackground, borderColor: colors.cardBorder },
          ]}
        >
          <Ionicons name="search" size={18} color={colors.secondaryLabel} style={{ marginLeft: 10 }} />
          <TextInput
            style={[styles.searchInput, { color: colors.label }]}
            placeholder="Search name or roll number..."
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

        <Pressable
          style={[
            styles.sortBtn,
            { backgroundColor: colors.cardBackground, borderColor: colors.cardBorder },
          ]}
          onPress={cycleSort}
        >
          <Ionicons name="swap-vertical" size={14} color={colors.accent} />
          <Text style={[styles.sortBtnText, { color: colors.label }]}>{sortLabel}</Text>
        </Pressable>
      </View>

      {/* Member List Feed */}
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.accent} />
          <Text style={[styles.loadingText, { color: colors.secondaryLabel }]}>
            Loading class members...
          </Text>
        </View>
      ) : isError ? (
        <View style={styles.emptyContainer}>
          <View style={[styles.emptyIconCircle, { backgroundColor: '#EF444415' }]}>
            <Ionicons name="cloud-offline-outline" size={40} color="#EF4444" />
          </View>
          <Text style={[styles.emptyTitle, { color: colors.label }]}>Unable to Load Roster</Text>
          <Text style={[styles.emptySubtitle, { color: colors.secondaryLabel }]}>
            Could not connect to the class database. Please check your internet connection and try again.
          </Text>
          <Pressable
            style={[styles.retryBtn, { backgroundColor: colors.accent }]}
            onPress={() => refetch()}
          >
            <Ionicons name="refresh" size={16} color="#FFFFFF" />
            <Text style={styles.retryBtnText}>Tap to Retry</Text>
          </Pressable>
        </View>
      ) : filteredMembers.length === 0 ? (
        <View style={styles.emptyContainer}>
          <View style={[styles.emptyIconCircle, { backgroundColor: colors.accent + '15' }]}>
            <Ionicons name="search-outline" size={40} color={colors.accent} />
          </View>
          <Text style={[styles.emptyTitle, { color: colors.label }]}>
            {searchQuery ? 'No Students Found' : 'No Students Yet'}
          </Text>
          <Text style={[styles.emptySubtitle, { color: colors.secondaryLabel }]}>
            {searchQuery
              ? `No student matching "${searchQuery}" in this class.`
              : 'Classmates will appear here as soon as they select this section in their profile.'}
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredMembers}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={[
            styles.listContainer,
            { paddingBottom: insets.bottom + 24 },
          ]}
          renderItem={renderMember}
          refreshControl={
            <RefreshControl
              refreshing={isRefetching}
              onRefresh={refetch}
              tintColor={colors.accent}
            />
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
  headerBanner: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 4,
  },
  classCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  classCardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  classGroupName: {
    fontSize: 17,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  branchSubtitle: {
    fontSize: 13,
    fontWeight: '500',
    marginTop: 2,
  },
  countBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
  },
  countBadgeText: {
    fontSize: 14,
    fontWeight: '800',
  },
  classCardDivider: {
    height: 1,
    marginVertical: 12,
  },
  classCardBottom: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  crDisplayRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flex: 1,
  },
  crLabelText: {
    fontSize: 12,
    fontWeight: '600',
  },
  crNameText: {
    fontSize: 13,
    fontWeight: '700',
  },
  copyRosterBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  copyRosterBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  searchSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    height: 42,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    paddingHorizontal: 10,
    height: '100%',
  },
  sortBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    height: 42,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  sortBtnText: {
    fontSize: 12,
    fontWeight: '600',
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingTop: 4,
    gap: 10,
  },
  memberCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    gap: 12,
  },
  avatarContainer: {
    position: 'relative',
  },
  avatarImg: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  avatarFallback: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
  crStarBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    backgroundColor: '#F59E0B',
    width: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  memberInfo: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  memberName: {
    fontSize: 15,
    fontWeight: '700',
    flexShrink: 1,
  },
  crPill: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  crPillText: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 4,
  },
  rollChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  rollText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  pendingText: {
    fontSize: 11,
    fontStyle: 'italic',
  },
  joinedText: {
    fontSize: 11,
    marginLeft: 'auto',
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
    gap: 12,
  },
  loadingText: {
    fontSize: 14,
    fontWeight: '500',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 36,
    gap: 10,
  },
  emptyIconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: '800',
  },
  emptySubtitle: {
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 18,
  },
  retryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
  },
  retryBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
});
