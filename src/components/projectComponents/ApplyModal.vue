<template>
  <div 
    v-if="visible" 
    class="modal-overlay"
    @click.self="closeModal"
  >
    <div class="modal-container">
      <div class="modal-header">
        <h2 class="modal-title">프로젝트 지원하기</h2>
        <button 
          class="close-button"
          @click="closeModal"
        >
          ✕
        </button>
      </div>
      
      <div class="modal-body">
        <!-- 프로젝트 정보 섹션 -->
        <div class="project-info-section">
          <div class="project-info-card">
            <div class="project-info-header">
              <span class="project-icon">📋</span>
              <h3 class="project-info-title">지원 프로젝트</h3>
            </div>
            <div class="project-name">{{ projectInfo.title }}</div>
            <div class="project-description">{{ projectInfo.description || '프로젝트에 참여하여 새로운 경험을 쌓아보세요' }}</div>
          </div>
        </div>

        <!-- 포트폴리오 상태 섹션 -->
        <div class="portfolio-status-section">
          <div class="portfolio-status-card">
            <div class="portfolio-status-header">
              <span class="portfolio-icon">👤</span>
              <h3 class="portfolio-status-title">내 포트폴리오 상태</h3>
            </div>
            <div class="portfolio-status-content">
              <div class="status-indicator">
                <span 
                  class="status-badge" 
                  :class="{ 'public': userPortfolio.isPublic, 'private': !userPortfolio.isPublic }"
                >
                  <span class="status-icon">
                    {{ userPortfolio.isPublic ? '🌐' : '🔒' }}
                  </span>
                  {{ userPortfolio.isPublic ? '공개' : '비공개' }}
                </span>
              </div>
              <div class="portfolio-info">
                <div class="portfolio-detail">
                  최근 업데이트: {{ formatDate(userPortfolio.lastUpdated) }}
                </div>
                <div v-if="!userPortfolio.isPublic" class="portfolio-warning">
                  <span class="warning-icon">⚠️</span>
                  포트폴리오가 비공개 상태입니다. 지원 시 프로젝트 관리자가 확인할 수 없습니다.
                </div>
                <div v-else class="portfolio-success">
                  <span class="success-icon">✅</span>
                  포트폴리오가 공개되어 있어 프로젝트 관리자가 확인할 수 있습니다.
                </div>
              </div>
            </div>
            <div v-if="!userPortfolio.isPublic" class="portfolio-action">
              <button class="portfolio-edit-button" @click="goToPortfolioSettings">
                포트폴리오 공개 설정하기
              </button>
            </div>
          </div>
        </div>

        <form @submit.prevent="submitApplication">
          <div class="form-group">
            <label for="applicationPart" class="form-label">지원할 기술스택분야</label>
            <select
              id="applicationPart"
              v-model="applicationForm.part"
              class="form-select"
            >
              <option value="" disabled>선택하세요</option>
              <option v-for="partOption in parts" :key="partOption.value" :value="partOption.value">
                {{ partOption.label }}
              </option>
            </select>
          </div>

          <div class="form-group">
            <label for="message" class="form-label">지원 메시지</label>
            <textarea
              id="message"
              v-model="applicationForm.message"
              class="form-textarea"
              placeholder="자신을 소개하고, 이 프로젝트에 참여하고 싶은 이유를 간단히 작성해주세요."
              rows="6"
              required
            ></textarea>
            <div class="character-count">
              {{ applicationForm.message.length }}/500
            </div>
          </div>

          <div class="form-actions">
            <button 
              type="button" 
              class="cancel-button"
              @click="closeModal"
            >
              취소
            </button>
            <button 
              type="submit" 
              class="submit-button"
              :disabled="!isFormValid || isSubmitting"
            >
              <span v-if="isSubmitting" class="loading-spinner"></span>
              {{ isSubmitting ? '지원 중...' : '지원하기' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { PART_OPTIONS } from '@/constants/parts'; // <-- 이 줄을 수정합니다.

export default {
  name: 'ApplyModal',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    projectInfo: {
      type: Object,
      required: true,
      default: () => ({
        title: '',
        description: ''
      })
    },
    userPortfolio: {
      type: Object,
      default: () => ({
        isPublic: true,
        lastUpdated: new Date().toISOString().split('T')[0]
      })
    }
  },
  data() {
    return {
      isSubmitting: false,
      applicationForm: {
        part: '',
        message: ''
      },
      parts: PART_OPTIONS, // <-- Add this line to populate the dropdown
    }
  },
  computed: {
    isFormValid() {
      return this.applicationForm.part && 
             this.applicationForm.message.trim().length > 0 &&
             this.applicationForm.message.length <= 500
    }
  },
  watch: {
    visible(newVal) {
      if (newVal) {
        document.body.style.overflow = 'hidden'
      } else {
        document.body.style.overflow = ''
        this.resetForm()
      }
    }
  },
  methods: {
    closeModal() {
      this.$emit('close')
    },
    
    resetForm() {
      this.applicationForm = {
        part: '',
        message: ''
      }
      this.isSubmitting = false
    },
    
    async submitApplication() {
      if (!this.isFormValid) return
      
      this.isSubmitting = true
      
      try {
        // 부모 컴포넌트에 지원 데이터 전달
        const applicationData = {
          projectInfo: this.projectInfo,
          applicationForm: {
            ...this.applicationForm,
            techPart: this.applicationForm.part // applicationForm에 techPart 추가
          },
          portfolioPublic: this.userPortfolio.isPublic
        }
        
        this.$emit('submit', applicationData)
        
        // 실제 API 호출은 부모 컴포넌트에서 처리
        await new Promise(resolve => setTimeout(resolve, 1500))
        
        this.closeModal()
        
      } catch (error) {
        console.error('지원 실패:', error)
        this.$emit('error', error)
      } finally {
        this.isSubmitting = false
      }
    },

    formatDate(dateString) {
      const date = new Date(dateString)
      return date.toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    },

    goToPortfolioSettings() {
      this.$emit('portfolio-settings')
      this.closeModal()
    }
  },
  
  mounted() {
    // ESC 키로 모달 닫기
    this.handleEscape = (e) => {
      if (e.key === 'Escape' && this.visible) {
        this.closeModal()
      }
    }
    document.addEventListener('keydown', this.handleEscape)
  },
  
  beforeDestroy() {
    document.removeEventListener('keydown', this.handleEscape)
    document.body.style.overflow = ''
  }
}
</script>

<style scoped>
/* 모달 오버레이 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(5px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fadeIn 0.3s ease;
}

.modal-container {
  background: white;
  border-radius: 20px;
  max-width: 500px;
  width: 90%;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15);
  animation: slideUp 0.3s ease;
  overflow: hidden;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 30px 30px 20px;
  border-bottom: 1px solid #f0f0f0;
}

.modal-title {
  font-size: 24px;
  font-weight: 700;
  color: #333;
  margin: 0;
}

.close-button {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #999;
  transition: color 0.2s ease;
  padding: 5px;
  border-radius: 50%;
}

.close-button:hover {
  color: #333;
  background: #f5f5f5;
}

.modal-body {
  padding: 30px;
  overflow-y: auto;
  flex: 1;
  
  /* 커스텀 스크롤바 스타일링 */
  scrollbar-width: thin;
  scrollbar-color: rgba(76, 175, 80, 0.3) transparent;
}

