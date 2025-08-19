<template>
  <div class="ai-recommendations-page">
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

        <!-- 기술스택 미설정 상태 -->
        <div v-else-if="userTechStacks.length === 0" class="empty-state">
          <div class="empty-icon">🔧</div>
          <h3>기술스택을 설정해주세요</h3>
          <p>기술스택과 경험 수준을 설정하시면 AI가 맞춤형 프로젝트를 추천해드립니다.</p>
          <button @click="showTechStackModal = true" class="primary-button">
            기술스택 설정하기
          </button>
        </div>

        <!-- 추천 결과 없음 -->
        <div v-else-if="!isLoading && recommendations.length === 0" class="empty-state">
          <div class="empty-icon">🔍</div>
          <h3>추천 가능한 프로젝트가 없습니다</h3>
          <p>다른 기술스택이나 경험 수준으로 다시 시도해보세요.</p>
          <button @click="loadRecommendations" class="primary-button">
            다시 검색
          </button>
        </div>

        <!-- 추천 프로젝트 리스트 -->
        <div v-else class="projects-grid">
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
import TechStackModal from '@/components/common/TechStackModal.vue'

const router = useRouter()
const userStore = useUserStore()
const toast = useToast()

// 반응형 데이터
const isLoading = ref(false)
const showTechStackModal = ref(false)
const userTechStacks = ref([])
const recommendations = ref([])

// 계산된 속성
const userTechNames = computed(() => userTechStacks.value.map(tech => tech.name.toLowerCase()))

// 메서드
const loadRecommendations = async () => {
  if (userTechStacks.value.length === 0) {
    return
  }

  isLoading.value = true
  
  try {
    const requestData = {
      userId: 1, // 실제로는 사용자 ID 사용
      techStacks: userTechStacks.value,
      experienceLevel: "intermediate",
      preferredCategories: [],
      maxResults: 10
    }

    console.log('🎯 AI 추천 요청:', requestData)

    const response = await fetch('http://localhost:8082/api/recommend/projects-for-user', {
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

// 라이프사이클
onMounted(() => {
  // 저장된 기술스택 불러오기
  const savedTechStacks = localStorage.getItem('userTechStacks')
  if (savedTechStacks) {
    try {
      userTechStacks.value = JSON.parse(savedTechStacks)
      loadRecommendations()
    } catch (error) {
      console.error('기술스택 데이터 파싱 오류:', error)
    }
  }
})
</script>

<style scoped>
.ai-recommendations-page {
  min-height: 100vh;
  background: #f8f9fa;
  padding-top: 100px; /* 헤더 높이만큼 패딩 */
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

/* 반응형 디자인 */
@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    text-align: center;
    gap: 24px;
  }
  
  .page-title {
    font-size: 2rem;
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
}
</style>