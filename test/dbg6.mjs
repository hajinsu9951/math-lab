import { chromium } from 'playwright';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
const ROOT = dirname(fileURLToPath(import.meta.url));
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1300, height: 1300 } });
await p.goto('file://' + join(ROOT, 'dist', 'index.html'));
const clk = id => p.evaluate(i => { const e = document.getElementById(i); if (e) e.click(); }, id);
const txt = () => p.evaluate(() => document.querySelector('#mBody').innerText);
const prog = () => p.evaluate(() => (document.querySelector('#ldp') || {}).textContent || '');
const clickManual = async () => { await p.evaluate(() => { const el = document.querySelector('.ldi.now .ldk'); if (el && !el.disabled) el.click(); }); await p.waitForTimeout(140); };
const tapCv = (id, x, y) => p.evaluate(([i, cx, cy]) => {
  const c = document.getElementById(i); const r = c.getBoundingClientRect();
  const px = r.left + cx * r.width / c.width, py = r.top + cy * r.height / c.height;
  const ev = t => new PointerEvent(t, { clientX: px, clientY: py, bubbles: true, pointerId: 1, isPrimary: true });
  c.dispatchEvent(ev('pointerdown')); c.dispatchEvent(ev('pointerup'));
}, [id, x, y]);
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
// LAB 85 — 합성 탭
await p.evaluate(() => openLab(84)); await p.waitForTimeout(350);
const CS = (400 - 70) / 16;
await clickManual(); console.log('85 S1:', await prog());
await tapCv('tp1', 40 + 3.5 * CS, 270 - 2.5 * CS); await p.waitForTimeout(350);
console.log('85 (4,3):', await prog(), (await txt()).match(/찾은[^\n]*/)?.[0]);
await tapCv('tp1', 40 + 11.5 * CS, 270 - 4.5 * CS); await p.waitForTimeout(350);
console.log('85 (12,5):', await prog(), (await txt()).match(/찾은[^\n]*/)?.[0]);
await p.locator('#mX').click(); await p.waitForTimeout(80);
// LAB 15 — 11점 후 텍스트·정규식
await p.evaluate(() => openLab(14)); await p.waitForTimeout(350); await openGate();
await clickManual();
await clk('rclr'); await p.waitForTimeout(150);
for (let k = 0; k < 11; k++) { await tapCv('r1', 30 + k * 30, 300 - 30 - k * 22); await p.waitForTimeout(60); }
await p.waitForTimeout(300);
const t = await txt();
console.log('15 데이터·R²:', t.match(/데이터[^\n]*|결정계수[^\n]*/g)?.slice(0, 2));
console.log('15 정규식:', /데이터 1\d개 · 잔차제곱합[\s\S]{0,120}R² = (0\.9[5-9]|1\.000)/.test(t), '| ldp:', await prog());
await b.close();
