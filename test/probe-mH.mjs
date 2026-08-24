// 배치 H 정직 완주 — 공통수학1 LAB 92~101
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
async function cvInfo(id) {
  await p.evaluate(i => { const e = document.getElementById(i); if (e) e.scrollIntoView({ block: 'center' }); }, id);
  await p.waitForTimeout(130);
  return p.evaluate(i => { const c = document.getElementById(i); const r = c.getBoundingClientRect(); return { l: r.left, t: r.top, sx: r.width / c.width, sy: r.height / c.height }; }, id);
}
async function dragCv(cvId, pts) {
  const f = await cvInfo(cvId);
  await p.mouse.move(f.l + pts[0][0] * f.sx, f.t + pts[0][1] * f.sy);
  await p.mouse.down();
  for (let i = 1; i < pts.length; i++) {
    await p.mouse.move(f.l + pts[i][0] * f.sx, f.t + pts[i][1] * f.sy, { steps: 18 });
  }
  await p.mouse.up(); await p.waitForTimeout(240);
}
async function run(lab, name, steps) {
  await p.evaluate(n => openLab(n), lab - 1);
  await p.waitForTimeout(400);
  for (const st of steps) { await st(); await p.waitForTimeout(340); }
  const pr = await prog();
  console.log(`LAB ${lab} ${name}: ${pr} ${/완주/.test(pr) ? 'OK' : '★미완'}`);
  await p.locator('#mX').click(); await p.waitForTimeout(100);
}

/* 92 조립제법 — 완주(k=0) → k=1 인수 → 표 → k=2 R=-4 */
await run(92, '조립제법', [
  clickManual,
  async () => { for (let i = 0; i < 3; i++) { await clk('snGo'); await p.waitForTimeout(150); } },
  async () => { await set('snK', 1); for (let i = 0; i < 3; i++) { await clk('snGo'); await p.waitForTimeout(150); } },
  clickManual,
  async () => { await set('snK', 2); for (let i = 0; i < 3; i++) { await clk('snGo'); await p.waitForTimeout(150); } },
]);
/* 93 나머지정리 — 나눠확인 → 근2 → 근 -1·3 → 심화 */
await run(93, '나머지정리', [
  clickManual,
  () => clk('rmChk'),
  () => dragCv('rm1', [[222, 150], [288, 150]]),
  async () => {
    await dragCv('rm1', [[288, 150], [156, 150]]);
    await dragCv('rm1', [[156, 150], [332, 150]]);
  },
  clickManual,
]);
/* 94 복소수 — ×i → ×4회 → 켤레 → 심화 */
await run(94, '복소수', [
  clickManual,
  () => clk('cxMul'),
  async () => { for (let i = 0; i < 3; i++) { await clk('cxMul'); await p.waitForTimeout(150); } },
  () => clk('cxCj'),
  clickManual,
]);
/* 95 근과계수 — Q1 → Q2 2연승 → 표 → 합2곱-15 */
await run(95, '근과계수', [
  clickManual,
  async () => { await clk('vtQ'); await set('vtB', -5); await set('vtC', 6); },
  async () => { await clk('vtQ'); await p.waitForTimeout(200); await set('vtB', 1); await set('vtC', -12); },
  clickManual,
  async () => { await set('vtB', -2); await set('vtC', -15); },
]);
/* 96 삼차 — k=1 실근3 → k=2 접함 → 표 → k=0 대칭 */
await run(96, '삼차방정식', [
  clickManual,
  () => dragCv('cb1', [[310, 58.5], [310, 102.5]]),
  () => dragCv('cb1', [[310, 102.5], [310, 80.5]]),
  clickManual,
  () => dragCv('cb1', [[310, 80.5], [310, 124.5]]),
]);
/* 97 이차부등식 — 구간해 → 뒤집기 → 표 → 모든 실수 */
await run(97, '이차부등식', [
  clickManual,
  async () => { await set('qiB', -4); await set('qiC', 3); },
  () => clk('qiDir'),
  clickManual,
  async () => { await set('qiB', 0); await set('qiC', 1); },
]);
/* 98 선형계획 — P(4,2) → z=16 → z'=12 → 심화 */
await run(98, '선형계획', [
  clickManual,
  () => dragCv('lp1', [[130, 180], [210, 180]]),
  () => dragCv('lp1', [[90, 200], [210, 180]]),
  async () => { await clk('lpObj'); await p.waitForTimeout(200); await dragCv('lp1', [[90, 220], [50, 100]]); },
  clickManual,
]);
/* 99 순열조합 — 순열 → 조합 → AABB → 심화 */
await run(99, '순열조합', [
  clickManual,
  async () => { await clk('pmP'); await p.waitForTimeout(2600); },
  async () => { await clk('pmC'); await p.waitForTimeout(1800); },
  () => clk('pmA'),
  clickManual,
]);
/* 100 행렬 — 90° 회전 → 붕괴 → 표 → 180° */
await run(100, '행렬', [
  clickManual,
  async () => {
    await clk('mxT'); await p.waitForTimeout(200);
    await dragCv('mx1', [[170, 118], [118, 170]]);   // e2 → (-1,0)
    await dragCv('mx1', [[222, 170], [170, 118]]);   // e1 → (0,1)
  },
  () => dragCv('mx1', [[118, 170], [170, 66]]),      // e2 → (0,2) 붕괴
  clickManual,
  async () => {
    await dragCv('mx1', [[170, 118], [118, 170]]);   // e1 → (-1,0)
    await dragCv('mx1', [[170, 66], [170, 222]]);    // e2 → (0,-1)
  },
]);
/* 101 행렬곱 — 비가환 → 가환 짝 → 표 → 심화 */
await run(101, '행렬곱', [
  clickManual,
  async () => {
    const c2 = (s2, o) => p.evaluate(([a, b2]) => { document.querySelector('[data-s="' + a + '"][data-o="' + b2 + '"]').click(); }, [s2, o]);
    await c2('L', 'R'); await c2('L', 'X'); await c2('R', 'X'); await c2('R', 'R');
  },
  async () => {
    await clk('ncRst'); await p.waitForTimeout(180);
    const c2 = (s2, o) => p.evaluate(([a, b2]) => { document.querySelector('[data-s="' + a + '"][data-o="' + b2 + '"]').click(); }, [s2, o]);
    await c2('L', 'R'); await c2('L', 'U'); await c2('R', 'U'); await c2('R', 'R');
  },
  clickManual, clickManual,
]);
console.log('pageerrors:', errs.length, errs.slice(0, 3));
await b.close();
