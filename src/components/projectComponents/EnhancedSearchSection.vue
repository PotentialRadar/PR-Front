<template>
  <div class="enhanced-search-section">
    <!-- 메인 검색바 -->
    <div class="main-search-container">
      <div class="search-input-wrapper">
        <div class="search-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <circle cx="11" cy="11" r="8" stroke="currentColor" stroke-width="2"/>
            <path d="m21 21-4.35-4.35" stroke="currentColor" stroke-width="2"/>
          </svg>
        </div>
        <input
          type="text"
          v-model="searchQuery"
          placeholder="프로젝트 제목, 기술 스택, 설명 검색..."
          class="main-search-input"
          @keypress.enter="handleSearch"
          @input="debouncedSearch"
        />
        <button v-if="searchQuery" @click="clearSearch" class="clear-search-btn">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2"/>
          </svg>
        </button>
      </div>
      
    </div>

    <!-- 고급 필터 토글 -->
    <div class="advanced-filters-toggle">
      <button 
        class="toggle-btn"
        :class="{ 'expanded': showAdvancedFilters }"
        @click="toggleAdvancedFilters"
      >
        <span class="toggle-text">상세 필터</span>
        <div class="toggle-icon" :class="{ 'rotated': showAdvancedFilters }">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M6 9l6 6 6-6" stroke="currentColor" stroke-width="2"/>
          </svg>
        </div>
        <div v-if="getActiveFilterCount() > 0" class="filter-count">
          {{ getActiveFilterCount() }}
        </div>
      </button>
    </div>

    <!-- 고급 필터 패널 -->
    <Transition name="slide-down">
      <div v-if="showAdvancedFilters" class="advanced-filters-panel">
        
        <!-- 기술 파트 필터 -->
        <div class="filter-section">
          <div class="filter-header">
            <div class="filter-title">
              <div class="title-icon">💼</div>
              <span>기술 파트</span>
            </div>
            <button 
              v-if="selectedTechParts.length > 0"
              @click="clearTechParts"
              class="clear-section-btn"
            >
              초기화
            </button>
          </div>
          <div class="filter-chips">
            <button
              v-for="part in techParts"
              :key="part"
              class="filter-chip"
              :class="{ 'active': selectedTechParts.includes(part) }"
              @click="toggleTechPart(part)"
            >
              {{ part }}
              <div v-if="selectedTechParts.includes(part)" class="chip-check">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                  <path d="M20 6L9 17L4 12" stroke="currentColor" stroke-width="2"/>
                </svg>
              </div>
            </button>
          </div>
        </div>

        <!-- 기술 스택 필터 (멀티 셀렉트) -->
        <div class="filter-section">
          <div class="filter-header">
            <div class="filter-title">
              <div class="title-icon">⚙️</div>
              <span>기술 스택</span>
            </div>
          </div>
          <SearchableMultiSelect
            label="기술 스택"
            :items="techStacks"
            :popular-items="popularTechStacks"
            :categories="techStackCategories"
            v-model="selectedTechStacks"
            @change="handleTechStackChange"
          />
        </div>

        <!-- 프로젝트 상태 필터 (프로젝트 타입인 경우) -->
        <div v-if="type === 'project'" class="filter-section">
          <div class="filter-header">
            <div class="filter-title">
              <div class="title-icon">📊</div>
              <span>프로젝트 상태</span>
            </div>
            <button 
              v-if="selectedStatuses.length > 0"
              @click="clearStatuses"
              class="clear-section-btn"
            >
              초기화
            </button>
          </div>
          <div class="filter-chips">
            <button
              v-for="status in projectStatuses"
              :key="status.value"
              class="filter-chip status-chip"
              :class="{ 'active': selectedStatuses.includes(status.value) }"
              @click="toggleStatus(status.value)"
            >
              <div class="status-indicator" :class="getStatusClass(status.value)"></div>
              {{ status.label }}
              <div v-if="selectedStatuses.includes(status.value)" class="chip-check">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                  <path d="M20 6L9 17L4 12" stroke="currentColor" stroke-width="2"/>
                </svg>
              </div>
            </button>
          </div>
        </div>

        <!-- 경력 필터 (포트폴리오 타입인 경우) -->
        <div v-if="type === 'portfolio'" class="filter-section">
          <div class="filter-header">
            <div class="filter-title">
              <div class="title-icon">👤</div>
              <span>경력</span>
            </div>
            <button 
              v-if="selectedExperienceRanges.length > 0"
              @click="clearExperiences"
              class="clear-section-btn"
            >
              초기화
            </button>
          </div>
          <div class="filter-chips">
            <button
              v-for="exp in experienceRanges"
              :key="exp.value"
              class="filter-chip experience-chip"
              :class="{ 'active': selectedExperienceRanges.includes(exp.value) }"
              @click="toggleExperience(exp.value)"
            >
              <div class="experience-icon" :class="getExperienceClass(exp.value)">
                {{ getExperienceEmoji(exp.value) }}
              </div>
              {{ exp.label }}
              <div v-if="selectedExperienceRanges.includes(exp.value)" class="chip-check">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                  <path d="M20 6L9 17L4 12" stroke="currentColor" stroke-width="2"/>
                </svg>
              </div>
            </button>
          </div>
        </div>

        <!-- 전체 초기화 버튼 -->
        <div v-if="getActiveFilterCount() > 0" class="filter-actions">
          <div class="active-filters-summary">
            {{ getActiveFilterCount() }}개의 필터가 적용중
          </div>
          <button @click="clearAllFilters" class="clear-all-btn">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6h18" stroke="currentColor" stroke-width="2"/>
            </svg>
            전체 초기화
          </button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script>
