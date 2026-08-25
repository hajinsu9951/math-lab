// LAB 253 — 지시한 값 (4, 2) 가 슬라이더 범위(−3~3) 밖이라 닿을 수 없었다.
// 같은 뜻(u 와 나란한 v)을 범위 안의 값 (−2, −1) 로 바꾼다.
import fs from 'node:fs';
const P = 'src/40-demos.js';
let s = fs.readFileSync(P, 'utf8');
const i0 = s.indexOf('const MISSIONS=');
const mm = s.slice(i0).match(/^const MISSIONS=\{[\s\S]*?\n\};/);
const M = new Function('return ' + mm[0].slice('const MISSIONS='.length, -1))();

const a = M['253'][1], b = M['253'][2];
if (!/4, 2/.test(a.t)) throw new Error('2단계 앵커 실패: ' + a.t);
a.t = '오늘의 문제 — v 를 (−2, −1) 로 맞추세요. 갈 수 있는 곳이 어떻게 되나요?';
a.do = '① v 의 x 를 −2 로 ② v 의 y 를 −1 로 ③ 판정값 확인';
b.t = '평면 되찾기 — v 를 (−1, 2) 로 되돌리고 v 에 곱할 수를 1 로 올리세요.';
b.do = '① v 의 x 를 −1 로 ② v 의 y 를 2 로 ③ 곱할 수를 1 로';

s = s.slice(0, i0) + 'const MISSIONS=' + JSON.stringify(M, null, 1) + ';' + s.slice(i0 + mm[0].length);
new Function(s);
fs.writeFileSync(P, s);
console.log('LAB 253 2·3단계 지시값 수정');
