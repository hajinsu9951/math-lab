// LAB 251~260 수업 모형을 실제로 돌려 본다 — 사다리가 켜자마자 통과되지 않는지,
// 미션 두 개가 «조작으로» 열리는지, 탐구 노트 세 칸이 화면 값으로 통과되는지.
// 사용: node test/probe-lsn251.mjs [dist/index.html]
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
    251: [['act', () => setv('fbN', 12)], ['act', () => hit('fbBinet')],
          ['act', () => setv('fbN', 3)],
          ['note', 0, r => [N(r[0]), N(r[1]), N(r[2])]],
          ['act', () => setv('fbN', 12)],
          ['note', 1, r => [N(r[0]), N(r[1]), N(r[3])]],
          ['note', 2, r => [N(r[1]), N(r[3]), N(r[1]) - N(r[3])]]],
    252: [['act', () => setv('gsK', 4)], ['act', () => setv('gsP', 0)],
          ['act', () => { setv('gsP', 2); setv('gsK', 0); }],
          ['note', 0, r => [N(r[0]), N(r[2])]],
          ['act', () => setv('gsK', 4)],
          ['note', 1, (r, m) => [N(r[0]), N(r[2]), N(r[2]) - m.z1]],
          ['act', () => setv('gsP', 0)],
          ['note', 2, r => [N(r[0]), N(r[2]), 1]]],
    253: [['act', () => { setv('spvx', 2); setv('spvy', 1); }],
          ['act', () => { setv('spvx', -1); setv('spvy', 2); setv('spt', 1); }],
          ['note', 0, r => [N(r[0]), N(r[1]), N(r[2])]],
          ['act', () => { setv('spvx', 2); setv('spvy', 1); }],
          ['note', 1, r => [N(r[0]), N(r[1]), N(r[2])]],
          ['note', 2, (r, m) => [m.d1, 0, 2]]],
    254: [['act', () => setv('sbB', 0)],
          ['act', () => { setv('sbB', 2); setv('sbC', 2); }],
          ['note', 0, r => [N(r[0]), N(r[1]), 0]],
          ['act', () => setv('sbB', 0)],
          ['note', 1, r => [0, String(r[2]) === '통과' ? 1 : 0, String(r[3]) === '통과' ? 1 : 0]],
          ['note', 2, () => [0, 0, 1]]],
    255: [['act', () => { setv('dmN', 3); chk('dm3P', true); }], ['act', () => setv('dmN', 4)],
          ['act', () => setv('dmN', 2)],
          ['note', 0, r => [N(r[0]), N(r[2])]],
          ['act', () => setv('dmN', 3)],
          ['note', 1, r => [N(r[0]), N(r[2]), N(r[0]) - N(r[2])]],
          ['act', () => setv('dmN', 4)],
          ['note', 2, r => [N(r[0]), N(r[2]), N(r[0]) - N(r[2])]]],
    256: [['act', () => { setv('b2ax', 2); setv('b2by', 2); }],
          ['act', () => { setv('b2bx', 2); setv('b2by', 0); }],
          ['act', () => { setv('b2ax', 1); setv('b2ay', 0); setv('b2bx', 0); setv('b2by', 1); }],
          ['note', 0, r => [N(r[0]), N(r[3]), 1]],
          ['act', () => { setv('b2ax', 2); setv('b2by', 2); setv('b2bx', 0); }],
          ['note', 1, r => [N(r[0]), N(r[3]), 0]],
          ['act', () => { setv('b2bx', 2); setv('b2by', 0); }],
          ['note', 2, r => [N(r[0]), 0, 0]]],
    257: [['act', () => setv('ltH', 0.8)],
          ['act', () => { setv('ltA', 45); setv('ltS', 1.8); }],
          ['act', () => { setv('ltA', 0); setv('ltS', 1); setv('ltH', 0.8); }],
          ['note', 0, r => [N(r[0]), N(r[1]), N(r[4])]],
          ['act', () => { setv('ltA', 45); setv('ltS', 1.8); }],
          ['note', 1, r => [N(r[0]), N(r[1]), N(r[4])]],
          ['act', () => { setv('ltA', 0); setv('ltS', 1); }],
          ['note', 2, r => [N(r[2]), N(r[3]), 1]]],
    258: [['act', () => setv('mkN', 3)], ['act', () => setv('mkN', 20)],
          ['act', () => setv('mkN', 3)],
          ['note', 0, r => [N(r[1]), N(r[2]), N(r[3])]],
          ['act', () => setv('mkN', 20)],
          ['note', 1, r => [N(r[1]), N(r[2]), Math.abs(N(r[2]) - N(r[3]))]],
          ['act', () => setv('mkS', 0)],
          ['note', 2, r => [N(r[0]), N(r[2]), N(r[3])]]],
    259: [['act', () => setv('gmT', 1)], ['act', () => setv('gmT', 1.5)],
          ['act', () => setv('gmT', 0)],
          ['note', 0, r => [N(r[1]), N(r[2]), N(r[3])]],
          ['act', () => setv('gmT', 1)],
          ['note', 1, r => [N(r[1]), N(r[2]), N(r[3])]],
          ['act', () => setv('gmT', 1.5)],
          ['note', 2, r => [N(r[1]), N(r[2]), N(r[2]) < 0 ? 1 : 0]]],
    260: [['act', () => { setv('lsA', -1); setv('lsB', -2); setv('lsY', 8); }],
          ['act', () => hit('lsBest')],
          ['act', () => { setv('lsA', -1); setv('lsB', -2); }],
          ['note', 0, r => [N(r[2]), N(r[3]), N(r[4])]],
          ['act', () => hit('lsBest')],
          ['note', 1, r => [N(r[2]), N(r[3]), N(r[4])]],
          ['note', 2, (r, m) => [m.sse1, m.sse2, 1]]],
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
        if (no === 252 && k === 0) M.z1 = N(r[2]);
        if (no === 253 && k === 0) M.d1 = N(r[2]);
        if (no === 260 && k === 0) M.sse1 = N(r[2]);
        if (no === 260 && k === 1) M.sse2 = N(r[2]);
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
