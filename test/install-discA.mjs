// 이산 수학 A — LAB 292~296 (진리표·드모르간·포함배제·비둘기집·하노이) 전 계층 설치
import fs from 'node:fs';
const P = 'src/40-demos.js';
let s = fs.readFileSync(P, 'utf8');
const NAMES = ['truthTableDemo', 'demorganDemo', 'inclusionDemo', 'pigeonholeDemo', 'hanoiDemo'];
if (s.includes('function truthTableDemo')) throw new Error('이미 설치됨');
for (const n of NAMES) if (s.includes('function ' + n + '(')) throw new Error('이름 충돌: ' + n);

{ const i = s.indexOf('const LABS=[');
  s = s.slice(0, i) + '\n' + fs.readFileSync('algAK-demos.txt', 'utf8') + '\n' + s.slice(i); }

{ const key = ' build:hyperbolicDemo}\n];';
  const i = s.indexOf(key);
  if (i < 0) throw new Error('LABS 끝 앵커 실패');
  s = s.slice(0, i) + ` build:hyperbolicDemo},
{n:292,core:0,t:'“스위치 두 개로 전등을” 진리표와 논리 회로',q:'회로를 완전히 아는 방법이 있을까?',
 m:['명제','논리 연산','진리표'],a:['논리 게이트','조건 설계'],
 note:'스위치 두 개의 경우는 네 가지뿐입니다. 네 줄을 다 적으면 회로를 완전히 안 것입니다.',
 build:truthTableDemo},
{n:293,core:0,t:'“둘 다는 아니다 vs 둘 다 아니다” 드모르간 법칙',q:'부정을 괄호 안에 넣으면?',
 m:['집합의 연산','드모르간','여집합'],a:['조건 최적화','검색 질의'],
 note:'부정을 넣을 때 ∩ 과 ∪ 를 맞바꿔야 합니다. 그대로 두면 다른 영역이 됩니다.',
 build:demorganDemo},
{n:294,core:0,t:'“겹친 사람을 몇 번 셀까” 포함배제의 원리',q:'중복 가입자를 어떻게 뺄까?',
 m:['집합의 크기','포함배제','경우의 수'],a:['중복 집계 제거','자료 정합'],
 note:'두 번 겹친 것은 빼고 세 번 겹친 것은 다시 더해야 합니다. 빼기만 하면 모자랍니다.',
 build:inclusionDemo},
{n:295,core:0,t:'“반드시 겹친다” 비둘기집 원리',q:'세는 것만으로 증명할 수 있을까?',
 m:['비둘기집 원리','올림','존재 증명'],a:['해시 충돌','자원 배정'],
 note:'상자보다 물건이 많으면 어떻게 넣어도 겹칩니다. 보장되는 최솟값은 n 을 k 로 나눈 올림값입니다.',
 build:pigeonholeDemo},
{n:296,core:0,t:'“원반 하나에 두 배씩” 하노이 탑',q:'원반 20개면 몇 번 옮겨야 할까?',
 m:['점화식','재귀','지수적 증가'],a:['재귀 알고리즘','복잡도'],
 note:'T(n) = 2T(n−1) + 1 을 풀면 2ⁿ − 1 입니다. 재귀가 지수적 증가로 이어지는 대표적인 예입니다.',
 build:hanoiDemo}
];` + s.slice(i + key.length);
}

