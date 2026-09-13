/**
 * AMR Studio V4 - 后端 API 通信服务
 * 该模块封装了对 Python 后端 (FastAPI) 的所有网络请求。
 * 遵循 RESTful 规范，核心操作针对 Project、Component 和 Abilities。
 */

import axios from 'axios';

/** 后端服务基础路径 (Auto-adaptive) */
export const getBackendBase = () => {
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

const API_BASE = `${getBackendBase()}/api/v1/models`;

/** 获取单组件的二进制展开详情 (用于数据一致性校验) */
export const apiFetchComponentDetails = async (projectId: string, uuid: string) => {
    const res = await axios.get(`${API_BASE}/${projectId}/components/${uuid}`);
    return res.data;
};

/** 更新特定组件的前端配置到后端沙箱 */
export const apiUpdateComponent = async (projectId: string, uuid: string, payload: any) => {
    const res = await axios.patch(`${API_BASE}/${projectId}/components/${uuid}`, payload);
    return res.data;
};

/** 获取项目的全量 Abilities (算法能力) 配置 */
export const apiFetchAbilities = async (projectId: string) => {
    const res = await axios.get(`${API_BASE}/${projectId}/abilities`);
    return res.data;
};

/** 同步前端 Abilities 修改到后端 */
export const apiUpdateAbilities = async (projectId: string, payload: any) => {
    const res = await axios.patch(`${API_BASE}/${projectId}/abilities`, payload);
    return res.data;
};

/** 初始化后端沙箱 (针对从头创建的项目) */
export const apiInitSandbox = async (projectId: string, config: any) => {
    const res = await axios.post(`${getBackendBase()}/api/v1/models/init-sandbox`, { projectId, config });
    return res.data;
};

/** 触发 CModel 编译并处理下载流 */
export const apiCompileAndDownload = async (projectId: string) => {
    const res = await axios.post(`${API_BASE}/${projectId}/compile`, {}, { responseType: 'blob' });
    const url = window.URL.createObjectURL(new Blob([res.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${projectId}_packed.cmodel`);
    document.body.appendChild(link);
    link.click();
    return res;
};

/** 获取所有组件类型的 XML 定义注册表 (Schema Registry) */
export const apiFetchSchemas = async () => {
    // 移除 /models 前缀，因为 schemas 是全局资源
    const res = await axios.get(`${getBackendBase()}/api/v1/schemas`);
    return res.data;
};

/** 动态获取预先生成好的板卡资源映射字典 XML */
export const apiFetchBoardXml = async () => {
    // Vite Dev Server / Nginx 静态目录访问
    const res = await axios.get(`/models/v4/BoardDescriptions.xml`, { responseType: 'text' });
    return res.data;
};

/**
 * [FIX ISS-006 / REQ-CL-05 root cause] Parses BoardDescriptions.xml into a
 * `{ [boardTypeKey]: InterfaceConfig[] }` map keyed by <Board typeKey="...">.
 *
 * Root cause note: `apiFetchBoardXml()` above was defined and imported into
 * useProjectStore.ts, but nothing ever called it or parsed its XML — the
 * store's `boardInterfaces` state was always populated (incorrectly) from
 * `/api/v1/schemas`'s response, which has no `boardInterfaces` field at all
 * (that endpoint returns a flat map keyed by subsystem name, e.g. "mainCPU").
 * So `state.boardInterfaces` was permanently `{}`, and every board-based
 * component (mainCPU, driver, ...) silently got zero injected interfaces
 * regardless of which board model was selected. This parses the real per-board
 * interface catalog so `fetchSchemas()` can populate `boardInterfaces` for real.
 */
export const parseBoardInterfacesXml = (xmlText: string): Record<string, any[]> => {
    const result: Record<string, any[]> = {};
    if (typeof DOMParser === 'undefined' || !xmlText) return result;
    try {
        const doc = new DOMParser().parseFromString(xmlText, 'application/xml');
        if (doc.querySelector('parsererror')) return result;
        const boards = Array.from(doc.getElementsByTagName('Board'));
        for (const board of boards) {
            const typeKey = board.getAttribute('typeKey');
            if (!typeKey) continue;
            const ifaces = Array.from(board.getElementsByTagName('Interface')).map((el) => {
                const name = el.getAttribute('name') || '';
                const protocol = el.getAttribute('protocol') || '';
                return {
                    key: name,
                    type: protocol,
                    label: name,
                };
            });
            result[typeKey] = ifaces;
        }
    } catch (e) {
        console.error('Failed to parse BoardDescriptions.xml:', e);
    }
    return result;
};
/** 获取已保存的用户项目列表 */
export const apiListSavedProjects = async () => {
    const res = await axios.get(`${getBackendBase()}/api/v1/projects/saved-list`);
    return res.data;
};

/** 保存当前项目配置到后端持久化存储 */
export const apiSaveProject = async (name: string, config: any) => {
    const res = await axios.post(`${getBackendBase()}/api/v1/projects/save`, { name, config });
    return res.data;
};

/** 从后端加载特定名称的已保存项目 */
export const apiLoadProject = async (name: string) => {
    const res = await axios.get(`${getBackendBase()}/api/v1/projects/load/${name}`);
    return res.data;
};

/** 获取后端版本信息 */
export const apiFetchBackendVersion = async () => {
  const res = await axios.get(`${getBackendBase()}/api/v1/system/version`);
  return res.data;
};
