// 고급 미적분 B — LAB 267~271 (편미분·접평면·그래디언트·안장점·라그랑주) 전 계층 설치
import fs from 'node:fs';
const P = 'src/40-demos.js';
let s = fs.readFileSync(P, 'utf8');
const NAMES = ['partialDemo', 'tangentPlaneDemo', 'gradDemo', 'saddleDemo', 'lagrangeDemo'];
if (s.includes('function partialDemo')) throw new Error('이미 설치됨');
for (const n of NAMES) if (s.includes('function ' + n + '(')) throw new Error('이름 충돌: ' + n);

{ const i = s.indexOf('const LABS=[');
  s = s.slice(0, i) + '\n' + fs.readFileSync('algAF-demos.txt', 'utf8') + '\n' + s.slice(i); }

{ const key = ' build:contourDemo}\n];';
  const i = s.indexOf(key);
  if (i < 0) throw new Error('LABS 끝 앵커 실패');
  s = s.slice(0, i) + ` build:contourDemo},
{n:267,core:0,t:'“하나만 붙잡고 보면” 편미분',q:'변수가 둘이면 기울기는 몇 개일까?',
 m:['편미분','단면','방향도함수'],a:['다변수 모형','민감도 분석'],
 note:'나머지를 상수처럼 붙잡아 두고 하나만 미분한 것이 편미분입니다. 함께 움직이면 방향도함수가 됩니다.',
 build:partialDemo},
{n:268,core:0,t:'“가까이서는 평평하다” 접평면',q:'곡면을 일차식으로 대신할 수 있을까?',
 m:['접평면','국소 선형화','이차 오차'],a:['수치 최적화','오차 전파'],
 note:'접평면은 그 점 근처에서 가장 잘 맞는 일차식입니다. 남는 오차는 범위의 제곱에 비례합니다.',
 build:tangentPlaneDemo},
{n:269,core:0,t:'“어느 쪽이 가장 가파른가” 그래디언트',q:'가장 빨리 오르는 방향은 어디일까?',
 m:['그래디언트','방향도함수','내적'],a:['경사하강법','등고선 해석'],
 note:'방향 d 의 변화율은 ∇f·d 입니다. 그것이 최대인 방향이 ∇f 이고, 0 인 방향이 등고선입니다.',
 build:gradDemo},
{n:270,core:0,t:'“0 인데 극값이 아니다” 안장점',q:'기울기가 0 이면 극값일까?',
 m:['임계점','헤세 행렬','이계도함수 판정'],a:['학습이 멈추는 지점','안정성'],
 note:'기울기 0 은 후보일 뿐입니다. 4ab − c² 의 부호가 극값과 안장점을 가릅니다.',
 build:saddleDemo},
{n:271,core:0,t:'“조건이 붙은 최댓값” 라그랑주 승수법',q:'울타리 안에서만 움직일 때 최댓값은?',
 m:['제약 최적화','라그랑주 승수','접선 조건'],a:['자원 배분','제약 설계'],
 note:'조건 곡선 위에서 f 가 최대인 자리는 등고선과 조건 곡선이 접하는 자리, 곧 ∇f = λ∇g 입니다.',
 build:lagrangeDemo}
];` + s.slice(i + key.length);
}

