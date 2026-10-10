// LAB 261~270 수업 모형을 실제로 돌려 본다 — 사다리가 켜자마자 통과되지 않는지,
// 미션 두 개가 «조작으로» 열리는지, 탐구 노트 세 칸이 화면 값으로 통과되는지.
// 사용: node test/probe-lsn261.mjs [dist/index.html]
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
    261: [['act', () => setv('pcR', 0.9)], ['act', () => hit('pcBest')],
          ['act', () => setv('pcT', 0)],
          ['note', 0, r => [N(r[0]), N(r[1]), N(r[2])]],
          ['act', () => hit('pcBest')],
          ['note', 1, r => [N(r[1]), N(r[2]), N(r[3])]],
          ['note', 2, (r, m) => [m.v1, m.v2, N(r[4])]]],
    262: [['act', () => setv('rtN', 40)], ['act', () => setv('rtR', 1)],
          ['act', () => setv('rtR', 0.9)],
          ['note', 0, r => [N(r[0]), N(r[2]), N(r[3])]],
          ['act', () => setv('rtR', 1)],
          ['note', 1, r => [N(r[0]), N(r[3]), N(r[3]) - 1]],
          ['note', 2, (r, m) => [m.r1, m.r2, 1]]],
    263: [['act', () => setv('psN', 300)], ['act', () => setv('psP', 2)],
          ['act', () => setv('psP', 1)],
          ['note', 0, r => [N(r[0]), N(r[2]), N(r[3])]],
          ['act', () => setv('psP', 2)],
          ['note', 1, r => [N(r[0]), N(r[2]), N(r[3])]],
          ['note', 2, (r, m) => [m.s1, m.s2, 1]]],
    264: [['act', () => setv('rdN', 12)], ['act', () => setv('rdX', 1.2)],
          ['act', () => setv('rdX', 0.5)],
          ['note', 0, r => [N(r[0]), N(r[2]), N(r[3])]],
          ['act', () => setv('rdX', 1.2)],
          ['note', 1, r => [N(r[0]), N(r[2]), N(r[3])]],
          ['note', 2, (r, m) => [m.s1, m.s2, 1]]],
    265: [['act', () => setv('plM', 1)], ['act', () => setv('plT', 0.1)],
          ['act', () => setv('plT', 1.2)],
          ['note', 0, r => [N(r[0]), N(r[1]), N(r[2])]],
          ['act', () => setv('plT', 0.1)],
          ['note', 1, (r, m) => [N(r[1]), N(r[2]), N(r[2]) - m.v1]],
          ['note', 2, (r, m) => [0, m.v1, 0]]],
    266: [['act', () => { setv('ctX', 2); setv('ctY', 2); }], ['act', () => setv('ctB', -1)],
          ['act', () => { setv('ctB', 1); setv('ctX', 0.25); setv('ctY', 0.25); }],
          ['note', 0, r => [N(r[0]), N(r[2]), N(r[3])]],
          ['act', () => { setv('ctX', 2); setv('ctY', 2); }],
          ['note', 1, (r, m) => [N(r[2]), N(r[3]), N(r[3]) / m.g1]],
          ['note', 2, (r, m) => [m.g1, m.g2, 1]]],
    267: [['act', () => sel('pdV', 'y')], ['act', () => sel('pdV', 'b')],
          ['act', () => { sel('pdV', 'x'); setv('pdX', 1); setv('pdY', 0.5); }],
          ['note', 0, r => [N(r[1]), N(r[2]), N(r[3])]],
          ['act', () => { setv('pdX', 2); setv('pdY', 1); }],
          ['note', 1, r => [N(r[1]), N(r[2]), N(r[3])]],
          ['note', 2, (r, m) => [m.fx1, m.fx2, m.fx2 + m.fy2]]],
    268: [['act', () => setv('tpR', 0.2)], ['act', () => chk('tpOne', true)],
          ['act', () => { chk('tpOne', false); setv('tpR', 0.4); }],
          ['note', 0, r => [N(r[1]), N(r[2])]],
          ['act', () => setv('tpR', 0.2)],
          ['note', 1, (r, m) => [N(r[1]), N(r[2]), m.w1 / N(r[2])]],
          ['note', 2, (r, m) => [m.w1, m.w2, 4]]],
    269: [['act', () => setv('gdT', 139)], ['act', () => hit('gdBest')],
          ['act', () => setv('gdT', 0)],
          ['note', 0, r => [N(r[1]), N(r[2]), N(r[3])]],
          ['act', () => hit('gdBest')],
          ['note', 1, r => [N(r[1]), N(r[2]), N(r[3])]],
          ['note', 2, (r, m) => [m.d2, m.gn, 90]]],
    270: [['act', () => setv('sdB', -1)], ['act', () => { setv('sdB', 1); setv('sdC', 2); }],
          ['act', () => { setv('sdC', 0); setv('sdB', -1); }],
          ['note', 0, r => [N(r[0]), N(r[1]), N(r[3])]],
          ['act', () => setv('sdB', 1)],
          ['note', 1, r => [N(r[1]), N(r[2]), N(r[3])]],
          ['note', 2, (r, m) => [m.d1, m.d2, 0]]],
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
        if (no === 261 && k === 0) M.v1 = N(r[2]);
        if (no === 261 && k === 1) M.v2 = N(r[2]);
        if (no === 262 && k === 0) M.r1 = N(r[3]);
        if (no === 262 && k === 1) M.r2 = N(r[3]);
        if ((no === 263 || no === 264) && k === 0) M.s1 = N(r[2]);
        if ((no === 263 || no === 264) && k === 1) M.s2 = N(r[2]);
        if (no === 265 && k === 0) M.v1 = N(r[2]);
        if (no === 266 && k === 0) M.g1 = N(r[3]);
        if (no === 266 && k === 1) M.g2 = N(r[3]);
        if (no === 267 && k === 0) M.fx1 = N(r[2]);
        if (no === 267 && k === 1) { M.fx2 = N(r[2]); M.fy2 = N(r[3]); }
        if (no === 268 && k === 0) M.w1 = N(r[2]);
        if (no === 268 && k === 1) M.w2 = N(r[2]);
        if (no === 269 && k === 0) M.gn = N(r[3]);
        if (no === 269 && k === 1) M.d2 = N(r[2]);
        if (no === 270 && k === 0) M.d1 = N(r[3]);
        if (no === 270 && k === 1) M.d2 = N(r[3]);
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
