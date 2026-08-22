// 중3 8종 (LAB 45~52) 통합 — 초안(m3a-*)을 326판 번호 체계로 이식
import fs from 'node:fs';
const SP = 'C:/Users/user/AppData/Local/Temp/claude/E------------2026-AI------------------2026-------------------------/91cbc7f5-81fb-425c-8ff5-2970abc08bdf/scratchpad';

let demos = fs.readFileSync(SP + '/m3a-demos.js', 'utf8');
let labs = fs.readFileSync(SP + '/m3a-labs.js', 'utf8');
let prins = fs.readFileSync(SP + '/m3a-prins.js', 'utf8');
let thumbs = fs.readFileSync(SP + '/m3a-thumbs.js', 'utf8');

/* 번호 77~84 → 45~52 */
const MAP = { 77: 45, 78: 46, 79: 47, 80: 48, 81: 49, 82: 50, 83: 51, 84: 52 };
for (const [o, n] of Object.entries(MAP)) {
  demos = demos.split('LAB ' + o).join('LAB ' + n);
  labs = labs.split('{n:' + o + ',').join('{n:' + n + ',');
  prins = prins.split('/* ' + o + ' ').join('/* ' + n + ' ');
  thumbs = thumbs.split('/* ' + o + ' ').join('/* ' + n + ' ');
}
demos = demos.replace(/\/\* ═+ 중학교 3학년 승격[\s\S]*?\*\/\n*/, '/* ═══════════════ 중학교 3학년 (LAB 45~52) ═══════════════ */\n');

/* 호환 수정 */
thumbs = thumbs.split('${TC.ink3}').join('#6B7280');
prins = prins.replace(/\\\\xrightarrow\{\\\\text\{같은 과정\}\}/g, '\\\\;\\\\Rightarrow\\\\;');
prins = prins.split("\\xrightarrow{\\text{같은 과정}}").join("\\;\\Rightarrow\\;");

/* LAB 45 안내문의 옛 번호 참조 정리 */
demos = demos.split('(LAB 82)').join('(LAB 50)');
prins = prins.split('LAB 82').join('LAB 50').split('LAB 80').join('LAB 48')
  .split('LAB 81').join('LAB 49').split('LAB 83').join('LAB 51')
  .split('LAB 39').join('LAB 39').split('LAB 58').join('LAB 58').split('LAB 68').join('LAB 68')
  .split('LAB 62').join('LAB 62').split('LAB 60').join('LAB 60');

const P = 'src/40-demos.js';
let s = fs.readFileSync(P, 'utf8');

/* ① 데모 함수 — 카드 썸네일 블록 앞에 */
const mThumbHdr = '/* ============ 카드 썸네일 ============';
if (!s.includes(mThumbHdr)) throw new Error('썸네일 마커 없음');
s = s.replace(mThumbHdr, demos.trimEnd() + '\n\n' + mThumbHdr);

/* ② LABS 배열 끝에 8종 추가 */
const iL = s.indexOf('const LABS=[');
const eL = s.indexOf('\n];', iL);
s = s.slice(0, eL) + ',\n' + labs.trim().replace(/,\s*$/, '') + s.slice(eL);

/* ③ PRINS 끝에 8종 */
const iP = s.indexOf('const PRINS = [');
const eP = s.indexOf('\n];', iP);
s = s.slice(0, eP) + ',\n\n' + prins.trim().replace(/,\s*$/, '') + s.slice(eP);

/* ④ THUMBS 끝에 8종 */
const iT = s.indexOf('const THUMBS = [');
const eT = s.indexOf('\n];', iT);
s = s.slice(0, eT) + ',\n\n' + thumbs.trim().replace(/,\s*$/, '') + s.slice(eT);

fs.writeFileSync(P, s);

/* ⑤ 55-catalog.js — LABCAT 8행 추가 + 승격된 CATALOG 8종 제거 */
const PC = 'src/55-catalog.js';
let c = fs.readFileSync(PC, 'utf8');
const ROWS = [
"{k:'m3',g:'중3 · 제곱근과 실수',b:'√2+√3 을 √5 로 표시 — 근호를 덧셈에 통과시킨 코드'}",
"{k:'m3',g:'중3 · 제곱근과 실수',b:'√n 위치를 1.41 반올림값으로 찍어 컴퍼스 자리와 어긋남'}",
"{k:'m3',g:'중3 · 다항식의 곱셈·인수분해',b:'(100−b)(100+b) 를 100²−2b 로 전개해 조각 넓이가 안 맞음'}",
"{k:'m3',g:'중3 · 이차방정식',b:'판별식이 음수일 때 √ 에 NaN 이 들어가 근 마커가 사라짐'}",
"{k:'m3',g:'중3 · 이차방정식',b:'D=0 판정에 부동소수점 == 를 써서 접하는 순간을 놓침'}",
"{k:'m3',g:'중3 · 이차방정식',b:'우변에 (b/2)² 을 더하지 않아 등식이 깨진 채 풀이가 진행됨'}",
"{k:'m3',g:'중3 · 이차함수',b:'(x−p)² 의 p 부호를 반대로 읽어 포물선이 왼쪽으로 감'}",
"{k:'m3',g:'중3 · 이차함수',b:'정의역 검사 없이 w=12 를 허용해 세로가 음수인 울타리가 그려짐'}"];
const iLC = c.indexOf('LABCAT = [');
const eLC = c.indexOf('\n];', iLC);
c = c.slice(0, eLC) + ',\n' + ROWS.join(',\n') + c.slice(eLC);

/* 승격 8종 CATALOG 에서 삭제 (t 로 식별) */
const DEL = ['제곱근과 무리수', '무리수를 수직선 위에 작도하기', '인수분해로 암산하기 (99×101)',
  '근의 공식', '판별식', '완전제곱식으로 고쳐 풀기', '이차함수의 평행이동', '최대·최소로 넓이 최적화'];
let removed = 0;
for (const t of DEL) {
  const re = new RegExp("\\{k:'m3',\\s*t:'" + t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + "'[\\s\\S]*?\\},?\\n", '');
  if (re.test(c)) { c = c.replace(re, ''); removed++; }
  else console.log('CATALOG 미발견:', t);
}
console.log('CATALOG 제거:', removed);
fs.writeFileSync(PC, c);
console.log('m3 splice 완료');
