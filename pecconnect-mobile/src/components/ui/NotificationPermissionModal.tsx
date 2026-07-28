import React, { useEffect, useRef } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  Pressable,
  Linking,
  AppState,
  AppStateStatus,
  Platform,
} from 'react-native';
import * as Notifications from 'expo-notifications';
import * as Haptics from 'expo-haptics';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { useNotificationModalStore } from '@/stores/useNotificationModalStore';
import { GlassCard } from '@/components/ui/GlassCard';
import { AnimatedPressable } from '@/components/ui/AnimatedPressable';
import { colors } from '@/theme/colors';

export function NotificationPermissionModal() {
  const {
    isOpen,
    isDeniedForever,
    onSuccessCallback,
    closeModal,
    setDeniedForever,
  } = useNotificationModalStore();

  const appStateListener = useRef<{ remove: () => void } | null>(null);

  // Clean up AppState listener if component unmounts or modal closes
  useEffect(() => {
    return () => {
      if (appStateListener.current) {
        appStateListener.current.remove();
        appStateListener.current = null;
      }
    };
  }, []);

  if (!isOpen) return null;

  const handleRequestPermission = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    const { status, canAskAgain } = await Notifications.requestPermissionsAsync();

    if (status === 'granted') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      await AsyncStorage.setItem('push_modal_granted', 'true');
      closeModal();
      if (onSuccessCallback) {
        onSuccessCallback();
      }
    } else {
      // Permission denied! Check if we can ask again or if they are permanently denied
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      if (!canAskAgain || status === 'denied') {
        setDeniedForever(true);
      } else {
        closeModal();
      }
    }
  };

  const handleOpenSettings = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    // Open native OS application settings
    await Linking.openSettings();

    // Listen for when the user returns to the app from OS settings
    if (!appStateListener.current) {
      appStateListener.current = AppState.addEventListener('change', async (nextAppState: AppStateStatus) => {
        if (nextAppState === 'active') {
          const { status } = await Notifications.getPermissionsAsync();
          if (status === 'granted') {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            await AsyncStorage.setItem('push_modal_granted', 'true');
            if (appStateListener.current) {
              appStateListener.current.remove();
              appStateListener.current = null;
            }
            closeModal();
            if (onSuccessCallback) {
              onSuccessCallback();
            }
          }
        }
      });
    }
  };

  const handleDismiss = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    // Record timestamp so we don't bother them every single app launch
    await AsyncStorage.setItem('push_modal_seen_time', Date.now().toString());
    closeModal();
  };

  return (
    <Modal
      transparent
      animationType="fade"
      visible={isOpen}
      onRequestClose={handleDismiss}
    >
      <View style={styles.overlay}>
        <Pressable style={StyleSheet.absoluteFill} onPress={handleDismiss} />
        
        <View style={styles.modalContainer}>
          <GlassCard elevated intensity={50} style={styles.card}>
            {/* Close X Button */}
            <Pressable style={styles.closeButton} onPress={handleDismiss}>
              <Ionicons name="close" size={20} color={colors.secondaryLabel} />
            </Pressable>

            {/* Icon Header */}
            <View style={[styles.iconContainer, isDeniedForever ? styles.iconWarning : styles.iconAccent]}>
              <Ionicons
                name={isDeniedForever ? 'settings' : 'notifications'}
                size={36}
                color={isDeniedForever ? colors.warning : colors.accent}
              />
            </View>

            {/* Typography */}
            <Text style={styles.title}>
              {isDeniedForever ? 'Enable in Settings ⚙️' : 'Never Miss a Reminder ⏳'}
            </Text>
            <Text style={styles.subtitle}>
              {isDeniedForever
                ? 'Push notifications are turned off in your device settings. Please enable them to receive instant class alerts.'
                : 'Get helpful push notifications 15 minutes before your lecture starts, plus instant alerts for cancelled classes.'}
            </Text>

            {/* Benefits List */}
            <View style={styles.benefitsContainer}>
              <View style={styles.benefitRow}>
                <Ionicons name="checkmark-circle" size={18} color={colors.success} />
                <Text style={styles.benefitText}>15-Minute Lecture Reminders</Text>
              </View>
              <View style={styles.benefitRow}>
                <Ionicons name="checkmark-circle" size={18} color={colors.success} />
                <Text style={styles.benefitText}>Instant Class Cancellation Alerts</Text>
              </View>
              <View style={styles.benefitRow}>
                <Ionicons name="checkmark-circle" size={18} color={colors.success} />
                <Text style={styles.benefitText}>Real-time Schedule Updates</Text>
              </View>
            </View>

            {/* Buttons */}
            <View style={styles.buttonGroup}>
              {isDeniedForever ? (
                <AnimatedPressable
                  style={[styles.primaryButton, styles.warningButton]}
                  onPress={handleOpenSettings}
                >
                  <Ionicons name="settings-outline" size={18} color="#FFF" style={{ marginRight: 8 }} />
                  <Text style={styles.primaryButtonText}>Open Device Settings</Text>
                </AnimatedPressable>
              ) : (
                <AnimatedPressable
                  style={styles.primaryButton}
                  onPress={handleRequestPermission}
                >
                  <Ionicons name="notifications-outline" size={18} color="#FFF" style={{ marginRight: 8 }} />
                  <Text style={styles.primaryButtonText}>Enable Reminders</Text>
                </AnimatedPressable>
              )}

              <AnimatedPressable
                style={styles.secondaryButton}
                onPress={handleDismiss}
              >
                <Text style={styles.secondaryButtonText}>
                  {isDeniedForever ? 'Not Now' : 'Maybe Later'}
                </Text>
              </AnimatedPressable>
            </View>
          </GlassCard>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  modalContainer: {
    width: '100%',
    maxWidth: 380,
  },
  card: {
    padding: 24,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: colors.glowBorder,
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.secondarySystemBackground,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  iconContainer: {
    width: 76,
    height: 76,
    borderRadius: 38,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
  },
  iconAccent: {
    backgroundColor: 'rgba(59, 130, 246, 0.15)',
    borderColor: 'rgba(59, 130, 246, 0.4)',
  },
  iconWarning: {
    backgroundColor: colors.warningBg,
    borderColor: 'rgba(245, 158, 11, 0.4)',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.label,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: colors.secondaryLabel,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },
  benefitsContainer: {
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: 16,
    padding: 14,
    marginBottom: 22,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  benefitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
  },
  benefitText: {
    fontSize: 13,
    color: colors.label,
    marginLeft: 10,
    fontWeight: '500',
  },
  buttonGroup: {
    width: '100%',
    gap: 10,
  },
  primaryButton: {
    width: '100%',
    backgroundColor: colors.accent,
    paddingVertical: 14,
    borderRadius: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  warningButton: {
    backgroundColor: colors.warning,
    shadowColor: colors.warning,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFF',
  },
  secondaryButton: {
    width: '100%',
    paddingVertical: 12,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  secondaryButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.secondaryLabel,
  },
});