{
  const m = s.match(/const PROBLEMS=(\{.*?\});/);
  if (!m) throw new Error('PROBLEMS 앵커 실패');
  const PR = JSON.parse(m[1]);
  PR['292'] = { sit: '계단 위아래에 스위치가 하나씩 있습니다. 어느 쪽을 눌러도 전등이 켜지고 꺼집니다.',
    ask: '이 전등은 무슨 규칙으로 움직일까? 규칙을 빠짐없이 적을 수 있을까?' };
  PR['293'] = { sit: '검색창에 「둘 다는 아님」과 「둘 다 아님」을 각각 넣었더니 결과가 달랐습니다.',
    ask: '두 말은 어떻게 다를까? 부정을 괄호 안에 넣을 때 무엇을 바꿔야 할까?' };
  PR['294'] = { sit: '세 동아리의 인원을 그냥 더했더니 전교생보다 많아졌습니다. 중복 가입자가 있었습니다.',
    ask: '겹친 사람을 어떻게 정확히 뺄까? 세 곳 모두 가입한 사람은 어떻게 될까?' };
  PR['295'] = { sit: '「367 명이 모이면 생일이 같은 사람이 반드시 있다」고 합니다. 확률이 아니라 반드시라고 합니다.',
    ask: '정말 반드시일까? 어떻게 증명할까?' };
  PR['296'] = { sit: '원반 20 개짜리 하노이 탑을 1 초에 한 번씩 옮기면 얼마나 걸리는지 묻습니다.',
    ask: '몇 번을 옮겨야 할까? 원반이 하나 늘면 얼마나 늘어날까?' };
  s = s.replace(m[0], 'const PROBLEMS=' + JSON.stringify(PR) + ';');

  const i0 = s.indexOf('const MISSIONS=');
  const mm = s.slice(i0).match(/^const MISSIONS=\{[\s\S]*?\n\};/);
  if (!mm) throw new Error('MISSIONS 앵커 실패');
  const M = new Function('return ' + mm[0].slice('const MISSIONS='.length, -1))();

  M['292'] = [
   {t:'1분 자유 탐색 — 회로와 스위치를 바꿔 보세요. 표의 어느 줄이 파랗게 되나요?'},
   {t:'오늘의 문제 — 스위치 A 와 B 를 모두 켜고 회로를 XOR 로 바꾸세요.',
    re:'둘 다 켰더니 오히려 꺼졌습니다',
    do:'① A 켜기 ② B 켜기 ③ 회로를 XOR 로',
    hand:'XOR 의 네 줄을 손으로 적어 보기'},
   {t:'뒤집힌 회로 — 회로를 NAND 로 바꾸세요. 언제 꺼지나요?',
    re:'AND 를 통째로 뒤집은 것입니다',
    do:'① 회로를 NAND 로 ② 출력 확인 ③ AND 의 표와 견주기',
    hand:'AND 의 출력을 모두 뒤집어 NAND 와 맞춰 보기'},
   {t:'(회로, A, B, 출력) 을 여섯 줄 기록하세요.'},
   {t:'심화 — NAND 하나로: AND·OR·NOT 을 모두 NAND 만으로 만들 수 있음을 진리표로 보이고, 그것이 왜 회로 설계에서 중요한지 조사하세요.'}];

  M['293'] = [
   {t:'1분 자유 탐색 — 두 식을 바꿔 보세요. 칠해지는 구역이 어떻게 달라지나요?'},
   {t:'오늘의 문제 — 「두 영역을 겹쳐 보기」를 켜세요. 두 그림이 같은가요?',
    re:'한 치도 어긋나지 않습니다',
    do:'① 체크 켜기 ② 어긋난 구역 수 확인 ③ 두 그림 견주기',
    hand:'네 구역마다 참·거짓을 적어 표로 확인'},
   {t:'기호를 안 바꾸면 — 오른쪽 식을 ¬A ∪ ¬B 로 바꾸세요.',
    re:'부정은 그냥 나누어지지 않습니다',
    do:'① 오른쪽 식 바꾸기 ② 붉게 표시된 구역 보기 ③ 어긋난 구역 수 읽기',
    hand:'어긋난 구역이 어느 것인지 이름으로 적기'},
   {t:'(왼쪽 식, 오른쪽 식, 어긋난 구역) 을 여섯 줄 기록하세요.'},
   {t:'심화 — 일반화: 집합이 셋일 때의 드모르간 법칙을 적고, 명제 논리에서 ¬(p ∧ q) = ¬p ∨ ¬q 가 같은 법칙임을 진리표로 확인하세요.'}];

  M['294'] = [
   {t:'1분 자유 탐색 — 겹친 인원을 움직여 보세요. 세 막대가 어떻게 달라지나요?'},
   {t:'오늘의 문제 — 세 쌍의 겹친 인원을 각각 15, 10, 8 명으로 올리세요.',
    re:'겹친 사람을 여러 번 센 것입니다',
    do:'① 가·나 를 15 로 ② 나·다 를 10 으로 ③ 다·가 를 8 로',
    hand:'그냥 합과 정확한 값의 차이를 손으로 계산'},
   {t:'세 겹친 사람 — 세 동아리 모두 든 인원을 5 명으로 올리고 「다시 더하지 않기」를 켜세요.',
    re:'한 번도 세지 않은 셈이 되어',
    do:'① 셋 모두를 5 로 ② 체크 켜기 ③ 두 값의 차이 읽기',
    hand:'세 번 더해지고 세 번 빠지면 몇 번 센 셈인지 적기'},
   {t:'(겹친 인원, 그냥 합, 정확한 값) 을 여섯 줄 기록하세요.'},
   {t:'심화 — 왜 부호가 번갈아 나오나: 원소 하나가 k 개의 집합에 들어 있을 때 각 항에서 몇 번 세어지는지 조합으로 따져, 정확히 한 번 세어짐을 보이세요.'}];

  M['295'] = [
   {t:'1분 자유 탐색 — 넣는 방식을 바꿔 보세요. 가장 많은 칸이 줄어드나요?'},
   {t:'오늘의 문제 — 물건을 8 개로 늘리세요 (상자는 5 칸). 무슨 일이 반드시 생기나요?',
    re:'겹치는 칸이 반드시 있습니다',
    do:'① 물건을 8 로 ② 넣는 방식을 여러 번 바꿔 보기 ③ 가장 많은 칸 확인',
    hand:'⌈8 / 5⌉ 을 계산해 보장값과 맞춰 보기'},
   {t:'더 세게 — 물건을 13 개로 늘리세요. 무엇까지 보장되나요?',
    re:'까지 보장됩니다',
    do:'① 물건을 13 으로 ② 보장값 읽기 ③ 방식을 바꿔도 그런지 확인',
    hand:'⌈13 / 5⌉ 을 계산해 확인'},
   {t:'(물건 수, 상자 수, 가장 많은 칸, 보장값) 을 여섯 줄 기록하세요.'},
   {t:'심화 — 증명으로: 모든 칸이 ⌈n/k⌉ − 1 개 이하라고 가정하면 전체가 n 보다 작아져 모순임을 보이고, 367 명의 생일 문제에 적용하세요.'}];

  M['296'] = [
   {t:'1분 자유 탐색 — 옮긴 정도를 늘려 보세요. 원반이 어떻게 움직이나요?'},
   {t:'오늘의 문제 — 옮긴 정도를 100 % 로 하세요. 몇 번 만에 끝났나요?',
    re:'번 만에 다 옮겼습니다',
    do:'① 옮긴 정도를 100 으로 ② 횟수 확인 ③ 2ⁿ − 1 과 견주기',
    hand:'n = 3 일 때 2³ − 1 을 계산'},
   {t:'크게 키우면 — 원반을 16 개로 늘리세요. 횟수가 얼마나 되나요?',
    re:'20 개면 백만 번이 넘습니다',
    do:'① 원반을 16 으로 ② 횟수 읽기 ③ 1 초에 한 번이면 며칠인지 보기',
    hand:'2¹⁶ − 1 을 계산해 확인'},
   {t:'(원반 수, 횟수, 걸리는 날) 을 여섯 줄 기록하세요.'},
   {t:'심화 — 점화식 풀기: T(n) = 2T(n−1) + 1 의 양변에 1 을 더해 T(n) + 1 = 2(T(n−1) + 1) 을 만들고, 등비수열로 2ⁿ − 1 을 유도하세요.'}];

  s = s.slice(0, i0) + 'const MISSIONS=' + JSON.stringify(M, null, 1) + ';' + s.slice(i0 + mm[0].length);

  const PR2 = JSON.parse(s.match(/const PROBLEMS=(\{.*?\});/)[1]);
  const labsBlock = s.slice(s.indexOf('const LABS=['), s.indexOf('const THUMBS ='));
  const demoSrc = fs.readFileSync('algAK-demos.txt', 'utf8');
  let bad = 0;
  ['292', '293', '294', '295', '296'].forEach((k, ki) => {
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
  const key = s.match(/  link:'구면 기하\(LAB 290\)와 함께 「세 가지 기하」를 완성합니다\.'\}\r?\n\];/);
  if (!key) throw new Error('PRINS 끝 앵커 실패');
  s = s.replace(key[0], `  link:'구면 기하(LAB 290)와 함께 「세 가지 기하」를 완성합니다.'},

{tex:[
   {t:'p\\\\land q,\\\\quad p\\\\lor q,\\\\quad \\\\neg p', s:'논리의 <b>기본 연산</b> 셋입니다.'},
   {t:'p\\\\oplus q=(p\\\\lor q)\\\\land\\\\neg(p\\\\land q)', s:'XOR 은 「<b>하나만</b>」이라는 뜻입니다.'},
   {t:'2^{2}=4\\\\ \\\\text{가지 경우}', s:'변수가 둘이면 줄이 <b>네 개</b>뿐입니다.'}
  ],
  next:[
   {lv:'바로',   t:'표 채우기', d:'네 회로의 진리표를 모두 적으세요.'},
   {lv:'심화',   t:'XOR 만들기', d:'AND·OR·NOT 으로 XOR 을 구성하세요.'},
   {lv:'프로젝트', t:'계단 전등', d:'양쪽 스위치로 켜고 끄는 회로를 설계하세요.'}
  ],
  eq:'변수 n 개면 진리표는 2ⁿ 줄',
  what:'경우가 유한하면 <b>모두 적는 것</b>이 곧 증명입니다.',
  probe:'XOR 에서는 둘 다 켜면 오히려 꺼집니다.',
  link:'조건문 설계와 회로 설계가 같은 수학임을 보여 줍니다.'},

{tex:[
   {t:'\\\\neg(A\\\\cup B)=\\\\neg A\\\\cap\\\\neg B', s:'∪ 가 <b>∩ 으로</b> 바뀝니다.'},
   {t:'\\\\neg(A\\\\cap B)=\\\\neg A\\\\cup\\\\neg B', s:'∩ 은 <b>∪ 로</b> 바뀝니다.'},
   {t:'\\\\neg(p\\\\land q)=\\\\neg p\\\\lor\\\\neg q', s:'명제 논리에서도 <b>같은 법칙</b>입니다.'}
  ],
  next:[
   {lv:'바로',   t:'짝 찾기', d:'네 식 가운데 같은 짝을 모두 찾으세요.'},
   {lv:'심화',   t:'표로 확인', d:'진리표로 두 식이 같음을 보이세요.'},
   {lv:'프로젝트', t:'검색 질의', d:'복잡한 조건을 드모르간으로 단순화하세요.'}
  ],
  eq:'¬(A ∪ B) = ¬A ∩ ¬B',
  what:'「부정을 어떻게 나누는가」라는 <b>규칙</b>을 그림으로 확인합니다.',
  probe:'기호를 바꾸지 않으면 두 그림이 어긋납니다.',
  link:'집합의 연산(LAB 20)과 논리를 한 줄로 잇습니다.'},

{tex:[
   {t:'\\\\left|A\\\\cup B\\\\right|=\\\\left|A\\\\right|+\\\\left|B\\\\right|-\\\\left|A\\\\cap B\\\\right|', s:'겹친 것을 <b>한 번 빼는</b> 것입니다.'},
   {t:'\\\\left|A\\\\cup B\\\\cup C\\\\right|=\\\\sum\\\\left|A\\\\right|-\\\\sum\\\\left|A\\\\cap B\\\\right|+\\\\left|A\\\\cap B\\\\cap C\\\\right|', s:'셋이면 <b>다시 더해야</b> 합니다.'},
   {t:'\\\\text{k 개에 든 원소}:\\\\ k-\\\\binom{k}{2}+\\\\binom{k}{3}-\\\\cdots=1', s:'어떤 원소든 결국 <b>한 번</b>만 세어집니다.'}
  ],
  next:[
   {lv:'바로',   t:'차이 재기', d:'그냥 합과 정확한 값의 차이를 구하세요.'},
   {lv:'심화',   t:'부호의 이유', d:'왜 부호가 번갈아 나오는지 설명하세요.'},
   {lv:'프로젝트', t:'설문 정리', d:'실제 중복 응답 자료를 정확히 세어 보세요.'}
  ],
  eq:'|A∪B∪C| = ΣA − Σ(A∩B) + (A∩B∩C)',
  what:'「빠짐없이, 겹치지 않게」 세는 <b>규칙</b>을 익힙니다.',
  probe:'세 겹친 사람을 다시 더하지 않으면 그만큼 모자랍니다.',
  link:'경우의 수(LAB 08)의 기본 도구입니다.'},

{tex:[
   {t:'n>k \\\\Rightarrow \\\\text{어떤 상자에는 둘 이상}', s:'가정만으로 <b>반드시</b> 따라 나옵니다.'},
   {t:'\\\\max_i c_i \\\\ge \\\\left\\\\lceil \\\\frac{n}{k}\\\\right\\\\rceil', s:'보장되는 <b>최솟값</b>입니다.'},
   {t:'\\\\text{모두 } \\\\left\\\\lceil n/k\\\\right\\\\rceil-1\\\\ \\\\text{이하라면 합}<n', s:'가정하면 <b>모순</b>이 생깁니다.'}
  ],
  next:[
   {lv:'바로',   t:'보장값 계산', d:'여러 n, k 에 대해 보장값을 구하세요.'},
   {lv:'심화',   t:'모순으로', d:'귀류법으로 원리를 증명하세요.'},
   {lv:'프로젝트', t:'해시 충돌', d:'저장 칸보다 자료가 많을 때를 조사하세요.'}
  ],
  eq:'가장 많은 칸 ≥ ⌈n / k⌉',
  what:'세는 것만으로 <b>존재를 증명</b>하는 방법입니다.',
  probe:'넣는 방식을 아무리 바꿔도 보장값 아래로 내려가지 않습니다.',
  link:'존재 증명의 가장 단순한 도구이며, 확률과 대비해 보면 좋습니다.'},

{tex:[
   {t:'T(n)=2T(n-1)+1,\\\\quad T(1)=1', s:'작은 문제 <b>둘</b>과 한 번의 이동입니다.'},
   {t:'T(n)+1=2\\\\left(T(n-1)+1\\\\right)', s:'양변에 1 을 더하면 <b>등비수열</b>이 됩니다.'},
   {t:'T(n)=2^{n}-1', s:'원반 하나에 <b>두 배씩</b> 늘어납니다.'}
  ],
  next:[
   {lv:'바로',   t:'횟수 세기', d:'n = 3, 4, 5 의 횟수를 직접 세어 보세요.'},
   {lv:'심화',   t:'점화식 풀기', d:'치환으로 일반항을 유도하세요.'},
   {lv:'프로젝트', t:'재귀 코드', d:'하노이 탑을 재귀 함수로 구현하세요.'}
  ],
  eq:'T(n) = 2ⁿ − 1',
  what:'재귀가 <b>지수적 증가</b>로 이어지는 대표적인 예입니다.',
  probe:'원반을 하나 늘릴 때마다 횟수가 두 배를 넘습니다.',
  link:'점화식(LAB 125)의 응용이며, 복잡도 감각의 출발점입니다.'}
];`);
}

