// 경제 수학 A(202~206) 정직 완주 + 무조작 감사
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
const setv = (id, v) => p.evaluate(([i, x]) => { const e = document.getElementById(i); e.value = x; e.dispatchEvent(new Event('input', { bubbles: true })); }, [id, v]);
const clickManual = async () => { await p.evaluate(() => { const el = document.querySelector('.ldi.now .ldk'); if (el && !el.disabled) el.click(); }); await p.waitForTimeout(150); };
const prog = () => p.evaluate(() => (document.querySelector('#ldp') || {}).textContent || '');
async function run(lab, name, steps) {
  await p.evaluate(n => openLab(n), lab - 1);
  await p.waitForTimeout(420);
  for (const st of steps) { await st(); await p.waitForTimeout(330); }
  const pr = await prog();
  console.log(`LAB ${lab} ${name}: ${pr} ${/완주/.test(pr) ? 'OK' : '★미완'}`);
  await p.locator('#mX').click(); await p.waitForTimeout(110);
}

await run(202, '실효이자율', [clickManual, () => clk('apDay'), () => setv('apK', 1), clickManual, clickManual]);
await run(203, '누진세', [clickManual, () => clk('tbOver'), () => clk('tbJust'), clickManual, clickManual]);
await run(204, '교차환율', [clickManual, () => setv('fxS', 0), () => setv('fxS', 2), clickManual, clickManual]);
await run(205, '실질가치', [clickManual, () => setv('cpR', 2), () => setv('cpR', 3), clickManual, clickManual]);
await run(206, '현재가치', [clickManual, () => clk('pvCmp'), () => setv('pvR', 1), clickManual, clickManual]);

for (const lab of [202, 203, 204, 205, 206]) {
  await p.evaluate(n => openLab(n), lab - 1);
  await p.waitForTimeout(380);
  const total = await p.evaluate(() => document.querySelectorAll('.ldi').length);
  let clicks = 0;
  for (let k = 0; k < total + 2; k++) {
    if (/완주/.test(await prog())) break;
    const c = await p.evaluate(() => { const el = document.querySelector('.ldi.now .ldk'); if (el && !el.disabled) { el.click(); return true; } return false; });
    if (c) clicks++;
    await p.waitForTimeout(220);
  }
  const doneN = await p.evaluate(() => document.querySelectorAll('.ldi.done').length);
  console.log(`무조작 LAB ${lab}: 클릭 ${clicks} / 완료 ${doneN} ${doneN > clicks ? '★결함' : 'OK'}`);
  await p.locator('#mX').click(); await p.waitForTimeout(100);
}
console.log('pageerrors:', errs.length, errs.slice(0, 3));
await b.close();
