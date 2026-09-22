import { createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';
import { resolve } from 'node:path';
const require = createRequire('X:/이것저것/수학관련/2026_AI+수업 우수사례+데이터 리터러시/2026_대전교육청_인공지능 연수 설계안 개발 연구회/math-lab/package.json');
const { chromium } = require('playwright');
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1280, height: 1000 } });
const errs = []; p.on('pageerror', e => errs.push(String(e))); p.on('console', m => { if (m.type()==='error') errs.push(m.text()); });
await p.goto(pathToFileURL(resolve(process.argv[2])).href, { waitUntil: 'load' });
await p.waitForTimeout(1300);
const out = await p.evaluate(() => {
  const log = [];
  const mk = k => { const d=document.createElement('div'); d.id='probe'+k;
    d.style.cssText='position:fixed;left:-9999px;top:0;width:1200px'; document.body.appendChild(d);
    LESSON[k].demo(d); return d; };
  // ① LAB 01 을 먼저 열고 노트를 눌러 본다 (화면에 남겨 둔 채)
  const d1 = mk(1);
  d1.querySelectorAll('.eqc .eqk').forEach(btn => btn.click());
  log.push('LAB01 노트 수 ' + d1.querySelectorAll('.eqc').length);
  // ② 그다음 LAB 02 를 연다 — LAB 01 DOM 이 아직 문서에 있는 상태
  const d2 = mk(2);
  d2.querySelectorAll('.eqc').forEach((el,i) => {
    const btn = el.querySelector('button'); if (btn) btn.click();
    log.push('LAB02 노트'+(i+1)+' → ' + (el.querySelector('.eqr')?.innerText || '').slice(0,70));
  });
  // ③ 전역 $ 가 무엇을 잡는지
  log.push('전역 $("#lgout") 가 LAB01 것인가: ' + (typeof $==='function' && $('#lgout') ? ($('#lgout').closest('#probe1')?'예':'아니오') : '없음'));
  return log;
});
console.log(out.join('\n'));
console.log('errors', errs.slice(0,3));
await b.close();
