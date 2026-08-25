// 전문 수학 C — LAB 317~321 (복소함수·시계 산술의 군·대칭군·민감도·외삽) 전 계층 설치
import fs from 'node:fs';
const P = 'src/40-demos.js';
let s = fs.readFileSync(P, 'utf8');
const NAMES = ['complexMapDemo', 'modGroupDemo', 'symGroupDemo', 'sensitivityDemo', 'extrapolateDemo'];
if (s.includes('function complexMapDemo')) throw new Error('이미 설치됨');
for (const n of NAMES) if (s.includes('function ' + n + '(')) throw new Error('이름 충돌: ' + n);

{ const i = s.indexOf('const LABS=[');
  s = s.slice(0, i) + '\n' + fs.readFileSync('algAP-demos.txt', 'utf8') + '\n' + s.slice(i); }

{ const key = ' build:eulerFormulaDemo}\n];';
  const i = s.indexOf(key);
  if (i < 0) throw new Error('LABS 끝 앵커 실패');
  s = s.slice(0, i) + ` build:eulerFormulaDemo},
{n:317,core:0,t:'“각을 두 배로” 복소함수 z²',q:'제곱하면 평면이 어떻게 움직일까?',
 m:['복소수의 곱','극형식','사상'],a:['등각 사상','신호 처리'],
 note:'(r∠θ)² = r²∠2θ 입니다. 크기만 제곱하면 각이 그대로라 격자가 휘지 않습니다.',
 build:complexMapDemo},
{n:318,core:0,t:'“12시 다음이 1시” 시계 산술의 군',q:'나머지의 셈에도 규칙이 있을까?',
 m:['합동식','군의 조건','역원'],a:['모듈러 연산','암호'],
 note:'닫힘·결합법칙·항등원·역원 네 가지를 모두 갖추면 군입니다. 나머지를 음수로 두면 닫힘이 깨집니다.',
 build:modGroupDemo},
{n:319,core:0,t:'“돌리고 뒤집기” 정삼각형의 대칭군',q:'순서를 바꾸면 결과도 바뀔까?',
 m:['대칭군','합성','비가환'],a:['대칭성과 불변량','결정 구조'],
 note:'정삼각형을 겹치게 하는 움직임은 여섯 가지입니다. 뒤집기가 섞이면 합성의 순서를 탑니다.',
 build:symGroupDemo},
{n:320,core:0,t:'“가정을 하나 바꾸면” 모형의 민감도',q:'같은 자료로 다른 결론이 나올까?',
 m:['수학적 모델링','가정','민감도'],a:['예측 모형','정책 판단'],
 note:'관측 구간에서는 세 모형이 거의 같습니다. 멀리 갈수록 가정의 차이가 결론을 정합니다.',
 build:sensitivityDemo},
{n:321,core:0,t:'“어디까지 믿어도 될까” 외삽의 위험',q:'잘 맞는 곡선이 잘 예측할까?',
 m:['회귀','외삽','과적합'],a:['예측의 한계','모형 검증'],
 note:'차수를 올리면 자료에는 더 잘 맞지만 구간 밖에서는 더 크게 튑니다. 맞춤과 예측은 다른 일입니다.',
 build:extrapolateDemo}
];` + s.slice(i + key.length);
}

