/* ═══════════════ 중학교 3학년 2차 (LAB 53~60) ═══════════════ */

/* ---------- LAB 53 곱셈공식을 넓이로 보기 ---------- */
function xpDemo(root){
  root.innerHTML=`<div class="row"><div class="col">
      <canvas id="xp1" width="400" height="300"></canvas>
      <div class="ctl" style="display:flex;gap:6px;flex-wrap:wrap;margin-top:8px">
        <button class="b t sm" id="xpSum">(a+b)² 모드</button>
        <button class="b t sm" id="xpDif">(a−b)² 모드</button>
        <span id="xpStep"></span></div>
    </div>
    <div class="col">
      <div class="out" id="xpout"></div>
      <div class="note" style="margin-top:12px"><b>주황 손잡이</b>로 a·b 의 경계를 끄세요.
      전개 공식의 각 항이 <b>진짜 넓이 조각</b>으로 보입니다. (a−b)² 모드에서는
      두 번 뺀 겹침을 b² 만큼 <b>되돌려 주는</b> 순간이 공식의 +b² 입니다.</div>
    </div></div>`;
  const cv=$('#xp1'),ctx=cv.getContext('2d'),W=400,H=300;
  const S={ mode:'sum', a:6, st:0 };                    // a+b=10 고정, st: 차모드 단계
  const SC=22, px=52, py=44;
  function draw(){
    ctx.clearRect(0,0,W,H); ctx.fillStyle='#fff'; ctx.fillRect(0,0,W,H);
    const a=S.a, b=10-a;
    if(S.mode==='sum'){
      const T=10*SC;
      ctx.strokeStyle='#374151'; ctx.lineWidth=1.8; ctx.strokeRect(px,py,T,T);
      // a² / ab / ab / b²
      ctx.fillStyle='rgba(37,99,235,.22)';  ctx.fillRect(px,py+ b*SC, a*SC, a*SC);
      ctx.fillStyle='rgba(180,83,9,.25)';   ctx.fillRect(px+a*SC,py+b*SC, b*SC, a*SC);
      ctx.fillStyle='rgba(180,83,9,.25)';   ctx.fillRect(px,py, a*SC, b*SC);
      ctx.fillStyle='rgba(14,147,132,.25)'; ctx.fillRect(px+a*SC,py, b*SC, b*SC);
      ctx.strokeStyle='#9CA3AF'; ctx.lineWidth=1;
      ctx.beginPath(); ctx.moveTo(px+a*SC,py); ctx.lineTo(px+a*SC,py+T); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(px,py+b*SC); ctx.lineTo(px+T,py+b*SC); ctx.stroke();
      ctx.fillStyle='#111827'; ctx.font='bold 12px sans-serif'; ctx.textAlign='center';
      ctx.fillText('a²='+(a*a), px+a*SC/2, py+b*SC+a*SC/2);
      ctx.fillText('ab='+(a*b), px+a*SC+b*SC/2, py+b*SC+a*SC/2);
      ctx.fillText('ab='+(a*b), px+a*SC/2, py+b*SC/2+4);
      ctx.fillText('b²='+(b*b), px+a*SC+b*SC/2, py+b*SC/2+4);
      handle(ctx, px+a*SC, py+T, '#B45309', 'a='+a+' b='+b);
      const same=a===b;
      $('#xpout').innerHTML =
        `<span class="mono" style="font-size:15.5px">(a+b)² = a² + 2ab + b²<br>(${a}+${b})² = ${a*a} + ${2*a*b} + ${b*b} = <b>${(a+b)*(a+b)}</b></span><br>`
        + (same?`<b style="color:#0E9384">a = b = 5 — 네 조각이 같아졌습니다 (25 × 4 = 100).</b>`
               :`<span style="color:#6B7280;font-size:12.5px">가운데 두 조각(ab)이 왜 <b>둘</b>인지가 2ab 의 정체입니다.</span>`);
      $('#xpStep').innerHTML='';
    } else {
      const A=9, B=10-S.a>3?10-S.a:3;                   // 차모드: a=9 고정, b=3~? 간단히 b=3
      const b2=3, T=A*SC*1.2;
      ctx.strokeStyle='#374151'; ctx.lineWidth=1.8; ctx.strokeRect(px,py,T,T);
      ctx.fillStyle='rgba(37,99,235,.13)'; ctx.fillRect(px,py,T,T);
      ctx.fillStyle='#111827'; ctx.font='bold 12px sans-serif'; ctx.textAlign='center';
      ctx.fillText('a² = 81 (a=9)', px+T/2, py-8);
      const bw=b2*SC*1.2;
      if(S.st>=1){ ctx.fillStyle='rgba(190,18,60,.3)'; ctx.fillRect(px+T-bw,py,bw,T);
        ctx.strokeStyle='#BE123C'; ctx.strokeRect(px+T-bw,py,bw,T);
        ctx.fillStyle='#BE123C'; ctx.fillText('−ab', px+T-bw/2, py+T/2); }
      if(S.st>=2){ ctx.fillStyle='rgba(190,18,60,.3)'; ctx.fillRect(px,py+T-bw,T,bw);
        ctx.strokeStyle='#BE123C'; ctx.strokeRect(px,py+T-bw,T,bw);
        ctx.fillStyle='#BE123C'; ctx.fillText('−ab', px+T/2-bw, py+T-bw/2+4);
        ctx.fillStyle='rgba(120,7,40,.55)'; ctx.fillRect(px+T-bw,py+T-bw,bw,bw);
        ctx.fillStyle='#fff'; ctx.fillText('겹침!', px+T-bw/2, py+T-bw/2+4); }
      if(S.st>=3){ ctx.fillStyle='rgba(14,147,132,.5)'; ctx.fillRect(px+T-bw,py+T-bw,bw,bw);
        ctx.strokeStyle='#0E9384'; ctx.lineWidth=2; ctx.strokeRect(px+T-bw,py+T-bw,bw,bw);
        ctx.fillStyle='#0B6E63'; ctx.fillText('+b²', px+T-bw/2, py+T-bw/2+4);
        ctx.strokeStyle='#0E9384'; ctx.lineWidth=2.4; ctx.strokeRect(px,py,T-bw,T-bw); }
      $('#xpStep').innerHTML =
        `<button class="b g sm" id="xpS1">① a×b 빼기</button>
         <button class="b g sm" id="xpS2">② 또 빼기</button>
         <button class="b g sm" id="xpS3">③ b² 되돌리기</button>`;
      $('#xpS1').onclick=()=>{ if(S.st===0)S.st=1; draw(); };
      $('#xpS2').onclick=()=>{ if(S.st===1)S.st=2; draw(); };
      $('#xpS3').onclick=()=>{ if(S.st===2)S.st=3; draw(); };
      $('#xpout').innerHTML =
        S.st===0?`a=9, b=3 — 큰 정사각형에서 (a−b)² = 6² = 36 을 꺼내 봅시다. ① 부터.`
        :S.st===1?`<span class="mono">a² − ab = 81 − 27 = 54</span> — 오른쪽 기둥을 뺐습니다. 아직 기역자.`
        :S.st===2?`<b style="color:#BE123C">두 번 뺀 자리가 겹쳤습니다 — 모서리 b² = 9 만큼 과잉 삭제!</b><br><span class="mono">81 − 27 − 27 = 27 ≠ 36</span>`
        :`<b style="color:#0E9384">(a−b)² = a² − 2ab + b² 완성.</b><br><span class="mono">81 − 54 + 9 = <b>36</b> = 6²</span> — 겹침을 되돌리는 +b² 이 공식의 마지막 항입니다.`;
    }
  }
  dragOn(cv,{
    hit:p=>{ if(S.mode!=='sum') return null;
      const a=S.a, T=10*SC;
      return Math.hypot(p.x-(px+a*SC), p.y-(py+T))<22?'a':null; },
    move:(h,p)=>{ S.a=Math.max(2,Math.min(8,Math.round((p.x-px)/SC))); draw(); }
  });
  $('#xpSum').onclick=()=>{ S.mode='sum'; draw(); };
  $('#xpDif').onclick=()=>{ S.mode='dif'; S.st=0; draw(); };
  draw();
  inquiry(root,{ id:'xp', title:'곱셈공식 — 전개는 넓이 분할이다',
    q:['(a+b)² 모드에서 a 를 바꿔 가며 네 조각의 넓이를 기록하세요.',
       '「2ab」 항이 조각 몇 개에서 오는지, (a−b)² 의 「+b²」 이 어느 순간에 나오는지 정리하세요.',
       '(a+b)(a−b) 을 같은 그림으로 설계하면 어떤 조각이 사라질지 예상해 손으로 그려 보세요.'],
    cols:['a','b','a²','2ab','b²','(a+b)²'],
    hint:'힌트 — 겹치게 두 번 뺐으면 겹친 만큼 한 번 되돌린다: 포함과 배제의 첫 만남입니다.',
    read:()=>{ const a=S.a,b=10-a; return [a,b,a*a,2*a*b,b*b,(a+b)*(a+b)]; } });
}

