<template>
  <div class="tech-stack-selector">
    <!-- 선택된 기술 스택들 (항상 위에 고정) -->
    <div class="selected-section">
      <div v-if="selectedTechnologies.length > 0">
        <div class="selected-header">
          <span class="selected-title">선택된 기술 스택 ({{ selectedTechnologies.length }}개)</span>
          <button @click="clearAll" class="clear-all-btn">전체 해제</button>
        </div>
        <div class="selected-tags">
          <div
            v-for="tech in selectedTechnologies"
            :key="tech.id"
            :class="['tech-tag', 'selected']"
            @click="removeTechnology(tech)"
          >
            <span class="tech-label">{{ tech.name }}</span>
            <i class="bi bi-x-circle-fill tech-remove"></i>
          </div>
        </div>
      </div>
      
      <!-- 빈 상태 안내 -->
      <div v-else class="empty-state">
        <i class="bi bi-stack"></i>
        <span>아래 검색창에서 기술 스택을 선택해주세요</span>
      </div>
    </div>

    <!-- 검색 입력창 (항상 아래에 고정) -->
    <div class="search-container" ref="searchContainer">
      <div class="search-input-wrapper">
        <i class="bi bi-search search-icon"></i>
        <input
          ref="searchInput"
          v-model="searchQuery"
          type="text"
          :class="['search-input', { 'error': error }]"
          placeholder="기술 스택을 검색하세요 (예: React, Python, MySQL)"
          @focus="showDropdown = true"
        />
        <span class="tech-count">{{ filteredTechnologies.length }}개 기술</span>
      </div>
      
      <!-- 검색 결과 드롭다운 -->
      <div v-show="showDropdown && filteredTechnologies.length > 0" class="dropdown">
        <div
          v-for="tech in filteredTechnologies"
          :key="tech.id"
          @mousedown.prevent="toggleTechnology(tech)"
          :class="['dropdown-item', { 'selected': isSelected(tech) }]"
        >
          <span class="tech-category">{{ getCategoryLabel(tech.category) }}</span>
          <span class="tech-name">{{ tech.name }}</span>
          <i v-if="isSelected(tech)" class="bi bi-check-circle-fill tech-check-dropdown"></i>
        </div>
      </div>
      
      <!-- 검색 결과 없음 -->
      <div v-show="showDropdown && filteredTechnologies.length === 0 && searchQuery" class="no-results">
        <i class="bi bi-search"></i>
        <span>검색 결과가 없습니다</span>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'

