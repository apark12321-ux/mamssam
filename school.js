/* 올배움 — 우리 학교: 나이스 Open API(학교 검색·급식·학사일정·시간표) + 학교별 출판사 공유(Supabase) */
(function () {
  const NEIS_KEY = '793dbcd23885402bb542cc25cc91877f';
  const NEIS = 'https://open.neis.go.kr/hub/';
  const SB_URL = 'https://bjttfgoinspddtpsqseb.supabase.co/rest/v1/';
  const SB_KEY = 'sb_publishable_ceuUWQU_ry1sb4Aw1pjuBQ_6AU2H5vv';
  const MS = () => window.MS;
  const H = () => window.SubjApp._h;
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const ymd = (d) => d.getFullYear() + String(d.getMonth() + 1).padStart(2, '0') + String(d.getDate()).padStart(2, '0');
  const pretty = (s) => `${+s.slice(4, 6)}/${+s.slice(6, 8)}`;
  const DAYN = ['일', '월', '화', '수', '목', '금', '토'];
  const SUBJ_MAP = [['kor', /국어/], ['math', /수학/], ['soc', /사회/], ['sci', /과학/], ['eng', /영어/], ['his', /역사/], ['mor', /도덕/], ['mus', /음악/], ['art', /미술/], ['pe', /체육/], ['prac', /실과/], ['int', /바른|슬기|즐거운|통합/]];
  const ALG = { 1: '난류', 2: '우유', 3: '메밀', 4: '땅콩', 5: '대두', 6: '밀', 7: '고등어', 8: '게', 9: '새우', 10: '돼지고기', 11: '복숭아', 12: '토마토', 13: '아황산류', 14: '호두', 15: '닭고기', 16: '쇠고기', 17: '오징어', 18: '조개류', 19: '잣' };

  /* ---------- 공통 ---------- */
  function device() { let d; try { d = localStorage.getItem('ms_dev'); if (!d) { d = 'd' + Math.random().toString(36).slice(2, 12) + Date.now().toString(36); localStorage.setItem('ms_dev', d); } } catch (e) { d = 'd' + Date.now().toString(36); } return d; }
  const cache = {};
  function cget(k, ttl) { let v = cache[k]; if (!v) { try { v = JSON.parse(localStorage.getItem('ms_c_' + k)); } catch (e) { } } if (v && Date.now() - v.t < ttl) return v.d; return null; }
  function cset(k, d) { const v = { t: Date.now(), d }; cache[k] = v; try { localStorage.setItem('ms_c_' + k, JSON.stringify(v)); } catch (e) { } }
  function neis(api, params, ttl) {
    const q = Object.entries(Object.assign({ KEY: NEIS_KEY, Type: 'json', pIndex: 1, pSize: 100 }, params)).map(([k, v]) => k + '=' + encodeURIComponent(v)).join('&');
    const key = api + ':' + q.replace(/KEY=[^&]*&/, '');
    const c = ttl ? cget(key, ttl) : null; if (c) return Promise.resolve(c);
    return fetch(NEIS + api + '?' + q).then(r => r.json()).then(j => { const b = j[api]; const rows = b && b[1] ? b[1].row || [] : []; if (ttl) cset(key, rows); return rows; }).catch(() => []);
  }
  function sb(path, opt) { return fetch(SB_URL + path, Object.assign({ headers: { apikey: SB_KEY, Authorization: 'Bearer ' + SB_KEY, 'Content-Type': 'application/json', Prefer: (opt && opt.prefer) || '' } }, opt)).then(r => r.ok ? r.json().catch(() => []) : []).catch(() => []); }
  const kidSchool = (kid) => (kid || MS().kid()).school || null;
  const schoolKind = (s) => s.kind || (/고등학교/.test(s.name) ? '고' : /중학교/.test(s.name) ? '중' : '초');
  const hpUrl = (h) => { h = String(h || '').trim(); if (!h) return ''; return /^https?:\/\//i.test(h) ? h : 'https://' + h.replace(/^\/+/, ''); };
  const subjOfName = (n) => { const m = SUBJ_MAP.find(([k, re]) => re.test(n)); return m ? m[0] : null; };

  /* ---------- 학교 검색 ---------- */
  function search(q, kind) {
    const p = { SCHUL_NM: q, pSize: 50 }; if (kind) p.SCHUL_KND_SC_NM = kind;
    // 가입 화면에서 고른 학년에 맞는 학교급을 먼저 보여 준다(초 1~6 · 중 7~9 · 고 10~12)
    const gEl = document.getElementById('obGrade'); const g = gEl ? +gEl.value : (MS() && MS().st().kids.length ? MS().kid().grade : 0);
    const want = g >= 10 ? '고등학교' : g >= 7 ? '중학교' : g >= 1 ? '초등학교' : '';
    return neis('schoolInfo', p, 0).then(rows => rows.filter(r => /초등학교|중학교|고등학교/.test(r.SCHUL_KND_SC_NM)).sort((a, b) => (b.SCHUL_KND_SC_NM === want) - (a.SCHUL_KND_SC_NM === want)).map(r => ({ code: r.SD_SCHUL_CODE, atpt: r.ATPT_OFCDC_SC_CODE, name: r.SCHUL_NM, kind: r.SCHUL_KND_SC_NM === '고등학교' ? '고' : r.SCHUL_KND_SC_NM === '중학교' ? '중' : '초', addr: (r.ORG_RDNMA || '').replace(/\s*\(.*$/, ''), hp: (r.HMPG_ADRES || '').trim(), region: r.LCTN_SC_NM || '' })));
  }

  /* ---------- 출판사 공유 ---------- */
  function fetchPubs(school, grade) {
    const y = new Date().getFullYear();
    return sb(`mamssam_school_pubs_agg?school_code=eq.${school.code}&grade=eq.${grade}&year=eq.${y}&order=votes.desc`).then(rows => {
      const best = {}; (rows || []).forEach(r => { if (!best[r.subj] || r.votes > best[r.subj].votes) best[r.subj] = { pub: r.pub, votes: r.votes }; });
      return best;
    });
  }
  function sharePubs(kid) {
    const s = kidSchool(kid); if (!s) return Promise.resolve(false);
    const pubs = kid.pubs || {}; const y = new Date().getFullYear();
    const rows = Object.entries(pubs).filter(([k, p]) => p && p !== '선택 안 함' && p !== '기타').map(([subj, pub]) => ({ school_code: s.code, school_name: s.name, grade: kid.grade, subj, pub, year: y, device: device() }));
    if (!rows.length) return Promise.resolve(false);
    return sb('mamssam_school_pubs?on_conflict=school_code,grade,subj,device,year', { method: 'POST', body: JSON.stringify(rows), prefer: 'resolution=merge-duplicates,return=minimal' }).then(() => true);
  }

  /* ---------- 가입·수정 화면: 학교 검색 필드 ---------- */
  function obInject(edit) {
    const f = document.getElementById('obForm'); if (!f || f.querySelector('.ob-school')) return;
    const anchor = f.querySelector('input[name=name]'); if (!anchor) return;
    const kid = edit && MS() && MS().st().kids.length ? MS().kid() : null;
    let sel = kid && kid.school ? Object.assign({}, kid.school) : null;
    window._obSchool = { school: sel, cls: kid ? kid.cls || '' : '' };
    const field = document.createElement('div'); field.className = 'field ob-school';
    const draw = () => {
      field.innerHTML = `<label>학교 <span class="xs muted">(선택 · 급식·학사일정·시간표·우리 학교 출판사를 보여 드려요)</span></label>
        ${sel ? `<div class="sch-pick"><span class="sch-ic">🏫</span><span class="sch-t"><b>${esc(sel.name)}</b><small>${esc(sel.addr || sel.region)}</small></span><span class="row" style="gap:6px;align-items:center"><input class="input sch-cls" type="number" min="1" max="30" inputmode="numeric" placeholder="반" value="${esc(window._obSchool.cls)}" style="width:64px"><span class="small">반</span><button type="button" class="btn btn-sm" data-sch="clear">바꾸기</button></span></div><div class="sch-pubnote xs muted mt8" id="schPubNote"></div>`
          : `<div class="sch-search"><input class="input" id="schQ" placeholder="학교 이름 검색 (예: 대치초, 서초중, 대광여고)" autocomplete="off"><div class="sch-list" id="schList"></div></div>`}`;
    };
    draw();
    anchor.closest('.field').insertAdjacentElement('afterend', field);
    let timer = null;
    field.addEventListener('input', e => {
      if (e.target.id === 'schQ') {
        clearTimeout(timer); const q = e.target.value.trim(); const list = field.querySelector('#schList');
        if (q.length < 2) { list.innerHTML = ''; return; }
        timer = setTimeout(() => { list.innerHTML = '<div class="sch-item muted">검색 중…</div>'; search(q).then(rs => { if (field.querySelector('#schQ') && field.querySelector('#schQ').value.trim() !== q) return; list.innerHTML = rs.length ? rs.slice(0, 12).map((r, i) => `<button type="button" class="sch-item" data-sch="pick" data-i="${i}"><b>${esc(r.name)}</b><small>${esc(r.addr || r.region)}</small></button>`).join('') : '<div class="sch-item muted">검색 결과가 없어요. 학교 이름을 정확히 입력해 보세요.</div>'; field._rs = rs; }); }, 350);
      }
      if (e.target.classList.contains('sch-cls')) window._obSchool.cls = e.target.value;
    });
    field.addEventListener('click', e => {
      const b = e.target.closest('[data-sch]'); if (!b) return;
      if (b.dataset.sch === 'pick') { sel = field._rs[+b.dataset.i]; window._obSchool.school = sel; draw(); prefill(); const c = field.querySelector('.sch-cls'); if (c) c.focus(); }
      if (b.dataset.sch === 'clear') { sel = null; window._obSchool.school = null; draw(); setTimeout(() => { const q = field.querySelector('#schQ'); if (q) q.focus(); }, 0); }
    });
    field.addEventListener('keydown', e => { if (e.target.id === 'schQ' && e.key === 'Enter') e.preventDefault(); });
    const gEl = document.getElementById('obGrade');
    function prefill() {
      if (!sel) return; const g = +gEl.value; const note = field.querySelector('#schPubNote'); if (note) note.textContent = '우리 학교 출판사 정보를 찾는 중…';
      fetchPubs(sel, g).then(best => {
        const ks = Object.keys(best); let applied = 0;
        ks.forEach(k => { const s = f.querySelector(`select[data-obpub="${k}"]`); if (s && [...s.options].some(o => o.value === best[k].pub)) { if (s.value === '선택 안 함') { s.value = best[k].pub; s.dispatchEvent(new Event('change', { bubbles: true })); applied++; } } });
        const n = field.querySelector('#schPubNote'); if (!n) return;
        n.innerHTML = ks.length ? `✅ 이 학교 ${g <= 6 ? g + '학년' : g <= 9 ? '중' + (g - 6) : '고' + (g - 9)} 학부모들이 알려 준 출판사 ${ks.length}과목을 ${applied ? '아래에 채워 넣었어요' : '확인했어요'} (${ks.map(k => `${(H().SK[k] || {}).n || k} ${best[k].pub} · ${best[k].votes}명`).join(', ')}). 다르면 고쳐 주세요.` : '아직 이 학교 출판사 정보가 없어요. 아래에 입력해 주시면 같은 학교 학부모에게 공유돼요 🙏';
      });
    }
    if (sel) setTimeout(prefill, 400);
    gEl.addEventListener('change', () => setTimeout(prefill, 300));
  }
  function applyOb() {
    const o = window._obSchool; if (!o || !MS() || !MS().st().kids.length) return; window._obSchool = null;
    const kid = MS().kid();
    const before = JSON.stringify([kid.school && kid.school.code, kid.cls]);
    kid.school = o.school || null; kid.cls = o.school ? String(o.cls || '').trim() : '';
    if (kid.school) sharePubs(kid).then(ok => { if (ok) MS().toast('우리 학교 출판사 정보를 공유했어요 🙏'); });
    MS().save();
    if (before !== JSON.stringify([kid.school && kid.school.code, kid.cls]) && MS().render) setTimeout(() => MS().render(), 0);
  }

  /* ---------- 데이터 ---------- */
  function meals(s, from, to) { return neis('mealServiceDietInfo', { ATPT_OFCDC_SC_CODE: s.atpt, SD_SCHUL_CODE: s.code, MLSV_FROM_YMD: from, MLSV_TO_YMD: to }, 6 * 3600e3); }
  function schedule(s, from, to) { return neis('SchoolSchedule', { ATPT_OFCDC_SC_CODE: s.atpt, SD_SCHUL_CODE: s.code, AA_FROM_YMD: from, AA_TO_YMD: to, pSize: 300 }, 12 * 3600e3); }
  function timetable(s, grade, cls, from, to) { const g = grade >= 10 ? grade - 9 : grade >= 7 ? grade - 6 : grade; const k = schoolKind(s); return neis(k === '고' ? 'hisTimetable' : k === '중' ? 'misTimetable' : 'elsTimetable', { ATPT_OFCDC_SC_CODE: s.atpt, SD_SCHUL_CODE: s.code, GRADE: g, CLASS_NM: cls, TI_FROM_YMD: from, TI_TO_YMD: to, pSize: 200 }, 6 * 3600e3); }
  const gradeTag = (g) => g >= 7 ? `${g - 6}학년` : `${g}학년`;
  function eventFor(ev, g) {
    const n = ev.EVENT_NM || ''; if (/토요휴업/.test(n)) return false;
    const m = n.match(/\(([^)]*학년[^)]*)\)/); if (m) { const gs = (m[1].match(/\d/g) || []).map(Number); if (gs.length && !gs.includes(g >= 7 ? g - 6 : g)) return false; }
    const flags = ['ONE', 'TW', 'THREE', 'FR', 'FIV', 'SIX']; const i = (g >= 7 ? g - 6 : g) - 1;
    if (flags[i] && ev[flags[i] + '_GRADE_EVENT_YN'] === 'N' && Object.keys(ev).some(k => /_GRADE_EVENT_YN$/.test(k) && ev[k] === 'Y')) return false;
    return true;
  }
  function groupEvents(rows, g) {
    const out = [], last = {}; rows.filter(r => eventFor(r, g)).sort((x, y) => x.AA_YMD < y.AA_YMD ? -1 : 1).forEach(r => { const n = r.EVENT_NM.trim(), L = last[n]; if (L && (nextDay(L.to) === r.AA_YMD || L.to === r.AA_YMD)) L.to = r.AA_YMD; else { const e = { name: n, from: r.AA_YMD, to: r.AA_YMD }; out.push(e); last[n] = e; } });
    return out;
  }
  function nextDay(s) { const d = new Date(+s.slice(0, 4), +s.slice(4, 6) - 1, +s.slice(6, 8)); d.setDate(d.getDate() + 1); return ymd(d); }
  function dday(s) { const t = new Date(); t.setHours(0, 0, 0, 0); const d = new Date(+s.slice(0, 4), +s.slice(4, 6) - 1, +s.slice(6, 8)); return Math.round((d - t) / 864e5); }
  const isExam = (n) => /고사|평가|시험/.test(n) && !/수행/.test(n);
  const isHoliday = (n) => /방학|휴업|휴일|공휴|성탄|신정|설날|추석|개천|한글날|광복|현충|어린이날|삼일|대체/.test(n);

  /* ---------- 우리 학교 페이지 ---------- */
  function page() {
    const kid = MS().kid(), s = kidSchool(kid);
    if (!s) return MS().layout('school', `<div class="page-head"><div><h1>🏫 우리 학교</h1><div class="sub">학교를 등록하면 급식, 학사일정, 시험 D-day, 학급 시간표를 볼 수 있어요.</div></div></div>
      <div class="card"><div class="empty"><div class="e-ico">🏫</div>아직 학교를 등록하지 않았어요.<div class="mt12"><a class="btn btn-primary" href="#editkid">학교 등록하기</a></div></div></div>`);
    const today = ymd(new Date());
    const html = `<div class="page-head"><div><h1>🏫 ${esc(s.name)}</h1><div class="sub">${esc(s.addr || s.region)} · ${gradeTag(kid.grade)}${kid.cls ? ` ${esc(kid.cls)}반` : ''} ${s.hp ? `· <a href="${esc(hpUrl(s.hp))}" target="_blank" rel="noopener">홈페이지 ↗</a>` : ''} <a href="#editkid" class="xs">학교·반 바꾸기</a></div></div></div>
      <div id="schExam"></div>
      <div class="grid g2 sch-grid">
        <div class="card" id="schMeal"><div class="card-head"><h2>🍱 오늘 급식</h2><button class="btn btn-sm" data-sch="week">이번 주</button></div><div class="empty small">불러오는 중…</div></div>
        <div class="card" id="schTT"><div class="card-head"><h2>📚 오늘 학교 시간표</h2></div><div class="empty small">불러오는 중…</div></div>
      </div>
      <div class="card mt16" id="schCal"><div class="card-head"><h2>📅 다가오는 학사일정</h2></div><div class="empty small">불러오는 중…</div></div>`;
    setTimeout(() => load(kid, s, today), 0);
    return MS().layout('school', html);
  }
  function mealHTML(rows, dayLabel) {
    const show = MS().st()._alg;
    const lunch = rows.filter(r => r.MMEAL_SC_CODE === '2' || /중식/.test(r.MMEAL_SC_NM));
    if (!lunch.length) return `<div class="empty small">${dayLabel || '오늘'} 급식 정보가 없어요 (방학·휴업일이거나 아직 등록 전이에요).</div>`;
    return lunch.map(r => `<div class="meal"><div class="small muted">${r.MLSV_YMD === ymd(new Date()) ? '오늘' : pretty(r.MLSV_YMD) + ' ' + DAYN[new Date(+r.MLSV_YMD.slice(0, 4), +r.MLSV_YMD.slice(4, 6) - 1, +r.MLSV_YMD.slice(6, 8)).getDay()]} · ${esc(r.MMEAL_SC_NM)}${r.CAL_INFO ? ' · ' + esc(r.CAL_INFO) : ''}</div><ul class="meal-list">${r.DDISH_NM.split(/<br\s*\/?>/i).map(x => { const m = x.match(/^(.*?)\s*\(([\d.]+)\)\s*$/); const name = m ? m[1] : x; const al = m ? m[2].split('.').filter(Boolean) : []; return `<li>${esc(name.trim())}${al.length ? `<span class="meal-al" title="${al.map(a => ALG[a] || a).join(', ')}">${show ? al.map(a => ALG[a] || a).join('·') : al.join('.')}</span>` : ''}</li>`; }).join('')}</ul></div>`).join('') + `<button class="btn btn-sm mt8" data-sch="alg">${show ? '알레르기 번호로' : '알레르기 이름으로'}</button>`;
  }
  function load(kid, s, today) {
    const g = kid.grade;
    const d = new Date(); const mon = new Date(d); mon.setDate(d.getDate() - ((d.getDay() + 6) % 7)); const fri = new Date(mon); fri.setDate(mon.getDate() + 4);
    meals(s, today, today).then(rows => { const el = document.querySelector('#schMeal'); if (el) el.innerHTML = `<div class="card-head"><h2>🍱 오늘 급식</h2><button class="btn btn-sm" data-sch="week">이번 주</button></div><div class="meal-wrap">${mealHTML(rows)}</div>`; });
    if (kid.cls) timetable(s, g, kid.cls, today, today).then(rows => {
      const el = document.querySelector('#schTT'); if (!el) return;
      rows.sort((a, b) => +a.PERIO - +b.PERIO);
      if (!rows.length) { el.innerHTML = `<div class="card-head"><h2>📚 오늘 학교 시간표</h2></div><div class="empty small">오늘 시간표가 없어요 (주말·휴업일이거나 학교가 아직 올리지 않았어요).</div><button class="btn btn-sm" data-sch="ttsync">학교 시간표로 복습 과목 맞추기</button>`; return; }
      const ks = [...new Set(rows.map(r => subjOfName(r.ITRT_CNTNT)).filter(k => k && H().SK[k === 'math' && g >= 7 ? 'mth' : k]))];
      el.innerHTML = `<div class="card-head"><h2>📚 오늘 학교 시간표</h2><span class="xs muted">${gradeTag(g)} ${esc(kid.cls)}반</span></div>
        <ol class="tt-periods">${rows.map(r => `<li><span class="tp-n">${r.PERIO}</span><span>${esc(r.ITRT_CNTNT)}</span></li>`).join('')}</ol>
        ${ks.length ? `<div class="small bold mt12">오늘 배운 과목 복습하기</div><div class="chips mt8">${ks.map(k => { const kk = k === 'math' && g >= 7 ? 'mth' : k; const S = H().SK[kk]; return `<a class="chip subj-chip" style="--sc:${S.c}" href="#study/${kk}">${S.ic} ${S.n}</a>`; }).join('')}</div>` : ''}
        <button class="btn btn-sm mt12" data-sch="ttsync">학교 시간표로 복습 과목 맞추기</button>`;
    }); else { const el = document.querySelector('#schTT'); if (el) el.innerHTML = `<div class="card-head"><h2>📚 오늘 학교 시간표</h2></div><div class="empty small">반을 입력하면 우리 반 시간표가 보여요.<div class="mt8"><a class="btn btn-sm" href="#editkid">반 입력하기</a></div></div>`; }
    const end = new Date(d); end.setDate(d.getDate() + 120);
    schedule(s, today, ymd(end)).then(rows => {
      const ev = groupEvents(rows, g);
      const exam = ev.find(e => isExam(e.name) && dday(e.from) >= 0 && dday(e.from) <= 45);
      const ex = document.querySelector('#schExam');
      if (ex && exam) { const n = dday(exam.from); ex.innerHTML = `<div class="card exam-card"><div class="exam-d">D-${n === 0 ? 'DAY' : n}</div><div style="flex:1;min-width:0"><div class="exam-t">${esc(exam.name)}</div><div class="small muted">${pretty(exam.from)}${exam.to !== exam.from ? ' ~ ' + pretty(exam.to) : ''} · ${n <= 7 ? '마무리: 오답 노트와 간격 복습을 돌려요' : n <= 21 ? '지금은 단원별 확인 문제로 구멍을 찾을 때예요' : '아직 여유가 있어요. 개념 정리부터 차근차근'}</div><div class="row mt8" style="gap:6px;flex-wrap:wrap"><a class="btn btn-sm btn-primary" href="#study/top/method/review">🔁 간격 복습</a><a class="btn btn-sm" href="#study/top/method/mix">🔀 섞어 풀기</a><a class="btn btn-sm" href="#study/top/hard">🔥 고난도</a></div></div></div>`; }
      const el = document.querySelector('#schCal'); if (!el) return;
      const list = ev.slice(0, 10);
      el.innerHTML = `<div class="card-head"><h2>📅 다가오는 학사일정</h2><span class="xs muted">${gradeTag(g)} 기준 · 나이스 제공</span></div>${list.length ? `<div class="sch-ev">${list.map(e => { const n = dday(e.from); return `<div class="ev ${isExam(e.name) ? 'exam' : isHoliday(e.name) ? 'off' : ''}"><span class="ev-d">${pretty(e.from)}${e.to !== e.from ? '~' + pretty(e.to) : ''}</span><span class="ev-n">${esc(e.name)}</span><span class="ev-dd">${n === 0 ? '오늘' : n > 0 ? 'D-' + n : ''}</span></div>`; }).join('')}</div>` : '<div class="empty small">앞으로 4개월 안에 등록된 일정이 없어요.</div>'}`;
    });
  }
  function weekMeals() {
    const kid = MS().kid(), s = kidSchool(kid); const d = new Date(); const mon = new Date(d); mon.setDate(d.getDate() - ((d.getDay() + 6) % 7)); const fri = new Date(mon); fri.setDate(mon.getDate() + 4);
    meals(s, ymd(mon), ymd(fri)).then(rows => { const el = document.querySelector('#schMeal'); if (el) el.innerHTML = `<div class="card-head"><h2>🍱 이번 주 급식</h2><button class="btn btn-sm" data-sch="today">오늘만</button></div><div class="meal-wrap">${mealHTML(rows, '이번 주')}</div>`; });
  }
  function syncTT() {
    const kid = MS().kid(), s = kidSchool(kid); if (!s || !kid.cls) { MS().toast('반을 먼저 입력해 주세요'); return; }
    const d = new Date(); const mon = new Date(d); mon.setDate(d.getDate() - ((d.getDay() + 6) % 7)); const fri = new Date(mon); fri.setDate(mon.getDate() + 4);
    MS().toast('학교 시간표를 불러오는 중…');
    timetable(s, kid.grade, kid.cls, ymd(mon), ymd(fri)).then(rows => {
      if (!rows.length) { MS().toast('이번 주 시간표가 아직 없어요'); return; }
      const byDay = {}; rows.forEach(r => { const dd = new Date(+r.ALL_TI_YMD.slice(0, 4), +r.ALL_TI_YMD.slice(4, 6) - 1, +r.ALL_TI_YMD.slice(6, 8)).getDay(); const k = subjOfName(r.ITRT_CNTNT); const kk = k === 'math' && kid.grade >= 7 ? 'mth' : k; if (kk && H().SK[kk]) { byDay[dd] = byDay[dd] || []; if (!byDay[dd].includes(kk)) byDay[dd].push(kk); } });
      const core = ['kor', 'math', 'mth', 'eng', 'sci', 'soc', 'his'];
      const mine = H().kidSubjs(kid); let n = 0;
      kid.tt = kid.tt || {};
      Object.keys(byDay).forEach(dd => { if (!(kid.days || []).includes(+dd)) return; const pick = byDay[dd].filter(k => mine.includes(k)).sort((a, b) => core.indexOf(a) - core.indexOf(b)).slice(0, 3); if (pick.length) { kid.tt[dd] = pick; n++; } });
      MS().save(); MS().toast(n ? `${n}일치 복습 과목을 학교 시간표에 맞췄어요 ✅ (설정에서 확인)` : '시간표 과목이 함께 공부할 과목과 겹치지 않아요'); if (window.MS.render) MS().render();
    });
  }

  /* ---------- 홈 카드 ---------- */
  function homeCard() {
    const kid = MS().kid(), s = kidSchool(kid);
    const html = s ? `<a class="card sch-home" href="#school" id="schHome"><div class="row between"><b>🏫 ${esc(s.name)}${kid.cls ? ` · ${gradeTag(kid.grade)} ${esc(kid.cls)}반` : ''}</b><span class="xs muted">우리 학교 ›</span></div><div class="sch-home-b small muted" id="schHomeBody">급식 · 학사일정 · 시간표 불러오는 중…</div></a>`
      : `<a class="card sch-home dim" href="#editkid"><div class="row between"><b>🏫 우리 학교 등록하기</b><span class="xs muted">학교 검색 ›</span></div><div class="small muted mt4">급식, 시험 D-day, 학급 시간표, 우리 학교 교과서 출판사까지 한 번에</div></a>`;
    if (s) setTimeout(() => {
      const today = ymd(new Date()); const end = new Date(); end.setDate(end.getDate() + 60);
      Promise.all([meals(s, today, today), schedule(s, today, ymd(end))]).then(([m, sc]) => {
        const el = document.getElementById('schHomeBody'); if (!el) return;
        const lunch = m.find(r => r.MMEAL_SC_CODE === '2' || /중식/.test(r.MMEAL_SC_NM));
        const dish = lunch ? lunch.DDISH_NM.split(/<br\s*\/?>/i).map(x => x.replace(/\s*\([\d.]+\)\s*$/, '').trim()).filter(Boolean).slice(0, 4).join(', ') : '';
        const ev = groupEvents(sc, kid.grade).filter(e => dday(e.from) >= 0); const exam = ev.find(e => isExam(e.name)); const nx = ev[0];
        el.innerHTML = `${dish ? `<div>🍱 오늘 급식: ${esc(dish)}${lunch.DDISH_NM.split('<br').length > 4 ? ' …' : ''}</div>` : '<div>🍱 오늘 급식 정보 없음</div>'}${exam ? `<div class="sch-dd">📝 ${esc(exam.name)} <b>D-${dday(exam.from) || 'DAY'}</b></div>` : nx ? `<div>📅 ${pretty(nx.from)} ${esc(nx.name)} (D-${dday(nx.from) || 'DAY'})</div>` : ''}`;
      });
    }, 0);
    return html;
  }

  /* ---------- 설정 카드 보강 ---------- */
  function settingsDecor() {
    const tt = document.querySelector('.tt-card'); if (!tt || tt.querySelector('.sch-set')) return;
    const kid = MS().kid(), s = kidSchool(kid);
    const h = tt.querySelector('h3'); if (!h) return;
    const box = document.createElement('div'); box.className = 'sch-set xs muted mt8';
    box.innerHTML = s ? `🏫 ${esc(s.name)} · <button class="btn btn-sm" data-sch="share">우리 학교 출판사 공유하기</button> <span class="muted">같은 학교 학부모가 가입할 때 자동으로 채워져요.</span>` : `학교를 등록하면 같은 학교 학부모들이 알려 준 출판사가 자동으로 채워져요. <a href="#editkid">학교 등록 ›</a>`;
    h.insertAdjacentElement('afterend', box);
  }

  /* ---------- 라우팅 · 이벤트 ---------- */
  function after(a) {
    if (a[0] === 'ob' || a[0] === 'addkid' || a[0] === 'editkid') { try { obInject(a[0] === 'editkid'); } catch (e) { } return; }
    try { applyOb(); } catch (e) { }
    if (a[0] === 'settings') try { settingsDecor(); } catch (e) { }
  }
  document.addEventListener('click', e => {
    const b = e.target.closest('[data-sch]'); if (!b || b.closest('#obForm')) return;
    const t = b.dataset.sch;
    if (t === 'week') weekMeals();
    if (t === 'today') { const kid = MS().kid(); load(kid, kidSchool(kid), ymd(new Date())); }
    if (t === 'alg') { const st = MS().st(); st._alg = !st._alg; MS().save(); const el = document.querySelector('#schMeal h2'); if (el && /이번 주/.test(el.textContent)) weekMeals(); else { const kid = MS().kid(); load(kid, kidSchool(kid), ymd(new Date())); } }
    if (t === 'ttsync') syncTT();
    if (t === 'share') { b.disabled = true; sharePubs(MS().kid()).then(ok => { b.disabled = false; MS().toast(ok ? '공유했어요. 고마워요 🙏' : '먼저 출판사를 골라 주세요'); }); }
  });
  window.SchoolApp = { page, after, homeCard, search, fetchPubs };
})();
