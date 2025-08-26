<template>
  <section class="career-section">
    <div class="section-border">
      <div class="section-header">
        <div class="career-header">
          <span class="section-title">경력</span>
        </div>
      </div>
      
      <div v-if="careerItems.length > 0" class="timeline-list">
        <div 
          v-for="(item, index) in careerItems" 
          :key="index"
          class="timeline-item"
          :class="{ 'no-border': index === careerItems.length - 1 }"
        >
          <div class="timeline-marker" :class="`marker-${index}`">
            <!-- Current position marker -->
            <div v-if="item.isCurrent" class="current-marker">
              <div class="outer-ring">
                <div class="inner-dot"></div>
              </div>
            </div>
            <!-- Previous positions marker -->
            <div v-else class="past-marker">
              <div class="square-marker"></div>
            </div>
          </div>
          
          <div class="timeline-content">
            <h3 class="company-name">{{ item.company }}</h3>
            <p class="job-position">{{ item.position }}</p>
            <p class="duration">{{ item.duration }}</p>
            <p v-if="item.description" class="job-description">{{ item.description }}</p>
          </div>
        </div>
      </div>
      
      <div v-else class="empty-state">
        <p class="empty-message">경력 정보가 없습니다.</p>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue'

// Props
const props = defineProps({
  careers: {
    type: Array,
    default: () => []
  }
})

// 경력 기간 포맷팅 함수
const formatCareerPeriod = (career) => {
  const formatDate = (dateString) => {
    if (!dateString) return ''
    const [year, month] = dateString.split('-')
    return `${year}.${month}`
  }

  const startFormatted = formatDate(career.startDate)
  
  if (career.isCurrent) {
    return `${startFormatted} - 재직중`
  }
  
  const endFormatted = formatDate(career.endDate)
  return `${startFormatted} - ${endFormatted}`
}

// 경력 기간 계산 함수 (개월 수)
const calculateDuration = (startDate, endDate, isCurrent) => {
  if (!startDate) return ''
  
  const start = new Date(startDate + '-01')
  const end = isCurrent ? new Date() : new Date(endDate + '-01')
  
  const diffTime = Math.abs(end - start)
  const diffMonths = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 30))
  
  const years = Math.floor(diffMonths / 12)
  const months = diffMonths % 12
  
  if (years > 0) {
    return months > 0 ? `${years}년 ${months}개월` : `${years}년`
  }
  return `${months}개월`
}

// Career items computed property
const careerItems = computed(() => {
  if (!props.careers || props.careers.length === 0) {
    return []
  }

  return props.careers.map(career => ({
    company: career.company,
    position: career.position,
    duration: `${formatCareerPeriod(career)} | ${calculateDuration(career.startDate, career.endDate, career.isCurrent)}`,
    description: career.description,
    isCurrent: career.isCurrent
  }))
})
</script>

<style scoped>
.career-section {
  width: 100%;
  max-width: 1060px;
  align-self: center;
  padding: 0 20px;
  box-sizing: border-box;
}

.section-border {
  display: flex;
  min-height: 104px;
  padding: 4px 0 36px 0;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  border-top: 4px solid #4CAF50;
  position: relative;
  width: 100%;
}

.section-header {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
}

.career-header {
  display: flex;
  width: auto;
  height: 49.5px;
  padding: 15.75px 20px 16px 4px;
  justify-content: flex-start;
  align-items: flex-start;
  gap: 5.8px;
  position: relative;
}

.section-title {
  display: flex;
  width: auto;
  height: 17px;
  flex-direction: column;
  justify-content: center;
  flex-shrink: 0;
  font-family: 'Lato', -apple-system, Roboto, Helvetica, sans-serif;
  font-size: 18px;
  font-style: normal;
  font-weight: 700;
  line-height: 17px;
  letter-spacing: 0.6px;
  color: #38383A;
}

.timeline-list {
  display: flex;
  width: 100%;
  max-width: 1000px;
  padding: 0 24px;
  flex-direction: column;
  align-items: flex-start;
  position: relative;
  box-sizing: border-box;
}

