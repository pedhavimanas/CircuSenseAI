import React, { useEffect } from 'react';
import { NavigationTab, PCBBoard } from '../types';
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
  X,
  ShieldCheck,
  UploadCloud,
  LogOut
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface MobileNavDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  currentTab: NavigationTab;
  onNavigate: (tab: NavigationTab) => void;
  warningsCount: number;
  activeBoard: PCBBoard;
  availableBoards: PCBBoard[];
  onSelectBoard: (board: PCBBoard) => void;
  onOpenUpload?: () => void;
  onOpenAccuracyGuide?: () => void;
}

export const MobileNavDrawer: React.FC<MobileNavDrawerProps> = ({
  isOpen,
  onClose,
  currentTab,
  onNavigate,
  warningsCount,
  activeBoard,
  availableBoards,
  onSelectBoard,
  onOpenUpload,
  onOpenAccuracyGuide
}) => {
  const { user, logout } = useAuth();
  // Close drawer on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleItemClick = (tab: NavigationTab) => {
    onNavigate(tab);
    onClose();
  };

  const primaryItems: { id: NavigationTab; label: string; icon: React.ElementType }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'projects', label: 'My Projects', icon: FolderKanban },
    { id: 'analyzer', label: 'PCB Analyzer', icon: Scan },
    { id: 'components', label: 'Components', icon: Cpu },
  ];

  const diagnosticItems: { id: NavigationTab; label: string; icon: React.ElementType; badge?: number }[] = [
    { 
      id: 'faults', 
      label: 'Fault Analysis', 
      icon: AlertTriangle, 
      badge: warningsCount > 0 ? warningsCount : undefined
    },
    { id: 'datasheets', label: 'Datasheets', icon: BookOpen },
    { id: 'assistant', label: 'AI Assistant', icon: Sparkles },
    { id: 'settings', label: 'Settings', icon: Sliders },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex" id="mobile-navigation-drawer-root">
          {/* Backdrop overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            aria-hidden="true"
          />

          {/* Slide-in Drawer container */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'tween', duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-72 max-w-[85vw] h-full bg-[#12151A] border-r border-slate-800 flex flex-col justify-between shadow-2xl z-10"
            role="dialog"
            aria-modal="true"
            aria-label="Navigation Menu"
          >
            {/* Drawer Header */}
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 bg-[#00D1FF] rounded flex items-center justify-center text-[#0A0C0E] shadow-sm">
                  <Cpu className="text-[#0A0C0E] stroke-[2.5]" size={18} />
                </div>
                <div>
                  <span className="font-bold text-base tracking-tight text-white">
                    CircuSense AI
                  </span>
                  <div className="text-[10px] text-slate-400 font-mono">
                    PCB Intelligence
                  </div>
                </div>
              </div>

              <button
                onClick={onClose}
                type="button"
                id="close-mobile-drawer-btn"
                aria-label="Close navigation menu"
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#1A1E25] transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Active Board Switcher in mobile drawer */}
            <div className="p-3 bg-[#0A0C0E] border-b border-slate-800">
              <label className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold block mb-1.5">
                Active PCB Context
              </label>
              <select
                value={activeBoard.id}
                onChange={(e) => {
                  const selected = availableBoards.find(b => b.id === e.target.value);
                  if (selected) {
                    onSelectBoard(selected);
                  }
                }}
                className="w-full px-2.5 py-1.5 rounded-lg bg-[#1A1E25] border border-slate-700/60 text-slate-200 font-mono text-xs focus:outline-none focus:border-[#00D1FF]"
              >
                {availableBoards.map(board => (
                  <option key={board.id} value={board.id} className="bg-[#12151A] text-white">
                    {board.name} ({board.boardCode})
                  </option>
                ))}
              </select>
            </div>

            {/* Navigation items list */}
            <div className="flex-1 overflow-y-auto py-3 px-2 space-y-4">
              <div>
                <div className="px-3 py-1 text-[10px] uppercase tracking-widest text-slate-500 font-semibold">
                  Primary
                </div>
                <nav className="space-y-1 mt-1">
                  {primaryItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = currentTab === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => handleItemClick(item.id)}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-colors text-left cursor-pointer ${
                          isActive
                            ? 'bg-[#00D1FF15] text-[#00D1FF] font-semibold'
                            : 'text-slate-400 hover:text-slate-100 hover:bg-[#1A1E25]'
                        }`}
                      >
                        <Icon size={18} className={isActive ? 'text-[#00D1FF]' : 'text-slate-400'} />
                        <span className="flex-1">{item.label}</span>
                      </button>
                    );
                  })}
                </nav>
              </div>

              <div>
                <div className="px-3 py-1 text-[10px] uppercase tracking-widest text-slate-500 font-semibold">
                  Diagnostics
                </div>
                <nav className="space-y-1 mt-1">
                  {diagnosticItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = currentTab === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => handleItemClick(item.id)}
                        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-colors text-left cursor-pointer ${
                          isActive
                            ? 'bg-[#00D1FF15] text-[#00D1FF] font-semibold'
                            : 'text-slate-400 hover:text-slate-100 hover:bg-[#1A1E25]'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <Icon size={18} className={isActive ? 'text-[#00D1FF]' : 'text-slate-400'} />
                          <span>{item.label}</span>
                        </div>
                        {item.badge && (
                          <span className="px-1.5 py-0.5 text-[10px] font-mono font-bold rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">
                            {item.badge}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </nav>
              </div>

              {/* Quick Actions in Mobile Drawer */}
              {(onOpenUpload || onOpenAccuracyGuide) && (
                <div className="pt-2 border-t border-slate-800/80 px-1 space-y-2">
                  {onOpenUpload && (
                    <button
                      onClick={() => {
                        onClose();
                        onOpenUpload();
                      }}
                      className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-[#00D1FF] hover:bg-[#00B8E0] text-[#0A0C0E] text-xs font-bold rounded-lg shadow-sm transition-all"
                    >
                      <UploadCloud size={15} />
                      <span>Upload PCB</span>
                    </button>
                  )}

                  {onOpenAccuracyGuide && (
                    <button
                      onClick={() => {
                        onClose();
                        onOpenAccuracyGuide();
                      }}
                      className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-[#1A1E25] hover:bg-slate-800 text-slate-300 text-xs font-medium border border-slate-800 transition-colors"
                    >
                      <ShieldCheck size={15} className="text-[#00D1FF]" />
                      <span>Accuracy UX Guide</span>
                    </button>
                  )}

                  {/* Sign Out Action in Mobile Drawer */}
                  <button
                    onClick={() => {
                      onClose();
                      logout();
                    }}
                    id="mobile-drawer-logout-btn"
                    className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-[#1A1E25] hover:bg-rose-950/40 text-slate-300 hover:text-rose-400 text-xs font-medium border border-slate-800 hover:border-rose-500/40 transition-colors"
                  >
                    <LogOut size={15} />
                    <span>Sign Out {user ? `(${user.name})` : ''}</span>
                  </button>
                </div>
              )}
            </div>

            {/* Drawer Footer */}
            <div className="p-3.5 bg-[#0E1116] border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${warningsCount > 0 ? 'bg-amber-400' : 'bg-emerald-400'}`} />
                <span className="text-[11px] font-medium">
                  {warningsCount > 0 ? `${warningsCount} Active Issues` : 'System Verified'}
                </span>
              </div>
              <span className="text-[10px] font-mono text-slate-500">v2.4 Pro</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
