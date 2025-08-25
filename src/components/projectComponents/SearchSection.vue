<template>
  <div class="search-section">
    <!-- 검색바 -->
    <div class="search-container">
      <div class="search-box">
        <input
          type="text"
          v-model="searchQuery"
          placeholder="제목, 기술 스택, 파트 등을 검색해보세요"
          class="search-input"
          @keypress.enter="handleSearch"
        />
        <button class="search-button" @click="handleSearch">
          <svg width="21" height="22" viewBox="0 0 21 22" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8.79738 15.8852C12.662 15.8852 15.795 12.7522 15.795 8.88759C15.795 5.02294 12.662 1.89001 8.79738 1.89001C4.93273 1.89001 1.7998 5.02294 1.7998 8.88759C1.7998 12.7522 4.93273 15.8852 8.79738 15.8852Z" stroke="#4CAF50" stroke-width="2"/>
            <path d="M14.2949 14.3854L20.2938 20.3842" stroke="#4CAF50" stroke-width="2"/>
          </svg>
        </button>
      </div>
    </div>
    
    <!-- 필터 섹션 -->
    <div class="filters-container">
      <button class="filter-toggle-btn" @click="showFilters = !showFilters">
        <div class="filter-icon">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M4 6H20M4 12H20M4 18H20" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </div>
        <span>필터</span>
        <div class="toggle-icon" :class="{ 'rotated': showFilters }">
          <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
            <path d="M1 1L6 6L11 1" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </div>
      </button>
      
      <div v-if="showFilters" class="filters-panel">
        <!-- 기술 파트 필터 -->
        <div class="filter-group">
          <div class="filter-header">
            <div class="filter-icon-wrapper">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z" fill="currentColor"/>
              </svg>
            </div>
            <label class="filter-label">기술 파트</label>
          </div>
          <div class="filter-tags">
            <button 
              v-for="part in techParts" 
              :key="part" 
              class="filter-tag"
              :class="{ 'active': selectedTechParts.includes(part) }"
              @click="toggleTechPart(part)"
            >
              <span class="tag-text">{{ part }}</span>
              <div v-if="selectedTechParts.includes(part)" class="tag-check">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                  <path d="M20 6L9 17L4 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
            </button>
          </div>
        </div>
        
        <!-- 기술 스택 필터 -->
        <div class="filter-group">
          <div class="filter-header">
            <div class="filter-icon-wrapper">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" stroke-width="2" fill="none"/>
                <path d="M9 9L15 15M15 9L9 15" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              </svg>
            </div>
            <label class="filter-label">기술 스택</label>
          </div>
          <div class="filter-tags">
            <button 
              v-for="stack in techStacks" 
              :key="stack" 
              class="filter-tag"
              :class="{ 'active': selectedTechStacks.includes(stack) }"
              @click="toggleTechStack(stack)"
            >
              <span class="tag-text">{{ stack }}</span>
              <div v-if="selectedTechStacks.includes(stack)" class="tag-check">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                  <path d="M20 6L9 17L4 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
            </button>
          </div>
        </div>
        
        <!-- 프로젝트 상태 필터 (프로젝트용) -->
        <div v-if="type === 'project'" class="filter-group">
          <div class="filter-header">
            <div class="filter-icon-wrapper">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" fill="none"/>
                <path d="M12 6V12L16 14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              </svg>
            </div>
            <label class="filter-label">프로젝트 상태</label>
          </div>
          <div class="filter-tags">
            <button 
              v-for="status in projectStatuses" 
              :key="status.value" 
              class="filter-tag status-tag"
              :class="{ 'active': selectedStatuses.includes(status.value) }"
              @click="toggleStatus(status.value)"
            >
              <div class="status-dot" :class="getStatusColor(status.value)"></div>
              <span class="tag-text">{{ status.label }}</span>
              <div v-if="selectedStatuses.includes(status.value)" class="tag-check">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                  <path d="M20 6L9 17L4 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
            </button>
          </div>
        </div>
        
        <!-- 경력 필터 (포트폴리오용) -->
        <div v-if="type === 'portfolio'" class="filter-group">
          <div class="filter-header">
            <div class="filter-icon-wrapper">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M20 7H4C2.9 7 2 7.9 2 9V18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V9C22 7.9 21.1 7 20 7Z" stroke="currentColor" stroke-width="2" fill="none"/>
                <path d="M16 21V5C16 4.4 15.6 4 15 4H9C8.4 4 8 4.4 8 5V21" stroke="currentColor" stroke-width="2"/>
              </svg>
            </div>
            <label class="filter-label">경력</label>
          </div>
          <div class="filter-tags">
            <button 
              v-for="exp in experienceRanges" 
              :key="exp.value" 
              class="filter-tag experience-tag"
              :class="{ 'active': selectedExperienceRanges.includes(exp.value) }"
              @click="toggleExperience(exp.value)"
            >
              <div class="experience-icon" :class="getExperienceLevel(exp.value)">
                <span>{{ getExperienceEmoji(exp.value) }}</span>
              </div>
              <span class="tag-text">{{ exp.label }}</span>
              <div v-if="selectedExperienceRanges.includes(exp.value)" class="tag-check">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                  <path d="M20 6L9 17L4 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
            </button>
          </div>
        </div>
        
        <!-- 필터 초기화 버튼 -->
        <div class="filter-actions">
          <div class="selected-count" v-if="getTotalSelectedCount() > 0">
            {{ getTotalSelectedCount() }}개 필터 적용됨
          </div>
          <button class="clear-filters-btn" @click="clearFilters" v-if="getTotalSelectedCount() > 0">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M3 6H21M8 6V4C8 3.4 8.4 3 9 3H15C15.6 3 16 3.4 16 4V6M19 6V20C19 20.6 18.6 21 18 21H6C5.4 21 5 20.6 5 20V6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
            전체 초기화
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useTechTagStore } from '@/stores/techTagStore'

