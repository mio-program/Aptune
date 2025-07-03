export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          created_at: string
          updated_at: string
          profile_completed: boolean
          stripe_customer_id: string | null
          subscription_status: string
          subscription_id: string | null
          subscription_end_date: string | null
          premium_assessment_purchased: boolean
        }
        Insert: {
          id?: string
          email: string
          created_at?: string
          updated_at?: string
          profile_completed?: boolean
          stripe_customer_id?: string | null
          subscription_status?: string
          subscription_id?: string | null
          subscription_end_date?: string | null
          premium_assessment_purchased?: boolean
        }
        Update: {
          id?: string
          email?: string
          created_at?: string
          updated_at?: string
          profile_completed?: boolean
          stripe_customer_id?: string | null
          subscription_status?: string
          subscription_id?: string | null
          subscription_end_date?: string | null
          premium_assessment_purchased?: boolean
        }
      }
      assessments: {
        Row: {
          id: string
          user_id: string
          stage: number
          answers: any | null
          main_type: any | null
          ai_adaptation_style: any | null
          learning_driver: any | null
          final_archetype: any | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          stage: number
          answers?: any | null
          main_type?: any | null
          ai_adaptation_style?: any | null
          learning_driver?: any | null
          final_archetype?: any | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          stage?: number
          answers?: any | null
          main_type?: any | null
          ai_adaptation_style?: any | null
          learning_driver?: any | null
          final_archetype?: any | null
          created_at?: string
          updated_at?: string
        }
      }
      user_profiles: {
        Row: {
          id: string
          user_id: string
          full_name: string
          current_role: string
          experience_years: number
          skills: string[]
          industry: string
          education: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          full_name: string
          current_role: string
          experience_years: number
          skills: string[]
          industry: string
          education: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          full_name?: string
          current_role?: string
          experience_years?: number
          skills?: string[]
          industry?: string
          education?: string
          created_at?: string
          updated_at?: string
        }
      }
      payments: {
        Row: {
          id: string
          user_id: string
          stripe_payment_intent_id: string | null
          stripe_session_id: string | null
          amount: number
          currency: string
          status: string
          payment_type: string
          metadata: any | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          stripe_payment_intent_id?: string | null
          stripe_session_id?: string | null
          amount: number
          currency?: string
          status: string
          payment_type: string
          metadata?: any | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          stripe_payment_intent_id?: string | null
          stripe_session_id?: string | null
          amount?: number
          currency?: string
          status?: string
          payment_type?: string
          metadata?: any | null
          created_at?: string
          updated_at?: string
        }
      }
      subscriptions: {
        Row: {
          id: string
          user_id: string
          stripe_subscription_id: string | null
          status: string
          current_period_start: string | null
          current_period_end: string | null
          cancel_at_period_end: boolean
          metadata: any | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          stripe_subscription_id?: string | null
          status: string
          current_period_start?: string | null
          current_period_end?: string | null
          cancel_at_period_end?: boolean
          metadata?: any | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          stripe_subscription_id?: string | null
          status?: string
          current_period_start?: string | null
          current_period_end?: string | null
          cancel_at_period_end?: boolean
          metadata?: any | null
          created_at?: string
          updated_at?: string
        }
      }
      learning_contents: {
        Row: {
          id: string
          title: string
          description: string | null
          url: string
          platform: 'youtube' | 'article' | 'twitter' | 'linkedin'
          content_type: 'skill' | 'career' | 'industry' | 'mindset'
          target_types: string[]
          difficulty_level: 1 | 2 | 3
          duration_minutes: number | null
          tags: string[] | null
          rating: number | null
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          url: string
          platform: 'youtube' | 'article' | 'twitter' | 'linkedin'
          content_type: 'skill' | 'career' | 'industry' | 'mindset'
          target_types: string[]
          difficulty_level: 1 | 2 | 3
          duration_minutes?: number | null
          tags?: string[] | null
          rating?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          url?: string
          platform?: 'youtube' | 'article' | 'twitter' | 'linkedin'
          content_type?: 'skill' | 'career' | 'industry' | 'mindset'
          target_types?: string[]
          difficulty_level?: 1 | 2 | 3
          duration_minutes?: number | null
          tags?: string[] | null
          rating?: number | null
          created_at?: string
        }
      }
      personalized_recommendations: {
        Row: {
          id: string
          user_id: string
          personality_type: string
          recommended_content_ids: string[]
          recommendation_reason: string | null
          priority_score: number | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          personality_type: string
          recommended_content_ids: string[]
          recommendation_reason?: string | null
          priority_score?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          personality_type?: string
          recommended_content_ids?: string[]
          recommendation_reason?: string | null
          priority_score?: number | null
          created_at?: string
        }
      }
    }
  }
} 