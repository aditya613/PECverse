import { useState, useEffect, useRef, useCallback } from 'react';
import { Platform, AppState, AppStateStatus } from 'react-native';
import * as Device from 'expo-device';
import Constants from 'expo-constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from '@/utils/api';
import { useNotificationModalStore } from '@/stores/useNotificationModalStore';
import { useAuthStore } from '@/stores/useAuthStore';

const isExpoGo = Constants.appOwnership === 'expo';

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
 * Global utility function that can be called from Profile, Settings, or anywhere in the app
 * when a user manually taps a "Turn On Notifications" toggle/button.
 */
export async function checkAndPromptPushPermissions(forceShow = false): Promise<boolean> {
  if (isExpoGo || !Notifications) {
    console.log('Push notifications are simulated in Expo Go');
    return false;
  }

  if (!Device.isDevice) {
    console.log('Must use physical device for Push Notifications');
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
          const token = await fetchExpoPushToken();
          if (token) {
            await syncTokenToBackend(token);
          }
        },
      });
      return false;
    }

    if (!isDeniedForever) {
      const lastSeen = await AsyncStorage.getItem('push_modal_seen_time');
      const now = Date.now();
      const sevenDaysMs = 7 * 24 * 60 * 60 * 1000;

      if (!lastSeen || now - parseInt(lastSeen, 10) > sevenDaysMs) {
        useNotificationModalStore.getState().openModal({
          isDeniedForever: false,
          onSuccess: async () => {
            const token = await fetchExpoPushToken();
            if (token) {
              await syncTokenToBackend(token);
            }
          },
        });
      }
    }
  } catch (err) {
    console.warn('Push permission check skipped:', err);
  }

  return false;
}

async function fetchExpoPushToken(): Promise<string | null> {
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
      Constants?.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId;

    const tokenResponse = await Notifications.getExpoPushTokenAsync({
      projectId: projectId || 'pec-connect-project',
    });
    return tokenResponse.data;
  } catch (e) {
    console.log('Push token not available in this environment:', e);
    return null;
  }
}

async function syncTokenToBackend(token: string) {
  try {
    const { isAuthenticated } = useAuthStore.getState();

    if (isAuthenticated) {
      await api.post('/user/push-token', { token });
    }
  } catch (err) {
    console.log('Failed to sync push token to backend:', err);
  }
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
      const { status } = await Notifications.getPermissionsAsync();
      if (status === 'granted') {
        const token = await fetchExpoPushToken();
        if (token) {
          setExpoPushToken(token);
          await syncTokenToBackend(token);
        }
      } else {
        await checkAndPromptPushPermissions(false);
      }
    } catch (e) {
      // Ignore in Expo Go or dev environments
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
