import React, { useState, useEffect } from 'react';
import { Cpu, Menu, X, ArrowRight, LogIn } from 'lucide-react';
import { ThemeToggle } from '../ThemeToggle';
import { AuthMode } from '../../types';

interface LandingNavbarProps {
  onNavigateAuth: (mode: AuthMode) => void;
}

export const LandingNavbar: React.FC<LandingNavbarProps> = ({ onNavigateAuth }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleAuthAction = (mode: AuthMode) => {
    setMobileMenuOpen(false);
    onNavigateAuth(mode);
    const authElement = document.getElementById('auth');
    if (authElement) {
      authElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-4 sm:px-6 lg:px-8 pt-4 pb-2`}
      >
        <div
          className={`max-w-7xl mx-auto rounded-2xl transition-all duration-300 flex items-center justify-between px-5 py-3 border ${
            isScrolled
              ? 'bg-white/85 dark:bg-[#080B13]/85 backdrop-blur-xl border-slate-200/80 dark:border-white/[0.09] shadow-[0_8px_32px_rgba(0,0,0,0.12)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.45)]'
              : 'bg-white/60 dark:bg-[#0A0D18]/60 backdrop-blur-lg border-slate-200/50 dark:border-white/[0.06] shadow-xs'
          }`}
        >
          {/* Brand Logo */}
          <a
            href="#home"
            onClick={(e) => {
              e.preventDefault();
              scrollToSection('home');
            }}
            className="flex items-center gap-2.5 group cursor-pointer focus:outline-none"
          >
            <div className="w-8 h-8 rounded-xl bg-sky-500/10 dark:bg-[#00D1FF]/10 border border-sky-500/20 dark:border-[#00D1FF]/30 flex items-center justify-center text-sky-600 dark:text-[#00D1FF] group-hover:scale-105 transition-transform shadow-xs">
              <Cpu size={17} />
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="font-bold text-base tracking-tight text-slate-900 dark:text-white">
                CircuSense
              </span>
              <span className="text-xs font-mono text-sky-600 dark:text-[#00D1FF] font-semibold uppercase tracking-wider">
                AI
              </span>
            </div>
          </a>

          {/* Desktop Center Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2 text-xs font-medium text-slate-600 dark:text-slate-300">
            <button
              onClick={() => scrollToSection('home')}
              className="px-3 py-1.5 rounded-lg hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/70 dark:hover:bg-white/[0.05] transition-colors cursor-pointer"
            >
              Home
            </button>
            <button
              onClick={() => scrollToSection('features')}
              className="px-3 py-1.5 rounded-lg hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/70 dark:hover:bg-white/[0.05] transition-colors cursor-pointer"
            >
              Features
            </button>
            <button
              onClick={() => scrollToSection('how-it-works')}
              className="px-3 py-1.5 rounded-lg hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/70 dark:hover:bg-white/[0.05] transition-colors cursor-pointer"
            >
              How It Works
            </button>
            <button
              onClick={() => scrollToSection('product-preview')}
              className="px-3 py-1.5 rounded-lg hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/70 dark:hover:bg-white/[0.05] transition-colors cursor-pointer"
            >
              Showcase
            </button>
            <button
              onClick={() => scrollToSection('about')}
              className="px-3 py-1.5 rounded-lg hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/70 dark:hover:bg-white/[0.05] transition-colors cursor-pointer"
            >
              About
            </button>
            <button
              onClick={() => scrollToSection('pricing')}
              className="px-3 py-1.5 rounded-lg hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/70 dark:hover:bg-white/[0.05] transition-colors cursor-pointer"
            >
              Pricing
            </button>
          </nav>

          {/* Right Action Items */}
          <div className="hidden sm:flex items-center gap-3">
            <ThemeToggle />

            <button
              onClick={() => handleAuthAction('login')}
              className="text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-sky-600 dark:hover:text-[#00D1FF] px-3 py-2 rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <LogIn size={14} />
              <span>Sign In</span>
            </button>

            <button
              onClick={() => handleAuthAction('signup')}
              className="text-xs font-semibold px-4 py-2 rounded-xl bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-400 hover:to-cyan-400 text-white dark:text-[#050811] shadow-[0_4px_14px_rgba(14,165,233,0.25)] dark:shadow-[0_4px_18px_rgba(0,209,255,0.25)] hover:shadow-[0_6px_20px_rgba(14,165,233,0.35)] dark:hover:shadow-[0_6px_22px_rgba(0,209,255,0.35)] transition-all cursor-pointer flex items-center gap-1.5"
            >
              <span>Get Started</span>
              <ArrowRight size={13} />
            </button>
          </div>

          {/* Mobile Right Controls */}
          <div className="flex sm:hidden items-center gap-2">
            <ThemeToggle />
            <button
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-label="Toggle Navigation Menu"
              className="p-2 rounded-xl bg-slate-100 dark:bg-white/[0.06] text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-white/[0.08] cursor-pointer"
            >
              {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Glass Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 sm:hidden bg-black/60 backdrop-blur-md pt-24 px-4 pb-6 flex flex-col justify-between animate-in fade-in duration-200">
          <div className="rounded-2xl bg-white/90 dark:bg-[#0E1322]/95 border border-slate-200 dark:border-white/[0.09] p-5 shadow-2xl backdrop-blur-2xl space-y-2">
            <button
              onClick={() => scrollToSection('home')}
              className="w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/[0.06]"
            >
              Home
            </button>
            <button
              onClick={() => scrollToSection('features')}
              className="w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/[0.06]"
            >
              Features
            </button>
            <button
              onClick={() => scrollToSection('how-it-works')}
              className="w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/[0.06]"
            >
              How It Works
            </button>
            <button
              onClick={() => scrollToSection('product-preview')}
              className="w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/[0.06]"
            >
              Showcase
            </button>
            <button
              onClick={() => scrollToSection('about')}
              className="w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/[0.06]"
            >
              About
            </button>
            <button
              onClick={() => scrollToSection('pricing')}
              className="w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/[0.06]"
            >
              Pricing
            </button>

            <div className="pt-3 border-t border-slate-200 dark:border-white/[0.08] flex flex-col gap-2">
              <button
                onClick={() => handleAuthAction('login')}
                className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-white/[0.06] border border-slate-200 dark:border-white/[0.08] flex items-center justify-center gap-2"
              >
                <LogIn size={14} />
                <span>Sign In</span>
              </button>
              <button
                onClick={() => handleAuthAction('signup')}
                className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold bg-gradient-to-r from-sky-500 to-cyan-500 text-white dark:text-[#050811] flex items-center justify-center gap-2 shadow-md"
              >
                <span>Get Started</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