import { debounce } from 'lodash'
import SearchableMultiSelect from '@/components/common/SearchableMultiSelect.vue'
import { useTechTagStore } from '@/stores/techTagStore'

export default {
  name: 'EnhancedSearchSection',
  components: {
    SearchableMultiSelect
  },
  props: {
    type: {
      type: String,
      default: 'project',
      validator: value => ['project', 'portfolio'].includes(value)
    }
  },
  setup() {
    const techTagStore = useTechTagStore()
    return {
      techTagStore
    }
  },
  data() {
    return {
      searchQuery: '',
      showAdvancedFilters: false,
      selectedTechParts: [],
      selectedTechStacks: [],
      selectedStatuses: [],
      selectedExperienceRanges: [],
      
      // 기술 스택 카테고리
      techStackCategories: [
        {
          name: 'Frontend',
          icon: '🎨',
          items: ['React', 'Vue.js', 'Angular', 'Svelte', 'Next.js', 'Nuxt.js', 'TypeScript', 'JavaScript', 'HTML/CSS', 'Tailwind CSS', 'Sass', 'Webpack', 'Vite']
        },
        {
          name: 'Backend',
          icon: '⚙️',
          items: ['Node.js', 'Express.js', 'Spring Boot', 'Django', 'FastAPI', 'Ruby on Rails', 'Laravel', 'ASP.NET', 'NestJS', 'Koa.js']
        },
        {
          name: 'Database',
          icon: '🗄️',
          items: ['MySQL', 'PostgreSQL', 'MongoDB', 'Redis', 'SQLite', 'Oracle', 'MariaDB', 'DynamoDB', 'Elasticsearch', 'Firebase Firestore']
        },
        {
          name: 'Mobile',
          icon: '📱',
          items: ['React Native', 'Flutter', 'Swift', 'Kotlin', 'Ionic', 'Xamarin', 'Unity', 'Android Studio', 'Xcode']
        },
        {
          name: 'DevOps & Cloud',
          icon: '☁️',
          items: ['AWS', 'Google Cloud', 'Azure', 'Docker', 'Kubernetes', 'Jenkins', 'GitHub Actions', 'Terraform', 'Ansible', 'Nginx']
        },
        {
          name: 'AI & Data',
          icon: '🤖',
          items: ['Python', 'TensorFlow', 'PyTorch', 'Pandas', 'NumPy', 'Scikit-learn', 'Jupyter', 'R', 'Matplotlib', 'OpenCV']
        }
      ],
      
      
      // 프로젝트 상태 옵션
      projectStatuses: [
        { value: 'RECRUITING', label: '모집중' },
        { value: 'IN_PROGRESS', label: '진행중' },
        { value: 'COMPLETED', label: '완료' },
        { value: 'CANCELLED', label: '취소' }
      ],
      
      // 경력 범위 옵션
      experienceRanges: [
        { value: 'JUNIOR', label: '신입 (0-2년)' },
        { value: 'MIDDLE', label: '중급 (3-5년)' },
        { value: 'SENIOR', label: '시니어 (6년+)' }
      ]
    }
  },
  async mounted() {
    await this.loadTechTags()
    this.debouncedSearch = debounce(this.handleSearch, 500)
  },
  computed: {
    techParts() {
      return this.techTagStore.techParts
    },
    techStacks() {
      return this.techTagStore.techStacks
    },
    popularTechStacks() {
      return this.techTagStore.getPopularTechStacksTop20()
    }
  },
  methods: {
    async loadTechTags() {
      try {
        await this.techTagStore.loadTechTags()
        
        // 카테고리 데이터를 실제 API 데이터로 업데이트
        this.updateCategoriesWithApiData()
      } catch (error) {
        console.error('기술 태그 로드 실패:', error)
      }
    },

    updateCategoriesWithApiData() {
      // API에서 받은 techStacks와 카테고리 템플릿을 매칭
      this.techStackCategories = this.techStackCategories.map(category => ({
        ...category,
        items: category.items.filter(item => this.techStacks.includes(item))
      })).filter(category => category.items.length > 0)
    },
    
    handleSearch() {
      const searchParams = {
        keyword: this.searchQuery.trim() || null,
        techParts: this.selectedTechParts.length > 0 ? this.selectedTechParts : null,
        techStacks: this.selectedTechStacks.length > 0 ? this.selectedTechStacks : null,
        statuses: this.selectedStatuses.length > 0 ? this.selectedStatuses : null,
        experienceRanges: this.selectedExperienceRanges.length > 0 ? this.selectedExperienceRanges : null
      }
      
      this.$emit('perform-search', searchParams)
      console.log('🔍 검색 파라미터:', searchParams)
    },

    // 토글 메서드들
    toggleTechPart(part) {
      const index = this.selectedTechParts.indexOf(part)
      if (index > -1) {
        this.selectedTechParts.splice(index, 1)
      } else {
        this.selectedTechParts.push(part)
      }
      this.handleSearch()
    },
    
    handleTechStackChange(newSelectedStacks) {
      this.selectedTechStacks = newSelectedStacks
      this.handleSearch()
    },
    
    toggleStatus(status) {
      const index = this.selectedStatuses.indexOf(status)
      if (index > -1) {
        this.selectedStatuses.splice(index, 1)
      } else {
        this.selectedStatuses.push(status)
      }
      this.handleSearch()
    },

    
    toggleExperience(exp) {
      const index = this.selectedExperienceRanges.indexOf(exp)
      if (index > -1) {
        this.selectedExperienceRanges.splice(index, 1)
      } else {
        this.selectedExperienceRanges.push(exp)
      }
      this.handleSearch()
    },

    // UI 메서드들
    toggleAdvancedFilters() {
      this.showAdvancedFilters = !this.showAdvancedFilters
    },

    clearSearch() {
      this.searchQuery = ''
      this.handleSearch()
    },

    // 개별 섹션 초기화
    clearTechParts() {
      this.selectedTechParts = []
      this.handleSearch()
    },


    clearStatuses() {
      this.selectedStatuses = []
      this.handleSearch()
    },

    clearExperiences() {
      this.selectedExperienceRanges = []
      this.handleSearch()
    },

    // 전체 초기화
    clearAllFilters() {
      this.searchQuery = ''
      this.selectedTechParts = []
      this.selectedTechStacks = []
      this.selectedStatuses = []
      this.selectedExperienceRanges = []
      this.handleSearch()
    },
    
    // 유틸리티 메서드들
    getActiveFilterCount() {
      return this.selectedTechParts.length + 
             this.selectedTechStacks.length + 
             this.selectedStatuses.length + 
             this.selectedExperienceRanges.length
    },
    
    getStatusClass(status) {
      const classes = {
        'RECRUITING': 'status-recruiting',
        'IN_PROGRESS': 'status-progress',
        'COMPLETED': 'status-completed',
        'CANCELLED': 'status-cancelled'
      }
      return classes[status] || 'status-default'
    },

    getExperienceClass(exp) {
      const classes = {
        'JUNIOR': 'exp-junior',
        'MIDDLE': 'exp-middle',
        'SENIOR': 'exp-senior'
      }
      return classes[exp] || 'exp-default'
    },
    
    getExperienceEmoji(exp) {
      const emojis = {
        'JUNIOR': '🌱',
        'MIDDLE': '🌿',
        'SENIOR': '🌳'
      }
      return emojis[exp] || '👤'
    }
  }
}
</script>

