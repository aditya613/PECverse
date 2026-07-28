import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, RefreshControl, Linking } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/utils/api';
import { colors } from '@/theme/colors';
import { GlassCard } from '@/components/ui/GlassCard';
import { AnimatedPressable } from '@/components/ui/AnimatedPressable';
import { useAuthStore } from '@/stores/useAuthStore';
import * as Haptics from 'expo-haptics';

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

const CATEGORIES = ['All', 'Announcements', 'Notes', 'Events'];

export default function FeedScreen() {
  const user = useAuthStore(state => state.user);
  const [selectedCategory, setSelectedCategory] = useState('All');

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
    <View style={styles.container}>
      <ScrollView 
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor={colors.accent} />}
      >
        {/* Header Bar */}
        <View style={styles.headerRow}>
          <Text style={styles.headerTitle}>Study Material & Feed</Text>
          <View style={styles.bellIconCircle}>
            <Text style={styles.bellEmoji}>📚</Text>
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
                <View style={[styles.filterPill, isSelected && styles.filterPillActive]}>
                  <Text style={[styles.filterText, isSelected && styles.filterTextActive]}>
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
            <GlassCard style={styles.emptyCard}>
              <Text style={styles.emptyTitle}>No Notes Uploaded Yet</Text>
              <Text style={styles.emptySubtitle}>Notes and material uploaded by your CRs will appear here.</Text>
            </GlassCard>
          ) : (
            notes.map((note) => (
              <AnimatedPressable key={note.id} onPress={() => handleDownload(note)} scaleTo={0.98}>
                <GlassCard style={styles.postCard}>
                  <View style={styles.postHeaderRow}>
                    <View style={styles.authorGroup}>
                      <View style={styles.authorAvatar}>
                        <Text style={styles.authorAvatarText}>
                          {note.uploader?.name ? note.uploader.name[0] : 'CR'}
                        </Text>
                      </View>
                      <View>
                        <Text style={styles.authorName}>{note.uploader?.name || 'CR Upload'}</Text>
                        <Text style={styles.postTimestamp}>
                          {new Date(note.created_at).toLocaleDateString(undefined, {
                            month: 'short', day: 'numeric'
                          })}
                        </Text>
                      </View>
                    </View>
                  </View>

                  <View style={styles.postBodyBox}>
                    <Text style={styles.subjectBadgeText}>{note.subject.toUpperCase()}</Text>
                    <Text style={styles.postTitleText}>{note.title}</Text>
                  </View>

                  <View style={styles.postFooterRow}>
                    <View style={styles.reactionsGroup}>
                      <Text style={styles.downloadsText}>📥 {note.downloads_count} Downloads</Text>
                    </View>
                    <Text style={styles.openBtnText}>Open File ›</Text>
                  </View>
                </GlassCard>
              </AnimatedPressable>
            ))
          )}
        </View>

        {/* Spacer for bottom tab bar */}
        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.systemBackground,
  },
  contentContainer: {
    paddingTop: 54,
    gap: 16,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.label,
    letterSpacing: -0.5,
  },
  bellIconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.cardBackground,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bellEmoji: {
    fontSize: 16,
  },
  filterRibbon: {
    paddingHorizontal: 20,
    gap: 10,
    paddingVertical: 4,
  },
  filterPill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 18,
    backgroundColor: colors.cardBackground,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  filterPillActive: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  filterText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.secondaryLabel,
  },
  filterTextActive: {
    color: '#FFF',
    fontWeight: '700',
  },
  feedList: {
    paddingHorizontal: 20,
    gap: 14,
  },
  emptyCard: {
    padding: 24,
    alignItems: 'center',
    gap: 8,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.label,
  },
  emptySubtitle: {
    fontSize: 13,
    color: colors.secondaryLabel,
    textAlign: 'center',
  },
  postCard: {
    padding: 18,
    gap: 14,
  },
  postHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  authorGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  authorAvatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  authorAvatarText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '700',
  },
  authorName: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.label,
  },
  postTimestamp: {
    fontSize: 12,
    color: colors.tertiaryLabel,
    marginTop: 1,
  },
  postBodyBox: {
    gap: 4,
  },
  subjectBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.accent,
    letterSpacing: 0.5,
  },
  postTitleText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.label,
  },
  postFooterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.06)',
  },
  reactionsGroup: {
    flexDirection: 'row',
  },
  downloadsText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.secondaryLabel,
  },
  openBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.accent,
  },
});
