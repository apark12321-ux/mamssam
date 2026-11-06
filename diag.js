/* 탑픽 — 상위권 진단 · 상대 위치 추정 · 시험 역산 과제표 */
(function () {
  const SB_URL = 'https://bjttfgoinspddtpsqseb.supabase.co/rest/v1/';
  const SB_KEY = 'sb_publishable_ceuUWQU_ry1sb4Aw1pjuBQ_6AU2H5vv';
  const N = 12;
  const MS = () => window.MS;
  const H = () => window.SubjApp._h;
  const esc = (s) => MS().esc(String(s == null ? '' : s));
  const GL = (g) => (window.GL ? window.GL(g) : g + '학년');
  const listKey = (k, g) => (k === 'math' && g >= 7 ? 'mth' : k);
  const SUBJ = ['kor', 'math', 'eng', 'sci', 'soc', 'his'];
  const PRIOR = { 12: 1, 11: 3, 10: 5, 9: 9, 8: 14, 7: 20, 6: 30, 5: 40, 4: 50, 3: 60, 2: 70, 1: 80, 0: 90 };

  function sb(path, opt) { return fetch(SB_URL + path, Object.assign({ headers: { apikey: SB_KEY, Authorization: 'Bearer ' + SB_KEY, 'Content-Type': 'application/json', Prefer: (opt && opt.prefer) || '' } }, opt)).then(r => r.ok ? r.json().catch(() => []) : []).catch(() => []); }
  function device() { try { return localStorage.getItem('ms_dev') || ''; } catch (e) { return ''; } }
  function store() { const s = MS().st(); s.diag = s.diag || {}; s.plan = s.plan || {}; return s; }
  function dg(kid) { return store().diag[(kid || MS().kid()).id] || null; }
  function topData(kid) { const s = MS().st(); s.top = s.top || {}; const t = s.top[kid.id] = s.top[kid.id] || { deep: {}, hard: {} }; t.rev = t.rev || {}; t.ms = t.ms || []; return t; }

  /* ---------- 문항 추출 ---------- */
  function subjectsFor(g) { const F = window.TopApp && TopApp.FILES.hard || {}; return SUBJ.filter(k => F[k] && H().unitsOf(listKey(k, g), g).length); }
  function pickItems(kid) {
    const g = kid.grade, subs = subjectsFor(g);
    return Promise.all(subs.map(k => TopApp.load('hard', k))).then(() => {
      const pools = subs.map(k => {
        const units = H().unitsOf(listKey(k, g), g).filter(u => (TopApp.DATA.hard[u.id] || []).length);
        const cur = units.filter(u => u.sem === kid.sem); const list = (cur.length >= 2 ? cur : units).slice();
        return { k, units: list.sort(() => Math.random() - .5) };
      }).filter(p => p.units.length);
      const out = [], used = new Set(); let round = 0;
      while (out.length < N && round < 20) {
        for (const p of pools) {
          if (out.length >= N) break;
          const u = p.units[round % p.units.length]; const items = TopApp.DATA.hard[u.id];
          const idxs = items.map((x, i) => i).filter(i => !used.has(u.id + '#' + i)); if (!idxs.length) continue;
          const i = idxs[Math.floor(Math.random() * idxs.length)]; used.add(u.id + '#' + i);
          out.push({ key: u.id + '#' + i, subj: p.k, unitId: u.id, q: items[i] });
        }
        round++;
      }
      out.sort((a, b) => subs.indexOf(a.subj) - subs.indexOf(b.subj));
      return out;
    });
  }

  /* ---------- 상대 위치 추정 ---------- */
  function percentile(grade, score) {
    return sb(`toppick_diag_dist?grade=eq.${grade}`).then(rows => {
      const n = rows.reduce((s, r) => s + r.n, 0);
      const prior = PRIOR[score];
      if (n < 10) return { top: prior, n, basis: 'prior' };
      const below = rows.filter(r => r.score < score).reduce((s, r) => s + r.n, 0), same = rows.filter(r => r.score === score).reduce((s, r) => s + r.n, 0);
      const emp = 100 - Math.round((below + same / 2) * 100 / n);
      const w = Math.min(n, 200) / 200;
      return { top: Math.max(1, Math.round(prior * (1 - w) + emp * w)), n, basis: 'blend' };
    });
  }

  /* ---------- 화면 ---------- */
  let S = null;
  function page(a) {
    const kid = MS().kid(), d = dg(kid);
    if (kid.grade <= 2) return MS().layout('diag', `<div class="page-head"><div><h1>🧪 상위권 진단</h1><div class="sub">초등 3학년부터 제공합니다.</div></div></div>`);
    const head = `<div class="page-head"><div><h1>🧪 상위권 진단</h1><div class="sub">${GL(kid.grade)} 전 과목 고난도 ${N}문항 · 약 15분 · 현재 위치와 약점 영역 산출</div></div></div>`;
    let body;
    if (S && S.kidId === kid.id) body = '<div id="dgBody"></div>';
    else if (d && !(a[2] === 'new')) body = resultHTML(kid, d) + `<div class="row mt16" style="gap:8px;justify-content:center"><a class="btn btn-primary" href="#home">오늘 과제 보기</a><a class="btn" href="#diag/x/new">다시 진단</a></div>`;
    else body = `<div class="card dg-intro">
        <ul class="dg-ul"><li>과목별 2문항씩, 현재 학기 단원 위주의 최상위 변별 문항으로 구성합니다.</li><li>문항마다 <b>확신 여부</b>를 함께 표시합니다. 확신했으나 틀린 문항(착각)이 학습 우선순위가 됩니다.</li><li>결과는 전체 이용자 응답 분포와 비교해 <b>상위 n%</b>로 표시하고, 약점 단원을 오늘 과제표에 바로 배정합니다.</li></ul>
        <button class="btn btn-primary btn-block mt12" data-dg="start">진단 시작</button></div>`;
    return MS().layout('diag', head + body);
  }
  function start() {
    const kid = MS().kid(); const box = document.getElementById('app').querySelector('.wrap');
    const b = document.createElement('div'); b.id = 'dgBody'; b.innerHTML = '<div class="card mt16"><div class="empty">문항을 준비하고 있습니다…</div></div>';
    const intro = document.querySelector('.dg-intro'); if (intro) intro.replaceWith(b); else box.appendChild(b);
    pickItems(kid).then(items => {
      if (items.length < 6) { b.innerHTML = '<div class="card mt16"><div class="empty">이 학년의 진단 문항이 아직 충분하지 않습니다.</div></div>'; return; }
      S = { kidId: kid.id, items, i: 0, res: [], sure: true }; draw();
    });
  }
  function draw() {
    const b = document.getElementById('dgBody'); if (!b || !S) return;
    const it = S.items[S.i], Sk = H().SK[listKey(it.subj, MS().kid().grade)] || {}, u = H().U(it.unitId);
    b.innerHTML = `<div class="card dg-q">
      <div class="row between"><span class="xs muted">문항 ${S.i + 1} / ${S.items.length}</span><span class="chip subj-chip on" style="--sc:${Sk.c}">${Sk.ic} ${Sk.n}</span></div>
      <div class="progress mt8"><i style="width:${Math.round(S.i * 100 / S.items.length)}%"></i></div>
      <div class="xs muted mt12">${esc(u ? u.title : '')}</div>
      <div class="dq-q mt4">${esc(it.q.q)}</div>
      <div class="hq-opts mt12">${it.q.o.map((o, j) => `<button class="lp-opt" data-dg="ans" data-j="${j}"><span class="lp-on">${'①②③④'[j]}</span><span>${esc(o)}</span></button>`).join('')}</div>
      <div class="row mt12" style="gap:6px;align-items:center"><span class="xs muted">이 답에</span><button class="chip ${S.sure ? 'on' : ''}" data-dg="sure" data-v="1">확신</button><button class="chip ${S.sure ? '' : 'on'}" data-dg="sure" data-v="0">불확실</button></div>
    </div>`;
    window.scrollTo(0, 0);
  }
  function answer(j) {
    const it = S.items[S.i], ok = j === it.q.a; S.res.push({ key: it.key, subj: it.subj, unitId: it.unitId, ok, sure: S.sure });
    fetch(SB_URL + 'rpc/toppick_item_hit', { method: 'POST', headers: { apikey: SB_KEY, Authorization: 'Bearer ' + SB_KEY, 'Content-Type': 'application/json' }, body: JSON.stringify({ p_grade: MS().kid().grade, p_key: it.key, p_ok: ok }) }).catch(() => { });
    S.i++; S.sure = true;
    if (S.i < S.items.length) draw(); else finish();
  }
  function finish() {
    const kid = MS().kid(), res = S.res, score = res.filter(r => r.ok).length;
    const b = document.getElementById('dgBody'); if (b) b.innerHTML = '<div class="card mt16"><div class="empty">결과를 산출하고 있습니다…</div></div>';
    percentile(kid.grade, score).then(p => {
      const bySubj = {}; res.forEach(r => { const s = bySubj[r.subj] = bySubj[r.subj] || { ok: 0, n: 0, ill: 0 }; s.n++; if (r.ok) s.ok++; if (!r.ok && r.sure) s.ill++; });
      const weak = Object.entries(bySubj).filter(([k, s]) => s.ok < s.n).sort((a, b) => (a[1].ok / a[1].n) - (b[1].ok / b[1].n)).map(([k]) => k);
      const d = { date: MS().today(), score, total: res.length, top: p.top, n: p.n, basis: p.basis, bySubj, weak, weakUnits: [...new Set(res.filter(r => !r.ok).map(r => r.unitId))], ill: res.filter(r => !r.ok && r.sure).length, hid: res.filter(r => r.ok && !r.sure).length, items: res };
      store().diag[kid.id] = d; delete store().plan[kid.id]; MS().save();
      sb('toppick_diag', { method: 'POST', body: JSON.stringify({ grade: kid.grade, score, total: res.length, device: device() }), prefer: 'return=minimal' });
      S = null;
      if (b) b.innerHTML = resultHTML(kid, d) + `<div class="row mt16" style="gap:8px;justify-content:center"><a class="btn btn-primary" href="#home">오늘 과제 받기</a><a class="btn" href="#diag/x/new">다시 진단</a></div>`;
      window.scrollTo(0, 0);
    });
  }
  function resultHTML(kid, d) {
    const g = kid.grade;
    const tier = d.top <= 3 ? '최상위권' : d.top <= 10 ? '상위권' : d.top <= 25 ? '상위권 경계' : '상위권 진입 준비';
    return `<div class="card dg-res"><div class="dg-top"><small>${GL(g)} 고난도 ${d.total}문항 기준</small><b>상위 ${d.top}%</b><span class="dg-tier">${tier}</span></div>
      <div class="grid g3 mth-res mt12"><div><b>${d.score}/${d.total}</b><span>정답</span></div><div><b class="${d.ill ? 'warn' : ''}">${d.ill}</b><span>착각 문항</span></div><div><b>${d.hid}</b><span>숨은 실력</span></div></div>
      <div class="dg-bars mt16">${Object.entries(d.bySubj).map(([k, s]) => { const Sk = H().SK[listKey(k, g)] || {}; return `<div class="dg-bar"><span>${Sk.ic} ${Sk.n}</span><div class="progress"><i style="width:${Math.round(s.ok * 100 / s.n)}%;background:${Sk.c}"></i></div><span class="xs">${s.ok}/${s.n}${s.ill ? ' · 착각 ' + s.ill : ''}</span></div>`; }).join('')}</div>
      <p class="small muted mt12">${d.weak.length ? `약점 영역: <b>${d.weak.map(k => (H().SK[listKey(k, g)] || {}).n).join(' · ')}</b>. 해당 단원의 심화·고난도 문항이 과제표에 우선 배정됩니다.` : '전 과목 전 문항 정답입니다. 과제표는 다음 학기 범위와 고난도 재도전으로 구성됩니다.'}${d.ill ? ' 확신했으나 틀린 문항은 개념 오해 가능성이 높아 백지 인출 과제가 함께 배정됩니다.' : ''}</p>
      <p class="xs muted">${d.basis === 'prior' ? '이용자 응답이 쌓이는 중이라 문항 난도 기준 추정치입니다.' : `${GL(g)} 이용자 ${d.n}명의 응답 분포와 비교한 추정치입니다.`} 진단일 ${d.date}</p></div>`;
  }

  /* ---------- 과제표 ---------- */
  const PHASES = [[28, '개념·심화기', '개념을 서술형으로 정리하고 심화 문항으로 깊이를 확보하는 시기'], [14, '고난도 집중기', '변별 문항을 매일 풀어 다단계 추론과 함정 대응력을 올리는 시기'], [7, '혼합·복습기', '과목을 섞어 풀고 간격 복습으로 장기 기억을 굳히는 시기'], [0, '인출·오답기', '백지 인출과 오답 재풀이로 시험 당일 꺼낼 수 있게 만드는 시기']];
  function phaseOf(dday) { if (dday == null) return null; return PHASES.find(p => dday >= p[0]) || PHASES[PHASES.length - 1]; }
  function unitPool(kid, d) {
    const g = kid.grade, F = window.TopApp ? TopApp.FILES : { hard: {}, deep: {} };
    const weak = (d ? d.weakUnits : []).map(id => H().U(id)).filter(Boolean);
    const rest = SUBJ.filter(k => F.hard[k] || F.deep[k]).flatMap(k => H().unitsOf(listKey(k, g), g, kid.sem)).filter(u => !weak.some(w => w.id === u.id));
    const seed = +MS().today().replace(/-/g, '') % 97;
    // 과목이 번갈아 나오도록 교차 배열 (약점 단원 우선)
    const interleave = (list) => { const by = {}; list.forEach(u => { const k = H().subjOf(u); (by[k] = by[k] || []).push(u); }); const keys = Object.keys(by), out = []; let i = 0; while (out.length < list.length) { const k = keys[i % keys.length]; if (by[k].length) out.push(by[k].shift()); i++; } return out; };
    return interleave(weak).concat(interleave(rest.sort((a, b) => ((a.no * 7 + seed) % 13) - ((b.no * 7 + seed) % 13))));
  }
  function buildPlan(kid, exam) {
    const d = dg(kid), pool = unitPool(kid, d), t = topData(kid), ph = exam ? phaseOf(exam.dday) : null;
    const dataKey = (u) => u.subj === 'mth' ? 'math' : (u.subj || 'math');
    const subjOf = (u) => (H().subjOf(u) === 'mth' ? 'math' : H().subjOf(u));
    const T = [];
    const usedU = []; const take = (list, n) => { const out = []; for (const u of list) { if (out.length >= n) break; if (usedU.includes(u.id)) continue; if (out.some(x => H().subjOf(x) === H().subjOf(u)) && list.length > n) continue; out.push(u); usedU.push(u.id); } return out; };
    const hardU = (n) => take(pool.filter(u => (TopApp.FILES.hard[subjOf(u)] || []).length), n);
    const deepU = (n) => take(pool.filter(u => (TopApp.FILES.deep[subjOf(u)] || []).length), n);
    const add = (type, u, label) => {
      const Sk = u ? H().SK[H().subjOf(u)] || {} : {};
      const href = { deep: u && `#study/top/deep/${subjOf(u)}/${u.id}`, hard: u && `#study/top/hard/${subjOf(u)}/${u.id}`, review: '#study/top/method/review', mix: '#study/top/method/mix', blank: '#study/top/method/blank', wrong: '#records' }[type];
      T.push({ id: type + ':' + (u ? u.id : '-'), type, unitId: u ? u.id : null, subj: u ? H().subjOf(u) : null, label: label || ({ deep: '심화 서술형', hard: '고난도 3문항', review: '간격 복습', mix: '섞어 풀기 10문항', blank: '백지 인출', wrong: '오답 재풀이' }[type]), title: u ? `${Sk.ic || ''} ${Sk.n || ''} · ${u.title}` : '', href, base: snapshot(type, u, t), done: false });
    };
    const name = ph ? ph[1] : null;
    if (name === '개념·심화기') { deepU(2).forEach(u => add('deep', u)); hardU(1).forEach(u => add('hard', u)); add('blank', null); }
    else if (name === '고난도 집중기') { hardU(3).forEach(u => add('hard', u)); add('review', null); }
    else if (name === '혼합·복습기') { add('mix', null); add('review', null); hardU(1).forEach(u => add('hard', u)); deepU(1).forEach(u => add('deep', u)); }
    else if (name === '인출·오답기') { add('blank', null); add('wrong', null); add('review', null); add('mix', null); }
    else { deepU(1).forEach(u => add('deep', u)); hardU(2, ).forEach(u => add('hard', u)); add('review', null); }
    if (d && d.ill && !T.some(x => x.type === 'blank')) add('blank', null, '백지 인출 (착각 문항 점검)');
    return { date: MS().today(), exam, phase: name, list: T };
  }
  function snapshot(type, u, t) {
    if (type === 'hard' && u) return (t.hard[u.id] || {}).tries || 0;
    if (type === 'deep' && u) return [0, 1, 2].filter(i => t.deep[u.id + '_' + i]).length;
    return t.ms.filter(m => m.date === MS().today() && m.kind === type).length;
  }
  function isDone(x, kid) {
    if (x.done) return true; const t = topData(kid);
    if (x.type === 'hard') return ((t.hard[x.unitId] || {}).tries || 0) > x.base;
    if (x.type === 'deep') return [0, 1, 2].filter(i => t.deep[x.unitId + '_' + i]).length > x.base;
    if (x.type === 'wrong') return false;
    return t.ms.filter(m => m.date === MS().today() && m.kind === x.type).length > x.base;
  }
  function plan(kid) {
    const s = store(); let p = s.plan[kid.id];
    const stale = !p || p.date !== MS().today();
    if (stale) { p = buildPlan(kid, p && p.exam && p.exam.from ? Object.assign({}, p.exam, { dday: ddayOf(p.exam.from) }) : null); s.plan[kid.id] = p; MS().save(); }
    return p;
  }
  function ddayOf(s) { const t = new Date(); t.setHours(0, 0, 0, 0); const d = new Date(+s.slice(0, 4), +s.slice(4, 6) - 1, +s.slice(6, 8)); return Math.round((d - t) / 864e5); }
  function syncExam(kid) {
    if (!window.SchoolApp || !SchoolApp.nextExam) return;
    SchoolApp.nextExam(kid).then(ex => {
      const s = store(), p = s.plan[kid.id]; const cur = p && p.exam ? p.exam.from : null;
      if ((ex ? ex.from : null) !== cur) { s.plan[kid.id] = buildPlan(kid, ex); MS().save(); const el = document.getElementById('dgHome'); if (el) el.outerHTML = homeCard(); }
      else if (p && ex && p.exam.dday !== ex.dday) { p.exam = ex; MS().save(); }
    });
  }

  /* ---------- 홈 카드 ---------- */
  function homeCard() {
    const kid = MS().kid(), d = dg(kid); if (kid.grade >= 10 || kid.grade <= 2) return '';
    if (!d) return `<a class="card dg-home cta" href="#diag" id="dgHome"><div class="row between"><b>🧪 상위권 진단으로 시작</b><span class="xs muted">${N}문항 · 15분 ›</span></div><div class="small muted mt4">현재 위치(상위 n%)와 약점 영역을 산출하고, 오늘 과제표를 자동으로 배정합니다.</div></a>`;
    const p = plan(kid); const list = p.list.map(x => Object.assign({}, x, { ok: isDone(x, kid) })); const done = list.filter(x => x.ok).length;
    setTimeout(() => syncExam(kid), 0);
    const Sk = (k) => H().SK[listKey(k, kid.grade)] || {};
    return `<div class="card dg-home" id="dgHome">
      <div class="row between"><div><b>📋 오늘 과제</b> <span class="xs muted">${done}/${list.length} 완료</span></div><a class="dg-pct" href="#diag">상위 ${d.top}% <span class="xs">${d.weak.length ? '약점 ' + d.weak.slice(0, 2).map(k => Sk(k).n).join('·') : '약점 없음'}</span> ›</a></div>
      ${p.exam ? `<div class="dg-phase"><b>${esc(p.exam.name)} D-${p.exam.dday === 0 ? 'DAY' : p.exam.dday}</b> · ${p.phase} <span class="xs muted">${(PHASES.find(x => x[1] === p.phase) || [])[2] || ''}</span></div>` : `<div class="dg-phase muted xs">학교를 등록하면 시험일 기준으로 과제가 역산 배정됩니다. <a href="#editkid">학교 등록 ›</a></div>`}
      <div class="dg-tasks mt8">${list.map((x, i) => `<div class="dg-task ${x.ok ? 'ok' : ''}"><button class="dg-chk" data-dg="done" data-i="${i}" aria-label="완료 표시">${x.ok ? '✓' : ''}</button><a href="${x.href}" class="dg-tl"><b>${x.label}</b>${x.title ? `<small>${esc(x.title)}</small>` : ''}</a></div>`).join('')}</div>
    </div>`;
  }

  /* ---------- 이벤트 ---------- */
  document.addEventListener('click', e => {
    const b = e.target.closest('[data-dg]'); if (!b) return;
    const t = b.dataset.dg;
    if (t === 'start') { e.preventDefault(); start(); }
    if (t === 'sure' && S) { S.sure = b.dataset.v === '1'; b.parentElement.querySelectorAll('.chip').forEach(c => c.classList.toggle('on', c === b)); }
    if (t === 'ans' && S) { b.closest('.hq-opts').querySelectorAll('.lp-opt').forEach(x => x.disabled = true); answer(+b.dataset.j); }
    if (t === 'done') { const kid = MS().kid(), p = store().plan[kid.id]; const x = p && p.list[+b.dataset.i]; if (x) { x.done = !x.done; MS().save(); const el = document.getElementById('dgHome'); if (el) el.outerHTML = homeCard(); } }
  });
  function after(a) {
    if ((a[0] === 'home' || !a[0]) && MS().st().kids.length) { const kid = MS().kid(), s = store(); if (kid.grade >= 10 || kid.grade <= 2) return; s._dgSeen = s._dgSeen || {}; if (!dg(kid) && !s._dgSeen[kid.id]) { s._dgSeen[kid.id] = 1; MS().save(); setTimeout(() => MS().go('diag'), 0); } }
  }
  window.DiagApp = { page, homeCard, after, plan, buildPlan };
})();