export default {
  name: 'SearchSection',
  props: {
    type: {
      type: String,
      default: 'project', // 'project' 또는 'portfolio'
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
      showFilters: false,
      selectedTechParts: [],
      selectedTechStacks: [],
      selectedStatuses: [],
      selectedExperienceRanges: [],
      
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
  },
  computed: {
    techParts() {
      return this.techTagStore.techParts
    },
    techStacks() {
      return this.techTagStore.techStacks
    }
  },
  methods: {
    async loadTechTags() {
      try {
        await this.techTagStore.loadTechTags()
      } catch (error) {
        console.error('기술 태그 로드 실패:', error)
      }
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
      console.log('검색 파라미터:', searchParams)
    },
    
    handleFilterChange() {
      // 필터 변경 시 자동으로 검색 수행
      this.handleSearch()
    },
    
    // 새로운 토글 메서드들
    toggleTechPart(part) {
      const index = this.selectedTechParts.indexOf(part)
      if (index > -1) {
        this.selectedTechParts.splice(index, 1)
      } else {
        this.selectedTechParts.push(part)
      }
      this.handleFilterChange()
    },
    
    toggleTechStack(stack) {
      const index = this.selectedTechStacks.indexOf(stack)
      if (index > -1) {
        this.selectedTechStacks.splice(index, 1)
      } else {
        this.selectedTechStacks.push(stack)
      }
      this.handleFilterChange()
    },
    
    toggleStatus(status) {
      const index = this.selectedStatuses.indexOf(status)
      if (index > -1) {
        this.selectedStatuses.splice(index, 1)
      } else {
        this.selectedStatuses.push(status)
      }
      this.handleFilterChange()
    },
    
    toggleExperience(exp) {
      const index = this.selectedExperienceRanges.indexOf(exp)
      if (index > -1) {
        this.selectedExperienceRanges.splice(index, 1)
      } else {
        this.selectedExperienceRanges.push(exp)
      }
      this.handleFilterChange()
    },
    
    // 유틸리티 메서드들
    getTotalSelectedCount() {
      return this.selectedTechParts.length + 
             this.selectedTechStacks.length + 
             this.selectedStatuses.length + 
             this.selectedExperienceRanges.length
    },
    
    getStatusColor(status) {
      const colors = {
        'RECRUITING': 'recruiting',
        'IN_PROGRESS': 'in-progress',
        'COMPLETED': 'completed',
        'CANCELLED': 'cancelled'
      }
      return colors[status] || 'default'
    },
    
    getExperienceLevel(exp) {
      const levels = {
        'JUNIOR': 'junior',
        'MIDDLE': 'middle',  
        'SENIOR': 'senior'
      }
      return levels[exp] || 'default'
    },
    
    getExperienceEmoji(exp) {
      const emojis = {
        'JUNIOR': '🌱',
        'MIDDLE': '🌿',
        'SENIOR': '🌳'
      }
      return emojis[exp] || '👤'
    },
    
    clearFilters() {
      this.searchQuery = ''
      this.selectedTechParts = []
      this.selectedTechStacks = []
      this.selectedStatuses = []
      this.selectedExperienceRanges = []
      this.handleSearch()
    }
  }
}
</script>

<style scoped>
.search-section {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;
}

.search-container {
  width: 60vw; 
  max-width: 700px;
  min-width: 500px;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50px; 
  background-color: #E8F5E8; 
  border: 1px solid #C8E6C9; 
  box-shadow: 0 2px 4px 0 rgba(76, 175, 80, 0.1); 
  
  position: relative; 
  padding: 0; 

  transition: background-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out, border-color 0.2s ease-in-out;
}

.search-container:focus-within {
  background-color: #fff;
  box-shadow: 0 4px 12px rgba(76, 175, 80, 0.2);
  border-color: #4CAF50;
}

.search-box {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between; 
  background: transparent;
  padding: 0 20px;
}

.search-input {
  flex-grow: 1;
  padding: 0 10px;
  border: none;
  outline: none;
  background: transparent;
  color: #262626;
  font-family: 'Inter', -apple-system, Roboto, Helvetica, sans-serif;
  font-size: 16px;
  font-weight: 400;
  line-height: normal;
  height: 100%;
}

.search-input::placeholder {
  color: #81C784;
  font-weight: 400;
}

.search-button {
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px; 
  display: flex; 
  align-items: center;
  justify-content: center;
  width: 36px; 
  height: 36px; 
  border-radius: 50%;
  transition: all 0.2s ease;
}

.search-button:hover {
  background-color: rgba(76, 175, 80, 0.1);
  transform: scale(1.05);
}

.search-button:active {
  transform: scale(0.95);
}

.search-button svg path {
  stroke: #4CAF50;
  transition: stroke 0.2s ease;
}

.search-button:hover svg path {
  stroke: #2E7D32;
}

/* 필터 섹션 스타일 */
.filters-container {
  width: 60vw; 
  max-width: 700px;
  min-width: 500px;
  margin-top: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.filter-toggle-btn {
  display: flex;
  align-items: center;
  gap: 12px;
  background: linear-gradient(135deg, #fff 0%, #f8f9fa 100%);
  border: 2px solid #e9ecef;
  border-radius: 16px;
  padding: 12px 20px;
  font-size: 14px;
  font-weight: 600;
  color: #495057;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  position: relative;
  overflow: hidden;
}

.filter-toggle-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(76, 175, 80, 0.1), transparent);
  transition: left 0.5s;
}

.filter-toggle-btn:hover::before {
  left: 100%;
}

.filter-toggle-btn:hover {
  border-color: #4CAF50;
  color: #4CAF50;
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(76, 175, 80, 0.15);
}

.filter-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  color: #4CAF50;
}

