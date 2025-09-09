<template>
  <div class="new-project-page">
    <div v-if="isSubmitting" class="loading-overlay">
      <div class="loading-spinner">
        <div class="spinner"></div>
        <p class="loading-text">프로젝트를 등록 중입니다...</p>
      </div>
    </div>

    <!-- 페이지 헤더 -->
    <PageHeader 
      :title="isEditMode ? '프로젝트 수정' : '새로운 프로젝트'"
      :subtitle="isEditMode ? '프로젝트 정보를 수정합니다.' : '프로젝트 정보를 입력하여 맞춤형 개발자를 찾아보세요'"
    />

    <div class="form-container">
      <div class="form-content">

        <!-- 제목 -->
        <div class="form-section">
          <div class="section-title">프로젝트 제목</div>
          <div class="input-group">
            <input
                type="text"
                v-model="formData.projectTitle"
                :class="['project-title-input', { 'error': getError('projectTitle').value }]"
                placeholder="프로젝트의 제목을 입력해주세요."
                @blur="validateField('projectTitle', formData.projectTitle, validationSchema.projectTitle)"
            />
            <div v-if="getError('projectTitle').value" class="error-message">
              {{ getError('projectTitle').value }}
            </div>
          </div>
        </div>

        <!-- 내용 -->
        <div class="form-section">
          <div class="section-title">프로젝트 내용</div>
          <div class="form-inputs">
            <div class="input-group">
              <textarea
                  v-model="formData.projectDescription"
                  :class="['project-description-textarea', { 'error': getError('projectDescription').value }]"
                  placeholder="프로젝트에 대한 정보를 입력해주세요."
                  rows="6"
                  @blur="validateField('projectDescription', formData.projectDescription, validationSchema.projectDescription)"
              ></textarea>
              <div v-if="getError('projectDescription').value" class="error-message">
                {{ getError('projectDescription').value }}
              </div>
            </div>
          </div>
        </div>

        <!-- 프로젝트 기간 -->
        <div class="form-section">
          <div class="section-title">프로젝트 기간</div>
          <div class="date-range-group">
            <div class="input-group">
              <input
                  type="date"
                  v-model="formData.startDate"
                  :max="formData.endDate"
                  :class="['deadline-input', { 'error': getError('startDate').value }]"
                  @blur="validateField('startDate', formData.startDate, validationSchema.startDate)"
              />
              <div v-if="getError('startDate').value" class="error-message">
                {{ getError('startDate').value }}
              </div>
            </div>
            <span class="date-separator">~</span>
            <div class="input-group">
              <input
                  type="date"
                  v-model="formData.endDate"
                  :min="formData.startDate"
                  :class="['deadline-input', { 'error': getError('endDate').value }]"
                  @blur="validateField('endDate', formData.endDate, validationSchema.endDate)"
              />
              <div v-if="getError('endDate').value" class="error-message">
                {{ getError('endDate').value }}
              </div>
            </div>
          </div>
        </div>

        <!-- ✅ 파트별 모집 인원 -->
        <div class="form-section parts-section">
          <div class="section-title">파트별 모집 인원</div>
          <div class="parts-card">
            <div class="part-rows">
              <div class="part-row" v-for="(row, idx) in partRows" :key="idx">
                <div class="row-left">
                  <select v-model="row.part" class="part-select" :class="{ error: getError('parts').value && !row.part }">
                    <option value="" disabled>파트 선택</option>
                    <option v-for="opt in partOptions" :key="opt.value" :value="opt.value">
                      {{ opt.label }}
                    </option>
                  </select>
                </div>
                <div class="row-mid">
                  <input
                      class="part-count"
                      type="number"
                      min="1"
                      max="99"
                      v-model.number="row.count"
                      :class="[{ error: getError('parts').value && (!row.count || row.count < 1) }]"
                      placeholder="인원"
                  />
                  <span class="unit">명</span>
                </div>
                <div class="row-right">
                  <button type="button" class="row-remove" @click="removePartRow(idx)" v-if="partRows.length > 1">
                    삭제
                  </button>
                </div>
              </div>
            </div>

            <div class="parts-actions">
              <button type="button" class="add-row" @click="addPartRow">+ 파트 추가</button>
              <div class="total-count">총 모집 인원: <b>{{ totalRecruitCount }}</b>명</div>
            </div>

            <div v-if="getError('parts').value" class="error-message">
              {{ getError('parts').value }}
            </div>
          </div>
        </div>
        <!-- /파트별 모집 -->

        <!-- 기술 스택 -->
        <div class="form-section">
          <div class="section-title">기술 스택</div>
          <p class="upload-note">입력된 기술 스택은 프로젝트 추천 서비스에 이용됩니다.</p>
          <TechStackSelector
              v-model="formData.techStack"
              :error="getError('techStack').value"
              @change="validateField('techStack', formData.techStack, validationSchema.techStack)"
          />
          <div v-if="getError('techStack').value" class="error-message">
            {{ getError('techStack').value }}
          </div>
        </div>

        <!-- 마감일 -->
        <div class="form-section deadline-section">
          <div class="section-title">모집 마감일</div>
          <div class="input-group with-presets">
            <div class="deadline-presets">
              <button type="button" @click="setRecruitDeadline('day', 7)" class="preset-button">1주일 후</button>
              <button type="button" @click="setRecruitDeadline('day', 14)" class="preset-button">2주일 후</button>
              <button type="button" @click="setRecruitDeadline('day', 21)" class="preset-button">3주일 후</button>
              <button type="button" @click="setRecruitDeadline('month', 1)" class="preset-button">1개월 후</button>
            </div>
            <input
                type="date"
                v-model="formData.recruitDeadline"
                :min="new Date().toISOString().slice(0, 10)"
                :class="['deadline-input', { 'error': getError('recruitDeadline').value }]"
            />
          </div>
          <div v-if="getError('recruitDeadline').value" class="error-message">
            {{ getError('recruitDeadline').value }}
          </div>
        </div>

        <!-- 첨부파일 -->
        <div class="form-section">
          <div class="upload-section">
            <div class="section-title">참고 파일</div>
            <FileUploadArea
                v-model="formData.files"
                :error="getError('files').value"
                @change="validateField('files', formData.files, validationSchema.files)"
            />
            <div v-if="getError('files').value" class="error-message">
              {{ getError('files').value }}
            </div>
          </div>
        </div>

        <!-- 제출 -->
        <div class="submit-section">
          <button
              @click="submitForm"
              :disabled="isSubmitting || hasErrors"
              :class="['submit-button', { 'loading': isSubmitting, 'disabled': hasErrors }]"
          >
            <span v-if="!isSubmitting">{{ isEditMode ? '수정하기' : '작성하기' }}</span>
            <span v-else class="submit-loading">
              <div class="mini-spinner"></div>
              등록 중...
            </span>
          </button>

          <div v-if="submitAttempted && hasErrors" class="form-error-summary">
            <i class="bi bi-exclamation-triangle-fill"></i>
            <span>입력 내용을 다시 확인해주세요.</span>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive, computed, onMounted, onActivated } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/userStore';