{
  const m = s.match(/const PROBLEMS=(\{.*?\});/);
  if (!m) throw new Error('PROBLEMS 앵커 실패');
  const PR = JSON.parse(m[1]);
  PR['267'] = { sit: '기온과 습도 두 가지가 함께 불쾌지수를 정합니다. 「기온이 1도 오르면 얼마나 오르나」를 묻습니다.',
    ask: '변수가 둘인데 기울기를 하나로 말할 수 있을까? 무엇을 붙잡아 두어야 할까?' };
  PR['268'] = { sit: '지구는 둥근데 우리 동네 지도는 평면으로 그려도 아무 문제가 없습니다.',
    ask: '얼마나 좁게 보아야 굽은 것을 평평하다고 해도 될까? 그 오차는 어떻게 줄어들까?' };
  PR['269'] = { sit: '안개 낀 산에서 가장 빨리 내려가려 합니다. 발밑의 기울기만 느낄 수 있습니다.',
    ask: '어느 쪽으로 발을 디뎌야 할까? 높이가 그대로인 방향도 있을까?' };
  PR['270'] = { sit: '학습이 멈춰 기울기가 0 이 되었는데, 손실은 최솟값이 아니라고 합니다.',
    ask: '기울기가 0 인데 최소가 아닐 수 있을까? 어떻게 구별할까?' };
  PR['271'] = { sit: '예산이 정해져 있어 그 선을 넘을 수 없는 상태에서 성과를 가장 크게 하려 합니다.',
    ask: '조건이 없을 때와 무엇이 달라질까? 최댓값 자리를 어떻게 알아볼까?' };
  s = s.replace(m[0], 'const PROBLEMS=' + JSON.stringify(PR) + ';');

  const i0 = s.indexOf('const MISSIONS=');
  const mm = s.slice(i0).match(/^const MISSIONS=\{[\s\S]*?\n\};/);
  if (!mm) throw new Error('MISSIONS 앵커 실패');
  const M = new Function('return ' + mm[0].slice('const MISSIONS='.length, -1))();

  M['267'] = [
   {t:'1분 자유 탐색 — 점을 옮겨 보세요. 단면 곡선과 붉은 직선이 어떻게 달라지나요?'},
   {t:'오늘의 문제 — 움직일 변수를 「y 만」으로 바꾸세요. 화면의 기울기가 무엇과 같아지나요?',
    re:'곡면이 곡선 하나로 줄었습니다',
    do:'① 선택을 y 로 ② 화면의 기울기 확인 ③ ∂f/∂y 값과 견주기',
    hand:'f 를 y 로 미분해 −1.2y + 0.8x 를 직접 유도'},
   {t:'함께 움직이면 — 「두 변수를 함께」로 바꾸세요. 기울기가 어떻게 되나요?',
    re:'편미분이 아니라 방향도함수',
    do:'① 선택을 함께로 ② 기울기 값 확인 ③ 두 편미분의 합과 비교',
    hand:'∂f/∂x + ∂f/∂y 를 계산해 화면 값과 맞춰 보기'},
   {t:'(점, ∂f/∂x, ∂f/∂y) 를 여섯 줄 기록하세요.'},
   {t:'심화 — 왜 상수처럼 두는가: 편미분의 정의 lim[f(x+h, y) − f(x, y)]/h 를 써서 y 가 변하지 않는다는 사실이 어디에 들어 있는지 짚고, 두 편미분이 모두 0 인 점을 구하세요.'}];

  M['268'] = [
   {t:'1분 자유 탐색 — 보는 범위를 줄여 보세요. 두 선이 어떻게 되나요?'},
   {t:'오늘의 문제 — 보는 범위를 0.10 으로 줄이세요. 최대 차이가 얼마인가요?',
    re:'가까이서 보면 곡면도 평평합니다',
    do:'① 범위를 0.10 으로 ② 최대 차이 읽기 ③ 범위를 반으로 줄여 다시 읽기',
    hand:'차이가 범위의 몇 제곱에 비례하는지 두 값으로 확인'},
   {t:'하나만 쓰면 — 「기울기 하나만 쓰기」를 켜세요. 평면이 어떻게 되나요?',
    re:'한쪽으로만 기울어 접하지 못합니다',
    do:'① 체크 켜기 ② 두 선의 벌어짐 보기 ③ 범위를 줄여도 남는지 확인',
    hand:'빠뜨린 항 2a_y(y − y₀) 가 얼마인지 계산'},
   {t:'(범위, 최대 차이) 를 여섯 줄 기록하세요.'},
   {t:'심화 — 오차의 차수: f(x, y) − (접평면) 의 남는 항이 이차식임을 테일러 전개로 보이고, 범위를 절반으로 줄이면 오차가 1/4 이 되는 까닭을 설명하세요.'}];

  M['269'] = [
   {t:'1분 자유 탐색 — 방향을 돌려 보세요. 오른쪽 곡선의 어디에 붉은 점이 오나요?'},
   {t:'오늘의 문제 — 방향을 139° 로 맞추세요. 변화율이 얼마인가요?',
    re:'등고선을 따라 걷고 있어 높이가 그대로입니다',
    do:'① 방향을 139 로 ② 변화율 값 확인 ③ 초록 화살표와 이루는 각 보기',
    hand:'∇f·d = 0 을 풀어 그 방향을 직접 구하기'},
   {t:'가장 가파른 쪽 — 「가장 가파른 방향으로」를 누르세요. 변화율이 무엇과 같아지나요?',
    re:'변화율이 ∇f 의 크기와 같아졌습니다',
    do:'① 버튼 누르기 ② 변화율과 |∇f| 비교 ③ 두 화살표가 겹치는지 보기',
    hand:'|∇f| cos θ 가 θ = 0 에서 최대임을 확인'},
   {t:'(방향, 변화율, |∇f|) 을 여섯 줄 기록하세요.'},
   {t:'심화 — 왜 수직인가: 등고선을 따라 움직이면 f 가 변하지 않으므로 ∇f·d = 0 임을 설명하고, 이것이 곧 「∇f 와 등고선이 직각」이라는 뜻임을 밝히세요.'}];

  M['270'] = [
   {t:'1분 자유 탐색 — 세 계수를 움직여 보세요. 원 둘레의 색이 어떻게 되나요?'},
   {t:'오늘의 문제 — b 를 −1 로 내리세요. 두 단면이 어떤 모양인가요?',
    re:'기울기가 0 이어도 극값이 아닙니다',
    do:'① b 를 −1 로 ② 두 단면 곡선 보기 ③ 원 둘레의 두 색 확인',
    hand:'x 축과 y 축을 따라 f 의 부호를 각각 따져 보기'},
   {t:'경계에서 — b 를 1 로 되돌리고 c 를 2 로 올리세요. 판정이 어떻게 되나요?',
    re:'이차항만으로는 결론을 낼 수 없습니다',
    do:'① b 를 1 로 ② c 를 2 로 ③ 4ab − c² 값 확인',
    hand:'f = (x + y)² 임을 확인하고 어떤 방향에서 0 이 되는지 찾기'},
   {t:'(a, b, c, 4ab − c², 판정) 을 여섯 줄 기록하세요.'},
   {t:'심화 — 헤세 행렬: 이계도함수를 모은 행렬의 행렬식이 4ab − c² 와 같음을 확인하고, 그 부호와 고윳값의 부호가 어떻게 대응하는지 설명하세요.'}];

  M['271'] = [
   {t:'1분 자유 탐색 — 위치를 돌려 보세요. 붉은 등고선이 어떻게 움직이나요?'},
   {t:'오늘의 문제 — 「가장 큰 자리로」를 누르세요. 두 화살표가 어떻게 되나요?',
    re:'등고선이 조건 곡선에 접하는 자리',
    do:'① 버튼 누르기 ② 두 화살표 방향 비교 ③ f 값과 최댓값 견주기',
    hand:'∇f = λ∇g 를 세워 x, y 를 직접 구하기'},
   {t:'반대편에서 — 위치를 243° 로 옮기세요. 여기서도 접하나요?',
    re:'접하는 자리는 가장 큰 곳과 가장 작은 곳',
    do:'① 위치를 243 으로 ② 어긋남 값 확인 ③ f 값의 부호 보기',
    hand:'같은 방정식의 두 해가 최댓값·최솟값에 대응함을 확인'},
   {t:'(반지름, 각, f 값, 어긋남) 을 여섯 줄 기록하세요.'},
   {t:'심화 — 왜 접하는가: 조건 곡선을 따라 움직일 때 f 가 늘어나려면 등고선을 가로질러야 함을 설명하고, 더 이상 늘릴 수 없는 자리가 접점임을 논증하세요.'}];

  s = s.slice(0, i0) + 'const MISSIONS=' + JSON.stringify(M, null, 1) + ';' + s.slice(i0 + mm[0].length);

  const PR2 = JSON.parse(s.match(/const PROBLEMS=(\{.*?\});/)[1]);
  const labsBlock = s.slice(s.indexOf('const LABS=['), s.indexOf('const THUMBS ='));
  const demoSrc = fs.readFileSync('algAF-demos.txt', 'utf8');
  let bad = 0;
  ['267', '268', '269', '270', '271'].forEach((k, ki) => {
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
  const key = s.match(/  link:'경사하강법\(LAB 06\)이 딛고 서 있는 그림입니다\.'\}\r?\n\];/);
  if (!key) throw new Error('PRINS 끝 앵커 실패');
  s = s.replace(key[0], `  link:'경사하강법(LAB 06)이 딛고 서 있는 그림입니다.'},

{tex:[
   {t:'\\\\frac{\\\\partial f}{\\\\partial x}=\\\\lim_{h\\\\to 0}\\\\frac{f(x+h,\\\\ y)-f(x,\\\\ y)}{h}', s:'y 가 <b>그대로</b> 있는 것이 정의 안에 들어 있습니다.'},
   {t:'f=x^{2}-0.6y^{2}+0.8xy \\\\Rightarrow f_x=2x+0.8y', s:'y 를 <b>상수처럼</b> 두고 미분합니다.'},
   {t:'D_{\\\\vec{d}}f=\\\\nabla f\\\\cdot \\\\vec{d}', s:'함께 움직이면 <b>방향도함수</b>가 됩니다.'}
  ],
  next:[
   {lv:'바로',   t:'직접 미분', d:'주어진 식의 두 편미분을 손으로 구하세요.'},
   {lv:'심화',   t:'임계점 찾기', d:'두 편미분이 동시에 0 인 점을 구하세요.'},
   {lv:'프로젝트', t:'민감도 분석', d:'모형에서 어느 변수가 더 큰 영향을 주는지 재세요.'}
  ],
  eq:'∂f/∂x · ∂f/∂y',
  what:'변수가 여럿일 때 <b>하나씩 나누어 보는</b> 방법을 익힙니다.',
  probe:'한 변수를 붙잡으면 곡면이 곡선 하나로 줄어듭니다.',
  link:'미분(LAB 13)을 다변수로 넓히는 첫걸음입니다.'},

{tex:[
   {t:'z=f(a,b)+f_x(a,b)(x-a)+f_y(a,b)(y-b)', s:'그 점 근처에서 <b>가장 잘 맞는 일차식</b>입니다.'},
   {t:'f(x,y)-z=O\\\\!\\\\left(\\\\left|(x-a,\\\\ y-b)\\\\right|^{2}\\\\right)', s:'남는 오차는 <b>거리의 제곱</b>에 비례합니다.'},
   {t:'\\\\text{범위}\\\\to\\\\frac{1}{2} \\\\Rightarrow \\\\text{오차}\\\\to\\\\frac{1}{4}', s:'좁혀 볼수록 <b>빠르게</b> 평평해집니다.'}
  ],
  next:[
   {lv:'바로',   t:'오차 재기', d:'범위를 반으로 줄이며 오차를 재세요.'},
   {lv:'심화',   t:'테일러로', d:'남는 항이 이차식임을 전개로 보이세요.'},
   {lv:'프로젝트', t:'오차 전파', d:'측정 오차가 결과에 얼마나 옮겨 가는지 어림하세요.'}
  ],
  eq:'z = f + f_x(x − a) + f_y(y − b)',
  what:'곡면을 <b>일차식으로 대신 쓰는</b> 조건을 확인하는 실험입니다.',
  probe:'범위를 좁힐수록 두 선이 겹쳐 갑니다.',
  link:'접선(LAB 13)의 다변수판이며, 최적화의 밑돌입니다.'},

{tex:[
   {t:'\\\\nabla f=(f_x,\\\\ f_y)', s:'두 편미분을 <b>한 벡터</b>로 모은 것입니다.'},
   {t:'D_{\\\\vec{d}}f=\\\\nabla f\\\\cdot\\\\vec{d}=\\\\left|\\\\nabla f\\\\right|\\\\cos\\\\theta', s:'θ = 0 에서 <b>최대</b>가 됩니다.'},
   {t:'\\\\nabla f\\\\cdot\\\\vec{d}=0 \\\\iff \\\\vec{d}\\\\ \\\\text{는 등고선 방향}', s:'그래서 ∇f 는 등고선과 <b>직각</b>입니다.'}
  ],
  next:[
   {lv:'바로',   t:'변화율 재기', d:'여러 방향의 변화율을 재어 비교하세요.'},
   {lv:'심화',   t:'수직 보이기', d:'등고선 방향의 변화율이 0 임을 설명하세요.'},
   {lv:'프로젝트', t:'경사하강', d:'−∇f 방향으로 내려가는 경로를 그려 보세요.'}
  ],
  eq:'D_d f = ∇f · d = |∇f| cos θ',
  what:'「어느 쪽으로 갈 것인가」를 <b>내적 하나</b>로 정하는 실험입니다.',
  probe:'등고선을 따라가면 변화율이 정확히 0 이 됩니다.',
  link:'경사하강법(LAB 06)이 왜 −∇f 방향인지 설명해 줍니다.'},

{tex:[
   {t:'\\\\nabla f=(0,\\\\ 0)\\\\ \\\\Rightarrow\\\\ \\\\text{임계점}', s:'극값의 <b>후보</b>일 뿐입니다.'},
   {t:'H=\\\\begin{pmatrix}f_{xx} & f_{xy} \\\\\\\\ f_{xy} & f_{yy}\\\\end{pmatrix},\\\\quad \\\\det H=4ab-c^{2}', s:'이계도함수를 모은 <b>헤세 행렬</b>입니다.'},
   {t:'\\\\det H<0 \\\\Rightarrow \\\\text{안장점}', s:'한쪽은 오르고 한쪽은 내려갑니다.'}
  ],
  next:[
   {lv:'바로',   t:'판정 연습', d:'여러 계수로 극값·안장을 판정하세요.'},
   {lv:'심화',   t:'고윳값으로', d:'헤세 행렬의 고윳값 부호로 다시 설명하세요.'},
   {lv:'프로젝트', t:'학습의 정체', d:'손실 지형의 안장점이 학습을 어떻게 막는지 조사하세요.'}
  ],
  eq:'det H = 4ab − c² · 음수면 안장점',
  what:'「기울기 0」이 <b>충분조건이 아님</b>을 눈으로 확인합니다.',
  probe:'b 의 부호를 뒤집으면 같은 점이 극값에서 안장으로 바뀝니다.',
  link:'이계도함수 판정(LAB 52)의 다변수판입니다.'},

{tex:[
   {t:'\\\\max f(x,y)\\\\quad \\\\text{s.t.}\\\\ g(x,y)=0', s:'조건 곡선 <b>위에서만</b> 움직입니다.'},
   {t:'\\\\nabla f=\\\\lambda\\\\nabla g', s:'최댓값 자리에서 두 기울기가 <b>나란</b>합니다.'},
   {t:'f=x+2y,\\\\ g=x^{2}+y^{2}-r^{2} \\\\Rightarrow f_{\\\\max}=r\\\\sqrt{5}', s:'풀어 보면 <b>깔끔한 값</b>이 나옵니다.'}
  ],
  next:[
   {lv:'바로',   t:'최댓값 확인', d:'r√5 를 계산해 화면 값과 견주세요.'},
   {lv:'심화',   t:'직접 풀기', d:'∇f = λ∇g 를 연립해 해를 구하세요.'},
   {lv:'프로젝트', t:'예산 제약', d:'예산이 정해진 최적 배분 문제를 세워 푸세요.'}
  ],
  eq:'∇f = λ∇g',
  what:'제약이 있는 최적화를 <b>접선 조건</b>으로 바꾸는 실험입니다.',
  probe:'최댓값 자리에서 두 화살표가 정확히 겹칩니다.',
  link:'조건부 최적화의 표준 도구이며, 경제·공학에서 널리 씁니다.'}
];`);
}

