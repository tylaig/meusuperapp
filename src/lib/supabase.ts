import { createClient } from '@supabase/supabase-js';
import { Database } from './database.types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

// Helper functions for workspace operations
export const workspaceService = {
  // Get user's workspaces
  async getUserWorkspaces(userId: string) {
    const { data, error } = await supabase
      .from('workspace_members')
      .select(`
        workspace_id,
        role,
        status,
        joined_at,
        workspaces (
          id,
          name,
          slug,
          description,
          logo_url,
          plan,
          status,
          settings,
          limits,
          usage,
          created_at,
          updated_at
        )
      `)
      .eq('user_id', userId)
      .eq('status', 'active');

    if (error) throw error;
    return data;
  },

  // Get workspace by slug
  async getWorkspaceBySlug(slug: string) {
    const { data, error } = await supabase
      .from('workspaces')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error) throw error;
    return data;
  },

  // Create new workspace
  async createWorkspace(workspaceData: {
    name: string;
    description?: string;
    industry?: string;
    company_size?: string;
  }) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    // Generate unique slug
    const { data: slugData, error: slugError } = await supabase
      .rpc('generate_unique_slug', { base_name: workspaceData.name });

    if (slugError) throw slugError;

    // Create workspace
    const { data: workspace, error: workspaceError } = await supabase
      .from('workspaces')
      .insert({
        name: workspaceData.name,
        slug: slugData,
        description: workspaceData.description,
        industry: workspaceData.industry,
        company_size: workspaceData.company_size
      })
      .select()
      .single();

    if (workspaceError) throw workspaceError;

    // Add user as owner
    const { error: memberError } = await supabase
      .from('workspace_members')
      .insert({
        workspace_id: workspace.id,
        user_id: user.id,
        role: 'owner'
      });

    if (memberError) throw memberError;

    return workspace;
  },

  // Invite user to workspace
  async inviteUser(workspaceId: string, email: string, role: 'admin' | 'member', permissions?: any) {
    const { data, error } = await supabase
      .from('workspace_invites')
      .insert({
        workspace_id: workspaceId,
        email,
        role,
        permissions: permissions || {},
        invited_by: (await supabase.auth.getUser()).data.user?.id
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Accept invite
  async acceptInvite(token: string) {
    const { data, error } = await supabase
      .rpc('accept_workspace_invite', { invite_token: token });

    if (error) throw error;
    return data;
  },

  // Get workspace members
  async getWorkspaceMembers(workspaceId: string) {
    const { data, error } = await supabase
      .from('workspace_members')
      .select(`
        id,
        role,
        permissions,
        status,
        joined_at,
        last_activity,
        profiles (
          id,
          email,
          full_name,
          avatar_url
        )
      `)
      .eq('workspace_id', workspaceId)
      .eq('status', 'active');

    if (error) throw error;
    return data;
  },

  // Get workspace invites
  async getWorkspaceInvites(workspaceId: string) {
    const { data, error } = await supabase
      .from('workspace_invites')
      .select(`
        id,
        email,
        role,
        status,
        expires_at,
        created_at,
        profiles!workspace_invites_invited_by_fkey (
          full_name,
          email
        )
      `)
      .eq('workspace_id', workspaceId)
      .in('status', ['pending']);

    if (error) throw error;
    return data;
  },

  // Update workspace
  async updateWorkspace(workspaceId: string, updates: Partial<any>) {
    const { data, error } = await supabase
      .from('workspaces')
      .update(updates)
      .eq('id', workspaceId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Remove member from workspace
  async removeMember(workspaceId: string, userId: string) {
    const { error } = await supabase
      .from('workspace_members')
      .delete()
      .eq('workspace_id', workspaceId)
      .eq('user_id', userId);

    if (error) throw error;
  },

  // Update member role
  async updateMemberRole(workspaceId: string, userId: string, role: string, permissions?: any) {
    const { data, error } = await supabase
      .from('workspace_members')
      .update({ 
        role, 
        permissions: permissions || {},
        last_activity: new Date().toISOString()
      })
      .eq('workspace_id', workspaceId)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
};