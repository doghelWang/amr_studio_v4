import type { AmrProject, RobotConfig } from '../store/types';
import axios from 'axios';

// Get backend URL dynamically
const getApiUrl = (path: string) => {
    const host = window.location.hostname === 'localhost' ? '127.0.0.1' : window.location.hostname;
    return `http://${host}:8002/api/v1${path}`;
};

// ━━━ Main Save/Load via Backend API ━━━

export async function saveProject(project: AmrProject): Promise<void> {
    project.meta.modifiedAt = new Date().toISOString();
    try {
        await axios.post(getApiUrl('/projects'), project);
    } catch (e) {
        console.error('Failed to save to backend API', e);
        throw new Error('后段服务保存失败，请检查网络或后端是否开启');
    }
}

export async function fetchProjectList(): Promise<Array<{ filename: string, robotName: string, lastModified: number }>> {
    try {
        const res = await axios.get(getApiUrl('/projects'));
        // Backend returns project list directly or wrapped in {projects: []}
        return res.data.projects || res.data || [];
    } catch (e) {
        console.error(e);
        throw new Error('无法连接后端 API 提取项目列表');
    }
}

export async function fetchProjectFile(filename: string): Promise<AmrProject> {
    try {
        const res = await axios.get(getApiUrl(`/projects/${filename}`));
        return res.data as AmrProject;
    } catch (e) {
        console.error(e);
        throw new Error('读取后端项目配置失败');
    }
}

export async function openProject(): Promise<AmrProject | null> {
    console.warn("openProject() stub called. Use Project Modal UI instead.");
    return null;
}

export const autosaveDraft = () => {};
export const clearDraft = () => {};
export const clearFileHandle = () => {};
