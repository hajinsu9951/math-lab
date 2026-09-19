import { createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';
import { resolve } from 'node:path';
const require = createRequire('X:/이것저것/수학관련/2026_AI+수업 우수사례+데이터 리터러시/2026_대전교육청_인공지능 연수 설계안 개발 연구회/math-lab/package.json');
const { chromium } = require('playwright');
const b = await chromium.launch();
const p = await b.newPage();
await p.goto(pathToFileURL(resolve(process.argv[2])).href, { waitUntil: 'load' });
console.log(await p.evaluate(() => ({
  LABS: LABS.length, PRINS: PRINS.length, LESSONkeys: Object.keys(LESSON).length,
  p355: PRINS[355] ? (PRINS[355].eq || '').slice(0, 40) : '없음',
  p20: PRINS[20] ? (PRINS[20].eq || '').slice(0, 40) : '없음',
  p1: PRINS[1] ? (PRINS[1].eq || '').slice(0, 40) : '없음',
  p2: PRINS[2] ? (PRINS[2].eq || '').slice(0, 40) : '없음',
})));
await b.close();
