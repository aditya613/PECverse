import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/utils/api';
import { useAuthStore } from '@/stores/useAuthStore';
import * as Haptics from 'expo-haptics';

export interface Club {
  id: number;
  name: string;
  code: string;
  category: 'Technical' | 'Cultural' | 'Sports' | 'Social';
  description: string;
  long_description?: string;
  faculty_advisor?: string;
  join_link?: string;
  website_link?: string;
  members_count: number;
  icon_name: string;
  color: string;
  instagram_handle?: string;
  is_joined: boolean;
}

export function useClubs(category: string = 'All') {
  const queryClient = useQueryClient();
  const user = useAuthStore(state => state.user);

  const { data, isLoading, refetch, isRefetching } = useQuery({
    queryKey: ['clubs', category, user?.id],
    queryFn: async () => {
      const params: any = { category };
      const res = await api.get('/clubs', { params });
      return res.data.clubs as Club[];
    },
  });

  const toggleJoinMutation = useMutation({
    mutationFn: async (clubId: number) => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      const res = await api.post(`/clubs/${clubId}/toggle-join`);
      return res.data;
    },
    onSuccess: () => {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      queryClient.invalidateQueries({ queryKey: ['clubs'] });
    },
  });

  return {
    clubs: data || [],
    isLoading,
    refetch,
    isRefetching,
    toggleJoin: (clubId: number) => toggleJoinMutation.mutate(clubId),
    isToggling: toggleJoinMutation.isPending,
  };
}
