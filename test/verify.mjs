// 10종 실험실 × 7라운드 = 70개 상태를 모두 실행해 오류가 없는지 검사한다.
// 사용: node test/verify.mjs        (사전에 node build.mjs 실행)
import { chromium } from 'playwright';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const URL  = 'file://' + join(ROOT, 'dist', 'index.html');

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1300, height: 1100 } });
const topErrors = [];
page.on('pageerror', e => topErrors.push(e.message));
page.on('console',  m => { if (m.type() === 'error') topErrors.push(m.text()); });

await page.goto(URL);

/* --- ① 실험실 10종 모달 --- */
const cards = await page.locator('#cards .card').count();
for (let i = 0; i < cards; i++) {
  await page.locator('#cards .card').nth(i).click();
  await page.waitForTimeout(250);
  await page.locator('#mX').click();
  await page.waitForTimeout(100);
}
console.log(`① 실험실 모달 ${cards}종 열람 완료`);

/* --- ② 바이브 코딩 10종 × 7라운드 --- */
await page.locator('nav.tabs button[data-p=p2]').click();
await page.waitForTimeout(250);
const labs = await page.locator('#picker .pcard').count();
let fail = 0;

for (let i = 0; i < labs; i++) {
  await page.locator('#picker .pcard').nth(i).click();
  await page.waitForTimeout(150);
  const name = (await page.locator('#picker .pcard').nth(i).locator('.pt').textContent()).trim();
  const marks = [];

  for (let r = 1; r <= 7; r++) {
    await page.locator('#reveal').click();
    await page.locator('#send').click();
    await page.waitForTimeout(900);

    const frame = page.frames().find(f => f !== page.mainFrame());
    const res = await frame.evaluate(() => {
      const out = { err: null, ink: 0, len: 0 };
      try { if (typeof update === 'function') update(); } catch (e) { out.err = e.message; }
      document.querySelectorAll('canvas').forEach(cv => {
        try {
          const d = cv.getContext('2d').getImageData(0, 0, cv.width, cv.height).data;
          for (let q = 3; q < d.length; q += 40) if (d[q] > 0) out.ink++;
        } catch (e) { /* ignore */ }
      });
      out.len = (document.body.innerText || '').length;
      return out;
    }).catch(e => ({ err: 'FRAME ' + e.message }));

    if (res.err) { fail++; marks.push(`R${r}✗`); }
    else marks.push(`R${r}✓`);
  }
  console.log(`② ${name.padEnd(24)} ${marks.join(' ')}`);
}

/* --- ③ 클릭 조립 모드 --- */
await page.locator('#modeSeg button[data-m=click]').click();
await page.waitForTimeout(250);
for (let i = 0; i < 7; i++) {
  await page.locator('#cbBlocks .blk').nth(i).click();
  await page.waitForTimeout(150);
}
console.log('③ 클릭 조립 7블록 완료');

await browser.close();
if (topErrors.length || fail) {
  console.error(`\n실패 — 라운드 오류 ${fail}건 / 페이지 오류 ${topErrors.length}건`);
  topErrors.slice(0, 10).forEach(e => console.error('  ' + e));
  process.exit(1);
}
console.log('\n전부 통과 — 오류 0건');
