// 열자마자 실험이 보이는지 — 캔버스 가시성 + 상단 구조 확인
import { chromium } from 'playwright';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
const ROOT = dirname(fileURLToPath(import.meta.url));
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1200, height: 1100 } });
await p.goto('file://' + join(ROOT, 'dist', 'index.html'));
for (const n of [5, 52, 102]) {
  await p.evaluate(i => openLab(i - 1), n);
  await p.waitForTimeout(450);
  const r = await p.evaluate(() => {
    const cv = document.querySelector('#mBody canvas:not(.pgmpad canvas)');
    const vis = cv && cv.getBoundingClientRect().height > 50 && getComputedStyle(cv.closest('div')).display !== 'none';
    const order = [...document.querySelector('#mBody').children].map(e => e.className || e.tagName).slice(0, 5).join(' → ');
    return { vis, order };
  });
  console.log('LAB', n, '| 캔버스 즉시 보임:', r.vis, '| 상단 구조:', r.order);
  await p.locator('#mX').click(); await p.waitForTimeout(80);
}
await b.close();
