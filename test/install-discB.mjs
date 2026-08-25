// 이산 수학 B — LAB 297~301 (한붓그리기·악수 정리·최소 신장 트리·탐색 순서·다익스트라) 전 계층 설치
import fs from 'node:fs';
const P = 'src/40-demos.js';
let s = fs.readFileSync(P, 'utf8');
const NAMES = ['eulerPathDemo', 'handshakeDemo', 'mstDemo', 'bfsDfsDemo', 'dijkstraDemo'];
if (s.includes('function eulerPathDemo')) throw new Error('이미 설치됨');
for (const n of NAMES) if (s.includes('function ' + n + '(')) throw new Error('이름 충돌: ' + n);

{ const i = s.indexOf('const LABS=[');
  s = s.slice(0, i) + '\n' + fs.readFileSync('algAL-demos.txt', 'utf8') + '\n' + s.slice(i); }

{ const key = ' build:hanoiDemo}\n];';
  const i = s.indexOf(key);
  if (i < 0) throw new Error('LABS 끝 앵커 실패');
  s = s.slice(0, i) + ` build:hanoiDemo},
{n:297,core:0,t:'“한 번에 그릴 수 있을까” 한붓그리기',q:'그려 보지 않고 판정할 수 있을까?',
 m:['그래프','차수','오일러 경로'],a:['경로 설계','배송 순회'],
 note:'홀수 차수 꼭짓점이 0 개면 어디서든, 2 개면 그 둘에서만 시작할 수 있습니다. 그 밖에는 불가능합니다.',
 build:eulerPathDemo},
{n:298,core:0,t:'“같은 것을 두 방법으로 세기” 악수 정리',q:'차수의 합은 왜 짝수일까?',
 m:['그래프','차수','이중 계산'],a:['그래프 통계','자료 검증'],
 note:'간선 하나가 두 점의 차수를 1 씩 올립니다. 그래서 차수의 합은 간선 수의 두 배입니다.',
 build:handshakeDemo},
{n:299,core:0,t:'“모든 마을을 가장 싸게” 최소 신장 트리',q:'사이클 검사를 빼면 어떻게 될까?',
 m:['그래프','탐욕 알고리즘','트리'],a:['네트워크 설계','도로 계획'],
 note:'싼 길부터 고르되 이미 이어진 곳은 건너뜁니다. 꼭짓점 n 개를 잇는 길은 정확히 n − 1 개입니다.',
 build:mstDemo},
{n:300,core:0,t:'“큐냐 스택이냐” 너비 우선과 깊이 우선',q:'먼저 찾으면 가장 짧은 길일까?',
 m:['그래프 탐색','큐와 스택','최단 경로'],a:['미로 찾기','경로 탐색'],
 note:'큐를 쓰면 가까운 곳부터 보아 최단 경로가 나오고, 스택을 쓰면 한 방향으로 끝까지 갑니다.',
 build:bfsDfsDemo},
{n:301,core:0,t:'“하나씩 확정해 나가기” 다익스트라',q:'내비게이션은 최단 경로를 어떻게 찾을까?',
 m:['최단 경로','탐욕 알고리즘','확정'],a:['내비게이션','네트워크 라우팅'],
 note:'가장 가까운 곳부터 하나씩 확정합니다. 간선의 길이가 모두 양수라면 확정을 되돌릴 일이 없습니다.',
 build:dijkstraDemo}
];` + s.slice(i + key.length);
}

