<template>
  <div class="project-list-page">
    <!-- 페이지 헤더 -->
    <PageHeader 
      title="프로젝트 찾기"
      subtitle="다양한 프로젝트에 참여하여 새로운 경험을 쌓아보세요"
    />

    <SearchSection />

    <!-- 카테고리 섹션 -->
    <section class="category-icons-section">
      <div class="category-item" @click="filterByCategory('backend')">
        <div class="category-icon-wrapper"><div class="category-icon">🔧</div></div>
        <div class="category-title">백엔드</div>
      </div>
      <div class="category-item" @click="filterByCategory('frontend')">
        <div class="category-icon-wrapper"><div class="category-icon">🎨</div></div>
        <div class="category-title">프론트엔드</div>
      </div>
      <div class="category-item" @click="filterByCategory('app')">
        <div class="category-icon-wrapper"><div class="category-icon">📱</div></div>
        <div class="category-title">앱개발</div>
      </div>
      <div class="category-item" @click="filterByCategory('design')">
        <div class="category-icon-wrapper"><div class="category-icon">🎭</div></div>
        <div class="category-title">디자인</div>
      </div>
      <div class="category-item" @click="filterByCategory('infra')">
        <div class="category-icon-wrapper"><div class="category-icon">☁️</div></div>
        <div class="category-title">인프라</div>
      </div>
    </section>

    <div class="container">
      <div class="content-wrapper">
        <div class="sort-section">
          <button class="create-project-button" @click="goToCreateProject">
            <i class="bi bi-plus-circle"></i>
            프로젝트 생성하기
          </button>
          <SortOptions />
        </div>

        <div class="projects-section">
          <div class="projects-container">
            <div class="project-list">
              <!-- 로딩/에러/빈 상태 처리 -->
              <div v-if="loading">로딩 중…</div>
              <div v-else-if="error">오류가 발생했습니다. 잠시 후 다시 시도해주세요.</div>
              <template v-else>
                <ProjectCard
                    v-for="project in projects"
                    :key="project.id"
                    :project="project"
                    @apply="openApplyModal"
                    @like-updated="handleLikeUpdate"
                />
                <div v-if="!projects?.length">표시할 프로젝트가 없습니다.</div>
              </template>
            </div>
          </div>

          <!-- 공용 페이지네이션 컴포넌트 사용 -->
          <PaginationComponent
            v-if="totalPages > 1"
            :current-page="page"
            :total-pages="totalPages"
            @page-changed="goToPage"
          />
        </div>
      </div>
    </div>

    <!-- 지원 모달 및 토스트 -->
    <ApplyModal
        v-if="showApplyModal"
        :visible="showApplyModal"
        :project-info="selectedProject"
        :user-portfolio="userPortfolio"
        @close="closeApplyModal"
        @apply="handleApplicationSubmitted"
        @portfolio-settings="goToPortfolioSettings"
    />
    <div v-if="showSuccessToast" class="success-toast">
      <span class="toast-icon">✅</span>
      지원이 성공적으로 완료되었습니다!
    </div>
    <div v-if="showFailToast" class="fail-toast">
      <span class="toast-icon">❌</span>
      지원에 실패했습니다. 다시 시도해주세요.
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onActivated } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useUserStore } from '@/stores/userStore';

import PageHeader from '@/components/common/PageHeader.vue';
import SearchSection from '@/components/projectComponents/SearchSection.vue';
import SortOptions from '@/components/projectComponents/SortOptions.vue';
import ProjectCard from '@/components/projectComponents/ProjectCard.vue';
import ApplyModal from '@/components/projectComponents/ApplyModal.vue';
import PaginationComponent from '@/components/projectComponents/PaginationComponent.vue'; // 페이지네이션 컴포넌트 임포트

import { useProjects } from '@/composables/useProjects';
import { applyProject } from '@/api/projectMember';

// 라우터
const router = useRouter();
const route = useRoute();
const userStore = useUserStore();

// 서버 페이징/필터 상태 (URL 쿼리와 동기화)
const {
  items: projects,
  totalPages,
  page,
  loading,
  error,
  setCategory,
  goToPage,
  load, // load 함수 추가
} = useProjects({
  q: route.query.q ?? '',
  category: route.query.category ?? null,
  sort: route.query.sort ?? null,
  page: Number(route.query.page ?? 1),
  size: 10, // 페이지 크기를 10으로 변경
});

