<template>
  <div class="comment-item" :class="{ 'is-reply': isReply }">
    <div class="comment-container">
      <div class="comment-avatar">
        <img :src="comment.avatar" :alt="comment.username" />
      </div>
      
      <div class="comment-content">
        <div class="comment-header">
          <div class="comment-username">{{ comment.username }}</div>
        </div>
        
        <div class="comment-text">
          <p>{{ comment.text }}</p>
        </div>
        
        <div class="comment-footer">
          <span class="comment-date">{{ comment.date }}</span>
          <button class="reply-button">댓글쓰기</button>
        </div>
      </div>
    </div>
    
    <div v-if="isReply" class="reply-indicator">
      <div class="reply-line"></div>
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
    isReply: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style scoped>
.comment-item {
  padding: 20px 0;
  border-bottom: 1px solid #E8E8E8;
  position: relative;
}

.comment-item.is-reply {
  background: #FAFAFA;
  padding: 20px 0 19.8px 0;
}

.comment-container {
  display: flex;
  align-items: flex-start;
  gap: 15px;
}

.comment-avatar {
  width: 55px;
  height: 55px;
  flex-shrink: 0;
}

.comment-avatar img {
  width: 100%;
  height: 100%;
  border-radius: 100px;
  object-fit: cover;
}

.comment-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.comment-header {
  display: flex;
  align-items: center;
}

.comment-username {
  color: #262626;
  font-family: Inter, -apple-system, Roboto, Helvetica, sans-serif;
  font-size: 16px;
  font-weight: 600;
  line-height: 17px;
}

.comment-text p {
  color: #555;
  font-family: Lato, -apple-system, Roboto, Helvetica, sans-serif;
  font-size: 13px;
  font-weight: 400;
  line-height: 20.8px;
  margin: 0;
}

.comment-footer {
  display: flex;
  align-items: center;
  gap: 8px;
}

.comment-date {
  color: #AAA;
  font-family: Lato, -apple-system, Roboto, Helvetica, sans-serif;
  font-size: 14px;
  font-weight: 400;
  line-height: 15px;
}

.reply-button {
  color: #3165B2;
  font-family: Lato, -apple-system, Roboto, Helvetica, sans-serif;
  font-size: 12px;
  font-weight: 400;
  line-height: 15px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
}

.reply-button:hover {
  text-decoration: underline;
}

.reply-indicator {
  position: absolute;
  left: 0;
  top: 20px;
  width: 70px;
  height: 55px;
}

.reply-line {
  width: 28px;
  height: 28px;
  border-bottom: 1px solid #707070;
  border-left: 1px solid #707070;
  position: absolute;
  left: 27px;
  top: 1px;
}
</style>
