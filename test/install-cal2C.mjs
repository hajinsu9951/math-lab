// 미적분Ⅱ C — LAB 182~186 (적분법·활용 5종) 전 계층 설치
import fs from 'node:fs';
const P = 'src/40-demos.js';
let s = fs.readFileSync(P, 'utf8');
if (s.includes('function substIntDemo')) throw new Error('이미 설치됨');
for (const n of ['substIntDemo','byPartsDemo','motionVecDemo','arcLenDemo','diffEqDemo'])
  if (s.includes('function ' + n + '(')) throw new Error('이름 충돌: ' + n);

{ const i = s.indexOf('const LABS=[');
  s = s.slice(0, i) + '\n' + fs.readFileSync('algO-demos.txt', 'utf8') + '\n' + s.slice(i); }

{ const key = ' build:inflectDemo}\n];';
  const i = s.indexOf(key);
  if (i < 0) throw new Error('LABS 끝 앵커 실패');
  s = s.slice(0, i) + ` build:inflectDemo},
{n:182,core:0,t:'“변수를 바꾸면 넓이도 바뀔까” 치환적분',q:'무엇을 함께 바꿔야 할까?',
 m:['치환적분','미분소','적분 구간'],a:['단위 환산','좌표 변환'],
 note:'식·구간·미분소 셋을 모두 바꿔야 합니다. dx = du/k 를 빠뜨리면 넓이가 정확히 k 배 어긋납니다.',
 build:substIntDemo},
{n:183,core:0,t:'“곱을 나누어 넘기기” 부분적분',q:'u 를 무엇으로 잡아야 쉬워질까?',
 m:['부분적분','도함수','적분 전략'],a:['신호 처리','기댓값 계산'],
 note:'∫u dv = uv − ∫v du. 미분하면 단순해지는 쪽을 u 로 잡아야 남은 적분이 쉬워집니다.',
 build:byPartsDemo},
{n:184,core:0,t:'“속력이 일정한데 가속도가 있다” 속도·가속도 벡터',q:'가속도는 빨라지는 정도일까?',
 m:['매개변수 미분','속도 벡터','가속도 벡터'],a:['위성 궤도','차량 주행 해석'],
 note:'가속도는 속도 벡터의 변화입니다. 등속 원운동에서는 크기가 그대로여도 방향이 계속 바뀝니다.',
 build:motionVecDemo},
{n:185,core:0,t:'“구부러진 길의 길이” 곡선의 길이',q:'자로 잴 수 없는 길이를 어떻게 구할까?',
 m:['곡선의 길이','정적분','근사'],a:['도로 설계','GPS 경로 길이'],
 note:'작은 빗변 √(Δx² + Δy²) 를 모두 더합니다. 조각을 늘리면 ∫√(1 + (y′)²)dx 에 다가갑니다.',
 build:arcLenDemo},
{n:186,core:0,t:'“변화율이 미래를 정한다” 미분방정식 맛보기',q:'규칙 하나로 곡선이 정해질까?',
 m:['미분방정식','기울기장','초기조건'],a:['인구 모형','감염병 예측'],
 note:'기울기장은 각 지점에서 갈 방향을 알려 줍니다. 규칙이 같아도 출발점이 다르면 다른 곡선이 됩니다.',
 build:diffEqDemo}
];` + s.slice(i + key.length); }

