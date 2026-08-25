import { chromium } from 'playwright';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
const ROOT = dirname(fileURLToPath(import.meta.url));
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1300, height: 1300 } });
await p.goto('file://' + join(ROOT, 'dist', 'index.html'));
await p.evaluate(() => openLab(162));
await p.waitForTimeout(500);
const info = await p.evaluate(() => {
  const t = document.body.innerText;
  const res = ['가위곱이 0', '화살표가 반대쪽을 가리킵니다'];
  return res.map(r => r + ' → ' + (new RegExp(r).test(t) ? '★있음' : '없음'))
    .concat(['out=' + (document.getElementById('vsout') || {}).innerText]);
});
console.log(info.join('\n'));
await b.close();
