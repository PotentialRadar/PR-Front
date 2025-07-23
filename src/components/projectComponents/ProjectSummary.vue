<template>
  <div class="project-summary">
    <div class="summary-section">
      <div class="section-header">
        <h3>요약</h3>
      </div>
      
      <div class="summary-content">
        <div class="summary-item">
          <div class="summary-label">모집 마감일</div>
          <div class="summary-value">2025-08-07 D-15일</div>
        </div>
        
        <div class="summary-item">
          <div class="summary-label">예상 킥오프 일정</div>
          <div class="summary-value">미팅 시 협의 가능</div>
        </div>
        
        <div class="summary-item">
          <div class="summary-label">고용형태</div>
          <div class="summary-value">도급외주</div>
        </div>
        
        <div class="summary-item">
          <div class="summary-label">프로젝트 분야</div>
          <div class="summary-value">개발,디자인,기획</div>
        </div>
        
        <div class="summary-item">
          <div class="summary-label">진행 분류</div>
          <div class="summary-value">신규제작</div>
        </div>
        
        <div class="summary-item">
          <div class="summary-label">기획 상태</div>
          <div class="summary-value">기획 작성중</div>
        </div>
        
        <div class="summary-item">
          <div class="summary-label">미팅 희망 지역</div>
          <div class="summary-value">서울 성동구</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.project-summary {
  padding: 60px 0;
}

.section-header {
  padding-top: 50px;
  margin-bottom: 24px;
}

.section-header h3 {
  color: #262626;
  font-family: Inter, -apple-system, Roboto, Helvetica, sans-serif;
  font-size: 15px;
  font-weight: 700;
  line-height: 18px;
  margin: 0;
}

.summary-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.summary-item {
  display: flex;
  align-items: flex-start;
}

.summary-label {
  width: 220px;
  color: #262626;
  font-family: Lato, -apple-system, Roboto, Helvetica, sans-serif;
  font-size: 15px;
  font-weight: 400;
  line-height: 18px;
}

.summary-value {
  flex: 1;
  color: #262626;
  font-family: Inter, -apple-system, Roboto, Helvetica, sans-serif;
  font-size: 15px;
  font-weight: 700;
  line-height: 18px;
}
</style>
