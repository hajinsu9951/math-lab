// 고급 기하 B — LAB 282~286 (근축·반전·반전 활용·복비·평면의 방정식) 전 계층 설치
import fs from 'node:fs';
const P = 'src/40-demos.js';
let s = fs.readFileSync(P, 'utf8');
const NAMES = ['radicalDemo', 'inversionDemo', 'inversionSolveDemo', 'crossRatioDemo', 'planeDemo'];
if (s.includes('function radicalDemo')) throw new Error('이미 설치됨');
for (const n of NAMES) if (s.includes('function ' + n + '(')) throw new Error('이름 충돌: ' + n);

{ const i = s.indexOf('const LABS=[');
  s = s.slice(0, i) + '\n' + fs.readFileSync('algAI-demos.txt', 'utf8') + '\n' + s.slice(i); }

{ const key = ' build:powerPointDemo}\n];';
  const i = s.indexOf(key);
  if (i < 0) throw new Error('LABS 끝 앵커 실패');
  s = s.slice(0, i) + ` build:powerPointDemo},
{n:282,core:0,t:'“힘이 같은 점들” 두 원의 근축',q:'두 원에 대해 같은 힘을 갖는 점은 어디일까?',
 m:['방멱','근축','소거'],a:['등거리 경계','기하 판정'],
 note:'두 원의 방정식을 빼면 제곱항이 소거되어 일차식이 남습니다. 두 원이 만나지 않아도 근축은 있습니다.',
 build:radicalDemo},
{n:283,core:0,t:'“직선이 원이 되는 순간” 반전변환',q:'거리를 뒤집으면 도형은 어떻게 될까?',
 m:['반전','원과 직선','등각 사상'],a:['등각 도법','문제 변환'],
 note:'중심에서의 거리를 r²/거리 로 바꿉니다. 중심을 지나지 않는 직선은 중심을 지나는 원이 됩니다.',
 build:inversionDemo},
{n:284,core:0,t:'“어려운 배치를 단순하게” 반전으로 풀기',q:'문제를 푸는 대신 바꿀 수 있을까?',
 m:['반전','접하는 원','문제 변환'],a:['기하 증명 전략','작도'],
 note:'접점을 중심으로 반전하면 접하는 두 원이 두 평행선이 됩니다. 중심을 어디에 두느냐가 전부입니다.',
 build:inversionSolveDemo},
{n:285,core:0,t:'“비스듬히 찍어도 남는 값” 복비',q:'사영에서 살아남는 것은 무엇일까?',
 m:['사영','복비','불변량'],a:['사진 보정','컴퓨터 비전'],
 note:'길이의 비는 사영으로 달라지지만 복비 (AC·BD)/(BC·AD) 는 그대로입니다.',
 build:crossRatioDemo},
{n:286,core:0,t:'“방향만으로는 부족하다” 평면의 방정식',q:'평면 하나를 정하려면 무엇이 필요할까?',
 m:['법선벡터','평면의 방정식','점과 평면의 거리'],a:['3D 모델링','공간 설계'],
 note:'법선은 방향을, 상수항은 위치를 정합니다. 원점까지의 거리는 |d| / |n| 입니다.',
 build:planeDemo}
];` + s.slice(i + key.length);
}

