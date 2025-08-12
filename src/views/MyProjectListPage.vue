<template>
  <div class="my-projects-page">
    <div class="container">
      <div class="content-wrapper">
        <!-- 필터 섹션 -->
        <div class="filters-section">
          <div class="filters-card">
            <div class="filter-group">
              <label class="filter-label">프로젝트 상태</label>
              <div class="status-filters">
                <button 
                  v-for="status in statusOptions" 
                  :key="status.value"
                  :class="['status-btn', status.value, { 'active': selectedStatus === status.value }]"
                  @click="setStatus(status.value)"
                >
                  <span class="status-icon">{{ status.icon }}</span>
                  {{ status.label }}
                </button>
              </div>
            </div>
            
            <div class="filter-group">
              <label class="filter-label">내 역할</label>
              <div class="role-filters">
                <button 
                  v-for="role in roleOptions" 
                  :key="role.value"
                  :class="['role-btn', { 'active': selectedRole === role.value }]"
                  @click="setRole(role.value)"
                >
                  {{ role.label }}
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- 프로젝트 목록 -->
        <div class="projects-section">
          <div class="section-header">
            <h2 class="section-title">
              {{ filteredProjects.length }}개의 프로젝트
            </h2>
            <div class="stats-mini">
              <div class="stat-item">
                <span class="stat-number">{{ totalProjects }}</span>
                <span class="stat-label">전체</span>
              </div>
              <div class="stat-divider"></div>
              <div class="stat-item">
                <span class="stat-number">{{ pmProjects }}</span>
                <span class="stat-label">PM</span>
              </div>
              <div class="stat-divider"></div>
              <div class="stat-item">
                <span class="stat-number">{{ activeProjects }}</span>
                <span class="stat-label">진행중</span>
              </div>
            </div>
          </div>
          
          <div v-if="filteredProjects.length > 0" class="projects-grid">
            <div 
              v-for="project in filteredProjects" 
              :key="project.id" 
              class="project-card"
            >
              <!-- 카드 헤더 -->
              <div class="card-header">
                <div class="project-info">
                  <div class="project-title-section">
                    <h3 class="project-title">{{ project.title }}</h3>
                    <div class="project-badges">
                      <span :class="['status-badge', project.status]">
                        {{ getStatusText(project.status) }}
                      </span>
                      <span v-if="project.isPM" class="pm-badge">
                        <span class="pm-icon">⭐</span>
                        PM
                      </span>
                    </div>
                  </div>
                  <p class="project-description">{{ project.description }}</p>
                  <div class="project-meta">
                    <div class="meta-item">
                      <span class="meta-icon">📅</span>
                      <span>{{ formatDateRange(project.startDate, project.endDate) }}</span>
                    </div>
                    <div class="meta-item">
                      <span class="meta-icon">👥</span>
                      <span>{{ project.teamSize }}명</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- 기술 스택 -->
              <div class="tech-stack-section">
                <div class="tech-stack-list">
                  <span 
                    v-for="tech in project.techStack" 
                    :key="tech" 
                    class="tech-tag"
                  >
                    {{ tech }}
                  </span>
                </div>
              </div>

              <!-- 카드 푸터 - 역할별 액션 -->
              <div class="card-footer">
                <!-- PM 권한이 있고 모집 중인 프로젝트 -->
                <div v-if="project.isPM && project.status === 'recruiting'" class="pm-actions">
                  <button 
                    class="action-btn applicants-btn"
                    @click="showApplicants(project.id)"
                    :disabled="project.applicants === 0"
                  >
                    <span class="btn-icon">👤</span>
                    지원자 확인 ({{ project.applicants }})
                  </button>
                </div>

                <!-- 진행 중인 프로젝트 -->
                <div v-else-if="project.status === 'in-progress'" class="progress-actions">
                  <button class="action-btn view-btn" @click="viewProject(project.id)">
                    <span class="btn-icon">👁️</span>
                    프로젝트 보기
                  </button>
                </div>

                <!-- 완료된 프로젝트 -->
                <div v-else-if="project.status === 'completed'" class="completed-actions">
                  <button class="action-btn review-btn" @click="showTeamReview(project.id)">
                    <span class="btn-icon">⭐</span>
                    팀원 리뷰 작성
                  </button>
                  <button class="action-btn view-btn" @click="viewProject(project.id)">
                    <span class="btn-icon">👁️</span>
                    프로젝트 보기
                  </button>
                </div>

                <!-- 기본 액션 -->
                <div v-else class="default-actions">
                  <button class="action-btn view-btn" @click="viewProject(project.id)">
                    <span class="btn-icon">👁️</span>
                    프로젝트 보기
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          <div v-else class="empty-state">
            <div class="empty-icon">
              <span class="empty-emoji">📁</span>
            </div>
            <h3 class="empty-title">프로젝트가 없습니다</h3>
            <p class="empty-description">새로운 프로젝트에 참여해보세요</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 지원자 목록 모달 -->
    <div v-if="showApplicantsModal" class="modal-overlay" @click="closeApplicantsModal">
      <div class="modal-container applicants-modal" @click.stop>
        <div class="modal-header">
          <h3 class="modal-title">{{ selectedProject?.title }} - 지원자 목록</h3>
          <button @click="closeApplicantsModal" class="modal-close-button">
            <span class="close-icon">✕</span>
          </button>
        </div>
        
        <div class="modal-body">
          <div v-if="applicantsList.length > 0" class="applicants-list">
            <div
              v-for="applicant in applicantsList"
              :key="applicant.id"
              class="applicant-card"
            >
              <div class="applicant-header">
                <div class="applicant-profile">
                  <img :src="applicant.avatar" :alt="applicant.name" class="applicant-avatar" />
                  <div class="applicant-info">
                    <h4 class="applicant-name">{{ applicant.name }}</h4>
                    <p class="applicant-title">{{ applicant.jobTitle }}</p>
                    <div class="applicant-skills">
                      <span 
                        v-for="skill in applicant.skills.slice(0, 3)" 
                        :key="skill" 
                        class="skill-tag"
                      >
                        {{ skill }}
                      </span>
                    </div>
                  </div>
                </div>
                <div class="applicant-actions">
                  <button 
                    class="portfolio-btn"
                    @click="viewApplicantPortfolio(applicant.userId)"
                  >
                    <span class="btn-icon">👤</span>
                    포트폴리오
                  </button>
                </div>
              </div>
              
              <div class="application-message">
                <h5 class="message-title">지원 메시지</h5>
                <p class="message-content">{{ applicant.applicationMessage }}</p>
              </div>
              
              <div class="application-actions">
                <button 
                  class="accept-btn"
                  @click="acceptApplicant(applicant.id)"
                >
                  <span class="btn-icon">✅</span>
                  수락
                </button>
                <button 
                  class="reject-btn"
                  @click="rejectApplicant(applicant.id)"
                >
                  <span class="btn-icon">❌</span>
                  거절
                </button>
              </div>
            </div>
          </div>
          
          <div v-else class="no-applicants">
            <span class="empty-emoji">👤</span>
            <p>아직 지원자가 없습니다</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 팀원 리뷰 모달 -->
    <div v-if="showTeamReviewModal" class="modal-overlay" @click="closeTeamReviewModal">
      <div class="modal-container review-modal" @click.stop>
        <div class="modal-header">
          <h3 class="modal-title">{{ selectedProject?.title }} - 팀원 리뷰</h3>
          <button @click="closeTeamReviewModal" class="modal-close-button">
            <span class="close-icon">✕</span>
          </button>
        </div>
        
        <div class="modal-body">
          <div v-if="teamMembers.length > 0" class="team-members-list">
            <div
              v-for="member in teamMembers"
              :key="member.id"
              class="member-card"
            >
              <div class="member-header">
                <div class="member-profile">
                  <img :src="member.avatar" :alt="member.name" class="member-avatar" />
                  <div class="member-info">
                    <h4 class="member-name">{{ member.name }}</h4>
                    <p class="member-role">{{ member.role }}</p>
                  </div>
                </div>
              </div>
              
              <div class="review-section">
                <div class="rating-section">
                  <label>평점</label>
                  <div class="star-rating">
                    <button
                      v-for="star in 5"
                      :key="star"
                      :class="['star-btn', { 'active': member.rating >= star }]"
                      @click="setRating(member.id, star)"
                    >
                      <span class="star-emoji">⭐</span>
                    </button>
                  </div>
                </div>
                
                <div class="comment-section">
                  <label>리뷰 코멘트</label>
                  <textarea
                    v-model="member.reviewComment"
                    placeholder="팀원에 대한 리뷰를 작성해주세요..."
                    rows="3"
                    class="review-textarea"
                  ></textarea>
                </div>
              </div>
            </div>
          </div>
          
          <div class="review-actions">
            <button class="submit-review-btn" @click="submitReviews">
              <span class="btn-icon">✅</span>
              리뷰 제출
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// 반응형 데이터
const selectedStatus = ref('all')
const selectedRole = ref('all')
const showApplicantsModal = ref(false)
const showTeamReviewModal = ref(false)
const selectedProject = ref(null)

