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
                <span class="result-count">({{ getFilterResultCount('techPart', part) }})</span>
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
                <span class="result-count">({{ getFilterResultCount('techStack', stack) }})</span>
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
                <span class="result-count">({{ getFilterResultCount('experience', experience.value) }})</span>
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
            <h2 class="section-title">{{ portfolios.length }}개의 포트폴리오</h2>
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
              <template v-else>
                <div 
                  v-for="portfolio in portfolios" 
                  :key="portfolio.id" 
                  class="portfolio-card"
                  @click="viewPortfolio(portfolio.id)"
                >
                  <!-- 카드 헤더 -->
                  <div class="card-header">
                    <div class="profile-section">
                      <div class="profile-avatar">
                        <img :src="portfolio.avatar" :alt="portfolio.name" />
                      </div>
                      <div class="profile-info">
                        <h3 class="profile-name">{{ portfolio.name }}</h3>
                        <p v-if="portfolio.jobTitle" class="profile-title">{{ portfolio.jobTitle }}</p>
                        <div class="category-badge">{{ portfolio.category }}</div>
                      </div>
                    </div>
                    <div class="card-actions">
                      <button class="like-btn" :class="{ 'liked': portfolio.isLiked }" @click.stop="toggleLike(portfolio.id)">
                        <i class="bi bi-heart-fill"></i>
                      </button>
                    </div>
                  </div>

                  <!-- 카드 본문 -->
                  <div class="card-body">
                    <!-- 스킬 섹션 -->
                    <div class="skills-section">
                      <div class="skills-header">
                        <i class="bi bi-tools"></i>
                        <span class="skills-title">기술 스택</span>
                      </div>
                      <div class="skills-list">
                        <span 
                          v-for="skill in portfolio.skills" 
                          :key="skill" 
                          class="skill-tag"
                        >
                          {{ skill }}
                        </span>
                      </div>
                    </div>
                  </div>

                  <!-- 카드 푸터 -->
                  <div class="card-footer">
                    <div class="action-buttons">
                      <button class="view-btn">
                        <i class="bi bi-eye"></i>
                        자세히 보기
                      </button>
                    </div>
                  </div>
                </div>
                <div v-if="!portfolios?.length" class="empty-state">
                  <div class="empty-icon">🔍</div>
                  <div class="empty-message">
                    <h3>{{ isSearchMode ? '검색 결과가 없습니다' : '표시할 포트폴리오가 없습니다' }}</h3>
                    <p v-if="isSearchMode">다른 검색어나 필터 조건을 시도해보세요.</p>
                  </div>
                </div>
              </template>
            </div>
          </div>

          <div class="pagination-bar" v-if="totalPages > 1">
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
  </div>
</template>

<script setup>
import { ref, computed, onActivated, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useTechTagStore } from '@/stores/techTagStore'

import PageHeader from '@/components/common/PageHeader.vue'

import { searchUsers, getPopularUserKeywords, getUserCountPreview } from '@/api/search'

const router = useRouter()
const route = useRoute()
const techTagStore = useTechTagStore()

// 검색 및 필터 상태
const searchQuery = ref('')
const selectedTechParts = ref([])
const selectedTechStacks = ref([])
const selectedExperiences = ref([])

const popularKeywords = ref([])
const filterResultCounts = ref({}) // 각 필터별 결과 수 저장

const selectPopularKeyword = (keyword) => {
  searchQuery.value = keyword
  handleSearch()
}

// 필터 옵션 데이터 (유저 기반)
const techParts = computed(() => techTagStore.userTechParts)
const baseTechStacks = computed(() => techTagStore.getUserPopularTechStacksTop20())

// 필터 결과 수에 따라 정렬된 기술 스택
const popularTechStacks = computed(() => {
  const stacks = baseTechStacks.value.slice()
  return stacks.sort((a, b) => {
    const countA = filterResultCounts.value[`techStack-${a}`] || 0
    const countB = filterResultCounts.value[`techStack-${b}`] || 0
    return countB - countA
  })
})

const experienceRanges = ref([
  { value: 'FRESHER', label: '신입' },
  { value: 'LT_1', label: '1년 미만' },
  { value: 'Y1_3', label: '1-3년' },
  { value: 'Y3_5', label: '3-5년' },
  { value: 'Y5_10', label: '5-10년' },
  { value: 'GE_10', label: '10년 이상' },
  { value: 'ETC', label: '기타' }
])

