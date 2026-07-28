import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, ActivityIndicator, Modal } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { colors } from '@/theme/colors';
import { useMessStore } from '@/stores/useMessStore';
import { useMesses, useMessMenu } from '@/hooks/useMess';
import { AnimatedPressable } from '@/components/ui/AnimatedPressable';
import { GlassCard } from '@/components/ui/GlassCard';

const DAYS = [
  { id: 1, label: 'Mon' },
  { id: 2, label: 'Tue' },
  { id: 3, label: 'Wed' },
  { id: 4, label: 'Thu' },
  { id: 5, label: 'Fri' },
  { id: 6, label: 'Sat' },
  { id: 7, label: 'Sun' },
];

export default function MessScreen() {
  const router = useRouter();
  
  const { selectedMessId, setSelectedMessId, loadMessId } = useMessStore();
  const { data: messes, isLoading: isLoadingMesses } = useMesses();
  const { data: menu, isLoading: isLoadingMenu } = useMessMenu(selectedMessId);

  const [isMessModalVisible, setMessModalVisible] = useState(false);
  
  const todayJs = new Date().getDay();
  const todayBackend = todayJs === 0 ? 7 : todayJs;
  const [selectedDay, setSelectedDay] = useState(todayBackend);

  useEffect(() => {
    loadMessId();
  }, []);

  const handleSelectMess = async (id: number) => {
    await setSelectedMessId(id);
    setMessModalVisible(false);
  };

  const selectedMessName = messes?.find(m => m.id === selectedMessId)?.name || 'Shivalik Hostel';

  const dayMenu = useMemo(() => {
    if (!menu) return null;
    return menu.find(m => m.day_of_week === selectedDay);
  }, [menu, selectedDay]);

  return (
    <View style={styles.container}>
      {/* Navigation Stack Configuration */}
      <Stack.Screen 
        options={{
          headerShown: true,
          headerTitle: 'Mess Menu',
          headerStyle: { backgroundColor: colors.systemBackground },
          headerTintColor: colors.label,
          headerShadowVisible: false,
        }} 
      />

      <ScrollView 
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Hostel Picker Dropdown Capsule */}
        <AnimatedPressable onPress={() => setMessModalVisible(true)} scaleTo={0.97}>
          <GlassCard style={styles.hostelPickerCard}>
            <Text style={styles.hostelNameText}>{selectedMessName}</Text>
            <Text style={styles.dropdownChevron}>∨</Text>
          </GlassCard>
        </AnimatedPressable>

        {/* Day Selector Pill Bar */}
        <View style={styles.dayRibbonRow}>
          {DAYS.map((d) => {
            const isSelected = selectedDay === d.id;
            return (
              <AnimatedPressable 
                key={d.id} 
                onPress={() => setSelectedDay(d.id)}
                scaleTo={0.92}
              >
                <View style={[styles.dayPill, isSelected && styles.dayPillActive]}>
                  <Text style={[styles.dayPillText, isSelected && styles.dayPillTextActive]}>
                    {d.label}
                  </Text>
                </View>
              </AnimatedPressable>
            );
          })}
        </View>

        {/* Menu View or Empty State Artwork */}
        <View style={styles.menuBodyContainer}>
          {isLoadingMenu ? (
            <ActivityIndicator size="large" color={colors.accent} style={{ marginTop: 60 }} />
          ) : dayMenu ? (
            <GlassCard style={styles.menuDetailCard}>
              <Text style={styles.menuItemsContent}>{dayMenu.items}</Text>
            </GlassCard>
          ) : (
            /* Sculpted 3D Chef Hat Empty State Artwork */
            <View style={styles.emptyStateWrapper}>
              <View style={styles.chefHatContainer}>
                <Text style={styles.chefHatEmoji}>👨‍🍳</Text>
              </View>
              <Text style={styles.emptyStateTitle}>No menu uploaded for this day.</Text>
              <Text style={styles.emptyStateSubtitle}>
                Menu will be available once uploaded by mess.
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Hostel Selection Modal Sheet */}
      <Modal
        visible={isMessModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setMessModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.bottomSheet}>
            <Text style={styles.sheetTitle}>Select Hostel Mess</Text>
            <View style={styles.optionsList}>
              {messes?.map((mess) => (
                <Pressable 
                  key={mess.id}
                  style={styles.optionRow}
                  onPress={() => handleSelectMess(mess.id)}
                >
                  <Text style={[
                    styles.optionText, 
                    selectedMessId === mess.id && { color: colors.accent, fontWeight: '700' }
                  ]}>
                    {mess.name}
                  </Text>
                  {selectedMessId === mess.id && <Text style={styles.checkmark}>✓</Text>}
                </Pressable>
              ))}
            </View>
            <Pressable style={styles.cancelBtn} onPress={() => setMessModalVisible(false)}>
              <Text style={styles.cancelBtnText}>Done</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.systemBackground,
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 40,
    gap: 18,
  },
  hostelPickerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 18,
  },
  hostelNameText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.label,
  },
  dropdownChevron: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.secondaryLabel,
  },
  dayRibbonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 6,
  },
  dayPill: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayPillActive: {
    backgroundColor: colors.accent,
  },
  dayPillText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.secondaryLabel,
  },
  dayPillTextActive: {
    color: '#FFF',
    fontWeight: '700',
  },
  menuBodyContainer: {
    marginTop: 20,
  },
  menuDetailCard: {
    padding: 20,
  },
  menuItemsContent: {
    fontSize: 16,
    color: colors.label,
    lineHeight: 26,
  },
  emptyStateWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    gap: 12,
  },
  chefHatContainer: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: colors.cardBackground,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.accent,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 4,
    marginBottom: 8,
  },
  chefHatEmoji: {
    fontSize: 44,
  },
  emptyStateTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.label,
    textAlign: 'center',
  },
  emptyStateSubtitle: {
    fontSize: 13,
    color: colors.secondaryLabel,
    textAlign: 'center',
    maxWidth: 240,
    lineHeight: 18,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  bottomSheet: {
    backgroundColor: colors.cardBackground,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 40,
    gap: 16,
    borderTopWidth: 1,
    borderTopColor: colors.cardBorder,
  },
  sheetTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.label,
    textAlign: 'center',
  },
  optionsList: {
    gap: 10,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: colors.cardBackgroundElevated,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  optionText: {
    fontSize: 15,
    color: colors.label,
  },
  checkmark: {
    fontSize: 16,
    color: colors.accent,
    fontWeight: '800',
  },
  cancelBtn: {
    backgroundColor: colors.accent,
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  cancelBtnText: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 16,
  },
});
