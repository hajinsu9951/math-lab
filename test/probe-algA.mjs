// 대수 A(112~116) 정직 완주 + 무조작 감사
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

await run(112, '지수방정식', [
  clickManual,
  () => setv('xeK', 3),
  async () => { await sel('xeA', '2'); await setv('xeK', 8); },
  clickManual,
  async () => { await sel('xeA', '0.5'); await setv('xeK', 4); await clk('xeGt'); },
]);
await run(113, '밑 변환', [
  clickManual,
  async () => { await sel('lbA', '2'); await setv('lbB', 100); },
  () => clk('lbChk'),
  clickManual,
  () => clk('lbSame'),
]);
await run(114, '지수·로그 대칭', [
  clickManual,
  () => setv('elX', 2),
  () => setv('elX', 4),
  clickManual,
  async () => { await sel('elA', '0.5'); await setv('elX', 1); },
]);
await run(115, '지표와 가수', [
  clickManual,
  () => setv('lgN', 100),
  async () => { await sel('lgB', '3'); await setv('lgN', 50); },
  clickManual,
  async () => { await sel('lgB', '2'); await setv('lgN', 200); },
]);
await run(116, '지수 변신', [
  clickManual,
  () => setv('emA', 0.5),
  async () => { await setv('emA', 2); await setv('emQ', 2); },
  clickManual,
  () => setv('emQ', -2),
]);

for (const lab of [112, 113, 114, 115, 116]) {
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
