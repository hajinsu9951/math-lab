// 수학과 문화 C — LAB 242~246 (진법·마방진·원주율·배분·암호) 전 계층 설치
import fs from 'node:fs';
const P = 'src/40-demos.js';
let s = fs.readFileSync(P, 'utf8');
const NAMES = ['baseDemo', 'magicDemo', 'piPolyDemo', 'apportionDemo', 'cipherDemo'];
if (s.includes('function baseDemo')) throw new Error('이미 설치됨');
for (const n of NAMES) if (s.includes('function ' + n + '(')) throw new Error('이름 충돌: ' + n);

/* 데모 본문 */
{ const i = s.indexOf('const LABS=[');
  s = s.slice(0, i) + '\n' + fs.readFileSync('algAA-demos.txt', 'utf8') + '\n' + s.slice(i); }

/* LABS */
{ const key = ' build:weekdayDemo}\n];';
  const i = s.indexOf(key);
  if (i < 0) throw new Error('LABS 끝 앵커 실패');
  s = s.slice(0, i) + ` build:weekdayDemo},
{n:242,core:0,t:'“시계는 왜 60 일까” 진법과 자릿값',q:'같은 수를 다르게 쓰면 무엇이 달라질까?',
 m:['진법 변환','자릿값','로그'],a:['컴퓨터 표현','시간과 각도'],
 note:'b 진법은 b 로 나눈 나머지를 거꾸로 읽는 것입니다. 밑이 클수록 표기는 짧아지고 기호는 많아집니다.',
 build:baseDemo},
{n:243,core:0,t:'“모든 줄의 합이 같게” 마방진',q:'한 줄의 합은 왜 미리 정해질까?',
 m:['등차수열의 합','조합적 구성','불변량'],a:['퍼즐 설계','격자 배치'],
 note:'1부터 n²까지의 합을 n 줄로 나누면 한 줄의 합이 정해집니다. 두 수만 바꿔도 여러 줄이 함께 어긋납니다.',
 build:magicDemo},
{n:244,core:0,t:'“안팎에서 조여 오는 수” 원주율의 역사',q:'π 의 값을 어떻게 확신할 수 있을까?',
 m:['삼각비','부등식','극한'],a:['수치 해석','고대 수학'],
 note:'내접과 외접 다각형의 둘레가 π 를 위아래에서 가둡니다. 변을 늘리면 두 값이 한 곳으로 모입니다.',
 build:piPolyDemo},
{n:245,core:0,t:'“하나 늘렸는데 줄어든다” 의석 배분의 역설',q:'공정한 나눔은 하나뿐일까?',
 m:['비례배분','반올림','최적화'],a:['선거 제도','자원 배분'],
 note:'소수로 나온 몫을 정수로 만드는 방법이 여럿이고, 방법마다 지키는 공정함이 다릅니다.',
 build:apportionDemo},
{n:246,core:0,t:'“가장 잦은 글자” 암호와 빈도분석',q:'열쇠를 모르고도 풀 수 있을까?',
 m:['합동식','통계적 분포','주기'],a:['정보 보안','고전 암호'],
 note:'한 칸씩 미는 암호는 글자마다의 횟수를 그대로 남깁니다. 열쇠를 길게 하면 그 흔적이 흐려집니다.',
 build:cipherDemo}
];` + s.slice(i + key.length);
}

