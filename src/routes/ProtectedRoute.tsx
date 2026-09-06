import React from 'react';
import { useAuth } from '../context/AuthContext';
import { AuthPage } from '../components/auth/AuthPage';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen w-full bg-[#0A0C0E] flex flex-col items-center justify-center text-slate-200">
        <div className="w-8 h-8 rounded-full border-2 border-[#00D1FF] border-t-transparent animate-spin mb-3"></div>
        <p className="text-xs font-mono text-slate-400">Authenticating CircuSense Session...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AuthPage initialMode="login" />;
  }

  return <>{children}</>;
};
