// 고급 미적분 A — LAB 262~266 (수렴판정·p급수·수렴반경·다변수 극한·등고선) 전 계층 설치
import fs from 'node:fs';
const P = 'src/40-demos.js';
let s = fs.readFileSync(P, 'utf8');
const NAMES = ['ratioTestDemo', 'pSeriesDemo', 'radiusDemo', 'pathLimitDemo', 'contourDemo'];
if (s.includes('function ratioTestDemo')) throw new Error('이미 설치됨');
for (const n of NAMES) if (s.includes('function ' + n + '(')) throw new Error('이름 충돌: ' + n);

{ const i = s.indexOf('const LABS=[');
  s = s.slice(0, i) + '\n' + fs.readFileSync('algAE-demos.txt', 'utf8') + '\n' + s.slice(i); }

{ const key = ' build:pcaDemo}\n];';
  const i = s.indexOf(key);
  if (i < 0) throw new Error('LABS 끝 앵커 실패');
  s = s.slice(0, i) + ` build:pcaDemo},
{n:262,core:0,t:'“비를 보면 안다” 수렴판정',q:'더해 보지 않고 수렴을 알 수 있을까?',
 m:['비판정법','근판정법','등비 비교'],a:['수치 계산','알고리즘 종료 조건'],
 note:'이웃한 두 항의 비가 1 보다 작으면 수렴, 크면 발산입니다. 비가 정확히 1 이면 판정법은 침묵합니다.',
 build:ratioTestDemo},
{n:263,core:0,t:'“0 으로 가는데도 무한” p-급수와 적분판정',q:'항이 0 으로 가면 합도 유한할까?',
 m:['p-급수','적분판정','필요조건'],a:['알고리즘 복잡도','물리 모형'],
 note:'항이 0 으로 가는 것은 수렴의 필요조건일 뿐입니다. 넓이가 유한한지가 합의 운명을 정합니다.',
 build:pSeriesDemo},
{n:264,core:0,t:'“항을 늘려도 나빠진다” 수렴반경',q:'근사는 어디까지 통할까?',
 m:['멱급수','수렴반경','근사 오차'],a:['수치 근사','계산기 내부'],
 note:'반경 안에서는 항을 늘릴수록 참값에 붙지만, 반경 밖에서는 늘릴수록 멀어집니다.',
 build:radiusDemo},
{n:265,core:0,t:'“어느 길로 가느냐에 따라” 다변수 극한',q:'가까이 가면 값이 정해질까?',
 m:['다변수 극한','경로 의존','존재 판정'],a:['수치 안정성','최적화 지형'],
 note:'한 변수에서는 길이 둘뿐이지만 두 변수에서는 무한히 많습니다. 모든 길에서 같아야 극한이 있습니다.',
 build:pathLimitDemo},
{n:266,core:0,t:'“촘촘한 곳이 가파른 곳” 등고선 읽기',q:'지도의 등고선은 무엇을 말할까?',
 m:['등위선','기울기 벡터','이차형식'],a:['손실 함수의 지형','지형 해석'],
 note:'등고선 간격이 좁을수록 기울기가 큽니다. ab − c²/4 의 부호가 등고선 모양을 가릅니다.',
 build:contourDemo}
];` + s.slice(i + key.length);
}