.toggle-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.toggle-icon.rotated {
  transform: rotate(180deg);
}

.filters-panel {
  width: 100%;
  background: linear-gradient(135deg, #fff 0%, #fdfdfd 100%);
  border: 2px solid #f1f3f4;
  border-radius: 20px;
  padding: 24px;
  margin-top: 12px;
  box-shadow: 
    0 10px 40px rgba(0, 0, 0, 0.08),
    0 2px 8px rgba(0, 0, 0, 0.04);
  animation: slideDown 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  backdrop-filter: blur(10px);
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-15px) scale(0.98);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.filter-group {
  margin-bottom: 28px;
}

.filter-group:last-of-type {
  margin-bottom: 0;
}

.filter-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
}

.filter-icon-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  color: #4CAF50;
}

.filter-label {
  font-size: 15px;
  font-weight: 700;
  color: #2d3748;
  margin: 0;
  letter-spacing: -0.01em;
}

.filter-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.filter-tag {
  display: flex;
  align-items: center;
  gap: 8px;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border: 2px solid #e9ecef;
  border-radius: 12px;
  padding: 8px 12px;
  font-size: 13px;
  font-weight: 500;
  color: #495057;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  user-select: none;
}

.filter-tag::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.5), transparent);
  transition: left 0.5s;
}

