<template>
  <DashboardLayout>
    <div class="projects-dashboard">
      <!-- Page Header -->
      <div class="page-header">
        <div class="header-content">
          <div class="header-left">
            <h1 class="page-title">프로젝트 관리</h1>
            <p class="page-subtitle">진행 중인 프로젝트와 완료된 프로젝트를 관리하세요</p>
          </div>
          <div class="header-actions">
            <router-link to="/project-inquiry" class="btn-primary">
              <i class="bi bi-plus-circle"></i>
              새 프로젝트 등록
            </router-link>
            <button @click="refreshProjects" class="btn-secondary" :disabled="isLoading">
              <i :class="['bi', isLoading ? 'bi-arrow-clockwise spin' : 'bi-arrow-clockwise']"></i>
              새로고침
            </button>
          </div>
        </div>
      </div>

      <!-- Quick Stats -->
      <div class="quick-stats">
        <div class="stat-card">
          <div class="stat-icon active">
            <i class="bi bi-play-circle"></i>
          </div>
          <div class="stat-content">
            <h3 class="stat-number">{{ activeProjectsCount }}</h3>
            <p class="stat-label">진행 중</p>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon completed">
            <i class="bi bi-check-circle-fill"></i>
          </div>
          <div class="stat-content">
            <h3 class="stat-number">{{ completedProjectsCount }}</h3>
            <p class="stat-label">완료</p>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon pending">
            <i class="bi bi-clock"></i>
          </div>
          <div class="stat-content">
            <h3 class="stat-number">{{ pendingProjectsCount }}</h3>
            <p class="stat-label">대기 중</p>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon revenue">
            <i class="bi bi-currency-dollar"></i>
          </div>
          <div class="stat-content">
            <h3 class="stat-number">₩{{ formatMoney(totalRevenue) }}</h3>
            <p class="stat-label">총 수익</p>
          </div>
        </div>
      </div>

      <!-- Filters and Search -->
      <div class="filters-section">
        <div class="filters-left">
          <div class="search-box">
            <i class="bi bi-search"></i>
            <input 
              type="text" 
              v-model="searchQuery" 
              placeholder="프로젝트명, 클라이언트명으로 검색..."
              @input="handleSearch"
            />
          </div>
          <div class="filter-tabs">
            <button 
              v-for="tab in filterTabs" 
              :key="tab.key"
              @click="setActiveFilter(tab.key)"
              :class="['filter-tab', { active: activeFilter === tab.key }]"
            >
              {{ tab.label }}
              <span v-if="tab.count > 0" class="tab-count">{{ tab.count }}</span>
            </button>
          </div>
        </div>
        <div class="filters-right">
          <div class="sort-dropdown">
            <select v-model="sortBy" @change="handleSort">
              <option value="updated">최근 업데이트순</option>
              <option value="created">생성일순</option>
              <option value="deadline">마감일순</option>
              <option value="name">이름순</option>
              <option value="revenue">수익순</option>
            </select>
          </div>
          <div class="view-toggle">
            <button 
              @click="setView('grid')"
              :class="['view-btn', { active: currentView === 'grid' }]"
              title="그리드 보기"
            >
              <i class="bi bi-grid"></i>
            </button>
            <button 
              @click="setView('list')"
              :class="['view-btn', { active: currentView === 'list' }]"
              title="리스트 보기"
            >
              <i class="bi bi-list"></i>
            </button>
          </div>
        </div>
      </div>

      <!-- Projects List/Grid -->
      <div v-if="isLoading" class="loading-state">
        <div class="loading-spinner">
          <div class="spinner"></div>
          <p>프로젝트를 불러오는 중...</p>
        </div>
      </div>

      <div v-else-if="filteredProjects.length === 0" class="empty-state">
        <div class="empty-icon">
          <i class="bi bi-folder-x"></i>
        </div>
        <h3 class="empty-title">프로젝트가 없습니다</h3>
        <p class="empty-message">
          {{ searchQuery ? '검색 조건에 맞는 프로젝트를 찾을 수 없습니다.' : '새로운 프로젝트를 등록해보세요.' }}
        </p>
        <router-link v-if="!searchQuery" to="/project-inquiry" class="btn-primary">
          <i class="bi bi-plus-circle"></i>
          첫 프로젝트 등록하기
        </router-link>
      </div>

      <div v-else :class="['projects-container', currentView]">
        <div v-for="project in paginatedProjects" :key="project.id" class="project-card">
          <div class="project-header">
            <div class="project-status" :class="project.status">
              <span class="status-text">{{ getStatusText(project.status) }}</span>
              <div class="status-indicator"></div>
            </div>
            <div class="project-actions">
              <button @click="toggleFavorite(project)" class="action-btn favorite" :class="{ active: project.isFavorite }">
                <i :class="project.isFavorite ? 'bi bi-heart-fill' : 'bi bi-heart'"></i>
              </button>
              <div class="dropdown">
                <button @click="toggleDropdown(project.id)" class="action-btn dropdown-trigger">
                  <i class="bi bi-three-dots"></i>
                </button>
                <div v-if="openDropdown === project.id" class="dropdown-menu">
                  <router-link :to="`/dashboard/projects/${project.id}`" class="dropdown-item">
                    <i class="bi bi-eye"></i>
                    상세 보기
                  </router-link>
                  <router-link :to="`/dashboard/projects/${project.id}/edit`" class="dropdown-item">
                    <i class="bi bi-pencil"></i>
                    수정
                  </router-link>
                  <button @click="duplicateProject(project)" class="dropdown-item">
                    <i class="bi bi-files"></i>
                    복제
                  </button>
                  <hr class="dropdown-divider">
                  <button @click="archiveProject(project)" class="dropdown-item danger">
                    <i class="bi bi-archive"></i>
                    보관
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div class="project-content">
            <div class="project-info">
              <h3 class="project-title">{{ project.title }}</h3>
              <p class="project-description">{{ project.description }}</p>
              
              <div class="project-meta">
                <div class="meta-item">
                  <i class="bi bi-person"></i>
                  <span>{{ project.client }}</span>
                </div>
                <div class="meta-item">
                  <i class="bi bi-calendar"></i>
                  <span>{{ formatDate(project.deadline) }}</span>
                </div>
                <div class="meta-item">
                  <i class="bi bi-currency-dollar"></i>
                  <span>₩{{ formatMoney(project.budget) }}</span>
                </div>
              </div>

              <div class="project-tech">
                <span v-for="tech in project.technologies" :key="tech" class="tech-tag">
                  {{ tech }}
                </span>
              </div>
            </div>

            <div class="project-progress">
              <div class="progress-header">
                <span class="progress-label">진행률</span>
                <span class="progress-percentage">{{ project.progress }}%</span>
              </div>
              <div class="progress-bar">
                <div class="progress-fill" :style="{ width: project.progress + '%' }"></div>
              </div>
              <div class="progress-timeline">
                <div v-for="milestone in project.milestones" :key="milestone.id" 
                     :class="['milestone', { completed: milestone.completed, current: milestone.current }]">
                  <div class="milestone-dot"></div>
                  <span class="milestone-label">{{ milestone.name }}</span>
                </div>
              </div>
            </div>
          </div>

          <div class="project-footer">
            <div class="footer-left">
              <div class="team-avatars">
                <img v-for="member in project.team.slice(0, 3)" :key="member.id" 
                     :src="member.avatar" :alt="member.name" class="team-avatar"
                     :title="member.name">
                <span v-if="project.team.length > 3" class="team-more">+{{ project.team.length - 3 }}</span>
              </div>
              <span class="last-updated">{{ formatRelativeTime(project.updatedAt) }} 업데이트</span>
            </div>
            <div class="footer-right">
              <router-link :to="`/dashboard/projects/${project.id}`" class="btn-outline">
                프로젝트 보기
              </router-link>
            </div>
          </div>
        </div>
      </div>

      <!-- Pagination -->
      <div v-if="totalPages > 1" class="pagination">
        <button 
          @click="goToPage(currentPage - 1)" 
          :disabled="currentPage === 1"
          class="pagination-btn"
        >
          <i class="bi bi-chevron-left"></i>
        </button>
        
        <button 
          v-for="page in visiblePages" 
          :key="page"
          @click="goToPage(page)"
          :class="['pagination-btn', { active: page === currentPage }]"
        >
          {{ page }}
        </button>
        
        <button 
          @click="goToPage(currentPage + 1)" 
          :disabled="currentPage === totalPages"
          class="pagination-btn"
        >
          <i class="bi bi-chevron-right"></i>
        </button>
      </div>
    </div>
  </DashboardLayout>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import DashboardLayout from '@/components/dashboard/DashboardLayout.vue'

