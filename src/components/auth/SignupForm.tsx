import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { PasswordInput } from './PasswordInput';
import { User, Mail, ArrowRight, Loader2 } from 'lucide-react';

interface SignupFormProps {
  onSwitchToLogin: () => void;
}

export const SignupForm: React.FC<SignupFormProps> = ({ onSwitchToLogin }) => {
  const { signup } = useAuth();

  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
    general?: string;
  }>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const validate = (): boolean => {
    const newErrors: {
      name?: string;
      email?: string;
      password?: string;
      confirmPassword?: string;
      general?: string;
    } = {};

    if (!name.trim()) {
      newErrors.name = 'Please enter your full name.';
    }

    if (!email.trim()) {
      newErrors.email = 'Please enter your email.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      newErrors.email = 'Please enter a valid email address.';
    }

    if (!password) {
      newErrors.password = 'Password is required.';
    } else if (password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters long.';
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password.';
    } else if (confirmPassword !== password) {
      newErrors.confirmPassword = 'Passwords do not match.';
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
      const result = await signup(name, email, password);
      if (!result.success) {
        setErrors({ general: result.error || 'Failed to create account.' });
      }
    } catch (err: any) {
      setErrors({ general: err.message || 'An unexpected error occurred.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-6 text-left">
        <h2 className="font-domine text-2xl sm:text-[26px] font-bold tracking-tight text-slate-900 dark:text-white">
          Create your account
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
          Start your PCB analysis workspace with CircuSense AI.
        </p>
      </div>

      {/* General error message */}
      {errors.general && (
        <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs flex items-start gap-2.5 text-left animate-in fade-in duration-150">
          <div className="w-1.5 h-1.5 rounded-full bg-rose-500 dark:bg-rose-400 mt-1.5 shrink-0" />
          <span className="leading-relaxed">{errors.general}</span>
        </div>
      )}

      {/* Signup Form */}
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        {/* Full Name */}
        <div className="space-y-1.5 text-left">
          <label htmlFor="signup-name" className="block text-xs font-medium text-slate-700 dark:text-slate-300">
            Full Name <span className="text-rose-500 dark:text-rose-400">*</span>
          </label>
          <div className="relative">
            <input
              id="signup-name"
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }));
              }}
              placeholder="Enter your full name"
              autoComplete="name"
              aria-invalid={!!errors.name}
              aria-describedby={errors.name ? 'signup-name-error' : undefined}
              className={`w-full px-3.5 py-2.5 pl-10 text-xs rounded-xl bg-white/70 dark:bg-[#070A11]/80 backdrop-blur-xs border transition-all duration-200 outline-none text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 ${
                errors.name
                  ? 'border-rose-500/70 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20'
                  : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 focus:border-sky-500 dark:focus:border-[#00D1FF] focus:ring-2 focus:ring-sky-500/20 dark:focus:ring-[#00D1FF]/20 shadow-xs'
              }`}
            />
            <User
              size={15}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 pointer-events-none"
            />
          </div>
          {errors.name && (
            <p id="signup-name-error" className="text-[11px] text-rose-500 dark:text-rose-400 font-medium pt-0.5">
              {errors.name}
            </p>
          )}
        </div>

        {/* Email */}
        <div className="space-y-1.5 text-left">
          <label htmlFor="signup-email" className="block text-xs font-medium text-slate-700 dark:text-slate-300">
            Email <span className="text-rose-500 dark:text-rose-400">*</span>
          </label>
          <div className="relative">
            <input
              id="signup-email"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
              }}
              placeholder="Enter your email"
              autoComplete="email"
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? 'signup-email-error' : undefined}
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
            <p id="signup-email-error" className="text-[11px] text-rose-500 dark:text-rose-400 font-medium pt-0.5">
              {errors.email}
            </p>
          )}
        </div>

        {/* Password with Strength Meter */}
        <div className="space-y-1.5">
          <PasswordInput
            id="signup-password"
            label="Password"
            value={password}
            onChange={(val) => {
              setPassword(val);
              if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }));
            }}
            placeholder="Create a password"
            error={errors.password}
            showStrengthMeter={true}
            autoComplete="new-password"
          />
        </div>

        {/* Confirm Password */}
        <div className="space-y-1.5">
          <PasswordInput
            id="signup-confirm-password"
            label="Confirm Password"
            value={confirmPassword}
            onChange={(val) => {
              setConfirmPassword(val);
              if (errors.confirmPassword) {
                setErrors((prev) => ({ ...prev, confirmPassword: undefined }));
              }
            }}
            placeholder="Confirm your password"
            error={errors.confirmPassword}
            showStrengthMeter={false}
            autoComplete="new-password"
          />
        </div>

        {/* Create Account Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          id="btn-create-account"
          className="w-full mt-2 relative group overflow-hidden flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-400 hover:to-cyan-400 text-white dark:text-[#050811] font-semibold text-xs tracking-wide shadow-[0_4px_16px_rgba(14,165,233,0.25)] dark:shadow-[0_4px_20px_rgba(0,209,255,0.25)] hover:shadow-[0_6px_24px_rgba(14,165,233,0.35)] dark:hover:shadow-[0_6px_28px_rgba(0,209,255,0.35)] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer focus:outline-none focus:ring-2 focus:ring-sky-500/50 dark:focus:ring-[#00D1FF]/50 active:scale-[0.99]"
        >
          {isSubmitting ? (
            <>
              <Loader2 size={15} className="animate-spin" />
              <span>Provisioning engineering workspace...</span>
            </>
          ) : (
            <>
              <span>Create Account</span>
              <ArrowRight size={15} className="group-hover:translate-x-0.5 transition-transform" />
            </>
          )}
        </button>
      </form>

      {/* Switch to Sign In footer */}
      <div className="mt-6 pt-5 border-t border-slate-200/80 dark:border-slate-800/80 text-center text-xs text-slate-500 dark:text-slate-400">
        <span>Already have an account? </span>
        <button
          type="button"
          onClick={onSwitchToLogin}
          className="text-sky-600 dark:text-[#00D1FF] hover:underline font-semibold focus:outline-none focus:ring-1 focus:ring-sky-500 dark:focus:ring-[#00D1FF] rounded px-1 cursor-pointer transition-colors"
        >
          Sign in
        </button>
      </div>
    </div>
  );
};
