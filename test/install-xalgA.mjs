// 고급 대수 A — LAB 247~251 (역행렬·행렬식·고유벡터·대각화·피보나치 행렬) 전 계층 설치
import fs from 'node:fs';
const P = 'src/40-demos.js';
let s = fs.readFileSync(P, 'utf8');
const NAMES = ['inverseSolveDemo', 'detAreaDemo', 'eigenDemo', 'matPowDemo', 'fibMatDemo'];
if (s.includes('function inverseSolveDemo')) throw new Error('이미 설치됨');
for (const n of NAMES) if (s.includes('function ' + n + '(')) throw new Error('이름 충돌: ' + n);

/* 데모 본문 */
{ const i = s.indexOf('const LABS=[');
  s = s.slice(0, i) + '\n' + fs.readFileSync('algAB-demos.txt', 'utf8') + '\n' + s.slice(i); }

/* LABS */
{ const key = ' build:cipherDemo}\n];';
  const i = s.indexOf(key);
  if (i < 0) throw new Error('LABS 끝 앵커 실패');
  s = s.slice(0, i) + ` build:cipherDemo},
{n:247,core:0,t:'“풀리는지 먼저 묻는다” 역행렬과 해의 개수',q:'계수만 보고 해가 있는지 알 수 있을까?',
 m:['역행렬','행렬식','연립일차방정식'],a:['선형 시스템','회로 해석'],
 note:'ad − bc 가 0 이 아니면 해가 하나뿐입니다. 0 이면 두 식이 나란하거나 겹쳐 해가 없거나 무수히 많습니다.',
 build:inverseSolveDemo},
{n:248,core:0,t:'“넓이가 몇 배가 되는가” 행렬식의 뜻',q:'행렬식이라는 수 하나가 말하는 것은?',
 m:['행렬식','넓이 배율','방향'],a:['그래픽스','좌표 변환'],
 note:'단위정사각형이 옮겨 간 평행사변형의 넓이가 |ad − bc| 입니다. 부호는 방향이 뒤집혔는지를 말합니다.',
 build:detAreaDemo},
{n:249,core:0,t:'“휘지 않는 화살표” 고유벡터와 고윳값',q:'변환해도 방향이 그대로인 벡터가 있을까?',
 m:['고유벡터','고윳값','특성방정식'],a:['주성분분석','진동 모드'],
 note:'Av = λv 를 만족하는 v 가 고유벡터입니다. λ 는 그 방향에서 길이가 몇 배가 되는지를 말합니다.',
 build:eigenDemo},
{n:250,core:0,t:'“백 번 곱하지 않는 법” 대각화와 거듭제곱',q:'A¹⁰⁰ 을 빨리 구할 수 있을까?',
 m:['대각화','고윳값','거듭제곱'],a:['마르코프 연쇄','반복 시스템'],
 note:'A = PDP⁻¹ 이면 Aⁿ = PDⁿP⁻¹ 입니다. 행렬의 거듭제곱이 수의 거듭제곱으로 바뀝니다.',
 build:matPowDemo},
{n:251,core:0,t:'“한 번에 뛰어넘기” 피보나치의 행렬 표현',q:'점화식을 곱셈 한 번으로 바꿀 수 있을까?',
 m:['점화식','행렬 거듭제곱','비네 공식'],a:['알고리즘 최적화','수열의 일반항'],
 note:'점화식을 행렬 하나로 적으면 거듭제곱이 됩니다. 같은 수열을 무리수 식으로도 쓸 수 있습니다.',
 build:fibMatDemo}
];` + s.slice(i + key.length);
}

