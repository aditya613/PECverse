import React, { useState, useMemo, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  ActivityIndicator,
  TextInput,
  Modal,
  Dimensions,
  RefreshControl,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/utils/api';
import { useTheme } from '@/theme/colors';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeInDown, FadeInRight } from 'react-native-reanimated';
import { trackScreen, trackEvent } from '@/utils/analytics';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const DAYS = [
  { id: 1, label: 'Mon', full: 'Monday' },
  { id: 2, label: 'Tue', full: 'Tuesday' },
  { id: 3, label: 'Wed', full: 'Wednesday' },
  { id: 4, label: 'Thu', full: 'Thursday' },
  { id: 5, label: 'Fri', full: 'Friday' },
];

const CATEGORIES = [
  { id: 'all', label: 'All Rooms', icon: 'business-outline' },
  { id: 'classroom', label: 'Classrooms', icon: 'school-outline' },
  { id: 'lecture_hall', label: 'Lecture Halls', icon: 'easel-outline' },
  { id: 'lab', label: 'Labs', icon: 'desktop-outline' },
];

interface SlotDef {
  slot_index: number;
  time_label: string;
  start_time: string;
  end_time: string;
  display_label: string;
}

interface VenueSlot {
  slot_index: number;
  time_label: string;
  display_label: string;
  start_time: string;
  end_time: string;
  is_occupied: boolean;
}

interface VenueItem {
  id: number;
  code: string;
  name: string;
  type: 'lecture_hall' | 'classroom' | 'lab';
  floor: string | null;
  capacity: number | null;
  slots: VenueSlot[];
  is_free_in_selected_slot: boolean;
  consecutive_free_hours: number;
  status_now: 'vacant' | 'occupied' | 'closed';
  total_free_slots_today: number;
  total_occupied_slots_today: number;
}

interface OccupancyResponse {
  day_of_week: number;
  day_name: string;
  current_iso_day: number;
  current_time: string;
  current_slot_index: number | null;
  selected_slot_index: number;
  summary: {
    total_venues: number;
    vacant_count: number;
    occupied_count: number;
  };
  slot_definitions: SlotDef[];
  venues: VenueItem[];
}

