// 고급 기하 A — LAB 277~281 (체바·메넬라우스·오심·오일러 직선·방멱) 전 계층 설치
import fs from 'node:fs';
const P = 'src/40-demos.js';
let s = fs.readFileSync(P, 'utf8');
const NAMES = ['cevaDemo', 'menelausDemo', 'centersDemo', 'eulerLineDemo', 'powerPointDemo'];
if (s.includes('function cevaDemo')) throw new Error('이미 설치됨');
for (const n of NAMES) if (s.includes('function ' + n + '(')) throw new Error('이름 충돌: ' + n);

{ const i = s.indexOf('const LABS=[');
  s = s.slice(0, i) + '\n' + fs.readFileSync('algAH-demos.txt', 'utf8') + '\n' + s.slice(i); }

{ const key = ' build:greenDemo}\n];';
  const i = s.indexOf(key);
  if (i < 0) throw new Error('LABS 끝 앵커 실패');
  s = s.slice(0, i) + ` build:greenDemo},
{n:277,core:0,t:'“한 점에서 만나려면” 체바 정리',q:'세 선분이 한 점에서 만나는 조건은?',
 m:['체바 정리','분점의 비','공점'],a:['기하 제약 해석','구조 설계'],
 note:'세 비의 곱이 1 일 때만 세 선분이 한 점에서 만납니다. 만나지 않으면 작은 삼각형이 생깁니다.',
 build:cevaDemo},
{n:278,core:0,t:'“부호가 있어야 한다” 메넬라우스 정리',q:'세 점이 한 직선 위인지 어떻게 알까?',
 m:['메넬라우스 정리','부호 있는 비','공선'],a:['사영 판정','좌표 없는 증명'],
 note:'부호를 넣은 세 비의 곱이 −1 이면 세 점이 한 직선 위입니다. 부호를 버리면 바깥 자름을 구별하지 못합니다.',
 build:menelausDemo},
{n:279,core:0,t:'“중심이 왜 여럿일까” 삼각형의 중심들',q:'무엇을 기준으로 삼느냐에 따라 달라질까?',
 m:['무게중심','외심·수심','내심'],a:['중심의 정의','도형 해석'],
 note:'기준이 다르면 중심도 다릅니다. 정삼각형에서만 한 점으로 모이고, 둔각이면 밖으로 나갑니다.',
 build:centersDemo},
{n:280,core:0,t:'“세 점이 한 줄에” 오일러 직선',q:'모양이 변해도 남는 관계가 있을까?',
 m:['오일러 직선','불변 관계','닮음'],a:['불변량','기하 증명'],
 note:'외심·무게중심·수심은 언제나 한 직선 위에 있고 OG : GH = 1 : 2 입니다.',
 build:eulerLineDemo},
{n:281,core:0,t:'“어떤 할선이든 같은 곱” 방멱',q:'점 하나가 원에 대해 갖는 값은?',
 m:['방멱','할선과 접선','부호'],a:['근축','기하 계산'],
 note:'점에서 그은 어떤 할선이든 두 거리의 곱이 같고, 그 값이 d² − r² 입니다. 원 안이면 음수입니다.',
 build:powerPointDemo}
];` + s.slice(i + key.length);
}

