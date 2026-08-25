// 145 그림을 100칸 격자로 교체 + 독립 판정 허용오차 완화
import fs from 'node:fs';
const F = 'algG-demos.txt';
let s = fs.readFileSync(F, 'utf8');

const OLD = `    ctx.clearRect(0,0,W,H); ctx.fillStyle='#fff'; ctx.fillRect(0,0,W,H);
    const L=40,T=24,SZ=230;
    ctx.strokeStyle='#9CA3AF'; ctx.lineWidth=1.2; ctx.strokeRect(L,T,SZ,SZ);
    ctx.fillStyle='rgba(37,99,235,.28)'; ctx.fillRect(L,T,SZ*a,SZ);
    ctx.fillStyle='rgba(14,147,132,.28)';
    const bx = L+SZ*(a - i/1);
    ctx.fillRect(Math.max(L,Math.min(bx, L+SZ-SZ*b)),T,SZ*b,SZ*0.999);
    const ovl = Math.max(0, Math.min(L+SZ*a, Math.max(L,Math.min(bx,L+SZ-SZ*b))+SZ*b) - Math.max(L, Math.max(L,Math.min(bx,L+SZ-SZ*b))));
    ctx.fillStyle='rgba(190,18,60,.35)';
    ctx.fillRect(Math.max(L, Math.max(L,Math.min(bx,L+SZ-SZ*b))), T, ovl, SZ*0.999);
    ctx.fillStyle='#374151'; ctx.font='11px sans-serif'; ctx.textAlign='left';
    ctx.fillText('A', L+6, T+16); ctx.fillText('B', L+SZ-16, T+16);
    ctx.fillStyle='#6B7280'; ctx.font='10.5px sans-serif';
    ctx.fillText('붉은 겹침 = P(A ∩ B) = '+i.toFixed(2), L, T+SZ+18);
    ctx.fillText('P(A)P(B) = '+(a*b).toFixed(3)+' 과 비교하세요', L, T+SZ+34);`;

const NEW = `    ctx.clearRect(0,0,W,H); ctx.fillStyle='#fff'; ctx.fillRect(0,0,W,H);
    const L=54,T=18,CELL=22;
    const nBoth=Math.round(i*100), nA=Math.round(a*100)-nBoth, nB=Math.round(b*100)-nBoth;
    for(let c=0;c<100;c++){
      const px=L+(c%10)*CELL, py=T+Math.floor(c/10)*CELL;
      let col='#F3F4F6';
      if(c<nBoth) col='rgba(190,18,60,.55)';
      else if(c<nBoth+nA) col='rgba(37,99,235,.38)';
      else if(c<nBoth+nA+nB) col='rgba(14,147,132,.38)';
      ctx.fillStyle=col; ctx.fillRect(px,py,CELL-2,CELL-2);
    }
    ctx.fillStyle='#6B7280'; ctx.font='10.5px sans-serif'; ctx.textAlign='left';
    ctx.fillText('붉은 = A와 B 둘 다('+nBoth+') · 파랑 = A만('+nA+') · 초록 = B만('+nB+')', L-40, T+10*CELL+16);
    ctx.fillText('100칸 중 겹침 '+nBoth+'칸 · P(A)P(B)×100 = '+(a*b*100).toFixed(1)+'칸', L-40, T+10*CELL+32);`;

if (!s.includes(OLD)) throw new Error('그림 교체 앵커 실패');
s = s.replace(OLD, NEW);
const n1 = s.split('Math.abs(i-a*b)<1e-9').length - 1;
s = s.split('Math.abs(i-a*b)<1e-9').join('Math.abs(i-a*b)<1e-6');
fs.writeFileSync(F, s);
console.log('145 그림 교체 완료 · 허용오차 완화', n1, '곳');
