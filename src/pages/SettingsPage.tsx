import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { detectionApi, HealthResponse, ModelInfoResponse } from '../services/detectionApi';
import { 
  Sliders, 
  Server, 
  Cpu, 
  ShieldCheck, 
  Database, 
  Save, 
  Check, 
  RefreshCw,
  SlidersHorizontal,
  Info,
  User,
  LogOut,
  Shield,
  Activity,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { user, logout } = useAuth();
  const [minConfidence, setMinConfidence] = useState<number>(75);
  const [enableDisclaimers, setEnableDisclaimers] = useState<boolean>(true);
  const [autoOpenDatasheet, setAutoOpenDatasheet] = useState<boolean>(true);
  const [saved, setSaved] = useState<boolean>(false);

  // Live Backend Service Telemetry
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [modelInfo, setModelInfo] = useState<ModelInfoResponse | null>(null);
  const [isCheckingBackend, setIsCheckingBackend] = useState<boolean>(false);
  const [backendError, setBackendError] = useState<string | null>(null);

  const checkLiveService = async () => {
    setIsCheckingBackend(true);
    setBackendError(null);
    try {
      const [h, m] = await Promise.all([
        detectionApi.getHealth(),
        detectionApi.getModelInfo()
      ]);
      setHealth(h);
      setModelInfo(m);
    } catch (err: any) {
      setBackendError(err?.message || 'Failed to reach FastAPI inference server');
    } finally {
      setIsCheckingBackend(false);
    }
  };

  useEffect(() => {
    checkLiveService();
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="bg-[#12151A] border border-slate-800 rounded-xl px-6 py-4 shadow-lg flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-[#00D1FF]/10 text-[#00D1FF] border border-[#00D1FF]/20">
            <Sliders size={20} />
          </div>
          <div>
            <h1 className="text-base font-bold text-white tracking-tight">
              CircuSense System &amp; Model Diagnostics
            </h1>
            <p className="text-xs text-slate-400">
              Hardware detection service telemetry and computer vision configurations
            </p>
          </div>
        </div>

        <button
          onClick={handleSave}
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#00D1FF] hover:bg-[#00B8E0] text-[#0A0C0E] font-bold text-xs transition-all shadow-md shadow-[#00D1FF]/20 cursor-pointer"
        >
          {saved ? <Check size={14} /> : <Save size={14} />}
          <span>{saved ? 'Saved!' : 'Save Settings'}</span>
        </button>
      </div>

      {/* Live Model Health & Diagnostics Card (Section 95 of Prompt) */}
      <div className="bg-[#12151A] border border-slate-800 rounded-xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-bold text-white">
            <Activity size={17} className="text-[#00D1FF]" />
            <span>Hardware Detection Service Diagnostics</span>
          </div>
          <button
            onClick={checkLiveService}
            disabled={isCheckingBackend}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#181E27] hover:bg-slate-800 text-slate-300 text-xs font-mono border border-slate-700 transition-colors cursor-pointer"
          >
            <RefreshCw size={13} className={isCheckingBackend ? 'animate-spin' : ''} />
            <span>Refresh Health</span>
          </button>
        </div>

        {backendError ? (
          <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle size={16} className="text-rose-400 shrink-0" />
              <span>Detection Service Offline: {backendError}</span>
            </div>
            <span className="font-mono text-[11px] text-rose-400">Port 8000</span>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
            <div className="p-3 rounded-lg bg-[#0A0C0E] border border-slate-800">
              <span className="text-[10px] text-slate-500 block uppercase">Detection Service</span>
              <div className="flex items-center gap-1.5 mt-1 font-semibold text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Online</span>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-[#0A0C0E] border border-slate-800">
              <span className="text-[10px] text-slate-500 block uppercase">Trained Model</span>
              <span className="text-white font-semibold block mt-1">
                {health?.modelName || 'best.pt'}
              </span>
            </div>

            <div className="p-3 rounded-lg bg-[#0A0C0E] border border-slate-800">
              <span className="text-[10px] text-slate-500 block uppercase">Model Classes</span>
              <span className="text-[#00D1FF] font-semibold block mt-1">
                {health?.modelClasses ?? 22} Trained
              </span>
            </div>

            <div className="p-3 rounded-lg bg-[#0A0C0E] border border-slate-800">
              <span className="text-[10px] text-slate-500 block uppercase">Compute Device</span>
              <span className="text-purple-400 font-semibold block mt-1 uppercase">
                {health?.device || 'CPU'}
              </span>
            </div>
          </div>
        )}

        {/* 22 Trained Classes Taxonomy Strip */}
        {modelInfo && (
          <div className="pt-2 border-t border-slate-800">
            <span className="text-[11px] font-mono text-slate-400 block mb-2">
              Authoritative 22-Class Taxonomy Loaded in Memory:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {Object.entries(modelInfo.classes).map(([id, name]) => (
                <span 
                  key={id} 
                  className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#0A0C0E] border border-slate-800 text-slate-300"
                >
                  <span className="text-slate-500 mr-1">#{id}</span>
                  <span>{name}</span>
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Engineer Account & Session Management Card */}
      <div className="bg-[#12151A] border border-slate-800 rounded-xl p-5 shadow-xl space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#00D1FF]/10 border border-[#00D1FF]/20 flex items-center justify-center text-[#00D1FF]">
              <User size={20} />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <span>Active Engineer Workspace Session</span>
                <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-mono">
                  Authenticated
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Logged in as <strong className="text-slate-200">{user?.name || 'Engineer'}</strong> ({user?.email || 'authenticated'})
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={logout}
            className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-semibold transition-all cursor-pointer"
          >
            <LogOut size={14} />
            <span>Sign Out (Logout)</span>
          </button>
        </div>
      </div>

      {/* Vision & Safety Parameters */}
      <form onSubmit={handleSave} className="space-y-6 text-xs">
        <div className="bg-[#12151A] border border-slate-800 rounded-xl p-6 shadow-xl space-y-4">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <Cpu size={16} className="text-[#00D1FF]" />
            <span>Computer Vision &amp; Confidence Thresholds</span>
          </h2>

          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-slate-300 font-medium">
                  Default Detection Confidence Filter
                </label>
                <span className="font-mono text-[#00D1FF] font-bold">{minConfidence}%</span>
              </div>
              <input
                type="range"
                min={20}
                max={90}
                value={minConfidence}
                onChange={(e) => setMinConfidence(Number(e.target.value))}
                className="w-full accent-[#00D1FF] cursor-pointer"
              />
              <p className="text-[11px] text-slate-500 mt-1">
                Detections below this score are automatically flagged for manual optical inspection.
              </p>
            </div>
          </div>
        </div>

        {/* Safety & Compliance Toggles */}
        <div className="bg-[#12151A] border border-slate-800 rounded-xl p-6 shadow-xl space-y-4">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <ShieldCheck size={16} className="text-emerald-400" />
            <span>Accuracy UX &amp; Legal Standards</span>
          </h2>

          <div className="space-y-3">
            <label className="flex items-start gap-3 cursor-pointer p-3 rounded-lg bg-[#0A0C0E] border border-slate-800">
              <input
                type="checkbox"
                checked={enableDisclaimers}
                onChange={(e) => setEnableDisclaimers(e.target.checked)}
                className="mt-0.5 accent-[#00D1FF]"
              />
              <div>
                <span className="text-slate-200 font-medium block">
                  Enforce Accuracy UX Protocol Disclaimers
                </span>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Explicitly highlights that optical photos alone cannot prove electrical failure, ensuring engineers perform benchtop multimeter measurements before discarding components.
                </p>
              </div>
            </label>

            <label className="flex items-start gap-3 cursor-pointer p-3 rounded-lg bg-[#0A0C0E] border border-slate-800">
              <input
                type="checkbox"
                checked={autoOpenDatasheet}
                onChange={(e) => setAutoOpenDatasheet(e.target.checked)}
                className="mt-0.5 accent-[#00D1FF]"
              />
              <div>
                <span className="text-slate-200 font-medium block">
                  Keep Technical Documents In-App
                </span>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Render PDF pinouts and electrical ratings directly inside the built-in datasheet viewer rather than opening external tabs.
                </p>
              </div>
            </label>
          </div>
        </div>
      </form>
    </div>
  );
};
