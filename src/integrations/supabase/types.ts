export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      admin_users: {
        Row: {
          created_at: string
          email: string
          first_name: string | null
          id: string
          last_name: string | null
          role: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          first_name?: string | null
          id: string
          last_name?: string | null
          role?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          first_name?: string | null
          id?: string
          last_name?: string | null
          role?: string
          updated_at?: string
        }
        Relationships: []
      }
      articles: {
        Row: {
          author_name_en: string | null
          author_name_zh: string | null
          category_en: string | null
          category_zh: string | null
          content_en: Json | null
          content_zh: Json | null
          created_at: string
          description_en: string | null
          description_zh: string | null
          id: string
          image_url: string | null
          published_at: string
          slug: string
          title_en: string | null
          title_zh: string | null
          updated_at: string
        }
        Insert: {
          author_name_en?: string | null
          author_name_zh?: string | null
          category_en?: string | null
          category_zh?: string | null
          content_en?: Json | null
          content_zh?: Json | null
          created_at?: string
          description_en?: string | null
          description_zh?: string | null
          id?: string
          image_url?: string | null
          published_at?: string
          slug: string
          title_en?: string | null
          title_zh?: string | null
          updated_at?: string
        }
        Update: {
          author_name_en?: string | null
          author_name_zh?: string | null
          category_en?: string | null
          category_zh?: string | null
          content_en?: Json | null
          content_zh?: Json | null
          created_at?: string
          description_en?: string | null
          description_zh?: string | null
          id?: string
          image_url?: string | null
          published_at?: string
          slug?: string
          title_en?: string | null
          title_zh?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      contact_notes: {
        Row: {
          contact_id: string
          created_at: string
          created_by: string | null
          id: string
          note: string
        }
        Insert: {
          contact_id: string
          created_at?: string
          created_by?: string | null
          id?: string
          note: string
        }
        Update: {
          contact_id?: string
          created_at?: string
          created_by?: string | null
          id?: string
          note?: string
        }
        Relationships: [
          {
            foreignKeyName: "contact_notes_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "contact_submissions"
            referencedColumns: ["id"]
          },
        ]
      }
      contact_submissions: {
        Row: {
          contact_info: string
          created_at: string
          first_name: string
          id: string
          last_name: string
          message: string
          status: string
        }
        Insert: {
          contact_info: string
          created_at?: string
          first_name: string
          id?: string
          last_name: string
          message: string
          status?: string
        }
        Update: {
          contact_info?: string
          created_at?: string
          first_name?: string
          id?: string
          last_name?: string
          message?: string
          status?: string
        }
        Relationships: []
      }
      onboarding_data: {
        Row: {
          address: string | null
          consultation_date: string | null
          consultation_time: string | null
          consultation_type: string | null
          created_at: string
          email: string | null
          first_name: string | null
          id: string
          image_url: string | null
          last_name: string | null
          media_account_number: string | null
          phone: string | null
          preferred_communication: string | null
          status: string
          updated_at: string
        }
        Insert: {
          address?: string | null
          consultation_date?: string | null
          consultation_time?: string | null
          consultation_type?: string | null
          created_at?: string
          email?: string | null
          first_name?: string | null
          id: string
          image_url?: string | null
          last_name?: string | null
          media_account_number?: string | null
          phone?: string | null
          preferred_communication?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          address?: string | null
          consultation_date?: string | null
          consultation_time?: string | null
          consultation_type?: string | null
          created_at?: string
          email?: string | null
          first_name?: string | null
          id?: string
          image_url?: string | null
          last_name?: string | null
          media_account_number?: string | null
          phone?: string | null
          preferred_communication?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string | null
          email: string | null
          first_name: string | null
          id: string
          is_active: boolean | null
          is_admin: boolean | null
          last_name: string | null
          phone: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          first_name?: string | null
          id: string
          is_active?: boolean | null
          is_admin?: boolean | null
          last_name?: string | null
          phone?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string | null
          first_name?: string | null
          id?: string
          is_active?: boolean | null
          is_admin?: boolean | null
          last_name?: string | null
          phone?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      questionnaire_responses: {
        Row: {
          additional_info: string | null
          age_group: string | null
          answers_json: Json | null
          behavioral_biases: string | null
          completed: boolean | null
          complex_products: number | null
          created_at: string
          id: string
          income_level: string | null
          investment_composition: string | null
          investment_experience: string | null
          investment_goals: string | null
          investment_knowledge: string | null
          net_worth: string | null
          risk_tolerance: string | null
          time_horizon: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          additional_info?: string | null
          age_group?: string | null
          answers_json?: Json | null
          behavioral_biases?: string | null
          completed?: boolean | null
          complex_products?: number | null
          created_at?: string
          id?: string
          income_level?: string | null
          investment_composition?: string | null
          investment_experience?: string | null
          investment_goals?: string | null
          investment_knowledge?: string | null
          net_worth?: string | null
          risk_tolerance?: string | null
          time_horizon?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          additional_info?: string | null
          age_group?: string | null
          answers_json?: Json | null
          behavioral_biases?: string | null
          completed?: boolean | null
          complex_products?: number | null
          created_at?: string
          id?: string
          income_level?: string | null
          investment_composition?: string | null
          investment_experience?: string | null
          investment_goals?: string | null
          investment_knowledge?: string | null
          net_worth?: string | null
          risk_tolerance?: string | null
          time_horizon?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      reports: {
        Row: {
          article_id: string
          created_at: string
          description: string | null
          file_url: string
          id: string
          title: string
        }
        Insert: {
          article_id: string
          created_at?: string
          description?: string | null
          file_url: string
          id?: string
          title: string
        }
        Update: {
          article_id?: string
          created_at?: string
          description?: string | null
          file_url?: string
          id?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "reports_article_id_fkey"
            columns: ["article_id"]
            isOneToOne: false
            referencedRelation: "articles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_article_by_id: {
        Args: { article_id: string }
        Returns: {
          id: string
          title: string
          slug: string
          description: string
          content: Json
          category: string
          author_name: string
          image_url: string
          published_at: string
          created_at: string
          updated_at: string
          authors: Json
          reports: Json
        }[]
      }
      get_article_by_id_multilingual: {
        Args: { article_id: string }
        Returns: {
          id: string
          title_en: string
          title_zh: string
          slug: string
          description_en: string
          description_zh: string
          content_en: Json
          content_zh: Json
          category_en: string
          category_zh: string
          author_name_en: string
          author_name_zh: string
          image_url: string
          published_at: string
          created_at: string
          updated_at: string
          reports: Json
        }[]
      }
      get_article_by_slug: {
        Args: { slug_param: string }
        Returns: {
          id: string
          title: string
          slug: string
          description: string
          content: Json
          category: string
          author_name: string
          image_url: string
          published_at: string
          created_at: string
          updated_at: string
          authors: Json
          reports: Json
        }[]
      }
      get_article_by_slug_and_language: {
        Args: { slug_param: string; lang?: string }
        Returns: {
          id: string
          title: string
          slug: string
          description: string
          content: Json
          category: string
          author_name: string
          image_url: string
          published_at: string
          created_at: string
          updated_at: string
          authors: Json
          reports: Json
        }[]
      }
      get_articles_by_language: {
        Args: { lang?: string; page_num?: number; page_size?: number }
        Returns: {
          id: string
          title: string
          slug: string
          description: string
          content: Json
          category: string
          author_name: string
          image_url: string
          published_at: string
          created_at: string
          updated_at: string
          total_count: number
        }[]
      }
      get_articles_with_authors: {
        Args: Record<PropertyKey, never>
        Returns: {
          id: string
          title: string
          slug: string
          description: string
          content: Json
          category: string
          author_name: string
          image_url: string
          published_at: string
          created_at: string
          updated_at: string
          authors: Json
        }[]
      }
      get_articles_with_authors_paginated: {
        Args: { page_num?: number; page_size?: number }
        Returns: {
          id: string
          title: string
          slug: string
          description: string
          content: Json
          category: string
          author_name: string
          image_url: string
          published_at: string
          created_at: string
          updated_at: string
          authors: Json
          total_count: number
        }[]
      }
      get_multilingual_articles_paginated: {
        Args: { page_num?: number; page_size?: number }
        Returns: {
          id: string
          title_en: string
          title_zh: string
          slug: string
          description_en: string
          description_zh: string
          content_en: Json
          content_zh: Json
          category_en: string
          category_zh: string
          author_name_en: string
          author_name_zh: string
          image_url: string
          published_at: string
          created_at: string
          updated_at: string
          total_count: number
        }[]
      }
      get_published_articles_paginated: {
        Args: { page_num?: number; page_size?: number }
        Returns: {
          id: string
          title: string
          slug: string
          description: string
          content: Json
          category: string
          author_name: string
          image_url: string
          published_at: string
          created_at: string
          updated_at: string
          authors: Json
          total_count: number
        }[]
      }
      is_admin_user: {
        Args: { user_id: string }
        Returns: boolean
      }
      slugify: {
        Args: { "": string }
        Returns: string
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

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
