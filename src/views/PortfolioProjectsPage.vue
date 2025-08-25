<template>
  <div class="portfolio-projects-page">
    <!-- 헤더 -->
    <div class="page-header">
      <div class="header-content">
        <div class="title-section">
          <button @click="goBack" class="back-button">
            <i class="bi bi-arrow-left"></i>
          </button>
          <div>
            <h1 class="page-title">프로젝트 관리</h1>
            <p class="page-subtitle">포트폴리오에 표시할 프로젝트를 선택하세요</p>
          </div>
        </div>
        <div class="header-actions">
          <button @click="saveSelection" class="save-button" :disabled="saving">
            <i class="bi bi-check-lg"></i>
            {{ saving ? '저장 중...' : '변경사항 저장' }}
          </button>
        </div>
      </div>
    </div>

    <!-- 로딩 상태 -->
    <div v-if="loading" class="loading-container">
      <div class="loading-spinner"></div>
      <p>프로젝트를 불러오는 중...</p>
    </div>

    <!-- 프로젝트 목록 -->
    <div v-else-if="availableProjects.length > 0" class="projects-container">
      <!-- 선택 요약 -->
      <div class="selection-summary">
        <div class="summary-info">
          <span class="selected-count">{{ selectedCount }}개 선택됨</span>
          <span class="total-count">/ {{ availableProjects.length }}개 전체</span>
        </div>
        <div class="selection-actions">
          <button @click="selectAll" class="action-btn">
            <i class="bi bi-check-all"></i>
            전체 선택
          </button>
          <button @click="deselectAll" class="action-btn">
            <i class="bi bi-x-circle"></i>
            전체 해제
          </button>
        </div>
      </div>

      <!-- 프로젝트 카드 목록 -->
      <div class="projects-grid">
        <div
          v-for="project in availableProjects"
          :key="project.projectId"
          class="project-card"
          :class="{ 'selected': isSelected(project.projectId) }"
          @click="toggleProject(project.projectId)"
        >
          <!-- 선택 체크박스 -->
          <div class="selection-checkbox">
            <div class="checkbox" :class="{ 'checked': isSelected(project.projectId) }">
              <i v-if="isSelected(project.projectId)" class="bi bi-check"></i>
            </div>
          </div>

          <!-- 프로젝트 정보 -->
          <div class="project-content">
            <div class="project-header">
              <h3 class="project-title">{{ project.title }}</h3>
              <div class="project-badges">
                <span class="role-badge" :class="project.role.toLowerCase()">
                  {{ project.role === 'LEADER' ? '팀장' : '팀원' }}
                </span>
                <span class="status-badge" :class="project.status.toLowerCase()">
                  {{ getStatusText(project.status) }}
                </span>
              </div>
            </div>

            <p class="project-description">{{ project.description }}</p>

            <div class="project-details">
              <div class="detail-item">
                <i class="bi bi-calendar-event"></i>
                <span>{{ formatDateRange(project.startDate, project.endDate) }}</span>
              </div>
              <div class="detail-item" v-if="project.techPart">
                <i class="bi bi-code-slash"></i>
                <span>{{ project.techPart }}</span>
              </div>
            </div>

            <!-- 기술 스택 -->
            <div v-if="project.techStacks && project.techStacks.length > 0" class="tech-stacks">
              <span
                v-for="tech in project.techStacks.slice(0, 4)"
                :key="tech"
                class="tech-tag"
              >
                {{ tech }}
              </span>
              <span v-if="project.techStacks.length > 4" class="tech-more">
                +{{ project.techStacks.length - 4 }}
              </span>
            </div>
          </div>

          <!-- 선택 오버레이 -->
          <div v-if="isSelected(project.projectId)" class="selected-overlay">
            <i class="bi bi-check-circle-fill"></i>
          </div>
        </div>
      </div>
    </div>

    <!-- 빈 상태 -->
    <div v-else class="empty-state">
      <div class="empty-icon">
        <i class="bi bi-folder-x"></i>
      </div>
      <h3>참가한 프로젝트가 없습니다</h3>
      <p>프로젝트에 참가한 후 포트폴리오에 추가해보세요.</p>
      <router-link to="/projects" class="browse-projects-btn">
        프로젝트 둘러보기
      </router-link>
    </div>

    <!-- 변경사항 확인 다이얼로그 -->
    <div v-if="showConfirmDialog" class="confirm-dialog-overlay" @click="cancelSave">
      <div class="confirm-dialog" @click.stop>
        <div class="dialog-header">
          <h3>변경사항 저장</h3>
          <button @click="cancelSave" class="close-btn">
            <i class="bi bi-x"></i>
          </button>
        </div>
        <div class="dialog-content">
          <p>{{ selectedCount }}개의 프로젝트가 포트폴리오에 표시됩니다.</p>
          <p>변경사항을 저장하시겠습니까?</p>
        </div>
        <div class="dialog-actions">
          <button @click="cancelSave" class="cancel-btn">취소</button>
          <button @click="confirmSave" class="confirm-btn" :disabled="saving">
            {{ saving ? '저장 중...' : '저장' }}
          </button>
        </div>
      </div>
    </div>

    <!-- 토스트 알림 -->
    <div v-if="toast.visible" class="toast" :class="toast.type">
      <i class="bi" :class="getToastIcon(toast.type)"></i>
      <span>{{ toast.message }}</span>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { portfolioApi } from '@/api/portfolio.js'

