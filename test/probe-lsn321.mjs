// LAB 321~330 수업 모형을 실제로 돌려 본다 — 사다리가 켜자마자 통과되지 않는지,
// 미션 두 개가 «조작으로» 열리는지, 탐구 노트 세 칸이 화면 값으로 통과되는지.
// 사용: node test/probe-lsn321.mjs [dist/index.html]
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
  const chk = (id, v) => { const e = document.getElementById(id); e.checked = v; e.dispatchEvent(new Event('change', { bubbles: true })); };
  const hit = id => document.getElementById(id).click();

  const PLAN = {
    321: [['act', () => setv('exD', 5)], ['act', () => setv('exX', 14)],
          ['act', () => { setv('exD', 1); setv('exX', 5); }],
          ['note', 0, r => [N(r[0]), N(r[2]), N(r[3])]],
          ['act', () => { setv('exD', 5); setv('exX', 14); }],
          ['note', 1, r => [N(r[0]), N(r[2]), N(r[3])]],
          ['note', 2, (r, m) => [m.v1, m.v2, 1]]],
    322: [['act', () => setv('ppM2', -1)], ['act', () => setv('ppM2', 1)],
          ['act', () => setv('ppM2', -1)],
          ['note', 0, r => [N(r[0]), N(r[1]), N(r[2])]],
          ['act', () => setv('ppM2', 1)],
          ['note', 1, r => [N(r[0]), N(r[1]), N(r[2])]],
          ['note', 2, (r, m) => [m.p1, m.p2, -1 / 3]]],
    323: [['act', () => { setv('pl2x', 2); setv('pl2y', 2); }], ['act', () => chk('pl2No', true)],
          ['act', () => { chk('pl2No', false); setv('pl2x', 2); setv('pl2y', 1); }],
          ['note', 0, (r, m) => [N(r[2]), N(r[3]), Math.abs(N(r[2])) / N(r[3])]],
          ['act', () => { setv('pl2x', 2); setv('pl2y', 2); }],
          ['note', 1, r => [N(r[2]), N(r[3])]],
          ['note', 2, (r, m) => [m.d1, m.d2, m.ratio]]],
    324: [['act', () => setv('clK', 1.7)], ['act', () => setv('clK', 2.6)],
          ['act', () => setv('clK', 0.5)],
          ['note', 0, r => [N(r[0]), N(r[3]), 2]],
          ['act', () => setv('clK', 1.7)],
          ['note', 1, r => [N(r[0]), N(r[3]), 1]],
          ['note', 2, (r, m) => [m.d1, m.d2, 0]]],
    325: [['act', () => { sel('fsK', 'ln'); setv('fsA', 2); }], ['act', () => chk('fsW', true)],
          ['act', () => { chk('fsW', false); setv('fsA', 2); setv('fsB', -1); }],
          ['note', 0, r => [N(r[1]), N(r[2])]],
          ['act', () => chk('fsW', true)],
          ['note', 1, r => [N(r[1]), N(r[2]), 1]],
          ['note', 2, (r, m) => [m.a1, m.b1, 1]]],
    326: [['act', () => sel('rfK', 'd')], ['act', () => sel('rfK', 'o')],
          ['act', () => sel('rfK', 'x')],
          ['note', 0, r => { const q = String(r[2]).match(/-?\d+(\.\d+)?/g); return [+q[0], +q[1]]; }],
          ['act', () => sel('rfK', 'd')],
          ['note', 1, r => { const q = String(r[2]).match(/-?\d+(\.\d+)?/g); return [+q[0], +q[1], 0]; }],
          ['note', 2, (r, m) => [m.x1, m.x2, 1]]],
    327: [['act', () => sel('soK', 'AmB')], ['act', () => sel('soK', 'sym')],
          ['act', () => sel('soK', 'AuB')],
          ['note', 0, r => [(String(r[1]).match(/1/g) || []).length, N(r[2])]],
          ['act', () => sel('soK', 'AnB')],
          ['note', 1, r => [(String(r[1]).match(/1/g) || []).length, N(r[2])]],
          ['note', 2, (r, m) => [m.n1, m.n2, m.n1]]],
    328: [['act', () => sel('dpK', 'ex')], ['act', () => setv('dpN', 1)],
          ['act', () => { sel('dpK', 'in'); setv('dpN', 2); }],
          ['note', 0, r => [N(r[2]), +String(r[3]).match(/-?\d+(\.\d+)?/g)[0]]],
          ['act', () => sel('dpK', 'ex')],
          ['note', 1, r => [N(r[2]), +String(r[3]).match(/-?\d+(\.\d+)?/g)[0]]],
          ['note', 2, (r, m) => [m.den1, m.den2, 0]]],
    329: [['act', () => setv('mvC', 0)], ['act', () => sel('mvK', 'ab')],
          ['act', () => { sel('mvK', 'sq'); setv('mvB', 2); setv('mvC', 1.5); }],
          ['note', 0, r => [N(r[1]), N(r[2]), N(r[3])]],
          ['act', () => setv('mvC', 0)],
          ['note', 1, r => [N(r[2]), N(r[3]), N(r[2]) - N(r[3])]],
          ['note', 2, (r, m) => [m.s1, m.s2, 0.5]]],
    330: [['act', () => sel('ce2K', 'a')],
          ['act', () => { sel('ce2K', 'b'); setv('ce2N', 40); }],
          ['act', () => sel('ce2K', 'a')],
          ['note', 0, r => [N(r[2]), N(r[3])]],
          ['act', () => { sel('ce2K', 'b'); setv('ce2N', 40); }],
          ['note', 1, r => [N(r[2]), N(r[3])]],
          ['note', 2, (r, m) => [0, m.bad2, 1]]],
  };











  const origNote = mathNote;
  for (const no of Object.keys(PLAN).map(Number)) {
    const host = document.createElement('div');
    host.style.cssText = 'position:fixed;left:-9999px;top:0;width:1200px';
    document.body.appendChild(host);
    let api = null;
    mathNote = function (labRoot, spec, a) { api = a; return origNote(labRoot, spec, a); };
    const bad = [];
    try {
      lessonFlow(host, LESSON[no], {});
      const prog = () => (host.querySelector('.ldp') || {}).textContent?.trim() || '(없음)';
      if (prog() !== '0 / 3') bad.push('켜자마자 ' + prog());
      const M = {};
      for (const s of PLAN[no]) {
        if (s[0] === 'act') { s[1](); await wait(40); continue; }
        const k = s[1];
        const r = api.read();
        const vals = s[2](r, M);
        const card = host.querySelectorAll('.eqc')[k];
        const ins = [...card.querySelectorAll('.eqi')];
        if (ins.length !== vals.length) bad.push('노트' + (k + 1) + ' 빈칸 ' + ins.length + '개인데 답 ' + vals.length + '개');
        ins.forEach((x, i) => { x.value = vals[i] == null ? '' : String(Math.round(vals[i] * 1e6) / 1e6); });
        const radio = card.querySelector('input[type=radio][value="0"]');
        if (radio) radio.checked = true;
        card.querySelector('.nek').click();
        await wait(40);
        const res = (card.querySelector('.eqr').textContent || '').trim();
        if (!/^(기록했|계산했|판단했)/.test(res)) bad.push('노트' + (k + 1) + ' ✗ ' + res.slice(0, 90));
        if (no === 321 && k === 0) M.v1 = N(r[2]);
        if (no === 321 && k === 1) M.v2 = N(r[2]);
        if (no === 322 && k === 0) M.p1 = N(r[2]);
        if (no === 322 && k === 1) M.p2 = N(r[2]);
        if (no === 323 && k === 0) { M.d1 = N(r[3]); M.ratio = Math.abs(N(r[2])) / N(r[3]); }
        if (no === 323 && k === 1) M.d2 = N(r[3]);
        if (no === 324 && k === 0) M.d1 = N(r[3]);
        if (no === 324 && k === 1) M.d2 = N(r[3]);
        if (no === 325 && k === 0) { M.a1 = N(r[1]); M.b1 = N(r[2]); }
        if (no === 326 && k === 0) M.x1 = +String(r[2]).match(/-?\d+(\.\d+)?/g)[0];
        if (no === 326 && k === 1) M.x2 = +String(r[2]).match(/-?\d+(\.\d+)?/g)[0];
        if (no === 327 && k === 0) M.n1 = N(r[2]);
        if (no === 327 && k === 1) M.n2 = N(r[2]);
        if (no === 328 && k === 0) M.den1 = N(r[2]);
        if (no === 328 && k === 1) M.den2 = N(r[2]);
        if (no === 329 && k === 0) M.s1 = N(r[2]);
        if (no === 329 && k === 1) M.s2 = N(r[3]);
        if (no === 330 && k === 1) M.bad2 = N(r[3]);
      }
      await wait(80);
      const fin = prog();
      if (!/3 \/ 3/.test(fin)) bad.push('끝에 ' + fin);
      log.push('LAB ' + no + '  ' + (bad.length ? '✗ ' + bad.join(' | ') : '✓ ' + fin));
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