/* THUMBS */
{
  const key = s.match(/   '푸앵카레 원판 안의 여러 평행선'\)\r?\n\];/);
  if (!key) throw new Error('THUMBS 끝 앵커 실패');
  s = s.replace(key[0], `   '푸앵카레 원판 안의 여러 평행선'),

 svg(\`<g stroke="\${TC.ink3}" stroke-width="1" opacity=".5" fill="none">
   <rect x="26" y="18" width="68" height="60"/>
   <line x1="26" y1="33" x2="94" y2="33"/><line x1="26" y1="48" x2="94" y2="48"/>
   <line x1="26" y1="63" x2="94" y2="63"/>
   <line x1="49" y1="18" x2="49" y2="78"/><line x1="72" y1="18" x2="72" y2="78"/></g>
   <g font-size="10" font-weight="700" text-anchor="middle" fill="\${TC.ink3}">
   <text x="37" y="30">A</text><text x="60" y="30">B</text><text x="83" y="30">out</text>
   <text x="37" y="45">0</text><text x="60" y="45">0</text><text x="83" y="45">0</text>
   <text x="37" y="60">0</text><text x="60" y="60">1</text><text x="83" y="60">0</text></g>
   <text x="83" y="75" font-size="10" font-weight="800" fill="\${TC.rose}" text-anchor="middle">1</text>\`,
   '네 줄로 채워진 진리표'),

 svg(\`<circle cx="46" cy="46" r="26" fill="\${TC.blue}" opacity=".22" stroke="\${TC.ink3}" stroke-width="1.2"/>
   <circle cx="74" cy="46" r="26" fill="\${TC.teal}" opacity=".22" stroke="\${TC.ink3}" stroke-width="1.2"/>
   <rect x="12" y="14" width="96" height="64" fill="\${TC.rose}" opacity=".18"/>
   <text x="60" y="94" font-size="8" font-weight="800" fill="\${TC.ink3}" text-anchor="middle">¬(A ∪ B)</text>\`,
   '두 원 바깥이 칠해진 벤다이어그램'),

 svg(\`<circle cx="46" cy="40" r="24" fill="\${TC.blue}" opacity=".25"/>
   <circle cx="74" cy="40" r="24" fill="\${TC.teal}" opacity=".25"/>
   <circle cx="60" cy="62" r="24" fill="\${TC.amber || TC.rose}" opacity=".25"/>
   <text x="60" y="48" font-size="10" font-weight="800" fill="\${TC.rose}" text-anchor="middle">+</text>
   <text x="60" y="96" font-size="8" font-weight="800" fill="\${TC.ink3}" text-anchor="middle">− + −</text>\`,
   '세 원이 겹친 포함배제 그림'),

 svg(\`<g stroke="\${TC.ink3}" stroke-width="1.2" fill="none">
   <rect x="18" y="46" width="24" height="30"/><rect x="48" y="46" width="24" height="30"/>
   <rect x="78" y="46" width="24" height="30"/></g>
   <g fill="\${TC.blue}" opacity=".7">
   <circle cx="30" cy="66" r="5"/><circle cx="60" cy="66" r="5"/><circle cx="90" cy="66" r="5"/></g>
   <circle cx="30" cy="54" r="5" fill="\${TC.rose}" opacity=".8"/>
   <text x="60" y="94" font-size="8" font-weight="800" fill="\${TC.ink3}" text-anchor="middle">반드시 겹친다</text>\`,
   '세 상자에 네 개를 넣어 한 칸이 겹친 그림'),

 svg(\`<g stroke="\${TC.ink3}" stroke-width="2.4">
   <line x1="28" y1="42" x2="28" y2="76"/><line x1="60" y1="42" x2="60" y2="76"/>
   <line x1="92" y1="42" x2="92" y2="76"/></g>
   <rect x="12" y="76" width="96" height="5" fill="\${TC.ink3}" opacity=".4"/>
   <rect x="14" y="68" width="28" height="7" fill="\${TC.blue}" opacity=".7"/>
   <rect x="18" y="60" width="20" height="7" fill="\${TC.blue}" opacity=".55"/>
   <rect x="22" y="52" width="12" height="7" fill="\${TC.blue}" opacity=".4"/>
   <text x="60" y="96" font-size="8" font-weight="800" fill="\${TC.rose}" text-anchor="middle">2ⁿ − 1</text>\`,
   '세 기둥과 쌓인 원반들')
];`);
}

