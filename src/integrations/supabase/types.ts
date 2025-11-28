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
      admin_2fa: {
        Row: {
          backup_codes: string[] | null
          created_at: string
          id: string
          is_enabled: boolean
          last_used: string | null
          secret: string
          updated_at: string
          user_id: string
        }
        Insert: {
          backup_codes?: string[] | null
          created_at?: string
          id?: string
          is_enabled?: boolean
          last_used?: string | null
          secret: string
          updated_at?: string
          user_id: string
        }
        Update: {
          backup_codes?: string[] | null
          created_at?: string
          id?: string
          is_enabled?: boolean
          last_used?: string | null
          secret?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      admin_settings: {
        Row: {
          created_at: string
          id: string
          setting_key: string
          setting_value: Json
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          setting_key: string
          setting_value: Json
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          setting_key?: string
          setting_value?: Json
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: []
      }
      audit_logs: {
        Row: {
          action: string
          admin_id: string | null
          created_at: string
          entity_id: string | null
          entity_type: string
          id: string
          ip_address: string | null
          new_data: Json | null
          old_data: Json | null
          user_agent: string | null
        }
        Insert: {
          action: string
          admin_id?: string | null
          created_at?: string
          entity_id?: string | null
          entity_type: string
          id?: string
          ip_address?: string | null
          new_data?: Json | null
          old_data?: Json | null
          user_agent?: string | null
        }
        Update: {
          action?: string
          admin_id?: string | null
          created_at?: string
          entity_id?: string | null
          entity_type?: string
          id?: string
          ip_address?: string | null
          new_data?: Json | null
          old_data?: Json | null
          user_agent?: string | null
        }
        Relationships: []
      }
      bans: {
        Row: {
          banned_at: string
          banned_by: string | null
          evidence: string | null
          id: string
          is_active: boolean
          reason: string
          user_id: string
        }
        Insert: {
          banned_at?: string
          banned_by?: string | null
          evidence?: string | null
          id?: string
          is_active?: boolean
          reason: string
          user_id: string
        }
        Update: {
          banned_at?: string
          banned_by?: string | null
          evidence?: string | null
          id?: string
          is_active?: boolean
          reason?: string
          user_id?: string
        }
        Relationships: []
      }
      brand_verifications: {
        Row: {
          brand_id: string
          cnpj: string | null
          company_name: string | null
          created_at: string
          documents_verified: boolean
          financial_verified: boolean
          id: string
          status: string
          updated_at: string
          verified_at: string | null
          verifier_id: string | null
          verifier_notes: string | null
        }
        Insert: {
          brand_id: string
          cnpj?: string | null
          company_name?: string | null
          created_at?: string
          documents_verified?: boolean
          financial_verified?: boolean
          id?: string
          status?: string
          updated_at?: string
          verified_at?: string | null
          verifier_id?: string | null
          verifier_notes?: string | null
        }
        Update: {
          brand_id?: string
          cnpj?: string | null
          company_name?: string | null
          created_at?: string
          documents_verified?: boolean
          financial_verified?: boolean
          id?: string
          status?: string
          updated_at?: string
          verified_at?: string | null
          verifier_id?: string | null
          verifier_notes?: string | null
        }
        Relationships: []
      }
      contracts: {
        Row: {
          amount: number
          arcana_fee: number
          brand_id: string
          completed_at: string | null
          created_at: string
          description: string
          id: string
          influencer_id: string
          started_at: string | null
          status: Database["public"]["Enums"]["contract_status"]
          total_amount: number
          updated_at: string
        }
        Insert: {
          amount: number
          arcana_fee: number
          brand_id: string
          completed_at?: string | null
          created_at?: string
          description: string
          id?: string
          influencer_id: string
          started_at?: string | null
          status?: Database["public"]["Enums"]["contract_status"]
          total_amount: number
          updated_at?: string
        }
        Update: {
          amount?: number
          arcana_fee?: number
          brand_id?: string
          completed_at?: string | null
          created_at?: string
          description?: string
          id?: string
          influencer_id?: string
          started_at?: string | null
          status?: Database["public"]["Enums"]["contract_status"]
          total_amount?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "contracts_influencer_id_fkey"
            columns: ["influencer_id"]
            isOneToOne: false
            referencedRelation: "influencers"
            referencedColumns: ["id"]
          },
        ]
      }
      generated_images: {
        Row: {
          created_at: string
          id: string
          image_url: string
          is_public: boolean | null
          likes_count: number | null
          product_name: string
          template_name: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          image_url: string
          is_public?: boolean | null
          likes_count?: number | null
          product_name: string
          template_name: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          image_url?: string
          is_public?: boolean | null
          likes_count?: number | null
          product_name?: string
          template_name?: string
          user_id?: string | null
        }
        Relationships: []
      }
      image_favorites: {
        Row: {
          created_at: string
          id: string
          image_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          image_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          image_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "image_favorites_image_id_fkey"
            columns: ["image_id"]
            isOneToOne: false
            referencedRelation: "generated_images"
            referencedColumns: ["id"]
          },
        ]
      }
      image_likes: {
        Row: {
          created_at: string | null
          id: string
          image_id: string
          user_fingerprint: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          image_id: string
          user_fingerprint: string
        }
        Update: {
          created_at?: string | null
          id?: string
          image_id?: string
          user_fingerprint?: string
        }
        Relationships: [
          {
            foreignKeyName: "image_likes_image_id_fkey"
            columns: ["image_id"]
            isOneToOne: false
            referencedRelation: "generated_images"
            referencedColumns: ["id"]
          },
        ]
      }
      influencer_approvals: {
        Row: {
          authenticity_score: number | null
          created_at: string
          documents_verified: boolean
          engagement_score: number | null
          id: string
          influencer_id: string
          reviewed_at: string | null
          reviewer_id: string | null
          reviewer_notes: string | null
          status: string
          updated_at: string
        }
        Insert: {
          authenticity_score?: number | null
          created_at?: string
          documents_verified?: boolean
          engagement_score?: number | null
          id?: string
          influencer_id: string
          reviewed_at?: string | null
          reviewer_id?: string | null
          reviewer_notes?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          authenticity_score?: number | null
          created_at?: string
          documents_verified?: boolean
          engagement_score?: number | null
          id?: string
          influencer_id?: string
          reviewed_at?: string | null
          reviewer_id?: string | null
          reviewer_notes?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "influencer_approvals_influencer_id_fkey"
            columns: ["influencer_id"]
            isOneToOne: true
            referencedRelation: "influencers"
            referencedColumns: ["id"]
          },
        ]
      }
      influencers: {
        Row: {
          ban_reason: string | null
          banned_at: string | null
          bio: string | null
          category: string
          created_at: string
          engagement_rate: number
          followers_count: number
          id: string
          instagram_handle: string | null
          is_banned: boolean
          price_per_post: number
          stage_name: string
          tiktok_handle: string | null
          updated_at: string
          user_id: string
          youtube_handle: string | null
        }
        Insert: {
          ban_reason?: string | null
          banned_at?: string | null
          bio?: string | null
          category: string
          created_at?: string
          engagement_rate?: number
          followers_count?: number
          id?: string
          instagram_handle?: string | null
          is_banned?: boolean
          price_per_post: number
          stage_name: string
          tiktok_handle?: string | null
          updated_at?: string
          user_id: string
          youtube_handle?: string | null
        }
        Update: {
          ban_reason?: string | null
          banned_at?: string | null
          bio?: string | null
          category?: string
          created_at?: string
          engagement_rate?: number
          followers_count?: number
          id?: string
          instagram_handle?: string | null
          is_banned?: boolean
          price_per_post?: number
          stage_name?: string
          tiktok_handle?: string | null
          updated_at?: string
          user_id?: string
          youtube_handle?: string | null
        }
        Relationships: []
      }
      messages: {
        Row: {
          content: string
          contract_id: string
          created_at: string
          flag_reason: string | null
          id: string
          is_flagged: boolean
          sender_id: string
        }
        Insert: {
          content: string
          contract_id: string
          created_at?: string
          flag_reason?: string | null
          id?: string
          is_flagged?: boolean
          sender_id: string
        }
        Update: {
          content?: string
          contract_id?: string
          created_at?: string
          flag_reason?: string | null
          id?: string
          is_flagged?: boolean
          sender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_contract_id_fkey"
            columns: ["contract_id"]
            isOneToOne: false
            referencedRelation: "contracts"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          action_url: string | null
          created_at: string
          id: string
          is_read: boolean
          message: string
          metadata: Json | null
          title: string
          type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          action_url?: string | null
          created_at?: string
          id?: string
          is_read?: boolean
          message: string
          metadata?: Json | null
          title: string
          type: string
          updated_at?: string
          user_id: string
        }
        Update: {
          action_url?: string | null
          created_at?: string
          id?: string
          is_read?: boolean
          message?: string
          metadata?: Json | null
          title?: string
          type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      payments: {
        Row: {
          amount: number
          brand_id: string
          contract_id: string
          created_at: string
          id: string
          paid_at: string | null
          payment_method: string | null
          status: Database["public"]["Enums"]["payment_status"]
          transaction_id: string | null
          updated_at: string
        }
        Insert: {
          amount: number
          brand_id: string
          contract_id: string
          created_at?: string
          id?: string
          paid_at?: string | null
          payment_method?: string | null
          status?: Database["public"]["Enums"]["payment_status"]
          transaction_id?: string | null
          updated_at?: string
        }
        Update: {
          amount?: number
          brand_id?: string
          contract_id?: string
          created_at?: string
          id?: string
          paid_at?: string | null
          payment_method?: string | null
          status?: Database["public"]["Enums"]["payment_status"]
          transaction_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "payments_contract_id_fkey"
            columns: ["contract_id"]
            isOneToOne: false
            referencedRelation: "contracts"
            referencedColumns: ["id"]
          },
        ]
      }
      platform_fees: {
        Row: {
          arcana_platform_fee: number
          arcana_whitelabel_fee: number
          contract_id: string
          created_at: string
          id: string
          total_fees: number
          withdrawal_fee: number | null
        }
        Insert: {
          arcana_platform_fee: number
          arcana_whitelabel_fee: number
          contract_id: string
          created_at?: string
          id?: string
          total_fees: number
          withdrawal_fee?: number | null
        }
        Update: {
          arcana_platform_fee?: number
          arcana_whitelabel_fee?: number
          contract_id?: string
          created_at?: string
          id?: string
          total_fees?: number
          withdrawal_fee?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "platform_fees_contract_id_fkey"
            columns: ["contract_id"]
            isOneToOne: false
            referencedRelation: "contracts"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string
          full_name: string
          id: string
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email: string
          full_name: string
          id: string
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          created_at: string
          ends_at: string | null
          id: string
          plan: Database["public"]["Enums"]["subscription_plan"]
          started_at: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          ends_at?: string | null
          id?: string
          plan: Database["public"]["Enums"]["subscription_plan"]
          started_at?: string
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          ends_at?: string | null
          id?: string
          plan?: Database["public"]["Enums"]["subscription_plan"]
          started_at?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      support_tickets: {
        Row: {
          assigned_to: string | null
          category: string
          created_at: string
          description: string
          id: string
          priority: string
          resolved_at: string | null
          status: string
          subject: string
          updated_at: string
          user_id: string
        }
        Insert: {
          assigned_to?: string | null
          category: string
          created_at?: string
          description: string
          id?: string
          priority: string
          resolved_at?: string | null
          status?: string
          subject: string
          updated_at?: string
          user_id: string
        }
        Update: {
          assigned_to?: string | null
          category?: string
          created_at?: string
          description?: string
          id?: string
          priority?: string
          resolved_at?: string | null
          status?: string
          subject?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      ticket_messages: {
        Row: {
          created_at: string
          id: string
          is_internal: boolean
          message: string
          sender_id: string
          ticket_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_internal?: boolean
          message: string
          sender_id: string
          ticket_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_internal?: boolean
          message?: string
          sender_id?: string
          ticket_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ticket_messages_ticket_id_fkey"
            columns: ["ticket_id"]
            isOneToOne: false
            referencedRelation: "support_tickets"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      withdrawals: {
        Row: {
          amount: number
          bank_account: string | null
          created_at: string
          fee: number
          id: string
          influencer_id: string
          net_amount: number
          payment_method: string
          pix_key: string | null
          processed_at: string | null
          processed_by: string | null
          status: string
          updated_at: string
        }
        Insert: {
          amount: number
          bank_account?: string | null
          created_at?: string
          fee: number
          id?: string
          influencer_id: string
          net_amount: number
          payment_method: string
          pix_key?: string | null
          processed_at?: string | null
          processed_by?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          amount?: number
          bank_account?: string | null
          created_at?: string
          fee?: number
          id?: string
          influencer_id?: string
          net_amount?: number
          payment_method?: string
          pix_key?: string | null
          processed_at?: string | null
          processed_by?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "withdrawals_influencer_id_fkey"
            columns: ["influencer_id"]
            isOneToOne: false
            referencedRelation: "influencers"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_user_banned: { Args: { _user_id: string }; Returns: boolean }
      log_admin_action: {
        Args: {
          p_action: string
          p_entity_id: string
          p_entity_type: string
          p_new_data?: Json
          p_old_data?: Json
        }
        Returns: string
      }
    }
    Enums: {
      app_role: "brand" | "influencer" | "admin"
      contract_status: "pending_payment" | "active" | "completed" | "cancelled"
      payment_status: "pending" | "completed" | "failed" | "refunded"
      subscription_plan: "starter" | "professional" | "enterprise"
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
    Enums: {
      app_role: ["brand", "influencer", "admin"],
      contract_status: ["pending_payment", "active", "completed", "cancelled"],
      payment_status: ["pending", "completed", "failed", "refunded"],
      subscription_plan: ["starter", "professional", "enterprise"],
    },
  },
} as const
