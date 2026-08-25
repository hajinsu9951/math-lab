import { chromium } from 'playwright';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
const ROOT = dirname(fileURLToPath(import.meta.url));
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1300, height: 1300 } });
await p.goto('file://' + join(ROOT, 'dist', 'index.html'));
const clk = id => p.evaluate(i => { const e = document.getElementById(i); if (e) e.click(); }, id);
const txt = () => p.evaluate(() => document.querySelector('#mBody').innerText);
const prog = () => p.evaluate(() => (document.querySelector('#ldp') || {}).textContent || '');
const clickManual = async () => { await p.evaluate(() => { const el = document.querySelector('.ldi.now .ldk'); if (el && !el.disabled) el.click(); }); await p.waitForTimeout(140); };
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
// 캔버스 격자 좌표를 페이지에서 직접 계산해 실마우스로 클릭
async function tapGrid(id, a, bb2) {
  const pt = await p.evaluate(([i, A, B]) => {
    const c = document.getElementById(i); c.scrollIntoView({ block: 'center' });
    const r = c.getBoundingClientRect();
    const CS = (c.width - 70) / 16;
    const x = 40 + (A - 0.5) * CS, y = 270 - (B - 0.5) * CS;
    return [r.left + x * r.width / c.width, r.top + y * r.height / c.height];
  }, [id, a, bb2]);
  await p.waitForTimeout(120);
  await p.mouse.click(pt[0], pt[1]);
  await p.waitForTimeout(250);
}
console.log('== LAB 85 (동적 CS)');
await p.evaluate(() => openLab(84)); await p.waitForTimeout(350);
await clickManual();
await tapGrid('tp1', 4, 3); console.log(' (4,3):', await prog(), (await txt()).match(/찾은[^\n]*/)?.[0]);
await tapGrid('tp1', 12, 5); console.log(' (12,5):', await prog(), (await txt()).match(/찾은[^\n]*/)?.[0]);
await clickManual(); await clickManual();
console.log(' 최종:', await prog());
await p.locator('#mX').click(); await p.waitForTimeout(80);
console.log('== LAB 15');
await p.evaluate(() => openLab(14)); await p.waitForTimeout(350); await openGate();
await clickManual();
await clk('rclr'); await p.waitForTimeout(150);
const bb = await p.locator('#r1').boundingBox();
for (let k = 0; k < 11; k++) { await p.mouse.click(bb.x + 22 + k * 30, bb.y + bb.height - 22 - k * 22); await p.waitForTimeout(60); }
await p.waitForTimeout(350);
const t = await txt();
console.log(' 데이터/R²:', t.match(/데이터 \d+개[^\n]*|결정계수 R[^\n]*/g));
console.log(' 정규식:', /데이터 1\d개 · 잔차제곱합[\s\S]{0,120}R² = (0\.9[5-9]|1\.000)/.test(t), '| ldp:', await prog());
await b.close();
