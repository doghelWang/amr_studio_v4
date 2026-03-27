/**
 * AMR Studio V4 - 后端 API 通信服务
 * 该模块封装了对 Python 后端 (FastAPI) 的所有网络请求。
 * 遵循 RESTful 规范，核心操作针对 Project、Component 和 Abilities。
 */

import axios from 'axios';

/** 后端服务基础路径 (当前硬编码为本地 8002 端口) */
const API_BASE = 'http://localhost:8002/api/v1/models';

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
    const res = await axios.get('http://localhost:8002/api/v1/schemas');
    return res.data;
};
