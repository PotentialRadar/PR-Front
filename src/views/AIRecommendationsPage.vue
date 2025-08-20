<template>
  <div class="ai-recommendations-page">
    <!-- 페이지 헤더 -->
    <PageHeader 
      title="AI 추천"
      subtitle="AI가 당신의 기술스택과 관심사를 분석하여 맞춤형 프로젝트를 추천해드립니다"
    />

    <!-- 기술스택 설정 상태 -->
    <div class="container">
      <div class="tech-stack-status" v-if="userTechStacks.length > 0">
        <div class="status-header">
          <h3>현재 설정된 기술스택</h3>
          <button @click="showTechStackModal = true" class="edit-button">
            편집
          </button>
        </div>
        <div class="tech-stack-list">
          <div 
            v-for="tech in userTechStacks" 
            :key="tech.name"
            class="tech-item"
          >
            <span class="tech-name">{{ tech.name }}</span>
            <span class="tech-level">Lv.{{ tech.level }}</span>
          </div>
        </div>
      </div>

      <!-- 추천 프로젝트 섹션 -->
      <div class="recommendations-section">
        <div class="section-header">
          <h2>🎯 당신을 위한 추천 프로젝트</h2>
          <div class="stats" v-if="recommendations.length > 0">
            <span class="stat-item">
              📊 총 {{ recommendations.length }}개 프로젝트 발견
            </span>
          </div>
        </div>

        <!-- 로딩 상태 -->
        <div v-if="isLoading" class="loading-state">
          <div class="loading-spinner"></div>
          <p>AI가 당신에게 맞는 프로젝트를 분석하고 있습니다...</p>
        </div>

        <!-- 로그인 안된 상태 -->
        <div v-else-if="!userStore.isLoggedIn" class="empty-state">
          <div class="empty-icon">🔐</div>
          <h3>AI 추천을 위해 로그인이 필요합니다</h3>
          <p>개인 맞춤형 프로젝트 추천을 받으려면 먼저 로그인해주세요.</p>
          <div class="popular-preview">
            <h4>🔥 지금은 인기 프로젝트를 확인해보세요!</h4>
            <div class="popular-projects-grid">
              <div 
                v-for="project in popularProjects.slice(0, 6)" 
                :key="project.id"
                class="popular-project-card"
                @click="goToProject(project.id)"
              >
                <h4 class="popular-project-title">{{ project.title }}</h4>
                <p class="popular-project-description">{{ project.description?.slice(0, 80) }}...</p>
                <div class="popular-project-stats">
                  <span class="popular-stat">👀 {{ project.viewCount || 0 }}</span>
                  <span class="popular-stat">❤️ {{ project.appliedCount || 0 }}</span>
                </div>
                <div class="popular-tech-stacks">
                  <span 
                    v-for="tech in project.techStacks?.slice(0, 3)" 
                    :key="tech.techStackName"
                    class="popular-tech-tag"
                  >
                    {{ tech.techStackName }}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <button @click="router.push('/login')" class="primary-button">
            로그인하기
          </button>
        </div>

        <!-- 기술스택 미설정 상태 -->
        <div v-else-if="userTechStacks.length === 0" class="empty-state">
          <div class="empty-icon">🔧</div>
          <h3>기술스택을 설정해주세요</h3>
          <p>기술스택과 경험 수준을 설정하시면 AI가 맞춤형 프로젝트를 추천해드립니다.</p>
          <div class="popular-preview">
            <h4>🔥 지금은 인기 프로젝트를 확인해보세요!</h4>
            <div class="popular-projects-grid">
              <div 
                v-for="project in popularProjects.slice(0, 6)" 
                :key="project.id"
                class="popular-project-card"
                @click="goToProject(project.id)"
              >
                <h4 class="popular-project-title">{{ project.title }}</h4>
                <p class="popular-project-description">{{ project.description?.slice(0, 80) }}...</p>
                <div class="popular-project-stats">
                  <span class="popular-stat">👀 {{ project.viewCount || 0 }}</span>
                  <span class="popular-stat">❤️ {{ project.appliedCount || 0 }}</span>
                </div>
                <div class="popular-tech-stacks">
                  <span 
                    v-for="tech in project.techStacks?.slice(0, 3)" 
                    :key="tech.techStackName"
                    class="popular-tech-tag"
                  >
                    {{ tech.techStackName }}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <button @click="showTechStackModal = true" class="primary-button">
            기술스택 설정하기
          </button>
        </div>

        <!-- 추천 결과 없음 (로그인 되어 있고 기술스택도 설정됨) -->
        <div v-else-if="userStore.isLoggedIn && userTechStacks.length > 0 && !isLoading && recommendations.length === 0" class="empty-state">
          <div class="empty-icon">🔍</div>
          <h3>추천 가능한 프로젝트가 없습니다</h3>
          <p>다른 기술스택이나 경험 수준으로 다시 시도해보세요.</p>
          <button @click="loadRecommendations" class="primary-button">
            다시 검색
          </button>
        </div>

        <!-- 피드백 통계 (추천 결과가 있을 때만 표시) -->
        <div v-if="userStore.isLoggedIn && userTechStacks.length > 0 && recommendations.length > 0" class="feedback-stats">
          <h4 class="stats-title">📊 추천 평가 현황</h4>
          <div class="stats-grid">
            <div class="stat-card positive">
              <div class="stat-icon">👍</div>
              <div class="stat-content">
                <div class="stat-number">{{ feedbackStats.likes }}</div>
                <div class="stat-label">좋아요</div>
              </div>
            </div>
            <div class="stat-card negative">
              <div class="stat-icon">👎</div>
              <div class="stat-content">
                <div class="stat-number">{{ feedbackStats.dislikes }}</div>
                <div class="stat-label">별로예요</div>
              </div>
            </div>
            <div class="stat-card neutral">
              <div class="stat-icon">📈</div>
              <div class="stat-content">
                <div class="stat-number">{{ feedbackStats.total }}</div>
                <div class="stat-label">총 평가</div>
              </div>
            </div>
            <div class="stat-card accuracy">
              <div class="stat-icon">🎯</div>
              <div class="stat-content">
                <div class="stat-number">{{ feedbackStats.accuracy }}%</div>
                <div class="stat-label">만족도</div>
              </div>
            </div>
          </div>
        </div>

        <!-- 추천 프로젝트 리스트 (로그인 되어 있고 기술스택 설정되고 추천 결과가 있음) -->
        <div v-else-if="userStore.isLoggedIn && userTechStacks.length > 0 && recommendations.length > 0" class="projects-grid">
          <div 
            v-for="project in recommendations" 
            :key="project.projectId"
            class="project-card"
            @click="goToProject(project.projectId)"
          >
            <!-- 프로젝트 헤더 -->
            <div class="project-header">
              <div class="project-title-row">
                <h3 class="project-title">{{ project.title }}</h3>
                <div class="match-score">
                  <span class="score-label">매칭도</span>
                  <span class="score-value">{{ (project.matchScore * 100).toFixed(0) }}%</span>
                </div>
              </div>
              <p class="project-description">{{ project.description }}</p>
            </div>

            <!-- 프로젝트 정보 -->
            <div class="project-info">
              <div class="info-grid">
                <div class="info-item">
                  <span class="info-label">진행기간</span>
                  <span class="info-value">{{ formatDateRange(project.startDate, project.endDate) }}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">모집인원</span>
                  <span class="info-value">{{ project.recruitCount }}명</span>
                </div>
                <div class="info-item">
                  <span class="info-label">지원자</span>
                  <span class="info-value">{{ project.appliedCount }}명</span>
                </div>
                <div class="info-item">
                  <span class="info-label">마감일정</span>
                  <span class="info-value" :class="{ 'urgent': isUrgent(project.recruitDeadline) }">
                    {{ formatDate(project.recruitDeadline) }}
                  </span>
                </div>
              </div>
            </div>

            <!-- 기술스택 -->
            <div class="tech-stacks">
              <div class="tech-stacks-header">
                <span class="tech-label">기술스택</span>
              </div>
              <div class="tech-tags">
                <span 
                  v-for="tech in project.projectTechStacks" 
                  :key="tech"
                  class="tech-tag"
                  :class="{ 'matched': isUserTech(tech) }"
                >
                  {{ tech }}
                </span>
              </div>
            </div>

            <!-- AI 추천 이유 -->
            <div v-if="project.explanation" class="ai-explanation">
              <div class="explanation-header">
                <span class="ai-badge">🤖 AI 추천 이유</span>
              </div>
              <div class="explanation-content">
                <p class="main-reason">{{ project.explanation.simple_explanation || project.explanation.main_reason }}</p>
                
                <div v-if="project.explanation.matched_skills?.length > 0" class="skill-section">
                  <span class="section-label">✅ 보유 기술:</span>
                  <span class="skill-list">{{ project.explanation.matched_skills.join(', ') }}</span>
                </div>
                
                <div v-if="project.explanation.growth_opportunities?.length > 0" class="skill-section">
                  <span class="section-label">🌱 성장 기회:</span>
                  <span class="skill-list">{{ project.explanation.growth_opportunities.join(', ') }}</span>
                </div>
              </div>
            </div>

            <!-- 추천 평가 -->
            <div class="recommendation-feedback">
              <span class="feedback-label">이 추천이 도움이 되셨나요?</span>
              <div class="feedback-buttons">
                <button 
                  class="feedback-btn thumbs-up"
                  :class="{ active: getFeedback(project.projectId) === 'like' }"
                  @click.stop="handleFeedback(project.projectId, 'like')"
                  title="좋아요"
                >
                  <i class="bi bi-hand-thumbs-up-fill"></i>
                  <span>좋아요</span>
                </button>
                <button 
                  class="feedback-btn thumbs-down"
                  :class="{ active: getFeedback(project.projectId) === 'dislike' }"
                  @click.stop="handleFeedback(project.projectId, 'dislike')"
                  title="별로예요"
                >
                  <i class="bi bi-hand-thumbs-down-fill"></i>
                  <span>별로예요</span>
                </button>
              </div>
            </div>

            <!-- 프로젝트 상태 -->
            <div class="project-footer">
              <div class="project-status">
                <span class="status-badge recruiting">모집중</span>
              </div>
              <div class="project-actions">
                <button class="view-button" @click.stop="goToProject(project.projectId)">
                  자세히 보기
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 기술스택 설정 모달 -->
    <TechStackModal 
      v-if="showTechStackModal"
      :initialTechStacks="userTechStacks"
      @close="showTechStackModal = false"
      @save="handleTechStackSave"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/userStore'
