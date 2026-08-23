// LAB40 S5 신호 수정 — 중앙값 63 → 65
import fs from 'node:fs';
const P = 'src/40-demos.js';
let s = fs.readFileSync(P, 'utf8');
const i0 = s.indexOf('const MISSIONS=');
const mm = s.slice(i0).match(/^const MISSIONS=\{[\s\S]*?\n\};/);
const M = new Function('return ' + mm[0].slice('const MISSIONS='.length, -1))();
M['40'][4].re = '중앙값: 65';
s = s.slice(0, i0) + 'const MISSIONS=' + JSON.stringify(M, null, 1) + ';' + s.slice(i0 + mm[0].length);
fs.writeFileSync(P, s);
console.log('LAB40 S5 re → 중앙값: 65');
