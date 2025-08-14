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
            <div v-for="project in filteredProjects.slice(0, 4)" :key="project.id" class="project-card">
              <div class="card-header">
                <div class="header-left">
                  <div class="status-title-container">
                    <div class="status-badge" v-if="project.status">
                      <span>{{ project.status }}</span>
                    </div>
                    <div class="title-container">
                      <h3 class="project-title">
                        {{ project.title.length > 40 ? project.title.slice(0, 40) + '...' : project.title }}
                      </h3>
                    </div>
                  </div>
                </div>
                <div class="header-right">
                  <div class="view-count-display">
                    👀 {{ project.viewCount || 0 }}
                  </div>
                  <button class="favorite-button" @click="toggleFavorite(project)" :class="{ 'favorited': project.isFavorite }">
                    <span v-if="project.isFavorite">❤️</span>
                    <span v-else>🤍</span>
                  </button>
                </div>
              </div>

              <div class="description-section" v-if="project.description">
                <p class="project-description">
                  {{ project.description.length > 100 ? project.description.slice(0, 100) + '...' : project.description }}
                </p>
              </div>

              <div class="category-tags-section">
                <div class="project-tags">
                  <div class="self-tag" v-for="tag in project.techStacks.slice(0, 4)" :key="tag.techStackName">
                    {{ tag.techStackName }}
                  </div>
                  <div class="self-tag more-tag" v-if="project.techStacks.length > 4">
                    +{{ project.techStacks.length - 4 }}
                  </div>
                </div>
              </div>

              <div class="project-info">
                <div class="info-item">
                  <div class="info-icon">
                    <i class="bi bi-clock"></i>
                  </div>
                  <div class="info-content">
                    <div class="info-label">진행 기간</div>
                    <div class="info-value">{{ calculateDuration(project.startDate, project.endDate) }}</div>
                  </div>
                </div>

                <div class="info-item">
                  <div class="info-icon">
                    <i class="bi bi-people"></i>
                  </div>
                  <div class="info-content">
                    <div class="info-label">모집 인원</div>
                    <div class="info-value">{{ project.recruitCount }}명</div>
                  </div>
                </div>

                <div class="info-item">
                  <div class="info-icon">
                    <i class="bi bi-person-plus"></i>
                  </div>
                  <div class="info-content">
                    <div class="info-label">지원자</div>
                    <div class="info-value">{{ project.appliedCount }}명</div>
                  </div>
                </div>

                <div class="info-item">
                  <div class="info-icon">
                    <i class="bi bi-calendar-event"></i>
                  </div>
                  <div class="info-content">
                    <div class="info-label">마감일정</div>
                    <div class="info-value" :class="{ 'urgent': isUrgent(project.deadline) }">{{ project.deadline }}</div>
                  </div>
                </div>
              </div>

              <div class="bottom-section">
                <button class="detail-button" @click="goToDetail(project)">
                  상세보기
                </button>
              </div>
            </div>
          </template>
          
          <template v-else>
            <div class="no-projects" key="no-projects">
              <div v-if="activeTab === 'ai' && isLoadingAI" class="ai-loading-message">
                <div class="loading-spinner"></div>
                <h3>🤖 AI가 당신에게 맞는 프로젝트를 찾고 있습니다...</h3>
                <p>사용자의 기술스택과 관심사를 분석하여<br>최적의 프로젝트를 추천해드리고 있어요.</p>
              </div>
              <div v-else-if="false" class="ai-setup-message">
                <div class="ai-setup-icon">🤖</div>
                <h3>AI 추천을 위해 로그인이 필요합니다</h3>
                <p>개인 맞춤형 프로젝트 추천을 받으려면 먼저 로그인해주세요.</p>
                <button class="setup-button" @click="router.push('/login')">
                  로그인하기
                </button>
              </div>
              <div v-else-if="activeTab === 'ai' && !hasUserTechStack" class="ai-setup-message">
                <div class="ai-setup-icon">⚙️</div>
                <h3>기술스택 설정이 필요합니다</h3>
                <p>AI가 당신에게 맞는 프로젝트를 추천하려면<br>마이페이지에서 관심 기술스택을 설정해주세요.</p>
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
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/userStore'
import api from '@/api/axios'

const router = useRouter()
const userStore = useUserStore()
const activeTab = ref('all')
const isLoadingAI = ref(false)
const aiRecommendedProjects = ref([])
const hasLoadedAIOnce = ref(false) // AI 추천을 한 번이라도 로드했는지 추적

// 사용자 기술스택 설정 여부 확인 (임시 - 실제로는 userStore에서 가져와야 함)
const hasUserTechStack = computed(() => {
  // TODO: 실제 사용자 기술스택 정보 확인 필요
  // return userStore.user?.techStacks?.length > 0
  
  // API 테스트를 위해 임시로 true로 설정
  return true // 실제로는 사용자 기술스택 설정 여부 확인
})

// 임시 하드코딩 데이터 제거 - AI 추천 테스트를 위해
const projects = ref([])

const filteredProjects = computed(() => {
  if (activeTab.value === 'all') return projects.value
  if (activeTab.value === 'ai') {
    // 임시 테스트용 - 로그인 체크 제거하고 기술스택만 확인
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

const toggleFavorite = (project) => {
  project.isFavorite = !project.isFavorite
}

const calculateDuration = (startDate, endDate) => {
  if (!startDate || !endDate) return '-'
  const start = new Date(startDate)
  const end = new Date(endDate)
  if (isNaN(start) || isNaN(end)) return '-'
  const diff = Math.round((end - start) / (1000 * 60 * 60 * 24)) + 1
  if (diff < 7) return `${diff}일`
  if (diff < 30) return `${Math.round(diff / 7)}주`
  return `${Math.round(diff / 30)}개월`
}

const isUrgent = (deadline) => {
  if (!deadline) return false
  const dayMatch = deadline.match(/D-(\d+)/)
  if (dayMatch) {
    const days = parseInt(dayMatch[1])
    return days <= 7
  }
  return false
}

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
      techStacks: selectedTechStacks
    }
    
    const response = await fetch('http://localhost:8082/api/recommend/projects?topN=5&minScore=0.3&minOverlap=0.1&strict=false', {
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
    })
    
    // 응답 데이터를 프론트엔드 프로젝트 형식으로 변환
    return projects.map(project => ({
      id: project.projectId,
      title: project.title,
      description: project.description,
      techStacks: project.projectTechStacks?.map(tech => ({ techStackName: tech })) || [],
      status: '모집중', // 기본값
      startDate: '2024-01-01', // 기본값
      endDate: '2024-12-31', // 기본값
      recruitCount: 3, // 기본값
      appliedCount: Math.floor(Math.random() * 10), // 랜덤값
      deadline: `D-${Math.floor(Math.random() * 30)}`, // 랜덤값
      category: 'ai', // AI 추천 카테고리
      viewCount: Math.floor(Math.random() * 200), // 랜덤값
      isFavorite: false,
      matchScore: project.matchScore // AI 점수
    }))
    
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
  if (newTab === 'ai' && hasUserTechStack.value) {
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


</style>