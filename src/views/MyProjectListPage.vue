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
              :key="project.projectId" 
              class="project-card"
            >
              <!-- 카드 헤더 -->
              <div class="card-header">
                <div class="project-info">
                  <div class="project-title-section">
                    <h3 class="project-title">{{ project.title }}</h3>
                    <div class="project-badges">
                      <span :class="['status-badge', statusClass(project.status)]">
                        <i :class="getStatusIcon(project.status)"></i>
                        <span>{{ getStatusText(project.status) }}</span>
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
                      <span>{{ project.recruitCount }}명</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- 기술 스택 -->
              <div class="tech-stack-section">
                <div class="tech-stack-list">
                  <span 
                    v-for="ts in project.techStacks" 
                    :key="ts.techStackName" 
                    class="tech-tag"
                  >
                    {{ ts.techStackName }}
                  </span>
                </div>
              </div>

              <!-- 카드 푸터 - 역할별 액션 -->
              <div class="card-footer">
                <!-- PM 권한이 있고 모집 중인 프로젝트 -->
                <div v-if="project.isPM && project.status === 'RECRUITING'" class="pm-actions">
                  <button 
                    class="action-btn applicants-btn"
                    @click="showApplicants(project.projectId)"
                    :disabled="project.appliedCount === 0"
                  >
                    <span class="btn-icon">👤</span>
                    지원자 확인 ({{ project.appliedCount }})
                  </button>
                  <button class="action-btn manage-btn" @click="goToManagePage(project.projectId)">
                    <span class="btn-icon">⚙️</span>
                    관리
                  </button>
                </div>

                <!-- PM 권한이 있고 진행 중인 프로젝트 -->
                <div v-else-if="project.isPM && project.status === 'IN_PROGRESS'" class="progress-actions">
                  <button class="action-btn manage-btn" @click="goToManagePage(project.projectId)">
                    <span class="btn-icon">⚙️</span>
                    관리
                  </button>
                </div>

                <!-- PM 권한이 있고 완료된 프로젝트 -->
                <div v-else-if="project.isPM && project.status === 'COMPLETED'" class="completed-actions">
                  <button class="action-btn review-btn" @click="showTeamReview(project.projectId)">
                    <span class="btn-icon">⭐</span>
                    팀원 리뷰 작성
                  </button>
                  <button class="action-btn manage-btn" @click="goToManagePage(project.projectId)">
                    <span class="btn-icon">⚙️</span>
                    관리
                  </button>
                </div>

                <!-- PM 권한이 없는 경우 (기본 액션) -->
                <div v-else class="default-actions">
                  <button class="action-btn view-btn" @click="viewProject(project.projectId)">
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
          <div v-if="sortedApplicantsList && sortedApplicantsList.length > 0" class="applicants-list">
            <div
              v-for="applicant in sortedApplicantsList"
              :key="applicant.id"
              :class="['applicant-card', { 'processed': applicant.status !== 'PENDING' }]"
            >
              <div class="applicant-header">
                <div class="applicant-profile">
                  <img :src="`https://api.dicebear.com/7.x/avataaars/svg?seed=${applicant.userId}`" :alt="applicant.userName" class="applicant-avatar" />
                  <div class="applicant-info">
                    <h4 class="applicant-name">{{ applicant.userName }}</h4>
                    <p class="applicant-title">{{ getPartLabel(applicant.techPart) }}</p> <!-- 기술 파트 표시 -->
                  </div>
                </div>
                <div class="applicant-actions">
                  <span v-if="applicant.status === 'ACCEPTED'" class="status-badge accepted">수락됨</span>
                  <span v-else-if="applicant.status === 'REJECTED'" class="status-badge rejected">거절됨</span>
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
                  v-if="applicant.status === 'PENDING'"
                  class="accept-btn"
                  @click="acceptApplicant(applicant.id)"
                >
                  <span class="btn-icon">✅</span>
                  수락
                </button>
                <button 
                  v-if="applicant.status === 'PENDING'"
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
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getProjectsCreatedByUser, getAppliedProjectsByUser } from '@/api/projects'   // ★ 새 API import
        // ★ updateMemberStatus 추가
