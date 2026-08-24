// 배치 I 정직 완주 — LAB 5,6,7,9,10,11,13,15 (문제-실험 융합)
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
const clickManual = async () => { await p.evaluate(() => { const el = document.querySelector('.ldi.now .ldk'); if (el && !el.disabled) el.click(); }); await p.waitForTimeout(150); };
const prog = () => p.evaluate(() => (document.querySelector('#ldp') || {}).textContent || '');
async function clickCv(cvId, x, y) {
  await p.evaluate(i => { const e = document.getElementById(i); if (e) e.scrollIntoView({ block: 'center' }); }, cvId);
  await p.waitForTimeout(130);
  const f = await p.evaluate(i => { const c = document.getElementById(i); const r = c.getBoundingClientRect(); return { l: r.left, t: r.top, sx: r.width / c.width, sy: r.height / c.height }; }, cvId);
  await p.mouse.click(f.l + x * f.sx, f.t + y * f.sy);
  await p.waitForTimeout(180);
}
async function run(lab, name, steps) {
  await p.evaluate(n => openLab(n), lab - 1);
  await p.waitForTimeout(400);
  for (const st of steps) { await st(); await p.waitForTimeout(340); }
  const pr = await prog();
  console.log(`LAB ${lab} ${name}: ${pr} ${/완주/.test(pr) ? 'OK' : '★미완'}`);
  await p.locator('#mX').click(); await p.waitForTimeout(100);
}

/* 05 측량 — 문제 재기 → 45° → 눈높이0 → 100m */
await run(5, '측량', [
  clickManual,
  () => clk('tgQ'),
  () => set('tth', 45),
  () => set('teh', 0),
  async () => { await set('tds', 120); await set('tth', 40); },
]);
/* 06 상관 — 반 데이터 → r 0.9 → 음의 상관 → 이상치 */
await run(6, '상관', [
  clickManual,
  () => clk('crq'),
  async () => { await set('crs', 95); await set('crn', 6); },
  () => set('crs', -80),
  async () => { await clk('crq'); await p.waitForTimeout(200); await clickCv('co1', 330, 254); },
]);
/* 07 대푯값 — 광고 재현 → 복귀 → 표 → 심화 */
await run(7, '대푯값', [
  clickManual,
  () => set('rpb', 60000),
  () => set('rpb', 4000),
  clickManual, clickManual,
]);
/* 09 큰수 — 친구 판정(200) → 10% → 표 → 95% */
await run(9, '큰수', [
  clickManual,
  () => set('lwn', 200),
  () => set('lwp', 10.0),
  clickManual,
  () => set('lwn', 30),
]);
/* 10 표준점수 — 수학 → 영어 → z=0 → 2σ */
await run(10, '표준점수', [
  clickManual,
  () => clk('zqM'),
  () => clk('zqE'),
  () => set('zm', 78),
  async () => { await set('zs', 5); await set('zm', 70); await set('zx', 90); },
]);
/* 11 복리 — 아빠 검증(6%) → 3% → 표 → 차이 1억 */
await run(11, '복리', [
  clickManual,
  () => set('cmr', 6.0),
  () => set('cmr', 3.0),
  clickManual,
  async () => { await set('cmp', 5000); await set('cmr', 20); await set('cmy', 40); },
]);
/* 13 순간속도 — 구간단속(t1,h2) → h 최소 → t=4 → 심화 */
await run(13, '순간속도', [
  clickManual,
  async () => { await set('vlt', 1.0); await set('vlh', 2.0); },
  () => set('vlh', 0.02),
  () => set('vlt', 4.0),
  clickManual,
]);
/* 15 회귀 — 카페 데이터 → 이상치 → 표 → 직접 11점 */
await run(15, '회귀', [
  clickManual,
  () => clk('rq'),
  async () => { await clk('rout2'); await p.waitForTimeout(250); await clk('rout2'); },
  clickManual,
  async () => {
    await clk('rclr'); await p.waitForTimeout(150);
    await p.evaluate(() => document.getElementById('r1').scrollIntoView({ block: 'center' }));
    await p.waitForTimeout(120);
    const bb = await p.locator('#r1').boundingBox();
    for (let k = 0; k < 11; k++) {
      await p.mouse.click(bb.x + 22 + k * 30, bb.y + bb.height - 22 - k * 22);
      await p.waitForTimeout(70);
    }
  },
]);
console.log('pageerrors:', errs.length, errs.slice(0, 3));
await b.close();
