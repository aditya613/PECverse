import { Tabs, useRouter } from 'expo-router';
import { StyleSheet, View, Platform, Pressable, ActionSheetIOS, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/theme/colors';
import { BlurView } from 'expo-blur';
import { useAuthStore } from '@/stores/useAuthStore';
import * as Haptics from 'expo-haptics';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function TabLayout() {
  const user = useAuthStore(state => state.user);
  const router = useRouter();
  const { colors, isDark } = useTheme();
  const insets = useSafeAreaInsets();
  
  const isAuthorized = user?.role === 'cr' || user?.role === 'superadmin';
  const bottomInset = Math.max(insets.bottom, Platform.OS === 'android' ? 10 : 12);
  const tabHeight = 58 + bottomInset;

  const handlePlusPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    if (Platform.OS === 'ios') {
      if (isAuthorized) {
        ActionSheetIOS.showActionSheetWithOptions(
          {
            options: ['Cancel', '📢 Post Class Announcement', '🔍 Report Lost & Found Item', '🌴 Declare Holiday / Timetable'],
            cancelButtonIndex: 0,
            tintColor: colors.accent,
          },
          (buttonIndex) => {
            if (buttonIndex === 1) router.push('/post-announcement' as any);
            if (buttonIndex === 2) router.push('/post-lost-found' as any);
            if (buttonIndex === 3) router.push('/manage-timetable' as any);
          }
        );
      } else {
        ActionSheetIOS.showActionSheetWithOptions(
          {
            options: ['Cancel', '🔍 Report Lost & Found Item', '📝 Send App Feedback & Suggestions'],
            cancelButtonIndex: 0,
            tintColor: colors.accent,
          },
          (buttonIndex) => {
            if (buttonIndex === 1) router.push('/post-lost-found' as any);
            if (buttonIndex === 2) router.push('/feedback' as any);
          }
        );
      }
    } else {
      if (isAuthorized) {
        Alert.alert(
          'Quick Action',
          'Choose an action to perform:',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: '📢 Post Class Announcement', onPress: () => router.push('/post-announcement' as any) },
            { text: '🔍 Report Lost & Found Item', onPress: () => router.push('/post-lost-found' as any) },
            { text: '🌴 Declare Holiday / Timetable', onPress: () => router.push('/manage-timetable' as any) },
          ]
        );
      } else {
        Alert.alert(
          'Quick Action',
          'Choose an action to perform:',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: '🔍 Report Lost & Found Item', onPress: () => router.push('/post-lost-found' as any) },
            { text: '📝 Send App Feedback', onPress: () => router.push('/feedback' as any) },
          ]
        );
      }
    }
  };

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: Platform.OS === 'ios' ? 'transparent' : colors.cardBackground,
          borderTopWidth: 1,
          borderTopColor: colors.cardBorder,
          height: tabHeight,
          paddingBottom: bottomInset,
          paddingTop: 6,
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          elevation: isDark ? 0 : 8,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: isDark ? 0 : 0.06,
          shadowRadius: 8,
        },
        tabBarBackground: () => (
          Platform.OS === 'ios' ? (
            <BlurView 
              tint={isDark ? 'dark' : 'light'} 
              intensity={90} 
              style={StyleSheet.absoluteFill} 
            />
          ) : null
        ),
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.tertiaryLabel,
        tabBarShowLabel: true,
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '700',
          marginTop: 2,
        },
      }}
    >
      {/* 1. Home Dashboard */}
      <Tabs.Screen
        name="dashboard/index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons 
              name={focused ? "home" : "home-outline"} 
              size={22} 
              color={color} 
            />
          ),
        }}
      />

      {/* 2. Date-Wise Timetable Schedule */}
      <Tabs.Screen
        name="timetable/index"
        options={{
          title: 'Schedule',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons 
              name={focused ? "calendar" : "calendar-outline"} 
              size={22} 
              color={color} 
            />
          ),
        }}
      />
      
      {/* 3. Center Create (+) Action Button */}
      <Tabs.Screen
        name="post"
        options={{
          title: '',
          tabBarButton: () => (
            <Pressable
              onPress={handlePlusPress}
              style={styles.customTabButton}
            >
              <View style={[styles.customTabIconContainer, { backgroundColor: colors.accent, borderColor: colors.systemBackground }]}>
                <Ionicons name="add" size={28} color="#FFFFFF" />
              </View>
            </Pressable>
          ),
        }}
      />

      {/* 4. Notes & Study Resources */}
      <Tabs.Screen
        name="notes/index"
        options={{
          title: 'Resources',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons 
              name={focused ? "folder-open" : "folder-open-outline"} 
              size={22} 
              color={color} 
            />
          ),
        }}
      />

      {/* 5. Profile & Career */}
      <Tabs.Screen
        name="profile/index"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons 
              name={focused ? "person" : "person-outline"} 
              size={22} 
              color={color} 
            />
          ),
        }}
      />
      
    </Tabs>
  );
}

const styles = StyleSheet.create({
  customTabButton: {
    top: -16,
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  customTabIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 6,
    borderWidth: 3,
  }
});
