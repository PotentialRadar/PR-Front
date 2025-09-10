<template>
  <div class="profile-edit-page">
    <div class="edit-container">
      <form @submit.prevent="saveProfile" class="profile-form">
        <!-- 프로필 이미지 섹션 -->
        <div class="form-section">
          <h3 class="section-title">프로필 이미지</h3>
          <div class="profile-image-section">
            <div class="current-avatar">
              <ProfileImage
                class="edit-avatar"
                :src="formData.avatar"
                :user-id="userStore.userId"
                :name="formData.name"
                :circular="true"
                fallback-type="default"
              />
              <div class="avatar-overlay" @click="triggerFileUpload">
                <i class="bi bi-camera"></i>
              </div>
            </div>

            <div class="avatar-options">
              <p class="avatar-description">
                프로필 이미지를 선택하거나 업로드하세요
              </p>

              <!-- 파일 업로드 섹션 추가 -->
              <div class="upload-section">
                <button
                  type="button"
                  @click="triggerFileUpload"
                  class="upload-button"
                >
                  <i class="bi bi-cloud-upload"></i>
                  사진 업로드
                </button>
                <input
                  ref="fileInput"
                  type="file"
                  accept="image/*"
                  @change="handleFileUpload"
                  class="upload-input"
                />
                <p class="upload-help">
                  JPG, PNG, GIF 파일만 업로드 가능 (최대 5MB)
                </p>

                <!-- 업로드된 이미지 미리보기 -->
                <div v-if="uploadedImage" class="upload-preview">
                  <img
                    :src="uploadedImage"
                    alt="업로드된 이미지"
                    class="preview-image"
                  />
                  <div class="preview-actions">
                    <button
                      type="button"
                      @click="useUploadedImage"
                      class="preview-action"
                    >
                      사용하기
                    </button>
                    <button
                      type="button"
                      @click="removeUploadedImage"
                      class="preview-action delete"
                    >
                      삭제
                    </button>
                  </div>
                </div>
              </div>

              <div class="avatar-grid">
                <div
                  v-for="(avatarUrl, index) in avatarOptions"
                  :key="index"
                  @click="selectAvatar(avatarUrl)"
                  :class="[
                    'avatar-option',
                    {
                      active: formData.avatar === avatarUrl && !isCustomAvatar,
                    },
                  ]"
                >
                  <img :src="avatarUrl" :alt="`아바타 ${index + 1}`" />
                  <div
                    v-if="formData.avatar === avatarUrl && !isCustomAvatar"
                    class="selected-indicator"
                  >
                    <i class="bi bi-check-circle-fill"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 기본 정보 섹션 -->
        <div class="form-section">
          <h3 class="section-title">기본 정보</h3>
          <div class="form-grid">
            <div class="form-group">
              <label class="form-label" for="name">
                닉네임 <span class="required">*</span>
              </label>
              <div class="nickname-input-group">
                <input
                  id="name"
                  v-model="formData.name"
                  type="text"
                  class="form-input nickname-input"
                  placeholder="닉네임을 입력하세요"
                  required
                  maxlength="20"
                  @input="onNicknameChange"
                />
                <button
                  type="button"
                  class="nickname-check-button"
                  @click="checkNicknameAvailability"
                  :disabled="!isNicknameValid || isCheckingNickname"
                >
                  {{ isCheckingNickname ? "확인 중..." : "중복 확인" }}
                </button>
              </div>
              <div class="input-helper">{{ formData.name.length }}/20</div>
              <p v-if="nicknameMessage" :class="nicknameMessageClass">
                {{ nicknameMessage }}
              </p>
            </div>

            <div class="form-group">
              <label class="form-label" for="jobTitle"> 직책 </label>
              <input
                id="jobTitle"
                v-model="formData.jobTitle"
                type="text"
                class="form-input"
                placeholder="직책을 입력하세요"
                maxlength="50"
              />
              <div class="input-helper">{{ formData.jobTitle.length }}/50</div>
            </div>

            <div class="form-group">
              <label class="form-label" for="category">
                분야 <span class="required">*</span>
              </label>
              <select
                id="category"
                v-model="formData.category"
                class="form-select"
                required
              >
                <option value="">분야를 선택하세요</option>
                <option 
                  v-for="techPart in techParts" 
                  :key="techPart.techPartId" 
                  :value="techPart.name"
                >
                  {{ techPart.name }}
                </option>
              </select>
            </div>

            <div class="form-group">
              <label class="form-label" for="experience"> 경력 </label>
              <select
                id="experience"
                v-model="formData.experience"
                class="form-select"
              >
                <option value="">경력을 선택하세요</option>
                <option value="신입">신입</option>
                <option value="1년 미만">1년 미만</option>
                <option value="1-3년">1-3년</option>
                <option value="3-5년">3-5년</option>
                <option value="5-10년">5-10년</option>
                <option value="10년 이상">10년 이상</option>
                <option value="기타">기타</option>
              </select>
            </div>
          </div>
        </div>

        <!-- 연락처 정보 섹션 -->
        <div class="form-section">
          <h3 class="section-title">연락처 정보</h3>
          <div class="form-grid">
            <div class="form-group">
              <label class="form-label" for="email"> 이메일 </label>
              <input
                id="email"
                v-model="formData.email"
                type="email"
                class="form-input readonly-input"
                placeholder="이메일 주소"
                readonly
                disabled
              />
              <div class="input-helper">이메일은 변경할 수 없습니다</div>
            </div>

            <div class="form-group">
              <label class="form-label" for="phone"> 전화번호 </label>
              <input
                id="phone"
                v-model="formData.phone"
                type="tel"
                class="form-input"
                placeholder="010-1234-5678"
                @input="formatPhoneNumber"
                @keypress="onlyNumbers"
                maxlength="13"
              />
            </div>

            <div class="form-group">
              <label class="form-label" for="github"> GitHub </label>
              <input
                id="github"
                v-model="formData.github"
                type="url"
                class="form-input"
                placeholder="GitHub 프로필 URL"
              />
            </div>

            <div class="form-group">
              <label class="form-label" for="linkedin"> LinkedIn </label>
              <input
                id="linkedin"
                v-model="formData.linkedin"
                type="url"
                class="form-input"
                placeholder="LinkedIn 프로필 URL"
              />
            </div>

            <div class="form-group">
              <label class="form-label" for="website"> 개인 웹사이트 </label>
              <input
                id="website"
                v-model="formData.website"
                type="url"
                class="form-input"
                placeholder="개인 웹사이트 URL"
              />
            </div>
          </div>
        </div>

        <!-- 공개 설정 섹션 -->
        <div class="form-section">
          <h3 class="section-title">공개 설정</h3>
          <div class="privacy-settings">
            <div class="privacy-item">
              <div class="privacy-info">
                <h4>포트폴리오 공개</h4>
                <p>다른 사용자가 내 포트폴리오를 볼 수 있습니다</p>
              </div>
              <label class="toggle-switch">
                <input type="checkbox" v-model="formData.isPublic" />
                <span class="toggle-slider"></span>
              </label>
            </div>

            <div class="privacy-item">
              <div class="privacy-info">
                <h4>연락처 공개</h4>
                <p>포트폴리오에서 연락처 정보를 표시합니다</p>
              </div>
              <label class="toggle-switch">
                <input type="checkbox" v-model="formData.showContact" />
                <span class="toggle-slider"></span>
              </label>
            </div>

            <div class="privacy-item">
              <div class="privacy-info">
                <h4>검색 허용</h4>
                <p>검색 결과에 내 프로필이 나타날 수 있습니다</p>
              </div>
              <label class="toggle-switch">
                <input type="checkbox" v-model="formData.allowSearch" />
                <span class="toggle-slider"></span>
              </label>
            </div>
          </div>
        </div>

        <!-- 저장 버튼 -->
        <div class="form-actions">
          <button type="button" @click="resetForm" class="reset-button">
            <i class="bi bi-arrow-clockwise"></i>
            초기화
          </button>
          <button type="submit" :disabled="saving" class="save-button">
            <i v-if="saving" class="bi bi-hourglass-split spinning"></i>
            <i v-else class="bi bi-check"></i>
            {{ saving ? "저장 중..." : "저장하기" }}
          </button>
        </div>
      </form>
    </div>

    <!-- 저장 완료 토스트 -->
    <Transition name="toast">
      <div v-if="showSaveToast" class="save-toast">
        <i class="bi bi-check-circle-fill"></i>
        프로필이 저장되었습니다!
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed, nextTick } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "@/stores/userStore";
import { updateUserProfile, checkNickname, getTechParts } from "@/api/user";
import ProfileImage from '@/components/common/ProfileImage.vue'

