import { Redirect } from 'expo-router';

export default function Index() {
  // We redirect to the main app by default.
  // The `useProtectedRoute` hook in `_layout.tsx` will intercept this 
  // behind the Splash Screen if the user is not authenticated or needs onboarding.
  return <Redirect href="/(tabs)/dashboard" />;
}
