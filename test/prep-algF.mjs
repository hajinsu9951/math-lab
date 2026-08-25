// 설치 전 데모 조정 — 138 상태별 신호 한 줄 추가, 141 초기 선택을 원뿔로
import fs from 'node:fs';
const F = 'algF-demos.txt';
let s = fs.readFileSync(F, 'utf8');
const E = [
  [`      + (k==='const' ? \`<b style="color:#7C3AED">높이가 일정하면 넓이는 직선으로 자랍니다 — 기울기가 늘 2 입니다.</b><br>\` : '')`,
   `      + (k==='const' ? \`<b style="color:#7C3AED">높이가 일정하면 넓이는 직선으로 자랍니다 — 기울기가 늘 2 입니다.</b><br>\` : '')
      + (k==='sq' ? \`<b style="color:#0E9384">넓이가 세제곱으로 자랍니다 — A(x) = x³/3 입니다.</b><br>\` : '')`],
  [`        <option value="sqrt">① r = √x (포물선 그릇)</option>
        <option value="lin">② r = x (원뿔)</option>`,
   `        <option value="lin">① r = x (원뿔)</option>
        <option value="sqrt">② r = √x (포물선 그릇)</option>`],
];
let n = 0;
E.forEach(([a, b], i) => { if (s.includes(a)) { s = s.replace(a, b); n++; } else console.log('실패', i + 1); });
fs.writeFileSync(F, s);
console.log('조정', n, '건');
