import React from 'react';
import { PCBComponent } from '../types';
import { ConfidenceBadge } from './ConfidenceBadge';
import { 
  FileText, 
  Sparkles, 
  AlertTriangle, 
  Cpu, 
  Package, 
  Zap, 
  Thermometer, 
  CheckCircle2, 
  HelpCircle,
  ExternalLink
} from 'lucide-react';

interface ComponentCardProps {
  component: PCBComponent;
  onOpenDatasheet: (datasheetId?: string, partName?: string) => void;
  onAskAI: (component: PCBComponent, prompt?: string) => void;
  onCheckIssues: (component: PCBComponent) => void;
  className?: string;
}

export const ComponentCard: React.FC<ComponentCardProps> = ({
  component,
  onOpenDatasheet,
  onAskAI,
  onCheckIssues,
  className = ''
}) => {
  const { id, name, type, package: pkg, confidence, status, ocrMarking, description, specs, pins, fault } = component;

  // Status visual accent
  const statusConfig = {
    normal: {
      color: 'text-emerald-400',
      badge: 'Normal State',
      border: 'border-slate-800'
    },
    inspection: {
      color: 'text-amber-400',
      badge: 'Needs Inspection',
      border: 'border-amber-500/30 bg-amber-950/10'
    },
    issue: {
      color: 'text-rose-400',
      badge: 'Possible Issue Flagged',
      border: 'border-rose-500/40 bg-rose-950/10'
    }
  };

  const currentStatus = statusConfig[status];

  return (
    <div className={`bg-[#12151A] border rounded-xl p-5 flex flex-col gap-4 shadow-xl ${currentStatus.border} ${className}`}>
      {/* Header: Designator, Part Name, Category & Confidence */}
      <div className="flex items-start justify-between gap-3 border-b border-slate-800 pb-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-[#1A1E25] border border-slate-700 font-mono text-sm font-bold text-[#00D1FF]">
              {id}
            </span>
            <h3 className="font-semibold text-lg text-white tracking-tight">
              {name}
            </h3>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span className="flex items-center gap-1 font-medium text-slate-300">
              <Cpu size={13} className="text-[#00D1FF]" />
              {type}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Package size={13} />
              {pkg}
            </span>
          </div>
        </div>

        <div className="flex flex-col items-end gap-1">
          <ConfidenceBadge confidence={confidence} status={status} size="md" />
          <span className={`text-[11px] font-medium ${currentStatus.color}`}>
            {currentStatus.badge}
          </span>
        </div>
      </div>

      {/* Optical OCR Readout */}
      {ocrMarking && (
        <div className="flex items-center justify-between px-3 py-1.5 rounded-lg bg-[#0A0C0E] border border-slate-800/80 text-xs">
          <span className="text-slate-400">Read Component Marking:</span>
          <span className="font-mono text-[#00D1FF] font-semibold tracking-wide">
            "{ocrMarking}"
          </span>
        </div>
      )}

      {/* Description */}
      <p className="text-xs text-slate-300 leading-relaxed">
        {description}
      </p>

      {/* Key Specifications Grid */}
      <div className="space-y-2">
        <h4 className="text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
          Key Specifications
        </h4>
        <div className="grid grid-cols-2 gap-2 text-xs">
          {specs.inputVoltage && (
            <div className="bg-[#0A0C0E] p-2 rounded-lg border border-slate-800">
              <span className="text-slate-400 block text-[10px]">Input Voltage</span>
              <span className="font-mono text-slate-200 font-medium">{specs.inputVoltage}</span>
            </div>
          )}
          {specs.outputVoltage && (
            <div className="bg-[#0A0C0E] p-2 rounded-lg border border-slate-800">
              <span className="text-slate-400 block text-[10px]">Output Voltage</span>
              <span className="font-mono text-[#00D1FF] font-medium">{specs.outputVoltage}</span>
            </div>
          )}
          {specs.ratedCurrent && (
            <div className="bg-[#0A0C0E] p-2 rounded-lg border border-slate-800">
              <span className="text-slate-400 block text-[10px]">Rated Current</span>
              <span className="font-mono text-slate-200 font-medium">{specs.ratedCurrent}</span>
            </div>
          )}
          {specs.capacitance && (
            <div className="bg-[#0A0C0E] p-2 rounded-lg border border-slate-800">
              <span className="text-slate-400 block text-[10px]">Capacitance</span>
              <span className="font-mono text-slate-200 font-medium">{specs.capacitance}</span>
            </div>
          )}
          {specs.resistance && (
            <div className="bg-[#0A0C0E] p-2 rounded-lg border border-slate-800">
              <span className="text-slate-400 block text-[10px]">Resistance</span>
              <span className="font-mono text-slate-200 font-medium">{specs.resistance}</span>
            </div>
          )}
          {specs.operatingTemp && (
            <div className="bg-[#0A0C0E] p-2 rounded-lg border border-slate-800">
              <span className="text-slate-400 block text-[10px]">Operating Temp</span>
              <span className="font-mono text-slate-200 font-medium">{specs.operatingTemp}</span>
            </div>
          )}
          {specs.mounting && (
            <div className="bg-[#0A0C0E] p-2 rounded-lg border border-slate-800">
              <span className="text-slate-400 block text-[10px]">Mounting Type</span>
              <span className="font-mono text-slate-200 font-medium">{specs.mounting}</span>
            </div>
          )}
        </div>
      </div>

      {/* Pinout Preview if available */}
      {pins && pins.length > 0 && (
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span className="font-semibold uppercase tracking-wider">Pin Configuration</span>
            <span className="font-mono text-[10px] text-slate-500">{pins.length} Pins Defined</span>
          </div>
          <div className="space-y-1 bg-[#0A0C0E] p-2 rounded-lg border border-slate-800 max-h-36 overflow-y-auto">
            {pins.map(pin => (
              <div key={pin.pin} className="flex items-center justify-between text-xs font-mono py-0.5 border-b border-slate-900 last:border-0">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded bg-[#1A1E25] text-slate-300 flex items-center justify-center text-[10px]">
                    {pin.pin}
                  </span>
                  <span className="text-slate-200 font-medium">{pin.label}</span>
                </div>
                <div className="flex items-center gap-2 text-[11px]">
                  {pin.expectedVoltage && (
                    <span className="text-slate-400">Exp: {pin.expectedVoltage}</span>
                  )}
                  {pin.measuredVoltage && (
                    <span className="text-[#00D1FF]">Act: {pin.measuredVoltage}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Fault Warning Banner if applicable */}
      {fault && (
        <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 space-y-1.5">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-300">
            <AlertTriangle size={14} />
            <span>{fault.title}</span>
          </div>
          <p className="text-xs text-amber-200/80 line-clamp-2">
            {fault.recommendation}
          </p>
        </div>
      )}

      {/* Action Buttons as specified in prompt: Datasheet | Explain with AI | Check for Issues */}
      <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800">
        <button
          onClick={() => onOpenDatasheet(component.datasheetId, component.name)}
          className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-[#1A1E25] hover:bg-slate-800 text-slate-200 text-xs font-medium border border-slate-700 transition-colors shadow-xs"
          title="Open technical datasheet"
        >
          <FileText size={14} className="text-[#00D1FF] shrink-0" />
          <span className="truncate">Datasheet</span>
        </button>

        <button
          onClick={() => onAskAI(component, `Explain ${component.id} (${component.name}) in this circuit`)}
          className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-[#00D1FF15] hover:bg-[#00D1FF25] text-[#00D1FF] text-xs font-medium border border-[#00D1FF30] transition-colors shadow-xs"
          title="Explain this component using circuit AI"
        >
          <Sparkles size={14} className="text-[#00D1FF] shrink-0" />
          <span className="truncate">Explain with AI</span>
        </button>

        <button
          onClick={() => onCheckIssues(component)}
          className={`flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium border transition-colors shadow-xs ${
            status !== 'normal'
              ? 'bg-amber-600/20 hover:bg-amber-600/30 text-amber-300 border-amber-500/40'
              : 'bg-[#1A1E25] hover:bg-slate-800 text-slate-300 border-slate-700'
          }`}
          title="Check for possible visual or electrical issues"
        >
          <AlertTriangle size={14} className={status !== 'normal' ? 'text-amber-400 shrink-0' : 'text-slate-400 shrink-0'} />
          <span className="truncate">Check Issues</span>
        </button>
      </div>
    </div>
  );
};
