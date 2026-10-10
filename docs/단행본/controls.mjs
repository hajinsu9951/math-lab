// 실험 화면의 «조작 장치 목록» 을 뽑는다 — 책의 「화면 지도」와 사진 촬영 준비에 쓴다.
// 사용: node docs/단행본/controls.mjs 25 44
import { createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const require = createRequire(join(ROOT, 'package.json'));
const { chromium } = require('playwright');
const FROM = +(process.argv[2] || 25), TO = +(process.argv[3] || 44);
const FILE = resolve(join(ROOT, 'dist', 'index.html'));

const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1280, height: 1000 } });
await p.goto(pathToFileURL(FILE).href, { waitUntil: 'load' });
await p.waitForTimeout(1000);

const out = await p.evaluate(([FROM, TO]) => {
  const L = [];
  for (let n = FROM; n <= TO; n++) {
    if (!(typeof LESSON !== 'undefined' && LESSON[n])) continue;
    const host = document.createElement('div');
    host.style.cssText = 'position:fixed;left:-9999px;top:0;width:1180px';
    document.body.appendChild(host);
    try {
      lessonFlow(host, LESSON[n], (typeof PRINS !== 'undefined' ? PRINS[n - 1] : null));
      const lab = host.querySelector('#lsLab');
      const mine = e => !e.closest('.ldr') && !e.closest('.lsnnote');
      const txt = e => {
        const lb = e.closest('label');
        const t = (lb ? lb.textContent : e.textContent) || '';
        return t.replace(/\s+/g, ' ').trim().slice(0, 40);
      };
      const rows = [];
      for (const sel of ['input[type=range]', 'select', 'input[type=checkbox]',
        'input[type=number]', 'button', 'canvas']) {
        for (const e of [...lab.querySelectorAll(sel)].filter(mine)) {
          rows.push(sel.replace(/input\[type=|\]/g, '') + ' #' + (e.id || '-')
            + (sel === 'input[type=range]'
              ? ` [${e.min}~${e.max}/${e.step}=${e.value}]` : '')
            + '  ' + txt(e));
        }
      }
      /* 조작 장치 이름만으로는 모자란다 — 화면에 보이는 글 전체도 함께 모은다.
         책이 「찾았습니다!」처럼 «출력 문구» 를 인용할 때 대조하려면 이것이 있어야 한다. */
      const seen = (lab.textContent || '').replace(/\s+/g, ' ').trim();
      L.push('── LAB ' + n + '\n   ' + rows.join('\n   ')
        + '\n   화면글: ' + seen.slice(0, 2000));
    } catch (e) { L.push('── LAB ' + n + '  예외 ' + String(e).slice(0, 80)); }
    host.remove();
  }
  return L;
}, [FROM, TO]);
console.log(out.join('\n'));
await b.close();
