<template>
  <DashboardLayout>
    <div class="messages-dashboard">
      <!-- Messages Layout -->
      <div class="messages-layout">
        <!-- Conversations Sidebar -->
        <div :class="['conversations-sidebar', { 'open': sidebarOpen }]">
          <div class="sidebar-header">
            <h2 class="sidebar-title">메시지</h2>
            <button @click="startNewConversation" class="new-message-btn">
              <i class="bi bi-plus-circle"></i>
            </button>
          </div>

          <div class="search-conversations">
            <div class="search-box">
              <i class="bi bi-search"></i>
              <input 
                type="text" 
                v-model="searchQuery" 
                placeholder="대화 검색..."
                @input="filterConversations"
              />
            </div>
          </div>

          <div class="conversations-filter">
            <button 
              v-for="filter in conversationFilters" 
              :key="filter.key"
              @click="setActiveFilter(filter.key)"
              :class="['filter-btn', { active: activeFilter === filter.key }]"
            >
              {{ filter.label }}
              <span v-if="filter.count > 0" class="filter-count">{{ filter.count }}</span>
            </button>
          </div>

          <div class="conversations-list">
            <div 
              v-for="conversation in filteredConversations" 
              :key="conversation.id"
              @click="selectConversation(conversation)"
              :class="['conversation-item', { 
                active: selectedConversation?.id === conversation.id,
                unread: conversation.unreadCount > 0
              }]"
            >
              <div class="conversation-avatar">
                <img :src="conversation.participant.avatar" :alt="conversation.participant.name" />
                <div :class="['status-indicator', conversation.participant.status]"></div>
              </div>
              <div class="conversation-content">
                <div class="conversation-header">
                  <h3 class="participant-name">{{ conversation.participant.name }}</h3>
                  <span class="last-message-time">{{ formatTime(conversation.lastMessage.timestamp) }}</span>
                </div>
                <div class="conversation-preview">
                  <p class="last-message">{{ getLastMessagePreview(conversation.lastMessage) }}</p>
                  <div class="conversation-meta">
                    <span v-if="conversation.project" class="project-tag">{{ conversation.project }}</span>
                    <span v-if="conversation.unreadCount > 0" class="unread-badge">{{ conversation.unreadCount }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Main Chat Area -->
        <div class="chat-area">
          <div v-if="!selectedConversation" class="no-conversation">
            <div class="no-conversation-content">
              <div class="no-conversation-icon">
                <i class="bi bi-chat-dots"></i>
              </div>
              <h3>대화를 선택하세요</h3>
              <p>왼쪽에서 대화를 선택하거나 새로운 대화를 시작하세요.</p>
              <button @click="startNewConversation" class="btn-primary">
                <i class="bi bi-plus-circle"></i>
                새 대화 시작
              </button>
            </div>
          </div>

          <div v-else class="active-chat">
            <!-- Chat Header -->
            <div class="chat-header">
              <button @click="toggleSidebar" class="sidebar-toggle mobile-only">
                <i class="bi bi-list"></i>
              </button>
              <div class="chat-participant">
                <img :src="selectedConversation.participant.avatar" :alt="selectedConversation.participant.name" class="participant-avatar" />
                <div class="participant-info">
                  <h3 class="participant-name">{{ selectedConversation.participant.name }}</h3>
                  <span :class="['participant-status', selectedConversation.participant.status]">
                    {{ getStatusText(selectedConversation.participant.status) }}
                  </span>
                </div>
              </div>
              <div class="chat-actions">
                <button @click="makeVideoCall" class="action-btn" title="화상 통화">
                  <i class="bi bi-camera-video"></i>
                </button>
                <button @click="makeVoiceCall" class="action-btn" title="음성 통화">
                  <i class="bi bi-telephone"></i>
                </button>
                <button @click="showConversationInfo" class="action-btn" title="대화 정보">
                  <i class="bi bi-info-circle"></i>
                </button>
              </div>
            </div>

            <!-- Messages Area -->
            <div class="messages-container" ref="messagesContainer">
              <div class="messages-list">
                <div 
                  v-for="message in selectedConversation.messages" 
                  :key="message.id"
                  :class="['message', { 'own': message.senderId === currentUserId, 'system': message.type === 'system' }]"
                >
                  <div v-if="message.type === 'system'" class="system-message">
                    <span class="system-text">{{ message.text }}</span>
                    <span class="system-time">{{ formatMessageTime(message.timestamp) }}</span>
                  </div>
                  
                  <div v-else class="message-content">
                    <div v-if="message.senderId !== currentUserId" class="message-avatar">
                      <img :src="selectedConversation.participant.avatar" :alt="selectedConversation.participant.name" />
                    </div>
                    <div class="message-bubble">
                      <div v-if="message.type === 'text'" class="text-message">
                        {{ message.text }}
                      </div>
                      <div v-else-if="message.type === 'file'" class="file-message">
                        <div class="file-info">
                          <i :class="getFileIcon(message.file.type)"></i>
                          <div class="file-details">
                            <span class="file-name">{{ message.file.name }}</span>
                            <span class="file-size">{{ formatFileSize(message.file.size) }}</span>
                          </div>
                        </div>
                        <button @click="downloadFile(message.file)" class="download-btn">
                          <i class="bi bi-download"></i>
                        </button>
                      </div>
                      <div v-else-if="message.type === 'image'" class="image-message">
                        <img :src="message.image.url" :alt="message.image.name" @click="viewImage(message.image)" />
                      </div>
                      <div class="message-meta">
                        <span class="message-time">{{ formatMessageTime(message.timestamp) }}</span>
                        <span v-if="message.senderId === currentUserId" :class="['message-status', message.status]">
                          <i v-if="message.status === 'sent'" class="bi bi-check"></i>
                          <i v-else-if="message.status === 'delivered'" class="bi bi-check-all"></i>
                          <i v-else-if="message.status === 'read'" class="bi bi-check-all text-primary"></i>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Typing Indicator -->
              <div v-if="isTyping" class="typing-indicator">
                <div class="typing-avatar">
                  <img :src="selectedConversation.participant.avatar" :alt="selectedConversation.participant.name" />
                </div>
                <div class="typing-bubble">
                  <div class="typing-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Message Input -->
            <div class="message-input-area">
              <div class="input-actions">
                <button @click="toggleEmojiPicker" class="input-action-btn" title="이모지">
                  <i class="bi bi-emoji-smile"></i>
                </button>
                <button @click="attachFile" class="input-action-btn" title="파일 첨부">
                  <i class="bi bi-paperclip"></i>
                </button>
                <input 
                  type="file" 
                  ref="fileInput" 
                  @change="handleFileSelect" 
                  accept="image/*,.pdf,.doc,.docx,.txt"
                  style="display: none;" 
                  multiple
                />
              </div>
              
              <div class="message-input-container">
                <textarea
                  ref="messageInput"
                  v-model="newMessage"
                  @keydown.enter.exact.prevent="sendMessage"
                  @keydown.enter.shift.exact="newLine"
                  @input="handleTyping"
                  placeholder="메시지를 입력하세요... (Enter: 전송, Shift+Enter: 줄바꿈)"
                  class="message-input"
                  rows="1"
                ></textarea>
                
                <button 
                  @click="sendMessage" 
                  :disabled="!newMessage.trim() && attachedFiles.length === 0"
                  class="send-btn"
                  title="전송 (Enter)"
                >
                  <i class="bi bi-send-fill"></i>
                </button>
              </div>

              <!-- Attached Files Preview -->
              <div v-if="attachedFiles.length > 0" class="attached-files">
                <div v-for="(file, index) in attachedFiles" :key="index" class="attached-file">
                  <div class="file-preview">
                    <i :class="getFileIcon(file.type)"></i>
                    <span class="file-name">{{ file.name }}</span>
                  </div>
                  <button @click="removeAttachedFile(index)" class="remove-file-btn">
                    <i class="bi bi-x"></i>
                  </button>
                </div>
              </div>

              <!-- Emoji Picker -->
              <div v-if="showEmojiPicker" class="emoji-picker">
                <div class="emoji-grid">
                  <button 
                    v-for="emoji in commonEmojis" 
                    :key="emoji"
                    @click="insertEmoji(emoji)"
                    class="emoji-btn"
                  >
                    {{ emoji }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Conversation Info Modal -->
      <div v-if="showConversationInfoModal" class="modal-overlay" @click="closeConversationInfo">
        <div class="modal-content" @click.stop>
          <div class="modal-header">
            <h3>대화 정보</h3>
            <button @click="closeConversationInfo" class="modal-close">
              <i class="bi bi-x"></i>
            </button>
          </div>
          <div class="modal-body">
            <div class="participant-details">
              <img :src="selectedConversation.participant.avatar" :alt="selectedConversation.participant.name" class="large-avatar" />
              <h4>{{ selectedConversation.participant.name }}</h4>
              <p>{{ selectedConversation.participant.email }}</p>
              <span :class="['status-badge', selectedConversation.participant.status]">
                {{ getStatusText(selectedConversation.participant.status) }}
              </span>
            </div>
            <div class="conversation-stats">
              <div class="stat-item">
                <span class="stat-label">프로젝트</span>
                <span class="stat-value">{{ selectedConversation.project || '없음' }}</span>
              </div>
              <div class="stat-item">
                <span class="stat-label">시작일</span>
                <span class="stat-value">{{ formatDate(selectedConversation.createdAt) }}</span>
              </div>
              <div class="stat-item">
                <span class="stat-label">메시지 수</span>
                <span class="stat-value">{{ selectedConversation.messages.length }}</span>
              </div>
            </div>
            <div class="conversation-actions">
              <button @click="archiveConversation" class="btn-secondary">
                <i class="bi bi-archive"></i>
                대화 보관
              </button>
              <button @click="blockUser" class="btn-danger">
                <i class="bi bi-person-x"></i>
                사용자 차단
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </DashboardLayout>
</template>

<script>
import { ref, computed, onMounted, nextTick, watch } from 'vue'
import DashboardLayout from '@/components/dashboard/DashboardLayout.vue'

export default {
  name: 'DashboardMessages',
  components: {
    DashboardLayout
  },
  setup() {
    // State
    const sidebarOpen = ref(false)
    const searchQuery = ref('')
    const activeFilter = ref('all')
    const selectedConversation = ref(null)
    const newMessage = ref('')
    const attachedFiles = ref([])
    const showEmojiPicker = ref(false)
    const showConversationInfoModal = ref(false)
    const isTyping = ref(false)
    const typingTimeout = ref(null)
    const currentUserId = ref(1) // Current user ID

    // Refs
    const messagesContainer = ref(null)
    const messageInput = ref(null)
    const fileInput = ref(null)

    // Sample conversations data
    const conversations = ref([
      {
        id: 1,
        participant: {
          id: 2,
          name: '김클라이언트',
          email: 'client@example.com',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=김클라이언트',
          status: 'online'
        },
        project: 'E-커머스 플랫폼',
        lastMessage: {
          id: 5,
          text: '네, 알겠습니다. 내일까지 수정해서 보내드리겠습니다.',
          timestamp: new Date(Date.now() - 1000 * 60 * 30),
          senderId: 1,
          type: 'text',
          status: 'read'
        },
        unreadCount: 0,
        createdAt: new Date('2024-01-15'),
        messages: [
          {
            id: 1,
            text: '안녕하세요! E-커머스 프로젝트 관련해서 문의드립니다.',
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
            senderId: 2,
            type: 'text',
            status: 'read'
          },
          {
            id: 2,
            text: '안녕하세요! 네, 어떤 부분이 궁금하신지요?',
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2 + 1000 * 60 * 5),
            senderId: 1,
            type: 'text',
            status: 'read'
          },
          {
            id: 3,
            text: '결제 시스템 부분에서 몇 가지 수정사항이 있는데요...',
            timestamp: new Date(Date.now() - 1000 * 60 * 60),
            senderId: 2,
            type: 'text',
            status: 'read'
          },
          {
            id: 4,
            text: '참고 자료입니다.',
            timestamp: new Date(Date.now() - 1000 * 60 * 50),
            senderId: 2,
            type: 'file',
            file: {
              name: '결제시스템_수정사항.pdf',
              size: 1024 * 1024 * 2,
              type: 'application/pdf',
              url: '#'
            },
            status: 'read'
          },
          {
            id: 5,
            text: '네, 알겠습니다. 내일까지 수정해서 보내드리겠습니다.',
            timestamp: new Date(Date.now() - 1000 * 60 * 30),
            senderId: 1,
            type: 'text',
            status: 'read'
          }
        ]
      },
      {
        id: 2,
        participant: {
          id: 3,
          name: '이디자이너',
          email: 'designer@example.com',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=이디자이너',
          status: 'away'
        },
        project: '모바일 앱 디자인',
        lastMessage: {
          id: 3,
          text: '시안 확인해보시고 피드백 주세요!',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3),
          senderId: 3,
          type: 'text',
          status: 'delivered'
        },
        unreadCount: 2,
        createdAt: new Date('2024-02-01'),
        messages: [
          {
            id: 1,
            text: '안녕하세요! 모바일 앱 디자인 작업 시작하겠습니다.',
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4),
            senderId: 3,
            type: 'text',
            status: 'read'
          },
          {
            id: 2,
            text: '첫 번째 시안입니다.',
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3.5),
            senderId: 3,
            type: 'image',
            image: {
              name: 'app_design_v1.png',
              url: 'https://picsum.photos/400/600',
              size: 1024 * 500
            },
            status: 'delivered'
          },
          {
            id: 3,
            text: '시안 확인해보시고 피드백 주세요!',
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3),
            senderId: 3,
            type: 'text',
            status: 'delivered'
          }
        ]
      }
    ])

    // Common emojis
    const commonEmojis = ref([
      '😊', '😍', '👍', '👌', '👏', '💪', '🎉', '🔥',
      '❤️', '💯', '🚀', '✨', '💡', '📝', '✅', '❌'
    ])

    // Conversation filters
    const conversationFilters = computed(() => [
      { key: 'all', label: '전체', count: conversations.value.length },
      { key: 'unread', label: '읽지 않음', count: conversations.value.filter(c => c.unreadCount > 0).length },
      { key: 'online', label: '온라인', count: conversations.value.filter(c => c.participant.status === 'online').length }
    ])

    // Filtered conversations
    const filteredConversations = computed(() => {
      let filtered = conversations.value

      // Apply search filter
      if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase()
        filtered = filtered.filter(c => 
          c.participant.name.toLowerCase().includes(query) ||
          c.project?.toLowerCase().includes(query) ||
          c.lastMessage.text.toLowerCase().includes(query)
        )
      }

      // Apply status filter
      switch (activeFilter.value) {
        case 'unread':
          filtered = filtered.filter(c => c.unreadCount > 0)
          break
        case 'online':
          filtered = filtered.filter(c => c.participant.status === 'online')
          break
      }

      // Sort by last message time
      return filtered.sort((a, b) => new Date(b.lastMessage.timestamp) - new Date(a.lastMessage.timestamp))
    })

    // Methods
    const formatTime = (timestamp) => {
      const now = new Date()
      const diff = now - timestamp
      const minutes = Math.floor(diff / (1000 * 60))
      const hours = Math.floor(diff / (1000 * 60 * 60))
      const days = Math.floor(diff / (1000 * 60 * 60 * 24))

      if (minutes < 60) return `${minutes}분 전`
      if (hours < 24) return `${hours}시간 전`
      if (days === 1) return '어제'
      if (days < 7) return `${days}일 전`
      return new Intl.DateTimeFormat('ko-KR', { month: 'short', day: 'numeric' }).format(timestamp)
    }

    const formatMessageTime = (timestamp) => {
      return new Intl.DateTimeFormat('ko-KR', {
        hour: '2-digit',
        minute: '2-digit'
      }).format(timestamp)
    }

    const formatDate = (date) => {
      return new Intl.DateTimeFormat('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }).format(date)
    }

    const formatFileSize = (bytes) => {
      if (bytes === 0) return '0 Bytes'
      const k = 1024
      const sizes = ['Bytes', 'KB', 'MB', 'GB']
      const i = Math.floor(Math.log(bytes) / Math.log(k))
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
    }

    const getLastMessagePreview = (message) => {
      switch (message.type) {
        case 'text':
          return message.text
        case 'file':
          return '📎 파일'
        case 'image':
          return '🖼️ 이미지'
        default:
          return '메시지'
      }
    }

    const getStatusText = (status) => {
      const statusMap = {
        online: '온라인',
        away: '자리비움',
        offline: '오프라인'
      }
      return statusMap[status] || status
    }

    const getFileIcon = (fileType) => {
      if (fileType.includes('pdf')) return 'bi-file-earmark-pdf'
      if (fileType.includes('word')) return 'bi-file-earmark-word'
      if (fileType.includes('image')) return 'bi-file-earmark-image'
      return 'bi-file-earmark'
    }

    const toggleSidebar = () => {
      sidebarOpen.value = !sidebarOpen.value
    }

    const filterConversations = () => {
      // Filtering is handled by computed property
    }

    const setActiveFilter = (filter) => {
      activeFilter.value = filter
    }

    const selectConversation = (conversation) => {
      selectedConversation.value = conversation
      conversation.unreadCount = 0 // Mark as read
      sidebarOpen.value = false // Close sidebar on mobile
      
      nextTick(() => {
        scrollToBottom()
        messageInput.value?.focus()
      })
    }

    const scrollToBottom = () => {
      if (messagesContainer.value) {
        messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
      }
    }

    const sendMessage = async () => {
      if (!newMessage.value.trim() && attachedFiles.value.length === 0) return
      if (!selectedConversation.value) return

      const conversation = selectedConversation.value
      const messageId = Date.now()

      // Send text message
      if (newMessage.value.trim()) {
        const textMessage = {
          id: messageId,
          text: newMessage.value.trim(),
          timestamp: new Date(),
          senderId: currentUserId.value,
          type: 'text',
          status: 'sent'
        }
        
        conversation.messages.push(textMessage)
        conversation.lastMessage = textMessage
      }

      // Send file messages
      attachedFiles.value.forEach((file, index) => {
        const fileMessage = {
          id: messageId + index + 1,
          timestamp: new Date(),
          senderId: currentUserId.value,
          type: file.type.startsWith('image/') ? 'image' : 'file',
          status: 'sent'
        }

        if (file.type.startsWith('image/')) {
          fileMessage.image = {
            name: file.name,
            url: URL.createObjectURL(file),
            size: file.size
          }
        } else {
          fileMessage.file = {
            name: file.name,
            size: file.size,
            type: file.type,
            url: URL.createObjectURL(file)
          }
        }

        conversation.messages.push(fileMessage)
        conversation.lastMessage = fileMessage
      })

      // Clear input
      newMessage.value = ''
      attachedFiles.value = []
      
      // Scroll to bottom
      await nextTick()
      scrollToBottom()

      // Simulate message delivery
      setTimeout(() => {
        conversation.messages.forEach(msg => {
          if (msg.status === 'sent') {
            msg.status = 'delivered'
          }
        })
      }, 1000)
    }

    const handleTyping = () => {
      // Show typing indicator to other user (simulation)
      // In real app, this would send a typing event to the server
      
      clearTimeout(typingTimeout.value)
      typingTimeout.value = setTimeout(() => {
        // Stop typing indicator
      }, 1000)
    }

    const newLine = () => {
      newMessage.value += '\n'
    }

    const attachFile = () => {
      fileInput.value?.click()
    }

    const handleFileSelect = (event) => {
      const files = Array.from(event.target.files || [])
      attachedFiles.value.push(...files)
      event.target.value = '' // Reset input
    }

    const removeAttachedFile = (index) => {
      attachedFiles.value.splice(index, 1)
    }

    const toggleEmojiPicker = () => {
      showEmojiPicker.value = !showEmojiPicker.value
    }

    const insertEmoji = (emoji) => {
      newMessage.value += emoji
      showEmojiPicker.value = false
      messageInput.value?.focus()
    }

    const startNewConversation = () => {
      console.log('Starting new conversation...')
      // Implement new conversation logic
    }

    const makeVideoCall = () => {
      console.log('Starting video call...')
      // Implement video call logic
    }

    const makeVoiceCall = () => {
      console.log('Starting voice call...')
      // Implement voice call logic
    }

    const showConversationInfo = () => {
      showConversationInfoModal.value = true
    }

    const closeConversationInfo = () => {
      showConversationInfoModal.value = false
    }

    const downloadFile = (file) => {
      // Create download link
      const link = document.createElement('a')
      link.href = file.url
      link.download = file.name
      link.click()
    }

    const viewImage = (image) => {
      // Open image in modal or new tab
      window.open(image.url, '_blank')
    }

    const archiveConversation = () => {
      if (confirm('이 대화를 보관하시겠습니까?')) {
        console.log('Archiving conversation...')
        closeConversationInfo()
      }
    }

    const blockUser = () => {
      if (confirm('이 사용자를 차단하시겠습니까?')) {
        console.log('Blocking user...')
        closeConversationInfo()
      }
    }

    // Auto-scroll when new messages arrive
    watch(() => selectedConversation.value?.messages.length, () => {
      nextTick(() => {
        scrollToBottom()
      })
    })

    // Handle click outside to close emoji picker
    const handleClickOutside = (event) => {
      if (!event.target.closest('.emoji-picker') && !event.target.closest('.input-action-btn')) {
        showEmojiPicker.value = false
      }
    }

    onMounted(() => {
      document.addEventListener('click', handleClickOutside)
      
      // Auto-select first conversation if available
      if (conversations.value.length > 0) {
        selectConversation(conversations.value[0])
      }
    })

    return {
      sidebarOpen,
      searchQuery,
      activeFilter,
      selectedConversation,
      newMessage,
      attachedFiles,
      showEmojiPicker,
      showConversationInfoModal,
      isTyping,
      currentUserId,
      messagesContainer,
      messageInput,
      fileInput,
      conversations,
      conversationFilters,
      filteredConversations,
      commonEmojis,
      formatTime,
      formatMessageTime,
      formatDate,
      formatFileSize,
      getLastMessagePreview,
      getStatusText,
      getFileIcon,
      toggleSidebar,
      filterConversations,
      setActiveFilter,
      selectConversation,
      sendMessage,
      handleTyping,
      newLine,
      attachFile,
      handleFileSelect,
      removeAttachedFile,
      toggleEmojiPicker,
      insertEmoji,
      startNewConversation,
      makeVideoCall,
      makeVoiceCall,
      showConversationInfo,
      closeConversationInfo,
      downloadFile,
      viewImage,
      archiveConversation,
      blockUser
    }
  }
}
</script>

