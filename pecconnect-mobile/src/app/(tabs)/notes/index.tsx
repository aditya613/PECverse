import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, RefreshControl, Linking } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/utils/api';
import { useTheme } from '@/theme/colors';
import { GlassCard } from '@/components/ui/GlassCard';
import { AnimatedPressable } from '@/components/ui/AnimatedPressable';
import { useAuthStore } from '@/stores/useAuthStore';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { trackScreen, trackEvent } from '@/utils/analytics';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface Note {
  id: number;
  title: string;
  subject: string;
  file_url: string;
  file_type?: string | null;
  downloads_count: number;
  created_at: string;
  uploader?: {
    name: string;
  };
}

const CATEGORIES = ['All', 'Notes', 'Assignments', 'PYQs'];

export default function NotesScreen() {
  const insets = useSafeAreaInsets();
  const user = useAuthStore(state => state.user);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const { colors, isDark } = useTheme();

  React.useEffect(() => {
    trackScreen('notes');
  }, []);

  const { data: notes, isLoading, refetch, isRefetching } = useQuery({
    queryKey: ['notes'],
    queryFn: async () => {
      const res = await api.get('/notes');
      return res.data as Note[];
    },
    enabled: !!user?.class_id,
  });

  const handleDownload = async (note: Note) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    trackEvent('note_download', { note_id: note.id, title: note.title, subject: note.subject });
    try {
      if (note.file_url) {
        await Linking.openURL(note.file_url);
        api.post(`/notes/${note.id}/download`).catch(() => {});
      }
    } catch (e) {
      // open link fallback
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.systemBackground }]}>
      <ScrollView 
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor={colors.accent} />}
      >
        {/* Header Bar */}
        <View style={styles.headerRow}>
          <View>
            <Text style={[styles.headerTitle, { color: colors.label }]}>Study Resources</Text>
            <Text style={[styles.headerSubtitle, { color: colors.secondaryLabel }]}>Class Notes & Materials</Text>
          </View>
          <View style={[styles.bellIconCircle, { backgroundColor: colors.cardBackground, borderColor: colors.cardBorder }]}>
            <Ionicons name="folder-open" size={20} color={colors.accent} />
          </View>
        </View>

        {/* Filter Pills Row */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          contentContainerStyle={styles.filterRibbon}
        >
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <AnimatedPressable 
                key={cat} 
                onPress={() => setSelectedCategory(cat)}
                scaleTo={0.94}
              >
                <View style={[
                  styles.filterPill, 
                  { backgroundColor: isSelected ? colors.accent : colors.secondarySystemBackground, borderColor: isSelected ? colors.accent : colors.cardBorder }
                ]}>
                  <Text style={[styles.filterText, { color: isSelected ? '#FFFFFF' : colors.secondaryLabel }]}>
                    {cat}
                  </Text>
                </View>
              </AnimatedPressable>
            );
          })}
        </ScrollView>

        {/* Posts & Notes List */}
        <View style={styles.feedList}>
          {isLoading && !isRefetching ? (
            <ActivityIndicator size="large" color={colors.accent} style={{ marginTop: 40 }} />
          ) : !notes || notes.length === 0 ? (
            <View style={[styles.emptyCard, { backgroundColor: colors.cardBackground, borderColor: colors.cardBorder }]}>
              <Ionicons name="document-text-outline" size={48} color={colors.tertiaryLabel} />
              <Text style={[styles.emptyTitle, { color: colors.label }]}>No Notes Uploaded Yet</Text>
              <Text style={[styles.emptySubtitle, { color: colors.secondaryLabel }]}>Notes and study material uploaded by your CR will appear here.</Text>
            </View>
          ) : (
            notes.map((note, index) => (
              <Animated.View 
                key={note.id} 
                entering={FadeInDown.delay(index * 40).springify()}
                style={[styles.noteCard, { backgroundColor: colors.cardBackground, borderColor: colors.cardBorder }]}
              >
                <View style={[styles.noteIconBox, { backgroundColor: colors.accent + '15' }]}>
                  <Ionicons name="document-text" size={24} color={colors.accent} />
                </View>
                <View style={styles.noteContent}>
                  <Text style={[styles.noteTitle, { color: colors.label }]} numberOfLines={2}>{note.title}</Text>
                  <Text style={[styles.noteMeta, { color: colors.secondaryLabel }]}>
                    {note.subject} • By {note.uploader?.name || 'CR'}
                  </Text>
                </View>
                <AnimatedPressable 
                  style={[styles.downloadBtn, { backgroundColor: colors.accent }]}
                  onPress={() => handleDownload(note)}
                >
                  <Ionicons name="download-outline" size={18} color="#FFFFFF" />
                </AnimatedPressable>
              </Animated.View>
            ))
          )}
        </View>

        <View style={{ height: Math.max(insets.bottom + 90, 110) }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingTop: 54,
    paddingHorizontal: 16,
    gap: 16,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 13,
    fontWeight: '500',
    marginTop: 2,
  },
  bellIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  filterRibbon: {
    gap: 8,
    paddingVertical: 4,
  },
  filterPill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 18,
    borderWidth: 1,
  },
  filterText: {
    fontSize: 13,
    fontWeight: '700',
  },
  feedList: {
    gap: 12,
  },
  noteCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 18,
    borderWidth: 1,
  },
  noteIconBox: {
    width: 46,
    height: 46,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  noteContent: {
    flex: 1,
    gap: 4,
  },
  noteTitle: {
    fontSize: 15,
    fontWeight: '700',
  },
  noteMeta: {
    fontSize: 12,
  },
  downloadBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyCard: {
    padding: 40,
    alignItems: 'center',
    borderRadius: 20,
    borderWidth: 1,
    gap: 10,
    marginTop: 20,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: '700',
  },
  emptySubtitle: {
    fontSize: 13,
    textAlign: 'center',
  },
});
