<template>
  <div class="comment-item" :class="{ 'is-reply': comment.isReply }">
    <div class="comment-header">
      <img :src="comment.avatar" alt="User Avatar" class="user-avatar" />
      <span class="username">{{ comment.username }}</span>
      <span class="comment-date">{{ comment.date }}</span>
    </div>
    <div class="comment-body">
      <p>{{ comment.text }}</p>
    </div>

    <div class="comment-actions">
      <button 
        v-if="!comment.isReply" 
        class="action-button reply-button" 
        @click="emitReplyEvent(comment.id)"
      >
        답글 남기기
      </button>
      <button class="action-button edit-button" @click="editComment">수정</button>
      <button class="action-button delete-button" @click="deleteComment">삭제</button>
    </div>

    </div>
</template>

<script>
export default {
  name: 'CommentItem',
  props: {
    comment: {
      type: Object,
      required: true
    },
    isReply: { // 이 prop은 대댓글 스타일링에 계속 사용됩니다.
      type: Boolean,
      default: false
    }
  },
  methods: {
    // 부모 컴포넌트에 답글 이벤트를 발생시킵니다.
    emitReplyEvent(commentId) {
      this.$emit('reply-to', commentId);
    },
    editComment() {
      console.log(`댓글 ID ${this.comment.id} 수정`);
      // 실제 수정 로직 (예: 모달 띄우기, 인라인 수정 폼 전환 등)
      this.$emit('edit-comment', this.comment.id); // 부모로 이벤트 발생
    },
    deleteComment() {
      if (confirm('이 댓글을 삭제하시겠습니까?')) {
        console.log(`댓글 ID ${this.comment.id} 삭제`);
        this.$emit('delete-comment', this.comment.id); // 부모로 이벤트 발생
      }
    }
  }
}
</script>

<style scoped>
.comment-item {
  display: flex;
  flex-direction: column;
  padding: 15px;
  border-top: 1px solid #eee;
  border-bottom: 1px solid #eee; /* 각 댓글 아이템 구분선 */
}

.comment-item:first-child {
  border-top: none;
}

.comment-item.is-reply {
  margin-left: 30px;
  padding-left: 20px;
  background-color: #f3f3f3;
}

.comment-header {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
  gap: 10px;
}

.user-avatar {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  object-fit: cover;
}

.username {
  color: #262626;
  font-size: 16px;
  font-weight: 600;
  line-height: 17px;
}

.comment-date {
  color: #AAA;
  font-size: 14px;
  font-weight: 400;
  line-height: 15px;
}

.comment-body p {
  color: #555;
  font-size: 13px;
  font-weight: 400;
  line-height: 20.8px;
  margin: 0;
  padding: 0 10px;
}

.comment-actions {
  display: flex;
  justify-content: flex-end; /* 오른쪽 끝으로 정렬 */
  gap: 10px;
  margin-top: 10px;
}

.action-button {
  background: none;
  border: none;
  color: #3165B2; /* 파란색 계열 */
  font-size: 12px;
  font-weight: 400;
  cursor: pointer;
  padding: 5px 0;
}

.action-button:hover {
  text-decoration: underline;
}

.delete-button {
  color: #D32F2F; /* 삭제 버튼은 경고색 (빨간색) */
}

/* 이제 CommentItem 내부에 답글 폼이 없으므로 관련 스타일은 모두 제거됩니다. */
/* .reply-form-container, .reply-textarea, .reply-form-actions 등 */
</style>