export default {
  name: 'TechStackSelector',
  props: {
    modelValue: {
      type: Array,
      default: () => []
    },
    error: {
      type: String,
      default: ''
    }
  },
  emits: ['update:modelValue', 'change'],
  setup(props, { emit }) {
    const searchQuery = ref('')
    const showDropdown = ref(false)
    const selectedTechnologies = ref([...props.modelValue])
    const searchContainer = ref(null)
    const searchInput = ref(null)

    const availableTechnologies = ref([
      // Frontend
      { id: 1, name: 'React', category: 'frontend' },
      { id: 2, name: 'Vue.js', category: 'frontend' },
      { id: 3, name: 'Angular', category: 'frontend' },
      { id: 4, name: 'Next.js', category: 'frontend' },
      { id: 5, name: 'Nuxt.js', category: 'frontend' },
      { id: 6, name: 'Svelte', category: 'frontend' },
      { id: 7, name: 'TypeScript', category: 'frontend' },
      { id: 8, name: 'JavaScript', category: 'frontend' },
      
      // Mobile
      { id: 9, name: 'Flutter & Dart', category: 'mobile' },
      { id: 10, name: 'React Native', category: 'mobile' },
      { id: 11, name: 'Swift', category: 'mobile' },
      { id: 12, name: 'Kotlin', category: 'mobile' },
      { id: 13, name: 'Xamarin', category: 'mobile' },
      { id: 14, name: 'Ionic', category: 'mobile' },
      
      // Backend
      { id: 15, name: 'Node.js', category: 'backend' },
      { id: 16, name: 'Python', category: 'backend' },
      { id: 17, name: 'Java', category: 'backend' },
      { id: 18, name: 'C#', category: 'backend' },
      { id: 19, name: 'PHP', category: 'backend' },
      { id: 20, name: 'Ruby', category: 'backend' },
      { id: 21, name: 'Go', category: 'backend' },
      { id: 22, name: 'Rust', category: 'backend' },
      { id: 23, name: 'Spring Boot', category: 'backend' },
      { id: 24, name: 'Django', category: 'backend' },
      { id: 25, name: 'Flask', category: 'backend' },
      { id: 26, name: 'Express.js', category: 'backend' },
      { id: 27, name: 'FastAPI', category: 'backend' },
      
      // Database
      { id: 28, name: 'MySQL', category: 'database' },
      { id: 29, name: 'PostgreSQL', category: 'database' },
      { id: 30, name: 'MongoDB', category: 'database' },
      { id: 31, name: 'Redis', category: 'database' },
      { id: 32, name: 'SQLite', category: 'database' },
      { id: 33, name: 'Oracle', category: 'database' },
      { id: 34, name: 'MariaDB', category: 'database' },
      
      // Cloud & DevOps
      { id: 35, name: 'AWS', category: 'cloud' },
      { id: 36, name: 'Google Cloud', category: 'cloud' },
      { id: 37, name: 'Azure', category: 'cloud' },
      { id: 38, name: 'Docker', category: 'devops' },
      { id: 39, name: 'Kubernetes', category: 'devops' },
      { id: 40, name: 'Jenkins', category: 'devops' },
      { id: 41, name: 'GitHub Actions', category: 'devops' }
    ])

    const filteredTechnologies = computed(() => {
      if (!searchQuery.value.trim()) {
        return [] // 검색어가 없으면 아무것도 표시하지 않음
      }
      
      return availableTechnologies.value.filter(tech =>
        tech.name.toLowerCase().includes(searchQuery.value.toLowerCase())
      )
    })

    const getCategoryLabel = (category) => {
      const labels = {
        frontend: '프론트엔드',
        mobile: '모바일',
        backend: '백엔드',
        database: '데이터베이스',
        cloud: '클라우드',
        devops: 'DevOps'
      }
      return labels[category] || category
    }

    const isSelected = (tech) => {
      return selectedTechnologies.value.some(selected => selected.id === tech.id)
    }

    const toggleTechnology = (tech) => {
      const index = selectedTechnologies.value.findIndex(selected => selected.id === tech.id)

      if (index > -1) {
        selectedTechnologies.value.splice(index, 1)
      } else {
        selectedTechnologies.value.push(tech)
      }

      emit('update:modelValue', [...selectedTechnologies.value])
      emit('change', [...selectedTechnologies.value])
      
      // 선택 후 검색창 포커스 유지하되 드롭다운은 닫지 않음
      setTimeout(() => {
        const searchInput = document.querySelector('.search-input')
        if (searchInput) {
          searchInput.focus()
          showDropdown.value = true // 드롭다운 계속 표시
        }
      }, 50)
    }

    const removeTechnology = (tech) => {
      const index = selectedTechnologies.value.findIndex(selected => selected.id === tech.id)
      if (index > -1) {
        selectedTechnologies.value.splice(index, 1)
        emit('update:modelValue', [...selectedTechnologies.value])
        emit('change', [...selectedTechnologies.value])
      }
    }

    const clearAll = () => {
      selectedTechnologies.value = []
      emit('update:modelValue', [])
      emit('change', [])
    }

    // 외부 클릭 감지로 드롭다운 닫기
    const handleClickOutside = (event) => {
      if (searchContainer.value && !searchContainer.value.contains(event.target)) {
        showDropdown.value = false
      }
    }

    onMounted(() => {
      document.addEventListener('click', handleClickOutside)
    })

    onUnmounted(() => {
      document.removeEventListener('click', handleClickOutside)
    })

    watch(() => props.modelValue, (newValue) => {
      selectedTechnologies.value = [...newValue]
    }, { deep: true })

    return {
      searchQuery,
      showDropdown,
      selectedTechnologies,
      availableTechnologies,
      filteredTechnologies,
      searchContainer,
      searchInput,
      getCategoryLabel,
      isSelected,
      toggleTechnology,
      removeTechnology,
      clearAll
    }
  }
}
</script>

<style scoped>
.tech-stack-selector {
  display: flex;
  width: 100%;
  flex-direction: column;
  align-items: flex-start;
  gap: 20px;
  position: relative;
}

/* 검색 컨테이너 */
.search-container {
  width: 100%;
  position: relative;
}

