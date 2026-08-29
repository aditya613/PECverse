import { Stack } from 'expo-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { useAuthStore } from '@/stores/useAuthStore';
import * as SecureStore from 'expo-secure-store';
import { api } from '@/utils/api';
import { useProtectedRoute } from '@/hooks/useProtectedRoute';
import * as SplashScreen from 'expo-splash-screen';
import { usePushNotifications } from '@/hooks/usePushNotifications';
import { NotificationPermissionModal } from '@/components/ui/NotificationPermissionModal';

// Export global ErrorBoundary to catch and display React render errors gracefully
export { ErrorBoundary } from 'expo-router';
import * as Updates from 'expo-updates';
import { AppState, Platform } from 'react-native';
import Constants from 'expo-constants';
import { useRouter } from 'expo-router';

// Prevent auto-hiding the splash screen until our auth check finishes.
SplashScreen.preventAutoHideAsync().catch(() => {
  /* reloading the app might trigger some race conditions, ignore them */
});

// Setup Global Error Handler for Prod Crashes
if (!__DEV__) {
  const defaultErrorHandler = (global as any).ErrorUtils?.getGlobalHandler?.();
  if (defaultErrorHandler) {
    (global as any).ErrorUtils.setGlobalHandler(async (error: any, isFatal: boolean) => {
      try {
        await api.post('/log-error', {
          message: error?.message || 'Unknown Error',
          stack: error?.stack || '',
          isFatal,
          os: Platform.OS,
          version: Constants.expoConfig?.version
        });
      } catch (e) {
        // Ignore network errors while reporting
      }
      defaultErrorHandler(error, isFatal);
    });
  }
}

const queryClient = new QueryClient();

function RootLayoutNav() {
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  const router = useRouter();

  // Version Check
  useEffect(() => {
    const checkVersion = async () => {
      try {
        const res = await api.get('/app-version');
        const minVersion = Platform.OS === 'ios' ? res.data.min_ios : res.data.min_android;
        const currentVersion = Constants.expoConfig?.version || '1.0.0';
        
        const isVersionOutdated = (current: string, minimum: string) => {
          const v1 = current.split('.').map(Number);
          const v2 = minimum.split('.').map(Number);
          for (let i = 0; i < Math.max(v1.length, v2.length); i++) {
            const num1 = v1[i] || 0;
            const num2 = v2[i] || 0;
            if (num1 < num2) return true;
            if (num1 > num2) return false;
          }
          return false;
        };

        if (isVersionOutdated(currentVersion, minVersion)) {
          router.replace('/force-update' as any);
        }
      } catch (e) {
        console.log('Failed to check app version', e);
      }
    };
    checkVersion();
  }, []);
  
  // Call the robust navigation guard
  useProtectedRoute();
  
  // Push Notifications Setup (checks internally if authenticated or fresher)
  usePushNotifications();

  // Handle OTA updates on startup
  useEffect(() => {
    async function onFetchUpdateAsync() {
      try {
        const update = await Updates.checkForUpdateAsync();

        if (update.isAvailable) {
          await Updates.fetchUpdateAsync();
          await Updates.reloadAsync();
        }
      } catch (error) {
        // You can also add an alert or error boundary here if needed
        console.log('Error fetching latest Expo update:', error);
      }
    }

    // Only run in production builds, otherwise it errors in development
    if (!__DEV__) {
      onFetchUpdateAsync();
    }
  }, []);

  // On App Mount: Check if token exists and fetch user
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = await SecureStore.getItemAsync('auth_token');
        if (token) {
          // Verify token and fetch latest user data
          const res = await api.get('/user/profile');
          useAuthStore.setState({ 
            user: res.data.user, 
            isAuthenticated: true, 
            isLoading: false 
          });
        } else {
          useAuthStore.setState({ isAuthenticated: false, isLoading: false });
        }
      } catch (e) {
        useAuthStore.setState({ isAuthenticated: false, isLoading: false });
      }
    };
    checkAuth();
  }, []);

  // Unconditionally return the Stack. 
  // No `if (isLoading) return null;` here anymore!
  // The Splash Screen covers the app while isLoading is true.
  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)" options={{ animation: 'fade' }} />
        <Stack.Screen name="onboarding" options={{ animation: 'fade' }} />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen 
          name="post-announcement" 
          options={{
            presentation: 'modal',
            animation: 'slide_from_bottom'
          }} 
        />
        <Stack.Screen 
          name="manage-timetable" 
          options={{
            presentation: 'modal',
            animation: 'slide_from_bottom'
          }} 
        />
        <Stack.Screen 
          name="edit-class" 
          options={{
            presentation: 'modal',
            animation: 'slide_from_bottom'
          }} 
        />
        <Stack.Screen 
          name="edit-timetable-class" 
          options={{
            presentation: 'modal',
            animation: 'slide_from_bottom'
          }} 
        />
        <Stack.Screen 
          name="manage-class-options" 
          options={{
            presentation: 'transparentModal',
            animation: 'fade'
          }} 
        />
        <Stack.Screen 
          name="club/[id]" 
          options={{
            presentation: 'modal',
            animation: 'slide_from_bottom'
          }} 
        />
        <Stack.Screen 
          name="feedback" 
          options={{
            presentation: 'modal',
            animation: 'slide_from_bottom'
          }} 
        />
        <Stack.Screen 
          name="force-update" 
          options={{
            presentation: 'fullScreenModal',
            gestureEnabled: false,
            animation: 'fade'
          }} 
        />
      </Stack>
      <NotificationPermissionModal />
    </>
  );
}

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <RootLayoutNav />
      <StatusBar style="light" />
    </QueryClientProvider>
  );
}
