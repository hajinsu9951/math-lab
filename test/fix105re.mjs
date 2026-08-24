// LAB105 S5 정규식 복구 (백슬래시 보존)
import fs from 'node:fs';
const P = 'src/40-demos.js';
let s = fs.readFileSync(P, 'utf8');
const i0 = s.indexOf('const MISSIONS=');
const mm = s.slice(i0).match(/^const MISSIONS=\{[\s\S]*?\n\};/);
const M = new Function('return ' + mm[0].slice('const MISSIONS='.length, -1))();
M['105'][4].re = '이하 — \\d+년째 도달';
s = s.slice(0, i0) + 'const MISSIONS=' + JSON.stringify(M, null, 1) + ';' + s.slice(i0 + mm[0].length);
fs.writeFileSync(P, s);
const txt = M['105'].map(x => [x.t, x.do, x.hand].filter(Boolean).join('\n')).join('\n');
console.log('re =', JSON.stringify(M['105'][4].re),
  '| 매치:', new RegExp(M['105'][4].re).test('10세대 이하 — 13년째 도달.'),
  '| 자기일치:', new RegExp(M['105'][4].re).test(txt));
