// LAB 301~310 수업 모형을 실제로 돌려 본다 — 사다리가 켜자마자 통과되지 않는지,
// 미션 두 개가 «조작으로» 열리는지, 탐구 노트 세 칸이 화면 값으로 통과되는지.
// 사용: node test/probe-lsn301.mjs [dist/index.html]
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
    301: [['act', () => setv('dkK', 6)], ['act', () => setv('dkW', 1)],
          ['act', () => setv('dkW', 5)],
          ['note', 0, r => [N(r[0]), N(r[2]), N(r[3])]],
          ['act', () => setv('dkW', 1)],
          ['note', 1, (r, m) => [N(r[1]), N(r[2]), m.d1 - N(r[2])]],
          ['note', 2, (r, m) => [m.d1, m.d2, 1]]],
    302: [['act', () => sel('gfC', 'odd')],
          ['act', () => { sel('gfC', 'std'); setv('gfM', 40); }],
          ['act', () => { sel('gfC', 'odd'); setv('gfM', 18); }],
          ['note', 0, r => [N(r[1]), N(r[2]), N(r[3])]],
          ['act', () => sel('gfC', 'std')],
          ['note', 1, r => [N(r[1]), N(r[2]), N(r[3])]],
          ['note', 2, (r, m) => [m.g1 - m.b1, m.g2 - m.b2, 0]]],
    303: [['act', () => setv('hfA', 60)], ['act', () => chk('hfEq', true)],
          ['act', () => { chk('hfEq', false); setv('hfA', 10); }],
          ['note', 0, r => [N(r[0]), N(r[2]), N(r[3])]],
          ['act', () => setv('hfA', 60)],
          ['note', 1, r => [N(r[0]), N(r[2]), N(r[3])]],
          ['note', 2, (r, m) => [m.r1, m.r2, 0]]],
    304: [['act', () => setv('hmE', 3)], ['act', () => chk('hmOne', true)],
          ['act', () => { chk('hmOne', false); setv('hmE', 0); }],
          ['note', 0, r => [N(r[1]), N(r[2]), N(r[3])]],
          ['act', () => setv('hmE', 5)],
          ['note', 1, r => [N(r[1]), N(r[2]), N(r[3])]],
          ['note', 2, (r, m) => [m.p1, m.p2, 0]]],
    305: [['act', () => setv('cpN', 1000)], ['act', () => chk('cpLog', true)],
          ['act', () => setv('cpN', 100)],
          ['note', 0, r => [N(r[0]), N(r[2]), N(r[3])]],
          ['act', () => setv('cpN', 1000)],
          ['note', 1, r => [N(r[0]), N(r[2]), N(r[3])]],
          ['note', 2, (r, m) => [m.r1, m.r2, 100]]],
    306: [['act', () => sel('srK', 'sorted')], ['act', () => sel('srK', 'rev')],
          ['act', () => sel('srK', 'sorted')],
          ['note', 0, r => [N(r[2]), N(r[3])]],
          ['act', () => sel('srK', 'rev')],
          ['note', 1, (r, m) => [N(r[2]), N(r[3]), N(r[2]) / m.i1]],
          ['note', 2, (r, m) => [m.i1, m.i2, 1]]],
    307: [['act', () => setv('rdS', 5)], ['act', () => chk('rdBad', true)],
          ['act', () => { chk('rdBad', false); setv('rdS', 1); }],
          ['note', 0, r => [N(r[0]), 0]],
          ['act', () => setv('rdS', 5)],
          ['note', 1, r => [N(r[0]), 1]],
          ['note', 2, (r, m) => [m.k1, m.k2, 1]]],
    308: [['act', () => { sel('flK', 'ac'); hit('flCase'); }], ['act', () => sel('flK', 'mt')],
          ['act', () => sel('flK', 'mp')],
          ['note', 0, () => [1, 0]],
          ['act', () => sel('flK', 'ac')],
          ['note', 1, () => [0, 1]],
          ['note', 2, () => [1, 0, 2]]],
    309: [['act', () => setv('ctN', 40)], ['act', () => chk('ctRow', true)],
          ['act', () => { chk('ctRow', false); setv('ctN', 40); }],
          ['note', 0, r => [N(r[0]), N(r[3])]],
          ['act', () => chk('ctRow', true)],
          ['note', 1, (r, m) => [N(r[0]), N(r[3]), N(r[3]) - m.d1]],
          ['note', 2, (r, m) => [m.d1, m.d2, 1]]],
    310: [['act', () => hit('dg2Go')], ['act', () => chk('dg2Bad', true)],
          ['act', () => { chk('dg2Bad', false); hit('dg2Go'); }],
          ['note', 0, r => [N(r[0]), N(r[1])]],
          ['act', () => { setv('dg2N', 5); hit('dg2Go'); }],
          ['note', 1, r => [N(r[0]), N(r[1]), String(r[2]) === '있음' ? 1 : 0]],
          ['note', 2, (r, m) => [m.n1, m.n2, 1]]],
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
        if (no === 301 && k === 0) M.d1 = N(r[2]);
        if (no === 301 && k === 1) M.d2 = N(r[2]);
        if (no === 302 && k === 0) { M.g1 = N(r[2]); M.b1 = N(r[3]); }
        if (no === 302 && k === 1) { M.g2 = N(r[2]); M.b2 = N(r[3]); }
        if (no === 303 && k === 0) { M.r1 = N(r[3]); M.b1 = N(r[2]); }
        if (no === 303 && k === 1) M.r2 = N(r[3]);
        if (no === 304 && k === 0) M.p1 = N(r[3]);
        if (no === 304 && k === 1) M.p2 = N(r[3]);
        if (no === 305 && k === 0) { M.n1 = N(r[0]); M.r1 = N(r[3]); }
        if (no === 305 && k === 1) M.r2 = N(r[3]);
        if (no === 306 && k === 0) { M.i1 = N(r[2]); M.m1 = N(r[3]); }
        if (no === 306 && k === 1) M.i2 = N(r[2]);
        if (no === 307 && k === 0) M.k1 = N(r[0]);
        if (no === 307 && k === 1) M.k2 = N(r[0]);
        if (no === 309 && k === 0) { M.n1 = N(r[0]); M.d1 = N(r[3]); }
        if (no === 309 && k === 1) M.d2 = N(r[3]);
        if (no === 310 && k === 0) { M.n1 = N(r[0]); M.v1 = N(r[1]); }
        if (no === 310 && k === 1) M.n2 = N(r[0]);
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
