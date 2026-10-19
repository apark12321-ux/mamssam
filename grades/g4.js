/* 맘쌤 — 초등 4학년 수학 (2022 개정) */
(function () {
  const { ri, pick, gcd, lcm, red, shuffle, F, M, fmt, decStr, P, svgWrap, lbl, shapeStyle, dash, table, properCoprime, divisors, roundTo, mixedToImproper } = window.MathGen.h;
  const R = window.MathGen.register;
  window.UNITS = window.UNITS || [];
  window.UNITS.push(
    {
      id: 'g4u1', grade: 4, sem: 1, no: 1, title: '큰 수', icon: '🔢',
      lessons: ['다섯 자리 수와 만', '십만, 백만, 천만', '억과 조', '뛰어 세기', '수의 크기 비교'],
      concept: '네 자리마다 새 이름(만·억·조)이 붙습니다. 일의 자리부터 네 자리씩 끊어 읽으면 아무리 큰 수도 "몇천몇백몇십몇 + 만/억/조"로 읽을 수 있습니다. 크기 비교는 자릿수를 먼저, 같으면 가장 높은 자리부터 비교합니다.',
      script: [
        '"1,000이 10개면 얼마일까?" 천 원짜리 10장을 만 원 한 장과 바꿔 보며 10배가 될 때마다 자리가 하나씩 올라간다는 것을 확인합니다.',
        '"큰 수는 뒤에서부터 네 자리씩 끊어 보자." 수 아래에 연필로 네 자리마다 선을 긋고 만·억·조를 적게 합니다.',
        '자릿값 표(일·십·백·천)를 한 장 만들어 두고, 만·억·조 칸에 똑같은 표가 반복된다는 것을 보여 줍니다.',
        '뛰어 세기는 "어느 자리 숫자가 1씩 커지는지"만 보면 된다고 알려 주고, 10만씩·1억씩 직접 소리 내어 세어 봅니다.'
      ],
      mistakes: [
        '읽지 않는 자리의 0을 빠뜨리고 쓰기 (삼억 오만 → 300050000을 30050000으로 씀)',
        '만 단위를 끊지 않고 일·십·백·천을 계속 이어 읽음',
        '자릿수가 다른데 맨 앞 숫자만 보고 크기 비교',
        '뛰어 세기에서 받아올림(9 다음 자리)을 놓침'
      ],
      warmup: '우리나라 인구, 아파트 값, 지구와 달 사이 거리처럼 뉴스에 나오는 큰 수를 함께 찾아 네 자리씩 끊어 읽어 봅니다.',
      check: '"305000000을 네 자리씩 끊어서 읽어 볼래? 0이 있는 자리는 어떻게 읽었어?"',
      next: '5학년 어림하기(올림·버림·반올림)와 큰 수의 계산, 6학년 이후 수와 연산의 바탕이 됩니다.',
      keywords: ['큰수', '억', '천만', '백만', '십만', '만의자리', '자릿값', '뛰어세기', '네자리씩', '수읽기']
    },
    {
      id: 'g4u2', grade: 4, sem: 1, no: 2, title: '각도', icon: '📐',
      lessons: ['각의 크기 비교', '각도기로 각도 재기', '각 그리기', '예각과 둔각', '각도 어림하기', '각도의 합과 차', '삼각형·사각형의 각의 크기의 합'],
      concept: '각의 크기를 각도라 하고, 직각을 똑같이 90으로 나눈 하나를 1도(1°)라고 합니다. 0°보다 크고 직각보다 작으면 예각, 직각보다 크고 180°보다 작으면 둔각입니다. 삼각형 세 각의 합은 180°, 사각형 네 각의 합은 360°입니다.',
      script: [
        '각도기의 중심을 꼭짓점에, 밑금을 한 변에 맞추는 두 가지를 먼저 손으로 짚게 합니다. "중심과 밑금, 두 군데를 맞추면 끝!"',
        '"0에서 시작한 쪽 눈금을 읽자." 안쪽·바깥쪽 눈금 중 어느 쪽에서 0이 시작했는지 손가락으로 따라가게 합니다.',
        '종이 삼각형의 세 꼭짓점을 찢어 한 점에 모으면 일직선(180°)이 된다는 것을 직접 해 봅니다. 사각형은 삼각형 2개로 나뉘어 360°입니다.',
        '책 모서리(직각)를 기준으로 "이것보다 좁으면 예각, 넓으면 둔각"이라고 집 안 물건으로 분류해 봅니다.'
      ],
      mistakes: [
        '각도기 안쪽·바깥쪽 눈금을 바꿔 읽음 (60°를 120°로)',
        '변의 길이가 길면 각도도 크다고 생각함',
        '각도의 합·차에서 ° 단위를 빼먹거나 자연수 계산과 혼동',
        '사각형 네 각의 합을 180°로 착각'
      ],
      warmup: '시계 바늘로 각 만들기 — "3시에 두 바늘이 이루는 각은? 직각보다 큰 시각을 찾아볼까?"',
      check: '"삼각형 세 각의 합이 180°라는 걸 종이를 찢어서 어떻게 보여 줄 수 있을까?"',
      next: '4학년 2학기 삼각형·사각형·다각형 단원에서 각의 성질로 쓰이고, 5학년 합동과 대칭, 중1 평면도형의 성질로 이어집니다.',
      keywords: ['각도', '각도기', '예각', '둔각', '직각', '각의합', '세각의합', '네각의합', '180도', '360도']
    },
    {
      id: 'g4u3', grade: 4, sem: 1, no: 3, title: '곱셈과 나눗셈', icon: '✖️',
      lessons: ['(세 자리 수)×(몇십)', '(세 자리 수)×(두 자리 수)', '(몇백몇십)÷(몇십)', '(두 자리 수)÷(두 자리 수)', '몫이 한 자리 수인 (세 자리 수)÷(두 자리 수)', '몫이 두 자리 수인 (세 자리 수)÷(두 자리 수)'],
      concept: '(세 자리)×(두 자리)는 일의 자리 곱과 십의 자리 곱(한 칸 왼쪽)을 따로 구해 더합니다. 나눗셈은 몫을 어림해 곱하고 빼는 과정을 반복하며, 나머지는 항상 나누는 수보다 작아야 합니다.',
      script: [
        '"123×24는 123×4와 123×20을 더한 거야." 두 줄로 나눠 쓰고, 둘째 줄은 십의 자리 곱이라 한 칸 왼쪽에서 시작한다는 것을 강조합니다.',
        '나눗셈은 "몫 어림 → 곱하기 → 빼기 → 내리기" 네 단계를 손가락으로 세며 말하게 합니다.',
        '몫을 어림할 때 나누는 수를 몇십으로 생각해 봅니다. 158÷32는 150÷30쯤이니 몫은 5 근처입니다.',
        '계산이 끝나면 꼭 검산(나누는 수×몫+나머지=나누어지는 수)으로 스스로 확인하게 합니다.'
      ],
      mistakes: [
        '십의 자리 곱을 한 칸 왼쪽으로 옮기지 않고 씀',
        '곱의 받아올림 숫자를 더하지 않음',
        '나머지가 나누는 수보다 큰데 그대로 둠 (몫을 작게 어림)',
        '몫을 크게 어림해 빼는 수가 더 커지는데 억지로 뺌'
      ],
      warmup: '"한 개 350원짜리 지우개를 우리 반 24명에게 하나씩 사 주려면 얼마가 필요할까?" 실제 생활 값으로 곱셈을 세워 봅니다.',
      check: '"245÷18을 계산하고, 답이 맞는지 검산하는 방법을 보여 줄래?"',
      next: '5학년 자연수의 혼합 계산, 약수와 배수, 분수·소수의 곱셈과 나눗셈의 계산 기초가 됩니다.',
      keywords: ['세자리곱셈', '두자리곱셈', '곱셈', '나눗셈', '몫', '나머지', '검산', '몫어림', '세자리나누기']
    },
    {
      id: 'g4u4', grade: 4, sem: 1, no: 4, title: '평면도형의 이동', icon: '🔄',
      lessons: ['점의 이동', '평면도형 밀기', '평면도형 뒤집기', '평면도형 돌리기', '평면도형을 뒤집고 돌리기', '무늬 꾸미기'],
      concept: '밀기는 모양과 방향이 그대로이고 위치만 바뀝니다. 뒤집기는 왼쪽↔오른쪽 또는 위쪽↔아래쪽이 서로 바뀝니다. 돌리기는 시계 방향·반대 방향으로 90°, 180°, 270°, 360° 돌리며, 360° 돌리면 처음과 같습니다.',
      script: [
        '종이에 화살표나 글자 "ㄱ"을 그려 오린 뒤 직접 밀고, 뒤집고, 돌려 봅니다. 손으로 해 본 다음 그림으로 예상하게 합니다.',
        '"오른쪽으로 뒤집으면 왼쪽과 오른쪽이 바뀌어. 위쪽·아래쪽은 그대로야." 거울에 비춰 보면 더 잘 이해됩니다.',
        '돌리기는 "도형의 위쪽이 어디로 가는지" 한 곳만 따라가게 합니다. 시계 방향 90°면 위쪽이 오른쪽으로 갑니다.',
        '"시계 방향 90°와 시계 반대 방향 270°는 같은 결과야." 돌린 각도를 바꿔 같은 모양이 되는 짝을 찾아봅니다.'
      ],
      mistakes: [
        '왼쪽으로 뒤집기와 오른쪽으로 뒤집기의 결과가 다르다고 생각함 (사실 같음)',
        '돌리기에서 시계 방향과 시계 반대 방향을 혼동',
        '뒤집기와 돌리기를 섞을 때 순서를 바꿔서 함',
        '점의 이동에서 칸 수 대신 점 개수를 셈'
      ],
      warmup: '디지털 시계 숫자 놀이 — "86을 180° 돌리면 몇이 될까?" 숫자 카드를 직접 돌려 봅니다.',
      check: '"이 도형을 시계 방향으로 90° 돌린 모양을 먼저 머릿속으로 그려 보고, 직접 돌려서 확인해 볼래?"',
      next: '5학년 합동과 대칭(선대칭·점대칭)과 중1 작도와 합동의 직관적 바탕이 됩니다.',
      keywords: ['도형의이동', '밀기', '뒤집기', '돌리기', '시계방향', '반대방향', '90도돌리기', '180도돌리기', '점의이동', '무늬']
    },
    {
      id: 'g4u5', grade: 4, sem: 1, no: 5, title: '막대그래프', icon: '📊',
      lessons: ['막대그래프 알아보기', '막대그래프 내용 알아보기', '막대그래프 그리기', '자료를 조사해 막대그래프로 나타내기', '막대그래프로 이야기 만들기'],
      concept: '조사한 자료의 수량을 막대 길이로 나타낸 그래프입니다. 가로·세로 눈금, 눈금 한 칸의 크기, 단위를 먼저 확인하면 많고 적음을 한눈에 비교할 수 있습니다.',
      script: [
        '그래프를 읽기 전에 "제목, 가로에 뭐가, 세로에 뭐가, 눈금 한 칸은 얼마?" 네 가지를 먼저 말하게 합니다.',
        '"눈금 한 칸이 1명인지 2명인지에 따라 답이 달라져." 같은 막대를 한 칸=1과 한 칸=2로 읽어 비교해 봅니다.',
        '가족이 좋아하는 과일·간식을 직접 조사해 표로 정리하고, 모눈종이에 막대그래프를 그려 봅니다.',
        '표는 정확한 수를, 막대그래프는 많고 적음을 한눈에 보기 좋다는 차이를 이야기해 봅니다.'
      ],
      mistakes: [
        '눈금 한 칸의 크기를 확인하지 않고 칸 수를 그대로 답함',
        '막대그래프를 그릴 때 눈금 한 칸의 크기를 너무 작게 잡아 그래프가 넘침',
        '가로·세로 항목을 바꿔 읽음',
        '제목과 단위를 빠뜨림'
      ],
      warmup: '가족 설문 — "우리 가족이 가장 좋아하는 간식은?" 스티커로 표를 만들고 막대로 옮겨 봅니다.',
      check: '"이 막대그래프에서 눈금 한 칸은 몇 명일까? 어떻게 알았어?"',
      next: '4학년 2학기 꺾은선그래프, 5학년 평균과 가능성, 6학년 띠그래프·원그래프로 이어집니다.',
      keywords: ['막대그래프', '막대', '눈금', '눈금한칸', '그래프그리기', '조사', '자료정리']
    },
    {
      id: 'g4u6', grade: 4, sem: 1, no: 6, title: '규칙 찾기', icon: '🧩',
      lessons: ['수의 배열에서 규칙 찾기', '수 배열표의 규칙', '도형의 배열에서 규칙 찾기', '계산식의 배열에서 규칙 찾기', '규칙적인 계산식 찾기'],
      concept: '수나 도형이 늘어나는 방법(몇씩 커지는지, 몇 배가 되는지)을 찾아 말과 식으로 나타냅니다. 계산식 배열에서는 바뀌는 수와 그대로인 수를 구분하면 다음 식을 예상할 수 있습니다.',
      script: [
        '"앞 수와 뒤 수를 비교해 봐. 얼마씩 커지니?" 수 사이에 작은 화살표를 그리고 +100, ×2처럼 적게 합니다.',
        '수 배열표에서는 가로(→), 세로(↓), 대각선(↘) 방향을 각각 따로 살펴보게 합니다.',
        '바둑돌이나 레고로 도형 배열을 직접 만들어 보고 "다음 단계는 몇 개 늘어날까?" 예상하게 합니다.',
        '계산식은 계산하기 전에 "어떤 수가 바뀌고 있지?"부터 말하게 하면 다음 식을 계산 없이 맞힐 수 있습니다.'
      ],
      mistakes: [
        '처음 두 수만 보고 규칙을 정해 버림',
        '가로 규칙과 세로 규칙을 섞음',
        '도형 배열에서 전체 개수 대신 늘어난 개수를 답함',
        '규칙을 말로 설명하지 못하고 답만 씀'
      ],
      warmup: '달력 탐험 — 달력에서 세로로 7씩, 대각선으로 8씩 커지는 규칙을 찾아봅니다.',
      check: '"다음에 올 수를 맞혀 보고, 왜 그렇게 생각했는지 규칙을 말로 설명해 볼래?"',
      next: '5학년 규칙과 대응, 6학년 비와 비율, 중학교 문자와 식·함수의 바탕이 됩니다.',
      keywords: ['규칙찾기', '수배열', '수배열표', '도형배열', '계산식배열', '계산식규칙', '다음수', '규칙적인']
    },
    {
      id: 'g4u7', grade: 4, sem: 2, no: 1, title: '분수의 덧셈과 뺄셈', icon: '🍰',
      lessons: ['분모가 같은 진분수의 덧셈', '분모가 같은 대분수의 덧셈', '분모가 같은 진분수의 뺄셈', '(자연수)−(분수)', '받아내림이 없는 대분수의 뺄셈', '받아내림이 있는 대분수의 뺄셈'],
      concept: '분모가 같은 분수는 분모는 그대로 두고 분자끼리 더하거나 뺍니다. 합이 가분수가 되면 대분수로 바꾸고, 대분수의 뺄셈에서 분자끼리 뺄 수 없으면 자연수 1을 분수로 바꿔 받아내림합니다.',
      script: [
        '피자 한 판을 8조각으로 나눈 그림을 그려 "3조각과 2조각을 합치면 몇 조각?" 하고 3/8+2/8=5/8을 조각 수로 셉니다.',
        '"조각 크기(분모)는 바뀌지 않아. 조각 수(분자)만 세는 거야." 분모끼리 더하는 실수를 미리 짚어 줍니다.',
        '1−3/5은 "한 판은 5/5"로 바꿔 생각하게 합니다. 자연수를 분모가 같은 분수로 바꾸는 연습을 충분히 합니다.',
        '3 1/4−1 3/4처럼 분자를 뺄 수 없을 때 "자연수 1을 4/4로 쪼개서 2 5/4로 만들자"고 그림과 함께 보여 줍니다.'
      ],
      mistakes: [
        '분모끼리도 더함 (2/7+3/7=5/14)',
        '합이 가분수일 때 대분수로 바꾸지 않음',
        '1−2/5를 계산할 때 1을 분수로 바꾸지 못함',
        '받아내림할 때 자연수에서 1을 빼고 분자에 1만 더함 (3 1/4 → 2 2/4)'
      ],
      warmup: '케이크·피자 조각 놀이 — "8조각 중 엄마가 3조각, 네가 2조각 먹으면 전체의 얼마를 먹었을까?"',
      check: '"3 1/5 − 1 3/5을 계산할 때 자연수 1을 어떻게 바꿨는지 설명해 볼래?"',
      next: '5학년 1학기 약분과 통분을 배운 뒤, 분모가 다른 분수의 덧셈과 뺄셈으로 확장됩니다.',
      keywords: ['분모가같은', '분모같은분수', '진분수덧셈', '대분수덧셈', '진분수뺄셈', '대분수뺄셈', '자연수빼기분수', '받아내림', '4학년분수']
    },
    {
      id: 'g4u8', grade: 4, sem: 2, no: 2, title: '삼각형', icon: '🔺',
      lessons: ['변의 길이에 따라 삼각형 분류하기', '이등변삼각형의 성질', '정삼각형의 성질', '각의 크기에 따라 삼각형 분류하기', '두 가지 기준으로 삼각형 분류하기'],
      concept: '두 변의 길이가 같으면 이등변삼각형(두 밑각의 크기가 같음), 세 변의 길이가 같으면 정삼각형(세 각이 모두 60°)입니다. 각을 기준으로 세 각이 모두 예각이면 예각삼각형, 한 각이 둔각이면 둔각삼각형, 한 각이 직각이면 직각삼각형입니다.',
      script: [
        '빨대를 잘라 삼각형을 만들며 "같은 길이가 몇 개인지"로 분류해 봅니다.',
        '종이 이등변삼각형을 반으로 접으면 두 밑각이 꼭 겹친다는 것을 보여 줍니다. "길이가 같은 두 변 옆의 각이 같아."',
        '"정삼각형은 이등변삼각형이라고 할 수 있을까?" 두 변이 같다는 조건을 만족하니 "그렇다"는 것을 이야기 나눕니다.',
        '각으로 분류할 때는 가장 큰 각 하나만 보면 됩니다. "가장 큰 각이 90°보다 크면 둔각삼각형!"'
      ],
      mistakes: [
        '예각이 하나라도 있으면 예각삼각형이라고 생각함',
        '정삼각형은 이등변삼각형이 아니라고 생각함',
        '이등변삼각형에서 꼭지각과 밑각을 혼동',
        '둘레를 구할 때 같은 변을 한 번만 더함'
      ],
      warmup: '집 안 삼각형 찾기 — 옷걸이, 표지판, 샌드위치 단면을 보고 변·각 기준으로 이름 붙이기',
      check: '"세 각이 50°, 60°, 70°인 삼각형은 무슨 삼각형일까? 왜 그렇게 생각해?"',
      next: '4학년 사각형·다각형 단원, 5학년 합동과 대칭, 다각형의 넓이(삼각형 넓이)로 이어집니다.',
      keywords: ['삼각형', '이등변삼각형', '정삼각형', '예각삼각형', '둔각삼각형', '직각삼각형', '밑각', '꼭지각', '삼각형분류']
    },
    {
      id: 'g4u9', grade: 4, sem: 2, no: 3, title: '소수의 덧셈과 뺄셈', icon: '🔟',
      lessons: ['소수 두 자리 수', '소수 세 자리 수', '소수의 크기 비교', '소수 사이의 관계(10배, 1/10)', '소수 한 자리 수의 덧셈과 뺄셈', '소수 두 자리 수의 덧셈과 뺄셈', '자릿수가 다른 소수의 덧셈과 뺄셈'],
      concept: '0.01은 1을 100으로 나눈 하나, 0.001은 1을 1000으로 나눈 하나입니다. 소수의 덧셈과 뺄셈은 소수점끼리 맞추어 세로로 쓰고 자연수처럼 계산한 뒤, 소수점을 그대로 내려 찍습니다.',
      script: [
        '100칸 모눈종이에 1칸을 색칠하며 "이게 0.01이야", 37칸을 칠하면 0.37이라고 보여 줍니다.',
        '돈으로 연결해 봅니다. 1원을 1, 10원을 0.1이라 하면… 보다는 "1m = 100cm, 1cm = 0.01m"처럼 길이로 연결하면 더 자연스럽습니다.',
        '"소수점끼리 줄을 세워!" 세로셈을 쓸 때 소수점을 먼저 찍고 그 기준으로 숫자를 맞추게 합니다.',
        '자릿수가 다르면 끝에 0을 붙여 자릿수를 맞추면 실수가 줄어듭니다. 3.5 − 1.27 → 3.50 − 1.27'
      ],
      mistakes: [
        '끝자리를 맞춰 계산함 (3.5+1.27을 1.62로)',
        '자릿수가 많으면 더 큰 수라고 생각함 (0.125 > 0.3)',
        '받아내림할 때 빈 자리를 0으로 생각하지 못함',
        '답에 소수점을 빼먹음'
      ],
      warmup: '키·몸무게 기록 놀이 — 가족 키를 m 단위 소수(1.35m)로 적고 누가 얼마나 더 큰지 빼 보기',
      check: '"4.2 − 1.35를 세로로 쓸 때 어떻게 줄을 맞춰야 할까? 빈자리는 어떻게 할까?"',
      next: '5학년 소수의 곱셈, 6학년 소수의 나눗셈으로 이어지고, 5학년 분수와 소수의 크기 비교에도 쓰입니다.',
      keywords: ['소수', '소수두자리', '소수세자리', '소수점', '소수덧셈', '소수뺄셈', '소수크기비교', '0.01', '0.001', '소수점맞추기']
    },
    {
      id: 'g4u10', grade: 4, sem: 2, no: 4, title: '사각형', icon: '🟦',
      lessons: ['수직과 수선', '평행과 평행선', '평행선 사이의 거리', '사다리꼴', '평행사변형', '마름모', '여러 가지 사각형의 관계'],
      concept: '두 직선이 직각으로 만나면 수직, 아무리 늘여도 만나지 않으면 평행입니다. 평행한 변이 한 쌍이라도 있으면 사다리꼴, 두 쌍이면 평행사변형, 네 변의 길이가 모두 같으면 마름모입니다. 평행사변형은 마주 보는 변·각이 같고, 이웃한 두 각의 합은 180°입니다.',
      script: [
        '삼각자의 직각 부분을 대어 수선을 긋고, 공책 줄처럼 만나지 않는 선을 찾아 평행을 확인합니다.',
        '"평행선 사이의 거리는 수선의 길이야." 비스듬한 선은 거리가 아니라는 것을 자로 재어 비교해 봅니다.',
        '사각형 카드를 만들어 "평행한 변이 몇 쌍?", "네 변이 모두 같아?" 질문으로 상자에 분류해 봅니다.',
        '포함 관계는 그림(큰 동그라미 안에 작은 동그라미)으로 정리합니다. 정사각형은 직사각형·마름모·평행사변형·사다리꼴 모두에 들어갑니다.'
      ],
      mistakes: [
        '수직과 평행의 뜻을 바꿔 말함',
        '평행선 사이의 거리를 비스듬한 선분으로 잼',
        '정사각형은 마름모가 아니라고 생각함',
        '사다리꼴은 평행한 변이 꼭 한 쌍만 있어야 한다고 생각함'
      ],
      warmup: '집 안 수직·평행 찾기 — 창문틀, 책장, 철길 사진에서 수직과 평행인 곳을 손가락으로 짚어 보기',
      check: '"정사각형은 마름모라고 할 수 있을까? 왜 그런지 마름모의 뜻으로 설명해 볼래?"',
      next: '4학년 다각형 단원, 5학년 다각형의 둘레와 넓이(평행사변형·마름모·사다리꼴 넓이)로 바로 이어집니다.',
      keywords: ['사각형', '수직', '수선', '평행', '평행선', '평행선사이의거리', '사다리꼴', '평행사변형', '마름모', '사각형관계']
    },
    {
      id: 'g4u11', grade: 4, sem: 2, no: 5, title: '꺾은선그래프', icon: '📈',
      lessons: ['꺾은선그래프 알아보기', '꺾은선그래프 내용 알아보기', '꺾은선그래프 그리기', '물결선을 사용한 꺾은선그래프', '자료를 조사해 꺾은선그래프로 나타내기'],
      concept: '시간에 따라 변하는 양을 점으로 찍고 선분으로 이은 그래프입니다. 선이 많이 기울어질수록 변화가 크고, 필요 없는 부분은 물결선(≈)으로 줄여 변화를 더 잘 보이게 할 수 있습니다. 측정하지 않은 중간값도 어림할 수 있습니다.',
      script: [
        '"막대그래프는 크기 비교, 꺾은선그래프는 변화를 볼 때 좋아." 키·기온처럼 시간에 따라 바뀌는 자료를 예로 듭니다.',
        '선분이 오르면 늘어난 것, 내리면 줄어든 것, 기울기가 가파를수록 많이 변한 것이라고 손으로 따라가며 읽게 합니다.',
        '물결선은 "0부터 그리면 너무 길어지니 필요 없는 부분을 접어 둔 것"이라고 설명합니다.',
        '아이의 키나 화분 식물 키를 일주일마다 재서 직접 꺾은선그래프를 그려 봅니다.'
      ],
      mistakes: [
        '눈금 한 칸의 크기를 확인하지 않음',
        '변화가 가장 큰 때를 값이 가장 큰 때로 착각',
        '물결선 아래 생략된 부분을 무시하고 칸 수만 셈',
        '시간 순서가 없는 자료도 꺾은선그래프로 그림'
      ],
      warmup: '하루 기온 기록 — 아침·점심·저녁 기온을 날씨 앱에서 찾아 점을 찍고 이어 봅니다.',
      check: '"이 그래프에서 가장 많이 변한 때는 언제일까? 선을 보고 어떻게 알 수 있어?"',
      next: '5학년 평균과 가능성, 6학년 비율그래프, 중학교 자료의 정리와 해석으로 이어집니다.',
      keywords: ['꺾은선그래프', '꺾은선', '물결선', '변화', '기온변화', '가장많이변한', '그래프비교']
    },
    {
      id: 'g4u12', grade: 4, sem: 2, no: 6, title: '다각형', icon: '⬡',
      lessons: ['다각형', '정다각형', '대각선', '모양 만들기', '모양 채우기'],
      concept: '선분으로만 둘러싸인 도형을 다각형이라 하고, 변의 길이와 각의 크기가 모두 같으면 정다각형입니다. 이웃하지 않는 두 꼭짓점을 이은 선분이 대각선이며, n각형의 대각선은 n×(n−3)÷2개입니다.',
      script: [
        '"곡선이 섞이면 다각형이 아니야. 끊어진 곳이 있어도 안 돼." 다양한 그림을 보여 주며 다각형을 골라 봅니다.',
        '정다각형은 "변도 같고 각도 같아야 해"를 강조합니다. 마름모는 변은 같지만 각이 다르니 정다각형이 아닙니다.',
        '오각형을 그리고 한 꼭짓점에서 대각선을 그어 보며 "자기 자신과 양옆 꼭짓점 빼고 나머지로 그을 수 있네" 하고 규칙을 찾습니다.',
        '패턴 블록(삼각형·사각형·육각형)으로 모양을 만들거나 빈틈없이 채워 봅니다.'
      ],
      mistakes: [
        '이웃한 꼭짓점을 이은 변도 대각선이라고 셈',
        '대각선 수를 셀 때 같은 대각선을 두 번 셈',
        '변의 길이만 같으면 정다각형이라고 생각함',
        '원이나 곡선이 있는 도형도 다각형이라고 함'
      ],
      warmup: '이쑤시개로 다각형 만들기 — 이쑤시개 6개로 정육각형을 만들고 꼭짓점끼리 실로 대각선을 이어 봅니다.',
      check: '"육각형의 대각선은 몇 개일까? 빠뜨리거나 두 번 세지 않으려면 어떻게 세면 될까?"',
      next: '5학년 다각형의 둘레와 넓이, 합동과 대칭으로 이어지고, 중학교에서 다각형의 내각의 합으로 발전합니다.',
      keywords: ['다각형', '정다각형', '대각선', '대각선개수', '정오각형', '정육각형', '팔각형', '모양채우기', '모양만들기']
    }
  );

  /* ---------- 공통 도구 ---------- */
  const DG = ['', '일', '이', '삼', '사', '오', '육', '칠', '팔', '구'];
  const read4 = (g) => { const t = Math.floor(g / 1000), h = Math.floor(g / 100) % 10, s = Math.floor(g / 10) % 10, o = g % 10; let r = ''; if (t) r += (t === 1 ? '' : DG[t]) + '천'; if (h) r += (h === 1 ? '' : DG[h]) + '백'; if (s) r += (s === 1 ? '' : DG[s]) + '십'; if (o) r += DG[o]; return r; };
  const readKo = (n) => {
    const units = ['', '만', '억', '조'], parts = [];
    for (let i = 3; i >= 0; i--) { const g = Math.floor(n / Math.pow(10000, i)) % 10000; if (!g) continue; parts.push(i === 1 && g === 1 ? '만' : read4(g) + units[i]); }
    return parts.join(' ') || '영';
  };
  const placeNames = ['일', '십', '백', '천', '만', '십만', '백만', '천만', '억', '십억', '백억', '천억', '조'];
  const DIRS = ['위쪽', '오른쪽', '아래쪽', '왼쪽'];
  const arrowFig = (d) => svgWrap(`<g transform="rotate(${d * 90} 60 55)"><polygon points="60,15 85,45 70,45 70,95 50,95 50,45 35,45" ${shapeStyle}/></g>`, 120, 110);

  /* 막대그래프 SVG */
  const barChart = (title, unit, cats, vals, scale) => {
    const cells = Math.max(...vals) / scale + 1, top = 22, bottom = 150, ch = (bottom - top) / cells, left = 40, bw = 46, w = left + cats.length * bw + 12;
    let g = '';
    for (let i = 0; i <= cells; i++) { const y = bottom - i * ch; g += `<line x1="${left}" y1="${y.toFixed(1)}" x2="${w - 8}" y2="${y.toFixed(1)}" stroke="currentColor" stroke-opacity="${i ? 0.25 : 1}" stroke-width="1"/>${lbl(left - 6, (y + 4).toFixed(1), i * scale, 'end')}`; }
    g += `<line x1="${left}" y1="${top - 6}" x2="${left}" y2="${bottom}" stroke="currentColor" stroke-width="1.2"/>`;
    cats.forEach((c, i) => { const h = vals[i] / scale * ch, x = left + i * bw + 11; g += `<rect x="${x}" y="${(bottom - h).toFixed(1)}" width="24" height="${h.toFixed(1)}" fill="rgba(20,82,240,.55)" stroke="currentColor" stroke-width="1"/>${lbl(x + 12, bottom + 16, c)}`; });
    g += lbl(left - 6, 12, `(${unit})`, 'end') + lbl((left + w) / 2, 12, title);
    return svgWrap(g, w, 172);
  };
  /* 꺾은선그래프 SVG (base: 물결선 아래 생략 값) */
  const lineChart = (title, unit, xs, vals, scale, base) => {
    const cells = (Math.max(...vals) - base) / scale + 1, top = 22, bottom = 150, ch = (bottom - top) / cells, left = 40, bw = 46, w = left + xs.length * bw + 12;
    let g = '';
    for (let i = 0; i <= cells; i++) { const y = bottom - i * ch; g += `<line x1="${left}" y1="${y.toFixed(1)}" x2="${w - 8}" y2="${y.toFixed(1)}" stroke="currentColor" stroke-opacity="${i ? 0.25 : 1}" stroke-width="1"/>${lbl(left - 6, (y + 4).toFixed(1), i === 0 && base ? 0 : base + i * scale, 'end')}`; }
    g += `<line x1="${left}" y1="${top - 6}" x2="${left}" y2="${bottom}" stroke="currentColor" stroke-width="1.2"/>`;
    if (base) g += `<path d="M${left - 5} ${bottom - ch * 0.35} q5 -4 10 0 q5 4 10 0" fill="none" stroke="currentColor" stroke-width="1.4"/>`;
    const pts = vals.map((v, i) => [left + i * bw + 23, bottom - (v - base) / scale * ch]);
    g += `<polyline points="${pts.map(p => p[0] + ',' + p[1].toFixed(1)).join(' ')}" fill="none" stroke="rgb(20,82,240)" stroke-width="2"/>`;
    pts.forEach((p, i) => { g += `<circle cx="${p[0]}" cy="${p[1].toFixed(1)}" r="3.2" fill="rgb(20,82,240)"/>${lbl(p[0], bottom + 16, xs[i])}`; });
    g += lbl(left - 6, 12, `(${unit})`, 'end') + lbl((left + w) / 2, 12, title);
    return svgWrap(g, w, 172);
  };
  /* 모눈 위 점 SVG: pts = [[col,row,label],...], 칸 기준 좌표(왼쪽 위 0,0) */
  const gridFig = (cols, rows, pts) => {
    const s = 26, o = 14; let g = '';
    for (let i = 0; i <= cols; i++) g += `<line x1="${o + i * s}" y1="${o}" x2="${o + i * s}" y2="${o + rows * s}" stroke="currentColor" stroke-opacity=".3"/>`;
    for (let j = 0; j <= rows; j++) g += `<line x1="${o}" y1="${o + j * s}" x2="${o + cols * s}" y2="${o + j * s}" stroke="currentColor" stroke-opacity=".3"/>`;
    pts.forEach(([c, r, t]) => { const x = o + c * s, y = o + r * s; g += `<circle cx="${x}" cy="${y}" r="4" fill="${t === 'ㄱ' ? 'rgb(240,82,20)' : 'rgb(20,82,240)'}"/><text x="${x + 6}" y="${y - 6}" font-size="12" fill="currentColor">${t}</text>`; });
    return svgWrap(g, o * 2 + cols * s, o * 2 + rows * s);
  };
  const bat = (w) => { w = String(w); const c = w.charCodeAt(w.length - 1); if (c >= 0xAC00 && c <= 0xD7A3) return (c - 0xAC00) % 28 !== 0; return /[013678]$/.test(w); };
  const iga = (w) => bat(w) ? '이' : '가';
  const eun = (w) => bat(w) ? '은' : '는';
  const eul = (w) => bat(w) ? '을' : '를';
  const dn = (c) => /^[월화수목금]$/.test(c) ? c + '요일' : /^[가나다라마]$/.test(c) ? c + ' 마을' : c;
  const fracOk = (n, d) => { const r = n % d; return r === 0 || gcd(r, d) === 1; };
  const polyNm = { 3: '삼각형', 4: '사각형', 5: '오각형', 6: '육각형', 7: '칠각형', 8: '팔각형', 9: '구각형', 10: '십각형', 11: '십일각형', 12: '십이각형' };

  /* 1. 큰 수 */
  R('g4u1', (lv) => {
    const basic = [
      () => { const a = ri(1, 9), b = ri(0, 9), c = ri(0, 9), d = ri(0, 99); return P.int(`10000이 ${a}개, 1000이 ${b}개, 100이 ${c}개, 1이 ${d}개인 수를 쓰세요.`, a * 10000 + b * 1000 + c * 100 + d); },
      () => { const a = ri(1, 9999), b = ri(0, 9999); return P.int(`억이 ${fmt(a)}개, 만이 ${fmt(b)}개인 수를 쓰세요.`, a * 1e8 + b * 1e4); },
      () => { const n = ri(2, 9999) * 1e8 + ri(0, 9999) * 1e4 + ri(0, 9999); return P.int(`다음을 수로 쓰세요. <b>${readKo(n)}</b>`, n); },
      () => { const len = ri(9, 12), n = ri(Math.pow(10, len - 1), Math.pow(10, len) - 1), p = ri(4, len - 1); return P.int(`${fmt(n)}에서 ${placeNames[p]}의 자리 숫자는 무엇일까요?`, Math.floor(n / Math.pow(10, p)) % 10); },
      () => { const step = pick([[10000, '1만'], [100000, '10만'], [1000000, '100만'], [10000000, '1000만'], [100000000, '1억']]), k = ri(3, 6), s = ri(10, 999) * step[0] / 10 + ri(0, 9999); return P.int(`${fmt(s)}에서 ${step[1]}씩 ${k}번 뛰어 센 수는 얼마일까요?`, s + step[0] * k); },
      () => { const len = ri(8, 11), a = ri(Math.pow(10, len - 1), Math.pow(10, len) - 1); const p = ri(2, len - 2); const b = a + pick([-1, 1]) * Math.pow(10, p) * ri(1, 3); if (b <= 0 || String(b).length !== String(a).length || a === b) return null; return P.choice(`두 수의 크기를 비교하세요. ${fmt(a)} ○ ${fmt(b)}`, ['&gt;', '&lt;'], a > b ? 0 : 1); },
      () => { const n = ri(2, 9) * 1e12 + ri(0, 9999) * 1e8 + ri(0, 9999) * 1e4; return P.int(`${fmt(n)}에서 조의 자리 숫자는 무엇일까요?`, Math.floor(n / 1e12)); }
    ];
    const adv = [
      () => { const a = ri(1, 9), b = ri(1, 30), c = ri(1, 30); return P.int(`10만 원짜리 수표 ${a}장, 만 원짜리 지폐 ${b}장, 천 원짜리 지폐 ${c}장은 모두 얼마일까요?`, a * 100000 + b * 10000 + c * 1000, { unit: '원', word: true }); },
      () => { const ds = shuffle([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]).slice(0, 8), big = ds.slice().sort((a, b) => b - a).join(''); return P.int(`수 카드 ${ds.join(', ')}를 한 번씩 모두 사용하여 만들 수 있는 가장 큰 여덟 자리 수를 쓰세요.`, Number(big), { word: true }); },
      () => { const ds = shuffle([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]).slice(0, 8); if (!ds.includes(0)) return null; const s = ds.slice().sort((a, b) => a - b); const f = s.find(x => x > 0); s.splice(s.indexOf(f), 1); return P.int(`수 카드 ${ds.join(', ')}를 한 번씩 모두 사용하여 만들 수 있는 가장 작은 여덟 자리 수를 쓰세요.`, Number(f + s.join('')), { word: true }); },
      () => { const step = pick([[10000000, '1000만'], [100000000, '1억'], [10000000000, '100억'], [100000000000, '1000억']]), k = ri(2, 5), s = ri(11, 99) * step[0] + ri(0, 99) * step[0] / 100; return P.int(`어떤 수에서 ${step[1]}씩 ${k}번 뛰어 세었더니 ${fmt(s + step[0] * k)}${iga(fmt(s + step[0] * k))} 되었습니다. 어떤 수는 얼마일까요?`, s, { word: true }); },
      () => { const m = ri(2, 9) * 10000, mon = pick([12, 10, 6, 8]); return P.int(`한 달에 ${fmt(m)}원씩 ${mon}개월 동안 저금하면 모두 얼마가 될까요?`, m * mon, { unit: '원', word: true }); },
      () => { const t = pick([[1e8, '1억', 1e4, '1만'], [1e8, '1억', 1e6, '100만'], [1e12, '1조', 1e8, '1억'], [1e7, '1000만', 1e5, '10만'], [1e12, '1조', 1e10, '100억']]), k = ri(2, 9); return P.int(`${t[1]}${iga(t[1])} ${k}개인 수는 ${t[3]}${iga(t[3])} 몇 개인 수일까요?`, k * t[0] / t[2], { unit: '개' }); },
      () => { const len = ri(9, 11), p = ri(4, len - 1), d = ri(1, 9); let s = ''; for (let i = len - 1; i >= 0; i--) { let x = i === p ? d : ri(0, 9); if (i !== p && x === d) x = (d + ri(1, 8)) % 10; if (i === len - 1 && x === 0) x = d === 1 ? 2 : 1; s += x; } if (s[0] === '0') return null; const n = Number(s); const opts = [p, p + 1, p - 1, p + 2].filter(x => x >= 0 && x < len).slice(0, 3); const sh = shuffle(opts); return P.choice(`${fmt(n)}에서 숫자 ${d}${eun(d)} 어느 자리 숫자일까요?`, sh.map(x => placeNames[x] + '의 자리'), sh.indexOf(p)); }
    ];
    return (lv === 2 ? pick([...adv, ...adv, ...basic]) : pick(basic))();
  });

  /* 2. 각도 */
  R('g4u2', (lv) => {
    const basic = [
      () => { const a = ri(15, 170), b = ri(15, 170); return P.int(`${a}° + ${b}°는 몇 도일까요?`, a + b, { unit: '°' }); },
      () => { const a = ri(60, 180), b = ri(10, a - 5); return P.int(`${a}° − ${b}°는 몇 도일까요?`, a - b, { unit: '°' }); },
      () => { const a = ri(20, 110), b = ri(20, 150 - a); return P.int(`삼각형의 두 각이 ${a}°, ${b}°입니다. 나머지 한 각은 몇 도일까요?`, 180 - a - b, { unit: '°' }); },
      () => { const a = ri(50, 130), b = ri(50, 130), c = ri(40, 130); const d = 360 - a - b - c; if (d < 30 || d > 170) return null; return P.int(`사각형의 세 각이 ${a}°, ${b}°, ${c}°입니다. 나머지 한 각은 몇 도일까요?`, d, { unit: '°' }); },
      () => { let a = ri(5, 175); if (a === 90) a = 95; return P.choice(`${a}°는 예각, 직각, 둔각 중 어느 것일까요?`, ['예각', '직각', '둔각'], a < 90 ? 0 : 2); },
      () => { const h = ri(1, 11); return P.int(`시계가 ${h}시 정각을 가리킬 때 긴바늘과 짧은바늘이 이루는 작은 쪽의 각은 몇 도일까요?`, Math.min(30 * h, 360 - 30 * h), { unit: '°' }); }
    ];
    const adv = [
      () => { const a = ri(20, 160); return P.int(`한 직선 위에서 두 각이 나란히 붙어 있습니다. 한 각이 ${a}°라면 다른 한 각은 몇 도일까요?`, 180 - a, { unit: '°' }); },
      () => { const a = ri(10, 80); return P.int(`직각을 두 각으로 나누었습니다. 한 각이 ${a}°라면 다른 한 각은 몇 도일까요?`, 90 - a, { unit: '°' }); },
      () => { let a = ri(10, 160); if (a % 2) a++; return P.int(`삼각형의 한 각이 ${a}°이고 나머지 두 각의 크기가 같습니다. 나머지 한 각은 몇 도일까요?`, (180 - a) / 2, { unit: '°', word: true }); },
      () => { const a = ri(50, 140), b = ri(50, 140); const r = 360 - a - b; if (r % 2 || r / 2 < 30 || r / 2 > 160) return null; return P.int(`사각형의 두 각이 ${a}°, ${b}°이고 나머지 두 각의 크기가 같습니다. 나머지 한 각은 몇 도일까요?`, r / 2, { unit: '°', word: true }); },
      () => { const m = ri(2, 55); return P.int(`시계의 긴바늘이 ${m}분 동안 움직인 각도는 몇 도일까요? (긴바늘은 60분에 한 바퀴 돕니다.)`, 6 * m, { unit: '°', word: true }); },
      () => { const s = [30, 45, 60, 90]; const a = pick(s), b = pick(s); const op = pick(['합', '차']); if (op === '차' && a === b) return null; return P.int(`두 삼각자의 각 ${a}°와 ${b}°를 이용해 만든 두 각의 ${op === '합' ? '합은' : '차는'} 몇 도일까요?`, op === '합' ? a + b : Math.abs(a - b), { unit: '°' }); },
      () => { const a = ri(30, 80), b = ri(30, 80); if (a + b >= 170 || a + b <= 95) return null; return P.int(`삼각형의 두 각이 ${a}°, ${b}°입니다. 나머지 한 각은 주어진 두 각의 합보다 몇 도 더 작을까요?`, 2 * (a + b) - 180, { unit: '°', word: true }); }
    ];
    return (lv === 2 ? pick([...adv, ...adv, ...basic]) : pick(basic))();
  });

  /* 3. 곱셈과 나눗셈 */
  R('g4u3', (lv) => {
    const basic = [
      () => { const a = ri(101, 999), b = ri(2, 9) * 10; return P.int(`${a} × ${b}`, a * b); },
      () => { const a = ri(101, 999), b = ri(11, 99); if (b % 10 === 0) return null; return P.int(`${a} × ${b}`, a * b); },
      () => { const a = ri(1, 9) * 100, b = ri(1, 9) * 10; return P.int(`${a} × ${b}`, a * b); },
      () => { const b = ri(2, 9) * 10, q = ri(2, 9), a = b * q + ri(0, 9) * 10; return P.int(`${a} ÷ ${b}의 몫을 구하세요.`, Math.floor(a / b)); },
      () => { const b = ri(12, 99), a = ri(100, 999); return P.int(`${a} ÷ ${b}의 몫을 구하세요.`, Math.floor(a / b)); },
      () => { const b = ri(12, 99), a = ri(100, 999); if (a % b === 0) return null; return P.int(`${a} ÷ ${b}의 나머지를 구하세요.`, a % b); },
      () => { const b = ri(12, 49), a = ri(b + 1, 99); if (a % b === 0) return null; return P.int(`${a} ÷ ${b}의 나머지를 구하세요.`, a % b); }
    ];
    const adv = [
      () => { const p = ri(12, 95) * 10, n = ri(12, 45); return P.int(`한 개에 ${fmt(p)}원인 공책을 ${n}권 사려면 모두 얼마가 필요할까요?`, p * n, { unit: '원', word: true }); },
      () => { const cap = ri(25, 45), n = ri(150, 600); if (n % cap === 0) return null; return P.int(`학생 ${n}명이 체험 학습을 갑니다. 버스 한 대에 ${cap}명씩 탈 수 있다면 모두 타려면 버스는 적어도 몇 대 필요할까요?`, Math.ceil(n / cap), { unit: '대', word: true }); },
      () => { const per = ri(12, 35), n = ri(150, 500); if (n % per === 0) return null; return P.int(`${n}쪽짜리 책을 하루에 ${per}쪽씩 읽으면 모두 읽는 데 며칠이 걸릴까요?`, Math.ceil(n / per), { unit: '일', word: true }); },
      () => { const b = ri(12, 45), q = ri(5, 25), r = ri(1, b - 1); return P.int(`어떤 수를 ${b}로 나누었더니 몫이 ${q}, 나머지가 ${r}였습니다. 어떤 수는 얼마일까요?`, b * q + r, { word: true }); },
      () => { const b = ri(15, 40), n = ri(200, 800); if (n % b === 0) return null; return P.int(`사탕 ${n}개를 한 봉지에 ${b}개씩 담으면 몇 개가 남을까요?`, n % b, { unit: '개', word: true }); },
      () => { const b = ri(13, 48), N = ri(300, 900); return P.int(`${b} × □ &lt; ${N}에서 □ 안에 들어갈 수 있는 가장 큰 자연수는 무엇일까요?`, Math.floor((N - 1) / b)); },
      () => { const m = ri(15, 45), h = pick([12, 15, 24, 30]); return P.int(`하루에 ${m}분씩 줄넘기를 합니다. ${h}일 동안 줄넘기를 한 시간은 모두 몇 분일까요?`, m * h, { unit: '분', word: true }); }
    ];
    return (lv === 2 ? pick([...adv, ...adv, ...basic]) : pick(basic))();
  });

  /* 4. 평면도형의 이동 */
  R('g4u4', (lv) => {
    const rot = (d, deg, cw) => (d + (cw ? 1 : -1) * deg / 90 + 8) % 4;
    const flip = (d, side) => (side === '왼쪽' || side === '오른쪽') ? (d === 1 ? 3 : d === 3 ? 1 : d) : (d === 0 ? 2 : d === 2 ? 0 : d);
    const rotMap = { 2: 2, 5: 5, 6: 9, 8: 8, 9: 6 };
    const pointMove = () => {
      const cols = 8, rows = 6, x0 = ri(1, 4), y0 = ri(2, 4), dx = ri(1, 3), dy = ri(1, 2), upDir = pick(['위쪽', '아래쪽']);
      const ty = upDir === '위쪽' ? y0 - dy : y0 + dy; if (ty < 0 || ty > rows) return null;
      const target = [x0 + dx, ty], wrongs = [[x0 + dy, upDir === '위쪽' ? y0 - dx : y0 + dx], [x0 - dx, ty], [x0 + dx, upDir === '위쪽' ? y0 + dy : y0 - dy]];
      const all = [target, ...wrongs].filter(([c, r]) => c >= 0 && c <= cols && r >= 0 && r <= rows);
      const uniq = all.filter((p, i) => all.findIndex(q => q[0] === p[0] && q[1] === p[1]) === i && !(p[0] === x0 && p[1] === y0));
      if (uniq.length < 3 || uniq[0] !== target) return null;
      const names = ['ㄴ', 'ㄷ', 'ㄹ', 'ㅁ'].slice(0, uniq.length), order = shuffle(uniq.map((_, i) => i));
      const pts = [[x0, y0, 'ㄱ'], ...order.map((k, j) => [uniq[k][0], uniq[k][1], names[j]])];
      return P.choice(`점 ㄱ을 오른쪽으로 ${dx}칸, ${upDir}으로 ${dy}칸 이동한 위치에 있는 점은 무엇일까요?${gridFig(cols, rows, pts)}`, names.map(n => '점 ' + n), order.indexOf(0));
    };
    const basic = [
      () => { const d = ri(0, 3), deg = pick([90, 180, 270]), cw = Math.random() < .5; return P.choice(`${DIRS[d]}을 가리키는 화살표를 시계 ${cw ? '' : '반대 '}방향으로 ${deg}° 돌리면 어느 쪽을 가리킬까요?`, DIRS, rot(d, deg, cw), { fig: arrowFig(d) }); },
      () => { const d = ri(0, 3), side = pick(DIRS); return P.choice(`${DIRS[d]}을 가리키는 화살표를 ${side}으로 뒤집으면 어느 쪽을 가리킬까요?`, DIRS, flip(d, side), { fig: arrowFig(d) }); },
      () => { const d = ri(0, 3), side = pick(DIRS), cm = ri(2, 15); return P.choice(`${DIRS[d]}을 가리키는 화살표를 ${side}으로 ${cm}cm 밀면 어느 쪽을 가리킬까요?`, DIRS, d, { fig: arrowFig(d) }); },
      pointMove,
      () => { const cols = 8, x0 = ri(0, 3), y0 = ri(0, 5), dx = ri(2, 5); if (x0 + dx > cols) return null; return P.int(`점 ㄱ을 점 ㄴ의 위치로 옮기려면 오른쪽으로 몇 칸 이동해야 할까요?${gridFig(cols, 5, [[x0, Math.min(y0, 5), 'ㄱ'], [x0 + dx, Math.min(y0, 5), 'ㄴ']])}`, dx, { unit: '칸' }); }
    ];
    const adv = [
      () => { const d = ri(0, 3), deg1 = pick([90, 180, 270]), cw1 = Math.random() < .5, side = pick(DIRS); const r = flip(rot(d, deg1, cw1), side); return P.choice(`${DIRS[d]}을 가리키는 화살표를 시계 ${cw1 ? '' : '반대 '}방향으로 ${deg1}° 돌린 다음 ${side}으로 뒤집었습니다. 화살표는 어느 쪽을 가리킬까요?`, DIRS, r, { fig: arrowFig(d), word: true }); },
      () => { const d = ri(0, 3), side = pick(DIRS), deg = pick([90, 180, 270]), cw = Math.random() < .5; const r = rot(flip(d, side), deg, cw); return P.choice(`${DIRS[d]}을 가리키는 화살표를 ${side}으로 뒤집은 다음 시계 ${cw ? '' : '반대 '}방향으로 ${deg}° 돌렸습니다. 화살표는 어느 쪽을 가리킬까요?`, DIRS, r, { fig: arrowFig(d), word: true }); },
      () => { const k = ri(2, 9), d = ri(0, 3); return P.choice(`${DIRS[d]}을 가리키는 화살표를 시계 방향으로 90°씩 ${k}번 돌리면 어느 쪽을 가리킬까요?`, DIRS, (d + k) % 4, { fig: arrowFig(d), word: true }); },
      () => { const ds = [ri(0, 4), ri(0, 4), ri(0, 4)].map(i => [2, 5, 6, 8, 9][i]); const r = Number(ds.slice().reverse().map(x => rotMap[x]).join('')); return P.int(`디지털 숫자 카드 <b>${ds.join(' ')}</b>를 늘어놓은 그대로 180° 돌리면 어떤 수가 될까요?`, r, { word: true }); },
      () => { const deg = pick([90, 180, 270]), cw = Math.random() < .5; return P.int(`시계 ${cw ? '' : '반대 '}방향으로 ${deg}° 돌린 것과 같은 모양이 되려면 시계 ${cw ? '반대 ' : ''}방향으로 몇 도 돌려야 할까요? (360°보다 작은 각도)`, 360 - deg, { unit: '°' }); },
      pointMove
    ];
    return (lv === 2 ? pick([...adv, ...adv, ...basic]) : pick(basic))();
  });

  /* 5. 막대그래프 */
  const barSets = [
    ['좋아하는 과일별 학생 수', '명', ['사과', '포도', '귤', '배', '딸기'], '학생'],
    ['좋아하는 운동별 학생 수', '명', ['축구', '수영', '줄넘기', '야구', '농구'], '학생'],
    ['반별 모은 빈 병 수', '개', ['1반', '2반', '3반', '4반', '5반'], '빈 병'],
    ['요일별 읽은 책 수', '권', ['월', '화', '수', '목', '금'], '책'],
    ['마을별 나무 수', '그루', ['가', '나', '다', '라', '마'], '나무']
  ];
  const makeBars = () => {
    const set = pick(barSets), k = ri(4, 5), scale = pick([1, 2, 2, 5, 10]);
    const cats = set[2].slice(0, k);
    let vals; do { vals = cats.map(() => ri(1, 9) * scale); } while (new Set(vals).size < k);
    return { set, cats, vals, scale, svg: barChart(set[0], set[1], cats, vals, scale) };
  };
  R('g4u5', (lv) => {
    const basic = [
      () => { const b = makeBars(), i = ri(0, b.cats.length - 1); return P.int(`막대그래프를 보고 ${dn(b.cats[i])}의 ${b.set[3]} 수를 구하세요.${b.svg}`, b.vals[i], { unit: b.set[1] }); },
      () => { const b = makeBars(); const mx = b.vals.indexOf(Math.max(...b.vals)); return P.choice(`막대그래프에서 ${b.set[3]} 수가 가장 많은 것은 무엇일까요?${b.svg}`, b.cats, mx); },
      () => { const b = makeBars(); const mn = b.vals.indexOf(Math.min(...b.vals)); return P.choice(`막대그래프에서 ${b.set[3]} 수가 가장 적은 것은 무엇일까요?${b.svg}`, b.cats, mn); },
      () => { const b = makeBars(); return P.int(`막대그래프에서 세로 눈금 한 칸은 몇 ${b.set[1]}${eul(b.set[1])} 나타낼까요?${b.svg}`, b.scale, { unit: b.set[1] }); },
      () => { const scale = pick([1, 2, 5, 10]), v = ri(2, 10) * scale; return P.int(`표의 자료를 막대그래프로 나타내려고 합니다. 세로 눈금 한 칸이 ${scale}명을 나타낸다면 ${v}명은 몇 칸으로 나타내야 할까요?`, v / scale, { unit: '칸' }); }
    ];
    const adv = [
      () => { const b = makeBars(); let i = ri(0, b.cats.length - 1), j = ri(0, b.cats.length - 1); if (b.vals[i] <= b.vals[j]) return null; return P.int(`막대그래프에서 ${dn(b.cats[i])}의 ${b.set[3]} 수는 ${dn(b.cats[j])}보다 몇 ${b.set[1]} 더 많을까요?${b.svg}`, b.vals[i] - b.vals[j], { unit: b.set[1], word: true }); },
      () => { const b = makeBars(); return P.int(`막대그래프에 나타난 ${b.set[3]} 수는 모두 몇 ${b.set[1]}일까요?${b.svg}`, b.vals.reduce((s, x) => s + x, 0), { unit: b.set[1], word: true }); },
      () => { const b = makeBars(); const i = ri(0, b.cats.length - 1), j = ri(0, b.cats.length - 1); if (i === j || b.vals[i] % b.vals[j] || b.vals[i] / b.vals[j] < 2) return null; return P.int(`막대그래프에서 ${dn(b.cats[i])}의 ${b.set[3]} 수는 ${dn(b.cats[j])}의 몇 배일까요?${b.svg}`, b.vals[i] / b.vals[j], { unit: '배', word: true }); },
      () => { const cats = ['봄', '여름', '가을', '겨울'], vals = cats.map(() => ri(3, 15)), miss = ri(0, 3), tot = vals.reduce((s, x) => s + x, 0); const shown = vals.map((v, i) => i === miss ? '□' : v); return P.int(`좋아하는 계절을 조사한 표입니다. 조사한 학생이 모두 ${tot}명일 때, ${cats[miss]}을 좋아하는 학생은 몇 명일까요?${table('계절', '학생 수(명)', cats, shown)}`, vals[miss], { unit: '명', word: true }); },
      () => { const cells = pick([5, 10]), scale = pick([2, 5, 10, 20]), k = ri(3, 12); return P.int(`막대그래프의 세로 눈금 ${cells}칸이 ${cells * scale}명을 나타냅니다. 막대의 길이가 ${k}칸인 항목은 몇 명일까요?`, k * scale, { unit: '명', word: true }); }
    ];
    return (lv === 2 ? pick([...adv, ...adv, ...basic]) : pick(basic))();
  });

  /* 6. 규칙 찾기 */
  R('g4u6', (lv) => {
    const basic = [
      () => { const step = pick([10, 100, 1000, 110, 101, 200, 500, 1100]), s = ri(100, 5000); const seq = [0, 1, 2, 3].map(i => s + step * i); return P.int(`규칙에 따라 수를 늘어놓았습니다. 다음에 올 수는 무엇일까요? ${seq.map(fmt).join(', ')}, □`, s + step * 4); },
      () => { const step = pick([10, 100, 1000, 11, 101]), s = ri(5000, 9999); const seq = [0, 1, 2, 3].map(i => s - step * i); return P.int(`규칙에 따라 수를 늘어놓았습니다. 다음에 올 수는 무엇일까요? ${seq.map(fmt).join(', ')}, □`, s - step * 4); },
      () => { const k = pick([2, 3]), s = ri(2, 9); const seq = [0, 1, 2, 3].map(i => s * Math.pow(k, i)); return P.int(`규칙에 따라 수를 늘어놓았습니다. 다음에 올 수는 무엇일까요? ${seq.join(', ')}, □`, s * Math.pow(k, 4)); },
      () => { const s = ri(1, 9) * 1000 + ri(1, 9) * 100 + ri(0, 9) * 10 + ri(0, 9), dx = pick([1, 10, 100]), dy = pick([10, 100, 1000].filter(x => x !== dx)); const r = ri(0, 2), c = ri(0, 3); if (r === 0 && c === 0) return null; const rows = [0, 1, 2].map(i => [0, 1, 2, 3].map(j => (i === r && j === c) ? '□' : fmt(s + i * dy + j * dx))); const html = `<table class="qt">${rows.map(row => `<tr>${row.map(x => `<td>${x}</td>`).join('')}</tr>`).join('')}</table>`; return P.int(`수 배열표의 규칙을 찾아 □에 알맞은 수를 구하세요.${html}`, s + r * dy + c * dx); },
      () => { const a = ri(1, 5) * 100, d = ri(1, 4) * 100, k = ri(4, 6); const lines = [0, 1, 2].map(i => `${a + d * i} + ${a + d * i + 100} = ${2 * (a + d * i) + 100}`); return P.int(`계산식의 규칙을 찾아 ${k}번째 계산식의 계산 결과를 구하세요.<br>${lines.join('<br>')}`, 2 * (a + d * (k - 1)) + 100); }
    ];
    const adv = [
      () => { const n = ri(5, 15); return P.int(`바둑돌을 정사각형 모양으로 늘어놓았습니다. 첫째에 1개, 둘째에 4개, 셋째에 9개, 넷째에 16개입니다. ${n}번째에는 바둑돌이 몇 개일까요?`, n * n, { unit: '개', word: true }); },
      () => { const n = ri(5, 12); return P.int(`도형을 늘어놓았습니다. 첫째에 1개, 둘째에 3개, 셋째에 6개, 넷째에 10개입니다. ${n}번째에는 도형이 몇 개일까요?`, n * (n + 1) / 2, { unit: '개', word: true }); },
      () => { const a = ri(2, 30), d = ri(3, 15), k = ri(8, 20); return P.int(`첫째 수가 ${a}이고 바로 앞의 수보다 ${d}씩 커지는 규칙으로 수를 늘어놓았습니다. ${k}번째 수는 무엇일까요?`, a + d * (k - 1), { word: true }); },
      () => { const k = ri(4, 9); return P.int(`37 × 3 = 111, 37 × 6 = 222, 37 × 9 = 333 … 규칙을 이용하여 37 × ${3 * k}의 값을 구하세요.`, 37 * 3 * k); },
      () => { const ab = pick([45, 56, 67, 78, 89, 46, 57, 68, 79, 58, 69, 47, 48, 59, 87, 76, 65, 98, 91, 82]); return P.int(`101 × 12 = 1212, 101 × 23 = 2323, 101 × 34 = 3434 … 규칙을 이용하여 101 × ${ab}의 값을 구하세요.`, 101 * ab); },
      () => { const n = ri(5, 9); const terms = []; for (let i = 1; i <= n; i++) terms.push(i); for (let i = n - 1; i >= 1; i--) terms.push(i); return P.int(`1 + 2 + 1 = 4, 1 + 2 + 3 + 2 + 1 = 9, 1 + 2 + 3 + 4 + 3 + 2 + 1 = 16 … 규칙을 이용하여 ${terms.join(' + ')}의 값을 구하세요.`, n * n); },
      () => { const n = ri(8, 25); return P.int(`성냥개비로 삼각형을 옆으로 이어 붙여 만듭니다. 삼각형 1개에 3개, 2개에 5개, 3개에 7개가 필요합니다. 삼각형 ${n}개를 만들려면 성냥개비가 몇 개 필요할까요?`, 2 * n + 1, { unit: '개', word: true }); }
    ];
    return (lv === 2 ? pick([...adv, ...adv, ...basic]) : pick(basic))();
  });

  /* 7. 분수의 덧셈과 뺄셈 (분모가 같은 분수) */
  R('g4u7', (lv) => {
    const D = () => ri(3, 13);
    const basic = [
      () => { const d = D(), a = ri(1, d - 1), b = ri(1, d - 1); if (!fracOk(a + b, d)) return null; return P.frac(`${F(a, d)} + ${F(b, d)}`, a + b, d); },
      () => { const d = D(), a = ri(2, d - 1), b = ri(1, a - 1); if (!fracOk(a - b, d)) return null; return P.frac(`${F(a, d)} − ${F(b, d)}`, a - b, d); },
      () => { const d = D(), w1 = ri(1, 5), w2 = ri(1, 5), a = ri(1, d - 1), b = ri(1, d - 1); const n = (w1 + w2) * d + a + b; if (!fracOk(n, d)) return null; return P.frac(`${M(w1, a, d)} + ${M(w2, b, d)}`, n, d); },
      () => { const d = D(), w1 = ri(2, 7), w2 = ri(1, w1 - 1), a = ri(1, d - 1), b = ri(1, a); const n = (w1 - w2) * d + a - b; if (!fracOk(n, d)) return null; return P.frac(`${M(w1, a, d)} − ${M(w2, b, d)}`, n, d); },
      () => { const d = D(), w = ri(1, 6), a = ri(1, d - 1); if (!fracOk(w * d - a, d)) return null; return P.frac(`${w} − ${F(a, d)}`, w * d - a, d); }
    ];
    const adv = [
      () => { const d = D(), w1 = ri(3, 8), w2 = ri(1, w1 - 1), a = ri(1, d - 2), b = ri(a + 1, d - 1); const n = (w1 - w2) * d + a - b; if (!fracOk(n, d)) return null; return P.frac(`${M(w1, a, d)} − ${M(w2, b, d)}`, n, d, { tag: '받아내림' }); },
      () => { const d = D(), w = ri(2, 7), w2 = ri(1, w - 1), b = ri(1, d - 1); const n = (w - w2) * d - b; if (!fracOk(n, d)) return null; return P.frac(`${w} − ${M(w2, b, d)}`, n, d); },
      () => { const d = D(), a = ri(1, d - 1), b = ri(1, d - 1); if (!fracOk(a + b, d)) return null; return P.frac(`우유를 어제는 ${F(a, d)} L, 오늘은 ${F(b, d)} L 마셨습니다. 이틀 동안 마신 우유는 모두 몇 L일까요?`, a + b, d, { unit: 'L', word: true }); },
      () => { const d = D(), w = ri(2, 5), a = ri(1, d - 1), b = ri(1, d - 1); const n = w * d + a - b; if (!fracOk(n, d)) return null; return P.frac(`길이가 ${M(w, a, d)} m인 리본에서 ${F(b, d)} m를 잘라 썼습니다. 남은 리본은 몇 m일까요?`, n, d, { unit: 'm', word: true }); },
      () => { const d = D(), w1 = ri(1, 4), a = ri(1, d - 1), w2 = ri(1, 4), b = ri(1, d - 1); const n = (w1 + w2) * d + a + b; if (!fracOk(n, d)) return null; return P.frac(`어떤 수에서 ${M(w1, a, d)}을(를) 뺐더니 ${M(w2, b, d)}이(가) 되었습니다. 어떤 수는 얼마일까요?`, n, d, { word: true }); },
      () => { const d = ri(5, 15), a = ri(1, d - 2); return P.int(`${F(a, d)} + ${F('□', d)} &lt; 1에서 □ 안에 들어갈 수 있는 자연수 중 가장 큰 수는 무엇일까요?`, d - a - 1); },
      () => { const d = D(), w = ri(3, 6), a = ri(1, d - 1), b = ri(1, d - 1), c = ri(1, d - 1); const n = w * d + a - b - c; if (n <= 0 || !fracOk(n, d)) return null; return P.frac(`밀가루 ${M(w, a, d)} kg 중에서 빵을 만드는 데 ${F(b, d)} kg, 쿠키를 만드는 데 ${F(c, d)} kg을 썼습니다. 남은 밀가루는 몇 kg일까요?`, n, d, { unit: 'kg', word: true }); }
    ];
    const p = (lv === 2 ? pick([...adv, ...adv, ...basic]) : pick(basic))();
    if (!p) return null;
    const ops = [...p.q.matchAll(/<span class="fn">(\d+)<\/span><span class="fd">(\d+)<\/span>/g)];
    return ops.every(m => gcd(+m[1], +m[2]) === 1) ? p : null;
  });

  /* 8. 삼각형 */
  R('g4u8', (lv) => {
    const kinds = ['예각삼각형', '직각삼각형', '둔각삼각형'];
    const basic = [
      () => { const a = ri(3, 15), b = ri(2, 2 * a - 1); if (a === b) return null; return P.int(`같은 두 변이 각각 ${a}cm이고 나머지 한 변이 ${b}cm인 이등변삼각형의 세 변의 길이의 합은 몇 cm일까요?`, 2 * a + b, { unit: 'cm' }); },
      () => { const a = ri(3, 25); return P.int(`한 변이 ${a}cm인 정삼각형의 세 변의 길이의 합은 몇 cm일까요?`, 3 * a, { unit: 'cm' }); },
      () => { let a = ri(10, 160); if (a % 2) a++; return P.int(`이등변삼각형에서 길이가 같은 두 변 사이의 각이 ${a}°입니다. 나머지 두 각 중 한 각은 몇 도일까요?`, (180 - a) / 2, { unit: '°' }); },
      () => { const b = ri(20, 85); return P.int(`이등변삼각형의 두 밑각이 각각 ${b}°입니다. 나머지 한 각은 몇 도일까요?`, 180 - 2 * b, { unit: '°' }); },
      () => { const a = ri(20, 120), b = ri(20, 150 - a), c = 180 - a - b; const mx = Math.max(a, b, c); const angs = shuffle([a, b, c]); return P.choice(`세 각이 ${angs.join('°, ')}°인 삼각형은 어떤 삼각형일까요?`, kinds, mx < 90 ? 0 : mx === 90 ? 1 : 2); },
      () => { const a = ri(3, 12), b = ri(3, 12), c = ri(3, 12); if (a + b <= c || a + c <= b || b + c <= a) return null; const k = (a === b && b === c) ? 0 : (a === b || b === c || a === c) ? 1 : 2; if (k === 0 && Math.random() < .5) return null; return P.choice(`세 변이 ${a}cm, ${b}cm, ${c}cm인 삼각형의 이름으로 가장 알맞은 것을 고르세요.`, ['정삼각형', '정삼각형이 아닌 이등변삼각형', '세 변의 길이가 모두 다른 삼각형'], k); }
    ];
    const adv = [
      () => { const a = ri(4, 15), b = ri(2, 2 * a - 1); if (a === b) return null; return P.int(`세 변의 길이의 합이 ${2 * a + b}cm인 이등변삼각형에서 길이가 같은 두 변이 각각 ${a}cm입니다. 나머지 한 변은 몇 cm일까요?`, b, { unit: 'cm', word: true }); },
      () => { const a = ri(4, 15), b = ri(2, 2 * a - 1); if (a === b) return null; return P.int(`세 변의 길이의 합이 ${2 * a + b}cm인 이등변삼각형에서 나머지 한 변이 ${b}cm입니다. 길이가 같은 두 변 중 한 변은 몇 cm일까요?`, a, { unit: 'cm', word: true }); },
      () => { const a = ri(3, 12); return P.int(`세 변의 길이의 합이 ${3 * a}cm인 정삼각형의 한 변은 몇 cm일까요?`, a, { unit: 'cm' }); },
      () => { const a = ri(4, 12), b = ri(Math.ceil(3 * a / 4) + 1, Math.floor((3 * a - 1) / 2)); const c = 3 * a - 2 * b; if (c <= 0 || c >= 2 * b || b === a) return null; return P.int(`한 변이 ${a}cm인 정삼각형과 세 변의 길이의 합이 같은 이등변삼각형이 있습니다. 이등변삼각형의 길이가 같은 두 변이 각각 ${b}cm라면 나머지 한 변은 몇 cm일까요?`, c, { unit: 'cm', word: true }); },
      () => { const a = ri(15, 100), b = ri(15, 160 - a), c = 180 - a - b; if (c < 5) return null; const mx = Math.max(a, b, c); return P.choice(`삼각형의 두 각이 ${a}°, ${b}°입니다. 이 삼각형은 어떤 삼각형일까요?`, kinds, mx < 90 ? 0 : mx === 90 ? 1 : 2, { word: true }); },
      () => { const b = ri(15, 80), c = 180 - 2 * b; return P.choice(`이등변삼각형의 두 밑각이 각각 ${b}°입니다. 이 삼각형은 각의 크기에 따라 어떤 삼각형일까요?`, kinds, c < 90 ? 0 : c === 90 ? 1 : 2, { word: true }); }
    ];
    return (lv === 2 ? pick([...adv, ...adv, ...basic]) : pick(basic))();
  });

  /* 9. 소수의 덧셈과 뺄셈 (정수 k/1000 단위로 계산) */
  R('g4u9', (lv) => {
    const basic = [
      () => { const a = ri(101, 999), b = ri(101, 999); return P.dec(`${decStr(a, 2)} + ${decStr(b, 2)}`, decStr(a + b, 2)); },
      () => { const a = ri(200, 999), b = ri(101, a - 1); return P.dec(`${decStr(a, 2)} − ${decStr(b, 2)}`, decStr(a - b, 2)); },
      () => { const a = ri(11, 99), b = ri(11, 99); return P.dec(`${decStr(a, 1)} + ${decStr(b, 1)}`, decStr(a + b, 1)); },
      () => { const a = ri(1001, 9999), b = ri(1001, 9999); if (a % 10 === 0 || b % 10 === 0) return null; return P.dec(`${decStr(a, 3)} + ${decStr(b, 3)}`, decStr(a + b, 3)); },
      () => { const n = ri(101, 9999); if (n % 10 === 0) return null; return P.dec(`0.01이 ${fmt(n)}개인 수를 소수로 나타내세요.`, decStr(n, 2)); },
      () => { const k = ri(1001, 9999); if (k % 10 === 0) return null; const p = pick([['소수 첫째', 2], ['소수 둘째', 1], ['소수 셋째', 0]]); return P.int(`${decStr(k, 3)}에서 ${p[0]} 자리 숫자는 무엇일까요?`, Math.floor(k / Math.pow(10, p[1])) % 10); },
      () => { const A = ri(1001, 9999), B = A + pick([-1, 1]) * pick([1, 2, 5, 10, 20, 50, 100, 200]); if (B < 1001 || B > 9999 || A % 10 === 0 && B % 10 === 0) return null; return P.choice(`두 소수의 크기를 비교하세요. ${decStr(A, 3)} ○ ${decStr(B, 3)}`, ['&gt;', '&lt;'], A > B ? 0 : 1); }
    ];
    const adv = [
      () => { const a = ri(11, 99), b = ri(101, 999); return P.dec(`${decStr(a, 1)} + ${decStr(b, 2)}`, decStr(a * 10 + b, 2)); },
      () => { const a = ri(21, 99), b = ri(101, a * 10 - 1); if (a * 10 <= b) return null; return P.dec(`${decStr(a, 1)} − ${decStr(b, 2)}`, decStr(a * 10 - b, 2)); },
      () => { const h = ri(120, 160), g = ri(3, 25); return P.dec(`민우의 키는 ${decStr(h, 2)}m이고 형은 민우보다 ${decStr(g, 2)}m 더 큽니다. 형의 키는 몇 m일까요?`, decStr(h + g, 2), { unit: 'm', word: true }); },
      () => { const t = ri(1500, 2500), u = ri(105, 999); return P.dec(`물이 ${decStr(t, 3)} L 있었습니다. 그중에서 ${decStr(u, 3)} L를 마셨다면 남은 물은 몇 L일까요?`, decStr(t - u, 3), { unit: 'L', word: true }); },
      () => { const a = ri(101, 999), b = ri(101, 999), c = ri(11, 99); return P.dec(`가방의 무게는 ${decStr(a, 2)}kg, 책의 무게는 ${decStr(b, 2)}kg, 필통의 무게는 ${decStr(c, 2)}kg입니다. 세 물건의 무게는 모두 몇 kg일까요?`, decStr(a + b + c, 2), { unit: 'kg', word: true }); },
      () => { const x = ri(301, 999), a = ri(101, 299); return P.dec(`어떤 수에서 ${decStr(a, 2)}${eul(decStr(a, 2))} 빼야 할 것을 잘못하여 더했더니 ${decStr(x + a, 2)}${iga(decStr(x + a, 2))} 되었습니다. 바르게 계산한 값을 구하세요.`, decStr(x - a, 2), { word: true }); },
      () => { const k = ri(101, 9999); if (k % 10 === 0) return null; const m = pick([[10, '10배'], [100, '100배']]); return P.dec(`${decStr(k, 3)}의 ${m[1]}인 수를 쓰세요.`, decStr(k * m[0], 3)); },
      () => { const k = ri(11, 999); if (k % 10 === 0) return null; return P.dec(`${decStr(k, 1)}의 ${F(1, 10)}인 수를 쓰세요.`, decStr(k, 2)); }
    ];
    return (lv === 2 ? pick([...adv, ...adv, ...basic]) : pick(basic))();
  });

  /* 10. 사각형 */
  R('g4u10', (lv) => {
    const facts = [
      ['정사각형은 직사각형이라고 할 수 있을까요?', 0], ['정사각형은 마름모라고 할 수 있을까요?', 0], ['직사각형은 평행사변형이라고 할 수 있을까요?', 0],
      ['마름모는 평행사변형이라고 할 수 있을까요?', 0], ['평행사변형은 사다리꼴이라고 할 수 있을까요?', 0], ['사다리꼴은 모두 평행사변형이라고 할 수 있을까요?', 1],
      ['마름모는 모두 정사각형이라고 할 수 있을까요?', 1], ['직사각형은 모두 마름모라고 할 수 있을까요?', 1], ['평행사변형은 모두 직사각형이라고 할 수 있을까요?', 1],
      ['마름모는 마주 보는 두 쌍의 변이 서로 평행할까요?', 0], ['평행사변형은 마주 보는 두 각의 크기가 같을까요?', 0], ['마름모는 네 각의 크기가 항상 같을까요?', 1],
      ['평행선 사이의 거리는 평행선 사이에 그은 수선의 길이일까요?', 0], ['한 직선에 수직인 두 직선은 서로 평행할까요?', 0]
    ];
    const basic = [
      () => { const a = ri(3, 20), b = ri(3, 20); if (a === b) return null; return P.int(`이웃한 두 변이 ${a}cm, ${b}cm인 평행사변형의 네 변의 길이의 합은 몇 cm일까요?`, 2 * (a + b), { unit: 'cm' }); },
      () => { const a = ri(3, 25); return P.int(`한 변이 ${a}cm인 마름모의 네 변의 길이의 합은 몇 cm일까요?`, 4 * a, { unit: 'cm' }); },
      () => { const a = ri(30, 150); if (a === 90) return null; return P.int(`평행사변형에서 한 각이 ${a}°입니다. 이 각과 이웃한 각은 몇 도일까요?`, 180 - a, { unit: '°' }); },
      () => { const a = ri(30, 150); if (a === 90) return null; return P.int(`마름모에서 한 각이 ${a}°입니다. 이 각과 마주 보는 각은 몇 도일까요?`, a, { unit: '°' }); },
      () => { const f = pick(facts); return P.choice(f[0], ['예', '아니요'], f[1]); },
      () => { const a = ri(15, 75); return P.int(`직선 가와 직선 나는 서로 수직입니다. 두 직선이 만나서 생긴 직각을 다른 직선이 ${a}°와 □°로 나누었을 때, □는 몇 도일까요?`, 90 - a, { unit: '°' }); }
    ];
    const adv = [
      () => { const a = ri(4, 20), b = ri(3, 20); if (a === b) return null; return P.int(`네 변의 길이의 합이 ${2 * (a + b)}cm인 평행사변형의 한 변이 ${a}cm입니다. 이 변과 이웃한 변은 몇 cm일까요?`, b, { unit: 'cm', word: true }); },
      () => { const a = ri(3, 20); return P.int(`네 변의 길이의 합이 ${4 * a}cm인 마름모의 한 변은 몇 cm일까요?`, a, { unit: 'cm' }); },
      () => { let d = ri(10, 100); if (d % 2) d++; return P.int(`평행사변형에서 이웃한 두 각 중 한 각이 다른 각보다 ${d}° 더 큽니다. 큰 각은 몇 도일까요?`, (180 + d) / 2, { unit: '°', word: true }); },
      () => { const a = ri(2, 12), b = ri(2, 12); return P.int(`직선 가, 나, 다가 차례로 서로 평행합니다. 가와 나 사이의 거리가 ${a}cm, 나와 다 사이의 거리가 ${b}cm일 때 가와 다 사이의 거리는 몇 cm일까요?`, a + b, { unit: 'cm', word: true }); },
      () => { const a = ri(40, 140); if (a === 90) return null; return P.int(`마름모에서 한 각이 ${a}°일 때, 네 각 중 이 각과 크기가 다른 각 하나는 몇 도일까요?`, 180 - a, { unit: '°', word: true }); },
      () => { const len = ri(20, 80), a = ri(3, 15); if (len % 2) return null; const b = len / 2 - a; if (b <= 0 || b === a) return null; return P.int(`철사 ${len}cm를 남김없이 사용하여 한 변이 ${a}cm인 평행사변형을 만들었습니다. 이 변과 이웃한 변은 몇 cm일까요?`, b, { unit: 'cm', word: true }); },
      () => { const a = ri(40, 140); return P.int(`사다리꼴 ㄱㄴㄷㄹ에서 변 ㄱㄹ과 변 ㄴㄷ이 평행합니다. 각 ㄱㄴㄷ이 ${a}°일 때 각 ㄴㄱㄹ은 몇 도일까요?`, 180 - a, { unit: '°', word: true }); }
    ];
    return (lv === 2 ? pick([...adv, ...adv, ...basic]) : pick(basic))();
  });

  /* 11. 꺾은선그래프 */
  const lineSets = [
    ['교실 온도', '°C', ['9시', '10시', '11시', '12시', '1시'], 10, 1, 30, '교실 온도', '높은'],
    ['식물의 키', 'cm', ['1일', '5일', '9일', '13일', '17일'], 0, 2, 20, '식물의 키', '큰', 1],
    ['월별 강아지 무게', 'kg', ['3월', '4월', '5월', '6월', '7월'], 0, 1, 12, '강아지 무게', '무거운', 1],
    ['요일별 줄넘기 횟수', '회', ['월', '화', '수', '목', '금'], 50, 10, 150, '줄넘기 횟수', '많은'],
    ['연도별 키', 'cm', ['2022년', '2023년', '2024년', '2025년', '2026년'], 120, 2, 150, '민수의 키', '큰', 1]
  ];
  const makeLine = () => {
    const s = pick(lineSets), [title, unit, xs, base, scale, top, qty, adj, mono] = s; const cells = ri(6, 9);
    let vals; let tries = 0; do { vals = xs.map(() => base + ri(1, cells) * scale); if (mono) vals.sort((a, b) => a - b); tries++; } while ((new Set(vals).size < 4 || Math.max(...vals) > top + scale * 4) && tries < 50);
    return { title, unit, xs, vals, scale, base, qty, adj, mono, svg: lineChart(title, unit, xs, vals, scale, base) };
  };
  R('g4u11', (lv) => {
    const basic = [
      () => { const g = makeLine(), i = ri(0, 4); return P.int(`꺾은선그래프를 보고 ${dn(g.xs[i])}의 ${g.qty}${eul(g.qty)} 구하세요.${g.svg}`, g.vals[i], { unit: g.unit }); },
      () => { const g = makeLine(); return P.int(`꺾은선그래프에서 세로 눈금 한 칸은 얼마를 나타낼까요?${g.svg}`, g.scale, { unit: g.unit }); },
      () => { const g = makeLine(); const mx = g.vals.indexOf(Math.max(...g.vals)); if (g.mono || g.vals.filter(v => v === g.vals[mx]).length > 1) return null; return P.choice(`꺾은선그래프에서 ${g.qty}${iga(g.qty)} 가장 ${g.adj} 때는 언제일까요?${g.svg}`, g.xs, mx); },
      () => { const t = pick([['하루 동안 교실 온도의 변화', 1], ['반별 학생 수', 0], ['좋아하는 과일별 학생 수', 0], ['한 달 동안 강낭콩 키의 변화', 1], ['요일별 최고 기온의 변화', 1], ['나라별 금메달 수', 0], ['마을별 자동차 수', 0], ['연도별 몸무게의 변화', 1]]); return P.choice(`${t[0]}${eul(t[0])} 나타내기에 더 알맞은 그래프는 무엇일까요?`, ['막대그래프', '꺾은선그래프'], t[1]); }
    ];
    const adv = [
      () => { const g = makeLine(), i = ri(0, 3); const d = g.vals[i + 1] - g.vals[i]; if (d === 0) return null; return P.int(`꺾은선그래프에서 ${dn(g.xs[i])}부터 ${dn(g.xs[i + 1])}까지 ${g.qty}${eun(g.qty)} 몇 ${g.unit} ${d > 0 ? '늘었을까요' : '줄었을까요'}?${g.svg}`, Math.abs(d), { unit: g.unit, word: true }); },
      () => { const g = makeLine(); const diffs = [0, 1, 2, 3].map(i => Math.abs(g.vals[i + 1] - g.vals[i])); const mx = Math.max(...diffs); if (diffs.filter(x => x === mx).length > 1) return null; const opts = [0, 1, 2, 3].map(i => `${g.xs[i]}~${g.xs[i + 1]}`); return P.choice(`꺾은선그래프에서 ${g.qty}의 변화가 가장 큰 때는 언제일까요?${g.svg}`, opts, diffs.indexOf(mx), { word: true }); },
      () => { const g = makeLine(); return P.int(`꺾은선그래프에서 ${g.qty}의 가장 큰 값과 가장 작은 값의 차는 몇 ${g.unit}일까요?${g.svg}`, Math.max(...g.vals) - Math.min(...g.vals), { unit: g.unit, word: true }); },
      () => { const a = ri(12, 24), b = a + ri(1, 6) * 2; const h = ri(9, 11); return P.int(`교실 온도를 ${h}시에 재었더니 ${a}°C, ${h + 2}시에 재었더니 ${b}°C였습니다. 꺾은선그래프로 나타냈을 때 ${h + 1}시의 온도는 약 몇 °C였다고 어림할 수 있을까요?`, (a + b) / 2, { unit: '°C', word: true }); },
      () => { const g = makeLine(); const ups = [0, 1, 2, 3].filter(i => g.vals[i + 1] > g.vals[i]).length; return P.int(`꺾은선그래프에서 선분이 오른쪽 위로 올라간 구간(앞 시점보다 늘어난 구간)은 모두 몇 군데일까요?${g.svg}`, ups, { unit: '군데', word: true }); }
    ];
    return (lv === 2 ? pick([...adv, ...adv, ...basic]) : pick(basic))();
  });

  /* 12. 다각형 */
  R('g4u12', (lv) => {
    const regAng = [3, 4, 5, 6, 8, 9, 10, 12];
    const basic = [
      () => { const n = ri(4, 12); return P.int(`${polyNm[n]}의 대각선은 모두 몇 개일까요?`, n * (n - 3) / 2, { unit: '개' }); },
      () => { const n = ri(3, 12), a = ri(2, 15); return P.int(`한 변이 ${a}cm인 정${polyNm[n]}의 모든 변의 길이의 합은 몇 cm일까요?`, n * a, { unit: 'cm' }); },
      () => { const n = ri(3, 9), opts = shuffle([n, n + 1, n - 1 >= 3 ? n - 1 : n + 2, n + 3]).filter((x, i, a) => a.indexOf(x) === i); if (opts.length < 4) return null; return P.choice(`변이 ${n}개인 다각형의 이름은 무엇일까요?`, opts.map(x => polyNm[x]), opts.indexOf(n)); },
      () => { const n = ri(4, 12); return P.int(`${polyNm[n]}의 한 꼭짓점에서 그을 수 있는 대각선은 몇 개일까요?`, n - 3, { unit: '개' }); },
      () => { const n = ri(3, 12), t = pick([['꼭짓점', n], ['변', n]]); return P.int(`${polyNm[n]}의 ${t[0]}은 몇 개일까요?`, t[1], { unit: '개' }); }
    ];
    const adv = [
      () => { const n = pick(regAng); return P.int(`정${polyNm[n]}의 한 각의 크기는 몇 도일까요? (정다각형은 모든 각의 크기가 같습니다.)`, 180 * (n - 2) / n, { unit: '°' }); },
      () => { const n = ri(4, 12); return P.int(`대각선이 모두 ${n * (n - 3) / 2}개인 다각형은 변이 몇 개일까요?`, n, { unit: '개', word: true }); },
      () => { const n = ri(3, 12), a = ri(3, 15); return P.int(`철사 ${n * a}cm를 남김없이 사용하여 정${polyNm[n]}을 한 개 만들었습니다. 한 변은 몇 cm일까요?`, a, { unit: 'cm', word: true }); },
      () => { const n = pick(regAng.filter(x => x > 3)); return P.int(`한 각의 크기가 ${180 * (n - 2) / n}°인 정다각형은 변이 몇 개일까요?`, n, { unit: '개', word: true }); },
      () => { const n = ri(4, 9), m = ri(n + 1, 12); return P.int(`${polyNm[m]}의 대각선 수는 ${polyNm[n]}의 대각선 수보다 몇 개 더 많을까요?`, m * (m - 3) / 2 - n * (n - 3) / 2, { unit: '개', word: true }); },
      () => { const n = ri(3, 8), a = ri(2, 12); const m = pick([3, 4, 6].filter(x => x !== n)); const per = n * a; if (per % m) return null; return P.int(`한 변이 ${a}cm인 정${polyNm[n]}과 모든 변의 길이의 합이 같은 정${polyNm[m]}의 한 변은 몇 cm일까요?`, per / m, { unit: 'cm', word: true }); },
      () => { const n = ri(5, 10); return P.int(`정${polyNm[n]}의 모든 각의 크기의 합은 몇 도일까요? (삼각형으로 나누어 생각해 보세요.)`, 180 * (n - 2), { unit: '°' }); }
    ];
    return (lv === 2 ? pick([...adv, ...adv, ...basic]) : pick(basic))();
  });
})();
