import { chromium } from 'playwright';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
const ROOT = dirname(fileURLToPath(import.meta.url));
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1300, height: 1300 } });
await p.goto('file://' + join(ROOT, 'dist', 'index.html'));
const r = await p.evaluate(() => {
  const d = document.createElement('div'); document.body.appendChild(d);
  indepDemo(d);
  return d.innerHTML.slice(0, 700);
});
console.log(r);
await b.close();
