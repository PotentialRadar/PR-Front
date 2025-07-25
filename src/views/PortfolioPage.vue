<template>
  <div class="portfolio-page">
    <div class="portfolio-container">
      <div class="portfolio-content">
        <!-- Header Section -->
        <PortfolioHeader :userId="portfolioData.userId" :isOwnProfile="portfolioData.isOwnProfile" />

        <!-- Self Introduction Section -->
        <section class="portfolio-section">
          <div class="section-border">
            <div class="section-header">
              <h5 class="section-title">자기소개</h5>
              <button class="info-button">
                <svg width="15" height="16" viewBox="0 0 15 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <clipPath id="clip0_156_977">
                      <rect width="15" height="15" fill="white" transform="translate(0 0.75)"/>
                    </clipPath>
                  </defs>
                </svg>
              </button>
            </div>
            <div class="empty-state">
              <p class="empty-message">자기소개가 없습니다.</p>
            </div>
          </div>
        </section>

        <CareerTimeline />
        <SkillsSection />
        <ProjectsSection />
        <ReviewSection />

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import PortfolioHeader from '@/components/portfolio/PortfolioHeader.vue'
import CareerTimeline from '@/components/portfolio/CareerTimeline.vue'
import SkillsSection from '@/components/portfolio/SkillsSection.vue'
import ProjectsSection from '@/components/portfolio/ProjectsSection.vue'
import ReviewSection from '@/components/portfolio/ReviewSection.vue'

const route = useRoute()

const portfolioData = ref({
  userId: route.params.userId || 'jamie',
  isOwnProfile: false,
})
</script>

<style scoped>
.portfolio-page {
  display: flex;
  width: 100%;
  min-width: 360px;
  padding: 0 120px;
  flex-direction: column;
  align-items: flex-start;
  background: #FFF;
  min-height: 100vh;
}

.portfolio-container {
  display: flex;
  max-width: 1200px;
  width: 100%;
  min-height: 3500px;
  padding-top: 70px;
  flex-direction: column;
  align-items: flex-start;
  margin: 0 auto;
  position: relative;
}

.portfolio-content {
  display: flex;
  min-height: 2989px;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
  background: #FFF;
  position: relative;
  gap: 26px;
}

.portfolio-section {
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
  align-items: flex-start;
  border-top: 4px solid #f5b387;
  position: relative;
  width: 100%;
}

.section-header {
  display: flex;
  padding: 15.75px 20px 16.25px 4px;
  align-items: center;
  gap: 8px;
  width: 100%;
  position: relative;
  box-sizing: border-box;
  flex-wrap: nowrap;
  justify-content: flex-start;
}

.section-title {
  font-size: 18px;
  font-style: normal;
  font-weight: 700;
  line-height: 17px;
  letter-spacing: 0.6px;
  margin: 0;
  color: #38383A;
  white-space: nowrap;
  flex-shrink: 0;
}

.info-button {
  display: flex;
  justify-content: center;
  align-items: center;
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  flex-shrink: 0;
}

.info-button svg {
  width: 15px;
  height: 15px;
  flex-shrink: 0;
  opacity: 0.6;
}

.empty-state {
  display: flex;
  padding: 20px 24px;
  justify-content: center;
  align-items: center;
  width: 100%;
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
}

@media (max-width: 1024px) {
  .portfolio-page {
    padding: 0 40px;
  }

  .portfolio-section {
    padding: 0 15px;
  }
}

@media (max-width: 768px) {
  .portfolio-page {
    padding: 0 20px;
  }

  .portfolio-container {
    padding-top: 30px;
  }

  .portfolio-section {
    padding: 0 10px;
  }

  .section-header {
    padding: 15.75px 15px 16.25px 4px;
    gap: 6px;
  }

  .section-title {
    font-size: 16px;
  }

  .empty-state {
    padding: 15px 20px;
  }

  .empty-message {
    font-size: 14px;
    line-height: 22px;
  }
}

@media (max-width: 480px) {
  .portfolio-page {
    padding: 0 15px;
  }

  .portfolio-section {
    padding: 0 5px;
  }

  .section-header {
    padding: 12px 10px 12px 4px;
    gap: 4px;
  }

  .section-title {
    font-size: 16px;
  }

  .empty-state {
    padding: 12px 16px;
  }

  .empty-message {
    font-size: 13px;
    line-height: 20px;
  }

  .info-button {
    padding: 2px;
  }

  .info-button svg {
    width: 12px;
    height: 12px;
  }
}

@media (max-width: 360px) {
  .portfolio-page {
    padding: 0 10px;
  }

  .section-header {
    padding: 10px 8px 10px 4px;
  }

  .section-title {
    font-size: 14px;
  }

  .empty-message {
    font-size: 12px;
    line-height: 18px;
  }
}
</style>