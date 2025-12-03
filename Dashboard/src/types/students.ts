export interface StudentOverview {
  user_id?: string;
  email?: string;
  first_name?: string;
  last_name?: string;
  status?: 'invited' | 'downloaded';
  last_emotion_identified?: string;
  emotional_state?: 'critical' | 'moderate' | 'good';
  total_exercises_done?: number;
  improvement_questionnaire?: 'Completed' | 'In Progress' | 'Pending';
  created_at?: string;
}
