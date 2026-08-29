import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable, KeyboardAvoidingView, Platform, Alert, ActivityIndicator } from 'react-native';
import { useTheme } from '@/theme/colors';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import { api } from '@/utils/api';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function FeedbackScreen() {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const router = useRouter();
  
  const [message, setMessage] = useState('');
  const [type, setType] = useState<'bug' | 'suggestion' | 'general'>('general');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!message.trim()) {
      Alert.alert('Empty Message', 'Please enter some feedback before submitting.');
      return;
    }

    setIsSubmitting(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    try {
      await api.post('/feedback', {
        message,
        type,
      });
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Alert.alert('Thank You!', 'Your feedback has been successfully submitted.', [
        { text: 'OK', onPress: () => router.back() }
      ]);
    } catch (error: any) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert('Submission Failed', error.response?.data?.message || 'Something went wrong while submitting feedback.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={[styles.container, { backgroundColor: colors.systemBackground }]} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={[styles.header, { borderBottomColor: colors.separator }]}>
        <Pressable onPress={() => router.back()} style={styles.closeBtn}>
          <Text style={[styles.closeText, { color: colors.accent }]}>Cancel</Text>
        </Pressable>
        <Text style={[styles.headerTitle, { color: colors.label }]}>Feedback & Contact</Text>
        <View style={styles.placeholder} />
      </View>

      <Animated.ScrollView 
        contentContainerStyle={[styles.scrollContent, { paddingBottom: Math.max(insets.bottom + 24, 40) }]}
        entering={FadeInUp.duration(400)}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={[styles.sectionTitle, { color: colors.label }]}>What kind of feedback is this?</Text>
        
        <View style={styles.typeSelectorRow}>
          {[
            { id: 'general', label: 'General', icon: 'chatbubbles-outline' },
            { id: 'bug', label: 'Bug Report', icon: 'bug-outline' },
            { id: 'suggestion', label: 'Suggestion', icon: 'bulb-outline' },
          ].map((item) => {
            const isSelected = type === item.id;
            return (
              <Pressable
                key={item.id}
                style={[
                  styles.typeOptionBtn,
                  { 
                    backgroundColor: isSelected ? colors.accent : colors.secondarySystemBackground,
                    borderColor: isSelected ? colors.accent : colors.separator
                  },
                ]}
                onPress={() => {
                  Haptics.selectionAsync();
                  setType(item.id as any);
                }}
              >
                <Ionicons 
                  name={item.icon as any} 
                  size={18} 
                  color={isSelected ? '#FFFFFF' : colors.secondaryLabel} 
                />
                <Text style={[styles.typeOptionText, { color: isSelected ? '#FFFFFF' : colors.secondaryLabel }]}>
                  {item.label}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <Text style={[styles.sectionTitle, { color: colors.label, marginTop: 24 }]}>Your Message</Text>
        <TextInput
          style={[styles.textInput, { 
            backgroundColor: colors.secondarySystemBackground, 
            color: colors.label,
            borderColor: colors.separator
          }]}
          placeholder="Tell us what you love, what's broken, or how we can improve..."
          placeholderTextColor={colors.tertiaryLabel}
          multiline
          numberOfLines={6}
          textAlignVertical="top"
          value={message}
          onChangeText={setMessage}
          maxLength={2000}
        />
        <Text style={[styles.charCount, { color: colors.tertiaryLabel }]}>
          {message.length} / 2000
        </Text>

        <Pressable 
          style={({ pressed }) => [
            styles.submitBtn,
            { backgroundColor: colors.accent, opacity: pressed || isSubmitting ? 0.8 : 1 }
          ]}
          onPress={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.submitBtnText}>Submit Feedback</Text>
          )}
        </Pressable>
      </Animated.ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
  },
  closeBtn: {
    padding: 4,
    minWidth: 60,
  },
  closeText: {
    fontSize: 16,
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  placeholder: {
    width: 60,
  },
  scrollContent: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 12,
  },
  typeSelectorRow: {
    flexDirection: 'row',
    gap: 10,
  },
  typeOptionBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    gap: 4,
  },
  typeOptionText: {
    fontSize: 13,
    fontWeight: '600',
    marginTop: 4,
  },
  textInput: {
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    minHeight: 150,
    borderWidth: 1,
  },
  charCount: {
    fontSize: 12,
    textAlign: 'right',
    marginTop: 6,
  },
  submitBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 14,
    marginTop: 32,
  },
  submitBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
