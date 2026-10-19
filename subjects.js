/* 맘쌤 — 전과목 학습 (과목 허브 · 단원 · 학습 플레이어) */
(function () {
  'use strict';
  window.GL = (g) => g > 6 ? `중학교 ${g - 6}학년` : `초등 ${g}학년`;
  window.GS = (g) => g > 6 ? `중${g - 6}` : `${g}학년`;
  const SUBJ = [
    { k: 'kor', n: '국어', ic: '📖', c: '#E5484D' },
    { k: 'math', n: '수학', ic: '🔢', c: '#4A7DF0' },
    { k: 'mth', n: '수학', ic: '📐', c: '#4A7DF0' },
    { k: 'int', n: '통합교과', ic: '🌱', c: '#12A150' },
    { k: 'soc', n: '사회', ic: '🗺️', c: '#D97706' },
    { k: 'sci', n: '과학', ic: '🔬', c: '#0E9F9A' },
    { k: 'his', n: '역사', ic: '🏛️', c: '#9A6B3F' },
    { k: 'eng', n: '영어', ic: '🔤', c: '#7C3AED' },
    { k: 'mor', n: '도덕', ic: '🤝', c: '#DB2777' },
    { k: 'mus', n: '음악', ic: '🎵', c: '#2563EB' },
    { k: 'art', n: '미술', ic: '🎨', c: '#EA580C' },
    { k: 'pe', n: '체육', ic: '⚽', c: '#16A34A' },
    { k: 'prac', n: '실과', ic: '🛠️', c: '#64748B' }
  ];
  const SK = Object.fromEntries(SUBJ.map(s => [s.k, s]));
  const NAME_RE = [['kor', /국어|받아쓰기|맞춤법|글쓰기|독해|낱말|문법/], ['soc', /사회|지도|역사|경제|정치|지리/], ['sci', /과학|실험/], ['eng', /영어|english|알파벳|파닉스/i], ['mor', /도덕|인성|예절/], ['int', /통합교과|바른\s*생활|슬기로운|즐거운\s*생활|통합/], ['mus', /음악|리코더|노래|악보/], ['art', /미술|그리기|만들기/], ['pe', /체육|운동|줄넘기/], ['prac', /실과|코딩|요리|바느질/], ['math', /수학/]];

  const SU = () => window.SUBJ_UNITS || [];
  const MS = () => window.MS;
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const subjOf = (u) => (u && u.subj) || 'math';
  const allUnits = () => (MS() ? MS().units : (window.UNITS || [])).concat(SU());
  const U = (id) => (MS() && MS().U[id]) || allUnits().find(u => u.id === id);
  const unitsOf = (k, g, sem) => (k === 'math' ? (MS() ? MS().units : []) : SU().filter(u => u.subj === k)).filter(u => u.grade == g && (sem == null || u.sem == sem)).sort((a, b) => a.sem - b.sem || a.no - b.no);
  const gradesOf = (k) => k === 'math' ? [1, 2, 3, 4, 5, 6] : [...new Set(SU().filter(u => u.subj === k).map(u => u.grade))].sort();
  const subjsForGrade = (g) => SUBJ.filter(s => gradesOf(s.k).includes(g));
  const isStu = () => { try { return !!(MS() && MS().st().kids.length && MS().kid().grade >= 7); } catch (e) { return false; } };
  const inLvl = (g) => isStu() ? g >= 7 : g <= 6;
  const gradesL = (k) => gradesOf(k).filter(inLvl);
  const pct = (a, b) => b ? Math.round(a / b * 100) : 0;
  const shuffle = (a) => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);

  /* ---------- 썸네일 실패 처리 ---------- */
  window.vtErr = function (img) {
    if (!img.dataset.f) { img.dataset.f = '1'; img.src = img.src.replace('i.ytimg.com', 'img.youtube.com'); return; }
    const p = img.parentNode; if (p) p.classList.add('noimg'); img.remove();
  };

  /* ---------- 업로드 시 깨진 영상 메타 보정 ---------- */
  (function fixVids(V) {
    const CH = { '쪫샘수학': '쫌샘수학', '춤탱쑬학': '쩜탱쑤학' };
    for (const u in V) V[u].forEach(v => {
      if (CH[v.c]) v.c = CH[v.c];
      v.t = v.t.replace(/만렘/g, '만렙').replace(/얼마쩤/g, '얼마쯤').replace(/개념ㅡ학년/g, '개념ㅡ4학년').replace(/초3-2 개념수학/g, '초등3-2 개념수학');
    });
  })(window.UNIT_VIDEOS || {});

  /* ---------- 퀴즈 은행 (과목별 지연 로드) ---------- */
  const QB = {};
  const loading = {};
  const loaded = {};
  function loadQuiz(k, lv) {
    lv = lv || (isStu() ? 'm' : 'e');
    const key = k + lv;
    if (k === 'math' || loaded[key]) return Promise.resolve();
    if (loading[key]) return loading[key];
    const mt = (window.SUBJ_META || {})[k] || {};
    const n = (lv === 'm' ? mt.qpm : mt.qp) || 0, pre = lv === 'm' ? 'qm' : 'q';
    const one = (i) => new Promise((res) => {
      const s = document.createElement('script');
      s.src = `subjects/${pre}_${k}_${i}.js?v=${window.SUBJ_VER || 1}`;
      s.onload = () => res(true); s.onerror = () => res(false);
      document.head.appendChild(s);
    });
    loading[key] = Promise.all(Array.from({ length: n }, (_, i) => one(i + 1))).then(r => { if (r.includes(false)) delete loading[key]; else loaded[key] = 1; });
    return loading[key];
  }
  const qbOf = (u) => (QB[subjOf(u)] || {})[u.id] || [];
  function toProblem(u, q, i) {
    const opts = q.o.map(esc);
    return { t: 'choice', q: esc(q.q), opts, v: q.a, a: opts[q.a], ex: q.e ? esc(q.e) : '', l: q.l, qi: i };
  }
  function registerGens(k) {
    const MG = window.MathGen; if (!MG || !MG.register) return;
    Object.keys(QB[k] || {}).forEach(id => {
      MG.register(id, () => { const u = U(id); const bank = QB[k][id] || []; if (!u || !bank.length) return null; const i = Math.floor(Math.random() * bank.length); return toProblem(u, bank[i], i); });
    });
  }

  /* ---------- 학습 기록 ---------- */
  function sp() {
    const st = MS().st(), kid = MS().kid();
    st.sp = st.sp || {};
    const r = st.sp[kid.id] = st.sp[kid.id] || { done: {}, q: {}, cur: {} };
    r.done = r.done || {}; r.q = r.q || {}; r.cur = r.cur || {};
    return r;
  }
  function doneSet(u) {
    const s = new Set((sp().done[u.id] || []));
    if (subjOf(u) === 'math') MS().st().lessons.filter(l => l.kidId === MS().kid().id && l.unitId === u.id).forEach(l => s.add(l.lesson));
    return s;
  }
  function nextOf(k, g, sem) {
    const kid = MS().kid();
    if (k === 'math' && g === kid.grade && (sem == null || sem === kid.sem) && U(kid.unitId)) return { u: U(kid.unitId), l: kid.lesson };
    const r = sp();
    const curId = r.cur[k];
    const cur = curId && U(curId);
    const list = unitsOf(k, g, sem);
    const cand = cur && cur.grade == g && list.includes(cur) ? [cur].concat(list.filter(x => x !== cur)) : list;
    for (const u of cand) { const d = doneSet(u); for (let i = 0; i < u.lessons.length; i++) if (!d.has(i)) return { u, l: i }; }
    return list[0] ? { u: list[0], l: 0 } : null;
  }
  function unitStat(u) {
    const d = doneSet(u), q = sp().q[u.id];
    return { done: d.size, total: u.lessons.length, rate: q && q.t ? pct(q.ok, q.t) : null };
  }
  function subjProgress(k, g) {
    let a = 0, b = 0; unitsOf(k, g).forEach(u => { const s = unitStat(u); a += Math.min(s.done, s.total); b += s.total; });
    return pct(a, b);
  }

  /* ---------- 공통 조각 ---------- */
  const curSubj = () => { const st = MS().st(); const g = MS().kid().grade; let k = st._subj || 'math'; if (!gradesOf(k).includes(g) && !st._sg) k = 'math'; return k; };
  function subjTabs(active, g, base) {
    return `<div class="subj-tabs"><div class="chips scroll-x">${SUBJ.filter(s => gradesL(s.k).length).map(s => {
      const has = gradesOf(s.k).includes(g);
      return `<a class="chip subj-chip ${s.k === active ? 'on' : ''} ${has ? '' : 'dim'}" style="--sc:${s.c}" href="#${base}/${s.k}">${s.ic} ${s.n}${has && s.k !== 'math' ? ` <span class="xs">${subjProgress(s.k, g)}%</span>` : ''}</a>`;
    }).join('')}</div></div>`;
  }
  const vlist = (id) => (MS() ? MS().vids(id) : []);
  const lessonVids = (u, l) => vlist(u.id).filter(v => v.l.includes(l));
  const ovVids = (u) => vlist(u.id).filter(v => !v.l.length);
  function vcard(u, v) {
    const seen = MS().st().vw && MS().st().vw[v.i];
    return `<a class="vcard" href="#videos/${u.id}/${v.i}" data-act="vopen" data-unit="${u.id}" data-id="${v.i}"><span class="vthumb${MS().embed() ? '' : ' noimg'}">${MS().vimg(v.i)}<span class="vdur">${esc(v.d)}</span>${seen ? '<span class="vseen">✓ 시청</span>' : ''}</span><span class="vtitle">${esc(v.t)}</span><span class="vch">${esc(v.c)}</span></a>`;
  }

  /* ---------- 과목 허브 ---------- */
  function hub(a) {
    const st = MS().st(), kid = MS().kid();
    if (a[1] && SK[a[1]]) { st._subj = a[1]; }
    let k = st._subj && SK[st._subj] ? st._subj : (isStu() ? 'kor' : 'math');
    if (!gradesL(k).length) k = isStu() ? 'kor' : 'math';
    const gs = gradesL(k);
    let g = +(st._sg || kid.grade); if (!gs.includes(g)) g = gs.includes(kid.grade) ? kid.grade : gs[0];
    let sem = +(st._ss || kid.sem); if (sem !== 1 && sem !== 2) sem = 1;
    const S = SK[k];
    const nx = nextOf(k, g, sem);
    const list = unitsOf(k, g, sem);
    const meta = (window.SUBJ_META || {})[k] || {};
    const hero = nx ? `<div class="card sp-hero" style="--sc:${S.c}"><div class="sp-hero-top"><div class="sp-hero-ic">${nx.u.icon || S.ic}</div><div style="flex:1;min-width:0"><div class="h-label">${S.n} · ${GS(nx.u.grade)} ${nx.u.sem}학기 ${nx.u.no}단원 · ${nx.l + 1}/${nx.u.lessons.length}차시</div><div class="h-title">${esc(nx.u.lessons[nx.l])}</div><div class="h-unit">${esc(nx.u.title)}</div></div></div><div class="h-actions"><a class="btn btn-white btn-lg" href="#learn/${nx.u.id}/${nx.l}">▶ 이어서 학습</a><a class="btn" href="#study/u/${nx.u.id}">단원 보기</a></div></div>` : '';
    const cards = list.length ? list.map(u => {
      const s = unitStat(u);
      return `<a class="card unit-card sp-unit" href="#study/u/${u.id}" style="--sc:${S.c}"><div class="u-top"><div class="u-ico">${u.icon || S.ic}</div><div style="flex:1;min-width:0"><div class="u-no">${u.sem}학기 ${u.no}단원</div><div class="u-title">${esc(u.title)}</div></div></div><div class="progress"><i style="width:${pct(s.done, s.total)}%;background:${S.c}"></i></div><div class="row between xs muted"><span>차시 ${s.done}/${s.total}</span><span>${s.rate != null ? `정답률 ${s.rate}%` : `영상 ${vlist(u.id).length}개`}</span></div></a>`;
    }).join('') : `<div class="card" style="grid-column:1/-1"><div class="empty"><div class="e-ico">${S.ic}</div>${GS(g)} ${sem}학기 ${S.n} 단원이 없어요.</div></div>`;
    return MS().layout('study', `
      <div class="page-head"><div><h1>과목별 학습</h1><div class="sub">${isStu() ? '단원 개념 → 영상 → 스스로 정리 → 확인 문제 순서로 혼자 공부해요.' : '2022 개정 교육과정 · 단원 개념 → 영상 → 확인 문제를 차시별로 이어서 공부해요.'}</div></div></div>
      ${subjTabs(k, kid.grade, 'study')}
      ${hero}
      <div class="row sp-filter"><div class="chips">${gs.map(x => `<button class="chip ${x === g ? 'on' : ''}" data-sa="sg" data-g="${x}">${GS(x)}${x === kid.grade ? ' ●' : ''}</button>`).join('')}</div><span class="cur-sep"></span><div class="chips"><button class="chip ${sem === 1 ? 'on' : ''}" data-sa="ss" data-s="1">1학기</button><button class="chip ${sem === 2 ? 'on' : ''}" data-sa="ss" data-s="2">2학기</button></div></div>
      <div class="grid g3 mt16">${cards}</div>
      ${k === 'math' ? '<p class="small muted mt16">수학은 단원별 엄마 설명 대본·자동 출제 워크시트도 함께 쓸 수 있어요. <a href="#lessons">수학 수업 준비 ›</a></p>' : ''}
      ${(isStu() ? meta.pubNoteM : meta.pubNote) ? `<p class="xs muted mt16">※ ${esc(isStu() ? meta.pubNoteM : meta.pubNote)}</p>` : ''}`);
  }

  /* ---------- 단원 페이지 ---------- */
  function unitPage(id) {
    const u = U(id);
    if (!u) return hub(['study']);
    const k = subjOf(u), S = SK[k], st = MS().st();
    st._subj = k; st._sg = u.grade; st._ss = u.sem;
    sp().cur[k] = u.id;
    const d = doneSet(u), s = unitStat(u);
    const tab = st._utab || 'lessons';
    const nextL = (() => { for (let i = 0; i < u.lessons.length; i++) if (!d.has(i)) return i; return 0; })();
    const vids = vlist(u.id);
    const lessons = u.lessons.map((t, i) => {
      const lv = lessonVids(u, i).length;
      return `<a class="sp-lesson ${d.has(i) ? 'done' : ''} ${i === nextL ? 'cur' : ''}" href="#learn/${u.id}/${i}"><span class="lr-n">${d.has(i) ? '✓' : i + 1}</span><span class="sp-l-t">${esc(t)}</span>${lv ? `<span class="badge b-blue">▶ ${lv}</span>` : ''}<span class="sp-go">학습 ›</span></a>`;
    }).join('');
    const concept = `<div class="card"><div class="card-head"><h2>핵심 개념</h2></div><div class="concept" style="border-color:${S.c}">${esc(u.concept)}</div>
      <div class="grid g2 mt12"><div class="callout green"><div class="c-t">확인 질문</div>${esc(u.check)}</div><div class="callout orange"><div class="c-t">다음 학습과의 연결</div>${esc(u.next)}</div></div></div>`;
    const stu = u.grade >= 7;
    const guide = `<div class="card"><div class="card-head"><h2>${stu ? '스스로 공부 순서' : '엄마 설명 가이드'}</h2></div><ol class="steps">${(u.script || []).map(t => `<li><span>${esc(t)}</span></li>`).join('')}</ol>
      <div class="callout yellow mt12"><div class="c-t">${stu ? '생각 열기' : '집에서 하는 도입 활동'}</div>${esc(u.warmup)}</div>
      <h3 class="mt16">${stu ? '자주 틀리는 포인트' : '아이가 자주 헷갈리는 점'}</h3><ul class="warn-list mt8">${(u.mistakes || []).map(t => `<li>${esc(t)}</li>`).join('')}</ul></div>`;
    const video = `<div class="card"><div class="card-head"><h2>개념 영상 <span class="xs muted">${vids.length}개</span></h2>${vids.length ? `<a class="more" href="#videos/${u.id}">크게 보기 ›</a>` : ''}</div>${vids.length ? `<div class="sp-vgrid">${vids.slice(0, 12).map(v => vcard(u, v)).join('')}</div>` : '<p class="muted small">이 단원은 아직 검증된 영상이 없어요.</p>'}</div>`;
    const tabs = [['lessons', '차시'], ['concept', '개념'], ['video', `영상 ${vids.length}`], ['guide', stu ? '공부 가이드' : '엄마 가이드']];
    return MS().layout('study', `
      <div class="row" style="margin-bottom:6px"><a class="btn btn-ghost btn-sm" href="#study/${k}">← ${S.n} 단원 목록</a></div>
      <div class="page-head sp-uhead" style="--sc:${S.c}"><div style="min-width:0"><div class="muted small bold"><span class="badge" style="background:${S.c};color:#fff">${S.ic} ${S.n}</span> ${GS(u.grade)} ${u.sem}학기 · ${u.no}단원</div><h1>${u.icon || ''} ${esc(u.title)}</h1>
      <div class="row mt8" style="gap:8px"><div class="progress" style="width:140px"><i style="width:${pct(s.done, s.total)}%;background:${S.c}"></i></div><span class="xs muted">차시 ${s.done}/${s.total}${s.rate != null ? ` · 정답률 ${s.rate}%` : ''}</span></div></div>
      <div class="row sp-uact"><a class="btn btn-primary" style="background:${S.c};border-color:${S.c}" href="#learn/${u.id}/${nextL}">▶ ${nextL + 1}차시 학습</a><a class="btn" href="#learn/${u.id}/q">✏️ 단원 문제 10개</a><button class="btn" data-act="makeSheet" data-unit="${u.id}" data-level="1">🖨 워크시트</button></div></div>
      <div class="sp-tabs" role="tablist">${tabs.map(([t, n]) => `<button class="${t === tab ? 'on' : ''}" data-sa="utab" data-t="${t}">${n}</button>`).join('')}</div>
      <div class="sp-ugrid" data-tab="${tab}">
        <div class="stack"><section class="sp-sec" data-sec="lessons"><div class="card"><div class="card-head"><h2>차시</h2><span class="xs muted">눌러서 바로 학습</span></div><div class="sp-lessons">${lessons}</div></div></section>
        <section class="sp-sec" data-sec="video">${video}</section></div>
        <div class="stack"><section class="sp-sec" data-sec="concept">${concept}</section><section class="sp-sec" data-sec="guide">${guide}</section></div>
      </div>
      ${k === 'math' ? `<p class="small muted mt16"><a href="#lesson/${u.id}">수학 수업 카드(진도 지정·심화 워크시트) ›</a></p>` : ''}`);
  }

  function page(a) {
    if (a[1] === 'u' && a[2]) return unitPage(a[2]);
    return hub(a);
  }

  /* ---------- 학습 플레이어 ---------- */
  let LP = null;
  function learn(a) {
    const u = U(a[1]);
    if (!u) return hub(['study']);
    const k = subjOf(u), S = SK[k];
    const quizOnly = a[2] === 'q';
    const l = quizOnly ? -1 : Math.max(0, Math.min(u.lessons.length - 1, +a[2] || 0));
    sp().cur[k] = u.id;
    const kidMode = /[?&]k=1/.test(location.hash);
    LP = { u, k, l, quizOnly, kidMode, step: 0, steps: [], qs: null, qi: 0, ans: {}, vsel: 0, ready: false };
    const title = quizOnly ? `${u.title} · 단원 문제` : u.lessons[l];
    const back = kidMode ? '#kid' : `#study/u/${u.id}`;
    return `<div class="lp" style="--sc:${S.c}">
      <header class="lp-top"><a class="lp-x" href="${back}" aria-label="닫기">✕</a><div class="lp-tt"><div class="xs">${S.ic} ${S.n} · ${GS(u.grade)}-${u.sem} ${u.no}단원${quizOnly ? '' : ` · ${l + 1}/${u.lessons.length}차시`}</div><b>${esc(title)}</b></div><span class="lp-cnt" id="lpCnt"></span></header>
      <div class="lp-bar"><i id="lpBar"></i></div>
      <main class="lp-body" id="lpBody"><div class="empty">불러오는 중…</div></main>
      <footer class="lp-foot"><button class="btn btn-lg" data-sa="lprev" id="lpPrev">◀ 이전</button><button class="btn btn-lg btn-primary lp-next" data-sa="lnext" id="lpNext">다음 ▶</button></footer>
    </div>`;
  }

  function mathQuiz(u, n) {
    const MG = window.MathGen;
    if (!MG || !MG.generators[u.id]) return [];
    return MG.generate(u.id, n, 1).map(p => Object.assign({}, p, { math: true }));
  }
  function buildQs() {
    const { u, l, quizOnly } = LP;
    if (subjOf(u) === 'math') return mathQuiz(u, quizOnly ? 10 : 3);
    const bank = qbOf(u).map((q, i) => ({ q, i }));
    if (!bank.length) return [];
    let pickd;
    if (quizOnly) pickd = shuffle(bank).slice(0, 10);
    else {
      const own = shuffle(bank.filter(x => x.q.l === l));
      const rest = shuffle(bank.filter(x => x.q.l !== l));
      pickd = own.slice(0, 3).concat(rest).slice(0, 3);
    }
    return pickd.map(x => Object.assign(toProblem(u, x.q, x.i), { id: uid(), unitId: u.id }));
  }
  function buildSteps() {
    const { u, l, quizOnly } = LP;
    if (quizOnly) return ['quiz', 'done'];
    const steps = ['intro'];
    if (lessonVids(u, l).length || ovVids(u).length) steps.push('video');
    if (!LP.kidMode && ((u.script && u.script.length) || u.warmup)) steps.push('talk');
    steps.push('quiz', 'done');
    return steps;
  }
  function after(a) {
    if (a[0] === 'learn' && LP) {
      document.body.classList.add('lp-on');
      loadQuiz(LP.k, LP.u.grade >= 7 ? 'm' : 'e').then(() => {
        if (!LP) return;
        LP.steps = buildSteps(); LP.qs = buildQs(); LP.ready = true;
        if (!LP.qs.length) LP.steps = LP.steps.filter(s => s !== 'quiz');
        drawLP();
      });
      bindSwipe();
      return;
    }
    document.body.classList.remove('lp-on');
    LP = null;
    try { applyObSubj(); } catch (e) { }
    try { stuDecor(a); } catch (e) { }
    if (a[0] === 'ob' || a[0] === 'addkid' || a[0] === 'editkid') obInject(a[0] === 'editkid');
    if (!MS() || !MS().st().kids.length) return;
    try { applyPubOrder(); } catch (e) { }
    if (a[0] === 'home' || !a[0]) weekDecor();
    if (a[0] === 'videos') { const cu = U(a[1]) || U(MS().st()._vu); if (cu) { const gs = gradesOf(subjOf(cu)); document.querySelectorAll('[data-act="vgrade"]').forEach(b => { if (!inLvl(+b.dataset.g)) b.style.display = 'none'; else if (!gs.includes(+b.dataset.g)) { b.disabled = true; b.classList.add('dim'); } }); } }
    if (a[0] === 'videos') document.querySelectorAll('.vpick .scroll-x, .vpick .chips').forEach(row => {
      const on = row.querySelector('.chip.on, .on'); if (!on || row.scrollWidth <= row.clientWidth) return;
      row.scrollLeft = Math.max(0, on.offsetLeft - row.offsetLeft - (row.clientWidth - on.offsetWidth) / 2);
    });
    if (a[0] === 'settings') settingsDecor();
    if (a[0] === 'records') recordsDecor();
    if (a[0] === 'lessons') lessonsDecor();
    if (a[0] === 'sheets') { [...new Set(SU().map(u => u.subj))].forEach(loadQuiz); sheetsDecor(); }
  }

  function vidsForLP() {
    const { u, l } = LP;
    const lv = lessonVids(u, l), ov = ovVids(u);
    return lv.concat(ov.filter(v => !lv.includes(v))).slice(0, 4);
  }
  function stepHTML(name) {
    const { u, l } = LP;
    const S = SK[LP.k];
    if (name === 'intro') {
      return `<div class="lp-card pop"><div class="lp-emoji">🎯</div><div class="lp-kicker">오늘 배울 것</div><h2 class="lp-h">${esc(u.lessons[l])}</h2>
        <div class="concept mt16" style="border-color:${S.c}">${esc(u.concept)}</div>
        ${l === 0 && u.warmup ? `<div class="callout yellow mt12"><div class="c-t">시작 활동</div>${esc(u.warmup)}</div>` : ''}
        <div class="lp-path mt16">${LP.steps.map((s, i) => `<span class="${i === LP.step ? 'on' : ''}">${{ intro: '목표', video: '영상', talk: u.grade >= 7 ? '정리' : '이야기', quiz: '문제', done: '완료' }[s]}</span>`).join('<i>›</i>')}</div></div>`;
    }
    if (name === 'video') {
      const vs = vidsForLP(); const v = vs[LP.vsel] || vs[0];
      const player = MS().embed()
        ? (LP.playing === v.i ? `<div class="vp"><iframe src="https://www.youtube-nocookie.com/embed/${v.i}?autoplay=1&rel=0&modestbranding=1&playsinline=1" title="${esc(v.t)}" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen></iframe></div>`
          : `<button class="vp vp-facade" data-sa="lpplay" aria-label="영상 재생">${MS().vimg(v.i, 'hqdefault')}<span class="vp-play">▶</span></button>`)
        : `<a class="vp vp-facade noimg" href="https://www.youtube.com/watch?v=${v.i}" target="_blank" rel="noopener"><span class="vp-play">▶</span><span class="vp-note">유튜브에서 열립니다</span></a>`;
      if (LP.playing === v.i) { const st = MS().st(); st.vw = st.vw || {}; st.vw[v.i] = MS().today(); MS().save(); }
      return `<div class="lp-card pop"><div class="lp-kicker">🎬 개념 영상</div>${player}<div class="bold mt12">${esc(v.t)}</div><div class="small muted">${esc(v.c)} · ${esc(v.d)}</div>
        ${vs.length > 1 ? `<div class="lp-vlist mt12">${vs.map((x, i) => `<button class="lp-vopt ${i === LP.vsel ? 'on' : ''}" data-sa="lpv" data-i="${i}"><span class="vthumb${MS().embed() ? '' : ' noimg'}">${MS().vimg(x.i)}<span class="vdur">${esc(x.d)}</span></span><span class="vtitle">${esc(x.t)}</span></button>`).join('')}</div>` : ''}</div>`;
    }
    if (name === 'talk') {
      return `<div class="lp-card pop"><div class="lp-emoji">${u.grade >= 7 ? '📝' : '💬'}</div><div class="lp-kicker">${u.grade >= 7 ? '스스로 정리하기 — 순서대로 따라 해 보자' : '엄마랑 이야기하기'}</div>
        <ol class="steps mt12">${(u.script || []).map(t => `<li><span>${esc(t)}</span></li>`).join('')}</ol>
        ${(u.mistakes || []).length ? `<div class="callout orange mt12"><div class="c-t">이것만 조심!</div>${esc(u.mistakes[l % u.mistakes.length])}</div>` : ''}</div>`;
    }
    if (name === 'quiz') return quizHTML();
    if (name === 'done') return doneHTML();
    return '';
  }

  function quizHTML() {
    const qs = LP.qs, i = LP.qi, p = qs[i], an = LP.ans[i];
    const dots = qs.map((_, j) => `<i class="${LP.ans[j] ? (LP.ans[j].ok ? 'o' : 'x') : j === i ? 'cur' : ''}"></i>`).join('');
    let body;
    if (p.t === 'choice') {
      body = `<div class="lp-opts">${p.opts.map((o, j) => {
        let cls = ''; if (an) { if (j === p.v) cls = 'ok'; else if (j === an.sel) cls = 'no'; }
        return `<button class="lp-opt ${cls}" data-sa="lpans" data-j="${j}" ${an ? 'disabled' : ''}><span class="lp-on">${'①②③④⑤'[j] || j + 1}</span><span>${o}</span></button>`;
      }).join('')}</div>`;
    } else {
      body = `<form class="lp-inp" data-sa-form="1"><input class="input kid-input" id="lpIn" inputmode="${p.t === 'frac' || p.t === 'list' ? 'text' : 'decimal'}" autocomplete="off" placeholder="${p.t === 'frac' ? '예: 3/4 또는 1 2/3' : p.t === 'list' ? '쉼표로 구분' : '답'}" ${an ? 'disabled' : ''} value="${an ? esc(an.given) : ''}">${p.unit ? `<span class="bold">${p.unit}</span>` : ''}${an ? '' : '<button class="btn btn-primary btn-lg">확인</button>'}</form>`;
    }
    const fb = an ? `<div class="feedback ${an.ok ? 'ok' : 'no'}">${an.ok ? '정답이에요! 👏' : `정답은 ${p.t === 'choice' ? p.opts[p.v] : p.a}${p.unit && p.t !== 'choice' ? ' ' + p.unit : ''}`}</div>${p.ex ? `<div class="lp-ex">${p.ex}</div>` : ''}${an.msg ? `<div class="small muted">${esc(an.msg)}</div>` : ''}` : '';
    return `<div class="lp-card"><div class="kid-progress">${dots}</div><div class="lp-kicker">✏️ 확인 문제 ${i + 1}/${qs.length}</div><div class="lp-q">${p.q}${p.fig || ''}</div>${body}${fb}</div>`;
  }

  function doneHTML() {
    const { u, l, quizOnly, qs } = LP;
    const ok = Object.values(LP.ans).filter(a => a.ok).length, tot = qs ? qs.length : 0;
    if (!LP.saved) saveResult(ok, tot);
    const nl = !quizOnly && l + 1 < u.lessons.length ? l + 1 : null;
    const nu = (() => { if (nl != null) return null; const list = unitsOf(LP.k, u.grade).concat(unitsOf(LP.k, u.grade + 1)); const i = list.indexOf(u); return list[i + 1] || null; })();
    return `<div class="lp-card pop" style="text-align:center"><div class="big-emoji">${!tot || ok / tot >= .8 ? '🎉' : ok / tot >= .5 ? '👍' : '💪'}</div>
      <h2 class="lp-h">${quizOnly ? '단원 문제 완료!' : `${l + 1}차시 학습 완료!`}</h2>
      ${tot ? `<div class="lp-score">${ok} / ${tot}</div><div class="small muted">맞힌 문제마다 칭찬 코인 1개를 받았어요</div>` : ''}
      ${u.check ? `<div class="callout green mt16" style="text-align:left"><div class="c-t">${u.grade >= 7 ? '스스로 설명해 보기' : '엄마에게 설명해 보기'}</div>${esc(u.check)}</div>` : ''}
      <div class="lp-donebtns mt16">
        ${nl != null ? `<a class="btn btn-primary btn-lg" href="#learn/${u.id}/${nl}${LP.kidMode ? '?k=1' : ''}">다음 차시: ${esc(u.lessons[nl])} ▶</a>` : ''}
        ${nu && !LP.kidMode ? `<a class="btn btn-primary btn-lg" href="#study/u/${nu.id}">다음 단원: ${esc(nu.title)} ▶</a>` : ''}
        ${tot && ok < tot ? `<button class="btn btn-lg" data-sa="lretry">틀린 문제 다시</button>` : ''}
        <a class="btn btn-lg" href="${LP.kidMode ? '#kid' : '#study/u/' + u.id}">${LP.kidMode ? '공부방으로' : '단원으로'}</a>
      </div></div>`;
  }

  function saveResult(ok, tot) {
    LP.saved = true;
    const { u, l, quizOnly, k } = LP;
    const r = sp(), st = MS().st(), kid = MS().kid();
    if (tot) { const q = r.q[u.id] = r.q[u.id] || { ok: 0, t: 0 }; q.ok += ok; q.t += tot; }
    if (!quizOnly) {
      const d = new Set(r.done[u.id] || []); d.add(l); r.done[u.id] = [...d].sort((a, b) => a - b);
      const today = MS().today();
      if (!st.lessons.some(x => x.kidId === kid.id && x.unitId === u.id && x.lesson === l && x.date === today)) st.lessons.push({ kidId: kid.id, date: today, unitId: u.id, lesson: l, subj: k });
    }
    if (!quizOnly && k === 'math' && kid.unitId === u.id && kid.lesson === l && MS().next) {
      const n = MS().next(u.id, l); const nu = U(n.unitId);
      if (nu) { kid.unitId = n.unitId; kid.lesson = n.lesson; kid.grade = nu.grade; kid.sem = nu.sem; }
    }
    kid.coins = (kid.coins || 0) + ok;
    MS().save();
  }

  function drawLP() {
    if (!LP || !LP.ready) return;
    const body = document.getElementById('lpBody'); if (!body) return;
    const name = LP.steps[LP.step];
    body.innerHTML = stepHTML(name);
    body.scrollTop = 0; window.scrollTo(0, 0);
    const bar = document.getElementById('lpBar');
    let prog = LP.step / Math.max(1, LP.steps.length - 1);
    if (name === 'quiz' && LP.qs.length) prog = (LP.step + (LP.qi + (LP.ans[LP.qi] ? 1 : 0)) / LP.qs.length) / Math.max(1, LP.steps.length - 1);
    if (bar) bar.style.width = Math.round(Math.min(1, prog) * 100) + '%';
    const cnt = document.getElementById('lpCnt'); if (cnt) cnt.textContent = `${LP.step + 1}/${LP.steps.length}`;
    const prev = document.getElementById('lpPrev'), next = document.getElementById('lpNext');
    if (prev) prev.disabled = LP.step === 0 && (name !== 'quiz' || LP.qi === 0);
    if (next) {
      next.style.display = name === 'done' ? 'none' : '';
      if (name === 'quiz') { const an = LP.ans[LP.qi]; next.disabled = !an; next.textContent = LP.qi + 1 < LP.qs.length ? '다음 문제 ▶' : '결과 보기 ▶'; }
      else { next.disabled = false; next.textContent = LP.steps[LP.step + 1] === 'quiz' ? '문제 풀기 ▶' : '다음 ▶'; }
    }
    const inp = document.getElementById('lpIn'); if (inp && !inp.disabled && !matchMedia('(pointer:coarse)').matches) inp.focus();
  }

  function answer(given, sel) {
    const p = LP.qs[LP.qi];
    let ok, msg = '';
    if (p.t === 'choice') ok = sel === p.v;
    else { const r = window.MathGen.check(p, given); if (r.empty) return; ok = !!r.ok; msg = r.msg || ''; }
    LP.ans[LP.qi] = { ok, sel, given, msg };
    if (!ok) {
      const st = MS().st(), kid = MS().kid();
      const pid = p.origId || p.id;
      if (!st.wrong.some(w => w.pid === pid)) st.wrong.unshift({ kidId: kid.id, pid, p: Object.assign({}, p, { id: pid, unitId: LP.u.id }), date: MS().today(), given: p.t === 'choice' ? sel : given });
      MS().save();
    }
    drawLP();
    const fb = document.querySelector('.lp-body .feedback'); if (fb) fb.classList.add(ok ? 'pop' : 'shake');
  }

  function go(d) {
    if (!LP || !LP.ready) return;
    const name = LP.steps[LP.step];
    if (name === 'quiz') {
      if (d > 0) { if (!LP.ans[LP.qi]) return; if (LP.qi + 1 < LP.qs.length) { LP.qi++; return drawLP(); } }
      else if (LP.qi > 0) { LP.qi--; return drawLP(); }
    }
    const n = LP.step + d;
    if (n < 0 || n >= LP.steps.length) return;
    LP.step = n; LP.playing = null; drawLP();
  }

  function bindSwipe() {
    const body = document.getElementById('lpBody'); if (!body) return;
    let x0 = null, y0 = null;
    body.addEventListener('touchstart', e => { const t = e.touches[0]; x0 = t.clientX; y0 = t.clientY; }, { passive: true });
    body.addEventListener('touchend', e => {
      if (x0 == null) return; const t = e.changedTouches[0]; const dx = t.clientX - x0, dy = t.clientY - y0; x0 = null;
      if (Math.abs(dx) > 70 && Math.abs(dx) > Math.abs(dy) * 1.6 && !e.target.closest('iframe,.lp-vlist,input')) go(dx < 0 ? 1 : -1);
    }, { passive: true });
  }



  /* ---------- 과목별 교과서 출판사 ---------- */
  const NATIONAL = ['kor', 'mor', 'int'];
  const PUBS = () => (window.PUBLISHERS || ['선택 안 함', '천재교육', '천재교과서', '동아출판', '미래엔', '비상교육', '아이스크림미디어', '와이비엠', '지학사', '금성출판사', '대교', '기타']);
  const PUB_RE = { '천재교육': /천재/, '천재교과서': /천재/, '동아출판': /동아/, '미래엔': /미래엔/, '비상교육': /비상/, '아이스크림미디어': /아이스크림|i-?scream/i, '와이비엠': /YBM|와이비엠/i, '지학사': /지학사|티솔루션/, '금성출판사': /금성/, '대교': /대교/ };
  function kidPubs(kid) {
    kid = kid || MS().kid();
    if (!kid.pubs) { kid.pubs = {}; if (kid.publisher && kid.publisher !== '선택 안 함') kid.pubs.math = kid.publisher; }
    return kid.pubs;
  }
  const isNat = (k, g) => (g || 0) <= 6 && NATIONAL.includes(k);
  const pubOf = (k, kid) => isNat(k, (kid || MS().kid()).grade) ? '국정' : (kidPubs(kid)[k] || '선택 안 함');
  function pubLine(kid) {
    const ps = kidPubs(kid);
    const set = kidSubjs(kid).filter(k => !isNat(k, kid.grade) && ps[k] && ps[k] !== '선택 안 함').map(k => `${SK[k].n} ${ps[k]}`);
    const nat = kidSubjs(kid).filter(k => isNat(k, kid.grade)).map(k => SK[k].n);
    return (set.length ? set.join(' · ') : '아직 고르지 않았어요') + (nat.length ? ` (${nat.join('·')}는 국정)` : '');
  }
  function pubSelects(kid, ks, pubs, attr, g) {
    g = g || (kid ? kid.grade : 1);
    const list = ks.filter(k => !isNat(k, g));
    const nat = ks.filter(k => isNat(k, g));
    return `<div class="pub-grid">${list.map(k => `<label class="pub-row" style="--sc:${SK[k].c}"><span class="pub-s">${SK[k].ic} ${SK[k].n}</span><select class="input" ${attr}="${k}">${PUBS().map(p => `<option ${p === (pubs[k] || '선택 안 함') ? 'selected' : ''}>${p}</option>`).join('')}</select></label>`).join('')}</div>${nat.length ? `<p class="xs muted mt8">${nat.map(k => SK[k].n).join('·')}는 국정 교과서라 출판사를 고르지 않아도 돼요.</p>` : ''}`;
  }
  let pubSig = '';
  function applyPubOrder() {
    const kid = MS().kid(); const ps = kidPubs(kid);
    const sig = kid.id + JSON.stringify(ps); if (sig === pubSig) return; pubSig = sig;
    const V = window.UNIT_VIDEOS || {};
    for (const id in V) {
      const u = U(id); if (!u) continue;
      const p = ps[subjOf(u)]; const re = p && PUB_RE[p];
      V[id].forEach((v, i) => { if (v._o == null) v._o = i; });
      V[id].sort((a, b) => (re ? (re.test(b.t + ' ' + b.c) - re.test(a.t + ' ' + a.c)) : 0) || a._o - b._o);
    }
  }

  /* ---------- 과목 · 시간표 ---------- */
  const DAYN = ['일', '월', '화', '수', '목', '금', '토'];
  const WEEK = [1, 2, 3, 4, 5, 6, 0];
  const pad = (n) => String(n).padStart(2, '0');
  const ymd = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  function defSubjs(g) {
    const base = g >= 7 ? ['kor', 'mth', 'eng', 'sci', 'soc', 'his'] : g <= 2 ? ['kor', 'math', 'int'] : ['kor', 'math', 'soc', 'sci', 'eng'];
    return base.filter(k => (k === 'math' && g <= 6) || gradesOf(k).includes(g));
  }
  function kidSubjs(kid) {
    kid = kid || MS().kid();
    const ok = subjsForGrade(kid.grade).map(s => s.k);
    let a = (kid.subjs || defSubjs(kid.grade)).filter(k => ok.includes(k));
    if (!a.length) a = defSubjs(kid.grade);
    return SUBJ.map(s => s.k).filter(k => a.includes(k));
  }
  function defTT(kid) {
    const subs = kidSubjs(kid);
    const core = subs.filter(k => k === 'kor' || k === 'math' || k === 'mth' || k === 'eng' && kid.grade >= 7);
    const rest = subs.filter(k => !core.includes(k));
    const tt = {};
    WEEK.filter(d => (kid.days || []).includes(d)).forEach((d, i) => {
      tt[d] = core.concat(rest.length ? [rest[i % rest.length]] : []);
      if (!tt[d].length) tt[d] = [subs[i % subs.length]];
    });
    return tt;
  }
  function ensureTT(kid) {
    kid = kid || MS().kid();
    const subs = kidSubjs(kid), def = defTT(kid);
    let ch = false;
    if (!kid.tt) { kid.tt = def; ch = true; }
    const tt = kid.tt;
    Object.keys(tt).forEach(d => { if (!(kid.days || []).includes(+d)) { delete tt[d]; ch = true; } });
    (kid.days || []).forEach(d => {
      if (!tt[d]) { tt[d] = def[d] || subs.slice(0, 2); ch = true; }
      const f = tt[d].filter(k => subs.includes(k)); if (f.length !== tt[d].length) { tt[d] = f; ch = true; }
    });
    if (ch) MS().save();
    return tt;
  }
  const todaySubjs = (kid, d) => { d = d || new Date(); kid = kid || MS().kid(); return (kid.days || []).includes(d.getDay()) ? (ensureTT(kid)[d.getDay()] || []) : []; };
  const doneToday = (kid, date) => new Set(MS().st().lessons.filter(l => l.kidId === kid.id && l.date === (date || MS().today())).map(l => l.subj || 'math'));
  function nextFor(k) { const kid = MS().kid(); return nextOf(k, kid.grade, kid.sem) || nextOf(k, kid.grade); }

  function hero(orig, today) {
    const kid = MS().kid(); ensureTT(kid);
    today = today instanceof Date ? today : new Date();
    const badge = (orig.match(/<span class="badge">[^<]*<\/span>/) || [''])[0];
    const lab = ((orig.match(/<div class="h-label">([^<]*)/) || [])[1] || '').split(' · ')[0] || `${today.getMonth() + 1}월 ${today.getDate()}일 (${DAYN[today.getDay()]})`;
    const subs = todaySubjs(kid, today), done = doneToday(kid);
    const row = (k) => {
      const S = SK[k], nx = nextFor(k); if (!nx) return '';
      const d = done.has(k);
      return `<a class="tt-row ${d ? 'done' : ''}" href="#learn/${nx.u.id}/${nx.l}" style="--sc:${S.c}"><span class="tt-ic">${S.ic}</span><span class="tt-m"><span class="tt-s">${S.n} · ${esc(nx.u.title)}</span><span class="tt-l">${esc(nx.u.lessons[nx.l])}</span></span><span class="tt-go">${d ? '✓ 완료' : '시작'}</span></a>`;
    };
    if (subs.length) {
      const first = subs.find(k => !done.has(k)), nx = first && nextFor(first);
      return `<div class="card hero tt-hero"><div class="h-top"><div><div class="h-label">${lab} · ${kid.grade >= 7 ? '오늘의 공부' : '오늘의 엄마표 수업'} ${kid.minutes || 30}분</div><div class="h-title">${first ? `오늘은 ${subs.map(k => SK[k].n).join(' · ')}` : '오늘 공부를 모두 마쳤어요 🎉'}</div></div>${badge}</div>
        <div class="tt-list">${subs.map(row).join('')}</div>
        <div class="h-actions">${nx ? `<a class="btn btn-white" href="#learn/${nx.u.id}/${nx.l}">▶ ${SK[first].n}부터 시작</a>` : `<a class="btn btn-white" href="#study">더 공부하기</a>`}<a class="btn" href="#settings">시간표 바꾸기</a></div></div>`;
    }
    let nd = null;
    for (let i = 1; i <= 7; i++) { const d = new Date(today); d.setDate(d.getDate() + i); if ((kid.days || []).includes(d.getDay())) { nd = d; break; } }
    const ns = nd ? (kid.tt[nd.getDay()] || []) : [];
    const f = ns[0] || kidSubjs(kid)[0], fx = f && nextFor(f);
    return `<div class="card hero tt-hero"><div class="h-top"><div><div class="h-label">${lab}</div><div class="h-title">오늘은 쉬는 날이에요</div><div class="h-unit">${nd ? `다음 수업 ${nd.getMonth() + 1}월 ${nd.getDate()}일 (${DAYN[nd.getDay()]}) · ${ns.map(k => SK[k].ic + ' ' + SK[k].n).join('  ')}` : '수업 요일을 정해 주세요'}</div></div>${badge}</div>
      <div class="h-actions">${fx ? `<a class="btn btn-white" href="#learn/${fx.u.id}/${fx.l}">그래도 오늘 공부하기</a>` : ''}<a class="btn" href="#study">과목별 학습</a></div></div>`;
  }

  function weekDecor() {
    const wk = document.querySelector('.week'); if (!wk) return;
    const kid = MS().kid(); ensureTT(kid);
    const card = wk.closest('.card');
    if (card) { const h = card.querySelector('h2'); if (h) h.textContent = '이번 주 시간표'; const m = card.querySelector('.more'); if (m) m.textContent = '시간표 바꾸기'; }
    const now = new Date(); const mon = new Date(now); mon.setDate(now.getDate() - ((now.getDay() + 6) % 7));
    const todayS = MS().today(); if (ymd(now) !== todayS) return;
    [...wk.children].forEach((c, i) => {
      const d = new Date(mon); d.setDate(mon.getDate() + i);
      const ds = ymd(d), lab = c.querySelector('.d-l'); if (!lab) return;
      const done = doneToday(kid, ds);
      const plan = (kid.days || []).includes(d.getDay()) ? (kid.tt[d.getDay()] || []) : [];
      if (done.size) { c.classList.add('done'); c.classList.remove('off'); lab.innerHTML = `<span class="wk-ic">${[...done].map(k => (SK[k] || SK.math).ic).join('')}</span>✓`; lab.title = [...done].map(k => (SK[k] || SK.math).n).join(', '); }
      else if (ds >= todayS && plan.length) { c.classList.remove('off'); lab.innerHTML = `<span class="wk-ic">${plan.map(k => SK[k].ic).join('')}</span><span class="wk-n">${plan.map(k => SK[k].n).join('·')}</span>`; lab.title = plan.map(k => SK[k].n).join(', '); }
    });
  }

  function settingsDecor() {
    const main = document.querySelector('.page-head'); if (!main || document.querySelector('.tt-card')) return;
    const kid = MS().kid(); ensureTT(kid);
    const subs = subjsForGrade(kid.grade), mine = kidSubjs(kid);
    const days = WEEK.filter(d => (kid.days || []).includes(d));
    const el = document.createElement('div');
    el.className = 'card tt-card mb16';
    el.innerHTML = `<div class="card-head"><h2>📅 과목 · 시간표</h2><button class="btn btn-sm" data-sa="ttreset">추천 시간표로</button></div>
      <div class="small muted">함께 공부할 과목</div>
      <div class="chips mt8">${subs.map(s => `<button class="chip subj-chip ${mine.includes(s.k) ? 'on' : ''}" style="--sc:${s.c}" data-sa="ttsub" data-k="${s.k}">${s.ic} ${s.n}</button>`).join('')}</div>
      <div class="tt-grid mt16">${days.map(d => `<div class="tt-day"><b>${DAYN[d]}</b><div class="chips">${mine.map(k => `<button class="chip subj-chip ${kid.tt[d].includes(k) ? 'on' : ''}" style="--sc:${SK[k].c}" data-sa="ttcell" data-d="${d}" data-k="${k}">${SK[k].ic} ${SK[k].n}</button>`).join('')}</div></div>`).join('') || '<p class="muted small">수업 요일이 없어요. 아이 정보 \'수정\'에서 요일을 골라 주세요.</p>'}</div>
      <p class="xs muted mt8">요일마다 공부할 과목을 눌러 켜고 끄세요. 수업 요일·시간은 아이 정보의 '수정'에서 바꿀 수 있어요.</p>
      <h3 class="mt16">과목별 교과서 출판사</h3><p class="xs muted">학교에서 받은 교과서 표지 아래쪽 출판사를 골라 주세요. 같은 출판사 영상이 먼저 보여요.</p>
      <div class="mt8">${pubSelects(kid, mine, kidPubs(kid), 'data-pubset', kid.grade)}</div>`;
    main.insertAdjacentElement('afterend', el);
  }

  function recordsDecor() {
    const head = document.querySelector('.page-head'); if (!head || document.querySelector('.sp-rec')) return;
    const kid = MS().kid(), g = kid.grade;
    const rows = kidSubjs(kid).map(k => {
      const S = SK[k]; let a = 0, b = 0, ok = 0, t = 0;
      unitsOf(k, g).forEach(u => { const s = unitStat(u); a += Math.min(s.done, s.total); b += s.total; const q = sp().q[u.id]; if (q) { ok += q.ok; t += q.t; } });
      const last = MS().st().lessons.filter(l => l.kidId === kid.id && (l.subj || 'math') === k).map(l => l.date).sort().pop();
      return `<a class="sp-rec-row" href="#study/${k}" style="--sc:${S.c}"><span class="tt-ic">${S.ic}</span><div style="flex:1;min-width:0"><div class="row between"><b>${S.n}</b><span class="xs muted">${a}/${b}차시${t ? ` · 정답률 ${pct(ok, t)}%` : ''}${last ? ` · 최근 ${last.slice(5).replace('-', '/')}` : ''}</span></div><div class="progress mt8"><i style="width:${pct(a, b)}%;background:${S.c}"></i></div></div></a>`;
    }).join('');
    const el = document.createElement('div');
    el.className = 'card sp-rec mb16';
    el.innerHTML = `<div class="card-head"><h2>과목별 진도 · ${GS(g)}</h2><a class="more" href="#study">과목별 학습 ›</a></div><div class="sp-rec-list">${rows}</div>`;
    const tiles = head.nextElementSibling;
    (tiles || head).insertAdjacentElement('afterend', el);
  }

  function lessonsDecor() {
    const head = document.querySelector('.page-head'); if (!head || document.querySelector('.les-subj')) return;
    const kid = MS().kid();
    const el = document.createElement('div'); el.className = 'les-subj mb16';
    el.innerHTML = `<div class="chips scroll-x">${kidSubjs(kid).concat(subjsForGrade(kid.grade).map(s => s.k).filter(k => !kidSubjs(kid).includes(k))).map(k => { const S = SK[k]; return k === 'math' ? `<span class="chip subj-chip on" style="--sc:${S.c}">${S.ic} ${S.n}</span>` : `<a class="chip subj-chip" style="--sc:${S.c}" href="#study/${k}" data-sa="toguide">${S.ic} ${S.n}</a>`; }).join('')}</div><p class="xs muted mt8">다른 과목은 단원마다 '엄마 가이드' 탭에 설명 대본·도입 활동·헷갈리는 점이 정리되어 있어요.</p>`;
    head.insertAdjacentElement('afterend', el);
  }

  function genOpts(k, g, sel) {
    if (k === 'math') return [1, 2].map(sem => `<optgroup label="${g}학년 ${sem}학기">${unitsOf('math', g, sem).map(u => `<option value="${u.id}" ${u.id === sel ? 'selected' : ''}>${u.no}. ${esc(u.title)}</option>`).join('')}</optgroup>`).join('');
    const list = unitsOf(k, g);
    return list.length ? `<optgroup label="${SK[k].n} ${GS(g)}">${list.map(u => `<option value="${u.id}" ${u.id === sel ? 'selected' : ''}>${u.sem}학기 ${u.no}. ${esc(u.title)}</option>`).join('')}</optgroup>` : `<option value="">${GS(g)} ${SK[k].n} 단원이 없어요</option>`;
  }
  function sheetsDecor() {
    const sel = document.getElementById('genUnit'); if (!sel || document.getElementById('genSubj')) return;
    const st = MS().st(), cur = U(sel.value);
    let k = st._genSubj || subjOf(cur);
    const ks = SUBJ.filter(s => (s.k === 'math' && !isStu()) || SU().some(u => u.subj === s.k && inLvl(u.grade))).map(s => s.k);
    if (!ks.includes(k)) k = ks[0];
    const gEl0 = document.getElementById('genGrade'); if (gEl0) { [...gEl0.options].forEach(o => { if (!inLvl(+o.value)) o.remove(); }); if (!(cur && inLvl(cur.grade)) || !gradesOf(k).includes(+gEl0.value)) gEl0.value = gradesOf(k).includes(MS().kid().grade) ? MS().kid().grade : gradesL(k)[0]; }
    const wrap = document.createElement('div'); wrap.className = 'field';
    wrap.innerHTML = `<label>과목</label><div class="chips scroll-x" id="genSubj">${ks.map(x => `<button type="button" class="chip subj-chip ${x === k ? 'on' : ''}" style="--sc:${SK[x].c}" data-sa="gensubj" data-k="${x}">${SK[x].ic} ${SK[x].n}</button>`).join('')}</div>`;
    const box = sel.closest('.form-grid') || sel.closest('.field');
    box.parentNode.insertBefore(wrap, box);
    const g = +(document.getElementById('genGrade') || {}).value || MS().kid().grade;
    if (subjOf(cur) !== k) { sel.innerHTML = genOpts(k, g, sel.value); }
    else sel.innerHTML = genOpts(k, g, sel.value);
  }

  /* 아이 등록·수정: 과목 고르기 */
  function obInject(edit) {
    const f = document.getElementById('obForm'); if (!f || f.querySelector('.ob-subj')) return;
    const dayEl = document.getElementById('obDays'); if (!dayEl) return;
    const gEl = document.getElementById('obGrade');
    const kid = edit && MS() && MS().st().kids.length ? MS().kid() : null;
    let picked = kid ? kidSubjs(kid) : null;
    const field = document.createElement('div'); field.className = 'field ob-subj';
    const draw = () => {
      const g = +gEl.value; const avail = subjsForGrade(g);
      const sel = (picked || defSubjs(g)).filter(k => avail.some(s => s.k === k));
      field.innerHTML = `<label>함께 공부할 과목 <span class="xs muted">(설정에서 요일별 시간표로 바꿀 수 있어요)</span></label><div class="chips" id="obSubj">${avail.map(s => `<button type="button" class="chip subj-chip ${sel.includes(s.k) ? 'on' : ''}" style="--sc:${s.c}" data-k="${s.k}">${s.ic} ${s.n}</button>`).join('')}</div>
        <label class="mt16" style="display:block">과목별 교과서 출판사 <span class="xs muted">(모르면 비워 두세요)</span></label>${pubSelects(null, sel, pubs, 'data-obpub', g)}`;
    };
    const pubs = Object.assign({}, kid ? kidPubs(kid) : {});
    window._obPubs = pubs;
    draw();
    const pub = f.querySelector('select[name=publisher]');
    (pub ? pub.closest('.field') : dayEl.closest('.field')).insertAdjacentElement('beforebegin', field);
    field.addEventListener('click', e => { const b = e.target.closest('[data-k]'); if (!b) return; b.classList.toggle('on'); picked = [...field.querySelectorAll('.chip.on')].map(x => x.dataset.k); draw(); });
    field.addEventListener('change', e => { const k = e.target.dataset.obpub; if (k) pubs[k] = e.target.value; });
    const oldPub = f.querySelector('select[name=publisher]'); if (oldPub) oldPub.closest('.field').style.display = 'none';
    const stuForm = () => {
      const g = +gEl.value, stu = g >= 7;
      const lab = (sel, a, b) => { const el = f.querySelector(sel); const l = el && el.closest('.field') && el.closest('.field').querySelector('label'); if (l) l.firstChild.textContent = stu ? a : b; };
      lab('input[name=name]', '이름', '아이 이름 또는 애칭');
      lab('#obDays', '공부 요일', '엄마표 수업 요일');
      lab('#obMin', '하루 공부 시간', '하루 수업 시간');
      const h = f.querySelector('h2'); if (h && !kid) h.textContent = stu ? '나의 정보를 입력해 주세요' : '아이 정보를 알려 주세요';
      const lh = document.querySelector('.ob-left h1'); if (lh) { lh.dataset.o = lh.dataset.o || lh.innerHTML; lh.innerHTML = stu ? '중학생은 혼자서도<br>충분히 할 수 있어요' : lh.dataset.o; }
      const uSel = document.getElementById('obUnit');
      if (uSel && stu) { const m = (MS() ? MS().units : []).filter(u => u.grade === 6); const fb = (kid && U(kid.unitId) && U(kid.unitId).grade <= 6 ? U(kid.unitId) : m[m.length - 1]); if (fb) uSel.innerHTML = `<option value="${fb.id}" selected>${fb.id}</option>`; }
    };
    stuForm();
    gEl.addEventListener('change', () => { picked = null; draw(); stuForm(); });
    document.getElementById('obSem') && document.getElementById('obSem').addEventListener('change', () => setTimeout(stuForm, 0));
    const txt = document.querySelector('.ob-feats');
    if (txt) txt.querySelectorAll('.of-d').forEach(d => { d.textContent = d.textContent.replace('단원별 문제 자동 출제', '과목·단원별 문제 자동 출제'); });
  }
  function applyObSubj() {
    const o = window._obSubj; if (!o || !MS() || !MS().st().kids.length) return;
    window._obSubj = null;
    const kid = MS().kid();
    const same = kid.subjs && kid.subjs.join() === o.join();
    if (o.length) kid.subjs = o;
    if (window._obPubs) { kid.pubs = Object.assign({}, window._obPubs); kid.publisher = kid.pubs.math || '선택 안 함'; window._obPubs = null; }
    if (!same) kid.tt = null;
    ensureTT(kid);
  }
  document.addEventListener('submit', e => {
    if (e.target.id !== 'obForm') return;
    const ks = [...document.querySelectorAll('#obSubj .chip.on')].map(b => b.dataset.k);
    window._obSubj = ks;
  }, true);
  document.addEventListener('change', e => {
    if (e.target.dataset && e.target.dataset.pubset) { const kid = MS().kid(); kidPubs(kid)[e.target.dataset.pubset] = e.target.value; if (e.target.dataset.pubset === 'math') kid.publisher = e.target.value; MS().save(); MS().toast(`${SK[e.target.dataset.pubset].n} 교과서를 ${e.target.value}(으)로 저장했어요`); document.querySelectorAll('.li-s').forEach(x => { if (x.textContent === '교과서 출판사' && x.nextElementSibling) x.nextElementSibling.textContent = pubLine(kid); }); pubSig = ''; return; }
    if (e.target.id === 'genGrade' && document.getElementById('genSubj')) setTimeout(() => {
      const sel = document.getElementById('genUnit'); const k = MS().st()._genSubj || 'math';
      if (sel && document.getElementById('genSubj')) { const g = +e.target.value; sel.innerHTML = genOpts(k, g, sel.value); sel.dispatchEvent(new Event('change', { bubbles: true })); }
    }, 0);
  });

  function chatUnit() { const kid = MS().kid(); const done = doneToday(kid); const k = todaySubjs(kid).find(x => !done.has(x)) || kidSubjs(kid)[0]; const nx = k && nextFor(k); return nx ? nx.u : null; }
  function subjLine(kid) { return kidSubjs(kid).map(k => SK[k].n).join(' · '); }
  function kidVidUnit() {
    const kid = MS().kid(); const done = doneToday(kid);
    const ks = todaySubjs(kid).filter(k => !done.has(k)).concat(kidSubjs(kid));
    for (const k of ks) { const nx = nextFor(k); if (nx && vlist(nx.u.id).length) return nx; }
    return null;
  }
  function chatToday() {
    const kid = MS().kid(); ensureTT(kid);
    const subs = todaySubjs(kid), done = doneToday(kid);
    const line = (k) => { const nx = nextFor(k); return nx ? `${SK[k].ic} ${SK[k].n}${done.has(k) ? ' (완료)' : ''} — ${nx.u.title} ${nx.l + 1}차시 「${nx.u.lessons[nx.l]}」\n   도입: ${nx.u.warmup || ''}` : ''; };
    if (subs.length) {
      const acts = subs.map(k => { const nx = nextFor(k); return nx ? [`${SK[k].n} 시작`, 'nav', `learn/${nx.u.id}/${nx.l}`] : null; }).filter(Boolean).slice(0, 3);
      return { text: `오늘은 ${subs.map(k => SK[k].n).join('·')} 수업이에요. (${kid.minutes || 30}분)\n\n${subs.map(line).filter(Boolean).join('\n\n')}\n\n과목마다 '시작'을 누르면 도입 → 영상 → 설명 → 확인 문제 순서로 진행돼요.`, actions: acts };
    }
    let nd = null; for (let i = 1; i <= 7; i++) { const d = new Date(); d.setDate(d.getDate() + i); if ((kid.days || []).includes(d.getDay())) { nd = d; break; } }
    const ns = nd ? kid.tt[nd.getDay()] || [] : [];
    return { text: `오늘은 쉬는 날이에요.${nd ? `\n다음 수업은 ${nd.getMonth() + 1}월 ${nd.getDate()}일(${DAYN[nd.getDay()]}) ${ns.map(k => SK[k].n).join('·')}예요.` : ''}\n\n원하면 오늘도 가볍게 한 과목 해 볼 수 있어요.`, actions: [['과목별 학습', 'nav', 'study'], ['시간표 바꾸기', 'nav', 'settings']] };
  }

  /* ---------- 중학생 자기주도 홈 ---------- */
  function streak(kid) {
    const ds = new Set(MS().st().lessons.filter(l => l.kidId === kid.id).map(l => l.date));
    let n = 0; const d = new Date(); if (!ds.has(ymd(d))) d.setDate(d.getDate() - 1);
    while (ds.has(ymd(d))) { n++; d.setDate(d.getDate() - 1); }
    return n;
  }
  function stuHome() {
    const kid = MS().kid(), st = MS().st(); ensureTT(kid);
    const now = new Date(); const mon = new Date(now); mon.setDate(now.getDate() - ((now.getDay() + 6) % 7));
    const wk = ymd(mon);
    const mine = st.lessons.filter(l => l.kidId === kid.id);
    const weekN = mine.filter(l => l.date >= wk).length;
    let ok = 0, t = 0; const r = sp(); Object.keys(r.q).forEach(id => { const u = U(id); if (u && u.grade >= 7) { ok += r.q[id].ok; t += r.q[id].t; } });
    const wrong = st.wrong.filter(w => w.kidId === kid.id).length;
    const sk = streak(kid);
    const week = [...Array(7)].map((_, i) => { const d = new Date(mon); d.setDate(mon.getDate() + i); const ds = ymd(d); const done = doneToday(kid, ds); const plan = (kid.days || []).includes(d.getDay()) ? (kid.tt[d.getDay()] || []) : []; const today = ds === MS().today();
      return `<div class="day ${today ? 'today' : ''} ${done.size ? 'done' : ''} ${!plan.length && !done.size ? 'off' : ''}"><span class="d-w">${DAYN[d.getDay()]}</span><span class="d-n">${d.getDate()}</span><span class="d-l"><span class="wk-ic">${(done.size ? [...done] : plan).map(k => (SK[k] || SK.kor).ic).join('')}</span>${done.size ? '✓' : plan.length ? `<span class="wk-n">${plan.map(k => SK[k].n).join('·')}</span>` : '쉬는 날'}</span></div>`; }).join('');
    const tip = ['개념 영상은 1.25배속으로 보고, 핵심 정리를 노트에 3줄로 써 보자.', '틀린 문제는 다음 날 다시 풀어야 진짜 내 것이 돼.', '25분 공부하고 5분 쉬기(뽀모도로)로 집중력을 지키자.', '시험 2주 전에는 단원 문제 10개를 매일 한 단원씩 풀어 보자.'][now.getDate() % 4];
    return MS().layout('home', `
      <div class="page-head"><div><h1>${esc(kid.name)}의 공부 계획</h1><div class="sub">${GL(kid.grade)} ${kid.sem}학기 · 주 ${(kid.days || []).length}회 ${kid.minutes || 30}분 · 스스로 공부</div></div></div>
      ${hero(`<span class="badge">연속 ${sk}일</span>`, now)}
      <div class="grid g4 mt16">
        <div class="tile"><div class="t-label">연속 공부</div><div class="t-val">${sk}<small>일</small></div></div>
        <div class="tile"><div class="t-label">이번 주 마친 차시</div><div class="t-val">${weekN}<small>차시</small></div></div>
        <div class="tile"><div class="t-label">확인 문제 정답률</div><div class="t-val">${t ? pct(ok, t) : '–'}<small>${t ? '%' : ''}</small></div></div>
        <div class="tile"><div class="t-label">오답 노트</div><div class="t-val">${wrong}<small>문항</small></div></div>
      </div>
      ${wrong ? `<div class="card mt16 stu-wrong"><div class="row between"><div><h2>🔁 오답 다시 풀기</h2><div class="small muted">틀린 문제 ${wrong}개가 기다리고 있어. 맞히면 오답 노트에서 빠져.</div></div><a class="btn btn-primary" href="#sheets">다시 풀기</a></div></div>` : ''}
      ${homeCard()}
      <div class="card mt16"><div class="card-head"><h2>이번 주 시간표</h2><a class="more" href="#settings">시간표 바꾸기</a></div><div class="week">${week}</div></div>
      <div class="card mt16"><div class="card-head"><h2>💡 오늘의 공부 팁</h2></div><p>${tip}</p><p class="small muted mt8">공부 순서: 개념 영상 → 스스로 정리 → 확인 문제 → 오답 다시 풀기</p></div>`);
  }
  function stuDecor(a) {
    document.body.classList.toggle('is-stu', isStu());
    if (!isStu()) return;
    document.querySelectorAll('.brand-sub').forEach(x => x.textContent = '스스로 공부');
    if (a[0] === 'videos' && !a[1]) { const k = kidSubjs()[0]; const nx = k && nextFor(k); if (nx) { setTimeout(() => MS().go('videos/' + nx.u.id), 0); } }
    if (a[0] === 'settings') document.querySelectorAll('.card h2').forEach(h => { if (h.textContent.trim() === '아이 모드 잠금') h.closest('.card').style.display = 'none'; if (h.textContent.trim() === '아이 정보') h.textContent = '내 정보'; if (h.textContent.trim() === '아이 목록') h.textContent = '사용자 목록'; });
    if (a[0] === 'records') document.querySelectorAll('.t-label').forEach(x => { if (x.textContent === '엄마표 수업') x.textContent = '공부한 날'; });
    if (['lessons', 'chat', 'contents', 'scraps', 'kid'].includes(a[0])) MS().go('home');
  }

  /* ---------- 이벤트 ---------- */
  document.addEventListener('click', e => {
    // 과목 워크시트: 퀴즈 은행을 먼저 불러온 뒤 원래 동작 실행
    const ms = e.target.closest('[data-act="makeSheet"],[data-act="genSheet"]');
    if (ms && !ms.dataset.ready) {
      const id = ms.dataset.act === 'genSheet' ? (document.getElementById('genUnit') || {}).value : ms.dataset.unit;
      const u = id && U(id);
      if (u && u.subj && !loaded[u.subj + (u.grade >= 7 ? 'm' : 'e')]) { e.preventDefault(); e.stopImmediatePropagation(); loadQuiz(u.subj, u.grade >= 7 ? 'm' : 'e').then(() => { ms.dataset.ready = '1'; ms.click(); delete ms.dataset.ready; }); return; }
    }
    const el = e.target.closest('[data-sa]'); if (!el) return;
    const a = el.dataset.sa, st = MS().st();
    if (a === 'sg') { st._sg = +el.dataset.g; MS().render(); }
    else if (a === 'ss') { st._ss = +el.dataset.s; MS().render(); }
    else if (a === 'utab') { st._utab = el.dataset.t; const g = document.querySelector('.sp-ugrid'); if (g) g.dataset.tab = el.dataset.t; document.querySelectorAll('.sp-tabs button').forEach(b => b.classList.toggle('on', b === el)); window.scrollTo({ top: Math.min(window.scrollY, (document.querySelector('.sp-tabs').offsetTop || 0) - 60), behavior: 'smooth' }); }
    else if (a === 'lnext') go(1);
    else if (a === 'lprev') go(-1);
    else if (a === 'lpans') answer(null, +el.dataset.j);
    else if (a === 'lpv') { LP.vsel = +el.dataset.i; LP.playing = null; drawLP(); }
    else if (a === 'lpplay') { const v = vidsForLP()[LP.vsel] || vidsForLP()[0]; LP.playing = v.i; drawLP(); }
    else if (a === 'lretry') {
      const wrong = LP.qs.filter((_, i) => LP.ans[i] && !LP.ans[i].ok).map(p => Object.assign({}, p, { id: uid() }));
      LP.qs = wrong; LP.qi = 0; LP.ans = {}; LP.saved = true; LP.step = LP.steps.indexOf('quiz'); LP.retry = true; drawLP();
    }
    else if (a === 'ttsub' || a === 'ttcell' || a === 'ttreset') {
      const kid = MS().kid(); ensureTT(kid);
      if (a === 'ttsub') {
        const k = el.dataset.k; let s = kidSubjs(kid);
        s = s.includes(k) ? s.filter(x => x !== k) : s.concat(k);
        if (!s.length) return MS().toast('과목을 하나 이상 골라 주세요');
        kid.subjs = SUBJ.map(x => x.k).filter(x => s.includes(x));
        if (s.includes(k)) { const days = Object.keys(kid.tt).map(Number); if (days.length && !days.some(d => kid.tt[d].includes(k))) { const d = days.sort((x, y) => kid.tt[x].length - kid.tt[y].length)[0]; kid.tt[d].push(k); } }
      } else if (a === 'ttcell') {
        const d = +el.dataset.d, k = el.dataset.k, row = kid.tt[d] || (kid.tt[d] = []);
        kid.tt[d] = row.includes(k) ? row.filter(x => x !== k) : kidSubjs(kid).filter(x => row.includes(x) || x === k);
      } else { kid.tt = defTT(kid); MS().toast('추천 시간표로 바꿨어요'); }
      ensureTT(kid); MS().save(); MS().render();
    }
    else if (a === 'gensubj') {
      const k = el.dataset.k; st._genSubj = k;
      document.querySelectorAll('#genSubj .chip').forEach(b => b.classList.toggle('on', b === el));
      const sel = document.getElementById('genUnit'), gEl = document.getElementById('genGrade');
      let g = +gEl.value; const gs = gradesL(k);
      if (!gs.includes(g)) { g = gs.includes(MS().kid().grade) ? MS().kid().grade : gs[0]; if ([...gEl.options].some(o => +o.value === g)) gEl.value = g; }
      sel.innerHTML = genOpts(k, g, null);
      sel.dispatchEvent(new Event('change', { bubbles: true }));
    }
    else if (a === 'toguide') { st._utab = 'guide'; }
    else if (a === 'vsubj') {
      const k = el.dataset.k, kid = MS().kid();
      const g = gradesOf(k).includes(kid.grade) ? kid.grade : gradesL(k)[0];
      const nx = g === kid.grade ? nextFor(k) : null;
      const list = (nx ? [nx.u] : []).concat(unitsOf(k, g, kid.sem), unitsOf(k, g));
      const t = list.find(u => vlist(u.id).length) || list[0];
      if (t) { st._vu = t.id; MS().go('videos/' + t.id); }
    }
  }, true);
  document.addEventListener('submit', e => {
    if (!e.target.matches('[data-sa-form]')) return;
    e.preventDefault(); const inp = document.getElementById('lpIn'); if (inp) answer(inp.value, null);
  });
  document.addEventListener('keydown', e => {
    if (!LP || !LP.ready || e.target.matches('input,textarea')) return;
    if (e.key === 'ArrowRight') go(1); else if (e.key === 'ArrowLeft') go(-1);
    else if (/^[1-5]$/.test(e.key) && LP.steps[LP.step] === 'quiz' && !LP.ans[LP.qi] && LP.qs[LP.qi].t === 'choice' && +e.key <= LP.qs[LP.qi].opts.length) answer(null, +e.key - 1);
  });

  /* ---------- app.js 연결 지점 ---------- */
  function homeCard() {
    const kid = MS().kid(), g = kid.grade;
    const ks = kidSubjs(kid).concat(subjsForGrade(g).map(s => s.k).filter(k => !kidSubjs(kid).includes(k)));
    const items = ks.map(k => ({ s: SK[k], nx: nextFor(k), p: subjProgress(k, g) })).filter(x => x.nx);
    if (!items.length) return '';
    return `<div class="card mt16 sp-home"><div class="card-head"><h2>🎒 과목별 이어서 학습</h2><a class="more" href="#study">전체 보기 ›</a></div><div class="sp-home-row">${items.map(({ s, nx, p }) =>
      `<a class="sp-hcard" style="--sc:${s.c}" href="#learn/${nx.u.id}/${nx.l}"><div class="row between"><span class="sp-hs">${s.ic} ${s.n}</span><span class="xs muted">${p}%</span></div><div class="sp-hl">${esc(nx.u.lessons[nx.l])}</div><div class="xs muted">${esc(nx.u.title)} · ${nx.l + 1}차시</div><div class="progress mt8"><i style="width:${p}%;background:${s.c}"></i></div></a>`).join('')}</div></div>`;
  }
  function kidCard() {
    const kid = MS().kid(); ensureTT(kid);
    const today = todaySubjs(kid), done = doneToday(kid);
    const ks = today.concat(kidSubjs(kid).filter(k => !today.includes(k)));
    const items = ks.map(k => ({ s: SK[k], nx: nextFor(k), t: today.includes(k), d: done.has(k) })).filter(x => x.nx).slice(0, 8);
    if (!items.length) return '';
    return `<div class="kid-card mb16"><h2 style="font-size:19px">🎒 ${today.length ? '오늘 공부할 과목' : '공부할 과목'}</h2><div class="kid-subj mt12">${items.map(({ s, nx, t, d }) =>
      `<a class="kid-sbtn ${d ? 'done' : ''}" style="--sc:${s.c}" href="#learn/${nx.u.id}/${nx.l}?k=1"><span class="ks-ic">${d ? '✅' : s.ic}</span><span class="ks-n">${s.n}${t && !d ? ' <span class="ks-t">오늘</span>' : ''}</span><span class="ks-l">${esc(nx.u.lessons[nx.l])}</span></a>`).join('')}</div></div>`;
  }
  function vsubj(d) {
    const k = subjOf(d);
    const ks = SUBJ.filter(s => (s.k === 'math' && !isStu()) || SU().some(u => u.subj === s.k && inLvl(u.grade) && vlist(u.id).length));
    if (ks.length < 2) return '';
    return `<div class="vsubj-row">${ks.map(s => `<button class="chip subj-chip ${s.k === k ? 'on' : ''}" style="--sc:${s.c}" data-sa="vsubj" data-k="${s.k}">${s.ic} ${s.n}</button>`).join('')}</div>`;
  }
  function optgroups(g, sel) {
    return SUBJ.filter(s => s.k !== 'math').map(s => {
      const list = unitsOf(s.k, g); if (!list.length) return '';
      return `<optgroup label="${s.n} ${GS(g)}">${list.map(u => `<option value="${u.id}" ${u.id === sel ? 'selected' : ''}>${u.sem}학기 ${u.no}. ${esc(u.title)}</option>`).join('')}</optgroup>`;
    }).join('');
  }
  function subjIn(q) {
    q = String(q || '');
    for (const [k, re] of NAME_RE) if (re.test(q)) return k;
    return null;
  }

  window.SubjApp = {
    page, learn, after, homeCard, kidCard, vsubj, optgroups, subjIn, loadQuiz, hero, subjLine, kidVidUnit, chatToday, chatUnit, pubLine, isStu, stuHome,
    addQuiz(k, data) { QB[k] = Object.assign(QB[k] || {}, data); registerGens(k); },
    SUBJ
  };
})();
