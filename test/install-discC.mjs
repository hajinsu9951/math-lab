// 이산 수학 C — LAB 302~306 (탐욕의 실패·허프만·오류 정정·복잡도·정렬 경주) 전 계층 설치
import fs from 'node:fs';
const P = 'src/40-demos.js';
let s = fs.readFileSync(P, 'utf8');
const NAMES = ['greedyFailDemo', 'huffmanDemo', 'hamming74Demo', 'complexityDemo', 'sortRaceDemo'];
if (s.includes('function greedyFailDemo')) throw new Error('이미 설치됨');
for (const n of NAMES) if (s.includes('function ' + n + '(')) throw new Error('이름 충돌: ' + n);

{ const i = s.indexOf('const LABS=[');
  s = s.slice(0, i) + '\n' + fs.readFileSync('algAM-demos.txt', 'utf8') + '\n' + s.slice(i); }

{ const key = ' build:dijkstraDemo}\n];';
  const i = s.indexOf(key);
  if (i < 0) throw new Error('LABS 끝 앵커 실패');
  s = s.slice(0, i) + ` build:dijkstraDemo},
{n:302,core:0,t:'“매번 최선인데 왜 손해일까” 탐욕법의 실패',q:'눈앞의 최선이 전체의 최선일까?',
 m:['탐욕 알고리즘','반례','최적화'],a:['거스름돈','자원 배분'],
 note:'큰 것부터 고르는 방법은 동전 묶음이 알맞게 짜여 있을 때만 최적입니다. 묶음을 바꾸면 반례가 나옵니다.',
 build:greedyFailDemo},
{n:303,core:0,t:'“자주 쓰면 짧게” 허프만 부호',q:'글자마다 길이를 다르게 하면?',
 m:['부호화','이진 트리','빈도'],a:['데이터 압축','파일 저장'],
 note:'빈도가 높은 글자에 짧은 부호를 줍니다. 어떤 부호도 다른 부호의 앞부분이 되지 않게 만드는 것이 핵심입니다.',
 build:huffmanDemo},
{n:304,core:0,t:'“어디가 뒤집혔는지까지” 오류 검출·정정',q:'한 비트가 뒤집혀도 고칠 수 있을까?',
 m:['패리티','해밍 부호','이진 표현'],a:['통신 오류 정정','저장 장치'],
 note:'패리티 하나로는 「틀렸다」까지만 압니다. 검사를 겹쳐 붙이면 자리까지 짚어 낼 수 있습니다.',
 build:hamming74Demo},
{n:305,core:0,t:'“열 배가 되면 몇 배일까” 복잡도 비교',q:'n 이 작을 때는 왜 비슷해 보일까?',
 m:['증가율','로그','복잡도'],a:['알고리즘 선택','성능 예측'],
 note:'n log n 과 n² 은 작은 n 에서 비슷해 보입니다. n 을 크게 해야 차이가 드러납니다.',
 build:complexityDemo},
{n:306,core:0,t:'“어느 정렬이 빠른가” 자료의 모양이 정한다',q:'같은 알고리즘도 상황에 따라 다를까?',
 m:['정렬','비교 횟수','최선·최악'],a:['알고리즘 선택','성능 측정'],
 note:'삽입 정렬은 이미 정렬된 자료에서 가장 빠르고, 거꾸로 된 자료에서 가장 느립니다.',
 build:sortRaceDemo}
];` + s.slice(i + key.length);
}

