import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface EngagementData {
  label: string;
  count: number;
  percentage: number;
}

export const useActiveEngagements = (userIds?: string[] | null) => {
  const [data, setData] = useState<EngagementData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (userIds === undefined) return;
    fetchEngagementData();
  }, [userIds?.join(',')]);

  const fetchEngagementData = async () => {
    setIsLoading(true);

    if (userIds && userIds.length === 0) {
      setData([]);
      setIsLoading(false);
      return;
    }

    try {
      let feedbackQuery = supabase
        .schema("public")
        .from("exercise_feedback")
        .select("user_id");

      if (userIds && userIds.length > 0) {
        feedbackQuery = feedbackQuery.in("user_id", userIds);
      }

      const { data: feedbackData, error: feedbackError } = await feedbackQuery;
      if (feedbackError) throw feedbackError;

      let emotionQuery = supabase
        .schema("public")
        .from("emotion_usage_logs")
        .select("user_id")
        .eq("is_deleted", false);

      if (userIds && userIds.length > 0) {
        emotionQuery = emotionQuery.in("user_id", userIds);
      }

      const { data: emotionData, error: emotionError } = await emotionQuery;
      if (emotionError) throw emotionError;

      const therapySessions = feedbackData?.length || 0;
      const selfAssessments = emotionData?.length || 0;
      const resourcesAccessed = therapySessions + selfAssessments;

      const maxValue = Math.max(therapySessions, selfAssessments, resourcesAccessed);

      const engagements: EngagementData[] = [
        {
          label: "Therapy sessions",
          count: therapySessions,
          percentage: maxValue > 0 ? (therapySessions / maxValue) * 100 : 0,
        },
        {
          label: "Self-assessments",
          count: selfAssessments,
          percentage: maxValue > 0 ? (selfAssessments / maxValue) * 100 : 0,
        },
        {
          label: "Resources accessed",
          count: resourcesAccessed,
          percentage: maxValue > 0 ? (resourcesAccessed / maxValue) * 100 : 0,
        },
      ];

      setData(engagements);
    } catch (err) {
      console.error("Error fetching engagement data:", err);
      setData([]);
    } finally {
      setIsLoading(false);
    }
  };

  return { data, isLoading };
};
