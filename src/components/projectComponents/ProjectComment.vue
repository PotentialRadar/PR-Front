<template>
  <div class="project-freetalk">
    <div class="freetalk-section">
      <div class="section-header">
        <h3>댓글</h3>
      </div>
      
      <div class="comment-form-section">
        <div class="comment-form">
          <div class="form-container">
            <textarea 
              v-model="newComment"
              placeholder="내용을 작성해 주세요."
              class="comment-textarea"
            ></textarea>
            
            <div class="form-actions">
              <div class="lock-icon">
                <svg width="15" height="20" viewBox="0 0 15 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M7.49951 0.157715C6.2858 0.158985 5.12215 0.641721 4.26385 1.49987C3.40556 2.35801 2.92279 3.52142 2.92131 4.73513V6.75441H1.84458C1.38055 6.75505 0.935623 6.93956 0.607506 7.26768C0.279388 7.5958 0.0948732 8.04073 0.0942383 8.50476V17.9293C0.0948732 18.3933 0.279388 18.8381 0.607506 19.1662C0.935623 19.4943 1.38055 19.679 1.84458 19.6797H13.1538C13.6179 19.679 14.0626 19.4943 14.3907 19.1662C14.7188 18.8381 14.9036 18.3933 14.9042 17.9293V8.50476C14.9036 8.04073 14.7188 7.5958 14.3907 7.26768C14.0626 6.93956 13.6179 6.75505 13.1538 6.75441H12.0771V4.73513C12.0756 3.52156 11.5929 2.35818 10.7348 1.50006C9.87665 0.641939 8.71308 0.159197 7.49951 0.157715ZM4.53963 4.73513C4.5409 3.9505 4.85314 3.1984 5.40796 2.64359C5.96278 2.08877 6.71488 1.77652 7.49951 1.77525C8.28414 1.77652 9.03643 2.08877 9.59125 2.64359C10.1461 3.1984 10.4583 3.9505 10.4596 4.73513V6.75441H4.53963V4.73513ZM13.2898 8.37038V18.0629H1.71255V8.37038H13.2898Z" fill="#262626"/>
                </svg>
              </div>
              <button class="submit-button" @click="submitComment">
                등록하기
              </button>
            </div>
          </div>
          
        </div>
      </div>
      
      <div class="comments-list">
        <template v-for="comment in comments" :key="comment.id">
          <CommentItem 
            :comment="comment"
            :isReply="comment.isReply"
            @reply-to="handleReplyTo"   @edit-comment="handleEditComment"
            @delete-comment="handleDeleteComment"
          />
          <div v-if="activeReplyCommentId === comment.id" class="reply-form-outer">
            <textarea
              v-model="newReplyText"
              placeholder="답글 내용을 작성해 주세요."
              class="reply-textarea"
            ></textarea>
            <div class="reply-form-actions">
              <button class="submit-reply-button" @click="submitReply">등록</button>
              <button class="cancel-reply-button" @click="cancelReply">취소</button>
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import CommentItem from './CommentItem.vue'