<style scoped>
.messages-dashboard {
  height: calc(100vh - 120px);
  max-width: 1400px;
  margin: 0 auto;
}

.messages-layout {
  display: flex;
  height: 100%;
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

/* Conversations Sidebar */
.conversations-sidebar {
  width: 320px;
  background: #f8f9fa;
  border-right: 1px solid #e9ecef;
  display: flex;
  flex-direction: column;
  transition: transform 0.3s ease;
}

.sidebar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #e9ecef;
}

.sidebar-title {
  font-size: 20px;
  font-weight: 600;
  margin: 0;
  color: #212529;
}

.new-message-btn {
  width: 36px;
  height: 36px;
  border: none;
  background: #FF7D12;
  color: white;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s ease;
}

.new-message-btn:hover {
  background: #FE7C25;
}

.search-conversations {
  padding: 16px 20px;
  border-bottom: 1px solid #e9ecef;
}

.search-box {
  position: relative;
}

.search-box i {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #6c757d;
}

.search-box input {
  width: 100%;
  padding: 10px 12px 10px 36px;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  font-size: 14px;
  background: white;
}

.search-box input:focus {
  outline: none;
  border-color: #FF7D12;
  box-shadow: 0 0 0 3px rgba(255, 125, 18, 0.1);
}

.conversations-filter {
  display: flex;
  padding: 16px 20px;
  gap: 8px;
  border-bottom: 1px solid #e9ecef;
}

