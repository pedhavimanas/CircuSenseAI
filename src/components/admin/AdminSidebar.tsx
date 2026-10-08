import React, { useEffect } from 'react';
import { AdminTab } from '../../types/admin';
import { useAuth } from '../../context/AuthContext';
import { 
  LayoutDashboard, 
  Users, 
  DollarSign, 
  Activity, 
  Server, 
  Sliders, 
  ChevronLeft, 
  ChevronRight, 
  LogOut,
  ArrowRightLeft,
  X,
  ShieldAlert
} from 'lucide-react';

interface AdminSidebarProps {
  currentTab: AdminTab;
  onNavigate: (tab: AdminTab) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
  isMobileDrawerOpen: boolean;
  onCloseMobileDrawer: () => void;
  onSwitchToUserPortal: () => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  currentTab,
  onNavigate,
  collapsed,
  onToggleCollapse,
  isMobileDrawerOpen,
  onCloseMobileDrawer,
  onSwitchToUserPortal
}) => {
  const { user, logout } = useAuth();

  // Close mobile drawer on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMobileDrawerOpen) {
        onCloseMobileDrawer();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isMobileDrawerOpen, onCloseMobileDrawer]);

  const navItems: { id: AdminTab; label: string; icon: React.ElementType; section: 'core' | 'operations' }[] = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard, section: 'core' },
    { id: 'users', label: 'Users', icon: Users, section: 'core' },
    { id: 'finance', label: 'Finance', icon: DollarSign, section: 'core' },
    { id: 'usage', label: 'Usage Analytics', icon: Activity, section: 'operations' },
    { id: 'system', label: 'System', icon: Server, section: 'operations' },
    { id: 'settings', label: 'Settings', icon: Sliders, section: 'operations' },
  ];

  const renderNavItem = (
    item: { id: AdminTab; label: string; icon: React.ElementType },
    isCollapsed: boolean,
    onSelect: (tab: AdminTab) => void
  ) => {
    const Icon = item.icon;
    const isActive = currentTab === item.id;

    return (
      <button
        key={item.id}
        onClick={() => onSelect(item.id)}
        id={`admin-nav-${item.id}`}
        className={`w-full flex items-center gap-3 px-3.5 py-2.5 text-xs font-medium transition-all group relative cursor-pointer rounded-lg ${
          isActive
            ? 'bg-amber-500/15 text-amber-300 font-semibold border border-amber-500/30 shadow-xs'
            : 'text-slate-400 hover:text-slate-200 hover:bg-[#161B22]/70 border border-transparent'
        } ${isCollapsed ? 'justify-center px-0' : ''}`}
        title={item.label}
      >
        <Icon
          size={17}
          className={`shrink-0 transition-colors ${
            isActive ? 'text-amber-400' : 'text-slate-400 group-hover:text-slate-200'
          }`}
        />

        {!isCollapsed && (
          <span className="truncate flex-1 text-left">
            {item.label}
          </span>
        )}

        {isActive && !isCollapsed && (
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0 shadow-[0_0_8px_rgba(251,191,36,0.6)]" />
        )}
      </button>
    );
  };

  return (
    <>
      {/* ======================================================== */}
      {/* DESKTOP PERSISTENT SIDEBAR                              */}
      {/* ======================================================== */}
      <aside
        className={`bg-[#0E1217] border-r border-slate-800/80 hidden lg:flex flex-col justify-between transition-all duration-300 z-30 shrink-0 select-none ${
          collapsed ? 'w-16' : 'w-60'
        }`}
      >
        {/* Navigation List */}
        <nav className="flex-1 py-4 px-2 space-y-4 overflow-y-auto">
          {/* Core Management */}
          <div>
            <div className={`px-2 py-1.5 text-[10px] uppercase tracking-widest text-slate-500 font-bold ${collapsed ? 'text-center' : ''}`}>
              {collapsed ? 'ADM' : 'Control Center'}
            </div>
            <div className="space-y-1 mt-1">
              {navItems.filter(i => i.section === 'core').map(item => 
                renderNavItem(item, collapsed, onNavigate)
              )}
            </div>
          </div>

          {/* Telemetry & System */}
          <div>
            <div className={`px-2 py-1.5 text-[10px] uppercase tracking-widest text-slate-500 font-bold ${collapsed ? 'text-center' : ''}`}>
              {collapsed ? 'SYS' : 'Telemetry & Ops'}
            </div>
            <div className="space-y-1 mt-1">
              {navItems.filter(i => i.section === 'operations').map(item => 
                renderNavItem(item, collapsed, onNavigate)
              )}
            </div>
          </div>
        </nav>

        {/* Footer: User profile, User Portal Link & Collapse Toggle */}
        <div className="p-2.5 bg-[#0A0D12] border-t border-slate-800/80 space-y-2">
          {!collapsed && user && (
            <div className="p-2 rounded-lg bg-[#12161F] border border-slate-800/80 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center justify-center font-bold text-[10px] shrink-0">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-semibold text-slate-200 truncate" title={user.name}>
                    {user.name}
                  </div>
                  <div className="text-[10px] text-amber-400/80 font-mono truncate">
                    role: admin
                  </div>
                </div>
              </div>

              <button
                onClick={logout}
                id="sidebar-admin-logout-btn"
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
              id="sidebar-admin-logout-collapsed-btn"
              className="w-full flex items-center justify-center p-2 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-[#1A1E25] transition-colors cursor-pointer"
              title="Sign Out of Session"
              aria-label="Sign Out"
            >
              <LogOut size={16} />
            </button>
          )}

          {/* Quick Switch to User Portal */}
          {!collapsed && (
            <button
              onClick={onSwitchToUserPortal}
              id="sidebar-switch-to-user-portal"
              className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-[#161B22] hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 text-xs font-medium transition-colors cursor-pointer"
              title="Switch to User PCB Workspace"
            >
              <ArrowRightLeft size={13} className="text-amber-400" />
              <span>User PCB Portal</span>
            </button>
          )}

          {/* Collapse Toggle */}
          <button
            onClick={onToggleCollapse}
            id="sidebar-collapse-toggle"
            className="w-full flex items-center justify-center gap-2 p-2 rounded-lg bg-[#161B22] hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition-colors text-xs cursor-pointer"
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

      {/* ======================================================== */}
      {/* MOBILE / TABLET OVERLAY DRAWER                           */}
      {/* ======================================================== */}
      {isMobileDrawerOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          {/* Backdrop */}
          <div 
            onClick={onCloseMobileDrawer}
            className="fixed inset-0 bg-black/75 backdrop-blur-xs transition-opacity"
            aria-hidden="true"
          />

          {/* Slide-out drawer */}
          <div className="relative w-72 max-w-[85vw] bg-[#0E1217] border-r border-slate-800 flex flex-col h-full z-10 shadow-2xl">
            {/* Drawer Header */}
            <div className="h-16 px-4 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldAlert size={18} className="text-amber-400" />
                <span className="font-bold text-sm tracking-tight text-white">
                  Admin Navigation
                </span>
              </div>
              <button
                onClick={onCloseMobileDrawer}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
                aria-label="Close Admin Navigation"
              >
                <X size={18} />
              </button>
            </div>

            {/* Drawer Nav Items */}
            <div className="flex-1 py-4 px-3 space-y-4 overflow-y-auto">
              <div>
                <div className="px-2 py-1 text-[10px] uppercase tracking-widest text-slate-500 font-bold">
                  Control Center
                </div>
                <div className="space-y-1 mt-1">
                  {navItems.filter(i => i.section === 'core').map(item => 
                    renderNavItem(item, false, (tab) => {
                      onNavigate(tab);
                      onCloseMobileDrawer();
                    })
                  )}
                </div>
              </div>

              <div>
                <div className="px-2 py-1 text-[10px] uppercase tracking-widest text-slate-500 font-bold">
                  Telemetry & Ops
                </div>
                <div className="space-y-1 mt-1">
                  {navItems.filter(i => i.section === 'operations').map(item => 
                    renderNavItem(item, false, (tab) => {
                      onNavigate(tab);
                      onCloseMobileDrawer();
                    })
                  )}
                </div>
              </div>
            </div>

            {/* Drawer Footer */}
            <div className="p-3 border-t border-slate-800 bg-[#0A0D12] space-y-2">
              <button
                onClick={() => {
                  onCloseMobileDrawer();
                  onSwitchToUserPortal();
                }}
                className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-[#161B22] hover:bg-slate-800 text-slate-200 border border-slate-700 text-xs font-semibold cursor-pointer"
              >
                <ArrowRightLeft size={14} className="text-amber-400" />
                <span>Switch to User Portal</span>
              </button>

              <button
                onClick={logout}
                className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-semibold cursor-pointer"
              >
                <LogOut size={14} />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
