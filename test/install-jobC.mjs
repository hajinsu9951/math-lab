// 직무 수학 C — LAB 227~231 (현장 계산) 전 계층 설치
import fs from 'node:fs';
const P = 'src/40-demos.js';
let s = fs.readFileSync(P, 'utf8');
if (s.includes('function fieldHeightDemo')) throw new Error('이미 설치됨');
for (const n of ['fieldHeightDemo','cuttingDemo','powerBillDemo','geoDistDemo','paintCalcDemo'])
  if (s.includes('function ' + n + '(')) throw new Error('이름 충돌: ' + n);

{ const i = s.indexOf('const LABS=[');
  s = s.slice(0, i) + '\n' + fs.readFileSync('algX-demos.txt', 'utf8') + '\n' + s.slice(i); }

{ const key = ' build:specDistDemo}\n];';
  const i = s.indexOf(key);
  if (i < 0) throw new Error('LABS 끝 앵커 실패');
  s = s.slice(0, i) + ` build:specDistDemo},
{n:227,core:0,t:'“건물 높이를 자 없이” 삼각비 현장 측량',q:'눈높이를 빠뜨리면 어떻게 될까?',
 m:['삼각비','tan','측정 오차'],a:['현장 측량','건축 검측'],
 note:'높이 = 거리 × tan(각) + 눈높이. 각의 기준선이 눈높이이므로 눈높이를 반드시 더해야 합니다.',
 build:fieldHeightDemo},
{n:228,core:0,t:'“남는 토막을 줄이려면” 자재 재단',q:'같은 자재로 더 많이 쓰는 방법은?',
 m:['나눗셈의 나머지','조합','최적화'],a:['재단 계획','자재 발주'],
 note:'L − (aA + bB) 를 가장 작게 하는 자연수 조합을 찾는 문제입니다. 섞어 넣으면 버리는 양이 줄어듭니다.',
 build:cuttingDemo},
{n:229,core:0,t:'“10kWh 더 썼을 뿐인데” 누진 전기 요금',q:'평균 단가와 마지막 단가는 왜 다를까?',
 m:['구간별 계산','평균','기본요금'],a:['요금 절약','에너지 관리'],
 note:'요금 = 기본요금 + Σ(구간 사용량 × 단가). 구간을 넘으면 기본요금까지 뛰어 그래프가 꺾입니다.',
 build:powerBillDemo},
{n:230,core:0,t:'“위도 1도는 몇 km” GPS 좌표와 거리',q:'가로와 세로를 같은 자로 재도 될까?',
 m:['호의 길이','코사인','좌표'],a:['GPS 계산','지도 제작'],
 note:'위도 1° 는 어디서나 약 111km 지만 경도 1° 는 111 × cos(위도) km 입니다. 가로에만 cos 이 붙습니다.',
 build:geoDistDemo},
{n:231,core:0,t:'“페인트 몇 통을 살까” 도포량과 올림',q:'넓이는 실수인데 통은 왜 자연수일까?',
 m:['넓이','나눗셈','올림'],a:['도장 견적','자재 산출'],
 note:'벽 넓이에서 창문·문을 빼고 칠하는 횟수를 곱한 뒤 한 통의 도포 면적으로 나눕니다. 통 수는 반드시 올림합니다.',
 build:paintCalcDemo}
];` + s.slice(i + key.length); }