{
  const m = s.match(/const PROBLEMS=(\{.*?\});/);
  if (!m) throw new Error('PROBLEMS 앵커 실패');
  const PR = JSON.parse(m[1]);
  PR['302'] = { sit: '거스름돈은 큰 동전부터 주면 개수가 가장 적습니다. 우리 동전으로는 늘 그렇습니다.',
    ask: '언제나 그럴까? 동전의 종류를 바꿔도 그럴까?' };
  PR['303'] = { sit: '같은 글을 저장하는데 어떤 방식은 파일이 절반밖에 안 됩니다.',
    ask: '무엇을 줄인 걸까? 글자마다 길이를 다르게 하면 읽을 때 헷갈리지 않을까?' };
  PR['304'] = { sit: '통신 중에 비트 하나가 뒤집혔습니다. 받는 쪽은 무언가 틀렸다는 것까지는 알았습니다.',
    ask: '어디가 틀렸는지도 알 수 있을까? 다시 보내 달라고 하지 않고 고칠 수 있을까?' };
  PR['305'] = { sit: '자료 100 개로 두 프로그램을 재 보니 걸린 시간이 비슷했습니다. 그래서 아무거나 써도 될 줄 알았습니다.',
    ask: '자료가 만 개가 되면 어떨까? 작은 자료로 잰 것을 믿어도 될까?' };
  PR['306'] = { sit: '「삽입 정렬은 느리다」고 배웠는데, 어떤 자료에서는 오히려 가장 빨랐습니다.',
    ask: '무엇이 빠르고 느림을 가를까? 「어느 정렬이 빠른가」라는 질문은 온전한 질문일까?' };
  s = s.replace(m[0], 'const PROBLEMS=' + JSON.stringify(PR) + ';');

  const i0 = s.indexOf('const MISSIONS=');
  const mm = s.slice(i0).match(/^const MISSIONS=\{[\s\S]*?\n\};/);
  if (!mm) throw new Error('MISSIONS 앵커 실패');
  const M = new Function('return ' + mm[0].slice('const MISSIONS='.length, -1))();

  M['302'] = [
   {t:'1분 자유 탐색 — 금액을 바꿔 보세요. 위아래 두 줄이 언제 달라지나요?'},
   {t:'오늘의 문제 — 동전 묶음을 1, 3, 4 원으로 바꾸고 금액을 6 원으로 하세요.',
    re:'매번 최선이 전체의 최선은 아닙니다',
    do:'① 묶음을 1, 3, 4 원으로 ② 금액을 6 으로 ③ 두 줄의 개수 비교',
    hand:'6 = 4 + 1 + 1 과 6 = 3 + 3 을 견주기'},
   {t:'우리 동전으로 — 묶음을 1, 5, 10, 50 원으로 되돌리고 금액을 40 원으로 하세요.',
    re:'묶음이 그렇게 짜여 있기 때문입니다',
    do:'① 묶음 되돌리기 ② 금액을 40 으로 ③ 두 줄이 같은지 확인',
    hand:'여러 금액으로 바꿔 가며 늘 같은지 확인'},
   {t:'(묶음, 금액, 두 개수) 를 여섯 줄 기록하세요.'},
   {t:'심화 — 반례 찾기: 1, 3, 4 원 묶음에서 탐욕이 실패하는 가장 작은 금액을 찾고, 어떤 묶음에서 탐욕이 늘 통하는지(정준 묶음) 조사하세요.'}];

  M['303'] = [
   {t:'1분 자유 탐색 — 빈도를 움직여 보세요. 나무 모양이 어떻게 달라지나요?'},
   {t:'오늘의 문제 — 빈도를 각각 40, 10, 5, 2 로 맞추세요. 압축률이 얼마인가요?',
    re:'자주 나오는 글자를 짧게 했더니',
    do:'① 가 를 40 으로 ② 나 를 10, 다 를 5, 라 를 2 로 ③ 압축률 읽기',
    hand:'각 글자의 부호 길이 × 빈도를 더해 확인'},
   {t:'같은 길이로 — 「모든 글자에 같은 길이 주기」를 켜세요.',
    re:'한 비트도 줄지 않았습니다',
    do:'① 체크 켜기 ② 압축률 확인 ③ 빈도를 바꿔도 그런지 보기',
    hand:'2 비트 × 전체 글자 수를 계산'},
   {t:'(빈도, 부호 길이, 압축률) 을 여섯 줄 기록하세요.'},
   {t:'심화 — 접두 부호: 어떤 부호도 다른 부호의 앞부분이 되지 않아야 띄어쓰기 없이 읽힙니다. 허프만 나무에서 글자가 모두 잎에 놓이는 것이 왜 그 조건을 보장하는지 설명하세요.'}];

  M['304'] = [
   {t:'1분 자유 탐색 — 자료를 바꿔 보세요. 일곱 칸의 값이 어떻게 정해지나요?'},
   {t:'오늘의 문제 — 뒤집힌 자리를 5 번으로 두세요. 세 검사가 무엇을 가리키나요?',
    re:'번으로 짚어 냈습니다',
    do:'① 뒤집힌 자리를 5 로 ② 세 검사 결과 보기 ③ 짚어 낸 위치 읽기',
    hand:'세 검사 결과를 2 진수로 읽어 자리 번호와 맞춰 보기'},
   {t:'패리티 하나로 — 「패리티를 한 개만 붙이기」를 켜세요. 무엇까지 알 수 있나요?',
    re:'어디인지는 모릅니다',
    do:'① 체크 켜기 ② 판정 문구 읽기 ③ 자리를 바꿔도 같은지 확인',
    hand:'패리티 한 개가 담을 수 있는 정보량을 적기'},
   {t:'(자료, 뒤집힌 자리, 세 검사, 짚어 낸 위치) 를 여섯 줄 기록하세요.'},
   {t:'심화 — 왜 3 개인가: 검사 비트 r 개로 자리 2ʳ − 1 개까지 가릴 수 있음을 설명하고, r = 3 일 때 7 자리가 나오는 까닭을 밝히세요.'}];

  M['305'] = [
   {t:'1분 자유 탐색 — n 을 키워 보세요. 두 곡선이 언제부터 벌어지나요?'},
   {t:'오늘의 문제 — n 을 1000 으로 올리세요. 두 값의 비가 얼마인가요?',
    re:'n 을 키워야 보이는 차이입니다',
    do:'① n 을 1000 으로 ② 두 값 확인 ③ 비 읽기',
    hand:'n / log₂ n 을 계산해 화면 값과 맞춰 보기'},
   {t:'로그 눈금으로 — 「세로를 로그 눈금으로 보기」를 켜세요. 두 곡선이 어떻게 보이나요?',
    re:'기울기의 차이가 바로 차수의 차이입니다',
    do:'① 체크 켜기 ② 두 곡선의 모양 보기 ③ 기울기 비교',
    hand:'log(n²) = 2 log n 임을 확인'},
   {t:'(n, 두 값, 비) 를 여섯 줄 기록하세요.'},
   {t:'심화 — 열 배의 뜻: 자료가 열 배가 될 때 n log n 은 약 몇 배, n² 은 몇 배가 되는지 계산하고, 그것이 실제 프로그램의 실행 시간에 무엇을 뜻하는지 쓰세요.'}];

  M['306'] = [
   {t:'1분 자유 탐색 — 개수를 바꿔 보세요. 두 막대의 길이가 어떻게 되나요?'},
   {t:'오늘의 문제 — 자료의 모양을 「이미 정렬됨」으로 바꾸세요. 어느 쪽이 적게 비교하나요?',
    re:'삽입 정렬이 오히려 적게 비교합니다',
    do:'① 모양을 이미 정렬됨으로 ② 두 값 비교 ③ n − 1 과 견주기',
    hand:'이미 정렬된 자료에서 삽입 정렬이 몇 번 비교하는지 세기'},
   {t:'거꾸로 두면 — 자료의 모양을 「거꾸로 정렬됨」으로 바꾸세요.',
    re:'삽입 정렬이 병합 정렬의',
    do:'① 모양을 거꾸로로 ② 두 값 비교 ③ n(n−1)/2 과 견주기',
    hand:'n = 20 일 때 20 × 19 / 2 를 계산'},
   {t:'(개수, 모양, 두 비교 횟수) 를 여섯 줄 기록하세요.'},
   {t:'심화 — 질문을 고치기: 「어느 정렬이 빠른가」를 온전한 질문으로 고쳐 쓰고, 최선·평균·최악의 경우를 나누어 두 정렬을 표로 정리하세요.'}];

  s = s.slice(0, i0) + 'const MISSIONS=' + JSON.stringify(M, null, 1) + ';' + s.slice(i0 + mm[0].length);

  const PR2 = JSON.parse(s.match(/const PROBLEMS=(\{.*?\});/)[1]);
  const labsBlock = s.slice(s.indexOf('const LABS=['), s.indexOf('const THUMBS ='));
  const demoSrc = fs.readFileSync('algAM-demos.txt', 'utf8');
  let bad = 0;
  ['302', '303', '304', '305', '306'].forEach((k, ki) => {
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
  const key = s.match(/  link:'너비 우선 탐색\(LAB 300\)에 가중치를 더한 것입니다\.'\}\r?\n\];/);
  if (!key) throw new Error('PRINS 끝 앵커 실패');
  s = s.replace(key[0], `  link:'너비 우선 탐색(LAB 300)에 가중치를 더한 것입니다.'},

{tex:[
   {t:'\\\\text{탐욕}:\\\\ \\\\text{매 단계에서 가장 좋아 보이는 것}', s:'<b>지금</b>만 봅니다.'},
   {t:'\\\\{1,3,4\\\\},\\\\ 6=3+3\\\\ \\\\text{vs}\\\\ 4+1+1', s:'묶음을 바꾸면 <b>반례</b>가 나옵니다.'},
   {t:'\\\\text{최적} \\\\Leftarrow \\\\text{묶음의 생김새}', s:'통하는지는 <b>자료</b>가 정합니다.'}
  ],
  next:[
   {lv:'바로',   t:'반례 찾기', d:'탐욕이 지는 가장 작은 금액을 찾으세요.'},
   {lv:'심화',   t:'조건 조사', d:'탐욕이 늘 통하는 묶음의 조건을 찾으세요.'},
   {lv:'프로젝트', t:'동전 설계', d:'탐욕이 통하는 새 동전 묶음을 설계하세요.'}
  ],
  eq:'탐욕이 최적일 조건은 문제가 아니라 자료가 정한다',
  what:'「해 보면 되겠지」를 <b>반례 하나</b>로 무너뜨리는 경험입니다.',
  probe:'1, 3, 4 원 묶음에서 6 원을 만들어 보면 곧바로 드러납니다.',
  link:'최소 신장 트리(LAB 299)와 짝지어 보면 좋습니다.'},

{tex:[
   {t:'\\\\text{비용}=\\\\sum_i f_i\\\\,\\\\ell_i', s:'빈도 × 길이의 <b>합</b>을 줄입니다.'},
   {t:'\\\\text{빈도가 큰 글자} \\\\Rightarrow \\\\text{짧은 부호}', s:'같은 길이보다 <b>이득</b>입니다.'},
   {t:'\\\\text{접두 부호}:\\\\ \\\\text{어떤 부호도 다른 부호의 앞이 아니다}', s:'띄어쓰기 없이 <b>읽힙니다</b>.'}
  ],
  next:[
   {lv:'바로',   t:'길이 재기', d:'빈도를 바꿔 부호 길이를 확인하세요.'},
   {lv:'심화',   t:'접두 조건', d:'잎에만 글자를 두는 까닭을 설명하세요.'},
   {lv:'프로젝트', t:'글 압축', d:'실제 글의 글자 빈도로 부호를 만들어 보세요.'}
  ],
  eq:'비용 = Σ (빈도 × 부호 길이)',
  what:'같은 정보를 <b>더 짧게</b> 적는 방법을 설계합니다.',
  probe:'모든 빈도가 같으면 압축률이 100 % 가 됩니다.',
  link:'이진 트리와 정보량을 잇는 대표적인 알고리즘입니다.'},

{tex:[
   {t:'\\\\text{패리티 1 개} \\\\Rightarrow \\\\text{검출만}', s:'「틀렸다」<b>까지만</b> 압니다.'},
   {t:'\\\\text{해밍}(7,4):\\\\ \\\\text{검사 3 개로 7 자리}', s:'2³ − 1 = 7 <b>자리</b>를 가립니다.'},
   {t:'\\\\text{세 검사} \\\\to \\\\text{2 진수} \\\\to \\\\text{자리 번호}', s:'그대로 읽으면 <b>위치</b>가 나옵니다.'}
  ],
  next:[
   {lv:'바로',   t:'자리 짚기', d:'여러 자리를 뒤집어 짚어 내는지 보세요.'},
   {lv:'심화',   t:'개수의 뜻', d:'검사 r 개로 왜 2ʳ − 1 자리인지 설명하세요.'},
   {lv:'프로젝트', t:'부호 설계', d:'두 자리 오류까지 검출하는 방법을 조사하세요.'}
  ],
  eq:'검사 r 개 → 2ʳ − 1 자리까지 정정',
  what:'정보를 조금 더 보내 <b>오류를 스스로 고치는</b> 설계입니다.',
  probe:'패리티가 하나뿐이면 자리를 짚지 못합니다.',
  link:'이진 표현(LAB 242)의 실용적인 응용입니다.'},

{tex:[
   {t:'\\\\frac{n^{2}}{n\\\\log_2 n}=\\\\frac{n}{\\\\log_2 n}', s:'차이는 <b>n 이 커질수록</b> 벌어집니다.'},
   {t:'n=100 \\\\Rightarrow 15\\\\ \\\\text{배},\\\\qquad n=10^{4} \\\\Rightarrow 750\\\\ \\\\text{배}', s:'작은 n 으로 재면 <b>속습니다</b>.'},
   {t:'\\\\log(n^{2})=2\\\\log n', s:'로그 눈금에서는 <b>기울기</b>가 차수입니다.'}
  ],
  next:[
   {lv:'바로',   t:'비 계산', d:'여러 n 에서 두 값의 비를 구하세요.'},
   {lv:'심화',   t:'열 배의 뜻', d:'자료가 열 배일 때의 배율을 각각 구하세요.'},
   {lv:'프로젝트', t:'실측 비교', d:'두 정렬의 실제 시간을 재어 곡선과 견주세요.'}
  ],
  eq:'n² / (n log n) = n / log n',
  what:'성능을 <b>작은 자료로 재면 안 되는</b> 까닭을 확인합니다.',
  probe:'로그 눈금으로 보면 두 곡선이 곧은 선이 됩니다.',
  link:'지수·로그(LAB 12)를 알고리즘 감각으로 잇습니다.'},

{tex:[
   {t:'\\\\text{삽입 정렬 최선}=n-1', s:'이미 정렬되어 있으면 <b>한 번씩</b>만 봅니다.'},
   {t:'\\\\text{삽입 정렬 최악}=\\\\frac{n(n-1)}{2}', s:'거꾸로면 <b>모두</b> 비교합니다.'},
   {t:'\\\\text{병합 정렬}\\\\approx n\\\\log_2 n\\\\ \\\\text{(언제나)}', s:'모양과 <b>거의 무관</b>합니다.'}
  ],
  next:[
   {lv:'바로',   t:'세 모양 비교', d:'세 가지 자료에서 비교 횟수를 재세요.'},
   {lv:'심화',   t:'표로 정리', d:'최선·평균·최악을 표로 만드세요.'},
   {lv:'프로젝트', t:'하이브리드', d:'작은 조각은 삽입, 큰 조각은 병합으로 섞어 보세요.'}
  ],
  eq:'삽입 : n−1 ~ n(n−1)/2 · 병합 : ≈ n log n',
  what:'「어느 것이 빠른가」에 <b>조건이 빠져 있음</b>을 확인합니다.',
  probe:'이미 정렬된 자료에서는 삽입 정렬이 이깁니다.',
  link:'복잡도(LAB 305)를 실제 알고리즘으로 확인하는 자리입니다.'}
];`);
}

