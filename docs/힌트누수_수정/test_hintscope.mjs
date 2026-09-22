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
const out = await p.evaluate(async () => {
  const log = [];
  const wait = ms => new Promise(r => setTimeout(r, ms));
  const mk = k => { const d = document.createElement('div'); d.id = 'probe' + k;
    d.style.cssText = 'position:fixed;left:0;top:0;width:1200px;background:#fff;z-index:9';
    document.body.appendChild(d); LESSON[k].demo(d); return d; };

  // LAB 02 — 바른 값을 넣고 확인
  const d2 = mk(2);
  const set = (el, f, v) => { const i = el.querySelector('[data-f=' + f + ']'); if (i) i.value = String(v); };
  const n0 = d2.querySelector('.eqc[data-n="0"]'), n1 = d2.querySelector('.eqc[data-n="1"]'), n2 = d2.querySelector('.eqc[data-n="2"]');
  set(n0,'a',20); set(n0,'v',0.2); n0.querySelector('.eqk').click();
  set(n1,'a',16); set(n1,'b',20); set(n1,'v',0.8); n1.querySelector('.eqk').click();
  set(n2,'a',4); set(n2,'b',80); set(n2,'v',0.05); n2.querySelector('.eqk').click();
  await wait(120);
  log.push('LAB02 붉은 칸 .eqbad : ' + d2.querySelectorAll('.eqbad').length + '  (0 이어야 함)');
  log.push('LAB02 엉뚱한 힌트 .eqhint : ' + d2.querySelectorAll('.eqhint').length + '  (0 이어야 함)');
  log.push('LAB02 노트② 문구 : ' + n1.querySelector('.eqr').innerText.slice(0,40));
  d2.remove();

  // LAB 01 — 제 검사기는 살아 있어야 한다
  const d1 = mk(1); await wait(400);
  const c0 = d1.querySelector('.eqc[data-i="0"]');
  c0.querySelector('[data-f=a]').value='1'; c0.querySelector('[data-f=b]').value='1'; c0.querySelector('[data-f=r]').value='5';
  c0.querySelector('.eqk').click(); await wait(150);
  log.push('LAB01 r 오답 → .eqbad ' + d1.querySelectorAll('.eqbad').length + ' · 힌트: ' + (d1.querySelector('.eqhint')?.innerText || '(없음)').slice(0,46));
  c0.querySelector('[data-f=r]').value='25'; c0.querySelector('.eqk').click(); await wait(150);
  log.push('LAB01 바른 값 → 힌트: ' + (d1.querySelector('.eqhint')?.innerText || '(없음)').slice(0,30));
  d1.remove();
  return log;
});
console.log(out.join('\n'));
console.log('errors', errs.slice(0,3));
await b.close();
