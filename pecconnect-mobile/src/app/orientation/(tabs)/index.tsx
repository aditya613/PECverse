import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Linking, Modal } from 'react-native';
import { colors, useTheme } from '@/theme/colors';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import Animated, { FadeInDown, FadeIn, withSpring, useAnimatedStyle, useSharedValue } from 'react-native-reanimated';
import { Image } from 'expo-image';
import { ZoomableImage } from '@/components/ui/ZoomableImage';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/utils/api';
import { useFresherStore } from '@/stores/useFresherStore';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const BRANCHES = [
  { id: 'CSE', name: 'Computer Science', group: 'Group A', attendance: 'Auditorium', dept: 'Auditorium' },
  { id: 'ECE', name: 'Electronics & Comm', group: 'Group B', attendance: 'Auditorium', dept: 'Aero Auditorium' },
  { id: 'VLSI', name: 'VLSI Design', group: 'Group C', attendance: 'Auditorium', dept: 'Aero Auditorium' },
  { id: 'B.Design', name: 'B.Design', group: 'Group C', attendance: 'L-26', dept: 'L-17' },
  { id: 'AERO', name: 'Aerospace', group: 'Group C', attendance: 'L-26', dept: 'Seminar Hall, Aero Department' },
  { id: 'Electrical', name: 'Electrical', group: 'Group D', attendance: 'L-27', dept: 'L-27' },
  { id: 'Civil', name: 'Civil', group: 'Group E', attendance: 'L-28', dept: 'L-26' },
  { id: 'AI', name: 'Artificial Intelligence', group: 'Group F', attendance: 'L-29', dept: 'Auditorium' },
  { id: 'DS', name: 'Data Science', group: 'Group F', attendance: 'L-29', dept: 'Auditorium' },
  { id: 'M and C', name: 'Maths & Computing', group: 'Group F', attendance: 'L-29', dept: 'Mathematics Lab near T5' },
  { id: 'Mechanical', name: 'Mechanical', group: 'Group G', attendance: 'L-30', dept: 'L-28' },
  { id: 'Metallurgy', name: 'Metallurgy', group: 'Group H', attendance: 'L-31', dept: 'Seminar Hall, MMED' },
  { id: 'Production', name: 'Production', group: 'Group H', attendance: 'L-31', dept: 'L-17' },
];

const LEGACY_FACTS = [
  { id: '1', title: 'Established 1921', desc: 'Over a century of excellence. Founded in Lahore, PEC moved to Chandigarh in 1953.', icon: 'business', color: '#3B82F6' },
  { id: '2', title: 'Kalpana Chawla', desc: 'The first woman of Indian origin in space graduated from PEC in Aeron Engg (1982).', icon: 'star', color: '#8B5CF6' },
  { id: '3', title: 'Leaders & Innovators', desc: 'Home to former PM Dr. Manmohan Singh and Vinod Khosla (Co-founder of Sun Microsystems).', icon: 'people', color: '#10B981' },
];

