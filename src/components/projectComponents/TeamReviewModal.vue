<template>
  <div v-if="show" class="modal-overlay" @click.self="close">
    <div class="modal-container" @click.stop>
      <div class="modal-header">
        <h3 class="modal-title">{{ project?.title }} - 팀원 리뷰</h3>
        <button @click="close" class="modal-close-button">
          <span class="close-icon">✕</span>
        </button>
      </div>
      <div class="modal-body">
        <form @submit.prevent="submitReview">
          <div class="form-group">
            <label for="reviewee">리뷰할 팀원</label>
            <select id="reviewee" v-model="selectedReviewee" required>
              <option disabled value="">팀원을 선택하세요</option>
              <option v-for="member in members" :key="member.userId" :value="member.userId">
                {{ member.userName }}
              </option>
            </select>
          </div>
          <div class="form-group">
            <label>평점</label>
            <div class="star-rating">
              <span v-for="star in 5" :key="star" class="star" :class="{ filled: star <= rating }" @click="setRating(star)">
                ★
              </span>
            </div>
          </div>
          <div class="form-group">
            <label for="comment">코멘트</label>
            <textarea id="comment" v-model="comment" placeholder="팀원에 대한 상세한 리뷰를 남겨주세요." rows="5"></textarea>
          </div>
          <div class="modal-actions">
            <button type="submit" class="submit-review-btn">
              <span class="btn-icon">✅</span>
              리뷰 제출
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { createTeamMemberReview } from '@/api/projects';
import { useToast } from 'vue-toastification';

const props = defineProps({
  show: Boolean,
  project: Object,
  members: Array, // 멤버 목록을 받을 prop 추가
});

const emit = defineEmits(['close']);
const toast = useToast();

const selectedReviewee = ref('');
const rating = ref(0);
const comment = ref(''); // 코멘트 ref 추가

// project.members 대신 members prop을 사용하도록 수정
watch(() => props.show, (newVal) => {
  if (newVal) {
    selectedReviewee.value = '';
    rating.value = 0;
    comment.value = ''; // 모달 열릴 때 코멘트 초기화
  }
});

const setRating = (star) => {
  rating.value = star;
};

const submitReview = async () => {
  if (!selectedReviewee.value || rating.value === 0) {
    toast.warning('팀원과 평점을 모두 선택해주세요.');
    return;
  }

  try {
    const payload = {
      projectId: props.project.projectId,
      revieweeId: selectedReviewee.value,
      rating: rating.value,
      comment: comment.value, // 코멘트 페이로드에 추가
    };
    await createTeamMemberReview(payload);
    toast.success('리뷰가 성공적으로 제출되었습니다.');
    close();
  } catch (error) {
    console.error('리뷰 제출 실패:', error);
    const errorMessage = error.response && error.response.data && error.response.data.message
                       ? error.response.data.message
                       : '리뷰 제출에 실패했습니다. 이미 해당 팀원에 대한 리뷰를 작성했을 수 있습니다.';
    toast.error(errorMessage);
  }
};

const close = () => {
  emit('close');
};
</script>

<style scoped>
/* 모달 기본 스타일 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  backdrop-filter: blur(5px); /* 블러 효과 강화 */
  transition: background 0.3s ease; /* 배경 전환 효과 */
}

.modal-container {
  background: #FFF;
  border-radius: 16px;
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  overflow: hidden;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.25); /* 그림자 강화 */
  display: flex;
  flex-direction: column;
  animation: modalSlideIn 0.4s cubic-bezier(0.25, 0.8, 0.25, 1); /* 애니메이션 개선 */
}

@keyframes modalSlideIn {
  from {
    opacity: 0;
    transform: translateY(-80px) scale(0.9);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* 모달 헤더 */
.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid #f0f0f0;
  background: linear-gradient(135deg, #4CAF50, #66BB6A); /* 그라데이션 유지 */
  color: white;
}

.modal-title {
  margin: 0;
  font-size: 22px; /* 폰트 크기 약간 키움 */
  font-weight: 700;
}

.modal-close-button {
  background: none;
  border: none;
  color: white;
  font-size: 28px; /* 아이콘 크기 키움 */
  cursor: pointer;
  padding: 0;
  line-height: 1;
  transition: transform 0.3s ease, color 0.2s ease; /* 전환 효과 추가 */
}

.modal-close-button:hover {
  transform: rotate(90deg) scale(1.1); /* 호버 시 회전 및 확대 */
  color: #e0e0e0;
}

/* 모달 본문 */
.modal-body {
  padding: 24px;
  overflow-y: auto;
}

.form-group {
  margin-bottom: 28px; /* 간격 약간 늘림 */
}

.form-group label {
  display: block;
  margin-bottom: 10px;
  font-weight: 600;
  font-size: 15px; /* 폰트 크기 약간 키움 */
  color: #333; /* 색상 진하게 */
}

.form-group select,
.form-group textarea {
  width: 100%;
  padding: 14px; /* 패딩 약간 늘림 */
  border-radius: 10px; /* 둥근 모서리 */
  border: 1px solid #e0e0e0; /* 테두리 색상 변경 */
  transition: border-color 0.3s, box-shadow 0.3s, background-color 0.3s;
  font-size: 16px;
  box-sizing: border-box;
  background: #fefefe; /* 배경색 약간 밝게 */
}

.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #4CAF50; /* 포커스 시 테두리 색상 */
  box-shadow: 0 0 0 4px rgba(76, 175, 80, 0.3); /* 포커스 시 그림자 강화 */
  background: #fff;
}

.form-group textarea {
  resize: vertical;
  font-family: inherit;
  min-height: 120px;
}

/* 별점 */
.star-rating {
  display: flex;
  gap: 10px; /* 간격 약간 늘림 */
  align-items: center;
  justify-content: center; /* 중앙 정렬 */
  padding: 10px 0;
}

.star {
  font-size: 40px; /* 별 크기 키움 */
  color: #ccc;
  cursor: pointer;
  transition: color 0.2s, transform 0.2s;
}

.star:hover {
  transform: scale(1.2); /* 호버 시 확대 */
}

.star.filled {
  color: #FFD700; /* 채워진 별 색상 (골드) */
  text-shadow: 0 0 8px rgba(255, 215, 0, 0.6); /* 그림자 추가 */
}

/* 모달 액션 */
.modal-actions {
  display: flex;
  justify-content: center;
  padding-top: 20px; /* 패딩 늘림 */
  border-top: 1px solid #f0f0f0;
}

.submit-review-btn {
  padding: 14px 36px; /* 패딩 늘림 */
  background: #4CAF50;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 17px; /* 폰트 크기 약간 키움 */
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15); /* 그림자 추가 */
}

.submit-review-btn:hover {
  background: #45a049;
  transform: translateY(-2px);
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.25); /* 호버 시 그림자 강화 */
}

.btn-icon {
  font-size: 18px; /* 아이콘 크기 키움 */
}
</style>