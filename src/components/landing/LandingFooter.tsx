import React from 'react';
import { Cpu, ArrowUpRight } from 'lucide-react';
import { AuthMode } from '../../types';

interface LandingFooterProps {
  onNavigateAuth: (mode: AuthMode) => void;
  onScrollTo: (sectionId: string) => void;
}

export const LandingFooter: React.FC<LandingFooterProps> = ({
  onNavigateAuth,
  onScrollTo
}) => {
  return (
    <footer className="relative z-10 border-t border-slate-200/80 dark:border-white/[0.08] bg-white/40 dark:bg-[#060810]/70 backdrop-blur-xl pt-12 sm:pt-16 pb-12 px-4 sm:px-6 lg:px-8 text-left w-full max-w-full overflow-hidden">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-8 pb-12 border-b border-slate-200/60 dark:border-white/[0.06]">
        {/* Left Column: Brand & Tagline */}
        <div className="md:col-span-5 space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-sky-500/10 dark:bg-[#00D1FF]/10 border border-sky-500/20 dark:border-[#00D1FF]/30 flex items-center justify-center text-sky-600 dark:text-[#00D1FF] shadow-xs">
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
          </div>

          <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
            "Understand Every Circuit"
          </p>

          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm leading-relaxed">
            AI-powered PCB identification, component OCR extraction, and diagnostic intelligence designed for hardware engineers, researchers, and students.
          </p>
        </div>

        {/* Center Column: Product & Company Links */}
        <div className="md:col-span-4 grid grid-cols-2 gap-8 text-xs">
          <div className="space-y-3">
            <div className="font-mono uppercase tracking-wider text-slate-900 dark:text-white font-bold text-[11px]">
              Product
            </div>
            <ul className="space-y-2.5 text-slate-600 dark:text-slate-400">
              <li>
                <button
                  onClick={() => onScrollTo('features')}
                  className="hover:text-sky-600 dark:hover:text-[#00D1FF] transition-colors cursor-pointer"
                >
                  Features
                </button>
              </li>
              <li>
                <button
                  onClick={() => onScrollTo('how-it-works')}
                  className="hover:text-sky-600 dark:hover:text-[#00D1FF] transition-colors cursor-pointer"
                >
                  How It Works
                </button>
              </li>
              <li>
                <button
                  onClick={() => onScrollTo('product-preview')}
                  className="hover:text-sky-600 dark:hover:text-[#00D1FF] transition-colors cursor-pointer"
                >
                  Workbench Showcase
                </button>
              </li>
              <li>
                <button
                  onClick={() => onScrollTo('pricing')}
                  className="hover:text-sky-600 dark:hover:text-[#00D1FF] transition-colors cursor-pointer"
                >
                  Pricing
                </button>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <div className="font-mono uppercase tracking-wider text-slate-900 dark:text-white font-bold text-[11px]">
              Company
            </div>
            <ul className="space-y-2.5 text-slate-600 dark:text-slate-400">
              <li>
                <button
                  onClick={() => onScrollTo('about')}
                  className="hover:text-sky-600 dark:hover:text-[#00D1FF] transition-colors cursor-pointer"
                >
                  About
                </button>
              </li>
              <li>
                <a
                  href="mailto:support@circusense.ai"
                  className="hover:text-sky-600 dark:hover:text-[#00D1FF] transition-colors flex items-center gap-1"
                >
                  <span>Contact</span>
                  <ArrowUpRight size={12} />
                </a>
              </li>
              <li>
                <span className="text-slate-400 dark:text-slate-500">Security & Privacy</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Right Column: Platform & Auth Links */}
        <div className="md:col-span-3 space-y-3 text-xs">
          <div className="font-mono uppercase tracking-wider text-slate-900 dark:text-white font-bold text-[11px]">
            Platform
          </div>
          <ul className="space-y-2.5 text-slate-600 dark:text-slate-400">
            <li>
              <button
                onClick={() => onScrollTo('ai-assistant')}
                className="hover:text-sky-600 dark:hover:text-[#00D1FF] transition-colors cursor-pointer"
              >
                AI Assistant
              </button>
            </li>
            <li>
              <button
                onClick={() => onNavigateAuth('login')}
                className="hover:text-sky-600 dark:hover:text-[#00D1FF] transition-colors cursor-pointer"
              >
                Sign In
              </button>
            </li>
            <li>
              <button
                onClick={() => onNavigateAuth('signup')}
                className="text-sky-600 dark:text-[#00D1FF] font-semibold hover:underline cursor-pointer flex items-center gap-1"
              >
                <span>Get Started</span>
                <ArrowUpRight size={12} />
              </button>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Copyright */}
      <div className="max-w-7xl mx-auto pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 dark:text-slate-400 gap-4">
        <div>
          © 2026 CircuSense AI. All rights reserved.
        </div>
        <div className="flex items-center gap-6 font-mono text-[11px]">
          <span>Built for Hardware Intelligence</span>
          <span>•</span>
          <span>v2.4.0 Engine</span>
        </div>
      </div>
    </footer>
  );
};
