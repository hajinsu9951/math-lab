// 고급 기하 C — LAB 287~291 (두 평면의 각·이차곡면 단면·회전면·구면 삼각형·쌍곡기하) 전 계층 설치
import fs from 'node:fs';
const P = 'src/40-demos.js';
let s = fs.readFileSync(P, 'utf8');
const NAMES = ['planeAngleDemo', 'quadSurfDemo', 'revolveSurfDemo', 'sphericalDemo', 'hyperbolicDemo'];
if (s.includes('function planeAngleDemo')) throw new Error('이미 설치됨');
for (const n of NAMES) if (s.includes('function ' + n + '(')) throw new Error('이름 충돌: ' + n);

{ const i = s.indexOf('const LABS=[');
  s = s.slice(0, i) + '\n' + fs.readFileSync('algAJ-demos.txt', 'utf8') + '\n' + s.slice(i); }

{ const key = ' build:planeDemo}\n];';
  const i = s.indexOf(key);
  if (i < 0) throw new Error('LABS 끝 앵커 실패');
  s = s.slice(0, i) + ` build:planeDemo},
{n:287,core:0,t:'“지붕의 각을 재려면” 두 평면이 이루는 각',q:'법선 사이의 각을 그대로 써도 될까?',
 m:['법선벡터','내적','예각 약속'],a:['건축 각도','면 각도 계산'],
 note:'법선은 방향이 둘이라 각이 두 가지로 나옵니다. 둔각이 나오면 180°에서 빼 예각으로 약속합니다.',
 build:planeAngleDemo},
{n:288,core:0,t:'“자른 면만 보고 알아맞히기” 이차곡면의 단면',q:'단면 하나로 입체를 정할 수 있을까?',
 m:['이차곡면','단면','분류'],a:['단층 촬영','형상 인식'],
 note:'한 높이의 단면만으로는 입체를 정하지 못합니다. 원뿔면과 일엽쌍곡면은 둘 다 원 단면을 냅니다.',
 build:quadSurfDemo},
{n:289,core:0,t:'“곡선을 돌리면” 회전면 만들기',q:'축을 바꾸면 무엇이 달라질까?',
 m:['회전면','대칭축','곡면'],a:['선반 가공','3D 모델링'],
 note:'회전면은 곡선과 축의 짝으로 정해집니다. 같은 곡선이라도 축이 다르면 전혀 다른 입체가 됩니다.',
 build:revolveSurfDemo},
{n:290,core:0,t:'“180°를 넘는 삼각형” 구면 기하',q:'지구 위 삼각형의 내각의 합은?',
 m:['대원','구면 삼각형','구면 초과'],a:['측지선 항법','지구 측량'],
 note:'구 위에서는 대원이 직선입니다. 내각의 합이 180°를 넘고, 넘은 만큼이 곧 넓이입니다.',
 build:sphericalDemo},
{n:291,core:0,t:'“평행선이 여럿인 세계” 쌍곡기하 맛보기',q:'공준 하나를 바꾸면 어떻게 될까?',
 m:['평행선 공준','푸앵카레 원판','비유클리드'],a:['비유클리드 모델','상대성 이론'],
 note:'경계에 수직인 원호가 직선인 세계입니다. 한 점을 지나 만나지 않는 직선이 무수히 많습니다.',
 build:hyperbolicDemo}
];` + s.slice(i + key.length);
}

