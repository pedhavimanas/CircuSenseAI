import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Mail, ArrowLeft, ArrowRight, Loader2, CheckCircle2 } from 'lucide-react';

interface ForgotPasswordFormProps {
  onSwitchToLogin: () => void;
}

export const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({ onSwitchToLogin }) => {
  const { resetPassword } = useAuth();

  const [email, setEmail] = useState<string>('');
  const [error, setError] = useState<string | undefined>();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  const validate = (): boolean => {
    if (!email.trim()) {
      setError('Please enter your email.');
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError('Please enter a valid email address.');
      return false;
    }
    setError(undefined);
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setError(undefined);

    try {
      const result = await resetPassword(email);
      if (result.success) {
        setIsSubmitted(true);
      } else {
        setError(result.error || 'Failed to send reset link.');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-6 text-left">
        <h2 className="font-domine text-2xl sm:text-[26px] font-bold tracking-tight text-slate-900 dark:text-white">
          Reset your password
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
          Enter your email and we'll help you get back into your workspace.
        </p>
      </div>

      {isSubmitted ? (
        <div className="space-y-5 text-left animate-in fade-in duration-200">
          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-800 dark:text-emerald-300 space-y-2">
            <div className="flex items-center gap-2">
              <CheckCircle2 size={18} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span className="text-xs font-semibold">Reset Link Dispatched</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              We've dispatched recovery instructions to <span className="text-emerald-700 dark:text-emerald-300 font-mono font-medium">{email}</span>. Please verify your inbox and follow the security link.
            </p>
          </div>

          <button
            type="button"
            onClick={onSwitchToLogin}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-400 hover:to-cyan-400 text-white dark:text-[#050811] font-semibold text-xs tracking-wide shadow-[0_4px_16px_rgba(14,165,233,0.25)] dark:shadow-[0_4px_20px_rgba(0,209,255,0.25)] transition-all cursor-pointer"
          >
            <ArrowLeft size={15} />
            <span>Return to Sign In</span>
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          {/* Email Field */}
          <div className="space-y-1.5 text-left">
            <label htmlFor="forgot-email" className="block text-xs font-medium text-slate-700 dark:text-slate-300">
              Email <span className="text-rose-500 dark:text-rose-400">*</span>
            </label>
            <div className="relative">
              <input
                id="forgot-email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (error) setError(undefined);
                }}
                placeholder="Enter your email"
                autoComplete="email"
                aria-invalid={!!error}
                aria-describedby={error ? 'forgot-email-error' : undefined}
                className={`w-full px-3.5 py-2.5 pl-10 text-xs rounded-xl bg-white/70 dark:bg-[#070A11]/80 backdrop-blur-xs border transition-all duration-200 outline-none text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 ${
                  error
                    ? 'border-rose-500/70 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 focus:border-sky-500 dark:focus:border-[#00D1FF] focus:ring-2 focus:ring-sky-500/20 dark:focus:ring-[#00D1FF]/20 shadow-xs'
                }`}
              />
              <Mail
                size={15}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 pointer-events-none"
              />
            </div>
            {error && (
              <p id="forgot-email-error" className="text-[11px] text-rose-500 dark:text-rose-400 font-medium pt-0.5">
                {error}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            id="btn-send-reset-link"
            className="w-full relative group overflow-hidden flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-400 hover:to-cyan-400 text-white dark:text-[#050811] font-semibold text-xs tracking-wide shadow-[0_4px_16px_rgba(14,165,233,0.25)] dark:shadow-[0_4px_20px_rgba(0,209,255,0.25)] hover:shadow-[0_6px_24px_rgba(14,165,233,0.35)] dark:hover:shadow-[0_6px_28px_rgba(0,209,255,0.35)] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer focus:outline-none focus:ring-2 focus:ring-sky-500/50 dark:focus:ring-[#00D1FF]/50 active:scale-[0.99]"
          >
            {isSubmitting ? (
              <>
                <Loader2 size={15} className="animate-spin" />
                <span>Sending reset link...</span>
              </>
            ) : (
              <>
                <span>Send Reset Link</span>
                <ArrowRight size={15} className="group-hover:translate-x-0.5 transition-transform" />
              </>
            )}
          </button>

          {/* Back to Sign In Link */}
          <div className="mt-6 pt-5 border-t border-slate-200/80 dark:border-slate-800/80 text-center">
            <button
              type="button"
              onClick={onSwitchToLogin}
              className="inline-flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 hover:text-sky-600 dark:hover:text-[#00D1FF] transition-colors font-medium focus:outline-none focus:ring-1 focus:ring-sky-500 dark:focus:ring-[#00D1FF] rounded px-1 cursor-pointer"
            >
              <ArrowLeft size={13} />
              <span>Back to Sign In</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
