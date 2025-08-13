// src/api/projects.js
import api from './axios';

const ROOT = '/projects';

// 전체 목록: 배열로 반환됨 (서버 페이징 없음)
export const listProjects = () => api.get(ROOT);

// 단건 조회
export const getProject = (projectId) => api.get(`${ROOT}/${projectId}`);

// 생성 (userId 쿼리 필요)
export const createProject = (payload, userId) =>
    api.post(ROOT, payload, { params: { userId } });

// 수정/삭제
export const updateProject = (projectId, payload) => api.put(`${ROOT}/${projectId}`, payload);
export const deleteProject = (projectId) => api.delete(`${ROOT}/${projectId}`);

// S3 업로드
export const uploadProjectFile = (file) => {
    const form = new FormData();
    form.append('file', file);
    return api.post(`${ROOT}/upload-file`, form); // Content-Type 자동
};
