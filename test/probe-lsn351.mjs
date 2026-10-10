// LAB 351~355 수업 모형을 실제로 돌려 본다 — 사다리가 켜자마자 통과되지 않는지,
// 미션 두 개가 «조작으로» 열리는지, 탐구 노트 세 칸이 화면 값으로 통과되는지.
// 사용: node test/probe-lsn351.mjs [dist/index.html]
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
    351: [['act', () => setv('trT', 90)], ['act', () => setv('trT', 60)],
          ['act', () => setv('trT', 70)],
          ['note', 0, r => [N(r[0]), N(r[1]), N(r[2])]],
          ['act', () => setv('trT', 90)],
          ['note', 1, r => [N(r[0]), N(r[1]), N(r[2])]],
          ['note', 2, (r, m) => [m.d1, m.d2, 95]]],
    352: [['act', () => setv('rsN', 4)],
          ['act', () => { sel('rsK', 'stripe'); setv('rsN', 12); }],
          ['act', () => setv('rsN', 24)],
          ['note', 0, r => [N(r[1]), N(r[2]), N(r[3])]],
          ['act', () => setv('rsN', 12)],
          ['note', 1, r => [N(r[1]), N(r[2]), N(r[3])]],
          ['note', 2, (r, m) => [8, m.sh2, 144]]],
    353: [['act', () => hit('neExact')],
          ['act', () => { hit('neRst'); hit('neStep'); hit('neStep'); hit('neStep'); hit('neStep'); }],
          ['act', () => hit('neExact')],
          ['note', 0, r => [N(r[1]), N(r[2]), N(r[3])]],
          ['act', () => { hit('neRst'); hit('neStep'); hit('neStep'); hit('neStep'); hit('neStep'); }],
          ['note', 1, r => [N(r[0]), N(r[1]), N(r[3])]],
          ['note', 2, (r, m) => [m.A, m.a2, 2]]],
    354: [['act', () => { setv('moB', 0); hit('moGo'); }],
          ['act', () => { hit('moRst'); setv('moB', 0.8); hit('moGo'); }],
          ['act', () => { hit('moRst'); setv('moB', 0); hit('moGo'); }],
          ['note', 0, r => [N(r[1]), N(r[2]), N(r[3])]],
          ['act', () => { hit('moRst'); setv('moB', 0.8); hit('moGo'); }],
          ['note', 1, r => [N(r[1]), N(r[3]), 1]],
          ['note', 2, (r, m) => [m.d1, m.d2, m.d1 - m.d2]]],
    355: [['act', () => { setv('cfP', 1); chk('cfN', true); }],
          ['act', () => setv('cfP', 50)],
          ['act', () => { setv('cfP', 1); chk('cfN', true); }],
          ['note', 0, r => [N(r[0]), N(r[2]), 0]],
          ['act', () => chk('cfN', false)],
          ['note', 1, r => [N(r[2]), N(r[3]), 1]],
          ['note', 2, (r, m) => [m.acc1, 0, m.rec2]]],
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
        if (no === 351 && k === 0) M.d1 = N(r[1]);
        if (no === 351 && k === 1) M.d2 = N(r[1]);
        if (no === 352 && k === 1) M.sh2 = N(r[3]);
        if (no === 353 && k === 0) M.A = N(r[1]);
        if (no === 353 && k === 1) M.a2 = N(r[1]);
        if (no === 354 && k === 0) M.d1 = N(r[3]);
        if (no === 354 && k === 1) M.d2 = N(r[3]);
        if (no === 355 && k === 0) M.acc1 = N(r[2]);
        if (no === 355 && k === 1) M.rec2 = N(r[3]);
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
