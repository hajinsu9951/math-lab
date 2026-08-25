// 설치 전 조정 — 158 초기 이심률, 160 초기 신호 차단, 161 접선 맞추기 정리
import fs from 'node:fs';
const F = 'algJ-demos.txt';
let s = fs.readFileSync(F, 'utf8');
const E = [
  ["slider('elC','두 압정 사이 거리의 절반 c',0,4,0.1,2.4,'')",
   "slider('elC','두 압정 사이 거리의 절반 c',0,4,0.1,1.5,'')"],
  ["slider('tdD','시간 차 (마이크 A 가 먼저)',-8,8,0.2,3,'ms')",
   "slider('tdD','시간 차 (마이크 A 가 먼저)',-8,8,0.2,0,'ms')"],
  ["      + (ok1&&!S.third ? `<b style=\"color:#B45309\">아직 곡선 위 어디인지까지는 모릅니다 — 마이크가 둘뿐이기 때문입니다.</b><br>` : '')",
   "      + (ok1&&Math.abs(dd)>0.5&&!S.third ? `<b style=\"color:#B45309\">아직 곡선 위 어디인지까지는 모릅니다 — 마이크가 둘뿐이기 때문입니다.</b><br>` : '')"],
  ["  $('#tcFit').onclick=()=>{ const m=+$('#tcM').value;\n    const k=Math.sqrt(4*(1+m*m)); $('#tcK').value=k.toFixed(1);\n    const kk=+$('#tcK').value; // 슬라이더 눈금에 맞춘 값으로 다시 정밀 보정\n    $('#tcK').step=0.0001; $('#tcK').value=k; draw(); };",
   "  $('#tcFit').onclick=()=>{ const m=+$('#tcM').value;\n    $('#tcK').step=0.0001; $('#tcK').value=Math.sqrt(4*(1+m*m)); draw(); };"],
];
let n = 0;
E.forEach(([a, b], i) => { if (s.includes(a)) { s = s.replace(a, b); n++; } else console.log('실패', i + 1, a.slice(0, 45)); });
fs.writeFileSync(F, s);
console.log('조정', n, '/', E.length, '건');
