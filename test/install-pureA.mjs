// 전문 수학 A — LAB 307~311 (귀류법·추론의 형태·가산성·대각선 논법·상한) 전 계층 설치
import fs from 'node:fs';
const P = 'src/40-demos.js';
let s = fs.readFileSync(P, 'utf8');
const NAMES = ['reductioDemo', 'fallacyDemo', 'countableDemo', 'diagonalDemo', 'supremumDemo'];
if (s.includes('function reductioDemo')) throw new Error('이미 설치됨');
for (const n of NAMES) if (s.includes('function ' + n + '(')) throw new Error('이름 충돌: ' + n);

{ const i = s.indexOf('const LABS=[');
  s = s.slice(0, i) + '\n' + fs.readFileSync('algAN-demos.txt', 'utf8') + '\n' + s.slice(i); }

{ const key = ' build:sortRaceDemo}\n];';
  const i = s.indexOf(key);
  if (i < 0) throw new Error('LABS 끝 앵커 실패');
  s = s.slice(0, i) + ` build:sortRaceDemo},
{n:307,core:0,t:'“아니라고 하면 무엇이 무너지나” 귀류법',q:'없다는 것을 어떻게 증명할까?',
 m:['귀류법','모순','무리수'],a:['반증 기반 추론','증명 전략'],
 note:'결론의 부정에서 출발해 모순을 끌어냅니다. 증명할 것을 그대로 가정하면 순환이 됩니다.',
 build:reductioDemo},
{n:308,core:0,t:'“젖었으니 비가 왔다”는 왜 틀릴까',q:'타당한 추론과 아닌 것을 어떻게 가릴까?',
 m:['조건문','대우','추론 규칙'],a:['논리적 오류 판별','근거 검증'],
 note:'전건긍정과 후건부정은 타당하고, 후건긍정과 전건부정은 반례가 있습니다.',
 build:fallacyDemo},
{n:309,core:0,t:'“분수는 자연수만큼 있을까” 가산집합',q:'무한끼리도 크기를 견줄 수 있을까?',
 m:['일대일 대응','가산집합','대각선 열거'],a:['집합의 크기','열거 가능성'],
 note:'번호를 빠짐없이 붙일 수 있으면 자연수와 같은 크기입니다. 분모별로 세면 첫 줄에서 끝나지 않습니다.',
 build:countableDemo},
{n:310,core:0,t:'“목록에 없는 수 만들기” 칸토어 대각선 논법',q:'실수도 줄 세울 수 있을까?',
 m:['대각선 논법','비가산','실수'],a:['대각화 논증','계산 불가능성'],
 note:'n 번째 수의 n 번째 자리를 모두 바꾸면 목록의 어느 것과도 다른 수가 됩니다.',
 build:diagonalDemo},
{n:311,core:0,t:'“최댓값이 없어도 울타리는 있다” 상한',q:'가장 낮은 위쪽 울타리는 무엇일까?',
 m:['상한과 하한','유계','완비성'],a:['경계값 정의','극한의 존재'],
 note:'상한은 위쪽 울타리 가운데 가장 낮은 것입니다. 집합 안에 있을 필요는 없습니다.',
 build:supremumDemo}
];` + s.slice(i + key.length);
}

