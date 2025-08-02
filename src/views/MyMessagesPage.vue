<template>
  <div class="messages-page">
    <div class="container">
      <div class="messages-layout">
        <!-- 좌측: 채팅 목록 -->
        <div class="chat-list-panel">
          
          <div class="chat-filter">
            <button 
              :class="['filter-btn', { 'active': activeFilter === 'all' }]"
              @click="setFilter('all')"
            >
              전체 ({{ chatList.length }})
            </button>
            <button 
              :class="['filter-btn', { 'active': activeFilter === 'unread' }]"
              @click="setFilter('unread')"
            >
              읽지 않음 ({{ unreadCount }})
            </button>
          </div>
          
          <div class="chat-list">
            <div 
              v-for="chat in filteredChats" 
              :key="chat.id"
              :class="['chat-item', { 
                'active': selectedChatId === chat.id,
                'unread': !chat.isRead 
              }]"
              @click="selectChat(chat.id)"
            >
              <div class="chat-avatar">
                <img :src="chat.avatar" :alt="chat.name" />
                <div v-if="chat.isOnline" class="online-status"></div>
              </div>
              <div class="chat-preview">
                <div class="chat-header">
                  <span class="chat-name">{{ chat.name }}</span>
                  <span class="chat-time">{{ formatTime(chat.lastMessageTime) }}</span>
                </div>
                <p class="last-message">{{ chat.lastMessage }}</p>
                <div v-if="chat.unreadCount > 0" class="unread-badge">{{ chat.unreadCount }}</div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 우측: 채팅 상세 -->
        <div class="chat-detail-panel">
          <div v-if="selectedChat" class="chat-detail">
            <!-- 채팅 헤더 -->
            <div class="chat-detail-header">
              <div class="chat-user-info">
                <img :src="selectedChat.avatar" :alt="selectedChat.name" class="user-avatar" />
                <div class="user-details">
                  <h3 class="user-name">{{ selectedChat.name }}</h3>
                  <p class="user-status">
                    <span :class="['status-dot', { 'online': selectedChat.isOnline }]"></span>
                    {{ selectedChat.isOnline ? '온라인' : '오프라인' }}
                  </p>
                </div>
              </div>
              <div class="chat-actions">
                <button class="action-btn" @click="viewProfile(selectedChat.userId)">
                  <span class="btn-icon">👤</span>
                  프로필 보기
                </button>
                <button class="action-btn" @click="blockUser(selectedChat.userId)">
                  <span class="btn-icon">🚫</span>
                  차단
                </button>
              </div>
            </div>
            
            <!-- 메시지 영역 -->
            <div class="messages-container" ref="messagesContainer">
              <div class="messages-list">
                <div 
                  v-for="message in selectedChat.messages" 
                  :key="message.id"
                  :class="['message-item', { 'own': message.isOwn }]"
                >
                  <div class="message-content">
                    <div class="message-bubble">
                      <p class="message-text">{{ message.content }}</p>
                      <span class="message-time">{{ formatMessageTime(message.timestamp) }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- 메시지 입력 -->
            <div class="message-input-area">
              <div class="input-container">
                <textarea
                  v-model="newMessage"
                  placeholder="메시지를 입력하세요..."
                  class="message-input"
                  rows="1"
                  @keydown.enter.prevent="sendMessage"
                  @input="adjustTextareaHeight"
                  ref="messageTextarea"
                ></textarea>
                <button 
                  class="send-button"
                  @click="sendMessage"
                  :disabled="!newMessage.trim()"
                >
                  <span class="send-icon">📤</span>
                </button>
              </div>
            </div>
          </div>
          
          <!-- 채팅 선택되지 않았을 때 -->
          <div v-else class="no-chat-selected">
            <div class="empty-state">
              <span class="empty-icon">💬</span>
              <h3>메시지를 선택하세요</h3>
              <p>왼쪽에서 대화를 선택하면 메시지를 볼 수 있습니다</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// 반응형 데이터
const searchQuery = ref('')
const activeFilter = ref('all')
const selectedChatId = ref(null)
const newMessage = ref('')
const messagesContainer = ref(null)
const messageTextarea = ref(null)

// 샘플 채팅 데이터 (김개발자가 다른 사람들과 대화)
const chatList = ref([
  {
    id: 1,
    userId: 2, // 박디자이너
    name: '박디자이너',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=2',
    isOnline: true,
    lastMessage: 'UI 디자인 검토 부탁드려요!',
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 15), // 15분 전
    isRead: false,
    unreadCount: 2,
    messages: [
      {
        id: 1,
        content: '안녕하세요! 프로젝트 협업 제안드리고 싶어서 연락했습니다.',
        timestamp: new Date(Date.now() - 1000 * 60 * 60),
        isOwn: false
      },
      {
        id: 2,
        content: '안녕하세요! 어떤 프로젝트인지 궁금합니다.',
        timestamp: new Date(Date.now() - 1000 * 60 * 50),
        isOwn: true
      },
      {
        id: 3,
        content: 'E-commerce 플랫폼 프로젝트인데, UI/UX 디자인 부분에서 협업하고 싶어요.',
        timestamp: new Date(Date.now() - 1000 * 60 * 30),
        isOwn: false
      },
      {
        id: 4,
        content: 'UI 디자인 검토 부탁드려요!',
        timestamp: new Date(Date.now() - 1000 * 60 * 15),
        isOwn: false
      }
    ]
  },
  {
    id: 2,
    userId: 3, // 이백엔드
    name: '이백엔드',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=3',
    isOnline: false,
    lastMessage: 'API 연동 관련해서 질문이 있어요',
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2시간 전
    isRead: false,
    unreadCount: 1,
    messages: [
      {
        id: 1,
        content: '백엔드 개발자 이백엔드입니다. 프론트엔드 쪽 연동 작업 도움이 필요해서요.',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3),
        isOwn: false
      },
      {
        id: 2,
        content: 'API 연동 관련해서 질문이 있어요',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
        isOwn: false
      }
    ]
  },
  {
    id: 3,
    userId: 5, // 최AI
    name: '최AI',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=5',
    isOnline: true,
    lastMessage: '네, 좋은 아이디어네요! 진행해봅시다.',
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1일 전
    isRead: true,
    unreadCount: 0,
    messages: [
      {
        id: 1,
        content: 'AI 관련 프로젝트에 관심이 있으시다고 들었어요.',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 25),
        isOwn: false
      },
      {
        id: 2,
        content: '네! 머신러닝 모델을 웹에 적용하는 프로젝트를 생각하고 있어요.',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24.5),
        isOwn: true
      },
      {
        id: 3,
        content: '네, 좋은 아이디어네요! 진행해봅시다.',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
        isOwn: false
      }
    ]
  },
  {
    id: 4,
    userId: 6, // 강데브옵스
    name: '강데브옵스',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=6',
    isOnline: true,
    lastMessage: '배포 환경 설정 완료했습니다!',
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 48), // 2일 전
    isRead: true,
    unreadCount: 0,
    messages: [
      {
        id: 1,
        content: 'DevOps 관련해서 도움이 필요하시다고 하셔서 연락드렸어요.',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 50),
        isOwn: false
      },
      {
        id: 2,
        content: '감사합니다! AWS 배포 관련해서 조언을 구하고 싶어요.',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 49),
        isOwn: true
      },
      {
        id: 3,
        content: '배포 환경 설정 완료했습니다!',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48),
        isOwn: false
      }
    ]
  }
])

