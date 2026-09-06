import React, { useState } from 'react';
import { Bot, User, Send, Sparkles, HelpCircle, FileText, RefreshCw, Cpu } from 'lucide-react';

interface ChatSnippet {
  userQuestion: string;
  aiAnswer: string;
  meta: string;
}

export const AIAssistantSection: React.FC = () => {
  const [activeSnippetIndex, setActiveSnippetIndex] = useState(0);

  const snippets: ChatSnippet[] = [
    {
      userQuestion: 'What does U1 do?',
      aiAnswer:
        'U1 is an LM7805 positive voltage regulator in a TO-220 package. It converts an unregulated input voltage (7V–25V DC) down to a clean, stable +5V DC output with up to 1.5A current capability for the downstream microcontroller circuitry.',
      meta: 'Datasheet Pin 1: Input | Pin 2: Ground | Pin 3: Output (+5V)'
    },
    {
      userQuestion: 'Explain this circuit',
      aiAnswer:
        'This circuit serves as a dual-stage linear power regulation block. AC/DC power enters through diode D1 for reverse-polarity protection, feeds capacitor C1 for ripple smoothing, enters linear regulator U1, and is decoupled at the output by C14 and resistor R1.',
      meta: 'Topology: Linear Regulated DC Power Supply'
    },
    {
      userQuestion: 'What could be wrong with C14?',
      aiAnswer:
        'Visual analysis flagged C14 due to slight surface discoloration and solder fillet degradation around its positive terminal. While the circuit may still function, this often indicates elevated operating temperatures or prolonged ripple current stress.',
      meta: 'Recommendation: Check for DC bias voltage and test ESR with LCR meter'
    },
    {
      userQuestion: 'Show U1 datasheet specs',
      aiAnswer:
        'LM7805 Electrical Ratings: Input Voltage max: 35V DC; Output Voltage: 4.8V to 5.2V; Dropout Voltage: 2.0V @ 1A; Operating Junction Temp: 0°C to 125°C; Thermal Shutdown & Internal Current Limiting included.',
      meta: 'Standard Manufacturer: Texas Instruments / STMicroelectronics'
    },
    {
      userQuestion: 'Find replacement for U1',
      aiAnswer:
        'Drop-in pin-compatible replacements include ST L7805CV, ON Semi MC7805, or high-efficiency drop-in switching modules like the Murata OKI-78SR-5/1.5-W36-C (pin-compatible 3-pin SIP, runs cold without heatsink).',
      meta: 'Compatible Footprint: TO-220, 3-pin SIP, Pitch: 2.54mm'
    }
  ];

  const current = snippets[activeSnippetIndex];

  return (
    <section id="ai-assistant" className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 relative z-10 scroll-mt-24 w-full max-w-full overflow-hidden">
      <div className="max-w-7xl mx-auto text-center space-y-3 sm:space-y-4 mb-10 sm:mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 dark:bg-[#00D1FF]/10 border border-sky-500/20 dark:border-[#00D1FF]/20 text-sky-600 dark:text-[#00D1FF] text-xs font-mono font-medium">
          Contextual Copilot
        </div>
        <h2 className="font-domine text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight break-words">
          Ask Your PCB Anything
        </h2>
        <p className="text-xs sm:text-sm md:text-base text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Get contextual explanations about components, circuits and possible issues with an AI trained on electrical schematics and manufacturer datasheets.
        </p>
      </div>

      {/* Large Glass AI Chat Interface Container */}
      <div className="max-w-4xl mx-auto rounded-2xl sm:rounded-3xl bg-white/75 dark:bg-[#0A0D18]/80 border border-slate-200/80 dark:border-white/[0.09] backdrop-blur-2xl p-4 sm:p-8 shadow-2xl overflow-hidden relative">
        {/* Specular hairline */}
        <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent" />

        {/* Chat Header */}
        <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-200/70 dark:border-white/[0.07]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-sky-500/10 dark:bg-[#00D1FF]/10 text-sky-600 dark:text-[#00D1FF] flex items-center justify-center border border-sky-500/20 shadow-xs">
              <Bot size={18} />
            </div>
            <div className="text-left">
              <div className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <span>CircuSense Diagnostic Assistant</span>
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
              </div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                Context: Power_Reg_V2.brd • 42 Components Indexed
              </div>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-[11px] font-mono text-slate-400">
            <Sparkles size={12} className="text-cyan-400" />
            <span>Interactive Demo</span>
          </div>
        </div>

        {/* Quick Action Glass Buttons */}
        <div className="flex flex-wrap items-center gap-2 mb-6">
          <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400 mr-1">
            Prompt Suggestions:
          </span>
          {[
            { label: 'What does U1 do?', index: 0, icon: Cpu },
            { label: 'Explain this circuit', index: 1, icon: HelpCircle },
            { label: 'What could be wrong?', index: 2, icon: HelpCircle },
            { label: 'Show U1 datasheet', index: 3, icon: FileText },
            { label: 'Find replacement', index: 4, icon: RefreshCw }
          ].map((btn) => {
            const BtnIcon = btn.icon;
            const isCurrent = activeSnippetIndex === btn.index;
            return (
              <button
                key={btn.label}
                onClick={() => setActiveSnippetIndex(btn.index)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                  isCurrent
                    ? 'bg-sky-500 dark:bg-[#00D1FF] text-white dark:text-[#060911] shadow-xs font-semibold'
                    : 'bg-slate-100/80 dark:bg-white/[0.05] text-slate-700 dark:text-slate-300 hover:bg-slate-200/70 dark:hover:bg-white/[0.09] border border-slate-200/60 dark:border-white/[0.07]'
                }`}
              >
                <BtnIcon size={12} className={isCurrent ? 'text-white dark:text-black' : 'text-sky-600 dark:text-[#00D1FF]'} />
                <span>{btn.label}</span>
              </button>
            );
          })}
        </div>

        {/* Conversation Display */}
        <div className="space-y-4 mb-6">
          {/* User Message */}
          <div className="flex items-start justify-end gap-3">
            <div className="max-w-md rounded-2xl rounded-tr-xs p-3.5 bg-gradient-to-r from-sky-600 to-sky-500 dark:from-sky-600 dark:to-cyan-600 text-white text-xs sm:text-sm font-medium shadow-xs text-left">
              {current.userQuestion}
            </div>
            <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-white/[0.1] flex items-center justify-center text-slate-700 dark:text-slate-300 shrink-0">
              <User size={14} />
            </div>
          </div>

          {/* AI Response Message */}
          <div className="flex items-start justify-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-sky-500/10 dark:bg-[#00D1FF]/10 text-sky-600 dark:text-[#00D1FF] flex items-center justify-center border border-sky-500/20 shrink-0 mt-0.5">
              <Bot size={15} />
            </div>
            <div className="max-w-xl rounded-2xl rounded-tl-xs p-4 bg-slate-100/90 dark:bg-[#111728] border border-slate-200/70 dark:border-white/[0.08] text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed text-left space-y-2 shadow-xs">
              <p>{current.aiAnswer}</p>
              <div className="pt-2 border-t border-slate-200/60 dark:border-white/[0.06] text-[10px] font-mono text-sky-600 dark:text-[#00D1FF]">
                {current.meta}
              </div>
            </div>
          </div>
        </div>

        {/* Mock Chat Input Footer */}
        <div className="relative flex items-center">
          <input
            type="text"
            readOnly
            value="Ask about component pinouts, thermal issues, or reverse engineering..."
            className="w-full py-3 pl-4 pr-12 rounded-xl bg-slate-100/80 dark:bg-white/[0.04] border border-slate-200/80 dark:border-white/[0.08] text-xs text-slate-400 dark:text-slate-500 font-sans cursor-default focus:outline-none"
          />
          <div className="absolute right-2 w-8 h-8 rounded-lg bg-sky-500 dark:bg-[#00D1FF] text-white dark:text-black flex items-center justify-center">
            <Send size={13} />
          </div>
        </div>
      </div>
    </section>
  );
};
