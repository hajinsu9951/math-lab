// 캔버스에 그린 글씨가 그림 밖으로 흘러 잘리는 곳을 찾는다.
//
// 왜 필요한가
//   글씨 겹침 점검(docs/글씨겹침_점검/check_overlap.py)은 «둘이 겹치는가» 를 센다.
//   «한 줄이 캔버스보다 길어 양끝이 잘리는가» 는 보지 못한다.
//   LAB 25 에서 39 자 한 줄이 380 폭을 넘겨 앞뒤가 사라진 채로 오래 서 있었다 —
//   단행본에 실을 화면 사진을 찍다가 드러났다.
//
// 어떻게 재는가
//   fillText 를 가로채 measureText 로 실제 폭을 재고, 정렬(textAlign)까지 보아
//   그린 상자가 [0, 캔버스 폭] 을 벗어나는지 본다. 브라우저가 쓰는 바로 그 글꼴로 재므로
//   어림이 아니라 실제 값이다.
//
// 사용: node test/scan-canvas-overflow.mjs [dist/index.html] [시작] [끝]
import { createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const require = createRequire(join(ROOT, 'package.json'));
const { chromium } = require('playwright');

const FILE = resolve(process.argv[2] || join(ROOT, 'dist', 'index.html'));
const FROM = +(process.argv[3] || 1), TO = +(process.argv[4] || 356);

const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1280, height: 1000 } });
const errs = [];
p.on('pageerror', e => errs.push(String(e).slice(0, 140)));
await p.goto(pathToFileURL(FILE).href, { waitUntil: 'load' });
await p.waitForTimeout(1000);

const rows = await p.evaluate(async ([FROM, TO]) => {
  const wait = ms => new Promise(r => setTimeout(r, ms));
  const C = CanvasRenderingContext2D.prototype;
  const orig = C.fillText;
  let bag = [];
  C.fillText = function (t, x, y, mw) {
    try {
      const s = String(t);
      if (s.trim()) {
        const w = mw != null ? Math.min(mw, this.measureText(s).width)
          : this.measureText(s).width;
        const a = this.textAlign || 'start';
        const L = a === 'center' ? x - w / 2 : (a === 'right' || a === 'end') ? x - w : x;
        const W = this.canvas.width;
        /* 좌표를 그대로 보면 안 된다 — translate·rotate 를 쓴 데모가 많다.
           지금의 변환 행렬을 적용해 «화면에 실제로 놓이는 자리» 로 바꿔 재야 한다.
           (이 보정 없이 세면 LAB 28 의 저울판 글씨처럼 멀쩡한 것이 잘렸다고 나온다.) */
        const m = this.getTransform();
        const px = [L, L + w].map(v => m.a * v + m.c * y + m.e);
        const x0 = Math.min(px[0], px[1]), x1 = Math.max(px[0], px[1]);
        const over = Math.max(0 - x0, x1 - W);
        if (over > 2) bag.push({ s: s.slice(0, 46), w: Math.round(x1 - x0), W, over: Math.round(over) });
      }
    } catch (e) { }
    return orig.apply(this, arguments);
  };

  const out = [];
  for (let no = FROM; no <= TO; no++) {
    if (!(typeof LESSON !== 'undefined' && LESSON[no])) continue;
    bag = [];
    const host = document.createElement('div');
    host.style.cssText = 'position:fixed;left:-9999px;top:0;width:1180px';
    document.body.appendChild(host);
    try {
      lessonFlow(host, LESSON[no], (typeof PRINS !== 'undefined' ? PRINS[no - 1] : null));
      await wait(30);
      /* 조작을 조금 해 다시 그리게 한다 — 상태에 따라 나오는 글도 함께 본다 */
      const lab = host.querySelector('#lsLab');
      const mine = e => !e.closest('.ldr') && !e.closest('.lsnnote');
      const fire = (e, t) => e.dispatchEvent(new Event(t, { bubbles: true }));
      for (const r of [...lab.querySelectorAll('input[type=range]')].filter(mine)) {
        const lo = +r.min || 0, hi = (r.max === '' ? 100 : +r.max);
        for (const f of [0, .5, 1]) { r.value = String(lo + (hi - lo) * f); fire(r, 'input'); }
      }
      for (const s2 of [...lab.querySelectorAll('select')].filter(mine))
        for (const o of [...s2.options]) { s2.value = o.value; fire(s2, 'change'); }
      for (const x of [...lab.querySelectorAll('button')].filter(mine).slice(0, 12)) {
        try { x.click(); } catch (e) { }
      }
      await wait(40);
    } catch (e) { }
    host.remove();
    /* 같은 글이 여러 번 그려지므로 한 번만 센다 */
    const seen = new Set(), uniq = [];
    for (const h of bag) {
      if (seen.has(h.s)) continue;
      seen.add(h.s); uniq.push(h);
    }
    if (uniq.length) out.push({ no, hits: uniq.slice(0, 4) });
  }
  C.fillText = orig;
  return out;
}, [FROM, TO]);

console.log('캔버스 밖으로 흘러 잘리는 글씨 — 실험실 ' + rows.length + '종');
for (const r of rows) {
  console.log('  LAB ' + r.no);
  for (const h of r.hits)
    console.log(`     폭 ${h.w} > 캔버스 ${h.W} (${h.over}px 넘침)  「${h.s}」`);
}
console.log('pageerrors ' + errs.length);
await b.close();