/* ---------- LAB 54 특수각의 삼각비 ---------- */
function taDemo(root){
  root.innerHTML=`<div class="row"><div class="col">
      <canvas id="ta1" width="400" height="300"></canvas>
      <div class="ctl" style="display:flex;gap:6px;flex-wrap:wrap;margin-top:8px">
        <button class="b g sm" id="taTri">근거: 정삼각형 반쪽</button>
        <button class="b g sm" id="taSq">근거: 정사각형 반쪽</button></div>
    </div>
    <div class="col">
      <div class="out" id="taout"></div>
      <div class="note" style="margin-top:12px">사분원 위의 점을 끌면 각이 변합니다.
      <b>30°·45°·60° 근처에서는 자석처럼 붙고</b>, 그 값이 왜 그 수인지
      「근거」 버튼이 도형으로 보여 줍니다.</div>
    </div></div>`;
  const cv=$('#ta1'),ctx=cv.getContext('2d'),W=400,H=300;
  const O={x:60,y:250}, R=180;
  const S={ th:20, fig:null };
  const EX={30:['1/2','√3/2','1/√3'],45:['√2/2','√2/2','1'],60:['√3/2','1/2','√3']};
  function draw(){
    ctx.clearRect(0,0,W,H); ctx.fillStyle='#fff'; ctx.fillRect(0,0,W,H);
    ctx.strokeStyle='#9CA3AF'; ctx.lineWidth=1.4;
    ctx.beginPath(); ctx.moveTo(O.x,O.y); ctx.lineTo(O.x+R+16,O.y); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(O.x,O.y); ctx.lineTo(O.x,O.y-R-16); ctx.stroke();
    ctx.strokeStyle='#D1D5DB'; ctx.beginPath(); ctx.arc(O.x,O.y,R,-Math.PI/2,0); ctx.stroke();
    const t=S.th*Math.PI/180, px=O.x+R*Math.cos(t), py=O.y-R*Math.sin(t);
    // 직각삼각형
    ctx.fillStyle='rgba(37,99,235,.12)';
    ctx.beginPath(); ctx.moveTo(O.x,O.y); ctx.lineTo(px,O.y); ctx.lineTo(px,py); ctx.closePath(); ctx.fill();
    ctx.strokeStyle='#2563EB'; ctx.lineWidth=2;
    ctx.beginPath(); ctx.moveTo(O.x,O.y); ctx.lineTo(px,py); ctx.stroke();
    ctx.strokeStyle='#0E9384'; ctx.beginPath(); ctx.moveTo(px,O.y); ctx.lineTo(px,py); ctx.stroke();
    ctx.strokeStyle='#B45309'; ctx.beginPath(); ctx.moveTo(O.x,O.y); ctx.lineTo(px,O.y); ctx.stroke();
    handle(ctx, px, py, '#B45309','θ = '+S.th+'°');
    // 근거 그림 (오른쪽 위)
    if(S.fig==='tri'){
      const bx=246,by=40,L=104;
      ctx.strokeStyle='#6B7280'; ctx.lineWidth=1.6;
      ctx.beginPath(); ctx.moveTo(bx,by+L); ctx.lineTo(bx+L,by+L); ctx.lineTo(bx+L/2,by+L-L*0.866); ctx.closePath(); ctx.stroke();
      ctx.strokeStyle='#BE123C'; ctx.setLineDash([4,3]);
      ctx.beginPath(); ctx.moveTo(bx+L/2,by+L); ctx.lineTo(bx+L/2,by+L-L*0.866); ctx.stroke(); ctx.setLineDash([]);
      ctx.fillStyle='#374151'; ctx.font='10.5px sans-serif'; ctx.textAlign='center';
      ctx.fillText('한 변 2 의 정삼각형을 반으로', bx+L/2, by+L+16);
      ctx.fillText('밑변 1 · 빗변 2 · 높이 √3', bx+L/2, by+L+30);
    }
    if(S.fig==='sq'){
      const bx=250,by=44,L=96;
      ctx.strokeStyle='#6B7280'; ctx.lineWidth=1.6; ctx.strokeRect(bx,by,L,L);
      ctx.strokeStyle='#BE123C';
      ctx.beginPath(); ctx.moveTo(bx,by+L); ctx.lineTo(bx+L,by); ctx.stroke();
      ctx.fillStyle='#374151'; ctx.font='10.5px sans-serif'; ctx.textAlign='center';
      ctx.fillText('한 변 1 의 정사각형의 대각선', bx+L/2, by+L+16);
      ctx.fillText('1 · 1 · √2 — 두 각은 45°', bx+L/2, by+L+30);
    }
    const sp=EX[S.th];
    $('#taout').innerHTML = sp
      ? `<b style="color:#0E9384">θ = ${S.th}° — 특수각!</b><br>
         <span class="mono" style="font-size:15px">sin ${S.th}° = ${sp[0]} &nbsp; cos ${S.th}° = ${sp[1]} &nbsp; tan ${S.th}° = ${sp[2]}</span><br>
         <span class="mono">≈ ${Math.sin(t).toFixed(4)} · ${Math.cos(t).toFixed(4)} · ${Math.tan(t).toFixed(4)}</span><br>
         <span style="color:#6B7280;font-size:12.5px">${S.th===45?'「근거: 정사각형 반쪽」— 1:1:√2 에서 나온 값입니다.':'「근거: 정삼각형 반쪽」— 1:√3:2 에서 나온 값입니다.'}</span>`
      : `<span class="mono">θ = ${S.th}° · sin=${Math.sin(t).toFixed(3)} cos=${Math.cos(t).toFixed(3)} tan=${Math.abs(Math.tan(t))>40?'∞':Math.tan(t).toFixed(3)}</span><br>
         <span style="color:#6B7280;font-size:12.5px">30°·45°·60° 에 가까이 가면 딸깍 붙습니다 — 거기서만 값이 「깔끔한 수」입니다.</span>`;
  }
  dragOn(cv,{
    hit:p=>{ const t=S.th*Math.PI/180;
      return Math.hypot(p.x-(O.x+R*Math.cos(t)), p.y-(O.y-R*Math.sin(t)))<24?'p':null; },
    move:(h,p)=>{ let d=Math.atan2(O.y-p.y, p.x-O.x)*180/Math.PI;
      d=Math.max(3,Math.min(87,Math.round(d)));
      [30,45,60].forEach(s=>{ if(Math.abs(d-s)<3) d=s; });
      S.th=d; draw(); }
  });
  $('#taTri').onclick=()=>{ S.fig=S.fig==='tri'?null:'tri'; draw(); };
  $('#taSq').onclick=()=>{ S.fig=S.fig==='sq'?null:'sq'; draw(); };
  draw();
  inquiry(root,{ id:'ta', title:'특수각 — 값이 깔끔한 데는 도형의 이유가 있다',
    q:['30°·45°·60° 각각에서 sin·cos·tan 을 기록하세요 (분수와 근삿값 모두).',
       'sin 30° 와 cos 60° 처럼 짝이 되는 값들을 표에서 찾아 묶으세요.',
       '정삼각형 반쪽(1:√3:2)에서 세 값이 나오는 과정을 손으로 그려 쓰고, sin²θ + cos²θ 를 세 각에서 계산해 규칙을 쓰세요.'],
    cols:['θ','sin','cos','tan'],
    hint:'힌트 — 표를 세로로 읽지 말고 대각선으로 읽어 보세요: sin 30° = cos 60°. 우연일까요?',
    read:()=>{ const sp=EX[S.th]; const t=S.th*Math.PI/180;
      return [S.th+'°', sp?sp[0]:Math.sin(t).toFixed(3), sp?sp[1]:Math.cos(t).toFixed(3), sp?sp[2]:Math.tan(t).toFixed(3)]; } });
}

