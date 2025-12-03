import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { TherapistTeamMember, StudentUnderCare } from '@/types/therapist';
import { toast } from 'sonner';

export const useTherapistTeam = () => {
  return useQuery({
    queryKey: ['therapist-team'],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_therapist_team');
      
      if (error) {
        console.error('Error fetching therapist team:', error);
        throw error;
      }
      
      return data as TherapistTeamMember[];
    },
  });
};

export const useStudentsUnderCare = () => {
  return useQuery({
    queryKey: ['students-under-care'],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_students_under_care');
      
      if (error) {
        console.error('Error fetching students under care:', error);
        throw error;
      }
      
      return data as StudentUnderCare[];
    },
    refetchInterval: 30000,
  });
};

export const useAddTherapist = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ 
      firstName, 
      lastName, 
      email,
      specialization 
    }: { 
      firstName: string; 
      lastName?: string;
      email: string;
      specialization?: string;
    }) => {
      const { data, error } = await supabase
        .from('therapist_team')
        .insert({
          first_name: firstName,
          last_name: lastName || null,
          email: email,
          specialization: specialization || null,
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['therapist-team'] });
      toast.success('Therapist added successfully!');
    },
    onError: (error: any) => {
      if (error.code === '23505') {
        toast.error('This email is already registered.');
      } else {
        toast.error(`Failed to add therapist: ${error.message}`);
      }
    },
  });
};

export const useDeleteTherapist = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (therapistId: string) => {
      const { error } = await supabase
        .from('therapist_team')
        .delete()
        .eq('id', therapistId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['therapist-team'] });
      queryClient.invalidateQueries({ queryKey: ['students-under-care'] });
      toast.success('Therapist removed from team');
    },
    onError: (error: any) => {
      toast.error(`Failed to remove therapist: ${error.message}`);
    },
  });
};

export const useAssignTherapist = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ studentId, therapistId }: { studentId: string; therapistId: string }) => {
      const { data, error } = await supabase
        .from('student_therapist_assignment')
        .upsert({
          student_id: studentId,
          therapist_id: therapistId,
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students-under-care'] });
      toast.success('Therapist assigned successfully!');
    },
    onError: (error: any) => {
      toast.error(`Failed to assign therapist: ${error.message}`);
    },
  });
};
