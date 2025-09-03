<template>
  <div class="project-manage-page">
    <div v-if="loading" class="loading-state">로딩 중...</div>
    <div v-else-if="error" class="error-state">오류 발생: {{ error.message }}</div>
    <div v-else-if="project">
      <h1>{{ project.title }} 관리</h1>
      <p>프로젝트 ID: {{ projectId }}</p>
      <p>설명: {{ project.description }}</p>

      <div class="manage-sections">
        <!-- 지원자 목록 섹션 -->
        <section class="applicants-section">
          <h2>지원자 목록 ({{ pendingApplicants.length }}명)</h2>
          <div v-if="pendingApplicants.length > 0" class="applicants-list">
            <div v-for="applicant in pendingApplicants" :key="applicant.id" class="applicant-card">
              <div class="applicant-info">
                <h3>{{ applicant.userName }} ({{ getPartLabel(applicant.techPart) }})</h3>
                <p>메시지: {{ applicant.applicationMessage }}</p>
              </div>
              <div class="applicant-actions">
                <button @click="acceptApplicant(applicant.id)" class="accept-btn">수락</button>
                <button @click="rejectApplicant(applicant.id)" class="reject-btn">거절</button>
              </div>
            </div>
          </div>
          <p v-else>대기 중인 지원자가 없습니다.</p>
        </section>

        <!-- 승인된 멤버 목록 섹션 -->
        <section class="members-section">
          <h2>프로젝트 멤버 ({{ approvedMembers.length }}명)</h2>
          <div v-if="approvedMembers.length > 0" class="members-list">
            <div v-for="member in approvedMembers" :key="member.userId || member.id" class="member-card">
              <div class="member-avatar">
                <img 
                  v-if="getAvatarUrl(member)" 
                  :src="getAvatarUrl(member)" 
                  :alt="member.userName"
                  class="avatar-image"
                  @error="(event) => handleImageError(event, member)"
                />
                <div v-else class="avatar-circle">{{ member.userName ? member.userName.charAt(0) : '?' }}</div>
              </div>
              <div class="member-info">
                <div class="member-name">{{ member.userName }}</div>
                <div class="member-details">
                  <span v-if="member.techPart" class="member-part">{{ getPartLabel(member.techPart) }}</span>
                  <span v-if="member.role" class="member-role-badge" :class="getRoleClass(member.role)">
                    {{ getRoleLabel(member.role) }}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <p v-else>아직 승인된 멤버가 없습니다.</p>
        </section>

        <section class="edit-project-section">
          <h2>프로젝트 정보</h2>
          <div class="project-actions">
            <label for="project-status">상태:</label>
            <select id="project-status" v-model="projectStatus">
              <option v-for="option in statusOptions" :key="option.value" :value="option.value">
                {{ option.label }}
              </option>
            </select>
            <button @click="handleStatusUpdate" class="action-btn status-update-btn">상태 저장</button>
            <button class="action-btn edit-btn" @click="goToEditPage">수정</button>
            <button class="action-btn delete-btn" @click="confirmDelete">삭제</button>
          </div>
        </section>
      </div>
    </div>
    <div v-else class="no-project-found">프로젝트를 찾을 수 없습니다.</div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { getProject, deleteProject, updateProjectStatus, getConfirmedProjectMembers } from '@/api/projects'; // Import deleteProject
import { getProjectMembers, updateMemberStatus } from '@/api/projectMember';
import { PART_OPTIONS } from '@/constants/parts';
import { useUserStore } from '@/stores/userStore'; // Import user store
import { useToast } from 'vue-toastification';

const route = useRoute();
const router = useRouter();
const userStore = useUserStore(); // Get user store instance
const toast = useToast();
const projectId = ref(route.params.projectId);

const project = ref(null);
const applicants = ref([]);
const confirmedMembers = ref([]);
const loading = ref(true);
const error = ref(null);

const projectStatus = ref('');
const statusOptions = [
  { value: 'RECRUITING', label: '모집중' },
  { value: 'IN_PROGRESS', label: '진행중' },
  { value: 'COMPLETED', label: '완료' },
];

const pendingApplicants = computed(() => applicants.value.filter(a => a.status === 'PENDING'));
const approvedMembers = computed(() => {
  // 지원을 통해 승인된 멤버 + 초대를 통해 추가된 멤버
  const acceptedApplicants = applicants.value.filter(a => a.status === 'ACCEPTED');
  return [...acceptedApplicants, ...confirmedMembers.value];
});

