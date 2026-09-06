import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AuthMode } from '../../types';
import { LoginForm } from '../auth/LoginForm';
import { SignupForm } from '../auth/SignupForm';
import { ForgotPasswordForm } from '../auth/ForgotPasswordForm';
import { ShieldCheck, Cpu, Lock } from 'lucide-react';

interface AuthPortalSectionProps {
  mode: AuthMode;
  onSetMode: (mode: AuthMode) => void;
}

export const AuthPortalSection: React.FC<AuthPortalSectionProps> = ({
  mode,
  onSetMode
}) => {
  return (
    <section
      id="auth"
      className="pt-6 sm:pt-8 pb-16 sm:pb-24 px-4 sm:px-6 lg:px-8 relative z-10 scroll-mt-24 w-full max-w-full overflow-hidden"
    >
      {/* Ambient background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[320px] sm:w-[650px] h-[320px] sm:h-[650px] rounded-full bg-cyan-500/[0.08] dark:bg-[#00D1FF]/[0.06] blur-[100px] sm:blur-[150px] pointer-events-none max-w-full" />

      <div className="max-w-7xl mx-auto text-center space-y-3 sm:space-y-4 mb-8 sm:mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 dark:bg-[#00D1FF]/10 border border-sky-500/20 dark:border-[#00D1FF]/20 text-sky-600 dark:text-[#00D1FF] text-xs font-mono font-medium">
          <Lock size={12} />
          <span>Secure Platform Access</span>
        </div>
        <h2 className="font-domine text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight break-words">
          Your PCB Workspace
        </h2>
        <p className="text-xs sm:text-sm md:text-base text-slate-600 dark:text-slate-400 max-w-xl mx-auto leading-relaxed">
          Sign in or create an account to unlock intelligent component detection, visual anomaly screening, and full datasheet pinouts.
        </p>
      </div>

      {/* Large Centered Glass Card */}
      <div className="max-w-lg mx-auto relative w-full">
        <div className="relative rounded-2xl sm:rounded-3xl bg-white/80 dark:bg-[#0A0E1A]/85 border border-slate-200/80 dark:border-white/[0.09] backdrop-blur-2xl p-4 sm:p-9 shadow-[0_20px_50px_rgba(0,0,0,0.15)] dark:shadow-[0_20px_60px_rgba(0,0,0,0.6)] overflow-hidden">
          {/* Top specular hairline */}
          <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent" />

          {/* Form Switcher with Motion */}
          <AnimatePresence mode="wait" initial={false}>
            {mode === 'login' && (
              <motion.div
                key="login"
                initial={{ opacity: 0, y: 8, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.98 }}
                transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              >
                <LoginForm
                  onSwitchToSignup={() => onSetMode('signup')}
                  onSwitchToForgotPassword={() => onSetMode('forgot_password')}
                />
              </motion.div>
            )}

            {mode === 'signup' && (
              <motion.div
                key="signup"
                initial={{ opacity: 0, y: 8, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.98 }}
                transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              >
                <SignupForm onSwitchToLogin={() => onSetMode('login')} />
              </motion.div>
            )}

            {mode === 'forgot_password' && (
              <motion.div
                key="forgot_password"
                initial={{ opacity: 0, y: 8, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.98 }}
                transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              >
                <ForgotPasswordForm onSwitchToLogin={() => onSetMode('login')} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Security & Verification Micro Badge */}
        <div className="mt-6 flex items-center justify-center gap-4 text-[11px] font-mono text-slate-500 dark:text-slate-400">
          <span className="flex items-center gap-1.5">
            <ShieldCheck size={13} className="text-emerald-500" />
            <span>Encrypted Session Persistence</span>
          </span>
          <span>•</span>
          <span className="flex items-center gap-1.5">
            <Cpu size={13} className="text-sky-500 dark:text-[#00D1FF]" />
            <span>Instant Workspace Launch</span>
          </span>
        </div>
      </div>
    </section>
  );
};
