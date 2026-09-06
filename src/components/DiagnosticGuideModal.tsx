import React, { useState } from 'react';
import { ComponentFault, TestMeasurement, DiagnosisStage } from '../types';
import { 
  X, 
  Stethoscope, 
  Eye, 
  Cpu, 
  Activity, 
  CheckCircle2, 
  AlertTriangle, 
  Layers, 
  Info,
  ShieldCheck,
  Save,
  Check
} from 'lucide-react';

interface DiagnosticGuideModalProps {
  fault: ComponentFault | null;
  onClose: () => void;
  onSaveMeasurement: (
    componentId: string,
    measurementId: string,
    measuredValue: string,
    status: 'passed' | 'marginal' | 'failed'
  ) => void;
}

export const DiagnosticGuideModal: React.FC<DiagnosticGuideModalProps> = ({
  fault,
  onClose,
  onSaveMeasurement
}) => {
  if (!fault) return null;

  const [activeTab, setActiveTab] = useState<'workflow' | 'measurement_entry' | 'datasheet_limits'>('workflow');
  const [measurementInputs, setMeasurementInputs] = useState<Record<string, { val: string; status: 'passed' | 'marginal' | 'failed' }>>({});
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  const handleInputChange = (id: string, val: string, expected: string) => {
    // Quick auto-status deduction if user enters numeric or short text
    let status: 'passed' | 'marginal' | 'failed' = 'marginal';
    const lower = val.toLowerCase();
    if (lower.includes('short') || lower.includes('high') || lower.includes('open') || lower.includes('fail')) {
      status = 'failed';
    } else if (lower.includes('pass') || lower.includes('ok') || lower.includes('4.9') || lower.includes('5.0') || lower.includes('0.2')) {
      status = 'passed';
    }
    setMeasurementInputs(prev => ({
      ...prev,
      [id]: { val, status }
    }));
  };

  const handleSaveAll = () => {
    Object.entries(measurementInputs).forEach(([mId, entry]: [string, { val: string; status: 'passed' | 'marginal' | 'failed' }]) => {
      onSaveMeasurement(fault.componentId, mId, entry.val, entry.status);
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-[#12151A] border border-slate-800 rounded-2xl w-full max-w-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-[#0A0C0E]">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-[#00D1FF15] text-[#00D1FF] border border-[#00D1FF30]">
              <Stethoscope size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs px-2 py-0.5 rounded bg-[#1A1E25] text-[#00D1FF] font-bold border border-slate-700">
                  {fault.componentRef}
                </span>
                <h2 className="text-base font-semibold text-white">
                  Hardware Diagnostic Guide &amp; Verification Matrix
                </h2>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Multi-stage validation: Visual Inspection → AI Suspicion → Electrical Test → Advanced Diagnosis
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

        {/* Modal Navigation Tabs */}
        <div className="flex items-center gap-2 px-6 pt-3 border-b border-slate-800 bg-[#0A0C0E]/60 text-xs">
          <button
            onClick={() => setActiveTab('workflow')}
            className={`pb-2.5 px-3 font-medium transition-colors border-b-2 flex items-center gap-1.5 ${
              activeTab === 'workflow'
                ? 'border-[#00D1FF] text-[#00D1FF]'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers size={14} />
            <span>4-Tier Accuracy Framework</span>
          </button>
          <button
            onClick={() => setActiveTab('measurement_entry')}
            className={`pb-2.5 px-3 font-medium transition-colors border-b-2 flex items-center gap-1.5 ${
              activeTab === 'measurement_entry'
                ? 'border-[#00D1FF] text-[#00D1FF]'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Activity size={14} />
            <span>Electrical Test Probe Entry</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          {/* Accuracy UX Notice Alert */}
          <div className="p-4 rounded-xl bg-[#00D1FF10] border border-[#00D1FF30] flex items-start gap-3">
            <Info size={18} className="text-[#00D1FF] shrink-0 mt-0.5" />
            <div className="space-y-1">
              <div className="font-semibold text-[#00D1FF]">
                Core Engineering Principle: Optical Limits
              </div>
              <p className="text-slate-300 leading-relaxed text-[11px]">
                A PCB photograph alone cannot reliably prove an electrical component is defective. 
                CircuSense AI explicitly distinguishes purely visual optical inspection from deep electrical diagnosis. 
                Visual flags must always be paired with electrical test measurements before discarding components.
              </p>
            </div>
          </div>

          {activeTab === 'workflow' && (
            <div className="space-y-4">
              <h3 className="font-semibold text-sm text-white uppercase tracking-wider text-[11px]">
                Diagnostic Verification Ladder for {fault.componentRef}
              </h3>

              {/* Tier 1 */}
              <div className="p-4 rounded-xl bg-[#0A0C0E] border border-slate-800 flex items-start gap-3.5">
                <div className="w-8 h-8 rounded-lg bg-[#1A1E25] text-slate-300 flex items-center justify-center font-mono font-bold text-xs shrink-0 border border-slate-700">
                  01
                </div>
                <div className="space-y-1 flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-slate-200 text-sm">Visual Inspection (Camera / YOLO)</h4>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-[#1A1E25] text-slate-300 font-mono border border-slate-700">
                      Completed • 2400 DPI
                    </span>
                  </div>
                  <p className="text-slate-400 text-xs">
                    Automated optical camera scanned component contours, silkscreen alignment, and surface anomalies.
                  </p>
                  <div className="mt-2 p-2.5 rounded bg-[#12151A] border border-slate-800 font-mono text-[11px] text-amber-300">
                    Observed: {fault.indicators.join('; ')}
                  </div>
                </div>
              </div>

              {/* Tier 2 */}
              <div className="p-4 rounded-xl bg-[#0A0C0E] border border-amber-500/30 flex items-start gap-3.5">
                <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-300 flex items-center justify-center font-mono font-bold text-xs shrink-0 border border-amber-500/30">
                  02
                </div>
                <div className="space-y-1 flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-amber-200 text-sm">AI Suspicion Model</h4>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono font-bold">
                      Confidence: {fault.confidence}%
                    </span>
                  </div>
                  <p className="text-slate-400 text-xs">
                    Neural anomaly classifier compared thermal patina and package geometry against 50,000+ benchmark circuit boards.
                  </p>
                  <div className="mt-2 p-2.5 rounded bg-[#12151A] border border-slate-800 text-[11px] text-slate-300">
                    Finding: <span className="text-white font-medium">{fault.title}</span>
                  </div>
                </div>
              </div>

              {/* Tier 3 */}
              <div className="p-4 rounded-xl bg-[#0A0C0E] border border-[#00D1FF40] flex items-start gap-3.5">
                <div className="w-8 h-8 rounded-lg bg-[#00D1FF20] text-[#00D1FF] flex items-center justify-center font-mono font-bold text-xs shrink-0 border border-[#00D1FF30]">
                  03
                </div>
                <div className="space-y-1 flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-[#00D1FF] text-sm">Electrical Diagnosis (DMM / Scope)</h4>
                    <button
                      onClick={() => setActiveTab('measurement_entry')}
                      className="text-[10px] px-2 py-0.5 rounded bg-[#00D1FF20] text-[#00D1FF] hover:bg-[#00D1FF30] font-mono border border-[#00D1FF40]"
                    >
                      Log Test Readings →
                    </button>
                  </div>
                  <p className="text-slate-400 text-xs">
                    Physical validation using test equipment (Digital Multimeter, LCR meter, Oscilloscope probe).
                  </p>
                  <div className="mt-2 space-y-1.5">
                    {fault.measurements.map(m => (
                      <div key={m.id} className="p-2 rounded bg-[#12151A] border border-slate-800 flex items-center justify-between font-mono text-[11px]">
                        <span className="text-slate-300">{m.testPoint}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-slate-500">Exp: {m.expected}</span>
                          <span className={m.status === 'failed' ? 'text-rose-400 font-bold' : 'text-emerald-400 font-bold'}>
                            {m.measured}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Tier 4 */}
              <div className="p-4 rounded-xl bg-[#0A0C0E] border border-emerald-500/30 flex items-start gap-3.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-300 flex items-center justify-center font-mono font-bold text-xs shrink-0 border border-emerald-500/30">
                  04
                </div>
                <div className="space-y-1 flex-1">
                  <h4 className="font-semibold text-emerald-200 text-sm">Advanced Multimodal Diagnosis</h4>
                  <p className="text-slate-400 text-xs">
                    Synthesis combining visual contour evidence, netlist schematic connectivity, physical electrical measurements, and manufacturer datasheet absolute maximum ratings.
                  </p>
                  <div className="mt-2 p-2.5 rounded bg-emerald-950/40 border border-emerald-500/30 text-[11px] text-emerald-200 flex items-center gap-2">
                    <CheckCircle2 size={15} className="text-emerald-400 shrink-0" />
                    <span>Verdict: Actionable repair advice generated with 98.4% root cause certainty.</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'measurement_entry' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-white text-sm">
                    Benchtop Test Measurement Verification
                  </h3>
                  <p className="text-slate-400 text-xs">
                    Input readings measured with your DMM or oscilloscope to corroborate the AI visual suspicion.
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {fault.measurements.map(m => (
                  <div key={m.id} className="p-4 rounded-xl bg-[#0A0C0E] border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[#00D1FF] font-medium text-xs">{m.testPoint}</span>
                      <span className="text-[10px] text-slate-400 font-mono">Expected: {m.expected}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <input
                        type="text"
                        placeholder={`Enter measured value (e.g. ${m.measured || '3.42 Ω'})`}
                        defaultValue={m.measured}
                        onChange={(e) => handleInputChange(m.id, e.target.value, m.expected)}
                        className="flex-1 px-3 py-1.5 rounded-lg bg-[#12151A] border border-slate-700 text-slate-100 font-mono text-xs focus:outline-none focus:border-[#00D1FF]"
                      />
                      <select
                        defaultValue={m.status}
                        onChange={(e) => {
                          const val = measurementInputs[m.id]?.val || m.measured;
                          setMeasurementInputs(prev => ({
                            ...prev,
                            [m.id]: { val, status: e.target.value as any }
                          }));
                        }}
                        className="px-3 py-1.5 rounded-lg bg-[#12151A] border border-slate-700 text-xs font-mono text-slate-200 focus:outline-none focus:border-[#00D1FF]"
                      >
                        <option value="passed">Passed</option>
                        <option value="marginal">Marginal / Suspicious</option>
                        <option value="failed">Failed / Out of Spec</option>
                      </select>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-800">
                <span className="text-[11px] text-slate-400">
                  Saving updates the component diagnostic state across all views.
                </span>
                <button
                  onClick={handleSaveAll}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#00D1FF] hover:bg-[#00B8E0] text-[#0A0C0E] font-bold text-xs shadow-md shadow-[#00D1FF20] transition-colors cursor-pointer"
                >
                  {savedSuccess ? <Check size={14} /> : <Save size={14} />}
                  <span>{savedSuccess ? 'Measurements Saved!' : 'Save & Verify Measurements'}</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-[#0A0C0E] flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-[#1A1E25] hover:bg-slate-800 text-slate-200 text-xs font-medium border border-slate-700 transition-colors"
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
};
