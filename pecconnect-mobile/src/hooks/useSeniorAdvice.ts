import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/utils/api';
import { useFresherStore } from '@/stores/useFresherStore';
import * as Haptics from 'expo-haptics';

export interface SeniorAdviceItem {
  id: number;
  title: string;
  category: string;
  content: string;
  author_name: string;
  author_batch: string;
  likes_count: number;
}

export function useSeniorAdvice(category: string = 'All') {
  const queryClient = useQueryClient();
  const { deviceId } = useFresherStore();

  const { data, isLoading, refetch, isRefetching } = useQuery({
    queryKey: ['seniorAdvice', category],
    queryFn: async () => {
      const params: any = { category };
      const res = await api.get('/senior-advice', { params });
      return res.data.advices as SeniorAdviceItem[];
    },
  });

  const likeMutation = useMutation({
    mutationFn: async (adviceId: number) => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      const res = await api.post(`/senior-advice/${adviceId}/like`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['seniorAdvice'] });
    },
  });

  const askQuestionMutation = useMutation({
    mutationFn: async (question: string) => {
      const res = await api.post('/senior-advice/questions', {
        question,
        device_id: deviceId,
      });
      return res.data;
    },
    onSuccess: () => {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    },
  });

  return {
    advices: data || [],
    isLoading,
    refetch,
    isRefetching,
    likeAdvice: (id: number) => likeMutation.mutate(id),
    askQuestion: (question: string) => askQuestionMutation.mutateAsync(question),
    isSubmittingQuestion: askQuestionMutation.isPending,
  };
}
