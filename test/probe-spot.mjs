// 이식분 표본 프로브 — LAB 64 소금물 · LAB 71 순환소수
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
const clickManual = async () => { await p.evaluate(() => { const el = document.querySelector('.ldi.now .ldk'); if (el && !el.disabled) el.click(); }); await p.waitForTimeout(130); };
const prog = () => p.evaluate(() => (document.querySelector('#ldp') || {}).textContent || '');
async function run(lab, name, steps) {
  await p.evaluate(n => openLab(n), lab - 1);
  await p.waitForTimeout(400);
  for (const st of steps) { await st(); await p.waitForTimeout(300); }
  const pr = await prog();
  console.log(`LAB ${lab} ${name}: ${pr} ${/완주/.test(pr) ? 'OK' : '★미완'}`);
  await p.locator('#mX').click(); await p.waitForTimeout(90);
}

/* 64 소금물: 초기 20g/180g = 10% → 물 +100g ×2 → 20/400 = 5% */
await run(64, '소금물', [
  async () => { await clk('slW'); },                      // 관찰: 물 한 번
  async () => { await clk('slW'); },                      // 두 번째로 5% 도달 → '명중' 자동
  clickManual, clickManual, clickManual,
]);

/* 71 순환소수: 1/8 카드 → 나누기 반복(유한) → 1/7 카드 → 나누기 반복(순환) */
await run(71, '순환소수', [
  async () => {
    await p.evaluate(() => { const bs = [...document.querySelectorAll('#fdCards button')]; for (const x of bs) if (/1\s*\/\s*8|1\/8/.test(x.textContent)) { x.click(); break; } });
    for (let k = 0; k < 6; k++) { await clk('fdStep'); await p.waitForTimeout(90); }
  },
  async () => {
    await p.evaluate(() => { const bs = [...document.querySelectorAll('#fdCards button')]; for (const x of bs) if (/1\s*\/\s*7|1\/7/.test(x.textContent)) { x.click(); break; } });
    for (let k = 0; k < 10; k++) { await clk('fdStep'); await p.waitForTimeout(90); }
  },
  clickManual, clickManual, clickManual,
]);

console.log('pageerrors:', errs.length); errs.slice(0, 5).forEach(e => console.log(e.slice(0, 150)));
await b.close();
