import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { PasswordInput } from './PasswordInput';
import { Mail, ArrowRight, Loader2, Sparkles, ShieldCheck } from 'lucide-react';

interface LoginFormProps {
  onSwitchToSignup: () => void;
  onSwitchToForgotPassword: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({
  onSwitchToSignup,
  onSwitchToForgotPassword
}) => {
  const { login, loginWithDemo, loginWithAdminDemo } = useAuth();

  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [errors, setErrors] = useState<{ email?: string; password?: string; general?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const validate = (): boolean => {
    const newErrors: { email?: string; password?: string; general?: string } = {};

    if (!email.trim()) {
      newErrors.email = 'Please enter your email.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      newErrors.email = 'Please enter a valid email address.';
    }

    if (!password) {
      newErrors.password = 'Password is required.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setErrors({});

    try {
      const result = await login(email, password);
      if (!result.success) {
        setErrors({ general: result.error || 'Failed to sign in. Please check credentials.' });
      }
    } catch (err: any) {
      setErrors({ general: err.message || 'An unexpected error occurred.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickDemo = () => {
    setEmail('alex.chen@circusense.ai');
    setPassword('pcbEngineer2026');
    setErrors({});
    loginWithDemo();
  };

  const handleQuickAdminDemo = () => {
    setEmail('admin@circusense.ai');
    setPassword('adminPlatform2026');
    setErrors({});
    loginWithAdminDemo();
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-6 text-left">
        <h2 className="font-domine text-2xl sm:text-[26px] font-bold tracking-tight text-slate-900 dark:text-white">
          Welcome back
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
          Sign in to continue to your PCB analysis workspace.
        </p>
      </div>

      {/* General error alert */}
      {errors.general && (
        <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs flex items-start gap-2.5 text-left animate-in fade-in duration-150">
          <div className="w-1.5 h-1.5 rounded-full bg-rose-500 dark:bg-rose-400 mt-1.5 shrink-0" />
          <span className="leading-relaxed">{errors.general}</span>
        </div>
      )}

      {/* Login Form */}
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        {/* Email Field */}
        <div className="space-y-1.5 text-left">
          <label htmlFor="login-email" className="block text-xs font-medium text-slate-700 dark:text-slate-300">
            Email <span className="text-rose-500 dark:text-rose-400">*</span>
          </label>
          <div className="relative">
            <input
              id="login-email"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
              }}
              placeholder="Enter your email"
              autoComplete="email"
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? 'login-email-error' : undefined}
              className={`w-full px-3.5 py-2.5 pl-10 text-xs rounded-xl bg-white/70 dark:bg-[#070A11]/80 backdrop-blur-xs border transition-all duration-200 outline-none text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 ${
                errors.email
                  ? 'border-rose-500/70 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20'
                  : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 focus:border-sky-500 dark:focus:border-[#00D1FF] focus:ring-2 focus:ring-sky-500/20 dark:focus:ring-[#00D1FF]/20 shadow-xs'
              }`}
            />
            <Mail
              size={15}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 pointer-events-none"
            />
          </div>
          {errors.email && (
            <p id="login-email-error" className="text-[11px] text-rose-500 dark:text-rose-400 font-medium pt-0.5">
              {errors.email}
            </p>
          )}
        </div>

        {/* Password Field with Show/Hide */}
        <div className="space-y-1.5">
          <PasswordInput
            id="login-password"
            label="Password"
            value={password}
            onChange={(val) => {
              setPassword(val);
              if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }));
            }}
            placeholder="Enter your password"
            error={errors.password}
            autoComplete="current-password"
          />
        </div>

        {/* Forgot Password Link */}
        <div className="flex justify-end pt-0.5">
          <button
            type="button"
            onClick={onSwitchToForgotPassword}
            className="text-xs text-sky-600 dark:text-[#00D1FF] hover:underline font-medium focus:outline-none focus:ring-1 focus:ring-sky-500 dark:focus:ring-[#00D1FF] rounded px-1 cursor-pointer transition-colors"
          >
            Forgot password?
          </button>
        </div>

        {/* Primary Sign In Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          id="btn-sign-in"
          className="w-full relative group overflow-hidden flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-400 hover:to-cyan-400 text-white dark:text-[#050811] font-semibold text-xs tracking-wide shadow-[0_4px_16px_rgba(14,165,233,0.25)] dark:shadow-[0_4px_20px_rgba(0,209,255,0.25)] hover:shadow-[0_6px_24px_rgba(14,165,233,0.35)] dark:hover:shadow-[0_6px_28px_rgba(0,209,255,0.35)] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer focus:outline-none focus:ring-2 focus:ring-sky-500/50 dark:focus:ring-[#00D1FF]/50 active:scale-[0.99]"
        >
          {isSubmitting ? (
            <>
              <Loader2 size={15} className="animate-spin" />
              <span>Verifying workspace session...</span>
            </>
          ) : (
            <>
              <span>Sign In</span>
              <ArrowRight size={15} className="group-hover:translate-x-0.5 transition-transform" />
            </>
          )}
        </button>

        {/* Quick Demo Access Option */}
        <div className="pt-2">
          <div className="relative flex py-2 items-center">
            <div className="flex-grow border-t border-slate-200 dark:border-slate-800"></div>
            <span className="flex-shrink mx-3 text-[10px] uppercase tracking-wider text-slate-400 dark:text-slate-500 font-mono">
              Fast Demo Access
            </span>
            <div className="flex-grow border-t border-slate-200 dark:border-slate-800"></div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <button
              type="button"
              id="btn-quick-demo-login"
              onClick={handleQuickDemo}
              className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-slate-100 dark:bg-[#151922] hover:bg-slate-200/80 dark:hover:bg-[#1C222F] border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white text-xs font-medium transition-all group cursor-pointer"
              title="Demo Engineer Account (User Portal)"
            >
              <Sparkles size={14} className="text-sky-500 dark:text-[#00D1FF] group-hover:scale-110 transition-transform shrink-0" />
              <span className="truncate">Engineer Demo (Alex)</span>
            </button>

            <button
              type="button"
              id="btn-admin-demo-login"
              onClick={handleQuickAdminDemo}
              className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-slate-100 dark:bg-[#151922] hover:bg-slate-200/80 dark:hover:bg-[#1C222F] border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white text-xs font-medium transition-all group cursor-pointer"
              title="Demo Administrator Account (Admin Portal)"
            >
              <ShieldCheck size={14} className="text-amber-500 group-hover:scale-110 transition-transform shrink-0" />
              <span className="truncate">Admin Demo (Dr. Vance)</span>
            </button>
          </div>
        </div>
      </form>

      {/* Switch to Sign Up footer */}
      <div className="mt-6 pt-5 border-t border-slate-200/80 dark:border-slate-800/80 text-center text-xs text-slate-500 dark:text-slate-400">
        <span>Don't have an account? </span>
        <button
          type="button"
          onClick={onSwitchToSignup}
          className="text-sky-600 dark:text-[#00D1FF] hover:underline font-semibold focus:outline-none focus:ring-1 focus:ring-sky-500 dark:focus:ring-[#00D1FF] rounded px-1 cursor-pointer transition-colors"
        >
          Create account
        </button>
      </div>
    </div>
  );
};
