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
              <ProjectHeader
                :project="project"
                :leader-avatar-url="leaderAvatar"
                :key="leaderAvatar || project?.id"/>
              
              <!-- 초대받은 상태 배너 -->
              <div v-if="hasProjectInvitation" class="invitation-banner">
                <div class="invitation-header">
                  <div class="invitation-badge">
                    <svg class="invitation-icon" viewBox="0 0 24 24" fill="none">
                      <path d="M20 4H4C2.9 4 2 4.9 2 6V18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6C22 4.9 21.1 4 20 4ZM20 8L12 13L4 8V6L12 11L20 6V8Z" fill="currentColor"/>
                    </svg>
                    <span>초대받음</span>
                  </div>
                  <div class="invitation-status">
                    <span class="status-dot"></span>
                    <span>대기중</span>
                  </div>
                </div>
                
                <div class="invitation-content">
                  <div class="invitation-main-text">
                    <h3>{{ receivedInvitation.inviterName }}님의 팀 초대</h3>
                    <p>이 프로젝트의 팀원으로 초대받았습니다</p>
                  </div>
                </div>
                
                <div class="invitation-actions">
                  <button 
                    class="action-btn accept-btn" 
                    @click="handleInvitationResponse('ACCEPTED')"
                  >
                    <svg class="btn-icon" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                    </svg>
                    수락하기
                  </button>
                  <button 
                    class="action-btn decline-btn" 
                    @click="handleInvitationResponse('REJECTED')"
                  >
                    <svg class="btn-icon" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                    </svg>
                    거절하기
                  </button>
                </div>
              </div>
              
              <!-- 지원하기 버튼 (초대받지 않은 경우만) -->
              <div v-else-if="!isProjectOwner" class="action-button-container">
                <button
                  v-if="isLoggedIn && project?.status === '모집중'"
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
                <ProjectComment :projectId="projectId" :projectOwnerId="project.author.userId" />
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



    <!-- 지원 실패 토스트 메시지 -->
    <div
      v-if="showFailToast"
      class="fail-toast"
    >
      <span class="toast-icon">❌</span>
      지원에 실패했습니다. 다시 시도해주세요.
    </div>

    <!-- AI 추천 피드백 섹션 -->
    <div v-if="showAIFeedback && isFromAIRecommendation" class="ai-feedback-overlay">
      <div class="ai-feedback-card">
        <div class="ai-feedback-header">
          <div class="ai-badge">🤖 AI 추천</div>
          <button @click="showAIFeedback = false" class="close-btn">✕</button>
        </div>
        <div class="ai-feedback-content">
          <h3>이 추천이 어떠셨나요?</h3>
          <p>AI가 추천한 이 프로젝트가 당신의 관심사와 잘 맞나요?</p>
          <div class="feedback-buttons">
            <button @click="submitAIFeedback('THUMBS_UP')" class="feedback-btn thumbs-up">
              👍 관심있어요
            </button>
            <button @click="submitAIFeedback('THUMBS_DOWN')" class="feedback-btn thumbs-down">
              👎 관심없어요
            </button>
            <button @click="submitAIFeedback('HIDE')" class="feedback-btn hide">
              🚫 이런 추천 그만 받기
            </button>
          </div>
          <div class="feedback-skip">
            <button @click="showAIFeedback = false" class="skip-btn">나중에</button>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, onActivated } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useUserStore } from '@/stores/userStore';
import { useToast } from 'vue-toastification';
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
import api from '@/api/axios';

const route = useRoute();
const router = useRouter();
const userStore = useUserStore();
const toast = useToast();
const isLoggedIn = computed(() => userStore.isLoggedIn);

const projectId = computed(() => Number(route.params.id));
const project = ref(null);
const loading = ref(false);
const error = ref(null);

// AI 추천 관련
const isFromAIRecommendation = computed(() => route.query.from === 'ai-recommendation');
const recommendationHistoryId = computed(() => route.query.historyId);
const showAIFeedback = ref(false);
const feedbackSubmitted = ref(false);

