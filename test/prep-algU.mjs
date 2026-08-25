// 설치 전 조정 — 213·215 초기값, 214 로렌츠 곡선의 단조성, 216 버튼 값
import fs from 'node:fs';
const F = 'algU-demos.txt';
let s = fs.readFileSync(F, 'utf8');
const E = [
  // 213 — 폭 0 이면 열자마자 판정
  ["slider('raS','도박의 폭 (±)',0,90,5,0,'만원')", "slider('raS','도박의 폭 (±)',0,90,5,20,'만원')"],
  // 214 — 아래 네 계층을 같게 두어야 로렌츠 곡선이 단조가 된다
  [`    const rest=1-top, base=rest/4;
    const shares=[base*0.4, base*0.8, base*1.2, base*1.6, top];`,
   `    const e=(1-top)/4;
    const shares=[e, e, e, e, top];`],
  [`    read:()=>{ const top=+$('#giK').value/100, rest=1-top, base=rest/4;
      const shares=[base*0.4,base*0.8,base*1.2,base*1.6,top];`,
   `    read:()=>{ const top=+$('#giK').value/100, e=(1-top)/4;
      const shares=[e,e,e,e,top];`],
  ["slider('giK','상위 20%가 가져가는 몫',20,80,5,20,'%')", "slider('giK','상위 20%가 가져가는 몫',20,80,5,45,'%')"],
  // 215 — 초기 성장률이 72의 법칙 신호를 켠다
  ["slider('grG','명목 성장률',0,12,0.5,5,'%')", "slider('grG','명목 성장률',0,12,0.5,3,'%')"],
  // 216 — 버튼이 절반 시점을 정수 근처로 만들도록
  ["  $('#dpMid').onclick=()=>{ $('#dpR').value=25; $('#dpN').value=8; draw(); };",
   "  $('#dpMid').onclick=()=>{ $('#dpR').value=30; $('#dpN').value=8; draw(); };"],
];
let n = 0;
E.forEach(([a, b], i) => { if (s.includes(a)) { s = s.replace(a, b); n++; } else console.log('실패', i + 1, a.slice(0, 45)); });
fs.writeFileSync(F, s);
console.log('조정', n, '/', E.length, '건');
