// 설치 전 조정 — 154 모표준편차 값 정정, 155 신호를 확률에 의존하지 않게
import fs from 'node:fs';
const F = 'algI-demos.txt';
let s = fs.readFileSync(F, 'utf8');
const E = [
  ['(2.29/Math.sqrt(n)).toFixed(3)', '(2.42/Math.sqrt(n)).toFixed(3)'],
  [`      + (tot>=40 && hit<tot ? \`<b style="color:#B45309">몇 개는 참값을 놓쳤습니다 — 신뢰수준은 「늘 맞는다」가 아닙니다.</b><br>\` : '')`,
   `      + (tot>=40 ? \`<b style="color:#B45309">${'${tot}'}번 가운데 ${'${hit}'}번이 참값을 포함했습니다 — 신뢰수준과 견주어 보세요.</b><br>\` : '')`],
];
let n = 0;
E.forEach(([a, b], i) => {
  if (!s.includes(a)) { console.log('실패', i + 1, a.slice(0, 50)); return; }
  s = s.split(a).join(b); n++;
});
fs.writeFileSync(F, s);
console.log('조정', n, '/', E.length, '건');
