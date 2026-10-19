/* 맘쌤 — 재미 요소: 학습 캐릭터 · XP/레벨 · 배지 · 오늘의 미션 · 정답 효과 */
(function () {
  const MS = () => window.MS;
  const ready = () => { try { return MS() && MS().st().kids && MS().st().kids.length && MS().kid(); } catch (e) { return false; } };
  const esc = (s) => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const today = () => MS().today();

  /* ---------- 캐릭터 · 레벨 ---------- */
  const STAGES = [
    [1, '🥚', '학습 알', '새싹 학습자'],
    [2, '🐣', '아기 병아리', '호기심 탐험가'],
    [3, '🐥', '병아리', '꾸준 연습생'],
    [5, '🐤', '아기 새', '개념 수집가'],
    [7, '🦜', '똑똑 앵무새', '생각 탐구가'],
    [10, '🦉', '지혜 부엉이', '지식 마스터'],
    [14, '🦅', '하늘 독수리', '최상위 도전자'],
    [20, '🐉', '전설의 용', '전설의 학습왕']
  ];
  const stageOf = (lv) => STAGES.filter(s => lv >= s[0]).pop();
  const lvStart = (lv) => { let x = 0; for (let k = 1; k < lv; k++) x += 80 + 40 * k; return x; };
  const lvOf = (xp) => { let lv = 1; while (xp >= lvStart(lv + 1)) lv++; return lv; };

  const LINES = ['오늘도 한 걸음! 같이 가 보자 💪', '틀려도 괜찮아, 다시 보면 내 것이 돼!', '문제를 천천히 읽으면 답이 보여 👀', '어제보다 조금 더 똑똑해졌어!', '쉬는 것도 공부야. 물 한 잔 마시고 하자 🥤', '모르는 걸 아는 게 진짜 실력이야 ✨', '꾸준함이 최고의 비법이야 🔥', '오늘 미션 3개, 할 수 있어!', '고난도 문제 하나 도전해 볼까? 🔥', '설명할 수 있으면 진짜 아는 거야 🗣️'];

  /* ---------- 통계 (저장 데이터에서 계산) ---------- */
  function ymd(d) { return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); }
  function stats() {
    const st = MS().st(), kid = MS().kid(), id = kid.id;
    const les = (st.lessons || []).filter(l => l.kidId === id);
    const sp = (st.sp || {})[id] || { q: {} };
    let correct = 0; Object.values(sp.q || {}).forEach(q => { correct += q.ok || 0; });
    const top = (st.top || {})[id] || { deep: {}, hard: {} };
    const deepV = Object.values(top.deep || {}), hardV = Object.values(top.hard || {});
    const ds = new Set(les.map(l => l.date)); let streak = 0; const d = new Date(); if (!ds.has(ymd(d))) d.setDate(d.getDate() - 1); while (ds.has(ymd(d))) { streak++; d.setDate(d.getDate() - 1); }
    return {
      lessons: les.length, todayLessons: les.filter(l => l.date === today()).length,
      subjects: new Set(les.map(l => l.subj || 'math')).size,
      correct, coins: kid.coins || 0, videos: Object.keys(st.vw || {}).length,
      deep: deepV.length, deepGood: deepV.filter(v => v >= 3).length,
      hard: hardV.reduce((a, r) => a + (r.best || 0), 0), hardPerfect: hardV.filter(r => r.best === 3).length,
      streak
    };
  }
  function fun() { const st = MS().st(); st._fun = st._fun || { sound: true, k: {} }; const id = MS().kid().id; st._fun.k[id] = st._fun.k[id] || { badges: [], bonus: {} }; return st._fun.k[id]; }
  function xpOf(s, f) { return s.lessons * 20 + s.correct * 5 + s.coins * 2 + s.videos * 3 + s.deep * 10 + s.deepGood * 5 + s.hard * 15 + Object.values(f.bonus || {}).reduce((a, b) => a + b, 0); }

  /* ---------- 배지 ---------- */
  const BADGES = [
    ['first', '👣', '첫 걸음', '첫 차시 학습 완료', s => s.lessons >= 1],
    ['l10', '📚', '열 걸음', '차시 10개 학습', s => s.lessons >= 10],
    ['l50', '🏃', '공부 러너', '차시 50개 학습', s => s.lessons >= 50],
    ['s3', '🔥', '3일 연속', '3일 연속 공부', s => s.streak >= 3],
    ['s7', '🌟', '일주일 개근', '7일 연속 공부', s => s.streak >= 7],
    ['c30', '✅', '정답 수집가', '확인 문제 30개 정답', s => s.correct >= 30],
    ['c100', '💯', '정답왕', '확인 문제 100개 정답', s => s.correct >= 100],
    ['v10', '🎬', '영상 탐험가', '개념 영상 10개 시청', s => s.videos >= 10],
    ['sub4', '🧭', '전 과목 탐험', '4과목 이상 학습', s => s.subjects >= 4],
    ['deep1', '🧠', '생각 도전자', '심화 문항 첫 채점', s => s.deep >= 1],
    ['deep20', '💡', '생각의 달인', "심화 '잘함' 20개", s => s.deepGood >= 20],
    ['hard1', '⚔️', '고난도 정복', '고난도 3문항 모두 정답', s => s.hardPerfect >= 1],
    ['hard10', '👑', '최상위 마스터', '고난도 만점 10단원', s => s.hardPerfect >= 10],
    ['coin100', '🪙', '코인 부자', '코인 100개 모으기', s => s.coins >= 100],
    ['lv5', '🐤', '레벨 5', '레벨 5 달성', (s, lv) => lv >= 5],
    ['lv10', '🦉', '레벨 10', '레벨 10 달성', (s, lv) => lv >= 10]
  ];

  /* ---------- 오늘의 미션 ---------- */
  function missions(s, f) {
    const t = today();
    if (!f.day || f.day.date !== t) f.day = { date: t, base: { correct: s.correct, coins: s.coins, videos: s.videos, deep: s.deep, hard: s.hard } };
    const b = f.day.base;
    const corr = (s.correct - b.correct) + Math.floor((s.coins - b.coins) / 2);
    const alt = new Date().getDay() % 2 === 0;
    return [
      { ic: '📖', n: '1차시 학습하기', v: s.todayLessons, g: 1 },
      { ic: '✅', n: '문제 5개 맞히기', v: corr, g: 5 },
      alt ? { ic: '🎬', n: '개념 영상 1개 보기', v: s.videos - b.videos, g: 1 } : { ic: '🏆', n: '최상위 1문항 도전', v: (s.deep - b.deep) + (s.hard - b.hard > 0 ? 1 : 0), g: 1 }
    ].map(m => Object.assign(m, { ok: m.v >= m.g, v: Math.max(0, Math.min(m.v, m.g)) }));
  }

  /* ---------- 효과: 사운드 · 진동 · 색종이 ---------- */
  let AC = null;
  function tone(seq) {
    try {
      if (!MS().st()._fun || MS().st()._fun.sound === false) return;
      AC = AC || new (window.AudioContext || window.webkitAudioContext)();
      let t = AC.currentTime;
      seq.forEach(([f, d, type]) => { const o = AC.createOscillator(), g = AC.createGain(); o.type = type || 'sine'; o.frequency.value = f; g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.07, t + 0.01); g.gain.exponentialRampToValueAtTime(0.0001, t + d); o.connect(g); g.connect(AC.destination); o.start(t); o.stop(t + d + 0.02); t += d * 0.8; });
    } catch (e) { }
  }
  const SND = { ok: [[660, .09], [990, .16]], no: [[220, .18, 'triangle']], combo: [[660, .07], [880, .07], [1175, .18]], lv: [[523, .12], [659, .12], [784, .12], [1047, .3]], badge: [[880, .1], [1320, .25]] };
  const buzz = (p) => { try { navigator.vibrate && navigator.vibrate(p); } catch (e) { } };

  function confetti(x, y, n, spread) {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const cv = document.createElement('canvas'); cv.className = 'fx-cv'; const W = cv.width = innerWidth, H = cv.height = innerHeight; document.body.appendChild(cv);
    const c = cv.getContext('2d'), cols = ['#4A7DF0', '#FF8A3D', '#FFC93C', '#22B36B', '#FF7EA8', '#9B7BFF'];
    x = x == null ? W / 2 : x; y = y == null ? H / 3 : y; spread = spread || 1;
    const P = Array.from({ length: n || 40 }, () => ({ x, y, vx: (Math.random() - .5) * 9 * spread, vy: -Math.random() * 9 * spread - 2, r: Math.random() * 6 + 3, c: cols[Math.random() * cols.length | 0], a: Math.random() * 6, s: Math.random() < .5 }));
    let f = 0; (function step() { c.clearRect(0, 0, W, H); P.forEach(p => { p.x += p.vx; p.y += p.vy; p.vy += .28; p.vx *= .99; p.a += .2; c.save(); c.translate(p.x, p.y); c.rotate(p.a); c.fillStyle = p.c; if (p.s) c.fillRect(-p.r / 2, -p.r / 2, p.r, p.r * 1.6); else { c.beginPath(); c.arc(0, 0, p.r / 2, 0, 7); c.fill(); } c.restore(); }); if (++f < 90) requestAnimationFrame(step); else cv.remove(); })();
  }
  function floatMsg(html, cls) {
    const el = document.createElement('div'); el.className = 'fx-float ' + (cls || ''); el.innerHTML = html; document.body.appendChild(el);
    setTimeout(() => el.remove(), 1900);
  }

  /* ---------- 정답 · 오답 감지 ---------- */
  let combo = 0; const seen = new WeakSet(), recent = new Map();
  function onAnswer(ok, el) {
    const r = el.getBoundingClientRect();
    if (ok) {
      combo++; tone(combo >= 3 ? SND.combo : SND.ok); buzz(25);
      confetti(r.left + r.width / 2, r.top + r.height / 2, combo >= 3 ? 50 : 24, combo >= 3 ? 1.2 : .7);
      if (combo >= 3) floatMsg(`🔥 ${combo}연속 정답!`, 'combo');
    } else {
      combo = 0; tone(SND.no); buzz([40, 30, 40]);
      el.classList.remove('fx-shake'); void el.offsetWidth; el.classList.add('fx-shake');
    }
  }
  const mo = new MutationObserver(() => {
    const els = [...document.querySelectorAll('.lp-opt.ok, .lp-opt.no, .feedback.ok, .feedback.no, .lp-inp .ok, .lp-inp .no, .lp-fb.ok, .lp-fb.no')].filter(e => !seen.has(e));
    const done = [...document.querySelectorAll('.lp-card.pop')].filter(e => !seen.has(e));
    done.forEach(e => { seen.add(e); const em = e.querySelector('.big-emoji'); if (em) { setTimeout(() => { confetti(null, innerHeight / 3, em.textContent.includes('🎉') ? 110 : 50, 1.4); tone(SND.combo); }, 150); } });
    if (!els.length) return;
    els.forEach(e => seen.add(e));
    const box = els[0].closest('.lp-card, .kid-card, .hq, .lp-body');
    const key = box ? (box.textContent || '').replace(/\s+/g, '').slice(0, 160) : '';
    if (key && recent.get(key) > Date.now() - 60000) return;
    if (key) recent.set(key, Date.now());
    const wrong = els.find(e => e.classList.contains('no') && !/입력해/.test(e.textContent));
    const right = els.find(e => e.classList.contains('ok'));
    if (wrong) onAnswer(false, wrong.closest('.hq, .lp-q, .kid-card, .lp-body') || wrong);
    else if (right) onAnswer(true, right);
  });

  /* ---------- 진행 감시: XP · 레벨 · 배지 ---------- */
  let guard = false, timer = null;
  function persist() { guard = true; try { MS().save(); } finally { guard = false; } }
  function check(silent) {
    if (!ready()) return;
    const f = fun(), s = stats();
    const ms = missions(s, f);
    if (ms.every(m => m.ok) && !f.bonus[today()]) { f.bonus[today()] = 50; if (!silent) { setTimeout(() => { floatMsg('🎁 오늘의 미션 완료! +50 XP', 'mission'); confetti(null, innerHeight / 2, 70, 1.3); tone(SND.lv); }, 600); } }
    const xp = xpOf(s, f), lv = lvOf(xp);
    const init = f.xp == null;
    const gain = xp - (f.xp || 0), prevLv = f.lv || lv;
    const earned = BADGES.filter(b => b[4](s, lv)).map(b => b[0]);
    const fresh = earned.filter(b => !f.badges.includes(b));
    f.xp = xp; f.lv = lv; f.badges = [...new Set(f.badges.concat(earned))];
    persist();
    if (init || silent) return;
    if (gain > 0) floatMsg(`+${gain} XP`, 'xp');
    if (lv > prevLv) setTimeout(() => levelUp(prevLv, lv), 500);
    else fresh.forEach((id, i) => setTimeout(() => badgeToast(id), 700 + i * 1300));
    refresh();
  }
  const origSet = Storage.prototype.setItem;
  Storage.prototype.setItem = function (k, v) {
    origSet.apply(this, arguments);
    if (!guard && this === window.localStorage) { clearTimeout(timer); timer = setTimeout(() => check(false), 120); }
  };

  function levelUp(from, to) {
    const a = stageOf(from), b = stageOf(to), evolve = a !== b;
    tone(SND.lv); buzz([30, 40, 30, 40, 80]);
    const ov = document.createElement('div'); ov.className = 'fx-lv';
    ov.innerHTML = `<div class="fx-lv-box"><div class="fx-lv-t">레벨 업!</div><div class="fx-lv-pet">${evolve ? `<span class="old">${a[1]}</span><span class="new">${b[1]}</span>` : `<span class="new">${b[1]}</span>`}</div><div class="fx-lv-n">Lv.${to}</div><p>${evolve ? `<b>${esc(b[2])}</b>(으)로 자랐어요!<br>칭호: ${esc(b[3])}` : '계속 이렇게만 하면 곧 진화해요!'}</p><button class="btn btn-primary btn-lg" data-fx="close">좋아요!</button></div>`;
    document.body.appendChild(ov);
    confetti(null, innerHeight / 2.5, 120, 1.6); setTimeout(() => confetti(null, innerHeight / 2.5, 80, 1.3), 500);
    ov.addEventListener('click', e => { if (e.target === ov || e.target.dataset.fx === 'close') ov.remove(); });
  }
  function badgeToast(id) {
    const b = BADGES.find(x => x[0] === id); if (!b) return;
    tone(SND.badge); floatMsg(`<span class="bt-ic">${b[1]}</span><span><b>새 배지! ${esc(b[2])}</b><small>${esc(b[3])}</small></span>`, 'badge');
    confetti(innerWidth / 2, innerHeight - 140, 40, 1);
  }

  /* ---------- 캐릭터 카드 ---------- */
  function card(compact) {
    const f = fun(), s = stats(), ms = missions(s, f), xp = xpOf(s, f), lv = lvOf(xp), sg = stageOf(lv), nx = STAGES.find(x => x[0] > lv);
    const a = lvStart(lv), b = lvStart(lv + 1), pc = Math.round((xp - a) * 100 / (b - a));
    const name = MS().kid().name || '';
    const line = LINES[(new Date().getDate() + lv) % LINES.length];
    const sound = MS().st()._fun.sound !== false;
    const got = BADGES.filter(x => f.badges.includes(x[0]));
    return `<div class="fun-card${compact ? ' compact' : ''}" id="funCard">
      <div class="fun-top">
        <button class="fun-pet" data-fx="pet" aria-label="캐릭터 쓰다듬기"><span class="pet">${sg[1]}</span><span class="lv">Lv.${lv}</span></button>
        <div class="fun-info">
          <div class="fun-name"><b>${esc(name)}의 ${esc(sg[2])}</b><span class="fun-title">${esc(sg[3])}</span></div>
          <div class="fun-bar"><i style="width:${pc}%"></i></div>
          <div class="fun-xp xs"><span>${xp - a} / ${b - a} XP</span><span>${nx ? `Lv.${nx[0]}에 ${nx[1]} 진화` : '최고 단계!'}</span></div>
          <div class="fun-say" id="funSay">${esc(line)}</div>
        </div>
        <button class="fun-snd" data-fx="snd" aria-label="효과음 ${sound ? '끄기' : '켜기'}">${sound ? '🔊' : '🔇'}</button>
      </div>
      <div class="fun-ms"><div class="fun-ms-h"><b>오늘의 미션</b><span class="xs muted">${ms.filter(m => m.ok).length}/3 · 모두 하면 +50 XP</span></div>
        <div class="fun-ms-list">${ms.map(m => `<div class="fun-m ${m.ok ? 'ok' : ''}"><span class="m-ic">${m.ok ? '✔' : m.ic}</span><span class="m-n">${esc(m.n)}</span><span class="m-p">${m.v}/${m.g}</span></div>`).join('')}</div></div>
      <button class="fun-bd" data-fx="badges"><span class="bd-row">${got.slice(-6).map(x => `<span>${x[1]}</span>`).join('') || '<span class="muted xs">아직 배지가 없어요</span>'}</span><span class="xs">배지 ${got.length}/${BADGES.length} ›</span></button>
    </div>`;
  }
  function badgeModal() {
    const f = fun();
    MS().modal(`<h2>🏅 나의 배지</h2><p class="muted small" style="margin:-6px 0 14px">공부할수록 하나씩 모여요. 회색 배지는 아직 잠겨 있어요.</p>
      <div class="bd-grid">${BADGES.map(b => { const on = f.badges.includes(b[0]); return `<div class="bd ${on ? 'on' : ''}"><span class="bd-ic">${b[1]}</span><b>${esc(b[2])}</b><small>${esc(b[3])}</small></div>`; }).join('')}</div>
      <div class="modal-actions"><button class="btn btn-primary" data-act="closeModal">닫기</button></div>`);
  }
  function mount(a) {
    document.getElementById('funCard') && document.getElementById('funCard').remove();
    if (!ready()) return;
    const r = a[0] || 'home';
    let host = null, where = 'after';
    if (r === 'home') { host = document.querySelector('.wrap .hero, .wrap .stu-hero, .wrap .card'); }
    else if (r === 'kid' && !a[1]) { host = document.querySelector('.kid-body'); where = 'prepend'; }
    else if (r === 'study' && a[1] === 'top') { host = document.querySelector('.top-tabs'); where = 'before'; }
    if (!host) return;
    const html = card(r === 'study');
    if (where === 'prepend') host.insertAdjacentHTML('afterbegin', html);
    else if (where === 'before') host.insertAdjacentHTML('beforebegin', html);
    else host.insertAdjacentHTML('afterend', html);
  }
  let lastA = ['home'];
  function refresh() { if (document.getElementById('funCard')) mount(lastA); }
  function after(a) { lastA = a || ['home']; try { mount(lastA); } catch (e) { } }

  document.addEventListener('click', e => {
    const el = e.target.closest('[data-fx]'); if (!el || !document.getElementById('funCard') || !document.getElementById('funCard').contains(el)) return;
    const t = el.dataset.fx;
    if (t === 'pet') {
      const p = el.querySelector('.pet'); p.classList.remove('jump'); void p.offsetWidth; p.classList.add('jump');
      const say = document.getElementById('funSay'); if (say) { say.textContent = LINES[Math.random() * LINES.length | 0]; say.classList.remove('pop'); void say.offsetWidth; say.classList.add('pop'); }
      tone([[880 + Math.random() * 300, .08]]); const r = el.getBoundingClientRect(); confetti(r.left + r.width / 2, r.top + 10, 12, .5);
    }
    if (t === 'snd') { const st = MS().st(); st._fun.sound = st._fun.sound === false; persist(); refresh(); if (st._fun.sound) tone(SND.ok); }
    if (t === 'badges') badgeModal();
  });

  const GONE = /^#(books|contents|scraps)(\/|\?|$)/;
  function sweep() { if (GONE.test(location.hash)) location.replace('#home'); }
  window.addEventListener('hashchange', sweep); sweep();
  function boot() {
    if (!window.MS) return setTimeout(boot, 200);
    mo.observe(document.body, { subtree: true, childList: true, attributes: true, attributeFilter: ['class'] });
    setTimeout(() => check(true), 300);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
  window.FunApp = { after, check, confetti };
})();