{
  const m = s.match(/const PROBLEMS=(\{.*?\});/);
  if (!m) throw new Error('PROBLEMS 앵커 실패');
  const PR = JSON.parse(m[1]);
  PR['282'] = { sit: '두 개의 원형 감시 구역이 있습니다. 두 구역에 대해 「같은 힘」을 갖는 자리를 표시하라고 합니다.',
    ask: '그런 점들은 어떤 모양을 이룰까? 두 원이 겹치지 않아도 있을까?' };
  PR['283'] = { sit: '중심에서의 거리를 뒤집는 변환이 있습니다. 가까운 것은 멀어지고 먼 것은 가까워집니다.',
    ask: '직선은 무엇으로 바뀔까? 바뀌지 않는 직선도 있을까?' };
  PR['284'] = { sit: '서로 접한 원들이 얽힌 문제는 손대기가 어렵습니다. 그런데 어떤 변환을 한 번 걸면 문제가 쉬워진다고 합니다.',
    ask: '무엇을 어디에 걸어야 할까? 왜 그 자리여야 할까?' };
  PR['285'] = { sit: '칠판을 비스듬히 찍은 사진에서는 같은 간격의 눈금이 한쪽으로 몰려 보입니다.',
    ask: '길이도 비도 다 달라졌는데, 그래도 변하지 않는 값이 있을까?' };
  PR['286'] = { sit: '3D 프로그램에서 평면을 만들려는데 법선 방향만 입력했더니 원하는 자리에 놓이지 않았습니다.',
    ask: '무엇이 더 필요할까? 방향과 위치는 어떻게 나누어 적을까?' };
  s = s.replace(m[0], 'const PROBLEMS=' + JSON.stringify(PR) + ';');

  const i0 = s.indexOf('const MISSIONS=');
  const mm = s.slice(i0).match(/^const MISSIONS=\{[\s\S]*?\n\};/);
  if (!mm) throw new Error('MISSIONS 앵커 실패');
  const M = new Function('return ' + mm[0].slice('const MISSIONS='.length, -1))();

  M['282'] = [
   {t:'1분 자유 탐색 — 점을 옮겨 보세요. 두 방멱의 차이가 어떻게 변하나요?'},
   {t:'오늘의 문제 — 점의 x 를 0.2 로 맞추세요. 두 방멱이 어떻게 되나요?',
    re:'이 점이 근축 위에 있습니다',
    do:'① x 를 0.2 로 ② 두 방멱 값 견주기 ③ 붉은 점선 위에 있는지 보기',
    hand:'두 방멱 식을 빼서 x 에 대한 일차식을 직접 세우기'},
   {t:'떨어뜨리면 — 두 원 사이의 거리를 3.0 으로 늘리세요. 근축이 사라지나요?',
    re:'두 원이 만나지 않는데도 근축은 그대로',
    do:'① 거리를 3.0 으로 ② 두 원이 떨어지는지 보기 ③ 붉은 점선 확인',
    hand:'교점이 없어도 식의 뺄셈은 그대로임을 확인'},
   {t:'(점, 두 방멱, 차이) 를 여섯 줄 기록하세요.'},
   {t:'심화 — 왜 직선인가: 두 원의 방정식을 빼면 x², y² 이 소거되어 ax + by + c = 0 만 남음을 직접 계산하고, 그 직선이 두 중심을 잇는 선분과 수직임을 보이세요.'}];

  M['283'] = [
   {t:'1분 자유 탐색 — 떨어진 거리를 움직여 보세요. 붉은 곡선이 어떻게 달라지나요?'},
   {t:'오늘의 문제 — 떨어진 거리를 1.2 로 올리세요. 직선이 무엇으로 바뀌나요?',
    re:'직선이 원으로 바뀌었습니다',
    do:'① 거리를 1.2 로 ② 붉은 곡선 모양 보기 ③ 결과의 반지름 읽기',
    hand:'r²/(2c) 를 계산해 화면 값과 맞춰 보기'},
   {t:'중심을 지나면 — 떨어진 거리를 0 으로 내리세요. 무슨 일이 생기나요?',
    re:'자기 자신으로 돌아온 것입니다',
    do:'① 거리를 0 으로 ② 두 선이 겹치는지 보기 ③ 기울기를 바꿔도 그런지 확인',
    hand:'중심을 지나는 점의 상이 어디로 가는지 따져 보기'},
   {t:'(반전 반지름, 거리, 결과, 반지름) 을 여섯 줄 기록하세요.'},
   {t:'심화 — 반지름의 유도: 직선 위에서 중심에 가장 가까운 점이 상의 지름 끝으로 감을 이용해 상의 반지름이 r²/(2c) 임을 보이세요.'}];

  M['284'] = [
   {t:'1분 자유 탐색 — 반전 중심을 옮겨 보세요. 결과가 어떻게 달라지나요?'},
   {t:'오늘의 문제 — 반전 중심을 0 (접점) 으로 맞추세요. 두 원이 무엇이 되나요?',
    re:'두 원이 나란한 두 직선이 되었습니다',
    do:'① 중심을 0 으로 ② 두 결과의 모양 보기 ③ 크기 비를 바꿔도 그런지 확인',
    hand:'중심을 지나는 원이 왜 직선이 되는지 적기'},
   {t:'벗어나면 — 중심을 −1.5 로 옮기세요. 다시 어떻게 되나요?',
    re:'중심이 접점에서 벗어나 있으면 결과도 여전히 원',
    do:'① 중심을 −1.5 로 ② 결과가 다시 원인지 보기 ③ 0 으로 되돌려 비교',
    hand:'중심이 도형 위에 있을 때와 아닐 때를 나누어 정리'},
   {t:'(중심, 크기 비, 두 결과) 를 여섯 줄 기록하세요.'},
   {t:'심화 — 왜 평행인가: 접점을 지나는 두 원이 각각 직선이 되고, 그 두 직선이 만나지 않는(평행한) 까닭을 반전이 각을 보존한다는 성질로 설명하세요.'}];

  M['285'] = [
   {t:'1분 자유 탐색 — 직선의 기울기를 바꿔 보세요. 붉은 점들이 어떻게 몰리나요?'},
   {t:'오늘의 문제 — 기울기를 45° 로 맞추세요. 두 복비를 견주세요.',
    re:'사영으로 보존되는 값입니다',
    do:'① 기울기를 45 로 ② 두 복비 값 비교 ③ 다른 각도로도 확인',
    hand:'(AC·BD)/(BC·AD) 를 두 직선에서 각각 계산'},
   {t:'시점을 낮추면 — 시점의 높이를 1.3 으로 내리세요. 길이의 비는 어떤가요?',
    re:'보존되는 것은 비가 아니라 비의 비',
    do:'① 높이를 1.3 으로 ② 길이 비의 변화 보기 ③ 복비는 그대로인지 확인',
    hand:'AB : BC 를 두 직선에서 각각 재어 견주기'},
   {t:'(기울기, 두 복비, 길이 비) 를 여섯 줄 기록하세요.'},
   {t:'심화 — 왜 복비인가: 사영이 길이와 길이의 비를 바꾸어도 「비의 비」는 바꾸지 못하는 까닭을 삼각형의 넓이 비로 설명하고, 사진 보정에 어떻게 쓰이는지 조사하세요.'}];

  M['286'] = [
   {t:'1분 자유 탐색 — 법선 성분을 바꿔 보세요. 격자가 어떻게 기우나요?'},
   {t:'오늘의 문제 — 상수항 d 를 0 으로 내리세요. 평면이 어디를 지나나요?',
    re:'법선만으로는 위치를 정하지 못합니다',
    do:'① d 를 0 으로 ② 원점까지의 거리 확인 ③ 격자가 원점을 지나는지 보기',
    hand:'원점을 대입해 등식이 성립하는지 확인'},
   {t:'위치를 옮기면 — d 를 5 로 올리세요. 무엇이 달라지나요?',
    re:'방향은 그대로, 위치만 바뀝니다',
    do:'① d 를 5 로 ② 원점까지의 거리 읽기 ③ 법선 화살표는 그대로인지 보기',
    hand:'|d| / |n| 을 계산해 화면 값과 맞춰 보기'},
   {t:'(법선, d, 원점까지의 거리) 를 여섯 줄 기록하세요.'},
   {t:'심화 — 거리 공식: 점 P 에서 평면 ax + by + cz = d 까지의 거리가 |a p₁ + b p₂ + c p₃ − d| / √(a²+b²+c²) 임을 정사영으로 유도하세요.'}];

  s = s.slice(0, i0) + 'const MISSIONS=' + JSON.stringify(M, null, 1) + ';' + s.slice(i0 + mm[0].length);

  const PR2 = JSON.parse(s.match(/const PROBLEMS=(\{.*?\});/)[1]);
  const labsBlock = s.slice(s.indexOf('const LABS=['), s.indexOf('const THUMBS ='));
  const demoSrc = fs.readFileSync('algAI-demos.txt', 'utf8');
  let bad = 0;
  ['282', '283', '284', '285', '286'].forEach((k, ki) => {
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
  const key = s.match(/  link:'원의 방정식\(LAB 01\)과 이어지며, 근축·극선으로 나아갑니다\.'\}\r?\n\];/);
  if (!key) throw new Error('PRINS 끝 앵커 실패');
  s = s.replace(key[0], `  link:'원의 방정식(LAB 01)과 이어지며, 근축·극선으로 나아갑니다.'},

{tex:[
   {t:'\\\\left(x^{2}+y^{2}+D_1x+E_1y+F_1\\\\right)-\\\\left(x^{2}+y^{2}+D_2x+E_2y+F_2\\\\right)=0', s:'두 원의 식을 빼면 <b>제곱항이 사라집니다</b>.'},
   {t:'(D_1-D_2)x+(E_1-E_2)y+(F_1-F_2)=0', s:'남는 것은 <b>일차식</b> — 그래서 직선입니다.'},
   {t:'\\\\text{근축}\\\\perp \\\\overline{O_1O_2}', s:'근축은 두 중심을 잇는 선분과 <b>수직</b>입니다.'}
  ],
  next:[
   {lv:'바로',   t:'점 찾기', d:'두 방멱이 같은 점을 직접 찾으세요.'},
   {lv:'심화',   t:'식으로 유도', d:'두 원의 식을 빼서 근축의 방정식을 세우세요.'},
   {lv:'프로젝트', t:'세 원의 근심', d:'세 원의 근축 셋이 한 점에서 만남을 확인하세요.'}
  ],
  eq:'두 방멱이 같은 점들 = 근축 (직선)',
  what:'두 식을 <b>빼는 것</b>만으로 새 도형이 나오는 장면입니다.',
  probe:'두 원이 만나지 않아도 근축은 그대로 있습니다.',
  link:'방멱(LAB 281)의 바로 다음 단계입니다.'},

{tex:[
   {t:"\\\\left|OP\\\\right|\\\\cdot\\\\left|OP'\\\\right|=r^{2}", s:'거리를 <b>뒤집는</b> 변환입니다.'},
   {t:'\\\\text{중심을 지나지 않는 직선}\\\\ \\\\mapsto\\\\ \\\\text{중심을 지나는 원}', s:'직선과 원이 <b>한 가족</b>이 됩니다.'},
   {t:'\\\\text{상의 반지름}=\\\\frac{r^{2}}{2c}', s:'c 는 직선이 중심에서 떨어진 <b>거리</b>입니다.'}
  ],
  next:[
   {lv:'바로',   t:'반지름 계산', d:'r 과 c 로 상의 반지름을 구하세요.'},
   {lv:'심화',   t:'유도하기', d:'가장 가까운 점이 지름 끝으로 감을 보이세요.'},
   {lv:'프로젝트', t:'등각성', d:'반전이 각을 보존함을 확인하세요.'}
  ],
  eq:'|OP| · |OP′| = r²',
  what:'「직선」과 「원」의 경계를 <b>지워 버리는</b> 변환입니다.',
  probe:'직선을 중심 쪽으로 밀면 상의 원이 커집니다.',
  link:'원의 방정식(LAB 01)을 새로운 눈으로 보게 합니다.'},

{tex:[
   {t:'\\\\text{중심을 지나는 원}\\\\ \\\\mapsto\\\\ \\\\text{직선}', s:'반전 중심을 <b>도형 위에</b> 두는 것이 요령입니다.'},
   {t:'\\\\text{접하는 두 원}\\\\ \\\\mapsto\\\\ \\\\text{평행한 두 직선}', s:'반전이 <b>각을 보존</b>하므로 접함이 평행으로 갑니다.'},
   {t:'\\\\text{어려운 배치}\\\\ \\\\Rightarrow\\\\ \\\\text{쉬운 배치}\\\\ \\\\Rightarrow\\\\ \\\\text{되돌리기}', s:'푸는 대신 <b>바꾸어 푸는</b> 전략입니다.'}
  ],
  next:[
   {lv:'바로',   t:'중심 고르기', d:'두 원이 직선이 되는 중심을 찾으세요.'},
   {lv:'심화',   t:'평행 이유', d:'접함이 평행으로 가는 까닭을 설명하세요.'},
   {lv:'프로젝트', t:'파푸스 사슬', d:'반전으로 원들의 사슬 문제를 풀어 보세요.'}
  ],
  eq:'반전 중심을 도형 위에 두면 직선이 된다',
  what:'문제를 <b>바꾸어 푸는</b> 수학의 전형을 경험합니다.',
  probe:'중심을 접점에 맞추는 순간 두 원이 평행선이 됩니다.',
  link:'반전변환(LAB 283)의 실제 쓰임입니다.'},

{tex:[
   {t:'(A,B;C,D)=\\\\frac{AC\\\\cdot BD}{BC\\\\cdot AD}', s:'<b>비의 비</b>입니다.'},
   {t:'\\\\text{사영}\\\\ \\\\Rightarrow\\\\ \\\\text{길이},\\\\ \\\\text{길이의 비}\\\\ \\\\text{는 변한다}', s:'많은 것이 <b>변합니다</b>.'},
   {t:"(A,B;C,D)=(A',B';C',D')", s:'그런데 복비는 <b>변하지 않습니다</b>.'}
  ],
  next:[
   {lv:'바로',   t:'값 재기', d:'두 직선에서 복비를 각각 계산하세요.'},
   {lv:'심화',   t:'길이 비와 비교', d:'무엇이 변하고 무엇이 남는지 정리하세요.'},
   {lv:'프로젝트', t:'사진 복원', d:'비스듬한 사진에서 실제 비율을 복원해 보세요.'}
  ],
  eq:'(A,B;C,D) = (AC · BD)/(BC · AD)',
  what:'변환 속에서 <b>살아남는 값</b>을 찾는 것이 기하의 방법입니다.',
  probe:'직선을 크게 기울여도 복비는 소수점 아래까지 같습니다.',
  link:'원근법(LAB 236)의 수학적 뼈대입니다.'},

{tex:[
   {t:'\\\\vec{n}\\\\cdot(\\\\vec{x}-\\\\vec{x}_0)=0', s:'법선과 <b>지나는 점</b>이 함께 있어야 합니다.'},
   {t:'ax+by+cz=d', s:'정리하면 <b>일차식</b> 하나가 됩니다.'},
   {t:'\\\\text{원점까지의 거리}=\\\\frac{\\\\left|d\\\\right|}{\\\\sqrt{a^{2}+b^{2}+c^{2}}}', s:'상수항이 <b>위치</b>를 정합니다.'}
  ],
  next:[
   {lv:'바로',   t:'거리 구하기', d:'여러 d 에 대해 원점까지의 거리를 재세요.'},
   {lv:'심화',   t:'거리 공식', d:'임의의 점에서의 거리 공식을 유도하세요.'},
   {lv:'프로젝트', t:'3D 설계', d:'세 점으로 평면을 세워 모델에 써 보세요.'}
  ],
  eq:'ax + by + cz = d · 거리 = |d| / |n|',
  what:'<b>방향과 위치</b>를 나누어 적는 법을 익히는 실험입니다.',
  probe:'d 만 바꾸면 기울기는 그대로 두고 평면이 평행 이동합니다.',
  link:'직선의 방정식을 공간으로 넓힌 자리입니다.'}
];`);
}

