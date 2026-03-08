// UI State Store — no undo/redo needed for UI transient state
import { create } from 'zustand';
import type { PanelKey, DriveType } from './types';

interface UIState {
    // Navigation
    activePanel: PanelKey;

    // Selection
    selectedNodeId: string | null;

    // Canvas
    canvasMode: 'view' | 'edit';

    // Drive type confirm dialog
    isDriveConfirmOpen: boolean;
    pendingDriveType: DriveType | null;
    currentDriveType: DriveType | null;

    // Overlays
    isHealthDashboardOpen: boolean;
    isUndoHistoryOpen: boolean;
    isExportDialogOpen: boolean;

    // Actions
    setActivePanel: (panel: PanelKey) => void;
    setSelectedNode: (id: string | null) => void;
    setCanvasMode: (mode: 'view' | 'edit') => void;

    openDriveConfirm: (from: DriveType, to: DriveType) => void;
    closeDriveConfirm: () => void;

    toggleHealthDashboard: () => void;
    toggleUndoHistory: () => void;
    toggleExportDialog: () => void;
}

export const useUIStore = create<UIState>()((set) => ({
    activePanel: 'identity',
    selectedNodeId: null,
    canvasMode: 'view',
    isDriveConfirmOpen: false,
    pendingDriveType: null,
    currentDriveType: 'DIFFERENTIAL',
    isHealthDashboardOpen: false,
    isUndoHistoryOpen: false,
    isExportDialogOpen: false,

    setActivePanel: (panel) => set({ activePanel: panel }),
    setSelectedNode: (id) => set({ selectedNodeId: id }),
    setCanvasMode: (mode) => set({ canvasMode: mode }),

    openDriveConfirm: (from, to) => set({
        isDriveConfirmOpen: true,
        currentDriveType: from,
        pendingDriveType: to,
    }),
    closeDriveConfirm: () => set({
        isDriveConfirmOpen: false,
        pendingDriveType: null,
    }),

    toggleHealthDashboard: () => set((s) => ({ isHealthDashboardOpen: !s.isHealthDashboardOpen })),
    toggleUndoHistory: () => set((s) => ({ isUndoHistoryOpen: !s.isUndoHistoryOpen })),
    toggleExportDialog: () => set((s) => ({ isExportDialogOpen: !s.isExportDialogOpen })),
}));