{
  const m = s.match(/const PROBLEMS=(\{.*?\});/);
  if (!m) throw new Error('PROBLEMS 앵커 실패');
  const PR = JSON.parse(m[1]);
  PR['262'] = { sit: '무한히 더하는 식을 만났습니다. 컴퓨터로 백만 항을 더해 봐도 수렴인지 확신이 서지 않습니다.',
    ask: '더해 보지 않고 판정할 방법이 있을까? 그 방법이 통하지 않는 경우는 언제일까?' };
  PR['263'] = { sit: '1 + 1/2 + 1/3 + ⋯ 은 항이 0 으로 가는데도 끝없이 커진다고 합니다. 1 + 1/4 + 1/9 + ⋯ 은 유한하다고 합니다.',
    ask: '무엇이 두 급수를 가를까? 항의 크기만으로는 왜 부족할까?' };
  PR['264'] = { sit: '계산기가 쓰는 근사식에 x = 2 를 넣었더니 항을 늘릴수록 값이 점점 이상해집니다.',
    ask: '항을 늘리면 언제나 정확해지는 것이 아닐까? 통하는 범위는 어떻게 정할까?' };
  PR['265'] = { sit: '두 변수 함수에서 원점으로 다가가는데, 가로축을 따라가면 0 이고 대각선을 따라가면 0.5 가 나옵니다.',
    ask: '그러면 원점에서의 극한은 얼마일까? 애초에 있기는 할까?' };
  PR['266'] = { sit: '등산 지도를 보니 어떤 곳은 등고선이 빽빽하고 어떤 곳은 성깁니다.',
    ask: '지도만 보고 어디가 가파른지 알 수 있을까? 그 「가파름」을 수로 말할 수 있을까?' };
  s = s.replace(m[0], 'const PROBLEMS=' + JSON.stringify(PR) + ';');

  const i0 = s.indexOf('const MISSIONS=');
  const mm = s.slice(i0).match(/^const MISSIONS=\{[\s\S]*?\n\};/);
  if (!mm) throw new Error('MISSIONS 앵커 실패');
  const M = new Function('return ' + mm[0].slice('const MISSIONS='.length, -1))();

  M['262'] = [
   {t:'1분 자유 탐색 — r 을 움직여 보세요. 부분합 곡선이 어떻게 달라지나요?'},
   {t:'오늘의 문제 — 항의 수를 40 까지 올리세요. 부분합이 어떻게 되나요?',
    re:'부분합이 한 값에 멈춰 섭니다',
    do:'① 항의 수를 40 으로 ② 곡선의 끝을 보기 ③ 비 값 확인',
    hand:'등비급수의 합 공식으로 극한값을 계산'},
   {t:'경계에서 — r 을 1.00 으로 맞추세요. 판정법이 무엇을 말하나요?',
    re:'판정법이 아무 말도 못 합니다',
    do:'① r 을 1.00 으로 ② p 를 0 과 −2 로 바꿔 보기 ③ 부분합 비교',
    hand:'p = 0 과 p = −2 일 때 각각 수렴·발산을 따져 보기'},
   {t:'(r, p, 비, 부분합) 을 여섯 줄 기록하세요.'},
   {t:'심화 — 왜 통하나: 비가 r < 1 로 수렴하면 어떤 R (r < R < 1) 에 대해 유한한 항 뒤부터 aₙ < C·Rⁿ 임을 보이고, 등비급수와의 비교로 수렴을 설명하세요.'}];

  M['263'] = [
   {t:'1분 자유 탐색 — p 를 움직여 보세요. 파랑과 주황이 어떻게 갈리나요?'},
   {t:'오늘의 문제 — p 를 1.0 으로 두고 항의 수를 300 까지 올리세요.',
    re:'항이 0 으로 가는데도 합은 계속 자랍니다',
    do:'① p 를 1.0 으로 ② 항의 수를 300 으로 ③ 마지막 항의 크기 확인',
    hand:'1/n 을 로그로 어림해 합이 log N 만큼 자람을 확인'},
   {t:'울타리가 생기면 — p 를 2.0 으로 올리세요. 부분합이 어떻게 되나요?',
    re:'적분이 급수를 가둔 것입니다',
    do:'① p 를 2.0 으로 ② 붉은 점선 확인 ③ 항의 수를 늘려도 안 넘는지 보기',
    hand:'∫1/x² dx 를 계산해 울타리 값과 견주기'},
   {t:'(p, 항 수, 부분합, 적분값) 을 여섯 줄 기록하세요.'},
   {t:'심화 — 적분판정: 감소하는 양의 함수 f 에 대해 ∫f 가 유한하면 Σf(n) 도 유한함을 계단 넓이 그림으로 설명하고, p = 1 이 경계가 되는 까닭을 밝히세요.'}];

  M['264'] = [
   {t:'1분 자유 탐색 — 항의 수를 늘려 보세요. 파란 곡선이 어디까지 따라가나요?'},
   {t:'오늘의 문제 — x 를 0.50 에 두고 항을 16 까지 늘리세요. 오차가 어떻게 되나요?',
    re:'참값에 딱 붙습니다',
    do:'① x 를 0.50 으로 ② 항을 16 으로 ③ 오차 값 읽기',
    hand:'등비급수의 나머지 항 xⁿ/(1−x) 를 어림'},
   {t:'반경 밖에서 — x 를 1.20 으로 옮기세요. 항을 늘리면 어떻게 되나요?',
    re:'항을 늘릴수록 오히려 멀어집니다',
    do:'① x 를 1.20 으로 ② 항을 4 → 16 으로 늘려 보기 ③ 오차 변화 보기',
    hand:'1.2ⁿ 이 커지는 것을 계산해 확인'},
   {t:'(x, 항 수, 부분합, 참값, 오차) 를 여섯 줄 기록하세요.'},
   {t:'심화 — 경계에서: x = 1 과 x = −1 에서 각각 무슨 일이 생기는지 부분합을 직접 써서 조사하고, 「반경 안에서는 수렴, 밖에서는 발산, 경계는 따로 따진다」를 정리하세요.'}];

  M['265'] = [
   {t:'1분 자유 탐색 — 기울기를 움직여 보세요. 색과 값이 어떻게 달라지나요?'},
   {t:'오늘의 문제 — 기울기를 1.0 으로 맞추세요. 가로축 길과 값이 같나요?',
    re:'다가가는 값이 달라졌습니다',
    do:'① 기울기를 1.0 으로 ② 이 길의 값 읽기 ③ m = 0 과 비교',
    hand:'m/(1+m²) 에 m = 0, 1 을 넣어 계산'},
   {t:'더 가까이 — 거리를 0.06 까지 줄이세요. 값이 달라지나요?',
    re:'값이 꿈쩍하지 않습니다',
    do:'① 거리를 0.06 으로 ② f 값 확인 ③ 거리를 더 줄여 보기',
    hand:'y = x 를 대입해 f 가 거리와 무관함을 보이기'},
   {t:'(m, 거리, f 값) 을 여섯 줄 기록하세요.'},
   {t:'심화 — 극한의 정의로: 「모든 경로에서 같은 값」이 아니라 「원점 둘레 어디에서나 같은 값」이 진짜 조건입니다. 극좌표 x = r cos θ, y = r sin θ 로 바꾸어 f 가 θ 에만 달려 있음을 보이세요.'}];

  M['266'] = [
   {t:'1분 자유 탐색 — 점을 옮겨 보세요. 초록 화살표의 길이가 어떻게 달라지나요?'},
   {t:'오늘의 문제 — 점을 (2, 2) 로 옮기세요. 기울기의 크기가 얼마인가요?',
    re:'등고선이 촘촘한 자리에 왔습니다',
    do:'① x 를 2 로 ② y 를 2 로 ③ 기울기 크기 읽기',
    hand:'∂f/∂x = 2ax + cy 에 값을 넣어 계산'},
   {t:'모양이 바뀐다 — y² 의 계수 b 를 −2 로 내리세요. 등고선이 어떤 모양인가요?',
    re:'등고선이 쌍곡선 모양입니다',
    do:'① b 를 −2 로 ② 파랑·붉은 등고선 보기 ③ ab − c²/4 계산해 보기',
    hand:'f = x² − 2y² 의 등고선 식을 직접 정리'},
   {t:'(계수, 점, 값, 기울기 크기) 를 여섯 줄 기록하세요.'},
   {t:'심화 — 이차형식의 분류: ab − c²/4 의 부호에 따라 등고선이 타원·쌍곡선·평행선이 됨을 보이고, 이것이 헤세 행렬의 행렬식과 같은 값임을 확인하세요.'}];

  s = s.slice(0, i0) + 'const MISSIONS=' + JSON.stringify(M, null, 1) + ';' + s.slice(i0 + mm[0].length);

  const PR2 = JSON.parse(s.match(/const PROBLEMS=(\{.*?\});/)[1]);
  const labsBlock = s.slice(s.indexOf('const LABS=['), s.indexOf('const THUMBS ='));
  const demoSrc = fs.readFileSync('algAE-demos.txt', 'utf8');
  let bad = 0;
  ['262', '263', '264', '265', '266'].forEach((k, ki) => {
    const li = labsBlock.indexOf('{n:' + k + ',core:');
    const lab = li < 0 ? '' : labsBlock.slice(li, li + 900);
    const texts = M[k].map(x => [x.t, x.do, x.hand].filter(Boolean).join('\n')).join('\n')
      + '\n' + PR2[k].sit + '\n' + PR2[k].ask + '\n' + lab;
    const d0 = demoSrc.indexOf('function ' + NAMES[ki] + '(');
    const d1 = ki + 1 < NAMES.length ? demoSrc.indexOf('function ' + NAMES[ki + 1] + '(') : demoSrc.length;
    const body = demoSrc.slice(d0, d1);
    M[k].forEach((x, ix) => {
      if (!x.re) return;
      if (new RegExp(x.re).test(texts)) { console.log(`자기일치! LAB ${k} S${ix + 1} — ${x.re}`); bad++; }
      const c = body.split(x.re).length - 1;
      if (c !== 1) { console.log(`데모 본문 등장 ${c} 회! LAB ${k} S${ix + 1} — ${x.re}`); bad++; }
    });
  });
  if (bad) throw new Error('감사 ' + bad + '건');
}

