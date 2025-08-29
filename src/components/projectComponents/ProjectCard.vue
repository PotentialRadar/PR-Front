<template>
  <div class="project-card">
    <div class="card-header">
      <div class="header-left">
        <div class="status-title-container">
          <div class="status-badge" v-if="project.status" :class="statusClass">
            <span>{{ displayStatus }}</span>
          </div>
          <div class="title-container">
            <h3 class="project-title">{{ project.title }}</h3>
          </div>
        </div>
      </div>
      <div class="header-right">
        <div class="view-count-display">
          👀 {{ project.viewCount }}
        </div>
        <div class="like-container">
          <button class="like-button" @click.stop="handleLikeToggle">
            <span class="heart-icon" :class="{ 'liked': isLiked }">{{ isLiked ? '❤️' : '🤍' }}</span>
          </button>
          <span class="like-count">{{ likeCount }}</span>
        </div>
      </div>
    </div>

    <div class="description-section" v-if="project.description">
      <p class="project-description">
        {{ project.description }}
      </p>
    </div>

    <div class="category-tags-section">
      <div class="project-tags">
        <!-- 기술스택 표시 (techStacks 배열 사용) -->
        <div class="self-tag" v-for="tech in project.techStacks" :key="tech.techStackName || tech">
          {{ tech.techStackName || tech }}
        </div>
        <!-- fallback으로 tags도 지원 -->
        <div class="self-tag" v-for="tag in project.tags" :key="tag" v-if="!project.techStacks || !project.techStacks.length">
          {{ tag }}
        </div>
      </div>
    </div>

    <div class="project-info">
      <div class="info-item">
        <div class="info-icon">
          <i class="bi bi-clock"></i>
        </div>
        <div class="info-content">
          <div class="info-label">진행 기간</div>
          <div class="info-value">{{ displayDuration  }}</div>
        </div>
      </div>

      <div class="info-item">
        <div class="info-icon">
          <i class="bi bi-people"></i>
        </div>
        <div class="info-content">
          <div class="info-label">모집 인원</div>
          <div class="info-value">{{ project.recruitCount ?? 0 }}</div>
        </div>
      </div>

      <div class="info-item">
        <div class="info-icon">
          <i class="bi bi-person-plus"></i>
        </div>
        <div class="info-content">
          <div class="info-label">지원자</div>
          <div class="info-value">{{ project.appliedCount ?? 0  }}</div>
        </div>
      </div>

      <div class="info-item">
        <div class="info-icon">
          <i class="bi bi-calendar-event"></i>
        </div>
        <div class="info-content">
          <div class="info-label">마감일정</div>
          <div class="info-value" :class="{ 'urgent': isUrgent(project.deadline || project.recruitDeadline) }">
            {{ project.deadline || formatDeadline(project.recruitDeadline) }}
          </div>
        </div>
      </div>
    </div>

    <div class="bottom-section">
      <button class="detail-button" @click="goToDetail">상세보기</button>
      <button class="apply-button" @click="onApplyClick" v-if="isLoggedIn && project.status === 'RECRUITING'">지원하기</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { toggleLike, isLiked as checkIsLiked } from '@/api/likes.js';
import { useUserStore } from '@/stores/userStore.js';

