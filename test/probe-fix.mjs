// 수리된 실험실 정직 완주 재검증 — 1,7,9,14,15,24,59,64,71,84,85,90
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
const clickManual = async () => { await p.evaluate(() => { const el = document.querySelector('.ldi.now .ldk'); if (el && !el.disabled) el.click(); }); await p.waitForTimeout(130); };
const prog = () => p.evaluate(() => (document.querySelector('#ldp') || {}).textContent || '');
async function cvInfo(id) { await p.evaluate(i => { const e=document.getElementById(i); if(e) e.scrollIntoView({block:"center"}); }, id); await p.waitForTimeout(120); return p.evaluate(i => { const c = document.getElementById(i); const r = c.getBoundingClientRect(); return { l: r.left, t: r.top, sx: r.width / c.width, sy: r.height / c.height }; }, id); }
async function dragCv(cvId, x1, y1, x2, y2) {
  const f = await cvInfo(cvId);
  await p.mouse.move(f.l + x1 * f.sx, f.t + y1 * f.sy); await p.mouse.down();
  await p.mouse.move(f.l + (x1 + x2) / 2 * f.sx, f.t + (y1 + y2) / 2 * f.sy, { steps: 6 });
  await p.mouse.move(f.l + x2 * f.sx, f.t + y2 * f.sy, { steps: 6 });
  await p.mouse.up(); await p.waitForTimeout(220);
}
async function clickCv(cvId, x, y) { const f = await cvInfo(cvId); await p.mouse.click(f.l + x * f.sx, f.t + y * f.sy); await p.waitForTimeout(180); }
async function openGate() {
  const has = await p.evaluate(() => !!document.querySelector('.pgb'));
  if (!has) return;
  const cv = p.locator('.pgpad canvas').first();
  const bb = await cv.boundingBox();
  if (bb) { await p.mouse.move(bb.x + 20, bb.y + 20); await p.mouse.down(); await p.mouse.move(bb.x + 110, bb.y + 70, { steps: 6 }); await p.mouse.up(); }
  await p.waitForTimeout(180);
  await p.evaluate(() => { const b = document.querySelector('[id^="pgGo_"]'); if (b && !b.disabled) b.click(); });
  await p.waitForTimeout(220);
}
async function run(lab, name, steps) {
  await p.evaluate(n => openLab(n), lab - 1);
  await p.waitForTimeout(380);
  await openGate();
  for (const st of steps) { await st(); await p.waitForTimeout(300); }
  const pr = await prog();
  console.log(`LAB ${lab} ${name}: ${pr} ${/완주/.test(pr) ? 'OK' : '★미완'}`);
  await p.locator('#mX').click(); await p.waitForTimeout(90);
}

