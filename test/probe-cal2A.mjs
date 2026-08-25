// 미적분Ⅱ A(172~176) 정직 완주 + 무조작 감사
import { chromium } from 'playwright';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
const ROOT = dirname(fileURLToPath(import.meta.url));
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1300, height: 1300 } });
const errs = [];
p.on('pageerror', e => errs.push('PAGE ' + e.message));
await p.goto('file://' + join(ROOT, 'dist', 'index.html'));
const setv = (id, v) => p.evaluate(([i, x]) => { const e = document.getElementById(i); e.value = x; e.dispatchEvent(new Event('input', { bubbles: true })); }, [id, v]);
const sel = (id, v) => p.evaluate(([i, x]) => { const e = document.getElementById(i); e.value = x; e.dispatchEvent(new Event('change', { bubbles: true })); }, [id, v]);
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

await run(172, '수열의 극한', [clickManual,
  async () => { await sel('slK', 'rt'); await setv('slN', 200); },
  () => sel('slK', 'alt'), clickManual, clickManual]);
await run(173, '등비 수렴', [clickManual,
  async () => { await setv('gcR', 0.5); await setv('gcN', 60); },
  () => setv('gcR', -1), clickManual, clickManual]);
await run(174, '급수', [clickManual,
  async () => { await sel('spK', 'geo'); await setv('spN', 30); },
  async () => { await sel('spK', 'harm'); await setv('spN', 300); }, clickManual, clickManual]);
await run(175, '순환소수', [clickManual,
  async () => { await sel('rdK', 'p9'); await setv('rdN', 16); },
  () => sel('rdK', 'p3'), clickManual, clickManual]);
await run(176, 'sin x / x', [clickManual, () => setv('snX', 80), () => sel('snU', 'deg'), clickManual, clickManual]);

for (const lab of [172, 173, 174, 175, 176]) {
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
