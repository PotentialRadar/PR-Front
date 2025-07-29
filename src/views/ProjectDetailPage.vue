<template>
  <div class="project-detail-page">
    <div class="background-gradient"></div>
    <div class="floating-shapes">
      <div class="shape shape-1"></div>
      <div class="shape shape-2"></div>
      <div class="shape shape-3"></div>
    </div>
    <div class="page-container">
      <div class="content-wrapper">
        <div class="main-content">
          <div class="header-section">
            <ProjectHeader />
            <!-- 지원하기 버튼 추가 -->
            <div class="apply-button-container">
              <button
                class="apply-button"
                @click="openApplyModal"
              >
                <span class="apply-icon">🚀</span>
                프로젝트 지원하기
              </button>
            </div>
            <ProjectHeader :project="project" />
          </div>
          <div class="integrated-content-card">
            <div class="tab-section">
              <TabNavigation :activeTab="activeTab" @tab-change="handleTabChange" />
            </div>
            <div class="tab-content">
              <ProjectWorkContent :description="project.description" :file-url="project.fileUrl" />
              <ProjectComment :projectId="project.projectId" id="comment-section" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 지원하기 모달 -->
    <div
      v-if="showApplyModal"
      class="modal-overlay"
      @click.self="closeApplyModal"
    >
      <div class="modal-container">
        <div class="modal-header">
          <h2 class="modal-title">프로젝트 지원하기</h2>
          <button
            class="close-button"
            @click="closeApplyModal"
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
              <div class="project-name">{{ projectInfo.name }}</div>
              <div class="project-description">{{ projectInfo.description }}</div>
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
              <label for="part" class="form-label">지원 파트</label>
              <select
                id="part"
                v-model="applicationForm.part"
                class="form-select"
                required
              >
                <option value="">파트를 선택해주세요</option>
                <option value="frontend">프론트엔드 개발자</option>
                <option value="backend">백엔드 개발자</option>
                <option value="fullstack">풀스택 개발자</option>
                <option value="design">UI/UX 디자이너</option>
                <option value="planning">기획자</option>
                <option value="marketing">마케팅</option>
                <option value="other">기타</option>
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
                @click="closeApplyModal"
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

    <!-- 지원 완료 토스트 메시지 -->
    <div
      v-if="showSuccessToast"
      class="success-toast"
    >
      <span class="toast-icon">✅</span>
      지원이 성공적으로 완료되었습니다!
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import TabNavigation from '@/components/projectComponents/TabNavigation.vue'
import ProjectHeader from '@/components/projectComponents/ProjectHeader.vue'
import ProjectWorkContent from '@/components/projectComponents/ProjectWorkContent.vue'
import ProjectComment from '@/components/projectComponents/ProjectComment.vue'

