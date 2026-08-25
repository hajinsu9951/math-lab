// 무조작 감사 — 데모를 전혀 만지지 않고 「해냈어요」만 눌렀을 때
// 자동 단계가 저절로 완료되면(클릭 수 < 완료 수) 그 정규식은 상시 문구와 자기일치하는 결함이다.
import { chromium } from 'playwright';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
const ROOT = dirname(fileURLToPath(import.meta.url));
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1300, height: 1300 } });
const errs = [];
p.on('pageerror', e => errs.push(e.message));
await p.goto('file://' + join(ROOT, 'dist', 'index.html'));

async function openGate() {
  const has = await p.evaluate(() => !!document.querySelector('.pgb'));
  if (!has) return;
  const cv = p.locator('.pgpad canvas').first();
  const bb = await cv.boundingBox();
  if (bb) {
    await p.mouse.move(bb.x + 20, bb.y + 20); await p.mouse.down();
    await p.mouse.move(bb.x + 110, bb.y + 70, { steps: 6 }); await p.mouse.up();
  }
  await p.waitForTimeout(180);
  await p.evaluate(() => { const b = document.querySelector('[id^="pgGo_"]'); if (b && !b.disabled) b.click(); });
  await p.waitForTimeout(220);
}
let bad = 0;
for (let i = 0; i < 111; i++) {
  await p.evaluate(n => openLab(n), i);
  await p.waitForTimeout(350);
  await openGate();
  const total = await p.evaluate(() => document.querySelectorAll('.ldi').length);
  let clicks = 0;
  for (let k = 0; k < total + 2; k++) {
    const done = await p.evaluate(() => (document.querySelector('#ldp') || {}).textContent || '');
    if (/완주/.test(done)) break;
    const clicked = await p.evaluate(() => { const el = document.querySelector('.ldi.now .ldk'); if (el && !el.disabled) { el.click(); return true; } return false; });
    if (clicked) clicks++;
    await p.waitForTimeout(260);
  }
  const doneN = await p.evaluate(() => document.querySelectorAll('.ldi.done').length);
  if (doneN > clicks) { console.log(`LAB ${String(i + 1).padStart(2, '0')}  무조작 자동완료 ${doneN - clicks}단계 ← 결함`); bad++; }
  await p.locator('#mX').click(); await p.waitForTimeout(70);
}
console.log(bad ? '결함 ' + bad + '종' : '전 실험실 무결 — 무조작 자동완료 0');
console.log('pageerrors:', errs.length);
await b.close();