// 필터 옵션
const statusOptions = [
  { value: 'all', label: '전체', icon: '📋' },
  { value: 'recruiting', label: '모집중', icon: '📢' },
  { value: 'in-progress', label: '진행중', icon: '⚡' },
  { value: 'completed', label: '완료', icon: '✅' },
  { value: 'cancelled', label: '취소', icon: '❌' }
]

const roleOptions = [
  { value: 'all', label: '전체' },
  { value: 'pm', label: 'PM만' },
  { value: 'member', label: '팀원만' }
]

// 내 프로젝트 데이터 (실제 projects 데이터와 연동)
const projects = ref([
  {
    id: 1,
    title: 'AI 기반 협업툴 백엔드 개발',
    description: 'AI 추천을 기반으로 한 팀 매칭 서비스의 서버 설계와 구현. Spring Boot와 JWT 기반 인증 시스템, 실시간 AI 추천 엔진과 협업 환경을 구축하며 다양한 클라우드 경험을 쌓을 수 있습니다.',
    status: 'recruiting', // '모집중' -> 'recruiting'
    isPM: true, // 김개발자가 PM인 프로젝트
    startDate: '2024-07-01',
    endDate: '2024-11-01',
    teamSize: 3,
    applicants: 8,
    techStack: ['Spring Boot', 'JWT', 'PostgreSQL', 'Redis']
  },
  {
    id: 3,
    title: 'Web 프레임워크 및 UI 시스템 고도화',
    description: '현대적인 웹 프론트엔드 시스템을 구축하는 프로젝트입니다. React, TypeScript, StoryBook을 활용하여 UI 시스템 설계와 성능 최적화까지 실무처럼 경험할 수 있습니다.',
    status: 'in-progress', // 진행 중
    isPM: true, // 김개발자가 PM인 프로젝트
    startDate: '2024-07-10',
    endDate: '2024-12-31',
    teamSize: 3,
    applicants: 0,
    techStack: ['React', 'TypeScript', 'Vite', 'StoryBook', 'CSS-in-JS']
  },
  {
    id: 8,
    title: 'B2B 쇼핑몰 프론트 고도화',
    description: '대규모 B2B 쇼핑몰 프론트엔드 구조 개선. Vue.js와 Pinia로 SPA 구조 전환, 성능 개선 및 코드 리팩토링 경험 제공.',
    status: 'completed', // 완료된 프로젝트
    isPM: true, // 김개발자가 PM인 프로젝트
    startDate: '2024-03-01',
    endDate: '2024-06-30',
    teamSize: 4,
    applicants: 0,
    techStack: ['Vue.js', 'TypeScript', 'Pinia']
  },
  {
    id: 2,
    title: 'Lock Screen 앱 5종 AOS 최신화 및 마켓 등록',
    description: '안드로이드 앱 개발 및 Google Play 스토어 등록 프로젝트입니다. 기존 락스크린 앱을 최신 Android 버전에 맞게 리팩토링하고, 배포 및 마켓 출시까지 전 과정을 함께합니다.',
    status: 'in-progress', // 진행 중
    isPM: false, // 팀원으로 참여
    startDate: '2024-07-05',
    endDate: '2024-10-05',
    teamSize: 6,
    applicants: 0,
    techStack: ['Android', 'Kotlin', 'Google Play']
  },
  {
    id: 4,
    title: 'E-commerce 플랫폼 디자인 시스템',
    description: '사용자 친화적인 온라인 쇼핑몰 UI/UX 디자인 프로젝트. Figma와 Prototyping을 통한 디자인 시스템 설계, 실무 중심의 UI/UX 프로젝트 경험 제공.',
    status: 'cancelled', // 취소된 프로젝트
    isPM: false, // 팀원으로 참여
    startDate: '2024-05-01',
    endDate: '2024-08-30',
    teamSize: 4,
    applicants: 0,
    techStack: ['UI/UX', 'Figma', '디자인시스템', 'Prototyping']
  }
])

