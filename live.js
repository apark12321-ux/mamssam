/* 쌤픽 초등 — 엄마 폰 + 아이 폰 '함께 보기'
   같은 수업 화면을 두 기기에서 동시에 보되, 엄마에게는 진행판(대본·아이 반응·버튼),
   아이에게는 큰 개념 카드(강조·질문·손들기·스티커)가 보인다.
   · 연결: 엄마 폰의 숫자 6자리 코드를 아이 폰에 입력하거나, 링크(#live/코드)를 열면 끝
   · 전달: 메시지를 코드에서 만든 키로 암호화(AES-GCM)해 공개 중계(ntfy.sh)와 같은 기기 탭 사이(BroadcastChannel)로 보낸다
   · 이름 등 개인정보는 보내지 않는다. 연결은 앱을 닫으면 끝난다 */
(function () {
  'use strict';
  const MS = () => window.MS;
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const RELAY = window.SSP_RELAY || 'https://ntfy.sh/'; // 시험용으로 바꿀 수 있음
  const me = Math.random().toString(36).slice(2, 10);
  const enc = new TextEncoder(), dec = new TextDecoder();
  const b64 = (u8) => btoa(String.fromCharCode(...u8)), unb64 = (s) => Uint8Array.from(atob(s), c => c.charCodeAt(0));
  const hex = (buf) => [...new Uint8Array(buf)].map(x => x.toString(16).padStart(2, '0')).join('');
  const fmt = (c) => c.slice(0, 3) + ' ' + c.slice(3); // 아이가 치기 쉽게 숫자 6자리
  const clean = (c) => String(c || '').replace(/\D/g, '').slice(0, 6);

  /* ---------- 전달 통로 ---------- */
  function Bus(code, onMsg) {
    let key = null, topic = '', bc = null, es = null; const seen = new Set(); let closed = false;
    const ready = (async () => {
      topic = 'ssaempick-' + hex(await crypto.subtle.digest('SHA-256', enc.encode('topic:' + code))).slice(0, 24);
      key = await crypto.subtle.importKey('raw', await crypto.subtle.digest('SHA-256', enc.encode('key:' + code)), 'AES-GCM', false, ['encrypt', 'decrypt']);
      try { bc = new BroadcastChannel(topic); bc.onmessage = (e) => recv(e.data); } catch (e) { }
      try { es = new EventSource(RELAY + topic + '/sse'); es.onmessage = (e) => { try { const j = JSON.parse(e.data); if (j.event === 'message' && j.message) recv(j.message); } catch (x) { } }; } catch (e) { }
    })();
    const parts = {};
    async function recv(cipher) {
      if (closed) return;
      if (/^P\|/.test(cipher)) { // 나눠 온 조각: P|묶음id|번호|전체|내용
        const [, gid, i, n, body] = cipher.split('|'); const g = parts[gid] = parts[gid] || []; g[+i] = body;
        if (g.filter(x => x != null).length < +n) return; delete parts[gid]; cipher = g.join('');
      }
      try { const raw = unb64(cipher); const pt = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: raw.slice(0, 12) }, key, raw.slice(12)); const m = JSON.parse(dec.decode(pt)); if (m.from === me || seen.has(m.id)) return; seen.add(m.id); onMsg(m); } catch (e) { /* 다른 코드의 메시지 등은 무시 */ }
    }
    async function send(m) {
      await ready; if (closed) return; m.from = me; m.id = me + Date.now().toString(36) + Math.random().toString(36).slice(2, 5);
      const iv = crypto.getRandomValues(new Uint8Array(12)); const ct = new Uint8Array(await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, enc.encode(JSON.stringify(m))));
      const all = new Uint8Array(12 + ct.length); all.set(iv); all.set(ct, 12); const c = b64(all);
      try { bc && bc.postMessage(c); } catch (e) { }
      const MAX = 3000, out = [];
      if (c.length <= MAX) out.push(c); else { const gid = m.id, n = Math.ceil(c.length / MAX); for (let k = 0; k < n; k++) out.push(`P|${gid}|${k}|${n}|${c.slice(k * MAX, (k + 1) * MAX)}`); }
      for (const x of out) await fetch(RELAY + topic, { method: 'POST', body: x }).catch(() => { });
    }
    return { send, ready, close() { closed = true; try { bc && bc.close(); } catch (e) { } try { es && es.close(); } catch (e) { } } };
  }

  /* ---------- 엄마 폰: 진행판 ---------- */
  let H = null; // { code, bus, st:{card,hi,mode,sticker,q}, kidOn, log:[] }
  function host(uid, l) {
    if (!window.InfoCard) return;
    const d = InfoCard.data(uid, l); if (!d) return MS().toast('이 단원은 함께 보기를 만들 수 없어요');
    if (H) H.bus.close();
    const code = String(crypto.getRandomValues(new Uint32Array(1))[0] % 1000000).padStart(6, '0');
    const card = Object.assign({}, d); delete card.u; delete card.script; card.concept = ((d.concept || '').match(/\d+\s*\/\s*\d+/g) || []).slice(0, 2).join(' '); // 분수 그림에 필요한 것만
    H = { code, script: d.script, st: { card, hi: -1, mode: 'card', sticker: '', seq: 0 }, kidOn: false, log: [] };
    H.bus = Bus(code, (m) => {
      if (m.t === 'hello') { H.kidOn = true; push(); drawHost(); }
      else if (m.t === 'react') { H.log.unshift({ r: m.r, at: Date.now() }); H.kidOn = true; drawHost(); try { navigator.vibrate && navigator.vibrate(60); } catch (e) { } }
      else if (m.t === 'bye') { H.kidOn = false; drawHost(); }
    });
    drawHost();
  }
  const push = () => { if (!H) return; H.st.seq++; H.bus.send({ t: 'state', s: H.st }); };
  const REACT = { ok: ['👍', '알겠어요'], again: ['🤔', '다시 설명해 주세요'], hand: ['✋', '손들었어요'], seen: ['❤️', '스티커 고마워요'] };
  function drawHost() {
    let o = document.getElementById('lvHost');
    if (!o) { o = document.createElement('div'); o.id = 'lvHost'; o.className = 'lv-over'; o.setAttribute('data-keep-emoji', ''); document.body.appendChild(o); document.body.style.overflow = 'hidden'; o.addEventListener('click', hostClick); }
    const s = H.st, link = location.origin + location.pathname + '#live/' + H.code;
    o.innerHTML = `<div class="lv-top"><b>아이 폰과 함께 보기</b><span class="lv-dot ${H.kidOn ? 'on' : ''}">${H.kidOn ? '아이 폰 연결됨' : '연결 기다리는 중'}</span><button class="btn btn-sm" data-lv="end">끝내기</button></div>
      <div class="lv-scroll">
        ${H.kidOn ? '' : `<div class="lv-pair"><div class="lv-pair-t">아이 폰에 이 코드를 써 주세요</div><div class="lv-code">${fmt(H.code)}</div><div class="lv-pair-s">아이 폰: 쌤픽 → <b>초등</b> → <b>코드 넣기</b></div><div class="row" style="gap:8px;justify-content:center;flex-wrap:wrap;margin-top:12px"><button class="btn btn-primary" data-lv="share" data-link="${esc(link)}">카톡으로 보내기</button><button class="btn" data-lv="copy" data-link="${esc(link)}">링크 복사</button></div><p class="xs muted mt8">링크를 보내면 아이 폰에서 누르기만 하면 돼요</p></div>`}
        ${H.log.length ? `<div class="lv-log">${H.log.slice(0, 3).map((x, i) => `<div class="lv-rx ${i ? '' : 'new'}"><span>${REACT[x.r][0]}</span><b>${REACT[x.r][1]}</b><small>${new Date(x.at).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}</small></div>`).join('')}</div>` : ''}
        <div class="lv-ctl"><div class="lv-lbl">아이 화면 조종하기</div>
          <div class="lv-btns">${s.card.pts.map((p, i) => `<button class="lv-b ${s.mode === 'card' && s.hi === i ? 'on' : ''}" data-lv="hi" data-i="${i}">핵심 ${i + 1} 짚기</button>`).join('')}<button class="lv-b ${s.mode === 'card' && s.hi === -1 ? 'on' : ''}" data-lv="all">전체 보기</button>${s.card.q ? `<button class="lv-b ${s.mode === 'q' ? 'on' : ''}" data-lv="q">확인 질문 내기</button>` : ''}</div>
          <div class="lv-stk">${[['👍', '잘했어'], ['⭐', '최고야'], ['❤️', '사랑해']].map(([e, t]) => `<button data-lv="stk" data-t="${e} ${t}"><span>${e}</span>${t}</button>`).join('')}</div></div>
        ${H.script ? `<div class="lv-script"><div class="lv-lbl">엄마 설명 대본 · 아이 화면에는 안 보여요</div><p>${esc(H.script)}</p></div>` : ''}
        <div class="lv-lbl">아이 화면 미리보기</div><div class="lv-prev">${kidView(s, true)}</div>
      </div>`;
  }
  function hostClick(e) {
    const b = e.target.closest('[data-lv]'); if (!b) return; const a = b.dataset.lv, s = H.st;
    if (a === 'end') { H.bus.send({ t: 'end' }); setTimeout(() => { H && H.bus.close(); H = null; }, 300); const o = document.getElementById('lvHost'); o && o.remove(); document.body.style.overflow = ''; return; }
    if (a === 'share') { if (navigator.share) navigator.share({ title: '쌤픽 함께 보기', text: '엄마랑 같이 공부해요', url: b.dataset.link }).catch(() => { }); else copy(b.dataset.link); return; }
    if (a === 'copy') return copy(b.dataset.link);
    if (a === 'hi') { s.mode = 'card'; s.hi = +b.dataset.i; }
    if (a === 'all') { s.mode = 'card'; s.hi = -1; }
    if (a === 'q') { s.mode = 'q'; }
    if (a === 'stk') { sticker(b.dataset.t); return; }
    push(); drawHost();
  }
  function sticker(t) { if (!H) return; H.st.mode = 'sticker'; H.st.sticker = t; push(); drawHost(); }
  function copy(t) { (navigator.clipboard ? navigator.clipboard.writeText(t) : Promise.reject()).then(() => MS().toast('링크를 복사했어요')).catch(() => prompt('이 링크를 아이 폰에 보내 주세요', t)); }

  /* ---------- 아이 폰 ---------- */
  let K = null; // { code, bus, st }
  function kidView(s, mini) {
    if (!s) return `<div class="lv-wait"><div class="lv-spin"></div><b>엄마 폰과 연결하는 중…</b><small>엄마 폰에 '아이 폰과 함께 보기'가 켜져 있어야 해요</small></div>`;
    // 받은 값 검증: 색상은 #hex만, 핵심은 최대 3개 문자열, 강조 번호는 정수
    const c0 = s.card || {}; const card = Object.assign({}, c0, { sc: /^#[0-9a-f]{3,8}$/i.test(c0.sc) ? c0.sc : '#2BB0DC', pts: (Array.isArray(c0.pts) ? c0.pts : []).slice(0, 3).map(String) });
    const hv = parseInt(s.hi, 10);
    s = Object.assign({}, s, { hi: Number.isFinite(hv) ? Math.max(-1, Math.min(2, hv)) : -1, sticker: String(s.sticker || ''), mode: ['card', 'q', 'sticker'].includes(s.mode) ? s.mode : 'card', card });
    const cardHTML = window.InfoCard ? InfoCard.card(card, true) : '';
    let extra = '';
    if (s.mode === 'q') extra = `<div class="lv-q"><div class="lv-q-l">엄마의 질문</div><b>${esc(s.card.q)}</b><div class="lv-q-b"><button data-lk="ok">👍 알겠어요</button><button data-lk="again">🤔 다시 설명해 주세요</button></div></div>`;
    if (s.mode === 'sticker') extra = `<div class="lv-sticker"><span>${esc(s.sticker.split(' ')[0])}</span><b>${esc(s.sticker.split(' ').slice(1).join(' '))}</b><small>엄마가 보낸 스티커</small>${mini ? '' : '<button data-lk="seen">고마워요</button>'}</div>`;
    return `<div class="lv-kid ${mini ? 'mini' : ''} ${s.hi >= 0 && s.mode === 'card' ? 'hi hi' + s.hi : ''}">${cardHTML}${extra}${mini || s.mode !== 'card' ? '' : '<button class="lv-hand" data-lk="hand">✋ 손들기</button>'}</div>`;
  }
  function join(code) {
    code = clean(code); if (code.length !== 6) return MS().toast('숫자 6자리를 확인해 주세요');
    if (K) K.bus.close();
    K = { code, st: null };
    K.bus = Bus(code, (m) => { if (m.t === 'state') { if (!K.st || m.s.seq >= K.st.seq) { K.st = m.s; drawKid(); } } else if (m.t === 'end') { drawKid(true); } });
    drawKid(); K.bus.ready.then(() => K.bus.send({ t: 'hello' }));
    // 엄마 폰이 늦게 켜져도 붙도록 연결 전까지 몇 번 인사
    let n = 0; const iv = setInterval(() => { if (!K || K.st || ++n > 40) return clearInterval(iv); K.bus.send({ t: 'hello' }); if (n === 4 && !K.st) { K.slow = true; drawKid(); } }, 3000);
  }
  function drawKid(ended) {
    if (!ended && K && !K.st && K.slow) { // 12초 넘게 연결이 안 되면 코드를 다시 확인하게
      const o0 = document.getElementById('lvKid');
      if (o0) { o0.innerHTML = `<button class="lv-x" data-lk="close" aria-label="나가기">✕</button><div class="lv-wait"><div class="lv-spin"></div><b>엄마 폰을 찾고 있어요</b><small>넣은 코드: <b>${fmt(K.code)}</b><br>엄마 폰의 코드와 같은지 봐 주세요.<br>엄마 폰에 코드 화면이 켜져 있어야 해요.</small><button class="btn btn-primary mt12" data-lk="re">코드 다시 넣기</button></div>`; return; }
    }
    let o = document.getElementById('lvKid');
    if (!o) { o = document.createElement('div'); o.id = 'lvKid'; o.className = 'lv-over lv-kidover'; o.setAttribute('data-keep-emoji', ''); document.body.appendChild(o); document.body.style.overflow = 'hidden'; o.addEventListener('click', kidClick); }
    o.innerHTML = ended ? `<div class="lv-wait"><b>오늘 함께 보기가 끝났어요</b><small>수고했어요!</small><button class="btn btn-primary mt12" data-lk="close">닫기</button></div>`
      : `<button class="lv-x" data-lk="close" aria-label="나가기">✕</button>${kidView(K.st, false)}`;
  }
  function kidClick(e) {
    const b = e.target.closest('[data-lk]'); if (!b) return; const a = b.dataset.lk;
    if (a === 're') { K && K.bus.close(); K = null; const o = document.getElementById('lvKid'); o && o.remove(); document.body.style.overflow = ''; return joinPrompt(); }
    if (a === 'close') { if (!K || confirm('함께 보기를 나갈까요?')) { K && K.bus.send({ t: 'bye' }); K && K.bus.close(); K = null; const o = document.getElementById('lvKid'); o && o.remove(); document.body.style.overflow = ''; if (/^#live\//.test(location.hash)) location.hash = ''; } return; }
    if (['ok', 'again', 'hand', 'seen'].includes(a)) {
      K.bus.send({ t: 'react', r: a }); b.classList.add('sent');
      MS().toast(a === 'hand' ? '엄마에게 손들었어요' : a === 'seen' ? '엄마에게 고맙다고 했어요' : '엄마에게 보냈어요');
      if (a !== 'hand' && K.st) { K.st = Object.assign({}, K.st, { mode: 'card' }); drawKid(); } // 대답하면 카드 화면으로 돌아감
    }
  }
  function joinPrompt() {
    const o = document.createElement('div'); o.className = 'sw-over'; o.setAttribute('data-keep-emoji', '');
    o.innerHTML = `<div class="sw-box"><div class="lvg-ic">📱</div><h2>엄마 폰에 나온<br>코드를 써 주세요</h2>
      <input class="input lv-in" maxlength="7" placeholder="123 456" inputmode="numeric" pattern="[0-9 ]*" autocomplete="off"><button class="sw-go">연결하기</button>
      <button class="sw-back" data-g="1">코드가 어디 있어요?</button><button class="sw-back">취소</button></div>`;
    document.body.appendChild(o); const i = o.querySelector('input'); setTimeout(() => i.focus(), 50);
    i.addEventListener('input', () => { const c = clean(i.value); i.value = c.length > 3 ? fmt(c) : c; });
    o.querySelector('.sw-go').addEventListener('click', () => { const c = clean(i.value); if (c.length !== 6) return MS().toast('숫자 6자리를 확인해 주세요'); o.remove(); join(c); });
    o.querySelectorAll('.sw-back').forEach(b => b.addEventListener('click', () => { o.remove(); if (b.dataset.g) guide('kid'); }));
  }

  /* ---------- 처음 쓰는 사람을 위한 설명 ---------- */
  // who: 'mom'(엄마 폰에서 처음 누를 때 → 다 읽으면 시작) / 'kid'(아이 폰 쪽) / ''(첫 화면에서 그냥 설명 보기)
  const PH = (label, inner) => `<div class="eg-ph"><div class="eg-who">${label}</div><div class="eg-scr">${inner}</div></div>`;
  const STEPS = [
    { t: '폰 두 대로 같이 공부해요', d: '엄마가 설명하면, 아이 폰에 그림이 크게 나와요', art: `<div class="eg-two">${PH('엄마', '<i class="eg-bar"></i><i class="eg-bar s"></i><i class="eg-btn">누르기</i>')}<span class="eg-arr">→</span>${PH('아이', '<i class="eg-big">½</i>')}</div>` },
    { t: '엄마 폰에서 이 버튼을 눌러요', d: '초등 홈 맨 위에 있어요', art: PH('엄마', '<i class="eg-bar"></i><i class="eg-btn hot">📱 아이 폰과 함께 보기</i><i class="eg-bar s"></i>') },
    { t: '코드가 나와요', d: '숫자 6개예요', art: PH('엄마', '<i class="eg-code">382 615</i>') },
    { t: '아이 폰에 그 코드를 써요', d: '아이 폰: 쌤픽 → 초등 → 코드 넣기', art: PH('아이', '<i class="eg-in">382 615</i><i class="eg-btn hot">연결하기</i>') },
    { t: '끝! 이제 같이 봐요', d: '엄마가 누르는 대로 아이 폰이 바뀌어요', art: `<div class="eg-two">${PH('엄마', '<i class="eg-btn hot">1번 짚기</i>')}<span class="eg-arr">→</span>${PH('아이', '<i class="eg-big">½</i><i class="eg-hl"></i>')}</div>` }
  ];
  // who: 'mom'(엄마 폰에서 처음 누를 때) / 'kid'(아이 폰) / ''(그냥 보기)
  function guide(who, onStart) {
    const o = document.createElement('div'); o.className = 'sw-over lvg'; o.setAttribute('data-keep-emoji', '');
    let i = who === 'kid' ? 3 : 0;
    const last = who === 'mom' ? '<button class="sw-go" data-g="start">코드 만들기</button>' : who === 'kid' ? '<button class="sw-go" data-g="join">코드 넣기</button>' : '<button class="sw-go" data-g="close">알겠어요</button>';
    const draw = () => {
      const S = STEPS[i], end = i === STEPS.length - 1;
      o.innerHTML = `<div class="sw-box eg-box"><div class="eg-art">${S.art}</div><div class="eg-n">${i + 1} / ${STEPS.length}</div><h2>${S.t}</h2><p>${S.d}</p>
        <div class="eg-dots">${STEPS.map((_, k) => `<i class="${k === i ? 'on' : ''}"></i>`).join('')}</div>
        ${end ? last : '<button class="sw-go" data-g="next">다음</button>'}
        <div class="eg-nav">${i ? '<button class="sw-back" data-g="prev">← 이전</button>' : ''}<button class="sw-back" data-g="close">닫기</button></div></div>`;
    };
    draw(); document.body.appendChild(o);
    o.addEventListener('click', (e) => {
      const b = e.target.closest('[data-g]'); if (!b) return; const g = b.dataset.g;
      if (g === 'next') { i++; return draw(); } if (g === 'prev') { i--; return draw(); }
      o.remove(); if (g === 'start' && onStart) onStart(); if (g === 'join') joinPrompt();
    });
  }
  // 엄마 폰: 처음 한 번은 설명부터
  function start(uid, l) {
    const st = MS().st();
    if (st.lvGuide) return host(uid, l);
    guide('mom', () => { st.lvGuide = 1; MS().save(); host(uid, l); });
  }

  /* ---------- 진입점 ---------- */
  function fromURL() { const m = (location.hash || '').match(/^#live\/(\d{3}(?:%20|\s|-)?\d{3})/); if (m) join(m[1]); }
  // 아이 폰 연결은 초등을 고른 뒤(초등 가입 화면)에만 보여 준다
  function addJoinLink() {
    if (!window.MS || MS().st()._lv !== 'e') return;
    const f = document.querySelector('#app #obForm'); if (!f || f.querySelector('.lv-join')) return;
    const a = document.createElement('div'); a.className = 'lv-join lv-join-sm'; a.setAttribute('data-keep-emoji', '');
    a.innerHTML = `<div class="lv-join-t"><b>📱 아이 폰이에요?</b><span>엄마 폰에 나온 코드만 쓰면 돼요</span></div>
      <div class="lv-join-b"><button type="button" class="btn btn-primary btn-sm" data-j="join">코드 넣기</button><button type="button" class="btn btn-sm" data-j="how">어떻게 해요?</button></div>`;
    a.addEventListener('click', (e) => { const b = e.target.closest('[data-j]'); if (!b) return; b.dataset.j === 'join' ? joinPrompt() : guide(''); });
    const h = f.querySelector('h2'); (h ? h : f.firstElementChild).insertAdjacentElement('beforebegin', a);
  }
  let pend = false; const mo = new MutationObserver(() => { if (pend) return; pend = true; requestAnimationFrame(() => { pend = false; addJoinLink(); }); });
  function boot() { const r = document.getElementById('app'); if (r) mo.observe(r, { childList: true, subtree: true }); addJoinLink(); fromURL(); }
  window.addEventListener('hashchange', fromURL);
  document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', boot) : boot();

  window.LiveApp = { host, start, join, sticker, joinPrompt, guide };
})();
