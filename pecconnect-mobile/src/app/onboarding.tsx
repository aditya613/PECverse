import { View, Text, StyleSheet, ScrollView, Pressable, ActivityIndicator, Alert } from 'react-native';
import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { api } from '@/utils/api';
import { colors } from '@/theme/colors';
import { useAuthStore } from '@/stores/useAuthStore';
import * as Haptics from 'expo-haptics';
import { Image } from 'expo-image';
import Animated, { FadeInUp } from 'react-native-reanimated';

export default function OnboardingScreen() {
  const { user, setUser } = useAuthStore();
  const [selectedBranch, setSelectedBranch] = useState<number | null>(null);
  const [selectedClass, setSelectedClass] = useState<number | null>(null);

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

  const joinMutation = useMutation({
    mutationFn: async (classId: number) => {
      const res = await api.put('/user/class', { class_id: classId });
      return res.data; // { message, user }
    },
    onSuccess: async (data) => {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      // Update global auth store with the new user object
      setUser(data.user);
    },
    onError: (err: any) => {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert('Error', err.response?.data?.message || 'Failed to join class');
    }
  });

  const handleJoin = () => {
    if (!selectedClass) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    joinMutation.mutate(selectedClass);
  };

  return (
    <View style={styles.container}>
      <Animated.View entering={FadeInUp.duration(600).springify()} style={styles.header}>
        <Image source={require('@/assets/images/pec-logo.jpg')} style={styles.logo} contentFit="contain" />
        <Text style={styles.title}>Welcome to PECverse</Text>
        <Text style={styles.subtitle}>Let's get you set up. What branch are you in?</Text>
      </Animated.View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
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
                  setSelectedClass(null); // Reset class selection
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
            <Text style={styles.sectionTitle}>Which section/group?</Text>
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

      {selectedClass && (
        <Animated.View entering={FadeInUp} style={styles.footer}>
          <Pressable 
            style={[styles.joinButton, joinMutation.isPending && styles.joinButtonDisabled]} 
            onPress={handleJoin}
            disabled={joinMutation.isPending}
          >
            {joinMutation.isPending ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.joinText}>Join Class</Text>
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
    paddingTop: 80,
    gap: 8,
  },
  logo: {
    width: 60,
    height: 60,
    marginBottom: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: colors.label as string,
    letterSpacing: -1,
  },
  subtitle: {
    fontSize: 16,
    color: colors.secondaryLabel as string,
    lineHeight: 24,
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 120,
    gap: 32,
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
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.label as string,
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
  joinButton: {
    backgroundColor: colors.accent as string,
    padding: 18,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: colors.accent as string,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
  },
  joinButtonDisabled: {
    opacity: 0.7,
  },
  joinText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  }
});
