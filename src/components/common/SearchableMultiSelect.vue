<template>
  <div class="searchable-multi-select" ref="container">
    <!-- 선택된 아이템들 표시 -->
    <div class="selected-items" v-if="selectedItems.length > 0">
      <div class="selected-count">{{ selectedItems.length }}개 선택됨</div>
      <div class="selected-tags">
        <span
          v-for="item in selectedItems.slice(0, maxVisibleTags)"
          :key="item"
          class="selected-tag"
        >
          {{ item }}
          <button @click="removeItem(item)" class="remove-btn">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2"/>
            </svg>
          </button>
        </span>
        <span v-if="selectedItems.length > maxVisibleTags" class="more-count">
          +{{ selectedItems.length - maxVisibleTags }}개 더
        </span>
      </div>
      <button @click="clearAll" class="clear-all-selected">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
          <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6h18" stroke="currentColor" stroke-width="2"/>
        </svg>
        전체 해제
      </button>
    </div>

    <!-- 드롭다운 트리거 -->
    <div class="dropdown-trigger" @click="toggleDropdown">
      <div class="trigger-content">
        <div class="trigger-icon">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2"/>
            <path d="M12 1v6m0 6v6" stroke="currentColor" stroke-width="2"/>
          </svg>
        </div>
        <span class="trigger-text">
          {{ selectedItems.length > 0 ? `${label} (${selectedItems.length})` : `${label} 선택` }}
        </span>
        <div class="dropdown-arrow" :class="{ 'rotated': isOpen }">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path d="M6 9l6 6 6-6" stroke="currentColor" stroke-width="2"/>
          </svg>
        </div>
      </div>
    </div>

    <!-- 드롭다운 메뉴 -->
    <Transition name="dropdown-slide">
      <div v-if="isOpen" class="dropdown-menu" @click.stop>
        <!-- 검색 입력 -->
        <div class="search-section">
          <div class="search-input-wrapper">
            <div class="search-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <circle cx="11" cy="11" r="8" stroke="currentColor" stroke-width="2"/>
                <path d="m21 21-4.35-4.35" stroke="currentColor" stroke-width="2"/>
              </svg>
            </div>
            <input
              ref="searchInput"
              v-model="searchQuery"
              type="text"
              class="search-input"
              :placeholder="`${label} 검색...`"
              @input="handleSearch"
            />
            <button v-if="searchQuery" @click="clearSearch" class="clear-search">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2"/>
              </svg>
            </button>
          </div>
        </div>

        <!-- 인기/추천 항목들 (검색어가 없을 때만 표시) -->
        <div v-if="!searchQuery && popularItems.length > 0" class="popular-section">
          <div class="section-header">
            <div class="section-title">
              <span class="title-icon">🔥</span>
              인기 {{ label }}
            </div>
          </div>
          <div class="popular-items">
            <button
              v-for="item in popularItems"
              :key="`popular-${item}`"
              class="option-item popular"
              :class="{ 'selected': selectedItems.includes(item) }"
              @click="toggleItem(item)"
            >
              <div class="option-content">
                <span class="option-text">{{ item }}</span>
                <div v-if="selectedItems.includes(item)" class="check-icon">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <path d="M20 6L9 17L4 12" stroke="currentColor" stroke-width="2"/>
                  </svg>
                </div>
              </div>
            </button>
          </div>
        </div>

        <!-- 카테고리별 그룹 (검색어가 없을 때) -->
        <div v-if="!searchQuery && categorizedItems.length > 0" class="categories-section">
          <div
            v-for="category in categorizedItems"
            :key="category.name"
            class="category-group"
          >
            <div class="category-header" @click="toggleCategory(category.name)">
              <div class="category-title">
                <span class="category-icon">{{ category.icon }}</span>
                <span class="category-name">{{ category.name }}</span>
                <span class="category-count">({{ category.items.length }})</span>
              </div>
              <div class="category-arrow" :class="{ 'expanded': expandedCategories.includes(category.name) }">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path d="M9 18l6-6-6-6" stroke="currentColor" stroke-width="2"/>
                </svg>
              </div>
            </div>
            <Transition name="category-expand">
              <div v-if="expandedCategories.includes(category.name)" class="category-items">
                <button
                  v-for="item in category.items"
                  :key="`category-${item}`"
                  class="option-item"
                  :class="{ 'selected': selectedItems.includes(item) }"
                  @click="toggleItem(item)"
                >
                  <div class="option-content">
                    <span class="option-text">{{ item }}</span>
                    <div v-if="selectedItems.includes(item)" class="check-icon">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                        <path d="M20 6L9 17L4 12" stroke="currentColor" stroke-width="2"/>
                      </svg>
                    </div>
                  </div>
                </button>
              </div>
            </Transition>
          </div>
        </div>

        <!-- 검색 결과 -->
        <div v-if="searchQuery" class="search-results">
          <div class="section-header">
            <div class="section-title">
              검색 결과 ({{ filteredItems.length }}개)
            </div>
          </div>
          <div v-if="filteredItems.length > 0" class="search-items">
            <button
              v-for="item in paginatedFilteredItems"
              :key="`search-${item}`"
              class="option-item"
              :class="{ 'selected': selectedItems.includes(item) }"
              @click="toggleItem(item)"
            >
              <div class="option-content">
                <span class="option-text" v-html="highlightMatch(item)"></span>
                <div v-if="selectedItems.includes(item)" class="check-icon">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <path d="M20 6L9 17L4 12" stroke="currentColor" stroke-width="2"/>
                  </svg>
                </div>
              </div>
            </button>
          </div>
          <div v-else class="no-results">
            <div class="no-results-icon">🔍</div>
            <div class="no-results-text">검색 결과가 없습니다</div>
          </div>
          
          <!-- 더보기 버튼 (검색 결과가 많을 때) -->
          <button 
            v-if="filteredItems.length > displayedCount" 
            @click="loadMore" 
            class="load-more-btn"
          >
            더보기 ({{ filteredItems.length - displayedCount }}개 남음)
          </button>
        </div>

        <!-- 드롭다운 푸터 -->
        <div class="dropdown-footer">
          <div class="footer-stats">
            {{ selectedItems.length }}/{{ allItems.length }} 선택됨
          </div>
          <div class="footer-actions">
            <button @click="clearAll" class="footer-btn clear" :disabled="selectedItems.length === 0">
              초기화
            </button>
            <button @click="closeDropdown" class="footer-btn apply">
              적용
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script>
import { debounce } from 'lodash'

