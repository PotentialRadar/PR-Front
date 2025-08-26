<template>
  <div class="portfolio-list">
    <div class="background-gradient"></div>
    <div class="floating-shapes">
      <div class="shape shape-1"></div>
      <div class="shape shape-2"></div>
      <div class="shape shape-3"></div>
      <div class="shape shape-4"></div>
    </div>
    
    <!-- 페이지 헤더 -->
    <PageHeader 
      title="포트폴리오 갤러리"
      subtitle="다양한 분야의 크리에이터들과 만나보세요"
      :showStats="true"
      :stats="[
        { number: totalPortfolios + '+', label: '포트폴리오' },
        { number: (categories.length - 1).toString(), label: '기술 분야' },
        { number: currentPageItems.toString(), label: '활성 개발자' }
      ]"
    />

    <div class="container">
      <div class="content-wrapper">
        <!-- 검색 섹션 -->
        <EnhancedSearchSection type="portfolio" @perform-search="handleSearch" />
        
        <!-- 필터 섹션 -->
        <div class="filters-section">
          <div class="filters-card">
            <div class="filter-group">
              <label class="filter-label">분야별 검색</label>
              <div class="category-filters">
                <button 
                  v-for="category in categories" 
                  :key="category"
                  :class="['category-btn', { 'active': selectedCategory === category }]"
                  @click="setCategory(category)"
                >
                  {{ category }}
                </button>
              </div>
            </div>
            
            <div class="filter-group">
              <label class="filter-label">경력 필터</label>
              <div class="experience-filters">
                <button 
                  v-for="experience in experienceOptions" 
                  :key="experience.value"
                  :class="['experience-btn', { 'active': selectedExperience === experience.value }]"
                  @click="setExperience(experience.value)"
                >
                  {{ experience.label }}
                </button>
              </div>
            </div>
            
            <div class="filter-group">
              <label class="filter-label">검색</label>
              <div class="search-box">
                <i class="bi bi-search"></i>
                <input 
                  v-model="searchQuery" 
                  type="text" 
                  placeholder="이름이나 기술스택으로 검색..."
                  class="search-input"
                  @keyup.enter="searchPortfolios"
                />
                <button v-if="searchQuery" @click="clearSearch" class="clear-btn">
                  <i class="bi bi-x"></i>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- 포트폴리오 섹션 -->
        <div class="portfolios-section">
          <div class="section-header">
            <h2 class="section-title">
              {{ totalPortfolios || portfolios.length }}개의 포트폴리오
            </h2>
            <div class="sort-options">
              <select v-model="sortBy" @change="loadPortfolios" class="sort-select">
                <option value="reputation">평점순</option>
                <option value="reviewCount">리뷰수 많은순</option>
                <option value="recent">최신 가입순</option>
              </select>
            </div>
          </div>
          
          <!-- 포트폴리오 그리드 -->
          <div v-if="!loading && portfolios.length > 0" class="portfolios-grid">
            <div 
              v-for="portfolio in portfolios" 
              :key="portfolio.userId || portfolio.id"
              class="portfolio-card"
              @click="viewPortfolio(portfolio.userId)"
            >
              <!-- 카드 헤더 -->
              <div class="card-header">
                <div class="profile-section">
                  <div class="profile-avatar">
                    <img 
                      :src="portfolio.profileImage || '/pr-logo.png'" 
                      :alt="portfolio.nickname"
                      @error="handleImageError($event)"
                    />
                  </div>
                  <div class="profile-info">
                    <h3 class="profile-name">{{ portfolio.nickname }}</h3>
                    <p class="profile-title">{{ portfolio.jobTitle || '개발자' }}</p>
                    <div class="category-badge" v-if="portfolio.techPartName">
                      {{ portfolio.techPartName }}
                    </div>
                  </div>
                </div>
                <div class="card-actions">
                  <div class="rating-section" v-if="portfolio.reputationScore > 0">
                    <div class="rating-stars">
                      <i 
                        v-for="star in 5" 
                        :key="star"
                        :class="['bi', star <= portfolio.reputationScore ? 'bi-star-fill' : 'bi-star']"
                      ></i>
                    </div>
                    <span class="rating-text">{{ portfolio.reputationScore.toFixed(1) }}</span>
                  </div>
                </div>
              </div>

              <!-- 카드 본문 -->
              <div class="card-body">
                <!-- 자기소개 -->
                <div class="bio-section" v-if="portfolio.bio">
                  <p class="bio-text">{{ truncateText(portfolio.bio, 100) }}</p>
                </div>
                
                <!-- 통계 섹션 -->
                <div class="stats-section">
                  <div class="stat-item">
                    <i class="bi bi-folder2"></i>
                    <span>프로젝트 {{ portfolio.projectCount }}개</span>
                  </div>
                  <div class="stat-item">
                    <i class="bi bi-gear"></i>
                    <span>기술스택 {{ portfolio.techStackCount }}개</span>
                  </div>
                  <div class="stat-item" v-if="portfolio.reviewCount > 0">
                    <i class="bi bi-chat-dots"></i>
                    <span>리뷰 {{ portfolio.reviewCount }}개</span>
                  </div>
                </div>
                
                <!-- 경력 배지 -->
                <div class="experience-badge" v-if="portfolio.experienceRange">
                  <i class="bi bi-award"></i>
                  <span>{{ getExperienceText(portfolio.experienceRange) }}</span>
                </div>
              </div>

              <!-- 카드 푸터 -->
              <div class="card-footer">
                <div class="action-buttons">
                  <button class="view-btn">
                    <i class="bi bi-eye"></i>
                    포트폴리오 보기
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          <div v-else-if="!loading && portfolios.length === 0" class="empty-state">
            <div class="empty-icon">
              <i class="bi bi-search"></i>
            </div>
            <h3 class="empty-title">검색 결과가 없습니다</h3>
            <p class="empty-description">다른 검색 조건을 시도해보세요</p>
            <button class="reset-filters-btn" @click="resetFilters">
              <i class="bi bi-arrow-clockwise"></i>
              필터 초기화
            </button>
          </div>
          
          <!-- 페이징 -->
          <div v-if="totalPages > 1" class="pagination-section">
            <div class="pagination">
              <button 
                :disabled="currentPage === 0 || currentPage === 1" 
                @click="goToPage(currentPage - 1)"
                class="pagination-btn prev-btn"
              >
                <i class="bi bi-chevron-left"></i>
                이전
              </button>
              
              <div class="pagination-numbers">
                <button
                  v-for="page in visiblePages"
                  :key="page"
                  :class="['pagination-number', { 'active': page === currentPage }]"
                  @click="goToPage(page)"
                >
                  {{ page }}
                </button>
              </div>
              
              <button 
                :disabled="currentPage >= totalPages" 
                @click="goToPage(currentPage + 1)"
                class="pagination-btn next-btn"
              >
                다음
                <i class="bi bi-chevron-right"></i>
              </button>
            </div>
            
            <div class="pagination-info">
              {{ currentPage }} / {{ totalPages }} 페이지 (총 {{ totalPortfolios || portfolios.length }}개)
            </div>
          </div>
          
          <!-- 로딩 상태 -->
          <div v-if="loading" class="loading-state">
            <div class="loading-spinner"></div>
            <p>포트폴리오를 검색하는 중...</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import PageHeader from '@/components/common/PageHeader.vue'
