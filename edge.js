/* 쌤픽 고등 — 경쟁력 모듈
   벤치마킹 축: ①지금 할 일(시점 맞춤) ②성적 추이·목표 갭(성적 분석) ③순공 시간(공부 습관) ④개념 과외(즉시 학습) ⑤무료·로그인 없음
   · 대시보드 KPI(D-day · 오늘 순공 · 최근 평균 등급 · 목표 갭)
   · 오늘 할 일 3가지(지금 단계 + 다음 개념 + 플래너 + 기록 공백을 하나로)
   · 공부 타이머(과목별 스톱워치, 새로고침해도 이어짐, 목표보다 일찍 끝내도 기록)
   · 등급 추이 그래프(목표선 포함) */
(function () {
  'use strict';
  const MS = () => window.MS;
  const HA = () => window.HighApp;
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const pad = (n) => String(n).padStart(2, '0');
  const ymd = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  const today = () => ymd(new Date());
  const SUB = [['kor', '국어', '#E5484D'], ['math', '수학', '#4A7DF0'], ['eng', '영어', '#7C3AED'], ['his', '한국사', '#B45309'], ['tam', '탐구', '#16A34A'], ['etc', '기타', '#64748B']];
  const SN = (k) => (SUB.find(s => s[0] === k) || SUB[5]);

  function store() {
    const st = MS().st(), kid = MS().kid(); st.hi = st.hi || {};
    const h = st.hi[kid.id] = st.hi[kid.id] || { plan: [], mock: [], pin: {}, goal: {} };
    h.plan = h.plan || []; h.mock = h.mock || []; h.goal = h.goal || {}; h.tutor = h.tutor || {};
    h.timer = h.timer || { run: null, log: [] };
    if (!h.goal.daily) h.goal.daily = kid.grade === 12 ? 480 : 240;
    return h;
  }
  const save = () => MS().save();

  /* ---------- 시간 계산 ---------- */
  const fmt = (sec) => { sec = Math.max(0, Math.round(sec)); const h = Math.floor(sec / 3600), m = Math.floor(sec % 3600 / 60); return h ? `${h}시간 ${pad(m)}분` : `${m}분`; };
  const clock = (sec) => { sec = Math.max(0, Math.floor(sec)); return `${pad(Math.floor(sec / 3600))}:${pad(Math.floor(sec % 3600 / 60))}:${pad(sec % 60)}`; };
  const running = (h) => h.timer.run ? (Date.now() - h.timer.run.t0) / 1000 : 0;
  function daySec(h, d, subj) { let s = h.timer.log.filter(x => x.d === d && (!subj || x.s === subj)).reduce((a, x) => a + x.sec, 0); if (h.timer.run && d === today() && (!subj || h.timer.run.s === subj)) s += running(h); return s; }
  function streak(h) { let n = 0; const d = new Date(); if (daySec(h, ymd(d)) < 1800) d.setDate(d.getDate() - 1); while (daySec(h, ymd(d)) >= 1800) { n++; d.setDate(d.getDate() - 1); } return n; }
  function lastDays(n) { const out = []; const d = new Date(); d.setDate(d.getDate() - n + 1); for (let i = 0; i < n; i++) { out.push(ymd(d)); d.setDate(d.getDate() + 1); } return out; }

  /* ---------- 성적 ---------- */
  function mockRows(h) { return h.mock.slice().sort((a, b) => a.date.localeCompare(b.date)); }
  function avgOf(g) { const t = [g.soc, g.sci].filter(Boolean); const v = [g.kor, g.math, g.eng, t.length ? t.reduce((a, b) => a + b, 0) / t.length : 0].filter(Boolean); return v.length ? v.reduce((a, b) => a + b, 0) / v.length : null; }
  function trendSVG(h) {
    const rows = mockRows(h).slice(-8); if (!rows.length) return '';
    const W = 320, H = 150, L = 26, R = 10, T = 12, B = 26; const n = rows.length;
    const x = (i) => n === 1 ? (L + W - R) / 2 : L + (W - L - R) * i / (n - 1);
    const vals = rows.flatMap(r => [r.g.kor, r.g.math, r.g.eng, r.g.soc, r.g.sci]).filter(Boolean).concat(+h.goal.avg ? [+h.goal.avg] : []);
    const lo = Math.max(1, Math.floor(Math.min(...vals)) - 1), hi = Math.min(9, Math.ceil(Math.max(...vals)) + 1), span = Math.max(2, hi - lo);
    const y = (g) => T + (H - T - B) * (g - lo) / span;
    const series = [['kor', '국어', '#E5484D', r => r.g.kor], ['math', '수학', '#4A7DF0', r => r.g.math], ['eng', '영어', '#7C3AED', r => r.g.eng], ['tam', '탐구', '#16A34A', r => { const t = [r.g.soc, r.g.sci].filter(Boolean); return t.length ? t.reduce((a, b) => a + b, 0) / t.length : null; }]];
    const grid = Array.from({ length: span + 1 }, (_, i) => lo + i).map(g => `<line x1="${L}" x2="${W - R}" y1="${y(g)}" y2="${y(g)}" stroke="#E2E8F0"/><text x="${L - 6}" y="${y(g) + 4}" text-anchor="end" font-size="10" fill="#94A3B8">${g}</text>`).join('');
    const goal = +h.goal.avg ? `<line x1="${L}" x2="${W - R}" y1="${y(+h.goal.avg)}" y2="${y(+h.goal.avg)}" stroke="#F59E0B" stroke-dasharray="4 3" stroke-width="1.5"/><text x="${W - R}" y="${y(+h.goal.avg) - 4}" text-anchor="end" font-size="10" fill="#B45309">목표 ${(+h.goal.avg).toFixed(1)}</text>` : '';
    const lines = series.map(([k, nm, c, f]) => { const pts = rows.map((r, i) => [x(i), f(r)]).filter(p => p[1]); if (!pts.length) return ''; return `<polyline fill="none" stroke="${c}" stroke-width="2.2" stroke-linejoin="round" points="${pts.map(p => `${p[0]},${y(p[1])}`).join(' ')}"/>${pts.map(p => `<circle cx="${p[0]}" cy="${y(p[1])}" r="3" fill="${c}"/>`).join('')}`; }).join('');
    const labels = rows.map((r, i) => `<text x="${x(i)}" y="${H - 8}" text-anchor="middle" font-size="9.5" fill="#64748B">${esc(r.name.replace(/학력평가|모의평가|대학수학능력시험/, m => ({ 학력평가: '학평', 모의평가: '모평', 대학수학능력시험: '수능' }[m])).slice(0, 6))}</text>`).join('');
    const legend = series.map(([k, nm, c]) => `<span><i style="background:${c}"></i>${nm}</span>`).join('');
    return `<svg viewBox="0 0 ${W} ${H}" class="ed-chart" role="img" aria-label="모의고사 등급 추이(위로 갈수록 높은 등급)">${grid}${goal}${lines}${labels}</svg><div class="ed-legend">${legend}<span class="muted">위로 갈수록 좋은 등급</span></div>`;
  }

  /* ---------- 대시보드 ---------- */
  function dash(kid) {
    const h = store(); const s = HA().suneungDate(); const d = Math.ceil((new Date(s.getFullYear(), s.getMonth(), s.getDate()) - new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate())) / 864e5);
    const ey = HA().examYear(kid); const mine = ey === s.getFullYear() + 1;
    const rows = mockRows(h); const last = rows[rows.length - 1]; const avg = last ? avgOf(last.g) : null; const prev = rows[rows.length - 2]; const pavg = prev ? avgOf(prev.g) : null;
    const gap = avg != null && +h.goal.avg ? avg - +h.goal.avg : null;
    const todayS = daySec(h, today()); const pct = Math.min(100, Math.round(todayS / 60 / h.goal.daily * 100));
    const goalLine = h.goal.univ || +h.goal.avg ? `🎯 ${esc(h.goal.univ || '목표')}${+h.goal.avg ? ` · 평균 ${(+h.goal.avg).toFixed(1)}등급` : ''}` : '🎯 목표 대학을 정하면 갭을 계산해 드려요';
    return `<div class="card hero hi-hero ed-dash">
      <div class="ed-d-top"><div><div class="h-label">${ey}학년도 수능 · ${s.getMonth() + 1}/${s.getDate()}${mine ? '' : ' (올해)'}</div><div class="h-title">D-${d}</div></div><button class="ed-goal" data-act="edGoal">${goalLine} ›</button></div>
      <div class="ed-kpis">
        <div class="ed-k"><span>오늘 순공</span><b data-tm="today">${fmt(todayS)}</b><i class="ed-bar"><em style="width:${pct}%"></em></i><small>목표 ${fmt(h.goal.daily * 60)}</small></div>
        <div class="ed-k"><span>최근 평균</span><b>${avg != null ? avg.toFixed(1) + '등급' : '–'}</b><small>${avg != null && pavg != null ? (avg < pavg ? `▲ ${(pavg - avg).toFixed(1)} 상승` : avg > pavg ? `▼ ${(avg - pavg).toFixed(1)} 하락` : '유지') : last ? esc(last.name) : '모의고사 기록 전'}</small></div>
        <div class="ed-k"><span>목표까지</span><b>${gap == null ? '–' : gap <= 0 ? '달성' : gap.toFixed(1) + '등급'}</b><small>${gap == null ? '목표·기록 필요' : gap <= 0 ? '유지가 관건' : '평균 기준'}</small></div>
        <div class="ed-k"><span>연속 공부</span><b>${streak(h)}일</b><small>하루 30분 이상</small></div>
      </div></div>`;
  }

  /* ---------- 오늘 할 일 3가지 ---------- */
  function top3(kid) {
    const h = store(); const out = [];
    if (!daySec(h, today()) && !h.timer.run) out.push(['⏱', '공부 타이머 켜고 오늘 첫 공부 시작', 'act', 'edStart', '30초']);
    if (window.ConsultApp) { const s = ConsultApp.stage(kid); if (s && s.do && s.do.length) { const act = s.do.find(t => !/마감|끝났|전부$/.test(t)) || s.do[0]; out.push(['📍', act, 'href', '#high/consult', '지금 단계 · ' + s.title]); } }
    const plan = h.plan.filter(p => p.date === today() && !p.done)[0]; if (plan) out.push(['📅', plan.title, 'href', '#high/plan', '오늘 계획']);
    if (window.TutorApp) { const c = TutorApp.nextConcept(); if (c) out.push(['👩‍🏫', `개념 과외: ${c.t}`, 'href', '#high/tutor/' + c.id, '3분']); }
    if (!h.mock.length) out.push(['📈', '최근 모의고사 등급 기록하기', 'act', 'hiMockAdd', '1분']);
    if (!h.goal.univ && !+h.goal.avg) out.push(['🎯', '목표 대학·목표 등급 정하기', 'act', 'edGoal', '30초']);
    if (!h.plan.some(p => p.date === today())) out.push(['📅', '오늘 계획 1개 세우기', 'act', 'hiAdd', '추천 목록에서 고르기']);
    out.push(['🎯', '수능 족집게 체크리스트 1과목 점검', 'href', '#high/pin', '과목별 꼭 지킬 것']);
    const list = out.slice(0, 3);
    return `<div class="card ed-top3"><div class="card-head"><h2>오늘 할 일 3가지</h2><a class="more" href="#high/plan">플래너 ›</a></div>
      <ol class="ed-todo">${list.map(([i, t, kind, v, tag], n) => `<li>${kind === 'href' ? `<a href="${v}">` : `<button data-act="${v}">`}<span class="ed-n">${n + 1}</span><span class="ed-t"><b>${esc(t)}</b><small>${i} ${esc(tag)}</small></span><span class="ed-go">›</span>${kind === 'href' ? '</a>' : '</button>'}</li>`).join('')}</ol></div>`;
  }

  /* ---------- 타이머 ---------- */
  function timerCard(full) {
    const h = store(); const r = h.timer.run; const sel = r ? r.s : (MS().st()._edSubj || 'math');
    return `<div class="card ed-timer ${r ? 'on' : ''}" style="--sc:${SN(sel)[2]}">
      <div class="card-head"><h2>⏱ 공부 타이머</h2>${full ? '' : '<a class="more" href="#high/timer">기록 ›</a>'}</div>
      <div class="ed-t-main"><div><div class="ed-clock" data-tm="run">${clock(r ? running(h) : 0)}</div><div class="xs muted">${r ? `${SN(r.s)[1]} 공부 중 · 오늘 ${SN(r.s)[1]} <span data-tm="subj">${fmt(daySec(h, today(), r.s))}</span>` : `오늘 합계 ${fmt(daySec(h, today()))}`}</div></div>
        <button class="btn ${r ? '' : 'btn-primary'} ed-big" data-act="${r ? 'edStop' : 'edStart'}">${r ? '■ 끝내기' : '▶ 시작'}</button></div>
      <div class="chips ed-subj">${SUB.map(([k, n, c]) => `<button class="chip ${k === sel ? 'on' : ''}" data-act="edSubj" data-k="${k}" style="--sc:${c}" ${r ? 'disabled' : ''}>${n}</button>`).join('')}</div>
    </div>`;
  }
  function timerPage() {
    const h = store(); const days = lastDays(7); const max = Math.max(h.goal.daily * 60, ...days.map(d => daySec(h, d))) || 1;
    const bars = days.map(d => { const s = daySec(h, d); const dd = new Date(d); return `<div class="ed-day ${d === today() ? 'today' : ''}"><div class="ed-col"><em style="height:${Math.round(s / max * 100)}%"></em><i style="bottom:${Math.round(h.goal.daily * 60 / max * 100)}%"></i></div><b>${s ? Math.round(s / 360) / 10 + 'h' : ''}</b><span>${'일월화수목금토'[dd.getDay()]}</span></div>`; }).join('');
    const bySub = SUB.map(([k, n, c]) => [n, c, days.reduce((a, d) => a + daySec(h, d, k), 0)]).filter(x => x[2] > 0).sort((a, b) => b[2] - a[2]); const tot = bySub.reduce((a, x) => a + x[2], 0) || 1;
    return MS().layout('high/timer', `<div class="hi">
      <div class="page-head"><div><h1>공부 타이머</h1><div class="sub">과목을 고르고 시작. 일찍 끝내도 공부한 만큼 그대로 기록돼요.</div></div></div>
      ${timerCard(true)}
      <div class="card mt12"><div class="card-head"><h2>최근 7일</h2><span class="xs muted">연속 ${streak(h)}일 · 노란 선은 하루 목표</span></div><div class="ed-week">${bars}</div></div>
      <div class="card mt12"><div class="card-head"><h2>과목별 비중 (7일)</h2></div>${bySub.length ? `<div class="ed-stack">${bySub.map(([n, c, s]) => `<i style="width:${s / tot * 100}%;background:${c}" title="${n}"></i>`).join('')}</div><ul class="ed-sublist">${bySub.map(([n, c, s]) => `<li><i style="background:${c}"></i>${n}<b>${fmt(s)}</b><span>${Math.round(s / tot * 100)}%</span></li>`).join('')}</ul>` : '<p class="small muted">아직 기록이 없어요. 위에서 시작을 눌러 보세요.</p>'}</div>
      <div class="card mt12"><div class="card-head"><h2>하루 목표 순공 시간</h2></div><div class="chips">${[180, 240, 300, 360, 480, 600, 720].map(m => `<button class="chip ${h.goal.daily === m ? 'on' : ''}" data-act="edDaily" data-m="${m}">${m / 60}시간</button>`).join('')}</div></div>
      <div class="hi-consult-anchor"></div></div>`);
  }
  function start(subj) { const h = store(); if (h.timer.run) return; h.timer.run = { s: subj || MS().st()._edSubj || 'math', t0: Date.now() }; save(); MS().render(); }
  function stop() {
    const h = store(); const r = h.timer.run; if (!r) return; h.timer.run = null;
    // 자정을 넘긴 경우 날짜별로 나눠 기록
    let t = r.t0; const end = Date.now();
    while (t < end) { const d = new Date(t); const next = new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1).getTime(); const seg = Math.min(end, next) - t; if (seg >= 1000) h.timer.log.push({ d: ymd(d), s: r.s, sec: Math.round(seg / 1000) }); t = Math.min(end, next); }
    const sec = (end - r.t0) / 1000; save(); MS().render(); MS().toast(sec >= 60 ? `${SN(r.s)[1]} ${fmt(sec)} 기록했어요` : '1분 미만은 짧게 기록돼요');
  }
  // 1초마다 숫자만 갱신(화면 다시 그리지 않음)
  setInterval(() => { try { if (!MS() || !MS().st().kids.length || !HA() || !HA().isHigh()) return; const h = store(); if (!h.timer.run) return; document.querySelectorAll('[data-tm="run"]').forEach(e => e.textContent = clock(running(h))); document.querySelectorAll('[data-tm="today"]').forEach(e => e.textContent = fmt(daySec(h, today()))); document.querySelectorAll('[data-tm="subj"]').forEach(e => e.textContent = fmt(daySec(h, today(), h.timer.run.s))); } catch (e) { } }, 1000);

  /* ---------- 목표 ---------- */
  function goalModal() {
    const h = store();
    MS().modal(`<h2>목표 정하기</h2><form id="edGoalForm" class="stack" style="gap:12px">
      <div class="field"><label>목표 대학·학과</label><input class="input" name="univ" maxlength="30" data-suggest="univ" placeholder="대학 이름 입력 (초성 가능)" value="${esc(h.goal.univ || '')}"></div>
      <div class="field"><label>목표 평균 등급 (국·수·영·탐)</label><div class="chips" id="edAvg">${[1.0, 1.5, 2.0, 2.5, 3.0, 3.5, 4.0, 5.0].map(v => `<button type="button" class="chip ${+h.goal.avg === v ? 'on' : ''}" data-v="${v}">${v.toFixed(1)}</button>`).join('')}</div></div>
      <p class="xs muted">목표 등급은 스스로 정하는 기준이에요. 대학별 합격선은 어디가·대학 입학처 자료로 확인하세요.</p>
      <div class="modal-actions"><button class="btn btn-ghost" type="button" data-act="hiClose">취소</button><button class="btn btn-primary" type="submit">저장</button></div></form>`, (m) => {
      m.querySelector('#edAvg').addEventListener('click', e => { const b = e.target.closest('[data-v]'); if (!b) return; m.querySelectorAll('#edAvg .chip').forEach(c => c.classList.toggle('on', c === b)); });
      m.querySelector('#edGoalForm').addEventListener('submit', e => { e.preventDefault(); const f = new FormData(e.target); h.goal.univ = String(f.get('univ') || '').trim(); const on = m.querySelector('#edAvg .chip.on'); h.goal.avg = on ? +on.dataset.v : ''; save(); MS().close(); MS().render(); MS().toast('목표를 저장했어요'); });
    });
  }

  document.addEventListener('click', e => {
    const b = e.target.closest('[data-act]'); if (!b) return; const act = b.dataset.act;
    const H = {
      edStart() { start(); }, edStop() { stop(); }, edGoal() { goalModal(); },
      edSubj() { MS().st()._edSubj = b.dataset.k; MS().render(); },
      edDaily() { store().goal.daily = +b.dataset.m; save(); MS().render(); }
    };
    if (H[act]) { e.preventDefault(); H[act](); }
  });

  window.EdgeApp = { dash, top3, timerCard, timerPage, trendSVG, store };
})();
