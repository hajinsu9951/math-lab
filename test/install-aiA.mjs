// 인공지능 수학 A — LAB 187~191 (판단·텍스트 5종) 전 계층 설치
// 출처 재구성: hajinsu9951.github.io/AI_MATH 의 4·5·8·9·12차시
import fs from 'node:fs';
const P = 'src/40-demos.js';
let s = fs.readFileSync(P, 'utf8');
if (s.includes('function perceptronDemo')) throw new Error('이미 설치됨');
for (const n of ['perceptronDemo','accTrapDemo','textVecDemo','tfidfDemo','jaccardDemo'])
  if (s.includes('function ' + n + '(')) throw new Error('이름 충돌: ' + n);

{ const i = s.indexOf('const LABS=[');
  s = s.slice(0, i) + '\n' + fs.readFileSync('algP-demos.txt', 'utf8') + '\n' + s.slice(i); }

{ const key = ' build:diffEqDemo}\n];';
  const i = s.indexOf(key);
  if (i < 0) throw new Error('LABS 끝 앵커 실패');
  s = s.slice(0, i) + ` build:diffEqDemo},
{n:187,core:0,t:'“직선 하나로 가를 수 있을까” 퍼셉트론과 XOR의 벽',q:'AI 의 첫 겨울은 왜 왔을까?',
 m:['가중합','부등식','선형 분리'],a:['이진 분류','신경망의 층'],
 note:'퍼셉트론의 판단은 부등식 하나이고 경계는 직선입니다. XOR 은 그 직선으로 가를 수 없어 층을 쌓게 됩니다.',
 build:perceptronDemo},
{n:188,core:0,t:'“정확도 95%인데 쓸모가 없다” 무엇을 재고 있나',q:'좋은 모형의 기준은 무엇일까?',
 m:['정확도','정밀도','재현율'],a:['질병 선별','불량 검출'],
 note:'드문 사건에서는 「전부 아니라고」 답해도 정확도가 높습니다. 정밀도·재현율을 함께 봐야 합니다.',
 build:accTrapDemo},
{n:189,core:0,t:'“문장을 숫자로” 원-핫과 빈도수 벡터',q:'컴퓨터는 글을 어떻게 계산할까?',
 m:['단어집합','벡터 표현','원-핫'],a:['문서 분류','검색 엔진'],
 note:'단어집합의 순서를 정해 두고 자리마다 값을 채웁니다. 원-핫은 유무만, 빈도수는 횟수까지 담습니다.',
 build:textVecDemo},
{n:190,core:0,t:'“흔한 단어는 깎는다” TF-IDF',q:'어떤 단어가 그 글의 특징일까?',
 m:['TF-IDF','로그','가중치'],a:['키워드 추출','검색 순위'],
 note:'모든 문서에 나오는 단어는 IDF 가 0 에 가까워 점수가 깎입니다. 그 문서에만 자주 나오는 단어가 남습니다.',
 build:tfidfDemo},
{n:191,core:0,t:'“겹치는 만큼 비슷하다” 자카드 유사도',q:'두 리뷰가 얼마나 닮았는지 어떻게 잴까?',
 m:['집합','교집합과 합집합','유사도'],a:['감성 분석','추천'],
 note:'교집합 크기를 합집합 크기로 나눕니다. 집합으로 보면 반복 횟수는 지워진다는 점이 장점이자 한계입니다.',
 build:jaccardDemo}
];` + s.slice(i + key.length); }

