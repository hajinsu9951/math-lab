// LAB 271~280 수업 모형을 실제로 돌려 본다 — 사다리가 켜자마자 통과되지 않는지,
// 미션 두 개가 «조작으로» 열리는지, 탐구 노트 세 칸이 화면 값으로 통과되는지.
// 사용: node test/probe-lsn271.mjs [dist/index.html]
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
    271: [['act', () => hit('lgBest')], ['act', () => setv('lgT', 243)],
          ['act', () => setv('lgT', 0)],
          ['note', 0, r => [N(r[1]), N(r[2]), N(r[3])]],
          ['act', () => hit('lgBest')],
          ['note', 1, r => [N(r[1]), N(r[2]), N(r[3])]],
          ['note', 2, (r, m) => [m.v1, m.v2, m.v2 / m.R]]],
    272: [['act', () => { sel('diO', 'xy'); chk('diKeep', true); }],
          ['act', () => chk('diKeep', false)],
          ['note', 0, r => [N(r[2]), N(r[3])]],
          ['act', () => chk('diKeep', true)],
          ['note', 1, (r, m) => [N(r[2]), N(r[3]), N(r[2]) / m.v1]],
          ['note', 2, (r, m) => [m.v1, m.v2, m.v1]]],
    273: [['act', () => setv('jcN', 20)], ['act', () => chk('jcNo', true)],
          ['act', () => chk('jcNo', false)],
          ['note', 0, r => [N(r[1]), N(r[3]), N(r[4])]],
          ['act', () => chk('jcNo', true)],
          ['note', 1, r => [N(r[3]), N(r[4]), N(r[3]) / N(r[4])]],
          ['note', 2, (r, m) => [m.v1, m.v2, m.v2 / m.v1]]],
    274: [['act', () => { setv('liA', 0); setv('liS', 50); }], ['act', () => chk('liAbs', true)],
          ['act', () => chk('liAbs', false)],
          ['note', 0, r => [N(r[0]), N(r[1]), N(r[3])]],
          ['act', () => setv('liS', 100)],
          ['note', 1, (r, m) => [N(r[1]), N(r[3]), N(r[3]) - m.v1]],
          ['note', 2, (r, m) => [m.v1, m.v2, 0.4 * Math.PI * 1.6 * 1.2]]],
    275: [['act', () => setv('csK', 1)], ['act', () => { setv('csK', 0); setv('csB', 1); }],
          ['act', () => setv('csK', 1)],
          ['note', 0, r => [N(r[0]), N(r[2]), N(r[3])]],
          ['act', () => setv('csK', 0)],
          ['note', 1, r => [N(r[2]), N(r[3]), N(r[4])]],
          ['note', 2, (r, m) => [m.g1, m.g2, 0]]],
    276: [['act', () => setv('grT', 100)], ['act', () => chk('grRev', true)],
          ['act', () => chk('grRev', false)],
          ['note', 0, r => [N(r[0]), N(r[3]), N(r[4])]],
          ['act', () => chk('grRev', true)],
          ['note', 1, r => [N(r[3]), N(r[4]), 1]],
          ['note', 2, (r, m) => [m.v1, m.v2, m.v1 + m.v2]]],
    277: [['act', () => setv('cvR3', 1)], ['act', () => setv('cvR3', 2)],
          ['note', 0, r => [N(r[3]), N(r[4])]],
          ['act', () => setv('cvR3', 1)],
          ['note', 1, (r, m) => [N(r[3]), N(r[4]), m.s1 - N(r[4])]],
          ['note', 2, (r, m) => [m.p1, 1, 1]]],
    278: [['act', () => setv('mnT3', -0.25)], ['act', () => chk('mnAbs', true)],
          ['act', () => { chk('mnAbs', false); setv('mnT3', 1); }],
          ['note', 0, r => [N(r[3]), N(r[4])]],
          ['act', () => setv('mnT3', -0.25)],
          ['note', 1, r => [N(r[3]), N(r[4]), 1]],
          ['note', 2, (r, m) => [m.p1, -1, 1]]],
    279: [['act', () => { setv('ceX', 1.9); setv('ceY', -1.3); }],
          ['act', () => { setv('ceX', 0.4); setv('ceY', -0.4); }],
          ['note', 0, r => [N(r[1]), N(r[2])]],
          ['act', () => { setv('ceX', 1.9); setv('ceY', -1.3); }],
          ['note', 1, (r, m) => [N(r[1]), N(r[2]), m.s1 - N(r[2])]],
          ['note', 2, (r, m) => [m.s1, N(r[2]), 2]]],
    280: [['act', () => { setv('elX', 0.4); setv('elY', -0.4); }],
          ['act', () => { setv('elX', 1.9); setv('elY', -1.3); }],
          ['act', () => { setv('elX', 2.0); setv('elY', 1.8); }],
          ['note', 0, r => [N(r[1]), N(r[2]), N(r[4])]],
          ['act', () => { setv('elX', 0.4); setv('elY', -0.4); }],
          ['note', 1, r => [N(r[1]), N(r[2]), N(r[4])]],
          ['note', 2, (r, m) => [m.gh / m.og, m.gh2 / m.og2, 3.6]]],
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
        if (no === 271 && k === 0) { M.v1 = N(r[2]); M.R = N(r[0]); }
        if (no === 271 && k === 1) M.v2 = N(r[2]);
        if (no === 272 && k === 0) M.v1 = N(r[2]);
        if (no === 272 && k === 1) M.v2 = N(r[2]);
        if (no === 273 && k === 0) M.v1 = N(r[3]);
        if (no === 273 && k === 1) M.v2 = N(r[3]);
        if (no === 274 && k === 0) M.v1 = N(r[3]);
        if (no === 274 && k === 1) M.v2 = N(r[3]);
        if (no === 275 && k === 0) M.g1 = N(r[4]);
        if (no === 275 && k === 1) M.g2 = N(r[4]);
        if (no === 276 && k === 0) M.v1 = N(r[3]);
        if (no === 276 && k === 1) M.v2 = N(r[3]);
        if (no === 277 && k === 0) { M.p1 = N(r[3]); M.s1 = N(r[4]); }
        if (no === 278 && k === 0) { M.p1 = N(r[3]); M.d1 = N(r[4]); }
        if (no === 279 && k === 0) M.s1 = N(r[2]);
        if (no === 280 && k === 0) { M.og = N(r[1]); M.gh = N(r[2]); }
        if (no === 280 && k === 1) { M.og2 = N(r[1]); M.gh2 = N(r[2]); }
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
