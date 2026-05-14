import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface EmotionData {
  emotion: string;
  count: number;
  percentage: number;
}

export const useEmotionDistribution = (userIds?: string[] | null) => {
  const [data, setData] = useState<EmotionData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (userIds === undefined) return;
    fetchEmotionData();
  }, [userIds?.join(',')]);

  const fetchEmotionData = async () => {
    setIsLoading(true);

    if (userIds && userIds.length === 0) {
      setData([]);
      setIsLoading(false);
      return;
    }

    try {
      let logsQuery = supabase
        .schema("public")
        .from("emotion_usage_logs")
        .select("need_id")
        .eq("is_deleted", false);

      if (userIds && userIds.length > 0) {
        logsQuery = logsQuery.in("user_id", userIds);
      }

      const { data: emotionLogs, error: logsError } = await logsQuery;
      if (logsError) throw logsError;

      const { data: needs, error: needsError } = await supabase
        .schema("public")
        .from("need")
        .select("id, emotion_id");
      if (needsError) throw needsError;

      const { data: emotions, error: emotionsError } = await supabase
        .schema("public")
        .from("emotion")
        .select("id, name");
      if (emotionsError) throw emotionsError;

      const emotionCounts: Record<string, number> = {};
      const emotionMap = new Map(emotions?.map((e) => [e.id, e.name]) || []);
      const needMap = new Map(needs?.map((n) => [n.id, n.emotion_id]) || []);

      emotionLogs?.forEach((log) => {
        const emotionId = needMap.get(log.need_id);
        const emotionName = emotionId ? emotionMap.get(emotionId) || "Unknown" : "Unknown";
        emotionCounts[emotionName] = (emotionCounts[emotionName] || 0) + 1;
      });

      const total = emotionLogs?.length || 0;
      const emotionData = Object.entries(emotionCounts)
        .map(([emotion, count]) => ({
          emotion,
          count,
          percentage: total > 0 ? parseFloat(((count / total) * 100).toFixed(1)) : 0,
        }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 3);

      setData(emotionData);
    } catch (err) {
      console.error("Error fetching emotion distribution:", err);
      setData([]);
    } finally {
      setIsLoading(false);
    }
  };

  return { data, isLoading };
};