const router = useRouter();

// 이미지 URL 유효성 검사 및 변환 함수
const getValidImageUrl = (imageUrl) => {
  if (!imageUrl || typeof imageUrl !== 'string' || !imageUrl.trim()) {
    return null
  }
  
  const trimmedUrl = imageUrl.trim()
  
  // 더미 데이터 URL 필터링 (example.com 도메인 제외)
  if (trimmedUrl.includes('example.com')) {
    return null
  }
  
  // 이미 절대 URL인 경우
  if (trimmedUrl.startsWith('http://') || trimmedUrl.startsWith('https://')) {
    return trimmedUrl
  }
  
  // 상대 경로인 경우 백엔드 도메인을 추가
  if (trimmedUrl.startsWith('/')) {
    const backendUrl = import.meta.env.PROD 
      ? `http://localhost:${import.meta.env.VITE_BACK_PORT || 8080}`
      : 'http://localhost:8080'
    return `${backendUrl}${trimmedUrl}`
  }
  
  // 기타 경우는 그대로 반환
  return trimmedUrl
}

const saving = ref(false);
const showSaveToast = ref(false);
const loading = ref(true);

// 사진 업로드 관련 추가
const uploadedImage = ref(null);
const isCustomAvatar = ref(false);

// 닉네임 중복 확인 관련
const isCheckingNickname = ref(false);
const nicknameAvailable = ref(null); // null: 확인 전, true: 사용 가능, false: 중복
const originalNickname = ref("");

