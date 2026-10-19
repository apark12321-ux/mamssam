/* 맘쌤 — 영어 듣기(TTS) · 따라 말하기(발음 분석) · 말로 설명하기(녹음·분석) */
(function () {
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  const hasTTS = 'speechSynthesis' in window;
  const EN = /[A-Za-z][A-Za-z'’,.!?\- ]*[A-Za-z.!?]/g;
  const esc = (s) => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const toast = (m) => { try { window.MS.toast(m); } catch (e) { } };

  /* ---------- 듣기 (TTS) ---------- */
  let voice = null;
  function pickVoice() { if (!hasTTS) return; const vs = speechSynthesis.getVoices(); voice = vs.find(v => /en-US/i.test(v.lang) && /Google|Samantha|Aria|Jenny|Natural/i.test(v.name)) || vs.find(v => /en-US/i.test(v.lang)) || vs.find(v => /^en/i.test(v.lang)) || null; }
  if (hasTTS) { pickVoice(); speechSynthesis.onvoiceschanged = pickVoice; }
  function say(text, rate, lang) {
    if (!hasTTS) { toast('이 브라우저는 읽어 주기를 지원하지 않아요'); return; }
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text); u.lang = lang || 'en-US'; if (!lang && voice) u.voice = voice; u.rate = rate || 0.9; u.pitch = 1.05;
    speechSynthesis.speak(u);
  }
  function englishOf(el) {
    const t = (el.innerText || el.textContent || '').replace(/\s+/g, ' ');
    return (t.match(EN) || []).map(s => s.trim().replace(/^(?:[AB]|Man|Woman|Boy|Girl)\s+(?=[A-Z])/, '')).filter(s => s.split(/\s+/).length >= 2 || /^[A-Za-z]{3,}[.!?]?$/.test(s));
  }

  /* ---------- 녹음 공통 ---------- */
  let rec = null;
  const INAPP = /KAKAOTALK|NAVER|Instagram|FBAN|FBAV|Line\/|DaumApps|everytimeApp/i.test(navigator.userAgent);
  const ERRMSG = {
    'not-allowed': '마이크 권한이 꺼져 있어요. 주소창의 🔒(또는 ⋮) → 사이트 설정에서 마이크를 허용해 주세요.',
    'service-not-allowed': '음성 인식이 꺼져 있어요. 아이폰은 설정 → 일반 → 키보드 → 받아쓰기를 켜 주세요.',
    'audio-capture': '마이크를 찾을 수 없어요. 다른 앱이 마이크를 쓰고 있지 않은지 확인해 주세요.',
    'network': '음성 인식은 인터넷 연결이 필요해요. 연결을 확인해 주세요.',
    'no-speech': '소리가 들리지 않았어요. 버튼을 누른 뒤 바로 또박또박 말해 보세요.',
    'aborted': '녹음이 중단됐어요. 다시 눌러 주세요.'
  };
  function unsupportedMsg() { return INAPP ? '카카오톡·네이버 등 앱 안 브라우저에서는 음성 인식이 안 돼요. 오른쪽 위 메뉴 → "다른 브라우저로 열기"(크롬·사파리)로 열어 주세요.' : '이 브라우저는 음성 인식을 지원하지 않아요. 크롬(안드로이드) 또는 사파리(아이폰)에서 열어 주세요.'; }
  /* 모바일 호환: 음성 인식과 녹음기를 동시에 쓰지 않고(마이크 충돌), continuous 대신 짧은 인식을 이어 붙임 */
  function startRec(lang, onText, onEnd, auto) {
    stopRec();
    const R = { chunks: [], text: '', interim: '', t0: Date.now(), url: null, err: null };
    rec = R;
    const done = () => { if (R.ended) return; R.ended = true; R.stopped = true; R.secs = Math.max(1, Math.round((Date.now() - R.t0) / 1000)); onEnd && onEnd(R); };
    if (SR && !INAPP) {
      const make = () => {
        const r = new SR(); r.lang = lang; r.continuous = false; r.interimResults = true; r.maxAlternatives = 1;
        r.onresult = (e) => { let inter = ''; for (let i = e.resultIndex; i < e.results.length; i++) { const x = e.results[i][0].transcript; if (e.results[i].isFinal) R.text = (R.text + ' ' + x).trim(); else inter += x; } R.interim = inter; onText && onText(R); };
        r.onerror = (e) => { if (e.error !== 'no-speech' || !R.text) R.err = e.error; };
        r.onend = () => {
          if (R.interim && !R.text.endsWith(R.interim)) { R.text = (R.text + ' ' + R.interim).trim(); R.interim = ''; }
          if (!R.stopped && !auto && !R.err) { try { R.sr = make(); R.sr.start(); return; } catch (e) { } }
          done();
        };
        return r;
      };
      R.sr = make();
      try { R.sr.start(); } catch (e) { R.err = 'aborted'; setTimeout(done, 50); }
      R.finish = () => { R.stopped = true; try { R.sr.stop(); } catch (e) { } setTimeout(done, 1800); };
      return R;
    }
    R.noSR = true;
    if (navigator.mediaDevices && window.MediaRecorder) {
      navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
        if (rec !== R || R.stopped) { stream.getTracks().forEach(t => t.stop()); return; }
        R.stream = stream; R.mr = new MediaRecorder(stream);
        R.mr.ondataavailable = e => R.chunks.push(e.data);
        R.mr.onstop = () => { R.url = URL.createObjectURL(new Blob(R.chunks, { type: R.mr.mimeType || 'audio/mp4' })); stream.getTracks().forEach(t => t.stop()); done(); };
        R.mr.start();
      }).catch(() => { R.err = 'not-allowed'; done(); });
    } else setTimeout(done, 50);
    R.finish = () => { R.stopped = true; if (R.mr && R.mr.state !== 'inactive') R.mr.stop(); else setTimeout(done, 100); };
    return R;
  }
  function stopRec() { if (rec && !rec.stopped && rec.finish) rec.finish(); }

  /* ---------- 발음 분석 (단어 일치도) ---------- */
  const words = (s) => String(s).toLowerCase().replace(/[’]/g, "'").replace(/[^a-z0-9' ]/g, ' ').split(/\s+/).filter(Boolean);
  function compare(target, said) {
    const a = words(target), b = words(said);
    const dp = Array.from({ length: a.length + 1 }, () => new Array(b.length + 1).fill(0));
    for (let i = a.length - 1; i >= 0; i--) for (let j = b.length - 1; j >= 0; j--) dp[i][j] = a[i] === b[j] ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1]);
    const hit = new Set(); let i = 0, j = 0; while (i < a.length && j < b.length) { if (a[i] === b[j]) { hit.add(i); i++; j++; } else if (dp[i + 1][j] >= dp[i][j + 1]) i++; else j++; }
    return { score: a.length ? Math.round(hit.size * 100 / a.length) : 0, html: a.map((w, k) => `<span class="${hit.has(k) ? 'w-ok' : 'w-miss'}">${esc(w)}</span>`).join(' ') };
  }

  /* ---------- 영어 도구 막대 ---------- */
  function bar(target) {
    return `<div class="say-bar" data-say-target="${esc(target)}">
      <button type="button" class="say-btn" data-say="play">🔊 듣기</button>
      <button type="button" class="say-btn" data-say="slow">🐢 천천히</button>
      <button type="button" class="say-btn" data-say="blind">👂 듣고 풀기</button>
      <button type="button" class="say-btn mic" data-say="repeat">🎤 따라 말하기</button>
      <div class="say-res"></div></div>`;
  }
  function isEnglishCtx(el) {
    const c = el.closest('.lp, .mth-card, .top-unit, .sp-page, .kid-card, .lp-card');
    const kicker = c ? (c.querySelector('.lp-tt, .lp-kicker, .tu-t, .xs') || {}).textContent || '' : '';
    return /영어|English/.test(kicker) || /영어/.test(document.title) || (location.hash.includes('/eng') || /#(learn|study\/u)\/eng/.test(location.hash));
  }
  function decorate() {
    document.querySelectorAll('.lp-q, .dq-q').forEach(q => {
      if (q.dataset.say) return; q.dataset.say = 1;
      if (!isEnglishCtx(q)) return;
      const box = q.parentElement; const opts = [...box.querySelectorAll('.lp-opt span:last-child')].map(s => s.textContent);
      const segs = englishOf(q).concat(opts.filter(o => /[A-Za-z]{2,}/.test(o) && !/[가-힣]/.test(o)).length ? [] : []);
      if (!segs.length) return;
      q.insertAdjacentHTML('afterend', bar(segs.join(' ')));
    });
    document.querySelectorAll('.lp-opt').forEach(o => {
      if (o.dataset.say) return; o.dataset.say = 1;
      const t = (o.querySelector('span:last-child') || {}).textContent || '';
      if (!/[A-Za-z]{2,}/.test(t) || /[가-힣]/.test(t) || !isEnglishCtx(o)) return;
      o.insertAdjacentHTML('beforeend', `<span class="opt-say" data-say-text="${esc(t)}" role="button" aria-label="보기 듣기">🔊</span>`);
    });
    // 국어·백지 인출·심화 서술형: 말로 설명하기
    document.querySelectorAll('textarea.dq-in, #blankIn').forEach(t => {
      if (t.dataset.say) return; t.dataset.say = 1;
      t.insertAdjacentHTML('afterend', `<div class="talk-bar"><button type="button" class="say-btn mic" data-say="talk">🎤 말로 설명하기</button><span class="xs muted">말하면 글로 받아 적고, 핵심어를 얼마나 말했는지 분석해요</span><div class="talk-res"></div></div>`);
    });
  }
  new MutationObserver(() => { clearTimeout(decorate.t); decorate.t = setTimeout(decorate, 60); }).observe(document.documentElement, { childList: true, subtree: true });

  /* ---------- 핵심어 (말로 설명하기 분석) ---------- */
  function keywordsFor(ta) {
    const box = ta.closest('.dq, .card');
    let src = [];
    if (box && box.querySelector('.dq-k')) src = [...box.querySelectorAll('.dq-k li')].map(li => li.textContent);
    else if (box && box.querySelector('.blank-pt')) src = [...box.querySelectorAll('.blank-pt span')].map(s => s.textContent);
    else if (ta.id === 'blankIn') { const sel = document.querySelector('[data-mt="blankU"]'); const u = sel && window.SubjApp && SubjApp._h.U(sel.value); if (u) src = (u.lessons || []).concat([u.title]); }
    const stop = /^(하기|알기|알아보기|이해|설명|있다|한다|것|수|등|및|때|위해|대한|에서|으로|하는|이다)$/;
    const kw = new Set(); src.join(' ').replace(/[^가-힣A-Za-z0-9 ]/g, ' ').split(/\s+/).forEach(w => { w = w.replace(/(을|를|이|가|은|는|의|에|와|과|로|으로|하기|하고|하여|해요|한다|하다|기|에서|까지)$/, ''); if (w.length >= 2 && !stop.test(w)) kw.add(w); });
    return [...kw].slice(0, 14);
  }

  /* ---------- 이벤트 ---------- */
  window.addEventListener('click', e => {
    const os = e.target.closest('.opt-say');
    if (os) { e.preventDefault(); e.stopImmediatePropagation(); say(os.dataset.sayText, 0.85); return; }
    const b = e.target.closest('[data-say]'); if (!b || b.tagName === 'DIV') return;
    const t = b.dataset.say;
    if (t === 'play' || t === 'slow' || t === 'blind' || t === 'repeat') {
      const barEl = b.closest('.say-bar'), target = barEl.dataset.sayTarget, res = barEl.querySelector('.say-res');
      if (t === 'play') say(target, 0.92);
      if (t === 'slow') say(target, 0.65);
      if (t === 'blind') { const q = barEl.previousElementSibling; const on = q.classList.toggle('say-blind'); b.classList.toggle('on', on); if (on) say(target, 0.9); b.textContent = on ? '👀 글자 보기' : '👂 듣고 풀기'; }
      if (t === 'repeat') {
        if (rec && !rec.stopped && b.classList.contains('rec')) { rec.finish(); return; }
        b.classList.add('rec'); b.textContent = '⏹ 말하기 끝'; res.innerHTML = `<div class="say-live">🎙️ 지금 말하세요! 말이 끝나면 자동으로 채점돼요<br><b>${esc(target)}</b></div>`;
        startRec('en-US', R => { const live = res.querySelector('.say-live'); if (live) live.textContent = '🎙️ ' + (R.text + ' ' + R.interim).trim(); }, R => {
          b.classList.remove('rec'); b.textContent = '🎤 다시 말하기';
          const said = (R.text || R.interim || '').trim();
          if (R.noSR) { res.innerHTML = `<div class="say-out"><div class="small">${unsupportedMsg()}${R.url ? '<br>녹음은 들어 볼 수 있어요. 원어민 소리(🔊)와 비교해 보세요.' : ''}</div>${R.url ? `<audio controls src="${R.url}"></audio>` : ''}</div>`; return; }
          if (!said) { res.innerHTML = `<div class="say-out"><div class="small">⚠️ ${ERRMSG[R.err] || ERRMSG['no-speech']}</div></div>`; return; }
          const c = compare(target, said);
          const msg = c.score >= 90 ? '완벽해요! 원어민처럼 말했어요 🎉' : c.score >= 70 ? '좋아요! 빨간 단어만 다시 연습해요 👍' : c.score >= 40 ? '절반 넘게 맞았어요. 🐢 천천히 듣고 따라 해 봐요' : '다시 들어 보고 천천히 따라 말해 봐요 💪';
          res.innerHTML = `<div class="say-out"><div class="say-score ${c.score >= 70 ? 'ok' : ''}"><b>${c.score}</b>점</div><div><div class="say-words">${c.html}</div><div class="xs muted mt8">내가 말한 것: ${esc(said || '(인식되지 않음)')}</div><div class="small mt8">${msg}</div>${R.url ? `<audio controls src="${R.url}"></audio>` : ''}</div></div>`;
          if (c.score >= 90 && window.FunApp) FunApp.confetti(null, innerHeight / 3, 50, 1);
        }, true);
      }
      return;
    }
    if (t === 'talk') {
      const tb = b.closest('.talk-bar'), ta = tb.previousElementSibling, res = tb.querySelector('.talk-res');
      if (rec && !rec.stopped && b.classList.contains('rec')) { rec.finish(); return; }
      const base = ta.value ? ta.value.trim() + ' ' : '';
      b.classList.add('rec'); b.textContent = '⏹ 설명 끝'; res.innerHTML = '<div class="say-live">🎙️ 친구에게 설명하듯 말해 보세요. 다 말하면 ⏹ 설명 끝을 눌러요</div>';
      startRec('ko-KR', R => { ta.value = base + (R.text + ' ' + R.interim).trim(); }, R => {
        b.classList.remove('rec'); b.textContent = '🎤 이어서 말하기';
        const said = (R.text || R.interim || '').trim(); ta.value = (base + said).trim();
        if (R.noSR) { res.innerHTML = `<div class="say-out talk"><div class="small">${unsupportedMsg()}</div>${R.url ? `<audio controls src="${R.url}"></audio>` : ''}</div>`; return; }
        if (!said) { res.innerHTML = `<div class="say-out talk"><div class="small">⚠️ ${ERRMSG[R.err] || ERRMSG['no-speech']}</div></div>`; return; }
        const chars = said.replace(/\s/g, '').length, spm = Math.round(chars * 60 / R.secs);
        const kw = keywordsFor(ta), all = ta.value.replace(/\s/g, '');
        const hit = kw.filter(k => all.includes(k)), miss = kw.filter(k => !all.includes(k));
        const cov = kw.length ? Math.round(hit.length * 100 / kw.length) : null;
        const ans = ta.closest('.dq') && ta.closest('.dq').querySelector('.dq-ans'); const hideMiss = !!(ans && ans.hidden);
        const pace = spm > 380 ? '조금 빨라요. 천천히 또박또박!' : spm < 120 ? '천천히 말했어요. 핵심부터 자신 있게 말해 봐요.' : '말 속도가 알맞아요.';
        res.innerHTML = `<div class="say-out talk"><div class="talk-kpi"><div><b>${R.secs}</b><span>초</span></div><div><b>${chars}</b><span>글자</span></div><div><b>${spm}</b><span>분당 음절</span></div>${cov != null ? `<div><b>${cov}%</b><span>핵심어</span></div>` : ''}</div>
          ${kw.length ? `<div class="small mt8">✅ 말한 핵심어: ${hideMiss ? hit.length + '개' : hit.map(esc).join(', ') || '없음'}</div>${hideMiss ? '<div class="xs muted">모범 답안을 열면 빠뜨린 핵심어도 알려 드려요.</div>' : `<div class="small">➕ 더 넣으면 좋은 말: ${miss.slice(0, 8).map(esc).join(', ') || '없음 — 완벽해요!'}</div>`}` : ''}
          <div class="xs muted mt8">${pace} ${chars < 30 ? '설명이 짧아요. "왜냐하면", "예를 들어"를 넣어 더 길게 말해 보세요.' : ''}</div>${R.url ? `<audio controls src="${R.url}"></audio>` : ''}</div>`;
      });
    }
  }, true);
  window.addEventListener('hashchange', () => { stopRec(); if (hasTTS) speechSynthesis.cancel(); });
  window.SpeakApp = { say, compare };
})();
