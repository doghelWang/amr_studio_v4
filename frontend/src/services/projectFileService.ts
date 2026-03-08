// Project File Service — .amrproj save/load/autosave
import type { AmrProject, RobotConfig } from '../store/types';
import { v4 as uuid } from 'uuid';

const DB_NAME = 'amr_studio_db';
const STORE_NAME = 'autosave';
const DRAFT_KEY = 'autosave_draft';

// File System Access API handle (persists while app is open)
let _fileHandle: FileSystemFileHandle | null = null;

// ━━━ Main Save/Load ━━━

export async function saveProject(project: AmrProject): Promise<void> {
    project.meta.modifiedAt = new Date().toISOString();
    const json = JSON.stringify(project, null, 2);
    const blob = new Blob([json], { type: 'application/json' });

    if (_fileHandle) {
        try {
            const writable = await _fileHandle.createWritable();
            await writable.write(blob);
            await writable.close();
            return;
        } catch {
            // Handle might be stale, fall through to showSaveFilePicker
        }
    }

    // Fallback: use download if File System Access API not available
    if (!('showSaveFilePicker' in window)) {
        downloadBlob(blob, sanitizeFilename(project.meta.projectName) + '.amrproj');
        return;
    }

    try {
        const handle = await (window as any).showSaveFilePicker({
            suggestedName: sanitizeFilename(project.meta.projectName) + '.amrproj',
            types: [{ description: 'AMR Project', accept: { 'application/json': ['.amrproj'] } }],
        });
        _fileHandle = handle;
        const writable = await handle.createWritable();
        await writable.write(blob);
        await writable.close();
    } catch (e) {
        // User cancelled
        if ((e as Error).name !== 'AbortError') throw e;
    }
}

export async function openProject(): Promise<AmrProject | null> {
    if (!('showOpenFilePicker' in window)) {
        // Fallback to <input type="file">
        return openViaInputElement();
    }

    try {
        const [handle] = await (window as any).showOpenFilePicker({
            types: [{ description: 'AMR Project', accept: { 'application/json': ['.amrproj'] } }],
        });
        _fileHandle = handle;
        const file = await handle.getFile();
        return parseProjectFile(await file.text());
    } catch (e) {
        if ((e as Error).name !== 'AbortError') throw e;
        return null;
    }
}

function openViaInputElement(): Promise<AmrProject | null> {
    return new Promise((resolve) => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.amrproj,.json';
        input.onchange = async () => {
            const file = input.files?.[0];
            if (!file) { resolve(null); return; }
            resolve(parseProjectFile(await file.text()));
        };
        input.click();
    });
}

function parseProjectFile(json: string): AmrProject {
    const data = JSON.parse(json);
    if (!data.formatVersion || !data.config) {
        throw new Error('Invalid .amrproj file format');
    }
    return data as AmrProject;
}

// ━━━ New Project Factory ━━━

export function createNewProject(projectName = '未命名项目', config?: RobotConfig): AmrProject {
    return {
        formatVersion: '1.0',
        meta: {
            projectId: uuid(),
            projectName,
            createdAt: new Date().toISOString(),
            modifiedAt: new Date().toISOString(),
            author: '',
            templateOrigin: 'blank',
            formatVersion: '1.0',
        },
        config: config ?? {
            identity: {
                robotName: projectName, version: '1.0',
                chassisLength: 1200, chassisWidth: 800,
                navigationMethod: 'LIDAR_SLAM', driveType: 'DIFFERENTIAL',
            },
            mcu: { model: 'RK3588_CTRL_BOARD', canBuses: ['CAN0', 'CAN1', 'CAN2'], ethPorts: ['ETH0', 'ETH1'] },
            ioBoards: [], wheels: [], sensors: [], ioPorts: [],
        },
        snapshots: [],
    };
}

export function clearFileHandle(): void {
    _fileHandle = null;
}

// ━━━ Autosave (IndexedDB) ━━━

function openDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
        const req = indexedDB.open(DB_NAME, 1);
        req.onupgradeneeded = () => req.result.createObjectStore(STORE_NAME);
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => reject(req.error);
    });
}

export async function autosaveDraft(project: AmrProject): Promise<void> {
    try {
        const db = await openDB();
        const tx = db.transaction(STORE_NAME, 'readwrite');
        tx.objectStore(STORE_NAME).put(JSON.stringify(project), DRAFT_KEY);
    } catch { /* silently fail */ }
}

export async function loadDraft(): Promise<AmrProject | null> {
    try {
        const db = await openDB();
        return new Promise((resolve) => {
            const tx = db.transaction(STORE_NAME, 'readonly');
            const req = tx.objectStore(STORE_NAME).get(DRAFT_KEY);
            req.onsuccess = () => {
                if (req.result) resolve(JSON.parse(req.result));
                else resolve(null);
            };
            req.onerror = () => resolve(null);
        });
    } catch { return null; }
}

export async function clearDraft(): Promise<void> {
    try {
        const db = await openDB();
        const tx = db.transaction(STORE_NAME, 'readwrite');
        tx.objectStore(STORE_NAME).delete(DRAFT_KEY);
    } catch { /* silently fail */ }
}

// ━━━ Utilities ━━━

function sanitizeFilename(name: string): string {
    return name.replace(/[^a-zA-Z0-9_\-\u4e00-\u9fff]/g, '_');
}

function downloadBlob(blob: Blob, filename: string): void {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
}