{
  const m = s.match(/const PROBLEMS=(\{.*?\});/);
  if (!m) throw new Error('PROBLEMS 앵커 실패');
  const PR = JSON.parse(m[1]);
  PR['317'] = { sit: '복소수를 제곱하면 평면 위의 점이 어디론가 옮겨 갑니다. 격자를 통째로 옮기면 무늬가 휘어집니다.',
    ask: 'z² 은 평면을 어떻게 움직일까? 크기와 각 가운데 무엇이 어떻게 바뀔까?' };
  PR['318'] = { sit: '시계는 12 시 다음이 1 시입니다. 넘치면 처음으로 돌아오는 이 셈법에도 규칙이 있을까요?',
    ask: '더하기만으로 닫힌 세계가 될까? 「빼기」는 어떻게 될까?' };
  PR['319'] = { sit: '정삼각형을 돌리거나 뒤집어 제자리에 겹치게 합니다. 두 움직임을 이어서 하면 하나의 움직임이 됩니다.',
    ask: '이런 움직임은 모두 몇 가지일까? 순서를 바꾸면 결과도 바뀔까?' };
  PR['320'] = { sit: '가입자 수 6 개월치를 보고 3 년 뒤를 예측하려 합니다. 세 사람이 서로 다른 답을 내놓았습니다.',
    ask: '자료는 같은데 왜 답이 다를까? 무엇을 함께 적어야 할까?' };
  PR['321'] = { sit: '측정한 점에 곡선을 아주 잘 맞췄습니다. 오차가 거의 0 입니다. 그 곡선으로 두 배 먼 곳을 예측했습니다.',
    ask: '잘 맞는 곡선이 잘 예측할까? 어디까지 믿어도 될까?' };
  s = s.replace(m[0], 'const PROBLEMS=' + JSON.stringify(PR) + ';');

  const i0 = s.indexOf('const MISSIONS=');
  const mm = s.slice(i0).match(/^const MISSIONS=\{[\s\S]*?\n\};/);
  if (!mm) throw new Error('MISSIONS 앵커 실패');
  const M = new Function('return ' + mm[0].slice('const MISSIONS='.length, -1))();

  M['317'] = [
   {t:'1분 자유 탐색 — 각을 돌려 보세요. 붉은 점이 얼마나 빨리 도나요?'},
   {t:'오늘의 문제 — 각을 90° 로 맞추세요. 옮겨진 점의 각이 얼마인가요?',
    re:'평면을 두 겹으로 감습니다',
    do:'① 각을 90 으로 ② 옮겨진 각 읽기 ③ 파랑 자취가 어디까지 도는지 보기',
    hand:'(1∠90°)² 을 극형식으로 계산'},
   {t:'각을 그대로 두면 — 「각은 그대로 두고 크기만 제곱하기」를 켜세요.',
    re:'크기만 제곱한 것은 z² 이 아닙니다',
    do:'① 체크 켜기 ② 파랑 자취 보기 ③ 정확한 값과의 차이 읽기',
    hand:'복소수 곱셈에서 각이 어떻게 되는지 적기'},
   {t:'(크기, 각, 옮겨진 크기, 옮겨진 각) 을 여섯 줄 기록하세요.'},
   {t:'심화 — 두 겹으로 감기: z² 이 상반평면을 평면 전체로 옮긴다는 것을 각의 범위로 설명하고, 제곱근이 왜 두 개인지와 이어 보세요.'}];

  M['318'] = [
   {t:'1분 자유 탐색 — n 을 바꿔 보세요. 시계와 표가 어떻게 달라지나요?'},
   {t:'오늘의 문제 — 살펴볼 원소 a 를 2 로 맞추세요. a 의 역원이 무엇인가요?',
    re:'항등원으로 돌아왔습니다',
    do:'① a 를 2 로 ② 초록 점 찾기 ③ 표에서 0 이 나오는 칸 확인',
    hand:'2 + ? ≡ 0 (mod 5) 를 풀어 보기'},
   {t:'음수로 두면 — 「나머지를 음수로 두기」를 켜세요. 표가 어떻게 되나요?',
    re:'닫혀 있지 않습니다',
    do:'① 체크 켜기 ② 붉은 수 찾기 ③ 0 부터 n−1 밖으로 나가는지 확인',
    hand:'군의 첫 조건(닫힘)이 무엇이었는지 적기'},
   {t:'(n, a, 역원, a + 역원) 을 여섯 줄 기록하세요.'},
   {t:'심화 — 곱셈군: 같은 표를 곱셈으로 만들면 0 에 역원이 없습니다. n 이 소수일 때 0 을 뺀 나머지들이 곱셈에 대해 군이 되는 까닭을 조사하세요.'}];

  M['319'] = [
   {t:'1분 자유 탐색 — 두 움직임을 골라 보세요. 세 삼각형이 어떻게 달라지나요?'},
   {t:'오늘의 문제 — 먼저 r, 나중에 s 를 고르세요. 순서를 바꾼 결과와 같나요?',
    re:'이 군은 곱셈의 순서를 탑니다',
    do:'① 먼저를 r 로 ② 나중을 s 로 ③ 초록과 붉은 삼각형 비교',
    hand:'꼭짓점 A, B, C 가 어디로 가는지 손으로 따라가기'},
   {t:'순서를 뒤집어 — 「순서를 뒤집어 계산하기」를 켜세요. 표의 어느 칸이 바뀌나요?',
    re:'초록과 붉은 칸이 자리를 맞바꿉니다',
    do:'① 체크 켜기 ② 표의 두 칸 위치 보기 ③ 결과 값 비교',
    hand:'곱셈표가 대각선에 대해 대칭인지 확인'},
   {t:'(①, ②, 결과, 순서 바꾼 결과) 를 여섯 줄 기록하세요.'},
   {t:'심화 — 왜 여섯 개인가: 세 꼭짓점의 자리바꿈이 3! = 6 가지이고 그 모두가 실제 움직임으로 실현됨을 보이고, 회전만 모은 부분군이 세 개짜리임을 확인하세요.'}];

  M['320'] = [
   {t:'1분 자유 탐색 — 기간을 늘려 보세요. 세 곡선이 언제부터 벌어지나요?'},
   {t:'오늘의 문제 — 예측 기간을 30 개월로 늘리세요. 세 예측이 얼마나 벌어지나요?',
    re:'가정이 결론을 정한 것입니다',
    do:'① 기간을 30 으로 ② 세 값 읽기 ③ 최대/최소 배율 확인',
    hand:'지수와 선형의 30 개월 값을 손으로 어림'},
   {t:'한계를 두면 — 성장 가정을 로지스틱으로 바꾸세요. 곡선이 어떻게 되나요?',
    re:'어떤 가정을 두었는지 반드시 밝혀야 합니다',
    do:'① 가정을 로지스틱으로 ② 곡선의 모양 보기 ③ 지수와 견주기',
    hand:'한계값이 있다는 가정이 식의 어디에 들어 있는지 찾기'},
   {t:'(가정, 기간, 예측값) 을 여섯 줄 기록하세요.'},
   {t:'심화 — 가정을 적는 습관: 어떤 예측 보도 하나를 골라 그 안에 숨은 가정을 세 가지 찾아 적고, 그 가정이 깨지면 결론이 어떻게 달라지는지 쓰세요.'}];

  M['321'] = [
   {t:'1분 자유 탐색 — 차수를 올려 보세요. 곡선이 자료에 얼마나 붙나요?'},
   {t:'오늘의 문제 — 차수를 6 으로 올리세요. 맞춤 오차가 어떻게 되나요?',
    re:'과적합입니다',
    do:'① 차수를 6 으로 ② 맞춤 오차 읽기 ③ 구간 밖 곡선 모양 보기',
    hand:'1 차와 6 차의 맞춤 오차를 나란히 적기'},
   {t:'밖으로 나가면 — 예측 지점을 12 로 옮기세요. 예측값이 어떤가요?',
    re:'외삽은 위험합니다',
    do:'① 지점을 12 로 ② 예측값 읽기 ③ 눈대중 직선과 견주기',
    hand:'자료가 있는 구간이 어디까지인지 표시하기'},
   {t:'(차수, 지점, 예측값, 맞춤 오차) 를 여섯 줄 기록하세요.'},
   {t:'심화 — 적용 범위 적기: 모형을 발표할 때 반드시 함께 적어야 할 것(자료의 범위·가정·오차)을 정리하고, 왜 「맞춤이 좋다」가 「예측이 좋다」를 뜻하지 않는지 쓰세요.'}];

  s = s.slice(0, i0) + 'const MISSIONS=' + JSON.stringify(M, null, 1) + ';' + s.slice(i0 + mm[0].length);

  const PR2 = JSON.parse(s.match(/const PROBLEMS=(\{.*?\});/)[1]);
  const labsBlock = s.slice(s.indexOf('const LABS=['), s.indexOf('const THUMBS ='));
  const demoSrc = fs.readFileSync('algAP-demos.txt', 'utf8');
  let bad = 0;
  ['317', '318', '319', '320', '321'].forEach((k, ki) => {
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
  const key = s.match(/  link:'복소평면\(LAB 94\)과 테일러 급수\(LAB 23\)를 잇습니다\.'\}\r?\n\];/);
  if (!key) throw new Error('PRINS 끝 앵커 실패');
  s = s.replace(key[0], `  link:'복소평면(LAB 94)과 테일러 급수(LAB 23)를 잇습니다.'},

{tex:[
   {t:'z=r(\\\\cos\\\\theta+i\\\\sin\\\\theta)=r\\\\,e^{i\\\\theta}', s:'복소수를 <b>크기와 각</b>으로 씁니다.'},
   {t:'z^{2}=r^{2}e^{i(2\\\\theta)}', s:'크기는 <b>제곱</b>, 각은 <b>두 배</b>입니다.'},
   {t:'0\\\\le\\\\theta\\\\le\\\\pi \\\\Rightarrow 0\\\\le 2\\\\theta\\\\le 2\\\\pi', s:'반평면이 <b>평면 전체</b>를 덮습니다.'}
  ],
  next:[
   {lv:'바로',   t:'값 계산', d:'몇 개의 z 를 제곱해 보세요.'},
   {lv:'심화',   t:'두 겹', d:'제곱근이 왜 둘인지 각으로 설명하세요.'},
   {lv:'프로젝트', t:'등각성', d:'z² 이 각을 보존하는 곳과 아닌 곳을 찾으세요.'}
  ],
  eq:'(r∠θ)² = r² ∠ 2θ',
  what:'곱셈이 <b>회전과 확대</b>임을 다시 확인하는 실험입니다.',
  probe:'각을 그대로 두면 격자가 휘지 않습니다.',
  link:'복소평면(LAB 94)과 오일러 공식(LAB 316)의 응용입니다.'},

{tex:[
   {t:'a+b \\\\bmod n', s:'넘치면 <b>처음으로</b> 돌아옵니다.'},
   {t:'a+(n-a)\\\\equiv 0 \\\\pmod n', s:'모든 원소에 <b>역원</b>이 있습니다.'},
   {t:'\\\\text{닫힘 · 결합 · 항등원 · 역원} \\\\Rightarrow \\\\text{군}', s:'이 넷이 <b>군의 조건</b>입니다.'}
  ],
  next:[
   {lv:'바로',   t:'역원 찾기', d:'여러 a 의 역원을 구하세요.'},
   {lv:'심화',   t:'조건 확인', d:'네 조건을 표에서 하나씩 짚으세요.'},
   {lv:'프로젝트', t:'곱셈군', d:'n 이 소수일 때의 곱셈군을 만들어 보세요.'}
  ],
  eq:'a 의 역원 = n − a (mod n)',
  what:'익숙한 시계 셈법이 <b>군의 정의</b>를 그대로 만족함을 봅니다.',
  probe:'나머지를 음수로 두면 닫힘이 깨집니다.',
  link:'나머지 연산(LAB 14)을 구조의 눈으로 다시 봅니다.'},

{tex:[
   {t:'D_3=\\\\{e,\\\\ r,\\\\ r^{2},\\\\ s,\\\\ sr,\\\\ sr^{2}\\\\}', s:'움직임은 <b>여섯 가지</b>뿐입니다.'},
   {t:'r^{3}=e,\\\\quad s^{2}=e,\\\\quad srs=r^{-1}', s:'세 관계가 <b>구조 전체</b>를 정합니다.'},
   {t:'sr \\\\ne rs', s:'그래서 <b>순서를 탑니다</b>.'}
  ],
  next:[
   {lv:'바로',   t:'표 채우기', d:'곱셈표의 몇 칸을 손으로 채우세요.'},
   {lv:'심화',   t:'부분군', d:'회전만 모은 부분군을 찾으세요.'},
   {lv:'프로젝트', t:'정n각형', d:'정사각형의 대칭군을 만들어 보세요.'}
  ],
  eq:'|D₃| = 6 · sr ≠ rs',
  what:'대칭을 <b>셀 수 있는 대상</b>으로 바꾸는 실험입니다.',
  probe:'뒤집기가 섞이면 순서를 바꾼 결과가 달라집니다.',
  link:'대칭과 문양(LAB 237)을 구조로 정리한 자리입니다.'},

{tex:[
   {t:'\\\\text{지수}:\\\\ P(t)=P_0(1+g)^{t}', s:'같은 비율로 <b>끝없이</b> 늘어납니다.'},
   {t:'\\\\text{로지스틱}:\\\\ P(t)=\\\\frac{K}{1+Ce^{-gt}}', s:'<b>한계 K</b> 를 가정합니다.'},
   {t:'\\\\text{관측 구간에서는 거의 같다}', s:'멀리 갈수록 <b>갈라집니다</b>.'}
  ],
  next:[
   {lv:'바로',   t:'세 값 비교', d:'같은 기간의 세 예측을 견주세요.'},
   {lv:'심화',   t:'가정 찾기', d:'각 식에 숨은 가정을 적어 보세요.'},
   {lv:'프로젝트', t:'보도 검증', d:'실제 예측 기사의 가정을 찾아내세요.'}
  ],
  eq:'같은 자료 + 다른 가정 = 다른 결론',
  what:'모형에서 <b>가정이 곧 결론</b>임을 눈으로 확인합니다.',
  probe:'관측 구간만 보면 세 모형을 가릴 수 없습니다.',
  link:'확산 모형(LAB 03)에 반드시 따라와야 할 경고입니다.'},

{tex:[
   {t:'\\\\text{내삽}:\\\\ x\\\\in[x_{\\\\min},\\\\ x_{\\\\max}]', s:'자료 <b>안</b>에서 맞히는 일입니다.'},
   {t:'\\\\text{외삽}:\\\\ x\\\\notin[x_{\\\\min},\\\\ x_{\\\\max}]', s:'자료 <b>밖</b>으로 늘이는 일입니다.'},
   {t:'\\\\text{차수}\\\\uparrow \\\\Rightarrow \\\\text{맞춤}\\\\uparrow,\\\\ \\\\text{외삽}\\\\downarrow', s:'잘 맞을수록 <b>더 크게 튑니다</b>.'}
  ],
  next:[
   {lv:'바로',   t:'오차 재기', d:'차수를 올리며 맞춤 오차를 재세요.'},
   {lv:'심화',   t:'과적합', d:'차수가 높을수록 왜 튀는지 설명하세요.'},
   {lv:'프로젝트', t:'범위 적기', d:'자기 모형의 적용 범위를 명시해 보세요.'}
  ],
  eq:'맞춤이 좋다 ≠ 예측이 좋다',
  what:'예측에는 반드시 <b>범위</b>가 붙는다는 것을 확인합니다.',
  probe:'차수를 올리면 구간 밖에서 곡선이 크게 튑니다.',
  link:'회귀직선(LAB 06)과 수렴반경(LAB 264)이 같은 교훈을 줍니다.'}
];`);
}

