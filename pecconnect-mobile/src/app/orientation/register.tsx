import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, ActivityIndicator, KeyboardAvoidingView, Platform, TextInput, ScrollView } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '@/theme/colors';
import { Image } from 'expo-image';
import { SymbolView } from 'expo-symbols';
import Animated, { FadeInDown, FadeIn, SlideInRight, SlideOutLeft, withSpring, useSharedValue, useAnimatedStyle } from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { useFresherStore } from '@/stores/useFresherStore';
import { api } from '@/utils/api';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const BRANCHES = [
  { id: 'CSE', name: 'Computer Science' },
  { id: 'ECE', name: 'Electronics & Comm' },
  { id: 'VLSI', name: 'VLSI Design' },
  { id: 'B.Design', name: 'B.Design' },
  { id: 'AERO', name: 'Aerospace' },
  { id: 'Electrical', name: 'Electrical' },
  { id: 'Civil', name: 'Civil' },
  { id: 'AI', name: 'Artificial Intelligence' },
  { id: 'DS', name: 'Data Science' },
  { id: 'M and C', name: 'Maths & Computing' },
  { id: 'Mechanical', name: 'Mechanical' },
  { id: 'Metallurgy', name: 'Metallurgy' },
  { id: 'Production', name: 'Production' },
];

export default function RegisterFresherScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { isRegistered, register, isLoading } = useFresherStore();

  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [branch, setBranch] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // If already registered, redirect to dashboard
  useEffect(() => {
    if (!isLoading && isRegistered) {
      router.replace('/orientation');
    }
  }, [isLoading, isRegistered]);

  const handleNext = () => {
    if (step === 1 && name.trim().length > 2) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      setStep(2);
    }
  };

  const handleSubmit = async () => {
    if (!branch) return;
    
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setIsSubmitting(true);
    
    try {
      await register(name.trim(), branch);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      router.replace('/orientation');
    } catch (e) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      alert('Registration failed. Please check your connection.');
      setIsSubmitting(false);
    }
  };

  if (isLoading || isRegistered) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator color={colors.accent} size="large" />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <SafeAreaView style={styles.safeArea}>
        
        {/* Header */}
        <View style={styles.header}>
          <Pressable style={styles.backButton} onPress={() => {
            if (step === 2) setStep(1);
            else router.back();
          }}>
            <SymbolView name="chevron.left" tintColor={colors.label} size={24} />
          </Pressable>
          <View style={styles.progressContainer}>
            <View style={[styles.progressDot, step >= 1 && styles.progressDotActive]} />
            <View style={[styles.progressDot, step >= 2 && styles.progressDotActive]} />
          </View>
          <View style={{ width: 40 }} />
        </View>

        <View style={styles.content}>
          {step === 1 && (
            <Animated.View 
              entering={SlideInRight.springify()} 
              exiting={SlideOutLeft.springify()}
              style={styles.stepContainer}
            >
              <Image source={require('@/assets/images/splash-icon.png')} style={styles.logo} />
              <Text style={styles.title}>Welcome to PEC! 🎉</Text>
              <Text style={styles.subtitle}>Let's get you set up. What should we call you?</Text>
              
              <TextInput
                style={styles.input}
                placeholder="Your Full Name"
                placeholderTextColor={colors.secondaryLabel}
                value={name}
                onChangeText={setName}
                autoFocus
                autoCapitalize="words"
                returnKeyType="next"
                onSubmitEditing={handleNext}
              />

              <Pressable 
                style={[styles.button, name.trim().length <= 2 && styles.buttonDisabled]} 
                onPress={handleNext}
                disabled={name.trim().length <= 2}
              >
                <Text style={styles.buttonText}>Continue</Text>
                <SymbolView name="arrow.right" tintColor="#FFFFFF" size={18} />
              </Pressable>
            </Animated.View>
          )}

          {step === 2 && (
            <Animated.View 
              entering={SlideInRight.springify()} 
              exiting={SlideOutLeft.springify()}
              style={styles.stepContainer}
            >
              <Text style={styles.title}>Your Branch</Text>
              <Text style={styles.subtitle}>Which branch did you get admitted to?</Text>
              
              <ScrollView 
                style={styles.branchScroll} 
                contentContainerStyle={styles.branchScrollContent}
                showsVerticalScrollIndicator={false}
              >
                {BRANCHES.map(b => (
                  <Pressable
                    key={b.id}
                    style={[styles.branchCard, branch === b.id && styles.branchCardActive]}
                    onPress={() => {
                      Haptics.selectionAsync();
                      setBranch(b.id);
                    }}
                  >
                    <Text style={[styles.branchCode, branch === b.id && styles.textActive]}>{b.id}</Text>
                    <Text style={[styles.branchName, branch === b.id && styles.textActive]}>{b.name}</Text>
                  </Pressable>
                ))}
              </ScrollView>

              <Pressable 
                style={[styles.button, (!branch || isSubmitting) && styles.buttonDisabled]} 
                onPress={handleSubmit}
                disabled={!branch || isSubmitting}
              >
                {isSubmitting ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <>
                    <Text style={styles.buttonText}>Join PECverse</Text>
                    <SymbolView name="sparkles" tintColor="#FFFFFF" size={18} />
                  </>
                )}
              </Pressable>
            </Animated.View>
          )}
        </View>

      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.systemBackground,
  },
  safeArea: {
    flex: 1,
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
  },
  progressContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  progressDot: {
    width: 32,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.cardBorder,
  },
  progressDotActive: {
    backgroundColor: colors.accent,
  },
  content: {
    flex: 1,
    padding: 24,
  },
  stepContainer: {
    flex: 1,
  },
  logo: {
    width: 64,
    height: 64,
    marginBottom: 24,
    borderRadius: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: colors.label,
    letterSpacing: -0.5,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.secondaryLabel,
    marginBottom: 32,
    lineHeight: 22,
  },
  input: {
    backgroundColor: colors.cardBackground,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    borderRadius: 16,
    padding: 20,
    fontSize: 18,
    color: colors.label,
    fontWeight: '500',
    marginBottom: 32,
  },
  button: {
    backgroundColor: colors.accent,
    padding: 18,
    borderRadius: 100,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    marginTop: 'auto',
    marginBottom: 16,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
  },
  branchScroll: {
    flex: 1,
    marginBottom: 16,
  },
  branchScrollContent: {
    gap: 12,
    paddingBottom: 24,
  },
  branchCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: colors.cardBackground,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    borderRadius: 16,
  },
  branchCardActive: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  branchCode: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.label,
  },
  branchName: {
    fontSize: 14,
    color: colors.secondaryLabel,
  },
  textActive: {
    color: '#FFFFFF',
  },
});
