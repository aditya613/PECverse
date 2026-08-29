import React from 'react';
import { View, Text, StyleSheet, Pressable, Platform, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/theme/colors';
import * as Haptics from 'expo-haptics';

export default function ForceUpdateScreen() {
  const { colors } = useTheme();

  const handleUpdate = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    const storeUrl = Platform.OS === 'ios' 
      ? 'https://apps.apple.com/app/idYOUR_APPLE_ID' 
      : 'market://details?id=com.pecconnect.app';
    
    Linking.openURL(storeUrl).catch(() => {
      // Ignore
    });
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.systemBackground }]}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Ionicons name="rocket" size={64} color="#3B82F6" />
        </View>
        <Text style={[styles.title, { color: colors.label }]}>Update Required</Text>
        <Text style={[styles.subtitle, { color: colors.secondaryLabel }]}>
          A critical new version of PECverse is available. You need to update the app to continue using it.
        </Text>
        
        <Pressable 
          style={({ pressed }) => [
            styles.updateBtn,
            { backgroundColor: colors.accent, opacity: pressed ? 0.8 : 1 }
          ]}
          onPress={handleUpdate}
        >
          <Text style={styles.updateBtnText}>Update Now</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  content: {
    alignItems: 'center',
    maxWidth: 320,
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(59, 130, 246, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 16,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
    marginBottom: 40,
  },
  updateBtn: {
    paddingVertical: 16,
    paddingHorizontal: 48,
    borderRadius: 16,
    width: '100%',
    alignItems: 'center',
  },
  updateBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