/* THUMBS */
{
  const key = s.match(/   '가까운 곳부터 확정해 가는 최단 경로'\)\r?\n\];/);
  if (!key) throw new Error('THUMBS 끝 앵커 실패');
  s = s.replace(key[0], `   '가까운 곳부터 확정해 가는 최단 경로'),

 svg(\`<g fill="\${TC.rose}" opacity=".75">
   <circle cx="26" cy="34" r="12"/><circle cx="52" cy="34" r="7"/><circle cx="72" cy="34" r="7"/></g>
   <g fill="\${TC.teal}" opacity=".75">
   <circle cx="30" cy="72" r="10"/><circle cx="56" cy="72" r="10"/></g>
   <text x="98" y="38" font-size="10" font-weight="800" fill="\${TC.rose}">3개</text>
   <text x="98" y="76" font-size="10" font-weight="800" fill="\${TC.teal}">2개</text>\`,
   '동전을 큰 것부터 고른 결과와 최소 개수 비교'),

 svg(\`<g stroke="\${TC.ink3}" stroke-width="1.2" opacity=".5">
   <line x1="60" y1="18" x2="34" y2="44"/><line x1="60" y1="18" x2="86" y2="44"/>
   <line x1="34" y1="44" x2="20" y2="72"/><line x1="34" y1="44" x2="48" y2="72"/></g>
   <circle cx="86" cy="44" r="12" fill="\${TC.blue}"/>
   <circle cx="20" cy="72" r="10" fill="\${TC.blue}" opacity=".6"/>
   <circle cx="48" cy="72" r="10" fill="\${TC.blue}" opacity=".6"/>
   <text x="86" y="48" font-size="10" font-weight="800" fill="#fff" text-anchor="middle">가</text>
   <text x="60" y="96" font-size="8" font-weight="800" fill="\${TC.ink3}" text-anchor="middle">자주 = 짧게</text>\`,
   '자주 쓰는 글자가 위쪽에 붙은 부호 나무'),

 svg(\`<g>
   <rect x="14" y="38" width="16" height="24" fill="\${TC.ink3}" opacity=".35"/>
   <rect x="34" y="38" width="16" height="24" fill="\${TC.ink3}" opacity=".35"/>
   <rect x="54" y="38" width="16" height="24" fill="\${TC.blue}" opacity=".6"/>
   <rect x="74" y="38" width="16" height="24" fill="\${TC.rose}" opacity=".85"/>
   <rect x="94" y="38" width="16" height="24" fill="\${TC.blue}" opacity=".6"/></g>
   <text x="82" y="30" font-size="10" font-weight="800" fill="\${TC.rose}" text-anchor="middle">↓</text>
   <text x="60" y="82" font-size="8" font-weight="800" fill="\${TC.ink3}" text-anchor="middle">4번 자리가 뒤집힘</text>\`,
   '한 칸만 붉게 표시된 비트열'),

 svg(\`<path d="M18 76 C46 70 66 58 104 20" stroke="\${TC.rose}" stroke-width="2.4" fill="none"/>
   <path d="M18 78 C50 76 74 70 104 60" stroke="\${TC.teal}" stroke-width="2.4" fill="none"/>
   <line x1="12" y1="80" x2="110" y2="80" stroke="\${TC.ink3}" stroke-width="1" opacity=".5"/>
   <text x="96" y="16" font-size="9" font-weight="800" fill="\${TC.rose}" text-anchor="end">n²</text>
   <text x="104" y="56" font-size="9" font-weight="800" fill="\${TC.teal}" text-anchor="end">n log n</text>\`,
   '갈수록 벌어지는 두 증가 곡선'),

 svg(\`<g fill="\${TC.blue}" opacity=".6">
   <rect x="16" y="58" width="9" height="20"/><rect x="28" y="48" width="9" height="30"/>
   <rect x="40" y="38" width="9" height="40"/><rect x="52" y="28" width="9" height="50"/>
   <rect x="64" y="20" width="9" height="58"/></g>
   <g fill="\${TC.rose}" opacity=".7">
   <rect x="84" y="20" width="9" height="58"/><rect x="96" y="30" width="9" height="48"/></g>
   <text x="60" y="94" font-size="8" font-weight="800" fill="\${TC.ink3}" text-anchor="middle">모양이 정한다</text>\`,
   '정렬된 자료와 거꾸로 된 자료의 막대 비교')
];`);
}

