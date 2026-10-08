import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { HamburgerButton } from '../HamburgerButton';
import { ThemeToggle } from '../ThemeToggle';
import { 
  ShieldCheck, 
  ArrowRightLeft, 
  LogOut, 
  Activity
} from 'lucide-react';

interface AdminNavbarProps {
  onSwitchToUserPortal: () => void;
  onHamburgerClick: () => void;
  isMobileDrawerOpen: boolean;
  sidebarCollapsed: boolean;
}

export const AdminNavbar: React.FC<AdminNavbarProps> = ({
  onSwitchToUserPortal,
  onHamburgerClick,
  isMobileDrawerOpen
}) => {
  const { user, logout } = useAuth();

  return (
    <header className="h-16 bg-[#0E1217] border-b border-slate-800/80 px-3 sm:px-6 flex items-center justify-between sticky top-0 z-40 select-none">
      {/* Brand & Left Navigation Control */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Hamburger Menu Icon for Mobile Drawer */}
        <div className="lg:hidden">
          <HamburgerButton
            onClick={onHamburgerClick}
            isOpen={isMobileDrawerOpen}
            title="Toggle Admin Navigation Menu"
          />
        </div>

        {/* Brand Logo & Admin Indicator */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center text-[#0A0C0E] shadow-md shadow-amber-500/20 shrink-0">
            <ShieldCheck className="text-[#0A0C0E] stroke-[2.5]" size={18} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-base sm:text-lg tracking-tight text-white">
                CircuSense AI
              </span>
              <span 
                id="badge-admin-portal"
                className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider bg-amber-500/15 text-amber-300 border border-amber-500/35"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>
                ADMIN PORTAL
              </span>
            </div>
          </div>
        </div>

        <div className="h-5 w-px bg-slate-800 mx-2 hidden xl:block" />

        {/* System Telemetry Placeholder Indicator */}
        <div className="hidden xl:flex items-center gap-2 px-3 py-1 bg-[#161B22] border border-slate-800 rounded-full text-xs font-medium text-slate-300">
          <Activity size={12} className="text-emerald-400 animate-pulse" />
          <span className="text-slate-400">Core Telemetry:</span>
          <span className="font-mono text-emerald-400 font-semibold">FastAPI Connected</span>
        </div>
      </div>

      {/* Right Actions Toolbar */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Switch to User Portal CTA */}
        <button
          onClick={onSwitchToUserPortal}
          id="btn-switch-to-user-portal"
          className="flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 rounded-lg bg-slate-800/90 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-semibold border border-slate-700/80 transition-all cursor-pointer shadow-xs active:scale-[0.98]"
          title="Switch to User PCB Inspection Workspace"
        >
          <ArrowRightLeft size={14} className="text-amber-400" />
          <span className="hidden sm:inline">Switch to User Portal</span>
          <span className="sm:hidden">User Portal</span>
        </button>

        {/* Dark / Light Mode Toggle */}
        <ThemeToggle />

        {/* Admin Identity Badge */}
        {user && (
          <div className="hidden md:flex items-center gap-2 pl-2 pr-3 py-1 rounded-lg bg-[#161B22] border border-slate-800 text-xs">
            <div className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center justify-center font-bold text-[10px] shrink-0">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex flex-col text-left leading-tight">
              <span className="text-slate-200 font-semibold truncate max-w-[110px]" title={`${user.name} (${user.email})`}>
                {user.name}
              </span>
              <span className="text-[10px] text-amber-400 font-mono">
                Administrator
              </span>
            </div>
          </div>
        )}

        {/* Sign Out / Logout */}
        <button
          onClick={logout}
          id="btn-admin-navbar-logout"
          className="p-2 rounded-lg bg-[#161B22] border border-slate-800 text-slate-400 hover:text-rose-400 hover:border-rose-500/40 transition-colors cursor-pointer"
          title="Sign Out of Admin Console"
          aria-label="Sign Out of Admin Console"
        >
          <LogOut size={16} />
        </button>
      </div>
    </header>
  );
};