export default function VacantClassesScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colors, isDark } = useTheme();

  // Determine initial day (1=Mon ... 5=Fri; fallback to 1 on weekends)
  const todayJs = new Date().getDay();
  const initialDay = todayJs >= 1 && todayJs <= 5 ? todayJs : 1;

  const [selectedDay, setSelectedDay] = useState(initialDay);
  const [selectedSlot, setSelectedSlot] = useState<number>(1);
  const [isLiveNowActive, setIsLiveNowActive] = useState(false);
  const [viewMode, setViewMode] = useState<'card' | 'matrix'>('card');
  const [statusFilter, setStatusFilter] = useState<'all' | 'free' | 'occupied'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedVenueModal, setSelectedVenueModal] = useState<VenueItem | null>(null);

  useEffect(() => {
    trackScreen('vacant_classes');
  }, []);

  // Fetch Occupancy Data
  const { data, isLoading, refetch, isRefetching } = useQuery<OccupancyResponse>({
    queryKey: ['venue-occupancy', selectedDay, selectedSlot],
    queryFn: async () => {
      const res = await api.get('/venues/occupancy', {
        params: {
          day: selectedDay,
          slot: selectedSlot,
        },
      });
      return res.data;
    },
    staleTime: 3 * 60 * 1000,
  });

  // Automatically sync to current slot if "Right Now" is activated or on initial load
  useEffect(() => {
    if (data && data.current_slot_index && !isLiveNowActive && selectedDay === data.current_iso_day) {
      setSelectedSlot(data.current_slot_index);
      setIsLiveNowActive(true);
    }
  }, [data?.current_slot_index, data?.current_iso_day]);

  const handleSelectDay = (dayId: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedDay(dayId);
    setIsLiveNowActive(false);
    trackEvent('venue_day_changed', { day: dayId });
  };

  const handleSelectSlot = (slotIdx: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedSlot(slotIdx);
    setIsLiveNowActive(false);
    trackEvent('venue_slot_changed', { slot: slotIdx });
  };

  const handleSelectLiveNow = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    if (data?.current_slot_index) {
      setSelectedDay(data.current_iso_day >= 1 && data.current_iso_day <= 5 ? data.current_iso_day : 1);
      setSelectedSlot(data.current_slot_index);
      setIsLiveNowActive(true);
    } else {
      setIsLiveNowActive(true);
    }
    trackEvent('venue_live_now_clicked');
  };

  // Filtered venues for display
  const filteredVenues = useMemo(() => {
    if (!data?.venues) return [];

    return data.venues.filter((venue) => {
      // Category filter
      if (categoryFilter !== 'all' && venue.type !== categoryFilter) {
        return false;
      }

      // Status filter
      if (statusFilter === 'free' && !venue.is_free_in_selected_slot) {
        return false;
      }
      if (statusFilter === 'occupied' && venue.is_free_in_selected_slot) {
        return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchCode = venue.code.toLowerCase().includes(q);
        const matchName = venue.name.toLowerCase().includes(q);
        const matchFloor = venue.floor?.toLowerCase().includes(q) ?? false;
        if (!matchCode && !matchName && !matchFloor) {
          return false;
        }
      }

      return true;
    });
  }, [data?.venues, categoryFilter, statusFilter, searchQuery]);

  const selectedSlotLabel = useMemo(() => {
    if (!data?.slot_definitions) return 'Time Slot';
    const s = data.slot_definitions.find((item) => item.slot_index === selectedSlot);
    return s ? s.display_label : 'Time Slot';
  }, [data?.slot_definitions, selectedSlot]);

  return (
    <View style={[styles.container, { backgroundColor: colors.systemBackground }]}>
      {/* 1. Header Bar */}
      <View
        style={[
          styles.headerBar,
          {
            paddingTop: Math.max(insets.top + 6, 44),
            backgroundColor: colors.cardBackground,
            borderBottomColor: colors.cardBorder,
          },
        ]}
      >
        <View style={styles.headerLeft}>
          <Pressable
            style={({ pressed }) => [
              styles.backButton,
              { backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)', opacity: pressed ? 0.7 : 1 },
            ]}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              router.back();
            }}
          >
            <Ionicons name="chevron-back" size={22} color={colors.label} />
          </Pressable>
          <View>
            <Text style={[styles.headerTitle, { color: colors.label }]}>Empty Classrooms</Text>
            <Text style={[styles.headerSubtitle, { color: colors.secondaryLabel }]}>
              Live Campus Venue Occupancy
            </Text>
          </View>
        </View>

        {/* View Switcher: Cards vs Matrix */}
        <View style={[styles.viewSwitcher, { backgroundColor: colors.secondarySystemBackground }]}>
          <Pressable
            style={[
              styles.switchBtn,
              viewMode === 'card' && { backgroundColor: colors.accent },
            ]}
            onPress={() => {
              Haptics.selectionAsync();
              setViewMode('card');
            }}
          >
            <Ionicons
              name="grid"
              size={16}
              color={viewMode === 'card' ? '#FFFFFF' : colors.secondaryLabel}
            />
          </Pressable>
          <Pressable
            style={[
              styles.switchBtn,
              viewMode === 'matrix' && { backgroundColor: colors.accent },
            ]}
            onPress={() => {
              Haptics.selectionAsync();
              setViewMode('matrix');
            }}
          >
            <Ionicons
              name="apps"
              size={16}
              color={viewMode === 'matrix' ? '#FFFFFF' : colors.secondaryLabel}
            />
          </Pressable>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingBottom: Math.max(insets.bottom + 40, 60) }]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              refetch();
            }}
            tintColor={colors.accent}
          />
        }
      >
        {/* 2. Day Selector Bar */}
        <View style={styles.daySelectorRow}>
          {DAYS.map((day) => {
            const isSelected = selectedDay === day.id;
            return (
              <Pressable
                key={day.id}
                style={[
                  styles.dayPill,
                  {
                    backgroundColor: isSelected ? colors.accent : colors.secondarySystemBackground,
                    borderColor: isSelected ? colors.accent : colors.cardBorder,
                  },
                ]}
                onPress={() => handleSelectDay(day.id)}
              >
                <Text
                  style={[
                    styles.dayPillText,
                    {
                      color: isSelected ? '#FFFFFF' : colors.label,
                      fontWeight: isSelected ? '800' : '600',
                    },
                  ]}
                >
                  {day.label}
                </Text>
                {day.id === data?.current_iso_day && (
                  <View
                    style={[
                      styles.todayDot,
                      { backgroundColor: isSelected ? '#FFFFFF' : colors.accent },
                    ]}
                  />
                )}
              </Pressable>
            );
          })}
        </View>

        {/* 3. Time Slots Ribbon */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.slotsScrollRow}
        >
          {/* Quick "Right Now" Button */}
          {data?.current_slot_index && (
            <Pressable
              style={[
                styles.slotPill,
                styles.liveNowPill,
                {
                  backgroundColor: isLiveNowActive ? '#10B981' : isDark ? 'rgba(16, 185, 129, 0.15)' : '#DCFCE7',
                  borderColor: '#10B981',
                },
              ]}
              onPress={handleSelectLiveNow}
            >
              <Ionicons
                name="flash"
                size={14}
                color={isLiveNowActive ? '#FFFFFF' : '#10B981'}
              />
              <Text
                style={[
                  styles.slotPillText,
                  {
                    color: isLiveNowActive ? '#FFFFFF' : '#10B981',
                    fontWeight: '800',
                  },
                ]}
              >
                Right Now
              </Text>
            </Pressable>
          )}

          {data?.slot_definitions?.map((slot) => {
            const isSelected = selectedSlot === slot.slot_index && !isLiveNowActive;
            const isCurrent = slot.slot_index === data.current_slot_index && selectedDay === data.current_iso_day;

            return (
              <Pressable
                key={slot.slot_index}
                style={[
                  styles.slotPill,
                  {
                    backgroundColor: isSelected
                      ? colors.accent
                      : colors.secondarySystemBackground,
                    borderColor: isSelected
                      ? colors.accent
                      : isCurrent
                      ? colors.accent
                      : colors.cardBorder,
                  },
                ]}
                onPress={() => handleSelectSlot(slot.slot_index)}
              >
                <Text
                  style={[
                    styles.slotPillText,
                    {
                      color: isSelected ? '#FFFFFF' : colors.label,
                      fontWeight: isSelected ? '700' : '500',
                    },
                  ]}
                >
                  {slot.time_label}
                </Text>
                {isCurrent && !isSelected && (
                  <View style={[styles.activeHourBadge, { backgroundColor: colors.accent }]} />
                )}
              </Pressable>
            );
          })}
        </ScrollView>

        {/* 4. Live Summary Spotlight Banner */}
        {data && (
          <View
            style={[
              styles.summaryBanner,
              {
                backgroundColor: isDark ? 'rgba(24, 24, 27, 0.7)' : 'rgba(255, 255, 255, 0.9)',
                borderColor: colors.cardBorder,
              },
            ]}
          >
            <View style={styles.summaryTopRow}>
              <View style={styles.summaryTagBox}>
                <Ionicons name="time-outline" size={16} color={colors.accent} />
                <Text style={[styles.summaryTimeText, { color: colors.label }]}>
                  {DAYS.find((d) => d.id === selectedDay)?.full} • {selectedSlotLabel}
                </Text>
              </View>

              {isLiveNowActive && (
                <View style={styles.liveBadge}>
                  <View style={styles.livePulseDot} />
                  <Text style={styles.liveBadgeText}>LIVE</Text>
                </View>
              )}
            </View>

            <View style={styles.summaryStatsRow}>
              <Pressable
                style={[
                  styles.statCard,
                  {
                    backgroundColor: isDark ? 'rgba(16, 185, 129, 0.12)' : 'rgba(16, 185, 129, 0.08)',
                    borderColor: 'rgba(16, 185, 129, 0.3)',
                    borderWidth: statusFilter === 'free' ? 2 : 1,
                  },
                ]}
                onPress={() => {
                  Haptics.selectionAsync();
                  setStatusFilter(statusFilter === 'free' ? 'all' : 'free');
                }}
              >
                <View style={styles.statDotGreen} />
                <View>
                  <Text style={styles.statCountGreen}>{data.summary.vacant_count}</Text>
                  <Text style={[styles.statLabel, { color: colors.secondaryLabel }]}>
                    Vacant Rooms
                  </Text>
                </View>
              </Pressable>

              <Pressable
                style={[
                  styles.statCard,
                  {
                    backgroundColor: isDark ? 'rgba(239, 68, 68, 0.1)' : 'rgba(239, 68, 68, 0.06)',
                    borderColor: 'rgba(239, 68, 68, 0.3)',
                    borderWidth: statusFilter === 'occupied' ? 2 : 1,
                  },
                ]}
                onPress={() => {
                  Haptics.selectionAsync();
                  setStatusFilter(statusFilter === 'occupied' ? 'all' : 'occupied');
                }}
              >
                <View style={styles.statDotRed} />
                <View>
                  <Text style={styles.statCountRed}>{data.summary.occupied_count}</Text>
                  <Text style={[styles.statLabel, { color: colors.secondaryLabel }]}>
                    Occupied
                  </Text>
                </View>
              </Pressable>
            </View>
          </View>
        )}

        {/* 5. Search Bar & Category Filter */}
        <View style={styles.filterSection}>
          <View
            style={[
              styles.searchBar,
              {
                backgroundColor: colors.secondarySystemBackground,
                borderColor: colors.cardBorder,
              },
            ]}
          >
            <Ionicons name="search" size={18} color={colors.tertiaryLabel} />
            <TextInput
              style={[styles.searchInput, { color: colors.label }]}
              placeholder="Search room code (e.g. 305, L21, CL14)..."
              placeholderTextColor={colors.tertiaryLabel}
              value={searchQuery}
              onChangeText={setSearchQuery}
              clearButtonMode="while-editing"
            />
            {searchQuery !== '' && (
              <Pressable onPress={() => setSearchQuery('')}>
                <Ionicons name="close-circle" size={18} color={colors.tertiaryLabel} />
              </Pressable>
            )}
          </View>

          {/* Category Pills */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoryScroll}
          >
            {CATEGORIES.map((cat) => {
              const isSelected = categoryFilter === cat.id;
              return (
                <Pressable
                  key={cat.id}
                  style={[
                    styles.categoryPill,
                    {
                      backgroundColor: isSelected
                        ? colors.label
                        : colors.secondarySystemBackground,
                      borderColor: isSelected ? colors.label : colors.cardBorder,
                    },
                  ]}
                  onPress={() => {
                    Haptics.selectionAsync();
                    setCategoryFilter(cat.id);
                  }}
                >
                  <Ionicons
                    name={cat.icon as any}
                    size={14}
                    color={isSelected ? colors.systemBackground : colors.secondaryLabel}
                  />
                  <Text
                    style={[
                      styles.categoryText,
                      {
                        color: isSelected ? colors.systemBackground : colors.label,
                        fontWeight: isSelected ? '700' : '500',
                      },
                    ]}
                  >
                    {cat.label}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>

        {/* 6. Content Views */}
        {isLoading ? (
          <View style={styles.loaderBox}>
            <ActivityIndicator size="large" color={colors.accent} />
            <Text style={[styles.loadingText, { color: colors.secondaryLabel }]}>
              Loading room occupancy...
            </Text>
          </View>
        ) : filteredVenues.length === 0 ? (
          <View style={styles.emptyBox}>
            <Ionicons name="search-outline" size={48} color={colors.tertiaryLabel} />
            <Text style={[styles.emptyTitle, { color: colors.label }]}>No matching venues</Text>
            <Text style={[styles.emptySub, { color: colors.secondaryLabel }]}>
              Try clearing filters or selecting another time slot.
            </Text>
          </View>
        ) : viewMode === 'card' ? (
          // ================= CARD VIEW =================
          <View style={styles.cardsGrid}>
            {filteredVenues.map((venue, idx) => {
              const isFree = venue.is_free_in_selected_slot;

              return (
                <Animated.View
                  key={venue.id}
                  entering={FadeInDown.delay(idx * 35).springify()}
                  style={[
                    styles.roomCard,
                    {
                      backgroundColor: colors.cardBackground,
                      borderColor: isFree ? 'rgba(16, 185, 129, 0.25)' : colors.cardBorder,
                    },
                  ]}
                >
                  <Pressable
                    style={styles.roomCardInner}
                    onPress={() => {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                      setSelectedVenueModal(venue);
                    }}
                  >
                    <View style={styles.cardHeaderRow}>
                      <View style={styles.codeBox}>
                        <Text style={[styles.codeText, { color: colors.label }]}>
                          {venue.code}
                        </Text>
                        <Text style={[styles.typeBadge, { color: colors.secondaryLabel }]}>
                          {venue.type === 'lecture_hall'
                            ? 'Lecture Hall'
                            : venue.type === 'lab'
                            ? 'Lab'
                            : 'Classroom'}
                        </Text>
                      </View>

                      {/* Status Pill */}
                      <View
                        style={[
                          styles.statusBadge,
                          {
                            backgroundColor: isFree
                              ? isDark
                                ? 'rgba(16, 185, 129, 0.16)'
                                : '#DCFCE7'
                              : isDark
                              ? 'rgba(239, 68, 68, 0.14)'
                              : '#FEE2E2',
                            borderColor: isFree ? '#10B981' : '#EF4444',
                          },
                        ]}
                      >
                        <View
                          style={[
                            styles.statusDot,
                            { backgroundColor: isFree ? '#10B981' : '#EF4444' },
                          ]}
                        />
                        <Text
                          style={[
                            styles.statusBadgeText,
                            { color: isFree ? '#10B981' : '#EF4444' },
                          ]}
                        >
                          {isFree ? 'VACANT' : 'OCCUPIED'}
                        </Text>
                      </View>
                    </View>

                    {/* Room Info */}
                    <View style={styles.roomMetaRow}>
                      <Ionicons name="location-outline" size={13} color={colors.secondaryLabel} />
                      <Text style={[styles.roomMetaText, { color: colors.secondaryLabel }]}>
                        {venue.name} • {venue.floor || 'Main Campus'}
                      </Text>
                    </View>

                    {/* Free Hours Hint */}
                    {isFree && venue.consecutive_free_hours > 0 && (
                      <View style={styles.freeDurationRow}>
                        <Ionicons name="checkmark-circle-outline" size={13} color="#10B981" />
                        <Text style={styles.freeDurationText}>
                          Free for next {venue.consecutive_free_hours} hour
                          {venue.consecutive_free_hours > 1 ? 's' : ''}
                        </Text>
                      </View>
                    )}

                    {/* 9-Slot Mini Visual Timeline Strip */}
                    <View style={styles.miniTimelineWrap}>
                      <Text style={[styles.miniTimelineLabel, { color: colors.tertiaryLabel }]}>
                        Day Schedule (8 AM - 7 PM):
                      </Text>
                      <View style={styles.miniStripRow}>
                        {venue.slots.map((s) => {
                          const isSlotOcc = s.is_occupied;
                          const isSelectedInStrip = s.slot_index === selectedSlot;

                          return (
                            <View
                              key={s.slot_index}
                              style={[
                                styles.stripBlock,
                                {
                                  backgroundColor: isSlotOcc
                                    ? isDark
                                      ? '#3F3F46'
                                      : '#CBD5E1'
                                    : '#10B981',
                                  borderColor: isSelectedInStrip
                                    ? colors.accent
                                    : 'transparent',
                                  borderWidth: isSelectedInStrip ? 2 : 0,
                                },
                              ]}
                            />
                          );
                        })}
                      </View>
                    </View>
                  </Pressable>
                </Animated.View>
              );
            })}
          </View>
        ) : (
          // ================= MATRIX SPREADSHEET VIEW =================
          <View
            style={[
              styles.matrixContainer,
              {
                backgroundColor: colors.cardBackground,
                borderColor: colors.cardBorder,
              },
            ]}
          >
            <ScrollView horizontal showsHorizontalScrollIndicator={true}>
              <View>
                {/* Table Header Row */}
                <View style={[styles.matrixHeaderRow, { borderBottomColor: colors.cardBorder }]}>
                  <View style={[styles.matrixVenueCell, styles.matrixHeaderCell]}>
                    <Text style={[styles.matrixHeaderText, { color: colors.label }]}>Venue</Text>
                  </View>
                  {data?.slot_definitions?.map((s) => (
                    <View
                      key={s.slot_index}
                      style={[
                        styles.matrixSlotCell,
                        styles.matrixHeaderCell,
                        s.slot_index === selectedSlot && {
                          backgroundColor: isDark ? 'rgba(59, 130, 246, 0.15)' : '#EFF6FF',
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.matrixHeaderText,
                          {
                            color: s.slot_index === selectedSlot ? colors.accent : colors.label,
                            fontWeight: s.slot_index === selectedSlot ? '800' : '600',
                          },
                        ]}
                      >
                        {s.time_label}
                      </Text>
                    </View>
                  ))}
                </View>

                {/* Table Body Rows */}
                {filteredVenues.map((venue, rowIdx) => (
                  <View
                    key={venue.id}
                    style={[
                      styles.matrixDataRow,
                      {
                        borderBottomColor: colors.cardBorder,
                        backgroundColor:
                          rowIdx % 2 === 0
                            ? 'transparent'
                            : isDark
                            ? 'rgba(255,255,255,0.02)'
                            : 'rgba(0,0,0,0.015)',
                      },
                    ]}
                  >
                    {/* Sticky Venue Code Column */}
                    <Pressable
                      style={styles.matrixVenueCell}
                      onPress={() => setSelectedVenueModal(venue)}
                    >
                      <Text style={[styles.matrixVenueCode, { color: colors.label }]}>
                        {venue.code}
                      </Text>
                      <Text
                        style={[styles.matrixVenueFloor, { color: colors.secondaryLabel }]}
                        numberOfLines={1}
                      >
                        {venue.floor || venue.type}
                      </Text>
                    </Pressable>

                    {/* 9 Slots */}
                    {venue.slots.map((s) => {
                      const isFree = !s.is_occupied;
                      const isColSelected = s.slot_index === selectedSlot;

                      return (
                        <Pressable
                          key={s.slot_index}
                          style={[
                            styles.matrixCell,
                            {
                              backgroundColor: isColSelected
                                ? isFree
                                  ? 'rgba(16, 185, 129, 0.2)'
                                  : 'rgba(239, 68, 68, 0.2)'
                                : 'transparent',
                            },
                          ]}
                          onPress={() => {
                            setSelectedSlot(s.slot_index);
                            Haptics.selectionAsync();
                          }}
                        >
                          <View
                            style={[
                              styles.matrixStatusBadge,
                              {
                                backgroundColor: isFree
                                  ? '#10B981'
                                  : isDark
                                  ? '#3F3F46'
                                  : '#94A3B8',
                              },
                            ]}
                          >
                            <Text style={styles.matrixStatusText}>
                              {isFree ? 'Free' : 'Occ'}
                            </Text>
                          </View>
                        </Pressable>
                      );
                    })}
                  </View>
                ))}
              </View>
            </ScrollView>
          </View>
        )}
      </ScrollView>

      {/* 7. Detailed Room Schedule Modal */}
      <Modal
        visible={!!selectedVenueModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setSelectedVenueModal(null)}
      >
        <View style={styles.modalOverlay}>
          <Pressable style={styles.modalDismiss} onPress={() => setSelectedVenueModal(null)} />
          <View
            style={[
              styles.modalSheet,
              {
                backgroundColor: colors.cardBackground,
                borderColor: colors.cardBorder,
                paddingBottom: Math.max(insets.bottom + 20, 30),
              },
            ]}
          >
            <View style={styles.modalHandle} />

            {selectedVenueModal && (
              <View>
                <View style={styles.modalHeaderRow}>
                  <View>
                    <Text style={[styles.modalTitle, { color: colors.label }]}>
                      {selectedVenueModal.name}
                    </Text>
                    <Text style={[styles.modalSub, { color: colors.secondaryLabel }]}>
                      Venue Code: {selectedVenueModal.code} • {selectedVenueModal.floor || 'Campus'}
                    </Text>
                  </View>
                  <Pressable
                    style={styles.modalCloseBtn}
                    onPress={() => setSelectedVenueModal(null)}
                  >
                    <Ionicons name="close" size={20} color={colors.secondaryLabel} />
                  </Pressable>
                </View>

                {/* Day Summary */}
                <View
                  style={[
                    styles.modalDayBox,
                    {
                      backgroundColor: colors.secondarySystemBackground,
                      borderColor: colors.cardBorder,
                    },
                  ]}
                >
                  <Text style={[styles.modalDayTitle, { color: colors.label }]}>
                    {DAYS.find((d) => d.id === selectedDay)?.full} Schedule
                  </Text>
                  <Text style={[styles.modalDayStats, { color: '#10B981' }]}>
                    {selectedVenueModal.total_free_slots_today} Free Slots Today
                  </Text>
                </View>

                {/* 9 Slots List */}
                <ScrollView style={styles.modalSlotsList} showsVerticalScrollIndicator={false}>
                  {selectedVenueModal.slots.map((s) => {
                    const isFree = !s.is_occupied;
                    return (
                      <View
                        key={s.slot_index}
                        style={[
                          styles.modalSlotRow,
                          {
                            borderBottomColor: colors.cardBorder,
                            backgroundColor:
                              s.slot_index === selectedSlot
                                ? isDark
                                  ? 'rgba(59, 130, 246, 0.12)'
                                  : '#EFF6FF'
                                : 'transparent',
                          },
                        ]}
                      >
                        <View style={styles.modalSlotTimeBox}>
                          <Text style={[styles.modalSlotTime, { color: colors.label }]}>
                            {s.display_label}
                          </Text>
                          <Text style={[styles.modalSlotPeriod, { color: colors.tertiaryLabel }]}>
                            Period {s.slot_index}
                          </Text>
                        </View>

                        <View
                          style={[
                            styles.modalStatusPill,
                            {
                              backgroundColor: isFree
                                ? isDark
                                  ? 'rgba(16, 185, 129, 0.15)'
                                  : '#DCFCE7'
                                : isDark
                                ? 'rgba(239, 68, 68, 0.15)'
                                : '#FEE2E2',
                            },
                          ]}
                        >
                          <View
                            style={[
                              styles.modalStatusDot,
                              { backgroundColor: isFree ? '#10B981' : '#EF4444' },
                            ]}
                          />
                          <Text
                            style={[
                              styles.modalStatusText,
                              { color: isFree ? '#10B981' : '#EF4444' },
                            ]}
                          >
                            {isFree ? 'Vacant / Available' : 'Occupied'}
                          </Text>
                        </View>
                      </View>
                    );
                  })}
                </ScrollView>
              </View>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerBar: {
    paddingHorizontal: 16,
    paddingBottom: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  backButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  headerSubtitle: {
    fontSize: 11,
    marginTop: 1,
    fontWeight: '500',
  },
  viewSwitcher: {
    flexDirection: 'row',
    padding: 3,
    borderRadius: 10,
    gap: 2,
  },
  switchBtn: {
    width: 32,
    height: 30,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    paddingTop: 12,
  },
  daySelectorRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 8,
    marginBottom: 10,
  },
  dayPill: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    position: 'relative',
  },
  dayPillText: {
    fontSize: 13,
  },
  todayDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    position: 'absolute',
    bottom: 4,
  },
  slotsScrollRow: {
    paddingHorizontal: 16,
    gap: 8,
    paddingBottom: 6,
  },
  slotPill: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  liveNowPill: {
    borderWidth: 1.5,
  },
  slotPillText: {
    fontSize: 12,
  },
  activeHourBadge: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
  },
  summaryBanner: {
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 12,
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
  },
  summaryTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  summaryTagBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  summaryTimeText: {
    fontSize: 13,
    fontWeight: '700',
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    gap: 5,
  },
  livePulseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10B981',
  },
  liveBadgeText: {
    fontSize: 10,
    fontWeight: '900',
    color: '#10B981',
    letterSpacing: 0.5,
  },
  summaryStatsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  statCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 12,
    gap: 10,
  },
  statDotGreen: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10B981',
  },
  statCountGreen: {
    fontSize: 18,
    fontWeight: '800',
    color: '#10B981',
  },
  statDotRed: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EF4444',
  },
  statCountRed: {
    fontSize: 18,
    fontWeight: '800',
    color: '#EF4444',
  },
  statLabel: {
    fontSize: 11,
    fontWeight: '500',
  },
  filterSection: {
    paddingHorizontal: 16,
    marginBottom: 12,
    gap: 8,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    height: 40,
    borderRadius: 12,
    borderWidth: 1,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    paddingVertical: 0,
  },
  categoryScroll: {
    gap: 6,
    paddingVertical: 2,
  },
  categoryPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    gap: 6,
  },
  categoryText: {
    fontSize: 12,
  },
  loaderBox: {
    alignItems: 'center',
    paddingVertical: 60,
    gap: 12,
  },
  loadingText: {
    fontSize: 13,
  },
  emptyBox: {
    alignItems: 'center',
    paddingVertical: 60,
    gap: 8,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  emptySub: {
    fontSize: 12,
  },
  cardsGrid: {
    paddingHorizontal: 16,
    gap: 10,
  },
  roomCard: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
  },
  roomCardInner: {
    padding: 14,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  codeBox: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8,
  },
  codeText: {
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: -0.2,
  },
  typeBadge: {
    fontSize: 11,
    fontWeight: '500',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    gap: 5,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  roomMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginBottom: 6,
  },
  roomMetaText: {
    fontSize: 12,
  },
  freeDurationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginBottom: 8,
  },
  freeDurationText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#10B981',
  },
  miniTimelineWrap: {
    marginTop: 4,
    gap: 4,
  },
  miniTimelineLabel: {
    fontSize: 10,
    fontWeight: '600',
  },
  miniStripRow: {
    flexDirection: 'row',
    gap: 4,
    height: 10,
  },
  stripBlock: {
    flex: 1,
    borderRadius: 3,
  },
  matrixContainer: {
    marginHorizontal: 16,
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
  },
  matrixHeaderRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
  },
  matrixDataRow: {
    flexDirection: 'row',
    borderBottomWidth: StyleSheet.hairlineWidth,
    alignItems: 'center',
  },
  matrixVenueCell: {
    width: 72,
    paddingHorizontal: 8,
    paddingVertical: 10,
    justifyContent: 'center',
  },
  matrixSlotCell: {
    width: 58,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  matrixHeaderCell: {
    paddingVertical: 12,
  },
  matrixHeaderText: {
    fontSize: 11,
    fontWeight: '700',
  },
  matrixVenueCode: {
    fontSize: 13,
    fontWeight: '800',
  },
  matrixVenueFloor: {
    fontSize: 9,
    marginTop: 1,
  },
  matrixCell: {
    width: 58,
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  matrixStatusBadge: {
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 5,
    minWidth: 38,
    alignItems: 'center',
  },
  matrixStatusText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '800',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
  },
  modalDismiss: {
    flex: 1,
  },
  modalSheet: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderTopWidth: 1,
    paddingHorizontal: 20,
    paddingTop: 12,
    maxHeight: '80%',
  },
  modalHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(150, 150, 150, 0.4)',
    alignSelf: 'center',
    marginBottom: 16,
  },
  modalHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 14,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '800',
  },
  modalSub: {
    fontSize: 12,
    marginTop: 2,
  },
  modalCloseBtn: {
    padding: 6,
  },
  modalDayBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 12,
  },
  modalDayTitle: {
    fontSize: 13,
    fontWeight: '700',
  },
  modalDayStats: {
    fontSize: 12,
    fontWeight: '800',
  },
  modalSlotsList: {
    maxHeight: 360,
  },
  modalSlotRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  modalSlotTimeBox: {
    gap: 2,
  },
  modalSlotTime: {
    fontSize: 13,
    fontWeight: '700',
  },
  modalSlotPeriod: {
    fontSize: 11,
  },
  modalStatusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    gap: 6,
  },
  modalStatusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  modalStatusText: {
    fontSize: 11,
    fontWeight: '800',
  },
});