.timeline-item {
  width: 100%;
  position: relative;
  border-left: 2px solid rgba(76, 175, 80, 0.3);
  padding: 6px 0 20px 56px;
}

.timeline-item.no-border {
  border-left: none;
}

.timeline-marker {
  position: absolute;
  left: 0;
  top: 10px;
  transform: translateX(-50%);
  z-index: 2;
}

/* Current position marker (첫 번째 아이템) */
.current-marker {
  display: flex;
  align-items: center;
  justify-content: center;
}

.outer-ring {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: #4CAF50;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0 0 4px rgba(76, 175, 80, 0.2);
  animation: pulse 2s infinite;
}

.inner-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #FFF;
}

@keyframes pulse {
  0% {
    box-shadow: 0 0 0 4px rgba(76, 175, 80, 0.2);
  }
  50% {
    box-shadow: 0 0 0 8px rgba(76, 175, 80, 0.1);
  }
  100% {
    box-shadow: 0 0 0 4px rgba(76, 175, 80, 0.2);
  }
}

/* Past positions marker */
.past-marker {
  display: flex;
  align-items: center;
  justify-content: center;
}

.square-marker {
  width: 14px;
  height: 14px;
  background: #4CAF50;
  border-radius: 3px;
  position: relative;
  opacity: 0.8;
}

.square-marker::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 6px;
  height: 6px;
  background: #FFF;
  border-radius: 1px;
}

.timeline-content {
  display: flex;
  width: 100%;
  flex-direction: column;
  align-items: flex-start;
}

.company-name {
  color: #38383A;
  font-family: 'Lato', -apple-system, Roboto, Helvetica, sans-serif;
  font-size: 16px;
  font-style: normal;
  font-weight: 700;
  line-height: 26px;
  margin: 0 0 8px 0;
}

.job-position {
  color: #6F6F72;
  font-family: 'Lato', -apple-system, Roboto, Helvetica, sans-serif;
  font-size: 15px;
  font-style: normal;
  font-weight: 500;
  line-height: 20px;
  margin: 0 0 8px 0;
}

.duration {
  color: #6F6F72;
  font-family: 'Lato', -apple-system, Roboto, Helvetica, sans-serif;
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: 20px;
  margin: 0 0 8px 0;
}

.job-description {
  color: #38383A;
  font-family: 'Lato', -apple-system, Roboto, Helvetica, sans-serif;
  font-size: 13px;
  font-style: normal;
  font-weight: 400;
  line-height: 1.5;
  margin: 0;
  padding: 8px 0;
  border-top: 1px solid #f0f0f0;
}

.empty-state {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  padding: 40px 20px;
  position: relative;
  box-sizing: border-box;
}

.empty-message {
  color: #6F6F72;
  text-align: center;
  font-size: 15px;
  font-style: normal;
  font-weight: 400;
  line-height: 24px;
  letter-spacing: -0.2px;
  margin: 0;
  white-space: nowrap;
  flex-shrink: 0;
  margin: 0;
  padding-bottom: 16px;
  opacity: 0.8;
}

@media (max-width: 768px) {
  .career-section {
    padding: 0 15px;
  }

  .timeline-list {
    padding: 0 16px;
  }
  .timeline-item { padding-left: 50px; }
  
  .career-header {
    padding: 15.75px 15px 16px 4px;
  }

  .section-title {
    font-size: 16px;
  }
}

@media (max-width: 480px) {
  .career-section {
    padding: 0 10px;
  }

  .timeline-list {
    padding: 0 12px;
  }

  .timeline-item { padding-left: 45px; }

  .company-name {
    font-size: 14px;
    line-height: 22px;
  }
  
  .job-position {
    font-size: 13px;
    line-height: 18px;
  }
  
  .duration {
    font-size: 11px;
    line-height: 16px;
  }

  .outer-ring {
    width: 20px;
    height: 20px;
  }

  .inner-dot {
    width: 6px;
    height: 6px;
  }

  .square-marker {
    width: 12px;
    height: 12px;
  }

  .square-marker::after {
    width: 4px;
    height: 4px;
  }
}
</style>
