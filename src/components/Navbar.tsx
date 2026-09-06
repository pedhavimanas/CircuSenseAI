import React from 'react';
import { PCBBoard, NavigationTab } from '../types';
import { useAuth } from '../context/AuthContext';
import { HamburgerButton } from './HamburgerButton';
import { ThemeToggle } from './ThemeToggle';
import { 
  Cpu, 
  UploadCloud, 
  ShieldCheck, 
  Sliders,
  LogOut,
  User
} from 'lucide-react';

interface NavbarProps {
  activeBoard: PCBBoard;
  availableBoards: PCBBoard[];
  onSelectBoard: (board: PCBBoard) => void;
  currentTab: NavigationTab;
  onNavigate: (tab: NavigationTab) => void;
  onOpenUpload: () => void;
  onOpenAccuracyGuide: () => void;
  onHamburgerClick: () => void;
  sidebarCollapsed: boolean;
  isMobileDrawerOpen?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeBoard,
  availableBoards,
  onSelectBoard,
  currentTab,
  onNavigate,
  onOpenUpload,
  onOpenAccuracyGuide,
  onHamburgerClick,
  sidebarCollapsed,
  isMobileDrawerOpen = false
}) => {
  const { user, logout } = useAuth();
  return (
    <header className="h-16 bg-[#12151A] border-b border-slate-800 px-3 sm:px-6 flex items-center justify-between sticky top-0 z-40">
      {/* Brand & Left Navigation Control */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Hamburger Menu Icon for Desktop Collapse & Mobile Drawer */}
        <HamburgerButton
          onClick={onHamburgerClick}
          isOpen={isMobileDrawerOpen}
          title="Toggle Navigation Menu"
        />

        {/* Brand Logo & Name */}
        <button
          onClick={() => onNavigate('dashboard')}
          className="flex items-center gap-2.5 text-left group cursor-pointer"
        >
          <div className="w-8 h-8 bg-[#00D1FF] rounded flex items-center justify-center text-[#0A0C0E] shadow-md shadow-[#00D1FF20] group-hover:scale-105 transition-transform shrink-0">
            <Cpu className="text-[#0A0C0E] stroke-[2.5]" size={18} />
          </div>
          <div className="hidden xs:block">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-base sm:text-lg tracking-tight text-white">
                CircuSense AI
              </span>
            </div>
          </div>
        </button>

        <div className="h-5 w-px bg-slate-800 mx-1 sm:mx-2 hidden md:block" />

        {/* Active Board Switcher */}
        <div className="relative hidden md:flex items-center">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#1A1E25] border border-slate-700/60 text-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span className="text-slate-400">Context:</span>
            <select
              value={activeBoard.id}
              onChange={(e) => {
                const selected = availableBoards.find(b => b.id === e.target.value);
                if (selected) onSelectBoard(selected);
              }}
              className="bg-transparent text-slate-200 font-mono text-xs font-medium focus:outline-none cursor-pointer pr-3"
            >
              {availableBoards.map(board => (
                <option key={board.id} value={board.id} className="bg-[#12151A] text-white">
                  {board.name} ({board.boardCode})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Right Actions Toolbar */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Status Pill */}
        <div className="hidden xl:flex items-center gap-2 px-3 py-1 bg-[#1A1E25] border border-slate-700/60 rounded-full text-xs font-medium text-slate-300">
          <div className={`w-2 h-2 rounded-full ${activeBoard.metrics.warningsCount > 0 ? 'bg-amber-500' : 'bg-emerald-400'}`}></div>
          <span>{activeBoard.metrics.warningsCount > 0 ? `${activeBoard.metrics.warningsCount} Active Issues` : 'System Verified'}</span>
        </div>

        {/* Accuracy UX Framework trigger */}
        <button
          onClick={onOpenAccuracyGuide}
          className="hidden sm:flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg bg-[#1A1E25] hover:bg-slate-800 text-slate-300 hover:text-[#00D1FF] text-xs font-medium border border-slate-800 transition-colors cursor-pointer"
          title="Understanding CircuSense Accuracy UX and Optical Limits"
        >
          <ShieldCheck size={14} className="text-[#00D1FF]" />
          <span className="hidden md:inline">Accuracy UX</span>
        </button>

        {/* Dark / Light Mode Toggle */}
        <ThemeToggle />

        {/* Quick Upload CTA */}
        <button
          onClick={onOpenUpload}
          className="flex items-center gap-1.5 px-3 sm:px-4 py-1.5 bg-[#00D1FF] hover:bg-[#00B8E0] text-[#0A0C0E] text-xs font-bold rounded-lg shadow-lg shadow-[#00D1FF20] transition-all cursor-pointer"
        >
          <UploadCloud size={15} />
          <span className="hidden sm:inline">Upload PCB</span>
          <span className="sm:hidden">Upload</span>
        </button>

        {/* Settings button */}
        <button
          onClick={() => onNavigate('settings')}
          className={`p-2 rounded-lg border transition-colors cursor-pointer ${
            currentTab === 'settings'
              ? 'bg-[#1A1E25] border-slate-700 text-[#00D1FF]'
              : 'bg-[#1A1E25] border-slate-800 text-slate-400 hover:text-white'
          }`}
          title="Platform Settings & API Configurations"
        >
          <Sliders size={16} />
        </button>

        {/* User Badge */}
        {user && (
          <div className="hidden lg:flex items-center gap-2 pl-1.5 pr-2.5 py-1 rounded-lg bg-[#1A1E25] border border-slate-800 text-xs">
            <div className="w-5 h-5 rounded-full bg-[#00D1FF20] text-[#00D1FF] flex items-center justify-center font-bold text-[10px]">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <span className="text-slate-300 font-medium max-w-[90px] truncate" title={`${user.name} (${user.email})`}>
              {user.name}
            </span>
          </div>
        )}

        {/* Sign Out / Logout */}
        <button
          onClick={logout}
          id="btn-navbar-logout"
          className="p-2 rounded-lg bg-[#1A1E25] border border-slate-800 text-slate-400 hover:text-rose-400 hover:border-rose-500/40 transition-colors cursor-pointer"
          title="Sign Out of Workspace"
          aria-label="Sign Out of Workspace"
        >
          <LogOut size={16} />
        </button>
      </div>
    </header>
  );
};
