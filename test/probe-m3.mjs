// LAB 45~52 — 정직한 조작 경로 5단계 완주 검증
import { chromium } from 'playwright';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1300, height: 1300 } });
const errs = [];
p.on('pageerror', e => errs.push('PAGE ' + e.message));
await p.goto('file://' + join(ROOT, 'dist', 'index.html'));

const clk = (id) => p.evaluate(i => { const e = document.getElementById(i); if (e) e.click(); }, id);
const clickManual = async () => { await p.evaluate(() => { const el = document.querySelector('.ldi.now .ldk'); if (el && !el.disabled) el.click(); }); await p.waitForTimeout(130); };
const prog = () => p.evaluate(() => (document.querySelector('#ldp') || {}).textContent || '');
const tick = () => p.waitForTimeout(300);
const txt = () => p.evaluate(() => document.querySelector('#mBody').innerText);

async function dragCv(cvId, x1, y1, x2, y2) { // 캔버스 내부좌표(속성 기준) → 화면좌표 변환 끌기
  const info = await p.evaluate(id => { const c = document.getElementById(id); const r = c.getBoundingClientRect(); return { l: r.left, t: r.top, sx: r.width / c.width, sy: r.height / c.height }; }, cvId);
  const A = [info.l + x1 * info.sx, info.t + y1 * info.sy], B = [info.l + x2 * info.sx, info.t + y2 * info.sy];
  await p.mouse.move(A[0], A[1]); await p.mouse.down();
  await p.mouse.move((A[0] + B[0]) / 2, (A[1] + B[1]) / 2, { steps: 6 });
  await p.mouse.move(B[0], B[1], { steps: 6 });
  await p.mouse.up();
  await p.waitForTimeout(200);
}
async function run(lab, name, steps) {
  await p.evaluate(n => openLab(n), lab - 1);
  await p.waitForTimeout(400);
  for (const st of steps) { await st(); await tick(); }
  const pr = await prog();
  console.log(`LAB ${lab} ${name}: ${pr} ${/완주/.test(pr) ? 'OK' : '★미완'}`);
  await p.locator('#mX').click(); await p.waitForTimeout(90);
}

/* 45 제곱근 막대 — S1 수동 / S2 이어붙이기(버튼) / S3~S5 수동 */
await run(45, '제곱근', [
  clickManual,
  () => clk('saSnap'),
  clickManual, clickManual, clickManual,
]);

/* 46 나선 — S1 srGo / S2 srGo×3(√5) 경유 눕히기 / S3 눕힘 3종 / S4 수동 / S5 √10 */
await run(46, '나선', [
  async () => { await clk('srGo'); },                                    // n=2 → √2
  async () => { await clk('srLay'); await clk('srGo'); await clk('srLay'); await clk('srGo'); await clk('srGo'); }, // lay√2, n=3 lay√3, n=5
  async () => { await clk('srLay'); },                                   // lay√5 → 눕힘 3종
  clickManual,
  async () => { for (let k = 0; k < 5; k++) await clk('srGo'); },        // n=10
]);

/* 47 합차 암산 — S1 b 끌기 / S2 9996 / S3 9991·9975 / S4·S5 수동 */
await run(47, '합차암산', [
  async () => { const w = (100 + 1) * 1.6 * 0.62, h = (100 - 1) * 1.6 * 0.62; await dragCv('mt1', 46 + w, 40 + h, 46 + 96 + 10, 40 + h - 8); },
  async () => { await p.evaluate(() => { const e = document.getElementById('mtA'); e.value = 9996; e.dispatchEvent(new Event('input', { bubbles: true })); }); await clk('mtC'); },
  async () => {
    for (const v of [9991, 9975]) {
      await p.evaluate(x => { const e = document.getElementById('mtA'); e.value = x; e.dispatchEvent(new Event('input', { bubbles: true })); }, v);
      await clk('mtC'); await p.waitForTimeout(150);
    }
  },
  clickManual, clickManual,
]);

/* 48 근의 공식 — S1 수동 / S2 마커 두 개 (초기식 x²−2x−3 → 근 −1, 3) / S3 검산 / S4·S5 수동 */
await run(48, '근의공식', [
  clickManual,
  async () => {
    const X = v => 200 + v * 30, Y0 = 170;
    await dragCv('qr1', X(-3), Y0, X(-1), Y0);
    await dragCv('qr1', X(4), Y0, X(3), Y0);
  },
  () => clk('qrShow'),
  clickManual, clickManual,
]);

/* 49 판별식 — 선 끌기 세 위치 */
await run(49, '판별식', [
  () => dragCv('dc1', 360, 210 - 26 * 2, 360, 210 - 26 * 4),       // k=2→4, D=20
  () => dragCv('dc1', 360, 210 - 26 * 4, 360, 210 + 26 * 1),       // k=−1 자석 → 중근
  () => dragCv('dc1', 360, 210 + 26 * 1, 360, 210 + 26 * 2.3),     // k≈−2.3 → 실근 없음
  clickManual, clickManual,
]);

/* 50 완전제곱식 — 접기/채우기/b=4 재완주 */
await run(50, '완전제곱', [
  clickManual,
  () => clk('cqFold'),
  () => clk('cqFill'),
  async () => { await clk('cqB'); await p.waitForTimeout(150); await clk('cqFold'); await p.waitForTimeout(150); await clk('cqFill'); },
  clickManual,
]);

/* 51 평행이동 — 목표 파싱 후 배달, 왼쪽 목표 사냥 */
async function deliver() {
  const q = await p.evaluate(() => document.getElementById('psQ').textContent);
  const mp = q.match(/\(x\s*([−+])\s*(\d+)\)/), mq = q.match(/\)²\s*([−+])\s*(\d+)/);
  const tp = (mp[1] === '−' ? 1 : -1) * +mp[2];
  const tq = (mq[1] === '−' ? -1 : 1) * +mq[2];
  const cur = await p.evaluate(() => { const t = document.querySelector('#psout').innerText.match(/\(x ([−+]) (\d+)\)² ([−+]) (\d+)/); return null; });
  // 현재 꼭짓점은 새 목표 직후 (0,0)
  const X = v => 200 + v * 26, Y = v => 150 - v * 26;
  await dragCv('ps1', X(0), Y(0), X(tp), Y(tq));
  return tp;
}
await run(51, '평행이동', [
  clickManual,
  async () => { await clk('psNew'); await p.waitForTimeout(150); await deliver(); },
  async () => {
    for (let k = 0; k < 12; k++) {
      await clk('psNew'); await p.waitForTimeout(150);
      const q = await p.evaluate(() => document.getElementById('psQ').textContent);
      if (q.includes('(x + ')) { await deliver(); break; }
    }
  },
  clickManual, clickManual,
]);

/* 52 울타리 — 봉우리 w=5, 대칭 w=4.9 */
await run(52, '울타리', [
  clickManual,
  () => dragCv('fn1', 30 + 3 * 12.6, 40 + 9 * 3, 30 + 5 * 12.6, 40 + 9 * 5),
  () => dragCv('fn1', 30 + 5 * 12.6, 40 + 9 * 5, 30 + 4.9 * 12.6, 40 + 9 * 4.9),
  clickManual, clickManual,
]);

console.log('pageerrors:', errs.length); errs.slice(0, 6).forEach(e => console.log(e.slice(0, 150)));
await b.close();