// 프로젝트 소유자 여부 확인
const isProjectOwner = computed(() => {
  if (!project.value || !userStore.isLoggedIn || !userStore.userId) {
    return false;
  }
  // 프로젝트의 팀 리더 ID와 현재 사용자 ID 비교
  return project.value.teamLeaderId === userStore.userId || 
         project.value.author?.userId === userStore.userId || 
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
    
    const statusMap = {
      'RECRUITING': '모집중',
      'IN_PROGRESS': '진행중',
      'COMPLETED': '완료'
    };

    // 백엔드 DTO를 프론트엔드 형식으로 변환
    project.value = {
      id: data.projectId ?? data.id,
      title: data.title,
      description: data.description,
      techStacks: data.techStacks?.map(tech => ({ techStackName: tech.techStackName })) || [],
      recruitmentParts: data.recruitmentParts || [],
      status: statusMap[data.status] || data.status,
      startDate: data.startDate,
      endDate: data.endDate,
      createdAt: data.createdAt,
      recruitCount: data.recruitCount,
      appliedCount: data.appliedCount,
      acceptedCount: data.acceptedCount,
      remainingCount: data.remainingCount,
      recruitDeadline: data.recruitDeadline,
      fileUrl: data.fileUrl,
      viewCount: data.viewCount,
      teamLeaderId: data.teamLeaderId,
      author: {
        userId: data.teamLeaderId,
        name: data.teamLeaderNickname,
        email: `leader${data.teamLeaderId}@example.com`,
        avatarUrl: data.teamLeaderProfileImageUrl || null,
      },
      attachments: data.attachments || [],
    };
    console.log('avatar from API:', data.teamLeaderProfileImageUrl);
    console.log('avatar mapped   :', project.value?.author?.avatarUrl);
  } catch (e) {
    console.log('❌ API 호출 실패:', e.message, '응답 상태:', e.response?.status);
    
    if (e.response?.status === 404) {
      console.error(`❌ 프로젝트 ID ${projectId.value}가 서버에 존재하지 않습니다`);
      error.value = new Error('Project not found');
      project.value = null;
    } else {
      // 다른 에러인 경우 fallback 데이터 시도
      const fallbackProject = projects.find(p => p.id === projectId.value);
      if (fallbackProject) {
        project.value = fallbackProject;
        console.log('📋 Fallback 프로젝트 데이터 사용:', fallbackProject.title);
      } else {
        console.warn(`⚠️ 프로젝트 ID ${projectId.value}를 찾을 수 없습니다.`);
        error.value = e;
        project.value = null;
      }
    }
  } finally {
    loading.value = false;
  }
};

onMounted(async () => {
  try {
    await load();
    console.log('✅ load() 완료');
    
    await checkProjectInvitation(); // 프로젝트 로드 후 초대 확인
    console.log('✅ checkProjectInvitation() 완료');
    
    // 디버깅: URL 파라미터 확인
    console.log('🔍 URL 파라미터 확인:', {
      from: route.query.from,
      historyId: route.query.historyId,
      isFromAIRecommendation: isFromAIRecommendation.value,
      recommendationHistoryId: recommendationHistoryId.value
    });
    
    // AI 추천에서 온 경우 피드백 섹션 표시 (3초 후)
    if (isFromAIRecommendation.value) {
      // sessionStorage로 이미 피드백을 요청했는지 확인 (사용자별로)
      const feedbackKey = `ai_feedback_shown_${userStore.userId}_${projectId.value}`;
      const alreadyShown = sessionStorage.getItem(feedbackKey);
      
      if (alreadyShown) {
        console.log('⏭️ 이미 이 탭에서 피드백을 요청함 - 모달 표시 안 함');
      } else {
        console.log('✅ AI 추천에서 왔음 - 3초 후 피드백 모달 표시 예정');
        sessionStorage.setItem(feedbackKey, 'true');
        setTimeout(() => {
          triggerAIFeedback();
        }, 3000);
      }
    } else {
      console.log('❌ AI 추천이 아님 - 피드백 모달 표시 안 함');
    }
  } catch (error) {
    console.error('❌ onMounted 중 오류:', error);
  }
});
onActivated(async () => {
  await load();
  await checkProjectInvitation(); // 프로젝트 로드 후 초대 확인
});
watch(
    () => route.params.id,
    async (v) => {
      // projectId는 computed이므로 직접 수정하지 않음
      await load();
      await checkProjectInvitation(); // 프로젝트 변경 시에도 초대 확인
    }
);

// 이미지 URL 유효성 검사 및 변환 함수 (PortfolioPage와 동일)
const getValidImageUrl = (imageUrl) => {
  if (!imageUrl || typeof imageUrl !== 'string' || !imageUrl.trim()) {
    return null
  }
  
  const trimmedUrl = imageUrl.trim()
  
  // 더미 데이터 URL 필터링 (example.com 도메인 제외)
  if (trimmedUrl.includes('example.com')) {
    return null
  }
  
  // 이미 절대 URL인 경우
  if (trimmedUrl.startsWith('http://') || trimmedUrl.startsWith('https://')) {
    return trimmedUrl
  }
  
  // 상대 경로인 경우 백엔드 도메인을 추가
  if (trimmedUrl.startsWith('/')) {
    const backendUrl = import.meta.env.PROD 
      ? `http://localhost:${import.meta.env.VITE_BACK_PORT || 8080}`
      : 'http://localhost:8080'
    return `${backendUrl}${trimmedUrl}`
  }
  
  // 기타 경우는 그대로 반환
  return trimmedUrl
}

