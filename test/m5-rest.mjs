// LAB 102~103 통합 — LABS·PRINS·THUMBS·LABCAT·MISSIONS 한 번에
import fs from 'node:fs';
const demos = fs.readFileSync('m5-demos.js', 'utf8');

const LABS_NEW = `{n:102,core:0,t:'“책상 밖으로 무한히” 카드 쌓기와 조화급수',q:'카드를 얼마나 멀리 내밀 수 있을까?',
 m:['무한급수','조화급수의 발산','무게중심'],a:['구조 안정성','RME 실험의 디지털 전환'],
 note:'2019 RME 수업(종이 카드 실험)의 디지털판. 카드를 끌면 무게중심 판정이 실시간으로 무너짐을 알려 주고, ½·¼·⅙ 규칙을 발견하면 4장만으로 맨 위 카드가 책상 밖 허공에 뜹니다. 이론 한계 ½Hₙ 이 화면에 함께 있어 실험↔이론이 즉시 비교됩니다.',
 build:ovDemo},
{n:103,core:0,t:'“색은 좌표다” RGB 색 좌표 실험실',q:'그림판의 색 코드는 무슨 뜻일까?',
 m:['16진법','내분점','무게중심 좌표'],a:['디지털 색 표현','픽셀과 이미지'],
 note:'2019 STEAM 색공간 수업의 디지털판. 슬라이더로 색 좌표를 옮기면 원색 삼각형 위의 점이 따라 움직이고, 16진수 해독·1:3 내분점 색 만들기·무채색(무게중심) 합성까지 세 도전이 이어집니다. 내분점 공식이 미술 팔레트에서 다시 태어납니다.',
 build:clDemo},`;

const PRINS_NEW = `/* 102 카드 쌓기 */
 {tex:[
   {t:'\\\\text{위 } k \\\\text{장의 한 걸음} = \\\\frac{1}{2k}', s:'위 k장 묶음의 무게중심이 받침 끝에 딱 걸칠 때까지 — 그 최대 한 걸음이 1/(2k) 입니다.'},
   {t:'\\\\text{총 돌출} = \\\\frac{1}{2}\\\\left(1 + \\\\frac{1}{2} + \\\\frac{1}{3} + \\\\cdots + \\\\frac{1}{n}\\\\right)', s:'걸음들을 다 더하면 조화급수의 절반 — 4장이면 1.04 카드, 맨 위 카드가 통째로 밖에 뜹니다.'},
   {t:'1 + \\\\frac{1}{2} + \\\\frac{1}{3} + \\\\cdots = \\\\infty', s:'항은 0으로 가는데 합은 무한 — 카드만 충분하면 돌출은 얼마든지 커집니다. 다리 없이 강을 건너는 수학.'}
  ],
  next:[
   {lv:'바로',   t:'진짜 카드로 재현', d:'트럼프 카드 6장으로 화면의 배치를 실제 책상에서 재현하고, 이론과 실물의 오차 원인을 적으세요.'},
   {lv:'심화',   t:'2카드 돌출 설계', d:'돌출 2카드가 되려면 ½Hₙ ≥ 2, 즉 Hₙ ≥ 4 — 필요한 장수를 계산하고 왜 이렇게 급히 늘어나는지 로그와 이으세요.'},
   {lv:'프로젝트', t:'RME 보고서', d:'실험 설계 → 실패 → 규칙 발견 → 일반화의 전 과정을 원 수업(2019 RME)의 활동 보고서 양식으로 작성해 발표하세요.'}
  ],
  eq:'총 돌출 = ½(1+½+⅓+…+1/n) → ∞',
  what:'항이 0으로 가는 급수도 발산할 수 있다는 반직관을 <b>몸(카드)으로 겪는</b> 실험입니다. 무게중심·점화식·급수가 한 장면에 모입니다.',
  probe:'맨 위부터 밀어야 하는 이유를 확인하세요 — 아래 카드를 먼저 밀면 위 묶음의 무게중심이 즉시 받침을 벗어납니다. 순서가 곧 점화식입니다.',
  link:'급수 단원(LAB 22)의 실물 짝. 2019 RME 수업 모형의 활동 1~5 를 사다리 다섯 단계로 계승한 디지털 전환 사례입니다.'},

/* 103 RGB 색 좌표 */
 {tex:[
   {t:'4B_{(16)} = 4 \\\\times 16 + 11 = 75', s:'16진수 두 자리가 좌표 하나 — 진법이 색 코드라는 실생활 표기로 나타납니다.'},
   {t:'P = \\\\frac{3A + 1B}{4}', s:'빨강 A 와 파랑 B 를 1:3 으로 내분한 색 — 색 합성이 내분점 공식 그 자체입니다.'},
   {t:'\\\\text{무게중심} = \\\\frac{R+G+B}{3} \\\\;\\\\Rightarrow\\\\; R=G=B \\\\text{ (무채색)}', s:'세 원색의 무게중심에서 세 좌표가 같아집니다 — 회색이 삼각형 한가운데인 이유입니다.'}
  ],
  next:[
   {lv:'바로',   t:'우리 반 색 사전', d:'각자 좋아하는 색의 16진 코드를 모아 (R,G,B) 좌표로 환산한 「반 색 사전」을 만드세요.'},
   {lv:'심화',   t:'채도·명도의 좌표화', d:'RGB 최댓값·최솟값으로 명도·채도를 정의하는 식을 조사하고, 같은 채도의 색들이 좌표에서 어떤 모임을 이루는지 탐구하세요.'},
   {lv:'프로젝트', t:'LED 색 공간(원 수업 계승)', d:'2019 수업처럼 아두이노 LED 로 색을 구현하는 순서도를 짜고, 좌표→전류의 변환 규칙을 설계해 보세요.'}
  ],
  eq:'색 = 좌표 (R,G,B) · 합성 = 내분점',
  what:'진법·내분점·무게중심이라는 세 단원이 <b>그림판의 색 코드 하나</b>에서 만나는 융합 실험입니다. 수학이 미술·공학의 언어가 되는 장면입니다.',
  probe:'삼각형 위 점을 보며 슬라이더를 움직이세요 — 한 원색을 키우면 점이 그 꼭짓점으로 끌려갑니다. 가중 무게중심의 정의가 눈으로 보입니다.',
  link:'좌표와 내분점 단원의 응용. 2019 STEAM 색공간 수업(그림판·아두이노)의 디지털 전환이며, 픽셀·이미지(LAB 19)와 이어집니다.'},`;

