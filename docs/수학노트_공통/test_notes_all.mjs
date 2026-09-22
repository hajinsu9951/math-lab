import { createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';
import { resolve } from 'node:path';
const require = createRequire('X:/이것저것/수학관련/2026_AI+수업 우수사례+데이터 리터러시/2026_대전교육청_인공지능 연수 설계안 개발 연구회/math-lab/package.json');
const { chromium } = require('playwright');
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1200, height: 1000 } });
const errs = []; p.on('pageerror', e => errs.push(String(e))); p.on('console', m => { if (m.type()==='error') errs.push(m.text()); });
await p.goto(pathToFileURL(resolve(process.argv[2])).href, { waitUntil: 'load' });
await p.waitForTimeout(1400);
const out = await p.evaluate(() => {
  const log = [];
  for (const k of [5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20]) {
    const box = document.createElement('div');
    box.style.cssText='position:fixed;left:-9999px;top:0;width:1150px';
    document.body.appendChild(box);
    let api = {};
    try { api = LESSON[k].demo(box) || {}; } catch(e) { log.push('LAB '+k+' demo ERR '+e); continue; }
    mathNote(box, LESSON[k], api);
    const cards = box.querySelectorAll('.lsnnote .eqc');
    const msgs = [];
    cards.forEach(el => { el.querySelector('.nek').click();
      msgs.push((el.querySelector('.eqr').innerText||'(빈)').replace(/\s+/g,' ').slice(0,38)); });
    log.push(`LAB ${String(k).padStart(2)} 칸 ${cards.length} · 빈칸 안내 → ` + msgs.join(' | '));
    box.remove();
  }
  // LAB 08 은 처음부터 값이 나온다 — 끝까지 통과시켜 본다
  const box = document.createElement('div');
  box.style.cssText='position:fixed;left:-9999px;top:0;width:1150px';
  document.body.appendChild(box);
  const api = LESSON[8].demo(box);
  mathNote(box, LESSON[8], api);
  const r = api.read();
  const k = +String(r[0]).replace(/[^0-9.]/g,''), n = +String(r[1]).replace(/[^0-9.]/g,'');
  const card = i => box.querySelectorAll('.lsnnote .eqc')[i];
  const fill = (i, vals) => { const ins=[...card(i).querySelectorAll('.eqi')]; vals.forEach((v,j)=>{ if(ins[j]) ins[j].value=String(v); }); };
  const hit = i => { card(i).querySelector('.nek').click(); return card(i).querySelector('.eqr').innerText.replace(/\s+/g,' ').slice(0,72); };
  log.push('LAB 08 화면값 k=' + k + ' n=' + n);
  fill(0,[k,n]); log.push('  ① ' + hit(0));
  fill(1,[Math.pow(k,n)]); log.push('  ② ' + hit(1));
  const byD = k, byK = Math.pow((k+1)/k, n);
  fill(2,[byD, byK.toFixed(4)]);
  log.push('  ③ 보기 안 고름 → ' + hit(2));
  const want = byD > byK*1.3 ? 0 : (byK > byD*1.3 ? 1 : 2);
  card(2).querySelectorAll('input[type=radio]')[want].checked = true;
  log.push('  ③ 수치대로 고름 → ' + hit(2));
  log.push('  신호 → ' + box.querySelector('.nout').innerText.replace(/\s+/g,' ').slice(0,40));
  box.remove();
  return log;
});
console.log(out.join('\n'));
console.log('errors', errs.slice(0,4));
await b.close();