{
  const m = s.match(/const PROBLEMS=(\{.*?\});/);
  if (!m) throw new Error('PROBLEMS 앵커 실패');
  const PR = JSON.parse(m[1]);
  PR['307'] = { sit: '「√2 를 분수로 쓸 수 없다」를 증명하라고 합니다. 없다는 것을 어떻게 보여야 할지 막막합니다.',
    ask: '있다고 해 놓고 따라가 보면 어떨까? 그 길의 끝에 무엇이 있을까?' };
  PR['308'] = { sit: '길이 젖어 있는 것을 보고 「비가 왔구나」라고 말했습니다. 그런데 물차가 지나간 것이었습니다.',
    ask: '무엇이 잘못된 추론일까? 「비가 오면 젖는다」에서 무엇까지 말할 수 있을까?' };
  PR['309'] = { sit: '자연수보다 분수가 훨씬 많아 보입니다. 자연수 사이사이에 분수가 빽빽하게 들어 있으니까요.',
    ask: '정말 더 많을까? 무한끼리 크기를 견주려면 무엇을 봐야 할까?' };
  PR['310'] = { sit: '분수는 번호를 붙일 수 있었습니다. 그렇다면 0 과 1 사이의 실수도 줄 세울 수 있을까요?',
    ask: '아무리 긴 목록을 만들어도 빠지는 수가 있을까? 어떻게 보일까?' };
  PR['311'] = { sit: '0 이상 1 미만인 수들의 모임에는 가장 큰 수가 없습니다. 1 에 가까워지기만 할 뿐입니다.',
    ask: '그래도 「가장 낮은 위쪽 울타리」는 있을까? 그것을 무엇이라 부를까?' };
  s = s.replace(m[0], 'const PROBLEMS=' + JSON.stringify(PR) + ';');

  const i0 = s.indexOf('const MISSIONS=');
  const mm = s.slice(i0).match(/^const MISSIONS=\{[\s\S]*?\n\};/);
  if (!mm) throw new Error('MISSIONS 앵커 실패');
  const M = new Function('return ' + mm[0].slice('const MISSIONS='.length, -1))();

  M['307'] = [
   {t:'1분 자유 탐색 — 단계를 하나씩 올려 보세요. 무엇이 밝혀지나요?'},
   {t:'오늘의 문제 — 단계를 5 까지 올리세요. 마지막에 무엇이 어긋나나요?',
    re:'서로소라고 해 놓고 둘 다 짝수가 나왔습니다',
    do:'① 단계를 5 로 ② 마지막 상자 읽기 ③ 첫 줄의 가정과 견주기',
    hand:'p = 2k 를 대입하는 과정을 손으로 따라 쓰기'},
   {t:'가정을 잘못 두면 — 「가정을 부정하지 않고 그대로 쓰기」를 켜세요.',
    re:'순환논법입니다',
    do:'① 체크 켜기 ② 네 줄 읽기 ③ 결론이 무엇의 되풀이인지 보기',
    hand:'첫 줄과 마지막 줄이 같은 말인지 확인'},
   {t:'(단계, 그 단계에서 밝혀진 것) 을 여섯 줄 기록하세요.'},
   {t:'심화 — 다른 증명으로: √2 가 무리수임을 소인수분해의 개수(2 의 지수가 짝수 vs 홀수)로 다시 증명하고, 두 증명이 어떻게 다른지 쓰세요.'}];

  M['308'] = [
   {t:'1분 자유 탐색 — 네 형태를 골라 보세요. 표의 어느 줄이 파랗게 되나요?'},
   {t:'오늘의 문제 — 「땅이 젖었다 → 비가 왔다」를 고르고 「반례를 찾아보기」를 누르세요.',
    re:'전제가 모두 참인데 결론이 거짓인 경우가 있으면',
    do:'① 후건긍정 고르기 ② 버튼 누르기 ③ 반례 읽기',
    hand:'땅을 적시는 다른 원인을 두 가지 더 적어 보기'},
   {t:'대우 — 「땅이 안 젖었다 → 비가 안 왔다」를 고르세요. 이것은 타당한가요?',
    re:'이것이 대우입니다',
    do:'① 후건부정 고르기 ② 판정 읽기 ③ 원래 명제와 견주기',
    hand:'p → q 와 ¬q → ¬p 의 진리표를 나란히 적기'},
   {t:'(형태, 기호, 판정, 반례) 를 여섯 줄 기록하세요.'},
   {t:'심화 — 왜 대우만 같은가: p → q 와 그 역·이·대우의 진리표를 모두 적어, 대우만 원래 명제와 언제나 같은 참거짓을 갖는 까닭을 밝히세요.'}];

  M['309'] = [
   {t:'1분 자유 탐색 — 번호를 늘려 보세요. 어떤 순서로 칸이 채워지나요?'},
   {t:'오늘의 문제 — 번호를 40 까지 올리세요. 빠지는 분수가 있나요?',
    re:'분수도 자연수만큼입니다',
    do:'① 번호를 40 으로 ② 채워진 칸의 모양 보기 ③ 빈칸이 남는지 확인',
    hand:'분자와 분모의 합이 5 인 분수를 모두 적어 보기'},
   {t:'다른 방법으로 — 「분모별로 차례대로 세기」를 켜세요. 무슨 일이 생기나요?',
    re:'이 방법으로는 번호가 다 붙지 않습니다',
    do:'① 체크 켜기 ② 채워지는 줄 보기 ③ 다음 줄로 넘어가는지 확인',
    hand:'분모 1 인 분수가 몇 개인지 세어 보기'},
   {t:'(번호, 마지막 분수, 세는 방식) 을 여섯 줄 기록하세요.'},
   {t:'심화 — 크기의 뜻: 「두 집합의 크기가 같다」를 일대일 대응으로 정의하고, 짝수 전체와 자연수 전체의 크기가 같음을 대응을 만들어 보이세요.'}];

  M['310'] = [
   {t:'1분 자유 탐색 — 목록의 개수를 바꿔 보세요. 붉은 대각선이 어떻게 움직이나요?'},
   {t:'오늘의 문제 — 「대각선을 바꿔 새 수 만들기」를 누르세요. 만든 수가 목록에 있나요?',
    re:'n 번째와는 n 번째 자리에서 다르니까요',
    do:'① 버튼 누르기 ② 새 수 읽기 ③ 목록의 각 수와 견주기',
    hand:'새 수의 첫째 자리와 1 번 수의 첫째 자리를 비교'},
   {t:'위험한 방식 — 「9 를 0 으로 바꾸는 방식 쓰기」를 켜세요. 무엇이 문제인가요?',
    re:'겉만 다르고 값이 같은 수가 생길 수 있습니다',
    do:'① 체크 켜기 ② 새 수 확인 ③ 0.4999… 와 0.5 를 떠올리기',
    hand:'0.999… = 1 임을 무한등비급수로 확인'},
   {t:'(목록 개수, 만든 수, 목록에 있나) 를 여섯 줄 기록하세요.'},
   {t:'심화 — 비가산: 0 과 1 사이의 실수에 번호를 다 붙였다고 가정하면 대각선으로 만든 수가 목록에 없다는 모순이 생김을 정리해, 실수가 가산이 아님을 증명하세요.'}];

  M['311'] = [
   {t:'1분 자유 탐색 — 울타리 값을 움직여 보세요. 언제 울타리가 되나요?'},
   {t:'오늘의 문제 — 집합을 { 0 ≤ x < 1 } 로 바꾸세요. 최댓값과 상한이 어떤가요?',
    re:'상한은 집합 밖에 있어도 됩니다',
    do:'① 집합을 0 이상 1 미만으로 ② 최댓값 확인 ③ 상한 확인',
    hand:'1 보다 작은 어떤 수를 대도 그보다 큰 원소가 있음을 보이기'},
   {t:'닫으면 — 집합을 { 0 ≤ x ≤ 1 } 로 바꾸세요. 무엇이 달라지나요?',
    re:'울타리가 집합 안으로 들어왔습니다',
    do:'① 집합을 0 이상 1 이하로 ② 최댓값 확인 ③ 상한과 견주기',
    hand:'두 집합의 차이가 점 하나뿐임을 확인'},
   {t:'(집합, 최댓값, 상한) 을 여섯 줄 기록하세요.'},
   {t:'심화 — 완비성: 「위로 유계인 실수의 집합에는 반드시 상한이 있다」가 유리수에서는 성립하지 않음을, {x : x² < 2} 를 예로 들어 설명하세요.'}];

  s = s.slice(0, i0) + 'const MISSIONS=' + JSON.stringify(M, null, 1) + ';' + s.slice(i0 + mm[0].length);

  const PR2 = JSON.parse(s.match(/const PROBLEMS=(\{.*?\});/)[1]);
  const labsBlock = s.slice(s.indexOf('const LABS=['), s.indexOf('const THUMBS ='));
  const demoSrc = fs.readFileSync('algAN-demos.txt', 'utf8');
  let bad = 0;
  ['307', '308', '309', '310', '311'].forEach((k, ki) => {
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
  const key = s.match(/  link:'복잡도\(LAB 305\)를 실제 알고리즘으로 확인하는 자리입니다\.'\}\r?\n\];/);
  if (!key) throw new Error('PRINS 끝 앵커 실패');
  s = s.replace(key[0], `  link:'복잡도(LAB 305)를 실제 알고리즘으로 확인하는 자리입니다.'},

{tex:[
   {t:'\\\\sqrt{2}=\\\\frac{p}{q}\\\\quad(\\\\gcd(p,q)=1)', s:'결론의 <b>부정</b>에서 출발합니다.'},
   {t:'p^{2}=2q^{2}\\\\ \\\\Rightarrow\\\\ p\\\\ \\\\text{는 짝수}', s:'제곱이 짝수면 <b>그 수도</b> 짝수입니다.'},
   {t:'p=2k \\\\Rightarrow q^{2}=2k^{2} \\\\Rightarrow q\\\\ \\\\text{도 짝수}', s:'서로소라던 가정과 <b>어긋납니다</b>.'}
  ],
  next:[
   {lv:'바로',   t:'단계 따라가기', d:'각 단계를 손으로 다시 써 보세요.'},
   {lv:'심화',   t:'다른 증명', d:'소인수 2 의 개수로 다시 증명하세요.'},
   {lv:'프로젝트', t:'√3 으로', d:'같은 방법으로 √3 이 무리수임을 보이세요.'}
  ],
  eq:'결론의 부정 → 모순 → 결론 참',
  what:'「없다」를 <b>있다고 가정해</b> 증명하는 방법을 익힙니다.',
  probe:'증명할 것을 그대로 가정하면 결론이 가정의 되풀이가 됩니다.',
  link:'증명법의 기본이며, 수학적 사고의 대표적인 도구입니다.'},

{tex:[
   {t:'p\\\\to q,\\\\ p \\\\vdash q', s:'전건긍정 — <b>타당</b>합니다.'},
   {t:'p\\\\to q,\\\\ \\\\neg q \\\\vdash \\\\neg p', s:'후건부정(대우) — <b>타당</b>합니다.'},
   {t:'p\\\\to q,\\\\ q \\\\nvdash p', s:'후건긍정 — <b>반례</b>가 있습니다.'}
  ],
  next:[
   {lv:'바로',   t:'네 형태 판정', d:'네 가지를 모두 판정해 보세요.'},
   {lv:'심화',   t:'진리표로', d:'역·이·대우의 진리표를 모두 적으세요.'},
   {lv:'프로젝트', t:'기사 검증', d:'뉴스의 추론에서 오류를 찾아보세요.'}
  ],
  eq:'대우만 원래 명제와 언제나 같다',
  what:'일상의 말에 숨은 <b>추론의 형태</b>를 가려내는 훈련입니다.',
  probe:'반례가 하나만 있어도 그 추론은 무너집니다.',
  link:'명제와 조건(LAB 49)의 논리적 바탕입니다.'},

{tex:[
   {t:'\\\\left|A\\\\right|=\\\\left|B\\\\right| \\\\iff \\\\text{일대일 대응이 있다}', s:'무한에서도 <b>대응</b>이 잣대입니다.'},
   {t:'\\\\mathbb{Q}\\\\ \\\\text{는 가산}', s:'대각선으로 훑으면 <b>번호가 다 붙습니다</b>.'},
   {t:'\\\\text{분모별로 세기} \\\\Rightarrow \\\\text{첫 줄에서 끝나지 않음}', s:'세는 <b>순서</b>가 전부입니다.'}
  ],
  next:[
   {lv:'바로',   t:'번호 붙이기', d:'몇 번째 분수인지 직접 세어 보세요.'},
   {lv:'심화',   t:'짝수와 자연수', d:'두 집합의 대응을 만들어 보세요.'},
   {lv:'프로젝트', t:'정수 열거', d:'정수 전체를 줄 세우는 방법을 설계하세요.'}
  ],
  eq:'가산 = 자연수와 일대일 대응',
  what:'「무한이 더 크다」는 직관을 <b>정의로</b> 다시 따집니다.',
  probe:'세는 순서를 잘못 잡으면 영영 다 세지 못합니다.',
  link:'대각선 논법(LAB 310)과 짝을 이룹니다.'},

{tex:[
   {t:'x_n = 0.d_{n1}d_{n2}d_{n3}\\\\cdots', s:'목록을 <b>모두</b> 적었다고 가정합니다.'},
   {t:'y=0.e_1e_2e_3\\\\cdots,\\\\quad e_n \\\\ne d_{nn}', s:'대각선을 <b>바꾼</b> 새 수입니다.'},
   {t:'y \\\\ne x_n\\\\ \\\\text{for all } n \\\\Rightarrow \\\\text{모순}', s:'목록에 <b>빠진 수</b>가 있습니다.'}
  ],
  next:[
   {lv:'바로',   t:'새 수 만들기', d:'대각선을 바꿔 직접 만들어 보세요.'},
   {lv:'심화',   t:'9 문제', d:'0.999… = 1 이 왜 걸림돌인지 설명하세요.'},
   {lv:'프로젝트', t:'다른 대각화', d:'같은 논법이 쓰이는 다른 정리를 조사하세요.'}
  ],
  eq:'대각선을 바꾼 수는 목록에 없다',
  what:'가정을 <b>스스로 무너뜨리는</b> 논증의 아름다움을 봅니다.',
  probe:'목록을 아무리 늘려도 늘 빠진 수가 나옵니다.',
  link:'가산집합(LAB 309)과 대비해 보면 뜻이 분명해집니다.'},

{tex:[
   {t:'M\\\\ \\\\text{는 상계} \\\\iff \\\\forall x\\\\in S,\\\\ x\\\\le M', s:'모든 원소보다 <b>크거나 같은</b> 수입니다.'},
   {t:'\\\\sup S = \\\\text{상계 가운데 가장 작은 것}', s:'그 가운데 <b>가장 낮은</b> 울타리입니다.'},
   {t:'\\\\sup\\\\{x:0\\\\le x<1\\\\}=1 \\\\notin S', s:'상한은 <b>집합 밖</b>에 있어도 됩니다.'}
  ],
  next:[
   {lv:'바로',   t:'상한 찾기', d:'여러 집합의 상한과 최댓값을 구하세요.'},
   {lv:'심화',   t:'완비성', d:'유리수에서 성립하지 않는 예를 만드세요.'},
   {lv:'프로젝트', t:'극한과 잇기', d:'상한이 수열의 극한과 어떻게 이어지는지 조사하세요.'}
  ],
  eq:'sup S = 상계 가운데 가장 작은 것',
  what:'「가장 큰 값이 없어도 경계는 있다」를 확인합니다.',
  probe:'열린 집합에서는 최댓값이 없는데도 상한이 있습니다.',
  link:'실수의 완비성이며, 극한이 존재하는 근거가 됩니다.'}
];`);
}

