// 설치 전 조정 — 182 신호를 버튼 뒤로, 184 초기 판정 분리, 185 초기 조각 수
import fs from 'node:fs';
const F = 'algO-demos.txt';
let s = fs.readFileSync(F, 'utf8');
const E = [
  // 182 — 「그냥 바꿔 보기」 버튼을 두어 초기에는 판정이 뜨지 않게
  [`      <div class="ctl" style="margin-top:8px"><button class="b g sm" id="siDx">du = k·dx 를 반영하기</button></div>`,
   `      <div class="ctl" style="display:flex;gap:6px;flex-wrap:wrap;margin-top:8px">
        <button class="b g sm" id="siNaive">구간만 바꿔 계산</button>
        <button class="b g sm" id="siDx">du = k·dx 를 반영하기</button>
      </div>`],
  [`  const S={ fix:false };`, `  const S={ tried:false, fix:false };`],
  [`      + (!S.fix ? \`<b style="color:#B45309">구간만 바꾸고 du = \${k.toFixed(1)}·dx 를 반영하지 않아 \${k.toFixed(1)} 배 어긋납니다.</b><br>\` : '')`,
   `      + (S.tried && !S.fix ? \`<b style="color:#B45309">구간만 바꾸고 du = \${k.toFixed(1)}·dx 를 반영하지 않아 \${k.toFixed(1)} 배 어긋납니다.</b><br>\` : '')`],
  [`  $('#siDx').onclick=()=>{ S.fix=true; draw(); };
  ['siK','siB'].forEach(i=>$('#'+i).oninput=()=>{ S.fix=false; draw(); }); draw();`,
   `  $('#siNaive').onclick=()=>{ S.tried=true; S.fix=false; draw(); };
  $('#siDx').onclick=()=>{ S.fix=true; draw(); };
  ['siK','siB'].forEach(i=>$('#'+i).oninput=()=>{ S.tried=false; S.fix=false; draw(); }); draw();`],
  // 184 — 초기 선택을 포물선으로, 그 신호는 하강 구간에서만
  [`        <option value="circ">① 등속 원운동</option>
        <option value="para">② 포물선 운동 (던진 공)</option>`,
   `        <option value="para">① 포물선 운동 (던진 공)</option>
        <option value="circ">② 등속 원운동</option>`],
  [`      + (k==='para' ? \`<b style="color:#7C3AED">가속도가 늘 아래쪽으로 일정합니다 — 중력만 작용하는 운동입니다.</b><br>\` : '')`,
   `      + (k==='para' && vel[1]<0 ? \`<b style="color:#7C3AED">떨어지는 중인데도 가속도는 그대로 아래쪽 — 크기와 방향이 내내 일정합니다.</b><br>\` : '')`],
  // 185 — 초기 조각 수가 적어 열자마자 판정
  [`slider('alN','조각 수',2,200,1,4,'개')`, `slider('alN','조각 수',2,200,1,8,'개')`],
];
let n = 0;
E.forEach(([a, b], i) => { if (s.includes(a)) { s = s.replace(a, b); n++; } else console.log('실패', i + 1, a.slice(0, 45)); });
fs.writeFileSync(F, s);
console.log('조정', n, '/', E.length, '건');