/* PRINS */
{
  const key = s.match(/  link:'고윳값\(LAB 249\)의 대표 응용이며, 기계학습의 전처리로 이어집니다\.'\}\r?\n\];/);
  if (!key) throw new Error('PRINS 끝 앵커 실패');
  s = s.replace(key[0], `  link:'고윳값(LAB 249)의 대표 응용이며, 기계학습의 전처리로 이어집니다.'},

{tex:[
   {t:'\\\\lim_{n\\\\to\\\\infty}\\\\left|\\\\frac{a_{n+1}}{a_n}\\\\right|=L', s:'이웃한 두 항의 <b>비</b>를 봅니다.'},
   {t:'L<1 \\\\Rightarrow \\\\text{수렴},\\\\qquad L>1 \\\\Rightarrow \\\\text{발산}', s:'등비급수와 견주어 판정합니다.'},
   {t:'L=1 \\\\Rightarrow \\\\text{판정 불가}', s:'경계에서는 <b>다른 잣대</b>가 필요합니다.'}
  ],
  next:[
   {lv:'바로',   t:'비 구하기', d:'몇 가지 급수의 비를 직접 계산하세요.'},
   {lv:'심화',   t:'경계 조사', d:'L = 1 인 예를 수렴·발산 각각 찾으세요.'},
   {lv:'프로젝트', t:'종료 조건', d:'반복 계산을 언제 멈출지 판정법으로 정하세요.'}
  ],
  eq:'L < 1 수렴 · L > 1 발산 · L = 1 판정 불가',
  what:'무한을 <b>더해 보지 않고</b> 판정하는 실험입니다.',
  probe:'r 을 1 에 맞추면 p 에 따라 결과가 갈립니다.',
  link:'등비수열의 수렴 조건(LAB 173)을 일반 급수로 넓힙니다.'},

{tex:[
   {t:'\\\\sum_{n=1}^{\\\\infty}\\\\frac{1}{n^{p}}', s:'p 가 <b>운명을 가릅니다</b>.'},
   {t:'\\\\int_{1}^{\\\\infty}\\\\frac{dx}{x^{p}}<\\\\infty \\\\iff p>1', s:'넓이가 유한할 조건입니다.'},
   {t:'a_n\\\\to 0 \\\\nRightarrow \\\\sum a_n<\\\\infty', s:'항이 0 으로 가는 것은 <b>필요조건일 뿐</b>입니다.'}
  ],
  next:[
   {lv:'바로',   t:'경계 찾기', d:'p 를 바꿔 가며 갈리는 지점을 찾으세요.'},
   {lv:'심화',   t:'적분판정', d:'계단 넓이로 급수를 위아래에서 가두세요.'},
   {lv:'프로젝트', t:'복잡도와', d:'알고리즘의 반복 횟수 합을 p-급수로 어림하세요.'}
  ],
  eq:'Σ 1/nᵖ 은 p > 1 일 때만 수렴',
  what:'「0 으로 간다」와 「합이 유한하다」가 <b>다른 말</b>임을 확인합니다.',
  probe:'p = 1 에서는 항이 0 으로 가는데도 합이 계속 자랍니다.',
  link:'조화급수(LAB 102)의 판정 근거이며, 적분과 급수를 잇습니다.'},

{tex:[
   {t:'\\\\frac{1}{1-x}=\\\\sum_{n=0}^{\\\\infty}x^{n}\\\\quad(|x|<1)', s:'괄호 안의 조건이 <b>수렴반경</b>입니다.'},
   {t:'R=\\\\lim_{n\\\\to\\\\infty}\\\\left|\\\\frac{a_n}{a_{n+1}}\\\\right|', s:'반경은 계수의 비로 구합니다.'},
   {t:'|x|>R \\\\Rightarrow \\\\text{항을 늘릴수록 발산}', s:'밖에서는 더할수록 <b>나빠집니다</b>.'}
  ],
  next:[
   {lv:'바로',   t:'오차 재기', d:'반경 안팎에서 오차 변화를 견주세요.'},
   {lv:'심화',   t:'경계 조사', d:'x = 1, −1 에서 무슨 일이 생기는지 보세요.'},
   {lv:'프로젝트', t:'근사 설계', d:'원하는 정확도에 필요한 항 수를 정하세요.'}
  ],
  eq:'|x| < R 에서만 수렴',
  what:'모든 근사에 붙어 있는 <b>유효 범위</b>를 눈으로 보는 실험입니다.',
  probe:'x 를 1 밖으로 옮기면 항을 늘릴수록 오차가 커집니다.',
  link:'테일러 근사(LAB 23)에 반드시 따라와야 할 조건입니다.'},

{tex:[
   {t:'f(x,y)=\\\\frac{xy}{x^{2}+y^{2}}', s:'원점에서 <b>정의되지 않는</b> 함수입니다.'},
   {t:'y=mx \\\\Rightarrow f=\\\\frac{m}{1+m^{2}}', s:'값이 <b>기울기에만</b> 달려 있습니다.'},
   {t:'\\\\text{경로마다 값이 다르다} \\\\Rightarrow \\\\text{극한 없음}', s:'하나라도 다르면 극한이 <b>없습니다</b>.'}
  ],
  next:[
   {lv:'바로',   t:'두 경로 비교', d:'m = 0 과 m = 1 의 값을 견주세요.'},
   {lv:'심화',   t:'극좌표로', d:'r, θ 로 바꾸어 θ 에만 달림을 보이세요.'},
   {lv:'프로젝트', t:'존재하는 예', d:'극한이 존재하는 다변수 함수를 만들어 보세요.'}
  ],
  eq:'y = mx 위에서 f = m / (1 + m²)',
  what:'변수가 둘이면 <b>가까움의 방향이 무한히 많다</b>는 것을 확인합니다.',
  probe:'거리를 아무리 줄여도 값이 그대로입니다.',
  link:'좌극한·우극한(LAB 127)을 평면으로 넓힌 자리입니다.'},

{tex:[
   {t:'f(x,y)=c \\\\ \\\\text{를 만족하는 점들} = \\\\text{등고선}', s:'같은 값을 잇는 <b>선</b>입니다.'},
   {t:'\\\\nabla f=\\\\left(\\\\frac{\\\\partial f}{\\\\partial x},\\\\ \\\\frac{\\\\partial f}{\\\\partial y}\\\\right)', s:'기울기 벡터의 <b>크기</b>가 가파름입니다.'},
   {t:'ab-\\\\frac{c^{2}}{4}>0 \\\\Rightarrow \\\\text{타원},\\\\quad <0 \\\\Rightarrow \\\\text{쌍곡선}', s:'부호가 <b>지형의 모양</b>을 가릅니다.'}
  ],
  next:[
   {lv:'바로',   t:'가파른 곳', d:'기울기가 가장 큰 자리를 찾으세요.'},
   {lv:'심화',   t:'모양 분류', d:'계수로 등고선 모양을 미리 판정하세요.'},
   {lv:'프로젝트', t:'손실 지형', d:'학습 손실 함수의 등고선을 그려 해석하세요.'}
  ],
  eq:'|∇f| 가 클수록 등고선이 촘촘하다',
  what:'함수의 <b>지형</b>을 한 장의 그림으로 읽는 실험입니다.',
  probe:'점을 바깥으로 옮길수록 화살표가 길어집니다.',
  link:'경사하강법(LAB 06)이 딛고 서 있는 그림입니다.'}
];`);
}

