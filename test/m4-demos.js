/* ═══════════════ 공통수학1 (LAB 92~101) ═══════════════ */

/* ---------- LAB 92 조립제법 ---------- */
function snDemo(root){
  root.innerHTML=`<div class="row"><div class="col">
      <canvas id="sn1" width="400" height="250"></canvas>
      <div class="ctl" style="display:flex;gap:6px;flex-wrap:wrap;margin-top:8px">
        ${slider('snK','나눗수 (x − k) 의 k',-3,3,1,0,'')}
        <button class="b t sm" id="snGo">한 칸 진행 ▶</button>
        <button class="b g sm" id="snRst">처음부터</button></div>
    </div>
    <div class="col">
      <div class="out" id="snout"></div>
      <div class="note" style="margin-top:12px">x³ − 2x² − 5x + 6 을 (x − k) 로 나눕니다.
      <b>내리고 → k 곱하고 → 더하고</b> — 계수만으로 나눗셈이 끝나는 것이 조립제법입니다.
      마지막 칸이 나머지 R 이고, k 를 잘 고르면 R = 0 이 됩니다.</div>
    </div></div>`;
  const cv=$('#sn1'),ctx=cv.getContext('2d'),W=400,H=250;
  const CO=[1,-2,-5,6];
  const S={ k:0, st:0, row:[], done:false };
  function calc(){
    S.row=[CO[0]];
    for(let i=1;i<4;i++) S.row.push(CO[i]+S.row[i-1]*S.k);
  }
  function draw(){
    calc();
    ctx.clearRect(0,0,W,H); ctx.fillStyle='#fff'; ctx.fillRect(0,0,W,H);
    const cx=110, cw=66, y0=60, y1=105, y2=150;
    ctx.fillStyle='#374151'; ctx.font='bold 14px ui-monospace,monospace'; ctx.textAlign='center';
    ctx.fillText('k = '+S.k, 50, y0+5);
    ctx.strokeStyle='#9CA3AF'; ctx.lineWidth=1.4;
    ctx.beginPath(); ctx.moveTo(76,30); ctx.lineTo(76,170); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(80,y2-22); ctx.lineTo(W-16,y2-22); ctx.stroke();
    CO.forEach((c,i)=>{ ctx.fillStyle='#111827';
      ctx.fillText(c, cx+i*cw, y0+5); });
    for(let i=0;i<4;i++){
      if(i>0 && i<=S.st){ ctx.fillStyle='#B45309';
        ctx.fillText((S.row[i-1]*S.k), cx+i*cw, y1+5); }
      if(i<=S.st){ ctx.fillStyle=i===3?'#BE123C':'#0E9384';
        ctx.font='bold 15px ui-monospace,monospace';
        ctx.fillText(S.row[i], cx+i*cw, y2+5);
        ctx.font='bold 14px ui-monospace,monospace'; }
    }
    ctx.fillStyle='#6B7280'; ctx.font='10.5px sans-serif';
    ctx.fillText('내림', cx, y2+24);
    if(S.st>=3){ ctx.fillStyle='#BE123C'; ctx.font='bold 11px sans-serif';
      ctx.fillText('나머지', cx+3*cw, y2+24); }
    const R=S.row[3];
    $('#snout').innerHTML =
      `<span class="mono">x³ − 2x² − 5x + 6 ÷ (x − ${S.k})</span><br>`
      + (S.st<3
        ? `진행 ${S.st} / 3 — 「한 칸 진행」으로 <b>${S.st===0?'첫 계수를 내리세요':'k 곱해 더하세요'}</b>.`
        : `<b style="color:#0E9384">조립 완료 — 나머지 R = ${R}</b><br>
           몫: <span class="mono">x² ${S.row[1]>=0?'+ '+S.row[1]:'− '+(-S.row[1])}x ${S.row[2]>=0?'+ '+S.row[2]:'− '+(-S.row[2])}</span><br>`
          + (R===0
            ? `<b style="color:#BE123C">R = 0 — (x − ${S.k}) 는 인수!</b> 나누어떨어졌습니다.`
            : `<span class="mono">f(${S.k}) = ${CO[0]*S.k**3+CO[1]*S.k**2+CO[2]*S.k+CO[3]}</span> — 직접 대입한 값과 나머지가 같습니다(나머지정리의 예고).`));
  }
  $('#snGo').onclick=()=>{ if(S.st<3){ S.st++; draw(); } };
  $('#snRst').onclick=()=>{ S.st=0; draw(); };
  $('#snK').oninput=()=>{ S.k=+$('#snK').value; S.st=0; draw(); };
  draw();
  inquiry(root,{ id:'sn', title:'조립제법 — 계수만으로 나눗셈',
    q:['k 를 −3~3 으로 바꿔 가며 (k, 나머지 R) 표를 채우세요.',
       'R = 0 이 되는 k 를 모두 찾고, 그 k 들이 f(x) 와 어떤 관계인지 쓰세요.',
       '「내리고 · 곱하고 · 더하고」가 세로셈 나눗셈의 어느 동작과 같은지 짝지어 설명하세요.'],
    cols:['k','몫의 계수','나머지 R','f(k)'],
    hint:'힌트 — 마지막 칸(R)과 f(k) 를 나란히 적어 보세요. 늘 같습니다. 우연일까요?',
    read:()=>{ calc(); const R=S.row[3];
      return [S.k, S.row.slice(0,3).join(', '), S.st>=3?R:'미완',
        CO[0]*S.k**3+CO[1]*S.k**2+CO[2]*S.k+CO[3]]; } });
}

