<template>
  <section class="review-section">
    <div class="section-border">
      <div class="section-header">
        <h5 class="section-title">팀 플레이 후기</h5>
        <p class="section-description">withPR에서 프로젝트 함께한 동료의 메세지입니다.</p>
      </div>
      
      <div class="review-list">
        <div 
          v-for="(review, index) in reviewItems" 
          :key="index"
          class="review-item"
        >
          <div class="review-icon">
            <img src="https://api.builder.io/api/v1/image/assets/TEMP/0ce35b28adf2d5fbb374f32a14d9bd1319b33017?width=64" alt="Review icon" />
          </div>
          
          <div class="review-content">
            <div class="review-message">
              <p class="message-text">{{ review.message }}</p>
            </div>
            <div class="review-meta">
              <span class="review-time">{{ review.timeAgo }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'

// Review data
const reviewItems = ref([
  {
    message: '이미 withPR에 참여해 본 경험치를 토대로 팀의 방향성을 잘 제시해주십니다. 경험치를 통한 방향 제시가 저희 팀의 한계점을 둘 수 있다는 점도 스스로 인지하고 계시면서 조심스럽게 의견제시를 하시는 모습도 멋져보였어요 !',
    timeAgo: '3년 전'
  },
  {
    message: '디자인의 많은 부분을 책임져 주시면서 여러가지 아이디어도 제시해주셔서 감사합니다 👍👍',
    timeAgo: '3년 전'
  }
])
</script>

<style scoped>
.review-section {
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
  gap: 6px;
}

.section-title {
  display: flex;
  width: auto;
  height: 17px;
  flex-direction: column;
  justify-content: center;
  flex-shrink: 0;
  color: #38383A;
  font-size: 18px;
  font-style: normal;
  font-weight: 700;
  line-height: 17px;
  letter-spacing: 0.6px;
  margin: 16px 0 0 4px;
}

.section-description {
  color: #ACACAE;
  font-size: 13px;
  font-style: normal;
  font-weight: 400;
  line-height: 18px;
  margin: 0 0 0 4px;
}

.review-list {
  display: flex;
  width: 100%;
  max-width: 1000px;
  padding: 0 24px;
  box-sizing: border-box;
  min-height: 200px;
  align-items: flex-start;
  gap: 24px;
  justify-content: center;
  flex-wrap: wrap;
}

.review-item {
  width: 100%;
  max-width: 400px;
  min-height: 170px;
  flex-shrink: 0;
  height: auto;
  border-radius: 12px;
  border: 2px solid rgba(76, 175, 80, 0.2);
  background: #FFF;
  position: relative;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  box-shadow: 0 4px 12px rgba(76, 175, 80, 0.1);
  transition: all 0.3s ease;
}

.review-item:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 20px rgba(76, 175, 80, 0.2);
  border-color: rgba(76, 175, 80, 0.4);
}

.review-icon {
  display: flex;
  width: 40px;
  height: 40px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  background: rgba(76, 175, 80, 0.1);
  padding: 8px;
  box-sizing: border-box;
}

.review-icon img {
  width: 24px;
  height: 24px;
  object-fit: cover;
  border-radius: 50%;
}

.review-content {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  flex: 1;
  gap: 16px;
}

.review-message {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
  flex: 1;
}

.message-text {
  width: 100%;
  color: #343435;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 22px;
  margin: 0;
  white-space: pre-line;
}

.review-meta {
  display: flex;
  width: 100%;
  justify-content: flex-end;
  align-items: center;
}

.review-time {
  color: #ACACAE;
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: 16px;
  padding: 4px 8px;
  background: rgba(76, 175, 80, 0.1);
  border-radius: 8px;
}

@media (max-width: 768px) {
  .review-list {
    padding: 0 16px;
    gap: 20px;
    flex-direction: column;
    align-items: center;
  }
  
  .review-item {
    width: 100%;
    max-width: 100%;
    min-width: auto;
  }
  
  .section-description {
    margin: 0 0 0 4px;
  }
}

@media (max-width: 480px) {
  .review-list {
    padding: 0 12px;
    gap: 16px;
  }
  
  .review-item {
    padding: 16px;
  }
  
  .review-icon {
    width: 36px;
    height: 36px;
    padding: 6px;
  }
  
  .review-icon img {
    width: 20px;
    height: 20px;
  }
  
  .message-text {
    font-size: 13px;
    line-height: 20px;
  }
  
  .review-time {
    font-size: 11px;
    line-height: 14px;
    padding: 3px 6px;
  }
  
  .section-title {
    font-size: 16px;
  }
  
  .section-description {
    font-size: 12px;
    line-height: 16px;
  }
}
</style>