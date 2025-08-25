<template>
  <section class="project-section">
    <div class="container">
      <div class="section-header">
        <h2 class="section-title">진행중인 프로젝트</h2>
        <router-link to="/projects" class="more-link">
          <span>더보기</span>
          <svg width="19" height="20" viewBox="0 0 19 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path opacity="0.01" d="M19 0.189941H0V19.1899H19V0.189941Z" fill="white" />
            <path d="M10 6.18799L14 10.188L10 14.188" stroke="#262626" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M14 10.168H5" stroke="#262626" stroke-linecap="round" />
          </svg>
        </router-link>
      </div>

      <div class="filter-tabs">
        <div class="tab" :class="{ active: activeTab === 'all' }" @click="activeTab = 'all'">전체</div>
        <div class="tab" :class="{ active: activeTab === 'ai' }" @click="activeTab = 'ai'">AI 추천</div>
        <div class="tab" :class="{ active: activeTab === 'frontend' }" @click="activeTab = 'frontend'">프론트엔드</div>
        <div class="tab" :class="{ active: activeTab === 'backend' }" @click="activeTab = 'backend'">백엔드</div>
        <div class="tab" :class="{ active: activeTab === 'app' }" @click="activeTab = 'app'">앱 개발</div>
        <div class="tab" :class="{ active: activeTab === 'design' }" @click="activeTab = 'design'">디자인</div>
        <div class="tab" :class="{ active: activeTab === 'infra' }" @click="activeTab = 'infra'">인프라</div>
      </div>


      <transition name="slide-fade" mode="out-in">
        <div class="projects-grid" :key="activeTab + '-' + filteredProjects.length">
          <template v-if="filteredProjects.length > 0">
            <ProjectCard
                v-for="project in filteredProjects.slice(0, 4)"
                :key="project.id"
                :project="project"
            />
          </template>
          
          <template v-else>
            <div class="no-projects" key="no-projects">
              <div v-if="activeTab === 'ai' && isLoadingAI" class="ai-loading-message">
                <div class="loading-spinner"></div>
                <h3>🤖 AI가 당신에게 맞는 프로젝트를 찾고 있습니다...</h3>
                <p>사용자의 기술스택과 관심사를 분석하여<br>최적의 프로젝트를 추천해드리고 있어요.</p>
              </div>
              <div v-else-if="activeTab === 'ai' && !isUserLoggedIn" class="ai-setup-message">
                <div class="ai-setup-icon">🤖</div>
                <h3>AI 추천을 위해 로그인이 필요합니다</h3>
                <p>개인 맞춤형 프로젝트 추천을 받으려면 먼저 로그인해주세요.</p>
                <div class="popular-preview">
                  <h4>🔥 현재 인기 프로젝트</h4>
                  <div class="popular-list">
                    <div v-for="project in getPopularProjects().slice(0, 3)" :key="project.id" class="popular-item" @click="goToDetail(project)">
                      <span class="popular-title">{{ project.title }}</span>
                      <span class="popular-views">👀 {{ project.viewCount }}</span>
                    </div>
                  </div>
                </div>
                <button class="setup-button" @click="router.push('/login')">
                  로그인하기
                </button>
              </div>
              <div v-else-if="activeTab === 'ai' && !hasUserTechStack" class="ai-setup-message">
                <div class="ai-setup-icon">⚙️</div>
                <h3>기술스택 설정이 필요합니다</h3>
                <p>AI가 당신에게 맞는 프로젝트를 추천하려면<br>마이페이지에서 관심 기술스택을 설정해주세요.</p>
                <div class="popular-preview">
                  <h4>⭐ 지금은 인기 프로젝트를 확인해보세요!</h4>
                  <div class="popular-list">
                    <div v-for="project in getPopularProjects().slice(0, 3)" :key="project.id" class="popular-item" @click="goToDetail(project)">
                      <span class="popular-title">{{ project.title }}</span>
                      <span class="popular-views">👀 {{ project.viewCount }}</span>
                    </div>
                  </div>
                </div>
                <button class="setup-button" @click="router.push('/myPage/edit-profile')">
                  기술스택 설정하기
                </button>
              </div>
              <div v-else-if="activeTab !== 'ai' || (!isLoadingAI && hasLoadedAIOnce && aiRecommendedProjects.length === 0)">
                등록된 프로젝트가 없습니다.
              </div>
            </div>
          </template>
        </div>
      </transition>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/userStore'
