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

// Prevent auto-hiding the splash screen until our auth check finishes.
SplashScreen.preventAutoHideAsync().catch(() => {
  /* reloading the app might trigger some race conditions, ignore them */
});

const queryClient = new QueryClient();

function RootLayoutNav() {
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  
  // Call the robust navigation guard
  useProtectedRoute();
  
  // Register for push notifications and sync when authenticated
  usePushNotifications(isAuthenticated);

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
