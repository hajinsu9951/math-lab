// 대수 6종의 PRINS(원리) · THUMBS(썸네일) · LABCAT(분류) 채우기
import fs from 'node:fs';

/* ① PRINS 6항목 */
{
  const P = 'src/40-demos.js';
  let s = fs.readFileSync(P, 'utf8');
  if (!s.includes('sin θ = y, cos θ = x (단위원)')) {
    const key = s.match(/  link:'지수·로그 단원\(LAB 3 확산[^']*'\}\r?\n\];/);
    if (!key) throw new Error('PRINS 끝 앵커 실패');
    const add = key[0].replace(/\r?\n\];$/, '') + `,

/* 106 단위원 */
 {tex:[
   {t:'P(\\cos\\theta,\\ \\sin\\theta)', s:'단위원 위의 점의 <b>x 좌표가 cos, y 좌표가 sin</b> — 삼각비의 정의가 「길이의 비」에서 「좌표」로 넓어집니다.'},
   {t:'\\sin(180^\\circ-\\theta)=\\sin\\theta,\\quad \\cos(180^\\circ-\\theta)=-\\cos\\theta', s:'150°와 30°는 y 좌표가 같고 x 좌표만 부호가 반대 — 제2사분면에서 sin 만 살아남는 이유입니다.'},
   {t:'\\sin(\\theta+360^\\circ)=\\sin\\theta', s:'한 바퀴 돌면 같은 자리 — <b>주기 360°</b>가 그림에서 그대로 읽힙니다.'}
  ],
  next:[
   {lv:'바로',   t:'부호 지도 완성', d:'사분면 4칸에 (sin, cos, tan) 부호를 채운 지도를 만들고 축 위의 값(0°·90°·180°·270°)도 넣으세요.'},
   {lv:'심화',   t:'호도법으로 옮기기', d:'같은 실험을 라디안으로 다시 하고, 2π 가 왜 한 바퀴인지 호의 길이로 설명하세요.'},
   {lv:'프로젝트', t:'회전하는 좌표', d:'단위원 곱셈이 회전이라는 사실(LAB 94 복소수)과 이어, 게임 캐릭터 회전 코드를 설계해 보세요.'}
  ],
  eq:'sin θ = y, cos θ = x (단위원)',
  what:'직각삼각형이 감당하지 못하는 각을 <b>원 위의 좌표</b>로 넘겨받는 확장입니다. 정의를 넓혔더니 부호와 주기가 공짜로 따라옵니다.',
  probe:'150°에서 점 P 를 30°의 점과 나란히 보세요. 높이(y)는 같고 좌우(x)만 뒤집혔습니다 — 그것이 sin 150° = sin 30° 의 전부입니다.',
  link:'중3 삼각비(LAB 5)의 확장이며, 삼각함수 그래프(LAB 107)와 복소평면 회전(LAB 94)으로 이어집니다.'},

/* 107 일출 시각 */
 {tex:[
   {t:'y = D + A\\sin\\!\\left(\\frac{2\\pi}{12}(x-C)\\right)', s:'D 는 1년 평균, A 는 여름·겨울 차의 절반, C 는 곡선을 좌우로 미는 값 — 세 수가 각각 다른 일을 합니다.'},
   {t:'A=\\frac{\\text{최댓값}-\\text{최솟값}}{2},\\quad D=\\frac{\\text{최댓값}+\\text{최솟값}}{2}', s:'데이터에서 A·D 를 먼저 어림하면 위상 C 만 맞추면 됩니다 — 모형화의 순서입니다.'},
   {t:'\\text{RMSE}=\\sqrt{\\frac{1}{n}\\sum (y_i-\\hat y_i)^2}', s:'모형이 얼마나 맞는지를 <b>하나의 수</b>로 재는 장치. 7분(0.12시간) 아래면 실용적으로 충분합니다.'}
  ],
  next:[
   {lv:'바로',   t:'우리 지역 일출', d:'기상청 자료로 우리 지역 12개월 일출을 모아 같은 방식으로 A·D·C 를 맞춰 보세요.'},
   {lv:'심화',   t:'낮의 길이', d:'일몰 자료도 모아 「낮의 길이」 곡선을 만들고, 일출·일몰 두 곡선의 위상 차를 해석하세요.'},
   {lv:'프로젝트', t:'계절성 예측', d:'아이스크림 판매·전기 사용량처럼 계절성이 있는 자료를 찾아 삼각함수 모형으로 예측해 보세요.'}
  ],
  eq:'y = D + A sin(2π(x−C)/12)',
  what:'삼각함수를 <b>공식이 아니라 모형</b>으로 쓰는 실험입니다. 세 계수가 각각 무엇을 맡는지 손으로 맞춰 보면, 그래프의 진폭·주기·위상이 몸에 남습니다.',
  probe:'A 만 움직여 보세요 — 곡선의 높이만 변합니다. C 만 움직이면 모양은 그대로 좌우로 밀립니다. 계수마다 담당이 다릅니다.',
  link:'삼각함수의 그래프 단원. 회귀(LAB 15)와 같은 「데이터에 맞추기」이며, 단위원(LAB 106)에서 정의가 옵니다.'},

/* 108 사인·코사인법칙 */
 {tex:[
   {t:'\\frac{a}{\\sin A}=\\frac{b}{\\sin B}=\\frac{c}{\\sin C}', s:'한 변과 마주 보는 각의 짝은 삼각형 어디서나 같은 비 — 이것이 갈 수 없는 거리를 재는 열쇠입니다.'},
   {t:'b=\\frac{c\\sin B}{\\sin C},\\qquad C=180^\\circ-A-B', s:'기선 c 와 두 각만 알면 나머지가 모두 정해집니다(ASA). 측량의 기본 절차입니다.'},
   {t:'b^{2}=a^{2}+c^{2}-2ac\\cos B', s:'코사인법칙 — 두 변과 낀각으로 나머지 변을 구하는 다른 길. 사인법칙의 결과를 검산해 줍니다.'}
  ],
  next:[
   {lv:'바로',   t:'교실 측량', d:'운동장에서 기선을 정하고 각도기(또는 스마트폰 각도 앱)로 두 각을 재어 실제 거리를 계산해 보세요.'},
   {lv:'심화',   t:'오차의 전파', d:'각을 1° 잘못 재면 거리가 얼마나 달라지는지 실험하고, 기선을 길게 잡아야 하는 이유를 설명하세요.'},
   {lv:'프로젝트', t:'삼각측량 지도', d:'학교 주변 세 지점을 삼각측량으로 재어 간이 지도를 그리고 실제 지도와 비교하세요.'}
  ],
  eq:'a/sinA = b/sinB = c/sinC · b² = a²+c²−2ac cosB',
  what:'삼각형의 「정해짐(ASA)」을 <b>실제 길이</b>로 바꿔 주는 도구입니다. 강·계곡·건물처럼 자를 댈 수 없는 곳을 각으로 재는 방법이 됩니다.',
  probe:'두 각의 합을 180°에 가깝게 밀어 보세요. 삼각형이 납작해지며 거리가 폭발합니다 — 측량에서 각을 극단으로 잡으면 안 되는 이유입니다.',
  link:'중3 삼각비(LAB 5)의 일반화. GPS 삼변측량(LAB 1)과 같은 「거리를 각·길이로 결정하기」 계열입니다.'},

/* 109 대출과 등비수열 */
 {tex:[
   {t:'P(1+i)^{n}=m\\left[(1+i)^{n-1}+\\cdots+1\\right]', s:'대출 원금의 미래가치 = 매달 상환액들의 미래가치 합. 오른쪽 대괄호가 <b>등비수열의 합</b>입니다.'},
   {t:'m=\\frac{P\\,i(1+i)^{n}}{(1+i)^{n}-1}', s:'등비수열의 합 공식을 정리하면 월 상환액이 나옵니다 — 은행 앱의 한 줄이 여기서 옵니다.'},
   {t:'\\text{총이자}=mn-P', s:'같은 원금이라도 기간이 길수록 총이자는 커집니다. 월 부담과 총비용은 <b>맞바꾸는 관계</b>입니다.'}
  ],
  next:[
   {lv:'바로',   t:'중도 상환', d:'12개월째 목돈으로 일부를 갚으면 남은 상환액이 어떻게 변할지 계산해 보세요.'},
   {lv:'심화',   t:'원금균등 vs 원리금균등', d:'두 방식의 월 상환액·총이자를 비교하는 표를 만들고 장단점을 정리하세요.'},
   {lv:'프로젝트', t:'우리 집 통신비 할부', d:'실제 단말기 할부(무이자 여부 포함) 조건을 모아 총비용을 계산해 비교 보고서를 쓰세요.'}
  ],
  eq:'m = P·i(1+i)ⁿ / ((1+i)ⁿ − 1)',
  what:'등비수열의 합이 <b>금융 계산의 뼈대</b>임을 보이는 실험입니다. 공식을 외우는 대신, 현재가치로 되돌려 더하는 아이디어를 먼저 만듭니다.',
  probe:'초반 잔액 막대가 잘 안 줄어드는 것을 보세요. 갚은 돈의 상당 부분이 이자로 가기 때문입니다 — 상환 초기의 구조가 눈에 보입니다.',
  link:'등차·등비수열 단원. 복리(LAB 11)와 같은 뿌리이며, 지수·로그(LAB 105)와 이어집니다.'},

/* 110 시그마 */
 {tex:[
   {t:'\\sum_{k=1}^{n}k=\\frac{n(n+1)}{2}', s:'계단 두 개를 맞물리면 가로 n · 세로 (n+1) 직사각형 — 계단 하나는 그 절반입니다.'},
   {t:'(1+2+\\cdots+n)+(n+\\cdots+2+1)=n(n+1)', s:'가우스의 한 수. 위아래로 더하면 (n+1) 이 n 개 생깁니다.'},
   {t:'\\sum_{k=1}^{n}k^{2}=\\frac{n(n+1)(2n+1)}{6}', s:'제곱의 합은 계단을 세 겹 쌓아야 직육면체가 되어 6으로 나눕니다 — 차원이 하나 올라간 같은 아이디어입니다.'}
  ],
  next:[
   {lv:'바로',   t:'홀수의 합', d:'1+3+5+…+(2n−1) 의 합을 도형(정사각형)으로 만들어 공식을 스스로 유도하세요.'},
   {lv:'심화',   t:'세제곱의 합', d:'Σk³ = (Σk)² 를 n=1~5 에서 확인하고, 그 놀라운 관계를 도형으로 설명해 보세요.'},
   {lv:'프로젝트', t:'누적합과 데이터', d:'스프레드시트의 누적합(SUM 범위 확장)이 시그마와 같은 일임을 보이고, 학급 자료로 누적 그래프를 만드세요.'}
  ],
  eq:'Σk = n(n+1)/2',
  what:'공식을 <b>도형으로 만들어 내는</b> 실험입니다. 외운 식이 아니라 「두 계단을 붙였더니 직사각형」이라는 그림이 남습니다.',
  probe:'n 을 바꿔 가며 붙이기를 반복해 보세요. n 이 무엇이든 늘 (n+1) 높이의 직사각형이 됩니다 — 그 보편성이 공식의 근거입니다.',
  link:'수열의 합 단원. 누적합·데이터 집계로 이어지고, 귀납법(LAB 111)으로 엄밀히 증명됩니다.'},

/* 111 수학적 귀납법 */
 {tex:[
   {t:'P(1)\\ \\text{참}', s:'첫 도미노를 실제로 넘어뜨리는 단계. 이것이 없으면 사슬 전체가 시작되지 않습니다.'},
   {t:'P(k)\\Rightarrow P(k+1)\\quad(\\forall k)', s:'k 번째가 넘어지면 k+1 번째도 넘어진다 — <b>어떤 k 에 대해서도</b> 성립해야 합니다. 한 곳만 끊겨도 무너집니다.'},
   {t:'\\therefore\\ P(n)\\ \\text{는 모든 자연수 } n \\text{에서 참}', s:'유한한 두 문장으로 무한히 많은 경우를 덮는 논증 — 도미노가 그 구조를 그대로 보여 줍니다.'}
  ],
  next:[
   {lv:'바로',   t:'합 공식 증명', d:'1+2+…+n = n(n+1)/2 를 귀납법으로 증명하고, 두 단계가 각각 도미노의 무엇인지 표시하세요.'},
   {lv:'심화',   t:'가짜 증명 찾기', d:'「모든 말은 같은 색이다」류의 잘못된 귀납 증명을 찾아, 어느 도미노가 빠졌는지 지적하세요.'},
   {lv:'프로젝트', t:'알고리즘의 정당성', d:'재귀 알고리즘(예: 하노이 탑)이 항상 옳음을 귀납법으로 논증하는 보고서를 쓰세요.'}
  ],
  eq:'P(1) ∧ (P(k) ⟹ P(k+1)) ⟹ ∀n P(n)',
  what:'무한을 다루는 <b>증명의 구조</b>를 눈으로 보는 실험입니다. 두 조건 중 하나만 빠져도 결론이 무너지는 것을 도미노가 대신 말해 줍니다.',
  probe:'첫 도미노를 밀지 않은 채 간격만 좁혀 보세요. 조건 ②만으로는 아무 일도 일어나지 않습니다 — ①의 존재 이유입니다.',
  link:'수학적 귀납법 단원. 시그마 공식(LAB 110)의 엄밀한 증명이며, 재귀·알고리즘 정당성으로 이어집니다.'}
];`;
    s = s.replace(key[0], add);
    fs.writeFileSync(P, s);
    console.log('PRINS 6항목 추가');
  } else console.log('PRINS 이미 반영');
}

