import { createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';
import { resolve } from 'node:path';
const require = createRequire('X:/이것저것/수학관련/2026_AI+수업 우수사례+데이터 리터러시/2026_대전교육청_인공지능 연수 설계안 개발 연구회/math-lab/package.json');
const { chromium } = require('playwright');
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1280, height: 1000 } });
const errs = []; p.on('pageerror', e => errs.push(String(e))); p.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
await p.goto(pathToFileURL(resolve(process.argv[2])).href, { waitUntil: 'load' });
await p.waitForTimeout(1000);
console.log(await p.evaluate(() => ({
  problem: (LESSON[356].problem.svg.match(/class="lsimg"/g) || []).length,
  apply: (LESSON[356].apply.q.match(/class="lsimg"/g) || []).length,
  what: (PRINS[355].what.match(/class="lsimg"/g) || []).length,
  probe: (PRINS[355].probe.match(/class="lsimg"/g) || []).length,
  whatHead: PRINS[355].what.replace(/<img[^>]*>/, '[img]').slice(0, 40),
  lab3what: (PRINS[2].what.match(/class="lsimg"/g) || []).length,
  lab21what: (PRINS[20].what.match(/class="lsimg"/g) || []).length,
  labs: LABS.length, prins: PRINS.length,
})));
await p.evaluate(() => { openLab(355); });
await p.waitForTimeout(800);
await p.screenshot({ path: process.argv[3] + '/t356.png' });
console.log('errors', errs);
await b.close();
