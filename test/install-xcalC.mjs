// 고급 미적분 C — LAB 272~276 (중적분·야코비안·선적분·보존장·그린 정리) 전 계층 설치
import fs from 'node:fs';
const P = 'src/40-demos.js';
let s = fs.readFileSync(P, 'utf8');
const NAMES = ['doubleIntDemo', 'jacobianDemo', 'lineIntDemo', 'conservDemo', 'greenDemo'];
if (s.includes('function doubleIntDemo')) throw new Error('이미 설치됨');
for (const n of NAMES) if (s.includes('function ' + n + '(')) throw new Error('이름 충돌: ' + n);

{ const i = s.indexOf('const LABS=[');
  s = s.slice(0, i) + '\n' + fs.readFileSync('algAG-demos.txt', 'utf8') + '\n' + s.slice(i); }

{ const key = ' build:lagrangeDemo}\n];';
  const i = s.indexOf(key);
  if (i < 0) throw new Error('LABS 끝 앵커 실패');
  s = s.slice(0, i) + ` build:lagrangeDemo},
{n:272,core:0,t:'“순서를 바꾸면 구간도” 중적분',q:'어느 변수부터 적분해도 될까?',
 m:['중적분','적분 순서','영역'],a:['누적 계산','면적·부피'],
 note:'순서를 바꿔도 되지만 구간을 함께 고쳐야 합니다. 구간을 그대로 두면 영역이 달라집니다.',
 build:doubleIntDemo},
{n:273,core:0,t:'“왜 r 을 곱하나” 극좌표와 야코비안',q:'좌표를 바꾸면 넓이도 바뀔까?',
 m:['극좌표','야코비안','넓이 배율'],a:['원형 영역 적분','좌표 변환'],
 note:'극좌표에서 작은 조각의 넓이는 r·dr·dθ 입니다. 바깥쪽 조각이 그만큼 더 크기 때문입니다.',
 build:jacobianDemo},
{n:274,core:0,t:'“바람을 거슬러 갈 때” 벡터장의 선적분',q:'드는 힘을 어떻게 셀까?',
 m:['벡터장','선적분','내적'],a:['일과 에너지','유동장 해석'],
 note:'한 걸음의 값은 힘과 걸음 방향의 내적입니다. 크기의 곱으로 세면 방향이 사라집니다.',
 build:lineIntDemo},
{n:275,core:0,t:'“어느 길로 가든 같은가” 보존장',q:'경로에 상관없는 힘이 있을까?',
 m:['보존장','회전','퍼텐셜'],a:['위치에너지','전위'],
 note:'회전이 0 이면 경로와 무관하고, 그때 퍼텐셜 함수가 있습니다.',
 build:conservDemo},
{n:276,core:0,t:'“둘레만 돌아 넓이 재기” 그린 정리',q:'안을 보지 않고 넓이를 알 수 있을까?',
 m:['그린 정리','선적분','넓이'],a:['면적계','도형 계측'],
 note:'넓이 = ½∮(x dy − y dx) 입니다. 도는 방향이 부호를 정합니다.',
 build:greenDemo}
];` + s.slice(i + key.length);
}

