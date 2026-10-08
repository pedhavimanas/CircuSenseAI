import React from 'react';
import { AdminTab } from '../../../types/admin';
import { 
  MOCK_ADMIN_USERS, 
  MOCK_FINANCIAL_SUMMARY, 
  MOCK_USAGE_SUMMARY, 
  MOCK_TRANSACTIONS 
} from '../../../data/mockAdminData';
import { 
  Users, 
  Scan, 
  Cpu, 
  DollarSign, 
  ArrowUpRight, 
  ShieldCheck, 
  Activity, 
  CheckCircle2, 
  AlertCircle,
  Clock,
  Layers,
  Sparkles
} from 'lucide-react';

interface AdminOverviewViewProps {
  onNavigateTab: (tab: AdminTab) => void;
  onSwitchToUserPortal: () => void;
}

export const AdminOverviewView: React.FC<AdminOverviewViewProps> = ({
  onNavigateTab,
  onSwitchToUserPortal
}) => {
  const activeUsersCount = MOCK_ADMIN_USERS.filter(u => u.status === 'active').length;
  const recentTransactions = MOCK_TRANSACTIONS.slice(0, 4);

  return (
    <div className="space-y-6">
      {/* Page Title & Context Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              Platform Overview
            </h1>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider bg-amber-500/15 text-amber-300 border border-amber-500/30">
              Control Center
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Executive operational performance, system telemetry health, and simulated commercial activity.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigateTab('system')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#12161F] hover:bg-[#1A202C] text-slate-300 hover:text-white border border-slate-800 text-xs font-medium transition-colors cursor-pointer"
          >
            <Activity size={13} className="text-emerald-400 animate-pulse" />
            <span>Check Live Telemetry</span>
          </button>
          <button
            onClick={onSwitchToUserPortal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 text-xs font-semibold transition-colors cursor-pointer"
          >
            <ArrowUpRight size={13} className="text-amber-400" />
            <span>User Portal</span>
          </button>
        </div>
      </div>

      {/* Primary KPI Grid (Explicit REAL vs SIMULATED separation) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Total Platform Users (Simulated Prototype Directory) */}
        <div className="p-4 rounded-xl bg-[#0D1017] border border-slate-800/80 relative overflow-hidden group hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider text-slate-400 font-medium">
              Registered Accounts
            </span>
            <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-semibold uppercase bg-slate-800 text-slate-400 border border-slate-700">
              DEMO DATA
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-mono">
              {MOCK_ADMIN_USERS.length}
            </span>
            <span className="text-xs text-emerald-400 font-medium">
              {activeUsersCount} active
            </span>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-800/60">
            <span>Free / Pro / Enterprise</span>
            <button 
              onClick={() => onNavigateTab('users')} 
              className="text-amber-400 hover:underline cursor-pointer"
            >
              Manage →
            </button>
          </div>
        </div>

        {/* KPI 2: Total PCB Scans (Usage Telemetry) */}
        <div className="p-4 rounded-xl bg-[#0D1017] border border-slate-800/80 relative overflow-hidden group hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider text-slate-400 font-medium">
              PCB Scans Run
            </span>
            <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-semibold uppercase bg-sky-500/15 text-sky-300 border border-sky-500/30">
              TELEMETRY
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-mono">
              {MOCK_USAGE_SUMMARY.totalScans}
            </span>
            <span className="text-xs text-sky-400 font-medium">
              +{MOCK_USAGE_SUMMARY.scansToday} today
            </span>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-800/60">
            <span>Avg {MOCK_USAGE_SUMMARY.averageInferenceLatencyMs}ms latency</span>
            <button 
              onClick={() => onNavigateTab('usage')} 
              className="text-sky-400 hover:underline cursor-pointer"
            >
              Analytics →
            </button>
          </div>
        </div>

        {/* KPI 3: Total Detections (Component Count) */}
        <div className="p-4 rounded-xl bg-[#0D1017] border border-slate-800/80 relative overflow-hidden group hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider text-slate-400 font-medium">
              Components Identified
            </span>
            <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-semibold uppercase bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
              YOLO MODEL
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-mono">
              {MOCK_USAGE_SUMMARY.totalDetectionsCount.toLocaleString()}
            </span>
            <span className="text-xs text-emerald-400 font-medium">
              22 classes
            </span>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-800/60">
            <span>Top: {MOCK_USAGE_SUMMARY.topDetectedClasses[0]?.className}</span>
            <button 
              onClick={() => onNavigateTab('usage')} 
              className="text-emerald-400 hover:underline cursor-pointer"
            >
              Classes →
            </button>
          </div>
        </div>

        {/* KPI 4: Financial Revenue (MANDATORY SIMULATED LABEL) */}
        <div className="p-4 rounded-xl bg-[#0D1017] border border-amber-500/30 relative overflow-hidden group hover:border-amber-500/50 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider text-amber-300 font-medium">
              Gross Revenue
            </span>
            <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold uppercase bg-amber-500/20 text-amber-300 border border-amber-500/40">
              SIMULATED
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-amber-400 tracking-tight font-mono">
              ${MOCK_FINANCIAL_SUMMARY.totalRevenue.toLocaleString()}
            </span>
            <span className="text-xs text-amber-300/80 font-mono">
              MRR ${MOCK_FINANCIAL_SUMMARY.monthlyRecurringRevenue.toLocaleString()}
            </span>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-800/60">
            <span className="text-amber-400/70">Academic Prototype</span>
            <button 
              onClick={() => onNavigateTab('finance')} 
              className="text-amber-400 hover:underline cursor-pointer font-medium"
            >
              Ledger →
            </button>
          </div>
        </div>
      </div>

      {/* Telemetry Status Glance Banner */}
      <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-950/20 via-[#0D1017] to-[#0D1017] border border-emerald-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shrink-0">
            <Cpu size={20} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-white">YOLO Inference Engine</span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-semibold uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                LIVE · LOADED
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Model: <code className="text-sky-300">best.pt</code> · 22 Hardware Classes · Host: <code className="text-slate-300">127.0.0.1:8000</code>
            </p>
          </div>
        </div>

        <button
          onClick={() => onNavigateTab('system')}
          className="px-3 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-medium transition-colors cursor-pointer shrink-0"
        >
          View Model Architecture & Classes →
        </button>
      </div>

      {/* Two-Column Middle Section: Plan Distribution & Top Classes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Subscription Plan Distribution (Simulated) */}
        <div className="p-5 rounded-xl bg-[#0D1017] border border-slate-800/80 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-white">Subscription Tier Distribution</h2>
              <p className="text-xs text-slate-400">Client-side simulated licensing breakdown</p>
            </div>
            <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-semibold uppercase bg-slate-800 text-slate-400 border border-slate-700">
              SIMULATED
            </span>
          </div>

          <div className="space-y-3 pt-2">
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-slate-300 font-medium">Enterprise Tier ($299/mo)</span>
                <span className="text-slate-400 font-mono">6 organizations ({Math.round(6/38*100)}%)</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                <div className="h-full bg-amber-400 rounded-full" style={{ width: `${Math.round(6/38*100)}%` }} />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-slate-300 font-medium">Pro Engineering Tier ($49/mo)</span>
                <span className="text-slate-400 font-mono">18 engineers ({Math.round(18/38*100)}%)</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                <div className="h-full bg-sky-400 rounded-full" style={{ width: `${Math.round(18/38*100)}%` }} />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-slate-300 font-medium">Free Community Tier ($0/mo)</span>
                <span className="text-slate-400 font-mono">14 accounts ({Math.round(14/38*100)}%)</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                <div className="h-full bg-emerald-400 rounded-full" style={{ width: `${Math.round(14/38*100)}%` }} />
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
            <span>Annual Run Rate: <strong className="text-amber-300 font-mono">${MOCK_FINANCIAL_SUMMARY.annualRunRate.toLocaleString()}</strong></span>
            <button 
              onClick={() => onNavigateTab('finance')}
              className="text-amber-400 hover:underline cursor-pointer"
            >
              Full Finance Summary →
            </button>
          </div>
        </div>

        {/* Right: Component Detection Breakdown */}
        <div className="p-5 rounded-xl bg-[#0D1017] border border-slate-800/80 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-white">Top Identified Hardware Components</h2>
              <p className="text-xs text-slate-400">Optical localization across inspected PCBA boards</p>
            </div>
            <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-semibold uppercase bg-sky-500/15 text-sky-300 border border-sky-500/30">
              YOLO STATS
            </span>
          </div>

          <div className="space-y-2.5 pt-1">
            {MOCK_USAGE_SUMMARY.topDetectedClasses.slice(0, 4).map((c, idx) => (
              <div key={idx} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-sky-400" />
                  <span className="text-slate-200 capitalize font-medium">{c.className}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-slate-400">{c.count.toLocaleString()} units</span>
                  <span className="w-12 text-right font-mono text-sky-300 font-bold">{c.percentage}%</span>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
            <span>Detection Coverage: <strong className="text-white font-mono">22 Classes</strong></span>
            <button 
              onClick={() => onNavigateTab('usage')}
              className="text-sky-400 hover:underline cursor-pointer"
            >
              View Usage Analytics →
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Section: Recent Simulated Transactions Audit Stream */}
      <div className="p-5 rounded-xl bg-[#0D1017] border border-slate-800/80 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-white">Recent Simulated Billing Events</h2>
            <p className="text-xs text-slate-400">Prototype transaction audit ledger</p>
          </div>
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-amber-500/15 text-amber-300 border border-amber-500/30">
            SIMULATED TRANSACTIONS
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="text-[11px] uppercase tracking-wider text-slate-500 border-b border-slate-800 bg-[#12161F]/60">
              <tr>
                <th className="py-2.5 px-3 font-semibold">User</th>
                <th className="py-2.5 px-3 font-semibold">Plan</th>
                <th className="py-2.5 px-3 font-semibold">Amount</th>
                <th className="py-2.5 px-3 font-semibold">Date</th>
                <th className="py-2.5 px-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {recentTransactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-2.5 px-3 text-slate-200 font-sans font-medium">
                    {tx.userName}
                  </td>
                  <td className="py-2.5 px-3">
                    <span className="capitalize text-slate-300 font-sans">{tx.plan}</span>
                  </td>
                  <td className="py-2.5 px-3 font-bold text-amber-300">
                    ${tx.amount} {tx.currency}
                  </td>
                  <td className="py-2.5 px-3 text-slate-400 font-sans text-[11px]">
                    {tx.date}
                  </td>
                  <td className="py-2.5 px-3">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                      tx.status === 'succeeded'
                        ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                        : tx.status === 'pending'
                        ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                        : 'bg-rose-500/15 text-rose-300 border border-rose-500/30'
                    }`}>
                      {tx.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
