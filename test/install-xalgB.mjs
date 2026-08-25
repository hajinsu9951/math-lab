// 고급 대수 B — LAB 252~256 (소거법·생성·부분공간·차원·기저) 전 계층 설치
import fs from 'node:fs';
const P = 'src/40-demos.js';
let s = fs.readFileSync(P, 'utf8');
const NAMES = ['gaussDemo', 'spanDemo', 'subspaceDemo', 'dimDemo', 'basisDemo'];
if (s.includes('function gaussDemo')) throw new Error('이미 설치됨');
for (const n of NAMES) if (s.includes('function ' + n + '(')) throw new Error('이름 충돌: ' + n);

{ const i = s.indexOf('const LABS=[');
  s = s.slice(0, i) + '\n' + fs.readFileSync('algAC-demos.txt', 'utf8') + '\n' + s.slice(i); }

{ const key = ' build:fibMatDemo}\n];';
  const i = s.indexOf(key);
  if (i < 0) throw new Error('LABS 끝 앵커 실패');
  s = s.slice(0, i) + ` build:fibMatDemo},
{n:252,core:0,t:'“계단으로 만들면 풀린다” 가우스 소거법',q:'컴퓨터는 연립방정식을 어떤 순서로 풀까?',
 m:['행 조작','피벗','첨가행렬'],a:['수치 선형대수','시뮬레이션'],
 note:'행에 수를 곱해 더하거나 두 행을 맞바꾸어도 해는 변하지 않습니다. 피벗이 0 이면 반드시 행을 바꿔야 합니다.',
 build:gaussDemo},
{n:253,core:0,t:'“화살표 둘로 어디까지” 생성',q:'두 방향만으로 평면을 다 덮을 수 있을까?',
 m:['일차결합','생성','벡터공간'],a:['특징 공간','자유도'],
 note:'실수배해서 더한 것을 모두 모은 것이 생성입니다. 두 벡터가 나란하면 직선밖에 만들지 못합니다.',
 build:spanDemo},
{n:254,core:0,t:'“원점을 지나야 하는 이유” 부분공간 판정',q:'덧셈만 검사하면 왜 안 될까?',
 m:['부분공간','실수배','영벡터'],a:['제약 공간','해공간'],
 note:'덧셈과 실수배 두 검사를 모두 통과해야 합니다. 0 을 곱하면 원점이 나오므로 원점을 품어야 합니다.',
 build:subspaceDemo},
{n:255,core:0,t:'“개수와 차원은 다르다” 일차독립과 차원',q:'벡터를 늘리면 차원도 늘어날까?',
 m:['일차독립','기저','차원'],a:['차원 축소','특징 선택'],
 note:'이미 만들 수 있는 방향은 아무리 더해도 새 차원이 되지 못합니다. 평면에서 차원은 2 를 넘지 못합니다.',
 build:dimDemo},
{n:256,core:0,t:'“같은 점, 다른 좌표” 기저와 좌표',q:'좌표는 점의 성질일까?',
 m:['기저','좌표변환','일차결합'],a:['좌표계 설계','데이터 표현'],
 note:'좌표는 어떤 자로 재었는지에 달린 값입니다. 두 기저가 나란하면 눈금이 되지 못합니다.',
 build:basisDemo}
];` + s.slice(i + key.length);
}