<style scoped>
.enhanced-search-section {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 32px;
}

/* 메인 검색 컨테이너 */
.main-search-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.search-input-wrapper {
  position: relative;
  width: 100%;
  max-width: 600px;
  display: flex;
  align-items: center;
}

.search-icon {
  position: absolute;
  left: 16px;
  color: #4CAF50;
  z-index: 1;
  pointer-events: none;
}

.main-search-input {
  width: 100%;
  height: 56px;
  padding: 0 50px 0 50px;
  border: 2px solid #E5E7EB;
  border-radius: 28px;
  font-size: 16px;
  background: #fff;
  transition: all 0.3s ease;
  outline: none;
}

.main-search-input:focus {
  border-color: #4CAF50;
  box-shadow: 0 0 0 4px rgba(76, 175, 80, 0.1);
}

.main-search-input::placeholder {
  color: #9CA3AF;
}

.clear-search-btn {
  position: absolute;
  right: 16px;
  background: none;
  border: none;
  color: #6B7280;
  cursor: pointer;
  padding: 4px;
  border-radius: 50%;
  transition: all 0.2s ease;
}

.clear-search-btn:hover {
  background: rgba(0, 0, 0, 0.1);
  color: #4B5563;
}


/* 상태 인디케이터 */
.status-indicator {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}

