import React from 'react';

export const PCBBackground: React.FC = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none select-none z-0">
      {/* Ambient Blue Radial Glows */}
      <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-cyan-500/10 dark:bg-[#00D1FF]/[0.07] blur-[120px]" />
      <div className="absolute -bottom-40 right-0 w-[550px] h-[550px] rounded-full bg-blue-600/10 dark:bg-sky-500/[0.05] blur-[140px]" />
      <div className="absolute top-1/2 left-1/3 -translate-y-1/2 w-[450px] h-[450px] rounded-full bg-cyan-400/[0.04] blur-[100px]" />

      {/* Subtle Dot Matrix Grid */}
      <div className="absolute inset-0 pcb-grid-pattern opacity-30 dark:opacity-20" />

      {/* Subtle PCB Vector Traces & Circuit Nodes */}
      <svg
        className="absolute inset-0 w-full h-full opacity-25 dark:opacity-20 text-slate-400 dark:text-cyan-400/40"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
      >
        <defs>
          <pattern id="pcb-traces" width="320" height="320" patternUnits="userSpaceOnUse">
            {/* Horizontal & 45-degree trace lines */}
            <path
              d="M0 40 H120 L160 80 H280 M160 80 V180 L190 210 H320"
              stroke="currentColor"
              strokeWidth="0.75"
              strokeDasharray="4 6"
              strokeOpacity="0.4"
            />
            <path
              d="M40 320 V220 L70 190 H180 M70 190 V100"
              stroke="currentColor"
              strokeWidth="0.75"
              strokeOpacity="0.3"
            />
            <path
              d="M220 0 V60 L240 80 H320"
              stroke="currentColor"
              strokeWidth="0.75"
              strokeOpacity="0.35"
            />
            <path
              d="M80 0 V40 M280 260 H320 M0 280 H90 L120 310 V320"
              stroke="currentColor"
              strokeWidth="0.75"
              strokeOpacity="0.3"
            />

            {/* Test points and via pads */}
            <circle cx="120" cy="40" r="2.5" fill="none" stroke="currentColor" strokeWidth="0.8" />
            <circle cx="120" cy="40" r="1" fill="currentColor" />

            <circle cx="160" cy="80" r="2.5" fill="none" stroke="currentColor" strokeWidth="0.8" />
            <circle cx="160" cy="80" r="1" fill="currentColor" />

            <circle cx="190" cy="210" r="2.5" fill="none" stroke="currentColor" strokeWidth="0.8" />
            <circle cx="190" cy="210" r="1" fill="currentColor" />

            <circle cx="70" cy="190" r="2" fill="currentColor" strokeOpacity="0.6" />
            <circle cx="240" cy="80" r="2" fill="currentColor" strokeOpacity="0.6" />

            {/* Micro SMD component pad outlines */}
            <rect x="250" y="75" width="6" height="10" rx="1" stroke="currentColor" strokeWidth="0.6" strokeOpacity="0.4" fill="none" />
            <rect x="264" y="75" width="6" height="10" rx="1" stroke="currentColor" strokeWidth="0.6" strokeOpacity="0.4" fill="none" />
            <rect x="40" y="240" width="10" height="6" rx="1" stroke="currentColor" strokeWidth="0.6" strokeOpacity="0.4" fill="none" />
            <rect x="40" y="254" width="10" height="6" rx="1" stroke="currentColor" strokeWidth="0.6" strokeOpacity="0.4" fill="none" />
          </pattern>
        </defs>

        <rect width="100%" height="100%" fill="url(#pcb-traces)" />
      </svg>
    </div>
  );
};