export default {
  name: 'ProjectDetailPage',
  components: {
    TabNavigation,
    ProjectHeader,
    ProjectWorkContent,
    ProjectComment
  },
  data() {
    return {
      project: {},
      activeTab: 'content',
      activeTab: 'content',
      showApplyModal: false,
      showSuccessToast: false,
      isSubmitting: false,
      applicationForm: {
        part: '',
        message: ''
      },
      // 프로젝트 정보 (실제로는 props나 API에서 받아올 데이터)
      projectInfo: {
        name: '혁신적인 SNS 플랫폼 개발 프로젝트',
        description: '차세대 소셜 네트워크 서비스'
      },
      // 사용자 포트폴리오 상태 (실제로는 사용자 정보에서 받아올 데이터)
      userPortfolio: {
        isPublic: true,
        lastUpdated: '2024-07-20'
      }
    }
  },
  computed: {
    isFormValid() {
      return this.applicationForm.part &&
             this.applicationForm.message.trim().length > 0 &&
             this.applicationForm.message.length <= 500
    }
  },
  async created() {
    const id = this.$route.params.id
    try {
      const res = await axios.get(`http://localhost:8080/api/projects/${id}`)
      this.project = res.data
    } catch (e) {
      alert('프로젝트 정보를 불러오지 못했습니다.')
      console.error(e)
    }
  },
  methods: {
    handleTabChange(tab) {
      this.activeTab = tab
      let targetId = (tab === 'content') ? 'content-section'
          : (tab === 'comment') ? 'comment-section' : ''
      if (targetId) {
        this.$nextTick(() => {
          const element = document.getElementById(targetId)
          if (element) element.scrollIntoView({ behavior: 'smooth', block: 'start' })
        })
      }

      const sectionMap = {
        content: 'content-section',
        comment: 'comment-section'
      }

      const targetId = sectionMap[tab]
      if (!targetId) return

      this.$nextTick(() => {
        const element = document.getElementById(targetId)
        if (element) {
          element.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          })
        }
      })
    },

    openApplyModal() {
      this.showApplyModal = true
      // 모달 열릴 때 body 스크롤 방지
      document.body.style.overflow = 'hidden'
    },

    closeApplyModal() {
      this.showApplyModal = false
      document.body.style.overflow = ''
      // 폼 초기화
      this.applicationForm = {
        part: '',
        message: ''
      }
    },

    async submitApplication() {
      if (!this.isFormValid) return

      this.isSubmitting = true

      try {
        // 실제 API 호출 로직을 여기에 구현
        await new Promise(resolve => setTimeout(resolve, 1500)) // 시뮬레이션

        console.log('지원 정보:', {
          project: this.projectInfo.name,
          ...this.applicationForm,
          portfolioPublic: this.userPortfolio.isPublic
        })

        this.closeApplyModal()
        this.showSuccessToast = true

        // 3초 후 토스트 메시지 숨기기
        setTimeout(() => {
          this.showSuccessToast = false
        }, 3000)

      } catch (error) {
        console.error('지원 실패:', error)
        alert('지원 중 오류가 발생했습니다. 다시 시도해주세요.')
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
      // 포트폴리오 설정 페이지로 이동하는 로직
      console.log('포트폴리오 설정 페이지로 이동')
      // 실제로는 this.$router.push('/portfolio/settings') 등을 사용
    }
  },

  // ESC 키로 모달 닫기
  mounted() {
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.showApplyModal) {
        this.closeApplyModal()
      }
    })
  }
}
</script>

<style scoped>
.project-detail-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #f8fffa 0%, #f0fff4 50%, #ecfdf5 100%);
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

.floating-shapes {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: -1;
}

.shape {
  position: absolute;
  border-radius: 50%;
  background: linear-gradient(135deg, rgba(76, 175, 80, 0.1), rgba(76, 175, 80, 0.05));
  animation: float 6s ease-in-out infinite;
}

.shape-1 {
  width: 120px;
  height: 120px;
  top: 10%;
  left: 85%;
  animation-delay: 0s;
}

.shape-2 {
  width: 80px;
  height: 80px;
  top: 60%;
  left: 5%;
  animation-delay: 2s;
}

.shape-3 {
  width: 100px;
  height: 100px;
  top: 30%;
  left: 15%;
  animation-delay: 4s;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0px) rotate(0deg);
    opacity: 0.3;
  }
  50% {
    transform: translateY(-20px) rotate(180deg);
    opacity: 0.1;
  }
}

.page-container {
  display: flex;
  width: 100%;
  justify-content: center;
  position: relative;
  z-index: 1;
}

.content-wrapper {
  display: flex;
  width: 100%;
  max-width: 1080px;
  padding: 60px 20px 90px;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
}

.main-content {
  display: flex;
  width: 100%;
  max-width: 900px;
  flex-direction: column;
  gap: 40px;
}

.header-section {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  padding: 40px;
  box-shadow:
    0 20px 40px rgba(76, 175, 80, 0.1),
    0 1px 3px rgba(0, 0, 0, 0.05);
  border: 1px solid rgba(76, 175, 80, 0.1);
  transition: all 0.3s ease;
  position: relative;
}

.header-section:hover {
  transform: translateY(-2px);
  box-shadow:
    0 25px 50px rgba(76, 175, 80, 0.15),
    0 2px 10px rgba(0, 0, 0, 0.08);
}

/* 지원하기 버튼 스타일 */
.apply-button-container {
  margin-top: 30px;
  display: flex;
  justify-content: center;
}

