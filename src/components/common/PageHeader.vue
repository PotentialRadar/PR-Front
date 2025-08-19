<template>
  <div class="page-header">
    <div class="header-content">
      <div class="title-section">
        <h1 class="page-title">{{ title }}</h1>
        <div class="title-underline"></div>
      </div>
      <p class="page-subtitle">{{ subtitle }}</p>
      
      <!-- 통계 섹션 (선택사항) -->
      <div v-if="showStats && stats" class="stats-section">
        <div v-for="(stat, index) in stats" :key="index" class="stat-item">
          <div class="stat-number">{{ stat.number }}</div>
          <div class="stat-label">{{ stat.label }}</div>
        </div>
        <div v-if="index < stats.length - 1" class="stat-divider"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    required: true
  },
  subtitle: {
    type: String,
    required: true
  },
  showStats: {
    type: Boolean,
    default: false
  },
  stats: {
    type: Array,
    default: () => []
  }
})
</script>

<style scoped>
/* 페이지 헤더 공통 스타일 */
.page-header {
  width: 100%;
  text-align: center;
  position: relative;
  background: none;
  padding: 60px 0 40px 0;
}

.header-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  position: relative;
  padding: 0 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.title-section {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.page-title {
  font-size: 42px;
  font-weight: bold;
  font-family: var(--page-title-font-family);
  color: var(--page-title-color);
  margin: 0;
  letter-spacing: -1px;
  position: relative;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.title-underline {
  width: 80px;
  height: 4px;
  background: linear-gradient(90deg, #4CAF50 0%, #2E7D32 100%);
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

@keyframes expandLine {
  0% {
    width: 0;
    opacity: 0;
  }
  50% {
    opacity: 0.8;
  }
  100% {
    width: 80px;
    opacity: 1;
  }
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
  50% {
    opacity: 0.7;
    transform: translate(-50%, -50%) scale(1.2);
  }
}

.page-subtitle {
  font-size: var(--page-subtitle-font-size);
  font-weight: 400;
  font-family: var(--page-title-font-family);
  color: var(--page-subtitle-color);
  margin: 0;
  line-height: 1.6;
  max-width: 600px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* 통계 섹션 (포트폴리오 페이지용) */
.stats-section {
  display: flex;
  align-items: center;
  gap: 40px;
  margin-top: 20px;
}

.stat-item {
  text-align: center;
}

.stat-number {
  font-size: 32px;
  font-weight: 700;
  color: #4CAF50;
  margin-bottom: 8px;
}

.stat-label {
  font-size: 14px;
  color: #666;
  font-weight: 500;
}

.stat-divider {
  width: 1px;
  height: 40px;
  background: #e9ecef;
}

/* 반응형 디자인 */
@media (max-width: 768px) {
  .page-header {
    padding: 40px 0 30px 0;
  }
  
  .page-title {
    font-size: var(--page-title-font-size-tablet);
  }
  
  .page-subtitle {
    font-size: var(--page-subtitle-font-size-tablet);
  }
  
  .stats-section {
    gap: 20px;
  }
  
  .stat-number {
    font-size: 24px;
  }
}

@media (max-width: 480px) {
  .page-header {
    padding: 30px 0 20px 0;
  }
  
  .page-title {
    font-size: var(--page-title-font-size-mobile);
  }
  
  .page-subtitle {
    font-size: var(--page-subtitle-font-size-mobile);
  }
  
  .stats-section {
    flex-direction: column;
    gap: 16px;
  }
  
  .stat-divider {
    display: none;
  }
}
</style>