{ const m = s.match(/const PROBLEMS=(\{.*?\});/);
  const PR = JSON.parse(m[1]);
  PR['182'] = { sit: '∫f(2x)dx 를 계산하며 u = 2x 로 두고 구간만 [0, 2] 로 바꿨습니다. 답이 정확히 두 배가 나왔습니다.',
    ask: '무엇을 빠뜨렸을까? 변수를 바꿀 때 함께 바꿔야 하는 것은 몇 가지일까?' };
  PR['183'] = { sit: '∫x eˣ dx 를 부분적분으로 풀려는데, u 를 무엇으로 잡느냐에 따라 결과가 딴판입니다.',
    ask: 'u 를 고르는 기준은 무엇일까? 잘못 고르면 어떻게 될까?' };
  PR['184'] = { sit: '일정한 속력으로 원을 도는 위성이 있습니다. "속력이 안 변하니 가속도는 0"이라는 말이 나옵니다.',
    ask: '정말 가속도가 0 일까? 가속도는 무엇의 변화일까?' };
  PR['185'] = { sit: '구불구불한 산길의 길이를 지도에서 재려 합니다. 자로는 직선밖에 잴 수 없습니다.',
    ask: '곡선의 길이를 어떻게 구할까? 잘게 나누면 무엇이 보일까?' };
  PR['186'] = { sit: '감염병 예측 모형은 "지금 감염자 수에 비례해 늘어난다" 같은 변화율의 규칙으로 세워집니다.',
    ask: '규칙 하나만으로 미래 곡선이 정해질까? 무엇이 더 있어야 할까?' };
  s = s.replace(m[0], 'const PROBLEMS=' + JSON.stringify(PR) + ';');

  const i0 = s.indexOf('const MISSIONS=');
  const mm = s.slice(i0).match(/^const MISSIONS=\{[\s\S]*?\n\};/);
  const M = new Function('return ' + mm[0].slice('const MISSIONS='.length, -1))();

  M['182'] = [
   {t:'1분 자유 탐색 — k 를 바꿔 보세요. 위아래 두 그림의 가로 폭이 어떻게 달라지나요?'},
   {t:'오늘의 문제 — 「구간만 바꿔 계산」을 누르세요. 참값과 얼마나 어긋나나요?',
    re:'를 반영하지 않아',
    do:'① 버튼 누르기 ② 두 값의 비 계산 ③ k 와 견주기',
    hand:'∫₀^b f(kx)dx 에서 u = kx 로 두고 dx 를 u 로 바꿔 쓰기'},
   {t:'바로잡기 — 「du = k·dx 를 반영하기」를 누르세요. 두 값이 어떻게 되나요?',
    re:'두 넓이가 정확히 같아졌습니다',
    do:'① 버튼 누르기 ② 참값과 비교 ③ 1/k 가 어디에 붙는지 확인',
    hand:'dx = du/k 를 대입해 식을 다시 정리'},
   {t:'(k, 참값, 빠뜨린 값, 비) 를 여섯 줄 기록하세요 — 비가 늘 k 인가요?'},
   {t:'심화 — 세 가지를 함께: 치환할 때 바꿔야 하는 「식·구간·미분소」를 각각 예로 들어 정리하고, 부정적분에서는 왜 구간을 바꾸지 않아도 되는지 설명하세요.'}];

  M['183'] = [
   {t:'1분 자유 탐색 — 구간을 바꿔 보세요. 파란 넓이가 얼마나 빠르게 커지나요?'},
   {t:'오늘의 문제 — u 를 x 로 두는 쪽(좋은 선택)을 고르세요. 남은 적분이 어떻게 되나요?',
    re:'미분하면 사라지는 쪽을 u 로',
    do:'① 선택지에서 u = x 를 고르기 ② 막대 높이 비교 ③ 남은 적분의 모양 확인',
    hand:'u = x, dv = eˣdx 로 두고 uv − ∫v du 를 써 보기'},
   {t:'거꾸로 잡으면 — u 를 eˣ 로 두는 쪽을 고르세요. 어떻게 되나요?',
    re:'오히려 더 어려워졌습니다',
    do:'① 선택지에서 u = eˣ 를 고르기 ② 막대 높이 확인 ③ 남은 적분의 차수 확인',
    hand:'v = x²/2 가 되어 차수가 오르는 과정을 적기'},
   {t:'(선택, 남은 적분, 난이도, 정적분 값) 을 네 줄 기록하세요.'},
   {t:'심화 — 요령의 근거: 「미분하면 단순해지는 쪽을 u 로」라는 규칙을 ∫x²sin x dx, ∫ln x dx 두 예에 적용해 보고, 두 번 이상 부분적분해야 하는 경우도 다루세요.'}];

  M['184'] = [
   {t:'1분 자유 탐색 — 시각을 옮겨 보세요. 두 화살표가 어떻게 함께 움직이나요?'},
   {t:'오늘의 문제 — ②(등속 원운동)를 고르세요. 속력은 일정한데 가속도는 어떤가요?',
    re:'두 화살표가 수직입니다',
    do:'① 운동 ② 선택 ② 속력 값이 변하는지 확인 ③ v·a 값 확인',
    hand:'v = (−2sin t, 2cos t), a = (−2cos t, −2sin t) 의 내적을 계산'},
   {t:'떨어지는 동안 — ①(포물선)으로 되돌리고 시각을 3 쯤으로 올리세요.',
    re:'가속도는 그대로 아래쪽',
    do:'① 운동 ① 선택 ② 시각을 3 부근으로 ③ 가속도 화살표의 방향·크기 확인',
    hand:'y″ = −4.9 가 t 와 무관함을 확인'},
   {t:'(운동, t, 속력, |a|, v·a) 를 여섯 줄 기록하세요.'},
   {t:'심화 — 접선·법선 성분: 가속도를 「속력을 바꾸는 성분」과 「방향을 바꾸는 성분」으로 나누어 설명하고, 등속 원운동에서 앞 성분이 0 인 까닭을 v·a 로 보이세요.'}];

  M['185'] = [
   {t:'1분 자유 탐색 — 조각 수를 바꿔 보세요. 붉은 꺾은선이 곡선과 얼마나 붙나요?'},
   {t:'오늘의 문제 — 조각 수를 200 까지 늘리세요. 오차가 얼마나 줄어드나요?',
    re:'꺾은선이 곡선을 사실상 대신합니다',
    do:'① 조각 수를 최대로 ② 합과 정확한 값 비교 ③ 오차 칸 읽기',
    hand:'∫₀² √(1 + x²)dx 를 공식으로 계산해 화면 값과 대조'},
   {t:'조각이 적으면 — 조각 수를 3 으로 줄여 보세요. 길이가 어느 쪽으로 어긋나나요?',
    re:'곡선 안쪽을 가로질러',
    do:'① 조각 수를 3 으로 ② 꺾은선의 위치 확인 ③ 합이 정확한 값보다 작은지 확인',
    hand:'두 점을 잇는 선분이 곡선보다 짧은 이유를 설명'},
   {t:'(n, Δx, 합, 오차) 를 여섯 줄 기록하세요 — 오차는 어떤 규칙으로 줄어드나요?'},
   {t:'심화 — 공식의 유도: √(Δx² + Δy²) 에서 Δy = y′Δx 로 바꾸어 ∫√(1 + (y′)²)dx 를 유도하고, 매개변수 곡선의 길이 공식도 같은 방법으로 만들어 보세요.'}];

  M['186'] = [
   {t:'1분 자유 탐색 — 출발 값을 바꿔 보세요. 파란 곡선이 회색 선들을 따라가나요?'},
   {t:'오늘의 문제 — ②(y′ = 0.6y)를 고르세요. 6 초 뒤 값이 어떻게 되나요?',
    re:'폭발적으로 자랍니다',
    do:'① 규칙 ② 선택 ② t = 6 의 값 확인 ③ 곡선의 휘는 모양 보기',
    hand:'y′ = ky 의 해가 y = y₀e^{kt} 임을 확인하고 값을 계산'},
   {t:'한계가 있으면 — ③(로지스틱)을 고르세요. 성장이 어떻게 달라지나요?',
    re:'성장이 스스로 꺾입니다',
    do:'① 규칙 ③ 선택 ② 붉은 한계선 확인 ③ 곡선의 S 자 모양 보기',
    hand:'y 가 4 에 가까워질 때 y′ 이 0 으로 가는 것을 식으로 확인'},
   {t:'(규칙, 출발 값, t = 6 의 값) 을 여섯 줄 기록하세요 — 같은 규칙에서 출발점만 바꿔 보세요.'},
   {t:'심화 — 초기조건이 하나를 고른다: 같은 미분방정식의 해가 무수히 많고, 초기조건 하나가 그중 하나를 고른다는 것을 기울기장 그림으로 설명하세요. 감염병 모형(LAB 3)과도 이어 보세요.'}];

  s = s.slice(0, i0) + 'const MISSIONS=' + JSON.stringify(M, null, 1) + ';' + s.slice(i0 + mm[0].length);

  const PR2 = JSON.parse(s.match(/const PROBLEMS=(\{.*?\});/)[1]);
  const labsBlock = s.slice(s.indexOf('const LABS=['), s.indexOf('const PRINS='));
  let bad = 0;
  for (const k of ['182','183','184','185','186']) {
    const li = labsBlock.indexOf('{n:' + k + ',core:');
    const lab = li < 0 ? '' : labsBlock.slice(li, li + 900);
    const texts = M[k].map(x => [x.t, x.do, x.hand].filter(Boolean).join('\n')).join('\n')
      + '\n' + PR2[k].sit + '\n' + PR2[k].ask + '\n' + lab;
    M[k].forEach((x, ix) => { if (x.re && new RegExp(x.re).test(texts)) { console.log(`자기일치! LAB ${k} S${ix+1} — ${x.re}`); bad++; } });
  }
  if (bad) throw new Error('자기일치 ' + bad + '건');
}

