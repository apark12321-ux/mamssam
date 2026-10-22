/* 쌤픽 — 최상위 공부법: 메타인지 예측 · 간격 복습 · 섞어 풀기 · 백지 인출 · 오답 원인 분석 */
(function () {
  const MS = () => window.MS;
  const H = () => window.SubjApp._h;
  const esc = (s) => MS().esc(String(s == null ? '' : s));
  const GS = (g) => (window.GS ? window.GS(g) : g + '학년');
  const INTERVALS = [1, 3, 7, 14, 30];
  const PRED = [['k', '😎', '확실히 안다'], ['m', '🤔', '헷갈린다'], ['u', '😵', '모른다']];
  const WHY = [['c', '개념을 몰라서'], ['s', '계산·표기 실수'], ['r', '문제를 잘못 읽어서'], ['g', '찍었어요']];
  const TIP = { c: '개념이 약해요. 해당 단원 개념·영상을 다시 보고 백지 인출로 떠올려 보세요.', s: '실수가 많아요. 풀이를 한 줄씩 쓰고, 답을 쓴 뒤 문제 조건을 다시 대조하는 습관을 들여요.', r: '문제를 잘못 읽는 경우가 많아요. 묻는 것(구하는 것)에 밑줄을 긋고 조건에 번호를 붙여 읽어요.', g: '찍은 문제는 사실상 모르는 문제예요. 메타인지 예측에서 "모른다"로 솔직하게 표시하고 복습 목록에 넣어요.' };

  const ymd = (d) => d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  const addDays = (s, n) => { const d = new Date(s + 'T00:00:00'); d.setDate(d.getDate() + n); return ymd(d); };
  function data() { const s = MS().st(); s.top = s.top || {}; const id = MS().kid().id; const t = s.top[id] = s.top[id] || { deep: {}, hard: {} }; t.rev = t.rev || {}; t.ms = t.ms || []; t.blank = t.blank || {}; return t; }
  function ui() { const s = MS().st(); s._mth = s._mth || {}; return s._mth; }

  /* 공부한 단원과 복습 일정 (에빙하우스 간격 1·3·7·14·30일) */
  function studied() {
    const kid = MS().kid(), m = {};
    (MS().st().lessons || []).filter(l => l.kidId === kid.id && l.unitId).forEach(l => { if (!m[l.unitId] || l.date < m[l.unitId]) m[l.unitId] = l.date; });
    return Object.entries(m).map(([id, first]) => ({ u: H().U(id), first })).filter(x => x.u);
  }
  function schedule() {
    const d = data(), t = MS().today();
    return studied().map(x => { const r = d.rev[x.u.id] || { stage: 0, next: addDays(x.first, INTERVALS[0]) }; return { u: x.u, stage: r.stage, next: r.next, due: r.next <= t }; }).sort((a, b) => a.next.localeCompare(b.next));
  }

  /* ---------- 화면 ---------- */
  function view(kid, a) {
    const u = ui();
    const sec = ['review', 'mix', 'blank', 'report'].includes(a[3]) ? a[3] : (u.sec || 'review');
    u.sec = sec;
    const due = schedule().filter(x => x.due).length;
    const intro = `<div class="card top-info method">
        <div class="ti-h">🎯 최상위권은 이렇게 공부해요</div>
        <div class="mth-pat">
          <div><b>🧠 메타인지</b><span>아는 것과 모르는 것을 정확히 구분해요</span></div>
          <div><b>📝 떠올리기</b><span>다시 읽기보다 머릿속에서 꺼내 봐요</span></div>
          <div><b>🔁 간격 복습</b><span>잊을 때쯤 다시 봐서 오래 기억해요</span></div>
          <div><b>🔀 섞어 풀기·오답 분석</b><span>유형을 섞고 틀린 이유를 따져요</span></div>
        </div>
        <div class="xs muted mt8">근거: EBS 다큐 「0.1%의 비밀」 메타인지 실험, Dunlosky 외(2013) 학습 전략 연구</div>
      </div>`;
    const tabs = [['review', `🔁 오늘의 복습${due ? ` <i class="mth-dot">${due}</i>` : ''}`], ['mix', '🔀 섞어 풀기'], ['blank', '📝 백지 인출'], ['report', '📊 내 학습 패턴']];
    const seg = `<div class="seg seg4 mt16">${tabs.map(([k, n]) => `<a class="${sec === k ? 'on' : ''}" href="#study/top/method/${k}">${n}</a>`).join('')}</div>`;
    const body = sec === 'review' ? reviewView() : sec === 'mix' ? mixView(kid) : sec === 'blank' ? blankView(kid) : reportView();
    return intro + seg + `<div id="mthBody">${body}</div>`;
  }

  function reviewView() {
    const sch = schedule(), due = sch.filter(x => x.due), soon = sch.filter(x => !x.due).slice(0, 5);
    if (!sch.length) return `<div class="card mt16"><div class="empty">아직 공부한 단원이 없어요.<br>과목별 학습에서 차시를 하나 끝내면 1·3·7·14·30일 간격으로 복습 일정이 자동으로 잡혀요.</div></div>`;
    const row = (x) => { const S = H().SK[H().subjOf(x.u)] || {}; return `<div class="mth-row"><span class="u-ico">${x.u.icon || S.ic || '📘'}</span><span class="tu-t"><span class="xs muted">${S.n || ''} · ${GS(x.u.grade)} ${x.u.sem}학기 ${x.u.no}단원</span><b>${esc(x.u.title)}</b></span><span class="mth-st">${INTERVALS.map((d, i) => `<i class="${i < x.stage ? 'on' : ''}" title="${d}일"></i>`).join('')}</span><span class="xs ${x.due ? 'due' : 'muted'}">${x.due ? '오늘' : x.next.slice(5).replace('-', '/')}</span></div>`; };
    return `<p class="small muted mt16">공부한 단원을 1일 → 3일 → 7일 → 14일 → 30일 뒤에 다시 떠올려요. 복습에서 80% 이상 맞히면 다음 간격으로, 못 미치면 처음부터 다시 잡혀요.</p>
      <div class="card mt8"><div class="row between"><b>오늘 복습할 단원 ${due.length}개</b>${due.length ? `<button class="btn btn-primary" data-mt="startRev">복습 시작 ▶</button>` : ''}</div>
      <div class="mth-list mt12">${due.slice(0, 5).map(row).join('') || '<div class="empty small">오늘 복습할 단원이 없어요. 잘하고 있어요! 👍</div>'}</div></div>
      ${soon.length ? `<div class="card mt12"><b>다가오는 복습</b><div class="mth-list mt12">${soon.map(row).join('')}</div></div>` : ''}`;
  }

  function mixView(kid) {
    const u = ui(), subs = ['kor', 'math', 'soc', 'sci', 'eng', 'his'].filter(k => H().unitsOf(k === 'math' && kid.grade >= 7 ? 'mth' : k, kid.grade).length);
    const pick = (u.mixSubs || subs).filter(k => subs.includes(k));
    const n = studied().length;
    return `<p class="small muted mt16">여러 단원·과목 문제를 섞어서 풀면 "이 문제는 어떤 개념을 써야 하지?"를 스스로 판단하는 힘이 길러져요. 문제마다 먼저 <b>안다/헷갈린다/모른다</b>를 예측하고 풀어요.</p>
      <div class="card mt8"><b>섞을 과목</b><div class="chips mt8">${subs.map(k => { const S = H().SK[k === 'math' && kid.grade >= 7 ? 'mth' : k]; return `<button class="chip subj-chip ${pick.includes(k) ? 'on' : ''}" style="--sc:${S.c}" data-mt="mixSub" data-k="${k}">${S.ic} ${S.n}</button>`; }).join('')}</div>
      <p class="xs muted mt8">${n ? `공부한 단원 ${n}개에서 우선 출제하고, 부족하면 ${GS(kid.grade)} 단원에서 채워요.` : `${GS(kid.grade)} 현재 학기까지의 단원에서 출제해요.`}</p>
      <div class="row mt12" style="gap:8px">${[10, 15].map(c => `<button class="btn ${c === 10 ? 'btn-primary' : ''}" data-mt="startMix" data-n="${c}">${c}문제 시작</button>`).join('')}</div></div>`;
  }

  function blankView(kid) {
    const u = ui(), d = data();
    const list = studied().map(x => x.u);
    const cur = ['kor', 'math', 'soc', 'sci', 'eng', 'his'].flatMap(k => H().unitsOf(k === 'math' && kid.grade >= 7 ? 'mth' : k, kid.grade, kid.sem));
    const pool = list.length ? list : cur;
    const sel = H().U(u.blankU) || pool[0];
    if (!sel) return '<div class="card mt16"><div class="empty">단원이 없어요.</div></div>';
    const r = d.blank[sel.id];
    return `<p class="small muted mt16">교과서를 덮고 단원에서 배운 것을 <b>떠오르는 대로 모두</b> 써 보세요. 그다음 핵심 목록과 비교해 떠올린 것에 체크해요. 다시 읽기보다 기억에 훨씬 오래 남아요.</p>
      <div class="card mt8"><label class="small bold">단원 고르기${list.length ? ' (공부한 단원)' : ''}</label>
      <select class="input mt8" data-mt="blankU">${pool.map(x => `<option value="${x.id}" ${x.id === sel.id ? 'selected' : ''}>${esc((H().SK[H().subjOf(x)] || {}).n || '')} · ${GS(x.grade)}-${x.sem} ${esc(x.title)}${d.blank[x.id] ? ` (${d.blank[x.id].rate}%)` : ''}</option>`).join('')}</select>
      <textarea class="input dq-in mt12" id="blankIn" rows="7" placeholder="예) 이 단원에서는 ~을 배웠다. 핵심은 ~이다. ~할 때는 ~에 주의한다..."></textarea>
      <button class="btn btn-primary" data-mt="blankCheck">다 썼어요 · 핵심과 비교하기</button>
      ${r ? `<div class="xs muted mt8">지난 기록: 인출률 ${r.rate}% (${r.date})</div>` : ''}
      <div id="blankRes"></div></div>`;
  }
  function keyPoints(u) {
    const pts = (u.lessons || []).map(t => ({ t, k: 'l' }));
    String(u.concept || '').split(/(?<=[.다요])\s+/).map(s => s.trim()).filter(s => s.length > 8).slice(0, 4).forEach(t => pts.push({ t, k: 'c' }));
    return pts;
  }

  function reportView() {
    const d = data(), ms = d.ms.slice(-10);
    if (!ms.length) return `<div class="card mt16"><div class="empty">아직 기록이 없어요.<br>오늘의 복습이나 섞어 풀기를 한 번 하면 메타인지 정확도와 오답 원인이 분석돼요.</div></div>`;
    const avg = (f) => Math.round(ms.reduce((a, x) => a + f(x), 0) / ms.length);
    const cal = avg(x => x.cal), acc = avg(x => Math.round(x.ok * 100 / x.n));
    const ill = ms.reduce((a, x) => a + (x.ill || 0), 0), hid = ms.reduce((a, x) => a + (x.hid || 0), 0);
    const why = {}; ms.forEach(x => Object.entries(x.why || {}).forEach(([k, v]) => { why[k] = (why[k] || 0) + v; }));
    const wt = Object.values(why).reduce((a, b) => a + b, 0), top = Object.entries(why).sort((a, b) => b[1] - a[1])[0];
    const sch = schedule(), mast = sch.filter(x => x.stage >= 3).length;
    const br = Object.values(d.blank); const bavg = br.length ? Math.round(br.reduce((a, x) => a + x.rate, 0) / br.length) : null;
    const bar = (v, c) => `<div class="mth-bar"><i style="width:${v}%;background:${c}"></i></div>`;
    return `<div class="grid g2 mt16 mth-kpi">
        <div class="card"><div class="xs muted">🧠 메타인지 정확도</div><div class="mth-big">${cal}%</div>${bar(cal, 'var(--green)')}<div class="xs muted mt8">예측(안다/모른다)과 실제 결과가 맞은 비율. 최상위권은 이 값이 높아요.</div></div>
        <div class="card"><div class="xs muted">✅ 정답률 (최근 ${ms.length}회)</div><div class="mth-big">${acc}%</div>${bar(acc, 'var(--blue)')}<div class="xs muted mt8">착각 문항 ${ill}개 · 숨은 실력 ${hid}개</div></div>
        <div class="card"><div class="xs muted">🔁 장기 기억으로 넘어간 단원</div><div class="mth-big">${mast}<small>/${sch.length}</small></div>${bar(sch.length ? Math.round(mast * 100 / sch.length) : 0, 'var(--orange)')}<div class="xs muted mt8">간격 복습 3단계(7일) 이상 통과한 단원</div></div>
        <div class="card"><div class="xs muted">📝 백지 인출률</div><div class="mth-big">${bavg == null ? '–' : bavg + '%'}</div>${bar(bavg || 0, 'var(--pink)')}<div class="xs muted mt8">교과서 없이 떠올린 핵심 비율 평균</div></div>
      </div>
      <div class="card mt12"><b>❌ 틀린 이유 분석</b>${wt ? `<div class="mth-why mt12">${WHY.map(([k, n]) => `<div><span class="small">${n}</span>${bar(Math.round((why[k] || 0) * 100 / wt), 'var(--red)')}<span class="xs muted">${why[k] || 0}</span></div>`).join('')}</div><div class="ti-ready mt12">💡 ${TIP[top[0]]}</div>` : '<div class="small muted mt8">틀린 문제에서 이유를 골라 주면 분석돼요.</div>'}</div>
      <div class="card mt12"><b>🧭 다음 행동 추천</b><ul class="ti-list mt8">
        ${cal < 70 ? '<li>예측이 자주 빗나가요. "확실히 안다"는 친구에게 설명할 수 있을 때만 고르세요.</li>' : '<li>메타인지가 좋아요. 헷갈린다·모른다로 표시한 문제부터 복습하세요.</li>'}
        ${ill ? `<li>안다고 생각했는데 틀린 '착각 문항'이 ${ill}개 있어요. 가장 위험한 문제라 간격 복습에 다시 들어가요.</li>` : ''}
        ${sch.filter(x => x.due).length ? `<li>오늘 복습할 단원이 ${sch.filter(x => x.due).length}개 있어요. 잊기 직전에 떠올리는 게 가장 효과적이에요.</li>` : ''}
        ${bavg != null && bavg < 60 ? '<li>백지 인출률이 낮아요. 차시 제목을 먼저 떠올리고 그 아래 내용을 채우는 연습을 해 보세요.</li>' : ''}
      </ul></div>`;
  }

  /* ---------- 문제 세션 (메타인지 예측 → 풀이 → 오답 원인) ---------- */
  let S = null;
  function startSession(units, per, total, kind) {
    const box = document.getElementById('mthBody'); if (!box) return;
    box.innerHTML = '<div class="card mt16"><div class="empty">문제를 준비하고 있어요…</div></div>';
    Promise.all(units.map(u => H().qsReady(u))).then(() => {
      let qs = []; units.forEach(u => { qs = qs.concat(H().qsFor(u, per)); });
      qs = qs.filter(Boolean).sort(() => Math.random() - .5).slice(0, total);
      if (!qs.length) { box.innerHTML = '<div class="card mt16"><div class="empty">출제할 문제가 없어요.</div></div>'; return; }
      S = { kind, qs, i: 0, res: [], units: units.map(u => u.id) };
      draw();
    });
  }
  function draw() {
    const box = document.getElementById('mthBody'); if (!box || !S) return;
    if (S.i >= S.qs.length) return finish();
    const p = S.qs[S.i], r = S.res[S.i] || {}, u = H().U(p.unitId), Sk = H().SK[H().subjOf(u)] || {};
    const dots = S.qs.map((_, j) => `<i class="${S.res[j] && S.res[j].ok != null ? (S.res[j].ok ? 'o' : 'x') : j === S.i ? 'cur' : ''}"></i>`).join('');
    let body = '';
    if (!r.pred) body = `<div class="mth-pred"><div class="small bold">먼저 예측해 보세요: 이 문제, 풀 수 있을까?</div><div class="mth-pred-b">${PRED.map(([k, ic, n]) => `<button class="btn" data-mt="pred" data-k="${k}"><span>${ic}</span>${n}</button>`).join('')}</div></div>`;
    else if (r.ok == null) {
      body = p.t === 'choice' ? `<div class="lp-opts">${p.opts.map((o, j) => `<button class="lp-opt" data-mt="ans" data-j="${j}"><span class="lp-on">${'①②③④⑤'[j] || j + 1}</span><span>${o}</span></button>`).join('')}</div>`
        : `<form class="lp-inp" data-mt-form="1"><input class="input kid-input" id="mthIn" autocomplete="off" placeholder="답">${p.unit ? `<span class="bold">${p.unit}</span>` : ''}<button class="btn btn-primary btn-lg">확인</button></form>`;
    } else {
      body = p.t === 'choice' ? `<div class="lp-opts">${p.opts.map((o, j) => `<button class="lp-opt ${j === p.v ? 'ok' : j === r.sel ? 'no' : ''}" disabled><span class="lp-on">${'①②③④⑤'[j] || j + 1}</span><span>${o}</span></button>`).join('')}</div>` : '';
      body += `<div class="feedback ${r.ok ? 'ok' : 'no'}">${r.ok ? (r.pred === 'k' ? '정답! 예측도 정확해요 🎯' : '정답! 생각보다 잘 알고 있었네요 ✨') : (r.pred === 'k' ? '착각 문항이에요! 안다고 생각했지만 틀렸어요 ⚠️' : `정답은 ${p.t === 'choice' ? p.opts[p.v] : esc(p.a)}`)}</div>${p.ex ? `<div class="lp-ex">${p.ex}</div>` : ''}`;
      if (!r.ok && !r.why) body += `<div class="mth-why-q"><div class="small bold">왜 틀렸을까요?</div><div class="chips mt8">${WHY.map(([k, n]) => `<button class="chip" data-mt="why" data-k="${k}">${n}</button>`).join('')}</div></div>`;
      else body += `<button class="btn btn-primary btn-lg btn-block mt12" data-mt="next">${S.i + 1 < S.qs.length ? '다음 문제 ▶' : '결과 보기'}</button>`;
    }
    box.innerHTML = `<div class="lp-card mth-card mt16" style="--sc:${Sk.c || 'var(--blue)'}"><div class="kid-progress">${dots}</div><div class="lp-kicker">${Sk.ic || ''} ${esc(Sk.n || '')} · ${esc(u ? u.title : '')}</div><div class="lp-q">${p.q}${p.fig || ''}</div>${body}</div>`;
    const inp = document.getElementById('mthIn'); if (inp) inp.focus();
  }
  function answer(sel, given) {
    const p = S.qs[S.i], r = S.res[S.i];
    let ok;
    if (p.t === 'choice') ok = sel === p.v; else { const c = window.MathGen.check(p, given); if (c.empty) return; ok = !!c.ok; }
    r.ok = ok; r.sel = sel;
    const st = MS().st(), kid = MS().kid();
    st.sp = st.sp || {}; const sp = st.sp[kid.id] = st.sp[kid.id] || { done: {}, q: {}, cur: {} }; sp.q = sp.q || {};
    const q = sp.q[p.unitId] = sp.q[p.unitId] || { ok: 0, t: 0 }; q.t++; if (ok) q.ok++;
    if (!ok) { const pid = p.origId || p.id; st.wrong = st.wrong || []; if (!st.wrong.some(w => w.pid === pid)) st.wrong.unshift({ kidId: kid.id, pid, p: Object.assign({}, p, { id: pid }), date: MS().today(), given: p.t === 'choice' ? sel : given }); }
    MS().save(); draw();
  }
  function finish() {
    const d = data(), res = S.res, n = res.length, ok = res.filter(r => r.ok).length;
    const match = res.filter(r => (r.pred === 'k' && r.ok) || (r.pred === 'u' && !r.ok) || r.pred === 'm').length;
    const cal = Math.round(res.reduce((a, r) => a + ((r.pred === 'k' && r.ok) || (r.pred === 'u' && !r.ok) ? 1 : r.pred === 'm' ? .5 : 0), 0) * 100 / n);
    const ill = res.filter(r => r.pred === 'k' && !r.ok).length, hid = res.filter(r => r.pred === 'u' && r.ok).length;
    const why = {}; res.forEach(r => { if (r.why) why[r.why] = (why[r.why] || 0) + 1; });
    d.ms.push({ date: MS().today(), kind: S.kind, n, ok, cal, ill, hid, why }); d.ms = d.ms.slice(-30);
    // 간격 복습 갱신: 단원별 정답률 80% 이상 → 다음 단계, 미만이거나 착각 문항 → 처음부터
    const byU = {}; S.qs.forEach((p, i) => { const b = byU[p.unitId] = byU[p.unitId] || { ok: 0, n: 0, ill: 0 }; b.n++; if (res[i].ok) b.ok++; if (res[i].pred === 'k' && !res[i].ok) b.ill++; });
    const moved = [];
    Object.entries(byU).forEach(([id, b]) => {
      const cur = d.rev[id] || { stage: 0 };
      if (S.kind === 'review' || cur.next) {
        const pass = b.ok / b.n >= .8 && !b.ill; const stage = pass ? Math.min(cur.stage + 1, INTERVALS.length) : 0;
        d.rev[id] = { stage, next: addDays(MS().today(), INTERVALS[Math.min(stage, INTERVALS.length - 1)]) }; if (pass) moved.push(id);
      } else if (!(b.ok / b.n >= .8)) d.rev[id] = { stage: 0, next: addDays(MS().today(), 1) };
    });
    MS().save();
    const box = document.getElementById('mthBody');
    box.innerHTML = `<div class="lp-card pop mt16" style="text-align:center"><div class="big-emoji">${ok / n >= .8 ? '🎉' : ok / n >= .5 ? '👍' : '💪'}</div>
      <h2 style="margin:6px 0">${ok}/${n} 정답</h2>
      <div class="grid g3 mth-res mt12"><div><b>${cal}%</b><span>메타인지 정확도</span></div><div><b class="${ill ? 'warn' : ''}">${ill}</b><span>착각 문항</span></div><div><b>${hid}</b><span>숨은 실력</span></div></div>
      <p class="small muted mt12">${ill ? '안다고 생각했는데 틀린 문제는 가장 위험해요. 이 단원들은 내일 다시 복습에 나와요.' : cal >= 80 ? '내가 아는 것과 모르는 것을 정확히 알고 있어요. 최상위권의 공부 습관이에요! 🎯' : '예측과 결과를 비교하는 연습을 계속하면 메타인지가 좋아져요.'}${moved.length ? `<br>✅ ${moved.length}개 단원이 다음 복습 간격으로 넘어갔어요.` : ''}</p>
      <div class="row mt16" style="justify-content:center;gap:8px"><a class="btn" href="#study/top/method/report">📊 내 학습 패턴</a><button class="btn btn-primary" data-mt="again">다시 하기</button></div></div>`;
    S = null;
  }

  /* ---------- 이벤트 ---------- */
  function rerender() { MS().save(); MS().render(); }
  document.addEventListener('click', e => {
    const el = e.target.closest('[data-mt]'); if (!el) return;
    const t = el.dataset.mt, u = ui(), kid = MS().kid();
    if (t === 'startRev') { const due = schedule().filter(x => x.due).slice(0, 5).map(x => x.u); return startSession(due, 3, 15, 'review'); }
    if (t === 'startMix') {
      const subs = u.mixSubs || null; const n = +el.dataset.n;
      const ok = (x) => !subs || subs.includes(H().subjOf(x) === 'mth' ? 'math' : H().subjOf(x));
      let pool = studied().map(x => x.u).filter(ok);
      if (pool.length < 4) { const cur = ['kor', 'math', 'soc', 'sci', 'eng', 'his'].filter(k => !subs || subs.includes(k)).flatMap(k => H().unitsOf(k === 'math' && kid.grade >= 7 ? 'mth' : k, kid.grade).filter(x => x.sem < kid.sem || x.sem === kid.sem)); pool = pool.concat(cur.filter(x => !pool.includes(x))); }
      pool = pool.sort(() => Math.random() - .5).slice(0, Math.min(8, pool.length));
      return startSession(pool, 3, n, 'mix');
    }
    if (t === 'mixSub') { const all = ['kor', 'math', 'soc', 'sci', 'eng', 'his']; let s = u.mixSubs || all.slice(); const k = el.dataset.k; s = s.includes(k) ? s.filter(x => x !== k) : s.concat(k); if (!s.length) return; u.mixSubs = s; return rerender(); }
    if (t === 'again') return rerender();
    if (!S && t !== 'blankCheck' && t !== 'blankDone') return;
    if (t === 'pred') { S.res[S.i] = { pred: el.dataset.k }; return draw(); }
    if (t === 'ans') return answer(+el.dataset.j, null);
    if (t === 'why') { S.res[S.i].why = el.dataset.k; return draw(); }
    if (t === 'next') { S.i++; return draw(); }
    if (t === 'blankCheck') {
      const sel = H().U(ui().blankU) || null; const id = document.querySelector('[data-mt="blankU"]').value; const unit = H().U(id) || sel;
      const txt = (document.getElementById('blankIn').value || '').trim();
      if (txt.length < 10) { MS().toast('떠오르는 내용을 조금 더 써 보세요 ✍️'); return; }
      const pts = keyPoints(unit);
      document.getElementById('blankRes').innerHTML = `<div class="dq-ans mt12"><b>핵심 목록 — 내가 떠올린 것에 체크하세요</b><div class="blank-list mt8">${pts.map((p, i) => `<label class="blank-pt"><input type="checkbox" data-i="${i}"> <span>${p.k === 'l' ? '📌 ' : '💡 '}${esc(p.t)}</span></label>`).join('')}</div><button class="btn btn-primary mt12" data-mt="blankDone" data-u="${unit.id}" data-n="${pts.length}">체크 완료</button></div>`;
      el.remove(); return;
    }
    if (t === 'blankDone') {
      const n = +el.dataset.n, c = document.querySelectorAll('.blank-pt input:checked').length, rate = Math.round(c * 100 / n);
      data().blank[el.dataset.u] = { rate, date: MS().today() };
      if (rate < 60) { const d = data(); d.rev[el.dataset.u] = { stage: 0, next: addDays(MS().today(), 1) }; }
      MS().save();
      el.parentElement.insertAdjacentHTML('beforeend', `<div class="ti-ready ${rate >= 80 ? 'ok' : ''} mt12">인출률 <b>${rate}%</b> — ${rate >= 80 ? '훌륭해요! 머릿속에 잘 정리되어 있어요 🎯' : rate >= 60 ? '좋아요. 빠뜨린 항목만 다시 보고 내일 한 번 더 떠올려 봐요.' : '빠뜨린 게 많아요. 개념을 다시 보고 내일 복습 목록에 넣었어요.'}</div>`);
      el.remove(); if (rate >= 80 && window.FunApp) FunApp.confetti(null, innerHeight / 3, 60, 1.2);
    }
  });
  document.addEventListener('change', e => { if (e.target.matches('[data-mt="blankU"]')) { ui().blankU = e.target.value; rerender(); } });
  document.addEventListener('submit', e => { if (e.target.matches('[data-mt-form]')) { e.preventDefault(); if (S) answer(null, document.getElementById('mthIn').value); } });

  window.MethodApp = { view, schedule };
})();