const router = useRouter()

// 상태 관리
const loading = ref(true)
const saving = ref(false)
const availableProjects = ref([])
const selectedProjectIds = ref([])
const originalSelection = ref([])
const showConfirmDialog = ref(false)

// 토스트 알림
const toast = reactive({
  visible: false,
  message: '',
  type: 'success' // success, error, warning, info
})

// 계산된 속성
const selectedCount = computed(() => selectedProjectIds.value.length)

const hasChanges = computed(() => {
  return JSON.stringify([...selectedProjectIds.value].sort()) !== 
         JSON.stringify([...originalSelection.value].sort())
})

// 메서드
const showToast = (message, type = 'success') => {
  toast.visible = true
  toast.message = message
  toast.type = type
  setTimeout(() => {
    toast.visible = false
  }, 3000)
}

const getToastIcon = (type) => {
  switch (type) {
    case 'success': return 'bi-check-circle-fill'
    case 'error': return 'bi-exclamation-triangle-fill'
    case 'warning': return 'bi-exclamation-circle-fill'
    case 'info': return 'bi-info-circle-fill'
    default: return 'bi-check-circle-fill'
  }
}

const loadAvailableProjects = async () => {
  try {
    loading.value = true
    const response = await portfolioApi.getAvailableProjects()
    availableProjects.value = response.data
    
    // 현재 선택된 프로젝트 ID들 추출
    selectedProjectIds.value = response.data
      .filter(project => project.selectedInPortfolio)
      .map(project => project.projectId)
    
    // 원래 선택상태 백업
    originalSelection.value = [...selectedProjectIds.value]
    
  } catch (error) {
    console.error('프로젝트 목록 조회 실패:', error)
    showToast('프로젝트 목록을 불러오는데 실패했습니다.', 'error')
  } finally {
    loading.value = false
  }
}

const isSelected = (projectId) => {
  return selectedProjectIds.value.includes(projectId)
}

const toggleProject = (projectId) => {
  if (isSelected(projectId)) {
    selectedProjectIds.value = selectedProjectIds.value.filter(id => id !== projectId)
  } else {
    selectedProjectIds.value.push(projectId)
  }
}

const selectAll = () => {
  selectedProjectIds.value = availableProjects.value.map(project => project.projectId)
}

const deselectAll = () => {
  selectedProjectIds.value = []
}

const saveSelection = () => {
  if (!hasChanges.value) {
    showToast('변경사항이 없습니다.', 'info')
    return
  }
  showConfirmDialog.value = true
}

const confirmSave = async () => {
  try {
    saving.value = true
    await portfolioApi.updateProjectSelection(selectedProjectIds.value)
    
    // 원래 선택상태 업데이트
    originalSelection.value = [...selectedProjectIds.value]
    
    showToast('프로젝트 선택이 저장되었습니다.', 'success')
    showConfirmDialog.value = false
    
    // 잠시 후 포트폴리오 페이지로 이동
    setTimeout(() => {
      router.push('/myPage/portfolio')
    }, 1500)
    
  } catch (error) {
    console.error('프로젝트 선택 저장 실패:', error)
    showToast('저장에 실패했습니다. 다시 시도해주세요.', 'error')
  } finally {
    saving.value = false
  }
}

const cancelSave = () => {
  showConfirmDialog.value = false
}

