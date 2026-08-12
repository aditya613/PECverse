import { View, Text, StyleSheet, Pressable, ActivityIndicator, ImageBackground } from 'react-native';
import { colors } from '@/theme/colors';
import { Image } from 'expo-image';
import { SymbolView } from 'expo-symbols';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { useAuthStore } from '@/stores/useAuthStore';
import { api } from '@/utils/api';
import { useState } from 'react';

// Configure Google Sign-in Native SDK
GoogleSignin.configure({
  webClientId: '543780041775-6oh63o3lgn674sklfap5ltpaorosa7bg.apps.googleusercontent.com', 
  iosClientId: '543780041775-5ofelpimp1c25edcer4et4g23ndsou84.apps.googleusercontent.com',
});

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function LoginScreen() {
  const login = useAuthStore((state) => state.login);
  const scale = useSharedValue(1);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleGoogleLogin = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
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

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <ImageBackground
      source={require('@/assets/images/mesh-bg.jpg')}
      style={styles.container}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <View style={styles.header}>
          <Pressable onPress={handleLogoTap} style={styles.logoContainer}>
            <Image
              source={require('@/assets/images/splash-icon.png')}
              style={styles.logoIcon}
              contentFit="contain"
            />
          </Pressable>
          <Text style={styles.title}>PECverse</Text>
          <Text style={styles.subtitle}>Made by PEC students, for PEC students.</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Welcome Back</Text>
          <Text style={styles.cardSubtitle}>Sign in with your PEC credentials to access your dashboard.</Text>

          <AnimatedPressable
            style={[styles.button, animatedStyle, isLoggingIn && styles.buttonDisabled]}
            onPressIn={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              scale.value = withSpring(0.95);
            }}
            onPressOut={() => {
              scale.value = withSpring(1);
            }}
            onPress={handleGoogleLogin}
            disabled={isLoggingIn}
          >
            {isLoggingIn ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <>
                <SymbolView
                  name="g.circle.fill"
                  style={styles.buttonIcon}
                  tintColor="#ffffff"
                />
                <Text style={styles.buttonText}>Continue with Google</Text>
              </>
            )}
          </AnimatedPressable>

          <Text style={styles.disclaimer}>
            Only official @pec.edu.in accounts are supported.
          </Text>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.systemBackground as string,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)', // Darkens the bright mesh gradient
    justifyContent: 'center',
    padding: 24,
    gap: 48,
  },
  header: {
    alignItems: 'center',
    gap: 12,
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 90,
    height: 90,
    borderRadius: 28,
    backgroundColor: 'rgba(32, 138, 239, 0.15)',
    marginBottom: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    boxShadow: '0 8px 32px rgba(32, 138, 239, 0.3)',
  },
  logoIcon: {
    width: 56,
    height: 56,
  },
  title: {
    fontSize: 34,
    fontWeight: '800',
    color: '#ffffff', // Force white against gradient
    letterSpacing: -1,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.7)',
    fontWeight: '500',
  },
  card: {
    backgroundColor: 'rgba(20, 20, 25, 0.75)', // Glassmorphism dark backing
    borderRadius: 24,
    padding: 24,
    gap: 16,
    alignItems: 'center',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#ffffff',
  },
  cardSubtitle: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.7)',
    textAlign: 'center',
    marginBottom: 8,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.accent as string,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 100, // Pill shape
    gap: 12,
    width: '100%',
    justifyContent: 'center',
    boxShadow: '0 8px 16px rgba(32, 138, 239, 0.4)',
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonIcon: {
    width: 20,
    height: 20,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 17,
    fontWeight: '600',
  },
  disclaimer: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.5)',
    textAlign: 'center',
    marginTop: 8,
  },
});
