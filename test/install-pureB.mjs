// 전문 수학 B — LAB 312~316 (완비성·엡실론델타·균등연속·함수열·오일러 공식) 전 계층 설치
import fs from 'node:fs';
const P = 'src/40-demos.js';
let s = fs.readFileSync(P, 'utf8');
const NAMES = ['completeDemo', 'epsDeltaDemo', 'uniformContDemo', 'funcSeqDemo', 'eulerFormulaDemo'];
if (s.includes('function completeDemo')) throw new Error('이미 설치됨');
for (const n of NAMES) if (s.includes('function ' + n + '(')) throw new Error('이름 충돌: ' + n);

{ const i = s.indexOf('const LABS=[');
  s = s.slice(0, i) + '\n' + fs.readFileSync('algAO-demos.txt', 'utf8') + '\n' + s.slice(i); }

{ const key = ' build:supremumDemo}\n];';
  const i = s.indexOf(key);
  if (i < 0) throw new Error('LABS 끝 앵커 실패');
  s = s.slice(0, i) + ` build:supremumDemo},
{n:312,core:0,t:'“좁혀 가도 닿지 않는다” 유리수의 구멍',q:'분수만으로 수직선을 다 채울 수 있을까?',
 m:['완비성','구간 축소','무리수'],a:['실수의 구성','수치 해석'],
 note:'제곱이 2 를 사이에 두도록 구간을 좁혀 갑니다. 두 끝은 계속 유리수인데 다가가는 점은 유리수가 아닙니다.',
 build:completeDemo},
{n:313,core:0,t:'“ε 을 주면 δ 를 찾는다” 엡실론-델타',q:'「가까워진다」를 숫자로 어떻게 말할까?',
 m:['극한의 정의','엡실론-델타','부등식'],a:['수렴의 엄밀한 정의','오차 관리'],
 note:'먼저 ε 이 주어지고 그다음에 δ 를 고릅니다. 순서를 뒤집으면 정의가 무너집니다.',
 build:epsDeltaDemo},
{n:314,core:0,t:'“δ 가 점마다 달라도 될까” 균등연속',q:'연속과 균등연속은 무엇이 다를까?',
 m:['연속','균등연속','일양성'],a:['근사의 일양 오차','수치 안정성'],
 note:'같은 ε 에 대해 모든 점에서 통하는 하나의 δ 가 있으면 균등연속입니다.',
 build:uniformContDemo},
{n:315,core:0,t:'“점마다 0 인데 오차는 1” 함수열의 수렴',q:'점마다 수렴하면 전체도 수렴일까?',
 m:['각점수렴','균등수렴','최대 오차'],a:['근사의 일양 오차','반례 구성'],
 note:'xⁿ 은 각 점에서 0 으로 가지만 구간 전체의 최대 오차는 1 로 남습니다. 극한함수는 연속이 아닙니다.',
 build:funcSeqDemo},
{n:316,core:0,t:'“급수가 원을 그린다” 오일러 공식',q:'e^(iθ) 는 왜 원 위의 점일까?',
 m:['멱급수','복소수','삼각함수'],a:['복소 지수와 신호','회전 표현'],
 note:'e^x 의 급수에 x = iθ 를 넣으면 실수부가 cos, 허수부가 sin 이 됩니다.',
 build:eulerFormulaDemo}
];` + s.slice(i + key.length);
}

