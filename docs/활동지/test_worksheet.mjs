import { createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';
import { resolve } from 'node:path';
import { writeFileSync } from 'node:fs';
const require = createRequire('X:/이것저것/수학관련/2026_AI+수업 우수사례+데이터 리터러시/2026_대전교육청_인공지능 연수 설계안 개발 연구회/math-lab/package.json');
const { chromium } = require('playwright');
const idx = process.argv[2], out = process.argv[3];
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1280, height: 1000 } });
const errs = []; p.on('pageerror', e => errs.push(String(e))); p.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
await p.goto(pathToFileURL(resolve(idx)).href, { waitUntil: 'load' });
await p.waitForTimeout(1300);

for (const n of [31,35,40]) {
  const r = await p.evaluate(k => {
    const m = document.getElementById('mask'); if (m) m.classList.remove('on');
    openLab(k - 1);
    const btn = document.querySelector('#ls0ws');
    const has = !!btn && btn.hidden === false;
    let html = '', err = '';
    if (typeof lessonSheet === 'function' && LESSON[k]) {
      try { html = lessonSheet(LESSON[k], PRINS[k - 1], k); } catch (e) { err = String(e); }
    }
    return { lesson: !!LESSON[k], has, len: html.length, err, html };
  }, n);
  if (r.html) writeFileSync(`${out}/ws_LAB${String(n).padStart(2, '0')}.html`, r.html, 'utf-8');
  console.log(`LAB ${String(n).padStart(2, '0')} | 수업모형 ${r.lesson} | 단추 ${r.has} | 활동지 ${r.len}자 ${r.err}`);
  await p.evaluate(() => { const m = document.getElementById('mask'); if (m) m.classList.remove('on'); });
  await p.waitForTimeout(150);
}
console.log('errors', errs.slice(0, 5));
await b.close();
