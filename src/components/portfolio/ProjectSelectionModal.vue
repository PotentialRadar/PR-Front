<template>
  <div v-if="show" class="modal-overlay" @click="closeModal">
    <div class="modal-container" @click.stop>
      <div class="modal-header">
        <h3 class="modal-title">포트폴리오에 공개할 프로젝트 선택</h3>
        <button @click="closeModal" class="modal-close-button">
          <i class="bi bi-x"></i>
        </button>
      </div>
      
      <div class="modal-body">
        <div v-if="loading" class="loading-state">
          <div class="loading-spinner"></div>
          <p>프로젝트를 불러오는 중...</p>
        </div>
        
        <div v-else-if="projects.length === 0" class="empty-state">
          <div class="empty-icon">
            <i class="bi bi-folder-x"></i>
          </div>
          <h4>참여한 프로젝트가 없습니다</h4>
          <p>프로젝트에 참여한 후 다시 시도해보세요.</p>
        </div>
        
        <div v-else class="projects-section">
          <div class="selection-info">
            <div class="info-text">
              <i class="bi bi-info-circle"></i>
              공개할 프로젝트를 선택하세요. 선택한 프로젝트는 포트폴리오에 표시됩니다.
            </div>
            <div class="selection-count">
              {{ selectedProjects.length }}개 선택됨
            </div>
          </div>
          
          <div class="projects-list">
            <div 
              v-for="project in projects" 
              :key="project.projectId"
              :class="['project-item', { 'selected': isProjectSelected(project.projectId) }]"
              @click="toggleProject(project)"
            >
              <div class="project-checkbox">
                <input 
                  type="checkbox" 
                  :checked="isProjectSelected(project.projectId)"
                  @click.stop
                  @change="toggleProject(project)"
                />
              </div>
              
              <div class="project-info">
                <div class="project-header">
                  <h4 class="project-title">{{ project.title }}</h4>
                  <div class="project-badges">
                    <span :class="['status-badge', getStatusClass(project.status)]">
                      {{ getStatusText(project.status) }}
                    </span>
                    <span v-if="project.isPM" class="pm-badge">PM</span>
                  </div>
                </div>
                
                <p class="project-description">{{ project.description }}</p>
                
                <div class="project-meta">
                  <div class="meta-item">
                    <i class="bi bi-calendar"></i>
                    <span>{{ formatDateRange(project.startDate, project.endDate) }}</span>
                  </div>
                  <div class="meta-item" v-if="project.techStacks && project.techStacks.length > 0">
                    <i class="bi bi-code-slash"></i>
                    <span>{{ project.techStacks.slice(0, 2).map(ts => ts.techStackName || ts.name || ts).join(', ') }}
                      <span v-if="project.techStacks.length > 2"> 외 {{ project.techStacks.length - 2 }}개</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="modal-footer">
        <button @click="closeModal" class="cancel-btn">
          취소
        </button>
        <button @click="saveSelection" class="save-btn" :disabled="loading">
          <i class="bi bi-check-circle"></i>
          선택 완료 ({{ selectedProjects.length }}개)
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { getProjectsCreatedByUser, getAppliedProjectsByUser } from '@/api/projects'
import { portfolioApi } from '@/api/portfolio.js'
import { useUserStore } from '@/stores/userStore'
import { useToast } from 'vue-toastification'

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close', 'saved'])

const userStore = useUserStore()
const toast = useToast()
const loading = ref(false)
const saving = ref(false)
const projects = ref([])
const selectedProjects = ref([])

// 프로젝트 데이터 로드
const loadProjects = async () => {
  loading.value = true
  try {
    // 백엔드의 통합 API 사용
    const response = await portfolioApi.getAvailableProjects();
    
    // 응답 데이터를 모달 형식으로 변환
    projects.value = response.data.map(project => ({
      projectId: project.projectId,
      title: project.title || '',
      description: project.description || '',
      status: project.status || 'RECRUITING',
      startDate: project.startDate,
      endDate: project.endDate,
      techStacks: project.techStacks || [],
      isPM: project.role === 'LEADER' || project.role === 'PM'
    }));
    
    // 현재 선택된 프로젝트 ID들 추출
    selectedProjects.value = response.data
      .filter(project => project.selectedInPortfolio)
      .map(project => project.projectId);
    
  } catch (error) {
    console.error('프로젝트 로드 실패:', error)
    projects.value = []
  } finally {
    loading.value = false
  }
}


// 프로젝트 선택 토글
const toggleProject = (project) => {
  const projectId = project.projectId
  const index = selectedProjects.value.indexOf(projectId)
  
  if (index > -1) {
    selectedProjects.value.splice(index, 1)
  } else {
    selectedProjects.value.push(projectId)
  }
}

// 프로젝트가 선택되었는지 확인
const isProjectSelected = (projectId) => {
  return selectedProjects.value.includes(projectId)
}

// 선택 저장
const saveSelection = async () => {
  if (saving.value) return
  
  saving.value = true
  try {
    const response = await portfolioApi.updateProjectSelection(selectedProjects.value)
    emit('saved')
    toast.success('포트폴리오에 반영할 프로젝트를 저장했습니다.')
    closeModal()
  } catch (error) {
    console.error('프로젝트 선택 저장 실패:', error)
    toast.error('프로젝트 선택을 저장하는데 실패했습니다.')
  } finally {
    saving.value = false
  }
}

