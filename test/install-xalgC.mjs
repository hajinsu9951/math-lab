// 고급 대수 C — LAB 257~261 (선형변환·마르코프·직교화·최소제곱·주성분) 전 계층 설치
import fs from 'node:fs';
const P = 'src/40-demos.js';
let s = fs.readFileSync(P, 'utf8');
const NAMES = ['linTransDemo', 'markovDemo', 'gramDemo', 'lsqDemo', 'pcaDemo'];
if (s.includes('function linTransDemo')) throw new Error('이미 설치됨');
for (const n of NAMES) if (s.includes('function ' + n + '(')) throw new Error('이름 충돌: ' + n);

{ const i = s.indexOf('const LABS=[');
  s = s.slice(0, i) + '\n' + fs.readFileSync('algAD-demos.txt', 'utf8') + '\n' + s.slice(i); }

{ const key = ' build:basisDemo}\n];';
  const i = s.indexOf(key);
  if (i < 0) throw new Error('LABS 끝 앵커 실패');
  s = s.slice(0, i) + ` build:basisDemo},
{n:257,core:0,t:'“돌리고 늘이면 다르다” 선형변환과 합성',q:'변환의 순서를 바꾸면 결과도 바뀔까?',
 m:['선형변환','표현행렬','합성'],a:['그래픽스','로봇 관절'],
 note:'회전·확대·전단은 각각 행렬 하나로 적힙니다. 이어서 걸면 행렬의 곱이 되고, 곱은 순서를 탑니다.',
 build:linTransDemo},
{n:258,core:0,t:'“오래 지나면 어디에” 마르코프 연쇄의 정상상태',q:'출발점이 결과를 정할까?',
 m:['전이행렬','거듭제곱','고윳값 1'],a:['페이지랭크','고객 이동'],
 note:'전이행렬을 거듭 곱하면 출발점과 상관없이 한 분포로 모입니다. 그것이 고윳값 1 의 고유벡터입니다.',
 build:markovDemo},
{n:259,core:0,t:'“기울어진 축을 곧게” 그람-슈미트 직교화',q:'얼마만큼 덜어 내야 직각이 될까?',
 m:['내적','정사영','직교화'],a:['QR 분해','좌표계 정비'],
 note:'두 번째 벡터에서 첫 방향의 성분을 (v·u)/(u·u) 만큼 덜어 내면 남는 것이 직각입니다.',
 build:gramDemo},
{n:260,core:0,t:'“딱 맞는 답이 없을 때” 최소제곱과 직각',q:'가장 가까운 답은 어떻게 찾을까?',
 m:['최소제곱','정사영','잔차'],a:['회귀분석','자료 맞춤'],
 note:'오차 제곱합이 가장 작아지는 자리는 오차가 열공간과 직각이 되는 자리입니다.',
 build:lsqDemo},
{n:261,core:0,t:'“가장 퍼진 방향” 주성분과 차원 축소',q:'축을 줄여도 정보를 지킬 수 있을까?',
 m:['공분산','고유벡터','분산'],a:['주성분분석','자료 압축'],
 note:'분산이 가장 커지는 방향이 공분산행렬의 첫 고유벡터입니다. 고윳값의 합은 전체 분산과 같습니다.',
 build:pcaDemo}
];` + s.slice(i + key.length);
}

