/* 맘쌤 — 초등 2학년 수학 (2022 개정) */
(function () {
  const { ri, pick, gcd, lcm, red, shuffle, F, M, fmt, decStr, P, svgWrap, lbl, shapeStyle, dash, table, properCoprime, divisors, roundTo, mixedToImproper } = window.MathGen.h;
  const R = window.MathGen.register;
  window.UNITS = window.UNITS || [];
  window.UNITS.push(
    {
      id: 'g2u1', grade: 2, sem: 1, no: 1, title: '세 자리 수', icon: '💯',
      lessons: ['백 알아보기', '몇백 알아보기', '세 자리 수 알아보기', '각 자리의 숫자가 나타내는 값', '뛰어 세기', '수의 크기 비교하기'],
      concept: '10이 10개이면 100(백)입니다. 세 자리 수는 백·십·일의 자리로 이루어지며, 같은 숫자라도 어느 자리에 있느냐에 따라 나타내는 값이 달라집니다(352에서 5는 50을 나타냄).',
      script: [
        '"10원짜리 동전 10개를 모으면 100원짜리 1개와 같아." 실제 동전을 바꿔 보며 100을 만듭니다.',
        '100원·10원·1원 동전으로 352원을 만들어 보고, 동전 개수와 숫자를 짝지어 백의 자리 3, 십의 자리 5, 일의 자리 2를 확인합니다.',
        '"5는 그냥 5가 아니라 50을 나타내." 자릿값 표(백|십|일)에 숫자를 적고 352 = 300 + 50 + 2로 가르기를 함께 해 봅니다.',
        '100씩, 10씩, 1씩 소리 내어 뛰어 세며 어느 자리 숫자가 바뀌는지 찾게 합니다. 크기 비교는 "백의 자리부터"를 입버릇처럼 말하게 합니다.'
      ],
      mistakes: [
        '0이 있는 수 읽기·쓰기 실수 (삼백오를 3005나 350으로 씀)',
        '숫자와 숫자가 나타내는 값을 구분하지 못함 (352에서 5가 나타내는 값을 5라고 답함)',
        '크기 비교에서 백의 자리부터 보지 않고 일의 자리 숫자가 큰 쪽을 큰 수로 판단',
        '10씩 뛰어 셀 때 390 다음을 3100으로 씀'
      ],
      warmup: '동전 가게 놀이 — "100원짜리 2개, 10원짜리 4개, 1원짜리 7개면 모두 얼마일까?" 실제 동전이나 종이 동전으로 값을 만들어 봅니다.',
      check: '"472에서 7은 얼마를 나타낼까? 왜 그렇게 생각해?"',
      next: '2학년 2학기 네 자리 수로 확장되고, 3학년 덧셈과 뺄셈(세 자리 수의 받아올림·받아내림 계산)의 바탕이 됩니다.',
      keywords: ['세자리수', '백', '몇백', '100', '자릿값', '백의자리', '십의자리', '일의자리', '뛰어세기', '수크기비교']
    },
    {
      id: 'g2u2', grade: 2, sem: 1, no: 2, title: '여러 가지 도형', icon: '🔺',
      lessons: ['원 알아보기', '삼각형 알아보기', '사각형 알아보기', '칠교판으로 모양 만들기', '오각형과 육각형 알아보기', '쌓기나무로 똑같이 쌓기', '여러 가지 모양으로 쌓기'],
      concept: '곧은 선(변) 3개로 둘러싸인 도형이 삼각형, 4개면 사각형, 5개면 오각형, 6개면 육각형입니다. 두 변이 만나는 점이 꼭짓점이며, 원은 곧은 선과 꼭짓점이 없는 동그란 도형입니다.',
      script: [
        '집 안에서 원·삼각형·사각형 모양 물건을 찾는 보물찾기를 합니다. "왜 이건 삼각형이라고 생각했어?"라고 이유를 물어봅니다.',
        '"변은 곧은 선, 꼭짓점은 두 변이 만나는 뾰족한 점이야." 손가락으로 변을 따라가며 변과 꼭짓점을 하나씩 세어 봅니다.',
        '빨대나 면봉으로 도형을 직접 만들어 보고, 끊어진 곳이 있거나 굽은 선이 있으면 삼각형·사각형이 아니라는 것을 확인합니다.',
        '쌓기나무(또는 블록·각설탕)를 쌓고 "1층에 몇 개, 2층에 몇 개?", "빨간 나무의 오른쪽에 몇 개?"처럼 위치를 말로 설명하게 합니다.'
      ],
      mistakes: [
        '끝이 열려 있거나 굽은 선이 있는 모양도 삼각형·사각형으로 고름',
        '꼭짓점을 셀 때 같은 점을 두 번 세거나 빠뜨림',
        '도형을 돌려 놓으면(거꾸로 선 삼각형 등) 다른 도형이라고 생각함',
        '쌓기나무에서 뒤에 가려 보이지 않는 나무를 세지 않음'
      ],
      warmup: '"우리 집 도형 찾기" — 시계(원), 창문(사각형), 옷걸이(삼각형)처럼 생활 속 도형을 3개씩 찾아 말해 봅니다.',
      check: '"삼각형과 사각형은 무엇이 다를까? 변과 꼭짓점으로 설명해 볼래?"',
      next: '3학년 평면도형(선분·직선·각, 직각삼각형·직사각형·정사각형)으로 이어지고, 쌓기나무는 6학년 공간과 입체의 기초가 됩니다.',
      keywords: ['삼각형', '사각형', '원', '오각형', '육각형', '꼭짓점', '변', '칠교판', '쌓기나무', '여러가지도형']
    },
    {
      id: 'g2u3', grade: 2, sem: 1, no: 3, title: '덧셈과 뺄셈', icon: '➕',
      lessons: ['받아올림이 있는 (두 자리 수)+(한 자리 수)', '받아올림이 있는 (두 자리 수)+(두 자리 수)', '받아내림이 있는 (두 자리 수)−(한 자리 수)', '받아내림이 있는 (몇십)−(몇십몇), (두 자리 수)−(두 자리 수)', '덧셈과 뺄셈의 관계', '□가 사용된 식 만들고 □의 값 구하기', '세 수의 계산'],
      concept: '일의 자리끼리 더해 10이 넘으면 10을 십의 자리로 올려 주고(받아올림), 일의 자리끼리 뺄 수 없으면 십의 자리에서 10을 내려 받습니다(받아내림). 덧셈과 뺄셈은 서로 거꾸로 된 관계라 □의 값을 구할 때 활용합니다.',
      script: [
        '수 모형(또는 빨대 10개 묶음과 낱개)으로 27+15를 직접 해 봅니다. 낱개가 12개가 되면 10개를 묶어 십 묶음으로 옮기는 장면을 꼭 보여 줍니다.',
        '"일의 자리부터 계산하고, 올라간 1은 십의 자리 위에 작게 써 두자." 세로셈에서 받아올림 숫자를 쓰는 자리를 정해 습관을 만듭니다.',
        '42−17은 "2에서 7을 뺄 수 없으니 십 묶음 하나를 풀어 낱개 10개로 바꾸자"라고 말하며 풀어 봅니다. 십의 자리 4를 3으로 고쳐 쓰는 것을 확인합니다.',
        '"8+□=15에서 □는 15−8로 구할 수 있어." 덧셈식 하나로 뺄셈식 두 개를 만들어 보며 덧셈과 뺄셈의 관계를 연결합니다.'
      ],
      mistakes: [
        '받아올림한 1을 십의 자리에 더하지 않음 (27+15=32)',
        '뺄셈에서 일의 자리 큰 수에서 작은 수를 거꾸로 뺌 (75−48에서 8−5=3으로 계산해 33)',
        '받아내림 후 십의 자리 숫자를 1 줄이지 않음 (52−18=44)',
        '세 수의 계산에서 뒤의 두 수를 먼저 계산함'
      ],
      warmup: '장보기 셈 — "귤이 38개 있었는데 15개를 더 샀어. 몇 개가 됐을까?" / "그중 19개를 먹었다면 몇 개 남았을까?"',
      check: '"35+28을 할 때 왜 십의 자리에 1을 더 써야 하는지 설명해 볼래?"',
      next: '3학년 1학기 덧셈과 뺄셈(세 자리 수의 받아올림·받아내림)으로 바로 이어지는 핵심 계산력입니다.',
      keywords: ['받아올림', '받아내림', '두자리수덧셈', '두자리수뺄셈', '세로셈', '덧셈과뺄셈의관계', '네모구하기', '세수의계산', '덧셈', '뺄셈']
    },
    {
      id: 'g2u4', grade: 2, sem: 1, no: 4, title: '길이 재기', icon: '📏',
      lessons: ['길이를 비교하는 방법 알아보기', '여러 가지 단위로 길이 재기', '1cm 알아보기', '자로 길이를 재는 방법 알아보기', '자로 길이 재기', '길이 어림하기'],
      concept: '뼘·클립처럼 사람마다 다른 단위로 재면 결과가 달라지므로 약속한 단위 1cm를 씁니다. 자로 잴 때는 한끝을 눈금 0에 맞추고 다른 끝의 눈금을 읽으며, 0이 아닌 눈금에서 시작하면 1cm가 몇 번 들어가는지 셉니다. 길이를 짐작한 값은 "약 ○cm"라고 말합니다.',
      script: [
        '엄마 뼘과 아이 뼘으로 식탁 길이를 각각 재 봅니다. "같은 식탁인데 왜 숫자가 다르지?"라고 물어 약속한 단위가 필요한 이유를 스스로 말하게 합니다.',
        '"1cm는 이만큼이야." 손톱 너비처럼 1cm에 가까운 것을 찾아 감각을 잡아 줍니다.',
        '자로 재는 3단계를 함께 외칩니다. ① 물건 한끝을 눈금 0에 맞추기 ② 자를 곧게 대기 ③ 다른 끝 눈금 읽기.',
        '재기 전에 "몇 cm쯤 될까?" 어림부터 말하게 하고, 잰 값과 비교해 누구 어림이 더 가까웠는지 게임처럼 겨룹니다.'
      ],
      mistakes: [
        '자의 끝(눈금 0이 아닌 곳)에 물건을 맞추고 읽음',
        '0이 아닌 눈금에서 시작했을 때 끝 눈금을 그대로 길이로 답함 (3에서 9까지를 9cm)',
        '단위가 다른데 잰 횟수가 많은 쪽이 더 길다고 판단',
        '어림한 값에 "약"을 붙이지 않거나 잰 값과 혼동'
      ],
      warmup: '"엄마 뼘으로 책상은 몇 뼘? 네 뼘으로는?" 같은 물건을 서로 다른 뼘으로 재고 결과가 왜 다른지 이야기합니다.',
      check: '"자의 눈금 2에서 시작해서 8에서 끝나면 길이는 몇 cm일까? 어떻게 알았어?"',
      next: '2학년 2학기 길이 재기(m와 cm)로 이어지고, 3학년 길이와 시간(mm, km)으로 단위가 넓어집니다.',
      keywords: ['cm', '센티미터', '1cm', '자로재기', '자눈금', '어림', '어림하기', '뼘', '길이비교', '길이재기']
    },
    {
      id: 'g2u5', grade: 2, sem: 1, no: 5, title: '분류하기', icon: '🗂️',
      lessons: ['분류는 어떻게 할까요', '정해진 기준에 따라 분류하기', '자신이 정한 기준에 따라 분류하기', '분류하고 세어 보기', '분류한 결과 말하기'],
      concept: '분류는 누가 하더라도 결과가 같은 분명한 기준(색깔·모양·다리 수·쓰임 등)으로 나누는 것입니다. "예쁜 것", "좋아하는 것"처럼 사람마다 다른 기준은 쓸 수 없습니다. 분류한 뒤 세어 보면 가장 많은 것과 가장 적은 것을 쉽게 알 수 있습니다.',
      script: [
        '빨래 개기, 장난감 정리처럼 집안일로 분류를 시작합니다. "양말끼리, 티셔츠끼리 나눠 볼까?"',
        '"예쁜 것과 안 예쁜 것으로 나누면 엄마랑 네 결과가 똑같을까?" 사람마다 달라지는 기준은 쓸 수 없다는 것을 직접 비교해 깨닫게 합니다.',
        '같은 물건을 색깔로 한 번, 모양으로 한 번 나누어 보며 기준이 바뀌면 결과도 바뀐다는 것을 보여 줍니다.',
        '셀 때는 하나 셀 때마다 ✓ 표시를 해 빠뜨리거나 두 번 세지 않게 하고, 센 결과를 보고 "가장 많은 것은?"을 말해 봅니다.'
      ],
      mistakes: [
        '"예쁜 것", "큰 것"처럼 사람마다 다른 기준으로 분류함',
        '셀 때 표시를 하지 않아 빠뜨리거나 두 번 셈',
        '한 물건을 두 무리에 동시에 넣음',
        '"가장 많은 것"을 묻는데 개수를 답하거나 가장 적은 것과 바꿔 답함'
      ],
      warmup: '"장난감 정리 게임" — 바구니 2~3개를 놓고 아이가 직접 기준을 정해 장난감을 나눈 뒤, 어떤 기준으로 나눴는지 엄마가 맞혀 봅니다.',
      check: '"이 단추들을 어떤 기준으로 나눌 수 있을까? 그 기준이면 누가 나눠도 똑같이 나눠질까?"',
      next: '2학년 2학기 표와 그래프로 바로 이어지고, 3학년 자료의 정리(그림그래프)의 바탕이 됩니다.',
      keywords: ['분류', '분류하기', '분류기준', '기준정하기', '나누어세기', '세어보기', '정리정돈']
    },
    {
      id: 'g2u6', grade: 2, sem: 1, no: 6, title: '곱셈', icon: '✖️',
      lessons: ['여러 가지 방법으로 세어 보기', '묶어 세기', '몇의 몇 배 알아보기', '몇의 몇 배로 나타내기', '곱셈 알아보기', '곱셈식으로 나타내기'],
      concept: '같은 수를 여러 번 더하는 것을 곱셈으로 나타냅니다. 3씩 4묶음은 3의 4배이고, 덧셈식 3+3+3+3을 곱셈식 3×4=12로 씁니다. "3 곱하기 4는 12와 같습니다"라고 읽습니다.',
      script: [
        '과자를 접시마다 3개씩 놓고 "하나씩 세지 말고 더 빨리 세는 방법이 있을까?"라고 물어 2씩·3씩 묶어 세기를 끌어냅니다.',
        '"3씩 4묶음은 3의 4배라고 말해." 블록 3개 줄과 12개 줄을 나란히 놓고 몇 배인지 눈으로 비교합니다.',
        '덧셈식 3+3+3+3을 쓰고 "3을 4번 더했으니 3×4라고 짧게 쓸 수 있어."라고 연결합니다.',
        '생활 속 곱셈 찾기 — 의자 다리, 세발자전거 바퀴, 손가락처럼 같은 수씩 있는 것을 곱셈식으로 말해 봅니다.'
      ],
      mistakes: [
        '묶음 수와 한 묶음의 수를 바꿔 씀 (3씩 4묶음을 4씩 3묶음으로 표현)',
        '"몇 배"의 뜻을 몰라 두 수를 더함 (3의 4배를 7로 답함)',
        '덧셈식을 곱셈식으로 바꿀 때 더한 횟수를 잘못 셈',
        '뛰어 세기를 할 때 처음 수를 빠뜨림'
      ],
      warmup: '"우리 가족 양말은 모두 몇 짝?" — 2짝씩 몇 켤레인지 묶어 세어 봅니다.',
      check: '"5의 3배는 무슨 뜻일까? 덧셈식과 곱셈식으로 나타내 볼래?"',
      next: '2학년 2학기 곱셈구구로 바로 이어지고, 3학년 곱셈과 나눗셈의 출발점입니다.',
      keywords: ['곱셈', '묶어세기', '몇배', '몇의몇배', '곱셈식', '곱하기', '덧셈식을곱셈식으로', '배']
    },
    {
      id: 'g2u7', grade: 2, sem: 2, no: 1, title: '네 자리 수', icon: '🔢',
      lessons: ['천 알아보기', '몇천 알아보기', '네 자리 수 알아보기', '각 자리의 숫자가 나타내는 값', '뛰어 세기', '수의 크기 비교하기'],
      concept: '100이 10개이면 1000(천)입니다. 네 자리 수는 천·백·십·일의 자리로 이루어지며, 3725는 3000+700+20+5처럼 각 자리의 값으로 나눌 수 있습니다. 크기 비교는 천의 자리부터 차례로 합니다.',
      script: [
        '"100원짜리 10개를 모으면 1000원짜리 지폐 1장이야." 실제 돈으로 바꿔 보며 1000을 이해합니다.',
        '1000원 지폐와 100원·10원·1원 동전으로 물건값 놀이를 하며 2350원 같은 수를 직접 만들고 읽습니다.',
        '자릿값 표(천|백|십|일)에 수를 적고 "3은 3000, 7은 700을 나타내."처럼 숫자와 값을 구분해 말하게 합니다.',
        '1000씩, 100씩, 10씩, 1씩 뛰어 세며 바뀌는 자리를 찾고, 9에서 넘어갈 때 바로 윗자리가 1 커지는 것을 확인합니다.'
      ],
      mistakes: [
        '0이 있는 수를 읽고 쓰기 (사천오십을 4500이나 40050으로 씀)',
        '숫자와 숫자가 나타내는 값을 혼동 (3725에서 7이 나타내는 값을 7이라고 답함)',
        '100씩 뛰어 셀 때 2900 다음을 21000이나 2000으로 씀',
        '크기 비교를 천의 자리부터 하지 않고 뒷자리 숫자만 보고 판단'
      ],
      warmup: '"용돈 세기" — 1000원 2장, 100원 3개, 10원 5개가 모두 얼마인지 세어 보고 수로 써 봅니다.',
      check: '"5372와 5327 중 어느 수가 더 클까? 어느 자리부터 비교했어?"',
      next: '3학년 세 자리 수의 덧셈·뺄셈을 거쳐 4학년 큰 수(만·억·조)로 이어집니다.',
      keywords: ['네자리수', '천', '몇천', '1000', '천의자리', '수읽기', '큰수', '천씩뛰어세기']
    },
    {
      id: 'g2u8', grade: 2, sem: 2, no: 2, title: '곱셈구구', icon: '🧮',
      lessons: ['2단, 5단 곱셈구구', '3단, 6단 곱셈구구', '4단, 8단 곱셈구구', '7단, 9단 곱셈구구', '1단 곱셈구구와 0의 곱', '곱셈표 만들기', '곱셈구구를 이용하여 문제 해결하기'],
      concept: '■단 곱셈구구는 곱하는 수가 1 커질 때마다 곱이 ■씩 커집니다. 두 수의 순서를 바꾸어 곱해도 곱은 같고(3×7=7×3), 1×■=■, 0×■=0, ■×0=0입니다.',
      script: [
        '외우기 전에 "2단은 2씩 커져"를 먼저 확인합니다. 2×5=10이면 2×6은 10에 2를 더한 12라는 것을 말로 설명하게 합니다.',
        '5단은 시계의 분 눈금, 2단은 양말 짝처럼 생활 속 물건과 연결하고, 노래나 박수 리듬으로 소리 내어 외웁니다.',
        '"4단은 2단의 두 배, 8단은 4단의 두 배야." 단끼리의 관계를 보여 주면 7단·9단처럼 어려운 단도 부담이 줄어듭니다.',
        '곱셈표를 함께 채운 뒤 대각선을 따라 접으면 같은 수가 만나는 것을 보여 줍니다. 순서대로 외운 뒤에는 꼭 섞어서 묻습니다.'
      ],
      mistakes: [
        '순서대로만 외워서 중간 것(7×6 등)을 물으면 처음부터 다시 외움',
        '0의 곱을 그 수 그대로 답함 (5×0=5)',
        '1단을 1로 답함 (1×7=1)',
        '7단·8단에서 비슷한 수를 혼동 (7×8=54, 6×8=46)'
      ],
      warmup: '"구구단 탁구" — 엄마가 "6×7!" 하면 아이가 답하고, 이번엔 아이가 엄마에게 문제를 냅니다. 순서를 섞어 하루 5분씩.',
      check: '"6×7이 생각 안 날 때, 6×6=36을 이용해서 답을 찾는 방법을 설명해 볼래?"',
      next: '3학년 나눗셈(곱셈구구로 몫 구하기)과 곱셈(두·세 자리 수의 곱셈)의 필수 기초입니다. 곱셈구구가 흔들리면 3학년 나눗셈에서 바로 막힙니다.',
      keywords: ['구구단', '곱셈구구', '곱셈표', '2단', '3단', '4단', '5단', '6단', '7단', '8단', '9단', '1단', '0의곱']
    },
    {
      id: 'g2u9', grade: 2, sem: 2, no: 3, title: '길이 재기', icon: '📐',
      lessons: ['cm보다 더 큰 단위 알아보기', '자로 길이 재기', '길이의 합 구하기', '길이의 차 구하기', '길이 어림하기'],
      concept: '100cm는 1m입니다. 1m 30cm는 130cm와 같고, 길이의 합과 차는 m는 m끼리, cm는 cm끼리 계산합니다. 양팔을 벌린 길이나 걸음처럼 몸의 부분으로 1m를 어림할 수 있습니다.',
      script: [
        '줄자로 1m를 직접 펼쳐 보고 아이 키, 식탁 길이와 비교합니다. "1m는 이 정도구나"를 몸으로 느끼게 합니다.',
        '"130cm는 100cm와 30cm로 나눌 수 있지? 100cm가 1m니까 1m 30cm야." 가르기로 단위를 바꿉니다.',
        '길이의 합·차는 세로셈에서 m 칸과 cm 칸을 나눠 쓰고, 같은 단위끼리 계산한다는 규칙을 지킵니다.',
        '양팔을 벌린 길이, 두 걸음 등 "나만의 1m"를 찾아 거실이나 복도 길이를 어림한 뒤 줄자로 확인합니다.'
      ],
      mistakes: [
        '1m 5cm를 15cm나 150cm로 씀 (정답 105cm)',
        '단위를 확인하지 않고 m와 cm의 수를 그대로 더함 (2m+30cm=32)',
        'cm를 m로 바꿀 때 100이 아니라 10을 기준으로 나눔',
        '길이의 차에서 cm끼리 뺄 수 없을 때 1m를 100cm로 바꾸지 않음'
      ],
      warmup: '"우리 집 1m 찾기" — 줄자를 1m로 펼쳐 두고 1m보다 긴 것, 짧은 것을 찾아 나눠 봅니다.',
      check: '"1m 5cm는 몇 cm일까? 왜 15cm가 아닐까?"',
      next: '3학년 길이와 시간(1cm=10mm, 1km=1000m)으로 이어지며, 단위 바꾸기 감각이 그대로 쓰입니다.',
      keywords: ['m', '미터', '1m', '100cm', 'm와cm', '길이의합', '길이의차', '줄자', '키재기', '단위바꾸기']
    },
    {
      id: 'g2u10', grade: 2, sem: 2, no: 4, title: '시각과 시간', icon: '🕐',
      lessons: ['몇 시 몇 분 알아보기(5분 단위)', '몇 시 몇 분 알아보기(1분 단위)', '여러 가지 방법으로 시각 읽기(몇 시 몇 분 전)', '1시간 알아보기', '걸린 시간 알아보기', '하루의 시간 알아보기(오전·오후)', '달력 알아보기'],
      concept: '긴바늘이 숫자 1을 가리키면 5분, 2를 가리키면 10분이고 작은 눈금 한 칸은 1분입니다. 짧은바늘은 시를 나타내며 시간이 지나면 다음 숫자 쪽으로 조금씩 움직입니다. 1시간=60분, 하루=24시간(오전 12시간+오후 12시간), 1주일=7일입니다.',
      script: [
        '바늘을 돌릴 수 있는 시계를 준비합니다. 긴바늘을 한 바퀴 돌리면 짧은바늘이 숫자 한 칸 움직이는 것을 직접 보게 합니다.',
        '"긴바늘이 가리키는 숫자부터 5, 10, 15… 로 세면 분이 나와." 5단 곱셈구구와 연결해 세어 봅니다.',
        '"짧은바늘이 3과 4 사이에 있으면 아직 4시가 안 됐으니 3시야." 짧은바늘이 숫자 사이에 있을 때 지나온 숫자를 읽는 연습을 반복합니다.',
        '하루 일과표를 만들어 오전·오후를 붙여 말하고, 달력에서 가족 생일이나 방학까지 남은 날을 세어 봅니다.'
      ],
      mistakes: [
        '긴바늘이 가리키는 숫자를 그대로 분으로 읽음 (4를 가리키면 4분)',
        '짧은바늘이 다음 숫자에 가까우면 다음 시로 읽음 (3시 50분을 4시 50분으로)',
        '1시간을 100분으로 생각해 1시간 20분을 120분으로 계산',
        '오전·오후, 낮 12시와 밤 12시를 혼동'
      ],
      warmup: '"지금 몇 시 몇 분?" — 하루 세 번(아침 식사, 하교, 잠자기 전) 아이에게 시계를 읽게 하고, 그 사이 걸린 시간을 이야기합니다.',
      check: '"긴바늘이 7을 가리키면 몇 분일까? 왜 7분이 아닐까?"',
      next: '3학년 길이와 시간(초 단위, 시간의 덧셈과 뺄셈)으로 이어집니다.',
      keywords: ['시계', '시계보기', '시각', '시간', '몇시몇분', '긴바늘', '짧은바늘', '1시간', '60분', '오전', '오후', '달력', '걸린시간', '몇분전']
    },
    {
      id: 'g2u11', grade: 2, sem: 2, no: 5, title: '표와 그래프', icon: '📊',
      lessons: ['자료를 분류하여 표로 나타내기', '자료를 조사하여 표로 나타내기', '자료를 분류하여 그래프로 나타내기', '표와 그래프를 보고 알 수 있는 내용', '표와 그래프로 나타내기'],
      concept: '조사한 자료를 종류별로 세어 표로 나타내면 전체 수(합계)와 각각의 수를 쉽게 알 수 있고, ○·×·/ 등으로 그래프를 그리면 가장 많은 것과 가장 적은 것을 한눈에 비교할 수 있습니다.',
      script: [
        '가족이 좋아하는 과일을 조사해 같은 과일끼리 모아 셉니다. 센 것은 / 표시로 지우며 빠뜨리지 않게 합니다.',
        '"표에는 수를, 그래프에는 ○를 그려." 같은 자료를 표와 그래프 두 가지로 나타내고 무엇이 더 편한지 이야기합니다.',
        '그래프는 아래(또는 왼쪽)부터 한 칸에 하나씩 빈칸 없이 채운다는 규칙을 함께 정합니다.',
        '"표에서 알기 쉬운 것과 그래프에서 알기 쉬운 것은 뭘까?" — 표는 합계, 그래프는 많고 적음 비교가 편하다는 것을 아이 말로 정리합니다.'
      ],
      mistakes: [
        '그래프의 ○를 아래부터 차례로 채우지 않고 띄어 그림',
        '합계를 구할 때 한 항목을 빠뜨림',
        '표에서 합계를 이용해 모르는 수를 구할 때 더하기와 빼기를 혼동',
        '그래프에서 가장 높은 것을 가장 적은 것으로 거꾸로 읽음'
      ],
      warmup: '"우리 가족 간식 투표" — 가족이 좋아하는 간식을 조사해 종이에 ○ 그래프를 그려 냉장고에 붙여 봅니다.',
      check: '"이 그래프를 보고 가장 많은 사람이 좋아하는 것은 뭐야? 표보다 그래프가 더 편한 점은 뭘까?"',
      next: '3학년 자료의 정리(그림그래프), 4학년 막대그래프와 꺾은선그래프로 이어집니다.',
      keywords: ['표', '그래프', '표와그래프', '자료조사', '합계', '동그라미그래프', '가장많은', '가장적은', '자료정리']
    },
    {
      id: 'g2u12', grade: 2, sem: 2, no: 6, title: '규칙 찾기', icon: '🔁',
      lessons: ['무늬에서 색깔과 모양의 규칙 찾기', '규칙을 찾아 여러 가지 방법으로 나타내기', '쌓은 모양에서 규칙 찾기', '덧셈표에서 규칙 찾기', '곱셈표에서 규칙 찾기', '생활에서 규칙 찾기'],
      concept: '반복되는 모양·색깔, 일정하게 커지는 수에서 규칙을 찾고 그 규칙으로 다음에 올 것을 알아냅니다. 덧셈표·곱셈표·달력에도 규칙이 숨어 있습니다(달력에서 바로 아래 칸은 7 큰 수).',
      script: [
        '"빨강, 노랑, 빨강, 노랑… 다음은?" 구슬이나 블록으로 반복 무늬를 만들어 맞히기 놀이를 하고, 아이에게도 규칙을 만들게 합니다.',
        '"몇 개씩 반복될까?" 반복되는 마디를 동그라미로 묶어 보게 하면 멀리 떨어진 순서도 찾을 수 있습니다.',
        '곱셈표에서 5단은 5씩 커진다는 것, 덧셈표에서 오른쪽으로 갈수록 1씩 커진다는 것을 손가락으로 따라가며 찾습니다.',
        '달력을 펴고 "바로 아래 칸은 몇 큰 수일까?"를 함께 찾습니다. 엘리베이터 버튼, 신호등 순서 등 생활 속 규칙도 찾아봅니다.'
      ],
      mistakes: [
        '반복되는 마디를 잘못 묶어 엉뚱한 다음 모양을 고름',
        '수 배열에서 앞의 두 수만 보고 규칙을 성급하게 정함',
        '쌓은 모양에서 늘어나는 개수를 세지 않고 전체를 다시 세다가 틀림',
        '달력에서 바로 아래 칸이 1 큰 수라고 생각함'
      ],
      warmup: '"규칙 박수" — 엄마가 "짝, 짝, 쿵, 짝, 짝, 쿵"을 하면 아이가 이어서 하고, 다음엔 아이가 규칙을 만들어 문제를 냅니다.',
      check: '"달력에서 어떤 날짜의 바로 아래 날짜는 왜 7 클까?"',
      next: '3~4학년 규칙 찾기(수의 배열·계산식의 규칙)와 5학년 규칙과 대응으로 이어집니다.',
      keywords: ['규칙', '규칙찾기', '반복무늬', '무늬', '덧셈표', '곱셈표규칙', '달력규칙', '수배열', '다음에올모양']
    }
  );

  /* ---------- 공통 도구 ---------- */
  const hasB = (n) => { const d = Math.abs(n) % 10; return d === 0 || [1, 3, 6, 7, 8].includes(d); };
  const eul = (n) => (hasB(n) ? '을' : '를');
  const eun = (n) => (hasB(n) ? '은' : '는');
  const iga = (n) => (hasB(n) ? '이' : '가');
  const gwa = (n) => (hasB(n) ? '과' : '와');
  const kJo = (w, a, b) => { const c = String(w).charCodeAt(String(w).length - 1); const has = c >= 0xAC00 && c <= 0xD7A3 ? (c - 0xAC00) % 28 !== 0 : hasB(Number(String(w).slice(-1)) || 0); return w + (has ? a : b); };
  const NAMES = [['민준', 1], ['서연', 1], ['지호', 0], ['하은', 1], ['도윤', 1], ['지우', 0], ['예준', 1], ['수아', 0], ['시우', 0], ['유진', 1]];
  const two = () => { const a = pick(NAMES); let b = pick(NAMES); while (b === a) b = pick(NAMES); return [a, b]; };
  const nmEun = (n) => n[0] + (n[1] ? '은' : '는');
  const placeName = { 1000: '천', 100: '백', 10: '십', 1: '일' };
  const distinctDigits = (k, allowZeroFirst = false) => { let d; do { d = shuffle([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]).slice(0, k); } while (!allowZeroFirst && d[0] === 0); return d; };
  const cmpQ = (a, b) => `두 수의 크기를 비교하여 ○ 안에 &gt;, &lt; 중 알맞은 것을 고르세요.<br>${a} ○ ${b}`;
  const choiceFrom = (q, correct, wrongs) => { const opts = shuffle([correct, ...wrongs]); if (new Set(opts).size !== opts.length) return null; return P.choice(q, opts, opts.indexOf(correct)); };

  /* 도형 SVG: n각형 */
  const polySVG = (n) => {
    const cx = 110, cy = 62, r = ri(42, 52), rot = Math.random() * Math.PI * 2;
    const pts = [];
    for (let i = 0; i < n; i++) { const a = rot + i * 2 * Math.PI / n, rr = r * (0.85 + Math.random() * 0.15); pts.push(`${(cx + rr * Math.cos(a)).toFixed(1)},${(cy + rr * Math.sin(a)).toFixed(1)}`); }
    return svgWrap(`<polygon points="${pts.join(' ')}" ${shapeStyle}/>`, 220, 124);
  };

  /* 자 SVG: 막대가 눈금 s부터 e까지 */
  const rulerSVG = (s, e) => {
    const u = 24, x0 = 20;
    let t = `<rect x="${x0 - 10}" y="56" width="${10 * u + 20}" height="40" rx="3" fill="none" stroke="currentColor" stroke-width="1.2"/>`;
    for (let i = 0; i <= 20; i++) { const x = x0 + i * u / 2, big = i % 2 === 0; t += `<line x1="${x}" y1="56" x2="${x}" y2="${big ? 70 : 64}" stroke="currentColor" stroke-width="1"/>`; if (big) t += lbl(x, 86, i / 2); }
    t += `<rect x="${x0 + s * u}" y="30" width="${(e - s) * u}" height="18" ${shapeStyle}/>`;
    t += `<line x1="${x0 + s * u}" y1="48" x2="${x0 + s * u}" y2="56" ${dash}/><line x1="${x0 + e * u}" y1="48" x2="${x0 + e * u}" y2="56" ${dash}/>`;
    return svgWrap(t, 10 * u + 40, 104);
  };

  /* 시계 SVG: h시 m분 */
  const clockSVG = (h, m) => {
    const cx = 80, cy = 80;
    let t = `<circle cx="${cx}" cy="${cy}" r="72" fill="rgba(20,82,240,.05)" stroke="currentColor" stroke-width="2"/>`;
    for (let i = 0; i < 60; i++) { const a = i * Math.PI / 30, r1 = i % 5 === 0 ? 63 : 67; t += `<line x1="${(cx + r1 * Math.sin(a)).toFixed(1)}" y1="${(cy - r1 * Math.cos(a)).toFixed(1)}" x2="${(cx + 71 * Math.sin(a)).toFixed(1)}" y2="${(cy - 71 * Math.cos(a)).toFixed(1)}" stroke="currentColor" stroke-width="${i % 5 === 0 ? 1.6 : 0.8}"/>`; }
    for (let i = 1; i <= 12; i++) { const a = i * Math.PI / 6; t += lbl((cx + 52 * Math.sin(a)).toFixed(1), (cy - 52 * Math.cos(a) + 4.5).toFixed(1), i); }
    const ha = ((h % 12) + m / 60) * Math.PI / 6, ma = m * Math.PI / 30;
    t += `<line x1="${cx}" y1="${cy}" x2="${(cx + 34 * Math.sin(ha)).toFixed(1)}" y2="${(cy - 34 * Math.cos(ha)).toFixed(1)}" stroke="currentColor" stroke-width="5" stroke-linecap="round"/>`;
    t += `<line x1="${cx}" y1="${cy}" x2="${(cx + 58 * Math.sin(ma)).toFixed(1)}" y2="${(cy - 58 * Math.cos(ma)).toFixed(1)}" stroke="#1452f0" stroke-width="2.5" stroke-linecap="round"/>`;
    t += `<circle cx="${cx}" cy="${cy}" r="3.5" fill="currentColor"/>`;
    return svgWrap(t, 160, 160);
  };
  const tStr = (h, m) => `${h}시 ${m}분`;
  const nextH = (h) => (h % 12) + 1;
  const prevH = (h) => (h === 1 ? 12 : h - 1);

  /* ○ 그래프 SVG */
  const circleGraphSVG = (names, counts) => {
    const mx = Math.max(...counts, 5), cw = 52, rh = 22, x0 = 34, top = 10, base = top + mx * rh;
    let t = '';
    for (let j = 0; j <= mx; j++) t += `<line x1="${x0}" y1="${base - j * rh}" x2="${x0 + names.length * cw}" y2="${base - j * rh}" stroke="currentColor" stroke-width="0.5" opacity=".35"/>`;
    for (let j = 1; j <= mx; j++) t += lbl(x0 - 10, base - (j - 0.5) * rh + 4, j);
    names.forEach((nm, i) => {
      const cx = x0 + i * cw + cw / 2;
      for (let j = 0; j < counts[i]; j++) t += `<circle cx="${cx}" cy="${base - (j + 0.5) * rh}" r="8" fill="none" stroke="currentColor" stroke-width="1.6"/>`;
      t += lbl(cx, base + 18, nm);
      t += `<line x1="${x0 + i * cw}" y1="${top}" x2="${x0 + i * cw}" y2="${base}" stroke="currentColor" stroke-width="0.5" opacity=".35"/>`;
    });
    t += `<line x1="${x0 + names.length * cw}" y1="${top}" x2="${x0 + names.length * cw}" y2="${base}" stroke="currentColor" stroke-width="0.5" opacity=".35"/>`;
    return svgWrap(t, x0 + names.length * cw + 10, base + 28);
  };

  /* 조사 주제 */
  const TOPICS = [
    { what: '좋아하는 과일', who: '학생', items: ['사과', '배', '포도', '딸기', '귤', '수박'] },
    { what: '좋아하는 색깔', who: '학생', items: ['빨강', '노랑', '파랑', '초록', '보라'] },
    { what: '좋아하는 동물', who: '학생', items: ['강아지', '고양이', '토끼', '햄스터', '거북'] },
    { what: '좋아하는 계절', who: '학생', items: ['봄', '여름', '가을', '겨울'] },
    { what: '타고 싶은 탈것', who: '학생', items: ['기차', '비행기', '배', '버스', '자전거'] },
    { what: '좋아하는 간식', who: '학생', items: ['과자', '떡', '빵', '젤리', '아이스크림'] },
    { what: '좋아하는 운동', who: '학생', items: ['축구', '줄넘기', '수영', '야구', '피구'] }
  ];
  /* 서로 다른 개수 k개의 종류와 개수 (최댓값·최솟값이 하나씩) */
  const survey = (k, lo = 1, hi = 7) => {
    const tp = pick(TOPICS), names = shuffle(tp.items).slice(0, k);
    let counts;
    do { counts = names.map(() => ri(lo, hi)); } while (counts.filter(c => c === Math.max(...counts)).length > 1 || counts.filter(c => c === Math.min(...counts)).length > 1);
    return { tp, names, counts };
  };
  const rawList = (names, counts) => shuffle(names.flatMap((n, i) => Array(counts[i]).fill(n)));

  /* ===== 2-1-1 세 자리 수 ===== */
  R('g2u1', (lv) => {
    const basic = [
      () => { const a = ri(1, 9), b = ri(0, 9), c = ri(0, 9); return P.int(`100이 ${a}개, 10이 ${b}개, 1이 ${c}개인 수는 얼마일까요?`, a * 100 + b * 10 + c); },
      () => { const d = distinctDigits(3); const n = d[0] * 100 + d[1] * 10 + d[2]; const k = pick([0, 1, 2].filter(i => d[i] !== 0)); const pv = [100, 10, 1][k]; return P.int(`${n}에서 숫자 ${d[k]}${iga(d[k])} 나타내는 값은 얼마일까요?`, d[k] * pv); },
      () => { const n = ri(100, 999), k = pick([100, 10, 1]); return P.int(`${n}에서 ${placeName[k]}의 자리 숫자는 무엇일까요?`, Math.floor(n / k) % 10); },
      () => { const step = pick([1, 10, 100]), k = ri(2, 5), n = ri(100, 999 - step * k); return P.int(`${n}에서 ${step}씩 ${k}번 뛰어 센 수는 얼마일까요?`, n + step * k); },
      () => { const a = ri(100, 999); let b = pick([a + ri(1, 9), a - ri(1, 9), a + 10 * ri(1, 5), a - 10 * ri(1, 5), Math.floor(a / 100) * 100 + ri(0, 99)]); if (b === a || b < 100 || b > 999) return null; return P.choice(cmpQ(a, b), ['&gt;', '&lt;'], a > b ? 0 : 1); },
      () => { const a = ri(2, 9); return pick([P.int(`${a * 100}은 100이 몇 개인 수일까요?`, a, { unit: '개' }), P.int(`100이 ${a}개이면 얼마일까요?`, a * 100)]); },
      () => { const n = pick([90, 99, 98, 95, 80, 70, 50]); return P.int(`100은 ${n}보다 얼마만큼 더 큰 수일까요?`, 100 - n); }
    ];
    const adv = [
      () => { const d = distinctDigits(3, true); if (d.every(x => x === 0)) return null; const big = d.slice().sort((x, y) => y - x); const sm = d.slice().sort((x, y) => x - y); if (sm[0] === 0) { const i = sm.findIndex(x => x > 0); [sm[0], sm[i]] = [sm[i], sm[0]]; } const want = pick(['큰', '작은']); const v = Number((want === '큰' ? big : sm).join('')); return P.int(`숫자 카드 ${d.join(', ')}${eul(d[d.length - 1])} 한 번씩만 사용하여 만들 수 있는 가장 ${want} 세 자리 수는 얼마일까요?`, v, { word: true }); },
      () => { const a = ri(1, 6), b = ri(10, 25), c = ri(0, 9); return P.int(`100원짜리 동전 ${a}개, 10원짜리 동전 ${b}개, 1원짜리 동전 ${c}개는 모두 얼마일까요?`, a * 100 + b * 10 + c, { unit: '원', word: true }); },
      () => { const step = pick([10, 100]), k = ri(2, 5), n = ri(100 + step * k, 999); return P.int(`어떤 수에서 ${step}씩 ${k}번 뛰어 세었더니 ${n}${iga(n)} 되었습니다. 어떤 수는 얼마일까요?`, n - step * k, { word: true }); },
      () => { const a = ri(1, 9), t = ri(0, 8), u = ri(0, 9), b = ri(0, 9); if (b === u) return null; const n = a * 100 + t * 10 + u; const cnt = (9 - t) + (b > u ? 1 : 0); return P.int(`세 자리 수 ${a}□${b}${iga(b)} ${n}보다 큽니다. □ 안에 들어갈 수 있는 숫자는 모두 몇 개일까요?`, cnt, { unit: '개' }); },
      () => { const a = ri(1, 9), b = ri(0, 9), want = pick(['큰', '작은']); return P.int(`백의 자리 숫자가 ${a}, 십의 자리 숫자가 ${b}인 세 자리 수 중에서 가장 ${want} 수는 얼마일까요?`, a * 100 + b * 10 + (want === '큰' ? 9 : 0)); },
      () => { const a = ri(1, 5), b = ri(11, 30), c = ri(1, 9); return P.int(`구슬이 100개씩 ${a}상자, 10개씩 ${b}봉지, 낱개로 ${c}개 있습니다. 구슬은 모두 몇 개일까요?`, a * 100 + b * 10 + c, { unit: '개', word: true }); }
    ];
    return (lv === 2 ? pick([...adv, ...adv, ...basic]) : pick(basic))();
  });

  /* ===== 2-1-2 여러 가지 도형 ===== */
  const SHAPES = [['삼각형', 3], ['사각형', 4], ['오각형', 5], ['육각형', 6]];
  R('g2u2', (lv) => {
    const basic = [
      () => { const s = pick(SHAPES), part = pick(['변', '꼭짓점']); return P.int(`${s[0]}의 ${part}은 몇 개일까요?`, s[1], { unit: '개' }); },
      () => { const s = pick(SHAPES); const opts = shuffle(SHAPES.map(x => x[0])); return P.choice(`다음 도형의 이름은 무엇일까요?${polySVG(s[1])}`, opts, opts.indexOf(s[0])); },
      () => { const s = pick(SHAPES); return P.int(`다음 도형의 꼭짓점은 몇 개일까요?${polySVG(s[1])}`, s[1], { unit: '개' }); },
      () => { const s = pick(SHAPES); const opts = shuffle([s[0], ...shuffle(['원', ...SHAPES.map(x => x[0]).filter(x => x !== s[0])]).slice(0, 3)]); return P.choice(`곧은 선 ${s[1]}개로 둘러싸인 도형은 무엇일까요?`, opts, opts.indexOf(s[0])); },
      () => { const opts = shuffle(['원', ...shuffle(SHAPES.map(x => x[0])).slice(0, 3)]); return P.choice(`변과 꼭짓점이 없고 어느 쪽에서 보아도 똑같이 동그란 도형은 무엇일까요?`, opts, opts.indexOf('원')); },
      () => { const a = ri(3, 6), b = ri(1, a), three = Math.random() < .4; const c = three ? ri(1, b) : 0; return P.int(`쌓기나무를 1층에 ${a}개, 2층에 ${b}개${three ? `, 3층에 ${c}개` : ''} 쌓았습니다. 쌓은 쌓기나무는 모두 몇 개일까요?`, a + b + c, { unit: '개' }); },
      () => { const s1 = pick(SHAPES); let s2 = pick(SHAPES); if (s1 === s2) return null; const a = ri(1, 3), b = ri(1, 3), part = pick(['변', '꼭짓점']); return P.int(`${s1[0]} ${a}개와 ${s2[0]} ${b}개가 있습니다. ${part}은 모두 몇 개일까요?`, s1[1] * a + s2[1] * b, { unit: '개' }); }
    ];
    const adv = [
      () => { const a = ri(1, 4), b = ri(1, 4); return P.int(`변의 수가 모두 ${3 * a + 4 * b}개가 되도록 삼각형과 사각형을 그렸습니다. 삼각형을 ${a}개 그렸다면 사각형은 몇 개 그렸을까요?`, b, { unit: '개', word: true }); },
      () => { const s1 = pick(SHAPES), s2 = pick(SHAPES), p1 = pick(['변', '꼭짓점']), p2 = pick(['변', '꼭짓점']); const op = pick(['합', '차']); if (op === '차' && s1[1] === s2[1]) return null; return P.int(`${s1[0]}의 ${p1} 수와 ${s2[0]}의 ${p2} 수의 ${kJo(op, '은', '는')} 얼마일까요?`, op === '합' ? s1[1] + s2[1] : Math.abs(s1[1] - s2[1])); },
      () => { const a = ri(3, 6), b = ri(1, a), c = ri(0, b), n = a + b + c + ri(1, 9); return P.int(`쌓기나무 ${n}개가 있습니다. 1층에 ${a}개, 2층에 ${b}개${c ? `, 3층에 ${c}개` : ''}를 쌓았다면 남은 쌓기나무는 몇 개일까요?`, n - a - b - c, { unit: '개', word: true }); },
      () => { const a = ri(1, 4), b = ri(1, 3), c = ri(1, 3); return P.int(`원 ${a}개, 삼각형 ${b}개, 사각형 ${c}개를 그렸습니다. 그린 도형의 꼭짓점은 모두 몇 개일까요?`, 3 * b + 4 * c, { unit: '개', word: true }); },
      () => { const k = ri(2, 3), t = pick([['삼각형', 5], ['사각형', 2]]); return P.int(`칠교판은 삼각형 조각 5개와 사각형 조각 2개로 이루어져 있습니다. 칠교판 ${k}개에 있는 ${t[0]} 조각은 모두 몇 개일까요?`, t[1] * k, { unit: '개', word: true }); },
      () => { const s = pick(SHAPES), n = ri(2, 3), extra = ri(1, 5); return P.int(`꼭짓점이 ${s[1]}개인 도형 ${n}개를 그리고, 곧은 선 ${extra}개를 더 그렸습니다. 그린 곧은 선은 모두 몇 개일까요?`, s[1] * n + extra, { unit: '개', word: true }); }
    ];
    return (lv === 2 ? pick([...adv, ...adv, ...basic]) : pick(basic))();
  });

  /* ===== 2-1-3 덧셈과 뺄셈 ===== */
  R('g2u3', (lv) => {
    const basic = [
      () => { const a = ri(11, 89), b = ri(2, 9); if (a % 10 + b < 10) return null; return P.int(`${a} + ${b}`, a + b); },
      () => { const a = ri(11, 89), b = ri(11, 89); if (a % 10 + b % 10 < 10) return null; return P.int(`${a} + ${b}`, a + b); },
      () => { const a = ri(21, 98), b = ri(2, 9); if (a % 10 >= b) return null; return P.int(`${a} − ${b}`, a - b); },
      () => { const a = ri(30, 98), b = ri(11, 89); if (a % 10 >= b % 10 || a <= b) return null; return P.int(`${a} − ${b}`, a - b); },
      () => { const a = 10 * ri(3, 9), b = ri(11, a - 1); if (b % 10 === 0) return null; return P.int(`${a} − ${b}`, a - b); },
      () => { const a = ri(15, 60), b = ri(11, 39), c = ri(5, a + b - 1); return pick([P.int(`${a} + ${b} − ${c}`, a + b - c), (a > c ? P.int(`${a} − ${Math.min(c, a - 1)} + ${b}`, a - Math.min(c, a - 1) + b) : null)]); },
      () => { const a = ri(6, 39), c = a + ri(8, 50); const f = pick([0, 1, 2]); if (f === 0) return P.int(`□ + ${a} = ${c}에서 □에 알맞은 수를 구하세요.`, c - a); if (f === 1) return P.int(`${a} + □ = ${c}에서 □에 알맞은 수를 구하세요.`, c - a); return P.int(`□ − ${a} = ${c - a}에서 □에 알맞은 수를 구하세요.`, c); }
    ];
    const adv = [
      () => { const a = ri(18, 69), b = ri(13, 49); if (a % 10 + b % 10 < 10) return null; const t = pick([[`줄넘기를 어제는 ${a}번, 오늘은 ${b}번 했습니다. 이틀 동안 모두 몇 번 했을까요?`, '번'], [`색종이가 ${a}장 있었는데 ${b}장을 더 샀습니다. 색종이는 모두 몇 장일까요?`, '장'], [`도서관에 동화책이 ${a}권, 위인전이 ${b}권 있습니다. 책은 모두 몇 권일까요?`, '권']]); return P.int(t[0], a + b, { unit: t[1], word: true }); },
      () => { const a = ri(31, 95), b = ri(12, 29); if (a % 10 >= b % 10 || a <= b) return null; const t = pick([[`색종이 ${a}장 중에서 ${b}장을 사용했습니다. 남은 색종이는 몇 장일까요?`, '장'], [`귤이 ${a}개 있었는데 ${b}개를 먹었습니다. 남은 귤은 몇 개일까요?`, '개'], [`운동장에 학생이 ${a}명 있었는데 ${b}명이 교실로 들어갔습니다. 운동장에 남은 학생은 몇 명일까요?`, '명']]); return P.int(t[0], a - b, { unit: t[1], word: true }); },
      () => { const a = ri(15, 40), b = ri(5, a - 1), c = ri(6, 29); return P.int(`버스에 ${a}명이 타고 있었습니다. 이번 정류장에서 ${b}명이 내리고 ${c}명이 탔습니다. 지금 버스에 탄 사람은 몇 명일까요?`, a - b + c, { unit: '명', word: true }); },
      () => { const a = ri(11, 29), b = ri(10, 40); return P.int(`어떤 수에 ${a}${eul(a)} 더해야 할 것을 잘못하여 뺐더니 ${b}${iga(b)} 되었습니다. 바르게 계산하면 얼마일까요?`, b + 2 * a, { word: true }); },
      () => { const a = ri(25, 60), b = ri(6, 19); return P.int(`민수는 딱지를 ${a}장 가지고 있고, 동생은 민수보다 ${b}장 적게 가지고 있습니다. 두 사람이 가진 딱지는 모두 몇 장일까요?`, a + a - b, { unit: '장', word: true }); },
      () => { const d = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]).slice(0, 3).sort((x, y) => y - x); const big = d[0] * 10 + d[1], sm = d[2] * 10 + d[1]; const op = pick(['합', '차']); return P.int(`숫자 카드 ${shuffle(d).join(', ')} 중 2장을 골라 두 자리 수를 만들려고 합니다. 만들 수 있는 가장 큰 수와 가장 작은 수의 ${kJo(op, '은', '는')} 얼마일까요?`, op === '합' ? big + (d[2] * 10 + d[1]) : big - (d[2] * 10 + d[1]), { word: true }); }
    ];
    return (lv === 2 ? pick([...adv, ...adv, ...basic]) : pick(basic))();
  });

  /* ===== 2-1-4 길이 재기 (cm) ===== */
  R('g2u4', (lv) => {
    const basic = [
      () => { const e = ri(2, 10); return P.int(`막대의 한끝을 자의 눈금 0에 맞추었습니다. 막대의 길이는 몇 cm일까요?${rulerSVG(0, e)}`, e, { unit: 'cm' }); },
      () => { const s = ri(1, 5), e = ri(s + 2, 10); return P.int(`막대의 길이는 몇 cm일까요? (막대가 자의 눈금 0에서 시작하지 않아요.)${rulerSVG(s, e)}`, e - s, { unit: 'cm' }); },
      () => { const n = ri(3, 30); return P.int(`1cm가 ${n}번이면 몇 cm일까요?`, n, { unit: 'cm' }); },
      () => { const a = ri(3, 30), b = ri(3, 30); return P.int(`${a}cm인 색 테이프와 ${b}cm인 색 테이프를 겹치지 않게 이어 붙였습니다. 이어 붙인 색 테이프는 모두 몇 cm일까요?`, a + b, { unit: 'cm' }); },
      () => { const L = ri(8, 40); const d1 = ri(1, 4), d2 = ri(d1 + 2, 9); const [n1, n2] = two(); const e1 = L + pick([-1, 1]) * d1, e2 = L + pick([-1, 1]) * d2; const flip = Math.random() < .5; const A = flip ? [n2, e2] : [n1, e1], B = flip ? [n1, e1] : [n2, e2]; const ans = Math.abs(A[1] - L) < Math.abs(B[1] - L) ? A[0][0] : B[0][0]; const opts = [A[0][0], B[0][0]]; return P.choice(`실제 길이가 ${L}cm인 끈을 ${nmEun(A[0])} 약 ${A[1]}cm, ${nmEun(B[0])} 약 ${B[1]}cm로 어림했습니다. 실제 길이에 더 가깝게 어림한 사람은 누구일까요?`, opts, opts.indexOf(ans)); },
      () => { const t = pick([['새 연필', 17], ['지우개', 4], ['크레파스', 8], ['숟가락', 18], ['색연필', 16], ['클립', 3], ['스케치북의 짧은 쪽', 26], ['풀', 9]]); return choiceFrom(`${t[0]}의 길이로 가장 알맞은 것은 무엇일까요?`, `약 ${t[1]}cm`, [`약 ${t[1] * 10}cm`, `약 ${t[1] * 10 + 50}cm`]); },
      () => { const a = ri(10, 40), b = ri(3, a - 2); return P.int(`${a}cm인 막대는 ${b}cm인 막대보다 몇 cm 더 길까요?`, a - b, { unit: 'cm' }); }
    ];
    const adv = [
      () => { const L = ri(10, 50), d = ri(1, 9), E = L + pick([-1, 1]) * d; const [n] = two(); return P.int(`${nmEun(n)} 길이가 ${L}cm인 리본을 보고 약 ${E}cm라고 어림했습니다. 어림한 길이와 실제 길이의 차는 몇 cm일까요?`, d, { unit: 'cm', word: true }); },
      () => { const [n1, n2] = two(); const a = ri(4, 12); let b = ri(4, 12); if (a === b) return null; const thing = pick(['책상의 긴 쪽', '식탁의 긴 쪽', '침대의 짧은 쪽', '창문의 긴 쪽']); const opts = [n1[0], n2[0]]; return P.choice(`${thing}을 ${n1[0]}의 뼘으로 재면 ${a}뼘, ${n2[0]}의 뼘으로 재면 ${b}뼘입니다. 누구의 뼘이 더 길까요?`, opts, a < b ? 0 : 1); },
      () => { const a = ri(2, 9), b = ri(2, 9), c = ri(2, 9); return P.int(`길이가 ${a}cm, ${b}cm, ${c}cm인 선 3개를 이어 꺾은 선을 그렸습니다. 꺾은 선의 전체 길이는 몇 cm일까요?`, a + b + c, { unit: 'cm', word: true }); },
      () => { const a = ri(12, 40), b = ri(12, 40), c = ri(5, a + b - 5); return P.int(`${a}cm인 색 테이프와 ${b}cm인 색 테이프를 겹치지 않게 이어 붙인 다음 ${c}cm를 잘라 냈습니다. 남은 색 테이프는 몇 cm일까요?`, a + b - c, { unit: 'cm', word: true }); },
      () => { const a = ri(6, 20), b = ri(5, 2 * a - 1); return P.int(`길이가 ${a}cm인 막대 2개를 겹치지 않게 이어 붙이면 ${b}cm인 막대보다 몇 cm 더 길까요?`, 2 * a - b, { unit: 'cm', word: true }); },
      () => { const s = ri(1, 4), e = ri(s + 3, 10), k = e - s; return P.int(`연필의 한끝을 자의 눈금 ${s}에 맞추었더니 다른 끝이 눈금 ${e}에 닿았습니다. 이 연필 2자루를 겹치지 않게 이어 놓으면 몇 cm일까요?`, 2 * k, { unit: 'cm', word: true }); }
    ];
    return (lv === 2 ? pick([...adv, ...adv, ...basic]) : pick(basic))();
  });

  /* ===== 2-1-5 분류하기 ===== */
  const LEGS = [['닭', 2], ['오리', 2], ['참새', 2], ['펭귄', 2], ['강아지', 4], ['고양이', 4], ['소', 4], ['돼지', 4], ['토끼', 4], ['말', 4]];
  const CRITERIA = { good: [['장난감', ['색깔', '재료(나무, 플라스틱)']], ['동물 카드', ['다리의 수', '사는 곳(물, 땅)', '날개가 있는 것과 없는 것']], ['단추', ['색깔', '모양', '구멍의 수']], ['학용품', ['색깔', '쓰임(쓰는 것, 자르는 것, 붙이는 것)']], ['탈것 카드', ['바퀴의 수', '다니는 곳(땅, 물, 하늘)']], ['과일 그림', ['색깔']]], bad: ['예쁜 것과 예쁘지 않은 것', '좋아하는 것과 싫어하는 것', '멋진 것과 멋지지 않은 것', '귀여운 것과 귀엽지 않은 것', '재미있는 것과 재미없는 것'] };
  R('g2u5', (lv) => {
    const intro = (tp, list) => `우리 반 학생들이 ${tp.what}을 조사했습니다.<br>${list.join(', ')}<br>`;
    const basic = [
      () => { const s = survey(pick([3, 4]), 1, 6), list = rawList(s.names, s.counts), i = ri(0, s.names.length - 1); return P.int(`${intro(s.tp, list)}${kJo(s.names[i], '을', '를')} 고른 학생은 몇 명일까요?`, s.counts[i], { unit: '명' }); },
      () => { const s = survey(pick([3, 4]), 1, 6), list = rawList(s.names, s.counts); const mx = s.counts.indexOf(Math.max(...s.counts)); return P.choice(`${intro(s.tp, list)}가장 많은 학생이 고른 것은 무엇일까요?`, s.names, mx); },
      () => { const s = survey(pick([3, 4]), 1, 6), list = rawList(s.names, s.counts); const mn = s.counts.indexOf(Math.min(...s.counts)); return P.choice(`${intro(s.tp, list)}가장 적은 학생이 고른 것은 무엇일까요?`, s.names, mn); },
      () => { const tg = pick(CRITERIA.good), thing = tg[0], g = pick(tg[1]), bads = shuffle(CRITERIA.bad).slice(0, 2); return choiceFrom(`${kJo(thing, '을', '를')} 분류하려고 합니다. 누가 분류해도 결과가 같은 분류 기준은 무엇일까요?`, g, bads); },
      () => { const list = Array.from({ length: ri(7, 11) }, () => pick(LEGS)); const want = pick([2, 4]); if (!list.some(x => x[1] === want)) return null; return P.int(`다음 동물을 다리의 수에 따라 분류하려고 합니다.<br>${list.map(x => x[0]).join(', ')}<br>다리가 ${want}개인 동물은 몇 마리일까요?`, list.filter(x => x[1] === want).length, { unit: '마리' }); }
    ];
    const adv = [
      () => { const s = survey(pick([3, 4]), 1, 7), list = rawList(s.names, s.counts); return P.int(`${intro(s.tp, list)}가장 많은 학생이 고른 것은 가장 적은 학생이 고른 것보다 몇 명 더 많을까요?`, Math.max(...s.counts) - Math.min(...s.counts), { unit: '명', word: true }); },
      () => { const colors = ['빨간', '파란'], shapes = ['○', '△', '□']; const cnt = {}; const toks = []; colors.forEach(c => shapes.forEach(sh => { const k = ri(0, 3); cnt[c + sh] = k; for (let i = 0; i < k; i++) toks.push(`${c} ${sh}`); })); if (toks.length < 6) return null; const c = pick(colors), sh = pick(shapes); const both = Math.random() < .5; const v = both ? cnt[c + sh] : shapes.reduce((s, x) => s + cnt[c + x], 0); return P.int(`단추를 색깔과 모양에 따라 분류하려고 합니다.<br>${shuffle(toks).join(', ')}<br>${both ? `${c}색이면서 ${sh} 모양인` : `${c}색인`} 단추는 몇 개일까요?`, v, { unit: '개', word: true }); },
      () => { const s = survey(4, 1, 6), list = rawList(s.names, s.counts), [i, j] = shuffle([0, 1, 2, 3]).slice(0, 2); return P.int(`${intro(s.tp, list)}${kJo(s.names[i], '과', '와')} ${kJo(s.names[j], '을', '를')} 고른 학생은 모두 몇 명일까요?`, s.counts[i] + s.counts[j], { unit: '명', word: true }); },
      () => { const s = survey(pick([3, 4]), 1, 6), list = rawList(s.names, s.counts); return P.int(`${intro(s.tp, list)}조사한 학생은 모두 몇 명일까요?`, list.length, { unit: '명' }); },
      () => { const list = Array.from({ length: ri(7, 11) }, () => pick(LEGS)); const n2 = list.filter(x => x[1] === 2).length, n4 = list.length - n2; if (!n2 || !n4 || n2 === n4) return null; return P.int(`다음 동물을 다리의 수에 따라 분류했습니다.<br>${list.map(x => x[0]).join(', ')}<br>다리가 4개인 동물과 2개인 동물 수의 차는 몇 마리일까요?`, Math.abs(n4 - n2), { unit: '마리', word: true }); }
    ];
    return (lv === 2 ? pick([...adv, ...adv, ...basic]) : pick(basic))();
  });

  /* ===== 2-1-6 곱셈 ===== */
  const GROUPS = [['세발자전거', '대', '바퀴', 3], ['의자', '개', '다리', 4], ['오리', '마리', '다리', 2], ['문어', '마리', '다리', 8], ['개미', '마리', '다리', 6], ['자동차', '대', '바퀴', 4], ['사람', '명', '손가락', 10], ['거미', '마리', '다리', 8]];
  R('g2u6', (lv) => {
    const basic = [
      () => { const a = ri(2, 9), b = ri(2, 9); return P.int(`${a}씩 ${b}묶음은 모두 몇 개일까요?`, a * b, { unit: '개' }); },
      () => { const a = ri(2, 9), b = ri(2, 9); return P.int(`${a}의 ${b}배는 얼마일까요?`, a * b); },
      () => { const a = ri(2, 9), b = ri(3, 7); return P.int(`${Array(b).fill(a).join(' + ')}${eul(a)} 곱셈식으로 나타내면 ${a} × □입니다. □에 알맞은 수를 구하세요.`, b); },
      () => { const a = ri(2, 9), b = ri(2, 6); return P.int(`0에서 시작하여 ${a}씩 ${b}번 뛰어 세면 얼마가 될까요?`, a * b); },
      () => { const a = ri(2, 9), b = ri(3, 5); return choiceFrom(`${a} × ${b}${gwa(b)} 같은 덧셈식은 무엇일까요?`, Array(b).fill(a).join('+'), [`${a}+${b}`, Array(b - 1).fill(a).join('+'), Array(b + 1).fill(a).join('+')]); },
      () => { const a = ri(2, 9), k = ri(2, 6), n = a * k; return P.int(`${n}${eun(n)} ${a}의 몇 배일까요?`, k, { unit: '배' }); }
    ];
    const adv = [
      () => { const g = pick(GROUPS), n = ri(2, 6); return P.int(`${g[0]} ${n}${g[1]}의 ${kJo(g[2], '은', '는')} 모두 몇 개일까요?`, g[3] * n, { unit: '개', word: true }); },
      () => { const a = ri(3, 9), b = ri(2, 5), c = ri(1, 9); return P.int(`사탕이 한 봉지에 ${a}개씩 ${b}봉지 있고, 낱개로 ${c}개가 더 있습니다. 사탕은 모두 몇 개일까요?`, a * b + c, { unit: '개', word: true }); },
      () => { const a = ri(2, 9), k = ri(2, 5); return P.int(`빨간 구슬은 ${a}개이고, 파란 구슬은 빨간 구슬의 ${k}배입니다. 파란 구슬은 몇 개일까요?`, a * k, { unit: '개', word: true }); },
      () => { const a = ri(2, 5), b = ri(2, 4), c = ri(2, 5), d = ri(2, 4); if (a === c && b === d) return null; return P.int(`${a}의 ${b}배와 ${c}의 ${d}배를 더하면 얼마일까요?`, a * b + c * d); },
      () => { const a = ri(3, 9), b = ri(2, 5), c = ri(1, a * b - 1); return P.int(`연필이 ${a}자루씩 ${b}묶음 있었습니다. 그중 ${c}자루를 동생에게 주었다면 남은 연필은 몇 자루일까요?`, a * b - c, { unit: '자루', word: true }); },
      () => { const a = ri(2, 5), k = ri(2, 4), n = a * k; const [n1, n2] = two(); return P.int(`${nmEun(n1)} 블록을 ${a}개, ${nmEun(n2)} ${n}개 가지고 있습니다. ${n2[0]}의 블록 수는 ${n1[0]}의 블록 수의 몇 배일까요?`, k, { unit: '배', word: true }); }
    ];
    return (lv === 2 ? pick([...adv, ...adv, ...basic]) : pick(basic))();
  });

  /* ===== 2-2-1 네 자리 수 ===== */
  R('g2u7', (lv) => {
    const basic = [
      () => { const a = ri(1, 9), b = ri(0, 9), c = ri(0, 9), d = ri(0, 9); return P.int(`1000이 ${a}개, 100이 ${b}개, 10이 ${c}개, 1이 ${d}개인 수는 얼마일까요?`, a * 1000 + b * 100 + c * 10 + d); },
      () => { const d = distinctDigits(4); const n = Number(d.join('')); const k = pick([0, 1, 2, 3].filter(i => d[i] !== 0)); return P.int(`${n}에서 숫자 ${d[k]}${iga(d[k])} 나타내는 값은 얼마일까요?`, d[k] * [1000, 100, 10, 1][k]); },
      () => { const n = ri(1000, 9999), k = pick([1000, 100, 10, 1]); return P.int(`${n}에서 ${placeName[k]}의 자리 숫자는 무엇일까요?`, Math.floor(n / k) % 10); },
      () => { const step = pick([1, 10, 100, 1000]), k = ri(2, 4), n = ri(1000, 9999 - step * k); return P.int(`${n}에서 ${step}씩 ${k}번 뛰어 센 수는 얼마일까요?`, n + step * k); },
      () => { const a = ri(1000, 9999); const b = pick([a + ri(1, 9), a - ri(1, 9), a + 10 * ri(1, 9), a - 100 * ri(1, 5), Math.floor(a / 1000) * 1000 + ri(0, 999)]); if (b === a || b < 1000 || b > 9999) return null; return P.choice(cmpQ(a, b), ['&gt;', '&lt;'], a > b ? 0 : 1); },
      () => { const x = pick([900, 990, 999, 800, 700, 500, 950, 980]); return P.int(`1000은 ${x}보다 얼마만큼 더 큰 수일까요?`, 1000 - x); },
      () => { const a = ri(1, 9); return pick([P.int(`${a * 1000}은 1000이 몇 개인 수일까요?`, a, { unit: '개' }), P.int(`${a * 1000}은 100이 몇 개인 수일까요?`, a * 10, { unit: '개' })]); }
    ];
    const adv = [
      () => { const d = distinctDigits(4, true); const big = d.slice().sort((x, y) => y - x); const sm = d.slice().sort((x, y) => x - y); if (sm[0] === 0) { const i = sm.findIndex(x => x > 0); [sm[0], sm[i]] = [sm[i], sm[0]]; } const want = pick(['큰', '작은']); return P.int(`숫자 카드 ${d.join(', ')}${eul(d[d.length - 1])} 한 번씩만 사용하여 만들 수 있는 가장 ${want} 네 자리 수는 얼마일까요?`, Number((want === '큰' ? big : sm).join('')), { word: true }); },
      () => { const a = ri(1, 7), b = ri(10, 25), c = ri(0, 30); return P.int(`1000원짜리 지폐 ${a}장, 100원짜리 동전 ${b}개, 10원짜리 동전 ${c}개는 모두 얼마일까요?`, a * 1000 + b * 100 + c * 10, { unit: '원', word: true }); },
      () => { const step = pick([100, 1000]), k = ri(2, 4), n = ri(1000 + step * k, 9999); return P.int(`어떤 수에서 ${step}씩 ${k}번 뛰어 세었더니 ${n}${iga(n)} 되었습니다. 어떤 수는 얼마일까요?`, n - step * k, { word: true }); },
      () => { const a = ri(1, 9), b = ri(0, 9), t = ri(0, 8), u = ri(0, 9), c = ri(0, 9); if (c === u) return null; const n = a * 1000 + b * 100 + t * 10 + u; return P.int(`네 자리 수 ${a}${b}□${c}${iga(c)} ${n}보다 큽니다. □ 안에 들어갈 수 있는 숫자는 모두 몇 개일까요?`, (9 - t) + (c > u ? 1 : 0), { unit: '개' }); },
      () => { const a = ri(1, 9), b = ri(0, 9), want = pick(['큰', '작은']); return P.int(`천의 자리 숫자가 ${a}, 백의 자리 숫자가 ${b}인 네 자리 수 중에서 가장 ${want} 수는 얼마일까요?`, a * 1000 + b * 100 + (want === '큰' ? 99 : 0)); },
      () => { const s = ri(2, 6) * 1000 + ri(0, 9) * 100, k = ri(3, 6); return P.int(`저금통에 ${s}원이 있습니다. 매달 1000원씩 ${k}달 동안 더 넣으면 저금통의 돈은 모두 얼마가 될까요?`, s + 1000 * k, { unit: '원', word: true }); }
    ];
    return (lv === 2 ? pick([...adv, ...adv, ...basic]) : pick(basic))();
  });

  /* ===== 2-2-2 곱셈구구 ===== */
  R('g2u8', (lv) => {
    const basic = [
      () => { const a = ri(2, 9), b = ri(2, 9); return P.int(`${a} × ${b}`, a * b); },
      () => { const a = ri(2, 9), b = ri(2, 9); return P.int(`${a} × □ = ${a * b}에서 □에 알맞은 수를 구하세요.`, b); },
      () => { const a = ri(2, 9), b = ri(2, 9); return P.int(`□ × ${b} = ${a * b}에서 □에 알맞은 수를 구하세요.`, a); },
      () => { const n = ri(2, 9), f = pick([0, 1, 2, 3]); return [P.int(`1 × ${n}`, n), P.int(`${n} × 1`, n), P.int(`0 × ${n}`, 0), P.int(`${n} × 0`, 0)][f]; },
      () => { const a = ri(2, 9), b = ri(2, 9); if (a === b) return null; return P.int(`${a} × ${b} = ${b} × □에서 □에 알맞은 수를 구하세요.`, a); },
      () => { const a = ri(2, 9), b = ri(3, 9); return P.int(`${a}단 곱셈구구에서 ${a} × ${b}${eun(b)} ${a} × ${b - 1}보다 얼마만큼 더 클까요?`, a); }
    ];
    const adv = [
      () => { const a = ri(3, 9), b = ri(3, 9); const t = pick([[`한 상자에 초콜릿이 ${a}개씩 들어 있습니다. ${b}상자에 들어 있는 초콜릿은 모두 몇 개일까요?`, '개'], [`한 줄에 ${a}명씩 ${b}줄로 서 있습니다. 서 있는 학생은 모두 몇 명일까요?`, '명'], [`꽃병 ${b}개에 꽃을 ${a}송이씩 꽂았습니다. 꽂은 꽃은 모두 몇 송이일까요?`, '송이'], [`하루에 동화책을 ${a}쪽씩 ${b}일 동안 읽었습니다. 모두 몇 쪽을 읽었을까요?`, '쪽']]); return P.int(t[0], a * b, { unit: t[1], word: true }); },
      () => { const a = ri(2, 9), b = ri(2, 9), c = ri(2, 9), d = ri(2, 9); return P.int(`${a} × ${b}${gwa(b)} ${c} × ${d}의 합은 얼마일까요?`, a * b + c * d); },
      () => { const N = pick([4, 6, 8, 9, 12, 16, 18, 24, 36]); let cnt = 0; for (let i = 1; i <= 9; i++) for (let j = 1; j <= 9; j++) if (i * j === N) cnt++; return P.int(`곱셈표(1단~9단)에서 곱이 ${N}인 칸은 모두 몇 개일까요?`, cnt, { unit: '개' }); },
      () => { const a = ri(3, 9), N = ri(a * 2 + 1, a * 9); if (N % a === 0) return null; return P.int(`${a} × □ &lt; ${N}에서 □ 안에 들어갈 수 있는 가장 큰 수를 구하세요.`, Math.floor(N / a)); },
      () => { const a = ri(1, 6), b = ri(1, 6), c = ri(0, 4); return P.int(`과녁 맞히기에서 3점짜리를 ${a}번, 5점짜리를 ${b}번${c ? `, 0점짜리를 ${c}번` : ''} 맞혔습니다. 얻은 점수는 모두 몇 점일까요?`, 3 * a + 5 * b, { unit: '점', word: true }); },
      () => { const a = ri(2, 9), b = ri(2, 9); return P.int(`어떤 수에 ${a}${eul(a)} 곱했더니 ${a * b}${iga(a * b)} 되었습니다. 어떤 수는 얼마일까요?`, b, { word: true }); },
      () => { const a = ri(2, 9), b = ri(2, 9), c = ri(1, a * b - 1); return P.int(`${a}의 ${b}배보다 ${c}만큼 더 작은 수는 얼마일까요?`, a * b - c); }
    ];
    return (lv === 2 ? pick([...adv, ...adv, ...basic]) : pick(basic))();
  });

  /* ===== 2-2-3 길이 재기 (m, cm) ===== */
  const mcm = (a, b) => (b ? `${a}m ${b}cm` : `${a}m`);
  const UNIT_THINGS = [['연필', 15, 'cm'], ['교실 칠판의 긴 쪽', 4, 'm'], ['버스의 길이', 10, 'm'], ['숟가락', 20, 'cm'], ['내 한 뼘', 12, 'cm'], ['수영장의 긴 쪽', 25, 'm'], ['책상의 높이', 70, 'cm'], ['동화책의 긴 쪽', 30, 'cm'], ['기린의 키', 5, 'm'], ['교실 문의 높이', 2, 'm'], ['운동장 긴 쪽', 80, 'm'], ['필통의 길이', 22, 'cm']];
  R('g2u9', (lv) => {
    const basic = [
      () => { const a = ri(1, 9), b = pick([ri(1, 9), ri(10, 99)]); return P.int(`${mcm(a, b)}는 몇 cm일까요?`, a * 100 + b, { unit: 'cm' }); },
      () => { const a = ri(1, 9), b = ri(1, 99), c = a * 100 + b; return pick([P.int(`${c}cm = ${a}m □cm일 때 □에 알맞은 수를 구하세요.`, b), P.int(`${c}cm = □m ${b}cm일 때 □에 알맞은 수를 구하세요.`, a)]); },
      () => { const a = ri(1, 9); return pick([P.int(`${a}m는 몇 cm일까요?`, a * 100, { unit: 'cm' }), P.int(`${a * 100}cm는 몇 m일까요?`, a, { unit: 'm' })]); },
      () => { const a = ri(1, 5), b = ri(10, 60), c = ri(1, 4), d = ri(10, 99 - b); const ask = pick(['m', 'cm']); return P.int(`${mcm(a, b)} + ${mcm(c, d)} = □m ○cm입니다. ${ask === 'm' ? '□' : '○'}에 알맞은 수를 구하세요.`, ask === 'm' ? a + c : b + d); },
      () => { const a = ri(3, 9), c = ri(1, a - 1), b = ri(20, 99), d = ri(1, b); const ask = pick(['m', 'cm']); return P.int(`${mcm(a, b)} − ${mcm(c, d)} = □m ○cm입니다. ${ask === 'm' ? '□' : '○'}에 알맞은 수를 구하세요.`, ask === 'm' ? a - c : b - d); },
      () => { const t = pick(UNIT_THINGS); return P.choice(`${kJo(t[0], '은', '는')} 약 ${t[1]}(  )입니다. (  ) 안에 알맞은 단위를 고르세요.`, ['cm', 'm'], t[2] === 'cm' ? 0 : 1); }
    ];
    const adv = [
      () => { const a = ri(1, 3), b = ri(30, 95), c = ri(1, 3), d = ri(30, 95); return P.int(`빨간 끈 ${mcm(a, b)}와 파란 끈 ${mcm(c, d)}를 겹치지 않게 이었습니다. 이은 끈의 전체 길이는 몇 cm일까요?`, a * 100 + b + c * 100 + d, { unit: 'cm', word: true }); },
      () => { const a = 1, b = ri(20, 50), d = ri(5, 40); const [n1, n2] = two(); return P.int(`${n1[0]}의 키는 ${mcm(a, b)}이고, ${n2[0]}의 키는 ${a * 100 + b - d}cm입니다. 두 사람의 키의 차는 몇 cm일까요?`, d, { unit: 'cm', word: true }); },
      () => { const a = ri(1, 3), b = ri(5, 95); let c = a * 100 + b + pick([-1, 1]) * ri(3, 60); if (c === a * 100 + b || c < 100) return null; const opts = [mcm(a, b), `${c}cm`]; return P.choice(`${opts[0]}와 ${opts[1]} 중 더 긴 것을 고르세요.`, opts, a * 100 + b > c ? 0 : 1); },
      () => { const k = ri(2, 9); const [n] = two(); return P.int(`두 걸음이 약 1m인 ${n[0]}${n[1] ? '이가' : '가'} 교실의 긴 쪽을 ${2 * k}걸음으로 재었습니다. 교실의 긴 쪽은 약 몇 m일까요?`, k, { unit: 'm', word: true }); },
      () => { const a = ri(2, 4), b = ri(0, 60), c = ri(20, 95); return P.int(`${mcm(a, b)}인 리본에서 ${c}cm를 잘라 썼습니다. 남은 리본은 몇 cm일까요?`, a * 100 + b - c, { unit: 'cm', word: true }); },
      () => { const k = ri(2, 6), r = ri(5, 60); return P.int(`양팔을 벌린 길이가 1m인 아빠가 소파의 길이를 재었더니 양팔 길이로 ${k}번 재고 ${r}cm가 더 남았습니다. 소파의 길이는 몇 cm일까요?`, 100 * k + r, { unit: 'cm', word: true }); }
    ];
    return (lv === 2 ? pick([...adv, ...adv, ...basic]) : pick(basic))();
  });

  /* ===== 2-2-4 시각과 시간 ===== */
  const DAYS = ['월', '화', '수', '목', '금', '토', '일'];
  R('g2u10', (lv) => {
    const clock5 = () => { const h = ri(1, 12), m = 5 * ri(1, 11), k = m / 5; const hc = m >= 30 ? nextH(h) : prevH(h); return choiceFrom(`시계를 보고 몇 시 몇 분인지 고르세요.${clockSVG(h, m)}`, tStr(h, m), [tStr(h, k), tStr(hc, m), tStr(hc, k)]); };
    const clock1 = () => { const h = ri(1, 12); let m = ri(1, 59); if (m % 5 === 0) m += 1; const hc = m >= 30 ? nextH(h) : prevH(h); const m2 = m + 5 <= 59 ? m + 5 : m - 5; return choiceFrom(`시계를 보고 몇 시 몇 분인지 고르세요.${clockSVG(h, m)}`, tStr(h, m), [tStr(h, m2), tStr(hc, m), tStr(hc, m2)]); };
    const basic = [
      clock5, clock5, clock1,
      () => { const a = ri(1, 3), b = 5 * ri(1, 11); return P.int(`${a}시간 ${b}분은 몇 분일까요?`, 60 * a + b, { unit: '분' }); },
      () => { const c = ri(61, 119); return P.int(`${c}분은 1시간 몇 분일까요?`, c - 60, { unit: '분' }); },
      () => { const h = ri(2, 12), k = pick([5, 10, 15]); return P.int(`${h}시 ${k}분 전은 ${h - 1}시 몇 분일까요?`, 60 - k, { unit: '분' }); },
      () => { const f = pick([0, 1, 2]); if (f === 0) { const a = ri(2, 3); return P.int(`${a}일은 몇 시간일까요?`, 24 * a, { unit: '시간' }); } if (f === 1) { const b = ri(1, 12); return P.int(`1일 ${b}시간은 몇 시간일까요?`, 24 + b, { unit: '시간' }); } const a = ri(1, 4), b = ri(0, 6); return P.int(b ? `${a}주일 ${b}일은 며칠일까요?` : `${a}주일은 며칠일까요?`, 7 * a + b, { unit: '일' }); },
      () => { const t = pick([['아침 7시', 0], ['새벽 5시', 0], ['학교에 가는 아침 8시', 0], ['저녁 7시', 1], ['밤 10시', 1], ['점심을 먹은 뒤 낮 2시', 1], ['아침 8시 30분', 0], ['저녁 6시 30분', 1]]); return P.choice(`${kJo(t[0], '을', '를')} 나타낼 때 앞에 붙이는 말로 알맞은 것은 무엇일까요?`, ['오전', '오후'], t[1]); }
    ];
    const adv = [
      () => { const h = ri(1, 9), m = 5 * ri(0, 11), d = 5 * ri(3, 22); const tot = h * 60 + m + d, H = Math.floor(tot / 60), Mi = tot % 60; const act = pick(['숙제', '피아노 연습', '블록 놀이', '독서', '줄넘기']); return P.int(`${kJo(act, '을', '를')} ${h}시${m ? ` ${m}분` : ''}에 시작해서 ${H}시${Mi ? ` ${Mi}분` : ''}에 끝냈습니다. ${kJo(act, '을', '를')} 몇 분 동안 했을까요?`, d, { unit: '분', word: true }); },
      () => { const h = ri(1, 8), m = 5 * ri(0, 11), d = pick([20, 30, 40, 50, 70, 80, 90, 100]); const tot = h * 60 + m + d, H = Math.floor(tot / 60), Mi = tot % 60; const A = (x, y) => `${x}시 ${y}분`; const wrongs = [A(H + 1, Mi), A(H, (Mi + 10) % 60), A(H === 1 ? 12 : H - 1, Mi)]; const dur = d >= 60 ? `1시간${d - 60 ? ` ${d - 60}분` : ''}` : `${d}분`; return choiceFrom(`영화가 ${h}시 ${m}분에 시작하여 ${dur} 동안 상영됩니다. 영화가 끝나는 시각은 몇 시 몇 분일까요?`, A(H, Mi), wrongs); },
      () => { const a = ri(7, 11), b = ri(1, 6); return P.int(`오전 ${a}시부터 오후 ${b}시까지는 몇 시간일까요?`, 12 - a + b, { unit: '시간', word: true }); },
      () => { const d = ri(1, 10), k = pick([7, 14, 1, 2, 3, 8, 9, 10]), di = ri(0, 6), mon = ri(3, 12); const ans = DAYS[(di + k) % 7] + '요일'; const wr = shuffle(DAYS.filter(x => x + '요일' !== ans)).slice(0, 3).map(x => x + '요일'); return choiceFrom(`${mon}월 ${d}일은 ${DAYS[di]}요일입니다. 같은 달 ${d + k}일은 무슨 요일일까요?`, ans, wr); },
      () => { const mon = ri(1, 12), n = ri(1, 3), d = ri(1, 30 - 7 * n); return P.int(`${mon}월 ${d}일부터 ${n}주일 후는 ${mon}월 며칠일까요?`, d + 7 * n, { unit: '일', word: true }); },
      () => { const mon = pick([1, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]); const days = [4, 6, 9, 11].includes(mon) ? 30 : 31; const d = ri(1, days - 3); return P.int(`${mon}월은 ${days}일까지 있습니다. ${mon}월 ${d}일부터 ${mon}월 마지막 날까지는 모두 며칠일까요? (${d}일과 마지막 날을 모두 셉니다.)`, days - d + 1, { unit: '일', word: true }); }
    ];
    return (lv === 2 ? pick([...adv, ...adv, ...basic]) : pick(basic))();
  });

  /* ===== 2-2-5 표와 그래프 ===== */
  R('g2u11', (lv) => {
    const tbl = (s, withTotal, blank = -1) => table(s.tp.what, `${s.tp.who} 수(명)`, withTotal ? [...s.names, '합계'] : s.names, (withTotal ? [...s.counts, s.counts.reduce((x, y) => x + y, 0)] : s.counts).map((c, i) => (i === blank ? '□' : c)));
    const basic = [
      () => { const s = survey(4, 1, 8), i = ri(0, 3); const T = s.counts.reduce((x, y) => x + y, 0); return P.int(`우리 반 ${s.tp.who}들이 ${s.tp.what}을 조사하여 표로 나타냈습니다. □에 알맞은 수를 구하세요.${tbl(s, true, i)}`, s.counts[i], { unit: '명' }); },
      () => { const s = survey(4, 1, 8); return P.int(`우리 반 ${s.tp.who}들이 ${s.tp.what}을 조사하여 표로 나타냈습니다. 조사한 ${s.tp.who}은 모두 몇 명일까요?${tbl(s, false)}`, s.counts.reduce((x, y) => x + y, 0), { unit: '명' }); },
      () => { const s = survey(4, 1, 6); return P.choice(`${s.tp.what}을 조사하여 ○를 이용한 그래프로 나타냈습니다. 가장 많은 ${s.tp.who}이 고른 것은 무엇일까요?${circleGraphSVG(s.names, s.counts)}`, s.names, s.counts.indexOf(Math.max(...s.counts))); },
      () => { const s = survey(4, 1, 6); return P.choice(`${s.tp.what}을 조사하여 ○를 이용한 그래프로 나타냈습니다. 가장 적은 ${s.tp.who}이 고른 것은 무엇일까요?${circleGraphSVG(s.names, s.counts)}`, s.names, s.counts.indexOf(Math.min(...s.counts))); },
      () => { const s = survey(4, 1, 6), i = ri(0, 3); return P.int(`${s.tp.what}을 조사하여 ○를 이용한 그래프로 나타냈습니다. ${kJo(s.names[i], '을', '를')} 고른 ${s.tp.who}은 몇 명일까요?${circleGraphSVG(s.names, s.counts)}`, s.counts[i], { unit: '명' }); },
      () => { const s = survey(4, 1, 8); return P.choice(`표를 보고 가장 많은 ${s.tp.who}이 고른 것을 찾으세요.${tbl(s, false)}`, s.names, s.counts.indexOf(Math.max(...s.counts))); }
    ];
    const adv = [
      () => { const s = survey(4, 1, 6); return P.int(`${s.tp.what}을 조사하여 그래프로 나타냈습니다. 가장 많은 ${s.tp.who}이 고른 것은 가장 적은 ${s.tp.who}이 고른 것보다 몇 명 더 많을까요?${circleGraphSVG(s.names, s.counts)}`, Math.max(...s.counts) - Math.min(...s.counts), { unit: '명', word: true }); },
      () => { const s = survey(4, 1, 8), i = ri(0, 3); const mx = s.counts.indexOf(Math.max(...s.counts)); if (mx === i) return null; return P.choice(`표의 □를 구한 다음, 가장 많은 ${s.tp.who}이 고른 것을 찾으세요.${tbl(s, true, i)}`, s.names, mx); },
      () => { const s = survey(4, 1, 6), x = ri(2, 4); return P.int(`${s.tp.what}을 조사하여 그래프로 나타냈습니다. ${x}명보다 많은 ${s.tp.who}이 고른 것은 모두 몇 가지일까요?${circleGraphSVG(s.names, s.counts)}`, s.counts.filter(c => c > x).length, { unit: '가지', word: true }); },
      () => { const s = survey(4, 1, 7); const sorted = s.counts.slice().sort((a, b) => b - a); if (sorted[1] === sorted[2]) return null; return P.choice(`표를 보고 두 번째로 많은 ${s.tp.who}이 고른 것을 찾으세요.${tbl(s, false)}`, s.names, s.counts.indexOf(sorted[1])); },
      () => { const s = survey(4, 1, 6), [i, j] = shuffle([0, 1, 2, 3]).slice(0, 2); return P.int(`${s.tp.what}을 조사하여 그래프로 나타냈습니다. ${kJo(s.names[i], '과', '와')} ${kJo(s.names[j], '을', '를')} 고른 ${s.tp.who}은 모두 몇 명일까요?${circleGraphSVG(s.names, s.counts)}`, s.counts[i] + s.counts[j], { unit: '명', word: true }); },
      () => { const s = survey(4, 1, 8), i = ri(0, 3), j = (i + ri(1, 3)) % 4; return P.int(`표에서 □의 값을 구한 다음, ${kJo(s.names[j], '을', '를')} 고른 ${s.tp.who}과 ${kJo(s.names[i], '을', '를')} 고른 ${s.tp.who} 수의 합을 구하세요.${tbl(s, true, i)}`, s.counts[i] + s.counts[j], { unit: '명', word: true }); }
    ];
    return (lv === 2 ? pick([...adv, ...adv, ...basic]) : pick(basic))();
  });

  /* ===== 2-2-6 규칙 찾기 ===== */
  const SYM = ['○', '△', '☆', '◇', '♡'];
  const ORD = ['첫째', '둘째', '셋째', '넷째', '다섯째'];
  R('g2u12', (lv) => {
    const unitPat = () => { const len = pick([2, 3, 3, 4]); const syms = shuffle(SYM).slice(0, len === 4 ? 3 : len); let u; if (len === 4) u = [syms[0], syms[1], syms[1], syms[2]]; else if (len === 3 && Math.random() < .4) u = [syms[0], syms[0], syms[1]]; else u = syms.slice(0, len); return u; };
    const basic = [
      () => { const a = ri(1, 50), d = ri(2, 10), dec = Math.random() < .3; if (dec && a - 4 * d < 0) return null; const s = [0, 1, 2, 3].map(i => dec ? a + 4 * d - i * d : a + i * d); const nx = dec ? s[3] - d : s[3] + d; return P.int(`규칙을 찾아 □에 알맞은 수를 구하세요.<br>${s.join(', ')}, □`, nx); },
      () => { const a = ri(1, 50), d = ri(2, 10); return P.int(`규칙을 찾아 □에 알맞은 수를 구하세요.<br>${a}, ${a + d}, □, ${a + 3 * d}, ${a + 4 * d}`, a + 2 * d); },
      () => { const u = unitPat(), L = u.length, shown = 2 * L + ri(0, L - 1); const seq = Array.from({ length: shown }, (_, i) => u[i % L]); const ans = u[shown % L]; const o = shuffle([ans, ...shuffle(SYM.filter(x => x !== ans)).slice(0, 2)]); return P.choice(`규칙에 따라 늘어놓았습니다. □에 알맞은 모양을 고르세요.<br>${seq.join(' ')} □`, o, o.indexOf(ans)); },
      () => { const f = Math.random() < .6; const d = f ? ri(1, 24) : ri(8, 31); return P.int(`달력에서 ${d}일의 바로 ${f ? '아래' : '위'} 칸에 있는 날짜는 며칠일까요?`, f ? d + 7 : d - 7, { unit: '일' }); },
      () => { const n = ri(2, 9); return P.int(`곱셈표에서 ${n}단의 수는 오른쪽으로 한 칸 갈 때마다 몇씩 커질까요?`, n); },
      () => { const a = ri(1, 9), b = ri(1, 9); return P.int(`덧셈표에서 세로줄의 ${a}${gwa(a)} 가로줄의 ${b}${iga(b)} 만나는 칸에 들어갈 수는 얼마일까요?`, a + b); }
    ];
    const adv = [
      () => { const a = ri(1, 20), d = ri(2, 9), n = ri(6, 10); return P.int(`${a}부터 시작하여 ${d}씩 커지는 수를 차례로 늘어놓았습니다. ${n}번째 수는 얼마일까요?`, a + (n - 1) * d, { word: true }); },
      () => { const u = unitPat(), L = u.length, k = ri(10, 20); const ans = u[(k - 1) % L]; const o = shuffle([ans, ...shuffle(Array.from(new Set(u)).filter(x => x !== ans)), ...shuffle(SYM.filter(x => !u.includes(x)))].slice(0, 4)); return P.choice(`규칙에 따라 모양을 늘어놓았습니다.<br>${[...u, ...u].join(' ')} …<br>${k}번째에 놓일 모양은 무엇일까요?`, o, o.indexOf(ans)); },
      () => { const dow = pick(DAYS.slice(0, 5)), d = ri(1, 7), o = ri(1, 3); return P.int(`어느 달의 첫째 ${dow}요일은 ${d}일입니다. 같은 달 ${ORD[o]} ${dow}요일은 며칠일까요?`, d + 7 * o, { unit: '일', word: true }); },
      () => { const a = ri(1, 4), k = ri(2, 4); return P.int(`쌓기나무를 규칙에 따라 쌓았습니다. 첫째에 ${a}개, 둘째에 ${a + k}개, 셋째에 ${a + 2 * k}개를 쌓았다면 다섯째에는 몇 개를 쌓아야 할까요?`, a + 4 * k, { unit: '개', word: true }); },
      () => { const a = ri(1, 9), p = ri(2, 5), q = ri(1, 4); if (p === q) return null; const s = [a]; for (let i = 1; i < 6; i++) s.push(s[i - 1] + (i % 2 ? p : q)); return P.int(`규칙을 찾아 □에 알맞은 수를 구하세요.<br>${s.slice(0, 5).join(', ')}, □`, s[5], { word: true }); },
      () => { const a = ri(2, 9), b = ri(2, 9); if (a === b) return null; return P.int(`곱셈표에서 ${a} × ${b}의 곱과 같은 수가 ${b}단에도 있습니다. ${b} × □일 때 □에 알맞은 수를 구하세요.`, a); }
    ];
    return (lv === 2 ? pick([...adv, ...adv, ...basic]) : pick(basic))();
  });
})();
