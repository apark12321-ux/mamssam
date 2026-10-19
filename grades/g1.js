/* 맘쌤 — 초등 1학년 수학 (2022 개정) */
(function () {
  const { ri, pick, gcd, lcm, red, shuffle, F, M, fmt, decStr, P, svgWrap, lbl, shapeStyle, dash, table, properCoprime, divisors, roundTo, mixedToImproper } = window.MathGen.h;
  const R = window.MathGen.register;
  window.UNITS = window.UNITS || [];

  /* ---------- 1학년 공통 도구 ---------- */
  const ONES = ['', '하나', '둘', '셋', '넷', '다섯', '여섯', '일곱', '여덟', '아홉'];
  const TENS = ['', '열', '스물', '서른', '마흔', '쉰', '예순', '일흔', '여든', '아흔'];
  const SINO = ['', '일', '이', '삼', '사', '오', '육', '칠', '팔', '구'];
  const ORD = ['', '첫째', '둘째', '셋째', '넷째', '다섯째', '여섯째', '일곱째', '여덟째', '아홉째'];
  const native = (n) => (n === 100 ? '백' : TENS[Math.floor(n / 10)] + ONES[n % 10]);
  const sino = (n) => { if (n === 0) return '영'; if (n === 100) return '백'; const t = Math.floor(n / 10), o = n % 10; return (t ? (t > 1 ? SINO[t] : '') + '십' : '') + SINO[o]; };
  /* 받침 여부 → 조사 붙이기 (숫자는 한자어 읽기 기준) */
  const hasB = (x) => {
    const s = String(x).replace(/<[^>]+>/g, '').trim();
    const c = s.charCodeAt(s.length - 1);
    if (c >= 0xAC00 && c <= 0xD7A3) return (c - 0xAC00) % 28 !== 0;
    const m = s.match(/\d+$/);
    if (m) { const n = Number(m[0]); if (n === 0) return true; const d = n % 10; return d ? [1, 3, 6, 7, 8].includes(d) : true; }
    return false;
  };
  const jo = (x, b, nb) => String(x) + (hasB(x) ? b : nb);
  const tl = (h, m) => (m ? `${h}시 30분` : `${h}시`);
  const nextH = (h) => (h % 12) + 1, prevH = (h) => ((h + 10) % 12) + 1;
  const cmpIdx = (a, b) => (a > b ? 0 : a < b ? 1 : 2);
  const CMP = ['&gt;', '&lt;', '='];
  const distinctNums = (k, lo, hi) => { const s = new Set(); while (s.size < k) s.add(ri(lo, hi)); return [...s]; };
  /* 정답 하나 + 오답 후보로 보기 만들기 (중복 제거) */
  const mkChoice = (q, correct, wrongs, n = 4) => {
    const opts = [correct];
    for (const w of shuffle(wrongs)) { if (opts.length >= n) break; if (!opts.includes(w)) opts.push(w); }
    if (opts.length < 2) return null;
    const s = shuffle(opts);
    return P.choice(q, s, s.indexOf(correct));
  };

  const EMO = [['🍎', '사과', '개'], ['🍓', '딸기', '개'], ['🐟', '물고기', '마리'], ['🐥', '병아리', '마리'], ['🚗', '자동차', '대'], ['⭐', '별', '개'], ['🎈', '풍선', '개'], ['🍪', '쿠키', '개'], ['🌷', '꽃', '송이'], ['🐞', '무당벌레', '마리']];
  const row = (e, n) => { let s = ''; for (let i = 0; i < n; i++) { s += e; if (i % 5 === 4 && i < n - 1) s += ' '; } return `<div style="font-size:1.6em;letter-spacing:2px;margin:6px 0;line-height:1.4">${s}</div>`; };
  const KIDS = ['민수', '지아', '서준', '하은', '도윤', '수아', '예준', '지우', '시우', '하린'];

  /* 시계 그림: h시 m분 (m은 0 또는 30) — 짧은바늘은 30분이면 두 숫자 가운데 */
  const clock = (h, m) => {
    const cx = 70, cy = 70, r = 60;
    let s = `<circle cx="${cx}" cy="${cy}" r="${r}" ${shapeStyle}/>`;
    for (let i = 1; i <= 12; i++) {
      const a = i * Math.PI / 6;
      s += `<text x="${(cx + 47 * Math.sin(a)).toFixed(1)}" y="${(cy - 47 * Math.cos(a) + 5).toFixed(1)}" text-anchor="middle" font-size="13" fill="currentColor">${i}</text>`;
    }
    const ha = ((h % 12) * 30 + m * 0.5) * Math.PI / 180, ma = m * 6 * Math.PI / 180;
    const hand = (a, L, w) => `<line x1="${cx}" y1="${cy}" x2="${(cx + L * Math.sin(a)).toFixed(1)}" y2="${(cy - L * Math.cos(a)).toFixed(1)}" stroke="currentColor" stroke-width="${w}" stroke-linecap="round"/>`;
    s += hand(ha, 27, 5) + hand(ma, 43, 2.5) + `<circle cx="${cx}" cy="${cy}" r="3.5" fill="currentColor"/>`;
    return svgWrap(s, 140, 140);
  };

  /* 평면 모양: 0 □, 1 △, 2 ○ */
  const FLAT = ['□ 모양', '△ 모양', '○ 모양'];
  const flat = (t, x, y, sz, rot = 0, ratio = 1) => {
    const tr = rot ? ` transform="rotate(${rot} ${x} ${y})"` : '';
    if (t === 0) { const w = sz, h = Math.round(sz * ratio); return `<rect x="${x - w / 2}" y="${y - h / 2}" width="${w}" height="${h}" ${shapeStyle}${tr}/>`; }
    if (t === 1) return `<polygon points="${x},${(y - sz * 0.55).toFixed(1)} ${(x - sz * 0.55).toFixed(1)},${(y + sz * 0.45).toFixed(1)} ${(x + sz * 0.55).toFixed(1)},${(y + sz * 0.45).toFixed(1)}" ${shapeStyle}${tr}/>`;
    return `<circle cx="${x}" cy="${y}" r="${sz / 2}" ${shapeStyle}/>`;
  };
  const flatPicture = (n) => {
    const types = Array.from({ length: n }, () => ri(0, 2));
    const cnt = [0, 0, 0];
    let s = '';
    types.forEach((t, i) => {
      cnt[t]++;
      const c = i % 5, r = Math.floor(i / 5);
      s += flat(t, 32 + c * 58, 34 + r * 62, ri(28, 40), pick([0, 0, 15, 30, -20, 180]), pick([1, 0.6, 0.8]));
    });
    return { svg: svgWrap(s, 300, n > 5 ? 130 : 70), cnt };
  };

  /* 입체 모양: 0 상자, 1 둥근기둥, 2 공 */
  const SOLID = ['상자 모양', '둥근기둥 모양', '공 모양'];
  const solid = (t, dx) => {
    let s;
    if (t === 0) s = `<polygon points="40,50 140,50 140,110 40,110" ${shapeStyle}/><polygon points="40,50 70,22 170,22 140,50" ${shapeStyle}/><polygon points="140,50 170,22 170,82 140,110" ${shapeStyle}/>`;
    else if (t === 1) s = `<path d="M70 30 L70 100 A35 11 0 0 0 140 100 L140 30" ${shapeStyle}/><ellipse cx="105" cy="30" rx="35" ry="11" ${shapeStyle}/><path d="M70 100 A35 11 0 0 1 140 100" fill="none" ${dash}/>`;
    else s = `<circle cx="105" cy="65" r="48" ${shapeStyle}/><path d="M57 65 A48 14 0 0 0 153 65" fill="none" stroke="currentColor" stroke-width="1.2"/><path d="M57 65 A48 14 0 0 1 153 65" fill="none" ${dash}/>`;
    return svgWrap(`<g transform="translate(${dx} 0)">${s}</g>`, 260, 125);
  };
  const OBJ = [
    ['선물 상자', '주사위', '휴지 상자', '냉장고', '동화책', '지우개', '필통', '벽돌'],
    ['음료수 캔', '딱풀', '두루마리 휴지', '북', '통조림', '연필꽂이', '양초', '분유통'],
    ['축구공', '구슬', '야구공', '지구본', '농구공', '탁구공', '수박', '볼링공']
  ];
  const FOBJ = [
    ['공책', '액자', '창문', '칠판', '손수건', '색종이', '스케치북', '달력'],
    ['삼각김밥', '트라이앵글', '옷걸이', '삼각자', '양보 표지판', '샌드위치 조각', '삼각 깃발'],
    ['동전', '접시', '바퀴', 'CD', '단추', '훌라후프', '시계 테두리', '컵 받침']
  ];

  /* 비교하기 그림 */
  const NAMES3 = ['가', '나', '다'];
  const bars = (lens) => svgWrap(lens.map((L, i) => `${lbl(14, 33 + i * 32, NAMES3[i])}<rect x="30" y="${20 + i * 32}" width="${L}" height="16" rx="3" ${shapeStyle}/>`).join('') + `<line x1="30" y1="10" x2="30" y2="${22 + lens.length * 32}" ${dash}/>`, 260, 28 + lens.length * 32);
  const grids = (a, b, c, d) => {
    const u = 16, y0 = 28; let s = '';
    const g = (x0, w, h) => { let t = ''; for (let i = 0; i < w; i++) for (let j = 0; j < h; j++) t += `<rect x="${x0 + i * u}" y="${y0 + j * u}" width="${u}" height="${u}" ${shapeStyle}/>`; return t; };
    const x2 = 20 + a * u + 40;
    s += lbl(20 + a * u / 2, 18, '가') + g(20, a, b) + lbl(x2 + c * u / 2, 18, '나') + g(x2, c, d);
    return svgWrap(s, x2 + c * u + 20, y0 + Math.max(b, d) * u + 10);
  };
  const seesaw = (L, Rn, leftDown) => {
    const yl = leftDown ? 95 : 55, yr = leftDown ? 55 : 95;
    return svgWrap(`<polygon points="120,75 105,115 135,115" ${shapeStyle}/><line x1="30" y1="${yl}" x2="210" y2="${yr}" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>${lbl(40, yl - 12, L)}${lbl(200, yr - 12, Rn)}`, 240, 125);
  };

  /* ---------- 단원 카드 ---------- */
  window.UNITS.push(
    {
      id: 'g1u1', grade: 1, sem: 1, no: 1, title: '9까지의 수', icon: '🔢',
      lessons: ['1, 2, 3, 4, 5 알아보기', '6, 7, 8, 9 알아보기', '순서를 수로 나타내기', '수의 순서 알아보기', '1만큼 더 큰 수와 1만큼 더 작은 수', '0 알아보기', '수의 크기 비교하기'],
      concept: '물건의 개수를 세어 1~9로 나타내고, "하나·둘·셋"(개수), "일·이·삼"(수 읽기), "첫째·둘째"(순서)를 구별합니다. 아무것도 없으면 0이라 쓰고, 수를 순서대로 셀 때 바로 뒤의 수가 1만큼 더 큰 수입니다.',
      script: [
        '"하나, 둘, 셋…" 소리 내어 세면서 물건을 하나씩 손가락으로 짚거나 옆으로 옮기게 합니다. 이미 센 것과 안 센 것을 나누는 것이 핵심입니다.',
        '"마지막에 센 수가 전체 개수야." 다 센 뒤 "그래서 모두 몇 개?"라고 다시 물어 마지막 수를 말하게 합니다.',
        '인형을 줄 세워 "앞에서 셋째"와 "3개"의 차이를 보여 줍니다. 셋째는 한 개만 가리키고, 3개는 세 개를 모두 가리킵니다.',
        '빈 접시를 보여 주며 "사과가 하나도 없으면 0이라고 써." 0도 수라는 것을 알려 줍니다.'
      ],
      mistakes: [
        '같은 물건을 두 번 세거나 빠뜨림',
        '6과 9, 2와 5 등 숫자를 거꾸로 씀',
        '"셋째"와 "3개"를 같은 뜻으로 생각함',
        '0을 수가 아니라고 생각함'
      ],
      warmup: '계단 숫자 놀이 — 계단을 한 칸씩 오르며 "일, 이, 삼…", 내려오며 "구, 팔, 칠…" 거꾸로 세어 봅니다.',
      check: '"7보다 1만큼 더 큰 수와 1만큼 더 작은 수는 뭘까? 어떻게 알았어?"',
      next: '50까지의 수, 100까지의 수로 넓어지고 2학년 세 자리 수·네 자리 수의 자릿값 개념으로 이어집니다.',
      keywords: ['9까지의수', '수세기', '하나둘셋', '첫째', '둘째', '순서', '영', '1만큼더큰수', '1만큼더작은수', '숫자쓰기', '숫자읽기']
    },
    {
      id: 'g1u2', grade: 1, sem: 1, no: 2, title: '여러 가지 모양', icon: '📦',
      lessons: ['생활 속에서 여러 가지 모양 찾기', '같은 모양끼리 모으기', '모양의 특징 알아보기 (쌓기·굴리기)', '여러 가지 모양으로 만들기', '만든 모양에서 사용한 모양 세기'],
      concept: '물건을 상자 모양, 둥근기둥 모양, 공 모양으로 나눕니다. 상자 모양은 평평한 면과 뾰족한 곳이 있어 잘 쌓이고, 둥근기둥 모양은 눕히면 굴러가고 세우면 쌓을 수 있으며, 공 모양은 어느 쪽으로나 잘 굴러갑니다.',
      script: [
        '집 안의 상자, 음료 캔, 공을 한데 모아 놓고 "같은 모양끼리 모아 볼까?" 하며 분류부터 시작합니다.',
        '"이건 왜 같은 모양이야?" 하고 이유를 말하게 합니다. 색깔이나 크기가 아니라 생김새로 나눈다는 것이 핵심입니다.',
        '직접 쌓아 보고 굴려 봅니다. 공 모양은 쌓기 어렵고, 둥근기둥 모양은 눕히면 굴러가지만 세우면 쌓인다는 것을 몸으로 확인합니다.',
        '눈을 가리고 물건을 만져 보게 한 뒤 "평평한 곳이 있어? 뾰족한 곳은?" 하며 모양을 맞히는 놀이를 합니다.'
      ],
      mistakes: [
        '색깔·크기·쓰임새로 모양을 나눔 (작은 주사위와 큰 냉장고를 다른 모양으로 생각)',
        '둥근기둥 모양과 공 모양을 모두 "둥근 모양"으로 묶음',
        '둥근기둥 모양은 쌓을 수 없다고 생각함 (세우면 쌓을 수 있음)'
      ],
      warmup: '집 안 모양 보물찾기 — 상자 모양, 둥근기둥 모양, 공 모양 물건을 하나씩 찾아와서 같은 모양끼리 줄 세워 봅니다.',
      check: '"두루마리 휴지는 쌓을 수도 있고 굴릴 수도 있어. 왜 그럴까?"',
      next: '1학년 2학기 □·△·○ 평면 모양으로 이어지고, 2학년 쌓기나무, 6학년 각기둥·원기둥·구로 연결됩니다.',
      keywords: ['상자모양', '둥근기둥', '둥근기둥모양', '공모양', '입체모양', '쌓기', '굴리기', '모양분류']
    },
    {
      id: 'g1u3', grade: 1, sem: 1, no: 3, title: '덧셈과 뺄셈', icon: '➕',
      lessons: ['9까지의 수 모으기와 가르기', '덧셈 이야기 만들기', '덧셈식 쓰고 읽기', '덧셈하기', '뺄셈 이야기 만들기', '뺄셈하기', '0을 더하거나 빼기'],
      concept: '두 수를 합치는 모으기가 덧셈(+), 한 수를 둘로 나누는 가르기가 뺄셈(−)의 바탕입니다. 3+2=5는 "3 더하기 2는 5와 같습니다", 5−2=3은 "5 빼기 2는 3과 같습니다"라고 읽습니다.',
      script: [
        '바둑돌 5개를 두 손에 나누어 쥐게 하고 "한 손에 2개면 다른 손엔 몇 개?" 가르기 놀이를 합니다. 가를 수 있는 방법을 모두 찾아보게 합니다.',
        '"합치면 모두 몇 개야?"는 덧셈, "남은 건 몇 개야?"는 뺄셈이라는 것을 장난감을 직접 움직이며 보여 줍니다.',
        '그림을 보고 이야기를 만들게 합니다. "새 3마리가 있었는데 2마리가 더 날아왔어요." 이야기가 식이 된다는 것을 연결합니다.',
        '"사과가 2개 있는데 0개를 더 받으면?" 0을 더하거나 빼도 수가 그대로라는 것을 확인합니다.'
      ],
      mistakes: [
        '=를 "답 쓰는 곳"으로만 생각해 식을 거꾸로 씀',
        '빼는 수와 빼지는 수의 순서를 바꿔 씀 (2−5)',
        '손가락으로 셀 때 처음 수부터 다시 세다가 1 차이가 남',
        '"몇 개 더 많은지"(차이) 묻는 문제를 덧셈으로 품'
      ],
      warmup: '가르기 손놀이 — 엄마가 공깃돌 7개를 두 손에 나눠 쥐고 한 손을 펴 보이면, 아이가 다른 손에 몇 개 있는지 맞힙니다.',
      check: '"6을 두 수로 가르는 방법을 모두 말해 볼래? 그걸로 덧셈식도 만들 수 있을까?"',
      next: '2학기 덧셈과 뺄셈(1)~(3)에서 두 자리 수, 10 만들기, 받아올림으로 이어지고 2학년 두 자리 수 덧셈·뺄셈의 기초가 됩니다.',
      keywords: ['모으기', '가르기', '덧셈', '뺄셈', '더하기', '빼기', '덧셈식', '뺄셈식', '0더하기', '0빼기']
    },
    {
      id: 'g1u4', grade: 1, sem: 1, no: 4, title: '비교하기', icon: '⚖️',
      lessons: ['길이 비교하기', '무게 비교하기', '넓이 비교하기', '담을 수 있는 양 비교하기', '세 가지 비교하기'],
      concept: '두 가지를 비교할 때는 "더 길다/더 짧다", "더 무겁다/더 가볍다", "더 넓다/더 좁다", "더 많다/더 적다"로 말하고, 세 가지를 비교할 때는 "가장"을 씁니다. 길이는 한쪽 끝을 맞추어 비교하는 것이 핵심입니다.',
      script: [
        '연필 두 자루를 끝을 맞추지 않고 놓은 뒤 "어느 게 더 길어?" 물어봅니다. 끝을 맞춰야 정확히 비교할 수 있다는 것을 스스로 발견하게 합니다.',
        '양손에 물건을 하나씩 들고 "어느 쪽이 더 무겁게 느껴져?" 손 저울 놀이를 합니다. 크다고 꼭 무거운 것은 아니라는 것(풍선과 돌)도 보여 줍니다.',
        '종이 두 장을 겹쳐 보고 남는 부분이 있는 쪽이 더 넓다는 것을 확인합니다.',
        '모양이 다른 그릇 두 개에 물을 가득 담고, 같은 컵으로 옮겨 몇 컵인지 세어 담을 수 있는 양을 비교합니다.'
      ],
      mistakes: [
        '끝을 맞추지 않고 길이를 비교함',
        '크기가 큰 것이 무조건 더 무겁다고 생각함',
        '그릇 모양이 다른데 물의 높이만 보고 양을 판단함',
        '세 가지를 비교할 때 "더"와 "가장"을 섞어 씀'
      ],
      warmup: '가족 키 줄 세우기 — 등을 맞대고 서서 누가 더 큰지 비교한 뒤, 가장 큰 사람부터 순서대로 서 봅니다.',
      check: '"이 줄넘기 두 개 중에 어느 게 더 긴지 어떻게 알 수 있을까?"',
      next: '2학년 길이 재기(cm, m)에서 단위로 재는 활동으로 이어지고, 3학년 들이와 무게(L, kg)의 바탕이 됩니다.',
      keywords: ['비교하기', '더길다', '더짧다', '무겁다', '가볍다', '넓다', '좁다', '담을수있는양', '시소', '길이비교', '무게비교']
    },
    {
      id: 'g1u5', grade: 1, sem: 1, no: 5, title: '50까지의 수', icon: '🔟',
      lessons: ['10 알아보기', '십몇 알아보기', '19까지의 수 모으기와 가르기', '10개씩 묶어 세기', '50까지의 수 세기', '50까지 수의 순서', '수의 크기 비교하기'],
      concept: '9보다 1만큼 더 큰 수가 10입니다. 35는 "10개씩 묶음 3개와 낱개 5개"처럼 10개씩 묶어 세고, "삼십오", "서른다섯" 두 가지로 읽습니다.',
      script: [
        '면봉 23개를 흩어 놓고 "하나씩 세면 힘드니까 10개씩 고무줄로 묶어 볼까?" 묶음과 낱개로 나누게 합니다.',
        '"10개씩 묶음이 2개, 낱개가 3개면 23이야." 묶음 수가 앞자리, 낱개 수가 뒷자리라는 것을 연결합니다.',
        '"이십삼, 스물셋" 두 가지 읽는 방법을 함께 연습합니다. 개수를 셀 땐 스물셋, 번호를 말할 땐 이십삼을 주로 씁니다.',
        '두 수를 비교할 땐 10개씩 묶음 수를 먼저 보고, 같으면 낱개 수를 비교하게 합니다.'
      ],
      mistakes: [
        '"이십삼"을 203처럼 씀',
        '10개씩 묶음 수와 낱개 수를 바꿔 씀',
        '낱개 수만 보고 크기를 비교함 (29가 31보다 크다고 생각)',
        '스물·서른·마흔 등 우리말 수 이름을 혼동'
      ],
      warmup: '달력 숫자 찾기 — 달력에서 15일, 23일을 찾아 "십오, 열다섯"처럼 두 가지로 읽어 봅니다.',
      check: '"34는 10개씩 묶음 몇 개와 낱개 몇 개일까? 43과는 뭐가 달라?"',
      next: '2학기 100까지의 수로 이어지고, 2학년 세 자리 수의 자릿값(백·십·일)으로 확장됩니다.',
      keywords: ['50까지의수', '10개씩묶음', '낱개', '십몇', '묶어세기', '스물', '서른', '마흔', '쉰', '10알아보기']
    },
    {
      id: 'g1u6', grade: 1, sem: 2, no: 1, title: '100까지의 수', icon: '💯',
      lessons: ['몇십 알아보기 (60~90)', '99까지의 수 알아보기', '수의 순서 알아보기', '100 알아보기', '수의 크기 비교하기', '짝수와 홀수'],
      concept: '10개씩 묶음 6개는 60(육십, 예순)이고, 99보다 1만큼 더 큰 수는 100(백)입니다. 두 수의 크기는 10개씩 묶음 수부터 비교하며, 둘씩 짝을 지어 남는 것이 없으면 짝수, 하나 남으면 홀수입니다.',
      script: [
        '"예순, 일흔, 여든, 아흔" 우리말 몇십을 노래처럼 외워 봅니다. 열, 스물부터 순서대로 이어서 말합니다.',
        '수 배열표(1~100)를 펼쳐 놓고 오른쪽으로 가면 1씩, 아래로 가면 10씩 커지는 것을 손가락으로 따라가 봅니다.',
        '양말이나 젓가락을 둘씩 짝지어 보며 "하나 남았네? 그럼 홀수야." 짝수와 홀수를 직접 확인합니다.',
        '"76과 67 중 어느 게 더 클까?" 10개씩 묶음 수(앞자리)를 먼저 보는 습관을 들입니다.'
      ],
      mistakes: [
        '"칠십육"을 706으로 씀',
        '우리말 수 이름(예순·일흔·여든·아흔)을 혼동',
        '99 다음 수를 헷갈림',
        '짝수·홀수를 낱개 자리 숫자로 바로 판단하지 못하고 하나씩 셈'
      ],
      warmup: '아파트 동·호수 읽기 — 길에서 보이는 두 자리 수를 "칠십팔, 일흔여덟" 두 가지로 읽어 봅니다.',
      check: '"58보다 1만큼 더 큰 수와 10만큼 더 큰 수는 뭘까? 수 배열표에서 어디로 움직였어?"',
      next: '2학년 세 자리 수(백, 몇백)와 자릿값으로 이어지며, 짝수·홀수는 2학년 곱셈구구(2단)와 연결됩니다.',
      keywords: ['100까지의수', '예순', '일흔', '여든', '아흔', '짝수', '홀수', '수배열표', '99까지', '몇십', '백']
    },
    {
      id: 'g1u7', grade: 1, sem: 2, no: 2, title: '덧셈과 뺄셈(1)', icon: '🧮',
      lessons: ['(몇십몇)+(몇)', '(몇십)+(몇십), (몇십몇)+(몇십몇)', '(몇십몇)−(몇)', '(몇십)−(몇십), (몇십몇)−(몇십몇)', '덧셈과 뺄셈 하기'],
      concept: '받아올림·받아내림이 없는 두 자리 수의 덧셈과 뺄셈입니다. 낱개는 낱개끼리, 10개씩 묶음은 묶음끼리 계산하며, 세로셈에서는 자리를 맞추어 씁니다.',
      script: [
        '"23+5는 10개씩 묶음은 그대로, 낱개 3개에 5개를 더하는 거야." 묶음 빨대와 낱개 빨대로 직접 해 봅니다.',
        '세로셈은 칸 공책에 자리를 맞추어 쓰고, 낱개(일의 자리)부터 계산하게 합니다.',
        '"36−14는 낱개 6에서 4를, 묶음 3에서 1을 빼." 같은 자리끼리라는 말을 반복합니다.',
        '계산 후 "답이 처음 수보다 커졌어, 작아졌어?" 물어 결과가 맞는지 스스로 확인하게 합니다.'
      ],
      mistakes: [
        '23+5를 73처럼 낱개 수를 앞자리에 더함',
        '세로셈에서 자리를 맞추지 않고 씀',
        '뺄셈에서 자리별로 위아래 수를 바꿔 계산함',
        '40−20을 2처럼 0을 빠뜨림'
      ],
      warmup: '가게 놀이 — "20원짜리 사탕과 30원짜리 젤리를 사면 얼마?" 몇십끼리 더하기부터 말로 해 봅니다.',
      check: '"34+25를 계산할 때 어떤 수끼리 먼저 더했는지 설명해 볼래?"',
      next: '덧셈과 뺄셈(3)의 받아올림·받아내림으로 이어지고, 2학년 받아올림 있는 두 자리 수 덧셈·받아내림 있는 뺄셈의 기초가 됩니다.',
      keywords: ['두자리수덧셈', '두자리수뺄셈', '몇십몇', '몇십더하기', '세로셈', '자리맞추기', '받아올림없는']
    },
    {
      id: 'g1u8', grade: 1, sem: 2, no: 3, title: '여러 가지 모양', icon: '🔺',
      lessons: ['여러 가지 모양 찾기', '본떠서 모양 알아보기', '□, △, ○ 모양의 특징 알아보기', '여러 가지 모양으로 꾸미기', '꾸민 모양에서 사용한 모양 세기'],
      concept: '물건의 평평한 면을 본뜨거나 생김새를 보고 □ 모양, △ 모양, ○ 모양으로 나눕니다. □ 모양은 뾰족한 곳이 4군데, △ 모양은 3군데이고, ○ 모양은 뾰족한 곳 없이 둥급니다.',
      script: [
        '휴지 상자, 풀, 삼각자 등을 종이에 대고 따라 그려 봅니다. "상자를 본뜨면 □ 모양이 나오네!"',
        '"뾰족한 곳이 몇 군데야?" 손가락으로 짚어 가며 세게 해서 □ 모양과 △ 모양을 구별합니다.',
        '눈을 감고 모양 조각을 만져 보며 "곧은 선이 있어? 둥글어?" 촉감으로 맞히는 놀이를 합니다.',
        '색종이 모양 조각으로 집, 로봇 등을 꾸민 뒤 사용한 모양을 종류별로 표시하며 세어 봅니다.'
      ],
      mistakes: [
        '기울어지거나 길쭉한 □ 모양을 □ 모양이 아니라고 생각함',
        '거꾸로 놓인 △ 모양을 다른 모양으로 생각함',
        '상자 모양(1학기)과 □ 모양을 같은 말로 혼동',
        '꾸민 그림에서 모양을 셀 때 빠뜨리거나 두 번 셈'
      ],
      warmup: '집 안 모양 사냥 — 창문(□), 동전(○), 옷걸이(△)처럼 세 가지 모양을 하나씩 찾아 사진을 찍어 봅니다.',
      check: '"△ 모양과 □ 모양은 뭐가 다를까? 뾰족한 곳을 세어서 말해 볼래?"',
      next: '2학년 여러 가지 도형(삼각형·사각형·원, 꼭짓점·변)으로 이어지고, 3학년 평면도형의 기초가 됩니다.',
      keywords: ['네모', '세모', '동그라미', '평면모양', '본뜨기', '뾰족한곳', '모양꾸미기', '네모모양', '세모모양', '동그라미모양']
    },
    {
      id: 'g1u9', grade: 1, sem: 2, no: 4, title: '덧셈과 뺄셈(2)', icon: '🧩',
      lessons: ['세 수의 덧셈', '세 수의 뺄셈', '10이 되는 더하기', '10에서 빼기', '10을 만들어 더하기'],
      concept: '세 수의 계산은 앞에서부터 두 수씩 차례로 합니다. 더해서 10이 되는 두 수(1과 9, 2와 8, 3과 7, 4와 6, 5와 5)를 "10의 짝꿍"으로 익혀 두면 10에서 빼기와 10을 만들어 더하기가 쉬워집니다.',
      script: [
        '달걀판 같은 열 칸 상자에 바둑돌을 채우며 "7개 있으면 몇 개 더 있어야 10이 될까?" 10의 짝꿍을 눈으로 익힙니다.',
        '"10의 짝꿍 빙고" — 엄마가 3을 말하면 아이가 7을 외치는 놀이로 반복합니다.',
        '세 수의 덧셈은 "앞의 두 수를 먼저 더하고, 그 답에 나머지 수를 더해." 계산한 부분에 표시하며 차례로 풉니다.',
        '4+6+5처럼 10을 만들 수 있는 두 수를 먼저 찾아 묶으면 더 쉽다는 것을 보여 줍니다.'
      ],
      mistakes: [
        '세 수의 뺄셈에서 뒤의 두 수를 먼저 계산함 (9−3−2를 9−1로)',
        '10의 짝꿍을 잘못 기억함 (3과 6)',
        '10에서 빼기를 손가락으로 세다가 1 차이가 남',
        '세 수 중 두 수만 계산하고 멈춤'
      ],
      warmup: '10의 짝꿍 손뼉 놀이 — 엄마가 손가락 몇 개를 펴 보이면 아이가 접힌 손가락 수를 외칩니다.',
      check: '"6+4+3은 어떻게 계산하면 쉬울까? 10을 어디서 만들 수 있어?"',
      next: '바로 덧셈과 뺄셈(3)의 받아올림·받아내림으로 이어지고, 2학년 두 자리 수 덧셈·뺄셈과 세 수의 계산의 바탕이 됩니다.',
      keywords: ['세수의덧셈', '세수의뺄셈', '10만들기', '10의짝꿍', '10에서빼기', '10이되는더하기', '짝꿍수']
    },
    {
      id: 'g1u10', grade: 1, sem: 2, no: 5, title: '시계 보기와 규칙 찾기', icon: '⏰',
      lessons: ['몇 시 알아보기', '몇 시 30분 알아보기', '규칙 찾기', '규칙 만들기', '수 배열에서 규칙 찾기', '수 배열표에서 규칙 찾기', '규칙을 여러 가지 방법으로 나타내기'],
      concept: '시계의 긴바늘이 12를 가리키면 "몇 시", 6을 가리키면 "몇 시 30분"입니다. 몇 시 30분일 때 짧은바늘은 두 숫자의 가운데에 있으며 지나온 숫자를 읽습니다. 규칙 찾기는 되풀이되는 부분을 찾아 다음에 올 것을 알아내는 것입니다.',
      script: [
        '장난감 시계나 종이 시계로 "긴바늘은 12에 두고, 짧은바늘만 돌려 볼까?" 몇 시부터 익힙니다.',
        '"긴바늘이 6에 있으면 30분이야. 짧은바늘이 두 숫자 사이에 있지? 지나온 숫자를 읽어." 몇 시 30분을 연습합니다.',
        '생활 시각과 연결합니다. "8시에 학교 가고, 12시 30분에 점심을 먹지?"',
        '블록이나 바둑돌로 ●○●○ 규칙을 만들어 보고, 되풀이되는 부분을 손으로 묶어 표시하게 합니다.'
      ],
      mistakes: [
        '긴바늘과 짧은바늘을 바꿔 읽음',
        '몇 시 30분에서 다음 숫자를 읽음 (3시 30분을 4시 30분으로)',
        '되풀이되는 부분을 잘못 묶어 다음 모양을 틀림',
        '수 배열에서 커지는 규칙만 생각하고 작아지는 규칙을 놓침'
      ],
      warmup: '하루 시계 일기 — 일어난 시각, 밥 먹는 시각, 잠자는 시각에 시계를 보고 "몇 시"인지 말해 봅니다.',
      check: '"시계가 4시 30분일 때 짧은바늘은 어디에 있을까? 왜 4와 5 사이일까?"',
      next: '2학년 시각과 시간(몇 시 몇 분, 1시간=60분)과 규칙 찾기(덧셈표·곱셈표의 규칙)로 이어집니다.',
      keywords: ['시계', '몇시', '몇시30분', '시계보기', '긴바늘', '짧은바늘', '규칙찾기', '규칙', '반복', '수배열표', '30분']
    },
    {
      id: 'g1u11', grade: 1, sem: 2, no: 6, title: '덧셈과 뺄셈(3)', icon: '🎯',
      lessons: ['덧셈 알아보기 (이어 세기)', '덧셈하기 (10을 만들어)', '여러 가지 덧셈하기', '뺄셈 알아보기', '뺄셈하기 (10을 이용해)', '여러 가지 뺄셈하기'],
      concept: '합이 10보다 큰 (몇)+(몇)과 (십몇)−(몇)입니다. 8+5는 5를 2와 3으로 갈라 8+2=10을 만든 뒤 3을 더해 13, 14−6은 6을 4와 2로 갈라 14−4=10을 만든 뒤 2를 더 빼서 8로 계산합니다.',
      script: [
        '열 칸 상자 두 개에 바둑돌 8개와 5개를 놓고 "앞 상자를 꽉 채우려면 몇 개를 옮겨야 할까?" 10 만들기를 눈으로 보여 줍니다.',
        '"5를 2와 3으로 가르자." 더하는 수 아래에 가르기를 적어 10을 만드는 과정을 쓰게 합니다.',
        '뺄셈은 "14에서 4를 먼저 빼면 10, 남은 2를 더 빼면 8." 10을 거쳐 가는 길을 말로 설명하게 합니다.',
        '덧셈표를 만들어 "더하는 수가 1 커지면 답도 1 커지네!" 규칙을 발견하게 합니다.'
      ],
      mistakes: [
        '8+5를 손가락으로 처음부터 세어 시간이 오래 걸림',
        '가르기를 잘못해 10을 만들지 못함 (8+5에서 5를 1과 4로)',
        '14−6에서 낱개끼리 6−4를 계산해 12로 답함',
        '10을 만든 뒤 남은 수를 더하거나 빼는 것을 잊음'
      ],
      warmup: '10 넘기 카드 게임 — 수 카드 두 장을 뽑아 합이 10보다 크면 "10 만들고 몇!"을 외치며 답을 말합니다.',
      check: '"7+6을 10을 만들어서 계산하는 방법을 설명해 볼래?"',
      next: '2학년 받아올림이 있는 두 자리 수 덧셈, 받아내림이 있는 두 자리 수 뺄셈으로 바로 이어지는 핵심 단원입니다.',
      keywords: ['받아올림', '받아내림', '몇더하기몇', '십몇빼기몇', '10을만들어더하기', '10을이용한뺄셈', '덧셈표', '뺄셈표', '이어세기']
    }
  );

  /* ---------- 문제 생성기 ---------- */

  /* 1-1-1. 9까지의 수 */
  R('g1u1', (lv) => {
    const basic = [
      () => { const [e, name, u] = pick(EMO), n = ri(1, 9); return P.int(`${jo(name, '은', '는')} 모두 몇 ${u}일까요?${row(e, n)}`, n, { unit: u }); },
      () => { const up = Math.random() < .5, n = up ? ri(0, 8) : ri(1, 9); return P.int(`${n}보다 1만큼 더 ${up ? '큰' : '작은'} 수는 무엇일까요?`, up ? n + 1 : n - 1); },
      () => { const desc = Math.random() < .3, s = desc ? ri(4, 9) : ri(0, 5), seq = [0, 1, 2, 3].map(i => desc ? s - i : s + i), k = ri(0, 3); return P.int(`수의 순서에 맞게 □에 알맞은 수를 쓰세요. ${seq.map((x, i) => i === k ? '□' : x).join(', ')}`, seq[k]); },
      () => { const n = ri(1, 9), w = Math.random() < .5 ? ONES[n] : SINO[n]; return P.int(`'${w}'${hasB(w) ? '을' : '를'} 수로 쓰세요.`, n); },
      () => { let a = ri(0, 9), b = ri(0, 9); if (a === b && Math.random() < .7) return null; return P.choice(`두 수의 크기를 비교하세요. ${a} ○ ${b}`, CMP, cmpIdx(a, b)); },
      () => { const ani = shuffle(['🐶', '🐱', '🐰', '🐻', '🐼', '🦊', '🐸', '🐷', '🐵']).slice(0, ri(5, 8)), k = ri(1, ani.length); const opts = shuffle(ani).slice(0, 4); if (!opts.includes(ani[k - 1])) opts[0] = ani[k - 1]; const s = shuffle(opts); return P.choice(`왼쪽에서부터 ${ORD[k]}에 있는 동물을 고르세요.<div style="font-size:1.6em;letter-spacing:4px;margin:6px 0">${ani.join('')}</div>`, s, s.indexOf(ani[k - 1])); }
    ];
    const adv = [
      () => { const a = ri(0, 5), b = a + ri(2, 4); return P.int(`${jo(a, '과', '와')} ${b} 사이에 있는 수는 모두 몇 개일까요?`, b - a - 1, { unit: '개' }); },
      () => { const ns = distinctNums(4, 0, 9), big = Math.random() < .5; const t = big ? Math.max(...ns) : Math.min(...ns); return P.choice(`가장 ${big ? '큰' : '작은'} 수를 고르세요.`, ns.map(String), ns.indexOf(t)); },
      () => { const f = ri(2, 6), b = ri(2, 6); if (f + b - 1 > 9) return null; const nm = pick(KIDS); return P.int(`${jo(nm, '이는', '는')} 줄의 앞에서 ${ORD[f]}, 뒤에서 ${ORD[b]}에 서 있습니다. 줄을 선 어린이는 모두 몇 명일까요?`, f + b - 1, { unit: '명', word: true }); },
      () => { const n = ri(1, 9), up = Math.random() < .5; if (!up && n === 9) return null; return P.int(`어떤 수보다 1만큼 더 ${up ? '큰' : '작은'} 수는 ${n}입니다. 어떤 수는 무엇일까요?`, up ? n - 1 : n + 1, { word: true }); },
      () => { const ns = distinctNums(5, 1, 9), k = ri(2, 3), sorted = ns.slice().sort((a, b) => b - a); return P.int(`수 카드 ${ns.join(', ')} 중에서 ${k === 2 ? '둘째' : '셋째'}로 큰 수는 무엇일까요?`, sorted[k - 1]); },
      () => { const [e, name, u] = pick(EMO), n = ri(1, 9), m = ri(1, 9); if (n === m) return null; return P.int(`${jo(name, '이', '가')} 접시에 ${n}${u}, 바구니에 ${m}${u} 있습니다. 더 많은 쪽에 있는 ${jo(name, '은', '는')} 몇 ${u}일까요?`, Math.max(n, m), { unit: u, word: true }); }
    ];
    return (lv === 2 ? pick([...adv, ...adv, ...basic]) : pick(basic))();
  });

  /* 1-1-2. 여러 가지 모양 (상자·둥근기둥·공) */
  R('g1u2', (lv) => {
    const PROPS = [
      ['평평한 면만 있어서 잘 쌓을 수 있는 모양', 0], ['뾰족한 곳이 있는 모양', 0], ['어느 쪽으로 굴려도 잘 굴러가는 모양', 2],
      ['둥근 부분만 있어서 쌓기 어려운 모양', 2], ['눕히면 굴러가고 세우면 쌓을 수 있는 모양', 1], ['평평한 면과 둥근 부분이 모두 있는 모양', 1]
    ];
    const basic = [
      () => { const t = ri(0, 2), o = pick(OBJ[t]); return P.choice(`${jo(o, '은', '는')} 어떤 모양일까요?`, SOLID, t); },
      () => { const t = ri(0, 2), dx = pick([-50, -30, -10, 10, 30]); const others = [0, 1, 2].filter(x => x !== t).map(x => pick(OBJ[x])); const correct = pick(OBJ[t]); const s = shuffle([correct, ...others]); return P.choice(`그림과 같은 모양의 물건을 고르세요.${solid(t, dx)}`, s, s.indexOf(correct)); },
      () => { const [p, t] = pick(PROPS); return P.choice(`${p}은 어느 것일까요?`, SOLID, t); },
      () => { const t = ri(0, 2), dx = pick([-50, -30, -10, 10, 30]); return P.choice(`그림은 어떤 모양일까요?${solid(t, dx)}`, SOLID, t); },
      () => { const t = ri(0, 2), n = ri(4, 6); const items = shuffle([0, 1, 2].flatMap(x => OBJ[x].map(o => [o, x]))).slice(0, n); const c = items.filter(i => i[1] === t).length; if (!c) return null; return P.int(`다음 중 ${SOLID[t]}인 물건은 몇 개일까요?<br>${items.map(i => i[0]).join(', ')}`, c, { unit: '개' }); }
    ];
    const adv = [
      () => { const t = ri(0, 2), o = ri(0, 2); if (o === t) return null; const same = shuffle(OBJ[t]).slice(0, 3), odd = pick(OBJ[o]); const s = shuffle([...same, odd]); return P.choice(`모양이 다른 하나를 고르세요.`, s, s.indexOf(odd)); },
      () => { const c = distinctNums(3, 1, 6), most = Math.random() < .5; const t = c.indexOf(most ? Math.max(...c) : Math.min(...c)); return P.choice(`기차를 만드는 데 상자 모양 ${c[0]}개, 둥근기둥 모양 ${c[1]}개, 공 모양 ${c[2]}개를 사용했습니다. 가장 ${most ? '많이' : '적게'} 사용한 모양은 무엇일까요?`, SOLID, t, { word: true }); },
      () => { const ball = pick(OBJ[2]); const others = shuffle([...OBJ[0], ...OBJ[1]]).slice(0, 3); const s = shuffle([ball, ...others]); return P.choice(`높이 쌓기 가장 어려운 물건을 고르세요.`, s, s.indexOf(ball)); },
      () => { const box = pick(OBJ[0]); const others = shuffle([...OBJ[1], ...OBJ[2]]).slice(0, 3); const s = shuffle([box, ...others]); return P.choice(`어떻게 놓아도 굴러가지 않는 물건을 고르세요.`, s, s.indexOf(box)); },
      () => { const t = ri(0, 2), n = ri(6, 8); const items = shuffle([0, 1, 2].flatMap(x => OBJ[x].map(o => [o, x]))).slice(0, n); const c = items.filter(i => i[1] === t).length; return P.int(`다음 물건 중 ${SOLID[t]}은 몇 개일까요?<br>${items.map(i => i[0]).join(', ')}`, c, { unit: '개' }); }
    ];
    return (lv === 2 ? pick([...adv, ...adv, ...basic]) : pick(basic))();
  });

  /* 1-1-3. 덧셈과 뺄셈 (9까지) */
  R('g1u3', (lv) => {
    const basic = [
      () => { const a = ri(1, 8), b = ri(1, 9 - a); return P.int(`${jo(a, '과', '와')} ${jo(b, '을', '를')} 모으면 얼마일까요?`, a + b); },
      () => { const n = ri(2, 9), a = ri(1, n - 1); return P.int(`${jo(n, '은', '는')} ${jo(a, '과', '와')} □로 가를 수 있습니다. □에 알맞은 수를 쓰세요.`, n - a); },
      () => { const a = ri(0, 9), b = ri(0, 9 - a); return P.int(`${a} + ${b} = □`, a + b); },
      () => { const a = ri(1, 9), b = ri(0, a); return P.int(`${a} − ${b} = □`, a - b); },
      () => { const [e, name, u] = pick(EMO), a = ri(1, 5), b = ri(1, Math.min(4, 9 - a)); return P.int(`위의 ${name} ${a}${jo(u, '과', '와')} 아래의 ${name} ${b}${jo(u, '을', '를')} 모으면 모두 몇 ${u}일까요?${row(e, a)}${row(e, b)}`, a + b, { unit: u }); }
    ];
    const adv = [
      () => { const a = ri(2, 6), b = ri(1, 9 - a), ani = pick([['참새', '마리'], ['비둘기', '마리'], ['오리', '마리']]); return P.int(`${jo(ani[0], '이', '가')} ${a}${ani[1]} 있었는데 ${b}${ani[1]}가 더 날아왔습니다. ${jo(ani[0], '은', '는')} 모두 몇 ${ani[1]}일까요?`, a + b, { unit: ani[1], word: true }); },
      () => { const a = ri(3, 9), b = ri(1, a - 1); return P.int(`풍선 ${a}개 중에서 ${b}개가 터졌습니다. 남은 풍선은 몇 개일까요?`, a - b, { unit: '개', word: true }); },
      () => { const a = ri(3, 9), b = ri(1, a - 1); return P.int(`사과가 ${a}개, 배가 ${b}개 있습니다. 사과는 배보다 몇 개 더 많을까요?`, a - b, { unit: '개', word: true }); },
      () => { const a = ri(1, 7), c = ri(a + 1, 9); return P.int(`${a} + □ = ${c} 에서 □에 알맞은 수를 쓰세요.`, c - a); },
      () => { const b = ri(1, 5), c = ri(1, 9 - b); return P.int(`□ − ${b} = ${c} 에서 □에 알맞은 수를 쓰세요.`, b + c); },
      () => { const a = ri(1, 5), b = ri(1, 9 - a - 0), c = ri(3, 9), d = ri(0, c - 1); if (a + b > 9 || a + b === c - d) return null; const s = [`${a} + ${b}`, `${c} − ${d}`]; return P.choice(`계산 결과가 더 큰 것을 고르세요.`, s, a + b > c - d ? 0 : 1); }
    ];
    return (lv === 2 ? pick([...adv, ...adv, ...basic]) : pick(basic))();
  });

  /* 1-1-4. 비교하기 */
  R('g1u4', (lv) => {
    const HEAVY = [['코끼리', '강아지'], ['수박', '귤'], ['책가방', '필통'], ['냉장고', '의자'], ['볼링공', '탁구공'], ['벽돌', '스펀지'], ['사전', '공책'], ['자전거', '헬멧']];
    const WIDE = [['운동장', '교실'], ['달력', '우표'], ['스케치북', '공책'], ['식탁', '방석'], ['침대', '베개'], ['칠판', '수첩']];
    const HOLD = [['욕조', '컵'], ['양동이', '숟가락'], ['물병', '병뚜껑'], ['냄비', '종이컵'], ['어항', '그릇'], ['주전자', '찻잔']];
    const pair = (lst) => { const p = pick(lst); const s = shuffle(p); return [s, p[0], p[1]]; };
    const basic = [
      () => { const [a, b] = distinctNums(2, 4, 22).map(x => x * 10); if (Math.abs(a - b) < 20) return null; const long = Math.random() < .5; return P.choice(`더 ${long ? '긴' : '짧은'} 것은 어느 것일까요?${bars([a, b])}`, ['가', '나'], (long ? a > b : a < b) ? 0 : 1); },
      () => { const ls = distinctNums(3, 4, 22).map(x => x * 10); const srt = ls.slice().sort((x, y) => x - y); if (srt[1] - srt[0] < 20 || srt[2] - srt[1] < 20) return null; const long = Math.random() < .5; return P.choice(`가장 ${long ? '긴' : '짧은'} 것은 어느 것일까요?${bars(ls)}`, NAMES3, ls.indexOf(long ? srt[2] : srt[0])); },
      () => { const [s, h, l] = pair(HEAVY), q = Math.random() < .5; return P.choice(`${jo(s[0], '과', '와')} ${s[1]} 중에서 더 ${q ? '무거운' : '가벼운'} 것은 무엇일까요?`, s, s.indexOf(q ? h : l)); },
      () => { const [s, w, n] = pair(WIDE), q = Math.random() < .5; return P.choice(`${jo(s[0], '과', '와')} ${s[1]} 중에서 더 ${q ? '넓은' : '좁은'} 것은 무엇일까요?`, s, s.indexOf(q ? w : n)); },
      () => { const [s, m, f] = pair(HOLD), q = Math.random() < .5; return P.choice(`${jo(s[0], '과', '와')} ${s[1]} 중에서 물을 더 ${q ? '많이' : '적게'} 담을 수 있는 것은 무엇일까요?`, s, s.indexOf(q ? m : f)); },
      () => { const a = ri(2, 6), b = ri(2, 5), c = ri(2, 6), d = ri(2, 5); if (a * b === c * d) return null; const wide = Math.random() < .5; return P.choice(`더 ${wide ? '넓은' : '좁은'} 것은 어느 것일까요?${grids(a, b, c, d)}`, ['가', '나'], (wide ? a * b > c * d : a * b < c * d) ? 0 : 1); }
    ];
    const adv = [
      () => { const [l, r] = shuffle(KIDS).slice(0, 2), ld = Math.random() < .5, heavy = Math.random() < .5; const ans = (ld === heavy) ? 0 : 1; return P.choice(`시소에서 더 ${heavy ? '무거운' : '가벼운'} 사람은 누구일까요?${seesaw(l, r, ld)}`, [l, r], ans); },
      () => { const ani = shuffle(['곰', '토끼', '다람쥐', '돼지', '고양이', '사자']).slice(0, 3); const light = Math.random() < .5; return P.choice(`${jo(ani[0], '은', '는')} ${ani[1]}보다 무겁고, ${jo(ani[1], '은', '는')} ${ani[2]}보다 무겁습니다. 가장 ${light ? '가벼운' : '무거운'} 동물은 무엇일까요?`, ani.slice().sort(), ani.slice().sort().indexOf(light ? ani[2] : ani[0]), { word: true }); },
      () => { const k = shuffle(KIDS).slice(0, 3); const tall = Math.random() < .5; const opts = k.slice().sort(); return P.choice(`${jo(k[0], '이는', '는')} ${jo(k[1], '이보다', '보다')} 키가 크고, ${jo(k[1], '이는', '는')} ${jo(k[2], '이보다', '보다')} 키가 큽니다. 키가 가장 ${tall ? '큰' : '작은'} 사람은 누구일까요?`, opts, opts.indexOf(tall ? k[0] : k[2]), { word: true }); },
      () => { const [a, b] = distinctNums(2, 2, 9), more = Math.random() < .5; return P.choice(`가 그릇과 나 그릇에 물을 가득 채운 뒤 똑같은 컵으로 옮겨 담았더니 가 그릇은 ${a}컵, 나 그릇은 ${b}컵이 나왔습니다. 물을 더 ${more ? '많이' : '적게'} 담을 수 있는 그릇은 어느 것일까요?`, ['가', '나'], (more ? a > b : a < b) ? 0 : 1, { word: true }); },
      () => { const [a, b] = distinctNums(2, 3, 9), long = Math.random() < .5; return P.choice(`클립을 이어서 길이를 재었더니 빨간 끈은 클립 ${a}개, 파란 끈은 클립 ${b}개만큼이었습니다. 더 ${long ? '긴' : '짧은'} 끈은 무엇일까요?`, ['빨간 끈', '파란 끈'], (long ? a > b : a < b) ? 0 : 1, { word: true }); }
    ];
    return (lv === 2 ? pick([...adv, ...adv, ...basic]) : pick(basic))();
  });

  /* 1-1-5. 50까지의 수 */
  R('g1u5', (lv) => {
    const basic = [
      () => { const a = ri(1, 4), b = ri(0, 9); return P.int(`10개씩 묶음 ${a}개와 낱개 ${b}개는 얼마일까요?`, a * 10 + b); },
      () => { const n = ri(11, 49), askT = Math.random() < .5; if (n % 10 === 0) return null; return P.int(`${jo(n, '은', '는')} 10개씩 묶음 ${askT ? '□개' : Math.floor(n / 10) + '개'}와 낱개 ${askT ? (n % 10) + '개' : '□개'}입니다. □에 알맞은 수를 쓰세요.`, askT ? Math.floor(n / 10) : n % 10); },
      () => { const a = ri(1, 9); return P.int(`${jo(a, '과', '와')} □를 모으면 10이 됩니다. □에 알맞은 수를 쓰세요.`, 10 - a); },
      () => { const n = ri(10, 50), useNative = Math.random() < .5, w = useNative ? native(n) : sino(n); return P.int(`'${w}'${hasB(w) ? '을' : '를'} 수로 쓰세요.`, n); },
      () => { const s = ri(10, 46), seq = [0, 1, 2, 3].map(i => s + i), k = ri(0, 3); return P.int(`수의 순서에 맞게 □에 알맞은 수를 쓰세요. ${seq.map((x, i) => i === k ? '□' : x).join(', ')}`, seq[k]); },
      () => { const [a, b] = distinctNums(2, 10, 50); return P.choice(`두 수의 크기를 비교하세요. ${a} ○ ${b}`, ['&gt;', '&lt;'], a > b ? 0 : 1); }
    ];
    const adv = [
      () => { const a = ri(10, 44), b = a + ri(2, 6); return P.int(`${jo(a, '과', '와')} ${b} 사이에 있는 수는 모두 몇 개일까요?`, b - a - 1, { unit: '개' }); },
      () => { const ns = distinctNums(4, 10, 50), big = Math.random() < .5; return P.choice(`가장 ${big ? '큰' : '작은'} 수를 고르세요.`, ns.map(String), ns.indexOf(big ? Math.max(...ns) : Math.min(...ns))); },
      () => { const a = ri(1, 4), b = ri(1, 9); const it = pick([['구슬', '봉지'], ['연필', '상자'], ['초콜릿', '봉지'], ['색연필', '통']]); return P.int(`${jo(it[0], '을', '를')} 10개씩 ${a}${jo(it[1], '과', '와')} 낱개로 ${b}개 가지고 있습니다. ${jo(it[0], '은', '는')} 모두 몇 개일까요?`, a * 10 + b, { unit: '개', word: true }); },
      () => { const t = ri(1, 4), d = ri(2, 9); return P.int(`${t}□ &lt; ${t}${d} 에서 □ 안에 들어갈 수 있는 수 중 가장 큰 수는 무엇일까요?`, d - 1); },
      () => { const cs = distinctNums(3, 1, 4), big = Math.random() < .5; const s = cs.slice().sort((x, y) => y - x); const v = big ? s[0] * 10 + s[1] : s[2] * 10 + s[1]; return P.int(`수 카드 ${cs.join(', ')} 중에서 2장을 골라 몇십몇을 만들려고 합니다. 만들 수 있는 가장 ${big ? '큰' : '작은'} 수는 무엇일까요?`, v); },
      () => { const n = ri(11, 49), up = Math.random() < .5; return P.int(`어떤 수보다 1만큼 더 ${up ? '큰' : '작은'} 수는 ${n}입니다. 어떤 수는 무엇일까요?`, up ? n - 1 : n + 1, { word: true }); }
    ];
    return (lv === 2 ? pick([...adv, ...adv, ...basic]) : pick(basic))();
  });

  /* 1-2-1. 100까지의 수 */
  R('g1u6', (lv) => {
    const basic = [
      () => { const a = ri(5, 9), b = ri(0, 9); return P.int(`10개씩 묶음 ${a}개와 낱개 ${b}개는 얼마일까요?`, a * 10 + b); },
      () => { const n = ri(51, 99), w = Math.random() < .5 ? native(n) : sino(n); return P.int(`'${w}'${hasB(w) ? '을' : '를'} 수로 쓰세요.`, n); },
      () => { const s = ri(50, 97), seq = [0, 1, 2, 3].map(i => s + i).filter(x => x <= 100), k = ri(0, seq.length - 1); if (seq.length < 4) return null; return P.int(`수의 순서에 맞게 □에 알맞은 수를 쓰세요. ${seq.map((x, i) => i === k ? '□' : x).join(', ')}`, seq[k]); },
      () => { const n = ri(50, 99), k = pick([1, 10]), up = Math.random() < .5; if (up && n + k > 100) return null; return P.int(`${n}보다 ${k}만큼 더 ${up ? '큰' : '작은'} 수는 무엇일까요?`, up ? n + k : n - k); },
      () => { const [a, b] = distinctNums(2, 50, 100); return P.choice(`두 수의 크기를 비교하세요. ${a} ○ ${b}`, ['&gt;', '&lt;'], a > b ? 0 : 1); },
      () => { const n = ri(1, 99); return P.choice(`${jo(n, '은', '는')} 짝수일까요, 홀수일까요?`, ['짝수', '홀수'], n % 2 ? 1 : 0); }
    ];
    const adv = [
      () => { const a = ri(50, 90), b = a + ri(3, 9); if (b > 100) return null; return P.int(`${jo(a, '과', '와')} ${b} 사이에 있는 수는 모두 몇 개일까요?`, b - a - 1, { unit: '개' }); },
      () => { const a = ri(50, 85), b = a + ri(5, 12), even = Math.random() < .5; let c = 0; for (let x = a + 1; x < b; x++) if ((x % 2 === 0) === even) c++; return P.int(`${jo(a, '과', '와')} ${b} 사이에 있는 수 중에서 ${even ? '짝수' : '홀수'}는 모두 몇 개일까요?`, c, { unit: '개' }); },
      () => { const cs = distinctNums(4, 0, 9), big = Math.random() < .5; const s = cs.slice().sort((x, y) => x - y); let v; if (big) v = s[3] * 10 + s[2]; else { const t = s[0] === 0 ? s[1] : s[0]; const o = s[0] === 0 ? 0 : s[1]; v = t * 10 + o; } return P.int(`수 카드 ${cs.join(', ')} 중에서 2장을 골라 몇십몇을 만들려고 합니다. 만들 수 있는 가장 ${big ? '큰' : '작은'} 수는 무엇일까요?`, v); },
      () => { const a = ri(5, 9), b = ri(1, 9); return P.int(`달걀이 10개씩 ${a}판과 낱개로 ${b}개 있습니다. 달걀은 모두 몇 개일까요?`, a * 10 + b, { unit: '개', word: true }); },
      () => { const s = ri(1, 5) * 10 + ri(0, 9), step = pick([10, 2, 5]), seq = [0, 1, 2, 3, 4].map(i => s + i * step), k = ri(1, 4); if (seq[4] > 100) return null; return P.int(`규칙에 따라 □에 알맞은 수를 쓰세요. ${seq.map((x, i) => i === k ? '□' : x).join(', ')}`, seq[k]); },
      () => { const ns = distinctNums(4, 50, 100), big = Math.random() < .5; return P.choice(`가장 ${big ? '큰' : '작은'} 수를 고르세요.`, ns.map(String), ns.indexOf(big ? Math.max(...ns) : Math.min(...ns))); }
    ];
    return (lv === 2 ? pick([...adv, ...adv, ...basic]) : pick(basic))();
  });

  /* 1-2-2. 덧셈과 뺄셈(1) — 받아올림·받아내림 없음 */
  R('g1u7', (lv) => {
    const two = () => ri(1, 9) * 10 + ri(0, 9);
    const basic = [
      () => { const t = ri(1, 9), o = ri(0, 8), b = ri(1, 9 - o); return P.int(`${t * 10 + o} + ${b} = □`, t * 10 + o + b); },
      () => { const a = ri(1, 8), b = ri(1, 9 - a); return P.int(`${a * 10} + ${b * 10} = □`, (a + b) * 10); },
      () => { const t1 = ri(1, 8), t2 = ri(1, 9 - t1), o1 = ri(0, 9), o2 = ri(0, 9 - o1); return P.int(`${t1 * 10 + o1} + ${t2 * 10 + o2} = □`, (t1 + t2) * 10 + o1 + o2); },
      () => { const t = ri(1, 9), o = ri(1, 9), b = ri(1, o); return P.int(`${t * 10 + o} − ${b} = □`, t * 10 + o - b); },
      () => { const a = ri(2, 9), b = ri(1, a - 1); return P.int(`${a * 10} − ${b * 10} = □`, (a - b) * 10); },
      () => { const t1 = ri(2, 9), t2 = ri(1, t1), o1 = ri(0, 9), o2 = ri(0, o1); if (t1 === t2 && o1 === o2) return null; return P.int(`${t1 * 10 + o1} − ${t2 * 10 + o2} = □`, (t1 - t2) * 10 + o1 - o2); }
    ];
    const adv = [
      () => { const t1 = ri(1, 6), t2 = ri(1, 9 - t1), o1 = ri(0, 9), o2 = ri(0, 9 - o1), a = t1 * 10 + o1, b = t2 * 10 + o2; return P.int(`색종이를 언니는 ${a}장, 나는 ${b}장 가지고 있습니다. 두 사람이 가진 색종이는 모두 몇 장일까요?`, a + b, { unit: '장', word: true }); },
      () => { const t1 = ri(3, 9), t2 = ri(1, t1 - 1), o1 = ri(1, 9), o2 = ri(0, o1), a = t1 * 10 + o1, b = t2 * 10 + o2; return P.int(`버스에 ${a}명이 타고 있었는데 ${b}명이 내렸습니다. 버스에 남은 사람은 몇 명일까요?`, a - b, { unit: '명', word: true }); },
      () => { const t1 = ri(2, 9), t2 = ri(1, t1 - 1), o1 = ri(0, 9), o2 = ri(0, o1), a = t1 * 10 + o1, b = t2 * 10 + o2; return P.int(`줄넘기를 지아는 ${a}번, 서준이는 ${b}번 넘었습니다. 지아는 서준이보다 몇 번 더 많이 넘었을까요?`, a - b, { unit: '번', word: true }); },
      () => { const t1 = ri(1, 8), t2 = ri(1, 9 - t1), o1 = ri(0, 9), o2 = ri(0, 9 - o1), a = t1 * 10 + o1, c = a + t2 * 10 + o2; return P.int(`${a} + □ = ${c} 에서 □에 알맞은 수를 쓰세요.`, c - a); },
      () => { const t = ri(1, 8), o = ri(0, 9), b = ri(1, 9 - t) * 10 + ri(0, 9 - o); const a = t * 10 + o; return P.int(`□ − ${b} = ${a} 에서 □에 알맞은 수를 쓰세요.`, a + b); },
      () => { const t1 = ri(1, 4), t2 = ri(1, 4), o1 = ri(0, 4), o2 = ri(0, 4), a = t1 * 10 + o1, b = t2 * 10 + o2; const c = two(), d = ri(1, 9); if (c % 10 < d) return null; const x = a + b, y = c - d; if (x === y) return null; return P.choice(`계산 결과가 더 큰 것을 고르세요.`, [`${a} + ${b}`, `${c} − ${d}`], x > y ? 0 : 1); }
    ];
    return (lv === 2 ? pick([...adv, ...adv, ...basic]) : pick(basic))();
  });

  /* 1-2-3. 여러 가지 모양 (□·△·○) */
  R('g1u8', (lv) => {
    const CORNER = [['뾰족한 곳이 3군데 있는 모양', 1], ['뾰족한 곳이 4군데 있는 모양', 0], ['뾰족한 곳이 없고 둥근 모양', 2], ['곧은 선 3개로 둘러싸인 모양', 1], ['곧은 선 4개로 둘러싸인 모양', 0], ['곧은 선이 없는 모양', 2]];
    const TRACE = [['휴지 상자', 0], ['주사위', 0], ['동화책', 0], ['딱풀의 바닥', 2], ['음료수 캔의 바닥', 2], ['두루마리 휴지의 바닥', 2], ['삼각자', 1], ['삼각김밥 포장의 앞면', 1]];
    const basic = [
      () => { const t = ri(0, 2), o = pick(FOBJ[t]); return P.choice(`${jo(o, '은', '는')} 어떤 모양일까요?`, FLAT, t); },
      () => { const t = ri(0, 2), sz = ri(50, 80), rot = pick([0, 0, 20, 45, -30, 180]), ratio = pick([1, 0.6, 0.75]); return P.choice(`그림은 어떤 모양일까요?${svgWrap(flat(t, 110, 62, sz, rot, ratio), 220, 125)}`, FLAT, t); },
      () => { const [p, t] = pick(CORNER); return P.choice(`${p}은 어느 것일까요?`, FLAT, t); },
      () => { const n = ri(5, 10), { svg, cnt } = flatPicture(n), t = ri(0, 2); return P.int(`그림에서 ${FLAT[t]}은 몇 개일까요?${svg}`, cnt[t], { unit: '개' }); },
      () => { const t = pick([0, 1]); const nm = t === 0 ? pick(['□ 모양', '공책 모양', '창문 모양']) : pick(['△ 모양', '삼각김밥 모양', '옷걸이 모양']); return P.int(`${nm}에서 뾰족한 곳은 몇 군데일까요?`, t === 0 ? 4 : 3, { unit: '군데' }); }
    ];
    const adv = [
      () => { const n = ri(7, 10), { svg, cnt } = flatPicture(n), mx = Math.max(...cnt); if (cnt.filter(c => c === mx).length > 1) return null; return P.choice(`그림에서 가장 많이 사용한 모양은 무엇일까요?${svg}`, FLAT, cnt.indexOf(mx)); },
      () => { const [o, t] = pick(TRACE); return P.choice(`${jo(o, '을', '를')} 종이에 대고 본뜨면 어떤 모양이 나올까요?`, FLAT, t); },
      () => { const a = ri(1, 2), b = ri(1, 2); return P.int(`□ 모양 ${a}개와 △ 모양 ${b}개가 있습니다. 뾰족한 곳은 모두 몇 군데일까요?`, 4 * a + 3 * b, { unit: '군데', word: true }); },
      () => { const t = ri(0, 2), o = ri(0, 2); if (o === t) return null; const same = shuffle(FOBJ[t]).slice(0, 3), odd = pick(FOBJ[o]); const s = shuffle([...same, odd]); return P.choice(`모양이 다른 하나를 고르세요.`, s, s.indexOf(odd)); },
      () => { const n = ri(7, 10), { svg, cnt } = flatPicture(n), t = ri(0, 2), u = (t + ri(1, 2)) % 3; return P.int(`그림에서 ${jo(FLAT[t], '과', '와')} ${FLAT[u]}은 모두 몇 개일까요?${svg}`, cnt[t] + cnt[u], { unit: '개' }); }
    ];
    return (lv === 2 ? pick([...adv, ...adv, ...basic]) : pick(basic))();
  });

  /* 1-2-4. 덧셈과 뺄셈(2) — 세 수, 10 만들기, 10에서 빼기 */
  R('g1u9', (lv) => {
    const basic = [
      () => { const a = ri(1, 5), b = ri(1, 7 - a), c = ri(1, 9 - a - b); if (c < 1) return null; return P.int(`${a} + ${b} + ${c} = □`, a + b + c); },
      () => { const a = ri(4, 9), b = ri(1, a - 2), c = ri(1, a - b - 1); return P.int(`${a} − ${b} − ${c} = □`, a - b - c); },
      () => { const a = ri(1, 9), first = Math.random() < .5; return P.int(first ? `${a} + □ = 10` : `□ + ${a} = 10`, 10 - a); },
      () => { const a = ri(1, 9); return P.int(`10 − ${a} = □`, 10 - a); },
      () => { const a = ri(1, 9), c = ri(1, 9), pos = ri(0, 2); const b = 10 - a; const exp = pos === 0 ? `${a} + ${b} + ${c}` : pos === 1 ? `${c} + ${a} + ${b}` : `${a} + ${c} + ${b}`; return P.int(`${exp} = □`, 10 + c); }
    ];
    const adv = [
      () => { const a = ri(1, 9); return P.int(`사탕 10개 중에서 ${a}개를 먹었습니다. 남은 사탕은 몇 개일까요?`, 10 - a, { unit: '개', word: true }); },
      () => { const a = ri(1, 7), b = 10 - a, c = ri(1, 9); return P.int(`꽃밭에 빨간 꽃 ${a}송이, 노란 꽃 ${b}송이, 흰 꽃 ${c}송이가 피었습니다. 꽃은 모두 몇 송이일까요?`, a + b + c, { unit: '송이', word: true }); },
      () => { const a = ri(1, 9), right = `${jo(a, '과', '와')} ${10 - a}`; const wr = []; for (let i = 0; i < 6; i++) { const x = ri(1, 8), y = ri(1, 9); if (x + y !== 10) wr.push(`${jo(x, '과', '와')} ${y}`); } return mkChoice(`더해서 10이 되는 두 수를 고르세요.`, right, wr, 4); },
      () => { const a = ri(1, 9); return P.int(`10 − □ = ${a} 에서 □에 알맞은 수를 쓰세요.`, 10 - a); },
      () => { const a = ri(2, 8), b = ri(1, 9 - a), c = ri(1, a + b); return P.int(`${a} + ${b} − ${c} = □`, a + b - c); },
      () => { const a = ri(6, 9), b = ri(1, a - 2), c = ri(1, a - b - 1); return P.int(`귤이 ${a}개 있었습니다. 동생이 ${b}개, 내가 ${c}개 먹었습니다. 남은 귤은 몇 개일까요?`, a - b - c, { unit: '개', word: true }); }
    ];
    return (lv === 2 ? pick([...adv, ...adv, ...basic]) : pick(basic))();
  });

  /* 1-2-5. 시계 보기와 규칙 찾기 */
  R('g1u10', (lv) => {
    const SYM = [['🔴', '🔵', '🟡'], ['🍎', '🍌', '🍇'], ['○', '△', '□'], ['⭐', '🌙', '☀️'], ['🐶', '🐱', '🐰']];
    const PATS = [[0, 1], [0, 0, 1], [0, 1, 1], [0, 1, 2], [0, 1, 2, 1], [0, 0, 1, 1]];
    const basic = [
      () => { const h = ri(1, 12), m = pick([0, 30]); const correct = tl(h, m); const wr = m ? [tl(nextH(h), 30), tl(h, 0), tl(nextH(h), 0), tl(prevH(h), 30)] : [tl(h, 30), tl(nextH(h), 0), tl(prevH(h), 0), tl(prevH(h), 30)]; return mkChoice(`시계를 보고 몇 시인지 고르세요.${clock(h, m)}`, correct, wr, 4); },
      () => { const h = ri(1, 12); return P.int(`긴바늘이 12, 짧은바늘이 ${jo(h, '을', '를')} 가리키면 몇 시일까요?`, h, { unit: '시' }); },
      () => { const s = SYM[ri(0, SYM.length - 1)], p = pick(PATS), len = ri(6, 8); const seq = Array.from({ length: len + 1 }, (_, i) => s[p[i % p.length]]); const used = [...new Set(p)].map(i => s[i]); if (used.length < 2) return null; const ans = seq[len]; const opts = s.slice(0, Math.max(...p) + 1); return P.choice(`규칙에 따라 ?에 알맞은 것을 고르세요.<div style="font-size:1.5em;letter-spacing:3px;margin:6px 0">${seq.slice(0, len).join(' ')} ?</div>`, opts, opts.indexOf(ans)); },
      () => { const step = pick([1, 2, 5, 10]), down = Math.random() < .3, s = down ? ri(30, 99) : ri(1, 50), seq = [0, 1, 2, 3, 4].map(i => s + (down ? -1 : 1) * i * step), k = ri(1, 4); if (seq[4] < 1 || seq[4] > 100) return null; return P.int(`규칙에 따라 □에 알맞은 수를 쓰세요. ${seq.map((x, i) => i === k ? '□' : x).join(', ')}`, seq[k]); },
      () => { const h = ri(1, 12); return P.choice(`${h}시 30분일 때 짧은바늘은 어디를 가리킬까요?`, [`${jo(h, '을', '를')} 가리킵니다`, `${jo(h, '과', '와')} ${nextH(h)}의 가운데`, `${jo(prevH(h), '과', '와')} ${h}의 가운데`], 1); }
    ];
    const adv = [
      () => { const h = ri(6, 8), m = pick([0, 30]); const t1 = [h, m], t2 = pick([[h, 30 - m], [h + 1, m], [h + 1, 30 - m]]); if (t2[0] === h && t2[1] === m) return null; const [a, b] = shuffle(KIDS).slice(0, 2); const early = Math.random() < .5; const v1 = t1[0] * 60 + t1[1], v2 = t2[0] * 60 + t2[1]; const sw = Math.random() < .5; const ta = sw ? t2 : t1, tb = sw ? t1 : t2, va = sw ? v2 : v1, vb = sw ? v1 : v2; return P.choice(`아침에 ${jo(a, '이는', '는')} ${tl(...ta)}에, ${jo(b, '이는', '는')} ${tl(...tb)}에 일어났습니다. 더 ${early ? '일찍' : '늦게'} 일어난 사람은 누구일까요?`, [a, b], (early ? va < vb : va > vb) ? 0 : 1, { word: true }); },
      () => { const s = SYM[ri(0, SYM.length - 1)], p = pick(PATS), k = ri(9, 15); const opts = s.slice(0, Math.max(...p) + 1); const shown = Array.from({ length: p.length * 2 }, (_, i) => s[p[i % p.length]]); return P.choice(`규칙에 따라 늘어놓았습니다. ${k}번째에 오는 것은 무엇일까요?<div style="font-size:1.5em;letter-spacing:3px;margin:6px 0">${shown.join(' ')} …</div>`, opts, opts.indexOf(s[p[(k - 1) % p.length]])); },
      () => { const h = ri(1, 12), m = pick([0, 30]), hand = Math.random() < .5; if (hand) return P.int(`${tl(h, m)}에 긴바늘은 어떤 숫자를 가리킬까요?`, m ? 6 : 12); return P.choice(`${jo(tl(h, m), '을', '를')} 시계에 나타낼 때 짧은바늘은 어디를 가리킬까요?`, [`숫자 ${h}`, `${jo(h, '과', '와')} ${nextH(h)}의 가운데`, `숫자 ${nextH(h)}`], m ? 1 : 0); },
      () => { const c = ri(1, 9) * 10 + ri(1, 2), down = Math.random() < .5, seq = [0, 1, 2, 3].map(i => c + (down ? 1 : 10) * i), k = ri(1, 3); if (seq[3] > 100) return null; return P.int(`수 배열표에서 ${down ? '오른쪽으로 한 칸씩' : '아래로 한 칸씩'} 가며 수를 읽었습니다. □에 알맞은 수를 쓰세요. ${seq.map((x, i) => i === k ? '□' : x).join(', ')}`, seq[k]); },
      () => { const p = pick([[1, 2], [1, 2, 2], [1, 1, 2], [3, 1], [5, 0], [2, 4, 6]]); const len = ri(5, 7); const seq = Array.from({ length: len }, (_, i) => p[i % p.length]); return P.int(`규칙에 따라 □에 알맞은 수를 쓰세요. ${seq.join(', ')}, □`, p[len % p.length]); }
    ];
    return (lv === 2 ? pick([...adv, ...adv, ...basic]) : pick(basic))();
  });

  /* 1-2-6. 덧셈과 뺄셈(3) — 받아올림 (몇)+(몇), 받아내림 (십몇)−(몇) */
  R('g1u11', (lv) => {
    const carry = () => { const a = ri(2, 9), b = ri(Math.max(2, 11 - a), 9); return [a, b]; };
    const borrow = () => { const n = ri(11, 18), b = ri(n % 10 + 1, 9); return n - b <= 9 ? [n, b] : null; };
    const basic = [
      () => { const [a, b] = carry(); return P.int(`${a} + ${b} = □`, a + b); },
      () => { const r = borrow(); if (!r) return null; const [n, b] = r; return P.int(`${n} − ${b} = □`, n - b); },
      () => { const [a, b] = carry(); return P.int(`${a} + ${b}에서 ${b}${hasB(b) ? '을' : '를'} ${jo(10 - a, '과', '와')} □로 갈라 10을 만들어 계산하려고 합니다. □에 알맞은 수를 쓰세요.`, b - (10 - a)); },
      () => { const r = borrow(); if (!r) return null; const [n, b] = r; const o = n % 10; return P.int(`${n} − ${b}에서 ${b}${hasB(b) ? '을' : '를'} ${jo(o, '과', '와')} □로 갈라 계산하려고 합니다. □에 알맞은 수를 쓰세요.`, b - o); },
      () => { const [e, name, u] = pick(EMO), [a, b] = carry(); return P.int(`${jo(name, '이', '가')} 접시에 ${a}${u}, 바구니에 ${b}${u} 있습니다. ${jo(name, '은', '는')} 모두 몇 ${u}일까요?${row(e, a)}${row(e, b)}`, a + b, { unit: u }); }
    ];
    const adv = [
      () => { const [a, b] = carry(); return P.int(`구슬을 민수는 ${a}개, 지아는 ${b}개 가지고 있습니다. 두 사람이 가진 구슬은 모두 몇 개일까요?`, a + b, { unit: '개', word: true }); },
      () => { const r = borrow(); if (!r) return null; const [n, b] = r; return P.int(`쿠키 ${n}개 중에서 ${b}개를 먹었습니다. 남은 쿠키는 몇 개일까요?`, n - b, { unit: '개', word: true }); },
      () => { const r = borrow(); if (!r) return null; const [n, b] = r; return P.int(`우리 반 남학생은 ${n}명, 여학생은 ${b}명입니다. 남학생은 여학생보다 몇 명 더 많을까요?`, n - b, { unit: '명', word: true }); },
      () => { const [a, b] = carry(); return P.int(`${a} + □ = ${a + b} 에서 □에 알맞은 수를 쓰세요.`, b); },
      () => { const r = borrow(); if (!r) return null; const [n, b] = r; return P.int(`${n} − □ = ${n - b} 에서 □에 알맞은 수를 쓰세요.`, b); },
      () => { const ex = []; const vals = []; for (let i = 0; i < 3; i++) { if (Math.random() < .5) { const [a, b] = carry(); ex.push(`${a} + ${b}`); vals.push(a + b); } else { const r = borrow(); if (!r) return null; ex.push(`${r[0]} − ${r[1]}`); vals.push(r[0] - r[1]); } } if (new Set(vals).size < 3 || new Set(ex).size < 3) return null; const big = Math.random() < .5; return P.choice(`계산 결과가 가장 ${big ? '큰' : '작은'} 것을 고르세요.`, ex, vals.indexOf(big ? Math.max(...vals) : Math.min(...vals))); },
      () => { const cs = distinctNums(4, 2, 9), s = cs.slice().sort((x, y) => y - x); if (s[0] + s[1] < 11) return null; return P.int(`수 카드 ${cs.join(', ')} 중에서 2장을 골라 더하려고 합니다. 가장 큰 합은 얼마일까요?`, s[0] + s[1]); }
    ];
    return (lv === 2 ? pick([...adv, ...adv, ...basic]) : pick(basic))();
  });
})();
