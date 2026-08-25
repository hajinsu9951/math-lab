// LAB 92~101 정직 완주 검증
import { chromium } from 'playwright';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
const ROOT = dirname(fileURLToPath(import.meta.url));
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1300, height: 1400 } });
const errs = [];
p.on('pageerror', e => errs.push('PAGE ' + e.message));
await p.goto('file://' + join(ROOT, 'dist', 'index.html'));
const clk = id => p.evaluate(i => { const e = document.getElementById(i); if (e) e.click(); }, id);
const set = (id, v) => p.evaluate(([i, x]) => { const e = document.getElementById(i); e.value = x; e.dispatchEvent(new Event('input', { bubbles: true })); }, [id, v]);
const clickManual = async () => { await p.evaluate(() => { const el = document.querySelector('.ldi.now .ldk'); if (el && !el.disabled) el.click(); }); await p.waitForTimeout(140); };
const prog = () => p.evaluate(() => (document.querySelector('#ldp') || {}).textContent || '');
async function cvInfo(id) {
  await p.evaluate(i => { const e = document.getElementById(i); if (e) e.scrollIntoView({ block: 'center' }); }, id);
  await p.waitForTimeout(150);
  return p.evaluate(i => { const c = document.getElementById(i); const r = c.getBoundingClientRect(); return { l: r.left, t: r.top, sx: r.width / c.width, sy: r.height / c.height }; }, id);
}
async function dragCv(cvId, x1, y1, x2, y2) {
  const f = await cvInfo(cvId);
  await p.mouse.move(f.l + x1 * f.sx, f.t + y1 * f.sy); await p.mouse.down();
  await p.mouse.move(f.l + (x1 + x2) / 2 * f.sx, f.t + (y1 + y2) / 2 * f.sy, { steps: 6 });
  await p.mouse.move(f.l + x2 * f.sx, f.t + y2 * f.sy, { steps: 6 });
  await p.mouse.up(); await p.waitForTimeout(240);
}
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
  await p.waitForTimeout(400);
  await openGate();
  for (const st of steps) { await st(); await p.waitForTimeout(320); }
  const pr = await prog();
  console.log(`LAB ${lab} ${name}: ${pr} ${/완주/.test(pr) ? 'OK' : '★미완'}`);
  await p.locator('#mX').click(); await p.waitForTimeout(90);
}

/* 92 조립제법 */
await run(92, '조립제법', [
  clickManual,
  async () => { for (let k = 0; k < 3; k++) { await clk('snGo'); await p.waitForTimeout(120); } },
  async () => { await set('snK', 1); await p.waitForTimeout(150); for (let k = 0; k < 3; k++) { await clk('snGo'); await p.waitForTimeout(120); } },
  clickManual, clickManual,
]);
/* 93 나머지정리 — X(v)=200+44v, y=150 */
const rmX = v => 200 + v * 44;
await run(93, '나머지정리', [
  clickManual,
  () => clk('rmChk'),
  () => dragCv('rm1', rmX(0.5), 150, rmX(-1), 150),
  async () => { await dragCv('rm1', rmX(-1), 150, rmX(2), 150); await dragCv('rm1', rmX(2), 150, rmX(3), 150); },
  clickManual,
]);
/* 94 복소수 */
await run(94, '복소수', [
  clickManual,
  () => clk('cxMul'),
  async () => { for (let k = 0; k < 3; k++) { await clk('cxMul'); await p.waitForTimeout(120); } },
  () => clk('cxCj'),
  clickManual,
]);
/* 95 근과 계수 */
await run(95, '근과계수', [
  clickManual,
  async () => { await clk('vtQ'); await p.waitForTimeout(150); await set('vtB', -5); await set('vtC', 6); },
  async () => { await clk('vtQ'); await p.waitForTimeout(150); await set('vtB', 1); await set('vtC', -12); },
  clickManual, clickManual,
]);
/* 96 삼차 — k 위치 기반 드래그 */
const cbY = k => 150 - 22 * (1.159 + k);
await run(96, '삼차실근', [
  clickManual,
  () => dragCv('cb1', 200, cbY(3), 200, cbY(0)),
  () => dragCv('cb1', 200, cbY(0), 200, cbY(2.05)),
  clickManual, clickManual,
]);
/* 97 이차부등식 */
await run(97, '이차부등식', [
  clickManual,
  () => set('qiC', -3),
  () => clk('qiDir'),
  clickManual, clickManual,
]);
/* 98 선형계획 — X(v)=50+40v, Y(v)=260-40v */
const lpX = v => 50 + 40 * v, lpY = v => 260 - 40 * v;
await run(98, '선형계획', [
  clickManual,
  () => dragCv('lp1', lpX(2), lpY(2), lpX(4), lpY(2)),
  () => dragCv('lp1', lpX(0), lpY(3), lpX(2), lpY(5)),
  async () => { await clk('lpObj'); await p.waitForTimeout(150); await dragCv('lp1', lpX(0), lpY(2), lpX(0), lpY(4)); },
  clickManual,
]);
/* 99 순열·조합 */
await run(99, '순열조합', [
  clickManual,
  async () => { await clk('pmP'); await p.waitForTimeout(2600); },
  async () => { await clk('pmC'); await p.waitForTimeout(1600); },
  () => clk('pmA'),
  clickManual,
]);
/* 100 행렬 — O=(170,170), SC=52. e2 먼저 (−1,0), 그다음 e1 (0,1) */
await run(100, '행렬변환', [
  clickManual,
  async () => { await clk('mxT'); await p.waitForTimeout(150);
    await dragCv('mx1', 170, 118, 118, 170);        // e2 (0,1)→(−1,0)
    await dragCv('mx1', 222, 170, 170, 118); },     // e1 (1,0)→(0,1)
  async () => { await dragCv('mx1', 170, 118, 144, 170); }, // e1 (0,1)→(−0.5,0) → det 0
  clickManual, clickManual,
]);
/* 101 비가환 */
const ncBtn = (s2, o) => p.evaluate(([ss, oo]) => { const b = document.querySelector(`#mBody [data-s="${ss}"][data-o="${oo}"]`); if (b) b.click(); }, [s2, o]);
await run(101, '비가환', [
  clickManual,
  async () => { await ncBtn('L', 'R'); await ncBtn('L', 'X'); await ncBtn('R', 'X'); await ncBtn('R', 'R'); },
  async () => { await clk('ncRst'); await p.waitForTimeout(150);
    await ncBtn('L', 'R'); await ncBtn('L', 'U'); await ncBtn('R', 'U'); await ncBtn('R', 'R'); },
  clickManual, clickManual,
]);

console.log('pageerrors:', errs.length); errs.slice(0, 6).forEach(e => console.log(e.slice(0, 150)));
await b.close();