/* ② THUMBS 6개 */
{
  const P = 'src/40-demos.js';
  let s = fs.readFileSync(P, 'utf8');
  if (!s.includes('단위원 위의 점이 각을 따라 도는 그림')) {
    const key = s.match(/   '주사위로 굴린 실험값 점들이 지수 감소 곡선을 따라가는 그림'\)\r?\n\];/);
    if (!key) throw new Error('THUMBS 끝 앵커 실패');
    const add = `   '주사위로 굴린 실험값 점들이 지수 감소 곡선을 따라가는 그림'),

 svg(\`<circle cx="60" cy="35" r="24" stroke="\${TC.mute}" stroke-width="1.4" fill="none"/>
   <path d="M36 35 H84" stroke="\${TC.mute}" stroke-width="1"/>
   <path d="M60 11 V59" stroke="\${TC.mute}" stroke-width="1"/>
   <path d="M60 35 L39 23" stroke="\${TC.ink}" stroke-width="1.8"/>
   <path d="M39 23 V35" stroke="\${TC.teal}" stroke-width="1.4" stroke-dasharray="3 2"/>
   <circle cx="39" cy="23" r="3.4" fill="\${TC.rose}"/>
   <text x="92" y="30" font-size="8.5" font-weight="800" fill="\${TC.teal}">sin+</text>
   <text x="92" y="44" font-size="8.5" font-weight="800" fill="\${TC.blue}">cos−</text>\`,
   '단위원 위의 점이 각을 따라 도는 그림'),

 svg(\`<path d="M20 44 C40 20 80 20 100 44" stroke="\${TC.blue}" stroke-width="2" fill="none"/>
   <circle cx="26" cy="38" r="2.6" fill="\${TC.rose}"/><circle cx="42" cy="27" r="2.6" fill="\${TC.rose}"/>
   <circle cx="60" cy="23" r="2.6" fill="\${TC.rose}"/><circle cx="78" cy="27" r="2.6" fill="\${TC.rose}"/>
   <circle cx="96" cy="40" r="2.6" fill="\${TC.rose}"/>
   <circle cx="60" cy="14" r="5" fill="\${TC.amber}"/>
   <text x="60" y="60" font-size="8.5" font-weight="800" fill="\${TC.ink3}" text-anchor="middle">일출 시각</text>\`,
   '월별 일출 점들 위로 물결 곡선이 지나는 그림'),

 svg(\`<rect x="14" y="18" width="92" height="14" fill="#DCEAFB"/>
   <path d="M26 52 H94" stroke="\${TC.ink}" stroke-width="1.8"/>
   <path d="M26 52 L64 22" stroke="\${TC.blue}" stroke-width="1.6"/>
   <path d="M94 52 L64 22" stroke="\${TC.teal}" stroke-width="1.6"/>
   <circle cx="64" cy="22" r="4" fill="#166534"/>
   <text x="34" y="62" font-size="8" font-weight="800" fill="\${TC.ink3}">A</text>
   <text x="90" y="62" font-size="8" font-weight="800" fill="\${TC.ink3}">B</text>
   <text x="64" y="14" font-size="8.5" font-weight="800" fill="\${TC.ink3}" text-anchor="middle">C</text>\`,
   '기선 양끝에서 강 건너 나무를 겨누는 삼각형 그림'),

 svg(\`<rect x="22" y="14" width="10" height="42" fill="\${TC.rose}" opacity=".55"/>
   <rect x="36" y="20" width="10" height="36" fill="\${TC.blue}" opacity=".45"/>
   <rect x="50" y="27" width="10" height="29" fill="\${TC.blue}" opacity=".45"/>
   <rect x="64" y="34" width="10" height="22" fill="\${TC.blue}" opacity=".45"/>
   <rect x="78" y="42" width="10" height="14" fill="\${TC.blue}" opacity=".45"/>
   <rect x="92" y="50" width="10" height="6" fill="\${TC.blue}" opacity=".45"/>
   <text x="62" y="68" font-size="8.5" font-weight="800" fill="\${TC.ink3}" text-anchor="middle">잔액이 줄어드는 모습</text>\`,
   '대출 잔액 막대가 점점 줄어드는 그림'),

 svg(\`<rect x="26" y="46" width="12" height="10" fill="\${TC.blue}" opacity=".45"/>
   <rect x="40" y="36" width="12" height="20" fill="\${TC.blue}" opacity=".45"/>
   <rect x="54" y="26" width="12" height="30" fill="\${TC.blue}" opacity=".45"/>
   <rect x="26" y="16" width="12" height="30" fill="\${TC.rose}" opacity=".32"/>
   <rect x="40" y="16" width="12" height="20" fill="\${TC.rose}" opacity=".32"/>
   <rect x="54" y="16" width="12" height="10" fill="\${TC.rose}" opacity=".32"/>
   <rect x="26" y="16" width="40" height="40" stroke="\${TC.ink}" stroke-width="1.4" fill="none"/>
   <text x="88" y="40" font-size="9" font-weight="800" fill="\${TC.ink3}">n(n+1)</text>\`,
   '두 계단이 맞물려 직사각형이 되는 그림'),

 svg(\`<rect x="24" y="24" width="7" height="30" fill="\${TC.rose}" opacity=".6" transform="rotate(-38 27 54)"/>
   <rect x="42" y="24" width="7" height="30" fill="\${TC.rose}" opacity=".5" transform="rotate(-24 45 54)"/>
   <rect x="58" y="24" width="7" height="30" fill="\${TC.blue}" opacity=".55"/>
   <rect x="74" y="24" width="7" height="30" fill="\${TC.blue}" opacity=".55"/>
   <rect x="90" y="24" width="7" height="30" fill="\${TC.blue}" opacity=".55"/>
   <path d="M20 58 H104" stroke="\${TC.mute}" stroke-width="1.2"/>
   <text x="62" y="70" font-size="8.5" font-weight="800" fill="\${TC.ink3}" text-anchor="middle">k → k+1</text>\`,
   '도미노가 차례로 넘어지는 그림')
];`;
    s = s.replace(key[0], add);
    fs.writeFileSync(P, s);
    console.log('THUMBS 6개 추가');
  } else console.log('THUMBS 이미 반영');
}

