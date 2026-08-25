// 무조작 자동완료 결함 진단 — 어떤 단계·정규식·문구인지 찾는다
import { chromium } from 'playwright';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
const ROOT = dirname(fileURLToPath(import.meta.url));
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1300, height: 1300 } });
await p.goto('file://' + join(ROOT, 'dist', 'index.html'));
const LABS = [9];
async function openGate() {
  const has = await p.evaluate(() => !!document.querySelector('.pgb'));
  if (!has) return;
  const cv = p.locator('.pgpad canvas').first();
  const bb = await cv.boundingBox();
  if (bb) { await p.mouse.move(bb.x + 20, bb.y + 20); await p.mouse.down(); await p.mouse.move(bb.x + 110, bb.y + 70, { steps: 6 }); await p.mouse.up(); }
  await p.waitForTimeout(160);
  await p.evaluate(() => { const b = document.querySelector('[id^="pgGo_"]'); if (b && !b.disabled) b.click(); });
  await p.waitForTimeout(200);
}
for (const lab of LABS) {
  await p.evaluate(n => openLab(n), lab - 1);
  await p.waitForTimeout(320);
  await openGate();
  const rep = await p.evaluate(labNo => {
    const list = MISSIONS[labNo] || [];
    const txt = document.querySelector('#mBody').innerText;
    const out = [];
    list.forEach((m, i) => {
      if (!m.re) return;
      const rx = new RegExp(m.re);
      const hit = rx.exec(txt);
      if (hit) {
        const at = hit.index;
        out.push(`S${i + 1} /${m.re}/ ← "…${txt.slice(Math.max(0, at - 30), at + hit[0].length + 20).replace(/\n/g, '⏎')}…"`);
      }
    });
    return out;
  }, lab);
  console.log('LAB', String(lab).padStart(2, '0'), rep.length ? '' : '(즉시 일치 없음 — 연쇄성 확인 필요)');
  rep.forEach(r => console.log('   ', r.slice(0, 150)));
  await p.locator('#mX').click(); await p.waitForTimeout(70);
}
await b.close();