/* PRINS */
{
  const key = s.match(/  link:'도함수의 부호\(LAB 134\)의 한 단계 위이며, 로지스틱 곡선\(LAB 3\)의 전환점과 이어집니다\.'\}\r?\n\];/);
  if (!key) throw new Error('PRINS 끝 앵커 실패');
  s = s.replace(key[0], `  link:'도함수의 부호(LAB 134)의 한 단계 위이며, 로지스틱 곡선(LAB 3)의 전환점과 이어집니다.'},

/* 182 치환적분 */
 {tex:[
   {t:'u=g(x) \\\\Rightarrow du=g\\\\!\\\\;'+"'"+'(x)dx', s:'변수를 바꾸면 <b>미분소도</b> 함께 바뀝니다.'},
   {t:'\\\\int_a^b f(kx)dx=\\\\frac1k\\\\int_{ka}^{kb} f(u)du', s:'구간과 1/k 가 <b>동시에</b> 나타납니다.'},
   {t:'\\\\text{식} \\\\cdot \\\\text{구간} \\\\cdot \\\\text{미분소} — \\\\text{셋을 함께}', s:'하나라도 빠뜨리면 <b>답이 배수만큼</b> 틀립니다.'}
  ],
  next:[
   {lv:'바로',   t:'계산 연습', d:'∫₀¹ cos(3x)dx 를 치환으로 계산하세요.'},
   {lv:'심화',   t:'복잡한 치환', d:'∫ x√(x²+1) dx 를 u = x²+1 로 풀어 보세요.'},
   {lv:'프로젝트', t:'좌표 변환', d:'극좌표로 바꿀 때 나타나는 야코비안이 왜 필요한지 조사하세요.'}
  ],
  eq:'∫f(kx)dx = (1/k)∫f(u)du',
  what:'치환에서 <b>가장 자주 빠뜨리는 것</b>을 두 그림의 넓이 차이로 드러내는 실험입니다.',
  probe:'미분소를 빠뜨린 값이 참값의 정확히 k 배가 됩니다 — 우연이 아닙니다.',
  link:'정적분(LAB 137)의 계산 기술이며, 사슬 규칙(LAB 179)의 역방향입니다.'},

/* 183 부분적분 */
 {tex:[
   {t:'\\\\int u\\\\,dv = uv-\\\\int v\\\\,du', s:'곱의 미분을 <b>거꾸로 쓴</b> 것입니다.'},
   {t:'u=x,\\\\ dv=e^{x}dx \\\\Rightarrow \\\\int xe^{x}dx=xe^{x}-\\\\int e^{x}dx', s:'남은 적분이 <b>더 쉬워졌습니다</b>.'},
   {t:'u=e^{x},\\\\ dv=x\\\\,dx \\\\Rightarrow \\\\int \\\\frac{x^{2}}{2}e^{x}dx', s:'거꾸로 잡으면 차수가 올라 <b>더 어려워집니다</b>.'}
  ],
  next:[
   {lv:'바로',   t:'계산 연습', d:'∫ x cos x dx 를 부분적분으로 구하세요.'},
   {lv:'심화',   t:'두 번 적용', d:'∫ x²eˣ dx 를 두 번 부분적분해 구하세요.'},
   {lv:'프로젝트', t:'기댓값 계산', d:'연속확률분포의 기댓값 계산에서 부분적분이 쓰이는 예를 찾으세요.'}
  ],
  eq:'∫u dv = uv − ∫v du',
  what:'적분의 <b>전략</b>을 고르는 실험입니다. 같은 도구도 잡는 법에 따라 결과가 갈립니다.',
  probe:'u 를 잘못 잡으면 남은 적분의 막대가 오히려 높아집니다.',
  link:'곱의 미분(LAB 179)의 역이며, 치환적분(LAB 182)과 함께 두 기둥입니다.'},

/* 184 속도·가속도 벡터 */
 {tex:[
   {t:'\\\\vec{v}=(x\\\\!\\\\;'+"'"+'(t),\\\\ y\\\\!\\\\;'+"'"+'(t)),\\\\qquad \\\\vec{a}=(x\\\\!\\\\;''(t),\\\\ y\\\\!\\\\;''(t))', s:'속도와 가속도는 <b>벡터</b>입니다 — 크기와 방향을 함께 가집니다.'},
   {t:'|\\\\vec{v}|\\\\ \\\\text{일정} \\\\Rightarrow \\\\vec{v}\\\\cdot\\\\vec{a}=0', s:'속력이 일정하면 가속도는 <b>속도에 수직</b>입니다.'},
   {t:'\\\\text{등속 원운동}:\\\\ |\\\\vec{a}|=\\\\frac{|\\\\vec{v}|^{2}}{r}\\\\ (\\\\text{중심 방향})', s:'가속도가 0 이 아닙니다 — <b>방향이 계속 바뀌기</b> 때문입니다.'}
  ],
  next:[
   {lv:'바로',   t:'내적 확인', d:'등속 원운동에서 여러 t 의 v·a 를 계산해 0 인지 확인하세요.'},
   {lv:'심화',   t:'성분 분해', d:'가속도를 접선 성분과 법선 성분으로 나누어 설명하세요.'},
   {lv:'프로젝트', t:'주행 해석', d:'차량의 코너링에서 느끼는 힘을 가속도 벡터로 설명하세요.'}
  ],
  eq:'a = v′ (벡터의 변화)',
  what:'「가속도 = 빨라지는 정도」라는 <b>흔한 오해</b>를 화살표 두 개로 바로잡는 실험입니다.',
  probe:'등속 원운동에서 속력은 그대로인데 v·a 가 0 — 방향만 바뀌고 있다는 뜻입니다.',
  link:'위치·속도·가속도(LAB 136)의 벡터판이며, 매개변수 미분(LAB 180)을 씁니다.'},

/* 185 곡선의 길이 */
 {tex:[
   {t:'\\\\Delta L=\\\\sqrt{(\\\\Delta x)^{2}+(\\\\Delta y)^{2}}', s:'작은 <b>빗변</b> 하나. 이것들을 모두 더합니다.'},
   {t:'\\\\Delta y\\\\approx y\\\\!\\\\;'+"'"+'\\\\Delta x \\\\Rightarrow \\\\Delta L\\\\approx\\\\sqrt{1+(y\\\\!\\\\;'+"'"+')^{2}}\\\\,\\\\Delta x', s:'Δx 를 묶어내면 <b>적분 꼴</b>이 드러납니다.'},
   {t:'L=\\\\int_a^b\\\\sqrt{1+(y\\\\!\\\\;'+"'"+')^{2}}\\\\,dx', s:'구부러진 길이를 <b>적분 하나</b>로 잽니다.'}
  ],
  next:[
   {lv:'바로',   t:'길이 계산', d:'y = 0.5x² 의 0 ≤ x ≤ 2 구간 길이를 구하세요.'},
   {lv:'심화',   t:'매개변수 곡선', d:'매개변수로 주어진 곡선의 길이 공식을 유도하세요.'},
   {lv:'프로젝트', t:'GPS 경로', d:'GPS 로 기록한 산책 경로의 실제 길이를 추정해 보세요.'}
  ],
  eq: "L = ∫√(1 + (y')²) dx",
  what:'적분의 정의(<b>잘게 나눠 더하기</b>)가 길이에도 그대로 통함을 확인하는 실험입니다.',
  probe:'조각이 적으면 꺾은선이 곡선 안쪽을 질러가 길이가 짧게 나옵니다.',
  link:'구분구적법(LAB 137)의 확장이며, 회전체(LAB 141)와 같은 계열입니다.'},

/* 186 미분방정식 */
 {tex:[
   {t:"y\\\\!\\\\;'=ky \\\\Rightarrow y=y_0e^{kt}", s:'<b>자기 크기에 비례</b>해 자라면 지수함수가 나옵니다.'},
   {t:"y\\\\!\\\\;'=ky\\\\!\\\\left(1-\\\\frac{y}{M}\\\\right)", s:'한계 M 이 있으면 성장이 <b>스스로 꺾입니다</b> — 로지스틱.'},
   {t:'\\\\text{일반해} + \\\\text{초기조건} \\\\Rightarrow \\\\text{유일한 해}', s:'규칙만으로는 곡선이 무수히 많습니다 — <b>출발점이 하나를 고릅니다</b>.'}
  ],
  next:[
   {lv:'바로',   t:'해 확인', d:'y′ = 0.6y, y(0) = 0.5 의 해를 식으로 쓰고 t = 6 의 값을 구하세요.'},
   {lv:'심화',   t:'로지스틱 풀기', d:'변수분리로 로지스틱 방정식을 풀어 보세요.'},
   {lv:'프로젝트', t:'감염병 모형', d:'실제 감염 자료에 지수 모형과 로지스틱 모형을 각각 맞춰 비교하세요.'}
  ],
  eq: "y' = f(y) → 기울기장을 따라간 곡선",
  what:'미분방정식을 <b>풀기 전에 그림으로</b> 만나는 실험입니다. 기울기장이 해의 모양을 미리 보여 줍니다.',
  probe:'같은 규칙이라도 출발점을 바꾸면 다른 곡선이 그려집니다 — 초기조건의 역할입니다.',
  link:'정보 확산(LAB 3)의 수학적 뼈대이며, 지수 성장(LAB 11)의 일반화입니다.'}
];`);
}

