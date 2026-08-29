import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Platform, TextInput, ActivityIndicator, Modal, Alert, KeyboardAvoidingView } from 'react-native';
import { useAttendance, AttendanceSubject } from '@/hooks/useAttendance';
import { colors } from '@/theme/colors';
import { useRouter, Stack } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { AnimatedPressable } from '@/components/ui/AnimatedPressable';
import { GlassCard } from '@/components/ui/GlassCard';
import { RadialProgressGauge } from '@/components/ui/RadialProgressGauge';
import { trackScreen, trackEvent } from '@/utils/analytics';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function AttendanceScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { subjects, isLoading, addSubject, updateLog, deleteLog, deleteSubject, resetSubjectStats } = useAttendance();
  const [newSubjectName, setNewSubjectName] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [selectedSubjectId, setSelectedSubjectId] = useState<number | null>(null);
  const selectedSubject = subjects?.find(s => s.id === selectedSubjectId) || null;

  React.useEffect(() => {
    trackScreen('attendance');
  }, []);

  const handleAdd = () => {
    if (!newSubjectName.trim()) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    trackEvent('attendance_subject_add', { subject: newSubjectName.trim() });
    addSubject.mutate(newSubjectName.trim());
    setNewSubjectName('');
    setIsAdding(false);
  };

  // Calculate Overall Aggregate from real subjects array
  let totalAttended = 0;
  let totalClasses = 0;

  if (subjects && subjects.length > 0) {
    subjects.forEach(sub => {
      totalAttended += sub.attended_classes;
      totalClasses += (sub.attended_classes + sub.bunked_classes);
    });
  }

  const overallAggregate = totalClasses === 0 ? 0 : Math.round((totalAttended / totalClasses) * 100);
  const safeBunks = Math.max(0, Math.floor((totalAttended - 0.75 * totalClasses) / 0.75));
  const classesToAttend = Math.max(0, 3 * totalClasses - 4 * totalAttended);

  return (
    <View style={styles.container}>
      <Stack.Screen 
        options={{
          headerShown: true,
          headerTitle: 'Attendance Manager',
          headerStyle: { backgroundColor: colors.systemBackground },
          headerTintColor: colors.label,
          headerShadowVisible: false,
          headerRight: () => (
            <AnimatedPressable onPress={() => setIsAdding(true)} scaleTo={0.92}>
              <Text style={styles.addSubjectGhostBtn}>+ Add Subject</Text>
            </AnimatedPressable>
          ),
        }} 
      />

      <KeyboardAvoidingView 
        style={{ flex: 1 }} 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <ScrollView 
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
        >
          {/* Giant Circular Arc Gauge Header */}
          <GlassCard style={styles.gaugeHeaderCard}>
            <RadialProgressGauge 
              percentage={overallAggregate}
              size={160}
              strokeWidth={12}
              subtitle="Overall Aggregate"
              statusText={
                totalClasses === 0 
                  ? "Add subjects below to track your attendance." 
                  : overallAggregate >= 75 
                    ? `On track! You can safely miss ${safeBunks} class${safeBunks !== 1 ? 'es' : ''} overall.`
                    : `Action needed ⚠️ You must attend the next ${classesToAttend} class${classesToAttend !== 1 ? 'es' : ''} to reach 75%.`
              }
            />
          </GlassCard>

          {/* Add Subject Section Inline */}
          {isAdding && (
            <GlassCard style={styles.addCard}>
              <Text style={styles.addCardTitle}>Add New Subject</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. Computer Organization"
                placeholderTextColor={colors.tertiaryLabel}
                value={newSubjectName}
                onChangeText={setNewSubjectName}
                autoFocus
                returnKeyType="done"
                onSubmitEditing={handleAdd}
              />
              <View style={styles.addActions}>
                <Pressable style={styles.cancelBtn} onPress={() => setIsAdding(false)}>
                  <Text style={styles.cancelText}>Cancel</Text>
                </Pressable>
                <Pressable 
                  style={[styles.saveBtn, !newSubjectName.trim() && { opacity: 0.5 }]} 
                  onPress={handleAdd} 
                  disabled={!newSubjectName.trim()}
                >
                  <Text style={styles.saveText}>Save</Text>
                </Pressable>
              </View>
            </GlassCard>
          )}

          {/* Real Subject Cards List */}
          {isLoading ? (
            <ActivityIndicator size="large" color={colors.accent} style={{ marginTop: 40 }} />
          ) : !subjects || subjects.length === 0 ? (
            <GlassCard style={styles.emptyContainer}>
              <Text style={styles.emptyTitle}>No Subjects Tracked</Text>
              <Text style={styles.emptySubtitle}>Tap "+ Add Subject" to start tracking attendance for your classes.</Text>
              <AnimatedPressable onPress={() => setIsAdding(true)} scaleTo={0.94}>
                <View style={styles.emptyAddBtn}>
                  <Text style={styles.emptyAddBtnText}>Add Subject</Text>
                </View>
              </AnimatedPressable>
            </GlassCard>
          ) : (
            <View style={styles.subjectsList}>
              {subjects.map((sub) => {
                const subTotal = sub.attended_classes + sub.bunked_classes;
                const pct = subTotal === 0 ? 0 : Math.round((sub.attended_classes / subTotal) * 100);

                return (
                  <AnimatedPressable 
                    key={sub.id} 
                    onPress={() => {
                      Haptics.selectionAsync();
                      setSelectedSubjectId(sub.id);
                    }}
                    scaleTo={0.98}
                  >
                    <GlassCard style={styles.subjectCard}>
                      {/* Header Row: Name & Percentage */}
                      <View style={styles.subCardHeader}>
                        <Text style={styles.subNameText}>{sub.name}</Text>
                      <Text style={[
                        styles.subPctText,
                        { color: pct >= 75 ? colors.success : colors.destructive }
                      ]}>
                        {pct}%
                      </Text>
                    </View>

                    {/* Horizontal Progress Track Bar */}
                    <View style={styles.progressTrack}>
                      <View 
                        style={[
                          styles.progressFill, 
                          { 
                            width: `${Math.min(100, pct)}%`,
                            backgroundColor: pct >= 75 ? colors.accent : colors.destructive 
                          }
                        ]} 
                      />
                    </View>

                    {/* Counts Line */}
                    <View style={styles.countsRow}>
                      <Text style={styles.countText}>Attended: <Text style={styles.countVal}>{sub.attended_classes}</Text></Text>
                      <Text style={styles.countText}>Bunked: <Text style={styles.countVal}>{sub.bunked_classes}</Text></Text>
                      <Text style={styles.countText}>Total: <Text style={styles.countVal}>{subTotal}</Text></Text>
                    </View>

                    {/* Insightful Status Text */}
                    {subTotal > 0 && (
                      <Text style={[styles.insightText, { color: pct >= 75 ? colors.success : colors.destructive }]}>
                        {pct >= 75 
                          ? `On track. You can safely miss ${Math.max(0, Math.floor((sub.attended_classes - 0.75 * subTotal) / 0.75))} more class${Math.max(0, Math.floor((sub.attended_classes - 0.75 * subTotal) / 0.75)) !== 1 ? 'es' : ''}.`
                          : `At risk. You must attend the next ${Math.max(0, 3 * subTotal - 4 * sub.attended_classes)} class${Math.max(0, 3 * subTotal - 4 * sub.attended_classes) !== 1 ? 'es' : ''} to reach 75%.`
                        }
                      </Text>
                    )}

                    {/* Quick Interactive Steppers */}
                    <View style={styles.actionButtonsRow}>
                      <AnimatedPressable 
                        onPress={() => {
                          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                          updateLog.mutate({ id: sub.id, type: 'bunked' });
                        }}
                        scaleTo={0.96}
                        style={{ flex: 1 }}
                      >
                        <View style={styles.bunkBtn}>
                          <Text style={styles.bunkBtnText}>— Bunked</Text>
                        </View>
                      </AnimatedPressable>

                      <AnimatedPressable 
                        onPress={() => {
                          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                          updateLog.mutate({ id: sub.id, type: 'attended' });
                        }}
                        scaleTo={0.96}
                        style={{ flex: 1 }}
                      >
                        <View style={styles.attendBtn}>
                          <Text style={styles.attendBtnText}>+ Attended</Text>
                        </View>
                      </AnimatedPressable>
                    </View>
                  </GlassCard>
                </AnimatedPressable>
                );
              })}
            </View>
          )}

          <View style={{ height: Math.max(insets.bottom + 40, 60) }} />
        </ScrollView>
      </KeyboardAvoidingView>

      {/* History & Settings Bottom Sheet */}
      <Modal
        visible={!!selectedSubject}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setSelectedSubjectId(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.bottomSheet, { paddingBottom: Math.max(insets.bottom + 24, 36) }]}>
            <View style={styles.sheetHeader}>
              <Text style={styles.sheetTitle}>{selectedSubject?.name}</Text>
              <Text style={styles.sheetSubtitle}>Attendance Logs</Text>
            </View>

            <ScrollView style={styles.logsScroll} contentContainerStyle={styles.logsList}>
              {!selectedSubject?.logs || selectedSubject.logs.length === 0 ? (
                <Text style={styles.emptyLogText}>No classes recorded yet.</Text>
              ) : (
                selectedSubject.logs.map(log => (
                  <View key={log.id} style={styles.logRow}>
                    <View style={styles.logInfo}>
                      <Text style={[styles.logType, { color: log.type === 'attended' ? colors.success : colors.destructive }]}>
                        {log.type === 'attended' ? 'Attended' : 'Missed'}
                      </Text>
                      <Text style={styles.logDate}>
                        {new Date(log.created_at).toLocaleDateString(undefined, { 
                          weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                        })}
                      </Text>
                    </View>
                    <AnimatedPressable 
                      onPress={() => {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                        deleteLog.mutate(log.id);
                      }}
                      scaleTo={0.85}
                    >
                      <View style={styles.undoBtn}>
                        <Text style={styles.undoBtnText}>Undo</Text>
                      </View>
                    </AnimatedPressable>
                  </View>
                ))
              )}
            </ScrollView>

            <View style={styles.sheetActions}>
              <AnimatedPressable 
                onPress={() => {
                  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
                  Alert.alert(
                    'Reset Attendance',
                    `Are you sure you want to reset all attendance logs for ${selectedSubject?.name} to 0?`,
                    [
                      { text: 'Cancel', style: 'cancel' },
                      { 
                        text: 'Reset', 
                        style: 'destructive', 
                        onPress: () => {
                          if (selectedSubjectId) {
                            resetSubjectStats.mutate(selectedSubjectId);
                          }
                        }
                      }
                    ]
                  );
                }}
                scaleTo={0.96}
                style={{ flex: 1 }}
              >
                <View style={styles.resetSubjectBtn}>
                  <Text style={styles.resetSubjectText}>Reset Stats</Text>
                </View>
              </AnimatedPressable>

              <AnimatedPressable 
                onPress={() => {
                  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
                  Alert.alert(
                    'Delete Subject',
                    `Are you sure you want to permanently delete ${selectedSubject?.name} and all its logs?`,
                    [
                      { text: 'Cancel', style: 'cancel' },
                      { 
                        text: 'Delete', 
                        style: 'destructive', 
                        onPress: () => {
                          if (selectedSubjectId) {
                            deleteSubject.mutate(selectedSubjectId);
                            setSelectedSubjectId(null);
                          }
                        }
                      }
                    ]
                  );
                }}
                scaleTo={0.96}
                style={{ flex: 1 }}
              >
                <View style={styles.deleteSubjectBtn}>
                  <Text style={styles.deleteSubjectText}>Delete</Text>
                </View>
              </AnimatedPressable>

              <AnimatedPressable 
                onPress={() => setSelectedSubjectId(null)}
                scaleTo={0.96}
                style={{ flex: 1 }}
              >
                <View style={styles.closeSheetBtn}>
                  <Text style={styles.closeSheetText}>Done</Text>
                </View>
              </AnimatedPressable>
            </View>
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
    gap: 16,
  },
  addSubjectGhostBtn: {
    color: colors.accent,
    fontSize: 14,
    fontWeight: '700',
    paddingRight: 6,
  },
  gaugeHeaderCard: {
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addCard: {
    padding: 16,
    gap: 12,
  },
  addCardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.label,
  },
  input: {
    backgroundColor: colors.cardBackgroundElevated,
    padding: 14,
    borderRadius: 14,
    fontSize: 15,
    color: colors.label,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  addActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
  },
  cancelBtn: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  cancelText: {
    color: colors.secondaryLabel,
    fontSize: 14,
    fontWeight: '600',
  },
  saveBtn: {
    backgroundColor: colors.accent,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12,
  },
  saveText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '700',
  },
  emptyContainer: {
    padding: 24,
    alignItems: 'center',
    gap: 10,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.label,
  },
  emptySubtitle: {
    fontSize: 13,
    color: colors.secondaryLabel,
    textAlign: 'center',
  },
  emptyAddBtn: {
    backgroundColor: colors.accent,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 14,
    marginTop: 8,
  },
  emptyAddBtnText: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 14,
  },
  subjectsList: {
    gap: 14,
  },
  subjectCard: {
    padding: 18,
    gap: 12,
  },
  subCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  subNameText: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.label,
  },
  subPctText: {
    fontSize: 18,
    fontWeight: '800',
    fontVariant: ['tabular-nums'],
  },
  progressTrack: {
    height: 6,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  countsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 2,
  },
  countText: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.secondaryLabel,
  },
  countVal: {
    fontWeight: '700',
    color: colors.label,
  },
  insightText: {
    fontSize: 13,
    fontWeight: '600',
    marginTop: 2,
    marginBottom: 4,
  },
  actionButtonsRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 4,
  },
  bunkBtn: {
    backgroundColor: 'rgba(239, 68, 68, 0.12)',
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.25)',
  },
  bunkBtnText: {
    color: colors.destructive,
    fontSize: 14,
    fontWeight: '700',
  },
  attendBtn: {
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.25)',
  },
  attendBtnText: {
    color: colors.success,
    fontSize: 14,
    fontWeight: '700',
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
    gap: 20,
    borderTopWidth: 1,
    borderTopColor: colors.cardBorder,
    maxHeight: '80%',
  },
  sheetHeader: {
    alignItems: 'center',
    gap: 4,
  },
  sheetTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.label,
    textAlign: 'center',
  },
  sheetSubtitle: {
    fontSize: 13,
    color: colors.secondaryLabel,
    fontWeight: '500',
  },
  logsScroll: {
    maxHeight: 400,
  },
  logsList: {
    gap: 12,
  },
  emptyLogText: {
    color: colors.tertiaryLabel,
    textAlign: 'center',
    fontStyle: 'italic',
    paddingVertical: 20,
  },
  logRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.cardBackgroundElevated,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  logInfo: {
    gap: 2,
  },
  logType: {
    fontSize: 15,
    fontWeight: '700',
  },
  logDate: {
    fontSize: 12,
    color: colors.secondaryLabel,
    fontWeight: '500',
  },
  undoBtn: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
  },
  undoBtnText: {
    color: colors.label,
    fontSize: 12,
    fontWeight: '700',
  },
  sheetActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  deleteSubjectBtn: {
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
  },
  deleteSubjectText: {
    color: colors.destructive,
    fontWeight: '700',
    fontSize: 14,
  },
  resetSubjectBtn: {
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.3)',
  },
  resetSubjectText: {
    color: '#F59E0B',
    fontWeight: '700',
    fontSize: 14,
  },
  closeSheetBtn: {
    backgroundColor: colors.accent,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
  },
  closeSheetText: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 14,
  },
});
