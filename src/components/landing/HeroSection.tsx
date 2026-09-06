import React from 'react';
import { motion } from 'motion/react';
import {
  ArrowRight,
  Cpu,
  Zap,
  Activity,
  CheckCircle2,
  AlertTriangle,
  Layers,
  Sparkles,
  Search
} from 'lucide-react';
import { AuthMode } from '../../types';

interface HeroSectionProps {
  onNavigateAuth: (mode: AuthMode) => void;
  onExploreFeatures: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onNavigateAuth,
  onExploreFeatures
}) => {
  return (
    <section
      id="home"
      className="relative min-h-[85vh] sm:min-h-[90vh] pt-24 sm:pt-32 pb-14 sm:pb-20 px-4 sm:px-6 lg:px-8 flex flex-col justify-center overflow-hidden w-full max-w-full"
    >
      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] sm:w-[700px] h-[350px] sm:h-[700px] rounded-full bg-cyan-500/[0.08] dark:bg-[#00D1FF]/[0.07] blur-[100px] sm:blur-[150px] pointer-events-none max-w-full" />
      <div className="absolute top-1/3 left-0 sm:left-10 w-[250px] sm:w-[400px] h-[250px] sm:h-[400px] rounded-full bg-blue-600/[0.06] dark:bg-sky-500/[0.04] blur-[90px] sm:blur-[120px] pointer-events-none max-w-full" />

      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-8 items-center relative z-10">
        {/* Left Column: Typography & CTAs */}
        <div className="lg:col-span-6 xl:col-span-6 space-y-5 sm:space-y-6 text-left">
          {/* Engineering Badge */}
          <div className="inline-flex items-center gap-2 px-3 sm:px-3.5 py-1.5 rounded-full bg-white/70 dark:bg-[#0E1424]/70 border border-slate-200/80 dark:border-white/[0.08] backdrop-blur-md shadow-xs">
            <span className="flex h-2 w-2 rounded-full bg-sky-500 dark:bg-[#00D1FF] animate-ping" />
            <span className="text-[10px] sm:text-[11px] font-mono font-medium text-slate-700 dark:text-slate-300">
              AI-powered intelligence for every PCB
            </span>
          </div>

          {/* Main Display Headline */}
          <h1 className="font-domine text-3xl sm:text-5xl lg:text-6xl xl:text-[64px] font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.15] break-words">
            Understand <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-600 via-sky-500 to-cyan-500 dark:from-[#00D1FF] dark:via-cyan-300 dark:to-sky-400">
              Every Circuit
            </span>
          </h1>

          {/* Supporting Copy */}
          <p className="text-sm sm:text-base lg:text-lg text-slate-600 dark:text-slate-400 leading-relaxed max-w-xl">
            Identify components, analyze circuit boards, explore datasheets, and investigate possible PCB issues with AI-assisted intelligence.
          </p>

          {/* Action CTAs */}
          <div className="pt-1 sm:pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
            <button
              onClick={() => onNavigateAuth('signup')}
              id="hero-btn-get-started"
              className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-400 hover:to-cyan-400 text-white dark:text-[#050811] font-semibold text-xs sm:text-sm tracking-wide shadow-[0_4px_20px_rgba(14,165,233,0.3)] dark:shadow-[0_4px_24px_rgba(0,209,255,0.3)] hover:shadow-[0_6px_28px_rgba(14,165,233,0.4)] dark:hover:shadow-[0_6px_32px_rgba(0,209,255,0.4)] transition-all cursor-pointer flex items-center justify-center gap-2 group active:scale-[0.98]"
            >
              <span>Get Started</span>
              <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
            </button>

            <button
              onClick={onExploreFeatures}
              id="hero-btn-explore-features"
              className="px-6 py-3.5 rounded-xl bg-white/70 dark:bg-white/[0.05] hover:bg-white/90 dark:hover:bg-white/[0.08] text-slate-800 dark:text-slate-200 font-semibold text-xs sm:text-sm border border-slate-200/80 dark:border-white/[0.09] backdrop-blur-md transition-all cursor-pointer flex items-center justify-center gap-2 hover:border-slate-300 dark:hover:border-white/[0.15]"
            >
              <Search size={15} className="text-sky-600 dark:text-[#00D1FF]" />
              <span>Explore Features</span>
            </button>
          </div>
        </div>

        {/* Right Column: Futuristic Interactive Glass PCB Visualization */}
        <div className="lg:col-span-6 xl:col-span-6 relative flex items-center justify-center w-full max-w-full">
          {/* Outer Glass Frame */}
          <div className="relative w-full max-w-[540px] aspect-auto sm:aspect-[4/3] min-h-[320px] sm:min-h-[380px] rounded-2xl sm:rounded-3xl bg-slate-900/[0.03] dark:bg-[#080B14]/80 border border-slate-200/90 dark:border-white/[0.09] backdrop-blur-xl shadow-2xl p-3 sm:p-5 overflow-hidden">
            {/* Top specular hairline highlight */}
            <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent" />

            {/* Inner Dark PCB Substrate Surface */}
            <div className="relative w-full h-full rounded-2xl bg-[#070A11] border border-cyan-500/20 overflow-hidden flex items-center justify-center">
              {/* Circuit Grid & Copper Traces */}
              <svg
                className="absolute inset-0 w-full h-full text-cyan-400/25 pointer-events-none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  <pattern id="hero-board-grid" width="30" height="30" patternUnits="userSpaceOnUse">
                    <circle cx="15" cy="15" r="0.8" fill="currentColor" fillOpacity="0.4" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#hero-board-grid)" />

                {/* Main Copper Traces */}
                <path
                  d="M40 80 H180 L220 120 H340 V200 L380 240 H480"
                  stroke="currentColor"
                  strokeWidth="1.2"
                  strokeDasharray="4 4"
                  fill="none"
                />
                <path
                  d="M100 280 V200 L140 160 H260 V90"
                  stroke="currentColor"
                  strokeWidth="1.2"
                  strokeDasharray="6 3"
                  fill="none"
                />
                <path
                  d="M280 40 V100 L310 130 H440"
                  stroke="currentColor"
                  strokeWidth="1"
                  fill="none"
                />
              </svg>

              {/* Central Main IC Chip (U1 LM7805/Microcontroller) */}
              <div className="relative z-10 w-28 h-28 sm:w-32 sm:h-32 rounded-xl bg-[#0D121F] border-2 border-cyan-500/40 shadow-[0_0_25px_rgba(0,209,255,0.15)] flex flex-col items-center justify-center p-2 text-center group">
                {/* Pin indicators on edges */}
                <div className="absolute -top-1.5 inset-x-3 flex justify-between">
                  {[0, 1, 2, 3].map((i) => (
                    <div key={i} className="w-1.5 h-1.5 bg-cyan-400/80 rounded-xs" />
                  ))}
                </div>
                <div className="absolute -bottom-1.5 inset-x-3 flex justify-between">
                  {[0, 1, 2, 3].map((i) => (
                    <div key={i} className="w-1.5 h-1.5 bg-cyan-400/80 rounded-xs" />
                  ))}
                </div>
                <div className="absolute -left-1.5 inset-y-3 flex flex-col justify-between">
                  {[0, 1, 2, 3].map((i) => (
                    <div key={i} className="w-1.5 h-1.5 bg-cyan-400/80 rounded-xs" />
                  ))}
                </div>
                <div className="absolute -right-1.5 inset-y-3 flex flex-col justify-between">
                  {[0, 1, 2, 3].map((i) => (
                    <div key={i} className="w-1.5 h-1.5 bg-cyan-400/80 rounded-xs" />
                  ))}
                </div>

                <Cpu size={22} className="text-cyan-400 mb-1 animate-pulse" />
                <span className="text-[10px] font-mono font-bold text-white">U1 • LM7805</span>
                <span className="text-[8px] font-mono text-cyan-400">REGULATOR</span>
              </div>

              {/* Auxiliary SMD components around board */}
              <div className="absolute top-10 left-12 px-2 py-1 rounded bg-[#101726] border border-slate-700 text-[9px] font-mono text-slate-300">
                R1 • 10kΩ
              </div>
              <div className="absolute bottom-12 left-16 px-2 py-1 rounded bg-[#101726] border border-amber-500/50 text-[9px] font-mono text-amber-300 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
                <span>C14 • 10µF</span>
              </div>
              <div className="absolute top-12 right-14 px-2 py-1 rounded bg-[#101726] border border-slate-700 text-[9px] font-mono text-slate-300">
                D1 • Schottky
              </div>
              <div className="absolute bottom-10 right-16 px-2 py-1 rounded bg-[#101726] border border-slate-700 text-[9px] font-mono text-slate-300">
                Q1 • MOSFET
              </div>

              {/* Laser Optical Scan Line */}
              <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_12px_#00D1FF] animate-pulse pointer-events-none" />
            </div>

            {/* FLOATING GLASS CARDS (4 Cards with Motion) */}

            {/* Card 1: Components Detected (Top Left) */}
            <motion.div
              animate={{ y: [0, -4, 0] }}
              transition={{ duration: 4.2, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute top-2 left-2 sm:top-3 sm:left-3 p-2 sm:p-2.5 rounded-xl sm:rounded-2xl bg-white/85 dark:bg-[#0E1424]/90 border border-slate-200/80 dark:border-white/[0.1] backdrop-blur-xl shadow-lg z-20 flex items-center gap-2 max-w-[170px] sm:max-w-none"
            >
              <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg sm:rounded-xl bg-sky-500/10 dark:bg-[#00D1FF]/10 text-sky-600 dark:text-[#00D1FF] flex items-center justify-center shrink-0 border border-sky-500/20">
                <Layers size={13} />
              </div>
              <div className="text-left">
                <div className="text-[10px] sm:text-[11px] font-bold text-slate-900 dark:text-white leading-tight">Components Detected</div>
                <div className="text-[8px] sm:text-[9px] font-mono text-slate-500 dark:text-slate-400">42 Detected • 6 ICs</div>
              </div>
            </motion.div>

            {/* Card 2: Component Verified (Top Right) */}
            <motion.div
              animate={{ y: [0, 4, 0] }}
              transition={{ duration: 3.8, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
              className="absolute top-2 right-2 sm:top-3 sm:right-3 p-2 sm:p-2.5 rounded-xl sm:rounded-2xl bg-white/85 dark:bg-[#0E1424]/90 border border-slate-200/80 dark:border-white/[0.1] backdrop-blur-xl shadow-lg z-20 flex items-center gap-2 max-w-[160px] sm:max-w-none"
            >
              <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-md sm:rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                <CheckCircle2 size={12} />
              </div>
              <div className="text-left">
                <div className="text-[10px] sm:text-[11px] font-bold text-emerald-600 dark:text-emerald-400 font-mono leading-tight">Component Verified</div>
                <div className="text-[8px] sm:text-[9px] text-slate-500 dark:text-slate-400">LM7805 CV Identified</div>
              </div>
            </motion.div>

            {/* Card 3: AI Analysis (Bottom Left) */}
            <motion.div
              animate={{ y: [0, -4, 0] }}
              transition={{ duration: 4.6, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
              className="absolute bottom-2 left-2 sm:bottom-3 sm:left-3 p-2 sm:p-2.5 rounded-xl sm:rounded-2xl bg-white/85 dark:bg-[#0E1424]/90 border border-slate-200/80 dark:border-white/[0.1] backdrop-blur-xl shadow-lg z-20 flex items-center gap-2 max-w-[160px] sm:max-w-none"
            >
              <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-md sm:rounded-lg bg-sky-500/10 dark:bg-[#00D1FF]/10 text-sky-600 dark:text-[#00D1FF] flex items-center justify-center shrink-0">
                <Sparkles size={12} />
              </div>
              <div className="text-left">
                <div className="text-[10px] sm:text-[11px] font-bold text-slate-900 dark:text-white leading-tight">AI Analysis</div>
                <div className="text-[8px] sm:text-[9px] font-mono text-sky-600 dark:text-[#00D1FF]">Active Trace Mapping</div>
              </div>
            </motion.div>

            {/* Card 4: Possible Issue Detected (Bottom Right) */}
            <motion.div
              animate={{ y: [0, 4, 0] }}
              transition={{ duration: 3.9, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
              className="absolute bottom-2 right-2 sm:bottom-3 sm:right-3 p-2 sm:p-2.5 rounded-xl sm:rounded-2xl bg-white/90 dark:bg-[#0E1424]/95 border border-amber-500/30 dark:border-amber-500/30 backdrop-blur-xl shadow-lg z-20 flex items-center gap-2 max-w-[170px] sm:max-w-none"
            >
              <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg sm:rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 border border-amber-500/20">
                <AlertTriangle size={13} />
              </div>
              <div className="text-left">
                <div className="text-[10px] sm:text-[11px] font-bold text-amber-600 dark:text-amber-400 leading-tight">Possible Issue</div>
                <div className="text-[8px] sm:text-[9px] font-mono text-slate-500 dark:text-slate-400">C14 Thermal Flagged</div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};
