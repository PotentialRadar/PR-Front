<template>
  <div class="my-projects-page">
    <div class="background-gradient"></div>
    
    <!-- 페이지 헤더 -->
    <div class="page-header">
      <div class="header-content">
        <div class="title-section">
          <h1 class="page-title">내 프로젝트</h1>
          <div class="title-underline"></div>
        </div>
        <p class="page-subtitle">참여 중인 프로젝트와 관리 중인 프로젝트를 확인하세요</p>
        
        <div class="stats-section">
          <div class="stat-item">
            <div class="stat-number">{{ totalProjects }}</div>
            <div class="stat-label">전체 프로젝트</div>
          </div>
          <div class="stat-divider"></div>
          <div class="stat-item">
            <div class="stat-number">{{ pmProjects }}</div>
            <div class="stat-label">PM 프로젝트</div>
          </div>
          <div class="stat-divider"></div>
          <div class="stat-item">
            <div class="stat-number">{{ activeProjects }}</div>
            <div class="stat-label">진행 중</div>
          </div>
        </div>
      </div>
    </div>

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
                  <i :class="status.icon"></i>
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
                        <i class="bi bi-star-fill"></i>
                        PM
                      </span>
                    </div>
                  </div>
                  <p class="project-description">{{ project.description }}</p>
                  <div class="project-meta">
                    <div class="meta-item">
                      <i class="bi bi-calendar"></i>
                      <span>{{ formatDateRange(project.startDate, project.endDate) }}</span>
                    </div>
                    <div class="meta-item">
                      <i class="bi bi-people"></i>
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
                    <i class="bi bi-person-lines-fill"></i>
                    지원자 확인 ({{ project.applicants }})
                  </button>
                </div>

                <!-- 진행 중인 프로젝트 -->
                <div v-else-if="project.status === 'in-progress'" class="progress-actions">
                  <button class="action-btn view-btn" @click="viewProject(project.id)">
                    <i class="bi bi-eye"></i>
                    프로젝트 보기
                  </button>
                </div>

                <!-- 완료된 프로젝트 -->
                <div v-else-if="project.status === 'completed'" class="completed-actions">
                  <button class="action-btn review-btn" @click="showTeamReview(project.id)">
                    <i class="bi bi-star"></i>
                    팀원 리뷰 작성
                  </button>
                  <button class="action-btn view-btn" @click="viewProject(project.id)">
                    <i class="bi bi-eye"></i>
                    프로젝트 보기
                  </button>
                </div>

                <!-- 기본 액션 -->
                <div v-else class="default-actions">
                  <button class="action-btn view-btn" @click="viewProject(project.id)">
                    <i class="bi bi-eye"></i>
                    프로젝트 보기
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          <div v-else class="empty-state">
            <div class="empty-icon">
              <i class="bi bi-folder2-open"></i>
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
            <i class="bi bi-x"></i>
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
                    @click="viewApplicantPortfolio(applicant.id)"
                  >
                    <i class="bi bi-person-badge"></i>
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
                  <i class="bi bi-check-circle"></i>
                  수락
                </button>
                <button 
                  class="reject-btn"
                  @click="rejectApplicant(applicant.id)"
                >
                  <i class="bi bi-x-circle"></i>
                  거절
                </button>
              </div>
            </div>
          </div>
          
          <div v-else class="no-applicants">
            <i class="bi bi-person-x"></i>
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
            <i class="bi bi-x"></i>
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
                      <i class="bi bi-star-fill"></i>
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
              <i class="bi bi-check-lg"></i>
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

// 반응형 데이터
const selectedStatus = ref('all')
const selectedRole = ref('all')
const showApplicantsModal = ref(false)
const showTeamReviewModal = ref(false)
const selectedProject = ref(null)

// 필터 옵션
const statusOptions = [
  { value: 'all', label: '전체', icon: 'bi bi-grid' },
  { value: 'recruiting', label: '모집중', icon: 'bi bi-person-plus' },
  { value: 'in-progress', label: '진행중', icon: 'bi bi-play-circle' },
  { value: 'completed', label: '완료', icon: 'bi bi-check-circle' },
  { value: 'cancelled', label: '취소', icon: 'bi bi-x-circle' }
]

const roleOptions = [
  { value: 'all', label: '전체' },
  { value: 'pm', label: 'PM만' },
  { value: 'member', label: '팀원만' }
]

