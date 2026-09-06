import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { AuthPage } from './AuthPage';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen w-full bg-[#F8FAFC] dark:bg-[#07090F] flex flex-col items-center justify-center text-slate-700 dark:text-slate-300">
        <div className="w-8 h-8 rounded-full border-2 border-sky-500 dark:border-[#00D1FF] border-t-transparent animate-spin mb-3"></div>
        <p className="text-xs font-mono text-slate-500 dark:text-slate-400">Verifying CircuSense AI Session...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AuthPage initialMode="login" />;
  }

  return <>{children}</>;
};
