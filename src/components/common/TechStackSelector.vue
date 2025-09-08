<template>
  <div class="tech-stack-selector">
    <!-- 선택된 기술 스택들 (hideSelected prop에 따라 표시/숨김) -->
    <div class="selected-section" :style="{ display: hideSelected ? 'none' : 'block' }">
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
import { getAllTechStacks, searchTechStacks } from '@/api/tech'

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
    },
    hideSelected: {
      type: Boolean,
      default: false
    }
  },
  emits: ['update:modelValue', 'change'],
  setup(props, { emit }) {
    const searchQuery = ref('')
    const showDropdown = ref(false)
    const selectedTechnologies = ref([...props.modelValue])
    const searchContainer = ref(null)
    const searchInput = ref(null)
    const loading = ref(false)

    const availableTechnologies = ref([])

    const filteredTechnologies = computed(() => {
      if (!searchQuery.value.trim()) {
        return [] // 검색어가 없으면 아무것도 표시하지 않음
      }
      
      return searchTechStacks(availableTechnologies.value, searchQuery.value)
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

      searchQuery.value = ''; // 선택 후 검색어 초기화

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

    // 기술 스택 데이터 로드
    const loadTechStacks = async () => {
      try {
        loading.value = true
        const techStacks = await getAllTechStacks()
        
        // 백엔드 응답을 프론트엔드 형식으로 변환
        availableTechnologies.value = techStacks.map(tech => ({
          id: tech.techStackId,
          name: tech.name,
          category: 'general' // 백엔드에 카테고리가 없으므로 기본값 설정
        }))
        
        console.log(`✅ ${techStacks.length}개의 기술 스택 로드 완료`)
      } catch (error) {
        console.error('기술 스택 로드 실패:', error)
        // 실패시 빈 배열 사용 (하드코딩 데이터 제거)
        availableTechnologies.value = []
      } finally {
        loading.value = false
      }
    }

    // 외부 클릭 감지로 드롭다운 닫기
    const handleClickOutside = (event) => {
      if (searchContainer.value && !searchContainer.value.contains(event.target)) {
        showDropdown.value = false
      }
    }

    onMounted(async () => {
      document.addEventListener('click', handleClickOutside)
      await loadTechStacks()
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
      loading,
      getCategoryLabel,
      isSelected,
      toggleTechnology,
      removeTechnology,
      clearAll,
      loadTechStacks
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
  border-color: #4CAF50;
  box-shadow: 0 0 0 3px rgba(76, 175, 80, 0.1);
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
  justify-content: space-between;
  padding: 12px 16px;
  cursor: pointer;
  transition: all 0.2s ease;
  border-bottom: 1px solid var(--color-grey-95, #F5F5F5);
}

.dropdown-item:hover {
  background: rgba(76, 175, 80, 0.05);
}

.dropdown-item.selected {
  background: rgba(76, 175, 80, 0.1);
  border-left: 3px solid #4CAF50;
}

.tech-name {
  flex: 1;
  font-size: 14px;
  color: var(--color-grey-15, #262626);
}

.tech-check-dropdown {
  color: #4CAF50;
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
  border-color: #4CAF50;
  color: #4CAF50;
}

.selected-tags {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
  padding: 12px;
  background: rgba(76, 175, 80, 0.05);
  border-radius: 8px;
  border: 1px solid rgba(76, 175, 80, 0.2);
}

.tech-tag {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border-radius: 20px;
  border: 2px solid #4CAF50;
  background: #4CAF50;
  color: var(--color-white-solid, #FFF);
  cursor: pointer;
  transition: all 0.3s ease;
  user-select: none;
  animation: slideIn 0.3s ease;
}

.tech-tag:hover {
  background: #66BB6A;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(76, 175, 80, 0.3);
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