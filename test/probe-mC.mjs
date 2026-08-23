// 배치 C 정직 완주 — LAB 26~31 (드래그 다수)
import { chromium } from 'playwright';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
const ROOT = dirname(fileURLToPath(import.meta.url));
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1300, height: 1300 } });
const errs = [];
p.on('pageerror', e => errs.push('PAGE ' + e.message));
await p.goto('file://' + join(ROOT, 'dist', 'index.html'));
const clk = id => p.evaluate(i => { const e = document.getElementById(i); if (e) e.click(); }, id);
const sel = (id, v) => p.evaluate(([i, x]) => { const e = document.getElementById(i); e.value = x; e.dispatchEvent(new Event('change', { bubbles: true })); }, [id, v]);
const clickManual = async () => { await p.evaluate(() => { const el = document.querySelector('.ldi.now .ldk'); if (el && !el.disabled) el.click(); }); await p.waitForTimeout(150); };
const prog = () => p.evaluate(() => (document.querySelector('#ldp') || {}).textContent || '');
async function cvInfo(id) {
  await p.evaluate(i => { const e = document.getElementById(i); if (e) e.scrollIntoView({ block: 'center' }); }, id);
  await p.waitForTimeout(130);
  return p.evaluate(i => { const c = document.getElementById(i); const r = c.getBoundingClientRect(); return { l: r.left, t: r.top, sx: r.width / c.width, sy: r.height / c.height }; }, id);
}
async function dragCv(cvId, x1, y1, x2, y2) {
  const f = await cvInfo(cvId);
  await p.mouse.move(f.l + x1 * f.sx, f.t + y1 * f.sy); await p.mouse.down();
  await p.mouse.move(f.l + (x1 + x2) / 2 * f.sx, f.t + (y1 + y2) / 2 * f.sy, { steps: 6 });
  await p.mouse.move(f.l + x2 * f.sx, f.t + y2 * f.sy, { steps: 6 });
  await p.mouse.up(); await p.waitForTimeout(240);
}
async function run(lab, name, steps) {
  await p.evaluate(n => openLab(n), lab - 1);
  await p.waitForTimeout(400);
  for (const st of steps) { await st(); await p.waitForTimeout(340); }
  const pr = await prog();
  console.log(`LAB ${lab} ${name}: ${pr} ${/완주/.test(pr) ? 'OK' : '★미완'}`);
  await p.locator('#mX').click(); await p.waitForTimeout(100);
}
// LAB26 좌표: X(v)=26+328*(v+12)/24, 화살표줄 y=96, 수직선 y=150
const izX = v => 26 + 328 * (v + 12) / 24;

/* 26 정수 화살표 — 빼기 전환 → b 음수 → 표 → (−7)+12 */
await run(26, '정수', [
  clickManual,
  () => sel('izop', '-'),
  () => dragCv('iz1', izX(-8), 96, izX(-1), 96),          // op -, b: 3→-4 (끝을 a 오른쪽으로)
  clickManual,
  async () => {
    await sel('izop', '+');
    await dragCv('iz1', izX(-5), 150, izX(-7), 150);       // a → -7
    await p.waitForTimeout(200);
    const bNow = await p.evaluate(() => document.querySelector('#izout').innerText);
    // b 끝을 +12만큼: 끝 = a+b → X(5)
    await dragCv('iz1', izX(-7 + 4), 96, izX(5), 96);      // 현재 b=-4 → 끝 -11? 안전하게 두 번
    await dragCv('iz1', izX(-11), 96, izX(5), 96);
  },
]);
/* 27 성냥개비 — n=5 → n=8 → 규칙 → 심화 */
await run(27, '성냥개비', [
  clickManual,
  async () => { for (let i = 0; i < 4; i++) { await clk('ltAdd'); await p.waitForTimeout(140); } },
  async () => { for (let i = 0; i < 3; i++) { await clk('ltAdd'); await p.waitForTimeout(140); } },
  clickManual, clickManual,
]);
/* 28 저울 — 3조작 → x=4 → 반례 → 심화 */
await run(28, '저울', [
  clickManual,
  async () => { await clk('scS1'); await clk('scA1'); await clk('scD2'); },
  async () => { await clk('scR'); await p.waitForTimeout(120); await clk('scS1'); await clk('scS1'); await clk('scS1'); await clk('scD2'); },
  () => clk('scL1'),
  clickManual,
]);
/* 29 정비례·반비례 — 점3개 → 정비례 → 표 → x=0.5 */
await run(29, '지렛대', [
  clickManual,
  async () => {
    for (const v of [2, 5, 8]) {
      await dragCv('pp1', 30 + 320 * v / 10, 104, 30 + 320 * v / 10, 103);
      await clk('ppRec'); await p.waitForTimeout(150);
    }
  },
  () => sel('ppk', 'dir'),
  clickManual,
  async () => { await sel('ppk', 'inv'); await dragCv('pp1', 30 + 320 * 4 / 10, 104, 30 + 320 * 0.5 / 10, 104); },
]);
/* 30 평행선 — 평행 깨기 → 동측내각 → 표 → 심화 */
await run(30, '평행선', [
  clickManual,
  () => dragCv('pa1', 298, 208, 285, 235),                 // 아랫줄 기울이기
  async () => { await clk('paPar'); await sel('paM', 'in'); },
  clickManual, clickManual,
]);
/* 31 합동 — b 축소(0개) → b 확대(1개) → SSS → 심화 */
await run(31, '합동', [
  clickManual,
  () => dragCv('cg1', 247.7, 211.1, 213, 182),             // b 95→약50
  () => dragCv('cg1', 213, 182, 297, 253),                 // b →약160
  () => sel('cgM', 'sss'),
  clickManual,
]);
console.log('pageerrors:', errs.length, errs.slice(0, 3));
await b.close();
