import { chromium } from 'playwright';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
const ROOT = dirname(fileURLToPath(import.meta.url));
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1200, height: 1200 } });
await p.goto('file://' + join(ROOT, 'dist', 'index.html'));
await p.evaluate(() => openLab(194));
await p.waitForTimeout(600);
const info = await p.evaluate(() => {
  const w = document.querySelector('.txwrap');
  const btns = [...document.querySelectorAll('button')]
    .filter(b => b.offsetParent && /원리|수식|유도|이론/.test(b.textContent))
    .map(b => b.textContent.trim().slice(0, 20));
  return { hasWrap: !!w, visible: w ? !!w.offsetParent : false, btns };
});
console.log(JSON.stringify(info));
if (info.btns.length) {
  await p.evaluate(() => {
    const b = [...document.querySelectorAll('button')].find(b => b.offsetParent && /원리|수식|유도/.test(b.textContent));
    if (b) b.click();
  });
  await p.waitForTimeout(500);
}
await p.evaluate(()=>{ const w=document.querySelector('.txwrap'); let n=w; while(n){ n.style.display='block'; n.style.visibility='visible'; n.hidden=false; if(n.open===false) n.open=true; n=n.parentElement; } });
await p.waitForTimeout(300);
const el = await p.$('.txwrap');
const vis = el && await el.isVisible();
await (vis ? el : p).screenshot({ path: 'shot-tex195.png' });
await b.close();
console.log('저장: shot-tex195.png (수식 상자 직접 촬영: ' + !!vis + ')');
