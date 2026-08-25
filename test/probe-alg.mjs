// 대수 신규 6종 정직 완주 + 무조작 감사 — LAB 106~111
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
const setv = (id, v) => p.evaluate(([i, x]) => { const e = document.getElementById(i); e.value = x; e.dispatchEvent(new Event('input', { bubbles: true })); }, [id, v]);
const sel = (id, v) => p.evaluate(([i, x]) => { const e = document.getElementById(i); e.value = x; e.dispatchEvent(new Event('change', { bubbles: true })); }, [id, v]);
const chk = (id, v) => p.evaluate(([i, x]) => { const e = document.getElementById(i); e.checked = x; e.dispatchEvent(new Event('change', { bubbles: true })); }, [id, v]);
const clickManual = async () => { await p.evaluate(() => { const el = document.querySelector('.ldi.now .ldk'); if (el && !el.disabled) el.click(); }); await p.waitForTimeout(150); };
const prog = () => p.evaluate(() => (document.querySelector('#ldp') || {}).textContent || '');
async function run(lab, name, steps) {
  await p.evaluate(n => openLab(n), lab - 1);
  await p.waitForTimeout(420);
  for (const st of steps) { await st(); await p.waitForTimeout(330); }
  const pr = await prog();
  console.log(`LAB ${lab} ${name}: ${pr} ${/완주/.test(pr) ? 'OK' : '★미완'}`);
  await p.locator('#mX').click(); await p.waitForTimeout(110);
}

/* 106 단위원 — 150° → 210° → 표 → 390° */
await run(106, '단위원', [
  clickManual,
  () => clk('uc150'),
  () => clk('uc210'),
  clickManual,
  () => clk('uc390'),
]);
/* 107 일출 — D 맞추기 → 모형 명중 → 표 → 심화 */
await run(107, '일출 모형', [
  clickManual,
  () => setv('srD', 6.45),
  async () => { await setv('srA', 1.15); await setv('srC', 9.5); },
  clickManual, clickManual,
]);
/* 108 사인법칙 — 문제값 → 검산 → 표 → 심화 */
await run(108, '사인·코사인법칙', [
  clickManual,
  async () => { await setv('lsA', 63); await setv('lsB', 55); await setv('lsC', 50); },
  () => clk('lsChk'),
  clickManual, clickManual,
]);
/* 109 대출 — 문제값 → 48개월 → 표 → 심화 */
await run(109, '대출 상환', [
  clickManual,
  async () => { await setv('loP', 1200); await setv('loR', 6); await setv('loN', 24); },
  () => setv('loN', 48),
  clickManual, clickManual,
]);
/* 110 시그마 — 붙이기 → Σk² → 표 → 심화 */
await run(110, '시그마', [
  clickManual,
  () => clk('sgFlip'),
  () => sel('sgK', '2'),
  clickManual, clickManual,
]);
/* 111 도미노 — 전부 무너짐 → 5번 빼기 → 표 → 간격 넓히기 */
await run(111, '귀납법', [
  clickManual,
  async () => { await setv('dmGap', 1.4); await clk('dmGo'); },
  async () => { await chk('dmBreak', true); await clk('dmGo'); },
  clickManual,
  async () => { await chk('dmBreak', false); await setv('dmGap', 2.4); await clk('dmGo'); },
]);

/* 무조작 감사 */
for (const lab of [106, 107, 108, 109, 110, 111]) {
  await p.evaluate(n => openLab(n), lab - 1);
  await p.waitForTimeout(400);
  const total = await p.evaluate(() => document.querySelectorAll('.ldi').length);
  let clicks = 0;
  for (let k = 0; k < total + 2; k++) {
    if (/완주/.test(await prog())) break;
    const c = await p.evaluate(() => { const el = document.querySelector('.ldi.now .ldk'); if (el && !el.disabled) { el.click(); return true; } return false; });
    if (c) clicks++;
    await p.waitForTimeout(230);
  }
  const doneN = await p.evaluate(() => document.querySelectorAll('.ldi.done').length);
  console.log(`무조작 LAB ${lab}: 클릭 ${clicks} / 완료 ${doneN} ${doneN > clicks ? '★결함' : 'OK'}`);
  await p.locator('#mX').click(); await p.waitForTimeout(100);
}
console.log('pageerrors:', errs.length, errs.slice(0, 3));
await b.close();
