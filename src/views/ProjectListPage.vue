<template>
  <div class="project-list-page">
    <PageHeader 
      title="프로젝트 찾기"
      subtitle="다양한 프로젝트에 참여하여 새로운 경험을 쌓아보세요"
    />

    <div class="integrated-search-module">
      <div class="search-input-area">
        <svg class="search-icon" width="20" height="20" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8" stroke="currentColor" stroke-width="2"/><path d="m21 21-4.35-4.35" stroke="currentColor" stroke-width="2"/></svg>
        <input
          type="text"
          v-model="searchQuery"
          placeholder="어떤 프로젝트를 찾고 계신가요?"
          class="main-search-input"
          @keypress.enter="handleSearch"
        />
        <button v-if="searchQuery" @click="clearSearch" class="clear-search-btn">
          <svg width="16" height="16" viewBox="0 0 24 24"><path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2"/></svg>
        </button>
      </div>

      <div class="popular-searches">
        <div class="popular-label">인기 검색어</div>
        <div class="popular-tags">
          <button 
            v-for="keyword in popularKeywords" 
            :key="keyword"
            class="popular-tag"
            @click="selectPopularKeyword(keyword)"
          >
            {{ keyword }}
          </button>
        </div>
      </div>

      <hr class="module-divider" />

      <div class="filter-area">
        <div class="filter-row">
          <div class="filter-label">💼 기술 파트</div>
          <div class="filter-content">
            <div class="filter-chips">
              <button v-for="part in techParts" :key="part" class="filter-chip" :class="{ 'active': selectedTechParts.includes(part) }" @click="toggleTechPart(part)">{{ part }}</button>
            </div>
          </div>
        </div>
        
        <div class="filter-row">
          <div class="filter-label">⚡ 기술 스택</div>
          <div class="filter-content">
            <div class="filter-chips">
              <button v-for="stack in popularTechStacks" :key="stack" class="filter-chip" :class="{ 'active': selectedTechStacks.includes(stack) }" @click="toggleTechStack(stack)">{{ stack }}</button>
            </div>
          </div>
        </div>
        
        <div class="filter-row">
          <div class="filter-label">📊 프로젝트 상태</div>
          <div class="filter-content">
            <div class="filter-chips">
              <button v-for="status in filteredProjectStatuses" :key="status.value" class="filter-chip status-chip" :class="{ 'active': selectedStatuses.includes(status.value) }" @click="toggleStatus(status.value)">
                <div class="status-indicator" :class="getStatusClass(status.value)"></div>{{ status.label }}
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div class="filter-actions" v-if="getActiveFilterCount() > 0">
        <button @click="clearAllFilters" class="clear-all-btn">
          <span>모든 필터 초기화</span>
        </button>
      </div>
    </div>

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
          <div v-if="isSearchMode" class="search-results-header">
            <div class="search-info">
              <span class="search-keyword" v-if="currentSearchParams.keyword">
                "{{ currentSearchParams.keyword }}"에 대한 검색 결과
              </span>
              <span v-else>필터 조건에 따른 검색 결과</span>
            </div>
            <div class="applied-filters" v-if="getActiveFilterCount() > 0">
              <span v-if="selectedTechParts.length > 0" class="filter-group">
                <strong>기술 파트:</strong> {{ selectedTechParts.join(', ') }}
              </span>
              <span v-if="selectedTechStacks.length > 0" class="filter-group">
                <strong>기술 스택:</strong> {{ selectedTechStacks.join(', ') }}
              </span>
              <span v-if="selectedStatuses.length > 0" class="filter-group">
                <strong>상태:</strong> {{ selectedStatuses.map(s => projectStatuses.find(p => p.value === s)?.label || s).join(', ') }}
              </span>
            </div>
          </div>
          
          <div class="projects-container">
            <div class="project-list">
              <div v-if="loading" class="loading-state">
                <div class="loading-spinner"></div>
                <span>검색 중...</span>
              </div>
              <div v-else-if="error" class="error-state">{{ error }}</div>
              <template v-else>
                <ProjectCard
                    v-for="project in projects"
                    :key="project.id"
                    :project="project"
                    @apply="openApplyModal"
                    @like-updated="handleLikeUpdate"
                />
                <div v-if="!projects?.length" class="empty-state">
                  <div class="empty-icon">🔍</div>
                  <div class="empty-message">
                    <h3>{{ isSearchMode ? '검색 결과가 없습니다' : '표시할 프로젝트가 없습니다' }}</h3>
                    <p v-if="isSearchMode">다른 검색어나 필터 조건을 시도해보세요.</p>
                  </div>
                </div>
              </template>
            </div>
          </div>

          <div class="pagination-bar">
            <button @click="goToPage(page - 1)" :disabled="page === 1">이전</button>
            <button
                v-for="p in totalPages"
                :key="p"
                :class="{ active: page === p }"
                @click="goToPage(p)"
            >
              {{ p }}
            </button>
            <button @click="goToPage(page + 1)" :disabled="page === totalPages">다음</button>
          </div>
        </div>
      </div>
    </div>

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
import { ref, watch, onActivated, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useUserStore } from '@/stores/userStore';
import { useTechTagStore } from '@/stores/techTagStore';

