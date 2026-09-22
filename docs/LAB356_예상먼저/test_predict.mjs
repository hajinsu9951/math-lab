import { createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';
import { resolve } from 'node:path';
const require = createRequire('X:/이것저것/수학관련/2026_AI+수업 우수사례+데이터 리터러시/2026_대전교육청_인공지능 연수 설계안 개발 연구회/math-lab/package.json');
const { chromium } = require('playwright');
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1280, height: 1100 } });
const errs = []; p.on('pageerror', e => errs.push(String(e))); p.on('console', m => { if (m.type()==='error') errs.push(m.text()); });
await p.goto(pathToFileURL(resolve(process.argv[2])).href, { waitUntil: 'load' });
await p.waitForTimeout(1400);
const out = await p.evaluate(() => {
  const log = [];
  const box = document.createElement('div');
  box.style.cssText='position:fixed;left:0;top:0;width:1200px;background:#fff;z-index:99;padding:10px';
  document.body.appendChild(box);
  LESSON[356].demo(box);
  const TT = () => box.querySelector('#lcTT');
  const OUT = () => box.querySelector('#lcOut').innerText.replace(/\s+/g,' ').slice(0,72);
  log.push('처음 안내 → ' + OUT());
  log.push('전구 칸: ' + [...TT().querySelectorAll('tbody tr')].map(r=>r.cells[r.cells.length-2].innerText.trim()).join(' '));
  // 예상 전에 스위치를 눌러 본다
  const sw = box.querySelector('#lcBtns [data-tg]');
  const before = sw.textContent;
  sw.click();
  log.push('예상 전 스위치 → ' + (box.querySelector('#lcBtns [data-tg]').textContent===before ? '잠김(바뀌지 않음) ✓' : '열림 ✗'));
  // 제출 단추는 아직 잠겨 있어야
  log.push('제출 단추 처음: ' + (box.querySelector('#lcPgo')?.disabled ? '잠김 ✓' : '열림 ✗'));
  // 네 칸 예상 — 일부러 한 칸 틀리게 (첫 줄만 1, 나머지 0 → 직렬회로의 정답은 마지막 줄만 1)
  const rows = [...TT().querySelectorAll('tbody tr')];
  rows.forEach((r,i) => r.querySelector('[data-pv="'+(i===0?'1':'0')+'"]').click());
  log.push('네 칸 찍은 뒤 제출 단추: ' + (box.querySelector('#lcPgo')?.disabled ? '아직 잠김 ✗' : '열림 ✓'));
  box.querySelector('#lcPgo').click();
  log.push('제출 뒤 안내 → ' + OUT());
  // 네 조합을 모두 실험
  const combos = [[0,0],[0,1],[1,0],[1,1]];
  combos.forEach(([a,bb]) => {
    const btns = [...box.querySelectorAll('#lcBtns [data-tg]')];
    const cur = btns.map(x => +x.textContent.trim().slice(-1));
    if (cur[0]!==a) btns[0].click();
    const b2 = [...box.querySelectorAll('#lcBtns [data-tg]')];
    const cur2 = b2.map(x => +x.textContent.trim().slice(-1));
    if (cur2[1]!==bb) b2[1].click();
  });
  const marks = [...TT().querySelectorAll('tbody tr')].map(r=>r.cells[r.cells.length-1].innerText.trim()||'·');
  log.push('예상 대조 표시: ' + marks.join(' '));
  log.push('마무리 안내 → ' + OUT());
  return log;
});
console.log(out.join('\n'));
console.log('errors', errs.slice(0,3));
await b.close();
