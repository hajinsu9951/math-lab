// LAB 311~320 수업 모형을 실제로 돌려 본다 — 사다리가 켜자마자 통과되지 않는지,
// 미션 두 개가 «조작으로» 열리는지, 탐구 노트 세 칸이 화면 값으로 통과되는지.
// 사용: node test/probe-lsn311.mjs [dist/index.html]
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
    311: [['act', () => sel('suK', 'open')], ['act', () => sel('suK', 'closed')],
          ['act', () => sel('suK', 'open')],
          ['note', 0, r => [0, N(r[2])]],
          ['act', () => sel('suK', 'closed')],
          ['note', 1, r => [1, N(r[2])]],
          ['note', 2, (r, m) => [m.sup1, m.sup2, 1]]],
    312: [['act', () => setv('cmN', 14)], ['act', () => chk('cmQ', true)],
          ['act', () => { chk('cmQ', false); setv('cmN', 4); }],
          ['note', 0, r => [N(r[0]), N(r[1]), N(r[2])]],
          ['act', () => setv('cmN', 14)],
          ['note', 1, r => [N(r[0]), N(r[1]), N(r[2])]],
          ['note', 2, (r, m) => [m.a1, m.a2, 0]]],
    313: [['act', () => { chk('edFix', false); setv('edE', 0.1); setv('edD', 0.04); }],
          ['act', () => { chk('edFix', true); setv('edE', 0.5); }],
          ['act', () => { chk('edFix', false); setv('edE', 0.5); setv('edD', 0.2); }],
          ['note', 0, r => [N(r[0]), N(r[1]), N(r[2])]],
          ['act', () => { setv('edE', 0.1); setv('edD', 0.04); }],
          ['note', 1, r => [N(r[0]), N(r[1]), N(r[1]) / N(r[0])]],
          ['note', 2, (r, m) => [m.e1, m.e2, 0.04]]],
    314: [['act', () => { sel('ucF', 'lin'); setv('ucX', 0.1); }],
          ['act', () => sel('ucF', 'inv')],
          ['act', () => sel('ucF', 'lin')],
          ['note', 0, r => [N(r[1]), N(r[2]), N(r[3])]],
          ['act', () => sel('ucF', 'inv')],
          ['note', 1, (r, m) => [N(r[1]), N(r[3]), m.d1 / N(r[3])]],
          ['note', 2, (r, m) => [m.d1, m.d2, 1]]],
    315: [['act', () => setv('fsN', 30)], ['act', () => chk('fsMax', true)],
          ['act', () => setv('fsN', 3)],
          ['note', 0, r => [N(r[0]), N(r[1]), N(r[3])]],
          ['act', () => setv('fsN', 30)],
          ['note', 1, (r, m) => [N(r[0]), N(r[3]), N(r[3]) - m.mx1]],
          ['note', 2, (r, m) => [m.mx1, m.mx2, 1]]],
    316: [['act', () => setv('efN', 12)], ['act', () => chk('efSw', true)],
          ['act', () => { chk('efSw', false); setv('efN', 4); }],
          ['note', 0, r => [N(r[0]), N(r[1]), N(r[2])]],
          ['act', () => setv('efN', 12)],
          ['note', 1, r => [N(r[1]), N(r[2]), 0.5]],
          ['note', 2, (r, m) => [m.re1, m.re2, -1]]],
    317: [['act', () => setv('cxT', 90)], ['act', () => chk('cxBad', true)],
          ['act', () => { chk('cxBad', false); setv('cxR', 1); setv('cxT', 30); }],
          ['note', 0, r => [N(r[1]), N(r[3]), N(r[3]) / N(r[1])]],
          ['act', () => setv('cxR', 1.4)],
          ['note', 1, r => [N(r[0]), N(r[2]), N(r[0]) * N(r[0])]],
          ['note', 2, (r, m) => [m.ratio, m.r2, 4]]],
    318: [['act', () => setv('mg2A', 2)], ['act', () => chk('mg2Neg', true)],
          ['act', () => { chk('mg2Neg', false); setv('mg2A', 2); }],
          ['note', 0, r => [N(r[1]), N(r[2]), N(r[3])]],
          ['act', () => setv('mg2A', 4)],
          ['note', 1, r => [N(r[1]), N(r[2]), N(r[3])]],
          ['note', 2, () => [0, 0, 4]]],
    319: [['act', () => { sel('sgA', 'r'); sel('sgB', 's'); }],
          ['act', () => chk('sgSwap', true)],
          ['act', () => { chk('sgSwap', false); sel('sgA', 'r'); sel('sgB', 'r2'); }],
          ['note', 0, () => [1, 6]],
          ['act', () => sel('sgB', 's')],
          ['note', 1, () => [0, 6]],
          ['note', 2, () => [1, 0, 0]]],
    320: [['act', () => setv('snT', 30)], ['act', () => sel('snK', 'log')],
          ['act', () => { sel('snK', 'exp'); setv('snT', 30); }],
          ['note', 0, r => [N(r[2]), N(r[3]), N(r[4])]],
          ['act', () => sel('snK', 'log')],
          ['note', 1, (r, m) => [N(r[3]), N(r[4]), m.v1 / N(r[3])]],
          ['note', 2, (r, m) => [m.v1, m.v2, 1]]],
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
        if (no === 311 && k === 0) M.sup1 = N(r[2]);
        if (no === 311 && k === 1) M.sup2 = N(r[2]);
        if (no === 312 && k === 0) M.a1 = N(r[1]);
        if (no === 312 && k === 1) M.a2 = N(r[1]);
        if (no === 313 && k === 0) M.e1 = N(r[0]);
        if (no === 313 && k === 1) M.e2 = N(r[0]);
        if (no === 314 && k === 0) M.d1 = N(r[3]);
        if (no === 314 && k === 1) M.d2 = N(r[3]);
        if (no === 315 && k === 0) M.mx1 = N(r[3]);
        if (no === 315 && k === 1) M.mx2 = N(r[3]);
        if (no === 316 && k === 0) M.re1 = N(r[2]);
        if (no === 316 && k === 1) M.re2 = N(r[2]);
        if (no === 317 && k === 0) M.ratio = N(r[3]) / N(r[1]);
        if (no === 317 && k === 1) M.r2 = N(r[2]);
        if (no === 320 && k === 0) M.v1 = N(r[3]);
        if (no === 320 && k === 1) M.v2 = N(r[3]);
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