// TechPart 목록 관련
const techParts = ref([]); // [{techPartId, name}, ...]

// 아바타 옵션들 - 기본 아바타 사용
const avatarOptions = [
  "/default-avatar.svg",
];

// 기본 데이터(초기값). 실제 값은 로그인 유저 프로필로 대체됨
let originalData = {
  name: "",
  jobTitle: "",
  category: "",
  experience: "",
  email: "",
  phone: "",
  github: "",
  linkedin: "",
  website: "",
  location: "",
  bio: "",
  avatar: "",
  isPublic: true,
  showContact: true,
  allowSearch: true,
};

// 폼 데이터
const formData = reactive({ ...originalData });

// 유저 스토어
const userStore = useUserStore();

// 파일 input ref 추가
const fileInput = ref(null);

// 닉네임 유효성 검사
const isNicknameValid = computed(() => {
  const regex = /^[a-zA-Z0-9가-힣]+$/;
  const len = formData.name.length;
  return len >= 2 && len <= 20 && regex.test(formData.name);
});

// 닉네임 상태 메시지
const nicknameMessage = computed(() => {
  if (!formData.name) return "";

  if (!isNicknameValid.value) {
    return "닉네임은 2~20자, 한글/영문/숫자만 가능합니다.";
  }

  if (formData.name === originalNickname.value) {
    return "현재 사용 중인 닉네임입니다.";
  }

  if (nicknameAvailable.value === false) {
    return "이미 사용 중인 닉네임입니다.";
  }

  if (nicknameAvailable.value === true) {
    return "사용 가능한 닉네임입니다.";
  }

  return "";
});

// 닉네임 메시지 스타일 클래스
const nicknameMessageClass = computed(() => {
  if (!formData.name) return "";

  if (!isNicknameValid.value || nicknameAvailable.value === false) {
    return "validation-message error";
  }

  if (formData.name === originalNickname.value) {
    return "validation-message info";
  }

  if (nicknameAvailable.value === true) {
    return "validation-message success";
  }

  return "";
});

// 메서드
const selectAvatar = (avatarUrl) => {
  formData.avatar = avatarUrl;
  isCustomAvatar.value = false;
  uploadedImage.value = null;
};

// 이미지 에러 처리는 ProfileImage 컴포넌트에서 공통 처리

// 파일 업로드 관련 메서드 추가
const triggerFileUpload = () => {
  fileInput.value.click();
};

