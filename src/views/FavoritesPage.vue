<template>
  <div class="favorites-page">
    <!-- 페이지 헤더 -->
    <div class="page-header">
      <div class="header-content">
        <div class="title-section">
          <h1 class="page-title">즐겨찾기</h1>
          <div class="title-underline"></div>
        </div>
        <p class="page-subtitle">관심있는 프로젝트와 포트폴리오를 모아보세요</p>
      </div>
    </div>

    <div class="container">
      <div class="content-wrapper">
        <!-- 탭 메뉴 -->
        <div class="tab-menu">
          <button 
            :class="['tab-button', { 'active': activeTab === 'projects' }]"
            @click="setActiveTab('projects')"
          >
            <i class="bi bi-folder"></i>
            프로젝트 ({{ favoriteProjects.length }})
          </button>
          <button 
            :class="['tab-button', { 'active': activeTab === 'portfolios' }]"
            @click="setActiveTab('portfolios')"
          >
            <i class="bi bi-person-badge"></i>
            포트폴리오 ({{ favoritePortfolios.length }})
          </button>
        </div>

        <!-- 프로젝트 탭 콘텐츠 -->
        <div v-if="activeTab === 'projects'" class="tab-content">
          <div v-if="favoriteProjects.length > 0" class="favorites-grid">
            <div v-for="project in favoriteProjects" :key="project.id" class="favorite-item">
              <div class="item-header">
                <div class="item-info">
                  <h3 class="item-title">{{ project.title }}</h3>
                  <p class="item-description">{{ project.description }}</p>
                </div>
                <button class="remove-favorite" @click="removeFavoriteProject(project.id)">
                  <i class="bi bi-heart-fill"></i>
                </button>
              </div>
              
              <div class="item-tags">
                <span v-for="tag in project.tags" :key="tag" class="tag">{{ tag }}</span>
              </div>
              
              <div class="item-meta">
                <div class="meta-item">
                  <i class="bi bi-clock"></i>
                  <span>{{ project.duration }}</span>
                </div>
                <div class="meta-item">
                  <i class="bi bi-people"></i>
                  <span>{{ project.teamSize }}</span>
                </div>
                <div class="meta-item">
                  <i class="bi bi-calendar-event"></i>
                  <span class="deadline" :class="{ 'urgent': isUrgent(project.deadline) }">
                    {{ project.deadline }}
                  </span>
                </div>
              </div>
              
              <div class="item-actions">
                <button class="view-button">상세보기</button>
                <button class="apply-button">지원하기</button>
              </div>
            </div>
          </div>
          
          <div v-else class="empty-state">
            <div class="empty-icon">
              <i class="bi bi-heart"></i>
            </div>
            <h3 class="empty-title">좋아요한 프로젝트가 없습니다</h3>
            <p class="empty-description">관심있는 프로젝트에 좋아요를 눌러보세요</p>
            <button class="browse-button" @click="goToProjects">
              <i class="bi bi-search"></i>
              프로젝트 둘러보기
            </button>
          </div>
        </div>

        <!-- 포트폴리오 탭 콘텐츠 -->
        <div v-if="activeTab === 'portfolios'" class="tab-content">
          <div v-if="favoritePortfolios.length > 0" class="favorites-grid">
            <div v-for="portfolio in favoritePortfolios" :key="portfolio.id" class="favorite-item portfolio-item">
              <div class="item-header">
                <div class="portfolio-profile">
                  <div class="profile-image">
                    <img :src="portfolio.avatar" :alt="portfolio.name" />
                  </div>
                  <div class="profile-info">
                    <h3 class="profile-name">{{ portfolio.name }}</h3>
                    <p class="profile-job">{{ portfolio.jobTitle }}</p>
                  </div>
                </div>
                <button class="remove-favorite" @click="removeFavoritePortfolio(portfolio.id)">
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
            
              
              <div class="item-actions">
                <button class="view-button">포트폴리오 보기</button>
                <button class="contact-button">연락하기</button>
              </div>
            </div>
          </div>
          
          <div v-else class="empty-state">
            <div class="empty-icon">
              <i class="bi bi-person-heart"></i>
            </div>
            <h3 class="empty-title">좋아요한 포트폴리오가 없습니다</h3>
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
import { ref, reactive } from 'vue'