import PageHeader from '@/components/common/PageHeader.vue';
import SortOptions from '@/components/projectComponents/SortOptions.vue';
import ProjectCard from '@/components/projectComponents/ProjectCard.vue';
import ApplyModal from '@/components/projectComponents/ApplyModal.vue';
import PaginationComponent from '@/components/projectComponents/PaginationComponent.vue'; // 페이지네이션 컴포넌트 임포트

import { useProjects } from '@/composables/useProjects';
import { applyProject } from '@/api/projectMember';
import { searchProjects, getPopularKeywords } from '@/api/search';

const router = useRouter();
const route = useRoute();
const userStore = useUserStore();
const techTagStore = useTechTagStore();

// 검색 및 필터 상태
const searchQuery = ref('');
const selectedTechParts = ref([]);
const selectedTechStacks = ref([]);
const selectedStatuses = ref([]);

const popularKeywords = ref([]);

const selectPopularKeyword = (keyword) => {
  searchQuery.value = keyword;
  handleSearch();
};

// 필터 옵션 데이터
const techParts = computed(() => techTagStore.techParts);
const popularTechStacks = computed(() => techTagStore.getPopularTechStacksTop20());
const projectStatuses = ref([
  { value: 'RECRUITING', label: '모집중' },
  { value: 'IN_PROGRESS', label: '진행중' },
  { value: 'COMPLETED', label: '완료' }
]);
const filteredProjectStatuses = computed(() => projectStatuses.value.filter(status => status.value !== 'CANCELLED'));

const { items: projects, totalPages, page, loading, error, goToPage, load } = useProjects({
  q: route.query.q ?? '',
  page: Number(route.query.page ?? 1),
  size: 8,
});

const loadTechTags = async () => {
  try {
    await techTagStore.loadTechTags();
  } catch (error) {
    console.error('❌ 기술 태그 로드 실패:', error);
  }
};

const loadPopularKeywords = async () => {
  try {
    const response = await getPopularKeywords();
    popularKeywords.value = response.keywords || [];
    console.log('✅ 인기 키워드 로드 성공:', popularKeywords.value);
  } catch (error) {
    console.error('❌ 인기 키워드 로드 실패:', error);
    // 실패시 기본값 제공
    popularKeywords.value = ['React', '토이프로젝트', 'Spring Boot', 'Vue.js'];
  }
};

onActivated(async () => {
  await Promise.all([
    loadTechTags(),
    loadPopularKeywords()
  ]);
  handleSearch(false);
});

watch([page], () => {
  router.replace({ query: { ...route.query, page: page.value !== 1 ? page.value : undefined } });
  performSearch(currentSearchParams.value);
});

// 검색 상태 관리
const currentSearchParams = ref({});
const isSearchMode = ref(false);

const handleSearch = async (resetPage = true) => {
  if (resetPage) {
    page.value = 1;
  }
  const searchParams = {
    keyword: searchQuery.value.trim() || null,
    techParts: selectedTechParts.value.length > 0 ? selectedTechParts.value : null,
    techStacks: selectedTechStacks.value.length > 0 ? selectedTechStacks.value : null,
    statuses: selectedStatuses.value.length > 0 ? selectedStatuses.value : null
  };
  currentSearchParams.value = searchParams;
  isSearchMode.value = Object.values(searchParams).some(v => v !== null && v !== undefined && v.length !== 0);
  
  await performSearch(searchParams);
};