{
  const m = s.match(/const PROBLEMS=(\{.*?\});/);
  if (!m) throw new Error('PROBLEMS 앵커 실패');
  const PR = JSON.parse(m[1]);
  PR['287'] = { sit: '지붕 두 면이 만나는 각을 재려고 법선벡터의 내적을 썼더니 120° 가 나왔습니다.',
    ask: '지붕이 정말 120° 로 벌어져 있을까? 무엇을 더 따져야 할까?' };
  PR['288'] = { sit: 'CT 촬영은 한 층씩 잘라 찍습니다. 어떤 층에서는 두 입체의 단면이 똑같이 원이었습니다.',
    ask: '한 장만 보고 입체를 알 수 있을까? 몇 장이 있어야 할까?' };
  PR['289'] = { sit: '선반에 곡선 모양의 칼을 대고 재료를 돌리면 입체가 깎여 나옵니다.',
    ask: '같은 칼을 써도 돌리는 축이 다르면 결과가 달라질까?' };
  PR['290'] = { sit: '서울에서 뉴욕으로 가는 비행기는 지도 위에서 크게 휘어진 길을 갑니다. 그런데 그것이 최단 경로라고 합니다.',
    ask: '구 위에서 「직선」은 무엇일까? 삼각형의 내각의 합도 180° 일까?' };
  PR['291'] = { sit: '2000 년 동안 아무도 증명하지 못한 평행선 공준을, 사람들은 결국 「바꾸어」 보았습니다.',
    ask: '공준을 바꾸면 모순이 생길까? 아니면 다른 기하가 만들어질까?' };
  s = s.replace(m[0], 'const PROBLEMS=' + JSON.stringify(PR) + ';');

  const i0 = s.indexOf('const MISSIONS=');
  const mm = s.slice(i0).match(/^const MISSIONS=\{[\s\S]*?\n\};/);
  if (!mm) throw new Error('MISSIONS 앵커 실패');
  const M = new Function('return ' + mm[0].slice('const MISSIONS='.length, -1))();

  M['287'] = [
   {t:'1분 자유 탐색 — 두 기울기를 움직여 보세요. 법선 사이의 각이 어떻게 변하나요?'},
   {t:'오늘의 문제 — 「둔각을 고치지 않고 그대로 쓰기」를 켜세요. 값이 어떻게 되나요?',
    re:'둔각을 그대로 쓰니 약속한 값과 어긋났습니다',
    do:'① 체크 켜기 ② 화면에 쓰는 값 확인 ③ 약속한 값과 견주기',
    hand:'cos 의 부호가 음수일 때 각이 둔각임을 확인'},
   {t:'법선을 뒤집으면 — 「② 평면의 법선을 뒤집기」를 켜세요.',
    re:'법선의 방향은 두 가지입니다',
    do:'① 체크 켜기 ② 각의 변화 보기 ③ 화살표 방향 확인',
    hand:'n 과 −n 의 내적 부호를 견주기'},
   {t:'(두 기울기, 법선 각, 약속한 값) 을 여섯 줄 기록하세요.'},
   {t:'심화 — 약속의 이유: 두 평면이 이루는 각을 예각으로 약속하는 까닭을 「법선의 방향이 두 가지」라는 사실로 설명하고, 직선과 평면이 이루는 각은 왜 다르게 약속하는지 조사하세요.'}];

  M['288'] = [
   {t:'1분 자유 탐색 — 높이를 움직여 보세요. 단면이 어떻게 달라지나요?'},
   {t:'오늘의 문제 — 입체를 쌍곡포물면(안장)으로 바꾸세요. 단면이 무엇인가요?',
    re:'높이의 부호에 따라 방향이 90° 돌아갑니다',
    do:'① 입체를 쌍곡포물면으로 ② 단면 모양 보기 ③ 높이를 음수로도 바꿔 보기',
    hand:'z = x² − y² 에 z 를 넣어 단면의 식을 세우기'},
   {t:'허리가 잘록한 — 입체를 일엽쌍곡면으로 바꾸고 높이를 2 로 올리세요.',
    re:'허리가 잘록한 입체입니다',
    do:'① 입체를 일엽쌍곡면으로 ② 높이를 2 로 ③ 원의 크기 변화 보기',
    hand:'√(1 + z²) 를 계산해 z = 0, 1, 2 에서 견주기'},
   {t:'(입체, 높이, 단면, 크기) 를 여섯 줄 기록하세요.'},
   {t:'심화 — 같은 단면 다른 입체: 원뿔면과 일엽쌍곡면이 어떤 높이에서 같은 반지름의 원을 내는지 구하고, 그래도 두 입체를 구별하려면 무엇을 더 봐야 하는지 설명하세요.'}];

  M['289'] = [
   {t:'1분 자유 탐색 — 돌린 정도를 늘려 보세요. 자취가 어떻게 쌓이나요?'},
   {t:'오늘의 문제 — 돌린 정도를 100 % 로 하세요. 곡선이 무엇이 되었나요?',
    re:'곡선 하나가 곡면 하나가 되었습니다',
    do:'① 돌린 정도를 100 으로 ② 자취 보기 ③ 만들어진 입체 이름 읽기',
    hand:'회전으로 생기는 단면이 왜 원인지 적기'},
   {t:'축을 바꾸면 — 돌리는 축을 x 축으로 바꾸세요. 같은 곡선인데 어떤가요?',
    re:'같은 곡선인데 전혀 다른 입체가 나옵니다',
    do:'① 축을 x 축으로 ② 자취 모양 비교 ③ 곡선도 바꿔 가며 확인',
    hand:'두 경우의 단면 반지름이 무엇으로 정해지는지 적기'},
   {t:'(곡선, 축, 만들어진 입체) 를 여섯 줄 기록하세요.'},
   {t:'심화 — 회전면의 방정식: y = f(x) 를 x 축으로 돌리면 y² + z² = f(x)² 이 됨을 설명하고, y 축으로 돌릴 때의 식도 세우세요.'}];

  M['290'] = [
   {t:'1분 자유 탐색 — 두 슬라이더를 움직여 보세요. 막대가 붉은 선을 넘나요?'},
   {t:'오늘의 문제 — 위도 폭을 15°, 경도 폭을 90° 로 맞추세요. 내각의 합이 얼마인가요?',
    re:'내각의 합이 180°를 크게 넘어섰습니다',
    do:'① 위도 폭을 15 로 ② 경도 폭을 90 으로 ③ 내각의 합 읽기',
    hand:'구면 초과를 계산해 넓이와 견주기'},
   {t:'평면 공식으로 — 「평면 공식으로 계산하기」를 켜세요. 무슨 값이 나오나요?',
    re:'아무리 크게 그려도 언제나 180',
    do:'① 체크 켜기 ② 값 확인 ③ 크기를 바꿔도 그런지 보기',
    hand:'평면 공식이 구면에서 왜 틀리는지 한 줄로 적기'},
   {t:'(위도 폭, 경도 폭, 내각의 합, 구면 초과) 를 여섯 줄 기록하세요.'},
   {t:'심화 — 넘은 만큼이 넓이: 구면 삼각형의 넓이가 R²(A + B + C − π) 임을 조사하고, 삼각형이 아주 작아지면 왜 평면 기하와 같아지는지 설명하세요.'}];

  M['291'] = [
   {t:'1분 자유 탐색 — 직선의 수를 늘려 보세요. 모두 초록 직선을 피해 가나요?'},
   {t:'오늘의 문제 — 그려 볼 직선의 수를 5 로 올리세요. 몇 개나 되나요?',
    re:'평행선 공준이 깨진 세계입니다',
    do:'① 직선 수를 5 로 ② 모두 만나지 않는지 보기 ③ 유클리드와 견주기',
    hand:'유클리드 평면에서 그런 직선이 몇 개인지 적기'},
   {t:'가장자리로 — 점의 위치를 0.80 으로 옮기세요. 직선들이 어떻게 보이나요?',
    re:'원판의 가장자리는 무한히 먼 곳입니다',
    do:'① 위치를 0.80 으로 ② 휘어진 정도 보기 ③ 다시 안쪽으로 옮겨 비교',
    hand:'가장자리에 가까울수록 거리가 어떻게 늘어나는지 적기'},
   {t:'(점의 위치, 방향, 그린 직선 수) 를 여섯 줄 기록하세요.'},
   {t:'심화 — 모순이 없다: 쌍곡기하가 유클리드 기하와 마찬가지로 모순이 없다는 사실이 왜 중요한지, 그리고 그것이 「공준은 참인 사실이 아니라 약속」이라는 생각과 어떻게 이어지는지 한 문단으로 쓰세요.'}];

  s = s.slice(0, i0) + 'const MISSIONS=' + JSON.stringify(M, null, 1) + ';' + s.slice(i0 + mm[0].length);

  const PR2 = JSON.parse(s.match(/const PROBLEMS=(\{.*?\});/)[1]);
  const labsBlock = s.slice(s.indexOf('const LABS=['), s.indexOf('const THUMBS ='));
  const demoSrc = fs.readFileSync('algAJ-demos.txt', 'utf8');
  let bad = 0;
  ['287', '288', '289', '290', '291'].forEach((k, ki) => {
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
  const key = s.match(/  link:'직선의 방정식을 공간으로 넓힌 자리입니다\.'\}\r?\n\];/);
  if (!key) throw new Error('PRINS 끝 앵커 실패');
  s = s.replace(key[0], `  link:'직선의 방정식을 공간으로 넓힌 자리입니다.'},

{tex:[
   {t:'\\\\cos\\\\theta=\\\\frac{\\\\vec{n}_1\\\\cdot\\\\vec{n}_2}{\\\\left|\\\\vec{n}_1\\\\right|\\\\left|\\\\vec{n}_2\\\\right|}', s:'두 <b>법선</b> 사이의 각입니다.'},
   {t:'\\\\vec{n}\\\\ \\\\text{와}\\\\ -\\\\vec{n}\\\\ \\\\text{모두 법선}', s:'방향이 <b>두 가지</b>라 각도 두 가지입니다.'},
   {t:'\\\\text{두 평면의 각}=\\\\min(\\\\theta,\\\\ 180^\\\\circ-\\\\theta)', s:'그래서 <b>예각</b>으로 약속합니다.'}
  ],
  next:[
   {lv:'바로',   t:'각 구하기', d:'두 법선의 내적으로 각을 계산하세요.'},
   {lv:'심화',   t:'약속의 이유', d:'왜 예각으로 약속하는지 설명하세요.'},
   {lv:'프로젝트', t:'지붕 설계', d:'원하는 지붕 각을 내는 두 면을 설계하세요.'}
  ],
  eq:'cos θ = (n₁ · n₂) / (|n₁||n₂|)',
  what:'공식을 <b>그대로 쓰면 안 되는</b> 자리를 짚는 실험입니다.',
  probe:'법선을 뒤집으면 각이 보각으로 바뀝니다.',
  link:'평면의 방정식(LAB 286)에서 바로 이어집니다.'},

{tex:[
   {t:'z=x^{2}+y^{2}\\\\ \\\\Rightarrow\\\\ \\\\text{단면은 원}', s:'높이가 <b>반지름의 제곱</b>이 됩니다.'},
   {t:'z=x^{2}-y^{2}\\\\ \\\\Rightarrow\\\\ \\\\text{단면은 쌍곡선}', s:'z 의 <b>부호</b>가 방향을 뒤집습니다.'},
   {t:'x^{2}+y^{2}-z^{2}=1\\\\ \\\\Rightarrow\\\\ r=\\\\sqrt{1+z^{2}}', s:'허리가 <b>잘록한</b> 입체입니다.'}
  ],
  next:[
   {lv:'바로',   t:'단면 세우기', d:'각 입체의 단면 식을 직접 구하세요.'},
   {lv:'심화',   t:'같은 단면', d:'같은 원을 내는 두 입체를 찾으세요.'},
   {lv:'프로젝트', t:'단층 촬영', d:'여러 단면으로 입체를 복원해 보세요.'}
  ],
  eq:'z 를 고정하면 남는 식이 곧 단면',
  what:'차원을 하나 낮추어 <b>보이는 것으로</b> 바꾸는 방법입니다.',
  probe:'같은 높이에서 서로 다른 입체가 같은 단면을 냅니다.',
  link:'이차곡선(LAB 47)을 공간으로 넓힌 자리입니다.'},

{tex:[
   {t:'y=f(x)\\\\ \\\\text{를 } x \\\\text{축으로} \\\\Rightarrow y^{2}+z^{2}=f(x)^{2}', s:'단면이 <b>반지름 f(x) 인 원</b>이 됩니다.'},
   {t:'y=f(x)\\\\ \\\\text{를 } y \\\\text{축으로} \\\\Rightarrow x^{2}+z^{2}=g(y)^{2}', s:'축이 바뀌면 <b>식도 바뀝니다</b>.'},
   {t:'\\\\text{회전면}=\\\\text{곡선}+\\\\text{축}', s:'둘 중 하나만으로는 <b>정해지지 않습니다</b>.'}
  ],
  next:[
   {lv:'바로',   t:'입체 알아맞히기', d:'곡선과 축을 보고 입체를 예측하세요.'},
   {lv:'심화',   t:'식 세우기', d:'회전면의 방정식을 직접 유도하세요.'},
   {lv:'프로젝트', t:'부피 구하기', d:'회전체의 부피를 적분으로 구하세요.'}
  ],
  eq:'y² + z² = f(x)²',
  what:'평면의 곡선 하나가 <b>공간의 곡면</b>이 되는 과정을 봅니다.',
  probe:'축을 바꾸면 같은 곡선이 다른 입체를 만듭니다.',
  link:'회전체의 부피(LAB 24)의 기하적 바탕입니다.'},

{tex:[
   {t:'\\\\text{구 위의 「직선」}=\\\\text{대원}', s:'가장 짧은 길이 <b>대원</b>입니다.'},
   {t:'A+B+C>180^\\\\circ', s:'내각의 합이 <b>180°를 넘습니다</b>.'},
   {t:'\\\\text{넓이}=R^{2}\\\\left(A+B+C-\\\\pi\\\\right)', s:'넘은 만큼이 곧 <b>넓이</b>입니다.'}
  ],
  next:[
   {lv:'바로',   t:'합 재기', d:'크기를 바꾸며 내각의 합을 재세요.'},
   {lv:'심화',   t:'넓이와 잇기', d:'구면 초과와 넓이의 관계를 확인하세요.'},
   {lv:'프로젝트', t:'항로 계산', d:'두 도시의 대원 거리를 구해 보세요.'}
  ],
  eq:'넓이 = R²(A + B + C − π)',
  what:'평면에서 당연하던 것이 <b>당연하지 않은</b> 세계를 봅니다.',
  probe:'삼각형을 크게 그릴수록 내각의 합이 커집니다.',
  link:'지도 투영법(LAB 238)이 왜 왜곡을 피할 수 없는지 알려 줍니다.'},

{tex:[
   {t:'\\\\text{푸앵카레 원판}:\\\\ \\\\text{경계에 수직인 원호}=\\\\text{직선}', s:'모델을 바꾸면 <b>직선의 뜻</b>도 바뀝니다.'},
   {t:'\\\\text{유클리드}:\\\\ \\\\text{평행선은 정확히 1 개}', s:'2000 년 동안 <b>증명하려던</b> 공준입니다.'},
   {t:'\\\\text{쌍곡기하}:\\\\ \\\\text{평행선이 무수히 많다}', s:'바꾸어도 <b>모순이 없습니다</b>.'}
  ],
  next:[
   {lv:'바로',   t:'직선 그리기', d:'만나지 않는 직선을 여러 개 그려 보세요.'},
   {lv:'심화',   t:'거리의 뜻', d:'가장자리가 왜 무한히 먼지 조사하세요.'},
   {lv:'프로젝트', t:'모델 비교', d:'구면·평면·쌍곡의 세 세계를 견주어 정리하세요.'}
  ],
  eq:'평행선 공준을 바꾸면 다른 기하가 된다',
  what:'수학의 전제가 <b>참인 사실이 아니라 약속</b>임을 확인합니다.',
  probe:'한 점을 지나 만나지 않는 직선을 얼마든지 그릴 수 있습니다.',
  link:'구면 기하(LAB 290)와 함께 「세 가지 기하」를 완성합니다.'}
];`);
}

