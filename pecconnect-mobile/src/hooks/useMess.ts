import { useQuery } from '@tanstack/react-query';
import { api } from '@/utils/api';

export interface Mess {
  id: number;
  name: string;
}

export interface MessMenu {
  id: number;
  mess_id: number;
  day_of_week: number;
  items: string;
}

export function useMesses() {
  return useQuery({
    queryKey: ['messes'],
    queryFn: async () => {
      const { data } = await api.get<Mess[]>('/mess');
      return data;
    },
  });
}

export function useMessMenu(messId: number | null) {
  return useQuery({
    queryKey: ['mess-menu', messId],
    queryFn: async () => {
      if (!messId) return [];
      const { data } = await api.get<MessMenu[]>('/mess/menu', {
        params: { mess_id: messId }
      });
      return data;
    },
    enabled: !!messId,
  });
}
