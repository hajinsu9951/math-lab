// 배치 J 정직 완주 — LAB 21~32 (문제-실험 융합)
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
const setv = (id, v) => p.evaluate(([i, x]) => { const e = document.getElementById(i); e.value = x; e.dispatchEvent(new Event('input', { bubbles: true })); }, [id, v]);
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
  for (let i = 1; i < pts.length; i++) await p.mouse.move(f.l + pts[i][0] * f.sx, f.t + pts[i][1] * f.sy, { steps: 18 });
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

/* 21 역함수 — 일차(암호 해독) → 점대칭 → 유리 → 무리 정의역 밖 */
await run(21, '역함수', [
  clickManual,
  async () => { await sel('syf', 'lin'); await setv('sya', 5); },
  () => p.evaluate(() => { const c = document.getElementById('syp'); c.checked = true; c.dispatchEvent(new Event('change', { bubbles: true })); }),
  () => sel('syf', 'rat'),
  async () => { await sel('syf', 'rt'); await setv('sya', 0.5); },
]);
/* 22 급수 — 항 쌓기(띠 안) → 발산 → 조화 → 교대 */
await run(22, '급수', [
  clickManual,
  async () => { await clk('seAdd10'); await p.waitForTimeout(200); await clk('seAdd10'); },
  () => sel('sek', 'geo2'),
  () => sel('sek', 'harm'),
  () => sel('sek', 'alt'),
]);
/* 23 테일러 — 37°에서 4자리 → 멀리 → 반경 밖 → 심화 */
await run(23, '테일러', [
  clickManual,
  async () => {
    await dragCv('ty1', [[245.7, 210], [214.9, 210]]);       // x0 : 2 → 0.65
    for (let i = 0; i < 6; i++) { await clk('tyUp'); await p.waitForTimeout(90); }
  },
  () => dragCv('ty1', [[214.9, 210], [268.6, 210]]),          // x0 : 0.65 → 3
  async () => { await sel('tyf', 'log'); await p.waitForTimeout(200); await dragCv('ty1', [[268.6, 210], [230, 210]]); },
  clickManual,
]);
/* 24 회전체 — 와인잔+오차 → 128장 → 표 → 원뿔 */
await run(24, '회전체', [
  clickManual,
  async () => { await clk('rvP4'); await p.waitForTimeout(200); for (let i = 0; i < 5; i++) { await clk('rvUp'); await p.waitForTimeout(110); } },
  () => clk('rvFine'),
  clickManual,
  () => clk('rvP2'),
]);
/* 25 소인수 — 83×89 부수기 → 작은 쌍 → 표 → 큰 쌍 */
const pick = async v => { await p.evaluate(x => { const bt = document.querySelector('#pfGrid [data-v="' + x + '"]'); if (bt) bt.click(); }, v); await p.waitForTimeout(140); };
await run(25, '소인수', [
  clickManual,
  async () => { await pick(83); await pick(89); await clk('pfAuto'); await p.waitForTimeout(6500); },
  async () => { await pick(3); await pick(5); await clk('pfAuto'); await p.waitForTimeout(1200); },
  clickManual,
  async () => { await pick(83); await pick(89); await clk('pfAuto'); await p.waitForTimeout(6500); },
]);
/* 26 정수 — (−5)+8 → 빼기 → 이중부호 → (−7)+12 */
const izX = v => 26 + 328 * (v + 12) / 24;
await run(26, '정수', [
  clickManual,
  async () => {
    await dragCv('iz1', [[izX(-5), 150], [izX(-5), 150]]);
    await dragCv('iz1', [[izX(-2), 96], [izX(3), 96]]);       // b 끝 → a+8 = 3
  },
  () => sel('izop', '-'),
  () => dragCv('iz1', [[izX(-13 + 5), 96], [izX(-1), 96]]),
  async () => {
    await sel('izop', '+');
    await dragCv('iz1', [[izX(-5), 150], [izX(-7), 150]]);
    await dragCv('iz1', [[izX(-3), 96], [izX(5), 96]]);
  },
]);
/* 27 성냥개비 — n=5 → n=8 → 규칙 → 심화 */
await run(27, '성냥개비', [
  clickManual,
  async () => { for (let i = 0; i < 4; i++) { await clk('ltAdd'); await p.waitForTimeout(130); } },
  async () => { for (let i = 0; i < 3; i++) { await clk('ltAdd'); await p.waitForTimeout(130); } },
  clickManual, clickManual,
]);
/* 28 저울 — 문제 풀기(x=4) → 균형 실험 → 반례 → 심화 */
await run(28, '저울', [
  clickManual,
  async () => { await clk('scS1'); await clk('scS1'); await clk('scS1'); await clk('scD2'); },
  async () => { await clk('scR'); await p.waitForTimeout(150); await clk('scA1'); await clk('scD2'); },
  () => clk('scL1'),
  clickManual,
]);
/* 29 지렛대 — x=2·4 (곱 24) → 점 3개 → 정비례 → 0.5m */
await run(29, '지렛대', [
  clickManual,
  async () => {
    await dragCv('pp1', [[30 + 320 * 0.4, 104], [30 + 320 * 0.2, 104]]);   // x → 2
    await dragCv('pp1', [[30 + 320 * 0.2, 104], [30 + 320 * 0.4, 104]]);   // x → 4
  },
  async () => {
    for (const v of [2, 5, 8]) {
      await dragCv('pp1', [[30 + 320 * v / 10, 104], [30 + 320 * v / 10, 103]]);
      await clk('ppRec'); await p.waitForTimeout(150);
    }
  },
  () => sel('ppk', 'dir'),
  async () => { await sel('ppk', 'inv'); await dragCv('pp1', [[30 + 320 * 0.4, 104], [30 + 320 * 0.05, 104]]); },
]);
/* 30 평행선 — 평행 깨기 → 동측내각 → 표 → 심화 */
await run(30, '평행선', [
  clickManual,
  () => dragCv('pa1', [[298, 208], [285, 235]]),
  async () => { await clk('paPar'); await sel('paM', 'in'); },
  clickManual, clickManual,
]);
/* 31 합동 — SSS → SSA 소멸 → 하나 → 심화 */
await run(31, '합동', [
  clickManual,
  () => sel('cgM', 'sss'),
  async () => { await sel('cgM', 'ssa'); await p.waitForTimeout(200); await dragCv('cg1', [[247.7, 211.1], [213, 182]]); },
  () => dragCv('cg1', [[213, 182], [297, 253]]),
  clickManual,
]);
/* 32 부채꼴 — 45° → 240° → r120 → r40 */
await run(32, '부채꼴', [
  clickManual,
  () => dragCv('sc1', [[140, 88.7], [236.6, 101.4]]),
  () => dragCv('sc1', [[236.6, 101.4], [140, 227.3]]),
  () => dragCv('sc1', [[260, 158], [300, 158]]),
  () => dragCv('sc1', [[300, 158], [220, 158]]),
]);
console.log('pageerrors:', errs.length, errs.slice(0, 3));
await b.close();
