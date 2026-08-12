import { Tabs, useRouter } from 'expo-router';
import { StyleSheet, View, Platform, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/theme/colors';
import { BlurView } from 'expo-blur';
import { useAuthStore } from '@/stores/useAuthStore';
import * as Haptics from 'expo-haptics';

export default function TabLayout() {
  const user = useAuthStore(state => state.user);
  const router = useRouter();
  
  const isAuthorized = user?.role === 'cr' || user?.role === 'superadmin';

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: Platform.OS === 'ios' ? 'transparent' : 'rgba(15, 15, 20, 0.95)',
          borderTopWidth: 1,
          borderTopColor: colors.glassBorder, // Subtle glass rim
          height: Platform.OS === 'ios' ? 88 : 64,
          paddingBottom: Platform.OS === 'ios' ? 28 : 8,
          paddingTop: 8,
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          elevation: 0, // Remove solid shadow
        },
        tabBarBackground: () => (
          Platform.OS === 'ios' ? (
            <BlurView 
              tint="dark" 
              intensity={80} 
              style={StyleSheet.absoluteFill} 
            />
          ) : null
        ),
        tabBarActiveTintColor: colors.accent, // Electric Blue active tint
        tabBarInactiveTintColor: colors.tertiaryLabel, // Slate muted inactive tint
        tabBarShowLabel: true,
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
          marginTop: 2,
        },
      }}
    >
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
      
      {/* Custom Post Button Tab */}
      <Tabs.Screen
        name="post"
        options={{
          title: '',
          tabBarButton: (props) => (
            isAuthorized ? (
              <Pressable
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                  router.push('/post-announcement');
                }}
                style={styles.customTabButton}
              >
                <View style={styles.customTabIconContainer}>
                  <Ionicons name="add" size={28} color="#fff" />
                </View>
              </Pressable>
            ) : null
          ),
        }}
      />

      <Tabs.Screen
        name="notes/index"
        options={{
          title: 'Resources',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons 
              name={focused ? "book" : "book-outline"} 
              size={22} 
              color={color} 
            />
          ),
        }}
      />
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
    top: -20,
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1, // Let it take even space with other tabs
  },
  customTabIconContainer: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.accent,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  }
});
