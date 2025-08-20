<template>
  <div class="project-freetalk">
    <div class="freetalk-section">
      <div class="section-header">
        <h3>댓글</h3>
      </div>

      <!-- 작성 폼 -->
      <div class="comment-form-section">
        <div class="comment-form">
          <div class="form-container">
            <textarea
                v-model="newComment"
                placeholder="내용을 작성해 주세요."
                class="comment-textarea"
                @keydown.ctrl.enter.prevent="submitComment"
            ></textarea>

            <div class="form-actions">
              <div
                  class="lock-icon"
                  :class="{ active: isPrivate }"
                  :title="isPrivate ? '비밀 댓글' : '공개 댓글'"
                  @click="toggleIsPrivate"
              >
                <svg width="15" height="20" viewBox="0 0 15 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M7.49951 0.157715C6.2858 0.158985 5.12215 0.641721 4.26385 1.49987C3.40556 2.35801 2.92279 3.52142 2.92131 4.73513V6.75441H1.84458C1.38055 6.75505 0.935623 6.93956 0.607506 7.26768C0.279388 7.5958 0.0948732 8.04073 0.0942383 8.50476V17.9293C0.0948732 18.3933 0.279388 18.8381 0.607506 19.1662C0.935623 19.4943 1.38055 19.679 1.84458 19.6797H13.1538C13.6179 19.679 14.0626 19.4943 14.3907 19.1662C14.7188 18.8381 14.9036 18.3933 14.9042 17.9293V8.50476C14.9036 8.04073 14.7188 7.5958 14.3907 7.26768C14.0626 6.93956 13.6179 6.75505 13.1538 6.75441H12.0771V4.73513C12.0756 3.52156 11.5929 2.35818 10.7348 1.50006C9.87665 0.641939 8.71308 0.159197 7.49951 0.157715ZM4.53963 4.73513C4.5409 3.9505 4.85314 3.1984 5.40796 2.64359C5.96278 2.08877 6.71488 1.77652 7.49951 1.77525C8.28414 1.77652 9.03643 2.08877 9.59125 2.64359C10.1461 3.1984 10.4583 3.9505 10.4596 4.73513V6.75441H4.53963V4.73513ZM13.2898 8.37038V18.0629H1.71255V8.37038H13.2898Z" fill="#262626"/>
                </svg>
              </div>
              <button class="submit-button" @click="submitComment" :disabled="submitting || !canSubmit">
                {{ submitting ? '등록 중…' : '등록하기' }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- 목록 -->
      <div class="comments-list">
        <template v-for="comment in comments" :key="comment.id">
          <CommentItem
              :comment="comment"
              :isReply="comment.isReply"
              :projectOwnerId="props.projectOwnerId"
              :currentUserId="userStore.userId"
              :parentAuthorId="comment.parentAuthorId"
              @reply-to="handleReplyTo"
              @edit-comment="handleEditComment"
              @delete-comment="handleDeleteComment"
          />
          <div v-if="activeReplyCommentId === comment.id" class="reply-form-outer">
            <textarea
                v-model="newReplyText"
                placeholder="답글 내용을 작성해 주세요."
                class="reply-textarea"
                @keydown.ctrl.enter.prevent="submitReply"
            ></textarea>
            <div class="reply-form-actions">
              <div
                  class="lock-icon"
                  :class="{ active: isReplyPrivate }"
                  :title="isReplyPrivate ? '비밀 답글' : '공개 답글'"
                  @click="toggleIsReplyPrivate"
              >
                <svg width="15" height="20" viewBox="0 0 15 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M7.49951 0.157715C6.2858 0.158985 5.12215 0.641721 4.26385 1.49987C3.40556 2.35801 2.92279 3.52142 2.92131 4.73513V6.75441H1.84458C1.38055 6.75505 0.935623 6.93956 0.607506 7.26768C0.279388 7.5958 0.0948732 8.04073 0.0942383 8.50476V17.9293C0.0948732 18.3933 0.279388 18.8381 0.607506 19.1662C0.935623 19.4943 1.38055 19.679 1.84458 19.6797H13.1538C13.6179 19.679 14.0626 19.4943 14.3907 19.1662C14.7188 18.8381 14.9036 18.3933 14.9042 17.9293V8.50476C14.9036 8.04073 14.7188 7.5958 14.3907 7.26768C14.0626 6.93956 13.6179 6.75505 13.1538 6.75441H12.0771V4.73513C12.0756 3.52156 11.5929 2.35818 10.7348 1.50006C9.87665 0.641939 8.71308 0.159197 7.49951 0.157715ZM4.53963 4.73513C4.53963 3.9505 4.85314 3.1984 5.40796 2.64359C5.96278 2.08877 6.71488 1.77652 7.49951 1.77525C8.28414 1.77652 9.03643 2.08877 9.59125 2.64359C10.1461 3.1984 10.4596 3.9505 10.4596 4.73513V6.75441H4.53963V4.73513ZM13.2898 8.37038V18.0629H1.71255V8.37038H13.2898Z" fill="#262626"/>
                </svg>
              </div>
              <button class="submit-reply-button" @click="submitReply" :disabled="submitting || !canSubmitReply">등록</button>
              <button class="cancel-reply-button" @click="cancelReply">취소</button>
            </div>
          </div>
        </template>

        <div v-if="loading" class="form-notice"><p>불러오는 중…</p></div>
        <div v-else-if="error" class="form-notice"><p>댓글을 불러오지 못했습니다.</p></div>
        <div v-else-if="!comments.length" class="form-notice"><p>첫 번째 댓글을 남겨보세요.</p></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue';
import { useRouter } from 'vue-router';
import CommentItem from './CommentItem.vue';
import { listComments, createComment, updateComment, deleteComment } from '@/api/comments';
import { useUserStore } from '@/stores/userStore';

const router = useRouter();
const userStore = useUserStore();

const props = defineProps({
  projectId: { type: [Number, String], required: true },
  projectOwnerId: { type: [Number, String], required: true },
});

// 상태
const comments = ref([]);
const newComment = ref('');
const isPrivate = ref(false);
const activeReplyCommentId = ref(null);
const newReplyText = ref('');
const isReplyPrivate = ref(false); // NEW
const loading = ref(false);
const error = ref(null);
const submitting = ref(false);



// 비밀 댓글 토글
const toggleIsPrivate = () => {
  isPrivate.value = !isPrivate.value;
};

const toggleIsReplyPrivate = () => { // NEW
  isReplyPrivate.value = !isReplyPrivate.value;
};

// 글자수 최소 제한
const MIN_LEN = 1;
const canSubmit = computed(() => (newComment.value?.trim().length || 0) >= MIN_LEN);
const canSubmitReply = computed(() => (newReplyText.value?.trim().length || 0) >= MIN_LEN);

// 서버 DTO → UI 1개 노드 매핑
// DTO: { commentId, userId, nickname, content, createdAt, updatedAt, isPrivate, children }
function adaptOne(server, parentId = null, parentAuthorId = null) { // NEW parentAuthorId parameter
  const created = server.createdAt;
  return {
    id: server.commentId,
    text: server.content ?? '',
    username: server.nickname ?? '익명',
    date: created ? String(created).replace('T', ' ').slice(0, 16) : '',
    avatar:
        'https://api.builder.io/api/v1/image/assets/TEMP/61a4dd55df3c773db2ad493c4d652e8db101828c?width=110',
    isReply: parentId !== null,
    parentId,
    isPrivate: !!server.isPrivate,
    parentAuthorId: parentAuthorId, // NEW
    _raw: server,
  };
}

// 트리 평탄화 (부모 다음에 자식들 순서)
function flattenComments(list, parentId = null, acc = [], currentLevelParentAuthorId = null) { // NEW currentLevelParentAuthorId parameter
  if (!Array.isArray(list)) return acc;
  for (const node of list) {
    const ui = adaptOne(node, parentId, currentLevelParentAuthorId); // Pass currentLevelParentAuthorId
    acc.push(ui);
    if (Array.isArray(node.children) && node.children.length) {
      // When recursing, the current node's author becomes the parentAuthorId for its children
      flattenComments(node.children, ui.id, acc, ui._raw?.userId);
    }
  }
  return acc;
}

// 공통 401 처리
const handleAuthError = (e) => {
  const status = e?.response?.status;
  if (status === 401) {
    alert('로그인이 필요합니다.');
    router.push({ name: 'Login', query: { redirect: router.currentRoute.value.fullPath }});
    return true;
  }
  return false;
};

// 목록 로드
const loadComments = async () => {
  loading.value = true;
  error.value = null;
  try {
    const { data } = await listComments(Number(props.projectId));
    // 백은 List<CommentResponseDto> 반환
    const arr = Array.isArray(data) ? data : (Array.isArray(data?.content) ? data.content : []);
    comments.value = flattenComments(arr);
  } catch (e) {
    console.error(e);
    error.value = e;
  } finally {
    loading.value = false;
  }
};

// 최초 및 projectId 변경 시 로드
onMounted(loadComments);
watch(() => props.projectId, () => loadComments());

// 댓글 등록
const submitComment = async () => {
  const content = newComment.value?.trim();
  if (!content || submitting.value) return;
  submitting.value = true;
  try {
    await createComment(Number(props.projectId), {
      content,
      isPrivate: isPrivate.value,
      parentId: null,
    });
    newComment.value = '';
    isPrivate.value = false; // 등록 후 초기화
    await loadComments();
  } catch (e) {
    console.error(e);
    if (!handleAuthError(e)) alert('댓글 등록에 실패했습니다.');
  } finally {
    submitting.value = false;
  }
};

// 답글 UI 열기/닫기
const handleReplyTo = (commentId) => {
  activeReplyCommentId.value = commentId;
  newReplyText.value = '';
};
const cancelReply = () => {
  activeReplyCommentId.value = null;
  newReplyText.value = '';
};

// 답글 등록
const submitReply = async () => {
  const content = newReplyText.value?.trim();
  const parentId = activeReplyCommentId.value;
  if (!content || !parentId || submitting.value) return;
  submitting.value = true;
  try {
    await createComment(Number(props.projectId), {
      content,
      isPrivate: isReplyPrivate.value, // Changed from false
      parentId,
    });
    newReplyText.value = '';
    activeReplyCommentId.value = null;
    isReplyPrivate.value = false; // Reset after submission // NEW
    await loadComments();
  } catch (e) {
    console.error(e);
    if (!handleAuthError(e)) alert('답글 등록에 실패했습니다.');
  } finally {
    submitting.value = false;
  }
};

// 댓글 수정
const handleEditComment = async (commentId, nextText) => {
  const content = (nextText ?? '').trim();
  if (!content || submitting.value) return;
  submitting.value = true;
  try {
    await updateComment(Number(props.projectId), Number(commentId), { content });
    await loadComments();
  } catch (e) {
    console.error(e);
    if (!handleAuthError(e)) alert('댓글 수정에 실패했습니다.');
  } finally {
    submitting.value = false;
  }
};

// 댓글 삭제
const handleDeleteComment = async (commentId) => {
  if (!confirm('이 댓글을 삭제할까요?')) return;
  if (submitting.value) return;
  submitting.value = true;
  try {
    await deleteComment(Number(props.projectId), Number(commentId));
    await loadComments();
  } catch (e) {
    console.error(e);
    if (!handleAuthError(e)) alert('댓글 삭제에 실패했습니다.');
  } finally {
    submitting.value = false;
  }
};
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
  cursor: pointer;
  transition: background-color 0.2s;
}