// 지원자 샘플 데이터 (portfolioDatabase와 연결)
const applicantsList = ref([
  {
    id: 1,
    userId: 2, // 박디자이너
    name: '박디자이너',
    jobTitle: 'UI/UX Designer',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=2',
    skills: ['Figma', 'Adobe XD', 'Sketch'],
    applicationMessage: '안녕하세요! E-commerce 플랫폼 개발에 UI/UX 디자이너로 참여하고 싶습니다. 사용자 중심의 디자인 사고를 바탕으로 직관적이고 아름다운 인터페이스를 만들어드리겠습니다. 이커머스 플랫폼 디자인 경험이 있어 사용자 경험 최적화에 기여할 수 있습니다.'
  },
  {
    id: 2,
    userId: 3, // 이백엔드
    name: '이백엔드',
    jobTitle: 'Backend Developer',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=3',
    skills: ['Node.js', 'Python', 'Docker'],
    applicationMessage: '백엔드 개발자로 지원합니다. 안정적이고 확장 가능한 서버 아키텍처 구축을 전문으로 하며, 클라우드 환경과 마이크로서비스 아키텍처에 관심이 많습니다. E-commerce 플랫폼의 대용량 트래픽 처리 경험이 있어 도움이 될 수 있을 것 같습니다.'
  },
  {
    id: 3,
    userId: 4, // 정모바일
    name: '정모바일',
    jobTitle: 'Mobile Developer',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=4',
    skills: ['Flutter', 'React Native', 'iOS'],
    applicationMessage: '모바일 개발자로 참여하고 싶습니다. 크로스 플랫폼 모바일 앱 개발을 전문으로 하며, E-commerce 플랫폼과 연동되는 모바일 앱 개발에 기여하고 싶습니다. Flutter와 React Native를 활용하여 효율적인 앱 개발이 가능합니다.'
  }
])