.filter-tag:hover::before {
  left: 100%;
}

.filter-tag:hover {
  transform: translateY(-2px) scale(1.05);
  border-color: #4CAF50;
  color: #4CAF50;
  box-shadow: 0 4px 12px rgba(76, 175, 80, 0.2);
}

.filter-tag.active {
  background: linear-gradient(135deg, #4CAF50 0%, #66BB6A 100%);
  border-color: #4CAF50;
  color: #fff;
  transform: scale(1.02);
  box-shadow: 0 4px 12px rgba(76, 175, 80, 0.3);
}

.filter-tag.active:hover {
  transform: translateY(-2px) scale(1.05);
  box-shadow: 0 6px 16px rgba(76, 175, 80, 0.4);
}

.tag-text {
  font-weight: 600;
}

.tag-check {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  margin-left: 2px;
}

/* 특별한 필터 타입들 */
.status-tag {
  padding-left: 10px;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin-right: 2px;
}

.status-dot.recruiting {
  background: #10B981;
  box-shadow: 0 0 0 2px rgba(16, 185, 129, 0.2);
}

.status-dot.in-progress {
  background: #F59E0B;
  box-shadow: 0 0 0 2px rgba(245, 158, 11, 0.2);
}

.status-dot.completed {
  background: #6366F1;
  box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.2);
}

.status-dot.cancelled {
  background: #EF4444;
  box-shadow: 0 0 0 2px rgba(239, 68, 68, 0.2);
}

.experience-tag {
  padding-left: 10px;
}

.experience-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  border-radius: 6px;
  font-size: 12px;
}

.experience-icon.junior {
  background: rgba(34, 197, 94, 0.2);
}

.experience-icon.middle {
  background: rgba(59, 130, 246, 0.2);
}

.experience-icon.senior {
  background: rgba(168, 85, 247, 0.2);
}

.filter-actions {
  margin-top: 24px;
  padding-top: 20px;
  border-top: 2px solid #f1f3f4;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.selected-count {
  font-size: 13px;
  font-weight: 600;
  color: #4CAF50;
  background: rgba(76, 175, 80, 0.1);
  padding: 6px 12px;
  border-radius: 20px;
  border: 1px solid rgba(76, 175, 80, 0.2);
}

.clear-filters-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%);
  border: 2px solid #fca5a5;
  border-radius: 12px;
  padding: 8px 16px;
  font-size: 13px;
  font-weight: 600;
  color: #dc2626;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.clear-filters-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  transition: left 0.5s;
}

.clear-filters-btn:hover::before {
  left: 100%;
}

.clear-filters-btn:hover {
  background: linear-gradient(135deg, #dc2626 0%, #ef4444 100%);
  border-color: #dc2626;
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(220, 38, 38, 0.3);
}

/* 반응형 디자인 */
@media (max-width: 768px) {
  .search-container {
    width: 80vw;
    min-width: 300px;
    max-width: 500px;
  }
  
  .filters-container {
    width: 80vw;
    min-width: 300px;
    max-width: 500px;
  }
  
  .filter-options {
    gap: 8px;
  }
  
  .filters-panel {
    padding: 16px;
  }
}

@media (max-width: 480px) {
  .search-container {
    width: 90vw;
    min-width: 280px;
    height: 45px;
  }
  
  .filters-container {
    width: 90vw;
    min-width: 280px;
  }

  .search-input {
    font-size: 14px;
  }

  .search-button {
    width: 32px;
    height: 32px;
  }

  .search-button svg {
    width: 18px;
    height: 18px;
  }
  
  .filter-options {
    gap: 6px;
  }
  
  .filter-text {
    font-size: 12px;
  }
  
  .filters-panel {
    padding: 12px;
  }
}
</style>