/* ---------- LAB 93 나머지정리·인수정리 ---------- */
function rmDemo(root){
  root.innerHTML=`<div class="row"><div class="col">
      <canvas id="rm1" width="400" height="290"></canvas>
      <div class="ctl" style="margin-top:8px">
        <button class="b t sm" id="rmChk">실제로 나눠 나머지 확인</button>
        <button class="b g sm" id="rmRst">발견 지우기</button></div>
    </div>
    <div class="col">
      <div class="out" id="rmout"></div>
      <div class="note" style="margin-top:12px">f(x) = x³ − 4x² + x + 6.
      <b>주황 점 a 를 끌면 f(a) 가 즉시</b> 계산됩니다. 「실제로 나눠 확인」이
      (x−a) 로 나눈 나머지를 보여 줍니다 — 둘이 늘 같은 것이 나머지정리,
      f(a) = 0 인 a 가 곧 인수를 알려 주는 것이 인수정리입니다.</div>
    </div></div>`;
  const cv=$('#rm1'),ctx=cv.getContext('2d'),W=400,H=290;
  const f=x=>x**3-4*x*x+x+6;
  const S={ a:0.5, chk:false, roots:new Set() };
  const X=v=>W/2+v*44, Y=v=>150-v*9;
  const invX=p=>(p-W/2)/44;
  function draw(){
    ctx.clearRect(0,0,W,H); ctx.fillStyle='#fff'; ctx.fillRect(0,0,W,H);
    ctx.strokeStyle='#9CA3AF'; ctx.lineWidth=1.3;
    ctx.beginPath(); ctx.moveTo(10,Y(0)); ctx.lineTo(W-10,Y(0)); ctx.stroke();
    ctx.strokeStyle='#2563EB'; ctx.lineWidth=2.2; ctx.beginPath();
    for(let i=0;i<=160;i++){ const x=-2.2+6*i/160, y=Math.max(-14,Math.min(14,f(x)));
      const px=X(x), py=Y(y); i?ctx.lineTo(px,py):ctx.moveTo(px,py); }
    ctx.stroke();
    S.roots.forEach(r=>{ ctx.fillStyle='#0E9384';
      ctx.beginPath(); ctx.arc(X(r),Y(0),6,0,7); ctx.fill(); });
    const fa=f(S.a);
    ctx.strokeStyle='#B45309'; ctx.setLineDash([3,3]);
    ctx.beginPath(); ctx.moveTo(X(S.a),Y(0)); ctx.lineTo(X(S.a),Y(Math.max(-14,Math.min(14,fa)))); ctx.stroke();
    ctx.setLineDash([]);
    handle(ctx, X(S.a), Y(0), '#B45309', 'a = '+S.a.toFixed(1));
    const isRoot=Math.abs(fa)<1e-9;
    $('#rmout').innerHTML =
      `<span class="mono">f(${S.a.toFixed(1)}) = ${fa.toFixed(2)}</span><br>`
      + (S.chk? `(x − ${S.a.toFixed(1)}) 로 나눈 나머지 = <b>${fa.toFixed(2)}</b> — <b style="color:#0E9384">f(a) 와 같습니다. 나머지정리!</b><br>`:'')
      + (isRoot? `<b style="color:#BE123C">근 발견 — (x − ${Math.round(S.a)}) 는 f 의 인수입니다.</b><br>`:'')
      + (S.roots.size>=3
        ? `<b style="color:#0E9384">세 근 모두 발견 — 완전 인수분해 f(x) = (x+1)(x−2)(x−3)</b>`
        : `<span style="color:#6B7280;font-size:12.5px">찾은 근 ${S.roots.size} / 3 — 곡선이 x축을 지나는 자리를 노리세요 (0.1 단위 자석).</span>`);
  }
  dragOn(cv,{
    hit:p=>Math.hypot(p.x-X(S.a),p.y-Y(0))<26?'a':null,
    move:(h,p)=>{ let a=Math.round(invX(p.x)*10)/10;
      [-1,2,3].forEach(r=>{ if(Math.abs(a-r)<0.15) a=r; });
      S.a=Math.max(-2.2,Math.min(3.8,a)); S.chk=false;
      if(Math.abs(f(S.a))<1e-9) S.roots.add(Math.round(S.a));
      draw(); }
  });
  $('#rmChk').onclick=()=>{ S.chk=true; draw(); };
  $('#rmRst').onclick=()=>{ S.roots=new Set(); S.chk=false; draw(); };
  draw();
  inquiry(root,{ id:'rm', title:'나머지정리 — 나누지 않고 아는 나머지',
    q:['a 다섯 곳에서 (a, f(a), 나눈 나머지) 를 기록하세요.',
       'f(a) = 0 인 a 세 개를 찾고, 그때의 인수를 각각 쓰세요.',
       'f(x) = (x−a)Q(x) + R 에 x = a 를 넣으면 무슨 일이 생기는지 손으로 써서 나머지정리를 증명하세요.'],
    cols:['a','f(a)','나눈 나머지','같은가'],
    hint:'힌트 — 나눗셈 등식에 x = a 를 대입하면 Q(x) 항이 통째로 사라집니다.',
    read:()=>[S.a.toFixed(1), f(S.a).toFixed(2), S.chk?f(S.a).toFixed(2):'미확인', S.chk?'같다':'—'] });
}

/* ---------- LAB 94 복소수 — i 를 곱하면 90° 회전 ---------- */
function cxDemo(root){
  root.innerHTML=`<div class="row"><div class="col">
      <canvas id="cx1" width="400" height="300"></canvas>
      <div class="ctl" style="display:flex;gap:6px;flex-wrap:wrap;margin-top:8px">
        <button class="b t" id="cxMul">× i</button>
        <button class="b g sm" id="cxCj">켤레 보기</button>
        <button class="b g sm" id="cxRst">처음부터</button></div>
    </div>
    <div class="col">
      <div class="out" id="cxout"></div>
      <div class="note" style="margin-top:12px">복소수 z = a + bi 는 평면의 점 (a, b).
      <b>주황 점을 끌어 z 를 정하고 「× i」</b>를 눌러 보세요 — 곱셈이
      그림에서는 회전이라는 것, 네 번이면 제자리라는 것이 복소평면의 첫 발견입니다.</div>
    </div></div>`;
  const cv=$('#cx1'),ctx=cv.getContext('2d'),W=400,H=300;
  const O={x:200,y:150}, SC=34;
  const S={ a:3, b:1, n:0, cj:false, trail:[] };
  const cur=()=>{ let re=S.a, im=S.b;
    for(let k=0;k<S.n;k++){ const t=re; re=-im; im=t; }
    return [re,im]; };
  function draw(){
    ctx.clearRect(0,0,W,H); ctx.fillStyle='#fff'; ctx.fillRect(0,0,W,H);
    ctx.strokeStyle='#E8ECF2';
    for(let v=-5;v<=5;v++){ ctx.beginPath(); ctx.moveTo(O.x+v*SC,10); ctx.lineTo(O.x+v*SC,H-10); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(20,O.y+v*SC); ctx.lineTo(W-20,O.y+v*SC); ctx.stroke(); }
    ctx.strokeStyle='#9CA3AF'; ctx.lineWidth=1.4;
    ctx.beginPath(); ctx.moveTo(20,O.y); ctx.lineTo(W-20,O.y); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(O.x,10); ctx.lineTo(O.x,H-10); ctx.stroke();
    ctx.fillStyle='#6B7280'; ctx.font='10px sans-serif';
    ctx.fillText('실수축', W-42, O.y-6); ctx.fillText('허수축', O.x+6, 20);
    // 궤적
    S.trail.forEach(([re,im],i)=>{ ctx.fillStyle='rgba(37,99,235,.35)';
      ctx.beginPath(); ctx.arc(O.x+re*SC, O.y-im*SC, 4, 0, 7); ctx.fill(); });
    const [re,im]=cur();
    ctx.strokeStyle='#2563EB'; ctx.lineWidth=2.2;
    ctx.beginPath(); ctx.moveTo(O.x,O.y); ctx.lineTo(O.x+re*SC,O.y-im*SC); ctx.stroke();
    ctx.fillStyle='#2563EB'; ctx.beginPath(); ctx.arc(O.x+re*SC,O.y-im*SC,6,0,7); ctx.fill();
    if(S.n===0) handle(ctx, O.x+S.a*SC, O.y-S.b*SC, '#B45309','z');
    if(S.cj){ ctx.strokeStyle='#0E9384'; ctx.setLineDash([4,3]); ctx.lineWidth=1.8;
      ctx.beginPath(); ctx.moveTo(O.x,O.y); ctx.lineTo(O.x+re*SC,O.y+im*SC); ctx.stroke(); ctx.setLineDash([]);
      ctx.fillStyle='#0E9384'; ctx.beginPath(); ctx.arc(O.x+re*SC,O.y+im*SC,5,0,7); ctx.fill(); }
    const zs=(r,i2)=>`${r}${i2>=0?' + '+i2:' − '+(-i2)}i`;
    $('#cxout').innerHTML =
      `<span class="mono">z = ${zs(S.a,S.b)} &nbsp;·&nbsp; 지금: i<sup>${S.n%4}</sup>·z = ${zs(re,im)}</span><br>`
      + (S.n>0? `<b style="color:#2563EB">× i 는 +90° 회전</b> — 길이는 그대로, 방향만 돕니다.<br>`:'')
      + (S.n>0&&S.n%4===0? `<b style="color:#0E9384">네 바퀴에 제자리 — i⁴ = 1 입니다.</b><br>`:'')
      + (S.cj? `<b style="color:#0B6E63">켤레 z̄ = ${zs(re,-im)} — 실수축 거울 대칭입니다.</b> z·z̄ = ${re*re+im*im} (실수!)`
             : `<span style="color:#6B7280;font-size:12.5px">「× i」 를 누르며 점의 발자국을 지켜보세요.</span>`);
  }
  dragOn(cv,{
    hit:p=>{ if(S.n>0) return null;
      return Math.hypot(p.x-(O.x+S.a*SC), p.y-(O.y-S.b*SC))<24?'z':null; },
    move:(h,p)=>{ S.a=Math.max(-4,Math.min(4,Math.round((p.x-O.x)/SC)));
      S.b=Math.max(-3,Math.min(3,Math.round((O.y-p.y)/SC)));
      if(S.a===0&&S.b===0) S.a=1;
      S.trail=[[S.a,S.b]]; draw(); }
  });
  $('#cxMul').onclick=()=>{ S.n++; S.trail.push(cur()); draw(); };
  $('#cxCj').onclick=()=>{ S.cj=!S.cj; draw(); };
  $('#cxRst').onclick=()=>{ S.n=0; S.cj=false; S.trail=[[S.a,S.b]]; draw(); };
  draw();
  inquiry(root,{ id:'cx', title:'복소평면 — 곱셈이 회전이 되는 곳',
    q:['z 를 세 가지로 바꿔 가며 ×i 네 번의 발자국을 기록하세요.',
       'i⁰, i¹, i², i³, i⁴ 의 값을 표로 정리하고 주기를 쓰세요.',
       '(a+bi)·i = −b+ai 를 손으로 전개하고, 이 계산이 왜 「90° 회전」과 같은지 두 점의 위치로 설명하세요.'],
    cols:['z','×i 1번','×i 2번','×i 4번'],
    hint:'힌트 — i² = −1 은 「90° 를 두 번 = 180°」, 즉 부호 뒤집기입니다.',
    read:()=>{ const t=S.trail;
      const zs=q=>q?`${q[0]}+${q[1]}i`:'—';
      return [zs([S.a,S.b]), zs(t[1]), zs(t[2]), zs(t[4])]; } });
}