// 팀원 샘플 데이터 (portfolioDatabase와 연결)
const teamMembers = ref([
  {
    id: 1,
    userId: 2, // 박디자이너
    name: '박디자이너',
    role: 'UI/UX Designer',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=2',
    rating: 0,
    reviewComment: ''
  },
  {
    id: 2,
    userId: 3, // 이백엔드
    name: '이백엔드',
    role: 'Backend Developer', 
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=3',
    rating: 0,
    reviewComment: ''
  },
  {
    id: 3,
    userId: 5, // 최AI
    name: '최AI',
    role: 'AI/ML Engineer',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=5',
    rating: 0,
    reviewComment: ''
  }
])

// 계산된 속성
const totalProjects = computed(() => projects.value.length)
const pmProjects = computed(() => projects.value.filter(p => p.isPM).length)
const activeProjects = computed(() => projects.value.filter(p => p.status === 'in-progress' || p.status === 'recruiting').length)

const filteredProjects = computed(() => {
  let filtered = projects.value

  // 상태 필터
  if (selectedStatus.value !== 'all') {
    filtered = filtered.filter(p => p.status === selectedStatus.value)
  }

  // 역할 필터
  if (selectedRole.value === 'pm') {
    filtered = filtered.filter(p => p.isPM)
  } else if (selectedRole.value === 'member') {
    filtered = filtered.filter(p => !p.isPM)
  }

  return filtered
})

