import React, { useState } from 'react';
import { AdminTab } from '../../types/admin';
import { AdminNavbar } from './AdminNavbar';
import { AdminSidebar } from './AdminSidebar';
import { 
  LayoutDashboard, 
  Users, 
  DollarSign, 
  Activity, 
  Server, 
  Sliders, 
  Sparkles,
  ArrowRightLeft,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';

interface AdminWorkspaceProps {
  onSwitchToUserPortal: () => void;
}

interface TabMeta {
  title: string;
  subtitle: string;
  placeholderHeading: string;
  description: string;
  icon: React.ElementType;
  expectedFeatures: string[];
  isRealTelemetry?: boolean;
}

const TAB_METADATA: Record<AdminTab, TabMeta> = {
  overview: {
    title: 'Executive Platform Overview',
    subtitle: 'High-level operational metrics, system health, and core performance indicators',
    placeholderHeading: 'Admin Overview — Coming in Step 4D',
    description: 'Centralized executive dashboard combining real computer vision runtime health with simulated commercial metrics.',
    icon: LayoutDashboard,
    expectedFeatures: [
      'Simulated revenue & user summary metrics',
      'Live FastAPI / YOLO runtime health status widget',
      'PCB inspection volume and average inference latency',
      'Recent simulated platform transaction events'
    ]
  },
  users: {
    title: 'Platform User Management',
    subtitle: 'Directory of engineering accounts, subscription tiers, and scan quotas',
    placeholderHeading: 'User Management — Coming in Step 4D',
    description: 'User management table powered by curated demo engineering profiles (Alex Chen, Dr. Sarah Vance, Elena Rostova, etc.).',
    icon: Users,
    expectedFeatures: [
      'Filterable user account directory table',
      'Role management (user vs admin authorization)',
      'Subscription tier allocation (free, pro, enterprise)',
      'Account status toggling and scan count audits'
    ]
  },
  finance: {
    title: 'Financial & Subscription Analytics',
    subtitle: 'Simulated MRR, billing history, and pricing tier distribution',
    placeholderHeading: 'Financial Analytics — Coming in Step 4D',
    description: 'Commercial financial analytics interface backed by explicitly simulated prototype data (isSimulated: true).',
    icon: DollarSign,
    expectedFeatures: [
      'Simulated Monthly Recurring Revenue (MRR) and ARR',
      'Transaction ledger with succeeded/pending/failed statuses',
      'Subscription tier breakdown (Free / Pro / Enterprise)',
      'Mandatory simulation notice banner and export'
    ]
  },
  usage: {
    title: 'PCB Inspection & Model Usage Analytics',
    subtitle: 'Computer vision workloads, detection volume, and component classification analytics',
    placeholderHeading: 'PCB Usage Analytics — Coming in Step 4D',
    description: 'Hardware diagnostics telemetry combining real YOLO inference latency with aggregated scan metrics.',
    icon: Activity,
    expectedFeatures: [
      'Total scans and daily inspection volume metrics',
      'Live model inference latency telemetry',
      'Most detected electronic components breakdown',
      'Defect classification and optical audit stats'
    ]
  },
  system: {
    title: 'System & Model Runtime Telemetry',
    subtitle: 'Real FastAPI service health, YOLO weights info, and backend device status',
    placeholderHeading: 'System Telemetry — Coming in Step 4D',
    description: 'Live production telemetry connected to FastAPI (/api/health) and YOLO metadata (/api/model-info).',
    icon: Server,
    isRealTelemetry: true,
    expectedFeatures: [
      'Real FastAPI health verification (/api/health)',
      'Real YOLO model metadata & 22-class registry (/api/model-info)',
      'Device attribution (CPU / CUDA hardware detection)',
      'Live latency heartbeat ping and OCR availability status'
    ]
  },
  settings: {
    title: 'Administrative Platform Settings',
    subtitle: 'Global operational parameters, API endpoints, and system controls',
    placeholderHeading: 'Admin Settings — Coming in Step 4D',
    description: 'Platform administration controls, API host configuration, and demo fixture parameters.',
    icon: Sliders,
    expectedFeatures: [
      'FastAPI backend endpoint configuration',
      'Inference confidence threshold defaults',
      'Simulated data reset and fixture reload triggers',
      'Platform security & session timeout settings'
    ]
  }
};

export const AdminWorkspace: React.FC<AdminWorkspaceProps> = ({
  onSwitchToUserPortal
}) => {
  const [currentTab, setCurrentTab] = useState<AdminTab>('overview');
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState<boolean>(false);

  const activeMeta = TAB_METADATA[currentTab];
  const IconComponent = activeMeta.icon;

  return (
    <div className="min-h-screen bg-[#07090D] text-slate-200 flex flex-col font-sans selection:bg-amber-400 selection:text-[#0A0C0E]">
      {/* Admin Navbar */}
      <AdminNavbar
        onSwitchToUserPortal={onSwitchToUserPortal}
        onHamburgerClick={() => setIsMobileDrawerOpen(prev => !prev)}
        isMobileDrawerOpen={isMobileDrawerOpen}
        sidebarCollapsed={sidebarCollapsed}
      />

      {/* Main Workspace Frame */}
      <div className="flex-1 flex overflow-hidden">
        {/* Admin Navigation Sidebar (Desktop + Mobile Drawer) */}
        <AdminSidebar
          currentTab={currentTab}
          onNavigate={setCurrentTab}
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(prev => !prev)}
          isMobileDrawerOpen={isMobileDrawerOpen}
          onCloseMobileDrawer={() => setIsMobileDrawerOpen(false)}
          onSwitchToUserPortal={onSwitchToUserPortal}
        />

        {/* Content Viewport */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-[#07090D]">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Header Banner */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-800/80">
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                    {activeMeta.title}
                  </h1>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold uppercase bg-amber-500/15 text-amber-300 border border-amber-500/30">
                    Step 4C Shell
                  </span>
                  {activeMeta.isRealTelemetry && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold uppercase bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                      Real Telemetry
                    </span>
                  )}
                </div>
                <p className="text-xs sm:text-sm text-slate-400 mt-1">
                  {activeMeta.subtitle}
                </p>
              </div>

              {/* Quick Actions */}
              <div className="flex items-center gap-2">
                <button
                  onClick={onSwitchToUserPortal}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#12161F] hover:bg-[#1A202C] text-slate-300 hover:text-white border border-slate-800 text-xs font-medium transition-colors cursor-pointer"
                >
                  <ArrowRightLeft size={13} className="text-amber-400" />
                  <span>Go to PCB Analyzer</span>
                </button>
              </div>
            </div>

            {/* Tab Placeholder Presentation Card */}
            <div className="p-6 sm:p-8 rounded-xl bg-[#0D1017] border border-slate-800/80 shadow-lg relative overflow-hidden">
              <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-slate-800/60">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-amber-500/15 text-amber-400 border border-amber-500/30 flex items-center justify-center shrink-0">
                    <IconComponent size={24} />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-white tracking-tight">
                      {activeMeta.placeholderHeading}
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl leading-relaxed">
                      {activeMeta.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#12161F] border border-slate-800 text-xs font-mono text-slate-300 shrink-0">
                  <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                  <span>Target: Phase 1 — Step 4D</span>
                </div>
              </div>

              {/* Planned Features Grid */}
              <div className="mt-6 pt-2">
                <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold mb-3">
                  Components & Data Views Slated for Implementation in Step 4D:
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {activeMeta.expectedFeatures.map((feat, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-lg bg-[#12161F]/80 border border-slate-800/60 flex items-center gap-3 text-xs text-slate-300"
                    >
                      <CheckCircle2 size={15} className="text-amber-400/80 shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Data Principle Notice */}
              <div className="mt-6 p-3.5 rounded-lg bg-slate-900/60 border border-slate-800/70 flex items-start gap-3 text-xs text-slate-400">
                <ShieldCheck size={16} className="text-amber-400 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <span className="font-semibold text-slate-300">Data Architecture Principle:</span>
                  <p className="text-[11px] leading-relaxed">
                    Financial and user metrics are backed by simulated fixtures (<code className="text-amber-300">isSimulated: true</code>), whereas FastAPI connectivity, YOLO model architecture (<code className="text-sky-300">best.pt</code>, 22 classes), and local scan latencies reflect real system telemetry.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