.lock-icon.active {
  background: #e0e0e0;
}

.lock-icon.active svg path {
  fill: #3b82f6;
}

.submit-button {
  display: flex;
  width: 140px;
  height: 40px;
  padding: 1px 6px;
  justify-content: center;
  align-items: center;
  border-radius: 3px;
  background: #4CAF50;
  color: #FFF;
  text-align: center;
  font-size: 12px;
  font-weight: 400;
  line-height: 15px;
  border: none;
  cursor: pointer;
}

.submit-button:hover {
  background: #3b883d;
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


<style scoped>
/* ... 기존 스타일 ... */

.reply-form-outer {
  margin-left: 30px;
  padding: 15px;
  background-color: #f9f9f9;
  border-top: 1px solid #eee;
  border-bottom: 1px solid #eee;
}

.reply-textarea {
  width: 100%;
  min-height: 60px;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  resize: vertical;
  margin-bottom: 10px;
}

.reply-form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.submit-reply-button,
.cancel-reply-button {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
}

.submit-reply-button {
  background-color: #3b82f6;
  color: white;
}

.submit-reply-button:disabled {
  background-color: #a5b4fc;
  cursor: not-allowed;
}

.cancel-reply-button {
  background-color: #e5e7eb;
  color: #374151;
}
</style>