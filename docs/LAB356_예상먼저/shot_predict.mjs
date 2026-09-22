import { createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';
import { resolve } from 'node:path';
const require = createRequire('X:/이것저것/수학관련/2026_AI+수업 우수사례+데이터 리터러시/2026_대전교육청_인공지능 연수 설계안 개발 연구회/math-lab/package.json');
const { chromium } = require('playwright');
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1180, height: 900 } });
await p.goto(pathToFileURL(resolve(process.argv[2])).href, { waitUntil: 'load' });
await p.waitForTimeout(1400);
await p.evaluate(() => {
  document.body.innerHTML = '';
  const box = document.createElement('div');
  box.style.cssText = 'width:1140px;background:#fff;padding:14px';
  document.body.appendChild(box);
  LESSON[356].demo(box);
  // 두 칸만 찍어 둔 중간 상태 — 제출 단추가 아직 잠긴 모습이 보이게
  const rows = [...box.querySelectorAll('#lcTT tbody tr')];
  rows[0].querySelector('[data-pv="0"]').click();
  rows[3].querySelector('[data-pv="1"]').click();
});
await p.waitForTimeout(400);
await p.evaluate(() => document.querySelector('#lcTT').scrollIntoView({block:'start'}));
await p.waitForTimeout(200);
await p.screenshot({ path: process.argv[3] + '/lab356_pred.png', fullPage: false });
console.log('찍음');
await b.close();
