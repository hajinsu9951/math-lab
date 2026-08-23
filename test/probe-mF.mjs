// 배치 F 정직 완주 — LAB 61~68, 70
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

/* 61 체 — 2·3 거르기 → 11까지 → 표 → 심화 */
await run(61, '체', [
  clickManual,
  async () => { await clk('svGo'); await p.waitForTimeout(200); await clk('svGo'); },
  async () => { for (let i = 0; i < 3; i++) { await clk('svGo'); await p.waitForTimeout(200); } },
  clickManual, clickManual,
]);
/* 62 절댓값 — 완벽 예보 → 상쇄 배치 → 표 → 심화 */
await run(62, '절댓값', [
  clickManual,
  async () => {
    const T = [[70, 127], [130, 182], [190, 105], [250, 160], [310, 204]];
    const F = [[70, 105], [130, 204], [190, 83], [250, 182], [310, 226]];
    for (let i = 0; i < 5; i++) await dragCv('ae1', [F[i], T[i]]);
  },
  async () => {
    await dragCv('ae1', [[70, 127], [70, 105]]);
    await dragCv('ae1', [[130, 182], [130, 204]]);
    await dragCv('ae1', [[190, 105], [190, 83]]);
    await dragCv('ae1', [[250, 160], [250, 182]]);
  },
  clickManual, clickManual,
]);
/* 63 대입 — 카드 기록 → 함정 14 → 표 → 24÷7 */
await run(63, '대입', [
  clickManual,
  async () => { for (const v of [1, 2, 3]) { await p.evaluate(x => { document.querySelector('#sbCards [data-v="' + x + '"]').click(); }, v); await p.waitForTimeout(180); } },
  () => p.evaluate(() => { document.querySelector('#sbout [data-q="14"]').click(); }),
  clickManual,
  async () => { await sel('sbF', '3'); await p.waitForTimeout(200); await p.evaluate(() => { document.querySelector('#sbCards [data-v="7"]').click(); }); },
]);
/* 64 소금물 — 소금+10 → 물×4 로 5% → 표 → 증발 전부 */
await run(64, '소금물', [
  clickManual,
  () => clk('slS'),
  async () => { for (let i = 0; i < 4; i++) { await clk('slW'); await p.waitForTimeout(160); } },
  clickManual,
  async () => { for (let i = 0; i < 7; i++) { await clk('slE'); await p.waitForTimeout(140); } },
]);
/* 65 수직이등분선 — r 축소 → r 복구+P → 표 → 심화 */
await run(65, '수직이등분선', [
  clickManual,
  () => dragCv('pb1', [[175.3, 87.8], [147.3, 123]]),
  () => dragCv('pb1', [[147.3, 123], [197, 60.3]]),
  clickManual, clickManual,
]);
/* 66 각이등분선 — r2 축소 → r1 확대 → 표 → 심화 */
await run(66, '각이등분선', [
  clickManual,
  () => dragCv('ab1', [[175.4, 164.8], [160.9, 202.1]]),
  () => dragCv('ab1', [[137.8, 187.6], [176, 163.8]]),
  clickManual, clickManual,
]);
/* 67 부채꼴 펼치기 — 32조각 → 각 330° → 표 → 심화 */
await run(67, '부채꼴펼치기', [
  clickManual,
  async () => { for (let i = 0; i < 3; i++) { await clk('aaCut'); await p.waitForTimeout(160); } },
  () => dragCv('aa1', [[9.7, 82.5], [92, 225], [174.3, 177.5]]),
  clickManual, clickManual,
]);
/* 68 정다면체 — 삼각형 5장 → 6장 → 표 → 오각형 3장 */
await run(68, '정다면체', [
  clickManual,
  async () => { for (let i = 0; i < 5; i++) { await clk('plPut'); await p.waitForTimeout(150); } },
  () => clk('plPut'),
  clickManual,
  async () => { await sel('plN', '5'); for (let i = 0; i < 3; i++) { await clk('plPut'); await p.waitForTimeout(150); } },
]);
/* 70 해시 — m7 6명 → m8 몰림 → 표 → m11 */
await run(70, '해시', [
  clickManual,
  async () => { const ids = [20104, 20208, 20312, 20416, 20520, 20624];
    for (const v of ids) { await p.evaluate(x => { const b2 = document.querySelector('#hhCards [data-v="' + x + '"]'); if (b2) b2.click(); }, v); await p.waitForTimeout(150); } },
  () => sel('hhM', '8'),
  clickManual,
  () => sel('hhM', '11'),
]);
console.log('pageerrors:', errs.length, errs.slice(0, 3));
await b.close();
