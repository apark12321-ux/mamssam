/* 맘쌤 — 최상위 학습 (공교육 심화 · 사교육 최상위) */
(function () {
  const FILES = {"deep":{"eng":["top/d_eng_1.js","top/d_eng_2.js"],"his":["top/d_his_1.js"],"kor":["top/d_kor_1.js","top/d_kor_2.js","top/d_kor_3.js","top/d_kor_4.js","top/d_kor_5.js"],"math":["top/d_math_1.js","top/d_math_2.js","top/d_math_3.js"],"sci":["top/d_sci_1.js","top/d_sci_2.js"],"soc":["top/d_soc_1.js","top/d_soc_2.js"]},"hard":{"math":["top/h_math_1.js","top/h_math_2.js","top/h_math_3.js","top/h_math_4.js"]}};
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
  function page(a) {
    const kid = MS().kid(), u = ui();
    const track = a[2] === 'pre' || a[2] === 'pub' ? a[2] : (u.track || 'pub');
    u.track = track;
    const stu = H().isStu();
    const head = `<div class="page-head"><div><h1>🏆 최상위 학습</h1><div class="sub">상위권을 위한 두 가지 길을 나눠 두었어요. ${stu ? '내 목표에 맞는 쪽을 골라 공부해요.' : '아이 상황에 맞는 쪽을 골라 쓰세요.'}</div></div></div>
      <div class="top-tabs">
        <a class="top-tab pub ${track === 'pub' ? 'on' : ''}" href="#study/top/pub"><span class="tt-ic">🏫</span><span><b>공교육 심화</b><small>지금 학년 · 깊이</small></span></a>
        <a class="top-tab pre ${track === 'pre' ? 'on' : ''}" href="#study/top/pre"><span class="tt-ic">🚀</span><span><b>사교육 최상위</b><small>선행 · 고난도</small></span></a>
      </div>`;
    const body = track === 'pub' ? pubView(kid, a) : preView(kid, a);
    return MS().layout('study', `<div class="top-page">${head}${body}</div>`);
  }

  /* ---------- 공교육 심화 ---------- */
  function pubView(kid, a) {
    const u = ui(), g = kid.grade;
    const subs = subjsFor(g);
    let k = a[3] && subs.includes(a[3]) ? a[3] : (u.pubSubj && subs.includes(u.pubSubj) ? u.pubSubj : subs[0]);
    u.pubSubj = k;
    let sem = +(u.pubSem || kid.sem); if (sem !== 1 && sem !== 2) sem = 1;
    const units = unitsFor(k, g, sem);
    const done = Object.keys(st().deep).length;
    return `<div class="card top-info pub">
        <div class="ti-h">🏫 공교육 관점의 최상위</div>
        <p>${GL(g)} 교육과정 성취기준 <b>안에서</b> 더 깊이 생각하는 문제예요. 학교 서술형·수행평가, 탐구·융합 활동과 같은 방향이고 선행 개념은 쓰지 않아요.</p>
        <ul class="ti-list"><li>서술형 · 사고력 · 탐구 · 융합 문항 단원별 2개</li><li>내 답을 쓴 뒤 모범 답안과 채점 포인트로 스스로 채점</li></ul>
        <div class="xs muted">지금까지 채점한 심화 문항 ${done}개</div>
      </div>
      <div class="chips scroll-x mt16" id="topSubj">${subs.map(x => { const S = SKx(x); return `<a class="chip subj-chip ${x === k ? 'on' : ''}" style="--sc:${S.c}" href="#study/top/pub/${x}">${S.ic} ${S.n}</a>`; }).join('')}</div>
      <div class="row sp-filter mt8"><span class="chip on">${GS(g)}</span><span class="cur-sep"></span><div class="chips"><button class="chip ${sem === 1 ? 'on' : ''}" data-ta="psem" data-s="1">1학기</button><button class="chip ${sem === 2 ? 'on' : ''}" data-ta="psem" data-s="2">2학기</button></div></div>
      <div class="top-units mt16" id="topList" data-kind="deep" data-subj="${dataKey(k)}">${units.length ? units.map(x => unitRow(x, 'deep')).join('') : `<div class="card"><div class="empty">${GS(g)} ${sem}학기 단원이 없어요.</div></div>`}</div>`;
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
  function curRate(kid) {
    const subs = ['kor', 'math', 'eng', 'sci', 'soc', 'his'];
    let ok = 0, tot = 0;
    subs.forEach(k => unitsFor(k, kid.grade).forEach(u => { const r = H().unitStat(u); if (r && r.rate != null && r.n) { ok += r.rate * r.n; tot += r.n; } }));
    return tot ? Math.round(ok / tot) : null;
  }

  function preView(kid, a) {
    const u = ui(), g = kid.grade;
    const sec = a[3] === 'road' ? 'road' : a[3] === 'hard' ? 'hard' : (u.preSec || 'hard');
    u.preSec = sec;
    const rate = curRate(kid);
    const ready = rate == null ? '아직 현 학년 확인 문제 기록이 적어요. 현 학년 단원 문제를 먼저 풀어 보고 85% 이상이면 선행을 권해요.'
      : rate >= 85 ? `현 학년 확인 문제 정답률 <b>${rate}%</b> — 현행이 탄탄해요. 선행과 고난도에 도전해도 좋아요.`
        : `현 학년 확인 문제 정답률 <b>${rate}%</b> — 85% 미만이에요. 선행보다 현행 보완이 먼저예요.`;
    const notice = `<div class="card top-info pre">
        <div class="ti-h">🚀 사교육 관점의 최상위</div>
        <p>학원·최상위 문제집에서 흔히 하는 방식이에요. <b>고난도 유형</b>과 <b>차학년·차차학년 선행</b>으로 구성했어요.</p>
        <div class="ti-warn">⚠️ 공교육은 선행학습을 지양해요. 「공교육 정상화 촉진 및 선행교육 규제에 관한 특별법」은 학교 수업·시험의 선행 출제를 금지하고 학원의 선행학습 유발 광고를 제한해요. 현 학년 개념을 먼저 다지고 ${H().isStu() ? '내' : '아이'} 속도에 맞게 쓰세요.</div>
        <div class="ti-ready ${rate != null && rate >= 85 ? 'ok' : ''}">${ready}</div>
      </div>
      <div class="seg mt16"><a class="${sec === 'hard' ? 'on' : ''}" href="#study/top/pre/hard">🔥 최상위 고난도 수학</a><a class="${sec === 'road' ? 'on' : ''}" href="#study/top/pre/road">🗺️ 선행 로드맵</a></div>`;
    return notice + (sec === 'hard' ? hardView(kid) : roadView(kid, a));
  }

  function hardView(kid) {
    const u = ui(), g = kid.grade;
    let sem = +(u.hSem || kid.sem); if (sem !== 1 && sem !== 2) sem = 1;
    const units = unitsFor('math', g, sem);
    return `<p class="small muted mt16">${GS(g)} 수학 단원마다 최상위 문제집 수준의 고난도 3문항이에요. 현 학년 개념만으로 풀 수 있지만 여러 단계 추론이 필요해요.</p>
      <div class="row sp-filter"><span class="chip on">${GS(g)}</span><span class="cur-sep"></span><div class="chips"><button class="chip ${sem === 1 ? 'on' : ''}" data-ta="hsem" data-s="1">1학기</button><button class="chip ${sem === 2 ? 'on' : ''}" data-ta="hsem" data-s="2">2학기</button></div></div>
      <div class="top-units mt16" id="topList" data-kind="hard" data-subj="math">${units.map(x => unitRow(x, 'hard')).join('') || '<div class="card"><div class="empty">단원이 없어요.</div></div>'}</div>`;
  }

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

  function roadView(kid, a) {
    const u = ui(), g = kid.grade;
    const targets = [g + 1, g + 2].filter(x => x <= 9);
    if (!targets.length) return `<div class="card mt16"><div class="empty">중3은 고등 과정 선행 로드맵을 준비 중이에요.<br>지금은 공교육 심화와 고난도 수학을 활용해 주세요.</div></div>`;
    let tg = +(u.rg || targets[0]); if (!targets.includes(tg)) tg = targets[0];
    const subs = subjsFor(tg);
    let k = u.rk && subs.includes(u.rk) ? u.rk : (subs.includes('math') ? 'math' : subs[0]);
    const list = unitsFor(k, tg);
    const S = SKx(listKey(k, tg));
    let doneN = 0;
    const rows = list.map((x, i) => {
      const s = H().unitStat(x); const fin = s.total && s.done >= s.total; if (fin) doneN++;
      return `<a class="road-row ${fin ? 'fin' : ''}" href="#study/u/${x.id}" style="--sc:${S.c}"><span class="rr-no">${i + 1}</span><span class="rr-t"><span class="xs muted">${x.sem}학기 ${x.no}단원</span><b>${esc(x.title)}</b></span><span class="rr-p">${fin ? '✓ 완료' : s.done ? `${s.done}/${s.total}차시` : '시작 ›'}</span></a>`;
    }).join('');
    return `<p class="small muted mt16">차학년·차차학년 단원을 교과서 순서대로 이어서 공부해요. 단원을 누르면 개념 → 영상 → 확인 문제로 학습해요.${g === 8 ? ' 중3 다음 고등 과정은 준비 중이에요.' : ''}</p>
      <div class="row sp-filter"><div class="chips">${targets.map(x => `<button class="chip ${x === tg ? 'on' : ''}" data-ta="rg" data-g="${x}">${x === g + 1 ? '차학년' : '차차학년'} · ${GS(x)}</button>`).join('')}</div></div>
      <div class="chips scroll-x mt8">${subs.map(x => { const T = SKx(listKey(x, tg)); return `<button class="chip subj-chip ${x === k ? 'on' : ''}" style="--sc:${T.c}" data-ta="rk" data-k="${x}">${T.ic} ${T.n}</button>`; }).join('')}</div>
      <div class="card mt16 road"><div class="row between"><b>${GS(tg)} ${S.n} 선행 로드맵</b><span class="small muted">${doneN}/${list.length} 단원 완료</span></div><div class="progress mt8"><i style="width:${list.length ? Math.round(doneN * 100 / list.length) : 0}%;background:${S.c}"></i></div><div class="road-list mt12">${rows || '<div class="empty small">단원이 없어요.</div>'}</div></div>`;
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
    if (t === 'psem') { u.pubSem = +el.dataset.s; return rerender(); }
    if (t === 'hsem') { u.hSem = +el.dataset.s; return rerender(); }
    if (t === 'rg') { u.rg = +el.dataset.g; return rerender(); }
    if (t === 'rk') { u.rk = el.dataset.k; return rerender(); }
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
