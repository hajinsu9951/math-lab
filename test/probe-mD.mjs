// 배치 D 정직 완주 — LAB 32~38
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
  await p.mouse.move(f.l + (x1 + x2) / 2 * f.sx, f.t + (y1 + y2) / 2 * f.sy, { steps: 8 });
  await p.mouse.move(f.l + x2 * f.sx, f.t + y2 * f.sy, { steps: 8 });
  await p.mouse.up(); await p.waitForTimeout(240);
}
async function clickCv(cvId, x, y) {
  const f = await cvInfo(cvId);
  await p.mouse.click(f.l + x * f.sx, f.t + y * f.sy);
  await p.waitForTimeout(180);
}
async function run(lab, name, steps) {
  await p.evaluate(n => openLab(n), lab - 1);
  await p.waitForTimeout(400);
  for (const st of steps) { await st(); await p.waitForTimeout(340); }
  const pr = await prog();
  console.log(`LAB ${lab} ${name}: ${pr} ${/완주/.test(pr) ? 'OK' : '★미완'}`);
  await p.locator('#mX').click(); await p.waitForTimeout(100);
}

/* 32 부채꼴 — 240° → r120 → 표 → r40 */
await run(32, '부채꼴', [
  clickManual,
  () => dragCv('sc1', 140, 88.7, 140, 227.3),   // 각 120→240
  () => dragCv('sc1', 260, 158, 300, 158),      // r 80→120
  clickManual,
  () => dragCv('sc1', 300, 158, 220, 158),      // r 120→40
]);
/* 33 대푯값 — 개점+230 → 280 양극화 → 표 → 하루손님×4 */
await run(33, '대푯값', [
  clickManual,
  async () => { await clk('rmRst'); await p.waitForTimeout(150); await clickCv('rm1', 61.7, 240); },
  () => clickCv('rm1', 318.2, 240),
  clickManual,
  async () => { for (let i = 0; i < 4; i++) { await clk('rmDay'); await p.waitForTimeout(140); } },
]);
/* 34 히스토그램 — 폭5 → 폭40 → 표 → 시작점 끌기 */
await run(34, '히스토그램', [
  clickManual,
  () => clk('hsP1'),
  () => clk('hsP4'),
  clickManual,
  async () => { await clk('hsP2'); await p.waitForTimeout(150); await dragCv('hs1', 34, 272, 46, 272); },
]);
/* 35 톱니바퀴 — 완주 12·18 → 서로소(5,18) → 표 → (5,6) 완주 */
await run(35, '톱니바퀴', [
  clickManual,
  async () => { await clk('gdRun'); await p.waitForTimeout(4200); },
  () => dragCv('gd1', 118, 221.2, 118, 206.5),   // a 12→5
  clickManual,
  async () => {
    await dragCv('gd1', 268, 233.8, 268, 208.6); // b 18→6
    await clk('gdRun'); await p.waitForTimeout(3400);
  },
]);
/* 36 작도 — a 확대 실패 → a=200 경계 → 표 → 심화 */
await run(36, '작도', [
  clickManual,
  () => dragCv('cn1', 220, 212, 320, 212),
  () => dragCv('cn1', 320, 212, 280, 212),
  clickManual, clickManual,
]);
/* 37 타일 — 육각형 3장 → 오각형 실패 → 표 → 팔각형 빈틈90 */
await run(37, '타일', [
  clickManual,
  async () => { for (let i = 0; i < 3; i++) { await clk('pgPut'); await p.waitForTimeout(130); } },
  async () => { await sel('pgN', 5); for (let i = 0; i < 3; i++) { await clk('pgPut'); await p.waitForTimeout(130); } },
  clickManual,
  async () => { await sel('pgN', 8); await clk('pgPut'); await p.waitForTimeout(130); await clk('pgPut'); },
]);
/* 38 입체 — 정팔면체 → 원뿔 단면 → 표 → 구 꼭대기 절단 */
await run(38, '입체', [
  clickManual,
  async () => { await sel('sdK', 'hexa'); await p.waitForTimeout(200); await sel('sdK', 'octa'); },
  () => sel('sdK', 'cone'),
  clickManual,
  async () => { await sel('sdK', 'sphere'); await p.waitForTimeout(200); await dragCv('sd1', 270, 158, 270, 76); },
]);
console.log('pageerrors:', errs.length, errs.slice(0, 3));
await b.close();
