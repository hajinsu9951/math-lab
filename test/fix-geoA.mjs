// 161 — 슬라이더 눈금 때문에 D 가 정확히 0 이 되지 못하는 문제. 판정에 허용오차를 둔다.
import fs from 'node:fs';
const EDITS = [
  ["    const n = D>1e-9 ? 2 : (Math.abs(D)<=1e-9 ? 1 : 0);",
   "    const tol=0.01;\n    const n = D>tol ? 2 : (D<-tol ? 0 : 1);"],
  ["      + (n===1 ? `<b style=\"color:#B45309\">판별식이 0 — 한 점에서만 스치듯 만납니다. 접선입니다.</b><br>` : '')",
   "      + (n===1 ? `<b style=\"color:#B45309\">판별식이 0 — 한 점에서만 스치듯 만납니다. 접선입니다.</b><br>` : '')"],
  ["      const A=1+m*m,B=2*m*k,C=k*k-4,D=B*B-4*A*C;\n      return [m.toFixed(1),k.toFixed(3),D.toFixed(4),D>1e-9?2:(Math.abs(D)<=1e-9?1:0),",
   "      const A=1+m*m,B=2*m*k,C=k*k-4,D=B*B-4*A*C,tol=0.01;\n      return [m.toFixed(1),k.toFixed(3),D.toFixed(4),D>tol?2:(D<-tol?0:1),"],
];
for (const f of ['src/40-demos.js', 'algJ-demos.txt']) {
  let s = fs.readFileSync(f, 'utf8');
  let n = 0;
  EDITS.forEach(([a, b], i) => { if (s.includes(a)) { if (a !== b) { s = s.replace(a, b); n++; } } else console.log(f, '실패', i + 1); });
  fs.writeFileSync(f, s);
  console.log(f, '교체', n, '건');
}