{
  const m = s.match(/const PROBLEMS=(\{.*?\});/);
  if (!m) throw new Error('PROBLEMS 앵커 실패');
  const PR = JSON.parse(m[1]);
  PR['277'] = { sit: '삼각형 모양의 판을 세 꼭짓점에서 각각 반대편으로 줄을 걸어 한 점에 매달려 합니다.',
    ask: '아무 곳에나 걸어도 한 점에서 만날까? 만나게 하는 조건이 있을까?' };
  PR['278'] = { sit: '자를 대고 삼각형을 가로질렀더니 세 변(의 연장)과 세 곳에서 만났습니다.',
    ask: '그 세 점 사이에는 어떤 관계가 있을까? 비만 재면 한 직선인지 알 수 있을까?' };
  PR['279'] = { sit: '삼각형의 「중심」을 찾으라고 했더니 네 사람이 서로 다른 점을 찍었습니다. 모두 근거가 있습니다.',
    ask: '누가 맞을까? 「중심」이라는 말에 무엇이 숨어 있을까?' };
  PR['280'] = { sit: '삼각형을 아무렇게나 찌그러뜨려도 세 중심이 늘 한 직선 위에 놓입니다.',
    ask: '정말 언제나 그럴까? 세 점 사이의 간격에도 규칙이 있을까?' };
  PR['281'] = { sit: '원 밖의 한 점에서 원을 가로지르는 선을 여러 개 그었더니, 두 교점까지의 거리의 곱이 늘 같았습니다.',
    ask: '왜 각도와 상관없이 같을까? 그 값은 무엇으로 정해질까?' };
  s = s.replace(m[0], 'const PROBLEMS=' + JSON.stringify(PR) + ';');

  const i0 = s.indexOf('const MISSIONS=');
  const mm = s.slice(i0).match(/^const MISSIONS=\{[\s\S]*?\n\};/);
  if (!mm) throw new Error('MISSIONS 앵커 실패');
  const M = new Function('return ' + mm[0].slice('const MISSIONS='.length, -1))();

  M['277'] = [
   {t:'1분 자유 탐색 — 세 비를 움직여 보세요. 붉은 삼각형이 언제 커지나요?'},
   {t:'오늘의 문제 — AF : FB 를 1.0 으로 맞추세요. 세 선분이 어떻게 되나요?',
    re:'세 선분이 한 점에서 만났습니다',
    do:'① 세 번째 비를 1.0 으로 ② 곱 값 확인 ③ 붉은 삼각형이 사라지는지 보기',
    hand:'1 × 1 × 1 을 계산해 조건과 맞춰 보기'},
   {t:'어긋나게 — AF : FB 를 2.0 으로 올리세요. 무엇이 생기나요?',
    re:'교점 셋이 작은 삼각형을 이룹니다',
    do:'① 세 번째 비를 2.0 으로 ② 붉은 삼각형 보기 ③ 벌어진 정도 읽기',
    hand:'곱이 2 라는 것과 그림을 이어서 설명해 보기'},
   {t:'(세 비, 곱, 벌어진 정도) 를 여섯 줄 기록하세요.'},
   {t:'심화 — 왜 곱인가: 넓이의 비를 이용해 (BD/DC)(CE/EA)(AF/FB) = 1 을 증명하고, 무게중심·내심이 이 조건을 어떻게 만족하는지 확인하세요.'}];

  M['278'] = [
   {t:'1분 자유 탐색 — 세 비를 움직여 보세요. E 가 붉은 직선에 언제 가까워지나요?'},
   {t:'오늘의 문제 — CE : EA 를 −0.25 로 맞추세요. 세 점이 어떻게 놓이나요?',
    re:'부호까지 넣은 곱이 −1 입니다',
    do:'① 세 번째 비를 −0.25 로 ② 곱 값 확인 ③ E 의 벗어남 읽기',
    hand:'2 × 2 × (−0.25) 를 계산해 −1 인지 확인'},
   {t:'부호를 버리면 — 「부호를 무시하고 계산하기」를 켜세요.',
    re:'바깥에서 자른 경우를 구별할 수 없습니다',
    do:'① 체크 켜기 ② 곱의 부호 확인 ③ E 가 변 바깥에 있음을 보기',
    hand:'양수 비와 음수 비가 각각 안팎 어느 쪽인지 적기'},
   {t:'(세 비, 곱, E 의 벗어남) 을 여섯 줄 기록하세요.'},
   {t:'심화 — +1 과 −1: 체바(한 점에서 만남)는 +1, 메넬라우스(한 직선 위)는 −1 입니다. 두 정리를 나란히 적고 부호가 무엇을 가르는지 설명하세요.'}];

  M['279'] = [
   {t:'1분 자유 탐색 — C 를 옮겨 보세요. 네 점이 어떻게 흩어지나요?'},
   {t:'오늘의 문제 — C 를 (1.9, −1.3) 으로 옮기세요. 네 중심이 어떻게 되나요?',
    re:'네 중심이 한 점으로 모였습니다',
    do:'① x 를 1.9 로 ② y 를 −1.3 으로 ③ 벌어진 정도 읽기',
    hand:'세 변의 길이를 재어 정삼각형인지 확인'},
   {t:'둔각으로 — y 를 2.4 로 올리세요. O 와 H 가 어디에 있나요?',
    re:'외심과 수심이 삼각형 밖으로 나갔습니다',
    do:'① y 를 2.4 로 ② 가장 큰 각 확인 ③ 네 점의 위치 보기',
    hand:'코사인법칙으로 가장 큰 각을 계산'},
   {t:'(C 의 위치, 가장 큰 각, 벌어진 정도) 를 여섯 줄 기록하세요.'},
   {t:'심화 — 정의로 돌아가기: 무게중심·외심·수심·내심을 각각 「무엇이 같은 점」으로 정의하는지 한 줄씩 쓰고, 그 정의에서 왜 서로 다른 점이 나오는지 설명하세요.'}];

  M['280'] = [
   {t:'1분 자유 탐색 — C 를 옮겨 보세요. OG : GH 가 변하나요?'},
   {t:'오늘의 문제 — C 를 (0.8, −0.6) 으로 옮기세요. 내심 I 가 어디에 있나요?',
    re:'내심까지 같은 직선 위에 올라왔습니다',
    do:'① x 를 0.8 로 ② y 를 −0.6 으로 ③ I 의 벗어남 읽기',
    hand:'AC 와 BC 의 길이를 재어 이등변인지 확인'},
   {t:'끝까지 — C 를 (1.9, −1.3) 으로 옮기세요. 직선이 어떻게 되나요?',
    re:'직선 자체가 사라졌습니다',
    do:'① x 를 1.9 로 ② y 를 −1.3 으로 ③ 네 점의 위치 보기',
    hand:'정삼각형에서 네 중심이 겹치는 까닭을 대칭으로 설명'},
   {t:'(C, OG, GH, 비, I 의 벗어남) 을 여섯 줄 기록하세요.'},
   {t:'심화 — 1 : 2 의 뿌리: 무게중심이 중선을 2 : 1 로 나눈다는 사실에서 OG : GH = 1 : 2 를 유도하고, 그 비가 모양과 무관한 까닭을 밝히세요.'}];

  M['281'] = [
   {t:'1분 자유 탐색 — 할선의 각도를 돌려 보세요. 두 거리의 곱이 변하나요?'},
   {t:'오늘의 문제 — 「접선 그리기」를 누르세요. 접선 길이와 방멱은 어떤 관계인가요?',
    re:'접선 길이의 제곱이 곧 방멱입니다',
    do:'① 버튼 누르기 ② 접점 두 곳 확인 ③ 방멱 값과 견주기',
    hand:'피타고라스 정리로 접선 길이 √(d² − r²) 를 유도'},
   {t:'안으로 — 거리를 0.8 로 줄이세요. 방멱의 부호가 어떻게 되나요?',
    re:'점이 원 안으로 들어가자 방멱이 음수',
    do:'① 거리를 0.8 로 ② 부호 확인 ③ 두 교점의 방향 보기',
    hand:'점을 사이에 두고 두 선분이 반대로 뻗는 것을 그림으로 표시'},
   {t:'(거리, 각, 두 거리의 곱, d² − r²) 을 여섯 줄 기록하세요.'},
   {t:'심화 — 근축으로: 두 원에 대한 방멱이 같은 점들이 이루는 도형이 직선(근축)임을 두 방멱 식을 빼서 보이고, 두 원이 만나지 않을 때도 그 직선이 있음을 설명하세요.'}];

  s = s.slice(0, i0) + 'const MISSIONS=' + JSON.stringify(M, null, 1) + ';' + s.slice(i0 + mm[0].length);

  const PR2 = JSON.parse(s.match(/const PROBLEMS=(\{.*?\});/)[1]);
  const labsBlock = s.slice(s.indexOf('const LABS=['), s.indexOf('const THUMBS ='));
  const demoSrc = fs.readFileSync('algAH-demos.txt', 'utf8');
  let bad = 0;
  ['277', '278', '279', '280', '281'].forEach((k, ki) => {
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
  const key = s.match(/  link:'선적분\(LAB 274\)의 정점이며, 측량 도구의 원리입니다\.'\}\r?\n\];/);
  if (!key) throw new Error('PRINS 끝 앵커 실패');
  s = s.replace(key[0], `  link:'선적분(LAB 274)의 정점이며, 측량 도구의 원리입니다.'},

{tex:[
   {t:'\\\\frac{BD}{DC}\\\\cdot\\\\frac{CE}{EA}\\\\cdot\\\\frac{AF}{FB}=1', s:'세 선분이 <b>한 점</b>에서 만날 조건입니다.'},
   {t:'\\\\frac{BD}{DC}=\\\\frac{[ABP]}{[ACP]}', s:'비를 <b>넓이의 비</b>로 바꾸는 것이 증명의 열쇠입니다.'},
   {t:'\\\\text{무게중심}:\\\\ 1\\\\cdot 1\\\\cdot 1=1', s:'세 중선이 한 점에서 만나는 것도 <b>같은 조건</b>입니다.'}
  ],
  next:[
   {lv:'바로',   t:'조건 확인', d:'세 비의 곱이 1 이 되는 조합을 찾으세요.'},
   {lv:'심화',   t:'넓이로 증명', d:'넓이의 비를 써서 정리를 증명하세요.'},
   {lv:'프로젝트', t:'중심 다시 보기', d:'내심·방심이 조건을 만족함을 확인하세요.'}
  ],
  eq:'(BD/DC)(CE/EA)(AF/FB) = 1',
  what:'「한 점에서 만난다」는 기하의 사실이 <b>곱 하나</b>로 판정됩니다.',
  probe:'곱을 1 에서 벗어나게 하면 작은 삼각형이 생깁니다.',
  link:'무게중심·내심이 왜 존재하는지 한 조건으로 설명해 줍니다.'},

{tex:[
   {t:'\\\\frac{AF}{FB}\\\\cdot\\\\frac{BD}{DC}\\\\cdot\\\\frac{CE}{EA}=-1', s:'세 점이 <b>한 직선</b> 위일 조건입니다.'},
   {t:'\\\\text{부호}:\\\\ \\\\text{안쪽 분점}>0,\\\\ \\\\text{바깥쪽 분점}<0', s:'부호가 <b>안팎</b>을 기억합니다.'},
   {t:'\\\\text{체바}=+1,\\\\qquad \\\\text{메넬라우스}=-1', s:'부호 하나가 두 정리를 <b>가릅니다</b>.'}
  ],
  next:[
   {lv:'바로',   t:'−1 만들기', d:'곱이 −1 이 되는 조합을 찾으세요.'},
   {lv:'심화',   t:'부호의 뜻', d:'음수 비가 어떤 위치인지 그림으로 설명하세요.'},
   {lv:'프로젝트', t:'두 정리 비교', d:'같은 그림에서 두 정리를 함께 확인하세요.'}
  ],
  eq:'세 비의 곱 = −1 ⇔ 한 직선 위',
  what:'부호 있는 비가 <b>위치 정보</b>를 담는다는 것을 확인합니다.',
  probe:'부호를 버리면 바깥에서 자른 경우가 구별되지 않습니다.',
  link:'체바 정리(LAB 277)와 짝을 이루는 정리입니다.'},

{tex:[
   {t:'G=\\\\frac{A+B+C}{3}', s:'무게중심은 <b>세 점의 평균</b>입니다.'},
   {t:'I=\\\\frac{aA+bB+cC}{a+b+c}', s:'내심은 <b>변의 길이로 가중한 평균</b>입니다.'},
   {t:'H=A+B+C-2O', s:'수심은 외심과 <b>이 관계</b>로 이어져 있습니다.'}
  ],
  next:[
   {lv:'바로',   t:'좌표로 구하기', d:'세 꼭짓점 좌표로 네 중심을 계산하세요.'},
   {lv:'심화',   t:'정의 정리', d:'각 중심의 정의를 한 줄씩 적어 견주세요.'},
   {lv:'프로젝트', t:'방심까지', d:'세 방심을 더해 「오심」을 완성하세요.'}
  ],
  eq:'G = (A + B + C)/3 · I = (aA + bB + cC)/(a + b + c)',
  what:'같은 말 「중심」에 <b>서로 다른 정의</b>가 들어 있음을 확인합니다.',
  probe:'정삼각형에서만 네 중심이 한 점으로 모입니다.',
  link:'가중평균(LAB 222)이 기하에 나타나는 자리입니다.'},

{tex:[
   {t:'O,\\\\ G,\\\\ H\\\\ \\\\text{는 한 직선 위에 있다}', s:'모양과 <b>무관한</b> 사실입니다.'},
   {t:'\\\\overline{OG}:\\\\overline{GH}=1:2', s:'간격의 비까지 <b>언제나</b> 같습니다.'},
   {t:'\\\\vec{OH}=3\\\\,\\\\vec{OG}', s:'벡터로 쓰면 <b>한 줄</b>로 끝납니다.'}
  ],
  next:[
   {lv:'바로',   t:'비 확인', d:'여러 모양에서 OG : GH 를 재세요.'},
   {lv:'심화',   t:'벡터 증명', d:'H = A + B + C − 2O 를 이용해 보이세요.'},
   {lv:'프로젝트', t:'구점원', d:'오일러 직선과 구점원의 관계를 조사하세요.'}
  ],
  eq:'OH = 3 OG · OG : GH = 1 : 2',
  what:'모양이 변해도 <b>변하지 않는 관계</b>가 정리라는 것을 봅니다.',
  probe:'어떻게 찌그러뜨려도 비는 1 : 2 그대로입니다.',
  link:'삼각형의 중심들(LAB 279)에서 한 걸음 더 나아간 자리입니다.'},

{tex:[
   {t:'PA\\\\cdot PB=d^{2}-r^{2}', s:'할선을 어떻게 돌려도 <b>같은 값</b>입니다.'},
   {t:'PT^{2}=d^{2}-r^{2}', s:'접선 길이의 <b>제곱</b>이 곧 방멱입니다.'},
   {t:'d<r \\\\Rightarrow d^{2}-r^{2}<0', s:'원 안에서는 <b>음수</b>가 됩니다.'}
  ],
  next:[
   {lv:'바로',   t:'값 확인', d:'각도를 바꿔도 곱이 같은지 재세요.'},
   {lv:'심화',   t:'접선 유도', d:'피타고라스로 접선 길이를 구하세요.'},
   {lv:'프로젝트', t:'근축 찾기', d:'두 원의 방멱이 같은 점들을 그려 보세요.'}
  ],
  eq:'PA · PB = d² − r²',
  what:'점 하나가 원에 대해 갖는 <b>고유한 수</b>를 확인하는 실험입니다.',
  probe:'점을 원 안으로 옮기면 값이 음수로 바뀝니다.',
  link:'원의 방정식(LAB 01)과 이어지며, 근축·극선으로 나아갑니다.'}
];`);
}

