// 전문 수학 C(317~321) 정직 완주 + 무조작 감사
import { chromium } from 'playwright';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
const ROOT = dirname(fileURLToPath(import.meta.url));
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1300, height: 1400 } });
const errs = [];
p.on('pageerror', e => errs.push('PAGE ' + e.message));
await p.goto('file://' + join(ROOT, 'dist', 'index.html'));
const setv = (id, v) => p.evaluate(([i, x]) => { const e = document.getElementById(i); e.value = x; e.dispatchEvent(new Event('input', { bubbles: true })); }, [id, v]);
const sel = (id, v) => p.evaluate(([i, x]) => { const e = document.getElementById(i); e.value = x; e.dispatchEvent(new Event('change', { bubbles: true })); }, [id, v]);
const check = (id, v) => p.evaluate(([i, x]) => { const e = document.getElementById(i); e.checked = x; e.dispatchEvent(new Event('change', { bubbles: true })); }, [id, v]);
const clickManual = async () => { await p.evaluate(() => { const el = document.querySelector('.ldi.now .ldk'); if (el && !el.disabled) el.click(); }); await p.waitForTimeout(150); };
const prog = () => p.evaluate(() => (document.querySelector('#ldp') || {}).textContent || '');
async function run(lab, name, steps) {
  await p.evaluate(n => openLab(n), lab - 1);
  await p.waitForTimeout(420);
  for (const st of steps) { await st(); await p.waitForTimeout(360); }
  const pr = await prog();
  console.log(`LAB ${lab} ${name}: ${pr} ${/완주/.test(pr) ? 'OK' : '★미완'}`);
  await p.locator('#mX').click(); await p.waitForTimeout(110);
}

await run(317, '복소함수 z²', [clickManual, () => setv('cxT', 90), () => check('cxBad', true), clickManual, clickManual]);
await run(318, '시계 산술', [clickManual, () => setv('mg2A', 2), () => check('mg2Neg', true), clickManual, clickManual]);
await run(319, '대칭군', [clickManual,
  async () => { await sel('sgA', 'r'); await sel('sgB', 's'); },
  () => check('sgSwap', true), clickManual, clickManual]);
await run(320, '민감도', [clickManual, () => setv('snT', 30), () => sel('snK', 'log'), clickManual, clickManual]);
await run(321, '외삽', [clickManual, () => setv('exD', 6), () => setv('exX', 12), clickManual, clickManual]);

for (const lab of [317, 318, 319, 320, 321]) {
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