// 컴포넌트가 활성화될 때마다 데이터를 새로고침
onActivated(() => {
  load();
});

// URL 쿼리 동기화 (새로고침/공유 시 유리)
watch([page], () => {
  router.replace({
    query: {
      ...route.query,
      page: page.value !== 1 ? page.value : undefined,
    },
  });
  window.scrollTo(0, 0); // 페이지 변경 시 맨 위로 스크롤
});

// 페이지 내 액션들
const goToCreateProject = () => router.push({ name: 'ProjectCreate' });
const filterByCategory = (c) => setCategory(c);

// 모달/토스트 상태
const showApplyModal = ref(false);
const showSuccessToast = ref(false);
const showFailToast = ref(false);
const selectedProject = ref(null);
const userPortfolio = ref({ isPublic: true, lastUpdated: '2024-07-29' });

const openApplyModal = (project) => {
  if (!project) return;
  selectedProject.value = {
    title: project.title,
    description: project.description,
    projectId: project.id,
  };
  showApplyModal.value = true;
};

const closeApplyModal = () => {
  showApplyModal.value = false;
  selectedProject.value = null;
};

const goToPortfolioSettings = () => {
  closeApplyModal();
  router.push({ name: 'PortfolioSettings' });
};

// API 연동된 지원 처리 함수 (userId: 2 하드코딩)
const handleApplicationSubmitted = async (applicationData) => {
  // 임시 토큰 설정 (로그인 구현 전 테스트용)
  localStorage.setItem('accessToken', 'dummy-token-for-user2');

  if (!selectedProject.value?.projectId) return;

  const payload = {
    techPart: applicationData.applicationForm.part, // 백엔드 DTO에 맞게 필드명 변경
    applicationMessage: applicationData.applicationForm.message, // 백엔드 DTO에 맞게 필드명 변경
    userId: userStore.userId, // userId를 payload에 추가
  };

  try {
    // userId를 payload에 포함하여 API 호출
    await applyProject(selectedProject.value.projectId, payload);
    showSuccessToast.value = true;
    setTimeout(() => (showSuccessToast.value = false), 3000);
  } catch (err) {
    console.error('지원 처리 중 오류 발생:', err);
    showFailToast.value = true;
    setTimeout(() => (showFailToast.value = false), 3000);
  } finally {
    closeApplyModal();
  }
};

const handleLikeUpdate = ({ projectId, liked, likeCount }) => {
  const project = projects.value.find(p => (p.projectId || p.id) === projectId);
  if (project) {
    project.likedByUser = liked;
    project.likeCount = likeCount;
  }
};
</script>


