<template>
  <div class="portfolio-list-page">
    <PageHeader 
      title="포트폴리오 갤러리"
      subtitle="다양한 분야의 크리에이터들과 만나보세요"
    />

    <div class="integrated-search-module">
      <div class="search-input-area">
        <svg class="search-icon" width="20" height="20" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8" stroke="currentColor" stroke-width="2"/><path d="m21 21-4.35-4.35" stroke="currentColor" stroke-width="2"/></svg>
        <input
          type="text"
          v-model="searchQuery"
          placeholder="어떤 포트폴리오를 찾고 계신가요?"
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
        <div class="filter-hint">선택한 항목 중 하나라도 일치하는 결과를 반환합니다.</div>
        <div class="filter-row">
          <div class="filter-label">
            💼 기술 파트
          </div>
          <div class="filter-content">
            <div class="filter-chips">
              <button v-for="part in techParts" :key="part" class="filter-chip" :class="{ 'active': selectedTechParts.includes(part) }" @click="toggleTechPart(part)">
                {{ part }}
                <span v-if="selectedTechParts.length > 0 && selectedTechParts.includes(part)" class="logic-indicator">+</span>
              </button>
            </div>
          </div>
        </div>
        
        <div class="filter-row">
          <div class="filter-label">
            ⚡ 기술 스택
          </div>
          <div class="filter-content">
            <div class="filter-chips">
              <button v-for="stack in popularTechStacks" :key="stack" class="filter-chip" :class="{ 'active': selectedTechStacks.includes(stack) }" @click="toggleTechStack(stack)">
                {{ stack }}
                <span v-if="selectedTechStacks.length > 0 && selectedTechStacks.includes(stack)" class="logic-indicator">+</span>
              </button>
            </div>
          </div>
        </div>
        
        <div class="filter-row">
          <div class="filter-label">
            📈 경력 수준
          </div>
          <div class="filter-content">
            <div class="filter-chips">
              <button v-for="experience in experienceRanges" :key="experience.value" class="filter-chip experience-chip" :class="{ 'active': selectedExperiences.includes(experience.value) }" @click="toggleExperience(experience.value)">
                {{ experience.label }}
                <span v-if="selectedExperiences.length > 0 && selectedExperiences.includes(experience.value)" class="logic-indicator">+</span>
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
          <div class="result-info">
            <h2 class="section-title">{{ totalPortfolios }}개의 포트폴리오</h2>
          </div>
          <div class="sort-options">
            <div 
              class="sort-option" 
              :class="{ selected: sortBy === 'recent' }" 
              @click="setSortBy('recent')"
            >
              최신순
            </div>
            <div 
              class="sort-option" 
              :class="{ selected: sortBy === 'popularity' }" 
              @click="setSortBy('popularity')"
            >
              인기순
            </div>
          </div>
        </div>

        <div class="portfolios-section">
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
              <span v-if="selectedExperiences.length > 0" class="filter-group">
                <strong>경력 수준:</strong> {{ selectedExperiences.map(s => experienceRanges.find(p => p.value === s)?.label || s).join(', ') }}
              </span>
            </div>
          </div>
          
          <div class="portfolios-container">
            <div class="portfolio-list">
              <div v-if="loading" class="loading-state">
                <div class="loading-spinner"></div>
                <span>포트폴리오를 검색 중...</span>
              </div>
              <div v-else-if="error" class="error-state">{{ error }}</div>
              <template v-else-if="portfolios.length > 0">
                <PortfolioCard
                  v-for="portfolio in portfolios" 
                  :key="portfolio.id" 
                  :portfolio="portfolio"
                  @like-updated="handleLikeUpdate"
                />
              </template>
              <div v-else class="empty-state">
                <div class="empty-icon">🔍</div>
                <div class="empty-message">
                  <h3>{{ isSearchMode ? '검색 결과가 없습니다' : '표시할 포트폴리오가 없습니다' }}</h3>
                  <p v-if="isSearchMode">다른 검색어나 필터 조건을 시도해보세요.</p>
                </div>
              </div>
            </div>
          </div>

          <PaginationComponent 
            :current-page="page" 
            :total-pages="totalPages" 
            :page-group-size="5" 
            @page-change="handlePageChange" 
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onActivated, onMounted, onUnmounted, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { onBeforeRouteLeave } from 'vue-router';
import { useTechTagStore } from '@/stores/techTagStore';
import { useUserStore } from '@/stores/userStore';

import PageHeader from '@/components/common/PageHeader.vue';
import PortfolioCard from '@/components/portfolioComponents/PortfolioCard.vue';
import PaginationComponent from '@/components/common/PaginationComponent.vue';

import { searchUsers, getPopularUserKeywords } from '@/api/search';
import { getPortfolios } from '@/api/user';