/* ---------- LAB 55 삼각비의 표와 보간 ---------- */
function tbDemo(root){
  root.innerHTML=`<div class="row"><div class="col">
      <canvas id="tb1" width="400" height="240"></canvas>
      <div class="ctl" style="display:flex;gap:6px;flex-wrap:wrap;margin-top:8px">
        ${slider('tbT','각 θ (5° 눈금)',0,90,5,20,'°')}
        <button class="b t sm" id="tbAdd">이 각을 표에 기록</button>
        <button class="b g sm" id="tbQ">보간 도전 — sin 37°</button></div>
      <div id="tbQz" style="margin-top:8px"></div>
    </div>
    <div class="col">
      <div class="out" id="tbout"></div>
      <div id="tbTable" class="note" style="margin-top:10px;font-family:ui-monospace,monospace;font-size:12.5px"></div>
    </div></div>`;
  const cv=$('#tb1'),ctx=cv.getContext('2d'),W=400,H=240;
  const S={ rows:{}, quiz:false, ok:false };
  function draw(){
    const th=+$('#tbT').value, t=th*Math.PI/180;
    ctx.clearRect(0,0,W,H); ctx.fillStyle='#fff'; ctx.fillRect(0,0,W,H);
    const O={x:40,y:210}, R=170;
    ctx.strokeStyle='#9CA3AF'; ctx.beginPath(); ctx.moveTo(O.x,O.y); ctx.lineTo(O.x+R+14,O.y); ctx.stroke();
    ctx.strokeStyle='#D1D5DB'; ctx.beginPath(); ctx.arc(O.x,O.y,R,-Math.PI/2,0); ctx.stroke();
    const px=O.x+R*Math.cos(t), py=O.y-R*Math.sin(t);
    ctx.strokeStyle='#2563EB'; ctx.lineWidth=2.2;
    ctx.beginPath(); ctx.moveTo(O.x,O.y); ctx.lineTo(px,py); ctx.stroke();
    ctx.strokeStyle='#0E9384'; ctx.beginPath(); ctx.moveTo(px,O.y); ctx.lineTo(px,py); ctx.stroke();
    ctx.fillStyle='#0B6E63'; ctx.font='bold 11px sans-serif'; ctx.textAlign='left';
    ctx.fillText('sin '+th+'° = '+Math.sin(t).toFixed(4), px+8, (O.y+py)/2);
    const n=Object.keys(S.rows).length;
    $('#tbout').innerHTML =
      `<span class="mono">θ = ${th}° · sin θ = ${Math.sin(t).toFixed(4)}</span><br>`
      + `표 항목 <b>${n}개</b> — ${n<5?'각을 바꿔 가며 표를 채우세요. 계산기 없던 시절의 수학자가 하던 일입니다.':'훌륭한 표입니다. 이제 표에 없는 각을 「보간」으로 잡아 보세요.'}`;
    const ks=Object.keys(S.rows).map(Number).sort((a,b)=>a-b);
    $('#tbTable').innerHTML = ks.length?('θ | sin θ<br>'+ks.map(k=>String(k).padStart(2)+'° | '+S.rows[k]).join('<br>')):'(표가 비어 있습니다)';
  }
  $('#tbT').oninput=draw;
  $('#tbAdd').onclick=()=>{ const th=+$('#tbT').value;
    S.rows[th]=Math.sin(th*Math.PI/180).toFixed(4); draw(); };
  $('#tbQ').onclick=()=>{ S.quiz=true;
    $('#tbQz').innerHTML=`<b>sin 37° = ?</b> 표의 35° 와 40° 사이를 직선으로 이어 추정하세요.
      <input type="number" step="0.0001" id="tbA" style="width:110px;padding:5px;border:1px solid #E5E7EB;border-radius:7px">
      <button class="b t sm" id="tbC">판정</button> <span id="tbR" style="font-weight:800"></span>`;
    $('#tbC').onclick=()=>{ const v=+$('#tbA').value, tru=Math.sin(37*Math.PI/180);
      if(Math.abs(v-tru)<0.01){ S.ok=true;
        $('#tbR').innerHTML=`<span style="color:#0E9384">보간 성공 — 참값 ${tru.toFixed(4)}, 직선 추정 0.6013. 표 사이를 직선으로 잇는 것이 보간입니다.</span>`; }
      else $('#tbR').innerHTML='<span style="color:#BE123C">다시 — 0.5736(35°)과 0.6428(40°) 사이 어디쯤일까요?</span>'; };
  };
  draw();
  inquiry(root,{ id:'tb', title:'삼각비의 표 — 계산기 이전의 계산기',
    q:['5° 간격으로 표를 채우며 기록하세요 (0°~90° 중 8칸 이상).',
       'sin 의 증가폭이 각이 커질수록 어떻게 변하는지 표의 이웃 칸 차이로 정리하세요.',
       'cos(90°−θ) = sin θ 가 표에서 성립하는지 세 쌍으로 확인하고, 직각삼각형 그림으로 이유를 쓰세요.'],
    cols:['θ','sin θ','이웃 칸과의 차'],
    hint:'힌트 — 90° 근처에서 sin 은 거의 안 늘어납니다. 사분원 그림에서 세로가 어디쯤 왔는지 보세요.',
    read:()=>{ const th=+$('#tbT').value;
      return [th+'°', Math.sin(th*Math.PI/180).toFixed(4), '—']; } });
}

