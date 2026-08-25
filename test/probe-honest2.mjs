// 나머지 자동 감지 실험실 완주 검증 — 2,3,15,16,17,21,22,23,24
import { chromium } from 'playwright';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
const ROOT = dirname(fileURLToPath(import.meta.url));
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1300, height: 1200 } });
const errs = [];
p.on('pageerror', e => errs.push('PAGE ' + e.message));
await p.goto('file://' + join(ROOT, 'dist', 'index.html'));

const set = (id, v) => p.evaluate(([i, x]) => { const e = document.getElementById(i); e.value = x; e.dispatchEvent(new Event('input', { bubbles: true })); }, [id, v]);
const clk = (id) => p.evaluate(i => { const e = document.getElementById(i); if (e) e.click(); }, id);
const clickManual = async () => { await p.evaluate(() => { const el = document.querySelector('.ldi.now .ldk'); if (el && !el.disabled) el.click(); }); await p.waitForTimeout(120); };
const prog = () => p.evaluate(() => (document.querySelector('#ldp') || {}).textContent || '');
const tick = () => p.waitForTimeout(280);

async function openGate() {
  const has = await p.evaluate(() => !!document.querySelector('.pgb'));
  if (!has) return;
  const cv = p.locator('.pgpad canvas').first();
  const bb = await cv.boundingBox();
  if (bb) {
    await p.mouse.move(bb.x + 20, bb.y + 20); await p.mouse.down();
    await p.mouse.move(bb.x + 120, bb.y + 60, { steps: 8 });
    await p.mouse.move(bb.x + 60, bb.y + 90, { steps: 6 });
    await p.mouse.up();
  }
  await p.waitForTimeout(200);
  await p.evaluate(() => { const b = document.querySelector('[id^="pgGo_"]'); if (b && !b.disabled) b.click(); });
  await p.waitForTimeout(250);
}
async function run(lab, name, steps) {
  await p.evaluate(n => openLab(n), lab - 1);
  await p.waitForTimeout(350);
  await openGate();
  for (const st of steps) { await st(); await tick(); }
  const pr = await prog();
  console.log(`LAB ${String(lab).padStart(2, '0')} ${name}: ${pr} ${/완주/.test(pr) ? 'OK' : '★미완'}`);
  await p.locator('#mX').click(); await p.waitForTimeout(80);
}

/* LAB 02 — S1 수동 / S2 수동 / S3 사전에 없는 단어 / S4·S5 수동 */
await run(2, '베이즈', [
  clickManual, clickManual,
  async () => { await p.evaluate(() => { const e = document.getElementById('bt'); e.value = '외계어단어만있음'; e.dispatchEvent(new Event('input', { bubbles: true })); }); await clk('bgo'); },
  clickManual, clickManual,
]);

/* LAB 03 — S1 수동 / S2 r=1.0 → 배가시간 1.00일 / S3~S5 수동 */
await run(3, '확산', [
  clickManual,
  () => set('sr', 1),
  clickManual, clickManual, clickManual,
]);

/* LAB 15 — S1 수동 / S2 지우고 일렬 5점 / S3(수동)·S4·S5 */
await run(15, '회귀', [
  clickManual,
  async () => {
    await clk('rclr'); await p.waitForTimeout(150);
    const bb = await p.locator('#r1').boundingBox();
    for (let k = 0; k < 6; k++) {
      await p.mouse.click(bb.x + 30 + k * 50, bb.y + bb.height - 30 - k * 35);
      await p.waitForTimeout(80);
    }
  },
  clickManual, clickManual, clickManual,
]);

/* LAB 16 — S1 수동 / S2 수동 / S3 발산 만들기 / S4·S5 수동 */
await run(16, '경사하강', [
  clickManual, clickManual,
  async () => {
    // 학습률 슬라이더 찾기 (id 모름 — range 중 max 큰 것)
    await p.evaluate(() => {
      const lr = document.getElementById('dlr');
      if (lr) { lr.value = lr.max; lr.dispatchEvent(new Event('input', { bubbles: true })); }
    });
    for (let k = 0; k < 4; k++) { await clk('drun'); await p.waitForTimeout(500); }
  },
  clickManual, clickManual,
]);