import api from '@/api/axios'
import ProjectCard from '@/components/projectComponents/ProjectCard.vue'

const router = useRouter()
const userStore = useUserStore()
const activeTab = ref('all')
const isLoadingAI = ref(false)
const aiRecommendedProjects = ref([])
const hasLoadedAIOnce = ref(false) // AI 추천을 한 번이라도 로드했는지 추적

const isUserLoggedIn = computed(() => {
  return userStore.isLoggedIn
})

const hasUserTechStack = computed(() => {
  // TODO: 실제 사용자 기술스택 정보 확인 필요
  // return userStore.user?.techStacks?.length > 0
  
  // 기술스택 미설정 테스트를 위해 false로 설정
  return false // 기술스택 설정 유도 메시지 테스트용
})

// 프로젝트 데이터 로드
const projects = ref([])

// 마감일을 D-N 형식으로 변환하는 공통 함수
const formatDeadline = (deadline) => {
  if (!deadline) return '-'
  
  let deadlineDate = new Date(deadline)
  const today = new Date()
  
  // 과거 날짜인 경우 2025년으로 조정 (임시 해결책)
  if (deadlineDate < today) {
    deadlineDate.setFullYear(2025)
  }
  
  const diffTime = deadlineDate - today
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  
  if (diffDays < 0) return '마감'
  if (diffDays === 0) return 'D-Day'
  return `D-${diffDays}`
}

// 프로젝트 목록 API 호출
const fetchProjects = async () => {
  try {
    const response = await api.get('/projects')
    const apiProjects = response.data || []
    
    // API 데이터를 ProjectCard에 맞게 변환
    projects.value = apiProjects.map(project => ({
      ...project,
      id: project.projectId, // key를 위한 id 보장
      // ProjectCard가 자체적으로 계산하므로 중복 계산 제거
      // deadline: formatDeadline(project.recruitDeadline), 
      category: mapCategoryFromTechStacks(project.techStacks),
    }))
  } catch (error) {
    // API 실패 시 빈 배열 유지
    projects.value = []
  }
}

// 기술스택 기반 카테고리 매핑
const mapCategoryFromTechStacks = (techStacks) => {
  if (!techStacks?.length) return 'backend'
  
  const stackNames = techStacks.map(t => t.techStackName?.toLowerCase() || '').join(' ')
  
  if (stackNames.includes('react') || stackNames.includes('vue') || stackNames.includes('angular')) return 'frontend'
  if (stackNames.includes('flutter') || stackNames.includes('react native') || stackNames.includes('ios') || stackNames.includes('android')) return 'app'
  if (stackNames.includes('docker') || stackNames.includes('kubernetes') || stackNames.includes('aws')) return 'infra'
  if (stackNames.includes('figma') || stackNames.includes('design')) return 'design'
  
  return 'backend' // 기본값
}

const filteredProjects = computed(() => {
  if (activeTab.value === 'all') return projects.value
  if (activeTab.value === 'ai') {
    // 로그인 안된 사용자 - 빈 배열 반환 (로그인 메시지가 표시됨)
    if (!isUserLoggedIn.value) {
      return []
    }
    // 로그인했지만 기술스택 미설정
    if (!hasUserTechStack.value) {
      return []
    }
    // 로딩 중일 때는 빈 배열 (로딩 메시지가 표시됨)
    if (isLoadingAI.value) {
      return []
    }
    // 로딩이 끝났고 추천 결과가 있으면 표시
    return aiRecommendedProjects.value
  }
  return projects.value.filter(p => p.category === activeTab.value)
})

// 인기 프로젝트 조회 (viewCount 기준)
const getPopularProjects = () => {
  // 로컬 데이터에서 인기순 정렬
  return [...projects.value]
    .sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0))
}

