/* 올배움 — 고등 맞춤 컨설팅: 대입 단계(수시·수능·정시) 판별, 전형 적합도 진단, 지원 전략, 과목 보완, 리포트 */
(function () {
  'use strict';
  const MS = () => window.MS;
  const HA = () => window.HighApp;
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const pad = (n) => String(n).padStart(2, '0');
  const ymd = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  const D = (s) => { const [y, m, d] = s.split('-').map(Number); return new Date(y, m - 1, d); };
  const today0 = () => { const t = new Date(); return new Date(t.getFullYear(), t.getMonth(), t.getDate()); };
  const dday = (s) => Math.round((D(s) - today0()) / 864e5);
  const md = (s) => `${+s.slice(5, 7)}/${+s.slice(8, 10)}`;
  const DAYN = ['일', '월', '화', '수', '목', '금', '토'];
  const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

  /* ---------- 대입 핵심 일정 ----------
     2027학년도는 대교협 '2027학년도 대입전형 기본사항'을 바탕으로 정리. 다른 학년도는 관례(수능 11월 셋째 목요일 등)로 추정하며 화면에 '예상'으로 표시. */
  const KEY = {
    2027: { exact: true, suneung: '2026-11-19', score: '2026-12-11', susiApply: ['2026-09-07', '2026-09-11'], susiEnd: '2026-12-17', susiAnnounce: '2026-12-18', susiExtra: ['2026-12-24', '2026-12-29'], susiReg: '2026-12-30', jsApply: ['2027-01-04', '2027-01-07'], jsAnnounce: '2027-02-05', jsExtra: ['2027-02-13', '2027-02-17'], src: '한국대학교육협의회 2027학년도 대입전형 기본사항' }
  };
  function keyDates(examYear) {
    if (KEY[examYear]) return KEY[examYear];
    const y = examYear - 1; const s = HA().suneungDate(new Date(y, 0, 1));
    const add = (d, n) => { const x = new Date(d); x.setDate(x.getDate() + n); return ymd(x); };
    const sep = new Date(y, 8, 1); const monSep = new Date(sep); monSep.setDate(1 + ((8 - sep.getDay()) % 7)); // 9월 첫 월요일
    const jan = new Date(y + 1, 0, 2); const monJan = new Date(jan); monJan.setDate(jan.getDate() + ((8 - jan.getDay()) % 7));
    return { exact: false, suneung: ymd(s), score: add(s, 22), susiApply: [ymd(monSep), add(monSep, 4)], susiEnd: add(s, 28), susiAnnounce: add(s, 29), susiExtra: [add(s, 35), add(s, 40)], susiReg: add(s, 41), jsApply: [ymd(monJan), add(monJan, 3)], jsAnnounce: add(monJan, 32), jsExtra: [add(monJan, 40), add(monJan, 44)], src: '관례 기준 예상 일정(매년 대교협 기본사항으로 확정)' };
  }

  /* ---------- 저장 ---------- */
  function prof() {
    const st = MS().st(), kid = MS().kid(); st.hi = st.hi || {}; const h = st.hi[kid.id] = st.hi[kid.id] || { plan: [], mock: [], pin: {}, goal: {} };
    h.prof = h.prof || { track: '', tier: '', naesin: '', grades: {}, setek: 3, act: 3, read: 3, consist: 3, essay: 0, interview: 0, pref: '균형', exams: [], susiDone: null, susiCards: [] };
    h.prof.exams = h.prof.exams || []; h.prof.grades = h.prof.grades || {}; h.prof.susiCards = h.prof.susiCards || [];
    return h;
  }
  const save = () => MS().save();

  /* ---------- 지금 단계(고3) ---------- */
  function stage(kid) {
    const g = kid.grade, ey = HA().examYear(kid), K = keyDates(ey), t = ymd(today0());
    const p = prof().prof;
    if (g === 12) {
      const susiDone = p.susiDone != null ? p.susiDone : t > K.susiApply[1];
      if (t < K.susiApply[0]) return { key: 'pre-susi', title: '수시 지원 준비', K, susiDone, left: [['수시 원서접수', K.susiApply[0]], ['수능', K.suneung]], do: ['희망 대학 6곳의 전형·수능 최저·대학별고사 일정을 어디가에서 확인', '학생부 마감 전 세특·활동 기록 점검(담임 확인)', '자기소개서 폐지 대학이 대부분. 면접 대비는 학생부 기반 예상 질문 20개 작성', '9월 모의평가로 최저 충족 가능성 판단 후 수시·정시 비중 결정'] };
      if (t <= K.susiApply[1]) return { key: 'susi', title: '수시 원서접수 중', K, susiDone, left: [['수시 접수 마감', K.susiApply[1]], ['수능', K.suneung]], do: ['6회 제한 확인(산업대·전문대·KAIST 등 일부 예외). 접수 완료 화면 저장', '대학별고사(논술·면접) 날짜가 겹치지 않는지 확인', '수능 최저 있는 대학은 모의고사 등급으로 충족 가능성 재점검'] };
      if (t < K.suneung) return { key: 'pre-csat', title: '수능 최종 정리 · 대학별고사 준비', K, susiDone, left: [['수능', K.suneung], ['수능 성적 발표', K.score], ['수시 합격자 발표', K.susiAnnounce]], do: ['수시 원서는 마감. 이제 수능 점수가 최저 충족과 정시의 전부', '새 문제보다 기출·EBS 연계 복습, 매주 같은 시간에 실전 모의고사 1회', '수능 전 실시하는 논술·면접이 있으면 날짜·장소·준비물 확인(아래 대학별고사에 등록)', '수험표 교부일·시험장 확인, 시험 당일 반입 금지 물품(스마트기기 등) 숙지', '생활 리듬을 수능 시간표(8:40 입실)에 맞추기'] };
      if (t === K.suneung) return { key: 'csat', title: '수능 당일', K, susiDone, left: [['수능 성적 발표', K.score]], do: ['답안 가채점용 표기는 시험지에만, 집에 와서 EBSi·평가원 정답으로 가채점', '가채점 결과로 수능 후 대학별고사 응시 여부 판단'] };
      if (t <= K.score) return { key: 'post-csat', title: '가채점 · 대학별고사(논술·면접) 응시', K, susiDone, left: [['수능 성적 발표', K.score], ['수시 합격자 발표', K.susiAnnounce], ['정시 원서접수', K.jsApply[0]]], do: ['가채점 등급으로 수능 최저 충족 여부 판단 → 최저 미충족 대학의 대학별고사는 과감히 정리', '정시로 더 좋은 대학이 가능하면 수시 대학별고사 응시 여부 재검토(수시 합격 시 정시 지원 불가)', '논술·면접 일정표(아래)에 날짜 등록, 전날 고사장 동선 확인', '정시 지원 참고용으로 입시 기관 가채점 예상 등급컷은 참고만, 확정은 12/11 성적표'] };
      if (t < K.susiAnnounce) return { key: 'score', title: '수능 성적 확정 · 수시 발표 대기 · 정시 전략', K, susiDone, left: [['수시 합격자 발표', K.susiAnnounce], ['정시 원서접수', K.jsApply[0]]], do: ['성적표의 표준점수·백분위·등급으로 군별(가·나·다) 지원 조합 3개 만들기', '대학별 반영 비율(표준점수 vs 백분위, 탐구 변환표준점수)을 어디가·입학처에서 확인', '수시 추가합격(미등록 충원) 가능성도 염두에 두고 정시 플랜 B 준비'] };
      if (t <= K.susiReg) return { key: 'susi-result', title: '수시 결과 · 추가합격 · 정시 지원 전략', K, susiDone, left: [['수시 미등록 충원 마감', K.susiExtra[1]], ['정시 원서접수', K.jsApply[0]]], do: ['수시 합격(추가합격 포함)이면 정시 지원 불가. 등록 기한을 놓치지 않기', '불합격이면 정시 3장(가·나·다군) 상향·적정·안정으로 확정', '충원 합격 전화·문자를 놓치지 않도록 연락처 확인'] };
      if (t < K.jsApply[0]) return { key: 'pre-js', title: '정시 원서접수 준비', K, susiDone, left: [['정시 원서접수', K.jsApply[0]], ['정시 합격자 발표', K.jsAnnounce]], do: ['군별 지원 대학 확정, 원서접수 사이트 회원가입·결제 수단 미리 준비', '모집 요강의 전형 일정(면접·실기 여부) 확인'] };
      if (t <= K.jsApply[1]) return { key: 'js', title: '정시 원서접수 중', K, susiDone, left: [['정시 접수 마감', K.jsApply[1]], ['정시 합격자 발표', K.jsAnnounce]], do: ['가·나·다군 각 1회. 접수 완료 화면 저장', '대학별 접수 마감 시각이 다름(보통 17~18시)'] };
      if (t <= K.jsExtra[1]) return { key: 'js-result', title: '정시 발표 · 추가합격 · 등록', K, susiDone, left: [['정시 합격자 발표', K.jsAnnounce], ['정시 미등록 충원 마감', K.jsExtra[1]]], do: ['합격 시 등록 기간 안에 등록금 납부(미등록 시 합격 취소)', '추가 모집(2월 말)은 미충원 대학만 실시. 입학처 공지 확인'] };
      return { key: 'done', title: '대입 마무리 · 추가 모집', K, susiDone, left: [], do: ['추가 모집 공고(2월 말) 확인', '등록 후 기숙사·장학금(국가장학금 신청) 안내 확인'] };
    }
    // 고1·고2: 학기 흐름
    const m = new Date().getMonth() + 1;
    const next = (mm, dd) => { const y = new Date().getFullYear() + (mm < m ? 1 : 0); return `${y}-${pad(mm)}-${pad(dd)}`; };
    const base = { K, susiDone: null };
    if (m <= 2) return Object.assign(base, { key: 'winter', title: '겨울방학 · 다음 학년 준비', left: [['3월 학력평가', next(3, 25)]], do: ['다음 학년 선택과목·진로 방향 확정', '국어·수학 개념 1회독, 영어 절대평가 90점 안정권 만들기', '독서 2권 + 진로 탐구 1건 정리'] });
    if (m <= 4) return Object.assign(base, { key: 'spring', title: '1학기 중간고사 준비', left: [['1학기 중간고사', next(4, 25)], ['6월 학력평가', next(6, 5)]], do: ['시험 범위 교과서·수업 자료 2회독, 수행평가 일정 달력에 정리', '세특: 수업마다 질문·발표·보고서 1개 이상 남기기'] });
    if (m <= 6) return Object.assign(base, { key: 'early-summer', title: '6월 학평 · 1학기 기말 준비', left: [['6월 학력평가', next(6, 5)], ['1학기 기말고사', next(7, 5)]], do: ['6월 학평으로 수능형 문제 시간 관리 연습', '기말 뒤 학생부 기록 확인(담임 상담)'] });
    if (m <= 8) return Object.assign(base, { key: 'summer', title: '여름방학 · 비교과·독서·약점 보완', left: [['9월 학력평가', next(9, 3)]], do: ['약한 과목 1개 집중 보완(매일 60분)', '진로 관련 탐구 보고서·독서 기록 정리', '고2라면 희망 대학 3곳 전형 구조 미리 보기(어디가)'] });
    if (m <= 10) return Object.assign(base, { key: 'fall', title: '2학기 중간고사 · 10월 학평', left: [['2학기 중간고사', next(10, 10)], ['11월 학력평가', next(11, 20)]], do: ['내신 관리 + 모의고사 등급 추이 기록', '동아리·자율 활동을 진로 주제로 연결'] });
    return Object.assign(base, { key: 'late', title: '11월 학평 · 2학기 기말 · 학년 마무리', left: [['11월 학력평가', next(11, 20)], ['2학기 기말고사', next(12, 15)]], do: ['기말 뒤 학생부 최종 점검', '겨울방학 계획: 수능 개념 완성 + 선택과목 결정'] });
  }

  /* ---------- 홈 '지금 단계' 카드 ---------- */
  function stageCard(kid) {
    const s = stage(kid), p = prof().prof;
    const exams = p.exams.slice().sort((a, b) => a.date.localeCompare(b.date)).filter(e => dday(e.date) >= -1);
    const left = s.left.map(([n, d]) => { const k = dday(d); return `<div class="st-left"><b>${k === 0 ? 'D-DAY' : k > 0 ? 'D-' + k : 'D+' + (-k)}</b><span>${esc(n)}<small>${md(d)} (${DAYN[D(d).getDay()]})</small></span></div>`; }).join('');
    const ex = exams.slice(0, 3).map(e => { const k = dday(e.date); return `<div class="st-left ex"><b>${k === 0 ? 'D-DAY' : k > 0 ? 'D-' + k : '완료'}</b><span>${esc(e.univ)} ${esc(e.type)}<small>${md(e.date)}</small></span></div>`; }).join('');
    const flags = kid.grade === 12 ? `<div class="st-flags">${[['수시 원서', s.susiDone ? '지원 완료' : '접수 전', s.susiDone], ['대학별고사', p.exams.length ? `${p.exams.length}건 등록` : '미등록', !!p.exams.length], ['수능', dday(s.K.suneung) > 0 ? `D-${dday(s.K.suneung)}` : '응시 완료', dday(s.K.suneung) <= 0], ['정시', dday(s.K.jsApply[0]) > 0 ? `${md(s.K.jsApply[0])} 접수` : '진행', dday(s.K.jsApply[1]) < 0]].map(([n, v, on]) => `<span class="st-flag ${on ? 'on' : ''}">${n} · ${v}</span>`).join('')}</div>` : '';
    return `<div class="card st-card"><div class="card-head"><h2>📍 지금 단계 · ${esc(s.title)}</h2><a class="more" href="#high/consult">맞춤 컨설팅 ›</a></div>
      ${flags}
      <div class="st-lefts">${left}${ex}</div>
      <ul class="st-do">${s.do.slice(0, 3).map(t => `<li>${esc(t)}</li>`).join('')}</ul>
      <div class="row" style="gap:6px;flex-wrap:wrap"><a class="btn btn-sm btn-primary" href="#high/consult">전체 체크리스트</a>${kid.grade === 12 ? '<button class="btn btn-sm" data-act="cnExamAdd">+ 논술·면접 일정</button>' : ''}</div>
      <p class="xs muted mt8">${s.K.exact ? s.K.src + ' 기준' : '관례 기준 예상 일정 · 매년 3월 대교협 기본사항으로 확정'} · 대학별 일정은 각 입학처 공지가 우선</p></div>`;
  }

  /* ---------- 진단 엔진 ---------- */
  const TRACKS = ['인문', '사회·상경', '자연', '공학', '의약', '교육·사범', '예체능'];
  const TIERS = [['최상위', '서울 최상위권'], ['상위', '인서울 상위 · 거점 국립'], ['중상위', '수도권 · 지역 주요 사립'], ['중위', '지역 대학 · 전문대 상위'], ['제한없음', '목표 미정']];
  const TARGET = { 최상위: 1, 상위: 2, 중상위: 3, 중위: 4, 제한없음: 0 };
  const W = { '인문': { kor: .3, math: .2, eng: .2, tam: .3 }, '사회·상경': { kor: .25, math: .3, eng: .2, tam: .25 }, '자연': { kor: .2, math: .35, eng: .15, tam: .3 }, '공학': { kor: .15, math: .4, eng: .15, tam: .3 }, '의약': { kor: .2, math: .35, eng: .15, tam: .3 }, '교육·사범': { kor: .3, math: .25, eng: .25, tam: .2 }, '예체능': { kor: .35, math: .1, eng: .3, tam: .25 } };
  const SUBN = { kor: '국어', math: '수학', eng: '영어', his: '한국사', tam: '탐구' };
  const gS = (g, scale) => g ? clamp(Math.round((scale === 5 ? (6 - g) / 5 : (10 - g) / 9) * 100), 0, 100) : null;
  function latestMock() { const h = prof(); const rows = h.mock.slice().sort((a, b) => a.date.localeCompare(b.date)); return rows[rows.length - 1] || null; }
  function mockTrend() { const h = prof(); const rows = h.mock.slice().sort((a, b) => a.date.localeCompare(b.date)); if (rows.length < 2) return 0; const avg = r => { const v = ['kor', 'math', 'eng'].map(k => r.g[k]).filter(Boolean); return v.length ? v.reduce((a, b) => a + b, 0) / v.length : null; }; const a = avg(rows[rows.length - 2]), b = avg(rows[rows.length - 1]); return a && b ? Math.round((a - b) * 10) / 10 : 0; }
  function grades(p) { const m = latestMock(); const g = Object.assign({}, m ? m.g : {}, p.grades); const tam = [g.soc, g.sci].filter(Boolean); return { kor: g.kor, math: g.math, eng: g.eng, his: g.his, tam: tam.length ? Math.min(...tam) : (g.tam || null), soc: g.soc, sci: g.sci }; }
  function diagnose(kid) {
    const p = prof().prof; const track = p.track || '인문'; const w = W[track]; const scale = kid.grade >= 11 ? 5 : 9; // 2025년 입학생(고2 이하)부터 5등급제
    const naeS = gS(+p.naesin, scale);
    const g = grades(p); const parts = ['kor', 'math', 'eng', 'tam'].map(k => ({ k, w: w[k], s: gS(g[k], 9) })).filter(x => x.s != null);
    const wsum = parts.reduce((a, x) => a + x.w, 0); const mockS = parts.length ? Math.round(parts.reduce((a, x) => a + x.w * x.s, 0) / wsum) : null;
    const nonS = Math.round(((+p.setek + +p.act + +p.read + +p.consist) / 20) * 100);
    const trend = mockTrend();
    // 수능 최저 충족 추정: 상위권 기준 '2개 합 5' 수준 ≒ 주요 3과목 평균 2.5등급
    const core = ['kor', 'math', 'eng'].map(k => g[k]).filter(Boolean); const coreAvg = core.length ? core.reduce((a, b) => a + b, 0) / core.length : null;
    const minOK = coreAvg == null ? null : coreAvg <= 2.5 ? 2 : coreAvg <= 3.5 ? 1 : 0; // 2 충족 여유, 1 경계, 0 어려움
    const fits = [];
    if (naeS != null) fits.push({ k: '학생부교과', s: Math.round(naeS * .8 + (minOK == null ? 10 : minOK * 10)), why: `내신 ${p.naesin}등급(${scale}등급제) 반영 + 수능 최저 ${minOK == null ? '미확인' : ['충족 어려움', '경계', '충족 여유'][minOK]}` });
    if (naeS != null) fits.push({ k: '학생부종합', s: Math.round(naeS * .45 + nonS * .45 + (+p.consist / 5) * 10), why: `내신 ${p.naesin}등급 + 비교과(세특·활동·독서·일관성) ${nonS}점` });
    if (mockS != null) fits.push({ k: '논술', s: Math.round(mockS * .5 + (+p.essay / 3) * 30 + (naeS != null ? (100 - naeS) * .2 : 10)), why: `수능(최저) ${mockS}점 + 논술 준비 ${['안 함', '기초', '꾸준히', '실전'][+p.essay]}${naeS != null && naeS < mockS ? ' · 내신보다 수능이 강해 논술 유리' : ''}` });
    if (mockS != null) fits.push({ k: '정시(수능)', s: clamp(Math.round(mockS * .85 + 15 + trend * 8), 0, 100), why: `모의고사 가중 ${mockS}점${trend ? (trend > 0 ? ` · 최근 ${trend}등급 상승 추세` : ` · 최근 ${-trend}등급 하락`) : ''}` });
    fits.sort((a, b) => b.s - a.s);
    const type = naeS == null || mockS == null ? '자료 부족' : naeS - mockS > 12 ? '내신형' : mockS - naeS > 12 ? '수능형' : '균형형';
    // 현실 점검
    const tgt = TARGET[p.tier] || 0; const best = Math.max(naeS || 0, mockS || 0);
    const need = { 1: 88, 2: 75, 3: 62, 4: 48 }[tgt] || 0;
    const realism = !tgt ? null : best >= need ? 'ok' : best >= need - 12 ? 'stretch' : 'gap';
    // 과목 우선순위
    const target = tgt || (coreAvg ? Math.max(1, Math.floor(coreAvg) - 1) : 2);
    const prio = ['kor', 'math', 'eng', 'tam', 'his'].filter(k => g[k]).map(k => ({ k, n: SUBN[k], g: g[k], gap: Math.max(0, g[k] - (k === 'his' ? 1 : target)), w: k === 'his' ? .05 : w[k] })).map(x => Object.assign(x, { score: x.gap * x.w * 100 })).sort((a, b) => b.score - a.score);
    // 포트폴리오
    const port = portfolio(type, fits, p, minOK);
    return { p, track, scale, naeS, mockS, nonS, trend, minOK, fits, type, realism, prio, port, g, coreAvg };
  }
  function portfolio(type, fits, p, minOK) {
    const f = Object.fromEntries(fits.map(x => [x.k, x.s]));
    const susi = { '학생부교과': 0, '학생부종합': 0, '논술': 0 };
    const keys = Object.keys(susi).filter(k => f[k] != null);
    if (keys.length) { const tot = keys.reduce((a, k) => a + Math.max(f[k], 20), 0); let left = 6; keys.sort((a, b) => f[b] - f[a]).forEach((k, i) => { const n = i === keys.length - 1 ? left : Math.round(6 * Math.max(f[k], 20) / tot); susi[k] = clamp(n, 0, left); left -= susi[k]; }); if (left > 0) susi[keys[0]] += left; }
    if (p.pref === '정시') { Object.keys(susi).forEach(k => susi[k] = Math.max(0, susi[k] - 1)); }
    const mix = type === '수능형' ? [3, 2, 1] : type === '내신형' ? [1, 3, 2] : [2, 2, 2];
    const js = p.pref === '수시' ? ['상향', '적정', '안정'] : type === '수능형' ? ['상향', '상향·적정', '안정'] : ['적정', '적정', '안정'];
    const notes = [];
    if (minOK === 0) notes.push('수능 최저가 있는 교과·논술 전형은 충족이 어려울 수 있어 최저 없는 전형 비중을 높이는 것이 안전합니다.');
    if (type === '수능형') notes.push('정시가 든든한 편이라 수시는 상향 위주로 써도 됩니다. 단, 수시 합격 시 정시 지원이 막히므로 "붙으면 갈 곳"만 지원하세요.');
    if (type === '내신형') notes.push('내신이 강점이라 교과·종합 전형 중심. 정시는 안정 카드로 두고 최저 충족에 집중하세요.');
    if (p.pref === '수시') notes.push('수시 집중 선택. 6장 중 안정 2장은 반드시 확보하세요.');
    return { susi, mix, js, notes };
  }

  /* ---------- 액션 플랜 ---------- */
  function actions(kid, d) {
    const s = stage(kid); const out = [];
    s.do.forEach((t, i) => out.push({ subj: 'etc', title: t.length > 40 ? t.slice(0, 38) + '…' : t, days: i < 2 ? 0 : 1 }));
    d.prio.slice(0, 3).forEach((x, i) => { const k = x.k === 'tam' ? (d.g.sci && (!d.g.soc || d.g.sci >= d.g.soc) ? 'sci' : 'soc') : x.k; const S = (HA().SUBJ_H || []).find(s => s.k === k); const tip = S ? S.pts[i % S.pts.length] : `${x.n} 기출 1회분`; out.push({ subj: k, title: `${x.n} ${x.g}→${Math.max(1, x.g - 1)}등급: ${tip.length > 34 ? tip.slice(0, 32) + '…' : tip}`, days: 2 + i }); });
    if (kid.grade === 12 && d.p.exams.length) d.p.exams.forEach(e => { if (dday(e.date) > 0) out.push({ subj: 'etc', title: `${e.univ} ${e.type} 준비(기출·예상 질문)`, days: Math.max(1, Math.min(dday(e.date) - 1, 5)) }); });
    return out.slice(0, 10);
  }

  /* ---------- 화면 ---------- */
  const bar = (s, c) => `<div class="cn-bar"><i style="width:${clamp(s, 0, 100)}%;background:${c || 'var(--sc,#1F2A44)'}"></i></div>`;
  function page(a) {
    const kid = MS().kid(); const sub = a[2];
    if (sub === 'profile') return profilePage(kid);
    if (sub === 'report') return reportPage(kid);
    return hub(kid);
  }
  function hub(kid) {
    const s = stage(kid), p = prof().prof, d = diagnose(kid);
    const ready = !!(p.track && (p.naesin || d.mockS != null));
    const exams = p.exams.slice().sort((a, b) => a.date.localeCompare(b.date));
    return MS().layout('high/consult', `<div class="hi">
      <div class="page-head"><div><h1>맞춤 컨설팅</h1><div class="sub">지금 단계 체크리스트 · 전형 적합도 진단 · 지원 전략 · 과목 보완 · 리포트</div></div></div>
      <div class="card st-card"><div class="card-head"><h2>📍 ${esc(s.title)}</h2><span class="xs muted">${kid.grade === 12 ? HA().examYear(kid) + '학년도' : GL(kid.grade)}</span></div>
        <div class="st-lefts">${s.left.map(([n, dt]) => { const k = dday(dt); return `<div class="st-left"><b>${k === 0 ? 'D-DAY' : k > 0 ? 'D-' + k : 'D+' + (-k)}</b><span>${esc(n)}<small>${md(dt)} (${DAYN[D(dt).getDay()]})</small></span></div>`; }).join('')}</div>
        <div class="small bold mt8">이 단계에서 꼭 할 것</div><ul class="st-do">${s.do.map(t => `<li>${esc(t)}</li>`).join('')}</ul>
        ${kid.grade === 12 ? `<div class="row mt8" style="gap:8px;flex-wrap:wrap"><label class="chip ${s.susiDone ? 'on' : ''}"><input type="checkbox" data-act="cnSusi" ${s.susiDone ? 'checked' : ''} style="margin-right:6px">수시 원서 지원 완료</label><button class="btn btn-sm" data-act="cnExamAdd">+ 논술·면접·실기 일정</button></div>` : ''}
        ${exams.length ? `<div class="list mt8">${exams.map(e => { const k = dday(e.date); return `<div class="li"><div class="li-ico">${e.type === '면접' ? '🗣️' : e.type === '논술' ? '✍️' : '🎯'}</div><div class="li-main"><div class="li-t">${esc(e.univ)} · ${esc(e.type)}</div><div class="li-s">${e.date} ${e.memo ? '· ' + esc(e.memo) : ''}</div></div><span class="badge ${k < 0 ? 'b-green' : k <= 7 ? 'b-red' : 'b-blue'}">${k === 0 ? 'D-DAY' : k > 0 ? 'D-' + k : '완료'}</span><button class="btn btn-sm btn-ghost" data-act="cnExamDel" data-id="${e.id}">✕</button></div>`; }).join('')}</div>` : ''}
        <div class="row mt8"><button class="btn btn-sm" data-act="cnPlanStage">📅 이 단계 할 일을 플래너에 담기</button></div>
        <p class="xs muted mt8">${s.K.exact ? s.K.src + ' 기준' : '관례 기준 예상 일정'} · 수능 ${md(s.K.suneung)} · 성적 발표 ${md(s.K.score)} · 수시 발표 ~${md(s.K.susiAnnounce)} · 정시 접수 ${md(s.K.jsApply[0])}~${md(s.K.jsApply[1])} · 정시 발표 ~${md(s.K.jsAnnounce)}</p></div>
      ${kid.grade === 12 ? milestoneTable(s.K) : ''}
      <div class="card mt12 cn-premium"><div class="card-head"><h2>🎓 프리미엄 맞춤 컨설팅 리포트</h2><span class="badge b-orange">참고용 자가 진단</span></div>
        ${ready ? `<div class="cn-sum"><div class="cn-type">${esc(d.type)}</div><div class="small">${d.fits.length ? `가장 맞는 전형: <b>${esc(d.fits[0].k)}</b> (${d.fits[0].s}점)` : ''}${d.realism ? ` · 목표 ${esc(p.tier)}권 ${d.realism === 'ok' ? '현실적' : d.realism === 'stretch' ? '도전권' : '격차 큼'}` : ''}</div></div>
          <div class="cn-fits">${d.fits.map(f => `<div class="cn-fit"><span>${esc(f.k)}</span>${bar(f.s)}<b>${f.s}</b></div>`).join('')}</div>
          <div class="row mt12" style="gap:8px;flex-wrap:wrap"><a class="btn btn-primary" href="#high/consult/report">리포트 전체 보기</a><a class="btn" href="#high/consult/profile">입력값 수정</a></div>`
        : `<p class="small">계열·목표·내신·모의고사 등급과 비교과 수준을 넣으면 전형별 적합도, 수시 6장·정시 3장 배분, 과목 보완 순서, 단계별 액션 플랜을 리포트로 만들어 드립니다. 2분이면 됩니다.</p><a class="btn btn-primary mt8" href="#high/consult/profile">진단 시작하기</a>`}
        <p class="xs muted mt8">대학 이름을 찍어 주는 것이 아니라, 공개된 전형 구조와 입력한 성적으로 방향을 계산하는 자가 진단입니다. 대학별 반영 방법·최저 기준은 모집요강이 우선이며 입시 결과를 보장하지 않습니다.</p></div>
      <div class="hi-consult-anchor"></div>
      <div class="card mt12"><div class="card-head"><h2>컨설팅·학원 고르기 체크리스트</h2></div><ul class="warn-list">${['학원·교습소 등록번호가 있는지(학원법에 따라 유료 진학 상담도 등록 대상). 교육청 "학원 정보 공개"에서 조회 가능', '"합격 보장", "100% 합격" 같은 표현은 표시·광고법상 허위·과장 광고 소지. 이런 문구를 쓰는 곳은 피하기', '계약서에 환불 규정, 상담 횟수·시간, 담당자가 명시되어 있는지', '학생부 대필·허위 기재를 권하는 곳은 즉시 거절(입학 취소 사유)', '공공 상담(교육청 진로진학센터, 어디가 상담)을 먼저 받아 보고 비교하기'].map(t => `<li>${t}</li>`).join('')}</ul></div>
      <div class="card mt12"><div class="card-head"><h2>무료 공공 상담 · 공식 정보</h2></div><div class="list">${[['대입정보포털 어디가', 'https://www.adiga.kr', '대학별 전형·성적 산출·합격 사례 · 입학사정관 온라인 상담'], ['서울특별시교육청 진로진학정보센터', 'https://www.jinhak.or.kr', '대입 상담 예약, 설명회, 학력평가 자료'], ['한국대학교육협의회', 'https://www.kcue.or.kr', '대입전형 기본사항 · 수시·정시 일정 원문'], ['한국교육과정평가원 수능', 'https://www.suneung.re.kr', '시행 기본계획 · 성적 통지 · 기출'], ['한국장학재단', 'https://www.kosaf.go.kr', '국가장학금 1차 신청(11~12월) · 학자금']].map(([n, u, dsc]) => `<a class="li" href="${u}" target="_blank" rel="noopener" style="color:inherit"><div class="li-ico">🏛️</div><div class="li-main"><div class="li-t">${n}</div><div class="li-s">${dsc}</div></div><span class="muted">↗</span></a>`).join('')}</div><p class="xs muted mt8">우리 지역 교육청 진로진학센터는 각 시·도교육청 홈페이지의 '진로진학' 메뉴에서 찾을 수 있어요.</p></div>
      <div class="card mt12 hi-adv"><div class="card-head"><h2>📣 컨설턴트·학원·인강 광고주 안내</h2></div><p class="small">고등 화면(홈·컨설팅 페이지)은 수능·대입을 준비하는 학생과 학부모가 매일 보는 지면입니다. 광고는 "AD" 표시와 함께 콘텐츠와 구분해 노출되며, 올배움은 상담을 직접 제공하거나 광고주를 보증하지 않습니다.</p><div class="row mt8" style="gap:8px"><a class="btn btn-primary" href="#ads?slot=high_consult">광고 문의하기</a><a class="btn btn-ghost" href="#legal">광고·개인정보 안내</a></div></div></div>`);
  }
  function milestoneTable(K) {
    const rows = [['수시 원서접수', K.susiApply.join(' ~ ')], ['수능', K.suneung], ['수능 성적 통지', K.score], ['수시 전형 종료', K.susiEnd], ['수시 합격자 발표', '~ ' + K.susiAnnounce], ['수시 미등록 충원', K.susiExtra.join(' ~ ')], ['수시 충원 등록 마감', K.susiReg], ['정시 원서접수', K.jsApply.join(' ~ ')], ['정시 합격자 발표', '~ ' + K.jsAnnounce], ['정시 미등록 충원', K.jsExtra.join(' ~ ')]];
    const t = ymd(today0());
    return `<div class="card mt12"><div class="card-head"><h2>대입 핵심 일정</h2><span class="xs muted">${K.exact ? '확정' : '예상'}</span></div><div class="cn-ms">${rows.map(([n, v]) => { const last = v.replace(/^~ /, '').split(' ~ ').pop(); const past = last < t; return `<div class="cn-ms-r ${past ? 'past' : ''}"><span>${past ? '✓' : '·'}</span><b>${n}</b><small>${v}</small></div>`; }).join('')}</div><p class="xs muted mt8">${esc(K.src)}. 대학별 전형일·발표일은 모집요강이 우선입니다.</p></div>`;
  }
  function profilePage(kid) {
    const p = prof().prof; const m = latestMock(); const scale = kid.grade >= 11 ? 5 : 9;
    const sel = (name, opts, cur) => `<select class="input" name="${name}">${opts.map(o => `<option value="${o}" ${String(o) === String(cur) ? 'selected' : ''}>${o}</option>`).join('')}</select>`;
    const gradeSel = (k, cur) => `<select class="input" name="g_${k}"><option value="">–</option>${[1, 2, 3, 4, 5, 6, 7, 8, 9].map(g => `<option value="${g}" ${+cur === g ? 'selected' : ''}>${g}등급</option>`).join('')}</select>`;
    const rate = (name, cur, labels) => `<div class="cn-rate" data-name="${name}">${[1, 2, 3, 4, 5].map(v => `<button type="button" class="chip ${+cur === v ? 'on' : ''}" data-v="${v}">${v}</button>`).join('')}<small class="xs muted">${labels}</small><input type="hidden" name="${name}" value="${cur}"></div>`;
    return MS().layout('high/consult', `<div class="hi"><div class="row" style="margin-bottom:6px"><a class="btn btn-ghost btn-sm" href="#high/consult">← 맞춤 컨설팅</a></div>
      <div class="page-head"><div><h1>진단 입력</h1><div class="sub">정확할수록 리포트가 정확해져요. 모르는 항목은 비워 두어도 됩니다.</div></div></div>
      <form id="cnForm" class="card stack" style="gap:14px">
        <div class="form-grid"><div class="field"><label>희망 계열</label>${sel('track', TRACKS, p.track || '인문')}</div><div class="field"><label>목표 대학군</label><select class="input" name="tier">${TIERS.map(([k, d]) => `<option value="${k}" ${p.tier === k ? 'selected' : ''}>${k} · ${d}</option>`).join('')}</select></div></div>
        <div class="form-grid"><div class="field"><label>내신 평균 등급 <span class="xs muted">(${scale}등급제, 주요 교과 기준)</span></label><input class="input" name="naesin" type="number" step="0.1" min="1" max="${scale}" placeholder="예: 2.3" value="${esc(p.naesin)}"></div><div class="field"><label>수시 · 정시 선호</label>${sel('pref', ['균형', '수시', '정시'], p.pref)}</div></div>
        <div class="field"><label>최근 모의고사 등급 <span class="xs muted">${m ? `(${esc(m.name)} 기록을 불러왔어요 · 바꾸면 덮어씁니다)` : '(모의고사 기록 메뉴에 등록하면 자동으로 들어와요)'}</span></label>
          <div class="hi-mock-in">${[['kor', '국어'], ['math', '수학'], ['eng', '영어'], ['his', '한국사'], ['soc', '사회탐구'], ['sci', '과학탐구']].map(([k, n]) => `<div class="field"><label>${n}</label>${gradeSel(k, p.grades[k] != null ? p.grades[k] : (m ? m.g[k] : ''))}</div>`).join('')}</div></div>
        <div class="field"><label>세특(세부능력 및 특기사항) 충실도</label>${rate('setek', p.setek, '1 거의 없음 · 3 과목당 1개 · 5 매 과목 탐구·발표 기록')}</div>
        <div class="field"><label>자율·동아리·진로 활동</label>${rate('act', p.act, '1 형식적 · 3 꾸준함 · 5 진로 주제로 연결된 성과')}</div>
        <div class="field"><label>독서 기록</label>${rate('read', p.read, '1 없음 · 3 학기 2권 · 5 진로 연계 깊이 있는 독서')}</div>
        <div class="field"><label>진로 일관성(학과와 활동의 연결)</label>${rate('consist', p.consist, '1 아직 미정 · 5 1학년부터 한 방향')}</div>
        <div class="form-grid"><div class="field"><label>논술 준비</label>${sel('essay', [0, 1, 2, 3], p.essay)}<small class="xs muted">0 안 함 · 1 기초 · 2 꾸준히 · 3 실전</small></div><div class="field"><label>면접 준비</label>${sel('interview', [0, 1, 2, 3], p.interview)}<small class="xs muted">0 안 함 · 1 예상 질문 · 2 모의 면접 · 3 실전</small></div></div>
        <div class="row" style="gap:8px"><button class="btn btn-primary btn-lg" type="submit">리포트 만들기</button><a class="btn btn-ghost" href="#high/consult">취소</a></div>
        <p class="xs muted">입력값은 이 기기에만 저장됩니다. 성적·활동은 본인이 아는 범위에서 솔직하게 넣을수록 유용합니다.</p>
      </form></div>`);
  }
  function reportPage(kid) {
    const d = diagnose(kid), p = d.p, s = stage(kid), K = s.K;
    if (!p.track) return profilePage(kid);
    const col = { '학생부교과': '#4A7DF0', '학생부종합': '#12A150', '논술': '#B45309', '정시(수능)': '#1F2A44' };
    const typeDesc = { '내신형': '내신이 모의고사보다 뚜렷하게 강합니다. 학생부 전형(교과·종합)이 주 무대이고, 수능은 최저 충족과 정시 안전판 역할입니다.', '수능형': '모의고사가 내신보다 강합니다. 정시가 든든하므로 수시는 "붙으면 갈 곳"만 상향으로, 논술 전형도 유리합니다.', '균형형': '내신과 수능이 비슷합니다. 전형을 고르게 섞어 6장을 쓰고, 남은 기간 가장 많이 오를 수 있는 축(아래 과목 우선순위)에 집중하세요.', '자료 부족': '내신 또는 모의고사 등급이 비어 있어 유형을 가르지 못했습니다. 입력값을 채우면 정확해집니다.' };
    const real = d.realism && { ok: `목표 ${p.tier}권은 현재 성적으로 현실적인 범위입니다. 상향 1~2장을 더 과감하게 써도 됩니다.`, stretch: `목표 ${p.tier}권은 도전권입니다. 안정 카드를 2장 이상 확보하고, 아래 과목 1순위에서 1등급을 올리면 적정권으로 들어옵니다.`, gap: `목표 ${p.tier}권과 현재 성적의 격차가 큽니다. 목표를 한 단계 넓혀 잡거나, 수능 중심(정시·논술)으로 역전 전략을 세우는 것이 현실적입니다.` }[d.realism];
    const act = actions(kid, d);
    const docs = kid.grade === 12 ? ['수시 지원 대학별 대학별고사 일정·장소·준비물(아래 일정표)', '수능 수험표·신분증, 시험장 동선', '수능 최저 충족 여부(가채점 뒤 재확인)', '정시 지원용: 성적표 표준점수·백분위·등급, 대학별 반영 비율 표', '수시 합격 시 등록 기한, 미등록 충원 연락처', '국가장학금 1차 신청(한국장학재단, 11~12월)'] : ['학생부 교과 성취도·세특 점검(학기 말 담임 상담)', '선택과목 계획(희망 학과 권장 과목 확인: 어디가·대학 입학처)', '모의고사 등급 추이 기록(3·6·9·11월)', '독서·탐구 기록 정리', '희망 대학 3곳 전형 구조 미리 보기(어디가)'];
    return MS().layout('high/consult', `<div class="hi cn-report">
      <div class="row between" style="margin-bottom:6px"><a class="btn btn-ghost btn-sm" href="#high/consult">← 맞춤 컨설팅</a><div class="row" style="gap:6px"><a class="btn btn-sm" href="#high/consult/profile">입력 수정</a><button class="btn btn-sm btn-primary" data-act="cnPrint">🖨 인쇄·PDF</button></div></div>
      <div class="card cn-cover"><div class="xs" style="opacity:.8">올배움 프리미엄 맞춤 컨설팅 리포트 · ${ymd(today0())}</div><h1>${esc(kid.name)} · ${GL(kid.grade)} · ${esc(d.track)} 계열</h1><div class="cn-type-big">${esc(d.type)}</div><p>${typeDesc[d.type]}</p>${real ? `<p class="cn-real">${real}</p>` : ''}</div>
      <div class="card mt12"><div class="card-head"><h2>1. 전형 적합도</h2><span class="xs muted">100점 만점</span></div><div class="cn-fits">${d.fits.map(f => `<div class="cn-fit"><span>${esc(f.k)}</span>${bar(f.s, col[f.k])}<b>${f.s}</b><small>${esc(f.why)}</small></div>`).join('')}</div>
        <div class="grid g3 mt12 cn-tiles"><div class="tile"><div class="t-label">내신</div><div class="t-val">${p.naesin || '–'}<small>등급</small></div><div class="xs muted">${d.naeS != null ? d.naeS + '점' : '미입력'}</div></div><div class="tile"><div class="t-label">모의고사(계열 가중)</div><div class="t-val">${d.mockS != null ? d.mockS : '–'}<small>점</small></div><div class="xs muted">${d.trend ? (d.trend > 0 ? '▲ ' + d.trend + '등급 상승' : '▼ ' + (-d.trend) + '등급 하락') : '추이 없음'}</div></div><div class="tile"><div class="t-label">비교과</div><div class="t-val">${d.nonS}<small>점</small></div><div class="xs muted">세특·활동·독서·일관성</div></div></div>
        ${d.minOK != null ? `<p class="small mt8">수능 최저학력기준(상위권 기준 "2개 합 5" 수준) 충족 가능성: <b>${['어려움 — 최저 없는 전형 비중을 높이세요', '경계 — 주요 과목 1개만 올리면 충족', '여유 — 최저 있는 전형도 적극 지원'][d.minOK]}</b>. 대학별 실제 기준은 모집요강에서 확인.</p>` : ''}</div>
      <div class="card mt12"><div class="card-head"><h2>2. 지원 전략</h2></div>
        <div class="cn-port"><div><div class="small bold">수시 6장 배분(권장)</div><div class="cn-cards">${Object.entries(d.port.susi).map(([k, n]) => `<div class="cn-cardn" style="--sc:${col[k]}"><b>${n}</b><span>${k}</span></div>`).join('')}</div><div class="xs muted mt4">상향 ${d.port.mix[0]} · 적정 ${d.port.mix[1]} · 안정 ${d.port.mix[2]}</div></div>
        <div><div class="small bold">정시 3장(가·나·다군)</div><div class="cn-cards">${['가', '나', '다'].map((g, i) => `<div class="cn-cardn" style="--sc:#1F2A44"><b>${g}</b><span>${d.port.js[i]}</span></div>`).join('')}</div><div class="xs muted mt4">군별 1회 · 수시 합격 시 지원 불가</div></div></div>
        ${d.port.notes.length ? `<ul class="st-do mt8">${d.port.notes.map(n => `<li>${n}</li>`).join('')}</ul>` : ''}
        <p class="xs muted mt8">대학·학과는 어디가(adiga.kr)에서 "내 성적으로 지원 가능 대학"과 전년도 입시 결과를 확인해 채우세요. 올배움은 특정 대학을 추천하지 않습니다.</p></div>
      <div class="card mt12"><div class="card-head"><h2>3. 과목 보완 우선순위</h2><span class="xs muted">목표 ${TARGET[p.tier] || '현재-1'}등급 기준</span></div>
        ${d.prio.length ? `<ol class="steps">${d.prio.slice(0, 5).map(x => `<li><span><b>${x.n}</b> ${x.g}등급${x.gap ? ` → 목표까지 ${x.gap}등급` : ' · 목표 도달'} <small class="muted">(계열 비중 ${Math.round(x.w * 100)}%)</small>${x.gap ? `<br><small>${esc(((HA().SUBJ_H || []).find(s => s.k === (x.k === 'tam' ? 'sci' : x.k)) || { pts: [''] }).pts[0])}</small>` : ''}</span></li>`).join('')}</ol>` : '<p class="small muted">모의고사 등급을 입력하면 우선순위가 나옵니다.</p>'}</div>
      <div class="card mt12"><div class="card-head"><h2>4. 지금 단계 액션 플랜 · ${esc(s.title)}</h2><button class="btn btn-sm" data-act="cnPlanAll">📅 플래너에 담기</button></div><ul class="st-do">${act.map(x => `<li>${esc(x.title)}</li>`).join('')}</ul></div>
      <div class="card mt12"><div class="card-head"><h2>5. 체크리스트</h2></div><ul class="warn-list">${docs.map(t => `<li>${t}</li>`).join('')}</ul>${kid.grade === 12 ? `<div class="small bold mt12">핵심 일정(${K.exact ? '확정' : '예상'})</div><p class="small">수능 ${K.suneung} · 성적 통지 ${K.score} · 수시 합격 발표 ~${K.susiAnnounce} · 충원 ${K.susiExtra.join('~')} · 정시 접수 ${K.jsApply.join('~')} · 정시 발표 ~${K.jsAnnounce} · 정시 충원 ${K.jsExtra.join('~')}</p>` : ''}</div>
      <div class="card mt12"><div class="card-head"><h2>6. 면접·논술 대비 포인트</h2></div><ul class="st-do">${(p.interview < 2 ? ['면접: 학생부 세특·활동에서 "왜 했는지, 무엇을 배웠는지, 다음엔 무엇을 할지" 3단 답변을 항목마다 준비', '면접: 지원 학과의 기초 개념 질문(교과 심화) 10개 예상, 1분 자기소개 암기 금지·키워드만'] : ['면접: 모의 면접 녹화 후 말 속도·시선·답변 길이(40~60초) 점검']).concat(p.essay ? ['논술: 지원 대학 기출 3년치를 시간 재고 풀고, 대학 발표 모범답안의 "채점 기준"을 역으로 정리'] : ['논술 전형을 쓸 계획이면 지금이라도 대학 기출 1회분으로 적성 확인']).map(t => `<li>${t}</li>`).join('')}</ul></div>
      <div class="card mt12"><div class="card-head"><h2>7. 공식 자료</h2></div><div class="row" style="gap:8px;flex-wrap:wrap">${[['어디가', 'https://www.adiga.kr'], ['대교협', 'https://www.kcue.or.kr'], ['평가원 수능', 'https://www.suneung.re.kr'], ['EBSi', 'https://www.ebsi.co.kr'], ['서울진로진학정보센터', 'https://www.jinhak.or.kr'], ['한국장학재단', 'https://www.kosaf.go.kr'], ['학교알리미', 'https://www.schoolinfo.go.kr'], ['나이스 대국민서비스', 'https://www.neis.go.kr']].map(([n, u]) => `<a class="btn btn-sm" href="${u}" target="_blank" rel="noopener">${n} ↗</a>`).join('')}</div></div>
      <p class="xs muted mt12 cn-disc">이 리포트는 올배움이 공개된 대입 제도 정보와 사용자가 입력한 성적·활동 수준을 바탕으로 계산한 참고용 자가 진단입니다. 특정 대학·학과의 합격 가능성을 보장하거나 예측하지 않으며, 대학별 반영 방법·수능 최저·전형 일정은 각 대학 모집요강과 대교협 기본사항이 우선합니다. 유료 입시 상담은 학원법상 등록 기관인지 확인하세요.</p></div>`);
  }

  /* ---------- 입력 모달 ---------- */
  function examModal() {
    MS().modal(`<h2>논술·면접·실기 일정</h2><form id="cnExamForm" class="stack" style="gap:10px">
      <div class="form-grid"><div class="field"><label>대학·전형</label><input class="input" name="univ" required maxlength="30" placeholder="예: ○○대 학생부종합"></div><div class="field"><label>종류</label><select class="input" name="type"><option>면접</option><option>논술</option><option>실기</option><option>서류 제출</option><option>발표</option></select></div></div>
      <div class="form-grid"><div class="field"><label>날짜</label><input class="input" type="date" name="date" required value="${ymd(today0())}"></div><div class="field"><label>메모</label><input class="input" name="memo" maxlength="40" placeholder="시간·장소·준비물"></div></div>
      <div class="modal-actions"><button class="btn btn-ghost" type="button" data-act="cnClose">취소</button><button class="btn btn-primary" type="submit">저장</button></div></form>`, (m) => {
      m.querySelector('#cnExamForm').addEventListener('submit', e => { e.preventDefault(); const f = new FormData(e.target); prof().prof.exams.push({ id: uid(), univ: String(f.get('univ')).trim(), type: f.get('type'), date: f.get('date'), memo: String(f.get('memo') || '').trim() }); save(); MS().close(); MS().render(); MS().toast('일정을 등록했어요'); });
    });
  }
  function addToPlan(list) {
    const h = prof(); const t = today0(); let n = 0;
    list.forEach(x => { const d = new Date(t); d.setDate(t.getDate() + (x.days || 0)); const date = ymd(d); if (h.plan.some(p => p.title === x.title && p.date === date)) return; h.plan.push({ id: uid(), subj: x.subj || 'etc', title: x.title, date, min: 0, done: false, created: ymd(t) }); n++; });
    save(); MS().toast(n ? `${n}개를 플래너에 담았어요` : '이미 모두 담겨 있어요'); if (n) MS().st()._hiDay = null;
  }

  /* ---------- 이벤트 ---------- */
  document.addEventListener('submit', e => {
    if (e.target.id !== 'cnForm') return; e.preventDefault();
    const f = new FormData(e.target); const p = prof().prof;
    p.track = f.get('track'); p.tier = f.get('tier'); p.naesin = f.get('naesin') ? +f.get('naesin') : ''; p.pref = f.get('pref');
    ['setek', 'act', 'read', 'consist'].forEach(k => p[k] = +f.get(k) || 3); p.essay = +f.get('essay') || 0; p.interview = +f.get('interview') || 0;
    const g = {}; ['kor', 'math', 'eng', 'his', 'soc', 'sci'].forEach(k => { const v = f.get('g_' + k); if (v) g[k] = +v; }); p.grades = g;
    save(); MS().go('high/consult/report'); window.scrollTo(0, 0);
  });
  document.addEventListener('click', e => {
    const r = e.target.closest('.cn-rate [data-v]'); if (r) { const box = r.closest('.cn-rate'); box.querySelectorAll('.chip').forEach(c => c.classList.remove('on')); r.classList.add('on'); box.querySelector('input[type=hidden]').value = r.dataset.v; return; }
    const b = e.target.closest('[data-act]'); if (!b) return; const act = b.dataset.act;
    const H = {
      cnExamAdd() { examModal(); },
      cnExamDel() { const p = prof().prof; p.exams = p.exams.filter(x => x.id !== b.dataset.id); save(); MS().render(); },
      cnClose() { MS().close(); },
      cnPrint() { document.body.classList.add('print-report'); setTimeout(() => { window.print(); setTimeout(() => document.body.classList.remove('print-report'), 500); }, 50); },
      cnPlanStage() { const kid = MS().kid(); addToPlan(stage(kid).do.map((t, i) => ({ subj: 'etc', title: t.length > 40 ? t.slice(0, 38) + '…' : t, days: i }))); },
      cnPlanAll() { const kid = MS().kid(); addToPlan(actions(kid, diagnose(kid))); }
    };
    if (H[act]) { e.preventDefault(); H[act](); }
  });
  document.addEventListener('change', e => { const b = e.target.closest('[data-act="cnSusi"]'); if (!b) return; prof().prof.susiDone = b.checked; save(); MS().render(); });

  window.ConsultApp = { page, stage, stageCard, diagnose, keyDates };
})();
