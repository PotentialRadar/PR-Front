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

      <!-- 추천 섹션 -->
      <div class="recommendations-section">
        <div class="section-header">
          <div class="header-left">
            <div class="title-with-info">
              <h2>🎯 AI 맞춤 추천</h2>
              <div class="info-tooltip-container">
                <div class="info-icon">?</div>
                <div class="tooltip">
                  <div class="tooltip-content">
                    <h4>AI 추천 방식</h4>
                    <div class="tooltip-section">
                      <strong>📊 분석 요소</strong>
                      <ul>
                        <li>기술스택 매칭률</li>
                        <li>프로젝트 인기도</li>
                        <li>개인 피드백 히스토리</li>
                      </ul>
                    </div>
                    <div class="tooltip-section">
                      <strong>🤖 개인화 학습</strong>
                      <p>좋아요/싫어요 피드백을 통해<br/>점점 더 정확한 추천을 제공합니다</p>
                    </div>
                    <div class="tooltip-section">
                      <strong>⚡ 실시간 적용</strong>
                      <p>피드백 즉시 다음 추천에 반영</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="stats" v-if="activeTab === 'projects' && recommendations.length > 0">
            <span class="stat-item">
              📊 총 {{ recommendations.length }}개 프로젝트 발견
            </span>
          </div>
          <div class="stats" v-if="activeTab === 'members'">
            <span class="stat-item">
              👥 팀원 추천
            </span>
          </div>
        </div>

        <!-- 탭 네비게이션 (팀장에게만 표시) -->
        <div class="tab-navigation" v-if="userStore.isLoggedIn && userTechStacks.length > 0 && isTeamLeader">
          <button 
            class="tab-button"
            :class="{ active: activeTab === 'projects' }"
            @click="activeTab = 'projects'"
          >
            프로젝트
          </button>
          <button 
            v-if="isTeamLeader"
            class="tab-button"
            :class="{ active: activeTab === 'members' }"
            @click="switchToMembersTab"
          >
            👥 팀원 추천
          </button>
        </div>

        <!-- 팀원 추천용 프로젝트 선택 (팀원 추천 탭에서만 표시) -->
        <div v-if="activeTab === 'members' && isTeamLeader && userProjects.length > 1" class="project-selector">
          <label for="project-select">추천받을 프로젝트 선택:</label>
          <select 
            id="project-select" 
            v-model="selectedProjectId" 
            @change="onProjectChange"
            class="project-select"
          >
            <option v-for="project in userProjects" :key="project.projectId" :value="project.projectId">
              {{ project.title }} ({{ project.status === 'RECRUITING' ? '모집중' : project.status }})
            </option>
          </select>
        </div>

        <!-- 선택된 프로젝트 기술스택 정보 (팀원 추천 탭에서만 표시) -->
        <div v-if="activeTab === 'members' && isTeamLeader && selectedProject" class="selected-project-info">
          <div class="project-info-header">
            <div class="project-title-section">
              <h4 class="project-info-title">{{ selectedProject.title }}</h4>
            </div>
          </div>
          
          <div class="project-tech-stacks">
            <div class="tech-stacks-label">
              <span class="tech-icon">🛠️</span>
              <span class="tech-text">필요한 기술스택</span>
            </div>
            <div class="tech-tags-container">
              <span 
                v-for="tech in getProjectTechStacks(selectedProject)" 
                :key="tech"
                class="project-tech-tag"
              >
                {{ tech }}
              </span>
              <div v-if="getProjectTechStacks(selectedProject).length === 0" class="no-tech-stacks">
                기술스택 정보 없음
              </div>
            </div>
          </div>
          
          <div class="recommendation-note">
            <span class="note-icon">💡</span>
            <span class="note-text">위 기술스택과 매칭도가 높은 팀원을 추천해드립니다</span>
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
          <p>포트폴리오 페이지에서 기술스택과 경험 수준을 설정하시면 AI가 맞춤형 프로젝트를 추천해드립니다.</p>
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
          <button @click="router.push('/myPage/portfolio')" class="primary-button">
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

        <!-- 프로젝트 추천 탭 -->
        <div v-if="activeTab === 'projects' && userStore.isLoggedIn && userTechStacks.length > 0 && recommendations.length > 0" class="projects-grid">
          <ProjectCard
            v-for="project in recommendations" 
            :key="project.projectId"
            :project="transformProjectForCard(project)"
            @apply="handleProjectApply"
            @click="goToProject(project)"
          />
        </div>

        <!-- 팀원 추천 탭 -->
        <div v-if="activeTab === 'members'" class="members-tab">
          <TeamMemberRecommendation 
            v-if="selectedProject"
            :projectId="selectedProject.projectId"
            :requiredSkills="getProjectTechStacks(selectedProject)"
          />
        </div>
      </div>
    </div>

    <!-- 기술스택 설정 모달 -->
    <TechStackModal 
      v-if="showTechStackModal && userTechStacks"
      :initialTechStacks="userTechStacks || []"
      @close="showTechStackModal = false"
      @save="handleTechStackSave"
    />

    <!-- AI 추천 피드백 모달 -->
    <div v-if="showFeedbackModal && selectedProjectForFeedback" class="feedback-modal-overlay">
      <div class="feedback-modal">
        <div class="feedback-modal-header">
          <div class="ai-badge">🤖 AI 추천</div>
          <button @click="showFeedbackModal = false" class="close-btn">✕</button>
        </div>
        <div class="feedback-modal-content">
          <h3>{{ selectedProjectForFeedback.title }}</h3>
          <p class="modal-question">이 AI 추천이 어떠셨나요?</p>
          <div class="feedback-buttons">
            <button @click="submitFeedbackAndGoToProject('THUMBS_UP')" class="feedback-btn thumbs-up">
              👍 좋은 추천이에요!
              <span class="sub-text">상세페이지로 이동합니다</span>
            </button>
            <button @click="submitFeedbackAndGoToProject('THUMBS_DOWN')" class="feedback-btn thumbs-down">
              👎 별로예요
              <span class="sub-text">피드백을 남기고 이동합니다</span>
            </button>
          </div>
          <div class="feedback-skip">
            <button @click="showFeedbackModal = false" class="skip-btn">피드백 나중에</button>
            <button @click="goToProject(selectedProjectForFeedback)" class="detail-btn">바로 상세보기</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/userStore'
