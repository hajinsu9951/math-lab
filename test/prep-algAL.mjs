// 설치 전 조정
//  298 — 두 신호가 한 조작(악수 횟수)에 함께 켜져 3단계를 「한 번만 세기」쪽으로 갈랐다.
//  299 — 가장 싼 다섯 길에 사이클이 없어 「검사 없이」의 폐해가 드러나지 않았다. 가중치를 바꿨다.
//  300 — 깊이 우선을 스택으로 제대로 구현하고, 목표에 닿을 만큼 미로와 슬라이더를 넓혔다.
//  301 — 최단 경로가 갈아타려면 5 가 아니라 1 이어야 한다.
import fs from 'node:fs';
const F = 'algAL-demos.txt';
let s = fs.readFileSync(F, 'utf8');
let n = 0;
const one = (a, b, tag) => { if (s.includes(a)) { s = s.replace(a, b); n++; } else console.log('실패:', tag); };

/* 298 */
one(`      + (odd%2===0 && odd>0 && odd<n ? \`<b style="color:#7C3AED">홀수 번 악수한 사람이 \${odd} 명 — 언제나 짝수 명입니다.</b><br>\` : '')`,
    `      + (one ? \`<b style="color:#7C3AED">간선을 한 번만 세니 차수의 합의 절반이 나옵니다 — 한 번의 악수를 두 사람이 함께 세야 합니다.</b><br>\` : '')`,
    '298 3단계 신호');

/* 299 */
one(`  const E=[[0,1,3],[1,2,4],[0,3,5],[3,4,6],[4,5,7],[2,5,8],[1,4,9],[0,2,11],[3,5,12]];`,
    `  const E=[[0,1,3],[1,2,4],[0,2,5],[3,4,6],[0,3,7],[4,5,8],[2,5,9],[1,4,11],[3,5,12]];`,
    '299 가중치');

/* 301 */
one(`      + (w<=2 ? \`<b style="color:#7C3AED">가·라 구간이 짧아지자 최단 경로가 아래쪽으로 갈아탔습니다.</b><br>\` : '')`,
    `      + (w<=1 ? \`<b style="color:#7C3AED">가·라 구간이 짧아지자 최단 경로가 아래쪽으로 갈아탔습니다.</b><br>\` : '')`,
    '301 갈아타는 임계');