{ const m = s.match(/const PROBLEMS=(\{.*?\});/);
  const PR = JSON.parse(m[1]);
  PR['187'] = { sit: '1958년 퍼셉트론이 발표되자 사람들은 곧 사람처럼 생각하는 기계가 나오리라 기대했습니다. 그러나 1969년, XOR 이라는 간단한 문제 앞에서 멈췄습니다.',
    ask: 'AND 와 OR 은 되는데 XOR 은 왜 안 될까? 무엇이 한계였을까?' };
  PR['188'] = { sit: '어떤 질병 진단 AI 가 "정확도 95%"라고 광고합니다. 그런데 그 병에 걸린 사람은 1000명 중 30명뿐입니다.',
    ask: '이 정확도는 믿을 만할까? 아무 판단도 안 하는 모형의 정확도는 얼마일까?' };
  PR['189'] = { sit: 'AI 에게 "이 영화 정말 재미있다"를 이해시키려면 먼저 숫자로 바꿔야 합니다.',
    ask: '문장을 어떻게 벡터로 바꿀까? 바꾸는 순간 무엇이 사라질까?' };
  PR['190'] = { sit: '영화 리뷰 100편에서 키워드를 뽑았더니 1등이 "영화"였습니다. 모든 리뷰에 들어 있는 단어입니다.',
    ask: '흔한 단어를 어떻게 걸러낼까? 좋은 키워드의 조건은 무엇일까?' };
  PR['191'] = { sit: '리뷰 두 편이 얼마나 비슷한지 판정해 비슷한 취향의 사람을 묶으려 합니다.',
    ask: '두 문장의 닮은 정도를 집합으로 잴 수 있을까? 그 값의 범위는?' };
  s = s.replace(m[0], 'const PROBLEMS=' + JSON.stringify(PR) + ';');

  const i0 = s.indexOf('const MISSIONS=');
  const mm = s.slice(i0).match(/^const MISSIONS=\{[\s\S]*?\n\};/);
  const M = new Function('return ' + mm[0].slice('const MISSIONS='.length, -1))();

  M['187'] = [
   {t:'1분 자유 탐색 — 세 슬라이더를 움직여 보세요. 붉은 직선이 어떻게 도나요?'},
   {t:'오늘의 문제 — AND 에서 「맞는 값 찾아 주기」를 누르세요. 네 점을 모두 맞히나요?',
    re:'퍼셉트론이 풀 수 있는 문제',
    do:'① 문제가 AND 인지 확인 ② 버튼 누르기 ③ 맞힌 개수 확인',
    hand:'w₁ = w₂ = 1, θ = 1.5 를 네 점에 각각 대입해 확인'},
   {t:'벽에 부딪히기 — ③(XOR)을 고르세요. 아무리 옮겨도 4개를 맞힐 수 있나요?',
    re:'한 직선으로는 가를 수 없습니다',
    do:'① 문제 ③ 선택 ② 세 슬라이더를 여러 값으로 시도 ③ 맞힌 개수의 최댓값 확인',
    hand:'네 점의 배치를 그려 직선 하나로 분리 가능한지 보이기'},
   {t:'(문제, w₁, w₂, θ, 맞힌 수) 를 여섯 줄 기록하세요 — AND·OR·XOR 을 모두 포함하세요.'},
   {t:'심화 — 벽을 넘는 법: XOR 을 (OR) AND (NAND) 의 조합으로 만들 수 있음을 보이고, 그것이 왜 「층을 하나 더 쌓는 것」과 같은지 설명하세요. 이것이 다층 신경망의 출발입니다.'}];

  M['188'] = [
   {t:'1분 자유 탐색 — 세 슬라이더를 움직여 보세요. 색칠된 칸이 어떻게 바뀌나요?'},
   {t:'오늘의 문제 — 재현율과 오경보율을 모두 0 으로 하세요. 아무도 못 잡는 모형의 정확도는?',
    re:'정확도만 보면 속습니다',
    do:'① 재현율을 0 으로 ② 오경보율도 0 으로 ③ 정확도 값 읽기',
    hand:'양성 3% 일 때 「전부 정상」 모형의 정확도를 손으로 계산'},
   {t:'쓸 만한 모형 — 재현율을 95%로 올리고 오경보율은 0 으로 두세요.',
    re:'쓸 만한 모형입니다',
    do:'① 재현율 95 ② 오경보율 0 ③ 놓친 환자 수 확인',
    hand:'정밀도와 재현율을 각각 계산해 비교'},
   {t:'(양성 비율, 재현율, 오경보율, 정확도, 정밀도) 를 여섯 줄 기록하세요.'},
   {t:'심화 — 어느 쪽을 택할까: 암 선별검사와 스팸 필터에서 「놓치는 것」과 「잘못 잡는 것」 중 무엇이 더 나쁜지 각각 판단하고, 그에 맞는 지표를 골라 근거와 함께 쓰세요.'}];

  M['189'] = [
   {t:'1분 자유 탐색 — 문장과 표현 방식을 바꿔 보세요. 막대의 길이가 어떻게 변하나요?'},
   {t:'오늘의 문제 — ②(정말이 두 번 나오는 문장)을 원-핫으로 보세요. 무엇이 사라지나요?',
    re:'횟수 정보가 사라졌습니다',
    do:'① 문장 ② 선택 ② 표현을 원-핫으로 ③ 「정말」 자리의 값 확인',
    hand:'그 문장의 단어별 등장 횟수를 손으로 세어 벡터와 비교'},
   {t:'횟수를 살리기 — 표현을 빈도수로 바꾸세요. 어떤 정보가 되살아나나요?',
    re:'반복이 값에 남습니다',
    do:'① 표현을 빈도수로 ② 「정말」 자리의 값 확인 ③ 벡터의 크기 비교',
    hand:'두 표현의 벡터를 나란히 적어 차이를 표시'},
   {t:'(문장, 방식, 벡터, 크기) 를 여섯 줄 기록하세요.'},
   {t:'심화 — 무엇이 남고 무엇이 사라지나: 두 표현 모두 「단어의 순서」를 담지 못합니다. "개가 사람을 물었다"와 "사람이 개를 물었다"가 같은 벡터가 되는 문제를 보이고, 이를 해결하려는 방법(n-그램·문맥 벡터)을 조사하세요.'}];

  M['190'] = [
   {t:'1분 자유 탐색 — 문서 수 슬라이더를 움직여 보세요. 「영화」의 막대가 어떻게 변하나요?'},
   {t:'오늘의 문제 — 점수 방식을 ②(빈도수만)로 바꾸세요. 1등 단어가 무엇인가요?',
    re:'아무 정보도 주지 못하는 단어',
    do:'① 방식을 빈도수만으로 ② 막대의 순서 확인 ③ 1등 단어 읽기',
    hand:'가장 흔한 단어가 왜 특징이 될 수 없는지 한 문장으로 쓰기'},
   {t:'흔한 단어 깎기 — 방식을 ①(TF × IDF)로 되돌리고 문서 수를 10 으로 올리세요.',
    re:'IDF 가 0 에 가까워 점수가 깎였습니다',
    do:'① 방식을 TF × IDF 로 ② 문서 수를 10 으로 ③ 「영화」의 점수 확인',
    hand:'log(10/10) 을 계산해 0 임을 확인'},
   {t:'(방식, 영화 DF, IDF, 1등 단어) 를 여섯 줄 기록하세요.'},
   {t:'심화 — 로그를 쓰는 이유: IDF 에 로그가 없으면 값이 어떻게 되는지 계산해 보고, 로그가 「차이를 완만하게 누르는」 역할을 한다는 점을 LAB 12(로그 스케일)와 이어 설명하세요.'}];

  M['191'] = [
   {t:'1분 자유 탐색 — 두 리뷰를 바꿔 보세요. 겹치는 단어가 어디에 표시되나요?'},
   {t:'오늘의 문제 — A 와 B 를 같은 리뷰로 맞추세요. 유사도가 얼마인가요?',
    re:'유사도가 1 입니다',
    do:'① A 는 ① ② B 는 ④ (같은 문장) ③ 교집합과 합집합 크기 확인',
    hand:'A = B 일 때 |A∩B| 와 |A∪B| 가 같아지는 이유를 쓰기'},
   {t:'전혀 다른 리뷰 — B 를 ⑤(부정 리뷰)로 바꾸세요. 유사도가 얼마인가요?',
    re:'유사도가 0 입니다',
    do:'① B 를 ⑤ 로 ② 붉은 글자가 있는지 확인 ③ 값 읽기',
    hand:'교집합이 공집합일 때의 값을 확인'},
   {t:'(A, B, 교집합, 합집합, J) 를 여섯 줄 기록하세요.'},
   {t:'심화 — 집합의 한계: 「좋다」가 두 번 나와도 값이 같습니다. 이 성질이 유리한 경우와 불리한 경우를 각각 하나씩 들고, 빈도를 살리려면 어떤 유사도(코사인, LAB 19)를 써야 하는지 비교하세요.'}];

  s = s.slice(0, i0) + 'const MISSIONS=' + JSON.stringify(M, null, 1) + ';' + s.slice(i0 + mm[0].length);

  const PR2 = JSON.parse(s.match(/const PROBLEMS=(\{.*?\});/)[1]);
  const labsBlock = s.slice(s.indexOf('const LABS=['), s.indexOf('const PRINS='));
  let bad = 0;
  for (const k of ['187','188','189','190','191']) {
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
  const key = s.match(/  link:'정보 확산\(LAB 3\)의 수학적 뼈대이며, 지수 성장\(LAB 11\)의 일반화입니다\.'\}\r?\n\];/);
  if (!key) throw new Error('PRINS 끝 앵커 실패');
  s = s.replace(key[0], `  link:'정보 확산(LAB 3)의 수학적 뼈대이며, 지수 성장(LAB 11)의 일반화입니다.'},

/* 187 퍼셉트론 */
 {tex:[
   {t:'w_1x_1+w_2x_2\\\\ge\\\\theta \\\\Rightarrow \\\\text{출력 } 1', s:'퍼셉트론의 판단은 <b>부등식 하나</b>입니다.'},
   {t:'w_1x_1+w_2x_2=\\\\theta\\\\ \\\\text{는 직선}', s:'경계가 <b>직선</b>이라는 것 — 여기서 한계가 나옵니다.'},
   {t:'\\\\text{XOR: 직선 하나로 분리 불가능}', s:'한 직선으로 가를 수 없는 배치 — <b>층을 쌓아야</b> 넘습니다.'}
  ],
  next:[
   {lv:'바로',   t:'가중치 찾기', d:'NAND 를 만드는 (w₁, w₂, θ) 를 찾으세요.'},
   {lv:'심화',   t:'XOR 조립', d:'XOR 을 OR 와 NAND 의 조합으로 만들어 보세요.'},
   {lv:'프로젝트', t:'AI 겨울', d:'퍼셉트론의 한계가 AI 역사에 미친 영향을 조사해 발표하세요.'}
  ],
  eq:'w₁x₁ + w₂x₂ ≥ θ',
  what:'AI 의 <b>가장 작은 판단 단위</b>를 직접 조립해 보고, 그 한계까지 만나는 실험입니다.',
  probe:'XOR 에서는 어떤 값을 넣어도 네 점을 모두 맞히지 못합니다 — 직선의 한계입니다.',
  link:'일차부등식(LAB 4)의 응용이며, 완전연결층(LAB 197)으로 이어집니다.'},

/* 188 정확도의 함정 */
 {tex:[
   {t:'\\\\text{정확도}=\\\\frac{TP+TN}{N}', s:'맞힌 비율. <b>드문 사건</b>에서는 쉽게 높아집니다.'},
   {t:'\\\\text{재현율}=\\\\frac{TP}{TP+FN},\\\\qquad \\\\text{정밀도}=\\\\frac{TP}{TP+FP}', s:'<b>놓치지 않았나</b>와 <b>헛짚지 않았나</b> — 서로 다른 물음입니다.'},
   {t:'p=0.03,\\\\ \\\\text{전부 음성} \\\\Rightarrow \\\\text{정확도}=97\\\\%', s:'아무 일도 하지 않아도 <b>97%</b> — 그래서 정확도만으로는 안 됩니다.'}
  ],
  next:[
   {lv:'바로',   t:'지표 계산', d:'주어진 혼동행렬에서 세 지표를 모두 계산하세요.'},
   {lv:'심화',   t:'F1 점수', d:'정밀도와 재현율의 조화평균이 왜 쓰이는지 조사하세요.'},
   {lv:'프로젝트', t:'선별 정책', d:'질병 선별 정책에서 어느 지표를 우선할지 근거를 들어 제안하세요.'}
  ],
  eq:'정확도 ≠ 좋은 모형',
  what:'AI 성능 발표의 <b>숫자를 의심하는 법</b>을 1000칸 그림으로 익히는 실험입니다.',
  probe:'재현율 0 인 모형이 정확도 97% 를 얻습니다 — 한 명도 못 잡았는데도.',
  link:'조건부확률(LAB 147)과 같은 구조이며, 데이터 편향 논의로 이어집니다.'},

/* 189 텍스트 벡터 */
 {tex:[
   {t:'V=\\\\{\\\\text{이},\\\\text{영화},\\\\text{정말},\\\\dots\\\\}', s:'먼저 <b>단어집합</b>과 그 순서를 정합니다.'},
   {t:'\\\\text{원-핫}: v_i\\\\in\\\\{0,1\\\\},\\\\qquad \\\\text{빈도수}: v_i=\\\\text{등장 횟수}', s:'유무만 담을지 <b>횟수까지</b> 담을지의 차이입니다.'},
   {t:'\\\\text{순서 정보는 담기지 않는다}', s:'두 표현 모두 <b>단어의 순서</b>를 잃습니다 — 가방(bag) 이라 부르는 까닭입니다.'}
  ],
  next:[
   {lv:'바로',   t:'벡터 만들기', d:'새 문장을 하나 지어 두 방식으로 벡터를 만드세요.'},
   {lv:'심화',   t:'순서의 문제', d:'같은 벡터가 되는 서로 다른 뜻의 두 문장을 만드세요.'},
   {lv:'프로젝트', t:'문서 분류기', d:'빈도수 벡터로 간단한 스팸 분류기를 설계하세요.'}
  ],
  eq:'문장 → 벡터 (단어집합 순서)',
  what:'AI 가 글을 다루는 <b>첫 단계</b>를 손으로 밟아 보는 실험입니다.',
  probe:'원-핫에서는 「정말 정말」이 「정말」과 똑같이 1 로 적힙니다.',
  link:'코사인 유사도(LAB 19)와 TF-IDF(LAB 190)의 입력이 되는 표현입니다.'},

/* 190 TF-IDF */
 {tex:[
   {t:'\\\\text{TF}=\\\\text{그 문서에서의 등장 횟수}', s:'많이 나오면 중요하다 — <b>절반만 맞는</b> 생각입니다.'},
   {t:'\\\\text{IDF}=\\\\log\\\\frac{N}{df}', s:'모든 문서에 있으면 log 1 = <b>0</b> — 점수가 사라집니다.'},
   {t:'\\\\text{TF-IDF}=\\\\text{TF}\\\\times\\\\text{IDF}', s:'<b>그 문서에만 자주</b> 나오는 단어가 살아남습니다.'}
  ],
  next:[
   {lv:'바로',   t:'점수 계산', d:'df 를 바꿔 가며 IDF 와 최종 점수를 계산하세요.'},
   {lv:'심화',   t:'로그의 역할', d:'로그 없이 N/df 만 쓰면 어떤 문제가 생기는지 값으로 보이세요.'},
   {lv:'프로젝트', t:'키워드 추출', d:'실제 기사 여러 편에서 TF-IDF 로 키워드를 뽑아 비교하세요.'}
  ],
  eq:'TF-IDF = TF × log(N/df)',
  what:'「흔한 것은 정보가 적다」는 <b>정보의 기본 원리</b>를 점수로 구현하는 실험입니다.',
  probe:'모든 문서에 나오는 단어의 점수가 0 이 됩니다 — 정확히 log 1 입니다.',
  link:'로그 스케일(LAB 12)의 응용이며, 텍스트 벡터(LAB 189)의 다음 단계입니다.'},

/* 191 자카드 유사도 */
 {tex:[
   {t:'J(A,B)=\\\\frac{|A\\\\cap B|}{|A\\\\cup B|}', s:'겹친 개수를 <b>전체 개수</b>로 나눕니다.'},
   {t:'0\\\\le J\\\\le 1,\\\\quad J=1 \\\\iff A=B', s:'값의 범위가 <b>0 과 1 사이</b>로 정해져 비교하기 좋습니다.'},
   {t:'\\\\text{집합이므로 중복은 한 번만}', s:'반복 횟수가 <b>지워집니다</b> — 장점이자 한계입니다.'}
  ],
  next:[
   {lv:'바로',   t:'값 계산', d:'두 리뷰 조합마다 J 를 손으로 계산해 화면과 대조하세요.'},
   {lv:'심화',   t:'코사인과 비교', d:'같은 문장 쌍을 코사인 유사도로도 재어 결과를 비교하세요.'},
   {lv:'프로젝트', t:'추천 만들기', d:'취향이 비슷한 사람을 자카드 유사도로 묶는 절차를 설계하세요.'}
  ],
  eq:'J = |A∩B| / |A∪B|',
  what:'집합 연산이 곧 <b>유사도 계산</b>이 되는 장면입니다. 감성 분석의 가장 단순한 형태입니다.',
  probe:'같은 문장이면 정확히 1, 겹치는 단어가 없으면 정확히 0 입니다.',
  link:'집합(LAB 7)의 실전 응용이며, 코사인 유사도(LAB 19)와 짝을 이룹니다.'}
];`);
}