/* ---------- LAB 95 근과 계수의 관계 ---------- */
function vtDemo(root){
  root.innerHTML=`<div class="row"><div class="col">
      <canvas id="vt1" width="400" height="260"></canvas>
      <div class="ctl" style="display:flex;gap:6px;flex-wrap:wrap;margin-top:8px">
        ${slider('vtB','b (x의 계수)',-8,8,1,1,'')}
        ${slider('vtC','c (상수항)',-12,12,1,-2,'')}
        <button class="b t sm" id="vtQ">수 맞히기 도전</button></div>
      <div id="vtQz" style="margin-top:6px;font-weight:800"></div>
    </div>
    <div class="col">
      <div class="out" id="vtout"></div>
      <div class="note" style="margin-top:12px">x² + bx + c = 0 의 두 근을 구하지 않아도
      <b>합은 −b, 곱은 c</b> — 계수가 근의 정보를 통째로 들고 있습니다.
      「수 맞히기」는 이 관계를 거꾸로 쓰는 게임입니다: 합 S·곱 P 인 두 수 = t² − St + P 의 두 근.</div>
    </div></div>`;
  const cv=$('#vt1'),ctx=cv.getContext('2d'),W=400,H=260;
  const S={ quiz:null, win:0 };
  const QS=[{s:5,p:6},{s:-1,p:-12},{s:2,p:-15}];
  function roots(b,c){ const D=b*b-4*c;
    if(D<0) return null;
    return [(-b-Math.sqrt(D))/2, (-b+Math.sqrt(D))/2]; }
  function draw(){
    const b=+$('#vtB').value, c=+$('#vtC').value;
    ctx.clearRect(0,0,W,H); ctx.fillStyle='#fff'; ctx.fillRect(0,0,W,H);
    const X=v=>W/2+v*22, Y=v=>140-v*5.5;
    ctx.strokeStyle='#9CA3AF'; ctx.lineWidth=1.2;
    ctx.beginPath(); ctx.moveTo(10,Y(0)); ctx.lineTo(W-10,Y(0)); ctx.stroke();
    ctx.strokeStyle='#2563EB'; ctx.lineWidth=2.2; ctx.beginPath();
    for(let i=0;i<=140;i++){ const x=-8.6+17.2*i/140, y=Math.max(-24,Math.min(22,x*x+b*x+c));
      const px=X(x), py=Y(y); i?ctx.lineTo(px,py):ctx.moveTo(px,py); }
    ctx.stroke();
    const rs=roots(b,c);
    if(rs) rs.forEach(r=>{ ctx.fillStyle='#BE123C';
      ctx.beginPath(); ctx.arc(X(r),Y(0),5.5,0,7); ctx.fill(); });
    let quiz='';
    if(S.quiz){
      const q=S.quiz, hit=rs && b===-q.s && c===q.p;
      quiz = hit
        ? `<b style="color:#0E9384">문제 해결! 두 수는 ${rs[0].toFixed(0)} 와 ${rs[1].toFixed(0)} ${S.win>=2?'— <span style=\"color:#B45309\">2연승!</span>':''}</b>`
        : `목표: 합 ${q.s} · 곱 ${q.p} 인 두 수 — b·c 를 조절해 방정식으로 잡으세요.`;
    }
    $('#vtQz').innerHTML=quiz;
    $('#vtout').innerHTML =
      `<span class="mono">x² ${b>=0?'+ '+b:'− '+(-b)}x ${c>=0?'+ '+c:'− '+(-c)} = 0</span><br>`
      + (rs? `두 근: <b>${rs[0].toFixed(2)}, ${rs[1].toFixed(2)}</b><br>
              <span class="mono">합 = ${(rs[0]+rs[1]).toFixed(2)} ( = −b = ${-b}) &nbsp; 곱 = ${(rs[0]*rs[1]).toFixed(2)} ( = c = ${c})</span>`
           : `<span style="color:#BE123C">실근 없음 (D < 0)</span> — 그래도 합·곱은 −b, c 로 정해져 있습니다.`);
  }
  $('#vtB').oninput=draw; $('#vtC').oninput=draw;
  $('#vtQ').onclick=()=>{
    if(S.quiz){ const b=+$('#vtB').value, c=+$('#vtC').value;
      if(b===-S.quiz.s&&c===S.quiz.p) S.win++; }
    S.quiz=QS[Math.min(S.win,QS.length-1)];
    if(S.win>=QS.length) S.quiz=QS[0];
    draw();
  };
  draw();
  inquiry(root,{ id:'vt', title:'근과 계수 — 구하지 않고 아는 것들',
    q:['b·c 다섯 조합에서 (두 근, 합, 곱, −b, c) 를 기록하세요.',
       '합·곱 열이 계수 열과 늘 일치하는지 확인하고, (x−p)(x−q) 전개로 이유를 쓰세요.',
       '합 7, 곱 12 인 두 수를 방정식 없이 말하고, 화면으로 검산하세요.'],
    cols:['b','c','두 근','합','곱'],
    hint:'힌트 — (x−p)(x−q) = x² −(p+q)x + pq. 계수는 근의 요약본입니다.',
    read:()=>{ const b=+$('#vtB').value, c=+$('#vtC').value, rs=roots(b,c);
      return [b, c, rs?rs.map(r=>r.toFixed(1)).join(', '):'없음',
        rs?(rs[0]+rs[1]).toFixed(1):'—', rs?(rs[0]*rs[1]).toFixed(1):'—']; } });
}

