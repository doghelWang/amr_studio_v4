import axios from 'axios';

const API_BASE = 'http://localhost:8002/api/v1/models';

export const apiFetchComponentDetails = async (projectId: string, uuid: string) => {
    const res = await axios.get(`${API_BASE}/${projectId}/components/${uuid}`);
    return res.data;
};

export const apiUpdateComponent = async (projectId: string, uuid: string, payload: any) => {
    const res = await axios.patch(`${API_BASE}/${projectId}/components/${uuid}`, payload);
    return res.data;
};

export const apiFetchAbilities = async (projectId: string) => {
    const res = await axios.get(`${API_BASE}/${projectId}/abilities`);
    return res.data;
};

export const apiUpdateAbilities = async (projectId: string, payload: any) => {
    const res = await axios.patch(`${API_BASE}/${projectId}/abilities`, payload);
    return res.data;
};

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
