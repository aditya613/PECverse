import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { api } from '@/utils/api';
import { useAuthStore } from '@/stores/useAuthStore';
import { MergedClass } from '@/components/timetable/ClassCard';

export interface TimetableRow {
  id: number;
  class_id: number;
  type: 'weekly' | 'single' | 'cancelled' | 'rescheduled';
  day_of_week: number | null;
  date: string | null;
  original_timetable_id: number | null;
  period_no: number | null;
  start_time: string;
  end_time: string;
  subject: string;
  teacher: string | null;
  room: string | null;
  reason: string | null;
}

export function useTimetable(targetDate: string) {
  const user = useAuthStore(state => state.user);

  const { data, isLoading, refetch, isRefetching } = useQuery({
    queryKey: ['timetables'],
    queryFn: async () => {
      const res = await api.get('/timetables');
      return res.data as TimetableRow[];
    },
    enabled: !!user?.class_id,
  });

  const mergedClasses = useMemo(() => {
    if (!data || !Array.isArray(data)) return [];
    
    // Convert YYYY-MM-DD to a Date object to extract the day of the week
    const targetDateObj = new Date(targetDate);
    let targetDayOfWeek = targetDateObj.getDay();
    if (targetDayOfWeek === 0) targetDayOfWeek = 7; // Convert Sunday(0) to 7 to match our DB (1-Mon, 7-Sun)
    
    // 1. Get base weekly classes for this day
    const weeklyClasses = data.filter(t => t.type === 'weekly' && t.day_of_week === targetDayOfWeek);
    
    // 2. Get any specific row for this exact date (single, cancelled, rescheduled)
    const dateSpecificRows = data.filter(t => t.date && t.date.startsWith(targetDate));
    
    const merged: MergedClass[] = [];

    // Process weekly classes
    weeklyClasses.forEach(cls => {
      // Find if there is an override for this specific base class on this date
      const override = dateSpecificRows.find(e => e.original_timetable_id === cls.id);
      
      if (override) {
        if (override.type === 'cancelled') {
          merged.push({
            id: `reg-${cls.id}`,
            start_time: cls.start_time,
            end_time: cls.end_time,
            subject: cls.subject,
            teacher: cls.teacher,
            room: cls.room,
            status: 'cancelled',
            reason: override.reason
          });
        }
      } else {
        // Normal class
        merged.push({
          id: `reg-${cls.id}`,
          start_time: cls.start_time,
          end_time: cls.end_time,
          subject: cls.subject,
          teacher: cls.teacher,
          room: cls.room,
          status: 'normal'
        });
      }
    });

    // 3. Add any single/extra classes scheduled for this date
    const extraClasses = dateSpecificRows.filter(t => t.type === 'single');
    extraClasses.forEach(cls => {
      const override = dateSpecificRows.find(t => t.original_timetable_id === cls.id);
      
      if (override) {
        if (override.type === 'cancelled') {
          merged.push({
            id: `ext-${cls.id}`,
            start_time: cls.start_time,
            end_time: cls.end_time,
            subject: cls.subject,
            teacher: cls.teacher,
            room: cls.room,
            status: 'cancelled',
            reason: override.reason
          });
        }
      } else {
        merged.push({
          id: `ext-${cls.id}`,
          start_time: cls.start_time,
          end_time: cls.end_time,
          subject: cls.subject,
          teacher: cls.teacher,
          room: cls.room,
          status: 'extra',
          reason: cls.reason
        });
      }
    });

    // 4. Sort by start_time
    merged.sort((a, b) => a.start_time.localeCompare(b.start_time));

    // 5. Determine active/next classes
    const now = new Date();
    // Only highlight active classes if targetDate is today in local device time
    const localYear = now.getFullYear();
    const localMonth = String(now.getMonth() + 1).padStart(2, '0');
    const localDay = String(now.getDate()).padStart(2, '0');
    const todayLocalStr = `${localYear}-${localMonth}-${localDay}`;
    
    const isToday = targetDate === todayLocalStr;
    
    if (isToday) {
      const currentMinutes = now.getHours() * 60 + now.getMinutes();
      
      let foundActive = false;
      for (let i = 0; i < merged.length; i++) {
        const cls = merged[i];
        if (cls.status === 'cancelled') continue;
        
        const [startH, startM] = cls.start_time.split(':').map(Number);
        const [endH, endM] = cls.end_time.split(':').map(Number);
        const startMinutes = (startH || 0) * 60 + (startM || 0);
        const endMinutes = (endH || 0) * 60 + (endM || 0);
        
        // If current minutes is between start and end, it's active right NOW
        if (currentMinutes >= startMinutes && currentMinutes < endMinutes) {
          cls.isActive = true;
          foundActive = true;
          break; // Only one active class at a time
        }
      }

      // If no class is currently active, highlight the NEXT upcoming class
      if (!foundActive) {
        for (let i = 0; i < merged.length; i++) {
          const cls = merged[i];
          if (cls.status === 'cancelled') continue;
          
          const [startH, startM] = cls.start_time.split(':').map(Number);
          const startMinutes = (startH || 0) * 60 + (startM || 0);

          if (startMinutes > currentMinutes) {
            cls.isNext = true;
            break;
          }
        }
      }
    }

    return merged;
  }, [data, targetDate]);

  return {
    classes: mergedClasses,
    isLoading,
    isRefetching,
    refetch
  };
}