{
  const m = s.match(/const PROBLEMS=(\{.*?\});/);
  if (!m) throw new Error('PROBLEMS 앵커 실패');
  const PR = JSON.parse(m[1]);
  PR['297'] = { sit: '쾨니히스베르크에는 다리가 일곱 개 있었습니다. 사람들은 모든 다리를 한 번씩만 건너 산책하고 싶어 했습니다.',
    ask: '가능할까? 일일이 해 보지 않고 판정할 방법이 있을까?' };
  PR['298'] = { sit: '모임에서 사람들이 악수를 했습니다. 각자 몇 번 악수했는지 적어 모두 더했더니 짝수가 나왔습니다.',
    ask: '언제나 짝수일까? 그 합은 무엇과 같을까?' };
  PR['299'] = { sit: '여섯 마을을 모두 잇는 도로를 놓으려 합니다. 예산은 빠듯합니다.',
    ask: '어떤 길을 골라야 가장 쌀까? 싼 것부터 고르기만 하면 될까?' };
  PR['300'] = { sit: '미로에서 출구를 찾습니다. 갈림길에서 무엇을 먼저 볼지 정해야 합니다.',
    ask: '먼저 찾은 길이 가장 짧은 길일까? 순서가 결과를 바꿀까?' };
  PR['301'] = { sit: '내비게이션은 수많은 갈림길 가운데 최단 경로를 순식간에 찾아 줍니다.',
    ask: '모든 경로를 다 따져 보는 걸까? 아니면 다른 방법이 있을까?' };
  s = s.replace(m[0], 'const PROBLEMS=' + JSON.stringify(PR) + ';');

  const i0 = s.indexOf('const MISSIONS=');
  const mm = s.slice(i0).match(/^const MISSIONS=\{[\s\S]*?\n\};/);
  if (!mm) throw new Error('MISSIONS 앵커 실패');
  const M = new Function('return ' + mm[0].slice('const MISSIONS='.length, -1))();

  M['297'] = [
   {t:'1분 자유 탐색 — 도형을 바꿔 보세요. 붉은 점이 몇 개인가요?'},
   {t:'오늘의 문제 — 도형을 쾨니히스베르크 다리로 바꾸세요. 판정이 어떻게 되나요?',
    re:'어디서 시작해도 한 번에 그릴 수 없습니다',
    do:'① 도형을 다리로 ② 붉은 점 세기 ③ 판정 읽기',
    hand:'네 점의 차수를 모두 적어 홀수의 개수 세기'},
   {t:'둘이면 되는 경우 — 도형을 봉투 모양으로 바꾸세요. 어디서 시작해야 하나요?',
    re:'그 두 점 가운데 하나에서 출발해야만',
    do:'① 도형을 봉투로 ② 붉은 점 두 곳 찾기 ③ 그 점에서 그려 보기',
    hand:'봉투를 실제로 한붓그리기로 그려 보기'},
   {t:'(도형, 간선 수, 홀수 점, 판정) 을 여섯 줄 기록하세요.'},
   {t:'심화 — 왜 그런가: 중간에 지나는 점은 들어온 만큼 나가야 하므로 차수가 짝수여야 함을 설명하고, 시작점과 끝점만 홀수가 될 수 있는 까닭을 밝히세요.'}];

  M['298'] = [
   {t:'1분 자유 탐색 — 악수 횟수를 늘려 보세요. 점 안의 수가 어떻게 되나요?'},
   {t:'오늘의 문제 — 악수한 횟수를 8 번으로 올리세요. 차수의 합이 얼마인가요?',
    re:'한 번의 악수를 두 사람이 함께 세기 때문입니다',
    do:'① 악수를 8 번으로 ② 차수의 합 확인 ③ 간선 수와 견주기',
    hand:'8 × 2 를 계산해 화면 값과 맞춰 보기'},
   {t:'한 번만 세면 — 「간선을 한 번만 세기」를 켜세요. 값이 어떻게 되나요?',
    re:'차수의 합의 절반이 나옵니다',
    do:'① 체크 켜기 ② 값 비교 ③ 어느 쪽이 맞는지 생각하기',
    hand:'왜 절반이 되는지 한 줄로 적기'},
   {t:'(사람 수, 악수 횟수, 차수의 합) 을 여섯 줄 기록하세요.'},
   {t:'심화 — 홀수인 사람: 차수의 합이 짝수라는 사실에서 「홀수 번 악수한 사람은 반드시 짝수 명」임을 유도하세요.'}];

  M['299'] = [
   {t:'1분 자유 탐색 — 고른 길의 수를 늘려 보세요. 어떤 길부터 골라지나요?'},
   {t:'오늘의 문제 — 고른 길의 수를 5 로 올리세요. 여섯 마을이 다 이어졌나요?',
    re:'이보다 싸게는 못 잇습니다',
    do:'① 길의 수를 5 로 ② 덩어리 수 확인 ③ 비용 읽기',
    hand:'꼭짓점 6 개를 잇는 데 필요한 길의 수를 적기'},
   {t:'검사를 빼면 — 「사이클 검사를 하지 않기」를 켜세요. 무슨 일이 생기나요?',
    re:'사이클 검사를 빼니 이미 이어진 곳을 또 이어',
    do:'① 체크 켜기 ② 덩어리 수 확인 ③ 어느 길이 낭비인지 찾기',
    hand:'낭비된 길이 잇는 두 마을이 이미 이어져 있었는지 확인'},
   {t:'(고른 길, 검사 여부, 비용, 덩어리) 를 여섯 줄 기록하세요.'},
   {t:'심화 — 왜 탐욕법이 통하나: 가장 싼 간선이 최소 신장 트리에 반드시 들어감을 「그 간선을 빼면 더 비싸진다」는 논증으로 설명하세요.'}];

  M['300'] = [
   {t:'1분 자유 탐색 — 살펴본 칸 수를 늘려 보세요. 번호가 어떤 순서로 붙나요?'},
   {t:'오늘의 문제 — 살펴본 칸을 22 로 올리세요. 찾은 길이 최단인가요?',
    re:'큐로 찾으니 곧바로 최단 경로가 나왔습니다',
    do:'① 살펴본 칸을 22 로 ② 찾은 길이 확인 ③ 최단 길이와 견주기',
    hand:'출발에서 목표까지의 최소 칸 수를 손으로 세기'},
   {t:'스택으로 — 탐색 방법을 깊이 우선으로 바꾸세요. 찾은 길이 어떤가요?',
    re:'먼저 찾았다고 가장 짧은 것은 아닙니다',
    do:'① 방법을 깊이 우선으로 ② 찾은 길이 확인 ③ 번호 순서 비교',
    hand:'두 방법이 몇 번째에 목표를 찾았는지 적어 견주기'},
   {t:'(방법, 살펴본 칸, 찾은 길이) 를 여섯 줄 기록하세요.'},
   {t:'심화 — 왜 큐가 최단인가: 큐를 쓰면 출발점에서 k 칸 떨어진 칸을 모두 본 뒤에야 k+1 칸을 본다는 사실을 설명하고, 그것이 최단 경로를 보장하는 까닭을 밝히세요.'}];

  M['301'] = [
   {t:'1분 자유 탐색 — 확정한 곳의 수를 늘려 보세요. 어떤 순서로 확정되나요?'},
   {t:'오늘의 문제 — 확정한 곳을 6 으로 올리세요. 「바」까지의 거리가 정해졌나요?',
    re:'까지의 최단 거리가 정해졌습니다',
    do:'① 확정을 6 으로 ② 「바」의 값 확인 ③ 확정 순서 읽기',
    hand:'두 갈래 경로의 길이를 각각 더해 견주기'},
   {t:'길이 바뀌면 — 가·라 구간의 길이를 1 로 줄이세요. 경로가 어떻게 되나요?',
    re:'최단 경로가 아래쪽으로 갈아탔습니다',
    do:'① 구간을 1 로 ② 파란 굵은 선의 위치 보기 ③ 거리 값 비교',
    hand:'아래쪽 경로 1 + 2 + 3 을 계산해 위쪽과 견주기'},
   {t:'(확정 수, 구간 길이, 바까지 거리) 를 여섯 줄 기록하세요.'},
   {t:'심화 — 왜 되돌릴 일이 없나: 간선의 길이가 모두 양수일 때, 이미 확정한 곳보다 더 짧은 길이 나중에 나타날 수 없는 까닭을 설명하고, 음수 간선이 있으면 왜 무너지는지 밝히세요.'}];

  s = s.slice(0, i0) + 'const MISSIONS=' + JSON.stringify(M, null, 1) + ';' + s.slice(i0 + mm[0].length);

  const PR2 = JSON.parse(s.match(/const PROBLEMS=(\{.*?\});/)[1]);
  const labsBlock = s.slice(s.indexOf('const LABS=['), s.indexOf('const THUMBS ='));
  const demoSrc = fs.readFileSync('algAL-demos.txt', 'utf8');
  let bad = 0;
  ['297', '298', '299', '300', '301'].forEach((k, ki) => {
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
  const key = s.match(/  link:'점화식\(LAB 125\)의 응용이며, 복잡도 감각의 출발점입니다\.'\}\r?\n\];/);
  if (!key) throw new Error('PRINS 끝 앵커 실패');
  s = s.replace(key[0], `  link:'점화식(LAB 125)의 응용이며, 복잡도 감각의 출발점입니다.'},

{tex:[
   {t:'\\\\text{홀수 차수 꼭짓점의 수}=0 \\\\Rightarrow \\\\text{닫힌 한붓그리기}', s:'출발점으로 <b>돌아옵니다</b>.'},
   {t:'\\\\text{홀수 차수 꼭짓점의 수}=2 \\\\Rightarrow \\\\text{열린 한붓그리기}', s:'그 <b>두 점</b>에서만 출발할 수 있습니다.'},
   {t:'\\\\text{그 밖} \\\\Rightarrow \\\\text{불가능}', s:'그려 보지 않고 <b>판정</b>이 끝납니다.'}
  ],
  next:[
   {lv:'바로',   t:'차수 세기', d:'여러 도형의 홀수 점을 세어 판정하세요.'},
   {lv:'심화',   t:'까닭 설명', d:'중간 점의 차수가 짝수인 이유를 쓰세요.'},
   {lv:'프로젝트', t:'순회 설계', d:'배달 경로를 한붓그리기로 설계해 보세요.'}
  ],
  eq:'홀수 차수 점이 0 개 또는 2 개일 때만 가능',
  what:'그려 보지 않고 <b>세는 것만으로</b> 답을 아는 실험입니다.',
  probe:'간선 하나만 지워도 판정이 뒤집힙니다.',
  link:'그래프 이론의 출발점이며, 오일러가 만든 문제입니다.'},

{tex:[
   {t:'\\\\sum_{v} \\\\deg(v)=2\\\\left|E\\\\right|', s:'간선 하나를 <b>두 번</b> 셉니다.'},
   {t:'\\\\sum_{v}\\\\deg(v)\\\\ \\\\text{는 짝수}', s:'그래서 합은 <b>언제나 짝수</b>입니다.'},
   {t:'\\\\text{홀수 차수인 점의 수는 짝수}', s:'짝수에서 짝수를 빼면 <b>짝수</b>이기 때문입니다.'}
  ],
  next:[
   {lv:'바로',   t:'값 확인', d:'차수의 합과 간선 수를 견주세요.'},
   {lv:'심화',   t:'따름정리', d:'홀수인 사람이 짝수 명임을 유도하세요.'},
   {lv:'프로젝트', t:'자료 검증', d:'관계망 자료의 정합성을 이 식으로 검사하세요.'}
  ],
  eq:'Σ deg(v) = 2|E|',
  what:'같은 것을 <b>두 방법으로 세는</b> 증명 기법을 익힙니다.',
  probe:'간선을 한 번만 세면 값이 정확히 절반이 됩니다.',
  link:'한붓그리기(LAB 297)의 판정 근거가 되는 식입니다.'},

{tex:[
   {t:'\\\\text{크러스컬}:\\\\ \\\\text{싼 간선부터, 사이클이면 건너뛴다}', s:'<b>탐욕</b>인데도 최적입니다.'},
   {t:'\\\\left|E_{T}\\\\right|=n-1', s:'꼭짓점 n 개를 잇는 길은 <b>정확히 n−1 개</b>입니다.'},
   {t:'\\\\text{사이클의 가장 비싼 간선은 트리에 없다}', s:'그래서 <b>건너뛰어도</b> 됩니다.'}
  ],
  next:[
   {lv:'바로',   t:'직접 고르기', d:'싼 길부터 골라 트리를 만들어 보세요.'},
   {lv:'심화',   t:'최적성', d:'탐욕이 최적인 까닭을 설명하세요.'},
   {lv:'프로젝트', t:'망 설계', d:'실제 지도 위 마을을 잇는 계획을 세우세요.'}
  ],
  eq:'간선 수 = 꼭짓점 수 − 1',
  what:'「눈앞의 최선」이 <b>전체의 최선</b>이 되는 드문 경우입니다.',
  probe:'사이클 검사를 빼면 길을 더 놓고도 마을이 나뉜 채 남습니다.',
  link:'탐욕법이 통하는 경우와 통하지 않는 경우(LAB 302)를 함께 보세요.'},

{tex:[
   {t:'\\\\text{큐}:\\\\ \\\\text{먼저 넣은 것부터} \\\\Rightarrow \\\\text{너비 우선}', s:'가까운 곳을 <b>모두</b> 본 뒤 멀리 갑니다.'},
   {t:'\\\\text{스택}:\\\\ \\\\text{나중에 넣은 것부터} \\\\Rightarrow \\\\text{깊이 우선}', s:'한 방향으로 <b>끝까지</b> 갑니다.'},
   {t:'\\\\text{너비 우선} \\\\Rightarrow \\\\text{최단 경로}', s:'가중치가 없을 때 <b>보장</b>됩니다.'}
  ],
  next:[
   {lv:'바로',   t:'순서 비교', d:'두 방법의 번호 순서를 견주세요.'},
   {lv:'심화',   t:'최단 보장', d:'너비 우선이 최단인 까닭을 설명하세요.'},
   {lv:'프로젝트', t:'미로 만들기', d:'직접 미로를 만들어 두 방법을 비교하세요.'}
  ],
  eq:'큐 → 너비 우선(최단) · 스택 → 깊이 우선',
  what:'자료구조 하나를 바꾸면 <b>결과가 달라진다</b>는 것을 봅니다.',
  probe:'깊이 우선으로 먼저 찾은 길이 최단보다 훨씬 깁니다.',
  link:'탐색 전략의 기본이며, 최단 경로(LAB 301)로 이어집니다.'},

{tex:[
   {t:'d(v)=\\\\min_{u \\\\in \\\\text{확정}}\\\\left(d(u)+w(u,v)\\\\right)', s:'확정된 곳에서 <b>한 걸음</b> 늘려 갑니다.'},
   {t:'\\\\text{가장 작은 } d \\\\text{ 를 가진 곳을 확정}', s:'그 값은 <b>더 줄어들 수 없습니다</b>.'},
   {t:'w>0 \\\\Rightarrow \\\\text{확정을 되돌릴 일이 없다}', s:'양수 가중치가 <b>전제</b>입니다.'}
  ],
  next:[
   {lv:'바로',   t:'순서 따라가기', d:'확정 순서를 하나씩 따라가 보세요.'},
   {lv:'심화',   t:'정당성', d:'왜 되돌릴 일이 없는지 설명하세요.'},
   {lv:'프로젝트', t:'지도 위에서', d:'실제 지도 자료로 최단 경로를 구해 보세요.'}
  ],
  eq:'가장 가까운 곳부터 하나씩 확정',
  what:'모든 경로를 따지지 않고도 <b>최단</b>을 아는 방법입니다.',
  probe:'한 구간의 길이를 줄이면 최단 경로가 통째로 갈아탑니다.',
  link:'너비 우선 탐색(LAB 300)에 가중치를 더한 것입니다.'}
];`);
}

