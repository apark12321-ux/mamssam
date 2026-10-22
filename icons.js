/* 쌤픽 — 이모지 대신 선 아이콘
   · 아이콘 자리(메뉴·바로가기·목록 머리)에 있는 이모지는 같은 뜻의 선 아이콘으로 바꾼다
   · 제목·버튼·문장 앞에 붙은 장식용 이모지는 지운다
   · 아이 모드·학습 알(캐릭터 그림)처럼 이모지가 그림 역할을 하는 곳은 그대로 둔다 */
(function () {
  'use strict';
  const P = {
    home: 'M3 10.5 12 3l9 7.5M5 9v12h5v-6h4v6h5V9',
    timer: 'M9 2h6M12 14V9M12 22a8 8 0 1 0 0-16 8 8 0 0 0 0 16z',
    tutor: 'M2 5h7a3 3 0 0 1 3 3v13a2 2 0 0 0-2-2H2zM22 5h-7a3 3 0 0 0-3 3v13a2 2 0 0 1 2-2h8z',
    target: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM12 12h.01',
    pin: 'M6 3h12v18l-6-4-6 4z',
    cap: 'M2 9l10-5 10 5-10 5zM6 11v5c0 1.6 2.7 3 6 3s6-1.4 6-3v-5M22 9v6',
    calendar: 'M4 6h16v15H4zM4 10h16M8 3v4M16 3v4',
    chart: 'M3 21h18M6 17V11M11 17V6M16 17v-8M21 17V13',
    map: 'M9 4 3 6v14l6-2 6 2 6-2V4l-6 2zM9 4v14M15 6v14',
    books: 'M4 4h4v16H4zM10 4h4v16h-4zM16.5 5l3.5 1-3 14-3.5-1',
    school: 'M3 21h18M5 21V10l7-5 7 5v11M10 21v-5h4v5M12 9v2',
    settings: 'M4 6h9M17 6h3M4 12h3M11 12h9M4 18h11M19 18h1M15 4v4M9 10v4M17 16v4',
    pencil: 'M4 20h4L19 9l-4-4L4 16zM13 7l4 4',
    gauge: 'M3 18a9 9 0 1 1 18 0M12 18l4-6M7 18h10',
    note: 'M6 3h12v18H6zM9 7h6M9 11h6M9 15h4',
    trophy: 'M8 4h8v5a4 4 0 0 1-8 0zM8 6H5a3 3 0 0 0 3 4M16 6h3a3 3 0 0 1-3 4M12 13v4M8 21h8M10 17h4',
    play: 'M3 5h18v14H3zM10 9l5 3-5 3z',
    chat: 'M4 5h16v11H9l-5 4z',
    sheet: 'M6 3h9l4 4v14H6zM14 3v5h5M9 13h7M9 17h5',
    menu: 'M4 6h16M4 12h16M4 18h16',
    link: 'M10 14a4 4 0 0 0 5.6 0l3-3a4 4 0 0 0-5.6-5.6l-1 1M14 10a4 4 0 0 0-5.6 0l-3 3a4 4 0 0 0 5.6 5.6l1-1',
    hall: 'M3 21h18M4 10h16M12 3 3 8h18zM6 10v8M10 10v8M14 10v8M18 10v8',
    user: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4 21a8 8 0 0 1 16 0',
    check: 'M5 12l4 4 10-10',
    speaker: 'M3 10v4h4l6 4V6l-6 4zM17 9a4 4 0 0 1 0 6',
    egg: 'M12 3c4 0 7 6 7 11a7 7 0 0 1-14 0c0-5 3-11 7-11z',
    star: 'M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z',
    mail: 'M3 6h18v12H3zM3 7l9 6 9-6',
    search: 'M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14zM21 21l-5-5',
    globe: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18',
    flask: 'M9 3h6M10 3v6l-5 9a2 2 0 0 0 2 3h10a2 2 0 0 0 2-3l-5-9V3',
    abc: 'M4 18l4-12 4 12M5.5 14h5M14 6h4a2 2 0 0 1 0 4h-4zM14 10h4.5a2 2 0 0 1 0 4H14z',
    sigma: 'M18 5H6l6 7-6 7h12',
    dot: 'M12 13a1 1 0 1 0 0-2 1 1 0 0 0 0 2z'
  };
  const MAP = {
    '🏠': 'home', '⏱': 'timer', '⏱️': 'timer', '👩‍🏫': 'tutor', '📖': 'tutor', '🎯': 'target', '📌': 'pin', '📍': 'pin', '🎓': 'cap', '📅': 'calendar', '🗓️': 'calendar', '📈': 'chart', '📊': 'chart',
    '🗺️': 'map', '📚': 'books', '🏫': 'school', '⚙️': 'settings', '📝': 'pencil', '🎒': 'note', '🏆': 'trophy', '🎬': 'play', '💬': 'chat', '☰': 'menu', '🔗': 'link', '🏛️': 'hall',
    '🧒': 'user', '✅': 'check', '🔊': 'speaker', '🥚': 'egg', '⭐': 'star', '📣': 'speaker', '✉️': 'mail', '🔍': 'search', '🌏': 'globe', '🔬': 'flask', '🔤': 'abc', '📐': 'sigma', '📄': 'sheet', '🔢': 'sigma', '🗂️': 'books', '🎨': 'pencil', '🎵': 'speaker', '⚽': 'target', '🛠️': 'settings', '🙂': 'user'
  };
  const svg = (k) => `<svg class="ci" viewBox="0 0 24 24" aria-hidden="true"><path d="${P[k] || P.dot}"/></svg>`;
  const EMO_SRC = String.raw`(?:\p{Extended_Pictographic}|[\u{1F1E6}-\u{1F1FF}])(?:\uFE0F|\u200D(?:\p{Extended_Pictographic})\uFE0F?|[\u{1F3FB}-\u{1F3FF}])*\uFE0F?`;
  const EMO = /(?:\p{Extended_Pictographic}|[\u{1F1E6}-\u{1F1FF}])(?:️|‍(?:\p{Extended_Pictographic})️?|[\u{1F3FB}-\u{1F3FF}])*️?/gu;
  const EMO1 = new RegExp(EMO_SRC, 'u');
  const ICON_BOX = '.fun-snd, .ico, .hi-q-i, .li-ico, .hq-i, .e-ico, .of-i, .lv-ic, .te-ic, .sp-ic, .st-ic';
  const KEEP = '.fun-pet, .fx-float, .fx-lv, .kid, .kid-wrap, #kidSolve, .kid-mode, [data-keep-emoji], .speak, .pk-box, svg, script, style, textarea, input';

  function iconBoxes(root) {
    root.querySelectorAll(ICON_BOX).forEach(el => {
      if (el.querySelector('svg.ci') || el.closest(KEEP)) return;
      const t = el.textContent.trim(); if (!t) return;
      const only = t.replace(EMO, '').trim() === '';
      if (!only) return;
      const e = (t.match(EMO) || [''])[0];
      el.innerHTML = svg(MAP[e] || MAP[e.replace(/️/g, '')] || 'dot');
    });
    // 개념 과외 말풍선 얼굴 → 글자 표지
    root.querySelectorAll('.tu-av').forEach(el => { if (el.dataset.ci) return; el.dataset.ci = '1'; el.textContent = /🙋/.test(el.textContent) ? '나' : '쌤'; });
  }
  function stripText(root) {
    const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, { acceptNode: n => (!n.nodeValue || !EMO1.test(n.nodeValue)) ? NodeFilter.FILTER_REJECT : (n.parentElement && n.parentElement.closest(KEEP) ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT) });
    const list = []; let n; while ((n = w.nextNode())) list.push(n);
    list.forEach(t => { EMO.lastIndex = 0; t.nodeValue = t.nodeValue.replace(EMO, '').replace(/^\s+(?=\S)/, m => (t.previousSibling ? ' ' : '')).replace(/\s{2,}/g, ' '); });
  }
  function run(root) { root = root || document.body; try { iconBoxes(root); EMO.lastIndex = 0; stripText(root); } catch (e) { } }

  let pend = false;
  const mo = new MutationObserver(() => { if (pend) return; pend = true; requestAnimationFrame(() => { pend = false; mo.disconnect(); run(document.body); observe(); }); });
  const observe = () => mo.observe(document.body, { childList: true, subtree: true, characterData: false });
  function boot() { run(document.body); observe(); }
  document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', boot) : boot();
  window.SsaemIcons = { svg, run };
})();