/* ---------- LAB 56 원주각 ---------- */
function iaDemo(root){
  root.innerHTML=`<div class="row"><div class="col">
      <canvas id="ia1" width="400" height="320"></canvas>
      <div class="note" style="margin-top:8px"><b>P(주황)</b>는 물론 <b>호의 양 끝 A·B(파랑)</b>도
      끌 수 있습니다. A·B 를 마주보게 벌리면 지름이 됩니다.</div>
    </div>
    <div class="col">
      <div class="out" id="iaout"></div>
      <div class="note" style="margin-top:12px">같은 호 AB 를 바라보는 <b>원주각은 P 가 어디에 있든 같고</b>,
      중심각의 절반입니다. 카메라 시야각이 같아지는 자리들 — 그것이 원입니다.</div>
    </div></div>`;
  const cv=$('#ia1'),ctx=cv.getContext('2d'),W=400,H=320;
  const O={x:200,y:165}, R=130;
  const S={ a:210, b:330, p:90, seen:{} };             // 도 단위 (0=오른쪽, 반시계)
  const pos=d=>({x:O.x+R*Math.cos(d*Math.PI/180), y:O.y-R*Math.sin(d*Math.PI/180)});
  const angAt=(P,A,B)=>{ const v1={x:A.x-P.x,y:A.y-P.y}, v2={x:B.x-P.x,y:B.y-P.y};
    const d=(Math.atan2(v1.y,v1.x)-Math.atan2(v2.y,v2.x))*180/Math.PI;
    let a=Math.abs(d); if(a>180)a=360-a; return a; };
  function central(){ let c=Math.abs(S.a-S.b); if(c>180)c=360-c; return c; }
  function draw(){
    ctx.clearRect(0,0,W,H); ctx.fillStyle='#fff'; ctx.fillRect(0,0,W,H);
    ctx.strokeStyle='#D1D5DB'; ctx.lineWidth=1.6;
    ctx.beginPath(); ctx.arc(O.x,O.y,R,0,7); ctx.stroke();
    const A=pos(S.a), B=pos(S.b), P=pos(S.p);
    // 호 AB (P 반대쪽) 강조
    ctx.strokeStyle='#BE123C'; ctx.lineWidth=3;
    let s=S.a*Math.PI/180, e=S.b*Math.PI/180;
    ctx.beginPath(); ctx.arc(O.x,O.y,R,-s,-e, ((S.b-S.a+360)%360)>180 );
    ctx.stroke();
    // 중심각
    ctx.strokeStyle='#9CA3AF'; ctx.lineWidth=1.2; ctx.setLineDash([3,3]);
    ctx.beginPath(); ctx.moveTo(O.x,O.y); ctx.lineTo(A.x,A.y); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(O.x,O.y); ctx.lineTo(B.x,B.y); ctx.stroke(); ctx.setLineDash([]);
    // 원주각
    ctx.strokeStyle='#2563EB'; ctx.lineWidth=2;
    ctx.beginPath(); ctx.moveTo(P.x,P.y); ctx.lineTo(A.x,A.y); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(P.x,P.y); ctx.lineTo(B.x,B.y); ctx.stroke();
    ctx.fillStyle='#2563EB'; ctx.beginPath(); ctx.arc(A.x,A.y,6,0,7); ctx.fill();
    ctx.beginPath(); ctx.arc(B.x,B.y,6,0,7); ctx.fill();
    ctx.fillStyle='#111827'; ctx.font='bold 11px sans-serif'; ctx.textAlign='center';
    ctx.fillText('A', A.x+(A.x>O.x?14:-14), A.y+4); ctx.fillText('B', B.x+(B.x>O.x?14:-14), B.y+4);
    handle(ctx, P.x, P.y, '#B45309', 'P');
    const c=central(), ins=angAt(P,A,B);
    // 표본: P 위치(10° 반올림)별 원주각 기록
    S.seen[Math.round(S.p/10)*10]=Math.round(ins);
    const vals=Object.values(S.seen), uni=[...new Set(vals)];
    const many=Object.keys(S.seen).length>=3 && Math.max(...vals)-Math.min(...vals)<=1;
    const isDia=Math.abs(c-180)<3;
    $('#iaout').innerHTML =
      `<span class="mono">중심각 ∠AOB = <b>${c.toFixed(0)}°</b> &nbsp; 원주각 ∠APB = <b style="color:#2563EB">${ins.toFixed(1)}°</b></span><br>`
      + `<span class="mono">중심각 ÷ 원주각 = ${(c/ins).toFixed(2)}</span><br>`
      + (isDia?`<b style="color:#0E9384">AB 가 지름 — 반원의 원주각은 90°. 탈레스의 정리입니다.</b><br>`:'')
      + (many?`<b style="color:#2563EB">서로 다른 ${Object.keys(S.seen).length}곳에서 같은 각 — 원주각은 어디서나 같습니다.</b>`
             :`<span style="color:#6B7280;font-size:12.5px">P 를 이리저리 옮기며 원주각이 변하는지 지켜보세요.</span>`);
  }
  dragOn(cv,{
    hit:p=>{ const P=pos(S.p), A=pos(S.a), B=pos(S.b);
      if(Math.hypot(p.x-P.x,p.y-P.y)<24) return 'p';
      if(Math.hypot(p.x-A.x,p.y-A.y)<20) return 'a';
      if(Math.hypot(p.x-B.x,p.y-B.y)<20) return 'b';
      return null; },
    move:(h,p)=>{ let d=Math.atan2(O.y-p.y, p.x-O.x)*180/Math.PI; d=(d+360)%360;
      if(h==='p'){ S.p=d; }
      else { S[h]=Math.round(d/5)*5; S.seen={}; }
      draw(); }
  });
  draw();
  inquiry(root,{ id:'ia', title:'원주각 — 어디서 보나 같은 각',
    q:['P 를 다섯 곳 이상 옮기며 (P 위치, 원주각) 을 기록하세요.',
       '호 AB 를 바꿔 (중심각, 원주각) 짝을 세 가지 이상 만들고 나눗셈 열을 보세요.',
       '「중심각 = 2 × 원주각」 이 되는 이유를 이등변삼각형(OP=OA=OB) 두 개로 손으로 증명해 보세요.'],
    cols:['중심각','원주각','나눗셈'],
    hint:'힌트 — O 에서 P 로 선을 그으면 이등변삼각형 둘로 쪼개집니다. 바깥각 = 두 밑각의 합.',
    read:()=>{ const A=pos(S.a),B=pos(S.b),P=pos(S.p); const c=central(), i=angAt(P,A,B);
      return [c.toFixed(0)+'°', i.toFixed(1)+'°', (c/i).toFixed(2)]; } });
}

