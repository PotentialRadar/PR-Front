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
            <div v-for="member in approvedMembers" :key="member.id" class="member-card">
              <h3>{{ member.userName }} ({{ getPartLabel(member.techPart) }})</h3>
            </div>
          </div>
          <p v-else>아직 승인된 멤버가 없습니다.</p>
        </section>

        <!-- 프로젝트 수정 버튼 -->
        <section class="edit-project-section">
          <h2>프로젝트 정보</h2>
          <div class="project-actions">
            <button class="edit-btn" @click="goToEditPage">프로젝트 수정</button>
            <button class="delete-btn" @click="confirmDelete">프로젝트 삭제</button>
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
import { getProject, deleteProject } from '@/api/projects'; // Import deleteProject
import { getProjectMembers, updateMemberStatus } from '@/api/projectMember';
import { PART_OPTIONS } from '@/constants/parts';

const route = useRoute();
const router = useRouter();
const projectId = ref(route.params.projectId);

const project = ref(null);
const applicants = ref([]);
const loading = ref(true);
const error = ref(null);

const pendingApplicants = computed(() => applicants.value.filter(a => a.status === 'PENDING'));
const approvedMembers = computed(() => applicants.value.filter(a => a.status === 'ACCEPTED'));

const getPartLabel = (partValue) => {
  const part = PART_OPTIONS.find(option => option.value === partValue);
  return part ? part.label : partValue;
};

onMounted(async () => {
  try {
    const projectResponse = await getProject(projectId.value);
    project.value = projectResponse.data;

    const applicantsResponse = await getProjectMembers(projectId.value, 1);
    applicants.value = applicantsResponse.data;

  } catch (err) {
    console.error('데이터 로딩 중 오류 발생:', err);
    error.value = err;
  } finally {
    loading.value = false;
  }
});

const updateApplicantStatus = async (applicantId, status) => {
  try {
    await updateMemberStatus(projectId.value, applicantId, 1, status);
    alert(`지원자가 성공적으로 ${status === 'ACCEPTED' ? '수락' : '거절'}되었습니다.`);

    const index = applicants.value.findIndex(a => a.id === applicantId);
    if (index !== -1) {
      applicants.value[index].status = status;
    }
  } catch (err) {
    console.error(`지원자 ${status === 'ACCEPTED' ? '수락' : '거절'} 실패:`, err);
    alert(`지원자 ${status === 'ACCEPTED' ? '수락' : '거절'}에 실패했습니다.`);
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
    alert('프로젝트가 성공적으로 삭제되었습니다.');
    router.push('/projects'); // Redirect to project list page
  } catch (err) {
    console.error('프로젝트 삭제 실패:', err);
    alert('프로젝트 삭제에 실패했습니다. 다시 시도해주세요.');
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

.reject-btn:hover {
  background-color: #d32f2f;
}

.project-actions {
  display: flex;
  gap: 10px;
  margin-top: 20px;
  padding: 15px 0;
  border-top: 1px solid #eee;
  justify-content: flex-end;
}

.edit-btn,
.delete-btn {
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;
  transition: all 0.3s ease;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.edit-btn {
  background-color: #2196F3;
  color: white;
}

.edit-btn:hover {
  background-color: #1976D2;
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.delete-btn {
  background-color: #f44336;
  color: white;
}

.delete-btn:hover {
  background-color: #d32f2f;
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}
</style>