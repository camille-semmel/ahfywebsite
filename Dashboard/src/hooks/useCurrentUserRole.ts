import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface UserRoleInfo {
  role: string;
  house: string | null;
  isHouseCaptain: boolean;
}

export const useCurrentUserRole = () => {
  return useQuery({
    queryKey: ['current-user-role'],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_current_user_role_info');
      if (error) throw error;
      const row = (data as { role: string; house: string | null }[] | null)?.[0];
      return {
        role: row?.role ?? 'viewer',
        house: row?.house ?? null,
        isHouseCaptain: row?.role === 'house_captain',
      } as UserRoleInfo;
    },
    staleTime: 5 * 60 * 1000,
  });
};
