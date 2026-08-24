// 신규 2종 정직 완주 + 무조작 감사 — LAB 104, 105
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
const sel = (id, v) => p.evaluate(([i, x]) => { const e = document.getElementById(i); e.value = x; e.dispatchEvent(new Event('change', { bubbles: true })); }, [id, v]);
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

/* 104 종이접기 — 3등분 → 5등분 → 표 → 각 3등분 */
await run(104, '종이접기 등분', [
  clickManual,
  async () => { for (let i = 0; i < 3; i++) { await clk('ogGo'); await p.waitForTimeout(160); } },
  async () => { await sel('ogM', 't5'); await p.waitForTimeout(200); for (let i = 0; i < 3; i++) { await clk('ogGo'); await p.waitForTimeout(160); } },
  clickManual,
  async () => { await sel('ogM', 'a3'); await setv('ogA', 60); await p.waitForTimeout(200); for (let i = 0; i < 4; i++) { await clk('ogGo'); await p.waitForTimeout(160); } },
]);
/* 105 주사위 — 절반 → 10년 → 표 → 10세대 이하 */
await run(105, '주사위 감소', [
  clickManual,
  async () => { for (let i = 0; i < 5; i++) { await clk('dcGo'); await p.waitForTimeout(140); } },
  async () => { await clk('dcRs'); await p.waitForTimeout(200); await clk('dcRun'); },
  clickManual,
  async () => { for (let i = 0; i < 9; i++) { await clk('dcGo'); await p.waitForTimeout(140); } },
]);

/* 무조작 감사 */
for (const lab of [104, 105]) {
  await p.evaluate(n => openLab(n), lab - 1);
  await p.waitForTimeout(400);
  const total = await p.evaluate(() => document.querySelectorAll('.ldi').length);
  let clicks = 0;
  for (let k = 0; k < total + 2; k++) {
    const done = await prog();
    if (/완주/.test(done)) break;
    const c = await p.evaluate(() => { const el = document.querySelector('.ldi.now .ldk'); if (el && !el.disabled) { el.click(); return true; } return false; });
    if (c) clicks++;
    await p.waitForTimeout(240);
  }
  const doneN = await p.evaluate(() => document.querySelectorAll('.ldi.done').length);
  console.log(`무조작 LAB ${lab}: 클릭 ${clicks} / 완료 ${doneN} ${doneN > clicks ? '★결함' : 'OK'}`);
  await p.locator('#mX').click(); await p.waitForTimeout(100);
}
console.log('pageerrors:', errs.length, errs.slice(0, 3));
await b.close();
