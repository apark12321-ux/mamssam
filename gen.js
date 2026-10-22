/* 쌤픽 — 단원별 문제 자동 생성기 */
(function () {
  const ri = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
  const gcd = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) { [a, b] = [b, a % b]; } return a; };
  const lcm = (a, b) => a / gcd(a, b) * b;
  const red = (n, d) => { const g = gcd(n, d) || 1; return [n / g, d / g]; };
  const shuffle = (arr) => { const a = arr.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };

  /* 분수 HTML (세로 분수) */
  const F = (n, d) => `<span class="fr"><span class="fn">${n}</span><span class="fd">${d}</span></span>`;
  /* 대분수 표시: w 자연수, n/d 진분수 */
  const M = (w, n, d) => (w ? `<span class="fw">${w}</span>` : '') + (n ? F(n, d) : '');
  /* 가분수/진분수 값 → 기약 대분수 HTML */
  function fracHTML(n, d) {
    [n, d] = red(n, d);
    if (d === 1) return String(n);
    const w = Math.floor(n / d), r = n % d;
    return M(w, r, d);
  }
  function fracText(n, d) {
    [n, d] = red(n, d);
    if (d === 1) return String(n);
    const w = Math.floor(n / d), r = n % d;
    return w ? `${w} ${r}/${d}` : `${r}/${d}`;
  }
  const mixedToImproper = (w, n, d) => [w * d + n, d];
  const fmt = (x) => x.toLocaleString('ko-KR');

  /* 소수: 정수 k와 소수 자릿수 p로 표현 (k / 10^p) */
  function decStr(k, p) {
    if (p === 0) return String(k);
    const neg = k < 0; k = Math.abs(k);
    let s = String(k).padStart(p + 1, '0');
    let r = s.slice(0, s.length - p) + '.' + s.slice(s.length - p);
    r = r.replace(/0+$/, '').replace(/\.$/, '');
    return (neg ? '-' : '') + r;
  }

  const P = {
    int: (q, v, extra = {}) => Object.assign({ t: 'int', q, v, a: fmt(v) }, extra),
    frac: (q, n, d, extra = {}) => { const [rn, rd] = red(n, d); return Object.assign({ t: 'frac', q, v: [rn, rd], a: fracHTML(rn, rd), at: fracText(rn, rd) }, extra); },
    dec: (q, str, extra = {}) => Object.assign({ t: 'dec', q, v: Number(str), a: str }, extra),
    list: (q, arr, extra = {}) => Object.assign({ t: 'list', q, v: arr.slice().sort((a, b) => a - b), a: arr.slice().sort((a, b) => a - b).join(', ') }, extra),
    choice: (q, opts, idx, extra = {}) => Object.assign({ t: 'choice', q, opts, v: idx, a: opts[idx] }, extra)
  };

  /* ---------- 도형 SVG ---------- */
  const svgWrap = (inner, w = 220, h = 130) => `<svg class="fig" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">${inner}</svg>`;
  const lbl = (x, y, t, anchor = 'middle') => `<text x="${x}" y="${y}" text-anchor="${anchor}" font-size="13" fill="currentColor">${t}</text>`;
  const shapeStyle = 'fill="rgba(20,82,240,.08)" stroke="currentColor" stroke-width="1.6"';
  const dash = 'stroke="currentColor" stroke-width="1.2" stroke-dasharray="4 3"';
  const fig = {
    rect: (a, b) => svgWrap(`<rect x="40" y="20" width="140" height="80" ${shapeStyle}/>${lbl(110, 118, a + 'cm')}${lbl(196, 64, b + 'cm', 'start')}`, 240),
    square: (a) => svgWrap(`<rect x="70" y="15" width="90" height="90" ${shapeStyle}/>${lbl(115, 122, a + 'cm')}`),
    para: (b, h) => svgWrap(`<polygon points="40,100 160,100 200,25 80,25" ${shapeStyle}/><line x1="80" y1="25" x2="80" y2="100" ${dash}/><rect x="80" y="92" width="8" height="8" fill="none" stroke="currentColor"/>${lbl(100, 118, b + 'cm')}${lbl(74, 66, h + 'cm', 'end')}`),
    tri: (b, h) => svgWrap(`<polygon points="40,100 190,100 120,20" ${shapeStyle}/><line x1="120" y1="20" x2="120" y2="100" ${dash}/><rect x="120" y="92" width="8" height="8" fill="none" stroke="currentColor"/>${lbl(115, 118, b + 'cm')}${lbl(126, 66, h + 'cm', 'start')}`),
    rhombus: (p, q) => svgWrap(`<polygon points="110,10 180,62 110,114 40,62" ${shapeStyle}/><line x1="40" y1="62" x2="180" y2="62" ${dash}/><line x1="110" y1="10" x2="110" y2="114" ${dash}/>${lbl(150, 56, p + 'cm')}${lbl(116, 92, q + 'cm', 'start')}`, 220, 124),
    trap: (a, b, h) => svgWrap(`<polygon points="40,100 200,100 160,25 80,25" ${shapeStyle}/><line x1="80" y1="25" x2="80" y2="100" ${dash}/><rect x="80" y="92" width="8" height="8" fill="none" stroke="currentColor"/>${lbl(120, 18, a + 'cm')}${lbl(120, 118, b + 'cm')}${lbl(74, 66, h + 'cm', 'end')}`, 240),
    box: (a, b, c) => svgWrap(`<polygon points="40,50 140,50 140,110 40,110" ${shapeStyle}/><polygon points="40,50 70,22 170,22 140,50" ${shapeStyle}/><polygon points="140,50 170,22 170,82 140,110" ${shapeStyle}/><line x1="40" y1="110" x2="70" y2="82" ${dash}/><line x1="70" y1="82" x2="170" y2="82" ${dash}/><line x1="70" y1="82" x2="70" y2="22" ${dash}/>${lbl(90, 126, a + 'cm')}${lbl(178, 56, c + 'cm', 'start')}${lbl(156, 32, b + 'cm', 'start')}`, 240, 132)
  };

  const table = (head1, head2, xs, ys) => `<table class="qt"><tr><th>${head1}</th>${xs.map(x => `<td>${x}</td>`).join('')}</tr><tr><th>${head2}</th>${ys.map(y => `<td>${y}</td>`).join('')}</tr></table>`;

  /* ---------- 단원별 생성기 ---------- */
  const G = {};

  /* 1. 자연수의 혼합 계산 */
  G.u1 = (lv) => {
    const basic = [
      () => { const a = ri(10, 60), b = ri(2, 9), c = ri(2, 12); return P.int(`${a} + ${b} × ${c}`, a + b * c); },
      () => { const b = ri(2, 9), c = ri(2, 9), a = b * c + ri(1, 40); return P.int(`${a} − ${b} × ${c}`, a - b * c); },
      () => { const c = ri(2, 9), b = c * ri(2, 9), a = ri(2, 12); return P.int(`${a} × ${b} ÷ ${c}`, a * b / c); },
      () => { const b = ri(2, 9), a = b * ri(2, 12), c = ri(2, 9); return P.int(`${a} ÷ ${b} × ${c}`, a / b * c); },
      () => { const a = ri(3, 30), b = ri(3, 30), c = ri(2, 9); return P.int(`(${a} + ${b}) × ${c}`, (a + b) * c); },
      () => { const c = ri(2, 20), b = c + ri(2, 20), a = ri(2, 9); return P.int(`${a} × (${b} − ${c})`, a * (b - c)); },
      () => { const c = ri(2, 9), b = c * ri(2, 9), a = ri(10, 50), d = ri(1, a); return P.int(`${a} + ${b} ÷ ${c} − ${d}`, a + b / c - d); },
      () => { const c = ri(2, 9), k = ri(2, 9), b = ri(2, 30), a = b + c * k, d = ri(1, 30); return P.int(`(${a} − ${b}) ÷ ${c} + ${d}`, k + d); },
      () => { const price = ri(8, 25) * 100, n = ri(2, 4), bread = ri(10, 30) * 100; const pay = Math.ceil((price * n + bread) / 1000) * 1000 + pick([1000, 2000, 5000]); return P.int(`${fmt(price)}원짜리 우유 ${n}개와 ${fmt(bread)}원짜리 빵 1개를 사고 ${fmt(pay)}원을 냈습니다. 거스름돈은 얼마일까요?`, pay - price * n - bread, { unit: '원', word: true }); }
    ];
    const adv = [
      () => { const e = ri(2, 6), d = e * ri(1, 3), bc = ri(2, 9), c = ri(2, 20), b = c + bc, a = ri(5, 40); return P.int(`${a} + (${b} − ${c}) × ${d} ÷ ${e}`, a + bc * d / e); },
      () => { const c = ri(2, 9), k = ri(2, 9), a = ri(5, c * k - 1 > 5 ? c * k - 1 : 6), b = c * k - a, d = ri(2, 9), e = ri(1, k * d - 1); if (b <= 0) return null; return P.int(`(${a} + ${b}) ÷ ${c} × ${d} − ${e}`, k * d - e); },
      () => { const e = ri(2, 9), k = ri(2, 9), c = ri(1, e * k - 1), d = e * k - c, a = ri(3, 12), b = ri(3, 12); if (a * b <= k) return null; return P.int(`${a} × ${b} − (${c} + ${d}) ÷ ${e}`, a * b - k); },
      () => { const e = ri(2, 9), d = e * ri(2, 9), b = ri(2, 9), c = ri(2, 9), a = b * c + ri(1, 30); return P.int(`${a} − ${b} × ${c} + ${d} ÷ ${e}`, a - b * c + d / e); },
      () => { const n = ri(3, 6), each = ri(3, 9), tot = n * each + ri(5, 30); const friends = pick([2, 3, 4]); const left = tot - n * each; if (left % friends) return null; return P.int(`사탕이 ${tot}개 있습니다. 동생 ${n}명에게 ${each}개씩 주고, 남은 사탕을 친구 ${friends}명이 똑같이 나누어 가지면 한 명이 몇 개씩 가질까요?`, left / friends, { unit: '개', word: true }); }
    ];
    return (lv === 2 ? pick([...adv, ...adv, ...basic]) : pick(basic))();
  };

  /* 2. 약수와 배수 */
  const divisors = (n) => { const r = []; for (let i = 1; i <= n; i++) if (n % i === 0) r.push(i); return r; };
  G.u2 = (lv) => {
    const pair = () => { const g = ri(2, 9); let x = ri(2, 7), y = ri(2, 7); while (y === x || gcd(x, y) !== 1) { x = ri(2, 7); y = ri(2, 7); } return [g * x, g * y, g]; };
    const basic = [
      () => { const n = pick([12, 16, 18, 20, 24, 28, 30, 32, 36, 40, 42, 45, 48]); return P.list(`${n}의 약수를 모두 쓰세요.`, divisors(n), { hint: '쉼표로 구분해 쓰세요' }); },
      () => { const n = pick([18, 24, 30, 36, 40, 48, 50, 60, 72]); return P.int(`${n}의 약수는 모두 몇 개일까요?`, divisors(n).length, { unit: '개' }); },
      () => { const [a, b, g] = pair(); return P.int(`${a}와(과) ${b}의 최대공약수를 구하세요.`, g); },
      () => { const [a, b] = pair(); return P.int(`${a}와(과) ${b}의 최소공배수를 구하세요.`, lcm(a, b)); },
      () => { const n = ri(3, 9), k = ri(4, 12); return P.int(`${n}의 배수 중 ${k}번째로 작은 수는 무엇일까요?`, n * k); },
      () => { const a = ri(3, 9), ok = Math.random() < .5, b = ok ? a * ri(3, 12) : a * ri(3, 12) + ri(1, a - 1); return P.choice(`${b}은(는) ${a}의 배수일까요?`, ['예', '아니요'], ok ? 0 : 1); },
      () => { const n = pick([6, 8, 9, 12, 15]); const lo = ri(1, 3) * 10; const cnt = Math.floor(99 / n) - Math.floor((lo - 1) / n); return P.int(`${lo}부터 99까지의 수 중에서 ${n}의 배수는 모두 몇 개일까요?`, cnt, { unit: '개' }); }
    ];
    const adv = [
      () => { const [a, b, g] = pair(); return P.int(`쿠키 ${a}개와 사탕 ${b}개를 최대한 많은 친구에게 남김없이 똑같이 나누어 주려고 합니다. 몇 명에게 나누어 줄 수 있을까요?`, g, { unit: '명', word: true }); },
      () => { const x = pick([4, 5, 6, 8, 9, 10, 12, 15]); let y = pick([6, 8, 9, 10, 12, 15, 20]); if (x === y) y = x + 2; return P.int(`버스 두 대가 오전 7시에 함께 출발했습니다. 한 버스는 ${x}분마다, 다른 버스는 ${y}분마다 출발합니다. 다음에 두 버스가 함께 출발하는 것은 몇 분 후일까요?`, lcm(x, y), { unit: '분 후', word: true }); },
      () => { const g = ri(3, 8); let x = ri(2, 5), y = ri(2, 5); while (x === y || gcd(x, y) !== 1) { x = ri(2, 5); y = ri(2, 5); } const a = g * x, b = g * y; return P.int(`가로 ${a}cm, 세로 ${b}cm인 직사각형 종이를 남는 부분 없이 가장 큰 정사각형 여러 개로 자르려고 합니다. 정사각형의 한 변은 몇 cm일까요?`, g, { unit: 'cm', word: true }); },
      () => { const [a, b] = pair(); const l = lcm(a, b); return P.int(`${a}와(과) ${b}의 공배수 중에서 200보다 작은 수는 모두 몇 개일까요?`, Math.floor(199 / l), { unit: '개' }); }
    ];
    return (lv === 2 ? pick([...adv, ...adv, ...basic]) : pick(basic))();
  };

  /* 3. 규칙과 대응 */
  G.u3 = (lv) => {
    const basic = [
      () => { const k = ri(2, 9), xs = [1, 2, 3, 4], q = ri(6, 15); return P.int(`표를 보고 □가 ${q}일 때 △의 값을 구하세요.${table('□', '△', xs, xs.map(x => x * k))}`, q * k); },
      () => { const k = ri(3, 20), xs = [1, 2, 3, 4], q = ri(8, 30); return P.int(`표를 보고 □가 ${q}일 때 △의 값을 구하세요.${table('□', '△', xs, xs.map(x => x + k))}`, q + k); },
      () => { const k = ri(2, 9); const xs = [1, 2, 3, 4]; return P.int(`□와 △ 사이의 대응 관계를 식으로 나타내면 △ = □ × ? 입니다. ?에 알맞은 수를 구하세요.${table('□', '△', xs, xs.map(x => x * k))}`, k); },
      () => { const items = pick([['의자', '다리', 4], ['세발자전거', '바퀴', 3], ['오징어', '다리', 10], ['문어', '다리', 8], ['육각형', '꼭짓점', 6]]); const n = ri(5, 15); return P.int(`${items[0]} 1개의 ${items[1]}는 ${items[2]}개입니다. ${items[0]} ${n}개의 ${items[1]}는 모두 몇 개일까요?`, n * items[2], { unit: '개', word: true }); },
      () => { const diff = ri(25, 35), kid = ri(10, 12), y = ri(15, 25); return P.int(`엄마는 ${kid + diff}살, 아이는 ${kid}살입니다. 아이가 ${y}살이 되면 엄마는 몇 살이 될까요?`, y + diff, { unit: '살', word: true }); }
    ];
    const adv = [
      () => { const k = ri(2, 5), c = ri(1, 6), xs = [1, 2, 3, 4], q = ri(8, 20); return P.int(`표를 보고 □가 ${q}일 때 △의 값을 구하세요.${table('□', '△', xs, xs.map(x => x * k + c))}`, q * k + c); },
      () => { const k = ri(2, 6), y = k * ri(8, 20); return P.int(`△ = □ × ${k}인 대응 관계가 있습니다. △가 ${y}일 때 □는 얼마일까요?`, y / k); },
      () => { const n = ri(6, 20); return P.int(`성냥개비로 정사각형을 옆으로 이어 붙여 만듭니다. 정사각형 1개에 4개, 2개에 7개, 3개에 10개가 필요합니다. 정사각형 ${n}개를 만들려면 성냥개비가 몇 개 필요할까요?`, 3 * n + 1, { unit: '개', word: true }); },
      () => { const cut = ri(5, 15); return P.int(`긴 리본을 한 번 자르면 2도막, 두 번 자르면 3도막이 됩니다. ${cut}번 자르면 몇 도막이 될까요?`, cut + 1, { unit: '도막', word: true }); }
    ];
    return (lv === 2 ? pick([...adv, ...adv, ...basic]) : pick(basic))();
  };

  /* 4. 약분과 통분 */
  const properCoprime = (maxD = 12) => { let d = ri(3, maxD), n = ri(1, d - 1); while (gcd(n, d) !== 1) { d = ri(3, maxD); n = ri(1, d - 1); } return [n, d]; };
  G.u4 = (lv) => {
    const basic = [
      () => { const [n, d] = properCoprime(); const g = ri(2, 6); return P.frac(`${F(n * g, d * g)}을(를) 기약분수로 나타내세요.`, n, d); },
      () => { const [n, d] = properCoprime(9); const m = ri(2, 5); return P.int(`${F(n, d)}과(와) 크기가 같은 분수 중 분모가 ${d * m}인 분수의 분자는 얼마일까요?`, n * m); },
      () => { let d1 = ri(2, 9), d2 = ri(2, 12); while (d1 === d2) d2 = ri(2, 12); const n1 = ri(1, d1 - 1), n2 = ri(1, d2 - 1); return P.int(`${F(n1, d1)}과(와) ${F(n2, d2)}를 분모의 최소공배수로 통분하면 공통분모는 얼마일까요?`, lcm(d1, d2)); },
      () => { let a = properCoprime(), b = properCoprime(); while (a[0] * b[1] === b[0] * a[1]) b = properCoprime(); const cmp = a[0] * b[1] > b[0] * a[1] ? 0 : 1; return P.choice(`두 분수의 크기를 비교하세요. ${F(a[0], a[1])} ○ ${F(b[0], b[1])}`, ['&gt;', '&lt;'], cmp); },
      () => { const opts = [[1, 2], [1, 4], [3, 4], [1, 5], [2, 5], [3, 5], [4, 5], [1, 20], [3, 20], [7, 20], [1, 25], [6, 25]]; const [n, d] = pick(opts); const v = n / d; return P.dec(`${F(n, d)}을(를) 소수로 나타내세요.`, String(+v.toFixed(3))); },
      () => { const k = pick([2, 4, 5, 6, 8, 25, 75, 35, 45]); const p = k < 10 ? 1 : 2; const s = decStr(k, p); return P.frac(`${s}를 기약분수로 나타내세요.`, k, Math.pow(10, p)); }
    ];
    const adv = [
      () => { const [n, d] = properCoprime(9); const g = ri(3, 8); return P.int(`${F(n, d)}의 분모와 분자에 같은 수를 곱해 분모와 분자의 합이 ${(n + d) * g}인 분수를 만들었습니다. 이 분수의 분모는 얼마일까요?`, d * g); },
      () => { const d = pick([6, 8, 9, 10, 12, 15]); const cnt = [...Array(d - 1)].map((_, i) => i + 1).filter(i => gcd(i, d) === 1).length; return P.int(`분모가 ${d}인 진분수 중에서 기약분수는 모두 몇 개일까요?`, cnt, { unit: '개' }); },
      () => { const a = properCoprime(8), b = properCoprime(8), c = properCoprime(8); const arr = [a, b, c].map(x => x[0] / x[1]); if (new Set(arr).size < 3) return null; const mx = arr.indexOf(Math.max(...arr)); return P.choice(`가장 큰 분수를 고르세요.`, [F(...a), F(...b), F(...c)], mx); },
      () => { const d = pick([4, 5, 8, 10]); const n = ri(1, d - 1); if (gcd(n, d) !== 1) return null; const dec = +(n / d).toFixed(3); const other = +(dec + pick([-0.05, 0.05, -0.1, 0.1])).toFixed(3); if (other <= 0 || other >= 1) return null; return P.choice(`두 수의 크기를 비교하세요. ${F(n, d)} ○ ${other}`, ['&gt;', '&lt;'], n / d > other ? 0 : 1); }
    ];
    return (lv === 2 ? pick([...adv, ...adv, ...basic]) : pick(basic))();
  };

  /* 5. 분수의 덧셈과 뺄셈 */
  G.u5 = (lv) => {
    const two = () => { let a = properCoprime(10), b = properCoprime(10); while (a[1] === b[1]) b = properCoprime(10); return [a, b]; };
    const basic = [
      () => { const [a, b] = two(); return P.frac(`${F(...a)} + ${F(...b)}`, a[0] * b[1] + b[0] * a[1], a[1] * b[1]); },
      () => { let [a, b] = two(); if (a[0] * b[1] < b[0] * a[1]) [a, b] = [b, a]; return P.frac(`${F(...a)} − ${F(...b)}`, a[0] * b[1] - b[0] * a[1], a[1] * b[1]); },
      () => { const [a, b] = two(); const w1 = ri(1, 4), w2 = ri(1, 4); const [n1, d1] = mixedToImproper(w1, ...a), [n2, d2] = mixedToImproper(w2, ...b); return P.frac(`${M(w1, ...a)} + ${M(w2, ...b)}`, n1 * d2 + n2 * d1, d1 * d2); },
      () => { let [a, b] = two(); if (a[0] * b[1] < b[0] * a[1]) [a, b] = [b, a]; const w1 = ri(3, 6), w2 = ri(1, w1 - 1); const [n1, d1] = mixedToImproper(w1, ...a), [n2, d2] = mixedToImproper(w2, ...b); return P.frac(`${M(w1, ...a)} − ${M(w2, ...b)}`, n1 * d2 - n2 * d1, d1 * d2); }
    ];
    const adv = [
      () => { let [a, b] = two(); if (a[0] * b[1] > b[0] * a[1]) [a, b] = [b, a]; if (a[0] * b[1] === b[0] * a[1]) return null; const w1 = ri(3, 6), w2 = ri(1, w1 - 1); const [n1, d1] = mixedToImproper(w1, ...a), [n2, d2] = mixedToImproper(w2, ...b); return P.frac(`${M(w1, ...a)} − ${M(w2, ...b)}`, n1 * d2 - n2 * d1, d1 * d2, { tag: '받아내림' }); },
      () => { const a = properCoprime(6), b = properCoprime(6), c = properCoprime(6); const d = a[1] * b[1] * c[1]; const n = a[0] * b[1] * c[1] + b[0] * a[1] * c[1] - c[0] * a[1] * b[1]; if (n <= 0) return null; return P.frac(`${F(...a)} + ${F(...b)} − ${F(...c)}`, n, d); },
      () => { const a = properCoprime(8), b = properCoprime(8); if (a[1] === b[1]) return null; return P.frac(`우유를 어제는 ${F(...a)} L, 오늘은 ${F(...b)} L 마셨습니다. 이틀 동안 마신 우유는 모두 몇 L일까요?`, a[0] * b[1] + b[0] * a[1], a[1] * b[1], { unit: 'L', word: true }); },
      () => { const a = properCoprime(8), b = properCoprime(8); if (a[1] === b[1]) return null; const w = ri(2, 4); const [n1, d1] = mixedToImproper(w, ...a); const n = n1 * b[1] - b[0] * d1; if (n <= 0) return null; return P.frac(`길이가 ${M(w, ...a)} m인 리본에서 ${F(...b)} m를 잘라 썼습니다. 남은 리본은 몇 m일까요?`, n, d1 * b[1], { unit: 'm', word: true }); }
    ];
    return (lv === 2 ? pick([...adv, ...adv, ...basic]) : pick(basic))();
  };

  /* 6. 다각형의 둘레와 넓이 */
  G.u6 = (lv) => {
    const basic = [
      () => { const a = ri(4, 20), b = ri(3, 15); return P.int(`직사각형의 넓이를 구하세요.`, a * b, { unit: 'cm²', fig: fig.rect(a, b) }); },
      () => { const a = ri(4, 20), b = ri(3, 15); return P.int(`직사각형의 둘레를 구하세요.`, 2 * (a + b), { unit: 'cm', fig: fig.rect(a, b) }); },
      () => { const a = ri(3, 15); return P.int(`정사각형의 넓이를 구하세요.`, a * a, { unit: 'cm²', fig: fig.square(a) }); },
      () => { const b = ri(4, 16), h = ri(3, 12); return P.int(`평행사변형의 넓이를 구하세요.`, b * h, { unit: 'cm²', fig: fig.para(b, h) }); },
      () => { let b = ri(4, 16), h = ri(3, 12); if ((b * h) % 2) b++; return P.int(`삼각형의 넓이를 구하세요.`, b * h / 2, { unit: 'cm²', fig: fig.tri(b, h) }); },
      () => { let p = ri(4, 16), q = ri(4, 14); if ((p * q) % 2) p++; return P.int(`마름모의 넓이를 구하세요.`, p * q / 2, { unit: 'cm²', fig: fig.rhombus(p, q) }); },
      () => { let a = ri(3, 9), b = a + ri(2, 8), h = ri(3, 10); if (((a + b) * h) % 2) h++; return P.int(`사다리꼴의 넓이를 구하세요.`, (a + b) * h / 2, { unit: 'cm²', fig: fig.trap(a, b, h) }); },
      () => { const n = ri(5, 10), a = ri(3, 15); const names = { 5: '정오각형', 6: '정육각형', 7: '정칠각형', 8: '정팔각형', 9: '정구각형', 10: '정십각형' }; return P.int(`한 변이 ${a}cm인 ${names[n]}의 둘레를 구하세요.`, n * a, { unit: 'cm' }); }
    ];
    const adv = [
      () => { const b = ri(4, 16), h = ri(3, 12); return P.int(`넓이가 ${b * h}cm²이고 밑변이 ${b}cm인 평행사변형의 높이는 몇 cm일까요?`, h, { unit: 'cm' }); },
      () => { let b = ri(4, 16), h = ri(3, 12); if ((b * h) % 2) b++; return P.int(`넓이가 ${b * h / 2}cm²이고 높이가 ${h}cm인 삼각형의 밑변은 몇 cm일까요?`, b, { unit: 'cm' }); },
      () => { const a = ri(2, 9), b = ri(2, 9); return P.int(`가로 ${a}m, 세로 ${b}m인 직사각형의 넓이는 몇 cm²일까요?`, a * b * 10000, { unit: 'cm²' }); },
      () => { const a = ri(5, 20), per = 2 * (a + ri(3, 15)); const b = per / 2 - a; return P.int(`둘레가 ${per}cm이고 가로가 ${a}cm인 직사각형의 넓이를 구하세요.`, a * b, { unit: 'cm²' }); },
      () => { const s = ri(4, 12); return P.int(`둘레가 ${4 * s}cm인 정사각형의 넓이는 몇 cm²일까요?`, s * s, { unit: 'cm²' }); },
      () => { let a = ri(3, 9), b = a + ri(2, 8), h = ri(3, 10); if (((a + b) * h) % 2) h++; const area = (a + b) * h / 2; return P.int(`넓이가 ${area}cm², 윗변 ${a}cm, 아랫변 ${b}cm인 사다리꼴의 높이는 몇 cm일까요?`, h, { unit: 'cm' }); }
    ];
    return (lv === 2 ? pick([...adv, ...adv, ...basic]) : pick(basic))();
  };

  /* 7. 수의 범위와 어림하기 */
  const roundTo = (n, place, mode) => { const q = n / place; if (mode === 'up') return Math.ceil(q) * place; if (mode === 'down') return Math.floor(q) * place; return Math.round(q) * place; };
  G.u7 = (lv) => {
    const placeName = { 10: '십', 100: '백', 1000: '천' };
    const modeName = { up: '올림', down: '버림', round: '반올림' };
    const basic = [
      () => { const place = pick([10, 100, 1000]), mode = pick(['up', 'down', 'round']); let n = ri(place * 2, place * 99); if (n % place === 0) n += ri(1, place - 1); return P.int(`${fmt(n)}을(를) ${placeName[place]}의 자리까지 ${modeName[mode]}하여 나타내세요.`, roundTo(n, place, mode)); },
      () => { const k = ri(20, 60); const t = pick([['이상', k], ['초과', k + 1]]); return P.int(`${k} ${t[0]}인 자연수 중에서 가장 작은 수는 무엇일까요?`, t[1]); },
      () => { const k = ri(20, 60); const t = pick([['이하', k], ['미만', k - 1]]); return P.int(`${k} ${t[0]}인 자연수 중에서 가장 큰 수는 무엇일까요?`, t[1]); },
      () => { const lo = ri(20, 50), hi = lo + ri(4, 9); const kinds = pick([['이상', '이하', hi - lo + 1], ['이상', '미만', hi - lo], ['초과', '이하', hi - lo], ['초과', '미만', hi - lo - 1]]); return P.int(`${lo} ${kinds[0]} ${hi} ${kinds[1]}인 자연수는 모두 몇 개일까요?`, kinds[2], { unit: '개' }); },
      () => { const lo = ri(30, 60), hi = lo + ri(5, 10); const cands = shuffle([lo - 1, lo, hi, hi + 1, lo + 2]).slice(0, 4); if (!cands.some(c => c >= lo && c < hi)) return null; const ans = cands.filter(c => c >= lo && c < hi); if (ans.length !== 1) return null; return P.choice(`${lo} 이상 ${hi} 미만인 수를 고르세요.`, cands.map(String), cands.indexOf(ans[0])); }
    ];
    const adv = [
      () => { const cap = pick([8, 10, 12, 15, 25, 30, 45]); let n = ri(cap * 3, cap * 9); if (n % cap === 0) n++; return P.int(`학생 ${n}명이 모두 버스를 타려고 합니다. 버스 한 대에 ${cap}명씩 탈 수 있다면 버스는 적어도 몇 대 필요할까요?`, Math.ceil(n / cap), { unit: '대', word: true }); },
      () => { let n = ri(12, 98) * 1000 + ri(100, 999); return P.int(`동전 ${fmt(n)}원을 1,000원짜리 지폐로만 바꾸려고 합니다. 최대 얼마까지 바꿀 수 있을까요?`, Math.floor(n / 1000) * 1000, { unit: '원', word: true }); },
      () => { const k = ri(130, 150); return P.choice(`놀이기구는 키가 ${k}cm 이상이어야 탈 수 있습니다. 키가 ${k}cm인 친구는 탈 수 있을까요?`, ['탈 수 있다', '탈 수 없다'], 0); },
      () => { const n = ri(100, 999) * 10 + 5; return P.int(`어떤 자연수를 십의 자리까지 반올림했더니 ${fmt(Math.round(n / 10) * 10)}이 되었습니다. 이 수가 될 수 있는 자연수 중 가장 작은 수는 무엇일까요?`, Math.round(n / 10) * 10 - 5); },
      () => { const box = pick([10, 12, 20]); let n = ri(box * 4, box * 15); if (n % box === 0) n += 3; return P.int(`사과 ${n}개를 한 상자에 ${box}개씩 담아 팔려고 합니다. 팔 수 있는 상자는 최대 몇 상자일까요?`, Math.floor(n / box), { unit: '상자', word: true }); }
    ];
    return (lv === 2 ? pick([...adv, ...adv, ...basic]) : pick(basic))();
  };

  /* 8. 분수의 곱셈 */
  G.u8 = (lv) => {
    const basic = [
      () => { const [n, d] = properCoprime(10), k = ri(2, 12); return P.frac(`${F(n, d)} × ${k}`, n * k, d); },
      () => { const [n, d] = properCoprime(10), k = ri(2, 12); return P.frac(`${k} × ${F(n, d)}`, n * k, d); },
      () => { const a = properCoprime(9), b = properCoprime(9); return P.frac(`${F(...a)} × ${F(...b)}`, a[0] * b[0], a[1] * b[1]); },
      () => { const a = properCoprime(8), w = ri(1, 3), k = ri(2, 6); const [n, d] = mixedToImproper(w, ...a); return P.frac(`${M(w, ...a)} × ${k}`, n * k, d); }
    ];
    const adv = [
      () => { const a = properCoprime(7), b = properCoprime(7), w1 = ri(1, 3), w2 = ri(1, 2); const [n1, d1] = mixedToImproper(w1, ...a), [n2, d2] = mixedToImproper(w2, ...b); return P.frac(`${M(w1, ...a)} × ${M(w2, ...b)}`, n1 * n2, d1 * d2); },
      () => { const a = properCoprime(6), b = properCoprime(6), c = properCoprime(6); return P.frac(`${F(...a)} × ${F(...b)} × ${F(...c)}`, a[0] * b[0] * c[0], a[1] * b[1] * c[1]); },
      () => { const d = pick([2, 3, 4, 5, 6]); const n = ri(1, d - 1); if (gcd(n, d) !== 1) return null; const tot = d * ri(4, 12); return P.int(`우리 반 학생 ${tot}명 중 ${F(n, d)}이 안경을 썼습니다. 안경을 쓴 학생은 몇 명일까요?`, tot * n / d, { unit: '명', word: true }); },
      () => { const a = properCoprime(6), b = properCoprime(6); return P.frac(`피자 ${F(...a)}판 중에서 ${F(...b)}을(를) 먹었습니다. 먹은 피자는 전체 한 판의 얼마일까요?`, a[0] * b[0], a[1] * b[1], { word: true }); }
    ];
    return (lv === 2 ? pick([...adv, ...adv, ...basic]) : pick(basic))();
  };

  /* 9. 합동과 대칭 */
  const polyName = { 3: '정삼각형', 4: '정사각형', 5: '정오각형', 6: '정육각형', 7: '정칠각형', 8: '정팔각형' };
  G.u9 = (lv) => {
    const basic = [
      () => { const n = ri(3, 8); return P.int(`${polyName[n]}의 대칭축은 모두 몇 개일까요?`, n, { unit: '개' }); },
      () => { const n = ri(3, 8); return P.choice(`${polyName[n]}은(는) 점대칭도형일까요?`, ['예', '아니요'], n % 2 === 0 ? 0 : 1); },
      () => { const a = ri(4, 15); return P.int(`삼각형 ㄱㄴㄷ과 삼각형 ㄹㅁㅂ은 서로 합동입니다. 변 ㄱㄴ이 ${a}cm일 때 대응변 ㄹㅁ은 몇 cm일까요?`, a, { unit: 'cm' }); },
      () => { const b = ri(30, 110); return P.int(`삼각형 ㄱㄴㄷ과 삼각형 ㄹㅁㅂ은 서로 합동입니다. 각 ㄱㄴㄷ이 ${b}°일 때 대응각 ㄹㅁㅂ은 몇 도일까요?`, b, { unit: '°' }); },
      () => { const d = ri(3, 12) * 2; return P.int(`선대칭도형에서 두 대응점을 이은 선분의 길이가 ${d}cm입니다. 한 대응점에서 대칭축까지의 거리는 몇 cm일까요?`, d / 2, { unit: 'cm' }); },
      () => { const shapes = [['정사각형', 0], ['평행사변형', 1], ['이등변삼각형', 2], ['직사각형', 0], ['마름모', 0], ['정삼각형', 2]]; const s = pick(shapes); return P.choice(`${s[0]}은(는) 어떤 도형일까요?`, ['선대칭도형이면서 점대칭도형', '점대칭도형만', '선대칭도형만'], s[1]); }
    ];
    const adv = [
      () => { const r = ri(3, 12); return P.int(`점대칭도형에서 한 대응점에서 대칭의 중심까지의 거리가 ${r}cm입니다. 두 대응점을 이은 선분의 길이는 몇 cm일까요?`, 2 * r, { unit: 'cm' }); },
      () => { const a = ri(30, 80), b = ri(30, 80); if (a + b >= 170) return null; return P.int(`서로 합동인 두 삼각형에서 한 삼각형의 두 각이 ${a}°, ${b}°입니다. 다른 삼각형에서 나머지 한 각의 대응각은 몇 도일까요?`, 180 - a - b, { unit: '°' }); },
      () => { const a = ri(4, 12), b = ri(4, 12), c = ri(4, 12); if (a + b <= c || a + c <= b || b + c <= a) return null; return P.int(`세 변이 ${a}cm, ${b}cm, ${c}cm인 삼각형과 합동인 삼각형의 둘레는 몇 cm일까요?`, a + b + c, { unit: 'cm' }); },
      () => { const n = pick([4, 6, 8]); const a = ri(3, 10); return P.int(`선대칭도형인 ${polyName[n]}의 한 변이 ${a}cm일 때, 둘레는 몇 cm일까요?`, n * a, { unit: 'cm' }); },
      () => { const s = ri(3, 9); return P.int(`정사각형의 대칭축 수와 정육각형의 대칭축 수의 합에 ${s}을(를) 곱하면 얼마일까요?`, (4 + 6) * s); }
    ];
    return (lv === 2 ? pick([...adv, ...adv, ...basic]) : pick(basic))();
  };

  /* 10. 소수의 곱셈 */
  G.u10 = (lv) => {
    const basic = [
      () => { const a = ri(11, 99), k = ri(2, 9); return P.dec(`${decStr(a, 1)} × ${k}`, decStr(a * k, 1)); },
      () => { const a = ri(11, 99), k = ri(2, 15); return P.dec(`${k} × ${decStr(a, 1)}`, decStr(a * k, 1)); },
      () => { const a = ri(1, 9), b = ri(1, 9); return P.dec(`${decStr(a, 1)} × ${decStr(b, 1)}`, decStr(a * b, 2)); },
      () => { const a = ri(11, 49), b = ri(2, 9); return P.dec(`${decStr(a, 1)} × ${decStr(b, 1)}`, decStr(a * b, 2)); },
      () => { const a = ri(101, 999), k = pick([10, 100, 1000]); const p = 2; return P.dec(`${decStr(a, p)} × ${fmt(k)}`, decStr(a * k, p)); }
    ];
    const adv = [
      () => { const a = ri(11, 99), b = ri(11, 99); return P.dec(`${decStr(a, 1)} × ${decStr(b, 2)}`, decStr(a * b, 3)); },
      () => { const a = ri(101, 999); const m = pick([[1, 1], [1, 2]]); return P.dec(`${decStr(a, 1)} × ${decStr(m[0], m[1])}`, decStr(a * m[0], 1 + m[1])); },
      () => { const l = ri(12, 25), n = ri(2, 6); return P.dec(`우유가 한 병에 ${decStr(l, 1)}L씩 들어 있습니다. ${n}병에 들어 있는 우유는 모두 몇 L일까요?`, decStr(l * n, 1), { unit: 'L', word: true }); },
      () => { const w = ri(12, 35), h = ri(5, 20); return P.dec(`가로 ${decStr(w, 1)}m, 세로 ${decStr(h, 1)}m인 직사각형 화단의 넓이는 몇 m²일까요?`, decStr(w * h, 2), { unit: 'm²', word: true }); },
      () => { const per = ri(12, 48), len = ri(2, 9) * 10 + 5; return P.dec(`1m의 무게가 ${decStr(per, 1)}kg인 철근이 있습니다. 이 철근 ${decStr(len, 1)}m의 무게는 몇 kg일까요?`, decStr(per * len, 2), { unit: 'kg', word: true }); }
    ];
    return (lv === 2 ? pick([...adv, ...adv, ...basic]) : pick(basic))();
  };

  /* 11. 직육면체 */
  G.u11 = (lv) => {
    const basic = [
      () => { const t = pick([['면', 6], ['모서리', 12], ['꼭짓점', 8]]); return P.int(`직육면체의 ${t[0]}은(는) 모두 몇 개일까요?`, t[1], { unit: '개' }); },
      () => { const t = pick([['보이지 않는 모서리', 3], ['보이는 모서리', 9], ['보이지 않는 면', 3], ['보이는 꼭짓점', 7], ['보이지 않는 꼭짓점', 1]]); return P.int(`직육면체의 겨냥도에서 ${t[0]}는 몇 개일까요?`, t[1], { unit: '개' }); },
      () => { const t = pick([['한 면과 수직인 면', 4], ['한 면과 평행한 면', 1], ['서로 평행한 면은 모두 몇 쌍', 3]]); return P.int(`직육면체에서 ${t[0]}${t[0].includes('쌍') ? '일까요?' : '은 몇 개일까요?'}`, t[1], { unit: t[0].includes('쌍') ? '쌍' : '개' }); },
      () => { const a = ri(2, 12); return P.int(`한 모서리가 ${a}cm인 정육면체의 모든 모서리 길이의 합은 몇 cm일까요?`, 12 * a, { unit: 'cm' }); },
      () => { const a = ri(3, 12), b = ri(2, 9), c = ri(2, 9); return P.int(`직육면체의 모든 모서리 길이의 합을 구하세요.`, 4 * (a + b + c), { unit: 'cm', fig: fig.box(a, b, c) }); }
    ];
    const adv = [
      () => { const a = ri(3, 15); return P.int(`모든 모서리 길이의 합이 ${12 * a}cm인 정육면체의 한 모서리는 몇 cm일까요?`, a, { unit: 'cm' }); },
      () => { const a = ri(3, 12), b = ri(2, 9), c = ri(2, 9); return P.int(`가로 ${a}cm, 세로 ${b}cm, 높이 ${c}cm인 직육면체에서 모든 모서리 길이의 합은 몇 cm일까요?`, 4 * (a + b + c), { unit: 'cm' }); },
      () => { const a = ri(3, 10), b = ri(2, 8), s = 4 * (a + b) + 4 * ri(2, 9); const c = s / 4 - a - b; return P.int(`모든 모서리 길이의 합이 ${s}cm이고 가로 ${a}cm, 세로 ${b}cm인 직육면체의 높이는 몇 cm일까요?`, c, { unit: 'cm' }); },
      () => { const a = ri(2, 9); return P.int(`한 모서리가 ${a}cm인 정육면체의 전개도에서 둘레(바깥 테두리)의 길이는 몇 cm일까요?`, 14 * a, { unit: 'cm' }); },
      () => { const a = ri(2, 8), b = ri(2, 8), c = ri(2, 8); return P.int(`가로 ${a}cm, 세로 ${b}cm, 높이 ${c}cm인 직육면체에서 넓이가 가장 넓은 면의 넓이는 몇 cm²일까요?`, Math.max(a * b, b * c, a * c), { unit: 'cm²' }); }
    ];
    return (lv === 2 ? pick([...adv, ...adv, ...basic]) : pick(basic))();
  };

  /* 12. 평균과 가능성 */
  G.u12 = (lv) => {
    const dataSet = (n, lo, hi) => { let arr; do { arr = Array.from({ length: n }, () => ri(lo, hi)); } while (arr.reduce((s, x) => s + x, 0) % n); return arr; };
    const basic = [
      () => { const n = ri(4, 5), arr = dataSet(n, 60, 100); return P.int(`수학 점수가 ${arr.join('점, ')}점입니다. 평균은 몇 점일까요?`, arr.reduce((s, x) => s + x, 0) / n, { unit: '점' }); },
      () => { const n = ri(4, 6), arr = dataSet(n, 5, 30); return P.int(`일주일 동안 읽은 책 쪽수가 ${arr.join(', ')}쪽입니다. 하루 평균 몇 쪽을 읽었을까요?`, arr.reduce((s, x) => s + x, 0) / n, { unit: '쪽' }); },
      () => { const n = ri(4, 5), avg = ri(70, 90), arr = Array.from({ length: n - 1 }, () => ri(avg - 15, avg + 10)); const miss = avg * n - arr.reduce((s, x) => s + x, 0); if (miss < 0 || miss > 100) return null; return P.int(`${n}번의 시험 점수 평균이 ${avg}점입니다. ${arr.join('점, ')}점이고 나머지 한 번의 점수는 몇 점일까요?`, miss, { unit: '점', word: true }); },
      () => { const t = pick([['흰 공만 5개 들어 있는 주머니에서 공 1개를 꺼낼 때 흰 공일 가능성', 1, 1], ['흰 공만 5개 들어 있는 주머니에서 공 1개를 꺼낼 때 검은 공일 가능성', 0, 1], ['동전 1개를 던질 때 그림 면이 나올 가능성', 1, 2], ['주사위를 굴릴 때 짝수가 나올 가능성', 1, 2], ['주사위를 굴릴 때 7이 나올 가능성', 0, 1], ['주사위를 굴릴 때 6 이하의 수가 나올 가능성', 1, 1]]); return P.choice(`${t[0]}을 수로 나타내세요.`, ['0', '1/2', '1'], t[1] === 0 ? 0 : (t[2] === 2 ? 1 : 2)); }
    ];
    const adv = [
      () => { const n = ri(4, 6), avg = ri(30, 60); const total = n * avg; return P.int(`${n}명의 몸무게 평균이 ${avg}kg입니다. ${n}명의 몸무게의 합은 몇 kg일까요?`, total, { unit: 'kg' }); },
      () => { const n = ri(4, 5), arr = dataSet(n, 60, 100); const avg = arr.reduce((s, x) => s + x, 0) / n; return P.int(`점수가 ${arr.join('점, ')}점입니다. 평균보다 높은 점수는 몇 개일까요?`, arr.filter(x => x > avg).length, { unit: '개' }); },
      () => { const n = ri(4, 5), avg = ri(20, 40), add = ri(avg + 5, avg + 30); const newAvg = (avg * n + add) / (n + 1); if (newAvg % 1) return null; return P.int(`${n}명의 평균 나이가 ${avg}살인 모임에 ${add}살인 사람이 새로 들어왔습니다. 전체 평균 나이는 몇 살일까요?`, newAvg, { unit: '살', word: true }); },
      () => { const t = pick([['1부터 10까지 수 카드 중 1장을 뽑을 때 홀수일 가능성', 1], ['빨간 공 3개, 파란 공 3개 중 1개를 꺼낼 때 빨간 공일 가능성', 1], ['내일 해가 동쪽에서 뜰 가능성', 2], ['1월 다음 달이 3월일 가능성', 0]]); return P.choice(`${t[0]}을 수로 나타내세요.`, ['0', '1/2', '1'], t[1]); }
    ];
    return (lv === 2 ? pick([...adv, ...adv, ...basic]) : pick(basic))();
  };

  /* 문제 생성: 중복을 피해 count개 */
  function generate(unitId, count, level) {
    const gen = G[unitId];
    const out = [], seen = new Set();
    let guard = 0;
    while (out.length < count && guard < count * 60) {
      guard++;
      let p;
      try { p = gen(level); } catch (e) { p = null; }
      if (!p) continue;
      if (seen.has(p.q)) continue;
      seen.add(p.q);
      p.unitId = unitId;
      p.id = Math.random().toString(36).slice(2, 9);
      out.push(p);
    }
    return out;
  }

  /* ---------- 답 확인 ---------- */
  function parseFrac(s) {
    s = String(s).trim().replace(/과|와|\+/g, ' ').replace(/\s+/g, ' ');
    if (!s) return null;
    let m;
    if ((m = s.match(/^(\d+)\s+(\d+)\s*\/\s*(\d+)$/))) { const w = +m[1], n = +m[2], d = +m[3]; if (!d) return null; return { n: w * d + n, d, w, pn: n, mixed: true }; }
    if ((m = s.match(/^(\d+)\s*\/\s*(\d+)$/))) { const n = +m[1], d = +m[2]; if (!d) return null; return { n, d, w: 0, pn: n, mixed: false }; }
    if ((m = s.match(/^(\d+)$/))) return { n: +m[1], d: 1, w: +m[1], pn: 0, mixed: false, whole: true };
    if ((m = s.match(/^(\d*\.\d+)$/))) { const parts = m[1].split('.'); const p = parts[1].length; const n = Math.round(parseFloat(m[1]) * Math.pow(10, p)); return { n, d: Math.pow(10, p), w: 0, pn: n, mixed: false, decimal: true }; }
    return null;
  }

  /* 반환: {ok:true} | {ok:false, msg?} */
  function check(p, input) {
    if (input === undefined || input === null || String(input).trim() === '') return { ok: false, empty: true };
    const s = String(input).trim();
    if (p.t === 'int') {
      const v = Number(s.replace(/[,\s]/g, '').replace(/[^\d.\-]/g, ''));
      return { ok: v === p.v };
    }
    if (p.t === 'dec') {
      const v = Number(s.replace(/[,\s]/g, ''));
      return { ok: Math.abs(v - p.v) < 1e-9 };
    }
    if (p.t === 'list') {
      const arr = s.split(/[^\d]+/).filter(Boolean).map(Number).sort((a, b) => a - b);
      return { ok: arr.length === p.v.length && arr.every((x, i) => x === p.v[i]) };
    }
    if (p.t === 'choice') return { ok: Number(s) === p.v };
    if (p.t === 'frac') {
      const f = parseFrac(s);
      if (!f) return { ok: false };
      const [vn, vd] = p.v;
      const equal = f.n * vd === vn * f.d;
      if (!equal) return { ok: false };
      if (f.decimal) return { ok: false, msg: '분수로 답해 주세요' };
      const pd = f.whole ? 1 : f.d;
      if (!f.whole && gcd(f.pn, pd) !== 1) return { ok: false, msg: '값은 맞아요! 기약분수로 약분해 볼까요?' };
      if (f.mixed && f.pn >= f.d) return { ok: false, msg: '값은 맞아요! 분수 부분을 진분수로 정리해 볼까요?' };
      return { ok: true, note: (!f.mixed && f.n > f.d && f.d !== 1) ? '대분수로 나타내면 더 좋아요' : '' };
    }
    return { ok: false };
  }

  /* 다른 학년 파일에서 쓰는 공통 도구 */
  const helpers = { ri, pick, gcd, lcm, red, shuffle, F, M, fracHTML, fracText, mixedToImproper, fmt, decStr, P, svgWrap, lbl, shapeStyle, dash, fig, table, properCoprime, divisors, roundTo };
  const register = (id, fn) => { G[id] = fn; };
  window.MathGen = { generate, check, fracHTML, F, M, gcd, red, parseFrac, generators: G, h: helpers, register };
})();
