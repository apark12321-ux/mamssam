/* 쌤픽 — 입력 대신 선택
   · data-chips="a|b|c"      : 입력칸 아래 빠른 선택 칩(누르면 값이 채워짐). data-chips-mode="append"면 쉼표로 이어 붙임
   · data-chips="@date"       : 오늘·내일·모레·이번 주말 칩
   · data-suggest="목록이름"  : 입력하면 아래에 추천 목록(초성 검색 지원). 고르면 값이 채워짐. data-pick-submit이면 고르는 즉시 제출
   입력칸은 그대로 남겨 두어 목록에 없는 값도 직접 쓸 수 있다. */
(function () {
  'use strict';
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const pad = (n) => String(n).padStart(2, '0');
  const ymd = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

  /* ---------- 추천 목록 ---------- */
  const UNIV = ['서울대', '연세대', '고려대', '서강대', '성균관대', '한양대', '중앙대', '경희대', '한국외대', '서울시립대', '건국대', '동국대', '홍익대', '국민대', '숭실대', '세종대', '단국대', '광운대', '명지대', '상명대', '가톨릭대', '아주대', '인하대', '이화여대', '숙명여대', '성신여대', '동덕여대', '서울여대', '덕성여대', '한국항공대', '서울과기대', '한양대(ERICA)', '경기대', '가천대', '한국공학대', '부산대', '경북대', '전남대', '전북대', '충남대', '충북대', '강원대', '경상국립대', '제주대', '부경대', '울산대', '영남대', '계명대', '동아대', '조선대', '인제대', '순천향대', '한림대', '원광대', '을지대', '차의과대', 'KAIST', 'POSTECH', 'UNIST', 'DGIST', 'GIST', '한국에너지공대', '한국교원대', '서울교대', '경인교대', '춘천교대', '청주교대', '공주교대', '전주교대', '광주교대', '대구교대', '부산교대', '진주교대', '경찰대', '육군사관학교', '해군사관학교', '공군사관학교', '국군간호사관학교', '한국체대', '한국예술종합학교'];
  const TYPES = ['학생부종합', '학생부교과', '논술', '실기', '면접', '지역의사', '지역인재', '기회균형'];
  const LISTS = {
    univ: () => UNIV.flatMap(u => [u].concat(TYPES.map(t => `${u} ${t}`))),
    exam: () => ['3월 학력평가', '4월 학력평가', '6월 모의평가', '7월 학력평가', '9월 모의평가', '10월 학력평가', '11월 학력평가', '대학수학능력시험', '사설 모의고사', '학교 모의고사'],
    hiTask: () => ['국어 모의고사 1회분', '국어 비문학 지문 3개', '문학 EBS 연계 2작품', '문법 개념 10개 복습', '수학 4점 문항 10개', '수학 준킬러 5문항', '수학 오답 다시 풀기', '수학 개념 1단원', '영어 독해 10문항 20분', '영어 빈칸·순서·삽입 10문항', '영어 단어 50개', '영어 듣기 1회분', '한국사 기출 1회', '탐구 개념 1단원', '탐구 기출 20문항 25분', '오답 원인 3개 적기', '개념 과외 1개념', '면접 예상 질문 3개 답하기', '논술 기출 1문항'],
    book: () => ['개념 문제집', '연산 문제집', '응용 문제집', '심화 문제집', '교과서', '수학 익힘책', '국어 문제집', '독해 문제집', '어휘 문제집', '영어 문제집', '영단어', '사회 문제집', '과학 문제집', '한자', '받아쓰기 연습장', '기출 문제집', 'EBS 수능특강', 'EBS 수능완성'],
    topic: () => ['분수', '소수', '구구단', '곱셈', '나눗셈', '도형', '시계 보기', '받아쓰기', '맞춤법', '독서 습관', '그림책', '영어 그림책', '파닉스', '집중력', '공부 습관', '과학 실험', '역사', '지도 읽기', '수학 놀이', '코딩'],
    ivkw: () => ['탐구 보고서', '실험 설계', '데이터 분석', '독서 토론', '발표', '동아리 프로젝트', '봉사 활동', '진로 탐색', '논문 읽기', '코딩 프로젝트', '환경 문제', '기후 변화', '인공지능 윤리', '생명 윤리', '미생물 배양', '경제 지표 분석', '사회 문제 설문', '수학 모델링', '문학 비평', '역사 인물 탐구']
  };
  window.SsaemPick = { LISTS, UNIV };

  /* ---------- 초성 검색 ---------- */
  const CHO = 'ㄱㄲㄴㄷㄸㄹㅁㅂㅃㅅㅆㅇㅈㅉㅊㅋㅌㅍㅎ';
  const cho = (s) => [...s].map(ch => { const c = ch.charCodeAt(0) - 0xAC00; return c >= 0 && c <= 11171 ? CHO[Math.floor(c / 588)] : ch; }).join('');
  const isCho = (s) => /^[ㄱ-ㅎ\s]+$/.test(s);
  const norm = (s) => s.replace(/\s+/g, '').toLowerCase();
  function match(list, q) {
    q = q.trim().replace(/학종/g, '학생부종합').replace(/(^|\s)교과/g, '$1학생부교과'); if (!q) return list.slice(0, 8);
    const nq = norm(q);
    const hit = list.filter(x => isCho(q) ? norm(cho(x)).includes(nq) : norm(x).includes(nq));
    hit.sort((a, b) => (norm(a).startsWith(nq) || norm(cho(a)).startsWith(nq) ? 0 : 1) - (norm(b).startsWith(nq) || norm(cho(b)).startsWith(nq) ? 0 : 1) || a.length - b.length);
    return hit.slice(0, 8);
  }

  /* ---------- 값 넣기 ---------- */
  function setVal(inp, v, append) {
    if (append) { const cur = inp.value.split(/[,·]/).map(s => s.trim()).filter(Boolean); if (cur.includes(v)) return; cur.push(v); v = cur.join(', '); }
    inp.value = v;
    inp.dispatchEvent(new Event('input', { bubbles: true }));
    inp.dispatchEvent(new Event('change', { bubbles: true }));
  }
  function dateChips() {
    const d = new Date(); const out = []; const add = (n, lab) => { const x = new Date(d); x.setDate(d.getDate() + n); out.push([ymd(x), lab]); };
    add(0, '오늘'); add(1, '내일'); add(2, '모레');
    const sat = (6 - d.getDay() + 7) % 7 || 7; add(sat, '이번 토요일'); add(7, '일주일 뒤');
    return out;
  }

  /* ---------- 칩 ---------- */
  function chips(inp) {
    if (inp._pkChips) return; inp._pkChips = true;
    const spec = inp.dataset.chips; const append = inp.dataset.chipsMode === 'append';
    const items = spec === '@date' ? dateChips() : spec.split('|').map(x => [x, x]);
    const row = document.createElement('div'); row.className = 'pk-chips';
    row.innerHTML = items.map(([v, l]) => `<button type="button" class="pk-chip" data-v="${esc(v)}">${esc(l)}</button>`).join('');
    const sync = () => { const vals = append ? inp.value.split(/[,·]/).map(s => s.trim()) : [inp.value]; row.querySelectorAll('.pk-chip').forEach(b => b.classList.toggle('on', vals.includes(b.dataset.v))); };
    row.addEventListener('click', e => { const b = e.target.closest('.pk-chip'); if (!b) return; e.preventDefault(); setVal(inp, b.dataset.v, append); sync(); });
    inp.addEventListener('input', sync); sync();
    (inp.closest('.row') || inp).insertAdjacentElement('afterend', row);
  }

  /* ---------- 추천 목록 ---------- */
  let openBox = null;
  function closeBox() { if (openBox) { openBox.remove(); openBox = null; } }
  function suggest(inp) {
    if (inp._pkSug) return; inp._pkSug = true;
    inp.setAttribute('autocomplete', 'off');
    const src = LISTS[inp.dataset.suggest]; if (!src) return;
    let idx = -1;
    const show = () => {
      const ap = inp.dataset.chipsMode === 'append'; const q = ap ? inp.value.split(/[,·]/).pop() : inp.value;
      const list = match(src(), q).filter(x => !(ap && inp.value.split(/[,·]/).map(t => t.trim()).includes(x))); closeBox(); idx = -1;
      if (!list.length || (list.length === 1 && list[0] === q.trim())) return;
      const box = document.createElement('div'); box.className = 'pk-box'; box.setAttribute('role', 'listbox');
      box.innerHTML = list.map((x, i) => `<button type="button" class="pk-opt" role="option" data-i="${i}">${esc(x)}</button>`).join('');
      box.addEventListener('pointerdown', e => e.preventDefault()); // 입력칸 포커스 유지
      box.addEventListener('click', e => { const b = e.target.closest('.pk-opt'); if (!b) return; pick(b.textContent); });
      const host = inp.parentElement; host.classList.add('pk-host'); host.appendChild(box); openBox = box;
      box.style.top = (inp.offsetTop + inp.offsetHeight + 4) + 'px'; box.style.left = inp.offsetLeft + 'px'; box.style.width = inp.offsetWidth + 'px';
    };
    const pick = (v) => { if (inp.dataset.chipsMode === 'append') { const parts = inp.value.split(/[,·]/).map(t => t.trim()); parts[parts.length - 1] = v; setVal(inp, parts.filter(Boolean).join(', ')); } else setVal(inp, v); closeBox(); if (inp.hasAttribute('data-pick-submit') && inp.form) inp.form.requestSubmit ? inp.form.requestSubmit() : inp.form.submit(); };
    inp.addEventListener('focus', show);
    inp.addEventListener('input', e => { if (e.isTrusted) show(); });
    inp.addEventListener('blur', () => setTimeout(closeBox, 120));
    inp.addEventListener('keydown', e => {
      if (!openBox) return; const opts = [...openBox.querySelectorAll('.pk-opt')];
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') { e.preventDefault(); idx = (idx + (e.key === 'ArrowDown' ? 1 : -1) + opts.length) % opts.length; opts.forEach((o, i) => o.classList.toggle('on', i === idx)); }
      else if (e.key === 'Enter' && idx >= 0) { e.preventDefault(); pick(opts[idx].textContent); }
      else if (e.key === 'Escape') closeBox();
    });
  }

  function enhance(root) {
    (root || document).querySelectorAll('input[data-chips]').forEach(chips);
    (root || document).querySelectorAll('input[data-suggest]').forEach(suggest);
  }
  const mo = new MutationObserver(() => enhance(document));
  function boot() { enhance(document); mo.observe(document.body, { childList: true, subtree: true }); }
  document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', boot) : boot();

  const css = `.pk-chips{display:flex;flex-wrap:wrap;gap:6px;margin-top:6px}
  .pk-chip{font:inherit;font-size:12.5px;padding:5px 10px;border-radius:999px;border:1px solid var(--line,#E2E8F0);background:#fff;color:inherit;cursor:pointer}
  .pk-chip.on{background:var(--blue,#4A7DF0);border-color:var(--blue,#4A7DF0);color:#fff}
  .pk-host{position:relative}
  .pk-box{position:absolute;z-index:60;background:#fff;border:1px solid var(--line,#E2E8F0);border-radius:12px;box-shadow:0 12px 28px rgba(15,23,42,.16);padding:4px;max-height:260px;overflow:auto;overscroll-behavior:contain}
  .pk-opt{display:block;width:100%;text-align:left;font:inherit;font-size:14px;padding:9px 10px;border:0;background:none;border-radius:8px;cursor:pointer;color:inherit}
  .pk-opt:hover,.pk-opt.on{background:var(--blue-l,#E8F0FF)}`;
  const s = document.createElement('style'); s.textContent = css; document.head.appendChild(s);
})();