{
  const m = s.match(/const PROBLEMS=(\{.*?\});/);
  if (!m) throw new Error('PROBLEMS 앵커 실패');
  const PR = JSON.parse(m[1]);
  PR['252'] = { sit: '미지수가 셋인 식이 셋 있습니다. 손으로 풀면 어느 식부터 없앨지 매번 고민하게 됩니다.',
    ask: '언제나 통하는 순서가 있을까? 컴퓨터는 그 순서를 어떻게 정할까?' };
  PR['253'] = { sit: '조종간 두 개로 드론을 움직입니다. 하나는 앞뒤, 하나는 좌우인 줄 알았는데 둘 다 비스듬합니다.',
    ask: '이 조종간 둘로 평면 위 어디든 갈 수 있을까? 못 가는 경우는 언제일까?' };
  PR['254'] = { sit: '「y = x + 2 위의 점들」과 「y = x 위의 점들」 가운데 하나만 벡터공간의 자격을 얻는다고 합니다.',
    ask: '무엇이 두 집합을 가를까? 어떤 검사를 해야 할까?' };
  PR['255'] = { sit: '자료의 특징을 네 개나 모았는데, 분석해 보니 실제로 쓸모 있는 것은 둘뿐이라고 합니다.',
    ask: '개수와 실제 정보량은 왜 다를까? 무엇을 세어야 할까?' };
  PR['256'] = { sit: '같은 위치를 두 사람이 다르게 적었습니다. 한 사람은 (3, 2), 다른 사람은 (2.5, −0.5) 라고 합니다.',
    ask: '둘 다 맞을 수 있을까? 무엇이 다르면 이런 일이 생길까?' };
  s = s.replace(m[0], 'const PROBLEMS=' + JSON.stringify(PR) + ';');

  const i0 = s.indexOf('const MISSIONS=');
  const mm = s.slice(i0).match(/^const MISSIONS=\{[\s\S]*?\n\};/);
  if (!mm) throw new Error('MISSIONS 앵커 실패');
  const M = new Function('return ' + mm[0].slice('const MISSIONS='.length, -1))();

  M['252'] = [
   {t:'1분 자유 탐색 — 단계를 하나씩 올려 보세요. 어떤 칸이 초록으로 바뀌나요?'},
   {t:'오늘의 문제 — 단계를 끝까지(4) 올리세요. 계단 아래가 어떻게 되나요?',
    re:'아래에서 위로 차례로 값을 되짚어',
    do:'① 단계를 4 로 ② 초록 칸 세기 ③ 마지막 행 읽기',
    hand:'마지막 행에서 z 를 구해 위로 대입해 보기'},
   {t:'막히는 자리 — ① 행의 첫 계수를 0 으로 내리세요 (행 바꾸기는 끈 채로).',
    re:'그 줄부터 계산이 멈췄습니다',
    do:'① 첫 계수를 0 으로 ② 설명 문구 읽기 ③ 체크를 켜서 되살리기',
    hand:'0 으로 나누는 자리가 어디인지 표시'},
   {t:'(단계, 계단 아래 0 의 개수) 를 여섯 줄 기록하세요.'},
   {t:'심화 — 왜 해가 안 변하나: 「행에 0 이 아닌 수를 곱한다 · 한 행의 배수를 다른 행에 더한다 · 두 행을 맞바꾼다」 세 조작이 해집합을 바꾸지 않는 까닭을 각각 설명하세요.'}];

  M['253'] = [
   {t:'1분 자유 탐색 — 두 계수를 움직여 보세요. 붉은 화살표가 어디까지 가나요?'},
   {t:'오늘의 문제 — v 를 (4, 2) 로 맞추세요. 갈 수 있는 곳이 어떻게 되나요?',
    re:'한 직선을 벗어나지 못합니다',
    do:'① v 의 x 를 4 로 ② v 의 y 를 2 로 ③ 판정값 확인',
    hand:'v 가 u 의 몇 배인지 확인'},
   {t:'평면 되찾기 — v 의 x 를 −1 로 되돌리고 v 에 곱할 수를 1 로 올리세요.',
    re:'계수 둘만으로 평면 어디든',
    do:'① v 의 x 를 −1 로 ② 곱할 수를 1 로 ③ 붉은 화살표가 닿는 곳 보기',
    hand:'임의의 점 (1, 5) 를 만드는 계수를 손으로 구하기'},
   {t:'(u, v, 판정값, 갈 수 있는 곳) 을 여섯 줄 기록하세요.'},
   {t:'심화 — 왜 판정값인가: au + bv = (0, 0) 이 a = b = 0 일 때만 성립하는 조건이 uₓv_y − u_yvₓ ≠ 0 임을 연립방정식으로 보이세요.'}];

  M['254'] = [
   {t:'1분 자유 탐색 — 절편과 곱할 수를 움직여 보세요. 점이 직선 위에 남나요?'},
   {t:'오늘의 문제 — y 절편을 0 으로 내리세요. 두 검사가 어떻게 되나요?',
    re:'원점을 지나는 직선이라야 합니다',
    do:'① 절편을 0 으로 ② 두 검사 결과 확인 ③ 원점 표시 보기',
    hand:'0 을 곱하면 어떤 점이 나오는지 적기'},
   {t:'탈락하는 경우 — 절편을 2 로 되돌리고 곱할 수를 2 로 올리세요.',
    re:'직선 밖으로 튀어나갔습니다',
    do:'① 절편을 2 로 ② 곱할 수를 2 로 ③ 붉은 점의 위치 보기',
    hand:'(1, 3) 의 2 배가 직선 위에 있는지 대입해 확인'},
   {t:'(절편, 실수배 검사, 덧셈 검사) 를 여섯 줄 기록하세요.'},
   {t:'심화 — 세 조건: 부분공간의 세 조건(0 을 품는다 · 덧셈에 닫혀 있다 · 실수배에 닫혀 있다) 가운데 첫 조건이 나머지에서 따라 나옴을 보이고, 그래도 따로 적는 까닭을 쓰세요.'}];

  M['255'] = [
   {t:'1분 자유 탐색 — 개수를 늘려 보세요. 화면 위쪽 숫자가 어떻게 되나요?'},
   {t:'오늘의 문제 — ③ 을 ① 의 실수배로 두고 개수를 3 으로 올리세요.',
    re:'개수는 늘었는데 차원은 그대로',
    do:'① 체크 켜기 ② 개수를 3 으로 ③ 두 숫자 견주기',
    hand:'③ 이 ① 의 몇 배인지 확인'},
   {t:'끝까지 — 개수를 4 로 올리세요. 차원이 3 이 될 수 있나요?',
    re:'차원이 2 를 넘지 못합니다',
    do:'① 개수를 4 로 ② 차원 값 확인 ③ 네 화살표를 눈으로 견주기',
    hand:'④ 를 ① 과 ② 로 만들어 보기'},
   {t:'(개수, 차원) 을 여섯 줄 기록하세요.'},
   {t:'심화 — 왜 2 를 넘지 못하나: 평면의 벡터 셋이 언제나 일차종속임을 연립방정식의 미지수·식 개수로 설명하고, 기저의 크기가 늘 같다는 사실과 이어 보세요.'}];

  M['256'] = [
   {t:'1분 자유 탐색 — 기저를 움직여 보세요. 초록 격자가 어떻게 기우나요?'},
   {t:'오늘의 문제 — e₁ 을 (1, 1), e₂ 를 (−1, 1) 로 맞추세요. 새 좌표가 얼마인가요?',
    re:'자를 바꾸면 읽는 값이 바뀝니다',
    do:'① e₁ 의 y 를 1 로 ② e₂ 의 x 를 −1 로 ③ 새 좌표 읽기',
    hand:'P = s·e₁ + t·e₂ 를 연립방정식으로 풀어 확인'},
   {t:'자가 무너질 때 — e₂ 를 (2, 2) 로 맞추세요. 좌표를 정할 수 있나요?',
    re:'좌표를 정할 수 없습니다',
    do:'① e₂ 의 x 를 2 로 ② e₂ 의 y 를 2 로 ③ 격자가 어떻게 되는지 보기',
    hand:'e₂ 가 e₁ 의 몇 배인지 확인'},
   {t:'(기저, 새 좌표) 를 여섯 줄 기록하세요.'},
   {t:'심화 — 좌표를 바꾸는 행렬: 새 기저를 열로 세운 행렬 B 에 대해 표준 좌표 p 와 새 좌표 q 사이에 p = Bq 가 성립함을 보이고, q 를 구하려면 왜 B⁻¹ 이 필요한지 설명하세요.'}];

  s = s.slice(0, i0) + 'const MISSIONS=' + JSON.stringify(M, null, 1) + ';' + s.slice(i0 + mm[0].length);

  const PR2 = JSON.parse(s.match(/const PROBLEMS=(\{.*?\});/)[1]);
  const labsBlock = s.slice(s.indexOf('const LABS=['), s.indexOf('const THUMBS ='));
  const demoSrc = fs.readFileSync('algAC-demos.txt', 'utf8');
  let bad = 0;
  ['252', '253', '254', '255', '256'].forEach((k, ki) => {
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
  const key = s.match(/  link:'점화식\(LAB 125\)과 대각화\(LAB 250\)를 잇는 다리입니다\.'\}\r?\n\];/);
  if (!key) throw new Error('PRINS 끝 앵커 실패');
  s = s.replace(key[0], `  link:'점화식(LAB 125)과 대각화(LAB 250)를 잇는 다리입니다.'},

{tex:[
   {t:'R_i \\\\to R_i - \\\\frac{a_{i1}}{a_{11}}R_1', s:'첫 열을 <b>0 으로 만드는</b> 행 조작입니다.'},
   {t:'\\\\text{피벗}\\\\ a_{11}=0 \\\\Rightarrow \\\\text{행을 맞바꾼다}', s:'0 으로 나눌 수 없으니 <b>순서를 바꿉니다</b>.'},
   {t:'\\\\begin{pmatrix} * & * & * \\\\\\\\ 0 & * & * \\\\\\\\ 0 & 0 & * \\\\end{pmatrix}', s:'계단 모양이 되면 <b>아래에서 위로</b> 되짚어 갑니다.'}
  ],
  next:[
   {lv:'바로',   t:'손으로 소거', d:'세 식을 직접 계단 모양으로 만들어 보세요.'},
   {lv:'심화',   t:'피벗 고르기', d:'가장 큰 수를 피벗으로 고르는 까닭을 조사하세요.'},
   {lv:'프로젝트', t:'코드로', d:'소거법을 코드로 옮겨 임의의 연립방정식을 풀게 하세요.'}
  ],
  eq:'행 조작 → 계단꼴 → 뒤에서부터 대입',
  what:'풀이의 <b>순서 자체를 규칙으로</b> 만드는 실험입니다.',
  probe:'피벗을 0 으로 두면 그 줄부터 계산이 멈춥니다.',
  link:'역행렬(LAB 247)의 실제 계산법이며, 수치해석의 기본기입니다.'},

{tex:[
   {t:'a\\\\vec{u}+b\\\\vec{v}\\\\quad(a,b\\\\in\\\\mathbb{R})', s:'실수배해서 더한 것을 모두 모은 것이 <b>생성</b>입니다.'},
   {t:'u_x v_y - u_y v_x \\\\ne 0', s:'이때만 두 방향이 <b>서로 다릅니다</b>.'},
   {t:'u_x v_y - u_y v_x = 0 \\\\Rightarrow \\\\text{생성은 직선}', s:'나란하면 <b>한 줄</b>밖에 못 만듭니다.'}
  ],
  next:[
   {lv:'바로',   t:'목표 점 만들기', d:'주어진 점을 만드는 계수를 손으로 구하세요.'},
   {lv:'심화',   t:'조건 유도', d:'판정값이 0 이 아니어야 하는 까닭을 보이세요.'},
   {lv:'프로젝트', t:'3차원에서', d:'세 벡터가 공간을 덮을 조건을 조사하세요.'}
  ],
  eq:'span(u, v) = { a u + b v }',
  what:'「얼마나 자유롭게 움직일 수 있는가」를 재는 실험입니다.',
  probe:'두 벡터를 나란히 맞추면 갈 수 있는 곳이 직선으로 줄어듭니다.',
  link:'벡터의 합성(LAB 162)의 심화이며, 차원(LAB 255)으로 이어집니다.'},

{tex:[
   {t:'\\\\vec{x},\\\\vec{y}\\\\in W \\\\Rightarrow \\\\vec{x}+\\\\vec{y}\\\\in W', s:'<b>덧셈</b>에 닫혀 있어야 합니다.'},
   {t:'c\\\\in\\\\mathbb{R},\\\\ \\\\vec{x}\\\\in W \\\\Rightarrow c\\\\vec{x}\\\\in W', s:'<b>실수배</b>에도 닫혀 있어야 합니다.'},
   {t:'c=0 \\\\Rightarrow \\\\vec{0}\\\\in W', s:'그래서 <b>원점</b>을 반드시 품습니다.'}
  ],
  next:[
   {lv:'바로',   t:'판정 연습', d:'여러 직선이 부분공간인지 판정하세요.'},
   {lv:'심화',   t:'세 조건 정리', d:'첫 조건이 따라 나오는 과정을 쓰세요.'},
   {lv:'프로젝트', t:'해공간', d:'Ax = 0 의 해집합이 부분공간임을 보이세요.'}
  ],
  eq:'덧셈·실수배에 닫혀 있으면 부분공간',
  what:'정의를 <b>검사 절차</b>로 바꾸어 직접 판정해 보는 실험입니다.',
  probe:'절편이 0 이 아니면 실수배에서 반드시 탈락합니다.',
  link:'생성(LAB 253)이 늘 부분공간이 되는 까닭을 설명해 줍니다.'},

{tex:[
   {t:'c_1\\\\vec{v}_1+\\\\cdots+c_k\\\\vec{v}_k=\\\\vec{0}\\\\ \\\\Rightarrow\\\\ c_i=0', s:'모든 계수가 0 일 때만 성립하면 <b>일차독립</b>입니다.'},
   {t:'\\\\dim = \\\\text{일차독립인 벡터의 최대 개수}', s:'차원은 <b>개수</b>가 아니라 <b>서로 만들 수 없는 방향</b>의 수입니다.'},
   {t:'k>n \\\\Rightarrow \\\\text{반드시 일차종속}', s:'평면(n = 2)에서 셋을 넣으면 <b>반드시</b> 겹칩니다.'}
  ],
  next:[
   {lv:'바로',   t:'차원 세기', d:'벡터를 늘려 가며 차원을 직접 세세요.'},
   {lv:'심화',   t:'종속 보이기', d:'평면의 벡터 셋이 종속임을 식으로 보이세요.'},
   {lv:'프로젝트', t:'특징 고르기', d:'자료의 특징 중 겹치는 것을 찾아 줄이세요.'}
  ],
  eq:'차원 = 일차독립인 벡터의 최대 개수',
  what:'많이 모으는 것과 <b>제대로 아는 것</b>이 다름을 확인합니다.',
  probe:'이미 만들 수 있는 방향을 더해도 차원은 그대로입니다.',
  link:'생성(LAB 253)의 다음 단계이며, 주성분분석의 밑바탕입니다.'},

{tex:[
   {t:'\\\\vec{p}=s\\\\vec{e}_1+t\\\\vec{e}_2', s:'좌표 (s, t) 는 <b>기저에 대한 계수</b>입니다.'},
   {t:'\\\\vec{p}=B\\\\vec{q},\\\\qquad \\\\vec{q}=B^{-1}\\\\vec{p}', s:'기저를 열로 세운 B 가 <b>자를 갈아 끼웁니다</b>.'},
   {t:'\\\\det B=0 \\\\Rightarrow \\\\text{좌표를 정할 수 없다}', s:'두 기저가 나란하면 <b>눈금</b>이 되지 못합니다.'}
  ],
  next:[
   {lv:'바로',   t:'좌표 읽기', d:'같은 점을 두 기저로 읽어 견주세요.'},
   {lv:'심화',   t:'역행렬로', d:'B⁻¹ 을 구해 새 좌표를 직접 계산하세요.'},
   {lv:'프로젝트', t:'좋은 자 고르기', d:'자료가 가장 단순해 보이는 기저를 찾으세요.'}
  ],
  eq:'p = B q · q = B⁻¹ p',
  what:'좌표가 <b>점의 성질이 아니라 약속</b>임을 확인하는 실험입니다.',
  probe:'기저를 기울이면 같은 점의 좌표가 함께 달라집니다.',
  link:'대각화(LAB 250)가 「좋은 기저를 고르는 일」임을 알려 줍니다.'}
];`);
}