{
  const m = s.match(/const PROBLEMS=(\{.*?\});/);
  if (!m) throw new Error('PROBLEMS 앵커 실패');
  const PR = JSON.parse(m[1]);
  PR['272'] = { sit: '삼각형 모양의 땅에서 무언가를 더해 나가려 합니다. 세로로 훑을지 가로로 훑을지 정해야 합니다.',
    ask: '어느 쪽으로 훑어도 결과가 같을까? 무엇을 함께 바꿔야 할까?' };
  PR['273'] = { sit: '원 모양 영역을 잘게 나누어 넓이를 세는데, 부채꼴 조각은 바깥쪽이 안쪽보다 커 보입니다.',
    ask: '모든 조각을 같은 크기로 세면 어떻게 될까? 무엇을 곱해야 할까?' };
  PR['274'] = { sit: '바람 부는 운동장을 한 바퀴 돕니다. 바람을 등질 때는 편하고 거스를 때는 힘듭니다.',
    ask: '한 바퀴 도는 데 든 힘의 총합을 어떻게 셀까? 편한 구간은 어떻게 셈에 넣을까?' };
  PR['275'] = { sit: '산 아래에서 정상까지 두 갈래 길이 있습니다. 어느 길로 올라도 드는 힘이 같다고 합니다.',
    ask: '정말 언제나 그럴까? 길에 따라 달라지는 힘도 있을까?' };
  PR['276'] = { sit: '지도 위 땅의 넓이를 재는 도구가 있습니다. 테두리를 따라 한 바퀴 굴리기만 하면 넓이가 나옵니다.',
    ask: '안을 들여다보지 않고 어떻게 넓이를 알 수 있을까?' };
  s = s.replace(m[0], 'const PROBLEMS=' + JSON.stringify(PR) + ';');

  const i0 = s.indexOf('const MISSIONS=');
  const mm = s.slice(i0).match(/^const MISSIONS=\{[\s\S]*?\n\};/);
  if (!mm) throw new Error('MISSIONS 앵커 실패');
  const M = new Function('return ' + mm[0].slice('const MISSIONS='.length, -1))();

  M['272'] = [
   {t:'1분 자유 탐색 — 훑는 자리를 옮겨 보세요. 붉은 띠가 어떻게 움직이나요?'},
   {t:'오늘의 문제 — 적분 순서를 「x 먼저」로 바꾸세요. 계산값이 달라지나요?',
    re:'구간도 y 부터 1 까지로 고쳤더니',
    do:'① 순서를 x 먼저로 ② 계산값 확인 ③ 붉은 띠의 방향 보기',
    hand:'∫₀¹∫_y¹ xy dx dy 를 손으로 계산'},
   {t:'구간을 안 고치면 — 「구간은 그대로 두기」를 켜세요. 무슨 일이 생기나요?',
    re:'영역이 사각형으로 넓어져',
    do:'① 체크 켜기 ② 계산값 확인 ③ 붉은 띠가 초록 밖으로 나가는지 보기',
    hand:'사각형 위 적분값 1/4 을 계산해 견주기'},
   {t:'(순서, 구간, 계산값) 을 여섯 줄 기록하세요.'},
   {t:'심화 — 왜 같은가: 푸비니 정리가 「적분 순서를 바꿔도 된다」고 말하는 조건을 조사하고, 조건이 깨지는 예를 하나 찾아보세요.'}];

  M['273'] = [
   {t:'1분 자유 탐색 — 조각의 수를 늘려 보세요. 색이 어떻게 달라지나요?'},
   {t:'오늘의 문제 — 조각의 수를 20 으로 올리세요. 계산값이 참값과 맞나요?',
    re:'참값 πr² 에 딱 맞습니다',
    do:'① 조각 수를 20 으로 ② 두 막대 견주기 ③ 비율 값 읽기',
    hand:'πr² 을 계산해 화면 값과 맞춰 보기'},
   {t:'r 을 빼먹으면 — 「r 을 곱하지 않고 계산하기」를 켜세요.',
    re:'바깥 조각을 안쪽과 같게 세어',
    do:'① 체크 켜기 ② 계산값 확인 ③ 조각의 색이 같아진 것 보기',
    hand:'바깥 조각과 안쪽 조각의 넓이 비를 어림'},
   {t:'(조각 수, r 곱함, 계산값, 참값) 을 여섯 줄 기록하세요.'},
   {t:'심화 — 야코비안: x = r cos θ, y = r sin θ 의 편미분 행렬을 만들고 그 행렬식이 r 임을 확인하세요. 행렬식이 곧 넓이 배율(LAB 248)이라는 것과 이어 보세요.'}];

  M['274'] = [
   {t:'1분 자유 탐색 — 걸어간 정도를 늘려 보세요. 값이 어떻게 변하나요?'},
   {t:'오늘의 문제 — 출발 각도를 0° 로 맞추고 걸어간 정도를 25 % 로 하세요.',
    re:'바람을 거스르는 동안은 오히려 빼야 합니다',
    do:'① 출발 각도를 0 으로 ② 진행을 25 % 로 ③ 값의 부호 확인',
    hand:'그 구간에서 힘과 걸음 방향이 이루는 각을 그려 보기'},
   {t:'크기만 세면 — 「내적 대신 크기의 곱으로 세기」를 켜세요.',
    re:'거스르는 구간이 사라집니다',
    do:'① 체크 켜기 ② 값의 부호 확인 ③ 진행을 늘려도 계속 커지는지 보기',
    hand:'cos θ 가 빠지면 무엇이 사라지는지 적기'},
   {t:'(출발각, 진행률, 값) 을 여섯 줄 기록하세요.'},
   {t:'심화 — 한 바퀴의 뜻: 닫힌 곡선을 한 바퀴 돌 때의 값이 「회전량 × 넓이」와 같음을 확인하고, 그것이 무엇을 뜻하는지 설명하세요.'}];

  M['275'] = [
   {t:'1분 자유 탐색 — 아래 길의 휘어짐을 바꿔 보세요. 두 값이 어떻게 되나요?'},
   {t:'오늘의 문제 — k 를 1.00 으로 올리세요. 두 길의 값이 같나요?',
    re:'회전이 0 이 아니니 길에 따라 값이 달라집니다',
    do:'① k 를 1.00 으로 ② 두 값 견주기 ③ 회전 값 확인',
    hand:'∂Q/∂x − ∂P/∂y 를 손으로 계산'},
   {t:'되돌리면 — k 를 0 으로 되돌리고 휘어짐을 1.00 으로 키우세요.',
    re:'퍼텐셜 x² \\+ y² 의 차이만 남습니다',
    do:'① k 를 0 으로 ② 휘어짐을 1.00 으로 ③ 두 값이 같은지 확인',
    hand:'x² + y² 의 두 끝점 값의 차를 계산해 견주기'},
   {t:'(k, 휘어짐, 두 값, 차이) 를 여섯 줄 기록하세요.'},
   {t:'심화 — 퍼텐셜 찾기: 보존장이면 F = ∇φ 인 φ 가 있습니다. k = 0 일 때 φ 를 직접 구하고, 선적분이 φ(끝) − φ(처음) 과 같음을 확인하세요.'}];

  M['276'] = [
   {t:'1분 자유 탐색 — 돈 정도를 늘려 보세요. 붉은 선분이 무엇을 쓸고 가나요?'},
   {t:'오늘의 문제 — 돈 정도를 100 % 로 하세요. 둘레 적분이 무엇과 같아지나요?',
    re:'둘레를 한 바퀴 돌았을 뿐인데 안쪽 넓이가',
    do:'① 돈 정도를 100 으로 ② 두 막대 견주기 ③ 꼭짓점 수를 늘려 다시 보기',
    hand:'정다각형의 넓이 공식으로 계산해 견주기'},
   {t:'거꾸로 돌면 — 「반대 방향으로 돌기」를 켜세요. 값이 어떻게 되나요?',
    re:'부호가 도는 방향을 기억합니다',
    do:'① 체크 켜기 ② 값의 부호 확인 ③ 다시 100 % 까지 돌리기',
    hand:'½(x dy − y dx) 에서 방향을 뒤집으면 무엇이 바뀌는지 적기'},
   {t:'(꼭짓점 수, 방향, 둘레 적분, 실제 넓이) 를 여섯 줄 기록하세요.'},
   {t:'심화 — 그린 정리: ∮(P dx + Q dy) = ∬(∂Q/∂x − ∂P/∂y) dA 에서 P = −y/2, Q = x/2 를 넣으면 오른쪽이 넓이가 됨을 확인하고, 면적계가 이 원리로 움직인다는 것을 설명하세요.'}];

  s = s.slice(0, i0) + 'const MISSIONS=' + JSON.stringify(M, null, 1) + ';' + s.slice(i0 + mm[0].length);

  const PR2 = JSON.parse(s.match(/const PROBLEMS=(\{.*?\});/)[1]);
  const labsBlock = s.slice(s.indexOf('const LABS=['), s.indexOf('const THUMBS ='));
  const demoSrc = fs.readFileSync('algAG-demos.txt', 'utf8');
  let bad = 0;
  ['272', '273', '274', '275', '276'].forEach((k, ki) => {
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
      const plain = x.re.replace(/\\/g, '');
      const c = body.split(plain).length - 1;
      if (c !== 1) { console.log(`데모 본문 등장 ${c} 회! LAB ${k} S${ix + 1} — ${plain}`); bad++; }
    });
  });
  if (bad) throw new Error('감사 ' + bad + '건');
}