/* THUMBS */
{
  const key = s.match(/   '법선벡터가 꽂힌 기울어진 평면 격자'\)\r?\n\];/);
  if (!key) throw new Error('THUMBS 끝 앵커 실패');
  s = s.replace(key[0], `   '법선벡터가 꽂힌 기울어진 평면 격자'),

 svg(\`<line x1="60" y1="30" x2="16" y2="76" stroke="\${TC.blue}" stroke-width="2.6"/>
   <line x1="60" y1="30" x2="104" y2="76" stroke="\${TC.teal}" stroke-width="2.6"/>
   <line x1="60" y1="30" x2="34" y2="10" stroke="\${TC.blue}" stroke-width="1.6"/>
   <line x1="60" y1="30" x2="86" y2="10" stroke="\${TC.teal}" stroke-width="1.6"/>
   <path d="M42 48 A24 24 0 0 0 78 48" fill="none" stroke="\${TC.rose}" stroke-width="1.4"/>
   <text x="60" y="66" font-size="9" font-weight="800" fill="\${TC.rose}" text-anchor="middle">θ</text>\`,
   '두 지붕면과 각각의 법선이 이루는 각'),

 svg(\`<path d="M24 76 Q60 6 96 76" fill="none" stroke="\${TC.blue}" stroke-width="2"/>
   <line x1="18" y1="44" x2="102" y2="44" stroke="\${TC.rose}" stroke-width="1.4" stroke-dasharray="4 3"/>
   <ellipse cx="60" cy="44" rx="26" ry="8" fill="none" stroke="\${TC.teal}" stroke-width="2"/>
   <text x="60" y="94" font-size="8" font-weight="800" fill="\${TC.ink3}" text-anchor="middle">단면 = 원</text>\`,
   '포물면을 자른 높이와 그 단면 원'),

 svg(\`<line x1="60" y1="10" x2="60" y2="86" stroke="\${TC.rose}" stroke-width="1.8"/>
   <path d="M60 78 L100 30" stroke="\${TC.blue}" stroke-width="2.2"/>
   <path d="M60 78 L20 30" stroke="\${TC.teal}" stroke-width="1.6" opacity=".6"/>
   <ellipse cx="60" cy="30" rx="40" ry="12" fill="none" stroke="\${TC.teal}" stroke-width="1.6"/>
   <text x="60" y="96" font-size="8" font-weight="800" fill="\${TC.ink3}" text-anchor="middle">돌리면 원뿔</text>\`,
   '직선을 축 둘레로 돌려 만든 원뿔'),

 svg(\`<circle cx="60" cy="48" r="34" fill="none" stroke="\${TC.ink3}" stroke-width="1.4"/>
   <path d="M60 14 Q40 40 34 66" fill="none" stroke="\${TC.blue}" stroke-width="2"/>
   <path d="M60 14 Q80 40 86 66" fill="none" stroke="\${TC.blue}" stroke-width="2"/>
   <path d="M34 66 Q60 78 86 66" fill="none" stroke="\${TC.blue}" stroke-width="2"/>
   <path d="M34 66 Q60 78 86 66 Q80 40 60 14 Q40 40 34 66" fill="\${TC.blue}" opacity=".14"/>
   <text x="60" y="96" font-size="8" font-weight="800" fill="\${TC.rose}" text-anchor="middle">합 &gt; 180°</text>\`,
   '구 위에 그린 부풀어 오른 삼각형'),

 svg(\`<circle cx="60" cy="48" r="38" fill="none" stroke="\${TC.ink3}" stroke-width="2"/>
   <path d="M26 66 A44 44 0 0 0 94 66" fill="none" stroke="\${TC.teal}" stroke-width="2.2"/>
   <path d="M30 26 A40 40 0 0 1 86 78" fill="none" stroke="\${TC.blue}" stroke-width="1.8"/>
   <path d="M24 40 A46 46 0 0 1 78 82" fill="none" stroke="\${TC.blue}" stroke-width="1.6" opacity=".7"/>
   <circle cx="56" cy="36" r="4" fill="\${TC.rose}"/>
   <text x="60" y="96" font-size="8" font-weight="800" fill="\${TC.ink3}" text-anchor="middle">평행선이 여럿</text>\`,
   '푸앵카레 원판 안의 여러 평행선')
];`);
}

