// LAB 241~250 수업 모형을 실제로 돌려 본다 — 사다리가 켜자마자 통과되지 않는지,
// 미션 두 개가 «조작으로» 열리는지, 탐구 노트 세 칸이 화면 값으로 통과되는지.
// 사용: node test/probe-lsn241.mjs [dist/index.html]
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
    241: [['act', () => setv('wdK', 28)], ['act', () => setv('wdY', 2028)],
          ['act', () => setv('wdK', 10)],
          ['note', 0, r => [N(r[2]), N(r[3]), N(r[2])]],
          ['act', () => setv('wdK', 28)],
          ['note', 1, r => [N(r[2]), N(r[3]), String(r[1]) === String(r[4]) ? 1 : 0]],
          ['note', 2, (r, m) => [m.rem1, 0, 1]]],
    242: [['act', () => sel('bsB', '60')],
          ['act', () => { sel('bsB', '2'); setv('bsN', 2048); }],
          ['act', () => sel('bsB', '60')],
          ['note', 0, r => [N(r[0]), N(r[1]), N(r[3])]],
          ['act', () => sel('bsB', '2')],
          ['note', 1, (r, m) => [N(r[1]), N(r[3]), N(r[3]) - m.L1]],
          ['note', 2, r => [N(r[0]), N(r[3]), Math.pow(2, N(r[3]) - 1)]]],
    243: [['act', () => setv('mgN', 5)], ['act', () => hit('mgSwap')],
          ['note', 0, r => [N(r[1]), N(r[2]), N(r[1]) / N(r[0])]],
          ['act', () => setv('mgN', 4)],
          ['note', 1, r => [N(r[0]), N(r[1]), N(r[2])]],
          ['note', 2, r => { const n = N(r[0]); return [n, n * (n * n + 1) / 2, N(r[2])]; }]],
    244: [['act', () => chk('piO', true)], ['act', () => setv('piN', 96)],
          ['act', () => setv('piN', 12)],
          ['note', 0, r => [N(r[1]), N(r[2]), N(r[3])]],
          ['act', () => setv('piN', 96)],
          ['note', 1, (r, m) => [N(r[0]), N(r[3]), m.w1 / N(r[3])]],
          ['note', 2, r => [N(r[1]), N(r[2]), 1]]],
    245: [['act', () => setv('apS', 10)], ['act', () => hit('apDh')],
          ['act', () => { hit('apHa'); setv('apS', 13); }],
          ['note', 0, r => [N(r[0]), N(r[1]), N(r[2]), N(r[3])]],
          ['act', () => setv('apS', 10)],
          ['note', 1, r => [N(r[0]), N(r[3]), N(r[0])]],
          ['act', () => hit('apDh')],
          ['note', 2, r => [N(r[0]), N(r[1]), 0]]],
    246: [['act', () => hit('cpBreak')], ['act', () => setv('cpL', 3)],
          ['act', () => { setv('cpL', 1); hit('cpBreak'); }],
          ['note', 0, r => [N(r[0]), N(r[3]), N(r[0]) - N(r[3])]],
          ['act', () => setv('cpL', 3)],
          ['note', 1, (r, m) => [N(r[1]), N(r[4]), m.m1]],
          ['note', 2, (r, m) => [m.m1, m.m2, 1]]],
    247: [['act', () => { setv('iva', 2); setv('ivb', 1); setv('ivc', 4); setv('ivd', 2);
                          setv('ive', 5); setv('ivf', 6); }],
          ['act', () => setv('ivf', 10)],
          ['act', () => { setv('ivc', 1); setv('ivd', 3); setv('ivf', 6); }],
          ['note', 0, r => { const ab = String(r[0]).split(' '), cd = String(r[1]).split(' ');
                             return [+ab[0] * +cd[1], +ab[1] * +cd[0], N(r[2])]; }],
          ['act', () => { setv('ivc', 4); setv('ivd', 2); }],
          ['note', 1, r => { const ab = String(r[0]).split(' '), cd = String(r[1]).split(' ');
                             return [+ab[0] * +cd[1], +ab[1] * +cd[0], N(r[2])]; }],
          ['act', () => setv('ivf', 10)],
          ['note', 2, () => [0, 1, 0]]],
    248: [['act', () => setv('daa', -1)],
          ['act', () => { setv('daa', 1); setv('dab', 1); setv('dad', 0.2); }],
          ['act', () => { setv('dab', 0.5); setv('dad', 1); }],
          ['note', 0, r => [N(r[2]), N(r[3]), N(r[3]) < 1 ? 1 : 0]],
          ['act', () => setv('daa', -1)],
          ['note', 1, r => [N(r[2]), N(r[3]), 1]],
          ['act', () => { setv('daa', 1); setv('dab', 1); setv('dad', 0.2); }],
          ['note', 2, r => [N(r[2]), N(r[3]), 1]]],
    249: [['act', () => setv('egT', 58)], ['act', () => hit('egShow')],
          ['act', () => setv('egT', 10)],
          ['note', 0, r => [N(r[0]), N(r[2]), 1]],
          ['act', () => setv('egT', 58)],
          ['note', 1, r => [N(r[0]), N(r[2]), N(r[3])]],
          ['note', 2, r => [N(r[3]), (5 + Math.sqrt(5)) / 2, 1]]],
    250: [['act', () => setv('mpN', 12)], ['act', () => hit('mpDiag')],
          ['act', () => setv('mpN', 3)],
          ['note', 0, r => [N(r[0]), N(r[2]), N(r[3])]],
          ['act', () => setv('mpN', 12)],
          ['note', 1, r => [N(r[0]), N(r[1]), N(r[3])]],
          ['note', 2, r => [N(r[2]), N(r[2]) - 1, N(r[2]) - 1]]],
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
        if (no === 241 && k === 0) M.rem1 = N(r[3]);
        if (no === 242 && k === 0) M.L1 = N(r[3]);
        if (no === 244 && k === 0) M.w1 = N(r[3]);
        if (no === 246 && k === 0) M.m1 = N(r[4]);
        if (no === 246 && k === 1) M.m2 = N(r[4]);
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
