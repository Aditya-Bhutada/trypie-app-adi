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
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      badges: {
        Row: {
          created_at: string
          description: string
          icon: string
          id: string
          is_secret: boolean
          points: number
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description: string
          icon: string
          id?: string
          is_secret?: boolean
          points: number
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string
          icon?: string
          id?: string
          is_secret?: boolean
          points?: number
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      expense_shares: {
        Row: {
          amount: number
          expense_id: string
          id: string
          is_paid: boolean | null
          user_id: string
        }
        Insert: {
          amount: number
          expense_id: string
          id?: string
          is_paid?: boolean | null
          user_id: string
        }
        Update: {
          amount?: number
          expense_id?: string
          id?: string
          is_paid?: boolean | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "expense_shares_expense_id_fkey"
            columns: ["expense_id"]
            isOneToOne: false
            referencedRelation: "group_expenses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "expense_shares_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      group_chat_messages: {
        Row: {
          created_at: string
          group_id: string
          id: string
          message: string
          user_id: string
        }
        Insert: {
          created_at?: string
          group_id: string
          id?: string
          message: string
          user_id: string
        }
        Update: {
          created_at?: string
          group_id?: string
          id?: string
          message?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "group_chat_messages_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "travel_groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "group_chat_messages_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      group_expenses: {
        Row: {
          amount: number
          created_at: string
          currency: string
          group_id: string
          id: string
          paid_by: string
          title: string
        }
        Insert: {
          amount: number
          created_at?: string
          currency?: string
          group_id: string
          id?: string
          paid_by: string
          title: string
        }
        Update: {
          amount?: number
          created_at?: string
          currency?: string
          group_id?: string
          id?: string
          paid_by?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "group_expenses_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "travel_groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "group_expenses_paid_by_fkey"
            columns: ["paid_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      group_invitations: {
        Row: {
          created_at: string
          email: string
          expires_at: string
          group_id: string
          id: string
          invited_by: string
          status: string
          token: string
        }
        Insert: {
          created_at?: string
          email: string
          expires_at?: string
          group_id: string
          id?: string
          invited_by: string
          status?: string
          token: string
        }
        Update: {
          created_at?: string
          email?: string
          expires_at?: string
          group_id?: string
          id?: string
          invited_by?: string
          status?: string
          token?: string
        }
        Relationships: [
          {
            foreignKeyName: "group_invitations_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "travel_groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "group_invitations_invited_by_fkey"
            columns: ["invited_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      group_itineraries: {
        Row: {
          created_at: string
          created_by: string
          day_number: number | null
          description: string | null
          group_id: string
          id: string
          title: string
        }
        Insert: {
          created_at?: string
          created_by: string
          day_number?: number | null
          description?: string | null
          group_id: string
          id?: string
          title: string
        }
        Update: {
          created_at?: string
          created_by?: string
          day_number?: number | null
          description?: string | null
          group_id?: string
          id?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "group_itineraries_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "group_itineraries_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "travel_groups"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string
          full_name: string | null
          id: string
          instagram_handle: string | null
          interests: string[] | null
          twitter_handle: string | null
          updated_at: string
          website_url: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          full_name?: string | null
          id: string
          instagram_handle?: string | null
          interests?: string[] | null
          twitter_handle?: string | null
          updated_at?: string
          website_url?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          instagram_handle?: string | null
          interests?: string[] | null
          twitter_handle?: string | null
          updated_at?: string
          website_url?: string | null
        }
        Relationships: []
      }
      reviews: {
        Row: {
          cons: string | null
          created_at: string
          description: string | null
          id: string
          location: string | null
          media_urls: string[] | null
          pros: string | null
          rating: number
          title: string
          user_id: string
          visit_date: string
        }
        Insert: {
          cons?: string | null
          created_at?: string
          description?: string | null
          id?: string
          location?: string | null
          media_urls?: string[] | null
          pros?: string | null
          rating: number
          title: string
          user_id: string
          visit_date: string
        }
        Update: {
          cons?: string | null
          created_at?: string
          description?: string | null
          id?: string
          location?: string | null
          media_urls?: string[] | null
          pros?: string | null
          rating?: number
          title?: string
          user_id?: string
          visit_date?: string
        }
        Relationships: []
      }
      reward_types: {
        Row: {
          category: string
          created_at: string
          description: string | null
          icon: string | null
          id: string
          is_secret: boolean
          points: number
          title: string
          trigger_condition: Json | null
          trigger_type: string
          updated_at: string
          visibility: string
        }
        Insert: {
          category: string
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          is_secret?: boolean
          points: number
          title: string
          trigger_condition?: Json | null
          trigger_type: string
          updated_at?: string
          visibility: string
        }
        Update: {
          category?: string
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          is_secret?: boolean
          points?: number
          title?: string
          trigger_condition?: Json | null
          trigger_type?: string
          updated_at?: string
          visibility?: string
        }
        Relationships: []
      }
      travel_groups: {
        Row: {
          capacity: number | null
          created_at: string
          creator_id: string
          description: string | null
          destination: string
          end_date: string | null
          id: string
          image_url: string | null
          is_influencer_trip: boolean | null
          is_public: boolean | null
          start_date: string | null
          title: string
        }
        Insert: {
          capacity?: number | null
          created_at?: string
          creator_id: string
          description?: string | null
          destination: string
          end_date?: string | null
          id?: string
          image_url?: string | null
          is_influencer_trip?: boolean | null
          is_public?: boolean | null
          start_date?: string | null
          title: string
        }
        Update: {
          capacity?: number | null
          created_at?: string
          creator_id?: string
          description?: string | null
          destination?: string
          end_date?: string | null
          id?: string
          image_url?: string | null
          is_influencer_trip?: boolean | null
          is_public?: boolean | null
          start_date?: string | null
          title?: string
        }
        Relationships: []
      }
      user_badges: {
        Row: {
          badge_id: string
          earned_at: string
          id: string
          user_id: string
        }
        Insert: {
          badge_id: string
          earned_at?: string
          id?: string
          user_id: string
        }
        Update: {
          badge_id?: string
          earned_at?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_badges_badge_id_fkey"
            columns: ["badge_id"]
            isOneToOne: false
            referencedRelation: "badges"
            referencedColumns: ["id"]
          },
        ]
      }
      user_groups: {
        Row: {
          group_id: string
          id: string
          joined_at: string
          role: string | null
          user_id: string
        }
        Insert: {
          group_id: string
          id?: string
          joined_at?: string
          role?: string | null
          user_id: string
        }
        Update: {
          group_id?: string
          id?: string
          joined_at?: string
          role?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_groups_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "travel_groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_groups_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_reward_settings: {
        Row: {
          current_points: number
          id: string
          level: string
          updated_at: string
          user_id: string
        }
        Insert: {
          current_points?: number
          id?: string
          level?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          current_points?: number
          id?: string
          level?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_rewards: {
        Row: {
          badge_id: string | null
          created_at: string
          description: string
          id: string
          points: number
          reward_type_id: string | null
          user_id: string
        }
        Insert: {
          badge_id?: string | null
          created_at?: string
          description: string
          id?: string
          points: number
          reward_type_id?: string | null
          user_id: string
        }
        Update: {
          badge_id?: string | null
          created_at?: string
          description?: string
          id?: string
          points?: number
          reward_type_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_rewards_badge_id_fkey"
            columns: ["badge_id"]
            isOneToOne: false
            referencedRelation: "badges"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_rewards_reward_type_id_fkey"
            columns: ["reward_type_id"]
            isOneToOne: false
            referencedRelation: "reward_types"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_group_invitation_by_token: {
        Args: { p_token: string }
        Returns: {
          created_at: string
          email: string
          expires_at: string
          group_id: string
          id: string
          invited_by: string
          status: string
        }[]
      }
      is_group_creator: {
        Args: { group_id: string }
        Returns: boolean
      }
      is_group_member: {
        Args: { group_id: string }
        Returns: boolean
      }
      update_invitation_status: {
        Args: { p_status: string; p_token: string }
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
