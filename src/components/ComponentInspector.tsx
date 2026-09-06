import React, { useState } from 'react';
import { PCBDetection } from '../types';
import { 
  Cpu, 
  Sparkles, 
  ShieldAlert, 
  Terminal, 
  ExternalLink, 
  Copy, 
  Check, 
  Eye, 
  AlertCircle,
  HelpCircle
} from 'lucide-react';

interface ComponentInspectorProps {
  detection: PCBDetection | null;
  onAskAI?: (detection: PCBDetection) => void;
  onFlagIssue?: (detection: PCBDetection) => void;
  className?: string;
}

export const ComponentInspector: React.FC<ComponentInspectorProps> = ({
  detection,
  onAskAI,
  onFlagIssue,
  className = ''
}) => {
  const [showDebug, setShowDebug] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  if (!detection) {
    return (
      <div className={`flex flex-col items-center justify-center p-8 bg-[#12151A] border border-slate-800 rounded-xl text-center text-slate-500 space-y-3 ${className}`}>
        <div className="w-12 h-12 rounded-xl bg-slate-800/60 border border-slate-700 flex items-center justify-center text-slate-400">
          <Eye size={22} />
        </div>
        <div className="space-y-1">
          <p className="text-xs font-semibold text-slate-300">No Component Selected</p>
          <p className="text-[11px] text-slate-500 max-w-[220px]">
            Click any bounding box on the PCB canvas or row in the detection table to inspect its physical parameters.
          </p>
        </div>
      </div>
    );
  }

  const confPercent = (detection.confidence * 100).toFixed(1);
  const isLowConf = detection.confidence < 0.5;

  const handleCopyId = () => {
    navigator.clipboard.writeText(detection.id);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className={`flex flex-col bg-[#12151A] border border-slate-800 rounded-xl overflow-hidden shadow-xl ${className}`}>
      {/* Header */}
      <div className="px-5 py-3.5 bg-[#0B0E13] border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-[#00D1FF]/10 text-[#00D1FF] border border-[#00D1FF]/20">
            <Cpu size={16} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-white capitalize">
                {detection.className}
              </h2>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                {detection.categoryGroup}
              </span>
            </div>
            <p className="text-[11px] font-mono text-slate-400 flex items-center gap-1.5">
              <span>ID: {detection.id}</span>
              <button 
                onClick={handleCopyId}
                className="hover:text-white transition-colors"
                title="Copy Detection ID"
              >
                {copied ? <Check size={11} className="text-emerald-400" /> : <Copy size={11} />}
              </button>
            </p>
          </div>
        </div>

        {/* Confidence Indicator */}
        <div className="text-right">
          <span className="text-[10px] uppercase font-mono text-slate-400 block">Model Confidence</span>
          <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded border inline-block mt-0.5 ${
            isLowConf
              ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
              : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
          }`}>
            {confPercent}%
          </span>
        </div>
      </div>

      {/* Main Parameters Body */}
      <div className="p-5 space-y-4 text-xs">
        {/* Core Detection Facts */}
        <div className="grid grid-cols-2 gap-2.5 font-mono">
          <div className="p-2.5 rounded-lg bg-[#0A0C0E] border border-slate-800">
            <span className="text-[10px] text-slate-500 block uppercase">Authoritative Class</span>
            <span className="text-slate-200 font-semibold capitalize">{detection.className}</span>
          </div>

          <div className="p-2.5 rounded-lg bg-[#0A0C0E] border border-slate-800">
            <span className="text-[10px] text-slate-500 block uppercase">Taxonomy Class ID</span>
            <span className="text-[#00D1FF] font-semibold">#{detection.classId}</span>
          </div>

          <div className="p-2.5 rounded-lg bg-[#0A0C0E] border border-slate-800">
            <span className="text-[10px] text-slate-500 block uppercase">OCR Marking Status</span>
            <span className={`font-semibold ${detection.ocr?.status === 'detected' ? 'text-emerald-400' : 'text-slate-400'}`}>
              {detection.ocr?.status === 'detected' ? detection.ocr.text : 'Not detected on body'}
            </span>
          </div>

          <div className="p-2.5 rounded-lg bg-[#0A0C0E] border border-slate-800">
            <span className="text-[10px] text-slate-500 block uppercase">Detection Source</span>
            <span className="text-slate-200 font-semibold">CircuSense YOLO</span>
          </div>
        </div>

        {/* Bounding Box Coordinates (Normalized & Pixel) */}
        <div className="p-3 rounded-lg bg-[#0A0C0E] border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-[11px] font-mono">
            <span className="text-slate-400">Normalized Bounding Box (%):</span>
            <span className="text-slate-200">
              X:{detection.bboxNormalized.x}%, Y:{detection.bboxNormalized.y}%, W:{detection.bboxNormalized.width}%, H:{detection.bboxNormalized.height}%
            </span>
          </div>

          <div className="flex items-center justify-between text-[11px] font-mono pt-1 border-t border-slate-800/80">
            <span className="text-slate-500">Image Pixel Coordinates:</span>
            <span className="text-slate-400">
              [{detection.bbox.x1}, {detection.bbox.y1}] → [{detection.bbox.x2}, {detection.bbox.y2}]
            </span>
          </div>
        </div>

        {/* Technical Health Assessment Status */}
        <div className="p-3 rounded-lg bg-[#0A0C0E] border border-slate-800 flex items-start gap-2.5">
          <AlertCircle size={15} className="text-slate-400 mt-0.5 shrink-0" />
          <div className="space-y-0.5">
            <span className="text-[10px] uppercase font-mono text-slate-400 block font-semibold">
              Electrical Health Status
            </span>
            <p className="text-[11px] text-slate-400 leading-snug">
              Not assessed from detection. YOLO bounding boxes identify physical presence; verify electrical specs with benchtop instruments.
            </p>
          </div>
        </div>

        {/* Primary Actions: Ask AI / Inspect */}
        <div className="flex items-center gap-2 pt-2 border-t border-slate-800">
          {onAskAI && (
            <button
              onClick={() => onAskAI(detection)}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-[#00D1FF]/15 hover:bg-[#00D1FF]/25 text-[#00D1FF] font-medium border border-[#00D1FF]/30 transition-colors cursor-pointer"
            >
              <Sparkles size={14} />
              <span>Ask AI About Component</span>
            </button>
          )}

          {onFlagIssue && (
            <button
              onClick={() => onFlagIssue(detection)}
              className="py-2 px-3 rounded-lg bg-[#181D24] hover:bg-slate-800 text-slate-300 border border-slate-700 transition-colors cursor-pointer"
              title="Flag for physical inspection"
            >
              <ShieldAlert size={14} className="text-amber-400" />
            </button>
          )}
        </div>

        {/* Raw Engineering Debug Drawer Toggle */}
        <div className="pt-2">
          <button
            onClick={() => setShowDebug(!showDebug)}
            className="text-[11px] font-mono text-slate-500 hover:text-slate-300 flex items-center gap-1 transition-colors"
          >
            <Terminal size={12} />
            <span>{showDebug ? 'Hide Raw Debug Data' : 'View Raw Model Tensor Data'}</span>
          </button>

          {showDebug && (
            <div className="mt-2 p-3 rounded-lg bg-[#06080B] border border-slate-800 text-[10px] font-mono text-slate-400 space-y-1 overflow-x-auto">
              <div>classId: {detection.classId}</div>
              <div>className: "{detection.className}"</div>
              <div>rawConfidence: {detection.confidence}</div>
              <div>rawBbox: {JSON.stringify(detection.bbox)}</div>
              <div>normalizedBbox: {JSON.stringify(detection.bboxNormalized)}</div>
              <div>modelSource: "best.pt"</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