import { useUserStore } from '@/stores/userStore'; // NEW
import { PART_OPTIONS } from '@/constants/parts';
import { updateMemberStatus, getProjectMembers } from '@/api/projectMember.js';
                                      // ★ 파트 라벨용

const router = useRouter()
const userStore = useUserStore()

// 반응형 상태
const isLoading = ref(true)
const projects = ref([])               // created + applied 병합 리스트(공통 shape)
const selectedStatus = ref('all')      // 'all' | 'recruiting' | 'in-progress' | 'completed' | 'cancelled'
const selectedRole = ref('all')        // 'all' | 'pm' | 'member'
const showApplicantsModal = ref(false)
const showTeamReviewModal = ref(false)
const selectedProject = ref(null)
const applicantsList = ref([])

// 필터 옵션
const statusOptions = [
  { value: 'all',         label: '전체',   icon: '📋' },
  { value: 'recruiting',  label: '모집중', icon: '📢' },
  { value: 'in-progress', label: '진행중', icon: '⚡' },
  { value: 'completed',   label: '완료',   icon: '✅' },
  { value: 'cancelled',   label: '취소',   icon: '❌' }
]
const roleOptions = [
  { value: 'all',    label: '전체' },
  { value: 'pm',     label: 'PM만' },
  { value: 'member', label: '팀원만' }
]

// 상태값 매핑
const STATUS_FILTER_TO_ENUM = {
  'recruiting':  'RECRUITING',
  'in-progress': 'IN_PROGRESS',
  'completed':   'COMPLETED',
  'cancelled':   'CANCELLED'
}
const ENUM_TO_CLASS = {
  'RECRUITING':  'recruiting',
  'IN_PROGRESS': 'in-progress',
  'COMPLETED':   'completed',
  'CANCELLED':   'cancelled'
}
const statusClass = (statusEnum) => ENUM_TO_CLASS[statusEnum] ?? 'unknown'

