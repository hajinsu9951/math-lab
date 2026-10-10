// 활동지에 LaTeX 원문이 남아 있지 않은지 356종 전부를 기계가 센다.
// 화면은 texify() 가 $…$ 를 수식으로 바꿔 주지만 활동지는 글자를 그대로 썼다 —
// 그래서 학생이 받아 드는 종이에 「$\sqrt{a+b}$」 가 찍혔다. wsTex() 를 넣은 뒤 확인한다.
// 사용: node test/probe-ws-tex.mjs [dist/index.html]
import { createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const require = createRequire(join(ROOT, 'package.json'));
const { chromium } = require('playwright');
const FILE = resolve(process.argv[2] || join(ROOT, 'dist', 'index.html'));

const b = await chromium.launch();
const p = await b.newPage();
const errs = [];
p.on('pageerror', e => errs.push(String(e).slice(0, 140)));
await p.goto(pathToFileURL(FILE).href, { waitUntil: 'load' });
await p.waitForTimeout(1000);

const out = await p.evaluate(() => {
  const bad = [], noMath = [];
  let made = 0, withMath = 0;
  for (let n = 1; n <= 356; n++) {
    const spec = LESSON[n];
    if (!spec || !WS_LABS.includes(n)) continue;
    let h;
    try { h = lessonSheet(spec, (typeof PRINS !== 'undefined' ? PRINS[n - 1] : null), n); }
    catch (e) { bad.push('LAB ' + n + ' 예외 ' + String(e).slice(0, 80)); continue; }
    made++;
    /* 그림의 base64 는 빼고 본다 — 거기엔 $ 가 들어 있을 수 있다 */
    const t = h.replace(/src="data:[^"]*"/g, 'src="…"');
    const m = t.match(/\$[^$\n<]{1,80}\$/g);
    if (m) bad.push('LAB ' + n + ' ‖ ' + [...new Set(m)].slice(0, 3).join(' / '));
    if (/<math/.test(t)) withMath++;
  }
  return { made, withMath, bad, noMath };
});
console.log('활동지 ' + out.made + '장 생성 · 수식이 든 장 ' + out.withMath + '장');
console.log('LaTeX 원문이 남은 곳 ' + out.bad.length + '곳');
out.bad.slice(0, 40).forEach(r => console.log('  ' + r));
console.log('pageerrors ' + errs.length);
errs.slice(0, 4).forEach(e => console.log('  ' + e));
await b.close();