/* THUMBS */
{
  const key = s.match(/   '곡선이 휘는 방향을 바꾸는 변곡점 그림'\)\r?\n\];/);
  if (!key) throw new Error('THUMBS 끝 앵커 실패');
  s = s.replace(key[0], `   '곡선이 휘는 방향을 바꾸는 변곡점 그림'),

 svg(\`<path d="M20 34 C34 18 46 18 60 34 L60 44 L20 44 Z" fill="\${TC.blue}" opacity=".25"/>
   <path d="M20 76 C40 58 60 58 100 76 L100 82 L20 82 Z" fill="\${TC.teal}" opacity=".25"/>
   <text x="86" y="30" font-size="8" font-weight="800" fill="\${TC.ink3}">x</text>
   <text x="30" y="62" font-size="8" font-weight="800" fill="\${TC.ink3}">u = kx</text>\`,
   '같은 넓이를 두 변수로 본 그림'),

 svg(\`<rect x="24" y="30" width="30" height="36" fill="\${TC.ink3}" opacity=".25"/>
   <rect x="64" y="52" width="30" height="14" fill="\${TC.teal}" opacity=".5"/>
   <text x="39" y="78" font-size="8" font-weight="800" fill="\${TC.ink3}" text-anchor="middle">원래</text>
   <text x="79" y="78" font-size="8" font-weight="800" fill="\${TC.teal}" text-anchor="middle">남은 적분</text>\`,
   '부분적분 뒤 남은 적분이 작아진 그림'),

 svg(\`<circle cx="60" cy="44" r="26" fill="none" stroke="\${TC.blue}" stroke-width="2"/>
   <circle cx="86" cy="44" r="4" fill="\${TC.ink3}"/>
   <line x1="86" y1="44" x2="86" y2="20" stroke="\${TC.teal}" stroke-width="2.6"/>
   <line x1="86" y1="44" x2="62" y2="44" stroke="\${TC.rose}" stroke-width="2.6"/>
   <text x="60" y="80" font-size="8" font-weight="800" fill="\${TC.ink3}" text-anchor="middle">v ⊥ a</text>\`,
   '원운동에서 속도와 가속도가 수직인 그림'),

 svg(\`<path d="M20 72 C40 68 60 48 96 16" stroke="\${TC.blue}" stroke-width="2" fill="none" opacity=".4"/>
   <path d="M20 72 L44 66 L66 48 L84 32 L96 16" stroke="\${TC.rose}" stroke-width="2.2" fill="none"/>
   <circle cx="44" cy="66" r="2.6" fill="\${TC.rose}"/><circle cx="66" cy="48" r="2.6" fill="\${TC.rose}"/>
   <circle cx="84" cy="32" r="2.6" fill="\${TC.rose}"/>
   <text x="60" y="84" font-size="8" font-weight="800" fill="\${TC.ink3}" text-anchor="middle">빗변의 합</text>\`,
   '곡선을 선분으로 이어 길이를 재는 그림'),

 svg(\`<line x1="26" y1="62" x2="36" y2="56" stroke="\${TC.ink3}" stroke-width="1.2" opacity=".5"/>
   <line x1="46" y1="58" x2="56" y2="50" stroke="\${TC.ink3}" stroke-width="1.2" opacity=".5"/>
   <line x1="66" y1="52" x2="76" y2="40" stroke="\${TC.ink3}" stroke-width="1.2" opacity=".5"/>
   <line x1="26" y1="42" x2="36" y2="34" stroke="\${TC.ink3}" stroke-width="1.2" opacity=".5"/>
   <line x1="46" y1="36" x2="56" y2="26" stroke="\${TC.ink3}" stroke-width="1.2" opacity=".5"/>
   <path d="M22 68 C42 60 60 40 96 14" stroke="\${TC.blue}" stroke-width="2.6" fill="none"/>
   <text x="60" y="82" font-size="8" font-weight="800" fill="\${TC.ink3}" text-anchor="middle">기울기장</text>\`,
   '기울기장을 따라간 해 곡선 그림')
];`);
}
fs.writeFileSync(P, s);

