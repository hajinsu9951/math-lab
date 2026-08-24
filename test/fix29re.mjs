// LAB29 S2 — 곱(24)은 항상 일정해 초기 상태와 일치 → 위치 기반 신호로 교체
import fs from 'node:fs';
const P = 'src/40-demos.js';
let s = fs.readFileSync(P, 'utf8');
const i0 = s.indexOf('const MISSIONS=');
const mm = s.slice(i0).match(/^const MISSIONS=\{[\s\S]*?\n\};/);
const M = new Function('return ' + mm[0].slice('const MISSIONS='.length, -1))();
M['29'][1] = {
  t: '지렛대의 거래 — 손을 받침점에서 2 m 지점으로 옮겨 필요한 힘을 확인하세요. 4 m 일 때(힘 6)와 견주면 무엇이 변하지 않나요?',
  re: 'x = 2\\.0 · y = 12\\.0',
  do: '① 손을 x=2 로 끌기 ② 힘 y 읽기 ③ 다시 x=4 로 물러나 힘 비교',
  hand: '2×12 와 4×6 을 계산해 같은 값이 나오는지 확인 — 곱인가 합인가?'
};
s = s.slice(0, i0) + 'const MISSIONS=' + JSON.stringify(M, null, 1) + ';' + s.slice(i0 + mm[0].length);
fs.writeFileSync(P, s);
const txt = M['29'].map(x => [x.t, x.do, x.hand].filter(Boolean).join('\n')).join('\n');
console.log('re =', JSON.stringify(M['29'][1].re),
  '| 매치:', new RegExp(M['29'][1].re).test('x = 2.0 · y = 12.0'),
  '| 자기일치:', new RegExp(M['29'][1].re).test(txt));