const activeTab = ref('projects')

// 샘플 데이터
const favoriteProjects = ref([
  {
    id: 1,
    title: 'React 기반 대시보드 구축',
    description: 'React와 TypeScript를 활용한 관리자 대시보드 개발 프로젝트입니다.',
    tags: ['React', 'TypeScript', 'Dashboard'],
    duration: '3개월',
    teamSize: '4명',
    deadline: 'D-5'
  },
  {
    id: 2,
    title: 'AI 챗봇 서비스 개발',
    description: 'OpenAI API를 활용한 고객 상담 챗봇 서비스 구축',
    tags: ['AI', 'Node.js', 'ChatGPT'],
    duration: '6개월',
    teamSize: '6명',
    deadline: 'D-12'
  },
  {
    id: 3,
    title: '모바일 쇼핑몰 앱',
    description: 'Flutter를 이용한 크로스플랫폼 쇼핑몰 애플리케이션',
    tags: ['Flutter', 'Mobile', 'E-commerce'],
    duration: '4개월',
    teamSize: '5명',
    deadline: 'D-20'
  }
])

const favoritePortfolios = ref([
  {
    id: 1,
    name: '김개발',
    jobTitle: 'Frontend Developer',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=1',
    skills: ['React', 'Vue.js', 'TypeScript', 'JavaScript', 'CSS', 'HTML'],
    experience: '3년 경력',
    location: '서울'
  },
  {
    id: 2,
    name: '박디자인',
    jobTitle: 'UI/UX Designer',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=2',
    skills: ['Figma', 'Sketch', 'Adobe XD', 'Prototyping'],
    experience: '5년 경력',
    location: '부산'
  },
  {
    id: 3,
    name: '이백엔드',
    jobTitle: 'Backend Developer',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=3',
    skills: ['Node.js', 'Python', 'Docker', 'AWS', 'MySQL'],
    experience: '4년 경력',
    location: '대구'
  }
])

// 메서드
const setActiveTab = (tab) => {
  activeTab.value = tab
}

const removeFavoriteProject = (projectId) => {
  const index = favoriteProjects.value.findIndex(p => p.id === projectId)
  if (index > -1) {
    favoriteProjects.value.splice(index, 1)
  }
}

const removeFavoritePortfolio = (portfolioId) => {
  const index = favoritePortfolios.value.findIndex(p => p.id === portfolioId)
  if (index > -1) {
    favoritePortfolios.value.splice(index, 1)
  }
}

const isUrgent = (deadline) => {
  if (deadline.includes('D-')) {
    const days = parseInt(deadline.replace('D-', ''))
    return days <= 7
  }
  return false
}

const goToProjects = () => {
  // 프로젝트 목록 페이지로 이동
  console.log('프로젝트 목록으로 이동')
}

const goToPortfolios = () => {
  // 포트폴리오 목록 페이지로 이동
  console.log('포트폴리오 목록으로 이동')
}
</script>

<style scoped>
.favorites-page {
  min-height: 100vh;
  background: #FFF;
  padding-top: 60px;
}

/* 페이지 헤더 */
.page-header {
  width: 100%;
  margin-bottom: 60px;
  text-align: center;
  position: relative;
}

.header-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  position: relative;
  padding: 50px 20px 40px 20px;
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
  color: #262626;
  margin: 0;
  letter-spacing: -1px;
  position: relative;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.title-underline {
  width: 80px;
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
  font-size: 18px;
  color: #808080;
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

.container {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 20px;
}

.content-wrapper {
  width: 100%;
  max-width: 1200px;
  padding: 20px 0 90px 0;
}

/* 탭 메뉴 */
.tab-menu {
  display: flex;
  gap: 8px;
  margin-bottom: 40px;
  padding: 6px;
  background: #F5F5F5;
  border-radius: 12px;
  width: fit-content;
}

.tab-button {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
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
  background: rgba(255, 255, 255, 0.5);
}

.tab-button.active {
  background: #FFF;
  color: #4CAF50;
  font-weight: 600;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.tab-button i {
  font-size: 16px;
}

/* 콘텐츠 */
.tab-content {
  min-height: 400px;
}

.favorites-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 24px;
}

.favorite-item {
  background: #FFF;
  border: 2px solid rgba(76, 175, 80, 0.1);
  border-radius: 12px;
  padding: 24px;
  transition: all 0.3s ease;
  position: relative;
}

.favorite-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #4CAF50 0%, #66BB6A 100%);
  border-radius: 12px 12px 0 0;
}

