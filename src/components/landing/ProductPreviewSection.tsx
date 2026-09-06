import React, { useState } from 'react';
import {
  Cpu,
  AlertTriangle,
  CheckCircle2,
  Layers,
  Info,
  ExternalLink,
  ShieldAlert,
  Search
} from 'lucide-react';
import { AuthMode } from '../../types';

interface ProductPreviewSectionProps {
  onNavigateAuth: (mode: AuthMode) => void;
}

export const ProductPreviewSection: React.FC<ProductPreviewSectionProps> = ({ onNavigateAuth }) => {
  const [selectedComp, setSelectedComp] = useState<'U1' | 'R1' | 'C14'>('C14');

  const componentsData = {
    U1: {
      ref: 'U1',
      name: 'LM7805',
      type: 'Voltage Regulator',
      confidence: 97,
      package: 'TO-220',
      status: 'normal',
      notes: 'Nominal output +5.0V regulated. Heat dissipation path verified.',
      pinCount: 3
    },
    R1: {
      ref: 'R1',
      name: '10kΩ Resistor',
      type: 'Resistor',
      confidence: 94,
      package: '0805 SMD',
      status: 'normal',
      notes: 'Pull-up resistor for reset line. Solder fillet normal.',
      pinCount: 2
    },
    C14: {
      ref: 'C14',
      name: '10µF 50V Capacitor',
      type: 'Capacitor',
      confidence: 91,
      package: '1206 SMD',
      status: 'inspection',
      notes: 'C14 may require physical inspection. Visual anomaly detected near positive pad.',
      pinCount: 2
    }
  };

  return (
    <section id="product-preview" className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 relative z-10 scroll-mt-24 w-full max-w-full overflow-hidden">
      <div className="max-w-7xl mx-auto text-center space-y-3 sm:space-y-4 mb-10 sm:mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 dark:bg-[#00D1FF]/10 border border-sky-500/20 dark:border-[#00D1FF]/20 text-sky-600 dark:text-[#00D1FF] text-xs font-mono font-medium">
          Interactive Platform Showcase
        </div>
        <h2 className="font-domine text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight break-words">
          See Your PCB Differently
        </h2>
        <p className="text-xs sm:text-sm md:text-base text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Experience real-time component segmentation, optical verification, and automated anomaly flagging directly on circuit imagery.
        </p>
      </div>

      {/* Main Glassmorphic Showcase Mock Frame */}
      <div className="max-w-6xl mx-auto rounded-2xl sm:rounded-3xl bg-white/70 dark:bg-[#090D18]/80 border border-slate-200/80 dark:border-white/[0.09] backdrop-blur-2xl p-3.5 sm:p-7 shadow-2xl overflow-hidden relative">
        {/* Top Window Bar */}
        <div className="flex items-center justify-between pb-3 sm:pb-4 mb-4 sm:mb-5 border-b border-slate-200/70 dark:border-white/[0.07] text-xs font-mono text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
            <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
            <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
            <span className="ml-2 sm:ml-3 font-semibold text-slate-700 dark:text-slate-300 text-[11px] sm:text-xs">
              CircuSense Studio • Diagnostic Workbench
            </span>
          </div>
          <div className="hidden sm:flex items-center gap-3">
            <span className="text-[11px] text-sky-600 dark:text-[#00D1FF]">PCB: Power_Reg_V2.brd</span>
            <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold">
              Optical Model Active
            </span>
          </div>
        </div>

        {/* Two-Column Mockup View */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-stretch">
          {/* Left Column: Simulated PCB Optical Board View */}
          <div className="lg:col-span-7 rounded-xl sm:rounded-2xl bg-[#060910] border border-cyan-500/20 relative min-h-[300px] sm:min-h-[440px] flex flex-col justify-between p-3.5 sm:p-5 overflow-hidden">
            {/* PCB Trace Graphic */}
            <svg
              className="absolute inset-0 w-full h-full text-cyan-500/15 pointer-events-none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <pattern id="preview-grid" width="24" height="24" patternUnits="userSpaceOnUse">
                  <circle cx="12" cy="12" r="0.75" fill="currentColor" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#preview-grid)" />
              <path
                d="M50 120 H200 L240 160 H380 V280"
                stroke="currentColor"
                strokeWidth="1.5"
                fill="none"
              />
              <path
                d="M120 340 V240 L160 200 H320"
                stroke="currentColor"
                strokeWidth="1.5"
                fill="none"
              />
            </svg>

            {/* Top Toolbar overlay on PCB */}
            <div className="relative z-10 flex items-center justify-between text-[10px] sm:text-[11px] font-mono text-slate-400 bg-[#0B0F19]/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/[0.08]">
              <span className="flex items-center gap-1.5 text-cyan-400">
                <Search size={12} />
                <span>Bounding Box Overlay</span>
              </span>
              <span>100% Zoom</span>
            </div>

            {/* Interactive Component Bounding Boxes */}
            <div className="relative z-10 my-auto flex items-center justify-center gap-3 sm:gap-8 py-5 sm:py-8 flex-wrap">
              {/* U1 Box */}
              <button
                type="button"
                onClick={() => setSelectedComp('U1')}
                className={`relative p-2.5 sm:p-4 rounded-xl border-2 transition-all cursor-pointer ${
                  selectedComp === 'U1'
                    ? 'border-cyan-400 bg-cyan-500/15 shadow-[0_0_20px_rgba(0,209,255,0.3)] scale-105'
                    : 'border-cyan-500/40 bg-slate-900/60 hover:border-cyan-400/80'
                }`}
              >
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-[#0F172A] border border-cyan-500/40 rounded-lg flex flex-col items-center justify-center">
                  <Cpu size={22} className="text-cyan-400 mb-1" />
                  <span className="text-[10px] sm:text-[11px] font-mono font-bold text-white">U1</span>
                  <span className="text-[7px] sm:text-[8px] font-mono text-cyan-400">LM7805</span>
                </div>
                <span className="absolute -top-2.5 left-2 px-1.5 py-0.5 rounded bg-cyan-500 text-[9px] font-mono font-bold text-black">
                  U1
                </span>
              </button>

              {/* R1 Box */}
              <button
                type="button"
                onClick={() => setSelectedComp('R1')}
                className={`relative p-2 sm:p-3 rounded-xl border-2 transition-all cursor-pointer ${
                  selectedComp === 'R1'
                    ? 'border-sky-400 bg-sky-500/15 shadow-[0_0_20px_rgba(14,165,233,0.3)] scale-105'
                    : 'border-slate-700 bg-slate-900/60 hover:border-sky-400/70'
                }`}
              >
                <div className="w-14 h-10 sm:w-16 sm:h-12 bg-[#0F172A] border border-slate-700 rounded-lg flex flex-col items-center justify-center">
                  <span className="text-[10px] sm:text-[11px] font-mono font-bold text-white">R1</span>
                  <span className="text-[7px] sm:text-[8px] font-mono text-slate-400">10kΩ</span>
                </div>
                <span className="absolute -top-2.5 left-2 px-1.5 py-0.5 rounded bg-sky-600 text-[9px] font-mono font-bold text-white">
                  R1
                </span>
              </button>

              {/* C14 Box (Flagged) */}
              <button
                type="button"
                onClick={() => setSelectedComp('C14')}
                className={`relative p-2 sm:p-3.5 rounded-xl border-2 transition-all cursor-pointer ${
                  selectedComp === 'C14'
                    ? 'border-amber-400 bg-amber-500/20 shadow-[0_0_22px_rgba(245,158,11,0.4)] scale-105'
                    : 'border-amber-500/50 bg-slate-900/60 hover:border-amber-400'
                }`}
              >
                <div className="w-14 h-12 sm:w-16 sm:h-14 bg-[#181512] border border-amber-500/40 rounded-lg flex flex-col items-center justify-center">
                  <AlertTriangle size={16} className="text-amber-400 mb-0.5 animate-pulse" />
                  <span className="text-[10px] sm:text-[11px] font-mono font-bold text-white">C14</span>
                  <span className="text-[7px] sm:text-[8px] font-mono text-amber-300">10µF</span>
                </div>
                <span className="absolute -top-2.5 left-2 px-1.5 py-0.5 rounded bg-amber-500 text-[9px] font-mono font-bold text-black flex items-center gap-1">
                  <span>C14</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-red-600" />
                </span>
              </button>
            </div>

            {/* Bottom status line */}
            <div className="relative z-10 text-[10px] font-mono text-slate-400 flex items-center justify-between bg-[#0B0F19]/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/[0.08]">
              <span>Selected: {selectedComp}</span>
              <span className="text-cyan-400">Optical scan active</span>
            </div>
          </div>

          {/* Right Column: AI Analysis Panel */}
          <div className="lg:col-span-5 rounded-xl sm:rounded-2xl bg-white/80 dark:bg-[#0C101C]/90 border border-slate-200/80 dark:border-white/[0.08] p-4 sm:p-6 flex flex-col justify-between text-left">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200/80 dark:border-white/[0.07]">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-sky-500/10 dark:bg-[#00D1FF]/10 text-sky-600 dark:text-[#00D1FF] flex items-center justify-center border border-sky-500/20">
                    <Layers size={14} />
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">Detected Components</h3>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-100 dark:bg-white/[0.06] text-slate-500 dark:text-slate-400">
                  3 Selected Sample
                </span>
              </div>

              {/* Component Rows */}
              <div className="space-y-2">
                {Object.values(componentsData).map((c) => (
                  <div
                    key={c.ref}
                    onClick={() => setSelectedComp(c.ref as any)}
                    className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                      selectedComp === c.ref
                        ? 'bg-sky-500/10 dark:bg-[#00D1FF]/10 border-sky-500/40 dark:border-[#00D1FF]/40 shadow-xs'
                        : 'bg-slate-50 dark:bg-white/[0.03] border-slate-200/60 dark:border-white/[0.05] hover:border-slate-300 dark:hover:border-white/[0.1]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-xs font-mono font-bold text-slate-900 dark:text-white">
                        {c.ref}
                      </span>
                      <div>
                        <div className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                          {c.name}
                        </div>
                        <div className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                          {c.type} • {c.package}
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div
                        className={`text-xs font-mono font-bold ${
                          c.status === 'inspection'
                            ? 'text-amber-600 dark:text-amber-400'
                            : 'text-emerald-600 dark:text-emerald-400'
                        }`}
                      >
                        {c.status === 'inspection' ? 'Needs Inspection' : 'Verified'}
                      </div>
                      <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">
                        {c.status === 'inspection' ? 'Flagged Anomaly' : 'Component Identified'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Anomaly Inspection Box */}
              <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-left space-y-1.5">
                <div className="flex items-center gap-2 text-amber-700 dark:text-amber-300 text-xs font-bold">
                  <ShieldAlert size={15} className="text-amber-600 dark:text-amber-400 shrink-0" />
                  <span>Possible Visual Anomaly</span>
                </div>
                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                  <span className="font-semibold text-amber-700 dark:text-amber-300">C14</span> may require physical inspection. Optical texture indicates potential thermal stress or solder irregularity.
                </p>
              </div>

              {/* Primary Action Button */}
              <button
                type="button"
                onClick={() => onNavigateAuth('signup')}
                className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-400 hover:to-cyan-400 text-white dark:text-[#050811] font-semibold text-xs tracking-wide shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
              >
                <span>Check for Possible Issues</span>
                <ExternalLink size={14} />
              </button>
            </div>

            {/* MANDATORY DISCLAIMER */}
            <div className="mt-5 pt-3 border-t border-slate-200/70 dark:border-white/[0.06] flex items-start gap-2 text-[10px] text-slate-500 dark:text-slate-400 leading-normal">
              <Info size={13} className="text-slate-400 dark:text-slate-500 shrink-0 mt-0.5" />
              <span>
                <strong>Engineering Notice:</strong> Visual AI findings are recommendations and preliminary optical indicators, not confirmed electrical diagnoses. Always verify measurements with calibrated test instruments.
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
