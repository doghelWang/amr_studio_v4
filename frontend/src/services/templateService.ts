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

// Load template from static JSON assets
export async function loadTemplate(templateId: string): Promise<AmrProject | null> {
    if (templateId === 'blank') return null;

    try {
        const module = await import(`../assets/templates/${templateId}.json`);
        return module.default as AmrProject;
    } catch {
        // Template file doesn't exist yet, return a simple generated default
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
        const res = await fetch('http://localhost:8000/api/v1/templates');
        if (!res.ok) return [];
        const data = await res.json();
        return data.templates || [];
    } catch {
        return [];
    }
}

export async function loadBackendTemplate(templateId: string): Promise<AmrProject | null> {
    try {
        const res = await fetch(`http://localhost:8000/api/v1/templates/${templateId}`);
        if (!res.ok) return null;
        return await res.json() as AmrProject;
    } catch {
        return null;
    }
}
