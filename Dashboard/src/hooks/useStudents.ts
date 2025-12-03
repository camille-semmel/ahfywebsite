import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { StudentOverview } from '@/types/students';

export const useStudents = () => {
  return useQuery({
    queryKey: ['students-overview'],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_students_overview');
      
      if (error) {
        console.error('Error fetching students:', error);
        throw error;
      }
      
      return data as StudentOverview[];
    },
    refetchInterval: 30000, // Refresh every 30 seconds for real-time updates
  });
};