export default {
  name: 'SearchableMultiSelect',
  props: {
    label: {
      type: String,
      default: '항목'
    },
    items: {
      type: Array,
      default: () => []
    },
    popularItems: {
      type: Array,
      default: () => []
    },
    categories: {
      type: Array,
      default: () => []
    },
    modelValue: {
      type: Array,
      default: () => []
    },
    maxVisibleTags: {
      type: Number,
      default: 3
    }
  },
  emits: ['update:modelValue', 'change'],
  data() {
    return {
      isOpen: false,
      searchQuery: '',
      selectedItems: [...this.modelValue],
      expandedCategories: [],
      displayedCount: 20, // 초기 표시 개수
      loadSize: 20 // 더보기 클릭 시 추가 로드 개수
    }
  },
  computed: {
    allItems() {
      return this.items || []
    },
    
    filteredItems() {
      if (!this.searchQuery) return []
      const query = this.searchQuery.toLowerCase()
      return this.allItems.filter(item => 
        item.toLowerCase().includes(query)
      )
    },
    
    paginatedFilteredItems() {
      return this.filteredItems.slice(0, this.displayedCount)
    },
    
    categorizedItems() {
      if (!this.categories.length) return []
      return this.categories.map(category => ({
        ...category,
        items: this.allItems.filter(item => category.items.includes(item))
      })).filter(category => category.items.length > 0)
    }
  },
  watch: {
    modelValue: {
      handler(newValue) {
        this.selectedItems = [...newValue]
      },
      deep: true
    },
    selectedItems: {
      handler(newValue) {
        this.$emit('update:modelValue', newValue)
        this.$emit('change', newValue)
      },
      deep: true
    }
  },
  mounted() {
    this.debouncedSearch = debounce(this.handleSearch, 300)
    document.addEventListener('click', this.handleClickOutside)
  },
  beforeUnmount() {
    document.removeEventListener('click', this.handleClickOutside)
  },
  methods: {
    toggleDropdown() {
      this.isOpen = !this.isOpen
      if (this.isOpen) {
        this.$nextTick(() => {
          this.$refs.searchInput?.focus()
        })
      }
    },

    closeDropdown() {
      this.isOpen = false
      this.searchQuery = ''
      this.displayedCount = 20
    },

    handleClickOutside(event) {
      if (!this.$refs.container.contains(event.target)) {
        this.closeDropdown()
      }
    },

    toggleItem(item) {
      const index = this.selectedItems.indexOf(item)
      if (index > -1) {
        this.selectedItems.splice(index, 1)
      } else {
        this.selectedItems.push(item)
      }
    },

    removeItem(item) {
      const index = this.selectedItems.indexOf(item)
      if (index > -1) {
        this.selectedItems.splice(index, 1)
      }
    },

    clearAll() {
      this.selectedItems = []
    },

    clearSearch() {
      this.searchQuery = ''
      this.displayedCount = 20
    },

    handleSearch() {
      this.displayedCount = 20 // 검색 시 초기화
    },

    loadMore() {
      this.displayedCount += this.loadSize
    },

    toggleCategory(categoryName) {
      const index = this.expandedCategories.indexOf(categoryName)
      if (index > -1) {
        this.expandedCategories.splice(index, 1)
      } else {
        this.expandedCategories.push(categoryName)
      }
    },

    highlightMatch(text) {
      if (!this.searchQuery) return text
      const regex = new RegExp(`(${this.searchQuery})`, 'gi')
      return text.replace(regex, '<mark>$1</mark>')
    }
  }
}
</script>