{ const m = s.match(/const PROBLEMS=(\{.*?\});/);
  const PR = JSON.parse(m[1]);
  PR['227'] = { sit: '건물 높이를 재야 하는데 사다리도 줄자도 없습니다. 각도기와 줄자로 바닥 거리만 잴 수 있습니다.',
    ask: '높이를 어떻게 구할까? 계산한 값이 실제보다 조금 낮게 나오는 이유는?' };
  PR['228'] = { sit: '400cm 짜리 자재로 150cm 와 90cm 토막을 만들어야 합니다. 150cm 만 잘랐더니 100cm 가 남아 버려졌습니다.',
    ask: '버리는 양을 줄일 방법이 있을까? 어떻게 조합해야 할까?' };
  PR['229'] = { sit: '지난달보다 10kWh 더 썼을 뿐인데 전기 요금이 눈에 띄게 올랐습니다.',
    ask: '왜 그럴까? 평균 단가와 마지막에 붙는 단가는 같은 수일까?' };
  PR['230'] = { sit: 'GPS 좌표 두 점 사이 거리를 계산하려고 위도·경도 차이에 똑같이 111km 를 곱했습니다.',
    ask: '이렇게 해도 될까? 위도와 경도의 1도가 같은 거리일까?' };
  PR['231'] = { sit: '방 네 벽을 두 번 칠하려고 페인트를 사러 갑니다. 한 통은 12㎡ 를 칠할 수 있습니다.',
    ask: '몇 통을 사야 할까? 4.7통이라는 답이 나오면 어떻게 해야 할까?' };
  s = s.replace(m[0], 'const PROBLEMS=' + JSON.stringify(PR) + ';');

  const i0 = s.indexOf('const MISSIONS=');
  const mm = s.slice(i0).match(/^const MISSIONS=\{[\s\S]*?\n\};/);
  const M = new Function('return ' + mm[0].slice('const MISSIONS='.length, -1))();

  M['227'] = [
   {t:'1분 자유 탐색 — 각과 거리를 바꿔 보세요. 붉은 시선이 어떻게 움직이나요?'},
   {t:'오늘의 문제 — 「눈높이를 빠뜨리고 계산」을 켜 보세요. 얼마나 어긋나나요?',
    re:'각의 기준선이 눈높이이기 때문입니다',
    do:'① 체크 상자 켜기 ② 두 값의 차이 확인 ③ 눈높이 값과 견주기',
    hand:'25 × tan40° 를 계산하고 눈높이를 더해 보기'},
   {t:'각이 커지면 — 올려본각을 68° 까지 올려 보세요. tan 이 어떻게 변하나요?',
    re:'1° 만 잘못 재도 크게 어긋납니다',
    do:'① 각을 68 로 ② 높이 값 확인 ③ 각을 1° 만 바꿔 다시 보기',
    hand:'tan67° 와 tan68° 를 계산해 차이를 확인'},
   {t:'(거리, 각, tan, 높이) 를 여섯 줄 기록하세요.'},
   {t:'심화 — 어느 오차가 더 위험한가: 거리를 1m 잘못 재는 것과 각을 1° 잘못 재는 것 중 어느 쪽이 높이 오차를 더 크게 만드는지 각도별로 계산해 비교하세요.'}];

  M['228'] = [
   {t:'1분 자유 탐색 — 세 길이를 바꿔 보세요. 붉은 「버림」 칸이 어떻게 변하나요?'},
   {t:'오늘의 문제 — 「A·B 섞어 넣기」를 누르세요. 버리는 양이 얼마나 줄었나요?',
    re:'조합을 바꾼 것뿐입니다',
    do:'① 버튼 누르기 ② 배치 그림 확인 ③ 두 방식의 버림 비교',
    hand:'400 = 150a + 90b + r 에서 r 을 가장 작게 하는 (a, b) 찾기'},
   {t:'A 만 넣으면 — 「A 만 넣기」를 누르세요. 남는 양이 무엇과 같나요?',
    re:'나눗셈의 나머지입니다',
    do:'① 버튼 누르기 ② 붉은 칸의 길이 확인 ③ 400 ÷ 150 의 나머지와 비교',
    hand:'400 ÷ 150 의 몫과 나머지를 구하기'},
   {t:'(자재, A, B, 두 방식의 버림) 을 여섯 줄 기록하세요 — 버림이 0 이 되는 조합이 있나요?'},
   {t:'심화 — 재단 계획 문제: 필요한 토막이 여러 종류일 때 버리는 양을 최소로 만드는 문제는 「배낭 문제」의 한 종류입니다. 세 종류로 늘려 직접 계획을 세워 보세요.'}];

  M['229'] = [
   {t:'1분 자유 탐색 — 사용량을 옮겨 보세요. 그래프가 어디서 꺾이나요?'},
   {t:'오늘의 문제 — 「경계를 막 넘겨서」를 누르세요. 요금이 얼마나 뛰나요?',
    re:'요금이 크게 늘었습니다',
    do:'① 버튼 누르기 ② 요금 값 확인 ③ 경계 아래 값과 비교',
    hand:'390kWh 와 410kWh 의 요금을 각각 계산해 차를 구하기'},
   {t:'경계 아래 — 「경계 바로 아래로」를 누르세요. 어느 구간인가요?',
    re:'기본요금이 낮게 유지됩니다',
    do:'① 버튼 누르기 ② 구간 확인 ③ 평균 단가 비교',
    hand:'2구간까지의 요금을 손으로 계산'},
   {t:'(사용량, 요금, 평균 단가, 마지막 단가) 를 여섯 줄 기록하세요.'},
   {t:'심화 — 절약의 효과: 10kWh 를 줄일 때 요금이 얼마나 줄어드는지 1·2·3구간에서 각각 계산하고, 「어느 구간에 있을 때 절약 효과가 가장 큰지」 답하세요.'}];

  M['230'] = [
   {t:'1분 자유 탐색 — 위도를 옮겨 보세요. 파란 위도선의 길이가 어떻게 변하나요?'},
   {t:'오늘의 문제 — 위도를 65° 로 올려 보세요. 경도 1도가 얼마나 짧아지나요?',
    re:'cos 이 작아지기 때문입니다',
    do:'① 위도를 65 로 ② 경도 1° 의 거리 확인 ③ 위도 1° 와 비교',
    hand:'111 × cos65° 를 계산'},
   {t:'적도에서는 — 위도를 0° 로 내려 보세요. 두 값이 어떻게 되나요?',
    re:'같은 거리입니다',
    do:'① 위도를 0 으로 ② 두 값 비교 ③ cos 0° 확인',
    hand:'cos 0° = 1 임을 확인하고 두 거리를 비교'},
   {t:'(위도, 경도 1°, 거리, cos 뺀 값) 을 여섯 줄 기록하세요.'},
   {t:'심화 — 지도의 왜곡: 메르카토르 도법에서 고위도의 나라가 실제보다 크게 보이는 이유를 cos 으로 설명하고, 그린란드와 아프리카의 실제 넓이를 조사해 비교하세요.'}];

  M['231'] = [
   {t:'1분 자유 탐색 — 방 크기를 바꿔 보세요. 통의 개수가 언제 늘어나나요?'},
   {t:'오늘의 문제 — 「창문·문 넓이 빼기」를 꺼 보세요. 통이 몇 개 더 필요한가요?',
    re:'창문·문을 빼지 않아',
    do:'① 체크 상자 끄기 ② 필요 넓이 변화 확인 ③ 통 수 비교',
    hand:'5.4㎡ × 2회 ÷ 12㎡ 를 계산'},
   {t:'낭비가 큰 경우 — 가로·세로를 2m, 높이를 2.0m, 칠을 1회로 맞추세요.',
    re:'올림 때문에 생기는 낭비',
    do:'① 세 값을 문제대로 ② 정확한 통 수 확인 ③ 올림한 값과 비교',
    hand:'16 ÷ 12 를 계산해 소수 부분을 확인'},
   {t:'(가로, 세로, 높이, 필요 넓이, 통 수) 를 여섯 줄 기록하세요.'},
   {t:'심화 — 견적서 만들기: 실제 교실이나 방을 실측해 도장 견적을 내고, 여유분을 몇 % 잡을지 근거와 함께 정하세요. 올림 때문에 남는 양도 함께 계산하세요.'}];

  s = s.slice(0, i0) + 'const MISSIONS=' + JSON.stringify(M, null, 1) + ';' + s.slice(i0 + mm[0].length);

  const PR2 = JSON.parse(s.match(/const PROBLEMS=(\{.*?\});/)[1]);
  const labsBlock = s.slice(s.indexOf('const LABS=['), s.indexOf('const PRINS='));
  let bad = 0;
  for (const k of ['227','228','229','230','231']) {
    const li = labsBlock.indexOf('{n:' + k + ',core:');
    const lab = li < 0 ? '' : labsBlock.slice(li, li + 900);
    const texts = M[k].map(x => [x.t, x.do, x.hand].filter(Boolean).join('\n')).join('\n')
      + '\n' + PR2[k].sit + '\n' + PR2[k].ask + '\n' + lab;
    M[k].forEach((x, ix) => { if (x.re && new RegExp(x.re).test(texts)) { console.log(`자기일치! LAB ${k} S${ix+1} — ${x.re}`); bad++; } });
  }
  if (bad) throw new Error('자기일치 ' + bad + '건');
}