// 모달 닫기
const closeModal = () => {
  emit('close')
}

// 상태 관련 유틸리티
const getStatusClass = (status) => {
  const statusMap = {
    'RECRUITING': 'recruiting',
    'IN_PROGRESS': 'in-progress', 
    'COMPLETED': 'completed',
    'CANCELLED': 'cancelled'
  }
  return statusMap[status] || 'recruiting'
}

const getStatusText = (status) => {
  const statusMap = {
    'RECRUITING': '모집중',
    'IN_PROGRESS': '진행중',
    'COMPLETED': '완료',
    'CANCELLED': '취소됨'
  }
  return statusMap[status] || status
}

const formatDateRange = (startDate, endDate) => {
  if (!startDate && !endDate) return '-'
  
  const formatDate = (dateStr) => {
    if (!dateStr) return '?'
    const date = new Date(dateStr)
    return date.toLocaleDateString('ko-KR', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    }).replace(/\. /g, '.').replace(/\.$/, '')
  }
  
  const start = formatDate(startDate)
  const end = endDate ? formatDate(endDate) : '진행중'
  
  return `${start} ~ ${end}`
}

// 모달이 열릴 때 데이터 로드
watch(() => props.show, (newShow) => {
  if (newShow) {
    loadProjects()
  }
})

onMounted(() => {
  if (props.show) {
    loadProjects()
  }
})
</script>

<style scoped>
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
  background: #fff;
  border-radius: 16px;
  width: 90%;
  max-width: 900px;
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
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-close-button:hover {
  background: rgba(255, 255, 255, 0.2);
}

.modal-body {
  flex: 1;
  overflow-y: auto;
  max-height: calc(90vh - 160px);
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  gap: 20px;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #4CAF50;
  border-radius: 50%;
  animation: spin 1s linear infinite;
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
  padding: 60px 20px;
  text-align: center;
  gap: 16px;
  color: #666;
}

.empty-icon {
  width: 80px;
  height: 80px;
  background: rgba(76, 175, 80, 0.1);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 36px;
  color: #4CAF50;
  margin-bottom: 8px;
}

.empty-state h4 {
  font-size: 20px;
  font-weight: 700;
  color: #262626;
  margin: 0;
}

.empty-state p {
  font-size: 16px;
  color: #666;
  margin: 0;
  line-height: 1.5;
}

.projects-section {
  padding: 30px;
}

.selection-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding: 16px 20px;
  background: rgba(76, 175, 80, 0.05);
  border-radius: 12px;
  border: 1px solid rgba(76, 175, 80, 0.1);
}

.info-text {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #4CAF50;
  font-size: 14px;
  font-weight: 500;
}

.selection-count {
  background: #4CAF50;
  color: white;
  padding: 6px 16px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 600;
}

.projects-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.project-item {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  padding: 20px;
  border: 2px solid rgba(76, 175, 80, 0.1);
  border-radius: 12px;
  background: #fff;
  cursor: pointer;
  transition: all 0.3s ease;
}

.project-item:hover {
  border-color: rgba(76, 175, 80, 0.3);
  background: rgba(76, 175, 80, 0.02);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(76, 175, 80, 0.1);
}

.project-item.selected {
  border-color: #4CAF50;
  background: rgba(76, 175, 80, 0.05);
  box-shadow: 0 4px 12px rgba(76, 175, 80, 0.15);
}

.project-checkbox {
  margin-top: 2px;
}

.project-checkbox input[type="checkbox"] {
  width: 20px;
  height: 20px;
  cursor: pointer;
  accent-color: #4CAF50;
}

.project-info {
  flex: 1;
  min-width: 0;
}

.project-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 8px;
  gap: 16px;
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
}

.status-badge {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
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
}

.project-description {
  font-size: 14px;
  color: #666;
  line-height: 1.5;
  margin: 0 0 12px 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.project-meta {
  display: flex;
  gap: 20px;
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
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 24px 30px;
  border-top: 2px solid #f0f0f0;
  background: #fafafa;
}

.cancel-btn {
  padding: 12px 24px;
  border: 2px solid rgba(76, 175, 80, 0.2);
  border-radius: 8px;
  background: #fff;
  color: #4CAF50;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.cancel-btn:hover {
  border-color: #4CAF50;
  background: rgba(76, 175, 80, 0.05);
}

.save-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  background: #4CAF50;
  color: #fff;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.save-btn:hover:not(:disabled) {
  background: #66BB6A;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(76, 175, 80, 0.3);
}

.save-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

/* 반응형 디자인 */
@media (max-width: 768px) {
  .modal-container {
    width: 95%;
    max-height: 95vh;
  }

  .modal-header,
  .modal-footer {
    padding: 20px;
  }

  .projects-section {
    padding: 20px;
  }

  .selection-info {
    flex-direction: column;
    gap: 12px;
    text-align: center;
  }

  .project-header {
    flex-direction: column;
    gap: 8px;
    align-items: flex-start;
  }

  .project-badges {
    align-self: flex-start;
  }

  .project-meta {
    flex-direction: column;
    gap: 8px;
  }

  .modal-footer {
    flex-direction: column;
  }

  .cancel-btn,
  .save-btn {
    width: 100%;
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .modal-header,
  .modal-footer,
  .projects-section {
    padding: 16px;
  }

  .modal-title {
    font-size: 18px;
  }

  .project-item {
    padding: 16px;
  }

  .project-title {
    font-size: 16px;
  }
}
</style>