import EnhancedSearchSection from '@/components/projectComponents/EnhancedSearchSection.vue'
import { portfolioApi } from '@/api/portfolio.js'
import { searchUsers } from '@/api/search'
import { 
  getOverallStats
} from '@/components/data/portfolioData.js'

const router = useRouter()

// 반응형 데이터
const portfolios = ref([])
const loading = ref(false)
const error = ref(null)
const selectedCategory = ref('전체')
const selectedExperience = ref('')
const searchQuery = ref('')
const sortBy = ref('reputation')
const currentPage = ref(1)
const totalPages = ref(1)
const totalPortfolios = ref(0)
const pageSize = ref(12)

// 검색 상태
const currentSearchParams = ref({})
const isSearchMode = ref(false)

// 카테고리 및 옵션 데이터
const categories = ['전체', 'FRONTEND', 'BACKEND', 'DEVOPS', 'DESIGN']
const experienceOptions = [
  { value: '', label: '전체' },
  { value: 'FRESHER', label: '신입' },
  { value: 'JUNIOR', label: '주니어' },
  { value: 'INTERMEDIATE', label: '미드레벨' },
  { value: 'SENIOR', label: '시니어' },
  { value: 'EXPERT', label: '전문가' }
]

// 데이터 로드
const overallStats = getOverallStats()

