import { createRequire } from 'node:module';
const require = createRequire('X:/이것저것/수학관련/2026_AI+수업 우수사례+데이터 리터러시/2026_대전교육청_인공지능 연수 설계안 개발 연구회/math-lab/package.json');
const { chromium } = require('playwright');
const idx = process.argv[2], out = process.argv[3];
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1280, height: 1000 } });
const errs = []; p.on('pageerror', e => errs.push(String(e))); p.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
await p.goto('file:///' + idx.split('\\').join('/'), { waitUntil: 'load' });
await p.waitForTimeout(1200);
// ① 문제 화면
await p.evaluate(() => { document.getElementById('mask').style.scrollBehavior = 'auto'; openLab(0); });
await p.waitForTimeout(900);
await p.screenshot({ path: out + '/t_problem.png' });
// 데모를 독립 컨테이너에서 직접 돌려 미션 논리 검증
const res = await p.evaluate(async () => {
  const box = document.createElement('div'); box.style.cssText = 'position:fixed;left:0;top:0;width:1200px;background:#fff;z-index:99999;padding:10px';
  document.body.appendChild(box);
  const api = LESSON[1].demo(box);
  const cv = box.querySelector('#lg1'); const r = cv.getBoundingClientRect(); const W = 400, H = 330, P = 26, SC = (W - 2 * P) / 10;
  const click = (x, y) => cv.dispatchEvent(new PointerEvent('pointerdown', { clientX: r.left + (P + x * SC) * r.width / W, clientY: r.top + (H - P - y * SC) * r.height / H, bubbles: true }));
  const set = (sel, v) => { const el = box.querySelector(sel); el.value = v; };
  const log = [];
  // 미션1: 원 1개 — 원 위 두 점 (1,6),(6,1) + 식①
  click(1, 6); click(6, 1); click(4, 5);
  log.push('k1 out: ' + box.querySelector('#lgout').innerText.slice(0, 120));
  const c0 = box.querySelector('.eqc[data-i="0"]'); c0.querySelector('[data-f=a]').value = '1'; c0.querySelector('[data-f=b]').value = '1'; c0.querySelector('[data-f=r]').value = '5'; c0.querySelector('.eqk').click();
  log.push('eq1 wrong r: ' + c0.querySelector('.eqr').innerText);
  c0.querySelector('[data-f=r]').value = '25'; c0.querySelector('.eqk').click(); log.push('eq1: ' + c0.querySelector('.eqr').innerText);
  log.push('m1: ' + box.querySelector('#lgout').innerText.includes('미션1 달성'));
  // 미션2: 원 2개 — 교점 (5,4),(1,6) + 직선 x+2y=13 (비례형 2x+4y=26 도 통과)
  box.querySelector('[data-k="2"]').click(); click(5, 4); click(1, 6);
  const c1 = box.querySelector('.eqc[data-i="1"]'); c1.querySelector('[data-f=a]').value = '5'; c1.querySelector('[data-f=b]').value = '9'; c1.querySelector('[data-f=r]').value = '25'; c1.querySelector('.eqk').click();
  const l0 = box.querySelector('.eqc.ln[data-l="0"]'); l0.querySelector('[data-f=A]').value = '2'; l0.querySelector('[data-f=B]').value = '4'; l0.querySelector('[data-f=C]').value = '26'; l0.querySelector('.lnk').click();
  log.push('line: ' + l0.querySelector('.eqr').innerText + ' | m2: ' + box.querySelector('#lgout').innerText.includes('미션2 달성'));
  // 미션3
  box.querySelector('[data-k="3"]').click(); click(5, 4);
  const c2 = box.querySelector('.eqc[data-i="2"]'); c2.querySelector('[data-f=a]').value = '9'; c2.querySelector('[data-f=b]').value = '4'; c2.querySelector('[data-f=r]').value = '16'; c2.querySelector('.eqk').click();
  const l1 = box.querySelector('.eqc.ln[data-l="1"]'); l1.querySelector('[data-f=A]').value = '8'; l1.querySelector('[data-f=B]').value = '3'; l1.querySelector('[data-f=C]').value = '52';
  l1.querySelector('[data-f=x]').value = '5'; l1.querySelector('[data-f=y]').value = '4'; l1.querySelector('.slk').click();
  log.push('solve: ' + l1.querySelector('.eqr').innerText + ' | m3: ' + box.querySelector('#lgout').innerText.includes('미션3 달성'));
  log.push('read: ' + JSON.stringify(api.read()));
  box.id = 'testbox';
  return log;
});
console.log(res.join('\n'));
await p.screenshot({ path: out + '/t_demo.png', clip: { x: 0, y: 0, width: 1220, height: 640 } });
console.log('errors', errs);
await b.close();