// 메서드
const setStatus = (status) => {
  selectedStatus.value = status
}

const setRole = (role) => {
  selectedRole.value = role
}

const getStatusText = (status) => {
  const statusMap = {
    recruiting: '모집중',
    'in-progress': '진행중',
    completed: '완료',
    cancelled: '취소됨'
  }
  return statusMap[status] || status
}

const formatDateRange = (startDate, endDate) => {
  const start = new Date(startDate).toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' })
  const end = new Date(endDate).toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' })
  return `${start} ~ ${end}`
}

const viewProject = (projectId) => {
  // 프로젝트 상세 페이지로 이동
  console.log('프로젝트 상세보기:', projectId)
  router.push(`/projects/${projectId}`)
}

const showApplicants = (projectId) => {
  selectedProject.value = projects.value.find(p => p.id === projectId)
  showApplicantsModal.value = true
}

const closeApplicantsModal = () => {
  showApplicantsModal.value = false
  selectedProject.value = null
}

const showTeamReview = (projectId) => {
  selectedProject.value = projects.value.find(p => p.id === projectId)
  showTeamReviewModal.value = true
}

const closeTeamReviewModal = () => {
  showTeamReviewModal.value = false
  selectedProject.value = null
  // 리뷰 데이터 초기화
  teamMembers.value.forEach(member => {
    member.rating = 0
    member.reviewComment = ''
  })
}

const viewApplicantPortfolio = (userId) => {
  // userId로 직접 포트폴리오 페이지로 이동
  console.log('포트폴리오 이동:', userId)
  router.push(`/portfolio/${userId}`)
}

const acceptApplicant = (applicantId) => {
  console.log('지원자 수락:', applicantId)
  // 실제로는 API 호출
}

const rejectApplicant = (applicantId) => {
  console.log('지원자 거절:', applicantId)
  // 실제로는 API 호출
}

const setRating = (memberId, rating) => {
  const member = teamMembers.value.find(m => m.id === memberId)
  if (member) {
    member.rating = rating
  }
}

const submitReviews = () => {
  console.log('리뷰 제출:', teamMembers.value)
  closeTeamReviewModal()
  // 실제로는 API 호출
}
</script>

<style scoped>
.my-projects-page {
  padding: 20px;
  background: #f8f9fa;
  min-height: calc(100vh - 60px);
}

.container {
  max-width: 1400px;
  margin: 0 auto;
}

.content-wrapper {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

/* 필터 섹션 */
.filters-section {
  width: 100%;
}

.filters-card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.filter-label {
  font-size: 14px;
  font-weight: 600;
  color: #4CAF50;
  margin-bottom: 4px;
}

.status-filters,
.role-filters {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.status-btn,
.role-btn {
  padding: 8px 16px;
  border: 2px solid rgba(76, 175, 80, 0.2);
  border-radius: 20px;
  background: #fff;
  color: #4CAF50;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 6px;
}

.status-btn:hover,
.role-btn:hover {
  border-color: #4CAF50;
  background: rgba(76, 175, 80, 0.05);
}

.status-btn.active,
.role-btn.active {
  background: #4CAF50;
  color: #fff;
  border-color: #4CAF50;
}

.status-icon {
  font-size: 14px;
}

/* 상태별 색상 */
.status-btn.recruiting.active {
  background: #2196F3;
  border-color: #2196F3;
}

.status-btn.in-progress.active {
  background: #FF9800;
  border-color: #FF9800;
}

.status-btn.completed.active {
  background: #4CAF50;
  border-color: #4CAF50;
}

.status-btn.cancelled.active {
  background: #F44336;
  border-color: #F44336;
}

/* 프로젝트 섹션 */
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.section-title {
  font-size: 24px;
  font-weight: 700;
  color: #262626;
  margin: 0;
}

.stats-mini {
  display: flex;
  align-items: center;
  gap: 20px;
  background: white;
  padding: 12px 20px;
  border-radius: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 2px;
}

.stat-number {
  font-size: 18px;
  font-weight: 700;
  color: #4CAF50;
}

.stat-label {
  font-size: 12px;
  color: #666;
  font-weight: 500;
}

.stat-divider {
  width: 1px;
  height: 24px;
  background: rgba(76, 175, 80, 0.2);
}

.projects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 20px;
}

/* 프로젝트 카드 */
.project-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  border-left: 4px solid #4CAF50;
}