/* ③ LABCAT 6행 */
{
  const P = 'src/55-catalog.js';
  let c = fs.readFileSync(P, 'utf8');
  if (!c.includes('대수 · 삼각함수 (단위원)')) {
    const m = c.match(/(\{k:'alg',g:'대수 · 지수함수와 로그함수 \(주사위 실험\)'[^}]*\})(\r?\n\];)/);
    if (!m) throw new Error('LABCAT 끝 앵커 실패');
    c = c.replace(m[0], m[1] + `,
{k:'alg',g:'대수 · 삼각함수 (단위원)',b:'각을 180°에서 넘길 때 sin 의 부호를 뒤집지 않아 제3사분면에서도 양수로 나옴'},
{k:'alg',g:'대수 · 삼각함수의 그래프 (일출 모형)',b:'주기를 12가 아니라 2π 로 두어 곡선이 1년에 여섯 번 물결침'},
{k:'alg',g:'대수 · 사인·코사인법칙',b:'∠C 를 180°−A−B 로 구하지 않고 90°로 고정해 거리가 늘 같은 값으로 나옴'},
{k:'alg',g:'대수 · 등차·등비수열 (대출 상환)',b:'이자율을 연이율 그대로 써서(12로 나누지 않아) 월 상환액이 폭등함'},
{k:'alg',g:'대수 · 수열의 합 (시그마)',b:'붙인 직사각형의 세로를 n 으로 계산해(n+1 이 아님) 합이 늘 절반보다 작게 나옴'},
{k:'alg',g:'대수 · 수학적 귀납법 (도미노)',b:'첫 도미노를 밀지 않아도 전부 쓰러진 것으로 판정해 조건 ①이 사라짐'}` + m[2]);
    fs.writeFileSync(P, c);
    console.log('LABCAT 6행 추가');
  } else console.log('LABCAT 이미 반영');
}
console.log('대수 6종 부속 설치 완료');