// 계산된 속성들
const currentPageItems = computed(() => portfolios.value.length)

const visiblePages = computed(() => {
  const pages = []
  const start = Math.max(1, currentPage.value - 2)
  const end = Math.min(totalPages.value, currentPage.value + 3)
  
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  return pages
})

// 메서드들
const loadPortfolios = async () => {
  loading.value = true
  try {
    if (portfolioApi && portfolioApi.getPublicPortfolios) {
      // 기존 API 사용
      const params = {
        page: currentPage.value - 1,
        size: pageSize.value,
        sortBy: sortBy.value
      }
      
      if (selectedCategory.value && selectedCategory.value !== '전체') {
        params.techPart = selectedCategory.value
      }
      
      if (selectedExperience.value) {
        params.experienceRange = selectedExperience.value
      }
      
      if (searchQuery.value.trim()) {
        params.keyword = searchQuery.value.trim()
      }
      
      const response = await portfolioApi.getPublicPortfolios(params)
      const data = response.data
      
      portfolios.value = data.portfolios
      totalPages.value = data.totalPages
      totalPortfolios.value = data.totalElements
    } else {
      // 대체 API 사용
      await loadInitialData()
    }
  } catch (error) {
    console.error('포트폴리오 목록 조회 실패:', error)
    await loadInitialData() // fallback
  } finally {
    loading.value = false
  }
}