/* THUMBS */
{
  const key = s.match(/   '정렬된 자료와 거꾸로 된 자료의 막대 비교'\)\r?\n\];/);
  if (!key) throw new Error('THUMBS 끝 앵커 실패');
  s = s.replace(key[0], `   '정렬된 자료와 거꾸로 된 자료의 막대 비교'),

 svg(\`<g fill="none" stroke="\${TC.blue}" stroke-width="1.4">
   <rect x="18" y="16" width="84" height="18" rx="4"/>
   <rect x="18" y="40" width="84" height="18" rx="4"/></g>
   <rect x="18" y="64" width="84" height="20" rx="4" fill="\${TC.rose}" opacity=".25" stroke="\${TC.rose}" stroke-width="1.6"/>
   <text x="60" y="78" font-size="10" font-weight="800" fill="\${TC.rose}" text-anchor="middle">모순</text>
   <text x="60" y="29" font-size="9" fill="\${TC.ink3}" text-anchor="middle">√2 = p/q</text>\`,
   '가정에서 모순으로 이어지는 세 단계'),

 svg(\`<circle cx="42" cy="42" r="24" fill="\${TC.blue}" opacity=".22" stroke="\${TC.ink3}" stroke-width="1.2"/>
   <circle cx="72" cy="52" r="30" fill="\${TC.teal}" opacity=".18" stroke="\${TC.ink3}" stroke-width="1.2"/>
   <text x="34" y="34" font-size="10" font-weight="700" fill="\${TC.ink3}">p</text>
   <text x="92" y="40" font-size="10" font-weight="700" fill="\${TC.ink3}">q</text>
   <circle cx="92" cy="66" r="4" fill="\${TC.rose}"/>
   <text x="60" y="94" font-size="8" font-weight="800" fill="\${TC.rose}" text-anchor="middle">q 인데 p 아님</text>\`,
   'q 안에 있지만 p 밖에 있는 반례 점'),

 svg(\`<g stroke="\${TC.ink3}" stroke-width=".8" opacity=".35">
   <line x1="24" y1="20" x2="24" y2="80"/><line x1="48" y1="20" x2="48" y2="80"/>
   <line x1="72" y1="20" x2="72" y2="80"/><line x1="96" y1="20" x2="96" y2="80"/>
   <line x1="16" y1="28" x2="104" y2="28"/><line x1="16" y1="48" x2="104" y2="48"/>
   <line x1="16" y1="68" x2="104" y2="68"/></g>
   <path d="M24 28 L48 28 L24 48 L24 68 L48 48 L72 28 L96 28" stroke="\${TC.blue}" stroke-width="2" fill="none"/>
   <text x="60" y="96" font-size="8" font-weight="800" fill="\${TC.ink3}" text-anchor="middle">대각선으로 훑기</text>\`,
   '분수 격자를 대각선으로 지나가는 경로'),

 svg(\`<g font-size="11" font-family="monospace" fill="\${TC.ink3}">
   <text x="20" y="28">0.1415</text><text x="20" y="48">0.3333</text><text x="20" y="68">0.7071</text></g>
   <rect x="44" y="18" width="12" height="13" fill="\${TC.rose}" opacity=".3"/>
   <rect x="56" y="38" width="12" height="13" fill="\${TC.rose}" opacity=".3"/>
   <rect x="68" y="58" width="12" height="13" fill="\${TC.rose}" opacity=".3"/>
   <text x="20" y="88" font-size="11" font-family="monospace" fill="\${TC.teal}">0.688…</text>
   <text x="104" y="88" font-size="8" font-weight="800" fill="\${TC.teal}" text-anchor="end">새 수</text>\`,
   '대각선 자리를 바꿔 만든 새로운 수'),

 svg(\`<line x1="14" y1="56" x2="106" y2="56" stroke="\${TC.ink3}" stroke-width="1.2"/>
   <line x1="24" y1="56" x2="80" y2="56" stroke="\${TC.blue}" stroke-width="7"/>
   <circle cx="80" cy="56" r="6" fill="#fff" stroke="\${TC.blue}" stroke-width="2.4"/>
   <line x1="80" y1="24" x2="80" y2="76" stroke="\${TC.amber || TC.rose}" stroke-width="2" stroke-dasharray="3 3"/>
   <text x="80" y="18" font-size="9" font-weight="800" fill="\${TC.rose}" text-anchor="middle">sup</text>
   <text x="60" y="92" font-size="8" font-weight="800" fill="\${TC.ink3}" text-anchor="middle">최댓값 없음</text>\`,
   '끝이 열린 구간과 그 상한 표시')
];`);
}