const handleFileUpload = (event) => {
  const file = event.target.files[0];
  if (!file) return;

  // 파일 크기 체크 (5MB)
  if (file.size > 5 * 1024 * 1024) {
    alert("파일 크기가 5MB를 초과합니다.");
    return;
  }

  // 파일 타입 체크
  if (!file.type.startsWith("image/")) {
    alert("이미지 파일만 업로드 가능합니다.");
    return;
  }

  const reader = new FileReader();
  reader.onload = (e) => {
    uploadedImage.value = e.target.result;
  };
  reader.readAsDataURL(file);
};

const useUploadedImage = () => {
  formData.avatar = uploadedImage.value;
  isCustomAvatar.value = true;
};

const removeUploadedImage = () => {
  uploadedImage.value = null;
  if (isCustomAvatar.value) {
    formData.avatar = originalData.avatar;
    isCustomAvatar.value = false;
  }
};

// 닉네임 변경 감지
const onNicknameChange = () => {
  // 원래 닉네임과 같으면 중복 확인 불필요
  if (formData.name === originalNickname.value) {
    nicknameAvailable.value = null;
  } else {
    // 다르면 중복 확인 초기화
    nicknameAvailable.value = null;
  }
};

// 닉네임 중복 확인
const checkNicknameAvailability = async () => {
  if (!isNicknameValid.value || formData.name === originalNickname.value)
    return;

  isCheckingNickname.value = true;

  try {
    const response = await checkNickname(formData.name);
    nicknameAvailable.value = !response.data.duplicate;
  } catch (error) {
    console.error("닉네임 중복 확인 실패:", error);
    nicknameAvailable.value = null;
    alert("닉네임 중복 확인 중 오류가 발생했습니다.");
  } finally {
    isCheckingNickname.value = false;
  }
};

// 숫자만 입력 허용
const onlyNumbers = (event) => {
  const char = String.fromCharCode(event.which);
  if (!/[0-9]/.test(char)) {
    event.preventDefault();
  }
};

// 전화번호 포맷팅
const formatPhoneNumber = (event) => {
  let value = event.target.value.replace(/\D/g, ""); // 숫자만 남기기

  if (value.length <= 3) {
    formData.phone = value;
  } else if (value.length <= 7) {
    formData.phone = value.slice(0, 3) + "-" + value.slice(3);
  } else if (value.length <= 11) {
    formData.phone =
      value.slice(0, 3) + "-" + value.slice(3, 7) + "-" + value.slice(7);
  } else {
    formData.phone =
      value.slice(0, 3) + "-" + value.slice(3, 7) + "-" + value.slice(7, 11);
  }
};

