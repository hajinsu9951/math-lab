/* ═══════════════ 2019 STEAM·RME 디지털 전환 (LAB 102~103) ═══════════════
   원자료: 「1-1. RME 수업 모형」(카드 무한 쌓기 · 무한급수), 「RME 수업 모형」(RGB 색공간).
   오프라인 종이 카드·그림판 실험을 무한 시행 가능한 웹 실험으로 옮기고,
   원 수업의 활동 1~5 단계를 실험 사다리 5단계로 계승했다. */

/* ---------- LAB 102 카드 무한 쌓기 — 조화급수의 오버행 ---------- */
function ovDemo(root){
  root.innerHTML=`<div class="row"><div class="col">
      <canvas id="ov1" width="400" height="300"></canvas>
      <div class="ctl" style="display:flex;gap:6px;flex-wrap:wrap;margin-top:8px">
        ${slider('ovN','카드 수',2,8,1,4,'장')}
        <label class="ctl" style="margin:0"><input type="checkbox" id="ovHint"> ½·⅓·… 눈금 보기</label>
        <button class="b g sm" id="ovRst">가지런히</button></div>
    </div>
    <div class="col">
      <div class="out" id="ovout"></div>
      <div class="note" style="margin-top:12px">카드를 좌우로 끌어 <b>책상 끝 너머로</b> 내밀어 보세요.
      위에 얹힌 카드들의 무게중심이 받침을 벗어나는 순간 와르르 —
      실패가 곧 힌트입니다. 목표: <b>맨 위 카드를 통째로 책상 밖에</b> 띄우기.</div>
    </div></div>`;
  const cv=$('#ov1'),ctx=cv.getContext('2d'),W=400,H=300;
  const L=120, EDGE=210, CH=17;                       // 카드 길이(px), 책상 끝 x, 카드 두께
  const S={ n:4, x:[], hint:false };                  // x[i]=왼끝(카드 길이 단위, 책상 끝=0), 0=맨 아래
  function reset(){ S.x=Array(S.n).fill(-1); }
  function stability(){
    // 위에서 j장 묶음의 무게중심이 그 아래 받침(카드 j+1 의 오른끝 / 책상 끝 0)을 넘는지
    for(let j=S.n-1;j>=0;j--){
      let com=0;
      for(let i=j;i<S.n;i++) com+=S.x[i]+0.5;
      com/=(S.n-j);
      const sup=j===0?0:S.x[j-1]+1;
      if(com>sup+1e-9) return {bad:true, cnt:S.n-j};
    }
    return {bad:false};
  }
  function draw(){
    ctx.clearRect(0,0,W,H); ctx.fillStyle='#fff'; ctx.fillRect(0,0,W,H);
    // 책상
    const ty=250;
    ctx.fillStyle='#E5E7EB'; ctx.fillRect(0,ty,EDGE,H-ty);
    ctx.strokeStyle='#9CA3AF'; ctx.lineWidth=1.6;
    ctx.beginPath(); ctx.moveTo(0,ty); ctx.lineTo(EDGE,ty); ctx.lineTo(EDGE,H); ctx.stroke();
    ctx.fillStyle='#6B7280'; ctx.font='10.5px sans-serif'; ctx.textAlign='center';
    ctx.fillText('책상', EDGE/2, ty+26);
    ctx.fillStyle='#BE123C'; ctx.fillText('절벽 ↓', EDGE+26, ty+14);
    const st=stability();
    // 카드 (아래→위)
    for(let i=0;i<S.n;i++){
      const px=EDGE+S.x[i]*L, py=ty-(i+1)*CH;
      const danger=st.bad && i>=S.n-st.cnt;
      ctx.fillStyle=danger?'rgba(190,18,60,.4)':'rgba(37,99,235,.22)';
      ctx.fillRect(px,py,L,CH-2);
      ctx.strokeStyle=danger?'#BE123C':'#2563EB'; ctx.lineWidth=1.6;
      ctx.strokeRect(px,py,L,CH-2);
      // 무게중심 점
      ctx.fillStyle='#111827'; ctx.beginPath(); ctx.arc(px+L/2,py+CH/2-1,2.2,0,7); ctx.fill();
    }
    // 눈금 힌트: 위에서 k번째 겹의 권장 밀기 1/(2k)
    if(S.hint){
      ctx.strokeStyle='#B45309'; ctx.setLineDash([3,3]); ctx.lineWidth=1.2;
      let acc=0;
      for(let k=1;k<S.n;k++){ acc+=1/(2*k);
        const px=EDGE+(acc-1)*L+L;                     // 위에서 k번째 카드의 권장 오른끝
        const py=ty-(S.n-k)*CH-CH;
        ctx.beginPath(); ctx.moveTo(px,py-4); ctx.lineTo(px,py+CH+2); ctx.stroke();
      }
      ctx.setLineDash([]);
      ctx.fillStyle='#92400E'; ctx.font='10px sans-serif'; ctx.textAlign='left';
      ctx.fillText('주황 눈금 = ½, ¼, ⅙ … 씩 밀기', 14, 22);
    }
    const top=S.x[S.n-1];
    const over=top+1;                                  // 맨 위 카드 오른끝의 돌출량
    const Hn=Array.from({length:S.n},(_,i)=>1/(i+1)).reduce((a,b)=>a+b,0);
    const fullOut=!st.bad && top>=-1e-9;
    $('#ovout').innerHTML =
      (st.bad
        ? `<b style="color:#BE123C">와르르 — 위 ${st.cnt}장의 무게중심이 받침을 벗어났습니다.</b><br>
           <span style="color:#6B7280;font-size:12.5px">붉은 카드들을 안쪽으로 되돌리거나, 아래 카드를 더 내밀어 받쳐 주세요.</span><br>`
        : `안정 — 맨 위 카드 돌출 <b>${Math.max(0,over).toFixed(2)}</b> 카드<br>`)
      + (fullOut? `<b style="color:#0E9384">완전 돌출! 맨 위 카드가 책상 밖 허공에 통째로 떠 있습니다.</b><br>`:'')
      + `<span class="mono">이론 한계(${S.n}장) = ½(1 + ½ + … + 1/${S.n}) = ${(Hn/2).toFixed(3)} 카드</span><br>`
      + `<span style="color:#6B7280;font-size:12.5px">카드를 늘릴수록 한계가 커집니다 — 멈추지 않고요. 그것이 조화급수의 발산입니다.</span>`;
  }
  dragOn(cv,{
    hit:p=>{ const ty=250;
      for(let i=S.n-1;i>=0;i--){ const py=ty-(i+1)*CH;
        if(p.y>=py&&p.y<py+CH && p.x>=EDGE+S.x[i]*L-8 && p.x<=EDGE+S.x[i]*L+L+8) return String(i); }
      return null; },
    move:(h,p)=>{ const i=+h;
      S.x[i]=Math.max(-1.6,Math.min(1.4,Math.round(((p.x-EDGE)/L-0.5)*24)/24));
      draw(); }
  });
  $('#ovN').oninput=()=>{ S.n=+$('#ovN').value; reset(); draw(); };
  $('#ovHint').onchange=()=>{ S.hint=$('#ovHint').checked; draw(); };
  $('#ovRst').onclick=()=>{ reset(); draw(); };
  reset(); draw();
  inquiry(root,{ id:'ov', title:'카드 무한 쌓기 — 조화급수의 오버행 (RME)',
    q:['짝과 역할을 나눠(조작·기록) 카드 수별 최대 돌출량을 표로 채우세요 (2~8장).',
       '「최대 돌출」 열과 ½(1+½+⅓+…) 값을 견주고, 위에서 k번째 카드를 왜 1/(2k) 만큼만 밀 수 있는지 무게중심으로 쓰세요.',
       '돌출 2카드가 되려면 몇 장이 필요한지 이론 한계 식으로 추정하세요 — 이 합은 왜 멈추지 않고 자랄까요?'],
    cols:['카드 수','최대 돌출','이론 한계 ½Hₙ','차이'],
    hint:'힌트 — 위 k장의 무게중심은 받침 끝에 „딱 걸치는“ 순간까지만 밀 수 있습니다. 그 한 걸음이 1/(2k) 입니다.',
    read:()=>{ const Hn=Array.from({length:S.n},(_,i)=>1/(i+1)).reduce((a,b)=>a+b,0);
      const st=stability(); const over=S.x[S.n-1]+1;
      return [S.n+'장', st.bad?'무너짐':Math.max(0,over).toFixed(2), (Hn/2).toFixed(3),
        st.bad?'—':(Hn/2-Math.max(0,over)).toFixed(3)]; } });
}