export default function OrientationDashboard() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colors, isDark } = useTheme();
  const { fresher } = useFresherStore();
  const [selectedBranch, setSelectedBranch] = useState(BRANCHES[0]);
  const [isMapVisible, setIsMapVisible] = useState(false);

  const { data: stats } = useQuery({
    queryKey: ['fresherStats'],
    queryFn: async () => {
      const res = await api.get('/freshers/stats');
      return res.data;
    }
  });

  const handleLinktree = () => {
    Linking.openURL('https://linktr.ee/Orientation2026PEC');
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Pressable
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="chevron-back" color={colors.label} size={24} />
        </Pressable>
        <Text style={styles.headerTitle}>Fresher Dashboard</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        <Animated.View entering={FadeInDown.delay(100).springify()} style={styles.heroCard}>
          <Text style={styles.heroSub}>PUNJAB ENGINEERING COLLEGE</Text>
          <Text style={styles.heroTitle}>Hello, {fresher?.name?.split(' ')[0] || 'Fresher'}!</Text>
          <Text style={styles.heroDesc}>Welcome to your new home.</Text>

          {stats && (
            <View style={styles.statsBadge}>
              <Ionicons name="people" color="#FFFFFF" size={14} />
              <Text style={styles.statsText}>{stats.total} freshers joined PECverse</Text>
            </View>
          )}
        </Animated.View>

        <Animated.Text entering={FadeIn.delay(200)} style={styles.sectionTitle}>The PEC Legacy</Animated.Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.legacyScroll}
          contentContainerStyle={{ paddingHorizontal: 16 }}
        >
          {LEGACY_FACTS.map((fact) => (
            <Pressable
              key={fact.id}
              style={styles.legacyCard}
              onPress={() => Haptics.selectionAsync()}
            >
              <View style={[styles.legacyIconContainer, { backgroundColor: fact.color + '20' }]}>
                <Ionicons name={fact.icon as any} color={fact.color} size={24} />
              </View>
              <Text style={styles.legacyTitle}>{fact.title}</Text>
              <Text style={styles.legacyDesc}>{fact.desc}</Text>
            </Pressable>
          ))}
        </ScrollView>

        <Animated.Text entering={FadeIn.delay(300)} style={styles.sectionTitle}>Find Your Venues</Animated.Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.branchScroll} contentContainerStyle={{ paddingHorizontal: 16 }}>
          {BRANCHES.map(branch => {
            const isSelected = selectedBranch.id === branch.id;
            return (
              <Pressable
                key={branch.id}
                style={[styles.branchPill, isSelected && styles.branchPillSelected]}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setSelectedBranch(branch);
                }}
              >
                <Text style={[styles.branchText, isSelected && styles.branchTextSelected]}>
                  {branch.id}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        <Animated.View entering={FadeInDown.delay(400).springify()} style={styles.venueCard}>
          <View style={styles.venueRow}>
            <Ionicons name="people" color={colors.accent} size={20} />
            <View>
              <Text style={styles.venueLabel}>Your Group</Text>
              <Text style={styles.venueValue}>{selectedBranch.group}</Text>
            </View>
          </View>
          <View style={styles.venueDivider} />
          <View style={styles.venueRow}>
            <Ionicons name="business" color={colors.accent} size={20} />
            <View>
              <Text style={styles.venueLabel}>8:30 AM Attendance Venue</Text>
              <Text style={styles.venueValue}>{selectedBranch.attendance}</Text>
            </View>
          </View>
          <View style={styles.venueDivider} />
          <View style={styles.venueRow}>
            <Ionicons name="map" color={colors.accent} size={20} />
            <View>
              <Text style={styles.venueLabel}>2:00 PM Dept. Visit Venue</Text>
              <Text style={styles.venueValue}>{selectedBranch.dept}</Text>
            </View>
          </View>
        </Animated.View>

        <Animated.Text entering={FadeIn.delay(650)} style={styles.sectionTitle}>Campus Map</Animated.Text>
        <AnimatedPressable
          entering={FadeInDown.delay(700).springify()}
          style={styles.mapContainer}
          onPress={() => setIsMapVisible(true)}
        >
          <Image
            source={require('@/assets/images/pec-map.jpg')}
            style={styles.mapImage}
            contentFit="cover"
            transition={500}
          />
          <View style={styles.mapOverlay}>
            <Ionicons name="search" color="#FFFFFF" size={24} />
            <Text style={styles.mapOverlayText}>Tap to View Full Map</Text>
          </View>
        </AnimatedPressable>

        <AnimatedPressable entering={FadeInDown.delay(750).springify()} style={styles.linkButton} onPress={handleLinktree}>
          <Ionicons name="link" color="#FFFFFF" size={20} />
          <Text style={styles.linkButtonText}>View Official Linktree Resources</Text>
        </AnimatedPressable>
      </ScrollView>

      <Modal visible={isMapVisible} transparent={false} animationType="slide" onRequestClose={() => setIsMapVisible(false)}>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <SafeAreaView style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Pressable
                style={styles.closeButton}
                onPress={() => setIsMapVisible(false)}
              >
                <Ionicons name="close-circle" color={colors.secondaryLabel} size={28} />
              </Pressable>
              <Text style={styles.modalTitle}>Campus Map</Text>
              <View style={{ width: 28 }} />
            </View>
            <View style={styles.zoomableMapContent}>
              <ZoomableImage source={require('@/assets/images/pec-map.jpg')} />
            </View>
          </SafeAreaView>
        </GestureHandlerRootView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.systemBackground as string,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.label,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  heroCard: {
    margin: 16,
    padding: 24,
    borderRadius: 20,
    backgroundColor: colors.accent,
  },
  heroSub: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: 8,
  },
  heroTitle: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '800',
    lineHeight: 34,
    marginBottom: 8,
  },
  heroDesc: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 15,
    fontWeight: '500',
  },
  statsBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 100,
    alignSelf: 'flex-start',
    marginTop: 16,
    gap: 6,
  },
  statsText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.label,
    marginLeft: 16,
    marginTop: 24,
    marginBottom: 12,
  },
  legacyScroll: {
    marginBottom: 8,
  },
  legacyCard: {
    width: 280,
    backgroundColor: colors.cardBackgroundElevated,
    borderRadius: 20,
    padding: 20,
    marginRight: 16,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  legacyIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  legacyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.label,
    marginBottom: 8,
  },
  legacyDesc: {
    fontSize: 14,
    color: colors.secondaryLabel,
    lineHeight: 20,
  },
  branchScroll: {
    marginBottom: 16,
  },
  branchPill: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 100,
    backgroundColor: colors.cardBackground,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    marginRight: 8,
  },
  branchPillSelected: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  branchText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.secondaryLabel,
  },
  branchTextSelected: {
    color: '#FFFFFF',
  },
  venueCard: {
    marginHorizontal: 16,
    backgroundColor: colors.cardBackground,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  venueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    paddingVertical: 8,
  },
  venueDivider: {
    height: 1,
    backgroundColor: colors.cardBorder,
    marginVertical: 4,
    marginLeft: 36,
  },
  venueLabel: {
    fontSize: 13,
    color: colors.secondaryLabel,
    marginBottom: 2,
  },
  venueValue: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.label,
  },
  mapContainer: {
    marginHorizontal: 16,
    borderRadius: 16,
    overflow: 'hidden',
    height: 250,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    backgroundColor: colors.cardBackground,
  },
  mapImage: {
    width: '100%',
    height: '100%',
  },
  mapOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapOverlayText: {
    color: '#FFFFFF',
    fontWeight: '600',
    marginTop: 8,
    fontSize: 15,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#000000',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  closeButton: {
    padding: 4,
  },
  modalTitle: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '600',
  },
  zoomableMapContent: {
    flex: 1,
    backgroundColor: '#000000',
    overflow: 'hidden',
  },
  linkButton: {
    margin: 16,
    marginTop: 32,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1E1E24',
    padding: 16,
    borderRadius: 16,
    gap: 8,
  },
  linkButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