export default {
  name: 'DashboardProjects',
  components: {
    DashboardLayout
  },
  setup() {
    // State
    const isLoading = ref(false)
    const searchQuery = ref('')
    const activeFilter = ref('all')
    const sortBy = ref('updated')
    const currentView = ref('grid')
    const currentPage = ref(1)
    const itemsPerPage = ref(12)
    const openDropdown = ref(null)

    // Sample projects data
    const projects = ref([
      {
        id: 1,
        title: 'E-커머스 플랫폼 개발',
        description: '모던한 온라인 쇼핑몰 구축 프로젝트. React와 Node.js를 활용한 풀스택 개발.',
        client: 'ABC 쇼핑���',
        status: 'active',
        progress: 75,
        budget: 5000000,
        deadline: new Date('2024-03-15'),
        createdAt: new Date('2024-01-10'),
        updatedAt: new Date('2024-02-14'),
        technologies: ['React', 'Node.js', 'MongoDB'],
        isFavorite: true,
        team: [
          { id: 1, name: '김개발자', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=김개발자' },
          { id: 2, name: '이디자이너', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=이디자이너' }
        ],
        milestones: [
          { id: 1, name: '기획', completed: true, current: false },
          { id: 2, name: '디자인', completed: true, current: false },
          { id: 3, name: '개발', completed: false, current: true },
          { id: 4, name: '테스트', completed: false, current: false },
          { id: 5, name: '배포', completed: false, current: false }
        ]
      },
      {
        id: 2,
        title: '모바일 앱 개발',
        description: 'Flutter를 활용한 크로스플랫폼 모바일 애플리케이션 개발.',
        client: 'XYZ 스타트업',
        status: 'pending',
        progress: 30,
        budget: 8000000,
        deadline: new Date('2024-04-20'),
        createdAt: new Date('2024-02-01'),
        updatedAt: new Date('2024-02-10'),
        technologies: ['Flutter', 'Dart', 'Firebase'],
        isFavorite: false,
        team: [
          { id: 1, name: '김개발자', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=김개발자' },
          { id: 3, name: '박개발자', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=박개발자' },
          { id: 4, name: '최디자이너', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=최디자이너' }
        ],
        milestones: [
          { id: 1, name: '기획', completed: true, current: false },
          { id: 2, name: '와이어프레임', completed: false, current: true },
          { id: 3, name: '개발', completed: false, current: false },
          { id: 4, name: '테스트', completed: false, current: false }
        ]
      },
      {
        id: 3,
        title: '관리자 대시보드',
        description: 'Vue.js 기반의 관리자 패널 및 데이터 분석 대시보드 구축.',
        client: 'DEF 기업',
        status: 'completed',
        progress: 100,
        budget: 3500000,
        deadline: new Date('2024-01-30'),
        createdAt: new Date('2023-12-01'),
        updatedAt: new Date('2024-01-28'),
        technologies: ['Vue.js', 'Chart.js', 'Express'],
        isFavorite: false,
        team: [
          { id: 1, name: '김개발자', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=김개발자' }
        ],
        milestones: [
          { id: 1, name: '분석', completed: true, current: false },
          { id: 2, name: '설계', completed: true, current: false },
          { id: 3, name: '개발', completed: true, current: false },
          { id: 4, name: '완료', completed: true, current: false }
        ]
      }
      // Add more sample projects...
    ])

    // Filter tabs
    const filterTabs = computed(() => [
      { key: 'all', label: '전체', count: projects.value.length },
      { key: 'active', label: '진행중', count: activeProjectsCount.value },
      { key: 'pending', label: '대기중', count: pendingProjectsCount.value },
      { key: 'completed', label: '완료', count: completedProjectsCount.value }
    ])

    // Computed properties
    const activeProjectsCount = computed(() => 
      projects.value.filter(p => p.status === 'active').length
    )

    const pendingProjectsCount = computed(() => 
      projects.value.filter(p => p.status === 'pending').length
    )

    const completedProjectsCount = computed(() => 
      projects.value.filter(p => p.status === 'completed').length
    )

    const totalRevenue = computed(() => 
      projects.value.reduce((sum, p) => sum + (p.status === 'completed' ? p.budget : 0), 0)
    )

    const filteredProjects = computed(() => {
      let filtered = projects.value

      // Apply search filter
      if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase()
        filtered = filtered.filter(p => 
          p.title.toLowerCase().includes(query) ||
          p.client.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query)
        )
      }

      // Apply status filter
      if (activeFilter.value !== 'all') {
        filtered = filtered.filter(p => p.status === activeFilter.value)
      }

      // Apply sorting
      filtered.sort((a, b) => {
        switch (sortBy.value) {
          case 'created':
            return new Date(b.createdAt) - new Date(a.createdAt)
          case 'deadline':
            return new Date(a.deadline) - new Date(b.deadline)
          case 'name':
            return a.title.localeCompare(b.title)
          case 'revenue':
            return b.budget - a.budget
          default: // 'updated'
            return new Date(b.updatedAt) - new Date(a.updatedAt)
        }
      })

      return filtered
    })

    const totalPages = computed(() => 
      Math.ceil(filteredProjects.value.length / itemsPerPage.value)
    )

    const paginatedProjects = computed(() => {
      const start = (currentPage.value - 1) * itemsPerPage.value
      const end = start + itemsPerPage.value
      return filteredProjects.value.slice(start, end)
    })

    const visiblePages = computed(() => {
      const pages = []
      const total = totalPages.value
      const current = currentPage.value
      
      if (total <= 7) {
        for (let i = 1; i <= total; i++) {
          pages.push(i)
        }
      } else {
        if (current <= 4) {
          for (let i = 1; i <= 5; i++) pages.push(i)
          pages.push('...')
          pages.push(total)
        } else if (current >= total - 3) {
          pages.push(1)
          pages.push('...')
          for (let i = total - 4; i <= total; i++) pages.push(i)
        } else {
          pages.push(1)
          pages.push('...')
          for (let i = current - 1; i <= current + 1; i++) pages.push(i)
          pages.push('...')
          pages.push(total)
        }
      }
      
      return pages
    })

    // Methods
    const formatMoney = (amount) => {
      return new Intl.NumberFormat('ko-KR').format(amount)
    }

    const formatDate = (date) => {
      return new Intl.DateTimeFormat('ko-KR', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      }).format(date)
    }

    const formatRelativeTime = (date) => {
      const now = new Date()
      const diff = now - date
      const days = Math.floor(diff / (1000 * 60 * 60 * 24))
      
      if (days === 0) return '오늘'
      if (days === 1) return '어제'
      if (days < 7) return `${days}일 전`
      if (days < 30) return `${Math.floor(days / 7)}주 전`
      return `${Math.floor(days / 30)}달 전`
    }

    const getStatusText = (status) => {
      const statusMap = {
        active: '진행중',
        pending: '대기중',
        completed: '완료',
        archived: '보관됨'
      }
      return statusMap[status] || status
    }

    const setActiveFilter = (filter) => {
      activeFilter.value = filter
      currentPage.value = 1
    }

    const setView = (view) => {
      currentView.value = view
    }

    const handleSearch = () => {
      currentPage.value = 1
    }

    const handleSort = () => {
      currentPage.value = 1
    }

    const goToPage = (page) => {
      if (page >= 1 && page <= totalPages.value) {
        currentPage.value = page
      }
    }

    const toggleDropdown = (projectId) => {
      openDropdown.value = openDropdown.value === projectId ? null : projectId
    }

    const toggleFavorite = (project) => {
      project.isFavorite = !project.isFavorite
    }

    const duplicateProject = (project) => {
      console.log('Duplicating project:', project.title)
      // Implement duplication logic
    }

    const archiveProject = (project) => {
      if (confirm(`"${project.title}" 프로젝트를 보관하시겠습니까?`)) {
        project.status = 'archived'
        console.log('Archived project:', project.title)
      }
    }

    const refreshProjects = async () => {
      isLoading.value = true
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      isLoading.value = false
    }

    // Handle click outside for dropdown
    const handleClickOutside = (event) => {
      if (!event.target.closest('.dropdown')) {
        openDropdown.value = null
      }
    }

    onMounted(() => {
      document.addEventListener('click', handleClickOutside)
    })

    return {
      isLoading,
      searchQuery,
      activeFilter,
      sortBy,
      currentView,
      currentPage,
      openDropdown,
      projects,
      filterTabs,
      activeProjectsCount,
      pendingProjectsCount,
      completedProjectsCount,
      totalRevenue,
      filteredProjects,
      paginatedProjects,
      totalPages,
      visiblePages,
      formatMoney,
      formatDate,
      formatRelativeTime,
      getStatusText,
      setActiveFilter,
      setView,
      handleSearch,
      handleSort,
      goToPage,
      toggleDropdown,
      toggleFavorite,
      duplicateProject,
      archiveProject,
      refreshProjects
    }
  }
}
</script>

<style scoped>
.projects-dashboard {
  max-width: 1400px;
  margin: 0 auto;
}

/* Page Header */
.page-header {
  margin-bottom: 32px;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 24px;
}

.page-title {
  font-size: 32px;
  font-weight: 700;
  color: #212529;
  margin: 0 0 8px 0;
}

.page-subtitle {
  font-size: 16px;
  color: #6c757d;
  margin: 0;
}

.header-actions {
  display: flex;
  gap: 12px;
}

.btn-primary, .btn-secondary, .btn-outline {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  border-radius: 8px;
  font-weight: 500;
  text-decoration: none;
  transition: all 0.2s ease;
  border: none;
  cursor: pointer;
  font-size: 14px;
}

.btn-primary {
  background: #FF7D12;
  color: white;
}

.btn-primary:hover {
  background: #FE7C25;
  transform: translateY(-1px);
}

.btn-secondary {
  background: white;
  color: #6c757d;
  border: 1px solid #e9ecef;
}

.btn-secondary:hover {
  background: #f8f9fa;
  border-color: #dee2e6;
}

.btn-secondary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-outline {
  background: transparent;
  color: #FF7D12;
  border: 1px solid #FF7D12;
  font-size: 12px;
  padding: 8px 16px;
}

.btn-outline:hover {
  background: #FF7D12;
  color: white;
}

.spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Quick Stats */
.quick-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 32px;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease;
}

.stat-card:hover {
  transform: translateY(-2px);
}

.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  color: white;
}

.stat-icon.active {
  background: linear-gradient(135deg, #FF7D12, #FE7C25);
}

.stat-icon.completed {
  background: linear-gradient(135deg, #28a745, #20c997);
}

.stat-icon.pending {
  background: linear-gradient(135deg, #ffc107, #fd7e14);
}

.stat-icon.revenue {
  background: linear-gradient(135deg, #6f42c1, #e83e8c);
}

.stat-number {
  font-size: 24px;
  font-weight: 700;
  color: #212529;
  margin: 0 0 4px 0;
}

.stat-label {
  font-size: 14px;
  color: #6c757d;
  margin: 0;
}

/* Filters Section */
.filters-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 24px;
  margin-bottom: 24px;
  flex-wrap: wrap;
}

.filters-left {
  display: flex;
  align-items: center;
  gap: 20px;
  flex: 1;
}

.search-box {
  position: relative;
  min-width: 300px;
}

.search-box i {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #6c757d;
}

.search-box input {
  width: 100%;
  padding: 12px 12px 12px 40px;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  font-size: 14px;
  transition: border-color 0.2s ease;
}

.search-box input:focus {
  outline: none;
  border-color: #FF7D12;
  box-shadow: 0 0 0 3px rgba(255, 125, 18, 0.1);
}

.filter-tabs {
  display: flex;
  gap: 4px;
}

.filter-tab {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border: 1px solid transparent;
  background: transparent;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
  color: #6c757d;
}

.filter-tab:hover {
  background: #f8f9fa;
  color: #212529;
}

.filter-tab.active {
  background: #FF7D12;
  color: white;
  border-color: #FF7D12;
}

.tab-count {
  background: rgba(255, 255, 255, 0.2);
  padding: 2px 6px;
  border-radius: 10px;
  font-size: 12px;
  font-weight: 600;
  min-width: 18px;
  text-align: center;
}

.filter-tab.active .tab-count {
  background: rgba(255, 255, 255, 0.3);
}

.filter-tab:not(.active) .tab-count {
  background: #e9ecef;
  color: #6c757d;
}

.filters-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.sort-dropdown select {
  padding: 8px 12px;
  border: 1px solid #e9ecef;
  border-radius: 6px;
  background: white;
  font-size: 14px;
  cursor: pointer;
}

.view-toggle {
  display: flex;
  border: 1px solid #e9ecef;
  border-radius: 6px;
  overflow: hidden;
}

.view-btn {
  padding: 8px 12px;
  border: none;
  background: white;
  color: #6c757d;
  cursor: pointer;
  transition: all 0.2s ease;
}

.view-btn:hover {
  background: #f8f9fa;
}

.view-btn.active {
  background: #FF7D12;
  color: white;
}

/* Loading and Empty States */
.loading-state, .empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
  text-align: center;
}

.loading-spinner {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #e9ecef;
  border-top: 4px solid #FF7D12;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.empty-icon {
  font-size: 64px;
  color: #e9ecef;
  margin-bottom: 16px;
}

.empty-title {
  font-size: 20px;
  font-weight: 600;
  color: #212529;
  margin: 0 0 8px 0;
}

.empty-message {
  font-size: 16px;
  color: #6c757d;
  margin: 0 0 24px 0;
}

/* Projects Container */
.projects-container {
  margin-bottom: 32px;
}

.projects-container.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: 24px;
}

.projects-container.list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.projects-container.list .project-card {
  flex-direction: row;
  align-items: center;
}

/* Project Card */
.project-card {
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  border: 1px solid transparent;
  display: flex;
  flex-direction: column;
}

.project-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  border-color: #FF7D12;
}

.project-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.project-status {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
}

.project-status.active {
  background: rgba(255, 125, 18, 0.1);
  color: #FF7D12;
}

.project-status.pending {
  background: rgba(255, 193, 7, 0.1);
  color: #ffc107;
}

.project-status.completed {
  background: rgba(40, 167, 69, 0.1);
  color: #28a745;
}

.status-indicator {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: currentColor;
}

.project-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.action-btn {
  width: 32px;
  height: 32px;
  border: none;
  background: #f8f9fa;
  border-radius: 6px;
  color: #6c757d;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.action-btn:hover {
  background: #e9ecef;
  color: #212529;
}

.action-btn.favorite.active {
  background: rgba(220, 53, 69, 0.1);
  color: #dc3545;
}

.dropdown {
  position: relative;
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  right: 0;
  width: 180px;
  background: white;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  overflow: hidden;
  animation: dropdownFadeIn 0.2s ease;
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 10px 16px;
  border: none;
  background: none;
  text-decoration: none;
  color: #212529;
  font-size: 14px;
  cursor: pointer;
  transition: background 0.2s ease;
}

.dropdown-item:hover {
  background: #f8f9fa;
}

.dropdown-item.danger {
  color: #dc3545;
}

.dropdown-item.danger:hover {
  background: rgba(220, 53, 69, 0.1);
}

.dropdown-divider {
  margin: 0;
  border: none;
  border-top: 1px solid #e9ecef;
}

.project-content {
  flex: 1;
  margin-bottom: 20px;
}

.project-title {
  font-size: 18px;
  font-weight: 600;
  color: #212529;
  margin: 0 0 8px 0;
  line-height: 1.3;
}

.project-description {
  font-size: 14px;
  color: #6c757d;
  margin: 0 0 16px 0;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.project-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  margin-bottom: 16px;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: #6c757d;
}

.meta-item i {
  font-size: 14px;
}

.project-tech {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 16px;
}

.tech-tag {
  padding: 4px 8px;
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 12px;
  font-size: 11px;
  color: #6c757d;
  font-weight: 500;
}

.project-progress {
  margin-bottom: 16px;
}

.progress-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.progress-label {
  font-size: 12px;
  color: #6c757d;
  font-weight: 500;
}

.progress-percentage {
  font-size: 12px;
  color: #212529;
  font-weight: 600;
}

.progress-bar {
  height: 6px;
  background: #e9ecef;
  border-radius: 3px;
  overflow: hidden;
  margin-bottom: 12px;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #FF7D12, #FE7C25);
  transition: width 0.3s ease;
}

.progress-timeline {
  display: flex;
  gap: 16px;
  overflow-x: auto;
  padding: 4px 0;
}

.milestone {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  min-width: 60px;
  flex-shrink: 0;
}

.milestone-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #e9ecef;
  transition: background 0.3s ease;
}

