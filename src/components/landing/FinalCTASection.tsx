import React from 'react';
import { ArrowRight, Search, Cpu, Sparkles } from 'lucide-react';
import { AuthMode } from '../../types';

interface FinalCTASectionProps {
  onNavigateAuth: (mode: AuthMode) => void;
  onExploreFeatures: () => void;
}

export const FinalCTASection: React.FC<FinalCTASectionProps> = ({
  onNavigateAuth,
  onExploreFeatures
}) => {
  return (
    <section className="py-14 sm:py-20 px-4 sm:px-6 lg:px-8 relative z-10 w-full max-w-full overflow-hidden">
      <div className="max-w-5xl mx-auto rounded-2xl sm:rounded-3xl bg-gradient-to-b from-white/80 via-white/70 to-white/90 dark:from-[#0B101D]/90 dark:via-[#090D18]/90 dark:to-[#070A12]/95 border border-slate-200/90 dark:border-white/[0.1] backdrop-blur-2xl p-6 sm:p-14 shadow-2xl relative overflow-hidden text-center">
        {/* Ambient background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[320px] sm:w-[500px] h-[300px] bg-sky-500/[0.12] dark:bg-[#00D1FF]/[0.08] blur-[100px] sm:blur-[120px] pointer-events-none max-w-full" />

        {/* Specular hairline highlight */}
        <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent" />

        <div className="relative z-10 max-w-2xl mx-auto space-y-4 sm:space-y-6">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 dark:bg-[#00D1FF]/10 border border-sky-500/20 dark:border-[#00D1FF]/20 text-sky-600 dark:text-[#00D1FF] text-xs font-mono font-medium">
            <Sparkles size={12} />
            <span>Start Analyzing Today</span>
          </div>

          {/* Heading */}
          <h2 className="font-domine text-2xl sm:text-3xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight break-words">
            Ready to Understand Your Circuit?
          </h2>

          {/* Subtitle */}
          <p className="text-xs sm:text-sm md:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
            Turn your PCB images into actionable engineering insights. Accelerate board inspection, detect visual anomalies, and access datasheet pinouts in seconds.
          </p>

          {/* Buttons */}
          <div className="pt-2 sm:pt-4 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            <button
              onClick={() => onNavigateAuth('signup')}
              className="px-7 py-3.5 rounded-xl bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-400 hover:to-cyan-400 text-white dark:text-[#050811] font-semibold text-xs sm:text-sm tracking-wide shadow-[0_4px_20px_rgba(14,165,233,0.3)] dark:shadow-[0_4px_24px_rgba(0,209,255,0.3)] hover:shadow-[0_6px_28px_rgba(14,165,233,0.4)] dark:hover:shadow-[0_6px_32px_rgba(0,209,255,0.4)] transition-all cursor-pointer flex items-center gap-2 group active:scale-[0.98]"
            >
              <span>Get Started</span>
              <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
            </button>

            <button
              onClick={onExploreFeatures}
              className="px-6 py-3.5 rounded-xl bg-white/80 dark:bg-white/[0.05] hover:bg-white dark:hover:bg-white/[0.09] text-slate-800 dark:text-slate-200 font-semibold text-xs sm:text-sm border border-slate-200/80 dark:border-white/[0.09] backdrop-blur-md transition-all cursor-pointer flex items-center gap-2"
            >
              <Search size={15} className="text-sky-600 dark:text-[#00D1FF]" />
              <span>Explore Features</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
