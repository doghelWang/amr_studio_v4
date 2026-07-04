const STORAGE_KEY = 'amr_studio_backend_url';
const CHANGE_EVENT = 'amr-studio-backend-url-change';

const trimTrailingSlash = (url: string) => url.replace(/\/+$/, '');

const inferBackendBase = () => {
  if (typeof window !== 'undefined') {
    const { hostname, protocol, port } = window.location;
    if (['3000', '3001', '5173'].includes(port)) {
      return `${protocol}//${hostname}:8002`;
    }
    return window.location.origin;
  }
  return 'http://localhost:8002';
};

const readQueryBackend = () => {
  if (typeof window === 'undefined') return null;
  const value = new URLSearchParams(window.location.search).get('backend');
  return value ? trimTrailingSlash(value) : null;
};

const readStoredBackend = () => {
  if (typeof window === 'undefined') return null;
  const value = window.localStorage.getItem(STORAGE_KEY);
  return value ? trimTrailingSlash(value) : null;
};

export const getDefaultBackendBase = () => {
  const envBackendUrl = import.meta.env.VITE_BACKEND_URL;
  return trimTrailingSlash(envBackendUrl || inferBackendBase());
};

export const getBackendBase = () => {
  const queryBackend = readQueryBackend();
  if (queryBackend) {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(STORAGE_KEY, queryBackend);
      (window as any).BACKEND_URL = queryBackend;
    }
    return queryBackend;
  }
  return readStoredBackend() || getDefaultBackendBase();
};

export const setBackendBase = (url: string) => {
  const normalized = trimTrailingSlash(url.trim());
  if (!normalized) return getBackendBase();
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(STORAGE_KEY, normalized);
    (window as any).BACKEND_URL = normalized;
    window.dispatchEvent(new CustomEvent(CHANGE_EVENT, { detail: normalized }));
  }
  return normalized;
};

export const resetBackendBase = () => {
  const fallback = getDefaultBackendBase();
  if (typeof window !== 'undefined') {
    window.localStorage.removeItem(STORAGE_KEY);
    (window as any).BACKEND_URL = fallback;
    window.dispatchEvent(new CustomEvent(CHANGE_EVENT, { detail: fallback }));
  }
  return fallback;
};

export const subscribeBackendBaseChange = (handler: (url: string) => void) => {
  if (typeof window === 'undefined') return () => undefined;
  const listener = (event: Event) => handler((event as CustomEvent<string>).detail || getBackendBase());
  window.addEventListener(CHANGE_EVENT, listener);
  return () => window.removeEventListener(CHANGE_EVENT, listener);
};

if (typeof window !== 'undefined') {
  (window as any).BACKEND_URL = getBackendBase();
}
