import { chromium } from 'playwright';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
const ROOT = dirname(fileURLToPath(import.meta.url));
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1300, height: 1400 } });
await p.goto('file://' + join(ROOT, 'dist', 'index.html'));
const setv = (id, v) => p.evaluate(([i, x]) => { const e = document.getElementById(i); e.value = x; e.dispatchEvent(new Event('input', { bubbles: true })); }, [id, v]);
const state = async tag => {
  const s = await p.evaluate(() => ({
    prog: (document.querySelector('#ldp') || {}).textContent,
    now: (document.querySelector('.ldi.now .ldt') || {}).textContent || '',
    out: (document.querySelector('#isout') || {}).innerText || '',
  }));
  console.log('--', tag, '|', s.prog, '| 현재:', s.now.slice(0, 30));
  console.log('   out:', s.out.replace(/\n/g, ' / ').slice(0, 240));
};
await p.evaluate(() => openLab(283));
await p.waitForTimeout(500);
await state('열림');
await p.evaluate(() => { const el = document.querySelector('.ldi.now .ldk'); if (el) el.click(); });
await p.waitForTimeout(400); await state('1단계');
await setv('isC', 0); await p.waitForTimeout(600); await state('중심 0');
await setv('isC', -1.5); await p.waitForTimeout(600); await state('중심 -1.5');
await b.close();