/* ---------- LAB 96 삼차방정식의 실근 ---------- */
function cbDemo(root){
  root.innerHTML=`<div class="row"><div class="col">
      <canvas id="cb1" width="400" height="300"></canvas>
      <div class="note" style="margin-top:8px"><b>곡선을 위아래로 끌면(주황 손잡이)</b>
      상수항 k 가 변합니다. 접하는 순간에는 자석처럼 붙습니다.</div>
    </div>
    <div class="col">
      <div class="out" id="cbout"></div>
      <div class="note" style="margin-top:12px">f(x) = x³ − 3x + k.
      삼차 곡선은 x축과 <b>1번 · 2번(접함) · 3번</b> 만날 수 있습니다 —
      산과 골짜기(극값)가 x축을 사이에 두는지가 운명을 가릅니다.</div>
    </div></div>`;
  const cv=$('#cb1'),ctx=cv.getContext('2d'),W=400,H=300;
  const S={ k:3 };
  const X=v=>W/2+v*58, Y=v=>150-v*22;
  function nroots(){ const a=S.k+2, b=S.k-2;    // f(−1)=k+2(극대), f(1)=k−2(극소)
    if(Math.abs(a)<0.03||Math.abs(b)<0.03) return 2;
    return a*b<0?3:1; }
  function draw(){
    ctx.clearRect(0,0,W,H); ctx.fillStyle='#fff'; ctx.fillRect(0,0,W,H);
    ctx.strokeStyle='#9CA3AF'; ctx.lineWidth=1.3;
    ctx.beginPath(); ctx.moveTo(10,Y(0)); ctx.lineTo(W-10,Y(0)); ctx.stroke();
    ctx.strokeStyle='#2563EB'; ctx.lineWidth=2.4; ctx.beginPath();
    for(let i=0;i<=160;i++){ const x=-2.9+5.8*i/160, y=Math.max(-6.2,Math.min(6.2,x**3-3*x+S.k));
      const px=X(x), py=Y(y); i?ctx.lineTo(px,py):ctx.moveTo(px,py); }
    ctx.stroke();
    // 극값 점
    [[-1,S.k+2],[1,S.k-2]].forEach(([x,y])=>{ ctx.fillStyle='#B45309';
      ctx.beginPath(); ctx.arc(X(x),Y(Math.max(-6.2,Math.min(6.2,y))),4.5,0,7); ctx.fill(); });
    handle(ctx, X(1.9), Y(Math.max(-6.2,Math.min(6.2,1.9**3-3*1.9+S.k))), '#B45309', 'k = '+S.k.toFixed(2));
    const n=nroots();
    $('#cbout').innerHTML =
      `<span class="mono">f(x) = x³ − 3x ${S.k>=0?'+ '+S.k.toFixed(2):'− '+(-S.k).toFixed(2)}</span><br>`
      + `극대 f(−1) = ${(S.k+2).toFixed(2)} · 극소 f(1) = ${(S.k-2).toFixed(2)}<br>`
      + (n===3? `<b style="color:#0E9384">실근 3개 — 산은 x축 위, 골짜기는 아래.</b>`
        : n===2? `<b style="color:#BE123C">접했습니다 — 중근 포함 실근 2개.</b> 극값 하나가 정확히 0 입니다.`
        : `<b style="color:#2563EB">실근 1개</b> — 산과 골짜기가 같은 쪽에 있습니다.`);
  }
  dragOn(cv,{
    hit:p=>p.y>20&&p.y<H-20?'k':null,
    move:(h,p,st)=>{ let k=S.k-(p.y-(st&&st.py!==undefined?st.py:p.y))/22;
      // dragOn 이 이전 좌표를 안 주면 위치 기반으로: 곡선 위 y 를 직접 맞춘다
      k=Math.round(((150-p.y)/22 - (1.9**3-3*1.9))*100)/100;
      [-2,2].forEach(s=>{ if(Math.abs(k-s)<0.25) k=s; });
      S.k=Math.max(-5,Math.min(5,k)); draw(); }
  });
  draw();
  inquiry(root,{ id:'cb', title:'삼차방정식 — 실근의 개수는 극값이 정한다',
    q:['k 를 바꿔 가며 (k, 극대, 극소, 실근 수) 를 여섯 줄 기록하세요. 접하는 k 두 개를 꼭 포함하세요.',
       '「극대 × 극소」의 부호 열을 만들어 실근 수와의 규칙을 찾으세요.',
       '이 규칙이 이차방정식의 판별식과 어떻게 닮았는지, 무엇이 다른지 쓰세요.'],
    cols:['k','극대','극소','실근 수'],
    hint:'힌트 — 산꼭대기와 골짜기가 x축을 「사이에 두면」 세 번 건넙니다.',
    read:()=>[S.k.toFixed(2), (S.k+2).toFixed(2), (S.k-2).toFixed(2), nroots()+'개'] });
}

