export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      answer_cerq: {
        Row: {
          answer: number
          created_at: string
          id: string
          question_id: number
          user_id: string
        }
        Insert: {
          answer: number
          created_at?: string
          id?: string
          question_id: number
          user_id: string
        }
        Update: {
          answer?: number
          created_at?: string
          id?: string
          question_id?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "answer_cerq_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "questions_cerq"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "answer_cerq_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "userspub"
            referencedColumns: ["id"]
          },
        ]
      }
      calendar_journal: {
        Row: {
          content: string | null
          created_at: string | null
          emotion_id: string | null
          emotion_label: string | null
          entry_date: string | null
          id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          content?: string | null
          created_at?: string | null
          emotion_id?: string | null
          emotion_label?: string | null
          entry_date?: string | null
          id?: string
          updated_at?: string | null
          user_id?: string
        }
        Update: {
          content?: string | null
          created_at?: string | null
          emotion_id?: string | null
          emotion_label?: string | null
          entry_date?: string | null
          id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      chat_history: {
        Row: {
          conversation_id: string | null
          id: string
          message: string | null
          role: string | null
          timestamp: string | null
          user_id: string | null
        }
        Insert: {
          conversation_id?: string | null
          id?: string
          message?: string | null
          role?: string | null
          timestamp?: string | null
          user_id?: string | null
        }
        Update: {
          conversation_id?: string | null
          id?: string
          message?: string | null
          role?: string | null
          timestamp?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      conversation_state: {
        Row: {
          conversation_id: string
          state_json: Json | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          conversation_id: string
          state_json?: Json | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          conversation_id?: string
          state_json?: Json | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      emotion: {
        Row: {
          definition_eng: string | null
          definition_fr: string | null
          event: string | null
          event_fr: string | null
          face: string | null
          face_fr: string | null
          face_pic: string | null
          id: string
          name: string
          name_fr: string
          need: string | null
          need_fr: string | null
          physological: string | null
          physological_fr: string | null
          updated_at: string
          url_emotion: string | null
        }
        Insert: {
          definition_eng?: string | null
          definition_fr?: string | null
          event?: string | null
          event_fr?: string | null
          face?: string | null
          face_fr?: string | null
          face_pic?: string | null
          id: string
          name: string
          name_fr: string
          need?: string | null
          need_fr?: string | null
          physological?: string | null
          physological_fr?: string | null
          updated_at?: string
          url_emotion?: string | null
        }
        Update: {
          definition_eng?: string | null
          definition_fr?: string | null
          event?: string | null
          event_fr?: string | null
          face?: string | null
          face_fr?: string | null
          face_pic?: string | null
          id?: string
          name?: string
          name_fr?: string
          need?: string | null
          need_fr?: string | null
          physological?: string | null
          physological_fr?: string | null
          updated_at?: string
          url_emotion?: string | null
        }
        Relationships: []
      }
      emotion_usage_logs: {
        Row: {
          created_at: string
          id: string
          is_deleted: boolean
          need_id: string
          trigger_detail: string | null
          user_exercise_list: Json | null
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_deleted?: boolean
          need_id: string
          trigger_detail?: string | null
          user_exercise_list?: Json | null
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_deleted?: boolean
          need_id?: string
          trigger_detail?: string | null
          user_exercise_list?: Json | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "emotion_usage_logs_need_id_fkey"
            columns: ["need_id"]
            isOneToOne: false
            referencedRelation: "need"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "emotion_usage_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "userspub"
            referencedColumns: ["id"]
          },
        ]
      }
      exercise_duration: {
        Row: {
          created_at: string
          duration_ms: number | null
          exercise_id: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          duration_ms?: number | null
          exercise_id?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          duration_ms?: number | null
          exercise_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "exercise_duration_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "userspub"
            referencedColumns: ["id"]
          },
        ]
      }
      exercise_feedback: {
        Row: {
          created_at: string
          id: string
          mediation_id: string | null
          need_id: string | null
          rating: number
          review: string | null
          somatic_id: string | null
          therapist_exercise_id: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          mediation_id?: string | null
          need_id?: string | null
          rating: number
          review?: string | null
          somatic_id?: string | null
          therapist_exercise_id?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          mediation_id?: string | null
          need_id?: string | null
          rating?: number
          review?: string | null
          somatic_id?: string | null
          therapist_exercise_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "exercise_feedback_mediation_id_fkey"
            columns: ["mediation_id"]
            isOneToOne: false
            referencedRelation: "meditation"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "exercise_feedback_need_id_fkey"
            columns: ["need_id"]
            isOneToOne: false
            referencedRelation: "need"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "exercise_feedback_somatic_id_fkey"
            columns: ["somatic_id"]
            isOneToOne: false
            referencedRelation: "somantic"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "exercise_feedback_therapist_exercise_id_fkey"
            columns: ["therapist_exercise_id"]
            isOneToOne: false
            referencedRelation: "therapist_exercise"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "exercise_feedback_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "userspub"
            referencedColumns: ["id"]
          },
        ]
      }
      institution_settings: {
        Row: {
          contract_end_date: string
          created_at: string
          id: string
          institution_name: string
          subscription_plan: string
          total_seats: number
          updated_at: string
        }
        Insert: {
          contract_end_date: string
          created_at?: string
          id?: string
          institution_name: string
          subscription_plan: string
          total_seats: number
          updated_at?: string
        }
        Update: {
          contract_end_date?: string
          created_at?: string
          id?: string
          institution_name?: string
          subscription_plan?: string
          total_seats?: number
          updated_at?: string
        }
        Relationships: []
      }
      journal_answer: {
        Row: {
          created_at: string
          id: string
          journal: string
          log_id: string | null
          need_id: string
          prompt_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          journal: string
          log_id?: string | null
          need_id: string
          prompt_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          journal?: string
          log_id?: string | null
          need_id?: string
          prompt_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "journal_answer_log_id_fkey"
            columns: ["log_id"]
            isOneToOne: false
            referencedRelation: "emotion_usage_logs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "journal_answer_need_id_fkey"
            columns: ["need_id"]
            isOneToOne: false
            referencedRelation: "need"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "journal_answer_prompt_id_fkey"
            columns: ["prompt_id"]
            isOneToOne: false
            referencedRelation: "journal_prompt"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "journal_answer_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "userspub"
            referencedColumns: ["id"]
          },
        ]
      }
      journal_prompt: {
        Row: {
          id: string
          prompt_eng: string
          prompt_fr: string
          updated_at: string
        }
        Insert: {
          id?: string
          prompt_eng: string
          prompt_fr: string
          updated_at?: string
        }
        Update: {
          id?: string
          prompt_eng?: string
          prompt_fr?: string
          updated_at?: string
        }
        Relationships: []
      }
      meditation: {
        Row: {
          execise: string
          exercise_fr: string
          id: string
          scientific_proof: string
          title: string
          title_fr: string
          updated_at: string
          url_eng: string
          url_fr: string
        }
        Insert: {
          execise?: string
          exercise_fr: string
          id: string
          scientific_proof: string
          title: string
          title_fr: string
          updated_at?: string
          url_eng: string
          url_fr: string
        }
        Update: {
          execise?: string
          exercise_fr?: string
          id?: string
          scientific_proof?: string
          title?: string
          title_fr?: string
          updated_at?: string
          url_eng?: string
          url_fr?: string
        }
        Relationships: []
      }
      need: {
        Row: {
          emotion_id: string | null
          explanation: string | null
          explanation_fr: string | null
          id: string
          ikigai: boolean
          inner_child: boolean
          journal_prompts: string | null
          journal_prompts_fr: string | null
          meditation_exercise_id: string | null
          name: string | null
          name_fr: string | null
          resource_1: string | null
          resource_2: string | null
          self_care: boolean
          somantic_exercise_id: string | null
          trigger_id: string | null
          updated_at: string
        }
        Insert: {
          emotion_id?: string | null
          explanation?: string | null
          explanation_fr?: string | null
          id: string
          ikigai?: boolean
          inner_child?: boolean
          journal_prompts?: string | null
          journal_prompts_fr?: string | null
          meditation_exercise_id?: string | null
          name?: string | null
          name_fr?: string | null
          resource_1?: string | null
          resource_2?: string | null
          self_care?: boolean
          somantic_exercise_id?: string | null
          trigger_id?: string | null
          updated_at?: string
        }
        Update: {
          emotion_id?: string | null
          explanation?: string | null
          explanation_fr?: string | null
          id?: string
          ikigai?: boolean
          inner_child?: boolean
          journal_prompts?: string | null
          journal_prompts_fr?: string | null
          meditation_exercise_id?: string | null
          name?: string | null
          name_fr?: string | null
          resource_1?: string | null
          resource_2?: string | null
          self_care?: boolean
          somantic_exercise_id?: string | null
          trigger_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "need_emotion_id_fkey"
            columns: ["emotion_id"]
            isOneToOne: false
            referencedRelation: "emotion"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "need_meditation_exercise_id_fkey"
            columns: ["meditation_exercise_id"]
            isOneToOne: false
            referencedRelation: "meditation"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "need_somantic_exercise_id_fkey"
            columns: ["somantic_exercise_id"]
            isOneToOne: false
            referencedRelation: "somantic"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "need_trigger_id_fkey"
            columns: ["trigger_id"]
            isOneToOne: false
            referencedRelation: "trigger"
            referencedColumns: ["id"]
          },
        ]
      }
      need_journal_prompt_relationship: {
        Row: {
          created_at: string
          id: number
          need_id: string
          order: number
          prompt_id: string
        }
        Insert: {
          created_at?: string
          id?: number
          need_id: string
          order: number
          prompt_id: string
        }
        Update: {
          created_at?: string
          id?: number
          need_id?: string
          order?: number
          prompt_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "need_journal_prompt_relationship_need_id_fkey"
            columns: ["need_id"]
            isOneToOne: false
            referencedRelation: "need"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "need_journal_prompt_relationship_prompt_id_fkey"
            columns: ["prompt_id"]
            isOneToOne: false
            referencedRelation: "journal_prompt"
            referencedColumns: ["id"]
          },
        ]
      }
      need_therapist_exercise_relationship: {
        Row: {
          id: string
          need_id: string
          therapist_exercise_id: string
          updated_at: string
        }
        Insert: {
          id: string
          need_id: string
          therapist_exercise_id: string
          updated_at?: string
        }
        Update: {
          id?: string
          need_id?: string
          therapist_exercise_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "need_therapist_exercise_relationship_need_id_fkey"
            columns: ["need_id"]
            isOneToOne: false
            referencedRelation: "need"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "need_therapist_exercise_relationship_therapist_exercise_id_fkey"
            columns: ["therapist_exercise_id"]
            isOneToOne: false
            referencedRelation: "therapist_exercise"
            referencedColumns: ["id"]
          },
        ]
      }
      questions_cerq: {
        Row: {
          cat: string | null
          coefficient: number | null
          id: number
          order: number | null
          question_eng: string | null
          question_fr: string | null
        }
        Insert: {
          cat?: string | null
          coefficient?: number | null
          id?: number
          order?: number | null
          question_eng?: string | null
          question_fr?: string | null
        }
        Update: {
          cat?: string | null
          coefficient?: number | null
          id?: number
          order?: number | null
          question_eng?: string | null
          question_fr?: string | null
        }
        Relationships: []
      }
      resources_global: {
        Row: {
          category: string | null
          content_eng: string | null
          content_eng_html: string | null
          content_fr: string | null
          id: string
          order: number | null
          title_eng: string | null
          title_fr: string | null
        }
        Insert: {
          category?: string | null
          content_eng?: string | null
          content_eng_html?: string | null
          content_fr?: string | null
          id: string
          order?: number | null
          title_eng?: string | null
          title_fr?: string | null
        }
        Update: {
          category?: string | null
          content_eng?: string | null
          content_eng_html?: string | null
          content_fr?: string | null
          id?: string
          order?: number | null
          title_eng?: string | null
          title_fr?: string | null
        }
        Relationships: []
      }
      review_user: {
        Row: {
          category: string | null
          created_at: string | null
          id: number
          review: string | null
          screenshot: string | null
          user_id: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          id?: number
          review?: string | null
          screenshot?: string | null
          user_id?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string | null
          id?: number
          review?: string | null
          screenshot?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "review_user_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "userspub"
            referencedColumns: ["id"]
          },
        ]
      }
      somantic: {
        Row: {
          exercise: string | null
          exercise_fr: string | null
          id: string
          "scientific proof": string | null
          title: string | null
          title_fr: string | null
          updated_at: string | null
        }
        Insert: {
          exercise?: string | null
          exercise_fr?: string | null
          id: string
          "scientific proof"?: string | null
          title?: string | null
          title_fr?: string | null
          updated_at?: string | null
        }
        Update: {
          exercise?: string | null
          exercise_fr?: string | null
          id?: string
          "scientific proof"?: string | null
          title?: string | null
          title_fr?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      somatic_pics: {
        Row: {
          id: string
          order: number | null
          somantic_id: string | null
          url: string | null
        }
        Insert: {
          id: string
          order?: number | null
          somantic_id?: string | null
          url?: string | null
        }
        Update: {
          id?: string
          order?: number | null
          somantic_id?: string | null
          url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "somantic_pics_somantic_id_fkey"
            columns: ["somantic_id"]
            isOneToOne: false
            referencedRelation: "somantic"
            referencedColumns: ["id"]
          },
        ]
      }
      student_therapist_assignment: {
        Row: {
          assigned_at: string | null
          id: string
          notes: string | null
          student_id: string
          therapist_id: string
        }
        Insert: {
          assigned_at?: string | null
          id?: string
          notes?: string | null
          student_id: string
          therapist_id: string
        }
        Update: {
          assigned_at?: string | null
          id?: string
          notes?: string | null
          student_id?: string
          therapist_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "student_therapist_assignment_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: true
            referencedRelation: "userspub"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "student_therapist_assignment_therapist_id_fkey"
            columns: ["therapist_id"]
            isOneToOne: false
            referencedRelation: "therapist_team"
            referencedColumns: ["id"]
          },
        ]
      }
      therapist_exercise: {
        Row: {
          exercise: string | null
          exercise_fr: string | null
          id: string
          image: string | null
          notes: string | null
          title: string | null
          title_fr: string | null
          type: string | null
          updated_at: string | null
        }
        Insert: {
          exercise?: string | null
          exercise_fr?: string | null
          id: string
          image?: string | null
          notes?: string | null
          title?: string | null
          title_fr?: string | null
          type?: string | null
          updated_at?: string | null
        }
        Update: {
          exercise?: string | null
          exercise_fr?: string | null
          id?: string
          image?: string | null
          notes?: string | null
          title?: string | null
          title_fr?: string | null
          type?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      therapist_team: {
        Row: {
          created_at: string | null
          email: string
          first_name: string
          id: string
          last_name: string | null
          specialization: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          first_name: string
          id?: string
          last_name?: string | null
          specialization?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          first_name?: string
          id?: string
          last_name?: string | null
          specialization?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      trigger: {
        Row: {
          id: string
          name: string | null
          name_fr: string | null
          updated_at: string | null
        }
        Insert: {
          id: string
          name?: string | null
          name_fr?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          name?: string | null
          name_fr?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      university_portal_access_data: {
        Row: {
          access_level: string
          access_method: string
          created_at: string | null
          email: string
          first_name: string
          id: string
          invited_by: string | null
          shared_link: string | null
          updated_at: string | null
        }
        Insert: {
          access_level: string
          access_method?: string
          created_at?: string | null
          email: string
          first_name: string
          id?: string
          invited_by?: string | null
          shared_link?: string | null
          updated_at?: string | null
        }
        Update: {
          access_level?: string
          access_method?: string
          created_at?: string | null
          email?: string
          first_name?: string
          id?: string
          invited_by?: string | null
          shared_link?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      university_portal_student_data: {
        Row: {
          emotional_state: string | null
          last_emotion_identified: string | null
          status: string
          student_email: string
          student_first_name: string | null
          student_id: number
          student_last_name: string | null
          total_exercises_done: number | null
        }
        Insert: {
          emotional_state?: string | null
          last_emotion_identified?: string | null
          status: string
          student_email: string
          student_first_name?: string | null
          student_id?: number
          student_last_name?: string | null
          total_exercises_done?: number | null
        }
        Update: {
          emotional_state?: string | null
          last_emotion_identified?: string | null
          status?: string
          student_email?: string
          student_first_name?: string | null
          student_id?: number
          student_last_name?: string | null
          total_exercises_done?: number | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      userspub: {
        Row: {
          created_at: string | null
          email: string | null
          first_name: string | null
          id: string
          last_name: string | null
          profile_pic: string | null
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          first_name?: string | null
          id: string
          last_name?: string | null
          profile_pic?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          profile_pic?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      bytea_to_text: { Args: { data: string }; Returns: string }
      delete_user_everything: { Args: { target: string }; Returns: undefined }
      get_students_overview: {
        Args: never
        Returns: {
          created_at: string
          email: string
          emotional_state: string
          first_name: string
          improvement_questionnaire: string
          last_emotion_identified: string
          last_name: string
          status: string
          total_exercises_done: number
          user_id: string
        }[]
      }
      get_students_under_care: {
        Args: never
        Returns: {
          assigned_therapist_id: string
          assigned_therapist_name: string
          created_at: string
          email: string
          emotional_state: string
          first_name: string
          last_emotion_identified: string
          last_name: string
          meeting_status: string
          questionnaire_category: string
          questionnaire_score: number
          user_id: string
        }[]
      }
      get_therapeutic_engagement_growth: {
        Args: { weeks_back?: number }
        Returns: {
          assessment_count: number
          exercise_count: number
          journal_count: number
          total_activities: number
          unique_users: number
          week_end: string
          week_start: string
        }[]
      }
      get_therapist_team: {
        Args: never
        Returns: {
          created_at: string
          email: string
          first_name: string
          id: string
          last_name: string
          specialization: string
        }[]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      http: {
        Args: { request: Database["public"]["CompositeTypes"]["http_request"] }
        Returns: Database["public"]["CompositeTypes"]["http_response"]
        SetofOptions: {
          from: "http_request"
          to: "http_response"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      http_delete:
        | {
            Args: { uri: string }
            Returns: Database["public"]["CompositeTypes"]["http_response"]
            SetofOptions: {
              from: "*"
              to: "http_response"
              isOneToOne: true
              isSetofReturn: false
            }
          }
        | {
            Args: { content: string; content_type: string; uri: string }
            Returns: Database["public"]["CompositeTypes"]["http_response"]
            SetofOptions: {
              from: "*"
              to: "http_response"
              isOneToOne: true
              isSetofReturn: false
            }
          }
      http_get:
        | {
            Args: { uri: string }
            Returns: Database["public"]["CompositeTypes"]["http_response"]
            SetofOptions: {
              from: "*"
              to: "http_response"
              isOneToOne: true
              isSetofReturn: false
            }
          }
        | {
            Args: { data: Json; uri: string }
            Returns: Database["public"]["CompositeTypes"]["http_response"]
            SetofOptions: {
              from: "*"
              to: "http_response"
              isOneToOne: true
              isSetofReturn: false
            }
          }
      http_head: {
        Args: { uri: string }
        Returns: Database["public"]["CompositeTypes"]["http_response"]
        SetofOptions: {
          from: "*"
          to: "http_response"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      http_header: {
        Args: { field: string; value: string }
        Returns: Database["public"]["CompositeTypes"]["http_header"]
        SetofOptions: {
          from: "*"
          to: "http_header"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      http_list_curlopt: {
        Args: never
        Returns: {
          curlopt: string
          value: string
        }[]
      }
      http_patch: {
        Args: { content: string; content_type: string; uri: string }
        Returns: Database["public"]["CompositeTypes"]["http_response"]
        SetofOptions: {
          from: "*"
          to: "http_response"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      http_post:
        | {
            Args: { content: string; content_type: string; uri: string }
            Returns: Database["public"]["CompositeTypes"]["http_response"]
            SetofOptions: {
              from: "*"
              to: "http_response"
              isOneToOne: true
              isSetofReturn: false
            }
          }
        | {
            Args: { data: Json; uri: string }
            Returns: Database["public"]["CompositeTypes"]["http_response"]
            SetofOptions: {
              from: "*"
              to: "http_response"
              isOneToOne: true
              isSetofReturn: false
            }
          }
      http_put: {
        Args: { content: string; content_type: string; uri: string }
        Returns: Database["public"]["CompositeTypes"]["http_response"]
        SetofOptions: {
          from: "*"
          to: "http_response"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      http_reset_curlopt: { Args: never; Returns: boolean }
      http_set_curlopt: {
        Args: { curlopt: string; value: string }
        Returns: boolean
      }
      text_to_bytea: { Args: { data: string }; Returns: string }
      urlencode:
        | { Args: { data: Json }; Returns: string }
        | {
            Args: { string: string }
            Returns: {
              error: true
            } & "Could not choose the best candidate function between: public.urlencode(string => bytea), public.urlencode(string => varchar). Try renaming the parameters or the function itself in the database so function overloading can be resolved"
          }
        | {
            Args: { string: string }
            Returns: {
              error: true
            } & "Could not choose the best candidate function between: public.urlencode(string => bytea), public.urlencode(string => varchar). Try renaming the parameters or the function itself in the database so function overloading can be resolved"
          }
    }
    Enums: {
      app_role: "owner" | "admin" | "therapist" | "viewer"
    }
    CompositeTypes: {
      http_header: {
        field: string | null
        value: string | null
      }
      http_request: {
        method: unknown
        uri: string | null
        headers: Database["public"]["CompositeTypes"]["http_header"][] | null
        content_type: string | null
        content: string | null
      }
      http_response: {
        status: number | null
        content_type: string | null
        headers: Database["public"]["CompositeTypes"]["http_header"][] | null
        content: string | null
      }
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["owner", "admin", "therapist", "viewer"],
    },
  },
} as const