/* PRINS */
{
  const key = s.match(/  link:'조건부 최적화의 표준 도구이며, 경제·공학에서 널리 씁니다\.'\}\r?\n\];/);
  if (!key) throw new Error('PRINS 끝 앵커 실패');
  s = s.replace(key[0], `  link:'조건부 최적화의 표준 도구이며, 경제·공학에서 널리 씁니다.'},

{tex:[
   {t:'\\\\int_{0}^{1}\\\\!\\\\int_{0}^{x} xy\\\\ dy\\\\,dx=\\\\frac{1}{8}', s:'세로로 훑으면 y 가 <b>0 부터 x 까지</b>입니다.'},
   {t:'\\\\int_{0}^{1}\\\\!\\\\int_{y}^{1} xy\\\\ dx\\\\,dy=\\\\frac{1}{8}', s:'가로로 훑으면 x 가 <b>y 부터 1 까지</b>로 바뀝니다.'},
   {t:'\\\\int_{0}^{1}\\\\!\\\\int_{0}^{1} xy\\\\ dx\\\\,dy=\\\\frac{1}{4}', s:'구간을 안 고치면 <b>사각형</b>을 적분한 것이 됩니다.'}
  ],
  next:[
   {lv:'바로',   t:'두 식 세우기', d:'같은 영역을 두 순서로 각각 적어 보세요.'},
   {lv:'심화',   t:'값 확인', d:'두 적분을 손으로 계산해 같음을 확인하세요.'},
   {lv:'프로젝트', t:'어려운 순서', d:'한 순서로는 못 푸는 적분을 찾아 순서를 바꿔 푸세요.'}
  ],
  eq:'순서를 바꾸면 구간도 함께 바꾼다',
  what:'적분 기호 안의 <b>구간이 영역을 기억한다</b>는 것을 확인합니다.',
  probe:'구간을 그대로 둔 채 순서만 바꾸면 값이 두 배가 됩니다.',
  link:'정적분(LAB 139)을 평면 영역으로 넓힌 자리입니다.'},

{tex:[
   {t:'x=r\\\\cos\\\\theta,\\\\quad y=r\\\\sin\\\\theta', s:'원 모양 영역에 알맞은 <b>좌표</b>입니다.'},
   {t:'dA=r\\\\,dr\\\\,d\\\\theta', s:'조각의 넓이에 <b>r</b> 이 따라붙습니다.'},
   {t:'J=\\\\begin{vmatrix}\\\\cos\\\\theta & -r\\\\sin\\\\theta \\\\\\\\ \\\\sin\\\\theta & r\\\\cos\\\\theta\\\\end{vmatrix}=r', s:'그 r 이 바로 <b>야코비안</b>입니다.'}
  ],
  next:[
   {lv:'바로',   t:'원 넓이', d:'극좌표로 원의 넓이를 적분해 구하세요.'},
   {lv:'심화',   t:'행렬식 확인', d:'야코비안 행렬식이 r 임을 계산하세요.'},
   {lv:'프로젝트', t:'가우스 적분', d:'극좌표로 ∫e^(−x²) dx 를 구해 보세요.'}
  ],
  eq:'dA = r dr dθ',
  what:'좌표를 바꿀 때 따라붙는 <b>넓이 배율</b>을 눈으로 보는 실험입니다.',
  probe:'r 을 빼면 바깥 조각을 안쪽과 같게 세어 넓이가 어긋납니다.',
  link:'행렬식이 넓이 배율(LAB 248)이라는 사실의 직접적인 응용입니다.'},

{tex:[
   {t:'\\\\int_{C}\\\\vec{F}\\\\cdot d\\\\vec{r}=\\\\int_{a}^{b}\\\\vec{F}(\\\\vec{r}(t))\\\\cdot\\\\vec{r}\\\\,\\\\!(t)\\\\,dt', s:'한 걸음마다 <b>내적</b>을 더합니다.'},
   {t:'\\\\vec{F}\\\\cdot d\\\\vec{r}=\\\\left|\\\\vec{F}\\\\right|\\\\left|d\\\\vec{r}\\\\right|\\\\cos\\\\theta', s:'둔각이면 값이 <b>음수</b>가 됩니다.'},
   {t:'\\\\oint_{C}\\\\vec{F}\\\\cdot d\\\\vec{r}=\\\\iint_{D}\\\\left(Q_x-P_y\\\\right)dA', s:'한 바퀴 값은 <b>안쪽의 회전</b>을 모은 것입니다.'}
  ],
  next:[
   {lv:'바로',   t:'부호 찾기', d:'값이 음수가 되는 구간을 찾으세요.'},
   {lv:'심화',   t:'한 바퀴', d:'닫힌 곡선의 값이 무엇과 같은지 확인하세요.'},
   {lv:'프로젝트', t:'유동장', d:'실제 바람 자료로 경로별 값을 비교하세요.'}
  ],
  eq:'∫ F · dr = ∫ |F||dr| cos θ',
  what:'「힘이 든다」를 <b>방향까지 넣어</b> 정확히 세는 실험입니다.',
  probe:'크기의 곱으로 바꾸면 거스르는 구간이 사라집니다.',
  link:'내적(LAB 162)과 정적분(LAB 139)이 만나는 자리입니다.'},

{tex:[
   {t:'\\\\frac{\\\\partial Q}{\\\\partial x}=\\\\frac{\\\\partial P}{\\\\partial y}\\\\ \\\\iff\\\\ \\\\text{보존장}', s:'회전이 0 이라는 <b>조건</b>입니다.'},
   {t:'\\\\vec{F}=\\\\nabla\\\\varphi', s:'그때 <b>퍼텐셜</b> φ 가 있습니다.'},
   {t:'\\\\int_{A}^{B}\\\\vec{F}\\\\cdot d\\\\vec{r}=\\\\varphi(B)-\\\\varphi(A)', s:'값이 <b>끝점만</b>으로 정해집니다.'}
  ],
  next:[
   {lv:'바로',   t:'조건 확인', d:'회전이 0 이 되는 k 를 찾으세요.'},
   {lv:'심화',   t:'퍼텐셜 구하기', d:'φ 를 직접 구해 두 끝점 값의 차와 견주세요.'},
   {lv:'프로젝트', t:'위치에너지', d:'중력장이 보존장임을 확인하고 의미를 쓰세요.'}
  ],
  eq:'Qx = Py ⇔ 보존장 ⇔ F = ∇φ',
  what:'「경로와 무관하다」와 「퍼텐셜이 있다」가 <b>같은 말</b>임을 확인합니다.',
  probe:'회전을 0 이 아니게 만들면 두 길의 값이 갈라집니다.',
  link:'물리의 위치에너지 개념이 수학적으로 어디서 오는지 보여 줍니다.'},

{tex:[
   {t:'\\\\oint_{C}(P\\\\,dx+Q\\\\,dy)=\\\\iint_{D}\\\\left(\\\\frac{\\\\partial Q}{\\\\partial x}-\\\\frac{\\\\partial P}{\\\\partial y}\\\\right)dA', s:'둘레와 <b>안쪽</b>을 잇는 정리입니다.'},
   {t:'P=-\\\\frac{y}{2},\\\\quad Q=\\\\frac{x}{2}\\\\ \\\\Rightarrow\\\\ Q_x-P_y=1', s:'이렇게 고르면 오른쪽이 <b>넓이</b>가 됩니다.'},
   {t:'\\\\text{넓이}=\\\\frac{1}{2}\\\\oint_{C}(x\\\\,dy-y\\\\,dx)', s:'테두리만 돌면 <b>넓이</b>가 나옵니다.'}
  ],
  next:[
   {lv:'바로',   t:'다각형 넓이', d:'꼭짓점 좌표만으로 넓이를 구해 보세요.'},
   {lv:'심화',   t:'부호의 뜻', d:'도는 방향이 부호를 정하는 까닭을 설명하세요.'},
   {lv:'프로젝트', t:'면적계 만들기', d:'지도 위 땅의 넓이를 좌표만으로 재는 도구를 만드세요.'}
  ],
  eq:'넓이 = ½∮(x dy − y dx)',
  what:'안을 들여다보지 않고 <b>테두리만으로</b> 넓이를 아는 실험입니다.',
  probe:'한 바퀴를 다 돌면 둘레 적분이 정확히 넓이가 됩니다.',
  link:'선적분(LAB 274)의 정점이며, 측량 도구의 원리입니다.'}
];`);
}