// 샘플 프로젝트 데이터
const projects = ref([
  {
    id: 1,
    title: 'E-commerce 플랫폼 개발',
    description: '온라인 쇼핑몰을 위한 풀스택 웹 애플리케이션 개발 프로젝트입니다.',
    status: 'recruiting',
    isPM: true,
    startDate: '2024-02-01',
    endDate: '2024-06-30',
    teamSize: 5,
    applicants: 12,
    techStack: ['React', 'Node.js', 'MongoDB', 'AWS']
  },
  {
    id: 2,
    title: '모바일 헬스케어 앱',
    description: '건강 관리를 위한 모바일 애플리케이션 개발',
    status: 'in-progress',
    isPM: false,
    startDate: '2024-01-15',
    endDate: '2024-05-15',
    teamSize: 4,
    applicants: 0,
    techStack: ['Flutter', 'Firebase', 'Node.js']
  },
  {
    id: 3,
    title: 'AI 챗봇 서비스',
    description: '자연어 처리를 활용한 고객 서비스 챗봇 개발',
    status: 'completed',
    isPM: true,
    startDate: '2023-09-01',
    endDate: '2023-12-31',
    teamSize: 6,
    applicants: 0,
    techStack: ['Python', 'TensorFlow', 'React', 'Docker']
  },
  {
    id: 4,
    title: '데이터 시각화 대시보드',
    description: '실시간 비즈니스 데이터 분석 및 시각화 도구',
    status: 'recruiting',
    isPM: false,
    startDate: '2024-03-01',
    endDate: '2024-07-31',
    teamSize: 3,
    applicants: 8,
    techStack: ['Vue.js', 'D3.js', 'Python', 'PostgreSQL']
  },
  {
    id: 5,
    title: '블록체인 투표 시스템',
    description: '투명하고 안전한 온라인 투표 플랫폼',
    status: 'cancelled',
    isPM: true,
    startDate: '2023-10-01',
    endDate: '2024-02-29',
    teamSize: 4,
    applicants: 0,
    techStack: ['Solidity', 'Web3.js', 'React', 'IPFS']
  }
])

// 지원자 샘플 데이터
const applicantsList = ref([
  {
    id: 1,
    name: '김개발',
    jobTitle: 'Frontend Developer',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=dev1',
    skills: ['React', 'TypeScript', 'Next.js'],
    applicationMessage: '안녕하세요! E-commerce 플랫폼 개발에 참여하고 싶습니다. React와 TypeScript를 활용한 프론트엔드 개발 경험이 3년 있으며, 특히 사용자 경험 최적화에 관심이 많습니다. 이번 프로젝트를 통해 팀과 함께 성장하고 싶습니다.'
  },
  {
    id: 2,
    name: '박백엔드',
    jobTitle: 'Backend Developer',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=dev2',
    skills: ['Node.js', 'MongoDB', 'AWS'],
    applicationMessage: '백엔드 개발자로 지원합니다. Node.js와 MongoDB를 활용한 API 개발 경험이 풍부하며, AWS 인프라 구축도 가능합니다. 확장 가능한 아키텍처 설계에 자신 있습니다.'
  },
  {
    id: 3,
    name: '이디자인',
    jobTitle: 'UI/UX Designer',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=dev3',
    skills: ['Figma', 'Adobe XD', 'Prototyping'],
    applicationMessage: 'UI/UX 디자이너로 참여하고 싶습니다. E-commerce 플랫폼의 사용자 경험 설계 경험이 있으며, 사용자 리서치부터 프로토타이핑까지 전 과정을 담당할 수 있습니다.'
  }
])

