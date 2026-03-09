// Project File Service — .amrproj save/load/autosave via Backend API
import type { AmrProject, RobotConfig } from '../store/types';
import { v4 as uuid } from 'uuid';
import axios from 'axios';

const DB_NAME = 'amr_studio_db';
const STORE_NAME = 'autosave';
const DRAFT_KEY = 'autosave_draft';

// ━━━ Main Save/Load via Backend API ━━━

export async function saveProject(project: AmrProject): Promise<void> {
    project.meta.modifiedAt = new Date().toISOString();

    // Sync to backend P4 storage API
    try {
        await axios.post('http://localhost:8000/api/v1/projects', project);
    } catch (e) {
        console.error('Failed to save to backend API', e);
        throw new Error('后段服务保存失败，请检查网络或后端是否开启');
    }
}

// Open project now needs to be handled via a UI modal that lists backend files.
// We'll export a helper here to fetch the list, and one to fetch a specific project.
export async function fetchProjectList(): Promise<Array<{ filename: string, robotName: string, lastModified: number }>> {
    try {
        const res = await axios.get('http://localhost:8000/api/v1/projects');
        return res.data.projects || [];
    } catch (e) {
        console.error(e);
        throw new Error('无法连接后端 API 提取项目列表');
    }
}

export async function fetchProjectFile(filename: string): Promise<AmrProject> {
    try {
        const res = await axios.get(`http://localhost:8000/api/v1/projects/${filename}`);
        return res.data as AmrProject;
    } catch (e) {
        console.error(e);
        throw new Error('读取后端项目配置失败');
    }
}

export async function openProject(): Promise<AmrProject | null> {
    // This semantic stub is left for backward compatibility in App.tsx briefly.
    // However, App.tsx needs to be updated to show a Modal using fetchProjectList().
    console.warn("openProject() stub called. Use Project Modal UI instead.");
    return null;
}

// (Removed deprecated file upload input mechanisms)


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
    // No-op deprecated
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
// (Removed deprecated blob serializers)
