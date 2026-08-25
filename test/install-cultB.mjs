// 수학과 문화 B — LAB 237~241 (문양·지도·건축·종이·달력) 전 계층 설치
import fs from 'node:fs';
const P = 'src/40-demos.js';
let s = fs.readFileSync(P, 'utf8');
const NAMES = ['symmetryDemo', 'mercatorDemo', 'chainCurveDemo', 'paperRatioDemo', 'weekdayDemo'];
if (s.includes('function symmetryDemo')) throw new Error('이미 설치됨');
for (const n of NAMES) if (s.includes('function ' + n + '(')) throw new Error('이름 충돌: ' + n);

/* 데모 본문 */
{ const i = s.indexOf('const LABS=[');
  s = s.slice(0, i) + '\n' + fs.readFileSync('algZ-demos.txt', 'utf8') + '\n' + s.slice(i); }

/* LABS */
{ const key = ' build:perspectiveDemo}\n];';
  const i = s.indexOf(key);
  if (i < 0) throw new Error('LABS 끝 앵커 실패');
  s = s.slice(0, i) + ` build:perspectiveDemo},
{n:237,core:0,t:'“단청은 왜 어긋나지 않을까” 대칭과 문양',q:'문양이 제자리에 겹치는 방법은 몇 가지일까?',
 m:['회전 대칭','반사 대칭','대칭군'],a:['전통 문양','로고 디자인'],
 note:'회전각은 360°를 차수로 나눈 값입니다. 거울선을 더하면 제자리에 겹치는 방법의 수가 두 배가 됩니다.',
 build:symmetryDemo},
{n:238,core:0,t:'“그린란드는 왜 그렇게 클까” 지도 투영법',q:'평면 지도는 무엇을 잃을까?',
 m:['삼각비','확대율','로그'],a:['지도 제작','위치 정보'],
 note:'메르카토르 지도는 위도 φ 에서 가로를 1/cos φ 배로 늘립니다. 넓이는 그 제곱만큼 부풀어 오릅니다.',
 build:mercatorDemo},
{n:239,core:0,t:'“다리의 줄은 포물선일까” 현수선과 포물선',q:'제 무게로 늘어진 줄은 어떤 곡선일까?',
 m:['쌍곡선함수','급수 전개','근사'],a:['교량 설계','아치 구조'],
 note:'현수선 y = a cosh(x/a) 의 급수에서 앞 두 항만 남기면 포물선이 됩니다. 팽팽할수록 나머지 항이 작아집니다.',
 build:chainCurveDemo},
{n:240,core:0,t:'“잘라도 모양 그대로” 종이의 비 √2',q:'반으로 잘라도 닮은 종이가 있을까?',
 m:['비례식','무리수','등비수열'],a:['종이 규격','인쇄 편집'],
 note:'r = 2/r 에서 r² = 2 입니다. 이 비만이 반으로 잘라도 같은 모양을 지킵니다.',
 build:paperRatioDemo},
{n:241,core:0,t:'“그날은 무슨 요일일까” 달력과 나머지',q:'요일은 무엇이 정할까?',
 m:['합동식','나머지','주기'],a:['달력 계산','일정 관리'],
 note:'요일은 7 로 나눈 나머지가 정합니다. 평년은 나머지가 1, 윤년은 2 입니다.',
 build:weekdayDemo}
];` + s.slice(i + key.length);
}