.apply-button {
  background: linear-gradient(135deg, #4CAF50, #66BB6A);
  color: white;
  border: none;
  padding: 16px 32px;
  border-radius: 50px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 10px;
  transition: all 0.3s ease;
  box-shadow: 0 8px 25px rgba(76, 175, 80, 0.3);
}

.apply-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 35px rgba(76, 175, 80, 0.4);
  background: linear-gradient(135deg, #45a049, #5cb85c);
}

.apply-button:active {
  transform: translateY(0px);
}

.apply-icon {
  font-size: 18px;
}

/* 모달 스타일 */
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

/* 기존 폼 스타일 */
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

/* 성공 토스트 */
.success-toast {
  position: fixed;
  top: 30px;
  right: 30px;
  background: linear-gradient(135deg, #4CAF50, #66BB6A);
  color: white;
  padding: 16px 24px;
  border-radius: 12px;
  box-shadow: 0 8px 25px rgba(76, 175, 80, 0.3);
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 600;
  z-index: 1001;
  animation: slideInRight 0.3s ease;
}

.toast-icon {
  font-size: 18px;
}

/* 기존 스타일들 */
.integrated-content-card {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  box-shadow:
    0 20px 40px rgba(76, 175, 80, 0.08),
    0 1px 3px rgba(0, 0, 0, 0.05);
  border: 1px solid rgba(76, 175, 80, 0.08);
  transition: all 0.4s ease;
  position: relative;
  overflow: hidden;
}

.integrated-content-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #4CAF50, #66BB6A, #81C784);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.integrated-content-card:hover {
  transform: translateY(-4px);
  box-shadow: 
    0 30px 60px rgba(76, 175, 80, 0.12),
    0 4px 20px rgba(0, 0, 0, 0.08);
}

.integrated-content-card:hover::before {
  opacity: 1;
}

.tab-section {
  width: 100%;
  padding: 20px 20px 0 20px;
  border-bottom: 1px solid rgba(76, 175, 80, 0.1);
  margin-bottom: 30px;
  position: sticky;
  top: 0;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  z-index: 10;
  border-radius: 24px 24px 0 0;
}

.tab-content {
  width: 100%;
  padding: 0 40px 40px 40px;
  display: flex;
  flex-direction: column;
  gap: 40px;
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

@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(100px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

/* 반응형 디자인 */
@media (max-width: 1200px) {
  .content-wrapper {
    max-width: 95%;
    padding: 40px 15px 70px;
  }

  .main-content {
    max-width: 100%;
  }
}

@media (max-width: 768px) {
  .content-wrapper {
    padding: 30px 10px 60px;
  }
  
  .main-content {
    gap: 25px;
  }

  .integrated-content-card {
    border-radius: 16px;
  }

  .tab-section {
    padding: 15px 20px 0 20px;
    margin-bottom: 20px;
    border-radius: 16px 16px 0 0;
  }
  
  .tab-content {
    padding: 0 25px 25px 25px;
    gap: 25px;
  }

  .shape-1, .shape-2, .shape-3 {
    display: none;
  }

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

  .success-toast {
    top: 20px;
    right: 20px;
    left: 20px;
    text-align: center;
  }
}

@media (max-width: 480px) {
  .content-wrapper {
    padding: 20px 5px 50px;
  }

  .main-content {
    gap: 20px;
  }

  .integrated-content-card {
    border-radius: 12px;
  }
  
  .tab-section {
    padding: 12px 15px 0 15px;
    margin-bottom: 15px;
    border-radius: 12px 12px 0 0;
  }

  .tab-content {
    padding: 0 20px 20px 20px;
    gap: 20px;
  }

  .apply-button {
    font-size: 14px;
    padding: 14px 28px;
  }
}

/* 기존 애니메이션들 */
.integrated-content-card {
  animation: fadeInUp 0.6s ease-out forwards;
  opacity: 0;
  transform: translateY(20px);
  animation-delay: 0.1s;
}

@keyframes fadeInUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.header-section:focus-within,
.integrated-content-card:focus-within {
  outline: none;
  box-shadow:
    0 0 0 3px rgba(76, 175, 80, 0.2),
    0 20px 40px rgba(76, 175, 80, 0.15);
}

.main-content {
  animation: contentLoad 0.8s ease-out;
}

@keyframes contentLoad {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
