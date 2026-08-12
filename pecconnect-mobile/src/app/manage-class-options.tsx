import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/utils/api';
import { colors } from '@/theme/colors';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import Animated, { FadeIn, FadeOut, SlideInDown, SlideOutDown } from 'react-native-reanimated';
import { SymbolView } from 'expo-symbols';

export default function ManageClassOptionsModal() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const queryClient = useQueryClient();
  
  const baseId = parseInt(params.timetableId as string);
  const subject = params.subject as string;
  const selectedDate = params.date as string;

  const [view, setView] = useState<'main' | 'today' | 'permanent'>('main');

  const exceptionMutation = useMutation({
    mutationFn: async (data: any) => {
      return await api.post('/timetables/exceptions', data);
    },
    onSuccess: () => {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      queryClient.invalidateQueries({ queryKey: ['timetables'] });
      router.back();
    },
    onError: (err: any) => {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert('Error', err.response?.data?.message || 'Failed to update exception');
    }
  });

  const deleteTimetableMutation = useMutation({
    mutationFn: async (id: number) => {
      return await api.delete(`/timetables/${id}`);
    },
    onSuccess: () => {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      queryClient.invalidateQueries({ queryKey: ['timetables'] });
      router.back();
    },
    onError: (err: any) => {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert('Error', err.response?.data?.message || 'Failed to delete class permanently');
    }
  });

  const navigateToEdit = (mode: string) => {
    router.replace({
      pathname: '/edit-timetable-class' as any,
      params: { 
        mode, 
        timetableId: baseId, 
        date: selectedDate, 
        subject: subject,
        start_time: params.start_time, 
        end_time: params.end_time, 
        room: params.room || ''
      }
    });
  };

  const renderMainOptions = () => (
    <Animated.View entering={SlideInDown} exiting={SlideOutDown} style={styles.sheetContent}>
      <View style={styles.sheetHeader}>
        <Text style={styles.sheetTitle}>Manage {subject}</Text>
        <Text style={styles.sheetSubtitle}>What would you like to do?</Text>
      </View>
      
      <View style={styles.optionsList}>
        <Pressable 
          style={styles.optionBtn} 
          onPress={() => { Haptics.selectionAsync(); setView('today'); }}
        >
          <View style={styles.optionIconBox}>
            <SymbolView name="calendar.badge.clock" tintColor={colors.accent} size={24} />
          </View>
          <View style={styles.optionTextGroup}>
            <Text style={styles.optionTitle}>Changes for THIS DATE ONLY</Text>
            <Text style={styles.optionDesc}>Cancel or reschedule this specific class</Text>
          </View>
          <SymbolView name="chevron.right" tintColor={colors.tertiaryLabel} size={20} />
        </Pressable>

        <Pressable 
          style={styles.optionBtn} 
          onPress={() => { Haptics.selectionAsync(); setView('permanent'); }}
        >
          <View style={[styles.optionIconBox, { backgroundColor: 'rgba(239, 68, 68, 0.1)' }]}>
            <SymbolView name="repeat" tintColor={colors.destructive} size={24} />
          </View>
          <View style={styles.optionTextGroup}>
            <Text style={styles.optionTitle}>PERMANENT Weekly Changes</Text>
            <Text style={styles.optionDesc}>Affects all future weeks for this class</Text>
          </View>
          <SymbolView name="chevron.right" tintColor={colors.tertiaryLabel} size={20} />
        </Pressable>
      </View>
    </Animated.View>
  );

  const renderTodayOptions = () => (
    <Animated.View entering={SlideInDown} exiting={SlideOutDown} style={styles.sheetContent}>
      <View style={styles.sheetHeader}>
        <Pressable onPress={() => setView('main')} style={styles.backBtn}>
          <SymbolView name="chevron.left" tintColor={colors.accent} size={24} />
        </Pressable>
        <View style={styles.centeredHeaderGroup}>
          <Text style={styles.sheetTitle}>For This Date Only</Text>
          <Text style={styles.sheetSubtitle}>Cancel or reschedule {subject}</Text>
        </View>
      </View>

      <View style={styles.optionsList}>
        <Pressable 
          style={styles.optionBtn} 
          onPress={() => navigateToEdit('reschedule')}
        >
          <View style={styles.optionIconBox}>
            <SymbolView name="clock.arrow.circlepath" tintColor={colors.accent} size={24} />
          </View>
          <View style={styles.optionTextGroup}>
            <Text style={styles.optionTitle}>Reschedule / Change Venue</Text>
            <Text style={styles.optionDesc}>Move this class to a new time or room</Text>
          </View>
        </Pressable>

        <Pressable 
          style={styles.optionBtn} 
          onPress={() => navigateToEdit('cancel')}
        >
          <View style={[styles.optionIconBox, { backgroundColor: 'rgba(239, 68, 68, 0.1)' }]}>
            <SymbolView name="xmark.circle.fill" tintColor={colors.destructive} size={24} />
          </View>
          <View style={styles.optionTextGroup}>
            <Text style={[styles.optionTitle, { color: colors.destructive }]}>Cancel Class (Today)</Text>
            <Text style={styles.optionDesc}>Cancel this specific class occurrence</Text>
          </View>
        </Pressable>
      </View>
    </Animated.View>
  );

  const renderPermanentOptions = () => (
    <Animated.View entering={SlideInDown} exiting={SlideOutDown} style={styles.sheetContent}>
      <View style={styles.sheetHeader}>
        <Pressable onPress={() => setView('main')} style={styles.backBtn}>
          <SymbolView name="chevron.left" tintColor={colors.accent} size={24} />
        </Pressable>
        <View style={styles.centeredHeaderGroup}>
          <Text style={styles.sheetTitle}>Permanent Changes</Text>
          <Text style={styles.sheetSubtitle}>Affects ALL future weeks</Text>
        </View>
      </View>

      <View style={styles.optionsList}>
        <Pressable 
          style={styles.optionBtn} 
          onPress={() => navigateToEdit('edit')}
        >
          <View style={styles.optionIconBox}>
            <SymbolView name="pencil.circle.fill" tintColor={colors.accent} size={24} />
          </View>
          <View style={styles.optionTextGroup}>
            <Text style={styles.optionTitle}>Edit Routine (Time/Venue)</Text>
            <Text style={styles.optionDesc}>Permanently change this class</Text>
          </View>
        </Pressable>

        <Pressable 
          style={styles.optionBtn} 
          onPress={() => {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
            Alert.alert(
              'Confirm Permanent Deletion',
              'This will remove this class from the schedule for the entire semester. Are you sure?',
              [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Delete', style: 'destructive', onPress: () => deleteTimetableMutation.mutate(baseId) }
              ]
            );
          }}
        >
          <View style={[styles.optionIconBox, { backgroundColor: 'rgba(239, 68, 68, 0.1)' }]}>
            <SymbolView name="trash.fill" tintColor={colors.destructive} size={24} />
          </View>
          <View style={styles.optionTextGroup}>
            <Text style={[styles.optionTitle, { color: colors.destructive }]}>Delete Permanently</Text>
            <Text style={styles.optionDesc}>Remove completely from timetable</Text>
          </View>
        </Pressable>
      </View>
    </Animated.View>
  );

  return (
    <View style={styles.container}>
      <Pressable style={styles.backdrop} onPress={() => router.back()}>
        <Animated.View entering={FadeIn.duration(200)} exiting={FadeOut.duration(200)} style={StyleSheet.absoluteFill}>
          <BlurView intensity={30} tint="dark" style={StyleSheet.absoluteFill} />
        </Animated.View>
      </Pressable>
      
      <View style={styles.sheetWrapper}>
        <View style={styles.grabber} />
        {view === 'main' && renderMainOptions()}
        {view === 'today' && renderTodayOptions()}
        {view === 'permanent' && renderPermanentOptions()}
        
        <Pressable 
          style={styles.cancelBtn} 
          onPress={() => {
            Haptics.selectionAsync();
            router.back();
          }}
        >
          <Text style={styles.cancelBtnText}>Cancel</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  sheetWrapper: {
    backgroundColor: colors.cardBackground,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 20,
  },
  grabber: {
    width: 40,
    height: 5,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 3,
    alignSelf: 'center',
    marginBottom: 20,
  },
  sheetContent: {
    gap: 24,
    marginBottom: 24,
  },
  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backBtn: {
    padding: 8,
    marginRight: 16,
    marginLeft: -8,
  },
  centeredHeaderGroup: {
    flex: 1,
  },
  sheetTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.label,
    letterSpacing: -0.5,
  },
  sheetSubtitle: {
    fontSize: 14,
    color: colors.secondaryLabel,
    marginTop: 2,
  },
  optionsList: {
    gap: 16,
  },
  optionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.03)',
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  optionIconBox: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  optionTextGroup: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.label,
    marginBottom: 2,
  },
  optionDesc: {
    fontSize: 13,
    color: colors.secondaryLabel,
  },
  cancelBtn: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
  },
  cancelBtnText: {
    color: colors.label,
    fontSize: 17,
    fontWeight: '700',
  }
});
