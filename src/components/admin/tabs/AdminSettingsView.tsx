import React, { useState } from 'react';
import { 
  Sliders, 
  ShieldCheck, 
  Server, 
  Terminal, 
  AlertTriangle, 
  Info, 
  CheckCircle2, 
  RefreshCw,
  Lock,
  Database
} from 'lucide-react';

export const AdminSettingsView: React.FC = () => {
  const [telemetryInterval, setTelemetryInterval] = useState('30');
  const [demoFinanceMode, setDemoFinanceMode] = useState(true);
  const [savedNotice, setSavedNotice] = useState<string | null>(null);

  const handleSaveSimulatedSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedNotice('Client settings preferences saved to local session.');
    setTimeout(() => setSavedNotice(null), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              Administrative Platform Settings
            </h1>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider bg-slate-800 text-slate-300 border border-slate-700">
              CONFIG & POLICIES
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Environment definitions, API service endpoints, and prototype simulation policies.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded bg-[#0D1017] border border-slate-800 text-xs font-mono text-emerald-400">
            Environment: Localhost Dev
          </span>
        </div>
      </div>

      {/* Informational Policy Banner */}
      <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 flex items-start gap-3 text-xs text-slate-400">
        <Info size={18} className="text-amber-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="font-bold text-slate-200">
            Configuration Scope Policy:
          </span>
          <p className="leading-relaxed text-[11px]">
            CircuSense AI operates as an academic prototype paired with a local FastAPI detection service. Settings displayed below are informational or bound to the current browser session. Production backend parameters and weights paths (<code className="text-sky-300">models/best.pt</code>) are maintained in the backend runtime configuration.
          </p>
        </div>
      </div>

      {savedNotice && (
        <div className="p-3 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2 animate-fade-in">
          <CheckCircle2 size={15} />
          <span>{savedNotice}</span>
        </div>
      )}

      {/* Grid of Settings Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Panel 1: Backend & Service Endpoints */}
        <div className="p-5 rounded-xl bg-[#0D1017] border border-slate-800/80 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Server size={17} className="text-sky-400" />
              <h2 className="text-sm font-bold text-white">Service Endpoints</h2>
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 font-semibold">
              ACTIVE
            </span>
          </div>

          <div className="space-y-3 pt-1 text-xs">
            <div>
              <span className="text-slate-400 font-mono text-[11px]">FastAPI Detection Host</span>
              <div className="mt-1 px-3 py-2 rounded-lg bg-[#12161F] border border-slate-800 text-slate-200 font-mono flex items-center justify-between">
                <span>http://127.0.0.1:8000</span>
                <span className="text-[10px] text-emerald-400 font-bold uppercase">Connected</span>
              </div>
            </div>

            <div>
              <span className="text-slate-400 font-mono text-[11px]">Vite Frontend Proxy Route</span>
              <div className="mt-1 px-3 py-2 rounded-lg bg-[#12161F] border border-slate-800 text-slate-300 font-mono">
                /api → http://127.0.0.1:8000
              </div>
            </div>

            <div>
              <span className="text-slate-400 font-mono text-[11px]">YOLO Detection Endpoint</span>
              <div className="mt-1 px-3 py-2 rounded-lg bg-[#12161F] border border-slate-800 text-slate-300 font-mono">
                POST /api/detect-pcb (multipart/form-data)
              </div>
            </div>
          </div>
        </div>

        {/* Panel 2: Model & Weights Configuration */}
        <div className="p-5 rounded-xl bg-[#0D1017] border border-slate-800/80 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sliders size={17} className="text-emerald-400" />
              <h2 className="text-sm font-bold text-white">YOLO Runtime Policy</h2>
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono text-slate-400 bg-slate-800 border border-slate-700">
              READ ONLY
            </span>
          </div>

          <div className="space-y-3 pt-1 text-xs">
            <div>
              <span className="text-slate-400 font-mono text-[11px]">Active Weights Path</span>
              <div className="mt-1 px-3 py-2 rounded-lg bg-[#12161F] border border-slate-800 text-slate-200 font-mono">
                backend/models/best.pt
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <span className="text-slate-400 font-mono text-[11px]">Default Conf Threshold</span>
                <div className="mt-1 px-3 py-2 rounded-lg bg-[#12161F] border border-slate-800 text-slate-200 font-mono">
                  0.25 (25%)
                </div>
              </div>
              <div>
                <span className="text-slate-400 font-mono text-[11px]">Default IoU NMS</span>
                <div className="mt-1 px-3 py-2 rounded-lg bg-[#12161F] border border-slate-800 text-slate-200 font-mono">
                  0.45 (45%)
                </div>
              </div>
            </div>

            <div>
              <span className="text-slate-400 font-mono text-[11px]">Taxonomy Definition</span>
              <div className="mt-1 px-3 py-2 rounded-lg bg-[#12161F] border border-slate-800 text-slate-300 font-mono">
                22 Electronic Hardware Classes
              </div>
            </div>
          </div>
        </div>

        {/* Panel 3: Financial & Commercial Simulation Policy */}
        <div className="p-5 rounded-xl bg-[#0D1017] border border-slate-800/80 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Database size={17} className="text-amber-400" />
              <h2 className="text-sm font-bold text-white">Simulation & Demo Controls</h2>
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono text-amber-300 bg-amber-500/10 border border-amber-500/30 font-semibold">
              MOCK MODE
            </span>
          </div>

          <form onSubmit={handleSaveSimulatedSettings} className="space-y-3 pt-1 text-xs">
            <div className="flex items-center justify-between p-3 rounded-lg bg-[#12161F] border border-slate-800">
              <div>
                <span className="font-semibold text-slate-200">Financial Simulation Mode</span>
                <p className="text-[11px] text-slate-400 mt-0.5">Enforces simulated flags across billing views</p>
              </div>
              <input
                type="checkbox"
                checked={demoFinanceMode}
                onChange={(e) => setDemoFinanceMode(e.target.checked)}
                className="w-4 h-4 accent-amber-500 cursor-pointer"
              />
            </div>

            <div>
              <span className="text-slate-400 font-mono text-[11px]">Telemetry Auto-Refresh Interval</span>
              <select
                value={telemetryInterval}
                onChange={(e) => setTelemetryInterval(e.target.value)}
                className="w-full mt-1 px-3 py-2 rounded-lg bg-[#12161F] border border-slate-800 text-slate-200 focus:outline-none cursor-pointer"
              >
                <option value="15">Every 15 seconds</option>
                <option value="30">Every 30 seconds</option>
                <option value="60">Every 60 seconds</option>
                <option value="manual">Manual refresh only</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full mt-2 py-2 px-4 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 font-semibold text-xs transition-colors cursor-pointer"
            >
              Save Client Session Preferences
            </button>
          </form>
        </div>

        {/* Panel 4: Platform Security & Authentication Policies */}
        <div className="p-5 rounded-xl bg-[#0D1017] border border-slate-800/80 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Lock size={17} className="text-rose-400" />
              <h2 className="text-sm font-bold text-white">Security & Role Policies</h2>
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 font-semibold">
              ENFORCED
            </span>
          </div>

          <div className="space-y-3 pt-1 text-xs">
            <div className="p-3 rounded-lg bg-[#12161F] border border-slate-800 space-y-1">
              <div className="flex items-center gap-1.5 text-slate-200 font-semibold">
                <CheckCircle2 size={14} className="text-emerald-400" />
                <span>Role-Based Portal Gating</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Normal users with <code className="text-sky-300">role === 'user'</code> are strictly locked to the User PCB Workspace. Admin routes and UI are never exposed to non-admin accounts.
              </p>
            </div>

            <div className="p-3 rounded-lg bg-[#12161F] border border-slate-800 space-y-1">
              <div className="flex items-center gap-1.5 text-slate-200 font-semibold">
                <CheckCircle2 size={14} className="text-emerald-400" />
                <span>Simulated Auth Persistence</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Authentication sessions persist in <code className="text-slate-300">localStorage('circusense_user')</code>. Admin role is explicitly granted via the Admin Demo login flow.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
