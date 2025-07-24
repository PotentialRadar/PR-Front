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
  display: flex;
  flex-direction: column;
  padding: 15px 0;
  border-bottom: 1px solid #eee; /* 각 댓글 아이템 구분선 */
}

.comment-item:last-child {
  border-bottom: none; /* 마지막 아이템에는 구분선 없음 */
}

.comment-item.is-reply {
  margin-left: 30px;
  padding-left: 20px; /* 원하는 만큼 오른쪽으로 들여쓰기 */
  /* 필요에 따라 패딩도 조정할 수 있습니다. */
  /* padding-left: 20px; */
  background-color: #f3f3f3;
}

.comment-container {
  display: flex;
  align-items: flex-start;
  gap: 15px;
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
  display: flex; /* 이미 flex로 설정되어 있음 */
  align-items: center;
  margin-bottom: 8px;
  /* 여기에 gap 속성을 추가하여 요소들 사이에 간격을 줍니다. */
  gap: 10px; /* 원하는 간격 값으로 조정 (예: 10px) */
}

.comment-username {
  color: #262626;
  font-size: 16px;
  font-weight: 600;
  line-height: 17px;
  padding: 0 10px;
}

.username { /* 기존에 없는 셀렉터이므로 추가함. 실제 코드에 맞게 수정 필요 */
  font-weight: bold;
  /* margin-right: 10px; // gap을 사용하면 이 속성은 필요 없습니다. */
  color: #262626;
  font-size: 14px;
}

.comment-text p {
  color: #555;
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
  font-size: 14px;
  font-weight: 400;
  line-height: 15px;
}

.reply-button {
  color: #3165B2;
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
