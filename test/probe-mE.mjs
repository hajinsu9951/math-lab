// 배치 E 정직 완주 — LAB 39~45
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
    await p.mouse.move(f.l + pts[i][0] * f.sx, f.t + pts[i][1] * f.sy, { steps: 25 });
  }
  await p.mouse.up(); await p.waitForTimeout(240);
}
async function clickCv(cvId, x, y) {
  const f = await cvInfo(cvId);
  await p.mouse.click(f.l + x * f.sx, f.t + y * f.sy);
  await p.waitForTimeout(160);
}
async function run(lab, name, steps) {
  await p.evaluate(n => openLab(n), lab - 1);
  await p.waitForTimeout(400);
  for (const st of steps) { await st(); await p.waitForTimeout(340); }
  const pr = await prog();
  console.log(`LAB ${lab} ${name}: ${pr} ${/완주/.test(pr) ? 'OK' : '★미완'}`);
  await p.locator('#mX').click(); await p.waitForTimeout(100);
}

/* 39 상자 — 우산 → 피자 → 표 → 정육면체 */
await run(39, '상자', [
  clickManual,
  () => clk('bxLong'),
  () => clk('bxFlat'),
  clickManual,
  () => clk('bxCube'),
]);
/* 40 줄기잎 — 전부 넣기 → 뭉개기 → 표 → 복원 */
await run(40, '줄기잎', [
  clickManual,
  () => clk('stAll'),
  () => clk('stHist'),
  clickManual,
  () => clk('stHist'),
]);
/* 41 상대도수 — rel 전환 → ×3 → 표 → A반 90점대 7연타 */
await run(41, '상대도수', [
  clickManual,
  () => sel('rfM', 'rel'),
  () => clk('rfX3'),
  clickManual,
  async () => { for (let i = 0; i < 8; i++) { await clickCv('rf1', 315, 100); } },
]);
/* 42 표본 — 10연발 → n=200 → 표 → 수면 주제 */
await run(42, '표본', [
  clickManual,
  () => clk('siGo10'),
  () => dragCv('si1', [[81, 272], [336, 272]]),
  clickManual,
  () => sel('siQ', '1'),
]);
/* 43 동류항 타일 — 2장 → 4장 완주 → 이후 manual */
await run(43, '동류항', [
  async () => {
    await dragCv('le1', [[70, 96], [120, 240]]);
    await dragCv('le1', [[150, 96], [260, 240]]);
  },
  async () => {
    await dragCv('le1', [[230, 96], [150, 240]]);
    await dragCv('le1', [[310, 96], [285, 240]]);
  },
  clickManual, clickManual, clickManual,
]);
/* 44 그래프 그리기 — 대충+채점 → 정밀 → 표 → 버스 이야기 */
await run(44, '이야기그래프', [
  clickManual,
  async () => { await dragCv('co1', [[44, 256], [336, 44]]); await clk('coChk'); },
  async () => {
    await clk('coClr'); await p.waitForTimeout(150);
    await dragCv('co1', [[44, 256], [117, 171], [175, 171], [278, 44], [336, 44]]);
    await clk('coChk');
  },
  clickManual,
  async () => {
    await sel('coS', '3'); await clk('coClr'); await p.waitForTimeout(150);
    await dragCv('co1', [[44, 256], [131.6, 44], [160.8, 44], [336, 256]]);
    await clk('coChk');
  },
]);
/* 45 무리수 — 이어붙이기 → √8 대결 → 표 → 심화 */
await run(45, '무리수', [
  clickManual,
  () => clk('saSnap'),
  () => clk('saCmp'),
  clickManual, clickManual,
]);
console.log('pageerrors:', errs.length, errs.slice(0, 3));
await b.close();
