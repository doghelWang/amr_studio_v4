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
