<template>
  <div class="project-header">
    <div class="project-tags">
      <div class="tag-container">
        <span class="tag status-tag">모집중</span>
        <span class="tag self-tag">#백엔드</span>
        <span class="tag self-tag">#프론트엔드</span>
        <span class="tag self-tag">#디자인</span>
        <span class="tag self-tag">#풀스택프로젝트</span>
      </div>
      <div class="registration-date">
        <span>2025.07.10</span>
      </div>
    </div>
    
    <div class="project-title">
      <h1>Spring, Vue 기반 프로젝트 멤버 구합니다</h1>
    </div>
    <div class="project-sub-title">
      스터디 하면서 프로젝트 진행할 예정입니다
    </div>

    <hr style="background: #eee; height:1px; border:0; margin: 40px 0">

    <div class="tag-title">
      이런 기술을 사용할 예정이에요
    </div>
    <div class="technology-tags">
      <span class="tech-label">백엔드</span>
      <div class="tech-tags">
        <span class="tech-tag">JAVA</span>
        <span class="tech-tag">Spring</span>
        <span class="tech-tag">Oracle</span>
        <span class="tech-tag">AWS S3</span>
      </div>
    </div>

    <div class="technology-tags">
      <span class="tech-label">프론트엔드</span>
      <div class="tech-tags">
        <span class="tech-tag">Vue.js</span>
        <span class="tech-tag">제안 가능</span>
      </div>
    </div>

    <div class="technology-tags">
      <span class="tech-label">디자인</span>
      <div class="tech-tags">
        <span class="tech-tag">Figma</span>
        <span class="tech-tag">제안 가능</span>
      </div>
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

.self-tag {
  background: #eee;
}

.registration-date span {
  color: #AAA;
  font-size: 15px;
  font-weight: 400;
  line-height: 17px;
}

.project-title {
  margin-bottom: 15px;
}

.project-title h1 {
  color: #262626;
  font-size: 24px;
  font-weight: 700;
  line-height: 28px;
  margin: 0;
}

.project-sub-title {
  font-size: 18px;
}

.project-metadata {
  display: flex;
  gap: 15px;
  margin: 50px 0 20px;
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
  font-size: 14px;
  font-weight: 700;
  line-height: 17px;
}

.unit {
  color: #262626;
  font-size: 17px;
  font-weight: 700;
  line-height: 17px;
}

.deadline {
  color: #262626;
  font-size: 15px;
  font-weight: 700;
  line-height: 17px;
}

.tag-title {
  font-size: 20px;
  font-weight: 700;
  padding: 0 0 10px;
}

.technology-tags {
  display: flex;
  /* align-items: flex-start;  <- 이 부분을 다음과 같이 변경합니다. */
  align-items: center; /* 라벨과 태그 그룹이 세로 중앙에 맞춰 정렬됩니다. */
  gap: 10px;
  flex-wrap: wrap;
  margin: 10px 0;
}

.tech-label {
  /* 고정 너비를 주어 모든 라벨의 시작점을 맞춥니다. */
  width: 70px; /* 적절한 너비로 조절하세요 (예: 60px, 70px, 80px 등) */
  flex-shrink: 0; /* 내용이 길어져도 줄어들지 않도록 함 */
  text-align: right; /* 라벨 텍스트를 오른쪽 정렬하여 태그와 가까이 붙임 */
  padding-right: 5px; /* 라벨과 태그 그룹 사이 미세 간격 추가 */
  color: #262626;
  font-size: 12px;
  font-weight: 400;
  line-height: 15px;
  /* margin-right: 5px; <- 이 부분은 gap으로 대체되므로 제거해도 됩니다. */
}

.tech-tags {
  display: flex;
  align-items: center;
  gap: 5px;
  flex-wrap: wrap;
  flex-grow: 1; /* 남은 공간을 채우도록 허용 */
}

.tech-tag {
  padding: 7px 9px;
  border-radius: 3px;
  border: 1px solid #E5E5E5;
  color: #262626;
  font-size: 14px;
  font-weight: 400;
  line-height: 15px;
}


</style>
