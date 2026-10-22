/* 쌤픽 초등 — 엄마와 아이가 함께 쓰는 하루 루틴
   엄마: "오늘 뭐부터? 같이 할 건 뭐고 아이 혼자 할 건 뭐지? 아이는 오늘 얼마나 했지?"
   아이: "지금 뭐 하면 돼? 다 하면 뭐가 좋아? 엄마가 알아줄까?"
   · 엄마 홈: 오늘의 3단계(함께 10분 → 혼자 15분 → 확인 3분), 아이 결과·틀린 문제, 칭찬 보내기
   · 아이 모드: '오늘의 길' 큰 단계 카드(영상 → 문제 → 엄마에게 자랑), 읽어 주기, 엄마의 칭찬 말풍선
   · 엄마가 문제를 안 냈어도 오늘 단원으로 5문제를 자동 준비(빈 화면 없음) */
(function () {
  'use strict';
  const MS = () => window.MS;
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const today = () => (MS().today ? MS().today() : new Date().toISOString().slice(0, 10));
  const isElem = () => { try { const k = MS().st().kids.length && MS().kid(); return !!(k && k.grade <= 6); } catch (e) { return false; } };
  const STICK = [['👍', '잘했어'], ['⭐', '최고야'], ['❤️', '사랑해']];

  function fam() {
    const st = MS().st(), kid = MS().kid(); st.fam = st.fam || {};
    const f = st.fam[kid.id] = st.fam[kid.id] || { praise: [], days: {} };
    f.days[today()] = f.days[today()] || {};
    return f;
  }
  const save = () => MS().save();
  const sheets = () => { const kid = MS().kid(); return (MS().st().sheets || []).filter(s => s.kidId === kid.id); };
  const doneToday = () => sheets().filter(s => s.status === 'done' && String(s.doneAt || '').slice(0, 10) === today());
  const assigned = () => sheets().filter(s => s.status === 'assigned');
  function score(s) { let ok = 0; const wrong = []; (s.problems || []).forEach(p => { const a = (s.answers || {})[p.id]; if (a && a.ok) ok++; else wrong.push(p); }); return { ok, n: (s.problems || []).length, wrong }; }
  const qText = (p) => String(p.q || p.question || p.text || p.prompt || '').replace(/<[^>]+>/g, '').slice(0, 60);

  // 오늘 단원: 아이의 현재 단원(과목별 진도가 있으면 첫 과목)
  function todayUnit() { const kid = MS().kid(); try { const n = window.SubjApp && SubjApp.kidVidUnit && SubjApp.kidVidUnit(); if (n && n.u) return { id: n.u.id, l: n.l }; } catch (e) { } return { id: kid.unitId, l: kid.lesson || 0 }; }

  // 엄마가 낸 문제가 없으면 오늘 단원으로 5문제 자동 준비(하루 한 번)
  function ensureSheet() {
    const f = fam(), d = f.days[today()];
    if (assigned().length || d.auto || doneToday().length) return false;
    // 오늘 단원부터 차례로 시도하고, 문제가 만들어지지 않는 단원(예: 국어 독서)은 건너뛰고 아이의 기본 단원으로
    const kid = MS().kid(); const ids = [todayUnit().id, kid.unitId].concat(Object.keys(MS().U || {}).filter(k => MS().U[k].grade === kid.grade && MS().U[k].sem === kid.sem)).filter((v, i, a) => v && a.indexOf(v) === i && MS().U[v]);
    for (const id of ids.slice(0, 12)) {
      try {
        const sh = MS().mkSheet({ unitId: id, level: 1, count: 5, source: 'auto', title: `오늘의 5문제 · ${MS().U[id].title}` });
        if (sh && sh.problems && sh.problems.length) { d.auto = true; save(); return true; }
        const st = MS().st(); st.sheets = st.sheets.filter(x => x !== sh); save();
      } catch (e) { }
    }
    return false;
  }

  /* ---------- 엄마 홈: 오늘의 3단계 ---------- */
  function momCard() {
    const kid = MS().kid(), f = fam(), d = f.days[today()], name = esc(MS().kname ? MS().kname(kid) : kid.name);
    const done = doneToday(); const tot = done.reduce((a, s) => { const r = score(s); a.ok += r.ok; a.n += r.n; a.wrong = a.wrong.concat(r.wrong); return a; }, { ok: 0, n: 0, wrong: [] });
    const s1 = !!d.together, s2 = done.length > 0, s3 = !!d.checked;
    const u = todayUnit(); const learnHref = u.id ? `#learn/${u.id}/${u.l || 0}` : '#study';
    const step = (n, on, title, sub, act) => `<li class="fm-step ${on ? 'on' : ''}"><span class="fm-n">${on ? '✓' : n}</span><div class="fm-t"><b>${title}</b><small>${sub}</small></div>${act}</li>`;
    return `<div class="card fam-card">
      <div class="card-head"><h2>오늘의 엄마표 3단계</h2><span class="xs muted">${[s1, s2, s3].filter(Boolean).length}/3</span></div>
      ${d.brag && !s3 ? `<div class="fm-brag">${name}가 "오늘 공부 다 했어요!" 하고 알려 왔어요. 결과를 보고 칭찬해 주세요.</div>` : ''}
      <ol class="fm-steps">
        ${step(1, s1, '함께 10분 · 개념 설명', '한 장 개념 카드를 보여 주며 설명해요', s1 ? '' : `<span class="fm-acts"><button class="btn btn-sm btn-primary" data-act="fmCard" data-u="${u.id}" data-l="${u.l || 0}">개념 카드</button><button class="btn btn-sm" data-act="fmLive" data-u="${u.id}" data-l="${u.l || 0}">📱 아이 폰과 함께 보기</button><button class="btn btn-sm" data-act="fmTogether">했어요</button></span>`)}
        ${step(2, s2, `혼자 15분 · ${name} 차례`, s2 ? `문제 ${tot.n}개 중 ${tot.ok}개 맞혔어요` : '휴대폰을 건네면 영상 → 문제 순서로 안내해요', s2 ? '' : `<span class="fm-acts"><button class="btn btn-sm btn-primary" data-act="fmHandoff">아이에게 넘기기</button></span>`)}
        ${step(3, s3, '확인 3분 · 칭찬하기', s2 ? (tot.wrong.length ? `틀린 문제 ${tot.wrong.length}개를 같이 보고 칭찬 한마디` : '모두 맞혔어요. 칭찬 한마디만 보내 주세요') : '아이가 끝내면 여기서 결과를 볼 수 있어요', '')}
      </ol>
      ${s2 ? `<div class="fm-result">
        <div class="fm-score"><b>${tot.n ? Math.round(tot.ok / tot.n * 100) : 0}<small>점</small></b><span>${tot.ok}/${tot.n} 정답</span></div>
        ${tot.wrong.length ? `<div class="fm-wrong"><div class="xs muted">같이 다시 볼 문제</div><ul>${tot.wrong.slice(0, 4).map(p => `<li>${esc(qText(p) || '문제')}</li>`).join('')}</ul></div>` : '<div class="fm-wrong"><b>모두 맞혔어요</b></div>'}
      </div>
      <div class="fm-praise" data-keep-emoji><div class="xs muted">칭찬 스티커 · 한 번 누르면 아이 화면에 떠요</div><div class="fm-stk">${STICK.map(([e, t]) => `<button class="fm-st" data-act="fmPraise" data-t="${e} ${t}"><span>${e}</span>${t}</button>`).join('')}</div></div>` : ''}
    </div>`;
  }

  /* ---------- 아이 모드: 오늘의 길 ---------- */
  function kidPath() {
    const kid = MS().kid(), f = fam(), d = f.days[today()], name = esc(MS().kname ? MS().kname(kid) : kid.name);
    const vids = (MS().st().vw || {}); const watched = Object.values(vids).some(v => String(v).slice(0, 10) === today());
    const sh = assigned()[0]; const solved = doneToday().length > 0;
    const unread = f.praise.filter(p => !p.seen);
    const steps = [
      ['영상 보기', '오늘 배울 걸 먼저 봐요', '#kid/v', watched, '🎬'],
      ['문제 풀기', sh ? `${sh.problems.length}문제 · 맞히면 코인!` : solved ? '다 풀었어요!' : '문제를 준비하고 있어요', sh ? `#kid/s/${sh.id}` : '#kid', solved, '✏️'],
    ];
    if (solved && !d.brag) { d.brag = true; save(); } // 문제를 다 풀면 자동으로 엄마에게 알림
    const cur = steps.findIndex(s => !s[3]);
    return `<div class="kid-card kp-card" data-keep-emoji>
      ${unread.length ? `<div class="kp-praise"><span class="kp-stk">${esc(unread[unread.length - 1].t.split(' ')[0])}</span><div><small>엄마가 보낸 스티커</small><b>${esc(unread[unread.length - 1].t.split(' ').slice(1).join(' '))}</b></div><button data-act="kpSeen" aria-label="확인">고마워요</button></div>` : ''}
      <div class="kp-head"><h2>${name}의 오늘의 길</h2><button class="kp-say" data-act="kpSay" aria-label="읽어 주기">🔊 읽어 줘</button></div>
      <ol class="kp-steps">${steps.map(([t, s, href, ok, ic], i) => {
        const inner = `<span class="kp-ic">${ok ? '⭐' : ic}</span><span class="kp-t"><b>${i + 1}. ${t}</b><small>${s}</small></span><span class="kp-go">${ok ? '완료' : i === cur ? '지금!' : ''}</span>`;
        const cls = `kp-step ${ok ? 'ok' : ''} ${i === cur ? 'cur' : ''}`;
        return `<li><a class="${cls}" href="${href}">${inner}</a></li>`;
      }).join('')}</ol>
      ${cur === -1 ? `<div class="kp-done">다 했어요! 엄마에게 알렸어요.<small>받은 스티커 ${f.praise.length}개</small></div>` : ''}
    </div>`;
  }

  function sayPath() {
    const t = [...document.querySelectorAll('.kp-step')].map((e, i) => e.querySelector('b').textContent + '. ' + e.querySelector('small').textContent).join(' ');
    try { speechSynthesis.cancel(); const u = new SpeechSynthesisUtterance('오늘의 길이야. ' + t); u.lang = 'ko-KR'; u.rate = 0.95; speechSynthesis.speak(u); } catch (e) { MS().toast('이 기기에서는 읽어 주기를 쓸 수 없어요'); }
  }

  /* ---------- 화면에 끼워 넣기 ---------- */
  let pend = false;
  function after() {
    if (!MS() || !MS().st || !MS().st().kids.length || !isElem()) return;
    const h = location.hash || '#home';
    if ((h === '#home' || h === '#') && !(window.SubjApp && SubjApp.isStu && SubjApp.isStu())) {
      const wrap = document.querySelector('#app .wrap'); if (!wrap) return;
      if (wrap.querySelector('.fam-card')) return tidyMom(wrap);
      const head = wrap.querySelector('.page-head');
      const box = document.createElement('div'); box.innerHTML = momCard();
      // 엄마가 가장 먼저 봐야 하는 '오늘의 3단계'를 제목 바로 아래(큰 배너보다 위)에
      if (head) head.insertAdjacentElement('afterend', box.firstElementChild); else wrap.insertAdjacentElement('afterbegin', box.firstElementChild);
      // 홈 상단 광고는 3단계 카드 아래로
      tidyMom(wrap);
    } else if (h === '#kid') {
      const body = document.querySelector('#app .kid-body'); if (!body) return;
      const have = body.querySelector('.kp-card'); if (have) { if (body.firstElementChild !== have) body.insertAdjacentElement('afterbegin', have); return tidyKid(body); } // 학습 알 카드보다 항상 위
      if (ensureSheet()) { MS().render(); return; }
      const box = document.createElement('div'); box.innerHTML = kidPath(); body.insertAdjacentElement('afterbegin', box.firstElementChild);
      // 과목 고르기는 '다른 과목도 해 볼래?' 아래로 접기
      const grid = [...body.children].find(e => e !== body.firstElementChild && /오늘 공부할 과목/.test(e.textContent || '') && e.matches('.kid-card, .sp-kid, div'));
      if (grid && !grid.closest('details')) { const d = document.createElement('details'); d.className = 'kp-more'; d.innerHTML = '<summary>다른 과목도 해 볼래?</summary>'; grid.insertAdjacentElement('beforebegin', d); d.appendChild(grid); }
      tidyKid(body);
    }
  }
  // 엄마 홈: '오늘의 3단계'와 겹치는 큰 배너·과목별 이어서·더 보기·중간 광고·빈 떠 있는 버튼은 뺀다(메뉴에서 모두 갈 수 있음)
  function tidyMom(wrap) {
    wrap.querySelectorAll(':scope > .tt-hero, :scope > .card.hero, .sp-home, .home-more, .ad-home_mid').forEach(e => e.remove());
    const fab = document.querySelector('.fab'); if (fab) fab.remove();
    const q = wrap.querySelector('.home-quick'), f = wrap.querySelector('.fam-card'), ad = wrap.querySelector('.ad-home_top');
    if (q && f && f.nextElementSibling !== q) f.insertAdjacentElement('afterend', q);
    if (ad && (q || f) && (q || f).nextElementSibling !== ad) (q || f).insertAdjacentElement('afterend', ad);
  }
  // 아이 화면: '오늘의 길'과 겹치는 '오늘 풀 문제'·'오늘 배울 개념 영상' 카드는 뺀다(오늘의 길 1·2단계로 들어감)
  function tidyKid(body) {
    [...body.children].forEach(e => { if (e.matches('.kid-card:not(.kp-card)') && /(오늘 풀 문제|오늘 배울 개념 영상)/.test((e.textContent || '').trim().slice(0, 30))) e.remove(); });
  }
  function boot() { const mo = new MutationObserver(() => { if (pend) return; pend = true; requestAnimationFrame(() => { pend = false; after(); }); }); const r = document.getElementById('app'); if (r) mo.observe(r, { childList: true, subtree: true }); window.addEventListener('hashchange', () => setTimeout(after, 30)); after(); }
  document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', boot) : boot();

  document.addEventListener('click', e => {
    const b = e.target.closest('[data-act]'); if (!b) return; const act = b.dataset.act; const H = {
      fmTogether() { fam().days[today()].together = true; save(); MS().render(); MS().toast('함께 공부 완료!'); },
      fmHandoff() { ensureSheet(); fam().days[today()].handoff = true; save(); handoff(); },
      fmCard() { if (window.InfoCard) InfoCard.open(b.dataset.u, b.dataset.l); },
      fmLive() { if (window.LiveApp) LiveApp.start(b.dataset.u, b.dataset.l); },
      fmPraise() { const f = fam(); f.praise.push({ t: b.dataset.t, at: Date.now(), seen: false }); f.days[today()].checked = true; save(); if (window.LiveApp) LiveApp.sticker(b.dataset.t); MS().render(); MS().toast('스티커를 보냈어요'); },
      kpSeen() { fam().praise.forEach(p => p.seen = true); save(); MS().render(); },
      kpSay() { sayPath(); },
    };
    if (H[act]) { e.preventDefault(); H[act](); }
  });

  /* ---------- 한 대로 쓸 때: 넘기기 화면 · 꾹 눌러 돌아오기 ---------- */
  let passKid = false, passMom = false;
  function handoff() {
    const kid = MS().kid(), name = esc(MS().kname ? MS().kname(kid) : kid.name);
    const o = document.createElement('div'); o.className = 'sw-over'; o.setAttribute('data-keep-emoji', '');
    o.innerHTML = `<div class="sw-box"><div class="sw-big">🙌</div><h2>${name}야, 이제 네 차례!</h2><p>엄마가 휴대폰을 건네줬어요</p><button class="sw-go">시작하기</button><button class="sw-back">아직 엄마가 볼게요</button></div>`;
    document.body.appendChild(o);
    o.querySelector('.sw-go').addEventListener('click', () => { o.remove(); passKid = true; const k = document.querySelector('[data-act="enterKid"]'); if (k) k.click(); else MS().go('kid'); passKid = false; });
    o.querySelector('.sw-back').addEventListener('click', () => o.remove());
  }
  function holdToMom(btn) {
    const o = document.createElement('div'); o.className = 'sw-over'; o.setAttribute('data-keep-emoji', '');
    o.innerHTML = `<div class="sw-box"><h2>엄마 모드로 돌아가기</h2><p>엄마가 아래 버튼을 2초 동안 꾹 눌러 주세요</p><button class="sw-hold"><i></i><span>꾹 누르기</span></button><button class="sw-back">아이 화면 계속</button></div>`;
    document.body.appendChild(o); const h = o.querySelector('.sw-hold'); let t = null;
    const start = (e) => { e.preventDefault(); h.classList.add('on'); t = setTimeout(() => { o.remove(); passMom = true; btn.click(); passMom = false; }, 2000); };
    const stop = () => { h.classList.remove('on'); clearTimeout(t); };
    h.addEventListener('pointerdown', start); ['pointerup', 'pointerleave', 'pointercancel'].forEach(ev => h.addEventListener(ev, stop));
    o.querySelector('.sw-back').addEventListener('click', () => o.remove());
  }
  // 초등에서 아이 모드 들어가기·나가기를 가로채 단순한 화면으로(비밀번호를 정한 집은 기존 비밀번호 확인 유지)
  document.addEventListener('click', e => {
    const b = e.target.closest('[data-act="enterKid"], [data-act="exitKid"]'); if (!b || !isElem()) return;
    if (b.dataset.act === 'enterKid' && !passKid) { e.preventDefault(); e.stopImmediatePropagation(); ensureSheet(); handoff(); }
    else if (b.dataset.act === 'exitKid' && !passMom && !MS().st().pin) { e.preventDefault(); e.stopImmediatePropagation(); holdToMom(b); }
  }, true);

  window.FamilyApp = { momCard, kidPath, ensureSheet, handoff };
})();
