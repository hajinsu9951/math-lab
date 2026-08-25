// 기하 C — LAB 167~171 (공간도형·공간좌표 5종) 전 계층 설치
import fs from 'node:fs';
const P = 'src/40-demos.js';
let s = fs.readFileSync(P, 'utf8');
if (s.includes('function threePerpDemo')) throw new Error('이미 설치됨');
for (const n of ['threePerpDemo','space3dDemo','sphereCutDemo','coneCutDemo','posVecDemo'])
  if (s.includes('function ' + n + '(')) throw new Error('이름 충돌: ' + n);

{ const i = s.indexOf('const LABS=[');
  s = s.slice(0, i) + '\n' + fs.readFileSync('algL-demos.txt', 'utf8') + '\n' + s.slice(i); }

{ const key = ' build:projAreaDemo}\n];';
  const i = s.indexOf(key);
  if (i < 0) throw new Error('LABS 끝 앵커 실패');
  s = s.slice(0, i) + ` build:projAreaDemo},
{n:167,core:0,t:'“공간에서 수직을 어떻게 확인하나” 삼수선 정리',q:'수직이 다른 선으로 옮겨 갈까?',
 m:['공간도형','수직','삼수선 정리'],a:['구조물 설계','3D 모델링'],
 note:'PH ⊥ 평면, HA ⊥ ℓ 이면 PA ⊥ ℓ. 셋 중 둘이 수직이면 나머지도 수직이 되는 구조를 내적으로 확인합니다.',
 build:threePerpDemo},
{n:168,core:0,t:'“드론은 지금 어디에” 공간좌표와 거리',q:'좌표 세 개로 거리를 어떻게 잴까?',
 m:['공간좌표','두 점 사이 거리','피타고라스'],a:['드론 항법','3D 게임'],
 note:'바닥에서 한 번, 높이로 한 번 — 피타고라스를 두 번 쓰면 공간의 거리 공식이 나옵니다.',
 build:space3dDemo},
{n:169,core:0,t:'“공을 자르면 무슨 모양” 구의 방정식과 절단',q:'자르는 높이에 따라 단면이 어떻게 변할까?',
 m:['구의 방정식','평면의 절단','단면'],a:['CT 촬영','지구의 위도선'],
 note:'z = h 를 대입하면 x² + y² = R² − h². 단면은 언제나 원이고, 반지름은 h 에 비례하지 않습니다.',
 build:sphereCutDemo},
{n:170,core:0,t:'“하나의 원뿔, 네 가지 곡선” 원뿔곡선의 통일',q:'타원·포물선·쌍곡선은 서로 다른 도형일까?',
 m:['원뿔곡선','이심률','단면'],a:['천체 궤도','반사 설계'],
 note:'같은 원뿔을 자르는 각만 바꾸면 원·타원·포물선·쌍곡선이 차례로 나옵니다. 이심률 하나가 그 경계를 정합니다.',
 build:coneCutDemo},
{n:171,core:0,t:'“편대의 자리를 정하라” 위치벡터와 내분점',q:'비가 왜 엇갈려 붙을까?',
 m:['위치벡터','내분점','무게중심'],a:['편대 비행','자원 배분'],
 note:'P = (nA + mB)/(m+n) — B 쪽 계수가 m 입니다. 비가 엇갈려 붙는 이유를 그림에서 확인합니다.',
 build:posVecDemo}
];` + s.slice(i + key.length); }

