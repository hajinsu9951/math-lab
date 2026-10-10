// 사다리 도달 점검 — 미션이 «조작으로 정말 열리는가»를 실제 사다리로 확인한다.
//
// 왜 필요한가
//   미션은 실험 화면에 신호 글이 나타나면 통과한다. 두 가지로 막힐 수 있다.
//     ㄱ) 신호가 조작해도 끝내 나타나지 않는다
//     ㄴ) 신호가 «붙자마자의 화면»에 이미 들어 있다 — stepLadder 는 그런 신호를
//         증거로 치지 않으므로(!rx.test(first)) 영원히 통과되지 않는다
//   짜임 점검(정적)은 둘 다 볼 수 없고, 열 종씩 손으로 만든 probe-lsn*.mjs 는 356종을 덮지 않는다.
//
// 어떻게 재는가
//   판정은 **사다리 자신의 진행도(.ldp)** 로 한다 — 내가 labText() 를 따라 적다가 틀리면
//   없는 결함을 만들어 내기 때문이다(③ 검증에서 겪었다). 조작은 실험 화면의 것만 만진다.
//     ① 슬라이더를 끝·중간으로 쓸고 ② 드롭다운을 모두 골라 보고
//     ③ 체크박스를 켜고 끄고 ④ 버튼을 두 번씩 누르고
//     ⑤ 그래도 0 단이면 캔버스를 격자로 끌어 본다
//   탐구 노트 미션(마지막 단)은 값을 적어야 열리므로 여기서는 세지 않는다 —
//   **조작만으로 두 단이 열리면 통과**로 본다.
//
// 사용: node test/ladder-reach.mjs [dist/index.html] [시작번호] [끝번호]
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
await p.waitForTimeout(1200);

const out = await p.evaluate(async ([FROM, TO]) => {
  const wait = ms => new Promise(r => setTimeout(r, ms));
  const rows = [];

  for (let no = FROM; no <= TO; no++) {
    const spec = (typeof LESSON !== 'undefined') && LESSON[no];
    if (!spec || !spec.missions) continue;
    const auto = spec.missions.filter(m => m.re && m.re !== '탐구 노트 통과').length;
    if (!auto) continue;

    const host = document.createElement('div');
    host.style.cssText = 'position:fixed;left:-9999px;top:0;width:1200px';
    document.body.appendChild(host);

    let err = '', lab = null, got = -1, start = -1;
    const prog = () => {
      const t = lab && lab.querySelector('.ldp');
      if (!t) return -1;
      if (/완주/.test(t.textContent)) return 99;
      const m = t.textContent.match(/(\d+)\s*\//);
      return m ? +m[1] : -1;
    };
    try {
      lessonFlow(host, spec, {});
      await wait(30);
      lab = host.querySelector('#lsLab');
      if (!lab) throw new Error('#lsLab 없음');
      /* 아무것도 만지지 않고 기다려 본다 — 스스로 다시 그리는 데모가 단을 열어 버리면 오탐이다 */
      await wait(600);
      start = prog();

      const mine = e => !e.closest('.ldr') && !e.closest('.lsnnote');
      const pick = q => [...lab.querySelectorAll(q)].filter(mine);
      const fire = (e, t) => e.dispatchEvent(new Event(t, { bubbles: true }));
      const sweep = (r, fs) => {
        const lo = +r.min || 0, hi = (r.max === '' ? 100 : +r.max);
        return fs.map(f => String(lo + (hi - lo) * f));
      };
      const done = () => prog() >= auto;

      const rng = pick('input[type=range]');
      const sel = pick('select');
      const cbx = pick('input[type=checkbox]');
      const num = pick('input[type=number],input[type=text]');
      const btn = pick('button');

      for (const r of rng) { if (done()) break; for (const v of sweep(r, [0, .25, .5, .75, 1])) {
        r.value = v; fire(r, 'input'); fire(r, 'change'); await wait(6);
      } }
      for (const s of sel) { if (done()) break; for (const o of [...s.options]) {
        s.value = o.value; fire(s, 'change'); await wait(6);
      } }
      for (const c of cbx) { if (done()) break; for (const v of [true, false, true]) {
        c.checked = v; fire(c, 'change'); fire(c, 'input'); await wait(6);
      } }
      for (const n of num) {
        if (done()) break;
        const lo = +n.min || 0, hi = (n.max === '' ? 10 : +n.max);
        for (const v of [lo, Math.round((lo + hi) / 2), hi]) {
          n.value = String(v); fire(n, 'input'); fire(n, 'change'); await wait(6);
        }
      }
      /* 버튼은 두 번씩 — 토글이면 두 상태를 다 본다 */
      for (const k of [0, 1]) for (const x of btn) {
        if (done()) break;
        try { x.click(); } catch (e) { } await wait(10);
      }
      /* 조작 뒤 슬라이더를 다시 — 「문제 불러오기」 다음에야 뜻이 생기는 화면이 있다 */
      for (const r of rng) { if (done()) break; for (const v of sweep(r, [0, .5, 1])) {
        r.value = v; fire(r, 'input'); fire(r, 'change'); await wait(6);
      } }

      /* 아직 한 단도 못 열었으면 캔버스를 끌어 본다 (손잡이를 잡아야 하는 실험실) */
      if (prog() <= 0) {
        for (const cv of pick('canvas')) {
          const r = cv.getBoundingClientRect();
          if (!r.width || !r.height) continue;
          const px = (fx, fy) => ({
            clientX: r.left + r.width * fx, clientY: r.top + r.height * fy,
            pointerId: 1, bubbles: true, cancelable: true
          });
          const P = (t, o) => cv.dispatchEvent(new PointerEvent(t, o));
          for (let gx = 0; gx <= 5 && !done(); gx++) {
            for (let gy = 0; gy <= 3 && !done(); gy++) {
              P('pointerdown', px(.08 + gx * .18, .12 + gy * .26));
              for (const [fx, fy] of [[.15, .2], [.5, .5], [.85, .8], [.5, .15], [.9, .2]]) {
                P('pointermove', px(fx, fy)); await wait(4);
              }
              P('pointerup', px(.5, .5));
              await wait(6);
            }
          }
          if (done()) break;
        }
      }
      await wait(40);
      got = prog();
    } catch (e) { err = String(e).slice(0, 110); }

    if (err) rows.push('LAB ' + no + '  ✗ 예외 ' + err);
    else if (start > 0) rows.push('LAB ' + no + '  ✗ 붙자마자 ' + start + '단이 저절로 열림');
    else if (got <= 0) {
      const sg = spec.missions.filter(m => m.re && m.re !== '탐구 노트 통과')
        .map((m, i) => 'M' + (i + 1) + ' 「' + m.re + '」').join(' · ');
      rows.push('LAB ' + no + '  ✗ 조작만으로 한 단도 안 열림 — ' + sg);
    } else if (got < auto) {
      rows.push('LAB ' + no + '  · ' + got + '/' + auto + '단만 열림 (나머지는 특정 값이 필요할 수 있음)');
    }

    host.remove();
  }
  return rows;
}, [FROM, TO]);

const stuck = out.filter(r => r.includes('✗'));
console.log('사다리 도달 점검 — 막힌 곳 ' + stuck.length + '곳 (참고 ' + (out.length - stuck.length) + '곳)');
out.forEach(r => console.log('  ' + r));
console.log('pageerrors ' + errs.length);
errs.slice(0, 6).forEach(e => console.log('  ' + e));
await b.close();
