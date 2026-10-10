// LAB 221~230 수업 모형을 실제로 돌려 본다 — 사다리가 켜자마자 통과되지 않는지,
// 미션 두 개가 «조작으로» 열리는지, 탐구 노트 세 칸이 화면 값으로 통과되는지.
// 사용: node test/probe-lsn221.mjs [dist/index.html]
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
  const chk = (id, v) => { const e = document.getElementById(id); e.checked = v; e.dispatchEvent(new Event('change', { bubbles: true })); };
  const hit = id => document.getElementById(id).click();

  const PLAN = {
    221: [['act', () => setv('sfP', 1)], ['act', () => setv('sfP', 3)],
          ['act', () => setv('sfP', 1)],
          ['note', 0, r => [N(r[1]), N(r[2]), N(r[4])]],
          ['act', () => setv('sfP', 2)],
          ['note', 1, (r, m) => [N(r[1]), N(r[4]), m.e1 / N(r[4])]],
          ['act', () => setv('sfP', 3)],
          ['note', 2, r => [N(r[0]), N(r[4]), N(r[4]) < 0.005 ? 1 : 0]]],
    222: [['act', () => setv('wmN1', 25)], ['act', () => setv('wmN1', 1)],
          ['act', () => setv('wmN1', 10)],
          ['note', 0, r => [N(r[2]), N(r[3]), N(r[4])]],
          ['act', () => setv('wmN1', 25)],
          ['note', 1, r => [N(r[0]), N(r[1]), N(r[4])]],
          ['act', () => setv('wmN1', 1)],
          ['note', 2, r => [N(r[0]), N(r[1]), N(r[2])]]],
    223: [['act', () => setv('mdL', 0)], ['act', () => setv('mdL', 10)],
          ['act', () => setv('mdL', 0)],
          ['note', 0, r => [N(r[1]), N(r[4]), N(r[1]) * N(r[4])]],
          ['act', () => setv('mdL', 10)],
          ['note', 1, r => [N(r[2]), N(r[3]), N(r[4]), N(r[4]) - N(r[3])]],
          ['act', () => setv('mdN', 20)],
          ['note', 2, (r, m) => [N(r[1]), N(r[4]), N(r[4]) > m.t2 ? 1 : 0]]],
    224: [['act', () => { setv('qcP', 5); setv('qcN', 500); hit('qcRun'); }],
          ['act', () => hit('qcBad')],
          ['act', () => hit('qcRun')],
          ['note', 0, r => [N(r[2]), N(r[3]), N(r[4])]],
          ['act', () => hit('qcBad')],
          ['note', 1, (r, m) => [N(r[4]), m.out1, N(r[4]) - m.out1]],
          ['note', 2, r => { const pp = N(r[0]) / 100, n = N(r[1]);
                             return [N(r[2]), Math.sqrt(n * pp * (1 - pp)), N(r[3])]; }]],
    225: [['act', () => setv('mxV2', 200)], ['act', () => setv('mxV2', 0)],
          ['act', () => setv('mxV2', 300)],
          ['note', 0, r => [(N(r[1]) * N(r[0]) + N(r[3]) * N(r[2])) / 100, N(r[0]) + N(r[2]), N(r[4])]],
          ['act', () => setv('mxV2', 200)],
          ['note', 1, r => [N(r[0]), N(r[2]), N(r[4]), 1]],
          ['act', () => setv('mxV2', 0)],
          ['note', 2, r => [N(r[1]), 0, N(r[4])]]],
    226: [['act', () => setv('spS', 0.5)], ['act', () => setv('spM', 103)],
          ['act', () => setv('spM', 100)],
          ['note', 0, r => [N(r[1]), N(r[3]), N(r[4])]],
          ['act', () => setv('spM', 103)],
          ['note', 1, r => [N(r[0]), N(r[1]), N(r[3]), N(r[4])]],
          ['note', 2, (r, m) => [N(r[2]) / (3 * N(r[1])), m.cpk1, m.cpk2]]],
    227: [['act', () => chk('fhIgn', true)], ['act', () => setv('fhA', 65)],
          ['act', () => { chk('fhIgn', false); setv('fhA', 40); setv('fhE', 1.5); }],
          ['note', 0, r => [N(r[1]), N(r[2]), N(r[4])]],
          ['act', () => setv('fhA', 65)],
          ['note', 1, (r, m) => [N(r[1]), N(r[2]), N(r[4]), N(r[4]) - m.h1]],
          ['act', () => setv('fhE', 0)],
          ['note', 2, (r, m) => [0, N(r[4]), m.h2 - N(r[4])]]],
    228: [['act', () => hit('ctNaive')], ['act', () => hit('ctMix')],
          ['note', 0, r => [N(r[3]), N(r[4]), N(r[3]) - N(r[4])]],
          ['act', () => setv('ctL', 500)],
          ['note', 1, r => [N(r[0]), N(r[3]), N(r[4]), N(r[3]) - N(r[4])]],
          ['act', () => { setv('ctL', 400); setv('ctB', 100); }],
          ['note', 2, r => [N(r[0]), N(r[1]), N(r[2]), N(r[4])]]],
    229: [['act', () => hit('pbJust')], ['act', () => hit('pbOver')],
          ['act', () => hit('pbJust')],
          ['note', 0, r => [N(r[1]), N(r[2]), N(r[3])]],
          ['act', () => hit('pbOver')],
          ['note', 1, (r, m) => [N(r[1]), N(r[1]) - m.c1, (N(r[1]) - m.c1) / 20]],
          ['note', 2, (r, m) => [N(r[3]), m.per, 1]]],
    230: [['act', () => setv('gdLat', 60)], ['act', () => setv('gdLat', 0)],
          ['note', 0, r => [N(r[1]), N(r[2]), N(r[1]) - N(r[2])]],
          ['act', () => setv('gdLat', 60)],
          ['note', 1, (r, m) => [N(r[0]), N(r[2]), N(r[2]) / m.kl]],
          ['note', 2, r => [N(r[3]), N(r[4]), 1]]],
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
        if (no === 221 && k === 0) M.e1 = N(r[4]);
        if (no === 223 && k === 1) M.t2 = N(r[4]);
        if (no === 224 && k === 0) M.out1 = N(r[4]);
        if (no === 226 && k === 0) M.cpk1 = N(r[4]);
        if (no === 226 && k === 1) M.cpk2 = N(r[4]);
        if (no === 227 && k === 0) M.h1 = N(r[4]);
        if (no === 227 && k === 1) M.h2 = N(r[4]);
        if (no === 229 && k === 0) M.c1 = N(r[1]);
        if (no === 229 && k === 1) M.per = (N(r[1]) - M.c1) / 20;
        if (no === 230 && k === 0) M.kl = N(r[1]);
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