new Function(s);
fs.writeFileSync(P, s);

{
  const C = 'src/55-catalog.js';
  let c = fs.readFileSync(C, 'utf8');
  const m = c.match(/(\{k:'disc',g:'이산 수학 · 다익스트라'[^}]*\})(\r?\n\];)/);
  if (!m) throw new Error('LABCAT 끝 앵커 실패');
  c = c.replace(m[0], m[1] + `,
{k:'disc',g:'이산 수학 · 탐욕법의 실패',b:'거스름돈 동전을 큰 것부터만 골라 최소 개수가 아닌 답을 냄'},
{k:'disc',g:'이산 수학 · 허프만 부호',b:'빈도와 무관하게 같은 길이를 배정해 압축률이 1 로 나옴'},
{k:'disc',g:'이산 수학 · 오류 정정',b:'패리티를 한 개만 붙여 오류 위치를 못 찾고 검출만 함'},
{k:'disc',g:'이산 수학 · 복잡도',b:'작은 n 에서만 재 두 방법이 같아 보임'},
{k:'disc',g:'이산 수학 · 정렬 경주',b:'이미 정렬된 자료를 넣어도 늘 같은 횟수를 세 최선의 경우가 안 보임'}` + m[2]);
  fs.writeFileSync(C, c);
}
console.log('LAB 302~306 (이산 수학 C · 5종) 설치 완료');
