import React from 'react';
import { AuthMode } from '../../types';
import { LandingPage } from '../landing/LandingPage';

interface AuthPageProps {
  initialMode?: AuthMode;
}

export const AuthPage: React.FC<AuthPageProps> = ({ initialMode = 'login' }) => {
  return <LandingPage initialAuthMode={initialMode} />;
};

