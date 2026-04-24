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
      instructors: {
        Row: {
          id: string
          full_name: string
          department: string | null
          is_admin: boolean
          created_at: string
        }
        Insert: {
          id: string
          full_name: string
          department?: string | null
          is_admin?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          full_name?: string
          department?: string | null
          is_admin?: boolean
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'instructors_id_fkey'
            columns: ['id']
            isOneToOne: true
            referencedRelation: 'users'
            referencedColumns: ['id']
          }
        ]
      }
      schedule_entries: {
        Row: {
          id: string
          subject: string
          title: string
          section: string
          days: string[]
          start_time: string
          end_time: string
          room: string
          building: string
          instructor_name: string
          created_at: string
        }
        Insert: {
          id?: string
          subject: string
          title?: string
          section: string
          days: string[]
          start_time: string
          end_time: string
          room: string
          building: string
          instructor_name: string
          created_at?: string
        }
        Update: {
          id?: string
          subject?: string
          title?: string
          section?: string
          days?: string[]
          start_time?: string
          end_time?: string
          room?: string
          building?: string
          instructor_name?: string
          created_at?: string
        }
        Relationships: []
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
