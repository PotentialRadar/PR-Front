<template>
  <div class="pagination-bar" v-if="totalPages > 1">
    <!-- 이전 페이지 -->
    <button @click="goToPage(currentPage - 1)" :disabled="currentPage === 1">이전</button>
    
    <!-- 이전 그룹 -->
    <button v-if="hasPrevGroup" @click="goToPrevGroup" class="group-nav">...</button>
    
    <!-- 현재 그룹의 페이지들 -->
    <button
      v-for="p in visiblePages"
      :key="p"
      :class="{ active: currentPage === p }"
      @click="goToPage(p)"
    >
      {{ p }}
    </button>
    
    <!-- 다음 그룹 -->
    <button v-if="hasNextGroup" @click="goToNextGroup" class="group-nav">...</button>
    
    <!-- 다음 페이지 -->
    <button @click="goToPage(currentPage + 1)" :disabled="currentPage === totalPages">다음</button>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  currentPage: {
    type: Number,
    required: true,
    default: 1
  },
  totalPages: {
    type: Number,
    required: true,
    default: 1
  },
  pageGroupSize: {
    type: Number,
    default: 5
  }
});

const emit = defineEmits(['page-change']);

const goToPage = (page) => {
  if (page >= 1 && page <= props.totalPages && page !== props.currentPage) {
    emit('page-change', page);
  }
};

// 그룹 페이징 로직
const currentPageGroup = computed(() => {
  return Math.ceil(props.currentPage / props.pageGroupSize);
});

const pageGroupStart = computed(() => {
  return (currentPageGroup.value - 1) * props.pageGroupSize + 1;
});

const pageGroupEnd = computed(() => {
  return Math.min(currentPageGroup.value * props.pageGroupSize, props.totalPages);
});

const visiblePages = computed(() => {
  const pages = [];
  for (let i = pageGroupStart.value; i <= pageGroupEnd.value; i++) {
    pages.push(i);
  }
  return pages;
});

const hasPrevGroup = computed(() => {
  return currentPageGroup.value > 1;
});

const hasNextGroup = computed(() => {
  return currentPageGroup.value < Math.ceil(props.totalPages / props.pageGroupSize);
});

const goToPrevGroup = () => {
  const prevGroupLastPage = (currentPageGroup.value - 1) * props.pageGroupSize;
  goToPage(prevGroupLastPage);
};

const goToNextGroup = () => {
  const nextGroupFirstPage = currentPageGroup.value * props.pageGroupSize + 1;
  goToPage(nextGroupFirstPage);
};
</script>

<style scoped>
.pagination-bar {
  margin-top: 24px;
  display: flex;
  justify-content: center;
  gap: 8px;
}

.pagination-bar button {
  background: #fff;
  border: 1px solid #D1D5DB;
  border-radius: 8px;
  padding: 8px 16px;
  cursor: pointer;
  transition: all 0.2s;
  font-weight: 500;
  min-width: 40px;
}

.pagination-bar button:hover {
  background: #F1F8E9;
  border-color: #C8E6C9;
  color: #2E7D32;
}

.pagination-bar button.active {
  background: #4CAF50;
  color: #fff;
  border-color: #4CAF50;
}

.pagination-bar button:disabled { 
  opacity: 0.5; 
  cursor: default; 
  background: #F3F4F6; 
}

.pagination-bar button:disabled:hover {
  background: #F3F4F6;
  border-color: #D1D5DB;
  color: inherit;
}

.pagination-bar button.group-nav {
  background: #F9FAFB;
  border-color: #E5E7EB;
  color: #6B7280;
  font-weight: 600;
}

.pagination-bar button.group-nav:hover {
  background: #E5E7EB;
  border-color: #D1D5DB;
  color: #4B5563;
}
</style>