const saveProfile = async () => {
  saving.value = true;

  try {
    // TechPart 이름을 ID로 변환
    let techPartId = null;
    if (formData.category) {
      const selectedTechPart = techParts.value.find(tp => tp.name === formData.category);
      techPartId = selectedTechPart ? selectedTechPart.techPartId : null;
    }

    // 경력을 ExperienceRange enum으로 매핑
    const experienceMapping = {
      신입: "FRESHER",
      "1년 미만": "LT_1",
      "1-3년": "Y1_3",
      "3-5년": "Y3_5",
      "5-10년": "Y5_10",
      "10년 이상": "GE_10",
      기타: "ETC",
    };

    // 닉네임 필수 검증
    if (!formData.name || formData.name.trim().length === 0) {
      alert("닉네임을 입력해주세요.");
      return;
    }

    // 닉네임 변경 시 중복 확인 필수
    if (formData.name !== originalNickname.value) {
      if (nicknameAvailable.value !== true) {
        alert("닉네임 중복 확인을 완료해주세요.");
        return;
      }
    }

    // 전화번호 처리 (빈 값이면 null, 있으면 하이픈 제거)
    const processedPhone = formData.phone && formData.phone.trim() 
      ? formData.phone.replace(/-/g, "") 
      : null;
    
    // 전화번호 validation (값이 있을 때만)
    if (processedPhone && !/^\d{10,11}$/.test(processedPhone)) {
      alert("전화번호는 10-11자리 숫자만 입력해주세요.");
      return;
    }

    // 백엔드 API에 맞게 데이터 변환
    const payload = {
      nickname: formData.name.trim(),
      jobTitle: formData.jobTitle && formData.jobTitle.trim() ? formData.jobTitle.trim() : null,
      profileImage: formData.avatar || null,
      bio: formData.bio && formData.bio.trim() ? formData.bio.trim() : null,
      phone: processedPhone,
      githubUrl: formData.github && formData.github.trim() ? formData.github.trim() : null,
      linkedinUrl: formData.linkedin && formData.linkedin.trim() ? formData.linkedin.trim() : null,
      websiteUrl: formData.website && formData.website.trim() ? formData.website.trim() : null,
      isPortfolioOpen: formData.isPublic ?? true,
      isContactOpen: formData.showContact ?? true,
      isSearchOpen: formData.allowSearch ?? true,
      techPartId: techPartId,
      experienceRange: experienceMapping[formData.experience] || null,
    };

    console.log("프로필 저장 데이터:", payload);
    console.log("전화번호 처리 결과:", {
      original: formData.phone,
      processed: formData.phone ? formData.phone.replace(/-/g, "") : null,
    });

    const response = await updateUserProfile(payload);
    console.log("프로필 저장 성공:", response);

    // 백엔드에서 최신 프로필 정보 다시 가져오기
    await userStore.fetchProfile();
    
    // 폼 데이터도 최신 정보로 업데이트
    const updatedProfile = userStore.profile;
    const refreshedData = {
      name: updatedProfile.nickname || "",
      jobTitle: updatedProfile.jobTitle || "",
      category: updatedProfile.techPartName || "",
      experience: updatedProfile.experienceRange || "",
      email: updatedProfile.email || "",
      phone: updatedProfile.phone || "",
      github: updatedProfile.githubUrl || "",
      linkedin: updatedProfile.linkedinUrl || "",
      website: updatedProfile.websiteUrl || "",
      location: updatedProfile.location || "",
      bio: updatedProfile.bio || "",
      avatar: updatedProfile.profileImage || '/default-avatar.svg',
      isPublic: updatedProfile.isPortfolioOpen ?? true,
      showContact: updatedProfile.isContactOpen ?? true,
      allowSearch: updatedProfile.isSearchOpen ?? true,
    };
    
    // originalData와 formData 모두 업데이트
    originalData = JSON.parse(JSON.stringify(refreshedData));
    Object.assign(formData, refreshedData);
    originalNickname.value = refreshedData.name;
    
    // 닉네임 중복 확인 상태 초기화
    nicknameAvailable.value = null;

    showSaveToast.value = true;
    setTimeout(() => (showSaveToast.value = false), 3000);
  } catch (error) {
    console.error("프로필 저장 실패:", error);
    const errorMessage =
      error.response?.data?.message ||
      "프로필 저장에 실패했습니다. 다시 시도해주세요.";
    alert(errorMessage);
  } finally {
    saving.value = false;
  }
};

const resetForm = () => {
  if (confirm("모든 변경사항이 초기화됩니다. 계속하시겠습니까?")) {
    Object.assign(formData, originalData);
    uploadedImage.value = null;
    isCustomAvatar.value = false;
  }
};

const goBack = () => {
  if (hasChanges()) {
    if (confirm("저장하지 않은 변경사항이 있습니다. 정말 나가시겠습니까?")) {
      router.back();
    }
  } else {
    router.back();
  }
};

const hasChanges = () => {
  return (
    JSON.stringify(formData) !== JSON.stringify(originalData) ||
    uploadedImage.value !== null
  );
};

// 페이지를 떠날 때 확인
const handleBeforeUnload = (event) => {
  if (hasChanges()) {
    event.preventDefault();
    event.returnValue = "";
  }
};

