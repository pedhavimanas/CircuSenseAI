import React, { useState, useEffect } from 'react';
import { PCBBoard, PCBComponent, NavigationTab, ProjectRecord } from './types';
import { MOCK_BOARDS, DATASHEETS, INITIAL_PROJECTS } from './data/mockBoards';
import { pcbApi } from './services/pcbApi';
import { DetectionOptions } from './services/detectionApi';

// Auth and Themes
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { AuthPage } from './components/auth/AuthPage';

// Layout, Navigation & Modals
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { MobileNavDrawer } from './components/MobileNavDrawer';
import { UploadModal } from './components/UploadModal';
import { SaveProjectModal } from './components/SaveProjectModal';
import { AccuracyUXModal } from './components/AccuracyUXModal';

// Pages
import { Dashboard } from './pages/Dashboard';
import { Analyzer } from './pages/Analyzer';
import { Results } from './pages/Results';
import { ComponentsPage } from './pages/ComponentsPage';
import { FaultAnalysisPage } from './pages/FaultAnalysisPage';
import { DatasheetsPage } from './pages/DatasheetsPage';
import { AIAssistantPage } from './pages/AIAssistantPage';
import { MyProjectsPage } from './pages/MyProjectsPage';
import { SettingsPage } from './pages/SettingsPage';
import { AdminWorkspace } from './components/admin/AdminWorkspace';