/* THUMBS */
{
  const key = s.match(/   '조건 원에 접하는 등고선과 접점'\)\r?\n\];/);
  if (!key) throw new Error('THUMBS 끝 앵커 실패');
  s = s.replace(key[0], `   '조건 원에 접하는 등고선과 접점'),

 svg(\`<polygon points="22,78 98,78 98,18" fill="\${TC.teal}" opacity=".2" stroke="\${TC.teal}" stroke-width="1.6"/>
   <rect x="56" y="40" width="5" height="38" fill="\${TC.rose}" opacity=".8"/>
   <rect x="70" y="30" width="5" height="48" fill="\${TC.rose}" opacity=".5"/>
   <text x="60" y="94" font-size="8" font-weight="800" fill="\${TC.ink3}" text-anchor="middle">dy dx</text>\`,
   '삼각형 영역을 세로 띠로 훑는 그림'),

 svg(\`<g stroke="#fff" stroke-width=".8">
   <path d="M60 46 L60 16 A30 30 0 0 1 81 25 Z" fill="\${TC.blue}" opacity=".7"/>
   <path d="M60 46 L81 25 A30 30 0 0 1 90 46 Z" fill="\${TC.blue}" opacity=".55"/>
   <path d="M60 46 L60 26 A20 20 0 0 1 74 32 Z" fill="\${TC.blue}" opacity=".4"/>
   <path d="M60 46 L60 34 A12 12 0 0 1 68 37 Z" fill="\${TC.blue}" opacity=".25"/></g>
   <circle cx="60" cy="46" r="30" fill="none" stroke="\${TC.teal}" stroke-width="1.6"/>
   <text x="60" y="92" font-size="8" font-weight="800" fill="\${TC.ink3}" text-anchor="middle">r dr dθ</text>\`,
   '바깥으로 갈수록 커지는 부채꼴 조각들'),

 svg(\`<g stroke="\${TC.ink3}" stroke-width="1" opacity=".5">
   <line x1="20" y1="28" x2="32" y2="28"/><line x1="46" y1="28" x2="58" y2="28"/>
   <line x1="72" y1="28" x2="84" y2="28"/><line x1="20" y1="52" x2="32" y2="52"/>
   <line x1="46" y1="52" x2="58" y2="52"/><line x1="72" y1="52" x2="84" y2="52"/>
   <line x1="20" y1="72" x2="32" y2="72"/><line x1="46" y1="72" x2="58" y2="72"/></g>
   <ellipse cx="62" cy="50" rx="36" ry="26" fill="none" stroke="\${TC.blue}" stroke-width="2.2"/>
   <circle cx="26" cy="50" r="4" fill="\${TC.rose}"/>
   <text x="60" y="94" font-size="8" font-weight="800" fill="\${TC.ink3}" text-anchor="middle">F · dr</text>\`,
   '바람 화살표 위를 도는 타원 경로'),

 svg(\`<path d="M22 66 L98 30" stroke="\${TC.blue}" stroke-width="2.4" fill="none"/>
   <path d="M22 66 C46 92 74 84 98 30" stroke="\${TC.rose}" stroke-width="2.4" fill="none"/>
   <circle cx="22" cy="66" r="4.4" fill="\${TC.ink3}"/><circle cx="98" cy="30" r="4.4" fill="\${TC.ink3}"/>
   <text x="60" y="94" font-size="8" font-weight="800" fill="\${TC.ink3}" text-anchor="middle">같은 끝점 · 두 길</text>\`,
   '같은 두 점을 잇는 곧은 길과 돌아가는 길'),

 svg(\`<polygon points="60,14 100,44 84,86 36,86 20,44" fill="\${TC.teal}" opacity=".16"
   stroke="\${TC.blue}" stroke-width="2.4"/>
   <line x1="60" y1="52" x2="100" y2="44" stroke="\${TC.rose}" stroke-width="1.2"/>
   <line x1="60" y1="52" x2="84" y2="86" stroke="\${TC.rose}" stroke-width="1.2"/>
   <polygon points="60,52 100,44 84,86" fill="\${TC.rose}" opacity=".2"/>
   <circle cx="60" cy="52" r="3" fill="\${TC.ink3}"/>
   <text x="60" y="98" font-size="8" font-weight="800" fill="\${TC.ink3}" text-anchor="middle">½∮(x dy − y dx)</text>\`,
   '둘레를 도는 동안 부채꼴을 쓸고 가는 그림')
];`);
}