{
  const m = s.match(/const PROBLEMS=(\{.*?\});/);
  if (!m) throw new Error('PROBLEMS 앵커 실패');
  const PR = JSON.parse(m[1]);
  PR['312'] = { sit: '제곱이 2 에 가까운 분수를 계속 찾아 갑니다. 1.4, 1.41, 1.414 … 끝없이 좁혀집니다.',
    ask: '이 좁힘의 끝에 있는 점은 분수일까? 분수만으로 수직선이 다 채워질까?' };
  PR['313'] = { sit: '「x 가 1 에 가까워지면 f(x) 가 3 에 가까워진다」— 이 말을 숫자로 정확히 적어야 합니다.',
    ask: '「가까워진다」를 어떻게 재야 할까? 무엇을 먼저 정해야 할까?' };
  PR['314'] = { sit: '어떤 함수는 모든 점에서 연속인데, 점마다 필요한 δ 가 자꾸 작아져 하나로 정할 수 없다고 합니다.',
    ask: '「모든 점에서 연속」과 「하나의 δ 로 다 되는 것」은 다른 말일까?' };
  PR['315'] = { sit: 'xⁿ 은 0 과 1 사이의 어느 점에서든 0 으로 갑니다. 그런데 그래프는 계속 1 근처에서 치솟습니다.',
    ask: '점마다 0 으로 가는데 왜 그래프는 0 에 붙지 않을까?' };
  PR['316'] = { sit: 'e 의 지수에 허수를 넣는다는 말이 낯섭니다. 그런데 그 값이 원 위의 점이라고 합니다.',
    ask: '왜 하필 원일까? 급수로 펴 보면 무엇이 보일까?' };
  s = s.replace(m[0], 'const PROBLEMS=' + JSON.stringify(PR) + ';');

  const i0 = s.indexOf('const MISSIONS=');
  const mm = s.slice(i0).match(/^const MISSIONS=\{[\s\S]*?\n\};/);
  if (!mm) throw new Error('MISSIONS 앵커 실패');
  const M = new Function('return ' + mm[0].slice('const MISSIONS='.length, -1))();

  M['312'] = [
   {t:'1분 자유 탐색 — 좁힌 횟수를 늘려 보세요. 띠가 어떻게 되나요?'},
   {t:'오늘의 문제 — 좁힌 횟수를 16 으로 올리세요. 두 끝이 어떤 수인가요?',
    re:'두 끝은 계속 유리수입니다',
    do:'① 횟수를 16 으로 ② 두 끝의 값 읽기 ③ 구간의 길이 확인',
    hand:'각 끝을 분수로 쓸 수 있는지 따져 보기'},
   {t:'유리수만 있다면 — 「유리수만 있는 세계로 보기」를 켜세요.',
    re:'수직선에 구멍이 뚫려 있습니다',
    do:'① 체크 켜기 ② 붉은 선 위의 글 읽기 ③ 좁힘의 끝을 생각하기',
    hand:'√2 가 유리수가 아님을 LAB 307 로 되짚기'},
   {t:'(횟수, 두 끝, 구간의 길이) 를 여섯 줄 기록하세요.'},
   {t:'심화 — 완비성 공리: 「좁혀 가는 닫힌 구간열에는 공통점이 반드시 있다」와 「위로 유계인 집합에는 상한이 있다」가 같은 말임을 설명하고, 유리수에서 왜 깨지는지 밝히세요.'}];

  M['313'] = [
   {t:'1분 자유 탐색 — 두 슬라이더를 움직여 보세요. 언제 「통합니다」가 되나요?'},
   {t:'오늘의 문제 — ε 을 0.10 으로 줄이고 δ 를 0.04 로 맞추세요.',
    re:'이것이 「가까워진다」의 뜻입니다',
    do:'① ε 을 0.10 으로 ② δ 를 0.04 로 ③ 판정 확인',
    hand:'|f(x) − 3| = 2|x − 1| 을 써서 필요한 δ 를 구하기'},
   {t:'δ 를 고정하면 — 「δ 를 ε 과 무관하게 0.5 로 고정」을 켜세요.',
    re:'δ 는 ε 을 보고 골라야 합니다',
    do:'① 체크 켜기 ② ε 을 줄여 보기 ③ 판정이 어떻게 되는지 보기',
    hand:'ε 이 얼마보다 작아지면 무너지는지 계산'},
   {t:'(ε, δ, 최대 오차, 통하는가) 를 여섯 줄 기록하세요.'},
   {t:'심화 — 정의 쓰기: 「lim(x→a) f(x) = L」의 ε-δ 정의를 정확히 적고, ∀ε ∃δ 의 순서를 뒤집으면 어떤 다른 뜻이 되는지 설명하세요.'}];

  M['314'] = [
   {t:'1분 자유 탐색 — 점을 옮겨 보세요. 파랑 띠의 폭이 어떻게 되나요?'},
   {t:'오늘의 문제 — 점 x 를 0.10 으로 옮기세요. δ 가 달라지나요?',
    re:'하나의 δ 로 온 구간을 덮을 수 있습니다',
    do:'① x 를 0.10 으로 ② δ 값 확인 ③ x 를 0.9 로 옮겨 견주기',
    hand:'f(x) = 2x 에서 필요한 δ 를 식으로 구하기'},
   {t:'함수를 바꾸면 — 함수를 1/x 로 바꾸세요 (x 는 0.10 그대로).',
    re:'모든 점에 통하는 하나의 δ 가 없습니다',
    do:'① 함수를 1/x 로 ② δ 값 확인 ③ x 를 더 왼쪽으로 옮겨 보기',
    hand:'x 가 0 에 가까워질 때 δ 가 어떻게 되는지 어림'},
   {t:'(함수, x, ε, 통하는 δ) 를 여섯 줄 기록하세요.'},
   {t:'심화 — 닫힌 구간의 힘: 「닫힌 유계 구간에서 연속이면 균등연속이다」를 조사하고, 1/x 의 정의역을 [0.1, 1] 로 바꾸면 왜 균등연속이 되는지 설명하세요.'}];

  M['315'] = [
   {t:'1분 자유 탐색 — n 을 키워 보세요. 곡선이 어떻게 눕나요?'},
   {t:'오늘의 문제 — n 을 40 으로 올리세요. 살펴보는 점에서의 값이 얼마인가요?',
    re:'각점수렴입니다',
    do:'① n 을 40 으로 ② 그 점의 값 읽기 ③ 다른 점에서도 해 보기',
    hand:'0.5⁴⁰ 을 어림해 보기'},
   {t:'전체를 보면 — 「최대 오차를 함께 보기」를 켜세요. 오차가 줄었나요?',
    re:'균등수렴은 아닙니다',
    do:'① 체크 켜기 ② 최대 오차 확인 ③ n 을 더 키워도 그대로인지 보기',
    hand:'x = 0.99 에서 xⁿ 이 얼마인지 계산해 보기'},
   {t:'(n, 그 점의 값, 최대 오차) 를 여섯 줄 기록하세요.'},
   {t:'심화 — 연속의 보존: 균등수렴이면 극한함수도 연속이라는 정리를 조사하고, xⁿ 의 극한함수가 x = 1 에서 끊어지는 것이 왜 균등수렴이 아님을 뜻하는지 설명하세요.'}];

  M['316'] = [
   {t:'1분 자유 탐색 — 항 수를 늘려 보세요. 붉은 점이 어디로 가나요?'},
   {t:'오늘의 문제 — 항 수를 12 로 올리세요. 두 점이 겹치나요?',
    re:'크기가 정확히 1 인 원 위의 점이 되었습니다',
    do:'① 항 수를 12 로 ② 오차 값 읽기 ③ 크기가 1 인지 확인',
    hand:'급수의 짝수 항과 홀수 항을 따로 모아 보기'},
   {t:'뒤바꾸면 — 「실수부와 허수부를 바꿔 넣기」를 켜세요.',
    re:'어느 쪽이 cos 인지가 중요합니다',
    do:'① 체크 켜기 ② 점의 위치 보기 ③ 각을 늘려 방향 확인',
    hand:'cos 와 sin 을 맞바꾸면 어떤 대칭이 되는지 적기'},
   {t:'(각, 항 수, 급수 값, 오차) 를 여섯 줄 기록하세요.'},
   {t:'심화 — 오일러 항등식: θ = π 를 넣어 e^(iπ) + 1 = 0 을 얻고, 이 식에 등장하는 다섯 수(0, 1, i, π, e)가 각각 어디서 왔는지 정리하세요.'}];

  s = s.slice(0, i0) + 'const MISSIONS=' + JSON.stringify(M, null, 1) + ';' + s.slice(i0 + mm[0].length);

  const PR2 = JSON.parse(s.match(/const PROBLEMS=(\{.*?\});/)[1]);
  const labsBlock = s.slice(s.indexOf('const LABS=['), s.indexOf('const THUMBS ='));
  const demoSrc = fs.readFileSync('algAO-demos.txt', 'utf8');
  let bad = 0;
  ['312', '313', '314', '315', '316'].forEach((k, ki) => {
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
  const key = s.match(/  link:'실수의 완비성이며, 극한이 존재하는 근거가 됩니다\.'\}\r?\n\];/);
  if (!key) throw new Error('PRINS 끝 앵커 실패');
  s = s.replace(key[0], `  link:'실수의 완비성이며, 극한이 존재하는 근거가 됩니다.'},

{tex:[
   {t:'a_n^{2}<2<b_n^{2},\\\\quad b_n-a_n\\\\to 0', s:'구간을 <b>끝없이</b> 좁혀 갑니다.'},
   {t:'a_n,\\\\ b_n\\\\in\\\\mathbb{Q}\\\\ \\\\text{인데}\\\\ \\\\lim a_n=\\\\sqrt{2}\\\\notin\\\\mathbb{Q}', s:'두 끝은 유리수인데 <b>다가가는 점</b>은 아닙니다.'},
   {t:'\\\\mathbb{R}\\\\ \\\\text{는 완비} \\\\iff \\\\text{그 점이 반드시 있다}', s:'실수는 <b>구멍이 없도록</b> 만든 것입니다.'}
  ],
  next:[
   {lv:'바로',   t:'좁혀 보기', d:'구간을 좁히며 두 끝을 적어 보세요.'},
   {lv:'심화',   t:'같은 말', d:'상한 존재와 구간 축소가 같은 말임을 보이세요.'},
   {lv:'프로젝트', t:'실수 만들기', d:'데데킨트 절단으로 실수를 만드는 방법을 조사하세요.'}
  ],
  eq:'유리수는 완비가 아니다',
  what:'수직선이 <b>빈틈없이 채워져 있다</b>는 것이 약속임을 확인합니다.',
  probe:'구간이 한없이 좁아져도 두 끝은 계속 유리수입니다.',
  link:'상한(LAB 311)의 다른 얼굴이며, 극한의 존재를 떠받칩니다.'},

{tex:[
   {t:'\\\\forall\\\\varepsilon>0\\\\ \\\\exists\\\\delta>0:\\\\ 0<|x-a|<\\\\delta \\\\Rightarrow |f(x)-L|<\\\\varepsilon', s:'<b>ε 이 먼저</b>, δ 가 나중입니다.'},
   {t:'|2x+1-3|=2|x-1|', s:'오차를 <b>거리로</b> 바꿔 씁니다.'},
   {t:'\\\\delta=\\\\frac{\\\\varepsilon}{2}\\\\ \\\\Rightarrow\\\\ \\\\text{언제나 통한다}', s:'ε 을 보고 δ 를 <b>만들어</b> 냅니다.'}
  ],
  next:[
   {lv:'바로',   t:'δ 찾기', d:'여러 ε 에 대해 통하는 δ 를 구하세요.'},
   {lv:'심화',   t:'식으로', d:'δ = ε/2 를 부등식으로 유도하세요.'},
   {lv:'프로젝트', t:'다른 함수로', d:'x² 의 극한을 ε-δ 로 증명해 보세요.'}
  ],
  eq:'∀ε ∃δ : |x − a| < δ ⇒ |f(x) − L| < ε',
  what:'애매한 말을 <b>검증 가능한 조건</b>으로 바꾸는 훈련입니다.',
  probe:'δ 를 고정해 두면 ε 을 줄이는 순간 무너집니다.',
  link:'극한(LAB 127)을 엄밀하게 다시 정의하는 자리입니다.'},

{tex:[
   {t:'\\\\text{연속}:\\\\ \\\\forall a\\\\ \\\\forall\\\\varepsilon\\\\ \\\\exists\\\\delta(a,\\\\varepsilon)', s:'δ 가 <b>점마다</b> 달라도 됩니다.'},
   {t:'\\\\text{균등연속}:\\\\ \\\\forall\\\\varepsilon\\\\ \\\\exists\\\\delta\\\\ \\\\forall a', s:'δ 가 <b>점과 무관</b>해야 합니다.'},
   {t:'f(x)=\\\\frac{1}{x}\\\\ \\\\text{on}\\\\ (0,1]\\\\ \\\\text{는 균등연속이 아니다}', s:'왼쪽으로 갈수록 δ 가 <b>0 으로</b> 줄어듭니다.'}
  ],
  next:[
   {lv:'바로',   t:'δ 재기', d:'점을 옮기며 필요한 δ 를 재세요.'},
   {lv:'심화',   t:'순서의 뜻', d:'∀ 와 ∃ 의 순서 차이를 설명하세요.'},
   {lv:'프로젝트', t:'닫힌 구간', d:'정의역을 닫으면 왜 균등연속이 되는지 조사하세요.'}
  ],
  eq:'δ 가 점에 의존하는가, 하지 않는가',
  what:'수식의 <b>기호 순서</b>가 뜻을 통째로 바꾼다는 것을 봅니다.',
  probe:'1/x 에서는 왼쪽으로 갈수록 δ 가 0 에 붙습니다.',
  link:'엡실론-델타(LAB 313)의 바로 다음 단계입니다.'},

{tex:[
   {t:'f_n(x)=x^{n}\\\\ \\\\to\\\\ 0\\\\quad(0\\\\le x<1)', s:'각 점에서는 <b>0 으로</b> 갑니다.'},
   {t:'\\\\sup_{0\\\\le x<1}\\\\left|x^{n}-0\\\\right|=1', s:'그런데 <b>최대 오차</b>는 1 그대로입니다.'},
   {t:'\\\\lim f_n\\\\ \\\\text{는 } x=1 \\\\text{ 에서 불연속}', s:'균등수렴이 아니면 <b>연속이 보존되지 않습니다</b>.'}
  ],
  next:[
   {lv:'바로',   t:'값 재기', d:'여러 점에서 xⁿ 을 재어 보세요.'},
   {lv:'심화',   t:'최대 오차', d:'sup 가 왜 1 인지 설명하세요.'},
   {lv:'프로젝트', t:'균등한 예', d:'균등수렴하는 함수열을 하나 만들어 보세요.'}
  ],
  eq:'각점수렴 ≠ 균등수렴',
  what:'「점마다 참」과 「전체에서 참」이 <b>다른 말</b>임을 확인합니다.',
  probe:'n 을 아무리 키워도 1 근처의 오차는 줄지 않습니다.',
  link:'균등연속(LAB 314)과 같은 「일양성」의 문제입니다.'},

{tex:[
   {t:'e^{z}=\\\\sum_{n=0}^{\\\\infty}\\\\frac{z^{n}}{n!}', s:'지수함수를 <b>급수</b>로 정의합니다.'},
   {t:'e^{i\\\\theta}=\\\\left(1-\\\\frac{\\\\theta^{2}}{2!}+\\\\cdots\\\\right)+i\\\\left(\\\\theta-\\\\frac{\\\\theta^{3}}{3!}+\\\\cdots\\\\right)', s:'실수부가 <b>cos</b>, 허수부가 <b>sin</b> 입니다.'},
   {t:'e^{i\\\\theta}=\\\\cos\\\\theta+i\\\\sin\\\\theta,\\\\quad \\\\left|e^{i\\\\theta}\\\\right|=1', s:'그래서 언제나 <b>단위원 위</b>입니다.'}
  ],
  next:[
   {lv:'바로',   t:'항 늘리기', d:'항을 늘리며 오차를 재세요.'},
   {lv:'심화',   t:'급수 나누기', d:'짝수 항과 홀수 항을 따로 모아 보세요.'},
   {lv:'프로젝트', t:'항등식', d:'e^(iπ) + 1 = 0 의 다섯 수를 정리하세요.'}
  ],
  eq:'e^{iθ} = cos θ + i sin θ',
  what:'서로 멀어 보이던 <b>지수와 삼각함수</b>가 만나는 자리입니다.',
  probe:'항을 늘리면 급수의 점이 정확히 단위원 위에 앉습니다.',
  link:'복소평면(LAB 94)과 테일러 급수(LAB 23)를 잇습니다.'}
];`);
}