// 백엔드 API에서 인기 프로젝트 조회
const fetchPopularProjects = async (limit = 5) => {
  try {
    const response = await fetch(`http://localhost:8000/api/projects/popular?limit=${limit}`)
    const data = await response.json()
    
    return data.map(project => ({
      id: project.project_id || project.projectId,
      title: project.title,
      description: project.description,
      techStacks: project.project_tech_stacks?.map(tech => ({ techStackName: tech })) || [],
      status: project.status === 'RECRUITING' ? '모집중' : project.status,
      startDate: project.start_date,
      endDate: project.end_date,
      recruitCount: project.recruit_count,
      appliedCount: project.applied_count,
      deadline: project.recruit_deadline,
      viewCount: project.view_count,
      isFavorite: false
    }))
  } catch (error) {
    console.error('❌ 인기 프로젝트 조회 실패:', error)
    return getPopularProjects() // fallback으로 로컬 데이터 사용
  }
}

// 컴포넌트 마운트 시 프로젝트 데이터 로드
onMounted(() => {
  // 테스트: 로그아웃 상태로 만들기 (비활성화)
  // localStorage.removeItem('accessToken')
  // 로그인 상태 체크
  // userStore.checkLogin()
  fetchProjects()
})

// AI 추천 API 호출
const fetchAIRecommendations = async () => {
  console.log('🚀 AI 추천 API 호출 시작')
  isLoadingAI.value = true
  
  // 최소 로딩 시간 보장 (UX 개선)
  const minLoadingTime = 1500 // 1.5초
  const startTime = Date.now()
  
  try {
    // 임시 테스트용 - 다양한 기술스택 조합 중 랜덤 선택
    const testTechStacks = [
      // JavaScript + React 사용자 (프로젝트 3, 4와 매칭 예상)
      [
        { name: "JavaScript", level: 4 },
        { name: "React", level: 3 },
        { name: "Node.js", level: 2 }
      ],
      // Python 개발자 (프로젝트 6, 11, 20과 매칭 예상)  
      [
        { name: "Python", level: 4 },
        { name: "Django", level: 3 },
        { name: "PostgreSQL", level: 2 }
      ],
      // Vue.js 개발자 (프로젝트 1, 5와 매칭 예상)
      [
        { name: "Vue.js", level: 4 },
        { name: "TypeScript", level: 3 },
        { name: "Docker", level: 2 }
      ],
      // Java + Spring 개발자 (프로젝트 2, 7과 매칭 예상)
      [
        { name: "Java", level: 4 },
        { name: "Spring Boot", level: 4 },
        { name: "PostgreSQL", level: 3 }
      ],
      // 모바일 개발자 (프로젝트 9, 10과 매칭 예상)
      [
        { name: "React Native", level: 3 },
        { name: "TypeScript", level: 3 },
        { name: "Firebase", level: 2 }
      ]
    ]
    
    // 랜덤하게 기술스택 선택하여 다양한 추천 결과 확인
    const randomIndex = Math.floor(Math.random() * testTechStacks.length)
    const selectedTechStacks = testTechStacks[randomIndex]
    
    console.log(`\n🎯 테스트 케이스 ${randomIndex + 1}: ${selectedTechStacks.map(t => t.name).join(', ')}`)
    
    const requestBody = {
      userId: userStore.userId || 1,
      techStacks: selectedTechStacks,
      experienceLevel: "intermediate",
      preferredCategories: [],
      maxResults: 5
    }
    
    const response = await fetch(`http://localhost:${import.meta.env.VITE_BACK_PORT || 8080}/api/recommend/projects?topN=5&minScore=0.3&minOverlap=0.1&strict=false`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody)
    })
    
    const responseData = await response.json()
    const projects = Array.isArray(responseData) ? responseData : []
    
    if (projects.length === 0) {
      console.log('⚠️ 추천 프로젝트가 없습니다')
      return []
    }
    
    // 📊 추천 결과 요약 출력
    console.log('📊 추천 결과:')
    projects.forEach((project, index) => {
      console.log(`  ${index + 1}. ${project.title} (점수: ${project.matchScore?.toFixed(2) || 'N/A'})`)
      
      // 🔍 추천 설명 데이터 확인
      if (project.explanation) {
        console.log(`    💡 ${project.explanation.simple_explanation || project.explanation.main_reason}`)
        if (project.explanation.matched_skills?.length > 0) {
          console.log(`    ✅ 매칭 기술: ${project.explanation.matched_skills.join(', ')}`)
        }
        if (project.explanation.growth_opportunities?.length > 0) {
          console.log(`    🌱 성장 기회: ${project.explanation.growth_opportunities.join(', ')}`)
        }
      } else {
        console.log(`    ❌ explanation 데이터 없음`)
      }
    })
    
    // 응답 데이터를 프론트엔드 프로젝트 형식으로 변환
    return projects.map(project => {
      console.log('🔍 변환 중인 프로젝트:', project.title)
      console.log('  - recruitCount (camelCase):', project.recruitCount)
      console.log('  - appliedCount (camelCase):', project.appliedCount) 
      console.log('  - recruitDeadline (camelCase):', project.recruitDeadline)
      console.log('  - startDate (camelCase):', project.startDate)
      console.log('  - endDate (camelCase):', project.endDate)
      console.log('  - projectTechStacks:', project.projectTechStacks)
      
      const recruitDeadline = project.RecruitDeadline || project.recruit_deadline
      
      return {
        id: project.projectId || project.project_id,
        title: project.title,
        description: project.description,
        techStacks: project.projectTechStacks?.map(tech => ({ techStackName: tech })) || project.project_tech_stacks?.map(tech => ({ techStackName: tech })) || [],
        status: project.status === 'RECRUITING' ? '모집중' : project.status,
        startDate: project.startDate || project.start_date,
        endDate: project.endDate || project.end_date,
        recruitCount: project.recruitCount || project.recruit_count,
        appliedCount: project.appliedCount || project.applied_count,
        deadline: formatDeadline(recruitDeadline), // 👈 공통 함수 사용
        category: 'ai', // AI 추천 카테고리
        viewCount: project.viewCount || project.view_count,
        isFavorite: false,
        matchScore: project.matchScore || project.match_score, // AI 점수
        explanation: project.explanation // AI 추천 설명 데이터
      }
    })
    
  } catch (error) {
    console.error('❌ AI 추천 조회 실패:', error.message)
    return []
  } finally {
    // 최소 로딩 시간 보장
    const elapsedTime = Date.now() - startTime
    const remainingTime = Math.max(0, minLoadingTime - elapsedTime)
    
    if (remainingTime > 0) {
      await new Promise(resolve => setTimeout(resolve, remainingTime))
    }
    
    isLoadingAI.value = false
  }
}

