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
          <!-- 로딩 중 -->
          <div v-if="loading" class="loading-state">
            <div class="loading-spinner"></div>
            <p>프로젝트 정보를 불러오는 중...</p>
          </div>
          
          <!-- 프로젝트를 찾을 수 없음 -->
          <div v-else-if="!project" class="not-found-state">
            <div class="not-found-icon">🔍</div>
            <h2>프로젝트를 찾을 수 없습니다</h2>
            <p>요청하신 프로젝트가 존재하지 않거나 삭제되었습니다.</p>
            <p class="available-info">사용 가능한 프로젝트 ID: 1~8</p>
            <button @click="$router.push('/projects')" class="back-button">
              프로젝트 목록으로 돌아가기
            </button>
          </div>
          
          <!-- 프로젝트 정보 -->
          <template v-else>
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
              <TabNavigation 
                :activeTab="activeTab" 
                :isProjectOwner="isProjectOwner"
                @tab-change="handleTabChange" 
              />
            </div>
            <div class="tab-content">
              <div v-if="activeTab === 'content'" id="content-section">
                <ProjectWorkContent
                    :description="project?.description || ''"
                    :tags="project?.techStacks?.map(tech => tech.techStackName) || []"
                    :file-url="project?.fileUrl || ''"
                    :attachments="project?.attachments || []"
                    :author="project?.author || null"
                    @contact-author="handleContactAuthor"
                    @view-portfolio="handleViewPortfolio"
                />
              </div>
              
              <div v-if="activeTab === 'recommendations'" id="recommendations-section">
                <TeamMemberRecommendation 
                  :projectId="projectId"
                  :requiredSkills="project?.techStacks?.map(tech => tech.techStackName) || []"
                />
              </div>
              
              <div v-if="activeTab === 'comment' && project" id="comment-section">
                <ProjectComment :projectId="projectId" :projectOwnerId="project.teamLeaderId" />
              </div>
            </div>
          </div>
          </template>
        </div>
      </div>
    </div>

    <!-- 지원하기 모달 컴포넌트 사용 -->
    <ApplyModal
      :visible="showApplyModal"
      :project-info="modalProjectInfo"
      :user-portfolio="userPortfolio"
      @close="closeApplyModal"
      @apply="handleApplicationSubmit"
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

    <!-- 지원 실패 토스트 메시지 -->
    <div
      v-if="showFailToast"
      class="fail-toast"
    >
      <span class="toast-icon">❌</span>
      지원에 실패했습니다. 다시 시도해주세요.
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useUserStore } from '@/stores/userStore';
import ProjectHeader from '@/components/projectComponents/ProjectHeader.vue';
import TabNavigation from '@/components/projectComponents/TabNavigation.vue';
import ProjectWorkContent from '@/components/projectComponents/ProjectWorkContent.vue';
import ProjectComment from '@/components/projectComponents/ProjectComment.vue';
import ApplyModal from '@/components/projectComponents/ApplyModal.vue';
import TeamMemberRecommendation from '@/components/projectComponents/TeamMemberRecommendation.vue';

// API와 fallback 데이터 import
import { getProject } from '@/api/projects';
import { projects } from '@/components/data/projects';
import { applyProject } from '@/api/projectMember';

const route = useRoute();
const router = useRouter();
const userStore = useUserStore();
const projectId = computed(() => Number(route.params.id));

const project = ref(null);
const loading = ref(false);
const error = ref(null);

// 프로젝트 소유자 여부 확인
const isProjectOwner = computed(() => {
  if (!project.value || !userStore.isLoggedIn || !userStore.userId) {
    return false;
  }
  // 프로젝트의 작성자 ID와 현재 사용자 ID 비교
  return project.value.author?.userId === userStore.userId || 
         project.value.createdBy === userStore.userId;
});