{
  const m = s.match(/const PROBLEMS=(\{.*?\});/);
  if (!m) throw new Error('PROBLEMS 앵커 실패');
  const PR = JSON.parse(m[1]);
  PR['257'] = { sit: '그림 편집기에서 「45° 돌리고 가로로 2배 늘이기」와 「가로로 2배 늘이고 45° 돌리기」를 각각 해 보았습니다.',
    ask: '두 결과가 같을까? 다르다면 무엇이 순서를 만들까?' };
  PR['258'] = { sit: '두 통신사 사이에서 해마다 일정한 비율로 가입자가 옮겨 갑니다. 처음에는 모두 A 에 있었습니다.',
    ask: '10 년 뒤 점유율은 얼마일까? 처음이 모두 B 였다면 결과가 달라질까?' };
  PR['259'] = { sit: '두 축이 비스듬히 놓인 좌표계를 직각으로 고쳐 쓰려고 합니다.',
    ask: '두 번째 축에서 무엇을 얼마나 덜어 내야 직각이 될까?' };
  PR['260'] = { sit: '측정한 점 셋이 한 직선 위에 있지 않습니다. 세 점을 모두 지나는 직선은 없습니다.',
    ask: '그러면 「가장 가까운 직선」은 무엇을 기준으로 정해야 할까?' };
  PR['261'] = { sit: '키와 몸무게처럼 서로 밀접한 두 특징으로 자료를 그렸더니 점들이 한쪽으로 길게 늘어섰습니다.',
    ask: '두 숫자 대신 하나만 남겨도 될까? 남긴다면 어느 방향을 남겨야 할까?' };
  s = s.replace(m[0], 'const PROBLEMS=' + JSON.stringify(PR) + ';');

  const i0 = s.indexOf('const MISSIONS=');
  const mm = s.slice(i0).match(/^const MISSIONS=\{[\s\S]*?\n\};/);
  if (!mm) throw new Error('MISSIONS 앵커 실패');
  const M = new Function('return ' + mm[0].slice('const MISSIONS='.length, -1))();

  M['257'] = [
   {t:'1분 자유 탐색 — 세 슬라이더를 움직여 보세요. 도형이 어떻게 달라지나요?'},
   {t:'오늘의 문제 — 전단을 1.0 으로 올리세요. 넓이가 달라지나요?',
    re:'세로줄을 그대로 두고 가로로만 밀어',
    do:'① 전단을 1.0 으로 ② 행렬식 값 확인 ③ 도형의 높이 보기',
    hand:'전단 행렬의 행렬식을 손으로 계산'},
   {t:'순서의 문제 — 회전을 45°, 가로 확대를 2.0 배로 맞추세요. 두 도형이 겹치나요?',
    re:'돌리고 늘이는 것과 늘이고 도는 것은 다릅니다',
    do:'① 회전을 45 로 ② 확대를 2.0 으로 ③ 붉은 점선과 견주기',
    hand:'두 곱을 각각 계산해 성분을 비교'},
   {t:'(각도, 확대, 전단, 행렬식, 순서 차이) 를 여섯 줄 기록하세요.'},
   {t:'심화 — 언제 순서가 상관없나: 두 변환의 곱이 순서와 무관해지는 조건(AB = BA)을 찾고, 회전끼리는 왜 언제나 순서가 상관없는지 설명하세요.'}];

  M['258'] = [
   {t:'1분 자유 탐색 — 단계를 늘려 보세요. 파란 곡선이 어디로 가나요?'},
   {t:'오늘의 문제 — 단계를 3 으로 맞추세요. 붉은 선과의 차이가 얼마인가요?',
    re:'차이가 매 단계 일정한 비율로 줄어듭니다',
    do:'① 단계를 3 으로 ② 차이 값 읽기 ③ 한 단계씩 옮기며 비교',
    hand:'단계마다 차이가 몇 배로 줄어드는지 계산'},
   {t:'끝까지 — 단계를 25 로 올리세요. 처음 비율을 바꿔도 같은 곳인가요?',
    re:'출발점의 기억이 사라졌습니다',
    do:'① 단계를 25 로 ② 처음 A 를 0 % 로 바꿔 보기 ③ 결과 비교',
    hand:'πP = π 를 풀어 정상상태를 직접 구하기'},
   {t:'(처음 비율, 단계, 지금 값, 정상상태) 를 여섯 줄 기록하세요.'},
   {t:'심화 — 왜 고윳값 1 인가: 전이행렬의 각 열의 합이 1 이면 고윳값 1 이 반드시 있음을 보이고, 정상상태가 그 고유벡터임을 설명하세요.'}];

  M['259'] = [
   {t:'1분 자유 탐색 — 덜어 낼 비율을 움직여 보세요. 초록 화살표가 어떻게 도나요?'},
   {t:'오늘의 문제 — 덜어 낼 비율을 1.00 으로 맞추세요. 내적이 얼마가 되나요?',
    re:'남은 벡터가 u 와 직각입니다',
    do:'① 비율을 1.00 으로 ② 내적 값 확인 ③ 사잇각 읽기',
    hand:'(v·u)/(u·u) 를 손으로 계산'},
   {t:'지나치면 — 비율을 1.50 까지 올리세요. 다시 직각인가요?',
    re:'반대쪽으로 기울어 다시 직각이 아닙니다',
    do:'① 비율을 1.50 으로 ② 사잇각 확인 ③ 내적의 부호 보기',
    hand:'덜어 낸 양이 정사영보다 크면 어떻게 되는지 그림으로 표시'},
   {t:'(비율, 내적, 사잇각) 을 여섯 줄 기록하세요.'},
   {t:'심화 — 왜 그 비율인가: (v − t·u)·u = 0 을 t 에 대해 풀어 t = (v·u)/(u·u) 임을 보이고, v 를 바꿔도 그 식이 그대로인 까닭을 설명하세요.'}];

  M['260'] = [
   {t:'1분 자유 탐색 — a, b 를 움직여 보세요. 붉은 선분이 어떻게 달라지나요?'},
   {t:'오늘의 문제 — a 를 −1, b 를 −2 로 내리세요. 오차가 얼마나 커지나요?',
    re:'이 길이의 제곱을 모두 더한 값이 오차입니다',
    do:'① a 를 −1 로 ② b 를 −2 로 ③ 오차 제곱합 읽기',
    hand:'세 점의 붉은 선분 길이를 각각 계산해 제곱해 더하기'},
   {t:'가장 가까운 답 — 「가장 가까운 직선 찾기」를 누르세요. 두 내적이 얼마인가요?',
    re:'오차를 수직으로 만드는 답',
    do:'① 버튼 누르기 ② 두 내적 확인 ③ 오차 제곱합과 최솟값 비교',
    hand:'정규방정식 두 개를 세워 a, b 를 직접 구하기'},
   {t:'(a, b, 오차 제곱합, 두 내적) 을 여섯 줄 기록하세요.'},
   {t:'심화 — 왜 직각인가: 잔차가 열공간에 수직일 때 거리가 최소가 됨을 피타고라스 정리로 설명하고, 정규방정식 AᵀAx = Aᵀb 가 그 조건임을 보이세요.'}];

  M['261'] = [
   {t:'1분 자유 탐색 — 축을 돌려 보세요. 붉은 점들이 어떻게 흩어지나요?'},
   {t:'오늘의 문제 — 상관 정도를 0.9 로 올리세요. 첫 축이 담는 비율이 얼마인가요?',
    re:'축을 줄여도 되는 자료입니다',
    do:'① 상관을 0.9 로 ② 첫 축 비율 읽기 ③ 두 고윳값 견주기',
    hand:'고윳값의 합이 전체 분산과 같은지 확인'},
   {t:'최대를 찾아 — 「가장 퍼지는 방향 찾기」를 누르세요. 분산이 얼마가 되나요?',
    re:'여기가 첫 번째 주성분입니다',
    do:'① 버튼 누르기 ② 각도 확인 ③ 분산과 최댓값 비교',
    hand:'그 각도의 방향벡터를 적어 고유벡터와 견주기'},
   {t:'(상관, 각도, 분산, 첫 축 비율) 을 여섯 줄 기록하세요.'},
   {t:'심화 — 왜 고유벡터인가: 단위벡터 방향 d 에 대한 분산이 dᵀΣd 임을 보이고, 그 최댓값이 Σ 의 가장 큰 고윳값이며 그때의 d 가 고유벡터임을 설명하세요.'}];

  s = s.slice(0, i0) + 'const MISSIONS=' + JSON.stringify(M, null, 1) + ';' + s.slice(i0 + mm[0].length);

  const PR2 = JSON.parse(s.match(/const PROBLEMS=(\{.*?\});/)[1]);
  const labsBlock = s.slice(s.indexOf('const LABS=['), s.indexOf('const THUMBS ='));
  const demoSrc = fs.readFileSync('algAD-demos.txt', 'utf8');
  let bad = 0;
  ['257', '258', '259', '260', '261'].forEach((k, ki) => {
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
  const key = s.match(/  link:'대각화\(LAB 250\)가 「좋은 기저를 고르는 일」임을 알려 줍니다\.'\}\r?\n\];/);
  if (!key) throw new Error('PRINS 끝 앵커 실패');
  s = s.replace(key[0], `  link:'대각화(LAB 250)가 「좋은 기저를 고르는 일」임을 알려 줍니다.'},

{tex:[
   {t:'R(\\\\theta)=\\\\begin{pmatrix}\\\\cos\\\\theta & -\\\\sin\\\\theta \\\\\\\\ \\\\sin\\\\theta & \\\\cos\\\\theta\\\\end{pmatrix}', s:'회전은 <b>행렬 하나</b>로 적힙니다.'},
   {t:'H=\\\\begin{pmatrix}1 & k \\\\\\\\ 0 & 1\\\\end{pmatrix},\\\\quad \\\\det H = 1', s:'전단은 밀기만 할 뿐 <b>넓이를 바꾸지 않습니다</b>.'},
   {t:'(A\\\\circ B)(\\\\vec{x})=AB\\\\vec{x},\\\\qquad AB\\\\ne BA', s:'합성은 <b>곱</b>이고, 곱은 <b>순서를 탑니다</b>.'}
  ],
  next:[
   {lv:'바로',   t:'행렬 읽기', d:'각 변환의 행렬을 직접 적어 보세요.'},
   {lv:'심화',   t:'교환 조건', d:'AB = BA 가 되는 경우를 찾으세요.'},
   {lv:'프로젝트', t:'변환 파이프라인', d:'여러 변환을 한 행렬로 합쳐 보세요.'}
  ],
  eq:'합성변환 = 행렬의 곱 (순서 주의)',
  what:'그림을 다루는 모든 조작이 <b>행렬 곱</b> 하나로 정리됩니다.',
  probe:'순서를 뒤집으면 두 도형이 어긋납니다.',
  link:'행렬 곱의 비가환(LAB 101)을 기하로 설명해 줍니다.'},

{tex:[
   {t:'\\\\vec{\\\\pi}_{k+1}=P\\\\vec{\\\\pi}_{k}', s:'한 단계마다 <b>전이행렬</b>을 한 번 곱합니다.'},
   {t:'P\\\\vec{\\\\pi}=\\\\vec{\\\\pi}\\\\ \\\\Rightarrow\\\\ \\\\lambda=1', s:'정상상태는 <b>고윳값 1</b> 의 고유벡터입니다.'},
   {t:'\\\\pi_A=\\\\frac{q}{p+q},\\\\qquad \\\\pi_B=\\\\frac{p}{p+q}', s:'두 상태라면 <b>공식</b>으로 바로 나옵니다.'}
  ],
  next:[
   {lv:'바로',   t:'직접 계산', d:'p, q 를 넣어 정상상태를 손으로 구하세요.'},
   {lv:'심화',   t:'수렴 속도', d:'차이가 매 단계 몇 배로 줄어드는지 재세요.'},
   {lv:'프로젝트', t:'페이지랭크', d:'링크 구조로 전이행렬을 만들어 순위를 매기세요.'}
  ],
  eq:'π = P π · π_A = q / (p + q)',
  what:'되풀이되는 변화의 <b>끝을 미리 아는</b> 실험입니다.',
  probe:'출발점을 어디로 바꿔도 같은 값으로 모입니다.',
  link:'대각화(LAB 250)의 대표적 응용이며, 확률과 이어집니다.'},

{tex:[
   {t:'\\\\text{proj}_{u}v=\\\\frac{v\\\\cdot u}{u\\\\cdot u}\\\\,u', s:'v 에서 <b>u 방향의 성분</b>만 뽑아낸 것입니다.'},
   {t:'w=v-\\\\frac{v\\\\cdot u}{u\\\\cdot u}\\\\,u', s:'그만큼 덜어 내면 <b>남는 것</b>이 w 입니다.'},
   {t:'w\\\\cdot u=0', s:'덜어 낸 뒤에는 반드시 <b>직각</b>입니다.'}
  ],
  next:[
   {lv:'바로',   t:'비율 구하기', d:'주어진 u, v 로 정사영 계수를 계산하세요.'},
   {lv:'심화',   t:'식으로 보이기', d:'(v − tu)·u = 0 을 풀어 t 를 구하세요.'},
   {lv:'프로젝트', t:'세 벡터로', d:'세 번째 벡터까지 직교화해 보세요.'}
  ],
  eq:'w = v − ((v·u)/(u·u)) u',
  what:'「직각으로 만든다」를 <b>한 번의 뺄셈</b>으로 해내는 실험입니다.',
  probe:'비율이 1 일 때만 내적이 정확히 0 이 됩니다.',
  link:'내적(LAB 162)의 응용이며, 최소제곱(LAB 260)의 준비입니다.'},

{tex:[
   {t:'\\\\min_{a,b}\\\\sum_{i}\\\\left(y_i-(ax_i+b)\\\\right)^{2}', s:'오차의 <b>제곱합</b>을 가장 작게 만듭니다.'},
   {t:'A^{T}A\\\\vec{x}=A^{T}\\\\vec{b}', s:'그 조건이 <b>정규방정식</b>입니다.'},
   {t:'\\\\vec{r}\\\\perp \\\\text{열공간}\\\\ \\\\Leftrightarrow\\\\ \\\\text{거리 최소}', s:'가장 가까움과 <b>직각</b>은 같은 말입니다.'}
  ],
  next:[
   {lv:'바로',   t:'손으로 맞추기', d:'슬라이더로 오차를 줄여 보세요.'},
   {lv:'심화',   t:'정규방정식', d:'두 식을 세워 a, b 를 직접 구하세요.'},
   {lv:'프로젝트', t:'실제 자료로', d:'측정 자료에 직선을 맞춰 예측해 보세요.'}
  ],
  eq:'AᵀA x = Aᵀb',
  what:'해가 없어도 <b>가장 가까운 답</b>은 있다는 것을 확인합니다.',
  probe:'오차가 최소일 때 두 내적이 정확히 0 이 됩니다.',
  link:'회귀직선(LAB 06)의 이론적 근거이며, 정사영과 이어집니다.'},

{tex:[
   {t:'\\\\Sigma=\\\\frac{1}{n}\\\\sum_i (\\\\vec{x}_i-\\\\bar{x})(\\\\vec{x}_i-\\\\bar{x})^{T}', s:'퍼짐을 담은 <b>공분산행렬</b>입니다.'},
   {t:'\\\\text{Var}(d)=d^{T}\\\\Sigma d', s:'방향 d 로 내려 찍었을 때의 <b>퍼진 정도</b>입니다.'},
   {t:'\\\\max_{|d|=1} d^{T}\\\\Sigma d=\\\\lambda_{1}', s:'가장 큰 값이 <b>최대 고윳값</b>, 그때의 d 가 고유벡터입니다.'}
  ],
  next:[
   {lv:'바로',   t:'최대 찾기', d:'축을 돌려 분산이 최대인 각을 찾으세요.'},
   {lv:'심화',   t:'비율 계산', d:'첫 축이 담는 정보의 비율을 구하세요.'},
   {lv:'프로젝트', t:'차원 축소', d:'특징 여러 개를 둘로 줄여 그려 보세요.'}
  ],
  eq:'Var(d) = dᵀ Σ d · 최댓값 = λ₁',
  what:'차원을 줄이면서도 <b>정보를 지키는</b> 기준을 세우는 실험입니다.',
  probe:'상관이 커질수록 첫 축이 담는 비율이 커집니다.',
  link:'고윳값(LAB 249)의 대표 응용이며, 기계학습의 전처리로 이어집니다.'}
];`);
}