new Function(s);
fs.writeFileSync(P, s);

{
  const C = 'src/55-catalog.js';
  let c = fs.readFileSync(C, 'utf8');
  const m = c.match(/(\{k:'xcal',g:'고급 미적분 · 라그랑주 승수법'[^}]*\})(\r?\n\];)/);
  if (!m) throw new Error('LABCAT 끝 앵커 실패');
  c = c.replace(m[0], m[1] + `,
{k:'xcal',g:'고급 미적분 · 중적분',b:'순서를 바꿀 때 적분 구간을 그대로 둬 영역이 달라짐'},
{k:'xcal',g:'고급 미적분 · 야코비안',b:'r 을 곱하지 않아 원의 넓이가 π 가 아닌 값으로 나옴'},
{k:'xcal',g:'고급 미적분 · 선적분',b:'내적 대신 크기의 곱을 써 방향과 무관하게 늘 양수가 나옴'},
{k:'xcal',g:'고급 미적분 · 보존장',b:'회전(컬)을 확인하지 않고 늘 경로와 무관하다고 표시함'},
{k:'xcal',g:'고급 미적분 · 그린 정리',b:'도는 방향을 무시해 넓이가 늘 양수로만 나옴'}` + m[2]);
  fs.writeFileSync(C, c);
}
console.log('LAB 272~276 (고급 미적분 C · 5종) 설치 완료');
