import { createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';
import { resolve } from 'node:path';
const require = createRequire('X:/이것저것/수학관련/2026_AI+수업 우수사례+데이터 리터러시/2026_대전교육청_인공지능 연수 설계안 개발 연구회/math-lab/package.json');
const { chromium } = require('playwright');
const b = await chromium.launch();
const out = process.argv[2];
for (const f of process.argv.slice(3)) {
  const p = await b.newPage({ viewport: { width: 794, height: 1123 } });
  await p.goto(pathToFileURL(resolve(f)).href, { waitUntil: 'load' });
  await p.waitForTimeout(400);
  const name = f.split(/[\/]/).pop().replace('.html', '');
  await p.screenshot({ path: `${out}/${name}.png`, fullPage: true });
  const h = await p.evaluate(() => document.body.scrollHeight);
  console.log(name, '높이', h, 'px (A4 한 장 ≈ 1123)');
  await p.close();
}
await b.close();
