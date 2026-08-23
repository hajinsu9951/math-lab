// LAB 80 S5 — 전파괴(초기 상태와 동일) → 복원 도전으로 교체
import fs from 'node:fs';
const P = 'src/40-demos.js';
let s = fs.readFileSync(P, 'utf8');
const i0 = s.indexOf('const MISSIONS=');
const mm = s.slice(i0).match(/^const MISSIONS=\{[\s\S]*?\n\};/);
const M = new Function('return ' + mm[0].slice('const MISSIONS='.length, -1))();
M['80'][4] = {
  t: '심화 — 손끝 복원: 이번엔 버튼 없이 꼭짓점만 끌어, 두 대각선의 중점을 다시 겹치게 만들어 다섯 등을 켜 보세요. 그리고 「대각선이 서로를 이등분하면 평행사변형」을 SAS 합동으로 증명해 마무리하세요.',
  re: '평행사변형입니다',
  do: '① 사다리꼴 상태에서 시작 ② 파랑·주황 중점이 겹치도록 한 꼭짓점 조정 ③ 다섯 등 점등 확인',
  hand: '대각선 교점에서 마주 보는 두 삼각형의 SAS 합동 증명 쓰기'
};
s = s.slice(0, i0) + 'const MISSIONS=' + JSON.stringify(M, null, 1) + ';' + s.slice(i0 + mm[0].length);
fs.writeFileSync(P, s);
const texts = M['80'].map(x => [x.t, x.do, x.hand].filter(Boolean).join('\n')).join('\n');
if (new RegExp(M['80'][4].re).test(texts)) throw new Error('자기일치');
console.log('LAB80 S5 → 복원 도전, 자기일치 0');
