import React from 'react';
import { X, ShieldCheck, AlertTriangle, Cpu, Activity, Layers, CheckCircle2 } from 'lucide-react';

interface AccuracyUXModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AccuracyUXModal: React.FC<AccuracyUXModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-[#12151A] border border-slate-800 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-[#0A0C0E]">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-[#00D1FF15] text-[#00D1FF] border border-[#00D1FF30]">
              <ShieldCheck size={20} />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-tight">
                CircuSense Accuracy UX Framework
              </h2>
              <p className="text-xs text-slate-400">
                Ethical AI in Hardware Diagnostics &amp; Physical Verification
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#1A1E25] transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs text-slate-300">
          <div className="p-4 rounded-xl bg-[#00D1FF10] border border-[#00D1FF30] space-y-2">
            <div className="font-semibold text-[#00D1FF] text-sm">
              The Fundamental Principle
            </div>
            <p className="text-slate-300 leading-relaxed font-sans text-xs">
              <strong className="text-white">“A PCB photograph alone cannot reliably prove an electrical component is defective.”</strong>
              <br /><br />
              Optical computer vision can easily detect geometric swelling, solder bridges, fractured packages, or burnt charring, but it cannot measure junction resistance, breakdown voltage, or dielectric leakage. To build trust with engineers, CircuSense enforces a clear 4-tier diagnostic hierarchy:
            </p>
          </div>

          {/* 4 Levels */}
          <div className="space-y-3">
            <div className="p-3.5 rounded-xl bg-[#0A0C0E] border border-slate-800 space-y-1">
              <div className="flex items-center justify-between font-mono text-xs font-bold text-slate-200">
                <span>Tier 1: Visual Optical Inspection</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-[#1A1E25] text-slate-400 border border-slate-700">Camera / Microscope</span>
              </div>
              <p className="text-xs text-slate-400">
                Identifies visible physical traits: solder balls, pad bridges, broken package plastic, discoloration, bulging aluminum vent caps.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-[#0A0C0E] border border-amber-500/30 space-y-1">
              <div className="flex items-center justify-between font-mono text-xs font-bold text-amber-300">
                <span>Tier 2: AI Anomaly Suspicion</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">Neural Classifier</span>
              </div>
              <p className="text-xs text-slate-400">
                Statistical confidence score. Formulated as a <em className="text-amber-200">recommendation for inspection</em>, never as a finalized verdict.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-[#0A0C0E] border border-[#00D1FF40] space-y-1">
              <div className="flex items-center justify-between font-mono text-xs font-bold text-[#00D1FF]">
                <span>Tier 3: Electrical Diagnosis</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-[#00D1FF20] text-[#00D1FF] border border-[#00D1FF30]">DMM / Oscilloscope / LCR</span>
              </div>
              <p className="text-xs text-slate-400">
                Direct physical measurements of voltage rails, ESR, junction drops, and resistance across test pads. Confirms or clears the AI suspicion.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-[#0A0C0E] border border-emerald-500/30 space-y-1">
              <div className="flex items-center justify-between font-mono text-xs font-bold text-emerald-300">
                <span>Tier 4: Advanced Multimodal Synthesis</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">Unified Architecture</span>
              </div>
              <p className="text-xs text-slate-400">
                Combines high-res imagery, measured benchtop numbers, schematic netlist logic, and manufacturer datasheet tolerances to output conclusive repair workflows.
              </p>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-[#0A0C0E] border border-slate-800 text-[11px] text-slate-400 space-y-1">
            <div className="font-semibold text-slate-300">Engineering UX Language Guardrails</div>
            <div>• Use <span className="text-[#00D1FF] font-mono">“Analyze PCB”</span> instead of “Run YOLO Object Detection”</div>
            <div>• Use <span className="text-[#00D1FF] font-mono">“Read Component Marking”</span> instead of “OCR Processing”</div>
            <div>• Use <span className="text-[#00D1FF] font-mono">“Ask about this PCB”</span> instead of “RAG Query”</div>
            <div>• Use <span className="text-[#00D1FF] font-mono">“Check for Possible Issues”</span> instead of “Anomaly Classification”</div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-[#0A0C0E] flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-[#00D1FF] hover:bg-[#00B8E0] text-[#0A0C0E] font-bold text-xs transition-all shadow-md shadow-[#00D1FF20] cursor-pointer"
          >
            Understood
          </button>
        </div>
      </div>
    </div>
  );
};