/* PRINS */
{
  const key = s.match(/  link:'정규분포\(LAB 153\)의 실무 응용이며, 관리도\(LAB 224\)와 짝을 이룹니다\.'\}\r?\n\];/);
  if (!key) throw new Error('PRINS 끝 앵커 실패');
  s = s.replace(key[0], `  link:'정규분포(LAB 153)의 실무 응용이며, 관리도(LAB 224)와 짝을 이룹니다.'},

/* 227 현장 측량 */
 {tex:[
   {t:'h=d\\\\tan\\\\theta+e', s:'거리와 각으로 높이를 구하고 <b>눈높이</b>를 더합니다.'},
   {t:'\\\\frac{dh}{d\\\\theta}=d\\\\sec^{2}\\\\theta', s:'각이 커질수록 <b>같은 오차가 더 크게</b> 번집니다.'},
   {t:'\\\\tan 67^\\\\circ=2.36,\\\\quad \\\\tan 68^\\\\circ=2.48', s:'1° 차이가 <b>거리의 0.12배</b>만큼 높이를 바꿉니다.'}
  ],
  next:[
   {lv:'바로',   t:'높이 계산', d:'거리 30m, 각 35°, 눈높이 1.6m 의 높이를 구하세요.'},
   {lv:'심화',   t:'오차 비교', d:'거리 1m 오차와 각 1° 오차 중 어느 쪽이 위험한지 계산하세요.'},
   {lv:'프로젝트', t:'교내 측량', d:'학교 건물의 높이를 직접 재어 도면과 비교하세요.'}
  ],
  eq:'h = d·tanθ + 눈높이',
  what:'삼각비를 <b>현장에서 쓰는</b> 방법과 그때 생기는 실수를 함께 보는 실험입니다.',
  probe:'눈높이를 빼먹으면 늘 정확히 눈높이만큼 낮게 나옵니다.',
  link:'삼각비(LAB 5)의 실무판이며, 유효숫자(LAB 221)와 함께 봅니다.'},

/* 228 자재 재단 */
 {tex:[
   {t:'L=aA+bB+r,\\\\qquad r\\\\ge 0', s:'남는 토막 r 을 <b>가장 작게</b> 하는 (a, b) 를 찾습니다.'},
   {t:'b=0 \\\\Rightarrow r=L\\\\bmod A', s:'한 종류만 넣으면 <b>나눗셈의 나머지</b>가 그대로 버려집니다.'},
   {t:'\\\\text{두 종류를 섞으면 } r \\\\text{ 이 줄어든다}', s:'조합만 바꿔도 <b>재료비가 줄어듭니다</b>.'}
  ],
  next:[
   {lv:'바로',   t:'나머지 구하기', d:'400 ÷ 150 의 몫과 나머지를 구하세요.'},
   {lv:'심화',   t:'세 종류', d:'토막이 세 종류일 때 최적 조합을 찾는 방법을 정리하세요.'},
   {lv:'프로젝트', t:'재단표 만들기', d:'실제 목재 규격으로 재단 계획표를 작성하세요.'}
  ],
  eq:'L − (aA + bB) 를 최소로',
  what:'나눗셈의 나머지가 <b>돈이 되는</b> 장면입니다. 조합을 바꾸는 것만으로 낭비가 줄어듭니다.',
  probe:'A 만 넣을 때의 버림이 정확히 400 mod 150 과 같습니다.',
  link:'약수와 배수(LAB 34)의 실무 응용이며, 최적화 문제의 한 종류입니다.'},

/* 229 누진 전기 요금 */
 {tex:[
   {t:'\\\\text{요금}=\\\\text{기본요금}+\\\\sum(\\\\text{구간 사용량}\\\\times\\\\text{단가})', s:'세금과 같은 <b>구간별 계산</b>입니다.'},
   {t:'\\\\text{평균 단가}=\\\\frac{\\\\text{총요금}}{\\\\text{총사용량}}\\\\ne\\\\text{마지막 단가}', s:'두 수를 헷갈리면 <b>절약 계획이 어긋납니다</b>.'},
   {t:'\\\\text{구간을 넘으면 기본요금도 오른다}', s:'그래서 그래프가 <b>계단처럼 꺾입니다</b>.'}
  ],
  next:[
   {lv:'바로',   t:'요금 계산', d:'250kWh 와 450kWh 의 요금을 각각 구하세요.'},
   {lv:'심화',   t:'절약 효과', d:'10kWh 절약의 효과를 구간별로 비교하세요.'},
   {lv:'프로젝트', t:'우리 집 요금', d:'실제 고지서로 구간별 계산을 재현해 보세요.'}
  ],
  eq:'요금 = 기본 + Σ(구간 × 단가)',
  what:'누진 구조가 <b>생활 속에서</b> 어떻게 작동하는지 꺾인 그래프로 보는 실험입니다.',
  probe:'경계를 조금만 넘어도 기본요금까지 함께 올라 요금이 크게 뜁니다.',
  link:'누진세(LAB 203)와 같은 구조이며, 조각함수의 실생활 사례입니다.'},

/* 230 GPS 좌표 */
 {tex:[
   {t:'\\\\text{위도 }1^\\\\circ=\\\\frac{\\\\pi R}{180}\\\\approx 111\\\\ \\\\text{km}', s:'남북 방향은 <b>어디서나 같습니다</b>.'},
   {t:'\\\\text{경도 }1^\\\\circ\\\\approx 111\\\\cos(\\\\text{위도})\\\\ \\\\text{km}', s:'동서 방향은 <b>위도가 높을수록 짧아집니다</b>.'},
   {t:'d=\\\\sqrt{(\\\\Delta\\\\phi\\\\cdot 111)^{2}+(\\\\Delta\\\\lambda\\\\cdot 111\\\\cos\\\\phi)^{2}}', s:'가로에만 <b>cos</b> 이 붙는다는 것이 핵심입니다.'}
  ],
  next:[
   {lv:'바로',   t:'거리 계산', d:'위도 37°에서 0.1° 차이의 거리를 구하세요.'},
   {lv:'심화',   t:'오차 비교', d:'cos 을 빼먹었을 때의 오차를 위도별로 계산하세요.'},
   {lv:'프로젝트', t:'등굣길 거리', d:'GPS 좌표로 집과 학교의 직선거리를 계산해 지도와 비교하세요.'}
  ],
  eq:'경도 1° = 111 cos(위도) km',
  what:'지구가 <b>구</b>라는 사실이 좌표 계산에 어떻게 들어오는지 보는 실험입니다.',
  probe:'위도 60°에서는 경도 1도가 적도의 절반으로 줄어듭니다.',
  link:'호의 길이(LAB 36)의 응용이며, 지도 투영과 이어집니다.'},

/* 231 도포량과 올림 */
 {tex:[
   {t:'S=2(w+d)h-(\\\\text{창문·문})', s:'칠할 넓이는 <b>빼야 할 것</b>을 먼저 뺍니다.'},
   {t:'\\\\text{필요량}=S\\\\times(\\\\text{칠 횟수})\\\\div(\\\\text{한 통의 도포 면적})', s:'횟수를 <b>곱한 뒤</b> 나눕니다.'},
   {t:'\\\\text{통 수}=\\\\lceil \\\\text{필요량} \\\\rceil', s:'통은 나눠 팔지 않으므로 <b>올림</b>합니다.'}
  ],
  next:[
   {lv:'바로',   t:'통 수 계산', d:'가로 5m, 세로 4m, 높이 2.5m 방의 2회 도장 통 수를 구하세요.'},
   {lv:'심화',   t:'낭비 최소', d:'올림 때문에 남는 양이 가장 큰 방 크기를 찾으세요.'},
   {lv:'프로젝트', t:'도장 견적서', d:'실제 공간을 실측해 견적서를 작성하세요.'}
  ],
  eq:'통 수 = ⌈넓이 × 횟수 ÷ 도포 면적⌉',
  what:'현실의 계산이 <b>실수에서 자연수로</b> 넘어가는 자리를 다루는 실험입니다.',
  probe:'4.7통이 나오면 5통을 사야 합니다 — 0.3통은 그대로 남습니다.',
  link:'겉넓이(LAB 39)의 실무 응용이며, 올림·버림의 판단이 필요한 문제입니다.'}
];`);
}

