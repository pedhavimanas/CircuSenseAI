import React from 'react';
import { UploadCloud, ScanLine, BrainCircuit, FileSearch, CheckSquare } from 'lucide-react';

export const HowItWorksSection: React.FC = () => {
  const steps = [
    {
      number: '01',
      title: 'Upload',
      description: 'Upload your PCB image.',
      icon: UploadCloud,
      meta: 'High-Res Optical Photo'
    },
    {
      number: '02',
      title: 'Scan',
      description: 'CircuSense AI scans the board and identifies visible components.',
      icon: ScanLine,
      meta: 'Bbox & OCR Detection'
    },
    {
      number: '03',
      title: 'Analyze',
      description: 'AI analyzes components and available information.',
      icon: BrainCircuit,
      meta: 'Neural Netlist Synthesis'
    },
    {
      number: '04',
      title: 'Understand',
      description: 'Explore results, datasheets and AI explanations.',
      icon: FileSearch,
      meta: 'Interactive Schematics'
    },
    {
      number: '05',
      title: 'Inspect',
      description: 'Review possible visual issues and recommendations.',
      icon: CheckSquare,
      meta: 'Visual Verification'
    }
  ];

  return (
    <section id="how-it-works" className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 relative z-10 overflow-hidden scroll-mt-24 w-full max-w-full">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] sm:w-[800px] h-[300px] bg-sky-500/[0.04] dark:bg-[#00D1FF]/[0.03] blur-[100px] sm:blur-[140px] pointer-events-none max-w-full" />

      <div className="max-w-7xl mx-auto text-center space-y-3 sm:space-y-4 mb-10 sm:mb-20">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 dark:bg-[#00D1FF]/10 border border-sky-500/20 dark:border-[#00D1FF]/20 text-sky-600 dark:text-[#00D1FF] text-xs font-mono font-medium">
          Step-by-Step Diagnostic Pipeline
        </div>
        <h2 className="font-domine text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight break-words">
          From PCB Image to Circuit Intelligence
        </h2>
        <p className="text-xs sm:text-sm md:text-base text-slate-600 dark:text-slate-400 max-w-xl mx-auto leading-relaxed">
          A seamless 5-stage automated engineering pipeline translating raw hardware imagery into actionable circuit knowledge.
        </p>
      </div>

      {/* Pipeline Container */}
      <div className="max-w-7xl mx-auto relative">
        {/* Horizontal Connecting Guide Line on Desktop with Animated Pulse */}
        <div className="hidden lg:block absolute top-[52px] left-[8%] right-[8%] h-[2px] bg-slate-200 dark:bg-white/[0.08] z-0 overflow-hidden">
          <div className="w-1/3 h-full bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-pulse" />
        </div>

        {/* 5 Steps Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6 relative z-10">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={step.number}
                className="group relative rounded-2xl p-5 bg-white/75 dark:bg-[#0C101C]/80 border border-slate-200/80 dark:border-white/[0.08] backdrop-blur-xl shadow-xs hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5 text-left flex flex-col justify-between"
              >
                <div>
                  {/* Step Number & Icon Header */}
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-11 h-11 rounded-xl bg-sky-500/10 dark:bg-[#00D1FF]/10 text-sky-600 dark:text-[#00D1FF] flex items-center justify-center border border-sky-500/20 dark:border-[#00D1FF]/20 shadow-xs group-hover:scale-105 transition-transform">
                      <Icon size={20} />
                    </div>
                    <span className="text-xs font-mono font-bold text-slate-400 dark:text-slate-500 group-hover:text-sky-600 dark:group-hover:text-[#00D1FF] transition-colors">
                      STEP {step.number}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
                    {step.title}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    {step.description}
                  </p>
                </div>

                {/* Step Sub-label */}
                <div className="mt-5 pt-3 border-t border-slate-100 dark:border-white/[0.05] text-[10px] font-mono text-slate-500 dark:text-slate-400">
                  {step.meta}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
