import React from 'react';
import { ComponentFault, DiagnosisStage } from '../types';
import { ConfidenceBadge } from './ConfidenceBadge';
import { 
  AlertTriangle, 
  AlertOctagon, 
  Eye, 
  Stethoscope, 
  CheckCircle2, 
  Clock, 
  Sliders, 
  Cpu, 
  ArrowRight,
  ShieldAlert
} from 'lucide-react';

interface FaultAlertProps {
  fault: ComponentFault;
  onViewComponent: (componentId: string) => void;
  onOpenDiagnosticGuide: (fault: ComponentFault) => void;
  className?: string;
}

export const FaultAlert: React.FC<FaultAlertProps> = ({
  fault,
  onViewComponent,
  onOpenDiagnosticGuide,
  className = ''
}) => {
  const { componentRef, title, severity, confidence, indicators, recommendation, diagnosisStage, measurements } = fault;

  // Visual severity accent
  const isIssue = severity === 'issue';
  const borderClass = isIssue 
    ? 'border-rose-500/40 bg-[#12151A]' 
    : 'border-amber-500/40 bg-[#12151A]';

  const titleColor = isIssue ? 'text-rose-300' : 'text-amber-300';
  const IconComponent = isIssue ? AlertOctagon : AlertTriangle;

  // Diagnosis stage label and badge
  const stageLabels: Record<DiagnosisStage, { label: string; color: string; desc: string }> = {
    visual_inspection: {
      label: 'Stage 1: Visual Inspection',
      color: 'text-slate-300 bg-[#1A1E25] border-slate-700',
      desc: 'Optical contour analysis only'
    },
    ai_suspicion: {
      label: 'Stage 2: AI Anomaly Suspicion',
      color: 'text-amber-300 bg-amber-950/70 border-amber-500/40',
      desc: 'Confidence model flag — pending physical measurement'
    },
    electrical_diagnosis: {
      label: 'Stage 3: Measurement Verified',
      color: 'text-[#00D1FF] bg-[#00D1FF15] border-[#00D1FF40]',
      desc: 'DMM / Scope test readings integrated'
    },
    advanced_multimodal: {
      label: 'Stage 4: Advanced Multimodal Diagnosis',
      color: 'text-emerald-300 bg-emerald-950/70 border-emerald-500/40',
      desc: 'Image + Netlist + DMM + Datasheet verified'
    }
  };

  const currentStage = stageLabels[diagnosisStage] || stageLabels.ai_suspicion;

  return (
    <div className={`border rounded-xl p-5 flex flex-col gap-4 shadow-xl transition-all hover:shadow-2xl ${borderClass} ${className}`}>
      {/* Header with Title and Confidence */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 border-b border-slate-800 pb-3">
        <div className="flex items-start gap-3">
          <div className={`p-2 rounded-lg shrink-0 ${isIssue ? 'bg-rose-500/20 text-rose-400' : 'bg-amber-500/20 text-amber-400'}`}>
            <IconComponent size={20} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs px-2 py-0.5 rounded bg-[#1A1E25] border border-slate-700 text-[#00D1FF] font-bold">
                {componentRef}
              </span>
              <h3 className={`font-semibold text-base tracking-tight ${titleColor}`}>
                {title}
              </h3>
            </div>

            {/* AI-Assisted Recommendation Disclaimer Label */}
            <div className="flex items-center gap-2 mt-1">
              <span className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-400/90 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                <ShieldAlert size={11} />
                AI-Assisted Finding — Verification Required
              </span>
              <span className={`text-[11px] px-2 py-0.5 rounded border font-mono ${currentStage.color}`}>
                {currentStage.label}
              </span>
            </div>
          </div>
        </div>

        <div className="flex sm:flex-col items-center sm:items-end justify-between gap-1">
          <ConfidenceBadge confidence={confidence} status={severity} size="md" />
          <span className="text-[10px] text-slate-400 font-mono">
            {currentStage.desc}
          </span>
        </div>
      </div>

      {/* Possible Indicators */}
      <div className="space-y-1.5">
        <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
          <span>Possible Indicators:</span>
        </h4>
        <ul className="space-y-1">
          {indicators.map((indicator, index) => (
            <li key={index} className="text-xs text-slate-300 flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
              <span>{indicator}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Recommendation Block */}
      <div className="p-3 rounded-lg bg-[#0A0C0E] border border-slate-800 space-y-1">
        <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
          Engineering Recommendation:
        </div>
        <p className="text-xs text-slate-200 leading-relaxed font-sans">
          "{recommendation}"
        </p>
      </div>

      {/* Measurement Verification Preview */}
      {measurements && measurements.length > 0 && (
        <div className="space-y-1.5 pt-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-semibold uppercase tracking-wider text-[11px]">DMM / Scope Test Points</span>
            <span className="text-[10px] font-mono">
              {measurements.filter(m => m.verified).length}/{measurements.length} Tested
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {measurements.map(m => (
              <div 
                key={m.id} 
                className="p-2 rounded-lg bg-[#0A0C0E] border border-slate-800 flex items-center justify-between text-xs font-mono"
              >
                <div>
                  <span className="text-slate-400 block text-[10px]">{m.testPoint}</span>
                  <span className={m.status === 'failed' ? 'text-rose-400 font-bold' : m.status === 'marginal' ? 'text-amber-300' : 'text-slate-200'}>
                    {m.measured}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-500 block">Exp: {m.expected}</span>
                  <span className={`text-[10px] uppercase font-bold ${
                    m.status === 'failed' ? 'text-rose-400' : m.status === 'marginal' ? 'text-amber-400' : 'text-emerald-400'
                  }`}>
                    {m.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Buttons: View Component | Diagnostic Guide as required by prompt */}
      <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-800">
        <button
          onClick={() => onViewComponent(componentRef)}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#1A1E25] hover:bg-slate-800 text-slate-200 text-xs font-medium border border-slate-700 transition-colors shadow-xs cursor-pointer"
        >
          <Eye size={14} className="text-[#00D1FF]" />
          <span>View Component</span>
        </button>

        <button
          onClick={() => onOpenDiagnosticGuide(fault)}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold border transition-all shadow-md cursor-pointer ${
            isIssue
              ? 'bg-rose-600/30 hover:bg-rose-600/40 text-rose-200 border-rose-500/50'
              : 'bg-amber-600/30 hover:bg-amber-600/40 text-amber-200 border-amber-500/50'
          }`}
        >
          <Stethoscope size={14} className="text-amber-300" />
          <span>Diagnostic Guide</span>
          <ArrowRight size={13} className="ml-0.5" />
        </button>
      </div>
    </div>
  );
};
