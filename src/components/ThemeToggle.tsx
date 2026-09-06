import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { Sun, Moon } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ThemeToggleProps {
  compact?: boolean;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ compact = false }) => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      onClick={toggleTheme}
      type="button"
      id="theme-mode-toggle"
      aria-label={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      className={`relative inline-flex items-center justify-center p-2 rounded-lg border transition-all duration-200 cursor-pointer ${
        isDark
          ? 'bg-[#1A1E25] hover:bg-slate-800 text-slate-300 hover:text-[#00D1FF] border-slate-800'
          : 'bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-sky-600 border-slate-300 shadow-xs'
      }`}
    >
      <AnimatePresence mode="wait" initial={false}>
        {isDark ? (
          <motion.div
            key="moon"
            initial={{ opacity: 0, rotate: -45, scale: 0.8 }}
            animate={{ opacity: 1, rotate: 0, scale: 1 }}
            exit={{ opacity: 0, rotate: 45, scale: 0.8 }}
            transition={{ duration: 0.18 }}
            className="flex items-center gap-1.5"
          >
            <Moon size={16} className="text-slate-300 group-hover:text-[#00D1FF]" />
            {!compact && (
              <span className="text-[11px] font-medium text-slate-300 hidden xl:inline">
                Dark
              </span>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="sun"
            initial={{ opacity: 0, rotate: 45, scale: 0.8 }}
            animate={{ opacity: 1, rotate: 0, scale: 1 }}
            exit={{ opacity: 0, rotate: -45, scale: 0.8 }}
            transition={{ duration: 0.18 }}
            className="flex items-center gap-1.5"
          >
            <Sun size={16} className="text-amber-500" />
            {!compact && (
              <span className="text-[11px] font-medium text-slate-700 hidden xl:inline">
                Light
              </span>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </button>
  );
};
