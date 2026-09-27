import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  TextInput,
  ActivityIndicator,
  Share,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, Stack } from 'expo-router';
import * as Haptics from 'expo-haptics';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useQuery } from '@tanstack/react-query';
import { useTheme } from '@/theme/colors';
import { useAuthStore } from '@/stores/useAuthStore';
import {
  fetchDatesheet,
  DatesheetData,
  PersonalizedExam,
  detectUserBranchKey,
} from '@/utils/datesheetApi';

type ScheduleCategory = 'regular' | 'backlog' | 'minor';

export default function DatesheetScreen() {
  const router = useRouter();
  const { colors, isDark } = useTheme();
  const user = useAuthStore((state) => state.user);

  // Auto-detect user branch key
  const userBranchId = useMemo(() => detectUserBranchKey(user), [user]);

  // View state: 'my_exams' vs 'all_branches'
  const [viewMode, setViewMode] = useState<'my_exams' | 'all_branches'>('my_exams');
  const [selectedCategory, setSelectedCategory] = useState<ScheduleCategory>('regular');
  const [selectedBranch, setSelectedBranch] = useState<string>(userBranchId);
  const [searchQuery, setSearchQuery] = useState('');
  const [isRulesModalOpen, setIsRulesModalOpen] = useState(false);

  // Fetch Datesheet with user class_id
  const { data: datesheet, isLoading } = useQuery<DatesheetData>({
    queryKey: ['datesheet-mid-term-2026', user?.class_id],
    queryFn: () => fetchDatesheet(user?.class_id),
  });

  // Countdown calculation
  const countdownText = useMemo(() => {
    const examStart = new Date('2026-10-01T09:30:00+05:30').getTime();
    const diff = examStart - Date.now();
    if (diff <= 0) return 'In Progress';
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    return days === 0 ? 'Starts today' : `In ${days} days`;
  }, []);

  // Class Info metadata
  const classInfo = useMemo(() => {
    if (datesheet?.user_mapping?.class_info) {
      return datesheet.user_mapping.class_info;
    }
    return {
      class_id: user?.class_id || 0,
      year: user?.courseClass?.year || 2,
      group_name: user?.courseClass?.group_name || 'Enrolled Class',
      branch_code: user?.courseClass?.branch?.code || 'CSE',
      branch_name: user?.courseClass?.branch?.name || 'Computer Science & Engineering',
    };
  }, [datesheet, user]);

  // Personalized exams list
  const myExams = useMemo<PersonalizedExam[]>(() => {
    if (datesheet?.user_mapping?.my_exams && datesheet.user_mapping.my_exams.length > 0) {
      return datesheet.user_mapping.my_exams;
    }
    if (!datesheet?.schedule) return [];
    const list: PersonalizedExam[] = [];
    datesheet.schedule.forEach((slot) => {
      const exam = slot.classes[userBranchId];
      if (exam && !exam.is_backlog && !exam.is_minor) {
        list.push({
          id: `${slot.id}_${exam.code}`,
          exam_date: slot.date,
          day_name: slot.day,
          time_slot: slot.time,
          start_time: slot.start_time,
          end_time: slot.end_time,
          branch_key: userBranchId,
          semester: 'Regular',
          branch_name: classInfo.branch_name,
          subject_code: exam.code,
          subject_name: exam.subject,
          seating_rooms: exam.rooms,
          coordinator_duty: slot.coordinator || undefined,
          is_backlog: false,
          is_minor: false,
        });
      }
    });
    return list;
  }, [datesheet, userBranchId, classInfo.branch_name]);

  // Backlog exams
  const myBacklogs = useMemo<PersonalizedExam[]>(() => {
    if (datesheet?.user_mapping?.backlog_exams && datesheet.user_mapping.backlog_exams.length > 0) {
      return datesheet.user_mapping.backlog_exams;
    }
    if (!datesheet?.schedule) return [];
    const list: PersonalizedExam[] = [];
    datesheet.schedule.forEach((slot) => {
      const exam = slot.classes[userBranchId];
      if (exam && exam.is_backlog) {
        list.push({
          id: `backlog_${slot.id}_${exam.code}`,
          exam_date: slot.date,
          day_name: slot.day,
          time_slot: slot.time,
          start_time: slot.start_time,
          end_time: slot.end_time,
          branch_key: userBranchId,
          semester: 'Backlog',
          branch_name: classInfo.branch_name,
          subject_code: exam.code,
          subject_name: exam.subject,
          seating_rooms: exam.rooms,
          coordinator_duty: slot.coordinator || undefined,
          is_backlog: true,
          is_minor: false,
        });
      }
    });
    return list;
  }, [datesheet, userBranchId, classInfo.branch_name]);

  // Minor specialization exams
  const myMinors = useMemo<PersonalizedExam[]>(() => {
    if (datesheet?.user_mapping?.minor_exams && datesheet.user_mapping.minor_exams.length > 0) {
      return datesheet.user_mapping.minor_exams;
    }
    if (!datesheet?.schedule) return [];
    const list: PersonalizedExam[] = [];
    datesheet.schedule.forEach((slot) => {
      const exam = slot.classes[userBranchId];
      if (exam && exam.is_minor) {
        list.push({
          id: `minor_${slot.id}_${exam.code}`,
          exam_date: slot.date,
          day_name: slot.day,
          time_slot: slot.time,
          start_time: slot.start_time,
          end_time: slot.end_time,
          branch_key: userBranchId,
          semester: 'Minor',
          branch_name: classInfo.branch_name,
          subject_code: exam.code,
          subject_name: exam.subject,
          seating_rooms: exam.rooms,
          coordinator_duty: slot.coordinator || undefined,
          is_backlog: false,
          is_minor: true,
        });
      }
    });
    return list;
  }, [datesheet, userBranchId, classInfo.branch_name]);

  // Current active personal exams list based on category
  const activePersonalExams = useMemo(() => {
    if (selectedCategory === 'backlog') return myBacklogs;
    if (selectedCategory === 'minor') return myMinors;
    return myExams;
  }, [selectedCategory, myExams, myBacklogs, myMinors]);

  // All branches list
  const branchTabs = datesheet?.branches.filter((b) => b.id !== 'all') || [];

  // Filtered exams for selected branch in "All Branches" mode
  const branchExams = useMemo(() => {
    if (!datesheet?.schedule) return [];
    const list: Array<{
      id: string;
      date: string;
      day: string;
      time: string;
      code: string;
      subject: string;
      rooms?: string;
      coordinator?: string | null;
      is_backlog?: boolean;
      is_minor?: boolean;
    }> = [];

    datesheet.schedule.forEach((slot) => {
      const exam = slot.classes[selectedBranch];
      if (exam) {
        const q = searchQuery.toLowerCase().trim();
        if (
          !q ||
          exam.code.toLowerCase().includes(q) ||
          exam.subject.toLowerCase().includes(q) ||
          (exam.rooms && exam.rooms.toLowerCase().includes(q))
        ) {
          list.push({
            id: `${slot.id}_${exam.code}`,
            date: slot.date,
            day: slot.day,
            time: slot.time,
            code: exam.code,
            subject: exam.subject,
            rooms: exam.rooms,
            coordinator: slot.coordinator,
            is_backlog: exam.is_backlog,
            is_minor: exam.is_minor,
          });
        }
      }
    });
    return list;
  }, [datesheet?.schedule, selectedBranch, searchQuery]);

  const handleShare = async () => {
    Haptics.selectionAsync();

    if (viewMode === 'my_exams') {
      let text = `📋 PEC Mid-Term Exam Schedule\n`;
      text += `Class: ${classInfo.group_name} (${classInfo.branch_code})\n\n`;
      activePersonalExams.forEach((e) => {
        text += `• ${e.subject_code} - ${e.subject_name}\n  📅 ${e.day_name}, ${e.exam_date} • ⏰ ${e.time_slot}\n  📍 ${e.seating_rooms || 'Dept Halls'}\n\n`;
      });
      text += `Notice: ${datesheet?.notice_no || 'PEC/CSE/265'} • PECverse`;
      try {
        await Share.share({ message: text });
      } catch (e) {}
      return;
    }

    const branchLabel = datesheet?.branches.find((b) => b.id === selectedBranch)?.label || selectedBranch;
    let text = `📋 PEC Datesheet • ${branchLabel}\n\n`;
    branchExams.forEach((e) => {
      text += `• ${e.code} - ${e.subject}\n  📅 ${e.day}, ${e.date} • ⏰ ${e.time}\n  📍 ${e.rooms || 'Dept Halls'}\n\n`;
    });
    text += `Notice: ${datesheet?.notice_no || 'PEC/CSE/265'} • PECverse`;
    try {
      await Share.share({ message: text });
    } catch (e) {}
  };

  // Helper format date: "Thu, 1 Oct"
  const formatDateHeading = (dateStr: string, dayStr: string) => {
    try {
      const parts = dateStr.split('-');
      if (parts.length === 3) {
        const d = parseInt(parts[2], 10);
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const m = months[parseInt(parts[1], 10) - 1];
        const dayShort = dayStr.slice(0, 3);
        return `${dayShort}, ${d} ${m}`;
      }
    } catch (e) {}
    return `${dayStr}, ${dateStr}`;
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView
        style={[styles.safeArea, { backgroundColor: colors.systemBackground }]}
        edges={['top', 'left', 'right']}
      >
        {/* Top Header */}
        <View style={[styles.header, { borderBottomColor: colors.cardBorder }]}>
          <Pressable
            style={[styles.headerBtn, { backgroundColor: colors.cardBackground, borderColor: colors.cardBorder }]}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              router.back();
            }}
            hitSlop={8}
          >
            <Ionicons name="arrow-back" size={18} color={colors.label} />
          </Pressable>

          <View style={styles.headerCenter}>
            <Text style={[styles.headerTitle, { color: colors.label }]}>Datesheet</Text>
            <Text style={[styles.headerSubtitle, { color: colors.secondaryLabel }]}>
              Mid-Term • 1–8 Oct 2026
            </Text>
          </View>

          <View style={styles.headerActions}>
            <Pressable
              style={[styles.headerBtn, { backgroundColor: colors.cardBackground, borderColor: colors.cardBorder }]}
              onPress={() => {
                Haptics.selectionAsync();
                setIsRulesModalOpen(true);
              }}
              hitSlop={8}
            >
              <Ionicons name="information-circle-outline" size={19} color={colors.label} />
            </Pressable>

            <Pressable
              style={[styles.headerBtn, { backgroundColor: colors.cardBackground, borderColor: colors.cardBorder }]}
              onPress={handleShare}
              hitSlop={8}
            >
              <Ionicons name="share-outline" size={18} color={colors.label} />
            </Pressable>
          </View>
        </View>

        {/* Minimal View Switcher */}
        <View style={styles.switchWrapper}>
          <View style={[styles.switcherContainer, { backgroundColor: isDark ? '#18181B' : '#F1F5F9', borderColor: colors.cardBorder }]}>
            <Pressable
              style={[styles.switcherTab, viewMode === 'my_exams' && { backgroundColor: colors.accent }]}
              onPress={() => {
                Haptics.selectionAsync();
                setViewMode('my_exams');
              }}
            >
              <Ionicons
                name="person"
                size={13}
                color={viewMode === 'my_exams' ? '#FFFFFF' : colors.secondaryLabel}
              />
              <Text
                style={[
                  styles.switcherText,
                  { color: viewMode === 'my_exams' ? '#FFFFFF' : colors.secondaryLabel },
                  viewMode === 'my_exams' && styles.switcherTextActive,
                ]}
              >
                My Schedule
              </Text>
            </Pressable>

            <Pressable
              style={[styles.switcherTab, viewMode === 'all_branches' && { backgroundColor: colors.accent }]}
              onPress={() => {
                Haptics.selectionAsync();
                setViewMode('all_branches');
              }}
            >
              <Ionicons
                name="grid"
                size={13}
                color={viewMode === 'all_branches' ? '#FFFFFF' : colors.secondaryLabel}
              />
              <Text
                style={[
                  styles.switcherText,
                  { color: viewMode === 'all_branches' ? '#FFFFFF' : colors.secondaryLabel },
                  viewMode === 'all_branches' && styles.switcherTextActive,
                ]}
              >
                All Branches
              </Text>
            </Pressable>
          </View>
        </View>

        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* ========================================================== */}
          {/* 1. MY EXAMS MODE (CLEAN & MINIMAL)                         */}
          {/* ========================================================== */}
          {viewMode === 'my_exams' ? (
            <Animated.View entering={FadeInDown.duration(200)}>
              {/* Compact Student Meta Strip */}
              <View style={[styles.metaStrip, { backgroundColor: colors.cardBackground, borderColor: colors.cardBorder }]}>
                <View style={styles.metaLeft}>
                  <View style={[styles.metaIcon, { backgroundColor: colors.accent + '15' }]}>
                    <Ionicons name="school" size={15} color={colors.accent} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.metaClassTitle, { color: colors.label }]} numberOfLines={1}>
                      {classInfo.group_name}
                    </Text>
                    <Text style={[styles.metaBranchSub, { color: colors.secondaryLabel }]} numberOfLines={1}>
                      {classInfo.branch_name}
                    </Text>
                  </View>
                </View>

                <View style={[styles.countdownPill, { backgroundColor: colors.accent + '12', borderColor: colors.accent + '30' }]}>
                  <Ionicons name="time-outline" size={12} color={colors.accent} />
                  <Text style={[styles.countdownPillText, { color: colors.accent }]}>
                    {countdownText}
                  </Text>
                </View>
              </View>

              {/* Category Pills (Regular • Backlogs • Minors) */}
              <View style={styles.categoryRow}>
                <Pressable
                  style={[
                    styles.categoryPill,
                    { backgroundColor: colors.cardBackground, borderColor: colors.cardBorder },
                    selectedCategory === 'regular' && [styles.categoryPillActive, { backgroundColor: colors.accent, borderColor: colors.accent }],
                  ]}
                  onPress={() => {
                    Haptics.selectionAsync();
                    setSelectedCategory('regular');
                  }}
                >
                  <Text
                    style={[
                      styles.categoryPillText,
                      { color: selectedCategory === 'regular' ? '#FFFFFF' : colors.secondaryLabel },
                    ]}
                  >
                    Regular ({myExams.length})
                  </Text>
                </Pressable>

                {myBacklogs.length > 0 && (
                  <Pressable
                    style={[
                      styles.categoryPill,
                      { backgroundColor: colors.cardBackground, borderColor: colors.cardBorder },
                      selectedCategory === 'backlog' && [styles.categoryPillActive, { backgroundColor: colors.accent, borderColor: colors.accent }],
                    ]}
                    onPress={() => {
                      Haptics.selectionAsync();
                      setSelectedCategory('backlog');
                    }}
                  >
                    <Text
                      style={[
                        styles.categoryPillText,
                        { color: selectedCategory === 'backlog' ? '#FFFFFF' : colors.secondaryLabel },
                      ]}
                    >
                      Backlogs ({myBacklogs.length})
                    </Text>
                  </Pressable>
                )}

                {myMinors.length > 0 && (
                  <Pressable
                    style={[
                      styles.categoryPill,
                      { backgroundColor: colors.cardBackground, borderColor: colors.cardBorder },
                      selectedCategory === 'minor' && [styles.categoryPillActive, { backgroundColor: colors.accent, borderColor: colors.accent }],
                    ]}
                    onPress={() => {
                      Haptics.selectionAsync();
                      setSelectedCategory('minor');
                    }}
                  >
                    <Text
                      style={[
                        styles.categoryPillText,
                        { color: selectedCategory === 'minor' ? '#FFFFFF' : colors.secondaryLabel },
                      ]}
                    >
                      Minors ({myMinors.length})
                    </Text>
                  </Pressable>
                )}
              </View>

              {/* Cards List */}
              {isLoading ? (
                <View style={styles.loadingBox}>
                  <ActivityIndicator size="small" color={colors.accent} />
                  <Text style={[styles.loadingLabel, { color: colors.secondaryLabel }]}>
                    Loading datesheet...
                  </Text>
                </View>
              ) : activePersonalExams.length === 0 ? (
                <View style={[styles.emptyCard, { backgroundColor: colors.cardBackground, borderColor: colors.cardBorder }]}>
                  {datesheet?.user_mapping?.is_covered_branch === false ? (
                    <View style={{ alignItems: 'center' }}>
                      <Ionicons name="document-text-outline" size={32} color={colors.accent} />
                      <Text style={[styles.emptyTitle, { color: colors.label }]}>Datesheet Not Released Yet</Text>
                      <Text style={[styles.emptySub, { color: colors.secondaryLabel, textAlign: 'center', marginBottom: 12 }]}>
                        {datesheet?.user_mapping?.notice_message ||
                          `The mid-term datesheet for ${classInfo.branch_name} has not been published yet by your department.`}
                      </Text>
                      <Pressable
                        style={{
                          backgroundColor: colors.accent,
                          paddingHorizontal: 16,
                          paddingVertical: 8,
                          borderRadius: 20,
                        }}
                        onPress={() => {
                          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                          setViewMode('all_branches');
                        }}
                      >
                        <Text style={{ color: '#FFFFFF', fontSize: 12, fontWeight: '700' }}>
                          Browse Published Master Schedule
                        </Text>
                      </Pressable>
                    </View>
                  ) : (
                    <View style={{ alignItems: 'center' }}>
                      <Ionicons name="checkmark-circle-outline" size={32} color={colors.success} />
                      <Text style={[styles.emptyTitle, { color: colors.label }]}>No Exams In This Category</Text>
                      <Text style={[styles.emptySub, { color: colors.secondaryLabel }]}>
                        You have no {selectedCategory} examinations scheduled.
                      </Text>
                    </View>
                  )}
                </View>
              ) : (
                activePersonalExams.map((exam, idx) => (
                  <Animated.View
                    key={`exam_${exam.id}_${idx}`}
                    entering={FadeInDown.delay(idx * 30).springify()}
                  >
                    <View style={[styles.cleanCard, { backgroundColor: colors.cardBackground, borderColor: colors.cardBorder }]}>
                      {/* Top Date & Time Row */}
                      <View style={styles.cardHeaderRow}>
                        <View style={styles.dateLabelRow}>
                          <Ionicons name="calendar-outline" size={13} color={colors.accent} />
                          <Text style={[styles.dateHeading, { color: colors.label }]}>
                            {formatDateHeading(exam.exam_date, exam.day_name)}
                          </Text>
                        </View>

                        <View style={[styles.timeChip, { backgroundColor: isDark ? '#27272A' : '#F1F5F9' }]}>
                          <Ionicons name="time-outline" size={11} color={colors.secondaryLabel} />
                          <Text style={[styles.timeChipText, { color: colors.secondaryLabel }]}>
                            {exam.time_slot}
                          </Text>
                        </View>
                      </View>

                      {/* Subject Name and Code */}
                      <View style={styles.cardTitleSection}>
                        <View style={[styles.codeTag, { backgroundColor: colors.accent + '15' }]}>
                          <Text style={[styles.codeTagText, { color: colors.accent }]}>
                            {exam.subject_code}
                          </Text>
                        </View>
                        <Text style={[styles.cardSubjectTitle, { color: colors.label }]}>
                          {exam.subject_name}
                        </Text>
                      </View>

                      {/* Linked Weekly Timetable Pill (if matched) */}
                      {exam.matched_regular_subject && (
                        <View style={[styles.linkedPill, { backgroundColor: isDark ? 'rgba(59, 130, 246, 0.08)' : '#EFF6FF' }]}>
                          <Ionicons name="link" size={11} color={colors.accent} />
                          <Text style={[styles.linkedPillText, { color: colors.accent }]} numberOfLines={1}>
                            Matches {exam.matched_regular_subject}
                          </Text>
                        </View>
                      )}

                      {/* Footer Details: Room & Coordinator */}
                      <View style={[styles.cardFooter, { borderTopColor: colors.separator }]}>
                        {exam.seating_rooms ? (
                          <View style={styles.footerItem}>
                            <Ionicons name="location-outline" size={13} color={colors.success} />
                            <Text style={[styles.footerText, { color: colors.secondaryLabel }]} numberOfLines={1}>
                              {exam.seating_rooms}
                            </Text>
                          </View>
                        ) : null}

                        {exam.coordinator_duty ? (
                          <View style={styles.footerItem}>
                            <Ionicons name="person-outline" size={12} color={colors.tertiaryLabel} />
                            <Text style={[styles.footerText, { color: colors.secondaryLabel }]} numberOfLines={1}>
                              {exam.coordinator_duty}
                            </Text>
                          </View>
                        ) : null}
                      </View>
                    </View>
                  </Animated.View>
                ))
              )}
            </Animated.View>
          ) : (
            /* ========================================================== */
            /* 2. ALL BRANCHES MODE (CLEAN & ORGANIZED)                   */
            /* ========================================================== */
            <Animated.View entering={FadeInDown.duration(200)}>
              {/* Branch Selector Ribbon */}
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.ribbonScroll}
              >
                {branchTabs.map((b) => {
                  const isSelected = selectedBranch === b.id;
                  const isUserBranch = b.id === userBranchId;

                  return (
                    <Pressable
                      key={b.id}
                      style={[
                        styles.ribbonPill,
                        { backgroundColor: colors.cardBackground, borderColor: colors.cardBorder },
                        isSelected && [styles.ribbonPillActive, { backgroundColor: colors.accent, borderColor: colors.accent }],
                      ]}
                      onPress={() => {
                        Haptics.selectionAsync();
                        setSelectedBranch(b.id);
                      }}
                    >
                      <Text
                        style={[
                          styles.ribbonPillText,
                          { color: isSelected ? '#FFFFFF' : colors.secondaryLabel },
                          isSelected && styles.ribbonPillTextActive,
                        ]}
                      >
                        {b.label}
                      </Text>
                      {isUserBranch && !isSelected && (
                        <View style={[styles.userBranchDot, { backgroundColor: colors.accent }]} />
                      )}
                    </Pressable>
                  );
                })}
              </ScrollView>

              {/* Minimal Search Field */}
              <View style={[styles.searchBar, { backgroundColor: colors.cardBackground, borderColor: colors.cardBorder }]}>
                <Ionicons name="search" size={14} color={colors.tertiaryLabel} />
                <TextInput
                  style={[styles.searchInput, { color: colors.label }]}
                  placeholder="Filter papers, code, or room..."
                  placeholderTextColor={colors.tertiaryLabel}
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  clearButtonMode="while-editing"
                />
              </View>

              {/* Branch Cards */}
              {branchExams.length === 0 ? (
                <View style={[styles.emptyCard, { backgroundColor: colors.cardBackground, borderColor: colors.cardBorder }]}>
                  <Ionicons name="search-outline" size={32} color={colors.tertiaryLabel} />
                  <Text style={[styles.emptyTitle, { color: colors.label }]}>No Papers Found</Text>
                  <Text style={[styles.emptySub, { color: colors.secondaryLabel }]}>
                    No exams found matching your search.
                  </Text>
                </View>
              ) : (
                branchExams.map((exam, idx) => (
                  <View
                    key={`branch_exam_${exam.id}_${idx}`}
                    style={[styles.cleanCard, { backgroundColor: colors.cardBackground, borderColor: colors.cardBorder }]}
                  >
                    <View style={styles.cardHeaderRow}>
                      <View style={styles.dateLabelRow}>
                        <Ionicons name="calendar-outline" size={13} color={colors.accent} />
                        <Text style={[styles.dateHeading, { color: colors.label }]}>
                          {formatDateHeading(exam.date, exam.day)}
                        </Text>
                      </View>

                      <View style={[styles.timeChip, { backgroundColor: isDark ? '#27272A' : '#F1F5F9' }]}>
                        <Ionicons name="time-outline" size={11} color={colors.secondaryLabel} />
                        <Text style={[styles.timeChipText, { color: colors.secondaryLabel }]}>
                          {exam.time}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.cardTitleSection}>
                      <View style={[styles.codeTag, { backgroundColor: colors.accent + '15' }]}>
                        <Text style={[styles.codeTagText, { color: colors.accent }]}>
                          {exam.code}
                        </Text>
                      </View>
                      <Text style={[styles.cardSubjectTitle, { color: colors.label }]}>
                        {exam.subject}
                      </Text>
                    </View>

                    {(exam.is_backlog || exam.is_minor) && (
                      <View style={{ flexDirection: 'row', gap: 6, marginBottom: 8 }}>
                        {exam.is_backlog && (
                          <View style={[styles.pillBadge, { backgroundColor: colors.destructiveBg }]}>
                            <Text style={[styles.pillBadgeText, { color: colors.destructive }]}>Backlog</Text>
                          </View>
                        )}
                        {exam.is_minor && (
                          <View style={[styles.pillBadge, { backgroundColor: 'rgba(168, 85, 247, 0.12)' }]}>
                            <Text style={[styles.pillBadgeText, { color: '#A855F7' }]}>Minor</Text>
                          </View>
                        )}
                      </View>
                    )}

                    <View style={[styles.cardFooter, { borderTopColor: colors.separator }]}>
                      {exam.rooms && (
                        <View style={styles.footerItem}>
                          <Ionicons name="location-outline" size={13} color={colors.success} />
                          <Text style={[styles.footerText, { color: colors.secondaryLabel }]} numberOfLines={1}>
                            {exam.rooms}
                          </Text>
                        </View>
                      )}
                      {exam.coordinator && (
                        <View style={styles.footerItem}>
                          <Ionicons name="person-outline" size={12} color={colors.tertiaryLabel} />
                          <Text style={[styles.footerText, { color: colors.secondaryLabel }]} numberOfLines={1}>
                            {exam.coordinator}
                          </Text>
                        </View>
                      )}
                    </View>
                  </View>
                ))
              )}
            </Animated.View>
          )}

          <View style={{ height: 40 }} />
        </ScrollView>

        {/* Minimal Guidelines Modal */}
        <Modal
          visible={isRulesModalOpen}
          animationType="fade"
          transparent
          onRequestClose={() => setIsRulesModalOpen(false)}
        >
          <View style={styles.modalBackdrop}>
            <View style={[styles.modalBox, { backgroundColor: colors.cardBackground, borderColor: colors.cardBorder }]}>
              <View style={styles.modalTop}>
                <Text style={[styles.modalHeading, { color: colors.label }]}>Exam Instructions</Text>
                <Pressable
                  onPress={() => setIsRulesModalOpen(false)}
                  hitSlop={8}
                >
                  <Ionicons name="close" size={20} color={colors.secondaryLabel} />
                </Pressable>
              </View>

              <ScrollView style={styles.rulesScroll} showsVerticalScrollIndicator={false}>
                {datesheet?.instructions.map((rule, i) => (
                  <View key={i} style={styles.ruleItem}>
                    <Text style={[styles.ruleNumber, { color: colors.accent }]}>0{i + 1}</Text>
                    <Text style={[styles.ruleText, { color: colors.label }]}>{rule}</Text>
                  </View>
                ))}
              </ScrollView>

              <Pressable
                style={[styles.modalButton, { backgroundColor: colors.accent }]}
                onPress={() => setIsRulesModalOpen(false)}
              >
                <Text style={styles.modalButtonText}>Got It</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  headerCenter: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  headerSubtitle: {
    fontSize: 11,
    fontWeight: '500',
    marginTop: 1,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  switchWrapper: {
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 4,
  },
  switcherContainer: {
    flexDirection: 'row',
    borderRadius: 12,
    padding: 3,
    borderWidth: 1,
  },
  switcherTab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 7,
    borderRadius: 9,
  },
  switcherText: {
    fontSize: 12,
    fontWeight: '600',
  },
  switcherTextActive: {
    fontWeight: '700',
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },

  /* Meta Strip */
  metaStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 10,
  },
  metaLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
    marginRight: 8,
  },
  metaIcon: {
    width: 30,
    height: 30,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  metaClassTitle: {
    fontSize: 13,
    fontWeight: '700',
  },
  metaBranchSub: {
    fontSize: 11,
    marginTop: 1,
  },
  countdownPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
  },
  countdownPillText: {
    fontSize: 11,
    fontWeight: '700',
  },

  /* Category Filter Pills */
  categoryRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  categoryPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
  },
  categoryPillActive: {},
  categoryPillText: {
    fontSize: 12,
    fontWeight: '600',
  },

  /* Clean Exam Card */
  cleanCard: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
    marginBottom: 10,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  dateLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  dateHeading: {
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  timeChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 6,
  },
  timeChipText: {
    fontSize: 11,
    fontWeight: '600',
  },
  cardTitleSection: {
    marginBottom: 8,
  },
  codeTag: {
    alignSelf: 'flex-start',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginBottom: 4,
  },
  codeTagText: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  cardSubjectTitle: {
    fontSize: 15,
    fontWeight: '700',
    lineHeight: 20,
    letterSpacing: -0.2,
  },
  linkedPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginBottom: 10,
  },
  linkedPillText: {
    fontSize: 11,
    fontWeight: '600',
  },
  pillBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  pillBadgeText: {
    fontSize: 10,
    fontWeight: '700',
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 8,
    borderTopWidth: StyleSheet.hairlineWidth,
    gap: 10,
  },
  footerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    flex: 1,
  },
  footerText: {
    fontSize: 11,
    fontWeight: '500',
  },

  /* Ribbon in All Branches mode */
  ribbonScroll: {
    gap: 6,
    paddingVertical: 6,
  },
  ribbonPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
  },
  ribbonPillActive: {},
  ribbonPillText: {
    fontSize: 12,
    fontWeight: '600',
  },
  ribbonPillTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  userBranchDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    height: 38,
    borderRadius: 10,
    borderWidth: 1,
    marginVertical: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    paddingVertical: 0,
  },

  /* Empty and Loading States */
  emptyCard: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: '700',
    marginTop: 8,
  },
  emptySub: {
    fontSize: 12,
    textAlign: 'center',
    marginTop: 4,
  },
  loadingBox: {
    paddingVertical: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingLabel: {
    fontSize: 12,
    marginTop: 8,
  },

  /* Minimal Rules Modal */
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalBox: {
    width: '100%',
    maxHeight: '75%',
    borderRadius: 18,
    borderWidth: 1,
    padding: 18,
  },
  modalTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  modalHeading: {
    fontSize: 16,
    fontWeight: '700',
  },
  rulesScroll: {
    marginBottom: 16,
  },
  ruleItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    marginBottom: 12,
  },
  ruleNumber: {
    fontSize: 12,
    fontWeight: '800',
    marginTop: 1,
  },
  ruleText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '400',
  },
  modalButton: {
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
});
