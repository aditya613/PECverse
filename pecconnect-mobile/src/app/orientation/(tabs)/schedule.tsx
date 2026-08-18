import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, TextInput, Modal, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme, colors } from '@/theme/colors';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useSeniorAdvice, SeniorAdviceItem } from '@/hooks/useSeniorAdvice';
import { useOrientationSchedule } from '@/hooks/useOrientationSchedule';
import { useFresherStore } from '@/stores/useFresherStore';
import { BRANCH_DATA, BranchCode } from '@/constants/orientationData';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ADVICE_CATEGORIES = ['All', 'Academics', 'Societies', 'Campus Life', 'Hostels', 'Attendance'];

export default function ScheduleScreen() {
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<'schedule' | 'advice'>('schedule');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isQuestionModalVisible, setIsQuestionModalVisible] = useState(false);
  const [questionText, setQuestionText] = useState('');
  const { colors, isDark } = useTheme();

  const { fresher } = useFresherStore();
  const [overrideBranch, setOverrideBranch] = useState<string | null>(null);
  const [activeDay, setActiveDay] = useState<1 | 2 | 3>(1);

  useEffect(() => {
    if (!fresher?.branch) {
      AsyncStorage.getItem('preferred_schedule_branch').then(val => {
        if (val) setOverrideBranch(val);
      });
    }
  }, [fresher]);

  const activeBranch = overrideBranch || fresher?.branch || 'CSE';
  const { day1, day2, day3 } = useOrientationSchedule(activeBranch);
  const currentSchedule = activeDay === 1 ? day1 : activeDay === 2 ? day2 : day3;

  const { advices, isLoading: isAdviceLoading, likeAdvice, askQuestion, isSubmittingQuestion } = useSeniorAdvice(selectedCategory);

  const handleAskQuestion = async () => {
    if (!questionText.trim()) return;
    try {
      await askQuestion(questionText.trim());
      setQuestionText('');
      setIsQuestionModalVisible(false);
      Alert.alert('Question Submitted! 🚀', 'Your question has been sent to our senior mentor team.');
    } catch (e: any) {
      Alert.alert('Error', e.message || 'Failed to submit question');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.systemBackground }]}>
      <SafeAreaView style={[styles.header, { backgroundColor: colors.cardBackground, borderBottomColor: colors.cardBorder }]} edges={['top']}>
        <View style={styles.headerRow}>
          <Text style={[styles.headerTitle, { color: colors.label }]}>Freshers Guide</Text>
          <Pressable 
            style={[styles.askBtn, { backgroundColor: colors.accent }]}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              setIsQuestionModalVisible(true);
            }}
          >
            <Ionicons name="help-circle" size={18} color="#FFFFFF" />
            <Text style={styles.askBtnText}>Ask Senior</Text>
          </Pressable>
        </View>

        {/* Tab Switcher */}
        <View style={[styles.tabSwitcher, { backgroundColor: colors.secondarySystemBackground }]}>
          <Pressable
            style={[styles.tabSegment, activeTab === 'schedule' && { backgroundColor: colors.accent }]}
            onPress={() => {
              Haptics.selectionAsync();
              setActiveTab('schedule');
            }}
          >
            <Ionicons name="calendar-outline" size={16} color={activeTab === 'schedule' ? '#FFFFFF' : colors.secondaryLabel} />
            <Text style={[styles.tabSegmentText, { color: activeTab === 'schedule' ? '#FFFFFF' : colors.secondaryLabel }]}>
              Day Schedule
            </Text>
          </Pressable>

          <Pressable
            style={[styles.tabSegment, activeTab === 'advice' && { backgroundColor: colors.accent }]}
            onPress={() => {
              Haptics.selectionAsync();
              setActiveTab('advice');
            }}
          >
            <Ionicons name="bulb-outline" size={16} color={activeTab === 'advice' ? '#FFFFFF' : colors.secondaryLabel} />
            <Text style={[styles.tabSegmentText, { color: activeTab === 'advice' ? '#FFFFFF' : colors.secondaryLabel }]}>
              Senior Advice 🔥
            </Text>
          </Pressable>
        </View>
      </SafeAreaView>

      {activeTab === 'schedule' ? (
        <ScrollView contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 100 }]} showsVerticalScrollIndicator={false}>
          
          <View style={[styles.bannerCard, { backgroundColor: colors.cardBackground, borderColor: colors.accent + '35' }]}>
            <Text style={[styles.bannerDate, { color: colors.accent }]}>ORIENTATION SCHEDULE</Text>
            <Text style={[styles.bannerHeading, { color: colors.label }]}>Welcome to PECverse! 🎉</Text>
            <Text style={[styles.bannerSub, { color: colors.secondaryLabel }]}>Select your branch below to see your personalized schedule and exact venues.</Text>
            
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.branchSelector}>
              {Object.keys(BRANCH_DATA).map(b => (
                <Pressable
                  key={b}
                  onPress={() => {
                    Haptics.selectionAsync();
                    setOverrideBranch(b);
                    if (!fresher?.branch) {
                      AsyncStorage.setItem('preferred_schedule_branch', b);
                    }
                  }}
                  style={[styles.branchPill, activeBranch === b && { backgroundColor: colors.accent, borderColor: colors.accent }]}
                >
                  <Text style={[styles.branchPillText, activeBranch === b && { color: '#FFFFFF' }]}>{b}</Text>
                </Pressable>
              ))}
            </ScrollView>
          </View>

          <View style={styles.dayToggleContainer}>
            <Pressable onPress={() => { Haptics.selectionAsync(); setActiveDay(1); }} style={[styles.dayToggle, activeDay === 1 && { backgroundColor: colors.accent }]}>
              <Text style={[styles.dayToggleText, activeDay === 1 && { color: '#FFF' }]}>Day 1 (Aug 19)</Text>
            </Pressable>
            <Pressable onPress={() => { Haptics.selectionAsync(); setActiveDay(2); }} style={[styles.dayToggle, activeDay === 2 && { backgroundColor: colors.accent }]}>
              <Text style={[styles.dayToggleText, activeDay === 2 && { color: '#FFF' }]}>Day 2 (Aug 20)</Text>
            </Pressable>
            <Pressable onPress={() => { Haptics.selectionAsync(); setActiveDay(3); }} style={[styles.dayToggle, activeDay === 3 && { backgroundColor: colors.accent }]}>
              <Text style={[styles.dayToggleText, activeDay === 3 && { color: '#FFF' }]}>Day 3 (Aug 21)</Text>
            </Pressable>
          </View>

          {currentSchedule.map((item, index) => {
            return (
              <Animated.View 
                key={index} 
                entering={FadeInDown.delay(index * 40).springify()} 
                style={[styles.scheduleCard, { backgroundColor: colors.cardBackground, borderColor: colors.cardBorder }]}
              >
                <View style={styles.timeColumn}>
                  <Text style={[styles.timeText, { color: colors.label }]}>{item.time}</Text>
                  <Text style={[styles.durationText, { color: colors.secondaryLabel }]}>{item.duration}</Text>
                </View>
                
                <View style={[styles.divider, { backgroundColor: colors.accent }]} />
                
                <View style={styles.contentColumn}>
                  <View style={styles.eventHeader}>
                    <Ionicons name={item.icon as any || 'ellipse'} color={colors.accent} size={16} />
                    <Text style={[styles.eventText, { color: colors.label }]}>{item.event}</Text>
                  </View>
                  <Text style={[styles.venueText, { color: colors.secondaryLabel }]}>{item.venue}</Text>
                </View>
              </Animated.View>
            );
          })}
        </ScrollView>
      ) : (
        <View style={{ flex: 1 }}>
          {/* Advice Category Filter */}
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false} 
            style={{ flexGrow: 0, minHeight: 60, maxHeight: 60 }}
            contentContainerStyle={styles.categoryScroll}
          >
            {ADVICE_CATEGORIES.map(cat => {
              const isSelected = selectedCategory === cat;
              return (
                <Pressable
                  key={cat}
                  onPress={() => {
                    Haptics.selectionAsync();
                    setSelectedCategory(cat);
                  }}
                  style={[
                    styles.catChip, 
                    { backgroundColor: isSelected ? colors.accent : colors.secondarySystemBackground, borderColor: isSelected ? colors.accent : colors.cardBorder }
                  ]}
                >
                  <Text style={[styles.catChipText, { color: isSelected ? '#FFFFFF' : colors.secondaryLabel }]}>{cat}</Text>
                </Pressable>
              );
            })}
          </ScrollView>

          {isAdviceLoading ? (
            <ActivityIndicator size="large" color={colors.accent} style={{ marginTop: 40 }} />
          ) : (
            <ScrollView contentContainerStyle={[styles.adviceListContent, { paddingBottom: insets.bottom + 100 }]}>
              {advices.map((advice, index) => (
                <Animated.View 
                  key={advice.id} 
                  entering={FadeInDown.delay(index * 60).springify()} 
                  style={[styles.adviceCard, { backgroundColor: colors.cardBackground, borderColor: colors.cardBorder }]}
                >
                  <View style={styles.adviceHeader}>
                    <View style={styles.authorBadge}>
                      <Text style={[styles.authorInitials, { backgroundColor: colors.accent }]}>{advice.author_name[0]}</Text>
                      <View>
                        <Text style={[styles.authorName, { color: colors.label }]}>{advice.author_name}</Text>
                        <Text style={[styles.authorBatch, { color: colors.secondaryLabel }]}>{advice.author_batch}</Text>
                      </View>
                    </View>
                    <View style={[styles.catBadge, { backgroundColor: colors.accent + '15' }]}>
                      <Text style={[styles.catBadgeText, { color: colors.accent }]}>{advice.category}</Text>
                    </View>
                  </View>

                  <Text style={[styles.adviceTitle, { color: colors.label }]}>{advice.title}</Text>
                  <Text style={[styles.adviceContent, { color: colors.secondaryLabel }]}>{advice.content}</Text>

                  <View style={[styles.adviceFooter, { borderTopColor: colors.separator }]}>
                    <Pressable 
                      style={styles.likeBtn}
                      onPress={() => likeAdvice(advice.id)}
                    >
                      <Ionicons name="heart" size={18} color="#EF4444" />
                      <Text style={[styles.likeCount, { color: colors.secondaryLabel }]}>{advice.likes_count} found helpful</Text>
                    </Pressable>
                  </View>
                </Animated.View>
              ))}
            </ScrollView>
          )}
        </View>
      )}

      {/* Ask Question Modal */}
      <Modal visible={isQuestionModalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalSheet, { backgroundColor: colors.cardBackground, paddingBottom: insets.bottom + 20 }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.label }]}>Ask Senior Mentors</Text>
              <Pressable onPress={() => setIsQuestionModalVisible(false)}>
                <Ionicons name="close-circle" size={26} color={colors.secondaryLabel} />
              </Pressable>
            </View>

            <Text style={[styles.modalSub, { color: colors.secondaryLabel }]}>
              Have questions about branches, hostels, societies, or classes? Submit anonymously below.
            </Text>

            <TextInput
              style={[styles.modalInput, { backgroundColor: colors.secondarySystemBackground, color: colors.label, borderColor: colors.cardBorder }]}
              placeholder="e.g. How does the 75% attendance rule work in labs?"
              placeholderTextColor={colors.tertiaryLabel}
              multiline
              maxLength={400}
              value={questionText}
              onChangeText={setQuestionText}
            />

            <Pressable
              style={[styles.submitQuestionBtn, { backgroundColor: colors.accent }, (!questionText.trim() || isSubmittingQuestion) && { opacity: 0.5 }]}
              onPress={handleAskQuestion}
              disabled={!questionText.trim() || isSubmittingQuestion}
            >
              {isSubmittingQuestion ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <Text style={styles.submitQuestionText}>Submit Question</Text>
              )}
            </Pressable>
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
  header: {
    paddingHorizontal: 20,
    paddingBottom: 12,
    borderBottomWidth: 1,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
    paddingTop: 8,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  askBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },
  askBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  tabSwitcher: {
    flexDirection: 'row',
    borderRadius: 14,
    padding: 4,
    gap: 4,
  },
  tabSegment: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: 10,
    gap: 6,
  },
  tabSegmentText: {
    fontSize: 13,
    fontWeight: '600',
  },
  scrollContent: {
    padding: 16,
    gap: 12,
  },
  bannerCard: {
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    marginBottom: 8,
  },
  bannerDate: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1,
    marginBottom: 6,
  },
  bannerHeading: {
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 6,
  },
  bannerSub: {
    fontSize: 13,
    lineHeight: 18,
  },
  scheduleCard: {
    flexDirection: 'row',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
  },
  timeColumn: {
    width: 80,
    justifyContent: 'center',
  },
  timeText: {
    fontSize: 14,
    fontWeight: '700',
  },
  durationText: {
    fontSize: 11,
    marginTop: 2,
  },
  divider: {
    width: 3,
    borderRadius: 2,
    marginHorizontal: 14,
  },
  contentColumn: {
    flex: 1,
    justifyContent: 'center',
  },
  eventHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  eventText: {
    fontSize: 15,
    fontWeight: '700',
    flex: 1,
  },
  venueText: {
    fontSize: 13,
  },
  categoryScroll: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  catChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  catChipText: {
    fontSize: 13,
    fontWeight: '600',
  },
  adviceListContent: {
    padding: 16,
    gap: 14,
  },
  adviceCard: {
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
  },
  adviceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  authorBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  authorInitials: {
    width: 34,
    height: 34,
    borderRadius: 17,
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 34,
    fontWeight: '700',
    fontSize: 14,
  },
  authorName: {
    fontSize: 14,
    fontWeight: '700',
  },
  authorBatch: {
    fontSize: 12,
  },
  catBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  catBadgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  adviceTitle: {
    fontSize: 17,
    fontWeight: '800',
    marginBottom: 8,
  },
  adviceContent: {
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 14,
  },
  adviceFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    paddingTop: 12,
  },
  likeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  likeCount: {
    fontSize: 13,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '800',
  },
  modalSubtitle: {
    fontSize: 16,
    color: colors.secondaryLabel,
    marginBottom: 20,
    lineHeight: 22,
  },
  branchSelector: {
    marginTop: 16,
    paddingVertical: 4,
  },
  branchPill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    marginRight: 10,
  },
  branchPillText: {
    color: colors.label,
    fontSize: 14,
    fontWeight: '600',
  },
  dayToggleContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
    gap: 12,
  },
  dayToggle: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: colors.cardBackground,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    alignItems: 'center',
  },
  dayToggleText: {
    color: colors.label,
    fontSize: 15,
    fontWeight: '600',
  },
  modalSub: {
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 16,
  },
  modalInput: {
    borderRadius: 14,
    padding: 14,
    fontSize: 15,
    minHeight: 100,
    textAlignVertical: 'top',
    borderWidth: 1,
    marginBottom: 16,
  },
  submitQuestionBtn: {
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
  },
  submitQuestionText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
});
