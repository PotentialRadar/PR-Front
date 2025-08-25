<template>
  <div class="favorites-page">
    <div class="container">
      <div class="content-wrapper">
        <!-- 탭 메뉴 -->
        <div class="tab-menu">
          <button 
            :class="['tab-button', { 'active': activeTab === 'projects' }]"
            @click="setActiveTab('projects')"
          >
            <i class="bi bi-folder"></i>
            프로젝트
          </button>
          <button 
            :class="['tab-button', { 'active': activeTab === 'portfolios' }]"
            @click="setActiveTab('portfolios')"
          >
            <i class="bi bi-person-badge"></i>
            포트폴리오
          </button>
        </div>

        <!-- 프로젝트 탭 콘텐츠 -->
        <div v-if="activeTab === 'projects'" class="tab-content">
          <template v-if="favoriteProjects.length > 0">
            <div class="project-list-grid">
              <ProjectCard
                v-for="project in paginatedProjects"
                :key="project.id"
                :project="project"
                @favorite-toggle="handleFavoriteToggle(project.id)"
              />
            </div>
            <pagination-component
              v-if="totalPages > 1"
              :current-page="currentPage"
              :total-pages="totalPages"
              @page-changed="handlePageChange"
            />
          </template>
          
          <div v-else class="empty-state">
            <div class="empty-icon">
              <i class="bi bi-heart"></i>
            </div>
            <h3 class="empty-title">관심 프로젝트가 없습니다</h3>
            <p class="empty-description">마음에 드는 프로젝트에 좋아요를 눌러보세요</p>
            <button class="browse-button" @click="goToProjects">
              <i class="bi bi-search"></i>
              프로젝트 둘러보기
            </button>
          </div>
        </div>

        <!-- 포트폴리오 탭 콘텐츠 (기존과 동일) -->
        <div v-if="activeTab === 'portfolios'" class="tab-content">
          <div v-if="favoritePortfolios.length > 0" class="portfolio-list-grid">
            <div v-for="portfolio in favoritePortfolios" :key="portfolio.userId" class="content-card portfolio-card">
              <div class="card-header">
                <div class="portfolio-profile">
                  <div class="profile-avatar">
                    <img :src="portfolio.userInfo.avatar" :alt="portfolio.userInfo.name" />
                  </div>
                  <div class="profile-details">
                    <h3 class="profile-name">{{ portfolio.userInfo.name }}</h3>
                    <p class="profile-job">{{ portfolio.userInfo.jobTitle }}</p>
                    <div class="profile-category">
                      <i class="bi bi-tag"></i>
                      <span>{{ portfolio.userInfo.category }}</span>
                    </div>
                  </div>
                </div>
                <button class="favorite-btn active" @click="removeFavoritePortfolio(portfolio.userId)">
                  <i class="bi bi-heart-fill"></i>
                </button>
              </div>
              
              <div class="portfolio-skills">
                <span v-for="skill in portfolio.skills.slice(0, 4)" :key="skill" class="skill-tag">
                  {{ skill }}
                </span>
                <span v-if="portfolio.skills.length > 4" class="more-skills">
                  +{{ portfolio.skills.length - 4 }}
                </span>
              </div>

              <div class="portfolio-intro" v-if="portfolio.introduction">
                <p>{{ truncateText(portfolio.introduction, 80) }}</p>
              </div>
              
              <div class="card-actions">
                <button class="action-btn secondary" @click="viewPortfolio(portfolio.userId)">
                  <i class="bi bi-eye"></i>
                  포트폴리오 보기
                </button>
              </div>
            </div>
          </div>
          
          <div v-else class="empty-state">
            <div class="empty-icon">
              <i class="bi bi-person-heart"></i>
            </div>
            <h3 class="empty-title">관심 포트폴리오가 없습니다</h3>
            <p class="empty-description">마음에 드는 포트폴리오에 좋아요를 눌러보세요</p>
            <button class="browse-button" @click="goToPortfolios">
              <i class="bi bi-search"></i>
              포트폴리오 둘러보기
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getLikedProjects, toggleLike } from '@/api/likes.js'
import PaginationComponent from '@/components/projectComponents/PaginationComponent.vue'
import ProjectCard from '@/components/projectComponents/ProjectCard.vue' // ProjectCard 임포트

const router = useRouter()
const activeTab = ref('projects')

const favoriteProjects = ref([])

// --- Pagination State ---
const currentPage = ref(1)
const itemsPerPage = ref(6) // 한 페이지에 6개씩 표시

const totalPages = computed(() => {
  return Math.ceil(favoriteProjects.value.length / itemsPerPage.value)
})

const paginatedProjects = computed(() => {
  const startIndex = (currentPage.value - 1) * itemsPerPage.value
  const endIndex = startIndex + itemsPerPage.value
  return favoriteProjects.value.slice(startIndex, endIndex)
})

const handlePageChange = (page) => {
  currentPage.value = page
  window.scrollTo(0, 0); // 페이지 변경 시 맨 위로 스크롤
}
// ------------------------


// 포트폴리오 데이터베이스 (기존 UI 유지를 위해 남겨둠)
const portfolioDatabase = {
  1: {
    userId: 1,
    userInfo: {
      name: '김프론트',
      jobTitle: 'Frontend Developer',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=frontend1',
      category: 'Frontend'
    },
    introduction: '안녕하세요! 사용자 경험을 최우선으로 생각하는 프론트엔드 개발자 김프론트입니다.',
    skills: ['React', 'TypeScript', 'Next.js', 'Tailwind CSS', 'GraphQL']
  },
  2: {
    userId: 2,
    userInfo: {
      name: '박디자이너',
      jobTitle: 'UI/UX Designer',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=designer1',
      category: 'Design'
    },
    introduction: 'UI/UX 디자이너 박디자이너입니다. 사용자 중심의 디자인 사고를 바탕으로 직관적이고 아름다운 인터페이스를 만들어갑니다.',
    skills: ['Figma', 'Adobe XD', 'Sketch', 'Prototyping', 'User Research']
  },
  // ... (other portfolio data)
}

