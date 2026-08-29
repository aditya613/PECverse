import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, Pressable, Image, ActivityIndicator, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { useLocalSearchParams, Stack, useRouter } from 'expo-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchLostAndFoundItems, fetchLostAndFoundComments, createLostAndFoundComment, resolveLostAndFoundItem, deleteLostAndFoundItem, reportLostAndFoundItem } from '@/utils/lostAndFoundApi';
import { useTheme } from '@/theme/colors';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '@/stores/useAuthStore';

export default function LostAndFoundDetailScreen() {
  const { id } = useLocalSearchParams();
  const { colors } = useTheme();
  const router = useRouter();
  const user = useAuthStore(state => state.user);
  const queryClient = useQueryClient();
  const itemId = Number(id);

  const [commentText, setCommentText] = useState('');

  // We fetch all items to grab the specific one. (In a real app, you might have a specific fetch endpoint for one item)
  const { data: itemsPage } = useQuery({
    queryKey: ['lostAndFound'],
    queryFn: () => fetchLostAndFoundItems(),
  });

  const item = itemsPage?.data?.find((i: any) => i.id === itemId);

  const { data: comments, isLoading: isLoadingComments } = useQuery({
    queryKey: ['lostAndFoundComments', itemId],
    queryFn: () => fetchLostAndFoundComments(itemId),
  });

  const commentMutation = useMutation({
    mutationFn: () => createLostAndFoundComment(itemId, commentText),
    onSuccess: () => {
      setCommentText('');
      queryClient.invalidateQueries({ queryKey: ['lostAndFoundComments', itemId] });
      queryClient.invalidateQueries({ queryKey: ['lostAndFound'] });
    },
  });

  const resolveMutation = useMutation({
    mutationFn: () => resolveLostAndFoundItem(itemId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lostAndFound'] });
      router.back();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => deleteLostAndFoundItem(itemId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lostAndFound'] });
      router.back();
    },
  });

  const handleAction = () => {
    const isOwner = item?.user_id === user?.id;
    const isSuperAdmin = user?.role === 'superadmin';

    const options = [];

    if (isOwner || isSuperAdmin) {
      if (item?.status === 'active') {
        options.push({ text: 'Mark as Resolved', onPress: () => resolveMutation.mutate() });
      }
      options.push({ text: 'Delete Post', onPress: () => deleteMutation.mutate(), style: 'destructive' });
    } else {
      options.push({ text: 'Report Post', onPress: () => handleReport(), style: 'destructive' });
    }

    options.push({ text: 'Cancel', style: 'cancel' });

    Alert.alert('Options', '', options as any);
  };

  const handleReport = () => {
    Alert.prompt('Report Post', 'Why are you reporting this?', [
      { text: 'Cancel', style: 'cancel' },
      { 
        text: 'Report', 
        style: 'destructive',
        onPress: async (reason?: string) => {
          if (reason) {
            try {
              await reportLostAndFoundItem(itemId, reason);
              Alert.alert('Reported', 'Thank you. We will review this post.');
            } catch (e: any) {
              Alert.alert('Error', e.response?.data?.message || 'Failed to report.');
            }
          }
        }
      }
    ]);
  };

  if (!item) {
    return (
      <View style={[styles.container, { backgroundColor: colors.systemBackground, justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={colors.accent} />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView 
      style={[styles.container, { backgroundColor: colors.systemBackground }]} 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <Stack.Screen 
        options={{ 
          title: item.type === 'lost' ? 'Lost Item' : 'Found Item',
          headerShown: true,
          headerStyle: { backgroundColor: colors.cardBackground },
          headerTintColor: colors.label,
          headerRight: () => (
            <Pressable onPress={handleAction}>
              <Ionicons name="ellipsis-horizontal-circle" size={24} color={colors.label} />
            </Pressable>
          ),
        }} 
      />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={[styles.mainCard, { backgroundColor: colors.cardBackground, borderColor: colors.cardBorder }]}>
          <View style={styles.authorRow}>
            <View style={[styles.avatar, { backgroundColor: colors.accent + '20' }]}>
              <Text style={[styles.avatarText, { color: colors.accent }]}>
                {item.user.name.charAt(0).toUpperCase()}
              </Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.authorName, { color: colors.label }]}>{item.user.name}</Text>
              <Text style={[styles.authorBranch, { color: colors.secondaryLabel }]}>{item.user.branch}</Text>
            </View>
            <View style={[styles.typeBadge, { backgroundColor: item.type === 'lost' ? '#EF4444' : '#10B981' }]}>
              <Text style={styles.typeBadgeText}>{item.type.toUpperCase()}</Text>
            </View>
          </View>

          <Text style={[styles.title, { color: colors.label }]}>{item.title}</Text>
          <Text style={[styles.description, { color: colors.label }]}>{item.description}</Text>
          
          {item.location && (
            <View style={styles.detailRow}>
              <Ionicons name="location" size={16} color={colors.secondaryLabel} />
              <Text style={[styles.detailText, { color: colors.secondaryLabel }]}>{item.location}</Text>
            </View>
          )}

          <View style={styles.detailRow}>
            <Ionicons name="calendar" size={16} color={colors.secondaryLabel} />
            <Text style={[styles.detailText, { color: colors.secondaryLabel }]}>
              {new Date(item.date_lost_or_found).toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}
            </Text>
          </View>

          {item.image_url && (
            <Image source={{ uri: item.image_url }} style={styles.image} resizeMode="contain" />
          )}
        </View>

        <View style={styles.commentsSection}>
          <Text style={[styles.commentsHeader, { color: colors.label }]}>Discussion ({comments?.length || 0})</Text>
          
          {isLoadingComments ? (
            <ActivityIndicator color={colors.accent} style={{ marginTop: 20 }} />
          ) : (
            comments?.map((comment) => (
              <View key={comment.id} style={styles.commentItem}>
                <View style={[styles.commentAvatar, { backgroundColor: colors.secondarySystemBackground }]}>
                  <Text style={[styles.commentAvatarText, { color: colors.secondaryLabel }]}>
                    {comment.user.name.charAt(0).toUpperCase()}
                  </Text>
                </View>
                <View style={[styles.commentBubble, { backgroundColor: colors.cardBackground, borderColor: colors.cardBorder }]}>
                  <View style={styles.commentHeader}>
                    <Text style={[styles.commentName, { color: colors.label }]}>
                      {comment.user.name} {comment.user.id === item.user_id && <Text style={{ color: colors.accent }}>(Author)</Text>}
                    </Text>
                    <Text style={[styles.commentTime, { color: colors.tertiaryLabel }]}>
                      {new Date(comment.created_at).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                    </Text>
                  </View>
                  <Text style={[styles.commentContent, { color: colors.label }]}>{comment.content}</Text>
                </View>
              </View>
            ))
          )}
        </View>
      </ScrollView>

      <View style={[styles.inputContainer, { backgroundColor: colors.cardBackground, borderTopColor: colors.cardBorder }]}>
        <TextInput
          style={[styles.input, { color: colors.label, backgroundColor: colors.secondarySystemBackground }]}
          placeholder="Write a comment..."
          placeholderTextColor={colors.tertiaryLabel}
          value={commentText}
          onChangeText={setCommentText}
          multiline
        />
        <Pressable 
          style={[styles.sendBtn, { backgroundColor: commentText.trim() ? colors.accent : colors.secondarySystemBackground }]}
          onPress={() => commentText.trim() && commentMutation.mutate()}
          disabled={!commentText.trim() || commentMutation.isPending}
        >
          {commentMutation.isPending ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <Ionicons name="send" size={16} color={commentText.trim() ? '#fff' : colors.tertiaryLabel} />
          )}
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
    gap: 20,
  },
  mainCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    gap: 12,
  },
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 4,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 18,
    fontWeight: '700',
  },
  authorName: {
    fontSize: 15,
    fontWeight: '700',
  },
  authorBranch: {
    fontSize: 13,
  },
  typeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  typeBadgeText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: '800',
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
  },
  description: {
    fontSize: 15,
    lineHeight: 22,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  detailText: {
    fontSize: 14,
    fontWeight: '500',
  },
  image: {
    width: '100%',
    height: 250,
    borderRadius: 12,
    marginTop: 8,
  },
  commentsSection: {
    gap: 16,
  },
  commentsHeader: {
    fontSize: 16,
    fontWeight: '700',
    marginLeft: 4,
  },
  commentItem: {
    flexDirection: 'row',
    gap: 12,
  },
  commentAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  commentAvatarText: {
    fontSize: 14,
    fontWeight: '700',
  },
  commentBubble: {
    flex: 1,
    borderRadius: 16,
    borderTopLeftRadius: 4,
    borderWidth: 1,
    padding: 12,
    gap: 4,
  },
  commentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  commentName: {
    fontSize: 13,
    fontWeight: '700',
  },
  commentTime: {
    fontSize: 11,
  },
  commentContent: {
    fontSize: 14,
    lineHeight: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 12,
    paddingBottom: 24, // Safe area for iOS
    borderTopWidth: 1,
    gap: 10,
  },
  input: {
    flex: 1,
    minHeight: 40,
    maxHeight: 100,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 12,
    fontSize: 15,
  },
  sendBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