// 초기 데이터 로드 함수
const loadInitialData = async () => {
  loading.value = true
  try {
    const result = await searchUsers({
      page: currentPage.value - 1,
      size: pageSize.value
    })
    
    portfolios.value = result.content?.map(user => ({
      userId: user.userId,
      id: user.userId,
      nickname: user.nickname || `User ${user.userId}`,
      name: user.nickname || `User ${user.userId}`,
      jobTitle: user.techParts?.join(', ') || '개발자',
      techPartName: user.techParts?.[0] || 'General',
      category: user.techParts?.[0] || 'General',
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
    totalPortfolios.value = result.totalElements || result.content?.length || 0
    console.log('포트폴리오 데이터 로드 완료:', portfolios.value)
  } catch (error) {
    console.error('포트폴리오 로드 실패:', error)
    error.value = '포트폴리오를 불러오는 중 오류가 발생했습니다.'
    portfolios.value = []
  } finally {
    loading.value = false
  }
}

const setCategory = (category) => {
  selectedCategory.value = category
  currentPage.value = 1
  loadPortfolios()
}

const setExperience = (experience) => {
  selectedExperience.value = experience
  currentPage.value = 1
  loadPortfolios()
}

const searchPortfolios = () => {
  currentPage.value = 1
  loadPortfolios()
}

const clearSearch = () => {
  searchQuery.value = ''
  searchPortfolios()
}

// 검색 처리
const handleSearch = async (searchParams) => {
  currentSearchParams.value = searchParams
  isSearchMode.value = Object.values(searchParams).some(value => value !== null && value !== undefined)
  currentPage.value = 1
  
  if (isSearchMode.value) {
    await performSearch(searchParams)
  } else {
    // 필터가 모두 제거된 경우 초기 데이터 로드
    await loadInitialData()
  }
}

const performSearch = async (searchParams) => {
  loading.value = true
  try {
    const result = await searchUsers({
      ...searchParams,
      page: currentPage.value - 1, // API는 0부터 시작
      size: pageSize.value
    })
    
    portfolios.value = result.content?.map(user => ({
      userId: user.userId,
      id: user.userId,
      nickname: user.nickname || `User ${user.userId}`,
      name: user.nickname || `User ${user.userId}`,
      jobTitle: user.techParts?.join(', ') || '개발자',
      techPartName: user.techParts?.[0] || 'General',
      category: user.techParts?.[0] || 'General',
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
    totalPortfolios.value = result.totalElements || result.content?.length || 0
    console.log('검색 결과:', result)
  } catch (error) {
    console.error('검색 실패:', error)
    error.value = '검색 중 오류가 발생했습니다.'
    portfolios.value = []
  } finally {
    loading.value = false
  }
}

const resetFilters = () => {
  selectedCategory.value = '전체'
  selectedExperience.value = ''
  searchQuery.value = ''
  currentSearchParams.value = {}
  isSearchMode.value = false
  currentPage.value = 1
  loadInitialData()
}

const goToPage = (page) => {
  currentPage.value = page
  if (isSearchMode.value) {
    performSearch(currentSearchParams.value)
  } else {
    loadPortfolios()
  }
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const viewPortfolio = (userId) => {
  router.push(`/portfolio/${userId}`)
}

const getExperienceText = (experienceRange) => {
  const option = experienceOptions.find(opt => opt.value === experienceRange)
  return option ? option.label : experienceRange
}

const truncateText = (text, maxLength) => {
  if (!text) return ''
  return text.length > maxLength ? text.substring(0, maxLength) + '...' : text
}

const handleImageError = (event) => {
  event.target.src = '/pr-logo.png'
}

// 생명주기 및 감시자
onMounted(async () => {
  await loadPortfolios()
})

// sortBy 변경 감시
watch(sortBy, () => {
  currentPage.value = 1
  if (isSearchMode.value) {
    performSearch(currentSearchParams.value)
  } else {
    loadPortfolios()
  }
})
</script>

<style scoped>
.portfolio-list {
  min-height: 100vh;
  padding-top: 68px;
  background: linear-gradient(135deg, #f8fffe 0%, #f0f9ff 50%, #ecfdf5 100%);
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
  animation: float 8s ease-in-out infinite;
}

.shape-1 {
  width: 100px;
  height: 100px;
  top: 10%;
  right: 10%;
  animation-delay: 0s;
}

.shape-2 {
  width: 60px;
  height: 60px;
  top: 70%;
  left: 5%;
  animation-delay: 2s;
}

.shape-3 {
  width: 80px;
  height: 80px;
  top: 40%;
  right: 5%;
  animation-delay: 4s;
}

.shape-4 {
  width: 120px;
  height: 120px;
  top: 20%;
  left: 15%;
  animation-delay: 6s;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0px) rotate(0deg);
    opacity: 0.3;
  }
  50% {
    transform: translateY(-30px) rotate(180deg);
    opacity: 0.1;
  }
}

/* 페이지 헤더 */
.page-header {
  width: 100%;
  margin-bottom: 60px;
  text-align: center;
  position: relative;
  z-index: 1;
}

.header-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 30px;
  padding: 80px 20px 40px 20px;
}

.title-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.page-title {
  font-size: 42px;
  font-weight: 900;
  color: #262626;
  margin: 0;
  letter-spacing: -1px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.title-underline {
  width: 100px;
  height: 4px;
  background: linear-gradient(90deg, #4CAF50 0%, #66BB6A 100%);
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
  font-size: 20px;
  color: #666;
  margin: 0;
  font-weight: 400;
  opacity: 0;
  animation: fadeInUp 0.8s ease-out 0.3s forwards;
}

.stats-section {
  display: flex;
  align-items: center;
  gap: 40px;
  margin-top: 20px;
  opacity: 0;
  animation: fadeInUp 0.8s ease-out 0.5s forwards;
}

.stat-item {
  text-align: center;
}

.stat-number {
  font-size: 28px;
  font-weight: 800;
  color: #4CAF50;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 14px;
  color: #666;
  font-weight: 500;
}

.stat-divider {
  width: 1px;
  height: 40px;
  background: rgba(76, 175, 80, 0.2);
}

@keyframes expandLine {
  0% { width: 0; }
  100% { width: 100px; }
}

@keyframes pulse {
  0% { box-shadow: 0 0 0 0 rgba(76, 175, 80, 0.7); }
  70% { box-shadow: 0 0 0 8px rgba(76, 175, 80, 0); }
  100% { box-shadow: 0 0 0 0 rgba(76, 175, 80, 0); }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.container {
  width: 100%;
  display: flex;
  justify-content: center;
  position: relative;
  z-index: 1;
}

.content-wrapper {
  width: 100%;
  max-width: 1400px;
  padding: 0 20px 80px;
  display: flex;
  flex-direction: column;
  gap: 40px;
}

/* 필터 섹션 */
.filters-section {
  width: 100%;
}

.filters-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  padding: 30px;
  box-shadow: 0 10px 40px rgba(76, 175, 80, 0.1);
  border: 1px solid rgba(76, 175, 80, 0.1);
  display: flex;
  flex-direction: column;
  gap: 25px;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.filter-label {
  font-size: 14px;
  font-weight: 600;
  color: #4CAF50;
  margin-bottom: 4px;
}

.category-filters, .experience-filters {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.category-btn, .experience-btn {
  padding: 8px 16px;
  border: 2px solid rgba(76, 175, 80, 0.2);
  border-radius: 20px;
  background: #fff;
  color: #4CAF50;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.category-btn:hover, .experience-btn:hover {
  border-color: #4CAF50;
  background: rgba(76, 175, 80, 0.05);
}

.category-btn.active, .experience-btn.active {
  background: #4CAF50;
  color: #fff;
  border-color: #4CAF50;
}

.search-box {
  position: relative;
  display: flex;
  align-items: center;
  max-width: 400px;
}

.search-box i {
  position: absolute;
  left: 16px;
  color: #4CAF50;
  font-size: 16px;
}

.search-input {
  width: 100%;
  padding: 12px 16px 12px 48px;
  border: 2px solid rgba(76, 175, 80, 0.2);
  border-radius: 12px;
  font-size: 14px;
  outline: none;
  transition: border-color 0.3s ease;
}

.search-input:focus {
  border-color: #4CAF50;
}

.clear-btn {
  position: absolute;
  right: 8px;
  background: none;
  border: none;
  color: #999;
  cursor: pointer;
  padding: 8px;
  border-radius: 50%;
  transition: all 0.2s ease;
}

.clear-btn:hover {
  background: rgba(76, 175, 80, 0.1);
  color: #4CAF50;
}

/* 포트폴리오 섹션 */
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
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

/* 로딩 상태 */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
  text-align: center;
  color: #4CAF50;
}

.loading-spinner {
  width: 50px;
  height: 50px;
  border: 4px solid rgba(76, 175, 80, 0.1);
  border-left: 4px solid #4CAF50;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 20px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.portfolios-grid {
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
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(76, 175, 80, 0.3);
}

/* 페이징 섹션 */
.pagination-section {
  margin-top: 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.pagination {
  display: flex;
  align-items: center;
  gap: 12px;
}

.pagination-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 16px;
  border: 2px solid rgba(76, 175, 80, 0.2);
  background: #fff;
  color: #4CAF50;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.pagination-btn:hover:not(:disabled) {
  border-color: #4CAF50;
  background: rgba(76, 175, 80, 0.05);
}

.pagination-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.pagination-numbers {
  display: flex;
  gap: 4px;
}

.pagination-number {
  width: 40px;
  height: 40px;
  border: 2px solid rgba(76, 175, 80, 0.2);
  background: #fff;
  color: #4CAF50;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.pagination-number:hover {
  border-color: #4CAF50;
  background: rgba(76, 175, 80, 0.05);
}

.pagination-number.active {
  background: #4CAF50;
  color: #fff;
  border-color: #4CAF50;
}

.pagination-info {
  font-size: 14px;
  color: #666;
  text-align: center;
}

/* 빈 상태 */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 80px 20px;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  border: 1px solid rgba(76, 175, 80, 0.1);
}

.empty-icon {
  width: 80px;
  height: 80px;
  background: rgba(76, 175, 80, 0.1);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 24px;
}

.empty-icon i {
  font-size: 36px;
  color: #4CAF50;
}

.empty-title {
  font-size: 24px;
  font-weight: 700;
  color: #262626;
  margin: 0 0 12px 0;
}

.empty-description {
  font-size: 16px;
  color: #666;
  margin: 0 0 32px 0;
  max-width: 400px;
  line-height: 1.5;
}

.reset-filters-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  background: linear-gradient(135deg, #4CAF50 0%, #66BB6A 100%);
  color: #fff;
  border: none;
  border-radius: 25px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(76, 175, 80, 0.3);
}

.reset-filters-btn:hover {
  background: linear-gradient(135deg, #66BB6A 0%, #81C784 100%);
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(76, 175, 80, 0.4);
}

/* 로딩 상태 */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
  text-align: center;
}

.loading-spinner {
  width: 50px;
  height: 50px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #4CAF50;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 20px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-state p {
  color: #666;
  font-size: 16px;
  margin: 0;
}

/* 반응형 디자인 */
@media (max-width: 1200px) {
  .portfolios-grid {
    grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  }
}

@media (max-width: 768px) {
  .page-title {
    font-size: 36px;
  }

  .page-subtitle {
    font-size: 18px;
  }

  .stats-section {
    flex-direction: column;
    gap: 20px;
  }

  .stat-divider {
    width: 60px;
    height: 1px;
  }

  .filters-card {
    padding: 20px;
    gap: 20px;
  }

  .section-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }

  .portfolios-grid {
    grid-template-columns: 1fr;
    gap: 20px;
  }

  .pagination {
    flex-wrap: wrap;
    justify-content: center;
  }

  .pagination-numbers {
    order: -1;
    margin-bottom: 8px;
  }
}

@media (max-width: 480px) {
  .header-content {
    padding: 60px 15px 30px 15px;
  }

  .page-title {
    font-size: 28px;
  }

  .page-subtitle {
    font-size: 16px;
  }

  .filters-card {
    padding: 16px;
    gap: 16px;
  }

  .category-filters, .experience-filters {
    gap: 6px;
  }

  .category-btn, .experience-btn {
    padding: 6px 12px;
    font-size: 13px;
  }

  .search-input {
    padding: 10px 14px 10px 40px;
    font-size: 13px;
  }

  .search-box i {
    left: 14px;
    font-size: 14px;
  }
}

/* 로딩 애니메이션 */
.portfolio-card {
  animation: cardAppear 0.6s ease-out forwards;
  opacity: 0;
  transform: translateY(20px);
}

.portfolio-card:nth-child(1) { animation-delay: 0.1s; }
.portfolio-card:nth-child(2) { animation-delay: 0.2s; }
.portfolio-card:nth-child(3) { animation-delay: 0.3s; }
.portfolio-card:nth-child(4) { animation-delay: 0.4s; }
.portfolio-card:nth-child(5) { animation-delay: 0.5s; }
.portfolio-card:nth-child(6) { animation-delay: 0.6s; }

@keyframes cardAppear {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>