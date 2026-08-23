// 배치 G 정직 완주 — LAB 72,73,76~83,86,87,89
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
    await p.mouse.move(f.l + pts[i][0] * f.sx, f.t + pts[i][1] * f.sy, { steps: 20 });
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

/* 72 순환소수 — ×10 두 번 → 빼기 → 표 → 혼순환 */
await run(72, '순환소수', [
  clickManual,
  async () => { await clk('rcX10'); await p.waitForTimeout(180); await clk('rcX10'); },
  () => clk('rcSub'),
  clickManual,
  async () => {
    await p.evaluate(() => { document.querySelector('#rcCards [data-i="3"]').click(); });
    await p.waitForTimeout(180);
    await clk('rcX10'); await p.waitForTimeout(150); await clk('rcX10'); await p.waitForTimeout(150);
    await clk('rcSub');
  },
]);
/* 73 종이접기 — 10번 → 42번 → 표 → 심화 */
await run(73, '종이접기', [
  clickManual,
  async () => { for (let i = 0; i < 10; i++) { await clk('foGo'); await p.waitForTimeout(70); } },
  async () => { for (let i = 0; i < 32; i++) { await clk('foGo'); await p.waitForTimeout(50); } },
  clickManual, clickManual,
]);
/* 76 소거법 — x 소거 → 리셋 y 소거 → 표 → 심화 */
await run(76, '소거법', [
  clickManual,
  async () => { await clk('el1x3'); await clk('el2x'); await p.waitForTimeout(180); await clk('elSub'); },
  async () => { await clk('elRst'); await p.waitForTimeout(180); await clk('el2x3'); await p.waitForTimeout(150); await clk('elAdd'); },
  clickManual, clickManual,
]);
/* 77 기울기·절편 — b=4 → a=-2 → 표 → 0.5x+3 */
await run(77, '기울기절편', [
  clickManual,
  () => dragCv('sp1', [[190, 133], [190, 82]]),
  () => dragCv('sp1', [[258, 14], [258, 218]]),
  clickManual,
  async () => {
    await dragCv('sp1', [[190, 82], [190, 99]]);
    await dragCv('sp1', [[258, 235], [258, 65]]);
  },
]);
/* 78 식↔그래프 — 문제 해독 명중 → 세로 포개기 → 표 → 심화 */
const Q78 = {};
await run(78, '식그래프', [
  clickManual,
  async () => {
    const q = await p.evaluate(() => document.getElementById('lfQ').textContent);
    Q78.m = parseFloat(q.match(/y = (-?[\d.]+)x/)[1]);
    const cm = q.match(/([+−]) ([\d.]+)/);
    Q78.c = (cm[1] === '−' ? -1 : 1) * parseFloat(cm[2]);
    const X = v => 190 + v * 17, Y = v => 150 - v * 17;
    await dragCv('lf1', [[X(-2), Y(0)], [X(0), Y(Q78.c)]]);
    await dragCv('lf1', [[X(3), Y(2)], [X(2), Y(2 * Q78.m + Q78.c)]]);
  },
  async () => {
    const X = v => 190 + v * 17, Y = v => 150 - v * 17;
    await dragCv('lf1', [[X(2), Y(2 * Q78.m + Q78.c)], [X(0), Y(Q78.c + 3 > 7 ? Q78.c - 3 : Q78.c + 3)]]);
  },
  clickManual, clickManual,
]);
/* 79 무게중심 — 확인 → 명중 → 표 → 심화 */
await run(79, '무게중심', [
  clickManual,
  () => clk('cdChk'),
  () => dragCv('cd1', [[120, 150], [193.3, 180]]),
  clickManual, clickManual,
]);
/* 80 평행사변형 — 파괴 → 사다리꼴 → 표 → 복원 */
await run(80, '평행사변형', [
  clickManual,
  () => dragCv('pgm1', [[330, 90], [200, 150]]),
  () => clk('pgmTrap'),
  clickManual,
  () => dragCv('pgm1', [[140, 90], [40, 90]]),
]);
/* 81 축척 — k=0.5 → k=2 → 표 → k=2.9 */
await run(81, '축척', [
  clickManual,
  () => dragCv('sm1', [[266, 164.8], [200, 211]]),
  () => dragCv('sm1', [[200, 211], [290, 148]]),
  clickManual,
  () => dragCv('sm1', [[290, 148], [344, 110]]),
]);
/* 82 닮음의 중심 — k=2.5 → k=-0.5 → 표 → 심화 */
await run(82, '닮음중심', [
  clickManual,
  () => dragCv('ho1', [[186, 96], [235, 75]]),
  () => dragCv('ho1', [[235, 75], [25, 165]]),
  clickManual, clickManual,
]);
/* 83 피타고라스 — (5,12) → (12,9) → 표 → (8,6) */
await run(83, '피타고라스', [
  clickManual,
  async () => {
    await dragCv('py1', [[196, 210], [140, 210]]);
    await dragCv('py1', [[140, 154], [140, 114]]);
  },
  async () => {
    await dragCv('py1', [[140, 210], [196, 210]]);
    await dragCv('py1', [[196, 114], [196, 138]]);
  },
  clickManual,
  async () => {
    await dragCv('py1', [[196, 210], [164, 210]]);
    await dragCv('py1', [[164, 138], [164, 162]]);
  },
]);
/* 86 경우의수 — 또는 → 그리고 → 표 → 심화 */
await run(86, '경우의수', [
  clickManual,
  () => clk('ctOr'),
  () => clk('ctAnd'),
  clickManual, clickManual,
]);
/* 87 세제곱 — k=1 → k=3 → 표 → 심화 */
await run(87, '세제곱', [
  clickManual,
  () => dragCv('cs1', [[280, 174], [280, 240]]),
  () => dragCv('cs1', [[280, 203.7], [280, 128]]),
  clickManual, clickManual,
]);
/* 89 독립 — 100회+ → 집계 → 표 → 심화 */
await run(89, '독립시행', [
  clickManual,
  async () => { for (let i = 0; i < 6; i++) { await clk('idF20'); await p.waitForTimeout(120); } },
  async () => { for (let i = 0; i < 14; i++) { await clk('idF20'); await p.waitForTimeout(100); } },
  clickManual, clickManual,
]);
console.log('pageerrors:', errs.length, errs.slice(0, 3));
await b.close();
