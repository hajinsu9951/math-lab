// 중3 2차 8종 (LAB 53~60) 통합
import fs from 'node:fs';
let demos = fs.readFileSync('m3b-demos.js', 'utf8');
let labs = fs.readFileSync('m3b-labs.js', 'utf8');
let prins = fs.readFileSync('m3b-prins.js', 'utf8');
let thumbs = fs.readFileSync('m3b-thumbs.js', 'utf8').split('${TC.ink3}').join('#6B7280');

const P = 'src/40-demos.js';
let s = fs.readFileSync(P, 'utf8');
if (s.includes('function xpDemo')) throw new Error('이미 이식됨');

const mThumbHdr = '/* ============ 카드 썸네일 ============';
s = s.replace(mThumbHdr, demos.trimEnd() + '\n\n' + mThumbHdr);

const iL = s.indexOf('const LABS=[');
const eL = s.indexOf('\n];', iL);
s = s.slice(0, eL) + ',\n' + labs.trim().replace(/,\s*$/, '') + s.slice(eL);

const iP = s.indexOf('const PRINS = [');
const eP = s.indexOf('\n];', iP);
s = s.slice(0, eP) + ',\n\n' + prins.trim().replace(/,\s*$/, '') + s.slice(eP);

const iT = s.indexOf('const THUMBS = [');
const eT = s.indexOf('\n];', iT);
s = s.slice(0, eT) + ',\n\n' + thumbs.trim().replace(/,\s*$/, '') + s.slice(eT);

fs.writeFileSync(P, s);

/* 55-catalog: LABCAT 8행 + 승격 8종 제거 */
const PC = 'src/55-catalog.js';
let c = fs.readFileSync(PC, 'utf8');
const ROWS = [
"{k:'m3',g:'중3 · 다항식의 곱셈·인수분해',b:'(a−b)² 에서 겹쳐 뺀 부분을 두 번 빼 b² 만큼 모자람'}",
"{k:'m3',g:'중3 · 삼각비',b:'정삼각형을 반으로 자르며 밑변과 빗변을 모두 반으로 해 값이 어긋남'}",
"{k:'m3',g:'중3 · 삼각비',b:'표 사이 값을 그냥 반올림해 오차가 커짐'}",
"{k:'m3',g:'중3 · 원의 성질',b:'중심각을 그대로 원주각으로 써서 두 배가 됨'}",
"{k:'m3',g:'중3 · 원의 성질',b:'접선이 반지름과 수직이라는 조건을 안 써서 뚫고 지나감'}",
"{k:'m3',g:'중3 · 원의 성질',b:'한 점을 원 밖으로 끌어도 대각의 합을 180°로 표시함'}",
"{k:'m3',g:'중3 · 산점도와 상관관계',b:'사분위수를 정렬 없이 구해 상자가 뒤집힘'}",
"{k:'m3',g:'중3 · 산점도와 상관관계',b:'이상치를 지워도 평균과 상관계수를 다시 계산하지 않아 값이 그대로임'}"];
const iLC = c.indexOf('LABCAT = [');
const eLC = c.indexOf('];', iLC);
const before = c.slice(0, eLC), after = c.slice(eLC);
const lastBrace = before.lastIndexOf('}');
c = before.slice(0, lastBrace + 1) + ',\n' + ROWS.join(',\n') + before.slice(lastBrace + 1) + after;

const DEL = ['곱셈공식을 넓이로 보기', '삼각비의 표와 보간', '특수각의 삼각비를 도형에서 유도',
  '원주각', '원의 접선', '원에 내접하는 사각형의 대각의 합', '상자그림', '이상치를 빼면 상관이 달라진다'];
const lines = c.split(/\r?\n/);
let removed = 0;
const out = [];
for (const ln of lines) {
  const isM3 = ln.includes("{k:'m3'") && ln.includes("t:'");
  const hit = isM3 && DEL.some(t => ln.includes("t:'" + t + "'"));
  if (hit) { removed++; continue; }
  out.push(ln);
}
if (removed !== 8) console.log('※ 삭제 수 확인 필요:', removed);
fs.writeFileSync(PC, out.join('\n'));
console.log('m3b splice 완료 — CATALOG −' + removed);