/* ---------- LAB 97 이차부등식 ---------- */
function qiDemo(root){
  root.innerHTML=`<div class="row"><div class="col">
      <canvas id="qi1" width="400" height="280"></canvas>
      <div class="ctl" style="display:flex;gap:6px;flex-wrap:wrap;margin-top:8px">
        ${slider('qiB','b',-6,6,1,0,'')}
        ${slider('qiC','c',-8,8,1,1,'')}
        <button class="b g sm" id="qiDir">부등호 뒤집기 (지금: <span id="qiDv">&lt;</span> 0)</button></div>
    </div>
    <div class="col">
      <div class="out" id="qiout"></div>
      <div class="note" style="margin-top:12px">x² + bx + c 와 0 의 대소는
      <b>포물선이 x축 아래/위 어디에 있는가</b>입니다. 해집합이 수직선에
      실시간으로 칠해집니다 — 구간·바깥·전부·없음, 네 가지 운명을 모두 만들어 보세요.</div>
    </div></div>`;
  const cv=$('#qi1'),ctx=cv.getContext('2d'),W=400,H=280;
  const S={ lt:true };
  function draw(){
    const b=+$('#qiB').value, c=+$('#qiC').value;
    ctx.clearRect(0,0,W,H); ctx.fillStyle='#fff'; ctx.fillRect(0,0,W,H);
    const X=v=>W/2+v*26, Y=v=>120-v*7;
    const D=b*b-4*c;
    const rs=D>=0?[(-b-Math.sqrt(D))/2,(-b+Math.sqrt(D))/2]:null;
    // 해 구간 하이라이트 (곡선 아래/위 부분 강조)
    ctx.strokeStyle='#2563EB'; ctx.lineWidth=2; ctx.beginPath();
    for(let i=0;i<=150;i++){ const x=-7.3+14.6*i/150, y=Math.max(-15,Math.min(18,x*x+b*x+c));
      const px=X(x), py=Y(y); i?ctx.lineTo(px,py):ctx.moveTo(px,py); }
    ctx.stroke();
    ctx.strokeStyle='#9CA3AF'; ctx.lineWidth=1.3;
    ctx.beginPath(); ctx.moveTo(10,Y(0)); ctx.lineTo(W-10,Y(0)); ctx.stroke();
    // 만족 구간 진하게
    ctx.strokeStyle='#BE123C'; ctx.lineWidth=4; ctx.beginPath();
    let on=false;
    for(let i=0;i<=150;i++){ const x=-7.3+14.6*i/150, y=x*x+b*x+c;
      const ok=S.lt? y<0 : y>0;
      const px=X(x), py=Y(Math.max(-15,Math.min(18,y)));
      if(ok&&!on){ ctx.moveTo(px,py); on=true; }
      else if(ok) ctx.lineTo(px,py);
      else on=false; }
    ctx.stroke();
    // 수직선 해집합
    const ny=H-40;
    ctx.strokeStyle='#9CA3AF'; ctx.lineWidth=1.4;
    ctx.beginPath(); ctx.moveTo(20,ny); ctx.lineTo(W-20,ny); ctx.stroke();
    ctx.strokeStyle='#0E9384'; ctx.lineWidth=5;
    const seg=(x1,x2)=>{ ctx.beginPath(); ctx.moveTo(Math.max(20,X(x1)),ny); ctx.lineTo(Math.min(W-20,X(x2)),ny); ctx.stroke(); };
    let sol;
    if(rs&&rs[1]-rs[0]>1e-9){
      if(S.lt){ seg(rs[0],rs[1]); sol=`${rs[0].toFixed(1)} < x < ${rs[1].toFixed(1)}`; }
      else { seg(-7.3,rs[0]); seg(rs[1],7.3); sol=`x < ${rs[0].toFixed(1)} 또는 x > ${rs[1].toFixed(1)}`; }
      rs.forEach(r=>{ ctx.fillStyle='#fff'; ctx.strokeStyle='#0E9384'; ctx.lineWidth=2;
        ctx.beginPath(); ctx.arc(X(r),ny,5,0,7); ctx.fill(); ctx.stroke(); });
    } else if(rs){ // 중근
      if(S.lt) sol='해가 없습니다 (딱 한 점에서만 0)';
      else { seg(-7.3,rs[0]); seg(rs[0],7.3); sol=`x ≠ ${rs[0].toFixed(1)} 인 모든 실수`; }
    } else {
      if(S.lt) sol='해가 없습니다 — 포물선이 늘 x축 위';
      else { seg(-7.3,7.3); sol='모든 실수 — 포물선이 늘 x축 위'; }
    }
    $('#qiDv').innerHTML=S.lt?'&lt;':'&gt;';
    $('#qiout').innerHTML =
      `<span class="mono">x² ${b>=0?'+ '+b:'− '+(-b)}x ${c>=0?'+ '+c:'− '+(-c)} ${S.lt?'<':'>'} 0</span><br>`
      + `해: <b style="color:#0E9384">${sol}</b><br>`
      + `<span style="color:#6B7280;font-size:12.5px">붉은 곡선 = 부등식을 만족하는 부분, 초록 선 = 해집합.</span>`;
  }
  $('#qiB').oninput=draw; $('#qiC').oninput=draw;
  $('#qiDir').onclick=()=>{ S.lt=!S.lt; draw(); };
  draw();
  inquiry(root,{ id:'qi', title:'이차부등식 — 그림이 곧 해집합',
    q:['b·c 를 바꿔 가며 (식, 부등호, 해집합) 여섯 줄을 기록하세요. 네 가지 운명을 모두 포함하세요.',
       '판별식 D 의 부호 열을 추가해 해집합의 모양과 짝지으세요.',
       'x² − 2x − 3 < 0 을 손으로 풀고(인수분해 → 수직선), 화면으로 검산하세요.'],
    cols:['b','c','부등호','해집합'],
    hint:'힌트 — 「< 0」은 포물선의 지하 구간, 「> 0」은 지상 구간을 읽는 일입니다.',
    read:()=>{ const b=+$('#qiB').value, c=+$('#qiC').value;
      return [b, c, S.lt?'< 0':'> 0', $('#qiout').innerText.match(/해: ([^\n]*)/)?.[1]||'']; } });
}

/* ---------- LAB 98 부등식 영역과 선형계획 ---------- */
function lpDemo(root){
  root.innerHTML=`<div class="row"><div class="col">
      <canvas id="lp1" width="400" height="300"></canvas>
      <div class="ctl" style="display:flex;gap:6px;flex-wrap:wrap;margin-top:8px">
        <button class="b g sm" id="lpObj">목적함수 바꾸기: <span id="lpOv">z = 3x + 2y</span></button></div>
    </div>
    <div class="col">
      <div class="out" id="lpout"></div>
      <div class="note" style="margin-top:12px">빵 x개·케이크 y개.
      제약: x + y ≤ 6 (오븐), x + 2y ≤ 8 (반죽), x·y ≥ 0.
      <b>점 P(주황)로 생산 계획을 정하고, 이익선(빨강)을 끌어 올려 보세요</b> —
      마지막까지 영역에 걸치는 곳이 늘 꼭짓점인 것이 선형계획법의 심장입니다.</div>
    </div></div>`;
  const cv=$('#lp1'),ctx=cv.getContext('2d'),W=400,H=300;
  const S={ px:2, py:2, z:6, obj:0 };
  const OBJ=[{a:3,b:2,t:'z = 3x + 2y',best:[4,2],bz:16},{a:1,b:3,t:'z = x + 3y',best:[0,4],bz:12}];
  const X=v=>50+v*40, Y=v=>H-40-v*40;
  const inside=(x,y)=>x>=-0.001&&y>=-0.001&&x+y<=6.001&&x+2*y<=8.001;
  function draw(){
    ctx.clearRect(0,0,W,H); ctx.fillStyle='#fff'; ctx.fillRect(0,0,W,H);
    ctx.strokeStyle='#E8ECF2';
    for(let v=0;v<=8;v++){ ctx.beginPath(); ctx.moveTo(X(v),20); ctx.lineTo(X(v),H-40); ctx.stroke(); }
    for(let v=0;v<=6;v++){ ctx.beginPath(); ctx.moveTo(50,Y(v)); ctx.lineTo(W-10,Y(v)); ctx.stroke(); }
    ctx.strokeStyle='#9CA3AF'; ctx.lineWidth=1.4;
    ctx.beginPath(); ctx.moveTo(50,Y(0)); ctx.lineTo(W-10,Y(0)); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(X(0),20); ctx.lineTo(X(0),H-40); ctx.stroke();
    // 가능 영역: (0,0)(6,0)(4,2)(0,4)
    ctx.fillStyle='rgba(14,147,132,.15)';
    ctx.beginPath(); ctx.moveTo(X(0),Y(0)); ctx.lineTo(X(6),Y(0)); ctx.lineTo(X(4),Y(2)); ctx.lineTo(X(0),Y(4)); ctx.closePath(); ctx.fill();
    ctx.strokeStyle='#0E9384'; ctx.lineWidth=1.8; ctx.stroke();
    [[0,0],[6,0],[4,2],[0,4]].forEach(([x,y])=>{ ctx.fillStyle='#0B6E63';
      ctx.beginPath(); ctx.arc(X(x),Y(y),4,0,7); ctx.fill(); });
    // 이익선 z = ax+by
    const o=OBJ[S.obj];
    ctx.strokeStyle='#BE123C'; ctx.lineWidth=2.2;
    ctx.beginPath();
    const y0=(S.z-o.a*(-1))/o.b, y1=(S.z-o.a*9)/o.b;
    ctx.moveTo(X(-1),Y(y0)); ctx.lineTo(X(9),Y(y1)); ctx.stroke();
    handle(ctx, X(4.6), Y((S.z-o.a*4.6)/o.b), '#BE123C', 'z = '+S.z.toFixed(1));
    // 생산점 P
    const pin=inside(S.px,S.py);
    const isVertex=Math.abs(S.px-o.best[0])<0.15&&Math.abs(S.py-o.best[1])<0.15;
    handle(ctx, X(S.px), Y(S.py), pin?'#B45309':'#BE123C','P('+S.px.toFixed(1)+', '+S.py.toFixed(1)+')');
    const zBest=o.bz, zNow=o.a*S.px+o.b*S.py;
    const zLineMax=Math.abs(S.z-zBest)<0.4;
    $('#lpout').innerHTML =
      `<span class="mono">${o.t} · P 의 이익 z = ${zNow.toFixed(1)}</span><br>`
      + (pin? (isVertex?`<b style="color:#0E9384">꼭짓점 명중 — 이 목적함수의 최적 생산 계획입니다.</b><br>`
                       :`조건 만족 — 하지만 더 나은 계획이 있을까요?<br>`)
            : `<b style="color:#BE123C">조건 위반 — 오븐 또는 반죽 한도를 넘었습니다.</b><br>`)
      + (zLineMax? `<b style="color:#BE123C">이익선이 마지막으로 영역을 스칩니다 — ${S.obj===0?`최대 z = 16, 꼭짓점 (4, 2)`:`이번엔 (0, 4) 가 최대 (z = 12)`}.</b>`
                 : `<span style="color:#6B7280;font-size:12.5px">이익선을 끌어 올려 영역을 떠나기 직전의 값을 찾으세요.</span>`);
  }
  dragOn(cv,{
    hit:p=>{ if(Math.hypot(p.x-X(S.px),p.y-Y(S.py))<22) return 'P';
      const o=OBJ[S.obj];
      const d=Math.abs(o.a*((p.x-50)/40)+o.b*((H-40-p.y)/40)-S.z)/Math.hypot(o.a,o.b);
      return d<0.5?'z':null; },
    move:(h,p)=>{ const o=OBJ[S.obj];
      if(h==='P'){ S.px=Math.max(0,Math.min(8,Math.round((p.x-50)/40*10)/10));
        S.py=Math.max(0,Math.min(6,Math.round((H-40-p.y)/40*10)/10));
        [[0,0],[6,0],[4,2],[0,4]].forEach(([vx,vy])=>{ if(Math.hypot(S.px-vx,S.py-vy)<0.3){ S.px=vx; S.py=vy; } });
      } else {
        let z=o.a*((p.x-50)/40)+o.b*((H-40-p.y)/40);
        if(Math.abs(z-o.bz)<0.7) z=o.bz;
        S.z=Math.max(2,Math.min(22,z));
      }
      draw(); }
  });
  $('#lpObj').onclick=()=>{ S.obj=1-S.obj; $('#lpOv').textContent=OBJ[S.obj].t; S.z=6; draw(); };
  draw();
  inquiry(root,{ id:'lp', title:'선형계획 — 답은 늘 꼭짓점에 있다',
    q:['네 꼭짓점 각각에서 z 값을 계산해 표를 채우세요.',
       '이익선을 끌 때 영역을 마지막으로 스치는 곳이 어디인지, 목적함수를 바꾸면 어떻게 달라지는지 기록하세요.',
       '왜 최적해가 영역 안쪽이 아니라 꼭짓점에서 나오는지, 평행한 직선 다발 그림으로 설명하세요.'],
    cols:['꼭짓점','z = 3x+2y','z = x+3y'],
    hint:'힌트 — 이익선은 기울기가 고정된 채 평행이동만 합니다. 마지막 접촉점은 모서리일 수밖에 없습니다.',
    read:()=>{ const o=OBJ[S.obj];
      return ['P('+S.px.toFixed(1)+','+S.py.toFixed(1)+')', (3*S.px+2*S.py).toFixed(1), (S.px+3*S.py).toFixed(1)]; } });
}