const goBack = () => {
  if (hasChanges.value) {
    if (confirm('저장하지 않은 변경사항이 있습니다. 정말 나가시겠습니까?')) {
      router.back()
    }
  } else {
    router.back()
  }
}

const getStatusText = (status) => {
  const statusMap = {
    'PLANNING': '기획중',
    'RECRUITING': '모집중', 
    'IN_PROGRESS': '진행중',
    'COMPLETED': '완료',
    'CANCELLED': '취소됨'
  }
  return statusMap[status] || status
}

const formatDateRange = (startDate, endDate) => {
  const formatDate = (dateStr) => {
    if (!dateStr) return ''
    const date = new Date(dateStr)
    return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}`
  }
  
  const start = formatDate(startDate)
  const end = formatDate(endDate)
  
  if (start && end) {
    return `${start} ~ ${end}`
  } else if (start) {
    return `${start} ~`
  }
  return '기간 미정'
}

// 컴포넌트 마운트 시 데이터 로드
onMounted(() => {
  loadAvailableProjects()
})
</script>

<style scoped>
.portfolio-projects-page {
  min-height: 100vh;
  background: #fafafa;
  padding: 20px;
}

/* 헤더 */
.page-header {
  background: white;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
}

.title-section {
  display: flex;
  align-items: center;
  gap: 16px;
}

.back-button {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  border: 1px solid #e1e5e9;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 18px;
  color: #64748b;
}

.back-button:hover {
  background: #f8fafc;
  border-color: #cbd5e1;
}

.page-title {
  font-size: 28px;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 4px 0;
}

.page-subtitle {
  font-size: 16px;
  color: #64748b;
  margin: 0;
}

.save-button {
  padding: 12px 24px;
  background: #4CAF50;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 8px;
}

.save-button:hover:not(:disabled) {
  background: #45a049;
}

.save-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* 로딩 */
.loading-container {
  text-align: center;
  padding: 80px 20px;
  color: #64748b;
}

.loading-spinner {
  width: 48px;
  height: 48px;
  border: 4px solid #f1f5f9;
  border-top: 4px solid #4CAF50;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 16px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* 프로젝트 컨테이너 */
.projects-container {
  max-width: 1200px;
  margin: 0 auto;
}

/* 선택 요약 */
.selection-summary {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: white;
  padding: 20px 24px;
  border-radius: 12px;
  margin-bottom: 20px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.summary-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.selected-count {
  font-size: 18px;
  font-weight: 700;
  color: #4CAF50;
}

.total-count {
  font-size: 16px;
  color: #64748b;
}

.selection-actions {
  display: flex;
  gap: 12px;
}

.action-btn {
  padding: 8px 16px;
  border: 1px solid #e1e5e9;
  background: white;
  color: #64748b;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 6px;
}

.action-btn:hover {
  border-color: #4CAF50;
  color: #4CAF50;
}

/* 프로젝트 그리드 */
.projects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: 20px;
}

.project-card {
  background: white;
  border-radius: 12px;
  border: 2px solid #e1e5e9;
  padding: 24px;
  cursor: pointer;
  transition: all 0.3s;
  position: relative;
  overflow: hidden;
}

.project-card:hover {
  border-color: #4CAF50;
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0,0,0,0.1);
}

.project-card.selected {
  border-color: #4CAF50;
  background: #f8fff8;
}

.selection-checkbox {
  position: absolute;
  top: 16px;
  right: 16px;
  z-index: 2;
}

.checkbox {
  width: 24px;
  height: 24px;
  border: 2px solid #e1e5e9;
  border-radius: 4px;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.checkbox.checked {
  background: #4CAF50;
  border-color: #4CAF50;
  color: white;
}

.project-content {
  padding-right: 40px;
}

.project-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
}

.project-title {
  font-size: 18px;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
  flex: 1;
  margin-right: 12px;
}

.project-badges {
  display: flex;
  gap: 6px;
  flex-shrink: 0;
}

.role-badge, .status-badge {
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
}

.role-badge.leader {
  background: #fff3cd;
  color: #856404;
}

.role-badge.member {
  background: #e7f3ff;
  color: #0066cc;
}

.status-badge.planning {
  background: #f8f9fa;
  color: #6c757d;
}

.status-badge.recruiting {
  background: #e3f2fd;
  color: #1976d2;
}

.status-badge.in_progress {
  background: #e8f5e8;
  color: #2e7d32;
}

.status-badge.completed {
  background: #f3e5f5;
  color: #7b1fa2;
}

.status-badge.cancelled {
  background: #ffebee;
  color: #c62828;
}

.project-description {
  color: #64748b;
  line-height: 1.5;
  margin: 0 0 16px 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.project-details {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 16px;
}

.detail-item {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #64748b;
  font-size: 14px;
}

.detail-item i {
  width: 16px;
  color: #94a3b8;
}

.tech-stacks {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.tech-tag {
  padding: 4px 8px;
  background: #f1f5f9;
  color: #475569;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
}

.tech-more {
  padding: 4px 8px;
  background: #e2e8f0;
  color: #64748b;
  border-radius: 4px;
  font-size: 12px;
}

.selected-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(76, 175, 80, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 48px;
  color: #4CAF50;
  opacity: 0;
  transition: opacity 0.3s;
  pointer-events: none;
}

.project-card.selected .selected-overlay {
  opacity: 1;
}

/* 빈 상태 */
.empty-state {
  text-align: center;
  padding: 80px 20px;
  color: #64748b;
}

.empty-icon {
  font-size: 64px;
  color: #cbd5e1;
  margin-bottom: 24px;
}

.empty-state h3 {
  font-size: 24px;
  color: #1e293b;
  margin: 0 0 12px 0;
}

.empty-state p {
  font-size: 16px;
  margin: 0 0 32px 0;
}

.browse-projects-btn {
  display: inline-block;
  padding: 12px 24px;
  background: #4CAF50;
  color: white;
  text-decoration: none;
  border-radius: 8px;
  font-weight: 600;
  transition: all 0.2s;
}

.browse-projects-btn:hover {
  background: #45a049;
  transform: translateY(-2px);
}

/* 확인 다이얼로그 */
.confirm-dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.confirm-dialog {
  background: white;
  border-radius: 12px;
  width: 90%;
  max-width: 480px;
  box-shadow: 0 20px 40px rgba(0,0,0,0.2);
}

.dialog-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 24px 0;
}

.dialog-header h3 {
  font-size: 20px;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
}

.close-btn {
  width: 32px;
  height: 32px;
  border: none;
  background: none;
  color: #64748b;
  font-size: 20px;
  cursor: pointer;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-btn:hover {
  background: #f1f5f9;
}

.dialog-content {
  padding: 20px 24px;
  color: #64748b;
  line-height: 1.5;
}

.dialog-content p {
  margin: 0 0 8px 0;
}

.dialog-actions {
  display: flex;
  gap: 12px;
  padding: 0 24px 24px;
}

.cancel-btn, .confirm-btn {
  flex: 1;
  padding: 12px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.cancel-btn {
  border: 1px solid #e1e5e9;
  background: white;
  color: #64748b;
}

.cancel-btn:hover {
  background: #f8fafc;
}

.confirm-btn {
  border: none;
  background: #4CAF50;
  color: white;
}

.confirm-btn:hover:not(:disabled) {
  background: #45a049;
}

.confirm-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* 토스트 */
.toast {
  position: fixed;
  bottom: 24px;
  right: 24px;
  padding: 16px 20px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 12px;
  font-weight: 600;
  z-index: 1001;
  box-shadow: 0 8px 24px rgba(0,0,0,0.15);
  animation: slideIn 0.3s ease;
}

.toast.success {
  background: #4CAF50;
  color: white;
}

.toast.error {
  background: #f44336;
  color: white;
}

.toast.warning {
  background: #ff9800;
  color: white;
}

.toast.info {
  background: #2196f3;
  color: white;
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

/* 반응형 */
@media (max-width: 768px) {
  .portfolio-projects-page {
    padding: 16px;
  }
  
  .page-header {
    padding: 20px;
  }
  
  .header-content {
    flex-direction: column;
    gap: 16px;
    align-items: stretch;
  }
  
  .title-section {
    gap: 12px;
  }
  
  .page-title {
    font-size: 24px;
  }
  
  .projects-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }
  
  .project-card {
    padding: 20px;
  }
  
  .selection-summary {
    flex-direction: column;
    gap: 16px;
    align-items: stretch;
  }
  
  .selection-actions {
    justify-content: center;
  }
  
  .toast {
    left: 16px;
    right: 16px;
    bottom: 16px;
  }
}
</style>