import { useToast } from 'vue-toastification';
import PageHeader from '@/components/common/PageHeader.vue';
import { useFormValidation } from '@/composables/useFormValidation.js';
import { getProject, createProject, updateProject, uploadProjectFile } from '@/api/projects';
import { loadPartOptions } from '@/constants/parts';
import TechStackSelector from '@/components/common/TechStackSelector.vue';
import FileUploadArea from '@/components/projectComponents/FileUploadArea.vue';

export default {
  name: 'ProjectFormPage',
  components: { TechStackSelector, FileUploadArea, PageHeader },
  props: {
    projectId: {
      type: String,
      default: null
    }
  },
  setup(props) {
    const {
      errors, isSubmitting, submitAttempted,
      validateField, validateForm, clearErrors,
      hasErrors, hasError, getError
    } = useFormValidation();

    const router = useRouter();
    const userStore = useUserStore();
    const toast = useToast();

    const isEditMode = computed(() => !!props.projectId);
    const originalAttachments = ref([]); // 수정 시작 시의 원본 첨부파일 목록

    const formData = reactive({
      projectTitle: '',
      projectDescription: '',
      startDate: '',
      endDate: '',
      techStack: [],   // [{id/name or techStackName, recruitCount}]
      files: [],       // File 또는 {name,url,size,isExisting:true}
      recruitDeadline: '',
    });

    const partRows = ref([{ part: '', count: 1 }]);
    const partOptions = ref([]);
    
    const addPartRow = () => partRows.value.push({ part: '', count: 1 });
    const removePartRow = (idx) => partRows.value.splice(idx, 1);
    const totalRecruitCount = computed(() =>
        partRows.value.reduce((sum, r) => sum + (Number(r.count) || 0), 0)
    );

    const resetForm = () => {
      formData.projectTitle = '';
      formData.projectDescription = '';
      formData.startDate = '';
      formData.endDate = '';
      formData.techStack = [];
      formData.files = [];
      formData.recruitDeadline = '';
      partRows.value = [{ part: '', count: 1 }];
      originalAttachments.value = [];
      clearErrors();
      submitAttempted.value = false;
    };

    const stripDate = (d) => (d ? String(d).split('T')[0] : '');

    const loadTechPartOptions = async () => {
      try {
        const options = await loadPartOptions();
        partOptions.value = options;
      } catch (error) {
        console.error('파트 옵션 로드 실패:', error);
      }
    };

    onMounted(async () => {
      resetForm();
      await loadTechPartOptions();
      
      if (isEditMode.value) {
        getProject(props.projectId)
            .then(res => {
              const p = res.data;
              formData.projectTitle = p.title;
              formData.projectDescription = p.description;
              formData.recruitDeadline = stripDate(p.recruitDeadline);
              formData.startDate = stripDate(p.startDate);
              formData.endDate = stripDate(p.endDate);

              // 편집 모드: 서버 응답을 UI가 쓰는 형태로 안전 변환
              formData.techStack = (p.techStacks || []).map(t => ({
                id: t.techStackName,
                name: t.techStackName,
                recruitCount: Number(t.recruitCount ?? 0),
              }));

              partRows.value = (p.recruitmentParts || []).map(part => ({
                part: part.partName,
                count: part.recruitCount
              }));

              if (p.attachments && p.attachments.length > 0) {
                originalAttachments.value = p.attachments;
                formData.files = p.attachments.map(att => ({ ...att, isExisting: true }));
              }
            })
            .catch(e => {
              console.error('Failed to fetch project data for editing:', e);
              toast.error('프로젝트 정보를 불러오는데 실패했습니다.');
              router.back();
            });
      }
    });

    onActivated(() => {
      if (!isEditMode.value) {
        resetForm();
      }
    });

    const validationSchema = {
      projectTitle: ['required', { minLength: 5 }, { maxLength: 100 }],
      projectDescription: ['required', { minLength: 10 }],
      startDate: ['required'],
      endDate: ['required'],
      parts: ['parts'],
      techStack: ['techStack'],
      recruitDeadline: ['required'],
      files: []
    };

    const setRecruitDeadline = (unit, amount) => {
      const today = new Date();
      let targetDate = new Date(today);

      if (unit === 'day') {
        targetDate.setDate(today.getDate() + amount);
      } else if (unit === 'month') {
        targetDate.setMonth(today.getMonth() + amount);
      }

      const year = targetDate.getFullYear();
      const month = String(targetDate.getMonth() + 1).padStart(2, '0');
      const day = String(targetDate.getDate()).padStart(2, '0');
      
      formData.recruitDeadline = `${year}-${month}-${day}`;
    };

    // 업로드 호환용: 엘리먼트-UI, antd 등 {raw} / {originFileObj} 케이스 대응
    const asFile = (f) => (f instanceof File ? f : f?.raw || f?.originFileObj || null);

    const submitForm = async () => {
      const uid = userStore.userId;
      if (!uid && !isEditMode.value) {
        toast.warning('로그인 후에 프로젝트를 등록할 수 있습니다.');
        router.push('/login');
        return;
      }

      submitAttempted.value = true;
      if (!validateForm({ ...formData, parts: partRows.value }, validationSchema)) {
        toast.error('입력 내용을 다시 확인해주세요.');
        return;
      }

      isSubmitting.value = true;
      try {
        // 1) 첨부파일 정리
        const finalAttachments = [];

        for (const item of formData.files) {
          console.log('formData.files의 현재 item:', item);
          if (item?.isExisting) {
            // 기존 파일은 그대로 전달
            finalAttachments.push({
              name: item.name,
              url: item.url,
              size: item.size
            });
            continue;
          }

          const fileObj = asFile(item);
          console.log('asFile 변환 후 fileObj:', fileObj);
          if (!fileObj) continue;

          const { data } = await uploadProjectFile(fileObj); // axios 응답 {name,url,size}
          finalAttachments.push(data);
        }

        // 2) 기술스택 변환 (id/name/techStackName 어떤 형태든 받아서 서버 DTO로 통일)
        const techStacks = (formData.techStack || [])
            .map(s => ({
              techStackName: (s.techStackName ?? s.name ?? s.id ?? '').trim(),
              recruitCount: Number(s.recruitCount ?? 0),
            }))
            .filter(s => s.techStackName);

        // 3) 모집 파트 변환
        const parts = (partRows.value || [])
            .filter(r => r.part && r.part.trim() && Number(r.count) > 0)
            .map(r => ({
              partName: r.part.trim(),
              recruitCount: Number(r.count ?? 0)
            }));

        // 4) 최종 payload
        const projectData = {
          title: formData.projectTitle,
          description: formData.projectDescription,
          recruitDeadline: formData.recruitDeadline,
          startDate: formData.startDate,
          endDate: formData.endDate,
          status: 'RECRUITING',
          techStacks,
          recruitmentParts: parts,
          recruitCount: totalRecruitCount.value,
          attachments: finalAttachments
        };

        // 5) API 호출
        if (isEditMode.value) {
          await updateProject(props.projectId, projectData);
        } else {
          await createProject(projectData, uid);
        }

        toast.success(`프로젝트가 성공적으로 ${isEditMode.value ? '수정' : '등록'}되었습니다!`);

        if (isEditMode.value) {
          router.push(`/projects/${props.projectId}`);
        } else {
          router.push(`/projects`);
        }
      } catch (error) {
        console.error('Submission error:', error);
        toast.error(`프로젝트 ${isEditMode.value ? '수정' : '등록'} 중 오류가 발생했습니다.`);
      } finally {
        isSubmitting.value = false;
      }
    };

    return {
      formData, isEditMode,
      partOptions,
      partRows, addPartRow, removePartRow, totalRecruitCount,
      validationSchema,
      errors, isSubmitting, submitAttempted,
      hasErrors, hasError, getError,
      validateField, submitForm, resetForm,
      setRecruitDeadline
    };
  }
};
</script>