const props = defineProps({
  project: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['apply', 'like-updated']);
const router = useRouter();
const userStore = useUserStore();
const isLoggedIn = computed(() => userStore.isLoggedIn);

const isLiked = ref(false);
const likeCount = ref(props.project.likeCount || 0);

const fetchLikeStatus = async () => {
  const projectId = props.project.projectId || props.project.id;

  if (userStore.userId && projectId) {
    try {
      const response = await checkIsLiked('PROJECT', projectId);
      isLiked.value = response.isLiked;
    } catch (error) {
      isLiked.value = false;
    }
  } else {
    isLiked.value = false;
  }
};

onMounted(() => {
  const projectId = props.project.projectId || props.project.id;
  likeCount.value = props.project.likeCount || 0;

  fetchLikeStatus();
});

watch(() => userStore.userId, (newUserId, oldUserId) => {
  const projectId = props.project.projectId || props.project.id;
  if (newUserId) {
    fetchLikeStatus();
  }
});

const handleLikeToggle = async () => {
  if (!userStore.isLoggedIn) {
    alert('로그인이 필요합니다.');
    router.push('/login');
    return;
  }
  try {
    const projectId = props.project.projectId || props.project.id;
    const response = await toggleLike('PROJECT', projectId);
    isLiked.value = response.liked;
    likeCount.value = response.likeCount;
    emit('like-updated', { projectId, liked: response.liked, likeCount: response.likeCount });
  } catch (error) {
    console.error('Error toggling like:', error);
    alert('좋아요 처리에 실패했습니다.');
  }
};

const isUrgent = (deadline) => {
  if (!deadline) return false;
  const today = new Date();
  const end = new Date(deadline);
  const diff = (end - today) / (1000 * 60 * 60 * 24);
  return diff <= 7 && diff >= 0;
};

const formatDeadline = (deadline) => {
  if (!deadline) return '-';
  const today = new Date();
  const dday = Math.ceil((new Date(deadline) - today) / (1000 * 60 * 60 * 24));
  if (dday >= 0) return `D-${dday}`;
  return '마감';
};

const goToDetail = () => {
  router.push({
    name: 'ProjectDetail',
    params: { id: props.project.projectId || props.project.id }
  });
};

const onApplyClick = () => {
  emit('apply', props.project);
};

const displayDuration = computed(() => {
  if (!props.project.startDate || !props.project.endDate) return '-';
  const start = new Date(props.project.startDate);
  const end = new Date(props.project.endDate);
  if (isNaN(start) || isNaN(end)) return '-';
  const diff = Math.round((end - start) / (1000 * 60 * 60 * 24)) + 1;
  if (diff < 7) return `${diff}일`;
  if (diff < 30) return `${Math.round(diff / 7)}주`;
  return `${Math.round(diff / 30)}개월`;
});

const displayStatus = computed(() => {
  console.log('Checking project.status:', props.project.status);
  const statusMap = {
    'RECRUITING': '모집중',
    'IN_PROGRESS': '진행중',
    'COMPLETED': '완료'
  };
  return statusMap[props.project.status] || props.project.status;
});

const statusClass = computed(() => ({
  'status-recruiting': props.project.status === 'RECRUITING',
  'status-in-progress': props.project.status === 'IN_PROGRESS',
  'status-completed': props.project.status === 'COMPLETED',
}));

</script>

<style scoped>
.project-card {
  display: flex;
  padding: 24px;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
  border-radius: 12px;
  border: 2px solid rgba(76, 175, 80, 0.1);
  background: #FFF;
  box-shadow: 0 4px 12px rgba(76, 175, 80, 0.08);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.project-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #4CAF50 0%, #2E7D32 100%);
  border-radius: 12px 12px 0 0;
}

.project-card:hover {
  transform: translateY(-4px);
  border-color: rgba(76, 175, 80, 0.3);
  box-shadow: 0 8px 25px rgba(76, 175, 80, 0.15);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  width: 100%;
  margin-bottom: 16px;
}

.header-left {
  display: flex;
  align-items: center;
  flex: 1;
}

.status-title-container {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 12px;
  flex: 1;
}

.status-badge {
  display: inline-flex;
  padding: 6px 12px;
  align-items: center;
  border-radius: 20px;
  background: #E8F5E8;
  border: 1px solid #4CAF50;
}

.status-badge span {
  color: #2E7D32;
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.2px;
}

.title-container {
  display: flex;
  align-items: center;
  width: 100%;
}

.project-title {
  margin: 0;
  color: #262626;
  font-size: 20px;
  font-weight: 700;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.header-right {
  display: flex;
  align-items: center;
  padding-left: 16px;
  flex-shrink: 0;
}

.view-count-display {
  font-size: 14px;
  color: #666;
  margin-right: 12px;
  display: flex;
  align-items: center;
  gap: 4px;
}

.like-container {
  display: flex;
  align-items: center;
  gap: 8px;
}

.like-button {
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.heart-icon {
  font-size: 22px;
  color: #adb5bd;
  transition: all 0.2s ease-in-out;
}

.heart-icon.liked {
  color: #e74c3c;
  animation: heart-pop 0.3s ease;
}

.like-button:hover .heart-icon.liked {
  color: #c0392b;
}

.like-button:hover .heart-icon:not(.liked) {
  transform: scale(1.15);
  color: #ff8a80;
}

@keyframes heart-pop {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.3);
  }
  100% {
    transform: scale(1);
  }
}

.like-count {
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.description-section {
  width: 100%;
  margin-bottom: 16px;
}

.project-description {
  margin: 0;
  color: #424242;
  font-size: 15px;
  font-weight: 400;
  line-height: 1.6;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

.category-tags-section {
  display: flex;
  width: 100%;
  margin-bottom: 20px;
}

.project-tags {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.self-tag {
  display: inline-flex;
  padding: 6px 12px;
  align-items: center;
  border-radius: 16px;
  background: rgba(76, 175, 80, 0.1);
  border: 1px solid rgba(76, 175, 80, 0.2);
  color: #2E7D32;
  font-size: 12px;
  font-weight: 500;
  white-space: nowrap;
  transition: all 0.2s ease;
}

.self-tag:hover {
  background: rgba(76, 175, 80, 0.2);
  border-color: #4CAF50;
  color: #1B5E20;
}

.project-info {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  width: 100%;
  padding: 20px;
  border-radius: 8px;
  background: rgba(76, 175, 80, 0.05);
  border: 1px solid rgba(76, 175, 80, 0.1);
  margin-bottom: 20px;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 12px;
}

.info-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: #4CAF50;
  color: #FFF;
  font-size: 14px;
  flex-shrink: 0;
}

.info-content {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.info-label {
  color: #6F6F72;
  font-size: 12px;
  font-weight: 500;
  line-height: 1;
}

.info-value {
  color: #262626;
  font-size: 15px;
  font-weight: 700;
  line-height: 1;
}

.info-value.urgent {
  color: #dc3545;
  font-weight: 700;
}

.bottom-section {
  display: flex;
  gap: 12px;
  width: 100%;
  margin-top: auto;
}

.detail-button, .apply-button {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 14px 20px;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
}

.detail-button {
  flex: 6;
  background: #f8f9fa;
  color: #495057;
  border: 1px solid #dee2e6;
}

.detail-button:hover {
  background-color: #f4f6f8; /* 더 연한 색으로 변경 */
}

.apply-button {
  flex: 1;
  background: linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%);
  color: #FFF;
  border: none;
}

.apply-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(76, 175, 80, 0.3);
}

.detail-button:hover::before {
  left: 100%;
}

.detail-button:hover {
  background: linear-gradient(135deg, #388E3C 0%, #1B5E20 100%);
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(76, 175, 80, 0.4);
}

.detail-button:active {
  transform: translateY(-1px);
  box-shadow: 0 4px 15px rgba(76, 175, 80, 0.3);
}

.detail-button i {
  font-size: 18px;
  transition: transform 0.3s ease;
}

.detail-button:hover i {
  transform: scale(1.1);
}

/* 반응형 디자인 */
@media (max-width: 768px) {
  .project-card {
    padding: 20px;
  }

  .project-title {
    font-size: 18px;
  }

  .project-info {
    grid-template-columns: 1fr;
    gap: 12px;
    padding: 16px;
  }

  .bottom-section {
    margin-top: 10px;
  }

  .detail-button {
    max-width: none;
    padding: 11px 18px;
    font-size: 13px;
  }
}

@media (max-width: 480px) {
  .project-card {
    padding: 16px;
  }

  .card-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .header-right {
    padding-left: 0;
    align-self: flex-end;
  }

  .project-title {
    font-size: 16px;
  }

  .project-tags {
    gap: 6px;
  }

  .self-tag {
    font-size: 11px;
    padding: 4px 8px;
  }
}

/* Status-specific styles */
.status-badge.status-recruiting {
  background-color: #E8F5E9;
  border-color: #4CAF50;
}
.status-badge.status-recruiting span {
  color: #2E7D32;
}

.status-badge.status-in-progress {
  background-color: #E3F2FD;
  border-color: #2196F3;
}
.status-badge.status-in-progress span {
  color: #1976D2;
}

.status-badge.status-completed {
  background-color: #F5F5F5;
  border-color: #BDBDBD;
}
.status-badge.status-completed span {
  color: #616161;
}
</style>