const leaderAvatar = computed(() => {
  // 1순위: 백엔드에서 받은 URL (상대 경로면 절대 URL로 변환)
  const rawImageUrl = project.value?.author?.avatarUrl || project.value?.teamLeaderProfileImageUrl;
  const processedImageUrl = getValidImageUrl(rawImageUrl);
  
  return processedImageUrl || '/default-avatar.svg';
});

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
const showFailToast = ref(false);

const modalProjectInfo = computed(() => ({
  title: project.value?.title || '',
  description: project.value?.description || '',
}));

const userPortfolio = ref({
  isPublic: true,
  lastUpdated: '2024-07-20',
});

// 초대 관련 상태
const receivedInvitation = ref(null); // 현재 프로젝트에 대한 초대
const invitationLoading = ref(false);

// 현재 프로젝트에 대한 초대가 있는지 확인
const hasProjectInvitation = computed(() => {
  return receivedInvitation.value && 
         receivedInvitation.value.status === 'PENDING' &&
         receivedInvitation.value.projectId === projectId.value;
});

function openApplyModal() {
  if (!isLoggedIn.value) {
    toast.info('로그인이 필요합니다.');
    return;
  }
  showApplyModal.value = true;
}

// 현재 사용자의 초대 목록에서 이 프로젝트 초대를 찾기
async function checkProjectInvitation() {
  if (!userStore.isLoggedIn || !userStore.userId) {
    return;
  }
  
  invitationLoading.value = true;
  try {
    const token = localStorage.getItem('accessToken');
    const response = await fetch('/api/invitations/received', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'User-Id': userStore.userId.toString()
      }
    });
    
    if (response.ok) {
      const invitations = await response.json();
      // 현재 프로젝트에 대한 PENDING 상태의 초대 찾기
      const invitation = invitations.find(inv => 
        inv.projectId === projectId.value && 
        inv.status === 'PENDING'
      );
      receivedInvitation.value = invitation || null;
    }
  } catch (error) {
    console.error('초대 정보 조회 실패:', error);
  } finally {
    invitationLoading.value = false;
  }
}

// 초대 수락/거절 처리
async function handleInvitationResponse(status) {
  if (!receivedInvitation.value) return;
  
  try {
    const token = localStorage.getItem('accessToken');
    const response = await fetch('/api/invitations/respond', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'User-Id': userStore.userId.toString()
      },
      body: JSON.stringify({
        invitationId: receivedInvitation.value.invitationId,
        status: status // 'ACCEPTED' or 'REJECTED'
      })
    });
    
    const result = await response.json();
    if (result.success) {
      toast.success(
        status === 'ACCEPTED' ? '초대를 수락했습니다! 🎉' : '초대를 거절했습니다.',
        { position: 'top-center', timeout: 3000 }
      );
      
      // 초대 상태 업데이트
      receivedInvitation.value.status = status;
      
      // 수락한 경우 페이지 새로고침해서 최신 프로젝트 정보 반영
      if (status === 'ACCEPTED') {
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      }
    } else {
      toast.error(result.message || '초대 응답에 실패했습니다.');
    }
  } catch (error) {
    console.error('초대 응답 실패:', error);
    toast.error('초대 응답 처리 중 오류가 발생했습니다.');
  }
}

function closeApplyModal() {
  showApplyModal.value = false;
}