const load = async () => {
  if (isNaN(projectId.value)) {
    console.error('Invalid project ID from route:', route.params.id);
    error.value = new Error('Invalid project ID');
    project.value = null;
    return;
  }
  loading.value = true;
  error.value = null;
  
  console.log('🔍 프로젝트 상세 정보 로드 시작, ID:', projectId.value);
  
  try {
    // 먼저 API에서 데이터 조회 시도
    const { data } = await getProject(projectId.value);
    console.log('✅ API에서 프로젝트 데이터 로드 성공:', data.title);
    
    // 백엔드 DTO를 프론트엔드 형식으로 변환
    project.value = {
      id: data.projectId ?? data.id,
      title: data.title,
      description: data.description,
      techStacks: data.techStacks?.map(tech => ({ techStackName: tech.techStackName })) || [],
      status: data.status === 'RECRUITING' ? '모집중' : data.status,
      startDate: data.startDate,
      endDate: data.endDate,
      recruitCount: data.recruitCount,
      appliedCount: data.appliedCount,
      acceptedCount: data.acceptedCount,
      remainingCount: data.remainingCount,
      recruitDeadline: data.recruitDeadline,
      fileUrl: data.fileUrl,
      viewCount: data.viewCount,
      author: {
        userId: data.teamLeaderId,
        name: `팀장 ${data.teamLeaderId}`,
        email: `leader${data.teamLeaderId}@example.com`
      }
    };
    
  } catch (e) {
    console.log('❌ API 호출 실패, fallback 데이터 사용 시도:', e.message);
    
    // API 실패 시 fallback 데이터 사용
    const fallbackProject = projects.find(p => p.id === projectId.value);
    if (fallbackProject) {
      project.value = fallbackProject;
      console.log('📋 Fallback 프로젝트 데이터 사용:', fallbackProject.title);
    } else {
      console.warn(`⚠️ 프로젝트 ID ${projectId.value}를 찾을 수 없습니다.`);
      error.value = e;
      project.value = null;
    }
  } finally {
    loading.value = false;
  }
};

onMounted(load);
watch(
    () => route.params.id,
    (v) => {
      projectId.value = Number(v);
      load();
    }
);

// 탭 관리
const activeTab = ref('content');
function handleTabChange(tab) {
  activeTab.value = tab;
  const sectionMap = { 
    content: 'content-section', 
    recommendations: 'recommendations-section',
    comment: 'comment-section' 
  };
  const targetId = sectionMap[tab];
  if (!targetId) return;
  setTimeout(() => {
    const el = document.getElementById(targetId);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, 20);
}

// 지원 모달 관련
const showApplyModal = ref(false);
const showSuccessToast = ref(false);
const showFailToast = ref(false); // Add this line

const modalProjectInfo = computed(() => ({
  title: project.value?.title || '',
  description: project.value?.description || '',
}));

const userPortfolio = ref({
  isPublic: true,
  lastUpdated: '2024-07-20',
});

function openApplyModal() {
  showApplyModal.value = true;
}
function closeApplyModal() {
  showApplyModal.value = false;
}



// ... (기존 코드) ...

// 실제 지원 API 호출
async function handleApplicationSubmit(applicationData) {
  // 임시 토큰 설정 (로그인 구현 전 테스트용)
  localStorage.setItem('accessToken', 'dummy-token-for-user2');

  try {
    console.log('지원서 데이터:', applicationData);

    const payload = {
      userId: userStore.userId, // applicationForm에서 userId 사용
      applicationMessage: applicationData.applicationForm.message,
      techPart: applicationData.applicationForm.techPart // techPart 필드 사용
    };

    await applyProject(projectId.value, payload); // projectId는 ref로 이미 정의됨

    showSuccessToast.value = true;
    setTimeout(() => (showSuccessToast.value = false), 3000);
    closeApplyModal(); // 지원 성공 후 모달 닫기
  } catch (error) {
    console.error('지원 실패:', error);
    showFailToast.value = true; // Use showFailToast
    setTimeout(() => (showFailToast.value = false), 3000); // Hide after 3 seconds
  }
}

function handleApplicationError(error) {
  console.error('지원 처리 중 에러:', error);
}

function goToPortfolioSettings() {
  router.push('/portfolio/settings');
}

function handleContactAuthor(author) {
  console.log('작성자 연락하기:', author);
}

function handleViewPortfolio(author) {
  if (author && author.userId) {
    router.push(`/portfolio/${author.userId}`);
  } else {
    router.push('/portfolio');
  }
}

// ESC로 모달 닫기
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && showApplyModal.value) {
    closeApplyModal();
  }
});
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

/* 로딩 상태 */
.loading-state {
  text-align: center;
  padding: 100px 20px;
}

.loading-spinner {
  width: 50px;
  height: 50px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #4CAF50;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 20px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* 프로젝트 찾을 수 없음 */
.not-found-state {
  text-align: center;
  padding: 100px 20px;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 24px;
  box-shadow: 0 20px 40px rgba(76, 175, 80, 0.1);
}

.not-found-icon {
  font-size: 64px;
  margin-bottom: 20px;
}

.not-found-state h2 {
  color: #333;
  margin-bottom: 16px;
  font-size: 28px;
}

.not-found-state p {
  color: #666;
  margin-bottom: 12px;
  font-size: 16px;
}

.available-info {
  color: #4CAF50 !important;
  font-weight: 600;
  margin-bottom: 24px !important;
}

.back-button {
  background: linear-gradient(135deg, #4CAF50, #66BB6A);
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.back-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(76, 175, 80, 0.3);
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