// 계산된 속성
const unreadCount = computed(() => {
  return chatList.value.filter(chat => !chat.isRead).length
})

const filteredChats = computed(() => {
  let filtered = chatList.value

  // 검색 필터
  if (searchQuery.value) {
    filtered = filtered.filter(chat => 
      chat.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      chat.lastMessage.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  }

  // 읽음/안읽음 필터
  if (activeFilter.value === 'unread') {
    filtered = filtered.filter(chat => !chat.isRead)
  }

  return filtered.sort((a, b) => b.lastMessageTime - a.lastMessageTime)
})

const selectedChat = computed(() => {
  return chatList.value.find(chat => chat.id === selectedChatId.value)
})

// 메서드
const setFilter = (filter) => {
  activeFilter.value = filter
}

const selectChat = (chatId) => {
  selectedChatId.value = chatId
  
  // 채팅을 읽음으로 표시
  const chat = chatList.value.find(c => c.id === chatId)
  if (chat) {
    chat.isRead = true
    chat.unreadCount = 0
  }
  
  // 메시지 스크롤을 하단으로
  nextTick(() => {
    scrollToBottom()
  })
}

const sendMessage = () => {
  if (!newMessage.value.trim() || !selectedChat.value) return

  const message = {
    id: Date.now(),
    content: newMessage.value.trim(),
    timestamp: new Date(),
    isOwn: true
  }

  selectedChat.value.messages.push(message)
  selectedChat.value.lastMessage = message.content
  selectedChat.value.lastMessageTime = message.timestamp

  newMessage.value = ''
  
  nextTick(() => {
    scrollToBottom()
    adjustTextareaHeight()
  })
}

const scrollToBottom = () => {
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
}

const adjustTextareaHeight = () => {
  if (messageTextarea.value) {
    messageTextarea.value.style.height = 'auto'
    messageTextarea.value.style.height = Math.min(messageTextarea.value.scrollHeight, 120) + 'px'
  }
}

const formatTime = (timestamp) => {
  const now = new Date()
  const diff = now - timestamp
  const minutes = Math.floor(diff / (1000 * 60))
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))

  if (minutes < 1) return '방금 전'
  if (minutes < 60) return `${minutes}분 전`
  if (hours < 24) return `${hours}시간 전`
  if (days < 7) return `${days}일 전`
  
  return timestamp.toLocaleDateString('ko-KR', { 
    month: 'short', 
    day: 'numeric' 
  })
}

