import React, { useState, useMemo } from 'react';
import { MOCK_ADMIN_USERS } from '../../../data/mockAdminData';
import { AdminUserRecord, SubscriptionTier, UserAccountStatus } from '../../../types/admin';
import { 
  Users, 
  Search, 
  Filter, 
  ShieldCheck, 
  ShieldAlert, 
  CheckCircle2, 
  Clock, 
  AlertTriangle,
  Info,
  X
} from 'lucide-react';

export const AdminUsersView: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [tierFilter, setTierFilter] = useState<string>('all');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [selectedUser, setSelectedUser] = useState<AdminUserRecord | null>(null);

  // Filter users based on query and dropdown states
  const filteredUsers = useMemo(() => {
    return MOCK_ADMIN_USERS.filter(user => {
      const matchesSearch = 
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (user.department && user.department.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (user.title && user.title.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
      const matchesTier = tierFilter === 'all' || user.tier === tierFilter;
      const matchesRole = roleFilter === 'all' || user.role === roleFilter;

      return matchesSearch && matchesStatus && matchesTier && matchesRole;
    });
  }, [searchQuery, statusFilter, tierFilter, roleFilter]);

  // Quick stats
  const totalUsers = MOCK_ADMIN_USERS.length;
  const activeCount = MOCK_ADMIN_USERS.filter(u => u.status === 'active').length;
  const enterpriseCount = MOCK_ADMIN_USERS.filter(u => u.tier === 'enterprise').length;
  const adminCount = MOCK_ADMIN_USERS.filter(u => u.role === 'admin').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              Platform User Directory
            </h1>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider bg-slate-800 text-slate-300 border border-slate-700">
              DEMO DATA
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Simulated user management, authorization assignments, and subscription allocation.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
          <span className="px-2.5 py-1 rounded bg-[#0D1017] border border-slate-800">
            Total: <strong className="text-white">{totalUsers}</strong>
          </span>
          <span className="px-2.5 py-1 rounded bg-[#0D1017] border border-slate-800">
            Active: <strong className="text-emerald-400">{activeCount}</strong>
          </span>
          <span className="px-2.5 py-1 rounded bg-[#0D1017] border border-slate-800">
            Admins: <strong className="text-amber-400">{adminCount}</strong>
          </span>
        </div>
      </div>

      {/* Prototype Disclaimer Banner */}
      <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80 flex items-start gap-3 text-xs text-slate-400">
        <Info size={16} className="text-amber-400 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong className="text-slate-300">Prototype Directory:</strong> All user records below are curated fixtures. Search and filters run in client-side state. Modifying roles or deleting accounts does not perform live database operations in this academic build.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-xl bg-[#0D1017] border border-slate-800/80 space-y-3">
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
          {/* Search input */}
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, email, department, or title..."
              className="w-full pl-9 pr-4 py-2 rounded-lg bg-[#12161F] border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500/60 font-sans"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 rounded-lg bg-[#12161F] border border-slate-800 text-xs text-slate-300 focus:outline-none focus:border-amber-500/60 cursor-pointer font-sans"
            >
              <option value="all">Status: All</option>
              <option value="active">Active</option>
              <option value="suspended">Suspended</option>
              <option value="invited">Invited</option>
              <option value="pending">Pending</option>
            </select>

            {/* Plan Filter */}
            <select
              value={tierFilter}
              onChange={(e) => setTierFilter(e.target.value)}
              className="px-3 py-2 rounded-lg bg-[#12161F] border border-slate-800 text-xs text-slate-300 focus:outline-none focus:border-amber-500/60 cursor-pointer font-sans"
            >
              <option value="all">Tier: All</option>
              <option value="free">Free</option>
              <option value="pro">Pro</option>
              <option value="enterprise">Enterprise</option>
            </select>

            {/* Role Filter */}
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-3 py-2 rounded-lg bg-[#12161F] border border-slate-800 text-xs text-slate-300 focus:outline-none focus:border-amber-500/60 cursor-pointer font-sans"
            >
              <option value="all">Role: All</option>
              <option value="admin">Admin</option>
              <option value="user">User</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
          <span>Showing <strong className="text-slate-300">{filteredUsers.length}</strong> of {totalUsers} accounts</span>
          {(searchQuery || statusFilter !== 'all' || tierFilter !== 'all' || roleFilter !== 'all') && (
            <button
              onClick={() => {
                setSearchQuery('');
                setStatusFilter('all');
                setTierFilter('all');
                setRoleFilter('all');
              }}
              className="text-amber-400 hover:underline cursor-pointer"
            >
              Reset all filters
            </button>
          )}
        </div>
      </div>

      {/* Users Table */}
      <div className="rounded-xl bg-[#0D1017] border border-slate-800/80 overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="text-[11px] uppercase tracking-wider text-slate-500 border-b border-slate-800 bg-[#12161F]/80">
              <tr>
                <th className="py-3 px-4 font-semibold">User / Profile</th>
                <th className="py-3 px-4 font-semibold">Email</th>
                <th className="py-3 px-4 font-semibold">Role</th>
                <th className="py-3 px-4 font-semibold">Plan Tier</th>
                <th className="py-3 px-4 font-semibold">Status</th>
                <th className="py-3 px-4 font-semibold text-right">PCB Scans</th>
                <th className="py-3 px-4 font-semibold">Last Active</th>
                <th className="py-3 px-4 font-semibold text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-sans">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-500">
                    No accounts match your current filter parameters.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-800/30 transition-colors">
                    {/* User Name & Department */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                          user.role === 'admin'
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                            : 'bg-sky-500/15 text-sky-300 border border-sky-500/30'
                        }`}>
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-semibold text-slate-100 flex items-center gap-1.5">
                            <span>{user.name}</span>
                            {user.role === 'admin' && (
                              <span className="text-[10px] text-amber-400 font-mono" title="Administrator Role">
                                ★
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-slate-400 truncate max-w-[200px]" title={user.title || user.department}>
                            {user.title || user.department || 'Engineering User'}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Email */}
                    <td className="py-3 px-4 font-mono text-slate-400 text-[11px]">
                      {user.email}
                    </td>

                    {/* Role */}
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider ${
                        user.role === 'admin'
                          ? 'bg-amber-500/15 text-amber-300 border border-amber-500/35'
                          : 'bg-slate-800 text-slate-400 border border-slate-700'
                      }`}>
                        {user.role}
                      </span>
                    </td>

                    {/* Plan Tier */}
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono font-semibold uppercase ${
                        user.tier === 'enterprise'
                          ? 'bg-amber-400/10 text-amber-300 border border-amber-400/30'
                          : user.tier === 'pro'
                          ? 'bg-sky-400/10 text-sky-300 border border-sky-400/30'
                          : 'bg-slate-800 text-slate-400 border border-slate-700'
                      }`}>
                        {user.tier}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-medium capitalize ${
                        user.status === 'active'
                          ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                          : user.status === 'invited'
                          ? 'bg-blue-500/15 text-blue-300 border border-blue-500/30'
                          : 'bg-slate-800 text-slate-400 border border-slate-700'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${user.status === 'active' ? 'bg-emerald-400' : 'bg-slate-400'}`} />
                        {user.status}
                      </span>
                    </td>

                    {/* Scans Count */}
                    <td className="py-3 px-4 text-right font-mono font-semibold text-slate-200">
                      {user.scansCount}
                    </td>

                    {/* Last Active */}
                    <td className="py-3 px-4 text-slate-400 text-[11px] font-mono">
                      {user.lastActiveAt}
                    </td>

                    {/* Action */}
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => setSelectedUser(user)}
                        className="px-2.5 py-1 rounded bg-[#161B22] hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 text-[11px] font-medium transition-colors cursor-pointer"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* User Details Modal (Prototype inspection) */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
          <div className="w-full max-w-md bg-[#0D1017] border border-slate-800 rounded-xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Users size={18} className="text-amber-400" />
                <h3 className="font-bold text-white text-sm">Account Inspection (Prototype)</h3>
              </div>
              <button
                onClick={() => setSelectedUser(null)}
                className="text-slate-400 hover:text-white"
              >
                <X size={16} />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-slate-500 uppercase tracking-wider text-[10px] font-mono">Full Name</span>
                <p className="text-slate-200 font-semibold text-sm">{selectedUser.name}</p>
              </div>

              <div>
                <span className="text-slate-500 uppercase tracking-wider text-[10px] font-mono">Email Address</span>
                <p className="text-slate-300 font-mono">{selectedUser.email}</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <span className="text-slate-500 uppercase tracking-wider text-[10px] font-mono">Authorization Role</span>
                  <p className="text-amber-400 font-mono font-semibold uppercase">{selectedUser.role}</p>
                </div>
                <div>
                  <span className="text-slate-500 uppercase tracking-wider text-[10px] font-mono">Subscription Tier</span>
                  <p className="text-sky-400 font-mono font-semibold uppercase">{selectedUser.tier}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <span className="text-slate-500 uppercase tracking-wider text-[10px] font-mono">Status</span>
                  <p className="text-emerald-400 font-mono uppercase">{selectedUser.status}</p>
                </div>
                <div>
                  <span className="text-slate-500 uppercase tracking-wider text-[10px] font-mono">PCB Detections Run</span>
                  <p className="text-white font-mono font-bold">{selectedUser.scansCount} scans</p>
                </div>
              </div>

              <div>
                <span className="text-slate-500 uppercase tracking-wider text-[10px] font-mono">Department & Title</span>
                <p className="text-slate-300">{selectedUser.title} — {selectedUser.department}</p>
              </div>

              <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-[11px] text-slate-400">
                Notice: Account modification actions are disabled in this prototype environment. All attributes reflect client fixtures.
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedUser(null)}
                className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
