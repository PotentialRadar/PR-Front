// src/api/comments.js
import api from './axios';

const ROOT = (projectId) => `/projects/${projectId}/comments`;

// 목록
export const listComments = (projectId) =>
    api.get(ROOT(projectId));

// 생성 (댓글/대댓글 공용: parentId로 구분)
export const createComment = (projectId, { content, isPrivate = false, parentId = null }) =>
    api.post(ROOT(projectId), { content, isPrivate, parentId });

// 수정
export const updateComment = (projectId, commentId, { content, isPrivate }) =>
    api.put(`${ROOT(projectId)}/${commentId}`, { content, isPrivate });

// 삭제
export const deleteComment = (projectId, commentId) =>
    api.delete(`${ROOT(projectId)}/${commentId}`);