/* PROBLEMS · MISSIONS */
{
  const m = s.match(/const PROBLEMS=(\{.*?\});/);
  if (!m) throw new Error('PROBLEMS 앵커 실패');
  const PR = JSON.parse(m[1]);
  PR['237'] = { sit: '단청 문양을 사진으로 찍어 돌려 보니, 어떤 각도에서는 원래 그림과 한 치도 어긋나지 않고 포개집니다.',
    ask: '몇 도씩 돌리면 포개질까? 포개지게 하는 방법은 모두 몇 가지일까?' };
  PR['238'] = { sit: '세계지도 위의 그린란드는 아프리카와 비슷한 크기로 보입니다. 실제로는 아프리카가 14 배 넓습니다.',
    ask: '지도는 왜 이렇게 그려질까? 무엇을 지키려다 무엇을 잃은 걸까?' };
  PR['239'] = { sit: '현수교의 케이블 사진과 아치 사진을 나란히 놓으면 두 곡선이 거의 같아 보입니다.',
    ask: '제 무게로 늘어진 줄과 포물선은 정말 같은 곡선일까? 다르다면 언제 티가 날까?' };
  PR['240'] = { sit: 'A4 를 반으로 접으면 A5, 두 장을 이으면 A3 — 크기는 달라지는데 모양은 늘 그대로입니다.',
    ask: '가로세로 비가 얼마여야 이런 일이 가능할까?' };
  PR['241'] = { sit: '올해 내 생일은 화요일입니다. 친구는 “내년에는 수요일”이라고 단언합니다.',
    ask: '정말 그럴까? 무엇을 계산하면 어느 날의 요일이든 알 수 있을까?' };
  s = s.replace(m[0], 'const PROBLEMS=' + JSON.stringify(PR) + ';');

  const i0 = s.indexOf('const MISSIONS=');
  const mm = s.slice(i0).match(/^const MISSIONS=\{[\s\S]*?\n\};/);
  if (!mm) throw new Error('MISSIONS 앵커 실패');
  const M = new Function('return ' + mm[0].slice('const MISSIONS='.length, -1))();

  M['237'] = [
   {t:'1분 자유 탐색 — 차수를 바꿔 보세요. 문양의 짜임이 어떻게 달라지나요?'},
   {t:'오늘의 문제 — 차수를 6 으로 맞추세요. 회전각이 몇 도인가요?',
    re:'단청의 기본 짜임',
    do:'① 차수를 6 으로 ② 회전각 확인 ③ 모티프 기울기도 바꿔 보기',
    hand:'360 ÷ 6 을 계산해 화면 값과 맞춰 보기'},
   {t:'거울을 더하면 — 「거울선(반사 대칭) 더하기」를 켜세요. 방법의 수가 몇 가지가 되나요?',
    re:'이면군',
    do:'① 체크 켜기 ② 주황 점선 세기 ③ 방법의 수 읽기',
    hand:'회전 n 가지와 반사 n 가지를 더해 확인'},
   {t:'(차수, 회전각, 거울선, 대칭의 수) 를 여섯 줄 기록하세요.'},
   {t:'심화 — 왜 2n 인가: 회전 R 과 반사 M 에 대해 Rⁿ = I, M² = I, MRM = R⁻¹ 임을 그림으로 확인하고, 서로 다른 겹치기가 정확히 2n 가지뿐임을 설명하세요.'}];

  M['238'] = [
   {t:'1분 자유 탐색 — 위도를 올려 보세요. 붉은 사각형이 어떻게 되나요?'},
   {t:'오늘의 문제 — 위도를 70° 로 올리세요. 넓이가 몇 배로 부풀었나요?',
    re:'그린란드가 아프리카만 해 보이는',
    do:'① 위도를 70 으로 ② 넓이 배율 읽기 ③ 지도 위 넓이와 비교',
    hand:'1 / cos²70° 를 계산해 확인'},
   {t:'실제로 견주기 — 「실제 넓이끼리 견주기」를 누르세요. 두 나라의 크기가 어떤가요?',
    re:'땅에서 큰 것은 다릅니다',
    do:'① 버튼 누르기 ② 두 사각형 비교 ③ 누르기 전 화면과 견주기',
    hand:'같은 넓이가 위도에 따라 얼마나 달라 보이는지 적기'},
   {t:'(위도, 가로 확대, 넓이 배율) 을 여섯 줄 기록하세요.'},
   {t:'심화 — 무엇을 잃는가: 메르카토르 도법은 각을 지키는 대신 넓이를 잃습니다. 넓이를 지키는 도법(몰바이데·에케르트)을 조사해 그 대신 무엇을 잃는지 한 문단으로 쓰세요.'}];

  M['239'] = [
   {t:'1분 자유 탐색 — 팽팽함 a 를 움직여 보세요. 곡선이 어떻게 달라지나요?'},
   {t:'오늘의 문제 — 포물선 겹쳐 보기를 켜고 a 를 20 으로 낮추세요. 두 곡선이 어떻게 되나요?',
    re:'헐겁게 늘어뜨릴수록',
    do:'① 겹쳐 보기 체크 ② a 를 20 으로 ③ 최대 차이 읽기',
    hand:'a·cosh(x/a) − a 와 포물선 값을 한 점에서 손으로 비교'},
   {t:'팽팽하게 — a 를 120 까지 올리세요. 최대 차이가 얼마가 되나요?',
    re:'오래도록 같은 것으로 여겨진',
    do:'① a 를 120 으로 ② 최대 차이 읽기 ③ 두 곡선의 겹침 확인',
    hand:'cosh 의 급수에서 x⁴ 항의 크기를 어림'},
   {t:'(a, 처짐, 최대 차이) 를 여섯 줄 기록하세요.'},
   {t:'심화 — 왜 닮았나: cosh t = 1 + t²/2 + t⁴/24 + … 에서 앞 두 항만 남기면 y ≈ a + x²/(2a) 인 포물선입니다. a 가 커질수록 나머지 항이 작아지는 까닭을 설명하세요.'}];

  M['240'] = [
   {t:'1분 자유 탐색 — 비 r 을 움직여 보세요. 두 사각형의 모양이 언제 같아지나요?'},
   {t:'오늘의 문제 — r 을 1.41 로 맞추세요. 자르기 전과 뒤의 비가 어떤가요?',
    re:'잘라도 비가 그대로입니다',
    do:'① r 을 1.41 로 ② 2/r 값 확인 ③ 차이 읽기',
    hand:'r × r = 2 가 되는 r 을 어림'},
   {t:'넓이의 변화 — 자른 횟수를 4 로 올리세요. A4 는 A0 의 몇 분의 일인가요?',
    re:'열여섯 분의 일',
    do:'① 자른 횟수를 4 로 ② 넓이 % 읽기 ③ 반씩 줄어드는 규칙 확인',
    hand:'(1/2)⁴ 을 계산해 확인'},
   {t:'(r, 2/r, 차이, 넓이 %) 를 여섯 줄 기록하세요.'},
   {t:'심화 — 실제 치수로: A4 는 210 × 297 mm 입니다. 297 ÷ 210 을 계산해 √2 와 견주고, A0 의 넓이가 1 m² 라는 규정에서 A0 의 치수를 직접 구하세요.'}];

  M['241'] = [
   {t:'1분 자유 탐색 — 날짜를 옮겨 보세요. 요일이 어떻게 바뀌나요?'},
   {t:'오늘의 문제 — 「며칠 뒤」를 21 로 맞추세요. 요일이 어떻게 되나요?',
    re:'7 의 배수는 요일을 바꾸지 못합니다',
    do:'① 며칠 뒤를 21 로 ② 나머지 확인 ③ 두 요일 비교',
    hand:'21 을 7 로 나눈 나머지를 계산'},
   {t:'윤년으로 — 연도를 2028 로 옮기세요. 하루가 아니라 며칠이 밀릴까요?',
    re:'이틀 밀립니다',
    do:'① 연도를 2028 로 ② 윤년 표시 확인 ③ 366 의 나머지 생각하기',
    hand:'366 을 7 로 나눈 나머지를 계산'},
   {t:'(날짜, 요일, 며칠 뒤, 나머지, 그날 요일) 을 여섯 줄 기록하세요.'},
   {t:'심화 — 요일 공식: 체르의 공식으로 내 생일의 요일을 손으로 계산해 실험실의 값과 맞는지 확인하고, 100 으로 나누어떨어지는 해가 윤년이 아닌 까닭도 조사하세요.'}];

  s = s.slice(0, i0) + 'const MISSIONS=' + JSON.stringify(M, null, 1) + ';' + s.slice(i0 + mm[0].length);

  /* 자기일치 감사 — 신호가 화면의 다른 글과 겹치면 열자마자 켜진다 */
  const PR2 = JSON.parse(s.match(/const PROBLEMS=(\{.*?\});/)[1]);
  const labsBlock = s.slice(s.indexOf('const LABS=['), s.indexOf('const THUMBS ='));
  const demoSrc = fs.readFileSync('algZ-demos.txt', 'utf8');
  let bad = 0;
  const KEYS = ['237', '238', '239', '240', '241'];
  KEYS.forEach((k, ki) => {
    const li = labsBlock.indexOf('{n:' + k + ',core:');
    const lab = li < 0 ? '' : labsBlock.slice(li, li + 900);
    const texts = M[k].map(x => [x.t, x.do, x.hand].filter(Boolean).join('\n')).join('\n')
      + '\n' + PR2[k].sit + '\n' + PR2[k].ask + '\n' + lab;
    // 데모 본문 — 신호 문구는 신호를 내는 한 줄에만 있어야 한다
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
  const key = s.match(/  link:'반비례\(LAB 29\)의 시각적 응용이며, 닮음\(LAB 31\)으로 유도됩니다\.'\}\r?\n\];/);
  if (!key) throw new Error('PRINS 끝 앵커 실패');
  s = s.replace(key[0], `  link:'반비례(LAB 29)의 시각적 응용이며, 닮음(LAB 31)으로 유도됩니다.'},

{tex:[
   {t:'\\\\text{회전각}=\\\\frac{360^\\\\circ}{n}', s:'n 겹 문양은 <b>360°를 n 등분한 각</b>마다 제자리로 옵니다.'},
   {t:'|C_n|=n,\\\\qquad |D_n|=2n', s:'회전만이면 n 가지, <b>거울선까지</b> 더하면 2n 가지입니다.'},
   {t:'R^n=I,\\\\quad M^2=I,\\\\quad MRM=R^{-1}', s:'회전과 반사가 얽히는 이 세 줄이 <b>대칭군</b>의 규칙입니다.'}
  ],
  next:[
   {lv:'바로',   t:'문양 판정', d:'교실 창살·보도블록의 대칭 차수를 판정하세요.'},
   {lv:'심화',   t:'2n 의 증명', d:'서로 다른 겹치기가 2n 가지뿐임을 설명하세요.'},
   {lv:'프로젝트', t:'단청 도안', d:'차수를 정해 나만의 단청 문양을 설계하세요.'}
  ],
  eq:'회전각 = 360° ÷ n · 대칭의 수 = 2n',
  what:'문양의 규칙성을 <b>겹치는 방법의 수</b>로 재는 실험입니다.',
  probe:'거울선을 켜면 방법의 수가 정확히 두 배가 됩니다.',
  link:'회전 변환(LAB 31)과 이어지며, 군의 개념으로 나아가는 다리가 됩니다.'},

{tex:[
   {t:'x=\\\\lambda,\\\\qquad y=\\\\ln\\\\tan\\\\!\\\\left(\\\\frac{\\\\pi}{4}+\\\\frac{\\\\varphi}{2}\\\\right)', s:'메르카토르 도법의 <b>세로 좌표</b>입니다 — 로그가 들어 있습니다.'},
   {t:'k=\\\\frac{1}{\\\\cos\\\\varphi}=\\\\sec\\\\varphi', s:'위도 φ 에서 가로가 늘어나는 <b>배율</b>입니다.'},
   {t:'\\\\text{넓이 배율}=\\\\sec^2\\\\varphi', s:'모양을 지키려면 세로도 같은 배로 늘려야 하므로 <b>제곱</b>이 됩니다.'}
  ],
  next:[
   {lv:'바로',   t:'배율 계산', d:'위도 37°와 72°의 넓이 배율을 구하세요.'},
   {lv:'심화',   t:'도법 비교', d:'넓이를 지키는 도법이 대신 잃는 것을 조사하세요.'},
   {lv:'프로젝트', t:'정직한 지도', d:'실제 넓이 순위와 지도 인상의 차이를 발표하세요.'}
  ],
  eq:'넓이 배율 = 1 / cos²φ',
  what:'둥근 것을 평면에 펴면 <b>무언가는 반드시 잃는다</b>는 사실을 수로 확인합니다.',
  probe:'위도 70°를 넘으면 넓이가 여덟 배 넘게 부풀어 오릅니다.',
  link:'삼각비(LAB 05)와 로그(LAB 12)가 한 화면에서 만나는 자리입니다.'},

{tex:[
   {t:'y=a\\\\cosh\\\\frac{x}{a}=\\\\frac{a}{2}\\\\left(e^{x/a}+e^{-x/a}\\\\right)', s:'제 무게로 늘어진 줄이 그리는 <b>현수선</b>입니다.'},
   {t:'\\\\cosh t=1+\\\\frac{t^2}{2}+\\\\frac{t^4}{24}+\\\\cdots', s:'급수로 펴면 <b>짝수 차수</b>만 남습니다.'},
   {t:'y\\\\approx a+\\\\frac{x^2}{2a}', s:'앞 두 항만 남기면 <b>포물선</b> — 그래서 닮아 보입니다.'}
  ],
  next:[
   {lv:'바로',   t:'차이 재기', d:'a 를 바꾸며 최대 차이가 어떻게 변하는지 재세요.'},
   {lv:'심화',   t:'급수 어림', d:'x⁴ 항의 크기로 차이의 크기를 어림하세요.'},
   {lv:'프로젝트', t:'다리 조사', d:'주변 다리의 케이블이 어느 곡선인지 판정하세요.'}
  ],
  eq:'y = a cosh(x / a)',
  what:'눈으로 못 가르는 두 곡선을 <b>급수 전개</b>로 가르는 실험입니다.',
  probe:'팽팽하게 당길수록 두 곡선이 거의 포개집니다.',
  link:'지수함수(LAB 03)와 다항근사가 만나며, 미적분Ⅱ 의 급수로 이어집니다.'},

{tex:[
   {t:'r=\\\\frac{2}{r}\\\\ \\\\Longrightarrow\\\\ r^2=2', s:'자르기 전과 뒤의 비가 같다는 조건이 <b>한 줄의 방정식</b>이 됩니다.'},
   {t:'r=\\\\sqrt{2}\\\\approx 1.41421', s:'조건을 만족하는 비는 <b>오직 하나</b>뿐입니다.'},
   {t:'S_n=S_0\\\\left(\\\\frac{1}{2}\\\\right)^{n}', s:'넓이는 <b>등비수열</b>로 줄지만 모양은 변하지 않습니다.'}
  ],
  next:[
   {lv:'바로',   t:'실측 확인', d:'A4 의 297 ÷ 210 을 재어 √2 와 견주세요.'},
   {lv:'심화',   t:'A0 구하기', d:'넓이 1 m² 조건에서 A0 의 치수를 구하세요.'},
   {lv:'프로젝트', t:'규격 설계', d:'세 겹으로 접어도 닮은 규격이 가능한지 따지세요.'}
  ],
  eq:'r² = 2 · Sₙ = S₀ (1/2)ⁿ',
  what:'생활 속 규격 하나가 <b>무리수의 존재</b>를 요구하는 장면입니다.',
  probe:'r 을 1.41 근처로 맞추면 자르기 전후의 비가 거의 같아집니다.',
  link:'무리수(LAB 21)와 등비수열(LAB 11)을 한 장의 종이로 잇습니다.'},

{tex:[
   {t:'w\\\\equiv w_0+k \\\\pmod 7', s:'요일은 <b>7 로 나눈 나머지</b>만큼 밀립니다.'},
   {t:'365=7\\\\times 52+1', s:'평년은 나머지가 <b>1</b> — 해마다 하루씩 밀립니다.'},
   {t:'366=7\\\\times 52+2', s:'윤년은 나머지가 <b>2</b> — 이틀이 밀립니다.'}
  ],
  next:[
   {lv:'바로',   t:'내 생일', d:'올해와 내년 생일의 요일을 계산하세요.'},
   {lv:'심화',   t:'체르의 공식', d:'공식으로 임의의 날짜의 요일을 구하세요.'},
   {lv:'프로젝트', t:'달력 만들기', d:'다음 해 학사 일정 달력을 계산으로 작성하세요.'}
  ],
  eq:'요일 ≡ 기준 요일 + 며칠 (mod 7)',
  what:'달력 계산이 <b>합동식</b> 하나로 정리되는 것을 보는 실험입니다.',
  probe:'며칠 뒤를 7 의 배수로 두면 요일이 제자리로 돌아옵니다.',
  link:'나머지 연산(LAB 14)의 생활 응용이며, 주기성의 좋은 사례입니다.'}
];`);
}