/* THUMBS */
{
  const key = s.match(/   '겹겹의 등고선과 바깥을 향한 기울기 화살표'\)\r?\n\];/);
  if (!key) throw new Error('THUMBS 끝 앵커 실패');
  s = s.replace(key[0], `   '겹겹의 등고선과 바깥을 향한 기울기 화살표'),

 svg(\`<path d="M16 68 C36 30 66 26 104 58" stroke="\${TC.blue}" stroke-width="2.2" fill="none"/>
   <line x1="46" y1="58" x2="94" y2="26" stroke="\${TC.rose}" stroke-width="1.8"/>
   <circle cx="70" cy="42" r="4" fill="\${TC.ink3}"/>
   <line x1="12" y1="80" x2="110" y2="80" stroke="\${TC.ink3}" stroke-width="1" opacity=".5"/>
   <text x="60" y="94" font-size="8" font-weight="800" fill="\${TC.ink3}" text-anchor="middle">∂f/∂x</text>\`,
   '한 변수만 움직인 단면 곡선과 접선'),

 svg(\`<path d="M18 72 C40 40 74 34 104 60" stroke="\${TC.ink3}" stroke-width="2.2" fill="none"/>
   <line x1="36" y1="44" x2="94" y2="44" stroke="\${TC.blue}" stroke-width="1.8" stroke-dasharray="5 4"/>
   <circle cx="64" cy="42" r="4" fill="\${TC.rose}"/>
   <rect x="48" y="30" width="34" height="24" fill="none" stroke="\${TC.teal}" stroke-width="1" opacity=".7"/>
   <text x="60" y="92" font-size="8" font-weight="800" fill="\${TC.ink3}" text-anchor="middle">접평면</text>\`,
   '한 점 둘레에서 곡선과 겹쳐 가는 접선'),

 svg(\`<g fill="none" stroke="\${TC.blue}" stroke-width="1.2" opacity=".75">
   <ellipse cx="52" cy="48" rx="12" ry="8"/><ellipse cx="52" cy="48" rx="24" ry="16"/>
   <ellipse cx="52" cy="48" rx="38" ry="26"/></g>
   <line x1="52" y1="48" x2="88" y2="34" stroke="\${TC.teal}" stroke-width="2.6"/>
   <line x1="52" y1="48" x2="66" y2="80" stroke="\${TC.rose}" stroke-width="2"/>
   <circle cx="52" cy="48" r="3" fill="\${TC.ink3}"/>
   <text x="60" y="96" font-size="8" font-weight="800" fill="\${TC.ink3}" text-anchor="middle">가장 가파른 쪽</text>\`,
   '등고선을 가로지르는 기울기 화살표'),

 svg(\`<path d="M16 30 C40 74 80 74 104 30" stroke="\${TC.blue}" stroke-width="2" fill="none"/>
   <path d="M16 74 C40 30 80 30 104 74" stroke="\${TC.rose}" stroke-width="2" fill="none"/>
   <circle cx="60" cy="52" r="4" fill="\${TC.ink3}"/>
   <text x="60" y="94" font-size="8" font-weight="800" fill="\${TC.ink3}" text-anchor="middle">안장점</text>\`,
   '한 방향은 위로 다른 방향은 아래로 휘는 두 단면'),

 svg(\`<circle cx="58" cy="48" r="30" fill="none" stroke="\${TC.teal}" stroke-width="2.2"/>
   <g stroke="\${TC.blue}" stroke-width="1" opacity=".55">
   <line x1="12" y1="76" x2="76" y2="12"/><line x1="26" y1="86" x2="98" y2="14"/>
   <line x1="40" y1="94" x2="112" y2="22"/></g>
   <line x1="20" y1="62" x2="92" y2="-10" stroke="\${TC.rose}" stroke-width="2"/>
   <circle cx="72" cy="21" r="4.4" fill="\${TC.ink3}"/>
   <text x="60" y="94" font-size="8" font-weight="800" fill="\${TC.ink3}" text-anchor="middle">∇f = λ∇g</text>\`,
   '조건 원에 접하는 등고선과 접점')
];`);
}

