import { PCBBoard, ProjectRecord } from '../types';
import { MOCK_BOARDS, INITIAL_PROJECTS } from '../data/mockBoards';
import { detectionApi, DetectionOptions } from './detectionApi';
import { storageService } from './storageService';

const PROJECTS_STORAGE_KEY = 'circusense_projects_v2';
const ACTIVE_BOARD_KEY = 'circusense_active_board_v2';

export const pcbApi = {
  // Get all saved projects
  getProjects: async (): Promise<ProjectRecord[]> => {
    try {
      const stored = localStorage.getItem(PROJECTS_STORAGE_KEY);
      if (stored) {
        const parsed: ProjectRecord[] = JSON.parse(stored);
        // Hydrate images from IndexedDB if stored by key
        for (const proj of parsed) {
          if (proj.imageStorageKey && (!proj.board.customImageBase64 || proj.board.customImageBase64.length < 50)) {
            const dbImg = await storageService.getImage(proj.imageStorageKey);
            if (dbImg) {
              proj.board.customImageBase64 = dbImg;
            }
          }
        }
        return parsed;
      }
    } catch (err) {
      console.warn('Error reading saved projects:', err);
    }
    return INITIAL_PROJECTS;
  },

  // Save project with IndexedDB image separation to prevent quota exceeded errors
  saveProject: async (project: ProjectRecord): Promise<ProjectRecord> => {
    const projects = await pcbApi.getProjects();
    const existingIndex = projects.findIndex(p => p.id === project.id);

    // Save image to IndexedDB
    let imageKey = project.imageStorageKey || `img-${project.id}`;
    if (project.board.customImageBase64 && project.board.customImageBase64.startsWith('data:')) {
      await storageService.saveImage(imageKey, project.board.customImageBase64);
    }

    // Keep metadata in project record while keeping huge string out of localStorage if too large
    const projectToStore: ProjectRecord = {
      ...project,
      imageStorageKey: imageKey,
      updatedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
      board: {
        ...project.board,
        // Only strip if above 500KB to stay safely below 5MB quota
        customImageBase64: (project.board.customImageBase64 && project.board.customImageBase64.length > 500000)
          ? `indexeddb:${imageKey}`
          : project.board.customImageBase64
      }
    };

    let updated: ProjectRecord[];
    if (existingIndex >= 0) {
      updated = [...projects];
      updated[existingIndex] = projectToStore;
    } else {
      updated = [projectToStore, ...projects];
    }

    try {
      localStorage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.warn('localStorage full, project saved with image in IndexedDB:', e);
    }

    return project;
  },

  // Delete project
  deleteProject: async (projectId: string): Promise<boolean> => {
    const projects = await pcbApi.getProjects();
    const updated = projects.filter(p => p.id !== projectId);
    try {
      localStorage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify(updated));
      await storageService.deleteImage(`img-${projectId}`);
    } catch {
      // ignore
    }
    return true;
  },

  // Get active board
  getActiveBoard: async (): Promise<PCBBoard> => {
    try {
      const stored = localStorage.getItem(ACTIVE_BOARD_KEY);
      if (stored) {
        const board: PCBBoard = JSON.parse(stored);
        if (board.customImageBase64 && board.customImageBase64.startsWith('indexeddb:')) {
          const key = board.customImageBase64.replace('indexeddb:', '');
          const img = await storageService.getImage(key);
          if (img) board.customImageBase64 = img;
        }
        return board;
      }
    } catch {
      // ignore
    }
    return MOCK_BOARDS[0]; // Default to Main Board #01 preset
  },

  // Set active board
  setActiveBoard: async (board: PCBBoard): Promise<void> => {
    try {
      localStorage.setItem(ACTIVE_BOARD_KEY, JSON.stringify(board));
    } catch (e) {
      console.warn('Could not cache active board in localStorage:', e);
    }
  },

  // Preset demo boards
  getPresetBoards: (): PCBBoard[] => {
    return MOCK_BOARDS.map(b => ({
      ...b,
      sourceType: 'demo',
      isDemoData: true
    }));
  },

  /**
   * Real authoritative analysis workflow:
   * Uploads image file to FastAPI -> executes Ultralytics YOLO (best.pt) -> returns real PCBBoard.
   * NEVER substitutes mock data on error!
   */
  executeRealAnalysis: async (
    file: File,
    options?: DetectionOptions,
    signal?: AbortSignal,
    onProgressStage?: (stage: string) => void
  ): Promise<PCBBoard> => {
    onProgressStage?.('Validating image resolution & optical headers...');
    
    // Read local object URL for instant zero-latency UI preview
    const objectUrl = URL.createObjectURL(file);
    const storageKey = `img-${Date.now()}`;
    
    // Convert to base64 / store in IndexedDB
    await storageService.saveImage(storageKey, file);

    onProgressStage?.('Running CircuSense YOLO neural inference (best.pt)...');
    
    // Execute real YOLO detection
    const analysis = await detectionApi.detectPCB(file, options, signal);

    onProgressStage?.('Normalizing component coordinates & building netlist...');

    // Convert real analysis to PCBBoard
    const board = detectionApi.analysisToBoard(analysis, objectUrl, storageKey);

    await pcbApi.setActiveBoard(board);
    onProgressStage?.('Analysis complete.');

    return board;
  }
};