/* LAB 17 — S1 수동 / S2 +1000 반복(4자리·오차<0.1) / S3~S5 수동 */
await run(17, '몬테카를로', [
  clickManual,
  async () => {
    for (let k = 0; k < 20; k++) {
      await clk('m1k'); await p.waitForTimeout(120);
      const done = await p.evaluate(() => /\d{4}개 중[\s\S]*오차 0\.0/.test(document.querySelector('#mBody').innerText));
      if (done) break;
    }
  },
  clickManual, clickManual, clickManual,
]);

/* LAB 21 — S1 함수 전환(√x 등장) / S2~S5 수동 */
await run(21, 'y=x대칭', [
  clickManual, clickManual, clickManual, clickManual, clickManual,
]);

/* LAB 22 — S1 항 쌓기(수동) / S2 L·ε (끌기 어려워 수동 확인) / S3 공비>1 / S4 조화 / S5 교대 */
await run(22, '급수', [
  async () => { for (let k = 0; k < 12; k++) { await clk('seAdd'); await p.waitForTimeout(50); } await clickManual(); },
  clickManual,
  async () => { await p.evaluate(() => { const e = document.getElementById('sek'); if (e) { e.value='geo2'; e.dispatchEvent(new Event('change',{bubbles:true})); e.dispatchEvent(new Event('input',{bubbles:true})); } const btns = [...document.querySelectorAll('#mBody button')]; for (const b of btns) if (/공비|1\.3|r\s*=/.test(b.textContent)) {} }); for (let k = 0; k < 6; k++) { await clk('seAdd'); await p.waitForTimeout(50); } },
  async () => { await p.evaluate(() => { const btns = [...document.querySelectorAll('#mBody button')]; const e=document.getElementById('sek'); if(e){e.value='harm'; e.dispatchEvent(new Event('change',{bubbles:true})); e.dispatchEvent(new Event('input',{bubbles:true}));} }); for (let k = 0; k < 8; k++) { await clk('seAdd'); await p.waitForTimeout(40); } },
  async () => { await p.evaluate(() => { const btns = [...document.querySelectorAll('#mBody button')]; const e=document.getElementById('sek'); if(e){e.value='alt'; e.dispatchEvent(new Event('change',{bubbles:true})); e.dispatchEvent(new Event('input',{bubbles:true}));} }); for (let k = 0; k < 8; k++) { await clk('seAdd'); await p.waitForTimeout(40); } },
]);

/* LAB 23 — S1 항 6개 쌓기 / S2 x 멀리 / S3 수렴반경 밖 / S4·S5 수동 */
await run(23, '테일러', [
  async () => { for (let k = 0; k < 7; k++) { await clk('tyUp'); await p.waitForTimeout(60); } },
  async () => { const e = await p.evaluate(() => { const r = [...document.querySelectorAll('#mBody input[type=range]')]; const x = r.find(v => +v.min < 0); if (x) { x.value = x.max; x.dispatchEvent(new Event('input', { bubbles: true })); return x.max; } return null; }); },
  async () => { await p.evaluate(() => { const f = document.getElementById('tyf'); if (f) { f.value = 'log'; f.dispatchEvent(new Event('change', { bubbles: true })); f.dispatchEvent(new Event('input', { bubbles: true })); } }); await p.evaluate(() => { const r = [...document.querySelectorAll('#mBody input[type=range]')]; const x = r.find(v => +v.min < 0); if (x) { x.value = x.max; x.dispatchEvent(new Event('input', { bubbles: true })); } }); },
  clickManual, clickManual,
]);

/* LAB 24 — S1 수동 / S2 원판 촘촘히(오차<1%) / S3~S5 수동 */
await run(24, '회전체', [
  clickManual,
  async () => { await clk('rvFine'); await p.waitForTimeout(200); await clk('rvUp'); await p.waitForTimeout(200); },
  clickManual, clickManual, clickManual,
]);

console.log('pageerrors:', errs.length); errs.slice(0, 5).forEach(e => console.log(e.slice(0, 140)));
await b.close();
