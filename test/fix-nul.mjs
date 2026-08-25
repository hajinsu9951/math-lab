// 원시 NUL 바이트를 이스케이프 표기로 바꾼다 — 값은 같고 파일은 텍스트로 남는다
import fs from 'node:fs';
const P = 'src/40-demos.js';
let s = fs.readFileSync(P, 'utf8');
const N = String.fromCharCode(0);
const n = s.split(N).length - 1;
const ESC = '\\' + 'u0000';
s = s.split(N).join(ESC);
if (s.includes(N)) throw new Error('남은 NUL 있음');
fs.writeFileSync(P, s, 'utf8');
console.log('원시 NUL', n, '개 교체');