/* PROBLEMS · MISSIONS */
{
  const m = s.match(/const PROBLEMS=(\{.*?\});/);
  if (!m) throw new Error('PROBLEMS 앵커 실패');
  const PR = JSON.parse(m[1]);
  PR['242'] = { sit: '길이는 10 씩 묶어 재는데, 시간은 60 초가 1 분이고 각도는 60 분이 1 도입니다.',
    ask: '왜 여기만 10 이 아닐까? 수를 쓰는 방식이 달라지면 무엇이 달라질까?' };
  PR['243'] = { sit: '3×3 칸에 1 부터 9 까지를 한 번씩 넣어 가로·세로·대각선의 합을 모두 같게 만들라는 문제를 받았습니다.',
    ask: '그 합은 몇이 되어야 할까? 답을 찾기 전에 미리 알 수 있을까?' };
  PR['244'] = { sit: '고대에는 계산기가 없었는데도 π 를 소수 둘째 자리까지 정확히 알고 있었습니다.',
    ask: '자와 컴퍼스만으로 그 값을 어떻게 확신했을까?' };
  PR['245'] = { sit: '세 지역의 인구에 비례해 의석을 나누려는데 몫이 5.571, 5.571, 1.857 처럼 소수로 나왔습니다.',
    ask: '남는 소수는 누구에게 줄까? 전체 의석을 하나 늘리면 모두에게 이득일까?' };
  PR['246'] = { sit: '카이사르는 글자를 세 칸씩 밀어 편지를 썼습니다. 열쇠를 모르는 사람은 읽을 수 없다고 믿었습니다.',
    ask: '정말 못 읽을까? 열쇠 없이도 풀 실마리가 글 안에 남아 있지는 않을까?' };
  s = s.replace(m[0], 'const PROBLEMS=' + JSON.stringify(PR) + ';');

  const i0 = s.indexOf('const MISSIONS=');
  const mm = s.slice(i0).match(/^const MISSIONS=\{[\s\S]*?\n\};/);
  if (!mm) throw new Error('MISSIONS 앵커 실패');
  const M = new Function('return ' + mm[0].slice('const MISSIONS='.length, -1))();

  M['242'] = [
   {t:'1분 자유 탐색 — 진법을 바꿔 보세요. 표기와 자릿수가 어떻게 달라지나요?'},
   {t:'오늘의 문제 — 진법을 60 으로 바꾸세요. 754 라는 수가 무엇으로 읽히나요?',
    re:'그대로 시·분·초',
    do:'① 진법을 60 으로 ② 두 자리 표기 확인 ③ 시·분·초와 견주기',
    hand:'754 ÷ 60 의 몫과 나머지를 손으로 계산'},
   {t:'짧아지고 길어지고 — 수를 2048 로 올리고 진법을 2 로 바꾸세요. 자릿수가 몇 자리인가요?',
    re:'자릿수는 밑이 작을수록',
    do:'① 수를 2048 로 ② 진법을 2 로 ③ 자릿수 읽기',
    hand:'2¹¹ = 2048 임을 이용해 자릿수를 예측'},
   {t:'(수, 밑, 표기, 자릿수) 를 여섯 줄 기록하세요.'},
   {t:'심화 — 자릿수의 규칙: 자릿수가 대략 log_b N + 1 임을 설명하고, 같은 수를 2 진법과 16 진법으로 쓸 때 자릿수의 비가 왜 4 에 가까운지 밝히세요.'}];

  M['243'] = [
   {t:'1분 자유 탐색 — 칸 수를 바꿔 보세요. 어떤 줄이 초록이고 어떤 줄이 붉은가요?'},
   {t:'오늘의 문제 — 칸 수를 5 로 맞추세요. 모든 줄의 합이 같아졌나요?',
    re:'오른쪽 위로 한 칸씩',
    do:'① 칸 수를 5 로 ② 줄의 합 확인 ③ 1 부터 25 의 자리 흐름 보기',
    hand:'5(25+1)/2 를 계산해 화면 값과 맞춰 보기'},
   {t:'한 쌍만 바꾸면 — 「두 수 맞바꿔 보기」를 누르세요. 몇 줄이 어긋나나요?',
    re:'그만큼 빡빡한 조건',
    do:'① 버튼 누르기 ② 붉은 수 세기 ③ 되돌리기로 비교',
    hand:'맞바꾼 두 수가 걸쳐 있는 줄을 모두 세어 보기'},
   {t:'(n, 전체 합, 한 줄 합, 맞는 줄) 을 여섯 줄 기록하세요.'},
   {t:'심화 — 식의 유도: 1 + 2 + … + n² = n²(n²+1)/2 를 n 줄로 나누어 한 줄의 합이 n(n²+1)/2 임을 보이고, n = 3, 4, 5 의 값을 각각 구하세요.'}];

  M['244'] = [
   {t:'1분 자유 탐색 — 변의 수를 늘려 보세요. 오른쪽 띠가 어떻게 되나요?'},
   {t:'오늘의 문제 — 외접 다각형도 함께 보기를 켜세요. 참값이 어디에 있다고 말할 수 있나요?',
    re:'안팎에서 함께 조이면',
    do:'① 체크 켜기 ② 두 값 확인 ③ 띠의 위아래 끝 읽기',
    hand:'6·sin30° 와 6·tan30° 을 계산해 3.14 와 견주기'},
   {t:'조여 가기 — 변의 수를 96 까지 올리세요. 구간 폭이 얼마가 되나요?',
    re:'아르키메데스가 96각형에서 멈춘',
    do:'① 변의 수를 96 으로 ② 구간 폭 읽기 ③ 확정되는 자리 세기',
    hand:'두 값이 몇째 자리까지 같은지 손으로 표시'},
   {t:'(변의 수, 내접, 외접, 구간 폭) 을 여섯 줄 기록하세요.'},
   {t:'심화 — 왜 같은 곳으로 가나: n → ∞ 일 때 n·sin(π/n) 과 n·tan(π/n) 이 모두 π 로 감을 보이고, 구간 폭이 대략 몇 제곱으로 줄어드는지 어림하세요.'}];

  M['245'] = [
   {t:'1분 자유 탐색 — 의석 수를 옮겨 보세요. 두 막대가 어떻게 달라지나요?'},
   {t:'오늘의 문제 — 전체 의석을 10 으로 맞추세요. 11 석일 때와 견주면 무엇이 이상한가요?',
    re:'알라바마 역설',
    do:'① 의석을 10 으로 ② 왼쪽·오른쪽 막대 비교 ③ 줄어든 지역 찾기',
    hand:'10 석과 11 석의 정확한 몫을 손으로 계산해 잉여를 비교'},
   {t:'다른 방법으로 — 「나눗셈식(동트)으로 배분」을 누르세요. 역전이 그대로인가요?',
    re:'늘렸는데 줄어드는 일이 생기지 않습니다',
    do:'① 버튼 누르기 ② 두 막대 비교 ③ 최대잉여식과 견주기',
    hand:'인구를 1, 2, 3, … 으로 나눈 표를 만들어 큰 순서로 의석을 배정'},
   {t:'(의석, 가·나·다 배분, 역설 여부) 를 여섯 줄 기록하세요.'},
   {t:'심화 — 완벽한 방법은 없다: 어떤 배분 방식도 몫의 보존·단조성·인구 단조성을 동시에 만족할 수 없다는 사실을 조사해, 우리 선거 제도가 무엇을 골랐는지 한 문단으로 쓰세요.'}];

  M['246'] = [
   {t:'1분 자유 탐색 — 이동값을 바꿔 보세요. 막대의 모양이 달라지나요?'},
   {t:'오늘의 문제 — 「빈도로 깨 보기」를 누르세요. 열쇠를 모르는 사람이 무엇을 알아낼까요?',
    re:'한 칸씩 미는 암호는 이렇게 무너집니다',
    do:'① 버튼 누르기 ② 가장 높은 막대 확인 ③ 추정 이동값과 실제 k 비교',
    hand:'가장 잦은 글자에서 e 까지의 거리를 세어 이동값을 구하기'},
   {t:'열쇠를 늘리면 — 열쇠 글자 수를 4 로 올리세요. 막대 모양이 어떻게 되나요?',
    re:'막대가 고르게 펴집니다',
    do:'① 열쇠 글자 수를 4 로 ② 막대 높이 비교 ③ 추정값이 맞는지 확인',
    hand:'평균 대비 배수가 얼마나 줄었는지 적기'},
   {t:'(이동값, 열쇠 글자 수, 최빈 글자, 추정 이동값) 을 여섯 줄 기록하세요.'},
   {t:'심화 — 안전의 두 축: 시저 암호의 열쇠는 26 가지, 열쇠 L 글자의 비즈네르는 26^L 가지입니다. 가짓수가 늘어도 통계적 흔적이 남으면 왜 위험한지 설명하세요.'}];

  s = s.slice(0, i0) + 'const MISSIONS=' + JSON.stringify(M, null, 1) + ';' + s.slice(i0 + mm[0].length);

  /* 자기일치 감사 — 화면의 다른 글·데모 본문과 겹치면 열자마자 켜진다 */
  const PR2 = JSON.parse(s.match(/const PROBLEMS=(\{.*?\});/)[1]);
  const labsBlock = s.slice(s.indexOf('const LABS=['), s.indexOf('const THUMBS ='));
  const demoSrc = fs.readFileSync('algAA-demos.txt', 'utf8');
  let bad = 0;
  const KEYS = ['242', '243', '244', '245', '246'];
  KEYS.forEach((k, ki) => {
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
  const key = s.match(/  link:'나머지 연산\(LAB 14\)의 생활 응용이며, 주기성의 좋은 사례입니다\.'\}\r?\n\];/);
  if (!key) throw new Error('PRINS 끝 앵커 실패');
  s = s.replace(key[0], `  link:'나머지 연산(LAB 14)의 생활 응용이며, 주기성의 좋은 사례입니다.'},

{tex:[
   {t:'N=\\\\sum_{i=0}^{m} d_i\\\\,b^{\\\\,i}\\\\quad(0\\\\le d_i<b)', s:'b 진법 표기는 <b>자릿값의 합</b>이라는 약속입니다.'},
   {t:'754=12\\\\times 60+34', s:'60 진법으로 쓰면 그대로 <b>12분 34초</b>가 됩니다.'},
   {t:'\\\\text{자릿수}=\\\\lfloor \\\\log_b N\\\\rfloor+1', s:'밑이 작을수록 자릿수가 <b>빠르게</b> 늘어납니다.'}
  ],
  next:[
   {lv:'바로',   t:'표기 비교', d:'같은 수를 2·8·16·60 진법으로 써 보세요.'},
   {lv:'심화',   t:'자릿수 예측', d:'log 를 써서 자릿수를 미리 계산하세요.'},
   {lv:'프로젝트', t:'색 코드 읽기', d:'#RRGGBB 를 10 진법으로 옮겨 색을 설계하세요.'}
  ],
  eq:'N = Σ dᵢ bⁱ · 자릿수 ≈ log_b N + 1',
  what:'수를 쓰는 방식이 <b>약속</b>일 뿐임을 확인하는 실험입니다.',
  probe:'밑을 바꾸면 값은 그대로인데 표기와 자릿수만 달라집니다.',
  link:'로그(LAB 12)와 나머지 연산(LAB 14)을 자릿값으로 잇습니다.'},

{tex:[
   {t:'1+2+\\\\cdots+n^2=\\\\frac{n^2(n^2+1)}{2}', s:'쓰는 수가 정해져 있으니 <b>전체 합</b>이 먼저 정해집니다.'},
   {t:'\\\\text{한 줄의 합}=\\\\frac{n(n^2+1)}{2}', s:'전체 합을 n 줄로 나누면 <b>한 줄의 합</b>이 나옵니다.'},
   {t:'n=3\\\\Rightarrow 15,\\\\quad n=4\\\\Rightarrow 34,\\\\quad n=5\\\\Rightarrow 65', s:'답을 찾기 전에 <b>목표값</b>을 알 수 있습니다.'}
  ],
  next:[
   {lv:'바로',   t:'목표값 계산', d:'n = 6, 7 의 한 줄 합을 미리 구하세요.'},
   {lv:'심화',   t:'어긋난 줄 세기', d:'두 수를 바꿨을 때 어긋나는 줄 수를 예측하세요.'},
   {lv:'프로젝트', t:'짝수 칸 도전', d:'4×4 마방진을 완성하는 방법을 찾아 설명하세요.'}
  ],
  eq:'한 줄의 합 = n(n² + 1) / 2',
  what:'답을 찾기 전에 <b>답의 성질</b>부터 알아내는 사고를 연습합니다.',
  probe:'두 수를 맞바꾸면 그 수가 걸친 줄이 한꺼번에 어긋납니다.',
  link:'등차수열의 합(LAB 11)의 응용이며, 불변량 사고의 좋은 입구입니다.'},

{tex:[
   {t:'n\\\\sin\\\\frac{180^\\\\circ}{n}<\\\\pi<n\\\\tan\\\\frac{180^\\\\circ}{n}', s:'참값을 <b>위아래에서</b> 가두는 부등식입니다.'},
   {t:'\\\\lim_{n\\\\to\\\\infty} n\\\\sin\\\\frac{\\\\pi}{n}=\\\\pi', s:'변을 늘리면 안쪽 값이 <b>π 로</b> 갑니다.'},
   {t:'n\\\\tan\\\\frac{\\\\pi}{n}-n\\\\sin\\\\frac{\\\\pi}{n}\\\\to 0', s:'구간의 폭이 <b>0 으로</b> 줄어 값이 확정됩니다.'}
  ],
  next:[
   {lv:'바로',   t:'6각형 계산', d:'6·sin30° 과 6·tan30° 을 손으로 구하세요.'},
   {lv:'심화',   t:'폭의 감소', d:'변의 수를 2배로 하면 폭이 몇 배가 되는지 재세요.'},
   {lv:'프로젝트', t:'π 구하기', d:'배각 공식으로 96각형 값을 손계산해 보세요.'}
  ],
  eq:'n·sin(180°/n) < π < n·tan(180°/n)',
  what:'<b>부등식으로 조여 가는 것</b>이 극한의 원형임을 보는 실험입니다.',
  probe:'변을 늘릴수록 두 값이 같은 자리에서 만나기 시작합니다.',
  link:'삼각비(LAB 05)에서 극한(LAB 13)으로 넘어가는 다리가 됩니다.'},

{tex:[
   {t:'q_i=\\\\frac{p_i}{\\\\sum_j p_j}\\\\times S', s:'인구에 비례한 <b>정확한 몫</b>은 대개 소수입니다.'},
   {t:'a_i=\\\\lfloor q_i\\\\rfloor+\\\\text{(잉여 배분)}', s:'최대잉여식은 <b>소수 부분이 큰 순서</b>로 남은 자리를 줍니다.'},
   {t:'\\\\text{동트}: \\\\ \\\\arg\\\\max_i \\\\frac{p_i}{a_i+1}', s:'나눗셈식은 자리를 <b>하나씩</b> 배정합니다.'}
  ],
  next:[
   {lv:'바로',   t:'몫 계산', d:'세 지역의 정확한 몫을 손으로 구하세요.'},
   {lv:'심화',   t:'역설 찾기', d:'역설이 나타나는 의석 수를 모두 찾으세요.'},
   {lv:'프로젝트', t:'제도 비교', d:'우리 선거의 의석 배분 규정을 조사해 견주세요.'}
  ],
  eq:'qᵢ = pᵢ / Σp × S',
  what:'「공정하게 나눈다」가 <b>하나의 답을 갖지 않는다</b>는 것을 확인합니다.',
  probe:'의석을 하나 늘렸을 뿐인데 어떤 지역의 몫이 줄어듭니다.',
  link:'비례배분(LAB 20)의 심화이며, 사회적 선택 이론으로 이어집니다.'},

{tex:[
   {t:'c\\\\equiv m+k \\\\pmod{26}', s:'시저 암호는 <b>덧셈 하나</b>로 끝나는 암호입니다.'},
   {t:'c_j\\\\equiv m_j+k_{\\\\,j\\\\bmod L} \\\\pmod{26}', s:'열쇠를 L 글자로 늘린 <b>비즈네르 암호</b>입니다.'},
   {t:'\\\\text{열쇠 가짓수}=26^{L}', s:'가짓수는 늘지만 <b>통계적 흔적</b>은 따로 따져야 합니다.'}
  ],
  next:[
   {lv:'바로',   t:'손으로 복호', d:'이동값 3 의 짧은 문장을 손으로 풀어 보세요.'},
   {lv:'심화',   t:'열쇠 길이 추정', d:'같은 글자쌍의 간격으로 L 을 추정하세요.'},
   {lv:'프로젝트', t:'우리 반 암호', d:'열쇠를 정해 편지를 주고받고 서로 깨 보세요.'}
  ],
  eq:'c ≡ m + k (mod 26)',
  what:'암호의 안전이 <b>가짓수만의 문제가 아님</b>을 보는 실험입니다.',
  probe:'열쇠를 길게 하면 빈도 막대의 높낮이가 사라집니다.',
  link:'나머지 연산(LAB 14)의 응용이며, 통계적 분포 감각과 함께 다룹니다.'}
];`);
}