.status-recruiting { background: #10B981; }
.status-progress { background: #F59E0B; }
.status-completed { background: #6366F1; }
.status-cancelled { background: #EF4444; }

/* 고급 필터 토글 */
.advanced-filters-toggle {
  display: flex;
  justify-content: center;
}

.toggle-btn {
  position: relative;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  border: 2px solid #E5E7EB;
  border-radius: 12px;
  background: #fff;
  color: #374151;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.toggle-btn:hover,
.toggle-btn.expanded {
  border-color: #4CAF50;
  color: #4CAF50;
  background: rgba(76, 175, 80, 0.05);
}

.toggle-icon {
  transition: transform 0.3s ease;
}

.toggle-icon.rotated {
  transform: rotate(180deg);
}

.filter-count {
  position: absolute;
  top: -8px;
  right: -8px;
  background: #EF4444;
  color: #fff;
  font-size: 11px;
  font-weight: 700;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid #fff;
}

/* 고급 필터 패널 */
.advanced-filters-panel {
  background: #fff;
  border: 2px solid #E5E7EB;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.filter-section {
  margin-bottom: 24px;
}

.filter-section:last-of-type {
  margin-bottom: 0;
}

.filter-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.filter-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  font-weight: 700;
  color: #1F2937;
}

.title-icon {
  font-size: 18px;
}

.clear-section-btn {
  background: none;
  border: none;
  color: #6B7280;
  font-size: 12px;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 6px;
  transition: all 0.2s ease;
}

.clear-section-btn:hover {
  background: rgba(0, 0, 0, 0.05);
  color: #4B5563;
}

/* 필터 칩들 */
.filter-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.filter-chip {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  border: 2px solid #E5E7EB;
  border-radius: 20px;
  background: #fff;
  color: #374151;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.filter-chip:hover {
  border-color: #4CAF50;
  color: #4CAF50;
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(76, 175, 80, 0.15);
}

.filter-chip.active {
  background: #4CAF50;
  border-color: #4CAF50;
  color: #fff;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(76, 175, 80, 0.25);
}

.chip-check {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  margin-left: 2px;
}

/* 특별한 칩 스타일들 */
.tech-stack.active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-color: #667eea;
}

.status-chip {
  padding-left: 10px;
}

.experience-chip {
  padding-left: 10px;
}

.experience-icon {
  width: 18px;
  height: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  font-size: 12px;
}

.exp-junior { background: rgba(34, 197, 94, 0.2); }
.exp-middle { background: rgba(59, 130, 246, 0.2); }
.exp-senior { background: rgba(168, 85, 247, 0.2); }

/* 필터 액션 */
.filter-actions {
  margin-top: 20px;
  padding-top: 20px;
  border-top: 2px solid #F3F4F6;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.active-filters-summary {
  font-size: 14px;
  font-weight: 600;
  color: #4CAF50;
  background: rgba(76, 175, 80, 0.1);
  padding: 6px 12px;
  border-radius: 16px;
}

.clear-all-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%);
  border: 2px solid #fca5a5;
  border-radius: 12px;
  color: #dc2626;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.clear-all-btn:hover {
  background: linear-gradient(135deg, #dc2626 0%, #ef4444 100%);
  border-color: #dc2626;
  color: #fff;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(220, 38, 38, 0.25);
}

/* 애니메이션 */
.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-down-enter-from {
  opacity: 0;
  transform: translateY(-20px) scale(0.95);
}

.slide-down-leave-to {
  opacity: 0;
  transform: translateY(-20px) scale(0.95);
}

/* 반응형 디자인 */
@media (max-width: 768px) {
  .main-search-input {
    height: 48px;
    font-size: 14px;
    padding: 0 45px 0 45px;
  }

  .search-icon {
    left: 14px;
  }

  .clear-search-btn {
    right: 14px;
  }


  .advanced-filters-panel {
    padding: 20px;
  }

  .filter-chips {
    gap: 6px;
  }

  .filter-chip {
    padding: 6px 10px;
    font-size: 12px;
  }

  .filter-actions {
    flex-direction: column;
    gap: 12px;
    align-items: stretch;
  }
}

@media (max-width: 480px) {
  .search-input-wrapper {
    max-width: none;
  }

  .main-search-input {
    height: 44px;
    font-size: 13px;
  }

  .advanced-filters-panel {
    padding: 16px;
  }

  .filter-title {
    font-size: 15px;
  }

  .title-icon {
    font-size: 16px;
  }
}
</style>