// 팀원 샘플 (리뷰 모달)
const teamMembers = ref([
  { id: 1, userId: 2, name: '박디자이너', role: 'UI/UX Designer', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=2', rating: 0, reviewComment: '' },
  { id: 2, userId: 3, name: '이백엔드',   role: 'Backend Developer', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=3', rating: 0, reviewComment: '' }
])

// ===== 정규화 유틸 =====
const toTechTags = (list) => {
  if (!Array.isArray(list)) return []
  return list.map(ts => (typeof ts === 'string' ? { techStackName: ts } : ts))
}

// 백엔드 "생성한 프로젝트" 응답 -> 공통 형태
const normalizeCreated = (p, currentUserId) => {
  const projectId = p.projectId ?? p.id
  const teamLeaderId = p.teamLeaderId ?? p.leaderId ?? p.ownerId ?? currentUserId
  return {
    projectId,
    title: p.title ?? '',
    description: p.description ?? '',
    status: p.status ?? 'RECRUITING',                 // 백엔드 ENUM 그대로 사용
    startDate: p.startDate ?? p.start_date ?? null,
    endDate:   p.endDate   ?? p.end_date   ?? null,
    recruitCount: p.recruitCount ?? p.remainingCount ?? p.memberCount ?? 0,
    techStacks: toTechTags(p.techStacks ?? p.stackList ?? []),
    appliedCount: p.appliedCount ?? p.applied_count ?? 0, // PM 카드에서만 사용
    teamLeaderId,
    isPM: teamLeaderId === currentUserId                // 내가 팀장인지
  }
}

// 백엔드 "지원한 프로젝트" 응답 -> 공통 형태
// 응답이 { project: {...} } 또는 필드가 평평하게 섞여 있을 수 있으니 방어적으로 처리
const normalizeApplied = (a, currentUserId) => {
  const proj = a.project ?? a; // Keep this logic. Handles both nested and flat structures.
  const teamLeaderId = proj.teamLeaderId ?? proj.leaderId ?? proj.ownerId ?? null;

  // The main issue is that `a.status` (application status) is overriding `proj.status` (project status).
  // Let's get the project status first, and only if it's truly missing, use the application status as a last resort.
  // A better approach is to find the correct project status field. Let's assume it's just `status` on the project object.
  const projectStatus = proj.status; // Explicitly get project status

  return {
    projectId: proj.projectId ?? proj.id ?? a.projectId,
    title: proj.title ?? proj.projectName ?? a.projectTitle ?? a.projectName ?? '제목을 불러올 수 없습니다.',
    description: proj.description ?? a.projectDescription ?? '내용을 불러올 수 없습니다.',
    
    // FIX: Use the project's status. Do NOT fall back to a.status (application status).
    status: projectStatus ?? 'RECRUITING', 

    startDate: proj.startDate ?? proj.start_date ?? a.startDate ?? null,
    endDate: proj.endDate ?? proj.end_date ?? a.endDate ?? null,
    recruitCount: proj.recruitCount ?? proj.remainingCount ?? a.recruitCount ?? 0,
    techStacks: toTechTags(proj.techStacks ?? a.techStacks ?? []),
    appliedCount: 0,
    teamLeaderId,
    isPM: teamLeaderId ? (teamLeaderId === currentUserId) : false
  };
}

// ===== 데이터 로드 =====
onMounted(async () => {
  try {
    const currentUserId = userStore.userId
    if (!currentUserId) {
      console.warn('User not logged in. Redirect to /login')
      router.push('/login')
      return
    }

    // 내가 만든 + 내가 지원한 프로젝트 병렬 호출
    const [createdRes, appliedRes] = await Promise.all([
      getProjectsCreatedByUser(currentUserId),
      getAppliedProjectsByUser(currentUserId)
    ])

    const created = Array.isArray(createdRes?.data) ? createdRes.data.map(p => normalizeCreated(p, currentUserId)) : []
    const applied = Array.isArray(appliedRes?.data) ? appliedRes.data.map(a => normalizeApplied(a, currentUserId)) : []

    // 병합 + projectId 기준 중복제거(혹시 동일 프로젝트가 두 목록에 같이 있으면 created 우선)
    const map = new Map()
    for (const p of [...applied, ...created]) map.set(p.projectId, p)
    projects.value = Array.from(map.values())
  } catch (e) {
    console.error('내 프로젝트/지원 프로젝트 로드 실패:', e)
    projects.value = []
  } finally {
    isLoading.value = false
  }
})

// ===== 계산된 값 =====
const totalProjects = computed(() => projects.value.length)
const pmProjects = computed(() => projects.value.filter(p => p.isPM).length)
const activeProjects = computed(() =>
    projects.value.filter(p => p.status === 'IN_PROGRESS' || p.status === 'RECRUITING').length
)

const filteredProjects = computed(() => {
  let filtered = projects.value

  // 상태 필터
  if (selectedStatus.value !== 'all') {
    const want = STATUS_FILTER_TO_ENUM[selectedStatus.value] // 'RECRUITING' 등
    if (want) filtered = filtered.filter(p => p.status === want)
  }

  // 역할 필터
  if (selectedRole.value === 'pm') {
    filtered = filtered.filter(p => p.isPM)
  } else if (selectedRole.value === 'member') {
    filtered = filtered.filter(p => !p.isPM)
  }

  return filtered
})

// ===== 지원자 모달/정렬 =====
const sortedApplicantsList = computed(() => {
  const order = { PENDING: 1, ACCEPTED: 2, REJECTED: 3 }
  return [...applicantsList.value].sort((a, b) => (order[a.status] ?? 99) - (order[b.status] ?? 99))
})

// ===== 헬퍼 =====
const setStatus  = (status) => { selectedStatus.value = status }
const setRole    = (role)   => { selectedRole.value   = role }

const getStatusText = (statusEnum) => {
  const map = { RECRUITING: '모집중', IN_PROGRESS: '진행중', COMPLETED: '완료', CANCELLED: '취소됨' }
  return map[statusEnum] ?? statusEnum
}
const getStatusIcon = (statusEnum) => {
  const map = {
    RECRUITING:  'bi bi-megaphone-fill',
    IN_PROGRESS: 'bi bi-lightning-charge-fill',
    COMPLETED:   'bi bi-check-circle-fill',
    CANCELLED:   'bi bi-x-circle-fill'
  }
  return map[statusEnum] ?? 'bi bi-question-circle-fill'
}

const formatDateRange = (startDate, endDate) => {
  if (!startDate && !endDate) return '-'
  const opt = { month: 'short', day: 'numeric' }
  const s = startDate ? new Date(startDate).toLocaleDateString('ko-KR', opt) : '?'
  const e = endDate   ? new Date(endDate).toLocaleDateString('ko-KR', opt)   : '?'
  return `${s} ~ ${e}`
}

const getPartLabel = (partValue) => {
  const found = PART_OPTIONS.find(o => o.value === partValue)
  return found ? found.label : partValue
}

const viewProject = (projectId) => router.push(`/projects/${projectId}`)

const showApplicants = async (projectId) => {
  selectedProject.value = projects.value.find(p => p.projectId === projectId)
  try {
    const response = await getProjectMembers(projectId, userStore.userId)
    applicantsList.value = response.data
    showApplicantsModal.value = true
  } catch (e) {
    console.error('지원자 목록 로드 실패:', e)
    alert('지원자 목록을 불러오는데 실패했습니다.')
  }
}
const closeApplicantsModal = () => {
  showApplicantsModal.value = false
  selectedProject.value = null
  applicantsList.value = []
}

const showTeamReview  = (projectId) => { selectedProject.value = projects.value.find(p => p.projectId === projectId); showTeamReviewModal.value = true }
const closeTeamReviewModal = () => {
  showTeamReviewModal.value = false
  selectedProject.value = null
  teamMembers.value.forEach(m => { m.rating = 0; m.reviewComment = '' })
}
const viewApplicantPortfolio = (userId) => router.push(`/portfolio/${userId}`)

// PM 전용 액션
const acceptApplicant = async (applicantId) => {
  try {
    const projectId = selectedProject.value?.projectId
    if (!projectId) return alert('프로젝트 ID를 찾을 수 없습니다.')
    await updateMemberStatus(projectId, applicantId, userStore.userId, 'ACCEPTED')
    alert('지원자가 성공적으로 수락되었습니다.')
    const a = applicantsList.value.find(x => x.id === applicantId)
    if (a) a.status = 'ACCEPTED'
  } catch (e) {
    console.error('지원자 수락 실패:', e)
    alert('지원자 수락에 실패했습니다.')
  }
}
const rejectApplicant = async (applicantId) => {
  try {
    const projectId = selectedProject.value?.projectId
    if (!projectId) return alert('프로젝트 ID를 찾을 수 없습니다.')
    await updateMemberStatus(projectId, applicantId, userStore.userId, 'REJECTED')
    alert('지원자가 성공적으로 거절되었습니다.')
    const a = applicantsList.value.find(x => x.id === applicantId)
    if (a) a.status = 'REJECTED'
  } catch (e) {
    console.error('지원자 거절 실패:', e)
    alert('지원자 거절에 실패했습니다.')
  }
}

const setRating = (memberId, rating) => {
  const m = teamMembers.value.find(x => x.id === memberId)
  if (m) m.rating = rating
}
const submitReviews = () => {
  console.log('리뷰 제출:', teamMembers.value)
  closeTeamReviewModal()
}
const goToManagePage = (projectId) => router.push({ name: 'ProjectManage', params: { projectId } })
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
  white-space: nowrap; /* 한 줄로 표시 */
  overflow: hidden; /* 넘치는 부분 숨기기 */
  text-overflow: ellipsis; /* 말줄임표(...) 적용 */
}

.project-badges {
  display: flex;
  gap: 8px;
  flex-shrink: 0;
  margin-left: 16px;
}

.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.status-badge i {
  font-size: 13px;
}

.status-badge.recruiting {
  background: #e7f3ff;
  color: #007bff;
}

.status-badge.in-progress {
  background: #fff8e1;
  color: #ffc107;
}

.status-badge.completed {
  background: #e8f5e9;
  color: #28a745;
}

.status-badge.cancelled {
  background: #fdecea;
  color: #dc3545;
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
  height: 42px; /* 2줄 높이 고정 (14px * 1.5 * 2) */
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
  justify-content: space-between;
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