/* LABCAT */
{
  const C = 'src/55-catalog.js';
  let c = fs.readFileSync(C, 'utf8');
  const m = c.match(/(\{k:'cal2',g:'미적분Ⅱ · 변곡점'[^}]*\})(\r?\n\];)/);
  if (!m) throw new Error('LABCAT 끝 앵커 실패');
  c = c.replace(m[0], m[1] + `,
{k:'cal2',g:'미적분Ⅱ · 치환적분',b:'구간만 바꾸고 dx = du/k 를 반영하지 않아 값이 k 배로 나옴'},
{k:'cal2',g:'미적분Ⅱ · 부분적분',b:'uv 항의 부호를 반대로 두어 결과가 부호까지 뒤집힘'},
{k:'cal2',g:'미적분Ⅱ · 속도·가속도 벡터',b:'속력이 일정하면 가속도가 0 이라고 표시함'},
{k:'cal2',g:'미적분Ⅱ · 곡선의 길이',b:'세로 변화만 더해(빗변이 아니라) 길이가 실제보다 짧게 나옴'},
{k:'cal2',g:'미적분Ⅱ · 미분방정식',b:'초기조건을 무시하고 해를 하나로 고정해 다른 출발점도 같은 곡선으로 그림'}` + m[2]);
  fs.writeFileSync(C, c);
}
console.log('LAB 182~186 (적분법·활용 5종) 설치 완료');
