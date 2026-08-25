// 대표 실험실 — 정직한 조작 경로로 5단계 완주 검증
import { chromium } from 'playwright';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const URL = 'file://' + join(ROOT, 'dist', 'index.html');
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1300, height: 1200 } });
const errs = [];
p.on('pageerror', e => errs.push('PAGE ' + e.message));
await p.goto(URL);

const set = (id, v) => p.evaluate(([i, x]) => { const e = document.getElementById(i); e.value = x; e.dispatchEvent(new Event('input', { bubbles: true })); }, [id, v]);
const clickManual = async () => { // 현재 단계가 수동이면 「해냈어요」
  await p.evaluate(() => { const el = document.querySelector('.ldi.now .ldk'); if (el && !el.disabled) el.click(); });
  await p.waitForTimeout(120);
};
const prog = () => p.evaluate(() => (document.querySelector('#ldp') || {}).textContent || '');
const tick = () => p.waitForTimeout(250);

async function openGate() { // 예상 게이트: 패드에 획을 긋고 「자료 열기」
  const has = await p.evaluate(() => !!document.querySelector('.pgb'));
  if (!has) return;
  const cv = p.locator('.pgpad canvas').first();
  const bb = await cv.boundingBox();
  if (bb) {
    await p.mouse.move(bb.x + 20, bb.y + 20);
    await p.mouse.down();
    await p.mouse.move(bb.x + 120, bb.y + 60, { steps: 8 });
    await p.mouse.move(bb.x + 60, bb.y + 90, { steps: 6 });
    await p.mouse.up();
  }
  await p.waitForTimeout(200);
  await p.evaluate(() => { const b = document.querySelector('[id^="pgGo_"]'); if (b && !b.disabled) b.click(); });
  await p.waitForTimeout(250);
}

async function run(lab, name, steps) {
  await p.evaluate(n => openLab(n), lab - 1);
  await p.waitForTimeout(350);
  await openGate();
  for (const st of steps) { await st(); await tick(); }
  const pr = await prog();
  const done = /완주/.test(pr);
  console.log(`LAB ${String(lab).padStart(2, '0')} ${name}: ${pr} ${done ? 'OK' : '★미완'}`);
  await p.locator('#mX').click(); await p.waitForTimeout(80);
}

/* LAB 01 GPS — S1 기준점2 / S2 3개·오차0 / S3 오차 키움 / S4·S5 수동 */
await run(1, 'GPS', [
  () => set('gk', 2),
  () => set('gk', 3).then(() => set('gn', 0)),
  () => set('gn', 1.0),
  clickManual, clickManual,
]);

/* LAB 04 손익분기 — S1 수동 / S2 기울기 같게 / S3 완전 동일 / S4·S5 수동 */
await run(4, '손익분기', [
  clickManual,
  async () => { await set('pb', 50); await set('pd', 50); await set('pa', 10000); await set('pc', 20000); },
  async () => { await set('pc', 10000); },
  clickManual, clickManual,
]);

/* LAB 05 측량 — S1 수동 / S2 높이 100m+ / S3 수동 / S4·S5 수동 */
await run(5, '측량', [
  clickManual,
  async () => { await set('tds', 100); await set('tth', 60); },
  clickManual, clickManual, clickManual,
]);

/* LAB 06 상관 — S1 수동 / S2 r≥0.9 / S3 r≤−0.5 / S4·S5 수동 */
await run(6, '상관', [
  clickManual,
  () => set('crs', 95),
  () => set('crs', -80),
  clickManual, clickManual,
]);

/* LAB 07 대푯값 — S1 수동 / S2 사장 연봉 올림 / S3 되돌림 / S4·S5 수동 */
await run(7, '대푯값', [
  clickManual,
  () => set('rpb', 60000),
  () => set('rpb', 4000),
  clickManual, clickManual,
]);

/* LAB 09 큰수 — S1 뽑기(적은 n) / S2 n 올려 절반 넘김 / S3~S5 수동 */
await run(9, '큰수법칙', [
  async () => { await set('lwp', 0.5); await set('lwn', 100); await p.evaluate(() => document.getElementById('lwgo') && document.getElementById('lwgo').click()); },
  async () => { await set('lwn', 200); await p.evaluate(() => document.getElementById('lwgo') && document.getElementById('lwgo').click()); await set('lwn', 400); await p.evaluate(() => document.getElementById('lwgo') && document.getElementById('lwgo').click()); },
  clickManual, clickManual, clickManual,
]);

/* LAB 10 z — S1 수동 / S2 점수=평균 / S3 z≥2 / S4·S5 수동 */
await run(10, '표준점수', [
  clickManual,
  async () => { await set('zm', 65); await set('zx', 65); },
  async () => { await set('zs', 5); await set('zx', 80); },
  clickManual, clickManual,
]);

/* LAB 11 복리 — S1 수동 / S2 이자율 12% / S3~S5 수동 */
await run(11, '복리', [
  clickManual,
  () => set('cmr', 12),
  clickManual, clickManual, clickManual,
]);

/* LAB 12 로그눈금 — S1 수동 / S2 로그 전환 버튼 / S3~S5 수동 */
await run(12, '로그눈금', [
  clickManual,
  () => p.evaluate(() => { const seg = document.getElementById('lgseg'); const btns = seg ? seg.querySelectorAll('button') : document.querySelectorAll('#mBody .ctl button'); for (const b of btns) if (/로그/.test(b.textContent)) { b.click(); break; } }),
  clickManual, clickManual, clickManual,
]);

/* LAB 13 순간속도 — S1 수동 / S2 h 최소로 / S3~S5 수동 */
await run(13, '순간속도', [
  clickManual,
  () => p.evaluate(() => { const e = document.getElementById('vlh'); e.value = e.min; e.dispatchEvent(new Event('input', { bubbles: true })); }),
  clickManual, clickManual, clickManual,
]);

/* LAB 14 룬 — S1 수동 / S2 한 자리 틀림 / S3 유효 번호 입력 / S4·S5 수동 */
await run(14, '룬', [
  clickManual,
  () => p.evaluate(() => { const e = document.getElementById('ln'); e.value = '4539148803436466'; e.dispatchEvent(new Event('input', { bubbles: true })); const g = document.getElementById('lgo'); if (g) g.click(); }),
  () => p.evaluate(() => { const e = document.getElementById('ln'); e.value = '4539148803436467'; e.dispatchEvent(new Event('input', { bubbles: true })); const g = document.getElementById('lgo'); if (g) g.click(); }),
  clickManual, clickManual,
]);

console.log('pageerrors:', errs.length); errs.slice(0, 5).forEach(e => console.log(e.slice(0, 140)));
await b.close();
