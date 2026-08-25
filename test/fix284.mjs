// LAB 284 — 접점을 중심으로 반전하면 상이 「세로 직선」이 되는데,
// 곧게 펴졌는지를 가로 폭으로만 재고 있어서 값이 0 으로 나왔다. 가로·세로 중 큰 쪽으로 잰다.
import fs from 'node:fs';
const OLD = `    const spanX=arr=>arr.length?Math.max(...arr.map(q=>q[0]))-Math.min(...arr.map(q=>q[0])):0;`;
const NEW = `    const spanX=arr=>{ if(!arr.length) return 0;          // 가로·세로 중 크게 뻗은 쪽으로 잰다
      const xs=arr.map(q=>q[0]), ys=arr.map(q=>q[1]);
      return Math.max(Math.max(...xs)-Math.min(...xs), Math.max(...ys)-Math.min(...ys)); };`;
const LBL = ['반전된 두 도형의 가로 폭 = ', '반전된 두 도형이 뻗은 크기 = '];
for (const P of ['src/40-demos.js', 'algAI-demos.txt']) {
  let s = fs.readFileSync(P, 'utf8');
  if (!s.includes(OLD)) { console.log('건너뜀:', P); continue; }
  s = s.replace(OLD, NEW).replace(LBL[0], LBL[1]);
  fs.writeFileSync(P, s, 'utf8');
  console.log('수정:', P);
}
