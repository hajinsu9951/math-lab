import { chromium } from 'playwright';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
const ROOT = dirname(fileURLToPath(import.meta.url));
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1300, height: 1300 } });
p.on('pageerror', e => console.log('PAGEERROR:', e.message));
await p.goto('file://' + join(ROOT, 'dist', 'index.html'));
for (const [n, want] of [[38, '단면'], [89, '동전'], [141, '원판'], [145, 'P(A ∩ B)']]) {
  await p.evaluate(i => openLab(i), n - 1);
  await p.waitForTimeout(400);
  const t = await p.evaluate(() => document.body.innerText);
  console.log('LAB', n, '—', t.includes(want) ? 'OK (' + want + ' 있음)' : '★ ' + want + ' 없음');
  await p.locator('#mX').click(); await p.waitForTimeout(100);
}
await b.close();