/* ---------- LAB 57 원의 접선 — 위성의 가시 범위 ---------- */
function tnDemo(root){
  root.innerHTML=`<div class="row"><div class="col">
      <canvas id="tn1" width="400" height="300"></canvas>
      <div class="ctl" style="margin-top:8px">
        <button class="b t sm" id="tnChk">피타고라스 검산 — OP² − r² = PA² ?</button></div>
    </div>
    <div class="col">
      <div class="out" id="tnout"></div>
      <div class="note" style="margin-top:12px"><b>위성 P(주황)</b>를 끌어 보세요. P 에서 지구에 그은
      <b>두 접선의 길이는 언제나 같고</b>, 접점 사이의 붉은 호가 위성이 내려다보는
      <b>가시 범위</b>입니다. 접선은 반지름과 직각 — 그래서 피타고라스가 통합니다.</div>
    </div></div>`;
  const cv=$('#tn1'),ctx=cv.getContext('2d'),W=400,H=300;
  const O={x:130,y:150}, r=78;
  const S={ px:300, py:80, chk:false };
  function draw(){
    ctx.clearRect(0,0,W,H); ctx.fillStyle='#fff'; ctx.fillRect(0,0,W,H);
    // 지구
    ctx.fillStyle='rgba(14,147,132,.12)';
    ctx.beginPath(); ctx.arc(O.x,O.y,r,0,7); ctx.fill();
    ctx.strokeStyle='#0E9384'; ctx.lineWidth=1.8; ctx.beginPath(); ctx.arc(O.x,O.y,r,0,7); ctx.stroke();
    const d=Math.hypot(S.px-O.x,S.py-O.y);
    const L=Math.sqrt(Math.max(0,d*d-r*r));
    const base=Math.atan2(S.py-O.y,S.px-O.x), half=Math.acos(r/d);
    const A={x:O.x+r*Math.cos(base+half), y:O.y+r*Math.sin(base+half)};
    const B={x:O.x+r*Math.cos(base-half), y:O.y+r*Math.sin(base-half)};
    // 가시 호
    ctx.strokeStyle='#BE123C'; ctx.lineWidth=4;
    ctx.beginPath(); ctx.arc(O.x,O.y,r, base-half, base+half); ctx.stroke();
    // 접선·반지름
    ctx.strokeStyle='#2563EB'; ctx.lineWidth=2;
    ctx.beginPath(); ctx.moveTo(S.px,S.py); ctx.lineTo(A.x,A.y); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(S.px,S.py); ctx.lineTo(B.x,B.y); ctx.stroke();
    ctx.strokeStyle='#9CA3AF'; ctx.setLineDash([3,3]);
    ctx.beginPath(); ctx.moveTo(O.x,O.y); ctx.lineTo(A.x,A.y); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(O.x,O.y); ctx.lineTo(S.px,S.py); ctx.stroke(); ctx.setLineDash([]);
    // 직각 표시
    const ux=(S.px-A.x)/Math.hypot(S.px-A.x,S.py-A.y), uy=(S.py-A.y)/Math.hypot(S.px-A.x,S.py-A.y);
    const vx=(O.x-A.x)/r, vy=(O.y-A.y)/r, m=9;
    ctx.strokeStyle='#BE123C'; ctx.lineWidth=1.4;
    ctx.beginPath(); ctx.moveTo(A.x+ux*m,A.y+uy*m); ctx.lineTo(A.x+ux*m+vx*m,A.y+uy*m+vy*m); ctx.lineTo(A.x+vx*m,A.y+vy*m); ctx.stroke();
    handle(ctx, S.px, S.py, '#B45309','위성 P');
    const vis=(2*half*180/Math.PI);
    $('#tnout').innerHTML =
      `<span class="mono">OP = ${(d/26).toFixed(2)} · r = ${(r/26).toFixed(2)}</span><br>`
      + `접선 PA = PB = <b>${(L/26).toFixed(2)}</b> — 두 접선의 길이는 늘 같습니다.<br>`
      + `<b style="color:#BE123C">가시 범위 ${vis.toFixed(0)}°</b> — 멀수록 넓어지지만 180° 는 절대 못 넘습니다.<br>`
      + (S.chk?`<span class="mono">OP² − r² = ${((d*d-r*r)/676).toFixed(2)} · PA² = ${(L*L/676).toFixed(2)} — <b style="color:#0E9384">PA² 일치!</b></span> 반지름⊥접선이라 피타고라스가 통합니다.`
              :`<span style="color:#6B7280;font-size:12.5px">「피타고라스 검산」으로 접선 길이의 공식을 확인하세요.</span>`);
  }
  dragOn(cv,{
    hit:p=>Math.hypot(p.x-S.px,p.y-S.py)<26?'p':null,
    move:(h,p)=>{ const d=Math.hypot(p.x-O.x,p.y-O.y);
      if(d>r+18){ S.px=Math.max(8,Math.min(W-8,p.x)); S.py=Math.max(8,Math.min(H-8,p.y)); S.chk=false; draw(); } }
  });
  $('#tnChk').onclick=()=>{ S.chk=true; draw(); };
  draw();
  inquiry(root,{ id:'tn', title:'접선 — 위성이 보는 만큼',
    q:['P 를 가깝게·멀게 옮기며 (OP, PA, 가시 범위) 를 기록하세요.',
       '가시 범위가 커지는데도 180° 를 넘지 못하는 이유를 표에서 찾으세요.',
       'PA² = OP² − r² 이 성립하는 이유를 「반지름⊥접선」과 피타고라스 정리로 손으로 쓰세요.'],
    cols:['OP','접선 PA','가시 범위'],
    hint:'힌트 — OP 가 아무리 커져도 접선은 결국 원의 「옆구리」에 닿습니다. 정확히 절반 너머는 볼 수 없습니다.',
    read:()=>{ const d=Math.hypot(S.px-O.x,S.py-O.y), L=Math.sqrt(Math.max(0,d*d-r*r));
      return [(d/26).toFixed(2), (L/26).toFixed(2), (2*Math.acos(r/d)*180/Math.PI).toFixed(0)+'°']; } });
}