/* THUMBS */
{
  const key = s.match(/   '둘레를 도는 동안 부채꼴을 쓸고 가는 그림'\)\r?\n\];/);
  if (!key) throw new Error('THUMBS 끝 앵커 실패');
  s = s.replace(key[0], `   '둘레를 도는 동안 부채꼴을 쓸고 가는 그림'),

 svg(\`<polygon points="60,14 102,80 18,80" fill="\${TC.teal}" opacity=".12" stroke="\${TC.teal}" stroke-width="1.8"/>
   <line x1="60" y1="14" x2="60" y2="80" stroke="\${TC.blue}" stroke-width="1.4"/>
   <line x1="18" y1="80" x2="81" y2="47" stroke="\${TC.blue}" stroke-width="1.4"/>
   <line x1="102" y1="80" x2="39" y2="47" stroke="\${TC.blue}" stroke-width="1.4"/>
   <circle cx="60" cy="58" r="4" fill="\${TC.rose}"/>
   <text x="60" y="96" font-size="8" font-weight="800" fill="\${TC.ink3}" text-anchor="middle">곱 = 1</text>\`,
   '한 점에서 만나는 세 개의 체바 선분'),

 svg(\`<polygon points="58,16 96,74 20,74" fill="none" stroke="\${TC.teal}" stroke-width="1.8"/>
   <line x1="10" y1="66" x2="112" y2="30" stroke="\${TC.rose}" stroke-width="2"/>
   <circle cx="34" cy="58" r="3.6" fill="\${TC.blue}"/>
   <circle cx="70" cy="45" r="3.6" fill="\${TC.blue}"/>
   <circle cx="104" cy="33" r="3.6" fill="\${TC.blue}"/>
   <text x="60" y="92" font-size="8" font-weight="800" fill="\${TC.ink3}" text-anchor="middle">곱 = −1</text>\`,
   '삼각형을 가로지르는 직선과 세 교점'),

 svg(\`<circle cx="60" cy="46" r="34" fill="none" stroke="\${TC.ink3}" stroke-width="1" opacity=".4"/>
   <polygon points="60,14 92,66 26,66" fill="\${TC.teal}" opacity=".1" stroke="\${TC.teal}" stroke-width="1.6"/>
   <circle cx="59" cy="49" r="4" fill="\${TC.blue}"/>
   <circle cx="60" cy="46" r="4" fill="\${TC.amber || TC.rose}"/>
   <circle cx="58" cy="54" r="4" fill="\${TC.rose}"/>
   <circle cx="62" cy="38" r="4" fill="#7C3AED"/>
   <text x="60" y="90" font-size="8" font-weight="800" fill="\${TC.ink3}" text-anchor="middle">G O H I</text>\`,
   '한 삼각형 안에 흩어진 네 개의 중심점'),

 svg(\`<polygon points="52,14 98,70 16,70" fill="none" stroke="\${TC.teal}" stroke-width="1.6"/>
   <line x1="14" y1="60" x2="108" y2="26" stroke="\${TC.rose}" stroke-width="1.8" stroke-dasharray="5 4"/>
   <circle cx="34" cy="53" r="4" fill="\${TC.blue}"/>
   <circle cx="56" cy="45" r="4" fill="\${TC.teal}"/>
   <circle cx="100" cy="29" r="4" fill="#7C3AED"/>
   <text x="60" y="90" font-size="8" font-weight="800" fill="\${TC.ink3}" text-anchor="middle">1 : 2</text>\`,
   '한 직선 위에 놓인 외심 무게중심 수심'),

 svg(\`<circle cx="50" cy="46" r="26" fill="none" stroke="\${TC.teal}" stroke-width="2"/>
   <line x1="102" y1="60" x2="30" y2="30" stroke="\${TC.blue}" stroke-width="1.8"/>
   <line x1="102" y1="60" x2="68" y2="26" stroke="\${TC.rose}" stroke-width="1.6"/>
   <circle cx="102" cy="60" r="4" fill="\${TC.ink3}"/>
   <circle cx="68" cy="26" r="3.2" fill="\${TC.rose}"/>
   <text x="60" y="94" font-size="8" font-weight="800" fill="\${TC.ink3}" text-anchor="middle">d² − r²</text>\`,
   '원 밖 한 점에서 그은 할선과 접선')
];`);
}