/* THUMBS */
{
  const key = s.match(/   '피보나치 수가 커지는 막대와 행렬 표시'\)\r?\n\];/);
  if (!key) throw new Error('THUMBS 끝 앵커 실패');
  s = s.replace(key[0], `   '피보나치 수가 커지는 막대와 행렬 표시'),

 svg(\`<g font-size="11" font-weight="700" fill="\${TC.ink3}" text-anchor="middle">
   <text x="28" y="34">2</text><text x="54" y="34">1</text><text x="80" y="34">3</text>
   <text x="54" y="58">2</text><text x="80" y="58">1</text>
   <text x="80" y="82">4</text></g>
   <g font-size="11" font-weight="700" fill="\${TC.teal}" text-anchor="middle">
   <text x="28" y="58">0</text><text x="28" y="82">0</text><text x="54" y="82">0</text></g>
   <path d="M20 42 L96 42" stroke="\${TC.ink3}" stroke-width=".8" opacity=".3"/>
   <path d="M20 66 L96 66" stroke="\${TC.ink3}" stroke-width=".8" opacity=".3"/>\`,
   '왼쪽 아래가 0 으로 채워진 계단 모양 행렬'),

 svg(\`<rect x="12" y="14" width="96" height="66" fill="\${TC.blue}" opacity=".08"/>
   <line x1="60" y1="52" x2="94" y2="30" stroke="\${TC.blue}" stroke-width="2.4"/>
   <line x1="60" y1="52" x2="40" y2="22" stroke="\${TC.teal}" stroke-width="2.4"/>
   <line x1="60" y1="52" x2="88" y2="70" stroke="\${TC.rose}" stroke-width="2.6"/>
   <circle cx="60" cy="52" r="3" fill="\${TC.ink3}"/>
   <text x="60" y="94" font-size="8" font-weight="800" fill="\${TC.ink3}" text-anchor="middle">au + bv</text>\`,
   '두 방향으로 평면 전체를 덮는 화살표 그림'),

 svg(\`<line x1="16" y1="74" x2="104" y2="26" stroke="\${TC.blue}" stroke-width="2"/>
   <circle cx="46" cy="58" r="4.4" fill="\${TC.teal}"/>
   <circle cx="86" cy="18" r="4.4" fill="\${TC.rose}"/>
   <line x1="46" y1="58" x2="86" y2="18" stroke="\${TC.rose}" stroke-width="1.2" stroke-dasharray="4 3"/>
   <circle cx="60" cy="60" r="3" fill="\${TC.ink3}"/>
   <text x="60" y="94" font-size="8" font-weight="800" fill="\${TC.ink3}" text-anchor="middle">원점을 지나야</text>\`,
   '직선 밖으로 튀어나간 실수배 점 그림'),

 svg(\`<line x1="60" y1="54" x2="94" y2="34" stroke="\${TC.blue}" stroke-width="2.4"/>
   <line x1="60" y1="54" x2="42" y2="22" stroke="\${TC.teal}" stroke-width="2.4"/>
   <line x1="60" y1="54" x2="26" y2="74" stroke="\${TC.ink3}" stroke-width="1.8" opacity=".45"/>
   <line x1="60" y1="54" x2="96" y2="72" stroke="\${TC.ink3}" stroke-width="1.8" opacity=".45"/>
   <circle cx="60" cy="54" r="3" fill="\${TC.ink3}"/>
   <text x="60" y="94" font-size="8" font-weight="800" fill="\${TC.rose}" text-anchor="middle">4 개 넣어도 2</text>\`,
   '네 개의 화살표 가운데 둘만 진한 그림'),

 svg(\`<g stroke="\${TC.teal}" stroke-width=".9" opacity=".55">
   <line x1="14" y1="30" x2="86" y2="86"/><line x1="34" y1="14" x2="106" y2="70"/>
   <line x1="54" y1="6" x2="112" y2="52"/>
   <line x1="14" y1="70" x2="70" y2="8"/><line x1="38" y1="86" x2="94" y2="24"/></g>
   <circle cx="66" cy="46" r="5" fill="\${TC.rose}"/>
   <text x="60" y="96" font-size="8" font-weight="800" fill="\${TC.ink3}" text-anchor="middle">같은 점 · 다른 좌표</text>\`,
   '기울어진 격자 위에 놓인 한 점')
];`);
}