const goToDetail = (project) => {
  project.viewCount = (project.viewCount || 0) + 1
  router.push(`/projects/${project.id}`)
}

// AI 탭 선택 시마다 새로운 추천 데이터 불러오기
watch(activeTab, async (newTab) => {
  if (newTab === 'ai' && isUserLoggedIn.value && hasUserTechStack.value) {
    const recommendations = await fetchAIRecommendations()
    aiRecommendedProjects.value = recommendations
    hasLoadedAIOnce.value = true
  }
})
</script>

<style scoped>
.project-section {
  display: flex;
  min-height: 849px;
  padding: 90px 0 0 0;
  justify-content: center;
  align-items: flex-start;
  align-self: stretch;
  background: #FFF;
}

.container {
  display: flex;
  width: 1320px;
  flex-direction: column;
  align-items: flex-start;
  gap: 30px;
  align-self: stretch;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  align-self: stretch;
}

.section-title {
  color: #262626;
  font-size: 24px;
  font-weight: 400;
  line-height: 45px;
  margin: 0;
}

.more-link {
  display: flex;
  align-items: center;
  gap: 5px;
  text-decoration: none;
  color: #262626;
  font-size: 15px;
  font-weight: 400;
  line-height: 27px;
}

.filter-tabs {
  display: flex;
  width: 100%;
  height: 42px;
  padding-bottom: 1px;
  align-items: flex-start;
  gap: 60px;
  border-bottom: 1px solid #E8E8E8;
}

.tab {
  display: flex;
  padding: 0 10px 5px 10px;
  flex-direction: column;
  align-items: center;
  color: #555;
  text-align: center;
  font-size: 14px;
  font-weight: 400;
  line-height: 27px;
  cursor: pointer;
  height: 41px;
  justify-content: center;
  transition: all 0.2s ease;
}

.tab.active {
  color: #4CAF50;
  border-bottom: 5px solid #4CAF50;
  font-weight: 600;
}

.tab:hover {
  color: #4CAF50;
}

.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.4s ease;
}

.slide-fade-enter-from {
  opacity: 0;
  transform: translateX(20px);
}

