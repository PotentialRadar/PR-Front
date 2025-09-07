<template>
  <div class="profile-image-container" :class="sizeClass">
    <img
      :src="currentSrc"
      :alt="alt"
      :class="['profile-image', { circular, rounded }]"
      @error="handleImageError"
      @load="handleImageLoad"
    />
    <div v-if="showStatus && status" :class="['status-indicator', status]"></div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
  // 이미지 소스 (백엔드의 profileImage 또는 다른 이미지 URL)
  src: {
    type: String,
    default: null
  },
  // 사용자 ID (fallback 이미지 생성용)
  userId: {
    type: [String, Number],
    default: null
  },
  // 사용자 이름 (alt 텍스트용)
  name: {
    type: String,
    default: '사용자'
  },
  // alt 속성
  alt: {
    type: String,
    default: null
  },
  // 크기 (xs, sm, md, lg, xl)
  size: {
    type: String,
    default: 'md',
    validator: value => ['xs', 'sm', 'md', 'lg', 'xl'].includes(value)
  },
  // 원형 여부
  circular: {
    type: Boolean,
    default: true
  },
  // 모서리 둥글게
  rounded: {
    type: Boolean,
    default: false
  },
  // 상태 표시 (online, offline, away 등)
  status: {
    type: String,
    default: null
  },
  // 상태 표시 여부
  showStatus: {
    type: Boolean,
    default: false
  },
  // 기본 이미지 타입 (dicebear, initials, default)
  fallbackType: {
    type: String,
    default: 'dicebear',
    validator: value => ['dicebear', 'initials', 'default'].includes(value)
  }
})

const currentSrc = ref('')
const hasError = ref(false)

// 크기 클래스 계산
const sizeClass = computed(() => `profile-image-${props.size}`)

// alt 텍스트 계산
const computedAlt = computed(() => props.alt || props.name)

// fallback 이미지 URL 생성
const getFallbackUrl = () => {
  if (props.fallbackType === 'dicebear' && props.userId) {
    return `https://api.dicebear.com/7.x/avataaars/svg?seed=${props.userId}`
  } else if (props.fallbackType === 'initials' && props.name) {
    // 이니셜 기반 이미지 (추후 구현 가능)
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(props.name)}&background=random`
  } else {
    return '/default-avatar.png'
  }
}

// 이미지 에러 핸들링
const handleImageError = () => {
  if (!hasError.value) {
    hasError.value = true
    currentSrc.value = getFallbackUrl()
  }
}

// 이미지 로드 성공
const handleImageLoad = () => {
  hasError.value = false
}

// src 변경 시 처리
watch(() => props.src, (newSrc) => {
  hasError.value = false
  if (newSrc && newSrc.trim()) {
    currentSrc.value = newSrc
  } else {
    currentSrc.value = getFallbackUrl()
  }
}, { immediate: true })
</script>

<style scoped>
.profile-image-container {
  position: relative;
  display: inline-block;
  flex-shrink: 0;
}

.profile-image {
  display: block;
  object-fit: cover;
  background-color: #f0f0f0;
  transition: opacity 0.3s ease;
}

.profile-image.circular {
  border-radius: 50%;
}

.profile-image.rounded {
  border-radius: 8px;
}

/* 크기별 스타일 */
.profile-image-xs {
  width: 24px;
  height: 24px;
}

.profile-image-xs .profile-image {
  width: 24px;
  height: 24px;
}

.profile-image-sm {
  width: 32px;
  height: 32px;
}

.profile-image-sm .profile-image {
  width: 32px;
  height: 32px;
}

.profile-image-md {
  width: 48px;
  height: 48px;
}

.profile-image-md .profile-image {
  width: 48px;
  height: 48px;
}

.profile-image-lg {
  width: 64px;
  height: 64px;
}

.profile-image-lg .profile-image {
  width: 64px;
  height: 64px;
}

.profile-image-xl {
  width: 96px;
  height: 96px;
}

.profile-image-xl .profile-image {
  width: 96px;
  height: 96px;
}

/* 상태 표시 */
.status-indicator {
  position: absolute;
  bottom: 2px;
  right: 2px;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: 2px solid white;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
}

.status-indicator.online {
  background-color: #10b981;
}

.status-indicator.offline {
  background-color: #6b7280;
}

.status-indicator.away {
  background-color: #f59e0b;
}

.status-indicator.busy {
  background-color: #ef4444;
}

/* 큰 크기에서는 상태 표시도 크게 */
.profile-image-lg .status-indicator,
.profile-image-xl .status-indicator {
  width: 16px;
  height: 16px;
  bottom: 4px;
  right: 4px;
}
</style>