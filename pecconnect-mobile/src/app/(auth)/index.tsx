import { View, Text, StyleSheet, Pressable, ActivityIndicator, ImageBackground } from 'react-native';
import { colors } from '@/theme/colors';
import { Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Constants from 'expo-constants';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { useAuthStore } from '@/stores/useAuthStore';
import { api } from '@/utils/api';
import { useState } from 'react';
import { Link } from 'expo-router';
import { registerAndSyncPushToken } from '@/hooks/usePushNotifications';

const isExpoGo = Constants.appOwnership === 'expo';
let GoogleSignin: any = null;
let statusCodes: any = {};

if (!isExpoGo) {
  try {
    const gSignin = require('@react-native-google-signin/google-signin');
    GoogleSignin = gSignin.GoogleSignin;
    statusCodes = gSignin.statusCodes;
    GoogleSignin.configure({
      webClientId: '543780041775-6oh63o3lgn674sklfap5ltpaorosa7bg.apps.googleusercontent.com',
      iosClientId: '543780041775-5ofelpimp1c25edcer4et4g23ndsou84.apps.googleusercontent.com',
    });
  } catch (e) {
    console.log('Google Sign-in native module not available:', e);
  }
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function LoginScreen() {
  const login = useAuthStore((state) => state.login);
  const scale = useSharedValue(1);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleGoogleLogin = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    if (isExpoGo) {
      // In Expo Go, native Google Play Services module is not linked.
      // Auto-fallback to dev student login so developers/testers can test the UI in Expo Go!
      alert('Expo Go notice: Native Google Sign-In requires a development/standalone build. Logging in with Student Test Account for Expo Go testing...');
      await handleGuestLogin();
      return;
    }

    setIsLoggingIn(true);
    try {
      await GoogleSignin.hasPlayServices();
      await GoogleSignin.signIn();

      // Socialite in Laravel needs the Access Token, NOT the ID Token
      const tokens = await GoogleSignin.getTokens();

      if (tokens.accessToken) {
        await handleBackendAuth(tokens.accessToken);
      }
    } catch (error: any) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        console.log('User cancelled login');
      } else {
        console.error('Google Sign-in Error:', error);
        alert('Google Sign-in failed. Please check logs.');
      }
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleBackendAuth = async (googleAccessToken: string) => {
    try {
      // Send the Google token to our Laravel Backend
      const res = await api.post('/auth/google', { token: googleAccessToken });

      const { token, user } = res.data;

      // Save Sanctum token and user in Zustand
      await login(token, user);

      // Immediately prompt & sync push token
      registerAndSyncPushToken().catch(() => {});

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (error: any) {
      console.error('Login Failed', error.response?.data || error.message);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      alert(error.response?.data?.message || 'Login failed. Please use your @pec.edu.in email.');

      // CRITICAL FIX: Sign out of Google SDK so the user isn't stuck in a silent login loop with the wrong email
      try {
        await GoogleSignin.signOut();
      } catch (e) {
        console.error('Failed to sign out of Google SDK', e);
      }
    }
  };

  const handleGuestLogin = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setIsLoggingIn(true);
    try {
      const res = await api.post('/auth/guest');
      const { token, user } = res.data;
      await login(token, user);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (e) {
      console.error(e);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      alert('Guest login failed. Is the backend running?');
    } finally {
      setIsLoggingIn(false);
    }
  };

  // Hidden 5-tap trigger for App Store Reviewers
  const [tapCount, setTapCount] = useState(0);
  const handleLogoTap = () => {
    const newCount = tapCount + 1;
    setTapCount(newCount);
    if (newCount >= 5) {
      setTapCount(0); // reset
      handleGuestLogin();
    }
  };

  const animatedButtonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const onPressIn = () => {
    scale.value = withSpring(0.96, { damping: 10, stiffness: 300 });
  };

  const onPressOut = () => {
    scale.value = withSpring(1, { damping: 10, stiffness: 300 });
  };

  return (
    <ImageBackground
      source={require('../../../assets/images/mesh-bg.jpg')}
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <View style={styles.darkOverlay} />

      <View style={styles.container}>
        {/* Top Spacer */}
        <View style={styles.spacer} />

        {/* Brand & Crest Section */}
        <Pressable onPress={handleLogoTap} style={styles.brandContainer}>
          <Image
            source={require('../../../assets/images/icon.png')}
            style={styles.crestLogo}
            resizeMode="contain"
          />
          <Text style={styles.title}>PECverse</Text>
          <Text style={styles.subtitle}>Punjab Engineering College, Chandigarh</Text>
        </Pressable>

        {/* Unified Login Portal Box */}
        <View style={styles.portalContainer}>
          {/* Action Section */}
          <View style={styles.actionContainer}>
            <AnimatedPressable
              style={[styles.googleButton, animatedButtonStyle]}
              onPress={handleGoogleLogin}
              onPressIn={onPressIn}
              onPressOut={onPressOut}
              disabled={isLoggingIn}
            >
              {isLoggingIn ? (
                <ActivityIndicator color={colors.accent} />
              ) : (
                <>
                  <Ionicons name="lock-closed" size={20} color={colors.accent} style={styles.googleIcon} />
                  <Text style={styles.buttonText}>Sign In with PEC Email</Text>
                </>
              )}
            </AnimatedPressable>

            <Text style={styles.footerText}>
              Secured for official @pec.edu.in student accounts
            </Text>
          </View>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  darkOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(9, 9, 11, 0.88)',
  },
  container: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 48,
  },
  spacer: {
    height: 10,
  },
  brandContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  crestLogo: {
    width: 80,
    height: 80,
    marginBottom: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.5,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    color: colors.secondaryLabel,
    textAlign: 'center',
  },
  portalContainer: {
    backgroundColor: '#18181B',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    padding: 32,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 8,
  },
  actionContainer: {
    width: '100%',
    alignItems: 'center',
    gap: 14,
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 16,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },
  googleIcon: {
    marginRight: 10,
  },
  buttonText: {
    color: '#09090B',
    fontSize: 15,
    fontWeight: '700',
  },
  footerText: {
    fontSize: 12,
    color: colors.tertiaryLabel,
    textAlign: 'center',
  },
});