/* THUMBS */
{
  const key = s.match(/   '멀어질수록 작아지는 기둥과 소실점 그림'\)\r?\n\];/);
  if (!key) throw new Error('THUMBS 끝 앵커 실패');
  s = s.replace(key[0], `   '멀어질수록 작아지는 기둥과 소실점 그림'),

 svg(\`<g transform="translate(60,46)">
   <path d="M0 -6 Q14 -26 34 -14 Q18 -4 0 -6Z" fill="\${TC.blue}" opacity=".55"/>
   <path d="M0 -6 Q14 -26 34 -14 Q18 -4 0 -6Z" fill="\${TC.blue}" opacity=".45" transform="rotate(90)"/>
   <path d="M0 -6 Q14 -26 34 -14 Q18 -4 0 -6Z" fill="\${TC.blue}" opacity=".35" transform="rotate(180)"/>
   <path d="M0 -6 Q14 -26 34 -14 Q18 -4 0 -6Z" fill="\${TC.teal}" opacity=".45" transform="rotate(270)"/>
   <line x1="-40" y1="0" x2="40" y2="0" stroke="\${TC.ink3}" stroke-width="1" stroke-dasharray="3 3" opacity=".6"/>
   <line x1="0" y1="-40" x2="0" y2="40" stroke="\${TC.ink3}" stroke-width="1" stroke-dasharray="3 3" opacity=".6"/>
   </g>\`,
   '네 겹으로 돌아가는 꽃잎 문양과 거울선 그림'),

 svg(\`<rect x="16" y="18" width="88" height="56" fill="none" stroke="\${TC.ink3}" stroke-width="1" opacity=".5"/>
   <line x1="16" y1="30" x2="104" y2="30" stroke="\${TC.ink3}" stroke-width="1" opacity=".35"/>
   <line x1="16" y1="46" x2="104" y2="46" stroke="\${TC.ink3}" stroke-width="1" opacity=".35"/>
   <line x1="16" y1="64" x2="104" y2="64" stroke="\${TC.ink3}" stroke-width="1" opacity=".35"/>
   <rect x="26" y="52" width="14" height="12" fill="\${TC.teal}" opacity=".55"/>
   <rect x="66" y="20" width="30" height="26" fill="\${TC.rose}" opacity=".5"/>
   <text x="60" y="90" font-size="8" font-weight="800" fill="\${TC.ink3}" text-anchor="middle">1 / cos φ</text>\`,
   '고위도에서 크게 부풀어 그려진 지도 위 사각형'),

 svg(\`<line x1="22" y1="24" x2="22" y2="72" stroke="\${TC.ink3}" stroke-width="2.4"/>
   <line x1="98" y1="24" x2="98" y2="72" stroke="\${TC.ink3}" stroke-width="2.4"/>
   <path d="M22 26 Q60 76 98 26" stroke="\${TC.blue}" stroke-width="2.2" fill="none"/>
   <path d="M22 26 Q60 66 98 26" stroke="\${TC.rose}" stroke-width="1.6" fill="none" stroke-dasharray="4 3"/>
   <line x1="60" y1="52" x2="60" y2="62" stroke="\${TC.teal}" stroke-width="1.6"/>
   <text x="60" y="90" font-size="8" font-weight="800" fill="\${TC.ink3}" text-anchor="middle">cosh vs 포물선</text>\`,
   '두 기둥 사이에 늘어진 현수선과 포물선 비교 그림'),

 svg(\`<rect x="18" y="20" width="42" height="60" fill="\${TC.blue}" opacity=".18" stroke="\${TC.blue}" stroke-width="1.4"/>
   <line x1="18" y1="50" x2="60" y2="50" stroke="\${TC.rose}" stroke-width="1.4" stroke-dasharray="4 3"/>
   <rect x="72" y="34" width="32" height="46" fill="\${TC.teal}" opacity=".2" stroke="\${TC.teal}" stroke-width="1.4"/>
   <text x="60" y="94" font-size="8" font-weight="800" fill="\${TC.ink3}" text-anchor="middle">r = √2</text>\`,
   '반으로 자른 뒤에도 모양이 같은 두 종이 그림'),

 svg(\`<rect x="16" y="20" width="88" height="58" fill="none" stroke="\${TC.ink3}" stroke-width="1.2"/>
   <line x1="16" y1="34" x2="104" y2="34" stroke="\${TC.ink3}" stroke-width="1" opacity=".5"/>
   <line x1="38" y1="20" x2="38" y2="78" stroke="\${TC.ink3}" stroke-width="1" opacity=".35"/>
   <line x1="60" y1="20" x2="60" y2="78" stroke="\${TC.ink3}" stroke-width="1" opacity=".35"/>
   <line x1="82" y1="20" x2="82" y2="78" stroke="\${TC.ink3}" stroke-width="1" opacity=".35"/>
   <rect x="39" y="49" width="20" height="13" fill="\${TC.blue}" opacity=".45"/>
   <rect x="61" y="63" width="20" height="13" fill="\${TC.teal}" opacity=".45"/>
   <text x="60" y="92" font-size="8" font-weight="800" fill="\${TC.ink3}" text-anchor="middle">mod 7</text>\`,
   '요일 칸 두 곳이 표시된 달력 그림')
];`);
}

