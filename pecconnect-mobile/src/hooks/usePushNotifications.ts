import { useState, useEffect, useRef, useCallback } from 'react';
import { Platform, AppState, AppStateStatus, Linking } from 'react-native';
import * as Device from 'expo-device';
import Constants from 'expo-constants';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from '@/utils/api';
import { useNotificationModalStore } from '@/stores/useNotificationModalStore';
import { useAuthStore } from '@/stores/useAuthStore';

const isExpoGo = Constants.appOwnership === 'expo';
export const EAS_PROJECT_ID = '999365ed-edd9-4525-9357-1edf51149ed7';

// Lazily load expo-notifications safely outside Expo Go
let Notifications: any = null;
if (!isExpoGo) {
  try {
    Notifications = require('expo-notifications');
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
        shouldShowBanner: true,
        shouldShowList: true,
      }),
    });
  } catch (e) {
    //
  }
}

/**
 * Robust function to fetch Expo Push Token
 */
export async function fetchExpoPushToken(): Promise<string | null> {
  if (isExpoGo || !Notifications) return null;
  try {
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#3B82F6',
      });
    }

    const projectId =
      Constants?.expoConfig?.extra?.eas?.projectId ??
      Constants?.easConfig?.projectId ??
      EAS_PROJECT_ID;

    const tokenResponse = await Notifications.getExpoPushTokenAsync({
      projectId: projectId || EAS_PROJECT_ID,
    });
    return tokenResponse.data;
  } catch (e) {
    console.log('Push token generation failed:', e);
    return null;
  }
}

/**
 * Sync token to backend for authenticated user
 */
export async function syncTokenToBackend(token: string) {
  try {
    const { isAuthenticated, user, setUser } = useAuthStore.getState();

    if (isAuthenticated && token) {
      await api.post('/user/push-token', { token });
      if (user && user.expo_push_token !== token) {
        setUser({ ...user, expo_push_token: token } as any);
      }
    }
  } catch (err) {
    console.log('Failed to sync push token to backend:', err);
  }
}

/**
 * Top-level function to request permissions, fetch token, and sync to backend immediately.
 * Can be called during Google Sign-In, Onboarding, or App Boot.
 */
export async function registerAndSyncPushToken(): Promise<string | null> {
  if (isExpoGo || !Notifications || !Device.isDevice) return null;

  try {
    let { status } = await Notifications.getPermissionsAsync();

    if (status !== 'granted') {
      const permissionRes = await Notifications.requestPermissionsAsync();
      status = permissionRes.status;
    }

    if (status === 'granted') {
      const token = await fetchExpoPushToken();
      if (token) {
        await syncTokenToBackend(token);
        return token;
      }
    }
  } catch (error) {
    console.log('Error in registerAndSyncPushToken:', error);
  }

  return null;
}

/**
 * Global utility function that can be called from Profile or Settings
 */
export async function checkAndPromptPushPermissions(forceShow = false): Promise<boolean> {
  if (isExpoGo || !Notifications || !Device.isDevice) {
    return false;
  }

  try {
    const { status, canAskAgain } = await Notifications.getPermissionsAsync();

    if (status === 'granted') {
      const token = await fetchExpoPushToken();
      if (token) {
        await syncTokenToBackend(token);
      }
      return true;
    }

    const isDeniedForever = status === 'denied' || !canAskAgain;

    if (forceShow) {
      useNotificationModalStore.getState().openModal({
        isDeniedForever,
        onSuccess: async () => {
          const token = await registerAndSyncPushToken();
          if (token) {
            await syncTokenToBackend(token);
          }
        },
      });
      return false;
    }

    // Directly request native permission if not forceShow and not permanently denied
    if (!isDeniedForever) {
      const token = await registerAndSyncPushToken();
      if (token) return true;
    }
  } catch (err) {
    console.warn('Push permission check skipped:', err);
  }

  return false;
}

/**
 * Safe global handler to open notification URLs (external links or in-app routes)
 */
export async function handleNotificationUrl(rawUrl: any) {
  if (!rawUrl) return;
  const targetUrl = String(rawUrl).trim();
  if (!targetUrl) return;

  console.log('[Notification Click] Handling URL:', targetUrl);

  // External URLs (WhatsApp, HTTPS, Market, Mail, Phone)
  if (
    targetUrl.startsWith('http://') ||
    targetUrl.startsWith('https://') ||
    targetUrl.startsWith('whatsapp://') ||
    targetUrl.startsWith('market://') ||
    targetUrl.startsWith('itms-apps://') ||
    targetUrl.startsWith('tel:') ||
    targetUrl.startsWith('mailto:')
  ) {
    try {
      await Linking.openURL(targetUrl);
    } catch (err) {
      console.log('Failed to open external link:', err);
    }
  } else {
    // In-app internal routes (e.g. '/(tabs)/profile', '/mess', '/lost-found')
    try {
      router.push(targetUrl as any);
    } catch (err) {
      console.log('Failed to navigate to in-app route:', err);
    }
  }
}

export function usePushNotifications() {
  const [expoPushToken, setExpoPushToken] = useState<string | null>(null);
  const [notification, setNotification] = useState<any | null>(null);
  const notificationListener = useRef<any | null>(null);
  const responseListener = useRef<any | null>(null);
  const hasHandledInitialResponse = useRef(false);
  
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);

  const checkAndSync = useCallback(async () => {
    if (isExpoGo || !Notifications || !isAuthenticated || !Device.isDevice) return;

    try {
      const token = await registerAndSyncPushToken();
      if (token) {
        setExpoPushToken(token);
      }
    } catch (e) {
      // Ignore
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (isExpoGo || !Notifications) return;

    checkAndSync();

    try {
      // 1. Cold Start: Check if app was opened by tapping a notification while closed
      if (!hasHandledInitialResponse.current) {
        hasHandledInitialResponse.current = true;
        Notifications.getLastNotificationResponseAsync()
          .then((response: any) => {
            if (response) {
              const data = response?.notification?.request?.content?.data;
              const url = data?.url || data?.link || data?.path;
              if (url) {
                // Wait for navigation stack & protected routes to settle
                setTimeout(() => {
                  handleNotificationUrl(url);
                }, 1000);
              }
            }
          })
          .catch((err: any) => {
            console.log('Error checking last notification response:', err);
          });
      }

      // 2. Foreground notification listener
      notificationListener.current = Notifications.addNotificationReceivedListener((notif: any) => {
        setNotification(notif);
      });

      // 3. Runtime notification click listener (background / active)
      responseListener.current = Notifications.addNotificationResponseReceivedListener((response: any) => {
        const data = response?.notification?.request?.content?.data;
        const url = data?.url || data?.link || data?.path;
        if (url) {
          handleNotificationUrl(url);
        }
      });
    } catch (e) {
      // Ignore
    }

    const appStateListener = AppState.addEventListener('change', (nextAppState: AppStateStatus) => {
      if (nextAppState === 'active') {
        checkAndSync();
      }
    });

    return () => {
      if (notificationListener.current) {
        notificationListener.current.remove();
      }
      if (responseListener.current) {
        responseListener.current.remove();
      }
      appStateListener.remove();
    };
  }, [checkAndSync]);

  return { expoPushToken, notification, promptPermissions: () => checkAndPromptPushPermissions(true) };
}
