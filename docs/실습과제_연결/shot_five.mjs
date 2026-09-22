/* 연수 실습 과제 5종의 「문제」 화면을 한 장씩 찍는다. 사용: node shot_five.mjs <index.html> <출력폴더> */
import { createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';
import { resolve } from 'node:path';
const require = createRequire('X:/이것저것/수학관련/2026_AI+수업 우수사례+데이터 리터러시/2026_대전교육청_인공지능 연수 설계안 개발 연구회/math-lab/package.json');
const { chromium } = require('playwright');
const idx = process.argv[2], out = process.argv[3];
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1240, height: 1000 } });
const errs = []; p.on('pageerror', e => errs.push(String(e))); p.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
await p.goto(pathToFileURL(resolve(idx)).href, { waitUntil: 'load' });
await p.waitForTimeout(1500);

for (const [n, tag] of [[1, 'lab01'], [2, 'lab02'], [3, 'lab03'], [21, 'lab21'], [356, 'lab356']]) {
  await p.evaluate(k => { const m = document.getElementById('mask'); if (m) m.classList.remove('on'); openLab(k - 1); }, n);
  await p.waitForTimeout(900);
  // 모달 안쪽만 — 뒤 배경 카드가 안 나오게
  const el = await p.$('#mask .modal, #mask > div, #mBody');
  if (el) await el.screenshot({ path: `${out}/five_${tag}.png` }).catch(() => p.screenshot({ path: `${out}/five_${tag}.png` }));
  else await p.screenshot({ path: `${out}/five_${tag}.png` });
  await p.evaluate(() => { const m = document.getElementById('mask'); if (m) m.classList.remove('on'); });
  await p.waitForTimeout(200);
}
console.log('찍음 5장 | errors', errs.slice(0, 3));
await b.close();
