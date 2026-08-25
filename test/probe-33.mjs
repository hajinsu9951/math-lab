// LAB 33 단독 재검
import { chromium } from 'playwright';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
const ROOT = dirname(fileURLToPath(import.meta.url));
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1300, height: 1300 } });
await p.goto('file://' + join(ROOT, 'dist', 'index.html'));
const clk = id => p.evaluate(i => { const e = document.getElementById(i); if (e) e.click(); }, id);
const clickManual = async () => { await p.evaluate(() => { const el = document.querySelector('.ldi.now .ldk'); if (el && !el.disabled) el.click(); }); await p.waitForTimeout(150); };
await p.evaluate(() => openLab(32));
await p.waitForTimeout(400);
await clickManual();
await clk('rmRst'); await p.waitForTimeout(150);
const f = await p.evaluate(() => { const c = document.getElementById('rm1'); c.scrollIntoView({ block: 'center' }); const r = c.getBoundingClientRect(); return { l: r.left, t: r.top, sx: r.width / c.width, sy: r.height / c.height }; });
await p.waitForTimeout(150);
await p.mouse.click(f.l + 61.7 * f.sx, f.t + 240 * f.sy); await p.waitForTimeout(320);
await p.mouse.click(f.l + 318.2 * f.sx, f.t + 240 * f.sy); await p.waitForTimeout(320);
await clickManual();
for (let i = 0; i < 7; i++) { await clk('rmDay'); await p.waitForTimeout(160); }
const pr = await p.evaluate(() => (document.querySelector('#ldp') || {}).textContent || '');
console.log('LAB 33 재검:', pr, /완주/.test(pr) ? 'OK' : '★미완');
await b.close();
