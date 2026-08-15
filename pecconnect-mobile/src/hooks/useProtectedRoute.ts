import { useEffect } from 'react';
import { useRouter, useSegments } from 'expo-router';
import { useAuthStore } from '@/stores/useAuthStore';
import * as SplashScreen from 'expo-splash-screen';

export function useProtectedRoute() {
  const segments = useSegments();
  const router = useRouter();
  const { isAuthenticated, isLoading, user } = useAuthStore();

  useEffect(() => {
    // Wait until we have definitively checked auth via the API
    if (isLoading) return;

    const inAuthGroup = segments[0] === '(auth)';
    const inOnboarding = segments[0] === 'onboarding';
    const inOrientation = (segments[0] as string) === 'orientation';
    const isRoot = (segments as string[]).length === 0;

    if (!isAuthenticated && !inAuthGroup && !inOrientation) {
      // User is not authenticated, must login
      router.replace('/(auth)');
    } else if (isAuthenticated) {
      if (!user?.class_id && !inOnboarding && !inOrientation) {
        // User authenticated but no class, must onboard
        router.replace('/onboarding');
      } else if (user?.class_id && (inAuthGroup || inOnboarding || isRoot)) {
        // User is fully authenticated, prevent them from accessing auth/onboarding screens
        router.replace('/(tabs)/dashboard');
      }
    }

    // Auth resolution is completely finished, navigation is fired.
    // Safe to drop the splash screen now.
    SplashScreen.hideAsync().catch(() => {
      // Ignore errors if already hidden
    });
  }, [isAuthenticated, isLoading, user, segments]);
}
