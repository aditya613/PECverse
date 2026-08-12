import { View, Text, StyleSheet, TextInput, ScrollView, Pressable, ActivityIndicator, Alert, Platform } from 'react-native';
import { useState, useEffect } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/utils/api';
import { colors } from '@/theme/colors';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import DateTimePicker from '@react-native-community/datetimepicker';
import { SymbolView } from 'expo-symbols';

export default function EditTimetableClassModal() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const params = useLocalSearchParams();
  
  const mode = params.mode as 'reschedule' | 'edit' | 'cancel';
  const timetableId = params.timetableId as string;
  const originalSubject = params.subject as string;
  const originalRoom = params.room as string || '';
  const targetDateStr = params.date as string; // '2026-08-12'

  // Form States
  const [room, setRoom] = useState(originalRoom);
  const [reason, setReason] = useState('');
  
  // Time States (Parse from params if provided, else use current time)
  const parseTime = (timeStr?: string) => {
    const d = new Date();
    if (timeStr) {
      const [h, m] = timeStr.split(':');
      d.setHours(parseInt(h, 10), parseInt(m, 10), 0, 0);
    }
    return d;
  };

  const [startTime, setStartTime] = useState(parseTime(params.start_time as string));
  const [endTime, setEndTime] = useState(parseTime(params.end_time as string));

  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);

  const mutation = useMutation({
    mutationFn: async (data: any) => {
      if (mode === 'edit') {
        // Permanent edit
        return await api.put(`/timetables/${timetableId}`, data);
      } else {
        // Reschedule or Cancel exception
        return await api.post('/timetables/exceptions', data);
      }
    },
    onSuccess: () => {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      queryClient.invalidateQueries({ queryKey: ['timetables'] });
      router.back();
    },
    onError: (err: any) => {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert('Error', err.response?.data?.message || 'Action failed');
    }
  });

  const formatTime = (d: Date) => {
    return d.toTimeString().substring(0, 5); // "HH:MM"
  };

  const handleSubmit = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    if (mode === 'cancel') {
      mutation.mutate({
        timetable_id: timetableId,
        date: targetDateStr,
        type: 'cancelled',
        reason: reason.trim() || null,
      });
    } else if (mode === 'reschedule') {
      mutation.mutate({
        timetable_id: timetableId,
        date: targetDateStr,
        type: 'rescheduled',
        start_time: formatTime(startTime),
        end_time: formatTime(endTime),
        room: room.trim() || null,
        reason: reason.trim() || null,
      });
    } else if (mode === 'edit') {
      mutation.mutate({
        start_time: formatTime(startTime),
        end_time: formatTime(endTime),
        room: room.trim() || null,
        subject: originalSubject, // Pass original since we don't edit it here, but API requires it
      });
    }
  };

  const isPending = mutation.isPending;

  const titleMap = {
    cancel: 'Cancel Class',
    reschedule: 'Reschedule Class',
    edit: 'Edit Routine',
  };

  return (
    <BlurView intensity={100} tint="systemChromeMaterialDark" style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.closeButton}>
          <Text style={styles.closeText}>Back</Text>
        </Pressable>
        <Text style={styles.headerTitle}>{titleMap[mode] || 'Manage Class'}</Text>
        <Pressable onPress={handleSubmit} disabled={isPending} style={styles.submitButton}>
          {isPending ? (
            <ActivityIndicator size="small" color={mode === 'cancel' ? colors.destructive : colors.accent} />
          ) : (
            <Text style={[styles.submitText, mode === 'cancel' && { color: colors.destructive }]}>
              {mode === 'cancel' ? 'Confirm' : 'Save'}
            </Text>
          )}
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.formContainer} keyboardShouldPersistTaps="handled">
        <View style={styles.infoBox}>
          <Text style={styles.infoSubject}>{originalSubject}</Text>
          {targetDateStr && mode !== 'edit' && (
            <Text style={styles.infoDate}>
              For {new Date(targetDateStr).toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}
            </Text>
          )}
        </View>

        {mode !== 'cancel' && (
          <>
            {/* Time Selection */}
            <View style={styles.row}>
              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={styles.label}>Start Time</Text>
                <Pressable 
                  style={styles.timePickerButton} 
                  onPress={() => setShowStartTimePicker(true)}
                >
                  <Text style={styles.timePickerButtonText}>
                    {startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </Text>
                </Pressable>
                {(showStartTimePicker || Platform.OS === 'ios') && (
                  <DateTimePicker
                    value={startTime}
                    mode="time"
                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                    onChange={(event, selectedDate) => {
                      if (Platform.OS === 'android') setShowStartTimePicker(false);
                      if (selectedDate) setStartTime(selectedDate);
                    }}
                  />
                )}
              </View>
              
              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={styles.label}>End Time</Text>
                <Pressable 
                  style={styles.timePickerButton} 
                  onPress={() => setShowEndTimePicker(true)}
                >
                  <Text style={styles.timePickerButtonText}>
                    {endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </Text>
                </Pressable>
                {(showEndTimePicker || Platform.OS === 'ios') && (
                  <DateTimePicker
                    value={endTime}
                    mode="time"
                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                    onChange={(event, selectedDate) => {
                      if (Platform.OS === 'android') setShowEndTimePicker(false);
                      if (selectedDate) setEndTime(selectedDate);
                    }}
                  />
                )}
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Room (Optional)</Text>
              <TextInput 
                style={styles.input} 
                value={room} 
                onChangeText={setRoom} 
                placeholder="e.g. L1" 
                placeholderTextColor={colors.secondaryLabel as string} 
              />
            </View>
          </>
        )}

        {(mode === 'cancel' || mode === 'reschedule') && (
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Reason / Note to Students (Optional)</Text>
            <TextInput 
              style={[styles.input, { height: 80, paddingTop: 16 }]} 
              value={reason} 
              onChangeText={setReason} 
              placeholder={mode === 'cancel' ? "e.g. Teacher is on leave" : "e.g. Shifted due to practical"} 
              placeholderTextColor={colors.secondaryLabel as string} 
              multiline
            />
          </View>
        )}

        {mode === 'cancel' && (
          <View style={styles.warningBox}>
            <SymbolView name="exclamationmark.triangle.fill" tintColor={colors.destructive} size={24} />
            <Text style={styles.warningText}>
              This will cancel the class for this specific date only. Students will be notified instantly.
            </Text>
          </View>
        )}
        
        {mode === 'edit' && (
          <View style={[styles.warningBox, { backgroundColor: 'rgba(59, 130, 246, 0.1)' }]}>
            <SymbolView name="info.circle.fill" tintColor={colors.accent} size={24} />
            <Text style={[styles.warningText, { color: colors.accent as string }]}>
              This will permanently update the weekly routine for this class.
            </Text>
          </View>
        )}

        <View style={{ height: 100 }} />
      </ScrollView>
    </BlurView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    paddingTop: 60,
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  closeButton: { padding: 8, marginLeft: -8 },
  closeText: { color: colors.secondaryLabel as string, fontSize: 17 },
  headerTitle: { fontSize: 17, fontWeight: '700', color: colors.label as string },
  submitButton: { padding: 8, marginRight: -8 },
  submitText: { color: colors.accent as string, fontSize: 17, fontWeight: '700' },
  formContainer: { padding: 20, gap: 24 },
  infoBox: {
    padding: 16,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
  },
  infoSubject: { fontSize: 18, fontWeight: '700', color: colors.label as string, textAlign: 'center' },
  infoDate: { fontSize: 14, color: colors.secondaryLabel as string, marginTop: 4 },
  inputGroup: { gap: 8 },
  row: { flexDirection: 'row', gap: 12 },
  label: { color: colors.secondaryLabel as string, fontSize: 14, fontWeight: '500' },
  input: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12,
    padding: 16,
    color: colors.label as string,
    fontSize: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  timePickerButton: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
  },
  timePickerButtonText: { color: colors.label as string, fontSize: 16, fontWeight: '600' },
  warningBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    padding: 16,
    borderRadius: 12,
    gap: 12,
  },
  warningText: { flex: 1, color: colors.destructive as string, fontSize: 14, fontWeight: '500', lineHeight: 20 }
});
