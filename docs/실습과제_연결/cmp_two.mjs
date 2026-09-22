import { createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';
import { resolve } from 'node:path';
const require = createRequire('X:/이것저것/수학관련/2026_AI+수업 우수사례+데이터 리터러시/2026_대전교육청_인공지능 연수 설계안 개발 연구회/math-lab/package.json');
const { chromium } = require('playwright');
const b = await chromium.launch();
for (const f of process.argv.slice(2)) {
  const p = await b.newPage();
  const errs = []; p.on('pageerror', e => errs.push(String(e))); p.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
  await p.goto(pathToFileURL(resolve(f)).href, { waitUntil: 'load' });
  await p.waitForTimeout(1200);
  const r = await p.evaluate(() => ({
    LABS: LABS.length, PRINS: PRINS.length, THUMBS: THUMBS.length,
    VLAB: Object.keys(VLAB).length, LESSON: Object.keys(LESSON).length,
    CATALOG: typeof CATALOG !== 'undefined' ? CATALOG.length : -1,
    lab356: (LESSON[356].demo ? String(LESSON[356].demo).length : 0),
  }));
  console.log(f.split(/[\/]/).pop(), JSON.stringify(r), 'errors', errs.length);
  await p.close();
}
await b.close();