/* PROBLEMS · MISSIONS */
{
  const m = s.match(/const PROBLEMS=(\{.*?\});/);
  if (!m) throw new Error('PROBLEMS 앵커 실패');
  const PR = JSON.parse(m[1]);
  PR['247'] = { sit: '두 대의 관측소가 각각 「x 의 2배에 y 를 더하면 5」, 「x 에 y 의 3배를 더하면 6」 이라는 조건을 보내 왔습니다.',
    ask: '두 조건으로 위치가 하나로 정해질까? 정해지지 않는 경우는 언제일까?' };
  PR['248'] = { sit: '사진 편집기에서 이미지를 기울였더니 모양뿐 아니라 넓이까지 달라 보입니다.',
    ask: '그 변환이 넓이를 몇 배로 바꾸는지 수 하나로 말할 수 있을까? 좌우가 뒤집힌 것도 알 수 있을까?' };
  PR['249'] = { sit: '어떤 변환을 걸면 대부분의 화살표는 방향까지 휘어지는데, 몇몇은 길이만 달라진 채 그대로 놓입니다.',
    ask: '그런 방향이 정말 있을까? 있다면 몇 개일까? 어떻게 찾을까?' };
  PR['250'] = { sit: '같은 행렬을 100 번 곱해야 하는 계산이 있습니다. 곧이곧대로 하면 99 번의 행렬 곱이 필요합니다.',
    ask: '더 빠른 길이 있을까? 무엇을 미리 알면 계산이 줄어들까?' };
  PR['251'] = { sit: '피보나치 수열의 100 번째 항을 구하려면 앞에서부터 99 번을 더해야 합니다.',
    ask: '중간을 건너뛰고 한 번에 갈 방법이 있을까?' };
  s = s.replace(m[0], 'const PROBLEMS=' + JSON.stringify(PR) + ';');

  const i0 = s.indexOf('const MISSIONS=');
  const mm = s.slice(i0).match(/^const MISSIONS=\{[\s\S]*?\n\};/);
  if (!mm) throw new Error('MISSIONS 앵커 실패');
  const M = new Function('return ' + mm[0].slice('const MISSIONS='.length, -1))();

  M['247'] = [
   {t:'1분 자유 탐색 — 계수를 움직여 보세요. 두 직선이 어떻게 놓이나요?'},
   {t:'오늘의 문제 — c 를 4, d 를 2 로 맞추세요. ad − bc 가 얼마이고 해는 어떻게 되나요?',
    re:'두 직선이 나란히 비켜 갑니다',
    do:'① c 를 4 로 ② d 를 2 로 ③ 행렬식과 그림 확인',
    hand:'2·2 − 1·4 를 계산해 화면 값과 맞춰 보기'},
   {t:'같은 직선으로 — f 를 10 으로 올리세요. 이번에는 해가 어떻게 되나요?',
    re:'같은 직선이 되어 해가 끝없이',
    do:'① f 를 10 으로 ② 두 직선이 겹치는지 보기 ③ 두 식을 견주기',
    hand:'둘째 식을 2 로 나누어 첫째 식과 비교'},
   {t:'(계수, 행렬식, 해의 개수) 를 여섯 줄 기록하세요.'},
   {t:'심화 — 왜 하필 ad − bc 인가: 두 식을 소거법으로 풀어 x, y 의 분모에 모두 ad − bc 가 나오는 것을 확인하고, 그것이 0 일 때 소거 과정이 어디서 막히는지 밝히세요.'}];

  M['248'] = [
   {t:'1분 자유 탐색 — 성분을 움직여 보세요. 평행사변형이 어떻게 변하나요?'},
   {t:'오늘의 문제 — d 를 −1 로 내리세요. 행렬식의 부호가 무엇을 말하나요?',
    re:'두 열의 앞뒤가 바뀌어 방향이 뒤집혔습니다',
    do:'① d 를 −1 로 ② 도형의 색 변화 보기 ③ 두 화살표의 앞뒤 확인',
    hand:'1·(−1) − 0.5·0.2 를 계산'},
   {t:'납작하게 — d 를 0.1 로 맞추세요. 넓이가 얼마가 되나요?',
    re:'평면 전체가 하나의 직선으로 찌그러집니다',
    do:'① d 를 0.1 로 ② 넓이 값 읽기 ③ 두 화살표가 나란한지 보기',
    hand:'두 열이 서로의 몇 배인지 확인'},
   {t:'(성분, 행렬식, 넓이) 를 여섯 줄 기록하세요.'},
   {t:'심화 — 곱의 행렬식: 두 변환을 잇달아 걸면 넓이 배율도 곱해집니다. det(AB) = det A · det B 임을 넓이의 말로 설명하고, 역행렬의 행렬식이 왜 역수인지 밝히세요.'}];

  M['249'] = [
   {t:'1분 자유 탐색 — 방향을 돌려 보세요. 두 화살표의 각이 어떻게 달라지나요?'},
   {t:'오늘의 문제 — 방향을 58° 근처로 맞추세요. 두 화살표가 어떻게 되나요?',
    re:'방향이 그대로입니다',
    do:'① 방향 슬라이더를 58 로 ② sin 값 확인 ③ 길이 배율 읽기',
    hand:'λ² − 5λ + 5 = 0 을 풀어 배율과 견주기'},
   {t:'두 축 보기 — 「고유 방향 표시」를 누르세요. 그런 방향이 몇 개인가요?',
    re:'변환이 붙잡아 두는 축',
    do:'① 버튼 누르기 ② 점선 두 개 확인 ③ 각각의 각도 재기',
    hand:'두 고윳값에 대응하는 방향을 각각 구하기'},
   {t:'(방향, sin, 배율) 을 여섯 줄 기록하세요.'},
   {t:'심화 — 왜 특성방정식인가: Av = λv 를 (A − λI)v = 0 으로 고치면 v 가 0 이 아니려면 det(A − λI) = 0 이어야 함을 설명하고, 판별식이 음수일 때 무슨 일이 생기는지 밝히세요.'}];

  M['250'] = [
   {t:'1분 자유 탐색 — n 을 키워 보세요. 네 색 선이 어떻게 되나요?'},
   {t:'오늘의 문제 — n 을 12 로 올리세요. 네 성분의 관계가 어떻게 되나요?',
    re:'작은 쪽은 묻혀 사라집니다',
    do:'① n 을 12 로 ② 네 선의 간격 보기 ③ 보라 점선과 견주기',
    hand:'λ₁ 과 λ₂ 를 구해 어느 쪽이 큰지 확인'},
   {t:'빠른 길 — 「대각화로 계산해 보기」를 누르세요. 무엇이 무엇으로 바뀌나요?',
    re:'수 두 개의 거듭제곱으로 바뀝니다',
    do:'① 버튼 누르기 ② λ₁ⁿ 값 확인 ③ 성분과 견주기',
    hand:'λ₁¹² 를 계산해 화면의 성분과 비교'},
   {t:'(n, 성분, λ₁ⁿ) 을 여섯 줄 기록하세요.'},
   {t:'심화 — 왜 되는가: A = PDP⁻¹ 일 때 A² = PD²P⁻¹ 임을 곱해서 보이고, 이것이 n 번 반복해도 성립하는 까닭을 설명하세요. 고윳값이 같을 때 대각화가 안 되는 예도 찾아보세요.'}];

  M['251'] = [
   {t:'1분 자유 탐색 — n 을 키워 보세요. 네 칸의 수가 어떻게 달라지나요?'},
   {t:'오늘의 문제 — n 을 12 로 올리세요. 네 칸에 어떤 수가 들어 있나요?',
    re:'이웃한 세 피보나치 수로 정확히 채워집니다',
    do:'① n 을 12 로 ② 네 칸의 수 읽기 ③ 아래 막대와 견주기',
    hand:'F(12) 와 F(13) 을 손으로 세어 확인'},
   {t:'무리수로도 — 「비네 공식과 견주기」를 누르세요. 값이 어떤가요?',
    re:'언제나 정수를 내놓습니다',
    do:'① 버튼 누르기 ② 소수점 아래 확인 ③ 행렬 값과 비교',
    hand:'ψ¹² 의 크기를 어림해 왜 무시할 수 있는지 확인'},
   {t:'(n, F(n), 비네 값) 을 여섯 줄 기록하세요.'},
   {t:'심화 — 두 얼굴 잇기: [[1,1],[1,0]] 의 고윳값이 φ 와 ψ 임을 특성방정식으로 구하고, 대각화에서 비네 공식이 나오는 과정을 따라가세요.'}];

  s = s.slice(0, i0) + 'const MISSIONS=' + JSON.stringify(M, null, 1) + ';' + s.slice(i0 + mm[0].length);

  /* 자기일치 감사 */
  const PR2 = JSON.parse(s.match(/const PROBLEMS=(\{.*?\});/)[1]);
  const labsBlock = s.slice(s.indexOf('const LABS=['), s.indexOf('const THUMBS ='));
  const demoSrc = fs.readFileSync('algAB-demos.txt', 'utf8');
  let bad = 0;
  const KEYS = ['247', '248', '249', '250', '251'];
  KEYS.forEach((k, ki) => {
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
  const key = s.match(/  link:'나머지 연산\(LAB 14\)의 응용이며, 통계적 분포 감각과 함께 다룹니다\.'\}\r?\n\];/);
  if (!key) throw new Error('PRINS 끝 앵커 실패');
  s = s.replace(key[0], `  link:'나머지 연산(LAB 14)의 응용이며, 통계적 분포 감각과 함께 다룹니다.'},

{tex:[
   {t:'A\\\\vec{x}=\\\\vec{b}', s:'연립방정식 전체를 <b>한 줄</b>로 적은 것입니다.'},
   {t:'A^{-1}=\\\\frac{1}{ad-bc}\\\\left(d,\\\\ -b;\\\\ -c,\\\\ a\\\\right)', s:'분모에 <b>ad − bc</b> 가 있으니 그것이 0 이면 만들 수 없습니다.'},
   {t:'ad-bc=0 \\\\Rightarrow \\\\text{해가 없거나 무수히 많다}', s:'두 직선이 <b>나란하거나 겹칩니다</b>.'}
  ],
  next:[
   {lv:'바로',   t:'판정 연습', d:'계수만 보고 해의 개수를 먼저 말해 보세요.'},
   {lv:'심화',   t:'소거법으로', d:'소거 과정에서 ad − bc 가 나오는 자리를 찾으세요.'},
   {lv:'프로젝트', t:'3원 1차', d:'미지수 셋일 때의 판정 조건을 조사하세요.'}
  ],
  eq:'x = (ed − bf)/(ad − bc), y = (af − ec)/(ad − bc)',
  what:'푸는 것보다 <b>풀리는지 먼저 묻는</b> 사고를 익히는 실험입니다.',
  probe:'행렬식이 0 이 되는 순간 두 직선이 나란해집니다.',
  link:'연립방정식(LAB 04)의 심화이며, 가우스 소거법으로 이어집니다.'},

{tex:[
   {t:'\\\\det A = ad-bc', s:'변환이 <b>넓이를 몇 배로</b> 바꾸는지를 담은 한 개의 수입니다.'},
   {t:'\\\\text{넓이}=\\\\left|\\\\det A\\\\right|', s:'크기는 <b>절댓값</b>, 부호는 방향을 말합니다.'},
   {t:'\\\\det(AB)=\\\\det A\\\\cdot\\\\det B', s:'변환을 이으면 배율도 <b>곱해집니다</b>.'}
  ],
  next:[
   {lv:'바로',   t:'배율 재기', d:'여러 변환의 넓이 배율을 직접 재세요.'},
   {lv:'심화',   t:'부호의 뜻', d:'음수가 되는 조건을 두 열의 순서로 설명하세요.'},
   {lv:'프로젝트', t:'3차원으로', d:'3×3 행렬식이 부피 배율임을 조사하세요.'}
  ],
  eq:'넓이 = |ad − bc|',
  what:'추상적인 기호를 <b>넓이라는 눈에 보이는 양</b>으로 바꾸는 실험입니다.',
  probe:'두 열이 나란해지면 넓이가 0 으로 눌립니다.',
  link:'역행렬(LAB 247)의 조건을 기하로 설명해 줍니다.'},

{tex:[
   {t:'A\\\\vec{v}=\\\\lambda\\\\vec{v}', s:'방향은 그대로, <b>길이만</b> λ 배가 되는 벡터입니다.'},
   {t:'\\\\det(A-\\\\lambda I)=0', s:'v 가 0 이 아니려면 이 식이 <b>반드시</b> 성립해야 합니다.'},
   {t:'\\\\lambda^{2}-(a+d)\\\\lambda+(ad-bc)=0', s:'2×2 에서는 <b>대각합과 행렬식</b>만으로 정해집니다.'}
  ],
  next:[
   {lv:'바로',   t:'축 찾기', d:'방향을 돌려 고유 방향을 손으로 찾으세요.'},
   {lv:'심화',   t:'복소 고윳값', d:'판별식이 음수인 변환의 뜻을 조사하세요.'},
   {lv:'프로젝트', t:'주성분 맛보기', d:'자료가 가장 퍼진 방향을 고유벡터로 찾으세요.'}
  ],
  eq:'A v = λ v · λ² − (a + d)λ + (ad − bc) = 0',
  what:'변환이 <b>붙잡아 두는 방향</b>을 찾는 것이 선형대수의 중심입니다.',
  probe:'고유 방향에서는 두 화살표가 한 직선 위에 놓입니다.',
  link:'행렬 변환(LAB 100)의 심화이며, 주성분분석의 뿌리입니다.'},

{tex:[
   {t:'A=PDP^{-1}', s:'고유벡터를 열로 세운 P 가 <b>좌표를 갈아 끼웁니다</b>.'},
   {t:'A^{n}=PD^{n}P^{-1}', s:'가운데만 거듭제곱하면 되니 <b>계산이 줄어듭니다</b>.'},
   {t:'D^{n}=\\\\text{대각}(\\\\lambda_1^{n},\\\\ \\\\lambda_2^{n})', s:'행렬의 거듭제곱이 <b>수의 거듭제곱</b>이 됩니다.'}
  ],
  next:[
   {lv:'바로',   t:'값 견주기', d:'Aⁿ 의 성분과 λ₁ⁿ 을 나란히 재세요.'},
   {lv:'심화',   t:'지배하는 쪽', d:'큰 고윳값이 판을 지배하는 까닭을 설명하세요.'},
   {lv:'프로젝트', t:'마르코프', d:'전이행렬의 거듭제곱으로 정상상태를 찾으세요.'}
  ],
  eq:'Aⁿ = P Dⁿ P⁻¹',
  what:'어려운 계산을 <b>좌표를 바꾸어</b> 쉬운 계산으로 만드는 실험입니다.',
  probe:'n 이 커질수록 큰 고윳값 쪽만 남습니다.',
  link:'고윳값(LAB 249)의 바로 다음 단계이며, 점화식 풀이로 이어집니다.'},

{tex:[
   {t:'F_{n+1}=F_{n}+F_{n-1}', s:'앞의 두 항이 다음 항을 정하는 <b>점화식</b>입니다.'},
   {t:'M=\\\\left(1,\\\\ 1;\\\\ 1,\\\\ 0\\\\right),\\\\quad M^{n}\\\\text{의 성분}=(F_{n+1},F_{n},F_{n},F_{n-1})', s:'점화식이 <b>행렬 하나</b>가 됩니다.'},
   {t:'F_{n}=\\\\frac{\\\\varphi^{n}-\\\\psi^{n}}{\\\\sqrt{5}}', s:'무리수만 들어 있는데 값은 <b>언제나 정수</b>입니다.'}
  ],
  next:[
   {lv:'바로',   t:'값 확인', d:'F(12) 를 손으로 세어 화면과 견주세요.'},
   {lv:'심화',   t:'고윳값 구하기', d:'M 의 고윳값이 φ, ψ 임을 보이세요.'},
   {lv:'프로젝트', t:'빠른 거듭제곱', d:'제곱을 반복해 F(100) 을 열 번 만에 구하세요.'}
  ],
  eq:'Fₙ = (φⁿ − ψⁿ) / √5',
  what:'같은 수열을 <b>행렬로도 무리수로도</b> 쓸 수 있음을 보는 실험입니다.',
  probe:'n 을 키우면 행렬의 네 칸이 이웃한 피보나치 수로 채워집니다.',
  link:'점화식(LAB 125)과 대각화(LAB 250)를 잇는 다리입니다.'}
];`);
}