/* ---------- LAB 58 내접 사각형 — 대각의 합 ---------- */
function cyDemo(root){
  root.innerHTML=`<div class="row"><div class="col">
      <canvas id="cy1" width="400" height="320"></canvas>
      <div class="note" style="margin-top:8px">네 꼭짓점을 <b>원을 따라</b> 끌면 모양이 변합니다.
      <b>D(주황)만은 원에서 떼어 낼 수도</b> 있습니다 — 떼는 순간 무엇이 무너질까요?</div>
    </div>
    <div class="col">
      <div class="out" id="cyout"></div>
      <div class="note" style="margin-top:12px">원에 내접한 사각형의 <b>마주보는 두 각의 합은 180°</b>.
      네 점이 한 원 위에 있다는 강한 조건이 각도를 묶어 버립니다 —
      거꾸로, 대각합 180° 는 「네 점이 한 원 위」의 판정 시험지입니다.</div>
    </div></div>`;
  const cv=$('#cy1'),ctx=cv.getContext('2d'),W=400,H=320;
  const O={x:200,y:160}, R=125;
  const S={ ang:{A:150,B:70,C:-40}, D:{x:O.x+R*Math.cos(-2.9), y:O.y-R*Math.sin(-2.9)}, seen:new Set() };
  const pos=d=>({x:O.x+R*Math.cos(d*Math.PI/180), y:O.y-R*Math.sin(d*Math.PI/180)});
  const inner=(P,Q,R2)=>{ const v1={x:Q.x-P.x,y:Q.y-P.y}, v2={x:R2.x-P.x,y:R2.y-P.y};
    let a=Math.abs((Math.atan2(v1.y,v1.x)-Math.atan2(v2.y,v2.x))*180/Math.PI);
    if(a>180)a=360-a; return a; };
  function draw(){
    ctx.clearRect(0,0,W,H); ctx.fillStyle='#fff'; ctx.fillRect(0,0,W,H);
    ctx.strokeStyle='#D1D5DB'; ctx.lineWidth=1.6;
    ctx.beginPath(); ctx.arc(O.x,O.y,R,0,7); ctx.stroke();
    const A=pos(S.ang.A), B=pos(S.ang.B), C=pos(S.ang.C), D=S.D;
    const onCircle=Math.abs(Math.hypot(D.x-O.x,D.y-O.y)-R)<7;
    ctx.strokeStyle='#2563EB'; ctx.lineWidth=2; ctx.fillStyle='rgba(37,99,235,.07)';
    ctx.beginPath(); ctx.moveTo(A.x,A.y); ctx.lineTo(B.x,B.y); ctx.lineTo(C.x,C.y); ctx.lineTo(D.x,D.y); ctx.closePath();
    ctx.fill(); ctx.stroke();
    [[A,'A','#2563EB'],[B,'B','#2563EB'],[C,'C','#2563EB']].forEach(([P,nm,col])=>{
      ctx.fillStyle=col; ctx.beginPath(); ctx.arc(P.x,P.y,6,0,7); ctx.fill();
      ctx.fillStyle='#111827'; ctx.font='bold 11px sans-serif'; ctx.textAlign='center';
      ctx.fillText(nm, P.x+(P.x>O.x?14:-14), P.y+4); });
    handle(ctx, D.x, D.y, onCircle?'#B45309':'#BE123C','D');
    const aA=inner(A,B,D), aC=inner(C,B,D), aB=inner(B,A,C), aD=inner(D,A,C);
    const s1=aA+aC, s2=aB+aD;
    if(onCircle){
      const key=[S.ang.A,S.ang.B,S.ang.C].map(v=>Math.round(v/15)).join(',');
      S.seen.add(key);
    }
    const many=onCircle && S.seen.size>=3;
    $('#cyout').innerHTML =
      `<span class="mono">∠A + ∠C = ${aA.toFixed(0)}° + ${aC.toFixed(0)}° = <b>${s1.toFixed(0)}°</b><br>∠B + ∠D = ${aB.toFixed(0)}° + ${aD.toFixed(0)}° = <b>${s2.toFixed(0)}°</b></span><br>`
      + (onCircle
        ? (many?`<b style="color:#0E9384">세 모양 모두 180° — 내접 사각형의 약속입니다.</b>`
               :`<span style="color:#6B7280;font-size:12.5px">꼭짓점들을 끌어 다른 모양에서도 확인해 보세요.</span>`)
        : `<b style="color:#BE123C">D 가 원을 떠났습니다 — 대각합 ${s2.toFixed(0)}°, 180° 이 무너집니다.</b> 원 위라는 조건이 각을 묶고 있었던 것입니다.`);
  }
  dragOn(cv,{
    hit:p=>{ if(Math.hypot(p.x-S.D.x,p.y-S.D.y)<24) return 'D';
      for(const k of ['A','B','C']){ const P=pos(S.ang[k]);
        if(Math.hypot(p.x-P.x,p.y-P.y)<20) return k; }
      return null; },
    move:(h,p)=>{
      if(h==='D'){ const d=Math.hypot(p.x-O.x,p.y-O.y);
        if(Math.abs(d-R)<16){ const a=Math.atan2(O.y-p.y,p.x-O.x); S.D={x:O.x+R*Math.cos(a), y:O.y-R*Math.sin(a)}; }
        else S.D={x:p.x,y:p.y}; }
      else { let d=Math.atan2(O.y-p.y, p.x-O.x)*180/Math.PI; S.ang[h]=d; }
      draw(); }
  });
  draw();
  inquiry(root,{ id:'cy', title:'내접 사각형 — 원이 각을 묶는다',
    q:['모양을 바꿔 가며 (∠A+∠C, ∠B+∠D) 를 다섯 번 기록하세요.',
       'D 를 원 밖·안으로 옮길 때 합이 각각 어느 쪽으로 틀어지는지 정리하세요.',
       '대각합 180° 가 되는 이유를 원주각으로 증명하세요 — ∠A 와 ∠C 가 바라보는 두 호를 합치면 원 전체가 됩니다.'],
    cols:['∠A+∠C','∠B+∠D','D는 원 위?'],
    hint:'힌트 — ∠A 는 호 BCD 의 절반, ∠C 는 호 DAB 의 절반. 두 호를 합치면 360°.',
    read:()=>{ const A=pos(S.ang.A),B=pos(S.ang.B),C=pos(S.ang.C),D=S.D;
      const on=Math.abs(Math.hypot(D.x-O.x,D.y-O.y)-R)<7;
      return [(inner(A,B,D)+inner(C,B,D)).toFixed(0)+'°',(inner(B,A,C)+inner(D,A,C)).toFixed(0)+'°',on?'예':'아니오']; } });
}

