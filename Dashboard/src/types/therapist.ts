export interface TherapistTeamMember {
  id: string;
  first_name: string;
  last_name: string | null;
  email: string;
  specialization: string | null;
  created_at: string;
}

export interface StudentUnderCare {
  user_id: string;
  email: string;
  first_name: string;
  last_name: string;
  last_emotion_identified: string;
  emotional_state: 'critical' | 'moderate' | 'good';
  assigned_therapist_id: string | null;
  assigned_therapist_name: string | null;
  meeting_status: 'scheduled' | 'in queue';
  questionnaire_score: number;
  questionnaire_category: string;
  created_at: string;
}

export interface TherapistKPIs {
  needingAttention: number;
  scheduled: number;
}