/* ---------- LAB 99 순열과 조합 ---------- */
function pmDemo(root){
  root.innerHTML=`<div class="row"><div class="col">
      <canvas id="pm1" width="400" height="270"></canvas>
      <div class="ctl" style="display:flex;gap:6px;flex-wrap:wrap;margin-top:8px">
        <button class="b t sm" id="pmP">순서 있게 나열 (회장·부회장)</button>
        <button class="b t sm" id="pmC">순서 없이 뽑기 (청소 짝)</button>
        <button class="b g sm" id="pmA">도전: AABB 나열</button></div>
    </div>
    <div class="col">
      <div class="out" id="pmout"></div>
      <div class="note" style="margin-top:12px">넷(가·나·다·라) 중 둘 —
      <b>회장·부회장은 순서가 있고, 청소 짝은 없습니다.</b>
      나열을 눌러 목록이 실제로 쌓이는 것을 보세요: 12 와 6, 정확히 2배 차이입니다.</div>
    </div></div>`;
  const cv=$('#pm1'),ctx=cv.getContext('2d'),W=400,H=270;
  const NM=['가','나','다','라'];
  const S={ mode:null, list:[], t:0, aabb:false };
  function build(mode){
    S.mode=mode; S.list=[]; S.aabb=false;
    for(let i=0;i<4;i++) for(let j=0;j<4;j++){
      if(i===j) continue;
      if(mode==='C'&&i>j) continue;
      S.list.push(mode==='P'?NM[i]+NM[j]:'{'+NM[i]+','+NM[j]+'}');
    }
    S.t=0; anim();
  }
  function anim(){
    if(!$('#pm1')) return;
    if(S.t<S.list.length){ S.t++; draw(); setTimeout(anim,150); }
    else draw();
  }
  function draw(){
    ctx.clearRect(0,0,W,H); ctx.fillStyle='#fff'; ctx.fillRect(0,0,W,H);
    if(S.aabb){
      const perms=['AABB','ABAB','ABBA','BAAB','BABA','BBAA'];
      ctx.fillStyle='#111827'; ctx.font='bold 15px ui-monospace,monospace'; ctx.textAlign='center';
      perms.forEach((s,i)=>ctx.fillText(s, 90+(i%3)*110, 70+Math.floor(i/3)*46));
      ctx.fillStyle='#374151'; ctx.font='12px sans-serif';
      ctx.fillText('4! ÷ (2! × 2!) = 24 ÷ 4 = 6', W/2, 200);
      return;
    }
    ctx.fillStyle='#111827'; ctx.font='bold 14px ui-monospace,monospace'; ctx.textAlign='center';
    S.list.slice(0,S.t).forEach((s,i)=>{
      ctx.fillText(s, 70+(i%4)*90, 50+Math.floor(i/4)*44);
    });
    if(!S.mode){ ctx.fillStyle='#6B7280'; ctx.font='13px sans-serif';
      ctx.fillText('버튼을 눌러 목록을 쌓아 보세요', W/2, 120); }
  }
  function out(){
    if(S.aabb){
      $('#pmout').innerHTML=`<b style="color:#0E9384">같은 것이 있는 순열: 6가지.</b><br>
        <span class="mono">4! / (2!·2!) = 6</span> — A 둘·B 둘이 서로 구별되지 않아 <b>겹치는 만큼 나눕니다</b>.`;
      return;
    }
    if(!S.mode){ $('#pmout').innerHTML='두 버튼으로 목록을 만들어 비교하세요.'; return; }
    const done=S.t>=S.list.length;
    $('#pmout').innerHTML = S.mode==='P'
      ? (done?`<b style="color:#2563EB">순열 12가지 — ₄P₂ = 4 × 3</b><br><span style="color:#6B7280;font-size:12.5px">가나 와 나가 가 다른 줄입니다 — 순서가 있으니까요.</span>`:`나열 중… ${S.t}/12`)
      : (done?`<b style="color:#0E9384">조합 6가지 — 순열 12 를 2! 로 나눈 값입니다.</b><br><span class="mono">₄C₂ = ₄P₂ / 2!</span> — {가,나} 하나가 순열 두 줄(가나·나가)을 대표합니다.`:`나열 중… ${S.t}/6`);
  }
  $('#pmP').onclick=()=>{ build('P'); out(); const t=setInterval(()=>{ out(); if(S.t>=S.list.length) clearInterval(t); },200); };
  $('#pmC').onclick=()=>{ build('C'); out(); const t=setInterval(()=>{ out(); if(S.t>=S.list.length) clearInterval(t); },200); };
  $('#pmA').onclick=()=>{ S.aabb=true; S.mode=null; draw(); out(); };
  draw(); out();
  inquiry(root,{ id:'pm', title:'순열과 조합 — 순서의 값은 2! 배',
    q:['순열 12줄과 조합 6줄을 실제 목록으로 확인하고, 조합 하나가 순열 몇 줄을 대표하는지 세어 보세요.',
       '5명 중 2명이면 각각 몇 가지가 될지 공식으로 예측하고 목록의 규칙으로 검산하세요.',
       'AABB 6가지가 4! 을 2!·2! 로 나눈 값인 이유를 「구별 안 되는 것끼리 바꿔치기」로 설명하세요.'],
    cols:['상황','순서','가짓수','식'],
    hint:'힌트 — 나눗셈은 늘 「겹쳐 세어진 배수」를 지우는 동작입니다.',
    read:()=>[S.aabb?'AABB':S.mode==='P'?'회장·부회장':S.mode==='C'?'청소 짝':'—',
      S.aabb?'같은 것 있음':S.mode==='P'?'있음':'없음',
      S.aabb?6:S.list.length, S.aabb?'4!/(2!2!)':S.mode==='P'?'4×3':'4×3/2!'] });
}

