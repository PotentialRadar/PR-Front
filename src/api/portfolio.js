// src/api/portfolio.js
import api from './axios.js';

export const portfolioApi = {
  // 포트폴리오 전체 조회
  getPortfolio: () => api.get('/user/portfolio'),

  // 포트폴리오 통합 업데이트
  updatePortfolio: (data) => api.put('/user/portfolio', data),

  // 기술 스택 관련 API
  getTechStacks: () => api.get('/user/tech-stacks'),
  
  addTechStack: (data) => api.post('/user/tech-stacks', data),
  
  updateTechStack: (id, data) => api.put(`/user/tech-stacks/${id}`, data),
  
  deleteTechStack: (id) => api.delete(`/user/tech-stacks/${id}`),

  // 교육 정보 관련 API
  getEducations: () => api.get('/user/educations'),
  
  addEducation: (data) => api.post('/user/educations', data),
  
  updateEducation: (id, data) => api.put(`/user/educations/${id}`, data),
  
  deleteEducation: (id) => api.delete(`/user/educations/${id}`),

  // 경력 정보 관련 API
  getExperiences: () => api.get('/user/experiences'),
  
  addExperience: (data) => api.post('/user/experiences', data),
  
  updateExperience: (id, data) => api.put(`/user/experiences/${id}`, data),
  
  deleteExperience: (id) => api.delete(`/user/experiences/${id}`)
};

// 전체 기술 스택 목록 조회를 위한 별도 API (검색용)
export const techStackApi = {
  // 모든 기술 스택 조회 (검색용)
  getAllTechStacks: () => api.get('/tech-stacks'),
  
  // 이름으로 기술 스택 검색
  searchTechStacks: (query) => api.get(`/tech-stacks?search=${encodeURIComponent(query)}`)
};