new Function(s);
fs.writeFileSync(P, s);

{
  const C = 'src/55-catalog.js';
  let c = fs.readFileSync(C, 'utf8');
  const m = c.match(/(\{k:'xcal',g:'고급 미적분 · 등고선'[^}]*\})(\r?\n\];)/);
  if (!m) throw new Error('LABCAT 끝 앵커 실패');
  c = c.replace(m[0], m[1] + `,
{k:'xcal',g:'고급 미적분 · 편미분',b:'한 변수를 미분할 때 다른 변수도 함께 변화시켜 편미분이 전미분이 됨'},
{k:'xcal',g:'고급 미적분 · 접평면',b:'두 편미분 중 하나만 써 접평면이 한 방향으로만 기울어짐'},
{k:'xcal',g:'고급 미적분 · 그래디언트',b:'그래디언트를 등고선을 따라 그려 화살표가 등고선에 나란히 놓임'},
{k:'xcal',g:'고급 미적분 · 안장점',b:'1차 조건만 보고 임계점을 모두 극값이라 표시함'},
{k:'xcal',g:'고급 미적분 · 라그랑주 승수법',b:'제약식을 만족하는지 확인하지 않아 조건 밖의 점을 답으로 냄'}` + m[2]);
  fs.writeFileSync(C, c);
}
console.log('LAB 267~271 (고급 미적분 B · 5종) 설치 완료');
