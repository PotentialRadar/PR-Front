<template>
  <div class="contact-page">
    <div class="page-container">
      <div class="content-wrapper">
        <!-- Contact Header -->
        <div class="contact-header">
          <h1 class="page-title">문의하기</h1>
          <p class="page-subtitle">궁금한 점이나 프로젝트 관련 문의사항을 남겨주세요. 신속하게 답변드리겠습니다.</p>
        </div>

        <!-- Contact Form Section -->
        <div class="contact-section">
          <div class="section-header">
            <h2 class="section-title">문의 폼</h2>
          </div>
          
          <form class="contact-form" @submit.prevent="submitForm">
            <div class="form-group">
              <label class="form-label">이름 *</label>
              <input 
                type="text" 
                v-model="form.name" 
                class="form-input" 
                placeholder="이름을 입력해주세요"
                required
              />
            </div>

            <div class="form-group">
              <label class="form-label">이메일 *</label>
              <input 
                type="email" 
                v-model="form.email" 
                class="form-input" 
                placeholder="이메일을 입력해주세요"
                required
              />
            </div>

            <div class="form-group">
              <label class="form-label">연락처</label>
              <input 
                type="tel" 
                v-model="form.phone" 
                class="form-input" 
                placeholder="연락처를 입력해주세요"
              />
            </div>

            <div class="form-group">
              <label class="form-label">문의 유형 *</label>
              <select v-model="form.type" class="form-select" required>
                <option value="">문의 유형을 선택해주세요</option>
                <option value="project">프로젝트 문의</option>
                <option value="partnership">파트너십 문의</option>
                <option value="service">서비스 문의</option>
                <option value="support">기술 지원</option>
                <option value="other">기타</option>
              </select>
            </div>

            <div class="form-group">
              <label class="form-label">제목 *</label>
              <input 
                type="text" 
                v-model="form.subject" 
                class="form-input" 
                placeholder="문의 제목을 입력해주세요"
                required
              />
            </div>

            <div class="form-group">
              <label class="form-label">문의 내용 *</label>
              <textarea 
                v-model="form.message" 
                class="form-textarea" 
                placeholder="문의 내용을 자세히 작성해주세요"
                rows="8"
                required
              ></textarea>
            </div>

            <div class="form-notice">
              <p class="notice-text">
                * 개인정보 수집 및 이용에 동의합니다. 수집된 개인정보는 문의 응답 목적으로만 사용되며, 
                처리 완료 후 즉시 삭제됩니다.
              </p>
            </div>

            <div class="form-submit">
              <button type="submit" class="submit-button" :disabled="isSubmitting">
                <span v-if="!isSubmitting">문의하기</span>
                <span v-else>전송 중...</span>
              </button>
            </div>
          </form>
        </div>

        <!-- Contact Information Section -->
        <div class="contact-info-section">
          <div class="section-header">
            <h2 class="section-title">연락처 정보</h2>
          </div>
          
          <div class="info-grid">
            <div class="info-card">
              <div class="info-icon">
                <i class="bi bi-envelope"></i>
              </div>
              <div class="info-content">
                <h3 class="info-title">이메일</h3>
                <p class="info-detail">contact@freemoa.net</p>
                <p class="info-desc">24시간 이내 답변</p>
              </div>
            </div>

            <div class="info-card">
              <div class="info-icon">
                <i class="bi bi-telephone"></i>
              </div>
              <div class="info-content">
                <h3 class="info-title">전화</h3>
                <p class="info-detail">02-1234-5678</p>
                <p class="info-desc">평일 09:00 - 18:00</p>
              </div>
            </div>

            <div class="info-card">
              <div class="info-icon">
                <i class="bi bi-geo-alt"></i>
              </div>
              <div class="info-content">
                <h3 class="info-title">주소</h3>
                <p class="info-detail">서울특별시 성동구</p>
                <p class="info-desc">프리모아 본사</p>
              </div>
            </div>

            <div class="info-card">
              <div class="info-icon">
                <i class="bi bi-clock"></i>
              </div>
              <div class="info-content">
                <h3 class="info-title">운영시간</h3>
                <p class="info-detail">평일 09:00 - 18:00</p>
                <p class="info-desc">주말 및 공휴일 휴무</p>
              </div>
            </div>
          </div>
        </div>

        <!-- FAQ Section -->
        <div class="faq-section">
          <div class="section-header">
            <h2 class="section-title">자주 묻는 질문</h2>
          </div>
          
          <div class="faq-list">
            <div class="faq-item" v-for="(faq, index) in faqs" :key="index">
              <div class="faq-question" @click="toggleFaq(index)">
                <h3 class="question-text">{{ faq.question }}</h3>
                <i class="bi bi-chevron-down" :class="{ 'rotated': faq.open }"></i>
              </div>
              <div class="faq-answer" v-show="faq.open">
                <p class="answer-text">{{ faq.answer }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'

// Form data
const form = reactive({
  name: '',
  email: '',
  phone: '',
  type: '',
  subject: '',
  message: ''
})

const isSubmitting = ref(false)

// FAQ data
const faqs = ref([
  {
    question: '프로젝트 등록은 어떻게 하나요?',
    answer: '회원가입 후 프로젝트 등록 페이지에서 프로젝트 정보를 입력하시면 됩니다. 담당자가 검토 후 승인해드립니다.',
    open: false
  },
  {
    question: '파트너 등록 조건이 있나요?',
    answer: '관련 분야 경력이나 포트폴리오를 보유하신 분이면 누구나 파트너로 등록 가능합니다. 자세한 조건은 파트너 등록 페이지를 참고해주세요.',
    open: false
  },
  {
    question: '수수료는 어떻게 되나요?',
    answer: '프로젝트 성사 시 일정 비율의 수수료가 발생합니다. 자세한 수수료 정책은 이용약관을 참고해주세요.',
    open: false
  },
  {
    question: '계약은 어떻게 이루어지나요?',
    answer: '플랫폼에서 매칭 후, 클라이언트와 파트너 간 직접 계약을 체결하시면 됩니다. 필요시 계약서 템플릿을 제공해드립니다.',
    open: false
  }
])

// Methods
const submitForm = async () => {
  isSubmitting.value = true
  
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Show success message
    alert('문의가 성공적으로 전송되었습니다. 빠른 시일 내에 답변드리겠습니다.')
    
    // Reset form
    Object.keys(form).forEach(key => {
      form[key] = ''
    })
  } catch (error) {
    alert('문의 전송 중 오류가 발생했습니다. 다시 시도해주세요.')
  } finally {
    isSubmitting.value = false
  }
}

