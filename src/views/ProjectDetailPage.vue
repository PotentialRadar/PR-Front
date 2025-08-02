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
            <ProjectHeader :project="project" />
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
          </div>
          <div class="integrated-content-card">
            <div class="tab-section">
              <TabNavigation :activeTab="activeTab" @tab-change="handleTabChange" />
            </div>
            <div class="tab-content">
              <ProjectWorkContent
                  :description="project?.description || ''"
                  :tags="project?.techStacks?.map(tech => tech.techStackName) || []"
                  :file-url="project?.fileUrl || ''"
                  :attachments="project?.attachments || []"
                  :author="project?.author || null"
                  @contact-author="handleContactAuthor"
                  @view-portfolio="handleViewPortfolio"
              />
              <ProjectComment :projectId="projectId" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 지원하기 모달 컴포넌트 사용 -->
    <ApplyModal
      :visible="showApplyModal"
      :project-info="modalProjectInfo"
      :user-portfolio="userPortfolio"
      @close="closeApplyModal"
      @submit="handleApplicationSubmit"
      @error="handleApplicationError"
      @portfolio-settings="goToPortfolioSettings"
    />

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

<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { projects } from '@/components/data/projects'
import ProjectHeader from '@/components/projectComponents/ProjectHeader.vue'
import TabNavigation from '@/components/projectComponents/TabNavigation.vue'
import ProjectWorkContent from '@/components/projectComponents/ProjectWorkContent.vue'
import ProjectComment from '@/components/projectComponents/ProjectComment.vue'
import ApplyModal from '@/components/projectComponents/ApplyModal.vue'

const route = useRoute()
const router = useRouter()
const projectId = Number(route.params.id)
const project = computed(() => projects.find(p => p.id === projectId))

// 탭 관리
const activeTab = ref('content')
function handleTabChange(tab) {
  activeTab.value = tab
  const sectionMap = { content: 'content-section', comment: 'comment-section' }
  const targetId = sectionMap[tab]
  if (!targetId) return
  setTimeout(() => {
    const el = document.getElementById(targetId)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, 20)
}

// 지원 모달 관련
const showApplyModal = ref(false)
const showSuccessToast = ref(false)

// 모달에 전달할 프로젝트 정보
const modalProjectInfo = computed(() => ({
  title: project.value?.title || '',
  description: project.value?.description || ''
}))

// 사용자 포트폴리오 정보
const userPortfolio = ref({
  isPublic: true,
  lastUpdated: '2024-07-20'
})

function openApplyModal() {
  showApplyModal.value = true
}

function closeApplyModal() {
  showApplyModal.value = false
}

// 지원서 제출 처리
async function handleApplicationSubmit(applicationData) {
  try {
    console.log('지원서 데이터:', applicationData)
    
    // 여기서 실제 API 호출
    // await applyToProject(applicationData)
    
    // 성공 토스트 표시
    showSuccessToast.value = true
    setTimeout(() => { 
      showSuccessToast.value = false 
    }, 3000)
    
  } catch (error) {
    console.error('지원 실패:', error)
    // 에러 처리
  }
}

// 지원 에러 처리
function handleApplicationError(error) {
  console.error('지원 처리 중 에러:', error)
  // 에러 메시지 표시 로직
}

// 포트폴리오 설정 페이지로 이동
function goToPortfolioSettings() {
  router.push('/portfolio/settings')
}

// 작성자 연락하기 처리
function handleContactAuthor(author) {
  console.log('작성자 연락하기:', author)
  // 여기서 연락하기 로직 구현 (메시지 모달, 채팅 등)
}

// 작성자 포트폴리오 보기 처리
function handleViewPortfolio(author) {
  console.log('포트폴리오 보기:', author)
  
  // 작성자의 포트폴리오 페이지로 이동 (숫자 userId 사용)
  if (author && author.userId) {
    router.push(`/portfolio/${author.userId}`)
  } else {
    // fallback: 일반 포트폴리오 페이지로 이동
    router.push('/portfolio')
  }
}

// ESC 키로 모달 닫기
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && showApplyModal.value) {
    closeApplyModal()
  }
})
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
  margin-bottom: 20px;
  display: flex;
  justify-content: center;
  padding-right: 10px;
}

.apply-button {
  background: linear-gradient(135deg, #4CAF50, #66BB6A);
  color: white;
  border: none;
  padding: 12px 28px;
  border-radius: 50px;
  font-size: 14.5px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
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
  font-size: 16px;
}

/* 성공 토스트 */
.success-toast {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
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

  .success-toast {
    top: 20px;
    right: 20px;
    left: 20px;
    text-align: center;
    transform: none;
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