.project-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

/* 카드 헤더 */
.card-header {
  padding: 24px;
  border-bottom: 1px solid #f0f0f0;
}

.project-title-section {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
}

.project-title {
  font-size: 18px;
  font-weight: 700;
  color: #262626;
  margin: 0;
  line-height: 1.3;
  flex: 1;
}

.project-badges {
  display: flex;
  gap: 8px;
  flex-shrink: 0;
  margin-left: 16px;
}

.status-badge {
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.status-badge.recruiting {
  background: rgba(33, 150, 243, 0.1);
  color: #2196F3;
  border: 1px solid rgba(33, 150, 243, 0.2);
}

.status-badge.in-progress {
  background: rgba(255, 152, 0, 0.1);
  color: #FF9800;
  border: 1px solid rgba(255, 152, 0, 0.2);
}

.status-badge.completed {
  background: rgba(76, 175, 80, 0.1);
  color: #4CAF50;
  border: 1px solid rgba(76, 175, 80, 0.2);
}

.status-badge.cancelled {
  background: rgba(244, 67, 54, 0.1);
  color: #F44336;
  border: 1px solid rgba(244, 67, 54, 0.2);
}

.pm-badge {
  background: linear-gradient(135deg, #FFD700, #FFA000);
  color: #fff;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 4px;
}

.pm-icon {
  font-size: 10px;
}

.project-description {
  font-size: 14px;
  color: #666;
  line-height: 1.5;
  margin: 0 0 16px 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.project-meta {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: #666;
  font-weight: 500;
}

.meta-icon {
  font-size: 14px;
}

/* 기술 스택 섹션 */
.tech-stack-section {
  padding: 16px 24px;
  background: rgba(76, 175, 80, 0.02);
  border-bottom: 1px solid #f0f0f0;
}

.tech-stack-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tech-tag {
  padding: 4px 8px;
  background: rgba(76, 175, 80, 0.1);
  color: #4CAF50;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 500;
  border: 1px solid rgba(76, 175, 80, 0.2);
}

/* 카드 푸터 */
.card-footer {
  padding: 20px 24px;
}

.pm-actions,
.progress-actions,
.completed-actions,
.default-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}

.action-btn {
  padding: 10px 16px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 6px;
  border: none;
}

.btn-icon {
  font-size: 14px;
}

.applicants-btn {
  background: #2196F3;
  color: #fff;
}

.applicants-btn:hover:not(:disabled) {
  background: #1976D2;
  transform: translateY(-1px);
}

.applicants-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
  transform: none;
}

.view-btn {
  background: rgba(76, 175, 80, 0.1);
  color: #4CAF50;
  border: 1px solid rgba(76, 175, 80, 0.2);
}

.view-btn:hover {
  background: rgba(76, 175, 80, 0.2);
  border-color: #4CAF50;
}

.review-btn {
  background: #FF9800;
  color: #fff;
}

.review-btn:hover {
  background: #F57C00;
  transform: translateY(-1px);
}

/* 빈 상태 */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 60px 20px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.empty-icon {
  width: 80px;
  height: 80px;
  background: rgba(76, 175, 80, 0.1);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 24px;
}

.empty-emoji {
  font-size: 36px;
}

.empty-title {
  font-size: 20px;
  font-weight: 700;
  color: #262626;
  margin: 0 0 12px 0;
}

.empty-description {
  font-size: 16px;
  color: #666;
  margin: 0;
  line-height: 1.5;
}

/* 모달 스타일 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  backdrop-filter: blur(4px);
}

.modal-container {
  background: #FFF;
  border-radius: 16px;
  width: 90%;
  max-width: 800px;
  max-height: 90vh;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
  animation: modalSlideIn 0.3s ease-out;
}

@keyframes modalSlideIn {
  from {
    opacity: 0;
    transform: translateY(-50px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 30px;
  border-bottom: 2px solid #f0f0f0;
  background: linear-gradient(135deg, #4CAF50, #66BB6A);
  color: white;
}

.modal-title {
  margin: 0;
  font-size: 20px;
  font-weight: 700;
}

.modal-close-button {
  background: none;
  border: none;
  color: white;
  font-size: 20px;
  cursor: pointer;
  padding: 8px;
  border-radius: 50%;
  transition: background 0.2s ease;
}

.modal-close-button:hover {
  background: rgba(255, 255, 255, 0.2);
}

.close-icon {
  font-size: 18px;
  font-weight: bold;
}

.modal-body {
  flex: 1;
  padding: 30px;
  overflow-y: auto;
  max-height: calc(90vh - 140px);
}

/* 지원자 목록 */
.applicants-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.applicant-card {
  border: 2px solid rgba(76, 175, 80, 0.1);
  border-radius: 12px;
  padding: 20px;
  background: rgba(76, 175, 80, 0.02);
}

.applicant-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
}

