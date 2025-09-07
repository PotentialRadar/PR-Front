import { ref, computed } from 'vue'

/**
 * 프로필 이미지 관련 로직을 처리하는 컴포지블
 * @param {Object} user - 사용자 객체
 * @param {Object} options - 옵션 설정
 */
export function useProfileImage(user = {}, options = {}) {
  const {
    fallbackType = 'dicebear',
    defaultImage = '/default-avatar.png'
  } = options

  // 이미지 에러 상태
  const hasImageError = ref(false)

  /**
   * 프로필 이미지 URL 반환
   * 우선순위: profileImage > avatar > fallback
   */
  const profileImageUrl = computed(() => {
    // 백엔드 User 엔티티의 profileImage 필드 우선
    if (user.profileImage && !hasImageError.value) {
      return user.profileImage
    }
    
    // avatar 필드 (기존 호환성)
    if (user.avatar && !hasImageError.value) {
      return user.avatar
    }
    
    // fallback 이미지 생성
    return getFallbackImageUrl(user, fallbackType, defaultImage)
  })

  /**
   * 사용자 이름 반환
   * 우선순위: name > nickname > 기본값
   */
  const userName = computed(() => {
    return user.name || user.nickname || '사용자'
  })

  /**
   * 사용자 ID 반환
   * 우선순위: userId > id
   */
  const userId = computed(() => {
    return user.userId || user.id || null
  })

  /**
   * 이미지 에러 처리
   */
  const handleImageError = () => {
    hasImageError.value = true
  }

  /**
   * 이미지 로드 성공 처리
   */
  const handleImageLoad = () => {
    hasImageError.value = false
  }

  /**
   * 이미지 에러 상태 리셋
   */
  const resetImageError = () => {
    hasImageError.value = false
  }

  return {
    profileImageUrl,
    userName,
    userId,
    hasImageError,
    handleImageError,
    handleImageLoad,
    resetImageError
  }
}

/**
 * fallback 이미지 URL 생성
 */
function getFallbackImageUrl(user, fallbackType, defaultImage) {
  const userId = user.userId || user.id
  const userName = user.name || user.nickname

  switch (fallbackType) {
    case 'dicebear':
      if (userId) {
        return `https://api.dicebear.com/7.x/avataaars/svg?seed=${userId}`
      }
      break
    
    case 'initials':
      if (userName) {
        return `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=random&color=fff`
      }
      break
    
    case 'robohash':
      if (userId) {
        return `https://robohash.org/${userId}?set=set4&size=200x200`
      }
      break
  }
  
  return defaultImage
}

/**
 * 멤버 프로필 이미지 URL 반환 (기존 함수와 호환성)
 */
export function getMemberProfileImage(member, fallbackType = 'dicebear') {
  const { profileImageUrl } = useProfileImage(member, { fallbackType })
  return profileImageUrl.value
}

/**
 * 아바타 URL 반환 (기존 함수와 호환성)
 */
export function getAvatarUrl(user, fallbackType = 'dicebear') {
  const { profileImageUrl } = useProfileImage(user, { fallbackType })
  return profileImageUrl.value
}