// LAB 341~350 수업 모형을 실제로 돌려 본다 — 사다리가 켜자마자 통과되지 않는지,
// 미션 두 개가 «조작으로» 열리는지, 탐구 노트 세 칸이 화면 값으로 통과되는지.
// 사용: node test/probe-lsn341.mjs [dist/index.html]
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
    341: [['act', () => setv('hoD', 9)], ['act', () => chk('hoT', true)],
          ['act', () => { chk('hoT', false); setv('hoD', 5); }],
          ['note', 0, r => [N(r[0]), N(r[1]), N(r[2])]],
          ['act', () => setv('hoD', 9)],
          ['note', 1, r => [N(r[0]), N(r[1]), N(r[2])]],
          ['note', 2, (r, m) => [m.v1, m.v2, 9]]],
    342: [['act', () => { sel('plK', 'max'); setv('plN', 1); }], ['act', () => sel('plK', 'avg')],
          ['act', () => { sel('plK', 'max'); setv('plN', 1); }],
          ['note', 0, r => [N(r[1]), N(r[2]), N(r[3])]],
          ['act', () => sel('plK', 'avg')],
          ['note', 1, r => [N(r[2]), N(r[3]), 1]],
          ['note', 2, (r, m) => [m.v1, m.v2, 0.425]]],
    343: [['act', () => setv('sgW', 6)], ['act', () => setv('sgB', 3)],
          ['act', () => { setv('sgW', 1); setv('sgB', 0); setv('sgX', 0); }],
          ['note', 0, r => [N(r[0]), N(r[1]), N(r[3])]],
          ['act', () => { setv('sgW', 6); setv('sgX', 0.5); }],
          ['note', 1, r => [N(r[0]), N(r[2]), N(r[3])]],
          ['note', 2, (r, m) => [m.p1, m.p2, 2]]],
    344: [['act', () => { hit('kmStep'); }], ['act', () => { hit('kmStep'); }],
          ['act', () => sel('kmK', '3')],
          ['act', () => { sel('kmK', '2'); hit('kmReset'); hit('kmStep'); }],
          ['note', 0, r => [N(r[0]), N(r[1]), N(r[2])]],
          ['act', () => hit('kmStep')],
          ['note', 1, r => [N(r[1]), N(r[2]), N(r[2]) > 0.001 ? 1 : 0]],
          ['note', 2, (r, m) => [m.mv1, m.mv2, 0]]],
    345: [['act', () => setv('rcT', 0.2)], ['act', () => setv('rcS', 0.25)],
          ['act', () => { setv('rcS', 1); setv('rcT', 0.5); }],
          ['note', 0, r => [N(r[0]), N(r[1]), N(r[2])]],
          ['act', () => setv('rcT', 0.2)],
          ['note', 1, r => [N(r[0]), N(r[1]), N(r[2])]],
          ['act', () => setv('rcT', 0.6)],
          ['note', 2, (r, m) => [m.fp1, m.fp2, N(r[1])]]],
    346: [['act', () => { setv('dmX', 3); setv('dmY', 3); }], ['act', () => setv('dmY', 0)],
          ['act', () => { setv('dmX', 3); setv('dmY', 4); }],
          ['note', 0, r => [N(r[0]), N(r[2]), N(r[3])]],
          ['act', () => setv('dmY', 0)],
          ['note', 1, r => [N(r[1]), N(r[2]), 1]],
          ['note', 2, (r, m) => [m.d1, m.d2, 7]]],
    347: [['act', () => { setv('agA', 4); setv('agB', 4); }],
          ['act', () => { setv('agA', 0.5); setv('agB', 8); }],
          ['act', () => { setv('agA', 2); setv('agB', 8); }],
          ['note', 0, r => [N(r[0]), N(r[2]), N(r[3])]],
          ['act', () => { setv('agA', 4); setv('agB', 4); }],
          ['note', 1, r => [N(r[0]), N(r[2]), N(r[3])]],
          ['note', 2, (r, m) => [m.g1, m.g2, 1]]],
    348: [['act', () => chk('afW', true)],
          ['act', () => { chk('afW', false); setv('afA', 30); setv('afB', 30); }],
          ['act', () => { setv('afA', 30); setv('afB', 45); }],
          ['note', 0, r => [N(r[0]), N(r[1]), N(r[2])]],
          ['note', 1, (r, m) => [N(r[3]), m.s1, N(r[3]) > 1 ? 1 : 0]],
          ['note', 2, (r, m) => [m.s1, m.s2, m.s2 - m.s1]]],
    349: [['act', () => { setv('euA', 48); setv('euB', 35); }], ['act', () => setv('euB', 12)],
          ['act', () => { setv('euA', 48); setv('euB', 18); }],
          ['note', 0, r => [N(r[0]), N(r[2]), N(r[3])]],
          ['act', () => setv('euB', 35)],
          ['note', 1, r => [N(r[1]), N(r[2]), N(r[3])]],
          ['note', 2, (r, m) => [m.g1, m.g2, 6]]],
    350: [['act', () => { setv('siA', 3); setv('siB', -1); }],
          ['act', () => { setv('siA', 2); setv('siB', 2); }],
          ['act', () => { setv('siA', -2); setv('siB', 3); }],
          ['note', 0, r => [N(r[0]), N(r[1]), N(r[3])]],
          ['act', () => { setv('siA', 3); setv('siB', -1); }],
          ['note', 1, r => [N(r[0]), N(r[1]), 0]],
          ['note', 2, (r, m) => [m.L1, m.L2, 5]]],
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
        if (no === 341 && k === 0) M.v1 = N(r[2]);
        if (no === 341 && k === 1) M.v2 = N(r[2]);
        if (no === 342 && k === 0) M.v1 = N(r[2]);
        if (no === 342 && k === 1) M.v2 = N(r[2]);
        if (no === 343 && k === 0) M.p1 = N(r[3]);
        if (no === 343 && k === 1) M.p2 = N(r[3]);
        if (no === 344 && k === 0) M.mv1 = N(r[2]);
        if (no === 344 && k === 1) M.mv2 = N(r[2]);
        if (no === 345 && k === 0) M.fp1 = N(r[2]);
        if (no === 345 && k === 1) M.fp2 = N(r[2]);
        if (no === 346 && k === 0) M.d1 = N(r[3]) - N(r[2]);
        if (no === 346 && k === 1) M.d2 = N(r[3]) - N(r[2]);
        if (no === 347 && k === 0) M.g1 = N(r[2]) - N(r[3]);
        if (no === 347 && k === 1) M.g2 = N(r[2]) - N(r[3]);
        if (no === 348 && k === 0) M.s1 = N(r[2]);
        if (no === 348 && k === 1) M.s2 = N(r[3]);
        if (no === 349 && k === 0) M.g1 = N(r[2]);
        if (no === 349 && k === 1) M.g2 = N(r[2]);
        if (no === 350 && k === 0) M.L1 = N(r[3]);
        if (no === 350 && k === 1) M.L2 = N(r[3]);
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
