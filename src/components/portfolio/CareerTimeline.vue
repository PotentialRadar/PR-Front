<template>
  <section class="career-section">
    <div class="section-border">
      <div class="section-header">
        <div class="career-header">
          <span class="section-title">경력</span>
        </div>
      </div>
      
      <div class="timeline-list">
        <div 
          v-for="(item, index) in careerItems" 
          :key="index"
          class="timeline-item"
          :class="{ 'no-border': index === careerItems.length - 1 }"
        >
          <div class="timeline-marker" :class="`marker-${index}`">
            <!-- Current position marker -->
            <div v-if="index === 0" class="current-marker">
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
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'

// Career data
const careerItems = ref([
  {
    company: 'NHN 계열사',
    position: 'UX/UI designer',
    duration: '2022.6 - 재직중 | 3년 2개월'
  },
  {
    company: '디지털 에이전시',
    position: 'UI designer',
    duration: '2018.7 - 2021.10 | 3년 4개월'
  },
  {
    company: '소프트웨어 개발 기업',
    position: 'UI designer',
    duration: '2016.8 - 2017.10 | 1년 3개월'
  }
])
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
  border-top: 4px solid #f5b387;
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
  height: 94px;
  width: 100%;
  border-left: 2px solid rgba(245, 179, 135, 0.3);
  position: relative;
}

.timeline-item.no-border {
  border-left: none;
}

.timeline-marker {
  position: absolute;
  left: -12px;
  top: -8px;
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
  background: #f5b387;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0 0 4px rgba(245, 179, 135, 0.2);
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
    box-shadow: 0 0 0 4px rgba(245, 179, 135, 0.2);
  }
  50% {
    box-shadow: 0 0 0 8px rgba(245, 179, 135, 0.1);
  }
  100% {
    box-shadow: 0 0 0 4px rgba(245, 179, 135, 0.2);
  }
}

/* Past positions marker */
.past-marker {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  left: 5px;
  top: 5px;
}

.square-marker {
  width: 14px;
  height: 14px;
  background: #f5b387;
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
  width: calc(100% - 60px);
  flex-direction: column;
  align-items: flex-start;
  position: absolute;
  left: 41px;
  top: -10px;
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
  
  .timeline-content {
    width: calc(100% - 50px);
    left: 35px;
  }
  
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

  .timeline-content {
    width: calc(100% - 45px);
    left: 30px;
  }

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