export default {
  name: 'ProjectComment',
  components: {
    CommentItem
  },
  data() {
    return {
      newComment: '',
      comments: [
        {
          id: 1,
          username: 'd*****t',
          text: '안녕하세요, AI 필터, 리터치 기능은 제공을 해주시는 걸까요? 아니면 개발사가 알아서 구현해야하는 건가요?',
          date: '2025-07-15 01:14:59',
          avatar: 'https://api.builder.io/api/v1/image/assets/TEMP/61a4dd55df3c773db2ad493c4d652e8db101828c?width=110',
          isReply: false
        },
        {
          id: 2,
          username: 't*****r',
          text: '안녕하세요. 개발사가 자체적으로 구현하셔야 합니다. API 를 활용하시거나..',
          date: '2025-07-15 09:39:16',
          avatar: 'https://api.builder.io/api/v1/image/assets/TEMP/61a4dd55df3c773db2ad493c4d652e8db101828c?width=110',
          isReply: true
        },
        {
          id: 3,
          username: 'userABC',
          text: '또 다른 질문입니다!',
          date: '2025-07-20 10:00:00',
          avatar: 'https://api.builder.io/api/v1/image/assets/TEMP/61a4dd55df3c773db2ad493c4d652e8db101828c?width=110',
          isReply: false
        }
      ],
      activeReplyCommentId: null, // 현재 답글 폼이 열려있는 댓글의 ID
      newReplyText: ''           // 답글 폼에 입력될 텍스트
    }
  },
  methods: {
    submitComment() {
      if (this.newComment.trim()) {
        console.log('새로운 댓글 등록:', this.newComment);
        // 새 댓글 객체 생성 및 배열에 추가 (실제로는 API 호출)
        const newId = this.comments.length ? Math.max(...this.comments.map(c => c.id)) + 1 : 1;
        this.comments.push({
          id: newId,
          username: '새로운유저', // 실제 유저 이름으로 대체
          text: this.newComment.trim(),
          date: new Date().toLocaleString(),
          avatar: 'https://api.builder.io/api/v1/image/assets/TEMP/61a4dd55df3c773db2ad493c4d652e8db101828c?width=110',
          isReply: false
        });
        this.newComment = '';
      }
    },
    // CommentItem에서 'reply-to' 이벤트를 받았을 때 호출
    handleReplyTo(commentId) {
      this.activeReplyCommentId = commentId; // 어떤 댓글에 대한 답글 폼을 열지 설정
      this.newReplyText = ''; // 답글 텍스트 초기화
    },
    // 답글 등록
    submitReply() {
      if (this.newReplyText.trim() && this.activeReplyCommentId !== null) {
        console.log(`댓글 ID ${this.activeReplyCommentId}에 대한 답글 등록:`, this.newReplyText);
        // 답글을 기존 댓글 아래에 추가 (실제로는 API 호출 후 목록 업데이트)
        // 여기서는 임시로 해당 댓글 아래에 대댓글로 추가하는 로직을 보여줍니다.
        const parentCommentIndex = this.comments.findIndex(c => c.id === this.activeReplyCommentId);
        if (parentCommentIndex !== -1) {
          const newId = Math.max(...this.comments.map(c => c.id)) + 1;
          const newReply = {
            id: newId,
            username: '답글유저', // 실제 유저 이름으로 대체
            text: this.newReplyText.trim(),
            date: new Date().toLocaleString(),
            avatar: 'https://api.builder.io/api/v1/image/assets/TEMP/61a4dd55df3c773db2ad493c4d652e8db101828c?width=110',
            isReply: true // 대댓글로 설정
          };
          // 부모 댓글 바로 다음에 대댓글을 삽입
          this.comments.splice(parentCommentIndex + 1, 0, newReply);
        }
        
        this.newReplyText = '';
        this.activeReplyCommentId = null; // 폼 닫기
      } else {
        alert('답글 내용을 입력해주세요.');
      }
    },
    // 답글 취소
    cancelReply() {
      this.newReplyText = '';
      this.activeReplyCommentId = null; // 폼 닫기
    },
    handleEditComment(commentId) {
      console.log(`[ProjectFreeTalk] 댓글 ID ${commentId} 수정 요청`);
      // 실제 수정 로직 (예: 수정 모달 띄우기, 텍스트를 입력 폼으로 전환 등)
      // 이 부분은 ProjectFreeTalk에서 직접 처리하거나, CommentItem으로 다시 props를 내려주어 처리할 수 있습니다.
    },
    handleDeleteComment(commentId) {
      console.log(`[ProjectFreeTalk] 댓글 ID ${commentId} 삭제 요청`);
      this.comments = this.comments.filter(c => c.id !== commentId);
      // 실제로는 API 호출을 통해 서버에서도 삭제해야 합니다.
    }
  }
}
</script>

<style scoped>
.project-freetalk {
  padding: 61px 0 60px 0;
  border-top: 1px solid #E8E8E8;
}

.section-header {
  display: flex;
  align-items: center;
  margin-bottom: 24px;
}

.section-header h3 {
  color: #262626;
  font-size: 17px;
  font-weight: 700;
  line-height: 20px;
  margin: 0;
  margin-right: 10px;
}

.section-description span {
  color: #AAA;
  font-size: 14px;
  font-weight: 300;
  line-height: 17px;
  padding-top: 2px;
}

.comment-form-section {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 20px;
}

.comment-form {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.form-container {
  display: flex;
  height: 150px;
  padding: 16px;
  flex-direction: column;
  gap: 10px;
  border-radius: 3px;
  border: 1px solid #E8E8E8;
  background: #FFF;
}

.comment-textarea {
  flex: 1;
  padding: 2px;
  border: none;
  outline: none;
  resize: none;
  background: #FFF;
  color: #AAA;
  font-size: 12px;
  font-weight: 400;
  line-height: 15px;
}

.comment-textarea::placeholder {
  color: #AAA;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 5px;
}

.lock-icon {
  display: flex;
  width: 45px;
  height: 40px;
  justify-content: center;
  align-items: center;
  border-radius: 5px;
  background: #F6F6F6;
}

.submit-button {
  display: flex;
  width: 140px;
  height: 40px;
  padding: 1px 6px;
  justify-content: center;
  align-items: center;
  border-radius: 3px;
  background: #FF7D12;
  color: #FFF;
  text-align: center;
  font-size: 12px;
  font-weight: 400;
  line-height: 15px;
  border: none;
  cursor: pointer;
}

.submit-button:hover {
  background: #e66a00;
}

.form-notice {
  padding: 15px;
  border-radius: 3px;
  background: #F7F7F8;
}

.form-notice p {
  color: #AAA;
  font-size: 11px;
  font-weight: 400;
  line-height: 14px;
  margin: 0;
}

.comments-list {
  display: flex;
  flex-direction: column;
}
</style>
