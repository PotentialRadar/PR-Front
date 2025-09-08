# ProfileImage 컴포넌트 사용 가이드

## 개요
ProfileImage 컴포넌트는 백엔드 User 엔티티의 `profileImage` 필드와 완벽하게 연동되어, 프로젝트 전체에서 프로필 이미지를 일관성 있게 표시하는 공통 컴포넌트입니다.

## 주요 기능
- 백엔드 User 엔티티의 profileImage 우선 지원
- 자동 fallback 이미지 처리 (dicebear, initials, custom)
- 다양한 크기 지원 (xs, sm, md, lg, xl)
- 원형/둥근 모서리 스타일
- 상태 표시 (온라인/오프라인 등)
- 이미지 로드 에러 자동 처리

## 기본 사용법

```vue
<template>
  <ProfileImage 
    :src="user.profileImage"
    :user-id="user.userId"
    :name="user.nickname"
    size="md"
    :circular="true"
  />
</template>

<script setup>
import ProfileImage from '@/components/common/ProfileImage.vue'
</script>
```

## Props 설명

### 필수 Props
- `user-id` (String|Number): 사용자 ID (fallback 이미지 생성용)
- `name` (String): 사용자 이름 (alt 텍스트용)

### 선택 Props
- `src` (String): 프로필 이미지 URL (백엔드의 profileImage 필드)
- `size` (String): 'xs', 'sm', 'md', 'lg', 'xl' 중 하나 (기본값: 'md')
- `circular` (Boolean): 원형 여부 (기본값: true)
- `rounded` (Boolean): 둥근 모서리 여부 (기본값: false)
- `status` (String): 상태 ('online', 'offline', 'away', 'busy')
- `show-status` (Boolean): 상태 표시 여부 (기본값: false)
- `fallback-type` (String): fallback 이미지 타입 ('dicebear', 'initials', 'default')
- `alt` (String): 커스텀 alt 텍스트

## 크기별 사용 예시

### 작은 크기 (채팅, 댓글)
```vue
<ProfileImage 
  :src="user.profileImage"
  :user-id="user.userId"
  :name="user.nickname"
  size="xs"
/>
```

### 중간 크기 (카드, 리스트)
```vue
<ProfileImage 
  :src="user.profileImage"
  :user-id="user.userId"
  :name="user.nickname"
  size="md"
/>
```

### 큰 크기 (프로필 페이지)
```vue
<ProfileImage 
  :src="user.profileImage"
  :user-id="user.userId"
  :name="user.nickname"
  size="xl"
/>
```

## 상태 표시 사용법
```vue
<ProfileImage 
  :src="user.profileImage"
  :user-id="user.userId"
  :name="user.nickname"
  size="md"
  status="online"
  :show-status="true"
/>
```

## 컴포지블과 함께 사용

```vue
<template>
  <ProfileImage 
    :src="profileImageUrl"
    :user-id="userId"
    :name="userName"
    size="md"
  />
</template>

<script setup>
import ProfileImage from '@/components/common/ProfileImage.vue'
import { useProfileImage } from '@/composables/useProfileImage.js'

const props = defineProps(['user'])

const { profileImageUrl, userName, userId } = useProfileImage(props.user)
</script>
```

## 마이그레이션 가이드

### 기존 코드
```vue
<!-- 기존 방식 -->
<img 
  :src="getMemberProfileImage(member)" 
  :alt="member.name"
  class="profile-image"
  @error="handleImageError"
/>
```

### 새로운 코드
```vue
<!-- 새로운 방식 -->
<ProfileImage 
  :src="member.profileImage"
  :user-id="member.userId"
  :name="member.name"
  size="md"
/>
```

## 백엔드 연동

이 컴포넌트는 백엔드 User 엔티티의 다음 필드들과 연동됩니다:

```java
// User.java
@Column(columnDefinition = "text")
private String profileImage;  // 우선순위 1

@Column(nullable = false, columnDefinition = "citext")
private String nickname;      // 사용자 이름

@Id @GeneratedValue(strategy = GenerationType.IDENTITY)
private Long userId;          // 사용자 ID
```

## Fallback 처리 순서

1. `user.profileImage` (백엔드에서 제공)
2. `user.avatar` (기존 호환성)
3. Dicebear 자동 생성 아바타
4. 기본 이미지

## 스타일 커스터마이징

컴포넌트에 추가 클래스를 적용할 수 있습니다:

```vue
<ProfileImage 
  :src="user.profileImage"
  :user-id="user.userId"
  :name="user.nickname"
  size="md"
  class="custom-border"
/>

<style>
.custom-border {
  border: 2px solid #007bff;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}
</style>
```

## 주의사항

1. **userId는 필수입니다** - fallback 이미지 생성에 필요
2. **profileImage가 우선됩니다** - 백엔드 필드와 완벽 연동
3. **에러 처리가 자동화되어 있습니다** - 별도 에러 핸들링 불필요
4. **반응형 디자인을 고려하세요** - 다양한 화면 크기에서 테스트

## 성능 최적화

- lazy loading 자동 적용
- 이미지 캐싱 최적화
- fallback 이미지 미리 로드
- 불필요한 리렌더링 방지