// LAB 33 의 사다리가 왜 안 열리는지 한 종만 들여다본다 — 조작이 먹히는지, 신호가 어디 있는지.
import { createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const require = createRequire(join(ROOT, 'package.json'));
const { chromium } = require('playwright');
const FILE = resolve(process.argv[2] || join(ROOT, 'dist', 'index.html'));
const NO = +(process.argv[3] || 33);

const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1280, height: 1000 } });
const errs = [];
p.on('pageerror', e => errs.push(String(e).slice(0, 200)));
await p.goto(pathToFileURL(FILE).href, { waitUntil: 'load' });
await p.waitForTimeout(1000);

const out = await p.evaluate(async (no) => {
  const wait = ms => new Promise(r => setTimeout(r, ms));
  const L = [];
  const host = document.createElement('div');
  host.style.cssText = 'position:fixed;left:-9999px;top:0;width:1200px';
  document.body.appendChild(host);
  lessonFlow(host, LESSON[no], {});
  await wait(80);
  const lab = host.querySelector('#lsLab');
  L.push('#lsLab ' + (lab ? '있음' : '없음'));
  const txt = () => {
    let s = '';
    for (const n of lab.children) {
      if (n.classList && n.classList.contains('ldr')) continue;
      const c = n.cloneNode(true);
      c.querySelectorAll('label,.ctl,select,.note:not([id])').forEach(e => e.remove());
      s += (c.textContent || '');
    }
    return s;
  };
  L.push('사다리 ' + (lab.querySelector('.ldp') || {}).textContent);
  L.push('붙자마자 화면 글 ‖ ' + txt().replace(/\s+/g, ' ').slice(0, 420));
  const mine = e => !e.closest('.ldr') && !e.closest('.lsnnote');
  for (const q of ['input[type=range]', 'select', 'input[type=checkbox]', 'button', 'canvas', 'input']) {
    const a = [...lab.querySelectorAll(q)].filter(mine);
    L.push(q + ' → ' + a.length + '개  ' + a.slice(0, 8).map(e => (e.id || e.className || e.type || '?') +
      (e.tagName === 'INPUT' ? '[' + e.min + '~' + e.max + '=' + e.value + ']' : '')).join(' , '));
  }
  /* 첫 슬라이더를 끝까지 밀어 보고 글이 바뀌는지 */
  const r = [...lab.querySelectorAll('input[type=range]')].filter(mine)[0];
  if (r) {
    r.value = r.max; r.dispatchEvent(new Event('input', { bubbles: true }));
    await wait(60);
    L.push('슬라이더 끝 뒤 ‖ ' + txt().replace(/\s+/g, ' ').slice(0, 420));
    L.push('사다리 ' + (lab.querySelector('.ldp') || {}).textContent);
  }
  const bt = [...lab.querySelectorAll('button')].filter(mine);
  for (const x of bt.slice(0, 6)) { try { x.click(); } catch (e) { L.push('클릭 예외 ' + e.message); } await wait(30); }
  L.push('단추 누른 뒤 ‖ ' + txt().replace(/\s+/g, ' ').slice(0, 420));
  L.push('사다리 ' + (lab.querySelector('.ldp') || {}).textContent);
  host.remove();
  return L;
}, NO);
console.log(out.join('\n'));
console.log('pageerrors ' + errs.length);
errs.slice(0, 4).forEach(e => console.log('  ' + e));
await b.close();