/* 01 GPS 수색 — A만 → A·C 교점 → B 세 원 명중 → 오차 → 보고서 */
await run(1, 'GPS', [
  async () => { await clk('gcA'); await clickManual(); },
  async () => { await clk('gcC'); await clickCv('g1', 26 + 32.8 * 1.48, 304 - 32.8 * 6.19); },
  async () => { await clk('gcB'); await clickCv('g1', 26 + 32.8 * 4.82, 304 - 32.8 * 4.50); },
  async () => { await set('gn', 0.5); await clickManual(); },
  clickManual,
]);
/* 07 대푯값 — 올렸다 되돌리기 */
await run(7, '대푯값', [
  clickManual,
  () => set('rpb', 60000),
  () => set('rpb', 4000),
  clickManual, clickManual,
]);
/* 09 큰수 — 줄이기(200) → 늘리기 */
await run(9, '큰수', [
  clickManual,
  async () => { await set('lwn', 400); await clk('lwgo'); },
  clickManual, clickManual, clickManual,
]);
/* 14 룬 — 오타 → 고치기 */
await run(14, '룬', [
  clickManual,
  () => p.evaluate(() => { const e = document.getElementById('ln'); e.value = '4539148803436466'; e.dispatchEvent(new Event('input', { bubbles: true })); const g = document.getElementById('lgo'); if (g) g.click(); }),
  () => p.evaluate(() => { const e = document.getElementById('ln'); e.value = '4539148803436467'; e.dispatchEvent(new Event('input', { bubbles: true })); const g = document.getElementById('lgo'); if (g) g.click(); }),
  clickManual, clickManual,
]);
/* 15 회귀 — 지우고 11점 일렬 */
await run(15, '회귀', [
  clickManual,
  async () => {
    await clk('rclr'); await p.waitForTimeout(150);
    const bb = await p.locator('#r1').boundingBox();
    for (let k = 0; k < 11; k++) {
      await p.mouse.click(bb.x + 22 + k * 30, bb.y + bb.height - 22 - k * 22);
      await p.waitForTimeout(70);
    }
  },
  clickManual, clickManual, clickManual,
]);
/* 24 회전체 — 128장 + 2배 */
await run(24, '회전체', [
  clickManual,
  async () => { await clk('rvFine'); await p.waitForTimeout(200); await clk('rvUp'); await p.waitForTimeout(250); },
  clickManual, clickManual, clickManual,
]);
/* 59 상자그림 — 멀리 → 되돌리기 */
const bxX = v => 30 + v * 340 / 60;
await run(59, '상자그림', [
  clickManual,
  () => dragCv('bx1', bxX(26), 214, bxX(55), 214),
  () => dragCv('bx1', bxX(55), 214, bxX(25), 214),
  clickManual, clickManual,
]);
/* 64 소금물 — 물 2번으로 5% */
await run(64, '소금물', [
  clickManual, clickManual,
  async () => { await clk('slW'); await p.waitForTimeout(150); await clk('slW'); },
  clickManual, clickManual,
]);
/* 71 순환소수 — 1/8 완료 → 1/7 16자리 */
await run(71, '순환소수', [
  clickManual,
  async () => {
    await p.evaluate(() => { const bs = [...document.querySelectorAll('#fdCards button')]; for (const x of bs) if (/1\/8/.test(x.textContent)) { x.click(); break; } });
    for (let k = 0; k < 6; k++) { await clk('fdStep'); await p.waitForTimeout(80); }
  },
  async () => {
    await p.evaluate(() => { const bs = [...document.querySelectorAll('#fdCards button')]; for (const x of bs) if (/1\/7/.test(x.textContent)) { x.click(); break; } });
    for (let k = 0; k < 16; k++) { await clk('fdStep'); await p.waitForTimeout(70); }
  },
  clickManual, clickManual,
]);
/* 84 피타 역 — c행(y=284) 끌기: 10 → 9 → 13 */
const pcX = v => 60 + (v - 3) * 260 / 12;
await run(84, '피타역', [
  clickManual,
  () => dragCv('pc1', pcX(15), 284, pcX(10), 284),
  () => dragCv('pc1', pcX(10), 284, pcX(9), 284),
  () => dragCv('pc1', pcX(9), 284, pcX(13), 284),
  clickManual,
]);
/* 85 피타 수 — (4,3) 클릭 → (12,5) 클릭 */
const CS = (380 - 70) / 16;
const tpXY = (a, bb) => [40 + (a - 0.5) * CS, 270 - (bb - 0.5) * CS];
await run(85, '피타수', [
  clickManual,
  () => clickCv('tp1', ...tpXY(4, 3)),
  () => clickCv('tp1', ...tpXY(12, 5)),
  clickManual, clickManual,
]);
/* 90 조건부 — 조건 버튼 */
await run(90, '조건부', [
  clickManual,
  () => clk('cpG'),
  clickManual, clickManual, clickManual,
]);

console.log('pageerrors:', errs.length); errs.slice(0, 6).forEach(e => console.log(e.slice(0, 150)));
await b.close();
