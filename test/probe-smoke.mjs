import { chromium } from 'playwright';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
const ROOT = dirname(fileURLToPath(import.meta.url));
const URL = 'file://' + join(ROOT, 'dist', 'index.html');
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1300, height: 1100 } });
const errs = [];
p.on('pageerror', e => errs.push('PAGE ' + e.message));
p.on('console', m => { if (m.type() === 'error') errs.push('CON ' + m.text()); });
await p.goto(URL);
const n = await p.locator('#cards .card').count();
console.log('cards:', n);
let lad = 0, pg = 0, plk = 0;
const noLad = [];
for (let i = 0; i < n; i++) {
  await p.locator('#cards .card').nth(i).click();
  await p.waitForTimeout(120);
  if (await p.locator('.ldr').count()) lad++; else noLad.push(i + 1);
  if (await p.locator('.pgb').count()) pg++;
  if (await p.locator('#plock').count()) plk++;
  await p.locator('#mX').click();
  await p.waitForTimeout(60);
}
console.log('사다리:', lad, '| 예상:', pg, '| 잠금:', plk, '| 사다리 없음:', noLad.join(','));
console.log('errors:', errs.length);
errs.slice(0, 8).forEach(e => console.log('ERR', e.slice(0, 160)));
await b.close();