const performSearch = async (searchParams) => {
  loading.value = true;
  try {
    const finalParams = { ...searchParams, page: page.value - 1, size: 8 };
    const result = await searchProjects(finalParams);
    projects.value = result.content || [];
    totalPages.value = result.totalPages || 1;
  } catch (err) {
    console.error('검색 실패:', err);
    error.value = '검색 중 오류가 발생했습니다.';
    projects.value = [];
    totalPages.value = 1;
  } finally {
    loading.value = false;
  }
};

// 필터 아이템 토글
const toggleItem = (list, item) => {
  const index = list.value.indexOf(item);
  if (index > -1) list.value.splice(index, 1);
  else list.value.push(item);
  handleSearch();
};

const toggleTechPart = (part) => toggleItem(selectedTechParts, part);
const toggleTechStack = (stack) => toggleItem(selectedTechStacks, stack);
const toggleStatus = (status) => toggleItem(selectedStatuses, status);

// 필터 초기화
const clearAllFilters = () => {
  selectedTechParts.value = [];
  selectedTechStacks.value = [];
  selectedStatuses.value = [];
  handleSearch();
};
const clearSearch = () => { searchQuery.value = ''; handleSearch(); };

// 유틸리티
const getActiveFilterCount = () => selectedTechParts.value.length + selectedTechStacks.value.length + selectedStatuses.value.length;
const getStatusClass = (status) => ({
  'RECRUITING': 'status-recruiting', 'IN_PROGRESS': 'status-progress', 'COMPLETED': 'status-completed'
}[status] || 'status-default');

// 이하 모달, 토스트, 페이지 이동 관련 로직은 이전과 동일
const goToCreateProject = () => router.push({ name: 'ProjectCreate' });
const showApplyModal = ref(false);
const showSuccessToast = ref(false);
const showFailToast = ref(false);
const selectedProject = ref(null);
const userPortfolio = ref({ isPublic: true, lastUpdated: '2024-07-29' });
const openApplyModal = (project) => { if (!project) return; selectedProject.value = { title: project.title, description: project.description, projectId: project.id }; showApplyModal.value = true; };
const closeApplyModal = () => { showApplyModal.value = false; selectedProject.value = null; };
const goToPortfolioSettings = () => { closeApplyModal(); router.push({ name: 'PortfolioSettings' }); };
const handleApplicationSubmitted = async (applicationData) => { if (!selectedProject.value?.projectId) return; const payload = { techPart: applicationData.applicationForm.part, applicationMessage: applicationData.applicationForm.message, userId: userStore.userId }; try { await applyProject(selectedProject.value.projectId, payload); showSuccessToast.value = true; setTimeout(() => (showSuccessToast.value = false), 3000); } catch (err) { console.error('지원 처리 중 오류 발생:', err); showFailToast.value = true; setTimeout(() => (showFailToast.value = false), 3000); } finally { closeApplyModal(); } };
</script>


<style scoped>
/* 기본 레이아웃 */
.project-list-page {
  min-height: 100vh;
  background: #F9FAFB; /* 페이지 배경 변경 */
  padding-top: 68px;
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
}

/* 통합 검색 모듈 */
.integrated-search-module {
  max-width: 848px;
  margin: 0 auto 48px auto;
  background: #fff;
  border-radius: 16px;
  border: 1px solid #E5E7EB;
  padding: 16px 24px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
  transition: box-shadow 0.3s ease;
}
.integrated-search-module:hover {
  box-shadow: 0 8px 20px rgba(0,0,0,0.08);
}
.search-input-area {
  position: relative;
  display: flex;
  align-items: center;
}
.search-icon {
  position: absolute;
  left: 4px;
  color: #9CA3AF;
  pointer-events: none;
}
.main-search-input {
  width: 100%;
  height: 48px;
  padding-left: 36px;
  padding-right: 40px;
  border: none;
  background: transparent;
  font-size: 18px;
  color: #111827;
  outline: none;
}
.main-search-input::placeholder {
  color: #9CA3AF;
}
.clear-search-btn {
  position: absolute;
  right: 4px;
  background: none; border: none;
  color: #6B7280; cursor: pointer;
}

