/* 쌤픽 — 스크롤·드래그 기본 위치 (화면별 최적화)
   1. 뒤로 가기: 그 화면에서 보던 위치로 복원 / 새 화면: 맨 위(기존 동작)
   2. 가로 칩·요일 줄: 선택된 칩(오늘·현재)을 가운데로
   3. 목록 화면: 지금 할 차시·단원·개념이 화면 아래에 있으면 그 위치로
   4. 개념 과외: 새 말풍선이 나오면 그 말풍선으로 부드럽게
   5. 팝업: 열릴 때 맨 위, PC는 첫 입력칸 포커스, 휴대폰은 키보드에 가리지 않게 입력칸을 가운데로
   6. PC 마우스로 가로 줄 끌어서 넘기기, 가로 줄·팝업 스크롤이 페이지로 번지지 않게 */
(function () {
  'use strict';
  const app = () => document.getElementById('app');
  const key = () => location.hash || '#home';
  // 고정 머리글 높이: 모바일은 .topbar, 데스크톱은 상단으로 옮긴 .sidebar
  const headerH = () => { let m = 0; document.querySelectorAll('.topbar, .sidebar, .mtop').forEach(h => { const cs = getComputedStyle(h); if (cs.display !== 'none' && /fixed|sticky/.test(cs.position) && h.getBoundingClientRect().top <= 1 && h.offsetWidth > innerWidth * 0.6) m = Math.max(m, h.offsetHeight); }); return m; };
  const syncPad = () => { document.documentElement.style.scrollPaddingTop = (headerH() + 12) + 'px'; };
  window.addEventListener('resize', syncPad);
  const bottomH = () => { const b = document.querySelector('.bottomnav'); return b && getComputedStyle(b).display !== 'none' ? b.offsetHeight : 0; };

  /* ---------- 1. 뒤로·앞으로 이동 시 위치 복원 ---------- */
  const pos = {}; let seq = (history.state && history.state.__i) || 0; let cur = seq; let cameBack = false;
  if (!history.state || history.state.__i == null) { try { history.replaceState(Object.assign({}, history.state, { __i: seq }), ''); } catch (e) { } }
  window.addEventListener('scroll', () => { pos[key()] = window.scrollY; }, { passive: true });
  window.addEventListener('popstate', e => { const i = e.state && e.state.__i; cameBack = i != null && i < cur; if (i != null) cur = i; });
  window.addEventListener('hashchange', () => {
    const st = history.state || {};
    if (st.__i == null) { seq = Math.max(seq, cur) + 1; cur = seq; try { history.replaceState(Object.assign({}, st, { __i: seq }), ''); } catch (e) { } cameBack = false; }
    const y = pos[key()];
    if (cameBack && y > 0) { const go = () => window.scrollTo(0, Math.min(y, document.documentElement.scrollHeight)); requestAnimationFrame(go); setTimeout(go, 120); }
    entered = true;
  });

  // 지금 화면의 메뉴를 다시 누르면 맨 위로(앱 공통 관례)
  document.addEventListener('click', e => {
    const a = e.target.closest('.nav a[href^="#"], .bottomnav a[href^="#"]'); if (!a) return;
    if (a.getAttribute('href') === key() || (key() === '#home' && a.getAttribute('href') === '#home')) { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }
  }, true);

  /* ---------- 2. 가로 줄: 선택 항목 가운데 ---------- */
  const ROW = '.scroll-x, .hi-sub, .sp-tabs, .week, .chips.scroll-x, .top-tabs, .lp-dots, .tu-list-tabs';
  const ACTIVE = '.on, .sel, .today, .cur, .current, [aria-current="true"], [aria-selected="true"]';
  function centerRows(root) {
    root.querySelectorAll(ROW).forEach(row => {
      if (row.scrollWidth <= row.clientWidth + 4) return;
      const a = row.querySelector(ACTIVE); if (!a) return;
      const target = a.offsetLeft - (row.clientWidth - a.offsetWidth) / 2;
      row.scrollLeft = Math.max(0, Math.min(target, row.scrollWidth - row.clientWidth));
    });
  }

  /* ---------- 3. 목록 화면: 지금 할 곳으로 ---------- */
  // 우선순위대로. 화면 아래쪽(보이지 않는 곳)에 있을 때만 이동한다.
  const FOCUS = ['.sp-lesson.cur', '.unit-card.current', '.tu-list .li[data-next]', '[data-scroll-default]'];
  function focusDefault(root) {
    if (window.scrollY > 40) return; // 사용자가 이미 움직였거나 복원된 경우
    for (const sel of FOCUS) {
      const el = root.querySelector(sel); if (!el) continue;
      const r = el.getBoundingClientRect(); const vh = window.innerHeight - bottomH();
      if (r.top > vh * 0.75 || r.bottom > vh) window.scrollTo({ top: Math.max(0, window.scrollY + r.top - headerH() - vh * 0.3), behavior: 'auto' });
      return;
    }
  }

  /* ---------- 4. 개념 과외: 새 말풍선으로 ---------- */
  let lastBub = { id: '', n: 0 };
  function tutorFollow(root) {
    const chat = root.querySelector('.tu-chat'); if (!chat) { lastBub = { id: '', n: 0 }; return; }
    const id = key(); const bubs = chat.querySelectorAll('.tu-b'); const n = bubs.length;
    if (lastBub.id === id && n > lastBub.n) {
      const last = bubs[n - 1]; const ctl = chat.querySelector('.tu-ctl');
      const r = last.getBoundingClientRect(); const vh = window.innerHeight - bottomH();
      const want = (ctl ? ctl.getBoundingClientRect().bottom : r.bottom) + 12;
      if (want > vh || r.top < headerH()) {
        const delta = Math.min(r.top - headerH() - 12, want - vh); // 말풍선 머리는 보이게, 버튼까지 보이도록
        window.scrollBy({ top: Math.max(delta, 0), behavior: 'smooth' });
      }
    }
    lastBub = { id, n };
  }

  /* ---------- 5. 팝업 ---------- */
  const finePointer = window.matchMedia('(pointer: fine)').matches;
  function onModal(m) {
    if (m._ux) return; m._ux = true;
    const box = m.querySelector('.modal') || m; box.scrollTop = 0;
    if (finePointer) { const f = box.querySelector('input:not([type=hidden]):not([type=checkbox]):not([type=radio]):not([type=date]), textarea'); if (f && !f.value) setTimeout(() => f.focus({ preventScroll: true }), 60); }
  }
  // 휴대폰 키보드가 입력칸을 가리지 않게
  document.addEventListener('focusin', e => {
    const t = e.target; if (finePointer || !t.matches || !t.matches('input, textarea, select')) return;
    setTimeout(() => {
      const vv = window.visualViewport; const vh = vv ? vv.height : window.innerHeight; const r = t.getBoundingClientRect();
      if (r.bottom > vh - 12 || r.top < headerH()) t.scrollIntoView({ block: 'center', behavior: 'smooth' });
    }, 320);
  });

  /* ---------- 6. 끌어서 넘기기(PC 마우스) ---------- */
  document.addEventListener('pointerdown', e => {
    if (e.pointerType !== 'mouse' || e.button !== 0) return;
    const row = e.target.closest(ROW); if (!row || row.scrollWidth <= row.clientWidth) return;
    const x0 = e.clientX, s0 = row.scrollLeft; let moved = false;
    const mv = ev => { const dx = ev.clientX - x0; if (Math.abs(dx) > 5) { moved = true; row.classList.add('ux-drag'); } if (moved) row.scrollLeft = s0 - dx; };
    const up = () => { window.removeEventListener('pointermove', mv); window.removeEventListener('pointerup', up); row.classList.remove('ux-drag'); if (moved) { const stop = ev => { ev.stopPropagation(); ev.preventDefault(); }; row.addEventListener('click', stop, { capture: true, once: true }); setTimeout(() => row.removeEventListener('click', stop, true), 50); } };
    window.addEventListener('pointermove', mv); window.addEventListener('pointerup', up);
  });

  /* ---------- 렌더 감시 ---------- */
  let entered = true, pend = false;
  function after() {
    const root = app(); if (!root) return;
    syncPad(); centerRows(document);
    tutorFollow(root);
    if (entered) { entered = false; if (!cameBack) focusDefault(root); cameBack = false; }
    document.querySelectorAll('.modal-bg').forEach(onModal);
  }
  const mo = new MutationObserver(() => { if (pend) return; pend = true; requestAnimationFrame(() => { pend = false; after(); }); });
  function boot() { const r = app(); if (r) mo.observe(r, { childList: true, subtree: true }); mo.observe(document.body, { childList: true }); after(); }
  document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', boot) : boot();

  const s = document.createElement('style');
  s.textContent = `${ROW}{overscroll-behavior-x:contain;scroll-behavior:smooth;-webkit-overflow-scrolling:touch}
  .ux-drag{cursor:grabbing;scroll-behavior:auto!important;user-select:none}
  .modal-bg,.modal{overscroll-behavior:contain}
  html{scroll-padding-bottom:84px}`;
  document.head.appendChild(s);
})();
