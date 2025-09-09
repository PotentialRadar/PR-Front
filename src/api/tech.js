import api from './axios';

/**
 * 모든 기술 스택 조회 (DB에서 전체 목록)
 */
export const getAllTechStacks = async () => {
  try {
    const response = await api.get('/tech-stacks');
    return response.data;
  } catch (error) {
    console.error('기술 스택 조회 실패:', error);
    throw error;
  }
};

/**
 * 인기 기술 스택 조회 (검색에서 자주 사용되는)
 */
export const getPopularTechStacks = async () => {
  try {
    const response = await api.get('/search/popular/tech-stacks');
    return response.data.techStacks || [];
  } catch (error) {
    console.error('인기 기술 스택 조회 실패:', error);
    return [];
  }
};

/**
 * 모든 기술 파트 조회
 */
export const getTechParts = async () => {
  try {
    const response = await api.get('/tech-parts');
    return response.data;
  } catch (error) {
    console.error('기술 파트 조회 실패:', error);
    throw error;
  }
};

/**
 * 인기 기술 파트 조회 
 */
export const getPopularTechParts = async () => {
  try {
    const response = await api.get('/search/popular/tech-parts');
    return response.data.techParts || [];
  } catch (error) {
    console.error('인기 기술 파트 조회 실패:', error);
    return [];
  }
};

/**
 * 기술 스택 검색 (이름으로 필터링)
 */
export const searchTechStacks = (techStacks, query) => {
  if (!query.trim()) return [];
  
  return techStacks.filter(tech =>
    tech.name && tech.name.toLowerCase().includes(query.toLowerCase())
  );
};