{ const m = s.match(/const PROBLEMS=(\{.*?\});/);
  const PR = JSON.parse(m[1]);
  PR['167'] = { sit: '깃대를 바닥에 수직으로 세웠습니다. 바닥에는 직선 하나가 그어져 있고, 그 직선 위 한 점 A 로 줄을 당깁니다.',
    ask: '줄(PA)이 그 직선과 수직이 되는 것은 언제일까? 무엇을 확인하면 알 수 있을까?' };
  PR['168'] = { sit: '드론이 동쪽 3m, 북쪽 2m, 높이 4m 지점에 떠 있습니다. 관제탑은 원점에 있습니다.',
    ask: '관제탑에서 드론까지의 직선 거리는 얼마일까? 평면의 거리 공식으로 될까?' };
  PR['169'] = { sit: 'CT 촬영은 몸을 얇게 잘라 단면을 봅니다. 공 모양 물체를 여러 높이에서 자르면 단면이 달라집니다.',
    ask: '자른 단면은 언제나 원일까? 높이에 따라 크기는 어떻게 변할까?' };
  PR['170'] = { sit: '교과서에는 타원·포물선·쌍곡선이 따로따로 나옵니다. 그런데 이름은 모두 「원뿔곡선」입니다.',
    ask: '세 곡선이 정말 한 뿌리에서 나올까? 무엇이 그 셋을 가를까?' };
  PR['171'] = { sit: '드론 A 와 B 사이를 3 : 1 로 나누는 자리에 세 번째 드론을 띄우라는 지시가 내려왔습니다.',
    ask: '그 자리의 좌표는 어떻게 구할까? 3 이 A 쪽일까 B 쪽일까?' };
  s = s.replace(m[0], 'const PROBLEMS=' + JSON.stringify(PR) + ';');

  const i0 = s.indexOf('const MISSIONS=');
  const mm = s.slice(i0).match(/^const MISSIONS=\{[\s\S]*?\n\};/);
  const M = new Function('return ' + mm[0].slice('const MISSIONS='.length, -1))();

  M['167'] = [
   {t:'1분 자유 탐색 — 세 슬라이더를 움직여 보세요. 보라색 선 PA 가 어떻게 따라 움직이나요?'},
   {t:'오늘의 문제 — ℓ 까지의 거리를 2 로 하세요 (A 는 그대로). 두 내적이 어떻게 되나요?',
    re:'PA 도 ℓ 에 수직입니다',
    do:'① 두 번째 슬라이더를 2.0 으로 ② HA·ℓ 값 확인 ③ PA·ℓ 값 확인',
    hand:'PA 를 성분으로 쓰고 ℓ 의 방향벡터와 내적을 계산'},
   {t:'A 를 옮기면 — 세 번째 슬라이더를 2 로 밀어 보세요. 수직 관계가 유지되나요?',
    re:'수직이 아니게 되었고',
    do:'① A 를 오른쪽으로 옮기기 ② 두 내적이 0 이 아닌지 확인 ③ 그림에서 각 확인',
    hand:'A 가 수직 발이 아닐 때 HA·ℓ 이 0 이 아님을 성분으로 보이기'},
   {t:'(PH, HA, PA, HA·ℓ, PA·ℓ) 를 여섯 줄 기록하세요 — PA² = PH² + HA² 도 확인하세요.'},
   {t:'심화 — 세 수직의 사슬: 「PH ⊥ 평면」과 「HA ⊥ ℓ」에서 「PA ⊥ ℓ」이 따라 나오는 과정을 내적의 성질만으로 증명하고, 역도 성립하는지 따져 보세요.'}];

  M['168'] = [
   {t:'1분 자유 탐색 — 세 좌표를 움직여 보세요. 그림자와 드론이 어떻게 움직이나요?'},
   {t:'오늘의 문제 — (3, 2, 4) 를 유지한 채 「관제탑까지의 거리 보기」를 누르세요. 거리는?',
    re:'다시 피타고라스',
    do:'① 좌표가 3, 2, 4 인지 확인 ② 버튼 누르기 ③ 두 거리(바닥·전체) 비교',
    hand:'√(3² + 2²) 을 먼저 구하고 그 값과 4 로 다시 계산'},
   {t:'바닥에 내려앉기 — 높이를 0 으로 하세요. 드론과 그림자가 어떻게 되나요?',
    re:'드론이 바닥에 있습니다',
    do:'① z 를 0 으로 ② 두 점이 겹치는지 확인 ③ 거리 공식이 무엇으로 바뀌는지 보기',
    hand:'z = 0 일 때 공간 거리 공식이 평면 거리 공식이 됨을 확인'},
   {t:'(x, y, z, 바닥 거리, 전체 거리) 를 여섯 줄 기록하세요.'},
   {t:'심화 — 두 번의 피타고라스: 직육면체의 대각선 길이가 √(a²+b²+c²) 인 이유를 그림 두 장으로 설명하고, 4차원으로 확장하면 어떻게 되는지 유추해 쓰세요.'}];

  M['169'] = [
   {t:'1분 자유 탐색 — 자르는 높이를 위아래로 움직여 보세요. 붉은 단면이 어떻게 변하나요?'},
   {t:'오늘의 문제 — 높이를 0 으로 맞추세요. 이때 단면은 어떤 원인가요?',
    re:'단면이 가장 큰 원',
    do:'① 높이를 0.0 으로 ② 단면 반지름 읽기 ③ 구의 반지름과 비교',
    hand:'h = 0 을 대입해 x² + y² = R² 임을 확인'},
   {t:'구를 벗어나면 — 높이를 5 로 올려 보세요 (R = 4). 단면이 생기나요?',
    re:'만나지 않습니다',
    do:'① 높이를 5.0 으로 ② R² − h² 의 부호 확인 ③ 그림에서 평면 위치 확인',
    hand:'R² − h² < 0 이 뜻하는 바를 방정식의 해로 설명'},
   {t:'(h, R²−h², 단면 반지름, 넓이) 를 여섯 줄 기록하세요 — 반지름이 h 에 비례하나요?'},
   {t:'심화 — 위도선의 길이: 지구를 반지름 6400km 인 구로 보고 위도 37°(대전 부근) 의 위도선 둘레를 계산하고, 적도와 비교하세요.'}];

  M['170'] = [
   {t:'1분 자유 탐색 — 자르는 각을 0°부터 올려 보세요. 오른쪽 단면 그림이 어떻게 바뀌나요?'},
   {t:'오늘의 문제 — 각을 45° 로 맞추세요 (모선 각과 같게). 어떤 곡선이 되나요?',
    re:'닫힌 곡선이 열려',
    do:'① 각을 45 로 ② 단면 이름 확인 ③ 이심률 값 확인',
    hand:'e = tan45°/tan45° 를 계산해 1 임을 확인'},
   {t:'더 세우면 — 각을 60° 로 올려 보세요. 몇 갈래가 되나요?',
    re:'두 겹을 모두 잘라',
    do:'① 각을 60 으로 ② 단면의 갈래 수 확인 ③ 이심률이 1 보다 큰지 확인',
    hand:'원뿔의 두 겹을 모두 자르는 경우가 언제인지 각으로 설명'},
   {t:'(각, e, 단면 이름) 을 여섯 줄 기록하세요 — 경계가 되는 각과 e 는?'},
   {t:'심화 — 하나의 정의로: 「초점까지의 거리 : 준선까지의 거리 = e」라는 하나의 정의로 세 곡선을 모두 설명할 수 있습니다. e < 1, = 1, > 1 각각에서 어떤 곡선이 되는지 정리하고, 앞선 실험(LAB 157~159)과 이어 붙이세요.'}];

  M['171'] = [
   {t:'1분 자유 탐색 — m 과 n 을 바꿔 보세요. 붉은 점이 A 와 B 사이 어디로 가나요?'},
   {t:'오늘의 문제 — m 과 n 을 모두 1 로 맞추세요. 붉은 점은 어디에 놓이나요?',
    re:'정확히 가운데',
    do:'① m 을 1 로 ② n 을 1 로 ③ 좌표를 A, B 의 평균과 비교',
    hand:'(A + B)/2 를 계산해 화면 좌표와 대조'},
   {t:'한쪽을 0 으로 — n 을 0 으로 내려 보세요. 붉은 점이 어디로 가나요?',
    re:'비가 엇갈려 붙는 까닭',
    do:'① n 을 0 으로 ② 붉은 점의 위치 확인 ③ 공식에서 계수 확인',
    hand:'n = 0 일 때 P = mB/m = B 가 되는 과정을 식으로 쓰기'},
   {t:'(m, n, P, A 까지 거리, B 까지 거리) 를 여섯 줄 기록하세요 — m : n 과 거리의 비를 견주세요.'},
   {t:'심화 — 무게중심까지: 「무게중심 보이기」를 눌러 G = (A+B+C)/3 을 확인하고, G 가 각 중선을 2 : 1 로 나눈다는 사실을 내분점 공식으로 증명하세요.'}];

  s = s.slice(0, i0) + 'const MISSIONS=' + JSON.stringify(M, null, 1) + ';' + s.slice(i0 + mm[0].length);

  const PR2 = JSON.parse(s.match(/const PROBLEMS=(\{.*?\});/)[1]);
  const labsBlock = s.slice(s.indexOf('const LABS=['), s.indexOf('const PRINS='));
  let bad = 0;
  for (const k of ['167','168','169','170','171']) {
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
  const key = s.match(/  link:'정사영의 길이\(LAB 165\)의 다음 단계이며, 공간도형\(LAB 167\)과 이어집니다\.'\}\r?\n\];/);
  if (!key) throw new Error('PRINS 끝 앵커 실패');
  s = s.replace(key[0], `  link:'정사영의 길이(LAB 165)의 다음 단계이며, 공간도형(LAB 167)과 이어집니다.'},

/* 167 삼수선 정리 */
 {tex:[
   {t:'\\\\overline{PH}\\\\perp\\\\alpha,\\\\ \\\\overline{HA}\\\\perp\\\\ell \\\\Rightarrow \\\\overline{PA}\\\\perp\\\\ell', s:'세 수직 가운데 <b>둘이 있으면 나머지</b>가 따라옵니다.'},
   {t:'\\\\vec{PA}\\\\cdot\\\\vec{\\\\ell}=\\\\vec{PH}\\\\cdot\\\\vec{\\\\ell}+\\\\vec{HA}\\\\cdot\\\\vec{\\\\ell}=0+0', s:'내적으로 보면 <b>두 항이 모두 0</b> 이라 합도 0 입니다.'},
   {t:'\\\\overline{PA}^{2}=\\\\overline{PH}^{2}+\\\\overline{HA}^{2}', s:'수직 발을 지나므로 <b>피타고라스</b>가 그대로 성립합니다.'}
  ],
  next:[
   {lv:'바로',   t:'길이 구하기', d:'PH = 3, HA = 4 일 때 PA 를 구하세요.'},
   {lv:'심화',   t:'역도 성립하나', d:'PA ⊥ ℓ 이면 HA ⊥ ℓ 인지 따져 보세요.'},
   {lv:'프로젝트', t:'구조물 검사', d:'실제 구조물에서 수직을 확인하는 현장 방법을 조사해 정리하세요.'}
  ],
  eq:'PH ⊥ α, HA ⊥ ℓ ⟹ PA ⊥ ℓ',
  what:'공간의 수직을 <b>내적 두 개</b>로 확인하는 실험입니다. 정리가 왜 성립하는지 계산으로 보입니다.',
  probe:'A 를 옮기면 두 내적이 함께 0 을 벗어납니다 — 두 조건이 붙어 다닌다는 증거입니다.',
  link:'내적(LAB 164)의 공간 응용이며, 정사영(LAB 166)과 한 묶음입니다.'},

/* 168 공간좌표 */
 {tex:[
   {t:'d=\\\\sqrt{(\\\\Delta x)^{2}+(\\\\Delta y)^{2}+(\\\\Delta z)^{2}}', s:'평면의 거리 공식에 <b>항 하나</b>가 더 붙은 모양입니다.'},
   {t:'\\\\sqrt{x^{2}+y^{2}}\\\\ \\\\to\\\\ \\\\sqrt{(\\\\sqrt{x^{2}+y^{2}})^{2}+z^{2}}', s:'바닥에서 한 번, 높이로 한 번 — <b>피타고라스를 두 번</b> 씁니다.'},
   {t:'(x-a)^{2}+(y-b)^{2}+(z-c)^{2}=r^{2}', s:'중심 (a,b,c), 반지름 r 인 <b>구의 방정식</b>도 같은 뿌리입니다.'}
  ],
  next:[
   {lv:'바로',   t:'거리 계산', d:'(1,2,2) 와 (4,6,14) 사이의 거리를 구하세요.'},
   {lv:'심화',   t:'직육면체 대각선', d:'가로·세로·높이가 주어진 상자의 대각선을 구하는 식을 유도하세요.'},
   {lv:'프로젝트', t:'드론 경로 설계', d:'장애물을 피하는 3차원 경로의 길이를 계산하는 표를 만드세요.'}
  ],
  eq:'d = √(Δx² + Δy² + Δz²)',
  what:'평면의 거리 공식이 <b>한 차원 올라가는</b> 장면입니다. 그림자와 높이가 직각삼각형을 만듭니다.',
  probe:'z 를 0 으로 내리면 공식이 그대로 평면 거리로 돌아옵니다.',
  link:'피타고라스(LAB 5)의 공간판이며, 구의 절단(LAB 169)의 바탕입니다.'},

/* 169 구의 절단 */
 {tex:[
   {t:'x^{2}+y^{2}+z^{2}=R^{2}', s:'원점에서 <b>거리가 일정한</b> 점들의 모임 — 구입니다.'},
   {t:'z=h \\\\Rightarrow x^{2}+y^{2}=R^{2}-h^{2}', s:'대입 한 번으로 <b>단면의 방정식</b>이 나옵니다.'},
   {t:'r=\\\\sqrt{R^{2}-h^{2}}\\\\quad (|h|\\\\le R)', s:'반지름이 h 에 <b>비례하지 않습니다</b> — 제곱근의 모양입니다.'}
  ],
  next:[
   {lv:'바로',   t:'단면 구하기', d:'R = 5, h = 3 일 때 단면의 반지름과 넓이를 구하세요.'},
   {lv:'심화',   t:'위도선', d:'지구의 위도 37° 위도선 둘레를 계산해 적도와 비교하세요.'},
   {lv:'프로젝트', t:'CT 단층', d:'단면 여러 장에서 원래 입체를 복원하는 원리를 조사하세요.'}
  ],
  eq:'r = √(R² − h²)',
  what:'대입 한 번으로 <b>3차원을 2차원으로</b> 내려 읽는 실험입니다.',
  probe:'높이가 R 을 넘는 순간 R² − h² 가 음수가 되고 단면이 사라집니다.',
  link:'공간좌표(LAB 168)의 응용이며, 원의 방정식(LAB 30)의 확장입니다.'},

/* 170 원뿔곡선 */
 {tex:[
   {t:'e=\\\\frac{\\\\tan(\\\\text{자른 각})}{\\\\tan(\\\\text{모선 각})}', s:'자르는 각 하나가 <b>이심률</b>을 정합니다.'},
   {t:'e=0\\\\ (\\\\text{원}),\\\\ 0<e<1\\\\ (\\\\text{타원}),\\\\ e=1\\\\ (\\\\text{포물선}),\\\\ e>1\\\\ (\\\\text{쌍곡선})', s:'네 곡선이 <b>하나의 수</b>로 이어집니다.'},
   {t:'\\\\frac{\\\\overline{PF}}{\\\\overline{P\\\\ell}}=e', s:'초점과 준선으로 쓴 <b>통일된 정의</b>. 앞선 세 실험이 여기서 하나가 됩니다.'}
  ],
  next:[
   {lv:'바로',   t:'경계 찾기', d:'포물선이 되는 자르는 각과 그때의 e 를 구하세요.'},
   {lv:'심화',   t:'통일 정의 확인', d:'PF/P준선 = e 라는 정의로 타원과 쌍곡선을 각각 설명하세요.'},
   {lv:'프로젝트', t:'궤도의 종류', d:'혜성의 궤도가 타원·포물선·쌍곡선 중 무엇인지 이심률로 판정하는 자료를 만드세요.'}
  ],
  eq:'e < 1 타원 · e = 1 포물선 · e > 1 쌍곡선',
  what:'따로 배운 세 곡선이 <b>한 원뿔의 단면</b>임을 각도 하나로 확인하는 실험입니다.',
  probe:'45°를 지나는 순간 닫힌 곡선이 열리고, 더 세우면 두 갈래가 됩니다.',
  link:'포물선·타원·쌍곡선(LAB 157~159)을 하나로 묶는 마무리 실험입니다.'},

/* 171 위치벡터와 내분점 */
 {tex:[
   {t:'\\\\vec{P}=\\\\frac{n\\\\vec{A}+m\\\\vec{B}}{m+n}', s:'B 쪽 계수가 <b>m</b> 입니다 — 비가 엇갈려 붙습니다.'},
   {t:'m=n \\\\Rightarrow \\\\vec{P}=\\\\frac{\\\\vec{A}+\\\\vec{B}}{2}', s:'같은 비면 <b>중점</b>. 평균과 같은 식입니다.'},
   {t:'\\\\vec{G}=\\\\frac{\\\\vec{A}+\\\\vec{B}+\\\\vec{C}}{3}', s:'무게중심은 세 위치벡터의 <b>평균</b>이고, 중선을 2 : 1 로 나눕니다.'}
  ],
  next:[
   {lv:'바로',   t:'좌표 구하기', d:'A(−4,−2), B(4,3) 을 3 : 1 로 내분하는 점을 구하세요.'},
   {lv:'심화',   t:'외분점', d:'외분점 공식을 만들고 m 과 n 의 부호로 설명하세요.'},
   {lv:'프로젝트', t:'편대 대형 설계', d:'드론 다섯 대의 대형 좌표를 내분점으로 설계해 보세요.'}
  ],
  eq:'P = (nA + mB)/(m + n)',
  what:'내분점 공식의 <b>계수가 엇갈리는 이유</b>를 눈으로 확인하는 실험입니다.',
  probe:'n 을 0 으로 두면 점이 B 로 갑니다 — B 쪽 계수가 m 이라는 증거입니다.',
  link:'수직선 위의 내분(LAB 25)의 벡터판이며, 무게중심으로 이어집니다.'}
];`);
}