/* 300 — 함수 전체 교체 */
{
  const i = s.indexOf('/* ---------- LAB 300');
  const j = s.indexOf('/* ---------- LAB 301');
  if (i < 0 || j < 0 || j < i) throw new Error('300 블록 앵커 실패');
  const NEW = `/* ---------- LAB 300 너비 우선 vs 깊이 우선 — 찾는 순서가 답을 바꾼다 ---------- */
function bfsDfsDemo(root){
  root.innerHTML=\`<div class="row"><div class="col">
      <canvas id="bd1" width="380" height="330"></canvas>
      <div class="note" style="margin-top:8px">같은 미로라도 <b>다음에 무엇을 꺼내느냐</b>에 따라
      찾는 순서가 달라집니다. 최단 경로를 원하면 큐를 써야 합니다.</div>
    </div>
    <div class="col">
      <label class="ctl">탐색 방법<select id="bdM" style="width:100%;padding:7px 9px;border:1px solid #E5E7EB;border-radius:8px;font:inherit">
        <option value="bfs">너비 우선 (큐 — 먼저 넣은 것부터)</option>
        <option value="dfs">깊이 우선 (스택 — 나중에 넣은 것부터)</option>
      </select></label>
      \${slider('bdK','살펴본 칸 수',0,22,1,0,'칸')}
      <div class="out" id="bdout"></div>
    </div></div>\`;
  const cv=$('#bd1'),ctx=cv.getContext('2d'),W=380,H=330;
  const R=4,C=6,START=0,GOAL=R*C-1;
  const WALL=new Set([7,13,19]);
  const nb=i=>{ const r=Math.floor(i/C), c=i%C, out=[];
    [[0,1],[1,0],[0,-1],[-1,0]].forEach(([dr,dc])=>{ const r2=r+dr,c2=c+dc;
      if(r2<0||r2>=R||c2<0||c2>=C) return; const j=r2*C+c2;
      if(WALL.has(j)) return; out.push(j); });
    return out; };
  function search(mode,k){
    const prev={}, order=[], seen=new Set();
    let bag=[[START,-1]];
    while(bag.length && order.length<=k){
      const [cur,from] = mode==='bfs' ? bag.shift() : bag.pop();
      if(seen.has(cur)) continue;
      seen.add(cur); if(from>=0) prev[cur]=from; order.push(cur);
      if(cur===GOAL) break;
      for(const j of nb(cur)) if(!seen.has(j)) bag.push([j,cur]); }
    const found=order.indexOf(GOAL);
    let path=null;
    if(found>=0){ path=[GOAL]; let cur=GOAL;
      while(cur!==START && prev[cur]!==undefined){ cur=prev[cur]; path.unshift(cur); } }
    return {order,path,found};
  }
  function draw(){
    const mode=$('#bdM').value, k=+$('#bdK').value;
    $('#bdKv').textContent=k+'칸';
    const {order,path,found}=search(mode,k);
    const shortest=search('bfs',999).path;
    ctx.clearRect(0,0,W,H); ctx.fillStyle='#fff'; ctx.fillRect(0,0,W,H);
    const cw=56,ch=54,x0=32,y0=52;
    for(let i=0;i<R*C;i++){
      const r=Math.floor(i/C), c=i%C, X=x0+c*cw, Y=y0+r*ch;
      const idx=order.indexOf(i);
      ctx.fillStyle = WALL.has(i) ? '#374151'
        : i===START ? 'rgba(14,147,132,.45)'
        : i===GOAL ? 'rgba(190,18,60,.35)'
        : idx>=0 ? 'rgba(37,99,235,'+(0.12+0.035*Math.min(idx,14)).toFixed(3)+')' : '#F9FAFB';
      ctx.fillRect(X,Y,cw-4,ch-4);
      ctx.strokeStyle='#E5E7EB'; ctx.strokeRect(X,Y,cw-4,ch-4);
      if(idx>=0 && !WALL.has(i)){ ctx.fillStyle='#1E3A8A'; ctx.font='bold 12px sans-serif'; ctx.textAlign='center';
        ctx.fillText(idx+1, X+(cw-4)/2, Y+(ch-4)/2+8); }
      if(i===START){ ctx.fillStyle='#065F46'; ctx.font='10px sans-serif'; ctx.textAlign='center';
        ctx.fillText('출발', X+(cw-4)/2, Y+14); }
      if(i===GOAL){ ctx.fillStyle='#7F1D1D'; ctx.font='10px sans-serif'; ctx.textAlign='center';
        ctx.fillText('목표', X+(cw-4)/2, Y+14); } }
    if(path){ ctx.strokeStyle='#B45309'; ctx.lineWidth=3.4; ctx.beginPath();
      path.forEach((i,m)=>{ const r=Math.floor(i/C), c=i%C;
        const X=x0+c*cw+(cw-4)/2, Y=y0+r*ch+(ch-4)/2;
        m?ctx.lineTo(X,Y):ctx.moveTo(X,Y); }); ctx.stroke(); }
    ctx.textAlign='left'; ctx.fillStyle='#6B7280'; ctx.font='10.5px sans-serif';
    ctx.fillText('칸 안의 수 = 살펴본 순서 · 검정 = 벽 · 주황 선 = 찾은 길', 14, 24);
    ctx.fillText('살펴본 칸 '+order.length+' 개'+(path?(' · 찾은 길 '+(path.length-1)+' 칸'):' · 아직 못 찾음'), 14, H-10);
    $('#bdout').innerHTML =
      \`<span class="mono">방법 = <b>\${mode==='bfs'?'너비 우선(큐)':'깊이 우선(스택)'}</b> · 살펴본 칸 = \${order.length} · 목표를 \${found>=0?(found+1)+' 번째로 찾음':'아직 못 찾음'}</span><br>\`
      + \`<span class="mono">찾은 길의 길이 = <b style="color:\${path&&shortest&&path.length===shortest.length?'#0E9384':'#BE123C'}">\${path?path.length-1:'—'}</b> 칸 · 최단 길이 = <b>\${shortest?shortest.length-1:'—'}</b> 칸</span><br>\`
      + (mode==='bfs' && path && shortest && path.length===shortest.length ? \`<b style="color:#B45309">큐로 찾으니 곧바로 최단 경로가 나왔습니다.</b><br>\` : '')
      + (mode==='dfs' && path && shortest && path.length>shortest.length ? \`<b style="color:#7C3AED">스택으로 찾은 길이 최단보다 \${path.length-shortest.length} 칸이나 깁니다 — 먼저 찾았다고 가장 짧은 것은 아닙니다.</b><br>\` : '')
      + \`<span style="color:#6B7280;font-size:12.5px">큐를 쓰면 가까운 곳부터, 스택을 쓰면 한 방향으로 끝까지 갑니다.</span>\`;
  }
  $('#bdM').onchange=draw; $('#bdK').oninput=draw; draw();
  inquiry(root,{ id:'bd', title:'탐색 순서 — 큐냐 스택이냐',
    q:['두 방법으로 (살펴본 칸 수, 찾은 길이) 를 여섯 줄 기록하세요.',
       '어느 쪽이 최단 경로를 주는지 확인하세요.',
       '큐와 스택의 차이가 순서를 어떻게 바꾸는지 쓰세요.'],
    cols:['방법','살펴본 칸','찾은 길이','최단 길이'],
    hint:'힌트 — 큐는 먼저 넣은 것을, 스택은 나중에 넣은 것을 꺼냅니다.',
    read:()=>{ const m=$('#bdM').value,k=+$('#bdK').value,r=search(m,k),b=search('bfs',999);
      return [m==='bfs'?'너비 우선':'깊이 우선',r.order.length,r.path?r.path.length-1:'—',b.path?b.path.length-1:'—']; } });
}

`;
  s = s.slice(0, i) + NEW + s.slice(j);
  n++;
}

fs.writeFileSync(F, s, 'utf8');
console.log('조정', n, '/ 5 건');