/* THUMBS */
{
  const key = s.match(/   '끝이 열린 구간과 그 상한 표시'\)\r?\n\];/);
  if (!key) throw new Error('THUMBS 끝 앵커 실패');
  s = s.replace(key[0], `   '끝이 열린 구간과 그 상한 표시'),

 svg(\`<g stroke="\${TC.blue}" stroke-width="4" opacity=".8">
   <line x1="18" y1="24" x2="102" y2="24"/><line x1="40" y1="40" x2="86" y2="40"/>
   <line x1="52" y1="56" x2="74" y2="56"/><line x1="58" y1="72" x2="66" y2="72"/></g>
   <line x1="62" y1="16" x2="62" y2="82" stroke="\${TC.rose}" stroke-width="1.6" stroke-dasharray="3 3"/>
   <text x="62" y="96" font-size="8" font-weight="800" fill="\${TC.rose}" text-anchor="middle">√2</text>\`,
   '점점 좁아지는 구간과 그 안의 한 점'),

 svg(\`<rect x="14" y="36" width="92" height="26" fill="\${TC.rose}" opacity=".14"/>
   <rect x="44" y="14" width="32" height="70" fill="\${TC.blue}" opacity=".14"/>
   <line x1="10" y1="72" x2="110" y2="20" stroke="\${TC.ink3}" stroke-width="2"/>
   <circle cx="60" cy="49" r="4.4" fill="\${TC.teal}"/>
   <text x="103" y="34" font-size="9" font-weight="800" fill="\${TC.rose}" text-anchor="end">ε</text>
   <text x="60" y="96" font-size="8" font-weight="800" fill="\${TC.blue}" text-anchor="middle">δ</text>\`,
   'ε 띠와 δ 띠가 겹친 그림'),

 svg(\`<path d="M20 78 C34 78 40 20 96 16" stroke="\${TC.ink3}" stroke-width="2" fill="none"/>
   <rect x="22" y="14" width="6" height="70" fill="\${TC.blue}" opacity=".3"/>
   <rect x="72" y="14" width="26" height="70" fill="\${TC.blue}" opacity=".3"/>
   <text x="60" y="96" font-size="8" font-weight="800" fill="\${TC.ink3}" text-anchor="middle">δ 가 점마다 다르다</text>\`,
   '왼쪽에서 좁아지는 δ 띠'),

 svg(\`<g stroke="\${TC.ink3}" stroke-width="1" opacity=".35" fill="none">
   <path d="M18 78 L98 18"/><path d="M18 78 C60 76 84 62 98 18"/>
   <path d="M18 78 C74 78 92 72 98 18"/></g>
   <path d="M18 78 C86 78 96 76 98 18" stroke="\${TC.blue}" stroke-width="2.4" fill="none"/>
   <line x1="98" y1="18" x2="98" y2="78" stroke="\${TC.rose}" stroke-width="2.6"/>
   <text x="60" y="96" font-size="8" font-weight="800" fill="\${TC.rose}" text-anchor="middle">최대 오차 1</text>\`,
   '점점 눕지만 끝에서 치솟는 xⁿ 곡선들'),

 svg(\`<circle cx="60" cy="46" r="32" fill="none" stroke="\${TC.ink3}" stroke-width="1.4"/>
   <line x1="60" y1="46" x2="88" y2="30" stroke="\${TC.teal}" stroke-width="2.4"/>
   <circle cx="88" cy="30" r="4.4" fill="\${TC.teal}"/>
   <path d="M60 46 L70 46 L76 38 L82 34 L88 30" stroke="\${TC.rose}" stroke-width="1.6" fill="none"/>
   <text x="60" y="94" font-size="8" font-weight="800" fill="\${TC.ink3}" text-anchor="middle">e^{iθ}</text>\`,
   '단위원 위로 다가가는 급수의 자취')
];`);
}

