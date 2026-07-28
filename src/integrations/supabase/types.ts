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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      categories: {
        Row: {
          active: boolean
          created_at: string
          id: string
          name: string
          sort_order: number
          store_id: string
          updated_at: string
        }
        Insert: {
          active?: boolean
          created_at?: string
          id?: string
          name: string
          sort_order?: number
          store_id: string
          updated_at?: string
        }
        Update: {
          active?: boolean
          created_at?: string
          id?: string
          name?: string
          sort_order?: number
          store_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "categories_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
        ]
      }
      comanda_items: {
        Row: {
          comanda_id: string
          created_at: string
          doneness: string | null
          id: string
          notes: string | null
          printed: boolean
          product_id: string | null
          product_name: string
          quantity: number
          store_id: string
          unit_price_cents: number
        }
        Insert: {
          comanda_id: string
          created_at?: string
          doneness?: string | null
          id?: string
          notes?: string | null
          printed?: boolean
          product_id?: string | null
          product_name: string
          quantity?: number
          store_id: string
          unit_price_cents?: number
        }
        Update: {
          comanda_id?: string
          created_at?: string
          doneness?: string | null
          id?: string
          notes?: string | null
          printed?: boolean
          product_id?: string | null
          product_name?: string
          quantity?: number
          store_id?: string
          unit_price_cents?: number
        }
        Relationships: [
          {
            foreignKeyName: "comanda_items_comanda_id_fkey"
            columns: ["comanda_id"]
            isOneToOne: false
            referencedRelation: "comandas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comanda_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comanda_items_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
        ]
      }
      comandas: {
        Row: {
          closed_at: string | null
          created_at: string
          created_by: string | null
          customer_name: string | null
          discount_cents: number
          id: string
          notes: string | null
          opened_at: string
          status: Database["public"]["Enums"]["comanda_status"]
          store_id: string
          table_number: string | null
          total_cents: number
          updated_at: string
        }
        Insert: {
          closed_at?: string | null
          created_at?: string
          created_by?: string | null
          customer_name?: string | null
          discount_cents?: number
          id?: string
          notes?: string | null
          opened_at?: string
          status?: Database["public"]["Enums"]["comanda_status"]
          store_id: string
          table_number?: string | null
          total_cents?: number
          updated_at?: string
        }
        Update: {
          closed_at?: string | null
          created_at?: string
          created_by?: string | null
          customer_name?: string | null
          discount_cents?: number
          id?: string
          notes?: string | null
          opened_at?: string
          status?: Database["public"]["Enums"]["comanda_status"]
          store_id?: string
          table_number?: string | null
          total_cents?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "comandas_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
        ]
      }
      expenses: {
        Row: {
          amount_cents: number
          category: string | null
          created_at: string
          created_by: string | null
          description: string
          id: string
          payment_method: Database["public"]["Enums"]["payment_method"]
          spent_at: string
          store_id: string
        }
        Insert: {
          amount_cents?: number
          category?: string | null
          created_at?: string
          created_by?: string | null
          description: string
          id?: string
          payment_method?: Database["public"]["Enums"]["payment_method"]
          spent_at?: string
          store_id: string
        }
        Update: {
          amount_cents?: number
          category?: string | null
          created_at?: string
          created_by?: string | null
          description?: string
          id?: string
          payment_method?: Database["public"]["Enums"]["payment_method"]
          spent_at?: string
          store_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "expenses_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          active: boolean
          category_id: string | null
          cost_cents: number
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          is_meat: boolean
          min_stock: number
          name: string
          price_cents: number
          sort_order: number
          stock_quantity: number
          store_id: string
          track_stock: boolean
          updated_at: string
        }
        Insert: {
          active?: boolean
          category_id?: string | null
          cost_cents?: number
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          is_meat?: boolean
          min_stock?: number
          name: string
          price_cents?: number
          sort_order?: number
          stock_quantity?: number
          store_id: string
          track_stock?: boolean
          updated_at?: string
        }
        Update: {
          active?: boolean
          category_id?: string | null
          cost_cents?: number
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          is_meat?: boolean
          min_stock?: number
          name?: string
          price_cents?: number
          sort_order?: number
          stock_quantity?: number
          store_id?: string
          track_stock?: boolean
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "products_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "products_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
        ]
      }
      sales: {
        Row: {
          comanda_id: string | null
          cost_cents: number
          created_at: string
          created_by: string | null
          discount_cents: number
          id: string
          notes: string | null
          paid_at: string
          payment_method: Database["public"]["Enums"]["payment_method"]
          store_id: string
          total_cents: number
        }
        Insert: {
          comanda_id?: string | null
          cost_cents?: number
          created_at?: string
          created_by?: string | null
          discount_cents?: number
          id?: string
          notes?: string | null
          paid_at?: string
          payment_method?: Database["public"]["Enums"]["payment_method"]
          store_id: string
          total_cents?: number
        }
        Update: {
          comanda_id?: string | null
          cost_cents?: number
          created_at?: string
          created_by?: string | null
          discount_cents?: number
          id?: string
          notes?: string | null
          paid_at?: string
          payment_method?: Database["public"]["Enums"]["payment_method"]
          store_id?: string
          total_cents?: number
        }
        Relationships: [
          {
            foreignKeyName: "sales_comanda_id_fkey"
            columns: ["comanda_id"]
            isOneToOne: false
            referencedRelation: "comandas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sales_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
        ]
      }
      stock_movements: {
        Row: {
          comanda_id: string | null
          created_at: string
          created_by: string | null
          id: string
          move_type: Database["public"]["Enums"]["stock_move_type"]
          product_id: string
          quantity_delta: number
          reason: string | null
          store_id: string
        }
        Insert: {
          comanda_id?: string | null
          created_at?: string
          created_by?: string | null
          id?: string
          move_type: Database["public"]["Enums"]["stock_move_type"]
          product_id: string
          quantity_delta: number
          reason?: string | null
          store_id: string
        }
        Update: {
          comanda_id?: string | null
          created_at?: string
          created_by?: string | null
          id?: string
          move_type?: Database["public"]["Enums"]["stock_move_type"]
          product_id?: string
          quantity_delta?: number
          reason?: string | null
          store_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "stock_movements_comanda_id_fkey"
            columns: ["comanda_id"]
            isOneToOne: false
            referencedRelation: "comandas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "stock_movements_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "stock_movements_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
        ]
      }
      stores: {
        Row: {
          active: boolean
          address: string | null
          created_at: string
          current_period_end: string | null
          id: string
          logo_url: string | null
          monthly_price_cents: number
          mp_customer_id: string | null
          mp_preapproval_id: string | null
          name: string
          notes: string | null
          owner_user_id: string
          phone: string | null
          printer_ip: string | null
          subscription_status: Database["public"]["Enums"]["subscription_status"]
          trial_ends_at: string
          updated_at: string
        }
        Insert: {
          active?: boolean
          address?: string | null
          created_at?: string
          current_period_end?: string | null
          id?: string
          logo_url?: string | null
          monthly_price_cents?: number
          mp_customer_id?: string | null
          mp_preapproval_id?: string | null
          name: string
          notes?: string | null
          owner_user_id: string
          phone?: string | null
          printer_ip?: string | null
          subscription_status?: Database["public"]["Enums"]["subscription_status"]
          trial_ends_at?: string
          updated_at?: string
        }
        Update: {
          active?: boolean
          address?: string | null
          created_at?: string
          current_period_end?: string | null
          id?: string
          logo_url?: string | null
          monthly_price_cents?: number
          mp_customer_id?: string | null
          mp_preapproval_id?: string | null
          name?: string
          notes?: string | null
          owner_user_id?: string
          phone?: string | null
          printer_ip?: string | null
          subscription_status?: Database["public"]["Enums"]["subscription_status"]
          trial_ends_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      subscription_payments: {
        Row: {
          amount_cents: number
          created_at: string
          id: string
          method: string | null
          mp_payment_id: string | null
          paid_at: string | null
          raw_payload: Json | null
          status: string
          store_id: string
        }
        Insert: {
          amount_cents?: number
          created_at?: string
          id?: string
          method?: string | null
          mp_payment_id?: string | null
          paid_at?: string | null
          raw_payload?: Json | null
          status: string
          store_id: string
        }
        Update: {
          amount_cents?: number
          created_at?: string
          id?: string
          method?: string | null
          mp_payment_id?: string | null
          paid_at?: string | null
          raw_payload?: Json | null
          status?: string
          store_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "subscription_payments_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
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
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      can_access_store: { Args: { _store_id: string }; Returns: boolean }
      current_user_store_id: { Args: never; Returns: string }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      seed_store_catalog: { Args: { _store_id: string }; Returns: undefined }
    }
    Enums: {
      app_role: "super_admin" | "store_owner"
      comanda_status: "open" | "paid" | "cancelled"
      payment_method: "cash" | "pix" | "credit" | "debit" | "other"
      stock_move_type: "in" | "out" | "adjust" | "sale" | "return"
      subscription_status:
        | "trial"
        | "active"
        | "past_due"
        | "suspended"
        | "cancelled"
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
      app_role: ["super_admin", "store_owner"],
      comanda_status: ["open", "paid", "cancelled"],
      payment_method: ["cash", "pix", "credit", "debit", "other"],
      stock_move_type: ["in", "out", "adjust", "sale", "return"],
      subscription_status: [
        "trial",
        "active",
        "past_due",
        "suspended",
        "cancelled",
      ],
    },
  },
} as const