/* 웹킷 기반 브라우저용 스크롤바 스타일 */
.modal-body::-webkit-scrollbar {
  width: 6px;
}

.modal-body::-webkit-scrollbar-track {
  background: transparent;
  border-radius: 10px;
}

.modal-body::-webkit-scrollbar-thumb {
  background: rgba(76, 175, 80, 0.3);
  border-radius: 10px;
  transition: background 0.3s ease;
}

.modal-body::-webkit-scrollbar-thumb:hover {
  background: rgba(76, 175, 80, 0.5);
}

/* 프로젝트 정보 섹션 */
.project-info-section {
  margin-bottom: 25px;
}

.project-info-card {
  background: linear-gradient(135deg, #f8fffa, #f0fff4);
  border: 1px solid rgba(76, 175, 80, 0.2);
  border-radius: 12px;
  padding: 20px;
}

.project-info-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 15px;
}

.project-icon {
  font-size: 20px;
}

.project-info-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.project-name {
  font-size: 18px;
  font-weight: 700;
  color: #2E7D32;
  margin-bottom: 8px;
  line-height: 1.3;
}

.project-description {
  font-size: 14px;
  color: #666;
}

/* 포트폴리오 상태 섹션 */
.portfolio-status-section {
  margin-bottom: 25px;
}

