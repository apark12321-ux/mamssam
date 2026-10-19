/* 맘쌤 — 최상위 학습 (공교육 심화 · 사교육 최상위) */
(function () {
  const FILES = {"deep":{"eng":["top/d_eng_1.js","top/d_eng_2.js"],"his":["top/d_his_1.js"],"kor":["top/d_kor_1.js","top/d_kor_2.js","top/d_kor_3.js","top/d_kor_4.js","top/d_kor_5.js"],"math":["top/d_math_1.js","top/d_math_2.js","top/d_math_3.js"],"sci":["top/d_sci_1.js","top/d_sci_2.js"],"soc":["top/d_soc_1.js","top/d_soc_2.js"]},"hard":{"eng":["top/h_eng_1.js","top/h_eng_2.js","top/h_eng_3.js"],"his":["top/h_his_1.js"],"kor":["top/h_kor_1.js","top/h_kor_2.js","top/h_kor_3.js","top/h_kor_4.js","top/h_kor_5.js","top/h_kor_6.js","top/h_kor_7.js"],"math":["top/h_math_1.js","top/h_math_2.js","top/h_math_3.js","top/h_math_4.js"],"sci":["top/h_sci_1.js","top/h_sci_2.js","top/h_sci_3.js"],"soc":["top/h_soc_1.js","top/h_soc_2.js","top/h_soc_3.js"]}};
  const DATA = { deep: {}, hard: {} };
  const loaded = {};
  const MS = () => window.MS;
  const H = () => window.SubjApp._h;
  const esc = (s) => MS().esc(String(s == null ? '' : s));
  const GS = (g) => (window.GS ? window.GS(g) : g + '학년');
  const GL = (g) => (window.GL ? window.GL(g) : g + '학년');

  function add(kind, obj) { Object.assign(DATA[kind], obj); }
  function load(kind, subj) {
    const list = (FILES[kind] || {})[subj] || [];
    return Promise.all(list.map(f => {
      if (loaded[f]) return loaded[f];
      return (loaded[f] = new Promise(res => { const s = document.createElement('script'); s.src = f + '?v=1'; s.onload = res; s.onerror = res; document.head.appendChild(s); }));
    }));
  }

  /* 과목 키: 초등 수학 math, 중등 수학 mth (단원 목록용). 콘텐츠 키는 math 하나로 통일 */
  const DEEP_SUBJ = ['kor', 'math', 'soc', 'sci', 'eng', 'his'];
  const listKey = (k, g) => (k === 'math' && g >= 7 ? 'mth' : k);
  const dataKey = (k) => (k === 'mth' ? 'math' : k);
  const SKx = (k) => H().SK[k] || H().SK[listKey(k, 7)];
  function unitsFor(k, g, sem) { return H().unitsOf(listKey(k, g), g, sem); }
  function subjsFor(g) { return DEEP_SUBJ.filter(k => unitsFor(k, g).length); }

  function st() { const s = MS().st(); s.top = s.top || {}; const id = MS().kid().id; s.top[id] = s.top[id] || { deep: {}, hard: {} }; return s.top[id]; }
  function ui() { const s = MS().st(); s._top = s._top || {}; return s._top; }

  /* ---------- 페이지 ---------- */
  const TABS = [['deep', '🧠', '심화 사고력', '서술형 · 탐구'], ['hard', '🔥', '고난도 문제', '최상위 변별'], ['method', '🎯', '최상위 공부법', '메타인지 · 복습']];
  function page(a) {
    const kid = MS().kid(), u = ui();
    const tab = TABS.some(t => t[0] === a[2]) ? a[2] : (TABS.some(t => t[0] === u.tab) ? u.tab : 'deep');
    u.tab = tab;
    const head = `<div class="page-head"><div><h1>🏆 최상위 학습</h1><div class="sub">최상위권 학생들의 공부 방식으로 전 과목 심화·고난도 문제를 풀어요.</div></div></div>
      <div class="top-tabs t3">${TABS.map(([k, ic, n, d]) => `<a class="top-tab ${k} ${tab === k ? 'on' : ''}" href="#study/top/${k}"><span class="tt-ic">${ic}</span><span><b>${n}</b><small>${d}</small></span></a>`).join('')}</div>`;
    const body = tab === 'method' ? (window.MethodApp ? MethodApp.view(kid, a) : '') : listView(kid, a, tab);
    return MS().layout('study', `<div class="top-page">${head}${body}</div>`);
  }

  /* ---------- 심화 · 고난도 공통 목록 ---------- */
  function listView(kid, a, kind) {
    const u = ui(), g = kid.grade;
    const subs = subjsFor(g).filter(k => (FILES[kind] || {})[k]);
    const sk = kind + 'Subj', ss = kind + 'Sem';
    let k = a[3] && subs.includes(a[3]) ? a[3] : (u[sk] && subs.includes(u[sk]) ? u[sk] : subs[0]);
    u[sk] = k;
    let sem = +(u[ss] || kid.sem); if (sem !== 1 && sem !== 2) sem = 1;
    const units = k ? unitsFor(k, g, sem) : [];
    const intro = kind === 'deep'
      ? `<b>심화 사고력</b> · ${GL(g)} 교육과정 안에서 더 깊이 생각하는 서술형·사고력·탐구·융합 문제예요. 답을 써 본 뒤 모범 답안과 채점 포인트로 스스로 채점해요.`
      : `<b>고난도 문제</b> · 최상위권을 가르는 4지선다 문제예요. ${GL(g)} 내용만으로 풀 수 있지만 여러 단계 추론과 함정이 있어요. 풀고 나면 해설과 최고 기록이 남아요.`;
    return `<div class="card top-info ${kind}"><p>${intro}</p></div>
      <div class="chips scroll-x mt16" id="topSubj">${subs.map(x => { const S = SKx(listKey(x, g)); return `<a class="chip subj-chip ${x === k ? 'on' : ''}" style="--sc:${S.c}" href="#study/top/${kind}/${x}">${S.ic} ${S.n}</a>`; }).join('')}</div>
      <div class="row sp-filter mt8"><span class="chip on">${GS(g)}</span><span class="cur-sep"></span><div class="chips"><button class="chip ${sem === 1 ? 'on' : ''}" data-ta="sem" data-k="${ss}" data-s="1">1학기</button><button class="chip ${sem === 2 ? 'on' : ''}" data-ta="sem" data-k="${ss}" data-s="2">2학기</button></div></div>
      <div class="top-units mt16" id="topList" data-kind="${kind}" data-subj="${dataKey(k || '')}">${units.length ? units.map(x => unitRow(x, kind)).join('') : `<div class="card"><div class="empty">${GS(g)} ${sem}학기 단원이 없어요.</div></div>`}</div>`;
  }

  function unitRow(u, kind) {
    const S = SKx(u.subj || 'math');
    const s = st()[kind];
    let badge = '';
    if (kind === 'deep') { const n = [0, 1].filter(i => s[u.id + '_' + i]).length; badge = n ? `<span class="top-badge">${n}/2 채점</span>` : ''; }
    else { const r = s[u.id]; badge = r ? `<span class="top-badge ${r.best === 3 ? 'ok' : ''}">최고 ${r.best}/3</span>` : ''; }
    return `<details class="card top-unit" data-u="${u.id}" style="--sc:${S.c}">
      <summary><span class="u-ico">${u.icon || S.ic}</span><span class="tu-t"><span class="xs muted">${S.n} · ${u.sem}학기 ${u.no}단원</span><b>${esc(u.title)}</b></span>${badge}<span class="tu-arr">⌄</span></summary>
      <div class="tu-body" data-kind="${kind}"><div class="empty small">불러오는 중…</div></div>
    </details>`;
  }

  function deepBody(u) {
    const items = DATA.deep[u.id];
    if (!items || !items.length) return '<div class="muted small">이 단원의 심화 문항은 준비 중이에요.</div>';
    const s = st().deep;
    return items.map((x, i) => {
      const key = u.id + '_' + i, sc = s[key];
      return `<div class="dq" data-key="${key}">
        <div class="dq-h"><span class="dq-t">${esc(x.t)}</span><span class="xs muted">심화 ${i + 1}</span></div>
        <div class="dq-q">${esc(x.q)}</div>
        <textarea class="input dq-in" rows="3" placeholder="${H().isStu() ? '내 생각과 풀이를 써 보세요' : '아이가 생각과 풀이를 써 보게 해 주세요'}"></textarea>
        <button class="btn btn-sm" data-ta="dshow">모범 답안 보기</button>
        <div class="dq-ans" hidden>
          <div class="dq-a"><b>모범 답안</b><p>${esc(x.a)}</p></div>
          <div class="dq-k"><b>채점 포인트</b><ul>${x.k.map(t => `<li>${esc(t)}</li>`).join('')}</ul></div>
          <div class="dq-sc"><span class="small">스스로 채점</span>${[['3', '잘함'], ['2', '보통'], ['1', '다시']].map(([v, n]) => `<button class="chip ${sc == v ? 'on' : ''}" data-ta="dscore" data-v="${v}">${n}</button>`).join('')}</div>
        </div>
      </div>`;
    }).join('');
  }

  /* ---------- 사교육 최상위 ---------- */
  function hardBody(u) {
    const items = DATA.hard[u.id];
    if (!items || !items.length) return '<div class="muted small">이 단원의 고난도 문항은 준비 중이에요.</div>';
    return `<div class="hq-wrap" data-u="${u.id}">${items.map((x, i) => `<div class="hq" data-i="${i}">
        <div class="dq-h"><span class="dq-t hard">고난도 ${i + 1}</span></div>
        <div class="dq-q">${esc(x.q)}</div>
        <div class="hq-opts">${x.o.map((o, j) => `<button class="lp-opt" data-ta="hans" data-j="${j}"><span class="lp-on">${'①②③④'[j]}</span><span>${esc(o)}</span></button>`).join('')}</div>
        <div class="hq-e" hidden></div>
      </div>`).join('')}<div class="hq-res small muted"></div></div>`;
  }

  /* ---------- 상호작용 ---------- */
  function fill(det) {
    const box = det.querySelector('.tu-body'); const kind = box.dataset.kind; const list = document.getElementById('topList');
    const u = H().U(det.dataset.u);
    load(kind, list.dataset.subj).then(() => { box.innerHTML = kind === 'deep' ? deepBody(u) : hardBody(u); });
  }
  function after(a) {
    const list = document.getElementById('topList'); if (!list) return;
    load(list.dataset.kind, list.dataset.subj);
    list.addEventListener('toggle', e => { const d = e.target; if (d.open && !d.dataset.f) { d.dataset.f = 1; fill(d); } }, true);
    const sc = document.querySelector('#topSubj .chip.on'); if (sc && sc.parentElement.scrollWidth > sc.parentElement.clientWidth) sc.parentElement.scrollLeft = sc.offsetLeft - 16;
  }
  function rerender() { MS().save(); MS().render(); }
  document.addEventListener('click', e => {
    const el = e.target.closest('[data-ta]'); if (!el) return;
    const t = el.dataset.ta, u = ui();
    if (t === 'sem') { u[el.dataset.k] = +el.dataset.s; return rerender(); }
    if (t === 'dshow') { const ans = el.parentElement.querySelector('.dq-ans'); ans.hidden = false; el.remove(); return; }
    if (t === 'dscore') {
      const q = el.closest('.dq'); st().deep[q.dataset.key] = +el.dataset.v; MS().save();
      q.querySelectorAll('[data-ta="dscore"]').forEach(b => b.classList.toggle('on', b === el));
      MS().toast(el.dataset.v === '1' ? '모범 답안을 다시 읽고 한 번 더 써 봐요' : '채점을 저장했어요'); return;
    }
    if (t === 'hans') {
      const q = el.closest('.hq'), wrap = el.closest('.hq-wrap'), uid = wrap.dataset.u, i = +q.dataset.i, x = DATA.hard[uid][i], j = +el.dataset.j;
      if (q.dataset.done) return; q.dataset.done = j === x.a ? 'ok' : 'no';
      q.querySelectorAll('.lp-opt').forEach((b, bj) => { b.disabled = true; if (bj === x.a) b.classList.add('ok'); else if (bj === j) b.classList.add('no'); });
      const ex = q.querySelector('.hq-e'); ex.hidden = false; ex.innerHTML = `<b>${j === x.a ? '정답이에요! 👏' : '아쉬워요. 정답은 ' + '①②③④'[x.a]}</b><p>${esc(x.e)}</p>`;
      const all = [...wrap.querySelectorAll('.hq')];
      if (all.every(z => z.dataset.done)) {
        const ok = all.filter(z => z.dataset.done === 'ok').length, s = st().hard, r = s[uid] || { best: 0, tries: 0 };
        r.tries++; r.best = Math.max(r.best, ok); r.last = ok; s[uid] = r; MS().save();
        wrap.querySelector('.hq-res').innerHTML = `${ok}/3 정답 · 최고 기록 ${r.best}/3 저장 <button class="btn btn-sm" data-ta="hretry">다시 풀기</button>`;
      }
      return;
    }
    if (t === 'hretry') { const det = el.closest('details'); fill(det); return; }
  });

  window.TopApp = { add, page, after, DATA };
})();
