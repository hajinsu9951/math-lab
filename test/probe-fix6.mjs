// 수리 6종 정직 완주 재검 — LAB 33,39,44,65,80,86
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
async function dragCv(cvId, pts) {
  const f = await cvInfo(cvId);
  await p.mouse.move(f.l + pts[0][0] * f.sx, f.t + pts[0][1] * f.sy);
  await p.mouse.down();
  for (let i = 1; i < pts.length; i++) {
    await p.mouse.move(f.l + pts[i][0] * f.sx, f.t + pts[i][1] * f.sy, { steps: 20 });
  }
  await p.mouse.up(); await p.waitForTimeout(240);
}
async function clickCv(cvId, x, y) {
  const f = await cvInfo(cvId);
  await p.mouse.click(f.l + x * f.sx, f.t + y * f.sy);
  await p.waitForTimeout(160);
}
async function run(lab, name, steps) {
  await p.evaluate(n => openLab(n), lab - 1);
  await p.waitForTimeout(400);
  for (const st of steps) { await st(); await p.waitForTimeout(340); }
  const pr = await prog();
  console.log(`LAB ${lab} ${name}: ${pr} ${/완주/.test(pr) ? 'OK' : '★미완'}`);
  await p.locator('#mX').click(); await p.waitForTimeout(100);
}

/* 33 — 개점+230 → 280 한 켤레(양극화 1:1, 중앙값 255) → 표 → 하루손님 */
await run(33, '대푯값', [
  clickManual,
  async () => { await clk('rmRst'); await p.waitForTimeout(150); await clickCv('rm1', 61.7, 240); },
  () => clickCv('rm1', 318.2, 240),
  clickManual,
  async () => { for (let i = 0; i < 7; i++) { await clk('rmDay'); await p.waitForTimeout(150); } },
]);
/* 39 — 우산 → 피자 → 표 → 정육면체(이제 조건부) */
await run(39, '상자', [
  clickManual,
  () => clk('bxLong'),
  () => clk('bxFlat'),
  clickManual,
  () => clk('bxCube'),
]);
/* 44 — 대충+채점 → 정밀 → 표 → 버스 */
await run(44, '이야기그래프', [
  clickManual,
  async () => { await dragCv('co1', [[44, 256], [336, 44]]); await clk('coChk'); },
  async () => {
    await clk('coClr'); await p.waitForTimeout(150);
    await dragCv('co1', [[44, 256], [117, 171], [175, 171], [278, 44], [336, 44]]);
    await clk('coChk');
  },
  clickManual,
  async () => {
    await sel('coS', '3'); await clk('coClr'); await p.waitForTimeout(150);
    await dragCv('co1', [[44, 256], [131.6, 44], [160.8, 44], [336, 256]]);
    await clk('coChk');
  },
]);
/* 65 — r 축소(안 만남) → B 끌어 AB 200+ → 표 → 심화 */
await run(65, '수직이등분선', [
  clickManual,
  () => dragCv('pb1', [[175.3, 87.8], [147.3, 123]]),
  () => dragCv('pb1', [[270, 150], [330, 160]]),
  clickManual, clickManual,
]);
/* 80 — 조립(스냅) → 사다리꼴 → 표 → 전파괴 */
await run(80, '평행사변형', [
  clickManual,
  () => clk('pgmSnap'),
  () => clk('pgmTrap'),
  clickManual,
  () => dragCv('pgm1', [[260, 90], [210, 150]]),
]);
/* 86 — 또는 → 그리고(모두 확인) → 표 → 심화 */
await run(86, '경우의수', [
  clickManual,
  () => clk('ctOr'),
  () => clk('ctAnd'),
  clickManual, clickManual,
]);
console.log('pageerrors:', errs.length, errs.slice(0, 3));
await b.close();