.milestone.completed .milestone-dot {
  background: #28a745;
}

.milestone.current .milestone-dot {
  background: #FF7D12;
  box-shadow: 0 0 0 3px rgba(255, 125, 18, 0.3);
}

.milestone-label {
  font-size: 10px;
  color: #6c757d;
  text-align: center;
  font-weight: 500;
}

.milestone.completed .milestone-label {
  color: #28a745;
}

.milestone.current .milestone-label {
  color: #FF7D12;
  font-weight: 600;
}

.project-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 16px;
  border-top: 1px solid #f8f9fa;
}

.footer-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.team-avatars {
  display: flex;
  align-items: center;
  gap: -8px;
}

.team-avatar {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: 2px solid white;
  object-fit: cover;
  margin-left: -8px;
}

.team-avatar:first-child {
  margin-left: 0;
}

.team-more {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: 2px solid white;
  background: #e9ecef;
  color: #6c757d;
  font-size: 10px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: -8px;
}

.last-updated {
  font-size: 11px;
  color: #6c757d;
}

/* Pagination */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  margin-top: 32px;
}

.pagination-btn {
  width: 40px;
  height: 40px;
  border: 1px solid #e9ecef;
  background: white;
  border-radius: 6px;
  color: #6c757d;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.pagination-btn:hover:not(:disabled) {
  background: #f8f9fa;
  border-color: #dee2e6;
}

