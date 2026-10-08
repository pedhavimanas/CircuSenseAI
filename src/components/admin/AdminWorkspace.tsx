import React, { useState } from 'react';
import { AdminTab } from '../../types/admin';
import { AdminNavbar } from './AdminNavbar';
import { AdminSidebar } from './AdminSidebar';
import { AdminOverviewView } from './tabs/AdminOverviewView';
import { AdminUsersView } from './tabs/AdminUsersView';
import { AdminFinanceView } from './tabs/AdminFinanceView';
import { AdminUsageView } from './tabs/AdminUsageView';
import { AdminSystemView } from './tabs/AdminSystemView';
import { AdminSettingsView } from './tabs/AdminSettingsView';

interface AdminWorkspaceProps {
  onSwitchToUserPortal: () => void;
}

export const AdminWorkspace: React.FC<AdminWorkspaceProps> = ({
  onSwitchToUserPortal
}) => {
  const [currentTab, setCurrentTab] = useState<AdminTab>('overview');
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState<boolean>(false);

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
            {currentTab === 'overview' && (
              <AdminOverviewView 
                onNavigateTab={setCurrentTab}
                onSwitchToUserPortal={onSwitchToUserPortal}
              />
            )}

            {currentTab === 'users' && (
              <AdminUsersView />
            )}

            {currentTab === 'finance' && (
              <AdminFinanceView />
            )}

            {currentTab === 'usage' && (
              <AdminUsageView />
            )}

            {currentTab === 'system' && (
              <AdminSystemView />
            )}

            {currentTab === 'settings' && (
              <AdminSettingsView />
            )}
          </div>
        </main>
      </div>
    </div>
  );
};
