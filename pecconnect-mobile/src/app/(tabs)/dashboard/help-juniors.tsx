import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable, TextInput, Modal, ActivityIndicator, Alert, ScrollView } from 'react-native';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/utils/api';
import { useTheme } from '@/theme/colors';
import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import Animated, { FadeInDown } from 'react-native-reanimated';

const ADVICE_CATEGORIES = ['Academics', 'Societies', 'Campus Life', 'Hostels', 'Attendance'];

export default function HelpJuniorsScreen() {
  const { colors, isDark } = useTheme();
  const router = useRouter();
  const queryClient = useQueryClient();

  const [selectedQuestion, setSelectedQuestion] = useState<any>(null);
  const [answer, setAnswer] = useState('');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState(ADVICE_CATEGORIES[0]);

  // Fetch Pending Questions
  const { data: pendingQuestions, isLoading, refetch, isRefetching } = useQuery({
    queryKey: ['pendingQuestions'],
    queryFn: async () => {
      const res = await api.get('/senior-advice/questions/pending');
      return res.data.questions;
    }
  });

  // Submit Answer Mutation
  const answerMutation = useMutation({
    mutationFn: async (data: { answer: string, title: string, category: string }) => {
      const res = await api.post(`/senior-advice/questions/${selectedQuestion.id}/answer`, data);
      return res.data;
    },
    onSuccess: () => {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Alert.alert("Success!", "Your advice has been posted to the Freshers Guide!");
      queryClient.invalidateQueries({ queryKey: ['pendingQuestions'] });
      queryClient.invalidateQueries({ queryKey: ['seniorAdvice'] });
      closeModal();
    },
    onError: (err: any) => {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert("Error", err.response?.data?.message || "Failed to post answer");
    }
  });


  const closeModal = () => {
    setSelectedQuestion(null);
    setAnswer('');
    setTitle('');
    setCategory(ADVICE_CATEGORIES[0]);
  };

  const submitAnswer = () => {
    if (!title.trim() || !answer.trim()) {
      Alert.alert("Missing Fields", "Please provide a title and your answer.");
      return;
    }
    answerMutation.mutate({ title: title.trim(), answer: answer.trim(), category });
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.systemBackground }]}>
      <Stack.Screen
        options={{
          headerTitle: 'Help Juniors',
          headerShown: true,
          headerStyle: { backgroundColor: colors.cardBackground },
          headerTintColor: colors.label,
        }}
      />

      {isLoading ? (
        <View style={styles.centerBox}>
          <ActivityIndicator size="large" color={colors.accent} />
        </View>
      ) : pendingQuestions?.length === 0 ? (
        <View style={styles.centerBox}>
          <Ionicons name="checkmark-done-circle" size={60} color={colors.secondaryLabel} style={{ opacity: 0.3 }} />
          <Text style={[styles.emptyTitle, { color: colors.label }]}>You're all caught up!</Text>
          <Text style={[styles.emptySub, { color: colors.secondaryLabel }]}>There are no pending questions from freshers right now.</Text>
        </View>
      ) : (
        <FlatList
          data={pendingQuestions}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContent}
          onRefresh={refetch}
          refreshing={isRefetching}
          renderItem={({ item, index }) => (
            <Animated.View entering={FadeInDown.delay(index * 50).springify()}>
              <Pressable
                style={[styles.questionCard, { backgroundColor: colors.cardBackground, borderColor: colors.cardBorder }]}
                onPress={() => {
                  Haptics.selectionAsync();
                  setSelectedQuestion(item);
                }}
              >
                <View style={styles.qHeader}>
                  <Ionicons name="help-circle" size={20} color={colors.accent} />
                  <Text style={[styles.qTag, { color: colors.accent }]}>FRESHER QUESTION</Text>
                </View>
                <Text style={[styles.qText, { color: colors.label }]}>{item.question}</Text>
                <View style={[styles.actionRow, { borderTopColor: colors.separator }]}>
                  <Text style={[styles.dateText, { color: colors.tertiaryLabel }]}>
                    {new Date(item.created_at).toLocaleDateString()}
                  </Text>
                  <View style={styles.replyBtn}>
                    <Text style={[styles.replyText, { color: colors.accent }]}>Reply</Text>
                    <Ionicons name="arrow-forward" size={14} color={colors.accent} />
                  </View>
                </View>
              </Pressable>
            </Animated.View>
          )}
        />
      )}

      {/* Answer Modal */}
      <Modal visible={!!selectedQuestion} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalSheet, { backgroundColor: colors.cardBackground }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.label }]}>Answer Question</Text>
              <Pressable onPress={closeModal}>
                <Ionicons name="close-circle" size={26} color={colors.secondaryLabel} />
              </Pressable>
            </View>

            {selectedQuestion && (
              <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
                <View style={[styles.originalQuestionBox, { backgroundColor: colors.secondarySystemBackground }]}>
                  <Text style={[styles.qTag, { color: colors.secondaryLabel, marginBottom: 4 }]}>THEY ASKED:</Text>
                  <Text style={[styles.originalQuestionText, { color: colors.label }]}>{selectedQuestion.question}</Text>
                </View>

                <Text style={[styles.inputLabel, { color: colors.label }]}>Category</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.catScroll}>
                  {ADVICE_CATEGORIES.map(cat => (
                    <Pressable
                      key={cat}
                      onPress={() => setCategory(cat)}
                      style={[
                        styles.catChip,
                        { backgroundColor: category === cat ? colors.accent : colors.secondarySystemBackground }
                      ]}
                    >
                      <Text style={[styles.catChipText, { color: category === cat ? '#FFF' : colors.secondaryLabel }]}>{cat}</Text>
                    </Pressable>
                  ))}
                </ScrollView>

                <Text style={[styles.inputLabel, { color: colors.label }]}>Summary / Title</Text>
                <TextInput
                  style={[styles.inputField, { backgroundColor: colors.secondarySystemBackground, color: colors.label, borderColor: colors.cardBorder }]}
                  placeholder="e.g. Navigating the 75% attendance rule"
                  placeholderTextColor={colors.tertiaryLabel}
                  value={title}
                  onChangeText={setTitle}
                  maxLength={100}
                />

                <Text style={[styles.inputLabel, { color: colors.label }]}>Your Advice</Text>
                <TextInput
                  style={[styles.inputArea, { backgroundColor: colors.secondarySystemBackground, color: colors.label, borderColor: colors.cardBorder }]}
                  placeholder="Share your wisdom..."
                  placeholderTextColor={colors.tertiaryLabel}
                  multiline
                  textAlignVertical="top"
                  value={answer}
                  onChangeText={setAnswer}
                />

                <Pressable
                  style={[styles.submitBtn, { backgroundColor: colors.accent }, answerMutation.isPending && { opacity: 0.5 }]}
                  onPress={submitAnswer}
                  disabled={answerMutation.isPending}
                >
                  {answerMutation.isPending ? (
                    <ActivityIndicator color="#FFF" />
                  ) : (
                    <Text style={styles.submitBtnText}>Post Advice</Text>
                  )}
                </Pressable>
                <View style={{ height: 40 }} />
              </ScrollView>
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
  centerBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySub: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  listContent: {
    padding: 20,
    gap: 16,
    paddingBottom: 40,
  },
  questionCard: {
    padding: 20,
    borderRadius: 20,
    borderWidth: 1,
  },
  qHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 12,
  },
  qTag: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1,
  },
  qText: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '500',
    marginBottom: 16,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 12,
    borderTopWidth: 1,
  },
  dateText: {
    fontSize: 12,
  },
  replyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  replyText: {
    fontSize: 14,
    fontWeight: '700',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    maxHeight: '90%',
    padding: 24,
    paddingTop: 16,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '800',
  },
  modalContent: {
    flexGrow: 0,
  },
  originalQuestionBox: {
    padding: 16,
    borderRadius: 16,
    marginBottom: 24,
  },
  originalQuestionText: {
    fontSize: 15,
    fontStyle: 'italic',
    lineHeight: 22,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 8,
    marginTop: 8,
  },
  catScroll: {
    flexGrow: 0,
    marginBottom: 16,
  },
  catChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  catChipText: {
    fontSize: 13,
    fontWeight: '600',
  },
  inputField: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
    fontSize: 15,
    marginBottom: 16,
  },
  inputArea: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
    fontSize: 15,
    minHeight: 120,
    marginBottom: 24,
  },
  submitBtn: {
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
  },
  submitBtnText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
