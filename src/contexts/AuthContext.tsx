import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
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
    // Check for existing authentication
    const checkAuth = () => {
      const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
      const userData = localStorage.getItem('userData') || sessionStorage.getItem('userData');
      
      if (token && userData) {
        try {
          const user = JSON.parse(userData);
          setAuthState({
            user,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          // Invalid stored data, clear it
          localStorage.removeItem('authToken');
          localStorage.removeItem('userData');
          sessionStorage.removeItem('authToken');
          sessionStorage.removeItem('userData');
          setAuthState({
            user: null,
            isAuthenticated: false,
            isLoading: false,
          });
        }
      } else {
        setAuthState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
        });
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string, rememberMe = false) => {
    setAuthState(prev => ({ ...prev, isLoading: true }));
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock user data
      const user: User = {
        id: '1',
        name: 'João Silva',
        email,
        avatar: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
        role: 'owner',
        organizationId: 'org-1',
        permissions: ['*'],
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
      };

      const token = 'mock-jwt-token';
      
      if (rememberMe) {
        localStorage.setItem('authToken', token);
        localStorage.setItem('userData', JSON.stringify(user));
      } else {
        sessionStorage.setItem('authToken', token);
        sessionStorage.setItem('userData', JSON.stringify(user));
      }

      setAuthState({
        user,
        isAuthenticated: true,
        isLoading: false,
      });

      // Redirect to dashboard
      window.location.href = '/dashboard';
    } catch (error) {
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
      throw new Error('Credenciais inválidas');
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    sessionStorage.removeItem('authToken');
    sessionStorage.removeItem('userData');
    
    setAuthState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });

    // Redirect to home
    window.location.href = '/';
  };

  const forgotPassword = async (email: string) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('Password reset email sent to:', email);
  };

  const socialLogin = async (provider: 'google' | 'facebook') => {
    setAuthState(prev => ({ ...prev, isLoading: true }));
    
    try {
      // Simulate social login
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const user: User = {
        id: '1',
        name: 'João Silva',
        email: 'joao@meusuper.app',
        avatar: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
        role: 'owner',
        organizationId: 'org-1',
        permissions: ['*'],
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
      };

      const token = 'mock-social-jwt-token';
      localStorage.setItem('authToken', token);
      localStorage.setItem('userData', JSON.stringify(user));

      setAuthState({
        user,
        isAuthenticated: true,
        isLoading: false,
      });

      // Redirect to dashboard
      window.location.href = '/dashboard';
    } catch (error) {
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
      throw new Error(`Erro no login com ${provider}`);
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