// 실제 지원 API 호출
async function handleApplicationSubmit(applicationData) {

  try {
    console.log('지원서 데이터:', applicationData);

    const payload = {
      applicationMessage: applicationData.applicationForm.message,
      techPart: applicationData.applicationForm.techPart
    };

    await applyProject(projectId.value, payload);

    toast.success('지원이 성공적으로 완료되었습니다! 🚀', {
      position: 'top-center',
      timeout: 3000
    });
    closeApplyModal(); // 지원 성공 후 모달 닫기
  } catch (error) {
    console.error('지원 실패:', error);
    toast.error('지원에 실패했습니다. 다시 시도해주세요.', {
      position: 'top-center',
      timeout: 3000
    });
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

// AI 추천 피드백 제출
const submitAIFeedback = async (action) => {
  if (!recommendationHistoryId.value) {
    console.error('추천 이력 ID가 없습니다.');
    return;
  }
  
  try {
    const feedbackData = {
      recommendationHistoryId: recommendationHistoryId.value,
      feedbackAction: action
    };
    
    console.log('📝 AI 추천 피드백 제출:', feedbackData);
    
    // 액션을 기존 API 형식에 맞게 변환
    let actionPath = 'like';
    if (action === 'THUMBS_UP') actionPath = 'like';
    else if (action === 'THUMBS_DOWN') actionPath = 'dislike';
    else if (action === 'HIDE') actionPath = 'hide';
    
    const response = await api.post(`/recommend/feedback/${recommendationHistoryId.value}/${actionPath}`, {}, {
      headers: {
        'User-Id': userStore.userId?.toString()
      }
    });
    
    // 기존 API는 단순 문자열 응답
    if (response.status === 200) {
      feedbackSubmitted.value = true;
      showAIFeedback.value = false;
      
      const messages = {
        'THUMBS_UP': '👍 피드백 감사합니다! 비슷한 프로젝트를 더 추천해드릴게요.',
        'THUMBS_DOWN': '👎 피드백이 반영되었습니다.',
        'HIDE': '🚫 해당 유형의 추천을 줄이도록 하겠습니다.'
      };
      
      toast.success(messages[action] || '피드백이 기록되었습니다.', {
        position: 'top-center',
        timeout: 3000
      });
    }
  } catch (error) {
    console.error('❌ AI 추천 피드백 제출 실패:', error);
    toast.error('피드백 제출에 실패했습니다.', {
      position: 'top-center',
      timeout: 3000
    });
  }
};

// 피드백 섹션 표시 (스크롤 이벤트 등으로 트리거)
const triggerAIFeedback = () => {
  console.log('🎯 triggerAIFeedback 호출됨:', {
    isFromAIRecommendation: isFromAIRecommendation.value,
    feedbackSubmitted: feedbackSubmitted.value,
    showAIFeedback: showAIFeedback.value
  });
  
  if (isFromAIRecommendation.value && !feedbackSubmitted.value) {
    console.log('✅ 피드백 모달 표시 중...');
    showAIFeedback.value = true;
  } else {
    console.log('❌ 피드백 모달 표시 조건 불만족');
  }
};

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


/* 액션 버튼 컨테이너 통합 스타일 */
.action-button-container {
  display: flex;
  justify-content: center;
  margin: 24px 0;
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

/* 초대 배너 스타일링 */
.invitation-banner {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  padding: 24px;
  margin-top: 40px;
  margin-bottom: 32px;
  box-shadow: 
    0 4px 24px rgba(0, 0, 0, 0.08),
    0 2px 8px rgba(0, 0, 0, 0.04);
  position: relative;
  overflow: hidden;
}

.invitation-banner::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #2196f3, #21cbf3, #2196f3);
  animation: shimmer 2s ease-in-out infinite;
}

@keyframes shimmer {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}

.invitation-content {
  display: flex;
  align-items: flex-start;
  gap: 20px;
  margin-bottom: 24px;
}

.invitation-icon {
  font-size: 48px;
  line-height: 1;
  flex-shrink: 0;
  filter: drop-shadow(0 2px 4px rgba(0,0,0,0.1));
}

.invitation-text {
  flex: 1;
}

.invitation-text h3 {
  margin: 0 0 12px 0;
  font-size: 24px;
  font-weight: 700;
  color: #1565c0;
  letter-spacing: -0.5px;
}

.invitation-text p {
  margin: 0 0 8px 0;
  font-size: 16px;
  color: #424242;
  line-height: 1.5;
}

.invitation-message {
  font-style: italic;
  color: #666 !important;
  background: rgba(255, 255, 255, 0.7);
  padding: 12px 16px;
  border-radius: 8px;
  border-left: 4px solid #2196f3;
  margin-top: 16px !important;
}

.invitation-actions {
  display: flex;
  gap: 16px;
  justify-content: center;
}

.accept-button,
.decline-button {
  flex: 1;
  max-width: 200px;
  padding: 14px 28px;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  box-shadow: 0 4px 16px rgba(0,0,0,0.1);
}

.accept-button {
  background: linear-gradient(135deg, #4caf50, #66bb6a);
  color: white;
}

.accept-button:hover {
  background: linear-gradient(135deg, #45a049, #5cb860);
  transform: translateY(-2px);
  box-shadow: 0 6px 24px rgba(76, 175, 80, 0.3);
}

.decline-button {
  background: linear-gradient(135deg, #f44336, #ef5350);
  color: white;
}

.decline-button:hover {
  background: linear-gradient(135deg, #e53935, #ef5350);
  transform: translateY(-2px);
  box-shadow: 0 6px 24px rgba(244, 67, 54, 0.3);
}

.accept-button:active,
.decline-button:active {
  transform: translateY(0);
  box-shadow: 0 2px 8px rgba(0,0,0,0.2);
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
  .invitation-banner {
    padding: 20px;
    margin-bottom: 24px;
  }

  .invitation-content {
    flex-direction: column;
    gap: 16px;
    align-items: center;
    text-align: center;
  }

  .invitation-icon {
    font-size: 40px;
  }

  .invitation-text h3 {
    font-size: 20px;
  }

  .invitation-actions {
    flex-direction: column;
    gap: 12px;
  }

  .accept-button,
  .decline-button {
    max-width: none;
    width: 100%;
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

/* 새로운 초대 UI 스타일 추가 */
.invitation-banner::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, #4CAF50, #66bb6a, #4CAF50);
  animation: shimmerNew 3s ease-in-out infinite;
}

@keyframes shimmerNew {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.6; }
}

.invitation-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 1px solid #f3f4f6;
}

.invitation-badge {
  display: flex;
  align-items: center;
  gap: 8px;
  background: linear-gradient(135deg, #e8f5e8 0%, #c8e6c8 100%);
  color: #2e7d2e;
  padding: 8px 14px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 600;
  border: 1px solid #81c784;
}

.invitation-icon {
  width: 18px;
  height: 18px;
}

.invitation-status {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #6b7280;
  font-size: 13px;
  font-weight: 500;
}

.status-dot {
  width: 8px;
  height: 8px;
  background: #fbbf24;
  border-radius: 50%;
  animation: pulseNew 2s infinite;
}

@keyframes pulseNew {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.invitation-content {
  margin-bottom: 24px;
}

.invitation-main-text h3 {
  margin: 0 0 8px 0;
  font-size: 20px;
  font-weight: 700;
  color: #111827;
  letter-spacing: -0.025em;
}

.invitation-main-text p {
  margin: 0;
  font-size: 15px;
  color: #6b7280;
  line-height: 1.5;
}


.invitation-actions {
  display: flex;
  gap: 12px;
}

.action-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 20px;
  border: none;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  min-height: 44px;
}

.btn-icon {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
}

.accept-btn {
  background: #4CAF50;
  color: white;
  border: 1px solid #4CAF50;
}

.accept-btn:hover {
  background: #45a049;
  border-color: #45a049;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(76, 175, 80, 0.3);
}

.decline-btn {
  background: white;
  color: #6b7280;
  border: 1px solid #d1d5db;
}

.decline-btn:hover {
  background: #f9fafb;
  color: #374151;
  border-color: #9ca3af;
}

/* 반응형 디자인 업데이트 */
@media (max-width: 768px) {
  .invitation-header {
    flex-direction: column;
    gap: 12px;
    align-items: flex-start;
  }

  .invitation-actions {
    flex-direction: column;
    gap: 8px;
  }

  .action-btn {
    min-height: 48px;
  }
}

/* AI 추천 피드백 스타일 */
.ai-feedback-overlay {
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

.ai-feedback-card {
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

.ai-feedback-header {
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

.ai-feedback-content {
  padding: 24px;
}

.ai-feedback-content h3 {
  margin: 0 0 8px 0;
  color: #333;
  font-size: 1.25rem;
  font-weight: 600;
}

.ai-feedback-content p {
  margin: 0 0 24px 0;
  color: #666;
  line-height: 1.5;
}

.feedback-buttons {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 20px;
}

.feedback-btn {
  padding: 12px 16px;
  border: 2px solid #e9ecef;
  background: white;
  border-radius: 12px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: left;
}

.feedback-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.feedback-btn.thumbs-up:hover {
  border-color: #28a745;
  background: #f8fff9;
}

.feedback-btn.thumbs-down:hover {
  border-color: #dc3545;
  background: #fff8f8;
}

.feedback-btn.hide:hover {
  border-color: #6c757d;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  color: #495057;
}

.feedback-skip {
  text-align: center;
}

.skip-btn {
  background: none;
  border: none;
  color: #6c757d;
  cursor: pointer;
  font-size: 0.9rem;
  padding: 8px 16px;
  transition: color 0.2s ease;
}

.skip-btn:hover {
  color: #333;
}

@media (max-width: 480px) {
  .ai-feedback-overlay {
    padding: 16px;
  }
  
  .ai-feedback-content {
    padding: 20px;
  }
  
  .feedback-buttons {
    gap: 10px;
  }
  
  .feedback-btn {
    font-size: 0.9rem;
  }
}
</style>