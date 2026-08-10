import { View, Text, StyleSheet, ScrollView, Pressable, ActivityIndicator, Alert } from 'react-native';
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/utils/api';
import { colors } from '@/theme/colors';
import { useAuthStore } from '@/stores/useAuthStore';
import * as Haptics from 'expo-haptics';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import { SymbolView } from 'expo-symbols';

export default function EditClassScreen() {
  const { user, setUser } = useAuthStore();
  const router = useRouter();
  const queryClient = useQueryClient();

  // Pre-select the user's current branch and class if available
  const [selectedBranch, setSelectedBranch] = useState<number | null>(user?.courseClass?.branch_id || null);
  const [selectedClass, setSelectedClass] = useState<number | null>(user?.class_id || null);

  const { data: branches, isLoading: loadingBranches } = useQuery({
    queryKey: ['branches'],
    queryFn: async () => {
      const res = await api.get('/branches');
      return res.data;
    }
  });

  const { data: classes, isLoading: loadingClasses } = useQuery({
    queryKey: ['classes', selectedBranch],
    queryFn: async () => {
      const res = await api.get(`/classes?branch_id=${selectedBranch}`);
      return res.data;
    },
    enabled: !!selectedBranch
  });

  const updateMutation = useMutation({
    mutationFn: async (classId: number) => {
      const res = await api.put('/user/class', { class_id: classId });
      return res.data; // { message, user }
    },
    onSuccess: async (data) => {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      // Update global auth store with the new user object
      setUser(data.user);
      // Invalidate timetable so it fetches the new class's timetable
      queryClient.invalidateQueries({ queryKey: ['timetables'] });
      // Go back to profile
      router.back();
    },
    onError: (err: any) => {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert('Error', err.response?.data?.message || 'Failed to update class');
    }
  });

  const handleSave = () => {
    if (!selectedClass) return;
    
    // Check if the user is a CR and is changing their class
    if (user?.role === 'cr' && user.class_id !== selectedClass) {
      Alert.alert(
        'Warning',
        'You are currently a Class Representative. If you change your class, you will lose your CR privileges for your old class. Do you want to proceed?',
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: 'Proceed', 
            style: 'destructive', 
            onPress: () => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              updateMutation.mutate(selectedClass);
            }
          }
        ]
      );
    } else {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      updateMutation.mutate(selectedClass);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTopRow}>
          <Text style={styles.title}>Edit Academic Profile</Text>
          <Pressable onPress={() => router.back()} style={styles.closeBtn}>
            <SymbolView name="xmark.circle.fill" tintColor={colors.secondaryLabel} size={28} />
          </Pressable>
        </View>
        <Text style={styles.subtitle}>Select your correct branch and class section below to update your timetable.</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.sectionTitle}>1. Select Branch</Text>
        {loadingBranches ? (
          <ActivityIndicator color={colors.accent as string} />
        ) : (
          <View style={styles.grid}>
            {branches?.map((branch: any) => (
              <Pressable
                key={branch.id}
                onPress={() => {
                  Haptics.selectionAsync();
                  setSelectedBranch(branch.id);
                  if (branch.id !== user?.courseClass?.branch_id) {
                    setSelectedClass(null); // Reset class selection if branch changed
                  }
                }}
                style={[
                  styles.card,
                  selectedBranch === branch.id && styles.cardActive
                ]}
              >
                <Text style={[styles.cardTitle, selectedBranch === branch.id && styles.textActive]}>
                  {branch.code}
                </Text>
                <Text style={[styles.cardSubtitle, selectedBranch === branch.id && styles.textActive]}>
                  {branch.name}
                </Text>
              </Pressable>
            ))}
          </View>
        )}

        {selectedBranch && (
          <Animated.View entering={FadeInUp} style={styles.classSection}>
            <Text style={styles.sectionTitle}>2. Select Section/Group</Text>
            {loadingClasses ? (
              <ActivityIndicator color={colors.accent as string} />
            ) : (
              <View style={styles.list}>
                {classes?.length === 0 && <Text style={styles.emptyText}>No classes found for this branch.</Text>}
                {classes?.map((cls: any) => (
                  <Pressable
                    key={cls.id}
                    onPress={() => {
                      Haptics.selectionAsync();
                      setSelectedClass(cls.id);
                    }}
                    style={[
                      styles.listItem,
                      selectedClass === cls.id && styles.cardActive
                    ]}
                  >
                    <Text style={[styles.listText, selectedClass === cls.id && styles.textActive]}>
                      {cls.group_name} (Year {cls.year})
                    </Text>
                  </Pressable>
                ))}
              </View>
            )}
          </Animated.View>
        )}
      </ScrollView>

      {selectedClass && selectedClass !== user?.class_id && (
        <Animated.View entering={FadeInUp} style={styles.footer}>
          <Pressable 
            style={[styles.saveButton, updateMutation.isPending && styles.saveButtonDisabled]} 
            onPress={handleSave}
            disabled={updateMutation.isPending}
          >
            {updateMutation.isPending ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.saveText}>Save Changes</Text>
            )}
          </Pressable>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.systemBackground as string,
  },
  header: {
    padding: 24,
    paddingTop: 32,
    gap: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.separator as string,
  },
  headerTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  closeBtn: {
    padding: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.label as string,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 15,
    color: colors.secondaryLabel as string,
    lineHeight: 22,
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 120,
    gap: 24,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  card: {
    width: '48%',
    padding: 16,
    backgroundColor: colors.secondarySystemBackground as string,
    borderRadius: 16,
    gap: 4,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  cardActive: {
    backgroundColor: colors.accent as string,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.label as string,
  },
  cardSubtitle: {
    fontSize: 12,
    color: colors.secondaryLabel as string,
  },
  textActive: {
    color: '#fff',
  },
  classSection: {
    gap: 16,
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.label as string,
    marginBottom: 4,
  },
  list: {
    gap: 8,
  },
  listItem: {
    padding: 16,
    backgroundColor: colors.secondarySystemBackground as string,
    borderRadius: 12,
  },
  listText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.label as string,
  },
  emptyText: {
    color: colors.secondaryLabel as string,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 24,
    paddingBottom: 40,
    backgroundColor: colors.systemBackground as string,
    borderTopWidth: 1,
    borderTopColor: colors.separator as string,
  },
  saveButton: {
    backgroundColor: colors.accent as string,
    padding: 18,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: colors.accent as string,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
  },
  saveButtonDisabled: {
    opacity: 0.7,
  },
  saveText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  }
});