const getPartLabel = (partValue) => {
  const part = PART_OPTIONS.find(option => option.value === partValue);
  return part ? part.label : partValue;
};

const getRoleLabel = (role) => {
  const roleLabels = {
    'LEADER': '리더',
    'MEMBER': '멤버'
  };
  return roleLabels[role] || role;
};

const getRoleClass = (role) => {
  return role === 'LEADER' ? 'role-leader' : 'role-member';
};

const getAvatarUrl = (member) => {
  // profileImageUrl 또는 profileImage 필드 확인, 없으면 dicebear 기본 아바타 생성
  return member.profileImageUrl || member.profileImage || `https://api.dicebear.com/7.x/avataaars/svg?seed=${member.userId}`;
};

const handleImageError = (event, member) => {
  // 이미지 로드 실패 시 dicebear 기본 아바타로 재시도
  const img = event.target;
  const fallbackUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${member.userId}`;
  
  if (img.src !== fallbackUrl) {
    img.src = fallbackUrl;
  } else {
    // dicebear도 실패하면 아바타 서클로 대체
    const memberName = img.alt;
    const avatarCircle = document.createElement('div');
    avatarCircle.className = 'avatar-circle';
    avatarCircle.textContent = memberName ? memberName.charAt(0) : '?';
    img.parentNode.replaceChild(avatarCircle, img);
  }
};

onMounted(async () => {
  try {
    const currentUserId = userStore.userId;
    if (!currentUserId) {
      error.value = new Error('로그인이 필요합니다.');
      loading.value = false;
      // Optionally redirect to login
      // router.push('/login');
      return;
    }

    const projectResponse = await getProject(projectId.value);
    project.value = projectResponse.data;
    projectStatus.value = projectResponse.data.status;

    // Use the dynamic userId from the store
    const applicantsResponse = await getProjectMembers(projectId.value, currentUserId);
    applicants.value = applicantsResponse.data;

    // 확정된 프로젝트 멤버도 가져오기 (초대를 통해 추가된 멤버들)
    const confirmedResponse = await getConfirmedProjectMembers(projectId.value);
    confirmedMembers.value = confirmedResponse.data;
    
    // 디버깅: 실제 응답 데이터 확인
    console.log('🔍 전체 응답:', confirmedResponse.data);
    if (confirmedResponse.data.length > 0) {
      console.log('🔍 첫 번째 멤버 데이터:', confirmedResponse.data[0]);
    }

  } catch (err) {
    console.error('데이터 로딩 중 오류 발생:', err);
    error.value = err;
  } finally {
    loading.value = false;
  }
});

const handleStatusUpdate = async () => {
  if (!projectStatus.value) {
    toast.warning('변경할 상태를 선택해주세요.');
    return;
  }
  try {
    const currentUserId = userStore.userId;
    if (!currentUserId) {
      toast.error('오류: 사용자 ID를 찾을 수 없습니다. 다시 로그인해주세요.');
      return;
    }
    await updateProjectStatus(projectId.value, projectStatus.value, currentUserId);
    toast.success('프로젝트 상태가 성공적으로 변경되었습니다.');
    router.push('/myPage/projects');
  } catch (err) {
    console.error('프로젝트 상태 변경 실패:', err);
    toast.error('프로젝트 상태 변경에 실패했습니다.');
  }
};

const updateApplicantStatus = async (applicantId, status) => {
  try {
    const currentUserId = userStore.userId;
    if (!currentUserId) {
      toast.error('오류: 사용자 ID를 찾을 수 없습니다. 다시 로그인해주세요.');
      return;
    }
    await updateMemberStatus(projectId.value, applicantId, currentUserId, status);
    toast.success(`지원자가 성공적으로 ${status === 'ACCEPTED' ? '수락' : '거절'}되었습니다.`);

    const index = applicants.value.findIndex(a => a.id === applicantId);
    if (index !== -1) {
      applicants.value[index].status = status;
    }
  } catch (err) {
    console.error(`지원자 ${status === 'ACCEPTED' ? '수락' : '거절'} 실패:`, err);
    toast.error(`지원자 ${status === 'ACCEPTED' ? '수락' : '거절'}에 실패했습니다.`);
  }
};

const acceptApplicant = (applicantId) => updateApplicantStatus(applicantId, 'ACCEPTED');
const rejectApplicant = (applicantId) => updateApplicantStatus(applicantId, 'REJECTED');

const goToEditPage = () => {
  router.push(`/myPage/projects/${projectId.value}/edit`);
};

// Function to handle project deletion
const confirmDelete = () => {
  if (window.confirm('정말로 이 프로젝트를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) {
    handleDeleteProject();
  }
};

const handleDeleteProject = async () => {
  try {
    await deleteProject(projectId.value);
    toast.success('프로젝트가 성공적으로 삭제되었습니다.');
    router.push('/projects'); // Redirect to project list page
  } catch (err) {
    console.error('프로젝트 삭제 실패:', err);
    toast.error('프로젝트 삭제에 실패했습니다. 다시 시도해주세요.');
  }
};



</script>

<style scoped>
.project-manage-page {
  padding: 20px;
  max-width: 900px;
  margin: 0 auto;
  background: #f8f9fa;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

h1 {
  color: #2c3e50;
  margin-bottom: 20px;
}

.loading-state,
.error-state,
.no-project-found {
  text-align: center;
  padding: 50px;
  color: #666;
}

.manage-sections {
  display: flex;
  flex-direction: column;
  gap: 30px;
  margin-top: 30px;
}

section {
  background: #fff;
  padding: 25px;
  border-radius: 8px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.04);
}

h2 {
  color: #4CAF50;
  margin-top: 0;
  margin-bottom: 20px;
  border-bottom: 2px solid #e0e0e0;
  padding-bottom: 10px;
}

.applicants-list,
.members-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.applicant-card,
.member-card {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #fdfdfd;
}

.applicant-info h3,
.member-card h3 {
  margin: 0 0 5px 0;
  color: #333;
  font-size: 18px;
}

.applicant-info p {
  margin: 0;
  color: #666;
  font-size: 14px;
}

.applicant-actions button { /* Apply common styles to all action buttons */
  padding: 8px 15px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
  transition: background-color 0.2s ease;
}

.accept-btn {
  background-color: #4CAF50;
  color: white;
}

.accept-btn:hover {
  background-color: #45a049;
}

.reject-btn {
  background-color: #f44336;
  color: white;
  margin-left: 10px;
}

.project-actions {
  display: flex;
  gap: 10px;
  align-items: center; /* Vertically align items */
  margin-top: 20px;
  padding: 15px;
  border-top: 1px solid #eee;
  background-color: #fdfdfd;
  border-radius: 8px;
  justify-content: flex-start; /* Align items to the start */
}

.project-actions label {
  font-weight: bold;
  color: #333;
  margin-right: 5px;
}

.project-actions select {
  padding: 8px 12px;
  border-radius: 6px;
  border: 1px solid #ccc;
  background-color: white;
  transition: border-color 0.2s ease;
}

.project-actions select:hover {
  border-color: #4CAF50;
}

.action-btn {
  padding: 9px 18px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: bold;
  transition: all 0.2s ease;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.action-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.15);
}

.status-update-btn {
  background-color: #4CAF50;
  color: white;
}

.edit-btn {
  background-color: #2196F3;
  color: white;
}

.delete-btn {
  background-color: #f44336;
  color: white;
}

.delete-btn:hover {
  background-color: #d32f2f;
}

/* 새로운 멤버 카드 스타일 */
.members-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 16px;
  margin-top: 16px;
}

.member-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  transition: all 0.2s ease;
}

.member-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  border-color: #4CAF50;
}

.member-avatar {
  flex-shrink: 0;
}

.avatar-circle {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: linear-gradient(135deg, #4CAF50, #66BB6A);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  font-weight: 600;
  text-transform: uppercase;
}

.avatar-image {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #e5e7eb;
  transition: border-color 0.2s ease;
}

.member-card:hover .avatar-image {
  border-color: #4CAF50;
}

.member-info {
  flex: 1;
  min-width: 0;
}

.member-name {
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 6px;
}

.member-details {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.member-part {
  background: #f3f4f6;
  color: #6b7280;
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
}

.member-role-badge {
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  text-transform: capitalize;
}

.role-leader {
  background: linear-gradient(135deg, #fbbf24, #f59e0b);
  color: white;
}

.role-member {
  background: linear-gradient(135deg, #10b981, #059669);
  color: white;
}

/* 반응형 디자인 */
@media (max-width: 768px) {
  .members-list {
    grid-template-columns: 1fr;
  }
  
  .member-card {
    padding: 16px;
  }
  
  .avatar-circle,
  .avatar-image {
    width: 40px;
    height: 40px;
  }
  
  .avatar-circle {
    font-size: 16px;
  }
}
</style>