/* THUMBS */
{
  const key = s.match(/   '기울어진 판과 바닥에 생긴 그림자 넓이 그림'\)\r?\n\];/);
  if (!key) throw new Error('THUMBS 끝 앵커 실패');
  s = s.replace(key[0], `   '기울어진 판과 바닥에 생긴 그림자 넓이 그림'),

 svg(\`<path d="M18 62 L74 62 L102 48 L46 48 Z" fill="\${TC.blue}" opacity=".14" stroke="\${TC.blue}"/>
   <line x1="46" y1="55" x2="46" y2="20" stroke="\${TC.rose}" stroke-width="2.4"/>
   <line x1="46" y1="55" x2="86" y2="55" stroke="\${TC.blue}" stroke-width="2"/>
   <line x1="46" y1="20" x2="86" y2="55" stroke="#7C3AED" stroke-width="2.4"/>
   <text x="60" y="78" font-size="8" font-weight="800" fill="\${TC.ink3}" text-anchor="middle">세 수직</text>\`,
   '평면과 수직선과 빗변이 이루는 삼수선 그림'),

 svg(\`<line x1="30" y1="66" x2="96" y2="66" stroke="\${TC.rose}" stroke-width="1.6"/>
   <line x1="30" y1="66" x2="58" y2="80" stroke="\${TC.teal}" stroke-width="1.6"/>
   <line x1="30" y1="66" x2="30" y2="18" stroke="\${TC.blue}" stroke-width="1.6"/>
   <circle cx="70" cy="34" r="5" fill="\${TC.ink3}"/>
   <circle cx="70" cy="62" r="3" fill="#9CA3AF"/>
   <line x1="70" y1="62" x2="70" y2="34" stroke="#9CA3AF" stroke-width="1" stroke-dasharray="3 3"/>
   <text x="60" y="14" font-size="8" font-weight="800" fill="\${TC.ink3}" text-anchor="middle">(x, y, z)</text>\`,
   '3차원 좌표축과 드론의 위치와 그림자 그림'),

 svg(\`<circle cx="60" cy="44" r="28" fill="\${TC.blue}" opacity=".12" stroke="\${TC.blue}" stroke-width="2"/>
   <ellipse cx="60" cy="32" rx="25" ry="8" fill="\${TC.rose}" opacity=".28" stroke="\${TC.rose}"/>
   <line x1="24" y1="32" x2="96" y2="32" stroke="\${TC.rose}" stroke-width="1.6"/>
   <text x="60" y="80" font-size="8" font-weight="800" fill="\${TC.ink3}" text-anchor="middle">단면은 원</text>\`,
   '구를 수평면으로 자른 단면 그림'),

 svg(\`<path d="M60 14 L28 74 M60 14 L92 74" stroke="\${TC.blue}" stroke-width="2"/>
   <ellipse cx="60" cy="74" rx="32" ry="8" fill="none" stroke="\${TC.blue}" stroke-width="1.2"/>
   <line x1="24" y1="60" x2="96" y2="34" stroke="\${TC.rose}" stroke-width="2.4"/>
   <text x="60" y="88" font-size="8" font-weight="800" fill="\${TC.ink3}" text-anchor="middle">자르는 각</text>\`,
   '원뿔을 비스듬히 자르는 평면 그림'),

 svg(\`<line x1="24" y1="66" x2="96" y2="26" stroke="\${TC.blue}" stroke-width="2"/>
   <circle cx="24" cy="66" r="4" fill="\${TC.ink3}"/>
   <circle cx="96" cy="26" r="4" fill="\${TC.ink3}"/>
   <circle cx="78" cy="36" r="5" fill="\${TC.rose}"/>
   <text x="24" y="80" font-size="9" font-weight="800" fill="\${TC.ink3}">A</text>
   <text x="96" y="18" font-size="9" font-weight="800" fill="\${TC.ink3}">B</text>
   <text x="60" y="84" font-size="8" font-weight="800" fill="\${TC.rose}" text-anchor="middle">m : n</text>\`,
   '두 점을 잇는 선분 위의 내분점 그림')
];`);
}
fs.writeFileSync(P, s);