/* THUMBS */
{
  const key = s.match(/   '단위원 위로 다가가는 급수의 자취'\)\r?\n\];/);
  if (!key) throw new Error('THUMBS 끝 앵커 실패');
  s = s.replace(key[0], `   '단위원 위로 다가가는 급수의 자취'),

 svg(\`<line x1="12" y1="60" x2="108" y2="60" stroke="\${TC.ink3}" stroke-width="1" opacity=".5"/>
   <line x1="60" y1="14" x2="60" y2="92" stroke="\${TC.ink3}" stroke-width="1" opacity=".5"/>
   <line x1="60" y1="60" x2="94" y2="40" stroke="\${TC.teal}" stroke-width="2.4"/>
   <line x1="60" y1="60" x2="76" y2="18" stroke="\${TC.rose}" stroke-width="2.4"/>
   <path d="M84 52 A28 28 0 0 0 72 30" fill="none" stroke="\${TC.rose}" stroke-width="1.4"/>
   <text x="60" y="98" font-size="8" font-weight="800" fill="\${TC.ink3}" text-anchor="middle">각이 두 배</text>\`,
   '각이 두 배로 벌어진 두 화살표'),

 svg(\`<circle cx="60" cy="48" r="32" fill="none" stroke="\${TC.ink3}" stroke-width="1.2"/>
   <g font-size="10" font-weight="700" text-anchor="middle">
   <circle cx="60" cy="16" r="10" fill="\${TC.amber || TC.rose}"/><text x="60" y="20" fill="#fff">0</text>
   <circle cx="90" cy="38" r="10" fill="\${TC.blue}"/><text x="90" y="42" fill="#fff">2</text>
   <circle cx="79" cy="74" r="10" fill="\${TC.teal}"/><text x="79" y="78" fill="#fff">3</text>
   <circle cx="41" cy="74" r="10" fill="\${TC.ink3}" opacity=".25"/>
   <circle cx="30" cy="38" r="10" fill="\${TC.ink3}" opacity=".25"/></g>
   <text x="60" y="98" font-size="8" font-weight="800" fill="\${TC.ink3}" text-anchor="middle">2 + 3 = 0</text>\`,
   '다섯 칸 시계에서 a 와 역원이 표시된 그림'),

 svg(\`<polygon points="34,20 56,58 12,58" fill="\${TC.blue}" opacity=".18" stroke="\${TC.blue}" stroke-width="1.6"/>
   <polygon points="86,20 108,58 64,58" fill="\${TC.teal}" opacity=".18" stroke="\${TC.teal}" stroke-width="1.6"/>
   <polygon points="60,58 82,92 38,92" fill="\${TC.rose}" opacity=".18" stroke="\${TC.rose}" stroke-width="1.6"/>
   <text x="60" y="16" font-size="9" font-weight="800" fill="\${TC.ink3}" text-anchor="middle">sr ≠ rs</text>\`,
   '순서에 따라 달라지는 세 삼각형'),

 svg(\`<g fill="\${TC.ink3}"><circle cx="20" cy="76" r="3"/><circle cx="30" cy="72" r="3"/>
   <circle cx="40" cy="66" r="3"/><circle cx="50" cy="58" r="3"/></g>
   <path d="M20 76 C46 68 66 40 104 14" stroke="\${TC.rose}" stroke-width="2.2" fill="none"/>
   <path d="M20 76 C50 66 78 58 104 54" stroke="\${TC.teal}" stroke-width="2.2" fill="none"/>
   <path d="M20 76 L104 44" stroke="\${TC.amber || TC.blue}" stroke-width="1.8" fill="none"/>
   <text x="60" y="96" font-size="8" font-weight="800" fill="\${TC.ink3}" text-anchor="middle">가정 셋, 결론 셋</text>\`,
   '같은 자료에서 갈라지는 세 예측 곡선'),

 svg(\`<rect x="14" y="14" width="46" height="70" fill="\${TC.blue}" opacity=".08"/>
   <g fill="\${TC.ink3}"><circle cx="20" cy="72" r="3"/><circle cx="30" cy="62" r="3"/>
   <circle cx="40" cy="52" r="3"/><circle cx="50" cy="42" r="3"/></g>
   <path d="M18 74 C36 58 48 44 60 34 C74 24 84 60 104 12" stroke="\${TC.rose}" stroke-width="2.2" fill="none"/>
   <line x1="60" y1="10" x2="60" y2="88" stroke="\${TC.ink3}" stroke-width="1" stroke-dasharray="3 3" opacity=".6"/>
   <text x="86" y="96" font-size="8" font-weight="800" fill="\${TC.rose}" text-anchor="middle">구간 밖</text>\`,
   '자료 구간 밖에서 크게 튀는 맞춤 곡선')
];`);
}