const router = useRouter();
const route = useRoute();
const techTagStore = useTechTagStore();
const userStore = useUserStore();

// 검색 및 필터 상태
const searchQuery = ref('');
const selectedTechParts = ref([]);
const selectedTechStacks = ref([]);
const selectedExperiences = ref([]);
const popularKeywords = ref([]);

const selectPopularKeyword = (keyword) => {
  searchQuery.value = keyword;
  handleSearch();
};

// 필터 옵션 데이터
const techParts = computed(() => techTagStore.userTechParts);
const popularTechStacks = computed(() => techTagStore.getUserPopularTechStacksTop20());
const experienceRanges = ref([
  { value: 'FRESHER', label: '신입' },
  { value: 'LT_1', label: '1년 미만' },
  { value: 'Y1_3', label: '1-3년' },
  { value: 'Y3_5', label: '3-5년' },
  { value: 'Y5_10', label: '5-10년' },
  { value: 'GE_10', label: '10년 이상' },
  { value: 'ETC', label: '기타' }
]);

// 데이터 상태
const portfolios = ref([]);
const loading = ref(false);
const error = ref(null);
const page = ref(1);
const totalPages = ref(1);
const totalPortfolios = ref(0);
const sortBy = ref('recent');

// 검색 상태 관리
const currentSearchParams = ref({});
const isSearchMode = ref(false);

const loadTechTags = async () => {
  try {
    await techTagStore.loadUserTechTags();
  } catch (error) {
    console.error('❌ 유저 기술 태그 로드 실패:', error);
  }
};

const loadPopularKeywords = async () => {
  try {
    const response = await getPopularUserKeywords();
    popularKeywords.value = response.keywords || [];
  } catch (error) {
    console.error('❌ 포트폴리오 인기 키워드 로드 실패:', error);
    popularKeywords.value = ['React', 'Vue.js', 'Node.js', 'Python'];
  }
};

const resetSearchState = () => {
  searchQuery.value = '';
  selectedTechParts.value = [];
  selectedTechStacks.value = [];
  selectedExperiences.value = [];
  currentSearchParams.value = {};
  isSearchMode.value = false;
  page.value = 1;
  sessionStorage.removeItem('portfolioListFilters');
};

onMounted(() => {
  window.addEventListener('user-logout', resetSearchState);
});

onUnmounted(() => {
  window.removeEventListener('user-logout', resetSearchState);
});

onBeforeRouteLeave((to, from, next) => {
  const portfolioPages = ['/portfolios'];
  const isLeavingPortfolioSection = !portfolioPages.some(page => to.path.startsWith(page)) &&
                                   !to.path.match(/^\/portfolio\/\d+$/);
  
  if (isLeavingPortfolioSection) {
    resetSearchState();
  }
  next();
});

onActivated(async () => {
  try {
    await Promise.all([loadTechTags(), loadPopularKeywords()]);
    handleSearch(false);
  } catch (error) {
    console.error('❌ 초기 데이터 로드 실패 (PortfolioListPage):', error);
  }
});

watch(page, () => {
  performSearch(currentSearchParams.value);
});

const handleSearch = async (resetPage = true) => {
  if (resetPage) {
    page.value = 1;
  }
  const searchParams = {
    keyword: searchQuery.value.trim() || null,
    techParts: selectedTechParts.value.length > 0 ? selectedTechParts.value : null,
    techStacks: selectedTechStacks.value.length > 0 ? selectedTechStacks.value : null,
    experienceRanges: selectedExperiences.value.length > 0 ? selectedExperiences.value : null
  };
  currentSearchParams.value = searchParams;
  isSearchMode.value = Object.values(searchParams).some(v => v !== null && v !== undefined && v.length !== 0);
  
  await performSearch(searchParams);
};