import { useToast } from 'vue-toastification'
import PageHeader from '@/components/common/PageHeader.vue'
import TechStackModal from '@/components/common/TechStackModal.vue'

const router = useRouter()
const userStore = useUserStore()
const toast = useToast()

// 반응형 데이터
const isLoading = ref(false)
const showTechStackModal = ref(false)
const userTechStacks = ref([])
const recommendations = ref([])
const popularProjects = ref([])
const projectFeedbacks = ref(new Map()) // 프로젝트별 피드백 저장

// 계산된 속성
const userTechNames = computed(() => userTechStacks.value.map(tech => tech.name.toLowerCase()))

// 피드백 통계 계산
const feedbackStats = computed(() => {
  const feedbacks = Array.from(projectFeedbacks.value.values())
  const likes = feedbacks.filter(f => f === 'like').length
  const dislikes = feedbacks.filter(f => f === 'dislike').length
  const total = feedbacks.length
  const accuracy = total > 0 ? Math.round((likes / total) * 100) : 0
  
  return {
    likes,
    dislikes,
    total,
    accuracy
  }
})

// 메서드
const loadRecommendations = async () => {
  if (userTechStacks.value.length === 0) {
    return
  }

  isLoading.value = true
  
  try {
    const requestData = {
      userId: userStore.userId, // 실제 로그인한 사용자 ID 사용
      techStacks: userTechStacks.value,
      experienceLevel: "intermediate",
      preferredCategories: [],
      maxResults: 10
    }

    console.log('🎯 AI 추천 요청:', requestData)

    const response = await fetch('http://localhost:8080/api/recommend/projects-for-user', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData)
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    console.log('📦 AI 추천 응답:', data)
    
    recommendations.value = data || []
    
    if (recommendations.value.length > 0) {
      toast.success(`🎯 ${recommendations.value.length}개의 맞춤 프로젝트를 찾았습니다!`, {
        position: 'top-center',
        timeout: 3000
      })
    } else {
      toast.info('현재 추천 가능한 프로젝트가 없습니다. 기술스택을 조정해보세요.', {
        position: 'top-center',
        timeout: 3000
      })
    }
    
  } catch (error) {
    console.error('❌ AI 추천 오류:', error)
    toast.error('추천 서비스에 일시적인 문제가 발생했습니다.', {
      position: 'top-center',
      timeout: 3000
    })
  } finally {
    isLoading.value = false
  }
}