.filter-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border: 1px solid transparent;
  background: transparent;
  border-radius: 6px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  color: #6c757d;
}

.filter-btn:hover {
  background: white;
  color: #212529;
}

.filter-btn.active {
  background: #FF7D12;
  color: white;
}

.filter-count {
  background: rgba(255, 255, 255, 0.2);
  padding: 2px 6px;
  border-radius: 10px;
  font-size: 11px;
  font-weight: 600;
  min-width: 16px;
  text-align: center;
}

.filter-btn:not(.active) .filter-count {
  background: #e9ecef;
  color: #6c757d;
}

.conversations-list {
  flex: 1;
  overflow-y: auto;
}

.conversation-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 16px 20px;
  cursor: pointer;
  transition: background 0.2s ease;
  border-bottom: 1px solid #f1f3f4;
}

.conversation-item:hover {
  background: white;
}

.conversation-item.active {
  background: white;
  border-right: 3px solid #FF7D12;
}

.conversation-item.unread {
  background: rgba(255, 125, 18, 0.05);
}

.conversation-avatar {
  position: relative;
  flex-shrink: 0;
}

.conversation-avatar img {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
}

.status-indicator {
  position: absolute;
  bottom: 2px;
  right: 2px;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: 2px solid white;
}

.status-indicator.online {
  background: #28a745;
}

