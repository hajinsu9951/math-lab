// 고급 대수 B(252~256) 정직 완주 + 무조작 감사
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
const clickManual = async () => { await p.evaluate(() => { const el = document.querySelector('.ldi.now .ldk'); if (el && !el.disabled) el.click(); }); await p.waitForTimeout(150); };
const prog = () => p.evaluate(() => (document.querySelector('#ldp') || {}).textContent || '');
async function run(lab, name, steps) {
  await p.evaluate(n => openLab(n), lab - 1);
  await p.waitForTimeout(420);
  for (const st of steps) { await st(); await p.waitForTimeout(340); }
  const pr = await prog();
  console.log(`LAB ${lab} ${name}: ${pr} ${/완주/.test(pr) ? 'OK' : '★미완'}`);
  await p.locator('#mX').click(); await p.waitForTimeout(110);
}

await run(252, '가우스 소거법', [clickManual, () => setv('gsK', 4), () => setv('gsP', 0), clickManual, clickManual]);
await run(253, '생성', [clickManual,
  async () => { await setv('spvx', -2); await setv('spvy', -1); },
  async () => { await setv('spvx', -1); await setv('spvy', 2); await setv('spt', 1); }, clickManual, clickManual]);
await run(254, '부분공간', [clickManual, () => setv('sbB', 0),
  async () => { await setv('sbB', 2); await setv('sbC', 2); }, clickManual, clickManual]);
await run(255, '차원', [clickManual,
  async () => { await p.evaluate(() => { const e = document.getElementById('dm3P'); e.checked = true; e.dispatchEvent(new Event('change', { bubbles: true })); }); await setv('dmN', 3); },
  () => setv('dmN', 4), clickManual, clickManual]);
await run(256, '기저와 좌표', [clickManual,
  async () => { await setv('b2ay', 1); await setv('b2bx', -1); },
  async () => { await setv('b2bx', 2); await setv('b2by', 2); }, clickManual, clickManual]);

for (const lab of [252, 253, 254, 255, 256]) {
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