/* THUMBS */
{
  const key = s.match(/   '길게 늘어선 점들과 그 방향을 따르는 축'\)\r?\n\];/);
  if (!key) throw new Error('THUMBS 끝 앵커 실패');
  s = s.replace(key[0], `   '길게 늘어선 점들과 그 방향을 따르는 축'),

 svg(\`<path d="M18 74 C40 44 60 34 104 30" stroke="\${TC.blue}" stroke-width="2.2" fill="none"/>
   <line x1="14" y1="30" x2="108" y2="30" stroke="\${TC.rose}" stroke-width="1.2" stroke-dasharray="4 3"/>
   <g fill="\${TC.teal}" opacity=".7">
   <rect x="22" y="60" width="6" height="18"/><rect x="34" y="68" width="6" height="10"/>
   <rect x="46" y="72" width="6" height="6"/><rect x="58" y="75" width="6" height="3"/></g>
   <text x="60" y="94" font-size="8" font-weight="800" fill="\${TC.ink3}" text-anchor="middle">r &lt; 1</text>\`,
   '항이 빠르게 작아지며 한 값에 멈추는 부분합'),

 svg(\`<path d="M16 76 C40 62 62 46 106 20" stroke="\${TC.blue}" stroke-width="2.2" fill="none"/>
   <path d="M16 78 C42 68 66 56 106 34" stroke="\${TC.amber || TC.rose}" stroke-width="1.5" fill="none" stroke-dasharray="4 3"/>
   <line x1="12" y1="80" x2="110" y2="80" stroke="\${TC.ink3}" stroke-width="1" opacity=".5"/>
   <text x="60" y="94" font-size="8" font-weight="800" fill="\${TC.ink3}" text-anchor="middle">p = 1</text>\`,
   '끝없이 자라는 부분합과 적분 곡선'),

 svg(\`<rect x="34" y="14" width="52" height="66" fill="\${TC.blue}" opacity=".08"/>
   <line x1="34" y1="14" x2="34" y2="80" stroke="\${TC.rose}" stroke-width="1.2" stroke-dasharray="4 3"/>
   <line x1="86" y1="14" x2="86" y2="80" stroke="\${TC.rose}" stroke-width="1.2" stroke-dasharray="4 3"/>
   <path d="M20 72 C44 66 60 48 76 22" stroke="\${TC.ink3}" stroke-width="2" fill="none"/>
   <path d="M20 74 C44 68 62 52 92 62" stroke="\${TC.blue}" stroke-width="1.8" fill="none"/>
   <text x="60" y="94" font-size="8" font-weight="800" fill="\${TC.ink3}" text-anchor="middle">|x| &lt; 1</text>\`,
   '수렴반경 띠 안에서만 겹치는 두 곡선'),

 svg(\`<circle cx="60" cy="46" r="30" fill="\${TC.blue}" opacity=".10"/>
   <line x1="60" y1="46" x2="98" y2="46" stroke="\${TC.teal}" stroke-width="2"/>
   <line x1="60" y1="46" x2="88" y2="18" stroke="\${TC.rose}" stroke-width="2"/>
   <line x1="60" y1="46" x2="86" y2="70" stroke="\${TC.ink3}" stroke-width="1.6" opacity=".6"/>
   <circle cx="60" cy="46" r="3.4" fill="\${TC.ink3}"/>
   <text x="60" y="92" font-size="8" font-weight="800" fill="\${TC.ink3}" text-anchor="middle">길마다 다른 값</text>\`,
   '한 점으로 모이는 서로 다른 세 경로'),

 svg(\`<g fill="none" stroke="\${TC.blue}" stroke-width="1.3" opacity=".8">
   <ellipse cx="60" cy="46" rx="9" ry="6"/><ellipse cx="60" cy="46" rx="18" ry="12"/>
   <ellipse cx="60" cy="46" rx="29" ry="19"/><ellipse cx="60" cy="46" rx="42" ry="28"/></g>
   <line x1="60" y1="46" x2="92" y2="34" stroke="\${TC.teal}" stroke-width="2.4"/>
   <circle cx="60" cy="46" r="3" fill="\${TC.ink3}"/>
   <text x="60" y="92" font-size="8" font-weight="800" fill="\${TC.ink3}" text-anchor="middle">∇f</text>\`,
   '겹겹의 등고선과 바깥을 향한 기울기 화살표')
];`);
}