/* THUMBS */
{
  const key = s.match(/   '한 막대만 유난히 높은 글자 빈도 그래프'\)\r?\n\];/);
  if (!key) throw new Error('THUMBS 끝 앵커 실패');
  s = s.replace(key[0], `   '한 막대만 유난히 높은 글자 빈도 그래프'),

 svg(\`<line x1="16" y1="70" x2="104" y2="26" stroke="\${TC.blue}" stroke-width="2"/>
   <line x1="16" y1="60" x2="104" y2="16" stroke="\${TC.rose}" stroke-width="2" stroke-dasharray="4 3"/>
   <line x1="10" y1="80" x2="110" y2="80" stroke="\${TC.ink3}" stroke-width="1" opacity=".5"/>
   <text x="60" y="94" font-size="8" font-weight="800" fill="\${TC.ink3}" text-anchor="middle">ad − bc = 0</text>\`,
   '나란히 놓여 만나지 않는 두 직선 그림'),

 svg(\`<rect x="20" y="34" width="34" height="34" fill="none" stroke="\${TC.ink3}" stroke-width="1.2" stroke-dasharray="4 3"/>
   <polygon points="58,68 92,68 106,34 72,34" fill="\${TC.blue}" opacity=".28" stroke="\${TC.blue}" stroke-width="1.6"/>
   <text x="37" y="82" font-size="8" font-weight="800" fill="\${TC.ink3}" text-anchor="middle">1</text>
   <text x="82" y="82" font-size="8" font-weight="800" fill="\${TC.blue}" text-anchor="middle">|det|</text>\`,
   '단위정사각형과 그것이 옮겨 간 평행사변형'),

 svg(\`<line x1="18" y1="72" x2="102" y2="20" stroke="\${TC.ink3}" stroke-width="1.2" stroke-dasharray="5 4" opacity=".7"/>
   <line x1="60" y1="48" x2="86" y2="32" stroke="\${TC.blue}" stroke-width="2.4"/>
   <line x1="60" y1="48" x2="100" y2="23" stroke="\${TC.rose}" stroke-width="2.4"/>
   <circle cx="60" cy="48" r="3" fill="\${TC.ink3}"/>
   <text x="60" y="92" font-size="8" font-weight="800" fill="\${TC.ink3}" text-anchor="middle">A v = λ v</text>\`,
   '한 직선 위에 겹쳐 놓인 v 와 Av 화살표'),

 svg(\`<path d="M18 74 C44 72 62 58 78 30 L86 18" stroke="\${TC.blue}" stroke-width="2.2" fill="none"/>
   <path d="M18 76 C46 75 66 66 84 34" stroke="\${TC.rose}" stroke-width="1.6" fill="none" stroke-dasharray="4 3"/>
   <line x1="12" y1="78" x2="110" y2="78" stroke="\${TC.ink3}" stroke-width="1" opacity=".5"/>
   <text x="60" y="94" font-size="8" font-weight="800" fill="\${TC.ink3}" text-anchor="middle">λ₁ⁿ</text>\`,
   '거듭제곱에 따라 치솟는 두 곡선'),

 svg(\`<g fill="\${TC.blue}" opacity=".6">
   <rect x="18" y="72" width="10" height="6"/><rect x="32" y="70" width="10" height="8"/>
   <rect x="46" y="66" width="10" height="12"/><rect x="60" y="58" width="10" height="20"/>
   <rect x="74" y="46" width="10" height="32"/></g>
   <rect x="88" y="26" width="10" height="52" fill="\${TC.rose}" opacity=".7"/>
   <text x="60" y="20" font-size="9" font-weight="800" fill="\${TC.teal}" text-anchor="middle">1 1 / 1 0</text>\`,
   '피보나치 수가 커지는 막대와 행렬 표시')
];`);
}