// 데이터 상태
const portfolios = ref([])
const loading = ref(false)
const error = ref(null)
const page = ref(1)
const totalPages = ref(1)
const totalPortfolios = ref(0)
const pageSize = ref(12)
const sortBy = ref('recent')

// 검색 상태 관리
const currentSearchParams = ref({})
const isSearchMode = ref(false)

const loadTechTags = async () => {
  try {
    await techTagStore.loadUserTechTags()
  } catch (error) {
    console.error('❌ 유저 기술 태그 로드 실패:', error)
  }
}

const loadPopularKeywords = async () => {
  try {
    const response = await getPopularUserKeywords()
    popularKeywords.value = response.keywords || []
    // 포트폴리오 인기 키워드 로드 성공
  } catch (error) {
    console.error('❌ 포트폴리오 인기 키워드 로드 실패:', error)
    // 실패시 기본값 제공
    popularKeywords.value = ['React', 'Vue.js', 'Node.js', 'Python']
  }
}

onActivated(async () => {
  try {
    await Promise.all([
      loadTechTags(),
      loadPopularKeywords()
    ])
    // 기술 태그 및 인기 키워드 로드 완료
    
    handleSearch(false)
    // 초기 필터 결과 수 로딩
    setTimeout(() => updateFilterResultCounts(), 1000)
  } catch (error) {
    console.error('❌ 초기 데이터 로드 실패 (PortfolioListPage):', error)
  }
})

watch([page], () => {
  router.replace({ query: { ...route.query, page: page.value !== 1 ? page.value : undefined } })
  performSearch(currentSearchParams.value)
})


const handleSearch = async (resetPage = true) => {
  if (resetPage) {
    page.value = 1
  }
  const searchParams = {
    keyword: searchQuery.value.trim() || null,
    techParts: selectedTechParts.value.length > 0 ? selectedTechParts.value : null,
    techStacks: selectedTechStacks.value.length > 0 ? selectedTechStacks.value : null,
    experienceRanges: selectedExperiences.value.length > 0 ? selectedExperiences.value : null
  }
  currentSearchParams.value = searchParams
  isSearchMode.value = Object.values(searchParams).some(v => v !== null && v !== undefined && v.length !== 0)
  
  await performSearch(searchParams)
}