.search-input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.search-icon {
  position: absolute;
  left: 16px;
  color: var(--color-grey-67, #AAA);
  font-size: 16px;
  z-index: 1;
}

.search-input {
  width: 100%;
  padding: 16px 16px 16px 48px;
  padding-right: 100px;
  border-radius: 8px;
  border: 2px solid var(--color-grey-85, #D9D9D9);
  background: var(--color-white-solid, #FFF);
  font-family: 'Lato', -apple-system, Roboto, Helvetica, sans-serif;
  font-size: 15px;
  color: var(--color-grey-15, #262626);
  transition: all 0.3s ease;
  outline: none;
}

.search-input:focus {
  border-color: var(--www-freemoa-net-pumpkin, #FF7D12);
  box-shadow: 0 0 0 3px rgba(255, 125, 18, 0.1);
}

.search-input.error {
  border-color: #dc3545;
  box-shadow: 0 0 0 3px rgba(220, 53, 69, 0.1);
}

.tech-count {
  position: absolute;
  right: 16px;
  color: var(--color-grey-67, #AAA);
  font-size: 13px;
  background: var(--color-white-solid, #FFF);
  padding: 0 4px;
}

/* 드롭다운 */
.dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: var(--color-white-solid, #FFF);
  border: 2px solid var(--color-grey-85, #D9D9D9);
  border-top: none;
  border-radius: 0 0 8px 8px;
  max-height: 300px;
  overflow-y: auto;
  z-index: 100;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.dropdown-item {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  cursor: pointer;
  transition: all 0.2s ease;
  gap: 12px;
  border-bottom: 1px solid var(--color-grey-95, #F5F5F5);
}

.dropdown-item:hover {
  background: rgba(255, 125, 18, 0.05);
}

.dropdown-item.selected {
  background: rgba(255, 125, 18, 0.1);
  border-left: 3px solid var(--www-freemoa-net-pumpkin, #FF7D12);
}

.tech-category {
  font-size: 11px;
  color: var(--color-grey-67, #AAA);
  background: var(--color-grey-95, #F5F5F5);
  padding: 2px 6px;
  border-radius: 4px;
  min-width: 60px;
  text-align: center;
}

.tech-name {
  flex: 1;
  font-size: 14px;
  color: var(--color-grey-15, #262626);
}

.tech-check-dropdown {
  color: var(--www-freemoa-net-pumpkin, #FF7D12);
  font-size: 16px;
}

.no-results {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  color: var(--color-grey-67, #AAA);
  gap: 8px;
}

/* 선택된 기술 스택 섹션 */
.selected-section {
  width: 100%;
}

.selected-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.selected-title {
  color: var(--color-grey-15, #262626);
  font-family: 'Lato', -apple-system, Roboto, Helvetica, sans-serif;
  font-size: 16px;
  font-weight: 500;
}

.clear-all-btn {
  background: none;
  border: 1px solid var(--color-grey-85, #D9D9D9);
  color: var(--color-grey-50, #808080);
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.clear-all-btn:hover {
  border-color: var(--www-freemoa-net-pumpkin, #FF7D12);
  color: var(--www-freemoa-net-pumpkin, #FF7D12);
}

.selected-tags {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
  padding: 12px;
  background: rgba(255, 125, 18, 0.05);
  border-radius: 8px;
  border: 1px solid rgba(255, 125, 18, 0.2);
}

.tech-tag {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border-radius: 20px;
  border: 2px solid var(--www-freemoa-net-pumpkin, #FF7D12);
  background: var(--www-freemoa-net-pumpkin, #FF7D12);
  color: var(--color-white-solid, #FFF);
  cursor: pointer;
  transition: all 0.3s ease;
  user-select: none;
  animation: slideIn 0.3s ease;
}

.tech-tag:hover {
  background: var(--color-orange-57, #FE7C25);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(255, 125, 18, 0.3);
}

.tech-label {
  font-family: 'Lato', -apple-system, Roboto, Helvetica, sans-serif;
  font-size: 14px;
  font-weight: 500;
  line-height: 1;
  white-space: nowrap;
}

.tech-remove {
  font-size: 14px;
  opacity: 0.8;
  transition: opacity 0.2s ease;
}

.tech-tag:hover .tech-remove {
  opacity: 1;
}

/* 빈 상태 */
.empty-state {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  color: var(--color-grey-67, #AAA);
  gap: 12px;
  border: 2px dashed var(--color-grey-85, #D9D9D9);
  border-radius: 8px;
  width: 100%;
}

.empty-state i {
  font-size: 24px;
}

/* 애니메이션 */
@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(-10px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

/* 스크롤바 스타일 */
.dropdown::-webkit-scrollbar {
  width: 6px;
}

.dropdown::-webkit-scrollbar-track {
  background: var(--color-grey-95, #F5F5F5);
}

.dropdown::-webkit-scrollbar-thumb {
  background: var(--color-grey-85, #D9D9D9);
  border-radius: 3px;
}

.dropdown::-webkit-scrollbar-thumb:hover {
  background: var(--color-grey-75, #C0C0C0);
}

/* 반응형 */
@media (max-width: 768px) {
  .search-input {
    padding-right: 80px;
  }
  
  .tech-count {
    font-size: 12px;
  }
  
  .selected-tags {
    gap: 6px;
  }
  
  .tech-tag {
    padding: 6px 10px;
  }
  
  .tech-label {
    font-size: 13px;
  }
}
</style>