function CircuSenseWorkspace() {
  const { isAuthenticated, isLoading } = useAuth();

  // Boards and Active Context
  const [availableBoards, setAvailableBoards] = useState<PCBBoard[]>(MOCK_BOARDS);
  const [activeBoard, setActiveBoard] = useState<PCBBoard>(MOCK_BOARDS[0]);
  const [selectedComponent, setSelectedComponent] = useState<PCBComponent>(MOCK_BOARDS[0].components[0]);

  // Navigation State
  const [currentTab, setCurrentTab] = useState<NavigationTab>('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState<boolean>(false);

  // Modals
  const [isUploadModalOpen, setIsUploadModalOpen] = useState<boolean>(false);
  const [isSaveModalOpen, setIsSaveModalOpen] = useState<boolean>(false);
  const [isAccuracyModalOpen, setIsAccuracyModalOpen] = useState<boolean>(false);

  // Datasheet link parameter
  const [activeDatasheetId, setActiveDatasheetId] = useState<string | undefined>('ds-lm7805');

  // Saved Projects List (persisted in localStorage)
  const [projects, setProjects] = useState<ProjectRecord[]>(() => {
    const local = localStorage.getItem('circusense_projects');
    if (local) {
      try {
        return JSON.parse(local);
      } catch (e) {
        return INITIAL_PROJECTS;
      }
    }
    return INITIAL_PROJECTS;
  });

  useEffect(() => {
    localStorage.setItem('circusense_projects', JSON.stringify(projects));
  }, [projects]);

  // When active board changes, update selected component to first component
  useEffect(() => {
    if (activeBoard.components.length > 0) {
      setSelectedComponent(activeBoard.components[0]);
    }
  }, [activeBoard]);

  // If loading auth session
  if (isLoading) {
    return (
      <div className="min-h-screen w-full bg-[#F8FAFC] dark:bg-[#07090F] flex flex-col items-center justify-center text-slate-700 dark:text-slate-300">
        <div className="w-8 h-8 rounded-full border-2 border-sky-500 dark:border-[#00D1FF] border-t-transparent animate-spin mb-3"></div>
        <p className="text-xs font-mono text-slate-500 dark:text-slate-400">Authenticating CircuSense AI Session...</p>
      </div>
    );
  }

  // If user is not authenticated, show Authentication Page first
  if (!isAuthenticated) {
    return <AuthPage initialMode="login" />;
  }

  // Real analysis handler (uploads File to FastAPI YOLO service)
  const handleAnalyzePCB = async (fileOrBoard?: File | PCBBoard, options?: DetectionOptions) => {
    if (fileOrBoard instanceof File) {
      const objectUrl = URL.createObjectURL(fileOrBoard);
      const tempBoard: PCBBoard = {
        id: `upload-${Date.now()}`,
        name: fileOrBoard.name,
        boardCode: 'LIVE-YOLO-SCAN',
        layerCount: 2,
        dimensions: 'Detecting...',
        thumbnailColor: '#00D1FF',
        uploadedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
        presetType: 'custom_uploaded',
        sourceType: 'live_upload',
        isDemoData: false,
        scanSource: 'circusense_yolo',
        customImageBase64: objectUrl,
        components: [],
        metrics: {
          totalComponents: 0,
          icsCount: 0,
          resistorsCount: 0,
          capacitorsCount: 0,
          diodesCount: 0,
          otherCount: 0,
          warningsCount: 0,
          identifiedPercentage: 0,
          averageConfidence: 0,
          healthScore: 100
        }
      };

      setActiveBoard(tempBoard);
      setCurrentTab('analyzer');

      try {
        const realBoard = await pcbApi.executeRealAnalysis(fileOrBoard, options);
        setActiveBoard(realBoard);
        setAvailableBoards(prev => [realBoard, ...prev.filter(b => b.id !== realBoard.id)]);
        if (realBoard.components.length > 0) {
          setSelectedComponent(realBoard.components[0]);
        }
      } catch (err: any) {
        console.error('Real PCB YOLO Analysis failed:', err);
        setActiveBoard(prev => ({
          ...prev,
          apiError: err?.message || 'YOLO analysis failed. Please verify the detection service.'
        }));
      }
    } else if (fileOrBoard) {
      const board = fileOrBoard;
      setActiveBoard(board);
      if (!availableBoards.some(b => b.id === board.id)) {
        setAvailableBoards(prev => [board, ...prev]);
      }
      if (board.components.length > 0) {
        setSelectedComponent(board.components[0]);
      }
      setCurrentTab('analyzer');
    }
  };

  const handleOpenDatasheet = (datasheetId?: string, partName?: string) => {
    if (datasheetId) {
      setActiveDatasheetId(datasheetId);
    } else if (partName) {
      const match = DATASHEETS.find(d => 
        d.partNumber.toLowerCase().includes(partName.toLowerCase()) || 
        partName.toLowerCase().includes(d.partNumber.toLowerCase())
      );
      if (match) setActiveDatasheetId(match.id);
    }
    setCurrentTab('datasheets');
  };

  const handleAskAI = (component: PCBComponent, prompt?: string) => {
    setSelectedComponent(component);
    setCurrentTab('assistant');
  };

  const handleCheckIssues = (component: PCBComponent) => {
    setSelectedComponent(component);
    setCurrentTab('faults');
  };

  const handleSaveProject = (newProject: ProjectRecord) => {
    setProjects(prev => [newProject, ...prev.filter(p => p.id !== newProject.id)]);
  };

  const handleDeleteProject = (projectId: string) => {
    setProjects(prev => prev.filter(p => p.id !== projectId));
  };

  const handleOpenSavedProject = (project: ProjectRecord) => {
    if (project.board) {
      setActiveBoard(project.board);
      if (project.board.components.length > 0) {
        setSelectedComponent(project.board.components[0]);
      }
    }
    setCurrentTab('results');
  };

  const handleSaveMeasurement = (
    componentId: string,
    measurementId: string,
    measuredValue: string,
    status: 'passed' | 'marginal' | 'failed'
  ) => {
    // Update local board state with the verified measurement
    setActiveBoard(prevBoard => {
      const updatedComponents = prevBoard.components.map(comp => {
        if (comp.id === componentId && comp.fault) {
          const updatedSteps = comp.fault.verificationSteps.map(step => {
            if (step.id === measurementId) {
              return {
                ...step,
                measuredValue,
                status
              };
            }
            return step;
          });

          // Check if all steps passed
          const allPassed = updatedSteps.every(s => s.status === 'passed');

          return {
            ...comp,
            status: allPassed ? 'normal' : comp.status,
            fault: {
              ...comp.fault,
              verificationSteps: updatedSteps
            }
          };
        }
        return comp;
      });

      const updatedWarningsCount = updatedComponents.filter(c => c.status !== 'normal').length;

      return {
        ...prevBoard,
        components: updatedComponents,
        metrics: {
          ...prevBoard.metrics,
          warningsCount: updatedWarningsCount
        }
      };
    });
  };

  const handleHamburgerClick = () => {
    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
      setIsMobileDrawerOpen(prev => !prev);
    } else {
      setSidebarCollapsed(prev => !prev);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0C0E] text-slate-200 flex flex-col font-sans selection:bg-[#00D1FF] selection:text-[#0A0C0E]">
        {/* Top Application Navbar */}
        <Navbar
          activeBoard={activeBoard}
          availableBoards={availableBoards}
          onSelectBoard={(board) => {
            setActiveBoard(board);
            if (board.components.length > 0) {
              setSelectedComponent(board.components[0]);
            }
          }}
          currentTab={currentTab}
          onNavigate={setCurrentTab}
          onOpenUpload={() => setIsUploadModalOpen(true)}
          onOpenAccuracyGuide={() => setIsAccuracyModalOpen(true)}
          onHamburgerClick={handleHamburgerClick}
          sidebarCollapsed={sidebarCollapsed}
          isMobileDrawerOpen={isMobileDrawerOpen}
        />

        {/* Mobile / Tablet Navigation Drawer */}
        <MobileNavDrawer
          isOpen={isMobileDrawerOpen}
          onClose={() => setIsMobileDrawerOpen(false)}
          currentTab={currentTab}
          onNavigate={(tab) => {
            setCurrentTab(tab);
            setIsMobileDrawerOpen(false);
          }}
          warningsCount={activeBoard.metrics.warningsCount}
          activeBoard={activeBoard}
          availableBoards={availableBoards}
          onSelectBoard={(board) => {
            setActiveBoard(board);
            if (board.components.length > 0) {
              setSelectedComponent(board.components[0]);
            }
          }}
          onOpenUpload={() => {
            setIsMobileDrawerOpen(false);
            setIsUploadModalOpen(true);
          }}
          onOpenAccuracyGuide={() => {
            setIsMobileDrawerOpen(false);
            setIsAccuracyModalOpen(true);
          }}
        />

        {/* Main Workspace Frame */}
        <div className="flex-1 flex overflow-hidden">
          {/* Navigation Sidebar */}
          <Sidebar
            currentTab={currentTab}
            onNavigate={setCurrentTab}
            warningsCount={activeBoard.metrics.warningsCount}
            collapsed={sidebarCollapsed}
            onToggleCollapse={() => setSidebarCollapsed(prev => !prev)}
          />

          {/* Content Viewport */}
          <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-[#0A0C0E]">
            <div className="max-w-7xl mx-auto">
              {currentTab === 'dashboard' && (
                <Dashboard
                  onAnalyzePCB={handleAnalyzePCB}
                  onNavigateToProjects={() => setCurrentTab('projects')}
                  presetBoards={availableBoards}
                  recentProjects={projects}
                  onOpenProject={handleOpenSavedProject}
                />
              )}

              {currentTab === 'analyzer' && (
                <Analyzer
                  board={activeBoard}
                  onViewResults={() => setCurrentTab('results')}
                  onSelectComponent={(comp) => {
                    setSelectedComponent(comp);
                    setCurrentTab('results');
                  }}
                  onUpdateBoard={(updated) => setActiveBoard(updated)}
                />
              )}

              {currentTab === 'results' && (
                <Results
                  board={activeBoard}
                  selectedComponent={selectedComponent}
                  onSelectComponent={setSelectedComponent}
                  onOpenDatasheet={handleOpenDatasheet}
                  onAskAI={handleAskAI}
                  onCheckIssues={handleCheckIssues}
                  onSaveProject={() => setIsSaveModalOpen(true)}
                  onNavigateToFaults={() => setCurrentTab('faults')}
                />
              )}

              {currentTab === 'components' && (
                <ComponentsPage
                  board={activeBoard}
                  onSelectComponent={setSelectedComponent}
                  onOpenDatasheet={handleOpenDatasheet}
                  onAskAI={handleAskAI}
                  onNavigateToResults={() => setCurrentTab('results')}
                />
              )}

              {currentTab === 'faults' && (
                <FaultAnalysisPage
                  board={activeBoard}
                  onViewComponent={(ref) => {
                    const comp = activeBoard.components.find(c => c.id === ref);
                    if (comp) {
                      setSelectedComponent(comp);
                      setCurrentTab('results');
                    }
                  }}
                  onSaveMeasurement={handleSaveMeasurement}
                />
              )}

              {currentTab === 'datasheets' && (
                <DatasheetsPage
                  datasheets={DATASHEETS}
                  initialDatasheetId={activeDatasheetId}
                  activeBoard={activeBoard}
                />
              )}

              {currentTab === 'assistant' && (
                <AIAssistantPage
                  board={activeBoard}
                  selectedComponent={selectedComponent}
                  onOpenDatasheet={handleOpenDatasheet}
                  onNavigateToFaults={() => setCurrentTab('faults')}
                />
              )}

              {currentTab === 'projects' && (
                <MyProjectsPage
                  projects={projects}
                  onOpenProject={handleOpenSavedProject}
                  onDeleteProject={handleDeleteProject}
                  onNewScan={() => setIsUploadModalOpen(true)}
                />
              )}

              {currentTab === 'settings' && (
                <SettingsPage />
              )}
            </div>
          </main>
        </div>

        {/* Global Modals */}
        <UploadModal
          isOpen={isUploadModalOpen}
          onClose={() => setIsUploadModalOpen(false)}
          onUploadAndAnalyze={handleAnalyzePCB}
          presetBoards={availableBoards}
        />

        <SaveProjectModal
          board={activeBoard}
          isOpen={isSaveModalOpen}
          onClose={() => setIsSaveModalOpen(false)}
          onSave={handleSaveProject}
        />

        <AccuracyUXModal
          isOpen={isAccuracyModalOpen}
          onClose={() => setIsAccuracyModalOpen(false)}
        />
      </div>
  );
}

function AppContent() {
  const { isAuthenticated, isLoading, user } = useAuth();
  const [adminViewingUserPortal, setAdminViewingUserPortal] = useState<boolean>(false);

  // If user session changes or logs out, reset view state
  useEffect(() => {
    setAdminViewingUserPortal(false);
  }, [user?.id]);

  if (isLoading) {
    return (
      <div className="min-h-screen w-full bg-[#F8FAFC] dark:bg-[#07090F] flex flex-col items-center justify-center text-slate-700 dark:text-slate-300">
        <div className="w-8 h-8 rounded-full border-2 border-sky-500 dark:border-[#00D1FF] border-t-transparent animate-spin mb-3"></div>
        <p className="text-xs font-mono text-slate-500 dark:text-slate-400">Authenticating CircuSense AI Session...</p>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return <AuthPage initialMode="login" />;
  }

  // Admin users enter Admin Portal by default
  if (user.role === 'admin' && !adminViewingUserPortal) {
    return (
      <AdminWorkspace
        onSwitchToUserPortal={() => setAdminViewingUserPortal(true)}
      />
    );
  }

  // Normal users (role === 'user') OR admin user who switched to User Portal
  return (
    <>
      {user.role === 'admin' && adminViewingUserPortal && (
        <div 
          id="banner-admin-viewing-user"
          className="bg-amber-500/10 border-b border-amber-500/30 px-3 sm:px-6 py-2 flex items-center justify-between text-xs text-amber-300 backdrop-blur-md sticky top-0 z-50 select-none"
        >
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
            <span className="font-semibold text-amber-200">Admin Mode:</span>
            <span className="text-amber-300/90 hidden sm:inline">Viewing standard User PCB inspection workspace</span>
          </div>
          <button
            onClick={() => setAdminViewingUserPortal(false)}
            id="btn-return-admin-portal"
            className="px-3 py-1 rounded-md bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 border border-amber-500/40 font-semibold text-xs transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <span>Return to Admin Portal</span>
            <span>→</span>
          </button>
        </div>
      )}
      <CircuSenseWorkspace />
    </>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}

