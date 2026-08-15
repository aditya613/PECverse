import { useState, useEffect, useRef, useCallback } from 'react';
import { Platform } from 'react-native';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from '@/utils/api';
import { useNotificationModalStore } from '@/stores/useNotificationModalStore';
import { useFresherStore } from '@/stores/useFresherStore';
import { useAuthStore } from '@/stores/useAuthStore';

// Configure how notifications appear when the app is in the foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

/**
 * Global utility function that can be called from Profile, Settings, or anywhere in the app
 * when a user manually taps a "Turn On Notifications" toggle/button.
 */
export async function checkAndPromptPushPermissions(forceShow = false): Promise<boolean> {
  if (!Device.isDevice) {
    console.log('Must use physical device for Push Notifications');
    return false;
  }

  const { status, canAskAgain } = await Notifications.getPermissionsAsync();

  if (status === 'granted') {
    // Already granted! Fetch and sync token immediately
    const token = await fetchExpoPushToken();
    if (token) {
      await syncTokenToBackend(token);
    }
    return true;
  }

  const isDeniedForever = status === 'denied' || !canAskAgain;

  // If forceShow is true (user tapped a button in settings), always show modal!
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

  // If NOT forceShow (automatic check on app launch):
  // Only show soft prompt if we haven't asked them yet AND haven't shown modal recently (within 7 days)
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

  return false;
}

async function fetchExpoPushToken(): Promise<string | null> {
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
    console.error('Error fetching Expo push token:', e);
    return null;
  }
}

async function syncTokenToBackend(token: string) {
  try {
    const { fresher, deviceId } = useFresherStore.getState();
    const { isAuthenticated } = useAuthStore.getState();

    if (isAuthenticated) {
      await api.post('/user/push-token', { token });
    } else if (fresher && deviceId) {
      await api.post('/freshers/push-token', { token, device_id: deviceId });
    }
  } catch (err) {
    console.error('Failed to sync push token to backend:', err);
  }
}

export function usePushNotifications() {
  const [expoPushToken, setExpoPushToken] = useState<string | null>(null);
  const [notification, setNotification] = useState<Notifications.Notification | null>(null);
  const notificationListener = useRef<Notifications.Subscription | null>(null);
  const responseListener = useRef<Notifications.Subscription | null>(null);
  
  // We can just rely on the stores directly to know if we are authenticated or a fresher
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  const isFresher = useFresherStore(state => !!state.fresher);

  const checkAndSync = useCallback(async () => {
    if ((!isAuthenticated && !isFresher) || !Device.isDevice) return;

    const { status } = await Notifications.getPermissionsAsync();
    if (status === 'granted') {
      const token = await fetchExpoPushToken();
      if (token) {
        setExpoPushToken(token);
        await syncTokenToBackend(token);
      }
    } else {
      // Trigger our smart soft prompt (won't nag if already denied or seen recently)
      await checkAndPromptPushPermissions(false);
    }
  }, [isAuthenticated, isFresher]);

  useEffect(() => {
    checkAndSync();

    notificationListener.current = Notifications.addNotificationReceivedListener((notif) => {
      setNotification(notif);
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener((response) => {
      const data = response.notification.request.content.data;
      if (data?.url) {
        // Deep linking logic if url is provided in payload
      }
    });

    return () => {
      if (notificationListener.current) {
        notificationListener.current.remove();
      }
      if (responseListener.current) {
        responseListener.current.remove();
      }
    };
  }, [checkAndSync]);

  return { expoPushToken, notification, promptPermissions: () => checkAndPromptPushPermissions(true) };
}