onMounted(async () => {
  window.addEventListener("beforeunload", handleBeforeUnload);

  // TechPart 목록 로드 (별도 처리)
  try {
    const techPartsResponse = await getTechParts();
    console.log('TechParts API 응답:', techPartsResponse.data);
    techParts.value = techPartsResponse.data || [];
    console.log('로드된 techParts:', techParts.value);
  } catch (techPartsError) {
    console.error('⚠️ TechParts 로드 실패:', techPartsError);
    // fallback 데이터 설정 (한글명으로)
    techParts.value = [
      { techPartId: 1, name: '프론트엔드' },
      { techPartId: 2, name: '백엔드' },
      { techPartId: 3, name: '풀스택' },
      { techPartId: 4, name: '데브옵스' },
      { techPartId: 5, name: '모바일' },
      { techPartId: 6, name: '데이터사이언스' },
      { techPartId: 7, name: 'AI/ML' },
      { techPartId: 8, name: '디자인' }
    ];
    console.log('⚠️ fallback techParts 사용:', techParts.value);
  }

  // 프로필 데이터 로드 (별도 처리)
  try {
    // 로그인 및 프로필 확보
    console.log('🔍 로그인 상태 확인:', userStore.isLoggedIn);
    if (!userStore.isLoggedIn) {
      console.log('🔐 로그인 상태 확인 중...');
      await userStore.checkLogin();
      console.log('🔐 로그인 상태 확인 완료:', userStore.isLoggedIn);
    }
    
    console.log('📋 현재 프로필 상태:', !!userStore.profile);
    console.log('📋 현재 userStore 전체:', { 
      isLoggedIn: userStore.isLoggedIn, 
      userId: userStore.userId, 
      email: userStore.email, 
      nickname: userStore.nickname,
      profile: userStore.profile 
    });
    
    // 프로필 강제 재로드
    console.log('📋 프로필 데이터 강제 재로드 중...');
    await userStore.fetchProfile();
    console.log('📋 프로필 데이터 재로드 완료');

    const profile = userStore.profile || {};
    console.log('👤 사용자 프로필 RAW 데이터:', JSON.stringify(profile, null, 2));
    
    // ExperienceRange enum을 한국어로 역매핑
    const experienceReverseMapping = {
      "FRESHER": "신입",
      "LT_1": "1년 미만",
      "Y1_3": "1-3년", 
      "Y3_5": "3-5년",
      "Y5_10": "5-10년",
      "GE_10": "10년 이상",
      "ETC": "기타"
    };
    
    // 분야 데이터 매핑 확인
    console.log('🔍 분야 매핑 정보:', {
      'profile.techPartName': profile.techPartName,
      'profile.techPart': profile.techPart,
      'techParts 배열': techParts.value
    });
    
    // 백엔드에서 오는 분야 이름을 techParts 배열과 매칭
    let userCategory = "";
    if (profile.techPartName) {
      // techPartName이 techParts 배열에 있는지 확인
      const matchingTechPart = techParts.value.find(tp => tp.name === profile.techPartName);
      if (matchingTechPart) {
        userCategory = profile.techPartName;
        console.log('✅ 분야 매칭 성공:', userCategory);
      } else {
        console.log('⚠️ 분야 매칭 실패, 사용 가능한 옵션:', techParts.value.map(tp => tp.name));
        // 부분 매칭 시도 (대소문자 무시)
        const partialMatch = techParts.value.find(tp => 
          tp.name.toLowerCase().includes(profile.techPartName.toLowerCase()) ||
          profile.techPartName.toLowerCase().includes(tp.name.toLowerCase())
        );
        if (partialMatch) {
          userCategory = partialMatch.name;
          console.log('✅ 분야 부분 매칭 성공:', userCategory);
        }
      }
    }

    // 백엔드 필드명을 안전하게 매핑
    const hydrated = {
      name: profile.nickname || "",
      jobTitle: profile.jobTitle || "",
      category: userCategory,
      experience: experienceReverseMapping[profile.experienceRange] || "",
      email: profile.email || "",
      phone: profile.phone || "",
      github: profile.githubUrl || "",
      linkedin: profile.linkedinUrl || "",
      website: profile.websiteUrl || "",
      location: profile.location || "",
      bio: profile.bio || "",
      avatar: getValidImageUrl(profile.profileImage) || '/default-avatar.svg',
      isPublic: profile.isPortfolioOpen ?? true,
      showContact: profile.isContactOpen ?? true,
      allowSearch: profile.isSearchOpen ?? true,
    };

    console.log('🔄 hydrated 데이터:', hydrated);
    console.log('🔄 기존 formData:', JSON.stringify(formData, null, 2));
    
    // originalData 업데이트
    originalData = JSON.parse(JSON.stringify(hydrated));
    
    // formData를 완전히 새로 설정
    formData.name = hydrated.name;
    formData.jobTitle = hydrated.jobTitle;
    formData.category = hydrated.category;
    formData.experience = hydrated.experience;
    formData.email = hydrated.email;
    formData.phone = hydrated.phone;
    formData.github = hydrated.github;
    formData.linkedin = hydrated.linkedin;
    formData.website = hydrated.website;
    formData.location = hydrated.location;
    formData.bio = hydrated.bio;
    formData.avatar = hydrated.avatar;
    formData.isPublic = hydrated.isPublic;
    formData.showContact = hydrated.showContact;
    formData.allowSearch = hydrated.allowSearch;
    
    originalNickname.value = hydrated.name;
    
    console.log('📝 formData 업데이트 완료:', JSON.stringify(formData, null, 2));
    console.log('📋 originalData 설정 완료:', originalData);
    
    // Vue의 반응성 업데이트 보장
    await nextTick();
    console.log('⏭️ NextTick 완료 후 formData:', JSON.stringify(formData, null, 2));
  } catch (profileError) {
    console.error("프로필 로드 실패:", profileError);
    console.error("에러 상세:", profileError.response?.data || profileError.message);
    
    // 에러 발생시에도 기본값으로라도 설정
    console.log('⚠️ 프로필 로드 에러로 인해 기본값으로 설정');
    formData.name = userStore.nickname || "";
    formData.email = userStore.email || "";
  }
  
  // 로딩 완료 처리
  loading.value = false;
  console.log('🏁 onMounted 완료. 최종 formData:', JSON.stringify(formData, null, 2));
});

