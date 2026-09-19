import { createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';
import { resolve } from 'node:path';
const require = createRequire('X:/이것저것/수학관련/2026_AI+수업 우수사례+데이터 리터러시/2026_대전교육청_인공지능 연수 설계안 개발 연구회/math-lab/package.json');
const { chromium } = require('playwright');
const idx = process.argv[2], out = process.argv[3];
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1280, height: 1000 } });
const errs = []; p.on('pageerror', e => errs.push(String(e))); p.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
await p.goto(pathToFileURL(resolve(idx)).href, { waitUntil: 'load' });
await p.waitForTimeout(1200);

const res = await p.evaluate(async () => {
  const box = document.createElement('div');
  box.style.cssText = 'position:fixed;left:0;top:0;width:1240px;background:#fff;z-index:99999;padding:10px';
  document.body.appendChild(box);
  const api = LESSON[21].demo(box);
  const log = [];
  const outT = () => box.querySelector('#lyout').innerText;
  const cv = box.querySelector('#ly1');
  const O = 170, SC = 27;
  const ev = (type, x) => {
    const r = cv.getBoundingClientRect();
    cv.dispatchEvent(new PointerEvent(type, {
      clientX: r.left + (O + x * SC) * r.width / 400,
      clientY: r.top + 165 * r.height / 330, bubbles: true, pointerId: 1 }));
  };
  // dragOn 은 hit() 이 잡아야 move 가 돈다 — 손잡이 자리에서 눌러야 한다
  const dragFrom = (x0, xs) => {
    const D = { lin: x => 2 * x - 3, sq: x => x * x, sqrt: x => Math.sqrt(x - 2) + 1 };
    const r = cv.getBoundingClientRect();
    const f = box.querySelector('.out').innerText.includes('√') ? 'sqrt'
      : box.querySelector('.out').innerText.includes('x²') ? 'sq' : 'lin';
    cv.dispatchEvent(new PointerEvent('pointerdown', {
      clientX: r.left + (O + x0 * SC) * r.width / 400,
      clientY: r.top + (165 - D[f](x0) * SC) * r.height / 330, bubbles: true, pointerId: 1 }));
    xs.forEach(x => ev('pointermove', x));
    cv.dispatchEvent(new PointerEvent('pointerup', { bubbles: true, pointerId: 1 }));
  };
  const note = k => box.querySelector('.eqc[data-n="' + k + '"]');
  const put = (k, vals) => {
    const el = note(k);
    Object.entries(vals).forEach(([f, v]) => { const i = el.querySelector('[data-f=' + f + ']'); if (i) i.value = String(v); });
    el.querySelector('.eqk').click();
    return el.querySelector('.eqr').innerText;
  };

  // 미션1 — lin 자취 + 노트 ①
  const xs = []; for (let x = -1.4; x <= 4.4; x += 0.28) xs.push(x);
  dragFrom(1.5, xs);
  log.push('lin 자취 → ' + outT().split('\n')[0]);
  log.push('노트① 부호 오답(-3) → ' + put(0, { a: -3, b: 2 }));
  log.push('노트① (x+3)/2 → ' + put(0, { a: 3, b: 2 }));
  log.push('미션1: ' + outT().includes('미션1 달성'));

  // 미션2 — x² 전체에서 깨지는 것 보고 고치기
  box.querySelectorAll('button[data-f="sq"]')[0].click();
  const xs2 = []; for (let x = -2.4; x <= 2.4; x += 0.16) xs2.push(x);
  dragFrom(1.5, xs2);
  log.push('x² 전체 → ' + outT().split('\n')[0].slice(0, 90));
  box.querySelector('#lyR').checked = true; box.querySelector('#lyR').dispatchEvent(new Event('change', { bubbles: true }));
  // 버튼을 다시 눌러 점을 기본 자리로 되돌린 뒤 잡는다 (손잡이는 늘 화면 안에 있어야 한다)
  box.querySelectorAll('button[data-f="sq"]')[0].click();
  dragFrom(1.5, [0.4, 0.9, 1.4, 1.9, 2.2, 2.4]);
  log.push('제한 후 → ' + outT().split('\n')[0].slice(0, 80));
  log.push('미션2: ' + outT().includes('미션2 달성'));

  // 미션3 — 무리함수 + 노트 ②③
  box.querySelectorAll('button[data-f="sqrt"]')[0].click();
  const xs3 = []; for (let x = 2.1; x <= 7.9; x += 0.4) xs3.push(x);
  dragFrom(3, xs3);
  log.push('√ 자취 → ' + outT().split('\n')[0].slice(0, 80));
  log.push('노트② 정의역 누락 → ' + put(1, { a: 1, b: 2, c: '' }).slice(0, 70));
  log.push('노트② 1,2,1 → ' + put(1, { a: 1, b: 2, c: 1 }).slice(0, 60));
  log.push('노트③ 1,1 오답 → ' + put(2, { a: 1, b: 1 }).slice(0, 60));
  log.push('노트③ 2,1 → ' + put(2, { a: 2, b: 1 }).slice(0, 60));
  log.push('미션3: ' + outT().includes('미션3 달성'));

  const box2 = document.createElement('div'); box2.style.cssText = 'position:fixed;left:-9999px;top:0;width:1200px';
  document.body.appendChild(box2); LESSON[21].demo(box2);
  log.push('무조작 자동완료: ' + /미션\d 달성/.test(box2.querySelector('#lyout').innerText));
  box2.remove();
  log.push('read: ' + JSON.stringify(api.read()));
  return log;
});
console.log(res.join('\n'));
await p.screenshot({ path: out + '/t21.png', clip: { x: 0, y: 0, width: 1240, height: 700 } });
console.log('errors', errs);
await b.close();
