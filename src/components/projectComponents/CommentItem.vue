<template>
  <div class="comment-item" :class="{ 'is-reply': comment.isReply }">
    <div class="comment-header">
      <img :src="comment.avatar" alt="User Avatar" class="user-avatar" />
      <span class="username">{{ comment.username }}</span>
      <span v-if="comment.isPrivate" class="private-icon" title="비밀 댓글">
        <svg width="12" height="12" viewBox="0 0 15 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M7.49951 0.157715C6.2858 0.158985 5.12215 0.641721 4.26385 1.49987C3.40556 2.35801 2.92279 3.52142 2.92131 4.73513V6.75441H1.84458C1.38055 6.75505 0.935623 6.93956 0.607506 7.26768C0.279388 7.5958 0.0948732 8.04073 0.0942383 8.50476V17.9293C0.0948732 18.3933 0.279388 18.8381 0.607506 19.1662C0.935623 19.4943 1.38055 19.679 1.84458 19.6797H13.1538C13.6179 19.679 14.0626 19.4943 14.3907 19.1662C14.7188 18.8381 14.9036 18.3933 14.9042 17.9293V8.50476C14.9036 8.04073 14.7188 7.5958 14.3907 7.26768C14.0626 6.93956 13.6179 6.75505 13.1538 6.75441H12.0771V4.73513C12.0756 3.52156 11.5929 2.35818 10.7348 1.50006C9.87665 0.641939 8.71308 0.159197 7.49951 0.157715ZM4.53963 4.73513C4.5409 3.9505 4.85314 3.1984 5.40796 2.64359C5.96278 2.08877 6.71488 1.77652 7.49951 1.77525C8.28414 1.77652 9.03643 2.08877 9.59125 2.64359C10.1461 3.1984 10.4583 3.9505 10.4596 4.73513V6.75441H4.53963V4.73513ZM13.2898 8.37038V18.0629H1.71255V8.37038H13.2898Z" fill="#888"/>
        </svg>
      </span>
      <span class="comment-date">{{ comment.date }}</span>
    </div>
    <template v-if="canViewContent">
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
    </template>
    <template v-else>
      <div class="comment-body private-placeholder">
        <svg width="12" height="12" viewBox="0 0 15 20" fill="none" xmlns="http://www.w3.org/2000/svg" style="margin-right: 5px;">
          <path d="M7.49951 0.157715C6.2858 0.158985 5.12215 0.641721 4.26385 1.49987C3.40556 2.35801 2.92279 3.52142 2.92131 4.73513V6.75441H1.84458C1.38055 6.75505 0.935623 6.93956 0.607506 7.26768C0.279388 7.5958 0.0948732 8.04073 0.0942383 8.50476V17.9293C0.0948732 18.3933 0.279388 18.8381 0.607506 19.1662C0.935623 19.4943 1.38055 19.679 1.84458 19.6797H13.1538C13.6179 19.679 14.0626 19.4943 14.3907 19.1662C14.7188 18.8381 14.9036 18.3933 14.9042 17.9293V8.50476C14.9036 8.04073 14.7188 7.5958 14.3907 7.26768C14.0626 6.93956 13.6179 6.75505 13.1538 6.75441H12.0771V4.73513C12.0756 3.52156 11.5929 2.35818 10.7348 1.50006C9.87665 0.641939 8.71308 0.159197 7.49951 0.157715ZM4.53963 4.73513C4.5409 3.9505 4.85314 3.1984 5.40796 2.64359C5.96278 2.08877 6.71488 1.77652 7.49951 1.77525C8.28414 1.77652 9.03643 2.08877 9.59125 2.64359C10.1461 3.1984 10.4583 3.9505 10.4596 4.73513V6.75441H4.53963V4.73513ZM13.2898 8.37038V18.0629H1.71255V8.37038H13.2898Z" fill="#888"/>
        </svg>
        <p>(비밀글)</p>
      </div>
    </template>

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
    isReply: {
      type: Boolean,
      default: false
    },
    projectOwnerId: {
      type: [Number, String],
      default: null
    },
    currentUserId: {
      type: [Number, String],
      default: null
    },
    parentAuthorId: { // NEW
      type: [Number, String],
      default: null
    }
  },
  computed: {
    canViewContent() {
      if (!this.comment.isPrivate) {
        return true;
      }

      const commentAuthorId = this.comment._raw?.userId;
      const isAuthor = this.currentUserId === commentAuthorId;
      const isProjectOwner = Number(this.currentUserId) === Number(this.projectOwnerId);
      const isParentCommentAuthor = this.comment.isReply && this.currentUserId === this.parentAuthorId; // NEW

      // --- 디버깅 로그 ---
      if (this.comment.isPrivate) {
        console.log({
          commentId: this.comment.id,
          isPrivate: this.comment.isPrivate,
          currentUserId: this.currentUserId,
          commentAuthorId: commentAuthorId,
          projectOwnerId: Number(this.projectOwnerId),
          parentAuthorId: this.parentAuthorId, // NEW
          isAuthor: isAuthor,
          isProjectOwner: isProjectOwner,
          isParentCommentAuthor: isParentCommentAuthor, // NEW
          canView: isAuthor || isProjectOwner || isParentCommentAuthor
        });
      }
      // --- 디버깅 로그 끝 ---

      if (!this.currentUserId) {
        return false; // 로그인하지 않은 사용자는 비공개 댓글을 볼 수 없음
      }

      return isAuthor || isProjectOwner || isParentCommentAuthor; // NEW
    }
  },
  methods: {
    // 부모 컴포넌트에 답글 이벤트를 발생시킵니다.
    emitReplyEvent(commentId) {
      this.$emit('reply-to', commentId);
    },
    editComment() {
      const newText = prompt('새 댓글 내용을 입력하세요:', this.comment.text);
      if (newText !== null && newText.trim() !== '') {
        this.$emit('edit-comment', this.comment.id, newText.trim());
      }
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

.private-icon {
  margin-left: 5px;
  display: inline-flex;
  align-items: center;
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

.private-placeholder {
  display: flex;
  align-items: center;
  color: #888;
  font-style: italic;
}

/* 이제 CommentItem 내부에 답글 폼이 없으므로 관련 스타일은 모두 제거됩니다. */
/* .reply-form-container, .reply-textarea, .reply-form-actions 등 */
</style>