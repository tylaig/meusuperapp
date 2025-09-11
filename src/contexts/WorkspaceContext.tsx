import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase, workspaceService } from '../lib/supabase';
import { useAuth } from './AuthContext';

interface Workspace {
  id: string;
  name: string;
  slug: string;
  description?: string;
  logo_url?: string;
  website?: string;
  industry?: string;
  company_size?: string;
  plan: 'starter' | 'pro' | 'enterprise';
  status: 'active' | 'suspended' | 'cancelled';
  settings: any;
  limits: any;
  usage: any;
  billing: any;
  created_at: string;
  updated_at: string;
  role?: string; // User's role in this workspace
}

interface WorkspaceMember {
  id: string;
  role: string;
  permissions: any;
  status: string;
  joined_at: string;
  last_activity: string;
  profiles: {
    id: string;
    email: string;
    full_name: string;
    avatar_url?: string;
  };
}

interface WorkspaceInvite {
  id: string;
  email: string;
  role: string;
  status: string;
  expires_at: string;
  created_at: string;
  profiles: {
    full_name: string;
    email: string;
  };
}

interface WorkspaceContextType {
  workspaces: Workspace[];
  currentWorkspace: Workspace | null;
  members: WorkspaceMember[];
  invites: WorkspaceInvite[];
  isLoading: boolean;
  
  // Workspace operations
  selectWorkspace: (workspaceId: string) => Promise<void>;
  createWorkspace: (data: {
    name: string;
    description?: string;
    industry?: string;
    company_size?: string;
  }) => Promise<Workspace>;
  updateWorkspace: (workspaceId: string, updates: Partial<Workspace>) => Promise<void>;
  
  // Member operations
  inviteUser: (email: string, role: 'admin' | 'member', permissions?: any) => Promise<void>;
  removeMember: (userId: string) => Promise<void>;
  updateMemberRole: (userId: string, role: string, permissions?: any) => Promise<void>;
  
  // Invite operations
  cancelInvite: (inviteId: string) => Promise<void>;
  resendInvite: (inviteId: string) => Promise<void>;
  
  // Utility functions
  hasPermission: (permission: string) => boolean;
  isOwner: () => boolean;
  isAdmin: () => boolean;
}

const WorkspaceContext = createContext<WorkspaceContextType | undefined>(undefined);

export const useWorkspace = () => {
  const context = useContext(WorkspaceContext);
  if (context === undefined) {
    throw new Error('useWorkspace must be used within a WorkspaceProvider');
  }
  return context;
};

interface WorkspaceProviderProps {
  children: ReactNode;
}