const handleTechStackSave = (techStacks) => {
  userTechStacks.value = techStacks
  showTechStackModal.value = false
  
  // 로컬 스토리지에 저장
  localStorage.setItem('userTechStacks', JSON.stringify(techStacks))
  
  toast.success('기술스택이 저장되었습니다!', {
    position: 'top-center',
    timeout: 2000
  })
  
  // 추천 다시 로드
  loadRecommendations()
}

const isUserTech = (techName) => {
  return userTechNames.value.includes(techName.toLowerCase())
}

const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('ko-KR', { 
    month: 'short', 
    day: 'numeric' 
  })
}

const formatDateRange = (startDate, endDate) => {
  const start = formatDate(startDate)
  const end = formatDate(endDate)
  return `${start} ~ ${end}`
}

const isUrgent = (deadline) => {
  const deadlineDate = new Date(deadline)
  const today = new Date()
  const diffTime = deadlineDate - today
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays <= 3
}

const goToProject = (projectId) => {
  router.push(`/projects/${projectId}`)
}

// 인기 프로젝트 조회 함수
const loadPopularProjects = async () => {
  try {
    const response = await fetch('http://localhost:8080/api/projects')
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    const data = await response.json()
    console.log('📊 전체 프로젝트 데이터:', data)
    
    // viewCount 기준으로 정렬하여 인기 프로젝트 선별
    const sortedProjects = [...data]
      .sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0))
    
    popularProjects.value = sortedProjects.slice(0, 12) // 상위 12개
    console.log('🔥 인기 프로젝트:', popularProjects.value.length, '개')
    
  } catch (error) {
    console.error('❌ 인기 프로젝트 로드 실패:', error)
    toast.error('인기 프로젝트를 불러오는 중 오류가 발생했습니다.', {
      position: 'top-center',
      timeout: 3000
    })
  }
}

