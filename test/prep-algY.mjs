// 설치 전 조정 — 235 초기 반음 수, 236 신호 재설계(늘 참인 문구는 신호가 될 수 없다)
import fs from 'node:fs';
const F = 'algY-demos.txt';
let s = fs.readFileSync(F, 'utf8');
const E = [
  ["slider('muS','평균율로 계산한 반음 수',0,12,1,7,'반음')",
   "slider('muS','평균율로 계산한 반음 수',0,12,1,0,'반음')"],
  [`      + (Math.abs(r1/rn-(4+(n-1)*gap)/4)<0.01 ? \`<b style="color:#B45309">화면 크기가 거리에 반비례합니다 — 원근법의 규칙입니다.</b><br>\` : '')
      + (g1/g2>3 ? \`<b style="color:#7C3AED">앞쪽 간격이 뒤쪽의 \${(g1/g2).toFixed(1)}배 — 같은 간격인데 뒤로 갈수록 촘촘해집니다.</b><br>\` : '')`,
   `      + (Math.abs(r1/rn-(4+(n-1)*gap)/4)<0.01 ? \`화면 크기가 거리에 반비례합니다 — 원근법의 규칙입니다.<br>\` : '')
      + (g1/g2>8 ? \`<b style="color:#B45309">앞쪽 간격이 뒤쪽의 \${(g1/g2).toFixed(1)}배 — 뒤로 갈수록 기둥이 겹쳐 보입니다.</b><br>\` : '')
      + (vy>=180 ? \`<b style="color:#7C3AED">지평선을 올리니 위에서 내려다보는 구도가 됩니다 — 소실점의 높이가 시점입니다.</b><br>\` : '')`],
];
let n = 0;
E.forEach(([a, b], i) => { if (s.includes(a)) { s = s.replace(a, b); n++; } else console.log('실패', i + 1, a.slice(0, 50)); });
fs.writeFileSync(F, s);
console.log('조정', n, '/', E.length, '건');