.applicant-profile {
  display: flex;
  gap: 16px;
  flex: 1;
}

.applicant-avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid rgba(76, 175, 80, 0.2);
}

.applicant-info {
  flex: 1;
}

.applicant-name {
  font-size: 18px;
  font-weight: 700;
  color: #262626;
  margin: 0 0 4px 0;
}

.applicant-title {
  font-size: 14px;
  color: #4CAF50;
  font-weight: 600;
  margin: 0 0 8px 0;
}

.applicant-skills {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.applicant-skills .skill-tag {
  padding: 3px 8px;
  background: rgba(76, 175, 80, 0.1);
  color: #4CAF50;
  font-size: 11px;
  border-radius: 10px;
}

.applicant-actions {
  display: flex;
  gap: 8px;
}

.portfolio-btn {
  padding: 8px 16px;
  background: rgba(76, 175, 80, 0.1);
  color: #4CAF50;
  border: 1px solid rgba(76, 175, 80, 0.2);
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 6px;
}

.portfolio-btn:hover {
  background: rgba(76, 175, 80, 0.2);
  border-color: #4CAF50;
}

.application-message {
  margin-bottom: 16px;
}

.message-title {
  font-size: 14px;
  font-weight: 600;
  color: #4CAF50;
  margin: 0 0 8px 0;
}

.message-content {
  font-size: 14px;
  color: #666;
  line-height: 1.5;
  margin: 0;
  padding: 12px;
  background: rgba(76, 175, 80, 0.05);
  border-radius: 8px;
  border-left: 4px solid #4CAF50;
}

.application-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}

.accept-btn,
.reject-btn {
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 6px;
  border: none;
}

.accept-btn {
  background: #4CAF50;
  color: #fff;
}

.accept-btn:hover {
  background: #66BB6A;
  transform: translateY(-1px);
}

.reject-btn {
  background: rgba(244, 67, 54, 0.1);
  color: #F44336;
  border: 1px solid rgba(244, 67, 54, 0.2);
}

.reject-btn:hover {
  background: rgba(244, 67, 54, 0.2);
  border-color: #F44336;
}

.no-applicants {
  text-align: center;
  padding: 60px 20px;
  color: #666;
}

.no-applicants .empty-emoji {
  font-size: 48px;
  margin-bottom: 16px;
  display: block;
}

