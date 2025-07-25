<template>
  <div class="pagination-component">
    <div class="pagination-container">
      <!-- 이전 버튼 -->
      <button 
        class="nav-button" 
        @click="prevPage"
        :disabled="currentPage === 1"
      >
        <i class="bi bi-chevron-left"></i>
      </button>

      <!-- 페이지 번호들 -->
      <template v-for="page in visiblePages" :key="page">
        <span v-if="page === '...'" class="ellipsis">...</span>
        <button
          v-else
          :class="['page-button', { 'active': page === currentPage }]"
          @click="selectPage(page)"
        >
          {{ page }}
        </button>
      </template>

      <!-- 다음 버튼 -->
      <button 
        class="nav-button" 
        @click="nextPage"
        :disabled="currentPage === totalPages"
      >
        <i class="bi bi-chevron-right"></i>
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PaginationComponent',
  data() {
    return {
      currentPage: 1,
      totalPages: 15 // 예시로 15페이지
    }
  },
  computed: {
    visiblePages() {
      const delta = 2 // 현재 페이지 앞뒤로 보여줄 페이지 수
      const range = []
      const rangeWithDots = []

      // 시작과 끝 계산
      const start = Math.max(1, this.currentPage - delta)
      const end = Math.min(this.totalPages, this.currentPage + delta)

      // 범위 생성
      for (let i = start; i <= end; i++) {
        range.push(i)
      }

      // 첫 페이지 추가
      if (start > 1) {
        rangeWithDots.push(1)
        if (start > 2) {
          rangeWithDots.push('...')
        }
      }

      // 중간 범위 추가
      rangeWithDots.push(...range)

      // 마지막 페이지 추가
      if (end < this.totalPages) {
        if (end < this.totalPages - 1) {
          rangeWithDots.push('...')
        }
        rangeWithDots.push(this.totalPages)
      }

      return rangeWithDots
    }
  },
  methods: {
    selectPage(page) {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page
        this.$emit('page-changed', page)
      }
    },
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.selectPage(this.currentPage + 1)
      }
    },
    prevPage() {
      if (this.currentPage > 1) {
        this.selectPage(this.currentPage - 1)
      }
    }
  }
}
</script>

<style scoped>
.pagination-component {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  margin-top: 40px;
  padding: 20px 0;
}

.pagination-container {
  display: flex;
  align-items: center;
  gap: 4px;
}

.page-button {
  display: flex;
  width: 36px;
  height: 36px;
  justify-content: center;
  align-items: center;
  border-radius: 6px;
  border: none;
  background: transparent;
  cursor: pointer;
  color: #666;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s ease;
}

.page-button:hover {
  background: #F5F5F5;
  color: #333;
}

.page-button.active {
  background: #307e0e;
  color: #FFF;
}

.nav-button {
  display: flex;
  width: 36px;
  height: 36px;
  justify-content: center;
  align-items: center;
  border-radius: 6px;
  border: none;
  background: transparent;
  cursor: pointer;
  color: #666;
  font-size: 16px;
  transition: all 0.2s ease;
}

.nav-button:hover:not(:disabled) {
  background: #F5F5F5;
  color: #333;
}

.nav-button:disabled {
  color: #CCC;
  cursor: not-allowed;
}

.ellipsis {
  display: flex;
  width: 36px;
  height: 36px;
  justify-content: center;
  align-items: center;
  color: #999;
  font-size: 14px;
}

/* 반응형 디자인 */
@media (max-width: 480px) {
  .pagination-container {
    gap: 2px;
  }

  .page-button,
  .nav-button,
  .ellipsis {
    width: 32px;
    height: 32px;
    font-size: 13px;
  }
}
</style>