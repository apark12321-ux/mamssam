/* 맘쌤 — 학교급(초·중·고) 진입, 고등 수능·대입 모드, 초등 모바일 압축 홈 */
(function () {
  'use strict';
  const MS = () => window.MS;
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const pad = (n) => String(n).padStart(2, '0');
  const ymd = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  const DAYN = ['일', '월', '화', '수', '목', '금', '토'];
  const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
  const isMobile = () => window.innerWidth <= 640;
  const lvOf = (g) => g >= 10 ? 'h' : g >= 7 ? 'm' : 'e';
  const isHigh = () => { try { const k = MS() && MS().st().kids.length && MS().kid(); return !!(k && k.grade >= 10); } catch (e) { return false; } };
  const gradesFor = (lv) => lv === 'h' ? [10, 11, 12] : lv === 'm' ? [7, 8, 9] : lv === 'e' ? [1, 2, 3, 4, 5, 6] : [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

  /* ---------- 첫 화면: 초·중·고 선택 ---------- */
  const LV = {
    e: { n: '초등', t: '엄마표 학습', ic: '🧒', c: '#4A7DF0', d: '엄마가 선생님이 되는 가장 쉬운 방법', pts: ['오늘 30분 수업 흐름과 설명 대본', '단원별 워크시트 자동 출제·채점', '전과목 개념 영상·우리 학교 급식·시간표', '"분수는 어떻게 설명해요?" 엄마 도우미'] },
    m: { n: '중등', t: '자기주도 학습', ic: '🎒', c: '#12A150', d: '스스로 계획하고, 영상으로 배우고, 문제로 확인', pts: ['과목별 단원 개념 → 영상 → 확인 문제', '주간 시간표와 연속 공부 기록', '오답 노트 자동 수집·다시 풀기', '최상위 공부법(메타인지·간격 복습)'] },
    h: { n: '고등', t: '수능·대입 쪽집게', ic: '🎯', c: '#1F2A44', d: '수능 D-day부터 전형 캘린더, 쪽집게 체크리스트까지', pts: ['수능 D-day · 모의고사 등급 추적', '과목별 출제 구조·쪽집게 체크리스트', '고1·2·3 대입 로드맵과 전형 캘린더', 'EBSi·평가원·어디가 등 공식 자료 허브'] }
  };
  function picker(adding) {
    const st = MS().st();
    return `<div class="lv-wrap">
      <div class="lv-head"><div class="brand" style="padding:0;justify-content:center"><div class="brand-mark">맘</div><div class="brand-name">맘쌤</div></div>
        <h1>${adding ? '추가할 학생의 학교급을 골라 주세요' : '초등 · 중등 · 고등<br>어디서 시작할까요?'}</h1>
        <p class="muted">학교급마다 화면과 기능이 달라져요. 나중에 설정에서 바꿀 수 있어요.</p></div>
      <div class="lv-grid">${['e', 'm', 'h'].map(k => { const L = LV[k]; return `<button class="lv-card lv-${k}" data-act="pickLv" data-lv="${k}" style="--sc:${L.c}"><span class="lv-ic">${L.ic}</span><span class="lv-n">${L.n}</span><span class="lv-t">${L.t}</span><span class="lv-d">${L.d}</span><ul class="lv-pts">${L.pts.map(p => `<li>${p}</li>`).join('')}</ul><span class="lv-go">시작하기 ›</span></button>`; }).join('')}</div>
      ${adding ? '<p class="center mt16"><a class="btn btn-ghost btn-sm" href="#settings">← 설정으로</a></p>' : ''}
      <p class="xs muted center mt16">입력한 정보는 이 기기의 브라우저에만 저장됩니다. · <a href="#legal">저작권·광고·개인정보 안내</a></p>
    </div>`;
  }
  function obLeft(lv) {
    const L = LV[lv] || LV.e;
    return `<div class="brand" style="padding:0"><div class="brand-mark" style="background:#fff;color:${L.c}">맘</div><div class="brand-name">맘쌤</div></div>
      <div class="ob-lv"><span>${L.ic}</span> ${L.n} · ${L.t}</div>
      <h1>${lv === 'h' ? '수능까지, 흔들리지 않게<br>한 곳에서 관리해요' : '스스로 계획하고<br>스스로 확인하는 공부'}</h1>
      <p class="ob-sub">${L.d}</p>
      <div class="ob-feats">${L.pts.map((p, i) => `<div class="ob-feat"><span class="of-i">${['📅', '🎯', '🗺️', '📚'][i]}</span><div><div class="of-t">${p}</div></div></div>`).join('')}</div>
      <button class="btn btn-ghost btn-sm" data-act="pickLv" data-lv="" style="color:#fff;margin-top:auto;align-self:flex-start">← 학교급 다시 고르기</button>`;
  }

  /* ---------- 고등: 데이터 ---------- */
  // 수능은 매년 11월 셋째 목요일에 시행되어 왔다(정확한 날짜는 평가원 시행 기본계획으로 확정).
  function suneungDate(from) {
    const d = from || new Date();
    const calc = (y) => { const n = new Date(y, 10, 1); const off = (4 - n.getDay() + 7) % 7; return new Date(y, 10, 1 + off + 14); };
    let s = calc(d.getFullYear());
    if (s < new Date(d.getFullYear(), d.getMonth(), d.getDate())) s = calc(d.getFullYear() + 1);
    return s;
  }
  const dday = (to, from) => Math.ceil((new Date(to.getFullYear(), to.getMonth(), to.getDate()) - new Date(from.getFullYear(), from.getMonth(), from.getDate())) / 864e5);
  // 응시 학년도: 고3은 올해 11월, 고2는 내년, 고1은 후년
  const examYear = (kid) => suneungDate().getFullYear() + (12 - kid.grade) + 1;
  const newSystem = (kid) => examYear(kid) >= 2028; // 2028학년도 수능부터 통합형(선택과목 없음)

  const SUBJ_H = [
    { k: 'kor', n: '국어', ic: '📖', c: '#E5484D',
      cur: '45문항 · 80분 · 공통(독서·문학) + 선택 1(화법과 작문 / 언어와 매체) · 상대평가',
      nxt: '공통 응시(화법과 언어 · 독서와 작문 · 문학) · 선택과목 없음 · 상대평가',
      pts: ['비문학은 지문 구조(정의→원리→사례→한계)를 먼저 잡고, 문단마다 핵심어 1개에 표시', '문학은 EBS 연계 작품의 "주제·화자·상황·태도"를 한 줄로 정리해 두기', '선택과목(현행)은 문법 개념 40개를 표로 만들어 매주 10개씩 복습', '시간 배분: 독서 지문당 8분을 넘기면 과감히 다음 지문으로', '기출은 "왜 오답인지"를 선지마다 근거 문장과 연결해 적기'] },
    { k: 'math', n: '수학', ic: '📐', c: '#4A7DF0',
      cur: '30문항 · 100분 · 공통(수학Ⅰ·수학Ⅱ) + 선택 1(확률과 통계 / 미적분 / 기하) · 상대평가',
      nxt: '공통 응시(대수 · 미적분Ⅰ · 확률과 통계) · 선택과목 없음 · 심화수학 미도입 · 상대평가',
      pts: ['4점 문항은 "조건을 식으로 번역"하는 연습이 핵심. 조건마다 번호를 붙여 식 하나씩 세우기', '공통 22문항에서 3점을 10분 안에 끝내는 속도가 등급을 가른다', '틀린 문제는 풀이를 다시 보지 말고 다음 날 백지에서 다시 풀기', '킬러 문항보다 준킬러(13~15·20·21번대)를 안정적으로 맞히는 것이 2등급의 조건', '계산 실수 노트: 어떤 유형에서 어떤 실수를 했는지 10개만 모아도 실수가 반으로 준다'] },
    { k: 'eng', n: '영어', ic: '🔤', c: '#7C3AED',
      cur: '45문항(듣기 17) · 70분 · 절대평가(90점 이상 1등급)',
      nxt: '절대평가 유지',
      pts: ['절대평가라 "90점 안정권" 전략: 듣기 17문항 만점 + 빈칸·순서·삽입에서 2개 이내 오답', '빈칸은 "글의 주제문 = 빈칸 문장"인지부터 확인하고, 선지는 주제와의 일관성으로 소거', 'EBS 연계 지문은 소재·주제만 익히고 지문 암기는 하지 않기', '매일 모의고사 1회분 중 독해 10문항을 20분 타이머로 풀기', '어휘는 기출 지문 속 모르는 단어만 모아 "문장째" 외우기'] },
    { k: 'his', n: '한국사', ic: '🏛️', c: '#B45309',
      cur: '20문항 · 30분 · 필수 · 절대평가(40점 이상 1등급)',
      nxt: '필수 · 절대평가 유지',
      pts: ['시대별 핵심 사건 60개를 연표 한 장으로 정리하면 충분', '시험 2주 전부터 기출 5회분으로 마무리', '자료(사료·지도·사진) 문제는 자료 속 키워드 1개가 답을 정한다'] },
    { k: 'soc', n: '사회탐구', ic: '🌏', c: '#0891B2',
      cur: '과목당 20문항 · 30분 · 최대 2과목 선택(생활과 윤리·사회문화·한국지리 등 9과목) · 상대평가',
      nxt: '통합사회 1과목으로 응시(과학탐구 통합과학과 함께 모두 응시) · 상대평가',
      pts: ['개념은 교과서 1회독 뒤, 기출 선지를 "맞는 진술·틀린 진술"로 분류해 노트화', '표·그래프 문제는 숫자를 바꿔가며 직접 계산하는 연습이 가장 효과적', '마지막 2개월은 평가원·교육청 기출 위주, 사설은 보조로'] },
    { k: 'sci', n: '과학탐구', ic: '🔬', c: '#16A34A',
      cur: '과목당 20문항 · 30분 · 최대 2과목 선택(물리학·화학·생명과학·지구과학 Ⅰ·Ⅱ) · 상대평가',
      nxt: '통합과학 1과목으로 응시(사회탐구 통합사회와 함께 모두 응시) · 상대평가',
      pts: ['계산형(물리·화학)은 공식보다 "단위와 비례"로 식을 세우는 습관', '생명과학 유전은 조건을 표로 정리하는 틀을 하나 고정해 두기', '지구과학은 자료 해석 패턴(시간·위치·방향) 3가지를 반복 훈련', '시간 부족이 가장 큰 변수: 20문항 25분 타이머로 푸는 연습'] }
  ];

  const ROAD = {
    10: { t: '고1 · 기초와 습관의 해', items: ['내신: 2025년 입학생부터 5등급제. 전 과목 고르게, 특히 국·영·수 교과 성취도 관리', '학생부: 세부능력 및 특기사항(세특)은 수업 중 탐구·발표·보고서로 쌓인다. 한 학기 과목당 1개 이상 탐구 기록 목표', '과목 선택: 2학년 선택과목은 희망 계열(인문·사회 / 자연·공학 / 예체능)을 기준으로 1학년 겨울방학 전에 결정', '모의고사: 3·6·9·11월 교육청 학력평가로 수능형 문제에 익숙해지기. 등급보다 "시간 안에 푸는 습관"이 목표', '독서: 진로 관련 책 학기당 2권을 읽고 한 줄 요약을 남기기'] },
    11: { t: '고2 · 방향을 정하는 해', items: ['내신: 선택과목 성취도가 전공 적합성 판단 근거가 된다. 희망 학과 관련 과목에 집중', '수능: 국어·수학은 2학년 안에 개념 1회독 완료, 영어는 절대평가 1등급(90점) 안정권 진입', '모의고사: 6월·9월 평가원 모의평가는 고3 대상이지만, 교육청 학평 3·6·9·11월로 등급 추이 기록 시작', '전형 탐색: 어디가(adiga.kr)에서 희망 대학 3곳의 전형별 반영 교과·수능 최저학력기준 확인', '생활기록부: 자율·동아리·진로 활동을 하나의 주제로 연결하면 평가에 유리'] },
    12: { t: '고3 · 실전의 해', items: ['3월 학평으로 현재 위치 확인 → 6월 평가원 모의평가 전까지 취약 단원 보완', '6월·9월 평가원 모의평가: 그해 수능 출제 경향의 기준. 등급컷과 오답 원인을 반드시 기록', '수시: 9월 원서접수(대학별 일정 상이), 최대 6회 지원. 수능 최저학력기준 충족 가능성을 모의고사 등급으로 판단', '수능: 11월 셋째 목요일. 10월부터는 새 문제보다 기출·EBS 연계 복습 중심', '정시: 12월 수능 성적 발표 후 가·나·다군 3회 지원. 수시 합격(추가합격 포함) 시 정시 지원 불가'] }
  };

  // 연간 대입 일정(일반적인 시기). 정확한 날짜는 매년 평가원·대교협·교육청 공지로 확정된다.
  const CAL = [
    { m: 3, t: '3월 교육청 전국연합학력평가', who: '서울시교육청', g: [10, 11, 12] },
    { m: 3, t: '수능 시행 기본계획 발표', who: '한국교육과정평가원', g: [12] },
    { m: 4, t: '1학기 중간고사', who: '학교', g: [10, 11, 12] },
    { m: 5, t: '대학별 수시 모집요강 확정 발표', who: '각 대학 · 대교협', g: [12] },
    { m: 6, t: '6월 수능 모의평가', who: '한국교육과정평가원', g: [12] },
    { m: 6, t: '6월 교육청 학력평가', who: '부산시교육청', g: [10, 11] },
    { m: 7, t: '1학기 기말고사', who: '학교', g: [10, 11, 12] },
    { m: 8, t: '수능 응시원서 접수', who: '평가원 · 교육청', g: [12] },
    { m: 9, t: '9월 수능 모의평가', who: '한국교육과정평가원', g: [12] },
    { m: 9, t: '수시 모집 원서접수', who: '각 대학', g: [12] },
    { m: 9, t: '9월 교육청 학력평가', who: '인천시교육청', g: [10, 11] },
    { m: 10, t: '2학기 중간고사 · 10월 학력평가', who: '학교 · 교육청', g: [10, 11, 12] },
    { m: 11, t: '대학수학능력시험(셋째 목요일)', who: '한국교육과정평가원', g: [12] },
    { m: 11, t: '11월 교육청 학력평가', who: '경기도교육청', g: [10, 11] },
    { m: 12, t: '수능 성적 통지 · 수시 합격자 발표', who: '평가원 · 각 대학', g: [12] },
    { m: 12, t: '2학기 기말고사', who: '학교', g: [10, 11] },
    { m: 1, t: '정시 모집 원서접수(가·나·다군)', who: '각 대학', g: [12] },
    { m: 2, t: '정시 합격자 발표 · 추가 모집', who: '각 대학', g: [12] }
  ];

  const RES = [
    { g: '수능 · 모의평가', items: [
      ['한국교육과정평가원 수능 홈페이지', 'https://www.suneung.re.kr', '시행 기본계획, 기출문제·정답, 학습 방법 안내'],
      ['EBSi 고교강의', 'https://www.ebsi.co.kr', '수능 연계 교재·무료 강의, 모의고사 등급컷·해설'],
      ['한국교육과정평가원', 'https://www.kice.re.kr', '모의평가·수능 보도자료, 출제 방향'] ] },
    { g: '대입 정보', items: [
      ['대입정보포털 어디가', 'https://www.adiga.kr', '대학별 전형·성적 산출·합격 사례, 전형 일정'],
      ['대학알리미', 'https://www.academyinfo.go.kr', '대학 공시 정보(등록금·취업률·충원율)'],
      ['한국대학교육협의회', 'https://www.kcue.or.kr', '대입 전형 기본사항, 수시·정시 일정'],
      ['한국장학재단', 'https://www.kosaf.go.kr', '국가장학금·학자금 대출 안내'] ] },
    { g: '진로 · 진학 상담(공공)', items: [
      ['서울특별시교육청 진로진학정보센터', 'https://www.jinhak.or.kr', '대입 상담, 학력평가 자료, 진학 설명회'],
      ['커리어넷', 'https://www.career.go.kr', '진로 심리검사, 학과·직업 정보'],
      ['교육부', 'https://www.moe.go.kr', '대입제도 개편(2028학년도) 공식 안내'] ] },
    { g: '학습 자료(공공)', items: [
      ['에듀넷·티-클리어 (KERIS)', 'https://www.edunet.net', '교과 학습 자료, 디지털 교과서'],
      ['한국과학창의재단', 'https://www.kofac.re.kr', '과학·수학 탐구, 영재 교육, 창의 활동'],
      ['사이언스올', 'https://www.scienceall.com', '과학 교양·탐구 보고서 소재'],
      ['RISS 학술연구정보서비스 (KERIS)', 'https://www.riss.kr', '세특·탐구 보고서용 논문 검색'] ] }
  ];

  /* ---------- 고등: 저장 ---------- */
  function hi() {
    const st = MS().st(), kid = MS().kid();
    st.hi = st.hi || {};
    const h = st.hi[kid.id] = st.hi[kid.id] || { plan: [], mock: [], pin: {}, goal: {} };
    h.plan = h.plan || []; h.mock = h.mock || []; h.pin = h.pin || {}; h.goal = h.goal || {};
    return h;
  }
  const save = () => MS().save();
  const todayStr = () => ymd(new Date());

  /* ---------- 고등: 화면 ---------- */
  const NAV = [['home', '🏠', '홈'], ['high/pin', '🎯', '쪽집게'], ['high/plan', '📅', '플래너'], ['high/mock', '📈', '모의고사'], ['high/road', '🗺️', '대입 로드맵'], ['high/res', '📚', '자료실'], ['school', '🏫', '우리 학교'], ['high/consult', '🤝', '컨설팅'], ['settings', '⚙️', '설정']];
  const BNAV = [['home', '🏠', '홈'], ['high/pin', '🎯', '쪽집게'], ['high/plan', '📅', '플래너'], ['high/mock', '📈', '모의고사']];
  const layout = (nav, html) => MS().layout(nav, `<div class="hi">${html}</div>`);
  const hero = (kid) => {
    const s = suneungDate(), d = dday(s, new Date()), ey = examYear(kid);
    const mine = ey === s.getFullYear() + 1;
    return `<div class="card hero hi-hero"><div class="h-top"><div><div class="h-label">${ey}학년도 수능${mine ? '' : ` · 올해 수능까지`} · ${s.getMonth() + 1}월 ${s.getDate()}일 (${DAYN[s.getDay()]})</div><div class="h-title">D-${d}</div><div class="h-unit">${mine ? `${esc(kid.name)}의 수능이에요. 오늘 할 일부터 하나씩.` : `${esc(kid.name)}의 수능(${ey}학년도)까지는 ${Math.round((dday(suneungDate(new Date(s.getFullYear() + (ey - s.getFullYear() - 1), 0, 1)), new Date())) / 30)}개월 남았어요.`}</div></div><span class="badge">${newSystem(kid) ? '통합형 수능(2028~)' : '현행 수능'}</span></div></div>`;
  };
  function home() {
    const kid = MS().kid(), h = hi(), t = todayStr();
    const today = h.plan.filter(p => p.date === t);
    const doneN = today.filter(p => p.done).length;
    const upcoming = h.plan.filter(p => !p.done && p.date > t).sort((a, b) => a.date.localeCompare(b.date)).slice(0, 3);
    const m = new Date().getMonth() + 1;
    const cal = CAL.filter(c => c.g.includes(kid.grade) && (c.m >= m)).slice(0, 2).concat(CAL.filter(c => c.g.includes(kid.grade) && c.m < m)).slice(0, 2);
    const last = h.mock.slice().sort((a, b) => b.date.localeCompare(a.date))[0];
    const pinDone = Object.values(h.pin).filter(Boolean).length, pinAll = SUBJ_H.reduce((n, s) => n + s.pts.length, 0);
    return layout('home', `
      <div class="page-head"><div><h1>${esc(kid.name)}의 수능 플랜</h1><div class="sub">${GL(kid.grade)} · ${ROAD[kid.grade].t}</div></div></div>
      ${hero(kid)}
      <div class="hi-quick">${[['high/pin', '🎯', '쪽집게', `${pinDone}/${pinAll}`], ['high/plan', '📅', '플래너', `오늘 ${doneN}/${today.length}`], ['high/mock', '📈', '모의고사', last ? `${last.name.slice(0, 6)}` : '기록 없음'], ['high/res', '📚', '자료실', '공식 링크']].map(([h, i, n, s]) => `<a class="hi-q" href="#${h}"><span class="hi-q-i">${i}</span><b>${n}</b><small>${esc(s)}</small></a>`).join('')}</div>
      <div class="card mt12"><div class="card-head"><h2>오늘 할 일</h2><a class="more" href="#high/plan">플래너 ›</a></div>
        ${today.length ? `<div class="hi-todo">${today.map(p => `<label class="hi-td ${p.done ? 'done' : ''}"><input type="checkbox" data-act="hiDone" data-id="${p.id}" ${p.done ? 'checked' : ''}><span class="hi-td-s" style="--sc:${(SUBJ_H.find(s => s.k === p.subj) || {}).c || '#666'}">${esc((SUBJ_H.find(s => s.k === p.subj) || { n: '기타' }).n)}</span><span class="hi-td-t">${esc(p.title)}</span></label>`).join('')}</div>` : `<div class="empty small"><div class="e-ico">📝</div>오늘 계획이 비어 있어요. 과목·할 일을 30초 안에 등록해 보세요.<div class="mt8"><button class="btn btn-sm btn-primary" data-act="hiAdd">+ 오늘 할 일</button></div></div>`}
        ${upcoming.length ? `<div class="xs muted mt8">다음: ${upcoming.map(p => `${p.date.slice(5).replace('-', '/')} ${esc(p.title)}`).join(' · ')}</div>` : ''}
      </div>
      <div class="hi-consult-anchor"></div>
      <div class="card mt12"><div class="card-head"><h2>다가오는 대입 일정</h2><a class="more" href="#high/road">캘린더 ›</a></div><div class="hi-cal">${cal.map(c => `<div class="hi-cal-r"><b>${c.m}월</b><span>${esc(c.t)}<small>${esc(c.who)}</small></span></div>`).join('')}</div><p class="xs muted mt8">일반적인 시기이며 정확한 날짜는 주관 기관 공지로 확정됩니다.</p></div>
      <div class="card mt12 hi-tip"><b>💡 ${['모의고사 등급은 숫자보다 "틀린 이유"가 자산이에요. 오늘 오답 3개만 원인을 적어 두세요.', '수능은 11월 셋째 목요일. 매주 같은 요일·같은 시간에 모의고사 1회분을 풀면 몸이 시험 시간을 기억합니다.', '수시 6장·정시 3장. 지원 카드는 숫자가 정해져 있으니 "가고 싶은 곳"과 "갈 수 있는 곳"을 나눠 적어 보세요.', 'EBS 연계는 지문 암기가 아니라 소재·주제 익히기예요. 낯선 지문처럼 다시 읽는 훈련이 점수를 만듭니다.'][new Date().getDate() % 4]}</b></div>`);
  }
  function pin() {
    const kid = MS().kid(), h = hi(), nw = newSystem(kid);
    const open = MS().st()._hiPin || SUBJ_H[0].k;
    return layout('high/pin', `
      <div class="page-head"><div><h1>쪽집게 체크리스트</h1><div class="sub">${examYear(kid)}학년도 ${nw ? '통합형' : '현행'} 수능 기준 · 과목별 출제 구조와 꼭 지킬 것</div></div></div>
      <div class="chips scroll-x hi-sub">${SUBJ_H.map(s => `<button class="chip ${s.k === open ? 'on' : ''}" data-act="hiPinTab" data-k="${s.k}" style="--sc:${s.c}">${s.ic} ${s.n} <span class="xs">${s.pts.filter((_, i) => h.pin[s.k + i]).length}/${s.pts.length}</span></button>`).join('')}</div>
      ${SUBJ_H.filter(s => s.k === open).map(s => `<div class="card" style="--sc:${s.c}"><div class="card-head"><h2>${s.ic} ${s.n}</h2><span class="xs muted">${s.pts.filter((_, i) => h.pin[s.k + i]).length}/${s.pts.length} 실천 중</span></div>
        <div class="hi-struct"><div class="c-t">출제 구조</div>${esc(nw ? s.nxt : s.cur)}${nw ? `<div class="xs muted mt4">현행(~2027학년도): ${esc(s.cur)}</div>` : `<div class="xs muted mt4">2028학년도부터: ${esc(s.nxt)}</div>`}</div>
        <div class="hi-pins">${s.pts.map((p, i) => `<label class="hi-pin ${h.pin[s.k + i] ? 'on' : ''}"><input type="checkbox" data-act="hiPin" data-k="${s.k + i}" ${h.pin[s.k + i] ? 'checked' : ''}><span>${esc(p)}</span></label>`).join('')}</div>
        <div class="row mt12" style="gap:8px"><button class="btn btn-sm" data-act="hiAdd" data-subj="${s.k}">📅 이 과목 할 일 추가</button><a class="btn btn-sm btn-ghost" href="https://www.ebsi.co.kr" target="_blank" rel="noopener">EBSi ↗</a><a class="btn btn-sm btn-ghost" href="https://www.suneung.re.kr" target="_blank" rel="noopener">평가원 기출 ↗</a></div></div>`).join('')}
      <p class="xs muted mt12">출제 구조는 한국교육과정평가원 시행 기본계획과 교육부 2028학년도 대입제도 개편안을 바탕으로 정리했고, 체크리스트는 맘쌤이 작성한 학습 전략입니다. 기출문제·교재 원문은 저작권이 각 기관에 있어 링크로만 안내합니다.</p>`);
  }
  function plan() {
    const h = hi(), t = todayStr(); const st = MS().st();
    const base = new Date(); const mon = new Date(base); mon.setDate(base.getDate() - ((base.getDay() + 6) % 7) + 7 * (st._hiWk || 0));
    const days = [...Array(7)].map((_, i) => { const d = new Date(mon); d.setDate(mon.getDate() + i); return ymd(d); });
    const byDay = days.map(ds => h.plan.filter(p => p.date === ds));
    const sel = st._hiDay && days.includes(st._hiDay) ? st._hiDay : (days.includes(t) ? t : days[0]);
    const list = h.plan.filter(p => p.date === sel);
    const S = (k) => SUBJ_H.find(s => s.k === k) || { n: '기타', c: '#667' };
    return layout('high/plan', `
      <div class="page-head"><div><h1>플래너</h1><div class="sub">과목·할 일·날짜만 적고 체크. 끝낸 일은 연속 기록에 쌓여요.</div></div><button class="btn btn-primary" data-act="hiAdd" data-date="${sel}">+ 할 일</button></div>
      <div class="card"><div class="row between"><button class="btn btn-sm btn-ghost" data-act="hiWk" data-d="-1">‹ 지난주</button><b>${mon.getMonth() + 1}월 ${mon.getDate()}일 주</b><button class="btn btn-sm btn-ghost" data-act="hiWk" data-d="1">다음주 ›</button></div>
        <div class="week hi-week mt8">${days.map((ds, i) => { const L = byDay[i]; const done = L.length && L.every(p => p.done); return `<button class="day ${ds === t ? 'today' : ''} ${ds === sel ? 'sel' : ''} ${done ? 'done' : ''}" data-act="hiDay" data-d="${ds}"><span class="d-w">${DAYN[(i + 1) % 7]}</span><span class="d-n">${+ds.slice(8)}</span><span class="d-l">${L.length ? `${L.filter(p => p.done).length}/${L.length}` : '–'}</span></button>`; }).join('')}</div></div>
      <div class="card mt12"><div class="card-head"><h2>${sel === t ? '오늘' : sel.slice(5).replace('-', '/')} 할 일</h2><span class="xs muted">${list.filter(p => p.done).length}/${list.length}</span></div>
        ${list.length ? `<div class="hi-todo">${list.map(p => `<label class="hi-td ${p.done ? 'done' : ''}"><input type="checkbox" data-act="hiDone" data-id="${p.id}" ${p.done ? 'checked' : ''}><span class="hi-td-s" style="--sc:${S(p.subj).c}">${esc(S(p.subj).n)}</span><span class="hi-td-t">${esc(p.title)}${p.min ? `<small> · ${p.min}분</small>` : ''}</span><button class="hi-td-x" data-act="hiDel" data-id="${p.id}" aria-label="삭제">✕</button></label>`).join('')}</div>` : '<div class="empty small"><div class="e-ico">📝</div>이 날 계획이 없어요.</div>'}
      </div>
      <div class="card mt12"><div class="card-head"><h2>자주 쓰는 할 일</h2></div><div class="chips">${['국어 모의고사 1회분', '수학 4점 문항 10개', '영어 독해 10문항 20분', '오답 원인 3개 적기', '한국사 기출 1회', '탐구 개념 1단원', 'EBS 연계 문학 2작품'].map(q => `<button class="chip" data-act="hiQuick" data-q="${esc(q)}" data-date="${sel}">+ ${q}</button>`).join('')}</div></div>`);
  }
  function mock() {
    const h = hi(), kid = MS().kid();
    const rows = h.mock.slice().sort((a, b) => a.date.localeCompare(b.date));
    const ks = ['kor', 'math', 'eng', 'his', 'soc', 'sci'];
    const S = (k) => SUBJ_H.find(s => s.k === k);
    const last = rows[rows.length - 1], prev = rows[rows.length - 2];
    return layout('high/mock', `
      <div class="page-head"><div><h1>모의고사 기록</h1><div class="sub">등급을 적어 두면 추이가 보여요. 오답 원인은 플래너에 할 일로 남기세요.</div></div><button class="btn btn-primary" data-act="hiMockAdd">+ 기록</button></div>
      ${last ? `<div class="grid g3 hi-mock-sum">${ks.filter(k => last.g[k]).map(k => { const d = prev && prev.g[k] ? last.g[k] - prev.g[k] : 0; return `<div class="tile" style="--sc:${S(k).c}"><div class="t-label">${S(k).ic} ${S(k).n}</div><div class="t-val">${last.g[k]}<small>등급</small></div><div class="xs ${d < 0 ? 'up' : d > 0 ? 'down' : 'muted'}">${d < 0 ? `▲ ${-d}등급 상승` : d > 0 ? `▼ ${d}등급 하락` : prev ? '유지' : '첫 기록'}</div></div>`; }).join('')}</div>` : ''}
      <div class="card mt12"><div class="card-head"><h2>기록 ${rows.length}회</h2></div>
        ${rows.length ? `<div class="hi-mock-tbl"><table><thead><tr><th>시험</th>${ks.map(k => `<th>${S(k).n.slice(0, 2)}</th>`).join('')}<th></th></tr></thead><tbody>${rows.slice().reverse().map(r => `<tr><td><b>${esc(r.name)}</b><br><small class="muted">${r.date}</small></td>${ks.map(k => `<td>${r.g[k] || '–'}</td>`).join('')}<td><button class="btn btn-sm btn-ghost" data-act="hiMockDel" data-id="${r.id}">✕</button></td></tr>`).join('')}</tbody></table></div>` : '<div class="empty small"><div class="e-ico">📈</div>아직 기록이 없어요. 3·6·9·11월 학력평가와 6·9월 모의평가를 적어 보세요.</div>'}
      </div>
      <div class="card mt12"><div class="card-head"><h2>등급컷·해설은 어디서?</h2></div><div class="row" style="gap:8px;flex-wrap:wrap"><a class="btn btn-sm" href="https://www.ebsi.co.kr" target="_blank" rel="noopener">EBSi 등급컷·해설 ↗</a><a class="btn btn-sm" href="https://www.suneung.re.kr" target="_blank" rel="noopener">평가원 모의평가 ↗</a><a class="btn btn-sm" href="https://www.jinhak.or.kr" target="_blank" rel="noopener">교육청 학력평가 ↗</a></div><p class="xs muted mt8">시험지·해설 원문은 저작권이 각 기관에 있어 맘쌤은 링크만 제공합니다.</p></div>`);
  }
  function road() {
    const kid = MS().kid(); const st = MS().st(); const g = +(st._hiRoadG || kid.grade);
    const m = new Date().getMonth() + 1;
    const cal = CAL.filter(c => c.g.includes(g));
    const ordered = cal.filter(c => c.m >= m).concat(cal.filter(c => c.m < m));
    return layout('high/road', `
      <div class="page-head"><div><h1>대입 로드맵 · 캘린더</h1><div class="sub">학년별로 이번 해에 해야 할 것과 연간 일정</div></div></div>
      <div class="chips hi-sub">${[10, 11, 12].map(x => `<button class="chip ${x === g ? 'on' : ''}" data-act="hiRoadG" data-g="${x}">${GS(x)}${x === kid.grade ? ' ●' : ''}</button>`).join('')}</div>
      <div class="card"><div class="card-head"><h2>${ROAD[g].t}</h2></div><ol class="steps">${ROAD[g].items.map(t => `<li><span>${esc(t)}</span></li>`).join('')}</ol></div>
      <div class="card mt12"><div class="card-head"><h2>연간 일정</h2><span class="xs muted">${m}월부터</span></div><div class="hi-cal">${ordered.map(c => `<div class="hi-cal-r ${c.m === m ? 'now' : ''}"><b>${c.m}월</b><span>${esc(c.t)}<small>${esc(c.who)}</small></span></div>`).join('')}</div><p class="xs muted mt8">일반적인 시기를 정리한 것이며, 정확한 날짜는 평가원·대교협·각 대학·교육청의 공식 공지로 확정됩니다.</p></div>
      <div class="card mt12"><div class="card-head"><h2>전형 한눈에</h2></div><div class="hi-types">${[['수시 · 학생부교과', '내신 성적 중심. 수능 최저학력기준이 있는 대학이 많다.'], ['수시 · 학생부종합', '학생부 전체(교과+세특+활동)를 정성 평가. 서류·면접.'], ['수시 · 논술', '대학별 논술고사 + 일부 교과. 수능 최저 적용 대학 다수.'], ['정시 · 수능 위주', '수능 성적으로 가·나·다군 3회 지원. 12월 말~1월 초 원서.']].map(([t, d]) => `<div class="hi-type"><b>${t}</b><span>${d}</span></div>`).join('')}</div><p class="xs muted mt8">수시는 최대 6회, 정시는 3회 지원. 수시 합격(추가합격 포함) 시 정시 지원 불가. 대학별 세부 기준은 <a href="https://www.adiga.kr" target="_blank" rel="noopener">어디가</a>에서 확인하세요.</p></div>`);
  }
  function res() {
    return layout('high/res', `
      <div class="page-head"><div><h1>공식 자료실</h1><div class="sub">평가원·EBS·교육청·대교협 등 공공 기관의 자료로 바로 연결합니다.</div></div></div>
      ${RES.map(G => `<div class="card mt12"><div class="card-head"><h2>${G.g}</h2></div><div class="list">${G.items.map(([n, u, d]) => `<a class="li" href="${u}" target="_blank" rel="noopener" style="color:inherit"><div class="li-ico">🔗</div><div class="li-main"><div class="li-t">${esc(n)}</div><div class="li-s">${esc(d)}</div></div><span class="muted">↗</span></a>`).join('')}</div></div>`).join('')}
      <p class="xs muted mt12">각 사이트의 자료 저작권은 해당 기관에 있습니다. 맘쌤은 자료를 복제하지 않고 공식 페이지로 연결만 합니다. 링크는 기관 사정에 따라 바뀔 수 있어요.</p>`);
  }
  function consult() {
    return layout('high/consult', `
      <div class="page-head"><div><h1>대입 컨설팅 · 학원 찾기</h1><div class="sub">광고 지면과, 상담 업체를 고를 때 확인할 것</div></div></div>
      <div class="hi-consult-anchor"></div>
      <div class="card mt12"><div class="card-head"><h2>컨설팅·학원 고르기 체크리스트</h2></div><ul class="warn-list">${['학원·교습소 등록번호가 있는지(학원법에 따라 유료 진학 상담도 등록 대상). 교육청 "학원 정보 공개"에서 조회 가능', '"합격 보장", "100% 합격" 같은 표현은 표시·광고법상 허위·과장 광고 소지. 이런 문구를 쓰는 곳은 피하기', '계약서에 환불 규정, 상담 횟수·시간, 담당자가 명시되어 있는지', '학생부 대필·허위 기재를 권하는 곳은 즉시 거절(입학 취소 사유)', '공공 상담(교육청 진로진학센터, 어디가 상담)을 먼저 받아 보고 비교하기'].map(t => `<li>${t}</li>`).join('')}</ul></div>
      <div class="card mt12"><div class="card-head"><h2>무료 공공 상담</h2></div><div class="list">${[['서울특별시교육청 진로진학정보센터', 'https://www.jinhak.or.kr', '대입 상담 예약, 설명회'], ['대입정보포털 어디가 상담', 'https://www.adiga.kr', '대학 입학사정관·교사 온라인 상담']].map(([n, u, d]) => `<a class="li" href="${u}" target="_blank" rel="noopener" style="color:inherit"><div class="li-ico">🏛️</div><div class="li-main"><div class="li-t">${n}</div><div class="li-s">${d}</div></div><span class="muted">↗</span></a>`).join('')}</div></div>
      <div class="card mt12 hi-adv"><div class="card-head"><h2>📣 컨설턴트·학원·인강 광고주 안내</h2></div><p class="small">고등 화면(홈·컨설팅 페이지)은 수능·대입을 준비하는 학생과 학부모가 매일 보는 지면입니다. 광고는 "AD" 표시와 함께 콘텐츠와 구분해 노출되며, 맘쌤은 상담을 직접 제공하거나 광고주를 보증하지 않습니다.</p><div class="row mt8" style="gap:8px"><a class="btn btn-primary" href="#ads?slot=high_consult">광고 문의하기</a><a class="btn btn-ghost" href="#legal">광고·개인정보 안내</a></div></div>`);
  }
  function legal() {
    return MS().layout('settings', `
      <div class="page-head"><div><h1>저작권 · 광고 · 개인정보 안내</h1><div class="sub">맘쌤을 안전하게 운영하기 위한 기준</div></div></div>
      <div class="card"><h2>저작권</h2><p class="small mt8">수업 카드·체크리스트·문제는 맘쌤이 직접 작성한 자료입니다. 평가원·EBS·교육청·대교협·KERIS·한국과학창의재단 등 외부 기관의 자료(기출문제, 교재, 영상, 통계)는 복제하지 않고 공식 페이지로 연결만 하며, 그 저작권은 각 기관에 있습니다. 유튜브 영상은 각 채널의 저작물로 유튜브 공식 플레이어를 통해 재생합니다. 교육과정 정보는 교육부 고시를 바탕으로 요약했습니다.</p></div>
      <div class="card mt12"><h2>광고</h2><p class="small mt8">광고는 콘텐츠와 구분되도록 "AD" 표시를 붙여 노출합니다. 맘쌤은 광고주의 서비스를 보증하지 않으며, 유료 입시 상담·학원은 학원법상 등록 대상이므로 이용 전 등록 여부를 확인하시기 바랍니다. "합격 보장" 등 표시·광고법에 어긋나는 문구의 광고는 게재하지 않습니다. 중학생 본인 모드에는 광고를 싣지 않습니다.</p></div>
      <div class="card mt12"><h2>개인정보</h2><p class="small mt8">학습 기록·이름·학년은 이 기기의 브라우저에만 저장되며 서버로 전송되지 않습니다. 광고 문의 폼으로 보내 주신 연락처는 문의 응대 목적으로만 사용하고, 응대 완료 후 1년 이내 파기합니다. 우리 학교 기능은 나이스 교육정보 개방 포털의 공개 정보(급식·학사일정)를 사용합니다.</p></div>
      <div class="card mt12"><h2>면책</h2><p class="small mt8">대입 일정·전형 정보는 일반적인 내용을 정리한 것으로, 정확한 내용은 평가원·대교협·각 대학의 공식 공지를 기준으로 합니다. 맘쌤은 입시 결과에 대해 책임지지 않습니다.</p></div>`);
  }
  function page(a) {
    if (!isHigh()) return home();
    switch (a[1]) { case 'pin': return pin(); case 'plan': return plan(); case 'mock': return mock(); case 'road': return road(); case 'res': return res(); case 'consult': return consult(); default: return home(); }
  }
  function more() {
    MS().modal(`<h2>더보기</h2><div class="list">${[['high/road', '🗺️', '대입 로드맵 · 캘린더', '학년별 할 일과 연간 일정'], ['high/res', '📚', '공식 자료실', '평가원·EBSi·어디가·교육청'], ['high/consult', '🤝', '컨설팅 · 학원', '고르기 체크리스트 · 광고 문의'], ['school', '🏫', '우리 학교', '급식 · 학사일정 · 시험 D-day · 시간표'], ['settings', '⚙️', '설정', '학생 정보 · 백업'], ['legal', '📄', '저작권·광고·개인정보', '운영 기준 안내']].map(([t, s, a, e]) => `<a class="li" href="#${t}" style="color:inherit"><div class="li-ico">${s}</div><div class="li-main"><div class="li-t">${a}</div><div class="li-s">${e}</div></div><span class="muted">›</span></a>`).join('')}</div>`);
  }

  /* ---------- 고등: 입력 모달 ---------- */
  function addModal(opt) {
    opt = opt || {};
    MS().modal(`<h2>할 일 추가</h2><form id="hiAddForm" class="stack" style="gap:10px">
      <div class="field"><label>과목</label><div class="chips" id="hiSubj">${SUBJ_H.map(s => `<button type="button" class="chip ${s.k === (opt.subj || 'kor') ? 'on' : ''}" data-k="${s.k}" style="--sc:${s.c}">${s.ic} ${s.n}</button>`).join('')}<button type="button" class="chip ${opt.subj === 'etc' ? 'on' : ''}" data-k="etc">기타</button></div></div>
      <div class="field"><label>할 일</label><input class="input" name="title" required maxlength="40" placeholder="예: 수학 4점 문항 10개" value="${esc(opt.q || '')}"></div>
      <div class="form-grid"><div class="field"><label>날짜</label><input class="input" type="date" name="date" value="${opt.date || todayStr()}"></div><div class="field"><label>예상 시간(분)</label><input class="input" type="number" name="min" min="5" max="300" step="5" placeholder="30"></div></div>
      <div class="modal-actions"><button class="btn btn-ghost" type="button" data-act="hiClose">취소</button><button class="btn btn-primary" type="submit">추가</button></div></form>`, (m) => {
      m.querySelector('#hiSubj').addEventListener('click', e => { const b = e.target.closest('[data-k]'); if (!b) return; m.querySelectorAll('#hiSubj .chip').forEach(c => c.classList.remove('on')); b.classList.add('on'); });
      m.querySelector('#hiAddForm').addEventListener('submit', e => {
        e.preventDefault(); const f = new FormData(e.target); const subj = (m.querySelector('#hiSubj .chip.on') || {}).dataset?.k || 'etc';
        hi().plan.push({ id: uid(), subj, title: String(f.get('title') || '').trim(), date: f.get('date') || todayStr(), min: +f.get('min') || 0, done: false, created: todayStr() });
        save(); MS().close(); MS().st()._hiDay = f.get('date') || todayStr(); MS().render(); MS().toast('추가했어요');
      });
    });
  }
  function mockModal() {
    const ks = ['kor', 'math', 'eng', 'his', 'soc', 'sci'];
    MS().modal(`<h2>모의고사 기록</h2><form id="hiMockForm" class="stack" style="gap:10px">
      <div class="form-grid"><div class="field"><label>시험 이름</label><input class="input" name="name" required maxlength="20" placeholder="예: 9월 모의평가"></div><div class="field"><label>날짜</label><input class="input" type="date" name="date" value="${todayStr()}"></div></div>
      <div class="hi-mock-in">${ks.map(k => { const s = SUBJ_H.find(x => x.k === k); return `<div class="field"><label>${s.ic} ${s.n}</label><select class="input" name="${k}"><option value="">–</option>${[1, 2, 3, 4, 5, 6, 7, 8, 9].map(g => `<option value="${g}">${g}등급</option>`).join('')}</select></div>`; }).join('')}</div>
      <div class="modal-actions"><button class="btn btn-ghost" type="button" data-act="hiClose">취소</button><button class="btn btn-primary" type="submit">저장</button></div></form>`, (m) => {
      m.querySelector('#hiMockForm').addEventListener('submit', e => {
        e.preventDefault(); const f = new FormData(e.target); const g = {}; ks.forEach(k => { if (f.get(k)) g[k] = +f.get(k); });
        hi().mock.push({ id: uid(), name: String(f.get('name') || '').trim(), date: f.get('date') || todayStr(), g });
        save(); MS().close(); MS().render(); MS().toast('저장했어요');
      });
    });
  }

  /* ---------- 초등: 모바일 압축 홈 ---------- */
  function compactHome(a) {
    if (a[0] !== 'home' || !isMobile() || isHigh()) return;
    const wrap = document.querySelector('.wrap'); if (!wrap || wrap.querySelector('.home-more')) return;
    const kid = MS().kid(); if (!kid || kid.grade >= 7) return;
    const hero = wrap.querySelector('.tt-hero, .card.hero'); if (!hero) return;
    const st = MS().st();
    // 엄마들이 매일 찾는 기능 6개를 히어로 바로 아래 한 줄로
    const quick = document.createElement('div'); quick.className = 'home-quick';
    quick.innerHTML = [['lessons', '📖', '수업 준비'], ['sheets', '📝', '워크시트'], ['videos', '🎬', '개념 영상'], ['chat', '💬', '엄마 도우미'], ['records', '📊', '기록'], ['school', '🏫', '우리 학교']].map(([h, i, n]) => `<a href="#${h}"><span class="hq-i">${i}</span><span>${n}</span></a>`).join('');
    const adTop = hero.nextElementSibling && hero.nextElementSibling.classList.contains('ad-slot') ? hero.nextElementSibling : null;
    (adTop || hero).insertAdjacentElement('afterend', quick);
    // 과목별 이어서 학습은 위로
    const sp = wrap.querySelector('.sp-home'); if (sp) quick.insertAdjacentElement('afterend', sp);
    const adMid = wrap.querySelector('.ad-home_mid'); if (adMid && sp) sp.insertAdjacentElement('afterend', adMid);
    // 학습 알(재미 요소)은 접어 두기
    const fun = wrap.querySelector('.fun-card');
    if (fun) { const d = document.createElement('details'); d.className = 'home-fold home-fun'; if (st._homeFun) d.open = true; d.innerHTML = `<summary>🥚 ${esc(kid.name)}의 학습 알 · 오늘의 미션 <span class="xs muted">${(fun.querySelector('.fun-ms-h') || {}).textContent || ''}</span></summary>`; fun.insertAdjacentElement('beforebegin', d); d.appendChild(fun); d.addEventListener('toggle', () => { st._homeFun = d.open; save(); }); }
    // 나머지 카드는 '더 보기'로
    const rest = [...wrap.children].filter(el => !el.matches('.page-head, .tt-hero, .card.hero, .ad-slot, .home-quick, .sp-home, .home-fun, .row:last-child') && !el.querySelector('.ad-slot'));
    if (rest.length) { const d = document.createElement('details'); d.className = 'home-fold home-more'; if (st._homeMore) d.open = true; d.innerHTML = `<summary>더 보기 <span class="xs muted">우리 학교 · 연속 학습 · 시간표 · 문제집 · 워크시트 · 보충 단원</span></summary>`; const after = wrap.querySelector('.home-fun') || sp || quick; after.insertAdjacentElement('afterend', d); rest.forEach(el => d.appendChild(el)); d.addEventListener('toggle', () => { st._homeMore = d.open; save(); }); }
  }

  /* ---------- 공통 후처리 ---------- */
  function after(a) {
    const high = isHigh();
    document.body.classList.toggle('is-high', high);
    if (a[0] === 'ob') { const lv = MS().st()._lv; document.body.dataset.lv = lv || ''; const left = document.querySelector('.ob-left'); if (left && lv === 'e' && !left.querySelector('[data-act="pickLv"]')) left.insertAdjacentHTML('beforeend', '<button class="btn btn-ghost btn-sm" data-act="pickLv" data-lv="" style="color:#fff;align-self:flex-start;margin-top:auto">← 학교급 다시 고르기</button>'); if (lv === 'h' || lv === 'm') { const f = document.querySelector('#obForm'); if (f) { const h2 = f.querySelector('h2'); if (h2 && /아이 정보를/.test(h2.textContent)) h2.textContent = lv === 'h' ? '학생 정보를 알려 주세요' : '내 정보를 알려 주세요'; f.querySelectorAll('label').forEach(l => { if (/아이 이름/.test(l.textContent)) l.textContent = lv === 'h' ? '학생 이름 또는 별명' : '이름 또는 별명'; if (/수업 요일/.test(l.textContent)) l.textContent = '공부하는 요일'; if (/수업 시간/.test(l.textContent)) l.textContent = '하루 공부 시간'; if (/출판사/.test(l.textContent) && lv === 'h') l.closest('.field').style.display = 'none'; }); } } return; }
    if (high) {
      document.querySelectorAll('.brand-sub').forEach(x => x.textContent = '수능·대입 쪽집게');
      const ok = ['home', 'high', 'school', 'settings', 'editkid', 'addkid', 'ads', 'legal', 'guide'];
      if (!ok.includes(a[0])) { setTimeout(() => MS().go('home'), 0); return; }
      document.title = '맘쌤 · 수능·대입 쪽집게';
    }
    compactHome(a);
  }

  /* ---------- 이벤트 ---------- */
  document.addEventListener('click', e => {
    const b = e.target.closest('[data-act]'); if (!b) return;
    const act = b.dataset.act; const st = MS().st();
    const H = {
      pickLv() { st._lv = b.dataset.lv || null; save(); MS().render(); window.scrollTo(0, 0); },
      hiAdd() { addModal({ subj: b.dataset.subj, date: b.dataset.date }); },
      hiQuick() { const q = b.dataset.q; const subj = /국어|문학/.test(q) ? 'kor' : /수학/.test(q) ? 'math' : /영어/.test(q) ? 'eng' : /한국사/.test(q) ? 'his' : /탐구/.test(q) ? 'sci' : 'etc'; hi().plan.push({ id: uid(), subj, title: q, date: b.dataset.date || todayStr(), min: 0, done: false, created: todayStr() }); save(); MS().render(); MS().toast('추가했어요'); },
      hiDel() { const h = hi(); h.plan = h.plan.filter(p => p.id !== b.dataset.id); save(); MS().render(); },
      hiDay() { st._hiDay = b.dataset.d; MS().render(); },
      hiWk() { st._hiWk = (st._hiWk || 0) + (+b.dataset.d); st._hiDay = null; MS().render(); },
      hiPinTab() { st._hiPin = b.dataset.k; MS().render(); },
      hiRoadG() { st._hiRoadG = +b.dataset.g; MS().render(); },
      hiMockAdd() { mockModal(); },
      hiMockDel() { const h = hi(); h.mock = h.mock.filter(m => m.id !== b.dataset.id); save(); MS().render(); },
      hiClose() { MS().close(); }
    };
    if (H[act]) { e.preventDefault(); H[act](); }
  });
  document.addEventListener('change', e => {
    const b = e.target.closest('[data-act="hiDone"],[data-act="hiPin"]'); if (!b) return;
    if (b.dataset.act === 'hiDone') { const p = hi().plan.find(p => p.id === b.dataset.id); if (p) { p.done = b.checked; p.doneAt = b.checked ? todayStr() : null; } save(); b.closest('.hi-td') && b.closest('.hi-td').classList.toggle('done', b.checked); if (b.checked) MS().toast('잘했어요! 하나 끝'); }
    else { hi().pin[b.dataset.k] = b.checked; save(); b.closest('.hi-pin') && b.closest('.hi-pin').classList.toggle('on', b.checked); }
  });

  window.HighApp = { isHigh, lvOf, gradesFor, picker, obLeft, page, home, more, after, NAV, BNAV, suneungDate, legal, LV };
})();