/* ---------- LAB 100 행렬과 이미지 변환 ---------- */
function mxDemo(root){
  root.innerHTML=`<div class="row"><div class="col">
      <canvas id="mx1" width="400" height="300"></canvas>
      <div class="ctl" style="display:flex;gap:6px;flex-wrap:wrap;margin-top:8px">
        <button class="b t sm" id="mxT">도전: 90° 회전 만들기</button>
        <button class="b g sm" id="mxRst">원래대로</button></div>
    </div>
    <div class="col">
      <div class="out" id="mxout"></div>
      <div class="note" style="margin-top:12px">행렬의 두 열은 <b>기저 화살표 e₁(파랑)·e₂(초록)이
      가는 곳</b>입니다. 화살표 끝을 끌면 도형 F 전체가 따라 변합니다 —
      사진 앱의 회전·확대가 전부 이 2×2 숫자판입니다.</div>
    </div></div>`;
  const cv=$('#mx1'),ctx=cv.getContext('2d'),W=400,H=300;
  const O={x:170,y:170}, SC=52;
  const S={ m:[1,0,0,1], quiz:false, hit:false };     // [a,b,c,d] = 열 (a,c),(b,d)
  const F=[[0,0],[0,2],[1.2,2],[1.2,1.6],[0.5,1.6],[0.5,1],[1,1],[1,0.6],[0.5,0.6],[0.5,0]];
  const ap=(x,y)=>[S.m[0]*x+S.m[1]*y, S.m[2]*x+S.m[3]*y];
  function draw(){
    ctx.clearRect(0,0,W,H); ctx.fillStyle='#fff'; ctx.fillRect(0,0,W,H);
    ctx.strokeStyle='#E8ECF2';
    for(let v=-3;v<=4;v++){ ctx.beginPath(); ctx.moveTo(O.x+v*SC,10); ctx.lineTo(O.x+v*SC,H-10); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(20,O.y+v*SC); ctx.lineTo(W-20,O.y+v*SC); ctx.stroke(); }
    ctx.strokeStyle='#9CA3AF'; ctx.lineWidth=1.3;
    ctx.beginPath(); ctx.moveTo(20,O.y); ctx.lineTo(W-20,O.y); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(O.x,10); ctx.lineTo(O.x,H-10); ctx.stroke();
    // 목표 유령 (90° 회전 F)
    if(S.quiz){ ctx.strokeStyle='#BE123C'; ctx.setLineDash([4,3]); ctx.lineWidth=1.6; ctx.beginPath();
      F.forEach(([x,y],i)=>{ const px=O.x+(-y)*SC, py=O.y-(x)*SC;
        i?ctx.lineTo(px,py):ctx.moveTo(px,py); });
      ctx.closePath(); ctx.stroke(); ctx.setLineDash([]); }
    // 변환된 F
    ctx.fillStyle='rgba(37,99,235,.15)'; ctx.strokeStyle='#2563EB'; ctx.lineWidth=2; ctx.beginPath();
    F.forEach(([x,y],i)=>{ const [tx,ty]=ap(x,y); const px=O.x+tx*SC, py=O.y-ty*SC;
      i?ctx.lineTo(px,py):ctx.moveTo(px,py); });
    ctx.closePath(); ctx.fill(); ctx.stroke();
    // 기저 화살표
    const arrow=(vx,vy,col,lab)=>{ ctx.strokeStyle=col; ctx.lineWidth=2.6;
      ctx.beginPath(); ctx.moveTo(O.x,O.y); ctx.lineTo(O.x+vx*SC,O.y-vy*SC); ctx.stroke();
      handle(ctx, O.x+vx*SC, O.y-vy*SC, col, lab); };
    arrow(S.m[0],S.m[2],'#2563EB','e₁→');
    arrow(S.m[1],S.m[3],'#0E9384','e₂→');
    const det=S.m[0]*S.m[3]-S.m[1]*S.m[2];
    const rot=S.m[0]===0&&S.m[2]===1&&S.m[1]===-1&&S.m[3]===0;
    if(S.quiz&&rot) S.hit=true;
    $('#mxout').innerHTML =
      `<span class="mono">행렬 [ ${S.m[0]} &nbsp; ${S.m[1]} ; ${S.m[2]} &nbsp; ${S.m[3]} ]</span><br>`
      + `넓이 배율 |det| = <b>${Math.abs(det).toFixed(2)}</b><br>`
      + (Math.abs(det)<1e-9? `<b style="color:#BE123C">넓이 0 — 도형이 납작하게 붕괴했습니다 (det = 0).</b> 두 화살표가 한 직선 위입니다.<br>`:'')
      + (S.hit? `<b style="color:#0E9384">90° 회전 완성 — 행렬 [0 −1; 1 0].</b> e₁ 은 위로, e₂ 는 왼쪽으로.`
        : S.quiz? `<span style="color:#BE123C">도전 중 — 붉은 유령(90° 회전된 F)에 도형을 겹치세요. 화살표 끝은 0.5 단위로 붙습니다.</span>`
        : `<span style="color:#6B7280;font-size:12.5px">화살표 두 개를 이리저리 끌어 도형이 어떻게 늘고 기울고 도는지 보세요.</span>`);
  }
  dragOn(cv,{
    hit:p=>{ if(Math.hypot(p.x-(O.x+S.m[0]*SC),p.y-(O.y-S.m[2]*SC))<20) return 'e1';
      if(Math.hypot(p.x-(O.x+S.m[1]*SC),p.y-(O.y-S.m[3]*SC))<20) return 'e2';
      return null; },
    move:(h,p)=>{ const vx=Math.round((p.x-O.x)/SC*2)/2, vy=Math.round((O.y-p.y)/SC*2)/2;
      if(h==='e1'){ S.m[0]=vx; S.m[2]=vy; } else { S.m[1]=vx; S.m[3]=vy; }
      draw(); }
  });
  $('#mxT').onclick=()=>{ S.quiz=true; S.hit=false; draw(); };
  $('#mxRst').onclick=()=>{ S.m=[1,0,0,1]; S.quiz=false; S.hit=false; draw(); };
  draw();
  inquiry(root,{ id:'mx', title:'행렬 — 사진을 움직이는 숫자판',
    q:['행렬 네 가지(항등·확대·전단·회전)에서 (행렬, 도형의 변화, |det|) 를 기록하세요.',
       '|det| 열이 도형의 무엇과 일치하는지 찾고, det = 0 이면 왜 되돌릴 수 없는지 쓰세요.',
       '180° 회전 행렬을 예측해 쓰고, 화면에서 만들어 검산하세요.'],
    cols:['행렬','도형 변화','|det|'],
    hint:'힌트 — 열이 곧 기저의 목적지입니다. 어디로 보낼지 정하면 행렬은 저절로 나옵니다.',
    read:()=>{ const det=S.m[0]*S.m[3]-S.m[1]*S.m[2];
      return ['['+S.m.join(' ')+']', S.hit?'90° 회전':'—', Math.abs(det).toFixed(2)]; } });
}