new Function(s);
fs.writeFileSync(P, s);

{
  const C = 'src/55-catalog.js';
  let c = fs.readFileSync(C, 'utf8');
  const m = c.match(/(\{k:'xalg',g:'고급 대수 · 주성분'[^}]*\})(\r?\n\];)/);
  if (!m) throw new Error('LABCAT 끝 앵커 실패');
  c = c.replace(m[0], m[1] + `,
{k:'xcal',g:'고급 미적분 · 수렴판정',b:'극한이 1 인 경계에서도 수렴이라 판정해 발산하는 급수를 통과시킴'},
{k:'xcal',g:'고급 미적분 · p-급수',b:'항이 0 에 가까우면 수렴이라 표시해 조화급수를 수렴으로 봄'},
{k:'xcal',g:'고급 미적분 · 수렴반경',b:'수렴반경을 표시하지 않아 밖에서도 근사가 맞는 것처럼 보임'},
{k:'xcal',g:'고급 미적분 · 다변수 극한',b:'x축·y축 두 방향만 재 그 둘이 같으면 극한이 있다고 판정함'},
{k:'xcal',g:'고급 미적분 · 등고선',b:'등고선 간격을 일정하게 그려 가파른 곳과 완만한 곳이 구분 안 됨'}` + m[2]);
  fs.writeFileSync(C, c);
}
console.log('LAB 262~266 (고급 미적분 A · 5종) 설치 완료');
