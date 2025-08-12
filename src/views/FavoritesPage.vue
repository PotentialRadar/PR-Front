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
          <div v-if="favoriteProjects.length > 0" class="content-grid">
            <div v-for="project in favoriteProjects" :key="project.id" class="content-card project-card">
              <div class="card-header">
                <div class="project-info">
                  <h3 class="project-title">{{ project.title }}</h3>
                  <p class="project-description">{{ project.description }}</p>
                </div>
                <button class="favorite-btn active" @click="removeFavoriteProject(project.id)">
                  <i class="bi bi-heart-fill"></i>
                </button>
              </div>
              
              <div class="project-tags">
                <span v-for="tech in project.techStacks" :key="tech.techStackName" class="tag">
                  {{ tech.techStackName }}
                </span>
              </div>
              
              <div class="project-meta">
                <div class="meta-item">
                  <i class="bi bi-calendar3"></i>
                  <span>{{ formatDuration(project.startDate, project.endDate) }}</span>
                </div>
                <div class="meta-item">
                  <i class="bi bi-people"></i>
                  <span>{{ project.recruitCount }}명 모집</span>
                </div>
                <div class="meta-item">
                  <i class="bi bi-clock"></i>
                  <span class="deadline" :class="{ 'urgent': isUrgent(project.deadline) }">
                    {{ project.deadline }}
                  </span>
                </div>
                <div class="meta-item">
                  <i class="bi bi-eye"></i>
                  <span>조회 {{ project.viewCount }}</span>
                </div>
              </div>
              
              <div class="card-actions">
                <button class="action-btn secondary" @click="viewProjectDetail(project.id)">
                  <i class="bi bi-eye"></i>
                  상세보기
                </button>
              </div>
            </div>
          </div>
          
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

        <!-- 포트폴리오 탭 콘텐츠 -->
        <div v-if="activeTab === 'portfolios'" class="tab-content">
          <div v-if="favoritePortfolios.length > 0" class="content-grid">
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
import { projects } from '@/components/data/projects'

const router = useRouter()
const activeTab = ref('projects')

// 실제 프로젝트 데이터에서 좋아요한 프로젝트들 (isFavorite: true)
const favoriteProjects = ref([])

// 포트폴리오 데이터베이스 (실제로는 API에서 가져와야 함)
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
  3: {
    userId: 3,
    userInfo: {
      name: '이백엔드',
      jobTitle: 'Backend Developer',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=backend1',
      category: 'Backend'
    },
    introduction: '안정적이고 확장 가능한 서버 아키텍처 구축을 전문으로 하는 백엔드 개발자입니다.',
    skills: ['Node.js', 'Python', 'Docker', 'AWS', 'PostgreSQL']
  },
  4: {
    userId: 4,
    userInfo: {
      name: '정모바일',
      jobTitle: 'Mobile Developer',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=mobile1',
      category: 'Mobile'
    },
    introduction: '크로스 플랫폼 모바일 앱 개발을 전문으로 하는 개발자입니다.',
    skills: ['Flutter', 'React Native', 'iOS', 'Android', 'Firebase']
  },
  5: {
    userId: 5,
    userInfo: {
      name: '최AI',
      jobTitle: 'AI/ML Engineer',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ai1',
      category: 'AI/ML'
    },
    introduction: '머신러닝과 딥러닝을 활용한 지능형 시스템 개발을 전문으로 합니다.',
    skills: ['Python', 'TensorFlow', 'PyTorch', 'OpenCV', 'NLP']
  },
  6: {
    userId: 6,
    userInfo: {
      name: '강데브옵스',
      jobTitle: 'DevOps Engineer',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=devops1',
      category: 'DevOps'
    },
    introduction: 'CI/CD 파이프라인 구축과 인프라 자동화를 통해 개발팀의 생산성 향상에 기여하는 데브옵스 엔지니어입니다.',
    skills: ['AWS', 'Docker', 'Kubernetes', 'Jenkins', 'Terraform']
  }
}

// 좋아요한 포트폴리오들 (임시 데이터 - 실제로는 사용자의 좋아요 목록에서 가져와야 함)
const favoritePortfolios = ref([])

// 컴포넌트 마운트 시 좋아요 데이터 로드
onMounted(() => {
  loadFavoriteData()
})

// 좋아요 데이터 로드 함수
const loadFavoriteData = () => {
  // 실제 프로젝트 데이터에서 isFavorite: true인 것들만 필터링
  favoriteProjects.value = projects.filter(project => project.isFavorite)
  
  // 임시로 일부 포트폴리오를 좋아요 목록에 추가 (실제로는 API에서 가져와야 함)
  const favoritePortfolioIds = [2, 5, 6] // 예시 좋아요 목록
  favoritePortfolios.value = favoritePortfolioIds
    .map(id => portfolioDatabase[id])
    .filter(Boolean)
}

