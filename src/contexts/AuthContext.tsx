import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../utils/api';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'candidate' | 'employer';
  isAdmin?: boolean;
  isPremium?: boolean;
  premiumUntil?: string;
  premiumPlan?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (data: { email: string; password: string; name: string; role: 'candidate' | 'employer' }) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isPremium: boolean;
  refreshPremiumStatus: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshPremiumStatus = async () => {
    if (!user) return;
    
    const response = await api.getPremiumStatus();
    if (response.success && response.data) {
      setUser(prev => prev ? {
        ...prev,
        isPremium: response.data.isPremium,
        isAdmin: response.data.isAdmin,
      } : null);
    }
  };

  useEffect(() => {
    // Check if user is already logged in
    const checkAuth = async () => {
      const token = api.getAccessToken();
      if (token) {
        const response = await api.getCurrentUser();
        if (response.success && response.data) {
          setUser(response.data);
        } else {
          api.setAccessToken(null);
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await api.login(email, password);
      
      if (response.success && response.data) {
        api.setAccessToken(response.data.access_token);
        setUser(response.data.user);
        return { success: true };
      }
      
      return { 
        success: false, 
        error: response.error || 'Login nije uspeo' 
      };
    } catch (error) {
      return { 
        success: false, 
        error: 'Došlo je do greške pri prijavljivanju' 
      };
    }
  };

  const signup = async (data: { 
    email: string; 
    password: string; 
    name: string; 
    role: 'candidate' | 'employer' 
  }) => {
    try {
      const response = await api.signup(data);
      
      if (response.success) {
        // Auto login after signup
        const loginResult = await login(data.email, data.password);
        return loginResult;
      }
      
      return { 
        success: false, 
        error: response.error || 'Registracija nije uspela' 
      };
    } catch (error) {
      return { 
        success: false, 
        error: 'Došlo je do greške pri registraciji' 
      };
    }
  };

  const logout = () => {
    api.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        loading, 
        login, 
        signup, 
        logout, 
        isAuthenticated: !!user,
        isAdmin: user?.isAdmin || false,
        isPremium: user?.isPremium || false,
        refreshPremiumStatus,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