.status-indicator.away {
  background: #ffc107;
}

.status-indicator.offline {
  background: #6c757d;
}

.conversation-content {
  flex: 1;
  min-width: 0;
}

.conversation-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
}

.participant-name {
  font-size: 14px;
  font-weight: 600;
  color: #212529;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  flex: 1;
}

.last-message-time {
  font-size: 12px;
  color: #6c757d;
  flex-shrink: 0;
}

.conversation-preview {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.last-message {
  font-size: 13px;
  color: #6c757d;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  flex: 1;
}

.conversation-item.unread .last-message {
  color: #212529;
  font-weight: 500;
}

.conversation-meta {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-shrink: 0;
}

.project-tag {
  font-size: 10px;
  padding: 2px 6px;
  background: #e9ecef;
  color: #6c757d;
  border-radius: 8px;
  font-weight: 500;
}

.unread-badge {
  background: #FF7D12;
  color: white;
  font-size: 11px;
  font-weight: 600;
  padding: 2px 6px;
  border-radius: 10px;
  min-width: 18px;
  text-align: center;
}

/* Chat Area */
.chat-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.no-conversation {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.no-conversation-content {
  text-align: center;
  max-width: 300px;
}

.no-conversation-icon {
  font-size: 64px;
  color: #e9ecef;
  margin-bottom: 16px;
}

.no-conversation-content h3 {
  font-size: 20px;
  font-weight: 600;
  color: #212529;
  margin: 0 0 8px 0;
}

.no-conversation-content p {
  font-size: 14px;
  color: #6c757d;
  margin: 0 0 24px 0;
}

.btn-primary {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  background: #FF7D12;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  text-decoration: none;
  cursor: pointer;
  transition: background 0.2s ease;
}

.btn-primary:hover {
  background: #FE7C25;
}

.active-chat {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.chat-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 20px;
  border-bottom: 1px solid #e9ecef;
  background: white;
}

.sidebar-toggle {
  display: none;
  width: 36px;
  height: 36px;
  border: none;
  background: #f8f9fa;
  border-radius: 6px;
  cursor: pointer;
}

.chat-participant {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
}

.participant-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
}

.participant-info h3 {
  font-size: 16px;
  font-weight: 600;
  color: #212529;
  margin: 0 0 2px 0;
}

.participant-status {
  font-size: 12px;
  padding: 2px 8px;
  border-radius: 8px;
  font-weight: 500;
}

.participant-status.online {
  background: rgba(40, 167, 69, 0.1);
  color: #28a745;
}

.participant-status.away {
  background: rgba(255, 193, 7, 0.1);
  color: #ffc107;
}

.participant-status.offline {
  background: rgba(108, 117, 125, 0.1);
  color: #6c757d;
}

.chat-actions {
  display: flex;
  gap: 8px;
}

.action-btn {
  width: 36px;
  height: 36px;
  border: none;
  background: #f8f9fa;
  color: #6c757d;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.action-btn:hover {
  background: #e9ecef;
  color: #212529;
}

.messages-container {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  background: #f8f9fa;
}

.messages-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.message {
  display: flex;
  align-items: flex-end;
  gap: 8px;
}

.message.own {
  flex-direction: row-reverse;
}

.message.system {
  justify-content: center;
}

.system-message {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 8px 16px;
  background: rgba(108, 117, 125, 0.1);
  border-radius: 16px;
  font-size: 12px;
  color: #6c757d;
}

.message-avatar img {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
}

.message-bubble {
  max-width: 70%;
  padding: 12px 16px;
  border-radius: 16px;
  position: relative;
}

.message:not(.own) .message-bubble {
  background: white;
  border-bottom-left-radius: 4px;
}

.message.own .message-bubble {
  background: #FF7D12;
  color: white;
  border-bottom-right-radius: 4px;
}

.text-message {
  font-size: 14px;
  line-height: 1.4;
  white-space: pre-wrap;
  word-wrap: break-word;
}

.file-message {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
}

.file-info {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
}

.file-info i {
  font-size: 20px;
}

.file-details {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.file-name {
  font-size: 14px;
  font-weight: 500;
}

.file-size {
  font-size: 12px;
  opacity: 0.8;
}

.download-btn {
  width: 32px;
  height: 32px;
  border: none;
  background: rgba(255, 255, 255, 0.2);
  color: inherit;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.2s ease;
}

.download-btn:hover {
  background: rgba(255, 255, 255, 0.3);
}

.image-message img {
  max-width: 200px;
  max-height: 200px;
  border-radius: 8px;
  cursor: pointer;
  transition: transform 0.2s ease;
}

.image-message img:hover {
  transform: scale(1.02);
}

.message-meta {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-top: 4px;
  font-size: 11px;
  opacity: 0.7;
}

.message-status i {
  font-size: 12px;
}

.message-status .text-primary {
  color: #007bff !important;
}

.typing-indicator {
  display: flex;
  align-items: flex-end;
  gap: 8px;
  margin-top: 8px;
}

.typing-avatar img {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
}

.typing-bubble {
  background: white;
  padding: 12px 16px;
  border-radius: 16px;
  border-bottom-left-radius: 4px;
}

.typing-dots {
  display: flex;
  gap: 4px;
  align-items: center;
}

.typing-dots span {
  width: 6px;
  height: 6px;
  background: #6c757d;
  border-radius: 50%;
  animation: typing 1.5s infinite;
}

.typing-dots span:nth-child(2) {
  animation-delay: 0.2s;
}

.typing-dots span:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes typing {
  0%, 60%, 100% {
    transform: translateY(0);
    opacity: 0.4;
  }
  30% {
    transform: translateY(-8px);
    opacity: 1;
  }
}

.message-input-area {
  background: white;
  border-top: 1px solid #e9ecef;
  padding: 16px 20px;
  position: relative;
}

.input-actions {
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
}

.input-action-btn {
  width: 36px;
  height: 36px;
  border: none;
  background: #f8f9fa;
  color: #6c757d;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.input-action-btn:hover {
  background: #e9ecef;
  color: #212529;
}

.message-input-container {
  display: flex;
  align-items: flex-end;
  gap: 12px;
  background: #f8f9fa;
  border-radius: 12px;
  padding: 8px;
}

.message-input {
  flex: 1;
  min-height: 36px;
  max-height: 120px;
  padding: 8px 12px;
  border: none;
  background: transparent;
  font-size: 14px;
  line-height: 1.4;
  resize: none;
  outline: none;
  font-family: inherit;
}

.send-btn {
  width: 36px;
  height: 36px;
  border: none;
  background: #FF7D12;
  color: white;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.send-btn:hover:not(:disabled) {
  background: #FE7C25;
}

.send-btn:disabled {
  background: #e9ecef;
  color: #6c757d;
  cursor: not-allowed;
}

.attached-files {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 12px;
}

.attached-file {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  font-size: 12px;
}

.file-preview {
  display: flex;
  align-items: center;
  gap: 6px;
}

.remove-file-btn {
  width: 20px;
  height: 20px;
  border: none;
  background: #e9ecef;
  color: #6c757d;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.remove-file-btn:hover {
  background: #dc3545;
  color: white;
}

.emoji-picker {
  position: absolute;
  bottom: 100%;
  left: 20px;
  background: white;
  border: 1px solid #e9ecef;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  z-index: 1000;
}

.emoji-grid {
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  gap: 8px;
}

.emoji-btn {
  width: 32px;
  height: 32px;
  border: none;
  background: none;
  font-size: 18px;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.2s ease;
}

.emoji-btn:hover {
  background: #f8f9fa;
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
}

.modal-content {
  background: white;
  border-radius: 12px;
  width: 90%;
  max-width: 400px;
  max-height: 80vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #e9ecef;
}

.modal-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
}

.modal-close {
  width: 32px;
  height: 32px;
  border: none;
  background: #f8f9fa;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-body {
  padding: 20px;
}

.participant-details {
  text-align: center;
  margin-bottom: 24px;
}

.large-avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
  margin-bottom: 12px;
}

.participant-details h4 {
  margin: 0 0 4px 0;
  font-size: 18px;
  font-weight: 600;
}

.participant-details p {
  margin: 0 0 8px 0;
  color: #6c757d;
}

.status-badge {
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

.status-badge.online {
  background: rgba(40, 167, 69, 0.1);
  color: #28a745;
}

.conversation-stats {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 24px;
}

.stat-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.stat-label {
  font-size: 14px;
  color: #6c757d;
}

.stat-value {
  font-size: 14px;
  font-weight: 500;
  color: #212529;
}

.conversation-actions {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.btn-secondary, .btn-danger {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 10px 16px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-secondary {
  background: #f8f9fa;
  color: #6c757d;
}

.btn-secondary:hover {
  background: #e9ecef;
}

.btn-danger {
  background: rgba(220, 53, 69, 0.1);
  color: #dc3545;
}

.btn-danger:hover {
  background: #dc3545;
  color: white;
}

/* Mobile Responsive */
@media (max-width: 768px) {
  .conversations-sidebar {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    transform: translateX(-100%);
    z-index: 1000;
  }

  .conversations-sidebar.open {
    transform: translateX(0);
  }

  .sidebar-toggle.mobile-only {
    display: flex;
  }

  .chat-area {
    width: 100%;
  }

  .message-bubble {
    max-width: 85%;
  }

  .emoji-picker {
    left: 50%;
    transform: translateX(-50%);
  }
}

@media (max-width: 480px) {
  .messages-container {
    padding: 12px;
  }

  .message-input-area {
    padding: 12px;
  }

  .input-actions {
    margin-bottom: 8px;
  }

  .modal-content {
    width: 95%;
    margin: 16px;
  }
}

/* Scrollbar */
.conversations-list::-webkit-scrollbar,
.messages-container::-webkit-scrollbar {
  width: 6px;
}

.conversations-list::-webkit-scrollbar-track,
.messages-container::-webkit-scrollbar-track {
  background: transparent;
}

.conversations-list::-webkit-scrollbar-thumb,
.messages-container::-webkit-scrollbar-thumb {
  background: #e9ecef;
  border-radius: 3px;
}

.conversations-list::-webkit-scrollbar-thumb:hover,
.messages-container::-webkit-scrollbar-thumb:hover {
  background: #dee2e6;
}
</style>
