// LAB 102~103 정직 완주 검증
import { chromium } from 'playwright';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
const ROOT = dirname(fileURLToPath(import.meta.url));
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1300, height: 1400 } });
const errs = [];
p.on('pageerror', e => errs.push('PAGE ' + e.message));
await p.goto('file://' + join(ROOT, 'dist', 'index.html'));
const clk = id => p.evaluate(i => { const e = document.getElementById(i); if (e) e.click(); }, id);
const set = (id, v) => p.evaluate(([i, x]) => { const e = document.getElementById(i); e.value = x; e.dispatchEvent(new Event('input', { bubbles: true })); }, [id, v]);
const clickManual = async () => { await p.evaluate(() => { const el = document.querySelector('.ldi.now .ldk'); if (el && !el.disabled) el.click(); }); await p.waitForTimeout(140); };
const prog = () => p.evaluate(() => (document.querySelector('#ldp') || {}).textContent || '');
async function cvInfo(id) {
  await p.evaluate(i => { const e = document.getElementById(i); if (e) e.scrollIntoView({ block: 'center' }); }, id);
  await p.waitForTimeout(150);
  return p.evaluate(i => { const c = document.getElementById(i); const r = c.getBoundingClientRect(); return { l: r.left, t: r.top, sx: r.width / c.width, sy: r.height / c.height }; }, id);
}
async function dragCv(cvId, x1, y1, x2, y2) {
  const f = await cvInfo(cvId);
  await p.mouse.move(f.l + x1 * f.sx, f.t + y1 * f.sy); await p.mouse.down();
  await p.mouse.move(f.l + (x1 + x2) / 2 * f.sx, f.t + (y1 + y2) / 2 * f.sy, { steps: 6 });
  await p.mouse.move(f.l + x2 * f.sx, f.t + y2 * f.sy, { steps: 6 });
  await p.mouse.up(); await p.waitForTimeout(240);
}
async function openGate() {
  const has = await p.evaluate(() => !!document.querySelector('.pgb'));
  if (!has) return;
  const cv = p.locator('.pgpad canvas').first();
  const bb = await cv.boundingBox();
  if (bb) { await p.mouse.move(bb.x + 20, bb.y + 20); await p.mouse.down(); await p.mouse.move(bb.x + 110, bb.y + 70, { steps: 6 }); await p.mouse.up(); }
  await p.waitForTimeout(180);
  await p.evaluate(() => { const b = document.querySelector('[id^="pgGo_"]'); if (b && !b.disabled) b.click(); });
  await p.waitForTimeout(220);
}
async function run(lab, name, steps) {
  await p.evaluate(n => openLab(n), lab - 1);
  await p.waitForTimeout(400);
  await openGate();
  for (const st of steps) { await st(); await p.waitForTimeout(320); }
  const pr = await prog();
  console.log(`LAB ${lab} ${name}: ${pr} ${/완주/.test(pr) ? 'OK' : '★미완'}`);
  await p.locator('#mX').click(); await p.waitForTimeout(90);
}

/* 102 카드 쌓기 — 행 y: i0=240 i1=224 i2=207 i3=190 */
await run(102, '카드쌓기', [
  clickManual,
  () => dragCv('ov1', 150, 190, 340, 190),                       // 맨 위를 확 밀어 붕괴
  async () => {                                                   // 최적 배치로 완전 돌출
    await clk('ovRst'); await p.waitForTimeout(200);
    await dragCv('ov1', 150, 240, 165, 240);                      // bottom → −0.875
    await dragCv('ov1', 150, 224, 185, 224);                      // i1 → −0.708
    await dragCv('ov1', 150, 207, 215, 207);                      // i2 → −0.458
    await dragCv('ov1', 150, 190, 270, 190);                      // top → 0
  },
  clickManual, clickManual,
]);
/* 103 RGB */
await run(103, 'RGB좌표', [
  clickManual,
  async () => { await clk('clQ1'); await p.waitForTimeout(150);
    await set('clR', 75); await set('clG', 150); await set('clB', 200); },
  async () => { await clk('clQ2'); await p.waitForTimeout(150);
    await p.evaluate(() => { const e = document.getElementById('clTt'); e.value = 2; e.dispatchEvent(new Event('input', { bubbles: true })); }); },
  async () => { await clk('clQ3'); await p.waitForTimeout(150);
    await set('clR', 230); await set('clG', 80); await set('clB', 160); },
  clickManual,
]);

console.log('pageerrors:', errs.length); errs.slice(0, 5).forEach(e => console.log(e.slice(0, 150)));
await b.close();