.slide-fade-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}

.projects-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
  width: 100%;
}

.project-card {
  display: flex;
  padding: 24px;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
  border-radius: 12px;
  border: 2px solid rgba(76, 175, 80, 0.1);
  background: #FFF;
  box-shadow: 0 4px 12px rgba(76, 175, 80, 0.08);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  cursor: pointer;
}

.project-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #4CAF50 0%, #2E7D32 100%);
  border-radius: 12px 12px 0 0;
}

.project-card:hover {
  transform: translateY(-4px);
  border-color: rgba(76, 175, 80, 0.3);
  box-shadow: 0 8px 25px rgba(76, 175, 80, 0.15);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  width: 100%;
  margin-bottom: 16px;
}

.header-left {
  display: flex;
  align-items: center;
  flex: 1;
}

.status-title-container {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 12px;
  flex: 1;
}

.status-badge {
  display: inline-flex;
  padding: 6px 12px;
  align-items: center;
  border-radius: 20px;
  background: #E8F5E8;
  border: 1px solid #4CAF50;
}

.status-badge span {
  color: #2E7D32;
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.2px;
}

.title-container {
  display: flex;
  align-items: center;
  width: 100%;
}

.project-title {
  margin: 0;
  color: #262626;
  font-size: 18px;
  font-weight: 700;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.header-right {
  display: flex;
  align-items: center;
  padding-left: 16px;
  flex-shrink: 0;
}

.view-count-display {
  font-size: 14px;
  color: #666;
  margin-right: 12px;
  display: flex;
  align-items: center;
  gap: 4px;
}

.favorite-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: #FFF;
  border: 2px solid #E0E0E0;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.3s ease;
  color: #757575;
  font-size: 16px;
}

.favorite-button:hover {
  background: rgba(76, 175, 80, 0.1);
  border-color: #4CAF50;
  color: #4CAF50;
  transform: scale(1.1);
}

.favorite-button.favorited {
  background: #FF5722;
  border-color: #FF5722;
  color: #FFF;
}

.description-section {
  width: 100%;
  margin-bottom: 16px;
}

.project-description {
  margin: 0;
  color: #424242;
  font-size: 14px;
  font-weight: 400;
  line-height: 1.6;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
  -webkit-line-clamp: 2;
  text-overflow: ellipsis;
}

.category-tags-section {
  display: flex;
  width: 100%;
  margin-bottom: 20px;
}

.project-tags {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.self-tag {
  display: inline-flex;
  padding: 6px 12px;
  align-items: center;
  border-radius: 16px;
  background: rgba(76, 175, 80, 0.1);
  border: 1px solid rgba(76, 175, 80, 0.2);
  color: #2E7D32;
  font-size: 12px;
  font-weight: 500;
  white-space: nowrap;
  transition: all 0.2s ease;
}

.more-tag {
  background: rgba(128, 128, 128, 0.1);
  border-color: rgba(128, 128, 128, 0.2);
  color: #666;
}

.project-info {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  width: 100%;
  padding: 20px;
  border-radius: 8px;
  background: rgba(76, 175, 80, 0.05);
  border: 1px solid rgba(76, 175, 80, 0.1);
  margin-bottom: 20px;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 12px;
}

.info-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: #4CAF50;
  color: #FFF;
  font-size: 14px;
  flex-shrink: 0;
}

.info-content {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.info-label {
  color: #6F6F72;
  font-size: 12px;
  font-weight: 500;
  line-height: 1;
}

.info-value {
  color: #262626;
  font-size: 14px;
  font-weight: 700;
  line-height: 1;
}

.info-value.urgent {
  color: #dc3545;
  font-weight: 700;
}

.bottom-section {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  margin-top: 8px;
}

.detail-button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  width: 90%;
  padding: 14px 32px;
  background: linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%);
  color: #FFF;
  border: none;
  border-radius: 12px;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 6px 20px rgba(76, 175, 80, 0.3);
  position: relative;
  overflow: hidden;
}

