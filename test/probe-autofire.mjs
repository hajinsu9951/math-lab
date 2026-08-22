// 44종 전부 열어 초기 사다리 진행도를 읽는다 — 조작 없이 완료되는 STEP(오탐)을 잡는다
import { chromium } from 'playwright';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const URL = 'file://' + join(ROOT, 'dist', 'index.html');
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1300, height: 1100 } });
const errs = [];
p.on('pageerror', e => errs.push('PAGE ' + e.message));
await p.goto(URL);
for (let i = 0; i < 52; i++) {
  await p.evaluate(n => openLab(n), i);
  await p.waitForTimeout(450);
  const prog = await p.evaluate(() => {
    const e = document.querySelector('#ldp');
    return e ? e.textContent.trim() : '(사다리 없음)';
  });
  const n = await p.evaluate(() => document.querySelectorAll('.ldi').length);
  const flag = /^0 \//.test(prog) ? '' : '  ← 저절로 진행!';
  console.log(`LAB ${String(i + 1).padStart(2, '0')}  단계 ${n}  진행 ${prog}${flag}`);
  await p.locator('#mX').click();
  await p.waitForTimeout(80);
}
console.log('pageerrors:', errs.length); errs.slice(0, 5).forEach(e => console.log(e.slice(0, 140)));
await b.close();
