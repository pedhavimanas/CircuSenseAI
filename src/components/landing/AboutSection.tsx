import React from 'react';
import { ArrowRight, ShieldCheck, Cpu, Database, Eye } from 'lucide-react';

export const AboutSection: React.FC = () => {
  const steps = [
    { title: 'Upload', desc: 'Raw photos or optical board captures', icon: Eye },
    { title: 'Identify', desc: 'OCR markings & package segmentation', icon: Cpu },
    { title: 'Analyze', desc: 'Schematic netlist logic & anomaly detection', icon: ShieldCheck },
    { title: 'Understand', desc: 'Actionable diagnostics & pinout intelligence', icon: Database }
  ];

  return (
    <section id="about" className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 relative z-10 scroll-mt-24 w-full max-w-full overflow-hidden">
      <div className="max-w-7xl mx-auto text-center space-y-3 sm:space-y-4 mb-10 sm:mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 dark:bg-[#00D1FF]/10 border border-sky-500/20 dark:border-[#00D1FF]/20 text-sky-600 dark:text-[#00D1FF] text-xs font-mono font-medium">
          Our Engineering Philosophy
        </div>
        <h2 className="font-domine text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight break-words">
          Engineering Intelligence, Simplified
        </h2>
        <p className="text-xs sm:text-sm md:text-base text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
          The technology should be complicated; the interface should not be.
        </p>
      </div>

      {/* Large Glassmorphic Information Card */}
      <div className="max-w-5xl mx-auto rounded-2xl sm:rounded-3xl bg-white/70 dark:bg-[#090D18]/85 border border-slate-200/80 dark:border-white/[0.09] backdrop-blur-2xl p-4 sm:p-10 shadow-2xl relative overflow-hidden text-left">
        {/* Subtle Circuit SVG overlay */}
        <svg
          className="absolute -right-20 -bottom-20 w-96 h-96 text-cyan-400/[0.07] pointer-events-none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="200" cy="200" r="160" stroke="currentColor" strokeWidth="2" strokeDasharray="10 10" fill="none" />
          <circle cx="200" cy="200" r="100" stroke="currentColor" strokeWidth="2" strokeDasharray="6 6" fill="none" />
          <path d="M40 200 H360 M200 40 V360" stroke="currentColor" strokeWidth="1.5" />
        </svg>

        <div className="relative z-10 space-y-8">
          <div className="space-y-4 max-w-3xl">
            <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
              Built by Hardware Engineers, for the Diagnostics Community
            </h3>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
              CircuSense AI is designed to make PCB analysis more accessible by combining computer vision, OCR, AI-assisted reasoning and engineering information into a single workflow.
            </p>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              Traditional board reverse-engineering requires juggling magnifying lenses, multimeter continuity probes, dozens of open PDF datasheet tabs, and hours of schematic tracking. CircuSense streamlines this entire loop into an intelligent visual copilot.
            </p>
          </div>

          {/* Linear Progression Steps */}
          <div className="pt-4 border-t border-slate-200/80 dark:border-white/[0.07]">
            <div className="text-xs font-mono font-bold uppercase tracking-wider text-sky-600 dark:text-[#00D1FF] mb-5">
              The Unified Workflow
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {steps.map((s, idx) => {
                const StepIcon = s.icon;
                return (
                  <div
                    key={s.title}
                    className="p-4 rounded-2xl bg-slate-50 dark:bg-white/[0.04] border border-slate-200/70 dark:border-white/[0.07] flex flex-col justify-between space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <div className="w-8 h-8 rounded-xl bg-sky-500/10 dark:bg-[#00D1FF]/10 text-sky-600 dark:text-[#00D1FF] flex items-center justify-center border border-sky-500/20">
                        <StepIcon size={16} />
                      </div>
                      <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500 font-bold">
                        0{idx + 1}
                      </span>
                    </div>

                    <div>
                      <div className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1">
                        <span>{s.title}</span>
                        {idx < 3 && (
                          <ArrowRight size={13} className="hidden lg:inline text-slate-400 ml-auto" />
                        )}
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-snug">
                        {s.desc}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