/* THUMBS */
{
  const key = s.match(/   '요일 칸 두 곳이 표시된 달력 그림'\)\r?\n\];/);
  if (!key) throw new Error('THUMBS 끝 앵커 실패');
  s = s.replace(key[0], `   '요일 칸 두 곳이 표시된 달력 그림'),

 svg(\`<text x="30" y="40" font-size="15" font-weight="800" fill="\${TC.ink3}">754</text>
   <path d="M52 36 L74 36" stroke="\${TC.ink3}" stroke-width="1.4"/>
   <path d="M70 32 L74 36 L70 40" stroke="\${TC.ink3}" stroke-width="1.4" fill="none"/>
   <text x="80" y="40" font-size="14" font-weight="800" fill="\${TC.blue}">12:34</text>
   <rect x="24" y="54" width="20" height="16" fill="\${TC.blue}" opacity=".55"/>
   <rect x="48" y="54" width="20" height="16" fill="\${TC.blue}" opacity=".38"/>
   <rect x="72" y="54" width="20" height="16" fill="\${TC.teal}" opacity=".45"/>
   <text x="60" y="88" font-size="8" font-weight="800" fill="\${TC.ink3}" text-anchor="middle">자릿값</text>\`,
   '10진수를 60진법 시각 표기로 바꾼 그림'),

 svg(\`<g stroke="\${TC.ink3}" stroke-width="1" opacity=".55" fill="none">
   <rect x="30" y="18" width="60" height="60"/>
   <line x1="50" y1="18" x2="50" y2="78"/><line x1="70" y1="18" x2="70" y2="78"/>
   <line x1="30" y1="38" x2="90" y2="38"/><line x1="30" y1="58" x2="90" y2="58"/></g>
   <text x="40" y="33" font-size="10" font-weight="700" fill="\${TC.ink3}" text-anchor="middle">8</text>
   <text x="60" y="33" font-size="10" font-weight="700" fill="\${TC.ink3}" text-anchor="middle">1</text>
   <text x="80" y="33" font-size="10" font-weight="700" fill="\${TC.ink3}" text-anchor="middle">6</text>
   <text x="40" y="53" font-size="10" font-weight="700" fill="\${TC.ink3}" text-anchor="middle">3</text>
   <text x="60" y="53" font-size="10" font-weight="700" fill="\${TC.blue}" text-anchor="middle">5</text>
   <text x="80" y="53" font-size="10" font-weight="700" fill="\${TC.ink3}" text-anchor="middle">7</text>
   <text x="40" y="73" font-size="10" font-weight="700" fill="\${TC.ink3}" text-anchor="middle">4</text>
   <text x="60" y="73" font-size="10" font-weight="700" fill="\${TC.ink3}" text-anchor="middle">9</text>
   <text x="80" y="73" font-size="10" font-weight="700" fill="\${TC.ink3}" text-anchor="middle">2</text>
   <text x="103" y="92" font-size="9" font-weight="800" fill="\${TC.teal}" text-anchor="end">15</text>\`,
   '가로 세로 대각선 합이 모두 15 인 3×3 격자'),

 svg(\`<circle cx="60" cy="46" r="30" fill="none" stroke="\${TC.ink3}" stroke-width="1.2" opacity=".6"/>
   <polygon points="60,16 86,31 86,61 60,76 34,61 34,31" fill="none" stroke="\${TC.blue}" stroke-width="1.8"/>
   <polygon points="60,11 95,31 95,71 60,91 25,71 25,31" fill="none" stroke="\${TC.rose}" stroke-width="1.4" stroke-dasharray="4 3"/>
   <text x="60" y="50" font-size="12" font-weight="800" fill="\${TC.teal}" text-anchor="middle">π</text>\`,
   '원을 안팎에서 감싼 두 정육각형 그림'),

 svg(\`<rect x="22" y="40" width="16" height="34" fill="\${TC.blue}" opacity=".65"/>
   <rect x="42" y="34" width="16" height="40" fill="\${TC.teal}" opacity=".6"/>
   <rect x="66" y="46" width="16" height="28" fill="\${TC.blue}" opacity=".65"/>
   <rect x="86" y="56" width="16" height="18" fill="\${TC.rose}" opacity=".7"/>
   <path d="M92 50 L96 44 L100 50" fill="none" stroke="\${TC.rose}" stroke-width="1.6"/>
   <text x="60" y="90" font-size="8" font-weight="800" fill="\${TC.ink3}" text-anchor="middle">늘렸는데 줄었다</text>\`,
   '의석 막대 가운데 하나만 낮아진 그림'),

 svg(\`<g fill="\${TC.blue}" opacity=".6">
   <rect x="20" y="52" width="8" height="22"/><rect x="32" y="60" width="8" height="14"/>
   <rect x="44" y="30" width="8" height="44"/><rect x="56" y="58" width="8" height="16"/>
   <rect x="68" y="64" width="8" height="10"/><rect x="80" y="56" width="8" height="18"/>
   <rect x="92" y="62" width="8" height="12"/></g>
   <rect x="44" y="30" width="8" height="44" fill="\${TC.rose}" opacity=".75"/>
   <text x="48" y="24" font-size="9" font-weight="800" fill="\${TC.rose}" text-anchor="middle">e</text>
   <text x="60" y="90" font-size="8" font-weight="800" fill="\${TC.ink3}" text-anchor="middle">빈도분석</text>\`,
   '한 막대만 유난히 높은 글자 빈도 그래프')
];`);
}

