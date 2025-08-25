import api from './axios'

/**
 * 프로젝트 검색 API
 * @param {Object} params - 검색 파라미터
 * @param {string} params.keyword - 키워드 검색
 * @param {Array<string>} params.techParts - 기술 파트 필터
 * @param {Array<string>} params.techStacks - 기술 스택 필터
 * @param {Array<string>} params.statuses - 프로젝트 상태 필터
 * @param {number} params.page - 페이지 번호 (0부터 시작)
 * @param {number} params.size - 페이지 크기
 * @returns {Promise} API 응답
 */
export const searchProjects = async (params = {}) => {
  try {
    const queryParams = new URLSearchParams()
    
    if (params.keyword) queryParams.append('keyword', params.keyword)
    if (params.techParts?.length) {
      params.techParts.forEach(part => queryParams.append('techParts', part))
    }
    if (params.techStacks?.length) {
      params.techStacks.forEach(stack => queryParams.append('techStacks', stack))
    }
    if (params.statuses?.length) {
      params.statuses.forEach(status => queryParams.append('statuses', status))
    }
    
    queryParams.append('page', params.page || 0)
    queryParams.append('size', params.size || 20)
    
    const response = await api.get(`/search/projects?${queryParams.toString()}`)
    return response.data
  } catch (error) {
    console.error('프로젝트 검색 API 오류:', error)
    throw error
  }
}

/**
 * 사용자 검색 API (포트폴리오)
 * @param {Object} params - 검색 파라미터
 * @param {string} params.keyword - 키워드 검색 (닉네임, 기술스택, 기술파트)
 * @param {string} params.nickname - 닉네임 검색
 * @param {Array<string>} params.techParts - 기술 파트 필터
 * @param {Array<string>} params.techStacks - 기술 스택 필터
 * @param {Array<string>} params.experienceRanges - 경력 필터
 * @param {number} params.page - 페이지 번호 (0부터 시작)
 * @param {number} params.size - 페이지 크기
 * @returns {Promise} API 응답
 */
export const searchUsers = async (params = {}) => {
  try {
    const queryParams = new URLSearchParams()
    
    if (params.keyword) queryParams.append('keyword', params.keyword)
    if (params.nickname) queryParams.append('nickname', params.nickname)
    if (params.techParts?.length) {
      params.techParts.forEach(part => queryParams.append('techParts', part))
    }
    if (params.techStacks?.length) {
      params.techStacks.forEach(stack => queryParams.append('techStacks', stack))
    }
    if (params.experienceRanges?.length) {
      params.experienceRanges.forEach(range => queryParams.append('experienceRanges', range))
    }
    
    queryParams.append('page', params.page || 0)
    queryParams.append('size', params.size || 20)
    
    const response = await api.get(`/search/users?${queryParams.toString()}`)
    return response.data
  } catch (error) {
    console.error('사용자 검색 API 오류:', error)
    throw error
  }
}

/**
 * 기술 태그 조회 API
 * @returns {Promise} 기술 태그 목록
 */
export const getTechTags = async () => {
  try {
    const response = await api.get('/search/tags')
    return response.data
  } catch (error) {
    console.error('기술 태그 조회 API 오류:', error)
    throw error
  }
}

/**
 * 인기 키워드 조회 API
 * @returns {Promise} 인기 키워드 목록
 */
export const getPopularKeywords = async () => {
  try {
    const response = await api.get('/search/popular/keywords')
    return response.data
  } catch (error) {
    console.error('인기 키워드 조회 API 오류:', error)
    throw error
  }
}

/**
 * 프로젝트 필터별 결과 수 미리보기 API
 * @param {Object} params - 검색 파라미터
 * @returns {Promise} 결과 수 정보
 */
export const getProjectCountPreview = async (params = {}) => {
  try {
    const queryParams = new URLSearchParams()
    
    if (params.keyword) queryParams.append('keyword', params.keyword)
    if (params.techParts?.length) {
      params.techParts.forEach(part => queryParams.append('techParts', part))
    }
    if (params.techStacks?.length) {
      params.techStacks.forEach(stack => queryParams.append('techStacks', stack))
    }
    if (params.statuses?.length) {
      params.statuses.forEach(status => queryParams.append('statuses', status))
    }
    
    const response = await api.get(`/search/projects/count-preview?${queryParams.toString()}`)
    return response.data
  } catch (error) {
    console.error('프로젝트 결과 수 미리보기 API 오류:', error)
    throw error
  }
}

/**
 * 사용자(포트폴리오) 필터별 결과 수 미리보기 API
 * @param {Object} params - 검색 파라미터
 * @returns {Promise} 결과 수 정보
 */
export const getUserCountPreview = async (params = {}) => {
  try {
    const queryParams = new URLSearchParams()
    
    if (params.keyword) queryParams.append('keyword', params.keyword)
    if (params.nickname) queryParams.append('nickname', params.nickname)
    if (params.techParts?.length) {
      params.techParts.forEach(part => queryParams.append('techParts', part))
    }
    if (params.techStacks?.length) {
      params.techStacks.forEach(stack => queryParams.append('techStacks', stack))
    }
    if (params.experienceRanges?.length) {
      params.experienceRanges.forEach(range => queryParams.append('experienceRanges', range))
    }
    
    const response = await api.get(`/search/users/count-preview?${queryParams.toString()}`)
    return response.data
  } catch (error) {
    console.error('사용자 결과 수 미리보기 API 오류:', error)
    throw error
  }
}

/**
 * 데이터 동기화 API (개발용)
 * @returns {Promise} 동기화 결과
 */
export const syncSearchData = async () => {
  try {
    const response = await api.post('/search/sync')
    return response.data
  } catch (error) {
    console.error('검색 데이터 동기화 API 오류:', error)
    throw error
  }
}