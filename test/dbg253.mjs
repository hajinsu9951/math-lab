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
    out: (document.querySelector('#spout') || {}).innerText || '',
  }));
  console.log('--', tag, '|', s.prog, '| 현재단계:', s.now.slice(0, 34));
  console.log('   out:', s.out.replace(/\n/g, ' / ').slice(0, 200));
};
await p.evaluate(() => openLab(252));
await p.waitForTimeout(500);
await state('열림');
await p.evaluate(() => { const el = document.querySelector('.ldi.now .ldk'); if (el) el.click(); });
await p.waitForTimeout(400); await state('1단계 수동');
await setv('spvx', 4); await setv('spvy', 2); await p.waitForTimeout(500); await state('v=(4,2)');
await setv('spvx', -1); await p.waitForTimeout(300);
await setv('spt', 1); await p.waitForTimeout(500); await state('v=(-1,2), b=1');
await b.close();
