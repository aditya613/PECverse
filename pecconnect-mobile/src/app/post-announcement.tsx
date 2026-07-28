import { View, Text, StyleSheet, TextInput, Pressable, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { colors } from '@/theme/colors';
import { GlassView } from 'expo-glass-effect';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/utils/api';
import * as Haptics from 'expo-haptics';

export default function PostAnnouncementScreen() {
  const router = useRouter();
  const queryClient = useQueryClient();
  
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');

  const mutation = useMutation({
    mutationFn: async (newPost: { title: string; body: string; class_id?: number | null }) => {
      // Send to backend
      const res = await api.post('/announcements', newPost);
      return res.data;
    },
    onMutate: async (newPost) => {
      // Optimistic Update
      await queryClient.cancelQueries({ queryKey: ['announcements'] });
      const previous = queryClient.getQueryData(['announcements']);
      
      // Inject dummy id and current time so UI updates instantly
      const optimisticPost = {
        id: Math.random(),
        ...newPost,
        created_at: new Date().toISOString(),
        author: {
          name: 'You (Posting...)',
          profile_photo: null,
        }
      };

      queryClient.setQueryData(['announcements'], (old: any) => [optimisticPost, ...(old || [])]);
      
      return { previous };
    },
    onError: (err, newPost, context) => {
      // Rollback on error
      if (context?.previous) {
        queryClient.setQueryData(['announcements'], context.previous);
      }
      alert('Failed to post announcement.');
    },
    onSettled: () => {
      // Sync with real server data
      queryClient.invalidateQueries({ queryKey: ['announcements'] });
    },
    onSuccess: () => {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      router.back();
    }
  });

  const handlePost = () => {
    if (!title.trim() || !body.trim()) {
      alert("Please enter a title and message.");
      return;
    }
    
    // Trigger mutation
    mutation.mutate({
      title: title.trim(),
      body: body.trim(),
      // class_id: null // Assuming CRs post to their own class automatically per our backend logic
    });
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <GlassView style={StyleSheet.absoluteFill} colorScheme="dark" />
      
      <View style={styles.container}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.cancelBtn}>
            <Text style={styles.cancelText}>Cancel</Text>
          </Pressable>
          <Text style={styles.headerTitle}>New Post</Text>
          <Pressable 
            onPress={handlePost} 
            disabled={mutation.isPending}
            style={[styles.postBtn, (!title || !body) && { opacity: 0.5 }]}
          >
            {mutation.isPending ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Text style={styles.postText}>Post</Text>
            )}
          </Pressable>
        </View>

        <TextInput
          style={styles.titleInput}
          placeholder="Title"
          placeholderTextColor={colors.secondaryLabel as string}
          value={title}
          onChangeText={setTitle}
          autoFocus
        />
        
        <View style={styles.divider} />
        
        <TextInput
          style={styles.bodyInput}
          placeholder="What's happening in class?"
          placeholderTextColor={colors.secondaryLabel as string}
          value={body}
          onChangeText={setBody}
          multiline
          textAlignVertical="top"
        />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  cancelBtn: {
    padding: 8,
  },
  cancelText: {
    color: colors.secondaryLabel as string,
    fontSize: 16,
  },
  postBtn: {
    backgroundColor: colors.accent as string,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  postText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  titleInput: {
    fontSize: 28,
    fontWeight: '800',
    color: '#fff',
    marginBottom: 16,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.1)',
    marginBottom: 16,
  },
  bodyInput: {
    flex: 1,
    fontSize: 18,
    color: '#fff',
    lineHeight: 28,
  },
});