// 피드백 관련 함수
const handleFeedback = (projectId, type) => {
  const currentFeedback = projectFeedbacks.value.get(projectId)
  
  // 같은 피드백이면 취소, 다른 피드백이면 변경
  if (currentFeedback === type) {
    projectFeedbacks.value.delete(projectId)
  } else {
    projectFeedbacks.value.set(projectId, type)
  }
  
  // LocalStorage에 저장
  saveFeedbacksToStorage()
  
  // 사용자에게 피드백 완료 알림
  const message = type === 'like' ? '좋은 추천이었다니 기뻐요! 🎉' : '피드백 감사합니다. 더 나은 추천을 위해 노력할게요! 🔄'
  if (projectFeedbacks.value.has(projectId)) {
    toast.success(message, {
      position: 'top-center',
      timeout: 2000
    })
  }
}

const getFeedback = (projectId) => {
  return projectFeedbacks.value.get(projectId)
}

const saveFeedbacksToStorage = () => {
  const feedbackData = Object.fromEntries(projectFeedbacks.value)
  localStorage.setItem('projectFeedbacks', JSON.stringify(feedbackData))
}

const loadFeedbacksFromStorage = () => {
  try {
    const saved = localStorage.getItem('projectFeedbacks')
    if (saved) {
      const feedbackData = JSON.parse(saved)
      projectFeedbacks.value = new Map(Object.entries(feedbackData))
    }
  } catch (error) {
    console.error('피드백 데이터 로드 실패:', error)
  }
}

// 라이프사이클
onMounted(async () => {
  try {
    // 로그인 상태 체크 (이미 로그인된 경우 스킵)
    if (!userStore.isLoggedIn) {
      await userStore.checkLogin()
    }
    
    // 인기 프로젝트 로드 (로그인 안된 상태에서 표시용)
    loadPopularProjects()
    
    // 저장된 기술스택 불러오기
    const savedTechStacks = localStorage.getItem('userTechStacks')
    if (savedTechStacks) {
      try {
        userTechStacks.value = JSON.parse(savedTechStacks)
        // 로그인된 상태에서만 AI 추천 로드
        if (userStore.isLoggedIn) {
          loadRecommendations()
        }
      } catch (error) {
        console.error('기술스택 데이터 파싱 오류:', error)
      }
    }
    
    // 저장된 피드백 데이터 불러오기
    loadFeedbacksFromStorage()
    
    console.log('📋 AI 추천 페이지 로드 완료:', {
      isLoggedIn: userStore.isLoggedIn,
      userId: userStore.userId,
      techStacksCount: userTechStacks.value.length
    })
    
  } catch (error) {
    console.error('❌ AI 추천 페이지 초기화 실패:', error)
  }
})
</script>

