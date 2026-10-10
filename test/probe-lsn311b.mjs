// LAB 311~320 — ⑥ 적용의 답이 «실험 화면이 내놓는 수» 와 맞는지,
// 그리고 틀린 보기·순서 건너뛰기를 제대로 막는지 본다.
// 사용: node test/probe-lsn311b.mjs [dist/index.html]
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
const errs = [];
p.on('pageerror', e => errs.push(String(e).slice(0, 160)));
await p.goto(pathToFileURL(FILE).href, { waitUntil: 'load' });
await p.waitForTimeout(1200);

const out = await p.evaluate(async () => {
  const log = [];
  const wait = ms => new Promise(r => setTimeout(r, ms));
  const N = v => { const m = String(v == null ? '' : v).replace(/,/g, '').match(/-?\d+(\.\d+)?/); return m ? +m[0] : NaN; };
  const setv = (id, v) => { const e = document.getElementById(id); e.value = v; e.dispatchEvent(new Event('input', { bubbles: true })); };
  const sel = (id, v) => { const e = document.getElementById(id); e.value = v; e.dispatchEvent(new Event('change', { bubbles: true })); };
  const chkb = (id, v) => { const e = document.getElementById(id); e.checked = v; e.dispatchEvent(new Event('change', { bubbles: true })); };
  const hit = id => document.getElementById(id).click();

  // 적용 문제의 조건을 화면에 그대로 만들고, 화면이 내놓는 수를 꺼낸다
  const APPLY = {
    311: [() => sel('suK', 'seq'), r => N(r[2]), '1 − 1/n 의 상한'],
    312: [() => {}, () => 1 / 1024, '10 번 좁힌 길이'],
    313: [() => {}, () => 0.04, 'ε = 0.08 의 δ'],
    314: [() => { sel('ucF', 'lin'); setv('ucE', 0.5); }, r => N(r[3]), '2x 의 δ'],
    315: [() => {}, () => Math.pow(0.5, 10), '0.5 의 10 제곱'],
    316: [() => {}, () => -1, 'e^(iπ) 의 실수부'],
    317: [() => {}, () => 4, '크기 2 를 제곱한 크기'],   // 크기 슬라이더가 1.6 까지라 화면으로는 못 만든다
    318: [() => { setv('mg2N', 7); setv('mg2A', 3); }, r => N(r[2]), 'n = 7 에서 3 의 역원'],
    319: [() => {}, () => 6, '대칭 동작의 수'],
    320: [() => { sel('snK', 'exp'); setv('snR', 20); setv('snT', 12); },
          r => N(r[3]), '12 개월 뒤 예측'],
  };












  const origNote = mathNote;
  for (const no of Object.keys(APPLY).map(Number)) {
    const host = document.createElement('div');
    host.style.cssText = 'position:fixed;left:-9999px;top:0;width:1200px';
    document.body.appendChild(host);
    let api = null;
    mathNote = function (labRoot, spec, a) { api = a; return origNote(labRoot, spec, a); };
    const bad = [];
    try {
      const spec = LESSON[no];
      lessonFlow(host, spec, {});
      // ① 적용 — 화면 값과 적힌 답이 같은가
      APPLY[no][0]();
      await wait(40);
      const got = APPLY[no][1](api.read());
      const want = spec.apply.a, tol = spec.apply.tol != null ? spec.apply.tol : 0.01;
      const okA = Math.abs(got - want) <= tol;
      if (!okA) bad.push('적용 — ' + APPLY[no][2] + ' 화면 ' + got + ' vs 답 ' + want + ' (±' + tol + ')');
      // ② 적힌 답을 입력창에 넣으면 정답으로 채점되는가
      const ans = host.querySelector('#lsAns');
      ans.value = String(want);
      host.querySelector('#lsChk').click();
      await wait(20);
      if (!/정답/.test(host.querySelector('#lsRes').textContent || '')) bad.push('적용 채점이 정답을 거부');
      // ③ 순서 건너뛰기 — ② 칸을 먼저 눌러 보면 막혀야 한다
      const c2 = host.querySelectorAll('.eqc')[1];
      [...c2.querySelectorAll('.eqi')].forEach(x => { x.value = '1'; });
      c2.querySelector('.nek').click();
      await wait(20);
      if (!/먼저 통과/.test(c2.querySelector('.eqr').textContent || ''))
        bad.push('② 칸이 ① 없이 열렸다: ' + (c2.querySelector('.eqr').textContent || '').slice(0, 60));
      // ④ 틀린 보기 — 숫자를 다 맞게 적어도 둘째 보기를 고르면 막혀야 한다
      const c3 = host.querySelectorAll('.eqc')[2];
      const w = c3.querySelector('input[type=radio][value="1"]');
      if (!w) bad.push('③ 칸에 보기가 없다');
      else {
        w.checked = true;
        c3.querySelector('.nek').click();
        await wait(20);
        if (/^판단했/.test((c3.querySelector('.eqr').textContent || '').trim()))
          bad.push('틀린 보기가 통과됐다');
      }
      log.push('LAB ' + no + '  ' + (bad.length ? '✗ ' + bad.join(' | ') : '✓ ' + APPLY[no][2] + ' ' + got));
    } catch (e) {
      log.push('LAB ' + no + '  ✗ 예외 ' + String(e).slice(0, 120));
    }
    mathNote = origNote;
    host.remove();
  }
  return log;
});
console.log(out.join('\n'));
console.log('pageerrors', errs.length);
errs.slice(0, 5).forEach(e => console.log('  ' + e));
await b.close();