new Function(s);
fs.writeFileSync(P, s);

{
  const C = 'src/55-catalog.js';
  let c = fs.readFileSync(C, 'utf8');
  const m = c.match(/(\{k:'pure',g:'전문 수학 · 오일러 공식'[^}]*\})(\r?\n\];)/);
  if (!m) throw new Error('LABCAT 끝 앵커 실패');
  c = c.replace(m[0], m[1] + `,
{k:'pure',g:'전문 수학 · 복소함수',b:'각을 두 배로 하지 않고 크기만 제곱해 격자가 안 휘어짐'},
{k:'pure',g:'전문 수학 · 시계 산술의 군',b:'나머지를 음수로 둬 항등원과 역원이 표에서 안 맞음'},
{k:'pure',g:'전문 수학 · 대칭군',b:'합성의 순서를 뒤집어 곱셈표가 대칭이 되어 비가환성이 사라짐'},
{k:'pure',g:'전문 수학 · 모형의 민감도',b:'가정을 바꿔도 결과 그래프를 다시 계산하지 않아 결론이 그대로임'},
{k:'pure',g:'전문 수학 · 외삽의 위험',b:'자료 범위 밖까지 같은 선으로 늘여 외삽 경고가 안 뜸'}` + m[2]);
  fs.writeFileSync(C, c);
}
console.log('LAB 317~321 (전문 수학 C · 5종) 설치 완료 — 확장 카탈로그 전 과목 완료');
