// src/api/portfolio.js
import api from './axios.js';

export const portfolioApi = {
  // 포트폴리오 전체 조회 (개인용 - 인증 필요)
  getPortfolio: () => api.get('/user/portfolio'),

  // 공개 포트폴리오 조회 (인증 불필요)
  getPublicPortfolio: (userId, config = {}) => api.get(`/portfolio/${userId}`, config),

  // 공개된 포트폴리오 목록 조회 (검색 및 페이징 포함)
  getPublicPortfolios: (params = {}) => {
    const searchParams = new URLSearchParams();
    
    if (params.techPart) searchParams.append('techPart', params.techPart);
    if (params.experienceRange) searchParams.append('experienceRange', params.experienceRange);
    if (params.keyword) searchParams.append('keyword', params.keyword);
    if (params.sortBy) searchParams.append('sortBy', params.sortBy);
    if (params.page !== undefined) searchParams.append('page', params.page);
    if (params.size !== undefined) searchParams.append('size', params.size);
    
    return api.get(`/portfolios?${searchParams.toString()}`);
  },

  // 기술파트별 포트폴리오 목록 조회
  getPortfoliosByTechPart: (techPartName, params = {}) => {
    const searchParams = new URLSearchParams();
    
    if (params.sortBy) searchParams.append('sortBy', params.sortBy);
    if (params.page !== undefined) searchParams.append('page', params.page);
    if (params.size !== undefined) searchParams.append('size', params.size);
    
    return api.get(`/portfolios/tech/${techPartName}?${searchParams.toString()}`);
  },

  // 포트폴리오 통합 업데이트
  updatePortfolio: (data) => api.put('/user/portfolio', data),

  // 자기소개만 업데이트
  updateBio: (bio) => api.patch('/user/bio', { bio }),

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
  
  deleteExperience: (id) => api.delete(`/user/experiences/${id}`),

  // 프로젝트 관련 API
  // 참가한 모든 프로젝트 + 선택 상태 조회
  getAvailableProjects: () => api.get('/user/available-projects'),
  
  // 포트폴리오에 선택된 프로젝트 목록 조회
  getSelectedProjects: () => api.get('/user/projects'),
  
  // 포트폴리오 프로젝트 선택 일괄 업데이트
  updateProjectSelection: (selectedProjectIds) => 
    api.put('/user/portfolio/projects', { selectedProjectIds }),
  
  // 특정 프로젝트를 포트폴리오에 추가
  addProjectToPortfolio: (projectId) => 
    api.post(`/user/projects/${projectId}`),
  
  // 포트폴리오에서 프로젝트 제거
  removeProjectFromPortfolio: (projectId) => 
    api.delete(`/user/projects/${projectId}`)
};

// 전체 기술 스택 목록 조회를 위한 별도 API
export const techStackApi = {
  // 전체 기술 스택 조회 (ID와 이름 포함)
  getAllTechStacks: () => api.get('/tech-stacks'),
  
  // 인기 기술 스택 조회 (검색용)
  getPopularTechStacks: () => api.get('/search/tags')
};