// 컴포넌트 언마운트 시 이벤트 리스너 제거
import { onUnmounted } from "vue";
onUnmounted(() => {
  window.removeEventListener("beforeunload", handleBeforeUnload);
});
</script>

<style scoped>
.profile-edit-page {
  min-height: 100vh;
  background: #f8f9fa;
  padding: 20px;
}

.page-header {
  max-width: 800px;
  margin: 0 auto 30px auto;
}

.header-content {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 10px;
}

.back-button {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  color: #666;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 14px;
}

.back-button:hover {
  background: #f8f9fa;
  border-color: #4caf50;
  color: #4caf50;
}

.page-title {
  font-size: 28px;
  font-weight: 700;
  color: #262626;
  margin: 0;
}

.edit-container {
  max-width: 800px;
  margin: 0 auto;
}

.profile-form {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  overflow: hidden;
}

.form-section {
  padding: 30px;
  border-bottom: 1px solid #f0f0f0;
}

.form-section:last-child {
  border-bottom: none;
}

.section-title {
  font-size: 20px;
  font-weight: 600;
  color: #4caf50;
  margin: 0 0 24px 0;
  padding-bottom: 8px;
  border-bottom: 2px solid rgba(76, 175, 80, 0.1);
}

.profile-image-section {
  display: flex;
  gap: 30px;
  align-items: flex-start;
}

.current-avatar {
  position: relative;
  width: 120px;
  height: 120px;
  border-radius: 50%;
  overflow: hidden;
  border: 4px solid #e0e0e0;
  flex-shrink: 0;
}

/* ProfileImage 컴포넌트 크기 오버라이드 */
.current-avatar :deep(.profile-image-container),
.current-avatar :deep(.profile-image) {
  width: 120px !important;
  height: 120px !important;
}

.current-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.2s ease;
  color: white;
  font-size: 24px;
  cursor: pointer;
}

.current-avatar:hover .avatar-overlay {
  opacity: 1;
}

.avatar-options {
  flex: 1;
}

.avatar-description {
  margin: 0 0 16px 0;
  color: #666;
  font-size: 14px;
}

/* 새로 추가된 업로드 관련 스타일 */
.upload-section {
  margin-bottom: 20px;
  padding: 16px;
  background: #f8f9fa;
  border-radius: 8px;
  border: 2px dashed #ddd;
  text-align: center;
}

.upload-button {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background: #4caf50;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: background 0.2s ease;
}

.upload-button:hover {
  background: #66bb6a;
}

.upload-input {
  display: none;
}

.upload-help {
  margin-top: 8px;
  font-size: 12px;
  color: #999;
}

.upload-preview {
  margin-top: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
}

.preview-image {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #4caf50;
}

.preview-actions {
  display: flex;
  gap: 8px;
}

.preview-action {
  padding: 6px 12px;
  border: 1px solid #ddd;
  background: white;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  transition: all 0.2s ease;
}

.preview-action:hover {
  background: #f0f0f0;
}

.preview-action.delete {
  color: #dc3545;
  border-color: #dc3545;
}

.preview-action.delete:hover {
  background: #dc3545;
  color: white;
}

