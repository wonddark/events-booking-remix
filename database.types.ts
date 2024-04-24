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
      categories: {
        Row: {
          id: string
          name: string
        }
        Insert: {
          id?: string
          name: string
        }
        Update: {
          id?: string
          name?: string
        }
        Relationships: []
      }
      events: {
        Row: {
          category_id: string
          description: string
          end_date: string
          id: string
          img_url: string | null
          max_attendees: number
          name: string
          published_at: string
          start_date: string
          user_id: string
          name_description: string | null
        }
        Insert: {
          category_id?: string
          description: string
          end_date: string
          id?: string
          img_url?: string | null
          max_attendees: number
          name: string
          published_at?: string
          start_date: string
          user_id?: string
        }
        Update: {
          category_id?: string
          description?: string
          end_date?: string
          id?: string
          img_url?: string | null
          max_attendees?: number
          name?: string
          published_at?: string
          start_date?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "public_Events_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "public_Events_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "event_owner"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "public_Events_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar: string | null
          display_name: string | null
          first_name: string | null
          last_name: string | null
          user_id: string
        }
        Insert: {
          avatar?: string | null
          display_name?: string | null
          first_name?: string | null
          last_name?: string | null
          user_id: string
        }
        Update: {
          avatar?: string | null
          display_name?: string | null
          first_name?: string | null
          last_name?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "public_Users_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "event_owner"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "public_Users_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      tickets: {
        Row: {
          event_id: string
          id: string
          user_id: string
        }
        Insert: {
          event_id: string
          id?: string
          user_id: string
        }
        Update: {
          event_id?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "public_Tickets_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "public_Tickets_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "event_owner"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "public_Tickets_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      event_owner: {
        Row: {
          avatar: string | null
          display_name: string | null
          first_name: string | null
          last_name: string | null
          user_email: string | null
          user_id: string | null
          user_phone: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      name_description: {
        Args: {
          "": unknown
        }
        Returns: string
      }
      tickets_for_user_events: {
        Args: {
          auth_user: string
        }
        Returns: string[]
      }
      tickets_registration_check: {
        Args: {
          uid: string
        }
        Returns: string[]
      }
      user_events: {
        Args: {
          userid: string
        }
        Returns: string[]
      }
      user_events_v2: {
        Args: {
          user_id: string
        }
        Returns: Record<string, unknown>[]
      }
      user_own_tickets: {
        Args: {
          user_id: string
        }
        Returns: string[]
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
