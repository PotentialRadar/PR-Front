<template>
  <div class="project-header">
    <div class="project-tags">
      <div class="tag-container">
        <span class="tag status-tag">모집중</span>
      </div>
      <div class="registration-date">
        <span>2025.07.10</span>
      </div>
    </div>
    
    <div class="project-title">
      <h1>포토 키오스크 HW연동 모바일 사진 촬영 및 편집 app 개발</h1>
    </div>
    
    <div class="project-metadata">
      <div class="metadata-item">
        <div class="metadata-label">기간</div>
        <div class="metadata-value">
          <span class="number">60</span>
          <span class="unit">일</span>
        </div>
      </div>
      
      <div class="metadata-item">
        <div class="metadata-label">지원자수</div>
        <div class="metadata-value">
          <span class="number">14</span>
        </div>
      </div>
      
      <div class="metadata-item">
        <div class="metadata-label">마감일</div>
        <div class="metadata-value">
          <span class="deadline">D-15</span>
        </div>
      </div>
    </div>
    
    <div class="technology-tags">
      <span class="tech-label">관련기술</span>
      <div class="tech-tags">
        <span class="tech-tag">Flutter & Dart</span>
        <span class="tech-tag">React Native</span>
        <span class="tech-tag">Node.js</span>
        <span class="tech-tag">Swift</span>
        <span class="tech-tag">Python</span>
        <span class="tech-tag">JAVA</span>
        <span class="tech-tag">MySQL</span>
        <span class="tech-tag">MongoDB</span>
        <span class="tech-tag">제안 가능</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.project-header {
  width: 100%;
  background: #FFF;
  padding: 120px 0 0;
}

.project-tags {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  margin-bottom: 20px;
}

.tag-container {
  display: flex;
  align-items: center;
  gap: 5px;
}

.tag {
  padding: 8px 10px;
  border-radius: 100px;
  font-family: Lato, -apple-system, Roboto, Helvetica, sans-serif;
  font-size: 14px;
  font-weight: 400;
  line-height: 17px;
  color: #262626;
}

.employment-type {
  background: #EFEFEF;
}

.status-tag {
  background: #D6F6FD;
}

.registration-date span {
  color: #AAA;
  font-family: Lato, -apple-system, Roboto, Helvetica, sans-serif;
  font-size: 15px;
  font-weight: 400;
  line-height: 17px;
}

.project-title {
  margin-bottom: 15px;
}

.project-title h1 {
  color: #262626;
  font-family: Lato, -apple-system, Roboto, Helvetica, sans-serif;
  font-size: 23px;
  font-weight: 400;
  line-height: 28px;
  margin: 0;
}

.project-metadata {
  display: flex;
  gap: 15px;
  margin-bottom: 15px;
}

.metadata-item {
  display: flex;
  padding: 12px 10px;
  justify-content: center;
  align-items: center;
  flex: 1;
  border-radius: 3px;
  background: #F7F7F8;
}

.metadata-label {
  color: #262626;
  font-family: Lato, -apple-system, Roboto, Helvetica, sans-serif;
  font-size: 14px;
  font-weight: 400;
  line-height: 17px;
  margin-right: 10px;
}

.metadata-value {
  display: flex;
  align-items: center;
  gap: 2px;
}

.number {
  color: #262626;
  font-family: Inter, -apple-system, Roboto, Helvetica, sans-serif;
  font-size: 14px;
  font-weight: 700;
  line-height: 17px;
}

.unit {
  color: #262626;
  font-family: Inter, -apple-system, Roboto, Helvetica, sans-serif;
  font-size: 17px;
  font-weight: 700;
  line-height: 17px;
}

.deadline {
  color: #262626;
  font-family: Inter, -apple-system, Roboto, Helvetica, sans-serif;
  font-size: 15px;
  font-weight: 700;
  line-height: 17px;
}

.technology-tags {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.tech-label {
  color: #262626;
  font-family: Lato, -apple-system, Roboto, Helvetica, sans-serif;
  font-size: 12px;
  font-weight: 400;
  line-height: 15px;
  margin-right: 5px;
}

.tech-tags {
  display: flex;
  align-items: center;
  gap: 5px;
  flex-wrap: wrap;
}

.tech-tag {
  padding: 7px 9px;
  border-radius: 3px;
  border: 1px solid #E5E5E5;
  color: #262626;
  font-family: Lato, -apple-system, Roboto, Helvetica, sans-serif;
  font-size: 14px;
  font-weight: 400;
  line-height: 15px;
}
</style>
