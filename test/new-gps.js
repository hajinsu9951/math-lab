function gpsDemo(root){
  root.innerHTML=`<div class="row">
   <div class="col"><canvas id="g1" width="380" height="330"></canvas>
   <div class="note">📍 붉은 수색 마커를 끌어(또는 클릭해) 조난자 위치를 짚으세요. 1칸 = 1 km</div></div>
   <div class="col">
   <label class="ctl">기지국 신호(원) 켜기 / 끄기</label>
   <div class="btns">
     <button class="b g" id="gcA">A 원 · 4.7km</button>
     <button class="b g" id="gcB">B 원 · 4.5km</button>
     <button class="b g" id="gcC">C 원 · 4.1km</button>
   </div>
   ${slider('gn','거리 측정 오차 (km)',0,1,0.1,0,'')}
   <div class="out mono" id="gout"></div></div></div>`;
  const A=[[1.2,1.5],[8.6,2.0],[4.8,8.6]], D=[4.7,4.5,4.1], C=['#2563EB','#0E9384','#B45309'], NM=['A','B','C'];
  const cv=$('#g1'),ctx=cv.getContext('2d'),W=380,H=330,P=26,S=(W-2*P)/10;
  const X=v=>P+v*S, Y=v=>H-P-v*S;
  const on=[false,false,false];
  let M=[2.0,7.0];
  function inters(i,j){const x1=A[i][0],y1=A[i][1],x2=A[j][0],y2=A[j][1],r1=D[i],r2=D[j];
    const dx=x2-x1,dy=y2-y1,d=Math.hypot(dx,dy);
    if(d===0||d>r1+r2||d<Math.abs(r1-r2))return[];
    const a=(r1*r1-r2*r2+d*d)/(2*d),h2=r1*r1-a*a;if(h2<0)return[];
    const h=Math.sqrt(h2),mx=x1+a*dx/d,my=y1+a*dy/d;
    return[[mx+h*dy/d,my-h*dx/d],[mx-h*dy/d,my+h*dx/d]];}
  function draw(){
    const nz=+$('#gn').value; $('#gnv').textContent=nz.toFixed(1);
    ['gcA','gcB','gcC'].forEach((id,ix)=>{const b=$('#'+id);
      b.style.background=on[ix]?C[ix]:'';b.style.color=on[ix]?'#fff':'';});
    axes(ctx,W,H,P);
    for(let i=0;i<3;i++){
      if(on[i]){
        if(nz>0){ctx.strokeStyle=C[i];ctx.globalAlpha=0.22;ctx.lineWidth=Math.max(3,2*nz*S);
          ctx.beginPath();ctx.arc(X(A[i][0]),Y(A[i][1]),D[i]*S,0,7);ctx.stroke();ctx.globalAlpha=1;}
        ctx.strokeStyle=C[i];ctx.lineWidth=1.8;ctx.beginPath();
        ctx.arc(X(A[i][0]),Y(A[i][1]),D[i]*S,0,7);ctx.stroke();
      }
      ctx.fillStyle=C[i];ctx.beginPath();ctx.arc(X(A[i][0]),Y(A[i][1]),5,0,7);ctx.fill();
      ctx.font='bold 11px sans-serif';ctx.fillText(NM[i],X(A[i][0])+7,Y(A[i][1])-7);
    }
    ctx.fillStyle='#BE123C';ctx.beginPath();ctx.arc(X(M[0]),Y(M[1]),7,0,7);ctx.fill();
    ctx.font='bold 11px sans-serif';ctx.fillText('수색',X(M[0])+9,Y(M[1])+4);
    const dm=A.map(s=>Math.hypot(M[0]-s[0],M[1]-s[1]));
    const rows=dm.map((d,i)=>`${on[i]?'●':'○'} ${NM[i]}: 마커까지 ${d.toFixed(2)} km (신호 ${D[i].toFixed(1)} km, 차 ${(d-D[i])>=0?'+':''}${(d-D[i]).toFixed(2)})`).join('<br>');
    const cnt=on.filter(Boolean).length;
    let st;
    if(cnt===0) st='원을 켜서 조난자의 신호를 지도에 그려 보세요.';
    else if(cnt===1) st='원 위의 모든 점이 후보 — 아직 위치를 정할 수 없습니다.';
    else if(cnt===2){
      const ix=[0,1,2].filter(i=>on[i]);
      const pts=inters(ix[0],ix[1]);
      const near=pts.some(q=>Math.hypot(M[0]-q[0],M[1]-q[1])<0.3);
      st=near?'<b>후보 지점 포착!</b> 그런데 두 원의 교점은 두 곳 — 어느 쪽이 진짜일까요?'
        :'두 원이 만나는 자리가 후보입니다. 마커를 교점으로 보내세요.';
    } else {
      const hit=dm.every((d,i)=>Math.abs(d-D[i])<0.25);
      st = hit? '🎯 <b>조난자 발견!</b> 세 신호가 모두 맞아떨어집니다 — 좌표를 기록하고 구조대를 보내세요.'
        : nz>0? '오차 때문에 세 띠가 겹치는 「수색 영역」이 생겼습니다. 조난자는 이 안 어딘가.'
        : '세 원이 동시에 지나는 단 한 곳을 찾아 마커를 옮기세요.';
    }
    $('#gout').innerHTML=rows+`<br><br>마커 (${M[0].toFixed(1)}, ${M[1].toFixed(1)})<br>→ ${st}`;
  }
  const pos=e=>{const r=cv.getBoundingClientRect();
    const ux=((e.clientX-r.left)*W/r.width-P)/S, uy=(H-P-(e.clientY-r.top)*H/r.height)/S;
    return [Math.max(0,Math.min(10,ux)),Math.max(0,Math.min(10,uy))];};
  let drag=false;
  cv.addEventListener('pointerdown',e=>{drag=true;M=pos(e);draw();e.preventDefault();});
  cv.addEventListener('pointermove',e=>{if(drag){M=pos(e);draw();}});
  window.addEventListener('pointerup',()=>{drag=false;});
  ['gcA','gcB','gcC'].forEach((id,ix)=>{$('#'+id).onclick=()=>{on[ix]=!on[ix];draw();};});
  $('#gn').oninput=draw;
  draw();
}
