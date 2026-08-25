// 대수 B(117~121) 정직 완주 + 무조작 감사
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

await run(117, '계수 분해', [
  clickManual,
  () => setv('tpB', 2),
  async () => { await setv('tpB', 1); await setv('tpA', 2.5); },
  clickManual,
  async () => { await setv('tpA', 2); await setv('tpB', 2); await setv('tpD', 1); await setv('tpC', 0.75); },
]);
await run(118, '삼각방정식', [
  clickManual,
  () => clk('teHalf'),
  () => clk('teOne'),
  clickManual,
  () => clk('teBig'),
]);
await run(119, '삼각함수 합성', [
  clickManual,
  async () => { await setv('tsA', 3); await setv('tsB', 4); },
  () => clk('tsFit'),
  clickManual, clickManual,
]);
await run(120, '헤론', [
  clickManual,
  async () => { await setv('hrA', 13); await setv('hrB', 14); await setv('hrC', 15); },
  () => clk('hrChk'),
  clickManual,
  async () => { await setv('hrA', 3); await setv('hrB', 4); await setv('hrC', 20); },
]);
await run(121, '푸리에', [
  clickManual,
  async () => { await setv('fr1a', 1.15); await setv('fr3a', 0.4); await setv('fr5a', 0.25); await setv('fr7a', 0.15); },
  async () => { await setv('fr7a', 0.1); },
  clickManual, clickManual,
]);

for (const lab of [117, 118, 119, 120, 121]) {
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