<style scoped>
.ai-recommendations-page {
  min-height: 100vh;
  background: #FFF;
  padding: 68px 0 60px 0; /* 헤더 높이만큼 패딩 */
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.tech-stack-status {
  background: white;
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 32px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.status-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.status-header h3 {
  margin: 0;
  color: #333;
  font-size: 1.2rem;
}

.edit-button {
  background: #f8f9fa;
  border: 1px solid #dee2e6;
  color: #495057;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.edit-button:hover {
  background: #e9ecef;
}

.tech-stack-list {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.tech-item {
  background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
  color: white;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
}

.tech-level {
  background: rgba(255, 255, 255, 0.2);
  padding: 2px 8px;
  border-radius: 10px;
  font-size: 0.8rem;
}

.recommendations-section {
  background: white;
  border-radius: 16px;
  padding: 32px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
  padding-bottom: 16px;
  border-bottom: 2px solid #f8f9fa;
}

.section-header h2 {
  margin: 0;
  color: #333;
  font-size: 1.8rem;
  font-weight: 700;
}

.stats {
  display: flex;
  gap: 16px;
}

.stat-item {
  background: #f8f9fa;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 0.9rem;
  color: #666;
  font-weight: 500;
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
  text-align: center;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 20px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
  text-align: center;
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 24px;
  opacity: 0.6;
}

.empty-state h3 {
  margin: 0 0 16px 0;
  color: #333;
  font-size: 1.5rem;
}

.empty-state p {
  margin: 0 0 32px 0;
  color: #666;
  font-size: 1.1rem;
  line-height: 1.6;
}

.primary-button {
  background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
  border: none;
  color: white;
  padding: 14px 28px;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.primary-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(40, 167, 69, 0.4);
}

.projects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: 24px;
}

.project-card {
  background: white;
  border-radius: 16px;
  padding: 24px;
  border: 1px solid #e9ecef;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.project-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
}

.project-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
}

.project-header {
  margin-bottom: 20px;
}

.project-title-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
  margin-bottom: 12px;
}

.project-title {
  margin: 0;
  color: #333;
  font-size: 1.3rem;
  font-weight: 700;
  line-height: 1.4;
  flex: 1;
}

.match-score {
  display: flex;
  flex-direction: column;
  align-items: center;
  background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
  color: white;
  padding: 8px 12px;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 600;
  min-width: 60px;
}

.score-label {
  font-size: 0.7rem;
  opacity: 0.9;
}

.score-value {
  font-size: 1.1rem;
  font-weight: 700;
}

.project-description {
  margin: 0;
  color: #666;
  font-size: 0.95rem;
  line-height: 1.5;
}

.project-info {
  margin-bottom: 20px;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  background: #f8f9fa;
  border-radius: 8px;
}

.info-label {
  font-size: 0.85rem;
  color: #666;
  font-weight: 500;
}

.info-value {
  font-size: 0.9rem;
  color: #333;
  font-weight: 600;
}

.info-value.urgent {
  color: #dc3545;
  font-weight: 700;
}

.tech-stacks {
  margin-bottom: 20px;
}

.tech-stacks-header {
  margin-bottom: 8px;
}

.tech-label {
  font-size: 0.9rem;
  color: #666;
  font-weight: 600;
}

.tech-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.tech-tag {
  background: #e9ecef;
  color: #495057;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 500;
}

.tech-tag.matched {
  background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
  color: white;
  font-weight: 600;
}

.ai-explanation {
  background: linear-gradient(135deg, rgba(40, 167, 69, 0.05) 0%, rgba(32, 201, 151, 0.05) 100%);
  border: 1px solid rgba(40, 167, 69, 0.2);
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 20px;
}

.explanation-header {
  margin-bottom: 12px;
}

.ai-badge {
  background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
  color: white;
  padding: 4px 12px;
  border-radius: 16px;
  font-size: 0.8rem;
  font-weight: 600;
}

.explanation-content {
  line-height: 1.6;
}

.main-reason {
  margin: 0 0 12px 0;
  color: #333;
  font-size: 0.95rem;
  font-weight: 500;
}

.skill-section {
  margin-bottom: 8px;
  font-size: 0.85rem;
}

.section-label {
  color: #666;
  font-weight: 600;
  margin-right: 8px;
}

.skill-list {
  color: #333;
}

.project-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.status-badge {
  background: #28a745;
  color: white;
  padding: 6px 12px;
  border-radius: 16px;
  font-size: 0.8rem;
  font-weight: 600;
}

