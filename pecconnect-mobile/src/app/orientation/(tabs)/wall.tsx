import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable, ActivityIndicator, TextInput, KeyboardAvoidingView, Platform, Modal } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '@/theme/colors';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/utils/api';
import { useFresherStore } from '@/stores/useFresherStore';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import Animated, { FadeInDown, SlideInDown, ZoomIn } from 'react-native-reanimated';
import { BlurView } from 'expo-blur';

// Beautiful, vibrant colors for anonymous avatars
const AVATAR_COLORS = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEEAD', '#D4A5A5', '#9B5DE5', '#F15BB5', '#00BBF9', '#00F5D4'];

const getAvatarColor = (name: string) => {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
};

export default function WallScreen() {
  const insets = useSafeAreaInsets();
  const { deviceId } = useFresherStore();
  const queryClient = useQueryClient();
  const [isComposeVisible, setIsComposeVisible] = useState(false);
  const [composeText, setComposeText] = useState('');
  
  // Comments state
  const [activePost, setActivePost] = useState<any | null>(null);
  const [commentText, setCommentText] = useState('');
  
  // Anonymity toggles
  const [isAnonymousPost, setIsAnonymousPost] = useState(true);
  const [isAnonymousComment, setIsAnonymousComment] = useState(true);

  const { data, isLoading, isRefetching, refetch } = useQuery({
    queryKey: ['wallPosts'],
    queryFn: async () => {
      const res = await api.get(`/wall?device_id=${deviceId}`);
      return res.data.data;
    },
    refetchInterval: 30000,
  });

  const likeMutation = useMutation({
    mutationFn: async (postId: number) => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      await api.post(`/wall/${postId}/like`, { device_id: deviceId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wallPosts'] });
    }
  });

  const postMutation = useMutation({
    mutationFn: async (content: string) => {
      await api.post('/wall', { device_id: deviceId, content, is_anonymous: isAnonymousPost });
    },
    onSuccess: () => {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setIsComposeVisible(false);
      setComposeText('');
      setIsAnonymousPost(true);
      queryClient.invalidateQueries({ queryKey: ['wallPosts'] });
    }
  });

  const { data: commentsData, isLoading: isCommentsLoading } = useQuery({
    queryKey: ['wallComments', activePost?.id],
    queryFn: async () => {
      const res = await api.get(`/wall/${activePost.id}/comments`);
      return res.data.data;
    },
    enabled: !!activePost,
    refetchInterval: 10000,
  });

  const commentMutation = useMutation({
    mutationFn: async (content: string) => {
      await api.post(`/wall/${activePost.id}/comments`, { device_id: deviceId, content, is_anonymous: isAnonymousComment });
    },
    onSuccess: () => {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setCommentText('');
      setIsAnonymousComment(true);
      queryClient.invalidateQueries({ queryKey: ['wallComments', activePost?.id] });
      queryClient.invalidateQueries({ queryKey: ['wallPosts'] });
    }
  });

  const handlePost = () => {
    if (composeText.trim().length === 0) return;
    postMutation.mutate(composeText.trim());
  };

  const renderPost = ({ item, index }: { item: any; index: number }) => {
    const avatarColor = getAvatarColor(item.author);
    return (
      <Animated.View entering={FadeInDown.delay(Math.min(index * 50, 400)).springify()} style={styles.postCard}>
        <View style={styles.postHeader}>
          <View style={[styles.avatar, { backgroundColor: avatarColor + '20' }]}>
            <Text style={[styles.avatarText, { color: avatarColor }]}>
              {item.author.charAt(0).toUpperCase()}
            </Text>
          </View>
          <View style={styles.headerTextContainer}>
            <Text style={styles.authorText}>{item.author}</Text>
            <Text style={styles.timeText}>Just now</Text>
          </View>
          <Pressable style={styles.moreOptions}>
            <Ionicons name="ellipsis-horizontal" size={20} color={colors.tertiaryLabel || colors.secondaryLabel} />
          </Pressable>
        </View>

        <Text style={styles.postContent}>{item.content}</Text>

        <View style={styles.postActions}>
          <Pressable
            style={({ pressed }) => [styles.actionBtn, pressed && { opacity: 0.7 }]}
            onPress={() => likeMutation.mutate(item.id)}
          >
            <View style={[styles.iconWrapper, item.is_liked && { backgroundColor: '#FF2D5520' }]}>
              <Ionicons
                name={item.is_liked ? "heart" : "heart-outline"}
                color={item.is_liked ? "#FF2D55" : colors.secondaryLabel}
                size={22}
              />
            </View>
            <Text style={[styles.actionText, item.is_liked && { color: '#FF2D55', fontWeight: '600' }]}>
              {item.likes_count}
            </Text>
          </Pressable>

          <Pressable 
            style={({ pressed }) => [styles.actionBtn, pressed && { opacity: 0.7 }]}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              setActivePost(item);
            }}
          >
            <View style={styles.iconWrapper}>
              <Ionicons name="chatbubble-outline" color={colors.secondaryLabel} size={20} />
            </View>
            <Text style={styles.actionText}>{item.comments_count}</Text>
          </Pressable>

          <Pressable style={({ pressed }) => [styles.actionBtn, pressed && { opacity: 0.7 }, { marginLeft: 'auto' }]}>
            <Ionicons name="share-outline" color={colors.secondaryLabel} size={22} />
          </Pressable>
        </View>
      </Animated.View>
    );
  };

  return (
    <View style={styles.container}>
      {Platform.OS === 'ios' ? (
        <BlurView intensity={80} tint="dark" style={[styles.headerBlur, { paddingTop: insets.top }]}>
          <Text style={styles.headerTitle}>PECverse Lounge</Text>
        </BlurView>
      ) : (
        <SafeAreaView style={styles.headerSolid} edges={['top']}>
          <Text style={styles.headerTitle}>PECverse Lounge</Text>
        </SafeAreaView>
      )}

      {isLoading ? (
        <ActivityIndicator style={{ marginTop: 100 }} color={colors.accent} size="large" />
      ) : (
        <FlatList
          data={data}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderPost}
          contentContainerStyle={[
            styles.listContent,
            { paddingTop: Platform.OS === 'ios' ? insets.top + 60 : 20, paddingBottom: insets.bottom + 120 }
          ]}
          refreshing={isRefetching}
          onRefresh={refetch}
          ListHeaderComponent={
            <Animated.View entering={FadeInDown} style={styles.heroBanner}>
              <Text style={styles.heroBannerTitle}>The Lounge</Text>
              <Text style={styles.heroBannerDesc}>
                Welcome to the secret sauce. Share your excitement, ask questions, or just vibe with your batchmates. Everything here is pseudo-anonymous.
              </Text>
            </Animated.View>
          }
          ListEmptyComponent={
            <Animated.View entering={ZoomIn} style={styles.emptyState}>
              <Ionicons name="cafe-outline" size={64} color={colors.secondaryLabel} />
              <Text style={styles.emptyTextTitle}>It's quiet here...</Text>
              <Text style={styles.emptyText}>Be the first to spark a conversation!</Text>
            </Animated.View>
          }
        />
      )}

      {/* Premium FAB */}
      <Animated.View entering={ZoomIn.delay(300)} style={[styles.fabContainer, { bottom: insets.bottom + 85 }]}>
        <Pressable
          style={({ pressed }) => [styles.fab, pressed && { transform: [{ scale: 0.95 }] }]}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            setIsComposeVisible(true);
          }}
        >
          <Ionicons name="add" color="#FFFFFF" size={32} />
        </Pressable>
      </Animated.View>

      {/* Compose Full-Screen Modal */}
      <Modal visible={isComposeVisible} animationType="slide" presentationStyle="pageSheet">
        <SafeAreaView style={styles.fullScreenCompose}>
          {/* Header */}
          <View style={styles.fsHeader}>
            <Pressable onPress={() => setIsComposeVisible(false)} hitSlop={10}>
              <Text style={styles.fsCancelText}>Cancel</Text>
            </Pressable>
            <Text style={styles.fsTitle}>New Post</Text>
            <Pressable 
              onPress={handlePost} 
              disabled={composeText.trim().length === 0 || postMutation.isPending}
              style={[styles.fsPostBtn, (composeText.trim().length === 0 || postMutation.isPending) && { opacity: 0.5 }]}
            >
              {postMutation.isPending ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <Text style={styles.fsPostText}>Post</Text>
              )}
            </Pressable>
          </View>

          {/* Identity Toggle */}
          <View style={styles.fsIdentityBar}>
            <View style={styles.fsAvatar}>
              <Ionicons name={isAnonymousPost ? "eye-off" : "person"} size={20} color="#FFFFFF" />
            </View>
            <View style={styles.fsIdentityText}>
              <Text style={styles.fsIdentityName}>
                {isAnonymousPost ? 'Posting Anonymously' : 'Posting Publicly'}
              </Text>
              <Text style={styles.fsIdentitySub}>
                {isAnonymousPost ? 'Your identity is hidden' : 'Your real name will be shown'}
              </Text>
            </View>
            <Pressable 
              style={styles.fsToggleSwitch}
              onPress={() => setIsAnonymousPost(!isAnonymousPost)}
            >
              <Text style={styles.fsToggleSwitchText}>Switch</Text>
            </Pressable>
          </View>

          {/* Input Area */}
          <TextInput
            style={styles.fsInput}
            placeholder={isAnonymousPost ? "Share something anonymously with your batch..." : "Share a public post..."}
            placeholderTextColor={colors.tertiaryLabel || '#666'}
            multiline
            autoFocus
            maxLength={500}
            value={composeText}
            onChangeText={setComposeText}
          />

          <View style={styles.fsFooter}>
            <Text style={styles.fsCharCount}>{composeText.length} / 500</Text>
          </View>
        </SafeAreaView>
      </Modal>

      {/* Comments Modal */}
      <Modal visible={!!activePost} animationType="slide" transparent>
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.modalOverlay}
        >
          <BlurView intensity={100} tint="dark" style={[styles.composeContainer, { height: '90%', paddingHorizontal: 0 }]}>
            <View style={[styles.composeHeader, { paddingHorizontal: 24 }]}>
              <Text style={styles.composeTitle}>Comments</Text>
              <Pressable onPress={() => setActivePost(null)} style={styles.headerBtn}>
                <Ionicons name="close-circle" size={28} color={colors.secondaryLabel} />
              </Pressable>
            </View>
            
            {activePost && (
              <View style={[styles.postCard, { marginHorizontal: 16, marginBottom: 8 }]}>
                <View style={styles.postHeader}>
                  <View style={[styles.avatar, { backgroundColor: getAvatarColor(activePost.author) + '20' }]}>
                    <Text style={[styles.avatarText, { color: getAvatarColor(activePost.author) }]}>
                      {activePost.author.charAt(0).toUpperCase()}
                    </Text>
                  </View>
                  <View style={styles.headerTextContainer}>
                    <Text style={styles.authorText}>{activePost.author}</Text>
                  </View>
                </View>
                <Text style={styles.postContent}>{activePost.content}</Text>
              </View>
            )}

            <FlatList
              data={commentsData || []}
              keyExtractor={(item) => item.id.toString()}
              contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 20 }}
              renderItem={({ item, index }) => (
                <Animated.View entering={FadeInDown.delay(index * 50)} style={styles.commentCard}>
                  <View style={styles.commentHeader}>
                    <View style={[styles.commentAvatar, { backgroundColor: getAvatarColor(item.author) + '20' }]}>
                      <Text style={[styles.commentAvatarText, { color: getAvatarColor(item.author) }]}>
                        {item.author.charAt(0).toUpperCase()}
                      </Text>
                    </View>
                    <Text style={styles.commentAuthorText}>{item.author}</Text>
                  </View>
                  <Text style={styles.commentContent}>{item.content}</Text>
                </Animated.View>
              )}
              ListEmptyComponent={
                isCommentsLoading ? (
                  <ActivityIndicator color={colors.accent} style={{ marginTop: 40 }} />
                ) : (
                  <Text style={[styles.emptyText, { marginTop: 40 }]}>No comments yet. Be the first!</Text>
                )
              }
            />

            {/* Comment Input */}
            <View style={styles.commentInputWrapper}>
              <View style={styles.commentAnonymousToggle}>
                <Pressable
                  style={[styles.toggleBtnSm, isAnonymousComment && styles.toggleBtnActive]}
                  onPress={() => setIsAnonymousComment(true)}
                >
                  <Ionicons name="eye-off" size={14} color={isAnonymousComment ? colors.accent : colors.secondaryLabel} />
                  <Text style={[styles.toggleTextSm, isAnonymousComment && styles.toggleTextActive]}>Ghost Mode</Text>
                </Pressable>
                <Pressable
                  style={[styles.toggleBtnSm, !isAnonymousComment && styles.toggleBtnActive]}
                  onPress={() => setIsAnonymousComment(false)}
                >
                  <Ionicons name="person" size={14} color={!isAnonymousComment ? colors.accent : colors.secondaryLabel} />
                  <Text style={[styles.toggleTextSm, !isAnonymousComment && styles.toggleTextActive]}>Public</Text>
                </Pressable>
              </View>

              <View style={styles.commentInputContainer}>
                <TextInput
                  style={styles.commentInput}
                  placeholder={isAnonymousComment ? "Write an anonymous comment..." : "Write a public comment..."}
                  placeholderTextColor={colors.tertiaryLabel || '#888888'}
                  value={commentText}
                  onChangeText={setCommentText}
                  maxLength={500}
                  multiline
                />
                <Pressable 
                  onPress={() => {
                    if (commentText.trim().length > 0) commentMutation.mutate(commentText.trim());
                  }}
                  disabled={commentText.trim().length === 0 || commentMutation.isPending}
                  style={[styles.commentSendBtn, (commentText.trim().length === 0 || commentMutation.isPending) && { opacity: 0.5 }]}
                >
                  {commentMutation.isPending ? (
                    <ActivityIndicator color="#FFFFFF" size="small" />
                  ) : (
                    <Ionicons name="send" size={20} color="#FFFFFF" />
                  )}
                </Pressable>
              </View>
            </View>
          </BlurView>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F0F13', // Deep, rich background
  },
  headerBlur: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  headerSolid: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#0F0F13',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
    zIndex: 100,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.5,
  },
  listContent: {
    paddingHorizontal: 16,
  },
  heroBanner: {
    marginBottom: 24,
    paddingHorizontal: 8,
  },
  heroBannerTitle: {
    fontSize: 34,
    fontWeight: '900',
    color: '#FFFFFF',
    marginBottom: 12,
    letterSpacing: -1,
  },
  heroBannerDesc: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.7)',
    lineHeight: 24,
    fontWeight: '500',
  },
  postCard: {
    backgroundColor: '#1C1C21',
    borderRadius: 24,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 8,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 20,
    fontWeight: '800',
  },
  headerTextContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  authorText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  timeText: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.5)',
    fontWeight: '500',
  },
  moreOptions: {
    padding: 4,
  },
  postContent: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
    lineHeight: 24,
    marginBottom: 20,
    fontWeight: '400',
  },
  postActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.05)',
    paddingTop: 16,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.05)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.secondaryLabel,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 60,
  },
  emptyTextTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFFFFF',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 15,
    color: colors.secondaryLabel,
    textAlign: 'center',
  },
  fabContainer: {
    position: 'absolute',
    right: 20,
    zIndex: 10,
  },
  fab: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.accent,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.accent,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 8,
  },
  fullScreenCompose: {
    flex: 1,
    backgroundColor: '#0F0F13',
  },
  fsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  fsCancelText: {
    fontSize: 17,
    color: '#FFFFFF',
    fontWeight: '400',
  },
  fsTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  fsPostBtn: {
    backgroundColor: colors.accent,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  fsPostText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  fsIdentityBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  fsAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  fsIdentityText: {
    flex: 1,
  },
  fsIdentityName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  fsIdentitySub: {
    fontSize: 13,
    color: colors.secondaryLabel,
  },
  fsToggleSwitch: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  fsToggleSwitchText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  fsInput: {
    flex: 1,
    fontSize: 18,
    color: '#FFFFFF',
    padding: 20,
    textAlignVertical: 'top',
    lineHeight: 28,
  },
  fsFooter: {
    padding: 16,
    alignItems: 'flex-end',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.05)',
  },
  fsCharCount: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.tertiaryLabel || '#666',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  composeContainer: {
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    padding: 24,
    paddingTop: 20,
    minHeight: '80%',
    backgroundColor: 'rgba(25, 25, 30, 0.95)',
    overflow: 'hidden',
  },
  composeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  headerBtn: {
    padding: 8,
    paddingLeft: 0,
  },
  composeTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  commentCard: {
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  commentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  commentAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  commentAvatarText: {
    fontSize: 14,
    fontWeight: '700',
  },
  commentAuthorText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  commentContent: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.8)',
    lineHeight: 22,
    paddingLeft: 36,
  },
  commentInputWrapper: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.05)',
    backgroundColor: 'rgba(20, 20, 25, 0.95)',
    paddingTop: 8,
  },
  commentAnonymousToggle: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 20,
    padding: 2,
    alignSelf: 'flex-start',
    marginLeft: 16,
    marginBottom: 4,
  },
  toggleBtnSm: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 16,
    gap: 4,
  },
  toggleBtnActive: {
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  toggleTextSm: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.secondaryLabel,
  },
  toggleTextActive: {
    color: colors.accent,
  },
  commentInputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  commentInput: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 12,
    fontSize: 16,
    color: '#FFFFFF',
    maxHeight: 100,
    marginRight: 12,
  },
  commentSendBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.accent,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 2,
  }
});