new Function(s);
fs.writeFileSync(P, s);

{
  const C = 'src/55-catalog.js';
  let c = fs.readFileSync(C, 'utf8');
  const m = c.match(/(\{k:'pure',g:'전문 수학 · 상한과 하한'[^}]*\})(\r?\n\];)/);
  if (!m) throw new Error('LABCAT 끝 앵커 실패');
  c = c.replace(m[0], m[1] + `,
{k:'pure',g:'전문 수학 · 완비성',b:'유리수 근사를 계속 좁혀도 극한이 유리수라고 표시해 구멍이 안 보임'},
{k:'pure',g:'전문 수학 · 엡실론-델타',b:'δ 를 ε 과 무관하게 고정해 ε 을 줄여도 조건이 계속 만족한다고 나옴'},
{k:'pure',g:'전문 수학 · 균등연속',b:'점마다 δ 를 새로 잡고도 균등연속이라 표시해 차이가 안 드러남'},
{k:'pure',g:'전문 수학 · 함수열의 수렴',b:'최대 오차를 재지 않고 몇 점만 봐 두 수렴이 같아 보임'},
{k:'pure',g:'전문 수학 · 오일러 공식',b:'실수부와 허수부에 cos·sin 을 뒤바꿔 넣어 점이 반대로 돎'}` + m[2]);
  fs.writeFileSync(C, c);
}
console.log('LAB 312~316 (전문 수학 B · 5종) 설치 완료');
