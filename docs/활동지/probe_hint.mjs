import { createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';
import { resolve } from 'node:path';
const require = createRequire('X:/이것저것/수학관련/2026_AI+수업 우수사례+데이터 리터러시/2026_대전교육청_인공지능 연수 설계안 개발 연구회/math-lab/package.json');
const { chromium } = require('playwright');
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1280, height: 1000 } });
const errs = []; p.on('pageerror', e => errs.push(String(e))); p.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
await p.goto(pathToFileURL(resolve(process.argv[2])).href, { waitUntil: 'load' });
await p.waitForTimeout(1300);
const GPS = ['편의점','도서관','삼변측량','원의 방정식','중심 (a, b)','r² ','(5, 4)','연립'];
for (const n of [1,2,3,4,21]) {
  const r = await p.evaluate(({k, GPS}) => {
    const m = document.getElementById('mask'); if (m) m.classList.remove('on');
    openLab(k-1);
    const box = document.createElement('div'); box.style.cssText='position:fixed;left:-9999px;top:0;width:1200px';
    document.body.appendChild(box);
    let notes = [];
    try {
      LESSON[k].demo(box);
      // 노트 칸마다 확인 단추를 눌러 나오는 문구를 모은다 (빈칸 상태 = 오답 안내)
      box.querySelectorAll('.eqc').forEach(el => {
        const btn = el.querySelector('button'); if (btn) btn.click();
        const r = el.querySelector('.eqr');
        notes.push((el.querySelector('.eqt')?.innerText || '?').slice(0,26) + ' → ' + (r ? r.innerText.slice(0,60) : '(없음)'));
      });
    } catch (e) { notes.push('ERR ' + e); }
    const hit = GPS.filter(g => notes.join(' ').includes(g));
    box.remove();
    return { notes, hit };
  }, { k: n, GPS });
  console.log('=== LAB ' + n + (r.hit.length ? '  ⚠ GPS 낱말: ' + r.hit.join(',') : ''));
  r.notes.forEach(t => console.log('   ' + t));
}
console.log('errors', errs.slice(0,3));
await b.close();