<style scoped>
.searchable-multi-select {
  position: relative;
  width: 100%;
}

/* 선택된 아이템들 */
.selected-items {
  margin-bottom: 12px;
  padding: 12px;
  background: rgba(76, 175, 80, 0.05);
  border: 1px solid rgba(76, 175, 80, 0.2);
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.selected-count {
  font-size: 12px;
  font-weight: 600;
  color: #4CAF50;
}

.selected-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  align-items: center;
}

.selected-tag {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  background: #4CAF50;
  color: #fff;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  animation: tagAppear 0.2s ease-out;
}

.remove-btn {
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.8);
  cursor: pointer;
  padding: 2px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  transition: all 0.2s ease;
}

.remove-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  color: #fff;
}

.more-count {
  padding: 4px 8px;
  background: #6B7280;
  color: #fff;
  border-radius: 12px;
  font-size: 12px;
}

.clear-all-selected {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  background: none;
  border: 1px solid #DC2626;
  border-radius: 8px;
  color: #DC2626;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-left: auto;
}

.clear-all-selected:hover {
  background: #DC2626;
  color: #fff;
}

/* 드롭다운 트리거 */
.dropdown-trigger {
  cursor: pointer;
  user-select: none;
}

.trigger-content {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  border: 2px solid #E5E7EB;
  border-radius: 12px;
  background: #fff;
  transition: all 0.3s ease;
}

.trigger-content:hover {
  border-color: #4CAF50;
  background: rgba(76, 175, 80, 0.02);
}

.trigger-icon {
  color: #4CAF50;
}

.trigger-text {
  flex: 1;
  font-size: 14px;
  font-weight: 500;
  color: #374151;
}

.dropdown-arrow {
  color: #6B7280;
  transition: transform 0.3s ease;
}

.dropdown-arrow.rotated {
  transform: rotate(180deg);
}

