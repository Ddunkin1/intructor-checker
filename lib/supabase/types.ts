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
      rooms: {
        Row: {
          id: string
          name: string
          building: string | null
          capacity: number | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          building?: string | null
          capacity?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          building?: string | null
          capacity?: number | null
          created_at?: string
        }
        Relationships: []
      }
      instructors: {
        Row: {
          id: string
          full_name: string
          department: string | null
          is_admin: boolean
        }
        Insert: {
          id: string
          full_name: string
          department?: string | null
          is_admin?: boolean
        }
        Update: {
          id?: string
          full_name?: string
          department?: string | null
          is_admin?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "instructors_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      bookings: {
        Row: {
          id: string
          room_id: string
          instructor_id: string
          class_name: string
          date: string
          start_time: string
          end_time: string
          created_at: string
        }
        Insert: {
          id?: string
          room_id: string
          instructor_id: string
          class_name: string
          date: string
          start_time: string
          end_time: string
          created_at?: string
        }
        Update: {
          id?: string
          room_id?: string
          instructor_id?: string
          class_name?: string
          date?: string
          start_time?: string
          end_time?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "bookings_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "rooms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_instructor_id_fkey"
            columns: ["instructor_id"]
            isOneToOne: false
            referencedRelation: "instructors"
            referencedColumns: ["id"]
          }
        ]
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
    CompositeTypes: {
      [_ in never]: never
    }
  }
}