<template>
  <div class="pagination-component">
    <div class="pagination-container">
      <!-- 이전 버튼 -->
      <button 
        class="nav-button" 
        @click="prevPage"
        :disabled="props.currentPage === 1"
      >
        <i class="bi bi-chevron-left"></i>
      </button>

      <!-- 페이지 번호들 -->
      <template v-for="(page, index) in visiblePages" :key="index">
        <span v-if="page === '...'" class="ellipsis">...</span>
        <button
          v-else
          :class="['page-button', { 'active': page === props.currentPage }]"
          @click="selectPage(page)"
        >
          {{ page }}
        </button>
      </template>

      <!-- 다음 버튼 -->
      <button 
        class="nav-button" 
        @click="nextPage"
        :disabled="props.currentPage === props.totalPages"
      >
        <i class="bi bi-chevron-right"></i>
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  currentPage: {
    type: Number,
    required: true
  },
  totalPages: {
    type: Number,
    required: true
  }
});

const emit = defineEmits(['page-changed']);

const visiblePages = computed(() => {
  if (props.totalPages <= 1) return [];

  const delta = 2; // 현재 페이지 앞뒤로 보여줄 페이지 수
  const range = [];
  const rangeWithDots = [];

  const start = Math.max(2, props.currentPage - delta);
  const end = Math.min(props.totalPages - 1, props.currentPage + delta);

  for (let i = start; i <= end; i++) {
    range.push(i);
  }

  if (props.totalPages > 1) {
      rangeWithDots.push(1);
  }

  if (start > 2) {
    rangeWithDots.push('...');
  }

  rangeWithDots.push(...range);

  if (end < props.totalPages - 1) {
    rangeWithDots.push('...');
  }
  
  if (props.totalPages > 1 && !range.includes(props.totalPages)) {
      rangeWithDots.push(props.totalPages);
  }

  // If the only page is 1, it should not be in range and pushed here.
  // But if totalPages is 1, we return [] at the top.
  // What if totalPages is 2, and page 1 is active? range is [2]. rangeWithDots is [1, 2]. Correct.
  // What if totalPages is 5, and page 1 is active? start=2, end=3. range=[2,3]. rangeWithDots=[1, 2, 3, ..., 5]. Correct.
  // What if totalPages is 10, page 5 is active? start=3, end=7. range=[3,4,5,6,7]. rangeWithDots=[1, ..., 3,4,5,6,7, ..., 10]. Correct.
  // What if totalPages is 10, page 9 is active? start=7, end=9. range=[7,8,9]. rangeWithDots=[1, ..., 7,8,9, 10]. Correct.

  // Remove 1 if it's followed by ..., since we always show 1
  if (rangeWithDots[0] === 1 && rangeWithDots[1] === 2) {
      // This logic is getting complicated. Let's simplify.
  }

  // Simplified logic
  const pages = [];
  // Always show first page
  pages.push(1);

  // Calculate start and end pages
  let pageStart = Math.max(2, props.currentPage - 1);
  let pageEnd = Math.min(props.totalPages - 1, props.currentPage + 1);

  if (props.currentPage <= 3) {
      pageStart = 2;
      pageEnd = Math.min(props.totalPages - 1, 4);
  }

  if (props.currentPage >= props.totalPages - 2) {
      pageStart = Math.max(2, props.totalPages - 3);
      pageEnd = props.totalPages - 1;
  }

  if (pageStart > 2) {
      pages.push('...');
  }

  for (let i = pageStart; i <= pageEnd; i++) {
      pages.push(i);
  }

  if (pageEnd < props.totalPages - 1) {
      pages.push('...');
  }

  // Always show last page if more than 1 page
  if (props.totalPages > 1) {
      pages.push(props.totalPages);
  }

  return pages;
});

const selectPage = (page) => {
  if (page >= 1 && page <= props.totalPages) {
    emit('page-changed', page);
  }
};

const nextPage = () => {
  if (props.currentPage < props.totalPages) {
    selectPage(props.currentPage + 1);
  }
};

const prevPage = () => {
  if (props.currentPage > 1) {
    selectPage(props.currentPage - 1);
  }
};
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