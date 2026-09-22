import { createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';
import { resolve } from 'node:path';
const require = createRequire('X:/이것저것/수학관련/2026_AI+수업 우수사례+데이터 리터러시/2026_대전교육청_인공지능 연수 설계안 개발 연구회/math-lab/package.json');
const { chromium } = require('playwright');
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1280, height: 900 } });
await p.goto(pathToFileURL(resolve(process.argv[2])).href, { waitUntil: 'load' });
await p.waitForTimeout(1200);
console.log((await p.evaluate(() => {
  const rows = [];
  for (const k of Object.keys(LESSON)) {
    const d = document.createElement('div'); d.style.cssText='position:fixed;left:-9999px;top:0;width:1200px';
    document.body.appendChild(d);
    let n = 0, head = '', gps = false;
    try { LESSON[k].demo(d);
      n = d.querySelectorAll('.eqc').length;
      head = (d.querySelector('.lg1mh')?.innerText || '').slice(0, 30);
      const t = d.innerText;
      gps = /편의점|도서관|삼변측량|원의 방정식|오차 삼각형/.test(t);
    } catch (e) { head = 'ERR'; }
    if (n || gps) rows.push(`LAB ${String(k).padStart(3)} 노트 ${n}칸  ${gps?'⚠GPS문구 ':''}${head}`);
    d.remove();
  }
  return rows;
})).join('\n'));
await b.close();
