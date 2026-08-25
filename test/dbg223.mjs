import { chromium } from 'playwright';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
const ROOT = dirname(fileURLToPath(import.meta.url));
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1300, height: 1300 } });
await p.goto('file://' + join(ROOT, 'dist', 'index.html'));
await p.evaluate(() => openLab(222));
await p.waitForTimeout(500);
const t = await p.evaluate(() => document.body.innerText);
['완전한 반비례입니다', '사람을 더 넣어도 소용없습니다'].forEach(r => {
  const i = t.indexOf(r);
  console.log(r, '→', i < 0 ? '없음' : '★있음: ...' + t.slice(Math.max(0, i - 60), i + 30).replace(/\n/g, ' | '));
});
console.log('out=', await p.evaluate(() => (document.getElementById('mdout') || {}).innerText));
await b.close();
