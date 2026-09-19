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
  const api = LESSON[3].demo(box);
  const log = [];
  const outT = () => box.querySelector('#lpout').innerText;
  const note = k => box.querySelector('.eqc[data-n="' + k + '"]');
  const put = (k, v) => { note(k).querySelector('[data-f=v]').value = String(v); note(k).querySelector('.eqk').click(); return note(k).querySelector('.eqr').innerText; };

  // 첫 유포자 — 격자 한가운데를 클릭
  const cv = box.querySelector('#lp1'), r = cv.getBoundingClientRect(), CS = 200 / 8;
  const click = (cx, cy) => cv.dispatchEvent(new PointerEvent('pointerdown', {
    clientX: r.left + (cx * CS + CS / 2) * r.width / 200,
    clientY: r.top + (cy * CS + CS / 2) * r.height / 200, bubbles: true }));
  click(3, 3);
  log.push('첫 유포자 → ' + outT());
  for (let i = 0; i < 3; i++) box.querySelector('#lpDay').click();
  log.push('3일 → ' + outT().split('\n')[0]);
  log.push('미션1: ' + outT().includes('미션1 달성'));

  // 노트 ① — r=0.5 이므로 1.5
  log.push('노트① 곱셈 오답(0.5) → ' + put(0, 0.5));
  log.push('노트① 1.5 → ' + put(0, 1.5));
  // 노트 ② — 100×1.5^5 = 759.375. 먼저 등차로 더한 오답 350
  log.push('노트② 등차 오답(350) → ' + put(1, 350));
  log.push('노트② 759 → ' + put(1, 759));
  // 절반까지 진행
  for (let i = 0; i < 6 && !outT().includes('절반'); i++) box.querySelector('#lpD5').click();
  log.push('절반 → ' + outT().split('\n')[0]);
  log.push('미션2: ' + outT().includes('미션2 달성'));

  // 노트 ③ — log2/log1.5 ≈ 1.7095. 먼저 분모를 log r 로 쓴 오답
  log.push('노트③ log r 오답(-1) → ' + put(2, -1));
  log.push('노트③ 1.71 → ' + put(2, 1.71));
  for (let i = 0; i < 12 && !outT().includes('더 전할 사람이 없습니다'); i++) box.querySelector('#lpD5').click();
  log.push('포화 → ' + outT().split('\n')[0]);
  log.push('미션3: ' + outT().includes('미션3 달성'));
  log.push('실제 배가시간 표시: ' + /실제 배가시간/.test(outT()));
  const cmp = box.querySelector('#lg3cmp');
  log.push('모형 vs 실제 비교: ' + (cmp.hidden === false) + ' | ' + cmp.innerText.slice(0, 90));

  // r 을 바꾸면 검사가 되돌아간다
  const sl = box.querySelector('#lpr');
  sl.value = '0.7'; sl.dispatchEvent(new Event('input', { bubbles: true }));
  log.push('r 변경 후 미션3 유지?: ' + outT().includes('미션3 달성') + ' (false 여야 함)');
  log.push('노트③ 0.7 일 때 1.71 → ' + put(2, 1.71).slice(0, 40));
  log.push('노트③ 0.7 일 때 1.31 → ' + put(2, 1.3063));

  // 무조작 자동완료
  const box2 = document.createElement('div'); box2.style.cssText = 'position:fixed;left:-9999px;top:0;width:1200px';
  document.body.appendChild(box2); LESSON[3].demo(box2);
  log.push('무조작 자동완료: ' + /미션\d 달성/.test(box2.querySelector('#lpout').innerText));
  box2.remove();
  log.push('read: ' + JSON.stringify(api.read()));
  return log;
});
console.log(res.join('\n'));
await p.screenshot({ path: out + '/t3_lab3.png', clip: { x: 0, y: 0, width: 1240, height: 780 } });
console.log('errors', errs);
await b.close();