import { useToast } from 'vue-toastification'
import PageHeader from '@/components/common/PageHeader.vue'
import TechStackModal from '@/components/common/TechStackModal.vue'
import ProjectCard from '@/components/projectComponents/ProjectCard.vue'
import TeamMemberRecommendation from '@/components/projectComponents/TeamMemberRecommendation.vue'
import api from '@/api/axios'

const router = useRouter()
const userStore = useUserStore()
const toast = useToast()

// 반응형 데이터
const isLoading = ref(false)
const showTechStackModal = ref(false)
const userTechStacks = ref([])
const recommendations = ref([])
const popularProjects = ref([])
const activeTab = ref('projects') // 'projects' 또는 'members'
const userProjects = ref([]) // 사용자가 팀장인 프로젝트들
const isTeamLeader = ref(false) // 팀장 여부
const selectedProjectId = ref(null) // 선택된 프로젝트 ID

// 피드백 모달 관련
const showFeedbackModal = ref(false)
const selectedProjectForFeedback = ref(null)
const feedbackSubmitted = ref(new Set()) // 피드백 제출한 프로젝트 ID들


// 계산된 속성
const userTechNames = computed(() => userTechStacks.value.map(tech => tech.name?.toLowerCase()).filter(Boolean))

const selectedProject = computed(() => {
  return userProjects.value.find(project => 
    project.projectId === selectedProjectId.value
  ) || userProjects.value[0] || null
})

// 사용자 피드백 통계 조회
const getUserFeedbackStats = async () => {
  try {
    const response = await api.get(`/recommend/users/${userStore.userId}/feedback-stats`);
    return response.data;
  } catch (error) {
    console.error('❌ 피드백 통계 조회 실패:', error);
    return {
      totalFeedbacks: 0,
      likeCount: 0,
      dislikeCount: 0,
      likeRatio: 0.5,
      hasEnoughData: false
    };
  }
}

