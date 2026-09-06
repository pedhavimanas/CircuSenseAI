import React from 'react';
import { Cpu, Zap, ShieldCheck, Activity, Layers } from 'lucide-react';
import { ThemeToggle } from '../ThemeToggle';
import { PCBBackground } from './PCBBackground';

interface AuthLayoutProps {
  children: React.ReactNode;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <div
      className="min-h-screen w-full bg-[#F8FAFC] dark:bg-[#07090F] text-slate-900 dark:text-slate-100 flex flex-col relative overflow-hidden font-sans selection:bg-[#00D1FF] selection:text-[#0A0C0E] transition-colors duration-200"
    >
      {/* Decorative Subtle PCB Background & Ambient Glows */}
      <PCBBackground />

      {/* Top Header Navigation */}
      <header className="h-16 px-6 lg:px-12 flex items-center justify-between border-b border-slate-200/70 dark:border-slate-800/80 bg-white/40 dark:bg-[#0A0D15]/40 backdrop-blur-md z-20">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-sky-500/10 dark:bg-[#00D1FF]/10 border border-sky-500/20 dark:border-[#00D1FF]/30 flex items-center justify-center text-sky-600 dark:text-[#00D1FF] shadow-xs">
            <Cpu size={17} />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="font-bold text-base tracking-tight text-slate-900 dark:text-white">CircuSense</span>
            <span className="text-xs font-mono text-sky-600 dark:text-[#00D1FF] font-semibold uppercase tracking-wider">AI</span>
          </div>
          <span className="hidden sm:inline-block text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-slate-100 dark:bg-[#131823] text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800/80 ml-2">
            PCB Workspace
          </span>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Platform Online</span>
          </div>

          {/* Theme Toggle Button adhering to existing ThemeContext */}
          <ThemeToggle />
        </div>
      </header>

      {/* Main Two-Part Desktop Composition */}
      <div className="flex-1 flex flex-col lg:flex-row relative z-10">
        {/* Left Side: Product Branding & Minimal Technical Message (Desktop) */}
        <div className="hidden lg:flex lg:w-1/2 p-12 xl:p-16 flex-col justify-between relative border-r border-slate-200/60 dark:border-slate-800/60 overflow-hidden">
          {/* Top Brand Statement */}
          <div className="relative z-10 space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 dark:bg-[#00D1FF]/10 border border-sky-500/20 dark:border-[#00D1FF]/25 text-sky-600 dark:text-[#00D1FF] text-xs font-mono font-medium">
              <Zap size={13} />
              <span>AI-powered PCB identification & diagnosis</span>
            </div>

            <h1 className="text-4xl xl:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-[1.15]">
              Understand <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-600 via-sky-500 to-cyan-500 dark:from-[#00D1FF] dark:to-cyan-400">
                Every Circuit.
              </span>
            </h1>

            <p className="text-sm text-slate-600 dark:text-slate-400 max-w-md leading-relaxed">
              Identify components, analyze circuits, and investigate possible PCB issues with AI-assisted intelligence.
            </p>
          </div>

          {/* Minimal Feature Highlight Cards */}
          <div className="relative z-10 my-8 space-y-3.5 max-w-md">
            <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-white/60 dark:bg-[#0E131F]/60 border border-slate-200/80 dark:border-slate-800/80 backdrop-blur-md shadow-xs">
              <div className="p-2 rounded-xl bg-sky-500/10 dark:bg-[#00D1FF]/10 text-sky-600 dark:text-[#00D1FF] shrink-0 border border-sky-500/20 dark:border-[#00D1FF]/20">
                <Cpu size={16} />
              </div>
              <div className="text-xs">
                <div className="font-semibold text-slate-900 dark:text-slate-100">Component Identification</div>
                <p className="text-slate-500 dark:text-slate-400 mt-0.5 leading-normal">
                  Automatic optical recognition of SMD packages, microcontrollers, passive elements, and ref-des tags.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-white/60 dark:bg-[#0E131F]/60 border border-slate-200/80 dark:border-slate-800/80 backdrop-blur-md shadow-xs">
              <div className="p-2 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 shrink-0 border border-amber-500/20">
                <Activity size={16} />
              </div>
              <div className="text-xs">
                <div className="font-semibold text-slate-900 dark:text-slate-100">Fault & Anomaly Screening</div>
                <p className="text-slate-500 dark:text-slate-400 mt-0.5 leading-normal">
                  Flags solder bridges, component misorientations, thermal stress points, and trace discontinuities.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-white/60 dark:bg-[#0E131F]/60 border border-slate-200/80 dark:border-slate-800/80 backdrop-blur-md shadow-xs">
              <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 shrink-0 border border-cyan-500/20">
                <Layers size={16} />
              </div>
              <div className="text-xs">
                <div className="font-semibold text-slate-900 dark:text-slate-100">Datasheet & Telemetry Synthesis</div>
                <p className="text-slate-500 dark:text-slate-400 mt-0.5 leading-normal">
                  Instant pinout retrieval, electrical operating envelopes, and guided AI circuit diagnostics.
                </p>
              </div>
            </div>
          </div>

          {/* Footer Diagnostic Metadata */}
          <div className="relative z-10 pt-4 border-t border-slate-200/60 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-500 dark:text-slate-500 font-mono">
            <span>CircuSense AI • v2.4</span>
            <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
              <ShieldCheck size={14} className="text-sky-600 dark:text-[#00D1FF]" />
              <span>Hardware Session Security</span>
            </div>
          </div>
        </div>

        {/* Right Side: Centered Apple-Style Glassmorphism Authentication Card */}
        <div className="flex-1 flex items-center justify-center p-4 sm:p-8 lg:p-12 relative">
          <div className="w-full max-w-md flex flex-col items-center">
            {/* Mobile/Tablet Brand Heading (hidden on desktop) */}
            <div className="lg:hidden mb-6 text-center">
              <div className="inline-flex items-center gap-2 mb-2">
                <div className="w-7 h-7 rounded-xl bg-sky-500/10 dark:bg-[#00D1FF]/10 border border-sky-500/20 dark:border-[#00D1FF]/30 flex items-center justify-center text-sky-600 dark:text-[#00D1FF]">
                  <Cpu size={15} />
                </div>
                <span className="font-bold text-lg text-slate-900 dark:text-white">
                  CircuSense <span className="text-sky-600 dark:text-[#00D1FF]">AI</span>
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Understand Every Circuit • AI-powered PCB diagnosis
              </p>
            </div>

            {/* Apple-Style Glassmorphism Card */}
            <div className="w-full relative rounded-2xl bg-white/80 dark:bg-[#0E131F]/75 backdrop-blur-2xl border border-slate-200/80 dark:border-white/[0.08] p-6 sm:p-8 shadow-[0_20px_50px_rgba(15,23,42,0.08)] dark:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.65)] transition-all">
              {/* Subtle top specular hairline highlight */}
              <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-sky-400/30 dark:via-cyan-400/25 to-transparent rounded-t-2xl pointer-events-none" />

              {/* Inner Form Content */}
              {children}
            </div>

            {/* Ambient Security Note */}
            <p className="text-[11px] text-slate-500 dark:text-slate-500 text-center mt-6 flex items-center justify-center gap-1.5 font-mono">
              <ShieldCheck size={13} className="text-slate-400 dark:text-slate-500" />
              <span>Diagnostic session encrypted • Local optical inference</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
