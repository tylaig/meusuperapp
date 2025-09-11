import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import { User, AuthState } from '../types';

interface AuthContextType extends AuthState {
  login: (email: string, password: string, rememberMe?: boolean) => Promise<void>;
  logout: () => void;
  forgotPassword: (email: string) => Promise<void>;
  socialLogin: (provider: 'google' | 'facebook') => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });

  useEffect(() => {
    // Check for existing Supabase session
    const checkAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
          setAuthState({
            user: null,
            isAuthenticated: false,
            isLoading: false,
          });
          return;
        }

        if (session?.user) {
          // Get user profile
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (profileError) {
            console.error('Error getting profile:', profileError);
            setAuthState({
              user: null,
              isAuthenticated: false,
              isLoading: false,
            });
            return;
          }

          const user: User = {
            id: profile.id,
            name: profile.full_name || profile.email.split('@')[0],
            email: profile.email,
            avatar: profile.avatar_url,
            role: 'owner', // Will be determined by workspace context
            organizationId: '', // Will be set when workspace is selected
            permissions: ['*'],
            createdAt: profile.created_at,
            lastLogin: new Date().toISOString(),
          };

          setAuthState({
            user,
            isAuthenticated: true,
            isLoading: false,
          });
        } else {
          setAuthState({
            user: null,
            isAuthenticated: false,
            isLoading: false,
          });
        }
      } catch (error) {
        console.error('Auth check error:', error);
        setAuthState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
        });
      }
    };

    checkAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          checkAuth();
        } else if (event === 'SIGNED_OUT') {
          setAuthState({
            user: null,
            isAuthenticated: false,
            isLoading: false,
          });
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string, rememberMe = false) => {
    setAuthState(prev => ({ ...prev, isLoading: true }));
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        // Get user profile
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single();

        if (profileError) throw profileError;

        const user: User = {
          id: profile.id,
          name: profile.full_name || profile.email.split('@')[0],
          email: profile.email,
          avatar: profile.avatar_url,
          role: 'owner',
          organizationId: '',
          permissions: ['*'],
          createdAt: profile.created_at,
          lastLogin: new Date().toISOString(),
        };

        setAuthState({
          user,
          isAuthenticated: true,
          isLoading: false,
        });

        // Redirect to dashboard
        window.location.href = '/dashboard';
      }
    } catch (error) {
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
      throw error;
    }
  };

  const logout = () => {
    supabase.auth.signOut().then(() => {
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
      
      // Redirect to home
      window.location.href = '/';
    });
  };

  const forgotPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    
    if (error) throw error;
  };

  const socialLogin = async (provider: 'google' | 'facebook') => {
    setAuthState(prev => ({ ...prev, isLoading: true }));
    
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: provider === 'google' ? 'google' : 'facebook',
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
        }
      });

      if (error) throw error;
    } catch (error) {
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        ...authState,
        login,
        logout,
        forgotPassword,
        socialLogin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};