/* 드롭다운 메뉴 */
.dropdown-menu {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: #fff;
  border: 2px solid #E5E7EB;
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  max-height: 400px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

/* 검색 섹션 */
.search-section {
  padding: 16px;
  border-bottom: 1px solid #F3F4F6;
  background: #F9FAFB;
}

.search-input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.search-icon {
  position: absolute;
  left: 12px;
  color: #6B7280;
}

.search-input {
  width: 100%;
  padding: 10px 12px 10px 36px;
  border: 1px solid #D1D5DB;
  border-radius: 8px;
  font-size: 14px;
  outline: none;
  transition: border-color 0.2s ease;
}

.search-input:focus {
  border-color: #4CAF50;
}

.clear-search {
  position: absolute;
  right: 8px;
  background: none;
  border: none;
  color: #6B7280;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
}

.clear-search:hover {
  background: rgba(0, 0, 0, 0.05);
}

/* 섹션 헤더 */
.section-header {
  padding: 12px 16px 8px;
  border-bottom: 1px solid #F3F4F6;
  background: #F9FAFB;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  font-weight: 600;
  color: #6B7280;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.title-icon {
  font-size: 14px;
}

/* 인기 섹션 */
.popular-section {
  border-bottom: 1px solid #F3F4F6;
}

.popular-items {
  max-height: 120px;
  overflow-y: auto;
}

/* 카테고리 섹션 */
.categories-section {
  flex: 1;
  overflow-y: auto;
}

.category-group {
  border-bottom: 1px solid #F3F4F6;
}

.category-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.category-header:hover {
  background: rgba(76, 175, 80, 0.05);
}

.category-title {
  display: flex;
  align-items: center;
  gap: 8px;
}

.category-icon {
  font-size: 16px;
}

.category-name {
  font-size: 14px;
  font-weight: 600;
  color: #374151;
}

.category-count {
  font-size: 12px;
  color: #6B7280;
}

.category-arrow {
  color: #6B7280;
  transition: transform 0.3s ease;
}

.category-arrow.expanded {
  transform: rotate(90deg);
}

.category-items {
  background: rgba(76, 175, 80, 0.02);
  max-height: 200px;
  overflow-y: auto;
}

/* 검색 결과 & 옵션 아이템 */
.search-results {
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.search-items {
  flex: 1;
  overflow-y: auto;
}

.option-item {
  width: 100%;
  background: none;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.option-item:hover {
  background: rgba(76, 175, 80, 0.05);
}

.option-item.selected {
  background: rgba(76, 175, 80, 0.1);
}

.option-item.popular {
  position: relative;
}

.option-item.popular::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 3px;
  background: #FF6B35;
}

.option-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 16px;
  text-align: left;
}

.option-text {
  font-size: 14px;
  color: #374151;
}

.option-text :deep(mark) {
  background: #FDE047;
  color: #374151;
  padding: 1px 2px;
  border-radius: 2px;
}

.check-icon {
  color: #4CAF50;
  flex-shrink: 0;
}

/* 결과 없음 */
.no-results {
  padding: 32px 16px;
  text-align: center;
  color: #6B7280;
}

.no-results-icon {
  font-size: 32px;
  margin-bottom: 8px;
}

.no-results-text {
  font-size: 14px;
}

/* 더보기 버튼 */
.load-more-btn {
  margin: 8px 16px;
  padding: 8px 16px;
  background: rgba(76, 175, 80, 0.1);
  border: 1px solid rgba(76, 175, 80, 0.3);
  border-radius: 8px;
  color: #4CAF50;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.load-more-btn:hover {
  background: rgba(76, 175, 80, 0.2);
}

/* 드롭다운 푸터 */
.dropdown-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  border-top: 1px solid #F3F4F6;
  background: #F9FAFB;
}

.footer-stats {
  font-size: 12px;
  color: #6B7280;
}

.footer-actions {
  display: flex;
  gap: 8px;
}

.footer-btn {
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.footer-btn.clear {
  background: none;
  border: 1px solid #D1D5DB;
  color: #6B7280;
}

.footer-btn.clear:not(:disabled):hover {
  background: #F3F4F6;
}

.footer-btn.clear:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.footer-btn.apply {
  background: #4CAF50;
  border: 1px solid #4CAF50;
  color: #fff;
}

.footer-btn.apply:hover {
  background: #45A049;
}

/* 애니메이션 */
.dropdown-slide-enter-active,
.dropdown-slide-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.dropdown-slide-enter-from {
  opacity: 0;
  transform: translateY(-10px) scale(0.95);
}

.dropdown-slide-leave-to {
  opacity: 0;
  transform: translateY(-10px) scale(0.95);
}

.category-expand-enter-active,
.category-expand-leave-active {
  transition: all 0.3s ease;
}

.category-expand-enter-from,
.category-expand-leave-to {
  opacity: 0;
  max-height: 0;
}

@keyframes tagAppear {
  from {
    opacity: 0;
    transform: scale(0.8);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

/* 스크롤바 스타일링 */
.search-items::-webkit-scrollbar,
.popular-items::-webkit-scrollbar,
.category-items::-webkit-scrollbar,
.categories-section::-webkit-scrollbar {
  width: 6px;
}

.search-items::-webkit-scrollbar-track,
.popular-items::-webkit-scrollbar-track,
.category-items::-webkit-scrollbar-track,
.categories-section::-webkit-scrollbar-track {
  background: #F3F4F6;
}

.search-items::-webkit-scrollbar-thumb,
.popular-items::-webkit-scrollbar-thumb,
.category-items::-webkit-scrollbar-thumb,
.categories-section::-webkit-scrollbar-thumb {
  background: rgba(76, 175, 80, 0.3);
  border-radius: 3px;
}

.search-items::-webkit-scrollbar-thumb:hover,
.popular-items::-webkit-scrollbar-thumb:hover,
.category-items::-webkit-scrollbar-thumb:hover,
.categories-section::-webkit-scrollbar-thumb:hover {
  background: rgba(76, 175, 80, 0.5);
}
</style>