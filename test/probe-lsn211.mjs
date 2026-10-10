// LAB 211~220 수업 모형을 실제로 돌려 본다 — 사다리가 켜자마자 통과되지 않는지,
// 미션 두 개가 «조작으로» 열리는지, 탐구 노트 세 칸이 화면 값으로 통과되는지.
// 사용: node test/probe-lsn211.mjs [dist/index.html]
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
  const hit = id => document.getElementById(id).click();

  const PLAN = {
    211: [['act', () => { setv('beV', 4); setv('beP', 3); }],
          ['act', () => { setv('beF', 10); setv('beV', 1); setv('beP', 14); }],
          ['act', () => { setv('beF', 60); setv('beV', 4); setv('beP', 7); }],
          ['note', 0, r => [N(r[0]), N(r[3]), N(r[4])]],
          ['act', () => setv('beF', 120)],
          ['note', 1, (r, m) => [N(r[0]), N(r[4]), N(r[4]) / m.be1]],
          ['act', () => setv('beP', 3)],
          ['note', 2, r => [N(r[2]), N(r[1]), N(r[3])]]],
    212: [['act', () => hit('dvMin')], ['act', () => setv('dvC', -50)],
          ['act', () => setv('dvW', 100)],
          ['note', 0, r => [N(r[2]), N(r[3])]],
          ['act', () => hit('dvMin')],
          ['note', 1, (r, m) => [N(r[0]), N(r[2]), N(r[3]), m.s1 - N(r[3])]],
          ['act', () => { setv('dvC', -100); hit('dvMin'); }],
          ['note', 2, r => [N(r[1]), N(r[0]), N(r[3])]]],
    213: [['act', () => setv('raS', 0)], ['act', () => setv('raS', 60)],
          ['act', () => setv('raS', 0)],
          ['note', 0, r => [N(r[2]), N(r[3]), N(r[4])]],
          ['act', () => setv('raS', 60)],
          ['note', 1, r => [N(r[0]), N(r[2]), N(r[3]), N(r[2]) - N(r[3])]],
          ['note', 2, r => [N(r[4]), 100 - N(r[4]), 1]]],
    214: [['act', () => hit('giEq')], ['act', () => hit('giBad')],
          ['act', () => hit('giEq')],
          ['note', 0, r => [N(r[1]), N(r[2])]],
          ['act', () => hit('giBad')],
          ['note', 1, r => [N(r[1]), (0.5 - N(r[1])) / 0.5, N(r[2])]],
          ['note', 2, (r, m) => [m.a1, m.a2, 1]]],
    215: [['act', () => setv('grG', 8)], ['act', () => setv('grI', 8)],
          ['act', () => setv('grI', 3)],
          ['note', 0, r => [N(r[3]), N(r[4])]],
          ['note', 1, r => [N(r[3]) / N(r[4]), Math.pow(1 + N(r[1]) / 100, N(r[2]))]],
          ['act', () => setv('grI', 8)],
          ['note', 2, r => [N(r[0]), N(r[1]), N(r[4])]]],
    216: [['act', () => hit('dpMid')], ['act', () => setv('dpR', 35)],
          ['act', () => setv('dpR', 25)],
          ['note', 0, r => [N(r[3]), N(r[4]), N(r[3]) - N(r[4])]],
          ['act', () => setv('dpR', 40)],
          ['note', 1, (r, m) => [N(r[1]), N(r[4]), m.geo1 - N(r[4])]],
          ['act', () => hit('dpMid')],
          ['note', 2, r => [N(r[1]), N(r[3]), N(r[4])]]],
    217: [['act', () => { hit('ucStep'); hit('ucStep'); }], ['act', () => hit('ucFlip')],
          ['act', () => { hit('ucRst'); hit('ucStep'); hit('ucStep'); }],
          ['note', 0, r => [N(r[2]), N(r[4]), N(r[2]) - N(r[4])]],
          ['act', () => hit('ucFlip')],
          ['note', 1, (r, m) => [N(r[2]), m.v1, N(r[2]) / m.v1]],
          ['act', () => { hit('ucRst'); hit('ucStep'); hit('ucStep'); }],
          ['note', 2, r => [1, N(r[2]), 1]]],
    218: [['act', () => setv('scS', 50)], ['act', () => setv('scS', 150)],
          ['act', () => setv('scS', 50)],
          ['note', 0, r => [N(r[2]), N(r[3]), N(r[4])]],
          ['act', () => setv('scS', 150)],
          ['note', 1, (r, m) => [150, N(r[4]), N(r[4]) / m.a1]],
          ['note', 2, () => [150, 150 * 150, 150]]],
    219: [['act', () => setv('diB', 30)], ['act', () => hit('diSame')],
          ['note', 0, r => [N(r[2]), N(r[3]), N(r[4])]],
          ['note', 1, r => [1 - N(r[0]) / 100, 1 - N(r[1]) / 100,
                            (1 - N(r[0]) / 100) * (1 - N(r[1]) / 100)]],
          ['note', 2, r => [N(r[3]), N(r[4]), 1]]],
    220: [['act', () => hit('mtWrong')], ['act', () => setv('mtL', 35)],
          ['act', () => setv('mtL', 20)],
          ['note', 0, r => [N(r[2]), N(r[3]), N(r[4])]],
          ['act', () => setv('mtL', 35)],
          ['note', 1, r => [N(r[1]), N(r[2]), N(r[3]), N(r[4])]],
          ['note', 2, r => [N(r[0]), 1 - N(r[1]) / 100, N(r[0]) / (1 - N(r[1]) / 100)]]],
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
        if (no === 211 && k === 0) { M.F1 = N(r[0]); M.cm1 = N(r[3]); M.be1 = N(r[4]); }
        if (no === 212 && k === 0) M.s1 = N(r[3]);
        if (no === 214 && k === 0) M.a1 = N(r[1]);
        if (no === 214 && k === 1) M.a2 = N(r[1]);
        if (no === 216 && k === 0) M.geo1 = N(r[4]);
        if (no === 217 && k === 0) M.v1 = N(r[2]);
        if (no === 218 && k === 0) M.a1 = N(r[4]);
        if (no === 220 && k === 0) M.d1 = N(r[4]);
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