// 팀원 샘플 데이터
const teamMembers = ref([
  {
    id: 1,
    name: '김프론트',
    role: 'Frontend Developer',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=team1',
    rating: 0,
    reviewComment: ''
  },
  {
    id: 2,
    name: '박백엔드',
    role: 'Backend Developer', 
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=team2',
    rating: 0,
    reviewComment: ''
  },
  {
    id: 3,
    name: '최디자이너',
    role: 'UI/UX Designer',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=team3',
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
  console.log('프로젝트 상세보기:', projectId)
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

const viewApplicantPortfolio = (applicantId) => {
  console.log('지원자 포트폴리오 보기:', applicantId)
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
  min-height: 100vh;
  background: linear-gradient(135deg, #f8fffe 0%, #f0f9ff 50%, #ecfdf5 100%);
  position: relative;
  overflow-x: hidden;
}

.background-gradient {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 100vh;
  background: 
    radial-gradient(circle at 20% 20%, rgba(76, 175, 80, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 80% 60%, rgba(76, 175, 80, 0.08) 0%, transparent 50%),
    radial-gradient(circle at 40% 80%, rgba(76, 175, 80, 0.06) 0%, transparent 50%);
  pointer-events: none;
  z-index: -2;
}

/* 페이지 헤더 */
.page-header {
  width: 100%;
  margin-bottom: 60px;
  text-align: center;
  position: relative;
  z-index: 1;
}

.header-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 30px;
  padding: 80px 20px 40px 20px;
}

.title-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.page-title {
  font-size: 48px;
  font-weight: 900;
  color: #262626;
  margin: 0;
  letter-spacing: -1px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.title-underline {
  width: 100px;
  height: 4px;
  background: linear-gradient(90deg, #4CAF50 0%, #66BB6A 100%);
  border-radius: 2px;
  position: relative;
  animation: expandLine 1s ease-out;
}

.title-underline::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 12px;
  height: 12px;
  background: #4CAF50;
  border-radius: 50%;
  animation: pulse 2s infinite;
}

.page-subtitle {
  font-size: 20px;
  color: #666;
  margin: 0;
  font-weight: 400;
  opacity: 0;
  animation: fadeInUp 0.8s ease-out 0.3s forwards;
}

.stats-section {
  display: flex;
  align-items: center;
  gap: 40px;
  margin-top: 20px;
  opacity: 0;
  animation: fadeInUp 0.8s ease-out 0.5s forwards;
}

.stat-item {
  text-align: center;
}

.stat-number {
  font-size: 28px;
  font-weight: 800;
  color: #4CAF50;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 14px;
  color: #666;
  font-weight: 500;
}

.stat-divider {
  width: 1px;
  height: 40px;
  background: rgba(76, 175, 80, 0.2);
}

@keyframes expandLine {
  0% { width: 0; }
  100% { width: 100px; }
}

@keyframes pulse {
  0% { box-shadow: 0 0 0 0 rgba(76, 175, 80, 0.7); }
  70% { box-shadow: 0 0 0 8px rgba(76, 175, 80, 0); }
  100% { box-shadow: 0 0 0 0 rgba(76, 175, 80, 0); }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.container {
  width: 100%;
  display: flex;
  justify-content: center;
  position: relative;
  z-index: 1;
}

.content-wrapper {
  width: 100%;
  max-width: 1400px;
  padding: 0 20px 80px;
  display: flex;
  flex-direction: column;
  gap: 40px;
}

/* 필터 섹션 */
.filters-section {
  width: 100%;
}

.filters-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  padding: 30px;
  box-shadow: 0 10px 40px rgba(76, 175, 80, 0.1);
  border: 1px solid rgba(76, 175, 80, 0.1);
  display: flex;
  flex-direction: column;
  gap: 25px;
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
  margin-bottom: 30px;
}

.section-title {
  font-size: 24px;
  font-weight: 700;
  color: #262626;
  margin: 0;
}

.projects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 24px;
}

/* 프로젝트 카드 */
.project-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(76, 175, 80, 0.08);
  border: 1px solid rgba(76, 175, 80, 0.1);
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
}

.project-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 16px 48px rgba(76, 175, 80, 0.15);
  border-color: rgba(76, 175, 80, 0.2);
}

/* 카드 헤더 */
.card-header {
  padding: 24px;
  border-bottom: 1px solid rgba(76, 175, 80, 0.1);
}

.project-title-section {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
}

.project-title {
  font-size: 20px;
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

.meta-item i {
  color: #4CAF50;
  font-size: 14px;
}

/* 기술 스택 섹션 */
.tech-stack-section {
  padding: 16px 24px;
  background: rgba(76, 175, 80, 0.02);
  border-bottom: 1px solid rgba(76, 175, 80, 0.1);
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
  padding: 80px 20px;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  border: 1px solid rgba(76, 175, 80, 0.1);
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

.empty-icon i {
  font-size: 36px;
  color: #4CAF50;
}

.empty-title {
  font-size: 24px;
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
  font-size: 24px;
  cursor: pointer;
  padding: 8px;
  border-radius: 50%;
  transition: background 0.2s ease;
}

.modal-close-button:hover {
  background: rgba(255, 255, 255, 0.2);
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

.no-applicants i {
  font-size: 48px;
  margin-bottom: 16px;
  display: block;
  color: #ccc;
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
  font-size: 24px;
  color: #ddd;
  cursor: pointer;
  transition: color 0.2s ease;
}

.star-btn.active {
  color: #FFD700;
}

.star-btn:hover {
  color: #FFD700;
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
  .header-content {
    padding: 60px 15px 30px 15px;
  }

  .page-title {
    font-size: 36px;
  }

  .page-subtitle {
    font-size: 18px;
  }

  .stats-section {
    flex-direction: column;
    gap: 20px;
  }

  .stat-divider {
    width: 60px;
    height: 1px;
  }

  .filters-card {
    padding: 20px;
    gap: 20px;
  }

  .projects-grid {
    grid-template-columns: 1fr;
    gap: 20px;
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
  .page-title {
    font-size: 28px;
  }

  .page-subtitle {
    font-size: 16px;
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
    font-size: 18px;
  }

  .modal-header,
  .modal-body {
    padding: 16px;
  }

  .modal-title {
    font-size: 18px;
  }
}

</style>