const favoritePortfolios = ref([])

// 컴포넌트 마운트 시 좋아요 데이터 로드
onMounted(() => {
  loadFavoriteData()
})

// 좋아요 데이터 로드 함수
const loadFavoriteData = async () => {
  try {
    const projects = await getLikedProjects();
    console.log('Liked Projects API Response:', JSON.stringify(projects, null, 2));
    favoriteProjects.value = projects;
  } catch (error) {
    console.error('좋아요 프로젝트 목록을 불러오는 데 실패했습니다:', error)
    favoriteProjects.value = []; // 에러 발생 시 빈 배열로 초기화
  }

  // 포트폴리오 부분은 일단 그대로 둡니다.
  const favoritePortfolioIds = [2, 5, 6] 
  favoritePortfolios.value = favoritePortfolioIds
    .map(id => portfolioDatabase[id])
    .filter(Boolean)
}

const handleFavoriteToggle = async (projectId) => {
  try {
    // 좋아요 토글 API 호출
    await toggleLike('PROJECT', projectId);
    // 목록 새로고침
    await loadFavoriteData();
  } catch (error) {
    console.error(`프로젝트 ${projectId} 좋아요 처리에 실패했습니다:`, error);
    alert('오류가 발생했습니다. 다시 시도해주세요.');
  }
}

const removeFavoritePortfolio = (userId) => {
  const index = favoritePortfolios.value.findIndex(p => p.userId === userId)
  if (index > -1) {
    favoritePortfolios.value.splice(index, 1)
    console.log(`포트폴리오 ${userId} 좋아요 해제`)
  }
}

const truncateText = (text, maxLength) => {
  if (!text) return ''
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength) + '...'
}

// 페이지 이동 함수들
const goToProjects = () => {
  router.push('/projects')
}

const goToPortfolios = () => {
  router.push('/portfolios')
}
</script>

<style scoped>
.favorites-page {
  padding: 20px;
  background: #f8f9fa;
  min-height: calc(100vh - 60px);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
}

.content-wrapper {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

/* 탭 메뉴 */
.tab-menu {
  display: flex;
  gap: 8px;
  padding: 6px;
  background: white;
  border-radius: 12px;
  width: fit-content;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.tab-button {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  border: none;
  border-radius: 8px;
  background: transparent;
  color: #666;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
}

.tab-button:hover {
  color: #333;
  background: #f8f9fa;
}

.tab-button.active {
  background: #4CAF50;
  color: white;
  font-weight: 600;
}

/* 콘텐츠 */
.tab-content {
  min-height: 300px;
}

.project-list-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 20px;
  margin-bottom: 20px;
}

.portfolio-list-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
    gap: 20px;
}

/* 기존 카드 관련 CSS는 ProjectCard.vue로 옮겨졌으므로 대부분 제거 */
/* 포트폴리오 카드 관련 CSS는 유지 */
.content-card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  position: relative;
  border-left: 4px solid transparent;
}

.portfolio-card {
  border-left-color: #2196F3;
}

.content-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
}

.profile-details {
  flex: 1;
}

.profile-name {
  font-size: 18px;
  font-weight: 700;
  color: #262626;
  margin: 0 0 8px 0;
  line-height: 1.4;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.favorite-btn {
  background: none;
  border: none;
  color: #ccc;
  font-size: 20px;
  cursor: pointer;
  padding: 8px;
  border-radius: 50%;
  transition: all 0.2s ease;
}

.favorite-btn.active {
  color: #e91e63;
}

.favorite-btn:hover {
  background: rgba(233, 30, 99, 0.1);
  transform: scale(1.1);
}

.portfolio-profile {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  flex: 1;
}

.profile-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  overflow: hidden;
  border: 2px solid #E0E0E0;
  flex-shrink: 0;
}

.profile-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.profile-job {
  font-size: 14px;
  color: #666;
  margin: 0 0 8px 0;
}

.profile-category {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: #888;
}

.portfolio-skills {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 16px;
}

.skill-tag {
  padding: 4px 8px;
  background: rgba(33, 150, 243, 0.1);
  border: 1px solid rgba(33, 150, 243, 0.2);
  border-radius: 12px;
  color: #2196F3;
  font-size: 11px;
  font-weight: 500;
}

.more-skills {
  padding: 4px 8px;
  background: #f0f0f0;
  border-radius: 12px;
  color: #666;
  font-size: 11px;
  font-weight: 500;
}

.portfolio-intro {
  margin-bottom: 20px;
}

.portfolio-intro p {
  font-size: 13px;
  color: #666;
  line-height: 1.5;
  margin: 0;
}

.card-actions {
  display: flex;
  gap: 8px;
}

.action-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 10px 16px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
}

.action-btn.secondary {
  background: #f8f9fa;
  color: #666;
  border: 2px solid #e9ecef;
}

.action-btn.secondary:hover {
  background: #e9ecef;
  border-color: #dee2e6;
}

/* 빈 상태 */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 60px 20px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
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
  font-size: 20px;
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

.browse-button {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 14px 24px;
  background: linear-gradient(135deg, #4CAF50 0%, #66BB6A 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(76, 175, 80, 0.3);
}

.browse-button:hover {
  background: linear-gradient(135deg, #66BB6A 0%, #81C784 100%);
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(76, 175, 80, 0.4);
}

</style>