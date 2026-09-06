import React, { useState } from 'react';
import { PCBBoard, PCBComponent, ComponentFault } from '../types';
import { FaultAlert } from '../components/FaultAlert';
import { DiagnosticGuideModal } from '../components/DiagnosticGuideModal';
import { 
  AlertTriangle, 
  ShieldAlert, 
  ShieldCheck, 
  Info, 
  CheckCircle2, 
  Cpu, 
  Activity, 
  Filter,
  ArrowRight
} from 'lucide-react';

interface FaultAnalysisPageProps {
  board: PCBBoard;
  onViewComponent: (componentRef: string) => void;
  onSaveMeasurement: (
    componentId: string,
    measurementId: string,
    measuredValue: string,
    status: 'passed' | 'marginal' | 'failed'
  ) => void;
}

export const FaultAnalysisPage: React.FC<FaultAnalysisPageProps> = ({
  board,
  onViewComponent,
  onSaveMeasurement
}) => {
  const [selectedFaultForGuide, setSelectedFaultForGuide] = useState<ComponentFault | null>(null);
  const [activeSeverityFilter, setActiveSeverityFilter] = useState<'all' | 'issue' | 'inspection'>('all');

  // Extract all faults from the components on the board
  const componentsWithFaults = board.components.filter(c => c.fault !== undefined);
  const allFaults = componentsWithFaults
    .map(c => c.fault!)
    .filter(f => activeSeverityFilter === 'all' || f.severity === activeSeverityFilter);

  const issueCount = board.components.filter(c => c.status === 'issue').length;
  const inspectionCount = board.components.filter(c => c.status === 'inspection').length;

  return (
    <div className="space-y-6 pb-12">
      {/* Accuracy UX Mandatory Legal & Engineering Disclaimer Banner as instructed */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-950/40 via-[#12151A] to-[#00D1FF08] border border-amber-500/40 shadow-xl space-y-3">
        <div className="flex items-start gap-3.5">
          <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30 shrink-0 mt-0.5">
            <ShieldAlert size={24} />
          </div>
          <div className="space-y-1.5 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-base font-bold text-white tracking-tight">
                AI-Assisted Hardware Findings Notice
              </h2>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 font-semibold">
                RECOMMENDATION ONLY
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed font-sans">
              <strong className="text-amber-200">Engineering Protocol:</strong> A PCB photograph alone cannot reliably prove an electrical component is defective. 
              Findings listed below are AI-assisted optical recommendations generated from surface contour modeling and thermal patina detection. 
              Prior to component de-soldering or board disposal, always verify using benchtop digital multimeters (DMM), ESR meters, or oscilloscope probes.
            </p>
          </div>
        </div>

        {/* 4-Tier Accuracy UX Visual Progression Pipeline */}
        <div className="pt-3 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 text-xs">
          <div className="p-2.5 rounded-lg bg-[#0A0C0E] border border-slate-800">
            <span className="text-[10px] text-slate-400 font-mono block">STAGE 1</span>
            <span className="font-semibold text-slate-200">Visual Inspection</span>
            <p className="text-[11px] text-slate-400 mt-0.5">Surface contour &amp; package anomaly scan</p>
          </div>
          <div className="p-2.5 rounded-lg bg-[#0A0C0E] border border-amber-500/30">
            <span className="text-[10px] text-amber-400 font-mono block">STAGE 2</span>
            <span className="font-semibold text-amber-300">AI Suspicion</span>
            <p className="text-[11px] text-slate-400 mt-0.5">Neural probability score calculation</p>
          </div>
          <div className="p-2.5 rounded-lg bg-[#0A0C0E] border border-[#00D1FF40]">
            <span className="text-[10px] text-[#00D1FF] font-mono block">STAGE 3</span>
            <span className="font-semibold text-[#00D1FF]">Electrical Diagnosis</span>
            <p className="text-[11px] text-slate-400 mt-0.5">DMM voltage &amp; ESR measurement verification</p>
          </div>
          <div className="p-2.5 rounded-lg bg-[#0A0C0E] border border-emerald-500/30">
            <span className="text-[10px] text-emerald-400 font-mono block">STAGE 4</span>
            <span className="font-semibold text-emerald-300">Advanced Multimodal</span>
            <p className="text-[11px] text-slate-400 mt-0.5">Image + Probe + Datasheet verdict</p>
          </div>
        </div>
      </div>

      {/* Filter and Overview Counts */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#12151A] border border-slate-800 rounded-xl px-5 py-3.5 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <AlertTriangle size={18} />
          </div>
          <div>
            <h1 className="text-base font-bold text-white tracking-tight">
              Flagged Anomalies for {board.name}
            </h1>
            <p className="text-xs text-slate-400">
              {allFaults.length} total potential issues flagged across {board.components.length} components
            </p>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveSeverityFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              activeSeverityFilter === 'all'
                ? 'bg-[#00D1FF15] text-[#00D1FF] border border-[#00D1FF30]'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            All ({componentsWithFaults.length})
          </button>
          <button
            onClick={() => setActiveSeverityFilter('issue')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 ${
              activeSeverityFilter === 'issue'
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
            <span>Possible Issues ({issueCount})</span>
          </button>
          <button
            onClick={() => setActiveSeverityFilter('inspection')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 ${
              activeSeverityFilter === 'inspection'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            <span>Needs Inspection ({inspectionCount})</span>
          </button>
        </div>
      </div>

      {/* Fault Alerts List */}
      <div className="space-y-4">
        {allFaults.map(fault => (
          <FaultAlert
            key={fault.id}
            fault={fault}
            onViewComponent={onViewComponent}
            onOpenDiagnosticGuide={(f) => setSelectedFaultForGuide(f)}
          />
        ))}

        {allFaults.length === 0 && (
          <div className="p-12 text-center text-slate-400 bg-[#12151A] border border-slate-800 rounded-xl space-y-2">
            <CheckCircle2 size={36} className="text-emerald-400 mx-auto" />
            <h3 className="font-semibold text-white">No Critical Faults Detected</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              All inspected components match standard tolerance envelopes. Perform standard DMM continuity checks before powering up.
            </p>
          </div>
        )}
      </div>

      {/* Diagnostic Guide Modal */}
      {selectedFaultForGuide && (
        <DiagnosticGuideModal
          fault={selectedFaultForGuide}
          onClose={() => setSelectedFaultForGuide(null)}
          onSaveMeasurement={onSaveMeasurement}
        />
      )}
    </div>
  );
};