/* LABCAT */
{
  const C = 'src/55-catalog.js';
  let c = fs.readFileSync(C, 'utf8');
  const m = c.match(/(\{k:'geo',g:'기하 · 정사영의 넓이'[^}]*\})(\r?\n\];)/);
  if (!m) throw new Error('LABCAT 끝 앵커 실패');
  c = c.replace(m[0], m[1] + `,
{k:'geo',g:'기하 · 공간도형 (삼수선)',b:'수직 발이 아닌 점에서도 삼수선 정리를 적용해 엉뚱한 길이를 답함'},
{k:'geo',g:'기하 · 공간좌표',b:'거리 공식에서 z 항을 빠뜨려 높이가 달라도 같은 거리로 계산됨'},
{k:'geo',g:'기하 · 구의 방정식',b:'단면 반지름을 R − h 로 계산해 높이에 비례한다고 표시함'},
{k:'geo',g:'기하 · 원뿔곡선',b:'자르는 각이 모선 각을 넘어도 계속 타원으로 그려 두 갈래가 나오지 않음'},
{k:'geo',g:'기하 · 위치벡터와 내분점',b:'내분점 공식의 계수를 엇갈리지 않고 그대로 붙여 점이 반대쪽으로 감'}` + m[2]);
  fs.writeFileSync(C, c);
}
console.log('LAB 167~171 (공간도형·공간좌표 5종) 설치 완료');