const THUMBS_NEW = ` svg(\`<rect x="14" y="46" width="52" height="10" fill="\${TC.mute}" opacity=".5"/>
   <rect x="30" y="38" width="34" height="7" fill="\${TC.blue}" opacity=".3" stroke="\${TC.blue}" stroke-width="1"/>
   <rect x="40" y="30" width="34" height="7" fill="\${TC.blue}" opacity=".3" stroke="\${TC.blue}" stroke-width="1"/>
   <rect x="52" y="22" width="34" height="7" fill="\${TC.blue}" opacity=".3" stroke="\${TC.blue}" stroke-width="1"/>
   <rect x="68" y="14" width="34" height="7" fill="\${TC.teal}" opacity=".45" stroke="\${TC.teal}" stroke-width="1.2"/>
   <path d="M66 58 V12" stroke="\${TC.rose}" stroke-width="1.2" stroke-dasharray="3 2"/>
   <text x="96" y="52" font-size="8.5" font-weight="800" fill="\${TC.rose}">절벽 밖!</text>\`,
   '카드가 계단처럼 밀려 맨 위 장이 책상 밖에 뜬 그림'),

 svg(\`<path d="M28 52 L60 12 L92 52 Z" stroke="\${TC.mute}" stroke-width="1.4" fill="none"/>
   <circle cx="28" cy="52" r="5" fill="#DC2626"/>
   <circle cx="60" cy="12" r="5" fill="#16A34A"/>
   <circle cx="92" cy="52" r="5" fill="#2563EB"/>
   <circle cx="60" cy="38.7" r="4" fill="#9CA3AF" stroke="\${TC.ink}" stroke-width="1"/>
   <circle cx="72" cy="42" r="4.6" fill="#B06AC8" stroke="\${TC.ink}" stroke-width="1.2"/>
   <text x="60" y="62" font-size="8.5" font-weight="800" fill="\${TC.ink3}" text-anchor="middle">색 = 좌표</text>\`,
   '세 원색 삼각형 위에서 색이 좌표점으로 움직이는 그림'),`;

