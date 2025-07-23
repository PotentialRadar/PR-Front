<template>
  <div class="project-freetalk">
    <div class="freetalk-section">
      <div class="section-header">
        <h3>프리톡</h3>
        <div class="section-description">
          <span>문의 내용을 작성해 주세요. 프로젝트 지원은 우측 상단 지원하기를 이용해주세요.</span>
        </div>
      </div>
      
      <div class="comment-form-section">
        <div class="comment-form">
          <div class="form-container">
            <textarea 
              v-model="newComment"
              placeholder="문의 내용을 작성해 주세요."
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
          
          <div class="form-notice">
            <p>* 작성 내용은 수정 및 삭제가 불가합니다. 이메일, 전화번호등 직접 연락처를 공유하여 직거래를 유도할 경우 서비스 이용에 제재를 받을 수 있습니다.</p>
          </div>
        </div>
      </div>
      
      <div class="comments-list">
        <CommentItem 
          v-for="comment in comments" 
          :key="comment.id"
          :comment="comment"
          :isReply="comment.isReply"
        />
      </div>
    </div>
  </div>
</template>

<script>
import CommentItem from './CommentItem.vue'

export default {
  name: 'ProjectFreeTalk',
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
          text: '안녕하세요, AI 필터, 리터치 기능은 제공을 해주시는 걸까요? 아니면 개발사가 알아서 구현해야하�� 건가요?',
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
        }
      ]
    }
  },
  methods: {
    submitComment() {
      if (this.newComment.trim()) {
        // Here you would typically send the comment to a server
        console.log('Submitting comment:', this.newComment);
        this.newComment = '';
      }
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
  font-family: Inter, -apple-system, Roboto, Helvetica, sans-serif;
  font-size: 17px;
  font-weight: 700;
  line-height: 20px;
  margin: 0;
  margin-right: 10px;
}

.section-description span {
  color: #AAA;
  font-family: Inter, -apple-system, Roboto, Helvetica, sans-serif;
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
  font-family: Lato, -apple-system, Roboto, Helvetica, sans-serif;
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
  font-family: Lato, -apple-system, Roboto, Helvetica, sans-serif;
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
  font-family: Lato, -apple-system, Roboto, Helvetica, sans-serif;
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