/* THUMBS */
{
  const key = s.match(/   '기울기장을 따라간 해 곡선 그림'\)\r?\n\];/);
  if (!key) throw new Error('THUMBS 끝 앵커 실패');
  s = s.replace(key[0], `   '기울기장을 따라간 해 곡선 그림'),

 svg(\`<circle cx="34" cy="66" r="6" fill="#9CA3AF"/><circle cx="34" cy="26" r="6" fill="\${TC.blue}"/>
   <circle cx="86" cy="66" r="6" fill="\${TC.blue}"/><circle cx="86" cy="26" r="6" fill="#9CA3AF"/>
   <line x1="18" y1="20" x2="102" y2="72" stroke="\${TC.rose}" stroke-width="2.2"/>
   <text x="60" y="86" font-size="8" font-weight="800" fill="\${TC.ink3}" text-anchor="middle">XOR 의 벽</text>\`,
   '네 점을 직선 하나로 가를 수 없는 XOR 그림'),

 svg(\`<rect x="20" y="20" width="80" height="46" fill="#EDF0F4"/>
   <rect x="20" y="20" width="10" height="8" fill="\${TC.rose}" opacity=".8"/>
   <rect x="31" y="20" width="10" height="8" fill="\${TC.rose}" opacity=".8"/>
   <text x="60" y="58" font-size="9" font-weight="800" fill="\${TC.ink3}" text-anchor="middle">97%?</text>
   <text x="60" y="80" font-size="8" font-weight="800" fill="\${TC.rose}" text-anchor="middle">놓친 환자</text>\`,
   '대부분이 음성인 격자에서 놓친 양성을 표시한 그림'),

 svg(\`<text x="60" y="26" font-size="10" font-weight="800" fill="\${TC.ink3}" text-anchor="middle">이 영화 정말</text>
   <rect x="26" y="38" width="14" height="14" fill="\${TC.blue}" opacity=".45"/>
   <rect x="44" y="38" width="14" height="14" fill="\${TC.blue}" opacity=".45"/>
   <rect x="62" y="38" width="14" height="14" fill="\${TC.blue}" opacity=".45"/>
   <rect x="80" y="38" width="14" height="14" fill="#EDF0F4"/>
   <text x="60" y="70" font-size="9" font-weight="800" fill="\${TC.ink3}" text-anchor="middle">(1, 1, 1, 0)</text>\`,
   '문장이 0과 1의 벡터로 바뀐 그림'),

 svg(\`<rect x="30" y="24" width="64" height="12" fill="\${TC.rose}" opacity=".3"/>
   <rect x="30" y="42" width="30" height="12" fill="\${TC.blue}" opacity=".45"/>
   <rect x="30" y="60" width="18" height="12" fill="\${TC.blue}" opacity=".45"/>
   <text x="24" y="34" font-size="8" font-weight="800" fill="\${TC.ink3}" text-anchor="end">영화</text>
   <text x="24" y="52" font-size="8" font-weight="800" fill="\${TC.ink3}" text-anchor="end">연출</text>
   <text x="60" y="86" font-size="8" font-weight="800" fill="\${TC.ink3}" text-anchor="middle">TF × IDF</text>\`,
   '흔한 단어의 점수가 깎인 막대 그림'),

 svg(\`<circle cx="48" cy="44" r="24" fill="\${TC.blue}" opacity=".28" stroke="\${TC.blue}"/>
   <circle cx="72" cy="44" r="24" fill="\${TC.teal}" opacity=".28" stroke="\${TC.teal}"/>
   <text x="60" y="48" font-size="9" font-weight="800" fill="\${TC.rose}" text-anchor="middle">∩</text>
   <text x="60" y="80" font-size="8" font-weight="800" fill="\${TC.ink3}" text-anchor="middle">|A∩B| / |A∪B|</text>\`,
   '두 집합의 겹친 부분으로 유사도를 재는 그림')
];`);
}
fs.writeFileSync(P, s);