const LABCAT_NEW = [
"{k:'cal2',g:'미적분Ⅱ · 급수 (RME 융합)',b:'무게중심을 카드 묶음이 아니라 낱장 기준으로 판정해 아무리 밀어도 안 무너짐'}",
"{k:'h12',g:'공통수학2 · 평면좌표와 내분점 (STEAM 융합)',b:'내분점을 (A+B)/2 로 고정 계산해 1:3 을 골라도 중점 색이 나옴'}"];

/* ── 40-demos 에 삽입 ── */
const P = 'src/40-demos.js';
let s = fs.readFileSync(P, 'utf8');
if (s.includes('function ovDemo')) throw new Error('이미 이식됨');
const mThumbHdr = '/* ============ 카드 썸네일 ============';
s = s.replace(mThumbHdr, demos.trimEnd() + '\n\n' + mThumbHdr);
{ const i = s.indexOf('const LABS=['); const e = s.indexOf('\n];', i);
  s = s.slice(0, e) + ',\n' + LABS_NEW.replace(/,\s*$/, '') + s.slice(e); }
{ const i = s.indexOf('const PRINS = ['); const e = s.indexOf('\n];', i);
  s = s.slice(0, e) + ',\n\n' + PRINS_NEW.replace(/,\s*$/, '') + s.slice(e); }
{ const i = s.indexOf('const THUMBS = ['); const e = s.indexOf('\n];', i);
  s = s.slice(0, e) + ',\n\n' + THUMBS_NEW.replace(/,\s*$/, '') + s.slice(e); }

/* MISSIONS 102·103 */
{
  const i0 = s.indexOf('const MISSIONS=');
  const m = s.slice(i0).match(/^const MISSIONS=\{[\s\S]*?\n\};/);
  const M = new Function('return ' + m[0].slice('const MISSIONS='.length, -1))();
  M[102] = [
    { t: '카드 4장을 이리저리 끌며 어디까지 버티는지 감을 잡으세요.' },
    { t: '일부러 무너뜨려 보세요 — 몇 장째에서 무너졌다고 나오나요?', re: '무게중심이 받침을 벗어났' },
    { t: '맨 위 카드를 통째로 책상 밖 허공에 띄우세요 (눈금 힌트를 켜도 좋습니다).', re: '완전 돌출' },
    { t: '기록·발견 — 카드 수 2~8장에서 (최대 돌출, 이론 한계) 표를 채우고 ½(1+½+⅓+…) 규칙을 쓰세요.' },
    { t: '적용 — 돌출 2카드가 되려면 몇 장이 필요한지 이론 한계 식으로 추정하세요.' }];
  M[103] = [
    { t: '세 슬라이더를 움직여 색과 삼각형 위 점이 함께 변하는 것을 관찰하세요.' },
    { t: '도전① — 16진 코드 #4B96C8 을 좌표로 해독해 그 색을 만드세요.', re: '해독 성공' },
    { t: '도전② — 빨강과 파랑의 1:3 내분점 색을 찾아내세요.', re: '내분점 \\(1:3\\) 명중' },
    { t: '도전③ — 고정색과 섞어 회색을 만드세요 — 중점의 세 좌표를 같게!', re: '채도 0 도달' },
    { t: '적용 — 내가 좋아하는 색의 16진 코드를 10진 좌표로 환산하고, 어느 꼭짓점에 가까운지 삼각형에서 확인하세요.' }];
  let bad = 0;
  for (const k of Object.keys(M)) {
    const texts = M[k].map(x => x.t).join('\n');
    M[k].forEach((x, ix) => { if (x.re && new RegExp(x.re).test(texts)) { console.log('자기일치', k, ix + 1); bad++; } });
  }
  if (bad) throw new Error('자기일치 ' + bad);
  s = s.slice(0, i0) + 'const MISSIONS=' + JSON.stringify(M, null, 1) + ';' + s.slice(i0 + m[0].length);
}
fs.writeFileSync(P, s);

/* LABCAT 2행 */
const PC = 'src/55-catalog.js';
let c = fs.readFileSync(PC, 'utf8');
{ const i = c.indexOf('LABCAT = ['); const e = c.indexOf('];', i);
  const before = c.slice(0, e), after = c.slice(e);
  const lb = before.lastIndexOf('}');
  c = before.slice(0, lb + 1) + ',\n' + LABCAT_NEW.join(',\n') + before.slice(lb + 1) + after; }
fs.writeFileSync(PC, c);
console.log('m5 splice 완료 — LABS 103종');
