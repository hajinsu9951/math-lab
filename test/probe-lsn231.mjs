// LAB 231~240 수업 모형을 실제로 돌려 본다 — 사다리가 켜자마자 통과되지 않는지,
// 미션 두 개가 «조작으로» 열리는지, 탐구 노트 세 칸이 화면 값으로 통과되는지.
// 사용: node test/probe-lsn231.mjs [dist/index.html]
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
    231: [['act', () => chk('ptOpen', false)],
          ['act', () => { chk('ptOpen', true); setv('ptC', 1); }],
          ['note', 0, r => [N(r[3]), N(r[4]), N(r[4]) * 12 - N(r[3])]],
          ['act', () => chk('ptOpen', false)],
          ['note', 1, (r, m) => [N(r[3]), N(r[4]), N(r[3]) - m.a1]],
          ['act', () => chk('ptOpen', true)],
          ['note', 2, r => [N(r[3]), N(r[4]), N(r[4]) * 12 - N(r[3])]]],
    232: [['act', () => setv('glN', 12)], ['act', () => hit('glRect')],
          ['act', () => setv('glN', 4)],
          ['note', 0, r => [N(r[1]), N(r[3]), N(r[4])]],
          ['act', () => setv('glN', 12)],
          ['note', 1, r => [N(r[1]), N(r[3]), N(r[4])]],
          ['note', 2, r => [N(r[3]), N(r[3]) * N(r[3]), N(r[3]) * N(r[3]) - N(r[3])]]],
    233: [['act', () => setv('tsN', 6)], ['act', () => sel('tsK', '5')],
          ['act', () => { sel('tsK', '3'); setv('tsN', 6); }],
          ['note', 0, r => [N(r[0]), N(r[1]), N(r[3])]],
          ['act', () => { sel('tsK', '5'); setv('tsN', 3); }],
          ['note', 1, r => [N(r[1]), N(r[3]), 360 - N(r[3])]],
          ['note', 2, r => [N(r[1]), 360 / N(r[1]), 0]]],
    234: [['act', () => setv('frN', 6)], ['act', () => sel('frK', 'sier')],
          ['act', () => sel('frK', 'koch')],
          ['note', 0, r => [N(r[1]), N(r[2]), Math.pow(4 / 3, 6)]],
          ['act', () => sel('frK', 'sier')],
          ['note', 1, r => [N(r[1]), N(r[3]), Math.pow(3 / 4, 6)]],
          ['act', () => sel('frK', 'koch')],
          ['note', 2, r => [N(r[4]), Math.log(4) / Math.log(3), 1]]],
    235: [['act', () => setv('muS', 7)], ['act', () => sel('muK', '4')],
          ['act', () => { sel('muK', '1'); setv('muS', 7); }],
          ['note', 0, r => [N(r[2]), N(r[3]), N(r[4])]],
          ['act', () => { sel('muK', '3'); setv('muS', 4); }],
          ['note', 1, r => [N(r[2]), N(r[3]), N(r[4])]],
          ['note', 2, (r, m) => [m.c1, m.c2, 100]]],
    236: [['act', () => setv('ppN', 12)], ['act', () => setv('ppV', 180)],
          ['act', () => setv('ppN', 6)],
          ['note', 0, r => [N(r[2]), N(r[3]), N(r[4])]],
          ['act', () => setv('ppN', 12)],
          ['note', 1, r => [N(r[0]), N(r[4]), (4 + (N(r[0]) - 1) * N(r[1])) / 4]],
          ['note', 2, r => [N(r[4]), (4 + (N(r[0]) - 1) * N(r[1])) / 4, 1]]],
    237: [['act', () => setv('syN', 6)], ['act', () => chk('syM', true)],
          ['act', () => chk('syM', false)],
          ['note', 0, r => [N(r[0]), N(r[1]), N(r[3])]],
          ['act', () => chk('syM', true)],
          ['note', 1, (r, m) => [N(r[0]), N(r[3]), N(r[3]) / m.t1]],
          ['note', 2, r => [N(r[0]), N(r[1]), N(r[3])]]],
    238: [['act', () => setv('mcLat', 70)], ['act', () => hit('mcTrue')],
          ['act', () => setv('mcLat', 0)],
          ['note', 0, r => [N(r[1]), N(r[2])]],
          ['act', () => setv('mcLat', 60)],
          ['note', 1, r => [N(r[0]), N(r[1]), N(r[1]) * N(r[1]), N(r[2])]],
          ['note', 2, r => [N(r[3]), N(r[4]), N(r[2])]]],
    239: [['act', () => { chk('ccP', true); setv('ccA', 12); }],
          ['act', () => setv('ccA', 120)],
          ['note', 0, r => [N(r[0]), N(r[2]), N(r[3])]],
          ['act', () => setv('ccA', 12)],
          ['note', 1, (r, m) => [N(r[0]), N(r[2]), N(r[3]), N(r[3]) / m.g1]],
          ['note', 2, (r, m) => [m.g1, m.g2, 1]]],
    240: [['act', () => setv('prR', 1.41)], ['act', () => setv('prN', 4)],
          ['act', () => setv('prR', 1.50)],
          ['note', 0, r => [N(r[0]), N(r[1]), N(r[2])]],
          ['act', () => setv('prR', 1.41)],
          ['note', 1, r => [N(r[0]), N(r[1]), N(r[2]), N(r[0]) * N(r[0])]],
          ['note', 2, r => [N(r[3]), N(r[4]), 100 / Math.pow(2, N(r[3]))]]],
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
        if (no === 231 && k === 0) M.a1 = N(r[3]);
        if (no === 235 && k === 0) M.c1 = N(r[4]);
        if (no === 235 && k === 1) M.c2 = N(r[4]);
        if (no === 237 && k === 0) M.t1 = N(r[3]);
        if (no === 239 && k === 0) M.g1 = N(r[3]);
        if (no === 239 && k === 1) M.g2 = N(r[3]);
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