/* THUMBS */
{
  const key = s.match(/   '기울어진 격자 위에 놓인 한 점'\)\r?\n\];/);
  if (!key) throw new Error('THUMBS 끝 앵커 실패');
  s = s.replace(key[0], `   '기울어진 격자 위에 놓인 한 점'),

 svg(\`<rect x="20" y="44" width="34" height="30" fill="none" stroke="\${TC.ink3}" stroke-width="1.2" stroke-dasharray="4 3"/>
   <polygon points="62,74 96,74 108,44 74,44" fill="\${TC.blue}" opacity=".25" stroke="\${TC.blue}" stroke-width="1.6"/>
   <polygon points="60,38 92,30 100,14 68,22" fill="none" stroke="\${TC.rose}" stroke-width="1.4" stroke-dasharray="4 3"/>
   <text x="60" y="92" font-size="8" font-weight="800" fill="\${TC.ink3}" text-anchor="middle">AB ≠ BA</text>\`,
   '순서를 바꾸면 어긋나는 두 변환 결과'),

 svg(\`<path d="M18 74 C36 40 56 30 102 28" stroke="\${TC.blue}" stroke-width="2.2" fill="none"/>
   <line x1="14" y1="28" x2="108" y2="28" stroke="\${TC.rose}" stroke-width="1.4" stroke-dasharray="4 3"/>
   <circle cx="70" cy="30" r="3.6" fill="\${TC.teal}"/>
   <text x="60" y="92" font-size="8" font-weight="800" fill="\${TC.ink3}" text-anchor="middle">정상상태</text>\`,
   '점선에 다가가 붙는 수렴 곡선'),

 svg(\`<line x1="24" y1="66" x2="100" y2="52" stroke="\${TC.blue}" stroke-width="2.4"/>
   <line x1="24" y1="66" x2="52" y2="18" stroke="\${TC.ink3}" stroke-width="1.6" opacity=".5"/>
   <line x1="24" y1="66" x2="42" y2="24" stroke="\${TC.teal}" stroke-width="2.4"/>
   <line x1="42" y1="24" x2="52" y2="18" stroke="\${TC.rose}" stroke-width="1.2" stroke-dasharray="3 3"/>
   <path d="M32 62 L36 63 L35 59" fill="none" stroke="\${TC.teal}" stroke-width="1.2"/>
   <text x="60" y="92" font-size="8" font-weight="800" fill="\${TC.ink3}" text-anchor="middle">w · u = 0</text>\`,
   '정사영을 덜어 내 직각이 된 벡터 그림'),

 svg(\`<line x1="16" y1="72" x2="106" y2="26" stroke="\${TC.blue}" stroke-width="2"/>
   <circle cx="36" cy="54" r="4" fill="\${TC.ink3}"/><line x1="36" y1="54" x2="36" y2="62" stroke="\${TC.rose}" stroke-width="1.8"/>
   <circle cx="62" cy="36" r="4" fill="\${TC.ink3}"/><line x1="62" y1="36" x2="62" y2="49" stroke="\${TC.rose}" stroke-width="1.8"/>
   <circle cx="88" cy="42" r="4" fill="\${TC.ink3}"/><line x1="88" y1="42" x2="88" y2="35" stroke="\${TC.rose}" stroke-width="1.8"/>
   <text x="60" y="92" font-size="8" font-weight="800" fill="\${TC.ink3}" text-anchor="middle">오차 제곱합 최소</text>\`,
   '직선에서 위아래로 뻗은 세 오차 선분'),

 svg(\`<g fill="\${TC.blue}" opacity=".75">
   <circle cx="30" cy="66" r="3"/><circle cx="40" cy="58" r="3"/><circle cx="48" cy="62" r="3"/>
   <circle cx="56" cy="50" r="3"/><circle cx="64" cy="46" r="3"/><circle cx="72" cy="38" r="3"/>
   <circle cx="80" cy="42" r="3"/><circle cx="88" cy="30" r="3"/></g>
   <line x1="22" y1="74" x2="98" y2="24" stroke="\${TC.teal}" stroke-width="2.2"/>
   <line x1="70" y1="70" x2="46" y2="34" stroke="\${TC.rose}" stroke-width="1.2" stroke-dasharray="3 3"/>
   <text x="60" y="92" font-size="8" font-weight="800" fill="\${TC.ink3}" text-anchor="middle">첫 번째 주성분</text>\`,
   '길게 늘어선 점들과 그 방향을 따르는 축')
];`);
}

