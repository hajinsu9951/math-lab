// LAB33 S5 신호 교체 (Write 도구 경유 — 백슬래시 보존)
import fs from 'node:fs';
const P = 'src/40-demos.js';
let s = fs.readFileSync(P, 'utf8');
const i0 = s.indexOf('const MISSIONS=');
const mm = s.slice(i0).match(/^const MISSIONS=\{[\s\S]*?\n\};/);
const M = new Function('return ' + mm[0].slice('const MISSIONS='.length, -1))();
M['33'][4] = {
  t: '심화 — 대량 데이터의 힘: 하루 손님 버튼을 여러 번 눌러, 가장 많이 팔린 치수가 스무 켤레를 넘도록 판매를 키우세요. 분포는 어떤 모양으로 안정되고, 세 대푯값은 어디로 모이나요?',
  re: '\\((2[0-9]|[3-9][0-9])켤레\\)',
  do: '① 하루 손님 +15 를 여러 번 ② 매번 세 대푯값 기록 ③ 분포 모양의 안정 관찰',
  hand: '기록 4행에서 평균의 흔들림 폭이 줄어드는지 판정'
};
s = s.slice(0, i0) + 'const MISSIONS=' + JSON.stringify(M, null, 1) + ';' + s.slice(i0 + mm[0].length);
fs.writeFileSync(P, s);
const texts = M['33'].map(x => [x.t, x.do, x.hand].filter(Boolean).join('\n')).join('\n');
if (new RegExp(M['33'][4].re).test(texts)) throw new Error('자기일치');
console.log('LAB33 S5 신호:', JSON.stringify(M['33'][4].re), '자기일치 0');
