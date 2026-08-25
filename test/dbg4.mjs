// 9·15·71·85 미완 원인 — 해당 단계에서 화면 문구 확인
import { chromium } from 'playwright';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
const ROOT = dirname(fileURLToPath(import.meta.url));
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1300, height: 1300 } });
await p.goto('file://' + join(ROOT, 'dist', 'index.html'));
const clk = id => p.evaluate(i => { const e = document.getElementById(i); if (e) e.click(); }, id);
const set = (id, v) => p.evaluate(([i, x]) => { const e = document.getElementById(i); e.value = x; e.dispatchEvent(new Event('input', { bubbles: true })); }, [id, v]);
const txt = () => p.evaluate(() => document.querySelector('#mBody').innerText);
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
// 9
await p.evaluate(() => openLab(8)); await p.waitForTimeout(350); await openGate();
await set('lwp', 0.5); await set('lwn', 150); await clk('lwgo'); await p.waitForTimeout(400);
let t = await txt();
console.log('LAB9 %줄:', t.match(/[^\n]*%[^\n]*/g)?.slice(0, 3));
await p.locator('#mX').click(); await p.waitForTimeout(80);
// 15
await p.evaluate(() => openLab(14)); await p.waitForTimeout(350); await openGate();
await clk('rclr'); await p.waitForTimeout(150);
const bb = await p.locator('#r1').boundingBox();
for (let k = 0; k < 11; k++) { await p.mouse.click(bb.x + 22 + k * 30, bb.y + bb.height - 22 - k * 22); await p.waitForTimeout(60); }
t = await txt();
console.log('LAB15 데이터/R²:', t.match(/데이터[^\n]*|R²[^\n]*/g)?.slice(0, 3));
await p.locator('#mX').click(); await p.waitForTimeout(80);
// 71
await p.evaluate(() => openLab(70)); await p.waitForTimeout(350);
await p.evaluate(() => { const bs = [...document.querySelectorAll('#fdCards button')]; for (const x of bs) if (/1\/7/.test(x.textContent)) { x.click(); break; } });
for (let k = 0; k < 16; k++) { await clk('fdStep'); await p.waitForTimeout(60); }
t = await txt();
console.log('LAB71 몫 표시:', t.match(/0\.[\d\s.]*/)?.[0]?.slice(0, 60), '| 142857 재등장?', /14285714/.test(t));
await p.locator('#mX').click(); await p.waitForTimeout(80);
// 85
await p.evaluate(() => openLab(84)); await p.waitForTimeout(350);
const f = await p.evaluate(() => { const c = document.getElementById('tp1'); const r = c.getBoundingClientRect(); return { l: r.left, t: r.top, sx: r.width / c.width, sy: r.height / c.height }; });
const CS = (400 - 70) / 16;
await p.mouse.click(f.l + (40 + 3.5 * CS) * f.sx, f.t + (270 - 2.5 * CS) * f.sy);
await p.waitForTimeout(300);
t = await txt();
console.log('LAB85 찾은:', t.match(/찾은[^\n]*/)?.[0], '| 안내:', t.match(/[^\n]*눌러[^\n]*/)?.[0]?.slice(0, 80));
await b.close();