// Computed
const recentFavoritesCount = computed(() => {
  const oneWeekAgo = new Date()
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
  
  return favoriteProjects.value.length + favoritePortfolios.value.length
})

const urgentDeadlineCount = computed(() => {
  return favoriteProjects.value.filter(p => isUrgent(p.deadline)).length
})

// Methods
const setActiveTab = (tab) => {
  activeTab.value = tab
}

const removeFavoriteProject = (projectId) => {
  const index = favoriteProjects.value.findIndex(p => p.id === projectId)
  if (index > -1) {
    favoriteProjects.value.splice(index, 1)
    // 실제로는 여기서 API 호출하여 서버에서도 좋아요 해제
    console.log(`프로젝트 ${projectId} 좋아요 해제`)
  }
}

const removeFavoritePortfolio = (userId) => {
  const index = favoritePortfolios.value.findIndex(p => p.userId === userId)
  if (index > -1) {
    favoritePortfolios.value.splice(index, 1)
    // 실제로는 여기서 API 호출하여 서버에서도 좋아요 해제
    console.log(`포트폴리오 ${userId} 좋아요 해제`)
  }
}

const isUrgent = (deadline) => {
  if (deadline && deadline.includes('D-')) {
    const days = parseInt(deadline.replace('D-', ''))
    return days <= 7
  }
  return false
}

const formatDuration = (startDate, endDate) => {
  if (!startDate || !endDate) return '기간 미정'
  
  const start = new Date(startDate)
  const end = new Date(endDate)
  const diffTime = Math.abs(end - start)
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  const diffMonths = Math.round(diffDays / 30)
  
  if (diffMonths >= 1) {
    return `${diffMonths}개월`
  } else {
    return `${diffDays}일`
  }
}

const truncateText = (text, maxLength) => {
  if (!text) return ''
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength) + '...'
}

// 페이지 이동 함수들
const viewProjectDetail = (projectId) => {
  router.push(`/projects/${projectId}`)
}

const viewPortfolio = (userId) => {
  router.push(`/portfolio/${userId}`)
}

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

.tab-button i {
  font-size: 16px;
}

/* 콘텐츠 */
.tab-content {
  min-height: 300px;
}

.content-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 20px;
}

.content-card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  position: relative;
  border-left: 4px solid transparent;
}

.project-card {
  border-left-color: #4CAF50;
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

.project-info,
.profile-details {
  flex: 1;
}

.project-title,
.profile-name {
  font-size: 18px;
  font-weight: 700;
  color: #262626;
  margin: 0 0 8px 0;
  line-height: 1.4;
}

.project-description {
  font-size: 14px;
  color: #666;
  margin: 0;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
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

/* 프로젝트 카드 전용 */
.project-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 16px;
}

.tag {
  padding: 4px 8px;
  background: rgba(76, 175, 80, 0.1);
  border: 1px solid rgba(76, 175, 80, 0.2);
  border-radius: 12px;
  color: #4CAF50;
  font-size: 12px;
  font-weight: 500;
}

.project-meta {
  display: flex;
  gap: 16px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #666;
  font-size: 13px;
}

.meta-item i {
  color: #4CAF50;
  font-size: 14px;
}

.deadline.urgent {
  color: #dc3545;
  font-weight: 600;
}

/* 포트폴리오 카드 전용 */
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

.profile-category i {
  font-size: 11px;
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

/* 카드 액션 */
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

.action-btn.primary {
  background: linear-gradient(135deg, #4CAF50 0%, #66BB6A 100%);
  color: white;
}

.action-btn.primary:hover {
  background: linear-gradient(135deg, #66BB6A 0%, #81C784 100%);
  transform: translateY(-1px);
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

/* 반응형 디자인 */
@media (max-width: 768px) {
  .favorites-page {
    padding: 15px;
  }

  .content-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .tab-menu {
    width: 100%;
    justify-content: center;
  }

  .tab-button {
    flex: 1;
    justify-content: center;
  }

  .project-meta {
    flex-direction: column;
    gap: 8px;
  }

  .card-actions {
    flex-direction: column;
  }
}

@media (max-width: 480px) {
  .favorites-page {
    padding: 10px;
  }

  .content-card {
    padding: 16px;
  }

  .project-title,
  .profile-name {
    font-size: 16px;
  }

  .portfolio-profile {
    gap: 8px;
  }

  .profile-avatar {
    width: 40px;
    height: 40px;
  }

  .empty-state {
    padding: 40px 20px;
  }

  .empty-icon {
    width: 60px;
    height: 60px;
  }

  .empty-icon i {
    font-size: 28px;
  }

  .empty-title {
    font-size: 18px;
  }

  .empty-description {
    font-size: 14px;
  }
}
</style>