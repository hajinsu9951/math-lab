// LAB 36·74 의 미션 신호가 «어떤 글»에서 나오는지 본다 — 신호가 서로를 품고 있어
// 한 번의 조작으로 두 단이 함께 열리는지 확인하려면 먼저 출처를 알아야 한다.
import { createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const require = createRequire(join(ROOT, 'package.json'));
const { chromium } = require('playwright');

const FILE = resolve(process.argv[2] || join(ROOT, 'dist', 'index.html'));
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1280, height: 1000 } });
await p.goto(pathToFileURL(FILE).href, { waitUntil: 'load' });
await p.waitForTimeout(1000);

const out = await p.evaluate(async () => {
  const wait = ms => new Promise(r => setTimeout(r, ms));
  const log = [];
  for (const [no, sigs] of [[36, ['된다', '안 된다']], [74, ['k', 'kb']]]) {
    const host = document.createElement('div');
    host.style.cssText = 'position:fixed;left:-9999px;top:0;width:1200px';
    document.body.appendChild(host);
    lessonFlow(host, LESSON[no], {});
    await wait(60);
    const parts = () => [...host.children]
      .filter(n => !(n.classList && n.classList.contains('ldr')))
      .map(n => {
        const c = n.cloneNode(true);
        c.querySelectorAll('label,.ctl,select,.note:not([id])').forEach(e => e.remove());
        return (c.className || n.nodeName) + ' ‖ ' + (c.textContent || '').replace(/\s+/g, ' ').trim();
      });
    log.push('— LAB ' + no + ' 붙자마자');
    parts().forEach(t => log.push('    ' + t.slice(0, 300)));
    const prog = () => (host.querySelector('.ldp') || {}).textContent || '?';
    log.push('    사다리 ' + prog());
    /* 단계 칩을 모두 열어 본다 — 기록 단계의 글에 신호가 들어 있는지 보려면 열어야 한다 */
    for (const ch of host.querySelectorAll('.lsnchip')) { ch.click(); await wait(20); }
    log.push('— LAB ' + no + ' 모든 단계 펼친 뒤  사다리 ' + prog());
    const all = parts().join('\n');
    for (const s of sigs) {
      const i = all.indexOf(s);
      log.push('    신호 「' + s + '」 ' + (i < 0 ? '없음' : '…' + all.slice(Math.max(0, i - 70), i + 40).replace(/\s+/g, ' ')));
    }
    host.remove();
  }
  return log;
});
console.log(out.join('\n'));
await b.close();