new Function(s);
fs.writeFileSync(P, s);

{
  const C = 'src/55-catalog.js';
  let c = fs.readFileSync(C, 'utf8');
  const m = c.match(/(\{k:'xgeo',g:'고급 기하 · 평면의 방정식'[^}]*\})(\r?\n\];)/);
  if (!m) throw new Error('LABCAT 끝 앵커 실패');
  c = c.replace(m[0], m[1] + `,
{k:'xgeo',g:'고급 기하 · 두 평면의 각',b:'법선 사이의 각을 그대로 써 둔각일 때 예각으로 안 고침'},
{k:'xgeo',g:'고급 기하 · 이차곡면의 단면',b:'자르는 높이를 바꿔도 단면 곡선을 다시 계산하지 않음'},
{k:'xgeo',g:'고급 기하 · 회전면',b:'회전축을 y축에 고정해 축을 바꿔도 같은 면이 나옴'},
{k:'xgeo',g:'고급 기하 · 구면 삼각형',b:'평면 공식으로 계산해 아무리 크게 그려도 180°로 나옴'},
{k:'xgeo',g:'고급 기하 · 쌍곡기하',b:'모델을 바꿔도 직선을 화면의 직선으로 그려 쌍곡기하가 유클리드처럼 보임'}` + m[2]);
  fs.writeFileSync(C, c);
}
console.log('LAB 287~291 (고급 기하 C · 5종) 설치 완료');
