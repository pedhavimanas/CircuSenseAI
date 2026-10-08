import React, { useState, useEffect, useCallback } from 'react';
import { detectionApi, HealthResponse, ModelInfoResponse } from '../../../services/detectionApi';
import { 
  Server, 
  Activity, 
  Cpu, 
  CheckCircle2, 
  XCircle, 
  RefreshCw, 
  Layers, 
  ShieldCheck, 
  AlertTriangle,
  HardDrive,
  Sliders,
  Terminal,
  Zap,
  Clock
} from 'lucide-react';

export const AdminSystemView: React.FC = () => {
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [modelInfo, setModelInfo] = useState<ModelInfoResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [lastCheckedAt, setLastCheckedAt] = useState<string>('');

  const fetchTelemetry = useCallback(async () => {
    setIsRefreshing(true);
    setError(null);

    try {
      const [healthData, modelData] = await Promise.all([
        detectionApi.getHealth(),
        detectionApi.getModelInfo()
      ]);

      setHealth(healthData);
      setModelInfo(modelData);
      setLastCheckedAt(new Date().toLocaleTimeString());
    } catch (err: any) {
      console.error('Failed to fetch system telemetry:', err);
      setError(err?.message || 'Unable to connect to FastAPI detection service on 127.0.0.1:8000');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchTelemetry();
  }, [fetchTelemetry]);

  const isOnline = health?.status === 'ok';
  const modelLoaded = health?.modelLoaded === true;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              System & Model Runtime Telemetry
            </h1>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
              LIVE SYSTEM TELEMETRY
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Real-time diagnostics from FastAPI backend (<code className="text-slate-300">/api/health</code>) and YOLOv8 weights registry (<code className="text-slate-300">/api/model-info</code>).
          </p>
        </div>

        <div className="flex items-center gap-3">
          {lastCheckedAt && (
            <span className="text-xs text-slate-500 font-mono hidden sm:inline flex items-center gap-1">
              <Clock size={12} />
              Checked: {lastCheckedAt}
            </span>
          )}
          <button
            onClick={fetchTelemetry}
            disabled={isRefreshing}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#12161F] hover:bg-[#1A202C] text-slate-200 hover:text-white border border-slate-800 text-xs font-semibold transition-all cursor-pointer active:scale-95 disabled:opacity-50"
            title="Refresh Live Telemetry"
          >
            <RefreshCw size={13} className={`text-emerald-400 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>{isRefreshing ? 'Refreshing...' : 'Refresh Telemetry'}</span>
          </button>
        </div>
      </div>

      {/* Online / Offline Status Banner */}
      {error ? (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-200 text-xs flex items-start gap-3">
          <XCircle size={18} className="text-rose-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-bold text-rose-300 uppercase tracking-wider font-mono">
                FASTAPI DETECTION SERVICE OFFLINE / UNREACHABLE
              </span>
              <span className="px-1.5 py-0.5 rounded text-[9px] bg-rose-500/20 text-rose-300 font-mono font-bold">
                DISCONNECTED
              </span>
            </div>
            <p className="text-rose-200/90 leading-relaxed text-[11px]">
              {error}. Please ensure the backend is running via <code className="text-white bg-slate-900 px-1 py-0.5 rounded font-mono">uvicorn backend.app:app --host 127.0.0.1 --port 8000</code>.
            </p>
          </div>
        </div>
      ) : (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-200 text-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center shrink-0">
              <Server size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-white text-sm">FastAPI Application Server</span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  LIVE · ONLINE
                </span>
              </div>
              <p className="text-emerald-300/80 text-[11px] mt-0.5 font-mono">
                Port 8000 · Model State: {modelLoaded ? 'LOADED (Active Memory)' : 'STANDBY'} · Device: {health?.device || 'CPU'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-slate-300 shrink-0">
            <span className="px-2.5 py-1 rounded bg-[#0D1017] border border-slate-800">
              Classes: <strong className="text-emerald-400">{health?.modelClasses || 22}</strong>
            </span>
            <span className="px-2.5 py-1 rounded bg-[#0D1017] border border-slate-800">
              Format: <strong className="text-sky-300">PyTorch (.pt)</strong>
            </span>
          </div>
        </div>
      )}

      {/* Primary Telemetry Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: API Status */}
        <div className="p-4 rounded-xl bg-[#0D1017] border border-slate-800/80">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-mono uppercase text-[10px]">FastAPI Connectivity</span>
            <span className={`px-1.5 py-0.5 rounded text-[9px] font-mono font-bold ${
              isOnline ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30' : 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
            }`}>
              {isOnline ? 'ONLINE' : 'OFFLINE'}
            </span>
          </div>
          <div className="mt-2 text-2xl font-extrabold text-white font-mono flex items-center gap-2">
            <span className={`w-3 h-3 rounded-full ${isOnline ? 'bg-emerald-400' : 'bg-rose-400'}`} />
            {isOnline ? 'Connected' : 'Unavailable'}
          </div>
          <div className="mt-2 text-[11px] text-slate-500 font-mono">
            Endpoint: /api/health
          </div>
        </div>

        {/* Card 2: Model Name & Weights */}
        <div className="p-4 rounded-xl bg-[#0D1017] border border-slate-800/80">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-mono uppercase text-[10px]">Model Weights</span>
            <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-sky-500/15 text-sky-400 border border-sky-500/30">
              YOLOv8
            </span>
          </div>
          <div className="mt-2 text-2xl font-extrabold text-white font-mono truncate" title={health?.modelName || 'best.pt'}>
            {health?.modelName || 'best.pt'}
          </div>
          <div className="mt-2 text-[11px] text-slate-500 font-mono truncate">
            {modelInfo?.framework || 'Ultralytics YOLO'}
          </div>
        </div>

        {/* Card 3: Class Taxonomy Count */}
        <div className="p-4 rounded-xl bg-[#0D1017] border border-slate-800/80">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-mono uppercase text-[10px]">Class Taxonomy</span>
            <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
              CLASSES
            </span>
          </div>
          <div className="mt-2 text-2xl font-extrabold text-white font-mono">
            {modelInfo?.classCount || health?.modelClasses || 22}
          </div>
          <div className="mt-2 text-[11px] text-slate-500 font-mono">
            Task: {modelInfo?.task || 'detect (localization)'}
          </div>
        </div>

        {/* Card 4: Inference Device */}
        <div className="p-4 rounded-xl bg-[#0D1017] border border-slate-800/80">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-mono uppercase text-[10px]">Execution Device</span>
            <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-amber-500/15 text-amber-400 border border-amber-500/30">
              HARDWARE
            </span>
          </div>
          <div className="mt-2 text-2xl font-extrabold text-amber-300 font-mono uppercase">
            {health?.device || 'CPU'}
          </div>
          <div className="mt-2 text-[11px] text-slate-500 font-mono">
            Torch Inference Device
          </div>
        </div>
      </div>

      {/* Model Hyperparameters & Configuration */}
      <div className="p-5 rounded-xl bg-[#0D1017] border border-slate-800/80 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-white">Model Parameters & Runtime Configuration</h2>
            <p className="text-xs text-slate-400">Inference pipeline defaults loaded from <code className="text-slate-300">/api/model-info</code></p>
          </div>
          <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
            REAL PARAMETERS
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
          <div className="p-3 rounded-lg bg-[#12161F] border border-slate-800">
            <span className="text-[10px] text-slate-500 font-mono uppercase">Input Image Size</span>
            <div className="text-sm font-bold text-white font-mono mt-0.5">
              {modelInfo?.inputSize || 640} x {modelInfo?.inputSize || 640} px
            </div>
          </div>

          <div className="p-3 rounded-lg bg-[#12161F] border border-slate-800">
            <span className="text-[10px] text-slate-500 font-mono uppercase">Default Confidence (Conf)</span>
            <div className="text-sm font-bold text-sky-400 font-mono mt-0.5">
              {modelInfo?.defaultConfidence ?? 0.25}
            </div>
          </div>

          <div className="p-3 rounded-lg bg-[#12161F] border border-slate-800">
            <span className="text-[10px] text-slate-500 font-mono uppercase">Default NMS IoU Threshold</span>
            <div className="text-sm font-bold text-emerald-400 font-mono mt-0.5">
              {modelInfo?.defaultIou ?? 0.45}
            </div>
          </div>

          <div className="p-3 rounded-lg bg-[#12161F] border border-slate-800">
            <span className="text-[10px] text-slate-500 font-mono uppercase">OCR Subsystem</span>
            <div className="text-sm font-bold text-slate-400 font-mono mt-0.5">
              Inactive (Step 4 Scope)
            </div>
          </div>
        </div>
      </div>

      {/* 22-Class Taxonomy Registry Grid */}
      <div className="p-5 rounded-xl bg-[#0D1017] border border-slate-800/80 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-white">YOLO Model Class Taxonomy (22 Classes)</h2>
            <p className="text-xs text-slate-400">Component category indices defined in <code className="text-sky-300">best.pt</code></p>
          </div>
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-sky-500/15 text-sky-300 border border-sky-500/30">
            TAXONOMY REGISTRY
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 pt-1">
          {modelInfo?.classes ? (
            Object.entries(modelInfo.classes).map(([idx, name]) => (
              <div 
                key={idx}
                className="p-2.5 rounded-lg bg-[#12161F] border border-slate-800/80 flex items-center justify-between text-xs hover:border-slate-700 transition-colors"
              >
                <span className="text-slate-200 capitalize font-medium">{name}</span>
                <span className="px-1.5 py-0.2 rounded text-[10px] font-mono text-slate-400 bg-slate-900 border border-slate-800">
                  #{idx}
                </span>
              </div>
            ))
          ) : (
            // Default 22 class fallback listing if network fails
            [
              'battery', 'button', 'buzzer', 'capacitor', 'clock', 'connector',
              'diode', 'display', 'fuse', 'heatsink', 'ic', 'inductor',
              'led', 'pads', 'pins', 'potentiometer', 'relay', 'resistor',
              'switch', 'transducer', 'transformer', 'transistor'
            ].map((name, idx) => (
              <div 
                key={idx}
                className="p-2.5 rounded-lg bg-[#12161F] border border-slate-800/80 flex items-center justify-between text-xs"
              >
                <span className="text-slate-200 capitalize font-medium">{name}</span>
                <span className="px-1.5 py-0.2 rounded text-[10px] font-mono text-slate-400 bg-slate-900 border border-slate-800">
                  #{idx}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