.favorite-item:hover {
  transform: translateY(-4px);
  border-color: rgba(76, 175, 80, 0.3);
  box-shadow: 0 8px 25px rgba(76, 175, 80, 0.15);
}

.item-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
}

.item-info {
  flex: 1;
}

.item-title {
  font-size: 18px;
  font-weight: 700;
  color: #262626;
  margin: 0 0 8px 0;
  line-height: 1.4;
}

.item-description {
  font-size: 14px;
  color: #666;
  margin: 0;
  line-height: 1.5;
}

.remove-favorite {
  background: none;
  border: none;
  color: #FF5722;
  font-size: 18px;
  cursor: pointer;
  padding: 4px;
  border-radius: 50%;
  transition: all 0.2s ease;
}

.remove-favorite:hover {
  background: rgba(255, 87, 34, 0.1);
  transform: scale(1.1);
}

.item-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 16px;
}

.tag {
  padding: 4px 8px;
  background: #F3F4F6;
  border: 1px solid #D1D5DB;
  border-radius: 12px;
  color: #374151;
  font-size: 12px;
  font-weight: 500;
}

.item-meta {
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

.item-actions {
  display: flex;
  gap: 8px;
}

.view-button, .apply-button, .contact-button {
  flex: 1;
  padding: 10px 16px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.view-button {
  background: #FFF;
  border: 2px solid #E0E0E0;
  color: #424242;
}

.view-button:hover {
  background: #F5F5F5;
  border-color: #BDBDBD;
}

.apply-button, .contact-button {
  background: linear-gradient(135deg, #4CAF50 0%, #66BB6A 100%);
  border: none;
  color: #FFF;
}

.apply-button:hover, .contact-button:hover {
  background: linear-gradient(135deg, #66BB6A 0%, #81C784 100%);
}

/* 포트폴리오 전용 스타일 */
.portfolio-item .item-header {
  align-items: center;
}

.portfolio-profile {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
}

.profile-image {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  overflow: hidden;
  border: 2px solid #E0E0E0;
}

.profile-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.profile-name {
  font-size: 16px;
  font-weight: 700;
  color: #262626;
  margin: 0 0 4px 0;
}

.profile-job {
  font-size: 13px;
  color: #666;
  margin: 0;
}

.portfolio-skills {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 16px;
}

.skill-tag {
  padding: 4px 8px;
  background: rgba(76, 175, 80, 0.1);
  border: 1px solid rgba(76, 175, 80, 0.2);
  border-radius: 12px;
  color: #4CAF50;
  font-size: 11px;
  font-weight: 500;
}

.more-skills {
  padding: 4px 8px;
  background: #F0F0F0;
  border-radius: 12px;
  color: #666;
  font-size: 11px;
  font-weight: 500;
}

.portfolio-meta {
  display: flex;
  gap: 16px;
  margin-bottom: 20px;
}

/* 빈 상태 */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 80px 20px;
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

.browse-button {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  background: linear-gradient(135deg, #4CAF50 0%, #66BB6A 100%);
  color: #FFF;
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
    padding-top: 60px;
  }

  .page-title {
    font-size: 32px;
  }

  .page-subtitle {
    font-size: 16px;
  }

  .favorites-grid {
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

  .item-meta {
    flex-direction: column;
    gap: 8px;
  }

  .item-actions {
    flex-direction: column;
  }
}

@media (max-width: 480px) {
  .favorite-item {
    padding: 16px;
  }

  .item-title {
    font-size: 16px;
  }

  .portfolio-profile {
    gap: 8px;
  }

  .profile-image {
    width: 40px;
    height: 40px;
  }

  .empty-state {
    padding: 60px 20px;
  }

  .empty-icon {
    width: 60px;
    height: 60px;
  }

  .empty-icon i {
    font-size: 28px;
  }

  .empty-title {
    font-size: 20px;
  }

  .empty-description {
    font-size: 14px;
  }
}
</style>