.detail-button:hover {
  background: linear-gradient(135deg, #388E3C 0%, #1B5E20 100%);
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(76, 175, 80, 0.4);
}

.no-projects {
  grid-column: 1 / -1;
  justify-self: center;
  align-self: center;
  font-size: 16px;
  color: #999;
  padding: 60px 0;
}

/* AI 설정 메시지 스타일 */
.ai-setup-message {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  padding: 60px 40px;
  background: rgba(76, 175, 80, 0.05);
  border-radius: 16px;
  border: 2px dashed rgba(76, 175, 80, 0.2);
  text-align: center;
  max-width: 500px;
}

.ai-setup-icon {
  font-size: 48px;
  margin-bottom: 10px;
}

.ai-setup-message h3 {
  margin: 0;
  color: #262626;
  font-size: 20px;
  font-weight: 600;
}

.ai-setup-message p {
  margin: 0;
  color: #666;
  font-size: 14px;
  line-height: 1.5;
}

.setup-button {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  background: linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%);
  color: #FFF;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none;
}

.setup-button:hover {
  background: linear-gradient(135deg, #388E3C 0%, #1B5E20 100%);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(76, 175, 80, 0.3);
}

/* 인기 프로젝트 미리보기 스타일 */
.popular-preview {
  width: 100%;
  margin: 20px 0;
  padding: 16px;
  background: rgba(255, 255, 255, 0.7);
  border-radius: 8px;
  border: 1px solid rgba(76, 175, 80, 0.2);
}

.popular-preview h4 {
  margin: 0 0 12px 0;
  color: #2E7D32;
  font-size: 14px;
  font-weight: 600;
  text-align: center;
}

.popular-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.popular-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  background: rgba(76, 175, 80, 0.05);
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid rgba(76, 175, 80, 0.1);
}

.popular-item:hover {
  background: rgba(76, 175, 80, 0.1);
  border-color: rgba(76, 175, 80, 0.3);
  transform: translateX(4px);
}

.popular-title {
  color: #2E7D32;
  font-size: 13px;
  font-weight: 500;
  flex: 1;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  margin-right: 8px;
}

.popular-views {
  color: #666;
  font-size: 12px;
  font-weight: 400;
  flex-shrink: 0;
}

/* AI 로딩 메시지 스타일 */
.ai-loading-message {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  padding: 60px 40px;
  background: rgba(129, 199, 132, 0.05);
  border-radius: 16px;
  border: 2px solid rgba(129, 199, 132, 0.2);
  text-align: center;
  max-width: 500px;
}

.ai-loading-message h3 {
  margin: 0;
  color: #262626;
  font-size: 18px;
  font-weight: 600;
}

.ai-loading-message p {
  margin: 0;
  color: #666;
  font-size: 14px;
  line-height: 1.5;
}

/* 로딩 스피너 */
.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid rgba(129, 199, 132, 0.2);
  border-left: 4px solid #81C784;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* AI 추천 설명 섹션 스타일 */
.ai-explanation-section {
  width: 100%;
  margin-bottom: 16px;
  padding: 16px;
  background: linear-gradient(135deg, rgba(129, 199, 132, 0.1) 0%, rgba(76, 175, 80, 0.1) 100%);
  border: 1px solid rgba(76, 175, 80, 0.3);
  border-radius: 8px;
  position: relative;
}

.explanation-header {
  margin-bottom: 8px;
}

.ai-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  background: linear-gradient(135deg, #81C784 0%, #4CAF50 100%);
  color: white;
  font-size: 12px;
  font-weight: 600;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(76, 175, 80, 0.3);
}

.explanation-content {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.main-reason {
  margin: 0;
  color: #2E7D32;
  font-size: 13px;
  font-weight: 500;
  line-height: 1.4;
}

.skill-match,
.growth-opportunities {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 4px;
  font-size: 12px;
}

.skill-label,
.growth-label {
  color: #388E3C;
  font-weight: 600;
  white-space: nowrap;
}

.skill-list,
.growth-list {
  color: #2E7D32;
  font-weight: 500;
  line-height: 1.3;
}

/* AI 탭에서 프로젝트 카드 강조 */
.tab.active[data-tab="ai"] ~ .projects-grid .project-card {
  border-color: rgba(129, 199, 132, 0.3);
}

.tab.active[data-tab="ai"] ~ .projects-grid .project-card:hover {
  border-color: rgba(129, 199, 132, 0.5);
  box-shadow: 0 8px 25px rgba(129, 199, 132, 0.2);
}


</style>