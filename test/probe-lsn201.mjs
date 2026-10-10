// LAB 201~210 수업 모형을 실제로 돌려 본다 — 사다리가 켜자마자 통과되지 않는지,
// 미션 두 개가 «조작으로» 열리는지, 탐구 노트 세 칸이 화면 값으로 통과되는지.
// 사용: node test/probe-lsn201.mjs [dist/index.html]
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
  // 사다리는 MutationObserver 로 움직인다 — 조작마다 한 틱 쉬어 주어야 판정이 돈다
  const wait = ms => new Promise(r => setTimeout(r, ms));
  const N = v => { const m = String(v == null ? '' : v).replace(/,/g, '').match(/-?\d+(\.\d+)?/); return m ? +m[0] : NaN; };
  const setv = (id, v) => { const e = document.getElementById(id); e.value = v; e.dispatchEvent(new Event('input', { bubbles: true })); };
  const sel = (id, v) => { const e = document.getElementById(id); e.value = v; e.dispatchEvent(new Event('change', { bubbles: true })); };
  const hit = id => document.getElementById(id).click();

  // 각 실험실의 «학생이 하는 일» — 미션 둘을 연 뒤, 칸마다 상태를 되돌려 노트를 채운다
  const PLAN = {
    201: [['act', () => hit('blFitA')], ['act', () => hit('blFitAB')],
          ['act', () => hit('blFitA')], ['note', 0, r => [N(r[0]), N(r[1]), N(r[2])], m => m.l0 = N],
          ['act', () => hit('blFitAB')],
          ['note', 1, (r, m) => [N(r[0]), N(r[2]), m.l0 - N(r[2])]],
          ['note', 2, r => [N(r[0]), N(r[1]), N(r[0]) * 3 + N(r[1])]]],
    202: [['act', () => setv('apK', 1)], ['act', () => hit('apDay')],
          ['act', () => setv('apK', 1)], ['note', 0, r => [N(r[2]), N(r[3])]],
          ['act', () => hit('apDay')],
          ['note', 1, r => [N(r[2]), N(r[4]), N(r[4]) - N(r[2])]],
          ['note', 2, (r, m) => [m.e1, N(r[2]), 1]]],
    203: [['act', () => hit('tbJust')], ['act', () => hit('tbOver')],
          ['act', () => hit('tbJust')], ['note', 0, r => [N(r[0]), N(r[1]), N(r[2])]],
          ['act', () => hit('tbOver')],
          ['note', 1, (r, m) => [N(r[0]), N(r[1]), N(r[1]) - m.t1]],
          ['note', 2, (r, m) => [m.i2 - m.i1, m.t2 - m.t1, (m.t2 - m.t1) / (m.i2 - m.i1) * 100]]],
    204: [['act', () => setv('fxS', 0)], ['act', () => setv('fxS', 2)],
          ['act', () => setv('fxS', 0)], ['note', 0, r => [N(r[3]), N(r[4]), N(r[4]) - N(r[3])]],
          ['act', () => setv('fxS', 2)],
          ['note', 1, r => [N(r[2]), N(r[3]), N(r[4]), N(r[4]) - N(r[3])]],
          ['note', 2, r => [N(r[0]), N(r[1]), N(r[0]) / N(r[1])]]],
    205: [['act', () => setv('cpR', 3)], ['act', () => setv('cpR', 0)],
          ['act', () => setv('cpR', 3)], ['note', 0, r => [N(r[3]), N(r[4])]],
          ['act', () => setv('cpR', 0)],
          ['note', 1, r => [N(r[0]), N(r[1]), N(r[3]), N(r[4])]],
          ['note', 2, r => [N(r[3]), N(r[4]), N(r[4]) < 10000 ? 1 : 0]]],
    206: [['act', () => hit('pvCmp')], ['act', () => setv('pvN', 1)],
          ['act', () => setv('pvN', 3)], ['note', 0, r => [N(r[2]), N(r[3]), N(r[2]) + N(r[3])]],
          ['act', () => setv('pvN', 1)],
          ['note', 1, r => [N(r[0]), N(r[1]), N(r[2])]],
          ['note', 2, (r, m) => [m.v1, m.v2, 1]]],
    207: [['act', () => setv('sdP', 1)], ['act', () => hit('sdEq')],
          ['act', () => setv('sdP', 1)], ['note', 0, r => [N(r[0]), N(r[1]), N(r[2]), N(r[3])]],
          ['act', () => hit('sdEq')],
          ['note', 1, r => [N(r[0]), N(r[1]), N(r[2]), N(r[3])]],
          ['note', 2, r => [N(r[4]), N(r[4]), 1]]],
    208: [['act', () => hit('elTop')], ['act', () => setv('elP', 13)],
          ['act', () => hit('elTop')], ['note', 0, r => [N(r[0]), N(r[2]), N(r[3])]],
          ['act', () => setv('elP', 13)],
          ['note', 1, (r, m) => [N(r[0]), N(r[2]), N(r[3]), m.rev1 - N(r[2])]],
          ['act', () => hit('elTop')],
          ['note', 2, r => [N(r[0]), N(r[3]), 1]]],
    209: [['act', () => hit('pcHard')], ['act', () => hit('pcOff')],
          ['act', () => hit('pcHard')], ['note', 0, r => [N(r[0]), N(r[1]), N(r[2]), N(r[3])]],
          ['act', () => hit('pcOff')],
          ['note', 1, r => [N(r[0]), N(r[1]), N(r[2]), N(r[3])]],
          ['note', 2, (r, m) => [m.s1, 0, 1]]],
    210: [['act', () => setv('ocX', 85)], ['act', () => sel('ocK', 'line')],
          ['act', () => { sel('ocK', 'curve'); setv('ocX', 30); }],
          ['note', 0, r => [N(r[0]), N(r[1]), N(r[2]), N(r[3])]],
          ['act', () => setv('ocX', 85)],
          ['note', 1, (r, m) => [N(r[0]), N(r[3]), N(r[3]) - m.o1]],
          ['act', () => sel('ocK', 'line')],
          ['note', 2, r => [N(r[3]), 0.75, 1]]],
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
      let step = 0;
      for (const s of PLAN[no]) {
        step++;
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
        // 다음 칸이 쓸 값을 받아 둔다
        if (no === 201 && k === 0) M.l0 = N(r[2]);
        if (no === 202 && k === 0) M.e1 = N(r[2]);
        if (no === 203 && k === 0) { M.t1 = N(r[1]); M.i1 = N(r[0]); }
        if (no === 203 && k === 1) { M.t2 = N(r[1]); M.i2 = N(r[0]); }
        if (no === 206 && k === 0) M.v1 = N(r[2]);
        if (no === 206 && k === 1) M.v2 = N(r[2]);
        if (no === 208 && k === 0) M.rev1 = N(r[2]);
        if (no === 209 && k === 0) M.s1 = N(r[3]);
        if (no === 210 && k === 0) M.o1 = N(r[3]);
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
