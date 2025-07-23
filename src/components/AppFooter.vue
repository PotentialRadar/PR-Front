<template>
  <footer class="app-footer">
    <div class="footer-content">
      <div class="footer-top">
        <div class="footer-nav">
          <a href="#" class="footer-link">프리모아 스토리</a>
          <a href="#" class="footer-link">이용약관</a>
          <a href="#" class="footer-link highlight">개인정보취급방침</a>
          <a href="#" class="footer-link">자주 찾는 질문</a>
        </div>
        <div class="social-links">
          <a href="#" class="social-link">
            <img src="https://api.builder.io/api/v1/image/assets/TEMP/06a3b8cdc9a80ef07aae069b6f25084d1ad496f5?width=74" alt="페이스북" />
          </a>
          <a href="#" class="social-link">
            <img src="https://api.builder.io/api/v1/image/assets/TEMP/dd4bb14738672643bc1e99f30ecf5b4aee8fbff2?width=74" alt="네이버 포스트" />
          </a>
          <a href="#" class="social-link">
            <img src="https://api.builder.io/api/v1/image/assets/TEMP/e466a5868e9c9182003c01871898036d97cf8fc1?width=74" alt="네이버 블로그" />
          </a>
          <a href="#" class="social-link">
            <img src="https://api.builder.io/api/v1/image/assets/TEMP/5c85e72d6f37cb6f92b20ceebc82b8aff929ecd7?width=74" alt="카카오톡 채널" />
          </a>
          <a href="#" class="social-link">
            <img src="https://api.builder.io/api/v1/image/assets/TEMP/6b78267d3e0b023e7ca76056c2f331d689460a06?width=74" alt="유튜브" />
          </a>
        </div>
      </div>
    </div>
    
    <div class="footer-bottom">
      <div class="footer-bottom-content">
        <div class="contact-info">
          <h3 class="contact-title">고객센터 : 02-6497-3300</h3>
          <div class="contact-details">
            <div class="detail-item">
              <span class="time">월-금 10:00 - 17:00</span>
              <span class="note">* 공휴일 휴무</span>
            </div>
            <div class="detail-item">프리모아 협업 제안 : contact@freemoa.net</div>
          </div>
        </div>
        
        <div class="company-info">
          <div class="company-details">
            <span class="company-name">히어로하우�� 주식회사</span>
            <span class="ceo">대표 : 조재인</span>
            <span class="business-number">사업자등록번호 : 585-86-03332</span>
            <span class="address">서울특별시 강남구 선릉로86길 38, 7층 09에이(대치동)</span>
          </div>
        </div>
        
        <div class="copyright">
          Copyright 2024 Herohouse Inc., All rights reserved.
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
