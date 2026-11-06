/* 탑픽 — 공통 요소: 운영자 정보, 공통 푸터, 이용 안내(약관·개인정보), 인트로 로고 */
(function () {
  const BIZ = {
    service: '탑픽',
    name: '제니스앤코',   // 상호 (사명 변경 시 교체)
    ceo: '박예준',
    regNo: '',           // 사업자등록번호
    mailOrder: '',       // 통신판매업 신고번호
    address: '',
    email: '',
    privacyOfficer: ''
  };
  const bizLines = () => [BIZ.name && `상호 ${BIZ.name}`, BIZ.ceo && `대표 ${BIZ.ceo}`, BIZ.regNo && `사업자등록번호 ${BIZ.regNo}`, BIZ.mailOrder && `통신판매업 신고 ${BIZ.mailOrder}`, BIZ.address && `주소 ${BIZ.address}`, BIZ.email && `이메일 ${BIZ.email}`].filter(Boolean);
  const MS = () => window.MS;
  const logo = (color, w) => window.MS && MS().logo ? MS().logo(color, w) : '';

  function footer() {
    return `<footer class="site-foot">
      <span class="sf-links"><a href="#legal">이용약관 · 개인정보처리방침</a> · <a href="https://pickhub-kr.vercel.app/policy" target="_blank" rel="noopener">픽 시리즈 운영원칙</a> · <a href="#ads">광고·제휴 안내</a> · <a href="/guide/" target="_blank" rel="noopener">학습 가이드</a></span>
      <span class="sf-row"><span class="maker-logo">${logo('#3b3a9e', 18)}</span><span>${bizLines().length ? bizLines().join(' · ') + ' · ' : ''}정액 광고만 운영 · 모든 광고에 ‘광고’ 표기 · 나이스 교육정보 개방포털 공개 자료 사용</span></span>
    </footer>`;
  }

  function legal() {
    const contact = BIZ.email ? `이메일 ${BIZ.email}` : '설정 화면의 문의 기능';
    const html = `<div class="page-head"><div><h1>📄 이용 안내</h1><div class="sub">이용약관 · 개인정보처리방침 · 광고 표시 기준</div></div></div>
      <div class="card legal"><h2>이용약관</h2>
        <p>${BIZ.service}(이하 ‘서비스’)은 ${BIZ.name}가 운영하며, 초등 3학년부터 중학교 3학년까지의 학습자에게 진단, 심화·고난도 문항, 학습법, 학교 정보, 학습 기록 기능을 제공합니다.</p>
        <ul>
          <li>문항·해설·학습 자료는 서비스가 자체 제작한 참고 자료이며, 교과서·시험의 공식 자료가 아닙니다. 오류가 있을 수 있으므로 최종 확인은 교과서와 학교 안내를 기준으로 합니다.</li>
          <li>상위권 진단의 백분위와 숙련도 추정은 서비스 이용자 전체의 응답 분포를 바탕으로 한 추정치이며, 공식 평가 결과가 아닙니다.</li>
          <li>개념 영상은 유튜브 공식 플레이어로 재생되며 각 영상의 권리는 해당 채널에 있습니다.</li>
          <li>급식·학사일정·학급 시간표는 나이스 교육정보 개방포털 공개 자료이며, 학교 사정에 따라 실제와 다를 수 있습니다.</li>
          <li>서비스를 자동화된 수단으로 대량 수집하거나 제3자에게 재판매할 수 없습니다.</li>
          <li>외부 시스템(나이스, 유튜브, 데이터베이스)의 장애·점검으로 일부 기능이 일시 중단될 수 있습니다.</li>
        </ul>
        <h2>광고 표시 기준</h2>
        <ul>
          <li>정액 광고만 운영하며 모든 광고에 ‘AD’ 또는 ‘광고’를 표기합니다. 광고는 학부모 화면(과제·우리 학교·학습 기록)에만 노출되며 문항 풀이·영상 화면에는 노출되지 않습니다.</li>
          <li>광고는 문항 배정, 진단 결과, 학습 기록에 영향을 주지 않습니다.</li>
        </ul>
        <h2 id="privacy">개인정보처리방침</h2>
        <ul>
          <li>저장 위치: 학습자 이름(또는 별칭), 학년·학기, 학교·반, 학습 기록은 이용자의 기기(브라우저 저장소)에만 저장되며 서비스 서버로 전송되지 않습니다.</li>
          <li>서버 저장 항목: ① 학교 코드·학년·과목·교과서 출판사·기기 식별값(출판사 정보 공유 목적) ② 학년·단원·정오 여부 집계값(백분위 산출 목적, 개인 식별 불가) ③ 광고 문의 폼에 직접 입력한 회사·담당자·이메일·연락처(광고 상담 목적).</li>
          <li>보관 기간: ①②는 통계 목적으로 보관하며 개인을 식별하지 않습니다. ③은 상담 종료 후 지체 없이 파기합니다.</li>
          <li>처리 위탁·국외 이전: 데이터 보관 Supabase(서버 위치 대한민국 서울), 웹 서비스 운영 Vercel Inc.(미국, 접속 기록). 이용 시 네트워크로 전송됩니다.</li>
          <li>만 14세 미만 학습자의 개인정보는 서버에 저장하지 않으며, 기기 내 저장 정보는 보호자가 설정 화면에서 언제든 삭제할 수 있습니다.</li>
          <li>이용자는 설정 화면의 ‘데이터 초기화’로 기기 내 정보를 즉시 삭제할 수 있습니다. 서버 저장 항목의 삭제 요청: ${contact}.</li>
          <li>개인정보 보호책임자: ${BIZ.privacyOfficer || BIZ.ceo || BIZ.name}</li>
        </ul>
        <p class="xs muted">시행일 2026년 11월 5일</p>
      </div>`;
    return MS().layout('legal', html);
  }

  // 인트로 화면 로고
  function splash() {
    const el = document.getElementById('sLogo'); if (!el || el.firstChild) return;
    el.innerHTML = logo('#fff', 26);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', splash); else splash();
  setTimeout(splash, 0);

  window.SiteApp = { footer, legal, BIZ, bizLines };
})();
