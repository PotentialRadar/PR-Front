<template>
  <div v-if="show && selectedProject" class="feedback-modal-overlay">
    <div class="feedback-modal">
      <div class="feedback-modal-header">
        <div class="ai-badge">🤖 AI 추천</div>
        <button @click="$emit('close')" class="close-btn">✕</button>
      </div>
      <div class="feedback-modal-content">
        <h3>{{ selectedProject.title }}</h3>
        <p class="modal-question">이 AI 추천이 어떠셨나요?</p>
        <div class="feedback-buttons">
          <button @click="$emit('feedback', 'THUMBS_UP')" class="feedback-btn thumbs-up">
            👍 좋은 추천이에요!
            <span class="sub-text">상세페이지로 이동합니다</span>
          </button>
          <button @click="$emit('feedback', 'THUMBS_DOWN')" class="feedback-btn thumbs-down">
            👎 별로예요
            <span class="sub-text">피드백을 남기고 이동합니다</span>
          </button>
        </div>
        <div class="feedback-skip">
          <button @click="$emit('close')" class="skip-btn">피드백 나중에</button>
          <button @click="$emit('go-to-project')" class="detail-btn">바로 상세보기</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  show: {
    type: Boolean,
    default: false
  },
  selectedProject: {
    type: Object,
    default: null
  }
})

defineEmits(['close', 'feedback', 'go-to-project'])
</script>

<style scoped>
.feedback-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.feedback-modal {
  background: white;
  border-radius: 16px;
  max-width: 500px;
  width: 100%;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  animation: slideUp 0.3s ease-out;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.feedback-modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px 16px 24px;
  border-bottom: 1px solid #e9ecef;
}

.ai-badge {
  background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
  color: white;
  padding: 6px 12px;
  border-radius: 16px;
  font-size: 0.9rem;
  font-weight: 600;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #6c757d;
  cursor: pointer;
  padding: 4px;
  transition: color 0.2s ease;
}

.close-btn:hover {
  color: #333;
}

.feedback-modal-content {
  padding: 24px;
}

.feedback-modal-content h3 {
  margin: 0 0 16px 0;
  color: #333;
  font-size: 1.25rem;
  font-weight: 600;
  line-height: 1.4;
}

.modal-question {
  margin: 0 0 24px 0;
  color: #666;
  font-size: 1.1rem;
  text-align: center;
}

.feedback-buttons {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 20px;
}

.feedback-btn {
  padding: 16px 20px;
  border: 2px solid #e9ecef;
  background: white;
  border-radius: 12px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: left;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.feedback-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.feedback-btn.thumbs-up:hover {
  border-color: #28a745;
  background: linear-gradient(135deg, #f8fff9 0%, #e8f5e8 100%);
  color: #155724;
}

.feedback-btn.thumbs-down:hover {
  border-color: #dc3545;
  background: linear-gradient(135deg, #fff8f8 0%, #f5e8e8 100%);
  color: #721c24;
}

.sub-text {
  font-size: 0.9rem;
  font-weight: 400;
  opacity: 0.7;
}

.feedback-skip {
  display: flex;
  gap: 12px;
  justify-content: center;
}

.skip-btn, .detail-btn {
  background: none;
  border: 1px solid #dee2e6;
  color: #6c757d;
  cursor: pointer;
  font-size: 0.9rem;
  padding: 10px 16px;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.skip-btn:hover, .detail-btn:hover {
  background: #f8f9fa;
  color: #333;
}

.detail-btn {
  background: #007bff;
  color: white;
  border-color: #007bff;
}

.detail-btn:hover {
  background: #0056b3;
  border-color: #0056b3;
}

@media (max-width: 480px) {
  .feedback-modal-overlay {
    padding: 16px;
  }
  
  .feedback-modal-content {
    padding: 20px;
  }
  
  .feedback-buttons {
    gap: 10px;
  }
  
  .feedback-btn {
    font-size: 1rem;
    padding: 14px 16px;
  }
  
  .feedback-skip {
    flex-direction: column;
  }
}
</style>