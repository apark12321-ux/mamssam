/* 맘쌤 — 광고 지면 · 인바운드 광고 문의 (부모 화면에만 노출, 아이 학습 화면은 광고 없음) */
(function () {
  /* ===== 설정: ID를 채우면 자동으로 해당 네트워크 광고가 붙습니다 ===== */
  const CFG = {
    adsense: '',                 // 예: 'ca-pub-1234567890123456'
    adfit: { home_top: '', home_mid: '', school: '', records: '' }, // 카카오 애드핏 광고단위 ID (320x100 / 320x50)
    coupang: '',                 // 쿠팡 파트너스 ID (교재 추천 링크용)
    ntfy: 'https://ntfy.sh/mamssam-ads-7f3k9q', // 광고 문의 알림 (휴대폰 ntfy 앱에서 이 토픽 구독)
    contact: 'ads@mamssam.kr'    // 광고 문의 메일 (없으면 폼만 사용)
  };
  const SB_URL = 'https://bjttfgoinspddtpsqseb.supabase.co/rest/v1/';
  const SB_KEY = 'sb_publishable_ceuUWQU_ry1sb4Aw1pjuBQ_6AU2H5vv';
  const MS = () => window.MS;
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const SLOTS = {
    home_top: { name: '홈 상단 배너', size: '가로 전체 × 100', where: '앱을 열면 가장 먼저 보이는 학부모 홈 화면, 오늘 수업 카드 바로 아래' },
    home_mid: { name: '홈 중간 카드', size: '카드형 (제목·설명·버튼)', where: '오늘 수업·우리 학교 카드 사이, 콘텐츠처럼 보이는 네이티브 지면' },
    school: { name: '우리 학교 페이지', size: '가로 전체 × 100', where: '급식·학사일정·시간표를 매일 확인하는 화면 하단' },
    records: { name: '학습 기록 페이지', size: '카드형', where: '정답률·오답 노트를 보는 화면 — 학습지·문제집·학원 광고와 궁합' },
    high_top: { name: '고등 홈 상단 배너', size: '가로 전체 × 100', where: '수능 D-day·플래너를 매일 여는 고등 홈 상단 — 인강·교재·학원' },
    high_consult: { name: '대입 컨설팅 카드', size: '카드형 (제목·설명·버튼)', where: '고등 홈·컨설팅 페이지의 네이티브 카드 — 입시 컨설팅·학원·과외 플랫폼' },
    guide: { name: '학습 가이드 (검색 유입)', size: '본문 중간 + 하단', where: '구글·네이버 검색으로 들어오는 단원별 학습 가이드 페이지' }
  };
  const PAGES = { home: ['home_top', 'home_mid'], school: ['school'], records: ['records'], high: ['high_top', 'high_consult'] };

  function sb(path, opt) { return fetch(SB_URL + path, Object.assign({ headers: { apikey: SB_KEY, Authorization: 'Bearer ' + SB_KEY, 'Content-Type': 'application/json', Prefer: (opt && opt.prefer) || '' } }, opt)).then(r => r.ok ? r.json().catch(() => []) : []).catch(() => []); }
  let direct = null, directAt = 0;
  function loadDirect() {
    if (direct && Date.now() - directAt < 10 * 60e3) return Promise.resolve(direct);
    return sb('mamssam_ads?select=*').then(rows => { direct = Array.isArray(rows) ? rows : []; directAt = Date.now(); return direct; });
  }
  function pick(list) { const t = list.reduce((s, a) => s + (a.weight || 1), 0); let r = Math.random() * t; for (const a of list) { r -= (a.weight || 1); if (r <= 0) return a; } return list[0]; }
  function hit(ad, slot, kind) { fetch(SB_URL + 'rpc/mamssam_ad_hit', { method: 'POST', headers: { apikey: SB_KEY, Authorization: 'Bearer ' + SB_KEY, 'Content-Type': 'application/json' }, body: JSON.stringify({ p_ad: ad.id, p_slot: slot, p_kind: kind }) }).catch(() => { }); }

  /* ---------- 지면 렌더 ---------- */
  function directHTML(ad, slot) {
    const card = /mid|records|consult/.test(slot);
    return `<a class="ad ad-direct ${card ? 'ad-card' : 'ad-bar'}" href="${esc(ad.link)}" target="_blank" rel="noopener sponsored" data-ad="${ad.id}" data-slot="${slot}">
      ${ad.img ? `<img src="${esc(ad.img)}" alt="" loading="lazy">` : ''}
      <span class="ad-t"><b>${esc(ad.title)}</b>${ad.body ? `<small>${esc(ad.body)}</small>` : ''}</span>
      <span class="ad-cta">${esc(ad.cta || '자세히 보기')}</span><span class="ad-tag">AD</span></a>`;
  }
  function houseHTML(slot) {
    const S = SLOTS[slot] || SLOTS.home_top; const card = /mid|records|consult/.test(slot);
    return `<a class="ad ad-house ${card ? 'ad-card' : 'ad-bar'}" href="#ads"><span class="ad-t"><b>📣 이 자리에 우리 브랜드를 알려 보세요</b><small>${esc(S.name)} · ${/high/.test(slot) ? '인강·교재·입시 컨설팅·학원 광고주를 위한 지면' : '학습지·교재·에듀테크 광고주를 위한 지면'}</small></span><span class="ad-cta">광고 안내</span></a>`;
  }
  function networkHTML(slot) {
    if (CFG.adsense) return `<ins class="adsbygoogle ad-net" style="display:block" data-ad-client="${CFG.adsense}" data-ad-format="auto" data-full-width-responsive="true"></ins>`;
    if (CFG.adfit[slot]) return `<ins class="kakao_ad_area ad-net" style="display:none" data-ad-unit="${CFG.adfit[slot]}" data-ad-width="320" data-ad-height="100"></ins>`;
    return '';
  }
  function ensureNet() {
    if (CFG.adsense && !document.getElementById('adsense-js')) { const s = document.createElement('script'); s.id = 'adsense-js'; s.async = true; s.crossOrigin = 'anonymous'; s.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=' + CFG.adsense; document.head.appendChild(s); }
    if (Object.values(CFG.adfit).some(Boolean) && !document.getElementById('adfit-js')) { const s = document.createElement('script'); s.id = 'adfit-js'; s.async = true; s.src = 'https://t1.daumcdn.net/kas/static/ba.min.js'; document.head.appendChild(s); }
  }
  function render(el, slot) {
    el.dataset.pending = '1';
    if (!direct && !networkHTML(slot)) el.innerHTML = houseHTML(slot);
    loadDirect().then(list => {
      delete el.dataset.pending; if (!el.isConnected) return;
      const mine = list.filter(a => a.slot === slot);
      if (mine.length) { const ad = pick(mine); el.innerHTML = directHTML(ad, slot); hit(ad, slot, 'imp'); return; }
      const net = networkHTML(slot);
      if (net) { el.innerHTML = net; ensureNet(); if (CFG.adsense) try { (window.adsbygoogle = window.adsbygoogle || []).push({}); } catch (e) { } return; }
      el.innerHTML = houseHTML(slot);
    });
  }
  function slotEl(slot) { const d = document.createElement('div'); d.className = 'ad-slot ad-' + slot; d.dataset.slot = slot; return d; }
  function mount(a) {
    const isHi = !!(window.HighApp && HighApp.isHigh());
    const page = isHi ? (a[0] === 'home' || a[0] === 'high' ? 'high' : a[0]) : (a[0] || 'home'); const slots = PAGES[page]; if (!slots) return;
    const app = document.getElementById('app'); if (!app) return;
    app.querySelectorAll('.ad-slot').forEach(s => { if (!s.firstElementChild && !s.dataset.pending) s.remove(); });
    if (app.querySelector('.ad-slot')) return;
    if (!isHi && MS() && MS().st && MS().st().kids.length && window.SubjApp && SubjApp.isStu && SubjApp.isStu()) return; // 중학생 본인 모드: 광고 없음
    slots.forEach(slot => {
      const el = slotEl(slot); let anchor = null;
      if (slot === 'home_top') anchor = app.querySelector('.tt-hero') || app.querySelector('.page-head');
      else if (slot === 'home_mid') anchor = app.querySelector('.sch-home') || app.querySelector('.sp-home');
      else if (slot === 'school') anchor = app.querySelector('#schCal');
      else if (slot === 'records') anchor = app.querySelector('.page-head');
      else if (slot === 'high_top') anchor = app.querySelector('.hi-hero') || (app.querySelector('.hi-consult-anchor') ? null : app.querySelector('.page-head'));
      else if (slot === 'high_consult') anchor = app.querySelector('.hi-consult-anchor');
      if (!anchor) return;
      anchor.insertAdjacentElement('afterend', el); render(el, slot);
    });
  }
  document.addEventListener('click', e => { const a = e.target.closest('.ad-direct'); if (a) hit({ id: +a.dataset.ad }, a.dataset.slot, 'clk'); });

  /* ---------- 광고 안내 페이지 (#ads) ---------- */
  function page() {
    const rows = Object.entries(SLOTS).map(([k, S]) => `<tr><td><b>${S.name}</b><br><span class="xs muted">${S.where}</span></td><td class="xs">${S.size}</td></tr>`).join('');
    const html = `<div class="page-head"><div><h1>📣 맘쌤 광고 안내</h1><div class="sub">초·중학생 자녀를 집에서 직접 가르치는 학부모가 매일 여는 앱입니다.</div></div></div>
      <div class="grid g2">
        <div class="card"><h2>누가 보나요</h2><ul class="ad-ul">
          <li><b>초1~중3 학부모</b> — 아이 학년·과목·교과서 출판사를 등록하고 매일 수업 진도를 관리합니다.</li>
          <li><b>높은 재방문</b> — 급식·학사일정·시간표·시험 D-day를 보러 아침마다 들어옵니다.</li>
          <li><b>구매 결정권자</b> — 학습지, 문제집, 온라인 학습, 학원을 직접 고르는 분들입니다.</li>
          <li><b>학년별 타겟팅</b> — 광고를 특정 학년·과목 이용자에게만 보여 줄 수 있습니다.</li></ul></div>
        <div class="card"><h2>이런 광고주에게 맞아요</h2><ul class="ad-ul">
          <li>학습지 · 방문·화상 교육 (무료 체험 신청)</li><li>문제집 · 참고서 · 교과서 출판사</li><li>에듀테크 앱 · 온라인 영어·수학</li><li>지역 학원 · 공부방 · 독서 논술</li><li>아동 도서 · 문구 · 학습 가구</li></ul></div>
      </div>
      <div class="card mt16"><h2>광고 지면</h2><table class="ad-table"><thead><tr><th>지면</th><th>형태</th></tr></thead><tbody>${rows}</tbody></table>
        <p class="xs muted mt8">아이가 문제를 풀고 영상을 보는 학습 화면에는 광고를 넣지 않습니다. 학부모가 보는 화면에만 노출되며, 지면당 광고는 한 개입니다.</p></div>
      <div class="card mt16"><h2>진행 방식</h2><ol class="ad-ol">
        <li><b>문의</b> — 아래 폼을 보내 주시면 1~2일 안에 현재 이용자 수·노출 수와 견적을 메일로 드립니다.</li>
        <li><b>소재 전달</b> — 제목 1줄 + 설명 1줄 + 링크 (배너 이미지는 선택). 소재 제작이 필요하면 무료로 도와드립니다.</li>
        <li><b>게재·리포트</b> — 월 단위 게재, 노출·클릭 리포트를 매주 보내 드립니다. 무료 체험 신청 등 성과 기준(CPA) 계약도 가능합니다.</li></ol></div>
      <div class="card mt16" id="adLead"><h2>광고 문의</h2>
        <form id="adForm" class="ad-form">
          <div class="form-grid">
            <div class="field"><label>회사·브랜드</label><input class="input" name="company" required maxlength="100" placeholder="예: ○○학습지"></div>
            <div class="field"><label>담당자</label><input class="input" name="contact" required maxlength="60"></div>
            <div class="field"><label>이메일</label><input class="input" name="email" type="email" required maxlength="120"></div>
            <div class="field"><label>연락처 <span class="xs muted">(선택)</span></label><input class="input" name="phone" maxlength="30" inputmode="tel"></div>
            <div class="field"><label>관심 지면</label><select class="input" name="slot"><option value="">아직 모르겠어요</option>${Object.entries(SLOTS).map(([k, S]) => `<option value="${k}" ${k === new URLSearchParams(location.hash.split('?')[1] || '').get('slot') ? 'selected' : ''}>${S.name}</option>`).join('')}<option value="all">전체 패키지</option></select></div>
            <div class="field"><label>월 예산</label><select class="input" name="budget"><option value="">미정</option><option>30만 원 이하</option><option>30~100만 원</option><option>100~300만 원</option><option>300만 원 이상</option><option>성과 기준(CPA) 희망</option></select></div>
          </div>
          <div class="field"><label>내용</label><textarea class="input" name="message" rows="4" maxlength="2000" placeholder="광고하려는 상품·서비스, 희망 기간, 타겟 학년 등을 적어 주세요"></textarea></div>
          <button class="btn btn-primary" type="submit">문의 보내기</button>
          <p class="xs muted mt8">입력하신 정보는 광고 상담 목적으로만 사용하며, 상담 종료 후 파기합니다.</p>
        </form></div>`;
    return MS().layout('ads', html);
  }
  document.addEventListener('submit', e => {
    if (e.target.id !== 'adForm') return; e.preventDefault();
    const f = e.target, btn = f.querySelector('button[type=submit]'); btn.disabled = true; btn.textContent = '보내는 중…';
    const d = {}; new FormData(f).forEach((v, k) => d[k] = String(v).trim()); d.device = (localStorage.getItem('ms_dev') || '');
    sb('mamssam_ad_leads', { method: 'POST', body: JSON.stringify(d), prefer: 'return=minimal' }).then(() => {
      // 알림에는 개인정보(이메일·연락처·내용)를 담지 않고, 상세는 Supabase mamssam_ad_leads 에서 확인
      try { if (CFG.ntfy) fetch(CFG.ntfy, { method: 'POST', headers: { Title: encodeURIComponent('맘쌤 광고 문의'), Priority: 'high', Tags: 'moneybag' }, body: `새 광고 문의가 들어왔어요 · 지면: ${d.slot || '-'} · 예산: ${d.budget || '-'}\nSupabase에서 확인하세요.` }).catch(() => { }); } catch (err) { }
      f.innerHTML = `<div class="empty"><div class="e-ico">✅</div><b>문의를 받았어요</b><p class="small muted mt8">${esc(d.email)}로 1~2일 안에 답변드릴게요. 감사합니다!</p></div>`;
    });
  });

  function after(a) { try { mount(a); } catch (e) { } }
  window.AdsApp = { page, after, CFG, SLOTS, _d: () => direct };
})();
