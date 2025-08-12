// /src/api/projectMembers.js
import api from './axios';

const ROOT = (projectId) => `/projects/${projectId}`;

// 지원하기
export const applyProject = (projectId, payload) =>
    api.post(`${ROOT(projectId)}/apply`, payload);

// 지원자 목록 (팀장 전용, 현재 백엔드 설계상 userId 쿼리 필요)
export const getProjectMembers = (projectId, userId) =>
    api.get(`${ROOT(projectId)}/members`, { params: { userId } });

// 지원자 상태 변경 (APPROVED/REJECTED 등)
export const updateMemberStatus = (projectId, memberId, userId, status) =>
    api.patch(
        `${ROOT(projectId)}/members/${memberId}/status`,
        { status },
        { params: { userId } }
    );