new Function(s);
fs.writeFileSync(P, s);

{
  const C = 'src/55-catalog.js';
  let c = fs.readFileSync(C, 'utf8');
  const m = c.match(/(\{k:'xcal',g:'고급 미적분 · 그린 정리'[^}]*\})(\r?\n\];)/);
  if (!m) throw new Error('LABCAT 끝 앵커 실패');
  c = c.replace(m[0], m[1] + `,
{k:'xgeo',g:'고급 기하 · 체바 정리',b:'세 비의 곱이 아니라 합이 1 인지 검사해 만나지 않는데 만난다고 함'},
{k:'xgeo',g:'고급 기하 · 메넬라우스 정리',b:'방향(부호)을 무시해 바깥에서 자를 때 부호가 안 맞음'},
{k:'xgeo',g:'고급 기하 · 삼각형의 중심들',b:'외심을 세 변의 중점의 평균으로 잡아 무게중심과 겹침'},
{k:'xgeo',g:'고급 기하 · 오일러 직선',b:'내심까지 직선 위에 올려 정삼각형이 아닌데도 네 점이 일직선으로 나옴'},
{k:'xgeo',g:'고급 기하 · 방멱',b:'점이 원 안에 있을 때 부호를 안 바꿔 방멱이 늘 양수로 나옴'}` + m[2]);
  fs.writeFileSync(C, c);
}
console.log('LAB 277~281 (고급 기하 A · 5종) 설치 완료');