.popular-searches {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 16px;
  padding: 0 4px;
}
.popular-label {
  font-size: 14px;
  font-weight: 600;
  color: #6B7280;
  flex-shrink: 0;
}
.popular-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.popular-tag {
  background: #F3F4F6;
  border: 1px solid #E5E7EB;
  color: #4B5563;
  padding: 6px 14px;
  border-radius: 16px;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s ease;
}
.popular-tag:hover {
  background: #6366F1;
  color: #fff;
  border-color: #6366F1;
}

.module-divider {
  border: none;
  height: 1px;
  background-color: #F3F4F6;
  margin: 16px 0;
}
.filter-area {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.filter-row {
  display: flex;
  align-items: flex-start;
  gap: 16px;
}
.filter-label {
  font-size: 14px;
  font-weight: 600;
  color: #4B5563;
  width: 100px;
  padding-top: 6px;
  flex-shrink: 0;
}
.filter-content {
  flex-grow: 1;
}
.filter-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.filter-chip {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border: 1px solid #E5E7EB;
  border-radius: 20px;
  background: #F9FAFB;
  color: #4B5563;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}
.filter-chip:hover {
  border-color: #A5B4FC;
  background: #EEF2FF;
  color: #4338CA;
}
.filter-chip.active {
  background: #4F46E5;
  border-color: #4F46E5;
  color: #fff;
  font-weight: 600;
}
.status-indicator { width: 8px; height: 8px; border-radius: 50%; }
.status-recruiting { background: #10B981; }
.status-progress { background: #F59E0B; }
.status-completed { background: #6366F1; }
.filter-chip.active .status-indicator {
  background-color: #fff;
}
.filter-actions {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #F3F4F6;
  display: flex;
  justify-content: flex-end;
}
.clear-all-btn {
  background: none; border: none;
  font-size: 13px;
  font-weight: 500;
  color: #6B7280;
  cursor: pointer;
  transition: color 0.2s ease;
}
.clear-all-btn:hover {
  color: #EF4444;
}

/* 프로젝트 목록 및 기타 */
.sort-section {
  width: 100%;
  max-width: 1080px;
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
  background: #4F46E5;
  color: #FFF;
  border: none;
  border-radius: 8px;
  padding: 12px 20px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(79, 70, 229, 0.2);
}
.create-project-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(79, 70, 229, 0.3);
}
.projects-section {
  width: 100%;
}
.search-results-header {
  background: #EEF2FF;
  border: 1px solid #C7D2FE;
  color: #4338CA;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 20px;
}
.search-info { font-size: 16px; font-weight: 600; }
.applied-filters { display: flex; flex-wrap: wrap; gap: 12px; font-size: 13px; margin-top: 8px; }
.filter-group strong { color: #3730A3; }

/* 상태 표시 */
.loading-state, .error-state, .empty-state { text-align: center; padding: 40px; }
.loading-spinner { width: 24px; height: 24px; border: 3px solid #E5E7EB; border-top-color: #4F46E5; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto 12px auto; }
@keyframes spin { to { transform: rotate(360deg); } }
.empty-icon { font-size: 64px; margin-bottom: 16px; opacity: 0.5; }
.empty-message h3 { font-size: 20px; font-weight: 600; }

/* 페이지네이션 */
.pagination-bar {
  margin-top: 24px;
  display: flex;
  justify-content: center;
  gap: 8px;
}
.pagination-bar button {
  background: #fff;
  border: 1px solid #D1D5DB;
  border-radius: 8px;
  padding: 8px 16px;
  cursor: pointer;
  transition: all 0.2s;
  font-weight: 500;
}
.pagination-bar button:hover {
  background: #EEF2FF;
  border-color: #C7D2FE;
  color: #4338CA;
}
.pagination-bar button.active {
  background: #4F46E5;
  color: #fff;
  border-color: #4F46E5;
}
.pagination-bar button:disabled { opacity: 0.5; cursor: default; background: #F3F4F6; }

/* 토스트 */
.success-toast, .fail-toast { position: fixed; top: 80px; right: 30px; color: white; padding: 16px 24px; border-radius: 12px; z-index: 1001; animation: slideInRight 0.3s ease; box-shadow: 0 8px 25px rgba(0,0,0,0.15); }
.success-toast { background: #22C55E; }
.fail-toast { background: #EF4444; }
@keyframes slideInRight { from { opacity: 0; transform: translateX(100px); } to { opacity: 1; transform: translateX(0); } }
</style>