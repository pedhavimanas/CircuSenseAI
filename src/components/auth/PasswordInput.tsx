import React, { useState, useId } from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface PasswordInputProps {
  id?: string;
  label?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string;
  showStrengthMeter?: boolean;
  required?: boolean;
  autoComplete?: string;
}

export const PasswordInput: React.FC<PasswordInputProps> = ({
  id,
  label = 'Password',
  value,
  onChange,
  placeholder = 'Enter your password',
  error,
  showStrengthMeter = false,
  required = true,
  autoComplete = 'current-password'
}) => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const generatedId = useId();
  const inputId = id || `pwd-input-${generatedId}`;
  const errorId = `${inputId}-error`;

  // Calculate password strength (0 to 4)
  const getStrength = (pwd: string): { score: number; label: string; color: string } => {
    if (!pwd) return { score: 0, label: '', color: '' };
    let score = 0;
    if (pwd.length >= 8) score += 1;
    if (pwd.length >= 12) score += 1;
    if (/[A-Z]/.test(pwd) && /[a-z]/.test(pwd)) score += 1;
    if (/[0-9]/.test(pwd) || /[^A-Za-z0-9]/.test(pwd)) score += 1;

    if (score <= 1) return { score: 1, label: 'Weak', color: 'bg-rose-500' };
    if (score === 2) return { score: 2, label: 'Fair', color: 'bg-amber-500' };
    if (score === 3) return { score: 3, label: 'Good', color: 'bg-sky-500 dark:bg-cyan-400' };
    return { score: 4, label: 'Strong', color: 'bg-emerald-500' };
  };

  const strength = showStrengthMeter ? getStrength(value) : null;

  return (
    <div className="w-full space-y-1.5 text-left">
      <div className="flex items-center justify-between">
        <label htmlFor={inputId} className="block text-xs font-medium text-slate-700 dark:text-slate-300">
          {label} {required && <span className="text-rose-500 dark:text-rose-400">*</span>}
        </label>
        {strength && value.length > 0 && (
          <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
            Strength: <span className="font-semibold text-slate-800 dark:text-slate-200">{strength.label}</span>
          </span>
        )}
      </div>

      <div className="relative">
        <input
          id={inputId}
          type={showPassword ? 'text' : 'password'}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          required={required}
          autoComplete={autoComplete}
          aria-invalid={!!error}
          aria-describedby={error ? errorId : undefined}
          className={`w-full px-3.5 py-2.5 pr-11 text-xs rounded-xl bg-white/70 dark:bg-[#070A11]/80 backdrop-blur-xs border transition-all duration-200 outline-none text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 ${
            error
              ? 'border-rose-500/70 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20'
              : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 focus:border-sky-500 dark:focus:border-[#00D1FF] focus:ring-2 focus:ring-sky-500/20 dark:focus:ring-[#00D1FF]/20 shadow-xs'
          }`}
        />

        <button
          type="button"
          id={`${inputId}-toggle-visibility`}
          onClick={() => setShowPassword((prev) => !prev)}
          aria-label={showPassword ? 'Hide password' : 'Show password'}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors focus:outline-none focus:ring-1 focus:ring-sky-500 dark:focus:ring-[#00D1FF] cursor-pointer"
        >
          {showPassword ? (
            <EyeOff size={15} />
          ) : (
            <Eye size={15} />
          )}
        </button>
      </div>

      {/* Password Strength Indicator Bars */}
      {showStrengthMeter && value.length > 0 && (
        <div className="pt-1 space-y-1">
          <div className="grid grid-cols-4 gap-1.5 h-1">
            {[1, 2, 3, 4].map((step) => (
              <div
                key={step}
                className={`h-full rounded-full transition-all duration-300 ${
                  strength && strength.score >= step
                    ? strength.color
                    : 'bg-slate-200 dark:bg-slate-800'
                }`}
              />
            ))}
          </div>
          <p className="text-[10px] text-slate-500 dark:text-slate-400">
            Use 8+ characters with uppercase letters, numbers, and symbols.
          </p>
        </div>
      )}

      {/* Inline Error Message */}
      {error && (
        <p id={errorId} className="text-[11px] text-rose-500 dark:text-rose-400 font-medium pt-0.5 flex items-center gap-1">
          <span>{error}</span>
        </p>
      )}
    </div>
  );
};
