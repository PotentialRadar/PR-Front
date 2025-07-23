<template>
  <div class="work-content">
    <div class="content-section">
      <div class="section-header">
        <h3>업무내용</h3>
      </div>
      
      <div class="content-text">
        <div class="content-block">
          <div class="block-title">※프로젝트의 진행 방식</div>
          <div class="block-content">
            <div class="content-line">- 최초 온/오프라인 미팅(협의 가능)</div>
            <div class="content-line">- 회사 위치 : 서울특별시 성동구</div>
            <div class="content-line">- 개인, 법인 ��업자 지원 희망합니다.</div>
            <div class="content-line">- 희망 프로젝트 시작일 : 협의 가능</div>
          </div>
        </div>

        <div class="content-block">
          <div class="block-title">※프로젝트의 현재 상황</div>
          <div class="block-content">
            <div class="content-line">- 신규 프로젝트입니다.</div>
            <div class="content-line">- 내부에 IT 커뮤니케이션이 가능한 인력이 있습니다.</div>
            <div class="content-line">- 자세한 요구사항은 미팅을 통해 전달 예정입니다.</div>
          </div>
        </div>

        <div class="content-block">
          <div class="block-title">※상세한 업무내용</div>
          <div class="block-content">
            <div class="sub-section">
              <div class="sub-title">+ 프로젝트 소개</div>
              <div class="content-line">- 자사는 포토 소프트웨어와 촬영 하드웨어를 직접 개발 및 생산하고 ODM 공급 서비스도 운영하고 있습니다.</div>
              <div class="content-line">- 현재 서비스 중인 B2B 타겟의 PC기반 포토 서비스를, B2C 타겟의 AI 기반 사진 편집 및 보정 모바일 앱(iOS/Android)으로 개발하려 합니다.</div>
              <div class="content-line">:: 사용자는 촬영한 사진을 앱에서 선택 후, 다양한 AI 필터 및 리터칭 기능을 통해 보정할 수 있어야 합니다.</div>
              <div class="content-line">:: 해당 앱은 QR코드 등을 통해 키오스크 기기와도 연동되어, 오프라인에서도 사진 출력 및 관리 기능이 제공되어야 합니다.</div>
              <div class="content-line">:: 또한, 운영자는 회원 및 사진 처리 내역 등을 관리할 수 있는 관리자 기능(앱 또는 별도 환경)을 통해 서비스를 통합적으로 운영할 수 있어야 합니다.</div>
              <div class="content-line">* 인생네컷(촬영 하드웨어) + 사진보정 app(스노우 AI)를 결합한 온/오프라인 연동 서비스 구축으로 간략히 설명</div>
            </div>

            <div class="sub-section">
              <div class="sub-title">+ 과업 분류</div>
              <div class="content-line">- 서비스 기획</div>
              <div class="content-line">- UI/UX 디자인</div>
              <div class="content-line">- DB 및 서버 구축</div>
              <div class="content-line">- 크로스 플랫폼 앱 개발</div>
            </div>

            <div class="sub-section">
              <div class="sub-title">+ 개발환경</div>
              <div class="content-line">- 미팅 시 기술 스택 협의 가능합니다.</div>
            </div>

            <div class="sub-section">
              <div class="sub-title">+ 주요 기능</div>
              <div class="content-line">- 사진 촬영, 불러오기, 편집</div>
              <div class="content-line indented">ㄴ AI 필터, 리터치 포함</div>
              <div class="content-line">- 회원관리</div>
              <div class="content-line">- QR 코드로 스마트폰 - 포토 HW 연동</div>
              <div class="content-line">- 로그인/회원가입</div>
              <div class="content-line">- 마이페이지</div>
              <div class="content-line">- 결제</div>
            </div>

            <div class="sub-section">
              <div class="content-line">※참고/유의 사항</div>
              <div class="content-line">- 미팅 시 전반적인 서비스 및 비지니스 협의 희망합니다.</div>
              <div class="content-line">- 사용자 친화적인 UI/UX 필수입니다.</div>
              <div class="content-line">- 유지보수 및 추가 기능 개발 관련 협의 가능합니다.</div>
            </div>

            <div class="sub-section">
              <div class="sub-title">※우대사항</div>
              <div class="content-line">- 포토 보정/수정앱, AI사진보정앱 관련 포트폴리오 있거나 원천 기술 가진 파트너사 우대합니다.</div>
              <div class="content-line">- 개발 이후 유지 보수 및 비지니스 협업 할 파트너사 원합니다.</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.work-content {
  padding: 60px 0;
  border-top: 1px solid #E8E8E8;
}

.section-header {
  margin-bottom: 24px;
}

.section-header h3 {
  color: #262626;
  font-family: Inter, -apple-system, Roboto, Helvetica, sans-serif;
  font-size: 17px;
  font-weight: 700;
  line-height: 20px;
  margin: 0;
}

.content-text {
  display: flex;
  flex-direction: column;
  gap: 40px;
}

.content-block {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.block-title {
  color: #262626;
  font-family: Inter, -apple-system, Roboto, Helvetica, sans-serif;
  font-size: 13px;
  font-weight: 700;
  line-height: 15px;
}

.block-content {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.sub-section {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.sub-title {
  color: #262626;
  font-family: Lato, -apple-system, Roboto, Helvetica, sans-serif;
  font-size: 15px;
  font-weight: 400;
  line-height: 24px;
}

.content-line {
  color: #262626;
  font-family: Lato, -apple-system, Roboto, Helvetica, sans-serif;
  font-size: 14px;
  font-weight: 400;
  line-height: 24px;
  margin-bottom: 0;
}

.content-line.indented {
  padding-left: 3px;
}
</style>
