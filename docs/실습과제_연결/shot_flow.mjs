import { createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';
import { resolve } from 'node:path';
const require = createRequire('X:/이것저것/수학관련/2026_AI+수업 우수사례+데이터 리터러시/2026_대전교육청_인공지능 연수 설계안 개발 연구회/math-lab/package.json');
const { chromium } = require('playwright');
const idx = process.argv[2], out = process.argv[3];
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1280, height: 1100 } });
const errs = []; p.on('pageerror', e => errs.push(String(e))); p.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
await p.goto(pathToFileURL(resolve(idx)).href, { waitUntil: 'load' });
await p.waitForTimeout(1500);
// 탭③ 운영 흐름으로 이동 — 「연수 실습 과제」 카드가 보이게
const moved = await p.evaluate(() => {
  const t = [...document.querySelectorAll('button, a')].find(b => /운영 흐름|3시간 운영|③/.test(b.textContent || ''));
  if (t) t.click();
  return !!t;
});
await p.waitForTimeout(700);
const ok = await p.evaluate(() => {
  const e = document.querySelector('#fcore');
  if (!e) return false;
  e.scrollIntoView({ block: 'start' });
  return true;
});
await p.waitForTimeout(500);
await p.screenshot({ path: out + '/t3_flow.png' });
// 타임라인도 한 장
await p.evaluate(() => { const e = document.querySelector('.tl'); if (e) e.scrollIntoView({ block: 'start' }); });
await p.waitForTimeout(400);
await p.screenshot({ path: out + '/t3_timeline.png' });
console.log('탭 이동', moved, '| #fcore', ok, '| errors', errs.slice(0, 3));
await b.close();
