// src/api/projects.js
import api from './axios';

const ROOT = '/projects';

// 전체 목록 또는 사용자별 목록 조회
export const listProjects = (params) => api.get(ROOT, { params });

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
    return api.post(`${ROOT}/upload-file`, form, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};

// 프로젝트 상태 변경
export const updateProjectStatus = (projectId, status, userId) =>
    api.patch(`${ROOT}/${projectId}/status`, { status }, { params: { userId } });

/**
 * 팀원 리뷰를 생성합니다.
 * @param {object} payload - TeamMemberReviewRequestDto
 * @param {number} payload.projectId - 프로젝트 ID
 * @param {number} payload.revieweeId - 리뷰 대상자 ID
 * @param {number} payload.rating - 평점
 * @param {string} payload.comment - 리뷰 코멘트
 */
export const createTeamMemberReview = (payload) => api.post('/reviews/member', payload);

// 사용자가 생성한 프로젝트 목록
export const getProjectsCreatedByUser = (userId, config = {}) =>
    api.get(`${ROOT}/users/${userId}/created`, config)

// 사용자가 지원한 프로젝트 목록
export const getAppliedProjectsByUser = (userId, config = {}) =>
    api.get(`${ROOT}/users/${userId}/applied`, config)

// 확정된 프로젝트 멤버 목록 조회
export const getConfirmedProjectMembers = (projectId) => api.get(`${ROOT}/${projectId}/confirmed-members`);