/* 236 원리 카드의 태그 오타 정리 */
s = s.replace('<b>반비례 함수</b >임을', '<b>반비례 함수</b>임을');

new Function(s);   // 구문 검사
fs.writeFileSync(P, s);

/* LABCAT */
{
  const C = 'src/55-catalog.js';
  let c = fs.readFileSync(C, 'utf8');
  const m = c.match(/(\{k:'cult',g:'수학과 문화 · 원근법'[^}]*\})(\r?\n\];)/);
  if (!m) throw new Error('LABCAT 끝 앵커 실패');
  c = c.replace(m[0], m[1] + `,
{k:'cult',g:'수학과 문화 · 대칭과 문양',b:'거울선을 세지 않아 대칭의 수를 n 가지로만 적음'},
{k:'cult',g:'수학과 문화 · 지도 투영법',b:'넓이 배율을 1/cos φ 로 두어 왜곡을 절반만 반영함'},
{k:'cult',g:'수학과 문화 · 건축의 곡선',b:'현수선을 포물선으로 놓고 케이블 장력을 계산함'},
{k:'cult',g:'수학과 문화 · 종이의 비',b:'r 과 2/r 을 견주지 않고 1.5 를 표준 비로 삼음'},
{k:'cult',g:'수학과 문화 · 달력과 나머지',b:'윤년을 빼먹고 해마다 하루씩만 밀린다고 계산함'}` + m[2]);
  fs.writeFileSync(C, c);
}
console.log('LAB 237~241 (수학과 문화 B · 5종) 설치 완료');