/* THUMBS */
{
  const key = s.match(/   '세 기둥과 쌓인 원반들'\)\r?\n\];/);
  if (!key) throw new Error('THUMBS 끝 앵커 실패');
  s = s.replace(key[0], `   '세 기둥과 쌓인 원반들'),

 svg(\`<g stroke="\${TC.blue}" stroke-width="1.8" fill="none">
   <path d="M26 74 L60 18 L94 74 Z"/><path d="M26 74 L94 74"/>
   <path d="M60 18 L60 74"/></g>
   <circle cx="26" cy="74" r="7" fill="\${TC.rose}"/>
   <circle cx="94" cy="74" r="7" fill="\${TC.rose}"/>
   <circle cx="60" cy="18" r="7" fill="\${TC.teal}"/>
   <circle cx="60" cy="74" r="7" fill="\${TC.teal}"/>
   <text x="60" y="96" font-size="8" font-weight="800" fill="\${TC.ink3}" text-anchor="middle">홀수 점 2</text>\`,
   '홀수 차수 점 두 곳이 표시된 그래프'),

 svg(\`<g stroke="\${TC.blue}" stroke-width="1.4" opacity=".8">
   <line x1="60" y1="14" x2="24" y2="46"/><line x1="60" y1="14" x2="96" y2="46"/>
   <line x1="24" y1="46" x2="42" y2="82"/><line x1="96" y1="46" x2="78" y2="82"/>
   <line x1="42" y1="82" x2="78" y2="82"/></g>
   <g fill="\${TC.teal}">
   <circle cx="60" cy="14" r="8"/><circle cx="24" cy="46" r="8"/><circle cx="96" cy="46" r="8"/>
   <circle cx="42" cy="82" r="8"/><circle cx="78" cy="82" r="8"/></g>
   <text x="60" y="52" font-size="9" font-weight="800" fill="\${TC.rose}" text-anchor="middle">Σ = 2|E|</text>\`,
   '다섯 점이 이어진 악수 그래프'),

 svg(\`<g stroke="\${TC.ink3}" stroke-width="1" opacity=".3">
   <line x1="24" y1="30" x2="96" y2="30"/><line x1="24" y1="70" x2="96" y2="70"/>
   <line x1="24" y1="30" x2="24" y2="70"/></g>
   <g stroke="\${TC.blue}" stroke-width="2.6">
   <line x1="24" y1="30" x2="60" y2="18"/><line x1="60" y1="18" x2="96" y2="30"/>
   <line x1="24" y1="30" x2="42" y2="70"/><line x1="42" y1="70" x2="78" y2="78"/>
   <line x1="78" y1="78" x2="96" y2="30"/></g>
   <g fill="\${TC.ink3}">
   <circle cx="24" cy="30" r="6"/><circle cx="60" cy="18" r="6"/><circle cx="96" cy="30" r="6"/>
   <circle cx="42" cy="70" r="6"/><circle cx="78" cy="78" r="6"/></g>
   <text x="60" y="98" font-size="8" font-weight="800" fill="\${TC.ink3}" text-anchor="middle">n − 1 개</text>\`,
   '가장 싸게 모두 이은 나무 모양 길'),

 svg(\`<g fill="none" stroke="\${TC.ink3}" stroke-width="1" opacity=".45">
   <rect x="16" y="20" width="88" height="60"/>
   <line x1="38" y1="20" x2="38" y2="80"/><line x1="60" y1="20" x2="60" y2="80"/>
   <line x1="82" y1="20" x2="82" y2="80"/>
   <line x1="16" y1="40" x2="104" y2="40"/><line x1="16" y1="60" x2="104" y2="60"/></g>
   <rect x="60" y="40" width="22" height="20" fill="\${TC.ink3}" opacity=".8"/>
   <path d="M27 30 L49 30 L49 50 L71 70 L93 70" stroke="\${TC.amber || TC.rose}" stroke-width="2.6" fill="none"/>
   <circle cx="27" cy="30" r="4" fill="\${TC.teal}"/><circle cx="93" cy="70" r="4" fill="\${TC.rose}"/>
   <text x="60" y="96" font-size="8" font-weight="800" fill="\${TC.ink3}" text-anchor="middle">큐 vs 스택</text>\`,
   '벽을 피해 출구로 이어진 미로 경로'),

 svg(\`<g stroke="\${TC.ink3}" stroke-width="1.2" opacity=".35">
   <line x1="22" y1="30" x2="60" y2="16"/><line x1="60" y1="16" x2="98" y2="34"/>
   <line x1="22" y1="30" x2="40" y2="72"/><line x1="40" y1="72" x2="78" y2="80"/>
   <line x1="78" y1="80" x2="98" y2="34"/><line x1="60" y1="16" x2="40" y2="72"/></g>
   <g stroke="\${TC.blue}" stroke-width="3">
   <line x1="22" y1="30" x2="60" y2="16"/><line x1="60" y1="16" x2="98" y2="34"/></g>
   <circle cx="22" cy="30" r="7" fill="\${TC.teal}"/>
   <circle cx="60" cy="16" r="7" fill="\${TC.blue}"/>
   <circle cx="98" cy="34" r="7" fill="\${TC.blue}"/>
   <circle cx="40" cy="72" r="7" fill="\${TC.ink3}" opacity=".35"/>
   <circle cx="78" cy="80" r="7" fill="\${TC.ink3}" opacity=".35"/>
   <text x="60" y="98" font-size="8" font-weight="800" fill="\${TC.ink3}" text-anchor="middle">하나씩 확정</text>\`,
   '가까운 곳부터 확정해 가는 최단 경로')
];`);
}

