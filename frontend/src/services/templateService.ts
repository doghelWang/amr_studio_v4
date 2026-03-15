// Template Service — built-in AMR configuration templates
import type { AmrProject } from '../store/types';

export interface TemplateInfo {
    id: string;
    name: string;
    description: string;
    driveType: string;
    wheelCount: number;
    icon: string;
}

export const BUILT_IN_TEMPLATES: TemplateInfo[] = [
    { id: 'diff_drive', name: '差速双驱', description: '标准仓储 AMR，两驱动轮+被动轮，适用于室内平地搬运', driveType: 'DIFFERENTIAL', wheelCount: 2, icon: '🔄' },
    { id: 'single_steer', name: '单舵轮', description: '叉车底盘风格，一个主动舵轮驱动+转向，稳定性强', driveType: 'SINGLE_STEER', wheelCount: 1, icon: '🎯' },
    { id: 'dual_steer', name: '双舵轮（前后）', description: '前后各一舵轮，具备全方位运动能力，适合重载场景', driveType: 'DUAL_STEER', wheelCount: 2, icon: '⬌' },
    { id: 'quad_steer', name: '四舵轮', description: '四角各一舵轮，最大灵活性和承载能力，适用于大型 AMR', driveType: 'QUAD_STEER', wheelCount: 4, icon: '✛' },
    { id: 'mecanum', name: '麦克纳姆四轮', description: '四轮麦克纳姆，全向移动，适用于精密定位轻载场景', driveType: 'MECANUM_4', wheelCount: 4, icon: '🌀' },
    { id: 'blank', name: '空白项目', description: '从零开始自定义所有参数', driveType: '', wheelCount: 0, icon: '📄' },
];

const getApiUrl = (path: string) => {
    const host = window.location.hostname === 'localhost' ? '127.0.0.1' : window.location.hostname;
    return `http://${host}:8002/api/v1${path}`;
};

// Load template from static JSON assets
export async function loadTemplate(templateId: string): Promise<AmrProject | null> {
    if (templateId === 'blank') return null;
    try {
        const templates = import.meta.glob('../assets/templates/*.json');
        const path = `../assets/templates/${templateId}.json`;
        if (templates[path]) {
            const module = await templates[path]() as any;
            return module.default as AmrProject;
        }
        return null;
    } catch {
        return null;
    }
}

// Fetch factory templates from backend
export interface BackendTemplateInfo {
    id: string;
    name: string;
    version: string;
    files: string[];
    description: string;
}

export async function fetchBackendTemplates(): Promise<BackendTemplateInfo[]> {
    try {
        const res = await fetch(getApiUrl('/templates'));
        if (!res.ok) return [];
        const data = await res.json();
        // Backend returns templates list directly or wrapped in {templates: []}
        return data.templates || data || [];
    } catch {
        return [];
    }
}

export async function loadBackendTemplate(templateId: string): Promise<AmrProject | null> {
    try {
        const res = await fetch(getApiUrl(`/templates/${templateId}`));
        if (!res.ok) return null;
        return await res.json() as AmrProject;
    } catch {
        return null;
    }
}
