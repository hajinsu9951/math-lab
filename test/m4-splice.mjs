// 공통수학1 10종 (LAB 92~101) 통합
import fs from 'node:fs';
const demos = fs.readFileSync('m4-demos.js', 'utf8');
const labs = fs.readFileSync('m4-labs.js', 'utf8');
const prins = fs.readFileSync('m4-prins.js', 'utf8');
const thumbs = fs.readFileSync('m4-thumbs.js', 'utf8');

const P = 'src/40-demos.js';
let s = fs.readFileSync(P, 'utf8');
if (s.includes('function snDemo')) throw new Error('이미 이식됨');

const mThumbHdr = '/* ============ 카드 썸네일 ============';
s = s.replace(mThumbHdr, demos.trimEnd() + '\n\n' + mThumbHdr);
{ const i = s.indexOf('const LABS=['); const e = s.indexOf('\n];', i);
  s = s.slice(0, e) + ',\n' + labs.trim().replace(/,\s*$/, '') + s.slice(e); }
{ const i = s.indexOf('const PRINS = ['); const e = s.indexOf('\n];', i);
  s = s.slice(0, e) + ',\n\n' + prins.trim().replace(/,\s*$/, '') + s.slice(e); }
{ const i = s.indexOf('const THUMBS = ['); const e = s.indexOf('\n];', i);
  s = s.slice(0, e) + ',\n\n' + thumbs.trim().replace(/,\s*$/, '') + s.slice(e); }
fs.writeFileSync(P, s);

/* 55-catalog: LABCAT 10행 + 승격 13종 제거 */
const PC = 'src/55-catalog.js';
let c = fs.readFileSync(PC, 'utf8');
const ROWS = [
"{k:'h11',g:'공통수학1 · 다항식의 연산',b:'k 를 곱하지 않고 더하기만 반복해 둘째 칸부터 계수가 어긋남'}",
"{k:'h11',g:'공통수학1 · 나머지정리',b:'f(a) 대신 f(−a) 를 계산해 나머지의 부호가 뒤집힘'}",
"{k:'h11',g:'공통수학1 · 복소수',b:'×i 를 (a,b)→(b,−a) 로 구현해 회전 방향이 반대(−90°)가 됨'}",
"{k:'h11',g:'공통수학1 · 이차방정식',b:'합·곱을 −b, c 가 아니라 b, −c 와 비교해 늘 불일치로 표시됨'}",
"{k:'h11',g:'공통수학1 · 여러 가지 방정식',b:'극값 부호 곱을 ≤ 0 으로 판정해 접할 때를 실근 3개로 셈'}",
"{k:'h11',g:'공통수학1 · 여러 가지 부등식',b:'D<0 에서 부등호 방향을 안 보고 무조건 「해 없음」으로 표시함'}",
"{k:'h11',g:'공통수학1 · 여러 가지 부등식',b:'이익선을 영역 밖까지 밀어도 최댓값이 계속 커진다고 표시함'}",
"{k:'h11',g:'공통수학1 · 순열과 조합',b:'조합에서 2! 로 나누지 않아 목록은 6개인데 숫자는 12로 표시됨'}",
"{k:'h11',g:'공통수학1 · 행렬',b:'열과 행을 바꿔 읽어 기저 화살표와 도형이 따로 움직임'}",
"{k:'h11',g:'공통수학1 · 행렬',b:'AB 와 BA 를 같은 코드로 계산해 늘 「같다」로 판정함'}"];
const iLC = c.indexOf('LABCAT = [');
const eLC = c.indexOf('];', iLC);
const before = c.slice(0, eLC), after = c.slice(eLC);
const lb = before.lastIndexOf('}');
c = before.slice(0, lb + 1) + ',\n' + ROWS.join(',\n') + before.slice(lb + 1) + after;

const DEL = ['조립제법 시각화', 'f(a) 하나로 나머지 알아맞히기', '인수정리로 근 찾기',
  '복소평면에서 i를 곱하면 90° 회전', '켤레복소수의 대칭', '근과 계수의 관계',
  '삼차방정식의 실근을 그래프로', '이차부등식의 해를 그래프로', '부등식 영역과 선형계획',
  '순열과 조합의 갈림길', '같은 것이 있는 순열', '행렬과 이미지 변환',
  '행렬의 곱은 왜 교환법칙이 안 될까'];
const lines = c.split(/\r?\n/);
let removed = 0; const out = [];
for (const ln of lines) {
  const isMat = ln.includes("{k:'h11'") && ln.includes("t:'");
  const hit = isMat && DEL.some(t => ln.includes("t:'" + t + "'"));
  if (hit) { removed++; continue; }
  out.push(ln);
}
fs.writeFileSync(PC, out.join('\n'));
console.log('m4 splice 완료 — LABS +10, CATALOG −' + removed + ' (기대 13)');
