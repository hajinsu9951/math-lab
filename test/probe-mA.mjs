// 배치 A 정직 완주 — LAB 5,8,9,11,12,13,15,16,17
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
  for (const st of steps) { await st(); await p.waitForTimeout(320); }
  const pr = await prog();
  console.log(`LAB ${lab} ${name}: ${pr} ${/완주/.test(pr) ? 'OK' : '★미완'}`);
  await p.locator('#mX').click(); await p.waitForTimeout(100);
}

/* 05 측량 — 100m 돌파 → 45° → 눈높이 0 → 심화 */
await run(5, '측량', [
  clickManual,
  async () => { await set('tds', 120); await set('tth', 40); },
  () => set('tth', 45),
  () => set('teh', 0),
  clickManual,
]);
/* 08 비밀번호 — 94종 12자리(e+년) → 년 경계(62종 10자리) → 표 → 1000년+ */
await run(8, '비밀번호', [
  clickManual,
  async () => { await sel('pwk', 94); await set('pwn', 12); },
  async () => { await sel('pwk', 62); await set('pwn', 10); },
  clickManual,
  async () => { await sel('pwk', 94); await set('pwn', 11); },
]);
/* 09 큰수 — 절반 돌파 → 10% 세계 → 표 → 95~99% */
await run(9, '큰수', [
  clickManual,
  () => set('lwn', 200),
  () => set('lwp', 10.0),
  clickManual,
  () => set('lwn', 30),
]);
/* 11 복리 — 8년 미만 → 3% 24.00년 → 표 → 차이 1억+ */
await run(11, '복리', [
  clickManual,
  () => set('cmr', 9.5),
  () => set('cmr', 3.0),
  clickManual,
  async () => { await set('cmp', 5000); await set('cmr', 20); await set('cmy', 40); },
]);
/* 12 로그눈금 — 로그 전환 → 소리 자료 → 표 → 심화 */
await run(12, '로그눈금', [
  clickManual,
  () => p.evaluate(() => { document.querySelector('#lgseg button[data-m="log"]').click(); }),
  () => sel('lgd', 'sound'),
  clickManual, clickManual,
]);
/* 13 순간속도 — h 최소 → t=4 → 표 → 심화 */
await run(13, '순간속도', [
  clickManual,
  () => set('vlh', 0.02),
  () => set('vlt', 4.0),
  clickManual, clickManual,
]);
/* 15 회귀 — 11점 일렬 → 이상치 → 표 → 심화 */
await run(15, '회귀', [
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
  async () => { await clk('rout2'); await p.waitForTimeout(250); await clk('rout2'); },
  clickManual, clickManual,
]);
/* 16 경사하강 — 수렴(2.0대) → 발산 → 표 → 진동(α=4.0) */
await run(16, '경사하강', [
  clickManual,
  async () => { await set('dx0', 7); await set('dlr', 0.3); await clk('drun'); for (let i = 0; i < 12; i++) { await clk('dstep'); await p.waitForTimeout(60); } },
  async () => { await set('dx0', 7); await set('dlr', 4.5); await clk('drun'); await clk('drun'); },
  clickManual,
  async () => { await set('dx0', 7); await set('dlr', 4.0); await clk('dstep'); },
]);
/* 17 몬테카를로 — 1000+ 오차0.0x → 초기화+1000 → 표 → 10000+ */
await run(17, '몬테카를로', [
  clickManual,
  async () => { for (let i = 0; i < 4; i++) { await clk('m1k'); await p.waitForTimeout(150); } },
  async () => { await clk('mrs'); await p.waitForTimeout(150); await clk('m1k'); },
  clickManual,
  async () => { for (let i = 0; i < 10; i++) { await clk('m1k'); await p.waitForTimeout(100); } },
]);
console.log('pageerrors:', errs.length, errs.slice(0, 3));
await b.close();
