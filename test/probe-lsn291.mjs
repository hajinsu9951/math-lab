// LAB 291~300 수업 모형을 실제로 돌려 본다 — 사다리가 켜자마자 통과되지 않는지,
// 미션 두 개가 «조작으로» 열리는지, 탐구 노트 세 칸이 화면 값으로 통과되는지.
// 사용: node test/probe-lsn291.mjs [dist/index.html]
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
    291: [['act', () => setv('hbN', 5)], ['act', () => setv('hbP', 0.8)],
          ['act', () => setv('hbN', 1)],
          ['note', 0, r => [N(r[0]), N(r[2])]],
          ['act', () => setv('hbN', 5)],
          ['note', 1, r => [N(r[2]), N(r[3]), N(r[2]) - N(r[3])]],
          ['note', 2, (r, m) => [m.n1, m.n2, 1]]],
    292: [['act', () => { sel('ttG', 'xor'); chk('ttA', true); chk('ttB', true); }],
          ['act', () => sel('ttG', 'nand')],
          ['act', () => sel('ttG', 'and')],
          ['note', 0, r => [N(r[1]), N(r[2]), N(r[3])]],
          ['act', () => sel('ttG', 'xor')],
          ['note', 1, (r, m) => [N(r[3]), N(r[4]), N(r[4]) - m.c1]],
          ['note', 2, (r, m) => [m.c1, m.c2, 3]]],
    293: [['act', () => chk('dgCmp', true)], ['act', () => sel('dgR', 'nA_or_nB')],
          ['act', () => sel('dgR', 'nA_and_nB')],
          ['note', 0, r => [N(r[2]), 1]],
          ['act', () => sel('dgR', 'nA_or_nB')],
          ['note', 1, r => [N(r[2]), 0]],
          ['note', 2, (r, m) => [m.d1, m.d2, 1]]],
    294: [['act', () => { setv('ieAB', 8); setv('ieBC', 6); setv('ieCA', 5); }],
          ['act', () => { chk('ieNo', true); setv('ieABC', 3); }],
          ['act', () => setv('ieABC', 0)],
          ['note', 0, r => [N(r[0]), N(r[3]), N(r[4])]],
          ['act', () => setv('ieABC', 3)],
          ['note', 1, (r, m) => [N(r[3]), N(r[4]), N(r[4]) - m.v1]],
          ['note', 2, (r, m) => [m.v1, m.v2, 105 - m.v2]]],
    295: [['act', () => setv('phN', 7)], ['act', () => setv('phN', 12)],
          ['act', () => setv('phN', 7)],
          ['note', 0, r => [N(r[0]), N(r[1]), N(r[3])]],
          ['act', () => setv('phN', 12)],
          ['note', 1, r => [N(r[0]), N(r[3]), Math.ceil(N(r[0]) / N(r[1]))]],
          ['note', 2, (r, m) => [m.g1, m.g2, 5]]],
    296: [['act', () => setv('hnT', 100)], ['act', () => setv('hnN', 16)],
          ['act', () => setv('hnN', 3)],
          ['note', 0, r => [N(r[0]), N(r[1])]],
          ['act', () => setv('hnN', 4)],
          ['note', 1, (r, m) => [N(r[0]), N(r[1]), 2 * m.t1 + 1]],
          ['note', 2, (r, m) => [m.t1, m.t2, 1023]]],
    297: [['act', () => sel('epK', 'k4')], ['act', () => sel('epK', 'env')],
          ['note', 0, r => [N(r[1]), N(r[2])]],
          ['act', () => sel('epK', 'k4')],
          ['note', 1, (r, m) => [N(r[1]), N(r[2]), N(r[2]) - m.od1]],
          ['note', 2, (r, m) => [m.od1, m.od2, 2]]],
    298: [['act', () => setv('hsE', 7)], ['act', () => chk('hsOne', true)],
          ['act', () => { chk('hsOne', false); setv('hsE', 7); }],
          ['note', 0, r => [N(r[1]), N(r[2])]],
          ['act', () => setv('hsE', 9)],
          ['note', 1, r => [N(r[1]), N(r[2]), N(r[2]) / N(r[1])]],
          ['note', 2, (r, m) => [m.s1, m.s2, 20]]],
    299: [['act', () => setv('mtK', 5)], ['act', () => chk('mtNo', true)],
          ['act', () => { chk('mtNo', false); setv('mtK', 5); }],
          ['note', 0, r => [N(r[0]), N(r[2]), N(r[3])]],
          ['act', () => chk('mtNo', true)],
          ['note', 1, r => [N(r[2]), N(r[3]), N(r[3]) - 1]],
          ['note', 2, (r, m) => [m.c1, m.comp2, 5]]],
    300: [['act', () => setv('bdK', 22)], ['act', () => sel('bdM', 'dfs')],
          ['act', () => { sel('bdM', 'bfs'); setv('bdK', 22); }],
          ['note', 0, r => [N(r[1]), N(r[2]), N(r[3])]],
          ['act', () => sel('bdM', 'dfs')],
          ['note', 1, r => [N(r[2]), N(r[3]), N(r[2]) - N(r[3])]],
          ['note', 2, (r, m) => [m.len1, m.len2, 1]]],
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
        if (no === 291 && k === 0) M.n1 = N(r[2]);
        if (no === 291 && k === 1) M.n2 = N(r[2]);
        if (no === 292 && k === 0) M.c1 = N(r[4]);
        if (no === 292 && k === 1) M.c2 = N(r[4]);
        if (no === 293 && k === 0) M.d1 = N(r[2]);
        if (no === 293 && k === 1) M.d2 = N(r[2]);
        if (no === 294 && k === 0) M.v1 = N(r[4]);
        if (no === 294 && k === 1) M.v2 = N(r[4]);
        if (no === 295 && k === 0) { M.g1 = N(r[3]); M.k = N(r[1]); }
        if (no === 295 && k === 1) M.g2 = N(r[3]);
        if (no === 296 && k === 0) { M.n1 = N(r[0]); M.t1 = N(r[1]); }
        if (no === 296 && k === 1) M.t2 = N(r[1]);
        if (no === 297 && k === 0) M.od1 = N(r[2]);
        if (no === 297 && k === 1) M.od2 = N(r[2]);
        if (no === 298 && k === 0) { M.e1 = N(r[1]); M.s1 = N(r[2]); }
        if (no === 298 && k === 1) { M.e2 = N(r[1]); M.s2 = N(r[2]); }
        if (no === 299 && k === 0) { M.c1 = N(r[2]); M.k1 = N(r[0]); }
        if (no === 299 && k === 1) { M.c2 = N(r[2]); M.comp2 = N(r[3]); }
        if (no === 300 && k === 0) { M.len1 = N(r[2]); M.best = N(r[3]); }
        if (no === 300 && k === 1) M.len2 = N(r[2]);
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