<style scoped>
.new-project-page {
  display: flex;
  width: 100%;
  min-height: 100vh;
  padding: 68px 20px 100px 20px;
  flex-direction: column;
  align-items: center;
  flex-shrink: 0;
  position: relative;
  background: var(--color-white-solid, #FFF);
}

/* 페이지 헤더 */
.page-header {
  width: 100%;
  max-width: 1110px;
  margin-bottom: 60px;
  text-align: center;
  position: relative;
}

.header-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  position: relative;
  padding: 50px 20px 40px 20px;
}

.title-section {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.page-title {
  font-size: 42px;
  font-weight: 700;
  color: var(--color-grey-15, #262626);
  margin: 0;
  letter-spacing: -1px;
  position: relative;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.title-underline {
  width: 80px;
  height: 4px;
  background: linear-gradient(90deg, #4CAF50 0%, #66BB6A 100%);
  border-radius: 2px;
  position: relative;
  animation: expandLine 1s ease-out;
}

.title-underline::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 12px;
  height: 12px;
  background: #4CAF50;
  border-radius: 50%;
  animation: pulse 2s infinite;
}

.page-subtitle {
  font-size: 18px;
  color: var(#8e8e8e);
  margin: 0;
  font-weight: 400;
  max-width: 600px;
  line-height: 1.6;
  opacity: 0;
  animation: fadeInUp 0.8s ease-out 0.3s forwards;
}

@keyframes expandLine {
  0% {
    width: 0;
  }
  100% {
    width: 80px;
  }
}

@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(76, 175, 80, 0.7);
  }
  70% {
    box-shadow: 0 0 0 8px rgba(76, 175, 80, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(76, 175, 80, 0);
  }
}

.form-container {
  display: flex;
  width: 100%;
  max-width: 1110px;
  min-height: auto;
  justify-content: center;
  align-items: flex-start;
  gap: 25px;
  flex-shrink: 0;
  position: relative;
}

.form-content {
  display: flex;
  width: 100%;
  max-width: 600px;
  flex-direction: column;
  align-items: flex-start;
  flex-shrink: 0;
  position: relative;
}

.form-section {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 20px;
  align-self: stretch;
  position: relative;
  margin-bottom: 80px;
  animation: fadeInUp 0.6s ease-out;
}

.section-title {
  font-weight: 700;
  font-size: 18px;
  color: #4CAF50;
}

.date-range-group {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
}
.date-range-group .input-group {
  flex: 1;
}
.date-separator {
  padding-bottom: 20px; /* 에러 메시지 공간 확보 */
}

.deadline-input {
  width: 100%;
  padding: 16px;
  border-radius: 8px;
  border: 2px solid var(--color-grey-85, #D9D9D9);
  background: #FFF;
  font-size: 15px;
  color: #262626;
  transition: all 0.2s;
}
.deadline-input:focus {
  border-color: #4CAF50;
  box-shadow: 0 0 0 3px rgba(76,175,80,0.08);
}
.deadline-input.error {
  border-color: #dc3545;
  box-shadow: 0 0 0 3px rgba(220,53,69,0.1);
}

.form-inputs {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 20px;
  align-self: stretch;
  position: relative;
}

.input-group {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  align-self: stretch;
  position: relative;
  gap: 8px;
}

.project-title-input,
.project-subtitle-input, 
.project-description-textarea {
  display: flex;
  padding: 16px;
  flex-direction: column;
  align-items: flex-start;
  align-self: stretch;
  border-radius: 8px;
  border: 2px solid var(--color-grey-85, #D9D9D9);
  background: var(--color-white-solid, #FFF);
  position: relative;
  font-size: 15px;
  color: var(--color-grey-15, #262626);
  transition: all 0.3s ease;
  outline: none;
}

.project-title-input:focus,
.project-subtitle-input:focus, 
.project-description-textarea:focus {
  border-color: #4CAF50;
  box-shadow: 0 0 0 3px rgba(76, 175, 80, 0.1);
  transform: translateY(-1px);
}

.project-title-input.error,
.project-subtitle-input.error,
.project-description-textarea.error {
  border-color: #dc3545;
  box-shadow: 0 0 0 3px rgba(220, 53, 69, 0.1);
}

.project-description-textarea {
  height: 500px;
  resize: vertical;
  min-height: 120px;
  max-height: 400px;
}

.project-title-input::placeholder,
.project-subtitle-input::placeholder, 
.project-description-textarea::placeholder {
  color: var(--color-grey-67, #AAA);
}

.duration-input-group {
  display: flex;
  align-items: center;
  gap: 10px;
  align-self: stretch;
  position: relative;
}

.duration-value-input {
  flex: 1;
  padding: 16px;
  border-radius: 8px;
  border: 2px solid var(--color-grey-85, #D9D9D9);
  background: var(--color-white-solid, #FFF);
  font-family: 'Lato', -apple-system, Roboto, Helvetica, sans-serif;
  font-size: 15px;
  color: var(--color-grey-15, #262626);
  transition: all 0.3s ease;
  outline: none;
}

.duration-value-input:focus {
  border-color: #4CAF50;
  box-shadow: 0 0 0 3px rgba(76, 175, 80, 0.1);
}

.duration-value-input.error {
  border-color: #dc3545;
  box-shadow: 0 0 0 3px rgba(220, 53, 69, 0.1);
}

.duration-unit-select {
  padding: 16px;
  border-radius: 8px;
  border: 2px solid var(--color-grey-85, #D9D9D9);
  background: var(--color-white-solid, #FFF);
  font-family: 'Lato', -apple-system, Roboto, Helvetica, sans-serif;
  font-size: 15px;
  color: var(--color-grey-15, #262626);
  transition: all 0.3s ease;
  outline: none;
  cursor: pointer;
}

.duration-unit-select:focus {
  border-color: #4CAF50;
  box-shadow: 0 0 0 3px rgba(76, 175, 80, 0.1);
}

.duration-unit-select.error {
  border-color: #dc3545;
  box-shadow: 0 0 0 3px rgba(220, 53, 69, 0.1);
}

.upload-section {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 20px;
  align-self: stretch;
  position: relative;
}

.upload-note {
  color: #4CAF50;
  font-size: 13px;
  font-weight: 400;
  line-height: 1.4;
  margin: 0;
  padding: 8px 12px;
  background: rgba(76, 175, 80, 0.1);
  border-radius: 4px;
  border-left: 3px solid #4CAF50;
}

.submit-section {
  display: flex;
  flex-direction: column;
  gap: 15px;
  padding-top: 40px;
  justify-content: center;
  align-items: center;
  align-self: stretch;
  border-top: 1px solid var(--color-grey-91, #E8E8E8);
  position: relative;
}

.submit-button {
  display: flex;
  width: 100%;
  max-width: 300px;
  padding: 15px 30px;
  justify-content: center;
  align-items: center;
  gap: 10px;
  border-radius: 8px;
  background: #4CAF50;
  border: none;
  color: var(--color-white-solid, #FFF);
  font-family: 'Lato', -apple-system, Roboto, Helvetica, sans-serif;
  font-size: 18px;
  font-weight: 700;
  line-height: 1.5;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 8px rgba(76, 175, 80, 0.2);
}

.submit-button:hover:not(.disabled) {
  background: #66BB6A;
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(76, 175, 80, 0.3);
}

.submit-button.disabled {
  background: var(#C0C0C0);
  cursor: not-allowed;
  box-shadow: none;
  transform: none;
}

.submit-loading {
  display: flex;
  align-items: center;
  gap: 10px;
}

.mini-spinner {
  border: 4px solid rgba(255, 255, 255, 0.3);
  border-top: 4px solid #FFF;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  animation: spin 1s linear infinite;
}

.form-error-summary {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 15px;
  border-radius: 6px;
  background-color: #ffebe9;
  color: #dc3545;
  font-family: 'Lato', -apple-system, Roboto, Helvetica, sans-serif;
  font-size: 14px;
  font-weight: 500;
  margin-top: 10px;
}

.form-error-summary i {
  font-size: 18px;
}

.error-message {
  color: #dc3545;
  font-size: 13px;
  margin-top: -5px; /* input-group gap에 의해 생기는 간격 조정 */
  align-self: flex-start; /* 왼쪽 정렬 */
  padding-left: 5px; /* 시각적 여백 */
}

/* 로딩 오버레이 */
.loading-overlay, .success-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.loading-spinner, .success-card {
  background: #FFF;
  padding: 40px 60px;
  border-radius: 12px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.spinner {
  border: 6px solid #f3f3f3;
  border-top: 6px solid #4CAF50;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  animation: spin 1s linear infinite;
}

.loading-text {
  color: var(--color-grey-15, #262626);
  font-size: 18px;
  font-weight: 600;
}

.success-icon {
  font-size: 60px;
  color: #28a745; /* Success green */
  margin-bottom: 10px;
}

.success-title {
  color: var(--color-grey-15, #262626);
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 25px;
}

.success-button {
  padding: 12px 25px;
  background: #4CAF50;
  border: none;
  border-radius: 6px;
  color: #FFF;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.success-button:hover {
  background: #66BB6A;
}

/* 반응형 헤더 */
@media (max-width: 768px) {
  .page-header {
    margin-bottom: 40px;
  }
  
  .header-content {
    padding: 40px 15px 30px 15px;
    gap: 16px;
  }
  
.page-title {
    font-size: 32px;
    letter-spacing: -0.5px;
  }
  
  .title-underline {
    width: 60px;
    height: 3px;
  }
  
  .title-underline::after {
    width: 10px;
    height: 10px;
  }
  
  .page-subtitle {
    font-size: 16px;
  }
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.input-group.with-presets {
  display: flex;
  align-items: center;
  gap: 16px;
}

.deadline-presets {
  display: flex;
  gap: 8px;
}

.preset-button {
  padding: 10px 14px;
  border-radius: 8px;
  border: 2px solid #D9D9D9;
  background: #f8f9fa;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.preset-button:hover {
  border-color: #4CAF50;
  background-color: #E8F5E9;
  color: #2E7D32;
}

.input-group.with-presets .deadline-input {
  flex: 1;
}

.parts-section { margin-top: -20px; }
.parts-card {
  width: 100%;
  border: 2px solid rgba(76,175,80,0.12);
  background: #FFF;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 4px 10px rgba(76,175,80,0.06);
}
.part-rows { display: flex; flex-direction: column; gap: 10px; }
.part-row {
  display: grid;
  grid-template-columns: 1fr auto auto;
  gap: 10px;
  align-items: center;
}
.row-left, .row-mid, .row-right { display: flex; align-items: center; gap: 8px; }
.part-select, .part-count {
  padding: 12px;
  border-radius: 8px;
  border: 2px solid #D9D9D9;
  background: #FFF;
  font-size: 14px;
  outline: none;
  transition: all .2s;
}
.part-select:focus, .part-count:focus { border-color: #4CAF50; box-shadow: 0 0 0 3px rgba(76,175,80,.1); }
.part-select.error, .part-count.error { border-color: #dc3545; box-shadow: 0 0 0 3px rgba(220,53,69,.08); }
.unit { color: #6f6f72; font-size: 14px; }
.row-remove {
  padding: 10px 12px;
  background: #f5f5f5;
  border: 1px solid #e5e5e5;
  border-radius: 8px;
  cursor: pointer;
}
.row-remove:hover { background: #efefef; }
.parts-actions {
  margin-top: 10px;
  display: flex; align-items: center; justify-content: space-between;
}
.add-row {
  padding: 10px 14px;
  background: #F7F7F8;
  border: 1px dashed #CFCFCF;
  border-radius: 8px;
  cursor: pointer;
}
.add-row:hover { background: #f1f1f1; }
.total-count { color: #262626; font-size: 14px; font-weight: 600; }

/* 반응형 */
@media (max-width: 640px) {
  .part-row { grid-template-columns: 1fr 1fr auto; }
}

</style>