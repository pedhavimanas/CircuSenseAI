import React from 'react';
import { NavigationTab } from '../types';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, 
  FolderKanban, 
  Scan, 
  Cpu, 
  AlertTriangle, 
  BookOpen, 
  Sparkles, 
  Sliders,
  ChevronLeft,
  ChevronRight,
  ShieldAlert,
  LogOut
} from 'lucide-react';

interface SidebarProps {
  currentTab: NavigationTab;
  onNavigate: (tab: NavigationTab) => void;
  warningsCount: number;
  collapsed: boolean;
  onToggleCollapse: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onNavigate,
  warningsCount,
  collapsed,
  onToggleCollapse
}) => {
  const { user, logout } = useAuth();
  const primaryItems: { id: NavigationTab; label: string; icon: React.ElementType; badge?: number }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'projects', label: 'My Projects', icon: FolderKanban },
    { id: 'analyzer', label: 'PCB Analyzer', icon: Scan },
    { id: 'components', label: 'Components', icon: Cpu },
  ];

  const diagnosticItems: { id: NavigationTab; label: string; icon: React.ElementType; badge?: number; badgeType?: 'warning' }[] = [
    { 
      id: 'faults', 
      label: 'Fault Analysis', 
      icon: AlertTriangle, 
      badge: warningsCount > 0 ? warningsCount : undefined,
      badgeType: 'warning'
    },
    { id: 'datasheets', label: 'Datasheets', icon: BookOpen },
    { id: 'assistant', label: 'AI Assistant', icon: Sparkles },
    { id: 'settings', label: 'Settings', icon: Sliders },
  ];

  const renderItem = (item: { id: NavigationTab; label: string; icon: React.ElementType; badge?: number }) => {
    const Icon = item.icon;
    const isActive = currentTab === item.id;

    return (
      <button
        key={item.id}
        onClick={() => onNavigate(item.id)}
        className={`w-full flex items-center gap-3 px-4 py-2.5 text-xs font-medium transition-colors group relative cursor-pointer ${
          isActive
            ? 'bg-[#00D1FF10] text-[#00D1FF] border-r-2 border-[#00D1FF]'
            : 'text-slate-400 hover:text-slate-200 hover:bg-[#1A1E25]/50 border-r-2 border-transparent'
        } ${collapsed ? 'justify-center px-0' : ''}`}
        title={item.label}
      >
        <Icon
          size={17}
          className={`shrink-0 transition-colors ${
            isActive ? 'text-[#00D1FF]' : 'text-slate-400 group-hover:text-slate-200'
          }`}
        />

        {!collapsed && (
          <span className="truncate flex-1 text-left">
            {item.label}
          </span>
        )}

        {/* Warning badge */}
        {item.badge && (
          <span
            className={`inline-flex items-center justify-center font-mono font-bold text-[10px] rounded-full shrink-0 ${
              collapsed
                ? 'absolute top-1.5 right-1.5 w-4 h-4 bg-amber-500 text-[#0A0C0E] shadow'
                : 'px-2 py-0.5 bg-amber-500/20 text-amber-300 border border-amber-500/40'
            }`}
          >
            {item.badge}
          </span>
        )}
      </button>
    );
  };

  return (
    <aside
      className={`bg-[#12151A] border-r border-slate-800 hidden lg:flex flex-col justify-between transition-all duration-300 z-30 shrink-0 select-none ${
        collapsed ? 'w-16' : 'w-60'
      }`}
    >
      {/* Navigation List */}
      <nav className="flex-1 py-4 overflow-y-auto">
        <div className={`px-4 py-2 text-[10px] uppercase tracking-widest text-slate-500 font-semibold ${collapsed ? 'text-center' : ''}`}>
          {collapsed ? 'PRI' : 'Primary'}
        </div>
        <div className="space-y-0.5">
          {primaryItems.map(renderItem)}
        </div>

        <div className={`px-4 mt-6 py-2 text-[10px] uppercase tracking-widest text-slate-500 font-semibold ${collapsed ? 'text-center' : ''}`}>
          {collapsed ? 'DIAG' : 'Diagnostics'}
        </div>
        <div className="space-y-0.5">
          {diagnosticItems.map(renderItem)}
        </div>
      </nav>

      {/* Footer status, User Info & Collapse Toggle */}
      <div className="p-3 bg-[#0E1116] border-t border-slate-800 space-y-2.5">
        {!collapsed && user && (
          <div className="p-2 rounded-lg bg-[#12151A] border border-slate-800/80 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-6 h-6 rounded-full bg-[#00D1FF20] text-[#00D1FF] flex items-center justify-center font-bold text-[10px] shrink-0">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0">
                <div className="text-xs font-semibold text-slate-200 truncate" title={user.name}>
                  {user.name}
                </div>
                <div className="text-[10px] text-slate-500 truncate" title={user.email}>
                  {user.email}
                </div>
              </div>
            </div>

            <button
              onClick={logout}
              id="sidebar-logout-btn"
              className="p-1.5 rounded-md text-slate-400 hover:text-rose-400 hover:bg-[#1A1E25] transition-colors shrink-0 cursor-pointer"
              title="Sign Out of Session"
              aria-label="Sign Out"
            >
              <LogOut size={14} />
            </button>
          </div>
        )}

        {collapsed && (
          <button
            onClick={logout}
            id="sidebar-logout-collapsed-btn"
            className="w-full flex items-center justify-center p-2 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-[#1A1E25] transition-colors cursor-pointer"
            title="Sign Out of Session"
            aria-label="Sign Out"
          >
            <LogOut size={16} />
          </button>
        )}

        {!collapsed && (
          <div className="flex items-center gap-2 px-1">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]"></div>
            <span className="text-[11px] font-medium text-slate-400">System Optimized</span>
          </div>
        )}

        <button
          onClick={onToggleCollapse}
          className="w-full flex items-center justify-center gap-2 p-2 rounded-lg bg-[#1A1E25] hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition-colors text-xs cursor-pointer"
          title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          {collapsed ? <ChevronRight size={16} /> : (
            <>
              <ChevronLeft size={16} />
              <span className="text-xs font-medium">Collapse</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
};
