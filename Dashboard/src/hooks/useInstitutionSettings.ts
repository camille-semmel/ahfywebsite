import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface InstitutionSettings {
  id: string;
  institution_name: string;
  total_seats: number;
  contract_end_date: string;
  subscription_plan: string;
  created_at: string;
  updated_at: string;
}

export const useInstitutionSettings = () => {
  return useQuery({
    queryKey: ["institution-settings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .schema("public")
        .from("institution_settings")
        .select("*")
        .single();

      if (error) throw error;
      return data as InstitutionSettings;
    },
  });
};
