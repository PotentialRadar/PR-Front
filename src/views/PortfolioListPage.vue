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
    <div class="page-header">
      <div class="header-content">
        <div class="title-section">
          <h1 class="page-title">포트폴리오 갤러리</h1>
          <div class="title-underline"></div>
        </div>
        <p class="page-subtitle">다양한 분야의 크리에이터들과 만나보세요</p>
        
        <div class="stats-section">
          <div class="stat-item">
            <div class="stat-number">{{ portfolios.length }}+</div>
            <div class="stat-label">포트폴리오</div>
          </div>
          <div class="stat-divider"></div>
          <div class="stat-item">
            <div class="stat-number">{{ uniqueSkills.length }}+</div>
            <div class="stat-label">스킬 카테고리</div>
          </div>
          <div class="stat-divider"></div>
          <div class="stat-item">
            <div class="stat-number">{{ portfolios.length }}</div>
            <div class="stat-label">활성 크리에이터</div>
          </div>
        </div>
      </div>
    </div>

    <div class="container">
      <div class="content-wrapper">
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
              <label class="filter-label">스킬 필터</label>
              <div class="skill-filters">
                <button 
                  v-for="skill in popularSkills" 
                  :key="skill"
                  :class="['skill-btn', { 'active': selectedSkills.includes(skill) }]"
                  @click="toggleSkill(skill)"
                >
                  {{ skill }}
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
                  placeholder="이름이나 스킬로 검색..."
                  class="search-input"
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
              {{ filteredPortfolios.length }}개의 포트폴리오
            </h2>
            <div class="sort-options">
              <select v-model="sortBy" class="sort-select">
                <option value="recent">최신순</option>
                <option value="name">이름순</option>
              </select>
            </div>
          </div>
          
          <div v-if="filteredPortfolios.length > 0" class="portfolios-grid">
            <div 
              v-for="portfolio in sortedPortfolios" 
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
          </div>
          
          <div v-else class="empty-state">
            <div class="empty-icon">
              <i class="bi bi-search"></i>
            </div>
            <h3 class="empty-title">검색 결과가 없습니다</h3>
            <p class="empty-description">다른 키워드로 검색해보세요</p>
            <button class="reset-filters-btn" @click="resetFilters">
              <i class="bi bi-arrow-clockwise"></i>
              필터 초기화
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

// 반응형 데이터
const selectedCategory = ref('전체')
const selectedSkills = ref([])
const searchQuery = ref('')
const sortBy = ref('recent')

// 카테고리 데이터
const categories = ['전체', 'Frontend', 'Backend', 'Design', 'Mobile', 'AI/ML', 'DevOps']
const popularSkills = ['React', 'Vue.js', 'Node.js', 'Python', 'Figma', 'TypeScript', 'AWS', 'Flutter']

// 포트폴리오 샘플 데이터 (단순화된 정보만 포함)
const portfolios = ref([
  {
    id: 1,
    name: '김프론트',
    jobTitle: 'Frontend Developer',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=1',
    skills: ['React', 'TypeScript', 'Next.js', 'Tailwind CSS', 'GraphQL'],
    category: 'Frontend',
    isLiked: false
  },
  {
    id: 2,
    name: '박디자이너',
    jobTitle: 'UI/UX Designer',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=2',
    skills: ['Figma', 'Adobe XD', 'Sketch', 'Prototyping', 'User Research'],
    category: 'Design',
    isLiked: false
  },
  {
    id: 3,
    name: '이백엔드',
    jobTitle: 'Backend Developer',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=3',
    skills: ['Node.js', 'Python', 'Docker', 'AWS', 'PostgreSQL'],
    category: 'Backend',
    isLiked: false
  },
  {
    id: 4,
    name: '정모바일',
    jobTitle: 'Mobile Developer',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=4',
    skills: ['Flutter', 'React Native', 'iOS', 'Android', 'Firebase'],
    category: 'Mobile',
    isLiked: false
  },
  {
    id: 5,
    name: '최AI',
    jobTitle: 'AI/ML Engineer',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=5',
    skills: ['Python', 'TensorFlow', 'PyTorch', 'OpenCV', 'NLP'],
    category: 'AI/ML',
    isLiked: false
  },
  {
    id: 6,
    name: '강데브옵스',
    jobTitle: 'DevOps Engineer',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=6',
    skills: ['AWS', 'Docker', 'Kubernetes', 'Jenkins', 'Terraform'],
    category: 'DevOps',
    isLiked: false
  }
])

