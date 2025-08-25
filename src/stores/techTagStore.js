import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getTechTags } from '@/api/search'

export const useTechTagStore = defineStore('techTag', () => {
  // 상태
  const techParts = ref([])
  const techStacks = ref([])
  const popularTechStacks = ref([])
  const isLoaded = ref(false)
  const lastLoadTime = ref(null)
  
  // 캐시 만료 시간 (5분)
  const CACHE_DURATION = 5 * 60 * 1000
  
  // Getter: 인기 기술 스택 상위 20개 반환
  const getPopularTechStacksTop20 = () => {
    return techStacks.value.slice(0, 20)
  }
  
  // 캐시 유효성 검사
  const isCacheValid = () => {
    if (!isLoaded.value || !lastLoadTime.value) {
      return false
    }
    const now = Date.now()
    const timeDiff = now - lastLoadTime.value
    return timeDiff < CACHE_DURATION
  }
  
  // 기술 태그 로드 (캐시 우선)
  const loadTechTags = async (forceReload = false) => {
    // 캐시가 유효하고 강제 새로고침이 아닌 경우 기존 데이터 사용
    if (isCacheValid() && !forceReload) {
      console.log('🎯 기술 태그 캐시 사용:', { 
        techPartsCount: techParts.value.length,
        techStacksCount: techStacks.value.length,
        cacheAge: Math.round((Date.now() - lastLoadTime.value) / 1000) + '초'
      })
      return {
        techParts: techParts.value,
        techStacks: techStacks.value,
        popularTechStacks: popularTechStacks.value
      }
    }
    
    try {
      console.log('🔄 기술 태그 API 호출 중...')
      const data = await getTechTags()
      
      // 스토어 업데이트
      techParts.value = data.techParts || []
      techStacks.value = data.techStacks || []
      popularTechStacks.value = data.popularTechStacks || []
      isLoaded.value = true
      lastLoadTime.value = Date.now()
      
      console.log('✅ 기술 태그 로드 완료:', {
        techParts: techParts.value,
        techStacksCount: techStacks.value.length,
        popularTechStacksCount: popularTechStacks.value.length
      })
      
      return {
        techParts: techParts.value,
        techStacks: techStacks.value,
        popularTechStacks: popularTechStacks.value
      }
    } catch (error) {
      console.error('❌ 기술 태그 로드 실패:', error)
      
      // 실패 시 기본값 사용
      if (!isLoaded.value) {
        techParts.value = [
          '프론트엔드', '백엔드', '풀스택', '모바일', '데브옵스', 
          '데이터사이언스', 'AI/ML', '게임개발', '보안', 'QA/테스터', 
          'UI/UX디자인', 'PM/기획'
        ]
        techStacks.value = [
          'JavaScript', 'React', 'Vue.js', 'Node.js', 'Python', 'Java', 
          'Spring Boot', 'TypeScript', 'Next.js', 'Express.js', 'Django', 
          'MySQL', 'PostgreSQL', 'MongoDB', 'AWS', 'Docker', 'Git', 
          'HTML/CSS', 'Flutter', 'React Native'
        ]
        popularTechStacks.value = []
        isLoaded.value = true
        lastLoadTime.value = Date.now()
      }
      
      return {
        techParts: techParts.value,
        techStacks: techStacks.value,
        popularTechStacks: popularTechStacks.value
      }
    }
  }
  
  // 캐시 초기화
  const clearCache = () => {
    techParts.value = []
    techStacks.value = []
    popularTechStacks.value = []
    isLoaded.value = false
    lastLoadTime.value = null
    console.log('🧹 기술 태그 캐시 초기화 완료')
  }
  
  // 특정 기술 파트 존재 여부 확인
  const hasTechPart = (partName) => {
    return techParts.value.includes(partName)
  }
  
  // 특정 기술 스택 존재 여부 확인
  const hasTechStack = (stackName) => {
    return techStacks.value.includes(stackName)
  }
  
  return {
    // 상태
    techParts,
    techStacks,
    popularTechStacks,
    isLoaded,
    lastLoadTime,
    
    // Getters
    getPopularTechStacksTop20,
    isCacheValid,
    
    // Actions
    loadTechTags,
    clearCache,
    hasTechPart,
    hasTechStack
  }
})