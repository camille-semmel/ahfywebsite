import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

export type WeeklyEngagement = {
  week_start: string;
  week_end: string;
  total_activities: number;
  exercise_count: number;
  journal_count: number;
  assessment_count: number;
  unique_users: number;
};

export type EngagementGrowthData = {
  currentWeek: WeeklyEngagement | null;
  previousWeek: WeeklyEngagement | null;
  weeklyTrend: WeeklyEngagement[];
  growthPercentage: number;
  isGrowing: boolean;
};

// Fetch from database function
export async function fetchTherapeuticEngagement(
  weeksBack: number = 6
): Promise<WeeklyEngagement[]> {
  const { data, error } = await supabase.rpc(
    "get_therapeutic_engagement_growth",
    { weeks_back: weeksBack }
  );

  if (error) throw error;
  return data || [];
}

// Calculate growth metrics
export function calculateEngagementGrowth(
  weeklyData: WeeklyEngagement[]
): EngagementGrowthData {
  if (weeklyData.length < 2) {
    return {
      currentWeek: weeklyData[0] || null,
      previousWeek: null,
      weeklyTrend: weeklyData,
      growthPercentage: 0,
      isGrowing: false,
    };
  }

  const currentWeek = weeklyData[0];
  const previousWeek = weeklyData[1];

  const growthPercentage =
    previousWeek.total_activities > 0
      ? Math.round(
          ((currentWeek.total_activities - previousWeek.total_activities) /
            previousWeek.total_activities) *
            100
        )
      : 0;

  return {
    currentWeek,
    previousWeek,
    weeklyTrend: weeklyData,
    growthPercentage,
    isGrowing: growthPercentage > 0,
  };
}

// React Query hook
export function useTherapeuticEngagementGrowth() {
  return useQuery({
    queryKey: ["therapeutic-engagement-growth"],
    queryFn: async () => {
      const weeklyData = await fetchTherapeuticEngagement(6);
      return calculateEngagementGrowth(weeklyData);
    },
    refetchInterval: 60000,
    staleTime: 30000,
  });
}
