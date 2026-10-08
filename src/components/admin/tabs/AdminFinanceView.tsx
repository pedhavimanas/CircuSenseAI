import React, { useState } from 'react';
import { 
  MOCK_FINANCIAL_SUMMARY, 
  MOCK_TRANSACTIONS, 
  DEMO_FINANCE_NOTICE 
} from '../../../data/mockAdminData';
import { TransactionRecord } from '../../../types/admin';
import { 
  DollarSign, 
  TrendingUp, 
  CreditCard, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  XCircle,
  FileText,
  ShieldAlert,
  Search
} from 'lucide-react';

export const AdminFinanceView: React.FC = () => {
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchInvoice, setSearchInvoice] = useState<string>('');

  const filteredTransactions = MOCK_TRANSACTIONS.filter(tx => {
    const matchesStatus = filterStatus === 'all' || tx.status === filterStatus;
    const matchesSearch = 
      tx.invoiceNumber.toLowerCase().includes(searchInvoice.toLowerCase()) ||
      tx.userName.toLowerCase().includes(searchInvoice.toLowerCase()) ||
      tx.userEmail.toLowerCase().includes(searchInvoice.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const maxRevenue = Math.max(...MOCK_FINANCIAL_SUMMARY.monthlyTrend.map(t => t.revenue));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              Financial & Subscription Analytics
            </h1>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider bg-amber-500/15 text-amber-300 border border-amber-500/35">
              DEMO DATA · SIMULATED
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Simulated platform revenue models, subscription renewals, and transaction ledger.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded bg-[#0D1017] border border-amber-500/30 text-amber-400 font-mono text-xs font-semibold">
            Currency: {MOCK_FINANCIAL_SUMMARY.currency} (Simulated)
          </span>
        </div>
      </div>

      {/* Prominent Mandatory Simulation Notice Banner */}
      <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs flex items-start gap-3 shadow-xs">
        <ShieldAlert size={18} className="text-amber-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="font-bold text-amber-300 uppercase tracking-wider font-mono text-[11px]">
              DEMO / SIMULATED FINANCIAL DATASET
            </span>
            <span className="px-1.5 py-0.2 rounded text-[9px] bg-amber-400/20 text-amber-300 font-mono font-bold">
              PROTOTYPE
            </span>
          </div>
          <p className="text-amber-200/90 leading-relaxed text-[11px]">
            {DEMO_FINANCE_NOTICE}
          </p>
        </div>
      </div>

      {/* Financial KPIs Grid (Explicitly labeled SIMULATED) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Revenue */}
        <div className="p-4 rounded-xl bg-[#0D1017] border border-slate-800/80">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-mono uppercase text-[10px]">Gross Revenue</span>
            <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-amber-500/15 text-amber-400 border border-amber-500/30">
              SIMULATED
            </span>
          </div>
          <div className="mt-2 text-2xl sm:text-3xl font-extrabold text-white font-mono">
            ${MOCK_FINANCIAL_SUMMARY.totalRevenue.toLocaleString()}
          </div>
          <div className="mt-2 text-xs text-slate-500 flex items-center justify-between">
            <span>Cumulative prototype intake</span>
            <span className="text-emerald-400 font-mono font-medium">+8.4% MoM</span>
          </div>
        </div>

        {/* MRR */}
        <div className="p-4 rounded-xl bg-[#0D1017] border border-slate-800/80">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-mono uppercase text-[10px]">Monthly Recurring (MRR)</span>
            <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-amber-500/15 text-amber-400 border border-amber-500/30">
              SIMULATED
            </span>
          </div>
          <div className="mt-2 text-2xl sm:text-3xl font-extrabold text-amber-300 font-mono">
            ${MOCK_FINANCIAL_SUMMARY.monthlyRecurringRevenue.toLocaleString()}
          </div>
          <div className="mt-2 text-xs text-slate-500 flex items-center justify-between">
            <span>Monthly Run-rate</span>
            <span className="text-slate-400 font-mono font-medium">Oct 2026 MTD</span>
          </div>
        </div>

        {/* ARR */}
        <div className="p-4 rounded-xl bg-[#0D1017] border border-slate-800/80">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-mono uppercase text-[10px]">Annual Run Rate (ARR)</span>
            <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-amber-500/15 text-amber-400 border border-amber-500/30">
              SIMULATED
            </span>
          </div>
          <div className="mt-2 text-2xl sm:text-3xl font-extrabold text-white font-mono">
            ${MOCK_FINANCIAL_SUMMARY.annualRunRate.toLocaleString()}
          </div>
          <div className="mt-2 text-xs text-slate-500 flex items-center justify-between">
            <span>Annualized projection</span>
            <span className="text-slate-400 font-mono">12x MRR</span>
          </div>
        </div>

        {/* ARPU */}
        <div className="p-4 rounded-xl bg-[#0D1017] border border-slate-800/80">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-mono uppercase text-[10px]">Avg Revenue / User</span>
            <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-amber-500/15 text-amber-400 border border-amber-500/30">
              SIMULATED
            </span>
          </div>
          <div className="mt-2 text-2xl sm:text-3xl font-extrabold text-sky-400 font-mono">
            ${MOCK_FINANCIAL_SUMMARY.averageRevenuePerUser.toFixed(2)}
          </div>
          <div className="mt-2 text-xs text-slate-500 flex items-center justify-between">
            <span>Across paid tiers</span>
            <span className="text-sky-300 font-mono">24 paid accounts</span>
          </div>
        </div>
      </div>

      {/* Transaction Status Summary Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3 rounded-lg bg-[#0D1017] border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-500 uppercase font-mono">Total Transactions</span>
            <div className="text-lg font-bold text-white font-mono">{MOCK_FINANCIAL_SUMMARY.transactionCount}</div>
          </div>
          <CreditCard size={18} className="text-slate-500" />
        </div>

        <div className="p-3 rounded-lg bg-[#0D1017] border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-500 uppercase font-mono">Successful</span>
            <div className="text-lg font-bold text-emerald-400 font-mono">{MOCK_FINANCIAL_SUMMARY.successfulTransactions}</div>
          </div>
          <CheckCircle2 size={18} className="text-emerald-400" />
        </div>

        <div className="p-3 rounded-lg bg-[#0D1017] border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-500 uppercase font-mono">Pending</span>
            <div className="text-lg font-bold text-amber-400 font-mono">{MOCK_FINANCIAL_SUMMARY.pendingTransactions}</div>
          </div>
          <Clock size={18} className="text-amber-400" />
        </div>

        <div className="p-3 rounded-lg bg-[#0D1017] border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-500 uppercase font-mono">Failed</span>
            <div className="text-lg font-bold text-rose-400 font-mono">{MOCK_FINANCIAL_SUMMARY.failedTransactions}</div>
          </div>
          <XCircle size={18} className="text-rose-400" />
        </div>
      </div>

      {/* Monthly Trend Visual & Plan Allocation */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Monthly Trend SVG Visualization (No external charting lib) */}
        <div className="lg:col-span-2 p-5 rounded-xl bg-[#0D1017] border border-slate-800/80 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-white">Simulated Monthly Revenue Trend</h2>
              <p className="text-xs text-slate-400">Prototype revenue progression over the past 6 billing cycles</p>
            </div>
            <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase bg-amber-500/15 text-amber-300 border border-amber-500/30">
              SIMULATED TREND
            </span>
          </div>

          {/* SVG Bar Chart Visualization */}
          <div className="pt-4">
            <div className="h-44 w-full flex items-end gap-3 sm:gap-6 px-2 border-b border-slate-800">
              {MOCK_FINANCIAL_SUMMARY.monthlyTrend.map((item, idx) => {
                const heightPercent = Math.round((item.revenue / maxRevenue) * 100);
                return (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                    <span className="text-[10px] font-mono text-amber-300 font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                      ${item.revenue}
                    </span>
                    <div 
                      className="w-full bg-gradient-to-t from-amber-500/40 to-amber-400 rounded-t-md transition-all group-hover:from-amber-500/70 group-hover:to-amber-300 relative"
                      style={{ height: `${heightPercent}%` }}
                    >
                      <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 rounded-t-md transition-opacity" />
                    </div>
                    <span className="text-[10px] font-mono text-slate-400 truncate max-w-[60px] text-center">
                      {item.month.split(' ')[0]}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Plan Distribution Breakdown */}
        <div className="p-5 rounded-xl bg-[#0D1017] border border-slate-800/80 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-white">Plan Allocation</h2>
              <p className="text-xs text-slate-400">Simulated tier subscriptions</p>
            </div>
            <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold uppercase bg-slate-800 text-slate-400 border border-slate-700">
              DEMO
            </span>
          </div>

          <div className="space-y-4 pt-1">
            <div className="p-3 rounded-lg bg-[#12161F] border border-slate-800">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-amber-300">Enterprise ($299/mo)</span>
                <span className="font-mono text-white font-bold">{MOCK_FINANCIAL_SUMMARY.planDistribution.enterprise} organizations</span>
              </div>
              <div className="text-[11px] text-slate-500 mt-1">Dedicated team seats & priority YOLO pipeline</div>
            </div>

            <div className="p-3 rounded-lg bg-[#12161F] border border-slate-800">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-sky-300">Pro Engineering ($49/mo)</span>
                <span className="font-mono text-white font-bold">{MOCK_FINANCIAL_SUMMARY.planDistribution.pro} seats</span>
              </div>
              <div className="text-[11px] text-slate-500 mt-1">Unlimited custom scans & AI diagnostic assist</div>
            </div>

            <div className="p-3 rounded-lg bg-[#12161F] border border-slate-800">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-300">Free Tier ($0/mo)</span>
                <span className="font-mono text-white font-bold">{MOCK_FINANCIAL_SUMMARY.planDistribution.free} accounts</span>
              </div>
              <div className="text-[11px] text-slate-500 mt-1">Preset benchmarks & community inspection tools</div>
            </div>
          </div>
        </div>
      </div>

      {/* Transaction Ledger Table */}
      <div className="rounded-xl bg-[#0D1017] border border-slate-800/80 overflow-hidden shadow-lg space-y-3 p-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-2 border-b border-slate-800/80">
          <div>
            <h2 className="text-sm font-bold text-white">Simulated Billing Transaction Ledger</h2>
            <p className="text-xs text-slate-400">Audit history of fictional platform charges</p>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="text"
              value={searchInvoice}
              onChange={(e) => setSearchInvoice(e.target.value)}
              placeholder="Search invoice or user..."
              className="px-3 py-1.5 rounded-lg bg-[#12161F] border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none font-sans"
            />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-1.5 rounded-lg bg-[#12161F] border border-slate-800 text-xs text-slate-300 focus:outline-none font-sans cursor-pointer"
            >
              <option value="all">Status: All</option>
              <option value="succeeded">Succeeded</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="text-[11px] uppercase tracking-wider text-slate-500 border-b border-slate-800 bg-[#12161F]/60">
              <tr>
                <th className="py-2.5 px-3 font-semibold">Invoice</th>
                <th className="py-2.5 px-3 font-semibold">Customer</th>
                <th className="py-2.5 px-3 font-semibold">Plan</th>
                <th className="py-2.5 px-3 font-semibold">Billing Cycle</th>
                <th className="py-2.5 px-3 font-semibold text-right">Amount</th>
                <th className="py-2.5 px-3 font-semibold">Date</th>
                <th className="py-2.5 px-3 font-semibold">Status</th>
                <th className="py-2.5 px-3 font-semibold">Simulated Method</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-sans">
              {filteredTransactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-2.5 px-3 font-mono font-semibold text-slate-200 text-[11px]">
                    {tx.invoiceNumber}
                  </td>
                  <td className="py-2.5 px-3">
                    <div className="font-medium text-slate-100">{tx.userName}</div>
                    <div className="text-[10px] text-slate-500 font-mono">{tx.userEmail}</div>
                  </td>
                  <td className="py-2.5 px-3 capitalize text-slate-300">
                    {tx.plan}
                  </td>
                  <td className="py-2.5 px-3 text-slate-400 capitalize">
                    {tx.billingCycle}
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono font-bold text-amber-300">
                    ${tx.amount.toLocaleString()} {tx.currency}
                  </td>
                  <td className="py-2.5 px-3 text-slate-400 text-[11px] font-mono">
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
                  <td className="py-2.5 px-3 text-slate-400 text-[11px]">
                    {tx.paymentMethod}
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
