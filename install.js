/* 쌤픽 — 앱처럼 열기 · 앱 설치
   1) 카카오톡·네이버·인스타 등 앱 안 브라우저로 열리면 크롬(안드로이드)·사파리(iOS)로 자동 전환
   2) 크롬·삼성 인터넷·엣지: 설치 배너 + 첫 터치 때 설치 창 자동 표시
   3) iOS 사파리: "공유 → 홈 화면에 추가" 안내
   이미 앱으로 실행 중이면 아무것도 하지 않는다. */
(function () {
  'use strict';
  const ua = navigator.userAgent || '';
  const isAndroid = /Android/i.test(ua), isIOS = /iPhone|iPad|iPod/i.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  const standalone = window.matchMedia('(display-mode: standalone)').matches || window.matchMedia('(display-mode: fullscreen)').matches || navigator.standalone === true;
  const inApp = /KAKAOTALK|NAVER\(inapp|NAVER|DaumApps|Instagram|FBAN|FBAV|FB_IAB|Line\/|everytimeApp|BAND\/|Twitter|Snapchat|; wv\)/i.test(ua);
  const get = (k) => { try { return localStorage.getItem(k); } catch (e) { return null; } };
  const set = (k, v) => { try { localStorage.setItem(k, v); } catch (e) { } };
  const url = location.href;
  // 크롬 전환(intent) 주소에는 #이 하나만 있어야 하므로 앱 화면 위치(#…)는 ?h= 로 옮겨 보낸다
  const chromeTarget = () => { const h = location.hash.slice(1); const base = location.origin + location.pathname + location.search; return (base + (h ? (location.search ? '&' : '?') + 'h=' + encodeURIComponent(h) : '')).replace(/^https?:\/\//, ''); };
  (function restoreHash() { const m = location.search.match(/[?&]h=([^&]+)/); if (m && !location.hash) { const clean = location.search.replace(/([?&])h=[^&]+&?/, '$1').replace(/[?&]$/, ''); history.replaceState(null, '', location.pathname + clean + '#' + decodeURIComponent(m[1])); window.dispatchEvent(new HashChangeEvent('hashchange')); } })();
  const go = (u) => (typeof window.__insGo === 'function' ? window.__insGo(u) : location.assign(u)); // 테스트에서 이동을 가로챌 수 있게

  /* ---------- 1. 앱 안 브라우저 → 크롬·사파리 ---------- */
  function escapeInApp() {
    if (standalone || !inApp) return false;
    if (/[?&]stay=1/.test(location.search)) return false; // 사용자가 그대로 보기를 고른 경우
    if (/openExternalBrowser=1/.test(location.search)) return false;
    try { if (sessionStorage.getItem('ins_esc')) return false; sessionStorage.setItem('ins_esc', '1'); } catch (e) { } // 한 세션에 한 번만 시도(무한 이동 방지)
    if (/KAKAOTALK/i.test(ua)) { go('kakaotalk://web/openExternal?url=' + encodeURIComponent(url)); return true; }
    if (/Line\//i.test(ua)) { go(url + (url.includes('?') ? '&' : '?') + 'openExternalBrowser=1'); return true; }
    if (isAndroid) {
      go('intent://' + chromeTarget() + '#Intent;scheme=https;package=com.android.chrome;S.browser_fallback_url=' + encodeURIComponent(url) + ';end');
      return true;
    }
    return false; // iOS 기타 앱: 자동 전환 불가 → 안내
  }

  const css = `
  .ins-bar{position:fixed;left:12px;right:12px;bottom:calc(76px + env(safe-area-inset-bottom));z-index:9990;display:flex;align-items:center;gap:10px;background:#1F2A44;color:#fff;border-radius:16px;padding:10px 12px;box-shadow:0 10px 30px rgba(15,23,42,.28);animation:insUp .35s ease both;max-width:520px;margin:0 auto}
  .ins-bar img{width:40px;height:40px;border-radius:10px;flex:none}
  .ins-bar .t{flex:1;min-width:0;font-size:13px;line-height:1.35}.ins-bar .t b{display:block;font-size:14.5px}
  .ins-bar button{font:inherit;border:0;border-radius:10px;padding:9px 14px;font-weight:700;cursor:pointer}
  .ins-go{background:#FFD36A;color:#1F2A44}.ins-x{background:transparent;color:#fff;opacity:.7;padding:9px 6px!important}
  .ins-sheet{position:fixed;inset:0;z-index:9995;background:rgba(15,23,42,.55);display:flex;align-items:flex-end;justify-content:center}
  .ins-card{background:#fff;color:#1F2A44;width:100%;max-width:520px;border-radius:22px 22px 0 0;padding:22px 20px calc(22px + env(safe-area-inset-bottom));animation:insUp .3s ease both}
  .ins-card h3{margin:0 0 6px;font-size:19px}.ins-card p{margin:6px 0;font-size:14px;line-height:1.6;color:#475569}
  .ins-card ol{margin:10px 0 0 20px;padding:0;font-size:15px;line-height:1.9}.ins-card .ic{display:inline-block;padding:0 6px;border:1px solid #CBD5E1;border-radius:6px;font-size:13px}
  .ins-card .row{display:flex;gap:8px;margin-top:16px}.ins-card .row button,.ins-card .row a{flex:1;text-align:center;font:inherit;font-weight:700;border-radius:12px;padding:12px;border:0;cursor:pointer;text-decoration:none}
  .ins-p{background:#4A7DF0;color:#fff}.ins-s{background:#EEF2F7;color:#1F2A44}
  .ins-arrow{position:fixed;left:50%;bottom:calc(8px + env(safe-area-inset-bottom));transform:translateX(-50%);z-index:9996;font-size:30px;animation:insBob 1s ease-in-out infinite;color:#fff;text-shadow:0 2px 6px rgba(0,0,0,.4)}
  @keyframes insUp{from{transform:translateY(30px);opacity:0}to{transform:none;opacity:1}}
  @keyframes insBob{50%{transform:translate(-50%,8px)}}
  @media (min-width:900px){.ins-bar{bottom:20px;left:auto;right:20px;width:420px}}`;
  function addCSS() { if (document.getElementById('insCSS')) return; const s = document.createElement('style'); s.id = 'insCSS'; s.textContent = css; document.head.appendChild(s); }
  function sheet(html) { addCSS(); close(); const d = document.createElement('div'); d.className = 'ins-sheet'; d.id = 'insSheet'; d.innerHTML = `<div class="ins-card">${html}</div>`; d.addEventListener('click', e => { if (e.target === d || e.target.closest('[data-ins="close"]')) close(); }); document.body.appendChild(d); return d; }
  function close() { ['insSheet', 'insArrow'].forEach(id => { const n = document.getElementById(id); if (n) n.remove(); }); }

  // iOS 앱 안 브라우저(네이버·인스타 등): 사파리로 여는 방법 안내
  function iosInAppGuide() {
    const d = sheet(`<h3>사파리에서 열어 주세요</h3><p>지금은 앱 안의 브라우저라 쌤픽을 앱으로 설치할 수 없어요.</p>
      <ol><li>오른쪽 아래(또는 위) <span class="ic">⋯</span> 또는 <span class="ic">↗</span> 버튼</li><li><b>Safari로 열기</b> 또는 <b>기본 브라우저로 열기</b></li></ol>
      <div class="row"><button class="ins-p" data-ins="copy">주소 복사</button><button class="ins-s" data-ins="close">그냥 볼게요</button></div>`);
    d.querySelector('[data-ins="copy"]').addEventListener('click', () => { (navigator.clipboard ? navigator.clipboard.writeText(url) : Promise.reject()).then(() => { d.querySelector('[data-ins="copy"]').textContent = '복사했어요. 사파리에 붙여 넣기'; }).catch(() => prompt('이 주소를 복사해 사파리에 붙여 넣어 주세요', url)); });
  }

  /* ---------- 2. 설치 ---------- */
  let deferred = null;
  const snoozed = () => { const t = +get('ins_snooze') || 0; return Date.now() - t < 3 * 864e5; };
  function bar(title, sub, btn, onGo) {
    addCSS(); const old = document.getElementById('insBar'); if (old) old.remove();
    const b = document.createElement('div'); b.className = 'ins-bar'; b.id = 'insBar';
    b.innerHTML = `<img src="icons/icon-192.png" alt=""><div class="t"><b>${title}</b>${sub}</div><button class="ins-go">${btn}</button><button class="ins-x" aria-label="닫기">✕</button>`;
    b.querySelector('.ins-go').addEventListener('click', onGo);
    b.querySelector('.ins-x').addEventListener('click', () => { set('ins_snooze', Date.now()); b.remove(); });
    document.body.appendChild(b);
  }
  function promptInstall() {
    if (!deferred) return false;
    const p = deferred; deferred = null;
    p.prompt();
    (p.userChoice || Promise.resolve({})).then(r => { if (r.outcome === 'accepted') { set('ins_done', '1'); const b = document.getElementById('insBar'); if (b) b.remove(); } else set('ins_snooze', Date.now()); });
    return true;
  }
  function iosSafariGuide() {
    sheet(`<h3>쌤픽을 앱으로 설치하기</h3><p>홈 화면에 추가하면 주소창 없이 앱처럼 열려요.</p>
      <ol><li>아래쪽 <span class="ic">공유 ⬆︎</span> 버튼</li><li><b>홈 화면에 추가</b></li><li>오른쪽 위 <b>추가</b></li></ol>
      <div class="row"><button class="ins-p" data-ins="close">알겠어요</button></div>`);
    const a = document.createElement('div'); a.className = 'ins-arrow'; a.id = 'insArrow'; a.textContent = '⬇'; document.body.appendChild(a);
  }
  // 설정·안내 화면에서 부를 수 있게
  function show() {
    if (standalone) return alert('이미 앱으로 실행 중이에요.');
    if (promptInstall()) return;
    if (isIOS) return iosInAppOrSafari();
    sheet(`<h3>쌤픽을 앱으로 설치하기</h3><p>크롬 오른쪽 위 <span class="ic">⋮</span> 메뉴에서 <b>앱 설치</b> 또는 <b>홈 화면에 추가</b>를 눌러 주세요.</p><div class="row"><button class="ins-p" data-ins="close">알겠어요</button></div>`);
  }
  function iosInAppOrSafari() { inApp ? iosInAppGuide() : iosSafariGuide(); }

  window.addEventListener('beforeinstallprompt', e => {
    e.preventDefault(); deferred = e;
    if (standalone || snoozed()) return;
    const ready = () => bar('쌤픽 앱 설치', '<span>주소창 없이 앱처럼 · 홈 화면에서 바로</span>', '설치', () => promptInstall());
    document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', ready) : ready();
    // 첫 터치 때 설치 창을 자동으로 띄움(브라우저 정책상 사용자 동작이 있어야 함). 한 번만.
    if (!sessionStorage.getItem('ins_auto')) {
      const once = (ev) => {
        if (ev.target.closest && ev.target.closest('.ins-bar, input, select, textarea')) return;
        window.removeEventListener('pointerup', once, true);
        try { sessionStorage.setItem('ins_auto', '1'); } catch (x) { }
        setTimeout(promptInstall, 0);
      };
      window.addEventListener('pointerup', once, true);
    }
  });
  window.addEventListener('appinstalled', () => { set('ins_done', '1'); deferred = null; const b = document.getElementById('insBar'); if (b) b.remove(); });

  function boot() {
    if (standalone) { document.documentElement.classList.add('is-app'); return; }
    if (escapeInApp()) return;
    if (isIOS && !get('ins_done') && !snoozed()) {
      setTimeout(() => bar(inApp ? '사파리에서 열어 주세요' : '쌤픽 앱 설치', inApp ? '<span>앱으로 설치하려면 사파리가 필요해요</span>' : '<span>공유 → 홈 화면에 추가</span>', inApp ? '방법' : '설치 방법', iosInAppOrSafari), 1500);
    } else if (isAndroid && inApp) {
      // intent 전환이 막힌 앱: 안내 막대
      setTimeout(() => bar('크롬에서 열기', '<span>앱으로 설치하려면 크롬이 필요해요</span>', '열기', () => go('intent://' + chromeTarget() + '#Intent;scheme=https;package=com.android.chrome;end')), 1500);
    }
  }
  document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', boot) : boot();
  // 설정 화면에 '앱으로 설치' 카드
  function settingsCard() {
    if (standalone || !/^#settings/.test(location.hash)) return;
    setTimeout(() => {
      const head = document.querySelector('#app .page-head'); if (!head || document.getElementById('insCard')) return;
      const c = document.createElement('div'); c.className = 'card'; c.id = 'insCard'; c.style.marginBottom = '12px';
      c.innerHTML = '<div class="card-head"><h2>📲 쌤픽을 앱으로 설치</h2></div><p class="small">홈 화면에 추가하면 주소창 없이 앱처럼 바로 열려요. 설치해도 저장 공간을 거의 쓰지 않아요.</p><button class="btn btn-primary btn-sm" style="margin-top:8px">앱으로 설치하기</button>';
      c.querySelector('button').addEventListener('click', show);
      head.insertAdjacentElement('afterend', c);
    }, 60);
  }
  window.addEventListener('hashchange', settingsCard); document.addEventListener('DOMContentLoaded', settingsCard); settingsCard();
  window.SsaemInstall = { show, standalone, inApp };
})();
