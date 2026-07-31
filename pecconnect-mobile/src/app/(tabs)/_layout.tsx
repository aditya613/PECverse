import { Tabs } from 'expo-router';
import { StyleSheet, View, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/theme/colors';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: 'transparent', // Make true transparent for BlurView to work
          borderTopWidth: 1,
          borderTopColor: colors.glassBorder, // Subtle glass rim
          height: Platform.OS === 'ios' ? 88 : 64,
          paddingBottom: Platform.OS === 'ios' ? 28 : 8,
          paddingTop: 8,
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          elevation: 0, // Remove solid shadow to prevent clipping the blur
        },
        tabBarBackground: () => (
          <BlurView 
            tint="dark" 
            intensity={80} 
            style={StyleSheet.absoluteFill} 
          />
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
      // Haptics removed on tab press to prevent buzzing on every navigation tap
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
