/* 쌤픽 — 고등 1:1 온라인 개념 과외 · 대입 족집게 · 대치동식 전략 도구
   모든 개념 정리·문제·해설은 쌤픽이 직접 작성한 학습 자료입니다(기출·교재 원문 미사용). */
(function () {
  'use strict';
  const MS = () => window.MS;
  const HA = () => window.HighApp;
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const pad = (n) => String(n).padStart(2, '0');
  const ymd = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
  const addDays = (n) => { const d = new Date(); d.setDate(d.getDate() + n); return ymd(d); };
  const layout = (nav, html) => MS().layout(nav, `<div class="hi">${html}</div>`);

  /* ---------- 개념 과외 커리큘럼 ----------
     c: 개념 정리 3줄 · p: 족집게 한 줄 · t: 자주 하는 실수 · q: 확인 문제 [문제, 보기, 정답 index, 해설] */
  const SUBJ = [
    { k: 'kor', n: '국어', ic: '📖', c: '#E5484D' },
    { k: 'math', n: '수학', ic: '📐', c: '#4A7DF0' },
    { k: 'eng', n: '영어', ic: '🔤', c: '#7C3AED' },
    { k: 'his', n: '한국사', ic: '🏛️', c: '#B45309' },
    { k: 'soc', n: '사회탐구', ic: '🌏', c: '#0891B2' },
    { k: 'sci', n: '과학탐구', ic: '🔬', c: '#16A34A' }
  ];
  const C = [
    // 국어
    { id: 'k1', s: 'kor', t: '독서 · 정보 사이의 관계 읽기', hot: 1,
      c: ['독서 지문은 결국 "개념 A와 B가 어떤 관계인가"를 묻는다. 관계는 인과·대조·상위/하위·조건 네 가지가 대부분이다.', '문단을 읽을 때마다 핵심어 1개와 그 문단이 앞 문단과 맺는 관계(그래서/그러나/예를 들어)를 여백에 적는다.', '선지는 지문의 관계를 뒤집거나(원인↔결과), 범위를 바꾸는(일부↔전부) 방식으로 오답을 만든다.'],
      p: '선지를 읽기 전에 "이 문단은 앞 문단의 원인·반론·사례 중 무엇인가"를 먼저 정해 두면 정답이 빨리 보인다.',
      trap: '모르는 배경지식으로 답을 고르는 것. 정답 근거는 언제나 지문 안 문장 하나다.',
      q: ['다음 중 독서 지문 선지가 오답을 만드는 대표 방식이 아닌 것은?', ['원인과 결과를 뒤바꾼다', '"일부"를 "모든"으로 바꾼다', '지문의 문장을 그대로 옮긴다', '조건이 붙은 진술에서 조건을 뺀다'], 2, '지문 문장을 그대로 옮긴 선지는 대체로 맞는 진술이다. 오답은 관계를 뒤집거나 범위·조건을 바꿔서 만든다.'] },
    { id: 'k2', s: 'kor', t: '문학 · 화자와 상황·정서·태도', hot: 1,
      c: ['시는 "누가(화자) · 어떤 상황에서 · 어떤 정서를 · 어떤 태도로" 말하는지 네 칸만 채우면 대부분의 문제가 풀린다.', '정서는 그리움·슬픔·기쁨처럼 마음이고, 태도는 체념·의지·성찰·예찬처럼 대상에 대한 자세다. 둘을 구분한다.', '소설은 서술자 위치(1인칭/3인칭)와 갈등 구조(인물↔인물, 인물↔사회)를 먼저 잡는다.'],
      p: 'EBS 연계 작품은 네 칸(화자·상황·정서·태도)을 한 줄로 정리해 두면, 낯선 작품과 묶여 나와도 비교 문제가 풀린다.',
      trap: '정서와 태도를 섞어 쓰는 것. "슬프지만 이겨 내려 한다"면 정서는 슬픔, 태도는 극복 의지다.',
      q: ['"님은 떠났지만 나는 다시 만날 날을 믿고 기다린다"는 화자의 태도로 가장 알맞은 것은?', ['체념', '냉소', '기다림과 믿음(의지)', '자기 비판'], 2, '떠난 상황(이별)에서 정서는 그리움·슬픔이지만, 다시 만날 것을 믿고 기다리는 것은 의지적 태도다.'] },
    { id: 'k3', s: 'kor', t: '문학 · 표현법 핵심 6개', hot: 1,
      c: ['역설: 겉으로는 모순이지만 속에 진실이 있는 표현(예: 찬란한 슬픔). 반어: 속뜻과 반대로 말하는 표현.', '설의법은 답이 정해진 질문으로 강조하고, 대구법은 비슷한 짜임의 문장을 나란히 놓아 리듬을 만든다.', '감정 이입은 화자의 감정을 대상에 옮긴 것, 객관적 상관물은 화자의 감정을 불러일으키거나 드러내는 사물 전체다.'],
      p: '역설은 "한 구절 안에서" 모순, 반어는 "상황·말과 속뜻 사이"의 모순. 이 기준 하나로 둘을 구분한다.',
      trap: '감정 이입과 객관적 상관물을 같은 것으로 보는 것. 감정 이입은 객관적 상관물 중 대상이 화자와 같은 감정을 가진 경우다.',
      q: ['"찬란한 슬픔의 봄"에 쓰인 표현법은?', ['반어', '역설', '설의', '대구'], 1, '찬란함과 슬픔이 한 구절 안에서 모순을 이루지만 그 속에 진실(봄을 맞는 복잡한 마음)이 담겨 있어 역설이다.'] },
    { id: 'k4', s: 'kor', t: '문법 · 음운 변동 4가지', hot: 1,
      c: ['교체: 한 음운이 다른 음운으로 바뀜(비음화, 유음화, 구개음화, 된소리되기, 음절의 끝소리 규칙).', '탈락(자음군 단순화, ㅎ 탈락), 첨가(ㄴ 첨가), 축약(거센소리되기: ㄱ·ㄷ·ㅂ·ㅈ + ㅎ → ㅋ·ㅌ·ㅍ·ㅊ).', '음운 개수 문제는 "변동 전 음운 수 − 변동 후 음운 수"로 탈락·축약은 줄고, 첨가는 늘고, 교체는 그대로다.'],
      p: '단어 하나에 변동이 2개 이상 일어나는 문제가 단골. 순서대로 한 단계씩 적으면 실수가 없다.',
      trap: '거센소리되기(축약)를 교체로 착각하는 것. 두 음운이 하나로 합쳐지면 축약이다.',
      q: ['"국물[궁물]"에서 일어난 음운 변동의 종류는?', ['교체(비음화)', '탈락', '첨가', '축약'], 0, 'ㄱ이 뒤의 비음 ㅁ의 영향으로 비음 ㅇ으로 바뀌었다. 음운이 다른 음운으로 바뀌는 교체(비음화)다.'] },
    { id: 'k5', s: 'kor', t: '문법 · 서술어의 자릿수', hot: 0,
      c: ['서술어가 문장을 완성하려고 반드시 필요로 하는 성분의 수가 자릿수다.', '한 자리: 주어만(꽃이 피다). 두 자리: 주어 + 목적어/보어/필수 부사어(물이 얼음이 되다). 세 자리: 주어 + 목적어 + 필수 부사어(주다, 넣다, 삼다).', '같은 단어도 뜻에 따라 자릿수가 달라진다(길이 막히다 / 차가 길을 막다).'],
      p: '"~에게, ~로, ~와"가 빠졌을 때 문장이 어색해지면 필수 부사어. 이 판정이 자릿수 문제의 전부다.',
      trap: '부사어는 모두 생략 가능하다고 생각하는 것. 필수 부사어는 빼면 문장이 불완전해진다.',
      q: ['"철수가 영희에게 책을 주었다"의 서술어 "주다"는 몇 자리 서술어인가?', ['한 자리', '두 자리', '세 자리', '네 자리'], 2, '주어(철수가), 목적어(책을), 필수 부사어(영희에게)가 모두 필요하므로 세 자리 서술어다.'] },
    { id: 'k6', s: 'kor', t: '독서 · 비례 관계 추론(경제·과학 지문)', hot: 1,
      c: ['경제·과학 지문은 "A가 늘면 B는 줄고, B가 줄면 C는 는다" 같은 연쇄 관계를 묻는 3점 문항이 단골이다.', '관계를 화살표와 +/− 부호로 적는다. 부호를 곱하면 최종 방향이 나온다(− × − = +).', '조건(단, ~일 때)이 붙으면 그 조건에서만 관계가 성립한다는 점을 표시한다.'],
      p: '보기 문제는 지문 관계도에 숫자만 넣어 보는 것. 관계도를 먼저 그려 두면 보기에서 시간을 아낀다.',
      trap: '머릿속으로만 연쇄 추론을 하다 방향을 뒤집는 것. 반드시 종이에 부호로 적는다.',
      q: ['A가 증가하면 B는 감소하고, B가 감소하면 C는 증가한다. A가 증가하면 C는?', ['증가한다', '감소한다', '변하지 않는다', '알 수 없다'], 0, 'A→B는 −, B→C도 −(B가 줄면 C가 늘기 때문). − × − = + 이므로 A가 증가하면 C도 증가한다.'] },
    // 수학
    { id: 'm1', s: 'math', t: '지수·로그의 성질과 조건', hot: 1,
      c: ['log_a(xy) = log_a x + log_a y, log_a(x/y) = log_a x − log_a y, log_a xⁿ = n·log_a x.', '밑 조건 a > 0, a ≠ 1과 진수 조건 x > 0은 문제에 안 써 있어도 항상 따라붙는다.', '밑 변환: log_a b = log_c b / log_c a. 밑이 다른 로그는 밑을 통일한 뒤 계산한다.'],
      p: '방정식·부등식을 풀고 나서 진수 조건으로 해를 걸러내는 단계가 곧 점수. 마지막 줄에 조건 확인을 습관화한다.',
      trap: '로그 부등식에서 밑이 0과 1 사이일 때 부등호 방향을 바꾸지 않는 것.',
      q: ['log₂8 + log₂4의 값은?', ['5', '6', '12', '32'], 0, 'log₂8 = 3, log₂4 = 2이므로 합은 5다. (= log₂32 = 5로 계산해도 같다.)'] },
    { id: 'm2', s: 'math', t: '삼각함수의 그래프(주기·최댓값)', hot: 1,
      c: ['y = a·sin(bx + c) + d에서 최댓값은 |a| + d, 최솟값은 −|a| + d다.', '주기는 sin·cos이 2π/|b|, tan는 π/|b|다.', 'c는 그래프를 x축 방향으로, d는 y축 방향으로 평행이동시킨다.'],
      p: '그래프 문제는 "주기·최대·최소·지나는 점" 4개 정보로 a, b, c, d를 역추적하는 것이 기본 틀이다.',
      trap: '주기를 2π·|b|로 곱해 버리는 실수. b가 커지면 그래프가 촘촘해져 주기는 짧아진다.',
      q: ['y = 3sin(2x) + 1의 최댓값과 주기는?', ['최댓값 4, 주기 π', '최댓값 3, 주기 2π', '최댓값 4, 주기 4π', '최댓값 1, 주기 π'], 0, '최댓값은 |3| + 1 = 4, 주기는 2π/2 = π다.'] },
    { id: 'm3', s: 'math', t: '수열의 합과 시그마', hot: 1,
      c: ['등차수열 aₙ = a + (n − 1)d, 합 Sₙ = n(a₁ + aₙ)/2. 등비수열 aₙ = a·rⁿ⁻¹.', 'Σk = n(n + 1)/2, Σk² = n(n + 1)(2n + 1)/6, Σk³ = {n(n + 1)/2}².', 'Σ는 더하기·상수배로 나눠 계산할 수 있지만, 곱(Σaₖbₖ)은 나눌 수 없다.'],
      p: 'aₙ = Sₙ − Sₙ₋₁ (n ≥ 2), a₁ = S₁. 합에서 일반항을 구하는 문제는 이 두 줄로 끝난다.',
      trap: 'aₙ = Sₙ − Sₙ₋₁을 n = 1에도 적용하는 것. a₁은 반드시 S₁로 따로 확인한다.',
      q: ['Σ(k=1~10) (2k + 1)의 값은?', ['110', '120', '121', '130'], 1, '2·Σk + Σ1 = 2·55 + 10 = 120.'] },
    { id: 'm4', s: 'math', t: '함수의 극한과 연속', hot: 1,
      c: ['x = a에서 극한이 존재하려면 좌극한 = 우극한이어야 한다.', '연속의 조건: f(a)가 정의되고, 극한이 존재하고, 그 극한값 = f(a).', '구간별로 정의된 함수는 경계점에서 "왼쪽 식의 값 = 오른쪽 식의 값"으로 미정계수를 구한다.'],
      p: '0/0 꼴 극한에서 분모 → 0이면 분자 → 0이어야 한다. 이 조건으로 미정계수를 먼저 하나 구한다.',
      trap: '극한값이 존재하는 것과 연속인 것을 같은 것으로 보는 것. 함숫값까지 같아야 연속이다.',
      q: ['f(x) = x + a (x < 1), 2x (x ≥ 1)가 x = 1에서 연속일 때 a는?', ['0', '1', '2', '3'], 1, '좌극한 1 + a = f(1) = 2이므로 a = 1.'] },
    { id: 'm5', s: 'math', t: '미분 · 증가·감소와 극값', hot: 1,
      c: ['f′(x) > 0인 구간에서 증가, f′(x) < 0인 구간에서 감소한다.', '극값은 f′(x) = 0이면서 그 점 좌우에서 f′의 부호가 바뀌는 곳에서 생긴다(+ → −는 극대, − → +는 극소).', '삼차함수가 극값을 가지려면 f′(x) = 0이 서로 다른 두 실근을 가져야 한다(판별식 > 0).'],
      p: '그래프 개형 문제는 f′의 부호표 한 줄만 그리면 된다. 증감표를 먼저 그리는 습관이 준킬러를 잡는다.',
      trap: 'f′(x) = 0인 점이면 무조건 극값이라고 보는 것. 부호가 안 바뀌면(예: x³의 x = 0) 극값이 아니다.',
      q: ['f(x) = x³ − 3x의 극댓값은?', ['−2', '0', '2', '3'], 2, 'f′(x) = 3x² − 3 = 0에서 x = ±1. x = −1에서 + → −로 바뀌므로 극대, f(−1) = −1 + 3 = 2.'] },
    { id: 'm6', s: 'math', t: '정적분과 넓이', hot: 1,
      c: ['∫ₐᵇ f(x)dx = F(b) − F(a) (F는 f의 부정적분).', '넓이는 |f(x)|를 적분한다. 그래프가 x축 아래로 내려가는 구간은 나눠서 부호를 바꾼다.', 'd/dx ∫ₐˣ f(t)dt = f(x). 적분으로 정의된 함수는 미분하고, x = a를 대입해 0이 되는 조건을 함께 쓴다.'],
      p: '"∫ₐˣ f(t)dt = 다항식" 꼴은 ① 양변 미분 ② x = a 대입 두 단계로 거의 모든 문제가 풀린다.',
      trap: '넓이를 구할 때 정적분 값을 그대로 쓰는 것. x축 아래 부분이 있으면 값이 작게 나온다.',
      q: ['∫₀² 3x² dx의 값은?', ['4', '6', '8', '12'], 2, '부정적분 x³에 대입하면 2³ − 0³ = 8.'] },
    { id: 'm7', s: 'math', t: '확률 · 조건부확률과 독립', hot: 1,
      c: ['조건부확률 P(B|A) = P(A∩B) / P(A). "A가 일어났을 때"는 표본공간이 A로 줄어든다는 뜻이다.', '독립이면 P(A∩B) = P(A)·P(B). 배반(동시에 안 일어남)과 독립은 전혀 다른 개념이다.', '표(2×2 분할표)를 그리면 조건부확률 문제의 절반은 계산 없이 보인다.'],
      p: '문장에 "~였을 때, ~일 확률"이 보이면 분모가 바뀌는 조건부확률. 분모를 먼저 표시한다.',
      trap: '배반사건을 독립이라고 착각하는 것. 확률이 0이 아닌 두 배반사건은 오히려 독립이 아니다.',
      q: ['P(A) = 0.5, P(A∩B) = 0.2일 때 P(B|A)는?', ['0.1', '0.25', '0.4', '0.7'], 2, 'P(B|A) = 0.2 / 0.5 = 0.4.'] },
    { id: 'm8', s: 'math', t: '경우의 수 · 중복조합', hot: 0,
      c: ['서로 다른 n개에서 중복을 허락해 r개를 고르는 경우의 수: ₙHᵣ = ₙ₊ᵣ₋₁Cᵣ.', 'x + y + z = n의 음이 아닌 정수해 개수는 ₃Hₙ.', '양의 정수해는 각 변수에서 1씩 먼저 빼서 음이 아닌 정수해 문제로 바꾼다.'],
      p: '"공을 상자에 나눠 담기", "정수해의 개수", "중복을 허락한 선택"은 모두 같은 중복조합 문제다.',
      trap: '양의 정수해 조건을 놓치고 ₃Hₙ을 그대로 쓰는 것.',
      q: ['x + y + z = 5를 만족하는 음이 아닌 정수 (x, y, z)의 개수는?', ['15', '21', '35', '10'], 1, '₃H₅ = ₇C₅ = 21.'] },
    // 영어
    { id: 'e1', s: 'eng', t: '빈칸 추론 · 주제문 찾기', hot: 1,
      c: ['빈칸 문장은 대부분 글의 주제문이거나 주제를 다르게 표현한 문장이다.', '빈칸 앞뒤의 연결어(however, in other words, thus)가 빈칸이 앞 내용과 같은지 반대인지 알려 준다.', '선지는 주제와 같은 방향인지, 너무 좁거나 넓지 않은지로 소거한다.'],
      p: '빈칸 문장을 먼저 읽고, 나머지 문장을 "빈칸을 설명하는 근거"로 읽는다. 순서를 바꾸면 시간이 반으로 준다.',
      trap: '지문에 나온 단어가 그대로 있는 선지를 고르는 것. 단어 일치는 매력적인 오답의 대표 패턴이다.',
      q: ['빈칸 추론에서 가장 먼저 확인할 것은?', ['모르는 단어의 뜻', '빈칸 문장이 글의 주제문인지', '선지에 지문 단어가 있는지', '지문의 길이'], 1, '빈칸 문장이 주제문이면 글 전체가 빈칸의 근거가 된다. 주제를 먼저 잡고 선지를 소거한다.'] },
    { id: 'e2', s: 'eng', t: '순서 배열 · 문장 삽입 단서', hot: 1,
      c: ['대명사(it, they, this), 지시어(such, these), 정관사 the는 앞에 나온 대상을 가리킨다.', '연결어 however·instead는 흐름 전환, for example은 앞 내용의 구체화, as a result는 결과다.', '문장 삽입은 "흐름이 끊기는 곳"을 찾는 문제다. 갑자기 대명사가 가리킬 대상이 없어지는 자리가 정답이다.'],
      p: '각 덩어리(A)(B)(C)의 첫 문장 단서와 마지막 문장 내용을 연결해 보면 순서가 바로 정해진다.',
      trap: '내용만 보고 순서를 정하는 것. 문법적 단서(대명사·관사)가 내용 추측보다 정확하다.',
      q: ['다음 중 앞 문장과의 연결을 알려 주는 단서로 보기 어려운 것은?', ['this problem', 'However,', 'the result', 'Many people'], 3, 'Many people은 앞 내용을 가리키지 않는 새 주어다. this·the·However는 앞 문장과의 관계를 직접 보여 준다.'] },
    { id: 'e3', s: 'eng', t: '어법 · 주어-동사 수 일치', hot: 1,
      c: ['주어와 동사 사이의 수식어(전치사구, 관계절, 분사구)는 괄호로 묶고 진짜 주어를 찾는다.', 'The number of + 복수명사 → 단수 동사, A number of + 복수명사 → 복수 동사.', '동명사·to부정사·명사절 주어는 단수 취급한다.'],
      p: '밑줄이 동사에 있으면 "주어 찾기 → 수 일치 → 시제 → 태" 순서로 4초 안에 확인한다.',
      trap: '동사 바로 앞의 명사를 주어로 착각하는 것.',
      q: ['The number of students who use smartphones ___ increasing.', ['are', 'is', 'were', 'have been'], 1, '주어는 The number(단수)다. 따라서 단수 동사 is가 맞다.'] },
    { id: 'e4', s: 'eng', t: '어법 · what과 that(관계사)', hot: 1,
      c: ['what은 선행사를 포함한 관계대명사(= the thing which)로, 앞에 명사가 없고 뒤 문장이 불완전하다.', 'that(관계대명사)은 앞에 선행사가 있고 뒤 문장이 불완전하다. 접속사 that은 뒤 문장이 완전하다.', '전치사 뒤와 콤마 뒤(계속적 용법)에는 관계대명사 that을 쓸 수 없다.'],
      p: '"앞에 명사 있나? 뒤 문장 완전한가?" 두 질문으로 what / that / which / 접속사 that이 모두 구분된다.',
      trap: '선행사가 있는데 what을 쓰는 실수.',
      q: ['This is the book ___ I bought yesterday.', ['what', 'that', 'whom', 'where'], 1, '선행사 the book이 있고, 뒤 문장에 목적어가 없다(불완전). 사물 선행사의 목적격 관계대명사 that(또는 which)이 맞다.'] },
    { id: 'e5', s: 'eng', t: '절대평가 1등급 전략', hot: 0,
      c: ['영어는 절대평가로 90점 이상이면 1등급, 80점 이상이면 2등급이다(10점 간격).', '듣기 17문항을 만점으로 지키면 독해에서 틀려도 되는 개수가 정해진다.', '3점 문항(빈칸·순서·삽입) 위주로 오답이 나오므로, 2점 문항에서 실수를 줄이는 것이 1등급의 조건이다.'],
      p: '모의고사마다 "틀린 문항 번호 + 유형"만 기록하면, 내가 1등급을 잃는 유형이 3회 만에 보인다.',
      trap: '어려운 빈칸 문제에 시간을 써서 쉬운 뒷번호 문제를 못 푸는 것. 막히면 표시하고 넘어간다.',
      q: ['수능 영어에서 1등급의 기준은?', ['상위 4%', '90점 이상', '95점 이상', '표준점수 130 이상'], 1, '영어는 절대평가로 원점수 90점 이상이면 1등급이다.'] },
    // 한국사
    { id: 'h1', s: 'his', t: '근대 사건의 순서', hot: 1,
      c: ['강화도 조약(1876) → 임오군란(1882) → 갑신정변(1884) → 동학 농민 운동·갑오개혁(1894) → 을미사변(1895).', '대한 제국 수립(1897) → 러·일 전쟁(1904) → 을사늑약(1905) → 국권 피탈(1910).', '순서 문제는 "개항 → 개화 시도 → 농민 운동·개혁 → 국권 침탈" 네 단계 흐름으로 먼저 위치를 잡는다.'],
      p: '연도를 다 외우기보다 각 사건의 "원인 → 결과" 연결을 기억하면 순서가 자동으로 정해진다.',
      trap: '갑신정변(1884)과 갑오개혁(1894)을 혼동하는 것. 10년 차이를 기억한다.',
      q: ['다음 중 가장 먼저 일어난 사건은?', ['갑오개혁', '을미사변', '갑신정변', '을사늑약'], 2, '갑신정변(1884) → 갑오개혁(1894) → 을미사변(1895) → 을사늑약(1905).'] },
    { id: 'h2', s: 'his', t: '조선의 통치 체제(3사)', hot: 0,
      c: ['중앙: 의정부(최고 합의 기구)와 6조(이·호·예·병·형·공조)가 행정을 맡았다.', '3사(사헌부·사간원·홍문관)는 언론 기능으로 권력의 독점과 부정을 견제했다.', '의금부는 국왕 직속 사법 기구, 승정원은 왕명 출납 기구다.'],
      p: '"권력 견제·언론"이 보이면 3사, "왕명 출납"은 승정원, "국가 중죄 재판"은 의금부.',
      trap: '의금부를 3사에 넣는 실수.',
      q: ['조선의 3사에 속하지 않는 기관은?', ['사헌부', '사간원', '홍문관', '의금부'], 3, '3사는 사헌부·사간원·홍문관이다. 의금부는 국왕 직속 사법 기구다.'] },
    { id: 'h3', s: 'his', t: '일제 식민 통치의 시기 구분', hot: 1,
      c: ['1910년대 무단 통치: 헌병 경찰제, 토지 조사 사업.', '1920년대 이른바 문화 통치(3·1 운동 이후): 보통 경찰제로 바꿨지만 감시는 강화, 산미 증식 계획.', '1930년대 후반~ 민족 말살 통치: 황국 신민화, 신사 참배, 창씨개명, 전시 동원.'],
      p: '자료에 나온 정책 하나로 시기를 정하고, 그 시기의 다른 정책을 고르는 문제가 대표 유형이다.',
      trap: '문화 통치기에 감시가 약해졌다고 보는 것. 경찰 수와 예산은 오히려 늘었다.',
      q: ['창씨개명이 강요된 시기의 통치 방식은?', ['무단 통치', '문화 통치', '민족 말살 통치', '통감 정치'], 2, '창씨개명은 1940년 시행된 민족 말살 통치기의 정책이다.'] },
    { id: 'h4', s: 'his', t: '현대사 · 민주주의의 발전', hot: 1,
      c: ['4·19 혁명(1960): 3·15 부정 선거에 저항, 이승만 정부 붕괴.', '5·18 민주화 운동(1980): 신군부에 맞선 광주 시민의 민주화 운동.', '6월 민주 항쟁(1987): 대통령 직선제 개헌을 이끌어 냄(6·29 선언).'],
      p: '"결과"를 묻는 문제가 많다. 4·19 → 정부 붕괴, 6월 항쟁 → 직선제 개헌. 결과 하나씩 짝지어 기억한다.',
      trap: '5·18과 6월 민주 항쟁의 결과를 바꿔 기억하는 것.',
      q: ['6월 민주 항쟁의 결과로 옳은 것은?', ['유신 헌법 제정', '대통령 직선제 개헌', '3·15 부정 선거', '5·16 군사 정변'], 1, '1987년 6월 민주 항쟁의 결과 6·29 선언이 나오고 대통령 직선제 개헌이 이루어졌다.'] },
    // 사회탐구
    { id: 's1', s: 'soc', t: '표·그래프 · 비율과 실제 수', hot: 1,
      c: ['비율(%)이 높다고 실제 수가 많은 것이 아니다. 실제 수 = 전체 × 비율.', '증가율과 증가량을 구분한다. 작은 값에서의 증가율은 크게 나온다.', '사회·문화의 표 문제는 가상의 숫자(전체 100 또는 1000)를 넣어 직접 계산하면 가장 빠르다.'],
      p: '선지에 "많다/적다"가 나오면 실제 수, "높다/낮다"가 나오면 비율을 묻는 것. 단어부터 표시한다.',
      trap: '비율만 보고 인원수를 비교하는 것.',
      q: ['A집단 100명 중 20%, B집단 300명 중 10%가 봉사 활동에 참여했다. 참여 인원이 더 많은 집단은?', ['A집단', 'B집단', '같다', '알 수 없다'], 1, 'A는 20명, B는 30명이다. 비율은 A가 높지만 실제 수는 B가 많다.'] },
    { id: 's2', s: 'soc', t: '윤리 · 공리주의와 칸트 의무론', hot: 1,
      c: ['공리주의(벤담·밀): 행위의 옳고 그름은 결과(최대 다수의 최대 행복)로 판단한다.', '칸트 의무론: 결과가 아니라 동기, 즉 보편화할 수 있는 준칙에 따른 의무에서 나온 행위가 옳다.', '칸트는 인간을 언제나 목적으로 대하고 단지 수단으로만 대하지 말라고 했다.'],
      p: '제시문에 "결과·유용성·쾌락"이 보이면 공리주의, "동기·보편 법칙·의무·인격"이 보이면 칸트.',
      trap: '벤담(양적)과 밀(질적 공리주의)의 차이를 놓치는 것.',
      q: ['"행위의 옳음은 결과가 아니라 보편화할 수 있는 준칙에 따른 의무에서 나온다"고 본 사상가는?', ['벤담', '밀', '칸트', '아리스토텔레스'], 2, '보편화 가능한 준칙, 의무, 동기 중시는 칸트 의무론의 핵심이다.'] },
    { id: 's3', s: 'soc', t: '경제 · 수요·공급 곡선의 이동', hot: 1,
      c: ['상품 자체의 가격 변화는 곡선 "위에서" 이동(수요량·공급량 변화)이다.', '가격 외 요인(소득, 기호, 관련 재화 가격, 생산 비용)은 곡선 "자체"를 이동시킨다(수요·공급 변화).', '수요 증가 → 균형 가격 상승·거래량 증가, 공급 증가 → 균형 가격 하락·거래량 증가.'],
      p: '문제의 원인이 "가격"인지 "가격 외 요인"인지 먼저 표시하면 곡선 위 이동인지 곡선 이동인지 바로 정해진다.',
      trap: '수요 변화와 수요량 변화를 같은 말로 쓰는 것.',
      q: ['정상재에서 소비자의 소득이 늘면 시장에 나타나는 변화는?', ['수요 곡선 왼쪽 이동, 가격 하락', '수요 곡선 오른쪽 이동, 가격 상승', '공급 곡선 오른쪽 이동, 가격 하락', '변화 없음'], 1, '정상재는 소득이 늘면 수요가 증가해 수요 곡선이 오른쪽으로 이동하고, 균형 가격과 거래량이 오른다.'] },
    { id: 's4', s: 'soc', t: '한국지리 · 기후 차이의 원인', hot: 0,
      c: ['기온은 위도·해발 고도·바다와의 거리(해양성/대륙성)·지형의 영향을 받는다.', '같은 위도에서 동해안은 태백산맥이 겨울 북서 계절풍을 막고 동해의 영향을 받아 서해안보다 겨울이 따뜻하다.', '연교차는 내륙·북부일수록 크고, 해안·남부일수록 작다.'],
      p: '지도 위 두 지점 비교 문제는 "위도 → 해발 → 해안/내륙 → 산맥" 순서로 따지면 된다.',
      trap: '위도만으로 기온을 판단하는 것.',
      q: ['비슷한 위도에서 동해안이 서해안보다 겨울에 따뜻한 주된 이유는?', ['위도가 낮아서', '산맥이 북서 계절풍을 막고 바다의 영향을 받아서', '해발 고도가 높아서', '강수량이 많아서'], 1, '태백산맥이 차가운 북서 계절풍을 막고, 수심이 깊은 동해의 영향으로 겨울 기온이 높다.'] },
    // 과학탐구
    { id: 'c1', s: 'sci', t: '물리 · 등가속도 운동', hot: 1,
      c: ['v = v₀ + at, s = v₀t + ½at², v² − v₀² = 2as.', '시간 정보가 없으면 세 번째 식(2as)을 쓴다.', 'v-t 그래프에서 기울기는 가속도, 아래 넓이는 이동 거리다.'],
      p: '구간이 여러 개인 문제는 v-t 그래프를 먼저 그리고 넓이로 푼다. 식보다 빠르고 실수가 적다.',
      trap: '부호(방향)를 정하지 않고 계산하는 것. 처음에 + 방향을 정한다.',
      q: ['정지 상태에서 가속도 2 m/s²로 3초 동안 움직인 거리는?', ['3 m', '6 m', '9 m', '18 m'], 2, 's = ½ × 2 × 3² = 9 m.'] },
    { id: 'c2', s: 'sci', t: '화학 · 몰과 질량', hot: 1,
      c: ['1몰은 입자 6.02 × 10²³개. 몰 수 = 질량 / 몰질량.', '물(H₂O)의 몰질량은 18 g/mol(H 1, O 16).', '화학 반응식의 계수비 = 몰 수 비 (기체는 같은 조건에서 부피비).'],
      p: '양적 관계 문제는 "질량 → 몰 → 계수비 → 몰 → 질량" 다리 하나로 모두 풀린다.',
      trap: '계수비를 질량비로 바로 쓰는 것.',
      q: ['물 36 g은 몇 몰인가?', ['1몰', '2몰', '3몰', '18몰'], 1, '36 g / 18 g/mol = 2몰.'] },
    { id: 'c3', s: 'sci', t: '생명 · 멘델 유전 기본', hot: 1,
      c: ['대립 형질은 우성(A)과 열성(a)으로, 열성 형질은 aa일 때만 나타난다.', 'Aa × Aa → AA : Aa : aa = 1 : 2 : 1, 표현형 우성 : 열성 = 3 : 1.', 'X 염색체 반성 유전은 남자(XY)가 열성 유전자 하나만 가져도 형질이 나타난다.'],
      p: '가계도 문제는 "부모가 정상인데 자녀가 형질 발현 → 열성" 한 줄로 우열부터 정한다.',
      trap: '반성 유전에서 남녀 비율을 같게 계산하는 것.',
      q: ['Aa × Aa에서 태어난 자손이 열성 형질을 나타낼 확률은?', ['0', '1/4', '1/2', '3/4'], 1, '자손 유전자형 AA : Aa : aa = 1 : 2 : 1 중 aa만 열성 형질이므로 1/4.'] },
    { id: 'c4', s: 'sci', t: '지구과학 · 판의 경계', hot: 1,
      c: ['발산형 경계: 판이 멀어지는 곳. 해령, 열곡대(예: 동아프리카 열곡대).', '수렴형 경계: 판이 가까워지는 곳. 해구, 호상 열도, 습곡 산맥(예: 히말라야).', '보존형 경계: 판이 어긋나는 곳. 변환 단층(예: 산안드레아스 단층). 지진은 많지만 화산은 드물다.'],
      p: '"화산 활동 없음 + 지진 있음"이면 보존형, "새 해양 지각 생성"이면 발산형.',
      trap: '해령과 해구를 바꿔 기억하는 것. 해령은 만들어지는 곳, 해구는 들어가는 곳.',
      q: ['새로운 해양 지각이 만들어지는 해령은 어떤 경계인가?', ['발산형', '수렴형', '보존형', '충돌형'], 0, '해령은 판이 서로 멀어지며 맨틀 물질이 올라와 새 해양 지각이 생기는 발산형 경계다.'] },
    { id: 'c5', s: 'sci', t: '화학 · 산화와 환원', hot: 0,
      c: ['산화: 산소를 얻거나, 전자를 잃거나, 산화수가 증가하는 반응.', '환원: 산소를 잃거나, 전자를 얻거나, 산화수가 감소하는 반응.', '산화와 환원은 항상 동시에 일어나며, 잃은 전자 수 = 얻은 전자 수다.'],
      p: '산화수 변화만 따지면 산소·전자 기준을 따로 외울 필요가 없다. 증가 = 산화, 감소 = 환원.',
      trap: '산화제(자신은 환원됨)와 산화되는 물질을 혼동하는 것.',
      q: ['어떤 원자의 산화수가 +2에서 +3으로 바뀌었다. 이 원자는?', ['환원되었다', '산화되었다', '변화 없다', '중화되었다'], 1, '산화수가 증가했으므로 산화되었다.'] },
    { id: 'c6', s: 'sci', t: '생명 · 항상성과 혈당 조절', hot: 1,
      c: ['인슐린(이자 β세포)은 혈당을 낮추고, 글루카곤(이자 α세포)은 혈당을 높인다.', '음성 피드백: 결과가 원인을 억제해 일정한 상태를 유지한다.', '체온 조절은 간뇌 시상 하부가 중추다.'],
      p: '그래프 문제는 "식사 후 혈당↑ → 인슐린↑", "공복 혈당↓ → 글루카곤↑" 두 그림이 기본이다.',
      trap: 'α세포·β세포 호르몬을 바꿔 기억하는 것.',
      q: ['혈당을 낮추는 호르몬은?', ['글루카곤', '인슐린', '아드레날린', '티록신'], 1, '이자의 β세포에서 분비되는 인슐린이 혈당을 낮춘다.'] }
  ];

  /* ---------- 저장 ---------- */
  function store() {
    const st = MS().st(), kid = MS().kid(); st.hi = st.hi || {};
    const h = st.hi[kid.id] = st.hi[kid.id] || { plan: [], mock: [], pin: {}, goal: {} };
    h.plan = h.plan || []; h.tutor = h.tutor || {}; h.iv = h.iv || { kw: '', type: 'doc' }; h.jeong = h.jeong || [{}, {}, {}]; h.min = h.min || { n: 3, sum: 6, tam: 'avg', eng: 1, his: 0 };
    return h;
  }
  const save = () => MS().save();
  const S = (k) => SUBJ.find(s => s.k === k);
  const doneN = (k) => C.filter(c => (!k || c.s === k) && store().tutor[c.id] && store().tutor[c.id].ok).length;

  // 오늘의 과외: 최근 모의고사에서 가장 낮은 과목의 미완료 개념부터
  function nextConcept() {
    const h = store(); const rows = (h.mock || []).slice().sort((a, b) => a.date.localeCompare(b.date)); const last = rows[rows.length - 1];
    const order = SUBJ.map(s => s.k).sort((a, b) => ((last && last.g[b]) || 0) - ((last && last.g[a]) || 0));
    for (const k of order) { const c = C.find(x => x.s === k && !(h.tutor[x.id] && h.tutor[x.id].ok)); if (c) return c; }
    return null;
  }
  function homeCard() {
    const c = nextConcept(); const all = C.length, d = doneN();
    return `<div class="card mt12 tu-home"><div class="card-head"><h2>👩‍🏫 오늘의 1:1 개념 과외</h2><a class="more" href="#high/tutor">전체 커리큘럼 ›</a></div>
      ${c ? `<div class="tu-next"><span class="tu-sb" style="--sc:${S(c.s).c}">${S(c.s).ic} ${S(c.s).n}</span><b>${esc(c.t)}</b>${c.hot ? '<span class="tu-hot">빈출</span>' : ''}</div>
      <p class="xs muted mt4">개념 정리 → 족집게 → 함정 → 확인 문제까지 3분. ${d}/${all}개 완료</p>
      <a class="btn btn-primary btn-sm mt8" href="#high/tutor/${c.id}">과외 시작하기 ›</a>` : `<p class="small">수능 핵심 개념 ${all}개를 모두 끝냈어요. 3일 간격으로 다시 풀면 기억이 오래갑니다.</p><a class="btn btn-sm mt8" href="#high/tutor">복습하기</a>`}</div>`;
  }

  /* ---------- 화면: 개념 과외 목록 ---------- */
  function list() {
    const h = store(); const st = MS().st(); const open = st._tuS || 'all';
    const rows = C.filter(c => open === 'all' || c.s === open);
    return layout('high/tutor', `
      <div class="page-head"><div><h1>1:1 온라인 개념 과외</h1><div class="sub">수능에 꼭 나오는 개념만 골라, 과외 선생님처럼 한 단계씩. 개념 정리 → 족집게 → 함정 → 확인 문제</div></div></div>
      <div class="card tu-intro"><div class="tu-prog"><b>${doneN()}</b>/${C.length} 개념 완료</div><div class="tu-bar"><i style="width:${Math.round(doneN() / C.length * 100)}%"></i></div>
        <p class="xs muted mt8">오늘의 과외는 최근 모의고사에서 등급이 가장 낮은 과목부터 추천해요. 틀린 개념은 3일 뒤 복습 일정이 플래너에 자동으로 들어갑니다.</p></div>
      <div class="chips scroll-x hi-sub mt12"><button class="chip ${open === 'all' ? 'on' : ''}" data-act="tuS" data-k="all">전체 ${doneN()}/${C.length}</button>${SUBJ.map(s => `<button class="chip ${open === s.k ? 'on' : ''}" data-act="tuS" data-k="${s.k}" style="--sc:${s.c}">${s.ic} ${s.n} <span class="xs">${doneN(s.k)}/${C.filter(c => c.s === s.k).length}</span></button>`).join('')}</div>
      <div class="list tu-list">${rows.map(c => { const r = h.tutor[c.id]; return `<a class="li" href="#high/tutor/${c.id}" style="color:inherit"><div class="li-ico" style="background:${S(c.s).c}1a">${r && r.ok ? '✅' : r ? '🔁' : S(c.s).ic}</div><div class="li-main"><div class="li-t">${esc(c.t)} ${c.hot ? '<span class="tu-hot">빈출</span>' : ''}</div><div class="li-s">${S(c.s).n} · ${r && r.ok ? '완료 ' + r.date.slice(5).replace('-', '/') : r ? '다시 풀기' : '3분 과외'}</div></div><span class="muted">›</span></a>`; }).join('')}</div>
      <p class="xs muted mt12">개념 정리·문제·해설은 쌤픽이 직접 쓴 학습 자료입니다. 더 깊은 강의는 <a href="https://www.ebsi.co.kr" target="_blank" rel="noopener">EBSi 무료 강의</a>, 질문은 EBSi "선생님께 묻기"를 이용하세요.</p>`);
  }

  /* ---------- 화면: 과외 한 차시(대화형) ---------- */
  function lesson(id) {
    const c = C.find(x => x.id === id); if (!c) return list();
    const st = MS().st(); const step = st._tuStep && st._tuStep.id === id ? st._tuStep.n : 0; const ans = st._tuStep && st._tuStep.id === id ? st._tuStep.a : null;
    const s = S(c.s); const kid = MS().kid();
    const bub = (who, html) => `<div class="tu-b ${who}"><span class="tu-av">${who === 'me' ? '🙋' : '👩‍🏫'}</span><div class="tu-m">${html}</div></div>`;
    const parts = [
      bub('t', `<b>${esc(kid.name)}, 오늘은 "${esc(c.t)}"!</b><br>3분이면 끝나요. 먼저 꼭 필요한 개념만 정리할게요.<ol class="tu-c">${c.c.map(x => `<li>${esc(x)}</li>`).join('')}</ol>`),
      bub('t', `<div class="tu-lbl">🎯 족집게</div>${esc(c.p)}`),
      bub('t', `<div class="tu-lbl">⚠️ 이건 꼭 피하세요</div>${esc(c.trap)}`)
    ];
    const q = c.q;
    const qHTML = bub('t', `<div class="tu-lbl">✍️ 확인 문제</div><b>${esc(q[0])}</b><div class="tu-opts">${q[1].map((o, i) => `<button class="tu-o ${ans != null ? (i === q[2] ? 'ok' : i === ans ? 'no' : '') : ''}" data-act="tuAns" data-id="${c.id}" data-i="${i}" ${ans != null ? 'disabled' : ''}>${'①②③④'[i]} ${esc(o)}</button>`).join('')}</div>`);
    const fb = ans == null ? '' : bub('me', ans === q[2] ? '정답이에요!' : `${'①②③④'[ans]}번이라고 생각했어요.`) + bub('t', `${ans === q[2] ? '👏 <b>정확해요.</b>' : '<b>괜찮아요, 여기서 틀린 게 수능에서 맞히는 거예요.</b>'}<br>${esc(q[3])}${ans === q[2] ? '' : '<br><span class="xs muted">3일 뒤 복습을 플래너에 넣어 뒀어요.</span>'}`);
    const shown = parts.slice(0, Math.min(step + 1, 3)).join('') + (step >= 3 ? qHTML + fb : '');
    const idx = C.indexOf(c); const nx = C[idx + 1];
    const ctl = step < 3 ? `<button class="btn btn-primary" data-act="tuNext" data-id="${c.id}">${['족집게 듣기 ›', '함정 확인 ›', '확인 문제 풀기 ›'][step]}</button>` : ans == null ? '' : `<div class="row" style="gap:8px;flex-wrap:wrap">${nx ? `<a class="btn btn-primary" href="#high/tutor/${nx.id}">다음 개념 ›</a>` : ''}<button class="btn" data-act="tuRetry" data-id="${c.id}">다시 풀기</button><a class="btn btn-ghost" href="#high/tutor">목록</a></div>`;
    return layout('high/tutor', `
      <div class="page-head"><div><a class="xs muted" href="#high/tutor">← 1:1 개념 과외</a><h1>${s.ic} ${esc(c.t)}</h1><div class="sub">${s.n} ${c.hot ? '· 수능 빈출' : ''} · ${idx + 1}/${C.length}</div></div></div>
      <div class="card tu-chat" style="--sc:${s.c}">${shown}<div class="tu-ctl mt12">${ctl}</div></div>
      <div class="hi-consult-anchor"></div>`);
  }
  function answer(id, i) {
    const c = C.find(x => x.id === id); const h = store(); const ok = i === c.q[2];
    MS().st()._tuStep = { id, n: 3, a: i };
    const prev = h.tutor[id]; h.tutor[id] = { ok: ok || !!(prev && prev.ok && ok), date: ymd(new Date()), tries: ((prev && prev.tries) || 0) + 1 };
    if (!ok) h.plan.push({ id: uid(), subj: c.s, title: `개념 복습: ${c.t}`, date: addDays(3), min: 10, done: false, created: ymd(new Date()) });
    save(); MS().render();
  }

  /* ---------- 대입 족집게 ---------- */
  const NEWS = [
    ['의대 모집 확대', '2027학년도 의대 정원은 3,548명으로 490명 늘었고, 늘어난 인원은 비수도권 의대의 지역의사제 전형으로 뽑는다. 지역 제한이 없는 일반전형 인원은 오히려 줄었다.', '보건복지부 보건의료정책심의위원회(2026.2) · 대학별 2027 모집요강'],
    ['현행 수능 체제 마지막 해', '2027학년도는 선택과목이 있는 현행 수능과 9등급 내신의 마지막 해다. 2028학년도부터 통합형 수능과 5등급 내신이 적용돼 재수 부담이 커지므로 N수생 지원이 늘 것으로 예상된다.', '교육부 2028 대입제도 개편안'],
    ['학교폭력 조치사항 반영', '2026학년도부터 모든 대학이 학생부 위주·논술·수능·실기 전형 전체에서 학교폭력 조치사항을 반영한다. 반영 방식(감점·지원 자격 제한 등)은 대학마다 다르다.', '교육부 학교폭력 근절 종합대책 · 대교협 대입전형 기본사항'],
    ['수시 비중 유지', '전국 대학 모집인원의 약 80%가 수시에서 선발된다. 다만 서울 주요 대학은 정시 수능 위주 선발이 40% 안팎이라, 수능 점수가 수시·정시 모두를 좌우한다.', '대교협 2027학년도 대입전형 시행계획']
  ];
  const NOTES = [
    { g: '수시 지원 규칙', it: [
      '수시는 최대 6회 지원. 산업대·전문대, KAIST·GIST·DGIST·UNIST·한국에너지공과대, 경찰대·사관학교 등 특별법 학교는 6회 제한에 포함되지 않는다.',
      '수시에 한 곳이라도 합격(추가 합격 포함)하면 등록 여부와 상관없이 정시에 지원할 수 없다. 수능을 잘 봤다면 수능 후 대학별고사 응시 여부가 가장 큰 결정이다.',
      '수시 합격자는 복수 합격해도 한 곳에만 등록할 수 있다. 등록 기간을 놓치면 합격이 취소된다.'] },
    { g: '수능 최저학력기준', it: [
      '"3개 영역 등급 합 6 이내(3합 6)"처럼 정해진다. 탐구는 1과목 반영인지, 2과목 평균인지(소수점 절사·올림)가 대학마다 다르다.',
      '영어를 최저에 넣는 대학이 많아 영어 1~2등급은 최저 충족의 안전판이다. 한국사는 별도 기준(예: 4등급 이내)을 두기도 한다.',
      '가채점 결과는 실제 등급과 다를 수 있다. 경계선이면 대학별고사는 일단 응시하는 것이 원칙이다.'] },
    { g: '정시 점수의 구조', it: [
      '성적표에는 표준점수·백분위·등급이 나온다. 국어·수학은 표준점수, 탐구는 대학별 변환표준점수(백분위 기반)를 쓰는 곳이 많다.',
      '영어·한국사는 등급별 환산 점수나 감점 방식이라, 같은 등급이어도 대학마다 유불리가 다르다.',
      '정시는 가·나·다군 각 1곳씩 최대 3회 지원. 같은 군에서 두 대학에 지원할 수 없다.'] },
    { g: '면접 · 대학별고사', it: [
      '서류 기반 면접은 학생부 내용 확인(왜 했나, 무엇을 배웠나, 다음엔 무엇을)이고, 제시문 면접은 지문을 읽고 답하는 구술형이다.',
      '의약 계열은 여러 방을 돌며 짧은 질문에 답하는 다중미니면접(MMI)을 쓰는 곳이 많다. 윤리 딜레마·상황 판단 질문이 단골이다.',
      '면접·논술 날짜는 대학마다 수능 전후로 나뉜다. 같은 날 겹치면 둘 중 하나만 갈 수 있으니 일정표로 미리 확인한다.'] },
    { g: '추가 합격', it: [
      '수시·정시 모두 미등록 충원(추가 합격)이 있다. 다군과 상위권 대학 중복 합격자가 많은 학과는 추가 합격이 많이 돈다.',
      '추가 합격 연락은 전화·문자·홈페이지로 온다. 연락이 닿지 않으면 다음 순위로 넘어갈 수 있으니 이 기간엔 연락처를 비워 두지 않는다.'] }
  ];
  const IVQ = {
    doc: ['{k} 활동을 하게 된 계기는 무엇이고, 수업의 어떤 내용과 연결되나요?', '{k}에서 본인이 맡은 역할과 가장 어려웠던 점은 무엇이었나요?', '{k}의 결과가 예상과 달랐다면, 그 이유를 어떻게 해석했나요?', '{k}을(를) 다시 한다면 무엇을 바꾸고 싶나요?', '{k} 경험이 지원 학과 공부에 어떻게 이어질 수 있을까요?', '{k}와 관련해 읽은 책이나 자료 중 가장 기억에 남는 것은?'],
    text: ['제시문의 핵심 주장을 한 문장으로 요약해 보세요.', '두 제시문의 공통점과 차이점은 무엇인가요?', '제시문의 주장에 대한 반론을 하나 들고, 다시 반박해 보세요.', '제시문의 원리를 {k}에 적용하면 어떻게 설명할 수 있나요?', '제시문 속 자료(표·그래프)에서 읽을 수 있는 사실과, 읽을 수 없는 것은?'],
    mmi: ['환자가 치료를 거부할 때, 환자의 자율성과 의사의 선행 의무가 충돌한다면 어떻게 하겠습니까?', '팀 과제에서 동료가 데이터를 잘못 기록한 것을 발견했습니다. 어떻게 대처하겠습니까?', '한정된 의료 자원을 두 환자 중 한 명에게만 쓸 수 있다면 무엇을 기준으로 정하겠습니까?', '{k} 경험에서 다른 사람의 입장을 이해하게 된 순간을 말해 보세요.', '의료인에게 가장 필요한 덕목 하나와 그 이유는?']
  };
  const IVBASE = ['우리 학과에 지원한 동기는 무엇인가요?', '학생부에 다 담기지 않은 노력 하나를 소개해 주세요.', '갈등을 해결해 본 경험이 있나요?', '입학 후 가장 먼저 공부하고 싶은 것은?', '마지막으로 하고 싶은 말이 있나요?'];

  function minCalc(h) {
    const m = h.min; const g = h.min.g || {}; const G = (k) => +g[k] || 0;
    const t1 = G('t1'), t2 = G('t2');
    const tam = !t1 ? 0 : m.tam === 'one' ? Math.min(t1, t2 || 9) : !t2 ? 0 : m.tam === 'avgUp' ? Math.ceil((t1 + t2) / 2) : Math.floor((t1 + t2) / 2);
    const areas = [['국어', G('kor')], ['수학', G('math')], ['탐구', tam]]; if (+m.eng) areas.push(['영어', G('eng')]);
    const have = areas.filter(a => a[1]); if (have.length < +m.n) return { msg: '등급을 입력하면 충족 여부를 계산해요.', ok: null };
    const best = have.slice().sort((a, b) => a[1] - b[1]).slice(0, +m.n); const sum = best.reduce((s, a) => s + a[1], 0);
    const hisOK = !+m.his || (G('his') && G('his') <= +m.his);
    const ok = sum <= +m.sum && hisOK;
    return { ok, sum, best, hisOK, margin: +m.sum - sum, tam };
  }
  function ipsi() {
    const kid = MS().kid(), h = store(); const K = window.ConsultApp && ConsultApp.keyDates ? ConsultApp.keyDates(HA().examYear(kid)) : null;
    const last = (h.mock || []).slice().sort((a, b) => a.date.localeCompare(b.date)).pop();
    const g = h.min.g = h.min.g || (last ? { kor: last.g.kor || '', math: last.g.math || '', eng: last.g.eng || '', t1: last.g.soc || last.g.sci || '', t2: last.g.soc && last.g.sci ? last.g.sci : '', his: last.g.his || '' } : {});
    const r = minCalc(h); const sel = (n, v, opts) => `<select class="input" name="${n}" data-act="tuMin">${opts.map(([val, lab]) => `<option value="${val}" ${String(v) === String(val) ? 'selected' : ''}>${lab}</option>`).join('')}</select>`;
    const gsel = (k, lab) => `<div class="field"><label>${lab}</label>${sel('g_' + k, g[k] || '', [['', '–']].concat([1, 2, 3, 4, 5, 6, 7, 8, 9].map(x => [x, x + '등급'])))}</div>`;
    const iv = h.iv; const kw = (iv.kw || '').split(/[,·\n]/).map(s => s.trim()).filter(Boolean);
    const qs = (IVQ[iv.type] || IVQ.doc).flatMap(t => /\{k\}/.test(t) ? (kw.length ? kw.slice(0, 3).map(k => t.replace(/\{k\}/g, k)) : [t.replace(/\{k\}/g, '(세특 활동)')]) : [t]).slice(0, 10).concat(IVBASE.slice(0, 3));
    const J = h.jeong; const verdict = J.map(x => x.v || ''); const nUp = verdict.filter(v => v === 'up').length, nSafe = verdict.filter(v => v === 'safe').length, filled = verdict.filter(Boolean).length;
    const jWarn = filled < 3 ? '세 군을 모두 채우면 배치 진단이 나와요.' : !nSafe ? '⚠️ 안정 카드가 없어요. 세 곳 모두 떨어지면 재수 또는 추가 모집뿐입니다. 한 군은 안정으로 두세요.' : nSafe === 3 ? '⚠️ 세 곳 모두 안정이에요. 점수를 낮춰 쓰는 손해가 큽니다. 한 군은 적정 이상으로 올려 보세요.' : nUp === 3 ? '⚠️ 세 곳 모두 상향이에요. 최소 한 곳은 안정으로 두는 것이 원칙입니다.' : '✅ 상향·적정·안정이 섞인 균형 잡힌 배치예요. 군별 모집 인원과 작년 추가 합격 규모를 확인하세요.';
    return layout('high/ipsi', `
      <div class="page-head"><div><h1>대입 족집게</h1><div class="sub">${HA().examYear(kid)}학년도 기준 · 꼭 알아야 할 변화, 놓치면 손해 보는 규칙, 대치동 컨설팅에서 쓰는 전략 도구</div></div></div>
      ${window.ConsultApp && kid.grade === 12 ? ConsultApp.stageCard(kid) : ''}
      <div class="card mt12"><div class="card-head"><h2>📰 ${HA().examYear(kid) <= 2027 ? '2027학년도' : '이번 대입'} 핵심 변화</h2></div><div class="tu-news">${NEWS.map(([t, d, s]) => `<div class="tu-new"><b>${t}</b><p>${d}</p><small>출처: ${s}</small></div>`).join('')}</div></div>
      ${K && kid.grade === 12 ? `<div class="card mt12"><div class="card-head"><h2>⏱ 수능 직후 72시간 플랜</h2></div><ol class="steps">${[['수능 당일 밤', 'EBSi·평가원 정답으로 가채점. 영역별 원점수·예상 등급을 기록해 두기'], ['다음 날', '가채점 등급으로 수시 대학별 최저 충족 여부 확인(아래 계산기). 미충족이 확실한 대학의 논술·면접은 정리'], ['이틀째', '수능을 예상보다 잘 봤다면 "수시 합격 시 정시 불가" 규칙을 떠올리고, 수능 후 대학별고사 응시를 다시 판단'], ['사흘째', '정시 가능선을 대략 잡고, 남은 면접·논술 준비에 집중. 확정은 ' + (K.score ? K.score.slice(5).replace('-', '/') : '12월') + ' 성적표로']].map(([a, b]) => `<li><span><b>${a}</b> · ${b}</span></li>`).join('')}</ol></div>` : ''}
      <div class="card mt12" id="tuMinCard"><div class="card-head"><h2>🧮 수능 최저 계산기</h2><span class="xs muted">최근 모의고사로 자동 입력</span></div>
        <div class="form-grid tu-min-rule">${'<div class="field"><label>반영 영역 수</label>' + sel('n', h.min.n, [[2, '2개 영역'], [3, '3개 영역'], [4, '4개 영역']]) + '</div><div class="field"><label>등급 합</label>' + sel('sum', h.min.sum, [3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(x => [x, x + ' 이내'])) + '</div><div class="field"><label>탐구 반영</label>' + sel('tam', h.min.tam, [['one', '상위 1과목'], ['avg', '2과목 평균(절사)'], ['avgUp', '2과목 평균(올림)']]) + '</div><div class="field"><label>영어</label>' + sel('eng', h.min.eng, [[1, '포함'], [0, '제외']]) + '</div><div class="field"><label>한국사</label>' + sel('his', h.min.his, [[0, '기준 없음'], [3, '3등급 이내'], [4, '4등급 이내'], [5, '5등급 이내']]) + '</div>'}</div>
        <div class="tu-min-g">${gsel('kor', '국어')}${gsel('math', '수학')}${gsel('eng', '영어')}${gsel('t1', '탐구1')}${gsel('t2', '탐구2')}${gsel('his', '한국사')}</div>
        <div class="tu-min-r ${r.ok === true ? 'ok' : r.ok === false ? 'no' : ''}">${r.ok == null ? r.msg : `<b>${r.ok ? '충족' : '미충족'}</b> · ${r.best.map(a => `${a[0]} ${a[1]}`).join(' + ')} = ${r.sum} (기준 ${h.min.n}합 ${h.min.sum})${!r.hisOK ? ' · 한국사 기준 미달' : ''}${r.ok ? (r.margin >= 1 ? ` · 여유 ${r.margin}등급` : ' · 경계선, 한 영역만 흔들려도 미충족') : ` · ${-r.margin}등급 부족`}`}</div>
        <p class="xs muted mt8">대학마다 필수 영역(예: 수학 포함), 탐구 계산 방식이 다릅니다. 지원 대학 모집요강의 최저 기준으로 다시 확인하세요.</p></div>
      <div class="card mt12"><div class="card-head"><h2>🎤 면접 족집게 · 예상 질문 만들기</h2></div>
        <div class="form-grid"><div class="field"><label>면접 유형</label>${'<select class="input" data-act="tuIvType">' + [['doc', '서류 기반(학생부 확인)'], ['text', '제시문 기반'], ['mmi', '의약 계열 MMI']].map(([v, l]) => `<option value="${v}" ${iv.type === v ? 'selected' : ''}>${l}</option>`).join('') + '</select>'}</div><div class="field"><label>세특·활동 키워드 (쉼표로 구분)</label><input class="input" data-act="tuIvKw" maxlength="80" placeholder="예: 미생물 배양 실험, 기후 데이터 분석" value="${esc(iv.kw)}"></div></div>
        <ol class="tu-ivq">${qs.map(q => `<li>${esc(q)}</li>`).join('')}</ol>
        <div class="tu-frame"><b>1분 답변 틀</b> · 결론 먼저(10초) → 근거·경험(35초) → 배운 점과 학과 연결(15초). 말끝은 "~했습니다"로 또렷하게.</div>
        <div class="row mt8" style="gap:8px;flex-wrap:wrap"><button class="btn btn-sm btn-primary" data-act="tuIvPlan">📅 매일 3문항 연습을 플래너에</button></div></div>
      <div class="card mt12"><div class="card-head"><h2>🎯 정시 3장 배치 · 상향·적정·안정</h2></div>
        <div class="tu-jeong">${['가', '나', '다'].map((n, i) => `<div class="tu-j"><b>${n}군</b><input class="input" data-act="tuJ" data-i="${i}" data-f="u" maxlength="30" placeholder="대학·학과" value="${esc(J[i].u || '')}"><select class="input" data-act="tuJ" data-i="${i}" data-f="v">${[['', '판정'], ['up', '상향'], ['fit', '적정'], ['safe', '안정']].map(([v, l]) => `<option value="${v}" ${J[i].v === v ? 'selected' : ''}>${l}</option>`).join('')}</select></div>`).join('')}</div>
        <div class="tu-jw">${jWarn}</div>
        <ul class="warn-list mt8">${['서울 주요 대학은 가·나군에 몰려 있고, 다군은 모집 대학이 적어 경쟁률과 추가 합격 규모가 모두 크다.', '같은 점수라도 대학별 반영 비율(국·수·탐 비중, 영어 환산)에 따라 유불리가 바뀐다. 내 점수가 가장 높게 환산되는 대학이 "적정"이다.', '판정은 입시 기관 모의 지원 결과를 2곳 이상 비교해서 정한다. 한 곳만 믿지 않는다.'].map(t => `<li>${t}</li>`).join('')}</ul></div>
      <div class="hi-consult-anchor"></div>
      ${NOTES.map(G => `<div class="card mt12"><div class="card-head"><h2>📌 ${G.g}</h2></div><ul class="tu-notes">${G.it.map(t => `<li>${esc(t)}</li>`).join('')}</ul></div>`).join('')}
      <div class="card mt12"><div class="card-head"><h2>공식 확인처</h2></div><div class="row" style="gap:8px;flex-wrap:wrap"><a class="btn btn-sm" href="https://www.adiga.kr" target="_blank" rel="noopener">어디가 ↗</a><a class="btn btn-sm" href="https://www.kcue.or.kr" target="_blank" rel="noopener">대교협 ↗</a><a class="btn btn-sm" href="https://www.suneung.re.kr" target="_blank" rel="noopener">평가원 수능 ↗</a><a class="btn btn-sm" href="#high/consult">맞춤 컨설팅 리포트 ›</a></div>
        <p class="xs muted mt8">쌤픽이 공공 발표를 바탕으로 정리한 일반 정보입니다. 대학별 세부 기준은 각 대학 모집요강이 우선하며, 쌤픽은 합격을 보장하지 않습니다.</p></div>`);
  }

  function page(a) {
    if (a[1] === 'tutor') return a[2] ? lesson(a[2]) : list();
    return ipsi();
  }

  /* ---------- 이벤트 ---------- */
  document.addEventListener('click', e => {
    const b = e.target.closest('[data-act]'); if (!b) return; const st = MS().st(); const act = b.dataset.act;
    const H = {
      tuS() { st._tuS = b.dataset.k; MS().render(); },
      tuNext() { const cur = st._tuStep && st._tuStep.id === b.dataset.id ? st._tuStep.n : 0; st._tuStep = { id: b.dataset.id, n: cur + 1, a: null }; MS().render(); },
      tuAns() { answer(b.dataset.id, +b.dataset.i); },
      tuRetry() { st._tuStep = { id: b.dataset.id, n: 3, a: null }; MS().render(); },
      tuIvPlan() { const h = store(); for (let i = 0; i < 7; i++) h.plan.push({ id: uid(), subj: 'etc', title: '면접 예상 질문 3개 소리 내어 답하기', date: addDays(i), min: 15, done: false, created: ymd(new Date()) }); save(); MS().toast('7일 연습을 플래너에 넣었어요'); }
    };
    if (H[act] && b.tagName !== 'SELECT' && b.tagName !== 'INPUT') { e.preventDefault(); H[act](); }
  });
  document.addEventListener('change', e => {
    const b = e.target.closest('[data-act]'); if (!b) return; const h = () => store(); const act = b.dataset.act;
    if (act === 'tuMin') { const n = b.name; if (n.startsWith('g_')) h().min.g[n.slice(2)] = b.value; else h().min[n] = b.value; save(); MS().render(); }
    else if (act === 'tuIvType') { h().iv.type = b.value; save(); MS().render(); }
    else if (act === 'tuIvKw') { h().iv.kw = b.value; save(); MS().render(); }
    else if (act === 'tuJ') { h().jeong[+b.dataset.i][b.dataset.f] = b.value; save(); if (b.dataset.f === 'v') MS().render(); }
  });
  window.TutorApp = { page, homeCard, list, lesson, ipsi, C, SUBJ, minCalc, nextConcept };
})();
