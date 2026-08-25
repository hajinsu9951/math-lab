// 미적분Ⅰ B(132~136) 정직 완주 + 무조작 감사
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
const sel = (id, v) => p.evaluate(([i, x]) => { const e = document.getElementById(i); e.value = x; e.dispatchEvent(new Event('change', { bubbles: true })); }, [id, v]);
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

await run(132, '미분 불가능', [
  clickManual,
  async () => { await sel('cuK', 'abs'); await setv('cuH', 60); },
  () => sel('cuK', 'jump'),
  clickManual, clickManual,
]);
await run(133, '접선·법선', [
  clickManual,
  () => setv('tgA', 0),
  () => setv('tgA', -1),
  clickManual, clickManual,
]);
await run(134, '도함수 부호', [
  clickManual,
  () => clk('sgZero'),
  async () => { await setv('sgB', -3); await clk('sgMark'); },
  clickManual, clickManual,
]);
await run(135, '상자 최적화', [
  clickManual,
  () => clk('bxOpt'),
  async () => { await setv('bxW', 20); await setv('bxH', 20); await setv('bxX', 10); },
  clickManual, clickManual,
]);
await run(136, '위치·속도', [
  clickManual,
  async () => { await sel('moK', 'back'); await setv('moT', 4); },
  () => setv('moT', 7),
  clickManual, clickManual,
]);

for (const lab of [132, 133, 134, 135, 136]) {
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
