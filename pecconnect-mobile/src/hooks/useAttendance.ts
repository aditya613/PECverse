import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/utils/api';

export interface AttendanceLog {
  id: number;
  user_id: number;
  attendance_subject_id: number;
  type: 'attended' | 'bunked';
  created_at: string;
}

export interface AttendanceSubject {
  id: number;
  user_id: number;
  name: string;
  attended_classes: number;
  bunked_classes: number;
  target_percentage: number;
  created_at: string;
  logs?: AttendanceLog[];
}

export const useAttendance = () => {
  const queryClient = useQueryClient();

  const { data: subjects, isLoading } = useQuery({
    queryKey: ['attendance'],
    queryFn: async () => {
      const { data } = await api.get('/attendance');
      return data as AttendanceSubject[];
    }
  });

  const addSubject = useMutation({
    mutationFn: async (name: string) => {
      const { data } = await api.post('/attendance', { name, target_percentage: 75 });
      return data as AttendanceSubject;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['attendance'] });
    }
  });

  const deleteSubject = useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/attendance/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['attendance'] });
    }
  });

  const updateSubject = useMutation({
    mutationFn: async ({ id, name, target_percentage }: { id: number; name?: string; target_percentage?: number }) => {
      const { data } = await api.patch(`/attendance/${id}`, { name, target_percentage });
      return data as AttendanceSubject;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['attendance'] });
    }
  });

  const resetSubjectStats = useMutation({
    mutationFn: async (id: number) => {
      const { data } = await api.post(`/attendance/${id}/reset`);
      return data as AttendanceSubject;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['attendance'] });
    }
  });

  const deleteLog = useMutation({
    mutationFn: async (logId: number) => {
      const { data } = await api.delete(`/attendance/log/${logId}`);
      return data as AttendanceSubject; // returns updated subject
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['attendance'] });
    }
  });

  const updateLog = useMutation({
    mutationFn: async ({ id, type }: { id: number; type: 'attended' | 'bunked' }) => {
      const { data } = await api.patch(`/attendance/${id}/log`, { type });
      return data as AttendanceSubject;
    },
    onMutate: async ({ id, type }) => {
      await queryClient.cancelQueries({ queryKey: ['attendance'] });
      const previous = queryClient.getQueryData<AttendanceSubject[]>(['attendance']);

      // Optimistic update
      if (previous) {
        queryClient.setQueryData<AttendanceSubject[]>(['attendance'], old => {
          if (!old) return [];
          return old.map(sub => {
            if (sub.id === id) {
              return {
                ...sub,
                attended_classes: type === 'attended' ? sub.attended_classes + 1 : sub.attended_classes,
                bunked_classes: type === 'bunked' ? sub.bunked_classes + 1 : sub.bunked_classes,
              };
            }
            return sub;
          });
        });
      }
      return { previous };
    },
    onError: (err, variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(['attendance'], context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['attendance'] });
    }
  });

  return {
    subjects,
    isLoading,
    addSubject,
    deleteSubject,
    updateSubject,
    resetSubjectStats,
    updateLog,
    deleteLog
  };
};
