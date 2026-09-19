import { createRequire } from 'node:module';
const require = createRequire('X:/이것저것/수학관련/2026_AI+수업 우수사례+데이터 리터러시/2026_대전교육청_인공지능 연수 설계안 개발 연구회/math-lab/package.json');
const { chromium } = require('playwright');
const idx = process.argv[2], out = process.argv[3];
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1280, height: 1000 } });
const errs = []; p.on('pageerror', e => errs.push(String(e))); p.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
await p.goto('file:///' + idx.split('\\').join('/'), { waitUntil: 'load' });
await p.waitForTimeout(1200);
// ① 문제 화면 (LAB 02 = index 1)
await p.evaluate(() => { document.getElementById('mask').style.scrollBehavior = 'auto'; openLab(1); });
await p.waitForTimeout(900);
await p.screenshot({ path: out + '/t2_problem.png' });

const res = await p.evaluate(async () => {
  const box = document.createElement('div');
  box.style.cssText = 'position:fixed;left:0;top:0;width:1240px;background:#fff;z-index:99999;padding:10px';
  document.body.appendChild(box);
  const api = LESSON[2].demo(box);
  const log = [];
  const outT = () => box.querySelector('#lb2out').innerText;
  const setv = (el, f, v) => { el.querySelector('[data-f=' + f + ']').value = v; };

  // 문제의 두 문자를 실제로 판정한다
  box.querySelector('#lb2q1').click();
  log.push('문자① ' + box.querySelector('#lb2msg').innerText + ' → ' + outT().split('\n')[0]);
  const p1 = api.read();
  box.querySelector('#lb2q2').click();
  log.push('문자② ' + box.querySelector('#lb2msg').innerText + ' → ' + outT().split('\n')[0]);
  const p2 = api.read();
  log.push('P① ' + p1[3] + ' · P② ' + p2[3]);

  // 노트 ② — 분모를 100 으로 쓰는 흔한 오답
  const c1 = box.querySelector('.eqc[data-n="1"]');
  setv(c1, 'a', '16'); setv(c1, 'b', '100'); setv(c1, 'v', '0.16'); c1.querySelector('.eqk').click();
  log.push('노트② 분모100 → ' + c1.querySelector('.eqr').innerText);
  setv(c1, 'b', '20'); setv(c1, 'v', '0.8'); c1.querySelector('.eqk').click();
  log.push('노트② 바로잡음 → ' + c1.querySelector('.eqr').innerText);

  const c0 = box.querySelector('.eqc[data-n="0"]');
  setv(c0, 'a', '20'); setv(c0, 'v', '0.2'); c0.querySelector('.eqk').click();
  const c2 = box.querySelector('.eqc[data-n="2"]');
  setv(c2, 'a', '4'); setv(c2, 'b', '80'); setv(c2, 'v', '0.05'); c2.querySelector('.eqk').click();
  log.push('노트①③ → ' + c0.querySelector('.eqr').innerText + ' / ' + c2.querySelector('.eqr').innerText);
  log.push('미션1: ' + outT().includes('미션1 달성'));

  // 노트 ④ — 베이즈. 분모를 분자와 같게 쓰는 오답 먼저
  const b0 = box.querySelector('.eqc[data-b="0"]');
  log.push('노트④ 열림: ' + (b0.hidden === false));
  setv(b0, 'n', '0.16'); setv(b0, 'd', '0.16'); setv(b0, 'v', '1'); b0.querySelector('.eqk2').click();
  log.push('노트④ 분모오답 → ' + b0.querySelector('.eqr').innerText);
  setv(b0, 'd', '0.2'); setv(b0, 'v', '0.8'); b0.querySelector('.eqk2').click();
  log.push('노트④ → ' + b0.querySelector('.eqr').innerText);
  log.push('미션2: ' + outT().includes('미션2 달성'));

  // 노트 ⑤ — 나이브 vs 세어 본 값. 먼저 두 단어를 함께 넣어 「함께 든 문자」 표가 열리는지 본다
  box.querySelector('#lb2cl').click();
  box.querySelectorAll('[data-w]').forEach(el => { if (el.dataset.w === '무료' || el.dataset.w === '당첨') el.click(); });
  const pairTbl = box.querySelector('#lb2tbl').innerText.includes('함께');
  log.push('함께 든 문자 표: ' + pairTbl + ' | ' + (box.querySelector('#lb2tbl').innerText.match(/둘 다 있음.*/) || [''])[0]);
  const b1 = box.querySelector('.eqc[data-b="1"]');
  log.push('노트⑤ 열림: ' + (b1.hidden === false));
  setv(b1, 'n', '0.988'); setv(b1, 'c', '0.988'); b1.querySelector('.eqk3').click();
  log.push('노트⑤ 곱값을 두 번 → ' + b1.querySelector('.eqr').innerText.slice(0, 80));
  setv(b1, 'c', '0.833'); b1.querySelector('.eqk3').click();
  log.push('노트⑤ → ' + b1.querySelector('.eqr').innerText.slice(0, 120));
  log.push('미션3: ' + outT().includes('미션3 달성'));

  // 사전확률 — 「무료」 한 단어로 20% → 1%
  box.querySelector('#lb2cl').click();
  box.querySelectorAll('[data-w]').forEach(el => { if (el.dataset.w === '무료') el.click(); });
  const a20 = api.read();
  const sl = box.querySelector('#lb2p');
  sl.value = '1'; sl.dispatchEvent(new Event('input', { bubbles: true }));
  const a01 = api.read();
  log.push('「무료」 20% → ' + a20[3] + ' ' + a20[5] + ' | 1% → ' + a01[3] + ' ' + a01[5]);
  log.push('뒤집힘 안내: ' + outT().includes('사전확률'));
  // 사전확률이 표본과 다르면 식 검사는 잠긴다
  c0.querySelector('.eqk').click();
  log.push('잠금 → ' + c0.querySelector('.eqr').innerText);
  log.push('잠금 안내 보임: ' + (box.querySelector('#lb2pn').hidden === false));
  sl.value = '20'; sl.dispatchEvent(new Event('input', { bubbles: true }));

  // 무조작 자동완료 검사 — 새 판을 열면 미션 신호가 없어야 한다
  const box2 = document.createElement('div'); box2.style.cssText = 'position:fixed;left:-9999px;top:0;width:1200px';
  document.body.appendChild(box2); LESSON[2].demo(box2);
  log.push('무조작 자동완료: ' + /미션\d 달성/.test(box2.querySelector('#lb2out').innerText));
  box2.remove();

  log.push('read: ' + JSON.stringify(api.read()));
  return log;
});
console.log(res.join('\n'));
await p.screenshot({ path: out + '/t2_demo.png', clip: { x: 0, y: 0, width: 1240, height: 900 } });
console.log('errors', errs);
await b.close();