new Function(s);
fs.writeFileSync(P, s);

{
  const C = 'src/55-catalog.js';
  let c = fs.readFileSync(C, 'utf8');
  const m = c.match(/(\{k:'xalg',g:'고급 대수 · 피보나치 행렬'[^}]*\})(\r?\n\];)/);
  if (!m) throw new Error('LABCAT 끝 앵커 실패');
  c = c.replace(m[0], m[1] + `,
{k:'xalg',g:'고급 대수 · 가우스 소거법',b:'피벗이 0 인데 행을 바꾸지 않아 그 줄부터 계산이 무너짐'},
{k:'xalg',g:'고급 대수 · 생성',b:'두 벡터가 평행일 때도 평면을 그려 실제로는 직선인 것을 감춤'},
{k:'xalg',g:'고급 대수 · 부분공간',b:'덧셈만 검사하고 실수배를 안 봐 부분공간이 아닌 것을 통과시킴'},
{k:'xalg',g:'고급 대수 · 차원',b:'이미 표현되는 벡터도 새 차원으로 세어 차원이 개수만큼 늘어남'},
{k:'xalg',g:'고급 대수 · 기저와 좌표',b:'기저를 바꿀 때 좌표를 다시 계산하지 않아 점이 함께 움직임'}` + m[2]);
  fs.writeFileSync(C, c);
}
console.log('LAB 252~256 (고급 대수 B · 5종) 설치 완료');