/* 팀원 리뷰 */
.team-members-list {
  display: flex;
  flex-direction: column;
  gap: 24px;
  margin-bottom: 24px;
}

.member-card {
  border: 2px solid rgba(76, 175, 80, 0.1);
  border-radius: 12px;
  padding: 20px;
  background: rgba(76, 175, 80, 0.02);
}

.member-header {
  margin-bottom: 20px;
}

.member-profile {
  display: flex;
  gap: 16px;
  align-items: center;
}

.member-avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid rgba(76, 175, 80, 0.2);
}

.member-info {
  flex: 1;
}

.member-name {
  font-size: 16px;
  font-weight: 700;
  color: #262626;
  margin: 0 0 4px 0;
}

.member-role {
  font-size: 14px;
  color: #4CAF50;
  font-weight: 600;
  margin: 0;
}

.review-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.rating-section,
.comment-section {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.rating-section label,
.comment-section label {
  font-size: 14px;
  font-weight: 600;
  color: #4CAF50;
}

.star-rating {
  display: flex;
  gap: 4px;
}

.star-btn {
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  transition: all 0.2s ease;
  opacity: 0.3;
}

.star-btn.active {
  opacity: 1;
}

.star-btn:hover {
  opacity: 1;
  transform: scale(1.1);
}

.star-emoji {
  filter: grayscale(100%);
  transition: filter 0.2s ease;
}

.star-btn.active .star-emoji,
.star-btn:hover .star-emoji {
  filter: grayscale(0%);
}

.review-textarea {
  width: 100%;
  padding: 12px;
  border: 2px solid rgba(76, 175, 80, 0.2);
  border-radius: 8px;
  font-size: 14px;
  font-family: inherit;
  resize: vertical;
  outline: none;
  transition: border-color 0.3s ease;
  box-sizing: border-box;
}

.review-textarea:focus {
  border-color: #4CAF50;
}

.review-actions {
  display: flex;
  justify-content: center;
  padding-top: 24px;
  border-top: 1px solid rgba(76, 175, 80, 0.1);
}

.submit-review-btn {
  padding: 12px 32px;
  background: #4CAF50;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
}

.submit-review-btn:hover {
  background: #66BB6A;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(76, 175, 80, 0.3);
}

/* 반응형 디자인 */
@media (max-width: 1200px) {
  .projects-grid {
    grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  }
}

@media (max-width: 768px) {
  .my-projects-page {
    padding: 15px;
  }

  .section-header {
    flex-direction: column;
    gap: 16px;
    align-items: flex-start;
  }

  .stats-mini {
    align-self: stretch;
    justify-content: center;
  }

  .filters-card {
    padding: 20px;
    gap: 16px;
  }

  .projects-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .project-title-section {
    flex-direction: column;
    gap: 12px;
  }

  .project-badges {
    margin-left: 0;
    justify-content: flex-start;
  }

  .modal-container {
    width: 95%;
    max-height: 95vh;
  }

  .modal-header,
  .modal-body {
    padding: 20px;
  }

  .applicant-header {
    flex-direction: column;
    gap: 16px;
  }

  .application-actions,
  .pm-actions,
  .progress-actions,
  .completed-actions {
    flex-direction: column;
    gap: 8px;
  }
}

@media (max-width: 480px) {
  .my-projects-page {
    padding: 10px;
  }

  .filters-card {
    padding: 16px;
    gap: 16px;
  }

  .status-filters,
  .role-filters {
    gap: 6px;
  }

  .status-btn,
  .role-btn {
    padding: 6px 12px;
    font-size: 13px;
  }

  .card-header,
  .tech-stack-section,
  .card-footer {
    padding: 16px;
  }

  .project-title {
    font-size: 16px;
  }

  .modal-header,
  .modal-body {
    padding: 16px;
  }

  .modal-title {
    font-size: 18px;
  }

  .stats-mini {
    gap: 12px;
    padding: 10px 16px;
  }

  .stat-number {
    font-size: 16px;
  }

  .stat-label {
    font-size: 11px;
  }
}
</style>