.view-button {
  background: #f8f9fa;
  border: 1px solid #dee2e6;
  color: #495057;
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.view-button:hover {
  background: #e9ecef;
  transform: translateY(-1px);
}

/* 인기 프로젝트 그리드 스타일 */
.popular-preview {
  width: 100%;
  margin: 32px 0;
}

.popular-preview h4 {
  margin: 0 0 20px 0;
  color: #333;
  font-size: 1.2rem;
  font-weight: 600;
  text-align: center;
}

.popular-projects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
  margin: 20px 0;
}

.popular-project-card {
  background: white;
  border: 1px solid #e9ecef;
  border-radius: 12px;
  padding: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
}

.popular-project-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
  border-radius: 12px 12px 0 0;
}

.popular-project-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.popular-project-title {
  margin: 0 0 12px 0;
  color: #333;
  font-size: 1.1rem;
  font-weight: 600;
  line-height: 1.4;
}

.popular-project-description {
  margin: 0 0 16px 0;
  color: #666;
  font-size: 0.9rem;
  line-height: 1.5;
}

.popular-project-stats {
  display: flex;
  gap: 16px;
  margin-bottom: 12px;
}

.popular-stat {
  font-size: 0.85rem;
  color: #666;
}

.popular-tech-stacks {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.popular-tech-tag {
  background: #f8f9fa;
  color: #495057;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 500;
}

/* 추천 평가 스타일 */
.recommendation-feedback {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 16px;
  margin: 16px 0;
  border: 1px solid #e9ecef;
}

.feedback-label {
  display: block;
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 12px;
  font-weight: 500;
}

.feedback-buttons {
  display: flex;
  gap: 12px;
}

.feedback-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  border: 1px solid #dee2e6;
  background: white;
  border-radius: 20px;
  cursor: pointer;
  font-size: 0.85rem;
  font-weight: 500;
  transition: all 0.2s ease;
  color: #666;
}

.feedback-btn:hover {
  background: #f8f9fa;
  transform: translateY(-1px);
}

.feedback-btn.thumbs-up.active {
  background: #28a745;
  border-color: #28a745;
  color: white;
  box-shadow: 0 2px 8px rgba(40, 167, 69, 0.3);
}

.feedback-btn.thumbs-down.active {
  background: #dc3545;
  border-color: #dc3545;
  color: white;
  box-shadow: 0 2px 8px rgba(220, 53, 69, 0.3);
}

.feedback-btn i {
  font-size: 1rem;
}

.feedback-btn.thumbs-up:hover:not(.active) {
  background: #e8f5e8;
  border-color: #28a745;
  color: #28a745;
}

.feedback-btn.thumbs-down:hover:not(.active) {
  background: #fde8e8;
  border-color: #dc3545;
  color: #dc3545;
}

/* 피드백 통계 스타일 */
.feedback-stats {
  background: white;
  border-radius: 16px;
  padding: 24px;
  margin: 24px 0;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.stats-title {
  margin: 0 0 20px 0;
  color: #333;
  font-size: 1.2rem;
  font-weight: 600;
  text-align: center;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 16px;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 12px;
  background: #f8f9fa;
  border-radius: 12px;
  padding: 16px;
  transition: all 0.3s ease;
  border: 2px solid transparent;
}

.stat-card.positive {
  border-color: #28a745;
  background: linear-gradient(135deg, #f8fff8 0%, #e8f5e8 100%);
}

.stat-card.negative {
  border-color: #dc3545;
  background: linear-gradient(135deg, #fff8f8 0%, #fde8e8 100%);
}

.stat-card.neutral {
  border-color: #6c757d;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
}

.stat-card.accuracy {
  border-color: #007bff;
  background: linear-gradient(135deg, #f8fcff 0%, #e8f4ff 100%);
}

.stat-icon {
  font-size: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.8);
}

.stat-content {
  flex: 1;
  text-align: center;
}

.stat-number {
  font-size: 1.5rem;
  font-weight: 700;
  color: #333;
  line-height: 1.2;
}

.stat-label {
  font-size: 0.85rem;
  color: #666;
  font-weight: 500;
  margin-top: 2px;
}

/* 반응형 디자인 */
@media (max-width: 768px) {
  .page-title {
    font-size: 32px;
  }
  
  .page-subtitle {
    font-size: 16px;
  }
  
  .projects-grid {
    grid-template-columns: 1fr;
  }
  
  .project-title-row {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
  
  .match-score {
    align-self: flex-end;
  }
  
  .info-grid {
    grid-template-columns: 1fr;
  }
  
  .popular-projects-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 480px) {
  .page-title {
    font-size: 28px;
  }
  
  .page-subtitle {
    font-size: 14px;
  }
}
</style>