<style scoped>
.pagination-bar {
  margin: 24px 0 0 0;
  display: flex;
  justify-content: center;
  gap: 6px;
}
.pagination-bar button {
  background: #f4f4f4;
  border: 1px solid #bdbdbd;
  border-radius: 6px;
  padding: 6px 14px;
  cursor: pointer;
  font-size: 15px;
  font-weight: 600;
  transition: background 0.2s;
}
.pagination-bar button.active,
.pagination-bar button:hover {
  background: #4caf50;
  color: #fff;
  border-color: #4caf50;
}
.pagination-bar button:disabled {
  opacity: 0.4;
  cursor: default;
}
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
.fail-toast {
  position: fixed;
  top: 80px;
  right: 30px;
  background: linear-gradient(135deg, #f44336, #e57373);
  color: white;
  padding: 16px 24px;
  border-radius: 12px;
  box-shadow: 0 8px 25px rgba(244, 67, 54, 0.3);
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
.project-list-page {
  min-height: 100vh;
  background: #FFF;
  padding-top: 68px;
}

/* 페이지 헤더 */
.page-header {
  width: 100%;
  text-align: center;
  position: relative;
}

.header-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  position: relative;
  padding: 0px 20px 40px 20px;
}

.title-section {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.page-title {
  font-size: 42px;
  font-weight: 900;
  color: var(--color-grey-15, #262626);
  margin: 0;
  letter-spacing: -1px;
  position: relative;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.title-underline {
  width: 80px;
  height: 4px;
  background: linear-gradient(90deg, #4CAF50 0%, #2E7D32 100%);
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
  font-size: 18px;
  color: var(--color-grey-50, #808080);
  margin: 0;
  font-weight: 400;
  max-width: 600px;
  line-height: 1.6;
  opacity: 0;
  animation: fadeInUp 0.8s ease-out 0.3s forwards;
}

@keyframes expandLine {
  0% { width: 0; }
  100% { width: 80px; }
}

@keyframes pulse {
  0% { box-shadow: 0 0 0 0 rgba(76, 175, 80, 0.7); }
  70% { box-shadow: 0 0 0 8px rgba(76, 175, 80, 0); }
  100% { box-shadow: 0 0 0 0 rgba(76, 175, 80, 0); }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 카테고리 섹션 */
.category-icons-section {
  display: flex;
  justify-content: center;
  gap: 50px;
  margin: 40px 0;
  padding: 0 20px;
}

.category-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  transition: all 0.3s ease;
  padding: 20px 15px;
  border-radius: 12px;
  position: relative;
}

.category-item:hover {
  transform: translateY(-5px);
  background: rgba(76, 175, 80, 0.05);
}

.category-item.active {
  background: rgba(76, 175, 80, 0.1);
}

.category-icon-wrapper {
  width: 70px;
  height: 70px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 16px;
  background: rgba(76, 175, 80, 0.1);
  margin-bottom: 12px;
  transition: all 0.3s ease;
}

.category-item:hover .category-icon-wrapper {
  background: rgba(76, 175, 80, 0.2);
  transform: scale(1.1);
  box-shadow: 0 8px 20px rgba(76, 175, 80, 0.3);
}

.category-icon {
  font-size: 32px;
  transition: all 0.3s ease;
}

.category-title {
  font-size: 16px;
  font-weight: 600;
  color: #262626;
  transition: color 0.3s ease;
}

.category-item:hover .category-title {
  color: #4CAF50;
}

.divider {
  width: 100%;
  height: 2px;
  background: linear-gradient(90deg, transparent 0%, rgba(76, 175, 80, 0.3) 50%, transparent 100%);
  margin: 30px 0;
}

.container {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 20px;
}

.content-wrapper {
  width: 100%;
  max-width: 1080px;
  padding: 20px 0 90px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.sort-section {
  width: 100%;
  max-width: 848px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  padding: 0 10px;
}

.create-project-button {
  display: flex;
  align-items: center;
  gap: 8px;
  background: linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%);
  color: #FFF;
  border: none;
  border-radius: 8px;
  padding: 12px 20px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(76, 175, 80, 0.3);
  position: relative;
  overflow: hidden;
}

.create-project-button::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s;
}

.create-project-button:hover::before {
  left: 100%;
}

.create-project-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(76, 175, 80, 0.4);
}

.create-project-button:active {
  transform: translateY(0);
}

.create-project-button i {
  font-size: 16px;
}

.projects-section {
  width: 100%;
  max-width: 848px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 30px;
}

.projects-container {
  width: 100%;
  padding: 0 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.project-list {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 15px;
}

/* 반응형 디자인 */
@media (max-width: 1024px) {
  .category-icons-section {
    gap: 30px;
  }

  .content-wrapper {
    max-width: 90%;
  }

  .sort-section {
    max-width: 100%;
  }

  .projects-section {
    max-width: 100%;
  }
}

@media (max-width: 768px) {
  .project-list-page {
    padding-top: 60px;
  }

  .page-title {
    font-size: 32px;
  }

  .page-subtitle {
    font-size: 16px;
  }

  .category-icons-section {
    gap: 20px;
    flex-wrap: wrap;
    justify-content: center;
  }

  .category-icon-wrapper {
    width: 60px;
    height: 60px;
  }

  .category-icon {
    font-size: 28px;
  }

  .category-title {
    font-size: 14px;
  }

  .sort-section {
    flex-direction: column;
    gap: 15px;
    align-items: stretch;
  }

  .create-project-button {
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .project-list-page {
    padding-top: 40px;
  }

  .header-content {
    padding: 30px 15px;
  }

  .page-title {
    font-size: 28px;
  }

  .page-subtitle {
    font-size: 14px;
  }

  .category-icons-section {
    gap: 15px;
    margin: 30px 0;
  }

  .category-item {
    padding: 15px 10px;
  }

  .category-icon-wrapper {
    width: 50px;
    height: 50px;
  }

  .category-icon {
    font-size: 24px;
  }

  .category-title {
    font-size: 13px;
  }

  .container {
    padding: 0 15px;
  }

  .create-project-button {
    padding: 10px 16px;
    font-size: 14px;
  }
}
</style>