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
const prog = () => p.evaluate(() => (document.querySelector('#ldp') || {}).textContent || '');
const clickManual = async () => { await p.evaluate(() => { const el = document.querySelector('.ldi.now .ldk'); if (el && !el.disabled) el.click(); }); await p.waitForTimeout(140); };
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
// LAB 9 — n=100 이론선 확인
await p.evaluate(() => openLab(8)); await p.waitForTimeout(350); await openGate();
await set('lwp', 0.5); await set('lwn', 100); await clk('lwgo'); await p.waitForTimeout(500);
let t = await txt();
console.log('9 이론선:', t.match(/1 −[^\n]*|적어도[^\n]*%[^\n]*/g)?.slice(0, 2), '| ldp:', await prog());
await p.locator('#mX').click(); await p.waitForTimeout(80);
// LAB 71 — 몫 영역 원문
await p.evaluate(() => openLab(70)); await p.waitForTimeout(350);
await p.evaluate(() => { const bs = [...document.querySelectorAll('#fdCards button')]; for (const x of bs) if (/1\/7/.test(x.textContent)) { x.click(); break; } });
for (let k = 0; k < 16; k++) { await clk('fdStep'); await p.waitForTimeout(120); }
t = await txt();
const i = t.indexOf('0.');
console.log('71 몫 원문:', JSON.stringify(t.slice(i, i + 80)));
await p.locator('#mX').click(); await p.waitForTimeout(80);
// LAB 85 — 진행 추적
await p.evaluate(() => openLab(84)); await p.waitForTimeout(350);
const f = await p.evaluate(() => { const c = document.getElementById('tp1'); const r = c.getBoundingClientRect(); return { l: r.left, t: r.top, sx: r.width / c.width, sy: r.height / c.height }; });
const CS = (400 - 70) / 16;
await clickManual(); console.log('85 after S1:', await prog());
await p.mouse.click(f.l + (40 + 3.5 * CS) * f.sx, f.t + (270 - 2.5 * CS) * f.sy);
await p.waitForTimeout(350); console.log('85 after (4,3):', await prog());
await p.mouse.click(f.l + (40 + 11.5 * CS) * f.sx, f.t + (270 - 4.5 * CS) * f.sy);
await p.waitForTimeout(350); console.log('85 after (12,5):', await prog(), '|', (await txt()).match(/찾은[^\n]*/)?.[0]);
await b.close();