new Function(s);
fs.writeFileSync(P, s);

{
  const C = 'src/55-catalog.js';
  let c = fs.readFileSync(C, 'utf8');
  const m = c.match(/(\{k:'disc',g:'이산 수학 · 정렬 경주'[^}]*\})(\r?\n\];)/);
  if (!m) throw new Error('LABCAT 끝 앵커 실패');
  c = c.replace(m[0], m[1] + `,
{k:'pure',g:'전문 수학 · 귀류법',b:'가정을 부정하지 않고 그대로 써 증명이 순환논법이 됨'},
{k:'pure',g:'전문 수학 · 추론의 형태',b:'후건긍정을 타당으로 판정해 잘못된 추론을 통과시킴'},
{k:'pure',g:'전문 수학 · 가산집합',b:'분모별로 차례대로 세어 첫 줄에서 끝나지 않아 번호가 안 붙음'},
{k:'pure',g:'전문 수학 · 대각선 논법',b:'대각선 숫자를 바꿀 때 9→0 처리를 안 해 만든 수가 목록에 이미 있음'},
{k:'pure',g:'전문 수학 · 상한과 하한',b:'최댓값이 없으면 상한도 없다고 표시해 상한을 못 찾음'}` + m[2]);
  fs.writeFileSync(C, c);
}
console.log('LAB 307~311 (전문 수학 A · 5종) 설치 완료');