/* ---------- LAB 59 상자그림 ---------- */
function bxDemo(root){
  root.innerHTML=`<div class="row"><div class="col">
      <canvas id="bx1" width="400" height="300"></canvas>
      <div class="note" style="margin-top:8px">수직선 위의 <b>기록 점들을 좌우로</b> 끌 수 있습니다.
      상자·수염·이상치 표시가 실시간으로 다시 그려집니다.</div>
    </div>
    <div class="col">
      <div class="out" id="bxout"></div>
      <div class="note" style="margin-top:12px">상자그림은 다섯 수(최소·Q1·중앙값·Q3·최대) 요약입니다.
      수염 길이의 한계는 <b>1.5 × IQR</b> — 그 밖의 점은 자동으로 <b>이상치</b>로 분리됩니다.</div>
    </div></div>`;
  const cv=$('#bx1'),ctx=cv.getContext('2d'),W=400,H=300;
  const S={ v:[12,14,15,16,17,18,18,19,20,21,22,24,26] };
  const X=v=>30+(v-0)*(W-60)/60, invX=p=>Math.round((p-30)*60/(W-60));
  const q=(arr,f)=>{ const s=[...arr].sort((a,b)=>a-b); const i=(s.length-1)*f;
    const lo=Math.floor(i), hi=Math.ceil(i); return s[lo]+(s[hi]-s[lo])*(i-lo); };
  function draw(){
    ctx.clearRect(0,0,W,H); ctx.fillStyle='#fff'; ctx.fillRect(0,0,W,H);
    const v=S.v, Q1=q(v,.25), MD=q(v,.5), Q3=q(v,.75), IQR=Q3-Q1;
    const lo=Q1-1.5*IQR, hi=Q3+1.5*IQR;
    const ins=v.filter(x=>x>=lo&&x<=hi), outs=v.filter(x=>x<lo||x>hi);
    const mn=Math.min(...ins), mx=Math.max(...ins);
    const mean=v.reduce((a,b)=>a+b,0)/v.length;
    // 수직선 + 점
    const ry=230;
    ctx.strokeStyle='#9CA3AF'; ctx.beginPath(); ctx.moveTo(20,ry); ctx.lineTo(W-16,ry); ctx.stroke();
    for(let t=0;t<=60;t+=10){ ctx.strokeStyle='#374151';
      ctx.beginPath(); ctx.moveTo(X(t),ry-4); ctx.lineTo(X(t),ry+4); ctx.stroke();
      ctx.fillStyle='#6B7280'; ctx.font='10px sans-serif'; ctx.textAlign='center';
      ctx.fillText(t, X(t), ry+17); }
    v.forEach(x=>{ ctx.fillStyle=(x<lo||x>hi)?'#BE123C':'#2563EB';
      ctx.beginPath(); ctx.arc(X(x),ry-16,6,0,7); ctx.fill(); });
    // 상자그림
    const by=110, bh=44;
    ctx.strokeStyle='#374151'; ctx.lineWidth=1.6;
    ctx.beginPath(); ctx.moveTo(X(mn),by+bh/2); ctx.lineTo(X(Q1),by+bh/2); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(X(Q3),by+bh/2); ctx.lineTo(X(mx),by+bh/2); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(X(mn),by+10); ctx.lineTo(X(mn),by+bh-10); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(X(mx),by+10); ctx.lineTo(X(mx),by+bh-10); ctx.stroke();
    ctx.fillStyle='rgba(37,99,235,.15)'; ctx.fillRect(X(Q1),by,X(Q3)-X(Q1),bh);
    ctx.strokeStyle='#2563EB'; ctx.strokeRect(X(Q1),by,X(Q3)-X(Q1),bh);
    ctx.strokeStyle='#0E9384'; ctx.lineWidth=2.6;
    ctx.beginPath(); ctx.moveTo(X(MD),by); ctx.lineTo(X(MD),by+bh); ctx.stroke();
    outs.forEach(x=>{ ctx.fillStyle='#BE123C';
      ctx.beginPath(); ctx.arc(X(x),by+bh/2,5,0,7); ctx.fill(); });
    // 평균 삼각형
    ctx.fillStyle='#B45309';
    ctx.beginPath(); ctx.moveTo(X(mean),by-14); ctx.lineTo(X(mean)-6,by-4); ctx.lineTo(X(mean)+6,by-4); ctx.closePath(); ctx.fill();
    ctx.fillStyle='#92400E'; ctx.font='10px sans-serif'; ctx.textAlign='center';
    ctx.fillText('평균', X(mean), by-18);
    $('#bxout').innerHTML =
      `<span class="mono">Q1=${Q1.toFixed(1)} · 중앙값=${MD.toFixed(1)} · Q3=${Q3.toFixed(1)} · IQR=${IQR.toFixed(1)}</span><br>`
      + `수염 한계: ${lo.toFixed(1)} ~ ${hi.toFixed(1)}<br>`
      + (outs.length?`<b style="color:#BE123C">수염 밖 이상치 ${outs.length}개</b> — 상자그림이 자동으로 골라냈습니다.<br>`
                    :`이상치 없음 — 모두 수염 안에 있습니다.<br>`)
      + `<span class="mono">평균 ${mean.toFixed(1)} vs 중앙값 ${MD.toFixed(1)}</span>`
      + (outs.length&&Math.abs(mean-MD)>1.5?` — <b style="color:#B45309">평균만 끌려갔습니다. 상자는 강건합니다.</b>`:'');
  }
  dragOn(cv,{
    hit:p=>{ if(Math.abs(p.y-(230-16))>18) return null;
      let best=-1,bd=20;
      S.v.forEach((x,i)=>{ const d=Math.abs(p.x-X(x)); if(d<bd){bd=d;best=i;} });
      return best>=0?String(best):null; },
    move:(h,p)=>{ S.v[+h]=Math.max(0,Math.min(60,invX(p.x))); draw(); }
  });
  draw();
  inquiry(root,{ id:'bx', title:'상자그림 — 다섯 수로 그린 분포',
    q:['점 하나를 끌어 멀리 보내며 (그 값, 이상치 여부, 평균, 중앙값) 을 기록하세요.',
       '수염 한계(1.5×IQR)를 넘는 순간이 정확히 어디인지 표에서 찾으세요.',
       '평균은 끌려가는데 중앙값·상자가 버티는 이유를 쓰고, 이상치를 「자동으로」 정의할 수 있다는 것의 가치를 정리하세요.'],
    cols:['움직인 값','이상치?','평균','중앙값'],
    hint:'힌트 — 상자는 「순서」로만 만들어집니다. 값 하나가 아무리 커져도 순서는 한 칸만 바뀝니다.',
    read:()=>{ const v=S.v, Q1=q(v,.25), Q3=q(v,.75), IQR=Q3-Q1;
      const mx=Math.max(...v), out=mx>Q3+1.5*IQR;
      return [mx, out?'이상치':'수염 안', (v.reduce((a,b)=>a+b,0)/v.length).toFixed(1), q(v,.5).toFixed(1)]; } });
}

