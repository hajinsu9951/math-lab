// 결함 6종 — 어느 단계가 무조작 자동완료되는지 특정
import { chromium } from 'playwright';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
const ROOT = dirname(fileURLToPath(import.meta.url));
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1300, height: 1300 } });
await p.goto('file://' + join(ROOT, 'dist', 'index.html'));
for (const lab of [33, 39, 44, 65, 80, 86]) {
  await p.evaluate(n => openLab(n), lab - 1);
  await p.waitForTimeout(380);
  const total = await p.evaluate(() => document.querySelectorAll('.ldi').length);
  let clicks = [];
  for (let k = 0; k < total + 2; k++) {
    const st = await p.evaluate(() => {
      const items = [...document.querySelectorAll('.ldi')];
      return items.map(el => el.classList.contains('done') ? 'D' : el.classList.contains('now') ? 'N' : '-').join('');
    });
    clicks.push(st);
    const done = await p.evaluate(() => (document.querySelector('#ldp') || {}).textContent || '');
    if (/완주/.test(done)) break;
    await p.evaluate(() => { const el = document.querySelector('.ldi.now .ldk'); if (el && !el.disabled) el.click(); });
    await p.waitForTimeout(260);
  }
  console.log('LAB', lab, clicks.join(' → '));
  await p.locator('#mX').click(); await p.waitForTimeout(80);
}
await b.close();
