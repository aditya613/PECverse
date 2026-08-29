import { useState, useEffect, useRef, useCallback } from 'react';
import { Platform, AppState, AppStateStatus } from 'react-native';
import * as Device from 'expo-device';
import Constants from 'expo-constants';
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

export function usePushNotifications() {
  const [expoPushToken, setExpoPushToken] = useState<string | null>(null);
  const [notification, setNotification] = useState<any | null>(null);
  const notificationListener = useRef<any | null>(null);
  const responseListener = useRef<any | null>(null);
  
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
      notificationListener.current = Notifications.addNotificationReceivedListener((notif: any) => {
        setNotification(notif);
      });

      responseListener.current = Notifications.addNotificationResponseReceivedListener((response: any) => {
        const data = response.notification.request.content.data;
        if (data?.url) {
          // Deep linking logic
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