/* ---------- LAB 60 이상치와 상관 ---------- */
function ocDemo(root){
  root.innerHTML=`<div class="row"><div class="col">
      <canvas id="oc1" width="400" height="300"></canvas>
      <div class="ctl" style="margin-top:8px">
        <label class="ctl" style="margin:0"><input type="checkbox" id="ocEx"> 이상치를 제외하고 다시 계산</label>
        <button class="b g sm" id="ocRst">이상치 지우기</button></div>
    </div>
    <div class="col">
      <div class="out" id="ocout"></div>
      <div class="note" style="margin-top:12px">파란 점: 공부시간·성적 12명. <b>빈 곳(특히 구석)을 클릭</b>하면
      이상치가 추가됩니다. 점 하나가 상관계수 r 을 어디까지 끌고 내려가는지,
      제외 토글이 그것을 어떻게 되살리는지 보세요.</div>
    </div></div>`;
  const cv=$('#oc1'),ctx=cv.getContext('2d'),W=400,H=300;
  const BASE=[[1,42],[1.5,50],[2,48],[2.5,58],[3,55],[3.5,66],[4,62],[4.5,72],[5,70],[5.5,80],[6,78],[6.5,88]];
  const S={ outs:[] };
  const X=v=>40+v*(W-70)/8, Y=v=>H-40-(v-30)*(H-70)/70;
  const invP=p=>[ (p.x-40)*8/(W-70), 30+(H-40-p.y)*70/(H-70) ];
  function corr(pts){ const n=pts.length;
    const mx=pts.reduce((a,p)=>a+p[0],0)/n, my=pts.reduce((a,p)=>a+p[1],0)/n;
    let sxy=0,sx=0,sy=0;
    pts.forEach(p=>{ sxy+=(p[0]-mx)*(p[1]-my); sx+=(p[0]-mx)**2; sy+=(p[1]-my)**2; });
    return sxy/Math.sqrt(sx*sy); }
  function draw(){
    ctx.clearRect(0,0,W,H); ctx.fillStyle='#fff'; ctx.fillRect(0,0,W,H);
    ctx.strokeStyle='#E8ECF2';
    for(let i=0;i<=8;i++){ ctx.beginPath(); ctx.moveTo(X(i),20); ctx.lineTo(X(i),H-40); ctx.stroke(); }
    ctx.strokeStyle='#9CA3AF'; ctx.lineWidth=1.3;
    ctx.beginPath(); ctx.moveTo(X(0),H-40); ctx.lineTo(X(8),H-40); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(X(0),H-40); ctx.lineTo(X(0),20); ctx.stroke();
    ctx.fillStyle='#6B7280'; ctx.font='10px sans-serif'; ctx.textAlign='center';
    ctx.fillText('공부시간', W-40, H-24); ctx.fillText('성적', 24, 16);
    BASE.forEach(p=>{ ctx.fillStyle='#2563EB';
      ctx.beginPath(); ctx.arc(X(p[0]),Y(p[1]),5.5,0,7); ctx.fill(); });
    S.outs.forEach(p=>{ ctx.fillStyle='#BE123C';
      ctx.beginPath(); ctx.arc(X(p[0]),Y(p[1]),7,0,7); ctx.fill();
      ctx.strokeStyle='#BE123C'; ctx.beginPath(); ctx.arc(X(p[0]),Y(p[1]),11,0,7); ctx.stroke(); });
    const r0=corr(BASE);
    const ex=$('#ocEx').checked;
    const all=ex?BASE:BASE.concat(S.outs);
    const r=corr(all);
    let msg;
    if(!S.outs.length) msg=`<span style="color:#6B7280;font-size:12.5px">구석(예: 오래 공부했는데 낮은 점수)을 클릭해 이상치를 넣어 보세요.</span>`;
    else if(ex) msg=`<b style="color:#0E9384">제외 후 r = ${r.toFixed(2)} — 상관이 회복됐습니다.</b> 단, 지우기 전에 「왜 저 점이 나왔나」를 물어야 합니다.`;
    else if(r0-r>0.25) msg=`<b style="color:#BE123C">r 이 ${r0.toFixed(2)} → ${r.toFixed(2)} — 점 ${S.outs.length}개가 상관을 무너뜨렸습니다.</b>`;
    else msg=`이상치가 아직 온순합니다 — 더 구석에 찍어 보세요.`;
    $('#ocout').innerHTML =
      `<span class="mono" style="font-size:16px">r = <b>${r.toFixed(3)}</b></span> <span class="mono" style="color:#6B7280">(원래 ${r0.toFixed(3)})</span><br>`+msg;
  }
  cv.style.touchAction='none';
  cv.addEventListener('pointerdown',e=>{
    const rct=cv.getBoundingClientRect();
    const p={x:(e.clientX-rct.left)*W/rct.width, y:(e.clientY-rct.top)*H/rct.height};
    const [vx,vy]=invP(p);
    if(vx<0||vx>8||vy<30||vy>100) return;
    const nearBase=BASE.some(b=>Math.hypot(X(b[0])-p.x,Y(b[1])-p.y)<14);
    if(nearBase) return;
    if(S.outs.length<3){ S.outs.push([Math.round(vx*2)/2, Math.round(vy)]); draw(); }
  });
  $('#ocEx').onchange=draw;
  $('#ocRst').onclick=()=>{ S.outs=[]; $('#ocEx').checked=false; draw(); };
  draw();
  inquiry(root,{ id:'oc', title:'이상치와 상관 — 점 하나의 권력',
    q:['이상치를 위치를 바꿔 가며 넣고 (위치, r) 을 기록하세요. 어느 구석이 가장 파괴적인가요?',
       '「제외 후 r」 열과 원래 r 을 비교해 제외의 효과를 정리하세요.',
       '이상치를 지워도 되는 경우와 지우면 안 되는 경우를 하나씩 만들어 쓰세요 — 입력 실수와 진짜 특이 사례는 다릅니다.'],
    cols:['이상치 위치','r (포함)','r (제외)'],
    hint:'힌트 — r 은 평균에서 잰 거리의 곱으로 만들어집니다. 평균에서 멀수록 한 점의 발언권이 커집니다.',
    read:()=>{ const r1=corr(BASE.concat(S.outs)), r2=corr(BASE);
      return [S.outs.map(p=>'('+p[0]+','+p[1]+')').join(' ')||'없음', r1.toFixed(3), r2.toFixed(3)]; } });
}
