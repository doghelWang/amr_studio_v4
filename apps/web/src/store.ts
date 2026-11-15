import { create } from 'zustand';
import {
  findModule, loadCatalog, nameOf, openCmodel, restore, saveCmodel, snapshot, uuidOf, validate,
  type Catalog, type ModuleRef, type Project, type Report, type Snapshot,
} from '@amr/core';

export type Tab = 'properties' | 'wiring' | 'functions' | 'validate' | 'compare' | 'catalog';
export interface Toast { kind: 'ok' | 'error'; text: string; id: number }

interface State {
  project: Project | null;
  /** Bumped after every change to the project; the proto objects are edited in place. */
  rev: number;
  report: Report | null;
  selected: string | null;
  tab: Tab;
  undo: Snapshot[];
  redo: Snapshot[];
  /** True when the project differs from what was last exported or saved. */
  unsaved: boolean;
  compare: Project | null;
  catalog: Catalog | null;
  toast: Toast | null;

  open(bytes: Uint8Array, name: string): void;
  close(): void;
  /** Run an edit. Returns an error message when the edit was rejected (nothing changes then). */
  edit(fn: (p: Project) => void): string | null;
  undoOnce(): void;
  redoOnce(): void;
  select(id: string | null, tab?: Tab): void;
  setTab(tab: Tab): void;
  setCompare(p: Project | null): void;
  exportBytes(): Uint8Array;
  markSaved(): void;
  ensureCatalog(): Promise<Catalog>;
  notify(kind: Toast['kind'], text: string): void;
}

const LIMIT = 50;
let toastId = 0;

export const useStore = create<State>((set, get) => ({
  project: null, rev: 0, report: null, selected: null, tab: 'properties', undo: [], redo: [], unsaved: false,
  compare: null, catalog: null, toast: null,

  open(bytes, name) {
    const project = openCmodel(bytes, name);
    set({ project, rev: 0, report: validate(project), selected: null, tab: 'properties', undo: [], redo: [], unsaved: false, compare: null });
  },
  close() {
    set({ project: null, report: null, selected: null, undo: [], redo: [], unsaved: false, compare: null });
  },
  edit(fn) {
    const { project, undo, rev } = get();
    if (!project) return 'No project is open';
    const before = snapshot(project);
    try {
      fn(project);
    } catch (err) {
      restore(project, before); // an edit either applies completely or not at all
      set({ rev: rev + 1 });
      return (err as Error).message;
    }
    set({ rev: rev + 1, report: validate(project), undo: [...undo, before].slice(-LIMIT), redo: [], unsaved: true });
    return null;
  },
  undoOnce() {
    const { project, undo, redo, rev } = get();
    const prev = undo[undo.length - 1];
    if (!project || !prev) return;
    const now = snapshot(project);
    restore(project, prev);
    set({ rev: rev + 1, report: validate(project), undo: undo.slice(0, -1), redo: [...redo, now], unsaved: true });
  },
  redoOnce() {
    const { project, undo, redo, rev } = get();
    const next = redo[redo.length - 1];
    if (!project || !next) return;
    const now = snapshot(project);
    restore(project, next);
    set({ rev: rev + 1, report: validate(project), undo: [...undo, now], redo: redo.slice(0, -1), unsaved: true });
  },
  select(id, tab) {
    set(tab ? { selected: id, tab } : { selected: id });
  },
  setTab(tab) {
    set({ tab });
  },
  setCompare(compare) {
    set({ compare });
  },
  exportBytes() {
    const { project, rev } = get();
    if (!project) throw new Error('No project is open');
    const bytes = saveCmodel(project);
    set({ rev: rev + 1 });
    return bytes;
  },
  markSaved() {
    set({ unsaved: false });
  },
  async ensureCatalog() {
    const have = get().catalog;
    if (have) return have;
    const catalog = await loadCatalog();
    set({ catalog });
    return catalog;
  },
  notify(kind, text) {
    const id = ++toastId;
    set({ toast: { kind, text, id } });
    setTimeout(() => get().toast?.id === id && set({ toast: null }), kind === 'error' ? 6000 : 2500);
  },
}));

/** Modules are addressed by UUID in the UI (names can be edited); models without UUIDs fall back to the name. */
export const idOf = (m: ModuleRef): string => uuidOf(m.comp) || nameOf(m.comp);
export const selectedModule = (s: Pick<State, 'project' | 'selected'>): ModuleRef | undefined =>
  s.project && s.selected ? findModule(s.project, s.selected) : undefined;

export function download(bytes: Uint8Array, filename: string): void {
  const url = URL.createObjectURL(new Blob([bytes as unknown as BlobPart], { type: 'application/octet-stream' }));
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
