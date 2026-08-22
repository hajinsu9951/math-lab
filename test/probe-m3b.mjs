// LAB 53~60 — 정직 완주 검증
import { chromium } from 'playwright';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
const ROOT = dirname(fileURLToPath(import.meta.url));
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1300, height: 1300 } });
const errs = [];
p.on('pageerror', e => errs.push('PAGE ' + e.message));
await p.goto('file://' + join(ROOT, 'dist', 'index.html'));

const clk = (id) => p.evaluate(i => { const e = document.getElementById(i); if (e) e.click(); }, id);
const set = (id, v) => p.evaluate(([i, x]) => { const e = document.getElementById(i); e.value = x; e.dispatchEvent(new Event('input', { bubbles: true })); }, [id, v]);
const clickManual = async () => { await p.evaluate(() => { const el = document.querySelector('.ldi.now .ldk'); if (el && !el.disabled) el.click(); }); await p.waitForTimeout(130); };
const prog = () => p.evaluate(() => (document.querySelector('#ldp') || {}).textContent || '');
const tick = () => p.waitForTimeout(300);

async function cvInfo(id) {
  return p.evaluate(i => { const c = document.getElementById(i); const r = c.getBoundingClientRect(); return { l: r.left, t: r.top, sx: r.width / c.width, sy: r.height / c.height }; }, id);
}
async function dragCv(cvId, x1, y1, x2, y2, steps = 8) {
  const f = await cvInfo(cvId);
  await p.mouse.move(f.l + x1 * f.sx, f.t + y1 * f.sy); await p.mouse.down();
  const mx = (x1 + x2) / 2, my = (y1 + y2) / 2;
  await p.mouse.move(f.l + mx * f.sx, f.t + my * f.sy, { steps });
  await p.mouse.move(f.l + x2 * f.sx, f.t + y2 * f.sy, { steps });
  await p.mouse.up();
  await p.waitForTimeout(220);
}
async function clickCv(cvId, x, y) {
  const f = await cvInfo(cvId);
  await p.mouse.click(f.l + x * f.sx, f.t + y * f.sy);
  await p.waitForTimeout(180);
}
async function run(lab, name, steps) {
  await p.evaluate(n => openLab(n), lab - 1);
  await p.waitForTimeout(400);
  for (const st of steps) { await st(); await tick(); }
  const pr = await prog();
  console.log(`LAB ${lab} ${name}: ${pr} ${/완주/.test(pr) ? 'OK' : '★미완'}`);
  await p.locator('#mX').click(); await p.waitForTimeout(90);
}

const D = Math.PI / 180;

/* 53 곱셈공식 — a 손잡이 5로 / 차모드 3버튼 */
await run(53, '곱셈공식', [
  clickManual,
  () => dragCv('xp1', 52 + 6 * 22, 44 + 220, 52 + 5 * 22, 44 + 220),
  async () => { await clk('xpDif'); await p.waitForTimeout(150); await clk('xpS1'); await p.waitForTimeout(120); await clk('xpS2'); await p.waitForTimeout(120); await clk('xpS3'); },
  clickManual, clickManual,
]);

/* 54 특수각 — 30 → 45 → 60 자석 */
const taP = th => [60 + 180 * Math.cos(th * D), 250 - 180 * Math.sin(th * D)];
await run(54, '특수각', [
  clickManual,
  () => dragCv('ta1', ...taP(20), ...taP(30)),
  () => dragCv('ta1', ...taP(30), ...taP(45)),
  () => dragCv('ta1', ...taP(45), ...taP(60)),
  clickManual,
]);

/* 55 삼각비 표 — 5개 기록, 보간 도전 */
await run(55, '삼각비표', [
  clickManual,
  async () => { for (const th of [10, 20, 35, 40, 50]) { await set('tbT', th); await clk('tbAdd'); await p.waitForTimeout(80); } },
  async () => { await clk('tbQ'); await p.waitForTimeout(150);
    await p.evaluate(() => { const e = document.getElementById('tbA'); e.value = 0.6013; e.dispatchEvent(new Event('input', { bubbles: true })); });
    await clk('tbC'); },
  clickManual, clickManual,
]);

/* 56 원주각 — P 세 곳, A·B 지름 */
const iaP = th => [200 + 130 * Math.cos(th * D), 165 - 130 * Math.sin(th * D)];
await run(56, '원주각', [
  clickManual,
  async () => { await dragCv('ia1', ...iaP(90), ...iaP(120)); await dragCv('ia1', ...iaP(120), ...iaP(60)); await dragCv('ia1', ...iaP(60), ...iaP(140)); },
  async () => { await dragCv('ia1', ...iaP(210), ...iaP(180)); await dragCv('ia1', ...iaP(330), ...iaP(0)); },
  clickManual, clickManual,
]);

/* 57 접선 — P 멀리, 검산 */
await run(57, '접선', [
  clickManual,
  () => dragCv('tn1', 300, 80, 390, 12),
  () => clk('tnChk'),
  clickManual, clickManual,
]);

/* 58 내접사각형 — A 세 위치, D 떼기 */
const cyP = th => [200 + 125 * Math.cos(th * D), 160 - 125 * Math.sin(th * D)];
await run(58, '내접사각형', [
  clickManual,
  async () => { await dragCv('cy1', ...cyP(150), ...cyP(170)); await dragCv('cy1', ...cyP(170), ...cyP(120)); await dragCv('cy1', ...cyP(120), ...cyP(100)); },
  async () => { const d0 = await p.evaluate(() => null); await dragCv('cy1', 78.6, 189.9, 40, 290); },
  clickManual, clickManual,
]);

/* 59 상자그림 — 최대점 55로, 되돌리기 */
const bxX = v => 30 + v * 340 / 60;
await run(59, '상자그림', [
  clickManual,
  () => dragCv('bx1', bxX(26), 214, bxX(55), 214),
  () => dragCv('bx1', bxX(55), 214, bxX(25), 214),
  clickManual, clickManual,
]);

/* 60 이상치와 상관 — 구석 클릭, 제외 토글 */
await run(60, '이상치상관', [
  clickManual,
  () => clickCv('oc1', 40 + 7.5 * 330 / 8, 260 - 5 * 230 / 70),
  async () => { await p.evaluate(() => { const e = document.getElementById('ocEx'); e.checked = true; e.dispatchEvent(new Event('change', { bubbles: true })); }); },
  clickManual, clickManual,
]);

console.log('pageerrors:', errs.length); errs.slice(0, 6).forEach(e => console.log(e.slice(0, 150)));
await b.close();
