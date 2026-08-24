// LAB95 S5 — 곱 -15 는 c 슬라이더 범위(±12) 밖 → 합 2·곱 -8 로 교체
import fs from 'node:fs';
const P = 'src/40-demos.js';
let s = fs.readFileSync(P, 'utf8');
const i0 = s.indexOf('const MISSIONS=');
const mm = s.slice(i0).match(/^const MISSIONS=\{[\s\S]*?\n\};/);
const M = new Function('return ' + mm[0].slice('const MISSIONS='.length, -1))();
M['95'][4] = {
  t: '심화 — 3라운드 승부: 합 2 · 곱 −8 인 두 수를 계수로 번역해(b = −합, c = 곱) 방정식으로 잡아내세요. 그리고 「합 7·곱 12」는 방정식 없이 머리로 두 수를 말한 뒤 같은 방법으로 검산하세요.',
  re: 'x² − 2x − 8 = 0',
  do: '① 합·곱을 b·c 로 번역 ② 슬라이더로 설정 ③ 그래프의 두 근 읽기',
  hand: '두 근을 t² − 2t − 8 = 0 인수분해로도 구해 화면과 대조'
};
s = s.slice(0, i0) + 'const MISSIONS=' + JSON.stringify(M, null, 1) + ';' + s.slice(i0 + mm[0].length);
fs.writeFileSync(P, s);
const texts = M['95'].map(x => [x.t, x.do, x.hand].filter(Boolean).join('\n')).join('\n');
if (new RegExp(M['95'][4].re).test(texts)) throw new Error('자기일치');
console.log('LAB95 S5 → 합2·곱-8, 자기일치 0');