.avatar-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(60px, 1fr));
  gap: 12px;
}

.avatar-option {
  position: relative;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  overflow: hidden;
  cursor: pointer;
  border: 2px solid transparent;
  transition: all 0.2s ease;
}

.avatar-option:hover {
  border-color: #4caf50;
  transform: scale(1.05);
}

.avatar-option.active {
  border-color: #4caf50;
  box-shadow: 0 0 0 2px rgba(76, 175, 80, 0.2);
}

.avatar-option img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.selected-indicator {
  position: absolute;
  top: -2px;
  right: -2px;
  background: #4caf50;
  color: white;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-label {
  font-size: 14px;
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  gap: 4px;
}

.required {
  color: #dc3545;
}

.form-input,
.form-select,
.form-textarea {
  padding: 12px 16px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 14px;
  transition: all 0.2s ease;
  outline: none;
}

.form-input:focus,
.form-select:focus,
.form-textarea:focus {
  border-color: #4caf50;
  box-shadow: 0 0 0 3px rgba(76, 175, 80, 0.1);
}

.form-textarea {
  resize: vertical;
  min-height: 80px;
  font-family: inherit;
  line-height: 1.5;
}

.input-helper {
  font-size: 12px;
  color: #999;
  margin-top: 4px;
  text-align: right;
}

.nickname-input-group {
  display: flex;
  gap: 12px;
  align-items: center;
}

.nickname-input {
  flex: 1;
}

.nickname-check-button {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 12px 16px;
  background: #4caf50;
  border: none;
  border-radius: 8px;
  color: white;
  font-size: 14px;
  font-weight: 600;
  white-space: nowrap;
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 100px;
}

.nickname-check-button:hover:not(:disabled) {
  background: #66bb6a;
}

.nickname-check-button:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.readonly-input {
  background-color: #f8f9fa !important;
  cursor: not-allowed;
  color: #6c757d;
}

.validation-message {
  font-size: 12px;
  margin-top: 4px;
  font-weight: 500;
}

.validation-message.error {
  color: #dc3545;
}

.validation-message.success {
  color: #28a745;
}

.validation-message.info {
  color: #6c757d;
}

.privacy-settings {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.privacy-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #e9ecef;
}

.privacy-info h4 {
  margin: 0 0 4px 0;
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.privacy-info p {
  margin: 0;
  font-size: 14px;
  color: #666;
}

.toggle-switch {
  position: relative;
  display: inline-block;
  width: 50px;
  height: 24px;
  cursor: pointer;
}

.toggle-switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.toggle-slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  transition: 0.3s;
  border-radius: 24px;
}

.toggle-slider:before {
  position: absolute;
  content: "";
  height: 18px;
  width: 18px;
  left: 3px;
  bottom: 3px;
  background-color: white;
  transition: 0.3s;
  border-radius: 50%;
}

input:checked + .toggle-slider {
  background-color: #4caf50;
}

input:checked + .toggle-slider:before {
  transform: translateX(26px);
}

.form-actions {
  padding: 30px;
  background: #f8f9fa;
  display: flex;
  justify-content: space-between;
  gap: 16px;
}

.reset-button,
.save-button {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.reset-button {
  background: white;
  color: #666;
  border: 1px solid #ddd;
}

.reset-button:hover {
  background: #f8f9fa;
  border-color: #999;
}

.save-button {
  background: #4caf50;
  color: white;
  min-width: 140px;
}

.save-button:hover:not(:disabled) {
  background: #66bb6a;
}

.save-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.spinning {
  animation: spin 1s linear infinite;
}

.save-toast {
  position: fixed;
  top: 80px;
  right: 20px;
  background: #4caf50;
  color: white;
  padding: 12px 20px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 500;
  z-index: 1000;
}

.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateX(100%);
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

@media (max-width: 768px) {
  .profile-edit-page {
    padding: 15px;
  }

  .profile-image-section {
    flex-direction: column;
    gap: 20px;
  }

  .current-avatar {
    align-self: center;
  }

  .form-grid {
    grid-template-columns: 1fr;
  }

  .privacy-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .form-actions {
    flex-direction: column-reverse;
  }
}

@media (max-width: 480px) {
  .profile-edit-page {
    padding: 10px;
  }

  .form-section {
    padding: 20px;
  }

  .avatar-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}
</style>