/* LABCAT */
{
  const C = 'src/55-catalog.js';
  let c = fs.readFileSync(C, 'utf8');
  const m = c.match(/(\{k:'cal2',g:'미적분Ⅱ · 미분방정식'[^}]*\})(\r?\n\];)/);
  if (!m) throw new Error('LABCAT 끝 앵커 실패');
  c = c.replace(m[0], m[1] + `,
{k:'aim',g:'인공지능 수학 · 퍼셉트론',b:'XOR 도 직선 하나로 갈랐다고 표시해 네 점을 모두 맞혔다고 답함'},
{k:'aim',g:'인공지능 수학 · 모형 평가',b:'정확도만 표시하고 재현율·정밀도를 감춰 쓸모없는 모형을 좋다고 함'},
{k:'aim',g:'인공지능 수학 · 텍스트의 벡터화',b:'단어집합의 순서를 문장마다 다르게 잡아 자리끼리 비교가 안 됨'},
{k:'aim',g:'인공지능 수학 · TF-IDF',b:'IDF 에 로그를 빼먹어 흔한 단어와 드문 단어의 점수 차가 지나치게 벌어짐'},
{k:'aim',g:'인공지능 수학 · 유사도',b:'자카드 유사도의 분모를 합집합이 아니라 한쪽 집합 크기로 잡아 값이 1 을 넘음'}` + m[2]);
  fs.writeFileSync(C, c);
}
console.log('LAB 187~191 (인공지능 수학 A · 5종) 설치 완료');