/* THUMBS */
{
  const key = s.match(/   '규격 띠를 벗어난 분포의 꼬리를 칠한 그림'\)\r?\n\];/);
  if (!key) throw new Error('THUMBS 끝 앵커 실패');
  s = s.replace(key[0], `   '규격 띠를 벗어난 분포의 꼬리를 칠한 그림'),

 svg(\`<line x1="18" y1="70" x2="104" y2="70" stroke="\${TC.ink3}" stroke-width="1.4"/>
   <rect x="76" y="26" width="24" height="44" fill="\${TC.blue}" opacity=".22" stroke="\${TC.blue}"/>
   <line x1="26" y1="70" x2="26" y2="58" stroke="\${TC.ink3}" stroke-width="2"/>
   <line x1="26" y1="58" x2="76" y2="26" stroke="\${TC.rose}" stroke-width="2"/>
   <line x1="26" y1="58" x2="76" y2="58" stroke="#9CA3AF" stroke-width="1" stroke-dasharray="3 3"/>
   <text x="60" y="86" font-size="8" font-weight="800" fill="\${TC.ink3}" text-anchor="middle">d·tanθ + 눈높이</text>\`,
   '눈높이에서 건물 꼭대기를 올려본 그림'),

 svg(\`<rect x="18" y="34" width="86" height="22" fill="none" stroke="\${TC.ink3}"/>
   <rect x="18" y="34" width="30" height="22" fill="\${TC.blue}" opacity=".4"/>
   <rect x="48" y="34" width="30" height="22" fill="\${TC.blue}" opacity=".4"/>
   <rect x="78" y="34" width="18" height="22" fill="\${TC.teal}" opacity=".45"/>
   <rect x="96" y="34" width="8" height="22" fill="\${TC.rose}" opacity=".35"/>
   <text x="60" y="74" font-size="8" font-weight="800" fill="\${TC.ink3}" text-anchor="middle">나머지를 줄이기</text>\`,
   '긴 자재를 여러 토막으로 나눈 재단 그림'),

 svg(\`<path d="M20 72 L48 62 L48 60 L76 40 L76 36 L102 14" stroke="\${TC.blue}" stroke-width="2.4" fill="none"/>
   <line x1="48" y1="14" x2="48" y2="76" stroke="\${TC.ink3}" stroke-width="1" stroke-dasharray="3 3"/>
   <line x1="76" y1="14" x2="76" y2="76" stroke="\${TC.ink3}" stroke-width="1" stroke-dasharray="3 3"/>
   <text x="60" y="88" font-size="8" font-weight="800" fill="\${TC.ink3}" text-anchor="middle">꺾이는 요금</text>\`,
   '구간마다 기울기가 꺾이는 요금 그래프'),

 svg(\`<circle cx="60" cy="46" r="30" fill="none" stroke="\${TC.ink3}" stroke-width="1.4"/>
   <line x1="30" y1="46" x2="90" y2="46" stroke="#9CA3AF" stroke-width="1.2"/>
   <line x1="42" y1="28" x2="78" y2="28" stroke="\${TC.blue}" stroke-width="2.4"/>
   <text x="60" y="86" font-size="8" font-weight="800" fill="\${TC.ink3}" text-anchor="middle">111 cos φ</text>\`,
   '위도가 높을수록 짧아지는 위도선 그림'),

 svg(\`<rect x="20" y="26" width="24" height="30" fill="\${TC.blue}" opacity=".2" stroke="\${TC.blue}"/>
   <rect x="46" y="26" width="18" height="30" fill="\${TC.blue}" opacity=".2" stroke="\${TC.blue}"/>
   <rect x="66" y="26" width="24" height="30" fill="\${TC.blue}" opacity=".2" stroke="\${TC.blue}"/>
   <rect x="24" y="32" width="12" height="12" fill="\${TC.rose}" opacity=".3" stroke="\${TC.rose}"/>
   <rect x="94" y="30" width="12" height="26" fill="\${TC.teal}" opacity=".45" stroke="\${TC.teal}"/>
   <text x="60" y="76" font-size="8" font-weight="800" fill="\${TC.ink3}" text-anchor="middle">넓이 → 통 수</text>\`,
   '벽 전개도와 페인트 통을 함께 그린 그림')
];`);
}
fs.writeFileSync(P, s);