new Function(s);   // 구문 검사
fs.writeFileSync(P, s);

/* LABCAT */
{
  const C = 'src/55-catalog.js';
  let c = fs.readFileSync(C, 'utf8');
  const m = c.match(/(\{k:'cult',g:'수학과 문화 · 달력과 나머지'[^}]*\})(\r?\n\];)/);
  if (!m) throw new Error('LABCAT 끝 앵커 실패');
  c = c.replace(m[0], m[1] + `,
{k:'cult',g:'수학과 문화 · 진법',b:'자릿값을 b 배가 아니라 b 씩 더하는 것으로 잘못 씀'},
{k:'cult',g:'수학과 문화 · 마방진',b:'한 줄의 합을 전체 합을 n² 로 나눈 값으로 계산함'},
{k:'cult',g:'수학과 문화 · 원주율',b:'내접 다각형 값만 보고 π 를 그 값으로 확정함'},
{k:'cult',g:'수학과 문화 · 의석 배분',b:'소수 몫을 그냥 반올림해 의석 합이 전체와 달라짐'},
{k:'cult',g:'수학과 문화 · 암호',b:'열쇠 가짓수만 세어 통계적 흔적을 안전하다고 판단함'}` + m[2]);
  fs.writeFileSync(C, c);
}
console.log('LAB 242~246 (수학과 문화 C · 5종) 설치 완료');
