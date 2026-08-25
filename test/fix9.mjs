import fs from 'node:fs';
const P = 'src/40-demos.js';
let s = fs.readFileSync(P, 'utf8');
const i0 = s.indexOf('const MISSIONS=');
const m = s.slice(i0).match(/^const MISSIONS=\{[\s\S]*?\n\};/);
const M = new Function('return ' + m[0].slice('const MISSIONS='.length, -1))();
M[9][0].re = '실험 확률 \\d';           // 안내문(“실험 확률이 …”)과 구분 — 실행 결과에만 숫자가 붙는다
s = s.slice(0, i0) + 'const MISSIONS=' + JSON.stringify(M, null, 1) + ';' + s.slice(i0 + m[0].length);
fs.writeFileSync(P, s);
console.log('OK:', M[9][0].re);