const performSearch = async (searchParams) => {
  loading.value = true;
  error.value = null;
  try {
    // 검색/필터 조건이 있을 때는 전체 데이터를 가져와서 프론트엔드에서 정렬 및 페이지네이션
    const hasSearchConditions = 
      searchParams.keyword || 
      (searchParams.techParts && searchParams.techParts.length > 0) || 
      (searchParams.techStacks && searchParams.techStacks.length > 0) || 
      (searchParams.experienceRanges && searchParams.experienceRanges.length > 0);

    const finalParams = { 
      ...searchParams, 
      page: page.value - 1, 
      size: 8,
      sort: convertSortToBackend(sortBy.value)
    };
    
    let result;
    if (hasSearchConditions) {
      // 검색/필터 조건이 있을 때만 Elasticsearch 사용 (정렬 포함)
      console.log('🔍 Using Elasticsearch for portfolio search with conditions:', finalParams);
      result = await searchUsers(finalParams);
    } else {
      // 검색/필터 조건이 없으면 RDB에서 가져오기 (기존 방식)
      console.log('🗄️ Using RDB API for basic portfolio listing with sort:', sortBy.value);
      const rdbParams = {
        page: page.value - 1,
        size: 8,
        sortBy: getSortByParam(sortBy.value)
      };
      result = await getPortfolios(rdbParams);
    }
    
    const data = result.data || result;
    let portfolioList = (data.content || data.portfolios)?.map(user => ({
      userId: user.userId,
      id: user.userId,
      name: user.nickname || `User ${user.userId}`,
      jobTitle: user.jobTitle || null,
      category: user.techPartName || user.techPart || 'General',
      skills: user.techStacks && user.techStacks.length > 0 ? user.techStacks : [],
      avatar: getValidImageUrl(user.profileImage) || '/default-avatar.svg',
      isLiked: user.isLiked || false, // 초기 좋아요 상태
      likeCount: user.likeCount || 0,
      experienceRange: user.experienceRange,
      bio: user.bio || '',
    })) || [];
    
    // Elasticsearch에서 이미 정렬되어 온 데이터 사용
    portfolios.value = portfolioList;
    totalPages.value = data.totalPages || 1;
    totalPortfolios.value = data.totalElements || 0;

  } catch (err) {
    console.error('검색 실패:', err);
    error.value = '포트폴리오 검색 중 오류가 발생했습니다.';
    portfolios.value = [];
    totalPages.value = 1;
    totalPortfolios.value = 0;
  } finally {
    loading.value = false;
  }
};

