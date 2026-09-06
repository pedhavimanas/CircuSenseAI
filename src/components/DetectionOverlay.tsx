import React from 'react';
import { PCBComponent } from '../types';
import { AlertCircle, AlertTriangle, CheckCircle2 } from 'lucide-react';

interface DetectionOverlayProps {
  component: PCBComponent;
  isSelected: boolean;
  onSelect: (component: PCBComponent) => void;
  showLabels?: boolean;
}

export const DetectionOverlay: React.FC<DetectionOverlayProps> = ({
  component,
  isSelected,
  onSelect,
  showLabels = true
}) => {
  const { bbox, status, id, name, confidence } = component;

  // Status-dependent styling
  let borderClass = 'border-emerald-500/70 hover:border-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20';
  let badgeBg = 'bg-emerald-950/90 text-emerald-300 border-emerald-500/50';
  let StatusIcon = CheckCircle2;

  if (status === 'issue') {
    borderClass = 'border-rose-500 hover:border-rose-400 bg-rose-500/20 hover:bg-rose-500/30 animate-pulse-subtle';
    badgeBg = 'bg-rose-950/90 text-rose-300 border-rose-500/60';
    StatusIcon = AlertCircle;
  } else if (status === 'inspection') {
    borderClass = 'border-amber-500/80 hover:border-amber-400 bg-amber-500/15 hover:bg-amber-500/25';
    badgeBg = 'bg-amber-950/90 text-amber-300 border-amber-500/50';
    StatusIcon = AlertTriangle;
  }

  const selectedRing = isSelected ? 'ring-2 ring-[#00D1FF] ring-offset-2 ring-offset-[#0A0C0E] shadow-lg shadow-[#00D1FF30] z-30' : 'z-10 hover:z-20';

  return (
    <div
      id={`overlay-${id}`}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(component);
      }}
      className={`absolute cursor-pointer rounded-xs border transition-all duration-150 group ${borderClass} ${selectedRing}`}
      style={{
        left: `${bbox.x}%`,
        top: `${bbox.y}%`,
        width: `${bbox.width}%`,
        height: `${bbox.height}%`,
      }}
      role="button"
      tabIndex={0}
      aria-label={`Component ${id}: ${name} (${status}, ${confidence}% confidence)`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          onSelect(component);
        }
      }}
    >
      {/* Corner crosshairs for engineering precision aesthetic */}
      <span className="absolute -top-1 -left-1 w-2 h-2 border-t border-l border-current opacity-70" />
      <span className="absolute -top-1 -right-1 w-2 h-2 border-t border-r border-current opacity-70" />
      <span className="absolute -bottom-1 -left-1 w-2 h-2 border-b border-l border-current opacity-70" />
      <span className="absolute -bottom-1 -right-1 w-2 h-2 border-b border-r border-current opacity-70" />

      {/* Floating Ref Tag */}
      {showLabels && (
        <div
          className={`absolute -top-6 left-0 flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-mono font-semibold tracking-wider uppercase border shadow-md whitespace-nowrap transition-transform duration-150 ${badgeBg} ${
            isSelected ? 'scale-105 border-cyan-400 text-cyan-200' : ''
          }`}
        >
          <StatusIcon size={10} className="shrink-0" />
          <span>{id}</span>
          <span className="text-[9px] opacity-75 font-sans font-normal">({confidence}%)</span>
        </div>
      )}

      {/* Hover tooltip for quick preview */}
      <div className="opacity-0 group-hover:opacity-100 pointer-events-none absolute bottom-full mb-2 left-1/2 -translate-x-1/2 px-2.5 py-1.5 rounded bg-slate-900/95 border border-slate-700 text-slate-200 text-xs shadow-xl backdrop-blur-sm whitespace-nowrap z-50 transition-opacity">
        <div className="font-semibold text-white flex items-center gap-1.5">
          <span>{id}: {name}</span>
          <span className={`w-1.5 h-1.5 rounded-full ${status === 'issue' ? 'bg-rose-500' : status === 'inspection' ? 'bg-amber-400' : 'bg-emerald-400'}`} />
        </div>
        <div className="text-[10px] text-slate-400 font-mono mt-0.5">
          Pkg: {component.package} • Conf: {confidence}%
        </div>
      </div>
    </div>
  );
};
