export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          full_name: string | null
          phone: string | null
          address: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          full_name?: string | null
          phone?: string | null
          address?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          phone?: string | null
          address?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      products: {
        Row: {
          id: string
          name: string
          description: string | null
          price: number
          image_url: string | null
          category: string
          stock_quantity: number | null
          is_available: boolean | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          price: number
          image_url?: string | null
          category: string
          stock_quantity?: number | null
          is_available?: boolean | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          price?: number
          image_url?: string | null
          category?: string
          stock_quantity?: number | null
          is_available?: boolean | null
          created_at?: string
          updated_at?: string
        }
      }
      orders: {
        Row: {
          id: string
          user_id: string | null
          status: string
          total_amount: number
          payment_intent_id: string | null
          shipping_address: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          status: string
          total_amount: number
          payment_intent_id?: string | null
          shipping_address?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          status?: string
          total_amount?: number
          payment_intent_id?: string | null
          shipping_address?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      order_items: {
        Row: {
          id: string
          order_id: string | null
          product_id: string | null
          quantity: number
          price_at_time: number
          created_at: string
        }
        Insert: {
          id?: string
          order_id?: string | null
          product_id?: string | null
          quantity: number
          price_at_time: number
          created_at?: string
        }
        Update: {
          id?: string
          order_id?: string | null
          product_id?: string | null
          quantity?: number
          price_at_time?: number
          created_at?: string
        }
      }
      cart_items: {
        Row: {
          id: string
          user_id: string | null
          product_id: string | null
          quantity: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          product_id?: string | null
          quantity: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          product_id?: string | null
          quantity?: number
          created_at?: string
          updated_at?: string
        }
      }
      pre_orders: {
        Row: {
          id: string
          full_name: string
          email: string
          phone: string
          package_type: string
          delivery_address: string
          payment_method: string
          status: string | null
          created_at: string
        }
        Insert: {
          id?: string
          full_name: string
          email: string
          phone: string
          package_type: string
          delivery_address: string
          payment_method: string
          status?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          full_name?: string
          email?: string
          phone?: string
          package_type?: string
          delivery_address?: string
          payment_method?: string
          status?: string | null
          created_at?: string
        }
      }
      lab_partners: {
        Row: {
          id: string
          full_name: string
          lab_name: string
          email: string
          phone: string
          location: string
          message: string | null
          status: string | null
          created_at: string
        }
        Insert: {
          id?: string
          full_name: string
          lab_name: string
          email: string
          phone: string
          location: string
          message?: string | null
          status?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          full_name?: string
          lab_name?: string
          email?: string
          phone?: string
          location?: string
          message?: string | null
          status?: string | null
          created_at?: string
        }
      }
      insurance_partners: {
        Row: {
          id: string
          company_name: string
          contact_person: string
          email: string
          phone: string
          status: string | null
          created_at: string
        }
        Insert: {
          id?: string
          company_name: string
          contact_person: string
          email: string
          phone: string
          status?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          company_name?: string
          contact_person?: string
          email?: string
          phone?: string
          status?: string | null
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}