new Function(s);   // 구문 검사
fs.writeFileSync(P, s);

/* LABCAT */
{
  const C = 'src/55-catalog.js';
  let c = fs.readFileSync(C, 'utf8');
  const m = c.match(/(\{k:'cult',g:'수학과 문화 · 암호'[^}]*\})(\r?\n\];)/);
  if (!m) throw new Error('LABCAT 끝 앵커 실패');
  c = c.replace(m[0], m[1] + `,
{k:'xalg',g:'고급 대수 · 역행렬과 해의 개수',b:'det=0 을 검사하지 않고 나눠 화면에 무한대가 뜸'},
{k:'xalg',g:'고급 대수 · 행렬식의 뜻',b:'행렬식의 부호를 버려 방향이 뒤집힌 것이 안 보임'},
{k:'xalg',g:'고급 대수 · 고유벡터',b:'길이가 같은 벡터를 고유벡터로 판정해 방향이 바뀐 것까지 표시함'},
{k:'xalg',g:'고급 대수 · 대각화',b:'P D P⁻¹ 에서 P⁻¹ 을 빠뜨려 거듭제곱이 원래 행렬과 어긋남'},
{k:'xalg',g:'고급 대수 · 피보나치 행렬',b:'비네 공식에서 ψⁿ 항을 빼 버려 작은 n 에서 값이 어긋남'}` + m[2]);
  fs.writeFileSync(C, c);
}
console.log('LAB 247~251 (고급 대수 A · 5종) 설치 완료');