/* THUMBS */
{
  const key = s.match(/   '원 밖 한 점에서 그은 할선과 접선'\)\r?\n\];/);
  if (!key) throw new Error('THUMBS 끝 앵커 실패');
  s = s.replace(key[0], `   '원 밖 한 점에서 그은 할선과 접선'),

 svg(\`<circle cx="40" cy="48" r="26" fill="none" stroke="\${TC.blue}" stroke-width="1.8"/>
   <circle cx="84" cy="48" r="20" fill="none" stroke="\${TC.teal}" stroke-width="1.8"/>
   <line x1="63" y1="10" x2="63" y2="86" stroke="\${TC.rose}" stroke-width="2" stroke-dasharray="5 4"/>
   <text x="60" y="98" font-size="8" font-weight="800" fill="\${TC.ink3}" text-anchor="middle">근축</text>\`,
   '두 원 사이를 지나는 근축 직선'),

 svg(\`<circle cx="60" cy="48" r="24" fill="none" stroke="\${TC.ink3}" stroke-width="1" opacity=".5"/>
   <line x1="12" y1="20" x2="108" y2="20" stroke="\${TC.blue}" stroke-width="2"/>
   <circle cx="60" cy="62" r="16" fill="none" stroke="\${TC.rose}" stroke-width="2.2"/>
   <circle cx="60" cy="48" r="3" fill="\${TC.ink3}"/>
   <text x="60" y="98" font-size="8" font-weight="800" fill="\${TC.ink3}" text-anchor="middle">직선 → 원</text>\`,
   '반전으로 원이 된 직선 그림'),

 svg(\`<circle cx="40" cy="48" r="22" fill="none" stroke="\${TC.blue}" stroke-width="1.8"/>
   <circle cx="84" cy="48" r="22" fill="none" stroke="\${TC.teal}" stroke-width="1.8"/>
   <line x1="14" y1="26" x2="108" y2="26" stroke="\${TC.rose}" stroke-width="2"/>
   <line x1="14" y1="72" x2="108" y2="72" stroke="\${TC.rose}" stroke-width="2"/>
   <circle cx="62" cy="48" r="3.4" fill="\${TC.ink3}"/>
   <text x="60" y="96" font-size="8" font-weight="800" fill="\${TC.ink3}" text-anchor="middle">접함 → 평행</text>\`,
   '접한 두 원이 두 평행선으로 바뀐 그림'),

 svg(\`<circle cx="60" cy="14" r="4" fill="\${TC.ink3}"/>
   <line x1="60" y1="14" x2="16" y2="76" stroke="\${TC.ink3}" stroke-width=".8" opacity=".5"/>
   <line x1="60" y1="14" x2="42" y2="76" stroke="\${TC.ink3}" stroke-width=".8" opacity=".5"/>
   <line x1="60" y1="14" x2="72" y2="76" stroke="\${TC.ink3}" stroke-width=".8" opacity=".5"/>
   <line x1="60" y1="14" x2="104" y2="76" stroke="\${TC.ink3}" stroke-width=".8" opacity=".5"/>
   <line x1="10" y1="76" x2="110" y2="76" stroke="\${TC.blue}" stroke-width="1.8"/>
   <line x1="16" y1="88" x2="106" y2="44" stroke="\${TC.teal}" stroke-width="1.8"/>
   <text x="60" y="98" font-size="8" font-weight="800" fill="\${TC.rose}" text-anchor="middle">복비 그대로</text>\`,
   '한 시점에서 두 직선으로 옮겨진 네 점'),

 svg(\`<g stroke="\${TC.blue}" stroke-width="1" opacity=".7">
   <path d="M22 62 L60 44 L98 58"/><path d="M22 72 L60 54 L98 68"/>
   <path d="M22 62 L22 72"/><path d="M60 44 L60 54"/><path d="M98 58 L98 68"/></g>
   <line x1="60" y1="50" x2="60" y2="16" stroke="\${TC.teal}" stroke-width="2.4"/>
   <circle cx="60" cy="50" r="3.4" fill="\${TC.ink3}"/>
   <text x="60" y="92" font-size="8" font-weight="800" fill="\${TC.ink3}" text-anchor="middle">n 과 d</text>\`,
   '법선벡터가 꽂힌 기울어진 평면 격자')
];`);
}

