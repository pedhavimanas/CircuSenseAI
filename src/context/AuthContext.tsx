import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthUser, UserRole } from '../types';

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  resetPassword: (email: string) => Promise<{ success: boolean; error?: string }>;
  loginWithDemo: () => void;
  loginWithAdminDemo: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = 'circusense_auth_user';

function normalizeStoredUser(raw: any): AuthUser {
  // Only explicitly designated 'admin' role receives admin authorization
  const role: UserRole = raw.role === 'admin' ? 'admin' : 'user';

  // If raw.role was a legacy occupational title (not 'user' and not 'admin'), preserve as title
  let title = raw.title;
  if (!title && raw.role && raw.role !== 'user' && raw.role !== 'admin') {
    title = String(raw.role);
  }
  if (!title) {
    title = role === 'admin' ? 'Platform Director' : 'Senior Hardware Diagnostic Engineer';
  }

  return {
    id: String(raw.id || `usr-${Date.now().toString(36)}`),
    name: String(raw.name || 'PCB Engineer'),
    email: String(raw.email || ''),
    role,
    title,
    avatar: raw.avatar,
    createdAt: String(raw.createdAt || new Date().toISOString())
  };
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Load and normalize user from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && parsed.email) {
          const normalized = normalizeStoredUser(parsed);
          setUser(normalized);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
        }
      }
    } catch (e) {
      console.warn('Failed to parse stored auth user', e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    // Artificial small latency for realistic engineering SaaS feedback
    await new Promise((resolve) => setTimeout(resolve, 500));

    const trimmedEmail = email.trim().toLowerCase();
    if (!trimmedEmail) {
      return { success: false, error: 'Please enter your email.' };
    }
    if (!password) {
      return { success: false, error: 'Password is required.' };
    }

    // Default registered users or simulated auth
    // Name derived from email prefix or demo user
    let displayName = 'PCB Engineer';
    if (trimmedEmail.includes('@')) {
      const prefix = trimmedEmail.split('@')[0];
      displayName = prefix.charAt(0).toUpperCase() + prefix.slice(1);
    }

    const authUser: AuthUser = {
      id: `usr-${Date.now().toString(36)}`,
      name: displayName,
      email: trimmedEmail,
      role: 'user',
      title: 'Senior Hardware Diagnostic Engineer',
      createdAt: new Date().toISOString()
    };

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(authUser));
      setUser(authUser);
      return { success: true };
    } catch (err) {
      return { success: false, error: 'Failed to persist session.' };
    }
  };

  const signup = async (
    name: string,
    email: string,
    password: string
  ): Promise<{ success: boolean; error?: string }> => {
    await new Promise((resolve) => setTimeout(resolve, 600));

    const trimmedName = name.trim();
    const trimmedEmail = email.trim().toLowerCase();

    if (!trimmedName) {
      return { success: false, error: 'Please enter your full name.' };
    }
    if (!trimmedEmail) {
      return { success: false, error: 'Please enter your email.' };
    }
    if (!password || password.length < 8) {
      return { success: false, error: 'Password must be at least 8 characters long.' };
    }

    const authUser: AuthUser = {
      id: `usr-${Date.now().toString(36)}`,
      name: trimmedName,
      email: trimmedEmail,
      role: 'user',
      title: 'PCB Diagnostic Specialist',
      createdAt: new Date().toISOString()
    };

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(authUser));
      setUser(authUser);
      return { success: true };
    } catch (err) {
      return { success: false, error: 'Failed to save new user account.' };
    }
  };

  const resetPassword = async (email: string): Promise<{ success: boolean; error?: string }> => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const trimmedEmail = email.trim().toLowerCase();
    if (!trimmedEmail || !trimmedEmail.includes('@')) {
      return { success: false, error: 'Please enter a valid email address.' };
    }
    // Simulation succeeds and records in local storage
    return { success: true };
  };

  const logout = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (err) {
      console.error(err);
    }
    setUser(null);
  };

  const loginWithDemo = () => {
    const demoUser: AuthUser = {
      id: 'usr-demo-01',
      name: 'Alex Chen',
      email: 'alex.chen@circusense.ai',
      role: 'user',
      title: 'Lead Circuit Systems Engineer',
      createdAt: new Date().toISOString()
    };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(demoUser));
      setUser(demoUser);
    } catch (e) {
      setUser(demoUser);
    }
  };

  const loginWithAdminDemo = () => {
    const adminUser: AuthUser = {
      id: 'usr-admin-demo-01',
      name: 'Dr. Sarah Vance',
      email: 'admin@circusense.ai',
      role: 'admin',
      title: 'Platform Director',
      createdAt: new Date().toISOString()
    };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(adminUser));
      setUser(adminUser);
    } catch (e) {
      setUser(adminUser);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        signup,
        logout,
        resetPassword,
        loginWithDemo,
        loginWithAdminDemo
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