/* LABCAT */
{
  const C = 'src/55-catalog.js';
  let c = fs.readFileSync(C, 'utf8');
  const m = c.match(/(\{k:'job',g:'직무 수학 · 공정능력'[^}]*\})(\r?\n\];)/);
  if (!m) throw new Error('LABCAT 끝 앵커 실패');
  c = c.replace(m[0], m[1] + `,
{k:'job',g:'직무 수학 · 현장 측량',b:'눈높이를 더하지 않아 건물 높이가 늘 눈높이만큼 낮게 나옴'},
{k:'job',g:'직무 수학 · 자재 재단',b:'나머지를 무시하고 나눗셈의 몫만 세어 자재가 모자람'},
{k:'job',g:'직무 수학 · 누진 요금',b:'전체 사용량에 마지막 구간 단가를 곱해 요금이 크게 부풀려짐'},
{k:'job',g:'직무 수학 · 좌표와 거리',b:'경도 1도에도 111km 를 그대로 곱해 고위도에서 거리가 과대 계산됨'},
{k:'job',g:'직무 수학 · 도포량 산출',b:'통 수를 반올림해 페인트가 모자라는 경우가 생김'}` + m[2]);
  fs.writeFileSync(C, c);
}
console.log('LAB 227~231 (직무 수학 C · 5종) 설치 완료');