const formatMessageTime = (timestamp) => {
  const now = new Date()
  const isToday = timestamp.toDateString() === now.toDateString()
  
  if (isToday) {
    return timestamp.toLocaleTimeString('ko-KR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  } else {
    return timestamp.toLocaleDateString('ko-KR', { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit', 
      minute: '2-digit' 
    })
  }
}

const viewProfile = (userId) => {
  router.push(`/portfolio/${userId}`)
}

const blockUser = (userId) => {
  console.log('사용자 차단:', userId)
  // 실제로는 차단 API 호출
}

onMounted(() => {
  // 첫 번째 채팅 자동 선택
  if (chatList.value.length > 0) {
    selectChat(chatList.value[0].id)
  }
})
</script>

<style scoped>
.messages-page {
  padding: 20px;
  background: #f8f9fa;
  min-height: calc(100vh - 68px);
}

.container {
  max-width: 1400px;
  margin: 0 auto;
}

.messages-layout {
  display: grid;
  grid-template-columns: 400px 1fr;
  gap: 20px;
  height: calc(100vh - 128px);
}

/* 좌측 채팅 목록 패널 */
.chat-list-panel {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.panel-header {
  padding: 20px;
  border-bottom: 1px solid #f0f0f0;
  background: #f8f9fa;
}

.panel-title {
  font-size: 24px;
  font-weight: 700;
  color: #333;
  margin: 0 0 16px 0;
}

.search-box {
  position: relative;
}

.search-input {
  width: 100%;
  padding: 10px 40px 10px 12px;
  border: 2px solid #e9ecef;
  border-radius: 20px;
  font-size: 14px;
  outline: none;
  transition: border-color 0.3s ease;
  box-sizing: border-box;
}

.search-input:focus {
  border-color: #4CAF50;
}

.search-icon {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #666;
  font-size: 14px;
}

.chat-filter {
  display: flex;
  padding: 12px 20px;
  gap: 8px;
  border-bottom: 1px solid #f0f0f0;
}

.filter-btn {
  padding: 6px 12px;
  border: 1px solid #e9ecef;
  border-radius: 16px;
  background: white;
  color: #666;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.filter-btn:hover {
  background: #f8f9fa;
}

.filter-btn.active {
  background: #4CAF50;
  color: white;
  border-color: #4CAF50;
}

.chat-list {
  flex: 1;
  overflow-y: auto;
}

.chat-item {
  display: flex;
  padding: 16px 20px;
  gap: 12px;
  cursor: pointer;
  transition: background 0.2s ease;
  border-bottom: 1px solid #f5f5f5;
  position: relative;
}

.chat-item:hover {
  background: #f8f9fa;
}

.chat-item.active {
  background: rgba(76, 175, 80, 0.1);
  border-left: 4px solid #4CAF50;
}

.chat-item.unread {
  background: rgba(76, 175, 80, 0.05);
}

.chat-avatar {
  position: relative;
  flex-shrink: 0;
}

.chat-avatar img {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
}

.online-status {
  position: absolute;
  bottom: 2px;
  right: 2px;
  width: 12px;
  height: 12px;
  background: #4CAF50;
  border: 2px solid white;
  border-radius: 50%;
}

.chat-preview {
  flex: 1;
  min-width: 0;
  position: relative;
}

.chat-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
}

.chat-name {
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.chat-time {
  font-size: 12px;
  color: #888;
}

.last-message {
  font-size: 14px;
  color: #666;
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.unread-badge {
  position: absolute;
  top: 0;
  right: 0;
  background: #4CAF50;
  color: white;
  border-radius: 10px;
  padding: 2px 6px;
  font-size: 11px;
  font-weight: 600;
  min-width: 18px;
  height: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 우측 채팅 상세 패널 */
.chat-detail-panel {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.chat-detail {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.chat-detail-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #f0f0f0;
  background: #f8f9fa;
}

.chat-user-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.user-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
}

.user-name {
  font-size: 18px;
  font-weight: 700;
  color: #333;
  margin: 0 0 4px 0;
}

.user-status {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  color: #666;
  margin: 0;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #ccc;
}

.status-dot.online {
  background: #4CAF50;
}

.chat-actions {
  display: flex;
  gap: 8px;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  border: 1px solid #e9ecef;
  border-radius: 6px;
  background: white;
  color: #666;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.action-btn:hover {
  background: #f8f9fa;
  border-color: #dee2e6;
}

.btn-icon {
  font-size: 14px;
}

.messages-container {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  background: #fafafa;
}

.messages-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.message-item {
  display: flex;
}

.message-item.own {
  justify-content: flex-end;
}

.message-content {
  max-width: 70%;
}

.message-bubble {
  padding: 12px 16px;
  border-radius: 18px;
  position: relative;
  word-wrap: break-word;
}

.message-item:not(.own) .message-bubble {
  background: white;
  border-bottom-left-radius: 6px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.message-item.own .message-bubble {
  background: #4CAF50;
  color: white;
  border-bottom-right-radius: 6px;
}

.message-text {
  margin: 0 0 4px 0;
  line-height: 1.4;
  font-size: 14px;
}

.message-time {
  font-size: 11px;
  opacity: 0.7;
}

.message-input-area {
  padding: 20px;
  border-top: 1px solid #f0f0f0;
  background: white;
}

.input-container {
  display: flex;
  align-items: flex-end;
  gap: 12px;
  background: #f8f9fa;
  border-radius: 20px;
  padding: 8px;
}

.message-input {
  flex: 1;
  border: none;
  outline: none;
  background: transparent;
  padding: 8px 12px;
  font-size: 14px;
  resize: none;
  font-family: inherit;
  line-height: 1.4;
  min-height: 20px;
  max-height: 120px;
}

.send-button {
  background: #4CAF50;
  border: none;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  flex-shrink: 0;
}

.send-button:hover:not(:disabled) {
  background: #66BB6A;
  transform: scale(1.05);
}

.send-button:disabled {
  background: #ccc;
  cursor: not-allowed;
  transform: none;
}

.send-icon {
  font-size: 16px;
  color: white;
}

.no-chat-selected {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}

.empty-state {
  text-align: center;
  color: #666;
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 16px;
  display: block;
  opacity: 0.5;
}

.empty-state h3 {
  font-size: 20px;
  margin: 0 0 8px 0;
  color: #333;
}

.empty-state p {
  font-size: 14px;
  margin: 0;
  line-height: 1.5;
}

/* 반응형 디자인 */
@media (max-width: 1024px) {
  .messages-layout {
    grid-template-columns: 350px 1fr;
  }
}

@media (max-width: 768px) {
  .messages-page {
    padding: 10px;
  }

  .messages-layout {
    grid-template-columns: 1fr;
    height: calc(100vh - 108px);
  }

  .chat-list-panel {
    max-height: 300px;
  }

  .chat-actions {
    flex-direction: column;
    gap: 4px;
  }

  .action-btn {
    padding: 6px 8px;
    font-size: 12px;
  }

  .message-content {
    max-width: 85%;
  }
}

@media (max-width: 480px) {
  .panel-header {
    padding: 16px;
  }

  .chat-item {
    padding: 12px 16px;
  }

  .chat-detail-header {
    padding: 16px;
    flex-direction: column;
    gap: 12px;
    align-items: flex-start;
  }

  .messages-container {
    padding: 16px;
  }

  .message-input-area {
    padding: 16px;
  }
}
</style>