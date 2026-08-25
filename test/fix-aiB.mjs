// 195 — 슬라이더 범위(-2~2) 밖의 값을 문제로 삼아 도달 불가였다. 범위 안 값으로 교체.
import fs from 'node:fs';
const P = 'src/40-demos.js';
let s = fs.readFileSync(P, 'utf8');
const i0 = s.indexOf('const MISSIONS=');
const mm = s.slice(i0).match(/^const MISSIONS=\{[\s\S]*?\n\};/);
const M = new Function('return ' + mm[0].slice('const MISSIONS='.length, -1))();
M['195'][1].t = '오늘의 문제 — (a, b, c, d) 를 (1, 2, 0.5, 1) 로 맞추세요. 도형이 어떻게 되나요?';
M['195'][1].do = '① a=1, b=2, c=0.5, d=1 ② 도형의 모양 확인 ③ 행렬식 값 읽기';
M['195'][1].hand = 'ad − bc = 1×1 − 2×0.5 를 계산해 0 임을 확인하고, 두 행이 비례하는지 보기';
s = s.slice(0, i0) + 'const MISSIONS=' + JSON.stringify(M, null, 1) + ';' + s.slice(i0 + mm[0].length);
fs.writeFileSync(P, s);
console.log('195 문제 값 교체 완료 (행렬식 0 이 되는 범위 안 값)');
