import React from 'react';
import { MOCK_USAGE_SUMMARY } from '../../../data/mockAdminData';
import { 
  Activity, 
  Scan, 
  Clock, 
  Cpu, 
  CheckCircle2, 
  Layers, 
  AlertCircle, 
  BarChart3,
  ShieldAlert,
  Sliders
} from 'lucide-react';

export const AdminUsageView: React.FC = () => {
  const liveUploadsPct = Math.round(
    (MOCK_USAGE_SUMMARY.scansBySource.liveUploads / MOCK_USAGE_SUMMARY.totalScans) * 100
  );
  const presetsPct = 100 - liveUploadsPct;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              PCB Inspection & Model Usage Analytics
            </h1>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider bg-sky-500/15 text-sky-300 border border-sky-500/30">
              USAGE TELEMETRY
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Aggregated computer vision inspection workload, inference latency distribution, and component categorization.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded bg-[#0D1017] border border-slate-800 text-xs font-mono text-slate-400">
            Model: <strong className="text-sky-300">YOLOv8s Component Detector</strong>
          </span>
        </div>
      </div>

      {/* Model Scope Clarification Notice */}
      <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 flex items-start gap-3 text-xs text-slate-400">
        <AlertCircle size={18} className="text-sky-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="font-bold text-slate-200">
            Model Scope Clarification:
          </span>
          <p className="leading-relaxed text-[11px]">
            The active CircuSense YOLO model (<code className="text-sky-300">best.pt</code>) is a dedicated <strong>hardware component detector and localizer</strong> across 22 electronic classes. It classifies passive and active parts with bounding boxes and confidence scores. Defect assessment metrics shown below reflect simulated heuristics, not native model defect classification heads.
          </p>
        </div>
      </div>

      {/* Usage KPIs Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Scans */}
        <div className="p-4 rounded-xl bg-[#0D1017] border border-slate-800/80">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-mono uppercase text-[10px]">Total Scans Run</span>
            <Scan size={14} className="text-sky-400" />
          </div>
          <div className="mt-2 text-2xl sm:text-3xl font-extrabold text-white font-mono">
            {MOCK_USAGE_SUMMARY.totalScans}
          </div>
          <div className="mt-2 text-xs text-slate-500 flex items-center justify-between">
            <span>Cumulative sessions</span>
            <span className="text-sky-400 font-mono">+{MOCK_USAGE_SUMMARY.scansToday} today</span>
          </div>
        </div>

        {/* Average Latency */}
        <div className="p-4 rounded-xl bg-[#0D1017] border border-slate-800/80">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-mono uppercase text-[10px]">Avg Inference Latency</span>
            <Clock size={14} className="text-emerald-400" />
          </div>
          <div className="mt-2 text-2xl sm:text-3xl font-extrabold text-emerald-400 font-mono">
            {MOCK_USAGE_SUMMARY.averageInferenceLatencyMs} ms
          </div>
          <div className="mt-2 text-xs text-slate-500 flex items-center justify-between">
            <span>YOLOv8 forward pass</span>
            <span className="text-emerald-400 font-mono">CPU Baseline</span>
          </div>
        </div>

        {/* Total Detections */}
        <div className="p-4 rounded-xl bg-[#0D1017] border border-slate-800/80">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-mono uppercase text-[10px]">Identified Components</span>
            <Cpu size={14} className="text-sky-400" />
          </div>
          <div className="mt-2 text-2xl sm:text-3xl font-extrabold text-white font-mono">
            {MOCK_USAGE_SUMMARY.totalDetectionsCount.toLocaleString()}
          </div>
          <div className="mt-2 text-xs text-slate-500 flex items-center justify-between">
            <span>Localized bounding boxes</span>
            <span className="text-sky-300 font-mono">22 categories</span>
          </div>
        </div>

        {/* Defect Rate Flag (Explicitly Marked SIMULATED) */}
        <div className="p-4 rounded-xl bg-[#0D1017] border border-amber-500/30">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-mono uppercase text-[10px] text-amber-300">Audit Flag Rate</span>
            <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30">
              SIMULATED
            </span>
          </div>
          <div className="mt-2 text-2xl sm:text-3xl font-extrabold text-amber-300 font-mono">
            {MOCK_USAGE_SUMMARY.defectFlagRatePercentage}%
          </div>
          <div className="mt-2 text-xs text-slate-500 flex items-center justify-between">
            <span className="text-amber-400/80">Heuristic simulated flags</span>
            <span className="text-amber-300 font-mono">Prototype only</span>
          </div>
        </div>
      </div>

      {/* Two Column Layout: Scan Source Breakdown & Component Class Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Scan Source Distribution */}
        <div className="p-5 rounded-xl bg-[#0D1017] border border-slate-800/80 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-white">Inspection Source Allocation</h2>
              <p className="text-xs text-slate-400">Upload workflow distribution across users</p>
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold uppercase bg-slate-800 text-slate-300 border border-slate-700">
              TELEMETRY
            </span>
          </div>

          <div className="space-y-4 pt-2">
            <div>
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="text-slate-200 font-medium flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-sky-400"></span>
                  Live User Uploads (Dashboard & Modal)
                </span>
                <span className="text-slate-300 font-mono font-bold">
                  {MOCK_USAGE_SUMMARY.scansBySource.liveUploads} scans ({liveUploadsPct}%)
                </span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-slate-800 overflow-hidden">
                <div className="h-full bg-sky-400 rounded-full" style={{ width: `${liveUploadsPct}%` }} />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="text-slate-200 font-medium flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-indigo-400"></span>
                  Benchmark Presets (Curated Boards)
                </span>
                <span className="text-slate-300 font-mono font-bold">
                  {MOCK_USAGE_SUMMARY.scansBySource.benchmarkPresets} scans ({presetsPct}%)
                </span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-slate-800 overflow-hidden">
                <div className="h-full bg-indigo-400 rounded-full" style={{ width: `${presetsPct}%` }} />
              </div>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-[#12161F] border border-slate-800 text-xs text-slate-400 space-y-1">
            <span className="font-semibold text-slate-300">Live Verification Note:</span>
            <p className="text-[11px] leading-relaxed">
              Live uploads transmit user images directly to FastAPI <code className="text-sky-300">POST /api/detect-pcb</code> for true YOLO inferencing. Preset benchmarks load curated circuit baselines.
            </p>
          </div>
        </div>

        {/* Right: Component Class Detection Breakdown */}
        <div className="p-5 rounded-xl bg-[#0D1017] border border-slate-800/80 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-white">Most Detected Component Classes</h2>
              <p className="text-xs text-slate-400">Relative volume across total detections ({MOCK_USAGE_SUMMARY.totalDetectionsCount.toLocaleString()})</p>
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold uppercase bg-sky-500/15 text-sky-300 border border-sky-500/30">
              YOLO STATS
            </span>
          </div>

          <div className="space-y-3 pt-1">
            {MOCK_USAGE_SUMMARY.topDetectedClasses.map((item, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-200 capitalize font-medium">
                    {item.className}
                  </span>
                  <div className="flex items-center gap-2 font-mono">
                    <span className="text-slate-400">{item.count.toLocaleString()}</span>
                    <span className="text-sky-300 font-bold w-12 text-right">{item.percentage}%</span>
                  </div>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-sky-500 to-sky-400 rounded-full" 
                    style={{ width: `${item.percentage}%` }} 
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