/* ---------- LAB 101 행렬 곱 — 순서를 바꾸면 ---------- */
function ncDemo(root){
  root.innerHTML=`<div class="row"><div class="col">
      <canvas id="nc1" width="400" height="260"></canvas>
      <div class="ctl" style="display:flex;gap:6px;flex-wrap:wrap;margin-top:8px">
        <span style="font-weight:800">왼쪽:</span>
        <button class="b t sm" data-s="L" data-o="R">회전 90°</button>
        <button class="b t sm" data-s="L" data-o="X">가로 2배</button>
        <button class="b t sm" data-s="L" data-o="U">모두 2배</button>
        <span style="font-weight:800;margin-left:8px">오른쪽:</span>
        <button class="b g sm" data-s="R" data-o="R">회전 90°</button>
        <button class="b g sm" data-s="R" data-o="X">가로 2배</button>
        <button class="b g sm" data-s="R" data-o="U">모두 2배</button>
        <button class="b g sm" id="ncRst" style="margin-left:8px">지우기</button></div>
    </div>
    <div class="col">
      <div class="out" id="ncout"></div>
      <div class="note" style="margin-top:12px">같은 두 변환을 <b>왼쪽 판과 오른쪽 판에
      서로 반대 순서로</b> 적용해 보세요. 결과가 다르면 — 그 곱셈은 순서를 탑니다.
      숫자의 곱에서는 없던 일이 행렬에서는 일상입니다.</div>
    </div></div>`;
  const cv=$('#nc1'),ctx=cv.getContext('2d'),W=400,H=260;
  const OPS={ R:[0,-1,1,0], X:[2,0,0,1], U:[2,0,0,2] };
  const NM2={ R:'회전', X:'가로2배', U:'모두2배' };
  const S={ L:[], R:[] };
  const mul=(A,B)=>[A[0]*B[0]+A[1]*B[2], A[0]*B[1]+A[1]*B[3], A[2]*B[0]+A[3]*B[2], A[2]*B[1]+A[3]*B[3]];
  const tot=seq=>seq.reduce((M,o)=>mul(OPS[o],M),[1,0,0,1]);
  const F=[[0,0],[0,1.4],[0.8,1.4],[0.8,1.1],[0.35,1.1],[0.35,0.75],[0.7,0.75],[0.7,0.45],[0.35,0.45],[0.35,0]];
  function panel(ox, M, label){
    ctx.strokeStyle='#9CA3AF'; ctx.lineWidth=1.1;
    ctx.beginPath(); ctx.moveTo(ox-70,130); ctx.lineTo(ox+80,130); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(ox,40); ctx.lineTo(ox,220); ctx.stroke();
    ctx.fillStyle='rgba(37,99,235,.16)'; ctx.strokeStyle='#2563EB'; ctx.lineWidth=1.8; ctx.beginPath();
    F.forEach(([x,y],i)=>{ const tx=M[0]*x+M[1]*y, ty=M[2]*x+M[3]*y;
      const px=ox+tx*36, py=130-ty*36;
      i?ctx.lineTo(px,py):ctx.moveTo(px,py); });
    ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.fillStyle='#374151'; ctx.font='bold 11.5px sans-serif'; ctx.textAlign='center';
    ctx.fillText(label, ox, 246);
  }
  function draw(){
    ctx.clearRect(0,0,W,H); ctx.fillStyle='#fff'; ctx.fillRect(0,0,W,H);
    panel(105, tot(S.L), '왼쪽: '+(S.L.map(o=>NM2[o]).join(' → ')||'아직 없음'));
    panel(300, tot(S.R), '오른쪽: '+(S.R.map(o=>NM2[o]).join(' → ')||'아직 없음'));
    const L=tot(S.L), R=tot(S.R);
    const same=L.every((v,i)=>Math.abs(v-R[i])<1e-9);
    const rev = S.L.length===2 && S.R.length===2 && S.L[0]===S.R[1] && S.L[1]===S.R[0] && (S.L[0]!==S.L[1]);
    let msg='';
    if(rev && !same) msg=`<b style="color:#BE123C">두 결과가 다릅니다 — 곱의 순서가 결과를 바꿉니다 (AB ≠ BA).</b>`;
    else if(rev && same) msg=`<b style="color:#0E9384">이 짝은 순서를 바꿔도 같습니다 — 교환이 되는 특별한 경우입니다.</b>`;
    else if(S.L.length&&S.R.length) msg=`<span style="color:#6B7280;font-size:12.5px">양쪽에 두 변환씩, 서로 반대 순서로 넣어 보세요.</span>`;
    else msg=`<span style="color:#6B7280;font-size:12.5px">버튼으로 왼쪽·오른쪽 판에 변환을 쌓으세요 (판마다 2개까지).</span>`;
    $('#ncout').innerHTML =
      `<span class="mono">왼쪽 합성 [${tot(S.L).join(' ')}] · 오른쪽 합성 [${tot(S.R).join(' ')}]</span><br>`+msg;
  }
  root.querySelectorAll('[data-s]').forEach(b=>b.onclick=()=>{
    const side=b.dataset.s, op=b.dataset.o;
    if(S[side].length<2) S[side].push(op);
    draw();
  });
  $('#ncRst').onclick=()=>{ S.L=[]; S.R=[]; draw(); };
  draw();
  inquiry(root,{ id:'nc', title:'행렬의 곱 — 순서를 타는 곱셈',
    q:['(회전, 가로2배) 짝을 두 순서로 실행해 두 결과 행렬을 기록하세요.',
       '순서를 바꿔도 같은 짝을 하나 찾아 기록하고, 왜 그 짝만 되는지 짐작을 쓰세요.',
       '「옷 입기(양말→신발 vs 신발→양말)」처럼 순서를 타는 일상 예를 두 개 만들어 행렬 곱과 잇으세요.'],
    cols:['순서','합성 행렬','같은가'],
    hint:'힌트 — 균등 확대(모두 2배)는 방향을 안 가립니다. 방향을 가리는 변환끼리가 순서를 탑니다.',
    read:()=>{ const L=tot(S.L), R=tot(S.R);
      return [(S.L.join('→')||'—')+' vs '+(S.R.join('→')||'—'),
        '['+L.join(' ')+'] / ['+R.join(' ')+']',
        L.every((v,i)=>v===R[i])?'같다':'다르다']; } });
}
