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
      admin_stats: {
        Row: {
          id: string
          stat_key: string
          stat_value: Json
          updated_at: string
        }
        Insert: {
          id?: string
          stat_key: string
          stat_value?: Json
          updated_at?: string
        }
        Update: {
          id?: string
          stat_key?: string
          stat_value?: Json
          updated_at?: string
        }
        Relationships: []
      }
      ai_avatars: {
        Row: {
          category: string
          created_at: string
          created_by: string | null
          description: string | null
          id: string
          image_url: string | null
          is_active: boolean | null
          is_featured: boolean | null
          name: string
          personality: string | null
          price_per_use: number | null
          prompt: string | null
          tags: string[] | null
          total_uses: number | null
          type: string
          updated_at: string
          voice_id: string | null
        }
        Insert: {
          category: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          is_featured?: boolean | null
          name: string
          personality?: string | null
          price_per_use?: number | null
          prompt?: string | null
          tags?: string[] | null
          total_uses?: number | null
          type?: string
          updated_at?: string
          voice_id?: string | null
        }
        Update: {
          category?: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          is_featured?: boolean | null
          name?: string
          personality?: string | null
          price_per_use?: number | null
          prompt?: string | null
          tags?: string[] | null
          total_uses?: number | null
          type?: string
          updated_at?: string
          voice_id?: string | null
        }
        Relationships: []
      }
      artists: {
        Row: {
          audio_url: string | null
          avatar_url: string | null
          bio: string | null
          category: string
          created_at: string
          id: string
          instagram_handle: string | null
          is_active: boolean | null
          is_available: boolean | null
          is_verified: boolean | null
          name: string
          portfolio_urls: string[] | null
          price_per_hour: number | null
          price_per_project: number | null
          rating: number | null
          skills: string[] | null
          spotify_url: string | null
          total_projects: number | null
          updated_at: string
          user_id: string | null
          video_url: string | null
          youtube_url: string | null
        }
        Insert: {
          audio_url?: string | null
          avatar_url?: string | null
          bio?: string | null
          category: string
          created_at?: string
          id?: string
          instagram_handle?: string | null
          is_active?: boolean | null
          is_available?: boolean | null
          is_verified?: boolean | null
          name: string
          portfolio_urls?: string[] | null
          price_per_hour?: number | null
          price_per_project?: number | null
          rating?: number | null
          skills?: string[] | null
          spotify_url?: string | null
          total_projects?: number | null
          updated_at?: string
          user_id?: string | null
          video_url?: string | null
          youtube_url?: string | null
        }
        Update: {
          audio_url?: string | null
          avatar_url?: string | null
          bio?: string | null
          category?: string
          created_at?: string
          id?: string
          instagram_handle?: string | null
          is_active?: boolean | null
          is_available?: boolean | null
          is_verified?: boolean | null
          name?: string
          portfolio_urls?: string[] | null
          price_per_hour?: number | null
          price_per_project?: number | null
          rating?: number | null
          skills?: string[] | null
          spotify_url?: string | null
          total_projects?: number | null
          updated_at?: string
          user_id?: string | null
          video_url?: string | null
          youtube_url?: string | null
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
      checkout_sessions: {
        Row: {
          completed_at: string | null
          created_at: string
          id: string
          metadata: Json | null
          plan_key: string
          status: string
          stripe_session_id: string
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          id?: string
          metadata?: Json | null
          plan_key: string
          status?: string
          stripe_session_id: string
          user_id: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          id?: string
          metadata?: Json | null
          plan_key?: string
          status?: string
          stripe_session_id?: string
          user_id?: string
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
      credit_transactions: {
        Row: {
          amount: number
          balance_after: number
          created_at: string
          description: string | null
          id: string
          reference_id: string | null
          reference_type: string | null
          type: string
          user_id: string
        }
        Insert: {
          amount: number
          balance_after: number
          created_at?: string
          description?: string | null
          id?: string
          reference_id?: string | null
          reference_type?: string | null
          type: string
          user_id: string
        }
        Update: {
          amount?: number
          balance_after?: number
          created_at?: string
          description?: string | null
          id?: string
          reference_id?: string | null
          reference_type?: string | null
          type?: string
          user_id?: string
        }
        Relationships: []
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
      generated_videos: {
        Row: {
          created_at: string
          duration: number | null
          id: string
          image_url: string
          product_name: string
          prompt: string
          status: string
          template_name: string
          updated_at: string
          user_id: string
          video_url: string | null
        }
        Insert: {
          created_at?: string
          duration?: number | null
          id?: string
          image_url: string
          product_name: string
          prompt: string
          status?: string
          template_name: string
          updated_at?: string
          user_id: string
          video_url?: string | null
        }
        Update: {
          created_at?: string
          duration?: number | null
          id?: string
          image_url?: string
          product_name?: string
          prompt?: string
          status?: string
          template_name?: string
          updated_at?: string
          user_id?: string
          video_url?: string | null
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
          audience_age_range: string | null
          audience_female_pct: number | null
          audience_male_pct: number | null
          avatar_url: string | null
          avg_comments: number | null
          avg_likes: number | null
          avg_response_time_hours: number | null
          avg_shares: number | null
          avg_views: number | null
          ban_reason: string | null
          banned_at: string | null
          bio: string | null
          category: string
          city: string | null
          completion_rate: number | null
          content_type: string | null
          country: string | null
          cpe: number | null
          cpm: number | null
          created_at: string
          engagement_rate: number
          followers_count: number
          id: string
          instagram_handle: string | null
          is_available: boolean | null
          is_banned: boolean
          is_verified: boolean | null
          languages: string[] | null
          location: string | null
          media_kit_url: string | null
          monthly_reach: number | null
          niche: string | null
          notes: string | null
          platforms: string[] | null
          price_per_live: number | null
          price_per_post: number
          price_per_reel: number | null
          price_per_story: number | null
          price_per_video: number | null
          rating: number | null
          secondary_niche: string | null
          stage_name: string
          state: string | null
          tier: string | null
          tiktok_handle: string | null
          total_campaigns: number | null
          updated_at: string
          user_id: string
          views_count: number | null
          website_url: string | null
          youtube_handle: string | null
        }
        Insert: {
          audience_age_range?: string | null
          audience_female_pct?: number | null
          audience_male_pct?: number | null
          avatar_url?: string | null
          avg_comments?: number | null
          avg_likes?: number | null
          avg_response_time_hours?: number | null
          avg_shares?: number | null
          avg_views?: number | null
          ban_reason?: string | null
          banned_at?: string | null
          bio?: string | null
          category: string
          city?: string | null
          completion_rate?: number | null
          content_type?: string | null
          country?: string | null
          cpe?: number | null
          cpm?: number | null
          created_at?: string
          engagement_rate?: number
          followers_count?: number
          id?: string
          instagram_handle?: string | null
          is_available?: boolean | null
          is_banned?: boolean
          is_verified?: boolean | null
          languages?: string[] | null
          location?: string | null
          media_kit_url?: string | null
          monthly_reach?: number | null
          niche?: string | null
          notes?: string | null
          platforms?: string[] | null
          price_per_live?: number | null
          price_per_post: number
          price_per_reel?: number | null
          price_per_story?: number | null
          price_per_video?: number | null
          rating?: number | null
          secondary_niche?: string | null
          stage_name: string
          state?: string | null
          tier?: string | null
          tiktok_handle?: string | null
          total_campaigns?: number | null
          updated_at?: string
          user_id: string
          views_count?: number | null
          website_url?: string | null
          youtube_handle?: string | null
        }
        Update: {
          audience_age_range?: string | null
          audience_female_pct?: number | null
          audience_male_pct?: number | null
          avatar_url?: string | null
          avg_comments?: number | null
          avg_likes?: number | null
          avg_response_time_hours?: number | null
          avg_shares?: number | null
          avg_views?: number | null
          ban_reason?: string | null
          banned_at?: string | null
          bio?: string | null
          category?: string
          city?: string | null
          completion_rate?: number | null
          content_type?: string | null
          country?: string | null
          cpe?: number | null
          cpm?: number | null
          created_at?: string
          engagement_rate?: number
          followers_count?: number
          id?: string
          instagram_handle?: string | null
          is_available?: boolean | null
          is_banned?: boolean
          is_verified?: boolean | null
          languages?: string[] | null
          location?: string | null
          media_kit_url?: string | null
          monthly_reach?: number | null
          niche?: string | null
          notes?: string | null
          platforms?: string[] | null
          price_per_live?: number | null
          price_per_post?: number
          price_per_reel?: number | null
          price_per_story?: number | null
          price_per_video?: number | null
          rating?: number | null
          secondary_niche?: string | null
          stage_name?: string
          state?: string | null
          tier?: string | null
          tiktok_handle?: string | null
          total_campaigns?: number | null
          updated_at?: string
          user_id?: string
          views_count?: number | null
          website_url?: string | null
          youtube_handle?: string | null
        }
        Relationships: []
      }
      live_chat_messages: {
        Row: {
          created_at: string
          id: string
          is_bot: boolean
          is_pinned: boolean
          message: string
          session_id: string
          user_id: string | null
          user_name: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_bot?: boolean
          is_pinned?: boolean
          message: string
          session_id: string
          user_id?: string | null
          user_name?: string
        }
        Update: {
          created_at?: string
          id?: string
          is_bot?: boolean
          is_pinned?: boolean
          message?: string
          session_id?: string
          user_id?: string | null
          user_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "live_chat_messages_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "live_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      live_products: {
        Row: {
          created_at: string
          display_order: number
          id: string
          image_url: string | null
          is_featured: boolean
          name: string
          original_price: number | null
          price: number
          session_id: string
          sold_count: number
          stock: number
        }
        Insert: {
          created_at?: string
          display_order?: number
          id?: string
          image_url?: string | null
          is_featured?: boolean
          name: string
          original_price?: number | null
          price: number
          session_id: string
          sold_count?: number
          stock?: number
        }
        Update: {
          created_at?: string
          display_order?: number
          id?: string
          image_url?: string | null
          is_featured?: boolean
          name?: string
          original_price?: number | null
          price?: number
          session_id?: string
          sold_count?: number
          stock?: number
        }
        Relationships: [
          {
            foreignKeyName: "live_products_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "live_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      live_sessions: {
        Row: {
          created_at: string
          description: string | null
          ended_at: string | null
          host_id: string
          id: string
          likes_count: number
          presenter_name: string | null
          presenter_type: string
          scheduled_at: string | null
          share_slug: string | null
          started_at: string | null
          status: string
          thumbnail_url: string | null
          title: string
          updated_at: string
          viewers_count: number
        }
        Insert: {
          created_at?: string
          description?: string | null
          ended_at?: string | null
          host_id: string
          id?: string
          likes_count?: number
          presenter_name?: string | null
          presenter_type?: string
          scheduled_at?: string | null
          share_slug?: string | null
          started_at?: string | null
          status?: string
          thumbnail_url?: string | null
          title: string
          updated_at?: string
          viewers_count?: number
        }
        Update: {
          created_at?: string
          description?: string | null
          ended_at?: string | null
          host_id?: string
          id?: string
          likes_count?: number
          presenter_name?: string | null
          presenter_type?: string
          scheduled_at?: string | null
          share_slug?: string | null
          started_at?: string | null
          status?: string
          thumbnail_url?: string | null
          title?: string
          updated_at?: string
          viewers_count?: number
        }
        Relationships: []
      }
      marketplace_categories: {
        Row: {
          created_at: string
          description: string | null
          display_order: number | null
          icon: string | null
          id: string
          is_active: boolean | null
          name: string
          slug: string
          type: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          display_order?: number | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          slug: string
          type: string
        }
        Update: {
          created_at?: string
          description?: string | null
          display_order?: number | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          slug?: string
          type?: string
        }
        Relationships: []
      }
      marketplace_tags: {
        Row: {
          color: string | null
          created_at: string
          id: string
          is_active: boolean | null
          name: string
          slug: string
        }
        Insert: {
          color?: string | null
          created_at?: string
          id?: string
          is_active?: boolean | null
          name: string
          slug: string
        }
        Update: {
          color?: string | null
          created_at?: string
          id?: string
          is_active?: boolean | null
          name?: string
          slug?: string
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
      mock_payments: {
        Row: {
          amount_cents: number
          created_at: string
          id: string
          payment_method: string | null
          reference_id: string | null
          reference_type: string | null
          status: string | null
          type: string
          user_id: string
        }
        Insert: {
          amount_cents: number
          created_at?: string
          id?: string
          payment_method?: string | null
          reference_id?: string | null
          reference_type?: string | null
          status?: string | null
          type: string
          user_id: string
        }
        Update: {
          amount_cents?: number
          created_at?: string
          id?: string
          payment_method?: string | null
          reference_id?: string | null
          reference_type?: string | null
          status?: string | null
          type?: string
          user_id?: string
        }
        Relationships: []
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
      photo_generations: {
        Row: {
          amount_cents: number
          created_at: string
          custom_fields: Json | null
          generated_images: string[] | null
          generation_error: string | null
          generation_status: string
          id: string
          payment_id: string | null
          payment_method: string | null
          payment_status: string
          service_id: string | null
          theme: string | null
          updated_at: string
          uploaded_photos: string[] | null
          user_email: string | null
          user_id: string | null
          user_name: string | null
          user_phone: string | null
        }
        Insert: {
          amount_cents: number
          created_at?: string
          custom_fields?: Json | null
          generated_images?: string[] | null
          generation_error?: string | null
          generation_status?: string
          id?: string
          payment_id?: string | null
          payment_method?: string | null
          payment_status?: string
          service_id?: string | null
          theme?: string | null
          updated_at?: string
          uploaded_photos?: string[] | null
          user_email?: string | null
          user_id?: string | null
          user_name?: string | null
          user_phone?: string | null
        }
        Update: {
          amount_cents?: number
          created_at?: string
          custom_fields?: Json | null
          generated_images?: string[] | null
          generation_error?: string | null
          generation_status?: string
          id?: string
          payment_id?: string | null
          payment_method?: string | null
          payment_status?: string
          service_id?: string | null
          theme?: string | null
          updated_at?: string
          uploaded_photos?: string[] | null
          user_email?: string | null
          user_id?: string | null
          user_name?: string | null
          user_phone?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "photo_generations_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "photo_services"
            referencedColumns: ["id"]
          },
        ]
      }
      photo_services: {
        Row: {
          category: string
          created_at: string
          description: string | null
          display_order: number | null
          example_images: string[] | null
          features: Json | null
          icon: string | null
          id: string
          is_active: boolean | null
          name: string
          price_cents: number
          slug: string
          themes: Json | null
          updated_at: string
        }
        Insert: {
          category: string
          created_at?: string
          description?: string | null
          display_order?: number | null
          example_images?: string[] | null
          features?: Json | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          price_cents?: number
          slug: string
          themes?: Json | null
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          description?: string | null
          display_order?: number | null
          example_images?: string[] | null
          features?: Json | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          price_cents?: number
          slug?: string
          themes?: Json | null
          updated_at?: string
        }
        Relationships: []
      }
      plan_configs: {
        Row: {
          created_at: string
          credits_monthly: number
          display_order: number
          features: Json
          id: string
          is_active: boolean
          name: string
          plan_key: string
          price_cents: number
          stripe_price_id: string | null
          stripe_product_id: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          credits_monthly: number
          display_order?: number
          features?: Json
          id?: string
          is_active?: boolean
          name: string
          plan_key: string
          price_cents: number
          stripe_price_id?: string | null
          stripe_product_id?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          credits_monthly?: number
          display_order?: number
          features?: Json
          id?: string
          is_active?: boolean
          name?: string
          plan_key?: string
          price_cents?: number
          stripe_price_id?: string | null
          stripe_product_id?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      plan_upgrades: {
        Row: {
          created_at: string
          description: string | null
          display_order: number | null
          features: Json | null
          icon: string | null
          id: string
          is_active: boolean | null
          name: string
          price_cents: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          display_order?: number | null
          features?: Json | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          price_cents?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          display_order?: number | null
          features?: Json | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          price_cents?: number
          updated_at?: string
        }
        Relationships: []
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
      prompt_purchases: {
        Row: {
          amount_cents: number
          created_at: string
          custom_fields: Json | null
          generated_image_url: string | null
          generation_status: string
          id: string
          payment_id: string | null
          payment_method: string | null
          payment_status: string
          prompt_id: string
          updated_at: string
          user_email: string | null
          user_instagram: string | null
          user_name: string | null
          user_photo_url: string | null
        }
        Insert: {
          amount_cents: number
          created_at?: string
          custom_fields?: Json | null
          generated_image_url?: string | null
          generation_status?: string
          id?: string
          payment_id?: string | null
          payment_method?: string | null
          payment_status?: string
          prompt_id: string
          updated_at?: string
          user_email?: string | null
          user_instagram?: string | null
          user_name?: string | null
          user_photo_url?: string | null
        }
        Update: {
          amount_cents?: number
          created_at?: string
          custom_fields?: Json | null
          generated_image_url?: string | null
          generation_status?: string
          id?: string
          payment_id?: string | null
          payment_method?: string | null
          payment_status?: string
          prompt_id?: string
          updated_at?: string
          user_email?: string | null
          user_instagram?: string | null
          user_name?: string | null
          user_photo_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "prompt_purchases_prompt_id_fkey"
            columns: ["prompt_id"]
            isOneToOne: false
            referencedRelation: "prompts"
            referencedColumns: ["id"]
          },
        ]
      }
      prompts: {
        Row: {
          ai_model: string | null
          category: string
          created_at: string
          description: string | null
          display_order: number
          example_image_url: string | null
          hype_text: string | null
          id: string
          influencer_avatar_url: string | null
          influencer_name: string | null
          is_featured: boolean
          is_influencer_prompt: boolean
          min_photos: number | null
          name: string
          negative_prompt: string | null
          price_cents: number
          prompt_template: string
          required_fields: Json
          status: string
          updated_at: string
        }
        Insert: {
          ai_model?: string | null
          category: string
          created_at?: string
          description?: string | null
          display_order?: number
          example_image_url?: string | null
          hype_text?: string | null
          id?: string
          influencer_avatar_url?: string | null
          influencer_name?: string | null
          is_featured?: boolean
          is_influencer_prompt?: boolean
          min_photos?: number | null
          name: string
          negative_prompt?: string | null
          price_cents?: number
          prompt_template: string
          required_fields?: Json
          status?: string
          updated_at?: string
        }
        Update: {
          ai_model?: string | null
          category?: string
          created_at?: string
          description?: string | null
          display_order?: number
          example_image_url?: string | null
          hype_text?: string | null
          id?: string
          influencer_avatar_url?: string | null
          influencer_name?: string | null
          is_featured?: boolean
          is_influencer_prompt?: boolean
          min_photos?: number | null
          name?: string
          negative_prompt?: string | null
          price_cents?: number
          prompt_template?: string
          required_fields?: Json
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      stripe_customers: {
        Row: {
          created_at: string
          email: string | null
          id: string
          stripe_customer_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          id?: string
          stripe_customer_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          email?: string | null
          id?: string
          stripe_customer_id?: string
          user_id?: string
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          cancel_at_period_end: boolean | null
          created_at: string
          current_period_end: string | null
          current_period_start: string | null
          ends_at: string | null
          id: string
          plan: Database["public"]["Enums"]["subscription_plan"]
          started_at: string
          status: string
          stripe_customer_id: string | null
          stripe_price_id: string | null
          stripe_subscription_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          cancel_at_period_end?: boolean | null
          created_at?: string
          current_period_end?: string | null
          current_period_start?: string | null
          ends_at?: string | null
          id?: string
          plan: Database["public"]["Enums"]["subscription_plan"]
          started_at?: string
          status?: string
          stripe_customer_id?: string | null
          stripe_price_id?: string | null
          stripe_subscription_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          cancel_at_period_end?: boolean | null
          created_at?: string
          current_period_end?: string | null
          current_period_start?: string | null
          ends_at?: string | null
          id?: string
          plan?: Database["public"]["Enums"]["subscription_plan"]
          started_at?: string
          status?: string
          stripe_customer_id?: string | null
          stripe_price_id?: string | null
          stripe_subscription_id?: string | null
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
      user_credits: {
        Row: {
          created_at: string
          credits_balance: number
          credits_used_this_month: number
          id: string
          last_credit_reset: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          credits_balance?: number
          credits_used_this_month?: number
          id?: string
          last_credit_reset?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          credits_balance?: number
          credits_used_this_month?: number
          id?: string
          last_credit_reset?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
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
      user_upgrades: {
        Row: {
          expires_at: string | null
          id: string
          is_active: boolean | null
          payment_status: string | null
          purchased_at: string
          upgrade_id: string
          user_id: string
        }
        Insert: {
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          payment_status?: string | null
          purchased_at?: string
          upgrade_id: string
          user_id: string
        }
        Update: {
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          payment_status?: string | null
          purchased_at?: string
          upgrade_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_upgrades_upgrade_id_fkey"
            columns: ["upgrade_id"]
            isOneToOne: false
            referencedRelation: "plan_upgrades"
            referencedColumns: ["id"]
          },
        ]
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
      add_credits: {
        Args: {
          p_amount: number
          p_description?: string
          p_type?: string
          p_user_id: string
        }
        Returns: number
      }
      consume_credits: {
        Args: {
          p_amount: number
          p_description?: string
          p_reference_id?: string
          p_reference_type?: string
          p_user_id: string
        }
        Returns: boolean
      }
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
      reset_monthly_credits: {
        Args: { p_new_credits: number; p_user_id: string }
        Returns: number
      }
    }
    Enums: {
      app_role: "brand" | "influencer" | "admin"
      contract_status: "pending_payment" | "active" | "completed" | "cancelled"
      payment_status: "pending" | "completed" | "failed" | "refunded"
      subscription_plan:
        | "starter"
        | "professional"
        | "enterprise"
        | "creator"
        | "business"
        | "pro"
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
      subscription_plan: [
        "starter",
        "professional",
        "enterprise",
        "creator",
        "business",
        "pro",
      ],
    },
  },
} as const
