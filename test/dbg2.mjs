import { chromium } from 'playwright';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
const ROOT = dirname(fileURLToPath(import.meta.url));
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1300, height: 1200 } });
await p.goto('file://' + join(ROOT, 'dist', 'index.html'));
const clk = (id) => p.evaluate(i => { const e = document.getElementById(i); if (e) e.click(); }, id);
const txt = () => p.evaluate(() => document.querySelector('#mBody').innerText);

// LAB16: 학습률 컨트롤 확인 + 발산 시도
await p.evaluate(() => openLab(15)); await p.waitForTimeout(300);
let info = await p.evaluate(() => [...document.querySelectorAll('#mBody input[type=range]')].map(e => e.id + '[' + e.min + '..' + e.max + '=' + e.value + ']').join(' '));
console.log('LAB16 ranges:', info);
await p.evaluate(() => { const rs = [...document.querySelectorAll('#mBody input[type=range]')]; rs.forEach(e => { if (+e.max <= 2) { e.value = e.max; e.dispatchEvent(new Event('input', { bubbles: true })); } }); });
for (let k = 0; k < 30; k++) { await clk('dstep'); await p.waitForTimeout(30); }
console.log('LAB16 발산?', /발산!/.test(await txt()), (await txt()).match(/.{0,80}(발산|기울기)[^\n]{0,60}/g)?.slice(0,3));
await p.locator('#mX').click(); await p.waitForTimeout(80);

// LAB17: m1k 클릭 후 출력 포맷
await p.evaluate(() => openLab(16)); await p.waitForTimeout(300);
for (let k = 0; k < 5; k++) { await clk('m1k'); await p.waitForTimeout(100); }
const t17 = await txt();
console.log('LAB17 out:', t17.match(/[\d,]+개[^\n]{0,60}/g)?.slice(0, 3), '| 오차 라인:', t17.match(/오차[^\n]{0,40}/g)?.slice(0, 2));
await p.locator('#mX').click(); await p.waitForTimeout(80);

// LAB21: 함수 전환 컨트롤 구조
await p.evaluate(() => openLab(20)); await p.waitForTimeout(300);
info = await p.evaluate(() => {
  const f = document.getElementById('syf');
  return (f ? f.tagName + ':' + (f.options ? [...f.options].map(o => o.value + '|' + o.text).join(' / ') : f.outerHTML.slice(0, 120)) : 'NO syf — btns: ' + [...document.querySelectorAll('#mBody button')].map(b => b.textContent.trim()).slice(0, 12).join(','));
});
console.log('LAB21 ctrl:', info);
const t21 = await txt();
console.log('LAB21 √x?', /√x/.test(t21));
await p.locator('#mX').click(); await p.waitForTimeout(80);

// LAB22: 컨트롤 + 교대/조화 전환 확인
await p.evaluate(() => openLab(21)); await p.waitForTimeout(300);
info = await p.evaluate(() => 'sek:' + (document.getElementById('sek') ? document.getElementById('sek').outerHTML.slice(0, 90) : 'NO') + ' | btns: ' + [...document.querySelectorAll('#mBody button')].map(b => b.textContent.trim()).slice(0, 14).join(','));
console.log('LAB22 ctrl:', info);
await p.locator('#mX').click(); await p.waitForTimeout(80);

// LAB23: 단계별 텍스트
await p.evaluate(() => openLab(22)); await p.waitForTimeout(300);
for (let k = 0; k < 7; k++) { await clk('tyUp'); await p.waitForTimeout(50); }
const t23 = await txt();
console.log('LAB23 P?:', t23.match(/P.{0,12}\(x\)/g)?.slice(0, 2), '| 일치:', t23.match(/소수[^\n]{0,30}/g)?.slice(0, 2), '| 함수 btns:', await p.evaluate(() => [...document.querySelectorAll('#mBody button')].map(b => b.textContent.trim()).slice(0, 12).join(',')));
await b.close();
