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
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          phone: string | null
          bio: string | null
          timezone: string
          language: string
          email_notifications: boolean
          push_notifications: boolean
          marketing_emails: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          phone?: string | null
          bio?: string | null
          timezone?: string
          language?: string
          email_notifications?: boolean
          push_notifications?: boolean
          marketing_emails?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          phone?: string | null
          bio?: string | null
          timezone?: string
          language?: string
          email_notifications?: boolean
          push_notifications?: boolean
          marketing_emails?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      workspaces: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          logo_url: string | null
          website: string | null
          industry: string | null
          company_size: string | null
          plan: string
          status: string
          settings: Json
          limits: Json
          usage: Json
          billing: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          description?: string | null
          logo_url?: string | null
          website?: string | null
          industry?: string | null
          company_size?: string | null
          plan?: string
          status?: string
          settings?: Json
          limits?: Json
          usage?: Json
          billing?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          description?: string | null
          logo_url?: string | null
          website?: string | null
          industry?: string | null
          company_size?: string | null
          plan?: string
          status?: string
          settings?: Json
          limits?: Json
          usage?: Json
          billing?: Json
          created_at?: string
          updated_at?: string
        }
      }
      workspace_members: {
        Row: {
          id: string
          workspace_id: string
          user_id: string
          role: string
          permissions: Json
          status: string
          joined_at: string
          last_activity: string
        }
        Insert: {
          id?: string
          workspace_id: string
          user_id: string
          role?: string
          permissions?: Json
          status?: string
          joined_at?: string
          last_activity?: string
        }
        Update: {
          id?: string
          workspace_id?: string
          user_id?: string
          role?: string
          permissions?: Json
          status?: string
          joined_at?: string
          last_activity?: string
        }
      }
      workspace_invites: {
        Row: {
          id: string
          workspace_id: string
          email: string
          role: string
          permissions: Json
          invited_by: string
          status: string
          token: string
          expires_at: string
          accepted_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          workspace_id: string
          email: string
          role?: string
          permissions?: Json
          invited_by: string
          status?: string
          token?: string
          expires_at?: string
          accepted_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          workspace_id?: string
          email?: string
          role?: string
          permissions?: Json
          invited_by?: string
          status?: string
          token?: string
          expires_at?: string
          accepted_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      generate_unique_slug: {
        Args: {
          base_name: string
        }
        Returns: string
      }
      accept_workspace_invite: {
        Args: {
          invite_token: string
        }
        Returns: Json
      }
      is_workspace_member: {
        Args: {
          workspace_uuid: string
          user_uuid?: string
        }
        Returns: boolean
      }
      get_user_workspace_role: {
        Args: {
          workspace_uuid: string
          user_uuid?: string
        }
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