new Function(s);
fs.writeFileSync(P, s);

{
  const C = 'src/55-catalog.js';
  let c = fs.readFileSync(C, 'utf8');
  const m = c.match(/(\{k:'xalg',g:'고급 대수 · 기저와 좌표'[^}]*\})(\r?\n\];)/);
  if (!m) throw new Error('LABCAT 끝 앵커 실패');
  c = c.replace(m[0], m[1] + `,
{k:'xalg',g:'고급 대수 · 선형변환의 합성',b:'곱하는 순서를 뒤집어 두 결과가 같게 나옴'},
{k:'xalg',g:'고급 대수 · 마르코프 연쇄',b:'각 열의 합을 1 로 맞추지 않아 확률의 총합이 점점 커짐'},
{k:'xalg',g:'고급 대수 · 직교화',b:'앞서 만든 벡터의 성분을 덜 빼 남은 벡터가 직교하지 않음'},
{k:'xalg',g:'고급 대수 · 최소제곱',b:'잔차를 열공간에 수직으로 두지 않아 오차가 최소가 아님'},
{k:'xalg',g:'고급 대수 · 주성분',b:'분산을 재기 전에 평균을 빼지 않아 축이 원점 쪽으로 끌려감'}` + m[2]);
  fs.writeFileSync(C, c);
}
console.log('LAB 257~261 (고급 대수 C · 5종) 설치 완료');
