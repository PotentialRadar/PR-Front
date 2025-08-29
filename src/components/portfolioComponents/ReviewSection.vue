<template>
  <section class="review-section">
    <div class="section-border">
      <div class="section-header">
        <h5 class="section-title">팀 플레이 후기</h5>
        <p class="section-description">withPR에서 프로젝트 함께한 동료의 메세지입니다.</p>
      </div>
      
      <div v-if="processedReviews.length === 0" class="empty-state">
        <div class="empty-icon">
          <i class="bi bi-chat-heart"></i>
        </div>
        <h3 class="empty-title">받은 리뷰가 없습니다</h3>
        <p class="empty-description">프로젝트에 참여하여 동료들과 함께 작업해보세요!</p>
      </div>
      
      <div v-else class="review-list">
        <div 
          v-for="(review, index) in processedReviews" 
          :key="review.reviewId || index"
          class="review-item"
        >
          <div class="review-header">
            <div class="reviewer-info">
              <div class="review-icon">
                <img 
                  :src="review.reviewerAvatar" 
                  :alt="review.reviewerName || '익명'"
                  @error="handleImageError($event)"
                />
              </div>
              <div class="reviewer-details">
                <h6 class="reviewer-name">{{ review.reviewerName || '익명' }}</h6>
                <p class="project-context" v-if="review.projectTitle">{{ review.projectTitle }}</p>
              </div>
            </div>
            <div class="review-rating" v-if="review.rating">
              <div class="stars">
                <i 
                  v-for="star in 5" 
                  :key="star"
                  :class="['bi', star <= review.rating ? 'bi-star-fill' : 'bi-star']"
                  class="star"
                ></i>
              </div>
              <span class="rating-text">{{ review.rating.toFixed(1) }}</span>
            </div>
          </div>
          
          <div class="review-content">
            <div class="review-message">
              <p class="message-text">{{ review.comment || review.message }}</p>
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
import { computed } from 'vue'

// Props
const props = defineProps({
  reviews: {
    type: Array,
    default: () => []
  }
})

// 날짜 포맷팅 함수
const formatReviewDate = (dateString) => {
  if (!dateString) return ''
  
  const reviewDate = new Date(dateString)
  const now = new Date()

  // 시간을 0으로 설정하여 날짜만 비교
  const reviewDateMidnight = new Date(reviewDate.getFullYear(), reviewDate.getMonth(), reviewDate.getDate());
  const todayMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const diffTime = todayMidnight - reviewDateMidnight;
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return '오늘'
  } else if (diffDays < 7) {
    return `${diffDays}일 전`
  } else if (diffDays < 30) {
    const weeks = Math.floor(diffDays / 7)
    return `${weeks}주 전`
  } else if (diffDays < 365) {
    const months = Math.floor(diffDays / 30)
    return `${months}개월 전`
  } else {
    const years = Math.floor(diffDays / 365)
    return `${years}년 전`
  }
}

// 처리된 리뷰 데이터
const processedReviews = computed(() => {
  return props.reviews.map(review => ({
    ...review,
    reviewerAvatar: review.reviewerProfileImage || `https://api.dicebear.com/7.x/avataaars/svg?seed=${review.reviewerId || 'anonymous'}`,
    timeAgo: formatReviewDate(review.createdAt)
  }))
})

// 이미지 에러 핸들링
const handleImageError = (event) => {
  event.target.src = `https://api.dicebear.com/7.x/avataaars/svg?seed=anonymous`
}
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

.empty-state {
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 1000px;
  padding: 40px 24px;
  justify-content: center;
  align-items: center;
  position: relative;
  box-sizing: border-box;
  min-height: 200px;
  text-align: center;
  gap: 16px;
}

.empty-icon {
  width: 80px;
  height: 80px;
  background: rgba(76, 175, 80, 0.1);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 36px;
  color: #4CAF50;
  margin-bottom: 8px;
}

.empty-title {
  font-size: 20px;
  font-weight: 700;
  color: #262626;
  margin: 0;
}

.empty-description {
  color: #6F6F72;
  text-align: center;
  font-size: 15px;
  font-weight: 400;
  line-height: 24px;
  letter-spacing: -0.2px;
  margin: 0;
  max-width: 300px;
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
  min-height: 200px;
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

.review-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
  margin-bottom: 8px;
}

.reviewer-info {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
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
  padding: 2px;
  box-sizing: border-box;
  flex-shrink: 0;
}

.review-icon img {
  width: 36px;
  height: 36px;
  object-fit: cover;
  border-radius: 50%;
}

.reviewer-details {
  flex: 1;
  min-width: 0;
}

.reviewer-name {
  font-size: 16px;
  font-weight: 600;
  color: #262626;
  margin: 0 0 4px 0;
  line-height: 1.2;
}

.project-context {
  font-size: 13px;
  color: #4CAF50;
  margin: 0;
  font-weight: 500;
  line-height: 1.3;
}

.review-rating {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
}

.stars {
  display: flex;
  gap: 2px;
}

.stars .star {
  font-size: 14px;
  color: #ddd;
}

.stars .bi-star-fill {
  color: #FFD700;
}

.rating-text {
  font-size: 14px;
  font-weight: 600;
  color: #666;
  min-width: 28px;
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