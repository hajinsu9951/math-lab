// 확률과 통계 A(142~146) 정직 완주 + 무조작 감사
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
const check = (id, v) => p.evaluate(([i, x]) => { const e = document.getElementById(i); e.checked = x; e.dispatchEvent(new Event('change', { bubbles: true })); }, [id, v]);
const setv = (id, v) => p.evaluate(([i, x]) => { const e = document.getElementById(i); e.value = x; e.dispatchEvent(new Event('input', { bubbles: true })); }, [id, v]);
const clickManual = async () => { await p.evaluate(() => { const el = document.querySelector('.ldi.now .ldk'); if (el && !el.disabled) el.click(); }); await p.waitForTimeout(150); };
const prog = () => p.evaluate(() => (document.querySelector('#ldp') || {}).textContent || '');
async function run(lab, name, steps) {
  await p.evaluate(n => openLab(n), lab - 1);
  await p.waitForTimeout(420);
  for (const st of steps) { await st(); await p.waitForTimeout(320); }
  const pr = await prog();
  console.log(`LAB ${lab} ${name}: ${pr} ${/완주/.test(pr) ? 'OK' : '★미완'}`);
  await p.locator('#mX').click(); await p.waitForTimeout(110);
}

await run(142, '파스칼', [
  clickManual,
  async () => { await setv('psN', 10); await setv('psR', 3); },
  () => clk('psSum'),
  clickManual, clickManual,
]);
await run(143, '중복조합', [
  clickManual,
  async () => { await setv('sbN', 5); await setv('sbK', 3); },
  () => check('sbPos', true),
  clickManual, clickManual,
]);
await run(144, '이항정리', [
  clickManual,
  async () => { await setv('beN', 5); await setv('beC', 2); await setv('beR', 3); },
  () => clk('beSum'),
  clickManual, clickManual,
]);
await run(145, '독립과 배반', [
  clickManual,
  () => setv('idI', 0),
  () => setv('idI', 0.2),
  clickManual, clickManual,
]);
await run(146, '기하적 확률', [
  clickManual,
  () => setv('mpT', 10),
  () => clk('mpRun'),
  clickManual, clickManual,
]);

for (const lab of [142, 143, 144, 145, 146]) {
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