.portfolio-status-card {
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 12px;
  padding: 20px;
}

.portfolio-status-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 15px;
}

.portfolio-icon {
  font-size: 20px;
}

.portfolio-status-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.portfolio-status-content {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.status-indicator {
  display: flex;
  align-items: center;
}

.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 600;
}

.status-badge.public {
  background: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
}

.status-badge.private {
  background: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
}

.status-icon {
  font-size: 16px;
}

.portfolio-info {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.portfolio-detail {
  font-size: 13px;
  color: #666;
}

.portfolio-warning {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  padding: 12px;
  background: #fff3cd;
  border: 1px solid #ffeaa7;
  border-radius: 8px;
  font-size: 13px;
  color: #856404;
  line-height: 1.4;
}

.portfolio-success {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  padding: 12px;
  background: #d1f2eb;
  border: 1px solid #a7f3d0;
  border-radius: 8px;
  font-size: 13px;
  color: #0f5132;
  line-height: 1.4;
}

.warning-icon,
.success-icon {
  font-size: 14px;
  margin-top: 1px;
}

.portfolio-action {
  margin-top: 15px;
}

.portfolio-edit-button {
  background: linear-gradient(135deg, #17a2b8, #20c997);
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.portfolio-edit-button:hover {
  background: linear-gradient(135deg, #138496, #1e9e8a);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(23, 162, 184, 0.3);
}

/* 폼 스타일 */
.form-group {
  margin-bottom: 25px;
}

.form-label {
  display: block;
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
  font-size: 14px;
}

.form-select,
.form-textarea {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e8e8e8;
  border-radius: 12px;
  font-size: 14px;
  transition: all 0.3s ease;
  font-family: inherit;
}

.form-select:focus,
.form-textarea:focus {
  outline: none;
  border-color: #4CAF50;
  box-shadow: 0 0 0 3px rgba(76, 175, 80, 0.1);
}

.form-textarea {
  resize: vertical;
  min-height: 120px;
}

.character-count {
  text-align: right;
  font-size: 12px;
  color: #999;
  margin-top: 5px;
}

.form-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 30px;
}

.cancel-button,
.submit-button {
  padding: 12px 24px;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;
}

.cancel-button {
  background: #f8f9fa;
  color: #6c757d;
}

.cancel-button:hover {
  background: #e9ecef;
}

.submit-button {
  background: linear-gradient(135deg, #4CAF50, #66BB6A);
  color: white;
  display: flex;
  align-items: center;
  gap: 8px;
}

.submit-button:hover:not(:disabled) {
  background: linear-gradient(135deg, #45a049, #5cb85c);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(76, 175, 80, 0.3);
}

.submit-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

/* 로딩 스피너 */
.loading-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid transparent;
  border-top: 2px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* 애니메이션 */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* 반응형 디자인 */
@media (max-width: 768px) {
  .modal-container {
    width: 95%;
    margin: 20px;
  }

  .modal-header,
  .modal-body {
    padding: 20px;
  }

  .modal-title {
    font-size: 20px;
  }

  .project-info-card,
  .portfolio-status-card {
    padding: 16px;
  }

  .project-name {
    font-size: 16px;
  }

  .portfolio-warning,
  .portfolio-success {
    padding: 10px;
    font-size: 12px;
  }

  .form-actions {
    flex-direction: column;
  }
}
</style>