// 배치 B 정직 완주 — LAB 18,19,20,21,24,25
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
const set = (id, v) => p.evaluate(([i, x]) => { const e = document.getElementById(i); e.value = x; e.dispatchEvent(new Event('input', { bubbles: true })); }, [id, v]);
const sel = (id, v) => p.evaluate(([i, x]) => { const e = document.getElementById(i); e.value = x; e.dispatchEvent(new Event('change', { bubbles: true })); }, [id, v]);
const clickManual = async () => { await p.evaluate(() => { const el = document.querySelector('.ldi.now .ldk'); if (el && !el.disabled) el.click(); }); await p.waitForTimeout(150); };
const prog = () => p.evaluate(() => (document.querySelector('#ldp') || {}).textContent || '');
async function run(lab, name, steps) {
  await p.evaluate(n => openLab(n), lab - 1);
  await p.waitForTimeout(400);
  for (const st of steps) { await st(); await p.waitForTimeout(340); }
  const pr = await prog();
  console.log(`LAB ${lab} ${name}: ${pr} ${/완주/.test(pr) ? 'OK' : '★미완'}`);
  await p.locator('#mX').click(); await p.waitForTimeout(100);
}

/* 18 코사인 — 서연 1위 → 지훈 1위 → 표 → 쌍둥이 1.000 */
await run(18, '코사인', [
  clickManual,
  async () => { await set('ca', 3); await set('cr', 8); },
  async () => { await set('ca', 7); await set('cr', 6); },
  clickManual,
  async () => { await set('ca', 4.5); await set('cr', 1); },
]);
/* 19 합성곱 — 평균 → 가로선 강조 → 표 → 설계 */
await run(19, '합성곱', [
  clickManual,
  () => p.evaluate(() => { [...document.querySelectorAll('#kchips .chip')].find(c => c.dataset.k.includes('평균')).click(); }),
  () => p.evaluate(() => { [...document.querySelectorAll('#kchips .chip')].find(c => c.dataset.k.includes('가로선')).click(); }),
  clickManual, clickManual,
]);
/* 20 파동 — 기본음 끄고 2배음만 → 5배음 → 표 → 심화 */
await run(20, '파동', [
  clickManual,
  async () => { await set('w1a', 0); await set('w3a', 0); await set('w5a', 0); await set('w2a', 0.5); },
  async () => { await set('w1a', 1); await set('w5a', 0.3); },
  clickManual, clickManual,
]);
/* 21 역함수 — 일차 → 점대칭 → 유리 → 무리 정의역 밖 */
await run(21, '역함수', [
  clickManual,
  () => sel('syf', 'lin'),
  () => p.evaluate(() => { const c = document.getElementById('syp'); c.checked = true; c.dispatchEvent(new Event('change', { bubbles: true })); }),
  () => sel('syf', 'rat'),
  async () => { await sel('syf', 'rt'); await set('sya', 0.5); },
]);
/* 24 회전체 — 오차 0.4%↓ → 128장 → 표 → 원뿔 */
await run(24, '회전체', [
  clickManual,
  async () => { for (let i = 0; i < 5; i++) { await clk('rvUp'); await p.waitForTimeout(120); } },
  () => clk('rvFine'),
  clickManual,
  () => clk('rvP2'),
]);
/* 25 소인수 — 기본 217 부수기 → 23×29 → 표 → 83×89 */
await run(25, '소인수', [
  clickManual,
  async () => { for (let i = 0; i < 8; i++) { await clk('pfTry'); await p.waitForTimeout(60); } },
  async () => {
    await p.evaluate(() => { [...document.querySelectorAll('#pfGrid button')].find(b => b.dataset.v === '23').click(); });
    await p.waitForTimeout(120);
    await p.evaluate(() => { [...document.querySelectorAll('#pfGrid button')].find(b => b.dataset.v === '29').click(); });
    await p.waitForTimeout(120);
    await clk('pfAuto'); await p.waitForTimeout(2600);
  },
  clickManual,
  async () => {
    await p.evaluate(() => { [...document.querySelectorAll('#pfGrid button')].find(b => b.dataset.v === '83').click(); });
    await p.waitForTimeout(120);
    await p.evaluate(() => { [...document.querySelectorAll('#pfGrid button')].find(b => b.dataset.v === '89').click(); });
    await p.waitForTimeout(120);
    await clk('pfAuto'); await p.waitForTimeout(6500);
  },
]);
console.log('pageerrors:', errs.length, errs.slice(0, 3));
await b.close();
