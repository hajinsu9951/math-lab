import { chromium } from 'playwright';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
const ROOT = dirname(fileURLToPath(import.meta.url));
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1300, height: 1300 } });
await p.goto('file://' + join(ROOT, 'dist', 'index.html'));
const clk = id => p.evaluate(i => { const e = document.getElementById(i); if (e) e.click(); }, id);
const outOf = id => p.evaluate(i => (document.getElementById(i) || {}).innerText || '', id);
const st = () => p.evaluate(() => [...document.querySelectorAll('.ldi')].map(e => e.classList.contains('done') ? 'D' : e.classList.contains('now') ? 'N' : '-').join(''));
// LAB 24
await p.evaluate(() => openLab(23)); await p.waitForTimeout(400);
await clk('rvP4'); await p.waitForTimeout(200);
for (let i = 0; i < 5; i++) { await clk('rvUp'); await p.waitForTimeout(120); }
console.log('L24 after 와인잔+5up:', st(), '|', (await outOf('rvout')).replace(/\n/g, ' ').slice(0, 120));
await clk('rvFine'); await p.waitForTimeout(300);
console.log('L24 after 128:', await st(), '|', (await outOf('rvout')).replace(/\n/g, ' ').slice(0, 90));
await clk('rvP2'); await p.waitForTimeout(300);
console.log('L24 after 원뿔:', await st(), '|', (await outOf('rvout')).replace(/\n/g, ' ').slice(0, 90));
await p.locator('#mX').click(); await p.waitForTimeout(120);
// LAB 25
await p.evaluate(() => openLab(24)); await p.waitForTimeout(400);
const pick = async v => { await p.evaluate(x => { const bt = document.querySelector('#pfGrid [data-v="' + x + '"]'); if (bt) bt.click(); }, v); await p.waitForTimeout(160); };
await pick(83); await pick(89); await clk('pfAuto'); await p.waitForTimeout(9000);
console.log('L25 after 83x89:', await st(), '|', (await outOf('pfout')).replace(/\n/g, ' ').slice(0, 120));
await pick(7); await pick(31); await clk('pfAuto'); await p.waitForTimeout(2000);
console.log('L25 after 7x31:', await st(), '|', (await outOf('pfout')).replace(/\n/g, ' ').slice(0, 120));
await p.locator('#mX').click(); await p.waitForTimeout(120);
// LAB 32
await p.evaluate(() => openLab(31)); await p.waitForTimeout(400);
console.log('L32 init:', (await outOf('scout')).replace(/\n/g, ' ').slice(0, 80));
const f = await p.evaluate(() => { const c = document.getElementById('sc1'); c.scrollIntoView({block:'center'}); const r = c.getBoundingClientRect(); return { l: r.left, t: r.top, sx: r.width / c.width, sy: r.height / c.height }; });
const drag = async (x1,y1,x2,y2) => { await p.mouse.move(f.l+x1*f.sx, f.t+y1*f.sy); await p.mouse.down(); await p.mouse.move(f.l+x2*f.sx, f.t+y2*f.sy, {steps:18}); await p.mouse.up(); await p.waitForTimeout(280); };
await drag(260,158, 236.6,101.4);
console.log('L32 after 45 시도:', (await outOf('scout')).replace(/\n/g, ' ').slice(0, 80));
await b.close();
