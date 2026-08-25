// 설치 전 조정 — 196 초기 글씨를 본보기와 다르게, 동점 만들기 버튼 추가
import fs from 'node:fs';
const F = 'algQ-demos.txt';
let s = fs.readFileSync(F, 'utf8');
const E = [
  [`        <button class="b g sm" id="hmN">잡음 두 칸 넣기</button>`,
   `        <button class="b g sm" id="hmN">잡음 두 칸 넣기</button>
        <button class="b g sm" id="hmMid">두 본보기의 딱 가운데로</button>`],
  [`  const S={ g:T.map(r=>r.slice()) };`,
   `  const S={ g:(()=>{ const g=T.map(r=>r.slice()); g[0][3]=0; g[3][0]=1; return g; })() };`],
  [`  $('#hmN').onclick=()=>{ S.g[0][3]=S.g[0][3]?0:1; S.g[3][0]=S.g[3][0]?0:1; draw(); };`,
   `  $('#hmN').onclick=()=>{ S.g[0][3]=S.g[0][3]?0:1; S.g[3][0]=S.g[3][0]?0:1; draw(); };
  $('#hmMid').onclick=()=>{ const g=T.map(r=>r.slice());
    [[0,2],[0,3],[1,0],[1,2]].forEach(([i,j])=>{ g[i][j]=L[i][j]; });
    S.g=g; draw(); };`],
];
let n = 0;
E.forEach(([a, b], i) => { if (s.includes(a)) { s = s.replace(a, b); n++; } else console.log('실패', i + 1, a.slice(0, 45)); });
fs.writeFileSync(F, s);
console.log('조정', n, '/', E.length, '건');
