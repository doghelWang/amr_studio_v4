import { create } from 'zustand';
import axios from 'axios';

// Backend base URL (auto-adaptive, same as api_v2.ts)
const getBackendBase = () => {
  if (typeof window !== 'undefined') {
    const { hostname, protocol, port } = window.location;
    // In dev mode (3000/3001/5173), route to backend 8002
    if (['3000', '3001', '5173'].includes(port)) {
      return `${protocol}//${hostname}:8002`;
    }
    return window.location.origin;
  }
  return 'http://localhost:8002';
};

// Version info from package.json
const FRONTEND_VERSION = import.meta.env.VITE_APP_VERSION || '1.0.0';

export interface SystemVersionInfo {
  backendVersion: string;
  serviceStartTime: string;
}

export interface VersionInfoState {
  // Version information
  frontendVersion: string;
  backendVersion: string | null;
  backendStartTime: string | null;

  // Loading state
  isLoading: boolean;
  error: string | null;

  // Client start time
  clientStartTime: string;

  // Actions
  fetchVersionInfo: () => Promise<void>;
  clearError: () => void;
}

// Format datetime to readable string (UTC+8)
const formatDateTime = (isoString: string): string => {
  try {
    const date = new Date(isoString);
    return date.toLocaleString('zh-CN', {
      timeZone: 'Asia/Shanghai',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  } catch {
    return isoString;
  }
};

// Get current client time (UTC+8)
const getClientStartTime = (): string => {
  return new Date().toLocaleString('zh-CN', {
    timeZone: 'Asia/Shanghai',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
};

export const useVersionInfoStore = create<VersionInfoState>((set) => ({
  frontendVersion: FRONTEND_VERSION,
  backendVersion: null,
  backendStartTime: null,
  isLoading: false,
  error: null,
  clientStartTime: getClientStartTime(),

  fetchVersionInfo: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get<SystemVersionInfo>(
        `${getBackendBase()}/api/v1/system/version`
      );
      set({
        backendVersion: response.data.backendVersion,
        backendStartTime: formatDateTime(response.data.serviceStartTime),
        isLoading: false,
      });
    } catch (err) {
      set({
        isLoading: false,
        error: err instanceof Error ? err.message : 'Failed to fetch version info',
      });
    }
  },

  clearError: () => set({ error: null }),
}));
