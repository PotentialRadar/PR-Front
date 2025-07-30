<template>
  <footer class="app-footer">
    <div class="footer-content">
      <div class="footer-top">
        <div class="footer-nav">
          <a href="#" class="footer-link">프로젝트 소개</a>
          <a href="#" class="footer-link">팀원 소개</a>
          <!-- <a href="https://github.com/PotentialRadar" class="footer-link" target="_blank" rel="noopener">GitHub</a> -->
        </div>
        <div class="social-links">
          <a href="https://github.com/PotentialRadar" class="social-link" target="_blank" rel="noopener">
            <img src="/src/assets/icons/github-icon.png" alt="팀 GitHub 바로가기" />
          </a>
        </div>
      </div>
    </div>
    
    <div class="footer-bottom">
      <div class="footer-bottom-content">
        <div class="contact-info">
          <h3 class="contact-title">문의: teamkokkiri@gmail.com</h3>
          <div class="contact-details">
            <!-- <div class="detail-item">GitHub: github.com/our-team/pr-project</div> -->
          </div>
        </div>
        
        <div class="company-info">
          <div class="company-details">
            <span class="company-name">팀 PR (Potential Radar)</span>
            <span class="ceo">2025 KOSA 교육과정 팀 프로젝트</span>
            <span class="address">본 프로젝트는 비상업적 용도로 제작되었습니다.</span>
          </div>
        </div>
        
        <div class="copyright">
          ⓒ 2025 Potential Radar Team. All rights reserved.
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
</script>

<style scoped>
.app-footer {
  display: flex;
  width: 100%;
  padding-top: 1px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-top: 1px solid #E8E8E8;
  background: #FFF;
}

.footer-content {
  display: flex;
  width: 1080px;
  flex-direction: column;
  align-items: flex-start;
}

.footer-top {
  display: flex;
  width: 100%;
  height: 74px;
  justify-content: space-between;
  align-items: center;
  background: #FFF;
}

.footer-nav {
  display: flex;
  align-items: flex-end;
  gap: 54px;
}

.footer-link {
  color: #262626;
  text-align: center;
  font-size: 14px;
  font-weight: 400;
  line-height: 25.5px;
  text-decoration: none;
  padding: 20px 0;
}

.footer-link.highlight {
  font-weight: 600;
}

.footer-link:hover {
  color: #FF7D12;
}

.social-links {
  display: flex;
  align-items: flex-start;
  gap: 20px;
}

.social-link {
  display: flex;
  width: 37px;
  height: 37px;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
}

.social-link img {
  flex: 1 0 0;
  align-self: stretch;
}

.footer-bottom {
  display: flex;
  padding: 40px 0;
  justify-content: center;
  align-items: center;
  align-self: stretch;
  background: #555;
}

.footer-bottom-content {
  display: flex;
  width: 1080px;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
}

.contact-info {
  display: flex;
  align-items: flex-end;
  align-self: stretch;
  margin-bottom: 20px;
}

.contact-title {
  color: #FFF;
  font-size: 21px;
  font-weight: 700;
  line-height: 37.5px;
  margin: 0;
  margin-right: 8px;
}

.contact-details {
  display: flex;
  height: 18px;
  gap: 10px;
}

.detail-item {
  display: flex;
  height: 18px;
  padding-left: 9px;
  align-items: flex-start;
  border-left: 1px solid #AAA;
  color: #FFF;
  font-size: 16px;
  font-weight: 400;
  line-height: 16px;
  gap: 10px;
}

.detail-item:first-child {
  border-left: none;
  padding-left: 0;
}

.time {
  font-size: 17px;
}

.note {
  font-size: 12px;
}

.company-info {
  display: flex;
  padding: 20px 0 30px 0;
  flex-direction: column;
  align-items: flex-start;
  align-self: stretch;
}

.company-details {
  display: flex;
  align-items: flex-start;
  align-self: stretch;
  gap: 10px;
}

.company-details span {
  color: #FFF;
  font-size: 15px;
  font-weight: 400;
  line-height: 16px;
  padding-left: 9px;
  border-left: 1px solid #AAA;
}

.company-details span:first-child {
  border-left: none;
  padding-left: 0;
}

.copyright {
  display: flex;
  padding-bottom: 2.5px;
  align-items: flex-start;
  align-self: stretch;
  flex: 1 0 0;
  color: #AAA;
  font-size: 14px;
  font-weight: 400;
  line-height: 16px;
}
</style>
