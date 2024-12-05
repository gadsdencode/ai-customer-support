// /app/types/supabaseTypes.ts

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
          profiles: {  // Move this inside Tables
            Row: {
              id: string
              full_name: string | null
              email: string | null
              role: string | null
              avatar: string | null
              company: string | null
              location: string | null
              department: string | null
              industry: string | null
              personal_interests: string[] | null
              professional_interests: string[] | null
              keywords: string[] | null
              key_information: string | null
              created_at: string | null
              updated_at: string | null
            }
            Insert: {
              id: string
              full_name?: string | null
              email?: string | null
              role?: string | null
              avatar?: string | null
              company?: string | null
              location?: string | null
              department?: string | null
              industry?: string | null
              personal_interests?: string[] | null
              professional_interests?: string[] | null
              keywords?: string[] | null
              key_information?: string | null
              created_at?: string | null
              updated_at?: string | null
            }
            Update: {
              id?: string
              full_name?: string | null
              email?: string | null
              role?: string | null
              avatar?: string | null
              company?: string | null
              location?: string | null
              department?: string | null
              industry?: string | null
              personal_interests?: string[] | null
              professional_interests?: string[] | null
              keywords?: string[] | null
              key_information?: string | null
              created_at?: string | null
              updated_at?: string | null
            }
            Relationships: [
              {
                foreignKeyName: "profiles_id_fkey"
                columns: ["id"]
                isOneToOne: true
                referencedRelation: "users"
                referencedColumns: ["id"]
              }
            ]
          }
      comments: {
        Row: {
          content: string
          created_at: string | null
          id: string
          poll_id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          poll_id: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          poll_id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      countries: {
        Row: {
          id: number
          name: string
        }
        Insert: {
          id?: never
          name: string
        }
        Update: {
          id?: never
          name?: string
        }
        Relationships: []
      }
      "inteleos-context-document": {
        Row: {
          content: string | null
          created_at: string
          cx_data: string | null
          id: number
        }
        Insert: {
          content?: string | null
          created_at?: string
          cx_data?: string | null
          id?: number
        }
        Update: {
          content?: string | null
          created_at?: string
          cx_data?: string | null
          id?: number
        }
        Relationships: []
      }
      poll_options: {
        Row: {
          id: string
          option_text: string
          poll_id: string | null
          votes: number | null
        }
        Insert: {
          id?: string
          option_text: string
          poll_id?: string | null
          votes?: number | null
        }
        Update: {
          id?: string
          option_text?: string
          poll_id?: string | null
          votes?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "poll_options_poll_id_fkey"
            columns: ["poll_id"]
            isOneToOne: false
            referencedRelation: "poll_results"
            referencedColumns: ["poll_id"]
          },
          {
            foreignKeyName: "poll_options_poll_id_fkey"
            columns: ["poll_id"]
            isOneToOne: false
            referencedRelation: "polls"
            referencedColumns: ["id"]
          },
        ]
      }
      polls: {
        Row: {
          created_at: string | null
          id: string
          question: string
          topic: string | null
          total_votes: number | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          question: string
          topic?: string | null
          total_votes?: number | null
        }
        Update: {
          created_at?: string | null
          id?: string
          question?: string
          topic?: string | null
          total_votes?: number | null
        }
        Relationships: []
      }
      votes: {
        Row: {
          created_at: string | null
          id: string
          option_id: string
          poll_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          option_id: string
          poll_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          option_id?: string
          poll_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "votes_option_id_fkey"
            columns: ["option_id"]
            isOneToOne: false
            referencedRelation: "poll_options"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "votes_option_id_fkey"
            columns: ["option_id"]
            isOneToOne: false
            referencedRelation: "poll_results"
            referencedColumns: ["option_id"]
          },
          {
            foreignKeyName: "votes_poll_id_fkey"
            columns: ["poll_id"]
            isOneToOne: false
            referencedRelation: "poll_results"
            referencedColumns: ["poll_id"]
          },
          {
            foreignKeyName: "votes_poll_id_fkey"
            columns: ["poll_id"]
            isOneToOne: false
            referencedRelation: "polls"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      poll_results: {
        Row: {
          option_id: string | null
          option_text: string | null
          poll_id: string | null
          question: string | null
          topic: string | null
          total_votes: number | null
          vote_percentage: number | null
          votes: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      has_user_voted: {
        Args: {
          p_poll_id: string
          p_user_id: string
        }
        Returns: boolean
      }
      increment_vote:
        | {
            Args: {
              option_id: string
            }
            Returns: undefined
          }
        | {
            Args: {
              p_option_id: string
              p_user_id: string
            }
            Returns: undefined
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

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
