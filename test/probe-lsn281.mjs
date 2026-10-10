// LAB 281~290 수업 모형을 실제로 돌려 본다 — 사다리가 켜자마자 통과되지 않는지,
// 미션 두 개가 «조작으로» 열리는지, 탐구 노트 세 칸이 화면 값으로 통과되는지.
// 사용: node test/probe-lsn281.mjs [dist/index.html]
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
    281: [['act', () => hit('pwTan')], ['act', () => setv('pwD', 0.5)],
          ['act', () => setv('pwD', 2.2)],
          ['note', 0, r => [N(r[0]), N(r[2]), N(r[3])]],
          ['act', () => setv('pwA', 90)],
          ['note', 1, (r, m) => [N(r[1]), N(r[2]), N(r[2]) - m.p1]],
          ['note', 2, (r, m) => [m.p1, m.p2, 0.25 - 1.69]]],
    282: [['act', () => setv('rxPx', 0.2)], ['act', () => setv('rxD', 4)],
          ['note', 0, r => [N(r[1]), N(r[2]), N(r[3])]],
          ['act', () => { setv('rxD', 1.8); setv('rxPx', 0.2); }],
          ['note', 1, r => [N(r[1]), N(r[2]), N(r[3])]],
          ['note', 2, (r, m) => [m.g1, m.g2, 0]]],
    283: [['act', () => setv('inC', 1)], ['act', () => setv('inC', 0)],
          ['act', () => setv('inC', 1)],
          ['note', 0, r => [N(r[0]), N(r[1]), N(r[3])]],
          ['act', () => setv('inC', 0.5)],
          ['note', 1, (r, m) => [N(r[1]), N(r[3]), N(r[3]) / m.rad1]],
          ['note', 2, (r, m) => [m.rad1, m.rad2, 2]]],
    284: [['act', () => setv('isC', 0)], ['act', () => setv('isC', 1)],
          ['note', 0, r => [N(r[0]), N(r[1])]],
          ['act', () => setv('isC', 0)],
          ['note', 1, r => [N(r[0]), 1]],
          ['note', 2, (r, m) => [m.c1, m.c2, 1]]],
    285: [['act', () => setv('crA', 40)], ['act', () => setv('crH', 1.3)],
          ['act', () => setv('crA', 0)],
          ['note', 0, r => [N(r[0]), N(r[1]), N(r[2])]],
          ['act', () => setv('crA', 40)],
          ['note', 1, (r, m) => [N(r[0]), N(r[2]), N(r[2]) - m.cr1]],
          ['note', 2, (r, m) => [m.cr1, m.cr2, 1]]],
    286: [['act', () => setv('pnd', 0)], ['act', () => setv('pnd', 5)],
          ['act', () => setv('pnd', 2)],
          ['note', 0, r => [N(r[1]), N(r[2])]],
          ['act', () => setv('pnd', 5)],
          ['note', 1, (r, m) => [N(r[1]), N(r[2]), N(r[2]) / m.dist1]],
          ['note', 2, (r, m) => [m.dist1, m.dist2, Math.abs(m.d2) / m.dist2]]],
    287: [['act', () => chk('paRaw', true)], ['act', () => chk('paFlip', true)],
          ['act', () => chk('paFlip', false)],
          ['note', 0, r => [N(r[2]), N(r[3])]],
          ['act', () => chk('paFlip', true)],
          ['note', 1, (r, m) => [N(r[2]), N(r[3]), N(r[2]) + m.raw1]],
          ['note', 2, (r, m) => [m.raw1, m.raw2, 180]]],
    288: [['act', () => sel('qsK', 'hyp')],
          ['act', () => { sel('qsK', 'hy1'); setv('qsZ', 2); }],
          ['act', () => { sel('qsK', 'par'); setv('qsZ', 1); }],
          ['note', 0, r => [N(r[1]), N(r[3])]],
          ['act', () => setv('qsZ', 2)],
          ['note', 1, r => [N(r[1]), N(r[3]), N(r[3]) * N(r[3])]],
          ['note', 2, (r, m) => [m.r1, m.r2, Math.sqrt(5)]]],
    289: [['act', () => setv('rvT', 100)], ['act', () => sel('rvA', 'x')],
          ['act', () => sel('rvA', 'y')],
          ['note', 0, r => [N(r[2]), 2]],
          ['act', () => sel('rvA', 'x')],
          ['note', 1, () => [1.2, 0.8]],
          ['note', 2, () => [2, 1.2, 0]]],
    290: [['act', () => { setv('spL', 5); setv('spW', 60); }],
          ['act', () => chk('spFlat', true)],
          ['act', () => chk('spFlat', false)],
          ['note', 0, r => [N(r[2]), N(r[3])]],
          ['act', () => chk('spFlat', true)],
          ['note', 1, (r, m) => [N(r[2]), N(r[3]), m.s1 - N(r[2])]],
          ['note', 2, (r, m) => [m.s1, m.s2, 180]]],
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
        if (no === 281 && k === 0) { M.p1 = N(r[2]); M.a1 = N(r[1]); }
        if (no === 281 && k === 1) M.p2 = N(r[2]);
        if (no === 282 && k === 0) M.g1 = N(r[3]);
        if (no === 282 && k === 1) M.g2 = N(r[3]);
        if (no === 283 && k === 0) { M.c1 = N(r[1]); M.rad1 = N(r[3]); }
        if (no === 283 && k === 1) M.rad2 = N(r[3]);
        if (no === 284 && k === 0) M.c1 = N(r[0]);
        if (no === 284 && k === 1) M.c2 = N(r[0]);
        if (no === 285 && k === 0) M.cr1 = N(r[1]);
        if (no === 285 && k === 1) M.cr2 = N(r[2]);
        if (no === 286 && k === 0) { M.d1 = N(r[1]); M.dist1 = N(r[2]); }
        if (no === 286 && k === 1) { M.d2 = N(r[1]); M.dist2 = N(r[2]); }
        if (no === 287 && k === 0) M.raw1 = N(r[2]);
        if (no === 287 && k === 1) M.raw2 = N(r[2]);
        if (no === 288 && k === 0) { M.z1 = N(r[1]); M.r1 = N(r[3]); }
        if (no === 288 && k === 1) M.r2 = N(r[3]);
        if (no === 290 && k === 0) M.s1 = N(r[2]);
        if (no === 290 && k === 1) M.s2 = N(r[2]);
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
