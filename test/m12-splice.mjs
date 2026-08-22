// 76종판의 중1 2차·중2 실험실 31종 (구 45~76, 58 제외) → LAB 61~91 이식
import fs from 'node:fs';
const R = fs.readFileSync('C:/Users/user/claude-work/math-lab-runner/src/40-demos.js', 'utf8');
const RC = fs.readFileSync('C:/Users/user/claude-work/math-lab-runner/src/55-catalog.js', 'utf8');

/* 번호 매핑: 45..57→61..73, 58 제외, 59..76→74..91 */
const MAP = { 58: 53 };                       // 곱셈공식은 이번 판 LAB 53 이 담당
let nn = 61;
for (let o = 45; o <= 76; o++) { if (o === 58) continue; MAP[o] = nn++; }
const remapRefs = txt => txt.replace(/LAB (\d{2})/g, (m, d) => {
  const o = +d; return (o >= 45 && o <= 76) ? 'LAB ' + MAP[o] : m;
});

/* ① 데모 함수 블록 (runner 5153~7743행) */
const RL = R.split('\n');
const iDemoStart = RL.findIndex(l => l.includes('LAB 45 에라토스테네스의 체'));
const iDemoEnd = RL.findIndex(l => l.startsWith('function stepLadder'));
if (iDemoStart < 0 || iDemoEnd < 0) throw new Error('데모 블록 경계 실패');
let demos = RL.slice(iDemoStart, iDemoEnd).join('\n');
demos = remapRefs(demos);
demos = '/* ═══════════════ 중1 2차·중2 (LAB 61~91) — 76종판에서 이식 ═══════════════ */\n' + demos;

/* ② LABS 항목 45..76 (58 제외) */
const iL = R.indexOf('const LABS=[');
const eL = R.indexOf('\n];', iL);
const labsBlock = R.slice(iL, eL);
const parts = labsBlock.split('\n{n:');                // [0]=헤더, 나머지 항목
const entries = [];
for (const p of parts.slice(1)) {
  const n = +p.match(/^(\d+),/)[1];
  if (n >= 45 && n <= 76 && n !== 58)
    entries.push('{n:' + p.replace(/^(\d+),/, MAP[n] + ',').replace(/,\s*$/, ''));
}
if (entries.length !== 31) throw new Error('LABS 추출 ' + entries.length);
const labsNew = remapRefs(entries.join(',\n'));

/* ③ PRINS — 76종판에는 45~76 원리가 없었다 → 신규 저작본(m12-prins.js) 사용 */
const prinsNew = fs.readFileSync('m12-prins.js', 'utf8').trim().replace(/,\s*$/, '');

/* ④ THUMBS 44..75번째 (index 57 제외) */
const iT = R.indexOf('const THUMBS = [');
const eT = R.indexOf('\n];', iT);
const thumbsInner = R.slice(iT + 'const THUMBS = ['.length, eT);
const tEntries = [...thumbsInner.matchAll(/svg\(`[\s\S]*?`,\s*\n?\s*'[^']*'\)/g)].map(m => m[0]);
if (tEntries.length !== 76) throw new Error('THUMBS 분해 ' + tEntries.length);
const tKeep = [];
for (let o = 45; o <= 76; o++) { if (o === 58) continue; tKeep.push(' ' + tEntries[o - 1]); }
const thumbsNew = tKeep.join(',\n\n');

/* ⑤ LABCAT 44..75번째 행 */
const iLC = RC.indexOf('LABCAT = [');
const eLC = RC.indexOf('];', iLC);
const lcRows = [...RC.slice(iLC, eLC).matchAll(/\{k:'[^']*',g:'[^']*',b:'[^']*'\}/g)].map(m => m[0]);
if (lcRows.length < 76) throw new Error('LABCAT 행 ' + lcRows.length);
const lcKeep = [];
for (let o = 45; o <= 76; o++) { if (o === 58) continue; lcKeep.push(lcRows[o - 1]); }

/* ── v326 에 삽입 ── */
const P = 'src/40-demos.js';
let s = fs.readFileSync(P, 'utf8');
if (s.includes('function sieveDemo')) throw new Error('이미 이식됨');
const mThumbHdr = '/* ============ 카드 썸네일 ============';
s = s.replace(mThumbHdr, demos.trimEnd() + '\n\n' + mThumbHdr);
{ const i = s.indexOf('const LABS=['); const e = s.indexOf('\n];', i);
  s = s.slice(0, e) + ',\n' + labsNew + s.slice(e); }
{ const i = s.indexOf('const PRINS = ['); const e = s.indexOf('\n];', i);
  s = s.slice(0, e) + ',\n\n' + prinsNew + s.slice(e); }
{ const i = s.indexOf('const THUMBS = ['); const e = s.indexOf('\n];', i);
  s = s.slice(0, e) + ',\n\n' + thumbsNew + s.slice(e); }
fs.writeFileSync(P, s);

/* ── 55-catalog: LABCAT 31행 + 재료 33종 삭제 ── */
const PC = 'src/55-catalog.js';
let c = fs.readFileSync(PC, 'utf8');
{ const i = c.indexOf('LABCAT = ['); const e = c.indexOf('];', i);
  const before = c.slice(0, e), after = c.slice(e);
  const lb = before.lastIndexOf('}');
  c = before.slice(0, lb + 1) + ',\n' + lcKeep.join(',\n') + before.slice(lb + 1) + after; }
const DEL = ['소수 판정 — 어디까지 나눠 봐야 하나', '절댓값과 평균 오차', '식의 값과 대입 — 계산기 만들기',
  '비율·농도 문제의 방정식화', '기본 작도', '각의 이등분선 작도와 검증', '부채꼴 넓이와 호의 길이 관계',
  '정다면체', '일차부등식 (예산)', '나머지와 해시',
  '순환소수와 부동소수점', '순환마디로 분수 복원하기', '지수법칙 — 종이 접기의 두께', '곱셈공식의 넓이 그림',
  '부등호가 뒤집히는 순간', '연립방정식과 해의 개수', '소거법 시뮬레이터', '기울기와 절편을 따로 움직이기',
  '직선의 방정식 ↔ 그래프 왕복', '삼각형의 무게중심', '평행사변형이 되는 조건', '닮음과 축척',
  '닮음의 중심과 닮음의 위치', '피타고라스 정리', '피타고라스 정리의 역', '피타고라스 수 찾기',
  '합의 법칙 vs 곱의 법칙', '여사건', '독립시행', '조건이 붙으면 확률이 달라진다',
  '닮음비와 넓이 · 부피비', '확률의 덧셈 · 곱셈'];
const lines = c.split(/\r?\n/);
let removed = 0; const out = [];
for (const ln of lines) {
  const isMat = (ln.includes("{k:'m1'") || ln.includes("{k:'m2'")) && ln.includes("t:'");
  const hit = isMat && DEL.some(t => ln.includes("t:'" + t + "'"));
  if (hit) { removed++; continue; }
  out.push(ln);
}
fs.writeFileSync(PC, out.join('\n'));
console.log('이식 완료 — LABS +31, CATALOG −' + removed + ' (기대 32)');
