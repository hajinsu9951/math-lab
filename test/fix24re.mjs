// LAB24 S2 정규식 복구 (백슬래시 보존)
import fs from 'node:fs';
const P = 'src/40-demos.js';
let s = fs.readFileSync(P, 'utf8');
const i0 = s.indexOf('const MISSIONS=');
const mm = s.slice(i0).match(/^const MISSIONS=\{[\s\S]*?\n\};/);
const M = new Function('return ' + mm[0].slice('const MISSIONS='.length, -1))();
M['24'][1].re = '오차 = 0\\.[0-5]\\d%';
s = s.slice(0, i0) + 'const MISSIONS=' + JSON.stringify(M, null, 1) + ';' + s.slice(i0 + mm[0].length);
fs.writeFileSync(P, s);
const txt = M['24'].map(x => [x.t, x.do, x.hand].filter(Boolean).join('\n')).join('\n');
console.log('L24 S2 re =', JSON.stringify(M['24'][1].re),
  '| 0.54% 매치:', new RegExp(M['24'][1].re).test('오차 = 0.54%'),
  '| 자기일치:', new RegExp(M['24'][1].re).test(txt));
