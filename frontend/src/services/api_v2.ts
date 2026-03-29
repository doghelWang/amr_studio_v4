/**
 * AMR Studio V4 - 后端 API 通信服务
 * 该模块封装了对 Python 后端 (FastAPI) 的所有网络请求。
 * 遵循 RESTful 规范，核心操作针对 Project、Component 和 Abilities。
 */

import axios from 'axios';

/** 后端服务基础路径 (当前硬编码为本地 8002 端口) */
// Resolve Backend URL dynamically based on current environment
const getBackendBase = () => {
    if (typeof window !== 'undefined') {
        const { hostname, protocol } = window.location;
        const port = window.location.port;
        // [FIX] Add 3001 to supported dev ports
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