/* ---------- LAB 103 RGB 색 좌표 실험실 ---------- */
function clDemo(root){
  root.innerHTML=`<div class="row"><div class="col">
      <canvas id="cl1" width="400" height="240"></canvas>
      <div class="ctl" style="margin-top:6px">
        ${slider('clR','R (빨강)',0,255,5,200,'')}
        ${slider('clG','G (초록)',0,255,5,60,'')}
        ${slider('clB','B (파랑)',0,255,5,60,'')}</div>
    </div>
    <div class="col">
      <div class="out" id="clout"></div>
      <div class="ctl" style="display:flex;gap:6px;flex-wrap:wrap;margin-top:8px">
        <button class="b t sm" id="clQ1">도전① 16진수 해독</button>
        <button class="b t sm" id="clQ2">도전② 1:3 내분점</button>
        <button class="b t sm" id="clQ3">도전③ 무채색 합성</button></div>
      <div id="clQz" class="note" style="margin-top:8px">색은 좌표 (R, G, B) — 슬라이더로 점을 옮기면
      색이 변합니다. 삼각형은 세 원색을 꼭짓점으로 한 <b>색의 좌표평면</b>,
      가운데로 갈수록 회색이 되는 이유가 오늘의 수학입니다.</div>
      <div id="clT" style="margin-top:8px"></div>
    </div></div>`;
  const cv=$('#cl1'),ctx=cv.getContext('2d'),W=400,H=240;
  const S={ quiz:0, t:4, done:{} };                   // t: 내분 슬라이더 값(0~8 → 0~1)
  const TARGET=[75,150,200];                           // #4B96C8
  const MIXB=[50,200,120];                             // 도전③ 상대색
  const RV={x:70,y:210}, GV={x:200,y:30}, BV={x:330,y:210};
  const rgb=()=>[+$('#clR').value,+$('#clG').value,+$('#clB').value];
  const hex=c=>'#'+c.map(v=>v.toString(16).toUpperCase().padStart(2,'0')).join('');
  function draw(){
    const [r,g,b]=rgb();
    ctx.clearRect(0,0,W,H); ctx.fillStyle='#fff'; ctx.fillRect(0,0,W,H);
    // 색 견본
    ctx.fillStyle=`rgb(${r},${g},${b})`; ctx.fillRect(14,14,86,60);
    ctx.strokeStyle='#374151'; ctx.strokeRect(14,14,86,60);
    ctx.fillStyle='#111827'; ctx.font='bold 12px ui-monospace,monospace'; ctx.textAlign='left';
    ctx.fillText(hex([r,g,b]), 14, 90);
    ctx.font='10.5px sans-serif'; ctx.fillStyle='#6B7280';
    ctx.fillText(`(${r}, ${g}, ${b})`, 14, 104);
    // 원색 삼각형 (무게중심 좌표)
    ctx.strokeStyle='#D1D5DB'; ctx.lineWidth=1.4;
    ctx.beginPath(); ctx.moveTo(RV.x,RV.y); ctx.lineTo(GV.x,GV.y); ctx.lineTo(BV.x,BV.y); ctx.closePath(); ctx.stroke();
    [[RV,'#DC2626','R'],[GV,'#16A34A','G'],[BV,'#2563EB','B']].forEach(([P,c2,nm])=>{
      ctx.fillStyle=c2; ctx.beginPath(); ctx.arc(P.x,P.y,7,0,7); ctx.fill();
      ctx.fillStyle='#111827'; ctx.font='bold 11px sans-serif'; ctx.textAlign='center';
      ctx.fillText(nm, P.x, P.y+22); });
    // 현재 색의 자리 (가중 무게중심)
    const s=r+g+b||1;
    const px=(r*RV.x+g*GV.x+b*BV.x)/s, py=(r*RV.y+g*GV.y+b*BV.y)/s;
    ctx.fillStyle=`rgb(${r},${g},${b})`; ctx.beginPath(); ctx.arc(px,py,9,0,7); ctx.fill();
    ctx.strokeStyle='#111827'; ctx.lineWidth=1.6; ctx.stroke();
    // 정중앙(무게중심) 표식
    const cx0=(RV.x+GV.x+BV.x)/3, cy0=(RV.y+GV.y+BV.y)/3;
    ctx.strokeStyle='#9CA3AF'; ctx.setLineDash([3,3]);
    ctx.beginPath(); ctx.arc(cx0,cy0,6,0,7); ctx.stroke(); ctx.setLineDash([]);
    quiz();
  }
  function quiz(){
    const [r,g,b]=rgb();
    let html='';
    if(S.quiz===1){
      const ok=Math.abs(r-TARGET[0])<=10&&Math.abs(g-TARGET[1])<=10&&Math.abs(b-TARGET[2])<=10;
      if(ok) S.done[1]=true;
      html=`<b>도전① — 코드 <span class="mono">#4B96C8</span> 의 색을 만드세요.</b><br>
        16진수 두 자리가 좌표 하나: 4B → 4×16+11. `
        + (ok?`<b style="color:#0E9384">16진법 해독 성공 — (75, 150, 200) 명중!</b>`
             :`<span style="color:#6B7280">지금 (${r}, ${g}, ${b}) — 각 좌표 ±10 안에 들어오면 성공.</span>`);
    } else if(S.quiz===2){
      const t=S.t/8;
      const P=[Math.round(255*(1-t)),0,Math.round(255*t)];
      const ok=S.t===2;
      if(ok) S.done[2]=true;
      html=`<b>도전② — 빨강(255,0,0)과 파랑(0,0,255)을 1 : 3 으로 내분한 색을 찾으세요.</b><br>
        <input type="range" id="clTt" min="0" max="8" step="1" value="${S.t}" style="width:70%">
        <span class="mono">t = ${S.t}/8</span><br>
        <span style="display:inline-block;width:46px;height:22px;background:rgb(${P[0]},${P[1]},${P[2]});border:1px solid #374151;vertical-align:middle"></span>
        <span class="mono"> (${P[0]}, ${P[1]}, ${P[2]})</span> `
        + (ok?`<b style="color:#0E9384">내분점 (1:3) 명중 — 좌표 (191, 0, 64), 빨강 쪽 ¼ 지점!</b>`
             :`<span style="color:#6B7280">빨강에서 파랑 방향으로 얼마나 간 지점일까요?</span>`);
    } else if(S.quiz===3){
      const mid=[Math.round((r+MIXB[0])/2),Math.round((g+MIXB[1])/2),Math.round((b+MIXB[2])/2)];
      const ok=Math.abs(mid[0]-mid[1])<=6&&Math.abs(mid[1]-mid[2])<=6;
      if(ok) S.done[3]=true;
      html=`<b>도전③ — 내 색과 고정색 (50, 200, 120)을 1:1 로 섞어 무채색(회색)을 만드세요.</b><br>
        합성색 = 두 좌표의 중점:
        <span style="display:inline-block;width:46px;height:22px;background:rgb(${mid[0]},${mid[1]},${mid[2]});border:1px solid #374151;vertical-align:middle"></span>
        <span class="mono"> (${mid[0]}, ${mid[1]}, ${mid[2]})</span><br>`
        + (ok?`<b style="color:#0E9384">채도 0 도달 — 세 좌표가 같아졌습니다. R = G = B 가 곧 회색입니다.</b>`
             :`<span style="color:#6B7280">중점의 세 좌표가 같아지려면 내 색을 어디에 둬야 할까요?</span>`);
    } else {
      html=`색은 좌표 (R, G, B) — 슬라이더로 점을 옮기면 색이 변합니다. 삼각형 위 점이
        현재 색의 자리, 점선 원이 세 원색의 무게중심(무채색 자리)입니다.`;
    }
    $('#clQz').innerHTML=html;
    const tt=$('#clTt'); if(tt) tt.oninput=()=>{ S.t=+tt.value; quiz(); };
  }
  ['clR','clG','clB'].forEach(id=>$('#'+id).oninput=draw);
  $('#clQ1').onclick=()=>{ S.quiz=1; quiz(); };
  $('#clQ2').onclick=()=>{ S.quiz=2; quiz(); };
  $('#clQ3').onclick=()=>{ S.quiz=3; quiz(); };
  draw();
  inquiry(root,{ id:'cl', title:'RGB 색 좌표 — 색을 수로 다루기 (STEAM)',
    q:['좋아하는 색 세 가지의 (R,G,B) 와 16진 코드를 표로 기록하세요.',
       '삼각형 위 점의 위치와 색의 관계를 정리하세요 — 꼭짓점에 가까울 때, 가운데(점선 원)에 갈 때 무엇이 변하나요?',
       '두 색의 1:1 합성이 좌표의 중점인 이유를 내분점 공식으로 쓰고, 1:3 이면 어디로 가는지 일반화하세요.'],
    cols:['색 이름','(R, G, B)','16진 코드'],
    hint:'힌트 — 색 합성은 좌표의 내분입니다. 도형 단원의 내분점 공식이 미술 시간의 팔레트에서 다시 태어납니다.',
    read:()=>{ const [r,g,b]=rgb(); return ['내 색', `(${r}, ${g}, ${b})`, hex([r,g,b])]; } });
}