new Function(s);
fs.writeFileSync(P, s);

{
  const C = 'src/55-catalog.js';
  let c = fs.readFileSync(C, 'utf8');
  const m = c.match(/(\{k:'xgeo',g:'고급 기하 · 쌍곡기하'[^}]*\})(\r?\n\];)/);
  if (!m) throw new Error('LABCAT 끝 앵커 실패');
  c = c.replace(m[0], m[1] + `,
{k:'disc',g:'이산 수학 · 진리표',b:'XOR 을 OR 로 계산해 둘 다 켰을 때도 불이 켜짐'},
{k:'disc',g:'이산 수학 · 드모르간 법칙',b:'부정을 분배할 때 ∧ 와 ∨ 를 바꾸지 않아 두 그림이 같게 칠해짐'},
{k:'disc',g:'이산 수학 · 포함배제',b:'세 집합의 교집합을 다시 더하지 않아 총원이 모자람'},
{k:'disc',g:'이산 수학 · 비둘기집 원리',b:'상자보다 물건이 많은지 비교하지 않고 확률로 판정해 「아마도」로 끝남'},
{k:'disc',g:'이산 수학 · 하노이 탑',b:'2ⁿ 으로 계산하고 −1 을 빼지 않아 횟수가 늘 하나씩 많음'}` + m[2]);
  fs.writeFileSync(C, c);
}
console.log('LAB 292~296 (이산 수학 A · 5종) 설치 완료');
