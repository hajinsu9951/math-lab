// QR 이 가리키는 «이름 주소» 가 정말 그 실험실을 여는지 확인한다.
// 책에 찍힌 QR 이 안 열리면 교실에서 그대로 멈추므로, 스무 종을 모두 실제로 열어 본다.
// 사용: node test/probe-qr-route.mjs [dist/index.html] [시작] [끝]
import { createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const require = createRequire(join(ROOT, 'package.json'));
const { chromium } = require('playwright');

const FILE = resolve(process.argv[2] || join(ROOT, 'dist', 'index.html'));
const FROM = +(process.argv[3] || 25), TO = +(process.argv[4] || 44);

const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1280, height: 900 } });
const errs = [];
p.on('pageerror', e => errs.push(String(e).slice(0, 120)));

const base = pathToFileURL(FILE).href;
await p.goto(base, { waitUntil: 'load' });
await p.waitForTimeout(900);

/* 책이 쓰는 것과 똑같은 규칙으로 이름을 만든다 */
const slugs = await p.evaluate(([FROM, TO]) => {
  const out = [];
  for (let n = FROM; n <= TO; n++) {
    const S = (typeof LESSON !== 'undefined') && LESSON[n];
    const t = (S && S.title) || (LABS[n - 1] && LABS[n - 1].t) || '';
    const plain = String(t).replace(/<[^>]*>/g, '').split(/[—–]/)[0];
    out.push({ n, title: plain.trim(), slug: plain.replace(/[^0-9A-Za-z가-힣]/g, '') });
  }
  return out;
}, [FROM, TO]);

let ok = 0;
const bad = [];
for (const s of slugs) {
  await p.goto(base + '#' + encodeURIComponent(s.slug), { waitUntil: 'load' });
  await p.waitForTimeout(260);
  const got = await p.evaluate(() => {
    const on = document.getElementById('mask');
    const t = document.getElementById('mTitle');
    if (!on || !on.classList.contains('on')) return 0;
    const m = /LAB\s*(\d+)/.exec(t ? t.textContent : '');
    return m ? +m[1] : -1;
  });
  if (got === s.n) ok++;
  else bad.push(`${s.n} 「${s.title}」 → ${got === 0 ? '안 열림' : 'LAB ' + got}`);
}
console.log(`이름 주소로 열기 — ${ok}/${slugs.length} 성공`);
bad.forEach(x => console.log('  ✗ ' + x));
console.log('pageerrors ' + errs.length);
await b.close();
