import axios from './axios';

// 좋아요 토글
export const toggleLike = async (targetType, targetId) => {
  const response = await axios.post('/likes', {
    targetType,
    targetId,
  });
  return response.data;
};

// 좋아요 개수 조회
export const getLikeCount = async (targetType, targetId) => {
  const response = await axios.get('/likes/count', {
    params: {
      targetType,
      targetId,
    },
  });
  return response.data;
};

// 사용자가 좋아요 한 프로젝트 목록 조회
export const getLikedProjects = async () => {
  const response = await axios.get('/users/me/liked-projects');
  return response.data;
};

// 사용자가 특정 아이템을 좋아하는지 확인
export const isLiked = async (targetType, targetId) => {
  if (!targetId) return { isLiked: false }; // targetId가 없으면 요청하지 않음
  try {
    const response = await axios.get('/likes/status', {
      params: {
        targetType,
        targetId,
      },
    });
    // 백엔드가 boolean만 반환하는 경우를 대비해 객체로 감싸서 반환
    if (typeof response.data === 'boolean') {
      return { isLiked: response.data };
    }
    return response.data; // ex: { isLiked: true }
  } catch (error) {
    // 401 (Unauthorized) 같은 예상된 오류는 에러 로깅을 줄임
    if (error.response && error.response.status !== 401) {
      console.error('Error checking like status:', error);
    }
    return { isLiked: false };
  }
};