new Function(s);
fs.writeFileSync(P, s);

{
  const C = 'src/55-catalog.js';
  let c = fs.readFileSync(C, 'utf8');
  const m = c.match(/(\{k:'xgeo',g:'고급 기하 · 방멱'[^}]*\})(\r?\n\];)/);
  if (!m) throw new Error('LABCAT 끝 앵커 실패');
  c = c.replace(m[0], m[1] + `,
{k:'xgeo',g:'고급 기하 · 근축',b:'두 원이 만나지 않으면 근축을 안 그려 늘 있어야 할 선이 사라짐'},
{k:'xgeo',g:'고급 기하 · 반전변환',b:'중심을 지나는 직선까지 원으로 바꿔 직선으로 남아야 할 것이 휘어짐'},
{k:'xgeo',g:'고급 기하 · 반전으로 풀기',b:'반전 반지름을 갱신하지 않아 되돌렸을 때 원래 그림으로 안 돌아옴'},
{k:'xgeo',g:'고급 기하 · 복비',b:'길이의 비를 그대로 써 시점을 바꾸면 값이 흔들림'},
{k:'xgeo',g:'고급 기하 · 평면의 방정식',b:'법선벡터만 쓰고 지나는 점을 안 써 평면이 늘 원점을 지남'}` + m[2]);
  fs.writeFileSync(C, c);
}
console.log('LAB 282~286 (고급 기하 B · 5종) 설치 완료');