const toggleFaq = (index) => {
  faqs.value[index].open = !faqs.value[index].open
}
</script>

<style scoped>
.contact-page {
  min-height: 100vh;
  background: #FFF;
  padding-top: 68px; /* Header height offset */
}

.page-container {
  display: flex;
  justify-content: center;
  min-height: calc(100vh - 68px);
}

.content-wrapper {
  width: 1080px;
  padding: 60px 0 90px 0;
}

/* Contact Header */
.contact-header {
  text-align: center;
  margin-bottom: 80px;
}

.page-title {
  color: #262626;
  font-size: 32px;
  font-weight: 700;
  line-height: 40px;
  margin: 0 0 20px 0;
}

.page-subtitle {
  color: #555;
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
  margin: 0;
}

/* Section Styling */
.contact-section,
.contact-info-section,
.faq-section {
  margin-bottom: 80px;
}

.section-header {
  margin-bottom: 40px;
}

.section-title {
  color: #262626;
  font-size: 24px;
  font-weight: 700;
  line-height: 30px;
  margin: 0;
}

/* Contact Form */
.contact-form {
  max-width: 600px;
  margin: 0 auto;
}

.form-group {
  margin-bottom: 30px;
}

.form-label {
  display: block;
  color: #262626;
  font-size: 15px;
  font-weight: 600;
  line-height: 18px;
  margin-bottom: 10px;
}

.form-input,
.form-select,
.form-textarea {
  width: 100%;
  padding: 16px;
  border: 1px solid #E8E8E8;
  border-radius: 3px;
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  color: #262626;
  background: #FFF;
  transition: border-color 0.2s ease;
}

.form-input:focus,
.form-select:focus,
.form-textarea:focus {
  outline: none;
  border-color: #FF7D12;
}

.form-input::placeholder,
.form-textarea::placeholder {
  color: #AAA;
}

.form-textarea {
  resize: vertical;
  min-height: 120px;
}

.form-notice {
  margin-bottom: 30px;
  padding: 15px;
  background: #F7F7F8;
  border-radius: 3px;
}

.notice-text {
  color: #AAA;
  font-size: 12px;
  font-weight: 400;
  line-height: 18px;
  margin: 0;
}

.form-submit {
  text-align: center;
}

.submit-button {
  padding: 16px 40px;
  background: #FF7D12;
  color: #FFF;
  font-size: 16px;
  font-weight: 600;
  line-height: 20px;
  border: none;
  border-radius: 3px;
  cursor: pointer;
  transition: background-color 0.2s ease;
  min-width: 140px;
}

.submit-button:hover:not(:disabled) {
  background: #E66A00;
}

.submit-button:disabled {
  background: #AAA;
  cursor: not-allowed;
}

/* Contact Information */
.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 30px;
}

.info-card {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  padding: 24px;
  background: #F7F7F8;
  border-radius: 8px;
}

.info-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  background: #FF7D12;
  border-radius: 50%;
  color: #FFF;
  font-size: 20px;
  flex-shrink: 0;
}

.info-content {
  flex: 1;
}

.info-title {
  color: #262626;
  font-size: 16px;
  font-weight: 700;
  line-height: 20px;
  margin: 0 0 8px 0;
}

.info-detail {
  color: #262626;
  font-size: 15px;
  font-weight: 600;
  line-height: 18px;
  margin: 0 0 4px 0;
}

.info-desc {
  color: #AAA;
  font-size: 13px;
  font-weight: 400;
  line-height: 16px;
  margin: 0;
}

/* FAQ Section */
.faq-list {
  max-width: 800px;
  margin: 0 auto;
}

.faq-item {
  border-bottom: 1px solid #E8E8E8;
}

.faq-question {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24px 0;
  cursor: pointer;
  transition: color 0.2s ease;
}

.faq-question:hover {
  color: #FF7D12;
}

.question-text {
  color: inherit;
  font-size: 16px;
  font-weight: 600;
  line-height: 24px;
  margin: 0;
}

.faq-question i {
  color: #AAA;
  font-size: 16px;
  transition: transform 0.3s ease;
}

.faq-question i.rotated {
  transform: rotate(180deg);
}

.faq-answer {
  padding-bottom: 24px;
}

.answer-text {
  color: #555;
  font-size: 14px;
  font-weight: 400;
  line-height: 22px;
  margin: 0;
}

/* Responsive Design */
@media (max-width: 1120px) {
  .content-wrapper {
    width: 100%;
    padding-left: 20px;
    padding-right: 20px;
  }
}

@media (max-width: 768px) {
  .page-title {
    font-size: 28px;
    line-height: 36px;
  }
  
  .section-title {
    font-size: 20px;
    line-height: 26px;
  }
  
  .info-grid {
    grid-template-columns: 1fr;
  }
  
  .info-card {
    padding: 20px;
  }
}
</style>
