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
            <select v-model="sortBy" class="sort-select">
              <option value="recent">최신순</option>
              <option value="name">이름순</option>
              <option value="experience">경력순</option>
            </select>
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
                        <p class="profile-title">{{ portfolio.jobTitle }}</p>
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
                          :class="getSkillType(skill)"
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

import { searchUsers, getPopularKeywords, getUserCountPreview } from '@/api/search'

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

// 필터 옵션 데이터
const techParts = computed(() => techTagStore.techParts)
const popularTechStacks = computed(() => techTagStore.getPopularTechStacksTop20())
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
const sortBy = ref('recent')

// 검색 상태 관리
const currentSearchParams = ref({})
const isSearchMode = ref(false)

const loadTechTags = async () => {
  try {
    await techTagStore.loadTechTags()
  } catch (error) {
    console.error('❌ 기술 태그 로드 실패:', error)
  }
}

const loadPopularKeywords = async () => {
  try {
    const response = await getPopularKeywords()
    popularKeywords.value = response.keywords || []
    console.log('✅ 인기 키워드 로드 성공:', popularKeywords.value)
  } catch (error) {
    console.error('❌ 인기 키워드 로드 실패:', error)
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
    console.log('✅ 기술 태그 및 인기 키워드 로드 완료 (PortfolioListPage)')
    console.log('기술 파트:', techParts.value)
    console.log('기술 스택:', popularTechStacks.value)
    
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
    const finalParams = { ...searchParams, page: page.value - 1, size: 20 }
    const result = await searchUsers(finalParams)
    
    portfolios.value = result.content?.map(user => ({
      id: user.userId,
      name: user.nickname || `User ${user.userId}`,
      jobTitle: user.techPart || '개발자',
      category: user.techPart || 'General',
      skills: user.techStacks || [],
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.userId}`,
      isLiked: false,
      experienceRange: user.experienceRange
    })) || []
    
    totalPages.value = result.totalPages || 1
    console.log('포트폴리오 검색 결과:', result)
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
    console.log('🔄 필터 결과 수 업데이트 시작 (Portfolio)')
    console.log('기술 파트:', techParts.value)
    console.log('기술 스택:', popularTechStacks.value)
    console.log('경력 수준:', experienceRanges.value)

    // 각 기술 파트별 결과 수 계산 - 단독으로 검색
    for (const part of techParts.value) {
      const params = {
        keyword: searchQuery.value.trim() || null,
        techParts: [part]
      }
      try {
        const result = await getUserCountPreview(params)
        filterResultCounts.value[`techPart-${part}`] = result.totalCount
        console.log(`✅ 기술 파트 "${part}" 결과 수: ${result.totalCount}`)
      } catch (error) {
        console.error(`❌ 기술 파트 "${part}" 결과 수 조회 실패:`, error)
        filterResultCounts.value[`techPart-${part}`] = 0
      }
    }

    // 각 기술 스택별 결과 수 계산 - 단독으로 검색
    for (const stack of popularTechStacks.value) {
      const params = {
        keyword: searchQuery.value.trim() || null,
        techStacks: [stack]
      }
      try {
        const result = await getUserCountPreview(params)
        filterResultCounts.value[`techStack-${stack}`] = result.totalCount
        console.log(`✅ 기술 스택 "${stack}" 결과 수: ${result.totalCount}`)
      } catch (error) {
        console.error(`❌ 기술 스택 "${stack}" 결과 수 조회 실패:`, error)
        filterResultCounts.value[`techStack-${stack}`] = 0
      }
    }

    // 각 경력별 결과 수 계산 - 단독으로 검색
    for (const experience of experienceRanges.value) {
      const params = {
        keyword: searchQuery.value.trim() || null,
        experienceRanges: [experience.value]
      }
      try {
        const result = await getUserCountPreview(params)
        filterResultCounts.value[`experience-${experience.value}`] = result.totalCount
        console.log(`✅ 경력 수준 "${experience.label}" 결과 수: ${result.totalCount}`)
      } catch (error) {
        console.error(`❌ 경력 수준 "${experience.label}" 결과 수 조회 실패:`, error)
        filterResultCounts.value[`experience-${experience.value}`] = 0
      }
    }

    console.log('✅ 필터 결과 수 업데이트 완료 (Portfolio):', filterResultCounts.value)
  } catch (error) {
    console.error('❌ 필터 결과 수 업데이트 실패 (Portfolio):', error)
  }
}

// 각 필터의 결과 수 가져오기
const getFilterResultCount = (type, value) => {
  return filterResultCounts.value[`${type}-${value}`] || 0
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
  console.log(`🔄 기술 파트 토글: "${part}"`)
  toggleItem(selectedTechParts, part)
}

const toggleTechStack = (stack) => {
  console.log(`🔄 기술 스택 토글: "${stack}"`)
  toggleItem(selectedTechStacks, stack)
}

const toggleExperience = (experience) => {
  console.log(`🔄 경력 수준 토글: "${experience}"`)
  console.log('현재 선택된 경력:', selectedExperiences.value)
  toggleItem(selectedExperiences, experience)
  console.log('토글 후 선택된 경력:', selectedExperiences.value)
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

const getSkillType = (skill) => {
  const frontendSkills = ['React', 'Vue.js', 'Angular', 'JavaScript', 'TypeScript', 'Next.js', 'Nuxt.js', 'Tailwind CSS']
  const backendSkills = ['Node.js', 'Python', 'Java', 'PHP', 'C#', 'Go', 'Ruby', 'PostgreSQL', 'MongoDB']
  const designSkills = ['Figma', 'Adobe XD', 'Sketch', 'Photoshop', 'Illustrator', 'Prototyping', 'User Research']
  const cloudSkills = ['AWS', 'Azure', 'GCP', 'Docker', 'Kubernetes', 'Jenkins', 'Terraform']
  const mobileSkills = ['Flutter', 'React Native', 'iOS', 'Android', 'Firebase', 'Swift']
  const aiSkills = ['TensorFlow', 'PyTorch', 'OpenCV', 'NLP', 'Machine Learning', 'Deep Learning']

  if (frontendSkills.includes(skill)) return 'frontend'
  if (backendSkills.includes(skill)) return 'backend'
  if (designSkills.includes(skill)) return 'design'
  if (cloudSkills.includes(skill)) return 'cloud'
  if (mobileSkills.includes(skill)) return 'mobile'
  if (aiSkills.includes(skill)) return 'ai'
  return 'general'
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
.sort-select {
  padding: 8px 16px;
  border: 2px solid rgba(76, 175, 80, 0.2);
  border-radius: 8px;
  font-size: 14px;
  background: #fff;
  color: #4CAF50;
  cursor: pointer;
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

.like-btn {
  background: none;
  border: 2px solid rgba(76, 175, 80, 0.2);
  color: #4CAF50;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 16px;
}

.like-btn:hover {
  background: rgba(76, 175, 80, 0.1);
  border-color: #4CAF50;
}

.like-btn.liked {
  background: #FF5722;
  border-color: #FF5722;
  color: #fff;
}

/* 카드 본문 */
.card-body {
  padding: 24px;
  flex: 1;
}

.skills-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.skills-header {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #4CAF50;
  font-size: 14px;
  font-weight: 600;
}

.skills-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.skill-tag {
  padding: 6px 12px;
  border-radius: 16px;
  font-size: 12px;
  font-weight: 500;
  border: 1px solid;
  transition: all 0.2s ease;
}

.skill-tag.frontend {
  background: rgba(33, 150, 243, 0.1);
  color: #2196F3;
  border-color: rgba(33, 150, 243, 0.2);
}

.skill-tag.backend {
  background: rgba(76, 175, 80, 0.1);
  color: #4CAF50;
  border-color: rgba(76, 175, 80, 0.2);
}

.skill-tag.design {
  background: rgba(233, 30, 99, 0.1);
  color: #E91E63;
  border-color: rgba(233, 30, 99, 0.2);
}

.skill-tag.cloud {
  background: rgba(255, 152, 0, 0.1);
  color: #FF9800;
  border-color: rgba(255, 152, 0, 0.2);
}

.skill-tag.mobile {
  background: rgba(156, 39, 176, 0.1);
  color: #9C27B0;
  border-color: rgba(156, 39, 176, 0.2);
}

.skill-tag.ai {
  background: rgba(255, 87, 34, 0.1);
  color: #FF5722;
  border-color: rgba(255, 87, 34, 0.2);
}

.skill-tag.general {
  background: rgba(158, 158, 158, 0.1);
  color: #9E9E9E;
  border-color: rgba(158, 158, 158, 0.2);
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
</style>