export const WorkspaceProvider: React.FC<WorkspaceProviderProps> = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [currentWorkspace, setCurrentWorkspace] = useState<Workspace | null>(null);
  const [members, setMembers] = useState<WorkspaceMember[]>([]);
  const [invites, setInvites] = useState<WorkspaceInvite[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated && user) {
      loadUserWorkspaces();
    }
  }, [isAuthenticated, user]);

  useEffect(() => {
    if (currentWorkspace) {
      loadWorkspaceMembers();
      loadWorkspaceInvites();
    }
  }, [currentWorkspace]);

  const loadUserWorkspaces = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const data = await workspaceService.getUserWorkspaces(user.id);
      
      const workspacesWithRole = data.map(item => ({
        ...item.workspaces,
        role: item.role
      }));
      
      setWorkspaces(workspacesWithRole);
      
      // Auto-select first workspace if none selected
      if (!currentWorkspace && workspacesWithRole.length > 0) {
        setCurrentWorkspace(workspacesWithRole[0]);
      }
    } catch (error) {
      console.error('Error loading workspaces:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadWorkspaceMembers = async () => {
    if (!currentWorkspace) return;
    
    try {
      const data = await workspaceService.getWorkspaceMembers(currentWorkspace.id);
      setMembers(data);
    } catch (error) {
      console.error('Error loading workspace members:', error);
    }
  };

  const loadWorkspaceInvites = async () => {
    if (!currentWorkspace) return;
    
    try {
      const data = await workspaceService.getWorkspaceInvites(currentWorkspace.id);
      setInvites(data);
    } catch (error) {
      console.error('Error loading workspace invites:', error);
    }
  };

  const selectWorkspace = async (workspaceId: string) => {
    const workspace = workspaces.find(w => w.id === workspaceId);
    if (workspace) {
      setCurrentWorkspace(workspace);
      
      // Store selected workspace in localStorage
      localStorage.setItem('selectedWorkspaceId', workspaceId);
    }
  };

  const createWorkspace = async (data: {
    name: string;
    description?: string;
    industry?: string;
    company_size?: string;
  }) => {
    const workspace = await workspaceService.createWorkspace(data);
    
    // Reload workspaces to include the new one
    await loadUserWorkspaces();
    
    return workspace;
  };

  const updateWorkspace = async (workspaceId: string, updates: Partial<Workspace>) => {
    await workspaceService.updateWorkspace(workspaceId, updates);
    
    // Update local state
    setWorkspaces(prev => prev.map(w => 
      w.id === workspaceId ? { ...w, ...updates } : w
    ));
    
    if (currentWorkspace?.id === workspaceId) {
      setCurrentWorkspace(prev => prev ? { ...prev, ...updates } : null);
    }
  };

  const inviteUser = async (email: string, role: 'admin' | 'member', permissions?: any) => {
    if (!currentWorkspace) throw new Error('No workspace selected');
    
    await workspaceService.inviteUser(currentWorkspace.id, email, role, permissions);
    await loadWorkspaceInvites();
  };

  const removeMember = async (userId: string) => {
    if (!currentWorkspace) throw new Error('No workspace selected');
    
    await workspaceService.removeMember(currentWorkspace.id, userId);
    await loadWorkspaceMembers();
  };

  const updateMemberRole = async (userId: string, role: string, permissions?: any) => {
    if (!currentWorkspace) throw new Error('No workspace selected');
    
    await workspaceService.updateMemberRole(currentWorkspace.id, userId, role, permissions);
    await loadWorkspaceMembers();
  };

  const cancelInvite = async (inviteId: string) => {
    const { error } = await supabase
      .from('workspace_invites')
      .update({ status: 'cancelled' })
      .eq('id', inviteId);
    
    if (error) throw error;
    await loadWorkspaceInvites();
  };

  const resendInvite = async (inviteId: string) => {
    const { error } = await supabase
      .from('workspace_invites')
      .update({ 
        expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', inviteId);
    
    if (error) throw error;
    await loadWorkspaceInvites();
  };

  const hasPermission = (permission: string): boolean => {
    if (!currentWorkspace || !user) return false;
    
    const member = members.find(m => m.profiles.id === user.id);
    if (!member) return false;
    
    // Owners have all permissions
    if (member.role === 'owner') return true;
    
    // Check specific permission
    const permissions = member.permissions || {};
    const [category, action] = permission.split('.');
    
    return permissions[category]?.[action] === true;
  };

  const isOwner = (): boolean => {
    if (!currentWorkspace || !user) return false;
    const member = members.find(m => m.profiles.id === user.id);
    return member?.role === 'owner';
  };

  const isAdmin = (): boolean => {
    if (!currentWorkspace || !user) return false;
    const member = members.find(m => m.profiles.id === user.id);
    return member?.role === 'admin' || member?.role === 'owner';
  };

  return (
    <WorkspaceContext.Provider
      value={{
        workspaces,
        currentWorkspace,
        members,
        invites,
        isLoading,
        selectWorkspace,
        createWorkspace,
        updateWorkspace,
        inviteUser,
        removeMember,
        updateMemberRole,
        cancelInvite,
        resendInvite,
        hasPermission,
        isOwner,
        isAdmin,
      }}
    >
      {children}
    </WorkspaceContext.Provider>
  );
};