.pagination-btn.active {
  background: #FF7D12;
  color: white;
  border-color: #FF7D12;
}

.pagination-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Mobile Responsive */
@media (max-width: 1024px) {
  .header-content {
    flex-direction: column;
    align-items: flex-start;
  }

  .projects-container.grid {
    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  }

  .filters-section {
    flex-direction: column;
    align-items: stretch;
  }

  .filters-left {
    flex-direction: column;
    align-items: stretch;
    gap: 16px;
  }

  .search-box {
    min-width: auto;
  }
}

@media (max-width: 768px) {
  .quick-stats {
    grid-template-columns: repeat(2, 1fr);
  }

  .projects-container.grid {
    grid-template-columns: 1fr;
  }

  .project-meta {
    flex-direction: column;
    gap: 8px;
  }

  .progress-timeline {
    gap: 8px;
  }

  .milestone {
    min-width: 40px;
  }

  .milestone-label {
    font-size: 9px;
  }

  .project-footer {
    flex-direction: column;
    gap: 12px;
    align-items: flex-start;
  }
}

@media (max-width: 480px) {
  .quick-stats {
    grid-template-columns: 1fr;
  }

  .filter-tabs {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 8px;
  }

  .page-title {
    font-size: 24px;
  }

  .project-card {
    padding: 16px;
  }
}

@keyframes dropdownFadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
