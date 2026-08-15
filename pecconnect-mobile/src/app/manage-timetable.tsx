import { View, Text, StyleSheet, TextInput, ScrollView, Pressable, ActivityIndicator, Alert, Platform } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/utils/api';
import { colors } from '@/theme/colors';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';

type ClassType = 'weekly' | 'single' | 'holiday';

const DAYS = [
  { id: 1, label: 'Mon' },
  { id: 2, label: 'Tue' },
  { id: 3, label: 'Wed' },
  { id: 4, label: 'Thu' },
  { id: 5, label: 'Fri' },
  { id: 6, label: 'Sat' },
  { id: 7, label: 'Sun' },
];

export default function ManageTimetableModal() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [classType, setClassType] = useState<ClassType>('weekly');

  // Shared Form States
  const [subject, setSubject] = useState('');
  const [room, setRoom] = useState('');
  const [teacher, setTeacher] = useState('');
  const [periodNo, setPeriodNo] = useState('1');
  
  // Weekly Specific
  const [dayOfWeek, setDayOfWeek] = useState<number>(1);
  
  // Single Specific
  const [targetDate, setTargetDate] = useState(new Date());
  
  // Time States
  const [startTime, setStartTime] = useState(new Date(new Date().setHours(9, 0, 0, 0)));
  const [endTime, setEndTime] = useState(new Date(new Date().setHours(10, 0, 0, 0)));

  // Picker Visibility (Android)
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);

  const addMutation = useMutation({
    mutationFn: async (data: any) => {
      return await api.post('/timetables', data);
    },
    onSuccess: () => {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      queryClient.invalidateQueries({ queryKey: ['timetables'] });
      router.back();
    },
    onError: (err: any) => {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert('Error', err.response?.data?.message || 'Failed to add class');
    }
  });

  const holidayMutation = useMutation({
    mutationFn: async (data: any) => {
      return await api.post('/timetables/holiday', data);
    },
    onSuccess: () => {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      queryClient.invalidateQueries({ queryKey: ['timetables'] });
      router.back();
    },
    onError: (err: any) => {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert('Error', err.response?.data?.message || 'Failed to declare holiday');
    }
  });

  const formatTime = (d: Date) => {
    return d.toTimeString().substring(0, 5); // "HH:MM"
  };

  const formatDate = (d: Date) => {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const handleSubmit = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    if (classType === 'holiday') {
      holidayMutation.mutate({
        date: formatDate(targetDate),
        reason: subject.trim() || null, // re-using subject state for reason
      });
      return;
    }

    if (!subject.trim()) {
      Alert.alert('Validation Error', 'Subject is required');
      return;
    }

    if (classType === 'weekly') {
      addMutation.mutate({
        type: 'weekly',
        day_of_week: dayOfWeek,
        period_no: parseInt(periodNo) || 1,
        start_time: formatTime(startTime),
        end_time: formatTime(endTime),
        subject: subject.trim(),
        teacher: teacher.trim() || null,
        room: room.trim() || null,
      });
    } else {
      // Single Class (Extra)
      addMutation.mutate({
        type: 'single',
        date: formatDate(targetDate),
        period_no: parseInt(periodNo) || 1,
        start_time: formatTime(startTime),
        end_time: formatTime(endTime),
        subject: subject.trim(),
        teacher: teacher.trim() || null,
        room: room.trim() || null,
      });
    }
  };

  const isPending = addMutation.isPending || holidayMutation.isPending;

  return (
    <BlurView intensity={100} tint="systemChromeMaterialDark" style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.closeButton}>
          <Text style={styles.closeText}>Cancel</Text>
        </Pressable>
        <Text style={styles.headerTitle}>Add Class</Text>
        <Pressable onPress={handleSubmit} disabled={isPending} style={styles.submitButton}>
          {isPending ? (
            <ActivityIndicator size="small" color={colors.accent as string} />
          ) : (
            <Text style={styles.submitText}>Save</Text>
          )}
        </Pressable>
      </View>

      <View style={styles.segmentContainer}>
        <Pressable
          onPress={() => {
            Haptics.selectionAsync();
            setClassType('weekly');
          }}
          style={[styles.segment, classType === 'weekly' && styles.segmentActive]}
        >
          <Text style={[styles.segmentText, classType === 'weekly' && styles.segmentTextActive]}>
            Weekly Class
          </Text>
        </Pressable>
        <Pressable
          onPress={() => {
            Haptics.selectionAsync();
            setClassType('single');
          }}
          style={[styles.segment, classType === 'single' && styles.segmentActive]}
        >
          <Text style={[styles.segmentText, classType === 'single' && styles.segmentTextActive]}>
            Single Class
          </Text>
        </Pressable>
        <Pressable
          onPress={() => {
            Haptics.selectionAsync();
            setClassType('holiday');
          }}
          style={[styles.segment, classType === 'holiday' && styles.segmentActive]}
        >
          <Text style={[styles.segmentText, classType === 'holiday' && styles.segmentTextActive]}>
            Holiday
          </Text>
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.formContainer} keyboardShouldPersistTaps="handled">
        
        {/* Date / Day Selection */}
        {classType === 'weekly' ? (
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Day of Week</Text>
            <View style={styles.daysRow}>
              {DAYS.map(day => (
                <Pressable
                  key={day.id}
                  onPress={() => setDayOfWeek(day.id)}
                  style={[styles.dayChip, dayOfWeek === day.id && styles.dayChipActive]}
                >
                  <Text style={[styles.dayChipText, dayOfWeek === day.id && { color: '#fff' }]}>
                    {day.label}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>
        ) : (
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Date</Text>
            <Pressable 
              style={styles.timePickerButton} 
              onPress={() => setShowDatePicker(true)}
            >
              <Text style={styles.timePickerButtonText}>
                {targetDate.toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}
              </Text>
            </Pressable>
            {(showDatePicker || Platform.OS === 'ios') && (
              <DateTimePicker
                value={targetDate}
                mode="date"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={(event, selectedDate) => {
                  if (Platform.OS === 'android') setShowDatePicker(false);
                  if (selectedDate) setTargetDate(selectedDate);
                }}
              />
            )}
          </View>
        )}

        {/* Time Selection */}
        {classType !== 'holiday' && (
          <>
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

            <View style={styles.row}>
              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={styles.label}>Period No. (Optional)</Text>
                <TextInput 
                  style={styles.input} 
                  value={periodNo} 
                  onChangeText={setPeriodNo} 
                  keyboardType="number-pad" 
                  placeholder="1"
                  placeholderTextColor={colors.secondaryLabel as string} 
                />
              </View>
            </View>
          </>
        )}

        <View style={styles.inputGroup}>
          <Text style={styles.label}>{classType === 'holiday' ? 'Reason (Optional)' : 'Subject *'}</Text>
          <TextInput 
            style={styles.input} 
            value={subject} 
            onChangeText={setSubject} 
            placeholder={classType === 'holiday' ? "e.g. Heavy Rain" : "e.g. Data Structures"} 
            placeholderTextColor={colors.secondaryLabel as string} 
          />
        </View>
        
        {classType !== 'holiday' && (
          <>
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

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Teacher (Optional)</Text>
              <TextInput 
                style={styles.input} 
                value={teacher} 
                onChangeText={setTeacher} 
                placeholder="e.g. Dr. Smith" 
                placeholderTextColor={colors.secondaryLabel as string} 
              />
            </View>
          </>
        )}

        <View style={{ height: 100 }} />
      </ScrollView>
    </BlurView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    paddingTop: 60,
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  closeButton: {
    padding: 8,
    marginLeft: -8,
  },
  closeText: {
    color: colors.secondaryLabel as string,
    fontSize: 17,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.label as string,
  },
  submitButton: {
    padding: 8,
    marginRight: -8,
  },
  submitText: {
    color: colors.accent as string,
    fontSize: 17,
    fontWeight: '700',
  },
  segmentContainer: {
    flexDirection: 'row',
    padding: 20,
    gap: 8,
  },
  segment: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 8,
  },
  segmentActive: {
    backgroundColor: colors.accent as string,
  },
  segmentText: {
    color: colors.secondaryLabel as string,
    fontWeight: '600',
    fontSize: 15,
  },
  segmentTextActive: {
    color: '#fff',
  },
  formContainer: {
    padding: 20,
    gap: 20,
  },
  inputGroup: {
    gap: 8,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  label: {
    color: colors.secondaryLabel as string,
    fontSize: 14,
    fontWeight: '500',
  },
  input: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12,
    padding: 16,
    color: colors.label as string,
    fontSize: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  daysRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  dayChip: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  dayChipActive: {
    backgroundColor: colors.accent as string,
    borderColor: colors.accent as string,
  },
  dayChipText: {
    color: colors.secondaryLabel as string,
    fontWeight: '600',
  },
  timePickerButton: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
  },
  timePickerButtonText: {
    color: colors.label as string,
    fontSize: 16,
    fontWeight: '600',
  }
});
