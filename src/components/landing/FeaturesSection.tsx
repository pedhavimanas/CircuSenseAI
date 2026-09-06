import React from 'react';
import {
  Cpu,
  CircuitBoard,
  Scan,
  FileText,
  AlertTriangle,
  Bot,
  ArrowUpRight
} from 'lucide-react';

export const FeaturesSection: React.FC = () => {
  const features = [
    {
      id: 'component-detection',
      title: 'Component Detection',
      description: 'Automatically identify electronic components from PCB images.',
      icon: Cpu,
      badge: 'Vision Model',
      highlight: 'Vision Segmentation'
    },
    {
      id: 'circuit-analysis',
      title: 'AI Circuit Analysis',
      description: 'Understand components, connections and circuit behavior with AI assistance.',
      icon: CircuitBoard,
      badge: 'Reasoning Engine',
      highlight: 'Netlist Logic'
    },
    {
      id: 'component-identification',
      title: 'Component Identification',
      description: 'Read component markings and identify ICs and other components.',
      icon: Scan,
      badge: 'OCR & Package AI',
      highlight: 'SMD Markings'
    },
    {
      id: 'datasheet-intelligence',
      title: 'Datasheet Intelligence',
      description: 'Quickly access useful component specifications and datasheet information.',
      icon: FileText,
      badge: 'Knowledge Base',
      highlight: 'Pinout Synthesis'
    },
    {
      id: 'fault-analysis',
      title: 'Fault Analysis',
      description: 'Detect visual anomalies and highlight components that may require inspection.',
      icon: AlertTriangle,
      badge: 'Anomaly Screening',
      highlight: 'Visual Screener'
    },
    {
      id: 'ai-assistant',
      title: 'AI Assistant',
      description: 'Ask questions about your PCB and receive contextual explanations.',
      icon: Bot,
      badge: 'Contextual Chat',
      highlight: 'Interactive Copilot'
    }
  ];

  return (
    <section id="features" className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 relative z-10 scroll-mt-24 w-full max-w-full overflow-hidden">
      <div className="max-w-7xl mx-auto text-center space-y-3 sm:space-y-4 mb-10 sm:mb-16">
        {/* Section Pill */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 dark:bg-[#00D1FF]/10 border border-sky-500/20 dark:border-[#00D1FF]/20 text-sky-600 dark:text-[#00D1FF] text-xs font-mono font-medium">
          Comprehensive Capabilities
        </div>

        {/* Section Heading */}
        <h2 className="font-domine text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight break-words">
          Everything You Need to Understand Your PCB
        </h2>

        {/* Section Subtitle */}
        <p className="text-xs sm:text-sm md:text-base text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
          From component identification to AI-assisted fault analysis, CircuSense AI brings your PCB workflow into one intelligent workspace.
        </p>
      </div>

      {/* 6 Glassmorphic Feature Cards Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {features.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.id}
              className="group relative rounded-xl sm:rounded-2xl p-4 sm:p-6 bg-white/70 dark:bg-[#0C101C]/75 border border-slate-200/80 dark:border-white/[0.08] backdrop-blur-xl shadow-xs hover:shadow-xl transition-all duration-300 hover:-translate-y-1 hover:border-sky-400/40 dark:hover:border-cyan-400/40 text-left flex flex-col justify-between"
            >
              {/* Subtle top reflection specular */}
              <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-400/0 to-transparent group-hover:via-cyan-400/40 transition-all duration-500" />

              <div>
                {/* Header with Icon and Category Tag */}
                <div className="flex items-center justify-between mb-4 sm:mb-5">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-sky-500/10 dark:bg-[#00D1FF]/10 text-sky-600 dark:text-[#00D1FF] flex items-center justify-center border border-sky-500/20 dark:border-[#00D1FF]/20 group-hover:scale-110 transition-transform duration-300 shadow-xs">
                    <Icon size={18} />
                  </div>
                  <span className="text-[10px] font-mono uppercase tracking-wider px-2.5 py-1 rounded-full bg-slate-100 dark:bg-white/[0.06] text-slate-600 dark:text-slate-400 border border-slate-200/60 dark:border-white/[0.06]">
                    {item.badge}
                  </span>
                </div>

                {/* Card Title */}
                <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white group-hover:text-sky-600 dark:group-hover:text-[#00D1FF] transition-colors flex items-center justify-between">
                  <span>{item.title}</span>
                  <ArrowUpRight
                    size={15}
                    className="opacity-0 -translate-x-1 translate-y-1 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0 transition-all duration-200 text-sky-500 dark:text-cyan-400"
                  />
                </h3>

                {/* Card Description */}
                <p className="text-xs sm:text-[13px] text-slate-600 dark:text-slate-400 mt-1.5 sm:mt-2 leading-relaxed">
                  {item.description}
                </p>
              </div>

              {/* Card Footer Micro Highlight */}
              <div className="mt-5 sm:mt-6 pt-3 sm:pt-4 border-t border-slate-100 dark:border-white/[0.05] flex items-center justify-between text-[11px] font-mono text-slate-500 dark:text-slate-400">
                <span>Output Type</span>
                <span className="text-slate-800 dark:text-slate-200 font-semibold">{item.highlight}</span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
