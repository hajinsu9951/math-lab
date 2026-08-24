import { chromium } from 'playwright';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
const ROOT = dirname(fileURLToPath(import.meta.url));
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1320, height: 1100 } });
const errs = []; p.on('pageerror', e => errs.push(e.message));
await p.goto('file://' + join(ROOT, 'dist', 'index.html'));
await p.waitForTimeout(500);
const bars = await p.evaluate(() => [...document.querySelectorAll('#gradebar .gtog')].map(b => b.textContent.trim()));
console.log('토글 버튼:', bars.join(' | '));
const closed = await p.evaluate(() => document.querySelectorAll('#gradebody .card').length);
console.log('초기 카드 수(접힘):', closed);
for (const key of ['중학교 1학년', '중학교 3학년', '공통수학1']) {
  await p.evaluate(k => { const b = [...document.querySelectorAll('#gradebar .gtog')].find(x => x.textContent.includes(k)); if (b) b.click(); }, key);
  await p.waitForTimeout(300);
  const info = await p.evaluate(() => ({
    cards: document.querySelectorAll('#gradebody .card').length,
    thumbs: document.querySelectorAll('#gradebody .card svg').length,
    head: (document.querySelector('#gradebody .ghead') || {}).innerText || '',
    on: [...document.querySelectorAll('#gradebar .gtog.on')].map(x => x.textContent.trim())
  }));
  console.log(`${key}: 카드 ${info.cards} · 썸네일 ${info.thumbs} · 활성 [${info.on}] · ${info.head.slice(0, 40)}`);
}
// 접기 확인
await p.evaluate(() => { const b = document.querySelector('#gradebar .gtog.on'); if (b) b.click(); });
await p.waitForTimeout(250);
console.log('다시 눌러 접기 →', await p.evaluate(() => document.querySelectorAll('#gradebody .card').length), '카드');
// 카드 클릭 → 실험실 열림
await p.evaluate(() => { const b = [...document.querySelectorAll('#gradebar .gtog')].find(x => x.textContent.includes('중학교 2학년')); if (b) b.click(); });
await p.waitForTimeout(300);
await p.evaluate(() => document.querySelector('#gradebody .card').click());
await p.waitForTimeout(500);
console.log('카드 클릭 → 모달:', await p.evaluate(() => !!document.querySelector('#mask.on')),
  '| 제목:', await p.evaluate(() => (document.querySelector('#mTitle') || {}).textContent || '').then(t => t.slice(0, 30)));
console.log('pageerrors:', errs.length, errs.slice(0, 2));
await b.close();
