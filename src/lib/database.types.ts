export type Database = {
  public: {
    Tables: {
      user_profiles: {
        Row: {
          id: string;
          full_name: string;
          age: number;
          total_points: number;
          current_streak: number;
          skill_level: 'Beginner' | 'Intermediate' | 'Advanced';
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['user_profiles']['Row'], 'created_at' | 'updated_at'> & {
          total_points?: number;
          current_streak?: number;
          skill_level?: 'Beginner' | 'Intermediate' | 'Advanced';
        };
        Update: Partial<Database['public']['Tables']['user_profiles']['Insert']>;
      };
      user_lab_progress: {
        Row: {
          id: string;
          user_id: string;
          lab_id: string;
          completed: boolean;
          points_earned: number;
          completed_at: string | null;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['user_lab_progress']['Row'], 'id' | 'created_at'> & {
          completed?: boolean;
          points_earned?: number;
          completed_at?: string | null;
        };
        Update: Partial<Database['public']['Tables']['user_lab_progress']['Insert']>;
      };
      user_achievements: {
        Row: {
          id: string;
          user_id: string;
          achievement_id: string;
          earned_at: string;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['user_achievements']['Row'], 'id' | 'earned_at' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['user_achievements']['Insert']>;
      };
      user_activity_log: {
        Row: {
          id: string;
          user_id: string;
          activity_type: string;
          activity_data: Record<string, any>;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['user_activity_log']['Row'], 'id' | 'created_at'> & {
          activity_data?: Record<string, any>;
        };
        Update: Partial<Database['public']['Tables']['user_activity_log']['Insert']>;
      };
    };
  };
};