const performSearch = async (searchParams) => {
  loading.value = true
  try {
    const finalParams = { 
      ...searchParams, 
      page: page.value - 1, 
      size: 20,
      sort: sortByToParam(sortBy.value)
    }
    const result = await searchUsers(finalParams)
    
    
    portfolios.value = result.content?.map(user => ({
      userId: user.userId,
      id: user.userId,
      nickname: user.nickname || `User ${user.userId}`,
      name: user.nickname || `User ${user.userId}`,
      jobTitle: user.jobTitle || null,
      category: user.techPart || 'General',
      skills: user.techStacks || [],
      profileImage: `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.userId}`,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.userId}`,
      isLiked: false,
      experienceRange: user.experienceRange,
      bio: user.bio || '',
      projectCount: user.projectCount || 0,
      techStackCount: user.techStackCount || user.techStacks?.length || 0,
      reviewCount: user.reviewCount || 0,
      reputationScore: user.reputationScore || 0
    })) || []
    
    totalPages.value = result.totalPages || 1
    // 포트폴리오 검색 성공
  } catch (err) {
    console.error('검색 실패:', err)
    error.value = '검색 중 오류가 발생했습니다.'
    portfolios.value = []
    totalPages.value = 1
  } finally {
    loading.value = false
  }
}

// 결과 수 미리보기 기능 (OR 방식으로 수정)
const updateFilterResultCounts = async () => {
  try {
    // 필터 결과 수 업데이트 시작

    // 기술 파트별 결과 수 계산 - 병렬 처리
    await Promise.allSettled(
      techParts.value.map(async (part) => {
        const result = await getUserCountPreview({ keyword: searchQuery.value.trim() || null, techParts: [part] })
        filterResultCounts.value[`techPart-${part}`] = result.totalCount ?? 0
      })
    ).then(results => results.forEach((r, i) => { 
      if (r.status === 'rejected') {
        const part = techParts.value[i]
        console.error(`❌ 기술 파트 "${part}" 결과 수 조회 실패:`, r.reason)
        filterResultCounts.value[`techPart-${part}`] = 0 
      }
    }))

    // 기술 스택별 결과 수 계산 - 병렬 처리
    await Promise.allSettled(
      popularTechStacks.value.map(async (stack) => {
        const result = await getUserCountPreview({ keyword: searchQuery.value.trim() || null, techStacks: [stack] })
        filterResultCounts.value[`techStack-${stack}`] = result.totalCount ?? 0
      })
    ).then(results => results.forEach((r, i) => { 
      if (r.status === 'rejected') {
        const stack = popularTechStacks.value[i]
        console.error(`❌ 기술 스택 "${stack}" 결과 수 조회 실패:`, r.reason)
        filterResultCounts.value[`techStack-${stack}`] = 0 
      }
    }))

    // 경력별 결과 수 계산 - 병렬 처리
    await Promise.allSettled(
      experienceRanges.value.map(async (exp) => {
        const result = await getUserCountPreview({ keyword: searchQuery.value.trim() || null, experienceRanges: [exp.value] })
        filterResultCounts.value[`experience-${exp.value}`] = result.totalCount ?? 0
      })
    ).then(results => results.forEach((r, i) => { 
      if (r.status === 'rejected') {
        const exp = experienceRanges.value[i]
        console.error(`❌ 경력 수준 "${exp.label}" 결과 수 조회 실패:`, r.reason)
        filterResultCounts.value[`experience-${exp.value}`] = 0 
      }
    }))

    // 필터 결과 수 업데이트 완료
  } catch (error) {
    console.error('❌ 필터 결과 수 업데이트 실패 (Portfolio):', error)
  }
}

// 각 필터의 결과 수 가져오기
const getFilterResultCount = (type, value) => {
  const key = `${type}-${value}`
  const count = filterResultCounts.value[key] || 0
  return count
}

// 필터 아이템 토글
const toggleItem = (list, item) => {
  const index = list.value.indexOf(item)
  if (index > -1) list.value.splice(index, 1)
  else list.value.push(item)
  handleSearch()
  // 필터 변경 시 결과 수 업데이트 (디바운스 적용)
  setTimeout(() => updateFilterResultCounts(), 500)
}

const toggleTechPart = (part) => {
  // 기술 파트 토글
  toggleItem(selectedTechParts, part)
}

const toggleTechStack = (stack) => {
  // 기술 스택 토글
  toggleItem(selectedTechStacks, stack)
}

const toggleExperience = (experience) => {
  // 경력 수준 토글
  toggleItem(selectedExperiences, experience)
}

// 필터 초기화
const clearAllFilters = () => {
  selectedTechParts.value = []
  selectedTechStacks.value = []
  selectedExperiences.value = []
  handleSearch()
}
const clearSearch = () => { searchQuery.value = ''; handleSearch() }

// 유틸리티
const getActiveFilterCount = () => selectedTechParts.value.length + selectedTechStacks.value.length + selectedExperiences.value.length

const goToPage = (newPage) => {
  if (newPage >= 1 && newPage <= totalPages.value) {
    page.value = newPage
  }
}

const toggleLike = (portfolioId) => {
  const portfolio = portfolios.value.find(p => p.id === portfolioId)
  if (portfolio) {
    portfolio.isLiked = !portfolio.isLiked
  }
}

const viewPortfolio = (portfolioId) => {
  router.push(`/portfolio/${portfolioId}`)
}

const setSortBy = (sortType) => {
  sortBy.value = sortType
  handleSearch()
}

const sortByToParam = (v) => {
  switch (v) {
    case 'recent': return 'createdAt,desc'
    case 'popularity': return 'popularity,desc'
    default: return undefined
  }
}

const getSkillLevelClass = (skill) => {
  const proficiency = typeof skill === 'object' ? skill.proficiency : null
  
  if (!proficiency) return 'skill-level-0'
  
  if (proficiency >= 5) return 'skill-level-5'
  if (proficiency >= 4) return 'skill-level-4' 
  if (proficiency >= 3) return 'skill-level-3'
  if (proficiency >= 2) return 'skill-level-2'
  return 'skill-level-1'
}
</script>

<style scoped>
/* 기본 레이아웃 */
.portfolio-list-page {
  min-height: 100vh;
  background: #F9FAFB;
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
  background: #4CAF50;
  color: #fff;
  border-color: #4CAF50;
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
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.filter-hint {
  font-size: 11px;
  font-weight: 400;
  color: #9CA3AF;
  font-style: italic;
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
  border-color: #C8E6C9;
  background: #F1F8E9;
  color: #2E7D32;
}
.filter-chip.active {
  background: #4CAF50;
  border-color: #4CAF50;
  color: #fff;
  font-weight: 600;
}
.result-count {
  margin-left: 4px;
  font-size: 11px;
  font-weight: 500;
  opacity: 0.7;
  color: inherit;
}
.filter-chip.active .result-count {
  color: rgba(255, 255, 255, 0.8);
}
.logic-indicator {
  margin-left: 4px;
  font-size: 12px;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.8);
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  width: 16px;
  height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
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

/* 포트폴리오 목록 및 기타 */
.sort-section {
  width: 100%;
  max-width: 1080px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  padding: 0 10px;
}
.section-title {
  font-size: 24px;
  font-weight: 700;
  color: #262626;
  margin: 0;
}
.sort-options {
  display: flex;
  border-radius: 20px;
  background: #F0F0F0;
  padding: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  margin-bottom: 10px;
}

.sort-option {
  padding: 8px 18px;
  border-radius: 17px;
  cursor: pointer;
  font-family: 'Inter', -apple-system, Roboto, Helvetica, sans-serif;
  font-size: 13px;
  font-weight: 500;
  color: #888;
  white-space: nowrap;
  transition: all 0.2s ease;
}

.sort-option.selected {
  background: #FFF;
  color: #000;
  font-weight: 700;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.sort-option:hover:not(.selected) {
  background-color: #e8e8e8;
  color: #555;
}
.portfolios-section {
  width: 100%;
}
.search-results-header {
  background: #F1F8E9;
  border: 1px solid #C8E6C9;
  color: #2E7D32;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 20px;
}
.search-info { font-size: 16px; font-weight: 600; }
.applied-filters { display: flex; flex-wrap: wrap; gap: 12px; font-size: 13px; margin-top: 8px; }
.filter-group strong { color: #2E7D32; }

.portfolio-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 24px;
}

/* 포트폴리오 카드 */
.portfolio-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(76, 175, 80, 0.08);
  border: 1px solid rgba(76, 175, 80, 0.1);
  transition: all 0.3s ease;
  cursor: pointer;
  display: flex;
  flex-direction: column;
}

.portfolio-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 16px 48px rgba(76, 175, 80, 0.15);
  border-color: rgba(76, 175, 80, 0.2);
}

/* 카드 헤더 */
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 24px;
  border-bottom: 1px solid rgba(76, 175, 80, 0.1);
}

.profile-section {
  display: flex;
  gap: 16px;
  flex: 1;
}

.profile-avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  overflow: hidden;
  border: 3px solid rgba(76, 175, 80, 0.2);
  flex-shrink: 0;
}

.profile-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.profile-info {
  flex: 1;
  min-width: 0;
}

.profile-name {
  font-size: 20px;
  font-weight: 700;
  color: #262626;
  margin: 0 0 6px 0;
  line-height: 1.2;
}

.profile-title {
  font-size: 16px;
  color: #4CAF50;
  font-weight: 600;
  margin: 0 0 12px 0;
  line-height: 1.3;
}

.category-badge {
  display: inline-block;
  padding: 4px 12px;
  background: linear-gradient(135deg, #4CAF50, #66BB6A);
  color: #fff;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.card-actions {
  display: flex;
  align-items: flex-start;
}

.rating-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.rating-stars {
  display: flex;
  gap: 2px;
}

.rating-stars i {
  font-size: 14px;
  color: #FFB400;
}

.rating-text {
  font-size: 12px;
  color: #666;
  font-weight: 600;
}

/* 카드 본문 */
.card-body {
  padding: 24px;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.bio-section {
  margin-bottom: 8px;
}

.bio-text {
  font-size: 14px;
  color: #666;
  line-height: 1.5;
  margin: 0;
}

.stats-section {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.stats-section .stat-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #555;
}

.stats-section .stat-item i {
  color: #4CAF50;
  font-size: 16px;
}

.experience-badge {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  background: rgba(76, 175, 80, 0.1);
  border-radius: 12px;
  font-size: 13px;
  font-weight: 600;
  color: #4CAF50;
  align-self: flex-start;
}

.experience-badge i {
  font-size: 14px;
}

/* 카드 푸터 */
.card-footer {
  padding: 20px 24px;
  background: rgba(76, 175, 80, 0.02);
  border-top: 1px solid rgba(76, 175, 80, 0.1);
}

.action-buttons {
  display: flex;
  justify-content: center;
  width: 100%;
}

.view-btn {
  flex: 1;
  max-width: 200px;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  background: #4CAF50;
  color: #fff;
  border: none;
  box-shadow: 0 2px 8px rgba(76, 175, 80, 0.2);
}

.view-btn:hover {
  background: #66BB6A;
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(76, 175, 80, 0.4);
  scale: 1.05;
}

/* 상태 표시 */
.loading-state, .error-state, .empty-state { text-align: center; padding: 40px; }
.loading-spinner { width: 24px; height: 24px; border: 3px solid #E5E7EB; border-top-color: #4CAF50; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto 12px auto; }
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
  background: #F1F8E9;
  border-color: #C8E6C9;
  color: #2E7D32;
}
.pagination-bar button.active {
  background: #4CAF50;
  color: #fff;
  border-color: #4CAF50;
}
.pagination-bar button:disabled { opacity: 0.5; cursor: default; background: #F3F4F6; }

/* 하트 버튼 스타일 */
.like-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
  border-radius: 50%;
  transition: all 0.2s ease;
  color: #ccc;
  font-size: 18px;
}

.like-btn:hover {
  background: rgba(76, 175, 80, 0.1);
  color: #4CAF50;
}

.like-btn.liked {
  color: #e74c3c;
}

.like-btn.liked:hover {
  color: #c0392b;
}

/* 기술 스택 섹션 */
.skills-section {
  margin-bottom: 16px;
}

.skills-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
  color: #4CAF50;
  font-weight: 600;
  font-size: 14px;
}

.skills-header i {
  font-size: 16px;
}

.skills-title {
  color: #666;
}

.skills-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.skill-tag {
  background: rgba(76, 175, 80, 0.1);
  color: #4CAF50;
  padding: 6px 12px;
  border-radius: 16px;
  font-size: 12px;
  font-weight: 600;
  border: 1px solid rgba(76, 175, 80, 0.2);
  transition: all 0.2s ease;
}

.skill-tag:hover {
  background: rgba(76, 175, 80, 0.15);
  border-color: rgba(76, 175, 80, 0.3);
}

/* 기술 스택 실력 레벨별 색상 */
.skill-tag.skill-level-0 {
  background: rgba(158, 158, 158, 0.1);
  color: #9E9E9E;
  border-color: rgba(158, 158, 158, 0.2);
}

.skill-tag.skill-level-1 {
  background: rgba(244, 67, 54, 0.1);
  color: #F44336;
  border-color: rgba(244, 67, 54, 0.2);
}

.skill-tag.skill-level-2 {
  background: rgba(255, 152, 0, 0.1);
  color: #FF9800;
  border-color: rgba(255, 152, 0, 0.2);
}

.skill-tag.skill-level-3 {
  background: rgba(255, 193, 7, 0.1);
  color: #FFC107;
  border-color: rgba(255, 193, 7, 0.2);
}

.skill-tag.skill-level-4 {
  background: rgba(76, 175, 80, 0.1);
  color: #4CAF50;
  border-color: rgba(76, 175, 80, 0.2);
}

.skill-tag.skill-level-5 {
  background: rgba(33, 150, 243, 0.1);
  color: #2196F3;
  border-color: rgba(33, 150, 243, 0.2);
  font-weight: 600;
  box-shadow: 0 2px 4px rgba(33, 150, 243, 0.2);
}

.skill-level-badge {
  margin-left: 6px;
  font-size: 10px;
  font-weight: 700;
  opacity: 0.8;
}
</style>