new Function(s);
fs.writeFileSync(P, s);

{
  const C = 'src/55-catalog.js';
  let c = fs.readFileSync(C, 'utf8');
  const m = c.match(/(\{k:'disc',g:'이산 수학 · 하노이 탑'[^}]*\})(\r?\n\];)/);
  if (!m) throw new Error('LABCAT 끝 앵커 실패');
  c = c.replace(m[0], m[1] + `,
{k:'disc',g:'이산 수학 · 한붓그리기',b:'홀수 차수 꼭짓점을 세지 않고 연결만 확인해 안 되는 그림도 된다고 함'},
{k:'disc',g:'이산 수학 · 악수 정리',b:'간선을 한 번만 세어 차수의 합이 간선 수와 같게 나옴'},
{k:'disc',g:'이산 수학 · 최소 신장 트리',b:'사이클 검사를 안 해 이미 이어진 곳을 또 이어 비용이 커짐'},
{k:'disc',g:'이산 수학 · 탐색 순서',b:'너비 우선에 스택을 써 최단 경로가 아닌 길을 답으로 냄'},
{k:'disc',g:'이산 수학 · 다익스트라',b:'이미 확정된 정점을 다시 갱신해 경로가 계속 바뀜'}` + m[2]);
  fs.writeFileSync(C, c);
}
console.log('LAB 297~301 (이산 수학 B · 5종) 설치 완료');
