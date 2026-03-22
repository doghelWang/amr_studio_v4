import { create } from 'zustand';
import type { DriveType } from './types';

interface UIState {
    // Navigation
    currentStep: number;
    
    // Selection
    selectedNodeId: string | null;

    // Canvas
    canvasMode: 'view' | 'edit';

    // Overlays
    isHealthDashboardOpen: boolean;
    isUndoHistoryOpen: boolean;

    // Actions
    setStep: (step: number) => void;
    setSelectedNode: (id: string | null) => void;
    setCanvasMode: (mode: 'view' | 'edit') => void;
    
    toggleHealthDashboard: () => void;
    toggleUndoHistory: () => void;
}

export const useUIStore = create<UIState>()((set) => ({
    currentStep: 0,
    selectedNodeId: null,
    canvasMode: 'view',
    isHealthDashboardOpen: false,
    isUndoHistoryOpen: false,

    setStep: (step) => set({ currentStep: step }),
    setSelectedNode: (id) => set({ selectedNodeId: id }),
    setCanvasMode: (mode) => set({ canvasMode: mode }),

    toggleHealthDashboard: () => set((s) => ({ isHealthDashboardOpen: !s.isHealthDashboardOpen })),
    toggleUndoHistory: () => set((s) => ({ isUndoHistoryOpen: !s.isUndoHistoryOpen })),
}));
