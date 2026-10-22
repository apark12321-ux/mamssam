/* 쌤픽 초등 — 엄마가 개념을 설명할 때 보여 주는 '한 장 개념 카드'(인포그래픽)
   단원 자료(개념·생활 예시·헷갈리는 점·확인 질문·다음 연결)로 자동으로 만들고,
   엄마가 문구를 직접 고칠 수 있으며, '아이에게 크게 보여주기'로 전체 화면에 띄운다.
   수학 분수 단원은 분수 막대 그림을 함께 그린다. */
(function () {
  'use strict';
  const MS = () => window.MS;
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const SUBJ = { kor: ['국어', '#E5484D'], math: ['수학', '#2BB0DC'], soc: ['사회', '#D97706'], sci: ['과학', '#16A34A'], eng: ['영어', '#7C3AED'], mor: ['도덕', '#0D9488'], mus: ['음악', '#DB2777'], art: ['미술', '#EA580C'], pe: ['체육', '#2563EB'], prac: ['실과', '#65A30D'] };
  const sentences = (t) => String(t || '').split(/(?<=[.!?다요])\s+/).map(s => s.trim()).filter(s => s.length > 3);
  function edits(uid) { const st = MS().st(); st.info = st.info || {}; return st.info[uid] = st.info[uid] || {}; }

  function data(uid, l) {
    const u = MS().U[uid]; if (!u) return null; const e = edits(uid);
    const subj = u.subj || 'math'; const [sn, sc] = SUBJ[subj] || ['수학', '#2BB0DC'];
    const pts = (e.pts && e.pts.length ? e.pts : sentences(u.concept)).slice(0, 3);
    const mis = String((u.mistakes || [])[0] || ''); const [wrong, right] = mis.split(/\s*(?:—|→|-{2})\s*/);
    return { u, concept: u.concept || '', l: +l || 0, sn, sc, title: e.title || (u.lessons || [])[+l || 0] || u.title, unit: u.title, pts, ex: e.ex || u.warmup || '', wrong: e.wrong || wrong || '', right: e.right || right || '', q: e.q || String(u.check || '').replace(/^"|"$/g, ''), next: u.next || '', script: (u.script || [])[Math.min(+l || 0, (u.script || []).length - 1)] || '', grade: `${u.grade}학년 ${u.sem}학기` };
  }

  // 분수 막대: 문장 속 첫 두 분수를 그림으로
  function fractionSVG(d) {
    const txt = [d.title, d.script, d.ex, d.q, d.concept].join(' ');
    const fr = [...txt.matchAll(/(\d+)\s*\/\s*(\d+)/g)].map(m => [+m[1], +m[2]]).filter(([a, b]) => b > 0 && b <= 12 && a <= b).slice(0, 2);
    if (!fr.length) return '';
    const bar = ([a, b], y, c) => `${Array.from({ length: b }, (_, i) => `<rect x="${10 + i * (300 / b)}" y="${y}" width="${300 / b - 3}" height="34" rx="5" fill="${i < a ? c : '#EEF3F6'}" stroke="${c}" stroke-width="1.5"/>`).join('')}<text x="320" y="${y + 23}" font-size="18" font-weight="800" fill="#2A2E33">${a}/${b}</text>`;
    return `<div class="ic-vis"><svg viewBox="0 0 380 ${fr.length * 52 + 8}" role="img" aria-label="분수 막대">${fr.map((f, i) => bar(f, 8 + i * 52, i ? '#F59E0B' : d.sc)).join('')}</svg><small>전체를 똑같이 나눈 칸 중 색칠한 만큼이 분수예요</small></div>`;
  }

  function card(d, big) {
    const ed = (k, v, tag) => `<${tag || 'span'} class="ic-ed" data-k="${k}">${esc(v)}</${tag || 'span'}>`;
    return `<div class="ic ${big ? 'ic-big' : ''}" style="--ic:${d.sc}">
      <div class="ic-head"><span class="ic-tag">${esc(d.sn)} · ${esc(d.grade)}</span><h2 class="ic-title">${ed('title', d.title)}</h2><div class="ic-unit">${esc(d.unit)}</div></div>
      <div class="ic-body">
        <div class="ic-sec"><div class="ic-lbl">핵심 3가지</div><ol class="ic-pts">${d.pts.map((p, i) => `<li><span class="ic-n">${i + 1}</span>${ed('pt' + i, p)}</li>`).join('')}</ol></div>
        ${fractionSVG(d)}
        ${d.ex ? `<div class="ic-sec ic-ex"><div class="ic-lbl">생활 속에서 보면</div>${ed('ex', d.ex, 'p')}</div>` : ''}
        ${d.wrong ? `<div class="ic-sec ic-mis"><div class="ic-x"><b>✗ 헷갈려요</b>${ed('wrong', d.wrong, 'p')}</div><div class="ic-o"><b>✓ 이렇게 기억해요</b>${ed('right', d.right || '선생님 설명을 다시 떠올려 봐요', 'p')}</div></div>` : ''}
        ${d.q ? `<div class="ic-sec ic-q"><div class="ic-lbl">확인 질문</div>${ed('q', d.q, 'p')}</div>` : ''}
        ${!big && d.script ? `<div class="ic-sec ic-script"><div class="ic-lbl">엄마 설명 대본 (아이 화면에는 안 보여요)</div><p>${esc(d.script)}</p></div>` : ''}
        ${d.next ? `<div class="ic-next">다음에 이어져요 · ${esc(d.next)}</div>` : ''}
      </div></div>`;
  }

  let cur = null;
  function open(uid, l) {
    const d = data(uid, l); if (!d) return MS().toast('이 단원의 개념 카드를 만들 수 없어요');
    cur = { uid, l }; close();
    const o = document.createElement('div'); o.className = 'ic-wrap'; o.id = 'icWrap';
    o.innerHTML = `<div class="ic-bar"><button class="btn btn-sm" data-ic="close">✕ 닫기</button><span class="ic-bar-t">한 장 개념 카드</span><button class="btn btn-sm" data-ic="edit">문구 고치기</button><button class="btn btn-sm btn-primary" data-ic="big">아이에게 크게 보여주기</button></div><div class="ic-scroll">${card(d, false)}</div>`;
    document.body.appendChild(o); document.body.style.overflow = 'hidden';
    o.addEventListener('click', onClick);
  }
  function close() { const o = document.getElementById('icWrap'); if (o) o.remove(); document.body.style.overflow = ''; }
  function onClick(e) {
    const b = e.target.closest('[data-ic]'); if (!b) return; const o = document.getElementById('icWrap'); const act = b.dataset.ic;
    if (act === 'close') return close();
    if (act === 'big') { const d = data(cur.uid, cur.l); o.classList.add('ic-full'); o.querySelector('.ic-scroll').innerHTML = card(d, true); o.querySelector('.ic-bar').innerHTML = '<button class="btn btn-sm" data-ic="small">← 엄마 화면</button><span class="ic-bar-t"></span><button class="btn btn-sm" data-ic="close">✕</button>'; try { o.requestFullscreen && o.requestFullscreen(); } catch (x) { } return; }
    if (act === 'small') { try { document.fullscreenElement && document.exitFullscreen(); } catch (x) { } open(cur.uid, cur.l); return; }
    if (act === 'edit') {
      const on = !o.classList.contains('ic-editing'); o.classList.toggle('ic-editing', on);
      o.querySelectorAll('.ic-ed').forEach(x => x.contentEditable = on ? 'true' : 'false');
      b.textContent = on ? '저장' : '문구 고치기';
      if (!on) { const e2 = edits(cur.uid); const pts = []; o.querySelectorAll('.ic-ed').forEach(x => { const k = x.dataset.k, v = x.textContent.trim(); if (/^pt\d$/.test(k)) pts.push(v); else e2[k] = v; }); e2.pts = pts.filter(Boolean); MS().save(); MS().toast('개념 카드를 저장했어요'); }
      else { const f = o.querySelector('.ic-ed'); if (f) f.focus(); MS().toast('글자를 눌러 고친 뒤 저장을 눌러요'); }
    }
  }
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && document.getElementById('icWrap')) close(); });

  // 수업(#learn) 화면 위에 '개념 카드' 버튼
  function inject() {
    const m = (location.hash || '').match(/^#learn\/([^/?]+)\/(\d+)/); if (!m || /[?&]k=1/.test(location.hash)) return;
    const h = document.querySelector('#app .lp-card .lp-h'); if (!h || document.querySelector('.ic-open')) return;
    const b = document.createElement('button'); b.className = 'btn btn-sm btn-primary ic-open'; b.textContent = '한 장 개념 카드로 설명하기'; b.addEventListener('click', () => open(m[1], m[2]));
    h.insertAdjacentElement('afterend', b);
  }
  let pend = false; const mo = new MutationObserver(() => { if (pend) return; pend = true; requestAnimationFrame(() => { pend = false; inject(); }); });
  function boot() { const r = document.getElementById('app'); if (r) mo.observe(r, { childList: true, subtree: true }); inject(); }
  document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', boot) : boot();

  window.InfoCard = { open, close, data, card };
})();
