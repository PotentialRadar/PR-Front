<template>
  <div 
    class="portfolio-card"
    @click="viewPortfolio"
  >
    <!-- 카드 헤더 -->
    <div class="card-header">
      <div class="profile-section">
        <div class="profile-avatar">
          <img 
            :src="portfolio.avatar" 
            :alt="portfolio.name" 
            :onerror="`this.src='https://api.dicebear.com/7.x/avataaars/svg?seed=${portfolio.userId}'`"
          />
        </div>
        <div class="profile-info">
          <h3 class="profile-name">{{ portfolio.name }}</h3>
          <p v-if="portfolio.jobTitle" class="profile-title">{{ portfolio.jobTitle }}</p>
          <div class="category-badge">{{ portfolio.category }}</div>
        </div>
      </div>
      <div class="card-actions">
        <div class="like-container">
          <button class="like-btn" :class="{ 'liked': isLiked }" @click.stop="handleLikeToggle">
            <i class="bi bi-heart-fill"></i>
          </button>
          <span class="like-count">{{ likeCount }}</span>
        </div>
      </div>
    </div>

    <!-- 카드 본문 -->
    <div class="card-body">
      <!-- 스킬 섹션 -->
      <div class="skills-section">
        <div class="skills-header">
          <i class="bi bi-tools"></i>
          <span class="skills-title">기술 스택</span>
        </div>
        <div class="skills-list">
          <span 
            v-for="skill in portfolio.skills" 
            :key="skill" 
            class="skill-tag"
          >
            {{ skill }}
          </span>
        </div>
      </div>
    </div>

    <!-- 카드 푸터 -->
    <div class="card-footer">
      <div class="action-buttons">
        <button class="view-btn">
          <i class="bi bi-eye"></i>
          자세히 보기
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/userStore';
import { toggleLike, isLiked as checkIsLiked } from '@/api/likes.js';
import { useToast } from 'vue-toastification';

const props = defineProps({
  portfolio: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['like-updated']);

const router = useRouter();
const userStore = useUserStore();
const toast = useToast();

const isLiked = ref(false);
const likeCount = ref(props.portfolio.likeCount || 0);

const fetchLikeStatus = async () => {
  const portfolioId = props.portfolio.id || props.portfolio.userId;
  if (userStore.isLoggedIn && portfolioId) {
    try {
      const response = await checkIsLiked('PORTFOLIO', portfolioId);
      isLiked.value = response.isLiked;
    } catch (error) {
      isLiked.value = false;
    }
  } else {
    isLiked.value = false;
  }
};

onMounted(() => {
  likeCount.value = props.portfolio.likeCount || 0;
  fetchLikeStatus();
});

watch(() => userStore.isLoggedIn, (isLoggedIn) => {
  if (isLoggedIn) {
    fetchLikeStatus();
  } else {
    isLiked.value = false;
  }
});

const handleLikeToggle = async () => {
  if (!userStore.isLoggedIn) {
    toast.info('로그인이 필요합니다.');
    router.push('/login');
    return;
  }
  try {
    const portfolioId = props.portfolio.id || props.portfolio.userId;
    const response = await toggleLike('PORTFOLIO', portfolioId);
    
    isLiked.value = response.liked;
    likeCount.value = response.likeCount;

    emit('like-updated', { 
      portfolioId: portfolioId, 
      isLiked: response.liked,
      likeCount: response.likeCount 
    });

  } catch (error) {
    console.error('Error toggling like:', error);
    toast.error('좋아요 처리에 실패했습니다.');
  }
};

const viewPortfolio = () => {
  const portfolioId = props.portfolio.id || props.portfolio.userId;
  router.push(`/portfolio/${portfolioId}`);
};
</script>

<style scoped>
/* 포트폴리오 카드 */
.portfolio-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(76, 175, 80, 0.08);
  border: 1px solid rgba(76, 175, 80, 0.1);
  transition: all 0.3s ease;
  cursor: pointer;
  display: flex;
  flex-direction: column;
}

.portfolio-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 16px 48px rgba(76, 175, 80, 0.15);
  border-color: rgba(76, 175, 80, 0.2);
}

/* 카드 헤더 */
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 24px;
  border-bottom: 1px solid rgba(76, 175, 80, 0.1);
}

.profile-section {
  display: flex;
  gap: 16px;
  flex: 1;
}

.profile-avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  overflow: hidden;
  border: 3px solid rgba(76, 175, 80, 0.2);
  flex-shrink: 0;
}

.profile-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.profile-info {
  flex: 1;
  min-width: 0;
}

.profile-name {
  font-size: 20px;
  font-weight: 700;
  color: #262626;
  margin: 0 0 6px 0;
  line-height: 1.2;
}

.profile-title {
  font-size: 16px;
  color: #4CAF50;
  font-weight: 600;
  margin: 0 0 12px 0;
  line-height: 1.3;
}

.category-badge {
  display: inline-block;
  padding: 4px 12px;
  background: linear-gradient(135deg, #4CAF50, #66BB6A);
  color: #fff;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.card-actions {
  display: flex;
  align-items: flex-start;
}

.like-container {
  display: flex;
  align-items: center;
  gap: 4px;
}

.like-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
  border-radius: 50%;
  transition: all 0.2s ease;
  color: #ccc;
  font-size: 18px;
}

.like-btn:hover {
  background: rgba(231, 76, 60, 0.1);
  color: #e74c3c;
}

.like-btn.liked {
  color: #e74c3c;
  animation: heart-pop 0.3s ease;
}

@keyframes heart-pop {
  0% { transform: scale(1); }
  50% { transform: scale(1.3); }
  100% { transform: scale(1); }
}

.like-count {
  font-size: 14px;
  font-weight: 600;
  color: #666;
}

/* 카드 본문 */
.card-body {
  padding: 24px;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* 카드 푸터 */
.card-footer {
  padding: 20px 24px;
  background: rgba(76, 175, 80, 0.02);
  border-top: 1px solid rgba(76, 175, 80, 0.1);
}

.action-buttons {
  display: flex;
  justify-content: center;
  width: 100%;
}

.view-btn {
  flex: 1;
  max-width: 200px;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  background: #4CAF50;
  color: #fff;
  border: none;
  box-shadow: 0 2px 8px rgba(76, 175, 80, 0.2);
}

.view-btn:hover {
  background: #66BB6A;
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(76, 175, 80, 0.4);
  scale: 1.05;
}

/* 기술 스택 섹션 */
.skills-section {
  margin-bottom: 16px;
}

.skills-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
  color: #4CAF50;
  font-weight: 600;
  font-size: 14px;
}

.skills-header i {
  font-size: 16px;
}

.skills-title {
  color: #666;
}

.skills-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.skill-tag {
  background: rgba(76, 175, 80, 0.1);
  color: #4CAF50;
  padding: 6px 12px;
  border-radius: 16px;
  font-size: 12px;
  font-weight: 600;
  border: 1px solid rgba(76, 175, 80, 0.2);
  transition: all 0.2s ease;
}

.skill-tag:hover {
  background: rgba(76, 175, 80, 0.15);
  border-color: rgba(76, 175, 80, 0.3);
}
</style>