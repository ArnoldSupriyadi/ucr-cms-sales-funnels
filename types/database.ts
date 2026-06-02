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
      roles: {
        Row: {
          id: string
          name: string
          permissions: Json
          is_default: boolean
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          permissions?: Json
          is_default?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          permissions?: Json
          is_default?: boolean
          created_at?: string
        }
        Relationships: []
      }
      users: {
        Row: {
          id: string
          name: string
          email: string
          phone: string | null
          jabatan: string | null
          signature_url: string | null
          role_id: string
          is_active: boolean
          active_session_key: string | null
          created_at: string
        }
        Insert: {
          id: string
          name: string
          email: string
          phone?: string | null
          jabatan?: string | null
          signature_url?: string | null
          role_id: string
          is_active?: boolean
          active_session_key?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          phone?: string | null
          jabatan?: string | null
          signature_url?: string | null
          role_id?: string
          is_active?: boolean
          active_session_key?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "users_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          }
        ]
      }
      login_logs: {
        Row: {
          id: string
          user_id: string
          session_key: string
          ip_address: string | null
          user_agent: string | null
          browser: string | null
          os: string | null
          logged_in_at: string
          logged_out_at: string | null
          is_active: boolean
        }
        Insert: {
          id?: string
          user_id: string
          session_key: string
          ip_address?: string | null
          user_agent?: string | null
          browser?: string | null
          os?: string | null
          logged_in_at?: string
          logged_out_at?: string | null
          is_active?: boolean
        }
        Update: {
          id?: string
          user_id?: string
          session_key?: string
          ip_address?: string | null
          user_agent?: string | null
          browser?: string | null
          os?: string | null
          logged_in_at?: string
          logged_out_at?: string | null
          is_active?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "login_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      leads: {
        Row: {
          id: string
          company_name: string
          address: string | null
          segmen: Database['public']['Enums']['segmen_enum'] | null
          line_business: string | null
          sales_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          company_name: string
          address?: string | null
          segmen?: Database['public']['Enums']['segmen_enum'] | null
          line_business?: string | null
          sales_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          company_name?: string
          address?: string | null
          segmen?: Database['public']['Enums']['segmen_enum'] | null
          line_business?: string | null
          sales_id?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "leads_sales_id_fkey"
            columns: ["sales_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      lead_contacts: {
        Row: {
          id: string
          lead_id: string
          name: string
          position: string | null
          phone: string | null
          email: string | null
          is_primary: boolean
          notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          lead_id: string
          name: string
          position?: string | null
          phone?: string | null
          email?: string | null
          is_primary?: boolean
          notes?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          lead_id?: string
          name?: string
          position?: string | null
          phone?: string | null
          email?: string | null
          is_primary?: boolean
          notes?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "lead_contacts_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          }
        ]
      }
      targets: {
        Row: {
          id: string
          year: number
          month: number
          total_target: number
          segmen: Database['public']['Enums']['segmen_enum'] | null
          set_by: string | null
          created_at: string
        }
        Insert: {
          id?: string
          year: number
          month: number
          total_target: number
          segmen?: Database['public']['Enums']['segmen_enum'] | null
          set_by?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          year?: number
          month?: number
          total_target?: number
          segmen?: Database['public']['Enums']['segmen_enum'] | null
          set_by?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "targets_set_by_fkey"
            columns: ["set_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      orders: {
        Row: {
          id: string
          order_no: string
          lead_id: string
          sales_id: string | null
          status: Database['public']['Enums']['order_status_enum']
          event_date: string
          event_time: string | null
          event_name: string | null
          event_type: string | null
          venue: string | null
          pax: number
          segmen: Database['public']['Enums']['segmen_enum'] | null
          is_exception: boolean
          exception_reason: string | null
          exception_approved_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          order_no: string
          lead_id: string
          sales_id?: string | null
          status?: Database['public']['Enums']['order_status_enum']
          event_date: string
          event_time?: string | null
          event_name?: string | null
          event_type?: string | null
          venue?: string | null
          pax: number
          segmen?: Database['public']['Enums']['segmen_enum'] | null
          is_exception?: boolean
          exception_reason?: string | null
          exception_approved_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          order_no?: string
          lead_id?: string
          sales_id?: string | null
          status?: Database['public']['Enums']['order_status_enum']
          event_date?: string
          event_time?: string | null
          event_name?: string | null
          event_type?: string | null
          venue?: string | null
          pax?: number
          segmen?: Database['public']['Enums']['segmen_enum'] | null
          is_exception?: boolean
          exception_reason?: string | null
          exception_approved_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "orders_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_sales_id_fkey"
            columns: ["sales_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      order_status_logs: {
        Row: {
          id: string
          order_id: string
          from_status: Database['public']['Enums']['order_status_enum'] | null
          to_status: Database['public']['Enums']['order_status_enum']
          changed_by: string | null
          note: string | null
          created_at: string
        }
        Insert: {
          id?: string
          order_id: string
          from_status?: Database['public']['Enums']['order_status_enum'] | null
          to_status: Database['public']['Enums']['order_status_enum']
          changed_by?: string | null
          note?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          order_id?: string
          from_status?: Database['public']['Enums']['order_status_enum'] | null
          to_status?: Database['public']['Enums']['order_status_enum']
          changed_by?: string | null
          note?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "order_status_logs_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          }
        ]
      }
      loa: {
        Row: {
          id: string
          booking_id: string
          doc_no: string
          revision_no: number
          revision_reason: string | null
          status: Database['public']['Enums']['loa_status_enum']
          setup_location: string | null
          service_charge_pct: number
          handling_fee_pct: number
          discount: number
          discount_type: string
          discount_value: number
          sub_total_1: number
          service_charge_amt: number
          sub_total_2: number
          pb1_amt: number
          handling_fee_amt: number
          grand_total: number
          net_revenue: number
          approved_by: string | null
          approved_at: string | null
          approval_token: string | null
          token_expires_at: string | null
          pdf_url: string | null
          created_by: string | null
          created_at: string
        }
        Insert: {
          id?: string
          booking_id: string
          doc_no: string
          revision_no?: number
          revision_reason?: string | null
          status?: Database['public']['Enums']['loa_status_enum']
          setup_location?: string | null
          service_charge_pct?: number
          handling_fee_pct?: number
          discount?: number
          discount_type?: string
          discount_value?: number
          sub_total_1?: number
          service_charge_amt?: number
          sub_total_2?: number
          pb1_amt?: number
          handling_fee_amt?: number
          grand_total?: number
          net_revenue?: number
          approved_by?: string | null
          approved_at?: string | null
          approval_token?: string | null
          token_expires_at?: string | null
          pdf_url?: string | null
          created_by?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          booking_id?: string
          doc_no?: string
          revision_no?: number
          revision_reason?: string | null
          status?: Database['public']['Enums']['loa_status_enum']
          setup_location?: string | null
          service_charge_pct?: number
          handling_fee_pct?: number
          discount?: number
          discount_type?: string
          discount_value?: number
          sub_total_1?: number
          service_charge_amt?: number
          sub_total_2?: number
          pb1_amt?: number
          handling_fee_amt?: number
          grand_total?: number
          net_revenue?: number
          approved_by?: string | null
          approved_at?: string | null
          approval_token?: string | null
          token_expires_at?: string | null
          pdf_url?: string | null
          created_by?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "loa_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: true
            referencedRelation: "orders"
            referencedColumns: ["id"]
          }
        ]
      }
      loa_items: {
        Row: {
          id: string
          loa_id: string
          order_date: string | null
          package_name: string
          menu_detail: string | null
          price_per_pax: number
          pax: number
          amount: number
          sort_order: number
        }
        Insert: {
          id?: string
          loa_id: string
          order_date?: string | null
          package_name: string
          menu_detail?: string | null
          price_per_pax: number
          pax: number
          amount: number
          sort_order?: number
        }
        Update: {
          id?: string
          loa_id?: string
          order_date?: string | null
          package_name?: string
          menu_detail?: string | null
          price_per_pax?: number
          pax?: number
          amount?: number
          sort_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "loa_items_loa_id_fkey"
            columns: ["loa_id"]
            isOneToOne: false
            referencedRelation: "loa"
            referencedColumns: ["id"]
          }
        ]
      }
      ib: {
        Row: {
          id: string
          loa_id: string
          revision_no: number
          revision_reason: string | null
          total_food_cost: number
          total_overhead: number
          grand_total_cogs: number
          gross_profit: number
          gp_pct: number
          suggest_price: number | null
          suggest_net_revenue: number | null
          suggest_gp: number | null
          suggest_gp_pct: number | null
          created_by: string | null
          created_at: string
        }
        Insert: {
          id?: string
          loa_id: string
          revision_no?: number
          revision_reason?: string | null
          total_food_cost?: number
          total_overhead?: number
          grand_total_cogs?: number
          gross_profit?: number
          gp_pct?: number
          suggest_price?: number | null
          suggest_net_revenue?: number | null
          suggest_gp?: number | null
          suggest_gp_pct?: number | null
          created_by?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          loa_id?: string
          revision_no?: number
          revision_reason?: string | null
          total_food_cost?: number
          total_overhead?: number
          grand_total_cogs?: number
          gross_profit?: number
          gp_pct?: number
          suggest_price?: number | null
          suggest_net_revenue?: number | null
          suggest_gp?: number | null
          suggest_gp_pct?: number | null
          created_by?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "ib_loa_id_fkey"
            columns: ["loa_id"]
            isOneToOne: true
            referencedRelation: "loa"
            referencedColumns: ["id"]
          }
        ]
      }
      ib_food_items: {
        Row: {
          id: string
          ib_id: string
          recipe_id: string | null
          menu_name: string
          pax: number
          price_per_pax: number
          total: number
          pct_of_revenue: number | null
          sort_order: number
        }
        Insert: {
          id?: string
          ib_id: string
          recipe_id?: string | null
          menu_name: string
          pax: number
          price_per_pax: number
          total: number
          pct_of_revenue?: number | null
          sort_order?: number
        }
        Update: {
          id?: string
          ib_id?: string
          recipe_id?: string | null
          menu_name?: string
          pax?: number
          price_per_pax?: number
          total?: number
          pct_of_revenue?: number | null
          sort_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "ib_food_items_ib_id_fkey"
            columns: ["ib_id"]
            isOneToOne: false
            referencedRelation: "ib"
            referencedColumns: ["id"]
          }
        ]
      }
      ib_overhead_items: {
        Row: {
          id: string
          ib_id: string
          item_name: string
          qty: number
          unit: string | null
          unit_price: number
          total: number
          pct_of_revenue: number | null
        }
        Insert: {
          id?: string
          ib_id: string
          item_name: string
          qty?: number
          unit?: string | null
          unit_price: number
          total: number
          pct_of_revenue?: number | null
        }
        Update: {
          id?: string
          ib_id?: string
          item_name?: string
          qty?: number
          unit?: string | null
          unit_price?: number
          total?: number
          pct_of_revenue?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "ib_overhead_items_ib_id_fkey"
            columns: ["ib_id"]
            isOneToOne: false
            referencedRelation: "ib"
            referencedColumns: ["id"]
          }
        ]
      }
      beo: {
        Row: {
          id: string
          loa_id: string
          beo_no: string
          revision_no: number
          revision_reason: string | null
          is_emergency: boolean
          person_incharge: string | null
          setup_date: string | null
          setup_time: string | null
          table_arrangement: string | null
          banquet_notes: string | null
          transport_notes: string | null
          total_billing: number | null
          payment_status: Database['public']['Enums']['payment_status_enum']
          created_by: string | null
          created_at: string
        }
        Insert: {
          id?: string
          loa_id: string
          beo_no: string
          revision_no?: number
          revision_reason?: string | null
          is_emergency?: boolean
          person_incharge?: string | null
          setup_date?: string | null
          setup_time?: string | null
          table_arrangement?: string | null
          banquet_notes?: string | null
          transport_notes?: string | null
          total_billing?: number | null
          payment_status?: Database['public']['Enums']['payment_status_enum']
          created_by?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          loa_id?: string
          beo_no?: string
          revision_no?: number
          revision_reason?: string | null
          is_emergency?: boolean
          person_incharge?: string | null
          setup_date?: string | null
          setup_time?: string | null
          table_arrangement?: string | null
          banquet_notes?: string | null
          transport_notes?: string | null
          total_billing?: number | null
          payment_status?: Database['public']['Enums']['payment_status_enum']
          created_by?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "beo_loa_id_fkey"
            columns: ["loa_id"]
            isOneToOne: true
            referencedRelation: "loa"
            referencedColumns: ["id"]
          }
        ]
      }
      master_recipes: {
        Row: {
          id: string
          sku: string
          product_name: string
          menu_structure: string | null
          segment_menu: string | null
          unit_size: number | null
          uom: string | null
          price_per_pax: number | null
          is_active: boolean
          updated_at: string
        }
        Insert: {
          id?: string
          sku: string
          product_name: string
          menu_structure?: string | null
          segment_menu?: string | null
          unit_size?: number | null
          uom?: string | null
          price_per_pax?: number | null
          is_active?: boolean
          updated_at?: string
        }
        Update: {
          id?: string
          sku?: string
          product_name?: string
          menu_structure?: string | null
          segment_menu?: string | null
          unit_size?: number | null
          uom?: string | null
          price_per_pax?: number | null
          is_active?: boolean
          updated_at?: string
        }
        Relationships: []
      }
      menu_packages: {
        Row: {
          id: string
          kategori: string
          sub_kategori: string | null
          nama_paket: string
          harga_per_pax: number | null
          harga_minimum: number | null
          harga_maksimum: number | null
          satuan: string | null
          has_selection: boolean
          is_best_seller: boolean
          ketentuan: string | null
          is_active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          kategori: string
          sub_kategori?: string | null
          nama_paket: string
          harga_per_pax?: number | null
          harga_minimum?: number | null
          harga_maksimum?: number | null
          satuan?: string | null
          has_selection?: boolean
          is_best_seller?: boolean
          ketentuan?: string | null
          is_active?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          kategori?: string
          sub_kategori?: string | null
          nama_paket?: string
          harga_per_pax?: number | null
          harga_minimum?: number | null
          harga_maksimum?: number | null
          satuan?: string | null
          has_selection?: boolean
          is_best_seller?: boolean
          ketentuan?: string | null
          is_active?: boolean
          created_at?: string
        }
        Relationships: []
      }
      menu_package_components: {
        Row: {
          id: string
          package_id: string
          component_type: string
          nama: string
          qty: number
          sort_order: number
        }
        Insert: {
          id?: string
          package_id: string
          component_type: string
          nama: string
          qty?: number
          sort_order?: number
        }
        Update: {
          id?: string
          package_id?: string
          component_type?: string
          nama?: string
          qty?: number
          sort_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "menu_package_components_package_id_fkey"
            columns: ["package_id"]
            isOneToOne: false
            referencedRelation: "menu_packages"
            referencedColumns: ["id"]
          }
        ]
      }
      menu_catalog_categories: {
        Row: {
          id: string
          component_type: string
          nama: string
          selection_rule: string
          parent_id: string | null
          sort_order: number
        }
        Insert: {
          id?: string
          component_type: string
          nama: string
          selection_rule?: string
          parent_id?: string | null
          sort_order?: number
        }
        Update: {
          id?: string
          component_type?: string
          nama?: string
          selection_rule?: string
          parent_id?: string | null
          sort_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "menu_catalog_categories_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "menu_catalog_categories"
            referencedColumns: ["id"]
          }
        ]
      }
      menu_catalog_items: {
        Row: {
          id: string
          category_id: string
          nama: string
          is_active: boolean
          sort_order: number
        }
        Insert: {
          id?: string
          category_id: string
          nama: string
          is_active?: boolean
          sort_order?: number
        }
        Update: {
          id?: string
          category_id?: string
          nama?: string
          is_active?: boolean
          sort_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "menu_catalog_items_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "menu_catalog_categories"
            referencedColumns: ["id"]
          }
        ]
      }
      loa_item_selections: {
        Row: {
          id: string
          loa_item_id: string
          component_name: string
          occasion_no: number
          category_name: string
          item_name: string
          sort_order: number
        }
        Insert: {
          id?: string
          loa_item_id: string
          component_name: string
          occasion_no?: number
          category_name: string
          item_name: string
          sort_order?: number
        }
        Update: {
          id?: string
          loa_item_id?: string
          component_name?: string
          occasion_no?: number
          category_name?: string
          item_name?: string
          sort_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "loa_item_selections_loa_item_id_fkey"
            columns: ["loa_item_id"]
            isOneToOne: false
            referencedRelation: "loa_items"
            referencedColumns: ["id"]
          }
        ]
      }
      overhead_library: {
        Row: {
          id: string
          item_name: string
          default_unit: string | null
          last_unit_price: number | null
          usage_count: number
          updated_at: string
        }
        Insert: {
          id?: string
          item_name: string
          default_unit?: string | null
          last_unit_price?: number | null
          usage_count?: number
          updated_at?: string
        }
        Update: {
          id?: string
          item_name?: string
          default_unit?: string | null
          last_unit_price?: number | null
          usage_count?: number
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: Record<string, never>
    Functions: {
      get_my_role: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      is_admin_or_gm: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
    }
    Enums: {
      segmen_enum: 'Wedding' | 'Private' | 'Corporate' | 'BUMN' | 'Government'
      order_status_enum: 'Tentative' | 'Definite' | 'Actual' | 'Cancel'
      loa_status_enum: 'draft' | 'pending_approval' | 'approved' | 'sent' | 'final' | 'revised'
      payment_status_enum: 'unpaid' | 'partial' | 'paid'
    }
    CompositeTypes: Record<string, never>
  }
}

export type Tables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Row']

export type TablesInsert<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Insert']

export type TablesUpdate<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Update']

export type Enums<T extends keyof Database['public']['Enums']> =
  Database['public']['Enums'][T]
