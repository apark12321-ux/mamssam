/* 쌤픽 고등 — 가채점 · 합격 가늠(작년 입결 비교)
   · 가채점: 원점수 입력 → 영어·한국사는 절대평가 기준으로 등급 자동 계산, 국어·수학·탐구는 공개 등급컷을 보고 등급 선택
             → 수능 최저 계산기·등급 추이에 한 번에 반영
   · 합격 가늠: 사용자가 어디가 등에서 확인한 "작년 입결"을 직접 넣고 내 성적과 비교해 안정·적정·상향·위험 구간 표시
     (입결 데이터를 수집·저장하지 않음. 예측이 아닌 비교이며 해마다 입결은 달라짐) */
(function () {
  'use strict';
  const MS = () => window.MS;
  const HA = () => window.HighApp;
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const pad = (n) => String(n).padStart(2, '0');
  const ymd = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);

  function store() {
    const st = MS().st(), kid = MS().kid(); st.hi = st.hi || {};
    const h = st.hi[kid.id] = st.hi[kid.id] || { plan: [], mock: [], pin: {}, goal: {} };
    h.mock = h.mock || []; h.gc = h.gc || { raw: {}, g: {}, saved: '' }; h.chance = h.chance || [];
    h.min = h.min || { n: 3, sum: 6, tam: 'avg', eng: 1, his: 0 };
    return h;
  }
  const save = () => MS().save();

  /* ---------- 절대평가 등급 ---------- */
  const engGrade = (r) => r === '' || r == null ? '' : Math.min(9, Math.max(1, 10 - Math.floor(Math.min(100, +r) / 10))); // 90↑ 1등급, 10점 간격
  const hisGrade = (r) => { if (r === '' || r == null) return ''; r = Math.min(50, +r); return r >= 40 ? 1 : Math.min(9, 1 + Math.ceil((40 - r) / 5)); }; // 40↑ 1등급, 5점 간격
  const AREAS = [['kor', '국어', 100, 'rel'], ['math', '수학', 100, 'rel'], ['eng', '영어', 100, 'abs'], ['his', '한국사', 50, 'abs'], ['t1', '탐구1', 50, 'rel'], ['t2', '탐구2', 50, 'rel']];
  function grades(h) { const g = Object.assign({}, h.gc.g); g.eng = engGrade(h.gc.raw.eng); g.his = hisGrade(h.gc.raw.his); return g; }
  const avgG = (g) => { const t = [g.t1, g.t2].filter(Boolean).map(Number); const v = [g.kor, g.math, g.eng].filter(Boolean).map(Number).concat(t.length ? [t.reduce((a, b) => a + b, 0) / t.length] : []); return v.length ? v.reduce((a, b) => a + b, 0) / v.length : null; };

  function gcPage() {
    const kid = MS().kid(), h = store(); const g = grades(h); const s = HA().suneungDate(); const sd = ymd(s); const t = ymd(new Date());
    const when = t < sd ? `수능(${s.getMonth() + 1}/${s.getDate()}) 당일 시험이 끝나면 여기서 가채점하세요. 모의고사 채점에도 쓸 수 있어요.` : t === sd ? '오늘이 수능이에요. 영역별 시험이 끝나면 평가원이 정답을 공개합니다.' : '평가원 정답으로 채점한 원점수를 넣어 보세요.';
    const done = AREAS.every(([k]) => k === 't2' || g[k]);
    const avg = avgG(g);
    return MS().layout('high/gachae', `<div class="hi">
      <div class="page-head"><div><h1>가채점</h1><div class="sub">${esc(when)}</div></div></div>
      <div class="card sc-links"><div class="card-head"><h2>1. 정답·등급컷 확인</h2></div>
        <div class="row" style="gap:8px;flex-wrap:wrap"><a class="btn btn-sm btn-primary" href="https://www.suneung.re.kr" target="_blank" rel="noopener">평가원 정답 ↗</a><a class="btn btn-sm" href="https://www.ebsi.co.kr" target="_blank" rel="noopener">EBSi 예상 등급컷 ↗</a></div>
        <p class="xs muted mt8">시험지에 표시해 온 답을 공식 정답과 맞춰 원점수를 구하세요. 예상 등급컷은 기관마다 다를 수 있어 두 곳 이상 비교를 권해요.</p></div>
      <div class="card mt12"><div class="card-head"><h2>2. 원점수와 등급</h2><span class="xs muted">영어·한국사는 자동</span></div>
        <div class="sc-grid">${AREAS.map(([k, n, max, kind]) => `<div class="sc-row"><div class="sc-n"><b>${n}</b><small>${max}점 만점</small></div>
          <input class="input sc-raw" type="number" inputmode="numeric" min="0" max="${max}" data-act="scRaw" data-k="${k}" placeholder="원점수" value="${esc(h.gc.raw[k] ?? '')}">
          ${kind === 'abs' ? `<div class="sc-auto">${g[k] ? `<b>${g[k]}</b>등급` : '–'}</div>` : `<div class="sc-gs">${[1, 2, 3, 4, 5, 6, 7, 8, 9].map(n2 => `<button class="sc-g ${+g[k] === n2 ? 'on' : ''}" data-act="scG" data-k="${k}" data-v="${n2}">${n2}</button>`).join('')}</div>`}</div>`).join('')}</div>
        <p class="xs muted mt8">영어 90점 이상 1등급(10점 간격), 한국사 40점 이상 1등급(5점 간격)으로 계산해요. 국어·수학·탐구는 확인한 예상 등급컷을 보고 고르세요.</p></div>
      <div class="card mt12 sc-sum"><div class="card-head"><h2>3. 결과 반영</h2></div>
        <div class="sc-line">${AREAS.map(([k, n]) => `<span>${n} <b>${g[k] || '–'}</b></span>`).join('')}<span>평균 <b>${avg != null ? avg.toFixed(2) : '–'}</b></span></div>
        <div class="row mt12" style="gap:8px;flex-wrap:wrap"><button class="btn btn-primary" data-act="scToMin" ${done ? '' : 'disabled'}>수능 최저 계산기에 적용 ›</button><button class="btn" data-act="scToMock" ${done ? '' : 'disabled'}>등급 추이에 기록</button><a class="btn btn-ghost" href="#high/chance">합격 가늠 ›</a></div>
        ${h.gc.saved ? `<p class="xs muted mt8">${esc(h.gc.saved)}에 등급 추이에 기록했어요.</p>` : ''}
        <p class="xs muted mt8">가채점은 실제 성적과 다를 수 있어요. 확정은 성적표(수능 성적 통지일)로 확인하세요. 경계선이면 대학별고사는 응시하는 것이 원칙이에요.</p></div>
      <div class="hi-consult-anchor"></div></div>`);
  }

  /* ---------- 합격 가늠 ---------- */
  // 등급 기준: 차이 = 작년 컷 - 내 등급(낮을수록 좋음) / 백분위 기준: 차이 = 내 백분위 - 작년 컷
  function band(c) {
    const cut = parseFloat(c.cut), mine = parseFloat(c.mine); if (isNaN(cut) || isNaN(mine)) return null;
    let d, txt;
    if (c.basis === 'pct') { d = mine - cut; txt = `${d >= 0 ? '+' : ''}${d.toFixed(1)}점`; return { d, txt, b: d >= 3 ? 'safe' : d >= -2 ? 'fit' : d >= -6 ? 'up' : 'risk' }; }
    const tight = c.type === '교과'; d = cut - mine; txt = `${d >= 0 ? '+' : ''}${d.toFixed(2)}등급`;
    return { d, txt, b: d >= (tight ? 0.15 : 0.3) ? 'safe' : d >= (tight ? -0.1 : -0.2) ? 'fit' : d >= (tight ? -0.35 : -0.6) ? 'up' : 'risk' };
  }
  const BL = { safe: ['안정', '#16A34A'], fit: ['적정', '#4A7DF0'], up: ['상향', '#F59E0B'], risk: ['위험', '#E5484D'] };
  function myDefault(type) {
    const h = store();
    if (type === '교과') { const n = h.prof && h.prof.naesin; return n ? String(n) : ''; }
    const g = grades(h); const a = avgG(g); if (a != null && g.kor) return a.toFixed(2);
    const rows = h.mock.slice().sort((x, y) => x.date.localeCompare(y.date)); const l = rows[rows.length - 1]; if (!l) return '';
    const t = [l.g.soc, l.g.sci].filter(Boolean); const v = [l.g.kor, l.g.math, l.g.eng].filter(Boolean).concat(t.length ? [t.reduce((p, q) => p + q, 0) / t.length] : []);
    return v.length ? (v.reduce((p, q) => p + q, 0) / v.length).toFixed(2) : '';
  }
  function chancePage() {
    const h = store();
    const rows = h.chance.map((c, i) => { const r = band(c); return `<div class="ch-row"><div class="ch-top"><input class="input" data-act="chF" data-i="${i}" data-f="u" data-suggest="univ" maxlength="30" placeholder="대학·학과 (초성 가능)" value="${esc(c.u)}"><button class="ch-x" data-act="chDel" data-i="${i}" aria-label="삭제">✕</button></div>
      <div class="ch-opts">${['정시', '교과'].map(t => `<button class="chip ${c.type === t ? 'on' : ''}" data-act="chType" data-i="${i}" data-v="${t}">${t === '정시' ? '정시(수능)' : '수시 교과(내신)'}</button>`).join('')}${c.type === '정시' ? ['grade', 'pct'].map(b => `<button class="chip ${c.basis === b ? 'on' : ''}" data-act="chBasis" data-i="${i}" data-v="${b}">${b === 'grade' ? '등급 평균' : '백분위 평균'}</button>`).join('') : ''}</div>
      <div class="ch-in"><label>작년 입결(70% 컷)<input class="input" type="number" inputmode="decimal" step="0.01" data-act="chF" data-i="${i}" data-f="cut" placeholder="${c.basis === 'pct' ? '예: 92.5' : '예: 2.35'}" value="${esc(c.cut)}"></label><label>내 성적<input class="input" type="number" inputmode="decimal" step="0.01" data-act="chF" data-i="${i}" data-f="mine" placeholder="${c.basis === 'pct' ? '백분위 평균' : '등급 평균'}" value="${esc(c.mine)}"></label>
        <div class="ch-b">${r ? `<span class="ch-tag" style="--bc:${BL[r.b][1]}">${BL[r.b][0]}</span><small>${r.txt}</small>` : '<small class="muted">두 값을 넣으면 구간이 나와요</small>'}</div></div></div>`; }).join('');
    const cnt = (b) => h.chance.filter(c => { const r = band(c); return r && r.b === b; }).length;
    return MS().layout('high/chance', `<div class="hi">
      <div class="page-head"><div><h1>합격 가늠</h1><div class="sub">작년 입결과 내 성적을 비교해 안정·적정·상향 구간을 보여 줘요</div></div></div>
      <div class="card ch-how"><ol class="steps"><li><span><a href="https://www.adiga.kr" target="_blank" rel="noopener"><b>어디가 ↗</b></a> 또는 대학 입학처에서 지원 학과의 <b>작년 입결(70% 컷)</b> 확인</span></li><li><span>아래에 입력하면 내 성적(가채점·최근 모의고사·내신)이 자동으로 채워져요</span></li><li><span>구간을 보고 정시 3장·수시 6장을 상향·적정·안정으로 나눠 보세요</span></li></ol></div>
      ${h.chance.length ? `<div class="ch-sum mt12">${Object.entries(BL).map(([k, [n, c]]) => `<div style="--bc:${c}"><b>${cnt(k)}</b><span>${n}</span></div>`).join('')}</div>` : ''}
      <div class="ch-list mt12">${rows}</div>
      <button class="btn btn-primary mt12" data-act="chAdd" style="width:100%">+ 대학·학과 추가</button>
      <div class="card mt12"><p class="xs muted">구간 기준(등급 평균): 작년 컷보다 0.3등급 이상 좋으면 안정, ±0.2~0.3 안팎이면 적정, 0.6등급까지 부족하면 상향, 그 이상은 위험. 교과(내신)는 더 촘촘하게(0.15/0.1/0.35), 백분위는 +3/−2/−6점 기준이에요.</p>
        <p class="xs muted mt8"><b>합격 예측이 아닙니다.</b> 쌤픽은 입결 데이터를 수집하지 않고, 입력하신 작년 값과 단순 비교만 합니다. 입결은 해마다 모집 인원·지원자에 따라 크게 달라지며, 대학별 반영 비율·가산점은 반영되지 않아요. 최종 판단은 대학 모집요강과 여러 기관의 모의지원 결과를 함께 보세요.</p></div>
      <div class="hi-consult-anchor"></div></div>`);
  }

  /* ---------- 이벤트 ---------- */
  document.addEventListener('click', e => {
    const b = e.target.closest('[data-act]'); if (!b) return; const act = b.dataset.act; const H = {
      scG() { store().gc.g[b.dataset.k] = +b.dataset.v; save(); MS().render(); },
      scToMin() { const h = store(), g = grades(h); h.min.g = { kor: g.kor || '', math: g.math || '', eng: g.eng || '', t1: g.t1 || '', t2: g.t2 || '', his: g.his || '' }; save(); MS().toast('최저 계산기에 넣었어요'); MS().go('high/ipsi'); setTimeout(() => { const c = document.getElementById('tuMinCard'); if (c) c.scrollIntoView({ block: 'start', behavior: 'smooth' }); }, 250); },
      scToMock() { const h = store(), g = grades(h); const name = '수능 가채점'; h.mock = h.mock.filter(m => m.name !== name || m.date !== ymd(new Date())); h.mock.push({ id: uid(), name, date: ymd(new Date()), g: { kor: +g.kor || undefined, math: +g.math || undefined, eng: +g.eng || undefined, his: +g.his || undefined, soc: +g.t1 || undefined, sci: +g.t2 || undefined } }); h.gc.saved = ymd(new Date()); save(); MS().render(); MS().toast('등급 추이에 기록했어요'); },
      chAdd() { const h = store(); h.chance.push({ u: '', type: '정시', basis: 'grade', cut: '', mine: myDefault('정시') }); save(); MS().render(); },
      chDel() { const h = store(); h.chance.splice(+b.dataset.i, 1); save(); MS().render(); },
      chType() { const c = store().chance[+b.dataset.i]; c.type = b.dataset.v; if (c.type === '교과') c.basis = 'grade'; c.mine = myDefault(c.type) || c.mine; save(); MS().render(); },
      chBasis() { const c = store().chance[+b.dataset.i]; c.basis = b.dataset.v; c.cut = ''; c.mine = c.basis === 'grade' ? myDefault('정시') : ''; save(); MS().render(); }
    };
    if (H[act] && !b.disabled) { e.preventDefault(); H[act](); }
  });
  document.addEventListener('change', e => {
    const b = e.target.closest('[data-act]'); if (!b) return;
    if (b.dataset.act === 'scRaw') { const v = b.value === '' ? '' : Math.max(0, Math.min(+b.max, +b.value)); store().gc.raw[b.dataset.k] = v; save(); MS().render(); }
    else if (b.dataset.act === 'chF') { store().chance[+b.dataset.i][b.dataset.f] = b.value; save(); if (b.dataset.f !== 'u') MS().render(); }
  });

  window.ScoreApp = { gcPage, chancePage, band, engGrade, hisGrade, store };
})();