const handleLikeUpdate = ({ portfolioId, isLiked, likeCount }) => {
  const portfolio = portfolios.value.find(p => p.id === portfolioId);
  if (portfolio) {
    portfolio.isLiked = isLiked;
    portfolio.likeCount = likeCount;
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
const toggleExperience = (experience) => toggleItem(selectedExperiences, experience);

// 필터 초기화
const clearAllFilters = () => {
  selectedTechParts.value = [];
  selectedTechStacks.value = [];
  selectedExperiences.value = [];
  handleSearch();
};
const clearSearch = () => { searchQuery.value = ''; handleSearch(); };

// 이미지 URL 유효성 검사 및 변환 함수
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

// 유틸리티
const getActiveFilterCount = () => selectedTechParts.value.length + selectedTechStacks.value.length + selectedExperiences.value.length;

const handlePageChange = (newPage) => {
  if (newPage >= 1 && newPage <= totalPages.value) {
    page.value = newPage;
  }
};

const goToPage = (newPage) => {
  if (newPage >= 1 && newPage <= totalPages.value) {
    page.value = newPage;
  }
};

const setSortBy = (sortType) => {
  sortBy.value = sortType;
  // 페이지를 1로 리셋
  page.value = 1;
  
  // 현재 UI 상태에서 검색 파라미터를 직접 구성
  const searchParams = {
    keyword: searchQuery.value.trim() || null,
    techParts: selectedTechParts.value.length > 0 ? selectedTechParts.value : null,
    techStacks: selectedTechStacks.value.length > 0 ? selectedTechStacks.value : null,
    experienceRanges: selectedExperiences.value.length > 0 ? selectedExperiences.value : null
  };
  
  // currentSearchParams도 업데이트
  currentSearchParams.value = searchParams;
  isSearchMode.value = Object.values(searchParams).some(v => v !== null && v !== undefined && v.length !== 0);
  
  performSearch(searchParams);
};

const getSortByParam = (sortType) => {
  switch (sortType) {
    case 'popularity': return 'likeCount';
    case 'created': return 'createdAt'; 
    case 'recent':
    default: return 'recent';
  }
};

// 프론트엔드 정렬 값을 백엔드 형식으로 변환
const convertSortToBackend = (sortValue) => {
  switch (sortValue) {
    case 'recent':
      return 'latest';
    case 'popularity':
      return 'popular';
    default:
      return 'latest';
  }
};

const sortByToParam = (v) => {
  switch (v) {
    case 'recent': return 'createdAt,desc';
    case 'popularity': return 'popularity,desc';
    default: return 'createdAt,desc';
  }
};

</script>

<style scoped>
/* 기존 스타일 유지 */
.portfolio-list-page { min-height: 100vh; background: #F9FAFB; padding-top: 68px; }
.container { width: 100%; display: flex; flex-direction: column; align-items: center; padding: 0 20px; }
.content-wrapper { width: 100%; max-width: 1080px; padding: 20px 0 90px 0; }
.integrated-search-module { max-width: 848px; margin: 0 auto 48px auto; background: #fff; border-radius: 16px; border: 1px solid #E5E7EB; padding: 16px 24px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); transition: box-shadow 0.3s ease; }
.integrated-search-module:hover { box-shadow: 0 8px 20px rgba(0,0,0,0.08); }
.search-input-area { position: relative; display: flex; align-items: center; }
.search-icon { position: absolute; left: 4px; color: #9CA3AF; pointer-events: none; }
.main-search-input { width: 100%; height: 48px; padding-left: 36px; padding-right: 40px; border: none; background: transparent; font-size: 18px; color: #111827; outline: none; }
.main-search-input::placeholder { color: #9CA3AF; }
.clear-search-btn { position: absolute; right: 4px; background: none; border: none; color: #6B7280; cursor: pointer; }
.popular-searches { display: flex; align-items: center; gap: 12px; margin-top: 16px; padding: 0 4px; }
.popular-label { font-size: 14px; font-weight: 600; color: #6B7280; flex-shrink: 0; }
.popular-tags { display: flex; flex-wrap: wrap; gap: 8px; }
.popular-tag { background: #F3F4F6; border: 1px solid #E5E7EB; color: #4B5563; padding: 6px 14px; border-radius: 16px; font-size: 13px; cursor: pointer; transition: all 0.2s ease; }
.popular-tag:hover { background: #4CAF50; color: #fff; border-color: #4CAF50; }
.module-divider { border: none; height: 1px; background-color: #F3F4F6; margin: 16px 0; }
.filter-area { display: flex; flex-direction: column; gap: 16px; }
.filter-row { display: flex; align-items: flex-start; gap: 16px; }
.filter-label { font-size: 14px; font-weight: 600; color: #4B5563; width: 100px; padding-top: 6px; flex-shrink: 0; }
.filter-hint { font-size: 11px; color: #9CA3AF; font-style: italic; }
.filter-content { flex-grow: 1; }
.filter-chips { display: flex; flex-wrap: wrap; gap: 8px; }
.filter-chip { display: flex; align-items: center; gap: 6px; padding: 6px 12px; border: 1px solid #E5E7EB; border-radius: 20px; background: #F9FAFB; color: #4B5563; font-size: 13px; font-weight: 500; cursor: pointer; transition: all 0.2s ease; }
.filter-chip:hover { border-color: #C8E6C9; background: #F1F8E9; color: #2E7D32; }
.filter-chip.active { background: #4CAF50; border-color: #4CAF50; color: #fff; font-weight: 600; }
.logic-indicator { margin-left: 4px; font-size: 12px; font-weight: 700; color: rgba(255, 255, 255, 0.8); background: rgba(255, 255, 255, 0.2); border-radius: 50%; width: 16px; height: 16px; display: flex; align-items: center; justify-content: center; line-height: 1; }
.filter-actions { margin-top: 16px; padding-top: 16px; border-top: 1px solid #F3F4F6; display: flex; justify-content: flex-end; }
.clear-all-btn { background: none; border: none; font-size: 13px; font-weight: 500; color: #6B7280; cursor: pointer; transition: color 0.2s ease; }
.clear-all-btn:hover { color: #EF4444; }
.sort-section { width: 100%; max-width: 1080px; display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; padding: 0 10px; }
.result-info { flex-grow: 1; }
.section-title { font-size: 24px; font-weight: 700; color: #262626; margin: 0; }
.sort-options { display: flex; border-radius: 20px; background: #F0F0F0; padding: 5px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05); }
.sort-option { padding: 8px 18px; border-radius: 17px; cursor: pointer; font-size: 13px; font-weight: 500; color: #888; white-space: nowrap; transition: all 0.2s ease; }
.sort-option.selected { background: #FFF; color: #000; font-weight: 700; box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1); }
.sort-option:hover:not(.selected) { background-color: #e8e8e8; color: #555; }
.portfolios-section { width: 100%; }
.search-results-header { background: #F1F8E9; border: 1px solid #C8E6C9; color: #2E7D32; border-radius: 12px; padding: 16px; margin-bottom: 20px; }
.search-info { font-size: 16px; font-weight: 600; }
.applied-filters { display: flex; flex-wrap: wrap; gap: 12px; font-size: 13px; margin-top: 8px; }
.filter-group strong { color: #2E7D32; }
.portfolio-list { display: grid; grid-template-columns: repeat(auto-fit, minmax(350px, 1fr)); gap: 24px; }
.loading-state, .error-state, .empty-state { text-align: center; padding: 40px; }
.loading-spinner { width: 24px; height: 24px; border: 3px solid #E5E7EB; border-top-color: #4CAF50; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto 12px auto; }
@keyframes spin { to { transform: rotate(360deg); } }
.empty-icon { font-size: 64px; margin-bottom: 16px; opacity: 0.5; }
.empty-message h3 { font-size: 20px; font-weight: 600; }
</style>