// 메서드
const loadRecommendations = async () => {
  if (userTechStacks.value.length === 0) {
    return
  }

  isLoading.value = true
  
  try {
    // 사용자 피드백 통계 가져오기
    const feedbackStats = await getUserFeedbackStats();
    console.log('📊 사용자 피드백 통계:', feedbackStats);
    
    // 피드백 통계에 따른 추천 매개변수 조정
    let minScore = 0.25; // 기본값
    let minOverlap = 0.15; // 기본값
    
    if (feedbackStats.hasEnoughData) {
      // 피드백 데이터가 충분한 경우 개인화 적용
      if (feedbackStats.likeRatio > 0.7) {
        // 좋아요 비율이 높으면 더 까다롭게 추천
        minScore = 0.35;
        minOverlap = 0.2;
      } else if (feedbackStats.likeRatio < 0.3) {
        // 좋아요 비율이 낮으면 더 다양하게 추천
        minScore = 0.15;
        minOverlap = 0.1;
      }
    }
    
    const requestData = {
      userId: userStore.userId,
      techStacks: userTechStacks.value,
      includeLikes: true,
      feedbackStats: feedbackStats, // 피드백 통계 포함
      topN: 10,
      minScore: minScore,
      minOverlap: minOverlap,
      strict: false
    }

    console.log('🎯 개인화된 AI 추천 요청:', requestData)

    const response = await api.post(`/recommend/projects?topN=10&minScore=${minScore}&minOverlap=${minOverlap}&strict=false`, requestData)
    const data = response.data
    console.log('📦 AI 추천 응답:', data)
    
    recommendations.value = data || []
    
    if (recommendations.value.length > 0) {
      console.log(`✅ ${recommendations.value.length}개의 개인화된 프로젝트 추천 완료`)
      
      // 개인화 정보 표시
      if (feedbackStats.hasEnoughData) {
        const personalizedMessage = feedbackStats.likeRatio > 0.7 
          ? '🎯 높은 만족도를 바탕으로 엄선된 추천'
          : feedbackStats.likeRatio < 0.3 
          ? '🌟 더 다양한 옵션으로 추천'
          : '⚖️ 피드백을 반영한 균형잡힌 추천';
        console.log(`🤖 개인화 적용: ${personalizedMessage}`);
      }
      
      // 추천 이력 ID 및 데이터 확인
      console.log('🔍 추천 이력 ID 및 데이터 확인:')
      recommendations.value.forEach((project, index) => {
        console.log(`  ${index + 1}. ${project.title}`)
        console.log(`    - historyId: ${project.recommendationHistoryId}`)
        console.log(`    - viewCount: ${project.viewCount}`)
        console.log(`    - likeCount: ${project.likeCount}`)
        console.log(`    - appliedCount: ${project.appliedCount}`)
      })
      
      // 프로젝트 매칭률 로그 출력
      console.log('📊 프로젝트 추천 매칭률 결과:')
      recommendations.value.forEach((project, index) => {
        const matchPercentage = Math.round((project.matchScore || 0) * 100)
        console.log(`  ${index + 1}. ${project.title} - ${matchPercentage}% 매칭`)
      })
    } else {
      console.log('⚠️ 추천 가능한 프로젝트가 없음')
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

// 사용자가 팀장인 프로젝트 확인
const checkTeamLeaderStatus = async () => {

  if (!userStore.isLoggedIn) {
    isTeamLeader.value = false
    return
  }

  try {
    // 사용자가 작성한 프로젝트 조회
    const response = await api.get(`/projects/users/${userStore.userId}/created`)
    userProjects.value = response.data || []
    
    // 모집중인 프로젝트가 있는지 확인
    const recruitingProjects = userProjects.value.filter(project => 
      project.status === 'RECRUITING'
    )
    isTeamLeader.value = recruitingProjects.length > 0
    
    // 첫 번째 모집중인 프로젝트를 기본 선택
    if (recruitingProjects.length > 0) {
      selectedProjectId.value = recruitingProjects[0].projectId
    } else if (userProjects.value.length > 0) {
      selectedProjectId.value = userProjects.value[0].projectId
    }
    
    console.log('👑 팀장 상태 확인:', {
      isTeamLeader: isTeamLeader.value,
      totalProjects: userProjects.value.length,
      recruitingProjects: recruitingProjects.length,
      selectedProjectId: selectedProjectId.value,
      recruitingProjectTitles: recruitingProjects.map(p => p.title)
    })
    
  } catch (error) {
    console.error('❌ 팀장 상태 확인 실패:', error)
    // API가 없는 경우 일단 false로 설정
    isTeamLeader.value = false
    userProjects.value = []
  }
}



// 프로젝트 변경 시 호출
const onProjectChange = () => {
  console.log('📋 프로젝트 변경됨:', selectedProjectId.value)
}

// 팀원 추천 탭 전환
const switchToMembersTab = () => {
  activeTab.value = 'members'
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
  return techName && userTechNames.value.includes(techName.toLowerCase())
}

// 프로젝트 기술스택 추출
const getProjectTechStacks = (project) => {
  try {
    if (!project) return []
    
    if (project.techStacks && Array.isArray(project.techStacks)) {
      return project.techStacks.map(tech => 
        tech.techStackName || tech.name || tech
      ).filter(Boolean)
    }
    
    return []
  } catch (error) {
    console.error('프로젝트 기술스택 추출 오류:', error, project)
    return []
  }
}



const formatDuration = (startDate, endDate) => {
  if (!startDate || !endDate) return '-'
  const start = new Date(startDate)
  const end = new Date(endDate)
  if (isNaN(start) || isNaN(end)) return '-'
  
  const diff = Math.round((end - start) / (1000 * 60 * 60 * 24)) + 1
  if (diff < 7) return `${diff}일`
  if (diff < 30) return `${Math.round(diff / 7)}주`
  if (diff < 365) return `${Math.round(diff / 30)}개월`
  return `${Math.round(diff / 365)}년`
}

const formatDeadline = (deadline) => {
  if (!deadline) return '-'
  const today = new Date()
  const dday = Math.ceil((new Date(deadline) - today) / (1000 * 60 * 60 * 24))
  if (dday >= 0) return `D-${dday}`
  return '마감'
}

const isUrgent = (deadline) => {
  const deadlineDate = new Date(deadline)
  const today = new Date()
  const diffTime = deadlineDate - today
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays <= 3
}

// 프로젝트 상태 텍스트 변환
const getStatusText = (status) => {
  const statusMap = {
    'RECRUITING': '모집중',
    'IN_PROGRESS': '진행중',
    'COMPLETED': '완료',
    'CANCELLED': '취소됨'
  }
  return statusMap[status] || status || '모집중'
}

// 프로젝트 상태별 CSS 클래스
const getStatusClass = (status) => {
  const classMap = {
    'RECRUITING': 'recruiting',
    'IN_PROGRESS': 'in-progress',
    'COMPLETED': 'completed',
    'CANCELLED': 'cancelled'
  }
  return classMap[status] || 'recruiting'
}

// AI 추천 프로젝트를 ProjectCard 컴포넌트용으로 변환
const transformProjectForCard = (aiProject) => {
  return {
    id: aiProject.projectId,
    title: aiProject.title,
    description: aiProject.description, // 원래 설명만 사용
    status: aiProject.status || 'RECRUITING',
    startDate: aiProject.startDate,
    endDate: aiProject.endDate,
    recruitCount: aiProject.recruitCount,
    appliedCount: aiProject.appliedCount,
    recruitDeadline: aiProject.recruitDeadline,
    viewCount: aiProject.viewCount || 0,
    likeCount: aiProject.likeCount || 0,
    techStacks: aiProject.projectTechStacks?.map(tech => ({
      techStackName: tech,
      isMatched: isUserTech(tech) // 사용자 기술스택과 매칭 여부
    })) || [],
    // AI 추천 정보 추가
    matchScore: aiProject.matchScore,
    isAIRecommendation: true,
    aiExplanation: aiProject.explanation?.simple_explanation || aiProject.explanation?.main_reason
  }
}

// 프로젝트 지원 핸들러
const handleProjectApply = (projectId) => {
  // ProjectCard에서 지원 이벤트 처리
  console.log('프로젝트 지원:', projectId)
  // 실제 지원 로직을 여기에 추가
}

// AI 추천 피드백 모달 열기
const openFeedbackModal = (project) => {
  console.log('🎯 AI 추천 프로젝트 클릭:', project.title);
  
  // 이미 피드백을 제출한 프로젝트면 바로 상세페이지로
  if (feedbackSubmitted.value.has(project.projectId)) {
    console.log('✅ 이미 피드백 제출됨 - 바로 상세페이지로');
    goDirectToProject(project.projectId);
    return;
  }
  
  selectedProjectForFeedback.value = project;
  showFeedbackModal.value = true;
}

const goToProject = (project) => {
  const projectId = typeof project === 'object' ? project.projectId : project;
  const historyId = typeof project === 'object' ? project.recommendationHistoryId : null;
  
  console.log('🚀 AI 추천에서 프로젝트 상세페이지로 이동:', { projectId, historyId });
  
  const url = historyId 
    ? `/projects/${projectId}?from=ai-recommendation&historyId=${historyId}`
    : `/projects/${projectId}?from=ai-recommendation`;
    
  router.push(url);
}

// 피드백 제출
const submitAIFeedback = async (action) => {
  const project = selectedProjectForFeedback.value;
  if (!project) return;
  
  try {
    console.log('📝 AI 추천 피드백 제출:', { projectId: project.projectId, action });
    
    // 기존 API 사용 (임시로 프로젝트 ID를 추천 이력 ID로 사용)
    const actionPath = action === 'THUMBS_UP' ? 'like' : 'dislike';
    await api.post(`/recommend/feedback/${project.projectId}/${actionPath}`);
    
    // 피드백 제출 완료 표시
    feedbackSubmitted.value.add(project.projectId);
    
    const messages = {
      'THUMBS_UP': '좋은 추천이라고 피드백을 남겼습니다! 👍',
      'THUMBS_DOWN': '피드백이 기록되었습니다. 더 나은 추천을 위해 참고하겠습니다.'
    };
    
    toast.success(messages[action] || '피드백이 기록되었습니다.', {
      position: 'top-center',
      timeout: 3000
    });
    
    // 모달 닫기
    showFeedbackModal.value = false;
    
  } catch (error) {
    console.error('❌ AI 추천 피드백 제출 실패:', error);
    toast.error('피드백 제출에 실패했습니다.', {
      position: 'top-center',
      timeout: 3000
    });
  }
}

// 피드백 후 상세페이지로 이동
const submitFeedbackAndGoToProject = async (action) => {
  await submitAIFeedback(action);
  if (selectedProjectForFeedback.value) {
    goToProject(selectedProjectForFeedback.value);
  }
}

// 암시적 조회 피드백 제출
const submitImplicitViewFeedback = async (recommendationHistoryId) => {
  try {
    const feedbackData = {
      recommendationHistoryId: recommendationHistoryId,
      feedbackAction: 'VIEW_DETAIL'
    }
    
    console.log('👀 암시적 조회 피드백 제출:', feedbackData)
    
    // VIEW_DETAIL은 기존 API에서 지원하지 않으므로 일단 like로 처리
    await api.post(`/recommend/feedback/${recommendationHistoryId}/like`)
  } catch (error) {
    console.error('❌ 암시적 피드백 전송 실패:', error)
    // 실패해도 페이지 이동은 계속 진행
  }
}

// 포트폴리오에서 기술스택 불러오기
const loadTechStacksFromPortfolio = async () => {
  try {
    const response = await api.get(`/users/${userStore.userId}/portfolio`)
    const portfolioData = response.data
      if (portfolioData.skills && portfolioData.skills.length > 0) {
        // 포트폴리오 기술스택을 AI 추천용 형태로 변환 (기본 레벨 3)
        const techStacks = portfolioData.skills.map(skill => ({
          name: skill,
          level: 3
        }))
        
        userTechStacks.value = techStacks
        localStorage.setItem('userTechStacks', JSON.stringify(techStacks))
        
        console.log('📦 포트폴리오에서 기술스택 불러옴:', techStacks)
        loadRecommendations()
      }
  } catch (error) {
    console.error('포트폴리오 기술스택 로드 실패:', error)
  }
}

// 인기 프로젝트 조회 함수
const loadPopularProjects = async () => {
  try {
    const response = await api.get('/projects')
    const data = response.data
    console.log('📊 전체 프로젝트 데이터:', data)
    
    // 페이지네이션된 응답 처리: content 배열 추출
    const projectsArray = data?.content || data || []
    console.log('📋 추출된 프로젝트 배열:', projectsArray.length, '개')
    
    if (!Array.isArray(projectsArray)) {
      console.warn('⚠️ 프로젝트 데이터가 배열이 아닙니다:', typeof projectsArray)
      popularProjects.value = []
      return
    }
    
    // viewCount 기준으로 정렬하여 인기 프로젝트 선별
    const sortedProjects = [...projectsArray]
      .sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0))
    
    popularProjects.value = sortedProjects.slice(0, 12) // 상위 12개
    console.log('🔥 인기 프로젝트:', popularProjects.value.length, '개')
    
  } catch (error) {
    console.error('❌ 인기 프로젝트 로드 실패:', error)
    console.error('에러 상세:', error.response?.data || error.message)
    
    // 에러 발생시 빈 배열로 설정
    popularProjects.value = []
    
    toast.error('인기 프로젝트를 불러오는 중 오류가 발생했습니다.', {
      position: 'top-center',
      timeout: 3000
    })
  }
}


// 라이프사이클
onMounted(async () => {
  try {
    console.log('🔄 AI 추천 페이지 마운트 시작')
    
    // 로그인 상태 체크 (이미 로그인된 경우 스킵)
    if (!userStore.isLoggedIn) {
      try {
        await userStore.checkLogin()
        console.log('✅ 로그인 상태 체크 완료:', userStore.isLoggedIn)
      } catch (error) {
        console.warn('⚠️ 로그인 상태 체크 실패:', error)
        // 로그인 체크 실패해도 페이지는 계속 진행 (비로그인 사용자용)
      }
    }
    
    // 인기 프로젝트 로드 (로그인 안된 상태에서 표시용)
    await loadPopularProjects()
    
    // 팀장 상태 확인 (로그인된 경우만)
    if (userStore.isLoggedIn && userStore.userId) {
      try {
        await checkTeamLeaderStatus()
      } catch (error) {
        console.error('❌ 팀장 상태 확인 실패:', error)
        // 팀장 상태 확인 실패해도 계속 진행
        isTeamLeader.value = false
        userProjects.value = []
      }
    } else {
      console.log('👤 비로그인 사용자 - 팀장 상태 체크 생략')
      isTeamLeader.value = false
      userProjects.value = []
    }
    
    // 저장된 기술스택 불러오기 (로그인 상태에서만)
    if (userStore.isLoggedIn && userStore.userId) {
      try {
        console.log('🔧 기술스택 조회 시도 - userStore 먼저 확인')
    console.log('🔍 현재 userStore 상태:', {
      isLoggedIn: userStore.isLoggedIn,
      userId: userStore.userId,
      techStacksLength: userStore.techStacks?.length || 0,
      techStacks: userStore.techStacks
    })
        
        // 먼저 userStore에 이미 기술스택이 있는지 확인
        if (userStore.techStacks && userStore.techStacks.length > 0) {
          console.log('✅ userStore에서 기술스택 발견:', userStore.techStacks)
          // userStore의 기술스택을 AI 추천용 형태로 변환
          userTechStacks.value = userStore.techStacks.map(tech => ({
            name: tech.stackName || tech.techStackName || tech.name,
            level: tech.skillLevel || tech.level || 3
          }))
          console.log('✅ userStore에서 기술스택 로드 성공:', userTechStacks.value)
          console.log('🔍 기술스택 상세 정보:', userTechStacks.value.map(tech => `${tech.name} (Lv.${tech.level})`).join(', '))
          await loadRecommendations()
        } else {
          console.log('⚠️ userStore에 기술스택 없음 - DB에서 새로 조회')
          const dbTechStacks = await userStore.fetchTechStacks()
          if (dbTechStacks && dbTechStacks.length > 0) {
            // DB에서 가져온 기술스택을 AI 추천용 형태로 변환
            userTechStacks.value = dbTechStacks.map(tech => ({
              name: tech.stackName || tech.techStackName || tech.name,
              level: tech.skillLevel || tech.level || 3
            }))
            console.log('✅ DB에서 기술스택 로드 성공:', userTechStacks.value)
            await loadRecommendations()
          } else {
            console.log('⚠️ DB에 기술스택 없음 - localStorage 확인')
            // DB에 기술스택이 없으면 localStorage 확인
            const savedTechStacks = localStorage.getItem('userTechStacks')
            if (savedTechStacks) {
              try {
                userTechStacks.value = JSON.parse(savedTechStacks)
                await loadRecommendations()
              } catch (error) {
                console.error('❌ 기술스택 데이터 파싱 오류:', error)
                localStorage.removeItem('userTechStacks')
                userTechStacks.value = []
              }
            } else {
              console.log('⚠️ DB와 localStorage 모두에 기술스택 없음')
              userTechStacks.value = []
            }
          }
        }
      } catch (error) {
        console.error('❌ 기술스택 로딩 실패:', error)
        userTechStacks.value = []
        // 기술스택 로딩 실패해도 페이지는 계속 진행
      }
    } else {
      console.log('👤 비로그인 사용자 - 기술스택 로딩 생략')
      // 비로그인 상태에서는 기술스택 관련 데이터 초기화
      userTechStacks.value = []
    }
    
    
    console.log('📋 AI 추천 페이지 로드 완료:', {
      isLoggedIn: userStore.isLoggedIn,
      userId: userStore.userId,
      techStacksCount: userTechStacks.value.length
    })
    
  } catch (error) {
    console.error('❌ AI 추천 페이지 초기화 실패:', error)
    
    // 초기화 실패시 기본값 설정
    isTeamLeader.value = false
    userProjects.value = []
    userTechStacks.value = []
    popularProjects.value = []
    recommendations.value = []
    
    // 사용자에게 알림
    toast.error('페이지 로드 중 오류가 발생했습니다. 새로고침해주세요.', {
      position: 'top-center',
      timeout: 5000
    })
  }
})

// 로그인 상태 변화 감지
watch(() => userStore.isLoggedIn, (newValue, oldValue) => {
  try {
    console.log('🔄 로그인 상태 변화 감지:', { newValue, oldValue })
    if (!newValue && oldValue !== undefined) {
      // 로그아웃 시 기술스택 데이터 초기화
      userTechStacks.value = []
      recommendations.value = []
      localStorage.removeItem('userTechStacks')
      localStorage.removeItem('projectFeedbacks')
      console.log('🧹 로그아웃으로 인한 데이터 초기화 완료')
    }
  } catch (error) {
    console.error('🚨 로그인 상태 변화 처리 중 오류:', error)
  }
}, { immediate: false })

// 페이지 포커스 시 기술스택 재확인 (포트폴리오에서 돌아왔을 때)
const handleVisibilityChange = async () => {
  if (!document.hidden && userStore.isLoggedIn && userTechStacks.value.length === 0) {
    await loadTechStacksFromPortfolio()
  }
}

// 브라우저 탭 포커스 이벤트 리스너 추가
onMounted(() => {
  document.addEventListener('visibilitychange', handleVisibilityChange)
})

// 컴포넌트 언마운트 시 이벤트 리스너 제거
onUnmounted(() => {
  document.removeEventListener('visibilitychange', handleVisibilityChange)
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

.header-left {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.title-with-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.info-tooltip-container {
  position: relative;
  display: inline-block;
}

.info-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  background: #ffffff;
  border-radius: 50%;
  font-size: 13px;
  font-weight: 600;
  color: #6c757d;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid #dee2e6;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.info-icon:hover {
  background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
  border-color: #28a745;
  color: white;
  transform: scale(1.15);
  box-shadow: 0 4px 12px rgba(40, 167, 69, 0.3);
}

.tooltip {
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  background: white;
  border: 1px solid #e9ecef;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
  padding: 0;
  width: 320px;
  z-index: 1000;
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease;
  margin-top: 8px;
}

.info-tooltip-container:hover .tooltip {
  opacity: 1;
  visibility: visible;
  transform: translateX(-50%) translateY(0);
}

.tooltip::before {
  content: '';
  position: absolute;
  top: -8px;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 0;
  border-left: 8px solid transparent;
  border-right: 8px solid transparent;
  border-bottom: 8px solid white;
}

.tooltip-content {
  padding: 20px;
}

.tooltip-content h4 {
  margin: 0 0 16px 0;
  color: #333;
  font-size: 1.1rem;
  font-weight: 600;
  text-align: center;
  padding-bottom: 8px;
  border-bottom: 1px solid #f0f0f0;
}

.tooltip-section {
  margin-bottom: 16px;
}

.tooltip-section:last-child {
  margin-bottom: 0;
}

.tooltip-section strong {
  display: block;
  color: #333;
  font-size: 0.9rem;
  font-weight: 600;
  margin-bottom: 8px;
}

.tooltip-section ul {
  margin: 0;
  padding-left: 16px;
  list-style-type: disc;
}

.tooltip-section li {
  color: #666;
  font-size: 0.85rem;
  line-height: 1.4;
  margin-bottom: 4px;
}

.tooltip-section p {
  margin: 0;
  color: #666;
  font-size: 0.85rem;
  line-height: 1.4;
}

.personalization-badge {
  background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
  color: white;
  padding: 4px 12px;
  border-radius: 16px;
  font-size: 0.8rem;
  font-weight: 600;
  width: fit-content;
  box-shadow: 0 2px 8px rgba(40, 167, 69, 0.3);
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

.stat-item.personalized {
  background: linear-gradient(135deg, rgba(40, 167, 69, 0.1) 0%, rgba(32, 201, 151, 0.1) 100%);
  color: #28a745;
  border: 1px solid rgba(40, 167, 69, 0.2);
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
  border-top: 4px solid #28a745;
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

/* AI 추천 프로젝트 카드는 ProjectCard 컴포넌트 사용 */


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
  
  .tooltip {
    width: 280px;
    left: 0;
    transform: none;
  }
  
  .tooltip::before {
    left: 24px;
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

/* 탭 네비게이션 스타일 */
.tab-navigation {
  display: flex;
  gap: 12px;
  margin-bottom: 32px;
  border-bottom: 2px solid #f1f3f4;
  padding-bottom: 16px;
}

.tab-button {
  background: transparent;
  border: none;
  color: #666;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
}

.tab-button:hover {
  background: #f8f9fa;
  color: #333;
}

.tab-button.active {
  background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(40, 167, 69, 0.3);
}

/* 프로젝트 선택 스타일 */
.project-selector {
  background: #f8f9fa;
  padding: 16px 20px;
  border-radius: 12px;
  margin-bottom: 24px;
  border: 1px solid #e9ecef;
}

.project-selector label {
  display: block;
  font-size: 0.9rem;
  color: #495057;
  font-weight: 600;
  margin-bottom: 8px;
}

.project-select {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #ced4da;
  border-radius: 8px;
  font-size: 0.95rem;
  background: white;
  color: #495057;
  cursor: pointer;
  transition: all 0.2s ease;
}

.project-select:focus {
  outline: none;
  border-color: #28a745;
  box-shadow: 0 0 0 3px rgba(40, 167, 69, 0.1);
}

.project-select:hover {
  border-color: #adb5bd;
}

/* 선택된 프로젝트 정보 */
.selected-project-info {
  background: linear-gradient(135deg, #f8fff9 0%, #e8f5e8 100%);
  border: 1px solid rgba(40, 167, 69, 0.2);
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 24px;
  box-shadow: 0 2px 8px rgba(40, 167, 69, 0.1);
}

.project-info-header {
  margin-bottom: 16px;
}

.project-title-section {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.project-info-title {
  margin: 0;
  color: #155724;
  font-size: 1.2rem;
  font-weight: 700;
}

.recommendation-basis {
  background: rgba(40, 167, 69, 0.1);
  color: #155724;
  padding: 4px 12px;
  border-radius: 16px;
  font-size: 0.85rem;
  font-weight: 600;
  width: fit-content;
  border: 1px solid rgba(40, 167, 69, 0.2);
}

.project-tech-stacks {
  margin-bottom: 16px;
}

.tech-stacks-label {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
}

.tech-icon {
  font-size: 1.2rem;
}

.tech-text {
  font-size: 1rem;
  font-weight: 600;
  color: #155724;
}

.tech-tags-container {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.project-tech-tag {
  background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
  color: white;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 600;
  border: none;
  box-shadow: 0 2px 8px rgba(40, 167, 69, 0.2);
  transition: all 0.2s ease;
}

.project-tech-tag:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(40, 167, 69, 0.3);
}

.no-tech-stacks {
  color: #6c757d;
  font-style: italic;
  padding: 8px 16px;
  background: #f8f9fa;
  border-radius: 8px;
  font-size: 0.9rem;
}

.recommendation-note {
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(255, 193, 7, 0.1);
  border: 1px solid rgba(255, 193, 7, 0.3);
  border-radius: 8px;
  padding: 12px 16px;
}

.note-icon {
  font-size: 1.1rem;
}

.note-text {
  color: #856404;
  font-size: 0.9rem;
  font-weight: 500;
}

/* 팀원 추천 스타일 */
.members-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 24px;
}

.member-card {
  background: white;
  border-radius: 16px;
  padding: 24px;
  border: 1px solid #e9ecef;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.member-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
}

.member-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
}

.member-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;
}

.member-profile {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
  position: relative; /* fallback 아바타 위치를 위해 추가 */
}

.member-avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid #f8f9fa;
  background: linear-gradient(135deg, #4CAF50, #81C784);
  transition: all 0.2s ease;
}

.member-avatar:hover {
  transform: scale(1.05);
  border-color: #4CAF50;
}

/* 이제 dicebear API만 사용하므로 fallback CSS는 불필요 */

.member-basic-info {
  flex: 1;
}

.member-name {
  margin: 0 0 4px 0;
  color: #333;
  font-size: 1.2rem;
  font-weight: 700;
}

.member-role {
  margin: 0;
  color: #666;
  font-size: 0.9rem;
}

.member-info {
  margin-bottom: 20px;
}

.member-bio {
  margin-bottom: 16px;
}

.member-bio p {
  margin: 0;
  color: #666;
  font-size: 0.95rem;
  line-height: 1.5;
}

.member-stats {
  display: flex;
  gap: 16px;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 8px 12px;
  background: #f8f9fa;
  border-radius: 8px;
  flex: 1;
}

.stat-label {
  font-size: 0.8rem;
  color: #666;
  margin-bottom: 4px;
}

.stat-value {
  font-size: 0.9rem;
  color: #333;
  font-weight: 600;
}

.member-tech-stacks {
  margin-bottom: 20px;
}

.member-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
}

.member-links {
  display: flex;
  gap: 8px;
}

.link-button {
  background: #f8f9fa;
  color: #495057;
  padding: 6px 12px;
  border-radius: 6px;
  text-decoration: none;
  font-size: 0.8rem;
  font-weight: 500;
  transition: all 0.2s ease;
}

.link-button:hover {
  background: #e9ecef;
  transform: translateY(-1px);
}

.link-button.github {
  background: #24292e;
  color: white;
}

.link-button.github:hover {
  background: #1e2124;
}

.link-button.linkedin {
  background: #0077b5;
  color: white;
}

.link-button.linkedin:hover {
  background: #005885;
}

.contact-button {
  background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
  border: none;
  color: white;
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.contact-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(40, 167, 69, 0.4);
}

.contact-button.invited {
  background: #6c757d;
  cursor: not-allowed;
  opacity: 0.7;
}

.contact-button.invited:hover {
  transform: none;
  box-shadow: none;
}

.contact-button:disabled {
  cursor: not-allowed;
  opacity: 0.7;
}

/* 매칭도 배지 스타일 */
.match-score-badge {
  background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
  color: white;
  padding: 8px 12px;
  border-radius: 16px;
  font-size: 0.85rem;
  font-weight: 600;
  box-shadow: 0 2px 8px rgba(40, 167, 69, 0.3);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  min-width: 70px;
}

.match-score-badge .score-label {
  font-size: 0.7rem;
  opacity: 0.9;
}

.match-score-badge .score-value {
  font-size: 1rem;
  font-weight: 700;
}

/* 기술스택 관련 스타일 */
.tech-stacks-header {
  margin-bottom: 12px;
}

.tech-label {
  font-size: 0.9rem;
  color: #495057;
  font-weight: 600;
}

.tech-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tech-tag {
  background: #f8f9fa;
  color: #495057;
  padding: 6px 12px;
  border-radius: 16px;
  font-size: 0.8rem;
  font-weight: 500;
  border: 1px solid #e9ecef;
  transition: all 0.2s ease;
}

.tech-tag.matched {
  background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
  color: white;
  border-color: #28a745;
  box-shadow: 0 2px 8px rgba(40, 167, 69, 0.2);
}

.tech-tag.matched::after {
  content: ' ✓';
  font-weight: 700;
}

/* AI 추천 이유 스타일 */
.ai-explanation {
  background: linear-gradient(135deg, #f8f9ff 0%, #e8f4fd 100%);
  border: 1px solid rgba(40, 167, 69, 0.2);
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 20px;
}

.explanation-header {
  margin-bottom: 8px;
}

.ai-badge {
  background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
  color: white;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
}

.explanation-content .main-reason {
  margin: 0;
  color: #495057;
  font-size: 0.9rem;
  line-height: 1.4;
}

/* 반응형 디자인 - 팀원 추천 */
@media (max-width: 768px) {
  .tab-navigation {
    flex-direction: column;
    gap: 8px;
  }
  
  .tab-button {
    text-align: center;
  }
  
  .members-grid {
    grid-template-columns: 1fr;
  }
  
  .member-header {
    flex-direction: column;
    gap: 16px;
  }
  
  .member-footer {
    flex-direction: column;
    gap: 12px;
  }
  
  .member-links {
    justify-content: center;
  }
}

/* 더보기 버튼 스타일 */
.show-more-section {
  display: flex;
  justify-content: center;
  margin-top: 24px;
  margin-bottom: 20px;
}

.show-more-button {
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border: 2px solid #dee2e6;
  color: #495057;
  padding: 14px 28px;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 200px;
  justify-content: center;
}

.show-more-button:hover {
  background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
  color: white;
  border-color: #20c997;
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(40, 167, 69, 0.3);
}

.show-more-button svg {
  transition: transform 0.3s ease;
}

.show-more-button:hover svg {
  transform: rotate(90deg);
}

/* AI 추천 피드백 모달 스타일 */
.feedback-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.feedback-modal {
  background: white;
  border-radius: 16px;
  max-width: 500px;
  width: 100%;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  animation: slideUp 0.3s ease-out;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.feedback-modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px 16px 24px;
  border-bottom: 1px solid #e9ecef;
}

.ai-badge {
  background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
  color: white;
  padding: 6px 12px;
  border-radius: 16px;
  font-size: 0.9rem;
  font-weight: 600;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #6c757d;
  cursor: pointer;
  padding: 4px;
  transition: color 0.2s ease;
}

.close-btn:hover {
  color: #333;
}

.feedback-modal-content {
  padding: 24px;
}

.feedback-modal-content h3 {
  margin: 0 0 16px 0;
  color: #333;
  font-size: 1.25rem;
  font-weight: 600;
  line-height: 1.4;
}

.modal-question {
  margin: 0 0 24px 0;
  color: #666;
  font-size: 1.1rem;
  text-align: center;
}

.feedback-buttons {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 20px;
}

.feedback-btn {
  padding: 16px 20px;
  border: 2px solid #e9ecef;
  background: white;
  border-radius: 12px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: left;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.feedback-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.feedback-btn.thumbs-up:hover {
  border-color: #28a745;
  background: linear-gradient(135deg, #f8fff9 0%, #e8f5e8 100%);
  color: #155724;
}

.feedback-btn.thumbs-down:hover {
  border-color: #dc3545;
  background: linear-gradient(135deg, #fff8f8 0%, #f5e8e8 100%);
  color: #721c24;
}

.sub-text {
  font-size: 0.9rem;
  font-weight: 400;
  opacity: 0.7;
}

.feedback-skip {
  display: flex;
  gap: 12px;
  justify-content: center;
}

.skip-btn, .detail-btn {
  background: none;
  border: 1px solid #dee2e6;
  color: #6c757d;
  cursor: pointer;
  font-size: 0.9rem;
  padding: 10px 16px;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.skip-btn:hover, .detail-btn:hover {
  background: #f8f9fa;
  color: #333;
}

.detail-btn {
  background: #007bff;
  color: white;
  border-color: #007bff;
}

.detail-btn:hover {
  background: #0056b3;
  border-color: #0056b3;
}

@media (max-width: 480px) {
  .feedback-modal-overlay {
    padding: 16px;
  }
  
  .feedback-modal-content {
    padding: 20px;
  }
  
  .feedback-buttons {
    gap: 10px;
  }
  
  .feedback-btn {
    font-size: 1rem;
    padding: 14px 16px;
  }
  
  .feedback-skip {
    flex-direction: column;
  }
}
</style>