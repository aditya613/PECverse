import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable, ActivityIndicator, TextInput, KeyboardAvoidingView, Platform, Modal } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '@/theme/colors';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/utils/api';
import { useFresherStore } from '@/stores/useFresherStore';
import { SymbolView } from 'expo-symbols';
import * as Haptics from 'expo-haptics';
import Animated, { FadeInDown, SlideInDown, SlideOutDown } from 'react-native-reanimated';

export default function WallScreen() {
  const insets = useSafeAreaInsets();
  const { deviceId } = useFresherStore();
  const queryClient = useQueryClient();
  const [isComposeVisible, setIsComposeVisible] = useState(false);
  const [composeText, setComposeText] = useState('');

  const { data, isLoading, isRefetching, refetch } = useQuery({
    queryKey: ['wallPosts'],
    queryFn: async () => {
      const res = await api.get(`/wall?device_id=${deviceId}`);
      return res.data.data; // assuming paginated response
    },
    refetchInterval: 30000, // Poll every 30s for live feel
  });

  const likeMutation = useMutation({
    mutationFn: async (postId: number) => {
      // Optimistic UI updates could go here, but keep it simple for now
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      await api.post(`/wall/${postId}/like`, { device_id: deviceId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wallPosts'] });
    }
  });

  const postMutation = useMutation({
    mutationFn: async (content: string) => {
      await api.post('/wall', { device_id: deviceId, content });
    },
    onSuccess: () => {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setIsComposeVisible(false);
      setComposeText('');
      queryClient.invalidateQueries({ queryKey: ['wallPosts'] });
    }
  });

  const handlePost = () => {
    if (composeText.trim().length === 0) return;
    postMutation.mutate(composeText.trim());
  };

  const renderPost = ({ item, index }: { item: any; index: number }) => (
    <Animated.View entering={FadeInDown.delay(Math.min(index * 50, 500))} style={styles.postCard}>
      <View style={styles.postHeader}>
        <View style={styles.avatarPlaceholder}>
          <SymbolView name="person.fill" tintColor={colors.secondaryLabel} size={16} />
        </View>
        <View>
          <Text style={styles.authorText}>{item.author}</Text>
          <Text style={styles.timeText}>Just now</Text>
        </View>
      </View>
      <Text style={styles.postContent}>{item.content}</Text>
      
      <View style={styles.postActions}>
        <Pressable 
          style={styles.actionBtn} 
          onPress={() => likeMutation.mutate(item.id)}
        >
          <SymbolView 
            name={item.is_liked ? "heart.fill" : "heart"} 
            tintColor={item.is_liked ? "#EF4444" : colors.secondaryLabel} 
            size={20} 
          />
          <Text style={[styles.actionText, item.is_liked && { color: '#EF4444' }]}>
            {item.likes_count}
          </Text>
        </Pressable>
        <Pressable style={styles.actionBtn}>
          <SymbolView name="bubble.right" tintColor={colors.secondaryLabel} size={18} />
          <Text style={styles.actionText}>{item.comments_count}</Text>
        </Pressable>
      </View>
    </Animated.View>
  );

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.header} edges={['top']}>
        <Text style={styles.headerTitle}>PECverse Lounge</Text>
      </SafeAreaView>

      {isLoading ? (
        <ActivityIndicator style={{ marginTop: 40 }} color={colors.accent} />
      ) : (
        <FlatList
          data={data}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderPost}
          contentContainerStyle={[styles.listContent, { paddingBottom: insets.bottom + 100 }]}
          refreshing={isRefetching}
          onRefresh={refetch}
          ListHeaderComponent={
            <View style={{ marginBottom: 20 }}>
              <Text style={{ fontSize: 28, fontWeight: '800', color: colors.label, marginBottom: 8 }}>The Lounge ✨</Text>
              <Text style={{ fontSize: 15, color: colors.secondaryLabel, lineHeight: 22 }}>Welcome to the secret sauce. Share your excitement, ask questions, or just vibe with your batchmates. Everything here is pseudo-anonymous.</Text>
            </View>
          }
          ListEmptyComponent={
            <Text style={styles.emptyText}>No posts yet. Be the first to say hi!</Text>
          }
        />
      )}

      {/* FAB */}
      <Pressable 
        style={[styles.fab, { bottom: insets.bottom + 100 }]} 
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          setIsComposeVisible(true);
        }}
      >
        <SymbolView name="plus" tintColor="#FFFFFF" size={24} />
      </Pressable>

      {/* Compose Modal */}
      <Modal visible={isComposeVisible} animationType="slide" transparent>
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.modalOverlay}
        >
          <View style={[styles.composeContainer, { paddingBottom: insets.bottom || 24 }]}>
            <View style={styles.composeHeader}>
              <Pressable onPress={() => setIsComposeVisible(false)}>
                <Text style={styles.cancelText}>Cancel</Text>
              </Pressable>
              <Text style={styles.composeTitle}>New Post</Text>
              <Pressable 
                onPress={handlePost} 
                disabled={composeText.trim().length === 0 || postMutation.isPending}
              >
                <Text style={[styles.postText, composeText.trim().length === 0 && { opacity: 0.5 }]}>
                  Post
                </Text>
              </Pressable>
            </View>
            <TextInput
              style={styles.composeInput}
              placeholder="What's on your mind? (100% Anonymous)"
              placeholderTextColor={colors.secondaryLabel}
              multiline
              autoFocus
              maxLength={500}
              value={composeText}
              onChangeText={setComposeText}
            />
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.systemBackground,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: 'rgba(20, 20, 25, 0.9)',
    borderBottomWidth: 1,
    borderBottomColor: colors.cardBorder,
    zIndex: 10,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.label,
  },
  listContent: {
    padding: 16,
    gap: 16,
  },
  postCard: {
    backgroundColor: colors.cardBackground,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  avatarPlaceholder: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.secondarySystemBackground,
    justifyContent: 'center',
    alignItems: 'center',
  },
  authorText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.label,
  },
  timeText: {
    fontSize: 12,
    color: colors.secondaryLabel,
  },
  postContent: {
    fontSize: 15,
    color: colors.label,
    lineHeight: 22,
    marginBottom: 16,
  },
  postActions: {
    flexDirection: 'row',
    gap: 24,
    borderTopWidth: 1,
    borderTopColor: colors.cardBorder,
    paddingTop: 12,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.secondaryLabel,
  },
  emptyText: {
    textAlign: 'center',
    color: colors.secondaryLabel,
    marginTop: 40,
  },
  fab: {
    position: 'absolute',
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.accent,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  composeContainer: {
    backgroundColor: colors.cardBackgroundElevated,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    minHeight: 300,
  },
  composeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  cancelText: {
    fontSize: 16,
    color: colors.secondaryLabel,
  },
  composeTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.label,
  },
  postText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.accent,
  },
  composeInput: {
    flex: 1,
    fontSize: 18,
    color: colors.label,
    textAlignVertical: 'top',
  }
});