// 계산된 속성들
const uniqueSkills = computed(() => {
  const allSkills = portfolios.value.flatMap(p => p.skills)
  return [...new Set(allSkills)]
})

const filteredPortfolios = computed(() => {
  let filtered = portfolios.value

  // 카테고리 필터
  if (selectedCategory.value !== '전체') {
    filtered = filtered.filter(p => p.category === selectedCategory.value)
  }

  // 스킬 필터
  if (selectedSkills.value.length > 0) {
    filtered = filtered.filter(p => 
      selectedSkills.value.some(skill => p.skills.includes(skill))
    )
  }

  // 검색 필터
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(p => 
      p.name.toLowerCase().includes(query) ||
      p.jobTitle.toLowerCase().includes(query) ||
      p.skills.some(skill => skill.toLowerCase().includes(query))
    )
  }

  return filtered
})

const sortedPortfolios = computed(() => {
  const sorted = [...filteredPortfolios.value]
  
  switch (sortBy.value) {
    case 'name':
      return sorted.sort((a, b) => a.name.localeCompare(b.name))
    default: // recent
      return sorted.sort((a, b) => b.id - a.id)
  }
})

// 메서드들
const setCategory = (category) => {
  selectedCategory.value = category
}

const toggleSkill = (skill) => {
  const index = selectedSkills.value.indexOf(skill)
  if (index > -1) {
    selectedSkills.value.splice(index, 1)
  } else {
    selectedSkills.value.push(skill)
  }
}

const clearSearch = () => {
  searchQuery.value = ''
}

const resetFilters = () => {
  selectedCategory.value = '전체'
  selectedSkills.value = []
  searchQuery.value = ''
}

const toggleLike = (portfolioId) => {
  const portfolio = portfolios.value.find(p => p.id === portfolioId)
  if (portfolio) {
    portfolio.isLiked = !portfolio.isLiked
  }
}

const viewPortfolio = (portfolioId) => {
  console.log('포트폴리오 상세보기:', portfolioId)
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
.portfolio-list {
  min-height: 100vh;
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
  font-size: 48px;
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

.category-filters, .skill-filters {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.category-btn, .skill-btn {
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

.category-btn:hover, .skill-btn:hover {
  border-color: #4CAF50;
  background: rgba(76, 175, 80, 0.05);
}

.category-btn.active, .skill-btn.active {
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

  .card-header {
    padding: 20px;
  }

  .profile-avatar {
    width: 52px;
    height: 52px;
  }

  .profile-name {
    font-size: 18px;
  }

  .profile-title {
    font-size: 15px;
  }

  .card-body {
    padding: 20px;
  }

  .card-footer {
    padding: 16px 20px;
  }

  .shape-1, .shape-2, .shape-3, .shape-4 {
    display: none;
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

  .category-filters, .skill-filters {
    gap: 6px;
  }

  .category-btn, .skill-btn {
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

  .card-header {
    padding: 16px;
  }

  .profile-section {
    gap: 12px;
  }

  .profile-avatar {
    width: 48px;
    height: 48px;
  }

  .profile-name {
    font-size: 16px;
  }

  .profile-title {
    font-size: 14px;
  }

  .card-body {
    padding: 16px;
  }

  .card-footer {
    padding: 12px 16px;
  }

  .view-btn {
    padding: 10px 20px;
    font-size: 13px;
  }

  .empty-state {
    padding: 60px 15px;
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

/* 스크롤바 스타일링 */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: rgba(76, 175, 80, 0.1);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: rgba(76, 175, 80, 0.3);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(76, 175, 80, 0.5);
}
</style>