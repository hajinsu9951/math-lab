/* ============ 탭 ============ */
document.querySelectorAll('nav.tabs button').forEach(b=>b.onclick=()=>{
  document.querySelectorAll('nav.tabs button').forEach(x=>x.classList.remove('on'));
  document.querySelectorAll('section.pane').forEach(x=>x.classList.remove('on'));
  b.classList.add('on'); document.getElementById(b.dataset.p).classList.add('on');
  window.scrollTo({top:0,behavior:'smooth'});
});

/* ============ 유틸 ============ */
const $=s=>document.querySelector(s);
function el(h){const d=document.createElement('div');d.innerHTML=h.trim();return d.firstChild;}
function axes(ctx,W,H,pad){ctx.clearRect(0,0,W,H);ctx.strokeStyle='#E5E7EB';ctx.lineWidth=1;
  for(let i=0;i<=10;i++){const x=pad+(W-2*pad)*i/10,y=pad+(H-2*pad)*i/10;
    ctx.beginPath();ctx.moveTo(x,pad);ctx.lineTo(x,H-pad);ctx.stroke();
    ctx.beginPath();ctx.moveTo(pad,y);ctx.lineTo(W-pad,y);ctx.stroke();}
  ctx.strokeStyle='#9CA3AF';ctx.lineWidth=1.4;ctx.beginPath();ctx.moveTo(pad,H-pad);ctx.lineTo(W-pad,H-pad);
  ctx.moveTo(pad,pad);ctx.lineTo(pad,H-pad);ctx.stroke();}
function slider(id,label,min,max,step,val,unit){
  return `<label class="ctl">${label} <span id="${id}v">${val}${unit||''}</span>
  <input type="range" id="${id}" min="${min}" max="${max}" step="${step}" value="${val}"></label>`;}

function dragOn(cv, spec){
  cv.style.touchAction = 'none';
  const pos = e =>{ const r = cv.getBoundingClientRect();
    return { x:(e.clientX-r.left)*cv.width/(r.width||1), y:(e.clientY-r.top)*cv.height/(r.height||1) }; };
  let held = null;
  cv.addEventListener('pointerdown', e=>{
    const p = pos(e); held = spec.hit ? spec.hit(p) : null;
    if(held!=null){ try{cv.setPointerCapture(e.pointerId);}catch(_){}
      spec.move && spec.move(held,p); e.preventDefault(); }
  });
  cv.addEventListener('pointermove', e=>{
    const p = pos(e);
    if(held!=null){ spec.move && spec.move(held,p); e.preventDefault(); }
    else cv.style.cursor = (spec.hit && spec.hit(p)!=null) ? 'grab' : 'default';
  });
  const up = ()=>{ if(held!=null){ held = null; spec.up && spec.up(); } };
  cv.addEventListener('pointerup', up);
  cv.addEventListener('pointercancel', up);
  cv.addEventListener('pointerleave', up);
}
/* 끌 수 있는 손잡이를 그린다 — 「여기를 잡으세요」가 보여야 잡는다 */
function handle(ctx,x,y,color,label){
  ctx.save();
  ctx.fillStyle='#fff'; ctx.strokeStyle=color; ctx.lineWidth=2.4;
  ctx.beginPath(); ctx.arc(x,y,7,0,7); ctx.fill(); ctx.stroke();
  ctx.fillStyle=color; ctx.beginPath(); ctx.arc(x,y,3,0,7); ctx.fill();
  if(label){ ctx.font='bold 11px sans-serif'; ctx.fillText(label, x+11, y+4); }
  ctx.restore();
}

/* ---------- LAB 11 요금제 손익분기 (일차함수) ---------- */
function planDemo(root){
  root.innerHTML=`<div class="row"><div class="col"><canvas id="pl1" width="380" height="300"></canvas></div>
    <div class="col">
      <div class="btns"><button class="b" id="plq">📌 오늘의 문제 요금제 불러오기</button></div>
      ${slider('pa','A 요금제 기본료',0,30000,1000,10000,'원')}
      ${slider('pb','A 요금제 분당 요금',0,200,5,50,'원')}
      ${slider('pc','B 요금제 기본료',0,30000,1000,24000,'원')}
      ${slider('pd','B 요금제 분당 요금',0,200,5,20,'원')}
      <div class="out" id="plout"></div>
    </div></div>`;
  const cv=$('#pl1'),ctx=cv.getContext('2d'),W=380,H=300,P=40;
  const MAXM=400,USE=350;
  function draw(){
    const a=+$('#pa').value,b=+$('#pb').value,c=+$('#pc').value,d=+$('#pd').value;
    [['pa',a,'원'],['pb',b,'원'],['pc',c,'원'],['pd',d,'원']].forEach(([id,v,u])=>
      $('#'+id+'v').textContent=v.toLocaleString('ko-KR')+u);
    const maxY=Math.max(a+b*MAXM, c+d*MAXM, 1);
    const X=m=>P+(W-2*P)*m/MAXM, Y=w=>H-P-(H-2*P)*w/maxY;
    axes(ctx,W,H,P);
    const line=(k,s,col)=>{ctx.strokeStyle=col;ctx.lineWidth=2.6;ctx.beginPath();
      ctx.moveTo(X(0),Y(k));ctx.lineTo(X(MAXM),Y(k+s*MAXM));ctx.stroke();};
    line(a,b,'#2563EB'); line(c,d,'#0E9384');
    ctx.strokeStyle='#16A34A';ctx.setLineDash([5,3]);ctx.lineWidth=1.4;
    ctx.beginPath();ctx.moveTo(X(USE),P);ctx.lineTo(X(USE),H-P);ctx.stroke();ctx.setLineDash([]);
    ctx.fillStyle='#16A34A';ctx.font='11px sans-serif';ctx.fillText('350분(나)',X(USE)-58,P+12);
    const ua=a+b*USE, ub=c+d*USE;
    const pref=(a===15000&&b===45&&d===5)?'문제 상황 — ':'';
    const vd=ua===ub?'두 요금제 완전 동률':(ua<ub?`A가 ${(ub-ua).toLocaleString()}원 이득`:`B가 ${(ua-ub).toLocaleString()}원 이득`);
    const use=`${pref}내 사용량 350분: A ${ua.toLocaleString()}원 / B ${ub.toLocaleString()}원 → <b>${vd}</b>`;
    let msg;
    if(b===d){
      msg = a===c ? '두 요금제가 <b>완전히 같습니다.</b> 어떤 시간에도 차이가 없습니다.'
        : `분당 요금이 같아 두 직선이 <b>평행</b>합니다. 교점이 없으므로 <b>항상 ${a<c?'A':'B'}</b>가 저렴합니다.`;
    } else {
      const m=(c-a)/(b-d), y=a+b*m;
      if(m>0 && m<=MAXM){
        ctx.fillStyle='#BE123C';ctx.beginPath();ctx.arc(X(m),Y(y),6,0,7);ctx.fill();
        ctx.strokeStyle='#BE123C';ctx.setLineDash([4,3]);ctx.lineWidth=1.2;
        ctx.beginPath();ctx.moveTo(X(m),Y(y));ctx.lineTo(X(m),H-P);ctx.stroke();ctx.setLineDash([]);
        ctx.fillStyle='#111827';ctx.font='bold 12px sans-serif';
        ctx.fillText(Math.round(m)+'분',X(m)+8,Y(y)-9);
      }
      msg = m<=0 ? `교점이 음수 시간(${m.toFixed(1)}분)에 있어 <b>실제로는 만나지 않습니다.</b> 0분부터 계속 ${a<c?'A':'B'}가 저렴합니다.`
        : m>MAXM ? `교점이 ${Math.round(m)}분으로 화면 밖입니다. 그 전까지는 ${a+b*1<c+d*1?'A':'B'}가 저렴합니다.`
        : `<span class="mono" style="font-size:15px">${a.toLocaleString()} + ${b}x = ${c.toLocaleString()} + ${d}x</span><br>
           x = (${c.toLocaleString()} − ${a.toLocaleString()}) / (${b} − ${d}) = <b>${m.toFixed(1)}분</b><br>
           <b>${m.toFixed(0)}분보다 적게 쓰면 ${b<d?'A':'B'}</b>, 많이 쓰면 <b>${b<d?'B':'A'}</b>가 저렴합니다.<br>
           그때 요금은 둘 다 <b>${Math.round(y).toLocaleString()}원</b>`;
    }
    $('#plout').innerHTML=use+'<br><br>'+msg;
  }
  $('#plq').onclick=()=>{$('#pa').value=15000;$('#pb').value=45;$('#pc').value=30000;$('#pd').value=5;draw();};
  ['pa','pb','pc','pd'].forEach(i=>$('#'+i).oninput=draw); draw();
}

/* ---------- LAB 12 드론으로 높이 재기 (삼각비) ---------- */
function trigDemo(root){
  root.innerHTML=`<div class="row"><div class="col"><canvas id="tg1" width="380" height="300"></canvas></div>
    <div class="col">
      ${slider('tth','올려본각 θ',5,80,1,35,'°')}
      ${slider('tds','수평 거리 d',10,120,1,50,'m')}
      ${slider('teh','내 눈높이',0,3,0.1,1.6,'m')}
      <div class="btns"><button class="b t sm" id="tgQ">📌 오늘의 문제 재기 (d=50 · θ=40°)</button></div>
      <div class="out" id="tgout"></div>
      <div class="note" style="margin-top:12px">올라가지 않고 높이를 재려면 무엇 무엇을 알면 될까요? 각과 거리를 바꾸며 단서를 모아 보세요.</div>
    </div></div>`;
  const cv=$('#tg1'),ctx=cv.getContext('2d'),W=380,H=300;
  function draw(){
    const th=+$('#tth').value, d=+$('#tds').value, eh=+$('#teh').value;
    $('#tthv').textContent=th+'°'; $('#tdsv').textContent=d+'m'; $('#tehv').textContent=eh.toFixed(1)+'m';
    const rad=th*Math.PI/180, h=d*Math.tan(rad)+eh, hyp=d/Math.cos(rad);
    const maxX=130, maxY=Math.max(60,h*1.15);
    const X=v=>30+(W-60)*v/maxX, Y=v=>H-40-(H-70)*v/maxY;
    ctx.clearRect(0,0,W,H);
    ctx.fillStyle='#F5F7FA';ctx.fillRect(0,0,W,H);
    ctx.strokeStyle='#9CA3AF';ctx.lineWidth=1.4;
    ctx.beginPath();ctx.moveTo(0,Y(0));ctx.lineTo(W,Y(0));ctx.stroke();       // 지면
    ctx.fillStyle='#CBD5E1';ctx.fillRect(X(d)-16,Y(h),32,Y(0)-Y(h));          // 건물
    ctx.strokeStyle='#94A3B8';ctx.strokeRect(X(d)-16,Y(h),32,Y(0)-Y(h));
    ctx.strokeStyle='#B45309';ctx.setLineDash([4,3]);ctx.lineWidth=1.4;       // 눈높이 수평선
    ctx.beginPath();ctx.moveTo(X(0),Y(eh));ctx.lineTo(X(d),Y(eh));ctx.stroke();ctx.setLineDash([]);
    ctx.strokeStyle='#2563EB';ctx.lineWidth=2.4;                              // 시선
    ctx.beginPath();ctx.moveTo(X(0),Y(eh));ctx.lineTo(X(d),Y(h));ctx.stroke();
    ctx.strokeStyle='#0E9384';ctx.lineWidth=2;                                // 높이 성분
    ctx.beginPath();ctx.moveTo(X(d),Y(eh));ctx.lineTo(X(d),Y(h));ctx.stroke();
    ctx.strokeStyle='#B45309';ctx.lineWidth=1.6;                              // 각 표시
    ctx.beginPath();ctx.arc(X(0),Y(eh),26,-rad,0);ctx.stroke();
    ctx.fillStyle='#B45309';ctx.font='bold 12px sans-serif';
    ctx.fillText(th+'°',X(0)+30,Y(eh)-7);
    ctx.fillStyle='#111827';ctx.beginPath();ctx.arc(X(0),Y(eh),4,0,7);ctx.fill();
    ctx.font='bold 12px sans-serif';
    ctx.fillText(h.toFixed(1)+' m',X(d)+20,Y(h)+14);
    $('#tgout').innerHTML=
      `<span class="mono" style="font-size:15px">tan ${th}° = (높이 − 눈높이) / ${d}</span><br><br>
       tan ${th}° = <b>${Math.tan(rad).toFixed(4)}</b><br>
       눈높이 위 부분 = ${d} × ${Math.tan(rad).toFixed(4)} = <b>${(d*Math.tan(rad)).toFixed(2)} m</b><br>
       건물 높이 = 그 값 + 눈높이 ${eh.toFixed(1)} = <b>${h.toFixed(2)} m</b><br><br>
       참고 · 시선 길이(빗변) = ${d} / cos ${th}° = ${hyp.toFixed(2)} m${(d===50&&th===40&&Math.abs(eh-1.6)<0.051)?'<br><b style="color:#0E9384">📌 본관 높이 확정 — 오늘의 문제 해결! ('+h.toFixed(2)+' m)</b>':''}`;
  }
  $('#tgQ').onclick=()=>{ $('#tds').value=50; $('#tth').value=40; $('#teh').value=1.6; draw(); };
  ['tth','tds','teh'].forEach(i=>$('#'+i).oninput=draw); draw();
}

/* ---------- LAB 06 산점도와 상관계수 ---------- */
function corrDemo(root){
  root.innerHTML=`<div class="row"><div class="col">
    <canvas id="co1" width="380" height="300" style="cursor:crosshair"></canvas>
    <div style="font-size:12.5px;color:#6B7280;margin-top:6px">← 그래프를 클릭해 점을 추가해 보세요 (이상치를 찍어 보면 r 이 얼마나 흔들리는지 보입니다)</div></div>
    <div class="col">
      ${slider('crs','실제 관계의 세기',-100,100,5,70,'%')}
      ${slider('crn','흩어진 정도(잡음)',0,60,2,18,'')}
      <div class="btns"><button class="b t" id="crq">📌 우리 반 12명 데이터</button>
        <button class="b g" id="crnew">새로 뽑기</button>
        <button class="b g" id="crclr">지우기</button></div>
      <div class="out" id="crout"></div>
      <div class="note" style="margin-top:12px"><b>상관은 인과가 아닙니다.</b>
      r 이 아무리 커도 “A가 B의 원인”이라는 뜻은 아닙니다. 숨은 제3의 변수를 늘 의심해야 합니다.</div>
    </div></div>`;
  const cv=$('#co1'),ctx=cv.getContext('2d'),W=380,H=300,P=34;
  let pts=[];
  const X=v=>P+(W-2*P)*v/10, Y=v=>H-P-(H-2*P)*v/10;
  const iX=p=>(p-P)/(W-2*P)*10, iY=p=>(H-P-p)/(H-2*P)*10;
  let seed=7; const rnd=()=>{ seed=(seed*1103515245+12345)&0x7fffffff; return seed/0x7fffffff; };
  function gen(){
    const s=+$('#crs').value/100, n=+$('#crn').value/100;
    pts=[]; seed=7;
    for(let i=0;i<24;i++){
      const x=0.6+rnd()*8.8;
      const base=5+s*(x-5);
      const y=Math.max(0.2,Math.min(9.8, base+(rnd()-0.5)*20*n));
      pts.push([x,y]);
    }
  }
  function stats(){
    const n=pts.length; if(n<2) return null;
    const mx=pts.reduce((a,p)=>a+p[0],0)/n, my=pts.reduce((a,p)=>a+p[1],0)/n;
    let sxy=0,sxx=0,syy=0;
    pts.forEach(p=>{sxy+=(p[0]-mx)*(p[1]-my);sxx+=(p[0]-mx)**2;syy+=(p[1]-my)**2;});
    const sdx=Math.sqrt(sxx/n), sdy=Math.sqrt(syy/n), cov=sxy/n;
    return {n,mx,my,cov,sdx,sdy,r:(sdx&&sdy)?cov/(sdx*sdy):0,a:sxx?sxy/sxx:0};
  }
  function draw(){
    $('#crsv').textContent=$('#crs').value+'%'; $('#crnv').textContent=$('#crn').value;
    axes(ctx,W,H,P);
    const S=stats();
    if(S){
      ctx.strokeStyle='#2563EB';ctx.lineWidth=2.2;ctx.beginPath();
      const b=S.my-S.a*S.mx;
      ctx.moveTo(X(0),Y(b));ctx.lineTo(X(10),Y(S.a*10+b));ctx.stroke();
    }
    ctx.fillStyle='#111827';
    pts.forEach(p=>{ctx.beginPath();ctx.arc(X(p[0]),Y(p[1]),4,0,7);ctx.fill();});
    if(S){
      const str=Math.abs(S.r), lab= str>=.7?'강한':str>=.4?'뚜렷한':str>=.2?'약한':'거의 없는';
      const dir=S.r>0?'양의':'음의';
      $('#crout').innerHTML=
        `<span class="mono" style="font-size:15px">r = 공분산 / (σx · σy)</span><br><br>
         공분산 = <b>${S.cov.toFixed(3)}</b><br>
         σx = ${S.sdx.toFixed(3)} &nbsp; σy = ${S.sdy.toFixed(3)}<br>
         r = ${S.cov.toFixed(3)} / (${S.sdx.toFixed(3)} × ${S.sdy.toFixed(3)}) = <b style="font-size:16px">${S.r.toFixed(3)}</b><br><br>
         → ${lab} ${dir} 상관 (자료 ${S.n}개)<br>
         <span style="color:#6B7280;font-size:12.5px">r 은 반드시 −1 ≤ r ≤ 1 입니다. 이 범위를 벗어나면 계산이 틀린 것입니다.</span>`;
    }
  }
  cv.onclick=e=>{const r=cv.getBoundingClientRect();
    const x=iX((e.clientX-r.left)*W/r.width), y=iY((e.clientY-r.top)*H/r.height);
    if(x>=0&&x<=10&&y>=0&&y<=10){pts.push([x,y]);draw();}};
  $('#crq').onclick=()=>{ pts=[[1,4.2],[2,3.0],[2.5,5.1],[3,4.0],[4,6.2],[5,4.6],[5.5,6.8],[6,5.4],[7,7.6],[8,6.0],[8.5,8.2],[9.5,7.2]]; draw(); };
  $('#crnew').onclick=()=>{gen();draw();};
  $('#crclr').onclick=()=>{pts=[];draw();};
  ['crs','crn'].forEach(i=>$('#'+i).oninput=()=>{gen();draw();});
  gen(); draw();
}

/* ---------- LAB 07 대푯값과 이상치 ---------- */
function repDemo(root){ let rpHad=false;
  root.innerHTML=`<div class="row"><div class="col"><canvas id="rp1" width="380" height="300"></canvas></div>
    <div class="col">
      ${slider('rpb','사장님 연봉',3000,60000,1000,4000,'만원')}
      <div class="out" id="rpout"></div>
      <div class="note" style="margin-top:12px">“우리 회사 <b>평균</b> 연봉”이라는 말이 왜 위험한지
      한 사람의 값만 올려 보면 압니다. 평균은 끌려가고 <b>중앙값은 버팁니다.</b></div>
    </div></div>`;
  const cv=$('#rp1'),ctx=cv.getContext('2d'),W=380,H=300;
  const base=[3200,3400,3500,3600,3800,3900,4100,4300,4600];
  function draw(){
    const boss=+$('#rpb').value;
    $('#rpbv').textContent=boss.toLocaleString('ko-KR')+'만원';
    const arr=base.concat([boss]);
    const sorted=arr.slice().sort((a,b)=>a-b);
    const n=sorted.length;
    const mean=arr.reduce((a,b)=>a+b,0)/n;
    const med=n%2 ? sorted[(n-1)/2] : (sorted[n/2-1]+sorted[n/2])/2;
    const maxV=Math.max(...arr)*1.08;
    ctx.clearRect(0,0,W,H); ctx.fillStyle='#fff'; ctx.fillRect(0,0,W,H);
    const bw=(W-50)/n, Y=v=>H-40-(H-70)*v/maxV;
    sorted.forEach((v,i)=>{
      ctx.fillStyle = v===boss ? '#BE123C' : '#94A3B8';
      ctx.fillRect(35+i*bw+3, Y(v), bw-6, H-40-Y(v));
    });
    ctx.strokeStyle='#9CA3AF';ctx.beginPath();ctx.moveTo(30,H-40);ctx.lineTo(W-10,H-40);ctx.stroke();
    const mark=(v,col,lab)=>{ctx.strokeStyle=col;ctx.lineWidth=2;ctx.setLineDash([5,3]);
      ctx.beginPath();ctx.moveTo(30,Y(v));ctx.lineTo(W-10,Y(v));ctx.stroke();ctx.setLineDash([]);
      ctx.fillStyle=col;ctx.font='bold 11px sans-serif';ctx.fillText(lab,34,Y(v)-4);};
    mark(mean,'#2563EB','평균 '+Math.round(mean).toLocaleString());
    mark(med,'#0E9384','중앙값 '+Math.round(med).toLocaleString());
    const gap=mean-med;
    $('#rpout').innerHTML=
      `직원 9명 + 사장님 1명 = 10명<br><br>
       <b style="color:#2563EB">평균 ${Math.round(mean).toLocaleString()}만원</b><br>
       <b style="color:#0E9384">중앙값 ${Math.round(med).toLocaleString()}만원</b><br><br>
       차이 <b>${Math.round(gap).toLocaleString()}만원</b><br>
       평균보다 적게 받는 사람 = <b>${arr.filter(v=>v<mean).length}명 / 10명</b><br>
       ${boss===60000?'<b style="color:#BE123C">📌 광고의 정체 — 평균 '+Math.round(mean).toLocaleString()+'만원 회사를 재현했습니다.</b><br>':''}<br>
       <span style="color:#6B7280;font-size:12.5px">${gap>500
         ? (rpHad=true, '한 사람의 값이 평균을 크게 끌어올렸습니다. 이럴 때는 중앙값이 “보통 사람”을 더 잘 나타냅니다.')
         : (rpHad?'평균과 중앙값이 다시 비슷해졌습니다 — 이상치가 사라지면 두 대푯값이 도로 만납니다.':'아직 이상치가 크지 않아 평균과 중앙값이 비슷합니다. 사장님 연봉을 올려 보세요.')}</span>`;
  }
  $('#rpb').oninput=draw; draw();
}

/* ---------- LAB 08 경우의 수 — 비밀번호 ---------- */
function pwDemo(root){
  root.innerHTML=`<div class="row"><div class="col"><canvas id="pw1" width="380" height="260"></canvas></div>
    <div class="col">
      ${slider('pwn','비밀번호 자리 수',1,12,1,4,'자리')}
      <label class="ctl">쓸 수 있는 문자<select id="pwk" style="padding:6px;font-size:14px;width:100%">
        <option value="10">숫자만 (10종)</option>
        <option value="26">영문 소문자만 (26종)</option>
        <option value="36">소문자 + 숫자 (36종)</option>
        <option value="62">대소문자 + 숫자 (62종)</option>
        <option value="94">대소문자 + 숫자 + 기호 (94종)</option></select></label>
      ${slider('pws','초당 시도 횟수',3,12,1,9,' (10의 거듭제곱)')}
      <div class="out" id="pwout"></div>
      <div class="note" style="margin-top:12px">자리 수를 하나 늘리는 것과 문자 종류를 늘리는 것 중
      <b>무엇이 더 강력한지</b> 직접 비교해 보세요.</div>
    </div></div>`;
  const cv=$('#pw1'),ctx=cv.getContext('2d'),W=380,H=260;
  const fmtT=s=>{ if(s<60) return s.toFixed(1)+'초';
    if(s<3600) return (s/60).toFixed(1)+'분';
    if(s<86400) return (s/3600).toFixed(1)+'시간';
    if(s<3.15e7) return (s/86400).toFixed(1)+'일';
    const y=s/3.15e7; return y<1e6 ? y.toFixed(1)+'년' : y.toExponential(2)+'년'; };
  function draw(){
    const n=+$('#pwn').value, k=+$('#pwk').value, sp=Math.pow(10,+$('#pws').value);
    $('#pwnv').textContent=n+'자리'; $('#pwsv').textContent='10^'+$('#pws').value+'회';
    const total=Math.pow(k,n), sec=total/2/sp;
    ctx.clearRect(0,0,W,H); ctx.fillStyle='#fff'; ctx.fillRect(0,0,W,H);
    // 자리 수에 따른 가짓수를 로그 눈금 막대로
    const P=34, maxLog=Math.log10(Math.pow(k,12))||1;
    ctx.strokeStyle='#E5E7EB';
    for(let i=0;i<=4;i++){const y=H-P-(H-2*P)*i/4;ctx.beginPath();ctx.moveTo(P,y);ctx.lineTo(W-14,y);ctx.stroke();}
    for(let i=1;i<=12;i++){
      const v=Math.log10(Math.pow(k,i)), h=(H-2*P)*Math.min(1,v/maxLog);
      ctx.fillStyle = i===n ? '#BE123C' : '#CBD5E1';
      ctx.fillRect(P+(i-1)*27+4, H-P-h, 20, h);
    }
    ctx.fillStyle='#6B7280';ctx.font='10px sans-serif';
    ctx.fillText('자리 수 →',P,H-12); ctx.fillText('가짓수(로그 눈금)',P,18);
    $('#pwout').innerHTML=
      `<span class="mono" style="font-size:15px">${k}<sup>${n}</sup> = 가짓수</span><br><br>
       전체 경우의 수 = <b>${total.toExponential(3)}</b>개<br>
       평균 절반만 시도한다고 보면 ${(total/2).toExponential(3)}회<br>
       초당 ${sp.toExponential(0)}회 시도 시 → <b style="font-size:16px">${fmtT(sec)}</b><br><br>
       <span style="color:#6B7280;font-size:12.5px">한 자리 늘리면 ${k}배, 문자 종류를 늘리면 밑이 커집니다.
       <b>지수의 위력</b>이 어디서 나오는지 비교해 보세요.</span>`;
  }
  ['pwn','pws'].forEach(i=>$('#'+i).oninput=draw); $('#pwk').onchange=draw; draw();
}

/* ---------- LAB 09 확률과 큰 수의 법칙 ---------- */
function lawDemo(root){
  root.innerHTML=`<div class="row"><div class="col"><canvas id="lw1" width="380" height="280"></canvas></div>
    <div class="col">
      ${slider('lwp','당첨 확률',0.1,20,0.1,0.5,'%')}
      ${slider('lwn','뽑은 횟수',10,3000,10,100,'회')}
      <div class="btns"><button class="b" id="lwgo">다시 뽑기</button></div>
      <div class="out" id="lwout"></div>
      <div class="note" style="margin-top:12px">「확률 0.5%」라는 말은 실제 뽑기에서 어떤 모습으로 나타날까요? 횟수를 바꿔 가며 지켜보세요.</div>
    </div></div>`;
  const cv=$('#lw1'),ctx=cv.getContext('2d'),W=380,H=280,P=38;
  let seed=11; const rnd=()=>{ seed=(seed*1103515245+12345)&0x7fffffff; return seed/0x7fffffff; };
  function draw(reseed){
    const p=+$('#lwp').value/100, n=+$('#lwn').value;
    $('#lwpv').textContent=(+$('#lwp').value).toFixed(1)+'%'; $('#lwnv').textContent=n+'회';
    if(reseed) seed=(Date.now()&0x7fffffff)||11;
    let s=seed, hit=0; const path=[];
    const rr=()=>{ s=(s*1103515245+12345)&0x7fffffff; return s/0x7fffffff; };
    for(let i=1;i<=n;i++){ if(rr()<p) hit++; path.push(hit/i); }
    const top=Math.max(p*3, 0.02);
    const X=i=>P+(W-P-14)*i/n, Y=v=>H-P-(H-2*P)*Math.min(1,v/top);
    ctx.clearRect(0,0,W,H); ctx.fillStyle='#fff'; ctx.fillRect(0,0,W,H);
    ctx.strokeStyle='#E5E7EB';
    for(let i=0;i<=4;i++){const y=H-P-(H-2*P)*i/4;ctx.beginPath();ctx.moveTo(P,y);ctx.lineTo(W-14,y);ctx.stroke();}
    ctx.strokeStyle='#B45309';ctx.setLineDash([5,3]);ctx.lineWidth=1.6;
    ctx.beginPath();ctx.moveTo(P,Y(p));ctx.lineTo(W-14,Y(p));ctx.stroke();ctx.setLineDash([]);
    ctx.fillStyle='#B45309';ctx.font='bold 11px sans-serif';
    ctx.fillText('이론 확률 '+(p*100).toFixed(1)+'%',P+6,Y(p)-6);
    ctx.strokeStyle='#2563EB';ctx.lineWidth=2;ctx.beginPath();
    path.forEach((v,i)=>{ const x=X(i+1),y=Y(v); i?ctx.lineTo(x,y):ctx.moveTo(x,y); });
    ctx.stroke();
    ctx.fillStyle='#6B7280';ctx.font='10px sans-serif';ctx.fillText('뽑은 횟수 →',P,H-14);
    const atLeast=1-Math.pow(1-p,n);
    $('#lwout').innerHTML=
      `${n}회 중 당첨 <b>${hit}회</b> → 실험 확률 <b>${(hit/n*100).toFixed(2)}%</b><br>
       이론 확률 ${(p*100).toFixed(1)}%<br><br>
       <span class="mono">P(적어도 한 번) = 1 − (1−p)<sup>n</sup></span><br>
       = 1 − (1−${p.toFixed(3)})<sup>${n}</sup> = <b style="font-size:16px">${(atLeast*100).toFixed(1)}%</b><br>
       ${(n===200&&Math.abs(p-0.005)<1e-9)?'<b style="color:#BE123C">📌 친구 주장 판정 — 200번의 「적어도 1번」은 '+(atLeast*100).toFixed(1)+'%: 「무조건」은 과장입니다.</b><br>':''}<br>
       <span style="color:#6B7280;font-size:12.5px">${atLeast<0.5
         ? '절반도 안 됩니다. “이 정도 뽑으면 나오겠지”라는 감각이 왜 틀리는지 보여 주세요.'
         : '이제 절반을 넘었습니다. 몇 번부터 넘는지 찾아보세요.'}</span>`;
  }
  ['lwp','lwn'].forEach(i=>$('#'+i).oninput=()=>draw(false));
  $('#lwgo').onclick=()=>draw(true); draw(false);
}

/* ---------- LAB 10 정규분포와 표준점수 ---------- */
function zDemo(root){
  root.innerHTML=`<div class="row"><div class="col"><canvas id="z1" width="380" height="270"></canvas></div>
    <div class="col">
      ${slider('zx','내 점수',0,100,1,78,'점')}
      ${slider('zm','평균',0,100,1,65,'점')}
      ${slider('zs','표준편차',1,30,1,12,'점')}
      <div class="btns"><button class="b t sm" id="zqM">📌 수학 (78·70·5)</button>
        <button class="b t sm" id="zqE">📌 영어 (78·70·25)</button></div>
      <div class="out" id="zout"></div>
      <div class="note" style="margin-top:12px">같은 78점이라도 <b>평균과 표준편차가 다르면</b> 위치가 완전히 달라집니다.
      원점수가 아니라 <b>z</b>로 바꿔야 비교할 수 있습니다.</div>
    </div></div>`;
  const cv=$('#z1'),ctx=cv.getContext('2d'),W=380,H=270,P=32;
  const phi=z=>{ const t=1/(1+0.2316419*Math.abs(z));
    const d=0.3989423*Math.exp(-z*z/2);
    let p=d*t*(0.3193815+t*(-0.3565638+t*(1.781478+t*(-1.821256+t*1.330274))));
    return z>0 ? 1-p : p; };
  function draw(){
    const x=+$('#zx').value, m=+$('#zm').value, s=+$('#zs').value;
    $('#zxv').textContent=x+'점'; $('#zmv').textContent=m+'점'; $('#zsv').textContent=s+'점';
    const z=(x-m)/s, pct=phi(z)*100;
    const X=v=>P+(W-2*P)*v/100, pk=0.3989423/s;
    const Y=v=>H-P-(H-2*P)*v/pk;
    const f=v=>0.3989423/s*Math.exp(-Math.pow((v-m)/s,2)/2);
    ctx.clearRect(0,0,W,H); ctx.fillStyle='#fff'; ctx.fillRect(0,0,W,H);
    ctx.fillStyle='#DCE7FB';ctx.beginPath();ctx.moveTo(X(0),Y(0));
    for(let v=0;v<=x;v+=0.5) ctx.lineTo(X(v),Y(f(v)));
    ctx.lineTo(X(x),Y(0));ctx.closePath();ctx.fill();
    ctx.strokeStyle='#2563EB';ctx.lineWidth=2.4;ctx.beginPath();
    for(let v=0;v<=100;v+=0.5){const px=X(v),py=Y(f(v)); v?ctx.lineTo(px,py):ctx.moveTo(px,py);}
    ctx.stroke();
    ctx.strokeStyle='#9CA3AF';ctx.beginPath();ctx.moveTo(P,Y(0));ctx.lineTo(W-P,Y(0));ctx.stroke();
    [[m,'#B45309','평균'],[x,'#BE123C','내 점수']].forEach(([v,c,l])=>{
      ctx.strokeStyle=c;ctx.lineWidth=2;ctx.setLineDash(l==='평균'?[5,3]:[]);
      ctx.beginPath();ctx.moveTo(X(v),Y(0));ctx.lineTo(X(v),Y(f(v)));ctx.stroke();ctx.setLineDash([]);
      ctx.fillStyle=c;ctx.font='bold 11px sans-serif';ctx.fillText(l+' '+v,X(v)+4,Y(f(v))-6);});
    $('#zout').innerHTML=
      `<span class="mono" style="font-size:15px">z = (x − m) / σ</span><br><br>
       z = (${x} − ${m}) / ${s} = <b style="font-size:16px">${z.toFixed(3)}</b><br><br>
       상위 <b>${(100-pct).toFixed(1)}%</b> · 백분위 <b>${pct.toFixed(1)}</b><br>
       ${Math.abs(z)<0.0001?'평균과 같습니다.':
         z>0?`평균보다 <b>${z.toFixed(2)}σ 위</b>`:`평균보다 <b>${(-z).toFixed(2)}σ 아래</b>`}<br><br>
       ${(x===78&&m===70&&s===5)?'<b style="color:#2563EB">📌 수학 z = +1.60 — 같은 78점의 첫 번째 얼굴</b><br>':''}${(x===78&&m===70&&s===25)?'<b style="color:#0E9384">📌 영어 z = +0.32 — 같은 78점인데 위치는 5분의 1</b><br>':''}<span style="color:#6B7280;font-size:12.5px">표준편차를 바꿔 보세요. 점수는 그대로인데 z 와 백분위가 크게 달라집니다.</span>`;
  }
  $('#zqM').onclick=()=>{ $('#zx').value=78; $('#zm').value=70; $('#zs').value=5; draw(); };
  $('#zqE').onclick=()=>{ $('#zx').value=78; $('#zm').value=70; $('#zs').value=25; draw(); };
  ['zx','zm','zs'].forEach(i=>$('#'+i).oninput=draw); draw();
}

/* ---------- LAB 11 복리와 72의 법칙 ---------- */
function cmpDemo(root){
  root.innerHTML=`<div class="row"><div class="col"><canvas id="cm1" width="380" height="280"></canvas></div>
    <div class="col">
      ${slider('cmp','원금',100,5000,100,1000,'만원')}
      ${slider('cmr','연 이자율',1,20,0.5,7,'%')}
      ${slider('cmy','기간',1,40,1,20,'년')}
      <div class="out" id="cmout"></div>
      <div class="note" style="margin-top:12px">두 곡선의 모양 차이는 어디서 올까요? 그리고 72 를 이자율로 나눈 값은 무엇과 닮아 있나요? 직접 견줘 보세요.</div>
    </div></div>`;
  const cv=$('#cm1'),ctx=cv.getContext('2d'),W=380,H=280,P=42;
  function draw(){
    const p=+$('#cmp').value, r=+$('#cmr').value/100, y=+$('#cmy').value;
    $('#cmpv').textContent=p.toLocaleString()+'만원'; $('#cmrv').textContent=(+$('#cmr').value).toFixed(1)+'%';
    $('#cmyv').textContent=y+'년';
    const simple=t=>p*(1+r*t), comp=t=>p*Math.pow(1+r,t);
    const maxV=Math.max(comp(y),simple(y))*1.08;
    const X=t=>P+(W-P-14)*t/y, Y=v=>H-P-(H-2*P)*v/maxV;
    ctx.clearRect(0,0,W,H); ctx.fillStyle='#fff'; ctx.fillRect(0,0,W,H);
    ctx.strokeStyle='#E5E7EB';
    for(let i=0;i<=4;i++){const yy=H-P-(H-2*P)*i/4;ctx.beginPath();ctx.moveTo(P,yy);ctx.lineTo(W-14,yy);ctx.stroke();}
    const path=(f,col,w)=>{ctx.strokeStyle=col;ctx.lineWidth=w;ctx.beginPath();
      for(let t=0;t<=y;t+=y/160){const x=X(t),yy=Y(f(t));t?ctx.lineTo(x,yy):ctx.moveTo(x,yy);}ctx.stroke();};
    path(simple,'#94A3B8',2); path(comp,'#2563EB',2.8);
    const dbl=Math.log(2)/Math.log(1+r);
    if(dbl<=y){
      ctx.strokeStyle='#BE123C';ctx.setLineDash([4,3]);ctx.lineWidth=1.4;
      ctx.beginPath();ctx.moveTo(X(dbl),Y(0));ctx.lineTo(X(dbl),Y(2*p));ctx.stroke();ctx.setLineDash([]);
      ctx.fillStyle='#BE123C';ctx.beginPath();ctx.arc(X(dbl),Y(2*p),5,0,7);ctx.fill();
      ctx.font='bold 11px sans-serif';ctx.fillText('두 배 '+dbl.toFixed(1)+'년',X(dbl)+6,Y(2*p)-8);
    }
    ctx.strokeStyle='#9CA3AF';ctx.beginPath();ctx.moveTo(P,H-P);ctx.lineTo(W-14,H-P);
    ctx.moveTo(P,H-P);ctx.lineTo(P,22);ctx.stroke();
    ctx.fillStyle='#6B7280';ctx.font='10px sans-serif';
    ctx.fillText('복리',P+6,32); ctx.fillText('단리',P+6,44);
    ctx.fillStyle='#2563EB';ctx.fillRect(P+34,26,12,3);
    ctx.fillStyle='#94A3B8';ctx.fillRect(P+34,38,12,3);
    $('#cmout').innerHTML=
      `<span class="mono" style="font-size:15px">복리 S = P(1 + r)<sup>n</sup></span><br><br>
       ${y}년 뒤 · 단리 <b>${Math.round(simple(y)).toLocaleString()}만원</b><br>
       ${y}년 뒤 · 복리 <b style="color:#2563EB">${Math.round(comp(y)).toLocaleString()}만원</b><br>
       차이 <b>${Math.round(comp(y)-simple(y)).toLocaleString()}만원</b><br><br>
       두 배 되는 햇수 = log2 / log(1+${r.toFixed(3)}) = <b>${dbl.toFixed(2)}년</b><br>
       72의 법칙 어림값 = 72 / ${(+$('#cmr').value).toFixed(1)} = <b>${(72/+$('#cmr').value).toFixed(2)}년</b><br>
       ${Math.abs(+$('#cmr').value-6)<0.01?'<b style="color:#0E9384">📌 아빠 주장 판정 — 6%의 두 배 시간은 '+dbl.toFixed(2)+'년: 「12년」 거의 정확! (72÷6=12)</b><br>':''}
       <span style="color:#6B7280;font-size:12.5px">어림값이 정확값과 얼마나 가까운지 이자율을 바꿔 가며 확인해 보세요.</span>`;
  }
  ['cmp','cmr','cmy'].forEach(i=>$('#'+i).oninput=draw); draw();
}

/* ---------- LAB 12 로그 스케일 ---------- */
function logDemo(root){
  root.innerHTML=`<div class="row"><div class="col"><canvas id="lg1" width="380" height="280"></canvas></div>
    <div class="col">
      <div class="seg" id="lgseg" style="margin-bottom:10px">
        <button class="on" data-m="lin">보통 눈금</button><button data-m="log">로그 눈금</button></div>
      <label class="ctl">자료<select id="lgd" style="padding:6px;font-size:14px;width:100%">
        <option value="quake">지진 규모별 방출 에너지</option>
        <option value="pop">도시별 인구</option>
        <option value="sound">소리의 세기</option></select></label>
      <div class="out" id="lgout"></div>
      <div class="note" style="margin-top:12px">작은 값들이 화면 어디에 숨어 있나요? 모두가 보이게 만드는 방법이 있을까요?</div>
    </div></div>`;
  const DATA={
    quake:{lab:'지진 규모',unit:'× 기준 에너지',
      items:[['규모 3',1],['규모 4',31.6],['규모 5',1000],['규모 6',31623],['규모 7',1e6],['규모 8',3.16e7]]},
    pop:{lab:'도시 인구',unit:'명',
      items:[['읍 단위',2e4],['중소도시',2.5e5],['광역시',1.5e6],['서울',9.4e6],['도쿄권',3.7e7]]},
    sound:{lab:'소리 세기',unit:'× 기준 세기',
      items:[['속삭임',10],['대화',1e4],['도로',1e7],['공사장',1e10],['제트기',1e13]]}
  };
  const cv=$('#lg1'),ctx=cv.getContext('2d'),W=380,H=280,P=44;
  let mode='lin';
  function draw(){
    const D=DATA[$('#lgd').value], it=D.items, n=it.length;
    const maxV=Math.max(...it.map(x=>x[1]));
    const bw=(W-P-16)/n;
    ctx.clearRect(0,0,W,H); ctx.fillStyle='#fff'; ctx.fillRect(0,0,W,H);
    ctx.strokeStyle='#E5E7EB';
    for(let i=0;i<=5;i++){const y=H-P-(H-2*P)*i/5;ctx.beginPath();ctx.moveTo(P,y);ctx.lineTo(W-16,y);ctx.stroke();
      ctx.fillStyle='#9CA3AF';ctx.font='9px sans-serif';
      const v = mode==='lin' ? maxV*i/5 : Math.pow(10, Math.log10(maxV)*i/5);
      ctx.fillText(v>=1e4?v.toExponential(0):Math.round(v).toString(), 4, y+3);}
    it.forEach((x,i)=>{
      const frac = mode==='lin' ? x[1]/maxV : Math.log10(Math.max(1,x[1]))/Math.log10(maxV);
      const h=(H-2*P)*Math.max(0,frac);
      ctx.fillStyle = i===n-1 ? '#BE123C' : '#2563EB';
      ctx.fillRect(P+i*bw+5, H-P-h, bw-10, h);
      ctx.save(); ctx.translate(P+i*bw+bw/2, H-P+8); ctx.rotate(-0.5);
      ctx.fillStyle='#374151'; ctx.font='10px sans-serif'; ctx.textAlign='right';
      ctx.fillText(x[0],0,0); ctx.restore();
    });
    ctx.strokeStyle='#9CA3AF';ctx.beginPath();ctx.moveTo(P,H-P);ctx.lineTo(W-16,H-P);ctx.stroke();
    const sm=it[0][1], lg=it[n-1][1];
    $('#lgout').innerHTML=
      `<b>${D.lab}</b> (${D.unit})<br><br>
       가장 작은 값 ${sm.toExponential(1)} · 가장 큰 값 ${lg.toExponential(1)}<br>
       배율 = <b>${(lg/sm).toExponential(1)}배</b><br>
       log₁₀(배율) = <b>${Math.log10(lg/sm).toFixed(2)}</b> → 자릿수로 ${Math.round(Math.log10(lg/sm))}자리 차이<br><br>
       <span style="color:#6B7280;font-size:12.5px">${mode==='lin'
         ? '보통 눈금입니다. 작은 값들이 바닥에 붙어 서로 비교가 안 됩니다.'
         : '로그 눈금입니다. 한 칸 올라갈 때마다 10배씩 커지므로 모든 값이 함께 보입니다.'}</span>`;
  }
  document.querySelectorAll('#lgseg button').forEach(b=>b.onclick=()=>{
    document.querySelectorAll('#lgseg button').forEach(x=>x.classList.remove('on'));
    b.classList.add('on'); mode=b.dataset.m; draw();});
  $('#lgd').onchange=draw; draw();
}

/* ---------- LAB 13 순간속도와 미분계수 ---------- */
function velDemo(root){
  root.innerHTML=`<div class="row"><div class="col"><canvas id="vl1" width="380" height="300"></canvas></div>
    <div class="col">
      ${slider('vlt','시각 t',0.2,4.8,0.1,2,'초')}
      ${slider('vlh','구간 폭 h',0.02,2,0.02,1.2,'초')}
      <div class="out" id="vlout"></div>
      <div class="note" style="margin-top:12px">h 를 마음껏 줄여 보세요 — 할선의 운명은 어떻게 될까요? 과속 단속 카메라와 무슨 관계가 있을지도 생각해 보세요.</div>
    </div></div>`;
  const cv=$('#vl1'),ctx=cv.getContext('2d'),W=380,H=300,P=40;
  const s=t=>2*t*t+3*t;          // 위치 s(t) = 2t² + 3t
  const v=t=>4*t+3;              // 순간속도 s'(t) = 4t + 3
  function draw(){
    const t=+$('#vlt').value, h=+$('#vlh').value;
    $('#vltv').textContent=t.toFixed(1)+'초'; $('#vlhv').textContent=h.toFixed(2)+'초';
    const T=5, maxS=s(T)*1.05;
    const X=x=>P+(W-P-14)*x/T, Y=y=>H-P-(H-2*P)*y/maxS;
    ctx.clearRect(0,0,W,H); ctx.fillStyle='#fff'; ctx.fillRect(0,0,W,H);
    ctx.strokeStyle='#E5E7EB';
    for(let i=0;i<=5;i++){const y=H-P-(H-2*P)*i/5;ctx.beginPath();ctx.moveTo(P,y);ctx.lineTo(W-14,y);ctx.stroke();}
    ctx.strokeStyle='#2563EB';ctx.lineWidth=2.6;ctx.beginPath();
    for(let x=0;x<=T;x+=0.02){const px=X(x),py=Y(s(x));x?ctx.lineTo(px,py):ctx.moveTo(px,py);}
    ctx.stroke();
    const t2=Math.min(T,t+h), sec=(s(t2)-s(t))/(t2-t), tan=v(t);
    // 할선
    ctx.strokeStyle='#B45309';ctx.lineWidth=2;ctx.beginPath();
    ctx.moveTo(X(0),Y(s(t)-sec*t));ctx.lineTo(X(T),Y(s(t)+sec*(T-t)));ctx.stroke();
    // 접선
    ctx.strokeStyle='#BE123C';ctx.setLineDash([5,3]);ctx.lineWidth=2;ctx.beginPath();
    ctx.moveTo(X(0),Y(s(t)-tan*t));ctx.lineTo(X(T),Y(s(t)+tan*(T-t)));ctx.stroke();ctx.setLineDash([]);
    [[t,'#111827'],[t2,'#B45309']].forEach(([x,c])=>{ctx.fillStyle=c;
      ctx.beginPath();ctx.arc(X(x),Y(s(x)),5,0,7);ctx.fill();});
    ctx.strokeStyle='#9CA3AF';ctx.beginPath();ctx.moveTo(P,H-P);ctx.lineTo(W-14,H-P);
    ctx.moveTo(P,H-P);ctx.lineTo(P,20);ctx.stroke();
    ctx.fillStyle='#6B7280';ctx.font='10px sans-serif';ctx.fillText('시각 t →',P,H-14);
    $('#vlout').innerHTML=
      `<span class="mono">s(t) = 2t² + 3t</span><br><br>
       <b style="color:#B45309">평균속도</b> = (s(${t2.toFixed(2)}) − s(${t.toFixed(1)})) / ${(t2-t).toFixed(2)}
       = <b>${sec.toFixed(3)}</b><br>
       ${(Math.abs(t-1)<0.001&&Math.abs(h-2)<0.001)?'<b style="color:#BE123C">📌 구간단속 재현 — 1초→3초 평균 11 m/s. 그런데 그 사이의 순간들은?</b><br>':''}
       <b style="color:#BE123C">순간속도</b> s′(${t.toFixed(1)}) = 4×${t.toFixed(1)} + 3 = <b>${tan.toFixed(3)}</b><br><br>
       차이 <b>${Math.abs(sec-tan).toFixed(4)}</b><br>
       <span style="color:#6B7280;font-size:12.5px">${Math.abs(sec-tan)<0.05
         ? 'h 가 충분히 작아 할선과 접선이 거의 겹쳤습니다. 이것이 극한의 의미입니다.'
         : 'h 를 더 줄여 보세요. 두 선이 점점 겹칩니다.'}</span>`;
  }
  ['vlt','vlh'].forEach(i=>$('#'+i).oninput=draw); draw();
}

/* ============ 실험실별 수학 원리 ============
   LABS 와 같은 순서. 실험을 조작하는 것만으로 끝나지 않도록,
   ① 어떤 원리인가 ② 실험의 어느 조작이 그 원리를 드러내는가 ③ 수업의 어느 장면으로 잇는가
   세 칸을 반드시 채운다. ②가 비면 그 실험실은 탐구가 아니라 시청이다. */

/* ═══════════════════ 중학교 1학년 10종 (LAB 25~34) ═══════════════════
   2022 개정 중1 성취기준을 영역 비중대로 나눈 1차 10종.
   수와 연산 2 · 변화와 관계 3 · 도형과 측정 3 · 자료와 가능성 2.
   각 실험실은 카탈로그에서 승격한 것이므로 55-catalog.js 에서 같은 주제를 지웠다. */

/* ---------- LAB 25 소인수분해와 암호 [9수01-01] ----------
   암호의 핵심은 「곱하기는 한 번, 되돌리기는 여러 번」이라는 비대칭이다.
   슬라이더로는 이 비대칭이 몸에 남지 않는다. 그래서
   ① 소수 격자에서 p 와 q 를 직접 눌러 곱을 만들고 (앞으로 — 클릭 두 번이면 끝)
   ② N 만 남긴 상태에서 「한 번 나눠 보기」를 연타하며 d = 2, 3, 4, … 를 시도한다.
   실패는 회색 칸으로 쌓이고, √N 자리에 금이 그어져 있어 거기까지만 가면 된다는 것이 보인다. */
function primeDemo(root){
  const PR=[2,3,5,7,11,13,17,19,23,29,31,37,41,43,47,53,59,61,67,71,73,79,83,89,97];
  root.innerHTML=`<div class="row"><div class="col">
      <div class="note" style="margin-bottom:6px"><b>① 곱 만들기</b> — 소수 두 개를 눌러 고르세요</div>
      <div id="pfGrid" style="display:flex;flex-wrap:wrap;gap:4px"></div>
      <canvas id="pf1" width="380" height="170" style="margin-top:10px"></canvas>
    </div>
    <div class="col">
      <div class="note" style="margin-bottom:6px"><b>② 되돌리기</b> — N 만 보고 소인수를 찾아 보세요</div>
      <div class="ctl" style="display:flex;gap:6px;flex-wrap:wrap">
        <button class="b t" id="pfTry">한 번 나눠 보기</button>
        <button class="b g sm" id="pfAuto">지치면 컴퓨터에게 (자동)</button>
        <button class="b g sm" id="pfRst">다시</button>
      </div>
      <div class="out" id="pfout"></div>
      <div class="note" style="margin-top:12px">곱하기와 「소인수로 되돌리기」 — 컴퓨터에게 두 일의 난이도는 같을까요? 크기를 바꿔 가며 시간을 비교해 보세요.</div>
    </div></div>`;
  const cv=$('#pf1'),ctx=cv.getContext('2d'),W=380,H=170;
  const S={ p:7, q:31, d:1, found:null, tries:0, fails:[] };

  function factor(n){ let m=n,d=2,t=0;
    while(d*d<=m){ t++; if(m%d===0) return {p:d, tries:t}; d++; }
    return {p:m, tries:t}; }

  function grid(){
    $('#pfGrid').innerHTML = PR.map(v=>{
      const on = v===S.p||v===S.q;
      return `<button class="b ${on?'t':'g'} sm" data-v="${v}"
        style="min-width:40px;padding:5px 0${on?'':';opacity:.8'}">${v}</button>`;
    }).join('');
    $('#pfGrid').querySelectorAll('button').forEach(b=>b.onclick=()=>{
      const v=+b.dataset.v;
      if(v===S.p||v===S.q) return;
      // 최근에 고른 것부터 교체 — p ≤ q 를 유지한다
      S.p=S.q; S.q=v; if(S.p>S.q){const t=S.p;S.p=S.q;S.q=t;}
      reset(); grid();
    });
  }
  function reset(){ S.d=1; S.found=null; S.tries=0; S.fails=[]; draw(); }

  function tryOnce(){
    if(S.found!==null) return;
    const N=S.p*S.q;
    S.d++; S.tries++;
    if(N%S.d===0){ S.found=S.d; }
    else S.fails.push(S.d);
    draw();
  }
  function draw(){
    const N=S.p*S.q, sq=Math.sqrt(N);
    // 나눗수 띠 — 2 부터 √N 까지를 띠로, 시도한 곳을 칠한다
    ctx.clearRect(0,0,W,H); ctx.fillStyle='#fff'; ctx.fillRect(0,0,W,H);
    ctx.fillStyle='#111827'; ctx.font='bold 22px sans-serif'; ctx.textAlign='center';
    ctx.fillText(S.p+' × '+S.q+' = '+N, W/2, 30);
    ctx.font='11.5px sans-serif'; ctx.fillStyle='#6B7280';
    ctx.fillText('곱하기 — 클릭 두 번이면 끝', W/2, 48);
    const BX=26, BW=W-2*BX, BY=86, BH=22;
    const lim=Math.max(S.p+2, Math.ceil(sq)+2);          // 띠에 보일 범위
    const xd=d=>BX+BW*(d-2)/(lim-2);
    ctx.fillStyle='#F3F4F6'; ctx.fillRect(BX,BY,BW,BH);
    // 실패 칸
    S.fails.forEach(d=>{ ctx.fillStyle='#D1D5DB';
      ctx.fillRect(xd(d),BY,Math.max(3,BW/(lim-2)-1),BH); });
    // 찾은 칸
    if(S.found){ ctx.fillStyle='#0E9384';
      ctx.fillRect(xd(S.found),BY,Math.max(4,BW/(lim-2)-1),BH); }
    // √N 금
    ctx.strokeStyle='#BE123C'; ctx.setLineDash([4,3]); ctx.lineWidth=1.8;
    ctx.beginPath(); ctx.moveTo(xd(sq),BY-14); ctx.lineTo(xd(sq),BY+BH+6); ctx.stroke(); ctx.setLineDash([]);
    ctx.fillStyle='#BE123C'; ctx.font='bold 11px sans-serif'; ctx.textAlign='center';
    ctx.fillText('√N ≈ '+sq.toFixed(1), Math.min(W-40,Math.max(40,xd(sq))), BY-20);
    ctx.fillStyle='#6B7280'; ctx.font='11px sans-serif'; ctx.textAlign='left';
    ctx.fillText('d = 2', BX, BY+BH+16);
    ctx.textAlign='right'; ctx.fillText(String(lim), BX+BW, BY+BH+16);
    ctx.textAlign='center'; ctx.fillStyle='#374151'; ctx.font='12px sans-serif';
    ctx.fillText('여기까지만 나눠 보면 됩니다 — 이 금을 넘는 약수에는 반드시 작은 짝이 있습니다', W/2, H-10);

    const th=factor(N);
    $('#pfout').innerHTML = S.found
      ? `<b style="color:#0E9384">찾았습니다!</b> ${N} ÷ <b>${S.found}</b> = ${N/S.found}
         <br>나눠 본 횟수 <b>${S.tries}번</b> (곱하기는 1번이었습니다)
         <br><span style="color:#6B7280;font-size:12.5px">2부터 N−1 까지 무작정 가면 최대 ${(N-1).toLocaleString()}번 —
         √N 덕분에 ${Math.floor(sq)}번 안에 끝납니다</span>`
      : S.tries===0
      ? `이제 <b>${N}</b> 만 압니다. 소인수가 무엇인지 <b>「한 번 나눠 보기」</b>를 눌러 찾아 보세요.`
      : `d = ${S.d} 시도 → ${N} ÷ ${S.d} = ${(N/S.d).toFixed(2)} … <b style="color:#BE123C">나누어떨어지지 않음</b>
         <br>지금까지 <b>${S.tries}번</b> 실패. 계속 눌러 보세요.`;
  }
  $('#pfTry').onclick=tryOnce;
  $('#pfAuto').onclick=()=>{ if(S.found!==null) return;
    const t=setInterval(()=>{ tryOnce(); if(S.found!==null) clearInterval(t); }, 60); };
  $('#pfRst').onclick=reset;
  grid(); draw();

  inquiry(root,{ id:'pf', title:'소인수분해와 암호 — 곱하기는 쉬운데 왜 되돌리기는 어려울까',
    q:['p 와 q 를 작은 것부터 큰 것까지 바꿔 가며, 직접 나눠 찾은 결과를 8줄 이상 기록하세요.',
       '「나눠 본 횟수」 열과 「√N」 열을 견주어, 횟수가 무엇에 가까운지 찾으세요.',
       '왜 √N 까지만 나눠 보면 되는지 <b>약수가 짝을 이룬다</b>는 사실로 손으로 설명하세요. 그리고 이 성질이 왜 암호가 되는지도 적으세요.'],
    cols:['p','q','N = p × q','√N','나눠 본 횟수','2~N 을 다 보면'],
    hint:'힌트 — N 의 약수 d 에 대해 N ÷ d 도 약수입니다. 두 약수 중 작은 쪽은 반드시 어디 이하일까요?',
    read:()=>{ const N=S.p*S.q, t=S.found!==null?S.tries:factor(N).tries;
      return [S.p,S.q,N,Math.sqrt(N).toFixed(1),t,N-1]; } });
}

/* ---------- LAB 26 영하 5도에서 3도 오르면 [9수01-05] ----------
   수직선의 요점은 「덧셈·뺄셈 = 화살표」다. 그렇다면 화살표를 손으로 잡아야 한다.
   ① 파란 점(처음 온도 a)을 수직선 위에서 직접 끌고
   ② 주황 화살표의 끝을 끌어 변화량 b 의 크기와 방향을 정한다.
   더하기·빼기를 바꾸면 같은 b 로 화살표가 반대로 뒤집히는 것이 손끝에서 보인다. */
function intDemo(root){
  root.innerHTML=`<div class="row"><div class="col">
      <canvas id="iz1" width="380" height="300"></canvas>
      <div class="note" style="margin-top:8px"><b>파란 점(a)</b> 과 <b>주황 화살표 끝(b)</b> 을
      <b>직접 끌어</b> 옮기세요.</div>
    </div>
    <div class="col">
      <label class="ctl">무엇을 할까요
        <select id="izop" style="width:100%;padding:7px 9px;border:1px solid #E5E7EB;border-radius:8px;font:inherit">
          <option value="+">a + b — b 를 그대로 간다</option>
          <option value="-">a − b — b 를 거꾸로 간다</option>
        </select></label>
      <div class="out" id="izout"></div>
      <div class="note" style="margin-top:12px">빼기 화살표는 더하기 화살표와 어떤 관계일까요? 여러 짝으로 실험해 규칙을 잡아 보세요.</div>
    </div></div>`;
  const cv=$('#iz1'),ctx=cv.getContext('2d'),W=380,H=300,P=26;
  const S={ a:-5, b:3 };
  const X=v=>P+(W-2*P)*(v+12)/24;
  const invX=px=>Math.max(-12,Math.min(12,Math.round((px-P)*24/(W-2*P)-12)));
  const ROW={ line:150, a:150, arr:96, res:210 };

  function arrow(y,from,to,col,lab){
    if(from===to){ // 길이 0 — 점만
      ctx.fillStyle=col; ctx.beginPath(); ctx.arc(X(from),y,4,0,7); ctx.fill(); return; }
    ctx.strokeStyle=col; ctx.lineWidth=3; ctx.beginPath();
    ctx.moveTo(X(from),y); ctx.lineTo(X(to),y); ctx.stroke();
    const d=to>from?1:-1;
    ctx.fillStyle=col; ctx.beginPath();
    ctx.moveTo(X(to),y); ctx.lineTo(X(to)-d*10,y-6); ctx.lineTo(X(to)-d*10,y+6); ctx.fill();
    ctx.font='bold 12px sans-serif'; ctx.textAlign='center';
    ctx.fillText(lab,(X(from)+X(to))/2,y-11);
  }
  function draw(){
    const op=$('#izop').value, eff=op==='+'?S.b:-S.b, r=S.a+eff;
    ctx.clearRect(0,0,W,H); ctx.fillStyle='#fff'; ctx.fillRect(0,0,W,H);
    // 수직선
    ctx.strokeStyle='#9CA3AF'; ctx.lineWidth=1.6;
    ctx.beginPath(); ctx.moveTo(P,ROW.line); ctx.lineTo(W-P,ROW.line); ctx.stroke();
    ctx.font='10.5px sans-serif'; ctx.textAlign='center';
    for(let v=-12;v<=12;v+=2){
      ctx.strokeStyle=v===0?'#374151':'#D1D5DB'; ctx.lineWidth=v===0?1.8:1;
      ctx.beginPath(); ctx.moveTo(X(v),ROW.line-6); ctx.lineTo(X(v),ROW.line+6); ctx.stroke();
      ctx.fillStyle=v===0?'#111827':'#9CA3AF'; ctx.fillText(String(v),X(v),ROW.line+20);
    }
    // 위: b 화살표 (a 에서 출발해 실제로 더해지는 eff 만큼)
    ctx.fillStyle='#6B7280'; ctx.font='11px sans-serif'; ctx.textAlign='left';
    ctx.fillText('변화 — 화살표 끝을 끌어 보세요', P, ROW.arr-26);
    arrow(ROW.arr, S.a, S.a+eff, '#B45309',
      (op==='+'?'+':'−')+' '+S.b+' → 실제로는 '+(eff>=0?'+':'')+eff);
    // 점선으로 a, 결과를 수직선에 늘어뜨림
    ctx.setLineDash([3,3]); ctx.strokeStyle='#C7CDD6'; ctx.lineWidth=1;
    [[S.a,ROW.arr],[S.a+eff,ROW.arr]].forEach(q=>{
      ctx.beginPath(); ctx.moveTo(X(q[0]),q[1]); ctx.lineTo(X(q[0]),ROW.line); ctx.stroke(); });
    ctx.setLineDash([]);
    // 아래: 결과 화살표 (0 에서 결과까지)
    ctx.fillStyle='#6B7280'; ctx.font='11px sans-serif'; ctx.textAlign='left';
    ctx.fillText('결과', P, ROW.res-24);
    arrow(ROW.res, 0, r, r>=0?'#0E9384':'#BE123C', '= '+r);
    // a 손잡이 (수직선 위)
    handle(ctx, X(S.a), ROW.line, '#2563EB', 'a = '+S.a);
    // b 끝 손잡이 (화살표 줄)
    handle(ctx, X(S.a+eff), ROW.arr, '#B45309', '');

    $('#izout').innerHTML =
      `<span class="mono" style="font-size:17px">${S.a} ${op==='+'?'+':'−'} ${S.b<0?'(':''}${S.b}${S.b<0?')':''} = <b>${r}</b></span><br><br>`
      + `실제로 더해진 값: <b>${eff>=0?'+':''}${eff}</b> — 화살표는 <b>${eff===0?'제자리':(eff>0?'오른쪽':'왼쪽')}</b><br>`
      + (op==='-' ? `빼기 ${S.b} 는 <b>더하기 ${-S.b}</b> 와 같은 화살표입니다.` :
         `더하기는 b 의 부호 방향 그대로 갑니다.`);
  }
  dragOn(cv,{
    hit:p=>{
      const op=$('#izop').value, eff=op==='+'?S.b:-S.b;
      if(Math.hypot(p.x-X(S.a+eff), p.y-ROW.arr)<16) return 'b';
      if(Math.hypot(p.x-X(S.a), p.y-ROW.line)<16) return 'a';
      if(Math.abs(p.y-ROW.arr)<18) return 'b';
      if(Math.abs(p.y-ROW.line)<18) return 'a';
      return null;
    },
    move:(h,p)=>{
      const v=invX(p.x);
      if(h==='a') S.a=v;
      else { const op=$('#izop').value, eff=v-S.a; S.b = op==='+'?eff:-eff; }
      draw();
    }
  });
  $('#izop').onchange=draw; draw();

  inquiry(root,{ id:'iz', title:'수직선 위의 정수 — 빼기는 왜 반대 방향으로 갈까',
    q:['a 와 b 의 부호를 네 가지로 조합하고, 각각 더하기와 빼기를 모두 기록하세요 (8줄 이상).',
       '「실제로 더해진 값」 열을 보세요. 뺄셈일 때 이 값이 b 와 어떤 관계인지 찾으세요.',
       'a − b = a + (−b) 임을 <b>화살표 그림</b>으로 손으로 설명하고, a − (−b) 가 왜 오른쪽으로 가는지도 적으세요.'],
    cols:['a','연산','b','실제로 더해진 값','결과','화살표 방향'],
    hint:'힌트 — 화살표의 길이는 언제나 |b| 입니다. 바뀌는 것은 방향뿐입니다. 무엇이 방향을 정하나요?',
    read:()=>{ const op=$('#izop').value, eff=op==='+'?S.b:-S.b, r=S.a+eff;
      return [S.a, op==='+'?'+':'−', S.b, (eff>=0?'+':'')+eff, r, eff===0?'제자리':(eff>0?'오른쪽':'왼쪽')]; } });
}

/* ---------- LAB 27 규칙을 한 줄로 — 문자와 식 [9수02-01] ----------
   식 3n+1 을 「보는」 것과 성냥개비를 「직접 이어 붙이는」 것은 다르다.
   ① 「한 칸 잇기」로 정사각형을 직접 늘린다 — 새로 든 성냥개비 3개가 주황으로 반짝인다.
   ② 세 식(3n+1 · 4+3(n−1) · 4n−(n−1)) 을 토글하면 그 식이 성냥개비를
      어떻게 묶었는지가 색으로 칠해진다 — 같은 그림, 다른 묶기. 이것이 식의 뜻이다. */
function letterDemo(root){
  root.innerHTML=`<div class="row"><div class="col">
      <canvas id="lt1" width="380" height="300"></canvas>
      <div class="ctl" style="display:flex;gap:6px;flex-wrap:wrap;margin-top:8px">
        <button class="b t sm" id="ltAdd">＋ 한 칸 잇기</button>
        <button class="b g sm" id="ltDel">− 한 칸</button>
        <button class="b g sm" id="ltRst">1칸으로</button>
      </div>
    </div>
    <div class="col">
      <label class="ctl">이 그림을 어떻게 셀까 — 식을 골라 <b>묶음을 색으로</b> 보세요
        <select id="ltf" style="width:100%;padding:7px 9px;border:1px solid #E5E7EB;border-radius:8px;font:inherit">
          <option value="none">그냥 보기</option>
          <option value="a">3n + 1 — 왼쪽 막대 1개 + 칸마다 ⊐ 모양 3개</option>
          <option value="b">4 + 3(n−1) — 첫 칸 4개 + 나머지 칸마다 3개</option>
          <option value="c">4n − (n−1) — 네 개씩 n 칸, 겹친 (n−1)개 빼기</option>
        </select></label>
      <div class="out" id="ltout"></div>
      <div class="note" style="margin-top:12px">2a 에 a = 7 을 넣으면 얼마일까요 — 27? 14? 기계가 어느 약속을 따르는지 시험해 보세요.</div>
    </div></div>`;
  const cv=$('#lt1'),ctx=cv.getContext('2d'),W=380,H=300;
  const S={ n:1, flash:[] };

  /* 성냥개비 하나 = {x1,y1,x2,y2, 칸 번호 i, 종류 t: 'L'왼세로 'R'오른세로 'T'위 'B'아래} */
  function sticks(){
    const n=S.n, size=Math.min(46, 320/n), OX=(W-size*n)/2, OY=96, out=[];
    for(let i=0;i<n;i++){
      const x=OX+i*size;
      if(i===0) out.push({x1:x,y1:OY,x2:x,y2:OY+size,i,t:'L'});
      out.push({x1:x,y1:OY,x2:x+size,y2:OY,i,t:'T'});
      out.push({x1:x,y1:OY+size,x2:x+size,y2:OY+size,i,t:'B'});
      out.push({x1:x+size,y1:OY,x2:x+size,y2:OY+size,i,t:'R'});
    }
    return {out, size, OX, OY};
  }
  function draw(){
    const sel=$('#ltf'); if(!sel || !cv.isConnected) return;     // 다음 실험실이 열려 이 화면이 지워졌으면 그리지 않는다
    const n=S.n, mode=sel.value, {out,size,OX,OY}=sticks();
    ctx.clearRect(0,0,W,H); ctx.fillStyle='#fff'; ctx.fillRect(0,0,W,H);
    ctx.fillStyle='#111827'; ctx.font='bold 15px sans-serif'; ctx.textAlign='center';
    ctx.fillText('정사각형 '+n+'칸 — 성냥개비 '+(3*n+1)+'개', W/2, 40);
    ctx.lineCap='round';
    out.forEach(s=>{
      let col='#111827', wd=3.4;
      if(S.flash.includes(s)) col='#B45309';
      else if(mode==='a') col = s.t==='L' ? '#BE123C' : '#2563EB';           // 1 + 3n
      else if(mode==='b') col = s.i===0 ? '#BE123C' : '#2563EB';             // 4 + 3(n−1)
      else if(mode==='c') col = '#2563EB';                                   // 4n 에서
      ctx.strokeStyle=col; ctx.lineWidth=wd;
      ctx.beginPath(); ctx.moveTo(s.x1,s.y1); ctx.lineTo(s.x2,s.y2); ctx.stroke();
    });
    // 4n−(n−1) — 빠진 (겹쳤을) 세로 막대 자리를 점선으로
    if(mode==='c'){
      ctx.strokeStyle='#BE123C'; ctx.setLineDash([4,4]); ctx.lineWidth=2.4;
      for(let i=1;i<n;i++){ const x=OX+i*size;
        ctx.beginPath(); ctx.moveTo(x+4,OY+6); ctx.lineTo(x+4,OY+size-6); ctx.stroke(); }
      ctx.setLineDash([]);
    }
    // 범례
    ctx.font='12px sans-serif'; ctx.textAlign='center'; ctx.fillStyle='#6B7280';
    const legend = mode==='a' ? '빨강 = 처음 세로 1개 · 파랑 = 칸마다 ⊐ 3개 → 3n + 1'
      : mode==='b' ? '빨강 = 첫 칸 4개 · 파랑 = 나머지 칸마다 3개 → 4 + 3(n−1)'
      : mode==='c' ? '파랑 = 칸마다 4개로 세면 겹치는 자리(빨간 점선)가 (n−1)개 → 4n − (n−1)'
      : '「한 칸 잇기」를 눌러 늘려 보세요 — 매번 몇 개씩 더 드나요?';
    ctx.fillText(legend, W/2, OY+size+42);
    // 표 — n 과 세 식이 나란히
    const vals=[3*n+1, 4+3*(n-1), 4*n-(n-1)];
    $('#ltout').innerHTML =
      `<b>n = ${n}</b> 일 때<br>
       <span class="mono">3n+1 = ${vals[0]} &nbsp;·&nbsp; 4+3(n−1) = ${vals[1]} &nbsp;·&nbsp; 4n−(n−1) = ${vals[2]}</span><br>
       <b style="color:#0E9384">세 식의 값이 언제나 같습니다</b> — 같은 그림을 다르게 묶었을 뿐이니까요.<br><br>
       한 칸 이을 때마다 드는 성냥개비: <b style="color:#B45309">3개</b> — 그 3이 세 식 모두에 들어 있습니다.`;
  }
  $('#ltAdd').onclick=()=>{ if(S.n>=8) return;
    S.n++; const {out}=sticks();
    S.flash = out.filter(s=>s.i===S.n-1 && s.t!=='L');   // 새 칸의 ⊐ 3개
    draw(); setTimeout(()=>{ S.flash=[]; draw(); }, 650); };
  $('#ltDel').onclick=()=>{ S.n=Math.max(1,S.n-1); S.flash=[]; draw(); };
  $('#ltRst').onclick=()=>{ S.n=1; S.flash=[]; draw(); };
  $('#ltf').onchange=draw;
  draw();

  inquiry(root,{ id:'lt', title:'규칙을 한 줄로 — 문자와 식',
    q:['「한 칸 잇기」를 눌러 n 을 1부터 8까지 늘리며 모두 기록하세요.',
       '세 식의 값 열을 비교해 무엇이 같은지 확인하고, 성냥개비가 <b>한 칸 늘 때마다 몇 개씩</b> 드는지 찾으세요.',
       '세 식이 왜 모두 같은지 <b>어느 성냥개비를 어떻게 묶었는지</b> 그림으로 손으로 설명하세요. 그리고 2a 를 “2와 a”로 읽으면 왜 안 되는지도 적으세요.'],
    cols:['n','성냥개비 수','3n + 1','4 + 3(n−1)','4n − (n−1)','앞 칸보다 늘어난 수'],
    hint:'힌트 — 첫 칸은 성냥개비 4개, 그다음부터는 몇 개씩 늘어나나요? 그 “몇 개씩”이 식의 어디에 나타나 있나요?',
    read:()=>{ const n=S.n;
      return [n, 3*n+1, 3*n+1, 4+3*(n-1), 4*n-(n-1), n===1?'—':3]; } });
}

/* ---------- LAB 28 저울이 균형을 이루려면 [9수02-03][9수02-04] ---------- */
function scaleDemo(root){
  root.innerHTML=`<div class="row"><div class="col"><canvas id="sc1" width="380" height="300"></canvas></div>
    <div class="col">
      <div class="out" id="scEq" style="font-size:17px;text-align:center"></div>
      <label class="ctl">양변에 같은 일을 합니다</label>
      <div style="display:flex;flex-wrap:wrap;gap:6px;margin-top:6px">
        <button class="b sm" id="scS1">양변에서 1 빼기</button>
        <button class="b sm" id="scA1">양변에 1 더하기</button>
        <button class="b sm" id="scD2">양변을 2로 나누기</button>
        <button class="b sm" id="scL1">왼쪽에서만 1 빼기</button>
        <button class="b g sm" id="scR">처음으로</button>
      </div>
      <div class="out" id="scout"></div>
      <div class="note" style="margin-top:12px">균형을 지키려면 <b>양변에 똑같이</b> 해야 합니다.
      한쪽만 건드리는 순간 저울이 기울고, 답도 달라집니다.</div>
    </div></div>`;
  const cv=$('#sc1'),ctx=cv.getContext('2d'),W=380,H=300;
  const S0={la:2,lb:3,ra:0,rb:11};                    // 2x + 3 = 11
  let S={...S0}, log=[], broken=false;
  const num=v=>Number.isInteger(v)?String(v):v.toFixed(1);
  function fmt(a,b){
    const t=[];
    if(a) t.push((a===1?'':num(a))+'x');
    if(b||!a) t.push(num(b));
    return t.join(' + ').replace('+ -','− ');
  }
  function draw(){
    ctx.clearRect(0,0,W,H);
    const cx=W/2, cy=112, arm=112, tilt=broken?0.15:0;
    ctx.strokeStyle='#6B7280'; ctx.lineWidth=3;
    ctx.beginPath();ctx.moveTo(cx,cy);ctx.lineTo(cx,cy+100);ctx.stroke();
    ctx.beginPath();ctx.moveTo(cx-70,cy+100);ctx.lineTo(cx+70,cy+100);ctx.stroke();
    ctx.save(); ctx.translate(cx,cy); ctx.rotate(tilt);
    ctx.strokeStyle='#111827'; ctx.lineWidth=4;
    ctx.beginPath();ctx.moveTo(-arm,0);ctx.lineTo(arm,0);ctx.stroke();
    [[-arm,'#2563EB',fmt(S.la,S.lb)],[arm,'#0E9384',fmt(S.ra,S.rb)]].forEach(([px,col,txt])=>{
      ctx.strokeStyle='#9CA3AF'; ctx.lineWidth=1.4;
      ctx.beginPath();ctx.moveTo(px,0);ctx.lineTo(px,32);ctx.stroke();
      ctx.fillStyle=col; ctx.globalAlpha=.12; ctx.fillRect(px-48,32,96,34); ctx.globalAlpha=1;
      ctx.strokeStyle=col; ctx.lineWidth=1.8; ctx.strokeRect(px-48,32,96,34);
      ctx.fillStyle=col; ctx.font='bold 16px ui-monospace,monospace'; ctx.textAlign='center';
      ctx.fillText(txt,px,54);
    });
    ctx.restore();
    ctx.textAlign='center';
    ctx.fillStyle = broken ? '#BE123C' : '#0E9384'; ctx.font='bold 13px sans-serif';
    ctx.fillText(broken?'균형이 깨졌습니다':'균형입니다', cx, cy+128);
    $('#scEq').innerHTML=`<span class="mono">${fmt(S.la,S.lb)} = ${fmt(S.ra,S.rb)}</span>`;
    const done = S.la===1 && S.lb===0 && S.ra===0;
    $('#scout').innerHTML =
      (broken ? '<b class="no">한쪽만 건드렸습니다.</b> 저울이 기울었고, 이 식은 더 이상 처음 식과 같은 뜻이 아닙니다. 「처음으로」를 눌러 다시 하세요.<br><br>'
              : done ? `<b class="ok">x = ${num(S.rb)} 를 찾았습니다.</b> 처음 식 2x + 3 = 11 에 넣어 검산해 보세요.<br><br>` : '')
      + (log.length ? '<b>지금까지 한 일</b><br>' + log.map(s=>'· '+s).join('<br>')
                    : '양변에 같은 일을 하며 x 만 남겨 보세요.');
  }
  function act(f,name,bad){
    if(broken && !bad) return;
    f(); log.push(name); if(bad) broken=true; draw();
  }
  $('#scS1').onclick=()=>act(()=>{S.lb-=1;S.rb-=1;},'양변에서 1 빼기');
  $('#scA1').onclick=()=>act(()=>{S.lb+=1;S.rb+=1;},'양변에 1 더하기');
  $('#scD2').onclick=()=>act(()=>{S.la/=2;S.lb/=2;S.ra/=2;S.rb/=2;},'양변을 2로 나누기');
  $('#scL1').onclick=()=>act(()=>{S.lb-=1;},'왼쪽에서만 1 빼기 ← 균형이 깨집니다',true);
  $('#scR').onclick=()=>{S={...S0};log=[];broken=false;draw();};
  draw();
  inquiry(root,{ id:'sc', title:'저울이 균형을 이루려면 — 등식의 성질',
    q:['버튼을 누를 때마다 기록하세요. 2x + 3 = 11 을 x 만 남을 때까지 푼 과정을 전부 담으세요.',
       '「균형」 열을 보세요. 양변에 같은 일을 했을 때와 한쪽만 건드렸을 때 무엇이 달라지는지 찾으세요.',
       '등식의 성질 두 가지를 식으로 쓰고, <b>이항이 왜 부호를 바꾸는지</b>를 저울 그림으로 손으로 설명하세요.'],
    cols:['왼쪽','오른쪽','방금 한 일','균형'],
    hint:'힌트 — “3을 오른쪽으로 넘겼다”가 아니라 “양변에서 3을 뺐다”로 말해 보세요. 부호가 왜 바뀌는지가 저절로 설명됩니다.',
    read:()=>[fmt(S.la,S.lb), fmt(S.ra,S.rb), log.length?log[log.length-1]:'처음 상태',
              broken?'깨짐':'유지'] });
}

/* ---------- LAB 29 지렛대는 왜 힘이 덜 들까 [9수02-07] ----------
   반비례 곡선을 「보여 주는」 것이 아니라 학생이 「만들게」 한다.
   ① 지렛대 위에서 내 손 위치 x 를 직접 끌면 그 순간 필요한 힘 y 가 저울 눈금으로 나온다.
   ② 「지금 점 찍기」로 (x, y) 를 그래프에 쌓는다 — 점이 모이면 굽은 선이 스스로 드러난다.
   정비례 모드(늘어나는 용수철)와 나란히 두어 「곱이 일정 vs 비가 일정」을 몸으로 가른다. */
function propDemo(root){
  root.innerHTML=`<div class="row"><div class="col">
      <canvas id="pp1" width="380" height="150"></canvas>
      <canvas id="pp2" width="380" height="180" style="margin-top:6px"></canvas>
      <div class="note" style="margin-top:8px">위 그림에서 <b>손(주황 점)을 직접 끌어</b> 옮기고,
      <b>「지금 점 찍기」</b>로 그래프에 기록하세요.</div>
    </div>
    <div class="col">
      <label class="ctl">어떤 관계인가
        <select id="ppk" style="width:100%;padding:7px 9px;border:1px solid #E5E7EB;border-radius:8px;font:inherit">
          <option value="inv">지렛대 — 받침점에서 멀수록 힘이 덜 든다 (y = k ÷ x)</option>
          <option value="dir">용수철 — 힘을 줄수록 그만큼 늘어난다 (y = a × x)</option>
        </select></label>
      <div class="ctl" style="display:flex;gap:6px;flex-wrap:wrap;margin-top:8px">
        <button class="b t sm" id="ppRec">지금 점 찍기</button>
        <button class="b g sm" id="ppClr">점 지우기</button>
      </div>
      <div class="out" id="ppout"></div>
      <div class="note" style="margin-top:12px">점을 여러 개 찍은 뒤 y÷x 와 x×y 두 값을 추적해 보세요 — 어느 쪽이 변하지 않나요?</div>
    </div></div>`;
  const c1=$('#pp1'),x1=c1.getContext('2d'),W=380,H1=150;
  const c2=$('#pp2'),x2=c2.getContext('2d'),H2=180,P=40;
  const S={ x:4, k:24, pts:[] };
  const XMAX=10, YMAX=26;
  const yOf=x=> $('#ppk').value==='inv' ? S.k/x : (S.k/10)*x;

  // 지렛대 그림 좌표
  const LX=x=>30+(W-60)*x/XMAX;

  function drawLever(){
    const mode=$('#ppk').value, x=S.x, y=yOf(x);
    x1.clearRect(0,0,W,H1); x1.fillStyle='#fff'; x1.fillRect(0,0,W,H1);
    if(mode==='inv'){
      // 받침점 · 막대 · 바위 · 손
      const FY=104;
      // 막대는 힘이 클수록 조금 기운다 (연출)
      const tilt=Math.min(0.10, y/300);
      x1.save(); x1.translate(LX(0),FY); x1.rotate(-tilt);
      x1.strokeStyle='#6B4A2B'; x1.lineWidth=7; x1.lineCap='round';
      x1.beginPath(); x1.moveTo(-24,0); x1.lineTo(LX(XMAX)-LX(0)+8,0); x1.stroke();
      x1.restore();
      // 받침점(삼각형) — x=0 자리
      x1.fillStyle='#374151'; x1.beginPath();
      x1.moveTo(LX(0),FY+4); x1.lineTo(LX(0)-14,FY+30); x1.lineTo(LX(0)+14,FY+30); x1.closePath(); x1.fill();
      // 바위 — 받침점 왼쪽에
      x1.fillStyle='#9CA3AF'; x1.beginPath(); x1.arc(LX(0)-24, FY-16, 15, 0, 7); x1.fill();
      x1.fillStyle='#4B5563'; x1.font='bold 10px sans-serif'; x1.textAlign='center';
      x1.fillText('바위', LX(0)-24, FY-13);
      // 손 위치 (끌기 손잡이)
      handle(x1, LX(x), FY-2-LX(x)*0+ -((LX(x)-LX(0))*Math.min(0.10,y/300)), '#B45309', '내 손 x = '+x.toFixed(1)+'m');
      // 힘 저울
      x1.fillStyle='#BE123C'; x1.font='bold 13px sans-serif'; x1.textAlign='left';
      x1.fillText('필요한 힘 y = '+y.toFixed(1), 22, 30);
      x1.fillStyle='#F3D6DD'; x1.fillRect(20, 38, Math.min(W-40, (W-40)*y/YMAX), 10);
      x1.strokeStyle='#BE123C'; x1.strokeRect(20, 38, W-40, 10);
    } else {
      // 용수철 — 힘 x 를 끌면 길이 y 가 비례해 늘어난다
      const SY=70, x0=40;
      const len=40+ (W-140)*S.x/XMAX;
      x1.strokeStyle='#374151'; x1.lineWidth=2.4;
      x1.beginPath(); x1.moveTo(x0,SY-24); x1.lineTo(x0,SY+24); x1.stroke();  // 벽
      // 용수철 지그재그
      x1.beginPath(); x1.moveTo(x0,SY);
      const nseg=12;
      for(let i=1;i<=nseg;i++){ const px=x0+len*i/nseg, py=SY+((i%2)?-10:10)*(i<nseg?1:0);
        x1.lineTo(px, i===nseg?SY:py); }
      x1.strokeStyle='#2563EB'; x1.stroke();
      handle(x1, x0+len, SY, '#B45309', '당기는 힘 x = '+S.x.toFixed(1));
      x1.fillStyle='#0E9384'; x1.font='bold 13px sans-serif'; x1.textAlign='left';
      x1.fillText('늘어난 길이 y = '+yOf(S.x).toFixed(1), 22, 30);
    }
  }
  function drawGraph(){
    const mode=$('#ppk').value;
    x2.clearRect(0,0,W,H2); x2.fillStyle='#fff'; x2.fillRect(0,0,W,H2);
    const GX=v=>P+(W-P-14)*v/XMAX, GY=v=>H2-30-(H2-46)*v/YMAX;
    x2.strokeStyle='#F1F3F6'; x2.lineWidth=1;
    for(let i=0;i<=5;i++){ const y=16+(H2-46)*i/5;
      x2.beginPath(); x2.moveTo(P,y); x2.lineTo(W-14,y); x2.stroke(); }
    x2.strokeStyle='#9CA3AF'; x2.lineWidth=1.2;
    x2.beginPath(); x2.moveTo(P,16); x2.lineTo(P,H2-30); x2.lineTo(W-14,H2-30); x2.stroke();
    x2.fillStyle='#6B7280'; x2.font='10.5px sans-serif'; x2.textAlign='left';
    x2.fillText(mode==='inv'?'힘 y':'길이 y', 6, 14);
    x2.fillText('x', W-12, H2-16);
    // 이론 곡선은 점이 3개 이상 모인 뒤에야 옅게 — 먼저 곡선을 주면 발견이 없다
    if(S.pts.length>=3){
      x2.strokeStyle=mode==='inv'?'#BE123C':'#0E9384'; x2.lineWidth=1.6; x2.globalAlpha=.45;
      x2.beginPath(); let on=false;
      for(let i=0;i<=140;i++){ const vx=0.4+ (XMAX-0.4)*i/140, vy=mode==='inv'?S.k/vx:(S.k/10)*vx;
        if(vy>YMAX){ on=false; continue; }
        const px=GX(vx), py=GY(vy); on?x2.lineTo(px,py):x2.moveTo(px,py); on=true; }
      x2.stroke(); x2.globalAlpha=1;
    }
    // 학생이 찍은 점
    S.pts.forEach(p=>{ x2.fillStyle='#2563EB';
      x2.beginPath(); x2.arc(GX(p[0]),GY(Math.min(YMAX,p[1])),4.5,0,7); x2.fill(); });
    // 지금 위치 표시
    const y=yOf(S.x);
    if(y<=YMAX){ x2.strokeStyle='#B45309'; x2.setLineDash([3,3]);
      x2.beginPath(); x2.moveTo(GX(S.x),H2-30); x2.lineTo(GX(S.x),GY(y)); x2.lineTo(P,GY(y)); x2.stroke();
      x2.setLineDash([]);
      x2.fillStyle='#B45309'; x2.beginPath(); x2.arc(GX(S.x),GY(y),5,0,7); x2.fill(); }
  }
  function out(){
    const mode=$('#ppk').value, y=yOf(S.x);
    $('#ppout').innerHTML =
      `x = <b>${S.x.toFixed(1)}</b> · y = <b>${y.toFixed(1)}</b><br>`
      + `x × y = <b>${(S.x*y).toFixed(1)}</b> &nbsp;·&nbsp; y ÷ x = <b>${(y/S.x).toFixed(2)}</b><br>`
      + `<span style="color:#6B7280;font-size:12.5px">찍은 점 ${S.pts.length}개`
      + (S.pts.length>=3 ? ' — 곡선이 드러났습니다. 어느 값이 일정한가요?' : ' — 세 개 이상 찍으면 곡선이 나타납니다') + '</span>';
  }
  function draw(){ drawLever(); drawGraph(); out(); }
  dragOn(c1,{
    hit:p=>'x',
    move:(h,p)=>{ S.x=Math.max(0.5,Math.min(XMAX,Math.round(((p.x-30)*XMAX/(W-60))*10)/10)); draw(); }
  });
  $('#ppk').onchange=()=>{ S.pts=[]; draw(); };
  $('#ppRec').onclick=()=>{ const y=yOf(S.x);
    if(!S.pts.some(q=>Math.abs(q[0]-S.x)<0.05)) S.pts.push([S.x,y]); draw(); };
  $('#ppClr').onclick=()=>{ S.pts=[]; draw(); };
  draw();

  inquiry(root,{ id:'pp', title:'지렛대는 왜 힘이 덜 들까 — 정비례와 반비례',
    q:['반비례와 정비례를 모두 고르고, 각각 손을 끌어 x 를 바꿔 가며 8줄 이상 기록하세요.',
       '「x × y」 열과 「y ÷ x」 열을 보세요. 각 관계에서 <b>어느 쪽이 일정한지</b> 찾으세요.',
       '두 관계를 “무엇이 일정한가”로 구분해 손으로 정리하고, 그것이 <b>그래프 모양</b>과 어떻게 이어지는지 설명하세요.'],
    cols:['관계','x','y','x × y','y ÷ x','그래프 모양'],
    hint:'힌트 — 그래프 모양을 먼저 보고 판정하지 마세요. 표의 두 열 중 변하지 않는 쪽이 무엇인지가 먼저입니다.',
    read:()=>{ const mode=$('#ppk').value, y=yOf(S.x);
      return [mode==='inv'?'반비례':'정비례', S.x.toFixed(1), y.toFixed(1),
              (S.x*y).toFixed(1), (y/S.x).toFixed(2),
              mode==='inv'?'굽은 선':'원점을 지나는 직선']; } });
}

/* ---------- LAB 30 그림의 원근법 — 평행선과 각 [9수03-02] ----------
   요점은 「평행이라는 조건이 있어야 같다」이다. 그렇다면 평행을 깨뜨릴 수 있어야 한다.
   ① 횡단선의 끝을 끌어 기울기 θ 를 바꾸고
   ② 아랫줄의 오른쪽 끝을 끌어 평행을 직접 깨뜨린다 — 동위각이 그 자리에서 달라진다.
   평행 근처(±1°)로 가져가면 딸깍 붙어, 「평행 = 같음」이 손끝의 사건이 된다. */
function paraDemo(root){
  root.innerHTML=`<div class="row"><div class="col">
      <canvas id="pa1" width="380" height="300"></canvas>
      <div class="note" style="margin-top:8px"><b>횡단선 끝(주황)</b>과 <b>아랫줄 끝(파랑)</b>을
      <b>직접 끌어</b> 보세요. 아랫줄을 기울여 평행을 깨뜨릴 수 있습니다.</div>
    </div>
    <div class="col">
      <label class="ctl">무엇을 표시할까요
        <select id="paM" style="width:100%;padding:7px 9px;border:1px solid #E5E7EB;border-radius:8px;font:inherit">
          <option value="co">동위각 — 같은 자리에 있는 각</option>
          <option value="al">엇각 — 엇갈린 자리에 있는 각</option>
          <option value="in">동측내각 — 같은 쪽 안쪽 각</option>
        </select></label>
      <div class="ctl" style="display:flex;gap:6px;margin-top:8px">
        <button class="b g sm" id="paPar">아랫줄을 평행으로 되돌리기</button>
      </div>
      <div class="out" id="paout"></div>
      <div class="note" style="margin-top:12px">같은 이름의 각(동위각·엇각)은 언제 같고 언제 어긋날까요? 평행을 만들었다 깨며 조건을 찾아보세요.</div>
    </div></div>`;
  const cv=$('#pa1'),ctx=cv.getContext('2d'),W=380,H=300;
  const Y1=92, Y2=208, CX=W/2, MID=(Y1+Y2)/2, HF=(Y2-Y1)/2;
  const S={ th:54, tilt:0 };        // th 횡단선 각(도), tilt 아랫줄 기울기(도, 0 = 평행)

  const rad=d=>d*Math.PI/180;
  // 횡단선은 두 줄의 한가운데 점을 축으로 돈다 — 어떤 θ 에서도 두 교점이 화면 안에 남는다
  const cross=()=>{ const off=HF/Math.tan(rad(S.th));
    return { I1:{x:CX-off, y:Y1}, I2:{x:CX+off, y:Y2} }; };
  const hTh=()=>{ const {I1}=cross(); const t=rad(S.th);
    return {x:I1.x+Math.cos(-t)*46, y:I1.y+Math.sin(-t)*46}; };          // θ 손잡이 — 윗줄 위쪽
  const hLn=()=>{ const {I2}=cross(); const g=rad(S.tilt);
    return {x:I2.x+Math.cos(g)*66, y:I2.y+Math.sin(g)*66}; };            // 아랫줄 손잡이
  function draw(){
    const kind=$('#paM').value;
    ctx.clearRect(0,0,W,H); ctx.fillStyle='#fff'; ctx.fillRect(0,0,W,H);
    // 윗줄 (고정 수평)
    ctx.strokeStyle='#374151'; ctx.lineWidth=2.2;
    ctx.beginPath(); ctx.moveTo(14,Y1); ctx.lineTo(W-14,Y1); ctx.stroke();
    // 아랫줄 (기울일 수 있음) — 교점 I2 를 중심으로 회전
    const t=rad(S.th);
    const {I1,I2}=cross();
    const g=rad(S.tilt);
    const ex=Math.cos(g), ey=Math.sin(g);
    ctx.strokeStyle='#374151'; ctx.lineWidth=2.2;
    ctx.beginPath();
    ctx.moveTo(I2.x-ex*260, I2.y-ey*260); ctx.lineTo(I2.x+ex*260, I2.y+ey*260); ctx.stroke();
    // 횡단선
    ctx.strokeStyle='#B45309'; ctx.lineWidth=2.4;
    const dx=Math.cos(-t), dy=Math.sin(-t);
    ctx.beginPath();
    ctx.moveTo(I2.x-dx*210, I2.y-dy*210); ctx.lineTo(I2.x+dx*210, I2.y+dy*210); ctx.stroke();

    // 각 표시 — 첫째 각(윗교점), 둘째 각(아랫교점)
    const a1=S.th;                                     // 윗교점의 아래-오른쪽 각
    const a2raw = S.th - S.tilt;                       // 아랫교점에서 아랫줄과 횡단선 사이 각
    const a2 = kind==='in' ? 180 - a2raw : a2raw;
    const mark=(P0,from,to,col)=>{
      ctx.strokeStyle=col; ctx.lineWidth=2.2;
      ctx.beginPath(); ctx.arc(P0.x,P0.y,20,from,to); ctx.stroke();
    };
    // 동위각: 두 교점 모두 「오른쪽 아래」 / 엇각: 위는 오른쪽 아래·아래는 왼쪽 위 / 동측내각: 안쪽 같은 쪽
    if(kind==='co'){ mark(I1,0,-rad(a1),'#2563EB'); mark(I2,g,-rad(a2raw)+g,'#0E9384'); }
    else if(kind==='al'){ mark(I1,0,-rad(a1),'#2563EB'); mark(I2,Math.PI+g,Math.PI-rad(a2raw)+g,'#0E9384'); }
    else { mark(I1,Math.PI, Math.PI+rad(a1),'#2563EB'); mark(I2,g,-rad(a2raw)+g,'#0E9384'); }
    ctx.fillStyle='#2563EB'; ctx.font='bold 12px sans-serif'; ctx.textAlign='left';
    ctx.fillText(a1.toFixed(0)+'°', I1.x+26, I1.y+(kind==='in'?18:-8));
    ctx.fillStyle='#0E9384';
    ctx.fillText(a2.toFixed(0)+'°', I2.x+26, I2.y-8);
    // 손잡이 — 횡단선(윗줄 위쪽) · 아랫줄
    const hT=hTh(), hL=hLn();
    handle(ctx,hT.x,hT.y,'#B45309','θ = '+S.th.toFixed(0)+'°');
    handle(ctx,hL.x,hL.y,'#2563EB', S.tilt===0?'평행':('평행에서 '+S.tilt.toFixed(0)+'° 어긋남'));

    const same=Math.abs(S.tilt)<0.5;
    const eq = kind==='in' ? (same ? '합이 180°' : '합이 '+(a1+a2).toFixed(0)+'°')
                           : (same ? '같다' : '다르다 ('+a1.toFixed(0)+'° vs '+a2.toFixed(0)+'°)');
    const nm={co:'동위각',al:'엇각',in:'동측내각'}[kind];
    $('#paout').innerHTML =
      `<b>${nm}</b> · 첫째 각 <b style="color:#2563EB">${a1.toFixed(0)}°</b> · 둘째 각 <b style="color:#0E9384">${a2.toFixed(0)}°</b><br>`
      + `두 각의 합 ${ (a1+a2).toFixed(0) }° · 판정: <b style="color:${same?'#0E9384':'#BE123C'}">${eq}</b><br>`
      + (same
        ? `<span style="color:#0E9384">두 직선이 <b>평행</b>이라 성질이 성립합니다.</span>`
        : `<span style="color:#BE123C">아랫줄이 평행에서 ${Math.abs(S.tilt).toFixed(0)}° 어긋나 있습니다 — 이름은 ${nm}인데 성질은 깨졌습니다.</span>`);
  }
  dragOn(cv,{
    hit:p=>{
      const hT=hTh(), hL=hLn();
      if(Math.hypot(p.x-hT.x,p.y-hT.y)<20) return 'T';
      if(Math.hypot(p.x-hL.x,p.y-hL.y)<20) return 'L';
      return null;
    },
    move:(h,p)=>{
      const {I1,I2}=cross();
      if(h==='T'){
        let a=Math.atan2(-(p.y-I1.y), p.x-I1.x)*180/Math.PI;
        S.th=Math.max(30,Math.min(80,Math.round(a)));
      } else {
        let a=Math.atan2(p.y-I2.y, p.x-I2.x)*180/Math.PI;
        if(Math.abs(a)<1.5) a=0;                    // 평행 스냅
        S.tilt=Math.max(-24,Math.min(24,Math.round(a)));
      }
      draw();
    }
  });
  $('#paM').onchange=draw;
  $('#paPar').onclick=()=>{ S.tilt=0; draw(); };
  draw();

  inquiry(root,{ id:'pa', title:'평행선과 각 — 그림의 원근법',
    q:['각의 종류 세 가지를 모두 고르고, θ 를 여러 값으로 바꿔 가며 기록하세요 (9줄 이상). 평행을 깨뜨린 줄도 반드시 섞으세요.',
       '「두 각의 합」 열과 「두 각이 같은가」 열을 보세요. <b>어느 종류에서 무엇이 성립하는지</b>, 그리고 <b>평행이 깨지면 어떻게 되는지</b> 찾으세요.',
       '동위각·엇각·동측내각을 <b>자리로</b> 구별해 그림과 함께 손으로 설명하고, 이 관계들이 왜 <b>평행할 때만</b> 성립하는지 적으세요.'],
    cols:['각의 종류','평행인가','첫째 각','둘째 각','두 각의 합','성질이 성립하는가'],
    hint:'힌트 — 각의 이름은 “크기가 같다”는 뜻이 아니라 “어느 자리에 있다”는 뜻입니다. 이름과 성질을 섞지 마세요.',
    read:()=>{ const kind=$('#paM').value, same=Math.abs(S.tilt)<0.5;
      const a1=S.th, a2raw=S.th-S.tilt, a2=kind==='in'?180-a2raw:a2raw;
      const nm={co:'동위각',al:'엇각',in:'동측내각'}[kind];
      const ok = kind==='in' ? Math.abs(a1+a2-180)<0.5 : Math.abs(a1-a2)<0.5;
      return [nm, same?'평행':'어긋남 '+S.tilt.toFixed(0)+'°', a1.toFixed(0)+'°', a2.toFixed(0)+'°',
              (a1+a2).toFixed(0)+'°', ok?'성립':'깨짐']; } });
}

/* ---------- LAB 31 구조물은 왜 삼각형일까 — 합동 조건 [9수03-04] ----------
   SSA 가 조건이 못 되는 이유는 「원과 반직선의 교점이 두 개일 수 있다」는 그림 한 장이다.
   그 그림을 학생이 직접 만든다 — 꼭짓점 B 에서 반지름 b 인 컴퍼스 원의 손잡이를 끌면
   원이 자라고 줄며, 반직선과의 교점이 0개 → 1개(접함) → 2개로 눈앞에서 바뀐다.
   교점이 2개인 순간 두 삼각형이 함께 그려진다 — 같은 SSA, 다른 모양. 반례 완성. */
function congDemo(root){
  root.innerHTML=`<div class="row"><div class="col">
      <canvas id="cg1" width="380" height="300"></canvas>
      <div class="note" style="margin-top:8px"><b>주황 손잡이(변 b 의 길이)</b>와
      <b>파란 손잡이(각 A)</b>를 <b>직접 끌어</b> 보세요.</div>
    </div>
    <div class="col">
      <label class="ctl">어떤 조건으로 만들까요
        <select id="cgM" style="width:100%;padding:7px 9px;border:1px solid #E5E7EB;border-radius:8px;font:inherit">
          <option value="sss">SSS — 세 변</option>
          <option value="sas">SAS — 두 변과 낀 각</option>
          <option value="asa">ASA — 한 변과 양 끝 각</option>
          <option value="ssa" selected>SSA — 두 변과 낀 각이 아닌 각 ← 조건이 아님</option>
        </select></label>
      <div class="out" id="cgout"></div>
      <div class="note" style="margin-top:12px">어떤 조건이면 삼각형이 「하나로」 정해질까요? 조건을 바꿔 가며 두 개가 나오는 경우를 찾아보세요.</div>
    </div></div>`;
  const cv=$('#cg1'),ctx=cv.getContext('2d'),W=380,H=300;
  const A={x:52,y:236};                       // 각 A 의 꼭짓점 (반직선의 시작)
  const c=150;                                 // 변 AB 길이(고정)
  const S={ A:35, b:95 };

  const rad=d=>d*Math.PI/180;
  function geom(){
    const t=rad(S.A);
    const B={x:A.x+c*Math.cos(-t), y:A.y+c*Math.sin(-t)};    // 위쪽으로
    // 반직선(밑변)은 A 에서 수평 오른쪽. B 에서 반지름 b 원과 밑변의 교점:
    const dy=A.y-B.y;                                        // B 의 높이
    const disc=S.b*S.b-dy*dy;
    let pts=[];
    if(disc>=0){ const s=Math.sqrt(disc);
      [B.x+s, B.x-s].forEach(x=>{ if(x>A.x+8) pts.push({x, y:A.y}); });
      pts=pts.filter((p,i,arr)=>arr.findIndex(q=>Math.abs(q.x-p.x)<1)===i);
      if(disc<1) pts=pts.slice(0,1);                         // 접함
    }
    return {B, pts, dy};
  }
  function tri(P1,P2,P3,col,alpha){
    ctx.globalAlpha=alpha; ctx.fillStyle=col;
    ctx.beginPath(); ctx.moveTo(P1.x,P1.y); ctx.lineTo(P2.x,P2.y); ctx.lineTo(P3.x,P3.y);
    ctx.closePath(); ctx.fill(); ctx.globalAlpha=1;
    ctx.strokeStyle=col; ctx.lineWidth=2; ctx.stroke();
  }
  function draw(){
    const mode=$('#cgM').value, {B,pts,dy}=geom();
    ctx.clearRect(0,0,W,H); ctx.fillStyle='#fff'; ctx.fillRect(0,0,W,H);
    // 밑변 반직선
    ctx.strokeStyle='#9CA3AF'; ctx.lineWidth=1.8;
    ctx.beginPath(); ctx.moveTo(A.x,A.y); ctx.lineTo(W-14,A.y); ctx.stroke();
    // 변 AB
    ctx.strokeStyle='#374151'; ctx.lineWidth=2.4;
    ctx.beginPath(); ctx.moveTo(A.x,A.y); ctx.lineTo(B.x,B.y); ctx.stroke();
    // 각 A 호
    ctx.strokeStyle='#2563EB'; ctx.lineWidth=2;
    ctx.beginPath(); ctx.arc(A.x,A.y,26,0,-rad(S.A),true); ctx.stroke();
    ctx.fillStyle='#2563EB'; ctx.font='bold 12px sans-serif';
    ctx.fillText('A = '+S.A+'°', A.x+30, A.y-10);
    if(mode==='ssa'){
      // 컴퍼스 원 (B 중심, 반지름 b)
      ctx.strokeStyle='#B45309'; ctx.setLineDash([5,4]); ctx.lineWidth=1.8;
      ctx.beginPath(); ctx.arc(B.x,B.y,S.b,0,7); ctx.stroke(); ctx.setLineDash([]);
      // 교점과 삼각형
      const cols=['#0E9384','#BE123C'];
      pts.forEach((P,i)=>{ tri(A,B,P,cols[i],.10);
        ctx.fillStyle=cols[i]; ctx.beginPath(); ctx.arc(P.x,P.y,5,0,7); ctx.fill(); });
      // b 손잡이 — 원 위 오른쪽 아래 45° 자리
      const hb={x:B.x+S.b*Math.cos(rad(40)), y:B.y+S.b*Math.sin(rad(40))};
      handle(ctx,hb.x,hb.y,'#B45309','b = '+S.b.toFixed(0));
    } else {
      // SSS·SAS·ASA — 하나로 정해진 삼각형 (같은 조건이면 같은 모양)
      const t2=rad(38);
      const C={x:A.x+205, y:A.y};
      tri(A,B,C,'#0E9384',.10);
      ctx.fillStyle='#6B7280'; ctx.font='12px sans-serif'; ctx.textAlign='center';
      ctx.fillText(mode.toUpperCase()+' — 주어진 값이 같으면 모양은 하나뿐입니다', W/2, 40);
      ctx.textAlign='left';
    }
    // 각 A 손잡이 (변 AB 끝)
    handle(ctx,B.x,B.y,'#2563EB','');
    ctx.fillStyle='#111827'; ctx.font='bold 12px sans-serif';
    ctx.fillText('B', B.x+10, B.y-10);
    ctx.fillText('A', A.x-16, A.y+16);

    const n = mode==='ssa' ? pts.length : 1;
    $('#cgout').innerHTML = mode==='ssa'
      ? `각 A = <b>${S.A}°</b> · 변 AB = ${c} · 변 b = <b>${S.b.toFixed(0)}</b><br>`
        + `B 의 높이 = ${dy.toFixed(0)} → 원과 반직선의 교점 <b style="color:${n===2?'#BE123C':n===1?'#B45309':'#6B7280'}">${n}개</b><br>`
        + (n===2 ? `<b style="color:#BE123C">삼각형이 두 개 나왔습니다</b> — 같은 SSA 값인데 모양이 다릅니다. 반례 완성.` :
           n===1 ? `삼각형이 하나입니다 (원이 반직선에 겨우 닿거나 한 번만 자릅니다).` :
                   `원이 반직선에 닿지 않아 삼각형이 없습니다. b 를 키워 보세요.`)
        + `<br><span style="color:#6B7280;font-size:12.5px">두 개가 되는 범위: ${dy.toFixed(0)} < b < ${c} — 직접 확인해 보세요.</span>`
      : `<b>${mode.toUpperCase()}</b> — 주어진 값이 같으면 삼각형은 <b>하나로</b> 정해집니다. 합동 조건입니다.`;
  }
  dragOn(cv,{
    hit:p=>{
      const {B}=geom();
      if($('#cgM').value==='ssa'){
        const hb={x:B.x+S.b*Math.cos(rad(40)), y:B.y+S.b*Math.sin(rad(40))};
        if(Math.hypot(p.x-hb.x,p.y-hb.y)<18) return 'b';
      }
      if(Math.hypot(p.x-B.x,p.y-B.y)<18) return 'A';
      return null;
    },
    move:(h,p)=>{
      if(h==='A'){
        let a=Math.atan2(-(p.y-A.y), p.x-A.x)*180/Math.PI;
        S.A=Math.max(20,Math.min(70,Math.round(a)));
      } else {
        const {B}=geom();
        S.b=Math.max(30,Math.min(170,Math.round(Math.hypot(p.x-B.x,p.y-B.y))));
      }
      draw();
    }
  });
  $('#cgM').onchange=draw;
  draw();

  inquiry(root,{ id:'cg', title:'구조물은 왜 삼각형일까 — 삼각형의 합동',
    q:['SSA 에서 b 손잡이를 끌어 30부터 170까지 바꿔 가며, 교점 개수가 바뀌는 순간마다 기록하세요 (8줄 이상).',
       '「삼각형 개수」 열을 보세요. <b>2가 나오는 b 의 범위</b>를 찾고, 그 경계가 그림의 무엇인지(B 의 높이 · 변 AB) 확인하세요.',
       'SSA 가 합동 조건이 되지 못하는 이유를 <b>반례</b>로 손으로 설명하세요. 원과 반직선의 교점이 몇 개인지로 설명하면 좋습니다.'],
    cols:['조건','각 A','변 b','삼각형 개수','합동 조건인가'],
    hint:'힌트 — “조건이 된다”는 것은 주어진 값이 같으면 모양이 하나로 정해진다는 뜻입니다. 반례 하나면 무너집니다.',
    read:()=>{ const mode=$('#cgM').value, {pts}=geom();
      const n = mode==='ssa' ? pts.length : 1;
      return [mode.toUpperCase(), S.A+'°', S.b.toFixed(0), n, mode==='ssa'?'아니다':'맞다']; } });
}

/* ---------- LAB 32 원그래프의 각도는 어떻게 정할까 [9수03-06] ----------
   중심각을 슬라이더로 미는 대신, 피자 조각의 가장자리를 직접 잡아 돌린다.
   ① 호의 끝점을 원 위에서 끌면 중심각이 바뀌고
   ② 반지름 손잡이를 밖으로 끌면 원이 커진다 — 호와 넓이는 커지는데 비율 세 개는 꿈쩍도 안 한다.
   그 「꿈쩍도 안 함」이 원그래프가 성립하는 이유다. */
function sectDemo(root){
  root.innerHTML=`<div class="row"><div class="col">
      <canvas id="sc1" width="380" height="300"></canvas>
      <div class="note" style="margin-top:8px"><b>호의 끝(주황)</b>을 원 위에서 돌리고,
      <b>반지름 끝(파랑)</b>을 밖으로 끌어 보세요.</div>
    </div>
    <div class="col">
      <div class="out" id="scout"></div>
      <div class="note" style="margin-top:12px">중심각·호·넓이 — 셋 중 무엇이 무엇을 따라 움직이나요? 반지름을 바꾸면 비율은 어떻게 될까요?</div>
    </div></div>`;
  const cv=$('#sc1'),ctx=cv.getContext('2d'),W=380,H=300;
  const C={x:180,y:158};
  const S={ a:120, r:80 };

  const rad=d=>d*Math.PI/180;
  function draw(){
    ctx.clearRect(0,0,W,H); ctx.fillStyle='#fff'; ctx.fillRect(0,0,W,H);
    // 원 둘레(옅게)
    ctx.strokeStyle='#E5E7EB'; ctx.lineWidth=1.6;
    ctx.beginPath(); ctx.arc(C.x,C.y,S.r,0,7); ctx.stroke();
    // 부채꼴 — 0° 에서 시계 반대로 a°
    const t=rad(S.a);
    ctx.fillStyle='#2563EB'; ctx.globalAlpha=.16;
    ctx.beginPath(); ctx.moveTo(C.x,C.y); ctx.arc(C.x,C.y,S.r,0,-t,true); ctx.closePath(); ctx.fill();
    ctx.globalAlpha=1;
    ctx.strokeStyle='#2563EB'; ctx.lineWidth=2.4;
    ctx.beginPath(); ctx.moveTo(C.x,C.y); ctx.lineTo(C.x+S.r,C.y);
    ctx.moveTo(C.x,C.y); ctx.lineTo(C.x+S.r*Math.cos(-t),C.y+S.r*Math.sin(-t)); ctx.stroke();
    ctx.strokeStyle='#B45309'; ctx.lineWidth=3;
    ctx.beginPath(); ctx.arc(C.x,C.y,S.r,0,-t,true); ctx.stroke();
    // 중심각 라벨
    ctx.fillStyle='#111827'; ctx.font='bold 14px sans-serif'; ctx.textAlign='center';
    const mid=-t/2;
    ctx.fillText(S.a.toFixed(0)+'°', C.x+Math.max(28,S.r*0.45)*Math.cos(mid), C.y+Math.max(28,S.r*0.45)*Math.sin(mid)+5);
    // 손잡이 — 호 끝(각), 0° 반지름 끝(반지름)
    handle(ctx, C.x+S.r*Math.cos(-t), C.y+S.r*Math.sin(-t), '#B45309','');
    handle(ctx, C.x+S.r, C.y, '#2563EB','r = '+S.r.toFixed(0));

    const arc=2*Math.PI*S.r*S.a/360, area=Math.PI*S.r*S.r*S.a/360;
    const pc=v=>(v*100).toFixed(1)+'%';
    const p1=S.a/360, p2=arc/(2*Math.PI*S.r), p3=area/(Math.PI*S.r*S.r);
    $('#scout').innerHTML =
      `중심각 <b>${S.a.toFixed(0)}°</b> · 반지름 <b>${S.r.toFixed(0)}</b><br>`
      + `호의 길이 = 2πr × ${S.a.toFixed(0)}/360 = <b>${arc.toFixed(1)}</b><br>`
      + `넓이 = πr² × ${S.a.toFixed(0)}/360 = <b>${area.toFixed(1)}</b><br><br>`
      + `<b>세 가지 비율</b><br>`
      + `각의 비율 ${pc(p1)} · 호의 비율 ${pc(p2)} · 넓이의 비율 ${pc(p3)}<br>`
      + `<b style="color:#0E9384">셋이 언제나 같습니다</b> — 반지름을 끌어 바꿔도 확인해 보세요.`;
  }
  dragOn(cv,{
    hit:p=>{
      const t=rad(S.a);
      const hA={x:C.x+S.r*Math.cos(-t), y:C.y+S.r*Math.sin(-t)};
      const hR={x:C.x+S.r, y:C.y};
      if(Math.hypot(p.x-hA.x,p.y-hA.y)<18) return 'a';
      if(Math.hypot(p.x-hR.x,p.y-hR.y)<18) return 'r';
      // 원 둘레 근처를 잡으면 각으로
      if(Math.abs(Math.hypot(p.x-C.x,p.y-C.y)-S.r)<14) return 'a';
      return null;
    },
    move:(h,p)=>{
      if(h==='a'){
        let a=Math.atan2(-(p.y-C.y), p.x-C.x)*180/Math.PI;
        if(a<0) a+=360;
        S.a=Math.max(5,Math.min(355,Math.round(a/5)*5));
      } else {
        S.r=Math.max(40,Math.min(120,Math.round(Math.hypot(p.x-C.x,p.y-C.y))));
      }
      draw();
    }
  });
  draw();

  inquiry(root,{ id:'se', title:'원그래프의 각도는 어떻게 정할까 — 부채꼴',
    q:['호 끝을 돌려 중심각을, 반지름 끝을 끌어 r 를 바꿔 가며 8줄 이상 기록하세요. 같은 각에서 r 만 두 배로 한 줄을 꼭 넣으세요.',
       '오른쪽 세 비율 열을 견주어 무엇이 늘 같은지 찾고, 반지름을 2배로 했을 때 호와 넓이가 각각 <b>몇 배</b>가 되는지 확인하세요.',
       '호의 길이와 넓이 공식을 쓰고, <b>비율은 왜 반지름과 무관한지</b> 손으로 설명하세요. 그것이 원그래프가 성립하는 이유임을 적으세요.'],
    cols:['중심각','반지름 r','호의 길이','넓이','중심각 비율','호 비율','넓이 비율'],
    hint:'힌트 — 공식에서 x/360 을 빼면 무엇이 남나요? 그 남는 것이 “원 전체”입니다. 비율은 늘 그것으로 나눈 값입니다.',
    read:()=>{ const a=S.a, r=S.r;
      const arc=2*Math.PI*r*a/360, ar=Math.PI*r*r*a/360;
      const pc=v=>(v*100).toFixed(1)+'%';
      return [a.toFixed(0)+'°', r.toFixed(0), arc.toFixed(1), ar.toFixed(1), pc(a/360),
              pc(arc/(2*Math.PI*r)), pc(ar/(Math.PI*r*r))]; } });
}

/* ---------- LAB 33 신발은 어느 치수를 더 들여놔야 할까 [9수04-01] ----------
   슬라이더로 두 치수의 인원을 조절하는 대신, 학생이 가게 점원이 되어 신발을 「판다」.
   진열대의 치수를 누를 때마다 그 치수가 한 켤레 팔리며 막대가 자라고,
   평균·중앙값·최빈값이 그 자리에서 다시 계산된다. 평균 치수는 아무도 안 신는
   255.0 같은 수가 되는 순간이 온다 — 그때 「어느 치수를 들여놔야 하나」를 다시 묻는다. */
function repM1Demo(root){
  root.innerHTML=`<div class="row"><div class="col">
      <canvas id="rm1" width="380" height="300"></canvas>
      <div class="note" style="margin-top:8px"><b>진열대(막대 아래 치수)를 누르면</b> 그 치수가
      한 켤레 팔립니다. 막대를 누르면 한 켤레 반품됩니다.</div>
    </div>
    <div class="col">
      <div class="ctl" style="display:flex;gap:6px;flex-wrap:wrap">
        <button class="b g sm" id="rmDay">하루 손님 몰려오기 (+15)</button>
        <button class="b g sm" id="rmRst">개점 (다시)</button>
      </div>
      <div class="out" id="rmout"></div>
      <div class="note" style="margin-top:12px">신발 가게 주인이 정말 궁금한 것은 무엇일까요? 세 대푯값 중 그 물음에 답하는 것을 찾아보세요.</div>
    </div></div>`;
  const cv=$('#rm1'),ctx=cv.getContext('2d'),W=380,H=300,P=36;
  const SIZES=[230,240,250,260,270,280];
  const S={ cnt:[3,6,4,18,7,4] };
  const BW=(W-2*P)/SIZES.length;
  const xi=i=>P+BW*i+BW/2;
  const BASE=224, TOPY=54;

  function stats(){
    const d=[]; SIZES.forEach((z,i)=>{for(let k=0;k<S.cnt[i];k++)d.push(z);});
    if(!d.length) return null;
    const n=d.length, mean=d.reduce((x,y)=>x+y,0)/n;
    const sorted=d.slice().sort((x,y)=>x-y);
    const med=n%2?sorted[(n-1)/2]:(sorted[n/2-1]+sorted[n/2])/2;
    const mx=Math.max.apply(null,S.cnt), mode=SIZES[S.cnt.indexOf(mx)];
    return {n,mean,med,mode,mx};
  }
  function draw(){
    const st=stats();
    ctx.clearRect(0,0,W,H); ctx.fillStyle='#fff'; ctx.fillRect(0,0,W,H);
    ctx.fillStyle='#111827'; ctx.font='bold 13.5px sans-serif'; ctx.textAlign='center';
    ctx.fillText('오늘 판 신발 '+(st?st.n:0)+'켤레', W/2, 28);
    const mxc=Math.max.apply(null,S.cnt.concat([1]));
    SIZES.forEach((z,i)=>{
      const h=(BASE-TOPY)*S.cnt[i]/mxc;
      const isMode=st && S.cnt[i]===st.mx && S.cnt[i]>0;
      ctx.fillStyle=isMode?'rgba(14,147,132,.5)':'rgba(37,99,235,.30)';
      ctx.fillRect(xi(i)-BW*0.34, BASE-h, BW*0.68, h);
      ctx.strokeStyle=isMode?'#0E9384':'#2563EB'; ctx.lineWidth=1.4;
      ctx.strokeRect(xi(i)-BW*0.34, BASE-h, BW*0.68, h);
      ctx.fillStyle='#374151'; ctx.font='bold 11px sans-serif';
      if(S.cnt[i]) ctx.fillText(S.cnt[i], xi(i), BASE-h-5);
      // 진열대 버튼
      ctx.fillStyle='#F3F4F6'; ctx.strokeStyle='#D1D5DB';
      ctx.fillRect(xi(i)-BW*0.42, BASE+8, BW*0.84, 26);
      ctx.strokeRect(xi(i)-BW*0.42, BASE+8, BW*0.84, 26);
      ctx.fillStyle='#111827'; ctx.font='bold 12px sans-serif';
      ctx.fillText(z, xi(i), BASE+25);
    });
    ctx.fillStyle='#6B7280'; ctx.font='10.5px sans-serif';
    ctx.fillText('↑ 누르면 한 켤레 팔림', W/2, BASE+50);
    if(st){
      // 평균·중앙값 위치 표시
      const px=v=>P+ (W-2*P)*(v-225)/(285-225);
      [['평균',st.mean,'#BE123C'],['중앙값',st.med,'#B45309'],['최빈값',st.mode,'#0E9384']].forEach((q,k)=>{
        ctx.strokeStyle=q[2]; ctx.setLineDash(k===2?[]:[4,3]); ctx.lineWidth=1.8;
        ctx.beginPath(); ctx.moveTo(px(q[1]),TOPY-12); ctx.lineTo(px(q[1]),BASE); ctx.stroke(); ctx.setLineDash([]);
        ctx.fillStyle=q[2]; ctx.font='bold 10.5px sans-serif';
        ctx.fillText(q[0], px(q[1]), TOPY-16-(k===1?11:0));
      });
    }
    if(st){
      const stocked=SIZES.includes(Math.round(st.mean/10)*10) && S.cnt[SIZES.indexOf(Math.round(st.mean/10)*10)]>0;
      $('#rmout').innerHTML =
        `평균 <b style="color:#BE123C">${st.mean.toFixed(1)}</b> · 중앙값 <b style="color:#B45309">${st.med}</b> · 최빈값 <b style="color:#0E9384">${st.mode}</b><br>`
        + `가장 많이 팔린 치수: <b>${st.mode}</b> (${st.mx}켤레)<br>`
        + `<span style="color:#6B7280;font-size:12.5px">평균 ${st.mean.toFixed(1)} 치수의 신발은 진열대에 ${Number.isInteger(st.mean)&&SIZES.includes(st.mean)?'있지만':'아예 없습니다 —'}
        발주서에 적어야 할 것은 어느 수인가요?</span>`;
    } else $('#rmout').innerHTML='진열대를 눌러 판매를 시작하세요.';
  }
  cv.style.touchAction='none';
  cv.addEventListener('pointerdown',e=>{
    const r=cv.getBoundingClientRect();
    const x=(e.clientX-r.left)*W/r.width, y=(e.clientY-r.top)*H/r.height;
    const i=Math.floor((x-P)/BW);
    if(i<0||i>=SIZES.length) return;
    if(y>BASE+4 && y<BASE+40){ S.cnt[i]++; draw(); }          // 진열대 = 판매
    else if(y<BASE && S.cnt[i]>0){                             // 막대 = 반품
      const mxc=Math.max.apply(null,S.cnt.concat([1]));
      const h=(BASE-TOPY)*S.cnt[i]/mxc;
      if(y>BASE-h-8){ S.cnt[i]--; draw(); }
    }
  });
  $('#rmDay').onclick=()=>{ // 실제 발 크기 분포 흉내 — 260 근처가 두텁다
    const w=[0.06,0.14,0.16,0.36,0.18,0.10];
    for(let k=0;k<15;k++){ let r=Math.random(),acc=0;
      for(let i=0;i<6;i++){ acc+=w[i]; if(r<acc){ S.cnt[i]++; break; } } }
    draw(); };
  $('#rmRst').onclick=()=>{ S.cnt=[0,0,0,0,0,0]; draw(); };
  draw();

  inquiry(root,{ id:'rm', title:'신발은 어느 치수를 더 들여놔야 할까 — 대푯값',
    q:['진열대를 눌러 여러 분포를 만들며 기록하세요 (8줄 이상). 한 치수에 몰린 날, 고르게 팔린 날을 모두 담으세요.',
       '「평균 − 최빈값」 열을 보세요. 두 값이 <b>크게 벌어지는 날</b>은 분포가 어떤 모양일 때인지 찾으세요.',
       '발주서에 적을 대푯값을 고르고, <b>평균이 답이 되지 못하는 이유</b>를 오늘 만든 분포로 손으로 설명하세요.'],
    cols:['팔린 수','평균','중앙값','최빈값','최빈값 켤레 수','평균 − 최빈값'],
    hint:'힌트 — 평균은 모든 값을 섞어 버립니다. “가장 많이 팔린 것”이라는 물음에는 섞으면 안 됩니다.',
    read:()=>{ const st=stats(); if(!st) return null;
      return [st.n, st.mean.toFixed(1), st.med, st.mode, st.mx, (st.mean-st.mode).toFixed(1)]; } });
}

/* ---------- LAB 34 구간을 몇 개로 나눠야 할까 [9수04-02][9수04-04] ----------
   「같은 자료, 다른 인상」이 요점이므로 원자료가 화면에 늘 보여야 한다.
   위에 점판(원자료 40개)이 고정되어 있고, 아래 히스토그램의
   ① 시작점 ▲ 손잡이를 좌우로 끌고 ② 폭 손잡이 ⟷ 를 끌어 계급을 직접 자른다.
   막대는 바뀌는데 점판은 그대로다 — 그래프가 사실이 아니라 선택임이 한 화면에서 보인다. */
function histDemo(root){
  root.innerHTML=`<div class="row"><div class="col">
      <canvas id="hs1" width="380" height="300"></canvas>
      <div class="note" style="margin-top:8px">아래 축의 <b>▲ 시작점</b>과 <b>⟷ 폭 손잡이</b>를
      <b>직접 끌어</b> 계급을 잘라 보세요. 위의 <b>원자료 점판은 변하지 않습니다</b>.</div>
    </div>
    <div class="col">
      <div class="ctl" style="display:flex;gap:6px;flex-wrap:wrap">
        <button class="b g sm" id="hsP1">폭 5</button>
        <button class="b g sm" id="hsP2">폭 10</button>
        <button class="b g sm" id="hsP3">폭 20</button>
        <button class="b g sm" id="hsP4">폭 40</button>
      </div>
      <div class="out" id="hsout"></div>
      <div class="note" style="margin-top:12px">계급 폭을 바꾸면 같은 자료의 인상이 어떻게 달라지나요? 봉우리 수까지 달라질 수 있을까요?</div>
    </div></div>`;
  const cv=$('#hs1'),ctx=cv.getContext('2d'),W=380,H=300;
  // 어느 반의 수학 점수 40명 — 고정 자료
  const DATA=[42,48,51,53,55,56,58,58,60,61,62,63,63,64,65,66,66,67,68,68,
              69,70,71,72,72,73,74,75,76,77,78,80,81,83,85,87,88,91,94,97];
  const P=34, AXY=252, DOTY0=34, DOTH=54;
  const S={ w:10, off:0 };
  const X=v=>P+(W-2*P)*(v-40)/60;                       // 40~100점
  const invX=px=>40+(px-P)*60/(W-2*P);

  function bins(){
    const lo=Math.floor((40-S.off)/S.w)*S.w+S.off, out=[];
    for(let s=lo;s<100;s+=S.w) out.push({s,e:s+S.w,c:DATA.filter(v=>v>=s&&v<s+S.w).length});
    return out.filter(b=>b.e>40);
  }
  function draw(){
    ctx.clearRect(0,0,W,H); ctx.fillStyle='#fff'; ctx.fillRect(0,0,W,H);
    // ── 원자료 점판 (고정)
    ctx.fillStyle='#6B7280'; ctx.font='11px sans-serif'; ctx.textAlign='left';
    ctx.fillText('원자료 40명 — 이 점들은 변하지 않습니다', P, DOTY0-10);
    const stack={};
    DATA.forEach(v=>{ const k=Math.round(v);
      stack[k]=(stack[k]||0)+1;
      ctx.fillStyle='#374151';
      ctx.beginPath(); ctx.arc(X(v), DOTY0+DOTH-8-(stack[k]-1)*9, 3.2, 0, 7); ctx.fill(); });
    ctx.strokeStyle='#D1D5DB'; ctx.lineWidth=1;
    ctx.beginPath(); ctx.moveTo(P,DOTY0+DOTH); ctx.lineTo(W-P,DOTY0+DOTH); ctx.stroke();

    // ── 히스토그램
    const B=bins(), mx=Math.max(...B.map(b=>b.c),1);
    const BASE=AXY, TOPY=DOTY0+DOTH+26, BH=BASE-TOPY;
    B.forEach(b=>{
      const x1=Math.max(P,X(b.s)), x2=Math.min(W-P,X(b.e));
      const h=BH*b.c/mx;
      ctx.fillStyle='rgba(37,99,235,.34)';
      ctx.fillRect(x1, BASE-h, x2-x1, h);
      ctx.strokeStyle='#2563EB'; ctx.lineWidth=1.2;
      ctx.strokeRect(x1, BASE-h, x2-x1, h);
      if(b.c){ ctx.fillStyle='#374151'; ctx.font='10.5px sans-serif'; ctx.textAlign='center';
        ctx.fillText(b.c,(x1+x2)/2,BASE-h-4); }
    });
    // 축과 눈금
    ctx.strokeStyle='#9CA3AF'; ctx.lineWidth=1.4;
    ctx.beginPath(); ctx.moveTo(P,BASE); ctx.lineTo(W-P,BASE); ctx.stroke();
    ctx.fillStyle='#9CA3AF'; ctx.font='10px sans-serif'; ctx.textAlign='center';
    for(let v=40;v<=100;v+=10) ctx.fillText(String(v), X(v), BASE+14);
    // ── 손잡이
    // 시작점 ▲ — 첫 경계
    const first=B[0] ? Math.max(40,B[0].s) : 40;
    ctx.fillStyle='#B45309'; ctx.beginPath();
    ctx.moveTo(X(first),BASE+18); ctx.lineTo(X(first)-8,BASE+32); ctx.lineTo(X(first)+8,BASE+32);
    ctx.closePath(); ctx.fill();
    ctx.font='bold 10.5px sans-serif'; ctx.textAlign='center';
    ctx.fillText('시작점', X(first), BASE+44);
    // 폭 ⟷ — 첫 계급의 오른쪽 경계
    const wx=X(Math.min(100,first+S.w));
    handle(ctx,wx,BASE+25,'#2563EB','폭 '+S.w);

    const peak=B.reduce((a,b)=>b.c>a.c?b:a,B[0]);
    const peaks=B.filter((b,i)=>b.c>=3 && (!B[i-1]||b.c>=B[i-1].c) && (!B[i+1]||b.c>=B[i+1].c) && b.c>=mx*0.7).length;
    $('#hsout').innerHTML =
      `계급의 크기 <b>${S.w}점</b> · 시작점 <b>${S.off}점</b> · 계급 <b>${B.length}개</b><br>`
      + `가장 높은 계급: <b>${peak.s}~${peak.e}점</b> (${peak.c}명 · ${(peak.c/40*100).toFixed(0)}%)<br>`
      + `<span style="color:#6B7280;font-size:12.5px">폭을 5 ↔ 40 으로 끌어 보세요 —
         너무 좁으면 들쭉날쭉, 너무 넓으면 분포가 뭉개집니다. 원자료는 그대로인데.</span>`;
  }
  dragOn(cv,{
    hit:p=>{
      const B=bins(), first=B[0]?Math.max(40,B[0].s):40;
      const wx=X(Math.min(100,first+S.w));
      if(p.y>AXY+8){
        if(Math.abs(p.x-wx)<20 && p.y<AXY+38) return 'w';
        if(Math.abs(p.x-X(first))<20) return 'o';
        return Math.abs(p.x-wx)<Math.abs(p.x-X(first)) ? 'w' : 'o';
      }
      return null;
    },
    move:(h,p)=>{
      const B=bins(), first=B[0]?Math.max(40,B[0].s):40;
      if(h==='o'){ S.off=((Math.round(invX(p.x))%S.w)+S.w)%S.w; }
      else { S.w=Math.max(2,Math.min(40,Math.round(invX(p.x))-first)); }
      draw();
    }
  });
  [['hsP1',5],['hsP2',10],['hsP3',20],['hsP4',40]].forEach(q=>{
    $('#'+q[0]).onclick=()=>{ S.w=q[1]; draw(); }; });
  draw();

  inquiry(root,{ id:'hs', title:'구간을 몇 개로 나눠야 할까 — 도수분포표와 히스토그램',
    q:['폭 손잡이를 끌어 계급의 크기를 2부터 40까지 바꿔 가며, 시작점도 함께 바꿔 8줄 이상 기록하세요.',
       '「최대 도수 계급」 열을 보세요. <b>같은 자료인데 가장 높은 계급이 달라지는</b> 경우를 찾아 적으세요.',
       '계급의 크기를 밝히지 않은 히스토그램을 <b>왜 비교할 수 없는지</b> 손으로 설명하고, 이 자료에는 어느 계급 크기가 알맞은지 근거를 들어 정하세요.'],
    cols:['계급의 크기','시작점','계급 수','최대 도수 계급','그 도수','전체 대비'],
    hint:'힌트 — 그래프는 “사실”이 아니라 <b>선택의 결과</b>입니다. 같은 자료로 정반대 인상을 만들 수 있는지 시험해 보세요.',
    read:()=>{ const B=bins(); if(!B.length) return null;
      const peak=B.reduce((a,b)=>b.c>a.c?b:a,B[0]);
      return [S.w+'점', S.off+'점', B.length, peak.s+'~'+peak.e, peak.c,
              (peak.c/DATA.length*100).toFixed(1)+'%']; } });
}


/* ============ 탐구 보고서 블록 ============
   체험만 하고 끝나면 남는 것이 없다. 조작 → 기록 → 규칙 찾기 → 설명의 네 단계를 강제한다.

     ① 탐구 질문 3단계   관찰 → 규칙 → 일반화·설명. 단계마다 무엇을 해야 하는지 명시
     ② 관찰 기록표       조작하다 「지금 값 기록」을 누르면 그 순간의 값이 표에 쌓인다.
                        학생이 스스로 표를 만들며 규칙을 찾는 것이 이 단계의 본체
     ③ 손글씨 답안판     탭④와 같은 writePad. 식은 손으로 쓰는 것이 이 과제의 본체다
     ④ 제출              기록표 + 손글씨를 한 장의 PNG 로 합쳐 내려받는다

   spec = { id, title, q:[3단계 질문], cols:[표 머리], read:()=>[값 배열], hint }
   각 실험실의 데모 함수 끝에서 inquiry(root, spec) 을 부르면 붙는다. */
/* ═══════════════ 예상 먼저 쓰기 (LAB 05~21) ═══════════════
   자료를 열자마자 그래프와 답이 보이면 학생은 생각할 틈이 없다. 보고 나서 “아 그렇구나”
   하는 것은 배움이 아니다. 그래서 실험 화면을 덮어 두고, 탭④ 활동지와 같은 형태로
   ① 예상 ② 근거 ③ 확인할 것 세 물음을 던진 뒤 손으로 쓰게 한다.
   실제로 획이 그어져야 「자료 열기」가 열린다. 연 뒤에도 쓴 것은 접어서 남겨 두어,
   자기 예상과 결과를 나란히 견주게 한다.

   구현 — 데모가 root 에 이미 그려진 뒤에 부른다. root 의 자식을 통째로 상자에 옮겨 감추고
   그 앞에 물음판을 끼운다. 실험실마다 build() 가 제각각이라 이 방법이 가장 안전하다. */
/* ============ 탐구 보고서 블록 ============
   체험만 하고 끝나면 남는 것이 없다. 조작 → 기록 → 규칙 찾기 → 설명의 네 단계를 강제한다.

     ① 탐구 질문 3단계   관찰 → 규칙 → 일반화·설명. 단계마다 무엇을 해야 하는지 명시
     ② 관찰 기록표       조작하다 「지금 값 기록」을 누르면 그 순간의 값이 표에 쌓인다.
                        학생이 스스로 표를 만들며 규칙을 찾는 것이 이 단계의 본체
     ③ 손글씨 답안판     탭④와 같은 writePad. 식은 손으로 쓰는 것이 이 과제의 본체다
     ④ 제출              기록표 + 손글씨를 한 장의 PNG 로 합쳐 내려받는다

   spec = { id, title, q:[3단계 질문], cols:[표 머리], read:()=>[값 배열], hint }
   각 실험실의 데모 함수 끝에서 inquiry(root, spec) 을 부르면 붙는다. */
function predictGate(root, spec){
  const hidden = document.createElement('div');
  hidden.className = 'pgHidden';
  while(root.firstChild) hidden.appendChild(root.firstChild);   // 데모를 통째로 옮겨 감춘다

  const box = document.createElement('div');
  box.className = 'pgb';
  box.innerHTML = `
    <div class="pgh"><span class="pgstep">STEP 0</span>
      <b>예상 먼저 — 자료를 열기 전에 손으로 쓰세요</b></div>
    <p class="pgq0">${spec.lead}</p>
    <ol class="pgq">${spec.q.map((t,i)=>
      `<li><b>${['예상','근거','확인할 것'][i]}</b> ${t}</li>`).join('')}</ol>
    ${spec.hint ? `<p class="pghint">${spec.hint}</p>` : ''}
    <div class="pgpad" id="pgPad_${spec.id}"></div>
    <div class="pgbar">
      <button class="b t" id="pgGo_${spec.id}" disabled>자료 열기 — 예상을 쓴 뒤에 열립니다</button>
      <span class="pgn" id="pgN_${spec.id}">아직 쓴 것이 없습니다</span>
    </div>`;
  root.appendChild(box);
  root.appendChild(hidden);

  const pad = writePad(box.querySelector('#pgPad_'+spec.id), spec.title + ' — 예상');
  const go  = box.querySelector('#pgGo_'+spec.id);
  const nte = box.querySelector('#pgN_'+spec.id);

  function check(){
    const ok = pad && pad.hasInk();
    go.disabled = !ok;
    go.textContent = ok ? '다 썼습니다 · 자료 열기' : '자료 열기 — 예상을 쓴 뒤에 열립니다';
    nte.textContent = ok ? '이제 열 수 있습니다' : '아직 쓴 것이 없습니다';
  }
  if(pad && pad.onInk) pad.onInk(check);
  check();

  go.onclick = ()=>{
    hidden.classList.add('on');                 // 실험 화면 공개
    box.classList.add('done');                  // 물음판은 접어서 남긴다
    box.querySelector('.pgh').innerHTML =
      `<span class="pgstep done">STEP 0 ✓</span><b>내가 쓴 예상</b>` +
      `<button class="b g sm pgtog">접기</button>`;
    const tog = box.querySelector('.pgtog');
    tog.onclick = ()=>{
      const f = box.classList.toggle('fold');
      tog.textContent = f ? '펼치기' : '접기';
    };
    box.classList.add('fold'); tog.textContent = '펼치기';
    hidden.scrollIntoView({behavior:'smooth', block:'start'});
  };
}

function inquiry(root, spec){
  const box = document.createElement('div');
  box.className = 'iqb';
  box.innerHTML = `
    <div class="iqh">🔎 탐구 보고서 — 조작만 하지 말고, 규칙을 찾아 손으로 설명하세요</div>
    <ol class="iqq">${spec.q.map((t,i)=>
      `<li><b>${['관찰','규칙 찾기','설명·일반화'][i]}</b> ${t}</li>`).join('')}</ol>
    <div class="iqbar">
      <button class="b t sm" id="iqAdd_${spec.id}">지금 값 기록</button>
      <button class="b g sm" id="iqUndo_${spec.id}">마지막 줄 빼기</button>
      <button class="b g sm" id="iqClr_${spec.id}">표 비우기</button>
      <span class="iqn" id="iqN_${spec.id}">0줄</span>
    </div>
    <div class="iqt"><table id="iqT_${spec.id}">
      <thead><tr><th>#</th>${spec.cols.map(c=>`<th>${c}</th>`).join('')}</tr></thead>
      <tbody></tbody></table></div>
    ${spec.hint ? `<p class="iqhint">${spec.hint}</p>` : ''}
    <div class="iqpad" id="iqPad_${spec.id}"></div>
    <div class="iqbar">
      <button class="b t sm" id="iqSub_${spec.id}">보고서 제출 — 표와 손글씨를 한 장으로 저장</button>
      <span class="iqn">파일로 저장됩니다 · 학교 클래스룸에 그대로 올리면 됩니다</span>
    </div>`;
  root.appendChild(box);

  const rows = [];
  const tb = box.querySelector('tbody');
  function render(){
    tb.innerHTML = rows.map((r,i)=>
      `<tr><td>${i+1}</td>${r.map(v=>`<td>${v}</td>`).join('')}</tr>`).join('');
    box.querySelector('#iqN_'+spec.id).textContent = rows.length + '줄';
  }
  box.querySelector('#iqAdd_'+spec.id).onclick = ()=>{
    const v = spec.read();
    if(!v) return;
    if(rows.some(r=>r.join(' ') === v.join(' '))) return;   // 같은 값을 두 번 담지 않는다
    rows.push(v); render();
  };
  box.querySelector('#iqUndo_'+spec.id).onclick = ()=>{ rows.pop(); render(); };
  box.querySelector('#iqClr_'+spec.id).onclick = ()=>{
    if(rows.length && confirm('기록한 표를 모두 지웁니다.')){ rows.length=0; render(); } };

  const pad = box.querySelector('#iqPad_'+spec.id);
  writePad(pad, spec.title + ' — 탐구 보고서');

  /* 제출 — 머리글·질문·표·손글씨를 한 장의 PNG 로 합친다.
     외부 라이브러리 없이 캔버스에 직접 그린다(단일 파일 원칙). */
  box.querySelector('#iqSub_'+spec.id).onclick = ()=>{
    const ink = pad.querySelector('canvas');
    const W = 900, LH = 26;
    const headH = 92 + spec.q.length * 22;
    const tblH = 34 + Math.max(rows.length,1) * LH + 16;
    const inkH = ink ? Math.round(ink.height / (window.devicePixelRatio||1) * (W / (ink.width/(window.devicePixelRatio||1)))) : 0;
    const cv = document.createElement('canvas');
    cv.width = W; cv.height = headH + tblH + inkH + 40;
    const c = cv.getContext('2d');
    c.fillStyle = '#fff'; c.fillRect(0,0,cv.width,cv.height);

    c.fillStyle = '#2563EB'; c.font = 'bold 13px sans-serif'; c.textAlign = 'left';
    c.fillText('일상 속 수학 실험실 · 탐구 보고서', 28, 34);
    c.fillStyle = '#111827'; c.font = 'bold 21px sans-serif';
    c.fillText(spec.title, 28, 62);
    c.fillStyle = '#6B7280'; c.font = '12px sans-serif';
    c.fillText('이름 ______________   학번 __________   날짜 ____ . ____ . ____', 28, 84);
    c.font = '12.5px sans-serif'; c.fillStyle = '#374151';
    spec.q.forEach((t,i)=>{
      const lab = ['① 관찰','② 규칙 찾기','③ 설명·일반화'][i];
      c.fillText(lab + '  ' + t.replace(/<[^>]+>/g,''), 28, 106 + i*22);
    });

    let y = headH + 8;
    c.strokeStyle = '#E5E7EB'; c.lineWidth = 1;
    const cols = ['#'].concat(spec.cols);
    const cw = (W - 56) / cols.length;
    c.fillStyle = '#F7F8FA'; c.fillRect(28, y, W-56, 26);
    c.fillStyle = '#374151'; c.font = 'bold 12px sans-serif';
    cols.forEach((h,i)=>c.fillText(h, 34 + i*cw, y+18));
    y += 26;
    c.font = '12px sans-serif'; c.fillStyle = '#111827';
    (rows.length ? rows : [cols.slice(1).map(()=>'')]).forEach((r,ri)=>{
      c.strokeStyle = '#EEF1F5';
      c.beginPath(); c.moveTo(28,y); c.lineTo(W-28,y); c.stroke();
      [String(ri+1)].concat(r).forEach((v,i)=>c.fillText(String(v), 34 + i*cw, y+18));
      y += LH;
    });
    c.strokeStyle = '#E5E7EB'; c.strokeRect(28, headH+8, W-56, y - headH - 8);

    if(ink){ c.drawImage(ink, 28, y + 14, W-56, inkH - 14); }
    const a = document.createElement('a');
    a.href = cv.toDataURL('image/png');
    a.download = (spec.title.replace(/[\\/:*?"<>|]/g,'') + '_탐구보고서.png');
    a.click();
  };
  render();
}

/* ═══════════════ 중학교 1학년 2차 10종 (LAB 35~44) ═══════════════
   1차 10종과 달리 조작으로 끝내지 않는다. 모든 실험실이 inquiry() 블록을 달아
   관찰 → 기록 → 규칙 → 손글씨 설명 → 제출까지 한 번에 이어진다.
   성취기준은 2022 개정 중학교 1~3학년군 코드다(학년별 구분은 교과서 배치일 뿐이다). */

/* ---------- LAB 35 톱니바퀴는 언제 다시 만날까 [9수01-02] ----------
   최소공배수가 「다시 만나는 때」라면, 만나는 순간까지 직접 돌려 봐야 한다.
   「한 칸 돌리기」를 연타하면 두 바퀴가 한 톱니씩 물려 돌아가고, 표시 톱니(빨간 점)가
   처음 자리로 함께 돌아오는 순간 화면이 알려 준다 — 그 횟수가 곧 lcm(a,b) 다.
   톱니 수는 바퀴 위 손잡이를 끌어 바꾼다. */
function gcdDemo(root){
  root.innerHTML=`<div class="row"><div class="col">
      <canvas id="gd1" width="380" height="300"></canvas>
      <div class="note" style="margin-top:8px">두 바퀴 가장자리의 <b>손잡이를 끌어</b> 톱니 수를
      바꾸고, <b>「한 칸 돌리기」를 연타</b>해 처음 자리로 돌아오는 순간을 잡으세요.</div>
    </div>
    <div class="col">
      <div class="ctl" style="display:flex;gap:6px;flex-wrap:wrap">
        <button class="b t" id="gdStep">한 칸 돌리기</button>
        <button class="b t sm" id="gdRun">빨리 감기</button>
        <button class="b g sm" id="gdRst">처음으로</button>
      </div>
      <div class="out" id="gdout"></div>
      <div class="note" style="margin-top:12px">두 톱니가 처음 자리에서 다시 만나는 시각은 두 수의 무엇과 관련될까요? 기록에서 규칙을 캐 보세요.</div>
    </div></div>`;
  const cv=$('#gd1'),ctx=cv.getContext('2d'),W=380,H=300;
  const gcd=(x,y)=>y?gcd(y,x%y):x;
  const S={ a:12, b:18, t:0, timer:null };
  const CA={x:118,y:150}, CB={x:268,y:150};
  const rA=()=>30+S.a*2.1, rB=()=>30+S.b*2.1;

  function stop(){ if(S.timer){ clearInterval(S.timer); S.timer=null; } }
  function gear(C,r,n,phase,col,markCol){
    ctx.strokeStyle=col; ctx.lineWidth=2;
    ctx.beginPath(); ctx.arc(C.x,C.y,r,0,7); ctx.stroke();
    for(let k=0;k<n;k++){
      const a=phase+k*2*Math.PI/n;
      const x1=C.x+r*Math.cos(a), y1=C.y+r*Math.sin(a);
      const x2=C.x+(r+8)*Math.cos(a), y2=C.y+(r+8)*Math.sin(a);
      ctx.strokeStyle=col; ctx.lineWidth=2.4;
      ctx.beginPath(); ctx.moveTo(x1,y1); ctx.lineTo(x2,y2); ctx.stroke();
    }
    // 표시 톱니(0번)
    const a0=phase;
    ctx.fillStyle=markCol;
    ctx.beginPath(); ctx.arc(C.x+(r+8)*Math.cos(a0), C.y+(r+8)*Math.sin(a0), 5, 0, 7); ctx.fill();
    ctx.fillStyle='#374151'; ctx.font='bold 12px sans-serif'; ctx.textAlign='center';
    ctx.fillText(n+'개', C.x, C.y+4);
  }
  function draw(){
    const g=gcd(S.a,S.b), l=S.a*S.b/g;
    const back = S.t>0 && S.t%l===0;
    ctx.clearRect(0,0,W,H); ctx.fillStyle='#fff'; ctx.fillRect(0,0,W,H);
    // 맞물림 자리 표시
    ctx.strokeStyle='#D1D5DB'; ctx.setLineDash([3,3]);
    ctx.beginPath(); ctx.moveTo((CA.x+CB.x)/2, 60); ctx.lineTo((CA.x+CB.x)/2, 240); ctx.stroke();
    ctx.setLineDash([]);
    // 두 바퀴 — 서로 반대 방향, 톱니 하나 = 1/n 바퀴
    gear(CA, rA(), S.a,  S.t*2*Math.PI/S.a, '#2563EB', '#BE123C');
    gear(CB, rB(), S.b, -S.t*2*Math.PI/S.b, '#0E9384', '#BE123C');
    // 손잡이 — 각 바퀴의 아래쪽
    handle(ctx, CA.x, CA.y+rA()+16, '#2563EB', 'a = '+S.a);
    handle(ctx, CB.x, CB.y+rB()+16, '#0E9384', 'b = '+S.b);
    ctx.fillStyle=back?'#0E9384':'#374151'; ctx.font='bold 14px sans-serif'; ctx.textAlign='center';
    ctx.fillText(back ? '★ 처음 자리로 돌아왔습니다!' : '돌린 칸 수: '+S.t, W/2, 34);

    $('#gdout').innerHTML =
      `a = <b>${S.a}</b> · b = <b>${S.b}</b> · 돌린 칸 <b>${S.t}</b><br>`
      + (back
        ? `<b style="color:#0E9384">${S.t}칸 만에 두 빨간 점이 함께 제자리</b> — 최소공배수 lcm(${S.a},${S.b}) = <b>${l}</b><br>`
        : `빨간 점 두 개가 <b>동시에</b> 제자리로 오는 칸 수를 찾으세요. (예상해 보고 돌리세요)<br>`)
      + `최대공약수 g = <b>${g}</b> · a×b = ${S.a*S.b} · g×lcm = ${g*l}
         <span style="color:#6B7280">← 두 값을 견줘 보세요</span>`;
  }
  $('#gdStep').onclick=()=>{ stop(); S.t++; draw(); };
  $('#gdRun').onclick=()=>{ stop();
    const g=gcd(S.a,S.b), l=S.a*S.b/g;
    S.timer=setInterval(()=>{
      if(!cv.isConnected){ stop(); return; }          // 다음 실험실이 열려 이 화면이 지워졌으면 멈춘다
      S.t++; draw();
      if(S.t%l===0) stop(); }, 90); };
  $('#gdRst').onclick=()=>{ stop(); S.t=0; draw(); };
  dragOn(cv,{
    hit:p=>{
      if(Math.hypot(p.x-CA.x, p.y-(CA.y+rA()+16))<18) return 'a';
      if(Math.hypot(p.x-CB.x, p.y-(CB.y+rB()+16))<18) return 'b';
      return null;
    },
    move:(h,p)=>{
      const C=h==='a'?CA:CB;
      const v=Math.max(4,Math.min(36,Math.round((Math.hypot(p.x-C.x,p.y-C.y)-46)/2.1)));
      stop(); S.t=0;
      if(h==='a') S.a=v; else S.b=v;
      draw();
    }
  });
  draw();

  inquiry(root,{ id:'gcd', title:'톱니바퀴는 언제 다시 만날까 — 최대공약수와 최소공배수',
    q:['a 와 b 를 여러 쌍으로 바꾸고, 매번 돌려서 다시 만나는 칸 수를 확인한 뒤 「지금 값 기록」을 눌러 8줄 이상 만드세요.',
       'a × b 열과 (최대공약수 × 최소공배수) 열을 비교해 무엇이 같은지 찾으세요.',
       '왜 그렇게 되는지 <b>소인수분해</b>를 써서 손으로 설명하세요. a 와 b 가 서로소일 때 최소공배수가 무엇이 되는지도 함께 적으세요.'],
    cols:['a','b','최대공약수','최소공배수','a × b','최대공약수 × 최소공배수'],
    hint:'힌트 — 소인수분해에서 최대공약수는 <b>공통인 것을 낮은 지수로</b>, 최소공배수는 <b>모든 것을 높은 지수로</b> 모읍니다. 두 곱이 왜 a × b 가 되는지 지수로 따져 보세요.',
    read:()=>{ const g=gcd(S.a,S.b), l=S.a*S.b/g;
      return [S.a,S.b,g,l,S.a*S.b,g*l]; } });
}

/* ---------- LAB 36 삼각형을 작도하고 그 과정을 설명하기 [9수03-03] ----------
   작도는 「단계를 고르는」 것이 아니라 「컴퍼스를 벌려 긋는」 행위다.
   ① 밑변 a 의 오른쪽 끝을 끌어 길이를 정하고
   ② 왼쪽 끝에서 컴퍼스를 벌려(손잡이를 끌어 반지름 b) 호를 긋고
   ③ 오른쪽 끝에서도 벌려(반지름 c) 호를 긋는다 — 두 호가 만나면 꼭짓점이 태어난다.
   만나지 않으면 삼각형이 없다. 그 경계가 삼각부등식이다. */
function constructDemo(root){
  root.innerHTML=`<div class="row"><div class="col">
      <canvas id="cn1" width="380" height="300"></canvas>
      <div class="note" style="margin-top:8px"><b>세 손잡이를 끌어</b> 밑변 a 와 두 컴퍼스의
      반지름 b·c 를 정하세요. 두 호가 만나야 삼각형이 됩니다.</div>
    </div>
    <div class="col">
      <div class="out" id="cnout"></div>
      <div class="note" style="margin-top:12px">호와 호가 만나는 점은 어떤 특별한 자격을 갖고 있을까요? 호가 만나지 못하면 무슨 뜻일까요?</div>
    </div></div>`;
  const cv=$('#cn1'),ctx=cv.getContext('2d'),W=380,H=300;
  const A={x:80,y:212};
  const S={ a:140, b:110, c:90 };
  const Bp=()=>({x:A.x+S.a, y:A.y});

  function apex(){
    const B=Bp();
    const x=(S.b*S.b - S.c*S.c + S.a*S.a)/(2*S.a);
    const h2=S.b*S.b - x*x;
    if(h2<=0) return null;
    return {x:A.x+x, y:A.y-Math.sqrt(h2)};
  }
  function draw(){
    const B=Bp(), P=apex();
    const mx=Math.max(S.a,S.b,S.c), rest=S.a+S.b+S.c-mx, ok=mx<rest;
    ctx.clearRect(0,0,W,H); ctx.fillStyle='#fff'; ctx.fillRect(0,0,W,H);
    // 두 호 (위쪽 반원만)
    ctx.strokeStyle='#93B4F7'; ctx.lineWidth=1.8; ctx.setLineDash([6,4]);
    ctx.beginPath(); ctx.arc(A.x,A.y,S.b,Math.PI,0); ctx.stroke();
    ctx.strokeStyle='#8AD4C8';
    ctx.beginPath(); ctx.arc(B.x,B.y,S.c,Math.PI,0); ctx.stroke();
    ctx.setLineDash([]);
    // 밑변
    ctx.strokeStyle='#111827'; ctx.lineWidth=2.6;
    ctx.beginPath(); ctx.moveTo(A.x,A.y); ctx.lineTo(B.x,B.y); ctx.stroke();
    // 삼각형 완성
    if(P){
      ctx.fillStyle='rgba(37,99,235,.10)';
      ctx.beginPath(); ctx.moveTo(A.x,A.y); ctx.lineTo(B.x,B.y); ctx.lineTo(P.x,P.y);
      ctx.closePath(); ctx.fill();
      ctx.strokeStyle='#2563EB'; ctx.lineWidth=2.2; ctx.stroke();
      ctx.fillStyle='#BE123C';
      ctx.beginPath(); ctx.arc(P.x,P.y,5,0,7); ctx.fill();
      ctx.fillStyle='#111827'; ctx.font='bold 12px sans-serif'; ctx.textAlign='center';
      ctx.fillText('C — 두 호가 만난 점', P.x, P.y-12);
    } else {
      ctx.fillStyle='#BE123C'; ctx.font='bold 13px sans-serif'; ctx.textAlign='center';
      ctx.fillText(mx>=rest ? '두 호가 만나지 않습니다 — 이런 삼각형은 없습니다' : '', W/2, 60);
    }
    // 라벨과 손잡이
    ctx.fillStyle='#111827'; ctx.font='bold 12px sans-serif'; ctx.textAlign='center';
    ctx.fillText('A', A.x-14, A.y+16); ctx.fillText('B', B.x+14, B.y+16);
    ctx.fillText('a = '+S.a, (A.x+B.x)/2, A.y+22);
    handle(ctx, B.x, B.y, '#111827','');                                     // a: B 를 끈다
    const hb={x:A.x+S.b*Math.cos(-Math.PI/3), y:A.y+S.b*Math.sin(-Math.PI/3)};
    const hc={x:B.x+S.c*Math.cos(-2*Math.PI/3), y:B.y+S.c*Math.sin(-2*Math.PI/3)};
    handle(ctx, hb.x, hb.y, '#2563EB','b = '+S.b);
    handle(ctx, hc.x, hc.y, '#0E9384','c = '+S.c);

    $('#cnout').innerHTML =
      `a = <b>${S.a}</b> · b = <b>${S.b}</b> · c = <b>${S.c}</b><br>`
      + `가장 긴 변 <b>${mx}</b> vs 나머지 두 변의 합 <b>${rest}</b><br>`
      + (ok
        ? `<b style="color:#0E9384">${mx} &lt; ${rest} — 삼각형이 됩니다.</b> 그리고 이 세 변으로는 <b>이 모양 하나뿐</b>입니다 (SSS).`
        : `<b style="color:#BE123C">${mx} ≥ ${rest} — 안 됩니다.</b> 두 호의 반지름을 합쳐도 거리 a 에 못 미치거나, 한쪽이 너무 깁니다.`);
  }
  dragOn(cv,{
    hit:p=>{
      const B=Bp();
      const hb={x:A.x+S.b*Math.cos(-Math.PI/3), y:A.y+S.b*Math.sin(-Math.PI/3)};
      const hc={x:B.x+S.c*Math.cos(-2*Math.PI/3), y:B.y+S.c*Math.sin(-2*Math.PI/3)};
      if(Math.hypot(p.x-hb.x,p.y-hb.y)<18) return 'b';
      if(Math.hypot(p.x-hc.x,p.y-hc.y)<18) return 'c';
      if(Math.hypot(p.x-B.x,p.y-B.y)<18) return 'a';
      return null;
    },
    move:(h,p)=>{
      if(h==='a') S.a=Math.max(60,Math.min(240,Math.round(p.x-A.x)));
      else if(h==='b') S.b=Math.max(30,Math.min(200,Math.round(Math.hypot(p.x-A.x,p.y-A.y))));
      else { const B=Bp(); S.c=Math.max(30,Math.min(200,Math.round(Math.hypot(p.x-B.x,p.y-B.y)))); }
      draw();
    }
  });
  draw();

  inquiry(root,{ id:'cn', title:'삼각형을 작도하고 그 과정을 설명하기',
    q:['세 손잡이를 끌어 여러 (a, b, c) 를 만들며 기록하세요. <b>되는 경우와 안 되는 경우를 모두</b> 담으세요.',
       '삼각형이 되는 줄과 안 되는 줄을 갈라 놓고, 세 변 사이에 어떤 부등식이 성립하는지 찾으세요.',
       '찾은 조건을 부등식으로 쓰고, <b>왜 두 호가 만나지 못하는지</b> 그림과 함께 손으로 설명하세요.'],
    cols:['a','b','c','가장 긴 변','나머지 두 변의 합','삼각형?'],
    hint:'힌트 — 원은 “그 점에서 거리가 같은 점들”의 모임입니다. 두 원이 만나려면 중심 사이의 거리가 두 반지름과 어떤 관계여야 할까요?',
    read:()=>{ const mx=Math.max(S.a,S.b,S.c), rest=S.a+S.b+S.c-mx;
      return [S.a,S.b,S.c,mx,rest, mx<rest?'된다':'안 된다']; } });
}

/* ---------- LAB 37 바닥 타일은 왜 그 모양들뿐일까 [9수03-05] ----------
   「360 ÷ 한 내각이 자연수인가」를 표로 보는 대신, 학생이 타일공이 되어
   한 점 둘레에 정다각형을 한 장씩 직접 붙인다. 「한 장 붙이기」를 누를 때마다
   내각만큼 차오르는 게이지가 돌고, 마지막 장에서 딱 맞으면 초록, 빈틈이 남거나
   겹치면 빨강이다 — 정오각형의 108°가 세 장 324°에서 멈추는 순간이 눈에 남는다. */
function polyDemo(root){
  root.innerHTML=`<div class="row"><div class="col">
      <canvas id="pg1" width="380" height="300"></canvas>
      <div class="ctl" style="display:flex;gap:6px;flex-wrap:wrap;margin-top:8px">
        <button class="b t" id="pgPut">한 장 붙이기</button>
        <button class="b g sm" id="pgRst">바닥 비우기</button>
      </div>
    </div>
    <div class="col">
      <label class="ctl">타일 모양 (정다각형)
        <select id="pgN" style="width:100%;padding:7px 9px;border:1px solid #E5E7EB;border-radius:8px;font:inherit">
          <option value="3">정삼각형 — 한 내각 60°</option>
          <option value="4">정사각형 — 90°</option>
          <option value="5">정오각형 — 108°</option>
          <option value="6" selected>정육각형 — 120°</option>
          <option value="8">정팔각형 — 135°</option>
          <option value="12">정십이각형 — 150°</option>
        </select></label>
      <div class="out" id="pgout"></div>
      <div class="note" style="margin-top:12px">채워지는 도형과 안 되는 도형 — 갈림길은 어디에 있을까요? 한 점에 모인 각들을 세어 보세요.</div>
    </div></div>`;
  const cv=$('#pg1'),ctx=cv.getContext('2d'),W=380,H=300;
  const C={x:190,y:172}, R=86;
  const S={ k:0 };                                  // 붙인 장 수

  const inner=()=>{ const n=+$('#pgN').value; return 180*(n-2)/n; };
  function tile(a0,a1,col,alpha){
    // 꼭짓점 C 를 공유하는 정n각형 한 장 — 두 변이 a0·a1 방향
    const n=+$('#pgN').value, side=R;
    ctx.globalAlpha=alpha; ctx.fillStyle=col;
    ctx.beginPath(); ctx.moveTo(C.x,C.y);
    // 정다각형을 C 에서 시작해 그린다: 방향 a0 으로 한 변, 그 뒤 외각씩 꺾으며
    let x=C.x, y=C.y, dir=a0;
    const ext=Math.PI-inner()*Math.PI/180;          // 외각
    for(let i=0;i<n;i++){
      x+=side*Math.cos(dir); y+=side*Math.sin(dir);
      ctx.lineTo(x,y); dir+=ext;
    }
    ctx.closePath(); ctx.fill(); ctx.globalAlpha=1;
    ctx.strokeStyle=col; ctx.lineWidth=1.6; ctx.stroke();
  }
  function draw(){
    const n=+$('#pgN').value, ia=inner();
    const used=S.k*ia, left=360-used;
    ctx.clearRect(0,0,W,H); ctx.fillStyle='#fff'; ctx.fillRect(0,0,W,H);
    // 붙인 타일들
    const cols=['#2563EB','#0E9384','#B45309','#7C3AED','#0891B2','#DB2777'];
    for(let i=0;i<S.k;i++){
      tile(-i*ia*Math.PI/180, 0, cols[i%cols.length], .16);
    }
    // 중심점과 게이지
    ctx.fillStyle='#111827'; ctx.beginPath(); ctx.arc(C.x,C.y,4,0,7); ctx.fill();
    ctx.strokeStyle='#E5E7EB'; ctx.lineWidth=7;
    ctx.beginPath(); ctx.arc(C.x,C.y,22,0,7); ctx.stroke();
    ctx.strokeStyle = left===0?'#0E9384':(left<0?'#BE123C':'#B45309');
    ctx.beginPath(); ctx.arc(C.x,C.y,22,0,-Math.min(360,used)*Math.PI/180,true); ctx.stroke();
    ctx.fillStyle='#111827'; ctx.font='bold 15px sans-serif'; ctx.textAlign='center';
    ctx.fillText(used.toFixed(0)+'°', C.x, C.y-34);

    const fit=360/ia, exact=Math.abs(Math.round(fit)-fit)<1e-9;
    $('#pgout').innerHTML =
      `정${n}각형 · 한 내각 <b>${ia.toFixed(0)}°</b> · 붙인 장수 <b>${S.k}장</b> → 합 <b>${used.toFixed(0)}°</b><br>`
      + (left>ia-1e-9
        ? `아직 ${left.toFixed(0)}° 남았습니다 — 더 붙일 수 있습니다.`
        : left>1e-9
        ? `<b style="color:#BE123C">빈틈 ${left.toFixed(0)}°</b> — 한 장을 더 붙이면 ${(ia-left).toFixed(0)}° 겹칩니다. <b>이 모양으로는 못 채웁니다.</b>`
        : Math.abs(left)<1e-9
        ? `<b style="color:#0E9384">딱 360° — 빈틈도 겹침도 없습니다!</b> 360 ÷ ${ia.toFixed(0)} = ${fit.toFixed(0)}장.`
        : `<b style="color:#BE123C">${(-left).toFixed(0)}° 겹쳤습니다.</b>`)
      + `<br><span style="color:#6B7280;font-size:12.5px">360 ÷ ${ia.toFixed(0)} = ${fit.toFixed(3)} —
         ${exact?'자연수라서 됩니다':'자연수가 아니라서 안 됩니다'}</span>`;
  }
  $('#pgPut').onclick=()=>{ const ia=inner();
    if(S.k*ia>=360) return; S.k++; draw(); };
  $('#pgRst').onclick=()=>{ S.k=0; draw(); };
  $('#pgN').onchange=()=>{ S.k=0; draw(); };
  draw();

  inquiry(root,{ id:'pg', title:'바닥 타일은 왜 그 모양들뿐일까 — 다각형의 성질',
    q:['여섯 가지 타일을 모두 골라 끝까지 붙여 보고, 매번 기록하세요.',
       '「360 ÷ 한 내각」 열에서 <b>나누어떨어지는 n</b> 이 무엇인지 찾고, 몇 개뿐인지 세세요.',
       '정삼각형·정사각형·정육각형만 되는 이유를 <b>한 내각의 크기</b>로 손으로 설명하세요. 외각의 합이 n 과 무관하게 360°인 것도 함께 설명하세요.'],
    cols:['n','내각의 합','한 내각','360 ÷ 한 내각','한 종류로 채우기'],
    hint:'힌트 — n 이 커지면 한 내각은 어떻게 변하나요? 한 내각이 120°를 넘으면 한 점에 세 개를 붙일 수 없습니다.',
    read:()=>{ const n=+$('#pgN').value, ia=180*(n-2)/n;
      return [n, 180*(n-2)+'°', ia.toFixed(1)+'°', (360/ia).toFixed(3),
              Number.isInteger(360/ia)?'된다':'안 된다']; } });
}

/* ---------- LAB 38 3D 프린터는 어떻게 모양을 만들까 [9수03-07] ----------
   단면이 요점이면 자르는 평면을 학생이 직접 잡아야 한다.
   ① 입체를 손으로 끌어 돌리고 (마우스·손가락 궤도 회전 — 진짜 3D 투영)
   ② 자르는 평면(빨간 손잡이)을 위아래로 끌면 단면이 오른쪽에 실시간으로 그려진다.
   「한 층씩 쌓기」는 3D 프린터처럼 단면을 아래부터 쌓아 입체를 재구성한다. */
function solidDemo(root){
  root.innerHTML=`<div class="row"><div class="col">
      <canvas id="sd1" width="380" height="300"></canvas>
      <div class="note" style="margin-top:8px"><b>입체를 끌어 돌리고</b>, 오른쪽
      <b>빨간 손잡이</b>를 위아래로 끌어 자르는 높이를 정하세요.</div>
    </div>
    <div class="col">
      <label class="ctl">무엇을 볼까요
        <select id="sdK" style="width:100%;padding:7px 9px;border:1px solid #E5E7EB;border-radius:8px;font:inherit">
          <option value="tetra">정사면체 (면 4)</option>
          <option value="hexa">정육면체 (면 6)</option>
          <option value="octa">정팔면체 (면 8)</option>
          <option value="cone">원뿔 — 회전체</option>
          <option value="cyl">원기둥 — 회전체</option>
          <option value="sphere">구 — 회전체</option></select></label>
      <div class="ctl" style="display:flex;gap:6px;flex-wrap:wrap;margin-top:8px">
        <button class="b t sm" id="sdPrint">한 층씩 쌓기 (3D 프린터)</button>
      </div>
      <div class="out" id="sdout"></div>
      <div class="note" style="margin-top:12px">꼭짓점·모서리·면의 수를 여러 입체에서 세어 보세요 — 세 수 사이에 숨은 약속이 있을까요? 단면도 잘라 보세요.</div>
    </div></div>`;
  const cv=$('#sd1'),ctx=cv.getContext('2d'),W=380,H=300;
  const S={ yaw:0.6, pitch:0.42, t:0.5, print:null, layer:0 };
  const CX=150, CY=158, SC=92;

  // 꼭짓점·모서리 (다면체) — 반지름 1 로 정규화
  const P3={
    tetra:{v:[[1,1,1],[1,-1,-1],[-1,1,-1],[-1,-1,1]].map(v=>v.map(x=>x/Math.sqrt(3))),
           e:[[0,1],[0,2],[0,3],[1,2],[1,3],[2,3]], V:4,E:6,F:4},
    hexa:{v:[[-1,-1,-1],[1,-1,-1],[1,1,-1],[-1,1,-1],[-1,-1,1],[1,-1,1],[1,1,1],[-1,1,1]].map(v=>v.map(x=>x/Math.sqrt(3))),
          e:[[0,1],[1,2],[2,3],[3,0],[4,5],[5,6],[6,7],[7,4],[0,4],[1,5],[2,6],[3,7]], V:8,E:12,F:6},
    octa:{v:[[1,0,0],[-1,0,0],[0,1,0],[0,-1,0],[0,0,1],[0,0,-1]],
          e:[[0,2],[0,3],[0,4],[0,5],[1,2],[1,3],[1,4],[1,5],[2,4],[2,5],[3,4],[3,5]], V:6,E:12,F:8}
  };
  const ROT={ cone:1, cyl:1, sphere:1 };
  function proj(p){
    const cy=Math.cos(S.yaw), sy=Math.sin(S.yaw), cp=Math.cos(S.pitch), sp=Math.sin(S.pitch);
    const x=p[0]*cy+p[2]*sy, z=-p[0]*sy+p[2]*cy;
    const y=p[1]*cp - z*sp,  zz=p[1]*sp + z*cp;
    return {px:CX+SC*x, py:CY-SC*y, z:zz};
  }
  // 높이 t(0~1) 에서의 단면 반지름 비율 r 과 모양 이름
  function cut(k,t){
    if(k==='cone')   return {shape:'원', r:1-t};
    if(k==='cyl')    return {shape:'원', r:1};
    if(k==='sphere') return {shape:'원', r:Math.sqrt(Math.max(0,1-Math.pow(2*t-1,2)))};
    if(k==='tetra')  return {shape:'삼각형', r:1-t};
    if(k==='hexa')   return {shape:'정사각형', r:1};
    return {shape:t<0.5?'삼각형→':'→삼각형', r:1-Math.abs(2*t-1)};
  }
  function draw(){
    const k=$('#sdK').value, isRot=!!ROT[k], t=S.t;
    ctx.clearRect(0,0,W,H); ctx.fillStyle='#fff'; ctx.fillRect(0,0,W,H);
    const yTop=CY-SC, yBot=CY+SC, yCut=yBot-(yBot-yTop)*t;
    // 프린트 모드 — 아래부터 layer 까지만 그린다
    const upto = S.print!==null ? S.layer/24 : 1;
    if(isRot){
      // 회전체 — 윤곽 + 가로 단면 타원들
      ctx.strokeStyle='#9CA3AF'; ctx.lineWidth=1.6;
      for(let i=0;i<=24;i++){
        const tt=i/24; if(tt>upto) break;
        const r=cut(k,tt).r*SC*0.9, y=yBot-(yBot-yTop)*tt;
        ctx.strokeStyle = Math.abs(tt-t)<0.021 ? '#BE123C' : '#D7DCE3';
        ctx.lineWidth = Math.abs(tt-t)<0.021 ? 2.4 : 1;
        ctx.beginPath(); ctx.ellipse(CX,y,r,r*0.30,0,0,7); ctx.stroke();
      }
    } else {
      const D=P3[k];
      const pts=D.v.map(proj);
      // 잘린 자리 표시선
      D.e.forEach(ed=>{
        const a=pts[ed[0]], b=pts[ed[1]];
        ctx.strokeStyle='#374151'; ctx.lineWidth=1.8; ctx.globalAlpha=(a.z+b.z>0)?1:.35;
        ctx.beginPath(); ctx.moveTo(a.px,a.py); ctx.lineTo(b.px,b.py); ctx.stroke();
        ctx.globalAlpha=1;
      });
      pts.forEach(p=>{ ctx.fillStyle='#111827';
        ctx.beginPath(); ctx.arc(p.px,p.py,3,0,7); ctx.fill(); });
    }
    // 자르는 평면(수평선) + 손잡이
    ctx.strokeStyle='#BE123C'; ctx.setLineDash([6,4]); ctx.lineWidth=1.8;
    ctx.beginPath(); ctx.moveTo(30,yCut); ctx.lineTo(270,yCut); ctx.stroke(); ctx.setLineDash([]);
    handle(ctx, 270, yCut, '#BE123C', (t*100).toFixed(0)+'%');
    // 오른쪽 — 단면 미리보기
    const c=cut(k,t);
    ctx.strokeStyle='#E5E7EB'; ctx.strokeRect(292,84,76,76);
    ctx.fillStyle='#6B7280'; ctx.font='10.5px sans-serif'; ctx.textAlign='center';
    ctx.fillText('이 높이의 단면', 330, 76);
    ctx.strokeStyle='#2563EB'; ctx.fillStyle='rgba(37,99,235,.14)'; ctx.lineWidth=2;
    const cr=Math.max(2,c.r*32);
    ctx.beginPath();
    if(isRot){ ctx.arc(330,122,cr,0,7); }
    else if(k==='hexa'){ ctx.rect(330-cr,122-cr,2*cr,2*cr); }
    else { ctx.moveTo(330,122-cr); ctx.lineTo(330-cr*0.87,122+cr*0.5); ctx.lineTo(330+cr*0.87,122+cr*0.5); ctx.closePath(); }
    ctx.fill(); ctx.stroke();
    ctx.fillStyle='#374151'; ctx.font='bold 11px sans-serif';
    ctx.fillText(c.shape, 330, 178);

    const D=P3[k];
    $('#sdout').innerHTML = isRot
      ? `<b>${{cone:'원뿔',cyl:'원기둥',sphere:'구'}[k]}</b> — 회전체<br>축에 수직인 단면은 <b>언제나 원</b>,
         반지름 비율 <b>${(c.r*100).toFixed(0)}%</b><br>
         <span style="color:#6B7280;font-size:12.5px">돌려 봐도 축 둘레로는 같은 모양 — 그것이 회전체의 정의입니다.</span>`
      : `<b>${{tetra:'정사면체',hexa:'정육면체',octa:'정팔면체'}[k]}</b> — 다면체<br>
         v = ${D.V} · e = ${D.E} · f = ${D.F} → <b>v − e + f = ${D.V-D.E+D.F}</b><br>
         <span style="color:#6B7280;font-size:12.5px">돌려 보며 꼭짓점·모서리를 직접 세어 확인해 보세요.</span>`;
  }
  dragOn(cv,{
    hit:p=>{
      const yTop=CY-SC, yBot=CY+SC, yCut=yBot-(yBot-yTop)*S.t;
      if(Math.hypot(p.x-270,p.y-yCut)<20) return 'cut';
      if(p.x<280) return 'rot';
      return null;
    },
    move:(h,p)=>{
      if(h==='cut'){
        const yTop=CY-SC, yBot=CY+SC;
        S.t=Math.max(0,Math.min(1,(yBot-p.y)/(yBot-yTop)));
      } else {
        if(S._last){ S.yaw+=(p.x-S._last.x)*0.012; S.pitch=Math.max(-1.2,Math.min(1.2,S.pitch+(p.y-S._last.y)*0.012)); }
        S._last=p;
      }
      draw();
    },
    up:()=>{ S._last=null; }
  });
  $('#sdK').onchange=()=>{ if(S.print){clearInterval(S.print);S.print=null;} draw(); };
  $('#sdPrint').onclick=()=>{
    if(S.print){ clearInterval(S.print); S.print=null; draw(); return; }
    S.layer=0;
    S.print=setInterval(()=>{
      if(!cv.isConnected){ clearInterval(S.print); S.print=null; return; }
      S.layer++; draw();
      if(S.layer>=24){ clearInterval(S.print); S.print=null; }
    },120);
  };
  draw();

  inquiry(root,{ id:'sd', title:'3D 프린터는 어떻게 모양을 만들까 — 다면체와 회전체',
    q:['여섯 입체를 모두 돌려 보고 잘라 보며 기록하세요.',
       '다면체 줄에서 <b>v − e + f</b> 열을 보세요. 어떤 값으로 일정한지 찾으세요.',
       '회전체의 단면이 왜 <b>늘 원</b>인지 회전의 뜻으로 손으로 설명하고, 구의 단면 반지름이 높이에 따라 어떻게 변하는지도 적으세요.'],
    cols:['입체','종류','v','e','f','v − e + f','단면'],
    hint:'힌트 — 회전체는 「축 둘레로 한 바퀴 돌린 것」입니다. 축에 수직으로 자르면 왜 원이 될 수밖에 없나요?',
    read:()=>{ const k=$('#sdK').value, isRot=!!ROT[k], D=P3[k], c=cut(k,S.t);
      const nm={tetra:'정사면체',hexa:'정육면체',octa:'정팔면체',cone:'원뿔',cyl:'원기둥',sphere:'구'}[k];
      return [nm, isRot?'회전체':'다면체', isRot?'—':D.V, isRot?'—':D.E, isRot?'—':D.F,
              isRot?'—':(D.V-D.E+D.F), c.shape]; } });
}

/* ---------- LAB 39 택배 상자는 왜 그 크기일까 [9수03-08] ----------
   부피를 8000cm³ 로 못박아 두고, 상자의 가로·세로 손잡이를 직접 끈다.
   높이는 c = V/(a·b) 로 저절로 정해진다 — 조건(부피 고정)이 학생 대신 계산한다.
   겉넓이 게이지가 실시간으로 오르내리고, 지금까지의 최저 기록이 남는다.
   이리저리 끌다 보면 정육면체(20·20·20)에서 2400cm² 로 바닥을 친다. */
function boxDemo(root){
  root.innerHTML=`<div class="row"><div class="col">
      <canvas id="bx1" width="380" height="300"></canvas>
      <div class="note" style="margin-top:8px"><b>가로(파랑)·세로(초록) 손잡이를 끌면</b>
      부피 8,000cm³ 를 지키도록 <b>높이가 저절로</b> 정해집니다. 종이가 가장 적게 드는
      모양을 찾아 보세요.</div>
    </div>
    <div class="col">
      <div class="ctl" style="display:flex;gap:6px;flex-wrap:wrap">
        <button class="b g sm" id="bxFlat">피자 상자 (40×40×5)</button>
        <button class="b g sm" id="bxLong">우산 상자 (8×10×100)</button>
        <button class="b g sm" id="bxCube">정육면체 (20×20×20)</button>
      </div>
      <div class="out" id="bxout"></div>
      <div class="note" style="margin-top:12px">같은 부피인데 종이(겉넓이)가 덜 드는 모양이 있을까요? 극단적인 모양들과 비교해 보세요.</div>
    </div></div>`;
  const cv=$('#bx1'),ctx=cv.getContext('2d'),W=380,H=300;
  const V=8000;
  const S={ a:30, b:30, best:Infinity };
  const cOf=()=>V/(S.a*S.b);

  // 등각 투영 — 픽셀 배율
  const K=3.4, O={x:150,y:196};
  const iso=(x,y,z)=>({ px:O.x + (x-y)*0.86*K, py:O.y - z*K - (x+y)*0.5*K*0.4 });
  function draw(){
    const a=S.a, b=S.b, c=cOf();
    const Sf=2*(a*b+b*c+c*a);
    if(Sf<S.best) S.best=Sf;
    ctx.clearRect(0,0,W,H); ctx.fillStyle='#fff'; ctx.fillRect(0,0,W,H);
    // 상자 (등각)
    const p={
      A:iso(0,0,0), B:iso(a,0,0), C:iso(a,b,0), D:iso(0,b,0),
      E:iso(0,0,c), F:iso(a,0,c), G:iso(a,b,c), Hh:iso(0,b,c) };
    const face=(q,col,al)=>{ ctx.globalAlpha=al; ctx.fillStyle=col;
      ctx.beginPath(); ctx.moveTo(q[0].px,q[0].py);
      q.slice(1).forEach(v=>ctx.lineTo(v.px,v.py)); ctx.closePath(); ctx.fill();
      ctx.globalAlpha=1; ctx.strokeStyle='#374151'; ctx.lineWidth=1.4; ctx.stroke(); };
    face([p.E,p.F,p.G,p.Hh],'#BFD3F5',.85);       // 윗면
    face([p.B,p.C,p.G,p.F],'#9DB9EE',.85);        // 오른면
    face([p.A,p.B,p.F,p.E],'#D8E4F9',.85);        // 앞면
    // 치수 라벨
    ctx.fillStyle='#111827'; ctx.font='bold 11.5px sans-serif'; ctx.textAlign='center';
    ctx.fillText('가로 '+a.toFixed(0), (p.A.px+p.B.px)/2, (p.A.py+p.B.py)/2+16);
    ctx.fillText('세로 '+b.toFixed(0), (p.B.px+p.C.px)/2+26, (p.B.py+p.C.py)/2+8);
    ctx.fillText('높이 '+c.toFixed(1), p.E.px-30, (p.A.py+p.E.py)/2);
    // 손잡이 — 가로 방향 모서리 끝(B), 세로 방향 모서리 끝(C)
    handle(ctx, p.B.px, p.B.py, '#2563EB','');
    handle(ctx, p.C.px, p.C.py, '#0E9384','');
    // 겉넓이 게이지
    const gx=28, gw=W-56, lo=2000, hi=9000;
    const gv=v=>gx+gw*Math.max(0,Math.min(1,(v-lo)/(hi-lo)));
    ctx.fillStyle='#F3F4F6'; ctx.fillRect(gx,24,gw,14);
    ctx.fillStyle=Sf<S.best+1?'#0E9384':'#2563EB';
    ctx.fillRect(gx,24,gv(Sf)-gx,14);
    ctx.strokeStyle='#BE123C'; ctx.setLineDash([3,3]);
    ctx.beginPath(); ctx.moveTo(gv(2400),18); ctx.lineTo(gv(2400),44); ctx.stroke(); ctx.setLineDash([]);
    ctx.fillStyle='#374151'; ctx.font='11px sans-serif'; ctx.textAlign='left';
    ctx.fillText('겉넓이 '+Sf.toFixed(0)+'cm²  (지금까지 최저 '+S.best.toFixed(0)+')', gx, 56);
    $('#bxout').innerHTML =
      `가로 <b>${a.toFixed(0)}</b> × 세로 <b>${b.toFixed(0)}</b> × 높이 <b>${c.toFixed(1)}</b> cm<br>`
      + `부피 = <b>${(a*b*c).toFixed(0)} cm³</b> (고정) · 겉넓이 = <b>${Sf.toFixed(0)} cm²</b><br>`
      + (Math.abs(Sf-2400)<20
        ? `<b style="color:#0E9384">바닥에 닿았습니다 — 정육면체 근처가 최소(2,400cm²)입니다.</b>`
        : `<span style="color:#6B7280;font-size:12.5px">빨간 금(2,400)까지 내려 보세요. 어떤 모양에서 닿나요?</span>`);
  }
  dragOn(cv,{
    hit:p=>{
      const a=S.a,b=S.b,c=cOf();
      const B=iso(a,0,0), C=iso(a,b,0);
      if(Math.hypot(p.x-B.px,p.y-B.py)<18) return 'a';
      if(Math.hypot(p.x-C.px,p.y-C.py)<18) return 'b';
      return null;
    },
    move:(h,p)=>{
      if(h==='a'){ // B 는 a 에 따라 오른쪽 위로 — x 픽셀에서 역산
        const v=(p.x-O.x)/(0.86*K) + S.b*0;  // 근사 역산: a-y 성분만
        S.a=Math.max(5,Math.min(60, Math.round((p.x-O.x)/(0.86*K))));
      } else {
        // C=iso(a,b,0): px = O.x+(a−b)·0.86K → b = a − (px−O.x)/(0.86K)
        S.b=Math.max(5,Math.min(60, Math.round(S.a-(p.x-O.x)/(0.86*K))));
      }
      // 높이가 5~120 범위를 벗어나지 않게
      const c=V/(S.a*S.b);
      if(c<3){ } else if(c>120){ }
      draw();
    }
  });
  $('#bxFlat').onclick=()=>{ S.a=40; S.b=40; draw(); };
  $('#bxLong').onclick=()=>{ S.a=8;  S.b=10; draw(); };
  $('#bxCube').onclick=()=>{ S.a=20; S.b=20; draw(); };
  draw();

  inquiry(root,{ id:'bx', title:'택배 상자는 왜 그 크기일까 — 겉넓이와 부피',
    q:['손잡이를 끌어 여러 모양을 만들며 기록하세요 (8줄 이상). 아주 납작한 것, 아주 길쭉한 것, 정육면체 근처를 모두 담으세요.',
       '부피 열이 전부 같은데 겉넓이 열은 다릅니다. <b>겉넓이가 가장 작은 모양</b>이 무엇인지 찾으세요.',
       '왜 정육면체에 가까울수록 종이가 적게 드는지 손으로 설명하고, 실제 택배 상자가 정육면체가 아닌 이유를 두 가지 적으세요.'],
    cols:['가로','세로','높이','부피','겉넓이','정육면체보다 몇 % 더 드나'],
    hint:'힌트 — 같은 둘레의 직사각형 중 넓이가 가장 큰 것은 정사각형입니다. 그 3차원판이 이 실험입니다.',
    read:()=>{ const a=S.a,b=S.b,c=cOf();
      const Vv=a*b*c,Sf=2*(a*b+b*c+c*a),cu=Math.cbrt(Vv);
      return [a.toFixed(0),b.toFixed(0),c.toFixed(1),Vv.toFixed(0),Sf.toFixed(0),'+'+((Sf/(6*cu*cu)-1)*100).toFixed(1)+'%']; } });
}

/* ---------- LAB 40 원자료를 잃지 않고 정리하려면 [9수04-02] ----------
   「줄기와 잎은 원자료를 남긴다」를 눈으로 보려면, 자료가 그림 속으로
   들어가는 순간을 직접 겪어야 한다. 흩어진 점수 카드를 하나씩 누르면
   그 수가 줄기-잎 그림의 제자리로 날아가 잎으로 박힌다. 다 넣은 뒤
   「히스토그램으로 뭉개기」를 누르면 잎의 숫자들이 익명의 막대로 바뀐다 —
   무엇을 얻고 무엇을 잃는지가 한 화면에서 갈린다. */
function stemDemo(root){
  root.innerHTML=`<div class="row"><div class="col">
      <canvas id="st1" width="380" height="300"></canvas>
      <div class="note" style="margin-top:8px"><b>점수 카드를 누르면</b> 줄기-잎 그림의
      제자리로 들어갑니다. 다 넣고 나서 뭉개 보세요.</div>
    </div>
    <div class="col">
      <div class="ctl" style="display:flex;gap:6px;flex-wrap:wrap">
        <button class="b t sm" id="stAll">남은 카드 모두 넣기</button>
        <button class="b g sm" id="stHist">히스토그램으로 뭉개기</button>
        <button class="b g sm" id="stRst">다시</button>
      </div>
      <div class="out" id="stout"></div>
      <div class="note" style="margin-top:12px">줄기와 잎 그림과 히스토그램 — 각자 무엇을 지키고 무엇을 포기하나요? 두 그림을 오가며 비교하세요.</div>
    </div></div>`;
  const cv=$('#st1'),ctx=cv.getContext('2d'),W=380,H=300;
  const DATA=[42,48,51,53,55,56,58,58,61,62,63,64,65,66,66,67,68,69,72,73,75,77,81,84,92];
  const S={ placed:[], mash:false, cards:[] };
  function reset(){
    S.placed=[]; S.mash=false;
    // 카드를 위쪽 영역에 흩뿌린다 (겹침 최소화 격자 + 흔들기)
    S.cards=DATA.map((v,i)=>({v,
      x:34+(i%8)*44+((i*7)%9)-4, y:26+Math.floor(i/8)*30+((i*5)%7)-3, in:false}));
    draw();
  }
  function draw(){
    ctx.clearRect(0,0,W,H); ctx.fillStyle='#fff'; ctx.fillRect(0,0,W,H);
    // 남은 카드
    S.cards.forEach(c=>{ if(c.in) return;
      ctx.fillStyle='#FFF8EB'; ctx.strokeStyle='#B45309'; ctx.lineWidth=1.4;
      ctx.beginPath(); ctx.roundRect(c.x-17,c.y-11,34,22,5); ctx.fill(); ctx.stroke();
      ctx.fillStyle='#111827'; ctx.font='bold 12.5px sans-serif'; ctx.textAlign='center';
      ctx.fillText(c.v, c.x, c.y+4);
    });
    // 줄기-잎 그림 (아래)
    const stems={}; S.placed.forEach(v=>{const s=Math.floor(v/10);(stems[s]=stems[s]||[]).push(v%10);});
    const keys=[4,5,6,7,8,9];
    const y0=140, lh=25;
    ctx.strokeStyle='#9CA3AF'; ctx.lineWidth=1.4;
    ctx.beginPath(); ctx.moveTo(70,y0-14); ctx.lineTo(70,y0+keys.length*lh-8); ctx.stroke();
    keys.forEach((s,i)=>{
      const y=y0+i*lh;
      ctx.fillStyle='#374151'; ctx.font='bold 13px sans-serif'; ctx.textAlign='right';
      ctx.fillText(s, 60, y);
      const leaves=(stems[s]||[]).slice().sort((a,b)=>a-b);
      if(S.mash){
        // 뭉개기 — 잎이 익명의 사각형이 된다
        ctx.fillStyle='rgba(37,99,235,.35)';
        leaves.forEach((_,j)=>ctx.fillRect(80+j*17, y-11, 13, 14));
      } else {
        ctx.fillStyle='#2563EB'; ctx.font='13px sans-serif'; ctx.textAlign='left';
        leaves.forEach((l,j)=>ctx.fillText(l, 80+j*17, y));
      }
    });
    ctx.fillStyle='#6B7280'; ctx.font='10.5px sans-serif'; ctx.textAlign='left';
    ctx.fillText('줄기 | 잎'+(S.mash?'  →  히스토그램 (값이 사라졌습니다)':''), 34, y0-24);

    const n=S.placed.length;
    let medTxt='—';
    if(n>=3){
      const sorted=S.placed.slice().sort((a,b)=>a-b);
      medTxt = n%2 ? String(sorted[(n-1)/2]) : ((sorted[n/2-1]+sorted[n/2])/2).toFixed(1);
    }
    $('#stout').innerHTML =
      `넣은 자료 <b>${n} / ${DATA.length}</b><br>`
      + (S.mash
        ? `<b style="color:#BE123C">뭉갠 뒤에는 중앙값을 정확히 셀 수 없습니다</b> — 몇 번째 칸에 있는지만 압니다.`
        : `지금까지의 중앙값: <b>${medTxt}</b> <span style="color:#6B7280">(잎을 작은 쪽부터 세면 직접 찾을 수 있습니다)</span>`)
      + `<br><span style="color:#6B7280;font-size:12.5px">${n===DATA.length?'다 넣었습니다 — 이제 「뭉개기」로 두 정리를 견줘 보세요.':'카드를 눌러 마저 넣으세요.'}</span>`;
  }
  cv.style.touchAction='none';
  cv.addEventListener('pointerdown',e=>{
    const r=cv.getBoundingClientRect();
    const x=(e.clientX-r.left)*W/r.width, y=(e.clientY-r.top)*H/r.height;
    for(const c of S.cards){ if(!c.in && Math.abs(x-c.x)<19 && Math.abs(y-c.y)<13){
      c.in=true; S.placed.push(c.v); draw(); return; } }
  });
  $('#stAll').onclick=()=>{ S.cards.forEach(c=>{ if(!c.in){ c.in=true; S.placed.push(c.v); } }); draw(); };
  $('#stHist').onclick=()=>{ S.mash=!S.mash; draw(); };
  $('#stRst').onclick=reset;
  reset();

  inquiry(root,{ id:'st', title:'원자료를 잃지 않고 정리하려면 — 줄기와 잎 그림',
    q:['카드를 전부 넣고, 뭉개기 전과 후를 오가며 기록하세요.',
       '「중앙값을 셀 수 있나」 열을 보세요. <b>어느 쪽 정리에서 무엇이 사라지는지</b> 찾으세요.',
       '자료가 25명일 때와 2,500명일 때 각각 어느 정리를 쓸지 고르고, <b>얻는 것과 잃는 것</b>으로 손으로 설명하세요.'],
    cols:['정리 방법','넣은 자료 수','원래 값이','중앙값을 셀 수 있나','한눈에 보이는 것'],
    hint:'힌트 — 정리란 언제나 무언가를 버리는 일입니다. 무엇을 버려도 되는지는 “무엇을 물었는가”가 정합니다.',
    read:()=>{ const n=S.placed.length;
      return [S.mash?'히스토그램':'줄기와 잎', n, S.mash?'사라진다':'남는다',
              S.mash?'셀 수 없다':'셀 수 있다', S.mash?'구간별 개수':'값 하나하나']; } });
}

/* ---------- LAB 41 크기가 다른 두 반을 어떻게 비교할까 [9수04-03] ----------
   불공정을 학생이 직접 만든다. 계급 칸을 누르면 그 반에 학생이 한 명 들어오고,
   B반 전체를 3배로 불리는 버튼이 있다. 도수로 보면 B반 막대가 압도하지만
   상대도수로 바꾸는 순간 두 반의 「모양」이 드러난다 — 그리고 상대도수 막대의
   합은 늘 1. 인원을 아무리 불려도 변하지 않는 그 합이 비교를 공정하게 만든다. */
function relfreqDemo(root){
  root.innerHTML=`<div class="row"><div class="col">
      <canvas id="rf1" width="380" height="300"></canvas>
      <div class="note" style="margin-top:8px"><b>칸을 누르면</b> 그 계급에 학생이 한 명
      들어옵니다 (위 = A반, 아래 = B반).</div>
    </div>
    <div class="col">
      <label class="ctl">무엇으로 볼까요
        <select id="rfM" style="width:100%;padding:7px 9px;border:1px solid #E5E7EB;border-radius:8px;font:inherit">
          <option value="cnt">도수 — 사람 수 그대로</option>
          <option value="rel">상대도수 — 전체에 대한 비율</option></select></label>
      <div class="ctl" style="display:flex;gap:6px;flex-wrap:wrap;margin-top:8px">
        <button class="b t sm" id="rfX3">B반 인원 ×3 으로 불리기</button>
        <button class="b g sm" id="rfRst">처음으로</button>
      </div>
      <div class="out" id="rfout"></div>
      <div class="note" style="margin-top:12px">인원이 다른 두 집단은 <b>도수로 비교할 수
      없습니다</b>. 상대도수(각 도수 ÷ 전체)는 <b>합이 언제나 1</b>이라, 인원과 상관없이
      분포의 <b>모양</b>끼리 견줄 수 있습니다.</div>
    </div></div>`;
  const cv=$('#rf1'),ctx=cv.getContext('2d'),W=380,H=300;
  const BANDS=['40','50','60','70','80','90'];
  const S={ A:[2,5,9,7,4,3], B:[1,2,4,9,7,4] };
  const P=40, BW=(W-2*P)/6;
  const ROWS=[{k:'A',y0:36,y1:136,col:'#2563EB'},{k:'B',y0:170,y1:270,col:'#0E9384'}];

  function draw(){
    const mode=$('#rfM').value;
    ctx.clearRect(0,0,W,H); ctx.fillStyle='#fff'; ctx.fillRect(0,0,W,H);
    ROWS.forEach(R=>{
      const arr=S[R.k], tot=arr.reduce((a,b)=>a+b,0)||1;
      const vals=mode==='cnt'?arr:arr.map(v=>v/tot);
      const mx=mode==='cnt'?Math.max(...S.A,...S.B,1):0.45;
      ctx.fillStyle='#374151'; ctx.font='bold 12px sans-serif'; ctx.textAlign='left';
      ctx.fillText(R.k+'반 — '+tot+'명'+(mode==='rel'?' · 상대도수 합 = '+(vals.reduce((a,b)=>a+b,0)).toFixed(2):''), P, R.y0-8);
      vals.forEach((v,i)=>{
        const h=(R.y1-R.y0)*Math.min(1,v/mx);
        ctx.fillStyle=R.col; ctx.globalAlpha=.30;
        ctx.fillRect(P+i*BW+4, R.y1-h, BW-8, h); ctx.globalAlpha=1;
        ctx.strokeStyle=R.col; ctx.lineWidth=1.4;
        ctx.strokeRect(P+i*BW+4, R.y1-h, BW-8, h);
        ctx.fillStyle='#374151'; ctx.font='10.5px sans-serif'; ctx.textAlign='center';
        ctx.fillText(mode==='cnt'?arr[i]:(arr[i]/tot).toFixed(2), P+i*BW+BW/2, R.y1-h-4);
      });
      ctx.strokeStyle='#9CA3AF';
      ctx.beginPath(); ctx.moveTo(P,R.y1); ctx.lineTo(W-P,R.y1); ctx.stroke();
      BANDS.forEach((b,i)=>{ ctx.fillStyle='#9CA3AF'; ctx.font='10px sans-serif';
        ctx.fillText(b+'점대', P+i*BW+BW/2, R.y1+13); });
    });
    const ta=S.A.reduce((a,b)=>a+b,0), tb=S.B.reduce((a,b)=>a+b,0);
    const pa=S.A.indexOf(Math.max(...S.A)), pb=S.B.indexOf(Math.max(...S.B));
    const mode2=$('#rfM').value;
    $('#rfout').innerHTML =
      `A반 ${ta}명 · B반 ${tb}명 ${tb>ta*2?'<b style="color:#BE123C">— 인원이 크게 다릅니다</b>':''}<br>`
      + `봉우리: A반 <b>${BANDS[pa]}점대</b> · B반 <b>${BANDS[pb]}점대</b><br>`
      + (mode2==='cnt'
        ? `<span style="color:#BE123C">도수로는 큰 반의 막대가 무조건 높습니다 — 이걸 “잘한다”로 읽으면 안 됩니다.</span>`
        : `<span style="color:#0E9384">상대도수의 합은 두 반 모두 1 — 이제 모양끼리 공정하게 비교할 수 있습니다.</span>`);
  }
  cv.style.touchAction='none';
  cv.addEventListener('pointerdown',e=>{
    const r=cv.getBoundingClientRect();
    const x=(e.clientX-r.left)*W/r.width, y=(e.clientY-r.top)*H/r.height;
    const i=Math.floor((x-P)/BW); if(i<0||i>5) return;
    const R=ROWS.find(R=>y>R.y0-14&&y<R.y1+4); if(!R) return;
    S[R.k][i]++; draw();
  });
  $('#rfM').onchange=draw;
  $('#rfX3').onclick=()=>{ S.B=S.B.map(v=>v*3); draw(); };
  $('#rfRst').onclick=()=>{ S.A=[2,5,9,7,4,3]; S.B=[1,2,4,9,7,4]; draw(); };
  draw();

  inquiry(root,{ id:'rf', title:'크기가 다른 두 반을 어떻게 비교할까 — 상대도수',
    q:['칸을 눌러 학생을 넣고 B반을 ×3 으로 불려 가며, 도수와 상대도수를 오가며 기록하세요 (8줄 이상).',
       '「상대도수의 합」 열을 보세요. 인원을 아무리 불려도 <b>변하지 않는 값</b>이 무엇인지 찾으세요.',
       '도수 비교가 왜 불공정한지, 상대도수는 왜 공정한지 <b>합이 1</b>이라는 사실로 손으로 설명하세요.'],
    cols:['보기','A반 인원','B반 인원','A반 봉우리','B반 봉우리','상대도수의 합'],
    hint:'힌트 — 나누기는 “기준 맞추기”입니다. 전체로 나누는 순간 두 반의 기준이 같아집니다.',
    read:()=>{ const ta=S.A.reduce((a,b)=>a+b,0), tb=S.B.reduce((a,b)=>a+b,0);
      const pa=S.A.indexOf(Math.max(...S.A)), pb=S.B.indexOf(Math.max(...S.B));
      return [$('#rfM').value==='cnt'?'도수':'상대도수', ta+'명', tb+'명',
              BANDS[pa]+'점대', BANDS[pb]+'점대', '각 반 모두 1']; } });
}

/* ---------- LAB 42 몇 명에게 물어야 할까 [9수04-04] ----------
   「표본이 작으면 흔들린다」는 말은, 흔들림이 쌓이는 띠가 있어야 눈에 보인다.
   ① 표본 크기 손잡이를 축 위에서 직접 끌고
   ② 「다시 뽑기」를 누를 때마다 그 표본의 평균이 아래 띠에 점으로 떨어져 쌓인다.
   작은 표본의 점들은 넓게 흩어지고, 큰 표본의 점들은 참평균 둘레에 모인다 —
   표집변동이 남긴 자국을 학생이 직접 만든다. */
function statInqDemo(root){
  root.innerHTML=`<div class="row"><div class="col">
      <canvas id="si1" width="380" height="300"></canvas>
      <div class="note" style="margin-top:8px">아래 축의 <b>손잡이(표본 크기)</b>를 끌고,
      <b>「다시 뽑기」를 여러 번</b> 눌러 평균 점이 쌓이는 모양을 보세요.</div>
    </div>
    <div class="col">
      <label class="ctl">탐구 문제
        <select id="siQ" style="width:100%;padding:7px 9px;border:1px solid #E5E7EB;border-radius:8px;font:inherit">
          <option value="0">우리 학교 통학 시간은 얼마나 걸릴까?</option>
          <option value="1">하루 수면 시간은 몇 시간일까?</option>
          <option value="2">스마트폰을 하루 몇 분 쓸까?</option></select></label>
      <div class="ctl" style="display:flex;gap:6px;flex-wrap:wrap;margin-top:8px">
        <button class="b t" id="siGo">다시 뽑기</button>
        <button class="b t sm" id="siGo10">10번 연달아</button>
        <button class="b g sm" id="siClr">점 지우기</button>
      </div>
      <div class="out" id="siout"></div>
      <div class="note" style="margin-top:12px">몇 명에게 물으면 믿을 만할까요? 같은 크기로 여러 번 뽑아 결과의 흔들림을 재 보세요.</div>
    </div></div>`;
  const cv=$('#si1'),ctx=cv.getContext('2d'),W=380,H=300;
  const TOPIC=[{n:'통학 시간',u:'분',mu:22,sd:11,lo:0,hi:70},
               {n:'수면 시간',u:'시간',mu:6.6,sd:1.2,lo:3,hi:11},
               {n:'스마트폰 사용',u:'분',mu:186,sd:72,lo:0,hi:480}];
  const S={ n:30, sample:[], means:[] };          // means: {n, m} — 뽑을 때마다 쌓인다
  function gauss(){ let u=0,v=0; while(!u)u=Math.random(); while(!v)v=Math.random();
    return Math.sqrt(-2*Math.log(u))*Math.cos(2*Math.PI*v); }
  function resample(){
    const T=TOPIC[+$('#siQ').value];
    S.sample=[]; for(let i=0;i<S.n;i++){
      let v=T.mu+gauss()*T.sd; v=Math.max(T.lo,Math.min(T.hi,v));
      S.sample.push(T.u==='시간'?Math.round(v*2)/2:Math.round(v)); }
    const m=S.sample.reduce((a,b)=>a+b,0)/S.sample.length;
    S.means.push({n:S.n, m});
    if(S.means.length>60) S.means.shift();
  }
  const P=44;
  function draw(){
    const T=TOPIC[+$('#siQ').value];
    if(!S.sample.length) resample();
    const mean=S.sample.reduce((a,b)=>a+b,0)/S.sample.length;
    const srt=[...S.sample].sort((a,b)=>a-b), n=srt.length;
    const med=n%2?srt[(n-1)/2]:(srt[n/2-1]+srt[n/2])/2;
    const sd=Math.sqrt(S.sample.reduce((a,b)=>a+(b-mean)*(b-mean),0)/n);
    ctx.clearRect(0,0,W,H); ctx.fillStyle='#fff'; ctx.fillRect(0,0,W,H);
    const xOf=v=>P+(W-2*P)*(v-T.lo)/(T.hi-T.lo);
    // ── 위: 이번 표본의 히스토그램
    const BINW=(T.hi-T.lo)/12, bins=[];
    for(let x=T.lo;x<T.hi;x+=BINW) bins.push(S.sample.filter(v=>v>=x&&v<x+BINW).length);
    const mx=Math.max(...bins,1), BW=(W-2*P)/bins.length;
    ctx.fillStyle='#6B7280'; ctx.font='11px sans-serif'; ctx.textAlign='left';
    ctx.fillText('이번 표본 '+n+'명 — 평균 '+mean.toFixed(1)+T.u, P, 22);
    bins.forEach((c,i)=>{ const h=90*c/mx;
      ctx.fillStyle='rgba(37,99,235,.5)'; ctx.fillRect(P+i*BW, 122-h, BW-1, h); });
    ctx.strokeStyle='#9CA3AF'; ctx.lineWidth=1.2;
    ctx.beginPath(); ctx.moveTo(P,122); ctx.lineTo(W-P,122); ctx.stroke();
    // ── 가운데: 평균들이 쌓이는 띠 (참평균 표시)
    ctx.fillStyle='#6B7280'; ctx.fillText('뽑을 때마다의 평균 — 흔들림의 자국', P, 150);
    ctx.strokeStyle='#0E9384'; ctx.setLineDash([4,3]); ctx.lineWidth=1.6;
    ctx.beginPath(); ctx.moveTo(xOf(T.mu),156); ctx.lineTo(xOf(T.mu),226); ctx.stroke(); ctx.setLineDash([]);
    ctx.fillStyle='#0E9384'; ctx.font='bold 10px sans-serif'; ctx.textAlign='center';
    ctx.fillText('참평균 '+T.mu+T.u, xOf(T.mu), 152);
    const stack={};
    S.means.forEach(q=>{
      const key=Math.round(xOf(q.m)/6);
      stack[key]=(stack[key]||0)+1;
      const isBig=q.n>=100;
      ctx.fillStyle = isBig ? '#0E9384' : (q.n>=50?'#B45309':'#BE123C');
      ctx.beginPath(); ctx.arc(xOf(q.m), 222-(stack[key]-1)*8, 3.6, 0, 7); ctx.fill();
    });
    ctx.strokeStyle='#9CA3AF';
    ctx.beginPath(); ctx.moveTo(P,228); ctx.lineTo(W-P,228); ctx.stroke();
    ctx.fillStyle='#6B7280'; ctx.font='9.5px sans-serif'; ctx.textAlign='left';
    ctx.fillText('● 빨강 n<50 · 주황 n<100 · 초록 n≥100', P, 242);
    // ── 아래: 표본 크기 손잡이 축
    ctx.strokeStyle='#D1D5DB'; ctx.lineWidth=3;
    ctx.beginPath(); ctx.moveTo(P,272); ctx.lineTo(W-P,272); ctx.stroke();
    const nx=P+(W-2*P)*(S.n-5)/195;
    handle(ctx,nx,272,'#2563EB','표본 '+S.n+'명');

    const same=S.means.filter(q=>q.n===S.n).map(q=>q.m);
    const spread=same.length>=2 ? (Math.max(...same)-Math.min(...same)) : null;
    $('#siout').innerHTML =
      `<b>${T.n}</b> · 표본 ${n}명<br>`
      + `평균 <b>${mean.toFixed(1)}${T.u}</b> · 중앙값 ${med.toFixed(1)} · 표준편차 ${sd.toFixed(1)}<br>`
      + (spread!==null
        ? `같은 ${S.n}명으로 ${same.length}번 뽑은 평균의 <b>흔들림 폭: ${spread.toFixed(1)}${T.u}</b>`
        : `<span style="color:#6B7280">「다시 뽑기」를 몇 번 눌러 흔들림 폭을 재 보세요.</span>`)
      + `<br><span style="color:#6B7280;font-size:12.5px">크기를 바꿔 가며 점 색깔별 퍼짐을 비교하세요.</span>`;
  }
  dragOn(cv,{
    hit:p=>(Math.abs(p.y-272)<20)?'n':null,
    move:(h,p)=>{ S.n=Math.max(5,Math.min(200,Math.round(((p.x-P)*195/(W-2*P)+5)/5)*5));
      S.sample=[]; draw(); }
  });
  $('#siQ').onchange=()=>{ S.sample=[]; S.means=[]; draw(); };
  $('#siGo').onclick=()=>{ resample(); draw(); };
  $('#siGo10').onclick=()=>{ for(let i=0;i<10;i++) resample(); draw(); };
  $('#siClr').onclick=()=>{ S.means=[]; S.sample=[]; draw(); };
  draw();

  inquiry(root,{ id:'si', title:'우리 반 통계적 탐구 — 문제 설정에서 해석까지',
    q:['표본 크기를 10 · 30 · 100 · 200 으로 두고, <b>각 크기마다 「다시 뽑기」를 3번씩</b> 눌러 기록하세요.',
       '같은 표본 크기의 세 줄을 견주어, <b>평균이 얼마나 흔들리는지</b> 표본 크기별로 비교하세요. 띠에 쌓인 점 색깔별 퍼짐과도 맞춰 보세요.',
       '“우리 학교 학생의 통학 시간은 평균 ○분이다”라고 말하려면 몇 명에게 물어야 하는지 정하고, <b>그 근거</b>를 손으로 쓰세요. 표본을 어떻게 뽑아야 공정한지도 함께 적으세요.'],
    cols:['탐구 문제','표본 크기','평균','중앙값','표준편차'],
    hint:'힌트 — 같은 크기로 여러 번 뽑았을 때 값이 벌어진 폭이 곧 “이 표본을 얼마나 믿을 수 있는가”입니다. 학원가 앞에서만 물으면 무엇이 문제일까요?',
    read:()=>{ const T=TOPIC[+$('#siQ').value];
      if(!S.sample.length) return null;
      const mean=S.sample.reduce((a,b)=>a+b,0)/S.sample.length;
      const s=[...S.sample].sort((a,b)=>a-b),n=s.length;
      const med=n%2?s[(n-1)/2]:(s[n/2-1]+s[n/2])/2;
      const sd=Math.sqrt(S.sample.reduce((a,b)=>a+(b-mean)*(b-mean),0)/n);
      return [T.n, n+'명', mean.toFixed(1), med.toFixed(1), sd.toFixed(1)]; } });
}

/* ---------- LAB 43 같은 것끼리만 묶인다 — 일차식의 덧셈과 뺄셈 [9수02-02] ----------
   동류항 정리를 「타일 분류」로 만든다. (3x + 2) + (2x − 5) 의 네 항이 타일로 흩어져
   있고, 학생이 타일을 잡아 「x 의 항 바구니」와 「상수항 바구니」로 직접 끌어 담는다.
   x 타일을 상수 바구니에 넣으면 튕겨 나온다 — 3x 와 2 를 5 로 못 묶는 이유가
   행동으로 남는다. 다 담으면 바구니가 스스로 합쳐지고, x 에 값을 넣어 검산한다. */
function linexprDemo(root){
  root.innerHTML=`<div class="row"><div class="col">
      <canvas id="le1" width="380" height="300"></canvas>
      <div class="note" style="margin-top:8px"><b>타일을 끌어</b> 알맞은 바구니에 담으세요.
      틀린 바구니에 넣으면 튕겨 나옵니다.</div>
    </div>
    <div class="col">
      <div class="ctl" style="display:flex;gap:6px;flex-wrap:wrap">
        <button class="b t sm" id="leNew">새 문제</button>
        <button class="b g sm" id="leChk">x = 2 로 검산</button>
      </div>
      <div class="out" id="leout"></div>
      <div class="note" style="margin-top:12px"><b>3x 와 2 는 왜 5 로 못 묶일까요?</b>
      3x 는 “x 가 3개”, 2 는 “1 이 2개” — 세는 <b>단위가 다릅니다</b>.
      사과 3개와 귤 2개를 「과일 5」로 합쳐 버리면 무엇이 몇 개인지 잃어버립니다.</div>
    </div></div>`;
  const cv=$('#le1'),ctx=cv.getContext('2d'),W=380,H=300;
  const BIN={ x:{x:60,y:210,w:120,h:74}, k:{x:200,y:210,w:120,h:74} };
  const S={ tiles:[], drag:null, done:false, expr:'' };

  const fmtT=t=> t.isx ? ((t.v===1?'':t.v===-1?'−':t.v)+'x') : String(t.v);
  function newProblem(){
    const r=n=>Math.floor(Math.random()*n);
    const a=r(5)+1, b=r(9)-4||2, c=r(5)+1, d=r(9)-4||-3;
    S.expr=`(${a}x ${b>=0?'+ '+b:'− '+(-b)}) + (${c}x ${d>=0?'+ '+d:'− '+(-d)})`;
    S.tiles=[
      {v:a,isx:true, x:70, y:96}, {v:b,isx:false,x:150,y:96},
      {v:c,isx:true, x:230,y:96}, {v:d,isx:false,x:310,y:96},
    ].map(t=>({...t, w:58, h:34, bin:null}));
    S.done=false; draw();
  }
  function draw(){
    ctx.clearRect(0,0,W,H); ctx.fillStyle='#fff'; ctx.fillRect(0,0,W,H);
    ctx.fillStyle='#111827'; ctx.font='bold 15px sans-serif'; ctx.textAlign='center';
    ctx.fillText(S.expr, W/2, 40);
    ctx.fillStyle='#6B7280'; ctx.font='11px sans-serif';
    ctx.fillText('네 항이 타일로 흩어져 있습니다 — 같은 것끼리 담으세요', W/2, 60);
    // 바구니
    const drawBin=(B,label,col,list)=>{
      ctx.fillStyle=col; ctx.globalAlpha=.10;
      ctx.fillRect(B.x,B.y,B.w,B.h); ctx.globalAlpha=1;
      ctx.strokeStyle=col; ctx.lineWidth=2; ctx.setLineDash([5,4]);
      ctx.strokeRect(B.x,B.y,B.w,B.h); ctx.setLineDash([]);
      ctx.fillStyle=col; ctx.font='bold 12px sans-serif'; ctx.textAlign='center';
      ctx.fillText(label, B.x+B.w/2, B.y-8);
      if(S.done){
        const sum=list.reduce((s,t)=>s+t.v,0);
        ctx.font='bold 20px sans-serif'; ctx.fillStyle='#111827';
        ctx.fillText(list[0]&&list[0].isx ? (sum===1?'x':sum===-1?'−x':sum+'x') : String(sum),
          B.x+B.w/2, B.y+B.h/2+8);
      }
    };
    const inX=S.tiles.filter(t=>t.bin==='x'), inK=S.tiles.filter(t=>t.bin==='k');
    drawBin(BIN.x,'x 의 항','#2563EB',inX);
    drawBin(BIN.k,'상수항','#B45309',inK);
    // 타일
    S.tiles.forEach(t=>{
      if(S.done && t.bin) return;                       // 합쳐진 뒤에는 숨긴다
      ctx.fillStyle = t.isx ? '#EFF4FF' : '#FFF8EB';
      ctx.strokeStyle = t.isx ? '#2563EB' : '#B45309';
      ctx.lineWidth=2;
      ctx.beginPath(); ctx.roundRect(t.x-t.w/2,t.y-t.h/2,t.w,t.h,8); ctx.fill(); ctx.stroke();
      ctx.fillStyle='#111827'; ctx.font='bold 16px sans-serif'; ctx.textAlign='center';
      ctx.fillText(fmtT(t), t.x, t.y+6);
    });
    // 완료 판정
    if(!S.done && S.tiles.every(t=>t.bin)){
      S.done=true;
      setTimeout(()=>{ if(cv.isConnected) draw(); }, 350);
    }
    const sx=S.tiles.filter(t=>t.isx).reduce((s,t)=>s+t.v,0);
    const sk=S.tiles.filter(t=>!t.isx).reduce((s,t)=>s+t.v,0);
    $('#leout').innerHTML = S.done
      ? `<b style="color:#0E9384">정리 완료!</b> &nbsp;
         <span class="mono" style="font-size:16px">${S.expr} = <b>${sx===1?'':sx===-1?'−':sx}x ${sk>=0?'+ '+sk:'− '+(-sk)}</b></span><br>
         <span style="color:#6B7280;font-size:12.5px">「x = 2 로 검산」을 눌러 양변이 정말 같은지 확인해 보세요.</span>`
      : `담은 타일 ${S.tiles.filter(t=>t.bin).length} / 4`;
  }
  dragOn(cv,{
    hit:p=>{
      for(let i=S.tiles.length-1;i>=0;i--){ const t=S.tiles[i];
        if(!(S.done&&t.bin) && Math.abs(p.x-t.x)<t.w/2+6 && Math.abs(p.y-t.y)<t.h/2+6) return i; }
      return null;
    },
    move:(i,p)=>{ const t=S.tiles[i]; t.x=p.x; t.y=p.y; t.bin=null; S.done=false; draw(); },
    up:()=>{
      S.tiles.forEach(t=>{
        const inb=B=>t.x>B.x&&t.x<B.x+B.w&&t.y>B.y&&t.y<B.y+B.h;
        if(inb(BIN.x)){
          if(t.isx){ t.bin='x'; t.y=BIN.x.y+BIN.x.h/2; }
          else { t.bin=null; t.x=70+Math.random()*240; t.y=96; }     // 튕겨 나옴
        } else if(inb(BIN.k)){
          if(!t.isx){ t.bin='k'; t.y=BIN.k.y+BIN.k.h/2; }
          else { t.bin=null; t.x=70+Math.random()*240; t.y=96; }
        }
      });
      // 바구니 안에서 겹치지 않게 늘어놓기
      ['x','k'].forEach(k=>{ const B=BIN[k==='x'?'x':'k'];
        S.tiles.filter(t=>t.bin===k).forEach((t,j)=>{ t.x=B.x+34+j*60; }); });
      draw();
    }
  });
  $('#leNew').onclick=newProblem;
  $('#leChk').onclick=()=>{
    const sx=S.tiles.filter(t=>t.isx).reduce((s,t)=>s+t.v,0);
    const sk=S.tiles.filter(t=>!t.isx).reduce((s,t)=>s+t.v,0);
    const xv=2, left=S.tiles.reduce((s,t)=>s+(t.isx?t.v*xv:t.v),0), right=sx*xv+sk;
    alert(`x = 2 대입\n원래 식 = ${left}\n정리한 식 = ${sx}x ${sk>=0?'+':'−'} ${Math.abs(sk)} → ${right}\n${left===right?'같습니다 — 정리가 옳았습니다.':'다릅니다 — 어디서 어긋났을까요?'}`);
  };
  newProblem();

  inquiry(root,{ id:'le', title:'같은 것끼리만 묶인다 — 일차식의 덧셈과 뺄셈',
    q:['「새 문제」로 문제를 바꿔 가며 타일을 분류해 정리하고, 매번 기록하세요 (6줄 이상).',
       'x 의 항끼리는 <b>계수</b>가 어떻게 되는지, 상수항끼리는 무엇이 되는지 규칙을 찾으세요.',
       '3x 와 2 를 5 (또는 5x) 로 묶으면 왜 안 되는지, <b>x = 2 검산</b>의 두 값으로 손으로 설명하세요.'],
    cols:['문제','x 항의 합','상수항의 합','정리한 식','x=2 원래 식','x=2 정리한 식'],
    hint:'힌트 — 문자 앞의 수(계수)는 “그 문자가 몇 개인가”입니다. 개수는 개수끼리만 더할 수 있습니다.',
    read:()=>{ const sx=S.tiles.filter(t=>t.isx).reduce((s,t)=>s+t.v,0);
      const sk=S.tiles.filter(t=>!t.isx).reduce((s,t)=>s+t.v,0);
      const left=S.tiles.reduce((s,t)=>s+(t.isx?t.v*2:t.v),0);
      return [S.expr, sx+'x', sk, `${sx}x ${sk>=0?'+ '+sk:'− '+(-sk)}`, left, sx*2+sk]; } });
}

/* ---------- LAB 44 그래프는 무엇을 말하고 있나 [9수02-05][9수02-06] ----------
   그래프 「읽기」의 반대편은 그래프 「그리기」다. 이야기를 읽고 학생이 좌표평면에
   거리-시간 그래프를 손으로 직접 그린다(한 시각에 한 값 — 함수답게 저장된다).
   「정답과 비교」를 누르면 참 그래프가 겹쳐지고 평균 오차가 점수로 나온다.
   평평함 = 멈춤, 내려감 = 돌아옴을 손이 먼저 익힌다. */
function coordDemo(root){
  root.innerHTML=`<div class="row"><div class="col">
      <canvas id="co1" width="380" height="300"></canvas>
      <div class="note" style="margin-top:8px"><b>좌표평면 위에 손·펜·마우스로 직접 그리세요.</b>
      왼쪽에서 오른쪽으로 긋습니다. 다시 그으면 그 구간은 덮어씁니다.</div>
    </div>
    <div class="col">
      <label class="ctl">이 이야기의 그래프를 그리세요
        <select id="coS" style="width:100%;padding:7px 9px;border:1px solid #E5E7EB;border-radius:8px;font:inherit">
          <option value="0">집 → 학교, 중간에 편의점에 4분 들름</option>
          <option value="1">운동장 한 바퀴 뛰고 제자리로</option>
          <option value="2">엘리베이터로 올라갔다 내려왔다 다시 올라감</option>
          <option value="3">버스를 타고 갔다가 걸어서 돌아옴</option>
        </select></label>
      <div class="ctl" style="display:flex;gap:6px;flex-wrap:wrap;margin-top:8px">
        <button class="b t sm" id="coChk">정답과 비교</button>
        <button class="b g sm" id="coClr">다시 그리기</button>
      </div>
      <div class="out" id="coout"></div>
      <div class="note" style="margin-top:12px">세로축은 <b>집에서의 거리</b>이지 “달린 거리”가
      아닙니다. <b>평평한 구간 = 멈춤</b>, <b>내려가는 구간 = 되돌아옴</b> —
      두 가지를 그림에 넣었는지 스스로 확인하세요.</div>
    </div></div>`;
  const cv=$('#co1'),ctx=cv.getContext('2d'),W=380,H=300,P=44;
  const STORY=[
    {n:'집 → 학교, 편의점',pts:[[0,0],[5,400],[9,400],[16,1000],[20,1000]],u:'m',
     key:'5~9분의 평평한 구간(멈춤)이 있고, 거리가 다시 줄지 않아야 합니다.'},
    {n:'운동장 한 바퀴',pts:[[0,0],[5,120],[10,200],[15,120],[20,0]],u:'m',
     key:'올라갔다 <b>0까지 내려와야</b> 합니다 — 제자리로 돌아왔으니까요.'},
    {n:'엘리베이터',pts:[[0,0],[3,30],[6,30],[10,0],[14,0],[17,45],[20,45]],u:'m',
     key:'두 번의 평평한 구간과 한 번의 0 복귀가 있어야 합니다.'},
    {n:'버스 갔다 걸어서',pts:[[0,0],[6,3000],[8,3000],[20,0]],u:'m',
     key:'가는 길(버스)은 가파르고 오는 길(도보)은 완만해야 합니다.'}
  ];
  const S={ user:new Array(81).fill(null), grading:false };   // t = 0~20 을 0.25 간격 81칸
  const maxY=()=>Math.max(...STORY[+$('#coS').value].pts.map(p=>p[1]),1);
  const X=v=>P+(W-2*P)*v/20, Y=v=>H-P-(H-2*P)*v/maxY();
  const invT=px=>Math.max(0,Math.min(20,(px-P)*20/(W-2*P)));
  const invD=py=>Math.max(0,Math.min(maxY(),(H-P-py)*maxY()/(H-2*P)));
  function valueAt(pts,t){
    for(let i=1;i<pts.length;i++){ if(t<=pts[i][0]){
      const q0=pts[i-1],q1=pts[i];
      return q1[0]===q0[0]?q1[1]:q0[1]+(q1[1]-q0[1])*(t-q0[0])/(q1[0]-q0[0]); } }
    return pts[pts.length-1][1];
  }
  function draw(){
    const st=STORY[+$('#coS').value];
    axes(ctx,W,H,P);
    ctx.fillStyle='#6B7280'; ctx.font='11px sans-serif'; ctx.textAlign='left';
    ctx.fillText('시각 (분)',W-P-46,H-P+18); ctx.fillText('집에서의 거리 ('+st.u+')',P-30,P-14);
    ctx.fillText('0',P-10,H-P+14); ctx.fillText('20',W-P-6,H-P+14);
    // 학생이 그린 선
    ctx.strokeStyle='#2563EB'; ctx.lineWidth=2.8; ctx.beginPath(); let on=false;
    S.user.forEach((v,i)=>{ if(v===null){on=false;return;}
      const px=X(i*0.25), py=Y(v); on?ctx.lineTo(px,py):ctx.moveTo(px,py); on=true; });
    ctx.stroke();
    // 채점 시 정답 겹치기
    if(S.grading){
      ctx.strokeStyle='#0E9384'; ctx.lineWidth=2.2; ctx.setLineDash([6,4]); ctx.beginPath();
      st.pts.forEach((p,i)=>i?ctx.lineTo(X(p[0]),Y(p[1])):ctx.moveTo(X(p[0]),Y(p[1])));
      ctx.stroke(); ctx.setLineDash([]);
      ctx.fillStyle='#0E9384'; ctx.font='bold 11px sans-serif';
      ctx.fillText('― 실제 이야기', W-P-86, P+14);
    }
  }
  function grade(){
    const st=STORY[+$('#coS').value];
    const drawn=S.user.filter(v=>v!==null).length;
    if(drawn<40){ $('#coout').innerHTML='<b style="color:#B45309">아직 절반도 그리지 않았습니다.</b> 0분부터 20분까지 이어 그려 주세요.'; return; }
    let err=0,n=0;
    S.user.forEach((v,i)=>{ if(v===null) return;
      err+=Math.abs(v-valueAt(st.pts,i*0.25)); n++; });
    const rel=err/n/maxY();
    S.grading=true; draw();
    $('#coout').innerHTML =
      `평균 어긋남: <b>${(rel*100).toFixed(1)}%</b> ${rel<0.08?'<b style="color:#0E9384">— 훌륭합니다!</b>':rel<0.2?'<b style="color:#B45309">— 거의 맞습니다</b>':'<b style="color:#BE123C">— 이야기를 다시 읽어 보세요</b>'}<br>`
      + `<span style="color:#6B7280;font-size:12.5px">확인할 것 — ${st.key}</span>`;
  }
  dragOn(cv,{
    hit:p=>(p.x>P-6&&p.x<W-P+6&&p.y>P-6&&p.y<H-P+6)?'draw':null,
    move:(h,p)=>{
      const i=Math.round(invT(p.x)/0.25), d=invD(p.y);
      if(i>=0&&i<S.user.length){ S.user[i]=d;
        // 붓이 건너뛴 칸을 이웃과 이어 준다
        for(let k=1;k<=3;k++){ if(i-k>=0&&S.user[i-k]===null&&S.user[i-k-1]!=null)
          S.user[i-k]=(S.user[i-k-1]+d)/2; }
      }
      S.grading=false; draw();
    }
  });
  $('#coS').onchange=()=>{ S.user.fill(null); S.grading=false; draw();
    $('#coout').innerHTML='이야기를 읽고 그래프를 그려 보세요.'; };
  $('#coChk').onclick=grade;
  $('#coClr').onclick=()=>{ S.user.fill(null); S.grading=false; draw(); };
  draw(); $('#coout').innerHTML='이야기를 읽고 그래프를 그려 보세요.';

  inquiry(root,{ id:'co', title:'그래프는 무엇을 말하고 있나 — 순서쌍·좌표와 그래프 해석',
    q:['네 이야기를 모두 직접 그리고 「정답과 비교」한 뒤, 매번 기록하세요.',
       '어긋난 곳이 주로 <b>평평한 구간</b>인지 <b>내려가는 구간</b>인지 확인하고, 왜 그 부분을 틀렸는지 적으세요.',
       '“평평하다 = 멈춤”과 “내려간다 = 되돌아옴”이 왜 다른 뜻인지 손으로 설명하고, <b>버스와 도보를 기울기로 어떻게 구별했는지</b> 근거를 적으세요.'],
    cols:['이야기','그린 칸 수','평균 어긋남','평평한 구간 넣었나','0 복귀 넣었나'],
    hint:'힌트 — 세로축이 “집에서의 거리”이지 “달린 거리”가 아닙니다. 운동장을 한 바퀴 돌면 두 값은 어떻게 달라질까요?',
    read:()=>{ const st=STORY[+$('#coS').value];
      const drawn=S.user.filter(v=>v!==null).length;
      if(!drawn) return null;
      let err=0,n=0;
      S.user.forEach((v,i)=>{ if(v===null)return; err+=Math.abs(v-valueAt(st.pts,i*0.25)); n++; });
      // 학생 그림에 평평한 구간·0 복귀가 있는지 대충 판정
      let flat=false, back=false;
      for(let i=6;i<S.user.length;i++){ const a=S.user[i-6],b=S.user[i];
        if(a!=null&&b!=null){ if(Math.abs(a-b)<maxY()*0.02 && a>maxY()*0.05) flat=true;
          if(i>40 && b<maxY()*0.06 && Math.max(...S.user.slice(0,i).filter(x=>x!=null))>maxY()*0.3) back=true; } }
      return [st.n, drawn, (err/n/maxY()*100).toFixed(1)+'%', flat?'넣었다':'없다', back?'넣었다':'없다']; } });
}

const PRINS = [
{tex:[
  {t:'\\sqrt{(x-a)^2+(y-b)^2}=r', s:'기준점 <b>(a, b)</b> 에서 잰 거리가 r 이라는 말을 두 점 사이의 거리 공식으로 그대로 옮긴 것입니다.'},
  {t:'(x-a)^2+(y-b)^2=r^2', s:'양변을 제곱하면 근호가 사라지고 <b>원의 방정식</b>이 됩니다. “거리를 안다”가 “원 위에 있다”와 같은 말이 되는 지점입니다.'},
  {t:'(x-a_1)^2+(y-b_1)^2-\\left[(x-a_2)^2+(y-b_2)^2\\right]=r_1^2-r_2^2',
   s:'기준점이 둘일 때 두 원의 식을 빼면 제곱항 x², y² 이 <b>소거되어 일차식</b> 하나만 남습니다. 두 원의 교점을 지나는 직선이고, 기준점이 셋이면 이런 직선 둘의 교점으로 위치가 한 점으로 정해집니다.'}
 ],
 next:[
  {lv:'바로',   t:'우리 동네 좌표로 바꿔 보기', d:'지도 앱에서 학교·집·자주 가는 가게의 위도·경도를 읽어 기준점 세 곳에 넣습니다. 오차를 5 m·20 m·50 m로 바꾸며 <b>교점이 번지는 범위</b>가 실제로 몇 미터인지 재어 보세요.'},
  {lv:'심화',   t:'기준점 2개로는 왜 안 되는가', d:'기준점을 둘만 두면 후보가 두 곳 남습니다. 세 번째 원이 그중 <b>어느 쪽을 지우는지</b>를 식으로 확인하고, 세 원의 중심이 한 직선 위에 있으면 왜 위치가 정해지지 않는지 설명해 보세요.'},
  {lv:'프로젝트', t:'교실 안 실내 측위 만들기', d:'교실 세 모서리를 기준점으로 두고 와이파이 신호 세기(또는 걸음 수)로 거리를 추정해 자리를 맞혀 보는 장치를 설계합니다. GPS가 안 통하는 실내를 어떻게 해결할지가 과제입니다.'}
 ],
 eq:'(x − a)² + (y − b)² = r²',
 what:'기준점에서 잰 거리가 <b>r</b> 이라는 사실 하나는 “나는 그 점을 중심으로 반지름 r인 원 위에 있다”는 뜻입니다. 기준점이 둘이면 두 원의 교점 두 곳으로, 셋이면 한 점으로 좁혀집니다. 위치를 찾는 일이 <b>원의 방정식 연립</b>으로 바뀌는 순간입니다.',
 probe:'기준점을 1개 → 2개 → 3개로 늘려 보세요. 후보가 원 전체 → 두 점 → 한 점으로 줄어듭니다. 오차를 키우면 교점이 한 점이 아니라 <b>“오차 삼각형”</b>으로 번지는데, 그 안에서 “가장 그럴듯한 한 점”을 고르는 것이 최소제곱의 직관입니다.',
 link:'원의 방정식 단원의 도입으로 씁니다. 공식을 먼저 주지 말고 “거리를 안다 = 원 위에 있다”를 화면으로 먼저 겪게 한 뒤 식을 세우면, 원과 직선의 위치 관계(d와 r의 대소)까지 한 흐름으로 이어집니다.'},

{tex:[
  {t:'P(A \\mid B)=\\frac{P(A \\cap B)}{P(B)}', s:'분모가 <b>전체가 아니라 이미 알고 있는 사건 B</b> 입니다. 이 한 줄이 조건부확률의 전부입니다.'},
  {t:'P(S \\mid w)=\\frac{P(w \\mid S)\\,P(S)}{P(w \\mid S)\\,P(S)+P(w \\mid N)\\,P(N)}',
   s:'스팸 S 와 정상 N 으로 나누어 분모를 전개한 <b>베이즈 정리</b>입니다. 분모는 “그 단어가 나올 모든 경우”이고, 분자는 그중 스팸인 경우입니다.'},
  {t:'P(S \\mid w_1,w_2)=\\frac{P(w_1 \\mid S)\\,P(w_2 \\mid S)\\,P(S)}{P(w_1,w_2)}',
   s:'단어가 둘 이상이면 <b>서로 독립이라 가정</b>하고 곱합니다. 나이브 베이즈의 “나이브(순진한)”가 바로 이 가정을 가리킵니다 — 실제로는 함께 등장하는 단어가 많습니다.'}
 ],
 next:[
  {lv:'바로',   t:'내 문자함으로 단어표 만들기', d:'실제 받은 광고 문자 5개와 정상 문자 5개를 골라 자주 나오는 단어를 세어 표를 만듭니다. 그 표를 실험실에 넣고 <b>새 문자 한 통</b>을 판정시켜 보세요.'},
  {lv:'심화',   t:'처음 보는 단어 문제 해결하기', d:'사전에 없는 단어가 들어오면 확률이 0이 되어 전체 곱이 0이 됩니다. 모든 단어의 빈도에 1을 더하는 <b>라플라스 보정</b>을 직접 적용하고, 왜 그것이 타당한지 설명해 보세요.'},
  {lv:'프로젝트', t:'가짜 뉴스 판별기와 오류 비용', d:'기사 제목으로 분류기를 만든 뒤, 정상을 가짜로 판정한 오류와 가짜를 정상으로 판정한 오류 중 <b>어느 쪽이 더 위험한지</b> 정하고 그에 맞게 판정 기준값을 조정합니다.'}
 ],
 eq:'P(A|B) = P(A ∩ B) / P(B)',
 what:'분모가 <b>전체가 아니라 “이미 알고 있는 것”</b>이라는 점이 이 단원의 전부입니다. 단어 하나를 본 뒤의 스팸 확률은 전체 문자 중 비율이 아니라, <b>그 단어가 들어 있는 문자들 중</b>의 비율입니다. 정보가 하나 들어올 때마다 분모가 바뀌고 판단이 갱신됩니다.',
 probe:'단어를 하나씩 넣고 빼며 확률이 어떻게 뛰는지 보세요. 앞 단계의 사후확률이 다음 단계의 사전확률이 되는 <b>연쇄</b>가 눈에 보입니다. 정상 문자를 일부러 스팸으로 만들어 보면 “정확도가 높아도 오분류는 남는다”가 몸으로 이해됩니다.',
 link:'조건부확률의 정의를 세운 직후에 씁니다. 특히 <b>“양성 판정 ≠ 질병”</b>이라는 반전을 다루는 자리로 좋습니다 — 희귀한 사건일수록 거짓양성이 참양성을 압도한다는 것을 숫자로 확인시킬 수 있습니다.'},

{tex:[
  {t:'y=a\\,r^{x}', s:'a 는 처음 값, r 은 한 단계마다 곱해지는 배율입니다. 더하기가 아니라 <b>곱하기</b>가 반복되는 것이 지수적 증가입니다.'},
  {t:'2=r^{t} \\;\\Rightarrow\\; \\log 2=t\\log r \\;\\Rightarrow\\; t=\\frac{\\log 2}{\\log r}',
   s:'“두 배가 되는 데 걸리는 시간”을 구하려면 <b>지수 t 를 끌어내려야</b> 합니다. 로그를 취하는 순간 지수가 계수로 내려옵니다 — 로그가 필요한 이유가 여기 있습니다.'},
  {t:'\\log y=\\log a+x\\log r',
   s:'양변에 로그를 취하면 x 에 대한 <b>일차식</b>이 됩니다. 세로축을 로그로 바꾸면 곡선이 직선으로 펴지고, 그 직선의 기울기가 log r 입니다.'}
 ],
 next:[
  {lv:'바로',   t:'진짜 조회수로 확인하기', d:'좋아하는 영상의 조회수를 며칠간 기록해 실험실에 넣습니다. 지수 모델이 <b>며칠째까지 맞고 어디서부터 어긋나는지</b> 표시해 보세요.'},
  {lv:'심화',   t:'포화가 있는 모델로 바꾸기', d:'지수 모델은 무한히 커집니다. 상한 K 를 두는 로지스틱 모델로 바꾸고, 우리 학교 전교생 수를 K 로 놓았을 때 언제 <b>증가 속도가 최대</b>가 되는지 찾아보세요.'},
  {lv:'프로젝트', t:'우리 학교 소식 확산 실측', d:'학급에 소식 하나를 흘린 뒤 며칠간 몇 명이 알게 되는지 매일 세어 기록합니다. 실제 곡선과 모델을 겹쳐 그리고 <b>어긋난 이유</b>를 찾아 발표합니다.'}
 ],
 eq:'y = a·rˣ  ·  배가시간 t = log 2 / log r',
 what:'같은 비율을 <b>거듭 곱하는</b> 변화입니다. 더하기(일차)와 곱하기(지수)의 차이가 며칠만 지나도 감당 못 할 만큼 벌어집니다. 지수는 커진 값을 다루기 어렵게 만들고, <b>로그</b>는 그 지수를 끌어내려 다시 다룰 수 있게 만드는 도구입니다.',
 probe:'전파율을 조금만 올려 보세요. 예측을 먼저 적고 나서 실제 값을 보면 직관이 얼마나 빗나가는지 드러납니다. 세로 축 배율을 바꾸면 같은 데이터가 전혀 다른 인상을 준다는 것도 함께 확인하십시오 — <b>로그 축</b>이 필요한 이유가 여기서 나옵니다.',
 link:'지수함수 도입과 로그 도입을 하나로 잇습니다. “두 배가 되는 데 며칠?”을 물으면 학생이 스스로 2 = rᵗ 를 세우고, 그 지수를 꺼내려다 로그를 요구하게 됩니다. 마지막에는 <b>모델이 깨지는 지점(포화)</b>을 찾게 해 모델을 의심하는 법까지 다룹니다.'},

{tex:[
  {t:'y_A=a+bx, \\qquad y_B=c+dx',
   s:'요금은 <b>기본료 + 분당요금 × 시간</b> 입니다. 기본료가 <b>y절편</b>, 분당 요금이 <b>기울기</b>가 되는 전형적인 일차함수입니다.'},
  {t:'a+bx=c+dx \\;\\Rightarrow\\; (b-d)x=c-a \\;\\Rightarrow\\; x=\\frac{c-a}{b-d}',
   s:'“같아지는 시점”을 묻는 것은 <b>두 일차식을 같게 놓는 것</b>, 곧 연립방정식의 해를 구하는 것입니다. x 항을 한쪽으로 모으면 답이 바로 나옵니다.'},
  {t:'b=d \\;\\Rightarrow\\; (b-d)x=c-a \\;\\text{에서}\\; 0 \\cdot x=c-a',
   s:'<b>분모가 0 이 되는 경우입니다.</b> 기울기가 같아 두 직선이 평행하므로, c ≠ a 면 해가 없고(영원히 만나지 않음) c = a 면 두 요금제가 완전히 같아 해가 무수히 많습니다. “해가 없다”가 그래프에서 무엇인지 이 자리에서 보입니다.'},
  {t:'x>\\frac{c-a}{b-d} \\;\\text{일 때}\\; y_A>y_B \\quad (b>d)',
   s:'교점 하나로 끝이 아니라 <b>어느 쪽이 유리한 구간</b>까지 읽어야 답이 됩니다. 기울기가 큰 쪽이 시간이 길어질수록 불리해집니다.'}
 ],
 eq:'a + bx = c + dx  ⇒  x = (c − a) / (b − d)',
 what:'두 요금제를 각각 <b>일차함수</b>로 놓고, 그 값이 같아지는 순간을 찾는 문제입니다. 기본료는 y절편, 분당 요금은 기울기이며, <b>교점의 x좌표</b>가 곧 “갈아탈 시점”입니다.',
 probe:'네 슬라이더를 움직여 보세요. 특히 <b>분당 요금을 서로 같게</b> 맞추면 두 직선이 평행해져 교점이 사라집니다. 화면이 “교점 없음”으로 바뀌는 순간이 연립방정식의 <b>해가 없는 경우</b>를 눈으로 보는 지점입니다.',
 link:'일차함수와 연립방정식을 잇는 자리입니다. 식만 풀면 x 하나가 나오고 끝이지만, 그래프로 보면 <b>해의 개수(하나·없음·무수히 많음)</b>가 기울기 관계로 설명됩니다. 실제 통신사 요금표를 가져오면 그대로 수업이 됩니다.',
 next:[
  {lv:'바로',   t:'진짜 요금제로 계산하기', d:'실제 통신사 요금제 두 가지의 기본료와 데이터 초과 요금을 찾아 넣습니다. <b>내 사용량</b>을 세로선으로 표시해 어느 쪽이 유리한지 판정해 보세요.'},
  {lv:'심화',   t:'세 요금제로 늘리기', d:'요금제를 셋으로 늘리면 구간이 셋으로 나뉩니다. <b>각 구간에서 최저가인 요금제</b>를 찾는 것은 세 직선의 아래쪽 경계(최솟값 함수)를 구하는 일입니다.'},
  {lv:'프로젝트', t:'우리 반 요금제 설계', d:'학급 사용량을 조사해 분포를 구한 뒤, <b>가장 많은 학생에게 이득이 되는</b> 기본료와 분당 요금을 직접 설계합니다. 근거를 그래프로 제시합니다.'}
 ]},

{tex:[
  {t:'\\tan \\theta=\\frac{\\text{높이}}{\\text{밑변}}',
   s:'직각삼각형에서 <b>대변 / 인접변</b>이 탄젠트입니다. 각 하나와 밑변 하나만 알면 높이가 정해집니다.'},
  {t:'h-e=d\\tan \\theta \\;\\Rightarrow\\; h=d\\tan \\theta+e',
   s:'각을 재는 위치가 지면이 아니라 <b>눈높이 e</b> 이므로, tan 으로 구한 값은 “눈높이 위쪽 부분”뿐입니다. 마지막에 <b>e 를 더해야</b> 건물 전체 높이가 됩니다.'},
  {t:'\\theta_{\\text{rad}}=\\theta_{\\text{도}} \\times \\frac{\\pi}{180}',
   s:'계산기와 프로그램은 대부분 <b>라디안</b>을 받습니다. 35° 를 그대로 넣으면 tan 35(라디안) 이 계산되어 값이 전혀 달라집니다. 단위 변환을 빠뜨리는 것이 이 단원에서 가장 흔한 오류입니다.'},
  {t:'\\text{빗변}=\\frac{d}{\\cos \\theta}',
   s:'레이저 거리계는 빗변(시선 길이)을 잽니다. 그때는 밑변 대신 빗변을 알게 되므로 <b>sin 을 써서</b> 높이를 구합니다 — 무엇을 재느냐에 따라 쓰는 삼각비가 달라집니다.'}
 ],
 eq:'h = d · tan θ + e',
 what:'올려본각 θ 와 수평 거리 d 로 만들어지는 <b>직각삼각형</b>에서 높이를 구합니다. 올라가지 않고도 잴 수 있다는 것이 삼각비의 힘입니다.',
 probe:'각을 키워 보세요. 80° 근처에서 높이가 <b>급격히 치솟습니다.</b> tan 이 90° 에서 발산하기 때문인데, 그래서 실제 측량에서는 각이 너무 크면 작은 각도 오차가 큰 높이 오차로 번집니다. 눈높이를 0으로 바꿔 보면 결과가 얼마나 달라지는지도 확인하세요.',
 link:'삼각비 단원의 활용 도입으로 씁니다. 공식을 외우기 전에 “<b>무엇을 알고 무엇을 모르는가</b>”를 그림에 표시하게 하면 어떤 삼각비를 쓸지 학생이 스스로 정합니다. 운동장에서 각도기와 줄자로 실측하면 그대로 야외 활동이 됩니다.',
 next:[
  {lv:'바로',   t:'학교 건물 실제로 재기', d:'각도기(또는 휴대폰 수평계 앱)와 줄자로 우리 학교 건물의 각과 거리를 재어 넣습니다. 층수 × 3 m 어림값과 비교해 <b>오차가 몇 %</b> 인지 계산하세요.'},
  {lv:'심화',   t:'접근할 수 없는 대상 재기', d:'강 건너 나무처럼 밑변을 잴 수 없으면 어떻게 할까요? <b>두 지점에서 각을 두 번 재는</b> 방법을 세우고, 두 식을 연립해 높이를 구해 보세요.'},
  {lv:'프로젝트', t:'각도 오차가 만드는 높이 오차', d:'각을 ±1° 씩 흔들어 높이가 얼마나 달라지는지 표로 만듭니다. <b>각이 클수록 오차가 커지는 이유</b>를 tan 그래프의 기울기로 설명하고, 측량하기 좋은 각도 범위를 제안하세요.'}
 ]},

{tex:[
  {t:'\\text{공분산}=\\frac{1}{n}\\sum (x_i-\\bar{x})(y_i-\\bar{y})',
   s:'x 와 y 가 <b>평균에서 같은 쪽으로 함께 벗어나면</b> 곱이 양수, 반대쪽이면 음수입니다. 그 평균이 공분산이고, 부호가 곧 관계의 방향입니다.'},
  {t:'r=\\frac{\\text{공분산}}{\\sigma_x \\sigma_y}',
   s:'공분산은 <b>단위에 휘둘립니다.</b> 시간을 분으로 바꾸면 값이 60배가 됩니다. 각자의 표준편차로 나누면 단위가 지워지고 관계의 세기만 남습니다.'},
  {t:'-1 \\le r \\le 1',
   s:'<b>코시-슈바르츠 부등식</b>에서 나오는 성질입니다. 그래서 r 이 1을 넘는 값이 나오면 계산이 틀린 것이고, 대개 <b>표준편차로 나누는 단계를 빠뜨린</b> 경우입니다.'},
  {t:'r(x,y)=r(ax+b,\\;cy+d) \\quad (a,c>0)',
   s:'단위를 바꾸거나 전체를 평행이동해도 r 은 변하지 않습니다. 이것이 “표준화된 지표”라는 말의 뜻이며, 서로 다른 자료끼리 관계의 세기를 비교할 수 있는 이유입니다.'}
 ],
 eq:'r = 공분산 / (σx · σy),  −1 ≤ r ≤ 1',
 what:'두 변수가 <b>함께 움직이는 정도</b>를 하나의 수로 나타낸 것입니다. 부호는 방향(같이 커지나, 반대로 가나), 절댓값은 세기를 뜻하며, 단위와 무관하도록 표준편차로 나눕니다.',
 probe:'관계의 세기 슬라이더를 −100%에서 +100%까지 밀어 보며 점의 배열과 r 이 어떻게 대응하는지 보세요. 그다음 <b>구석에 이상치를 하나 클릭</b>해 보십시오. 점 하나가 r 을 얼마나 흔드는지가 이 실험의 핵심 장면입니다.',
 link:'중3 상관관계 또는 고1 통계의 도입으로 씁니다. 반드시 <b>“상관은 인과가 아니다”</b>까지 다루십시오 — r 이 커도 숨은 제3의 변수 때문일 수 있습니다. 학급 자료를 조사해 직접 r 을 구하게 하면 데이터 리터러시 활동이 됩니다.',
 next:[
  {lv:'바로',   t:'우리 반 자료로 r 구하기', d:'통학 거리와 등교 시간, 수면 시간과 집중도처럼 두 변수를 조사해 산점도를 그리고 r 을 손으로 계산합니다. <b>부호를 먼저 예측</b>하고 계산 결과와 맞춰 보세요.'},
  {lv:'심화',   t:'이상치 하나의 위력', d:'점 20개로 r ≈ 0.8 을 만든 뒤, 구석에 점 하나를 추가해 r 이 얼마까지 떨어지는지 기록합니다. <b>왜 한 점이 그렇게 큰 힘을 갖는지</b>를 공분산 식으로 설명해 보세요.'},
  {lv:'프로젝트', t:'상관은 인과가 아니다', d:'아이스크림 판매량과 익사 사고처럼 <b>r 은 높지만 인과가 아닌</b> 사례를 찾아, 숨은 제3의 변수를 밝히고 발표합니다. 뉴스 기사에서 실제 사례를 찾으면 더 좋습니다.'}
 ]},

{tex:[
  {t:'\\bar{x}=\\frac{1}{n}\\sum_{i=1}^{n} x_i',
   s:'모든 값을 더해 개수로 나눈 것이 평균입니다. <b>모든 값이 똑같은 무게로</b> 들어간다는 점이 곧 평균의 약점이 됩니다.'},
  {t:'\\bar{x}_{\\text{새}}-\\bar{x}=\\frac{\\Delta}{n}',
   s:'한 사람의 값만 Δ 만큼 올리면 평균은 <b>Δ/n 만큼</b> 따라 올라갑니다. 10명이면 5000만원을 올릴 때 평균이 500만원 오릅니다 — 한 사람이 전체를 끌고 갑니다.'},
  {t:'\\text{중앙값} : \\;x_{(1)} \\le x_{(2)} \\le \\cdots \\le x_{(n)} \\;\\text{에서 가운데 값}',
   s:'<b>순서대로 세운 뒤</b> 가운데를 고르므로, 맨 끝 값이 아무리 커져도 가운데 자리는 거의 그대로입니다. 정렬이 빠지면 중앙값이 아니라 그냥 “배열 가운데 값”이 되어 버립니다.'},
  {t:'|\\text{중앙값}_{\\text{새}}-\\text{중앙값}| \\le \\text{이웃한 두 값의 간격}',
   s:'이것이 중앙값이 <b>이상치에 강한(robust)</b> 이유입니다. 극단값을 아무리 키워도 중앙값은 바로 옆 값까지밖에 움직이지 않습니다.'}
 ],
 eq:'평균 = Σxᵢ / n,  중앙값 = 정렬 후 가운데 값',
 what:'자료 전체를 하나의 수로 요약하는 방법이 여러 가지라는 것이 핵심입니다. <b>평균은 모든 값을 반영</b>하지만 극단값에 끌려가고, <b>중앙값은 순위만 보므로</b> 극단값에 버팁니다.',
 probe:'사장님 연봉 슬라이더를 끝까지 올려 보세요. <b>파란 평균선은 위로 끌려가는데 초록 중앙값선은 거의 그대로</b>입니다. 동시에 “평균보다 적게 받는 사람 수”가 늘어나는데, 이것이 평균이 대표성을 잃었다는 신호입니다.',
 link:'중1 대푯값 단원의 도입입니다. 세 대푯값의 정의를 외우게 하는 대신 <b>“어떤 상황에서 무엇을 써야 하는가”</b>를 묻는 자리로 쓰십시오. 실제 뉴스의 “평균 연봉·평균 집값” 기사를 가져오면 그대로 비판적 읽기 활동이 됩니다.',
 next:[
  {lv:'바로',   t:'평균보다 적은 사람이 몇 명인가', d:'이상치를 키우며 <b>평균 미만인 사람 수</b>를 기록해 표로 만듭니다. 10명 중 9명이 평균 미만이 되는 순간을 찾고, 그때 “평균”이라는 말이 왜 오해를 부르는지 적어 보세요.'},
  {lv:'심화',   t:'최빈값과 절사평균', d:'값이 겹치도록 자료를 바꿔 <b>최빈값</b>을 만들어 보고, 위아래 10%를 잘라 내는 <b>절사평균</b>도 계산해 세 대푯값과 비교합니다. 어느 것이 “보통 사람”을 가장 잘 나타내나요?'},
  {lv:'프로젝트', t:'기사 속 대푯값 비판하기', d:'“평균 연봉·평균 집값·평균 자산” 기사를 찾아, <b>중앙값을 썼다면 숫자가 어떻게 달라졌을지</b> 추정하고 기사에 대한 반론을 씁니다. 통계청 자료의 중앙값을 찾아 근거로 삼으세요.'}
 ]},

{tex:[
  {t:'N=k^{n}',
   s:'각 자리마다 <b>k 가지를 독립적으로</b> 고를 수 있으므로, 곱의 법칙에 따라 자리 수 n 만큼 곱합니다. 같은 문자를 여러 번 써도 되므로 <b>중복순열</b>입니다.'},
  {t:'{}_{k}P_{n}=k(k-1)(k-2)\\cdots(k-n+1)',
   s:'같은 문자를 두 번 못 쓰는 경우라면 이 순열 공식을 씁니다. 비밀번호는 <b>중복을 허용</b>하므로 이 식을 쓰면 가짓수를 실제보다 적게 잡게 됩니다 — 두 상황을 구별하는 것이 이 단원의 핵심입니다.'},
  {t:'t=\\frac{k^{n}}{2v}',
   s:'평균적으로 전체의 <b>절반</b>쯤 시도하면 맞습니다. 그것을 초당 시도 횟수 v 로 나누면 걸리는 시간이 나옵니다.'},
  {t:'\\frac{k^{n+1}}{k^{n}}=k \\qquad \\frac{(k+1)^{n}}{k^{n}}=\\left(1+\\frac{1}{k}\\right)^{n}',
   s:'<b>자리 수를 하나 늘리면 정확히 k 배</b>가 되지만, 문자 종류를 하나 늘리면 (1 + 1/k)ⁿ 배입니다. 어느 쪽이 유리한지는 k 와 n 의 크기에 달렸습니다 — 직접 비교해 보게 하십시오.'}
 ],
 eq:'N = kⁿ,  걸리는 시간 t = kⁿ / (2v)',
 what:'각 자리를 <b>서로 독립적으로</b> 고르므로 곱의 법칙이 그대로 적용됩니다. 문자 종류가 밑, 자리 수가 지수인 <b>중복순열</b>이며, 지수가 왜 무서운지를 보여 주는 가장 현실적인 예입니다.',
 probe:'자리 수를 1씩 올리며 시간이 어떻게 변하는지 보세요. 8자리에서 <b>초 단위였던 것이 12자리에서 연 단위</b>로 바뀝니다. 그다음 자리 수는 그대로 두고 문자 종류만 바꿔 어느 쪽이 더 강력한지 비교하십시오.',
 link:'중2 경우의 수 단원의 마무리로 씁니다. 곱의 법칙을 계산 규칙으로만 배우면 남지 않지만, “내 비밀번호가 몇 초에 뚫리나”로 물으면 학생이 스스로 자리 수를 세게 됩니다. 정보 보안 수업과 연계하기도 좋습니다.',
 next:[
  {lv:'바로',   t:'내 비밀번호 진단하기', d:'실제로 쓰는 비밀번호의 자리 수와 문자 종류를 넣어 <b>몇 초·몇 년</b>이 걸리는지 확인합니다. 안전하려면 몇 자리가 필요한지 스스로 기준을 정해 보세요.'},
  {lv:'심화',   t:'자리 수 vs 문자 종류', d:'“10자리 숫자만”과 “6자리 대소문자+숫자+기호” 중 어느 쪽이 강한지 계산으로 비교합니다. <b>같은 안전도를 만드는 조합</b>을 여러 개 찾아 표로 만드세요.'},
  {lv:'프로젝트', t:'사전 공격이 왜 더 무서운가', d:'사람들이 쓰는 비밀번호는 고르게 흩어져 있지 않습니다. 자주 쓰는 단어 목록을 먼저 시도하면 탐색 공간이 얼마나 줄어드는지 추정하고, <b>안전한 비밀번호의 조건</b>을 제안하세요.'}
 ]},

{tex:[
  {t:'P(\\text{한 번에 당첨})=p',
   s:'한 번 뽑을 때 당첨될 확률입니다. 0.5% 는 p = 0.005 이며, 200번 뽑는다고 200 × 0.005 = 1 즉 “반드시 나온다”가 <b>아닙니다.</b>'},
  {t:'P(\\text{n번 모두 꽝})=(1-p)^{n}',
   s:'매번 독립이므로 꽝일 확률을 n 번 곱합니다. 여기서 <b>곱셈정리</b>가 쓰입니다.'},
  {t:'P(\\text{적어도 한 번})=1-(1-p)^{n}',
   s:'“적어도 한 번”은 직접 세기 어렵습니다. <b>여사건</b>(한 번도 안 나옴)을 구해 1에서 빼는 것이 훨씬 쉽습니다 — 이 발상이 이 단원의 요점입니다.'},
  {t:'p=0.005,\\; n=200 \\;\\Rightarrow\\; 1-0.995^{200} \\approx 0.633',
   s:'200번 뽑아도 <b>약 63%</b>입니다. 100%가 아닙니다. 세 번에 한 번은 200번을 뽑고도 못 얻는다는 뜻입니다.'},
  {t:'\\frac{X_n}{n} \\;\\to\\; p \\quad (n \\to \\infty)',
   s:'시행을 늘리면 상대도수가 확률로 다가갑니다(<b>큰 수의 법칙</b>). 화면의 파란 곡선이 주황 선에 붙는 과정이 바로 이것입니다.'}
 ],
 eq:'P(적어도 한 번) = 1 − (1 − p)ⁿ',
 what:'“확률 0.5%”가 무슨 뜻인지 정확히 다루는 실험입니다. 여러 번 시행할 때의 확률은 <b>여사건</b>으로 구하고, 시행을 늘리면 실험 확률이 이론 확률로 수렴합니다.',
 probe:'뽑는 횟수를 10에서 3000까지 늘려 보세요. 처음에는 곡선이 크게 요동치다가 점점 이론선에 붙습니다. <b>「다시 뽑기」를 여러 번 눌러</b> 같은 조건에서도 결과가 매번 다르다는 것, 그러나 큰 n 에서는 늘 비슷해진다는 것을 확인하십시오.',
 link:'중2 확률 단원, 특히 <b>여사건</b>을 배우는 자리에서 씁니다. “적어도 하나”라는 표현이 나오면 여사건을 떠올리는 습관을 이 실험으로 만들 수 있습니다. 게임 확률 공시 문제와 연결하면 소비자 교육이 됩니다.',
 next:[
  {lv:'바로',   t:'50%를 넘는 지점 찾기', d:'당첨 확률을 고정하고 뽑는 횟수를 늘리며 <b>「적어도 한 번」이 50%를 넘는 순간</b>을 찾습니다. 1 − (1−p)ⁿ ≥ 0.5 를 로그로 풀어 그 값을 계산으로도 확인하세요.'},
  {lv:'심화',   t:'천장 제도의 수학', d:'“N번 뽑으면 반드시 당첨”이라는 천장 제도가 있을 때 <b>기댓값</b>이 어떻게 달라지는지 계산합니다. 제도가 없을 때와 비교해 보세요.'},
  {lv:'프로젝트', t:'게임 확률 공시 검증', d:'실제 게임의 공시 확률을 찾아, 커뮤니티에 올라온 사람들의 뽑기 기록과 비교합니다. <b>공시 확률이 맞다고 볼 수 있는지</b>를 시행 횟수와 함께 논증하세요.'}
 ]},

{tex:[
  {t:'z=\\frac{x-m}{\\sigma}',
   s:'평균을 빼서 <b>중심을 0으로</b> 옮기고, 표준편차로 나눠 <b>흩어진 정도를 1로</b> 맞춥니다. 두 단계를 모두 거쳐야 서로 다른 시험을 비교할 수 있습니다.'},
  {t:'E(z)=0, \\qquad \\sigma(z)=1',
   s:'그래서 z 는 어떤 시험이든 <b>평균 0, 표준편차 1</b>이 됩니다. 단위가 사라지므로 국어 점수와 수학 점수를 같은 자로 잴 수 있습니다.'},
  {t:'x=m+z\\sigma',
   s:'거꾸로 z 를 알면 원점수를 복원할 수 있습니다. z = 1 은 <b>평균보다 표준편차 하나만큼 위</b>라는 뜻이고, 정규분포에서 이는 상위 약 15.9% 입니다.'},
  {t:'P(m-\\sigma \\le X \\le m+\\sigma) \\approx 0.683',
   s:'정규분포에서 평균 ±1σ 안에 약 68%, ±2σ 안에 약 95% 가 들어갑니다. 이 값을 외워 두면 z 만 보고도 <b>대략 몇 등급인지</b> 바로 가늠할 수 있습니다.'}
 ],
 eq:'z = (x − m) / σ',
 what:'원점수는 시험마다 난이도가 달라 그대로 비교할 수 없습니다. <b>평균을 빼고 표준편차로 나누어</b> 공통 자로 바꾼 것이 표준점수 z 이며, 백분위는 그 z 아래의 넓이입니다.',
 probe:'점수와 평균을 그대로 둔 채 <b>표준편차만</b> 움직여 보세요. 같은 78점인데 z 와 백분위가 크게 달라집니다. 표준편차가 작을수록 같은 점수 차이가 큰 등급 차이를 만든다는 것이 곡선의 폭에서 보입니다.',
 link:'확률과 통계의 정규분포 단원에서 씁니다. z 표를 찾는 연습에 앞서 <b>“왜 두 단계로 변환하는가”</b>를 먼저 겪게 하십시오. 실제 모의고사 성적표의 표준점수·백분위와 대조하면 학생의 몰입이 확실히 달라집니다.',
 next:[
  {lv:'바로',   t:'내 성적표로 확인하기', d:'모의고사 성적표의 원점수·평균·표준편차를 넣어 <b>표준점수와 백분위</b>가 성적표의 값과 맞는지 확인합니다. 다르다면 왜 다른지 찾아보세요.'},
  {lv:'심화',   t:'두 과목 비교하기', d:'국어 80점(평균 70, σ 8)과 수학 75점(평균 60, σ 15) 중 <b>어느 쪽이 더 잘한 것</b>인지 z 로 판정합니다. 원점수로는 왜 비교할 수 없는지 설명하세요.'},
  {lv:'프로젝트', t:'등급 컷은 어떻게 정해지나', d:'상위 4%, 11%, 23%… 라는 등급 비율을 z 로 바꿔 <b>등급 경계의 표준점수</b>를 구합니다. 표준편차가 달라지면 등급 컷 원점수가 어떻게 움직이는지 표로 만드세요.'}
 ]},

{tex:[
  {t:'\\text{단리} : S=P(1+rn), \\qquad \\text{복리} : S=P(1+r)^{n}',
   s:'단리는 <b>원금에만</b> 이자가 붙어 n 에 대한 일차식이고, 복리는 <b>이자에도 이자가</b> 붙어 지수식이 됩니다. 직선과 곡선의 차이가 여기서 나옵니다.'},
  {t:'2P=P(1+r)^{n} \\;\\Rightarrow\\; 2=(1+r)^{n}',
   s:'“두 배가 되는 때”를 물으면 <b>원금 P 가 약분됩니다.</b> 즉 두 배가 되는 햇수는 원금과 무관하고 이자율에만 달렸습니다.'},
  {t:'n=\\frac{\\log 2}{\\log (1+r)}',
   s:'지수에 있는 n 을 꺼내려면 로그를 취해야 합니다. 로그가 <b>“지수를 끌어내리는 도구”</b>라는 것이 이 한 줄에 들어 있습니다.'},
  {t:'\\log(1+r) \\approx r \\;\\Rightarrow\\; n \\approx \\frac{0.693}{r}=\\frac{69.3}{r(\\%)}',
   s:'r 이 작을 때 log(1+r) ≈ r 이므로 n ≈ 0.693/r 입니다. 69.3 대신 <b>약수가 많은 72</b>를 쓰면 암산이 쉬워서 “72의 법칙”이라 부릅니다 — 근사식이지 정확한 공식이 아닙니다.'}
 ],
 eq:'S = P(1 + r)ⁿ,  두 배 되는 햇수 n = log 2 / log(1 + r)',
 what:'이자가 <b>이자에도 붙는</b> 것이 복리입니다. 원금에만 붙는 단리는 직선, 복리는 지수 곡선이 되며, 기간이 길어질수록 둘의 차이가 걷잡을 수 없이 벌어집니다.',
 probe:'기간을 40년까지 늘려 보세요. 단리와 복리의 간격이 <b>기간의 제곱보다 빠르게</b> 벌어집니다. 그다음 원금을 바꿔 보면 <b>“두 배 되는 햇수”는 전혀 변하지 않는다는 것</b>을 확인할 수 있습니다 — 원금이 약분되기 때문입니다.',
 link:'대수의 지수함수와 로그를 하나로 잇는 자리입니다. “두 배가 되려면 몇 년?”을 물으면 학생이 스스로 2 = (1+r)ⁿ 을 세우고, 지수를 꺼내려다 로그를 요구하게 됩니다. 대출·적금 광고를 가져오면 금융 교육으로 확장됩니다.',
 next:[
  {lv:'바로',   t:'72의 법칙은 얼마나 정확한가', d:'이자율 1%·5%·10%·20% 에서 정확값과 72의 법칙 어림값을 표로 비교합니다. <b>어느 구간에서 잘 맞고 어디서 어긋나는지</b> 찾아보세요.'},
  {lv:'심화',   t:'왜 69.3이 아니라 72인가', d:'이론값은 69.3인데 관행은 72를 씁니다. <b>72의 약수를 모두 적어 보고</b>, 암산 편의와 근사 오차 사이의 맞바꿈을 설명해 보세요.'},
  {lv:'프로젝트', t:'대출 광고 뜯어보기', d:'실제 대출 상품의 연이율을 찾아 <b>원리금이 두 배가 되는 시점</b>을 계산합니다. 광고에 적힌 월 상환액과 총 상환액을 검산해 보고, 소비자에게 알려야 할 정보가 무엇인지 제안하세요.'}
 ]},

{tex:[
  {t:'\\log_{10}(ab)=\\log_{10}a+\\log_{10}b',
   s:'로그는 <b>곱셈을 덧셈으로</b> 바꿉니다. 그래서 값이 10배씩 커지는 자료가 로그 축에서는 일정한 간격으로 늘어섭니다.'},
  {t:'E \\propto 10^{1.5M} \\;\\Rightarrow\\; \\frac{E_8}{E_7}=10^{1.5}\\approx 31.6',
   s:'지진 규모는 <b>이미 로그 값</b>입니다. 규모가 1 커지면 에너지는 약 31.6배가 됩니다. “7과 8은 1 차이”라는 말이 왜 오해를 부르는지가 여기 있습니다.'},
  {t:'\\text{dB}=10\\log_{10}\\frac{I}{I_0}',
   s:'소리의 세기도 마찬가지입니다. 데시벨이 10 커지면 실제 세기는 <b>10배</b>입니다. 사람의 감각이 로그에 가깝기 때문에 이런 단위를 씁니다.'},
  {t:'y=ax^{k} \\;\\Rightarrow\\; \\log y=\\log a+k\\log x',
   s:'양쪽 축을 모두 로그로 바꾸면 거듭제곱 관계가 <b>직선</b>이 되고 기울기가 지수 k 가 됩니다. 로그 축은 보기 좋으라고 쓰는 게 아니라 <b>관계를 드러내는 도구</b>입니다.'}
 ],
 eq:'log(ab) = log a + log b,  규모 1 차이 = 에너지 약 31.6배',
 what:'값의 범위가 수십만 배로 벌어지는 자료는 보통 눈금에 담을 수 없습니다. 로그는 <b>곱셈을 덧셈으로</b> 바꾸어, 한 칸이 “10배”를 뜻하는 자를 만들어 줍니다.',
 probe:'같은 자료를 두 눈금으로 번갈아 보세요. 보통 눈금에서는 작은 값들이 <b>바닥에 붙어 서로 구별조차 안 됩니다.</b> 로그로 바꾸는 순간 모두가 비교 가능한 크기로 살아납니다. 자료를 바꿔 가며 배율과 log₁₀(배율)이 어떻게 대응하는지도 확인하세요.',
 link:'대수의 로그 단원에서 <b>“로그가 왜 필요한가”</b>에 답하는 자리입니다. 정의와 법칙을 먼저 가르치면 도구인지 모르고 끝나지만, 그릴 수 없는 자료를 먼저 보여 주면 로그가 해법으로 등장합니다. 지진·소음 뉴스와 연결하기 좋습니다.',
 next:[
  {lv:'바로',   t:'규모 1 차이는 몇 배인가', d:'지진 규모 5와 7의 에너지 비를 계산하고, 뉴스에서 “규모 7은 6보다 조금 강하다”처럼 쓴 표현을 찾아 <b>무엇이 틀렸는지</b> 지적해 보세요.'},
  {lv:'심화',   t:'양쪽 축을 모두 로그로', d:'거듭제곱 관계 y = axᵏ 인 자료를 만들어 양쪽 로그 축에 그리면 직선이 됩니다. <b>그 직선의 기울기가 k</b> 임을 확인하고, 자료에서 지수를 읽어내 보세요.'},
  {lv:'프로젝트', t:'로그 축으로 속인 그래프 찾기', d:'로그 축을 쓰면 급격한 증가가 완만해 보입니다. 뉴스·보고서에서 <b>축 선택으로 인상이 달라진 사례</b>를 찾아, 같은 자료를 두 눈금으로 다시 그려 비교 발표하세요.'}
 ]},

{tex:[
  {t:'\\text{평균속도}=\\frac{s(t+h)-s(t)}{h}',
   s:'두 시각 사이의 <b>위치 변화량을 시간으로 나눈 것</b>입니다. 그래프에서는 두 점을 잇는 <b>할선의 기울기</b>입니다.'},
  {t:'s(t)=2t^2+3t \\;\\Rightarrow\\; \\frac{s(t+h)-s(t)}{h}=4t+3+2h',
   s:'직접 전개해 보면 평균속도가 <b>4t + 3 + 2h</b> 로 정리됩니다. h 가 남아 있다는 것이 “구간의 길이가 답에 섞여 있다”는 뜻입니다.'},
  {t:'\\lim_{h \\to 0}(4t+3+2h)=4t+3',
   s:'h 를 0으로 보내면 <b>2h 항이 사라지고</b> 그 순간만의 속도가 남습니다. 이것이 미분계수 s′(t) 이며, 할선이 접선으로 바뀌는 순간입니다.'},
  {t:'s\'(t)=\\lim_{h \\to 0}\\frac{s(t+h)-s(t)}{h}',
   s:'미분계수의 정의 그 자체입니다. <b>h = 0 을 대입하는 것이 아니라</b> 0으로 “다가갈 때”의 값이라는 점이 핵심입니다 — 대입하면 분모가 0이 되어 버립니다.'}
 ],
 eq:'s′(t) = lim(h→0) [s(t+h) − s(t)] / h',
 what:'“한 순간의 속도”는 시간 간격이 0이면 정의할 수 없습니다. 그래서 <b>짧은 구간의 평균속도를 구한 뒤 구간을 0으로 좁혀 가는</b> 극한으로 정의합니다. 그 값이 접선의 기울기입니다.',
 probe:'h 를 2초에서 0.02초까지 줄여 보세요. <b>주황 할선이 빨간 접선에 겹쳐 갑니다.</b> 화면에 평균속도와 순간속도, 그리고 둘의 차이가 함께 나오므로 차이가 0으로 줄어드는 과정을 숫자로 따라갈 수 있습니다.',
 link:'미적분 I 의 미분계수 도입입니다. 정의식을 칠판에 먼저 쓰면 기호에 막히지만, <b>“단속 카메라는 어떻게 재는가”</b>로 시작하면 학생이 스스로 구간을 줄이자고 말합니다. 그 순간 극한이 필요해집니다.',
 next:[
  {lv:'바로',   t:'h를 줄이며 표 만들기', d:'h = 1, 0.5, 0.1, 0.01 일 때 평균속도를 기록해 표로 만듭니다. <b>어떤 값에 다가가는지</b> 예측하고 s′(t) = 4t + 3 과 맞춰 보세요.'},
  {lv:'심화',   t:'식으로 직접 유도하기', d:'s(t) = 2t² + 3t 로 (s(t+h) − s(t))/h 를 전개해 <b>4t + 3 + 2h</b> 를 얻고, h → 0 에서 2h 가 사라지는 과정을 손으로 씁니다. 다른 함수로도 해 보세요.'},
  {lv:'프로젝트', t:'구간 단속의 수학', d:'과속 단속에는 지점 단속과 구간 단속이 있습니다. <b>구간 단속은 평균속도, 지점 단속은 순간속도</b>를 잽니다. 두 방식이 각각 못 잡는 경우를 그래프로 그려 설명하고, 어느 쪽이 더 공정한지 논술하세요.'}
 ]},

{tex:[
  {t:'S=\\sum_{i=1}^{n} d_i \\equiv 0 \\pmod{10}',
   s:'끝에서 한 자리 걸러 두 배 한 값들(두 자리가 되면 9를 뺌)을 모두 더한 합 S 가 <b>10으로 나누어떨어져야</b> 올바른 번호입니다.'},
  {t:'2d-9 \\equiv 2d \\pmod{9}',
   s:'두 배 해서 두 자리가 되면 자릿수를 더하는데, 그것은 <b>9를 빼는 것</b>과 같습니다. 예를 들어 8 → 16 → 1+6 = 7 이고 16 − 9 = 7 입니다.'},
  {t:'S_{\\text{오타}}-S=\\Delta \\;\\text{또는}\\; 2\\Delta \\;\\Rightarrow\\; S_{\\text{오타}} \\ne 0 \\pmod{10}',
   s:'한 자리를 Δ 만큼 잘못 적으면 합이 Δ 또는 2Δ 만큼 어긋납니다. Δ 가 0이 아닌 한 나머지가 0이 될 수 없으므로 <b>오타가 반드시 걸립니다.</b>'}
 ],
 next:[
  {lv:'바로',   t:'무엇을 못 잡는지 찾기', d:'한 자리 오타는 반드시 잡힙니다. 그런데 <b>이웃한 두 자리를 맞바꾸면</b> 어떨까요? 여러 경우를 넣어 보고 잡히지 않는 조합을 찾아 그 이유를 나머지로 설명해 보세요.'},
  {lv:'심화',   t:'다른 검증식과 비교하기', d:'ISBN(13자리)은 1과 3을 번갈아 곱하고 10으로 나눕니다. 룬과 <b>가중치·나눗수가 왜 다른지</b> 비교하고, 각각 어떤 오류에 강한지 정리해 보세요.'},
  {lv:'프로젝트', t:'우리 학교 학번 검증코드 설계', d:'학번 뒤에 검증 숫자 한 자리를 붙이는 규칙을 직접 만듭니다. 조건은 <b>한 자리 오타와 두 자리 뒤바뀜을 모두 잡을 것</b>. 만든 규칙이 정말 그런지 시험해 보세요.'}
 ],
 eq:'검증 합 ≡ 0 (mod 10)',
 what:'끝에서 한 자리 걸러 두 배 하고(두 자리가 되면 자릿수를 더해) 전부 합한 값이 <b>10으로 나누어떨어지는지</b>만 봅니다. 나머지가 0이 아니면 잘못된 번호입니다. 중학교 “나머지” 개념 하나가 오타를 걸러내는 장치가 됩니다.',
 probe:'한 자리만 바꿔 보세요. 검증이 <b>반드시</b> 실패합니다. 어떤 자리를 바꿔도 실패하는지, 두 자리를 맞바꾸면 어떻게 되는지까지 시험해 보면 이 검사가 무엇을 잡고 무엇을 놓치는지가 드러납니다.',
 link:'합동식·나머지 단원의 마무리 활동으로 씁니다. 순수해 보이던 나머지 연산이 실제 결제 시스템을 떠받친다는 사실이 강한 동기가 되고, “왜 하필 10인가”를 물으면 진법 이야기로 확장됩니다.'},

{tex:[
  {t:'S(a,b)=\\sum_{i=1}^{n}\\left(y_i-(ax_i+b)\\right)^2',
   s:'“가장 알맞은 직선”을 <b>잔차의 제곱합이 최소</b>인 직선으로 정의합니다. 제곱을 쓰는 이유는 부호를 없애면서 큰 오차에 더 큰 벌점을 주기 위해서입니다.'},
  {t:'a=\\frac{\\sum (x_i-\\bar{x})(y_i-\\bar{y})}{\\sum (x_i-\\bar{x})^2}, \\quad b=\\bar{y}-a\\bar{x}',
   s:'S 를 a 와 b 로 각각 미분해 0으로 두고 풀면 이 두 식이 나옵니다. 분자는 <b>공분산</b>, 분모는 <b>x의 분산</b>에 해당합니다.'},
  {t:'R^2=1-\\frac{\\sum (y_i-\\hat{y}_i)^2}{\\sum (y_i-\\bar{y})^2}',
   s:'분모는 <b>평균 수평선</b>의 잔차제곱합, 분자는 우리 직선의 잔차제곱합입니다. 즉 R² 는 “평균만 쓰는 것보다 얼마나 나아졌는가”를 재는 값입니다.'}
 ],
 next:[
  {lv:'바로',   t:'우리 반 데이터로 직선 긋기', d:'학급의 키와 몸무게(또는 통학 거리와 등교 시간)를 모아 점으로 찍습니다. 손으로 그은 직선과 <b>최소제곱 직선</b>이 얼마나 다른지 잔차제곱합으로 비교해 보세요.'},
  {lv:'심화',   t:'이상치 한 점의 위력', d:'구석에 점 하나를 찍고 a·b·R² 가 얼마나 흔들리는지 기록합니다. 제곱 대신 <b>절댓값의 합</b>을 최소로 하면 왜 덜 흔들릴지 예상하고 확인해 보세요.'},
  {lv:'프로젝트', t:'상관은 인과가 아니다', d:'“공부 시간과 성적”처럼 상관이 높은 두 변수를 조사한 뒤, <b>숨은 제3의 변수</b>로 설명 가능한지 따져 봅니다. 상관계수만으로 인과를 주장할 수 없는 이유를 사례로 발표합니다.'}
 ],
 eq:'a = Σ(xᵢ − x̄)(yᵢ − ȳ) / Σ(xᵢ − x̄)² ,  b = ȳ − a·x̄',
 what:'점들을 지나는 직선은 무수히 많습니다. 그중 <b>잔차(점과 직선의 세로 거리)의 제곱합을 가장 작게</b> 만드는 직선 하나를 고르는 것이 최소제곱법입니다. “가장 알맞다”는 말이 여기서 비로소 계산 가능한 기준이 됩니다.',
 probe:'그래프를 클릭해 점을 더 찍어 보세요. 직선이 즉시 다시 계산됩니다. 한쪽 구석에 <b>이상치</b>를 하나 찍으면 직선이 그쪽으로 끌려가는데, 제곱합을 쓰기 때문에 멀리 있는 점 하나가 크게 작용한다는 것이 그대로 보입니다.',
 link:'일차함수와 통계를 잇는 자리입니다. 평균 높이의 수평선보다 기울어진 직선이 얼마나 더 나은가 — 그 비율이 바로 <b>결정계수 R²</b> 이므로, 이 실험 하나로 회귀와 R²를 한 흐름에 담을 수 있습니다.'},

{tex:[
  {t:'f(x)=(x-3)^2+1 \\;\\Rightarrow\\; f\'(x)=2(x-3)',
   s:'지금 서 있는 자리의 <b>접선의 기울기</b>입니다. 부호가 곧 “어느 쪽이 내리막인가”를 알려 줍니다 — 기울기가 양수면 왼쪽이, 음수면 오른쪽이 낮습니다.'},
  {t:'x_{n+1}=x_n-\\alpha f\'(x_n)',
   s:'기울기의 <b>반대 방향</b>으로 α 만큼 옮깁니다. 최솟값의 위치를 몰라도 한 걸음씩 내려갈 수 있다는 것이 이 식의 힘입니다.'},
  {t:'x_{n+1}-3=(1-2\\alpha)(x_n-3)',
   s:'식을 정리하면 목표 3 과의 거리가 매 걸음 <b>(1−2α)배</b>가 됩니다. 그래서 0 &lt; α &lt; 1 이면 수렴하고, α 가 1보다 크면 배율의 절댓값이 1을 넘어 <b>발산</b>합니다. 학습률을 왜 조심해야 하는지가 여기서 나옵니다.'}
 ],
 next:[
  {lv:'바로',   t:'발산하는 임계값 찾기', d:'학습률 α 를 조금씩 올리며 <b>어느 값부터 튕겨 나가는지</b> 찾습니다. 앞에서 유도한 배율 (1−2α) 로 그 임계값을 미리 계산해 두고 화면과 맞춰 보세요.'},
  {lv:'심화',   t:'봉우리가 여럿이면', d:'함수를 삼차식으로 바꾸면 극소가 둘 생깁니다. <b>시작점에 따라 다른 곳에 갇히는</b> 현상을 확인하고, 그것이 AI 학습에서 무슨 문제가 되는지 설명해 보세요.'},
  {lv:'프로젝트', t:'변수 두 개로 넓히기', d:'f(x, y) 로 확장해 등고선 위에서 내려가게 만듭니다. 각 방향의 기울기(편미분)를 어떻게 합쳐 <b>가장 가파른 방향</b>을 정하는지가 과제입니다.'}
 ],
 eq:'xₙ₊₁ = xₙ − α·f′(xₙ)',
 what:'최솟값의 위치를 몰라도, 지금 서 있는 자리의 <b>기울기</b>만 알면 어느 쪽으로 가야 낮아지는지 알 수 있습니다. 기울기의 반대 방향으로 조금씩 옮겨 가는 것이 전부입니다. 미분계수가 “접선의 기울기”를 넘어 <b>움직일 방향</b>이 되는 순간입니다.',
 probe:'학습률 α를 키워 보세요. 너무 크면 최솟값을 건너뛰어 <b>튕겨 나가고</b>, 너무 작으면 제자리걸음입니다. 시작점을 바꾸면 같은 곳으로 모이는지도 확인하십시오 — 이차함수에서는 모이지만 봉우리가 여럿이면 달라집니다.',
 link:'미분계수의 활용 단원에서 씁니다. “도함수가 0인 점”을 공식으로 외우는 대신, 기울기를 따라 내려가다 <b>기울기가 0이 되어 멈추는</b> 장면을 보여 주면 극값의 의미가 저절로 설명됩니다.'},

{tex:[
  {t:'P(\\text{점이 사분원 안})=\\frac{\\text{사분원 넓이}}{\\text{정사각형 넓이}}=\\frac{\\frac{1}{4}\\pi r^2}{r^2}=\\frac{\\pi}{4}',
   s:'점을 <b>고르게 무작위로</b> 뿌리면 어떤 영역에 들어갈 확률은 그 영역의 넓이에 비례합니다. 그래서 확률이 곧 넓이의 비가 되고, r² 이 약분되어 <b>반지름과 무관한 값 π/4</b> 만 남습니다.'},
  {t:'\\frac{k}{n} \\;\\to\\; \\frac{\\pi}{4} \\quad (n \\to \\infty)',
   s:'상대도수는 시행을 늘릴수록 확률에 가까워집니다(<b>큰 수의 법칙</b>). 여기서 k 는 사분원 안에 들어간 점의 개수입니다.'},
  {t:'\\pi \\approx 4\\cdot\\frac{k}{n}',
   s:'앞의 두 줄을 이으면 π 를 <b>세는 것만으로</b> 구할 수 있습니다. 넓이를 적분으로 구하지 않고 확률로 대신한 것입니다.'},
  {t:'\\text{표준편차} \\propto \\frac{1}{\\sqrt{n}}',
   s:'오차는 n 에 반비례하는 게 아니라 <b>√n 에 반비례</b>합니다. 정확도를 10배 올리려면 점을 100배 뿌려야 한다는 뜻이고, 실험에서 값이 좀처럼 안정되지 않는 이유가 이것입니다.'}
 ],
 next:[
  {lv:'바로',   t:'오차가 √n 에 반비례하는지 확인', d:'점 100개·1,000개·10,000개로 각각 다섯 번씩 돌려 <b>값이 흩어진 정도</b>를 재 봅니다. 10배 늘릴 때 오차가 정말 약 3배 줄어드는지 확인하세요.'},
  {lv:'심화',   t:'다른 도형의 넓이 재기', d:'원 대신 타원이나 함수 아래 영역으로 바꿔 같은 방법으로 넓이를 구합니다. <b>적분으로 구하기 어려운 도형일수록</b> 이 방법이 강해지는 이유를 설명해 보세요.'},
  {lv:'프로젝트', t:'뷔퐁의 바늘', d:'평행선 위에 바늘을 떨어뜨려 π 를 구하는 고전 실험을 재현합니다. 왜 여기서도 π 가 나오는지 <b>각도와 위치의 확률</b>로 설명하는 것이 핵심입니다.'}
 ],
 eq:'π ≈ 4 × (원 안의 점 수) / (전체 점 수)',
 what:'정사각형 안에 점을 무작위로 뿌리면, 사분원 안에 들어갈 확률이 <b>넓이의 비</b>와 같아집니다. 그 비가 π/4 이므로 4를 곱하면 π가 나옵니다. <b>확률로 넓이를 재는</b> 발상입니다.',
 probe:'점의 개수를 늘려 보세요. 처음에는 값이 크게 흔들리다가 점점 3.14 근처로 <b>수렴</b>합니다. 몇 번을 다시 돌려도 매번 조금씩 다른 값이 나오는 것도 보십시오 — 시행 횟수와 오차의 관계가 그대로 드러납니다.',
 link:'확률과 넓이를 잇는 활동이자 <b>큰 수의 법칙</b>의 시각적 증거입니다. “왜 많이 해야 믿을 수 있나”라는 질문에 대한 답을 학생이 직접 만들어 냅니다.'},

{tex:[
  {t:'\\vec{a}\\cdot\\vec{b}=\\left|\\vec{a}\\right|\\left|\\vec{b}\\right|\\cos \\theta',
   s:'내적의 정의입니다. 여기에 이미 <b>사잇각이 들어 있다</b>는 점이 출발점입니다.'},
  {t:'\\cos \\theta=\\frac{\\vec{a}\\cdot\\vec{b}}{\\left|\\vec{a}\\right|\\left|\\vec{b}\\right|}=\\frac{a_1b_1+a_2b_2}{\\sqrt{a_1^2+a_2^2}\\,\\sqrt{b_1^2+b_2^2}}',
   s:'정의를 cos θ 에 대해 풀고 성분으로 바꾼 것입니다. 분모의 두 근호가 각각 <b>벡터의 길이</b>입니다.'},
  {t:'\\cos(k\\vec{a},\\vec{b})=\\frac{k(\\vec{a}\\cdot\\vec{b})}{k\\left|\\vec{a}\\right|\\left|\\vec{b}\\right|}=\\cos(\\vec{a},\\vec{b}) \\quad (k>0)',
   s:'<b>왜 크기로 나누는가에 대한 답입니다.</b> 벡터를 k배 늘려도 값이 변하지 않습니다. 즉 길이를 지우고 <b>방향만</b> 남기는 것이 이 나눗셈의 목적입니다. 내적만 쓰면 많이 본 사람이 무조건 1등이 되는 이유가 여기 있습니다.'},
  {t:'-1 \\le \\cos \\theta \\le 1',
   s:'그래서 유사도는 반드시 −1과 1 사이입니다. 이 범위를 벗어난 값이 나오면 <b>크기로 나누는 단계를 빠뜨린 것</b>입니다.'}
 ],
 next:[
  {lv:'바로',   t:'차원을 하나 늘리기', d:'액션·로맨스에 코미디를 더해 <b>3차원 벡터</b>로 만듭니다. 성분이 하나 늘어도 공식이 그대로인지 확인하고, 화면에 그리기 어려워지는 대신 무엇이 좋아지는지 말해 보세요.'},
  {lv:'심화',   t:'거리로 재면 답이 달라지는가', d:'같은 데이터를 <b>유클리드 거리</b>로 정렬해 코사인 유사도 순위와 비교합니다. 순위가 뒤바뀌는 사람을 찾아 그 이유를 벡터의 길이로 설명해 보세요.'},
  {lv:'프로젝트', t:'우리 반 추천 시스템', d:'학급 설문으로 각자의 취향 벡터를 모아 “나와 가장 비슷한 세 사람”을 찾아 줍니다. 추천이 <b>편향되거나 좁아지는 문제</b>가 생기는지도 함께 점검합니다.'}
 ],
 eq:'cos θ = (a · b) / (|a||b|)',
 what:'취향을 벡터로 보면 “비슷하다”는 말은 <b>사잇각이 작다</b>는 뜻이 됩니다. 내적만 쓰면 벡터가 긴 사람이 무조건 이기므로, 각자의 <b>크기로 나누어</b> 방향만 남깁니다. 정규화가 왜 필요한지가 이 한 줄에 들어 있습니다.',
 probe:'내 취향 슬라이더를 돌려 보세요. 추천 대상이 언제 바뀌는지 관찰하십시오. 크기는 크지만 방향이 다른 벡터와, 작지만 방향이 같은 벡터 중 <b>무엇이 더 비슷한지</b>가 이 실험의 핵심 질문입니다.',
 link:'벡터의 내적 단원에서 씁니다. 내적을 계산 규칙으로만 배우면 남지 않지만, “사잇각을 재는 도구”로 쓰면 의미가 남습니다. 손으로 사잇각을 구해 화면 값과 대조하게 하십시오.'},

{tex:[
  {t:'g(i,j)=\\sum_{u=-1}^{1}\\sum_{v=-1}^{1} f(i+u,\\,j+v)\\,k(u,v)',
   s:'픽셀 하나의 새 밝기는 <b>주변 3×3 아홉 개</b>에 커널의 아홉 성분을 각각 곱해 모두 더한 값입니다. 두 겹의 시그마가 “가로 3칸 × 세로 3칸”을 뜻합니다.'},
  {t:'f \\equiv c \\;\\Rightarrow\\; g=c\\sum_{u}\\sum_{v} k(u,v)',
   s:'밝기가 어디나 같은 c 인 평평한 그림을 넣어 보면 답이 나옵니다. c 를 밖으로 빼면 남는 것은 <b>커널 성분의 총합</b>뿐입니다.'},
  {t:'\\sum k=1 \\;\\Rightarrow\\; g=c \\qquad \\sum k=0 \\;\\Rightarrow\\; g=0',
   s:'<b>이것이 커널 성분의 합이 왜 중요한지에 대한 답입니다.</b> 평균(흐리게) 커널은 합이 1이라 평평한 곳의 밝기를 그대로 두고, 경계 검출 커널은 합이 0이라 평평한 곳을 <b>모두 0(검정)</b>으로 만듭니다. 그래서 밝기가 변하는 자리만 살아남아 윤곽선이 보입니다.'},
  {t:'k=\\frac{1}{9}\\left[1\\;1\\;1\\;;\\;1\\;1\\;1\\;;\\;1\\;1\\;1\\right] \\;\\Rightarrow\\; g=\\text{주변 9칸의 평균}',
   s:'평균 커널이 왜 흐리게 만드는지도 같은 식에서 나옵니다. 아홉 값을 더해 9로 나눈 것이 <b>산술평균</b>이고, 평균을 내면 튀는 값이 눌려 경계가 부드러워집니다.'}
 ],
 next:[
  {lv:'바로',   t:'세로선만 찾는 커널 만들기', d:'가로선 강조 커널의 <b>행과 열을 바꿔</b> 넣으면 무엇이 강조될까요? 예상을 먼저 적고 확인한 뒤, 왜 그렇게 되는지 3×3 계산으로 설명해 보세요.'},
  {lv:'심화',   t:'두 번 걸면 어떻게 되는가', d:'흐리게를 두 번 적용한 것과 한 번에 5×5 커널로 적용한 것을 비교합니다. 순서를 바꿔도 결과가 같은지(<b>교환법칙</b>) 확인해 보세요.'},
  {lv:'프로젝트', t:'경계 검출로 사진 윤곽 따기', d:'실제 사진을 흑백 격자로 바꿔 넣고 윤곽선을 뽑습니다. 잡음이 많은 사진에서는 <b>먼저 흐리게 한 뒤</b> 경계를 찾는 것이 왜 더 좋은지 실험으로 보이세요.'}
 ],
 eq:'출력(i, j) = Σ Σ 입력(i+u, j+v) × 커널(u, v)',
 what:'픽셀 하나를 바꿀 때 <b>그 주변 3×3</b>을 함께 봅니다. 아홉 개 값에 커널의 아홉 성분을 각각 곱해 모두 더한 값이 새 밝기가 됩니다. 행렬의 성분별 곱과 합이 “특징을 뽑아낸다”는 말의 실체입니다.',
 probe:'커널을 바꿔 가며 결과를 비교하세요. 경계 검출은 밝기가 <b>급변하는 곳</b>만 밝아지고, 평균 커널은 흐려집니다. 평균 커널의 성분을 모두 더하면 1이 되는데, 왜 그래야 하는지 물어보십시오.',
 link:'행렬 단원의 실생활 연결점입니다. 픽셀 하나를 골라 3×3 계산을 손으로 해 보게 하면, 행렬 연산이 추상적 규칙이 아니라 <b>화면에서 벌어지는 일</b>이 됩니다.'},

{tex:[
  {t:'y=a_1\\sin x+a_2\\sin 2x+a_3\\sin 3x',
   s:'기본음과 그 <b>정수배 진동수</b>(배음)를 겹친 것입니다. 배음은 위상을 밀어 만드는 것이 아니라 진동수를 정수배로 바꿔 만듭니다.'},
  {t:'\\sin(nx) \\;\\text{의 주기}=\\frac{2\\pi}{n}',
   s:'n 배음의 주기는 기본음 주기의 <b>1/n</b> 입니다. 즉 기본음이 한 번 도는 동안 n 배음은 정확히 n 번 돕니다.'},
  {t:'y(x+2\\pi)=\\sum a_n \\sin\\left(n x+2\\pi n\\right)=\\sum a_n \\sin (nx)=y(x)',
   s:'<b>합성 파형의 주기가 왜 기본음과 같은지에 대한 증명입니다.</b> x 를 2π 만큼 밀면 각 항의 각도가 2πn 만큼 늘어나는데, n 이 정수이므로 sin 값이 전혀 변하지 않습니다. 그래서 모양은 울퉁불퉁해져도 <b>주기는 그대로</b>이고, 그 결과 음높이는 같은데 음색만 달라집니다.'},
  {t:'\\left|y\\right| \\le a_1+a_2+a_3',
   s:'삼각부등식으로 진폭의 상한이 나옵니다. 그래서 화면에 그릴 때 <b>진폭의 합으로 나누어</b> 주면 어떤 값을 넣어도 그래프가 화면 밖으로 잘리지 않습니다.'}
 ],
 next:[
  {lv:'바로',   t:'홀수배음만 vs 짝수배음만', d:'2·4배음만 켠 소리와 3·5배음만 켠 소리를 번갈아 들어 봅니다. <b>파형의 대칭성</b>이 어떻게 달라지는지 눈으로도 확인하세요.'},
  {lv:'심화',   t:'사각파를 만들어 보기', d:'홀수배음의 진폭을 1, 1/3, 1/5, 1/7 … 로 주면 파형이 점점 <b>사각파에 가까워집니다.</b> 항을 늘릴수록 어떤 모양으로 수렴하는지 관찰하고 설명해 보세요 — 푸리에 급수의 직관입니다.'},
  {lv:'프로젝트', t:'진짜 악기 소리 분석', d:'피아노와 기타로 같은 음을 녹음해 파형을 비교합니다. 어느 배음이 강한지 찾아 실험실에서 <b>그 소리를 재현</b>해 보고, 얼마나 비슷한지 평가합니다.'}
 ],
 eq:'y = a₁sin x + a₂sin 2x + a₃sin 3x',
 what:'음의 높낮이는 기본음이 정하고, <b>음색</b>은 배음이 얼마나 섞였는지가 정합니다. 배음은 진동수가 <b>정수배</b>인 파동이며, 여러 사인함수를 더하면 주기는 그대로인 채 모양만 달라집니다.',
 probe:'2배음·3배음 진폭을 올려 보세요. 파형이 매끈한 사인파에서 울퉁불퉁한 모양으로 바뀌고, <b>소리도 함께 달라집니다.</b> 그런데 합성 파형의 주기는 기본음과 같습니다 — 왜 그런지 설명하게 하십시오.',
 link:'삼각함수의 합을 다루는 자리이자 주기·진폭·위상을 구분시키는 활동입니다. 귀로 듣고 눈으로 보는 확인이 동시에 되므로, 삼각함수 단원의 도입으로 특히 강합니다.'},

{tex:[
  {t:'y=f(x) \\;\\Rightarrow\\; x=f(y) \\;\\Rightarrow\\; y=f^{-1}(x)',
   s:'역함수를 구하는 절차 자체입니다. <b>x 와 y 를 맞바꾼 뒤 y 에 대해 푸는 것</b>이며, 이 “맞바꿈”이 그래프에서는 y = x 대칭이 됩니다.'},
  {t:'(a,\\,b) \\in f \\;\\Longleftrightarrow\\; (b,\\,a) \\in f^{-1}',
   s:'원함수 위의 점과 역함수 위의 점은 <b>좌표가 서로 뒤바뀝니다.</b> 두 점을 이은 선분의 중점이 y = x 위에 있고 그 선분이 y = x 와 수직이므로, 두 그래프는 y = x 에 대칭입니다.'},
  {t:'y=\\sqrt{x-2}+1 \\;\\Rightarrow\\; (y-1)^2=x-2 \\;\\Rightarrow\\; f^{-1}(x)=(x-1)^2+2',
   s:'양변에서 1을 빼고 제곱하면 이차식이 나옵니다. 그런데 <b>제곱하는 순간 아래쪽 가지가 함께 생깁니다</b> — 그대로 두면 함수가 아니게 됩니다.'},
  {t:'x \\ge 2,\\; y \\ge 1 \\;\\Rightarrow\\; f^{-1} \\text{의 정의역} : x \\ge 1',
   s:'<b>원함수의 치역이 역함수의 정의역이 됩니다.</b> 그래서 x ≥ 1 로 제한해야 하고, 이 한 줄을 빠뜨리는 것이 이 단원에서 가장 흔한 감점 요인입니다.'},
  {t:'f(f^{-1}(x))=\\sqrt{(x-1)^2}+1=\\left|x-1\\right|+1=x \\quad (x \\ge 1)',
   s:'합성으로 검증합니다. √(제곱)이 절댓값이 되는 것을 처리하고, x ≥ 1 이므로 |x−1| = x−1 이 되어 <b>정확히 x 로 돌아옵니다.</b>'}
 ],
 next:[
  {lv:'바로',   t:'교점은 언제 y = x 위에 있나', d:'일차함수에서 f(x) = x 를 풀어 교점을 구하고 그 점이 <b>왜 y = x 위에 있는지</b> 설명합니다. 교점이 y = x 위에 없는 경우도 있는지 찾아보세요.'},
  {lv:'심화',   t:'정의역을 왜 제한하나', d:'y = x² 의 정의역을 x ≥ 0 으로 제한하지 않으면 역함수가 없습니다. <b>일대일 대응</b>이 왜 필요한지 그래프로 설명하고, 제한을 x ≤ 0 으로 바꾸면 역함수가 어떻게 달라지는지 구해 보세요.'},
  {lv:'프로젝트', t:'대칭이동으로 암호 만들기', d:'좌표를 맞바꾸는 규칙으로 도형을 옮겨 간단한 암호를 설계합니다. <b>역함수를 적용하면 원래대로 돌아오는지</b> 확인하고, 점대칭·평행이동을 섞으면 해독이 얼마나 어려워지는지 논의하세요.'}
 ],
 eq:'(a, b) ∈ f  ⟺  (b, a) ∈ f⁻¹,  두 그래프는 y = x 에 대칭',
 what:'역함수는 <b>대응을 거꾸로 보는 것</b>입니다. x 와 y 를 맞바꾸는 하나의 조작이, 함수에서는 “역함수”로 도형에서는 “y = x 대칭이동”으로 불릴 뿐 같은 일입니다.',
 probe:'슬라이더를 움직이면 대응점 두 개가 <b>빨간 선분으로 이어져</b> 좌표가 뒤바뀌는 것이 보입니다. 무리함수를 골라 역함수가 <b>포물선의 위쪽 가지만</b>인 것을 확인하고, <b>점대칭 보기</b>를 켜서 “좌표 맞바꾸기”와 “부호 뒤집기”가 어떻게 다른지 비교하십시오.',
 link:'공통수학2 역함수·무리함수 단원의 발견 활동입니다. 공식을 주지 말고 여러 함수의 역함수를 직접 구하게 한 뒤 <b>공통점을 학생이 말하게</b> 하십시오. 도형의 y = x 대칭이동 [10공수2-01-07] 과 하나로 이으면 통합적 사고가 완성됩니다.'},

{tex:[
  {t:'S_n=\\sum_{k=1}^{n} a_k, \\qquad \\sum_{k=1}^{\\infty} a_k=\\lim_{n \\to \\infty} S_n',
   s:'급수의 합은 <b>부분합 수열의 극한</b>으로 정의합니다. “무한히 더한다”가 아니라 “부분합이 어디로 가는가”를 묻는 것입니다.'},
  {t:'\\sum_{k=1}^{\\infty} ar^{k-1}=\\frac{a}{1-r} \\quad (\\left|r\\right|<1)',
   s:'등비급수는 <b>|r| &lt; 1</b> 일 때만 수렴합니다. 공비가 1보다 크면 항이 커지므로 부분합이 끝없이 늘어납니다.'},
  {t:'a_k \\to 0 \\;\\;\\text{이지만}\\;\\; \\sum \\frac{1}{k} \\to \\infty',
   s:'<b>항이 0으로 가는 것은 수렴의 필요조건일 뿐 충분조건이 아닙니다.</b> 조화급수가 그 반례입니다 — 항은 0에 가까워지는데 합은 발산합니다.'},
  {t:'\\sum_{k=1}^{2^m} \\frac{1}{k} > 1+\\frac{m}{2}',
   s:'조화급수가 왜 발산하는지에 대한 증명입니다. 항을 2배씩 묶으면 각 묶음의 합이 <b>항상 1/2 이상</b>이므로, 묶음을 계속 더하면 얼마든지 커집니다. 다만 아주 느려서 화면으로는 수렴처럼 보입니다.'}
 ],
 next:[
  {lv:'바로',   t:'조화급수가 2를 넘는 지점 찾기', d:'항을 늘리며 부분합이 2, 3, 4를 넘는 항의 개수를 기록합니다. <b>1 늘어날 때마다 필요한 항이 몇 배가 되는지</b> 표로 만들어 보세요.'},
  {lv:'심화',   t:'p급수의 경계 찾기', d:'Σ 1/nᵖ 에서 p 를 0.5, 1, 1.5, 2 로 바꿔 가며 수렴 여부를 확인하고, <b>수렴과 발산의 경계가 p = 1</b> 임을 실험으로 확인하세요.'},
  {lv:'프로젝트', t:'반복 알고리즘은 언제 멈추나', d:'프로그램이 “충분히 수렴했다”고 판단하는 기준(항의 크기? 부분합의 변화량?)을 직접 정하고, <b>조화급수에서 그 기준이 왜 위험한지</b> 보이세요.'}
 ],
 eq:'Σaₖ = lim Sₙ,  등비급수는 |r| < 1 일 때 a/(1−r)',
 what:'급수의 합은 <b>부분합 수열의 극한</b>입니다. 항을 아무리 더해도 어떤 값에 다가가면 수렴, 끝없이 커지면 발산이며, 항이 0으로 간다고 해서 반드시 수렴하지는 않습니다.',
 probe:'급수를 바꿔 가며 항을 1에서 120까지 늘려 보세요. 등비급수는 주황 극한선에 금방 붙지만, <b>조화급수는 계속 조금씩 올라갑니다.</b> 120항에서도 멈추지 않는 것을 보고 “느린 것과 수렴하는 것은 다르다”를 말하게 하십시오.',
 link:'미적분Ⅱ 수열의 극한·급수 단원의 도입입니다. 수렴판정법을 배우기 전에 <b>“왜 판정법이 필요한가”</b>를 먼저 겪게 하는 자리입니다. 조화급수 하나로 그 필요성이 설명됩니다.'},

{tex:[
  {t:'f(x) \\approx \\sum_{k=0}^{n} \\frac{f^{(k)}(0)}{k!}x^{k}',
   s:'원함수를 <b>0에서의 미분계수들</b>로 만든 다항식으로 흉내 냅니다. k! 로 나누는 이유는 k번 미분했을 때 값이 맞아떨어지게 하기 위해서입니다.'},
  {t:'\\sin x \\approx x-\\frac{x^3}{3!}+\\frac{x^5}{5!}-\\cdots',
   s:'sin 은 홀수 차수만 남습니다. 원점에서 <b>기함수</b>이기 때문입니다. 첫 항 x 만 써도 작은 각에서는 꽤 정확합니다 — 물리에서 쓰는 sin θ ≈ θ 가 이것입니다.'},
  {t:'\\ln(1+x)=x-\\frac{x^2}{2}+\\frac{x^3}{3}-\\cdots \\quad (\\left|x\\right|<1)',
   s:'<b>수렴반경이 1입니다.</b> |x| &gt; 1 에서는 항이 커져 버려서 차수를 올릴수록 오히려 원함수에서 멀어집니다.'},
  {t:'\\left|R_n(x)\\right| \\le \\frac{M\\left|x\\right|^{n+1}}{(n+1)!}',
   s:'오차의 상한입니다. <b>x 가 0에 가까울수록, n 이 클수록</b> 오차가 급격히 줄어듭니다. 분모의 계승이 지수보다 빨리 커지기 때문에 원점 근처에서는 몇 항만으로도 충분합니다.'}
 ],
 next:[
  {lv:'바로',   t:'몇 차면 충분한가', d:'x = 0.5, 1, 2 에서 오차가 0.001 이하가 되는 최소 차수를 각각 찾습니다. <b>x 가 커질수록 필요한 차수가 어떻게 늘어나는지</b> 정리하세요.'},
  {lv:'심화',   t:'수렴반경 밖에서 무너지는 이유', d:'ln(1+x) 를 골라 x = 1.5 에서 차수를 올려 봅니다. 오차가 <b>줄지 않고 커지는</b> 것을 확인하고, 항의 크기 |x|ⁿ/n 이 발산하기 때문임을 설명하세요.'},
  {lv:'프로젝트', t:'sin θ ≈ θ 는 어디까지 쓸 수 있나', d:'진자 운동에서 쓰는 근사입니다. 각을 키우며 <b>오차가 몇 %가 되는 지점</b>을 찾고, 실제 물리 실험에서 허용되는 범위를 조사해 비교하세요.'}
 ],
 eq:'f(x) ≈ Σ f⁽ᵏ⁾(0) xᵏ / k!',
 what:'복잡한 함수를 <b>다항식으로 흉내 내는</b> 방법입니다. 원점에서의 미분계수들을 계수로 삼으며, 차수를 올릴수록 원점에서 먼 곳까지 따라붙습니다. 계산기와 컴퓨터가 sin·log 를 구하는 실제 방식입니다.',
 probe:'차수 슬라이더를 1에서 15까지 올려 보세요. 붉은 근사 곡선이 <b>원점부터 바깥으로 번져 가며</b> 원함수를 덮습니다. 그다음 ln(1+x) 를 골라 보십시오 — 붉게 칠한 <b>수렴반경 밖</b>에서는 차수를 올려도 어긋납니다.',
 link:'미적분Ⅱ 멱급수 단원입니다. “계산기는 sin 을 어떻게 아는가”로 시작하면 급수가 도구로 등장합니다. 물리의 sin θ ≈ θ 근사와 이으면 교과 융합이 자연스럽습니다.'},

{tex:[
  {t:'V=\\pi \\int_{a}^{b} \\left[f(x)\\right]^2 dx',
   s:'x 에서 자른 단면이 <b>반지름 f(x) 인 원</b>이므로 넓이가 π[f(x)]² 이고, 그것을 두께 dx 로 쌓아 적분합니다.'},
  {t:'\\Delta V_i=\\pi \\left[f(x_i)\\right]^2 \\Delta x',
   s:'원판 하나의 부피입니다. <b>반지름을 제곱</b>하는 것이 핵심입니다 — 지름을 넣으면 부피가 네 배가 됩니다.'},
  {t:'V \\approx \\sum_{i=1}^{n} \\pi \\left[f(x_i)\\right]^2 \\Delta x \\;\\to\\; \\pi\\int_a^b \\left[f(x)\\right]^2 dx',
   s:'원판을 늘리면 합이 적분값으로 갑니다. <b>구분구적법</b>이며, 적분이 “무한히 얇게 쪼개 더한 것”이라는 정의 그대로입니다.'},
  {t:'y=x,\\; 0 \\le x \\le b \\;\\Rightarrow\\; V=\\pi\\int_0^b x^2 dx=\\frac{\\pi b^3}{3}',
   s:'원뿔의 부피 공식이 그대로 나옵니다. 밑면 반지름 b, 높이 b 인 원뿔이므로 <b>(1/3)πr²h</b> 와 일치합니다 — 외웠던 공식이 적분에서 유도되는 순간입니다.'}
 ],
 next:[
  {lv:'바로',   t:'원판 개수와 오차', d:'원판을 1, 4, 16, 60개로 늘리며 오차를 기록합니다. <b>개수를 4배로 늘리면 오차가 몇 분의 1이 되는지</b> 찾아보세요.'},
  {lv:'심화',   t:'외운 공식을 유도로 바꾸기', d:'y = x 로 원뿔, y = √(r²−x²) 로 구를 만들어 <b>(1/3)πr²h 와 (4/3)πr³</b> 이 적분에서 그대로 나오는 것을 확인하세요.'},
  {lv:'프로젝트', t:'우리 집 그릇의 부피 재기', d:'실제 컵이나 화병의 옆면 곡선을 좌표로 옮겨 함수로 근사한 뒤 부피를 구합니다. <b>물을 채워 실측한 값과 비교</b>해 오차를 논하세요.'}
 ],
 eq:'V = π ∫ₐᵇ [f(x)]² dx',
 what:'곡선을 축 둘레로 돌린 입체의 부피입니다. 얇은 <b>원판</b>으로 잘라 πr²Δx 를 더하고, 두께를 0으로 보내면 적분이 됩니다. 적분의 정의가 그대로 쓰이는 자리입니다.',
 probe:'원판 개수를 1개에서 60개로 늘려 보세요. 계단처럼 삐죽하던 근사가 <b>곡선에 밀착</b>하고, 합이 정확값에 붙는 것이 숫자로 보입니다. 곡선을 y = x 로 두면 결과가 정확히 πb³/3 — 원뿔 공식과 같아집니다.',
 link:'미적분Ⅱ 정적분의 활용입니다. 원뿔·구의 부피 공식을 <b>외우는 대상에서 유도되는 결과로</b> 바꾸는 자리입니다. 3D 프린팅이나 회전 성형과 연결하면 실생활 맥락이 붙습니다.'}
,

/* 25 소인수분해와 암호 */
{tex:[
  {t:'N=p \\times q', s:'서로 다른 두 소수를 곱해 만든 수입니다. 곱셈은 <b>한 번</b>이면 끝납니다.'},
  {t:'d \\mid N \\;\\Rightarrow\\; \\frac{N}{d} \\mid N',
   s:'d 가 N 의 약수이면 <b>N ÷ d 도 약수</b>입니다. 약수는 늘 짝을 지어 나온다는 뜻입니다.'},
  {t:'d \\le \\sqrt{N} \\;\\text{까지만 확인하면 된다}',
   s:'짝을 이루는 두 약수 중 <b>작은 쪽은 반드시 √N 이하</b>입니다. 그보다 큰 약수만 있다면 짝이 되는 작은 약수가 이미 나왔어야 하므로, √N 까지만 나눠 보면 충분합니다.'}
 ],
 next:[
  {lv:'바로',   t:'우리 반 번호로 소수 찾기', d:'1번부터 30번까지 번호를 놓고 소수인 번호만 일어서게 합니다. 2의 배수·3의 배수·5의 배수를 차례로 앉히는 <b>에라토스테네스의 체</b>를 몸으로 해 보세요.'},
  {lv:'심화',   t:'√N 까지면 충분한 이유 증명하기', d:'“N 이 √N 보다 큰 약수만 가진다면 모순”임을 보입니다. 약수가 짝을 이룬다는 사실 하나로 증명이 끝난다는 것을 확인하세요.'},
  {lv:'프로젝트', t:'교실용 자물쇠 만들기', d:'두 소수를 골라 곱한 수를 공개하고, 다른 모둠이 그 수를 되돌리는 데 몇 번 나눠 봐야 하는지 겨룹니다. 자릿수를 늘리면 시간이 어떻게 늘어나는지 표로 정리해 보세요.'}
 ],
 eq:'N = p × q  ·  약수는 √N 을 경계로 짝을 이룬다',
 what:'곱하기와 되돌리기의 <b>난이도가 다릅니다</b>. p 와 q 를 곱해 N 을 만드는 데는 한 번이면 되지만, N 만 보고 p 를 찾으려면 하나씩 나눠 보는 수밖에 없습니다. 이 <b>비대칭</b>이 오늘날 인터넷 암호가 서 있는 자리입니다.',
 probe:'p 와 q 를 키우며 “실제로 나눠 본 횟수”가 어떻게 늘어나는지 보세요. 작은 소수를 넣으면 금방 갈라지지만 둘 다 크면 급격히 늘어납니다. 두 막대를 비교하면 √N 까지만 확인하는 것이 얼마나 큰 절약인지도 눈에 들어옵니다.',
 link:'소인수분해 단원의 도입으로 씁니다. “소수를 왜 배우나”에 대한 답이 되고, 약수가 짝을 이룬다는 성질은 뒤에 나오는 <b>최대공약수·최소공배수</b>로 그대로 이어집니다.'},

/* 26 정수와 유리수의 사칙 */
{tex:[
  {t:'a+b \\;\\text{는 수직선에서}\\; a \\;\\text{에서}\\; b \\;\\text{만큼 움직인 자리}',
   s:'b 가 양수면 오른쪽, 음수면 왼쪽으로 갑니다. 덧셈은 <b>화살표를 이어 붙이는 일</b>입니다.'},
  {t:'a-b=a+(-b)', s:'빼기는 <b>반대 방향으로 가는 덧셈</b>입니다. 부호를 바꿔 더하는 것으로 뺄셈이 덧셈에 흡수됩니다.'},
  {t:'a-(-b)=a+b', s:'음수를 빼면 오른쪽으로 갑니다. 부호를 <b>두 번</b> 바꾸었기 때문입니다 — 여기서 한 번만 바꾸는 것이 가장 흔한 실수입니다.'}
 ],
 next:[
  {lv:'바로',   t:'우리 도시 기온으로 계산하기', d:'기상청에서 최근 일주일의 최저·최고 기온을 받아 하루 기온차를 모두 구합니다. 영하가 낀 날의 계산을 <b>수직선에 화살표로</b> 그려 확인하세요.'},
  {lv:'심화',   t:'왜 음수 × 음수 = 양수인가', d:'(−2) × 3, (−2) × 2, (−2) × 1, (−2) × 0 을 차례로 계산해 규칙을 찾고, 그 규칙을 이어 (−2) × (−1) 을 예측합니다. 분배법칙으로도 확인해 보세요.'},
  {lv:'프로젝트', t:'해수면 기준 지도 만들기', d:'0을 해수면으로 잡고 우리 지역의 산·건물·지하를 부호가 있는 수로 표시한 단면도를 만듭니다. <b>기준을 어디에 두느냐</b>에 따라 모든 수가 바뀐다는 것을 확인하세요.'}
 ],
 eq:'a − b = a + (−b)',
 what:'수직선 위에서 덧셈은 <b>화살표를 이어 붙이는 일</b>이고, 뺄셈은 그 화살표를 <b>거꾸로 놓는 일</b>입니다. 규칙을 외우는 것이 아니라 방향을 보는 것으로 바뀌면, 부호가 여럿 겹쳐도 헷갈리지 않습니다.',
 probe:'연산을 뺄셈으로 바꾸면 화살표가 반대로 돕니다. 그 상태에서 b 를 음수로 두면 화살표가 <b>다시 오른쪽으로</b> 돌아오는데, 부호를 두 번 바꾼 자리입니다. 한 번만 바꾸면 어디로 가는지도 함께 보세요.',
 link:'정수의 덧셈·뺄셈을 마친 직후에 씁니다. 화살표로 잡아 둔 감각은 뒤의 <b>절댓값</b>과 <b>일차부등식의 해</b>를 수직선에서 다룰 때 그대로 쓰입니다.'},

/* 27 문자와 식 */
{tex:[
  {t:'2a = 2 \\times a', s:'문자와 수 사이의 곱셈 기호는 <b>생략하기로 약속</b>했습니다. “2와 a”가 아닙니다.'},
  {t:'3n+1', s:'정사각형 하나마다 성냥개비 3개가 새로 들고, 맨 처음 왼쪽 변 1개가 따로 있습니다. <b>규칙을 한 줄로</b> 적은 것입니다.'},
  {t:'4+3(n-1) = 4n-(n-1) = 3n+1',
   s:'세는 방법이 달라 <b>생김새가 다른 식</b>이 나오지만, 정리하면 모두 같습니다. 어느 쪽으로 세도 개수는 하나이기 때문입니다.'}
 ],
 next:[
  {lv:'바로',   t:'다른 도형으로 규칙 만들기', d:'정삼각형을 이어 붙이거나 정사각형을 2층으로 쌓아 새 규칙을 만들고, n 번째 개수를 식으로 적습니다. 짝과 <b>서로 다른 식</b>을 만든 뒤 같은지 확인하세요.'},
  {lv:'심화',   t:'같은 식임을 설명하기', d:'4 + 3(n − 1) 과 3n + 1 이 같다는 것을 <b>계산이 아니라 세는 방식으로</b> 설명합니다. 어느 성냥개비를 어떻게 묶었는지 그림에 표시해 보세요.'},
  {lv:'프로젝트', t:'우리 학교 계단·타일 수식화', d:'학교의 계단·복도 타일·자전거 거치대처럼 규칙적으로 반복되는 것을 찾아 사진을 찍고 n 번째 식을 세웁니다. 실제로 세어 검증하는 것까지 포함하세요.'}
 ],
 eq:'3n + 1  (문자와 수 사이의 × 는 생략한다)',
 what:'문자는 <b>“아직 정하지 않은 수”의 자리</b>입니다. 100번째를 묻는 순간 하나씩 세는 방법은 무너지고, 규칙을 한 줄로 적는 것이 유일한 길이 됩니다. 이것이 문자를 쓰는 이유입니다.',
 probe:'n 을 키우면서 세 식의 값이 <b>언제나 같은지</b> 확인하세요. 그다음 아래쪽에서 2a 에 값을 대입해 보면, 이것을 “2와 a”로 읽었을 때 결과가 얼마나 어긋나는지 숫자로 나옵니다.',
 link:'문자의 사용과 식의 값 단원의 도입입니다. 여기서 세운 식은 그대로 <b>일차식의 계산</b>과 <b>일차방정식</b>의 재료가 되고, 중2 의 <b>일차함수</b>로 이어집니다.'},

/* 28 등식의 성질 */
{tex:[
  {t:'a=b \\;\\Rightarrow\\; a+c=b+c', s:'양변에 <b>같은 수</b>를 더해도 등식은 그대로입니다. 저울 양쪽에 같은 무게를 얹는 일과 같습니다.'},
  {t:'a=b \\;\\Rightarrow\\; ac=bc \\quad (c \\ne 0)',
   s:'양변에 같은 수를 곱하거나 나누어도 그대로입니다. 다만 <b>0으로 나누는 것</b>은 안 됩니다.'},
  {t:'2x+3=11 \\;\\Rightarrow\\; 2x=8 \\;\\Rightarrow\\; x=4',
   s:'양변에서 3을 빼고, 양변을 2로 나누었습니다. <b>이항</b>은 새 규칙이 아니라 이 성질을 줄여 쓴 것입니다.'}
 ],
 next:[
  {lv:'바로',   t:'문제를 저울 그림으로 옮기기', d:'교과서의 일차방정식 다섯 문제를 저울 그림으로 먼저 그린 뒤 풀이합니다. 각 단계마다 <b>양변에 무엇을 했는지</b> 옆에 적으세요.'},
  {lv:'심화',   t:'왜 0으로는 나눌 수 없는가', d:'양변에 0을 곱하면 어떤 등식이든 0 = 0 이 되어 정보가 사라집니다. 0으로 나누는 조작이 왜 <b>해를 잃거나 없는 해를 만드는지</b> 예를 들어 설명하세요.'},
  {lv:'프로젝트', t:'해가 없는 식·해가 무수한 식 만들기', d:'양변을 조작해 0 · x = 5 (해 없음)와 0 · x = 0 (해 무수히 많음)이 되는 방정식을 각각 만들고, 저울 그림으로 그 상태가 무엇인지 설명합니다.'}
 ],
 eq:'a = b ⇒ a + c = b + c,  ac = bc (c ≠ 0)',
 what:'방정식을 푸는 일은 <b>균형을 지키면서 x 만 남기는 일</b>입니다. 등식의 성질은 외울 규칙이 아니라 “저울이 기울지 않게 하는 조건”이고, 이항은 그 조작을 줄여 쓴 표기일 뿐입니다.',
 probe:'「왼쪽에서만 1 빼기」를 눌러 보세요. 저울이 기울고, 그 순간부터 <b>처음 식과 다른 식</b>이 됩니다. 답을 구해도 원래 문제의 답이 아니라는 것을 확인하고, 「처음으로」를 눌러 바르게 다시 풀어 보세요.',
 link:'일차방정식의 풀이 직전에 씁니다. 이항을 먼저 가르치면 학생은 “부호를 바꿔 넘긴다”는 <b>절차만</b> 외웁니다. 저울을 먼저 겪으면 왜 부호가 바뀌는지가 설명됩니다.'},

/* 29 정비례와 반비례 */
{tex:[
  {t:'y=ax \\;\\Leftrightarrow\\; \\frac{y}{x}=a \\;(\\text{일정})',
   s:'정비례는 <b>비가 일정</b>합니다. 그래프는 원점을 지나는 직선입니다.'},
  {t:'y=\\frac{k}{x} \\;\\Leftrightarrow\\; xy=k \\;(\\text{일정})',
   s:'반비례는 <b>곱이 일정</b>합니다. 그래프는 직선이 아니라 좌표축에 다가가는 굽은 선입니다.'},
  {t:'F_1 d_1 = F_2 d_2', s:'지렛대가 균형을 이루는 조건입니다. 곱이 일정하므로 <b>거리를 두 배로 하면 힘은 절반</b>이 됩니다.'}
 ],
 next:[
  {lv:'바로',   t:'교실에서 지렛대 재기', d:'30cm 자와 지우개로 지렛대를 만들어 받침점 위치를 바꿔 가며 균형을 맞춥니다. 거리와 무게를 표로 적고 <b>곱이 일정한지</b> 확인하세요.'},
  {lv:'심화',   t:'정비례로 착각하기 쉬운 상황 모으기', d:'“사람이 두 배면 시간이 절반”처럼 반비례인 상황과, “개수가 두 배면 값도 두 배”처럼 정비례인 상황을 각각 다섯 개씩 모아 <b>무엇이 일정한지</b>로 구분합니다.'},
  {lv:'프로젝트', t:'우리 학교 급식 배식 시간 모델', d:'배식대 수와 대기 시간을 실제로 재어 표로 만들고, 곱이 일정한지 비가 일정한지 판단합니다. 어긋난다면 <b>왜 이상적인 반비례가 아닌지</b> 설명하세요.'}
 ],
 eq:'정비례 y = ax (y ÷ x 가 일정)  ·  반비례 y = k / x (x × y 가 일정)',
 what:'두 관계를 가르는 것은 그래프 모양이 아니라 <b>무엇이 일정한가</b>입니다. 비가 일정하면 정비례, 곱이 일정하면 반비례입니다. 표의 셋째 줄만 보면 어느 쪽인지 바로 판정됩니다.',
 probe:'표에서 x × y 와 y ÷ x 를 번갈아 보세요. 반비례에서는 앞의 줄이, 정비례에서는 뒤의 줄이 <b>변하지 않습니다</b>. 이 상태에서 반비례 자료에 직선을 그으면 왜 맞지 않는지도 화면에서 확인됩니다.',
 link:'정비례·반비례 단원의 마무리로 씁니다. “곱이 일정 / 비가 일정”이라는 판정 기준은 중2 <b>일차함수</b>와 중3 <b>이차함수</b>에서 관계의 종류를 가릴 때 그대로 다시 쓰입니다.'},

/* 30 평행선과 각 */
{tex:[
  {t:'\\angle a + \\angle b = 180^\\circ \\;(\\text{일직선})',
   s:'한 직선 위에서 이웃한 두 각의 합은 180°입니다. 여기서 모든 관계가 출발합니다.'},
  {t:'\\ell \\parallel m \\;\\Rightarrow\\; \\text{동위각이 같다}',
   s:'평행선을 가로지르면 <b>같은 자리에 있는 각</b>이 같습니다. 평행이라는 조건이 있어야 성립합니다.'},
  {t:'\\text{동위각} = \\text{맞꼭지각} \\;\\Rightarrow\\; \\text{엇각이 같다}',
   s:'엇각은 동위각의 맞꼭지각입니다. 맞꼭지각이 같다는 사실 하나만 더하면 <b>엇각도 자동으로</b> 나옵니다.'}
 ],
 next:[
  {lv:'바로',   t:'교실에서 평행선 찾아 각 재기', d:'복도 타일·창틀·책상 줄에서 평행선과 그것을 가로지르는 선을 찾아 각도기로 재고, 동위각·엇각이 실제로 같은지 확인합니다.'},
  {lv:'심화',   t:'평행이 아니면 어떻게 되는가', d:'두 직선이 평행하지 않을 때 동위각의 차이가 <b>두 직선이 벌어진 정도</b>와 어떤 관계인지 조사합니다. 각의 이름은 그대로여도 크기는 왜 달라지는지 설명하세요.'},
  {lv:'프로젝트', t:'1점 투시 그림 그리기', d:'소실점 하나를 잡고 교실을 원근법으로 그립니다. 실제로는 평행한 선들이 그림에서 왜 한 점으로 모이는지, 그때 각이 어떻게 변하는지 정리하세요.'}
 ],
 eq:'ℓ ∥ m ⇒ 동위각이 같다 ⇒ 엇각이 같다',
 what:'각의 이름은 <b>자리</b>가 정하고, 크기가 같아지는 것은 <b>평행할 때만</b>입니다. 이 둘을 섞으면 “엇각이니까 같다”는 잘못된 근거가 나옵니다. 자리를 먼저 확인하고, 평행 조건을 확인하는 순서가 중요합니다.',
 probe:'표시할 각을 동위각 → 엇각 → 동측내각으로 바꿔 보세요. 동측내각을 고르면 <b>같은 것이 아니라 합이 180°</b>인 다른 관계가 나옵니다. 각의 이름마다 결론이 다르다는 것을 확인하세요.',
 link:'평행선의 성질 단원에서 씁니다. 여기서 잡은 “동위각 → 엇각” 연결은 중2 <b>삼각형의 내각의 합</b> 증명에서 그대로 쓰이는 도구입니다.'},

/* 31 삼각형의 합동 */
{tex:[
  {t:'\\text{SSS · SAS · ASA}', s:'이 셋 중 하나가 같으면 두 삼각형은 <b>합동</b>입니다. 모양이 하나로 정해진다는 뜻입니다.'},
  {t:'\\text{SSA 는 조건이 아니다}',
   s:'각이 <b>두 변 사이에 끼어 있지 않으면</b> 삼각형이 두 개 나올 수 있습니다. “같은 값인데 다른 모양”이 있으므로 조건이 되지 못합니다.'},
  {t:'\\text{반지름}\\;c\\;\\text{인 원} \\cap \\text{반직선} = \\text{두 점}',
   s:'SSA 로 작도하면 원과 반직선이 <b>두 점에서 만나</b> 후보가 둘 남습니다. 반례가 생기는 자리가 여기입니다.'}
 ],
 next:[
  {lv:'바로',   t:'자와 컴퍼스로 직접 작도하기', d:'세 변의 길이만 주고 삼각형을 작도해 짝과 겹쳐 봅니다. 정말 하나뿐인지, 뒤집은 것도 같은 것으로 볼지 이야기해 보세요.'},
  {lv:'심화',   t:'SSA 가 되는 예외 찾기', d:'SSA 인데도 삼각형이 하나로 정해지는 경우(직각·둔각이 낀 경우 등)를 찾아 <b>왜 그때는 후보가 하나뿐인지</b> 원과 직선의 교점 수로 설명합니다.'},
  {lv:'프로젝트', t:'흔들리지 않는 구조물 만들기', d:'빨대와 실로 사각형 틀과 삼각형 틀을 만들어 손으로 밀어 봅니다. 사각형이 왜 찌그러지는지를 <b>합동 조건</b>으로 설명하고, 보강재를 어디에 넣을지 정하세요.'}
 ],
 eq:'SSS · SAS · ASA 는 합동 조건, SSA 는 아니다',
 what:'“조건이 된다”는 말은 <b>주어진 값이 같으면 모양이 하나로 정해진다</b>는 뜻입니다. SSA 는 같은 값에서 삼각형이 둘 나오므로 조건이 아닙니다. 반례 하나면 충분하다는 것을 겪는 자리입니다.',
 probe:'SSA 를 고르고 변 b 를 90 아래로 줄여 보세요. 삼각형이 <b>두 개</b> 그려집니다. 두 삼각형의 세 값(변·변·각)이 정말 같은지 하나씩 확인한 뒤, SAS 로 바꾸면 왜 하나로 정해지는지 비교하세요.',
 link:'삼각형의 합동 조건 단원에서 씁니다. 반례로 명제를 무너뜨리는 경험은 중2 이후의 <b>증명</b> 단원 전체의 바탕이 됩니다.'},

/* 32 부채꼴 */
{tex:[
  {t:'\\ell = 2\\pi r \\times \\frac{x}{360}', s:'호의 길이는 원둘레에 <b>중심각의 비율</b>을 곱한 것입니다.'},
  {t:'S = \\pi r^2 \\times \\frac{x}{360}', s:'넓이도 같은 비율입니다. 원 전체를 360조각으로 보고 그중 x 조각을 세는 셈입니다.'},
  {t:'S = \\frac{1}{2} r \\ell', s:'두 식에서 x/360 을 지우면 남는 관계입니다. <b>밑변이 호, 높이가 반지름인 삼각형</b>과 같은 꼴이라는 것이 보입니다.'}
 ],
 next:[
  {lv:'바로',   t:'우리 반 자료로 원그래프 그리기', d:'좋아하는 과목을 조사해 비율을 구하고, 중심각을 계산해 각도기로 원그래프를 그립니다. 각의 합이 <b>정확히 360°</b>가 되는지 확인하세요.'},
  {lv:'심화',   t:'S = ½rℓ 유도하기', d:'호의 길이와 넓이 두 식에서 중심각을 소거해 S = ½rℓ 을 얻습니다. 이 식이 <b>삼각형 넓이 공식과 닮은 이유</b>를 부채꼴을 잘게 자른 그림으로 설명하세요.'},
  {lv:'프로젝트', t:'운동장 트랙 설계하기', d:'직선 구간과 반원 구간으로 트랙을 설계하고 레인마다 실제 길이를 계산합니다. 출발선을 얼마나 <b>앞당겨야 공평한지</b>를 호의 길이로 구하세요.'}
 ],
 eq:'ℓ = 2πr × x/360,  S = πr² × x/360,  S = ½rℓ',
 what:'부채꼴의 모든 계산은 <b>“전체 중 몇 분의 몇인가”</b> 하나로 정리됩니다. 중심각의 비율이 곧 호의 비율이고 넓이의 비율입니다. 공식이 셋으로 보이지만 실은 같은 생각의 세 가지 표현입니다.',
 probe:'오른쪽 막대 셋을 보세요. 중심각·호·넓이의 비율이 <b>언제나 같은 값</b>입니다. 반지름을 키우면 호와 넓이의 절대값은 커지는데 비율은 그대로인 것도 확인하세요 — 원그래프가 크기와 무관하게 성립하는 이유입니다.',
 link:'원과 부채꼴 단원에서 씁니다. 비율로 계산하는 감각은 중1 <b>자료와 가능성</b>의 원그래프와 바로 이어지고, 고등학교의 <b>호도법</b>에서 다시 만납니다.'},

/* 33 대푯값 */
{tex:[
  {t:'\\bar{x}=\\frac{x_1+x_2+\\cdots+x_n}{n}', s:'평균은 <b>모두 더해 고르게 나눈 값</b>입니다. 모든 자료가 영향을 줍니다.'},
  {t:'\\text{중앙값} = \\text{크기순으로 늘어놓았을 때 한가운데}',
   s:'순서만 보므로 <b>극단값에 흔들리지 않습니다</b>.'},
  {t:'\\text{최빈값} = \\text{가장 많이 나타난 값}',
   s:'“가장 흔한 것”을 묻는 상황에서만 답이 됩니다. 자료가 숫자가 아니어도 구할 수 있습니다.'}
 ],
 next:[
  {lv:'바로',   t:'우리 반 자료로 세 값 구하기', d:'통학 시간·형제 수·좋아하는 색을 조사해 평균·중앙값·최빈값을 각각 구합니다. <b>구할 수 없는 것</b>이 있는 자료도 찾아보세요.'},
  {lv:'심화',   t:'평균만 바꾸는 자료 만들기', d:'중앙값과 최빈값은 그대로 두고 평균만 크게 바꾸는 자료를 직접 만듭니다. 값 하나를 어디에 놓아야 하는지, 왜 그런지 설명하세요.'},
  {lv:'프로젝트', t:'기사 속 대푯값 검증하기', d:'“평균 연봉”, “평균 집값”이 나오는 기사를 찾아 그 상황에서 <b>어떤 대푯값이 더 정직한지</b> 판단하고, 근거를 들어 대안을 제시합니다.'}
 ],
 eq:'평균 · 중앙값 · 최빈값 — 무엇을 묻는가가 고른다',
 what:'대푯값은 <b>하나가 아닙니다</b>. 평균은 모든 자료를 반영하지만 극단값에 끌려가고, 중앙값은 순서만 보므로 버티며, 최빈값은 “가장 흔한 것”에 답합니다. 질문이 무엇이냐가 어느 것을 쓸지 정합니다.',
 probe:'양 끝 치수의 사람 수를 늘려 보세요. 평균 눈금은 따라 움직이는데 <b>가장 높은 막대는 그대로</b>입니다. 평균 치수의 신발이 실제로는 아무도 사지 않는 치수가 될 수도 있다는 것을 확인하세요.',
 link:'대푯값 단원에서 씁니다. “질문이 방법을 고른다”는 태도는 바로 다음 <b>도수분포표·히스토그램</b>에서 계급을 정할 때 그대로 이어집니다.'},

/* 34 도수분포표와 히스토그램 */
{tex:[
  {t:'(\\text{계급의 크기}) = \\frac{\\text{범위}}{\\text{계급의 개수}}',
   s:'자료의 범위를 몇 조각으로 자를지 정하면 계급의 크기가 정해집니다. 보통 <b>5~10개</b>로 잡습니다.'},
  {t:'(\\text{상대도수}) = \\frac{(\\text{그 계급의 도수})}{(\\text{도수의 총합})}',
   s:'전체 크기가 다른 두 집단을 비교하려면 도수가 아니라 <b>상대도수</b>로 봐야 합니다.'},
  {t:'\\text{계급의 크기가 다르면 막대 높이를 직접 비교할 수 없다}',
   s:'폭이 넓은 계급은 더 많은 자료를 받아 <b>높아 보일 뿐</b>입니다. 히스토그램에서 정보를 담는 것은 높이가 아니라 넓이입니다.'}
 ],
 next:[
  {lv:'바로',   t:'우리 반 자료로 계급 정하기', d:'수행평가 점수나 통학 시간을 모아 계급의 크기를 3가지로 바꿔 가며 그려 보고, <b>어느 것이 가장 읽기 좋은지</b> 근거를 들어 고릅니다.'},
  {lv:'심화',   t:'같은 자료로 다른 인상 만들기', d:'계급의 크기와 시작점만 바꿔 “고르게 퍼져 있다”와 “한쪽에 몰려 있다”는 두 인상을 각각 만들어 냅니다. 무엇이 그런 차이를 만들었는지 설명하세요.'},
  {lv:'프로젝트', t:'뉴스 그래프 감사하기', d:'기사에 실린 히스토그램·막대그래프를 모아 계급의 크기가 밝혀져 있는지, 축이 0에서 시작하는지 점검하고 <b>바르게 다시 그린 그래프</b>를 함께 제시합니다.'}
 ],
 eq:'계급의 크기 = 범위 ÷ 계급의 개수  ·  상대도수 = 도수 ÷ 총합',
 what:'히스토그램은 자료를 <b>구간으로 묶어 보는 도구</b>입니다. 그런데 어떻게 묶느냐는 사람이 정합니다. 같은 자료라도 계급을 달리 자르면 분포의 인상이 달라지므로, 계급의 크기를 밝히지 않은 그래프는 <b>비교할 수 없습니다</b>.',
 probe:'계급의 크기를 5 → 40 으로 옮겨 보세요. 같은 40명의 점수인데 봉우리가 생겼다 사라집니다. 시작점만 5 옮겨도 모양이 바뀌는 것까지 확인하면, 그래프가 “사실”이 아니라 <b>선택의 결과</b>라는 것이 분명해집니다.',
 link:'도수분포표·히스토그램 단원에서 씁니다. 여기서 겪은 “같은 자료, 다른 그림”은 중3 <b>상관관계</b>와 고등학교 <b>통계</b>에서 시각화를 비판적으로 읽는 바탕이 됩니다.'}
,

/* 35 최대공약수와 최소공배수 */
{tex:[
  {t:'a=p_1^{x_1}p_2^{x_2}\\cdots,\\quad b=p_1^{y_1}p_2^{y_2}\\cdots',
   s:'두 수를 같은 소수들의 거듭제곱으로 나란히 적습니다. 없는 소수는 <b>지수 0</b> 으로 둡니다.'},
  {t:'\\gcd(a,b)=\\prod p_i^{\\min(x_i,y_i)},\\quad \\operatorname{lcm}(a,b)=\\prod p_i^{\\max(x_i,y_i)}',
   s:'최대공약수는 소수마다 <b>낮은 지수</b>, 최소공배수는 <b>높은 지수</b>를 고릅니다. 공약수가 되려면 둘 다 나눠야 하고, 공배수가 되려면 둘 다 담아야 하기 때문입니다.'},
  {t:'\\min(x,y)+\\max(x,y)=x+y \\;\\Rightarrow\\; \\gcd(a,b)\\times\\operatorname{lcm}(a,b)=a\\times b',
   s:'소수마다 낮은 지수와 높은 지수를 더하면 <b>원래 두 지수의 합</b>입니다. 그래서 두 곱이 반드시 a × b 가 됩니다.'}
 ],
 next:[
  {lv:'바로',   t:'우리 학교 시간표로 확인하기', d:'45분 수업과 50분 수업이 함께 있는 학교를 가정해, 두 종이 동시에 울리는 때를 최소공배수로 구합니다. 실제 시간표에 표시해 보세요.'},
  {lv:'심화',   t:'유클리드 호제법과 비교하기', d:'큰 수 두 개(예: 1071과 462)를 소인수분해로도 구해 보고 <b>서로 나눈 나머지를 반복하는 방법</b>으로도 구해, 어느 쪽이 빠른지 횟수를 세어 비교합니다.'},
  {lv:'프로젝트', t:'교차로 신호 주기 설계하기', d:'세 방향 신호의 주기를 정해 모든 방향이 동시에 초록이 되는 일이 없도록 만듭니다. 최소공배수와 서로소 개념을 근거로 설계안을 제출하세요.'}
 ],
 eq:'gcd(a,b) × lcm(a,b) = a × b',
 what:'두 수를 소인수분해해 놓으면 최대공약수와 최소공배수가 <b>같은 표의 아래위</b>가 됩니다. 소수마다 낮은 지수를 고르면 공약수, 높은 지수를 고르면 공배수입니다. 두 곱이 a × b 가 되는 것도 여기서 바로 나옵니다.',
 probe:'톱니 수를 서로소로 맞춰 보세요(예: 12와 7). 최대공약수가 1이 되고 최소공배수가 곧 a × b 가 됩니다. 반대로 한쪽이 다른 쪽의 배수면 최소공배수가 큰 쪽과 같아지는데, 그때 지수가 어떻게 되는지 확인하세요.',
 link:'소인수분해 직후에 씁니다. 여기서 잡은 “지수를 비교한다”는 감각은 고등학교의 <b>약수의 개수·합</b>과 <b>정수론</b>으로 이어집니다.'},

/* 36 삼각형의 작도 */
{tex:[
  {t:'\\text{원} = \\{\\,\\text{중심에서 거리가 } r \\text{ 인 점}\\,\\}',
   s:'컴퍼스로 원을 그리는 일은 “여기서 r 만큼 떨어진 곳을 <b>전부</b> 표시하는 일”입니다.'},
  {t:'\\text{두 원의 교점} = \\text{두 조건을 동시에 만족하는 점}',
   s:'한 끝에서 b, 다른 끝에서 c 떨어진 점이 세 번째 꼭짓점입니다. 작도가 <b>조건을 겹치는 일</b>이 되는 지점입니다.'},
  {t:'|b-c| < a < b+c',
   s:'두 원이 만나려면 중심 사이 거리 a 가 이 범위 안이어야 합니다. <b>삼각부등식</b>이 곧 두 원이 만나는 조건입니다.'}
 ],
 next:[
  {lv:'바로',   t:'자와 컴퍼스로 직접 해 보기', d:'화면과 같은 세 변으로 종이에 작도하고, 짝의 것과 겹쳐 봅니다. 눈금 없는 자만 써야 한다는 규칙을 지키세요.'},
  {lv:'심화',   t:'되는 경계 찾기', d:'b 와 c 를 고정하고 a 를 조금씩 키우며 <b>되기 시작하는 순간과 안 되기 시작하는 순간</b>을 찾습니다. 그 두 값이 무엇인지 식으로 적으세요.'},
  {lv:'프로젝트', t:'작도 설명서 만들기', d:'다른 사람이 그대로 따라 할 수 있도록 작도 순서를 글과 그림으로 적습니다. “왜 그 원을 그리는가”를 단계마다 한 줄씩 붙이세요.'}
 ],
 eq:'|b − c| < a < b + c',
 what:'작도는 <b>조건을 하나씩 겹쳐 자리를 좁히는 일</b>입니다. 원 하나는 후보를 원 전체로, 원 둘은 두 점으로 좁힙니다. 두 원이 만나지 못하면 그런 삼각형은 아예 없다는 뜻입니다.',
 probe:'단계를 2에서 멈추고 “아직 정해지지 않은 후보”가 어디인지 보세요. 3단계에서 두 번째 원이 그 후보를 어떻게 잘라 내는지가 핵심입니다. 짧은 두 변을 더 짧게 하면 두 원이 서로 닿지 못하는 순간이 옵니다.',
 link:'작도 단원에서 씁니다. 여기서 겪은 “교점이 조건의 겹침”이라는 감각은 뒤의 <b>합동 조건</b>과 고등학교 <b>도형의 방정식</b>의 연립으로 그대로 이어집니다.'},

/* 37 다각형의 성질 */
{tex:[
  {t:'(\\text{내각의 합})=180^\\circ \\times (n-2)',
   s:'한 꼭짓점에서 대각선을 그으면 <b>삼각형 n − 2 개</b>로 나뉩니다. 그 삼각형들의 내각을 모두 더한 것입니다.'},
  {t:'(\\text{한 내각})=\\frac{180^\\circ \\times (n-2)}{n}',
   s:'정다각형이면 모든 내각이 같으므로 n 으로 나눕니다. n 이 커질수록 180°에 가까워집니다.'},
  {t:'\\frac{360^\\circ}{(\\text{한 내각})} \\in \\mathbb{N} \\;\\Leftrightarrow\\; n=3,4,6',
   s:'한 점을 빈틈없이 채우려면 <b>360°가 한 내각으로 나누어떨어져야</b> 합니다. 그런 정다각형은 셋뿐입니다.'}
 ],
 next:[
  {lv:'바로',   t:'교실 바닥·보도블록 조사하기', d:'학교와 동네에서 실제로 쓰인 타일 모양을 사진으로 모으고, 정다각형 하나로 된 것인지 두 종류를 섞은 것인지 분류합니다.'},
  {lv:'심화',   t:'두 종류를 섞으면', d:'정삼각형과 정사각형처럼 두 종류를 섞어 한 점에서 360°를 만드는 조합을 모두 찾습니다. 각의 합이 360°가 되는 방정식을 세워 푸세요.'},
  {lv:'프로젝트', t:'우리 반 타일 디자인', d:'찾은 조합으로 교실 한 벽면의 타일 배치를 설계하고, 왜 빈틈이 생기지 않는지 각의 합으로 증명한 설명서를 붙입니다.'}
 ],
 eq:'내각의 합 = 180° × (n − 2),  외각의 합 = 360°',
 what:'다각형을 삼각형으로 <b>쪼개는 순간</b> 내각의 합이 나옵니다. 외각의 합이 n 과 무관하게 360°인 것도 “한 바퀴 돌아 제자리로 온다”는 사실 하나로 설명됩니다. 바닥 채우기는 이 값이 360°를 나누느냐의 문제로 바뀝니다.',
 probe:'n 을 키우며 한 내각이 어떻게 변하는지 보세요. 120°를 넘는 순간부터 한 점에 세 개를 붙일 수 없습니다. 정오각형(108°)에서 세 개를 붙이면 324° — 36°가 남는 것을 화면에서 확인하세요.',
 link:'다각형의 성질 단원에서 씁니다. 외각의 합이 늘 360°라는 사실은 고등학교 <b>회전과 방향</b>, 그리고 로봇·거북이 그래픽의 이동 명령과 그대로 연결됩니다.'},

/* 38 다면체와 회전체 */
{tex:[
  {t:'v-e+f=2',
   s:'볼록한 다면체라면 <b>꼭짓점 − 모서리 + 면</b> 이 언제나 2 입니다. 정다면체가 다섯 가지뿐인 것도 여기서 나옵니다.'},
  {t:'\\text{회전체의 축에 수직인 단면} = \\text{원}',
   s:'축에서 같은 거리에 있던 점들이 한 바퀴 돌아 만든 자리이므로 <b>반드시 원</b>입니다.'},
  {t:'\\text{원뿔의 단면 반지름} \\propto (\\text{밑면까지의 거리})',
   s:'원뿔은 높이에 따라 반지름이 <b>일정한 비로</b> 줄어듭니다. 3D 프린터가 층마다 얼마씩 좁혀야 하는지가 이 비입니다.'}
 ],
 next:[
  {lv:'바로',   t:'전개도로 만들어 보기', d:'정사면체·정육면체·정팔면체의 전개도를 그려 실제로 접고, v · e · f 를 세어 v − e + f 를 확인합니다.'},
  {lv:'심화',   t:'정다면체가 다섯뿐인 이유', d:'한 꼭짓점에 모이는 정다각형의 각의 합이 360°보다 작아야 한다는 조건과 오일러 공식을 함께 써서 <b>다섯 가지뿐임</b>을 설명합니다.'},
  {lv:'프로젝트', t:'CT처럼 단면으로 복원하기', d:'어떤 입체의 단면 열 장만 보여 주고 짝이 그 입체를 알아맞히게 합니다. 무엇을 보여 주면 구별이 되는지, 무엇을 보여 주면 헷갈리는지 정리하세요.'}
 ],
 eq:'v − e + f = 2  ·  회전체의 축에 수직인 단면은 원',
 what:'다면체와 회전체는 <b>만든 방법이 다릅니다</b>. 다면체는 평면 조각을 붙여 만들고, 회전체는 평면도형을 축 둘레로 돌려 만듭니다. 그 차이가 단면에 그대로 나타납니다 — 회전체의 단면은 언제나 원입니다.',
 probe:'회전체 셋(원뿔·원기둥·구)의 단면을 높이별로 보세요. 모두 원인데 <b>반지름이 변하는 방식</b>이 다릅니다. 원기둥은 일정, 원뿔은 일정한 비로 감소, 구는 가운데가 가장 큽니다.',
 link:'다면체와 회전체 단원에서 씁니다. 단면으로 입체를 파악하는 감각은 고등학교 <b>정적분에 의한 부피</b>(단면적을 쌓는 것)로 곧장 이어집니다.'},

/* 39 겉넓이와 부피 */
{tex:[
  {t:'V=abc,\\qquad S=2(ab+bc+ca)',
   s:'부피는 <b>세 수의 곱</b>, 겉넓이는 <b>두 수씩 짝지은 곱의 합</b>입니다. 늘어나는 방식이 다릅니다.'},
  {t:'k \\text{ 배로 닮게 키우면} \\quad V \\to k^3 V,\\quad S \\to k^2 S',
   s:'길이를 2배로 하면 넓이는 4배, 부피는 8배입니다. 커질수록 <b>부피가 겉넓이보다 빨리</b> 늘어납니다.'},
  {t:'V \\text{ 를 고정하면 } S \\text{ 는 } a=b=c \\text{ 일 때 가장 작다}',
   s:'같은 부피라면 <b>정육면체</b>가 종이를 가장 적게 씁니다. 한 변만 길쭉해지면 옆면 넓이가 급히 커집니다.'}
 ],
 next:[
  {lv:'바로',   t:'실제 택배 상자 재기', d:'집에 있는 택배 상자 세 개의 가로·세로·높이를 재어 부피와 겉넓이를 구하고, 같은 부피의 정육면체와 비교해 종이를 몇 % 더 쓰는지 계산합니다.'},
  {lv:'심화',   t:'왜 상자는 정육면체가 아닌가', d:'적재·운반·내용물 모양 같은 <b>수학 밖의 조건</b>을 조사해, 최적이 아닌 모양을 쓰는 이유를 정리합니다. 수학적 최적과 현실의 최적이 다른 지점을 설명하세요.'},
  {lv:'프로젝트', t:'우리 학교 급식 잔반통 설계', d:'필요한 부피를 정하고, 들어갈 자리의 폭 제한을 조건으로 걸어 겉넓이가 가장 작은 치수를 찾습니다. 제한이 없을 때와 있을 때의 답을 비교하세요.'}
 ],
 eq:'V = abc,  S = 2(ab + bc + ca)',
 what:'부피와 겉넓이는 <b>늘어나는 속도가 다릅니다</b>. 길이를 2배로 하면 겉넓이는 4배, 부피는 8배입니다. 그래서 큰 동물일수록 열이 잘 안 빠지고, 같은 부피라면 정육면체에 가까울수록 포장재가 적게 듭니다.',
 probe:'부피를 8000cm³ 로 고정한 채 20·20·20 과 40·20·10 과 80·10·10 을 차례로 넣어 보세요. 부피는 같은데 겉넓이가 계속 커집니다. 낭비율 막대가 얼마나 벌어지는지 확인하세요.',
 link:'겉넓이와 부피 단원의 마무리로 씁니다. 닮음비와 넓이비·부피비(1 : k² : k³)는 중2 <b>닮음</b>에서 정식으로 다루므로, 여기서 감각을 먼저 잡아 두면 좋습니다.'},

/* 40 줄기와 잎 그림 */
{tex:[
  {t:'\\text{줄기와 잎} : \\text{값} = (\\text{줄기})\\times 10 + (\\text{잎})',
   s:'42를 4│2 로 적습니다. 자릿수를 나누어 적을 뿐이므로 <b>원래 값이 그대로 남습니다</b>.'},
  {t:'\\text{도수분포표} : x \\mapsto [\\,s,\\;s+w\\,)',
   s:'값을 계급으로 <b>보내 버립니다</b>. 그 계급에 몇 개인지만 남고 각각이 얼마였는지는 사라집니다.'},
  {t:'\\text{정보량} : \\text{줄기와 잎} > \\text{히스토그램}',
   s:'대신 자료가 많아지면 줄기와 잎은 읽을 수 없게 됩니다. <b>무엇을 버리고 무엇을 얻을지</b>의 문제입니다.'}
 ],
 next:[
  {lv:'바로',   t:'우리 반 자료로 세 가지 다 그리기', d:'통학 시간이나 수행평가 점수를 모아 줄기와 잎·도수분포표·히스토그램으로 각각 그리고, 어느 것이 가장 읽기 좋은지 이야기합니다.'},
  {lv:'심화',   t:'등을 맞댄 줄기와 잎', d:'남녀 또는 두 반의 자료를 줄기 하나에 <b>양쪽으로</b> 붙여 그립니다. 두 집단을 한 그림에서 비교할 수 있는 이유를 설명하세요.'},
  {lv:'프로젝트', t:'자료 수에 따른 방법 고르기', d:'같은 성격의 자료를 20개·100개·1000개로 늘려 가며 세 방법을 모두 그려 보고, <b>몇 개부터 어느 방법이 나은지</b> 기준을 만들어 제시합니다.'}
 ],
 eq:'줄기와 잎 — 값을 남긴다 · 도수분포표 — 개수만 남긴다',
 what:'정리는 <b>버리는 일</b>이기도 합니다. 줄기와 잎은 값을 하나도 버리지 않아 중앙값을 그림에서 바로 셀 수 있고, 히스토그램은 값을 버리는 대신 분포의 모양을 한눈에 보여 줍니다. 목적이 방법을 고릅니다.',
 probe:'세 방법을 오가며 “중앙값을 이 그림에서 셀 수 있는가”를 물어 보세요. 줄기와 잎에서는 잎을 세면 되지만 히스토그램에서는 <b>계급 안 어디인지 알 수 없어</b> 정확히 셀 수 없습니다.',
 link:'자료의 정리 단원에서 씁니다. “정리하면 무엇을 잃는가”라는 물음은 바로 다음 <b>상대도수</b>와 고등학교 통계의 요약통계량 전체에 적용됩니다.'},

/* 41 상대도수 */
{tex:[
  {t:'(\\text{상대도수})=\\frac{(\\text{그 계급의 도수})}{(\\text{도수의 총합})}',
   s:'분모를 <b>자기 집단의 크기</b>로 두는 것이 전부입니다. 이렇게 하면 크기가 다른 집단이 같은 자에 놓입니다.'},
  {t:'\\sum (\\text{상대도수}) = 1',
   s:'모든 계급의 상대도수를 더하면 언제나 1 입니다. 집단이 30명이든 300명이든 마찬가지입니다.'},
  {t:'(\\text{도수}) = (\\text{상대도수}) \\times (\\text{도수의 총합})',
   s:'거꾸로도 씁니다. 비율만 주어졌을 때 <b>실제 인원</b>을 되찾는 식입니다.'}
 ],
 next:[
  {lv:'바로',   t:'두 반 자료로 직접 비교하기', d:'인원이 다른 두 반의 자료를 받아 도수와 상대도수로 각각 그려 보고, 어느 그림이 비교에 쓸 수 있는지 판단합니다.'},
  {lv:'심화',   t:'비율의 함정 찾기', d:'“B의 증가율이 200%”라는 문장이 실제로는 2명 → 6명일 수 있음을 예로 만들어, <b>비율만 보여 줄 때 생기는 오해</b>를 정리합니다.'},
  {lv:'프로젝트', t:'지역별 통계 바르게 비교하기', d:'인구가 다른 두 시·군의 통계(도서관 수, 확진자 수 등)를 찾아 인구당 값으로 바꿔 비교하고, 원자료 비교와 어떻게 달라지는지 보고서로 씁니다.'}
 ],
 eq:'상대도수 = 도수 ÷ 도수의 총합,  상대도수의 합 = 1',
 what:'크기가 다른 두 집단은 <b>도수로 비교할 수 없습니다</b>. 인원이 3배면 막대도 3배가 되니까요. 각자의 총합으로 나누는 순간 두 집단이 같은 자에 놓이고, 그제야 “어느 쪽이 더 높은가”를 물을 수 있습니다.',
 probe:'배수를 3배로 두고 도수로 보면 B반이 전부 높습니다. 상대도수로 바꾸면 <b>두 봉우리의 자리</b>가 드러납니다. 치우침을 0으로 두면 모양이 거의 겹치는 것도 확인하세요 — 인원만 달랐던 것입니다.',
 link:'상대도수 단원에서 씁니다. “분모를 자기 크기로 두어 비교 가능하게 만든다”는 것은 고등학교 <b>확률</b>과 머신러닝의 정규화(normalization)와 같은 생각입니다.'},

/* 42 통계적 탐구 */
{tex:[
  {t:'\\bar{x}=\\frac{1}{n}\\sum x_i',
   s:'표본에서 구한 평균입니다. 표본이 달라지면 <b>이 값도 달라집니다</b>.'},
  {t:'\\text{표본이 클수록 } \\bar{x} \\text{ 의 흔들림이 줄어든다}',
   s:'같은 크기로 여러 번 뽑아 보면 값이 벌어지는 폭이 보입니다. n 이 커질수록 그 폭이 좁아집니다.'},
  {t:'\\text{편향} \\ne \\text{흔들림}',
   s:'표본을 아무리 크게 해도 <b>뽑는 방법이 치우쳐 있으면</b> 값은 계속 틀립니다. 크기와 공정함은 다른 문제입니다.'}
 ],
 next:[
  {lv:'바로',   t:'우리 반에서 실제로 조사하기', d:'탐구 문제를 하나 정하고 반 전체에 설문해 자료를 모읍니다. 질문 문장이 답을 유도하지 않는지 서로 점검하세요.'},
  {lv:'심화',   t:'편향된 표본 만들어 보기', d:'일부러 치우친 방법으로 표본을 뽑아(예: 아침 일찍 등교한 학생만) 결과가 어떻게 달라지는지 확인하고, <b>왜 크기를 늘려도 고쳐지지 않는지</b> 설명합니다.'},
  {lv:'프로젝트', t:'학교에 제안하는 통계 보고서', d:'문제 설정 → 자료 수집 → 분석 → 해석 → 제안까지 한 편의 보고서로 완성해 학생회나 학교에 제출합니다. 표본의 한계를 반드시 밝히세요.'}
 ],
 eq:'표본평균은 뽑을 때마다 달라진다 — 그 흔들림의 폭이 신뢰의 척도',
 what:'통계적 탐구는 <b>문제를 세우는 일부터</b> 시작합니다. 자료를 모으고 계산하는 것은 그중 일부일 뿐입니다. 표본으로 전체를 말하려면 “얼마나 많이”와 “어떻게 공정하게” 두 가지를 모두 답해야 합니다.',
 probe:'표본 20명으로 「다시 뽑기」를 다섯 번 눌러 평균을 적어 두고, 200명으로 다시 다섯 번 눌러 보세요. 작은 표본에서는 값이 크게 벌어지고 큰 표본에서는 거의 같습니다. <b>그 벌어진 폭</b>이 곧 결론의 신뢰도입니다.',
 link:'통계적 탐구 단원에서 씁니다. 여기서 겪은 표본의 흔들림은 고등학교 <b>통계적 추정</b>(신뢰구간)의 출발점이며, 공학 도구로 자료를 다루는 경험 자체가 성취기준에 명시되어 있습니다.'},

/* 43 일차식의 덧셈과 뺄셈 */
{tex:[
  {t:'ax+b \\;\\text{에서}\\; ax \\;\\text{와}\\; b \\;\\text{는 다른 것}',
   s:'x 는 아직 정해지지 않은 수입니다. x 가 무엇이 되든 성립해야 하므로 <b>서로 바꿔 셀 수 없습니다</b>.'},
  {t:'(ax+b)+(cx+d)=(a+c)x+(b+d)',
   s:'x 끼리, 상수끼리 모입니다. <b>분배법칙</b> ax + cx = (a + c)x 가 근거입니다.'},
  {t:'(ax+b)-(cx+d)=(a-c)x+(b-d)',
   s:'뺄셈은 <b>괄호 안 전체의 부호를 바꿔 더하는 것</b>입니다. 상수항의 부호를 빠뜨리는 것이 가장 흔한 실수입니다.'}
 ],
 next:[
  {lv:'바로',   t:'타일로 직접 맞춰 보기', d:'색종이로 x 타일과 1 타일을 만들어 여러 식을 실제로 합쳐 봅니다. 왜 다른 색끼리 못 묶는지 말로 설명하세요.'},
  {lv:'심화',   t:'x 에 여러 값을 넣어 검증하기', d:'정리한 식과 원래 식에 x = −3, 0, 5 를 각각 넣어 값이 같은지 확인합니다. <b>한 값만 같아서는 부족한 이유</b>를 설명하세요.'},
  {lv:'프로젝트', t:'우리 반 요금 계산식 만들기', d:'학급 행사 예산을 인원 x 에 대한 일차식으로 세우고, 항목을 더하거나 빼며 식을 정리합니다. 정리 전후의 값이 같은지 검산까지 포함하세요.'}
 ],
 eq:'(ax + b) ± (cx + d) = (a ± c)x + (b ± d)',
 what:'동류항끼리만 묶는 것은 규칙이 아니라 <b>필연</b>입니다. x 가 어떤 값이 되어도 성립해야 하므로, x 타일 3개와 1 타일 2개를 5개로 합칠 수 없습니다. 근거는 분배법칙 하나뿐입니다.',
 probe:'x 값을 바꿔 가며 “원래 식”과 “정리한 식”의 값이 <b>늘 같은지</b> 확인하세요. 뺄셈으로 바꾸면 둘째 식의 타일이 통째로 부호를 뒤집는 것이 보입니다 — 상수항만 빠뜨리면 어떻게 되는지도 시험해 보세요.',
 link:'일차식의 계산 단원에서 씁니다. 여기서 잡은 “같은 것끼리만”이라는 감각은 <b>일차방정식의 이항</b>, 중2 <b>다항식의 계산</b>, 고등학교 <b>벡터의 성분</b>까지 그대로 이어집니다.'},

/* 44 순서쌍과 그래프 해석 */
{tex:[
  {t:'(x,\\;y) \\;\\text{— 순서쌍은 순서가 있다}',
   s:'(2, 5)와 (5, 2)는 다른 점입니다. <b>가로축이 무엇을 재는지</b>부터 정해야 그림이 뜻을 가집니다.'},
  {t:'\\text{평평한 구간} \\;\\Rightarrow\\; y \\text{ 가 변하지 않음}',
   s:'거리 그래프에서는 <b>멈춰 있다</b>는 뜻입니다. 되돌아오는 것이 아닙니다.'},
  {t:'\\text{기울기의 부호} = \\text{방향},\\quad \\text{기울기의 크기} = \\text{빠르기}',
   s:'올라가면 멀어지고 내려가면 돌아옵니다. 가파를수록 빠릅니다 — 뒤에 배울 <b>변화율</b>의 직관입니다.'}
 ],
 next:[
  {lv:'바로',   t:'내 등굣길 그래프 그리기', d:'집에서 학교까지의 실제 이동을 시각-거리 그래프로 그립니다. 멈춘 구간과 빨리 간 구간이 그림에 나타나는지 확인하세요.'},
  {lv:'심화',   t:'같은 이야기, 다른 축', d:'같은 이동을 “집에서의 거리”가 아니라 “지금까지 걸은 거리”로 다시 그립니다. 두 그래프가 어디서 달라지는지, 왜 그런지 설명하세요.'},
  {lv:'프로젝트', t:'그래프만 주고 이야기 맞히기', d:'모둠별로 이야기를 정해 그래프만 그려 교환하고, 상대의 그래프에서 이야기를 복원합니다. 복원이 어긋난 지점이 곧 그래프가 덜 말해 준 부분입니다.'}
 ],
 eq:'순서쌍 (x, y) — 가로축과 세로축이 무엇을 재는지가 먼저다',
 what:'그래프를 읽는 일은 <b>축을 읽는 일</b>에서 시작합니다. 세로축이 “집에서의 거리”인지 “걸은 거리”인지에 따라 같은 이동이 전혀 다른 그림이 됩니다. 평평함은 멈춤이고, 내려감이 되돌아옴입니다.',
 probe:'“운동장 한 바퀴”를 골라 보세요. 끝에서 y 가 0으로 돌아오는데, <b>실제로 달린 거리는 0이 아닙니다</b>. 축이 무엇을 재는지 확인하지 않으면 그래프를 정반대로 읽게 되는 자리입니다.',
 link:'좌표평면과 그래프 단원에서 씁니다. 기울기를 “빠르기”로 읽는 감각은 중2 <b>일차함수</b>의 기울기, 고등학교 <b>미분계수</b>로 곧장 이어집니다.'},

/* 45 제곱근과 무리수 */
 {tex:[
   {t:'(\\sqrt{2}+\\sqrt{3})^2 = 2 + 2\\sqrt{6} + 3 = 5 + 2\\sqrt{6}', s:'곱셈공식으로 제곱하면 가운데 항 <b>2√6</b> 이 남습니다 — 5 가 아니므로 √5 일 수 없습니다.'},
   {t:'\\sqrt{a}\\,\\sqrt{b} = \\sqrt{ab}', s:'곱셈은 근호를 통과합니다 — (√a√b)² = ab 로 바로 확인됩니다. 덧셈과의 운명이 갈리는 지점입니다.'},
   {t:'\\sqrt{8} = \\sqrt{4 \\times 2} = 2\\sqrt{2}', s:'근호 밖으로 꺼내기 — 곱셈 규칙의 응용이고, 막대 실험에서 √8 과 2√2 가 정확히 같은 길이인 이유입니다.'}
  ],
  next:[
   {lv:'바로',   t:'A4 용지의 비밀', d:'A4 의 두 변을 재서 비를 구해 보세요 — √2 에 가깝습니다. 반으로 접어도 같은 비가 유지되는 이유를 식으로 설명해 보세요.'},
   {lv:'심화',   t:'분모의 유리화', d:'1/√2 = √2/2 를 “분모에 근호를 남기지 않는” 규칙으로 정리하고, 왜 그렇게 쓰는지(비교·덧셈 편의) 논해 보세요.'},
   {lv:'프로젝트', t:'√2 는 분수가 아니다', d:'√2 = p/q 라 가정하고 모순을 끌어내는 귀류법 증명을 만화 또는 카드뉴스로 재구성해 보세요.'}
  ],
  eq:'√a + √b ≠ √(a+b) · √a × √b = √(ab)',
  what:'근호가 어떤 연산은 통과하고(곱) 어떤 연산은 통과하지 못하는지(합)를 <b>길이 실험</b>으로 확정합니다. 규칙 암기가 아니라 제곱해 보면 판정 끝입니다.',
  probe:'√8 막대와 2√2 막대를 겹쳐 보세요 — 정확히 같습니다. 같은 것과 다른 것을 손으로 가려내는 것이 이 실험의 전부입니다.',
  link:'제곱근과 실수 단원의 도입입니다. 근호 연산 규칙 전체가 “제곱해서 확인”이라는 하나의 기술로 정리됩니다.'},

/* 46 테오도루스의 나선 */
 {tex:[
   {t:'1^2 + 1^2 = 2 \\;\\Rightarrow\\; \\text{빗변} = \\sqrt{2}', s:'첫 삼각형 — 한 변 1 인 직각이등변삼각형의 빗변이 √2 입니다.'},
   {t:'(\\sqrt{n})^2 + 1^2 = n + 1 \\;\\Rightarrow\\; \\sqrt{n+1}', s:'빗변 √n 위에 길이 1 을 수직으로 세우면 새 빗변은 √(n+1) — <b>한 칸씩 모든 √</b>가 만들어집니다.'},
   {t:'\\text{컴퍼스로 반지름 } \\sqrt{n} \\text{ 을 수직선에}', s:'작도한 빗변을 컴퍼스로 돌려 수직선에 눕히면 √n 의 <b>정확한 자리</b> — 1.414… 를 아무리 길게 써도 닿지 못하는 자리입니다.'}
  ],
  next:[
   {lv:'바로',   t:'√4·√9 검문', d:'나선에서 √4, √9 가 정확히 2, 3 자리에 앉는지 확인하세요 — 작도의 자기 검산입니다.'},
   {lv:'심화',   t:'√2 하나로 √6 만들기', d:'√2 와 √3 을 두 변으로 하는 직각삼각형의 빗변이 √5 인지 √6 인지 계산으로 예언하고 작도로 확인하세요.'},
   {lv:'프로젝트', t:'나선 아트', d:'테오도루스 나선을 17 단계(고전적 종점)까지 색을 입혀 그리고, 각 부채꼴 각이 점점 줄어드는 이유를 tan 으로 설명해 보세요.'}
  ],
  eq:'√n → 직각변 1 추가 → √(n+1)',
  what:'무리수가 “계산기 속 소수”가 아니라 <b>자와 컴퍼스로 정확히 짚을 수 있는 길이</b>임을 몸으로 확인합니다. 수직선 위의 자리가 근삿값보다 먼저입니다.',
  probe:'√2 를 눕힌 점과 1.41 자리를 확대해 상상해 보세요 — 어떤 유한소수도 그 점에 정확히 앉지 못합니다. 그 간극이 무리수의 정의입니다.',
  link:'무리수 단원에서 수직선의 완비성(고교 전문수학의 씨앗)까지 이어지는 활동입니다. LAB 68(피타고라스)의 직접 응용이기도 합니다.'},

/* 47 인수분해 암산 */
 {tex:[
   {t:'(a-b)(a+b) = a^2 - b^2', s:'전개하면 가운데 항 −ab + ab 가 <b>상쇄</b> — 두 항만 남는 것이 이 공식의 힘입니다.'},
   {t:'99 \\times 101 = (100-1)(100+1) = 10000 - 1', s:'두 수를 <b>가운데 수 ± 차이</b>로 읽는 눈 — 그 순간 곱셈이 뺄셈이 됩니다.'},
   {t:'25 \\times 35 = (30-5)(30+5) = 900 - 25 = 875', s:'가운데 수가 100 이 아니어도 통합니다 — 합이 짝수인 두 수면 언제나.'}
  ],
  next:[
   {lv:'바로',   t:'제곱 암산', d:'101² = (100+1)², 99² = (100−1)² 을 완전제곱 공식으로 암산해 보세요 — 합차와 형제 기술입니다.'},
   {lv:'심화',   t:'언제 안 통하나', d:'97×101 처럼 가운데 수가 정수로 안 잡히는 곱은 어떻게 처리할지(97×100+97) 전략을 세워 보세요.'},
   {lv:'프로젝트', t:'인수분해 마술쇼', d:'“아무 두 자리 수나 불러 봐” 3초 암산 마술의 대본을 쓰고, 무대 뒤의 공식을 해설하는 영상을 만들어 보세요.'}
  ],
  eq:'(a−b)(a+b) = a² − b²',
  what:'인수분해가 시험 기술이 아니라 <b>계산을 접는 기술</b>임을 체험합니다. 식의 “모양을 알아보는 눈”이 계산량을 결정합니다.',
  probe:'그림에서 조각이 옮겨 붙는 순간을 보세요 — 대수의 등식이 넓이의 보존과 같은 말임이 LAB 58 에 이어 다시 확인됩니다.',
  link:'다항식의 곱셈·인수분해 단원의 활용 차시입니다. 근의 공식(LAB 48)·판별식(81)로 가기 전의 근력 운동입니다.'},

/* 48 근의 공식 */
 {tex:[
   {t:'ax^2+bx+c=0 \\;\\Rightarrow\\; x = \\frac{-b \\pm \\sqrt{b^2-4ac}}{2a}', s:'어떤 이차방정식이든 계수 셋만 넣으면 근이 나오는 <b>만능 열쇠</b> — 완전제곱식 유도(LAB 50)의 결과물입니다.'},
   {t:'x^2 - x - 6 = 0 \\;\\Rightarrow\\; x = \\frac{1 \\pm 5}{2} = 3, -2', s:'눈으로 찍은 근과 공식의 근이 일치하는 순간 — 그래프의 교점과 방정식의 해가 같은 것임이 확정됩니다.'},
   {t:'p + q = -\\frac{b}{a}, \\quad pq = \\frac{c}{a}', s:'두 근의 합·곱이 계수에 그대로 들어 있습니다 — 근을 구하지 않고도 아는 것들(근과 계수의 관계).'}
  ],
  next:[
   {lv:'바로',   t:'검산 두 가지', d:'구한 근을 식에 대입하는 검산과, 합·곱을 계수와 맞추는 검산 — 어느 쪽이 빠른지 비교해 보세요.'},
   {lv:'심화',   t:'± 의 기하', d:'−b/2a 가 축(두 근의 한가운데), √D/2a 가 반지름(벌어짐)임을 그래프에 그려 공식을 “그림 한 장”으로 만들어 보세요.'},
   {lv:'프로젝트', t:'포물선 낙하 실측', d:'공 던지는 영상을 찍어 궤적 좌표를 따고, 이차함수로 맞춘 뒤 착지점을 근의 공식으로 예측해 실측과 비교해 보세요.'}
  ],
  eq:'x = (−b ± √(b²−4ac)) / 2a',
  what:'공식이 “외울 것”이 아니라 <b>찍기를 정확히로 바꾸는 도구</b>임을 겪습니다. 먼저 눈으로 근을 짚고, 공식이 그것을 판정하는 순서가 핵심입니다.',
  probe:'−b/2 가 늘 두 추측의 한가운데인지 확인해 보세요 — 공식의 두 부분(중심 ± 벌어짐)이 그래프에서 각각 보입니다.',
  link:'이차방정식 단원의 중심입니다. LAB 50(유도)와 LAB 49(판별식)을 앞뒤에 두면 “어디서 와서 무엇을 알려 주는가”가 완성됩니다.'},

/* 49 판별식 */
 {tex:[
   {t:'D = b^2 - 4ac', s:'근의 공식에서 근호 안 — <b>부호만으로</b> 실근의 개수가 정해집니다.'},
   {t:'D > 0: \\text{서로 다른 두 실근}, \\; D = 0: \\text{중근}, \\; D < 0: \\text{실근 없음}', s:'±√D 의 벌어짐이 양수·0·허수가 되는 세 갈래 — 그래프에서는 교점 2·1·0.'},
   {t:'x^2 - 2x - k = 0 \\;\\Rightarrow\\; D = 4 + 4k', s:'수평선의 높이 k 가 판별식에 들어가 있어, 선을 끄는 것이 곧 D 를 끄는 것입니다.'}
  ],
  next:[
   {lv:'바로',   t:'접선의 조건', d:'y = 2x + k 가 y = x² 에 접하도록 k 를 정해 보세요 — 판별식 = 0 이 접선 문제의 표준 기술입니다.'},
   {lv:'심화',   t:'중근의 정체', d:'D = 0 에서 두 근이 “하나로 겹친” 것임을 인수분해 (x−p)² 으로 확인하고, 접한다는 말과 잇습니다.'},
   {lv:'프로젝트', t:'충돌 판정기', d:'게임에서 공의 포물선 궤적이 바닥·벽과 만나는지 미리 판정하는 코드를 판별식으로 설계해 보세요.'}
  ],
  eq:'D 의 부호 = 실근의 개수',
  what:'“풀지 않고 아는 것”의 첫 경험입니다. 계산 전에 구조(D 의 부호)가 답의 개수를 결정한다 — 수학이 예언이 되는 순간입니다.',
  probe:'접하는 순간(D = 0)에 자석처럼 붙는 그 자리 — 두 빨간 점이 하나로 겹치는 것을 눈으로 보세요. “중근”이라는 말의 그림입니다.',
  link:'이차방정식과 이차함수를 잇는 다리입니다. LAB 60(연립 해의 개수)과 같은 구조 — “교점 수 = 해의 수”의 이차 버전입니다.'},

/* 50 완전제곱식 */
 {tex:[
   {t:'x^2 + bx = \\left(x + \\frac{b}{2}\\right)^2 - \\left(\\frac{b}{2}\\right)^2', s:'기역자 타일의 모서리 구멍이 (b/2)² — <b>더한 만큼 빼야</b> 등식이 유지됩니다.'},
   {t:'x^2+6x=7 \\;\\Rightarrow\\; (x+3)^2 = 16 \\;\\Rightarrow\\; x = -3 \\pm 4', s:'정사각형이 되는 순간 제곱근 한 번으로 풀립니다 — 이것이 완전제곱식 풀이입니다.'},
   {t:'ax^2+bx+c=0 \\;\\;\\Rightarrow\\;\\; x = \\frac{-b \\pm \\sqrt{b^2-4ac}}{2a}', s:'숫자 대신 문자로 같은 접기를 하면 <b>근의 공식</b>이 통째로 흘러나옵니다.'}
  ],
  next:[
   {lv:'바로',   t:'꼭짓점 읽기', d:'y = x²+6x+11 을 (x+3)²+2 로 접어 꼭짓점 (−3, 2) 를 읽으세요 — LAB 51(평행이동)과 만나는 지점입니다.'},
   {lv:'심화',   t:'a ≠ 1 일 때', d:'2x²+8x+3 처럼 앞에 계수가 있으면 어디서 먼저 묶어야 하는지, 타일로는 어떤 그림이 되는지 설계해 보세요.'},
   {lv:'프로젝트', t:'유도 영상 만들기', d:'타일 접기 → 문자 유도 → 근의 공식까지를 60초 영상으로 만들어 보세요. “공식은 외우는 게 아니라 접는 것”이 주제입니다.'}
  ],
  eq:'x²+bx = (x+b/2)² − (b/2)²',
  what:'근의 공식의 <b>출생 과정</b>입니다. 타일의 구멍 하나가 공식의 −4ac 옆 b² 이 되는 것을 눈과 손으로 따라갑니다.',
  probe:'b 를 4→6→8 로 바꾸며 구멍이 4→9→16 으로 커지는 것을 보세요 — (b/2)² 이라는 식이 그림에서 먼저 나옵니다.',
  link:'이차방정식 풀이의 중심 유도입니다. LAB 58(곱셈공식 그림)에서 시작해 LAB 48(근의 공식)으로 끝나는 3부작의 가운데 장입니다.'},

/* 51 이차함수 평행이동 */
 {tex:[
   {t:'y = (x-p)^2 + q \\;\\text{의 꼭짓점은 } (p, q)', s:'포물선의 주소가 식 안에 통째로 들어 있습니다 — 다만 p 는 <b>부호가 반대로</b> 보입니다.'},
   {t:'x-3=0 \\;\\Leftrightarrow\\; x=3', s:'(x−3)² 이 0 이 되는 자리가 x = 3 — y = x² 이 원점에서 하던 일을 <b>3 에서 늦게</b> 시작합니다. 그래서 오른쪽 이동.'},
   {t:'y = x^2-6x+11 = (x-3)^2+2', s:'일반형은 완전제곱식으로 접어야 주소가 보입니다 — LAB 50 의 기술이 여기서 재사용됩니다.'}
  ],
  next:[
   {lv:'바로',   t:'거꾸로 문제', d:'꼭짓점 (−2, 5) 인 포물선의 식을 쓰고, 화면에서 배달해 검산하세요 — 부호 함정을 두 방향으로 넘습니다.'},
   {lv:'심화',   t:'x축 y축 이동 분해', d:'y=(x−p)²+q 를 “x 를 p 만큼, y 를 q 만큼” 두 단계로 나눠, 각 단계가 식의 어디를 바꾸는지 정리하세요.'},
   {lv:'프로젝트', t:'분수받침 설계', d:'분수(물줄기) 포물선의 꼭짓점 위치를 정해 두 지점을 통과하도록 p·q·a 를 조정하는 설계 문제를 만들어 보세요.'}
  ],
  eq:'y=(x−p)²+q ↔ 꼭짓점 (p, q)',
  what:'함수의 평행이동을 “공식”이 아니라 <b>배달(위치 조작)</b>로 익힙니다. 괄호 안 부호의 함정은 “늦게 출발한다”는 한 문장으로 풀립니다.',
  probe:'목표가 왼쪽(p<0)일 때 식의 괄호가 (x+2) 로 바뀌는 순간을 보세요 — 함정이 규칙으로 바뀌는 지점입니다.',
  link:'이차함수 그래프 단원의 중심입니다. 중2 의 LAB 62(기울기·절편 분리)와 같은 정신 — 매개변수 = 위치 조작기.'},

/* 52 이차함수 최적화 */
 {tex:[
   {t:'S = w(10-w) = -w^2 + 10w', s:'제약(둘레 20)을 넣으면 넓이가 <b>한 변수의 이차함수</b>가 됩니다 — 최적화의 출발선.'},
   {t:'S = -(w-5)^2 + 25', s:'완전제곱식으로 접으면 봉우리가 드러납니다 — w = 5 에서 최대 25. <b>정사각형이 답</b>입니다.'},
   {t:'0 < w < 10', s:'정의역 — 식은 w = 12 도 계산해 주지만 <b>울타리는 성립하지 않습니다</b>. 모델의 적용 범위가 답을 제한합니다.'}
  ],
  next:[
   {lv:'바로',   t:'벽을 낀 울타리', d:'한 면이 벽이면(울타리 3면만) 최대가 정사각형이 아니게 됩니다 — S = w(20−2w) 를 접어 답을 구하고 실험과 비교하세요.'},
   {lv:'심화',   t:'합이 일정하면 곱은', d:'“합이 일정한 두 수의 곱은 같을 때 최대”를 완전제곱식으로 증명하고, 산술-기하 평균 부등식의 첫 모습임을 확인하세요.'},
   {lv:'프로젝트', t:'최적 상자 재설계', d:'LAB 39(택배 상자)의 겉넓이 최소 문제를 이차함수 관점에서 다시 풀어, 두 실험의 답이 같은 원리(대칭)임을 보고서로 쓰세요.'}
  ],
  eq:'S = −(w−5)² + 25 → w=5 에서 최대',
  what:'이차함수가 “그래프 단원”이 아니라 <b>결정의 도구</b>임을 겪습니다. 접으면(완전제곱) 최적점이 좌표로 튀어나옵니다.',
  probe:'w = 4.9 와 5.1 의 넓이가 같은 것을 확인하세요 — 봉우리 좌우의 대칭이 “왜 같을 때 최대인가”의 그림입니다.',
  link:'이차함수 활용의 대표 문제입니다. 고교 미분(LAB 카탈로그의 최적화)으로 가는 가장 자연스러운 다리입니다.'},

/* 53 곱셈공식 넓이 */
 {tex:[
   {t:'(a+b)^2 = a^2 + 2ab + b^2', s:'큰 정사각형이 네 조각 — a² 하나, ab <b>둘</b>, b² 하나. 2ab 의 「2」는 조각의 개수입니다.'},
   {t:'(a-b)^2 = a^2 - 2ab + b^2', s:'a² 에서 a×b 기둥을 두 번 빼면 모서리가 <b>겹쳐서 두 번</b> 빠집니다 — 겹친 b² 을 한 번 되돌리는 것이 마지막 항입니다.'},
   {t:'(a+b)(a-b) = a^2 - b^2', s:'같은 그림에서 조각 하나를 잘라 옮기면 가운데 항이 아예 사라집니다 — 합차 공식(LAB 47)과 한 가족입니다.'}
  ],
  next:[
   {lv:'바로',   t:'21² 을 3초에', d:'21² = (20+1)² 을 네 조각(400+40+40+1)으로 암산해 보세요. 19² 은 차의 제곱으로.'},
   {lv:'심화',   t:'(a+b)³ 은 몇 조각?', d:'정육면체를 같은 방식으로 자르면 조각이 몇 개이고 각각 무엇일지 예상하고, 전개식과 맞춰 보세요.'},
   {lv:'프로젝트', t:'겹침 세기의 수학', d:'두 번 뺀 것을 되돌리는 아이디어(포함배제)로 「1~100 중 2 또는 3 의 배수」를 세는 문제를 만들어 해설하세요.'}
  ],
  eq:'(a±b)² = a² ± 2ab + b²',
  what:'곱셈공식이 외울 주문이 아니라 <b>넓이 분할의 목록</b>임을 확인합니다. 각 항이 그림의 조각 하나와 정확히 짝지어집니다.',
  probe:'a=b 로 만들어 보세요 — 네 조각이 같아지며 (2a)² = 4a² 이 저절로 나옵니다. 특수한 경우가 공식을 검산해 줍니다.',
  link:'다항식의 곱셈 도입 차시. 인수분해(LAB 47)·완전제곱식(LAB 50)이 모두 이 그림의 역방향입니다.'},

/* 54 특수각 삼각비 */
 {tex:[
   {t:'\\sin 30^\\circ = \\frac{1}{2}, \\; \\cos 30^\\circ = \\frac{\\sqrt{3}}{2}', s:'한 변 2 인 정삼각형을 반으로 — 빗변 2, 밑변 1, 높이 √3. 세 값이 이 한 그림에서 다 나옵니다.'},
   {t:'\\sin 45^\\circ = \\cos 45^\\circ = \\frac{\\sqrt{2}}{2}', s:'한 변 1 인 정사각형의 대각선 — 1:1:√2. 두 직각변이 같으니 sin 과 cos 도 같습니다.'},
   {t:'\\sin^2\\theta + \\cos^2\\theta = 1', s:'세 특수각 모두에서 성립합니다 — 빗변 1 인 직각삼각형의 피타고라스 정리 그 자체이기 때문입니다.'}
  ],
  next:[
   {lv:'바로',   t:'짝의 발견', d:'sin 30° = cos 60°, sin 60° = cos 30° — 우연인지 표에서 확인하고 「남은 각」으로 설명해 보세요.'},
   {lv:'심화',   t:'15° 는 왜 안 깔끔한가', d:'특수각이 아닌 각의 삼각비가 「깔끔한 수」가 아닌 이유를, 정다각형 작도 가능성과 이어 조사해 보세요.'},
   {lv:'프로젝트', t:'경사로 안전 기준', d:'휠체어 경사로의 법정 기울기(1/12)를 각도와 tan 으로 환산하고, 학교 경사로를 실측해 판정 보고서를 쓰세요.'}
  ],
  eq:'30°·45°·60° — 두 도형에서 나온 세 기준값',
  what:'특수각의 값이 <b>정삼각형·정사각형이라는 출생지</b>를 갖는다는 사실을 확인합니다. 암기가 아니라 도형 두 개를 반으로 자르는 일입니다.',
  probe:'자석에 붙는 순간에만 값이 분수·근호로 깔끔해지는 것을 보세요 — 37° 같은 각은 소수 근삿값뿐입니다. 그 차이가 「특수」의 뜻입니다.',
  link:'삼각비 도입 직후. 삼각비의 표(LAB 55)와 측량(LAB 05)으로 가기 전 기준값을 몸에 붙이는 차시입니다.'},

/* 55 삼각비 표와 보간 */
 {tex:[
   {t:'\\sin 35^\\circ = 0.5736, \\; \\sin 40^\\circ = 0.6428', s:'표는 띄엄띄엄 — 필요한 37° 는 표에 없습니다. 수학자들은 표 사이를 <b>직선으로 이어</b> 읽었습니다.'},
   {t:'\\sin 37^\\circ \\approx 0.5736 + \\frac{2}{5}(0.6428-0.5736) = 0.6013', s:'일차 보간 — 두 칸 사이를 2/5 만큼 간 지점. 참값 0.6018 과 소수 셋째 자리까지 같습니다.'},
   {t:'\\cos(90^\\circ - \\theta) = \\sin\\theta', s:'표를 반만 만들어도 되는 이유 — 직각삼각형의 남은 각이 90°−θ 라서 sin 표가 곧 cos 표입니다.'}
  ],
  next:[
   {lv:'바로',   t:'tan 표도 만들기', d:'같은 방법으로 tan 표를 만들고, 80° 근처에서 보간 오차가 왜 커지는지 확인하세요 — 급하게 휘는 곳은 직선이 못 따라갑니다.'},
   {lv:'심화',   t:'표 간격의 경제학', d:'간격을 1°로 좁히면 정확하지만 표가 큽니다. 오차 0.001 이내로 만들 최소 간격을 실험으로 정해 보세요.'},
   {lv:'프로젝트', t:'게임 엔진의 룩업 테이블', d:'sin 을 매번 계산하는 대신 표+보간을 쓰는 코드의 속도 이득을 조사하고, 미니 표 라이브러리를 설계해 보세요.'}
  ],
  eq:'표 + 일차 보간 = 계산기 이전의 계산기',
  what:'함수값을 <b>미리 계산해 두고 사이를 직선으로 잇는</b> 기술을 체험합니다. 400년 전 항해사도, 오늘의 게임 엔진도 같은 방법을 씁니다.',
  probe:'표를 성기게(15° 간격) 만들어 같은 보간을 해 보세요 — 오차가 훌쩍 큽니다. 표의 촘촘함과 정확도의 거래가 눈에 보입니다.',
  link:'삼각비 단원의 활용 차시. 중2 일차함수(두 점을 잇는 직선)가 도구로 재등장하는 지점입니다.'},

/* 56 원주각 */
 {tex:[
   {t:'\\angle APB = \\frac{1}{2}\\angle AOB', s:'같은 호를 바라보는 원주각은 중심각의 절반 — P 가 어디에 있든 변하지 않습니다.'},
   {t:'\\angle AOB = 180^\\circ \\;\\Rightarrow\\; \\angle APB = 90^\\circ', s:'호가 반원이면 원주각은 직각 — <b>탈레스의 정리</b>입니다. 지름만 그으면 직각이 공짜로 나옵니다.'},
   {t:'OP = OA = OB = r', s:'증명의 열쇠 — 중심과 이은 세 선분이 모두 반지름이라 이등변삼각형 두 개가 생기고, 바깥각 정리가 「2배」를 만듭니다.'}
  ],
  next:[
   {lv:'바로',   t:'직각 만들기 기계', d:'종이에 원을 그리고 지름을 그은 뒤, 원 위 아무 점이나 이어 직각삼각형을 다섯 개 만들어 각도기로 검산하세요.'},
   {lv:'심화',   t:'같은 쪽·반대쪽', d:'P 를 호 AB 와 같은 쪽으로 옮기면 각이 180°−θ 가 됩니다 — 내접 사각형(LAB 58)의 대각합이 여기서 나옵니다.'},
   {lv:'프로젝트', t:'골대가 가장 넓어 보이는 자리', d:'축구장에서 골대를 같은 각으로 보는 자리들이 원을 이룹니다. 드리블 경로 위에서 슛 각이 최대가 되는 지점을 작도로 찾으세요.'}
  ],
  eq:'원주각 = 중심각 ÷ 2 — 위치와 무관',
  what:'원이 <b>각을 보존하는 곡선</b>임을 발견합니다. 「어디서 보나 같다」는 불변량의 첫 경험이고, 탈레스는 그 특수한 경우입니다.',
  probe:'P 를 끌 때 각도 표시가 소수 첫째 자리까지 안 변하는 것을 확인하세요 — 우연이 아니라 정리입니다. A·B 를 끌면 그때만 변합니다.',
  link:'원의 성질 단원의 중심 정리. 내접 사각형(LAB 58)·접선(LAB 57)과 삼각 측량의 뿌리가 됩니다.'},

/* 57 원의 접선 */
 {tex:[
   {t:'OA \\perp PA', s:'접선은 접점에서 반지름과 직각 — 원에 「스치기만」 하려면 이 각도뿐입니다.'},
   {t:'PA = PB = \\sqrt{OP^2 - r^2}', s:'직각이 생기는 순간 피타고라스가 접선의 길이를 계산해 줍니다 — 두 접선이 같은 이유이기도 합니다(합동).'},
   {t:'\\text{가시 범위} = 2\\cos^{-1}\\frac{r}{OP} < 180^\\circ', s:'위성이 아무리 높아도 반구를 넘겨 볼 수는 없습니다 — 접선이 만드는 기하학적 한계입니다.'}
  ],
  next:[
   {lv:'바로',   t:'정지궤도 위성의 시야', d:'지구 반지름 6371km, 정지궤도 35786km 를 넣어 가시 범위를 계산하고, 위성 몇 대면 전 지구를 덮는지 구하세요.'},
   {lv:'심화',   t:'두 접선의 합동 증명', d:'△OPA ≡ △OPB 를 RHS 합동으로 증명해 「접선의 길이는 같다」를 완성하세요.'},
   {lv:'프로젝트', t:'등대의 사각지대', d:'해안선(원호)과 등대 위치를 정해 불빛이 닿지 않는 사각지대를 접선으로 작도하고 지도로 만들어 보세요.'}
  ],
  eq:'PA = √(OP² − r²) · 반지름⊥접선',
  what:'「스친다」는 말이 <b>직각이라는 정확한 조건</b>으로 번역되는 것을 봅니다. 직각 하나가 길이 공식과 가시 범위 한계를 모두 낳습니다.',
  probe:'P 를 원에 바짝 붙여 보세요 — 접선 길이가 0 으로, 가시 범위도 0 으로 무너집니다. 공식의 극한 상태가 그림으로 확인됩니다.',
  link:'원의 성질 마무리 차시. 피타고라스(중2)가 원 위에서 재활용되는 지점이고, 고교 원의 방정식·판별식 접선 문제의 원형입니다.'},

/* 58 내접 사각형 */
 {tex:[
   {t:'\\angle A + \\angle C = 180^\\circ', s:'마주보는 두 각의 합은 반드시 180° — 모양을 아무리 바꿔도 원 위에 있는 한 변하지 않습니다.'},
   {t:'\\angle A = \\frac{1}{2}(\\text{호 } BCD), \\; \\angle C = \\frac{1}{2}(\\text{호 } DAB)', s:'두 각은 각각 반대쪽 호의 절반(원주각) — 두 호를 합치면 원 전체 360° 이므로 각의 합은 180°.'},
   {t:'\\angle A + \\angle C \\ne 180^\\circ \\;\\Rightarrow\\; \\text{네 점은 한 원 위가 아니다}', s:'대우 — 대각합은 「네 점이 한 원 위」를 판정하는 시험지가 됩니다. D 를 떼는 순간 무너지는 이유입니다.'}
  ],
  next:[
   {lv:'바로',   t:'붙임각 정리', d:'한 변을 연장해 만든 바깥각이 「반대쪽 안쪽 각」과 같음을 대각합 180° 에서 유도하세요.'},
   {lv:'심화',   t:'원 위 판정 실전', d:'좌표 네 점이 한 원 위에 있는지 대각합으로 판정하는 절차를 만들고, 한 점을 조금씩 옮기며 민감도를 조사하세요.'},
   {lv:'프로젝트', t:'프톨레마이오스로 가는 길', d:'내접 사각형에서 대각선과 변 사이에 성립하는 프톨레마이오스 정리를 조사하고, 특수한 경우가 피타고라스가 됨을 확인하세요.'}
  ],
  eq:'내접 사각형 ⇔ 대각의 합 180°',
  what:'「원 위에 있다」는 위치 조건이 <b>각도를 묶는 구속</b>임을 반례와 함께 체험합니다. 조건⇒결론과 그 대우가 한 화면에 다 있습니다.',
  probe:'D 를 원 안쪽으로 넣을 때와 바깥으로 뺄 때 합이 반대 방향으로 틀어지는 것을 비교하세요 — 180° 는 정확히 원 위에서만 성립합니다.',
  link:'원주각(LAB 56)의 직접 응용. 「판정 조건」이라는 사고방식이 고1 명제 단원으로 이어집니다.'},

/* 59 상자그림 */
 {tex:[
   {t:'\\text{IQR} = Q_3 - Q_1', s:'가운데 절반이 퍼진 폭 — 상자의 길이입니다. 극단값의 영향을 받지 않는 「순서 기반」 산포도입니다.'},
   {t:'\\text{이상치} : x < Q_1 - 1.5\\,\\text{IQR} \\;\\text{또는}\\; x > Q_3 + 1.5\\,\\text{IQR}', s:'수염의 한계 — 이 선을 넘는 점은 자동으로 분리됩니다. 「멀다」에 숫자 기준을 준 것입니다.'},
   {t:'\\text{중앙값은 버티고 평균은 끌려간다}', s:'한 점이 아무리 커져도 순서는 한 칸만 바뀝니다 — 상자·중앙값이 강건한 이유이고, 평균과의 차이가 이상치의 경보가 됩니다.'}
  ],
  next:[
   {lv:'바로',   t:'우리 반 기록으로', d:'실제 체력 기록(오래달리기 등)으로 상자그림을 그리고, 1.5×IQR 기준으로 이상치가 있는지 판정하세요.'},
   {lv:'심화',   t:'왜 하필 1.5인가', d:'1.0·2.0 으로 바꾸면 이상치 개수가 어떻게 변하는지 실험하고, 1.5 가 관례가 된 사연을 조사하세요.'},
   {lv:'프로젝트', t:'두 반 비교 리포트', d:'두 학급 기록을 나란한 상자그림으로 그려 「어느 반이 더 고른가」를 IQR 로 판정하는 보고서를 쓰세요.'}
  ],
  eq:'다섯 수 요약 + 1.5×IQR 이상치 규칙',
  what:'분포 전체를 <b>다섯 개의 수로 요약</b>하고, 이상치를 눈대중이 아니라 <b>규칙으로</b> 골라내는 도구를 익힙니다.',
  probe:'점 하나를 천천히 끌며 수염 한계를 넘는 정확한 순간을 잡아 보세요 — 「이상하다」가 부등식 하나로 바뀌는 순간입니다.',
  link:'2022 개정에서 새로 들어온 내용입니다. 대푯값(LAB 33)·산점도(LAB 60)와 함께 데이터 리터러시 축을 완성합니다.'},

/* 60 이상치와 상관 */
 {tex:[
   {t:'r = \\frac{\\sum (x-\\bar{x})(y-\\bar{y})}{\\sqrt{\\sum(x-\\bar{x})^2}\\sqrt{\\sum(y-\\bar{y})^2}}', s:'r 은 평균에서 잰 편차의 곱으로 만들어집니다 — 평균에서 먼 점일수록 발언권이 큽니다.'},
   {t:'r_{12} = 0.98 \\;\\rightarrow\\; r_{13} = 0.6\\text{대}', s:'열두 점이 만든 상관을 한 점이 무너뜨립니다 — 표본이 작을수록 한 점의 권력은 더 큽니다.'},
   {t:'\\text{제외는 계산이 아니라 판단이다}', s:'입력 실수는 지우고, 진짜 특이 사례는 남겨 따로 보고합니다 — 다시 계산하는 것은 그다음 일입니다.'}
  ],
  next:[
   {lv:'바로',   t:'가장 파괴적인 구석', d:'네 구석에 이상치를 하나씩 넣어 r 의 낙폭을 재고, 어느 위치가 왜 가장 센지 편차의 곱으로 설명하세요.'},
   {lv:'심화',   t:'강건한 상관', d:'순위로 바꿔 계산하는 스피어만 상관을 조사해 같은 자료에 적용하고, 이상치에 덜 흔들리는지 비교하세요.'},
   {lv:'프로젝트', t:'데이터 정제 규약 만들기', d:'우리 반 설문 데이터의 이상치 처리 규칙(언제 지우고, 언제 남기고, 어떻게 기록하는지)을 문서로 만들어 보세요.'}
  ],
  eq:'점 하나 ↔ r 급변 — 정제는 판단의 문제',
  what:'상관계수가 <b>모든 점의 민주주의가 아니라는 것</b>을 체험합니다. 평균에서 먼 한 점이 결론을 좌우할 수 있고, 그래서 정제가 분석의 절반입니다.',
  probe:'같은 이상치를 대각선 방향(추세와 같은 방향) 구석에 넣어 보세요 — 이번엔 r 이 오히려 올라갑니다. 이상치가 상관을 「만들 수도」 있습니다.',
  link:'산점도와 상관관계 단원의 마무리. LAB 06(상관계수)·LAB 59(상자그림)와 함께 「자료를 의심하는 눈」을 완성합니다.'},

/* 61 에라토스테네스의 체 */
 {tex:[
   {t:'n = a \\times b \\;\\Rightarrow\\; a \\le \\sqrt{n} \\;\\text{또는}\\; b \\le \\sqrt{n}', s:'합성수의 두 인수가 둘 다 √n 보다 클 수는 없습니다 — 곱이 n 을 넘어 버립니다.'},
   {t:'p^2 \\text{ 부터 지워도 되는 이유}', s:'p 의 배수 중 2p, 3p, … (p−1)p 는 더 작은 소수의 배수로 이미 지워졌습니다 — 남은 첫 일감이 p² 입니다.'},
   {t:'100 \\text{까지는 } 2,3,5,7 \\text{ 로 충분}', s:'√100 = 10 이하의 소수 네 개만 돌리면 끝 — 체의 효율이 여기서 나옵니다.'}
  ],
  next:[
   {lv:'바로',   t:'97 판정 3초', d:'97 을 2·3·5·7 로만 나눠 소수임을 판정하고, 왜 11 은 볼 필요가 없는지 쓰세요.'},
   {lv:'심화',   t:'쌍둥이 소수 사냥', d:'체로 거른 표에서 차가 2 인 소수 쌍을 모두 찾고, 100 이후에도 계속 나올지 조사해 보세요.'},
   {lv:'프로젝트', t:'체 대 나눗셈 경주', d:'1000까지의 소수를 「체」와 「하나씩 나눠 보기」 두 방법으로 세는 횟수를 비교하는 보고서를 쓰세요.'}
  ],
  eq:'√n 까지의 소수로만 거르면 끝',
  what:'소수를 「찾는」 게 아니라 합성수를 <b>지워서 남기는</b> 발상의 전환입니다. √n 경계와 p² 시작점이 알고리즘의 효율을 결정합니다.',
  probe:'5 를 지울 차례에 새로 지워지는 수가 25 부터인 것을 확인하세요 — 10·15·20 은 이미 없습니다.',
  link:'소인수분해 단원 도입. 암호 실험(LAB 25)의 「나눠 보기 횟수」가 왜 √N 에서 멈추는지의 근거가 됩니다.'},

/* 62 절댓값과 평균 오차 */
 {tex:[
   {t:'\\text{오차} = \\text{예보} - \\text{실제}', s:'부호가 있는 오차 — 높게 불렀으면 +, 낮게 불렀으면 −. 더하면 서로 지워집니다.'},
   {t:'(+3) + (-3) = 0 \\;\\ne\\; \\text{좋은 예보}', s:'부호 합 0 은 「정확」이 아니라 「상쇄」일 수 있습니다 — 크게 틀린 예보도 합은 0 이 됩니다.'},
   {t:'\\text{평균 오차} = \\frac{|e_1| + |e_2| + \\cdots + |e_n|}{n}', s:'절댓값을 씌워 상쇄를 금지한 뒤 평균 — 공평한 채점의 표준입니다(MAE).'}
  ],
  next:[
   {lv:'바로',   t:'두 예보관 재채점', d:'부호 합이 같은 두 예보를 |오차| 평균으로 다시 채점해 순위가 뒤집히는 예를 만들어 보세요.'},
   {lv:'심화',   t:'제곱 오차와 비교', d:'오차 제곱 평균(MSE)으로도 채점해 보고, 큰 실수 하나에 어느 쪽이 민감한지 비교하세요.'},
   {lv:'프로젝트', t:'우리 지역 예보 검증', d:'일주일 기온 예보와 실제를 기록해 MAE 로 기상청 성적표를 만들어 보세요.'}
  ],
  eq:'MAE = |오차| 의 평균 — 상쇄 금지',
  what:'절댓값이 「음수를 양수로」가 아니라 <b>크기만 남기는 도구</b>임을 채점 상황으로 체험합니다. AI 의 손실함수가 바로 이 아이디어입니다.',
  probe:'+5/−5 예보와 +1/−1 예보의 부호 합은 둘 다 0 — |오차| 평균은 5 배 차이가 나는 것을 확인하세요.',
  link:'정수와 절댓값 단원. 회귀(LAB 15)의 잔차 제곱합, 경사하강(LAB 16)의 손실로 이어지는 첫 계단입니다.'},

/* 63 식의 값과 대입 */
 {tex:[
   {t:'3a^2 \\;\\text{에} \\; a=3: \\; 3 \\times 3^2 = 27', s:'제곱 먼저, 곱은 나중 — 연산 순서가 값을 결정합니다.'},
   {t:'(3a)^2 = 9a^2 \\ne 3a^2', s:'괄호 하나가 계수를 세 배로 — 기계(식)에 무엇이 먼저 들어가는지의 문제입니다.'},
   {t:'a^2 + 2a \\;\\text{와}\\; 3a^2 \\;\\text{의 대소는 } a \\text{ 에 달렸다}', s:'a=1 이면 3<3? 같고, a=2 면 8<12 — 식의 대소는 대입 없이는 단정할 수 없습니다.'}
  ],
  next:[
   {lv:'바로',   t:'함정 문제 출제', d:'27 vs 14 같은 함정(연산 순서)을 이용한 문제를 직접 만들어 짝에게 풀려 보세요.'},
   {lv:'심화',   t:'항상 큰 식?', d:'모든 자연수 a 에서 3a² ≥ a²+2a 인지 차를 인수분해해 판정해 보세요.'},
   {lv:'프로젝트', t:'수식 자판기 설계', d:'동전(값)을 넣으면 식의 값이 나오는 자판기 게임을 설계하고 연산 순서 오류를 함정으로 심어 보세요.'}
  ],
  eq:'대입 = 문자 자리에 수를 넣고 연산 순서대로',
  what:'식이 <b>값을 만드는 기계</b>라는 함수 관점의 씨앗입니다. 연산 순서·괄호가 기계의 배선임을 함정 문제로 체득합니다.',
  probe:'같은 a 를 넣고 a²+2a 와 3a² 의 크기가 뒤바뀌는 경계(a=1)를 찾아보세요.',
  link:'문자와 식 단원. 함수(중2)·다항식 전개(중3)로 가는 「식 = 기계」 감각의 출발점입니다.'},

/* 64 소금물 농도 */
 {tex:[
   {t:'\\text{농도} = \\frac{\\text{소금}}{\\text{소금물}} \\times 100', s:'분모가 물이 아니라 <b>소금물 전체</b> — 가장 흔한 실수가 여기서 갈립니다.'},
   {t:'\\frac{20}{200+x} = \\frac{5}{100}', s:'물 x 를 넣어 5% 를 만드는 방정식 — 소금은 그대로 20 인 것이 핵심입니다.'},
   {t:'x = 200', s:'양변을 정리하면 물 200g — 실험의 버튼 조작과 정확히 같은 답이 나옵니다.'}
  ],
  next:[
   {lv:'바로',   t:'거꾸로 문제', d:'물을 증발시켜 10% 로 올리는 문제를 만들어 방정식과 조작 두 방법으로 푸세요.'},
   {lv:'심화',   t:'두 소금물 섞기', d:'4% 와 10% 를 섞어 6% 300g 만들기 — 미지수 둘의 연립으로 세워 보세요.'},
   {lv:'프로젝트', t:'주스 희석 실험', d:'실제 주스 원액으로 목표 농도를 만드는 조작 절차서(레시피)를 방정식과 함께 쓰세요.'}
  ],
  eq:'농도 = 소금/(소금+물) × 100 — 분모는 전체',
  what:'방정식 세우기의 표준 훈련장입니다. 변하는 것(물)과 안 변하는 것(소금)을 가르는 눈이 식을 만듭니다.',
  probe:'물만 계속 넣을 때 농도가 0 에 다가가지만 결코 0 이 되지 않는 것 — 반비례 곡선의 감각도 함께 옵니다.',
  link:'일차방정식 활용 차시. 비율(중1)과 유리식의 극한 감각(고교)을 잇는 자리입니다.'},

/* 65 수직이등분선 */
 {tex:[
   {t:'PA = PB \\;\\Leftrightarrow\\; P \\in \\text{수직이등분선}', s:'수직이등분선은 「두 점에서 같은 거리인 점 전부」의 모임 — 자취의 첫 경험입니다.'},
   {t:'\\text{반지름 같은 두 호} \\Rightarrow \\text{마름모} \\Rightarrow \\perp \\text{이등분}', s:'같은 반지름 호 두 개의 교점들은 마름모의 꼭짓점 — 마름모의 대각선 성질이 작도를 정당화합니다.'},
   {t:'\\text{세 변의 수직이등분선} \\Rightarrow \\text{외심}', s:'두 개만 그으면 만나는 점이 세 꼭짓점 등거리 — 자동으로 세 번째도 지나갑니다.'}
  ],
  next:[
   {lv:'바로',   t:'종이 접기 검산', d:'A 와 B 가 겹치게 종이를 접어 생기는 금이 작도한 선과 일치하는지 확인하세요.'},
   {lv:'심화',   t:'외심 작도', d:'세 점을 찍고 외심을 작도해 세 점을 지나는 원을 그려 보세요 — 어떤 삼각형이면 외심이 밖으로 나가나요?'},
   {lv:'프로젝트', t:'세 마을의 우물', d:'세 마을에서 같은 거리인 우물 자리를 지도 위 작도로 정하는 문제를 만들어 발표하세요.'}
  ],
  eq:'수직이등분선 = 등거리 점의 자취',
  what:'작도가 「그리기 기술」이 아니라 <b>조건을 만족하는 점의 모임(자취)을 손으로 잡는 일</b>임을 배웁니다.',
  probe:'P 를 선 위에서 끌 때 PA=PB 가 유지되고, 선을 벗어나면 즉시 깨지는 것을 확인하세요 — 필요충분의 그림입니다.',
  link:'기본 작도 단원. GPS(LAB 01)의 „두 기준점에서 등거리“, 외심·내심(중2 심화)으로 이어집니다.'},

/* 66 각의 이등분선 */
 {tex:[
   {t:'\\text{호 1개 + 호 2개} \\Rightarrow \\text{이등분선}', s:'꼭짓점에서 호 하나, 두 교점에서 같은 반지름 호 둘 — 컴퍼스 세 번이면 끝입니다.'},
   {t:'SSS \\Rightarrow \\triangle OAP \\equiv \\triangle OBP', s:'세 쌍의 변이 반지름으로 같아 두 삼각형이 합동 — 그래서 두 각이 정확히 같습니다.'},
   {t:'\\text{이등분선 위 } P: \\; d(P, \\text{변1}) = d(P, \\text{변2})', s:'각의 이등분선은 두 변에서 같은 거리인 점의 자취 — 내심으로 가는 길입니다.'}
  ],
  next:[
   {lv:'바로',   t:'각도기 검증', d:'임의의 각을 작도로 이등분한 뒤 각도기로 재서 오차를 확인하세요 — 작도가 더 정확한 이유를 쓰세요.'},
   {lv:'심화',   t:'내심 작도', d:'세 각의 이등분선으로 내심을 잡고 내접원을 그려 보세요.'},
   {lv:'프로젝트', t:'사분원 없는 45°', d:'직각을 작도로 이등분해 45° 를 만들고, 30°·15° 까지 만드는 절차서를 쓰세요.'}
  ],
  eq:'컴퍼스 세 번 + SSS 합동 = 정확한 절반',
  what:'「대충 반」이 아니라 <b>합동이 보증하는 정확한 반</b> — 작도의 정당화를 합동 조건으로 경험합니다.',
  probe:'각을 바꿔도 절반이 유지되는 것을 확인하고, 근거가 되는 두 삼각형을 화면에서 찾아보세요.',
  link:'작도와 합동 단원의 연결 고리. 삼각형의 합동(LAB 31)이 도구로 쓰이는 첫 현장입니다.'},

/* 67 부채꼴 S=½rl */
 {tex:[
   {t:'S = \\pi r^2 \\times \\frac{x}{360}, \\quad l = 2\\pi r \\times \\frac{x}{360}', s:'넓이도 호도 중심각에 비례 — 같은 비율 x/360 을 공유합니다.'},
   {t:'S = \\frac{1}{2} r l', s:'조각을 잘게 잘라 번갈아 붙이면 밑변 l/2? 아니, 밑변 l·높이 r 의 절반 — 직사각형 절반 꼴로 수렴합니다.'},
   {t:'x = 360: \\; S = \\frac{1}{2} r (2\\pi r) = \\pi r^2', s:'원 전체를 넣으면 원의 넓이 공식이 그대로 — 공식의 자기 검산입니다.'}
  ],
  next:[
   {lv:'바로',   t:'피자 조각 계산', d:'반지름 15cm, 호 12cm 피자 조각의 넓이를 S=½rl 로 구하고 각도로도 검산하세요.'},
   {lv:'심화',   t:'원의 넓이 유도', d:'같은 자르기를 원 전체에 적용해 πr² 유도를 완성하세요 — 조각 수가 늘수록 무엇이 곧아지나요?'},
   {lv:'프로젝트', t:'무한 조각의 예고', d:'64→128→256 조각의 모양 변화를 기록해 「무한히 자르면」의 아이디어(적분의 씨앗)를 소개하는 카드뉴스를 만드세요.'}
  ],
  eq:'S = ½rl — 잘라 붙이면 보이는 공식',
  what:'공식 암기 대신 <b>등적 변형(자르고 재배열)</b>으로 공식을 발견합니다. 극한으로 가는 직관의 첫 장면이기도 합니다.',
  probe:'조각을 늘릴수록 위아래 물결이 펴지는 것을 보세요 — 「거의 직사각형」의 „거의“가 줄어드는 과정입니다.',
  link:'부채꼴 단원. 원의 넓이 유도와 회전체·적분(LAB 24)의 무한 분할 아이디어로 이어집니다.'},

/* 68 정다면체 */
 {tex:[
   {t:'\\text{한 꼭짓점의 각의 합} < 360^\\circ', s:'평평하면(=360°) 접히지 않습니다 — 입체가 되려면 모자라야 합니다.'},
   {t:'\\text{정삼각형}(60^\\circ): 3,4,5\\text{개 가능}, \\; 6\\text{개는 } 360^\\circ', s:'3·4·5개 → 정사면체·정팔면체·정이십면체. 6개는 평면 타일이 되어 탈락.'},
   {t:'\\text{정사각형 } 3\\times90, \\; \\text{정오각형 } 3\\times108 \\Rightarrow \\text{정육면체·정십이면체}', s:'정육각형은 3개만 모여도 360° — 그래서 정다면체는 정확히 5개뿐입니다.'}
  ],
  next:[
   {lv:'바로',   t:'전개도 접기', d:'다섯 정다면체 중 하나의 전개도를 그려 실제로 접고, 꼭짓점에 모인 각의 합을 재 보세요.'},
   {lv:'심화',   t:'오일러 검산', d:'다섯 입체 모두에서 v−e+f = 2 를 표로 확인하세요 (LAB 38 연결).'},
   {lv:'프로젝트', t:'주사위 공정성', d:'정다면체 주사위(d4~d20)가 공정한 이유와, 10면 주사위(정다면체 아님)는 어떻게 공정한지 조사하세요.'}
  ],
  eq:'꼭짓점 각의 합 < 360° — 그래서 5개뿐',
  what:'「왜 5개뿐인가」를 각의 합이라는 단 하나의 부등식으로 완결합니다 — 수학의 <b>불가능 증명</b>을 처음 맛보는 자리입니다.',
  probe:'정육각형을 모아 보세요 — 360° 가 되어 접히지 않고 평면 타일(LAB 37)이 되는 갈림길이 보입니다.',
  link:'다면체 단원. 타일 채우기(LAB 37)와 같은 부등식이 평면/입체의 운명을 가르는 것을 비교하게 하세요.'},

/* 69 일차부등식 */
 {tex:[
   {t:'1200n \\le 10000', s:'예산 조건을 부등식으로 — 등식이 아니라 「범위」가 답인 문제입니다.'},
   {t:'n \\le 8.33\\ldots \\Rightarrow n \\le 8', s:'해는 실수 범위지만 답은 자연수 — 문제 상황이 해집합을 다시 자릅니다.'},
   {t:'\\text{해집합} = \\{0,1,2,\\ldots,8\\}', s:'부등식의 답은 수 하나가 아니라 집합 — 수직선에 칠해지는 구간입니다.'}
  ],
  next:[
   {lv:'바로',   t:'배송비 추가', d:'배송비 3000원이 붙을 때 부등식이 어떻게 바뀌는지 세우고 다시 풀어 보세요.'},
   {lv:'심화',   t:'두 조건 동시에', d:'「8000원 이상 사면 할인」 조건을 추가해 연립부등식으로 확장해 보세요.'},
   {lv:'프로젝트', t:'우리 반 간식 예산', d:'실제 간식 가격으로 예산 부등식 문제를 만들어 최적 조합을 제안하는 보고서를 쓰세요.'}
  ],
  eq:'부등식의 해 = 조건을 만족하는 범위 전체',
  what:'방정식(한 점)과 부등식(구간)의 차이를 예산이라는 실감 나는 제약으로 체험합니다.',
  probe:'개수를 하나씩 늘리며 합계가 예산을 「넘는 순간」을 잡아 보세요 — 그 경계가 방정식, 그 앞까지가 부등식입니다.',
  link:'일차부등식 단원. 부등호 반전(LAB 74)과 일차함수의 그래프 영역(고교)으로 이어집니다.'},

/* 70 나머지와 해시 */
 {tex:[
   {t:'\\text{사물함 번호} = n \\;\\text{mod}\\; 10', s:'큰 수를 작은 범위로 접는 함수 — 나머지는 「순환하는 주소」입니다.'},
   {t:'n \\equiv m \\pmod{10} \\Leftrightarrow 10 \\mid (n-m)', s:'같은 사물함 = 차가 10 의 배수 — 합동식의 정의입니다.'},
   {t:'\\text{충돌: } 23 \\to 3, \\; 133 \\to 3', s:'서로 다른 입력이 같은 주소로 — 해시 충돌이며, 이를 다루는 것이 자료구조의 핵심 문제입니다.'}
  ],
  next:[
   {lv:'바로',   t:'요일 계산', d:'오늘부터 100일 뒤의 요일을 100 mod 7 로 구하고 달력으로 검산하세요.'},
   {lv:'심화',   t:'검산 숫자', d:'주민번호·바코드의 마지막 자리가 나머지 연산 검산인 것을 조사해 원리를 설명하세요.'},
   {lv:'프로젝트', t:'우리 반 해시 사물함', d:'출석번호·이름 글자수 등으로 해시 규칙을 설계하고 충돌을 최소로 하는 규칙을 경쟁해 보세요.'}
  ],
  eq:'mod = 큰 수를 작은 범위로 접는 함수',
  what:'나머지가 「나눗셈의 부산물」이 아니라 <b>주소를 배정하는 함수</b>임을 체험합니다 — 컴퓨터 과학의 해시가 바로 이것입니다.',
  probe:'10 씩 커지는 수들이 같은 사물함에 쌓이는 것을 보세요 — 수직선이 나선으로 감기는 그림입니다.',
  link:'약수와 배수 단원의 활용. 루hn 검증(LAB 14)·암호(LAB 25)의 mod 연산이 여기서 처음 등장합니다.'},

/* 71 순환소수와 부동소수점 */
 {tex:[
   {t:'\\frac{1}{8} = 0.125, \\quad \\frac{1}{7} = 0.142857142857\\ldots', s:'나머지가 0 이 되면 끝(유한), 같은 나머지가 재방문하면 순환 — 나머지의 운명이 소수의 운명입니다.'},
   {t:'\\text{분모의 소인수가 } 2, 5 \\text{ 뿐} \\Leftrightarrow \\text{유한소수}', s:'10 = 2×5 라서 — 분모를 10 의 거듭제곱으로 만들 수 있는지의 문제입니다.'},
   {t:'0.1_{(10)} = 0.000110011\\ldots_{(2)}', s:'십진수 0.1 이 이진수로는 순환소수 — 그래서 컴퓨터의 0.1+0.2 는 0.3 이 아닙니다.'}
  ],
  next:[
   {lv:'바로',   t:'예언 게임', d:'1/3, 3/40, 7/12 이 유한인지 순환인지 분모 소인수로 예언하고 나눠서 검증하세요.'},
   {lv:'심화',   t:'순환마디 길이', d:'1/7 의 마디가 6자리인 이유를 「나머지 후보가 6개뿐」으로 설명해 보세요.'},
   {lv:'프로젝트', t:'0.1+0.2 사건 보고서', d:'컴퓨터에서 0.1+0.2≠0.3 인 이유를 이진 순환소수로 설명하는 개발자용 보고서를 쓰세요.'}
  ],
  eq:'분모 소인수 2·5 뿐 ⇔ 유한소수',
  what:'유한/순환의 갈림이 우연이 아니라 <b>분모의 소인수</b>로 결정됨을 발견합니다. 같은 원리가 컴퓨터 오차의 정체까지 설명합니다.',
  probe:'나눗셈 과정의 나머지 목록을 지켜보세요 — 같은 나머지가 다시 나오는 순간이 순환의 시작입니다.',
  link:'유리수와 순환소수 단원. 순환마디 복원(LAB 72)·부동소수점 오차(정보)로 이어집니다.'},

/* 72 순환마디 복원 */
 {tex:[
   {t:'x = 0.242424\\ldots', s:'무한히 이어지는 수를 통째로 문자에 담습니다 — 무한을 다루는 대수의 기술.'},
   {t:'100x = 24.2424\\ldots \\;\\Rightarrow\\; 100x - x = 24', s:'마디 길이만큼 곱해 빼면 꼬리가 정확히 상쇄 — 무한이 유한으로 접힙니다.'},
   {t:'x = \\frac{24}{99} = \\frac{8}{33}', s:'99 분의 마디 — 마디가 k 자리면 분모는 9 가 k 개입니다.'}
  ],
  next:[
   {lv:'바로',   t:'0.9 순환의 정체', d:'같은 방법으로 0.999… 를 분수로 만들어 보세요 — 결과에 대한 자기 생각을 쓰세요.'},
   {lv:'심화',   t:'혼합 순환', d:'0.1666…(=1/6) 처럼 순환이 늦게 시작하는 수를 복원하는 절차를 만들어 보세요.'},
   {lv:'프로젝트', t:'분수 복원기 설계', d:'임의의 순환마디를 입력하면 분수를 돌려주는 계산 절차(알고리즘)를 순서도로 그리세요.'}
  ],
  eq:'10ᵏx − x 로 꼬리 상쇄 → 분모 99…9',
  what:'무한소수를 <b>대수 조작으로 잡는</b> 첫 경험입니다. 「같은 꼬리는 빼면 사라진다」가 무한급수(고교)의 씨앗입니다.',
  probe:'마디 길이를 바꿔 분모의 9 개수가 따라 변하는 것을 확인하세요 — 공식이 아니라 구조입니다.',
  link:'순환소수 단원 마무리. 등비급수 합(LAB 22)에서 같은 기술이 다시 나옵니다.'},

/* 73 지수법칙 */
 {tex:[
   {t:'0.1 \\times 2^{42} \\approx 4.4 \\times 10^{11} \\text{mm}', s:'42번 접으면 44만 km — 달까지의 거리를 넘습니다. 거듭제곱의 폭발력입니다.'},
   {t:'2^m \\times 2^n = 2^{m+n}', s:'접기를 이어 하면 지수는 더해집니다 — 곱이 덧셈으로 내려오는 사다리.'},
   {t:'(2^m)^n = 2^{mn}', s:'「접은 것을 다시 접기」 — 지수의 지수는 곱이 됩니다.'}
  ],
  next:[
   {lv:'바로',   t:'한계 도전', d:'실제 A4 를 몇 번까지 접을 수 있는지 실험하고, 이론(두께 공식)과 왜 다른지 쓰세요.'},
   {lv:'심화',   t:'지수 0 과 음수', d:'2⁰=1, 2⁻¹=½ 로 정해야 법칙이 유지됨을 「사다리 거꾸로 내려가기」로 설명하세요.'},
   {lv:'프로젝트', t:'전염 모형과 접기', d:'감염 확산(LAB 03)의 배가 성장이 종이 접기와 같은 구조임을 잇는 발표 자료를 만드세요.'}
  ],
  eq:'aᵐaⁿ = aᵐ⁺ⁿ — 곱을 덧셈으로',
  what:'지수법칙이 규칙 암기가 아니라 <b>「이어 하기」의 산수</b>임을 접기로 체험합니다. 로그(고교)의 예고편입니다.',
  probe:'10번 접기(1024배)와 20번 접기(104만 배)를 비교해 보세요 — 두 배의 반복은 직선이 아니라 폭발입니다.',
  link:'지수법칙 단원. 확산 시뮬(LAB 03)·복리(LAB 11)·로그 눈금(LAB 12)과 한 가족입니다.'},

/* 74 부등호의 반전 */
 {tex:[
   {t:'(-2)\\times: \\; 3 < 5 \\;\\Rightarrow\\; -6 > -10', s:'음수를 곱하면 수직선이 원점 기준으로 뒤집힙니다 — 컸던 쪽이 작아집니다.'},
   {t:'a < b, \\; c < 0 \\;\\Rightarrow\\; ac > bc', s:'반전의 일반 법칙 — 나눗셈도 마찬가지입니다.'},
   {t:'-3x < 6 \\;\\Rightarrow\\; x > -2', s:'양변을 −3 으로 나누는 순간 부등호가 뒤집힙니다 — 실수 1위 지점.'}
  ],
  next:[
   {lv:'바로',   t:'반례 제조기', d:'부등호를 안 뒤집고 풀면 틀리는 문제를 만들어 수직선으로 오류를 보이세요.'},
   {lv:'심화',   t:'문자 계수의 함정', d:'ax < b 를 풀 때 a 의 부호에 따라 답이 갈라지는 경우 나누기를 정리하세요.'},
   {lv:'프로젝트', t:'온도 환산 부등식', d:'화씨→섭씨 환산에서 「화씨 90도 이상」이 섭씨로 어떤 범위가 되는지 부등식 변형으로 구하세요.'}
  ],
  eq:'음수를 곱·나누면 부등호 반전',
  what:'반전이 「외울 규칙」이 아니라 <b>수직선 뒤집기라는 그림</b>임을 확인합니다. 등식에는 없는 부등식만의 사건입니다.',
  probe:'양수 곱은 간격만 늘리고 순서 유지, 음수 곱은 순서까지 뒤집기 — 두 동작을 화면에서 비교하세요.',
  link:'일차부등식 단원. 예산 부등식(LAB 69)의 풀이 기술이자, 함수의 증감(고교)으로 가는 감각입니다.'},

/* 75 연립방정식과 해의 개수 */
 {tex:[
   {t:'\\text{교점 1개} \\Leftrightarrow \\text{해 1개}', s:'두 직선이 한 점에서 만나면 연립방정식의 해도 하나 — 대수와 기하가 같은 말을 합니다.'},
   {t:'\\text{기울기 같고 절편 다름} \\Rightarrow \\text{해 없음}', s:'평행 — 식으로는 0 = (0 아닌 수) 라는 모순이 나옵니다.'},
   {t:'\\text{기울기·절편 모두 같음} \\Rightarrow \\text{해 무수히 많음}', s:'겹침 — 식으로는 0 = 0, 직선 위 모든 점이 해입니다.'}
  ],
  next:[
   {lv:'바로',   t:'세 경우 제조', d:'해가 1개·0개·무수히 많은 연립방정식을 각각 설계해 그래프로 검증하세요.'},
   {lv:'심화',   t:'계수의 비 판정', d:'a:a′, b:b′, c:c′ 의 비 비교만으로 세 경우를 판정하는 규칙을 만들어 보세요.'},
   {lv:'프로젝트', t:'요금제 삼파전', d:'세 직선(요금제 3개)의 교점 구조를 분석해 구간별 최적 요금제 지도를 만들어 보세요.'}
  ],
  eq:'해의 개수 = 두 직선의 위치 관계',
  what:'「해가 없다/무수히 많다」가 계산 실패가 아니라 <b>기하적 상황(평행/겹침)</b>임을 봅니다. 손익분기(LAB 04)의 일반화입니다.',
  probe:'기울기를 서서히 같게 맞출 때 교점이 화면 밖으로 달아나는 것을 추적하세요 — 평행은 „무한히 먼 교점“이라는 직관이 생깁니다.',
  link:'연립일차방정식 단원. 판별식(LAB 49)의 „풀기 전에 개수를 안다“와 같은 정신입니다.'},

/* 76 소거법 */
 {tex:[
   {t:'\\begin{cases} 2x+y=8 \\\\ x-y=1 \\end{cases} \\;\\Rightarrow\\; 3x=9', s:'두 식을 더해 y 를 소거 — 문자 하나가 사라지면 일차방정식입니다.'},
   {t:'\\text{계수 맞추기: } \\times 2, \\times 3 \\ldots', s:'소거하려는 문자의 계수 절댓값을 같게 — 최소공배수가 요령입니다.'},
   {t:'x=3 \\;\\to\\; y=2', s:'구한 값을 되넣어 나머지 문자를 회수 — 대입과 소거는 한 몸입니다.'}
  ],
  next:[
   {lv:'바로',   t:'가감 vs 대입', d:'같은 문제를 가감법·대입법 두 방법으로 풀어 각각 유리한 꼴을 정리하세요.'},
   {lv:'심화',   t:'미지수 3개', d:'x+y+z 꼴 삼원 연립을 소거 두 번으로 푸는 절차를 설계해 보세요.'},
   {lv:'프로젝트', t:'소거법 로봇', d:'연립방정식을 푸는 순서도(알고리즘)를 그려 짝이 그대로 따라 하면 풀리는지 검증하세요.'}
  ],
  eq:'더하거나 빼서 문자 하나를 지운다',
  what:'소거가 「테크닉」이 아니라 <b>미지수를 하나씩 줄이는 전략</b>임을 시뮬레이터로 체험합니다 — 행렬 소거(고교·대학)의 원형입니다.',
  probe:'계수를 안 맞추고 더해 보세요 — 아무것도 사라지지 않습니다. 「맞춘 뒤 빼기」의 필연성이 보입니다.',
  link:'연립방정식 풀이 차시. 해의 개수(LAB 75)와 짝을 이뤄 „푸는 법 + 해석“을 완성합니다.'},

/* 77 기울기와 절편 */
 {tex:[
   {t:'y = ax + b', s:'a 와 b — 직선을 조종하는 두 개의 손잡이입니다.'},
   {t:'b \\;\\text{변경} = \\text{평행이동}, \\quad a \\;\\text{변경} = \\text{회전}', s:'절편은 위아래 이동, 기울기는 (0,b) 를 축으로 도는 회전 — 서로 독립인 운동입니다.'},
   {t:'a = \\frac{\\Delta y}{\\Delta x}', s:'오른쪽 1칸당 오르는 양 — 기울기의 조작적 정의입니다.'}
  ],
  next:[
   {lv:'바로',   t:'직선 명중 게임', d:'짝이 부르는 y=ax+b 를 두 손잡이로 3초 안에 만드는 게임을 해 보세요.'},
   {lv:'심화',   t:'움직이지 않는 점', d:'기울기를 돌릴 때 (0,b) 만 안 움직이는 이유를 식으로 설명하세요.'},
   {lv:'프로젝트', t:'요금제 설계사', d:'기본료(절편)와 단가(기울기)를 조정해 경쟁사를 이기는 요금제 직선을 설계·발표하세요.'}
  ],
  eq:'b 는 평행이동 손잡이, a 는 회전 손잡이',
  what:'매개변수 두 개가 그래프에서 <b>독립된 운동</b>을 맡는 것을 분리 조작으로 체험합니다 — 함수 조작 감각의 핵심입니다.',
  probe:'잔상을 켜고 한 손잡이씩 움직여 보세요 — 회전 부채꼴과 평행 줄무늬, 두 운동이 다른 그림을 남깁니다.',
  link:'일차함수 그래프 단원. 이차함수 평행이동(LAB 51)·회귀직선의 계수(LAB 15)로 직결됩니다.'},

/* 78 식 ↔ 그래프 왕복 */
 {tex:[
   {t:'(0, b) \\;\\text{에 한 점}', s:'절편부터 — 직선이 y축과 만나는 곳에 첫 점을 놓습니다.'},
   {t:'(1, a+b) \\;\\text{에 두 번째 점}', s:'「오른쪽 1, 위로 a」 계단 — 두 점이면 직선은 유일하게 결정됩니다.'},
   {t:'\\text{그래프} \\to \\text{식: 절편 읽고 계단 재기}', s:'거꾸로 번역 — 왕복이 자유로워야 함수 단원 전체가 편해집니다.'}
  ],
  next:[
   {lv:'바로',   t:'거꾸로 왕복', d:'짝이 그린 직선을 보고 식을 3초에 읽어내는 연습을 하세요.'},
   {lv:'심화',   t:'못 그리는 직선', d:'x=3 같은 세로 직선이 y=ax+b 로 안 되는 이유를 쓰고 표기법을 조사하세요.'},
   {lv:'프로젝트', t:'그래프 스피드 퀴즈', d:'식→그래프·그래프→식 20문항 스피드 퀴즈를 만들어 반 대항전을 열어 보세요.'}
  ],
  eq:'절편 한 점 + 계단 한 점 = 직선 완성',
  what:'식과 그림 사이의 <b>번역 속도</b>를 몸에 붙입니다. 번역이 빨라야 교점·부등식 영역·변화율이 모두 쉬워집니다.',
  probe:'기울기가 분수(a=⅔)일 때 「오른쪽 3, 위로 2」로 읽는 것까지 연습하세요 — 계단의 일반화입니다.',
  link:'일차함수 단원. 기울기·절편 분리(LAB 77) 다음 차시로, 연립(LAB 75)의 교점 읽기로 이어집니다.'},

/* 79 삼각형의 무게중심 */
 {tex:[
   {t:'G = \\left(\\frac{x_1+x_2+x_3}{3}, \\; \\frac{y_1+y_2+y_3}{3}\\right)', s:'무게중심은 세 꼭짓점 좌표의 평균 — 「균형점 = 평균 위치」입니다.'},
   {t:'\\text{세 중선은 한 점에서 만난다}', s:'꼭짓점과 대변 중점을 이은 세 선이 반드시 공점 — 그 점이 G 입니다.'},
   {t:'AG : GM = 2 : 1', s:'무게중심은 중선을 꼭짓점 쪽 2, 중점 쪽 1 로 나눕니다 — 중점연결정리로 증명됩니다.'}
  ],
  next:[
   {lv:'바로',   t:'종이 삼각형 검증', d:'두꺼운 종이 삼각형을 잘라 무게중심에서 연필 끝으로 균형을 잡아 보세요.'},
   {lv:'심화',   t:'2:1 의 증명', d:'중점연결정리(닮음)를 이용해 AG:GM = 2:1 을 증명해 보세요.'},
   {lv:'프로젝트', t:'평균 = 균형', d:'자료의 평균(LAB 33)이 히스토그램의 균형점인 것과 무게중심이 같은 원리임을 잇는 발표를 만드세요.'}
  ],
  eq:'무게중심 = 좌표 평균 = 중선의 2:1 점',
  what:'물리적 직관(균형)과 계산(평균)이 <b>같은 점</b>을 가리키는 발견입니다. 통계의 평균과도 한 뿌리임을 잇습니다.',
  probe:'꼭짓점 하나를 끌 때 G 가 그 방향으로 ⅓ 만 따라가는 것을 관찰하세요 — 평균의 성질 그대로입니다.',
  link:'삼각형의 성질 단원. 닮음(중점연결)·통계의 평균·물리의 질량중심을 한 점에 모으는 차시입니다.'},

/* 80 평행사변형의 조건 */
 {tex:[
   {t:'\\text{두 쌍 평행} \\Leftrightarrow \\text{두 쌍 길이 같음} \\Leftrightarrow \\text{대각선 이등분}', s:'다섯 판정 조건은 모두 동치 — 하나가 서면 전부 섭니다.'},
   {t:'\\text{한 쌍만 평행} \\Rightarrow \\text{사다리꼴 (탈락 가능)}', s:'한 조건만으로는 부족한 경우가 있습니다 — 반례가 경계를 그어 줍니다.'},
   {t:'\\text{한 쌍이 평행하고 길이도 같음} \\Rightarrow \\text{평행사변형}', s:'단 두 정보로 충분한 경제적 판정 — 증명은 합동 두 번입니다.'}
  ],
  next:[
   {lv:'바로',   t:'반례 전시회', d:'「한 쌍 평행 + 다른 한 쌍 길이 같음」이 실패하는 사각형(등변사다리꼴)을 만들어 보세요.'},
   {lv:'심화',   t:'동치 증명 릴레이', d:'조건 ①→②→③→① 순환 증명을 분담해 완성하세요.'},
   {lv:'프로젝트', t:'접이식 구조물', d:'평행사변형 링크(접이식 빨래건조대 등)가 유지하는 성질을 조사해 모형으로 만들어 보세요.'}
  ],
  eq:'다섯 조건은 서로 동치 — 반례가 경계를 긋는다',
  what:'수학의 <b>동치(같은 사실의 다른 표현)</b>를 사각형으로 처음 만납니다. 판정 조건과 반례의 논리가 함께 옵니다.',
  probe:'다섯 판정이 늘 함께 켜지고 꺼지는지, 어긋나는 순간이 정말 없는지 꼭짓점을 끌며 시험해 보세요.',
  link:'사각형의 성질 단원. 명제·역·반례(고1 집합과 명제)의 논리 훈련장입니다.'},

/* 81 닮음과 축척 */
 {tex:[
   {t:'1 : 25000', s:'지도 1cm = 실제 250m — 축척은 닮음비의 실용 이름입니다.'},
   {t:'\\text{길이비 } k \\Rightarrow \\text{넓이비 } k^2', s:'2배 지도는 종이가 4배 — 길이·넓이의 차원이 다릅니다.'},
   {t:'\\text{닮음} \\Leftrightarrow \\text{대응각 같고 대응변 비 일정}', s:'모양은 같고 크기만 다른 것의 수학적 정의입니다.'}
  ],
  next:[
   {lv:'바로',   t:'학교까지 실거리', d:'지도 앱 축척으로 집~학교 직선거리를 계산하고 도보 거리와 비교하세요.'},
   {lv:'심화',   t:'축척 바꿔 그리기', d:'1:50000 지도를 1:25000 으로 다시 그릴 때 무엇이 몇 배가 되는지 정리하세요.'},
   {lv:'프로젝트', t:'교실 설계도', d:'교실을 실측해 1:50 설계도를 그리고, 가구 재배치안을 축척 위에서 제안하세요.'}
  ],
  eq:'축척 = 닮음비, 넓이는 그 제곱',
  what:'닮음이 교과서 도형이 아니라 <b>지도·설계도의 일상 기술</b>임을 체험합니다. 길이비와 넓이비의 구분이 핵심입니다.',
  probe:'축척을 두 배로 바꿀 때 거리 계산이 두 배, 종이 넓이는 네 배가 되는 것을 확인하세요.',
  link:'닮음 단원 도입. 닮음비와 넓이·부피비(LAB 87)·닮음의 중심(LAB 82)으로 이어집니다.'},

/* 82 닮음의 중심 */
 {tex:[
   {t:'P \\mapsto P_1, \\; OP_1 = k \\cdot OP', s:'중심 O 에서 뻗는 반직선 위에서 k 배 — 닮음 변환(호모테티)의 정의입니다.'},
   {t:'\\text{모든 대응점이 한 점을 지난다}', s:'대응점 연결선이 전부 O 로 모입니다 — 프로젝터 빛이 렌즈를 지나는 그림 그대로입니다.'},
   {t:'\\frac{\\text{화면 크기}}{\\text{거리}} = \\text{일정}', s:'프로젝터를 2배 멀리 놓으면 화면 길이 2배, 넓이 4배 — 닮음비의 실전입니다.'}
  ],
  next:[
   {lv:'바로',   t:'그림자 닮음', d:'손전등으로 물체 그림자를 만들며 거리와 그림자 크기의 비를 재 보세요.'},
   {lv:'심화',   t:'음수 배율', d:'k 가 음수면 어떤 변환이 되는지(점대칭 확대) 그림으로 탐구하세요.'},
   {lv:'프로젝트', t:'미니 빔프로젝터', d:'돋보기와 상자로 스마트폰 프로젝터를 만들고 배율을 닮음으로 계산·검증하세요.'}
  ],
  eq:'한 점에서 k 배로 뻗는 변환',
  what:'닮음을 「두 도형의 관계」에서 <b>「만드는 변환」</b>으로 격상합니다 — 카메라·프로젝터·그림자의 공통 원리입니다.',
  probe:'중심을 도형 안·밖·변 위로 옮기며 확대 결과가 어떻게 달라지는지 비교하세요.',
  link:'닮음의 위치 단원. 축척(LAB 81)과 원근법(LAB 30)을 잇는 다리입니다.'},

/* 83 피타고라스 정리 */
 {tex:[
   {t:'a^2 + b^2 = c^2', s:'직각삼각형 세 변의 영원한 약속 — 두 정사각형의 넓이가 빗변 정사각형에 정확히 담깁니다.'},
   {t:'55^2 = 48^2 + 27^2 \\;(?)', s:'55인치는 대각선 — 가로·세로는 화면비에 따라 피타고라스로 역산합니다.'},
   {t:'c = \\sqrt{a^2+b^2}', s:'거리 공식의 원형 — GPS(LAB 01)의 두 점 사이 거리가 바로 이 식입니다.'}
  ],
  next:[
   {lv:'바로',   t:'우리 집 TV 검증', d:'집 TV 의 가로·세로를 재서 대각선 인치를 계산하고 표기와 비교하세요.'},
   {lv:'심화',   t:'넓이 증명 재현', d:'네 개의 직각삼각형 배치로 (a+b)² 전개와 잇는 증명을 종이로 재현하세요.'},
   {lv:'프로젝트', t:'사다리 안전 규정', d:'사다리 각도 75° 안전 규정을 피타고라스와 삼각비로 분석해 안내문을 만드세요.'}
  ],
  eq:'a² + b² = c² — 넓이로 보는 약속',
  what:'정리를 「공식」이 아니라 <b>넓이의 보존</b>으로 봅니다. 인치 표기라는 일상 속에서 역산을 경험합니다.',
  probe:'화면비 16:9 와 4:3 에서 같은 55인치의 가로가 달라지는 것을 비교하세요 — 대각선 하나로는 모양이 안 정해집니다.',
  link:'피타고라스 단원 중심. 테오도루스 나선(LAB 46)·거리 공식(고교)·삼각비(LAB 54)의 토대입니다.'},

/* 84 피타고라스의 역 */
 {tex:[
   {t:'a^2 + b^2 = c^2 \\;\\Rightarrow\\; \\text{직각삼각형}', s:'역도 참 — 계산만으로 직각을 판정할 수 있습니다.'},
   {t:'a^2 + b^2 > c^2 \\;\\text{예각}, \\quad < c^2 \\;\\text{둔각}', s:'등호가 무너진 방향이 각의 종류를 알려 줍니다 — 판정이 삼분됩니다.'},
   {t:'(3,4,5) \\;\\text{매듭 로프}', s:'고대 이집트의 직각 만들기 — 12칸 매듭 로프가 이 정리의 역을 쓴 최초의 공학입니다.'}
  ],
  next:[
   {lv:'바로',   t:'로프 직각기 제작', d:'끈에 12개 매듭을 지어 (3,4,5) 직각기를 만들어 책상 모서리를 검사하세요.'},
   {lv:'심화',   t:'예각·둔각 경계 실험', d:'c 를 조금씩 늘리며 직각→둔각으로 넘어가는 경계를 수치로 잡으세요.'},
   {lv:'프로젝트', t:'공사장의 3-4-5', d:'건축 현장에서 직각을 잡는 3-4-5 법을 조사하고 오차 분석과 함께 보고서를 쓰세요.'}
  ],
  eq:'세 변만 알면 각을 잰 것과 같다',
  what:'정리의 <b>역</b>이 주는 힘 — 각도기 없이 계산으로 직각을 판정합니다. 명제와 역의 관계를 실전으로 배웁니다.',
  probe:'a²+b² 과 c² 의 대소가 바뀌는 순간 삼각형의 모양이 어떻게 변하는지 연속적으로 관찰하세요.',
  link:'피타고라스 단원의 완성. 명제의 역(고1)·삼각형의 결정조건(LAB 36)과 연결됩니다.'},

/* 85 피타고라스 수 */
 {tex:[
   {t:'(3,4,5), (5,12,13), (8,15,17), \\ldots', s:'세 변이 모두 자연수인 직각삼각형 — 무한히 많습니다.'},
   {t:'\\text{홀수 } n: \\; \\left(n, \\; \\frac{n^2-1}{2}, \\; \\frac{n^2+1}{2}\\right)', s:'홀수 하나로 원시 피타고라스 수를 찍어 내는 공식 — 7 이면 (7,24,25).'},
   {t:'(3,4,5) \\times k = (6,8,10), (9,12,15), \\ldots', s:'배수는 모두 통합니다 — 닮음이니까요. 서로소인 것만이 「원시」입니다.'}
  ],
  next:[
   {lv:'바로',   t:'다음 보물 예언', d:'n=9 로 (9,40,41) 을 예언하고 제곱 계산으로 검증하세요.'},
   {lv:'심화',   t:'짝수 시작 보물', d:'(8,15,17) 은 홀수 공식 밖입니다 — m²−n², 2mn, m²+n² 일반 공식을 조사하세요.'},
   {lv:'프로젝트', t:'페르마의 예고', d:'제곱을 세제곱으로 바꾸면 자연수 해가 없다는 페르마 마지막 정리 이야기를 조사해 발표하세요.'}
  ],
  eq:'자연수 세 쌍 — 공식이 무한히 찍어 낸다',
  what:'방정식의 <b>정수해 탐색(디오판토스 문제)</b>을 처음 만납니다. 찾기 → 규칙 → 공식 → 예언의 수학적 사이클을 완주합니다.',
  probe:'원시 세 쌍에서 홀수·짝수 구성이 늘 「홀홀짝」인지 관찰하세요 — 홀짝 논증의 입구입니다.',
  link:'피타고라스 단원의 심화. 정수론(경시·고교)으로 뻗는 첫 가지입니다.'},

/* 86 경우의 수 */
 {tex:[
   {t:'\\text{또는} \\Rightarrow +, \\quad \\text{그리고} \\Rightarrow \\times', s:'배반인 선택지는 더하고, 연달아 하는 선택은 곱합니다 — 말이 연산을 결정합니다.'},
   {t:'4 \\times 3 \\times 2 = 24', s:'상의 4·하의 3·신발 2 — 각 단계의 가지 수를 곱하는 나무 그림입니다.'},
   {t:'\\text{겹치면 빼라: } |A \\cup B| = |A| + |B| - |A \\cap B|', s:'「또는」인데 겹침이 있으면 더한 뒤 교집합을 한 번 빼야 합니다.'}
  ],
  next:[
   {lv:'바로',   t:'급식 메뉴 조합', d:'오늘 급식판으로 「밥 또는 면」「반찬 그리고 후식」 조합 수를 계산해 보세요.'},
   {lv:'심화',   t:'자리 배치 폭발', d:'우리 반 4명을 한 줄로 세우는 방법 수(4!)를 나무 그림으로 세고 팩토리얼을 도입하세요.'},
   {lv:'프로젝트', t:'비밀번호 재방문', d:'경우의 수 법칙으로 비밀번호 실험(LAB 08)의 가짓수 공식을 다시 유도해 보고서를 쓰세요.'}
  ],
  eq:'또는=덧셈 · 그리고=곱셈 · 겹침=빼기',
  what:'세지 않고 <b>세는 법</b> — 언어(또는/그리고)가 연산(+/×)으로 번역되는 규칙을 상황으로 익힙니다.',
  probe:'같은 문제를 나무 그림으로 다 세어 보고 곱셈과 일치하는지 검산하세요 — 법칙의 신뢰가 생깁니다.',
  link:'경우의 수 단원. 확률(LAB 88~91)·순열조합(고교)의 문법이 되는 차시입니다.'},

/* 87 닮음비와 넓이·부피비 */
 {tex:[
   {t:'\\text{길이 } k \\Rightarrow \\text{넓이 } k^2 \\Rightarrow \\text{부피 } k^3', s:'차원마다 지수가 하나씩 — 2배 모형은 4배 무겁지 않고 8배 무겁습니다.'},
   {t:'\\text{2배 거인의 다리 단면} = 4\\text{배}, \\; \\text{몸무게} = 8\\text{배}', s:'단면적(버티는 힘)은 4배인데 무게는 8배 — 거인이 실존할 수 없는 역학적 이유입니다.'},
   {t:'\\text{아기 코끼리 다리가 굵은 이유}', s:'생물의 형태가 닮음비의 지배를 받습니다 — 제곱-세제곱 법칙.'}
  ],
  next:[
   {lv:'바로',   t:'피규어 무게 예측', d:'1/7 스케일 피규어의 무게를 실물 추정치에서 계산하고 실측과 비교하세요.'},
   {lv:'심화',   t:'표면적과 체온', d:'작은 동물이 추위에 약한 이유를 겉넓이/부피 비로 설명해 보세요.'},
   {lv:'프로젝트', t:'괴수 영화 검증단', d:'영화 속 거대 괴수의 실현 가능성을 제곱-세제곱 법칙으로 검증하는 영상 리뷰를 만드세요.'}
  ],
  eq:'길이 k · 넓이 k² · 부피 k³',
  what:'닮음비의 지수 법칙이 <b>생물의 모양과 공학의 한계</b>까지 설명하는 것을 봅니다 — 수학이 세계를 제약하는 장면입니다.',
  probe:'2배·3배 모형에서 넓이·부피가 각각 몇 배인지 표로 확인하고 지수 패턴을 잡으세요.',
  link:'닮음 단원의 절정. 축척(LAB 81)·겉넓이와 부피(LAB 39)를 하나의 법칙으로 묶습니다.'},

/* 88 여사건 */
 {tex:[
   {t:'P(\\text{적어도 하나}) = 1 - P(\\text{하나도 없음})', s:'복잡한 「적어도」를 단순한 「하나도 없음」의 반대로 — 여사건의 지름길입니다.'},
   {t:'1 - \\left(\\frac{5}{6}\\right)^2 = \\frac{11}{36}', s:'주사위 두 번에 적어도 한 번 6 — 직접 세면 11가지, 여사건이면 한 줄입니다.'},
   {t:'P(A) + P(A^c) = 1', s:'사건과 여사건은 전체를 정확히 둘로 나눕니다 — 합이 1 인 것이 지름길의 근거입니다.'}
  ],
  next:[
   {lv:'바로',   t:'직접 세기 대결', d:'같은 문제를 직접 세기와 여사건 두 방법으로 풀어 계산량을 비교하세요.'},
   {lv:'심화',   t:'적어도 둘', d:'「적어도 두 번」은 여사건이 어떻게 되는지(0번 또는 1번의 반대) 설계해 보세요.'},
   {lv:'프로젝트', t:'생일 문제', d:'우리 반에 생일이 같은 쌍이 있을 확률을 여사건으로 계산하고 실제와 비교하세요.'}
  ],
  eq:'적어도 하나 = 1 − 하나도 없음',
  what:'정면 돌파 대신 <b>반대편으로 돌아가는 전략</b>을 배웁니다 — 계산 기술이 아니라 사고 전략입니다.',
  probe:'시행 횟수를 늘릴 때 「적어도 하나」의 확률이 1 에 다가가는 속도를 관찰하세요 — (5/6)ⁿ 의 소멸입니다.',
  link:'확률 단원. 뽑기 시뮬(LAB 09)의 「n번이면 나오겠지」 계산의 정체가 바로 이 식입니다.'},

/* 89 독립시행 */
 {tex:[
   {t:'P(\\text{앞} \\mid \\text{앞앞앞}) = \\frac{1}{2}', s:'동전은 기억이 없습니다 — 세 번 연속 앞이어도 다음은 여전히 반반입니다.'},
   {t:'P(A \\cap B) = P(A)P(B)', s:'독립의 정의 — 한 사건이 다른 사건의 확률을 바꾸지 않을 때 곱셈이 성립합니다.'},
   {t:'\\left(\\frac{1}{2}\\right)^{10} = \\frac{1}{1024}', s:'10연속 앞은 드물지만, 「이미 9연속이 나온 뒤의 한 번」은 그냥 ½ — 희귀함과 다음 확률은 다른 문제입니다.'}
  ],
  next:[
   {lv:'바로',   t:'직접 100번', d:'동전을 100번 던져 연속 기록 뒤의 결과를 표로 모아 「나올 때가 됐다」를 검증하세요.'},
   {lv:'심화',   t:'독립이 아닌 예', d:'뽑고 안 돌려놓기(비복원)가 왜 독립이 아닌지 확률 변화로 보이세요.'},
   {lv:'프로젝트', t:'도박사의 오류 캠페인', d:'복권·게임 속 도박사의 오류 사례를 모아 경고 포스터를 만드세요.'}
  ],
  eq:'독립 = 과거가 다음 확률을 못 바꾼다',
  what:'<b>도박사의 오류</b>를 정면으로 해부합니다. 「드물다」와 「다음에 나올 확률」을 구분하는 것이 확률 리터러시의 핵심입니다.',
  probe:'긴 연속 기록이 실제로 종종 나오는 것을 시뮬레이션으로 확인하세요 — 무작위는 생각보다 뭉칩니다.',
  link:'확률 단원. 큰 수의 법칙(LAB 09)과 짝을 이뤄 「장기 안정 · 단기 무기억」을 완성합니다.'},

/* 90 조건부확률 */
 {tex:[
   {t:'P(A \\mid B) = \\frac{P(A \\cap B)}{P(B)}', s:'분모가 전체가 아니라 <b>조건 B</b> — 조건이 붙는 순간 세계가 B 로 줄어듭니다.'},
   {t:'\\text{전체 중 비율} \\ne \\text{그 집단 중 비율}', s:'같은 자료도 분모가 다르면 다른 확률 — 뉴스 통계 오독의 대부분이 여기서 납니다.'},
   {t:'P(A \\mid B) \\ne P(B \\mid A)', s:'「양성일 때 병」과 「병일 때 양성」은 다른 확률 — 방향을 바꾸는 것이 베이즈(LAB 02)입니다.'}
  ],
  next:[
   {lv:'바로',   t:'표로 확인', d:'우리 반 「안경 ∧ 남녀」 이중 분류표를 만들어 조건부확률 네 가지를 모두 계산하세요.'},
   {lv:'심화',   t:'검사의 역설', d:'유병률 1% 질병의 90% 정확 검사에서 양성일 때 실제 병일 확률을 계산해 직관과 비교하세요.'},
   {lv:'프로젝트', t:'통계 기사 감별', d:'조건부확률을 혼동한 실제 기사를 찾아 바로잡는 팩트체크 카드를 만드세요.'}
  ],
  eq:'조건 = 새로운 전체(분모의 교체)',
  what:'조건이 붙는 순간 <b>분모가 바뀐다</b>는 한 가지 사실로 확률 오독의 대부분을 예방합니다.',
  probe:'조건을 걸었다 풀었다 하며 분모 집단의 크기가 변하는 것을 지켜보세요 — 식보다 그림이 먼저입니다.',
  link:'확률 단원의 마무리. 베이즈 스팸 필터(LAB 02)의 수학적 기초가 완성되는 자리입니다.'},

/* 91 확률의 덧셈 */
 {tex:[
   {t:'P(A \\cup B) = P(A) + P(B) - P(A \\cap B)', s:'겹침을 두 번 세지 않도록 한 번 빼기 — 덧셈정리의 전부입니다.'},
   {t:'\\text{배반이면 } P(A \\cup B) = P(A) + P(B)', s:'겹침이 없을 때만 그냥 덧셈이 무죄 — 「배반일 때만」 단서의 뜻입니다.'},
   {t:'P(A)+P(B) > 1 \\;\\text{사고}', s:'겹침을 안 빼면 확률이 1 을 넘는 사고가 납니다 — 그림에서 즉시 보이는 모순입니다.'}
  ],
  next:[
   {lv:'바로',   t:'트럼프 검산', d:'하트 또는 그림카드일 확률을 공식과 직접 세기 두 방법으로 구해 맞추세요.'},
   {lv:'심화',   t:'세 사건 포함배제', d:'세 원의 벤다이어그램으로 |A∪B∪C| 공식을 만들어 보세요.'},
   {lv:'프로젝트', t:'설문 겹침 분석', d:'우리 반 취미 설문(복수응답)의 겹침을 벤다이어그램으로 정리해 「합이 100% 를 넘는 이유」를 해설하세요.'}
  ],
  eq:'더하고, 겹친 만큼 한 번 빼라',
  what:'덧셈정리의 −P(A∩B) 가 규칙이 아니라 <b>이중 계산의 교정</b>임을 겹침 조작으로 확인합니다.',
  probe:'두 사건을 완전히 떼어 보세요 — 그 순간에만 덧셈이 무죄가 됩니다. 곱셈공식의 포함배제(LAB 53)와 같은 뼈대입니다.',
  link:'확률 단원 종장. 경우의 수 겹침(LAB 86)·집합의 포함배제(고1)와 하나의 원리로 묶입니다.'},

/* 92 조립제법 */
 {tex:[
   {t:'f(x) = (x-k)Q(x) + R', s:'나눗셈의 등식 — 몫 Q 와 나머지 R 이 조립제법 마지막 줄에 그대로 나타납니다.'},
   {t:'\\text{내리고} \\to \\times k \\to \\text{더하고}', s:'세 동작의 반복 — 세로셈 나눗셈에서 「곱해서 빼는」 일을 계수만으로 접은 것입니다.'},
   {t:'R = 0 \\;\\Leftrightarrow\\; (x-k) \\text{ 는 } f \\text{ 의 인수}', s:'나머지가 0 이 되는 k 를 찾는 일이 곧 인수분해 — 삼차식 풀이의 표준 출발점입니다.'}
  ],
  next:[
   {lv:'바로',   t:'사차식 도전', d:'x⁴ − 1 을 (x−1) 로 조립제법 두 번 연속 나눠 완전히 쪼개 보세요.'},
   {lv:'심화',   t:'호너의 방법', d:'f(k) 를 계산할 때 조립제법 절차가 곱셈 횟수를 몇 번에서 몇 번으로 줄이는지 세어 보세요 — 컴퓨터가 다항식을 계산하는 실제 방식입니다.'},
   {lv:'프로젝트', t:'조립제법 계산기', d:'계수 목록과 k 를 넣으면 몫·나머지를 돌려주는 계산 절차를 순서도로 설계하세요.'}
  ],
  eq:'내리고 · ×k · 더하고 — 마지막 칸이 R',
  what:'나눗셈이라는 무거운 연산이 <b>덧셈·곱셈의 반복으로 접히는</b> 것을 봅니다. 알고리즘이라는 말의 실감이 여기 있습니다.',
  probe:'마지막 칸(R)과 f(k) 를 나란히 놓아 보세요 — 늘 같습니다. 다음 실험(나머지정리)의 예고편입니다.',
  link:'다항식의 연산 단원. 나머지정리(LAB 93)·삼차방정식(LAB 96)의 도구가 되는 기본기입니다.'},

/* 93 나머지정리 */
 {tex:[
   {t:'f(x) = (x-a)Q(x) + R', s:'무엇으로 나누든 성립하는 나눗셈 등식 — R 은 상수입니다(나눗수가 일차니까).'},
   {t:'x = a \\;\\Rightarrow\\; f(a) = 0 \\cdot Q(a) + R = R', s:'대입 한 번에 Q 가 통째로 사라집니다 — 나머지를 나눗셈 없이 얻는 지름길.'},
   {t:'f(a) = 0 \\;\\Leftrightarrow\\; f(x) = (x-a)Q(x)', s:'인수정리 — 근 하나가 인수 하나. 세 근을 찾으면 삼차식이 완전히 분해됩니다.'}
  ],
  next:[
   {lv:'바로',   t:'후보는 어디서 오나', d:'정수 근 후보가 왜 상수항의 약수뿐인지 곱셈으로 설명하고, ±1, ±2, ±3, ±6 을 전수 검사해 보세요.'},
   {lv:'심화',   t:'중근의 감각', d:'f 와 f 의 도함수가 같은 근을 가질 때(중근) 그래프가 어떻게 보이는지 조사해 보세요.'},
   {lv:'프로젝트', t:'근 탐색기 설계', d:'후보 대입 → 인수 추출 → 몫 재검사의 반복으로 고차식을 분해하는 절차를 만들어 발표하세요.'}
  ],
  eq:'f(a) = R — 대입이 나눗셈을 대신한다',
  what:'「대입 한 번 = 나눗셈 한 번」이라는 교환이 성립하는 이유를 등식 하나로 봅니다. 정리가 노동을 줄이는 장면입니다.',
  probe:'a 를 근이 아닌 곳에 두고도 f(a) 와 나머지가 일치하는 것을 확인하세요 — 정리는 근에서만 사는 것이 아닙니다.',
  link:'항등식과 나머지정리 단원. 조립제법(LAB 92)과 한 쌍으로, 인수분해·고차방정식의 표준 루트입니다.'},

/* 94 복소평면 */
 {tex:[
   {t:'(a+bi) \\cdot i = -b + ai', s:'전개 한 줄 — 점 (a, b) 가 (−b, a) 로 갑니다. 정확히 원점 중심 +90° 회전입니다.'},
   {t:'i^2 = -1, \\; i^3 = -i, \\; i^4 = 1', s:'90° 를 두 번 = 180°(부호 반전), 네 번 = 제자리 — 거듭제곱의 주기 4 가 그림에서 당연해집니다.'},
   {t:'z \\bar{z} = a^2 + b^2', s:'켤레와의 곱은 언제나 실수 — 원점까지 거리의 제곱입니다. 복소수의 크기가 여기서 나옵니다.'}
  ],
  next:[
   {lv:'바로',   t:'i 의 2026 제곱', d:'2026 을 4 로 나눈 나머지로 i²⁰²⁶ 을 3초에 구하고, 회전 그림으로 설명하세요.'},
   {lv:'심화',   t:'1+i 를 곱하면', d:'×(1+i) 가 「45° 회전 + √2 배 확대」임을 몇 개의 점으로 실험해 보세요.'},
   {lv:'프로젝트', t:'회전하는 좌표', d:'게임에서 캐릭터를 회전시킬 때 복소수 곱(또는 회전행렬)이 쓰이는 사례를 조사해 미니 데모를 설계하세요.'}
  ],
  eq:'×i = +90° 회전 · 주기 4',
  what:'허수가 「없는 수」가 아니라 <b>평면을 도는 수</b>임을 발자국으로 확인합니다. 대수(전개)와 기하(회전)가 같은 말을 합니다.',
  probe:'z 를 실수축 위(b=0)에 놓고 ×i — 순허수가 됩니다. 실수와 허수가 서로의 90° 방향이라는 것이 좌표로 보입니다.',
  link:'복소수와 이차방정식 단원. 행렬 회전(LAB 100)·삼각함수의 회전(고2)과 만나는 삼거리입니다.'},

/* 95 근과 계수 */
 {tex:[
   {t:'x^2+bx+c = (x-p)(x-q)', s:'인수분해 꼴과 전개 꼴 — 같은 식의 두 얼굴입니다.'},
   {t:'p+q = -b, \\quad pq = c', s:'전개해 계수를 비교하면 근의 합·곱이 계수에 그대로 박혀 있습니다.'},
   {t:'\\text{합 } S, \\text{곱 } P \\;\\Rightarrow\\; t^2 - St + P = 0', s:'거꾸로 쓰기 — 합·곱만 알면 두 수는 이 방정식의 근입니다. 「수 맞히기」의 정체.'}
  ],
  next:[
   {lv:'바로',   t:'검산 두 배 빠르게', d:'근의 공식으로 푼 문제를 합·곱으로 검산하는 습관을 다섯 문제로 연습하세요.'},
   {lv:'심화',   t:'대칭식의 힘', d:'p²+q² 을 p+q 와 pq 만으로 나타내고, 근을 구하지 않고 값을 계산해 보세요.'},
   {lv:'프로젝트', t:'삼차의 비에타', d:'삼차방정식의 세 근의 합·곱 규칙(비에타 공식)을 조사해 이차와 비교하는 자료를 만드세요.'}
  ],
  eq:'합 = −b · 곱 = c — 계수는 근의 요약본',
  what:'방정식을 「풀기 전에 아는 것」이 얼마나 많은지 확인합니다. 구조(계수)가 답(근)의 정보를 들고 있다는 대수의 관점입니다.',
  probe:'D < 0 으로 실근이 사라져도 합·곱 표시는 그대로 남는 것을 보세요 — 복소근의 세계에서도 관계는 살아 있습니다.',
  link:'이차방정식 단원. 근의 공식(LAB 48)의 다음 차시이자, 대칭식·비에타(고2)의 입구입니다.'},

/* 96 삼차 실근 */
 {tex:[
   {t:'f(x) = x^3 - 3x + k', s:'산(극대) 하나와 골짜기(극소) 하나를 가진 가장 단순한 삼차 — k 가 전체를 위아래로 옮깁니다.'},
   {t:'f(-1) = k+2, \\quad f(1) = k-2', s:'산꼭대기와 골짜기 바닥의 높이 — 이 둘의 부호가 실근 수를 결정합니다.'},
   {t:'(k+2)(k-2) < 0 \\;\\Leftrightarrow\\; \\text{실근 3개}', s:'산은 위, 골짜기는 아래 — x축을 세 번 건널 수밖에 없습니다. 등호면 접함(중근 포함 2개).'}
  ],
  next:[
   {lv:'바로',   t:'경계값 확인', d:'k = 2 와 k = −2 에서 접점의 x 좌표를 인수분해로 구해 화면과 맞추세요.'},
   {lv:'심화',   t:'산이 없는 삼차', d:'x³ + 3x + k 처럼 극값이 없는 삼차는 실근이 몇 개인지 그래프 개형으로 판정하세요.'},
   {lv:'프로젝트', t:'실근 개수 지도', d:'x³ + px + q 의 (p, q) 평면에서 실근 3개 영역의 경계 곡선을 조사해 그려 보세요.'}
  ],
  eq:'극대 × 극소 < 0 ⇔ 실근 3개',
  what:'이차의 판별식 논리가 삼차에서는 <b>극값의 부호 싸움</b>으로 확장되는 것을 봅니다. 그래프 개형이 곧 판정 도구입니다.',
  probe:'접하는 순간(자석)에 두 근이 하나로 합쳐지는 것을 보세요 — 판별식 D = 0 과 완전히 같은 사건입니다.',
  link:'여러 가지 방정식 단원. 판별식(LAB 49)의 확장이고, 미분(고2)에서 극값을 계산으로 얻으며 완성됩니다.'},

/* 97 이차부등식 */
 {tex:[
   {t:'x^2+bx+c < 0 \\;\\Leftrightarrow\\; \\text{포물선이 } x\\text{축 아래}', s:'부등식 풀이 = 그래프의 지하 구간 읽기. 식과 그림의 완전한 동치입니다.'},
   {t:'D > 0: \\; \\alpha < x < \\beta \\;\\text{(사이)}', s:'근이 둘이면 「< 0」의 해는 두 근 사이 — 아래로 처진 구간입니다.'},
   {t:'D < 0: \\; \\text{해 없음 또는 모든 실수}', s:'축과 안 만나면 포물선은 늘 한쪽 — 부등호 방향이 전부/없음을 가릅니다.'}
  ],
  next:[
   {lv:'바로',   t:'경계 포함 연습', d:'≤ 로 바꾸면 해집합의 끝점이 어떻게 달라지는지(●와 ○) 세 문제로 정리하세요.'},
   {lv:'심화',   t:'항상 성립 조건', d:'모든 실수 x 에서 x² + bx + c > 0 이 되는 (b, c) 조건을 D 로 구하고 화면으로 확인하세요.'},
   {lv:'프로젝트', t:'안전 범위 설계', d:'이익·속도 등 실생활 조건을 이차부등식으로 모델링해 「허용 구간」을 구하는 문제를 만들어 보세요.'}
  ],
  eq:'해집합 = 포물선의 지하(또는 지상) 구간',
  what:'부등식이 방정식과 달리 <b>구간을 답으로</b> 갖는 이유를 그래프에서 봅니다. 네 가지 운명(사이·바깥·전부·없음)이 D 와 부등호로 정리됩니다.',
  probe:'D < 0 인 채 부등호만 뒤집어 보세요 — 해가 「없음」에서 「모든 실수」로 반전됩니다. 그래프는 그대로인데 질문이 바뀐 것입니다.',
  link:'이차방정식과 이차함수 단원. 판별식(LAB 49)·부등식 영역(LAB 98)을 잇는 다리입니다.'},

/* 98 선형계획 */
 {tex:[
   {t:'x+y \\le 6, \\;\\; x+2y \\le 8, \\;\\; x, y \\ge 0', s:'제약들의 교집합이 볼록한 다각형 영역을 만듭니다 — 가능한 계획 전부의 지도입니다.'},
   {t:'z = 3x + 2y', s:'목적함수 — 같은 z 의 점들은 한 직선(등이익선) 위에 있습니다. z 를 키우면 직선이 평행이동합니다.'},
   {t:'\\text{최댓값은 꼭짓점에서}', s:'직선 다발이 영역을 떠나는 마지막 순간은 반드시 모서리 — 후보가 꼭짓점 몇 개로 줄어드는 것이 선형계획법의 힘입니다.'}
  ],
  next:[
   {lv:'바로',   t:'제약 하나 추가', d:'y ≤ 3 을 추가하면 영역과 최적해가 어떻게 변하는지 그려서 확인하세요.'},
   {lv:'심화',   t:'평행한 특수 경우', d:'목적함수의 기울기가 어느 변과 평행하면 최적해가 「변 전체」가 됩니다 — 그 목적함수를 설계해 보세요.'},
   {lv:'프로젝트', t:'우리 반 매점 계획', d:'실제 가격·재료 한도로 이익 최대화 문제를 만들어 꼭짓점 계산과 그림으로 푸는 보고서를 쓰세요.'}
  ],
  eq:'제약 = 볼록 영역 · 최적 = 꼭짓점',
  what:'부등식 여러 개가 <b>결정의 지도</b>가 되고, 최적화가 「꼭짓점 몇 개 비교」로 끝나는 것을 체험합니다 — 산업 현장의 OR 이 이 원리 위에 있습니다.',
  probe:'목적함수를 바꿔 최적 꼭짓점이 점프하는 순간을 보세요 — 답은 연속적으로 이동하지 않고 모서리에서 모서리로 뜁니다.',
  link:'여러 가지 부등식 단원의 절정. 경사하강(LAB 16)과 비교하면 「볼록 문제는 왜 쉬운가」가 보입니다.'},

/* 99 순열·조합 */
 {tex:[
   {t:'{}_4P_2 = 4 \\times 3 = 12', s:'첫 자리 4 갈래, 둘째 자리 3 갈래 — 순서가 있는 뽑기는 곱의 법칙 그대로입니다.'},
   {t:'{}_4C_2 = \\frac{{}_4P_2}{2!} = 6', s:'짝 {가,나} 하나가 순열 두 줄(가나·나가)을 대표 — 겹친 배수 2! 로 나눕니다.'},
   {t:'\\frac{4!}{2! \\, 2!} = 6', s:'AABB — 구별 안 되는 A 끼리·B 끼리의 바꿔치기 수만큼 나누는 같은 원리입니다.'}
  ],
  next:[
   {lv:'바로',   t:'우리 반 실전', d:'반에서 회장·부회장 뽑기와 대표 2명 뽑기의 가짓수를 각각 계산하고 비의 값을 확인하세요.'},
   {lv:'심화',   t:'3명이면 몇 배?', d:'순서 있는 3명 나열과 없는 3명 뽑기의 비가 왜 3! 인지 목록의 묶음으로 설명하세요.'},
   {lv:'프로젝트', t:'MISSISSIPPI', d:'같은 글자가 많은 단어의 나열 수를 공식으로 구하고, 작은 단어로 목록 검증까지 하는 자료를 만드세요.'}
  ],
  eq:'조합 = 순열 ÷ (순서의 가짓수)',
  what:'순열과 조합이 별개 공식이 아니라 <b>나눗셈 하나로 이어진 한 가족</b>임을 목록으로 확인합니다. 나눗셈 = 중복 제거라는 관점이 핵심입니다.',
  probe:'목록에서 {가,나} 를 골라 그에 대응하는 순열 줄들을 형광펜으로 묶어 보세요 — 2! 이 눈에 보입니다.',
  link:'경우의 수 단원(중2 LAB 86)의 고1 완성형. 확률(조합적 확률)과 이항정리로 직결됩니다.'},

/* 100 행렬 변환 */
 {tex:[
   {t:'(x, y) \\mapsto x\\,(a, c) + y\\,(b, d)', s:'행렬의 열 (a,c)·(b,d) 는 기저가 가는 곳 — 모든 점은 두 목적지의 조합으로 따라갑니다.'},
   {t:'e_1 \\mapsto (0, 1), \\quad e_2 \\mapsto (-1, 0) \\;\\Rightarrow\\; 90^\\circ \\text{ 회전}', s:'e₁ 은 위로, e₂ 는 왼쪽으로 — 이 두 문장이 곧 회전 행렬 [0 −1; 1 0] 입니다.'},
   {t:'|ad - bc| = \\text{넓이 배율}', s:'행렬식 — 도형의 넓이가 몇 배가 되는지. 0 이면 납작하게 붕괴해 되돌릴 수 없습니다.'}
  ],
  next:[
   {lv:'바로',   t:'180°·반사 만들기', d:'180° 회전과 x축 반사 행렬을 예측해 쓰고 화면에서 만들어 검산하세요.'},
   {lv:'심화',   t:'왜 역행렬이 없나', d:'det = 0 인 변환이 정보를 잃는 이유를 「두 점이 한 점으로」의 예로 설명하세요.'},
   {lv:'프로젝트', t:'픽셀 변환기', d:'작은 픽셀 그림에 행렬을 적용하는 절차를 설계하고, 사진 앱의 회전·확대 메뉴와 대응시켜 보세요.'}
  ],
  eq:'열 = 기저의 목적지 · |det| = 넓이 배율',
  what:'행렬이 숫자표가 아니라 <b>평면을 움직이는 기계</b>임을 손으로 확인합니다. 컴퓨터 그래픽·AI 의 선형변환이 전부 이 그림입니다.',
  probe:'두 화살표를 한 직선 위에 겹쳐 보세요 — 도형이 선분으로 붕괴합니다. det = 0 의 뜻이 그림 하나로 끝납니다.',
  link:'행렬 단원(2022 개정 공통수학1 복귀). 복소수 회전(LAB 94)·합성곱 필터(LAB 19)와 이어집니다.'},

/* 101 행렬 곱 비가환 */
 {tex:[
   {t:'AB \\ne BA', s:'행렬 곱은 일반적으로 교환되지 않습니다 — 변환의 「적용 순서」가 곱의 순서이기 때문입니다.'},
   {t:'\\text{회전} \\circ \\text{가로늘림} \\ne \\text{가로늘림} \\circ \\text{회전}', s:'먼저 돌리고 늘리면 비스듬히 늘고, 먼저 늘리고 돌리면 뚱뚱한 채 돕니다 — 그림이 증명입니다.'},
   {t:'kI \\cdot A = A \\cdot kI', s:'균등 확대(스칼라 행렬)는 예외 — 방향을 가리지 않는 변환은 누구와도 순서를 바꿀 수 있습니다.'}
  ],
  next:[
   {lv:'바로',   t:'수로 확인', d:'두 변환의 행렬을 직접 곱해 AB 와 BA 를 계산하고 화면의 합성 행렬과 맞추세요.'},
   {lv:'심화',   t:'교환자 [A,B]', d:'AB − BA 를 계산해 「얼마나 안 바뀌는지」의 크기로 읽어 보세요 — 0 이면 교환 가능.'},
   {lv:'프로젝트', t:'순서의 세계', d:'로봇 팔 관절, 루빅스 큐브, 옷 입기 — 순서를 타는 합성의 예 셋을 모아 행렬 곱과 잇는 발표를 만드세요.'}
  ],
  eq:'곱의 순서 = 변환의 적용 순서',
  what:'교환법칙이 <b>당연하지 않은 세계</b>를 처음 만납니다. 수의 곱에서 오던 직관이 어디서 왜 깨지는지를 그림 두 장이 보여 줍니다.',
  probe:'양쪽에 같은 변환을 같은 순서로 넣으면 언제나 같은 것도 확인하세요 — 다른 것은 「순서」뿐임을 대조군이 증명합니다.',
  link:'행렬 단원의 마무리. 함수의 합성(공통수학2)·변환 파이프라인(그래픽스)의 문법입니다.'},

/* 102 카드 쌓기 */
 {tex:[
   {t:'\\text{위 } k \\text{장의 한 걸음} = \\frac{1}{2k}', s:'위 k장 묶음의 무게중심이 받침 끝에 딱 걸칠 때까지 — 그 최대 한 걸음이 1/(2k) 입니다.'},
   {t:'\\text{총 돌출} = \\frac{1}{2}\\left(1 + \\frac{1}{2} + \\frac{1}{3} + \\cdots + \\frac{1}{n}\\right)', s:'걸음들을 다 더하면 조화급수의 절반 — 4장이면 1.04 카드, 맨 위 카드가 통째로 밖에 뜹니다.'},
   {t:'1 + \\frac{1}{2} + \\frac{1}{3} + \\cdots = \\infty', s:'항은 0으로 가는데 합은 무한 — 카드만 충분하면 돌출은 얼마든지 커집니다. 다리 없이 강을 건너는 수학.'}
  ],
  next:[
   {lv:'바로',   t:'진짜 카드로 재현', d:'트럼프 카드 6장으로 화면의 배치를 실제 책상에서 재현하고, 이론과 실물의 오차 원인을 적으세요.'},
   {lv:'심화',   t:'2카드 돌출 설계', d:'돌출 2카드가 되려면 ½Hₙ ≥ 2, 즉 Hₙ ≥ 4 — 필요한 장수를 계산하고 왜 이렇게 급히 늘어나는지 로그와 이으세요.'},
   {lv:'프로젝트', t:'RME 보고서', d:'실험 설계 → 실패 → 규칙 발견 → 일반화의 전 과정을 원 수업(2019 RME)의 활동 보고서 양식으로 작성해 발표하세요.'}
  ],
  eq:'총 돌출 = ½(1+½+⅓+…+1/n) → ∞',
  what:'항이 0으로 가는 급수도 발산할 수 있다는 반직관을 <b>몸(카드)으로 겪는</b> 실험입니다. 무게중심·점화식·급수가 한 장면에 모입니다.',
  probe:'맨 위부터 밀어야 하는 이유를 확인하세요 — 아래 카드를 먼저 밀면 위 묶음의 무게중심이 즉시 받침을 벗어납니다. 순서가 곧 점화식입니다.',
  link:'급수 단원(LAB 22)의 실물 짝. 2019 RME 수업 모형의 활동 1~5 를 사다리 다섯 단계로 계승한 디지털 전환 사례입니다.'},

/* 103 RGB 색 좌표 */
 {tex:[
   {t:'4B_{(16)} = 4 \\times 16 + 11 = 75', s:'16진수 두 자리가 좌표 하나 — 진법이 색 코드라는 실생활 표기로 나타납니다.'},
   {t:'P = \\frac{3A + 1B}{4}', s:'빨강 A 와 파랑 B 를 1:3 으로 내분한 색 — 색 합성이 내분점 공식 그 자체입니다.'},
   {t:'\\text{무게중심} = \\frac{R+G+B}{3} \\;\\Rightarrow\\; R=G=B \\text{ (무채색)}', s:'세 원색의 무게중심에서 세 좌표가 같아집니다 — 회색이 삼각형 한가운데인 이유입니다.'}
  ],
  next:[
   {lv:'바로',   t:'우리 반 색 사전', d:'각자 좋아하는 색의 16진 코드를 모아 (R,G,B) 좌표로 환산한 「반 색 사전」을 만드세요.'},
   {lv:'심화',   t:'채도·명도의 좌표화', d:'RGB 최댓값·최솟값으로 명도·채도를 정의하는 식을 조사하고, 같은 채도의 색들이 좌표에서 어떤 모임을 이루는지 탐구하세요.'},
   {lv:'프로젝트', t:'LED 색 공간(원 수업 계승)', d:'2019 수업처럼 아두이노 LED 로 색을 구현하는 순서도를 짜고, 좌표→전류의 변환 규칙을 설계해 보세요.'}
  ],
  eq:'색 = 좌표 (R,G,B) · 합성 = 내분점',
  what:'진법·내분점·무게중심이라는 세 단원이 <b>그림판의 색 코드 하나</b>에서 만나는 융합 실험입니다. 수학이 미술·공학의 언어가 되는 장면입니다.',
  probe:'삼각형 위 점을 보며 슬라이더를 움직이세요 — 한 원색을 키우면 점이 그 꼭짓점으로 끌려갑니다. 가중 무게중심의 정의가 눈으로 보입니다.',
  link:'좌표와 내분점 단원의 응용. 2019 STEAM 색공간 수업(그림판·아두이노)의 디지털 전환이며, 픽셀·이미지(LAB 19)와 이어집니다.'},

/* 104 종이접기 등분 */
 {tex:[
   {t:'\\triangle AOP \\sim \\triangle BON \\;\\Rightarrow\\; \\overline{AP} : \\overline{PB} = 2 : 1', s:'접힌 두 선이 만든 <b>닮은 삼각형</b>의 대응변 비가 곧 내분점의 비입니다 — 3등분은 눈대중이 아니라 닮음의 결과입니다.'},
   {t:'P = \\frac{2A + 1B}{3}', s:'3등분 점을 내분점 공식으로 쓴 것. 접기가 만든 점이 좌표평면의 내분점과 같은 수임을 확인합니다.'},
   {t:'\\angle XOB = \\frac{1}{3}\\angle AOB', s:'Abe(1980)의 접기. 두 점을 각의 변과 평행선 위에 동시에 올려 접으면 합동인 세 직각삼각형이 생기고, 각이 정확히 3등분됩니다.'}
  ],
  next:[
   {lv:'바로',   t:'7등분에 도전', d:'같은 방법(대각선과 평행선)으로 7등분 점을 만들 수 있는지 접기 절차를 설계하고 닮음비로 검증하세요.'},
   {lv:'심화',   t:'작도 가능성의 경계', d:'자와 컴퍼스로 각 3등분이 불가능한 이유(3차방정식과 작도가능수)를 조사하고, 접기가 그 벽을 넘는 이유를 정리하세요.'},
   {lv:'프로젝트', t:'접는 구조물', d:'인공위성 태양전지판·에어백처럼 접기가 쓰인 공학 사례를 조사해 「미우라 접기」의 수학을 발표하세요.'}
  ],
  eq:'접기 = 대칭이동 · 닮음비 = 내분비',
  what:'접기 한 번은 <b>대칭이동</b> 한 번입니다. 접힌 선은 두 점을 겹치게 하는 수직이등분선이거나 각의 이등분선이므로, 접기의 결과는 언제나 <b>증명이 가능한 정확한 위치</b>입니다.',
  probe:'3등분 모드에서 교점 O 를 지나는 수직선을 접기 전에 「P 가 어디쯤일지」 예상해 보세요. 닮음비 2:1 을 먼저 계산하면 접기 전에 답을 알 수 있습니다.',
  link:'닮음(LAB 81)·무게중심(LAB 79)·합동(LAB 31)이 한 장의 색종이에서 만나는 융합 실험입니다. 원 수업: 「종이접기를 활용한 내분점·외분점」 활동지 3-1~3-3.'},

/* 105 주사위 100개 지수 감소 */
 {tex:[
   {t:'N(t) = 100 \\times \\left(\\frac{5}{6}\\right)^{t}', s:'한 해에 각 세대가 남을 확률이 5/6 이므로, 기대 세대 수는 매년 5/6 배 — <b>지수함수</b>가 실험에서 태어납니다.'},
   {t:'100\\left(\\frac{5}{6}\\right)^{x} \\le 10 \\;\\Leftrightarrow\\; x \\ge \\frac{\\log 10}{\\log 6 - \\log 5}', s:'「몇 년 뒤에 10세대 이하가 되나」는 지수를 내려오게 하는 <b>로그</b>로 풉니다.'},
   {t:'\\log 6 - \\log 5 = (\\log 2 + \\log 3) - (1 - \\log 2) \\approx 0.07', s:'log2=0.30, log3=0.47 로 바꾸면 x ≥ 1/0.07 ≈ 12.6 — 약 <b>13년째</b>에 10세대 이하가 됩니다.'}
  ],
  next:[
   {lv:'바로',   t:'반감기 구하기', d:'절반(50세대)이 되는 해를 로그로 구하고(≈3.8년), 실험에서 관측한 해와 비교하세요.'},
   {lv:'심화',   t:'표본 크기와 흔들림', d:'주사위를 1000개로 늘리면 실험값이 이론 곡선에 얼마나 더 붙을지 예상하고, 그 이유를 큰 수의 법칙으로 설명하세요.'},
   {lv:'프로젝트', t:'우리 반 붕괴 실험', d:'실제 주사위(또는 동전)로 모둠별 실험을 하고 9개 모둠 평균과 이론값을 비교하는 보고서를 만드세요(원 수업 계승).'}
  ],
  eq:'N(t) = N₀ rᵗ · x = log(N/N₀) ÷ log r',
  what:'지수함수를 <b>공식으로 배우지 않고 실험으로 만들어 내는</b> 실험실입니다. 주사위 100개는 확률 1/6 의 감소를 눈앞에서 반복 가능하게 만들고, 로그는 그 곡선에서 「언제」를 뽑아냅니다.',
  probe:'「다시」로 세 번 반복해 보세요. 같은 조건인데 곡선이 매번 다릅니다 — 이론은 평균이고, 실험은 그 둘레에서 흔들린다는 것이 눈에 남습니다.',
  link:'지수·로그 단원(LAB 3 확산·LAB 73 종이접기 두께)과 큰 수의 법칙(LAB 9·42)을 잇습니다. 원 수업: 2021 「지수함수와 로그함수」 교수학습과정안(주사위 100개).'},

/* 106 단위원 */
 {tex:[
   {t:'P(\\cos\\theta,\\ \\sin\\theta)', s:'단위원 위의 점의 <b>x 좌표가 cos, y 좌표가 sin</b> — 삼각비의 정의가 「길이의 비」에서 「좌표」로 넓어집니다.'},
   {t:'\\sin(180^\\circ-\\theta)=\\sin\\theta,\\quad \\cos(180^\\circ-\\theta)=-\\cos\\theta', s:'150°와 30°는 y 좌표가 같고 x 좌표만 부호가 반대 — 제2사분면에서 sin 만 살아남는 이유입니다.'},
   {t:'\\sin(\\theta+360^\\circ)=\\sin\\theta', s:'한 바퀴 돌면 같은 자리 — <b>주기 360°</b>가 그림에서 그대로 읽힙니다.'}
  ],
  next:[
   {lv:'바로',   t:'부호 지도 완성', d:'사분면 4칸에 (sin, cos, tan) 부호를 채운 지도를 만들고 축 위의 값(0°·90°·180°·270°)도 넣으세요.'},
   {lv:'심화',   t:'호도법으로 옮기기', d:'같은 실험을 라디안으로 다시 하고, 2π 가 왜 한 바퀴인지 호의 길이로 설명하세요.'},
   {lv:'프로젝트', t:'회전하는 좌표', d:'단위원 곱셈이 회전이라는 사실(LAB 94 복소수)과 이어, 게임 캐릭터 회전 코드를 설계해 보세요.'}
  ],
  eq:'sin θ = y, cos θ = x (단위원)',
  what:'직각삼각형이 감당하지 못하는 각을 <b>원 위의 좌표</b>로 넘겨받는 확장입니다. 정의를 넓혔더니 부호와 주기가 공짜로 따라옵니다.',
  probe:'150°에서 점 P 를 30°의 점과 나란히 보세요. 높이(y)는 같고 좌우(x)만 뒤집혔습니다 — 그것이 sin 150° = sin 30° 의 전부입니다.',
  link:'중3 삼각비(LAB 5)의 확장이며, 삼각함수 그래프(LAB 107)와 복소평면 회전(LAB 94)으로 이어집니다.'},

/* 107 일출 시각 */
 {tex:[
   {t:'y = D + A\\sin\\!\\left(\\frac{2\\pi}{12}(x-C)\\right)', s:'D 는 1년 평균, A 는 여름·겨울 차의 절반, C 는 곡선을 좌우로 미는 값 — 세 수가 각각 다른 일을 합니다.'},
   {t:'A=\\frac{\\text{최댓값}-\\text{최솟값}}{2},\\quad D=\\frac{\\text{최댓값}+\\text{최솟값}}{2}', s:'데이터에서 A·D 를 먼저 어림하면 위상 C 만 맞추면 됩니다 — 모형화의 순서입니다.'},
   {t:'\\text{RMSE}=\\sqrt{\\frac{1}{n}\\sum (y_i-\\hat y_i)^2}', s:'모형이 얼마나 맞는지를 <b>하나의 수</b>로 재는 장치. 7분(0.12시간) 아래면 실용적으로 충분합니다.'}
  ],
  next:[
   {lv:'바로',   t:'우리 지역 일출', d:'기상청 자료로 우리 지역 12개월 일출을 모아 같은 방식으로 A·D·C 를 맞춰 보세요.'},
   {lv:'심화',   t:'낮의 길이', d:'일몰 자료도 모아 「낮의 길이」 곡선을 만들고, 일출·일몰 두 곡선의 위상 차를 해석하세요.'},
   {lv:'프로젝트', t:'계절성 예측', d:'아이스크림 판매·전기 사용량처럼 계절성이 있는 자료를 찾아 삼각함수 모형으로 예측해 보세요.'}
  ],
  eq:'y = D + A sin(2π(x−C)/12)',
  what:'삼각함수를 <b>공식이 아니라 모형</b>으로 쓰는 실험입니다. 세 계수가 각각 무엇을 맡는지 손으로 맞춰 보면, 그래프의 진폭·주기·위상이 몸에 남습니다.',
  probe:'A 만 움직여 보세요 — 곡선의 높이만 변합니다. C 만 움직이면 모양은 그대로 좌우로 밀립니다. 계수마다 담당이 다릅니다.',
  link:'삼각함수의 그래프 단원. 회귀(LAB 15)와 같은 「데이터에 맞추기」이며, 단위원(LAB 106)에서 정의가 옵니다.'},

/* 108 사인·코사인법칙 */
 {tex:[
   {t:'\\frac{a}{\\sin A}=\\frac{b}{\\sin B}=\\frac{c}{\\sin C}', s:'한 변과 마주 보는 각의 짝은 삼각형 어디서나 같은 비 — 이것이 갈 수 없는 거리를 재는 열쇠입니다.'},
   {t:'b=\\frac{c\\sin B}{\\sin C},\\qquad C=180^\\circ-A-B', s:'기선 c 와 두 각만 알면 나머지가 모두 정해집니다(ASA). 측량의 기본 절차입니다.'},
   {t:'b^{2}=a^{2}+c^{2}-2ac\\cos B', s:'코사인법칙 — 두 변과 낀각으로 나머지 변을 구하는 다른 길. 사인법칙의 결과를 검산해 줍니다.'}
  ],
  next:[
   {lv:'바로',   t:'교실 측량', d:'운동장에서 기선을 정하고 각도기(또는 스마트폰 각도 앱)로 두 각을 재어 실제 거리를 계산해 보세요.'},
   {lv:'심화',   t:'오차의 전파', d:'각을 1° 잘못 재면 거리가 얼마나 달라지는지 실험하고, 기선을 길게 잡아야 하는 이유를 설명하세요.'},
   {lv:'프로젝트', t:'삼각측량 지도', d:'학교 주변 세 지점을 삼각측량으로 재어 간이 지도를 그리고 실제 지도와 비교하세요.'}
  ],
  eq:'a/sinA = b/sinB = c/sinC · b² = a²+c²−2ac cosB',
  what:'삼각형의 「정해짐(ASA)」을 <b>실제 길이</b>로 바꿔 주는 도구입니다. 강·계곡·건물처럼 자를 댈 수 없는 곳을 각으로 재는 방법이 됩니다.',
  probe:'두 각의 합을 180°에 가깝게 밀어 보세요. 삼각형이 납작해지며 거리가 폭발합니다 — 측량에서 각을 극단으로 잡으면 안 되는 이유입니다.',
  link:'중3 삼각비(LAB 5)의 일반화. GPS 삼변측량(LAB 1)과 같은 「거리를 각·길이로 결정하기」 계열입니다.'},

/* 109 대출과 등비수열 */
 {tex:[
   {t:'P(1+i)^{n}=m\\left[(1+i)^{n-1}+\\cdots+1\\right]', s:'대출 원금의 미래가치 = 매달 상환액들의 미래가치 합. 오른쪽 대괄호가 <b>등비수열의 합</b>입니다.'},
   {t:'m=\\frac{P\\,i(1+i)^{n}}{(1+i)^{n}-1}', s:'등비수열의 합 공식을 정리하면 월 상환액이 나옵니다 — 은행 앱의 한 줄이 여기서 옵니다.'},
   {t:'\\text{총이자}=mn-P', s:'같은 원금이라도 기간이 길수록 총이자는 커집니다. 월 부담과 총비용은 <b>맞바꾸는 관계</b>입니다.'}
  ],
  next:[
   {lv:'바로',   t:'중도 상환', d:'12개월째 목돈으로 일부를 갚으면 남은 상환액이 어떻게 변할지 계산해 보세요.'},
   {lv:'심화',   t:'원금균등 vs 원리금균등', d:'두 방식의 월 상환액·총이자를 비교하는 표를 만들고 장단점을 정리하세요.'},
   {lv:'프로젝트', t:'우리 집 통신비 할부', d:'실제 단말기 할부(무이자 여부 포함) 조건을 모아 총비용을 계산해 비교 보고서를 쓰세요.'}
  ],
  eq:'m = P·i(1+i)ⁿ / ((1+i)ⁿ − 1)',
  what:'등비수열의 합이 <b>금융 계산의 뼈대</b>임을 보이는 실험입니다. 공식을 외우는 대신, 현재가치로 되돌려 더하는 아이디어를 먼저 만듭니다.',
  probe:'초반 잔액 막대가 잘 안 줄어드는 것을 보세요. 갚은 돈의 상당 부분이 이자로 가기 때문입니다 — 상환 초기의 구조가 눈에 보입니다.',
  link:'등차·등비수열 단원. 복리(LAB 11)와 같은 뿌리이며, 지수·로그(LAB 105)와 이어집니다.'},

/* 110 시그마 */
 {tex:[
   {t:'\\sum_{k=1}^{n}k=\\frac{n(n+1)}{2}', s:'계단 두 개를 맞물리면 가로 n · 세로 (n+1) 직사각형 — 계단 하나는 그 절반입니다.'},
   {t:'(1+2+\\cdots+n)+(n+\\cdots+2+1)=n(n+1)', s:'가우스의 한 수. 위아래로 더하면 (n+1) 이 n 개 생깁니다.'},
   {t:'\\sum_{k=1}^{n}k^{2}=\\frac{n(n+1)(2n+1)}{6}', s:'제곱의 합은 계단을 세 겹 쌓아야 직육면체가 되어 6으로 나눕니다 — 차원이 하나 올라간 같은 아이디어입니다.'}
  ],
  next:[
   {lv:'바로',   t:'홀수의 합', d:'1+3+5+…+(2n−1) 의 합을 도형(정사각형)으로 만들어 공식을 스스로 유도하세요.'},
   {lv:'심화',   t:'세제곱의 합', d:'Σk³ = (Σk)² 를 n=1~5 에서 확인하고, 그 놀라운 관계를 도형으로 설명해 보세요.'},
   {lv:'프로젝트', t:'누적합과 데이터', d:'스프레드시트의 누적합(SUM 범위 확장)이 시그마와 같은 일임을 보이고, 학급 자료로 누적 그래프를 만드세요.'}
  ],
  eq:'Σk = n(n+1)/2',
  what:'공식을 <b>도형으로 만들어 내는</b> 실험입니다. 외운 식이 아니라 「두 계단을 붙였더니 직사각형」이라는 그림이 남습니다.',
  probe:'n 을 바꿔 가며 붙이기를 반복해 보세요. n 이 무엇이든 늘 (n+1) 높이의 직사각형이 됩니다 — 그 보편성이 공식의 근거입니다.',
  link:'수열의 합 단원. 누적합·데이터 집계로 이어지고, 귀납법(LAB 111)으로 엄밀히 증명됩니다.'},

/* 111 수학적 귀납법 */
 {tex:[
   {t:'P(1)\\ \\text{참}', s:'첫 도미노를 실제로 넘어뜨리는 단계. 이것이 없으면 사슬 전체가 시작되지 않습니다.'},
   {t:'P(k)\\Rightarrow P(k+1)\\quad(\\forall k)', s:'k 번째가 넘어지면 k+1 번째도 넘어진다 — <b>어떤 k 에 대해서도</b> 성립해야 합니다. 한 곳만 끊겨도 무너집니다.'},
   {t:'\\therefore\\ P(n)\\ \\text{는 모든 자연수 } n \\text{에서 참}', s:'유한한 두 문장으로 무한히 많은 경우를 덮는 논증 — 도미노가 그 구조를 그대로 보여 줍니다.'}
  ],
  next:[
   {lv:'바로',   t:'합 공식 증명', d:'1+2+…+n = n(n+1)/2 를 귀납법으로 증명하고, 두 단계가 각각 도미노의 무엇인지 표시하세요.'},
   {lv:'심화',   t:'가짜 증명 찾기', d:'「모든 말은 같은 색이다」류의 잘못된 귀납 증명을 찾아, 어느 도미노가 빠졌는지 지적하세요.'},
   {lv:'프로젝트', t:'알고리즘의 정당성', d:'재귀 알고리즘(예: 하노이 탑)이 항상 옳음을 귀납법으로 논증하는 보고서를 쓰세요.'}
  ],
  eq:'P(1) ∧ (P(k) ⟹ P(k+1)) ⟹ ∀n P(n)',
  what:'무한을 다루는 <b>증명의 구조</b>를 눈으로 보는 실험입니다. 두 조건 중 하나만 빠져도 결론이 무너지는 것을 도미노가 대신 말해 줍니다.',
  probe:'첫 도미노를 밀지 않은 채 간격만 좁혀 보세요. 조건 ②만으로는 아무 일도 일어나지 않습니다 — ①의 존재 이유입니다.',
  link:'수학적 귀납법 단원. 시그마 공식(LAB 110)의 엄밀한 증명이며, 재귀·알고리즘 정당성으로 이어집니다.'},

/* 112 지수방정식·부등식 */
 {tex:[
   {t:'a^{x}=k \\iff x=\\log_{a}k', s:'지수 자리에 갇힌 x 를 <b>로그</b>가 끌어내립니다 — 지수와 로그는 같은 사실의 두 표기입니다.'},
   {t:'x=\\frac{\\log k}{\\log a}', s:'상용로그로 바꾸면 계산기 하나로 어떤 밑이든 풀 수 있습니다.'},
   {t:'0<a<1 \\Rightarrow a^{x}>k \\iff x<\\log_{a}k', s:'밑이 1보다 작으면 감소함수라 <b>부등호가 뒤집힙니다</b> — 지수부등식에서 가장 자주 틀리는 곳입니다.'}
  ],
  next:[
   {lv:'바로',   t:'두 배 시점', d:'같은 방법으로 원금이 2배·5배 되는 해를 구하고 72의 법칙(LAB 11)과 비교하세요.'},
   {lv:'심화',   t:'밑이 다른 두 지수', d:'2^x = 3^(x−1) 처럼 밑이 다른 방정식을 양변 로그로 푸는 절차를 정리하세요.'},
   {lv:'프로젝트', t:'감가상각 계산기', d:'중고차 가격이 매년 15%씩 떨어질 때 반값이 되는 해를 구하는 계산기를 만드세요.'}
  ],
  eq:'a^x = k ⟺ x = log k / log a',
  what:'지수방정식은 <b>곡선과 가로선의 교점</b>입니다. 그림으로 보면 해가 하나뿐인 이유(단조성)와 부등식의 방향까지 한꺼번에 읽힙니다.',
  probe:'밑을 0.5 로 두고 부등식을 켜 보세요. 초록 영역이 오른쪽이 아니라 왼쪽에 생깁니다 — 뒤집힌 부등호가 눈에 보입니다.',
  link:'복리(LAB 11)·확산(LAB 3)에서 만든 지수 모형을 「언제?」로 되묻는 단원입니다.'},

/* 113 로그의 밑 변환 */
 {tex:[
   {t:'\\log_{a}b=\\frac{\\log b}{\\log a}', s:'같은 자(상용로그)로 두 번 재어 비를 취하면 원래 밑이 무엇이든 값이 나옵니다.'},
   {t:'a^{\\log_{a}b}=b', s:'구한 값을 지수로 되돌리면 진수가 그대로 돌아옵니다 — 검산의 근거입니다.'},
   {t:'\\log_{a}a=1,\\qquad \\log_{a}1=0', s:'자기 자신을 자기 자로 재면 1, 1을 재면 0 — 정의에서 곧바로 따라옵니다.'}
  ],
  next:[
   {lv:'바로',   t:'정보량 계산', d:'log₂ 를 이용해 「가능한 경우가 100가지일 때 몇 비트가 필요한가」를 계산하세요.'},
   {lv:'심화',   t:'밑을 e 로', d:'자연로그로 바꿔도 몫이 같은지 확인하고, 왜 밑을 무엇으로 잡아도 되는지 설명하세요.'},
   {lv:'프로젝트', t:'복잡도 표', d:'정렬 알고리즘의 n log n 을 밑에 따라 계산해 표로 비교하세요.'}
  ],
  eq:'log_a b = log b / log a',
  what:'밑 변환은 <b>단위 환산</b>과 같습니다. 어떤 자로 재든 두 길이의 비는 같다는 사실이 공식의 정체입니다.',
  probe:'밑을 2, 진수를 100 으로 두고 검산을 눌러 보세요. 2^6.644 가 정확히 100 으로 돌아옵니다.',
  link:'상용로그(LAB 115)·로그 스케일(LAB 12)과 이어지고, 정보량·알고리즘 복잡도로 확장됩니다.'},

/* 114 지수와 로그의 대칭 */
 {tex:[
   {t:'y=a^{x} \\iff x=\\log_{a}y', s:'같은 관계를 x 기준으로 쓰면 로그 — <b>역함수</b>의 정의 그대로입니다.'},
   {t:'(p,\\ a^{p}) \\leftrightarrow (a^{p},\\ p)', s:'대응점의 좌표를 맞바꾸면 상대 곡선 위의 점 — 두 그래프는 y = x 대칭입니다.'},
   {t:'a^{x}>0 \\Rightarrow \\log_{a}x \\text{ 의 정의역은 } x>0', s:'지수함수의 치역이 로그함수의 정의역 — 「로그에 음수를 못 넣는」 이유입니다.'}
  ],
  next:[
   {lv:'바로',   t:'정의역·치역 표', d:'밑을 바꿔 가며 두 함수의 정의역·치역을 표로 정리하세요.'},
   {lv:'심화',   t:'합성으로 확인', d:'log_a(a^x) = x 와 a^(log_a x) = x 를 대입으로 확인하고 역함수의 정의와 잇세요.'},
   {lv:'프로젝트', t:'인코딩·디코딩', d:'데이터 압축에서 로그 변환을 쓰는 사례를 조사해 발표하세요.'}
  ],
  eq:'y = aˣ ↔ y = log_a x (y = x 대칭)',
  what:'두 함수가 <b>같은 관계의 앞·뒤</b>임을 좌표로 확인하는 실험입니다. 역함수(LAB 21)의 지수·로그판입니다.',
  probe:'x 를 키우면 지수 쪽 점은 순식간에 화면 밖으로 나가지만 로그 쪽 점은 느릿느릿합니다 — 성장 속도의 대비가 한눈에 보입니다.',
  link:'역함수(LAB 21)의 사례이며, 지수·로그 단원 전체의 관문입니다.'},

/* 115 상용로그의 지표와 가수 */
 {tex:[
   {t:'10^{n}\\le N<10^{n+1} \\iff n\\le \\log N<n+1', s:'로그의 정수 부분(지표)이 곧 「10의 몇 제곱 자리인가」 — 자릿수는 지표 + 1 입니다.'},
   {t:'\\log(2^{100})=100\\log 2=30.10\\Rightarrow 31\\text{자리}', s:'계산기가 넘치는 수도 로그로는 자릿수를 정확히 셀 수 있습니다.'},
   {t:'10^{\\text{가수}} \\text{ 의 정수 부분} = \\text{최고 자리 숫자}', s:'가수만 있으면 맨 앞자리를 알 수 있습니다 — 벤포드 법칙의 뿌리입니다.'}
  ],
  next:[
   {lv:'바로',   t:'우리 반 큰 수', d:'2⁶⁴(체스판 쌀알)의 자릿수를 구하고 실제 쌀의 양으로 환산하세요.'},
   {lv:'심화',   t:'벤포드 법칙', d:'여러 거듭제곱의 최고 자리 숫자를 모아 1이 가장 흔한지 확인하고 이유를 조사하세요.'},
   {lv:'프로젝트', t:'데이터 규모 감각', d:'기가·테라·페타를 로그로 비교하는 인포그래픽을 만드세요.'}
  ],
  eq:'자릿수 = ⌊log N⌋ + 1',
  what:'로그를 <b>자릿수 세는 자</b>로 쓰는 실험입니다. 지수 폭발을 눈으로 보지 않고 수로 다루는 방법입니다.',
  probe:'지수를 100 에서 200 으로 올려 보세요. 자릿수는 31 → 61 — 정확히 두 배가 아닌 이유를 지표에서 찾을 수 있습니다.',
  link:'로그 스케일(LAB 12)·밑 변환(LAB 113)과 이어지고, 데이터 규모 감각으로 확장됩니다.'},

/* 116 지수함수의 변신 */
 {tex:[
   {t:'y=a^{x-p}+q', s:'괄호 안의 −p 는 <b>오른쪽으로 p</b>, 뒤의 +q 는 <b>위로 q</b> — 부호가 반대로 보이는 이유는 대입해 보면 알 수 있습니다.'},
   {t:'a>1 \\text{ 증가},\\quad 0<a<1 \\text{ 감소}', s:'밑 하나가 곡선의 방향을 결정합니다. a 와 1/a 의 그래프는 y축 대칭입니다.'},
   {t:'x\\to-\\infty \\Rightarrow a^{x-p}\\to 0,\\quad y\\to q', s:'점근선이 y = q 인 이유 — 세로 이동은 점근선을 통째로 들어 올립니다.'}
  ],
  next:[
   {lv:'바로',   t:'대칭 짝 찾기', d:'a = 2 와 a = 0.5 의 그래프를 겹쳐 y축 대칭임을 확인하세요.'},
   {lv:'심화',   t:'x절편이 생기는 조건', d:'q < 0 일 때 x절편을 식으로 구하고, q ≥ 0 이면 왜 없는지 설명하세요.'},
   {lv:'프로젝트', t:'감쇠 모형', d:'커피가 식는 곡선(뉴턴의 냉각)을 지수함수 + 상수로 모형화해 보세요.'}
  ],
  eq:'y = a^(x−p) + q · 점근선 y = q',
  what:'식의 각 자리가 그래프의 어느 동작을 맡는지 <b>분해해 보는</b> 실험입니다. 이동과 점근선을 따로 다루면 그래프는 외울 것이 없습니다.',
  probe:'q 만 움직여 보세요. 곡선의 모양은 그대로인 채 붉은 점선(점근선)이 함께 올라갑니다.',
  link:'지수·로그 단원의 그래프 파트. 함수의 평행이동(LAB 51)과 같은 문법입니다.'},

/* 117 주기·진폭·위상 */
 {tex:[
   {t:'y=d+a\\sin b(x-c)', s:'a 는 진폭, b 는 주기, c 는 위상, d 는 중심선 — <b>계수마다 담당이 다릅니다</b>.'},
   {t:'\\text{주기}=\\frac{2\\pi}{b}', s:'b 가 커질수록 물결이 촘촘해집니다. x 에 곱해진 수가 시간을 빠르게 돌립니다.'},
   {t:'\\text{최댓값}=d+a,\\quad \\text{최솟값}=d-a', s:'세로로는 중심선 d 를 기준으로 a 만큼 위아래 — 진폭의 정의 그대로입니다.'}
  ],
  next:[
   {lv:'바로',   t:'식 읽고 그리기', d:'y = 3 sin(2x) − 1 의 주기·최대·최소를 먼저 계산한 뒤 화면으로 검산하세요.'},
   {lv:'심화',   t:'cos 로 바꾸기', d:'같은 그래프를 cos 로 쓰면 위상이 얼마나 달라지는지 구하세요.'},
   {lv:'프로젝트', t:'생체 리듬 모형', d:'체온·수면 자료를 삼각함수로 모형화하고 계수의 뜻을 해석하세요.'}
  ],
  eq:'y = d + a sin b(x − c) · 주기 2π/b',
  what:'그래프를 외우지 않고 <b>계수의 담당을 나눠</b> 읽는 훈련입니다. 한 번에 하나씩 움직이는 것이 실험의 규율입니다.',
  probe:'b 만 2로 올려 보세요. 주기가 절반이 되지만 최댓값은 꿈쩍도 하지 않습니다 — 담당이 다르기 때문입니다.',
  link:'일출 모형(LAB 107)에서 맞춘 계수를 이번엔 하나씩 분해합니다. 파형 합성(LAB 20)과 이어집니다.'},

/* 118 삼각방정식 */
 {tex:[
   {t:'\\sin x=k\\ (|k|\\le 1)', s:'단위원에서 높이가 k 인 점은 보통 <b>두 곳</b> — 그래서 한 바퀴에 해가 둘입니다.'},
   {t:'x=\\alpha+2n\\pi \\ \\text{ 또는 } \\ x=\\pi-\\alpha+2n\\pi', s:'주기 함수라 한 바퀴 안의 해에 2nπ 를 더하면 <b>모든 해</b>가 됩니다.'},
   {t:'|k|>1 \\Rightarrow \\text{해 없음}', s:'sin 의 치역이 [−1, 1] 이기 때문입니다 — 방정식의 해가 없는 이유가 그림에 있습니다.'}
  ],
  next:[
   {lv:'바로',   t:'cos 방정식', d:'cos x = 0.5 의 해를 같은 방법으로 구하고 sin 과 어떻게 다른지 비교하세요.'},
   {lv:'심화',   t:'삼각부등식', d:'sin x > 0.5 의 해를 구간으로 나타내고 곡선에서 확인하세요.'},
   {lv:'프로젝트', t:'관람차 시각표', d:'주기 12분 관람차에서 높이가 특정 값이 되는 시각을 모두 구해 시각표로 만드세요.'}
  ],
  eq:'sin x = k ⟹ x = α + 2nπ 또는 π − α + 2nπ',
  what:'삼각방정식은 <b>주기 때문에 해가 무한히 많은</b> 방정식입니다. 단위원과 곡선을 나란히 보면 그 구조가 한눈에 들어옵니다.',
  probe:'k 를 1 에 가깝게 밀어 보세요. 두 해가 점점 가까워지다 k = 1 에서 하나로 겹칩니다 — 중근과 같은 장면입니다.',
  link:'단위원(LAB 106)의 정의를 방정식으로 확장합니다. 이차방정식의 해의 개수(LAB 49)와 같은 구조입니다.'},

/* 119 삼각함수의 합성 */
 {tex:[
   {t:'a\\sin x+b\\cos x=R\\sin(x+\\alpha)', s:'두 파동의 합은 <b>같은 주기의 사인 곡선</b> — 바뀌는 것은 크기와 위상뿐입니다.'},
   {t:'R=\\sqrt{a^{2}+b^{2}},\\quad \\tan\\alpha=\\frac{b}{a}', s:'(a, b) 를 좌표로 보면 R 은 원점까지의 거리, α 는 그 방향각입니다 — 피타고라스가 여기서 나옵니다.'},
   {t:'\\text{최댓값}=R,\\ \\text{최솟값}=-R', s:'합성하면 최대·최소를 즉시 알 수 있습니다 — 합성의 가장 큰 쓸모입니다.'}
  ],
  next:[
   {lv:'바로',   t:'최댓값 문제', d:'5 sin x + 12 cos x 의 최댓값을 계산으로 구하고 화면으로 검산하세요.'},
   {lv:'심화',   t:'위상의 의미', d:'a, b 의 부호를 바꿔 가며 α 가 어느 사분면으로 가는지 정리하세요.'},
   {lv:'프로젝트', t:'스피커 간섭', d:'두 스피커의 위상차가 소리 크기에 미치는 영향을 조사해 발표하세요.'}
  ],
  eq:'a sin x + b cos x = √(a²+b²) sin(x + α)',
  what:'두 파동을 하나로 <b>합치는</b> 기술입니다. 벡터의 합(피타고라스)과 같은 그림이 파동에서도 성립합니다.',
  probe:'a=3, b=4 로 두면 R = 5 — 3·4·5 직각삼각형이 파동에서 다시 나타납니다.',
  link:'파형 합성(LAB 20)·푸리에(LAB 121)와 이어지고, 벡터의 크기(피타고라스)와 뿌리가 같습니다.'},

/* 120 헤론의 공식 */
 {tex:[
   {t:'s=\\frac{a+b+c}{2}', s:'둘레의 절반을 s 로 두는 것이 공식의 출발점입니다.'},
   {t:'S=\\sqrt{s(s-a)(s-b)(s-c)}', s:'각을 하나도 쓰지 않고 <b>세 변만으로</b> 넓이가 나옵니다 — 측량에 곧바로 쓰입니다.'},
   {t:'S=\\tfrac{1}{2}ab\\sin C', s:'각을 쓰는 공식과 값이 같습니다. 코사인법칙으로 cos C 를 구해 대입하면 헤론이 유도됩니다.'}
  ],
  next:[
   {lv:'바로',   t:'같은 둘레, 다른 넓이', d:'둘레가 같은 세 삼각형의 넓이를 비교하고 가장 넓은 모양을 찾으세요.'},
   {lv:'심화',   t:'헤론 유도', d:'½ab sin C 에서 시작해 코사인법칙을 넣어 헤론의 공식을 손으로 유도하세요.'},
   {lv:'프로젝트', t:'운동장 측량', d:'삼각형으로 나눈 운동장 넓이를 줄자만으로 구하는 계획서를 만드세요.'}
  ],
  eq:'S = √(s(s−a)(s−b)(s−c))',
  what:'각을 재지 않아도 <b>길이만으로 넓이</b>가 정해진다는 사실 — SSS 합동의 직접적 결과입니다.',
  probe:'가장 긴 변을 키워 삼각부등식을 깨 보세요. 근호 안이 음수가 되며 「넓이가 없다」가 수식으로 나타납니다.',
  link:'사인·코사인법칙(LAB 108)·합동(LAB 31)과 이어지는 측량 계열입니다.'},

/* 121 푸리에의 직관 */
 {tex:[
   {t:'f(x)\\approx \\sum a_k\\sin(kx)', s:'어떤 주기 함수든 <b>사인들의 합</b>으로 근사할 수 있다 — 푸리에의 발상입니다.'},
   {t:'\\text{사각파}=\\frac{4}{\\pi}\\left(\\sin x+\\frac{\\sin 3x}{3}+\\frac{\\sin 5x}{5}+\\cdots\\right)', s:'홀수 배음을 1, 1/3, 1/5 … 비율로 더하면 각진 파형이 만들어집니다.'},
   {t:'\\text{스펙트럼}=(a_1,a_3,a_5,\\dots)', s:'막대 하나하나가 「그 주파수가 얼마나 들었는가」 — 음성 인식·압축이 읽는 지도입니다.'}
  ],
  next:[
   {lv:'바로',   t:'톱니파 만들기', d:'목표를 톱니파로 바꿔 필요한 배음 조합을 찾고 사각파와 비교하세요.'},
   {lv:'심화',   t:'깁스 현상', d:'배음을 아무리 더해도 모서리에서 남는 출렁임을 관찰하고 이름을 조사하세요.'},
   {lv:'프로젝트', t:'MP3 는 무엇을 버리나', d:'사람이 못 듣는 주파수를 버리는 압축 원리를 조사해 스펙트럼으로 설명하세요.'}
  ],
  eq:'f(x) ≈ Σ aₖ sin(kx) · 스펙트럼 = (a₁, a₃, a₅, …)',
  what:'복잡한 파형을 <b>단순한 파동의 합</b>으로 되돌리는 실험입니다. 합성(LAB 20)의 반대 방향 — 분해입니다.',
  probe:'7배음만 0으로 내려 보세요. 모서리가 눈에 띄게 둥글어집니다 — 고주파가 「각짐」을 담당한다는 증거입니다.',
  link:'파형 합성(LAB 20)·합성 공식(LAB 119)의 확장이며, 음성 인식·이미지 압축의 수학적 뿌리입니다.'},

/* 122 등차수열 */
 {tex:[
   {t:'a_n=a_1+(n-1)d', s:'첫 항에서 <b>공차 d 를 (n−1)번</b> 더한 것 — 등차수열의 일반항입니다.'},
   {t:'S_n=\\frac{n(a_1+a_n)}{2}', s:'첫 줄과 끝 줄의 <b>평균</b>에 줄 수를 곱한 값 — 사다리꼴 넓이와 같은 구조입니다.'},
   {t:'S_n=\\frac{n\\{2a_1+(n-1)d\\}}{2}', s:'끝 항을 모르면 일반항을 대입한 이 꼴을 씁니다.'}
  ],
  next:[
   {lv:'바로',   t:'우리 학교 강당', d:'실제 강당(또는 교실) 좌석을 세어 등차수열로 모형화하고 총 좌석을 계산하세요.'},
   {lv:'심화',   t:'부분합의 최대', d:'공차가 음수인 등차수열에서 합이 최대가 되는 항까지를 구하는 방법을 정리하세요.'},
   {lv:'프로젝트', t:'계단식 요금제', d:'전기 요금 누진 구간을 등차수열로 모형화해 사용량별 요금표를 만드세요.'}
  ],
  eq:'Sₙ = n(a₁ + aₙ)/2',
  what:'합의 공식을 <b>사다리꼴</b>로 보는 실험입니다. 뒤집어 겹치면 직사각형이 된다는 가우스의 아이디어가 좌석 배치에서 재현됩니다.',
  probe:'공차를 0 으로 내려 보세요. 사다리꼴이 직사각형이 되며 공식이 단순한 곱셈으로 무너집니다.',
  link:'시그마(LAB 110)의 일반화이며, 적금·대출(LAB 126·109)의 등비수열과 짝을 이룹니다.'},

/* 123 등차 vs 등비 */
 {tex:[
   {t:'\\text{등차: } a_n=a+dn,\\qquad \\text{등비: } a_n=a(1+r)^n', s:'더하기는 <b>직선</b>, 곱하기는 <b>지수</b> — 자라는 방식이 근본적으로 다릅니다.'},
   {t:'a(1+r)^n \\ge a+dn \\ \\text{ 인 최소 } n', s:'역전 시점은 이 부등식을 만족하는 첫 n 입니다. 로그로는 깔끔히 안 풀려 실험이 빛납니다.'},
   {t:'\\lim_{n\\to\\infty}\\frac{a(1+r)^n}{a+dn}=\\infty', s:'r 이 아무리 작아도 지수는 결국 직선을 압도합니다 — 「곱하기가 이긴다」의 근거입니다.'}
  ],
  next:[
   {lv:'바로',   t:'저축 방식 고르기', d:'2년·5년·10년 뒤를 각각 계산해 어느 방식이 유리한지 기간별로 판정하세요.'},
   {lv:'심화',   t:'역전 시점 어림', d:'로그를 이용해 역전 시점을 어림하는 식을 만들고 실험값과 비교하세요.'},
   {lv:'프로젝트', t:'구독료 인상 분석', d:'정액 인상과 정률 인상을 비교해 5년 총액이 어떻게 달라지는지 보고서로 쓰세요.'}
  ],
  eq:'a + dn (등차) vs a(1+r)ⁿ (등비)',
  what:'두 성장 방식을 <b>같은 화면에서 겨루게</b> 하는 실험입니다. 「처음의 앞섬」이 오래가지 않는다는 감각이 남습니다.',
  probe:'r 을 1% 까지 낮춰도 기간을 늘리면 반드시 역전됩니다 — 지수의 힘을 눈으로 확인하세요.',
  link:'복리(LAB 11)·확산(LAB 3)과 같은 뿌리이며, 등차(LAB 122)와 짝을 이룹니다.'},

/* 124 시그마와 누적합 */
 {tex:[
   {t:'S_n=\\sum_{k=1}^{n}a_k', s:'시그마는 <b>더하라는 명령</b>입니다. 누적선의 마지막 점이 곧 총합입니다.'},
   {t:'\\sum(a_k+b_k)=\\sum a_k+\\sum b_k,\\quad \\sum c\\,a_k=c\\sum a_k', s:'「먼저 더하나 나중에 더하나 같다」 — 집계의 기본 성질입니다.'},
   {t:'a_n=S_n-S_{n-1}', s:'누적합의 <b>증가량</b>이 그날의 값 — 미분과 적분의 관계와 같은 구조입니다.'}
  ],
  next:[
   {lv:'바로',   t:'우리 반 자료', d:'학급 봉사시간·독서량을 모아 누적 그래프를 만들고 기울기를 해석하세요.'},
   {lv:'심화',   t:'이동평균', d:'누적합으로 이동평균을 계산하는 방법을 만들고 자료의 추세를 읽으세요.'},
   {lv:'프로젝트', t:'대시보드 만들기', d:'스프레드시트로 일별 자료 → 누적 지표 대시보드를 만들어 발표하세요.'}
  ],
  eq:'Sₙ = Σaₖ · aₙ = Sₙ − Sₙ₋₁',
  what:'시그마를 <b>데이터 집계</b>로 만나는 실험입니다. 막대와 누적선을 나란히 두면 두 표현이 같은 사실의 앞뒤임이 보입니다.',
  probe:'막대를 하나만 크게 올려 보세요. 그 지점에서 누적선의 기울기가 급해집니다 — 값은 곧 기울기입니다.',
  link:'수열의 합(LAB 110·122)을 자료 처리로 잇고, 순간변화율(LAB 13)과 구조가 같습니다.'},

/* 125 점화식 */
 {tex:[
   {t:'a_{n+1}=a_n+d \\ \\text{(등차)},\\qquad a_{n+1}=ra_n \\ \\text{(등비)}', s:'점화식은 <b>「다음을 만드는 규칙」</b>입니다. 씨앗(첫 항)이 있어야 수열이 시작됩니다.'},
   {t:'a_{n+1}=a_n+a_{n-1}\\ (\\text{피보나치})', s:'앞의 <b>두 항</b>이 다음을 정합니다. 이웃 항의 비는 황금비 1.618… 로 다가갑니다.'},
   {t:'a_{n+1}=2a_n+1 \\Rightarrow (a_{n+1}+1)=2(a_n+1)', s:'양변에 1을 더하면 <b>등비</b>가 드러납니다 — 점화식을 푸는 전형적인 기술입니다.'}
  ],
  next:[
   {lv:'바로',   t:'하노이 탑', d:'원판 n개를 옮기는 최소 횟수 점화식 aₙ = 2aₙ₋₁ + 1 을 만들고 값을 계산하세요.'},
   {lv:'심화',   t:'일반항 구하기', d:'aₙ₊₁ = 2aₙ + 1 의 일반항을 구하고 점화식과 값이 같은지 검증하세요.'},
   {lv:'프로젝트', t:'재귀 코드', d:'피보나치를 재귀와 반복 두 방식으로 코딩해 계산 횟수를 비교하세요.'}
  ],
  eq:'aₙ₊₁ = f(aₙ) · 씨앗 + 규칙',
  what:'수열을 <b>만드는 규칙</b>으로 정의하는 방식입니다. 재귀 알고리즘·인구 모형이 모두 이 문법을 씁니다.',
  probe:'피보나치를 10항 이상 쌓고 이웃 항의 비를 보세요 — 1.618 에 스스로 다가갑니다.',
  link:'귀납법(LAB 111)으로 증명되고, 등차·등비(LAB 122·123)의 다른 표현입니다.'},

/* 126 적금 */
 {tex:[
   {t:'S=m\\left[(1+i)^{n-1}+(1+i)^{n-2}+\\cdots+1\\right]', s:'각 달의 돈이 받는 <b>이자 기간이 달라</b> 만기 가치가 제각각 — 그 합이 등비수열의 합입니다.'},
   {t:'S=m\\cdot\\frac{(1+i)^{n}-1}{i}', s:'등비수열의 합 공식을 적용한 만기 금액. 은행 앱의 숫자가 여기서 나옵니다.'},
   {t:'\\text{이자}=S-mn', s:'만기 금액에서 원금 합계를 빼면 이자 — 기간이 길수록 비중이 커집니다.'}
  ],
  next:[
   {lv:'바로',   t:'목표 금액 역산', d:'1년 뒤 300만원을 만들려면 매달 얼마를 넣어야 하는지 식을 뒤집어 구하세요.'},
   {lv:'심화',   t:'단리 적금과 비교', d:'단리 방식과 복리 방식의 만기 금액을 비교하는 표를 만드세요.'},
   {lv:'프로젝트', t:'금융 상품 비교', d:'실제 적금 상품 셋의 조건을 모아 만기 금액을 계산해 비교 보고서를 쓰세요.'}
  ],
  eq:'S = m((1+i)ⁿ − 1)/i',
  what:'적립식 저축이 <b>등비수열의 합</b>임을 막대 그림으로 보이는 실험입니다. 대출(LAB 109)과 정확히 짝을 이룹니다.',
  probe:'첫 달 막대가 가장 높습니다 — 시간이 곧 이자라는 사실이 높이 차이로 보입니다.',
  link:'대출 상환(LAB 109)·복리(LAB 11)와 한 묶음인 금융 계열입니다.'},

/* 127 좌극한·우극한 */
 {tex:[
   {t:'\\lim_{x\\to a^-}f(x)=L_1,\\qquad \\lim_{x\\to a^+}f(x)=L_2', s:'왼쪽에서 다가간 값과 오른쪽에서 다가간 값. <b>두 값이 따로</b> 존재할 수 있습니다.'},
   {t:'\\lim_{x\\to a}f(x)=L \\iff L_1=L_2=L', s:'극한이 있다는 말은 <b>좌·우가 같다</b>는 뜻입니다. 하나라도 다르면 극한은 없습니다.'},
   {t:'f \\text{ 가 } x=a \\text{ 에서 연속} \\iff \\lim_{x\\to a}f(x)=f(a)', s:'극한이 있고, 그 값이 <b>함숫값과 같아야</b> 연속입니다.'}
  ],
  next:[
   {lv:'바로',   t:'요금표 읽기', d:'실제 주차장·택배 요금표를 가져와 경계에서의 좌·우 값을 계산하세요.'},
   {lv:'심화',   t:'조각함수 설계', d:'좌극한과 우극한이 다르도록 조각함수를 직접 만들고 그래프로 확인하세요.'},
   {lv:'프로젝트', t:'임계값 정책', d:'등급 경계(성적·요금·세율)에서 생기는 불공평 사례를 조사해 개선안을 제안하세요.'}
  ],
  eq:'lim f = L ⟺ 좌극한 = 우극한',
  what:'극한을 <b>「다가가는 값」</b>으로 정의하는 실험입니다. 계단 요금표에서 두 값이 끝내 만나지 않는 장면이 핵심입니다.',
  probe:'h 를 아무리 줄여도 계단에서는 차이가 그대로 남습니다 — 이것이 극한이 없다는 증거입니다.',
  link:'불연속의 종류(LAB 129)와 0/0 꼴(LAB 128)로 이어집니다.'},

/* 128 0/0 꼴 */
 {tex:[
   {t:'\\lim_{x\\to 2}\\frac{x^2-4}{x-2}=\\lim_{x\\to 2}\\frac{(x-2)(x+2)}{x-2}=4', s:'분자를 인수분해해 <b>약분</b>하면 구멍 하나만 남고 값이 드러납니다.'},
   {t:'\\lim_{x\\to 0}\\frac{\\sqrt{x+4}-2}{x}=\\lim_{x\\to 0}\\frac{1}{\\sqrt{x+4}+2}=\\frac14', s:'켤레를 곱하는 <b>유리화</b>. 뿌리가 있는 0/0 꼴의 표준 처리입니다.'},
   {t:'\\frac{0}{0} \\text{ 은 부정형}', s:'같은 0/0 꼴이라도 극한은 0, 1, ∞ 무엇이든 될 수 있습니다 — <b>모양만으로는 정할 수 없습니다.</b>'}
  ],
  next:[
   {lv:'바로',   t:'표로 좁히기', d:'x = a ± 0.1, 0.01, 0.001 의 값을 표로 만들어 극한값을 추정하세요.'},
   {lv:'심화',   t:'부정형 만들기', d:'0/0 꼴이면서 극한이 0, 1, ∞ 가 되는 식을 각각 만드세요.'},
   {lv:'프로젝트', t:'0 나눗셈 처리', d:'코드에서 0 나눗셈을 만났을 때의 예외 처리 방식을 조사해 정리하세요.'}
  ],
  eq:'0/0 → 식을 고쳐야 값이 보인다',
  what:'대입이 통하지 않는 자리에서 <b>다가가기</b>로 값을 찾는 실험입니다. 인수분해와 유리화가 그 도구입니다.',
  probe:'x = a 만 비어 있고 나머지는 멀쩡합니다 — 구멍 하나가 대입을 막는 전부입니다.',
  link:'좌극한·우극한(LAB 127)의 다음 단계이며, 미분계수(LAB 13)가 바로 이 꼴입니다.'},

/* 129 불연속의 종류 */
 {tex:[
   {t:'\\text{연속} \\iff f(a)\\text{ 존재},\\ \\lim_{x\\to a}f(x)\\text{ 존재},\\ \\text{그리고 같다}', s:'세 조건이 모두 필요합니다. <b>어느 것이 깨졌는가</b>가 끊김의 종류입니다.'},
   {t:'\\lim_{x\\to a}f(x)=L \\ne f(a)\\ \\text{또는}\\ f(a)\\text{ 없음}', s:'극한은 있는데 값이 어긋난 경우 — <b>제거 가능한</b> 불연속입니다.'},
   {t:'\\lim_{x\\to a^-}f\\ne\\lim_{x\\to a^+}f \\quad\\text{또는}\\quad \\lim_{x\\to a}f=\\infty', s:'점프와 무한. 극한 자체가 없으므로 <b>어떤 값을 넣어도</b> 이을 수 없습니다.'}
  ],
  next:[
   {lv:'바로',   t:'분류 연습', d:'주어진 조각함수 다섯 개의 불연속 종류를 판정하세요.'},
   {lv:'심화',   t:'결측값 보정', d:'자료에 빠진 한 점을 극한값으로 채우는 것이 타당한 경우와 아닌 경우를 구분하세요.'},
   {lv:'프로젝트', t:'센서 데이터 정제', d:'실제 시계열 자료에서 끊김을 찾아 종류별로 처리 방침을 정하고 보고서를 쓰세요.'}
  ],
  eq:'끊김의 종류 = 깨진 조건의 이름',
  what:'끊김을 <b>고칠 수 있는 것과 없는 것</b>으로 가르는 실험입니다. 자료 정제의 판단 기준이 여기서 나옵니다.',
  probe:'구멍만 값 하나로 메워집니다 — 극한이 있어야 고칠 수 있다는 원칙이 그림으로 보입니다.',
  link:'좌극한·우극한(LAB 127)의 결론이며, 최대·최소 정리(LAB 131)의 전제가 됩니다.'},

/* 130 사잇값 정리 */
 {tex:[
   {t:'f\\text{ 가 }[a,b]\\text{ 에서 연속},\\ f(a)f(b)<0 \\Rightarrow \\exists c\\in(a,b),\\ f(c)=0', s:'부호가 다르면 <b>반드시</b> 0 을 지납니다. 값을 몰라도 존재는 압니다.'},
   {t:'[a,b]\\to\\left[a,\\frac{a+b}{2}\\right]\\text{ 또는 }\\left[\\frac{a+b}{2},b\\right]', s:'부호가 바뀌는 쪽을 남기는 <b>이분법</b>. 한 번에 폭이 절반이 됩니다.'},
   {t:'\\text{폭}=\\frac{b-a}{2^{n}}<10^{-k}', s:'n 번 자르면 폭이 2ⁿ 분의 1. <b>자릿수가 몇 번 만에</b> 확정되는지 계산할 수 있습니다.'}
  ],
  next:[
   {lv:'바로',   t:'다른 방정식', d:'x³ = x + 3 의 근이 있는 구간을 찾고 이분법으로 좁히세요.'},
   {lv:'심화',   t:'횟수 예측', d:'폭을 0.001 아래로 만들려면 몇 번 잘라야 하는지 먼저 계산하고 실험으로 확인하세요.'},
   {lv:'프로젝트', t:'이분 탐색 코딩', d:'이분법을 코드로 구현하고 반복 횟수와 오차를 그래프로 그리세요.'}
  ],
  eq:'f(a)f(b) < 0 ⇒ 근이 있다',
  what:'존재를 <b>부호만으로</b> 보장하는 실험입니다. 이분 탐색이라는 알고리즘의 수학적 근거이기도 합니다.',
  probe:'자를 때마다 확정되는 자릿수가 하나씩 늘어납니다 — 폭이 절반이 되는 것의 실질적 의미입니다.',
  link:'연속(LAB 129)이 전제이고, 최적화(LAB 135)의 근 찾기로 이어집니다.'},

/* 131 최대·최소 정리 */
 {tex:[
   {t:'f\\text{ 가 }[a,b]\\text{ 에서 연속} \\Rightarrow \\text{최댓값·최솟값이 존재}', s:'<b>닫힌구간 + 연속</b>. 두 조건이 함께여야 보장이 생깁니다.'},
   {t:'(0,4)\\text{ 에서 }f(x)=1+1.4x\\ \\text{는 상한 6.6 에 도달하지 못한다}', s:'위로 막혀 있는 것과 <b>가장 큰 값이 있는 것</b>은 다른 말입니다.'},
   {t:'\\text{최댓값 후보}=\\{\\text{극값점}\\}\\cup\\{a,b\\}', s:'그래서 최적화에서는 <b>끝점을 반드시</b> 함께 검사합니다.'}
  ],
  next:[
   {lv:'바로',   t:'네 조합 표', d:'닫힘·열림 × 연속·끊김 네 경우의 최댓값 존재 여부를 표로 정리하세요.'},
   {lv:'심화',   t:'반례 만들기', d:'닫힌구간인데 최댓값이 없는 함수를 만들고 어느 조건이 깨졌는지 설명하세요.'},
   {lv:'프로젝트', t:'제약 조건 설계', d:'실제 최적화 문제(포장·배차·예산)에서 정의역을 어떻게 닫아 주는지 조사해 발표하세요.'}
  ],
  eq:'닫힌구간 + 연속 ⇒ 최대·최소 존재',
  what:'최적화가 성립하기 위한 <b>전제</b>를 실험으로 확인합니다. 조건을 하나씩 빼 보며 보장이 사라지는 장면을 봅니다.',
  probe:'열린구간에서는 끝에 다가갈수록 값이 커지지만 그 값을 가질 수 없습니다 — 최댓값이 없다는 뜻입니다.',
  link:'연속(LAB 129)의 응용이며, 상자 부피 최적화(LAB 135)의 근거입니다.'},

/* 132 미분 불가능한 점 */
 {tex:[
   {t:'f\\,\\!\'(a)=\\lim_{h\\to 0}\\frac{f(a+h)-f(a)}{h}', s:'미분계수는 <b>평균변화율의 극한</b>입니다. 이 극한이 있어야 접선이 하나로 정해집니다.'},
   {t:'\\lim_{h\\to 0^-}\\frac{|h|}{h}=-1,\\qquad \\lim_{h\\to 0^+}\\frac{|h|}{h}=+1', s:'y = |x| 의 좌·우 미분계수. <b>두 값이 달라</b> 원점에서는 미분할 수 없습니다.'},
   {t:'\\text{미분 가능} \\Rightarrow \\text{연속},\\quad \\text{연속} \\nRightarrow \\text{미분 가능}', s:'한쪽 방향만 성립합니다 — |x| 가 <b>그 반례</b>입니다.'}
  ],
  next:[
   {lv:'바로',   t:'좌·우 미분계수', d:'y = |x − 1| 의 x = 1 에서 좌·우 미분계수를 각각 구하세요.'},
   {lv:'심화',   t:'꺾인 점 만들기', d:'연속이면서 두 곳에서 미분 불가능한 함수를 조각함수로 설계하세요.'},
   {lv:'프로젝트', t:'ReLU 와 학습', d:'신경망이 ReLU 의 꺾인 점에서 기울기를 어떻게 정하는지 조사해 정리하세요.'}
  ],
  eq:'좌 미분계수 = 우 미분계수 ⟺ 미분 가능',
  what:'접선이 <b>하나로 정해지는 조건</b>을 실험으로 확인합니다. AI 의 활성함수가 가진 꺾인 점과 곧장 이어집니다.',
  probe:'h 를 줄여도 |x| 의 두 값은 −1 과 +1 로 갈라진 채입니다 — 만나지 않는다는 것이 결론입니다.',
  link:'극한(LAB 127)의 응용이며, 순간속도(LAB 13)와 같은 정의식을 씁니다.'},

/* 133 접선과 법선 */
 {tex:[
   {t:'y-f(a)=f\\,\\!\'(a)(x-a)', s:'접선의 방정식. <b>지나는 점</b>과 <b>기울기</b> 하나면 직선이 정해집니다.'},
   {t:'m\\cdot m_{n}=-1 \\ \\Rightarrow\\ m_{n}=-\\frac{1}{m}', s:'법선의 기울기는 −1/m 입니다. <b>−m 이 아닙니다.</b>'},
   {t:'f(x)=ax^{2} \\Rightarrow f\\,\\!\'(x)=2ax', s:'접점을 옮기면 기울기가 x 에 비례해 변합니다 — x = 0 에서만 수평입니다.'}
  ],
  next:[
   {lv:'바로',   t:'접선 구하기', d:'y = x² 위의 (2, 4) 에서 접선과 법선의 방정식을 각각 구하세요.'},
   {lv:'심화',   t:'외부 점에서', d:'곡선 밖의 한 점에서 그은 접선을 구해 접점이 몇 개인지 판정하세요.'},
   {lv:'프로젝트', t:'법선과 조명', d:'3D 렌더링에서 표면 법선이 밝기를 정하는 원리를 조사해 발표하세요.'}
  ],
  eq:'접선 m = f′(a), 법선 = −1/m',
  what:'한 점에서의 <b>방향</b>을 두 직선으로 읽는 실험입니다. 수직 조건을 곱 −1 로 검증합니다.',
  probe:'접점이 원점을 지날 때만 접선이 수평이 됩니다 — 극값의 위치와 정확히 겹칩니다.',
  link:'도함수의 부호(LAB 134)와 최적화(LAB 135)의 출발점입니다.'},

/* 134 도함수의 부호 */
 {tex:[
   {t:'f\\,\\!\'(x)>0 \\Rightarrow \\text{증가},\\qquad f\\,\\!\'(x)<0 \\Rightarrow \\text{감소}', s:'도함수의 <b>부호</b>가 곧 오르내림입니다 — 값이 아니라 부호를 봅니다.'},
   {t:'f(x)=x^{3}+bx \\Rightarrow f\\,\\!\'(x)=3x^{2}+b', s:'b < 0 이면 f′ 이 두 번 0 을 지나 <b>극값이 두 개</b>, b ≥ 0 이면 계속 증가합니다.'},
   {t:'f\\,\\!\'(a)=0 \\ \\text{이고 부호가 바뀔 때만 극값}', s:'f′ = 0 은 <b>후보일 뿐</b>입니다. b = 0 이 바로 그 반례입니다.'}
  ],
  next:[
   {lv:'바로',   t:'증감표 만들기', d:'b = −3 일 때 증감표를 만들고 그래프의 개형을 그리세요.'},
   {lv:'심화',   t:'경계 찾기', d:'극값이 사라지는 b 의 경계를 판별식으로 구하고 실험과 대조하세요.'},
   {lv:'프로젝트', t:'추세 전환점', d:'실제 시계열 자료에서 증가·감소가 바뀌는 지점을 찾아 해석하세요.'}
  ],
  eq:'f′ 의 부호 = f 의 오르내림',
  what:'도함수를 <b>부호로 읽는</b> 실험입니다. 극값의 필요조건과 충분조건을 구분하는 것이 핵심입니다.',
  probe:'b 를 0 으로 올리는 순간 봉우리와 골짜기가 동시에 사라집니다 — 판별식이 0 이 되는 자리입니다.',
  link:'접선(LAB 133)의 다음 단계이며, 최적화(LAB 135)의 도구입니다.'},

/* 135 최적화 */
 {tex:[
   {t:'V(x)=x(W-2x)(H-2x),\\quad 0<x<\\tfrac{\\min(W,H)}{2}', s:'모형과 <b>정의역</b>을 함께 세우는 것이 최적화의 절반입니다.'},
   {t:'V\\,\\!\'(x)=12x^{2}-4(W+H)x+WH=0', s:'미분해 0 으로 두면 <b>이차방정식</b>. 두 근 중 정의역 안의 것이 답입니다.'},
   {t:'W=H=30 \\Rightarrow x=5,\\ V=2000\\,\\text{cm}^{3}', s:'정사각형 종이에서는 한 변의 <b>1/6</b> 이 최적입니다.'}
  ],
  next:[
   {lv:'바로',   t:'다른 종이', d:'40 × 20 종이에서 최적 x 와 최대 부피를 구하세요.'},
   {lv:'심화',   t:'비율의 규칙', d:'정사각형 종이에서 최적 x 가 늘 한 변의 1/6 임을 식으로 증명하세요.'},
   {lv:'프로젝트', t:'실제 포장 설계', d:'택배 상자 규격을 조사해 재료를 아끼는 설계를 제안하세요.'}
  ],
  eq:'V′(x) = 0 → 정의역 안의 근',
  what:'현실 문제를 <b>함수로 세우고 미분으로 푸는</b> 전 과정을 한 화면에서 밟습니다.',
  probe:'많이 자를수록 좋을 것 같지만 바닥이 사라져 부피가 0 이 됩니다 — 봉우리가 중간에 있습니다.',
  link:'최대·최소 정리(LAB 131)가 전제이고, 도함수의 부호(LAB 134)가 도구입니다.'},

/* 136 위치·속도·가속도 */
 {tex:[
   {t:'v(t)=s\\,\\!\'(t),\\qquad a(t)=v\\,\\!\'(t)=s\\,\\!\'\'(t)', s:'미분을 한 번 할 때마다 <b>한 층</b>씩 내려갑니다 — 위치, 속도, 가속도.'},
   {t:'v(t)=0 \\ \\text{인 순간} \\Rightarrow \\text{방향 전환 또는 정지}', s:'위치 그래프의 <b>봉우리</b>가 곧 속도 0 입니다.'},
   {t:'\\text{이동 거리}=\\int |v|\\,dt \\ne \\text{변위}=\\int v\\,dt', s:'부호를 살리면 변위, 크기만 쓰면 거리 — <b>왕복에서 갈립니다.</b>'}
  ],
  next:[
   {lv:'바로',   t:'그래프 읽기', d:'주어진 위치 그래프에서 속도가 0 인 시각을 모두 찾으세요.'},
   {lv:'심화',   t:'거리와 변위', d:'0 ≤ t ≤ 8 에서 이동 거리와 변위를 각각 구해 비교하세요.'},
   {lv:'프로젝트', t:'센서 자료 해석', d:'휴대폰 가속도 센서 자료를 받아 속도와 위치를 역으로 추정해 보세요.'}
  ],
  eq:'s → v → a (미분의 사슬)',
  what:'세 그래프를 <b>세로로 겹쳐</b> 기울기와 값의 관계를 눈으로 확인하는 실험입니다.',
  probe:'속도가 음수인 구간에서 위치 그래프가 실제로 내려갑니다 — 부호가 방향이라는 증거입니다.',
  link:'순간속도(LAB 13)의 확장이며, 정적분의 누적(LAB 139)과 짝을 이룹니다.'},

/* 137 구분구적법 */
 {tex:[
   {t:'\\sum_{i=1}^{n}f(x_i)\\Delta x,\\qquad \\Delta x=\\frac{b-a}{n}', s:'직사각형의 <b>높이 × 폭</b>을 모두 더한 값. 개수와 폭이 함께 움직입니다.'},
   {t:'\\int_a^b f(x)\\,dx=\\lim_{n\\to\\infty}\\sum_{i=1}^{n}f(x_i)\\Delta x', s:'정적분의 <b>정의</b>. 어디서 높이를 재든 같은 값으로 모일 때 이 값이 존재합니다.'},
   {t:'\\int_0^1 x^2dx=\\frac13', s:'Σk² = n(n+1)(2n+1)/6 을 쓰면 손으로도 이 값에 도달합니다.'}
  ],
  next:[
   {lv:'바로',   t:'세 방식 비교', d:'같은 n 에서 왼쪽·오른쪽·가운데 합의 오차를 표로 비교하세요.'},
   {lv:'심화',   t:'오차의 규칙', d:'오차가 n 에 어떻게 반비례하는지 실험값으로 추정해 식을 세우세요.'},
   {lv:'프로젝트', t:'수치 적분 코딩', d:'사다리꼴 공식과 심프슨 공식을 구현해 정확도를 비교하세요.'}
  ],
  eq:'∫ = lim Σ f(xᵢ)Δx',
  what:'적분을 <b>더하기의 극한</b>으로 정의하는 실험입니다. 개수만 늘리고 폭을 그대로 두는 흔한 오류를 눈으로 잡습니다.',
  probe:'가운데에서 재면 적은 개수로도 오차가 작습니다 — 위아래 오차가 서로 지워지기 때문입니다.',
  link:'기본정리(LAB 138)로 이어지고, 몬테카를로 넓이(LAB 18)와 대조됩니다.'},

/* 138 미적분의 기본정리 */
 {tex:[
   {t:'A(x)=\\int_0^x f(t)\\,dt', s:'넓이를 <b>x 의 함수</b>로 봅니다 — 이 한 걸음이 정리의 출발입니다.'},
   {t:'A(x+h)-A(x)\\approx f(x)\\,h \\ \\Rightarrow\\ \\frac{A(x+h)-A(x)}{h}\\approx f(x)', s:'늘어난 부분은 폭 h 인 <b>얇은 띠</b>. 높이가 곧 f(x) 입니다.'},
   {t:'A\\,\\!\'(x)=f(x)', s:'넓이를 미분하면 높이 — <b>미분과 적분이 서로 반대</b>임을 말하는 한 줄입니다.'}
  ],
  next:[
   {lv:'바로',   t:'세 함수 확인', d:'f(t) = 2, t, t² 에서 A(x) 를 각각 구하고 미분해 f 로 돌아오는지 보세요.'},
   {lv:'심화',   t:'아래끝 바꾸기', d:'아래끝을 0 이 아닌 1 로 바꾸면 A(x) 가 어떻게 달라지는지 확인하세요 (상수 차이).'},
   {lv:'프로젝트', t:'센서 적산', d:'유량 센서 값을 적분해 누적 사용량을 계산하는 과정을 설계하세요.'}
  ],
  eq:'A′(x) = f(x)',
  what:'미분과 적분이 <b>왜 서로 반대인지</b>를 넓이 함수의 기울기로 보이는 실험입니다.',
  probe:'높이가 일정하면 넓이는 직선, 높이가 자라면 넓이는 곡선 — 기울기가 늘 높이와 같습니다.',
  link:'구분구적법(LAB 137)의 결론이며, 정적분의 활용(LAB 139)의 근거입니다.'},

/* 139 정적분과 누적 */
 {tex:[
   {t:'\\text{변위}=\\int_a^b v(t)\\,dt', s:'부호를 <b>살린</b> 넓이. 되돌아온 만큼은 빼집니다 — 「지금 어디에 있나」의 답입니다.'},
   {t:'\\text{이동 거리}=\\int_a^b |v(t)|\\,dt', s:'크기만 더한 넓이 — 「얼마나 움직였나」의 답입니다.'},
   {t:'v(t)<0 \\text{ 인 구간이 생기면 두 값이 갈린다}', s:'속도의 <b>부호가 방향</b>이므로 왕복에서 두 값이 달라집니다.'}
  ],
  next:[
   {lv:'바로',   t:'두 값 계산', d:'v(t) = 4 − t 에서 0 ≤ t ≤ 6 의 변위와 이동 거리를 손으로 구하세요.'},
   {lv:'심화',   t:'갈리는 시각', d:'두 값이 갈라지기 시작하는 시각을 v 의 부호로 설명하세요.'},
   {lv:'프로젝트', t:'걸음 수 앱', d:'걸음 수·이동 거리·직선 거리를 실제 산책 자료로 비교해 보고서를 쓰세요.'}
  ],
  eq:'변위 = ∫v dt, 거리 = ∫|v| dt',
  what:'같은 그래프에서 <b>두 개의 다른 답</b>이 나오는 이유를 부호로 설명하는 실험입니다.',
  probe:'속도가 음수로 내려가는 순간부터 두 숫자가 벌어집니다 — 그 시각이 방향 전환점입니다.',
  link:'위치·속도·가속도(LAB 136)와 짝이며, 누적 지표 설계(LAB 124)와 통합니다.'},

/* 140 두 곡선 사이의 넓이 */
 {tex:[
   {t:'S=\\int_a^b \\{\\text{위}-\\text{아래}\\}\\,dx', s:'넓이는 늘 <b>위에서 아래를 뺀</b> 값입니다 — 순서가 뒤집히면 음수가 나옵니다.'},
   {t:'S=\\int_a^b |f(x)-g(x)|\\,dx', s:'절댓값을 살리려면 <b>교점에서 구간을 끊어야</b> 합니다.'},
   {t:'x^2=ax \\Rightarrow x=0,\\ x=a', s:'교점을 먼저 구하는 이유 — 여기서 위아래가 바뀝니다.'}
  ],
  next:[
   {lv:'바로',   t:'교점 구하기', d:'y = x² 와 y = 2x 의 교점을 구하고 그 사이 넓이를 계산하세요.'},
   {lv:'심화',   t:'교점 세 개', d:'교점이 셋인 두 곡선을 만들어 구간을 나누어 넓이를 구하세요.'},
   {lv:'프로젝트', t:'격차 시각화', d:'두 집단의 시계열 자료 사이 면적으로 격차를 시각화해 보고서를 쓰세요.'}
  ],
  eq:'S = ∫|위 − 아래| dx',
  what:'상쇄라는 <b>흔한 함정</b>을 화면에서 직접 겪고 교점 분할로 해결하는 실험입니다.',
  probe:'붉은 영역과 초록 영역이 함께 있으면 두 계산 값이 어긋납니다 — 그것이 상쇄의 신호입니다.',
  link:'정적분의 부호(LAB 139)의 다음 단계입니다.'},

/* 141 회전체의 부피 */
 {tex:[
   {t:'V=\\pi\\int_a^b \\{r(x)\\}^{2}dx', s:'얇은 <b>원판</b>의 부피 πr²Δx 를 모두 더한 것입니다.'},
   {t:'r(x)=x \\Rightarrow V=\\pi\\int_0^h x^2dx=\\frac{\\pi h^{3}}{3}', s:'원뿔의 부피 공식이 적분에서 그대로 나옵니다.'},
   {t:'\\left(\\sum r\\right)^{2}\\ne\\sum r^{2}', s:'<b>제곱을 먼저</b> 해야 합니다 — 더한 뒤 제곱하면 전혀 다른 값이 됩니다.'}
  ],
  next:[
   {lv:'바로',   t:'원기둥 확인', d:'r = 1 일 때 원판 합이 πh 가 되는지 확인하세요.'},
   {lv:'심화',   t:'구의 부피', d:'r(x) = √(R² − x²) 로 두고 적분해 4πR³/3 을 유도하세요.'},
   {lv:'프로젝트', t:'그릇 설계', d:'원하는 용량의 그릇 단면 곡선을 설계하고 3D 모델로 만들어 보세요.'}
  ],
  eq:'V = π∫r(x)² dx',
  what:'입체를 <b>얇게 잘라 더하는</b> 적분의 전형입니다. 넓이에서 부피로 한 차원 올라갑니다.',
  probe:'원판 개수를 늘리면 계단이 사라지고 매끄러운 그릇이 됩니다 — 극한의 그림입니다.',
  link:'구분구적법(LAB 137)의 확장이며, 그릇의 부피(LAB 24)와 같은 계열입니다.'}
];

/* ============ 10종 실험실 정의 ============ */

/* ---------- LAB 104 종이접기 등분 — 접기로 3등분·5등분·각 3등분 ----------
   원자료: 「종이접기를 활용한 내분점·외분점」 교안 (닮음비·피타고라스·무게중심).
   색종이를 실제로 접듯 단계 버튼을 누르면 접힌 선이 하나씩 늘고, 마지막에
   내분점의 비가 화면에서 확정된다. 자와 컴퍼스로 불가능한 각 3등분(Abe, 1980)까지. */
function origamiDemo(root){
  root.innerHTML=`<div class="row"><div class="col">
      <canvas id="og1" width="380" height="330"></canvas>
      <div class="note" style="margin-top:8px">색종이를 실제로 접듯 <b>「다음 접기」</b>를 눌러
      단계를 진행하세요. 접힌 선이 하나씩 쌓입니다.</div>
    </div>
    <div class="col">
      <label class="ctl">무엇을 접을까요
        <select id="ogM" style="width:100%;padding:7px 9px;border:1px solid #E5E7EB;border-radius:8px;font:inherit">
          <option value="t3">선분 3등분 (대각선 · 닮음비)</option>
          <option value="t5">선분 5등분 (두 대각선 · 닮음비)</option>
          <option value="a3">임의의 각 3등분 (Abe, 1980)</option>
        </select></label>
      ${slider('ogA','각 θ (각 3등분용)',30,80,1,60,'°')}
      <div class="ctl" style="display:flex;gap:6px;flex-wrap:wrap;margin-top:8px">
        <button class="b t" id="ogGo">다음 접기 ▶</button>
        <button class="b g sm" id="ogRs">펴기</button>
      </div>
      <div class="out" id="ogout"></div>
      <div class="note" style="margin-top:12px">눈대중으로 반의반을 접는 것이 아니라 <b>닮은 삼각형</b>과
      <b>합동</b>이 접힌 선의 자리를 정해 줍니다 — 그래서 「정확히」 3등분입니다.</div>
    </div></div>`;
  const cv=$('#og1'),ctx=cv.getContext('2d'),W=380,H=330;
  const SQ={x:40,y:40,s:250};                       // 색종이(정사각형)
  const S={ st:0 };
  const px=u=>SQ.x+u*SQ.s, py=v=>SQ.y+(1-v)*SQ.s;   // (0,0)=왼아래 ~ (1,1)=오른위
  const maxSt=()=>({t3:3,t5:3,a3:4})[$('#ogM').value];
  function line(a,b,col,dash){ ctx.strokeStyle=col; ctx.lineWidth=1.8;
    ctx.setLineDash(dash?[5,4]:[]); ctx.beginPath();
    ctx.moveTo(px(a[0]),py(a[1])); ctx.lineTo(px(b[0]),py(b[1])); ctx.stroke(); ctx.setLineDash([]); }
  function dot(p,col,lab){ ctx.fillStyle=col; ctx.beginPath(); ctx.arc(px(p[0]),py(p[1]),5,0,7); ctx.fill();
    if(lab){ ctx.fillStyle='#111827'; ctx.font='bold 11px sans-serif'; ctx.textAlign='center';
      ctx.fillText(lab, px(p[0]), py(p[1])-10); } }
  function draw(){
    const mode=$('#ogM').value, th=+$('#ogA').value;
    $('#ogAv').textContent=th+'°';
    ctx.clearRect(0,0,W,H); ctx.fillStyle='#fff'; ctx.fillRect(0,0,W,H);
    ctx.fillStyle='#FFF8EB'; ctx.strokeStyle='#B45309'; ctx.lineWidth=2;
    ctx.fillRect(SQ.x,SQ.y,SQ.s,SQ.s); ctx.strokeRect(SQ.x,SQ.y,SQ.s,SQ.s);
    ctx.fillStyle='#6B7280'; ctx.font='11px sans-serif'; ctx.textAlign='left';
    ctx.fillText('A', SQ.x-14, SQ.y+SQ.s+6); ctx.fillText('B', SQ.x+SQ.s+6, SQ.y+SQ.s+6);
    ctx.fillText('D', SQ.x-14, SQ.y-4);      ctx.fillText('C', SQ.x+SQ.s+6, SQ.y-4);
    let msg='', done=false;
    if(mode==='t3'){
      if(S.st>=1) line([0,0.5],[1,0.5],'#2563EB',true);            // 반 접기 MN
      if(S.st>=2){ line([0,0],[1,0.5],'#0E9384',false);            // A → N(오른쪽 중점)
                   line([0,1],[1,0],'#0E9384',false); }            // D → B
      if(S.st>=3){ const O=[2/3,1/3];                              // 두 선의 교점
        dot(O,'#BE123C','O'); line([O[0],0],[O[0],1],'#BE123C',true);
        dot([2/3,0],'#BE123C','P'); done=true; }
      msg = S.st===0 ? '① 「다음 접기」로 위아래를 반으로 접어 중점선을 만드세요.'
        : S.st===1 ? '② 이제 대각선 두 개(A→오른쪽 중점, D→B)를 접습니다.'
        : S.st===2 ? '③ 두 접힌 선의 교점 O 를 지나는 수직선을 접으세요.'
        : '';
      if(done) msg = '<b style="color:#0E9384">3등분 확정 — 밑변을 AP : PB = 2 : 1 로 나눕니다.</b> '
        + '<span class="mono">P = 2/3 = ' + (2/3).toFixed(4) + '</span>';
    } else if(mode==='t5'){
      if(S.st>=1){ line([0.5,0],[0.5,1],'#2563EB',true); line([0,0.5],[1,0.5],'#2563EB',true); }
      if(S.st>=2){ line([0,0],[0.5,1],'#0E9384',false); line([1,0],[0,1],'#0E9384',false); }
      if(S.st>=3){ const O=[1/3,2/3];                              // y=2x 와 y=1-x 의 교점
        dot(O,'#BE123C','O'); line([O[0],0],[O[0],1],'#BE123C',true);
        dot([1/3,0],'#BE123C','P');
        // 1/3 지점을 다시 반으로 → 1/6? 5등분은 아래 판정식으로 안내
        msg='<b style="color:#0E9384">5등분 확정 — 두 대각선의 교점이 밑변을 1 : 4 로 나눕니다.</b> '
          + '<span class="mono">P = 1/5 = 0.2000</span> (닮음비 1 : 4)';
        done=true; }
      if(!done) msg = S.st===0 ? '① 가로·세로 중점선을 접으세요.'
        : S.st===1 ? '② 대각선 두 개(A→위쪽 중점, B→D)를 접습니다.'
        : '③ 두 선의 교점에서 수직선을 접으세요 — 어떤 비가 나올까요?';
      if(done){ dot([0.2,0],'#7C3AED','1/5'); }
    } else {
      const r=th*Math.PI/180;
      line([0,0],[Math.cos(r),Math.sin(r)],'#111827',false);        // 각의 두 변
      line([0,0],[1,0],'#111827',false);
      if(S.st>=1){ line([0,0.25],[1,0.25],'#2563EB',true); }        // 평행선 ①
      if(S.st>=2){ line([0,0.5],[1,0.5],'#2563EB',true); }          // 평행선 ②
      if(S.st>=3){ ctx.strokeStyle='#B45309'; ctx.setLineDash([4,3]); ctx.lineWidth=1.6;
        ctx.beginPath(); ctx.moveTo(px(0),py(0.5)); ctx.lineTo(px(0.62*Math.cos(r)),py(0.62*Math.sin(r)));
        ctx.stroke(); ctx.setLineDash([]); }
      if(S.st>=4){ [1,2].forEach(k=>{ const a=r*k/3;
          ctx.strokeStyle='#BE123C'; ctx.lineWidth=2;
          ctx.beginPath(); ctx.moveTo(px(0),py(0)); ctx.lineTo(px(0.95*Math.cos(a)),py(0.95*Math.sin(a))); ctx.stroke(); });
        done=true; }
      msg = S.st===0 ? '① 아래에서 1/4 높이의 평행선을 접으세요.'
        : S.st===1 ? '② 그 두 배 높이(1/2)의 평행선을 한 번 더.'
        : S.st===2 ? '③ 두 점이 각의 변과 평행선 위에 동시에 오도록 접어 올리세요(Abe의 접기).'
        : S.st===3 ? '④ 펼쳐서 접힌 자국을 연장하면?'
        : '';
      if(done) msg = '<b style="color:#0E9384">각 3등분 완성 — 자와 컴퍼스로는 불가능한 작도를 접기로 해냈습니다.</b> '
        + '<span class="mono">' + th + '° ÷ 3 = ' + (th/3).toFixed(2) + '°</span>';
    }
    $('#ogout').innerHTML =
      '접기 단계 <b>' + S.st + ' / ' + maxSt() + '</b><br>' + msg
      + '<br><span style="color:#6B7280;font-size:12.5px">닮은 삼각형의 대응변 비가 곧 내분점의 비입니다 — 눈대중이 아니라 증명입니다.</span>';
  }
  $('#ogGo').onclick=()=>{ if(S.st<maxSt()){ S.st++; draw(); } };
  $('#ogRs').onclick=()=>{ S.st=0; draw(); };
  $('#ogM').onchange=()=>{ S.st=0; draw(); };
  $('#ogA').oninput=draw;
  draw();

  inquiry(root,{ id:'og', title:'종이접기 등분 — 접기가 곧 증명',
    q:['세 모드(3등분·5등분·각 3등분)를 모두 완주하며, 접힌 선이 만든 점의 비를 기록하세요.',
       '3등분에서 생긴 닮은 삼각형 두 개를 찾아 대응변의 비를 쓰고, 그 비가 왜 1 : 2 인지 확인하세요.',
       '각 3등분 접기가 왜 정확한지 <b>합동(SSS·SAS)</b>으로 손으로 설명하고, 자와 컴퍼스로는 왜 불가능한지도 조사해 적으세요.'],
    cols:['모드','접기 단계','만들어진 점','내분비','근거(닮음/합동)'],
    hint:'힌트 — 접기는 「대칭 이동」입니다. 접힌 선은 두 점을 겹치게 하는 수직이등분선이거나 각의 이등분선입니다.',
    read:()=>{ const mode=$('#ogM').value;
      const nm={t3:'선분 3등분',t5:'선분 5등분',a3:'각 3등분'}[mode];
      const done=S.st>=maxSt();
      return [nm, S.st+' / '+maxSt(), done?(mode==='a3'?'3등분선 2개':'점 P'):'—',
              done?(mode==='t3'?'2 : 1':mode==='t5'?'1 : 4':'1 : 1 : 1'):'—', mode==='a3'?'합동':'닮음']; } });
}

/* ---------- LAB 105 주사위 100개 — 실험으로 만드는 지수 감소 ----------
   원자료: 2021 「지수함수와 로그함수」 교수학습과정안(주사위 100개, 하진수).
   모둠이 주사위 100개를 굴려 1이 나온 것을 빼는 실제 수업을, 100개를 무한히
   굴릴 수 있는 실험으로 옮겼다. 실험값과 이론값 100(5/6)^t 가 나란히 쌓인다. */
function decayDemo(root){
  root.innerHTML=`<div class="row"><div class="col">
      <canvas id="dc1" width="380" height="300"></canvas>
      <div class="ctl" style="display:flex;gap:6px;flex-wrap:wrap;margin-top:8px">
        <button class="b t" id="dcGo">한 해 굴리기 ▶</button>
        <button class="b t sm" id="dcRun">10년 자동</button>
        <button class="b g sm" id="dcRs">다시 (100세대)</button>
      </div>
    </div>
    <div class="col">
      <div class="out" id="dcout"></div>
      <div class="note" style="margin-top:12px">주사위 100개 = 100세대. 한 해에 <b>1이 나온 세대</b>가 이주합니다
      (확률 1/6). 실험값 점과 이론 곡선 <b>100 × (5/6)<sup>t</sup></b> 를 나란히 보세요.</div>
    </div></div>`;
  const cv=$('#dc1'),ctx=cv.getContext('2d'),W=380,H=300,P=40;
  const S={ n:100, hist:[100], year:0 };
  const X=t=>P+(W-P-16)*t/20, Y=v=>H-P-(H-2*P)*v/110;
  function roll(){
    if(S.year>=20 || S.n<=0) return;
    let left=0;
    for(let i=0;i<S.n;i++) if(Math.floor(Math.random()*6)!==0) left++;
    S.n=left; S.year++; S.hist.push(left);
  }
  function draw(){
    ctx.clearRect(0,0,W,H); ctx.fillStyle='#fff'; ctx.fillRect(0,0,W,H);
    ctx.strokeStyle='#F1F3F6'; ctx.lineWidth=1;
    for(let v=0;v<=100;v+=25){ ctx.beginPath(); ctx.moveTo(P,Y(v)); ctx.lineTo(W-16,Y(v)); ctx.stroke();
      ctx.fillStyle='#9CA3AF'; ctx.font='9.5px sans-serif'; ctx.textAlign='right'; ctx.fillText(v, P-6, Y(v)+3); }
    // 이론 곡선
    ctx.strokeStyle='#B45309'; ctx.lineWidth=2; ctx.setLineDash([5,4]); ctx.beginPath();
    for(let t=0;t<=20;t+=0.25){ const v=100*Math.pow(5/6,t); const x=X(t),y=Y(v); t?ctx.lineTo(x,y):ctx.moveTo(x,y); }
    ctx.stroke(); ctx.setLineDash([]);
    // 10세대 기준선
    ctx.strokeStyle='#BE123C'; ctx.setLineDash([3,3]); ctx.lineWidth=1.2;
    ctx.beginPath(); ctx.moveTo(P,Y(10)); ctx.lineTo(W-16,Y(10)); ctx.stroke(); ctx.setLineDash([]);
    ctx.fillStyle='#BE123C'; ctx.font='bold 10px sans-serif'; ctx.textAlign='left'; ctx.fillText('10세대', P+4, Y(10)-4);
    // 실험 점·선
    ctx.strokeStyle='#2563EB'; ctx.lineWidth=2.2; ctx.beginPath();
    S.hist.forEach((v,t)=>{ const x=X(t),y=Y(v); t?ctx.lineTo(x,y):ctx.moveTo(x,y); }); ctx.stroke();
    S.hist.forEach((v,t)=>{ ctx.fillStyle='#2563EB'; ctx.beginPath(); ctx.arc(X(t),Y(v),3.6,0,7); ctx.fill(); });
    ctx.strokeStyle='#9CA3AF'; ctx.lineWidth=1.2;
    ctx.beginPath(); ctx.moveTo(P,H-P); ctx.lineTo(W-16,H-P); ctx.stroke();
    ctx.fillStyle='#6B7280'; ctx.font='10px sans-serif'; ctx.textAlign='left'; ctx.fillText('해(년) →', P, H-P+16);
    const th=100*Math.pow(5/6,S.year), err=S.n-th;
    const half=S.hist.findIndex(v=>v<=50), ten=S.hist.findIndex(v=>v<=10);
    $('#dcout').innerHTML =
      '<b>' + S.year + '년째</b> · 남은 세대 <b style="color:#2563EB">' + S.n + '</b>'
      + ' · 이론 <b style="color:#B45309">' + th.toFixed(1) + '</b>'
      + ' · 오차 <b>' + (err>=0?'+':'') + err.toFixed(1) + '</b><br>'
      + '<span class="mono">N(t) = 100 × (5/6)^t</span><br>'
      + (half>0 ? '<b style="color:#0E9384">절반 붕괴 — ' + half + '년째에 50세대 이하로 내려갔습니다.</b><br>' : '')
      + (ten>0 ? '<b style="color:#BE123C">10세대 이하 — ' + ten + '년째 도달.</b> 로그로 구한 값과 비교하세요.<br>' : '')
      + (S.year>=10 ? '<b style="color:#7C3AED">10년 실험 완료 — 이론 ' + (100*Math.pow(5/6,10)).toFixed(1) + '세대와 견주세요.</b><br>' : '')
      + '<span style="color:#6B7280;font-size:12.5px">같은 조건인데 굴릴 때마다 값이 다릅니다 — 실험은 이론 곡선 둘레에서 흔들립니다.</span>';
  }
  $('#dcGo').onclick=()=>{ roll(); draw(); };
  $('#dcRun').onclick=()=>{ for(let i=0;i<10;i++) roll(); draw(); };
  $('#dcRs').onclick=()=>{ S.n=100; S.year=0; S.hist=[100]; draw(); };
  draw();

  inquiry(root,{ id:'dc', title:'주사위 100개 — 실험으로 만드는 지수 감소',
    q:['한 해씩 굴리며 (해, 실험값, 이론값, 오차)를 10년까지 기록하세요. 「다시」로 세 번 반복해 흔들림도 보세요.',
       '실험값이 이론 곡선의 위·아래로 흩어지는 폭을 보고, 표본이 100개일 때 믿을 만한지 판단하세요.',
       '10세대 이하가 되는 해를 <b>로그</b>로 구하고(log2=0.30, log3=0.47), 실험에서 관측한 해와 비교해 차이를 설명하세요.'],
    cols:['해','실험 남은 수','이론값','오차','비고'],
    hint:'힌트 — 100(5/6)^x ≤ 10 → x ≥ log10 ÷ (log6 − log5). log6=log2+log3, log5=1−log2 로 바꿔 계산합니다.',
    read:()=>{ const th=100*Math.pow(5/6,S.year);
      return [S.year, S.n, th.toFixed(1), (S.n-th).toFixed(1), S.n<=10?'10세대 이하':S.n<=50?'절반 이하':'—']; } });
}



/* ---------- LAB 106 단위원 — 90°를 넘는 각의 삼각비 ---------- */
function unitCircleDemo(root){
  root.innerHTML=`<div class="row"><div class="col">
      <canvas id="uc1" width="380" height="330"></canvas>
      <div class="note" style="margin-top:8px"><b>원 위의 점 P 를 끌어</b> 각을 바꾸세요.
      특수각 근처에서는 딱 붙습니다.</div>
    </div>
    <div class="col">
      ${slider('ucA','각 θ',-90,750,1,30,'°')}
      <div class="ctl" style="display:flex;gap:6px;flex-wrap:wrap;margin-top:8px">
        <button class="b g sm" id="uc150">150°</button>
        <button class="b g sm" id="uc210">210°</button>
        <button class="b g sm" id="uc390">390°</button>
      </div>
      <div class="out" id="ucout"></div>
      <div class="note" style="margin-top:12px">직각삼각형만으로는 90°를 넘는 각의 삼각비를 말할 수 없습니다.
      <b>단위원 위의 좌표</b>로 정의를 넓히면 어떤 각이든 sin·cos 이 생깁니다.</div>
    </div></div>`;
  const cv=$('#uc1'),ctx=cv.getContext('2d'),W=380,H=330;
  const C={x:190,y:170}, R=110;
  const SNAP=[0,30,45,60,90,120,135,150,180,210,225,240,270,300,315,330,360,390,405,420,450,540,720];
  const S={ a:30 };
  const rad=d=>d*Math.PI/180;
  function quad(a){ const m=((a%360)+360)%360;
    if(Math.abs(m%90)<0.5) return '축 위';
    return (m<90?'제1사분면':m<180?'제2사분면':m<270?'제3사분면':'제4사분면'); }
  function draw(){
    const a=S.a; $('#ucAv').textContent=a+'°';
    ctx.clearRect(0,0,W,H); ctx.fillStyle='#fff'; ctx.fillRect(0,0,W,H);
    ctx.strokeStyle='#E8ECF2'; ctx.lineWidth=1;
    ctx.beginPath(); ctx.moveTo(C.x-150,C.y); ctx.lineTo(C.x+150,C.y); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(C.x,C.y-140); ctx.lineTo(C.x,C.y+140); ctx.stroke();
    ctx.strokeStyle='#9CA3AF'; ctx.lineWidth=1.4;
    ctx.beginPath(); ctx.arc(C.x,C.y,R,0,7); ctx.stroke();
    const t=rad(a), px=C.x+R*Math.cos(t), py=C.y-R*Math.sin(t);
    // 각 호
    ctx.strokeStyle='#B45309'; ctx.lineWidth=2;
    ctx.beginPath(); ctx.arc(C.x,C.y,30,0,-rad(Math.min(a,360)),a>0); ctx.stroke();
    // 좌표 성분
    ctx.strokeStyle='#0E9384'; ctx.setLineDash([4,3]); ctx.lineWidth=1.6;
    ctx.beginPath(); ctx.moveTo(px,py); ctx.lineTo(px,C.y); ctx.stroke();
    ctx.strokeStyle='#2563EB';
    ctx.beginPath(); ctx.moveTo(px,py); ctx.lineTo(C.x,py); ctx.stroke(); ctx.setLineDash([]);
    ctx.strokeStyle='#111827'; ctx.lineWidth=2.2;
    ctx.beginPath(); ctx.moveTo(C.x,C.y); ctx.lineTo(px,py); ctx.stroke();
    handle(ctx,px,py,'#BE123C','P');
    ctx.fillStyle='#0E9384'; ctx.font='bold 11px sans-serif'; ctx.textAlign='center';
    ctx.fillText('sin θ', px+(Math.cos(t)>=0?26:-26), (py+C.y)/2);
    ctx.fillStyle='#2563EB'; ctx.fillText('cos θ', (px+C.x)/2, py+(Math.sin(t)>=0?-8:16));
    const si=Math.sin(t), co=Math.cos(t);
    const near=SNAP.find(v=>Math.abs(v-a)<0.6);
    $('#ucout').innerHTML =
      `<b>θ = ${a}°</b> · ${quad(a)}<br>`
      + `<span class="mono">P(cos θ, sin θ) = (${co.toFixed(3)}, ${si.toFixed(3)})</span><br>`
      + `sin θ = <b style="color:#0E9384">${si.toFixed(3)}</b> · cos θ = <b style="color:#2563EB">${co.toFixed(3)}</b>`
      + ` · tan θ = <b>${Math.abs(co)<1e-9?'정의되지 않음':(si/co).toFixed(3)}</b><br>`
      + `부호: sin ${si>=0?'+':'−'} · cos ${co>=0?'+':'−'}<br>`
      + (near!==undefined && Math.abs(Math.abs(si)-0.5)<1e-3 ? `<b style="color:#0E9384">특수각 명중 — |sin θ| = 0.500 (30°짜리 삼각형)</b><br>` : '')
      + (a>=360 ? `<b style="color:#7C3AED">한 바퀴 지났습니다 — ${a}° 와 ${a-360}° 는 같은 자리(주기 360°)</b><br>` : '')
      + (a<0 ? `<b style="color:#B45309">음의 각 — 시계 방향으로 ${-a}° 돌았습니다.</b><br>` : '')
      + `<span style="color:#6B7280;font-size:12.5px">삼각비가 「길이의 비」에서 「좌표」로 넓어지는 순간입니다.</span>`;
  }
  dragOn(cv,{
    hit:p=>Math.hypot(p.x-C.x,p.y-C.y)>40?'P':null,
    move:(h,p)=>{ let a=Math.atan2(-(p.y-C.y), p.x-C.x)*180/Math.PI;
      if(a<0) a+=360;
      const base=Math.floor((S.a<0?0:S.a)/360)*360;
      let cand=base+a;
      SNAP.forEach(v=>{ if(Math.abs(v-cand)<5) cand=v; });
      S.a=Math.max(-90,Math.min(750,Math.round(cand))); $('#ucA').value=S.a; draw(); }
  });
  $('#ucA').oninput=()=>{ S.a=+$('#ucA').value; draw(); };
  [['uc150',150],['uc210',210],['uc390',390]].forEach(([id,v])=>{
    $('#'+id).onclick=()=>{ S.a=v; $('#ucA').value=v; draw(); }; });
  draw();
  inquiry(root,{ id:'uc', title:'단위원 — 각을 90° 너머로 넓히기',
    q:['θ 를 0°부터 360°까지 30° 간격으로 돌리며 (θ, sin, cos, 부호, 사분면)을 기록하세요.',
       '사분면별로 sin·cos 의 부호를 표로 정리하고, 부호가 바뀌는 자리(축)를 확인하세요.',
       'sin 150° 가 sin 30° 와 같은 이유를 <b>단위원의 좌표</b>로 손으로 설명하고, 390°가 30°와 같은 이유(주기)도 적으세요.'],
    cols:['θ','사분면','sin θ','cos θ','부호(sin, cos)'],
    hint:'힌트 — 단위원 위의 점 P 의 y 좌표가 sin, x 좌표가 cos 입니다. 부호는 좌표의 부호 그대로입니다.',
    read:()=>{ const t=rad(S.a);
      return [S.a+'°', quad(S.a), Math.sin(t).toFixed(3), Math.cos(t).toFixed(3),
              (Math.sin(t)>=0?'+':'−')+', '+(Math.cos(t)>=0?'+':'−')]; } });
}

/* ---------- LAB 107 일출 시각 — 삼각함수로 1년을 모형화 ---------- */
function sunriseDemo(root){
  root.innerHTML=`<div class="row"><div class="col">
      <canvas id="sr1" width="380" height="300"></canvas>
      <div class="note" style="margin-top:8px">점 12개는 <b>대전의 월별 일출 시각</b>(실측 근사)입니다.
      곡선을 점에 맞춰 보세요.</div>
    </div>
    <div class="col">
      ${slider('srA','진폭 A (시간)',0,2,0.05,0.5,'')}
      ${slider('srD','중심 D (시각)',5,8,0.05,7,'')}
      ${slider('srC','위상 C (달)',0,12,0.25,0,'')}
      <div class="ctl" style="display:flex;gap:6px;flex-wrap:wrap;margin-top:8px">
        <button class="b g sm" id="srP">6월 21일 예측</button>
      </div>
      <div class="out" id="srout"></div>
      <div class="note" style="margin-top:12px">주기는 12개월로 고정입니다 — 1년이 한 바퀴이기 때문입니다.
      진폭·중심·위상 셋만 맞추면 1년의 일출이 식 하나로 들어옵니다.</div>
    </div></div>`;
  const cv=$('#sr1'),ctx=cv.getContext('2d'),W=380,H=300,P=44;
  const DATA=[7.70,7.33,6.78,6.08,5.57,5.27,5.40,5.78,6.18,6.60,7.08,7.55]; // 1~12월 일출(시)
  const S={};
  const X=m=>P+(W-P-16)*(m-1)/11, Y=v=>H-P-(H-2*P)*(v-4.8)/(8.2-4.8);
  const model=(m,A,D,C)=>D+A*Math.sin(2*Math.PI*(m-C)/12);
  function draw(){
    const A=+$('#srA').value, D=+$('#srD').value, C=+$('#srC').value;
    $('#srAv').textContent=A.toFixed(2); $('#srDv').textContent=D.toFixed(2); $('#srCv').textContent=C.toFixed(2);
    ctx.clearRect(0,0,W,H); ctx.fillStyle='#fff'; ctx.fillRect(0,0,W,H);
    ctx.strokeStyle='#F1F3F6';
    for(let v=5;v<=8;v+=0.5){ ctx.beginPath(); ctx.moveTo(P,Y(v)); ctx.lineTo(W-16,Y(v)); ctx.stroke();
      ctx.fillStyle='#9CA3AF'; ctx.font='9.5px sans-serif'; ctx.textAlign='right';
      ctx.fillText(v.toFixed(1), P-6, Y(v)+3); }
    ctx.strokeStyle='#2563EB'; ctx.lineWidth=2.4; ctx.beginPath();
    for(let m=1;m<=12;m+=0.1){ const x=X(m), y=Y(model(m,A,D,C)); m===1?ctx.moveTo(x,y):ctx.lineTo(x,y); }
    ctx.stroke();
    DATA.forEach((v,i)=>{ ctx.fillStyle='#BE123C';
      ctx.beginPath(); ctx.arc(X(i+1),Y(v),4,0,7); ctx.fill(); });
    ctx.strokeStyle='#9CA3AF'; ctx.lineWidth=1.2;
    ctx.beginPath(); ctx.moveTo(P,H-P); ctx.lineTo(W-16,H-P); ctx.stroke();
    ctx.fillStyle='#6B7280'; ctx.font='10px sans-serif'; ctx.textAlign='center';
    [1,4,7,10,12].forEach(m=>ctx.fillText(m+'월', X(m), H-P+16));
    let se=0; DATA.forEach((v,i)=>{ const e=v-model(i+1,A,D,C); se+=e*e; });
    const rmse=Math.sqrt(se/12);
    const hm=v=>{ const h=Math.floor(v), mi=Math.round((v-h)*60); return h+'시 '+String(mi).padStart(2,'0')+'분'; };
    $('#srout').innerHTML =
      `<span class="mono">y = ${D.toFixed(2)} + ${A.toFixed(2)} sin( 2π(x − ${C.toFixed(2)}) / 12 )</span><br>`
      + `진폭 A = ${A.toFixed(2)} · 중심 D = ${D.toFixed(2)} · 위상 C = ${C.toFixed(2)}<br>`
      + `평균 오차(RMSE) = <b style="color:${rmse<0.15?'#0E9384':rmse<0.3?'#B45309':'#BE123C'}">${rmse.toFixed(3)} 시간</b>`
      + ` (${(rmse*60).toFixed(0)}분)<br>`
      + (rmse<0.15 ? `<b style="color:#0E9384">일출 모형 명중 — 12개월 전부를 식 하나가 설명합니다.</b><br>` : '')
      + `<span style="color:#6B7280;font-size:12.5px">6월(하지) 예측 ${hm(model(6.7,A,D,C))} · 12월(동지) 예측 ${hm(model(12.7,A,D,C))}</span>`;
  }
  ['srA','srD','srC'].forEach(i=>$('#'+i).oninput=draw);
  $('#srP').onclick=()=>{ const A=+$('#srA').value, D=+$('#srD').value, C=+$('#srC').value;
    const v=model(6.7,A,D,C); const h=Math.floor(v), mi=Math.round((v-h)*60);
    $('#srout').innerHTML += `<br><b style="color:#7C3AED">6월 21일(하지) 모형 예측: ${h}시 ${String(mi).padStart(2,'0')}분</b>`; };
  draw();
  inquiry(root,{ id:'sr', title:'일출 시각 — 1년을 식 하나로',
    q:['A·D·C 를 하나씩만 움직이며 곡선이 어떻게 반응하는지 기록하세요(각각 무엇을 조종하나요?).',
       'RMSE 를 0.12시간(약 7분) 아래로 낮춘 (A, D, C) 조합을 찾아 적으세요.',
       '주기를 12로 고정한 이유를 쓰고, 하지·동지가 곡선의 어느 자리인지 표시해 설명하세요.'],
    cols:['A','D','C','RMSE(시간)','판정'],
    hint:'힌트 — D 는 1년 평균 일출, A 는 여름·겨울의 차이 절반, C 는 곡선을 좌우로 미는 값입니다.',
    read:()=>{ const A=+$('#srA').value, D=+$('#srD').value, C=+$('#srC').value;
      let se=0; DATA.forEach((v,i)=>{ const e=v-model(i+1,A,D,C); se+=e*e; });
      const r=Math.sqrt(se/12);
      return [A.toFixed(2), D.toFixed(2), C.toFixed(2), r.toFixed(3), r<0.15?'명중':'조정 필요']; } });
}

/* ---------- LAB 108 사인·코사인법칙 — 갈 수 없는 곳까지의 거리 ---------- */
function lawsDemo(root){
  root.innerHTML=`<div class="row"><div class="col">
      <canvas id="ls1" width="380" height="300"></canvas>
      <div class="note" style="margin-top:8px">강 건너 나무 C 까지의 거리를 재야 합니다.
      건널 수 없으니 이쪽 기슭에서 <b>기선 AB</b>와 두 각만 잽니다.</div>
    </div>
    <div class="col">
      ${slider('lsA','각 A (∠BAC)',20,110,1,45,'°')}
      ${slider('lsB','각 B (∠ABC)',20,110,1,70,'°')}
      ${slider('lsC','기선 AB (m)',20,120,1,80,'m')}
      <div class="ctl" style="display:flex;gap:6px;flex-wrap:wrap;margin-top:8px">
        <button class="b g sm" id="lsChk">코사인법칙으로 검산</button>
      </div>
      <div class="out" id="lsout"></div>
      <div class="note" style="margin-top:12px">한 변과 그 양 끝 각을 알면 나머지가 모두 정해집니다(ASA).
      사인법칙이 그 「정해짐」을 길이로 바꿔 줍니다.</div>
    </div></div>`;
  const cv=$('#ls1'),ctx=cv.getContext('2d'),W=380,H=300;
  const S={ chk:false };
  const rad=d=>d*Math.PI/180;
  function geom(){
    const A=+$('#lsA').value, B=+$('#lsB').value, c=+$('#lsC').value;
    const Cang=180-A-B;
    const b = Cang>0 ? c*Math.sin(rad(B))/Math.sin(rad(Cang)) : NaN;  // AC
    const a = Cang>0 ? c*Math.sin(rad(A))/Math.sin(rad(Cang)) : NaN;  // BC
    return {A,B,C:Cang,a,b,c};
  }
  function draw(){
    const g=geom();
    $('#lsAv').textContent=g.A+'°'; $('#lsBv').textContent=g.B+'°'; $('#lsCv').textContent=g.c+'m';
    ctx.clearRect(0,0,W,H); ctx.fillStyle='#fff'; ctx.fillRect(0,0,W,H);
    // 강
    ctx.fillStyle='#E7F0FB'; ctx.fillRect(0,60,W,90);
    ctx.fillStyle='#93B4F7'; ctx.font='11px sans-serif'; ctx.textAlign='left'; ctx.fillText('강', 12, 108);
    const sc=Math.min(2.6, 220/Math.max(g.c,1));
    const Ax=70, Ay=230, Bx=Ax+g.c*sc, By=230;
    let Cx=Ax, Cy=Ay;
    if(isFinite(g.b)){ Cx=Ax+g.b*sc*Math.cos(rad(g.A)); Cy=Ay-g.b*sc*Math.sin(rad(g.A)); }
    ctx.strokeStyle='#111827'; ctx.lineWidth=2.4;
    ctx.beginPath(); ctx.moveTo(Ax,Ay); ctx.lineTo(Bx,By); ctx.stroke();
    if(isFinite(g.b)){
      ctx.strokeStyle='#2563EB'; ctx.lineWidth=2;
      ctx.beginPath(); ctx.moveTo(Ax,Ay); ctx.lineTo(Cx,Cy); ctx.stroke();
      ctx.strokeStyle='#0E9384';
      ctx.beginPath(); ctx.moveTo(Bx,By); ctx.lineTo(Cx,Cy); ctx.stroke();
      ctx.fillStyle='#166534'; ctx.beginPath(); ctx.arc(Cx,Cy,6,0,7); ctx.fill();
      ctx.fillStyle='#111827'; ctx.font='bold 12px sans-serif'; ctx.textAlign='center';
      ctx.fillText('C (나무)', Cx, Cy-12);
    }
    ctx.fillStyle='#111827'; ctx.font='bold 12px sans-serif'; ctx.textAlign='center';
    ctx.fillText('A', Ax-12, Ay+6); ctx.fillText('B', Bx+12, By+6);
    ctx.fillStyle='#6B7280'; ctx.font='11px sans-serif';
    ctx.fillText('기선 '+g.c+' m', (Ax+Bx)/2, Ay+20);
    const ok=g.C>0;
    const cos2 = ok ? Math.sqrt(g.a*g.a + g.c*g.c - 2*g.a*g.c*Math.cos(rad(g.B))) : NaN; // 코사인법칙으로 b 재계산
    $('#lsout').innerHTML =
      (!ok ? `<b style="color:#BE123C">두 각의 합이 180°를 넘어 삼각형이 없습니다.</b>`
        : `<span class="mono">a / sin A = b / sin B = c / sin C</span><br>`
          + `∠C = 180° − ${g.A}° − ${g.B}° = <b>${g.C}°</b><br>`
          + `AC = ${g.c} × sin ${g.B}° / sin ${g.C}° = <b style="color:#2563EB">${g.b.toFixed(1)} m</b><br>`
          + `BC = <b style="color:#0E9384">${g.a.toFixed(1)} m</b><br>`
          + (Math.abs(g.A-63)<0.5 && Math.abs(g.B-55)<0.5 && g.c===50
             ? `<b style="color:#BE123C">건널 수 없는 거리 확정 — 나무까지 ${g.b.toFixed(1)} m</b><br>` : '')
          + (S.chk ? `<span class="mono">b² = a² + c² − 2ac·cos B</span> → b = <b>${cos2.toFixed(1)} m</b> — `
                     + (Math.abs(cos2-g.b)<0.05 ? `<b style="color:#0E9384">두 법칙 일치! 검산 성공</b>` : `차이 ${Math.abs(cos2-g.b).toFixed(2)}`) + `<br>` : '')
          + `<span style="color:#6B7280;font-size:12.5px">기선을 늘리면 정확도가 올라갑니다 — 측량의 기본 원리입니다.</span>`);
  }
  ['lsA','lsB','lsC'].forEach(i=>$('#'+i).oninput=()=>{ S.chk=false; draw(); });
  $('#lsChk').onclick=()=>{ S.chk=true; draw(); };
  draw();
  inquiry(root,{ id:'ls', title:'사인·코사인법칙 — 갈 수 없는 거리 재기',
    q:['(A, B, 기선) 을 바꿔 가며 AC·BC 를 다섯 줄 기록하세요.',
       '기선을 2배로 늘리면 거리 값이 어떻게 변하는지 확인하고, 두 각만 바꿨을 때와 비교하세요.',
       '사인법칙으로 구한 값을 코사인법칙으로 검산해 같은지 확인하고, 왜 같은 값이 나오는지 설명하세요.'],
    cols:['∠A','∠B','∠C','기선 c','AC','BC'],
    hint:'힌트 — 한 변과 양 끝 각이 정해지면 삼각형은 하나뿐(ASA)입니다. 나머지 두 변은 사인법칙으로 즉시 나옵니다.',
    read:()=>{ const g=geom(); if(g.C<=0) return null;
      return [g.A+'°', g.B+'°', g.C+'°', g.c+'m', g.b.toFixed(1), g.a.toFixed(1)]; } });
}

/* ---------- LAB 109 등비수열 — 대출 상환액은 어떻게 정해질까 ---------- */
function loanDemo(root){
  root.innerHTML=`<div class="row"><div class="col">
      <canvas id="lo1" width="380" height="300"></canvas>
      <div class="note" style="margin-top:8px">막대는 매달 남은 <b>원금(잔액)</b>입니다.
      갚아도 처음엔 잘 안 줄어드는 이유를 보세요.</div>
    </div>
    <div class="col">
      ${slider('loP','대출 원금',100,2000,50,800,'만원')}
      ${slider('loR','연이자율',1,12,0.5,4,'%')}
      ${slider('loN','상환 기간',6,60,6,36,'개월')}
      <div class="out" id="loout"></div>
      <div class="note" style="margin-top:12px">매달 같은 금액을 갚는 원리금균등상환입니다.
      각 달의 상환액을 현재 가치로 되돌리면 <b>등비수열의 합</b>이 됩니다.</div>
    </div></div>`;
  const cv=$('#lo1'),ctx=cv.getContext('2d'),W=380,H=300,P=42;
  function calc(){
    const Pv=+$('#loP').value, r=+$('#loR').value/100/12, n=+$('#loN').value;
    const q=Math.pow(1+r,n);
    const m = r>0 ? Pv*r*q/(q-1) : Pv/n;
    const bal=[Pv]; let b=Pv, tot=0;
    for(let k=0;k<n;k++){ const it=b*r; b=b+it-m; tot+=m; bal.push(Math.max(0,b)); }
    return {Pv,r,n,m,bal,tot,interest:tot-Pv};
  }
  function draw(){
    const c=calc();
    $('#loPv').textContent=c.Pv.toLocaleString()+'만원';
    $('#loRv').textContent=(+$('#loR').value).toFixed(1)+'%';
    $('#loNv').textContent=c.n+'개월';
    ctx.clearRect(0,0,W,H); ctx.fillStyle='#fff'; ctx.fillRect(0,0,W,H);
    const bw=(W-P-16)/c.bal.length;
    ctx.strokeStyle='#F1F3F6';
    for(let i=0;i<=4;i++){ const y=H-P-(H-2*P)*i/4; ctx.beginPath(); ctx.moveTo(P,y); ctx.lineTo(W-16,y); ctx.stroke(); }
    c.bal.forEach((v,i)=>{ const h=(H-2*P)*v/c.Pv;
      ctx.fillStyle= i===0?'#BE123C':'rgba(37,99,235,.45)';
      ctx.fillRect(P+i*bw+1, H-P-h, Math.max(1.5,bw-2), h); });
    ctx.strokeStyle='#9CA3AF'; ctx.lineWidth=1.2;
    ctx.beginPath(); ctx.moveTo(P,H-P); ctx.lineTo(W-16,H-P); ctx.stroke();
    ctx.fillStyle='#6B7280'; ctx.font='10px sans-serif'; ctx.textAlign='left';
    ctx.fillText('개월 →', P, H-P+16);
    ctx.textAlign='right'; ctx.fillText(c.Pv.toLocaleString()+'만원', P-6, H-2*P+14);
    const half=c.bal.findIndex(v=>v<=c.Pv/2);
    $('#loout').innerHTML =
      `<span class="mono">m = P·i(1+i)ⁿ / ((1+i)ⁿ − 1)</span><br>`
      + `월 이자율 i = ${(c.r*100).toFixed(3)}% · 기간 ${c.n}개월<br>`
      + `<b style="color:#2563EB">월 상환액 ${c.m.toFixed(1)}만원</b> · 총 상환 ${c.tot.toFixed(0)}만원`
      + ` · 총 이자 <b style="color:#BE123C">${c.interest.toFixed(1)}만원</b><br>`
      + (half>0 ? `잔액이 절반이 되는 시점: <b>${half}개월째</b> (기간의 ${(half/c.n*100).toFixed(0)}%)<br>` : '')
      + (c.interest > c.Pv*0.1 ? `<b style="color:#BE123C">이자가 원금의 10%를 넘었습니다 — 기간과 이자율의 힘.</b><br>` : '')
      + `<span style="color:#6B7280;font-size:12.5px">기간을 늘리면 월 부담은 줄지만 총 이자는 늘어납니다 — 직접 확인해 보세요.</span>`;
  }
  ['loP','loR','loN'].forEach(i=>$('#'+i).oninput=draw); draw();
  inquiry(root,{ id:'lo', title:'대출 상환 — 등비수열이 만든 월 상환액',
    q:['(원금, 이자율, 기간) 을 바꿔 가며 월 상환액·총이자를 여섯 줄 기록하세요.',
       '기간만 2배로 늘렸을 때 월 상환액과 총 이자가 각각 어떻게 변하는지 비교하세요.',
       '월 상환액 공식이 <b>등비수열의 합</b>에서 나오는 과정을 손으로 유도하세요 (각 달의 상환액을 현재가치로 되돌려 더하기).'],
    cols:['원금','연이자율','기간','월 상환액','총 이자'],
    hint:'힌트 — n개월 뒤 가치로 환산하면 P(1+i)ⁿ = m{(1+i)ⁿ⁻¹ + … + 1} 이고, 오른쪽이 등비수열의 합입니다.',
    read:()=>{ const c=calc();
      return [c.Pv+'만원', (+$('#loR').value).toFixed(1)+'%', c.n+'개월', c.m.toFixed(1), c.interest.toFixed(1)]; } });
}

/* ---------- LAB 110 시그마 — 계단 두 개로 만드는 합의 공식 ---------- */
function sigmaDemo(root){
  root.innerHTML=`<div class="row"><div class="col">
      <canvas id="sg1" width="380" height="300"></canvas>
      <div class="ctl" style="display:flex;gap:6px;flex-wrap:wrap;margin-top:8px">
        <button class="b t" id="sgFlip">거꾸로 된 계단 붙이기</button>
        <button class="b g sm" id="sgRs">떼어내기</button>
      </div>
    </div>
    <div class="col">
      ${slider('sgN','n (몇까지 더할까)',3,20,1,6,'')}
      <label class="ctl" style="margin-top:8px">무엇을 더할까요
        <select id="sgK" style="width:100%;padding:7px 9px;border:1px solid #E5E7EB;border-radius:8px;font:inherit">
          <option value="1">Σk — 1 + 2 + 3 + … + n</option>
          <option value="2">Σk² — 1² + 2² + … + n²</option>
        </select></label>
      <div class="out" id="sgout"></div>
      <div class="note" style="margin-top:12px">계단 두 개를 <b>맞물려 붙이면</b> 직사각형이 됩니다.
      가우스가 1부터 100까지를 순식간에 더한 방법입니다.</div>
    </div></div>`;
  const cv=$('#sg1'),ctx=cv.getContext('2d'),W=380,H=300,P=34;
  const S={ flip:false };
  function draw(){
    const n=+$('#sgN').value, kind=$('#sgK').value;
    $('#sgNv').textContent=n;
    ctx.clearRect(0,0,W,H); ctx.fillStyle='#fff'; ctx.fillRect(0,0,W,H);
    const cw=(W-2*P)/n, ch=(H-2*P)/(n+1);
    for(let i=1;i<=n;i++){
      const h=i*ch;
      ctx.fillStyle='rgba(37,99,235,.42)';
      ctx.fillRect(P+(i-1)*cw+1, H-P-h, cw-2, h);
      if(S.flip){ ctx.fillStyle='rgba(190,18,60,.32)';
        ctx.fillRect(P+(i-1)*cw+1, H-P-(n+1)*ch, cw-2, (n+1-i)*ch); }
    }
    ctx.strokeStyle='#9CA3AF'; ctx.lineWidth=1.2;
    ctx.beginPath(); ctx.moveTo(P,H-P); ctx.lineTo(W-P,H-P); ctx.stroke();
    if(S.flip){ ctx.strokeStyle='#111827'; ctx.lineWidth=2;
      ctx.strokeRect(P+1, H-P-(n+1)*ch, n*cw-2, (n+1)*ch);
      ctx.fillStyle='#111827'; ctx.font='bold 12px sans-serif'; ctx.textAlign='center';
      ctx.fillText('가로 n = '+n+' · 세로 (n+1) = '+(n+1), W/2, H-P-(n+1)*ch-8); }
    const s1=n*(n+1)/2, s2=n*(n+1)*(2*n+1)/6;
    const sum = kind==='1' ? s1 : s2;
    let brute=0; for(let i=1;i<=n;i++) brute += (kind==='1'? i : i*i);
    $('#sgout').innerHTML =
      (kind==='1'
        ? `<span class="mono">Σ<sub>k=1</sub><sup>${n}</sup> k = ${brute}</span><br>`
          + (S.flip
            ? `<b style="color:#0E9384">직사각형 완성 — 넓이 n(n+1) = ${n}×${n+1} = ${n*(n+1)}</b><br>`
              + `계단 하나는 그 <b>절반</b> → <span class="mono">n(n+1)/2 = ${s1}</span><br>`
            : `계단 두 개를 붙이면 어떤 모양이 될까요? 단추를 눌러 보세요.<br>`)
          + `<span style="color:#6B7280;font-size:12.5px">n = 100 이면 100×101/2 = 5,050 — 가우스의 답입니다.</span>`
        : `<span class="mono">Σ<sub>k=1</sub><sup>${n}</sup> k² = ${brute}</span><br>`
          + `공식값 n(n+1)(2n+1)/6 = <b>${s2}</b> — ${brute===s2?'<b style="color:#0E9384">일치합니다</b>':'다릅니다'}<br>`
          + `<span style="color:#6B7280;font-size:12.5px">제곱의 합은 계단을 세 겹으로 쌓아야 직육면체가 됩니다 — 그래서 6으로 나눕니다.</span>`);
  }
  $('#sgFlip').onclick=()=>{ S.flip=true; draw(); };
  $('#sgRs').onclick=()=>{ S.flip=false; draw(); };
  $('#sgN').oninput=draw; $('#sgK').onchange=draw;
  draw();
  inquiry(root,{ id:'sg', title:'시그마 — 계단을 붙여 만드는 합의 공식',
    q:['n 을 3부터 10까지 바꾸며 (n, 실제 합, n(n+1)/2) 를 기록하세요.',
       '계단을 붙였을 때 만들어지는 직사각형의 가로·세로를 n 으로 쓰고, 왜 절반인지 확인하세요.',
       '1부터 100까지의 합을 공식으로 구하고, 제곱의 합 공식이 왜 6으로 나누는지 조사해 적으세요.'],
    cols:['n','실제 합','n(n+1)/2','직사각형 넓이','일치?'],
    hint:'힌트 — 1+2+…+n 과 n+…+2+1 을 위아래로 더하면 (n+1) 이 n 개 생깁니다.',
    read:()=>{ const n=+$('#sgN').value; let b=0; for(let i=1;i<=n;i++) b+=i;
      return [n, b, n*(n+1)/2, n*(n+1), b===n*(n+1)/2?'일치':'—']; } });
}

/* ---------- LAB 111 수학적 귀납법 — 도미노가 무너지는 조건 ---------- */
function dominoDemo(root){
  root.innerHTML=`<div class="row"><div class="col">
      <canvas id="dm1" width="380" height="240"></canvas>
      <div class="ctl" style="display:flex;gap:6px;flex-wrap:wrap;margin-top:8px">
        <button class="b t" id="dmGo">첫 도미노 밀기 ▶</button>
        <button class="b g sm" id="dmRs">다시 세우기</button>
      </div>
    </div>
    <div class="col">
      ${slider('dmN','도미노 개수',5,14,1,10,'개')}
      ${slider('dmGap','간격 (칸)',1,3,0.1,1.4,'')}
      <div class="ctl" style="margin-top:8px">
        <label class="ctl"><input type="checkbox" id="dmBreak"> 5번째 도미노만 빼기 (연결 끊기)</label>
      </div>
      <div class="out" id="dmout"></div>
      <div class="note" style="margin-top:12px">귀납법의 두 조건 — <b>① 첫 도미노가 넘어진다</b>,
      <b>② k 번째가 넘어지면 k+1 번째도 넘어진다</b>. 둘 중 하나만 빠져도 전부 무너지지 않습니다.</div>
    </div></div>`;
  const cv=$('#dm1'),ctx=cv.getContext('2d'),W=380,H=240;
  const S={ fallen:0, pushed:false };
  const DH=54, DW=9;
  function reach(){ return +$('#dmGap').value <= 1.8; }   // 도미노 높이보다 간격이 좁아야 다음을 친다
  function draw(){
    const n=+$('#dmN').value, gap=+$('#dmGap').value, brk=$('#dmBreak').checked;
    $('#dmNv').textContent=n+'개'; $('#dmGapv').textContent=gap.toFixed(1);
    ctx.clearRect(0,0,W,H); ctx.fillStyle='#fff'; ctx.fillRect(0,0,W,H);
    const step=(W-70)/n, y0=180;
    ctx.strokeStyle='#9CA3AF'; ctx.lineWidth=1.4;
    ctx.beginPath(); ctx.moveTo(20,y0); ctx.lineTo(W-16,y0); ctx.stroke();
    for(let i=1;i<=n;i++){
      const x=24+(i-1)*step*Math.min(1.4,gap)/1.4;
      if(brk && i===5){ ctx.strokeStyle='#D1D5DB'; ctx.setLineDash([3,3]);
        ctx.strokeRect(x,y0-DH,DW,DH); ctx.setLineDash([]);
        ctx.fillStyle='#BE123C'; ctx.font='9px sans-serif'; ctx.textAlign='center';
        ctx.fillText('없음', x+4, y0+12); continue; }
      const down = i<=S.fallen;
      ctx.fillStyle = down ? 'rgba(190,18,60,.55)' : 'rgba(37,99,235,.55)';
      if(down){ ctx.save(); ctx.translate(x,y0); ctx.rotate(-Math.PI/2.2);
        ctx.fillRect(0,-DW,DH,DW); ctx.restore(); }
      else ctx.fillRect(x, y0-DH, DW, DH);
      ctx.fillStyle='#6B7280'; ctx.font='9px sans-serif'; ctx.textAlign='center';
      ctx.fillText(i, x+4, y0+12);
    }
    const n2=+$('#dmN').value;
    const all = S.fallen>=n2;
    $('#dmout').innerHTML =
      `쓰러진 도미노 <b>${S.fallen} / ${n2}</b><br>`
      + `조건 ① 첫 도미노: <b style="color:${S.pushed?'#0E9384':'#BE123C'}">${S.pushed?'밀었다 ✓':'아직'}</b>`
      + ` · 조건 ② k → k+1: <b style="color:${(reach()&&!brk)?'#0E9384':'#BE123C'}">${brk?'5번에서 끊김 ✗':(reach()?'이어짐 ✓':'간격이 넓어 못 닿음 ✗')}</b><br>`
      + (all ? `<b style="color:#0E9384">전부 무너졌습니다 — 두 조건이 모두 갖춰지면 무한히 이어집니다(귀납법 성립).</b><br>`
        : S.pushed ? `<b style="color:#BE123C">${S.fallen}번에서 멈췄습니다 — 사슬이 끊기면 그 뒤는 보장되지 않습니다.</b><br>`
        : `<span style="color:#6B7280">첫 도미노를 밀어야 시작됩니다 — ①이 없으면 ②만으로는 아무 일도 안 일어납니다.</span><br>`)
      + `<span style="color:#6B7280;font-size:12.5px">n = 1 성립 + (n = k ⟹ n = k+1) ⟹ 모든 자연수에서 성립.</span>`;
  }
  $('#dmGo').onclick=()=>{
    const n=+$('#dmN').value, brk=$('#dmBreak').checked;
    S.pushed=true;
    if(!reach()){ S.fallen=1; }
    else if(brk){ S.fallen=4; }
    else S.fallen=n;
    draw();
  };
  $('#dmRs').onclick=()=>{ S.fallen=0; S.pushed=false; draw(); };
  ['dmN','dmGap'].forEach(i=>$('#'+i).oninput=()=>{ S.fallen=0; S.pushed=false; draw(); });
  $('#dmBreak').onchange=()=>{ S.fallen=0; S.pushed=false; draw(); };
  draw();
  inquiry(root,{ id:'dm', title:'수학적 귀납법 — 도미노의 두 조건',
    q:['① 첫 도미노를 밀지 않은 경우 ② 간격을 넓힌 경우 ③ 5번을 뺀 경우 ④ 둘 다 갖춘 경우를 각각 실험해 기록하세요.',
       '「전부 무너짐」이 되려면 무엇과 무엇이 필요한지 표에서 확인하세요.',
       '1 + 2 + … + n = n(n+1)/2 를 귀납법으로 증명하고, 그 증명의 어느 부분이 「첫 도미노」이고 어느 부분이 「k → k+1」인지 표시하세요.'],
    cols:['첫 도미노','k→k+1','쓰러진 수','전부 무너짐?'],
    hint:'힌트 — 조건 ②는 「어떤 k 에 대해서도」여야 합니다. 한 곳만 끊겨도 그 뒤는 보장되지 않습니다.',
    read:()=>{ const n=+$('#dmN').value, brk=$('#dmBreak').checked;
      return [S.pushed?'밀었다':'아니오', (reach()&&!brk)?'이어짐':'끊김', S.fallen, S.fallen>=n?'예':'아니오']; } });
}



/* ---------- LAB 112 지수방정식·부등식 — 몇 해 뒤에 세 배가 될까 ---------- */
function expEqDemo(root){
  root.innerHTML=`<div class="row"><div class="col">
      <canvas id="xe1" width="380" height="300"></canvas>
      <div class="note" style="margin-top:8px">파란 곡선은 y = a<sup>x</sup>, 붉은 가로선은 y = k 입니다.
      두 선이 만나는 x 가 방정식의 해입니다.</div>
    </div>
    <div class="col">
      <label class="ctl">밑 a<select id="xeA" style="width:100%;padding:7px 9px;border:1px solid #E5E7EB;border-radius:8px;font:inherit">
        <option value="2">a = 2</option>
        <option value="3">a = 3</option>
        <option value="1.06" selected>a = 1.06 (연 6% 복리)</option>
        <option value="0.5">a = 0.5 (반씩 줄기)</option></select></label>
      ${slider('xeK','k (오른쪽 값)',1.2,10,0.1,5,'')}
      <div class="ctl" style="display:flex;gap:6px;flex-wrap:wrap;margin-top:8px">
        <button class="b g sm" id="xeEq">= k (방정식)</button>
        <button class="b g sm" id="xeGt">&gt; k (부등식)</button>
      </div>
      <div class="out" id="xeout"></div>
      <div class="note" style="margin-top:12px">지수에 갇힌 x 를 꺼내는 열쇠가 <b>로그</b>입니다.
      밑이 1보다 작으면 부등호의 방향이 뒤집히는 것도 함께 보세요.</div>
    </div></div>`;
  const cv=$('#xe1'),ctx=cv.getContext('2d'),W=380,H=300,P=40;
  const S={ mode:'eq' };
  function draw(){
    const a=+$('#xeA').value, k=+$('#xeK').value;
    $('#xeKv').textContent=k.toFixed(1);
    const xmax = a>1 ? Math.max(6, Math.log(10)/Math.log(a)*1.2) : 6;
    const ymax = 11;
    const X=x=>P+(W-P-16)*x/xmax, Y=y=>H-P-(H-2*P)*y/ymax;
    ctx.clearRect(0,0,W,H); ctx.fillStyle='#fff'; ctx.fillRect(0,0,W,H);
    ctx.strokeStyle='#F1F3F6';
    for(let y=0;y<=10;y+=2){ ctx.beginPath(); ctx.moveTo(P,Y(y)); ctx.lineTo(W-16,Y(y)); ctx.stroke();
      ctx.fillStyle='#9CA3AF'; ctx.font='9.5px sans-serif'; ctx.textAlign='right'; ctx.fillText(y,P-6,Y(y)+3); }
    const sol = Math.log(k)/Math.log(a);
    // 부등식 영역
    if(S.mode!=='eq' && sol>0 && sol<xmax){
      ctx.fillStyle='rgba(14,147,132,.14)';
      if(a>1) ctx.fillRect(X(sol), P-10, X(xmax)-X(sol), H-P-(P-10));
      else ctx.fillRect(P, P-10, X(sol)-P, H-P-(P-10));
    }
    ctx.strokeStyle='#2563EB'; ctx.lineWidth=2.4; ctx.beginPath();
    for(let x=0;x<=xmax;x+=xmax/200){ const y=Math.pow(a,x); if(y>ymax) break;
      const px=X(x), py=Y(y); x===0?ctx.moveTo(px,py):ctx.lineTo(px,py); }
    ctx.stroke();
    ctx.strokeStyle='#BE123C'; ctx.setLineDash([5,4]); ctx.lineWidth=1.8;
    ctx.beginPath(); ctx.moveTo(P,Y(k)); ctx.lineTo(W-16,Y(k)); ctx.stroke(); ctx.setLineDash([]);
    if(sol>0 && sol<xmax){ ctx.fillStyle='#111827';
      ctx.beginPath(); ctx.arc(X(sol),Y(k),5.5,0,7); ctx.fill();
      ctx.font='bold 11px sans-serif'; ctx.textAlign='center';
      ctx.fillText('x = '+sol.toFixed(2), X(sol), Y(k)-12); }
    ctx.strokeStyle='#9CA3AF'; ctx.lineWidth=1.2;
    ctx.beginPath(); ctx.moveTo(P,H-P); ctx.lineTo(W-16,H-P); ctx.stroke();
    ctx.fillStyle='#6B7280'; ctx.font='10px sans-serif'; ctx.textAlign='left'; ctx.fillText('x →',P,H-P+16);
    const flip = a<1;
    $('#xeout').innerHTML =
      `<span class="mono">${a}<sup>x</sup> ${S.mode==='eq'?'=':'>'} ${k.toFixed(1)}</span><br>`
      + `<span class="mono">x = log<sub>${a}</sub> ${k.toFixed(1)} = log ${k.toFixed(1)} ÷ log ${a} = <b>${sol.toFixed(3)}</b></span><br>`
      + (S.mode==='eq'
          ? `<b style="color:#2563EB">방정식의 해 x = ${sol.toFixed(3)}</b><br>`
          : (flip ? `<b style="color:#BE123C">밑이 1보다 작아 부등호가 뒤집힙니다 — 해는 x &lt; ${sol.toFixed(3)}</b><br>`
                  : `<b style="color:#0E9384">부등식의 해 x &gt; ${sol.toFixed(3)}</b><br>`))
      + (Math.abs(a-1.06)<1e-9 && Math.abs(k-3)<0.051
          ? `<b style="color:#B45309">원금이 세 배 되는 해 — 약 ${Math.ceil(sol)}년째</b><br>` : '')
      + `<span style="color:#6B7280;font-size:12.5px">지수 자리의 x 는 로그로만 내려옵니다. 밑이 1보다 작을 때를 꼭 확인하세요.</span>`;
  }
  $('#xeA').onchange=draw; $('#xeK').oninput=draw;
  $('#xeEq').onclick=()=>{ S.mode='eq'; draw(); };
  $('#xeGt').onclick=()=>{ S.mode='gt'; draw(); };
  draw();
  inquiry(root,{ id:'xe', title:'지수방정식·부등식 — 지수에 갇힌 x 꺼내기',
    q:['밑과 k 를 바꿔 가며 (a, k, 해 x) 를 여섯 줄 기록하세요.',
       '밑이 1보다 클 때와 작을 때 부등식의 해가 어떻게 달라지는지 확인하세요.',
       'a^x = k 의 해가 x = log k / log a 인 이유를 로그의 정의로 손으로 설명하세요.'],
    cols:['밑 a','k','해 x','부등식의 해'],
    hint:'힌트 — 지수함수는 밑이 1보다 크면 증가, 작으면 감소합니다. 감소하면 대소 관계가 뒤집힙니다.',
    read:()=>{ const a=+$('#xeA').value, k=+$('#xeK').value, s=Math.log(k)/Math.log(a);
      return [a, k.toFixed(1), s.toFixed(3), (a<1?'x < ':'x > ')+s.toFixed(2)]; } });
}

/* ---------- LAB 113 로그의 밑 변환 — 계산기에 없는 밑 ---------- */
function logBaseDemo(root){
  root.innerHTML=`<div class="row"><div class="col">
      <canvas id="lb1" width="380" height="280"></canvas>
      <div class="note" style="margin-top:8px">막대 세 개는 log b, log a, 그리고 그 <b>몫</b>입니다.
      계산기에 상용로그(밑 10)밖에 없어도 어떤 밑이든 구할 수 있습니다.</div>
    </div>
    <div class="col">
      <label class="ctl">밑 a<select id="lbA" style="width:100%;padding:7px 9px;border:1px solid #E5E7EB;border-radius:8px;font:inherit">
        <option value="2">a = 2</option><option value="3">a = 3</option>
        <option value="5" selected>a = 5</option><option value="7">a = 7</option></select></label>
      ${slider('lbB','진수 b',2,1000,1,50,'')}
      <div class="ctl" style="display:flex;gap:6px;flex-wrap:wrap;margin-top:8px">
        <button class="b g sm" id="lbChk">거듭제곱으로 검산</button>
        <button class="b g sm" id="lbSame">밑 = 진수로 맞추기</button>
      </div>
      <div class="out" id="lbout"></div>
      <div class="note" style="margin-top:12px">밑 변환은 <b>같은 자를 두 번 쓰는 일</b>입니다 —
      분자와 분모를 같은 밑으로 재면 원래 밑이 무엇이든 답이 나옵니다.</div>
    </div></div>`;
  const cv=$('#lb1'),ctx=cv.getContext('2d'),W=380,H=280;
  const S={ chk:false };
  function draw(){
    const a=+$('#lbA').value, b=+$('#lbB').value;
    $('#lbBv').textContent=b;
    const lb=Math.log10(b), la=Math.log10(a), v=lb/la;
    ctx.clearRect(0,0,W,H); ctx.fillStyle='#fff'; ctx.fillRect(0,0,W,H);
    const bar=(y,len,col,lab,val)=>{
      ctx.fillStyle=col; ctx.globalAlpha=.28; ctx.fillRect(40,y,len,26); ctx.globalAlpha=1;
      ctx.strokeStyle=col; ctx.lineWidth=1.6; ctx.strokeRect(40,y,len,26);
      ctx.fillStyle='#111827'; ctx.font='bold 11.5px sans-serif'; ctx.textAlign='left';
      ctx.fillText(lab, 44, y-6);
      ctx.textAlign='left'; ctx.fillText(val, 46+len, y+18);
    };
    const sc=90;
    bar(50, Math.max(4,lb*sc), '#2563EB', 'log b (계산기로 잰 값)', lb.toFixed(4));
    bar(120, Math.max(4,la*sc), '#0E9384', 'log a', la.toFixed(4));
    bar(196, Math.max(4,v*sc*0.6), '#BE123C', '몫 = log b ÷ log a', v.toFixed(4));
    ctx.fillStyle='#6B7280'; ctx.font='11px sans-serif'; ctx.textAlign='left';
    ctx.fillText('두 막대의 비가 곧 답입니다', 40, 258);
    const back = Math.pow(a, v);
    $('#lbout').innerHTML =
      `<span class="mono">log<sub>${a}</sub> ${b} = log ${b} ÷ log ${a} = ${lb.toFixed(4)} ÷ ${la.toFixed(4)} = <b>${v.toFixed(4)}</b></span><br>`
      + (Math.abs(a-2)<1e-9 && b===100 ? `<b style="color:#B45309">오늘의 문제 — log₂ 100 = ${v.toFixed(3)}</b><br>` : '')
      + (S.chk ? `검산: ${a}<sup>${v.toFixed(4)}</sup> = <b>${back.toFixed(2)}</b> — ${Math.abs(back-b)<0.05?'<b style="color:#0E9384">진수와 일치! 밑 변환 성공</b>':'차이 '+Math.abs(back-b).toFixed(2)}<br>` : '')
      + (a===b ? `<b style="color:#7C3AED">밑과 진수가 같으면 값은 1 — 자기 자신을 자기 자로 재면 1입니다.</b><br>` : '')
      + `<span style="color:#6B7280;font-size:12.5px">밑을 10 으로 바꿔도, e 로 바꿔도 몫은 같습니다 — 그것이 밑 변환의 힘입니다.</span>`;
  }
  $('#lbA').onchange=()=>{ S.chk=false; draw(); };
  $('#lbB').oninput=()=>{ S.chk=false; draw(); };
  $('#lbChk').onclick=()=>{ S.chk=true; draw(); };
  $('#lbSame').onclick=()=>{ $('#lbB').value=+$('#lbA').value; S.chk=false; draw(); };
  draw();
  inquiry(root,{ id:'lb', title:'로그의 밑 변환 — 어떤 밑이든 상용로그로',
    q:['(a, b, log_a b) 를 여섯 줄 기록하고, 매번 거듭제곱 검산도 함께 하세요.',
       '밑과 진수가 같을 때, 진수가 1일 때 값이 무엇이 되는지 확인하세요.',
       'log_a b = log b / log a 를 로그의 정의(a^x = b)에서 손으로 유도하세요.'],
    cols:['밑 a','진수 b','log b','log a','log_a b'],
    hint:'힌트 — a^x = b 의 양변에 상용로그를 취하면 x·log a = log b 가 됩니다.',
    read:()=>{ const a=+$('#lbA').value, b=+$('#lbB').value;
      return [a, b, Math.log10(b).toFixed(4), Math.log10(a).toFixed(4), (Math.log10(b)/Math.log10(a)).toFixed(4)]; } });
}

/* ---------- LAB 114 지수와 로그는 짝 — y = x 대칭 ---------- */
function expLogDemo(root){
  root.innerHTML=`<div class="row"><div class="col">
      <canvas id="el1" width="380" height="330"></canvas>
      <div class="note" style="margin-top:8px">파란 곡선 y = a<sup>x</sup>, 초록 곡선 y = log<sub>a</sub> x.
      점 P 를 끌어 두 곡선의 <b>짝점</b>을 추적하세요.</div>
    </div>
    <div class="col">
      <label class="ctl">밑 a<select id="elA" style="width:100%;padding:7px 9px;border:1px solid #E5E7EB;border-radius:8px;font:inherit">
        <option value="2" selected>a = 2</option><option value="3">a = 3</option>
        <option value="0.5">a = 0.5</option></select></label>
      ${slider('elX','대응점 x',-3,5,0.5,1,'')}
      <div class="out" id="elout"></div>
      <div class="note" style="margin-top:12px">지수함수의 <b>치역</b>(y &gt; 0)이 로그함수의 <b>정의역</b>이 됩니다 —
      역함수는 정의역과 치역을 맞바꿉니다.</div>
    </div></div>`;
  const cv=$('#el1'),ctx=cv.getContext('2d'),W=380,H=330;
  const O={x:120,y:210}, U=34;
  function draw(){
    const a=+$('#elA').value, x=+$('#elX').value;
    $('#elXv').textContent=x.toFixed(1);
    const X=v=>O.x+v*U, Y=v=>O.y-v*U;
    ctx.clearRect(0,0,W,H); ctx.fillStyle='#fff'; ctx.fillRect(0,0,W,H);
    ctx.strokeStyle='#EEF1F5';
    for(let v=-3;v<=7;v++){ ctx.beginPath(); ctx.moveTo(X(v),0); ctx.lineTo(X(v),H); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0,Y(v)); ctx.lineTo(W,Y(v)); ctx.stroke(); }
    ctx.strokeStyle='#9CA3AF'; ctx.lineWidth=1.3;
    ctx.beginPath(); ctx.moveTo(0,Y(0)); ctx.lineTo(W,Y(0)); ctx.moveTo(X(0),0); ctx.lineTo(X(0),H); ctx.stroke();
    ctx.strokeStyle='#B45309'; ctx.setLineDash([5,3]); ctx.lineWidth=1.6;
    ctx.beginPath(); ctx.moveTo(X(-3),Y(-3)); ctx.lineTo(X(7),Y(7)); ctx.stroke(); ctx.setLineDash([]);
    ctx.strokeStyle='#2563EB'; ctx.lineWidth=2.4; ctx.beginPath();
    for(let v=-3;v<=6;v+=0.05){ const y=Math.pow(a,v); if(y>7) break; const px=X(v),py=Y(y);
      v===-3?ctx.moveTo(px,py):ctx.lineTo(px,py); } ctx.stroke();
    ctx.strokeStyle='#0E9384'; ctx.lineWidth=2.4; ctx.beginPath();
    let started=false;
    for(let v=0.02;v<=7;v+=0.03){ const y=Math.log(v)/Math.log(a); if(y< -3||y>7) { started=false; continue; }
      const px=X(v),py=Y(y); started?ctx.lineTo(px,py):ctx.moveTo(px,py); started=true; } ctx.stroke();
    const fx=Math.pow(a,x);
    if(fx<=7){
      ctx.strokeStyle='#BE123C'; ctx.setLineDash([3,3]); ctx.lineWidth=1.4;
      ctx.beginPath(); ctx.moveTo(X(x),Y(fx)); ctx.lineTo(X(fx),Y(x)); ctx.stroke(); ctx.setLineDash([]);
      [[x,fx,'#2563EB'],[fx,x,'#0E9384']].forEach(([px,py,col])=>{
        ctx.fillStyle=col; ctx.beginPath(); ctx.arc(X(px),Y(py),5,0,7); ctx.fill();
        ctx.fillStyle='#111827'; ctx.font='bold 10.5px sans-serif'; ctx.textAlign='center';
        ctx.fillText('('+px.toFixed(1)+', '+py.toFixed(1)+')', X(px), Y(py)-9); });
    }
    $('#elout').innerHTML =
      `<span class="mono">y = ${a}<sup>x</sup> ↔ y = log<sub>${a}</sub> x</span><br>`
      + (fx<=7
          ? `대응점: 지수 위 <b style="color:#2563EB">(${x.toFixed(1)}, ${fx.toFixed(2)})</b>`
            + ` ↔ 로그 위 <b style="color:#0E9384">(${fx.toFixed(2)}, ${x.toFixed(1)})</b><br>`
            + `<b style="color:#B45309">좌표를 맞바꾼 자리 — 두 곡선은 y = x 대칭입니다.</b><br>`
          : `<span style="color:#BE123C">값이 화면 밖입니다 — x 를 줄여 보세요.</span><br>`)
      + `지수함수 정의역 <b>모든 실수</b> · 치역 <b>y &gt; 0</b> &nbsp;→&nbsp; 로그함수 정의역 <b>x &gt; 0</b> · 치역 <b>모든 실수</b><br>`
      + (a<1 ? `<b style="color:#7C3AED">밑이 1보다 작아 둘 다 감소합니다 — 짝은 그대로입니다.</b><br>` : '')
      + `<span style="color:#6B7280;font-size:12.5px">로그에 음수나 0 을 넣을 수 없는 이유가 지수함수의 치역에 있습니다.</span>`;
  }
  $('#elA').onchange=draw; $('#elX').oninput=draw; draw();
  inquiry(root,{ id:'el', title:'지수와 로그 — 좌표를 맞바꾼 짝',
    q:['x 를 바꿔 가며 (지수 위의 점, 로그 위의 점) 짝을 여섯 줄 기록하세요.',
       '두 함수의 정의역·치역을 표로 적고 무엇이 맞바뀌는지 확인하세요.',
       'log_a x 에 0 이나 음수를 넣을 수 없는 이유를 지수함수의 치역으로 손으로 설명하세요.'],
    cols:['x','a^x','로그 위의 점','대칭축'],
    hint:'힌트 — (p, q) 가 지수 위의 점이면 (q, p) 는 로그 위의 점입니다. 두 점의 중점은 y = x 위에 있습니다.',
    read:()=>{ const a=+$('#elA').value, x=+$('#elX').value, f=Math.pow(a,x);
      return [x.toFixed(1), f.toFixed(2), '('+f.toFixed(2)+', '+x.toFixed(1)+')', 'y = x']; } });
}

/* ---------- LAB 115 상용로그의 지표와 가수 — 2^100 은 몇 자리? ---------- */
function log10Demo(root){
  root.innerHTML=`<div class="row"><div class="col">
      <canvas id="lg2" width="380" height="270"></canvas>
      <div class="note" style="margin-top:8px">막대는 log₁₀(수) 입니다. <b>정수 부분(지표)</b>이 자릿수를,
      <b>소수 부분(가수)</b>이 첫 자리 숫자를 쥐고 있습니다.</div>
    </div>
    <div class="col">
      <label class="ctl">밑<select id="lgB" style="width:100%;padding:7px 9px;border:1px solid #E5E7EB;border-radius:8px;font:inherit">
        <option value="2" selected>2 의 거듭제곱</option>
        <option value="3">3 의 거듭제곱</option>
        <option value="7">7 의 거듭제곱</option></select></label>
      ${slider('lgN','지수 n',1,200,1,10,'')}
      <div class="out" id="lg2out"></div>
      <div class="note" style="margin-top:12px">계산기가 넘치는 큰 수도 <b>자릿수와 첫 자리</b>는 로그로 알 수 있습니다.</div>
    </div></div>`;
  const cv=$('#lg2'),ctx=cv.getContext('2d'),W=380,H=270;
  function draw(){
    const b=+$('#lgB').value, n=+$('#lgN').value;
    $('#lgNv').textContent=n;
    const L=n*Math.log10(b), ji=Math.floor(L), ga=L-ji;
    const digits=ji+1, first=Math.floor(Math.pow(10,ga));
    ctx.clearRect(0,0,W,H); ctx.fillStyle='#fff'; ctx.fillRect(0,0,W,H);
    const x0=40, wpx=(W-70)/70;
    ctx.fillStyle='rgba(37,99,235,.30)'; ctx.fillRect(x0, 70, Math.min(W-60, ji*wpx), 34);
    ctx.strokeStyle='#2563EB'; ctx.strokeRect(x0, 70, Math.min(W-60, ji*wpx), 34);
    ctx.fillStyle='rgba(190,18,60,.35)';
    ctx.fillRect(x0+Math.min(W-60,ji*wpx), 70, Math.max(3,ga*wpx*6), 34);
    ctx.fillStyle='#111827'; ctx.font='bold 12px sans-serif'; ctx.textAlign='left';
    ctx.fillText('지표(정수부) = '+ji, x0, 60);
    ctx.fillStyle='#BE123C'; ctx.fillText('가수(소수부) = '+ga.toFixed(4), x0, 128);
    ctx.fillStyle='#374151'; ctx.font='13px sans-serif';
    ctx.fillText('log₁₀ ('+b+'^'+n+') = '+L.toFixed(4), x0, 170);
    ctx.fillStyle='#0E9384'; ctx.font='bold 15px sans-serif';
    ctx.fillText('→ '+digits+'자리 수', x0, 200);
    ctx.fillStyle='#7C3AED'; ctx.font='bold 13px sans-serif';
    ctx.fillText('→ 최고 자리 숫자 '+first, x0, 226);
    $('#lg2out').innerHTML =
      `<span class="mono">log₁₀ ${b}<sup>${n}</sup> = ${n} × log ${b} = <b>${L.toFixed(4)}</b></span><br>`
      + `지표 <b>${ji}</b> · 가수 <b>${ga.toFixed(4)}</b><br>`
      + `<b style="color:#0E9384">자릿수 = 지표 + 1 = ${digits}자리</b> · 최고 자리 숫자 <b>${first}</b><br>`
      + (b===2 && n===100 ? `<b style="color:#B45309">오늘의 문제 — 2¹⁰⁰ 은 ${digits}자리 수입니다.</b><br>` : '')
      + `<span style="color:#6B7280;font-size:12.5px">가수만 있으면 첫 자리 숫자를 알 수 있습니다 — 벤포드 법칙의 뿌리입니다.</span>`;
  }
  $('#lgB').onchange=draw; $('#lgN').oninput=draw; draw();
  inquiry(root,{ id:'lg2', title:'상용로그 — 자릿수와 첫 자리의 비밀',
    q:['(밑, 지수, log 값, 지표, 가수, 자릿수) 를 여섯 줄 기록하세요.',
       '지수를 2배로 하면 자릿수는 어떻게 변하는지 확인하세요.',
       '자릿수 = 지표 + 1 인 이유를 10^지표 ≤ 수 < 10^(지표+1) 로 손으로 설명하세요.'],
    cols:['수','log 값','지표','가수','자릿수','첫 자리'],
    hint:'힌트 — 어떤 수 N 의 자릿수는 10 의 몇 제곱과 몇 제곱 사이에 있는지가 정합니다.',
    read:()=>{ const b=+$('#lgB').value, n=+$('#lgN').value, L=n*Math.log10(b), ji=Math.floor(L);
      return [b+'^'+n, L.toFixed(4), ji, (L-ji).toFixed(4), ji+1, Math.floor(Math.pow(10,L-ji))]; } });
}

/* ---------- LAB 116 지수함수의 변신 — 밑·평행이동·점근선 ---------- */
function expMoveDemo(root){
  root.innerHTML=`<div class="row"><div class="col">
      <canvas id="em1" width="380" height="310"></canvas>
      <div class="note" style="margin-top:8px">회색 곡선은 기준 y = 2<sup>x</sup>, 파란 곡선이 지금 식입니다.
      <b>붉은 점선</b>은 점근선입니다.</div>
    </div>
    <div class="col">
      ${slider('emA','밑 a',0.2,5,0.1,2,'')}
      ${slider('emP','가로 이동 p',-3,3,0.5,0,'')}
      ${slider('emQ','세로 이동 q',-2,4,0.5,0,'')}
      <div class="out" id="emout"></div>
      <div class="note" style="margin-top:12px">밑이 1보다 크면 증가, 작으면 감소합니다.
      세로 이동 q 는 <b>점근선</b>을 통째로 들어 올립니다.</div>
    </div></div>`;
  const cv=$('#em1'),ctx=cv.getContext('2d'),W=380,H=310;
  const O={x:150,y:230}, U=34;
  function draw(){
    const a=+$('#emA').value, p=+$('#emP').value, q=+$('#emQ').value;
    $('#emAv').textContent=a.toFixed(1); $('#emPv').textContent=p.toFixed(1); $('#emQv').textContent=q.toFixed(1);
    const X=v=>O.x+v*U, Y=v=>O.y-v*U;
    ctx.clearRect(0,0,W,H); ctx.fillStyle='#fff'; ctx.fillRect(0,0,W,H);
    ctx.strokeStyle='#EEF1F5';
    for(let v=-4;v<=6;v++){ ctx.beginPath(); ctx.moveTo(X(v),0); ctx.lineTo(X(v),H); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0,Y(v)); ctx.lineTo(W,Y(v)); ctx.stroke(); }
    ctx.strokeStyle='#9CA3AF'; ctx.lineWidth=1.3;
    ctx.beginPath(); ctx.moveTo(0,Y(0)); ctx.lineTo(W,Y(0)); ctx.moveTo(X(0),0); ctx.lineTo(X(0),H); ctx.stroke();
    ctx.strokeStyle='#D1D5DB'; ctx.lineWidth=1.6; ctx.beginPath();
    for(let v=-4;v<=6;v+=0.05){ const y=Math.pow(2,v); if(y>6) break; const px=X(v),py=Y(y);
      v===-4?ctx.moveTo(px,py):ctx.lineTo(px,py); } ctx.stroke();
    ctx.strokeStyle='#BE123C'; ctx.setLineDash([5,4]); ctx.lineWidth=1.6;
    ctx.beginPath(); ctx.moveTo(0,Y(q)); ctx.lineTo(W,Y(q)); ctx.stroke(); ctx.setLineDash([]);
    ctx.strokeStyle='#2563EB'; ctx.lineWidth=2.6; ctx.beginPath();
    let on=false;
    for(let v=-4;v<=6;v+=0.04){ const y=Math.pow(a,v-p)+q; if(y>6.2||y<-3){ on=false; continue; }
      const px=X(v),py=Y(y); on?ctx.lineTo(px,py):ctx.moveTo(px,py); on=true; } ctx.stroke();
    ctx.fillStyle='#BE123C'; ctx.font='bold 11px sans-serif'; ctx.textAlign='left';
    ctx.fillText('점근선 y = '+q.toFixed(1), 10, Y(q)-6);
    const inc = a>1;
    $('#emout').innerHTML =
      `<span class="mono">y = ${a.toFixed(1)}<sup>(x ${p>=0?'− '+p.toFixed(1):'+ '+(-p).toFixed(1)})</sup> ${q>=0?'+ '+q.toFixed(1):'− '+(-q).toFixed(1)}</span><br>`
      + `<b style="color:${inc?'#2563EB':'#BE123C'}">${inc?'증가함수 — 밑이 1보다 큽니다':'감소함수 — 밑이 1보다 작습니다'}</b><br>`
      + `점근선 <b>y = ${q.toFixed(1)}</b> · y절편 <b>${(Math.pow(a,-p)+q).toFixed(2)}</b><br>`
      + (Math.abs(q-2)<0.01 ? `<b style="color:#7C3AED">점근선이 y = 2 로 올라갔습니다 — 아무리 작아져도 2 아래로는 못 내려갑니다.</b><br>` : '')
      + `<span style="color:#6B7280;font-size:12.5px">가로 이동은 괄호 안에서 부호가 반대로 보입니다 — 왜 그런지 대입해 확인하세요.</span>`;
  }
  ['emA','emP','emQ'].forEach(i=>$('#'+i).oninput=draw); draw();
  inquiry(root,{ id:'em', title:'지수함수의 변신 — 밑·이동·점근선',
    q:['a·p·q 를 하나씩만 움직이며 그래프가 어떻게 변하는지 여섯 줄 기록하세요.',
       '밑이 1보다 작을 때와 클 때의 증가·감소를 확인하고, 두 그래프가 y축 대칭인 짝(a 와 1/a)도 찾으세요.',
       '가로 이동에서 괄호 안 부호가 반대로 보이는 이유를 대입으로 손으로 설명하세요.'],
    cols:['밑 a','p','q','증가/감소','점근선','y절편'],
    hint:'힌트 — y = a^(x−p) + q 는 기준 곡선을 오른쪽 p, 위로 q 만큼 민 것입니다.',
    read:()=>{ const a=+$('#emA').value, p=+$('#emP').value, q=+$('#emQ').value;
      return [a.toFixed(1), p.toFixed(1), q.toFixed(1), a>1?'증가':'감소', 'y = '+q.toFixed(1), (Math.pow(a,-p)+q).toFixed(2)]; } });
}



/* ---------- LAB 117 주기·진폭·위상 따로 움직이기 ---------- */
function trigParamDemo(root){
  root.innerHTML=`<div class="row"><div class="col">
      <canvas id="tp1" width="380" height="300"></canvas>
      <div class="note" style="margin-top:8px">회색은 기준 y = sin x, 파랑이 지금 식입니다.
      한 번에 <b>하나씩만</b> 움직여 보세요.</div>
    </div>
    <div class="col">
      ${slider('tpA','진폭 a',0.5,3,0.1,1,'')}
      ${slider('tpB','주기 계수 b',0.5,4,0.5,1,'')}
      ${slider('tpC','위상 c (오른쪽으로)',0,6.5,0.25,0,'')}
      ${slider('tpD','세로 이동 d',-2,2,0.5,0,'')}
      <div class="out" id="tpout"></div>
      <div class="note" style="margin-top:12px">주기 = 2π ÷ b · 최댓값 = d + a · 최솟값 = d − a.
      계수마다 담당이 다릅니다.</div>
    </div></div>`;
  const cv=$('#tp1'),ctx=cv.getContext('2d'),W=380,H=300,P=34;
  function draw(){
    const a=+$('#tpA').value, b=+$('#tpB').value, c=+$('#tpC').value, d=+$('#tpD').value;
    $('#tpAv').textContent=a.toFixed(1); $('#tpBv').textContent=b.toFixed(1);
    $('#tpCv').textContent=c.toFixed(2); $('#tpDv').textContent=d.toFixed(1);
    const XM=4*Math.PI, YM=5;
    const X=x=>P+(W-P-14)*x/XM, Y=y=>H/2-(H/2-P)*y/YM;
    ctx.clearRect(0,0,W,H); ctx.fillStyle='#fff'; ctx.fillRect(0,0,W,H);
    ctx.strokeStyle='#F1F3F6';
    for(let y=-4;y<=4;y+=2){ ctx.beginPath(); ctx.moveTo(P,Y(y)); ctx.lineTo(W-14,Y(y)); ctx.stroke(); }
    ctx.strokeStyle='#9CA3AF'; ctx.lineWidth=1.2;
    ctx.beginPath(); ctx.moveTo(P,Y(0)); ctx.lineTo(W-14,Y(0)); ctx.stroke();
    ctx.strokeStyle='#D1D5DB'; ctx.lineWidth=1.5; ctx.beginPath();
    for(let x=0;x<=XM;x+=0.03){ const px=X(x),py=Y(Math.sin(x)); x===0?ctx.moveTo(px,py):ctx.lineTo(px,py); } ctx.stroke();
    ctx.strokeStyle='#2563EB'; ctx.lineWidth=2.5; ctx.beginPath();
    for(let x=0;x<=XM;x+=0.02){ const px=X(x),py=Y(d+a*Math.sin(b*(x-c))); x===0?ctx.moveTo(px,py):ctx.lineTo(px,py); } ctx.stroke();
    // 최대·최소 선
    ctx.strokeStyle='#BE123C'; ctx.setLineDash([4,3]); ctx.lineWidth=1.2;
    [d+a, d-a].forEach(v=>{ ctx.beginPath(); ctx.moveTo(P,Y(v)); ctx.lineTo(W-14,Y(v)); ctx.stroke(); });
    ctx.setLineDash([]);
    const per=2*Math.PI/b;
    $('#tpout').innerHTML =
      `<span class="mono">y = ${d.toFixed(1)} + ${a.toFixed(1)} sin( ${b.toFixed(1)}(x − ${c.toFixed(2)}) )</span><br>`
      + `주기 = 2π ÷ ${b.toFixed(1)} = <b>${per.toFixed(2)}</b> · 최댓값 <b>${(d+a).toFixed(1)}</b> · 최솟값 <b>${(d-a).toFixed(1)}</b><br>`
      + (Math.abs(b-2)<0.01 ? `<b style="color:#0E9384">주기가 절반(π)이 되었습니다 — b 가 커지면 물결이 촘촘해집니다.</b><br>` : '')
      + (Math.abs(a-2.5)<0.051 ? `<b style="color:#2563EB">진폭 2.5 — 위아래로 5 만큼 출렁입니다.</b><br>` : '')
      + (c>0.01 ? `<b style="color:#B45309">위상 이동 ${c.toFixed(2)} — 모양은 그대로, 오른쪽으로 밀렸습니다.</b><br>` : '')
      + `<span style="color:#6B7280;font-size:12.5px">셋을 한꺼번에 움직이면 무엇이 무엇을 바꿨는지 알 수 없습니다 — 하나씩!</span>`;
  }
  ['tpA','tpB','tpC','tpD'].forEach(i=>$('#'+i).oninput=draw); draw();
  inquiry(root,{ id:'tp', title:'주기·진폭·위상 — 계수의 담당 구역',
    q:['a·b·c·d 를 하나씩만 움직이며 (무엇을 움직였나, 그래프의 변화) 를 여덟 줄 기록하세요.',
       '주기와 b 의 관계를 표로 만들고 규칙(주기 = 2π/b)을 찾으세요.',
       '「진폭이 커지면 주기도 변하는가」를 실험으로 판정하고, 계수들이 서로 침범하지 않는 이유를 설명하세요.'],
    cols:['a','b','c','d','주기','최댓값','최솟값'],
    hint:'힌트 — b 는 x 에 곱해져 「시간을 빠르게」, a 는 y 에 곱해져 「크기를 키우게」 합니다.',
    read:()=>{ const a=+$('#tpA').value,b=+$('#tpB').value,c=+$('#tpC').value,d=+$('#tpD').value;
      return [a.toFixed(1),b.toFixed(1),c.toFixed(2),d.toFixed(1),(2*Math.PI/b).toFixed(2),(d+a).toFixed(1),(d-a).toFixed(1)]; } });
}

/* ---------- LAB 118 삼각방정식 — 해가 무한히 많은 이유 ---------- */
function trigEqDemo(root){
  root.innerHTML=`<div class="row"><div class="col">
      <canvas id="te1" width="380" height="300"></canvas>
      <div class="note" style="margin-top:8px">위는 단위원, 아래는 sin 곡선입니다.
      가로선 y = k 와 만나는 자리가 모두 해입니다.</div>
    </div>
    <div class="col">
      ${slider('teK','k (오른쪽 값)',-1,1,0.05,0.3,'')}
      <div class="ctl" style="display:flex;gap:6px;flex-wrap:wrap;margin-top:8px">
        <button class="b g sm" id="teHalf">k = 0.5</button>
        <button class="b g sm" id="teOne">k = 1</button>
        <button class="b g sm" id="teBig">k = 1 초과 시도</button>
      </div>
      <div class="out" id="teout"></div>
      <div class="note" style="margin-top:12px">삼각함수는 주기 함수라 해가 <b>2π 마다 반복</b>됩니다.
      한 바퀴 안의 해를 먼저 찾고, 거기에 2nπ 를 더하면 전부입니다.</div>
    </div></div>`;
  const cv=$('#te1'),ctx=cv.getContext('2d'),W=380,H=300;
  const S={ over:false };
  function draw(){
    const k=S.over ? 1.4 : +$('#teK').value;
    $('#teKv').textContent=(+$('#teK').value).toFixed(2);
    ctx.clearRect(0,0,W,H); ctx.fillStyle='#fff'; ctx.fillRect(0,0,W,H);
    // 단위원
    const C={x:62,y:70}, R=46;
    ctx.strokeStyle='#9CA3AF'; ctx.lineWidth=1.3;
    ctx.beginPath(); ctx.arc(C.x,C.y,R,0,7); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(C.x-R-8,C.y); ctx.lineTo(C.x+R+8,C.y); ctx.stroke();
    ctx.strokeStyle='#BE123C'; ctx.setLineDash([3,3]);
    ctx.beginPath(); ctx.moveTo(C.x-R-8,C.y-R*k); ctx.lineTo(C.x+R+8,C.y-R*k); ctx.stroke(); ctx.setLineDash([]);
    const sols=[];
    if(Math.abs(k)<=1){
      const a1=Math.asin(k), a2=Math.PI-a1;
      [a1,a2].forEach(t=>{ const tt=(t+2*Math.PI)%(2*Math.PI); sols.push(tt);
        ctx.fillStyle='#2563EB'; ctx.beginPath(); ctx.arc(C.x+R*Math.cos(tt),C.y-R*Math.sin(tt),4.5,0,7); ctx.fill(); });
    }
    // sin 곡선
    const P=32, top=140, bot=H-30, XM=4*Math.PI;
    const X=x=>P+(W-P-14)*x/XM, Y=y=>(top+bot)/2-(bot-top)/2*y*0.9;
    ctx.strokeStyle='#F1F3F6'; ctx.beginPath(); ctx.moveTo(P,Y(0)); ctx.lineTo(W-14,Y(0)); ctx.stroke();
    ctx.strokeStyle='#2563EB'; ctx.lineWidth=2.4; ctx.beginPath();
    for(let x=0;x<=XM;x+=0.02){ const px=X(x),py=Y(Math.sin(x)); x===0?ctx.moveTo(px,py):ctx.lineTo(px,py); } ctx.stroke();
    ctx.strokeStyle='#BE123C'; ctx.setLineDash([5,4]); ctx.lineWidth=1.6;
    ctx.beginPath(); ctx.moveTo(P,Y(k)); ctx.lineTo(W-14,Y(k)); ctx.stroke(); ctx.setLineDash([]);
    let cnt=0;
    if(Math.abs(k)<=1){
      sols.forEach(t0=>{ for(let n=0;n<2;n++){ const x=t0+2*Math.PI*n; if(x<=XM){
        ctx.fillStyle='#BE123C'; ctx.beginPath(); ctx.arc(X(x),Y(k),4.5,0,7); ctx.fill(); cnt++; } } });
    }
    ctx.fillStyle='#6B7280'; ctx.font='10px sans-serif'; ctx.textAlign='center';
    [0,Math.PI,2*Math.PI,3*Math.PI,4*Math.PI].forEach((v,i)=>ctx.fillText(['0','π','2π','3π','4π'][i], X(v), bot+14));
    const deg=t=>(t*180/Math.PI).toFixed(1);
    $('#teout').innerHTML =
      `<span class="mono">sin x = ${k.toFixed(2)}</span><br>`
      + (Math.abs(k)>1
        ? `<b style="color:#BE123C">해가 없습니다 — sin 의 값은 −1 과 1 사이를 벗어날 수 없습니다.</b><br>`
        : Math.abs(Math.abs(k)-1)<1e-9
        ? `<b style="color:#7C3AED">해가 한 바퀴에 하나뿐 — 꼭짓점에서 만났습니다 (x = ${deg(sols[0])}°).</b><br>`
        : `한 바퀴 안의 해: <b>${deg(sols[0])}°</b> 와 <b>${deg(sols[1])}°</b> — <b style="color:#0E9384">화면에 보이는 해 ${cnt}개</b><br>`
          + `<span class="mono">x = ${deg(sols[0])}° + 360°n 또는 ${deg(sols[1])}° + 360°n</span><br>`)
      + `<span style="color:#6B7280;font-size:12.5px">주기 함수의 방정식은 「한 바퀴 안의 해 + 2nπ」로 전부 적습니다.</span>`;
  }
  $('#teK').oninput=()=>{ S.over=false; draw(); };
  $('#teHalf').onclick=()=>{ S.over=false; $('#teK').value=0.5; draw(); };
  $('#teOne').onclick=()=>{ S.over=false; $('#teK').value=1; draw(); };
  $('#teBig').onclick=()=>{ S.over=true; draw(); };
  draw();
  inquiry(root,{ id:'te', title:'삼각방정식 — 해가 무한히 많은 이유',
    q:['k 를 바꿔 가며 (k, 한 바퀴 안의 해, 화면의 해 개수) 를 여섯 줄 기록하세요.',
       'k = 1 일 때와 |k| > 1 일 때 해의 개수가 어떻게 달라지는지 확인하세요.',
       '해를 「+ 360°n」으로 적는 이유를 단위원의 회전으로 손으로 설명하세요.'],
    cols:['k','해 ①','해 ②','한 바퀴 해의 수','일반해'],
    hint:'힌트 — 단위원에서 높이가 k 인 점은 보통 두 곳입니다. 한 바퀴 더 돌면 같은 자리로 돌아옵니다.',
    read:()=>{ const k=+$('#teK').value;
      if(Math.abs(k)>1) return [k.toFixed(2),'없음','없음',0,'해 없음'];
      const a1=Math.asin(k), a2=Math.PI-a1;
      const d=t=>((t*180/Math.PI+360)%360).toFixed(1)+'°';
      return [k.toFixed(2), d(a1), d(a2), Math.abs(Math.abs(k)-1)<1e-9?1:2, '해 + 360°n']; } });
}

/* ---------- LAB 119 삼각함수의 합성 — a sin x + b cos x ---------- */
function trigSumDemo(root){
  root.innerHTML=`<div class="row"><div class="col">
      <canvas id="ts1" width="380" height="300"></canvas>
      <div class="note" style="margin-top:8px">보라 곡선 a sin x, 초록 곡선 b cos x,
      <b>파란 곡선</b>이 둘의 합입니다. 합도 사인 곡선인가요?</div>
    </div>
    <div class="col">
      ${slider('tsA','a (sin 계수)',-4,4,0.5,2,'')}
      ${slider('tsB','b (cos 계수)',-4,4,0.5,1,'')}
      <div class="ctl" style="display:flex;gap:6px;flex-wrap:wrap;margin-top:8px">
        <button class="b g sm" id="tsFit">합성 곡선 겹쳐 보기</button>
      </div>
      <div class="out" id="tsout"></div>
      <div class="note" style="margin-top:12px">두 파동을 더해도 <b>같은 주기의 사인 곡선</b>이 됩니다.
      진폭은 √(a²+b²), 위상만 옮겨집니다.</div>
    </div></div>`;
  const cv=$('#ts1'),ctx=cv.getContext('2d'),W=380,H=300,P=32;
  const S={ fit:false };
  function draw(){
    const a=+$('#tsA').value, b=+$('#tsB').value;
    $('#tsAv').textContent=a.toFixed(1); $('#tsBv').textContent=b.toFixed(1);
    const R=Math.hypot(a,b), al=Math.atan2(b,a);
    const XM=2*Math.PI, YM=6;
    const X=x=>P+(W-P-14)*x/XM, Y=y=>H/2-(H/2-P)*y/YM;
    ctx.clearRect(0,0,W,H); ctx.fillStyle='#fff'; ctx.fillRect(0,0,W,H);
    ctx.strokeStyle='#F1F3F6';
    for(let y=-4;y<=4;y+=2){ ctx.beginPath(); ctx.moveTo(P,Y(y)); ctx.lineTo(W-14,Y(y)); ctx.stroke(); }
    ctx.strokeStyle='#9CA3AF'; ctx.lineWidth=1.2;
    ctx.beginPath(); ctx.moveTo(P,Y(0)); ctx.lineTo(W-14,Y(0)); ctx.stroke();
    const curve=(f,col,w,dash)=>{ ctx.strokeStyle=col; ctx.lineWidth=w;
      ctx.setLineDash(dash||[]); ctx.beginPath();
      for(let x=0;x<=XM;x+=0.02){ const px=X(x),py=Y(f(x)); x===0?ctx.moveTo(px,py):ctx.lineTo(px,py); }
      ctx.stroke(); ctx.setLineDash([]); };
    curve(x=>a*Math.sin(x), 'rgba(124,58,237,.55)', 1.6);
    curve(x=>b*Math.cos(x), 'rgba(14,147,132,.55)', 1.6);
    curve(x=>a*Math.sin(x)+b*Math.cos(x), '#2563EB', 2.6);
    if(S.fit) curve(x=>R*Math.sin(x+al), '#BE123C', 1.8, [6,4]);
    ctx.strokeStyle='#BE123C'; ctx.setLineDash([3,3]); ctx.lineWidth=1;
    [R,-R].forEach(v=>{ ctx.beginPath(); ctx.moveTo(P,Y(v)); ctx.lineTo(W-14,Y(v)); ctx.stroke(); });
    ctx.setLineDash([]);
    $('#tsout').innerHTML =
      `<span class="mono">y = ${a.toFixed(1)} sin x + ${b.toFixed(1)} cos x</span><br>`
      + `<span class="mono">= R sin(x + α),&nbsp; R = √(a² + b²) = <b>${R.toFixed(3)}</b>, α = ${(al*180/Math.PI).toFixed(1)}°</span><br>`
      + `최댓값 <b>${R.toFixed(2)}</b> · 최솟값 <b>${(-R).toFixed(2)}</b><br>`
      + (Math.abs(a-3)<0.01 && Math.abs(b-4)<0.01 ? `<b style="color:#B45309">3·4·5 삼각형 등장 — R = 5 입니다.</b><br>` : '')
      + (S.fit ? `<b style="color:#0E9384">합성 곡선이 합과 완전히 겹칩니다 — 두 파동의 합은 하나의 사인 곡선입니다.</b><br>` : '')
      + `<span style="color:#6B7280;font-size:12.5px">a, b 를 바꿔도 주기는 그대로 2π 입니다 — 바뀌는 것은 크기와 위상뿐.</span>`;
  }
  ['tsA','tsB'].forEach(i=>$('#'+i).oninput=()=>{ S.fit=false; draw(); });
  $('#tsFit').onclick=()=>{ S.fit=true; draw(); };
  draw();
  inquiry(root,{ id:'ts', title:'삼각함수의 합성 — 두 파동은 하나의 파동',
    q:['(a, b, R, 최댓값) 을 여섯 줄 기록하세요. a 또는 b 가 0 인 경우도 포함하세요.',
       'R 과 a, b 의 관계를 찾고, 피타고라스 정리와 어떻게 닮았는지 쓰세요.',
       '합성 곡선을 겹쳐 두 곡선이 완전히 같은지 확인하고, 위상 α 가 어디서 오는지 설명하세요.'],
    cols:['a','b','R','α','최댓값'],
    hint:'힌트 — (a, b) 를 좌표로 보면 R 은 원점까지의 거리, α 는 그 점의 방향각입니다.',
    read:()=>{ const a=+$('#tsA').value,b=+$('#tsB').value,R=Math.hypot(a,b);
      return [a.toFixed(1),b.toFixed(1),R.toFixed(3),(Math.atan2(b,a)*180/Math.PI).toFixed(1)+'°',R.toFixed(2)]; } });
}

/* ---------- LAB 120 헤론의 공식 — 세 변만으로 넓이 ---------- */
function heronDemo(root){
  root.innerHTML=`<div class="row"><div class="col">
      <canvas id="hr1" width="380" height="300"></canvas>
      <div class="note" style="margin-top:8px">세 변 길이만 정하면 삼각형이 하나로 정해집니다(SSS).
      그럼 넓이도 정해져야 하지 않을까요?</div>
    </div>
    <div class="col">
      ${slider('hrA','변 a',3,20,1,8,'')}
      ${slider('hrB','변 b',3,20,1,9,'')}
      ${slider('hrC','변 c',3,20,1,10,'')}
      <div class="ctl" style="display:flex;gap:6px;flex-wrap:wrap;margin-top:8px">
        <button class="b g sm" id="hrChk">½ab sin C 로 검산</button>
      </div>
      <div class="out" id="hrout"></div>
      <div class="note" style="margin-top:12px">s = (a+b+c)/2 로 두면
      넓이 = √(s(s−a)(s−b)(s−c)) — 각을 몰라도 넓이가 나옵니다.</div>
    </div></div>`;
  const cv=$('#hr1'),ctx=cv.getContext('2d'),W=380,H=300;
  const S={ chk:false };
  function draw(){
    const a=+$('#hrA').value, b=+$('#hrB').value, c=+$('#hrC').value;
    $('#hrAv').textContent=a; $('#hrBv').textContent=b; $('#hrCv').textContent=c;
    const ok = a+b>c && b+c>a && c+a>b;
    ctx.clearRect(0,0,W,H); ctx.fillStyle='#fff'; ctx.fillRect(0,0,W,H);
    const s=(a+b+c)/2;
    const area = ok ? Math.sqrt(s*(s-a)*(s-b)*(s-c)) : 0;
    if(ok){
      const sc=Math.min(11, 240/Math.max(a,b,c));
      const A={x:70,y:230}, B={x:70+c*sc, y:230};
      const cosA=(b*b+c*c-a*a)/(2*b*c);
      const Cp={x:70+b*sc*cosA, y:230-b*sc*Math.sqrt(Math.max(0,1-cosA*cosA))};
      ctx.fillStyle='rgba(37,99,235,.14)';
      ctx.beginPath(); ctx.moveTo(A.x,A.y); ctx.lineTo(B.x,B.y); ctx.lineTo(Cp.x,Cp.y); ctx.closePath(); ctx.fill();
      ctx.strokeStyle='#2563EB'; ctx.lineWidth=2.2; ctx.stroke();
      ctx.fillStyle='#111827'; ctx.font='bold 11.5px sans-serif'; ctx.textAlign='center';
      ctx.fillText('c = '+c, (A.x+B.x)/2, A.y+18);
      ctx.fillText('b = '+b, (A.x+Cp.x)/2-14, (A.y+Cp.y)/2);
      ctx.fillText('a = '+a, (B.x+Cp.x)/2+16, (B.y+Cp.y)/2);
    } else {
      ctx.fillStyle='#BE123C'; ctx.font='bold 14px sans-serif'; ctx.textAlign='center';
      ctx.fillText('삼각형이 만들어지지 않습니다', W/2, 150);
      ctx.font='12px sans-serif'; ctx.fillStyle='#6B7280';
      ctx.fillText('가장 긴 변이 나머지 두 변의 합보다 짧아야 합니다', W/2, 174);
    }
    const cosC=(a*a+b*b-c*c)/(2*a*b);
    const area2 = ok ? 0.5*a*b*Math.sqrt(Math.max(0,1-cosC*cosC)) : 0;
    $('#hrout').innerHTML =
      `<span class="mono">s = (a+b+c)/2 = ${s.toFixed(1)}</span><br>`
      + (ok
        ? `<span class="mono">넓이 = √(${s.toFixed(1)}×${(s-a).toFixed(1)}×${(s-b).toFixed(1)}×${(s-c).toFixed(1)}) = <b>${area.toFixed(3)}</b></span><br>`
          + (Math.abs(area-84)<0.01 ? `<b style="color:#B45309">13·14·15 삼각형 — 넓이가 정확히 84 입니다.</b><br>` : '')
          + (S.chk ? `½ab sin C = <b>${area2.toFixed(3)}</b> — ${Math.abs(area-area2)<0.01?'<b style="color:#0E9384">헤론과 일치! 검산 성공</b>':'차이 '+Math.abs(area-area2).toFixed(3)}<br>` : '')
        : `<b style="color:#BE123C">삼각부등식 위반 — 넓이를 말할 수 없습니다.</b><br>`)
      + `<span style="color:#6B7280;font-size:12.5px">각을 하나도 재지 않고 넓이를 구했습니다 — 측량에서 대단히 쓸모 있는 성질입니다.</span>`;
  }
  ['hrA','hrB','hrC'].forEach(i=>$('#'+i).oninput=()=>{ S.chk=false; draw(); });
  $('#hrChk').onclick=()=>{ S.chk=true; draw(); };
  draw();
  inquiry(root,{ id:'hr', title:'헤론의 공식 — 각 없이 넓이 구하기',
    q:['세 변을 바꿔 가며 (a, b, c, s, 넓이) 를 여섯 줄 기록하세요. 삼각부등식을 깨는 조합도 넣으세요.',
       '½ab sin C 검산과 헤론의 값이 늘 같은지 확인하세요.',
       '세 변이 정해지면 넓이가 하나로 정해지는 이유를 SSS 합동으로 설명하세요.'],
    cols:['a','b','c','s','헤론 넓이','½ab sinC'],
    hint:'힌트 — 세 변이 같으면 삼각형은 합동입니다. 합동이면 넓이도 같을 수밖에 없습니다.',
    read:()=>{ const a=+$('#hrA').value,b=+$('#hrB').value,c=+$('#hrC').value,s=(a+b+c)/2;
      const ok=a+b>c&&b+c>a&&c+a>b;
      const ar=ok?Math.sqrt(s*(s-a)*(s-b)*(s-c)):0;
      const cosC=(a*a+b*b-c*c)/(2*a*b);
      return [a,b,c,s.toFixed(1), ok?ar.toFixed(3):'없음', ok?(0.5*a*b*Math.sqrt(Math.max(0,1-cosC*cosC))).toFixed(3):'없음']; } });
}

/* ---------- LAB 121 푸리에의 직관 — 소리를 성분으로 쪼개기 ---------- */
function fourierDemo(root){
  root.innerHTML=`<div class="row"><div class="col">
      <canvas id="fr1" width="380" height="180"></canvas>
      <canvas id="fr2" width="380" height="120" style="margin-top:6px"></canvas>
      <div class="note" style="margin-top:8px">위는 만들어진 파형, 아래는 <b>성분 막대</b>(스펙트럼)입니다.
      목표 파형에 얼마나 가까운지 오차로 알려 줍니다.</div>
    </div>
    <div class="col">
      <label class="ctl">목표 파형<select id="frT" style="width:100%;padding:7px 9px;border:1px solid #E5E7EB;border-radius:8px;font:inherit">
        <option value="sq">사각파 (톱니처럼 각진 소리)</option>
        <option value="saw">톱니파</option></select></label>
      ${slider('fr1a','1배음',0,1.4,0.05,0.4,'')}
      ${slider('fr3a','3배음',0,0.8,0.05,0,'')}
      ${slider('fr5a','5배음',0,0.5,0.05,0,'')}
      ${slider('fr7a','7배음',0,0.4,0.05,0,'')}
      <div class="out" id="frout"></div>
      <div class="note" style="margin-top:12px">사각파는 홀수 배음을 1, 1/3, 1/5, 1/7 … 비율로 더하면 만들어집니다.
      어떤 파형이든 사인들의 합으로 쪼갤 수 있다 — 푸리에의 생각입니다.</div>
    </div></div>`;
  const c1=$('#fr1'),x1=c1.getContext('2d'),W=380,H1=180;
  const c2=$('#fr2'),x2=c2.getContext('2d'),H2=120;
  const target=(k,t)=>{
    if(k==='sq') return Math.sign(Math.sin(t)) * 0.9;
    return ((t%(2*Math.PI))/Math.PI - 1) * 0.9;
  };
  function draw(){
    const k=$('#frT').value;
    const A=[+$('#fr1a').value, +$('#fr3a').value, +$('#fr5a').value, +$('#fr7a').value];
    [['fr1a',0],['fr3a',1],['fr5a',2],['fr7a',3]].forEach(([id,i])=>$('#'+id+'v').textContent=A[i].toFixed(2));
    const H=[1,3,5,7];
    const f=t=>A.reduce((s,a,i)=>s+a*Math.sin(H[i]*t),0);
    x1.clearRect(0,0,W,H1); x1.fillStyle='#fff'; x1.fillRect(0,0,W,H1);
    x1.strokeStyle='#E5E7EB'; x1.beginPath(); x1.moveTo(20,H1/2); x1.lineTo(W-20,H1/2); x1.stroke();
    const X=t=>20+(W-40)*t/(2*Math.PI), Y=v=>H1/2-v*60;
    x1.strokeStyle='#D1D5DB'; x1.lineWidth=1.8; x1.beginPath();
    for(let t=0;t<=2*Math.PI;t+=0.01){ const px=X(t),py=Y(target(k,t)); t===0?x1.moveTo(px,py):x1.lineTo(px,py); } x1.stroke();
    x1.strokeStyle='#2563EB'; x1.lineWidth=2.4; x1.beginPath();
    for(let t=0;t<=2*Math.PI;t+=0.005){ const px=X(t),py=Y(f(t)); t===0?x1.moveTo(px,py):x1.lineTo(px,py); } x1.stroke();
    // 스펙트럼
    x2.clearRect(0,0,W,H2); x2.fillStyle='#fff'; x2.fillRect(0,0,W,H2);
    x2.strokeStyle='#9CA3AF'; x2.beginPath(); x2.moveTo(30,H2-24); x2.lineTo(W-20,H2-24); x2.stroke();
    A.forEach((a,i)=>{ const bx=60+i*70, h=a*70;
      x2.fillStyle='rgba(37,99,235,.45)'; x2.fillRect(bx-14, H2-24-h, 28, h);
      x2.strokeStyle='#2563EB'; x2.strokeRect(bx-14, H2-24-h, 28, h);
      x2.fillStyle='#374151'; x2.font='10.5px sans-serif'; x2.textAlign='center';
      x2.fillText(H[i]+'배음', bx, H2-10); });
    let se=0, n=0;
    for(let t=0;t<2*Math.PI;t+=0.02){ const e=f(t)-target(k,t); se+=e*e; n++; }
    const rmse=Math.sqrt(se/n);
    $('#frout').innerHTML =
      `<span class="mono">y = ${A.map((a,i)=>a>0?a.toFixed(2)+'·sin('+H[i]+'x)':null).filter(Boolean).join(' + ')||'0'}</span><br>`
      + `목표와의 평균 오차 = <b style="color:${rmse<0.25?'#0E9384':rmse<0.4?'#B45309':'#BE123C'}">${rmse.toFixed(3)}</b><br>`
      + (rmse<0.25 ? `<b style="color:#0E9384">성분 분해 성공 — 사인들의 합이 목표 파형을 흉내 냈습니다.</b><br>` : '')
      + (A[1]>0 && A[2]>0 && A[3]>0 ? `<b style="color:#7C3AED">홀수 배음 넷이 모두 살아 있습니다 — 각진 파형의 재료입니다.</b><br>` : '')
      + `<span style="color:#6B7280;font-size:12.5px">막대(스펙트럼)는 「이 소리에 어떤 주파수가 얼마나 들었는가」의 지도입니다.</span>`;
  }
  ['fr1a','fr3a','fr5a','fr7a'].forEach(i=>$('#'+i).oninput=draw);
  $('#frT').onchange=draw;
  draw();
  inquiry(root,{ id:'fr', title:'푸리에의 직관 — 파형을 성분으로',
    q:['배음 진폭을 하나씩 올리며 (진폭 조합, 오차) 를 여섯 줄 기록하세요.',
       '사각파에 가장 가까워지는 조합을 찾고, 1 : 1/3 : 1/5 : 1/7 비율과 비교하세요.',
       '스펙트럼 막대가 무엇을 나타내는지 자기 말로 쓰고, 음성 인식·MP3 압축과 어떻게 이어지는지 조사하세요.'],
    cols:['1배음','3배음','5배음','7배음','오차'],
    hint:'힌트 — 각진 파형일수록 높은 배음이 필요합니다. 배음을 잘라내면 모서리가 둥글어집니다.',
    read:()=>{ const A=['fr1a','fr3a','fr5a','fr7a'].map(i=>+$('#'+i).value);
      const k=$('#frT').value, H=[1,3,5,7];
      const f=t=>A.reduce((s,a,i)=>s+a*Math.sin(H[i]*t),0);
      let se=0,n=0; for(let t=0;t<2*Math.PI;t+=0.02){ const e=f(t)-target(k,t); se+=e*e; n++; }
      return A.map(a=>a.toFixed(2)).concat([Math.sqrt(se/n).toFixed(3)]); } });
}



/* ---------- LAB 122 등차수열 — 극장 좌석과 사다리꼴 ---------- */
function apDemo(root){
  root.innerHTML=`<div class="row"><div class="col">
      <canvas id="ap1" width="380" height="300"></canvas>
      <div class="note" style="margin-top:8px">한 줄이 늘 때마다 좌석이 <b>d 개씩</b> 늘어납니다.
      전체 좌석 수는 사다리꼴의 넓이와 같은 구조입니다.</div>
    </div>
    <div class="col">
      ${slider('apF','첫째 줄 좌석 a₁',4,20,1,12,'석')}
      ${slider('apD','한 줄마다 늘어나는 수 d',0,6,1,2,'석')}
      ${slider('apN','줄 수 n',3,20,1,8,'줄')}
      <div class="out" id="apout"></div>
      <div class="note" style="margin-top:12px">Sₙ = n(a₁ + aₙ)/2 — 첫 줄과 끝 줄의 <b>평균</b>에 줄 수를 곱한 것입니다.</div>
    </div></div>`;
  const cv=$('#ap1'),ctx=cv.getContext('2d'),W=380,H=300,P=30;
  function draw(){
    const a1=+$('#apF').value, d=+$('#apD').value, n=+$('#apN').value;
    $('#apFv').textContent=a1+'석'; $('#apDv').textContent=d+'석'; $('#apNv').textContent=n+'줄';
    const an=a1+(n-1)*d, sum=n*(a1+an)/2;
    ctx.clearRect(0,0,W,H); ctx.fillStyle='#fff'; ctx.fillRect(0,0,W,H);
    const rowH=Math.min(20,(H-2*P)/n), maxSeat=Math.max(an,1);
    for(let i=0;i<n;i++){
      const seats=a1+i*d, w=(W-2*P)*seats/maxSeat;
      ctx.fillStyle= i===0?'rgba(190,18,60,.4)': i===n-1?'rgba(14,147,132,.4)':'rgba(37,99,235,.32)';
      ctx.fillRect(P, P+i*rowH, w, rowH-2);
      ctx.strokeStyle='#C7D2E4'; ctx.lineWidth=0.8; ctx.strokeRect(P, P+i*rowH, w, rowH-2);
    }
    ctx.fillStyle='#374151'; ctx.font='11px sans-serif'; ctx.textAlign='left';
    ctx.fillText('첫 줄 '+a1+'석', P+4, P+13);
    ctx.fillText('끝 줄 '+an+'석', P+4, P+(n-1)*rowH+13);
    ctx.fillStyle='#6B7280'; ctx.font='10.5px sans-serif';
    ctx.fillText('사다리꼴 모양 — 위·아래 변의 평균 × 높이', P, H-14);
    $('#apout').innerHTML =
      `<span class="mono">aₙ = a₁ + (n−1)d = ${a1} + ${n-1}×${d} = <b>${an}</b></span><br>`
      + `<span class="mono">Sₙ = n(a₁ + aₙ)/2 = ${n}(${a1} + ${an})/2 = <b>${sum}</b></span><br>`
      + `전체 좌석 <b style="color:#2563EB">${sum}석</b> · 평균 한 줄 <b>${(sum/n).toFixed(1)}석</b><br>`
      + (d===0 ? `<b style="color:#7C3AED">공차 0 — 모든 줄이 같아 직사각형이 되었습니다 (Sₙ = n·a₁).</b><br>` : '')
      + (a1===12 && d===2 && n===15 ? `<b style="color:#B45309">오늘의 문제 — 15줄이면 모두 ${sum}석입니다.</b><br>` : '')
      + `<span style="color:#6B7280;font-size:12.5px">첫 줄과 끝 줄의 평균이 「가운데 줄」과 같다는 것이 공식의 핵심입니다.</span>`;
  }
  ['apF','apD','apN'].forEach(i=>$('#'+i).oninput=draw); draw();
  inquiry(root,{ id:'ap', title:'등차수열 — 사다리꼴로 세는 좌석',
    q:['(a₁, d, n, aₙ, Sₙ) 을 여섯 줄 기록하세요. 공차 0 인 경우도 포함하세요.',
       '첫 줄과 끝 줄의 평균이 전체 평균과 같은지 표에서 확인하세요.',
       'Sₙ = n(a₁+aₙ)/2 를 사다리꼴 넓이 공식과 짝지어 손으로 설명하세요.'],
    cols:['a₁','d','n','aₙ','Sₙ','평균'],
    hint:'힌트 — 좌석 배치를 뒤집어 원래 배치 위에 얹으면 모든 줄이 (a₁+aₙ) 개인 직사각형이 됩니다.',
    read:()=>{ const a1=+$('#apF').value,d=+$('#apD').value,n=+$('#apN').value,an=a1+(n-1)*d;
      return [a1,d,n,an,n*(a1+an)/2,((a1+an)/2).toFixed(1)]; } });
}

/* ---------- LAB 123 등차 vs 등비 — 매달 1만원 vs 매달 1% ---------- */
function apGpDemo(root){
  root.innerHTML=`<div class="row"><div class="col">
      <canvas id="ag1" width="380" height="300"></canvas>
      <div class="note" style="margin-top:8px">파랑은 <b>매달 같은 금액</b>(등차), 초록은 <b>매달 같은 비율</b>(등비)입니다.
      언제 뒤집히는지 보세요.</div>
    </div>
    <div class="col">
      ${slider('agA','시작 금액',10,200,10,50,'만원')}
      ${slider('agD','등차 — 매달 더하는 돈',1,20,1,5,'만원')}
      ${slider('agR','등비 — 매달 늘어나는 비율',1,20,1,3,'%')}
      ${slider('agN','개월 수',6,60,6,12,'개월')}
      <div class="out" id="agout"></div>
      <div class="note" style="margin-top:12px">처음에는 등차가 앞서지만, 등비는 <b>언젠가 반드시</b> 추월합니다 —
      그 시점을 찾는 것이 오늘의 목표입니다.</div>
    </div></div>`;
  const cv=$('#ag1'),ctx=cv.getContext('2d'),W=380,H=300,P=42;
  function draw(){
    const a=+$('#agA').value, d=+$('#agD').value, r=+$('#agR').value/100, n=+$('#agN').value;
    $('#agAv').textContent=a+'만원'; $('#agDv').textContent=d+'만원';
    $('#agRv').textContent=(+$('#agR').value)+'%'; $('#agNv').textContent=n+'개월';
    const ap=k=>a+d*k, gp=k=>a*Math.pow(1+r,k);
    const maxV=Math.max(ap(n), gp(n))*1.08;
    const X=k=>P+(W-P-16)*k/n, Y=v=>H-P-(H-2*P)*v/maxV;
    ctx.clearRect(0,0,W,H); ctx.fillStyle='#fff'; ctx.fillRect(0,0,W,H);
    ctx.strokeStyle='#F1F3F6';
    for(let i=0;i<=4;i++){ const y=H-P-(H-2*P)*i/4; ctx.beginPath(); ctx.moveTo(P,y); ctx.lineTo(W-16,y); ctx.stroke(); }
    const path=(f,col,w)=>{ ctx.strokeStyle=col; ctx.lineWidth=w; ctx.beginPath();
      for(let k=0;k<=n;k+=n/200){ const px=X(k),py=Y(f(k)); k===0?ctx.moveTo(px,py):ctx.lineTo(px,py); } ctx.stroke(); };
    path(ap,'#2563EB',2.4); path(gp,'#0E9384',2.6);
    let cross=null;
    for(let k=1;k<=n;k++){ if(gp(k)>=ap(k)){ cross=k; break; } }
    if(cross){ ctx.strokeStyle='#BE123C'; ctx.setLineDash([4,3]); ctx.lineWidth=1.4;
      ctx.beginPath(); ctx.moveTo(X(cross),P-8); ctx.lineTo(X(cross),H-P); ctx.stroke(); ctx.setLineDash([]);
      ctx.fillStyle='#BE123C'; ctx.font='bold 11px sans-serif'; ctx.textAlign='center';
      ctx.fillText(cross+'개월', X(cross), P-12); }
    ctx.strokeStyle='#9CA3AF'; ctx.lineWidth=1.2;
    ctx.beginPath(); ctx.moveTo(P,H-P); ctx.lineTo(W-16,H-P); ctx.stroke();
    ctx.fillStyle='#6B7280'; ctx.font='10px sans-serif'; ctx.textAlign='left'; ctx.fillText('개월 →',P,H-P+16);
    $('#agout').innerHTML =
      `<span class="mono">등차 aₙ = ${a} + ${d}n &nbsp;/&nbsp; 등비 aₙ = ${a}×${(1+r).toFixed(2)}ⁿ</span><br>`
      + `${n}개월 뒤 — 등차 <b style="color:#2563EB">${ap(n).toFixed(0)}만원</b> · 등비 <b style="color:#0E9384">${gp(n).toFixed(0)}만원</b><br>`
      + (cross ? `<b style="color:#BE123C">역전 시점 — ${cross}개월째에 등비가 등차를 앞질렀습니다.</b><br>`
               : `<b style="color:#B45309">아직 역전 전 — 개월 수를 늘리면 언젠가 반드시 뒤집힙니다.</b><br>`)
      + `<span style="color:#6B7280;font-size:12.5px">더하기는 직선, 곱하기는 휘는 곡선 — 처음의 앞섬은 오래가지 않습니다.</span>`;
  }
  ['agA','agD','agR','agN'].forEach(i=>$('#'+i).oninput=draw); draw();
  inquiry(root,{ id:'ag', title:'등차 vs 등비 — 언제 뒤집힐까',
    q:['(d, r, 역전 시점) 을 여섯 줄 기록하세요. 역전이 화면 안에서 일어나지 않는 경우도 넣으세요.',
       '비율 r 을 올릴 때 역전 시점이 어떻게 변하는지 규칙을 찾으세요.',
       '「곱하기는 결국 더하기를 이긴다」를 두 수열의 일반항으로 손으로 설명하세요.'],
    cols:['시작','d','r','n개월 뒤 등차','n개월 뒤 등비','역전 시점'],
    hint:'힌트 — 등차는 직선(일차), 등비는 지수입니다. 지수는 어떤 직선도 결국 넘어섭니다.',
    read:()=>{ const a=+$('#agA').value,d=+$('#agD').value,r=+$('#agR').value/100,n=+$('#agN').value;
      let c=null; for(let k=1;k<=n;k++){ if(a*Math.pow(1+r,k)>=a+d*k){ c=k; break; } }
      return [a,d,(r*100)+'%',(a+d*n).toFixed(0),(a*Math.pow(1+r,n)).toFixed(0), c?c+'개월':'아직']; } });
}

/* ---------- LAB 124 시그마와 누적합 — 데이터 집계 ---------- */
function sumDataDemo(root){
  root.innerHTML=`<div class="row"><div class="col">
      <canvas id="sd2" width="380" height="300"></canvas>
      <div class="note" style="margin-top:8px">위 막대는 <b>매일의 값</b>, 아래 꺾은선은 <b>누적합</b>입니다.
      막대를 눌러 값을 바꿔 보세요.</div>
    </div>
    <div class="col">
      <div class="ctl" style="display:flex;gap:6px;flex-wrap:wrap">
        <button class="b g sm" id="sdFlat">모두 같게 (하루 5)</button>
        <button class="b g sm" id="sdUp">매일 2씩 증가</button>
        <button class="b g sm" id="sdRnd">들쭉날쭉</button>
      </div>
      <div class="out" id="sd2out"></div>
      <div class="note" style="margin-top:12px">시그마는 <b>더하라는 명령</b>입니다.
      Σ(aₖ + bₖ) = Σaₖ + Σbₖ, Σc·aₖ = c·Σaₖ — 성질은 「먼저 더하나 나중에 더하나 같다」입니다.</div>
    </div></div>`;
  const cv=$('#sd2'),ctx=cv.getContext('2d'),W=380,H=300,P=34;
  const S={ v:[3,5,2,6,4,7,3,5,6,4] };
  function draw(){
    const v=S.v, n=v.length;
    const cum=[]; let acc=0; v.forEach(x=>{ acc+=x; cum.push(acc); });
    ctx.clearRect(0,0,W,H); ctx.fillStyle='#fff'; ctx.fillRect(0,0,W,H);
    const bw=(W-2*P)/n, mid=140, maxV=Math.max(...v,1), maxC=Math.max(acc,1);
    v.forEach((x,i)=>{ const h=(mid-P)*x/maxV;
      ctx.fillStyle='rgba(37,99,235,.42)'; ctx.fillRect(P+i*bw+2, mid-h, bw-4, h);
      ctx.strokeStyle='#2563EB'; ctx.lineWidth=1; ctx.strokeRect(P+i*bw+2, mid-h, bw-4, h);
      ctx.fillStyle='#374151'; ctx.font='9.5px sans-serif'; ctx.textAlign='center';
      ctx.fillText(x, P+i*bw+bw/2, mid-h-4); });
    ctx.strokeStyle='#9CA3AF'; ctx.beginPath(); ctx.moveTo(P,mid); ctx.lineTo(W-P,mid); ctx.stroke();
    const Y=c=>H-P-(H-P-mid-24)*c/maxC;
    ctx.strokeStyle='#0E9384'; ctx.lineWidth=2.4; ctx.beginPath();
    cum.forEach((c,i)=>{ const px=P+i*bw+bw/2, py=Y(c); i?ctx.lineTo(px,py):ctx.moveTo(px,py); }); ctx.stroke();
    cum.forEach((c,i)=>{ ctx.fillStyle='#0E9384'; ctx.beginPath(); ctx.arc(P+i*bw+bw/2,Y(c),3.4,0,7); ctx.fill(); });
    ctx.fillStyle='#6B7280'; ctx.font='10.5px sans-serif'; ctx.textAlign='left';
    ctx.fillText('매일의 값', P, P-8); ctx.fillText('누적합 (지금까지 모두 더한 값)', P, mid+18);
    const flat = v.every(x=>x===v[0]);
    const inc = v.every((x,i)=>i===0||x-v[i-1]===v[1]-v[0]) && v[1]-v[0]!==0;
    $('#sd2out').innerHTML =
      `<span class="mono">Σ<sub>k=1</sub><sup>${n}</sup> a<sub>k</sub> = <b>${acc}</b></span> · 평균 <b>${(acc/n).toFixed(1)}</b><br>`
      + `마지막 누적값이 곧 총합입니다.<br>`
      + (flat ? `<b style="color:#7C3AED">모두 같은 값 — 누적합이 <b>직선</b>이 되었습니다 (Σc = nc).</b><br>` : '')
      + (inc ? `<b style="color:#0E9384">일정하게 증가 — 누적합이 위로 휘는 <b>이차 곡선</b>이 됩니다.</b><br>` : '')
      + `<span style="color:#6B7280;font-size:12.5px">막대의 모양이 곧 누적선의 기울기입니다 — 집계는 「기울기 읽기」의 반대입니다.</span>`;
  }
  cv.style.touchAction='none';
  cv.addEventListener('pointerdown',e=>{
    const r=cv.getBoundingClientRect();
    const x=(e.clientX-r.left)*W/r.width, y=(e.clientY-r.top)*H/r.height;
    if(y>140) return;
    const bw=(W-2*P)/S.v.length, i=Math.floor((x-P)/bw);
    if(i<0||i>=S.v.length) return;
    S.v[i] = S.v[i]>=9 ? 1 : S.v[i]+1; draw();
  });
  $('#sdFlat').onclick=()=>{ S.v=S.v.map(()=>5); draw(); };
  $('#sdUp').onclick=()=>{ S.v=S.v.map((_,i)=>i+1); draw(); };
  $('#sdRnd').onclick=()=>{ S.v=[3,5,2,6,4,7,3,5,6,4]; draw(); };
  draw();
  inquiry(root,{ id:'sd2', title:'시그마와 누적합 — 집계의 수학',
    q:['막대를 눌러 자료를 바꿔 가며 (자료 모양, 총합, 누적선의 모양) 을 여섯 줄 기록하세요.',
       '모두 같은 값일 때와 일정하게 증가할 때 누적선이 각각 어떤 모양인지 확인하세요.',
       'Σ(aₖ+bₖ) = Σaₖ + Σbₖ 를 자료 두 벌로 검증하고, 성질이 성립하는 이유를 쓰세요.'],
    cols:['자료 모양','총합','평균','누적선 모양'],
    hint:'힌트 — 누적합의 「증가량」이 곧 그날의 값입니다. 미분과 적분의 관계와 같은 구조입니다.',
    read:()=>{ const v=S.v, acc=v.reduce((a,b)=>a+b,0);
      const flat=v.every(x=>x===v[0]);
      return [flat?'모두 같음':'변동 있음', acc, (acc/v.length).toFixed(1), flat?'직선':'휘는 선']; } });
}

/* ---------- LAB 125 점화식 — 다음 항은 앞 항이 정한다 ---------- */
function recurSeqDemo(root){
  root.innerHTML=`<div class="row"><div class="col">
      <canvas id="rq1" width="380" height="300"></canvas>
      <div class="ctl" style="display:flex;gap:6px;flex-wrap:wrap;margin-top:8px">
        <button class="b t" id="rqStep">다음 항 만들기 ▶</button>
        <button class="b t sm" id="rqRun">10항 한 번에</button>
        <button class="b g sm" id="rqRs">처음으로</button>
      </div>
    </div>
    <div class="col">
      <label class="ctl">점화식 고르기<select id="rqK" style="width:100%;padding:7px 9px;border:1px solid #E5E7EB;border-radius:8px;font:inherit">
        <option value="add">aₙ₊₁ = aₙ + 3 (등차)</option>
        <option value="mul">aₙ₊₁ = 2aₙ (등비)</option>
        <option value="fib" selected>aₙ₊₁ = aₙ + aₙ₋₁ (피보나치)</option>
        <option value="mix">aₙ₊₁ = 2aₙ + 1</option></select></label>
      <div class="out" id="rqout"></div>
      <div class="note" style="margin-top:12px">점화식은 <b>「다음을 만드는 규칙」</b>입니다.
      토끼 쌍의 수, 예금 잔액, 재귀 알고리즘이 모두 이 꼴로 적힙니다.</div>
    </div></div>`;
  const cv=$('#rq1'),ctx=cv.getContext('2d'),W=380,H=300,P=36;
  const S={ a:[1,1] };
  function init(){ const k=$('#rqK').value;
    S.a = k==='fib' ? [1,1] : k==='add' ? [2] : k==='mul' ? [1] : [1]; }
  function next(){
    const k=$('#rqK').value, a=S.a, n=a.length;
    if(n>=14) return;
    if(k==='add') a.push(a[n-1]+3);
    else if(k==='mul') a.push(2*a[n-1]);
    else if(k==='fib') a.push(a[n-1]+a[n-2]);
    else a.push(2*a[n-1]+1);
  }
  function draw(){
    const a=S.a, n=a.length, mx=Math.max(...a,1);
    ctx.clearRect(0,0,W,H); ctx.fillStyle='#fff'; ctx.fillRect(0,0,W,H);
    const bw=(W-2*P)/14;
    a.forEach((v,i)=>{ const h=(H-2*P)*v/mx;
      ctx.fillStyle= i>=n-1 ? 'rgba(190,18,60,.45)' : 'rgba(37,99,235,.38)';
      ctx.fillRect(P+i*bw+2, H-P-h, bw-4, h);
      ctx.fillStyle='#374151'; ctx.font='9.5px sans-serif'; ctx.textAlign='center';
      ctx.fillText(v, P+i*bw+bw/2, H-P-h-4); });
    ctx.strokeStyle='#9CA3AF'; ctx.beginPath(); ctx.moveTo(P,H-P); ctx.lineTo(W-P,H-P); ctx.stroke();
    ctx.fillStyle='#6B7280'; ctx.font='10px sans-serif'; ctx.textAlign='left';
    ctx.fillText('항 번호 →', P, H-P+16);
    const k=$('#rqK').value;
    const names={add:'aₙ₊₁ = aₙ + 3', mul:'aₙ₊₁ = 2aₙ', fib:'aₙ₊₁ = aₙ + aₙ₋₁', mix:'aₙ₊₁ = 2aₙ + 1'};
    const ratio = n>=3 ? (a[n-1]/a[n-2]) : null;
    $('#rqout').innerHTML =
      `<span class="mono">${names[k]}</span> · 지금까지 <b>${n}항</b><br>`
      + `수열: <b>${a.join(', ')}</b><br>`
      + (k==='fib' && n>=10 ? `<b style="color:#B45309">이웃 항의 비 = ${ratio.toFixed(4)} — 황금비 1.618 에 다가갑니다.</b><br>` : '')
      + (k==='mix' && n>=6 ? `<b style="color:#7C3AED">각 항에 1을 더해 보세요 — 2, 4, 8, 16 … 등비가 숨어 있습니다.</b><br>` : '')
      + (k==='add' && n>=6 ? `<b style="color:#0E9384">차가 늘 3 — 일반항 aₙ = ${a[0]} + 3(n−1) 로 한 번에 구할 수 있습니다.</b><br>` : '')
      + `<span style="color:#6B7280;font-size:12.5px">점화식은 「다음」만 알려 줍니다. 먼 항을 바로 알려면 일반항이 필요합니다.</span>`;
  }
  $('#rqStep').onclick=()=>{ next(); draw(); };
  $('#rqRun').onclick=()=>{ for(let i=0;i<10;i++) next(); draw(); };
  $('#rqRs').onclick=()=>{ init(); draw(); };
  $('#rqK').onchange=()=>{ init(); draw(); };
  init(); draw();
  inquiry(root,{ id:'rq', title:'점화식 — 다음 항을 만드는 규칙',
    q:['네 점화식을 모두 10항까지 만들며 (규칙, 처음 다섯 항, 자라는 속도) 를 기록하세요.',
       '피보나치에서 이웃 항의 비를 계산해 어디로 다가가는지 확인하세요.',
       'aₙ₊₁ = 2aₙ + 1 의 각 항에 1을 더하면 등비가 되는 이유를 손으로 설명하세요.'],
    cols:['점화식','항 수','마지막 항','이웃 비'],
    hint:'힌트 — 점화식은 「씨앗(첫 항) + 만드는 규칙」입니다. 씨앗이 다르면 전혀 다른 수열이 됩니다.',
    read:()=>{ const a=S.a,n=a.length,k=$('#rqK').value;
      const names={add:'aₙ+3',mul:'2aₙ',fib:'aₙ+aₙ₋₁',mix:'2aₙ+1'};
      return [names[k], n, a[n-1], n>=3?(a[n-1]/a[n-2]).toFixed(4):'—']; } });
}

/* ---------- LAB 126 적금의 수학 — 매달 넣으면 얼마가 될까 ---------- */
function savingDemo(root){
  root.innerHTML=`<div class="row"><div class="col">
      <canvas id="sv2" width="380" height="300"></canvas>
      <div class="note" style="margin-top:8px">막대 하나가 <b>그달에 넣은 돈이 만기에 갖는 가치</b>입니다.
      먼저 넣은 돈일수록 이자를 오래 받습니다.</div>
    </div>
    <div class="col">
      ${slider('svM','매달 넣는 돈',5,50,5,10,'만원')}
      ${slider('svR','연이자율',1,8,0.5,2,'%')}
      ${slider('svN','기간',6,36,6,6,'개월')}
      <div class="out" id="sv2out"></div>
      <div class="note" style="margin-top:12px">매달 같은 돈을 넣어도 <b>넣은 시점마다 이자 기간이 다릅니다</b> —
      그래서 만기 금액이 등비수열의 합이 됩니다.</div>
    </div></div>`;
  const cv=$('#sv2'),ctx=cv.getContext('2d'),W=380,H=300,P=40;
  function calc(){
    const m=+$('#svM').value, r=+$('#svR').value/100/12, n=+$('#svN').value;
    const parts=[]; let tot=0;
    for(let k=0;k<n;k++){ const v=m*Math.pow(1+r,n-1-k); parts.push(v); tot+=v; }
    return {m,r,n,parts,tot,principal:m*n};
  }
  function draw(){
    const c=calc();
    $('#svMv').textContent=c.m+'만원'; $('#svRv').textContent=(+$('#svR').value).toFixed(1)+'%'; $('#svNv').textContent=c.n+'개월';
    ctx.clearRect(0,0,W,H); ctx.fillStyle='#fff'; ctx.fillRect(0,0,W,H);
    const bw=(W-2*P)/c.n, mx=Math.max(...c.parts);
    c.parts.forEach((v,i)=>{ const h=(H-2*P)*v/mx;
      ctx.fillStyle='rgba(37,99,235,.40)'; ctx.fillRect(P+i*bw+1, H-P-h, bw-2, h);
      ctx.fillStyle='rgba(190,18,60,.35)';
      const ih=(H-2*P)*(v-c.m)/mx; if(ih>0.6) ctx.fillRect(P+i*bw+1, H-P-h, bw-2, ih);
    });
    ctx.strokeStyle='#9CA3AF'; ctx.lineWidth=1.2;
    ctx.beginPath(); ctx.moveTo(P,H-P); ctx.lineTo(W-P,H-P); ctx.stroke();
    ctx.fillStyle='#6B7280'; ctx.font='10px sans-serif'; ctx.textAlign='left';
    ctx.fillText('첫 달 (이자 오래)', P, H-P+16);
    ctx.textAlign='right'; ctx.fillText('마지막 달', W-P, H-P+16);
    ctx.textAlign='left'; ctx.fillStyle='#BE123C'; ctx.font='bold 10.5px sans-serif';
    ctx.fillText('붉은 부분 = 이자', P, P-10);
    const interest = c.tot - c.principal;
    $('#sv2out').innerHTML =
      `<span class="mono">S = m·((1+i)ⁿ − 1)/i</span> &nbsp;(i = 월이자율 ${(c.r*100).toFixed(3)}%)<br>`
      + `원금 합계 <b>${c.principal}만원</b> → 만기 금액 <b style="color:#2563EB">${c.tot.toFixed(1)}만원</b>`
      + ` · 이자 <b style="color:#BE123C">${interest.toFixed(1)}만원</b><br>`
      + (c.m===20 && c.n===12 && Math.abs(+$('#svR').value-3)<0.01
          ? `<b style="color:#B45309">오늘의 문제 — 만기에 ${c.tot.toFixed(1)}만원, 이자는 ${interest.toFixed(1)}만원입니다.</b><br>` : '')
      + (c.n>=24 ? `<b style="color:#0E9384">기간이 길어질수록 이자 비중이 눈에 띄게 커집니다 (${(interest/c.principal*100).toFixed(1)}%).</b><br>` : '')
      + `<span style="color:#6B7280;font-size:12.5px">첫 달에 넣은 돈이 가장 높은 막대입니다 — 시간이 곧 이자입니다.</span>`;
  }
  ['svM','svR','svN'].forEach(i=>$('#'+i).oninput=draw); draw();
  inquiry(root,{ id:'sv2', title:'적금 — 등비수열로 자라는 저축',
    q:['(매달 금액, 이자율, 기간, 만기 금액, 이자) 를 여섯 줄 기록하세요.',
       '기간을 두 배로 늘리면 이자가 몇 배가 되는지 확인하세요(두 배보다 큰가요?).',
       '만기 금액이 등비수열의 합인 이유를 「각 달의 돈이 받는 이자 기간」으로 손으로 설명하세요.'],
    cols:['매달','이자율','기간','원금 합','만기 금액','이자'],
    hint:'힌트 — 첫 달 돈은 (1+i)^(n−1) 배, 마지막 달 돈은 1 배. 이들을 더하면 등비수열의 합입니다.',
    read:()=>{ const c=calc();
      return [c.m+'만원',(+$('#svR').value).toFixed(1)+'%',c.n+'개월',c.principal,c.tot.toFixed(1),(c.tot-c.principal).toFixed(1)]; } });
}


/* ---------- LAB 127 좌극한·우극한 — 주차 요금의 정각 ---------- */
function lrLimDemo(root){
  root.innerHTML=`<div class="row"><div class="col">
      <canvas id="ll1" width="380" height="300"></canvas>
      <div class="note" style="margin-top:8px">x = 2 에 <b>왼쪽에서</b> 다가갈 때와 <b>오른쪽에서</b> 다가갈 때를
      각각 따라가 보세요. 두 값이 늘 같지는 않습니다.</div>
    </div>
    <div class="col">
      <label class="ctl">상황 고르기<select id="llK" style="width:100%;padding:7px 9px;border:1px solid #E5E7EB;border-radius:8px;font:inherit">
        <option value="cont">① 이어진 그래프 — 기온 곡선</option>
        <option value="park">② 계단 — 주차 요금 (1시간마다 2000원)</option>
        <option value="hole">③ 구멍 — (x²−4)/(x−2)</option>
      </select></label>
      ${slider('llH','x = 2 에서 떨어진 거리 h',1,60,1,40,'')}
      <div class="out" id="llout"></div>
      <div class="note" style="margin-top:12px">극한은 <b>「그 점의 값」이 아니라 「다가가는 값」</b>입니다.
      좌극한과 우극한이 같을 때만 극한이 있다고 말합니다.</div>
    </div></div>`;
  const cv=$('#ll1'),ctx=cv.getContext('2d'),W=380,H=300,P=40;
  const f={ cont:x=>1.2*x+1.6, park:x=>2*(Math.floor(x)+1), hole:x=>x+2 };
  const hval=i=>Math.pow(10,-(i/20));
  function draw(){
    const k=$('#llK').value, hi=+$('#llH').value, h=hval(hi);
    $('#llHv').textContent=h.toFixed(4);
    const X=x=>P+(W-2*P)*(x-0)/4, Y=y=>H-P-(H-2*P)*(y-0)/8;
    ctx.clearRect(0,0,W,H); ctx.fillStyle='#fff'; ctx.fillRect(0,0,W,H);
    ctx.strokeStyle='#E5E7EB'; ctx.lineWidth=1;
    for(let g=0;g<=4;g++){ ctx.beginPath(); ctx.moveTo(X(g),P-6); ctx.lineTo(X(g),H-P); ctx.stroke(); }
    ctx.strokeStyle='#9CA3AF'; ctx.beginPath(); ctx.moveTo(P,H-P); ctx.lineTo(W-P,H-P); ctx.stroke();
    ctx.fillStyle='#6B7280'; ctx.font='10px sans-serif'; ctx.textAlign='center';
    for(let g=0;g<=4;g++) ctx.fillText(g, X(g), H-P+14);
    ctx.strokeStyle='#2563EB'; ctx.lineWidth=2.2;
    if(k==='park'){
      for(let s=0;s<4;s++){ const y=f.park(s+0.5);
        ctx.beginPath(); ctx.moveTo(X(s),Y(y)); ctx.lineTo(X(s+1)-1,Y(y)); ctx.stroke();
        ctx.fillStyle='#2563EB'; ctx.beginPath(); ctx.arc(X(s),Y(y),3.2,0,7); ctx.fill();
        ctx.fillStyle='#fff'; ctx.strokeStyle='#2563EB'; ctx.lineWidth=1.6;
        ctx.beginPath(); ctx.arc(X(s+1)-1,Y(y),3.2,0,7); ctx.fill(); ctx.stroke();
        ctx.strokeStyle='#2563EB'; ctx.lineWidth=2.2; }
    }else{
      ctx.beginPath();
      for(let px=0;px<=300;px++){ const x=px/300*4; if(k==='hole'&&Math.abs(x-2)<0.02) continue;
        const y=f[k](x); px?ctx.lineTo(X(x),Y(y)):ctx.moveTo(X(x),Y(y)); }
      ctx.stroke();
      if(k==='hole'){ ctx.fillStyle='#fff'; ctx.strokeStyle='#2563EB'; ctx.lineWidth=1.8;
        ctx.beginPath(); ctx.arc(X(2),Y(4),4.2,0,7); ctx.fill(); ctx.stroke(); }
    }
    const L=k==='park'?f.park(2-h):f[k](2-h), R=k==='park'?f.park(2+h):f[k](2+h);
    ctx.fillStyle='#BE123C'; ctx.beginPath(); ctx.arc(X(2-h),Y(L),4.4,0,7); ctx.fill();
    ctx.fillStyle='#0E9384'; ctx.beginPath(); ctx.arc(X(2+h),Y(R),4.4,0,7); ctx.fill();
    ctx.setLineDash([4,4]); ctx.strokeStyle='#9CA3AF'; ctx.lineWidth=1;
    ctx.beginPath(); ctx.moveTo(X(2),P-6); ctx.lineTo(X(2),H-P); ctx.stroke(); ctx.setLineDash([]);
    ctx.fillStyle='#6B7280'; ctx.font='10.5px sans-serif'; ctx.textAlign='left';
    ctx.fillText('붉은 = 왼쪽에서, 초록 = 오른쪽에서', P, P-16);
    const e=1e-7;
    const LL=k==='park'?f.park(2-e):f[k](2-e), RR=k==='park'?f.park(2+e):f[k](2+e);
    const same=Math.abs(LL-RR)<1e-4;
    const fv = k==='park' ? f.park(2) : (k==='hole' ? null : f.cont(2));
    $('#llout').innerHTML =
      `<span class="mono">f(2−h) = <b style="color:#BE123C">${L.toFixed(4)}</b> &nbsp; (h = ${h.toFixed(4)})</span><br>`
      + `<span class="mono">f(2+h) = <b style="color:#0E9384">${R.toFixed(4)}</b></span><br>`
      + `<span class="mono">f(2) = <b>${fv===null?'정의되지 않음':fv.toFixed(2)}</b></span><br>`
      + (!same ? `<b style="color:#B45309">좌극한 ≠ 우극한 — 이 점에서 극한은 없습니다.</b><br>`
               : (fv===null ? `<b style="color:#7C3AED">좌우가 같아 극한은 ${LL.toFixed(2)} — 그런데 함숫값이 없는 구멍입니다.</b><br>`
                            : `좌우가 같아 극한이 있고, 함숫값과도 같습니다 — 연속입니다.<br>`))
      + `<span style="color:#6B7280;font-size:12.5px">h 를 줄일수록 두 점이 x = 2 로 다가갑니다. 도착하지는 않습니다.</span>`;
  }
  $('#llK').onchange=draw; $('#llH').oninput=draw; draw();
  inquiry(root,{ id:'ll', title:'좌극한과 우극한 — 다가가는 값',
    q:['세 상황 각각에서 (좌극한, 우극한, f(2)) 를 기록하세요.',
       '극한이 있는데 함숫값과 다른 경우는 어느 것이었나요?',
       '「극한이 있다」의 조건을 좌·우 두 값으로 한 문장으로 쓰세요.'],
    cols:['상황','h','좌극한','우극한','f(2)','극한 있나'],
    hint:'힌트 — 계단에서는 h 를 아무리 줄여도 두 값의 차이가 그대로 남습니다.',
    read:()=>{ const k=$('#llK').value,h=hval(+$('#llH').value);
      const L=k==='park'?f.park(2-h):f[k](2-h), R=k==='park'?f.park(2+h):f[k](2+h);
      const e=1e-7, LL=k==='park'?f.park(2-e):f[k](2-e), RR=k==='park'?f.park(2+e):f[k](2+e);
      return [{cont:'이어진',park:'계단',hole:'구멍'}[k],h.toFixed(4),L.toFixed(3),R.toFixed(3),
        k==='hole'?'없음':(k==='park'?f.park(2):f.cont(2)).toFixed(2), Math.abs(LL-RR)<1e-4?'있음':'없음']; } });
}

/* ---------- LAB 128 0/0 꼴 — 계산기가 오류를 내는 자리 ---------- */
function zeroDivDemo(root){
  root.innerHTML=`<div class="row"><div class="col">
      <canvas id="z01" width="380" height="300"></canvas>
      <div class="note" style="margin-top:8px">표의 x 가 a 에 다가갈 때 값이 어디로 모이는지 보세요.
      <b>a 를 대입하면 0/0</b> 이지만, 다가가는 값은 정해져 있습니다.</div>
    </div>
    <div class="col">
      <label class="ctl">식 고르기<select id="zdK" style="width:100%;padding:7px 9px;border:1px solid #E5E7EB;border-radius:8px;font:inherit">
        <option value="B">① (x−1)/(x²−1),  x → 1</option>
        <option value="A">② (x²−4)/(x−2),  x → 2</option>
        <option value="C">③ (√(x+4)−2)/x,  x → 0</option>
      </select></label>
      <div class="ctl" style="display:flex;gap:6px;flex-wrap:wrap;margin-top:8px">
        <button class="b g sm" id="zdSub">a 를 그대로 대입</button>
        <button class="b g sm" id="zdFac">약분·유리화해 보기</button>
      </div>
      <div class="out" id="zdout"></div>
      <div class="note" style="margin-top:12px">0/0 은 <b>부정형</b>입니다 — 답이 없는 게 아니라
      「이 꼴만으로는 정할 수 없다」는 뜻입니다. 식을 고쳐야 값이 드러납니다.</div>
    </div></div>`;
  const cv=$('#z01'),ctx=cv.getContext('2d'),W=380,H=300,P=38;
  const K={ A:{a:2,L:4, f:x=>(x*x-4)/(x-2), s:'(x²−4)/(x−2)', red:'x + 2', how:'분자를 (x−2)(x+2) 로 인수분해해 약분'},
            B:{a:1,L:0.5,f:x=>(x-1)/(x*x-1), s:'(x−1)/(x²−1)', red:'1/(x + 1)', how:'분모를 (x−1)(x+1) 로 인수분해해 약분'},
            C:{a:0,L:0.25,f:x=>(Math.sqrt(x+4)-2)/x, s:'(√(x+4)−2)/x', red:'1/(√(x+4) + 2)', how:'분자를 유리화(켤레를 곱하기)'} };
  const S={ sub:false, fac:false };
  function draw(){
    const k=$('#zdK').value, C=K[k], a=C.a;
    ctx.clearRect(0,0,W,H); ctx.fillStyle='#fff'; ctx.fillRect(0,0,W,H);
    const x0=a-1.6, x1=a+1.6, y0=C.L-1.4, y1=C.L+1.4;
    const X=x=>P+(W-2*P)*(x-x0)/(x1-x0), Y=y=>H-P-(H-2*P)*(y-y0)/(y1-y0);
    ctx.strokeStyle='#E5E7EB'; ctx.beginPath(); ctx.moveTo(P,Y(C.L)); ctx.lineTo(W-P,Y(C.L)); ctx.stroke();
    ctx.strokeStyle='#2563EB'; ctx.lineWidth=2.2; ctx.beginPath();
    let started=false;
    for(let px=0;px<=320;px++){ const x=x0+(x1-x0)*px/320; if(Math.abs(x-a)<0.012){ started=false; continue; }
      const y=C.f(x); if(!isFinite(y)) { started=false; continue; }
      if(started) ctx.lineTo(X(x),Y(y)); else { ctx.moveTo(X(x),Y(y)); started=true; } }
    ctx.stroke();
    ctx.fillStyle='#fff'; ctx.strokeStyle='#2563EB'; ctx.lineWidth=1.8;
    ctx.beginPath(); ctx.arc(X(a),Y(C.L),4.4,0,7); ctx.fill(); ctx.stroke();
    [0.5,0.1,0.02].forEach(d=>{
      ctx.fillStyle='#BE123C'; ctx.beginPath(); ctx.arc(X(a-d),Y(C.f(a-d)),3.4,0,7); ctx.fill();
      ctx.fillStyle='#0E9384'; ctx.beginPath(); ctx.arc(X(a+d),Y(C.f(a+d)),3.4,0,7); ctx.fill(); });
    ctx.setLineDash([4,4]); ctx.strokeStyle='#9CA3AF'; ctx.lineWidth=1;
    ctx.beginPath(); ctx.moveTo(X(a),P-6); ctx.lineTo(X(a),H-P); ctx.stroke(); ctx.setLineDash([]);
    ctx.fillStyle='#6B7280'; ctx.font='10.5px sans-serif'; ctx.textAlign='left';
    ctx.fillText('x = '+a+' 만 비어 있습니다', P, P-16);
    let rows='';
    [0.1,0.01,0.001].forEach(d=>{ rows += `<span class="mono">x = ${(a-d).toFixed(3)} → ${C.f(a-d).toFixed(5)}`
      + ` &nbsp;|&nbsp; x = ${(a+d).toFixed(3)} → ${C.f(a+d).toFixed(5)}</span><br>`; });
    $('#zdout').innerHTML =
      `<span class="mono">f(x) = ${C.s},  x → ${a}</span><br>` + rows
      + (S.sub ? `<b style="color:#B45309">그대로 대입하면 0 ÷ 0 — 값이 정해지지 않는 부정형입니다.</b><br>` : '')
      + (S.fac ? `<b style="color:#7C3AED">식을 고치면 ${C.red} — 구멍 하나만 남고 값이 보입니다 (${C.how}).</b><br>` : '')
      + `양쪽에서 <b style="color:#2563EB">${C.L}</b> 로 다가갑니다.<br>`
      + `<span style="color:#6B7280;font-size:12.5px">표의 두 열이 같은 수로 좁혀지면 그것이 극한값입니다.</span>`;
  }
  $('#zdK').onchange=()=>{ S.sub=false; S.fac=false; draw(); };
  $('#zdSub').onclick=()=>{ S.sub=true; draw(); };
  $('#zdFac').onclick=()=>{ S.fac=true; draw(); };
  draw();
  inquiry(root,{ id:'zd', title:'0/0 꼴 — 대입 말고 다가가기',
    q:['세 식 각각에서 x = a±0.001 의 값을 기록하고 극한값을 적으세요.',
       '왜 「대입」이 아니라 「다가가기」여야 하는지 한 문장으로 쓰세요.',
       '각 식을 손으로 고쳐(인수분해·유리화) 극한값이 표와 맞는지 확인하세요.'],
    cols:['식','a','왼쪽 값','오른쪽 값','극한값'],
    hint:'힌트 — 0/0 은 「모른다」가 아니라 「이 모양으로는 아직 모른다」입니다.',
    read:()=>{ const C=K[$('#zdK').value];
      return [C.s, C.a, C.f(C.a-0.001).toFixed(5), C.f(C.a+0.001).toFixed(5), C.L]; } });
}

/* ---------- LAB 129 불연속의 세 종류 — 어떤 끊김은 고칠 수 있다 ---------- */
function discontDemo(root){
  root.innerHTML=`<div class="row"><div class="col">
      <canvas id="dc1" width="380" height="300"></canvas>
      <div class="note" style="margin-top:8px">끊긴 자리를 <b>한 점만 고쳐서</b> 이을 수 있는지 보세요.
      고칠 수 있는 끊김과 그렇지 않은 끊김이 있습니다.</div>
    </div>
    <div class="col">
      <label class="ctl">끊김 고르기<select id="dcK" style="width:100%;padding:7px 9px;border:1px solid #E5E7EB;border-radius:8px;font:inherit">
        <option value="jump">① 점프 — 배송비가 뛰는 지점</option>
        <option value="hole">② 구멍 — 한 점만 빠진 그래프</option>
        <option value="inf">③ 무한 — 1/(x−2)²</option>
      </select></label>
      <div class="ctl" style="margin-top:8px"><button class="b g sm" id="dcFix">그 점의 값을 고쳐 보기</button></div>
      <div class="out" id="dcout"></div>
      <div class="note" style="margin-top:12px">연속의 세 조건 — ① f(a) 가 있고 ② 극한이 있고 ③ 둘이 같아야 합니다.
      어느 조건이 깨졌는지가 끊김의 <b>종류</b>를 정합니다.</div>
    </div></div>`;
  const cv=$('#dc1'),ctx=cv.getContext('2d'),W=380,H=300,P=38;
  const S={ fix:false };
  function draw(){
    const k=$('#dcK').value;
    ctx.clearRect(0,0,W,H); ctx.fillStyle='#fff'; ctx.fillRect(0,0,W,H);
    const X=x=>P+(W-2*P)*x/4, Y=y=>H-P-(H-2*P)*y/8;
    ctx.strokeStyle='#9CA3AF'; ctx.lineWidth=1;
    ctx.beginPath(); ctx.moveTo(P,H-P); ctx.lineTo(W-P,H-P); ctx.stroke();
    ctx.fillStyle='#6B7280'; ctx.font='10px sans-serif'; ctx.textAlign='center';
    for(let g=0;g<=4;g++) ctx.fillText(g, X(g), H-P+14);
    ctx.strokeStyle='#2563EB'; ctx.lineWidth=2.2;
    const gL=k==='jump'?2.6:4, gR=k==='jump'?5.4:4;
    if(k==='inf'){
      [[0.05,1.95],[2.05,3.95]].forEach(seg=>{ ctx.beginPath();
        for(let px=0;px<=160;px++){ const x=seg[0]+(seg[1]-seg[0])*px/160, y=Math.min(1/((x-2)*(x-2)),7.6);
          px?ctx.lineTo(X(x),Y(y)):ctx.moveTo(X(x),Y(y)); } ctx.stroke(); });
    }else{
      ctx.beginPath(); ctx.moveTo(X(0.1),Y(k==='jump'?2.6:4-0));
      for(let px=0;px<=150;px++){ const x=0.1+(1.98-0.1)*px/150, y=k==='jump'?2.6:(x+2);
        px?ctx.lineTo(X(x),Y(y)):ctx.moveTo(X(x),Y(y)); } ctx.stroke();
      ctx.beginPath();
      for(let px=0;px<=150;px++){ const x=2.02+(3.9-2.02)*px/150, y=k==='jump'?5.4:(x+2);
        px?ctx.lineTo(X(x),Y(y)):ctx.moveTo(X(x),Y(y)); } ctx.stroke();
      ctx.fillStyle='#fff'; ctx.strokeStyle='#2563EB'; ctx.lineWidth=1.8;
      ctx.beginPath(); ctx.arc(X(2),Y(gL),4.4,0,7); ctx.fill(); ctx.stroke();
      if(k==='jump'){ ctx.beginPath(); ctx.arc(X(2),Y(gR),4.4,0,7); ctx.fill(); ctx.stroke(); }
    }
    if(S.fix){ ctx.fillStyle='#BE123C';
      const yv = k==='inf' ? 7.4 : (k==='hole' ? 4 : 4);
      ctx.beginPath(); ctx.arc(X(2),Y(yv),4.6,0,7); ctx.fill();
      ctx.font='10px sans-serif'; ctx.textAlign='left'; ctx.fillText('고쳐 넣은 값', X(2)+8, Y(yv)-4); }
    ctx.setLineDash([4,4]); ctx.strokeStyle='#9CA3AF'; ctx.lineWidth=1;
    ctx.beginPath(); ctx.moveTo(X(2),P-6); ctx.lineTo(X(2),H-P); ctx.stroke(); ctx.setLineDash([]);
    const T={ jump:{L:'2.6',R:'5.4',lim:'없음(좌우가 다름)',name:'점프 불연속',
                fix:'좌우 값이 애초에 다르므로, 어떤 값을 넣어도 한쪽은 여전히 끊깁니다.'},
              hole:{L:'4',R:'4',lim:'4',name:'제거 가능한 불연속',
                fix:'극한값 4 를 그 점의 값으로 정하면 그래프가 완전히 이어집니다.'},
              inf:{L:'+∞',R:'+∞',lim:'없음(발산)',name:'무한 불연속',
                fix:'값이 무한히 커지므로 유한한 어떤 수를 넣어도 이을 수 없습니다.'} }[k];
    $('#dcout').innerHTML =
      `<span class="mono">좌극한 = ${T.L} · 우극한 = ${T.R} · 극한 = ${T.lim}</span><br>`
      + `종류 — <b style="color:#2563EB">${T.name}</b><br>`
      + (k==='hole' ? `<b style="color:#7C3AED">한 점만 고치면 이어집니다 — 고칠 수 있는 끊김입니다.</b><br>` : '')
      + (k==='inf' ? `<b style="color:#B45309">값이 무한대로 치솟아 — 어떤 값을 넣어도 이을 수 없습니다.</b><br>` : '')
      + (S.fix ? `고쳐 넣기 결과 — ${T.fix}<br>` : '')
      + `<span style="color:#6B7280;font-size:12.5px">연속의 세 조건 중 무엇이 깨졌는지 말해 보세요.</span>`;
  }
  $('#dcK').onchange=()=>{ S.fix=false; draw(); };
  $('#dcFix').onclick=()=>{ S.fix=true; draw(); };
  draw();
  inquiry(root,{ id:'dc', title:'불연속의 종류 — 고칠 수 있는 끊김',
    q:['세 끊김 각각에서 (좌극한, 우극한, 극한, 종류) 를 기록하세요.',
       '연속의 세 조건 중 각각 어느 것이 깨졌는지 적으세요.',
       '「값 하나를 고쳐 이을 수 있다」의 조건을 극한으로 표현하세요.'],
    cols:['끊김','좌극한','우극한','극한','종류'],
    hint:'힌트 — 극한이 있어야 고칠 수 있습니다. 극한이 없으면 손쓸 방법이 없습니다.',
    read:()=>{ const k=$('#dcK').value;
      const T={jump:['점프','2.6','5.4','없음','점프 불연속'],hole:['구멍','4','4','4','제거 가능'],
               inf:['무한','+∞','+∞','없음','무한 불연속']}[k]; return T; } });
}

/* ---------- LAB 130 사잇값 정리 — 부호만으로 근을 좁힌다 ---------- */
function ivtDemo(root){
  root.innerHTML=`<div class="row"><div class="col">
      <canvas id="iv1" width="380" height="300"></canvas>
      <div class="note" style="margin-top:8px">양 끝의 <b>부호가 다르면</b> 그 사이 어딘가에서 반드시 0 을 지납니다.
      값을 몰라도 <b>있다</b>는 것은 알 수 있습니다.</div>
    </div>
    <div class="col">
      ${slider('ivA','왼쪽 끝 a',-2,3,0.1,0,'')}
      ${slider('ivB','오른쪽 끝 b',-1,4,0.1,1,'')}
      <div class="ctl" style="display:flex;gap:6px;flex-wrap:wrap;margin-top:8px">
        <button class="b g sm" id="ivHalf">구간을 반으로 자르기</button>
        <button class="b g sm" id="ivReset">처음으로</button>
      </div>
      <div class="out" id="ivout"></div>
      <div class="note" style="margin-top:12px">f(x) = x³ − x − 1 은 연속입니다.
      연속이라는 전제가 있어야 <b>중간값</b>을 반드시 지난다고 말할 수 있습니다.</div>
    </div></div>`;
  const cv=$('#iv1'),ctx=cv.getContext('2d'),W=380,H=300,P=38;
  const f=x=>x*x*x-x-1;
  const S={ a:0, b:1, cuts:0 };
  function draw(){
    const a=S.a, b=S.b;
    $('#ivAv').textContent=a.toFixed(2); $('#ivBv').textContent=b.toFixed(2);
    ctx.clearRect(0,0,W,H); ctx.fillStyle='#fff'; ctx.fillRect(0,0,W,H);
    const X=x=>P+(W-2*P)*(x+2)/6, Y=y=>H/2-(H/2-P)*y/6;
    ctx.strokeStyle='#E5E7EB'; ctx.beginPath(); ctx.moveTo(P,Y(0)); ctx.lineTo(W-P,Y(0)); ctx.stroke();
    ctx.fillStyle='rgba(37,99,235,.07)'; ctx.fillRect(X(Math.min(a,b)),P-6,Math.abs(X(b)-X(a)),H-P-(P-6));
    ctx.strokeStyle='#2563EB'; ctx.lineWidth=2.2; ctx.beginPath();
    for(let px=0;px<=320;px++){ const x=-2+6*px/320, y=Math.max(-6,Math.min(6,f(x)));
      px?ctx.lineTo(X(x),Y(y)):ctx.moveTo(X(x),Y(y)); }
    ctx.stroke();
    const fa=f(a), fb=f(b);
    ctx.fillStyle=fa<0?'#BE123C':'#0E9384'; ctx.beginPath(); ctx.arc(X(a),Y(Math.max(-6,Math.min(6,fa))),4.6,0,7); ctx.fill();
    ctx.fillStyle=fb<0?'#BE123C':'#0E9384'; ctx.beginPath(); ctx.arc(X(b),Y(Math.max(-6,Math.min(6,fb))),4.6,0,7); ctx.fill();
    ctx.fillStyle='#6B7280'; ctx.font='10.5px sans-serif'; ctx.textAlign='left';
    ctx.fillText('붉은 = 음수, 초록 = 양수', P, P-16);
    ctx.fillText('f(x) = x³ − x − 1', P, H-14);
    const diff=fa*fb<0, w=Math.abs(b-a), mid=(a+b)/2;
    const dig = w<0.005 ? 3 : (w<0.05 ? 2 : (w<0.5 ? 1 : 0));
    $('#ivout').innerHTML =
      `<span class="mono">f(${a.toFixed(3)}) = <b style="color:${fa<0?'#BE123C':'#0E9384'}">${fa.toFixed(4)}</b>`
      + ` &nbsp; f(${b.toFixed(3)}) = <b style="color:${fb<0?'#BE123C':'#0E9384'}">${fb.toFixed(4)}</b></span><br>`
      + `<span class="mono">구간 폭 = ${w.toFixed(4)} · 자른 횟수 ${S.cuts}회</span><br>`
      + (diff ? `<b style="color:#7C3AED">부호가 달라 — 이 구간 안에 근이 반드시 있습니다.</b><br>`
              : `부호가 같아 — 이 구간만으로는 근이 있는지 알 수 없습니다.<br>`)
      + (diff && w<0.01 ? `<b style="color:#B45309">근을 소수 둘째 자리까지 확정 — 근 ≈ ${mid.toFixed(2)}</b><br>` : '')
      + `<span style="color:#6B7280;font-size:12.5px">한 번 자를 때마다 구간 폭이 절반이 됩니다 — ${dig} 자리까지 좁혀졌습니다.</span>`;
  }
  $('#ivHalf').onclick=()=>{
    const mid=(S.a+S.b)/2;
    if(f(S.a)*f(mid)<=0) S.b=mid; else S.a=mid;
    S.cuts++; draw(); };
  $('#ivReset').onclick=()=>{ $('#ivA').value=0; $('#ivB').value=1; S.a=0; S.b=1; S.cuts=0; draw(); };
  ['ivA','ivB'].forEach(i=>$('#'+i).oninput=()=>{ S.a=+$('#ivA').value; S.b=+$('#ivB').value; S.cuts=0; draw(); }); draw();
  inquiry(root,{ id:'iv', title:'사잇값 정리 — 부호가 알려 주는 근',
    q:['부호가 다른 구간을 찾고, 반으로 자르기를 8번 이상 눌러 근을 좁히세요.',
       '(자른 횟수, 구간 폭, 중점) 을 표로 남기세요 — 폭은 어떤 규칙으로 줄어드나요?',
       '이 방법이 통하려면 함수에 어떤 성질이 필요한지 쓰세요.'],
    cols:['a','b','f(a) 부호','f(b) 부호','폭','중점'],
    hint:'힌트 — [1, 2] 에서 시작해 보세요. f(1) = −1, f(2) = 5 입니다.',
    read:()=>{ const a=S.a,b=S.b;
      return [a.toFixed(4),b.toFixed(4),f(a)<0?'−':'+',f(b)<0?'−':'+',Math.abs(b-a).toFixed(4),((a+b)/2).toFixed(4)]; } });
}

/* ---------- LAB 131 최대·최소 정리 — 닫아야 보장된다 ---------- */
function evtDemo(root){
  root.innerHTML=`<div class="row"><div class="col">
      <canvas id="ev1" width="380" height="300"></canvas>
      <div class="note" style="margin-top:8px">같은 함수라도 <b>구간을 어떻게 잡느냐</b>에 따라
      최댓값이 있기도, 없기도 합니다.</div>
    </div>
    <div class="col">
      <label class="ctl">구간 <select id="evI" style="width:100%;padding:7px 9px;border:1px solid #E5E7EB;border-radius:8px;font:inherit">
        <option value="cl">① 닫힌구간 [0, 4] — 양 끝 포함</option>
        <option value="op">② 열린구간 (0, 4) — 양 끝 제외</option>
      </select></label>
      <label class="ctl" style="margin-top:8px">함수 <select id="evF" style="width:100%;padding:7px 9px;border:1px solid #E5E7EB;border-radius:8px;font:inherit">
        <option value="cont">③ 이어진 함수</option>
        <option value="jump">④ 중간에 끊긴 함수</option>
      </select></label>
      <div class="out" id="evout"></div>
      <div class="note" style="margin-top:12px">최대·최소 정리 — <b>닫힌구간에서 연속</b>이면
      최댓값과 최솟값이 반드시 있습니다. 두 조건 중 하나만 빠져도 보장이 사라집니다.</div>
    </div></div>`;
  const cv=$('#ev1'),ctx=cv.getContext('2d'),W=380,H=300,P=38;
  function g(x,kind){ return kind==='jump' ? (x<2 ? 1+1.4*x : 1+1.4*x-2.6) : 1+1.4*x; }
  function draw(){
    const iv=$('#evI').value, kind=$('#evF').value;
    ctx.clearRect(0,0,W,H); ctx.fillStyle='#fff'; ctx.fillRect(0,0,W,H);
    const X=x=>P+(W-2*P)*x/4, Y=y=>H-P-(H-2*P)*y/7.2;
    ctx.strokeStyle='#9CA3AF'; ctx.lineWidth=1;
    ctx.beginPath(); ctx.moveTo(P,H-P); ctx.lineTo(W-P,H-P); ctx.stroke();
    ctx.fillStyle='#6B7280'; ctx.font='10px sans-serif'; ctx.textAlign='center';
    for(let q=0;q<=4;q++) ctx.fillText(q, X(q), H-P+14);
    ctx.strokeStyle='#2563EB'; ctx.lineWidth=2.4;
    const segs = kind==='jump' ? [[0,1.98],[2,4]] : [[0,4]];
    segs.forEach(sg=>{ ctx.beginPath();
      for(let px=0;px<=180;px++){ const x=sg[0]+(sg[1]-sg[0])*px/180, y=g(x,kind);
        px?ctx.lineTo(X(x),Y(y)):ctx.moveTo(X(x),Y(y)); } ctx.stroke(); });
    const mark=(x,y,filled)=>{ ctx.lineWidth=1.8; ctx.strokeStyle='#BE123C';
      if(filled){ ctx.fillStyle='#BE123C'; ctx.beginPath(); ctx.arc(X(x),Y(y),4.6,0,7); ctx.fill(); }
      else { ctx.fillStyle='#fff'; ctx.beginPath(); ctx.arc(X(x),Y(y),4.6,0,7); ctx.fill(); ctx.stroke(); } };
    mark(0,g(0,kind), iv==='cl'); mark(4,g(4,kind), iv==='cl');
    if(kind==='jump'){ ctx.fillStyle='#fff'; ctx.strokeStyle='#2563EB'; ctx.lineWidth=1.8;
      ctx.beginPath(); ctx.arc(X(2),Y(g(1.999,'jump')),4.2,0,7); ctx.fill(); ctx.stroke(); }
    ctx.fillStyle='#6B7280'; ctx.font='10.5px sans-serif'; ctx.textAlign='left';
    ctx.fillText(iv==='cl'?'속 찬 점 = 포함되는 끝점':'빈 점 = 포함되지 않는 끝점', P, P-16);
    const sup=g(4,kind), inf=g(0,kind);
    const hasMax = iv==='cl' && kind==='cont' ? true : (iv==='cl' && kind==='jump' ? true : false);
    let msg;
    if(iv==='cl' && kind==='cont') msg = `닫힌구간 + 연속 — 최댓값 ${sup.toFixed(1)}, 최솟값 ${inf.toFixed(1)} 이 <b>반드시</b> 있습니다.`;
    else if(iv==='op') msg = `<b style="color:#B45309">열린구간이라 — 최댓값이 없습니다 (${sup.toFixed(1)} 에 다가가지만 도달하지 못함).</b>`;
    else msg = `<b style="color:#7C3AED">끊긴 함수라 — 왼쪽 조각의 최댓값이 없습니다 (x = 2 직전에 다가가지만 그 값을 갖지 못함).</b>`;
    $('#evout').innerHTML =
      `<span class="mono">구간 ${iv==='cl'?'[0, 4] 닫힘':'(0, 4) 열림'} · 함수 ${kind==='cont'?'연속':'x = 2 에서 끊김'}</span><br>`
      + `<span class="mono">양 끝 값 f(0) = ${inf.toFixed(1)}, f(4) = ${sup.toFixed(1)}</span><br>`
      + msg + `<br>`
      + `<span style="color:#6B7280;font-size:12.5px">「가장 큰 값이 있다」와 「값이 위로 막혀 있다」는 서로 다른 말입니다.</span>`;
  }
  ['evI','evF'].forEach(i=>$('#'+i).onchange=draw); draw();
  inquiry(root,{ id:'ev', title:'최대·최소 정리 — 두 조건이 다 필요하다',
    q:['네 조합(닫힘·열림 × 연속·끊김) 을 모두 만들어 최댓값의 존재 여부를 기록하세요.',
       '최댓값이 없는데도 「값이 위로 막혀 있는」 경우를 설명하세요.',
       '최적화 문제에서 왜 구간을 닫아 주는지 한 문장으로 쓰세요.'],
    cols:['구간','함수','최댓값','최솟값','보장되나'],
    hint:'힌트 — 열린구간에서는 「끝에 다가가지만 도달하지 못하는」 것이 핵심입니다.',
    read:()=>{ const iv=$('#evI').value, kind=$('#evF').value;
      const ok = iv==='cl' && kind==='cont';
      return [iv==='cl'?'닫힘':'열림', kind==='cont'?'연속':'끊김',
        ok?g(4,kind).toFixed(1):'없음', ok?g(0,kind).toFixed(1):'없음', ok?'보장':'보장 안 됨']; } });
}


/* ---------- LAB 132 미분 불가능한 점 — 뾰족한 곳에는 접선이 없다 ---------- */
function cuspDemo(root){
  root.innerHTML=`<div class="row"><div class="col">
      <canvas id="cu1" width="380" height="300"></canvas>
      <div class="note" style="margin-top:8px">한 점에서 <b>왼쪽 기울기</b>와 <b>오른쪽 기울기</b>를 각각 재 봅니다.
      두 값이 다르면 접선을 하나로 정할 수 없습니다.</div>
    </div>
    <div class="col">
      <label class="ctl">그래프 고르기<select id="cuK" style="width:100%;padding:7px 9px;border:1px solid #E5E7EB;border-radius:8px;font:inherit">
        <option value="smooth">① 매끄러운 곡선 — y = 0.4x²</option>
        <option value="abs">② 꺾인 그래프 — y = |x| (ReLU 의 꺾인 점)</option>
        <option value="jump">③ 끊긴 그래프 — 계단</option>
      </select></label>
      ${slider('cuH','기울기를 재는 간격 h',1,60,1,20,'')}
      <div class="out" id="cuout"></div>
      <div class="note" style="margin-top:12px">미분계수는 <b>평균변화율의 극한</b>입니다.
      좌·우 극한이 같아야 「그 점의 기울기」가 하나로 정해집니다.</div>
    </div></div>`;
  const cv=$('#cu1'),ctx=cv.getContext('2d'),W=380,H=300,P=38;
  const g={ smooth:x=>0.4*x*x, abs:x=>Math.abs(x), jump:x=>x<0?-1:1 };
  const hval=i=>Math.pow(10,-(i/20)+0.3);
  function draw(){
    const k=$('#cuK').value, h=hval(+$('#cuH').value);
    $('#cuHv').textContent=h.toFixed(4);
    const X=x=>W/2+(W-2*P)*x/6, Y=y=>H-P-(H-2*P)*(y+1.4)/4.6;
    ctx.clearRect(0,0,W,H); ctx.fillStyle='#fff'; ctx.fillRect(0,0,W,H);
    ctx.strokeStyle='#E5E7EB'; ctx.lineWidth=1;
    ctx.beginPath(); ctx.moveTo(P,Y(0)); ctx.lineTo(W-P,Y(0)); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(X(0),P-6); ctx.lineTo(X(0),H-P); ctx.stroke();
    ctx.strokeStyle='#2563EB'; ctx.lineWidth=2.4;
    if(k==='jump'){
      ctx.beginPath(); ctx.moveTo(X(-3),Y(-1)); ctx.lineTo(X(-0.02),Y(-1)); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(X(0.02),Y(1)); ctx.lineTo(X(3),Y(1)); ctx.stroke();
    }else{
      ctx.beginPath();
      for(let px=0;px<=300;px++){ const x=-3+6*px/300, y=g[k](x);
        px?ctx.lineTo(X(x),Y(y)):ctx.moveTo(X(x),Y(y)); }
      ctx.stroke();
    }
    const sl=(g[k](0)-g[k](-h))/h, sr=(g[k](h)-g[k](0))/h;
    const seg=(x1,y1,x2,y2,c)=>{ ctx.strokeStyle=c; ctx.lineWidth=2; ctx.beginPath();
      ctx.moveTo(X(x1),Y(y1)); ctx.lineTo(X(x2),Y(y2)); ctx.stroke(); };
    if(isFinite(sl)) seg(-h-1.2, g[k](0)-sl*(1.2+h), 1.2, g[k](0)+sl*1.2, '#BE123C');
    if(isFinite(sr)) seg(-1.2, g[k](0)-sr*1.2, h+1.2, g[k](0)+sr*(1.2+h), '#0E9384');
    ctx.fillStyle='#111827'; ctx.beginPath(); ctx.arc(X(0),Y(g[k](0)),4.2,0,7); ctx.fill();
    ctx.fillStyle='#6B7280'; ctx.font='10.5px sans-serif'; ctx.textAlign='left';
    ctx.fillText('붉은 = 왼쪽 기울기, 초록 = 오른쪽 기울기', P, P-16);
    const same=Math.abs(sl-sr)<0.02, big=Math.abs(sl)>50||Math.abs(sr)>50;
    $('#cuout').innerHTML =
      `<span class="mono">왼쪽 (f(0)−f(−h))/h = <b style="color:#BE123C">${isFinite(sl)?sl.toFixed(4):'—'}</b></span><br>`
      + `<span class="mono">오른쪽 (f(h)−f(0))/h = <b style="color:#0E9384">${isFinite(sr)?sr.toFixed(4):'—'}</b></span><br>`
      + `<span class="mono">간격 h = ${h.toFixed(4)}</span><br>`
      + (k==='smooth' ? `h 를 줄이면 두 값이 <b>0</b> 으로 함께 모입니다 — 미분계수가 있습니다.<br>` : '')
      + (k==='abs' ? `<b style="color:#B45309">한쪽은 −1, 다른 쪽은 +1 — h 를 줄여도 만나지 않아 미분할 수 없습니다.</b><br>` : '')
      + (k==='jump' ? `<b style="color:#7C3AED">끊긴 자리 — 기울기가 무한히 커져 접선을 그릴 수 없습니다.</b><br>` : '')
      + `<span style="color:#6B7280;font-size:12.5px">「미분 가능하면 연속」이지만 그 역은 성립하지 않습니다.</span>`;
  }
  $('#cuK').onchange=draw; $('#cuH').oninput=draw; draw();
  inquiry(root,{ id:'cu', title:'미분 가능성 — 좌우 기울기가 만나야 한다',
    q:['세 그래프에서 h 를 줄이며 (왼쪽 기울기, 오른쪽 기울기) 를 기록하세요.',
       '어느 경우에 두 값이 하나로 모이나요? 모이지 않는 이유는 무엇인가요?',
       '「연속이지만 미분 불가능」한 예를 하나 들고 이유를 쓰세요.'],
    cols:['그래프','h','왼쪽','오른쪽','미분 가능'],
    hint:'힌트 — y = |x| 는 x = 0 에서 이어져 있지만 꺾여 있습니다.',
    read:()=>{ const k=$('#cuK').value,h=hval(+$('#cuH').value);
      const sl=(g[k](0)-g[k](-h))/h, sr=(g[k](h)-g[k](0))/h;
      return [{smooth:'매끄러움',abs:'꺾임',jump:'끊김'}[k],h.toFixed(4),
        isFinite(sl)?sl.toFixed(3):'—',isFinite(sr)?sr.toFixed(3):'—',Math.abs(sl-sr)<0.02?'가능':'불가능']; } });
}

/* ---------- LAB 133 접선과 법선 — 표면이 향하는 방향 ---------- */
function tangentDemo(root){
  root.innerHTML=`<div class="row"><div class="col">
      <canvas id="tg1" width="380" height="300"></canvas>
      <div class="note" style="margin-top:8px">곡선 위 한 점에서 <b>접선</b>(진행 방향)과 <b>법선</b>(면이 바라보는 방향)을
      함께 그립니다. 두 직선은 항상 수직입니다.</div>
    </div>
    <div class="col">
      ${slider('tgA','접점의 x 좌표',-2,2,0.1,1,'')}
      ${slider('tgC','곡선의 계수 a  (y = ax²)',0.2,1.5,0.1,0.5,'')}
      <div class="ctl" style="margin-top:8px"><label><input type="checkbox" id="tgN" checked> 법선도 그리기</label></div>
      <div class="out" id="tgout"></div>
      <div class="note" style="margin-top:12px">법선의 기울기는 −1/m 입니다.
      −m 이 아닙니다 — <b>수직 조건은 곱해서 −1</b>입니다.</div>
    </div></div>`;
  const cv=$('#tg1'),ctx=cv.getContext('2d'),W=380,H=300,P=34;
  function draw(){
    const a=+$('#tgA').value, c=+$('#tgC').value, showN=$('#tgN').checked;
    $('#tgAv').textContent=a.toFixed(1); $('#tgCv').textContent=c.toFixed(1);
    const f=x=>c*x*x, m=2*c*a, y0=f(a);
    const X=x=>W/2+64*x, Y=y=>H-P-52*y;
    ctx.clearRect(0,0,W,H); ctx.fillStyle='#fff'; ctx.fillRect(0,0,W,H);
    ctx.strokeStyle='#E5E7EB'; ctx.lineWidth=1;
    ctx.beginPath(); ctx.moveTo(P,Y(0)); ctx.lineTo(W-P,Y(0)); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(X(0),P-14); ctx.lineTo(X(0),H-P); ctx.stroke();
    ctx.strokeStyle='#2563EB'; ctx.lineWidth=2.4; ctx.beginPath();
    for(let px=0;px<=300;px++){ const x=-2.6+5.2*px/300, y=f(x);
      px?ctx.lineTo(X(x),Y(y)):ctx.moveTo(X(x),Y(y)); }
    ctx.stroke();
    ctx.strokeStyle='#BE123C'; ctx.lineWidth=2; ctx.beginPath();
    ctx.moveTo(X(a-2),Y(y0-2*m)); ctx.lineTo(X(a+2),Y(y0+2*m)); ctx.stroke();
    if(showN && Math.abs(m)>1e-9){ const n=-1/m;
      ctx.strokeStyle='#0E9384'; ctx.setLineDash([5,4]); ctx.beginPath();
      ctx.moveTo(X(a-1),Y(y0-n)); ctx.lineTo(X(a+1),Y(y0+n)); ctx.stroke(); ctx.setLineDash([]); }
    ctx.fillStyle='#111827'; ctx.beginPath(); ctx.arc(X(a),Y(y0),4.4,0,7); ctx.fill();
    ctx.fillStyle='#6B7280'; ctx.font='10.5px sans-serif'; ctx.textAlign='left';
    ctx.fillText('붉은 실선 = 접선, 초록 점선 = 법선', P, P-20);
    const prod = Math.abs(m)>1e-9 ? m*(-1/m) : null;
    $('#tgout').innerHTML =
      `<span class="mono">접점 (${a.toFixed(2)}, ${y0.toFixed(2)}) · f′(x) = 2ax → m = <b>${m.toFixed(3)}</b></span><br>`
      + `<span class="mono">접선 y = ${m.toFixed(2)}(x − ${a.toFixed(2)}) + ${y0.toFixed(2)}</span><br>`
      + (Math.abs(m)>1e-9
          ? `<span class="mono">법선 기울기 = −1/m = <b>${(-1/m).toFixed(3)}</b> · 두 기울기의 곱 = <b>${prod.toFixed(1)}</b></span><br>`
          : `<b style="color:#7C3AED">기울기 0 — 접선이 수평이고 법선은 수직선입니다 (여기가 극값 후보).</b><br>`)
      + (Math.abs(m)>1e-9 && Math.abs(prod+1)<1e-6 ? `두 직선이 <b style="color:#0E9384">수직</b>임이 곱 −1 로 확인됩니다.<br>` : '')
      + (m<-1e-9 ? `<b style="color:#7C3AED">기울기가 음수 — 접선이 내려가고 법선은 올라갑니다.</b><br>` : '')
      + `<span style="color:#6B7280;font-size:12.5px">접점을 옮기면 기울기가 어떻게 변하는지 표로 남겨 보세요.</span>`;
  }
  ['tgA','tgC'].forEach(i=>$('#'+i).oninput=draw); $('#tgN').onchange=draw; draw();
  inquiry(root,{ id:'tg', title:'접선과 법선 — 곱해서 −1',
    q:['접점을 옮기며 (x, f′(x), 법선 기울기, 곱) 을 다섯 줄 기록하세요.',
       '접선의 기울기가 0 이 되는 점은 그래프에서 어떤 자리인가요?',
       '법선을 −m 으로 잘못 두면 어떤 그림이 되는지 설명하세요.'],
    cols:['x','y','접선 m','법선','곱'],
    hint:'힌트 — 수직 조건은 두 기울기의 곱이 −1 입니다.',
    read:()=>{ const a=+$('#tgA').value,c=+$('#tgC').value,m=2*c*a;
      return [a.toFixed(2),(c*a*a).toFixed(2),m.toFixed(3),
        Math.abs(m)>1e-9?(-1/m).toFixed(3):'수직선', Math.abs(m)>1e-9?'−1':'—']; } });
}

/* ---------- LAB 134 도함수의 부호 — 그래프의 오르내림을 읽는 법 ---------- */
function signDerivDemo(root){
  root.innerHTML=`<div class="row"><div class="col">
      <canvas id="sg1" width="380" height="330"></canvas>
      <div class="note" style="margin-top:8px">위는 f(x), 아래는 f′(x) 입니다.
      <b>f′ 이 0 을 지나는 자리</b>와 f 의 봉우리·골짜기를 눈으로 맞춰 보세요.</div>
    </div>
    <div class="col">
      ${slider('sgB','f(x) = x³ + bx 의 b',-4,4,0.5,-3,'')}
      <div class="ctl" style="display:flex;gap:6px;flex-wrap:wrap;margin-top:8px">
        <button class="b g sm" id="sgMark">극값 자리 표시</button>
        <button class="b g sm" id="sgZero">b 를 0 으로</button>
      </div>
      <div class="out" id="sgout"></div>
      <div class="note" style="margin-top:12px">f′ &gt; 0 이면 증가, f′ &lt; 0 이면 감소.
      f′ 이 <b>부호를 바꾸는</b> 자리에서만 극값이 생깁니다.</div>
    </div></div>`;
  const cv=$('#sg1'),ctx=cv.getContext('2d'),W=380,H=330,P=30;
  const S={ mark:false };
  function draw(){
    const b=+$('#sgB').value; $('#sgBv').textContent=b.toFixed(1);
    const f=x=>x*x*x+b*x, d=x=>3*x*x+b;
    const X=x=>W/2+52*x, Yu=y=>84-16*Math.max(-5,Math.min(5,y)), Yd=y=>250-14*Math.max(-6,Math.min(6,y));
    ctx.clearRect(0,0,W,H); ctx.fillStyle='#fff'; ctx.fillRect(0,0,W,H);
    ctx.strokeStyle='#E5E7EB'; ctx.lineWidth=1;
    ctx.beginPath(); ctx.moveTo(P,Yu(0)); ctx.lineTo(W-P,Yu(0)); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(P,Yd(0)); ctx.lineTo(W-P,Yd(0)); ctx.stroke();
    ctx.strokeStyle='#2563EB'; ctx.lineWidth=2.4; ctx.beginPath();
    for(let px=0;px<=300;px++){ const x=-2.6+5.2*px/300; px?ctx.lineTo(X(x),Yu(f(x))):ctx.moveTo(X(x),Yu(f(x))); }
    ctx.stroke();
    ctx.strokeStyle='#0E9384'; ctx.lineWidth=2.2; ctx.beginPath();
    for(let px=0;px<=300;px++){ const x=-2.6+5.2*px/300; px?ctx.lineTo(X(x),Yd(d(x))):ctx.moveTo(X(x),Yd(d(x))); }
    ctx.stroke();
    ctx.fillStyle='#6B7280'; ctx.font='10.5px sans-serif'; ctx.textAlign='left';
    ctx.fillText('f(x) = x³ + bx', P, 22); ctx.fillText("f′(x) = 3x² + b", P, 176);
    let roots=[];
    if(b<0){ const r=Math.sqrt(-b/3); roots=[-r,r]; }
    if(S.mark && roots.length){ roots.forEach(r=>{
      ctx.setLineDash([4,4]); ctx.strokeStyle='#BE123C'; ctx.lineWidth=1.2;
      ctx.beginPath(); ctx.moveTo(X(r),40); ctx.lineTo(X(r),H-P); ctx.stroke(); ctx.setLineDash([]);
      ctx.fillStyle='#BE123C'; ctx.beginPath(); ctx.arc(X(r),Yu(f(r)),4.2,0,7); ctx.fill();
      ctx.beginPath(); ctx.arc(X(r),Yd(0),3.6,0,7); ctx.fill(); }); }
    const cnt=roots.length;
    $('#sgout').innerHTML =
      `<span class="mono">f′(x) = 3x² + ${b.toFixed(1)}</span><br>`
      + (cnt===2
        ? `<span class="mono">f′ = 0 인 x = ${roots.map(r=>r.toFixed(3)).join(', ')}</span><br>`
          + `극댓값 <b>${f(roots[0]).toFixed(2)}</b> (x = ${roots[0].toFixed(2)}) · 극솟값 <b>${f(roots[1]).toFixed(2)}</b> (x = ${roots[1].toFixed(2)})<br>`
          + `<b style="color:#B45309">봉우리와 골짜기가 각각 하나 — f′ 이 부호를 두 번 바꿉니다.</b><br>`
        : `<b style="color:#7C3AED">f′ 이 늘 0 이상이라 봉우리도 골짜기도 없습니다 — 계속 증가만 합니다.</b><br>`)
      + (S.mark && cnt===2 ? `표시된 두 자리에서 아래 그래프가 정확히 0 을 지납니다.<br>` : '')
      + `<span style="color:#6B7280;font-size:12.5px">아래 그래프의 부호가 위 그래프의 오르내림을 그대로 예고합니다.</span>`;
  }
  $('#sgMark').onclick=()=>{ S.mark=true; draw(); };
  $('#sgZero').onclick=()=>{ $('#sgB').value=0; S.mark=false; draw(); };
  $('#sgB').oninput=()=>{ S.mark=false; draw(); }; draw();
  inquiry(root,{ id:'sg', title:'도함수의 부호 — 오르내림의 예고편',
    q:['b 를 −4 에서 4 까지 옮기며 (b, 극값 개수, 극댓값, 극솟값) 을 기록하세요.',
       '극값이 사라지는 경계의 b 를 찾고 그 이유를 f′ 의 판별식으로 설명하세요.',
       '「f′ = 0 이면 극값」이 왜 틀린 말인지 b = 0 의 경우로 반박하세요.'],
    cols:['b','f′=0 개수','극댓값','극솟값','증가 구간'],
    hint:'힌트 — 3x² + b = 0 이 실근을 가지려면 b 가 어떤 부호여야 하나요?',
    read:()=>{ const b=+$('#sgB').value, f=x=>x*x*x+b*x;
      if(b<0){ const r=Math.sqrt(-b/3);
        return [b.toFixed(1),2,f(-r).toFixed(2),f(r).toFixed(2),'x<'+(-r).toFixed(2)+', x>'+r.toFixed(2)]; }
      return [b.toFixed(1), b===0?1:0, '없음','없음','전체']; } });
}

/* ---------- LAB 135 최적화 — 종이 한 장으로 만드는 가장 큰 상자 ---------- */
function boxOptDemo(root){
  root.innerHTML=`<div class="row"><div class="col">
      <canvas id="bx1" width="380" height="330"></canvas>
      <div class="note" style="margin-top:8px">네 모서리를 <b>x 만큼</b> 잘라 접으면 상자가 됩니다.
      x 를 키우면 높이는 늘지만 바닥이 줄어듭니다.</div>
    </div>
    <div class="col">
      ${slider('bxW','종이 가로',20,40,1,30,'cm')}
      ${slider('bxH','종이 세로',20,40,1,30,'cm')}
      ${slider('bxX','잘라내는 길이 x',0.5,12,0.1,2,'cm')}
      <div class="ctl" style="margin-top:8px"><button class="b g sm" id="bxOpt">부피가 최대인 x 로</button></div>
      <div class="out" id="bxout"></div>
      <div class="note" style="margin-top:12px">V(x) = x(W − 2x)(H − 2x).
      V′(x) = 0 을 푸는 것이 곧 <b>가장 큰 상자를 찾는 일</b>입니다.</div>
    </div></div>`;
  const cv=$('#bx1'),ctx=cv.getContext('2d'),W0=380,H0=330,P=34;
  function draw(){
    const w=+$('#bxW').value, hh=+$('#bxH').value, x=+$('#bxX').value;
    $('#bxWv').textContent=w+'cm'; $('#bxHv').textContent=hh+'cm'; $('#bxXv').textContent=x.toFixed(1)+'cm';
    const V=t=>t*(w-2*t)*(hh-2*t), xmax=Math.min(w,hh)/2;
    ctx.clearRect(0,0,W0,H0); ctx.fillStyle='#fff'; ctx.fillRect(0,0,W0,H0);
    const sc=110/Math.max(w,hh), ox=40, oy=24;
    ctx.fillStyle='rgba(37,99,235,.10)'; ctx.fillRect(ox,oy,w*sc,hh*sc);
    ctx.strokeStyle='#2563EB'; ctx.lineWidth=1.4; ctx.strokeRect(ox,oy,w*sc,hh*sc);
    const cx=x*sc;
    [[0,0],[w*sc-cx,0],[0,hh*sc-cx],[w*sc-cx,hh*sc-cx]].forEach(c=>{
      ctx.fillStyle='rgba(190,18,60,.28)'; ctx.fillRect(ox+c[0],oy+c[1],cx,cx);
      ctx.strokeStyle='#BE123C'; ctx.lineWidth=1; ctx.strokeRect(ox+c[0],oy+c[1],cx,cx); });
    ctx.fillStyle='#6B7280'; ctx.font='10.5px sans-serif'; ctx.textAlign='left';
    ctx.fillText('붉은 = 잘라내는 정사각형', ox, oy-8);
    const gx=v=>ox+(300)*v/xmax, gy=v=>H0-P-(120)*v/Math.max(1,V(bestX()));
    ctx.strokeStyle='#0E9384'; ctx.lineWidth=2.4; ctx.beginPath();
    for(let px=1;px<=300;px++){ const t=xmax*px/300, v=Math.max(0,V(t));
      px>1?ctx.lineTo(gx(t),gy(v)):ctx.moveTo(gx(t),gy(v)); }
    ctx.stroke();
    ctx.fillStyle='#BE123C'; ctx.beginPath(); ctx.arc(gx(x),gy(Math.max(0,V(x))),4.6,0,7); ctx.fill();
    ctx.fillStyle='#6B7280'; ctx.fillText('V(x) 그래프 — 봉우리가 최대 부피', ox, H0-P+16);
    const bx=bestX(), bv=V(bx), near=Math.abs(x-bx)<0.15;
    $('#bxout').innerHTML =
      `<span class="mono">V(x) = x(${w} − 2x)(${hh} − 2x) = <b>${V(x).toFixed(1)}</b> cm³</span><br>`
      + `<span class="mono">바닥 ${(w-2*x).toFixed(1)} × ${(hh-2*x).toFixed(1)} · 높이 ${x.toFixed(1)}</span><br>`
      + (near ? `<b style="color:#B45309">최대 부피 지점 — x = ${bx.toFixed(2)}cm 에서 ${bv.toFixed(1)} cm³ 입니다.</b><br>` : '')
      + (x>=xmax-0.05 ? `<b style="color:#7C3AED">더 자르면 바닥이 사라져 부피가 0 — 정의역의 오른쪽 끝입니다.</b><br>` : '')
      + `<span style="color:#6B7280;font-size:12.5px">정의역은 0 &lt; x &lt; ${xmax.toFixed(1)} — 양 끝에서 부피는 0 입니다.</span>`;
  }
  function bestX(){ const w=+$('#bxW').value, hh=+$('#bxH').value;
    const a=12, b=-4*(w+hh), c=w*hh, D=b*b-4*a*c;
    return (-b-Math.sqrt(D))/(2*a); }
  $('#bxOpt').onclick=()=>{ $('#bxX').value=bestX().toFixed(1); draw(); };
  ['bxW','bxH','bxX'].forEach(i=>$('#'+i).oninput=draw); draw();
  inquiry(root,{ id:'bx', title:'최적화 — 가장 큰 상자',
    q:['(가로, 세로, 최적 x, 최대 부피) 를 네 조합 이상 기록하세요.',
       '정사각형 종이일 때 최적 x 와 한 변의 비를 구하세요 — 항상 같은 비인가요?',
       'V′(x) = 0 을 손으로 풀어 화면의 최적 x 와 맞는지 확인하세요.'],
    cols:['가로','세로','x','부피','최적인가'],
    hint:'힌트 — V(x) = x(W−2x)(H−2x) 를 전개해 미분하면 이차방정식이 됩니다.',
    read:()=>{ const w=+$('#bxW').value,hh=+$('#bxH').value,x=+$('#bxX').value;
      return [w,hh,x.toFixed(1),(x*(w-2*x)*(hh-2*x)).toFixed(1),Math.abs(x-bestX())<0.15?'최적':'아직']; } });
}

/* ---------- LAB 136 위치·속도·가속도 — 엘리베이터의 3층 그래프 ---------- */
function motionDemo(root){
  root.innerHTML=`<div class="row"><div class="col">
      <canvas id="mo1" width="380" height="330"></canvas>
      <div class="note" style="margin-top:8px">위부터 <b>위치 · 속도 · 가속도</b>입니다.
      위 그래프의 기울기가 아래 그래프의 값이 됩니다.</div>
    </div>
    <div class="col">
      ${slider('moT','시각 t',0,10,0.1,1,'초')}
      <label class="ctl" style="margin-top:8px">운동 고르기<select id="moK" style="width:100%;padding:7px 9px;border:1px solid #E5E7EB;border-radius:8px;font:inherit">
        <option value="up">① 올라갔다가 멈추는 엘리베이터</option>
        <option value="back">② 올라갔다 되돌아오는 운동</option>
      </select></label>
      <div class="out" id="moout"></div>
      <div class="note" style="margin-top:12px">속도의 <b>부호</b>가 방향입니다.
      되돌아오는 구간을 크기만으로 그리면 왕복이 사라져 버립니다.</div>
    </div></div>`;
  const cv=$('#mo1'),ctx=cv.getContext('2d'),W=380,H=330,P=30;
  const F={ up:{ s:t=>t<=6? 0.5*t*t : 18+6*(t-6)-0.5*(t-6)*(t-6)*1.0, v:t=>t<=6? t : 6-(t-6), a:t=>t<=6?1:-1 },
            back:{ s:t=>-0.5*t*t+4*t, v:t=>-t+4, a:()=>-1 } };
  function draw(){
    const t=+$('#moT').value, k=$('#moK').value, C=F[k];
    $('#moTv').textContent=t.toFixed(1)+'초';
    const X=x=>P+(W-2*P)*x/10;
    const rows=[{y:72,f:C.s,c:'#2563EB',n:'위치 s(t)',sc:2.6},{y:180,f:C.v,c:'#0E9384',n:'속도 v(t) = s′(t)',sc:8},
                {y:280,f:C.a,c:'#BE123C',n:'가속도 a(t) = v′(t)',sc:16}];
    ctx.clearRect(0,0,W,H); ctx.fillStyle='#fff'; ctx.fillRect(0,0,W,H);
    rows.forEach(r=>{
      ctx.strokeStyle='#E5E7EB'; ctx.lineWidth=1;
      ctx.beginPath(); ctx.moveTo(P,r.y); ctx.lineTo(W-P,r.y); ctx.stroke();
      ctx.strokeStyle=r.c; ctx.lineWidth=2.2; ctx.beginPath();
      for(let px=0;px<=300;px++){ const x=10*px/300, y=r.y-r.sc*r.f(x);
        px?ctx.lineTo(X(x),y):ctx.moveTo(X(x),y); }
      ctx.stroke();
      ctx.fillStyle=r.c; ctx.beginPath(); ctx.arc(X(t),r.y-r.sc*r.f(t),4.2,0,7); ctx.fill();
      ctx.fillStyle='#6B7280'; ctx.font='10.5px sans-serif'; ctx.textAlign='left';
      ctx.fillText(r.n, P, r.y-42); });
    ctx.setLineDash([4,4]); ctx.strokeStyle='#9CA3AF'; ctx.lineWidth=1;
    ctx.beginPath(); ctx.moveTo(X(t),16); ctx.lineTo(X(t),H-10); ctx.stroke(); ctx.setLineDash([]);
    const v=C.v(t), a=C.a(t), turn = k==='back' ? 4 : null;
    $('#moout').innerHTML =
      `<span class="mono">t = ${t.toFixed(1)} · s = <b>${C.s(t).toFixed(2)}</b> · v = <b style="color:#0E9384">${v.toFixed(2)}</b> · a = <b style="color:#BE123C">${a.toFixed(2)}</b></span><br>`
      + (Math.abs(v)<0.06 ? `<b style="color:#B45309">속도가 0 — 방향이 바뀌는 순간이거나 멈춘 순간입니다.</b><br>` : '')
      + (v<-0.06 ? `<b style="color:#7C3AED">속도가 음수 — 되돌아오는 중입니다 (위치 그래프가 내려갑니다).</b><br>` : '')
      + (v>0.06 ? `속도가 양수 — 앞으로 나아가는 중입니다.<br>` : '')
      + (turn!==null ? `<span class="mono">되돌아오는 시각 t = ${turn} (v = 0 인 자리)</span><br>` : '')
      + `<span style="color:#6B7280;font-size:12.5px">위 그래프의 기울기를 눈으로 읽고 아래 그래프의 값과 맞춰 보세요.</span>`;
  }
  $('#moT').oninput=draw; $('#moK').onchange=draw; draw();
  inquiry(root,{ id:'mo', title:'위치·속도·가속도 — 기울기의 사슬',
    q:['t 를 옮기며 (t, s, v, a) 를 여섯 줄 기록하세요.',
       '속도가 0 이 되는 시각을 찾고 그때 위치 그래프가 어떤 모양인지 쓰세요.',
       '「속력」과 「속도」의 차이를 되돌아오는 운동으로 설명하세요.'],
    cols:['t','s','v','a','방향'],
    hint:'힌트 — 위치 그래프의 봉우리에서 속도가 0 입니다.',
    read:()=>{ const t=+$('#moT').value, C=F[$('#moK').value], v=C.v(t);
      return [t.toFixed(1),C.s(t).toFixed(2),v.toFixed(2),C.a(t).toFixed(2),
        Math.abs(v)<0.06?'정지':(v>0?'전진':'후진')]; } });
}


/* ---------- LAB 137 구분구적법 — 직사각형으로 곡선 아래를 메우다 ---------- */
function riemannDemo(root){
  root.innerHTML=`<div class="row"><div class="col">
      <canvas id="rm1" width="380" height="300"></canvas>
      <div class="note" style="margin-top:8px">직사각형 개수를 늘리면 <b>폭이 함께 줄어야</b> 합니다.
      개수만 늘리고 폭을 그대로 두면 넓이가 계속 커져 버립니다.</div>
    </div>
    <div class="col">
      ${slider('rmN','직사각형 개수 n',2,200,1,4,'개')}
      <label class="ctl" style="margin-top:8px">높이를 어디서 잴까<select id="rmM" style="width:100%;padding:7px 9px;border:1px solid #E5E7EB;border-radius:8px;font:inherit">
        <option value="left">왼쪽 끝</option>
        <option value="right">오른쪽 끝</option>
        <option value="mid">가운데</option>
      </select></label>
      <div class="out" id="rmout"></div>
      <div class="note" style="margin-top:12px">y = x² 를 0 부터 1 까지. 참값은 1/3 = 0.3333… 입니다.
      n 을 키우며 <b>어디서 재든 같은 값</b>으로 모이는지 보세요.</div>
    </div></div>`;
  const cv=$('#rm1'),ctx=cv.getContext('2d'),W=380,H=300,P=36;
  const f=x=>x*x;
  function draw(){
    const n=+$('#rmN').value, mode=$('#rmM').value;
    $('#rmNv').textContent=n+'개';
    const X=x=>P+(W-2*P)*x, Y=y=>H-P-(H-2*P)*y;
    ctx.clearRect(0,0,W,H); ctx.fillStyle='#fff'; ctx.fillRect(0,0,W,H);
    const dx=1/n; let sum=0;
    for(let i=0;i<n;i++){
      const xl=i*dx, xr=(i+1)*dx, xs= mode==='left'?xl:(mode==='right'?xr:(xl+xr)/2);
      const h=f(xs); sum+=h*dx;
      ctx.fillStyle='rgba(37,99,235,.24)'; ctx.fillRect(X(xl),Y(h),X(xr)-X(xl),Y(0)-Y(h));
      if(n<=40){ ctx.strokeStyle='#2563EB'; ctx.lineWidth=0.7; ctx.strokeRect(X(xl),Y(h),X(xr)-X(xl),Y(0)-Y(h)); }
    }
    ctx.strokeStyle='#BE123C'; ctx.lineWidth=2.4; ctx.beginPath();
    for(let px=0;px<=300;px++){ const x=px/300; px?ctx.lineTo(X(x),Y(f(x))):ctx.moveTo(X(x),Y(f(x))); }
    ctx.stroke();
    ctx.strokeStyle='#9CA3AF'; ctx.lineWidth=1;
    ctx.beginPath(); ctx.moveTo(P,Y(0)); ctx.lineTo(W-P,Y(0)); ctx.stroke();
    ctx.fillStyle='#6B7280'; ctx.font='10.5px sans-serif'; ctx.textAlign='left';
    ctx.fillText('y = x² · 구간 [0, 1] · 폭 Δx = 1/n', P, P-14);
    const err=Math.abs(sum-1/3);
    $('#rmout').innerHTML =
      `<span class="mono">Δx = 1/${n} = ${dx.toFixed(5)} · 합 = <b>${sum.toFixed(5)}</b></span><br>`
      + `<span class="mono">참값 1/3 = 0.33333 · 오차 = <b>${err.toFixed(5)}</b></span><br>`
      + (err<0.001 ? `<b style="color:#B45309">오차가 0.001 아래 — 참값 1/3 에 충분히 다가갔습니다.</b><br>` : '')
      + (mode==='mid' && n<=8 ? `<b style="color:#7C3AED">가운데에서 재면 적은 개수로도 오차가 작습니다 — 위아래 오차가 서로 상쇄됩니다.</b><br>` : '')
      + `<span style="color:#6B7280;font-size:12.5px">개수를 늘리면 폭이 줄어 전체 합은 한 값으로 모입니다.</span>`;
  }
  $('#rmN').oninput=draw; $('#rmM').onchange=draw; draw();
  inquiry(root,{ id:'rm', title:'구분구적법 — 쌓아서 재는 넓이',
    q:['n = 4, 10, 50, 200 에서 (합, 오차) 를 기록하세요.',
       '왼쪽·오른쪽·가운데 세 방식의 오차를 같은 n 에서 비교하세요.',
       '「n 을 늘린다」와 「폭을 줄인다」가 왜 함께 가야 하는지 쓰세요.'],
    cols:['n','재는 위치','Δx','합','오차'],
    hint:'힌트 — 왼쪽 끝은 늘 참값보다 작고, 오른쪽 끝은 늘 큽니다.',
    read:()=>{ const n=+$('#rmN').value, mode=$('#rmM').value, dx=1/n; let sum=0;
      for(let i=0;i<n;i++){ const xl=i*dx,xr=(i+1)*dx,xs=mode==='left'?xl:(mode==='right'?xr:(xl+xr)/2); sum+=f(xs)*dx; }
      return [n,{left:'왼쪽',right:'오른쪽',mid:'가운데'}[mode],dx.toFixed(5),sum.toFixed(5),Math.abs(sum-1/3).toFixed(5)]; } });
}

/* ---------- LAB 138 미적분의 기본정리 — 넓이를 미분하면 높이 ---------- */
function ftcDemo(root){
  root.innerHTML=`<div class="row"><div class="col">
      <canvas id="ft1" width="380" height="330"></canvas>
      <div class="note" style="margin-top:8px">위는 f(t), 아래는 <b>0 부터 x 까지의 넓이</b> A(x) 입니다.
      A 의 기울기가 f 의 높이와 같은지 확인하세요.</div>
    </div>
    <div class="col">
      ${slider('ftX','오른쪽 끝 x',0.2,4,0.1,1,'')}
      <label class="ctl" style="margin-top:8px">f(t) 고르기<select id="ftK" style="width:100%;padding:7px 9px;border:1px solid #E5E7EB;border-radius:8px;font:inherit">
        <option value="lin">① f(t) = t</option>
        <option value="const">② f(t) = 2 (일정)</option>
        <option value="sq">③ f(t) = t²</option>
      </select></label>
      <div class="out" id="ftout"></div>
      <div class="note" style="margin-top:12px">A′(x) = f(x) — <b>넓이를 미분하면 높이</b>입니다.
      이 한 줄이 미분과 적분을 잇습니다.</div>
    </div></div>`;
  const cv=$('#ft1'),ctx=cv.getContext('2d'),W=380,H=330,P=34;
  const K={ lin:{f:t=>t, A:x=>x*x/2, fs:'t', As:'x²/2'},
            const:{f:()=>2, A:x=>2*x, fs:'2', As:'2x'},
            sq:{f:t=>t*t, A:x=>x*x*x/3, fs:'t²', As:'x³/3'} };
  function draw(){
    const x=+$('#ftX').value, k=$('#ftK').value, C=K[k];
    $('#ftXv').textContent=x.toFixed(1);
    const X=t=>P+(W-2*P)*t/4, Yu=y=>150-24*y, Yd=y=>H-P-16*y;
    ctx.clearRect(0,0,W,H); ctx.fillStyle='#fff'; ctx.fillRect(0,0,W,H);
    ctx.strokeStyle='#E5E7EB'; ctx.lineWidth=1;
    ctx.beginPath(); ctx.moveTo(P,Yu(0)); ctx.lineTo(W-P,Yu(0)); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(P,Yd(0)); ctx.lineTo(W-P,Yd(0)); ctx.stroke();
    ctx.fillStyle='rgba(37,99,235,.20)'; ctx.beginPath(); ctx.moveTo(X(0),Yu(0));
    for(let px=0;px<=200;px++){ const t=x*px/200; ctx.lineTo(X(t),Yu(C.f(t))); }
    ctx.lineTo(X(x),Yu(0)); ctx.closePath(); ctx.fill();
    ctx.strokeStyle='#2563EB'; ctx.lineWidth=2.4; ctx.beginPath();
    for(let px=0;px<=300;px++){ const t=4*px/300; px?ctx.lineTo(X(t),Yu(C.f(t))):ctx.moveTo(X(t),Yu(C.f(t))); }
    ctx.stroke();
    ctx.strokeStyle='#0E9384'; ctx.lineWidth=2.4; ctx.beginPath();
    for(let px=0;px<=300;px++){ const t=4*px/300; px?ctx.lineTo(X(t),Yd(C.A(t))):ctx.moveTo(X(t),Yd(C.A(t))); }
    ctx.stroke();
    const m=C.f(x);
    ctx.strokeStyle='#BE123C'; ctx.lineWidth=2; ctx.beginPath();
    ctx.moveTo(X(x-0.9),Yd(C.A(x)-0.9*m)); ctx.lineTo(X(x+0.9),Yd(C.A(x)+0.9*m)); ctx.stroke();
    ctx.fillStyle='#0E9384'; ctx.beginPath(); ctx.arc(X(x),Yd(C.A(x)),4.2,0,7); ctx.fill();
    ctx.fillStyle='#2563EB'; ctx.beginPath(); ctx.arc(X(x),Yu(C.f(x)),4.2,0,7); ctx.fill();
    ctx.fillStyle='#6B7280'; ctx.font='10.5px sans-serif'; ctx.textAlign='left';
    ctx.fillText('f(t) = '+C.fs+' — 파란 넓이가 A(x)', P, 32);
    ctx.fillText('A(x) = '+C.As+' — 붉은 직선이 그 접선', P, 208);
    const num=(C.A(x+0.001)-C.A(x-0.001))/0.002;
    $('#ftout').innerHTML =
      `<span class="mono">넓이 A(${x.toFixed(1)}) = <b style="color:#0E9384">${C.A(x).toFixed(4)}</b></span><br>`
      + `<span class="mono">A 의 기울기 ≈ <b style="color:#BE123C">${num.toFixed(4)}</b> · 높이 f(${x.toFixed(1)}) = <b style="color:#2563EB">${m.toFixed(4)}</b></span><br>`
      + (Math.abs(num-m)<0.01 ? `<b style="color:#B45309">두 값이 같습니다 — 넓이를 미분하면 높이가 나옵니다.</b><br>` : '')
      + (k==='const' ? `<b style="color:#7C3AED">높이가 일정하면 넓이는 직선으로 자랍니다 — 기울기가 늘 2 입니다.</b><br>` : '')
      + (k==='sq' ? `<b style="color:#0E9384">넓이가 세제곱으로 자랍니다 — A(x) = x³/3 입니다.</b><br>` : '')
      + `<span style="color:#6B7280;font-size:12.5px">x 를 옮기며 두 값이 계속 같은지 확인하세요.</span>`;
  }
  $('#ftX').oninput=draw; $('#ftK').onchange=draw; draw();
  inquiry(root,{ id:'ft', title:'미적분의 기본정리 — 넓이의 기울기',
    q:['세 f(t) 각각에서 (x, A(x), A 의 기울기, f(x)) 를 기록하세요.',
       'A 의 기울기와 f 의 높이가 늘 같은지 확인하고 예외를 찾아보세요.',
       'A(x) 를 손으로 적분해 구하고 화면 값과 맞는지 대조하세요.'],
    cols:['f(t)','x','A(x)','A′(x)','f(x)'],
    hint:'힌트 — 높이가 일정하면 넓이는 직선, 높이가 자라면 넓이는 곡선입니다.',
    read:()=>{ const x=+$('#ftX').value, C=K[$('#ftK').value];
      return [C.fs,x.toFixed(1),C.A(x).toFixed(4),((C.A(x+0.001)-C.A(x-0.001))/0.002).toFixed(4),C.f(x).toFixed(4)]; } });
}

/* ---------- LAB 139 정적분과 누적 — 속도 그래프의 넓이 ---------- */
function accumDemo(root){
  root.innerHTML=`<div class="row"><div class="col">
      <canvas id="ac1" width="380" height="300"></canvas>
      <div class="note" style="margin-top:8px">속도 그래프의 넓이가 곧 <b>이동</b>입니다.
      축 아래(음수) 구간은 되돌아온 것이므로 <b>빼야</b> 합니다.</div>
    </div>
    <div class="col">
      <label class="ctl">운동 고르기<select id="acK" style="width:100%;padding:7px 9px;border:1px solid #E5E7EB;border-radius:8px;font:inherit">
        <option value="fwd">① 계속 앞으로 (v ≥ 0)</option>
        <option value="back">② 갔다가 되돌아오기 (v 가 음수로)</option>
      </select></label>
      ${slider('acT','끝 시각 t',1,8,0.5,4,'초')}
      <div class="ctl" style="margin-top:8px"><label><input type="checkbox" id="acAbs"> 음수 구간도 그냥 더하기(잘못된 방법)</label></div>
      <div class="out" id="acout"></div>
      <div class="note" style="margin-top:12px">변위 = ∫v dt, 이동 거리 = ∫|v| dt.
      두 값이 갈리는 순간이 <b>속도가 음수가 되는 때</b>입니다.</div>
    </div></div>`;
  const cv=$('#ac1'),ctx=cv.getContext('2d'),W=380,H=300,P=36;
  const V={ fwd:t=>1+0.5*t, back:t=>4-t };
  function draw(){
    const k=$('#acK').value, T=+$('#acT').value, wrong=$('#acAbs').checked;
    $('#acTv').textContent=T.toFixed(1)+'초';
    const v=V[k];
    const X=t=>P+(W-2*P)*t/8, Y=y=>H/2-20*y;
    ctx.clearRect(0,0,W,H); ctx.fillStyle='#fff'; ctx.fillRect(0,0,W,H);
    const N=400; let disp=0, dist=0;
    for(let i=0;i<N;i++){ const t=T*i/N, dt=T/N; disp+=v(t)*dt; dist+=Math.abs(v(t))*dt; }
    for(let i=0;i<N;i++){ const t=T*i/N, val=v(t);
      ctx.fillStyle = val>=0 ? 'rgba(37,99,235,.22)' : 'rgba(190,18,60,.22)';
      ctx.fillRect(X(t), val>=0?Y(val):Y(0), X(T/N)-X(0)+0.8, Math.abs(Y(val)-Y(0))); }
    ctx.strokeStyle='#111827'; ctx.lineWidth=1;
    ctx.beginPath(); ctx.moveTo(P,Y(0)); ctx.lineTo(W-P,Y(0)); ctx.stroke();
    ctx.strokeStyle='#0E9384'; ctx.lineWidth=2.4; ctx.beginPath();
    for(let px=0;px<=300;px++){ const t=8*px/300; px?ctx.lineTo(X(t),Y(v(t))):ctx.moveTo(X(t),Y(v(t))); }
    ctx.stroke();
    ctx.fillStyle='#6B7280'; ctx.font='10.5px sans-serif'; ctx.textAlign='left';
    ctx.fillText('파랑 = 앞으로 간 넓이, 붉은 = 되돌아온 넓이', P, P-14);
    const neg = dist-disp > 0.01;
    $('#acout').innerHTML =
      `<span class="mono">변위 ∫v dt = <b style="color:#2563EB">${disp.toFixed(3)}</b></span><br>`
      + `<span class="mono">이동 거리 ∫|v| dt = <b style="color:#BE123C">${dist.toFixed(3)}</b></span><br>`
      + (neg ? `<b style="color:#B45309">두 값이 갈라졌습니다 — 되돌아온 구간이 생겼습니다.</b><br>`
             : `아직 두 값이 같습니다 — 계속 한 방향으로만 갔습니다.<br>`)
      + (wrong && neg ? `<b style="color:#7C3AED">부호를 무시하고 더하면 ${dist.toFixed(3)} — 실제 위치 변화보다 크게 나옵니다.</b><br>` : '')
      + `<span style="color:#6B7280;font-size:12.5px">넓이에 부호를 살릴지 말지가 두 물음(어디에 있나 / 얼마나 움직였나)을 가릅니다.</span>`;
  }
  $('#acK').onchange=draw; $('#acT').oninput=draw; $('#acAbs').onchange=draw; draw();
  inquiry(root,{ id:'ac', title:'정적분과 누적 — 부호 있는 넓이',
    q:['②(되돌아오기)에서 끝 시각을 늘리며 (변위, 이동 거리) 를 다섯 줄 기록하세요.',
       '두 값이 갈라지기 시작하는 시각을 찾고 그 이유를 쓰세요.',
       '「어디에 있나」와 「얼마나 움직였나」를 각각 어느 적분으로 구하는지 정리하세요.'],
    cols:['운동','끝 시각','변위','이동 거리','차이'],
    hint:'힌트 — v(t) = 4 − t 는 t = 4 부터 음수가 됩니다.',
    read:()=>{ const k=$('#acK').value,T=+$('#acT').value,v=V[k],N=400; let d=0,s=0;
      for(let i=0;i<N;i++){ const t=T*i/N,dt=T/N; d+=v(t)*dt; s+=Math.abs(v(t))*dt; }
      return [k==='fwd'?'앞으로':'왕복',T.toFixed(1),d.toFixed(3),s.toFixed(3),(s-d).toFixed(3)]; } });
}

/* ---------- LAB 140 두 곡선 사이의 넓이 — 위아래가 바뀌는 자리 ---------- */
function betweenDemo(root){
  root.innerHTML=`<div class="row"><div class="col">
      <canvas id="bt1" width="380" height="300"></canvas>
      <div class="note" style="margin-top:8px">두 그래프가 <b>교차하는 자리</b>에서 위아래가 바뀝니다.
      나누지 않고 한 번에 적분하면 넓이가 서로 상쇄됩니다.</div>
    </div>
    <div class="col">
      ${slider('btA','직선 y = ax 의 a',-1,3,0.1,1,'')}
      ${slider('btL','적분 구간의 왼쪽 끝',-2,0,0.1,0,'')}
      ${slider('btR','적분 구간의 오른쪽 끝',0.5,3,0.1,1,'')}
      <div class="ctl" style="margin-top:8px"><label><input type="checkbox" id="btSplit"> 교점에서 나누어 계산</label></div>
      <div class="out" id="btout"></div>
      <div class="note" style="margin-top:12px">넓이 = ∫|위 − 아래| dx.
      절댓값을 살리려면 <b>교점에서 구간을 끊어야</b> 합니다.</div>
    </div></div>`;
  const cv=$('#bt1'),ctx=cv.getContext('2d'),W=380,H=300,P=34;
  function draw(){
    const a=+$('#btA').value, L=+$('#btL').value, R=+$('#btR').value, split=$('#btSplit').checked;
    $('#btAv').textContent=a.toFixed(1); $('#btLv').textContent=L.toFixed(1); $('#btRv').textContent=R.toFixed(1);
    const f=x=>x*x, g=x=>a*x;
    const X=x=>W/2+70*x, Y=y=>H-P-52*y;
    ctx.clearRect(0,0,W,H); ctx.fillStyle='#fff'; ctx.fillRect(0,0,W,H);
    ctx.strokeStyle='#E5E7EB'; ctx.lineWidth=1;
    ctx.beginPath(); ctx.moveTo(P,Y(0)); ctx.lineTo(W-P,Y(0)); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(X(0),P-14); ctx.lineTo(X(0),H-P); ctx.stroke();
    const N=300; let signed=0, absArea=0;
    for(let i=0;i<N;i++){ const x=L+(R-L)*i/N, dx=(R-L)/N, d=g(x)-f(x);
      signed+=d*dx; absArea+=Math.abs(d)*dx;
      ctx.fillStyle = d>=0 ? 'rgba(14,147,132,.22)' : 'rgba(190,18,60,.20)';
      const y1=Y(f(x)), y2=Y(g(x));
      ctx.fillRect(X(x), Math.min(y1,y2), Math.max(1.4,X(dx)-X(0)), Math.abs(y2-y1)); }
    ctx.strokeStyle='#2563EB'; ctx.lineWidth=2.2; ctx.beginPath();
    for(let px=0;px<=300;px++){ const x=-2.4+5.2*px/300; px?ctx.lineTo(X(x),Y(f(x))):ctx.moveTo(X(x),Y(f(x))); }
    ctx.stroke();
    ctx.strokeStyle='#0E9384'; ctx.lineWidth=2.2; ctx.beginPath();
    ctx.moveTo(X(-2.4),Y(g(-2.4))); ctx.lineTo(X(2.8),Y(g(2.8))); ctx.stroke();
    [0,a].forEach(r=>{ if(r>=L-0.001&&r<=R+0.001){ ctx.fillStyle='#111827';
      ctx.beginPath(); ctx.arc(X(r),Y(f(r)),3.6,0,7); ctx.fill(); } });
    ctx.fillStyle='#6B7280'; ctx.font='10.5px sans-serif'; ctx.textAlign='left';
    ctx.fillText('초록 = 직선이 위, 붉은 = 포물선이 위', P, P-18);
    const crossInside = (0>L+0.001&&0<R-0.001)||(a>L+0.001&&a<R-0.001);
    const mixed = Math.abs(absArea-Math.abs(signed))>0.01;
    $('#btout').innerHTML =
      `<span class="mono">교점 x = 0 과 x = ${a.toFixed(1)} · 구간 [${L.toFixed(1)}, ${R.toFixed(1)}]</span><br>`
      + `<span class="mono">그냥 적분 ∫(직선 − 포물선) = <b>${signed.toFixed(4)}</b></span><br>`
      + `<span class="mono">실제 넓이 ∫|직선 − 포물선| = <b style="color:#0E9384">${absArea.toFixed(4)}</b></span><br>`
      + (mixed ? `<b style="color:#B45309">위아래가 뒤바뀐 구간이 섞여 — 두 값이 다릅니다 (상쇄가 일어났습니다).</b><br>` : '')
      + (split && mixed ? `<b style="color:#7C3AED">교점에서 끊어 각각 계산하면 실제 넓이 ${absArea.toFixed(4)} 를 얻습니다.</b><br>` : '')
      + `<span style="color:#6B7280;font-size:12.5px">구간을 옮겨 두 값이 같아지는 경우도 만들어 보세요.</span>`;
  }
  ['btA','btL','btR'].forEach(i=>$('#'+i).oninput=draw); $('#btSplit').onchange=draw; draw();
  inquiry(root,{ id:'bt', title:'두 곡선 사이 — 상쇄를 막는 법',
    q:['구간을 옮기며 (그냥 적분, 실제 넓이) 를 다섯 줄 기록하세요.',
       '두 값이 달라지는 구간의 공통점은 무엇인가요?',
       '교점을 먼저 구해야 하는 이유를 한 문장으로 쓰세요.'],
    cols:['a','왼쪽','오른쪽','그냥 적분','실제 넓이'],
    hint:'힌트 — 교점은 x² = ax 를 풀어 x = 0 과 x = a 입니다.',
    read:()=>{ const a=+$('#btA').value,L=+$('#btL').value,R=+$('#btR').value,N=300; let s=0,ab=0;
      for(let i=0;i<N;i++){ const x=L+(R-L)*i/N,dx=(R-L)/N,d=a*x-x*x; s+=d*dx; ab+=Math.abs(d)*dx; }
      return [a.toFixed(1),L.toFixed(1),R.toFixed(1),s.toFixed(4),ab.toFixed(4)]; } });
}

/* ---------- LAB 141 회전체의 부피 — 그릇을 원판으로 자르다 ---------- */
function solidDemo(root){
  root.innerHTML=`<div class="row"><div class="col">
      <canvas id="sd3" width="380" height="300"></canvas>
      <div class="note" style="margin-top:8px">곡선을 축 둘레로 돌리면 그릇이 됩니다.
      얇은 <b>원판</b>으로 잘라 πr²·Δx 를 더하는 것이 부피입니다.</div>
    </div>
    <div class="col">
      ${slider('slN','원판 개수',3,120,1,6,'개')}
      ${slider('slH','그릇 높이 (0 부터 h 까지)',1,4,0.1,2,'')}
      <label class="ctl" style="margin-top:8px">단면 반지름 r(x)<select id="slK" style="width:100%;padding:7px 9px;border:1px solid #E5E7EB;border-radius:8px;font:inherit">
        <option value="lin">① r = x (원뿔)</option>
        <option value="sqrt">② r = √x (포물선 그릇)</option>
        <option value="one">③ r = 1 (원기둥)</option>
      </select></label>
      <div class="out" id="slout"></div>
      <div class="note" style="margin-top:12px">V = π∫r(x)² dx.
      <b>반지름을 제곱한 뒤</b> 더해야 합니다 — 더한 뒤 제곱하면 틀립니다.</div>
    </div></div>`;
  const cv=$('#sd3'),ctx=cv.getContext('2d'),W=380,H=300,P=34;
  const R={ sqrt:{r:x=>Math.sqrt(x), s:'√x', V:h=>Math.PI*h*h/2, es:'πh²/2'},
            lin:{r:x=>x, s:'x', V:h=>Math.PI*h*h*h/3, es:'πh³/3'},
            one:{r:()=>1, s:'1', V:h=>Math.PI*h, es:'πh'} };
  function draw(){
    const n=+$('#slN').value, h=+$('#slH').value, k=$('#slK').value, C=R[k];
    $('#slNv').textContent=n+'개'; $('#slHv').textContent=h.toFixed(1);
    const X=x=>P+(W-2*P)*x/4.2, Y=y=>H/2-46*y;
    ctx.clearRect(0,0,W,H); ctx.fillStyle='#fff'; ctx.fillRect(0,0,W,H);
    ctx.strokeStyle='#9CA3AF'; ctx.lineWidth=1;
    ctx.beginPath(); ctx.moveTo(P,Y(0)); ctx.lineTo(W-P,Y(0)); ctx.stroke();
    const dx=h/n; let sum=0;
    for(let i=0;i<n;i++){ const xm=(i+0.5)*dx, r=C.r(xm); sum+=Math.PI*r*r*dx;
      ctx.fillStyle='rgba(37,99,235,.18)'; ctx.fillRect(X(i*dx),Y(r),X(dx)-X(0),Y(-r)-Y(r));
      if(n<=30){ ctx.strokeStyle='#2563EB'; ctx.lineWidth=0.7; ctx.strokeRect(X(i*dx),Y(r),X(dx)-X(0),Y(-r)-Y(r)); } }
    ctx.strokeStyle='#BE123C'; ctx.lineWidth=2.2;
    [1,-1].forEach(sgn=>{ ctx.beginPath();
      for(let px=0;px<=240;px++){ const x=4.2*px/240, y=sgn*C.r(x);
        px?ctx.lineTo(X(x),Y(y)):ctx.moveTo(X(x),Y(y)); } ctx.stroke(); });
    ctx.fillStyle='#6B7280'; ctx.font='10.5px sans-serif'; ctx.textAlign='left';
    ctx.fillText('r(x) = '+C.s+' · 원판 두께 Δx = '+dx.toFixed(3), P, P-14);
    const exact=C.V(h), err=Math.abs(sum-exact);
    $('#slout').innerHTML =
      `<span class="mono">원판 합 Σπr²Δx = <b>${sum.toFixed(4)}</b></span><br>`
      + `<span class="mono">정확한 값 V = ${C.es} = <b style="color:#0E9384">${exact.toFixed(4)}</b> · 오차 ${err.toFixed(4)}</span><br>`
      + (err<0.005 ? `<b style="color:#B45309">오차가 0.005 아래 — 원판 합이 참값에 닿았습니다.</b><br>` : '')
      + (k==='one' ? `<b style="color:#7C3AED">반지름이 일정하면 원기둥 — 부피가 높이에 정비례합니다.</b><br>` : '')
      + `<span style="color:#6B7280;font-size:12.5px">개수를 늘릴수록 계단 모양이 매끄러운 그릇에 가까워집니다.</span>`;
  }
  ['slN','slH'].forEach(i=>$('#'+i).oninput=draw); $('#slK').onchange=draw; draw();
  inquiry(root,{ id:'sl', title:'회전체의 부피 — 원판으로 자르기',
    q:['세 모양 각각에서 원판 개수를 늘리며 (합, 정확한 값, 오차) 를 기록하세요.',
       '높이를 두 배로 하면 부피는 몇 배가 되나요? 모양마다 다른가요?',
       'V = π∫r² dx 를 손으로 계산해 화면의 정확한 값과 대조하세요.'],
    cols:['모양','n','높이','원판 합','오차'],
    hint:'힌트 — 원뿔은 h³ 에, 원기둥은 h 에 비례합니다.',
    read:()=>{ const n=+$('#slN').value,h=+$('#slH').value,C=R[$('#slK').value],dx=h/n; let sum=0;
      for(let i=0;i<n;i++){ const r=C.r((i+0.5)*dx); sum+=Math.PI*r*r*dx; }
      return [C.s,n,h.toFixed(1),sum.toFixed(4),Math.abs(sum-C.V(h)).toFixed(4)]; } });
}

const LABS=[
{n:1,core:1,t:'“여기 어디지?” GPS 위치 추정',q:'스마트폰은 내가 어디 있는지 어떻게 알까?',
 m:['좌표평면·두 점 사이의 거리','원의 방정식','연립방정식'],a:['위치기반서비스(LBS)','센서 융합·오차 보정'],
 note:'기준점 3개까지 늘려 보세요. 원 1개 → 2개 → 3개로 갈수록 <b>내 위치가 한 점으로 좁혀지는</b> 과정이 그대로 보입니다. 오차를 키우면 교점이 “오차 삼각형”으로 번지는데, 이때 “가장 그럴듯한 위치”를 찾는 것이 곧 최소제곱의 직관입니다.',
 build:gpsDemo},
{n:2,core:1,t:'“이 문자, 스팸일까?” 베이즈 분류기',q:'왜 어떤 문자는 스팸함으로 갈까?',
 m:['조건부확률','베이즈 정리','독립사건'],a:['나이브 베이즈','텍스트 분류'],
 note:'단어 가중치를 바꿔 보세요. <b>정상 문자를 스팸으로 막는 오류(거짓양성)</b>가 언제 생기는지가 바로 보입니다. “양성 ≠ 질병”이라는 조건부확률의 반전을 여기서 그대로 다룰 수 있습니다.',
 build:bayesDemo},
{n:3,core:1,t:'“왜 순식간에 퍼질까?” 확산 시뮬레이터',q:'어떤 영상은 왜 하루 만에 천만 뷰가 될까?',
 m:['지수함수와 로그','증가율(미분의 직관)','로지스틱 S곡선'],a:['예측 모델링','추천 알고리즘의 증폭'],
 note:'선형 → 지수 → 로지스틱으로 <b>모델이 진화</b>하는 과정을 한 화면에서 비교합니다. 배가시간은 log2/ln(1+r)로 계산되어, 로그가 “왜 필요한가”에 답이 됩니다.',
 build:spreadDemo},
{n:4,core:0,t:'“어느 요금제가 이득일까?” 손익분기',q:'두 요금제, 몇 분부터 갈아타야 이득일까?',
 m:['일차함수','기울기와 y절편','연립방정식(교점)'],a:['선형 비용 모델','손익분기 분석'],
 note:'네 슬라이더를 움직여 보세요. 분당 요금을 같게 맞추면 두 직선이 <b>평행</b>해져 교점이 사라집니다. “해가 없다”가 그래프에서 무엇인지 눈으로 보는 순간입니다. 기본료는 y절편, 분당 요금은 기울기라는 대응도 그대로 드러납니다.',
 build:planDemo},
{n:5,core:0,t:'“저 건물 몇 층일까?” 드론으로 높이 재기',q:'올라가지 않고 건물 높이를 어떻게 잴까?',
 m:['삼각비 tan','직각삼각형','각도와 라디안'],a:['드론 측량','레이저 거리계·LiDAR'],
 note:'각을 재고 거리를 알면 <b>tan 하나</b>로 높이가 나옵니다. 눈높이를 더하는 것을 빠뜨리면 실제보다 낮게 나오는데, 이 “한 항의 누락”이 측량에서 가장 흔한 실수입니다.',
 build:trigDemo},
{n:6,core:0,t:'“정말 관계가 있을까?” 산점도와 상관계수',q:'공부 시간과 성적, 정말 관계가 있을까?',
 m:['산점도','상관계수 r','평균·표준편차'],a:['특성 선택','상관 ≠ 인과'],
 note:'관계의 세기를 −100%에서 +100%까지 바꿔 보고, 구석에 <b>이상치</b>를 하나 찍어 보세요. r 이 얼마나 흔들리는지 바로 보입니다. r 은 반드시 −1과 1 사이라는 것도 화면에서 확인됩니다.',
 build:corrDemo},
{n:7,core:0,t:'“평균 연봉”의 함정 — 대푯값과 이상치',q:'평균 연봉 8천만 원, 이 회사 정말 좋은 회사일까?',
 m:['평균·중앙값·최빈값','이상치','자료의 분포'],a:['데이터 전처리','robust 통계'],
 note:'사장님 연봉 하나만 올려 보세요. <b>평균은 끌려가는데 중앙값은 버팁니다.</b> “평균보다 적게 받는 사람이 몇 명인지”가 함께 나오므로, 대푯값을 왜 골라 써야 하는지가 숫자로 드러납니다.',
 build:repDemo},
{n:8,core:0,t:'“내 비밀번호 안전할까?” 경우의 수',q:'내 비밀번호, 몇 초 만에 뚫릴까?',
 m:['경우의 수','중복순열 kⁿ','지수의 위력'],a:['탐색 공간','무차별 대입 공격'],
 note:'자리 수를 하나 늘리는 것과 문자 종류를 늘리는 것 중 <b>무엇이 더 강력한지</b> 비교해 보세요. 밑이 커지는 것과 지수가 커지는 것의 차이를 눈으로 보는 자리입니다. 로그 눈금 막대라 12자리까지 한 화면에 들어옵니다.',
 build:pwDemo},
{n:9,core:0,t:'“0.5% 뽑기, 200번이면 나올까?”',q:'확률 0.5%짜리를 200번 뽑으면 나올까?',
 m:['확률의 뜻','여사건','큰 수의 법칙'],a:['표본과 추정','시뮬레이션'],
 note:'뽑는 횟수를 늘리면 파란 실험 곡선이 주황 이론선으로 <b>수렴</b>합니다. 동시에 “적어도 한 번 당첨될 확률 1 − (1−p)ⁿ”이 함께 나와서, 감으로 찍은 답이 왜 틀리는지 숫자로 드러납니다.',
 build:lawDemo},
{n:10,core:0,t:'“내 점수는 몇 등급?” 정규분포와 표준점수',q:'같은 78점인데 왜 등급이 다를까?',
 m:['정규분포','표준편차','표준점수 z'],a:['특성 표준화','정규화(normalization)'],
 note:'점수를 그대로 둔 채 <b>표준편차만</b> 바꿔 보세요. z 와 백분위가 크게 달라집니다. 원점수로는 비교할 수 없고 z 로 바꿔야 한다는 것이 곡선 위에서 그대로 보입니다.',
 build:zDemo},
{n:11,core:0,t:'“복리가 왜 무서울까?” 72의 법칙',q:'적금과 대출, 두 배가 되는 데 몇 년 걸릴까?',
 m:['지수함수','로그','등비수열'],a:['누적 비용 모델','학습률 감쇠'],
 note:'단리(회색 직선)와 복리(파란 곡선)를 겹쳐 놓았습니다. 기간을 늘릴수록 차이가 벌어지는 것이 그대로 보이고, <b>두 배 되는 햇수</b>를 로그로 구한 값과 72의 법칙 어림값이 얼마나 가까운지도 나란히 확인됩니다.',
 build:cmpDemo},
{n:12,core:0,t:'“왜 로그로 그릴까?” 로그 스케일',q:'지진 규모 7과 8은 몇 배 차이일까?',
 m:['로그의 뜻','자릿수','로그 그래프'],a:['로그 손실','데이터 시각화'],
 note:'같은 자료를 <b>보통 눈금과 로그 눈금</b>으로 번갈아 보세요. 보통 눈금에서는 작은 값들이 바닥에 붙어 아무것도 안 보이다가, 로그로 바꾸는 순간 전부 비교 가능해집니다. 축을 바꾸는 것이 왜 “해석”인지 알게 됩니다.',
 build:logDemo},
{n:13,core:0,t:'“단속 카메라는 어떻게 알까?” 순간속도',q:'한 순간의 속도를 어떻게 잴 수 있을까?',
 m:['평균변화율','미분계수','극한'],a:['기울기 = 학습 신호','속도 추정'],
 note:'구간 폭 h 를 2초에서 0.02초까지 줄여 보세요. <b>주황 할선이 빨간 접선으로 겹쳐 갑니다.</b> 평균속도와 순간속도의 차이가 숫자로 함께 나오므로, 극한이 “무한히 가까이”라는 말의 뜻이 눈에 보입니다.',
 build:velDemo},
{n:14,core:0,t:'카드번호 검증기 (룬 알고리즘)',q:'오타 난 카드번호를 왜 즉시 잡아낼까?',
 m:['나머지·합동식','자릿수 분해','모듈러 연산'],a:['체크섬','데이터 무결성 검증'],
 note:'한 자리만 바꿔 보세요. 검증이 <b>반드시</b> 실패합니다. “나머지”라는 중학 개념 하나가 실제 결제 시스템을 떠받치고 있다는 사실이 강력한 동기가 됩니다.',
 build:luhnDemo},
{n:5,core:0,t:'최소제곱 회귀 — AI 예측의 출발점',q:'점들 사이로 “가장 알맞은 직선”은 어떻게 정할까?',
 m:['일차함수','평균·분산·상관','최소제곱법'],a:['선형회귀','지도학습의 기본형'],
 note:'그래프를 클릭해 점을 추가해 보세요. 잔차(빨간 선분)의 <b>제곱합이 최소</b>가 되는 직선이 자동으로 갱신됩니다. “AI가 학습한다”는 말의 가장 단순한 실체입니다.',
 build:regDemo},
{n:6,core:0,t:'경사하강법 — AI는 어떻게 “학습”하나',q:'컴퓨터는 최솟값을 어떻게 찾아갈까?',
 m:['이차함수','미분계수·접선의 기울기','수열의 극한'],a:['경사하강법','학습률(learning rate)'],
 note:'학습률을 0.9 이상으로 올려 보세요. <b>발산</b>합니다. 미분계수의 부호와 크기가 “어느 쪽으로 얼마나”를 결정한다는 것을 눈으로 확인하는 순간, 접선의 기울기가 살아 있는 개념이 됩니다.',
 build:gdDemo},
{n:7,core:0,t:'몬테카를로 π 추정',q:'주사위를 던져서 원주율을 구할 수 있을까?',
 m:['확률과 넓이','대수의 법칙','원의 넓이'],a:['몬테카를로 시뮬레이션','확률적 알고리즘'],
 note:'점을 늘릴수록 추정값이 π로 <b>수렴</b>합니다. 오차가 1/√n에 비례해 줄어드는 것까지 관찰하면, 통계적 추정의 감각이 몸에 남습니다.',
 build:mcDemo},
{n:8,core:0,t:'추천 알고리즘과 코사인 유사도',q:'유튜브는 내 취향을 어떻게 알까?',
 m:['벡터와 성분','내적','벡터가 이루는 각'],a:['협업 필터링','임베딩 유사도'],
 note:'내 취향 벡터를 움직이면 <b>사잇각이 작은 사람</b>이 곧 추천 근거가 됩니다. 내적 공식 a·b=|a||b|cosθ가 추천 시스템의 핵심 수식 그 자체입니다.',
 build:cosDemo},
{n:9,core:0,t:'이미지 필터와 합성곱(행렬)',q:'AI는 사진에서 윤곽선을 어떻게 찾을까?',
 m:['행렬','성분별 곱과 합','일차변환의 직관'],a:['합성곱신경망(CNN)','커널·특징 추출'],
 note:'경계 검출 커널을 적용하면 <b>밝기가 급변하는 곳</b>만 살아납니다. 3×3 행렬 하나가 “특징 추출”이라는 딥러닝 용어의 실체임을 보여줍니다.',
 build:convDemo},
{n:10,core:0,t:'소리와 삼각함수 — 파형 합성',q:'같은 “도”인데 피아노와 기타는 왜 다르게 들릴까?',
 m:['삼각함수','주기·진폭·위상','함수의 합성'],a:['음성 신호 처리','푸리에 변환의 직관'],
 note:'배음(2배·3배 진동수)의 진폭을 섞으면 <b>음색</b>이 달라집니다. 소리를 켜고 들어 보세요. sin 함수의 합이 곧 악기의 정체라는 사실이 삼각함수 단원의 강력한 도입이 됩니다.',
 build:waveDemo},
{n:21,core:1,t:'“y = x 대칭의 발견” 역함수와 무리함수',q:'무리함수 y = √(x−2)+1 은 어떤 함수의 역함수일까?',
 m:['역함수','무리함수','y = x 대칭이동'],a:['암호화·복호화','가역 변환'],
 note:'함수를 바꿔 가며 파란 원함수와 초록 역함수가 <b>주황 y = x 에 대칭</b>인 것을 확인하세요. 슬라이더로 대응점의 좌표가 뒤바뀌는 것이 선으로 이어져 보입니다. <b>원점 점대칭</b>을 켜면 “좌표를 맞바꾸는 것”과 “부호를 뒤집는 것”이 어떻게 다른지 한 화면에서 비교됩니다.',
 build:symDemo},
{n:22,core:0,t:'“무한히 더하면 어디로?” 급수의 부분합',q:'항을 끝없이 더하면 값이 정해질까?',
 m:['수열의 극한','급수의 수렴·발산','등비급수'],a:['수치 계산','반복 알고리즘의 종료'],
 note:'급수를 바꿔 가며 항을 늘려 보세요. 등비급수는 극한선에 붙지만 <b>조화급수는 아주 천천히 계속 커집니다</b> — 눈으로는 수렴처럼 보이는데 발산이라는 것이 이 실험의 함정이자 요점입니다.',
 build:seriesDemo},
{n:23,core:0,t:'“계산기는 sin을 어떻게 알까?” 테일러 근사',q:'다항식만으로 sin을 흉내 낼 수 있을까?',
 m:['멱급수','테일러 급수','수렴반경'],a:['수치 해석','함수 근사'],
 note:'차수를 올리면 붉은 근사 곡선이 원점부터 원함수에 붙습니다. ln(1+x)를 고르면 <b>수렴반경 밖(붉은 영역)</b>에서는 차수를 올려도 오히려 어긋납니다 — 근사가 언제나 좋아지지 않는다는 것을 보여 줍니다.',
 build:taylorDemo},
{n:24,core:0,t:'“이 그릇의 부피는?” 회전체와 원판',q:'곡선을 돌려 만든 입체의 부피는 어떻게 구할까?',
 m:['정적분의 활용','구분구적법','회전체의 부피'],a:['3D 모델링','수치적분'],
 note:'원판 개수를 1개에서 60개로 늘려 보세요. 계단 모양이던 근사가 <b>적분값에 붙습니다.</b> 각 원판이 πr²Δx 이고 r 이 반지름이라는 점이 핵심입니다 — 지름을 넣으면 부피가 네 배가 됩니다.',
 build:revolveDemo}
,
{n:25,core:0,t:'“큰 수를 못 쪼개서 안전하다니?” 소인수분해와 암호',q:'곱하기는 쉬운데 왜 되돌리기는 어려울까?',
 m:['소인수분해','소수와 합성수','제곱근의 어림'],a:['공개키 암호(RSA)','계산 복잡도'],
 note:'p 와 q 를 키워 보세요. 곱하는 데는 <b>한 번</b>이면 되는데 되돌리려면 나눠 본 횟수가 급격히 늘어납니다. √N 까지만 나눠 보면 되는 이유도 화면에서 확인됩니다 — 그보다 큰 약수가 있다면 짝이 되는 작은 약수가 이미 나왔을 것이기 때문입니다.',
 build:primeDemo},
{n:26,core:0,t:'“영하 5도에서 3도 오르면?” 수직선 위의 정수',q:'빼기는 왜 반대 방향으로 가는 걸까?',
 m:['정수와 유리수','수직선','덧셈과 뺄셈의 관계'],a:['부호가 있는 데이터','기준점과 상대값'],
 note:'연산을 뺄셈으로 바꾸면 화살표가 <b>반대로 돌아섭니다</b>. “빼기는 부호를 바꿔 더하는 것”이 말이 아니라 그림으로 보입니다. b 를 음수로 두고 뺄셈을 시키면 화살표가 다시 오른쪽으로 가는데, 부호를 두 번 바꾼 자리입니다.',
 build:intDemo},
{n:27,core:0,t:'“규칙을 어떻게 한 줄로 적을까?” 문자와 식',q:'성냥개비 100번째 도형에는 몇 개가 필요할까?',
 m:['문자의 사용','식의 값','대입'],a:['일반화와 패턴','변수의 뜻'],
 note:'세 식이 <b>생김새는 달라도 값이 같습니다</b> — 같은 규칙을 다르게 본 것뿐입니다. 아래쪽에서 2a 에 값을 대입해 보면, 이것을 “2와 a”로 읽었을 때 결과가 통째로 달라지는 것이 숫자로 나옵니다.',
 build:letterDemo},
{n:28,core:0,t:'“저울이 균형을 이루려면?” 등식의 성질',q:'왜 양변에 똑같이 해야 할까?',
 m:['일차방정식','등식의 성질','이항'],a:['제약 조건','알고리즘의 불변량'],
 note:'「왼쪽에서만 1 빼기」를 눌러 보세요. 저울이 기울고, 그 순간부터 <b>처음 식과 다른 식</b>이 됩니다. 등식의 성질이 규칙이 아니라 균형을 지키는 일이라는 것을 손으로 겪는 자리입니다.',
 build:scaleDemo},
{n:29,core:0,t:'“지렛대는 왜 힘이 덜 들까?” 정비례와 반비례',q:'거리를 두 배로 하면 힘은 왜 절반이 될까?',
 m:['정비례와 반비례','그래프','비례관계의 식'],a:['역관계 모델','단위 환산'],
 note:'표의 셋째 줄을 보세요. 반비례는 <b>x × y 가 일정</b>하고 정비례는 <b>y ÷ x 가 일정</b>합니다. 무엇이 일정한지가 그래프가 직선이냐 굽은 선이냐를 그대로 가릅니다.',
 build:propDemo},
{n:30,core:0,t:'“그림의 원근법은 어떤 원리일까?” 평행선과 각',q:'평행선을 가로지르면 왜 같은 각이 생길까?',
 m:['평행선의 성질','동위각과 엇각','각의 크기'],a:['소실점과 원근법','도형 인식'],
 note:'표시할 각을 바꿔 보세요. 이름은 <b>자리</b>가 정하고, 같아지는 것은 <b>ℓ ∥ m 일 때만</b>입니다. 동측내각을 고르면 같은 것이 아니라 <b>합이 180°</b>라는 다른 관계가 나옵니다.',
 build:paraDemo},
{n:31,core:0,t:'“구조물은 왜 삼각형일까?” 삼각형의 합동',q:'무엇을 알아야 삼각형이 하나로 정해질까?',
 m:['삼각형의 합동 조건','작도','반례'],a:['강체 구조','제약 만족'],
 note:'SSA 를 고르고 변 b 를 90 아래로 줄여 보세요. <b>삼각형이 두 개</b> 그려집니다. 주어진 값이 같은데 모양이 다르므로 조건이 되지 못합니다 — 반례를 학생이 직접 만들어 내는 자리입니다.',
 build:congDemo},
{n:32,core:0,t:'“원그래프의 각도는 어떻게 정할까?” 부채꼴',q:'32%는 몇 도로 그려야 할까?',
 m:['부채꼴의 호의 길이','부채꼴의 넓이','중심각'],a:['비율 시각화','원그래프'],
 note:'오른쪽 막대 셋을 보세요. 중심각·호·넓이의 <b>비율이 언제나 같습니다</b>. 반지름을 키우면 호와 넓이의 절대값은 달라지지만 비율은 그대로입니다 — 원그래프가 성립하는 이유입니다.',
 build:sectDemo},
{n:33,core:0,t:'“신발은 어느 치수를 더 들여놔야 할까?” 대푯값',q:'평균 치수의 신발은 정말 잘 팔릴까?',
 m:['평균·중앙값·최빈값','자료의 분포','대푯값의 선택'],a:['추천의 기준값','대표값 왜곡'],
 note:'양 끝 치수를 늘려 보세요. 평균은 따라 움직이는데 <b>가장 많이 팔리는 치수는 그대로</b>입니다. “무엇을 묻고 있는가”가 대푯값을 고른다는 것이 숫자로 드러납니다.',
 build:repM1Demo},
{n:34,core:0,t:'“구간을 몇 개로 나눠야 할까?” 도수분포표와 히스토그램',q:'같은 점수인데 왜 그래프가 달라 보일까?',
 m:['도수분포표','히스토그램','계급과 계급값'],a:['구간화(binning)','시각화의 왜곡'],
 note:'계급의 크기를 5 → 40 으로 옮겨 보세요. <b>같은 40명의 점수</b>인데 봉우리가 생겼다 사라졌다 합니다. 계급의 크기를 밝히지 않은 히스토그램은 비교할 수 없다는 것이 한눈에 보입니다.',
 build:histDemo}
,
{n:35,core:0,t:'“톱니바퀴는 언제 다시 만날까?” 최대공약수와 최소공배수',q:'두 바퀴가 처음 자리로 돌아오는 때는 언제일까?',
 m:['소인수분해','최대공약수','최소공배수'],a:['주기 동기화','신호 처리'],
 note:'「돌리기」를 눌러 두 바퀴를 돌려 보세요. 처음 자리로 돌아오는 순간이 <b>최소공배수</b>입니다. 아래 탐구 보고서에서 a × b 와 (최대공약수 × 최소공배수)를 표로 모아 보면 왜 같은지가 소인수분해에서 드러납니다.',
 build:gcdDemo},
{n:36,core:0,t:'“자와 컴퍼스만으로 무엇까지 될까?” 삼각형의 작도',q:'세 변만 주면 삼각형이 하나로 정해질까?',
 m:['작도','삼각부등식','원의 뜻'],a:['CAD의 원리','제약 기반 설계'],
 note:'단계를 1→4로 올리며 작도 과정을 그대로 따라가 보세요. 두 원의 교점이 <b>두 조건을 동시에 만족하는 자리</b>입니다. 세 변을 극단으로 바꾸면 두 원이 아예 만나지 않는데, 그 경계가 삼각부등식입니다.',
 build:constructDemo},
{n:37,core:0,t:'“바닥 타일은 왜 그 모양들뿐일까?” 다각형의 성질',q:'한 점에 모인 각이 360°가 되려면?',
 m:['다각형의 내각','내각의 합','외각의 합'],a:['테셀레이션','격자 설계'],
 note:'n 을 3부터 12까지 옮겨 보세요. 한 내각이 <b>360°를 나누어떨어뜨릴 때만</b> 빈틈 없이 채워집니다. 실제로 그런 n 이 몇 개뿐인지 탐구 보고서에서 직접 세어 보게 됩니다.',
 build:polyDemo},
{n:38,core:0,t:'“3D 프린터는 어떻게 모양을 만들까?” 다면체와 회전체',q:'단면을 보면 그 입체를 알 수 있을까?',
 m:['다면체','회전체','오일러 공식'],a:['3D 프린팅','단층 촬영(CT)'],
 note:'자르는 높이를 옮기며 단면을 보세요. 회전체는 축에 수직인 단면이 <b>언제나 원</b>이고, 다면체는 v − e + f 가 <b>늘 2</b>입니다. 두 성질을 표로 모아 스스로 찾게 됩니다.',
 build:solidDemo},
{n:39,core:0,t:'“택배 상자는 왜 그 크기일까?” 겉넓이와 부피',q:'같은 부피면 종이도 같이 들까?',
 m:['겉넓이','부피','전개도'],a:['포장 최적화','물류 비용'],
 note:'부피를 8000cm³ 로 고정한 채 모양만 바꿔 보세요. 길쭉할수록 <b>같은 부피에 종이가 더 듭니다</b>. 전개도를 함께 그려 두어 겉넓이가 무엇인지 눈으로 잡히게 했습니다.',
 build:boxDemo},
{n:40,core:0,t:'“원자료를 잃지 않고 정리하려면?” 줄기와 잎 그림',q:'그래프로 바꾸면 무엇을 얻고 무엇을 잃을까?',
 m:['줄기와 잎 그림','도수분포표','히스토그램·도수분포다각형'],a:['데이터 요약','정보 손실'],
 note:'같은 32명의 점수를 세 가지로 바꿔 그려 보세요. 줄기와 잎은 <b>값을 그대로 남기고</b>, 히스토그램은 개수만 남깁니다. 중앙값을 그림에서 셀 수 있는지가 그 차이를 드러냅니다.',
 build:stemDemo},
{n:41,core:0,t:'“크기가 다른 두 반을 어떻게 비교할까?” 상대도수',q:'인원이 3배면 막대도 3배인데, 이걸 비교라 할 수 있을까?',
 m:['상대도수','도수분포','비율'],a:['정규화(normalization)','집단 간 비교'],
 note:'도수로 보면 인원이 많은 반이 <b>무조건 높습니다</b>. 상대도수로 바꾸는 순간 두 반이 같은 자에 놓입니다. 합이 언제나 1이 되는 것도 표에서 확인됩니다.',
 build:relfreqDemo},
{n:42,core:0,t:'“몇 명에게 물어야 할까?” 통계적 탐구',q:'우리 반 30명으로 학교 전체를 말할 수 있을까?',
 m:['통계적 탐구','표본과 모집단','평균·표준편차'],a:['표본조사','설문 설계'],
 note:'표본 크기를 20명과 200명으로 두고 「다시 뽑기」를 여러 번 눌러 보세요. 작은 표본은 누를 때마다 평균이 <b>크게 흔들립니다</b>. 그 흔들림의 폭이 곧 “이 결과를 얼마나 믿을 수 있는가”입니다.',
 build:statInqDemo},
{n:43,core:0,t:'“3x와 2를 왜 5로 못 묶을까?” 일차식의 덧셈과 뺄셈',q:'같은 것끼리만 묶인다는 게 무슨 뜻일까?',
 m:['일차식','동류항','분배법칙'],a:['벡터의 성분','자료형이 다른 값'],
 note:'x 타일과 1 타일을 따로 그려 두었습니다. <b>모양이 다르면 합칠 수 없다</b>는 것이 동류항의 전부입니다. 뺄셈을 고르면 둘째 식의 타일이 부호를 바꿔 뒤집히는 것도 보입니다.',
 build:linexprDemo},
{n:44,core:0,t:'“이 그래프는 무슨 이야기일까?” 순서쌍과 그래프 해석',q:'평평한 구간은 멈춘 걸까, 돌아온 걸까?',
 m:['순서쌍과 좌표','그래프의 해석','변화율의 직관'],a:['시계열 읽기','센서 로그'],
 note:'시각 t 를 옮기며 순서쌍을 읽어 보세요. 평평한 구간은 <b>멈춤</b>이고 내려가는 구간이 <b>되돌아옴</b>입니다. 네 이야기를 견주면 기울기의 가파름이 무엇을 뜻하는지도 잡힙니다.',
 build:coordDemo},
{n:45,core:0,t:'“√2+√3 은 √5 일까?” 제곱근과 무리수',q:'근호끼리는 왜 더하지 못할까?',
 m:['제곱근','무리수','근호의 연산'],a:['정밀 계산','수 체계'],
 note:'√2·√3 막대를 끌어 이어붙이고 √5 와 견주세요 — 한눈에 다릅니다(3.15 vs 2.24). (√2+√3)² = 5+2√6 — 근호는 덧셈을 통과하지 못하고, 곱셈은 통과하는 이유까지 확인합니다.',
 build:sqrtAddDemo},
{n:46,core:0,t:'“√2 의 정확한 자리” 테오도루스의 나선',q:'√2 는 수직선 어디에 있을까?',
 m:['무리수의 작도','피타고라스 정리','수직선'],a:['정밀 제도','컴퍼스 기하'],
 note:'빗변에 길이 1 직각변을 계속 세우면 √2, √3, √4… 나선이 자랍니다. 「컴퍼스로 눕히기」를 누르면 수직선의 <b>정확한 자리</b>에 점이 찍힙니다 — 1.41 반올림이 아닙니다.',
 build:spiralDemo},
{n:47,core:0,t:'“99×101 을 3초에” 인수분해 암산',q:'99×101 을 한눈에 계산할 수 있을까?',
 m:['인수분해','합차 공식','곱셈공식의 활용'],a:['계산 최적화','암산 알고리즘'],
 note:'b 를 끌면 (100−b)(100+b) 조각이 옮겨 붙어 100²−b² 이 되는 과정이 보입니다. 그리고 실전 — 98×102, 97×103, 95×105 를 3연속 암산으로 잡아 보세요.',
 build:mentalDemo},
{n:48,core:0,t:'“근을 찍고 공식으로 검산” 근의 공식',q:'이차방정식의 해는 어디서 오는 걸까?',
 m:['이차방정식','근의 공식','그래프와 근'],a:['수치 해법','근사→정확'],
 note:'포물선이 x축과 만나는 자리에 마커 둘을 눈으로 찍으면, 근의 공식이 정확한 값으로 채점해 줍니다. 두 근의 합·곱을 기록하면 근과 계수의 관계까지 저절로 나옵니다.',
 build:quadRootDemo},
{n:49,core:0,t:'“풀기 전에 개수를 안다” 판별식',q:'해가 몇 개인지 미리 알 수 있을까?',
 m:['판별식','이차방정식의 근','접선'],a:['사전 판정','충돌 검사'],
 note:'수평선을 끌어 포물선과의 교점을 2개 → 1개(접함, 자석) → 0개로 바꿔 보세요. D 의 부호가 그 개수를 풀기 전에 알려 줍니다 — ±√D 의 벌어짐이 0 이 되는 순간이 접점입니다.',
 build:discrimDemo},
{n:50,core:0,t:'“구멍을 채워라” 완전제곱식',q:'근의 공식은 어디서 나왔을까?',
 m:['완전제곱식','이차방정식','근의 공식 유도'],a:['식의 정규화','유도 과정'],
 note:'x²+bx 타일은 기역자 — x 막대를 반씩 접어 배치하면 모서리에 (b/2)² 구멍이 남고, 채우는 순간 정사각형이 됩니다. 우변에도 같이 더하는 것이 풀이의 전부이고, 문자로 끝까지 가면 근의 공식입니다.',
 build:complSqDemo},
{n:51,core:0,t:'“꼭짓점 택배” 이차함수의 평행이동',q:'y=(x−p)²+q 의 p, q 는 무엇일까?',
 m:['이차함수','평행이동','꼭짓점'],a:['파라미터와 위치','좌표 변환'],
 note:'꼭짓점을 끌어 목표 식의 자리로 포물선을 배달하세요. 괄호 안이 x−3 인데 오른쪽으로 가는 부호의 함정 — “3 늦게 출발한다”로 풀립니다.',
 build:parabShiftDemo},
{n:52,core:0,t:'“울타리 20m 의 최대 넓이” 이차함수 최적화',q:'울타리 20m 로 가장 넓은 땅을 만들려면?',
 m:['이차함수의 최대·최소','완전제곱식','정의역'],a:['최적화','제약 조건'],
 note:'모서리를 끌면 넓이 그래프에 지금 위치가 찍힙니다. 봉우리(w=5, 정사각형)를 찾고, S=−(w−5)²+25 로 그 좌표를 증명하세요. 정의역 밖(w>10)이 왜 무의미한지도 화면이 말해 줍니다.',
 build:fenceDemo},
{n:53,core:0,t:'“전개를 그림으로” 곱셈공식의 넓이 모형',q:'식의 전개를 그림으로 볼 수 있을까?',
 m:['곱셈공식','(a+b)²·(a−b)²','다항식의 전개'],a:['포함배제','기호↔도형 번역'],
 note:'a·b 경계를 끌면 (a+b)² 의 네 조각이 실제 넓이로 움직입니다. (a−b)² 모드에서는 두 번 뺀 겹침을 b² 만큼 되돌리는 순간 — 공식의 +b² — 이 그림에서 먼저 나옵니다.',
 build:xpDemo},
{n:54,core:0,t:'“왜 하필 그 수일까” 특수각의 삼각비',q:'30°·45°·60° 의 값은 왜 그 수일까?',
 m:['삼각비','특수각','정삼각형·정사각형'],a:['삼각함수 테이블','정밀 기준값'],
 note:'사분원의 점을 끌면 특수각에서 자석처럼 붙으며 sin·cos·tan 의 정확한 값(분수·근호)이 뜹니다. 「근거」 버튼이 정삼각형 반쪽(1:√3:2)·정사각형 반쪽(1:1:√2)을 그려 값의 출생지를 보여 줍니다.',
 build:taDemo},
{n:55,core:0,t:'“계산기 이전의 계산기” 삼각비의 표와 보간',q:'계산기 없던 시절엔 어떻게 구했을까?',
 m:['삼각비의 표','일차 보간','함수의 증가'],a:['룩업 테이블','근사 계산'],
 note:'각을 바꿔 가며 나만의 sin 표를 만들고, 표에 없는 sin 37° 를 이웃 두 칸을 직선으로 이어 추정합니다. 컴퓨터 그래픽·게임 엔진이 지금도 쓰는 룩업 테이블+보간의 원형입니다.',
 build:tbDemo},
{n:56,core:0,t:'“어디서 봐도 같은 각” 원주각',q:'카메라의 시야각은 어디서 같아질까?',
 m:['원주각','중심각','탈레스의 정리'],a:['시야 범위','카메라 배치'],
 note:'P 를 원 위 어디로 끌어도 원주각이 변하지 않는 것, 중심각이 정확히 그 두 배인 것, 지름을 만들면 90°(탈레스)가 되는 것 — 세 발견이 한 화면에서 이어집니다.',
 build:iaDemo},
{n:57,core:0,t:'“위성은 어디까지 보나” 원의 접선',q:'위성은 지구의 어디까지 보일까?',
 m:['접선','접선의 길이','피타고라스 정리'],a:['가시 범위','통신 커버리지'],
 note:'위성을 끌면 두 접선과 가시 범위(붉은 호)가 따라 움직입니다. 두 접선의 길이가 늘 같은 것, 아무리 멀어도 반구(180°)를 못 넘는 것, PA² = OP² − r² 검산까지.',
 build:tnDemo},
{n:58,core:0,t:'“네 점이 한 원 위에 있다면” 내접 사각형',q:'네 점이 한 원 위에 있으면 무엇이 정해질까?',
 m:['원에 내접하는 사각형','원주각','대각의 합'],a:['기하 제약 검사','형상 판정'],
 note:'꼭짓점을 원을 따라 끌면 모양이 아무리 변해도 대각의 합은 180°. D 를 원에서 떼어 내는 순간 그 약속이 무너집니다 — 조건과 결론의 관계를 반례로 체험합니다.',
 build:cyDemo},
{n:59,core:0,t:'“이상치를 자동으로 찾는 그림” 상자그림',q:'이상치를 눈으로 찾으려면?',
 m:['상자그림','사분위수·IQR','이상치 판정'],a:['분포 시각화','데이터 정제'],
 note:'기록 점을 끌어 멀리 보내면 1.5×IQR 수염 한계를 넘는 순간 자동으로 이상치로 분리됩니다. 평균은 끌려가는데 상자는 버티는 것 — 순서 기반 통계의 강건함이 한눈에 보입니다.',
 build:bxDemo},
{n:60,core:0,t:'“점 하나의 권력” 이상치와 상관',q:'점 하나가 결론을 바꿀 수 있을까?',
 m:['산점도','상관계수','자료의 정제'],a:['데이터 정제','로버스트 통계'],
 note:'구석에 이상치를 찍으면 r 이 0.98 → 0.6 대로 무너지고, 제외 토글이 되살립니다. 지워도 되는 점(입력 실수)과 지우면 안 되는 점(진짜 특이 사례)의 구분까지 다룹니다.',
 build:ocDemo},
{n:61,core:0,t:'“소수를 어떻게 다 찾지?” 에라토스테네스의 체',q:'2부터 120까지의 소수를 빠짐없이 찾는 가장 빠른 방법은?',
 m:['소수와 합성수','배수','제곱근의 어림'],a:['소수 판정 알고리즘','암호 키 생성'],
 note:'「다음 소수로 거르기」를 누를 때마다 그 소수의 배수가 지워집니다. 7 다음부터는 <b>아무것도 새로 지워지지 않는</b> 순간이 옵니다 — 7² = 49 는 120 안이지만 11² = 121 은 밖이기 때문입니다. 남은 수는 전부 소수입니다.',
 build:sieveDemo},
{n:62,core:0,t:'“오차는 어떻게 재야 공평할까?” 절댓값과 평균 오차',q:'+3 과 −3 을 더하면 0 — 그럼 예보가 만점일까?',
 m:['절댓값','정수의 덧셈','평균'],a:['손실 함수','예보 평가 지표'],
 note:'예측 점을 끌어 실제 기온에 맞춰 보세요. <b>부호 합이 0 인데 예측은 엉망</b>인 배치를 만들 수 있습니다 — 상쇄가 만든 착시입니다. 절댓값(거리)으로 재는 순간 실력이 드러납니다.',
 build:absErrDemo},
{n:63,core:0,t:'“기계에 식을 넣으면?” 식의 값과 대입',q:'2a 에 a = 7 을 넣으면 27일까 14일까?',
 m:['문자의 사용','식의 값','대입'],a:['함수 개념의 씨앗','수식 계산기'],
 note:'숫자 카드를 자판기에 넣으면 식의 값이 나옵니다. a 가 1씩 커질 때 2a+3 은 일정하게, a² 은 점점 크게 변합니다 — 그 차이를 기록표에서 발견하세요. 함정 문제(27 vs 14)도 꼭 풀어 보세요.',
 build:substDemo},
{n:64,core:0,t:'“소금물을 5%로 맞춰라” 비율·농도와 방정식',q:'물을 부으면 농도는 왜 낮아질까 — 소금은 그대로인데?',
 m:['비율과 백분율','일차방정식','농도'],a:['용액 배합','비율 감각'],
 note:'물·소금·증발 버튼으로 목표 5% 를 정확히 맞춰 보세요. 화면의 「5%까지 물 ○g」이 곧 방정식 20/(200+x) = 5/100 의 해입니다 — 버튼으로 먼저 겪고 식으로 확인합니다.',
 build:saltDemo},
{n:65,core:0,t:'“접지 않고 반 나누기” 수직이등분선의 작도',q:'자로 재지 않고 선분의 한가운데를 어떻게 찾을까?',
 m:['작도','수직이등분선','거리'],a:['CAD 제약 조건','보로노이 분할'],
 note:'컴퍼스 반지름이 AB 절반보다 짧으면 호가 만나지 않습니다. 완성된 선 위의 점 P 를 끌어 보세요 — <b>어디에 있든 PA = PB</b>. 이 직선은 “두 점에서 같은 거리인 점들의 모임”입니다.',
 build:pbisectDemo},
{n:66,core:0,t:'“각도기 없이 절반” 각의 이등분선 작도',q:'각도기가 없는데 어떤 각이든 정확히 반으로 나눌 수 있을까?',
 m:['작도','각의 이등분선','합동(SSS)'],a:['로봇 관절 경로','제도(製圖)'],
 note:'컴퍼스 두 번이면 끝입니다. 각의 크기를 끌어 바꿔도 이등분선의 각이 늘 정확히 절반인지 확인하세요. r₁·r₂ 를 바꿔도 결과가 안 변하는 이유가 곧 SSS 합동입니다.',
 build:abisectDemo},
{n:67,core:0,t:'“부채꼴을 펼치면 보인다” S = ½rl 의 발견',q:'부채꼴 넓이 공식은 어디서 왔을까?',
 m:['부채꼴의 호와 넓이','원의 넓이','극한의 직관'],a:['구분구적의 씨앗','도형 분할'],
 note:'조각을 2배씩 잘게 자르면 오른쪽 붙인 모양이 점점 평행사변형(가로 l/2 · 세로 r)이 됩니다. ½rl 과 πr²×각/360 이 늘 같은 것을 표에서 확인하세요 — 원의 넓이 πr² 도 같은 원리입니다.',
 build:arcAreaDemo},
{n:68,core:0,t:'“왜 5개뿐일까?” 정다면체와 꼭짓점의 각',q:'주사위 모양(정다면체)은 왜 다섯 가지뿐일까?',
 m:['정다면체','다각형의 내각','입체도형'],a:['분자 구조','게임 주사위 설계'],
 note:'한 꼭짓점에 정다각형을 모아 보세요. 합이 360°보다 <b>작아야</b> 오므라들어 입체가 되고, 3장 이상 모여야 꼭짓점이 됩니다. 이 두 조건을 만족하는 조합은 정확히 5가지 — 전부 찾아 보세요.',
 build:platonicDemo},
{n:69,core:0,t:'“예산 안에서 몇 개까지?” 일차부등식',q:'5,000원으로 800원짜리 간식을 몇 개까지 살 수 있을까?',
 m:['일차부등식','부등호의 성질','수직선의 해'],a:['제약 조건','최적화의 씨앗'],
 note:'하나씩 담다 보면 예산 금이 다가옵니다 — 800x ≤ 5000 의 해 x ≤ 6.25, 실제 답은 6. 「−2 곱하기」에서 부등호를 안 뒤집으면 수직선의 해가 반대로 칠해지는 사고를 직접 겪어 보세요.',
 build:ineqDemo},
{n:70,core:0,t:'“내 사물함은 몇 번?” 나머지와 해시',q:'수천 명의 자료를 컴퓨터는 어느 서랍에 넣을까?',
 m:['나머지','배수와 약수','나눗셈의 원리'],a:['해시 테이블','데이터 분산 저장'],
 note:'학번 % m 이 사물함 번호입니다. 학번이 모두 짝수일 때 m = 8 로 배정해 보세요 — 홀수 칸이 텅 빕니다(짝수−짝수=짝수). m = 7 로 바꾸면 골고루 퍼집니다. 해시 테이블이 소수 크기를 쓰는 이유입니다.',
 build:hashDemo},
{n:71,core:0,t:'“0.1 + 0.2 는 왜 0.3 이 아닐까?” 순환소수와 부동소수점',q:'유한소수와 순환소수는 무엇이 가를까?',
 m:['유리수와 순환소수','분모의 소인수','나머지'],a:['부동소수점 오차','수치 계산의 함정'],
 note:'분수를 골라 「한 자리 더 나누기」를 연타하세요. 나눗셈의 <b>나머지가 다시 겹치는 순간</b>부터 순환이 시작됩니다 — 나머지는 분모 가짓수뿐이라 반드시 겹칩니다. 분모가 2·5 뿐이면 나머지 0 으로 끝나 유한소수.',
 build:fracDecDemo},
{n:72,core:0,t:'“0.242424… 를 분수로” 순환마디 복원',q:'무한히 이어지는 꼬리를 어떻게 없앨까?',
 m:['순환소수','분수 변환','자릿수 정렬'],a:['무한의 유한 표현','기호 계산'],
 note:'×10 을 마디 길이만큼 눌러 소수점 아래를 <b>완전히 겹치게</b> 만든 뒤 「두 식 빼기」 — 무한 꼬리가 통째로 사라집니다. 덜 곱하고 빼면 실패하는 것도 직접 겪어 보세요.',
 build:recurDemo},
{n:73,core:0,t:'“42번 접으면 달까지” 지수법칙',q:'종이를 반씩 접으면 두께는 어떻게 자랄까?',
 m:['거듭제곱','지수법칙','기하급수적 증가'],a:['복리·전염 확산','데이터 폭증'],
 note:'「반으로 접기」를 연타하며 로그 사다리에서 손가락 → 빌딩 → 에베레스트 → 달을 지나는 순간을 지켜보세요. 더하기였다면 지금 몇 mm 였을지가 함께 표시됩니다 — 곱하기의 위력.',
 build:foldDemo},
{n:74,core:0,t:'“−2 를 곱하는 순간” 부등호의 반전',q:'양변에 음수를 곱하면 왜 부등호가 뒤집힐까?',
 m:['부등식의 성질','수직선','반사'],a:['제약 조건 처리','판정 로직'],
 note:'배율 k 를 양수에서 음수로 끌어 넘겨 보세요. 수직선 전체가 0 을 중심으로 <b>뒤집히며</b> a·b 의 순서가 반대가 됩니다. k = 0 에서 순서가 사라지는 것도 확인하세요.',
 build:flipDemo},
{n:75,core:0,t:'“만나거나, 평행하거나, 겹치거나” 연립방정식의 해',q:'해가 없다는 건 그림으로 무엇일까?',
 m:['연립일차방정식','일차함수의 그래프','교점'],a:['선형 시스템','제약 충돌 감지'],
 note:'두 직선의 절편·기울기 손잡이를 끌어 <b>한 점 · 평행 · 일치</b> 세 경우를 모두 만들어 보세요. 기울기가 가까워지면 평행으로 딸깍 붙습니다 — 해 1개 · 없음 · 무수히가 그림에서 갈립니다.',
 build:sysDemo},
{n:76,core:0,t:'“문자를 하나씩 지운다” 소거법 시뮬레이터',q:'미지수 두 개를 어떻게 하나씩 지울까?',
 m:['연립일차방정식','소거법','등식의 성질'],a:['가우스 소거','제약 풀이'],
 note:'①×3, ②×2 같은 버튼으로 계수를 직접 맞춘 뒤 두 식을 더하거나 빼 보세요. 한 문자가 사라지는 순간이 소거입니다 — 최소공배수가 왜 등장하는지도 손끝에서 보입니다.',
 build:elimDemo},
{n:77,core:0,t:'“회전과 평행이동” 기울기와 절편',q:'기울기를 바꾸면 직선은 어디를 축으로 돌까?',
 m:['일차함수','기울기','y절편'],a:['회귀직선의 계수','파라미터 감각'],
 note:'절편 손잡이와 기울기 손잡이를 <b>따로</b> 끌어 보세요. 잔상을 켜면 회전(절편 고정)과 평행이동(기울기 고정)이 다른 운동임이 한눈에 남습니다.',
 build:slopeDemo},
{n:78,core:0,t:'“식을 읽고 직선을 놓아라” 식 ↔ 그래프 왕복',q:'식만 보고 그래프를 그릴 수 있을까?',
 m:['일차함수의 그래프','두 점','절편과 기울기'],a:['식과 그림의 상호 번역','시각화'],
 note:'문제의 식을 읽고 두 점을 끌어 그 그래프를 직접 만드세요. 맞으면 초록으로 켜집니다. 절편에 한 점, 「오른쪽 1·위로 a」에 한 점 — 두 점이면 직선은 끝납니다.',
 build:lineFitDemo},
{n:79,core:0,t:'“균형점을 찾아라” 삼각형의 무게중심',q:'종이 삼각형은 어디를 받쳐야 균형이 잡힐까?',
 m:['삼각형의 무게중심','중선','2:1 내분'],a:['질량중심','평균 위치'],
 note:'먼저 균형점을 <b>추측해 놓고</b> 「중선 그려 확인」을 누르세요. 세 중선이 한 점에서 만나고 그 점이 중선을 2:1 로 나누는 것을, 삼각형을 바꿔 가며 확인합니다.',
 build:centroidDemo},
{n:80,core:0,t:'“사다리꼴은 왜 탈락일까” 평행사변형의 조건',q:'어떤 조건이면 반드시 평행사변형일까?',
 m:['평행사변형의 성질','사각형의 판별','대각선'],a:['형상 인식 규칙','조건 검사'],
 note:'네 꼭짓점을 끌면 다섯 판정(평행 2·같음 2·대각선 이등분)이 실시간으로 켜지고 꺼집니다. 다섯이 <b>늘 함께</b> 움직이는 것, 한 쌍 평행만으로는 안 되는 것(사다리꼴 함정)을 확인하세요.',
 build:paragramDemo},
{n:81,core:0,t:'“2배로 키우면 4배 무거워진다” 닮음과 축척',q:'지도 1:25000 에서 넓이는 몇 배일까?',
 m:['도형의 닮음','닮음비','넓이의 비'],a:['이미지 리사이즈','지도 축척'],
 note:'모서리 손잡이로 그림을 확대해 보세요. 길이는 k배인데 넓이 타일은 k²장 — k=2 에서 정확히 4장이 되는 순간을 잡으세요.',
 build:scaleMapDemo},
{n:82,core:0,t:'“빔프로젝터의 원리” 닮음의 중심',q:'확대·축소의 중심을 옮기면 어떻게 될까?',
 m:['닮음의 위치','닮음의 중심','대응점'],a:['프로젝터·그림자','이미지 변환'],
 note:'중심 O 와 배율 손잡이를 끌어 보세요. 대응점을 이은 선이 <b>전부 O 를 지나는</b> 것이 닮음의 위치입니다. k 를 음수로 끌면 상이 O 반대편에 뒤집혀 생깁니다 — 바늘구멍 사진기입니다.',
 build:homothetyDemo},
{n:83,core:0,t:'“55인치의 정체” 피타고라스 정리',q:'“55인치 TV”의 55는 어디를 잰 걸까?',
 m:['피타고라스 정리','직각삼각형','제곱근'],a:['유클리드 거리','화면 규격'],
 note:'가로·세로 손잡이를 끌면 세 변 위 넓이 막대(a²·b²·c²)가 함께 움직입니다. a² + b² 가 c² 와 언제나 같은 것, (12, 9)에서 대각선 15 가 떨어지는 것을 확인하세요.',
 build:pythaDemo},
{n:84,core:0,t:'“직각인지 재지 않고 알기” 피타고라스의 역',q:'각도기 없이 직각을 어떻게 확인할까?',
 m:['피타고라스 정리의 역','예각·둔각 판정','삼각부등식'],a:['직각 검사','측량'],
 note:'세 변 손잡이를 끌면 최대각이 실시간으로 계산됩니다. 판정은 반드시 <b>가장 긴 변</b>으로 — c² 이 나머지 제곱합보다 크면 둔각, 작으면 예각, 같으면 직각(목수의 3·4·5 밧줄).',
 build:pythaConvDemo},
{n:85,core:0,t:'“자연수 보물찾기” 피타고라스 수',q:'변이 모두 자연수인 직각삼각형은 몇 개나 있을까?',
 m:['피타고라스 수','제곱수','서로소'],a:['정수 해 탐색','디오판토스 문제'],
 note:'격자에서 (a, b) 를 눌러 c 가 자연수로 떨어지는 보물을 사냥하세요. (3,4,5)의 배수는 자동으로 보물 — 진짜 사냥감은 (5,12,13)·(8,15,17) 같은 원시 수입니다.',
 build:tripleDemo},
{n:86,core:0,t:'“또는은 더하고 그리고는 곱한다” 경우의 수',q:'「또는」과 「그리고」는 왜 계산이 다를까?',
 m:['경우의 수','합의 법칙','곱의 법칙'],a:['탐색 공간','조합 폭발'],
 note:'세트 주문(그리고)은 나무의 가지가 다시 뻗어 3 × 2, 하나만 주문(또는)은 목록이 나란히 놓여 3 + 2 — 가지 끝을 직접 세며 두 법칙이 갈리는 지점을 확인하세요.',
 build:countDemo},
{n:87,core:0,t:'“2배 모형은 8배 무겁다” 닮음비와 넓이·부피비',q:'축소 모형의 무게는 몇 분의 1일까?',
 m:['닮음비','넓이의 비','부피의 비'],a:['스케일 모형','제곱-세제곱 법칙'],
 note:'배율 손잡이를 끌면 길이·겉넓이·부피 게이지가 <b>서로 다른 속도</b>로 자랍니다 — k, k², k³. 거인이 없는 이유, 코끼리 다리가 굵은 이유가 이 세제곱에 있습니다.',
 build:cubeScaleDemo},
{n:88,core:0,t:'“적어도 하나”의 지름길 — 여사건',q:'“적어도 하나”는 어떻게 셀까?',
 m:['여사건','확률의 기본 성질','경우의 수'],a:['보완 계산','전수 조사 회피'],
 note:'동전 3개의 8가지 경우에서 「적어도 하나 앞면」을 <b>직접 눌러 골라</b> 보세요(7칸 — 빠뜨리기 쉽습니다). 「여사건으로 뒤집기」를 누르면 반대쪽 단 1칸으로 끝납니다 — 1 − 1/8 = 7/8.',
 build:complementDemo},
{n:89,core:0,t:'“이제 나올 때가 됐다?” 독립시행',q:'앞면이 다섯 번 연속이면 다음은 뒷면일까?',
 m:['독립시행','확률의 곱','도박사의 오류'],a:['난수와 시뮬레이션','인지 편향'],
 note:'동전을 연타하며 <b>「앞면 3연속」 직후의 결과</b>만 따로 집계합니다. 표본이 쌓이면 반반 — 동전은 기억이 없습니다. 큰 수의 법칙(LAB 09)과 헷갈리지 않는 것이 목표입니다.',
 build:indepDemo},
{n:90,core:0,t:'“조건은 새로운 전체다” 조건부확률',q:'조건을 알고 나면 확률이 왜 변할까?',
 m:['조건부확률','분모의 축소','비율'],a:['스팸 필터의 씨앗','정보와 확률'],
 note:'조건 버튼을 누르면 조건 밖 학생들이 <b>어두워지고</b>, 밝게 남은 무리가 새 분모가 됩니다. 같은 사건(안경 쓴 여학생)의 확률이 조건마다 달라지는 것을 눈으로 확인하세요.',
 build:condProbDemo},
{n:91,core:0,t:'“겹침을 두 번 세지 마라” 확률의 덧셈',q:'두 사건을 함께 볼 때는?',
 m:['확률의 덧셈정리','배반사건','벤다이어그램'],a:['사건 결합','중복 제거'],
 note:'두 원을 끌어 겹침을 조절해 보세요. 그냥 더하면 겹친 만큼 <b>두 번 세어져 1 을 넘는 사고</b>가 나고, P(A∩B) 를 빼면 바로잡힙니다. 떨어져 있을 때(배반)만 덧셈으로 충분합니다.',
 build:probAddDemo},
{n:92,core:0,t:'“계수만으로 나눗셈” 조립제법',q:'나눗셈을 계수만으로 할 수 있을까?',
 m:['다항식의 나눗셈','조립제법','몫과 나머지'],a:['알고리즘 최적화','호너의 방법'],
 note:'내리고·곱하고·더하고 — 세 동작이 칸을 타고 흐르는 것을 한 칸씩 진행하며 봅니다. k 를 잘 고르면 나머지가 0 이 되는 순간, 나눗셈이 인수분해로 바뀝니다.',
 build:snDemo},
{n:93,core:0,t:'“나누지 않고 아는 나머지” 나머지정리',q:'직접 나누지 않고 나머지를 알 수 있을까?',
 m:['나머지정리','인수정리','삼차식의 인수분해'],a:['빠른 판정','근 탐색'],
 note:'a 를 끌면 f(a) 가 즉시 계산되고, 「실제로 나눠 확인」이 늘 같은 값을 보여 줍니다. f(a)=0 인 자리 셋을 모두 찾으면 삼차식이 완전 인수분해로 무너집니다.',
 build:rmDemo},
{n:94,core:0,t:'“i 를 곱하면 90° 회전” 복소평면',q:'i 를 곱한다는 건 그림에서 무엇일까?',
 m:['복소수','복소평면','켤레복소수'],a:['신호 처리','회전 표현'],
 note:'z 를 찍고 ×i 를 누를 때마다 점이 정확히 90° 씩 돕니다 — 네 번이면 제자리(i⁴=1). 켤레 토글은 실수축 거울 대칭과 z·z̄ 가 실수가 되는 것까지 보여 줍니다.',
 build:cxDemo},
{n:95,core:0,t:'“구하지 않고 아는 합과 곱” 근과 계수',q:'근을 구하지 않고 두 근의 합을 알 수 있을까?',
 m:['이차방정식','근과 계수의 관계','두 수 찾기'],a:['역문제','파라미터 추정'],
 note:'b·c 를 움직이면 두 근·합·곱이 실시간으로 따라옵니다 — 합은 늘 −b, 곱은 늘 c. 「수 맞히기」는 이 관계를 거꾸로 쓰는 게임: 합·곱만 듣고 두 수를 방정식으로 잡습니다.',
 build:vtDemo},
{n:96,core:0,t:'“산과 골짜기가 정하는 근의 수” 삼차방정식',q:'삼차식은 실근이 몇 개일까?',
 m:['삼차방정식','그래프와 실근','극값'],a:['해의 존재 판정','근 개수 분석'],
 note:'곡선을 위아래로 끌면 실근이 1개 ↔ 2개(접함, 자석) ↔ 3개로 갈립니다. 극대·극소가 x축을 사이에 두는가 — 판별식의 삼차 버전을 눈으로 만듭니다.',
 build:cbDemo},
{n:97,core:0,t:'“해집합이 칠해진다” 이차부등식',q:'부등식의 해는 그림에서 어디일까?',
 m:['이차부등식','이차함수의 그래프','해집합'],a:['조건 영역','허용 범위 판정'],
 note:'포물선의 지하(<0) 구간이 붉게, 해집합이 수직선에 초록으로 칠해집니다. 구간·바깥·모든 실수·해 없음 — 네 가지 운명을 b·c·부등호 방향으로 모두 만들어 봅니다.',
 build:qiDemo},
{n:98,core:0,t:'“답은 늘 꼭짓점에 있다” 선형계획',q:'한정된 자원으로 이익을 최대로 하려면?',
 m:['연립일차부등식','부등식의 영역','최적화'],a:['선형계획법','자원 배분'],
 note:'제약이 만든 영역 위에서 이익선을 끌어 올리면, 마지막으로 스치는 곳이 언제나 꼭짓점입니다. 목적함수를 바꾸면 최적 꼭짓점이 옮겨 가는 것까지 — OR 의 첫 페이지입니다.',
 build:lpDemo},
{n:99,core:0,t:'“순서의 값은 2! 배” 순열과 조합',q:'순서를 따지느냐가 왜 그렇게 중요할까?',
 m:['순열','조합','같은 것이 있는 순열'],a:['경우의 수 알고리즘','중복 제거'],
 note:'회장·부회장(순열 12)과 청소 짝(조합 6)의 목록이 실제로 쌓입니다 — 정확히 2! 배. AABB 도전은 「구별 안 되는 것끼리 바꿔치기」를 나눗셈으로 지우는 감각을 줍니다.',
 build:pmDemo},
{n:100,core:0,t:'“사진을 움직이는 숫자판” 행렬과 변환',q:'사진 회전·확대는 왜 행렬 곱셈일까?',
 m:['행렬','일차변환','행렬식'],a:['컴퓨터 그래픽','이미지 변환'],
 note:'기저 화살표 두 개를 끌면 도형 F 가 통째로 따라 변합니다 — 열이 곧 기저의 목적지. 90° 회전 행렬을 직접 만들어 유령에 겹치고, det = 0 의 붕괴까지 봅니다.',
 build:mxDemo},
{n:101,core:0,t:'“순서를 타는 곱셈” 행렬 곱의 비가환',q:'순서를 바꾸면 결과가 달라지는 곱셈이 있을까?',
 m:['행렬의 곱셈','합성 변환','교환법칙'],a:['변환 파이프라인','연산 순서'],
 note:'회전→늘리기와 늘리기→회전을 두 판에 나란히 — 결과가 다릅니다(AB ≠ BA). 균등 확대처럼 순서를 안 타는 짝을 찾는 것이 반전 미션입니다.',
 build:ncDemo},
{n:102,core:0,t:'“책상 밖으로 무한히” 카드 쌓기와 조화급수',q:'카드를 얼마나 멀리 내밀 수 있을까?',
 m:['무한급수','조화급수의 발산','무게중심'],a:['구조 안정성','RME 실험의 디지털 전환'],
 note:'2019 RME 수업(종이 카드 실험)의 디지털판. 카드를 끌면 무게중심 판정이 실시간으로 무너짐을 알려 주고, ½·¼·⅙ 규칙을 발견하면 4장만으로 맨 위 카드가 책상 밖 허공에 뜹니다. 이론 한계 ½Hₙ 이 화면에 함께 있어 실험↔이론이 즉시 비교됩니다.',
 build:ovDemo},
{n:103,core:0,t:'“색은 좌표다” RGB 색 좌표 실험실',q:'그림판의 색 코드는 무슨 뜻일까?',
 m:['16진법','내분점','무게중심 좌표'],a:['디지털 색 표현','픽셀과 이미지'],
 note:'2019 STEAM 색공간 수업의 디지털판. 슬라이더로 색 좌표를 옮기면 원색 삼각형 위의 점이 따라 움직이고, 16진수 해독·1:3 내분점 색 만들기·무채색(무게중심) 합성까지 세 도전이 이어집니다. 내분점 공식이 미술 팔레트에서 다시 태어납니다.',
 build:clDemo},
{n:104,core:0,t:'“접으면 3등분” 종이접기 등분 실험실',q:'자와 컴퍼스로 못 하는 일을 접기로 할 수 있을까?',
 m:['닮음비','내분점','합동','작도 불가능 문제'],a:['오리가미 수학','공학의 접기 구조'],
 note:'「종이접기를 활용한 내분점·외분점」 교안의 디지털판. 색종이를 접듯 단계를 눌러 3등분·5등분 점을 만들고, 자와 컴퍼스로는 불가능한 임의의 각 3등분(Abe, 1980)까지 접어 냅니다. 접힌 선의 자리를 정하는 것은 눈대중이 아니라 닮음과 합동입니다.',
 build:origamiDemo},
{n:105,core:0,t:'“주사위 100개” 실험으로 만드는 지수 감소',q:'매년 1/6이 떠나면 10년 뒤 몇 세대가 남을까?',
 m:['지수함수','로그','실험과 이론의 오차'],a:['인구 모형','방사성 붕괴','표본과 변동'],
 note:'2021 「지수함수와 로그함수」 수업(모둠별 주사위 100개 굴리기)의 디지털판. 한 해에 1이 나온 주사위를 빼며 남은 세대를 쌓으면, 이론 곡선 100(5/6)ᵗ 둘레로 실험값이 흔들립니다. 10세대 이하가 되는 해는 로그로 예측하고 실험으로 검증합니다.',
 build:decayDemo},
{n:106,core:0,t:'“90°가 넘으면?” 단위원으로 넓힌 삼각비',q:'sin 150° 는 얼마이고, 왜 그럴까?',
 m:['단위원','삼각함수의 정의','주기'],a:['회전 좌표','신호의 위상'],
 note:'직각삼각형으로는 90°가 넘는 각의 삼각비를 말할 수 없습니다. 원 위의 점을 끌어 각을 넓히면 sin·cos 이 좌표가 되고, 사분면마다 부호가 갈리며, 360°를 넘는 순간 제자리로 돌아옵니다.',
 build:unitCircleDemo},
{n:107,core:0,t:'“해는 왜 물결처럼 뜰까?” 일출 시각 모형',q:'1년의 일출을 식 하나로 쓸 수 있을까?',
 m:['삼각함수의 그래프','진폭·주기·위상','모형화'],a:['시계열 모형','계절성 예측'],
 note:'대전의 월별 일출 시각 12개를 점으로 두고 A·D·C 를 맞춰 곡선을 얹습니다. 오차(RMSE)가 7분 아래로 떨어지는 순간, 1년이 식 하나로 들어옵니다.',
 build:sunriseDemo},
{n:108,core:0,t:'“강 건너까지 몇 m?” 사인·코사인법칙 측량',q:'갈 수 없는 곳까지의 거리를 어떻게 잴까?',
 m:['사인법칙','코사인법칙','ASA'],a:['삼각측량','드론 거리 측정'],
 note:'기선 하나와 두 각만으로 강 건너 나무까지의 거리가 정해집니다(ASA). 사인법칙으로 구한 값을 코사인법칙으로 검산해 두 법칙이 같은 삼각형을 말하고 있음을 확인합니다.',
 build:lawsDemo},
{n:109,core:0,t:'“월 상환액은 어떻게 정해질까?” 대출과 등비수열',q:'1,200만원을 24개월에 나눠 갚으면 매달 얼마?',
 m:['등비수열의 합','현재가치','원리금균등상환'],a:['금융 계산','구독 결제 모형'],
 note:'매달 같은 금액을 갚는 상환액은 각 달의 상환을 현재가치로 되돌려 더한 등비수열의 합에서 나옵니다. 기간을 늘리면 월 부담은 줄지만 총 이자는 늘어나는 거래가 막대로 보입니다.',
 build:loanDemo},
{n:110,core:0,t:'“1부터 100까지를 한 번에” 시그마와 계단',q:'가우스는 어떻게 순식간에 5050 을 말했을까?',
 m:['수열의 합','시그마','도형적 증명'],a:['누적합','데이터 집계'],
 note:'계단 두 개를 맞물려 붙이면 n(n+1) 직사각형이 되고, 계단 하나는 그 절반입니다. 공식을 외우는 대신 도형으로 만들어 냅니다. 제곱의 합까지 이어집니다.',
 build:sigmaDemo},
{n:111,core:0,t:'“도미노가 다 무너지려면” 수학적 귀납법',q:'무한히 많은 경우를 어떻게 다 확인할까?',
 m:['수학적 귀납법','증명의 구조'],a:['알고리즘 정당성','재귀'],
 note:'첫 도미노를 밀지 않거나 간격이 넓거나 한 개를 빼면 사슬이 끊깁니다. 귀납법의 두 조건이 각각 무엇을 하는지 도미노로 몸에 남깁니다.',
 build:dominoDemo},
{n:112,core:0,t:'“몇 해 뒤에 세 배?” 지수방정식과 부등식',q:'지수에 갇힌 x 를 어떻게 꺼낼까?',
 m:['지수방정식','지수부등식','로그의 정의'],a:['복리 계산','성장 시점 예측'],
 note:'y = a^x 곡선과 가로선 y = k 의 교점이 곧 방정식의 해입니다. 밑이 1보다 작을 때 부등호가 뒤집히는 장면까지 직접 만들어 봅니다.',
 build:expEqDemo},
{n:113,core:0,t:'“계산기에 없는 밑” 로그의 밑 변환',q:'log₂ 100 을 상용로그만으로 구할 수 있을까?',
 m:['로그의 밑 변환','상용로그'],a:['정보량 계산','알고리즘 복잡도'],
 note:'log b 와 log a 두 막대의 비가 곧 log_a b 입니다. 거듭제곱 검산으로 결과를 되돌려 확인하고, 밑과 진수가 같을 때 1이 되는 것도 실험합니다.',
 build:logBaseDemo},
{n:114,core:0,t:'“좌표를 맞바꾼 짝” 지수와 로그의 대칭',q:'로그에 음수를 넣을 수 없는 이유는?',
 m:['역함수','y = x 대칭','정의역과 치역'],a:['인코딩과 디코딩','스케일 변환'],
 note:'지수함수의 치역(y > 0)이 로그함수의 정의역이 됩니다. 대응점을 끌어 두 곡선이 y = x 대칭임을 확인하고, 정의역 밖으로 나가 보며 로그의 조건을 몸으로 만납니다.',
 build:expLogDemo},
{n:115,core:0,t:'“2의 100제곱은 몇 자리?” 상용로그의 지표와 가수',q:'계산기가 넘치는 수의 자릿수를 알 수 있을까?',
 m:['상용로그','지표와 가수','자릿수'],a:['빅데이터 규모 감각','벤포드 법칙'],
 note:'log 값의 정수 부분(지표)이 자릿수를, 소수 부분(가수)이 최고 자리 숫자를 쥐고 있습니다. 지수를 키우며 자릿수가 어떻게 자라는지 확인합니다.',
 build:log10Demo},
{n:116,core:0,t:'“밑을 바꾸면 곡선이 뒤집힌다” 지수함수의 변신',q:'점근선은 어디로 움직일까?',
 m:['지수함수의 그래프','평행이동','점근선'],a:['성장·감쇠 모형','신호 감쇠'],
 note:'밑·가로이동·세로이동을 하나씩 움직이며 증가·감소가 갈리는 지점과 점근선이 통째로 들리는 장면을 봅니다. 괄호 안 부호가 반대로 보이는 이유까지.',
 build:expMoveDemo},
{n:117,core:0,t:'“무엇이 무엇을 바꿨나” 주기·진폭·위상',q:'계수 넷은 각각 그래프의 무엇을 맡을까?',
 m:['삼각함수의 그래프','주기와 진폭','위상 이동'],a:['신호 처리','음향 합성'],
 note:'a·b·c·d 를 하나씩만 움직이며 담당 구역을 가려냅니다. 주기 = 2π/b, 최대·최소 = d ± a 가 화면에서 확인됩니다.',
 build:trigParamDemo},
{n:118,core:0,t:'“해가 왜 무한히 많을까” 삼각방정식',q:'sin x = 0.5 의 해는 몇 개일까?',
 m:['삼각방정식','주기성','일반해'],a:['주기 신호의 시점 찾기','위상 검출'],
 note:'단위원과 사인 곡선을 나란히 두고 가로선과의 교점을 셉니다. 한 바퀴 안의 해에 2nπ 를 더하면 전부라는 구조가 눈에 남습니다.',
 build:trigEqDemo},
{n:119,core:0,t:'“두 파동을 더하면” 삼각함수의 합성',q:'3 sin x + 4 cos x 의 최댓값은?',
 m:['삼각함수의 합성','R sin(x+α)','최대·최소'],a:['신호 합성','진폭 계산'],
 note:'a sin x + b cos x 가 왜 다시 사인 곡선이 되는지, 진폭이 왜 √(a²+b²) 인지 곡선을 겹쳐 확인합니다. 3·4·5 가 여기서 다시 등장합니다.',
 build:trigSumDemo},
{n:120,core:0,t:'“각 없이 넓이 구하기” 헤론의 공식',q:'세 변만 알아도 넓이를 구할 수 있을까?',
 m:['헤론의 공식','삼각부등식','SSS'],a:['토지 측량','드론 면적 계산'],
 note:'세 변이 정해지면 삼각형은 합동이므로 넓이도 하나입니다. ½ab sin C 로 검산해 두 길이 같은 값을 주는지 확인합니다.',
 build:heronDemo},
{n:121,core:0,t:'“소리를 성분으로 쪼개다” 푸리에의 직관',q:'각진 파형은 어떤 사인들의 합일까?',
 m:['삼각함수의 합','배음','스펙트럼'],a:['MP3 압축','음성 인식','신호 분해'],
 note:'홀수 배음을 1, 1/3, 1/5, 1/7 비율로 더하면 사각파에 가까워집니다. 파형과 스펙트럼을 나란히 보며 「분해」의 뜻을 만듭니다.',
 build:fourierDemo},
{n:122,core:0,t:'“극장 좌석은 모두 몇 석?” 등차수열과 사다리꼴',q:'줄마다 늘어나는 좌석을 한 번에 셀 수 있을까?',
 m:['등차수열','일반항','수열의 합'],a:['좌석 배치','누적 계획'],
 note:'첫 줄과 끝 줄의 평균에 줄 수를 곱하면 전체가 나옵니다 — 사다리꼴 넓이와 같은 구조가 좌석 배치에서 보입니다.',
 build:apDemo},
{n:123,core:0,t:'“매달 1만원 vs 매달 1%” 등차와 등비의 대결',q:'언제 뒤집힐까?',
 m:['등차수열','등비수열','증가 속도'],a:['저축 전략','성장 비교'],
 note:'더하기는 직선, 곱하기는 곡선입니다. 처음에는 등차가 앞서지만 등비가 반드시 추월하는 시점을 화면에서 찾습니다.',
 build:apGpDemo},
{n:124,core:0,t:'“집계란 무엇인가” 시그마와 누적합',q:'매일의 값과 누적선은 어떤 사이일까?',
 m:['시그마','수열의 합','누적합'],a:['데이터 집계','대시보드 지표'],
 note:'막대(그날의 값)와 꺾은선(누적합)을 나란히 두면, 막대의 모양이 곧 누적선의 기울기임이 보입니다. 시그마의 성질을 자료로 검증합니다.',
 build:sumDataDemo},
{n:125,core:0,t:'“다음 항은 앞 항이 정한다” 점화식',q:'토끼 쌍은 몇 달 뒤 몇 쌍이 될까?',
 m:['점화식','수열의 귀납적 정의','피보나치'],a:['재귀 알고리즘','인구 모형'],
 note:'네 가지 점화식을 한 항씩 만들어 보며 「씨앗 + 규칙」의 구조를 익힙니다. 피보나치 이웃 항의 비가 황금비로 다가가는 장면까지.',
 build:recurSeqDemo},
{n:126,core:0,t:'“매달 넣으면 만기에 얼마?” 적금과 등비수열',q:'같은 돈인데 왜 이자가 다를까?',
 m:['등비수열의 합','원리합계','미래가치'],a:['금융 설계','적립식 투자'],
 note:'매달 같은 금액을 넣어도 넣은 시점마다 이자 기간이 달라 막대 높이가 다릅니다. 그 막대들의 합이 곧 등비수열의 합입니다.',
 build:savingDemo},
{n:127,core:0,t:'“정각에 나가면 얼마?” 좌극한과 우극한',q:'왼쪽에서 갈 때와 오른쪽에서 갈 때가 다를 수 있을까?',
 m:['함수의 극한','좌극한·우극한','극한의 존재'],a:['요금 경계','센서 임계값'],
 note:'극한은 그 점의 값이 아니라 다가가는 값입니다. 계단 요금표에서는 왼쪽과 오른쪽이 끝내 만나지 않습니다.',
 build:lrLimDemo},
{n:128,core:0,t:'“계산기가 오류를 낸다” 0/0 꼴의 정체',q:'0 ÷ 0 은 왜 답이 정해지지 않을까?',
 m:['부정형','인수분해','유리화'],a:['수치 안정성','0 나눗셈 예외 처리'],
 note:'0/0 은 답이 없다는 뜻이 아니라 이 모양만으로는 정할 수 없다는 뜻입니다. 식을 고쳐야 값이 드러납니다.',
 build:zeroDivDemo},
{n:129,core:0,t:'“이 끊김은 고칠 수 있을까” 불연속의 세 종류',q:'끊긴 그래프에도 종류가 있을까?',
 m:['연속의 정의','제거 가능한 불연속','점프·무한 불연속'],a:['결측값 보정','이상치 탐지'],
 note:'연속의 세 조건 중 무엇이 깨졌는지가 끊김의 종류를 정합니다. 극한이 있을 때만 한 점을 고쳐 이을 수 있습니다.',
 build:discontDemo},
{n:130,core:0,t:'“근이 어디 있는지 부호만으로” 사잇값 정리',q:'값을 몰라도 있다는 것은 알 수 있을까?',
 m:['사잇값 정리','연속','이분법'],a:['이분 탐색','수치 해석'],
 note:'양 끝의 부호가 다르면 그 사이에 근이 반드시 있습니다. 반씩 자르면 자릿수가 하나씩 확정됩니다.',
 build:ivtDemo},
{n:131,core:0,t:'“구간을 열어 두면 최댓값이 사라진다” 최대·최소 정리',q:'가장 큰 값은 언제 보장될까?',
 m:['최대·최소 정리','닫힌구간','연속'],a:['최적화의 전제','제약 조건 설계'],
 note:'닫힌구간에서 연속이어야 최댓값·최솟값이 보장됩니다. 두 조건 중 하나만 빠져도 보장이 사라집니다.',
 build:evtDemo},
{n:132,core:0,t:'“여기엔 접선을 못 그린다” 미분 불가능한 점',q:'이어져 있는데도 기울기를 못 정하는 곳이 있을까?',
 m:['미분계수','좌·우 미분계수','미분 가능성'],a:['ReLU 의 꺾인 점','신호의 급변점'],
 note:'미분계수는 평균변화율의 극한입니다. 좌우 극한이 다르면 접선이 하나로 정해지지 않습니다.',
 build:cuspDemo},
{n:133,core:0,t:'“면은 어디를 바라보나” 접선과 법선',q:'곡선 위 한 점에서의 방향은 어떻게 정할까?',
 m:['접선의 방정식','법선','수직 조건'],a:['표면 법선 벡터','반사와 조명'],
 note:'접선의 기울기는 f′(a), 법선은 −1/f′(a) 입니다. 수직 조건은 곱해서 −1 이라는 한 줄로 정리됩니다.',
 build:tangentDemo},
{n:134,core:0,t:'“봉우리는 어디서 생기나” 도함수의 부호',q:'그래프의 오르내림을 식만 보고 알 수 있을까?',
 m:['도함수','증가와 감소','극값'],a:['최적값 탐색','추세 전환점'],
 note:'f′ 의 부호가 f 의 오르내림입니다. f′ 이 부호를 바꾸는 자리에서만 극값이 생깁니다.',
 build:signDerivDemo},
{n:135,core:0,t:'“종이 한 장으로 가장 큰 상자” 최적화',q:'얼마를 잘라야 부피가 가장 클까?',
 m:['최대·최소','도함수의 활용','정의역'],a:['포장 설계','손실 최소화'],
 note:'V(x) = x(W−2x)(H−2x) 의 봉우리를 찾습니다. 정의역의 양 끝에서 부피가 0 이 되는 것도 함께 봅니다.',
 build:boxOptDemo},
{n:136,core:0,t:'“엘리베이터는 언제 가장 빨랐나” 위치·속도·가속도',q:'세 그래프는 어떤 사이일까?',
 m:['속도','가속도','도함수의 활용'],a:['운동 해석','센서 신호 처리'],
 note:'위 그래프의 기울기가 아래 그래프의 값입니다. 속도의 부호가 방향이라는 점이 왕복 운동에서 결정적입니다.',
 build:motionDemo},
{n:137,core:0,t:'“곡선 아래 넓이를 어떻게 재나” 구분구적법',q:'직사각형으로 곡선을 메울 수 있을까?',
 m:['구분구적법','정적분의 정의','극한'],a:['수치 적분','넓이 추정'],
 note:'개수를 늘리면 폭이 함께 줄어야 합니다. 어디서 높이를 재든 같은 값으로 모이는 것이 정적분의 정의입니다.',
 build:riemannDemo},
{n:138,core:0,t:'“넓이를 미분하면 높이” 미적분의 기본정리',q:'미분과 적분은 왜 서로 반대일까?',
 m:['미적분의 기본정리','넓이 함수','도함수'],a:['누적과 순간의 관계','센서 적산'],
 note:'0 부터 x 까지의 넓이를 함수로 보면, 그 함수의 기울기가 원래 함수의 높이가 됩니다. 미분과 적분을 잇는 한 줄입니다.',
 build:ftcDemo},
{n:139,core:0,t:'“어디에 있나, 얼마나 움직였나” 정적분과 누적',q:'속도 그래프의 넓이는 무엇을 뜻할까?',
 m:['정적분의 활용','변위와 거리','부호 있는 넓이'],a:['누적 지표','이동 거리 계산'],
 note:'부호를 살리면 변위, 크기만 더하면 이동 거리입니다. 되돌아오는 구간에서 두 값이 갈립니다.',
 build:accumDemo},
{n:140,core:0,t:'“두 그래프 사이는 얼마나 넓나” 위아래가 바뀌는 자리',q:'한 번에 적분하면 왜 넓이가 작게 나올까?',
 m:['두 곡선 사이의 넓이','교점','절댓값'],a:['차이 면적 계산','성과 격차 시각화'],
 note:'교점에서 위아래가 바뀝니다. 나누지 않고 적분하면 서로 상쇄되어 실제 넓이보다 작게 나옵니다.',
 build:betweenDemo},
{n:141,core:0,t:'“이 그릇의 부피는?” 회전체와 원판',q:'곡선을 돌려 만든 그릇의 부피를 어떻게 잴까?',
 m:['회전체의 부피','원판법','정적분'],a:['용기 설계','3D 모델링'],
 note:'얇은 원판으로 잘라 πr²Δx 를 더합니다. 반지름을 제곱한 뒤 더해야 한다는 점이 핵심입니다.',
 build:solidDemo}
];

/* ---------- LAB 21 y = x 대칭의 발견 (역함수) ---------- */
function symDemo(root){
  root.innerHTML=`<div class="row"><div class="col"><canvas id="sy1" width="380" height="330"></canvas></div>
    <div class="col">
      <label class="ctl">함수 고르기<select id="syf" style="padding:6px;font-size:14px;width:100%">
        <option value="lin">일차 &nbsp; f(x) = 2x − 3</option>
        <option value="sq">이차 &nbsp; y = x² (x ≥ 0)</option>
        <option value="rt" selected>무리 &nbsp; y = √(x − 2) + 1</option>
        <option value="rat">유리 &nbsp; f(x) = (2x + 1)/(x − 1)</option></select></label>
      ${slider('sya','대응점 확인용 x',-2,8,0.1,3,'')}
      <label class="ctl" style="margin-top:8px"><input type="checkbox" id="syp"> 원점 <b>점대칭</b>도 함께 보기</label>
      <div class="out" id="syout"></div>
      <div class="note" style="margin-top:12px">파란 그래프와 초록 그래프 사이에 어떤 대칭이 숨어 있나요? 대응점 연결선으로 확인해 보세요.</div>
    </div></div>`;
  const cv=$('#sy1'),ctx=cv.getContext('2d'),W=380,H=330,O=150,S=26;
  const X=v=>O+v*S, Y=v=>H-O-v*S;
  const F={
    lin:{ f:x=>2*x-3, g:x=>(x+3)/2, dom:[-6,8], idom:[-6,8],
          fs:'f(x) = 2x − 3', gs:'f⁻¹(x) = (x + 3) / 2', note:'교점은 y = x 위의 (3, 3)' },
    sq:{ f:x=>x>=0?x*x:NaN, g:x=>x>=0?Math.sqrt(x):NaN, dom:[0,8], idom:[0,8],
          fs:'y = x²  (x ≥ 0)', gs:'f⁻¹(x) = √x', note:'정의역을 x ≥ 0 으로 제한해야 역함수가 존재' },
    rt:{ f:x=>x>=2?Math.sqrt(x-2)+1:NaN, g:x=>x>=1?Math.pow(x-1,2)+2:NaN, dom:[2,10], idom:[1,5],
          fs:'y = √(x − 2) + 1', gs:'f⁻¹(x) = (x − 1)² + 2  (x ≥ 1)',
          note:'원함수의 치역 y ≥ 1 이 그대로 역함수의 정의역이 됨' },
    rat:{ f:x=>Math.abs(x-1)<0.02?NaN:(2*x+1)/(x-1), g:x=>Math.abs(x-2)<0.02?NaN:(x+1)/(x-2), dom:[-6,8], idom:[-6,8],
          fs:'f(x) = (2x + 1)/(x − 1)', gs:'f⁻¹(x) = (x + 1)/(x − 2)',
          note:'점근선 x = 1, y = 2 가 역함수에서 x = 2, y = 1 로 뒤바뀜' }
  };
  function draw(){
    const k=$('#syf').value, D=F[k], a=+$('#sya').value, showP=$('#syp').checked;
    $('#syav').textContent=a.toFixed(1);
    ctx.clearRect(0,0,W,H); ctx.fillStyle='#fff'; ctx.fillRect(0,0,W,H);
    ctx.strokeStyle='#EEF1F5';
    for(let i=-6;i<=8;i++){ ctx.beginPath();ctx.moveTo(X(i),0);ctx.lineTo(X(i),H);ctx.stroke();
      ctx.beginPath();ctx.moveTo(0,Y(i));ctx.lineTo(W,Y(i));ctx.stroke(); }
    ctx.strokeStyle='#9CA3AF';ctx.lineWidth=1.4;
    ctx.beginPath();ctx.moveTo(0,Y(0));ctx.lineTo(W,Y(0));ctx.moveTo(X(0),0);ctx.lineTo(X(0),H);ctx.stroke();
    ctx.strokeStyle='#B45309';ctx.setLineDash([5,3]);ctx.lineWidth=1.8;
    ctx.beginPath();ctx.moveTo(X(-6),Y(-6));ctx.lineTo(X(9),Y(9));ctx.stroke();ctx.setLineDash([]);
    const plot=(fn,lo,hi,col,w)=>{ ctx.strokeStyle=col;ctx.lineWidth=w;ctx.beginPath();let up=true;
      for(let px=0;px<=W;px++){ const x=(px-O)/S; if(x<lo||x>hi){up=true;continue;}
        const y=fn(x); if(!isFinite(y)||isNaN(y)||Math.abs(y)>12){up=true;continue;}
        if(up){ctx.moveTo(px,Y(y));up=false;} else ctx.lineTo(px,Y(y)); }
      ctx.stroke(); };
    plot(D.f,D.dom[0],D.dom[1],'#2563EB',2.6);
    plot(D.g,D.idom[0],D.idom[1],'#0E9384',2.6);
    // 대응점 (a, f(a)) ↔ (f(a), a)
    const fa=D.f(a);
    let corr='정의역 밖입니다.';
    if(isFinite(fa)&&!isNaN(fa)&&Math.abs(fa)<12){
      ctx.strokeStyle='#BE123C';ctx.setLineDash([3,3]);ctx.lineWidth=1.4;
      ctx.beginPath();ctx.moveTo(X(a),Y(fa));ctx.lineTo(X(fa),Y(a));ctx.stroke();ctx.setLineDash([]);
      [[a,fa],[fa,a]].forEach(([px,py],i)=>{ ctx.fillStyle=i?'#0E9384':'#2563EB';
        ctx.beginPath();ctx.arc(X(px),Y(py),5,0,7);ctx.fill();
        ctx.fillStyle='#111827';ctx.font='bold 11px sans-serif';
        ctx.fillText(`(${px.toFixed(1)}, ${py.toFixed(1)})`,X(px)+7,Y(py)-7); });
      corr=`원함수 위의 점 <b>(${a.toFixed(1)}, ${fa.toFixed(2)})</b> ↔ 역함수 위의 점 <b>(${fa.toFixed(2)}, ${a.toFixed(1)})</b>`;
    }
    // 점대칭 비교 — 좌표를 맞바꾸는 것과 부호를 뒤집는 것의 차이
    let pnote='';
    if(showP){
      plot(x=>{ const y=D.f(-x); return isNaN(y)?NaN:-y; },-D.dom[1],-D.dom[0],'#7C3AED',2);
      if(isFinite(fa)&&!isNaN(fa)){
        ctx.fillStyle='#7C3AED';ctx.beginPath();ctx.arc(X(-a),Y(-fa),4.5,0,7);ctx.fill();
        ctx.font='bold 11px sans-serif';ctx.fillText(`(${(-a).toFixed(1)}, ${(-fa).toFixed(2)})`,X(-a)+7,Y(-fa)-7);
      }
      pnote=`<br><span style="color:#7C3AED">보라 곡선은 <b>원점 점대칭</b> (x, y) → (−x, −y) 입니다.
        y = x 대칭은 <b>좌표를 맞바꾸고</b>, 점대칭은 <b>부호를 뒤집습니다</b> — 결과가 전혀 다릅니다.</span>`;
    }
    $('#syout').innerHTML=
      `<span class="mono" style="font-size:15px">${D.fs}</span><br>
       <span class="mono" style="font-size:15px;color:#0E9384">${D.gs}</span><br><br>
       ${corr}<br><br>
       <span style="color:#6B7280;font-size:12.5px">${D.note}</span>${pnote}`;
  }
  $('#syf').onchange=draw; $('#syp').onchange=draw; $('#sya').oninput=draw; draw();
}

/* ---------- LAB 22 급수의 부분합 (미적분Ⅱ) ----------
   슬라이더로 n 을 밀면 「그래서 수렴이 뭔가」가 남지 않는다. 수렴의 정의는 ε–N 이다.
   그래서 학생이 ① 극한 후보 L 을 손으로 끌어다 놓고 ② 허용 오차 ε 띠의 폭을 끌어 정한 뒤
   ③ 항을 한 개씩 쌓아 「몇 항부터 계속 띠 안인가」를 직접 찾게 한다.
   조화급수는 어떤 L 을 잡아도 결국 띠를 벗어난다 — 발산을 말이 아니라 실패로 겪는다. */
function seriesDemo(root){
  root.innerHTML=`<div class="row"><div class="col">
      <canvas id="se1" width="400" height="330"></canvas>
      <div class="note" style="margin-top:8px">캔버스에서 <b>파란 가로선(극한 후보 L)</b>과
      <b>띠의 가장자리(허용 오차 ε)</b>를 <b>직접 끌어</b> 옮기세요.</div>
    </div>
    <div class="col">
      <label class="ctl">급수 고르기<select id="sek" style="padding:6px;font-size:14px;width:100%">
        <option value="geo">등비급수 &nbsp; Σ (1/2)ⁿ</option>
        <option value="geo2">등비급수 &nbsp; Σ (3/2)ⁿ</option>
        <option value="harm">조화급수 &nbsp; Σ 1/n</option>
        <option value="p2">Σ 1/n²</option>
        <option value="alt">교대급수 &nbsp; Σ (−1)ⁿ⁺¹/n</option></select></label>
      <div class="ctl" style="display:flex;gap:6px;flex-wrap:wrap;margin-top:10px">
        <button class="b t sm" id="seAdd">＋ 한 항 더하기</button>
        <button class="b t sm" id="seAdd10">＋ 10항</button>
        <button class="b g sm" id="seBack">− 한 항</button>
        <button class="b g sm" id="seRst">처음으로</button>
      </div>
      <div class="out" id="seout"></div>
      <div class="note" style="margin-top:12px"><b>수렴한다</b>는 말의 뜻 —
      아무리 좁은 띠를 줘도, <b>어느 항부터는 계속</b> 그 안에 있다.
      한 번이라도 다시 벗어나면 그 L 은 극한이 아닙니다.</div>
    </div></div>`;
  const cv=$('#se1'),ctx=cv.getContext('2d'),W=400,H=330,P=46;
  const F={
    geo: {f:n=>Math.pow(0.5,n), lim:1,    note:'첫째항 1/2, 공비 1/2 → 합은 1'},
    geo2:{f:n=>Math.pow(1.5,n), lim:null, note:'공비가 1보다 커서 발산 — |r| < 1 이 수렴 조건'},
    harm:{f:n=>1/n,             lim:null, note:'항은 0으로 가는데도 합은 발산 — 아주 느리게 커진다'},
    p2:  {f:n=>1/(n*n),         lim:Math.PI*Math.PI/6, note:'π²/6 ≈ 1.6449 (바젤 문제)'},
    alt: {f:n=>Math.pow(-1,n+1)/n, lim:Math.log(2), note:'ln 2 ≈ 0.6931 — 부호가 번갈아 상쇄된다'}
  };
  const S={k:'geo', N:6, L:1, eps:0.25};
  let sums=[], sc={lo:0,hi:2};

  function calc(){ sums=[]; let s=0; for(let n=1;n<=S.N;n++){ s+=F[S.k].f(n); sums.push(s); } }
  function scale(){
    const vals=sums.concat([S.L-S.eps, S.L+S.eps, 0]);
    let lo=Math.min(...vals), hi=Math.max(...vals);
    const pad=(hi-lo)*0.16 || 1; sc={lo:lo-pad, hi:hi+pad};
  }
  const X=i=>P+(W-P-16)*i/Math.max(1,S.N-1);
  const Y=v=>H-P-(H-P-24)*(v-sc.lo)/((sc.hi-sc.lo)||1);
  const invY=y=>sc.lo+(H-P-y)*((sc.hi-sc.lo)||1)/(H-P-24);

  /* 몇 항부터 계속 띠 안인가 — 뒤에서부터 훑어 「마지막으로 벗어난 다음 항」을 찾는다 */
  function verdict(){
    let last=-1;
    for(let i=0;i<sums.length;i++) if(Math.abs(sums[i]-S.L)>=S.eps) last=i;
    if(last===sums.length-1) return {ok:false, N:null, msg:'가장 최근 항이 아직 띠 밖입니다'};
    const N=last+2;                                   // 1부터 세는 항 번호
    const held=sums.length-(last+1);
    return {ok:held>=5, N, held, msg:null};
  }
  function draw(){
    calc(); scale();
    ctx.clearRect(0,0,W,H); ctx.fillStyle='#fff'; ctx.fillRect(0,0,W,H);
    ctx.strokeStyle='#F1F3F6'; ctx.lineWidth=1;
    for(let i=0;i<=5;i++){const y=24+(H-P-24)*i/5;ctx.beginPath();ctx.moveTo(P,y);ctx.lineTo(W-16,y);ctx.stroke();}
    // ε 띠
    const yT=Y(S.L+S.eps), yB=Y(S.L-S.eps);
    ctx.fillStyle='rgba(37,99,235,.09)'; ctx.fillRect(P,Math.min(yT,yB),W-P-16,Math.abs(yB-yT));
    ctx.strokeStyle='#93B4F7'; ctx.setLineDash([4,3]); ctx.lineWidth=1.4;
    [yT,yB].forEach(y=>{ctx.beginPath();ctx.moveTo(P,y);ctx.lineTo(W-16,y);ctx.stroke();});
    ctx.setLineDash([]);
    // 극한 후보 L
    ctx.strokeStyle='#2563EB'; ctx.lineWidth=2.2;
    ctx.beginPath(); ctx.moveTo(P,Y(S.L)); ctx.lineTo(W-16,Y(S.L)); ctx.stroke();
    // 참값(있으면) — 학생이 놓은 L 이 맞았는지 나중에 견주도록 옅게
    if(F[S.k].lim!==null){
      ctx.strokeStyle='#0E9384'; ctx.setLineDash([2,4]); ctx.lineWidth=1.6;
      ctx.beginPath(); ctx.moveTo(P,Y(F[S.k].lim)); ctx.lineTo(W-16,Y(F[S.k].lim)); ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle='#0E9384'; ctx.font='bold 10.5px sans-serif';
      ctx.fillText('참값 '+F[S.k].lim.toFixed(4), W-118, Y(F[S.k].lim)-5);
    }
    // 부분합 — 계단과 점
    ctx.strokeStyle='#111827'; ctx.lineWidth=1.6; ctx.beginPath();
    sums.forEach((v,i)=>{const x=X(i),y=Y(v); i?ctx.lineTo(x,y):ctx.moveTo(x,y);});
    ctx.stroke();
    sums.forEach((v,i)=>{
      const inside=Math.abs(v-S.L)<S.eps;
      ctx.fillStyle=inside?'#0E9384':'#BE123C';
      ctx.beginPath(); ctx.arc(X(i),Y(v),i===sums.length-1?5:3,0,7); ctx.fill();
    });
    // 축
    ctx.strokeStyle='#9CA3AF'; ctx.lineWidth=1.2;
    ctx.beginPath(); ctx.moveTo(P,24); ctx.lineTo(P,H-P); ctx.lineTo(W-16,H-P); ctx.stroke();
    ctx.fillStyle='#6B7280'; ctx.font='11px sans-serif';
    ctx.fillText('항의 번호 n', W-92, H-P+26);
    ctx.fillText('부분합 Sₙ', 6, 18);
    ctx.fillText('1', P-4, H-P+16); ctx.fillText(String(S.N), W-22, H-P+16);
    // 손잡이
    handle(ctx, P+16, Y(S.L), '#2563EB', 'L = '+S.L.toFixed(3));
    handle(ctx, W-30, yT, '#93B4F7', 'ε = '+S.eps.toFixed(3));

    const v=verdict(), last=sums[sums.length-1];
    const hitTrue = F[S.k].lim!==null && Math.abs(S.L-F[S.k].lim)<S.eps;
    $('#seout').innerHTML =
      `<b>${S.N}항까지 더한 값</b> S<sub>${S.N}</sub> = <b>${last.toFixed(6)}</b><br>`
      + `|S<sub>${S.N}</sub> − L| = ${Math.abs(last-S.L).toFixed(6)} &nbsp;·&nbsp; ε = ${S.eps.toFixed(3)}<br>`
      + (v.msg ? `<span style="color:#BE123C"><b>${v.msg}</b> — 항을 더 쌓거나 L·ε 을 옮겨 보세요.</span>`
        : v.ok ? `<span style="color:#0E9384"><b>N = ${v.N} 부터 지금까지 계속 띠 안</b> (${v.held}항 연속)</span>`
               : `<span style="color:#B45309">N = ${v.N} 부터 띠 안이지만 아직 ${v.held}항뿐 — 더 쌓아 확인하세요</span>`)
      + (F[S.k].lim===null
          ? `<br><span style="color:#BE123C">이 급수는 <b>극한이 없습니다</b>. L 을 어디에 두든 항을 계속 쌓으면 벗어납니다.</span>`
          : hitTrue ? `<br><span style="color:#0E9384">L 이 참값 ${F[S.k].lim.toFixed(4)} 에서 ε 안에 있습니다.</span>`
                    : `<br><span style="color:#6B7280">L 을 참값(초록 점선) 쪽으로 옮겨 보세요.</span>`)
      + `<br><span style="color:#6B7280;font-size:12.5px">${F[S.k].note}</span>`;
  }
  dragOn(cv,{
    hit:p=>{
      if(Math.abs(p.y-Y(S.L+S.eps))<11 || Math.abs(p.y-Y(S.L-S.eps))<11) return 'E';
      if(Math.abs(p.y-Y(S.L))<12) return 'L';
      return null;
    },
    move:(h,p)=>{
      const v=invY(p.y);
      if(h==='L') S.L=Math.round(v*1000)/1000;
      else S.eps=Math.max(0.002, Math.round(Math.abs(v-S.L)*1000)/1000);
      draw();
    }
  });
  $('#sek').onchange=()=>{ S.k=$('#sek').value; S.N=6;
    S.L = F[S.k].lim!==null ? Math.round(F[S.k].lim*100)/100 : 2;
    S.eps=0.25; draw(); };
  $('#seAdd').onclick  =()=>{ S.N=Math.min(400,S.N+1); draw(); };
  $('#seAdd10').onclick=()=>{ S.N=Math.min(400,S.N+10); draw(); };
  $('#seBack').onclick =()=>{ S.N=Math.max(2,S.N-1); draw(); };
  $('#seRst').onclick  =()=>{ S.N=6; draw(); };
  draw();
}

/* ---------- LAB 23 테일러 근사 (미적분Ⅱ) ----------
   차수를 슬라이더로 밀면 「항이 하나 늘었다」는 사건이 흘러가 버린다.
   그래서 ① 전개 중심 a 를 축에서 끌어 옮기고 ② 항을 한 개씩 손으로 쌓거나 빼고
   ③ 검사점 x 를 끌어 그 자리의 오차를 읽는다. 아래에 오차 곡선을 따로 그려
   「a 근처에서만 잘 맞는다」와 「수렴반경 밖에서는 항을 늘릴수록 더 벌어진다」를 눈으로 본다. */
function taylorDemo(root){
  root.innerHTML=`<div class="row"><div class="col">
      <canvas id="ty1" width="400" height="250"></canvas>
      <canvas id="ty2" width="400" height="120"></canvas>
      <div class="note" style="margin-top:8px">가로축의 <b>▲ a(전개 중심)</b> 과
      <b>▼ x(검사점)</b> 를 <b>직접 끌어</b> 옮기세요.</div>
    </div>
    <div class="col">
      <label class="ctl">함수 고르기<select id="tyf" style="padding:6px;font-size:14px;width:100%">
        <option value="sin">f(x) = sin x</option>
        <option value="cos">f(x) = cos x</option>
        <option value="exp">f(x) = e^x</option>
        <option value="geo">f(x) = 1/(1 − x) &nbsp; (수렴반경 1)</option>
        <option value="log">f(x) = ln(1 + x) &nbsp; (수렴반경 1)</option></select></label>
      <div class="ctl" style="display:flex;gap:6px;flex-wrap:wrap;margin-top:10px">
        <button class="b t sm" id="tyUp">＋ 다음 항 쌓기</button>
        <button class="b g sm" id="tyDn">− 마지막 항</button>
        <button class="b g sm" id="tyRs">처음으로</button>
      </div>
      <div class="out" id="tyout"></div>
      <div class="note" style="margin-top:12px">근사는 <b>a 에서 가장 정확</b>하고 멀어질수록 벌어집니다.
      1/(1−x) 와 ln(1+x) 는 <b>|x − a| 가 수렴반경을 넘으면</b> 항을 아무리 늘려도 오히려 더 벌어집니다.</div>
    </div></div>`;
  const c1=$('#ty1'),x1=c1.getContext('2d'),W=400,H1=250;
  const c2=$('#ty2'),x2=c2.getContext('2d'),H2=120;
  const P=40;
  function fact(n){ let r=1; for(let i=2;i<=n;i++) r*=i; return r; }
  const FN={
    sin:{f:x=>Math.sin(x), d:(k,a)=>Math.sin(a+k*Math.PI/2), lo:-7,    hi:7,    R:Infinity},
    cos:{f:x=>Math.cos(x), d:(k,a)=>Math.cos(a+k*Math.PI/2), lo:-7,    hi:7,    R:Infinity},
    exp:{f:x=>Math.exp(x), d:(k,a)=>Math.exp(a),             lo:-3,    hi:3,    R:Infinity},
    geo:{f:x=>1/(1-x),     d:(k,a)=>fact(k)/Math.pow(1-a,k+1), lo:-2.4, hi:0.94, R:1},
    log:{f:x=>Math.log(1+x),
         d:(k,a)=> k===0?Math.log(1+a):Math.pow(-1,k-1)*fact(k-1)/Math.pow(1+a,k), lo:-0.9, hi:3, R:1}
  };
  const S={k:'sin', n:1, a:0, x0:2};

  function poly(x){ const D=FN[S.k]; let s=0;
    for(let k=0;k<=S.n;k++) s += D.d(k,S.a)/fact(k)*Math.pow(x-S.a,k);
    return s; }
  const sup=n=>String(n).replace(/\d/g,d=>'⁰¹²³⁴⁵⁶⁷⁸⁹'[+d]);
  const X=v=>{const D=FN[S.k]; return P+(W-P-14)*(v-D.lo)/(D.hi-D.lo);};
  const invX=px=>{const D=FN[S.k]; return D.lo+(px-P)*(D.hi-D.lo)/(W-P-14);};

  function draw(){
    const D=FN[S.k];
    let lo=Infinity, hi=-Infinity;
    for(let i=0;i<=200;i++){ const v=D.f(D.lo+(D.hi-D.lo)*i/200);
      if(isFinite(v)){ lo=Math.min(lo,v); hi=Math.max(hi,v); } }
    const pad=(hi-lo)*0.45||1; lo-=pad; hi+=pad;
    const Y=v=>H1-P-(H1-P-16)*(v-lo)/((hi-lo)||1);

    x1.clearRect(0,0,W,H1); x1.fillStyle='#fff'; x1.fillRect(0,0,W,H1);
    x1.strokeStyle='#F1F3F6'; x1.lineWidth=1;
    for(let i=0;i<=5;i++){const y=16+(H1-P-16)*i/5;x1.beginPath();x1.moveTo(P,y);x1.lineTo(W-14,y);x1.stroke();}
    if(lo<0&&hi>0){ x1.strokeStyle='#D1D5DB'; x1.beginPath(); x1.moveTo(P,Y(0)); x1.lineTo(W-14,Y(0)); x1.stroke(); }
    if(isFinite(D.R)){
      const l=Math.max(D.lo,S.a-D.R), r=Math.min(D.hi,S.a+D.R);
      x1.fillStyle='rgba(14,147,132,.08)'; x1.fillRect(X(l),16,X(r)-X(l),H1-P-16);
    }
    const plot=(fn,color,wd,clip)=>{
      x1.strokeStyle=color; x1.lineWidth=wd; x1.beginPath(); let on=false;
      for(let i=0;i<=400;i++){ const v=D.lo+(D.hi-D.lo)*i/400, y=fn(v);
        if(!isFinite(y)||(clip&&(y<lo||y>hi))){ on=false; continue; }
        const px=X(v), py=Y(Math.max(lo,Math.min(hi,y)));
        on?x1.lineTo(px,py):x1.moveTo(px,py); on=true; }
      x1.stroke(); };
    plot(D.f,'#111827',2.4,false);
    plot(poly,'#BE123C',2.2,true);
    [[S.a,'#2563EB'],[S.x0,'#B45309']].forEach(v=>{
      x1.strokeStyle=v[1]; x1.setLineDash([3,3]); x1.lineWidth=1.3;
      x1.beginPath(); x1.moveTo(X(v[0]),16); x1.lineTo(X(v[0]),H1-P); x1.stroke(); x1.setLineDash([]); });
    const fa=D.f(S.x0), pa=poly(S.x0);
    if(isFinite(fa)&&fa>=lo&&fa<=hi){ x1.fillStyle='#111827'; x1.beginPath(); x1.arc(X(S.x0),Y(fa),4.5,0,7); x1.fill(); }
    if(isFinite(pa)&&pa>=lo&&pa<=hi){ x1.fillStyle='#BE123C'; x1.beginPath(); x1.arc(X(S.x0),Y(pa),4.5,0,7); x1.fill(); }
    x1.strokeStyle='#9CA3AF'; x1.lineWidth=1.2;
    x1.beginPath(); x1.moveTo(P,H1-P); x1.lineTo(W-14,H1-P); x1.stroke();
    const tri=(px,c,up,txt)=>{ x1.fillStyle=c; x1.beginPath();
      if(up){ x1.moveTo(px,H1-P-10); x1.lineTo(px-7,H1-P+3); x1.lineTo(px+7,H1-P+3); }
      else  { x1.moveTo(px,H1-P+12); x1.lineTo(px-7,H1-P-1); x1.lineTo(px+7,H1-P-1); }
      x1.closePath(); x1.fill();
      x1.font='bold 11px sans-serif'; x1.fillText(txt, Math.min(W-70,Math.max(2,px-16)), H1-P+27); };
    tri(X(S.a),'#2563EB',true,'a = '+S.a.toFixed(2));
    tri(X(S.x0),'#B45309',false,'x = '+S.x0.toFixed(2));

    x2.clearRect(0,0,W,H2); x2.fillStyle='#fff'; x2.fillRect(0,0,W,H2);
    const errs=[]; let emax=1e-9;
    for(let i=0;i<=300;i++){ const v=D.lo+(D.hi-D.lo)*i/300;
      const e=Math.abs(D.f(v)-poly(v)); errs.push([v, isFinite(e)?Math.min(e,1e6):NaN]);
      if(isFinite(e)) emax=Math.max(emax,Math.min(e,1e6)); }
    const YE=e=>H2-22-(H2-40)*Math.min(1, Math.log10(1+e)/Math.log10(1+emax));
    x2.strokeStyle='#F1F3F6'; x2.lineWidth=1;
    for(let i=0;i<=3;i++){const y=18+(H2-40)*i/3;x2.beginPath();x2.moveTo(P,y);x2.lineTo(W-14,y);x2.stroke();}
    x2.strokeStyle='#BE123C'; x2.lineWidth=2; x2.beginPath(); let on=false;
    errs.forEach(p=>{ if(!isFinite(p[1])){on=false;return;} const px=X(p[0]),py=YE(p[1]);
      on?x2.lineTo(px,py):x2.moveTo(px,py); on=true; });
    x2.stroke();
    x2.strokeStyle='#2563EB'; x2.setLineDash([3,3]); x2.lineWidth=1.3; x2.beginPath();
    x2.moveTo(X(S.a),12); x2.lineTo(X(S.a),H2-22); x2.stroke(); x2.setLineDash([]);
    x2.strokeStyle='#9CA3AF'; x2.lineWidth=1.2;
    x2.beginPath(); x2.moveTo(P,H2-22); x2.lineTo(W-14,H2-22); x2.stroke();
    x2.fillStyle='#6B7280'; x2.font='11px sans-serif';
    x2.fillText('오차 |f − Pₙ|  (로그 눈금 · 아래일수록 정확)', P+2, 12);

    const err=Math.abs(fa-pa);
    const digits = (isFinite(err)&&err>0) ? Math.max(0, Math.floor(-Math.log10(err))) : 0;
    let out='';
    for(let k=0;k<=S.n;k++){
      const c=D.d(k,S.a)/fact(k);
      if(Math.abs(c)<1e-12) continue;
      out += (out?(c<0?' − ':' + '):(c<0?'−':'')) + Math.abs(c).toFixed(4)
           + (k===0?'':k===1?'(x−a)':'(x−a)'+sup(k));
    }
    const dist=Math.abs(S.x0-S.a);
    $('#tyout').innerHTML =
      `<b>${S.n+1}항까지 쌓음</b> &nbsp; P<sub>${S.n}</sub>(x) = ${out||'0'}<br>`
      + `x = ${S.x0.toFixed(2)} 에서 &nbsp; f = <b>${isFinite(fa)?fa.toFixed(6):'—'}</b>`
      + ` &nbsp;·&nbsp; P<sub>${S.n}</sub> = <b>${isFinite(pa)?pa.toFixed(6):'—'}</b><br>`
      + `오차 = <b style="color:${!isFinite(err)?'#BE123C':err<1e-3?'#0E9384':err<0.1?'#B45309':'#BE123C'}">`
      + `${isFinite(err)?err.toExponential(3):'발산'}</b>`
      + (isFinite(err)&&err<1 ? ` — 소수 <b>${digits}자리</b>까지 일치` : '')
      + (isFinite(D.R)
          ? `<br><span style="color:${dist<D.R?'#0E9384':'#BE123C'}">|x − a| = ${dist.toFixed(2)}`
            + ` · 수렴반경 ${D.R} — ${dist<D.R?'안쪽입니다':'<b>바깥입니다 · 항을 늘려도 벌어집니다</b>'}</span>`
          : '');
  }
  dragOn(c1,{
    hit:p=>{ if(p.y < H1-P-16) return null;
      return Math.abs(p.x-X(S.a))<=Math.abs(p.x-X(S.x0)) ? 'a' : 'x'; },
    move:(h,p)=>{ const D=FN[S.k];
      const v=Math.max(D.lo,Math.min(D.hi,invX(p.x)));
      if(h==='a') S.a=Math.round(v*100)/100; else S.x0=Math.round(v*100)/100;
      draw(); }
  });
  $('#tyf').onchange=()=>{ S.k=$('#tyf').value; const D=FN[S.k];
    S.a=0; S.x0=(S.k==='geo'?0.8:S.k==='log'?1.5:2); S.n=1; draw(); };
  $('#tyUp').onclick=()=>{ S.n=Math.min(24,S.n+1); draw(); };
  $('#tyDn').onclick=()=>{ S.n=Math.max(0,S.n-1); draw(); };
  $('#tyRs').onclick=()=>{ S.n=1; draw(); };
  draw();
}

/* ---------- LAB 24 회전체의 부피 (미적분Ⅱ) ----------
   주어진 곡선을 슬라이더로 돌려 보는 것과, 내 그릇을 내가 그려서 부피를 재는 것은 다르다.
   ① 제어점 다섯 개를 끌어 그릇의 옆면 r(y) 를 직접 만들고
   ② 원판을 한 장씩 늘려 가며 Σπr²Δy 가 참값에 붙는 과정을 본다.
   참값은 촘촘한 수치적분(2000등분)으로 따로 구해 두고 오차를 %로 보여 준다. */
function revolveDemo(root){
  root.innerHTML=`<div class="row"><div class="col">
      <canvas id="rv1" width="400" height="320"></canvas>
      <div class="note" style="margin-top:8px"><b>흰 점 다섯 개를 끌어</b> 그릇의 옆면을 만드세요.
      점을 좌우로 옮기면 그 높이에서의 <b>반지름</b>이 바뀝니다.</div>
    </div>
    <div class="col">
      <div class="ctl" style="display:flex;gap:6px;flex-wrap:wrap">
        <button class="b t sm" id="rvUp">원판 늘리기 ×2</button>
        <button class="b g sm" id="rvDn">원판 줄이기 ÷2</button>
        <button class="b g sm" id="rvFine">아주 촘촘히 (128장)</button>
      </div>
      <div class="ctl" style="display:flex;gap:6px;flex-wrap:wrap;margin-top:8px">
        <button class="b g sm" id="rvP1">원기둥</button>
        <button class="b g sm" id="rvP2">원뿔</button>
        <button class="b g sm" id="rvP3">반구</button>
        <button class="b g sm" id="rvP4">와인잔</button>
      </div>
      <div class="out" id="rvout"></div>
      <div class="note" style="margin-top:12px">원판 한 장의 부피는 무엇 무엇으로 정해질까요? 원판을 늘릴수록 계단과 곡선 사이에 무슨 일이 생기나요?</div>
    </div></div>`;
  const cv=$('#rv1'), ctx=cv.getContext('2d'), W=400, H=320;
  const AX=W/2, TOP=26, BOT=H-34, HGT=BOT-TOP;      // 회전축은 화면 한가운데 세로선
  const RMAX=150;                                    // 화면에서 반지름 최대 픽셀
  const YMAX=4;                                      // 실제 높이 4 (단위 없음)
  const S={ r:[0.6,0.9,1.1,1.0,0.7], n:8 };          // 제어점 5개의 반지름 (아래→위)
  const PRESET={
    rvP1:[1,1,1,1,1], rvP2:[1.4,1.05,0.7,0.35,0.02],
    rvP3:[1.4,1.36,1.21,0.93,0.05], rvP4:[0.35,0.2,0.5,1.0,1.25]
  };
  const yOf=i=>i*YMAX/(S.r.length-1);                 // 제어점의 실제 높이
  const py=y=>BOT-HGT*y/YMAX;                         // 실제 높이 → 화면 y
  const invy=p=>Math.max(0,Math.min(YMAX,(BOT-p)*YMAX/HGT));
  const px=r=>AX+RMAX*r/1.5;                          // 반지름 → 화면 x (오른쪽)
  const invr=p=>Math.max(0.02,Math.min(1.5,(p-AX)*1.5/RMAX));

  /* 제어점 사이를 직선으로 이어 r(y) 를 만든다 — 학생이 만든 그대로의 옆면 */
  function rAt(y){
    const m=S.r.length-1, t=Math.max(0,Math.min(m, y*m/YMAX));
    const i=Math.min(m-1,Math.floor(t)), f=t-i;
    return S.r[i]+(S.r[i+1]-S.r[i])*f;
  }
  function exact(){                                   // 참값 — 2000등분 수치적분
    const N=2000, dy=YMAX/N; let v=0;
    for(let i=0;i<N;i++){ const r=rAt((i+0.5)*dy); v+=Math.PI*r*r*dy; }
    return v;
  }
  function approx(n){                                 // 원판 n 장 (중점법 아닌 왼쪽끝 — 계단이 보이게)
    const dy=YMAX/n; let v=0, arr=[];
    for(let i=0;i<n;i++){ const y=i*dy, r=rAt(y); v+=Math.PI*r*r*dy; arr.push({y,r,dy}); }
    return {v, arr};
  }
  function draw(){
    ctx.clearRect(0,0,W,H); ctx.fillStyle='#fff'; ctx.fillRect(0,0,W,H);
    // 눈금
    ctx.strokeStyle='#F1F3F6'; ctx.lineWidth=1;
    for(let i=0;i<=4;i++){ const y=py(i); ctx.beginPath(); ctx.moveTo(20,y); ctx.lineTo(W-20,y); ctx.stroke(); }
    const A=approx(S.n), E=exact();
    // 원판 — 좌우 대칭 직사각형
    A.arr.forEach(d=>{
      const y1=py(d.y), y2=py(d.y+d.dy), w=RMAX*d.r/1.5;
      ctx.fillStyle='rgba(37,99,235,.13)';
      ctx.fillRect(AX-w, Math.min(y1,y2), 2*w, Math.abs(y1-y2));
      ctx.strokeStyle='#9CB8F0'; ctx.lineWidth=1;
      ctx.strokeRect(AX-w, Math.min(y1,y2), 2*w, Math.abs(y1-y2));
    });
    // 옆면 곡선 (양쪽)
    ctx.strokeStyle='#0E9384'; ctx.lineWidth=2.6;
    [1,-1].forEach(sgn=>{
      ctx.beginPath();
      for(let i=0;i<=120;i++){ const y=YMAX*i/120, r=rAt(y);
        const X=AX+sgn*RMAX*r/1.5, Y=py(y); i?ctx.lineTo(X,Y):ctx.moveTo(X,Y); }
      ctx.stroke();
    });
    // 회전축
    ctx.strokeStyle='#BE123C'; ctx.setLineDash([6,4]); ctx.lineWidth=1.6;
    ctx.beginPath(); ctx.moveTo(AX,TOP-6); ctx.lineTo(AX,BOT+6); ctx.stroke(); ctx.setLineDash([]);
    ctx.fillStyle='#BE123C'; ctx.font='bold 11px sans-serif'; ctx.fillText('회전축', AX+5, TOP-10);
    // 제어점 손잡이
    S.r.forEach((r,i)=> handle(ctx, px(r), py(yOf(i)), '#111827', i===S.r.length-1?'r':''));
    // 축 설명
    ctx.fillStyle='#6B7280'; ctx.font='11px sans-serif';
    ctx.fillText('높이 y', 22, BOT+20); ctx.fillText('반지름 r →', W-96, BOT+20);

    const err=Math.abs(A.v-E)/E*100;
    $('#rvout').innerHTML =
      `원판 <b>${S.n}장</b> · Δy = ${(YMAX/S.n).toFixed(3)}<br>`
      + `근사 부피 Σπr²Δy = <b>${A.v.toFixed(4)}</b><br>`
      + `정확한 부피 ∫πr²dy = <b>${E.toFixed(4)}</b><br>`
      + `오차 = <b style="color:${err<1?'#0E9384':err<5?'#B45309':'#BE123C'}">${err.toFixed(2)}%</b>`
      + `<br><span style="color:#6B7280;font-size:12.5px">원판을 2배로 늘리면 오차는 대략 절반이 됩니다 — 직접 확인해 보세요.</span>`;
  }
  dragOn(cv,{
    hit:p=>{
      let best=null, bd=18;
      S.r.forEach((r,i)=>{ const d=Math.hypot(p.x-px(r), p.y-py(yOf(i))); if(d<bd){bd=d;best=i;} });
      return best;
    },
    move:(i,p)=>{ S.r[i]=Math.round(invr(p.x)*100)/100; draw(); }
  });
  $('#rvUp').onclick  =()=>{ S.n=Math.min(256,S.n*2); draw(); };
  $('#rvDn').onclick  =()=>{ S.n=Math.max(2,Math.floor(S.n/2)); draw(); };
  $('#rvFine').onclick=()=>{ S.n=128; draw(); };
  ['rvP1','rvP2','rvP3','rvP4'].forEach(k=>{
    $('#'+k).onclick=()=>{ S.r=PRESET[k].slice(); draw(); };
  });
  draw();
}


/* ═══════════════ 중학교 1학년 3차 10종 (LAB 45~54) ═══════════════
   카탈로그 045~056 구간에서 승격. 기존 실험실과 완전히 겹치는 둘
   (수직선 덧셈뺄셈 = LAB 26 · 계급 폭 = LAB 34)은 승격하지 않고 카탈로그에서 정리했다.
   모두 직접 조작(클릭·끌기)과 탐구 보고서를 갖춘다. */

/* ═══════════════ 중학교 3학년 (LAB 45~52) ═══════════════ */
/* ---------- LAB 45 제곱근과 무리수 — √2+√3 은 √5 가 아니다 ---------- */
function sqrtAddDemo(root){
  root.innerHTML=`<div class="row"><div class="col">
      <canvas id="sa1" width="400" height="290"></canvas>
      <div class="note" style="margin-top:8px">아래 자에서 <b>√2·√3 막대를 끌어 이어붙이고</b>,
      √5 막대와 길이를 견주세요.</div>
    </div>
    <div class="col">
      <div class="ctl"><button class="b g sm" id="saSnap">√2+√3 이어붙이기</button>
        <button class="b g sm" id="saCmp">√8 vs 2√2 대결</button>
        <button class="b g sm" id="saRst">흩어놓기</button></div>
      <div class="out" id="saout"></div>
      <div class="note" style="margin-top:12px">√2 막대와 √3 막대를 이어붙이면 √5 막대와 같을까요? 자로 재고, 제곱해서도 판정해 보세요.</div>
    </div></div>`;
  const cv=$('#sa1'),ctx=cv.getContext('2d'),W=400,H=290;
  const SC=70, X0=40;                                 // 1 단위 = 70px
  const S={ b2:{x:X0, y:80}, b3:{x:X0, y:130}, snap:false, cmp:false };
  const L2=Math.SQRT2*SC, L3=Math.sqrt(3)*SC, L5=Math.sqrt(5)*SC;
  function bar(x,y,len,col,lab){
    ctx.fillStyle=col; ctx.globalAlpha=.28; ctx.fillRect(x,y-11,len,22); ctx.globalAlpha=1;
    ctx.strokeStyle=col; ctx.lineWidth=2; ctx.strokeRect(x,y-11,len,22);
    ctx.fillStyle='#111827'; ctx.font='bold 12px sans-serif'; ctx.textAlign='center';
    ctx.fillText(lab, x+len/2, y+4);
  }
  function draw(){
    ctx.clearRect(0,0,W,H); ctx.fillStyle='#fff'; ctx.fillRect(0,0,W,H);
    // 자 (0~3.5)
    const ry=230;
    ctx.strokeStyle='#9CA3AF'; ctx.lineWidth=1.6;
    ctx.beginPath(); ctx.moveTo(X0,ry); ctx.lineTo(X0+3.4*SC,ry); ctx.stroke();
    for(let v=0;v<=3.4;v+=0.5){
      const x=X0+v*SC;
      ctx.strokeStyle=v%1===0?'#374151':'#D1D5DB';
      ctx.beginPath(); ctx.moveTo(x,ry-6); ctx.lineTo(x,ry+6); ctx.stroke();
      if(v%1===0){ ctx.fillStyle='#6B7280'; ctx.font='10px sans-serif'; ctx.textAlign='center';
        ctx.fillText(v, x, ry+20); }
    }
    // √5 기준 막대(자 위 고정)
    bar(X0, 190, L5, '#0E9384', '√5 ≈ '+Math.sqrt(5).toFixed(3));
    if(S.cmp){
      const L8=Math.sqrt(8)*SC;
      bar(X0, 118, L8, '#7C3AED', '√8 ≈ '+Math.sqrt(8).toFixed(3));
      bar(X0, 152, L8, '#DB2777', '2√2 = 2×1.414…');
    }
    // 끌 수 있는 두 막대
    bar(S.b2.x, S.b2.y, L2, '#2563EB', '√2');
    bar(S.b3.x, S.b3.y, L3, '#B45309', '√3');
    // 이어붙임 판정 — b3 의 왼끝이 b2 의 오른끝에 붙고 같은 높이면
    const joined = Math.abs(S.b3.x-(S.b2.x+L2))<8 && Math.abs(S.b3.y-S.b2.y)<10;
    const total = joined ? (S.b3.x+L3-S.b2.x)/SC : null;
    if(joined){
      ctx.strokeStyle='#BE123C'; ctx.setLineDash([4,3]); ctx.lineWidth=1.4;
      ctx.beginPath(); ctx.moveTo(S.b2.x, S.b2.y-24); ctx.lineTo(S.b2.x+L2+L3, S.b2.y-24); ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle='#BE123C'; ctx.font='bold 11.5px sans-serif'; ctx.textAlign='center';
      ctx.fillText('이어붙인 길이 ≈ '+total.toFixed(3), S.b2.x+(L2+L3)/2, S.b2.y-30);
    }
    const cmpLine = S.cmp
      ? '<br><span class="mono">√8 = √(4×2) = 2√2 ≈ '+Math.sqrt(8).toFixed(3)+'</span> — <b style="color:#7C3AED">두 막대가 완전히 겹칩니다!</b> 근호는 곱셈은 통과합니다.'
      : '';
    $('#saout').innerHTML = (joined
      ? `<b>이어붙였습니다.</b> √2 + √3 ≈ <b>${(Math.SQRT2+Math.sqrt(3)).toFixed(3)}</b><br>
         √5 ≈ ${Math.sqrt(5).toFixed(3)} — <b style="color:#BE123C">한눈에 다릅니다!</b><br>
         <span class="mono">(√2+√3)² = 2 + 2√6 + 3 = 5 + 2√6 ≈ ${(5+2*Math.sqrt(6)).toFixed(3)}</span><br>
         <span style="color:#6B7280;font-size:12.5px">제곱해 보면 2√6 만큼 더 큽니다 — 근호는 덧셈을 통과하지 못합니다.</span>`
      : `√2 ≈ ${Math.SQRT2.toFixed(3)} · √3 ≈ ${Math.sqrt(3).toFixed(3)} · √5 ≈ ${Math.sqrt(5).toFixed(3)}<br>
         <span style="color:#6B7280;font-size:12.5px">√3 막대를 끌어 √2 오른쪽 끝에 붙이면 자동으로 달라붙습니다.</span>`) + cmpLine;
  }
  dragOn(cv,{
    hit:p=>{
      if(p.x>=S.b3.x-8&&p.x<=S.b3.x+L3+8&&Math.abs(p.y-S.b3.y)<16) return 'b3';
      if(p.x>=S.b2.x-8&&p.x<=S.b2.x+L2+8&&Math.abs(p.y-S.b2.y)<16) return 'b2';
      return null;
    },
    move:(h,p)=>{
      const B=S[h]; B.x=Math.max(10,Math.min(W-60,p.x-(h==='b2'?L2:L3)/2)); B.y=Math.max(30,Math.min(160,p.y));
      // 자석 — b3 이 b2 꼬리에 가까우면 딸깍
      if(h==='b3'&&Math.abs(S.b3.x-(S.b2.x+L2))<16&&Math.abs(S.b3.y-S.b2.y)<18){
        S.b3.x=S.b2.x+L2; S.b3.y=S.b2.y; }
      draw();
    }
  });
  $('#saSnap').onclick=()=>{ S.b2={x:X0,y:80}; S.b3={x:X0+L2,y:80}; draw(); };
  $('#saCmp').onclick=()=>{ S.cmp=!S.cmp; draw(); };
  $('#saRst').onclick=()=>{ S.b2={x:X0,y:80}; S.b3={x:X0,y:130}; S.cmp=false; draw(); };
  draw();
  inquiry(root,{ id:'sa', title:'제곱근과 무리수 — 근호는 덧셈을 통과하지 못한다',
    q:['√2·√3·√5 와 이어붙인 길이를 자로 읽어 기록하세요. √8 과 2√2 비교도 해 보세요(√8 = 2√2 는 참!).',
       '「(√a+√b)²」 열을 계산해 「a+b」 와 무엇이 다른지 찾으세요.',
       '√a+√b ≠ √(a+b) 인 이유를 (√a+√b)² 전개로 손으로 보이고, √a×√b = √(ab) 는 왜 참인지도 적으세요.'],
    cols:['√a','√b','이어붙인 길이','√(a+b)','같은가'],
    hint:'힌트 — 곱셈공식 (x+y)² = x²+2xy+y² 에 x=√2, y=√3 을 넣어 보세요. 2xy 가 남는 한 같을 수 없습니다.',
    read:()=>{ const j=Math.abs(S.b3.x-(S.b2.x+L2))<8&&Math.abs(S.b3.y-S.b2.y)<10;
      if(!j) return null;
      return ['√2 ≈ 1.414','√3 ≈ 1.732',(Math.SQRT2+Math.sqrt(3)).toFixed(3),
              Math.sqrt(5).toFixed(3),'다르다']; } });
}

/* ---------- LAB 46 무리수를 수직선에 — 테오도루스의 나선 ---------- */
function spiralDemo(root){
  root.innerHTML=`<div class="row"><div class="col">
      <canvas id="sr1" width="400" height="300"></canvas>
      <div class="ctl" style="display:flex;gap:6px;flex-wrap:wrap;margin-top:8px">
        <button class="b t" id="srGo">직각변 1 붙이기 — 다음 √</button>
        <button class="b t sm" id="srLay">컴퍼스로 수직선에 눕히기</button>
        <button class="b g sm" id="srRst">처음부터</button>
      </div>
    </div>
    <div class="col">
      <div class="out" id="srout"></div>
      <div class="note" style="margin-top:12px">빗변 √n 에 <b>길이 1 의 직각변</b>을 세우면
      새 빗변은 √(n+1) — 피타고라스가 한 칸씩 √를 만들어 냅니다. 컴퍼스로 눕히면
      1.41… 같은 <b>근삿값이 아니라 정확한 자리</b>에 점이 찍힙니다.</div>
    </div></div>`;
  const cv=$('#sr1'),ctx=cv.getContext('2d'),W=400,H=300;
  const C={x:150,y:150}, SC=52;
  const S={ n:1, laid:[] };                            // n: 현재 빗변² , laid: 눕힌 √들
  function tips(){
    // 나선 꼭짓점들 — 시작 (1,0), 매번 수직으로 1 회전 누적
    const pts=[{x:1,y:0}]; let ang=0;
    for(let k=1;k<S.n;k++){
      const r=Math.sqrt(k+ (0));                       // 현재 빗변 √(k)… 계산 아래에서
    }
    // 정석: v0=(1,0); v_{k+1} = v_k + (unit perpendicular of v_k)
    const v=[{x:1,y:0}];
    for(let k=1;k<S.n;k++){
      const p0=v[k-1], L=Math.hypot(p0.x,p0.y);
      v.push({x:p0.x - p0.y/L, y:p0.y + p0.x/L});
    }
    return v;
  }
  function draw(){
    ctx.clearRect(0,0,W,H); ctx.fillStyle='#fff'; ctx.fillRect(0,0,W,H);
    // 수직선 (아래)
    const ry=262;
    ctx.strokeStyle='#9CA3AF'; ctx.lineWidth=1.6;
    ctx.beginPath(); ctx.moveTo(20,ry); ctx.lineTo(W-16,ry); ctx.stroke();
    for(let t=0;t<=4;t++){ const x=40+t*SC*1.55;
      ctx.strokeStyle='#374151';
      ctx.beginPath(); ctx.moveTo(x,ry-5); ctx.lineTo(x,ry+5); ctx.stroke();
      ctx.fillStyle='#6B7280'; ctx.font='10px sans-serif'; ctx.textAlign='center';
      ctx.fillText(t, x, ry+18); }
    S.laid.forEach(n=>{
      const x=40+Math.sqrt(n)*SC*1.55;
      ctx.fillStyle='#BE123C'; ctx.beginPath(); ctx.arc(x,ry,4.4,0,7); ctx.fill();
      ctx.font='bold 10px sans-serif'; ctx.textAlign='center';
      ctx.fillText('√'+n, x, ry-10);
    });
    // 나선
    const v=tips();
    ctx.strokeStyle='#2563EB'; ctx.lineWidth=1.8;
    for(let k=0;k<v.length;k++){
      const p=v[k];
      ctx.beginPath(); ctx.moveTo(C.x,C.y);
      ctx.lineTo(C.x+p.x*SC, C.y-p.y*SC); ctx.stroke();
      if(k>0){ const q=v[k-1];
        ctx.strokeStyle='#B45309';
        ctx.beginPath(); ctx.moveTo(C.x+q.x*SC,C.y-q.y*SC);
        ctx.lineTo(C.x+p.x*SC,C.y-p.y*SC); ctx.stroke();
        ctx.strokeStyle='#2563EB'; }
    }
    const last=v[v.length-1], r=Math.hypot(last.x,last.y);
    ctx.fillStyle='#0E9384'; ctx.beginPath();
    ctx.arc(C.x+last.x*SC, C.y-last.y*SC, 5, 0, 7); ctx.fill();
    ctx.fillStyle='#111827'; ctx.font='bold 12.5px sans-serif'; ctx.textAlign='left';
    ctx.fillText('빗변 = √'+S.n+' ≈ '+r.toFixed(4), 18, 24);
    $('#srout').innerHTML =
      `지금 빗변: <b>√${S.n}</b> ≈ ${Math.sqrt(S.n).toFixed(4)}<br>`
      + `<span class="mono">√${S.n===1?1:S.n-1}² + 1² = ${S.n===1?'1+…':(S.n-1)+' + 1'} = ${S.n}</span><br>`
      + (S.laid.length? `수직선에 눕힌 것: ${S.laid.map(n=>'√'+n).join(' · ')}<br>`:'')
      + `<span style="color:#6B7280;font-size:12.5px">√2·√3·√5 를 모두 눕혀 보세요 — 1.41 반올림이 아니라 컴퍼스의 정확한 자리입니다.</span>`;
  }
  $('#srGo').onclick=()=>{ if(S.n<17){ S.n++; draw(); } };
  $('#srLay').onclick=()=>{ if(!S.laid.includes(S.n)) S.laid.push(S.n); draw(); };
  $('#srRst').onclick=()=>{ S.n=1; S.laid=[]; draw(); };
  draw();
  inquiry(root,{ id:'sr', title:'테오도루스의 나선 — √를 작도로 만든다',
    q:['한 칸씩 늘리며 √2 부터 √10 까지 기록하세요. 눕힌 것은 「눕힘」에 O.',
       '「빗변²」 열이 한 칸에 얼마씩 커지는지 찾고, √4·√9 가 자연수 자리에 정확히 앉는지 확인하세요.',
       '√(n+1) 이 만들어지는 이유를 피타고라스 정리 한 줄로 쓰고, 작도가 반올림(1.41)보다 정확한 이유를 적으세요.'],
    cols:['n','빗변 √n','근삿값','자연수인가','눕힘'],
    hint:'힌트 — 빗변² = 이전 빗변² + 1². 제곱들이 1씩 쌓이는 계단입니다.',
    read:()=>[S.n,'√'+S.n,Math.sqrt(S.n).toFixed(4),
              Number.isInteger(Math.sqrt(S.n))?'자연수':'무리수',
              S.laid.includes(S.n)?'O':'—'] });
}

/* ---------- LAB 47 인수분해로 암산 — 99×101 ---------- */
function mentalDemo(root){
  root.innerHTML=`<div class="row"><div class="col">
      <canvas id="mt1" width="400" height="260"></canvas>
      <div class="note" style="margin-top:8px"><b>b 손잡이(주황)</b>를 끌면 잘라 낸 조각이
      옮겨 붙는 과정이 보입니다.</div>
    </div>
    <div class="col">
      <div class="out" id="mtout"></div>
      <div class="ctl" style="margin-top:10px" id="mtQ"></div>
      <div class="note" style="margin-top:12px">조각이 옮겨 붙고 나면 어떤 모양이 남나요? 그 모양이 99×101 암산과 무슨 관계가 있을까요?</div>
    </div></div>`;
  const cv=$('#mt1'),ctx=cv.getContext('2d'),W=400,H=260;
  const S={ b:1, solved:0 };
  const QS=[{q:'98 × 102',a:9996},{q:'97 × 103',a:9991},{q:'95 × 105',a:9975}];
  function draw(){
    const b=S.b, SCL=1.6;
    ctx.clearRect(0,0,W,H); ctx.fillStyle='#fff'; ctx.fillRect(0,0,W,H);
    const a=100, px=46, py=40, w=(a+b)*SCL*0.62, h=(a-b)*SCL*0.62;
    // (a−b)×(a+b) 직사각형
    ctx.fillStyle='rgba(37,99,235,.14)'; ctx.fillRect(px,py,w,h);
    ctx.strokeStyle='#2563EB'; ctx.lineWidth=1.8; ctx.strokeRect(px,py,w,h);
    // 잘라 옮기는 조각: 오른쪽 b 폭 기둥 → 아래로
    const cw=b*SCL*0.62;
    ctx.fillStyle='rgba(180,83,9,.3)';
    ctx.fillRect(px+w-cw,py,cw,h);
    ctx.strokeStyle='#B45309'; ctx.strokeRect(px+w-cw,py,cw,h);
    // 화살표와 옮겨 붙은 자리 (아래 가로로)
    ctx.strokeStyle='#B45309'; ctx.lineWidth=1.6;
    ctx.beginPath(); ctx.moveTo(px+w+8,py+h/2); ctx.lineTo(px+w+26,py+h/2);
    ctx.lineTo(px+w+26,py+h+14); ctx.lineTo(px+h*0+px?0:0,0); ctx.stroke();
    ctx.fillStyle='rgba(180,83,9,.3)';
    ctx.fillRect(px,py+h+8,h*1+cw*0? h:h,0);
    // 정사각형 결과 그림 (오른쪽)
    const qx=262, qy=40, qa=100*SCL*0.62;
    ctx.fillStyle='rgba(14,147,132,.13)'; ctx.fillRect(qx,qy,qa,qa);
    ctx.strokeStyle='#0E9384'; ctx.lineWidth=1.8; ctx.strokeRect(qx,qy,qa,qa);
    const qb=b*SCL*0.62*10;
    ctx.fillStyle='#fff';
    ctx.fillRect(qx+qa-Math.min(qb,qa*0.4), qy+qa-Math.min(qb,qa*0.4), Math.min(qb,qa*0.4), Math.min(qb,qa*0.4));
    ctx.strokeStyle='#BE123C'; ctx.setLineDash([3,3]);
    ctx.strokeRect(qx+qa-Math.min(qb,qa*0.4), qy+qa-Math.min(qb,qa*0.4), Math.min(qb,qa*0.4), Math.min(qb,qa*0.4));
    ctx.setLineDash([]);
    ctx.fillStyle='#374151'; ctx.font='bold 11.5px sans-serif'; ctx.textAlign='center';
    ctx.fillText('(100−b)(100+b)', px+w/2, py-10);
    ctx.fillText('= 100² − b²', qx+qa/2, qy-10);
    handle(ctx, px+w, py+h, '#B45309', 'b = '+b);
    $('#mtout').innerHTML =
      `<span class="mono" style="font-size:17px">(100−${S.b})(100+${S.b}) = 10000 − ${S.b*S.b} = <b>${10000-S.b*S.b}</b></span><br>`
      + `<span style="color:#6B7280;font-size:12.5px">곱셈 두 자리 × 세 자리가 뺄셈 한 번이 됐습니다.</span>`;
    quiz();
  }
  function quiz(){
    const Q=QS[S.solved];
    $('#mtQ').innerHTML = S.solved>=QS.length
      ? `<b style="color:#0E9384">암산 3연승! 이제 이 기술은 당신 것입니다.</b>`
      : `<b>암산 도전 ${S.solved+1}/3</b> — <span class="mono">${Q.q}</span> =
         <input type="number" id="mtA" style="width:90px;padding:5px;border:1px solid #E5E7EB;border-radius:7px">
         <button class="b t sm" id="mtC">확인</button> <span id="mtR" style="font-weight:800"></span>`;
    const c=$('#mtC'); if(c) c.onclick=()=>{
      if(+$('#mtA').value===Q.a){ S.solved++; quiz(); }
      else $('#mtR').innerHTML='<span style="color:#BE123C">다시 — (100−b)(100+b) 꼴로 바꿔 보세요</span>';
    };
  }
  dragOn(cv,{
    hit:p=>{ const b=S.b, w=(100+b)*1.6*0.62, h=(100-b)*1.6*0.62;
      return Math.hypot(p.x-(46+w),p.y-(40+h))<20?'b':null; },
    move:(h,p)=>{ S.b=Math.max(1,Math.min(9,Math.round((p.x-46-96)/2))); draw(); }
  });
  draw();
  inquiry(root,{ id:'mt', title:'인수분해로 암산하기 — 합차 공식',
    q:['b 를 1~9 로 바꾸며 (100−b)(100+b) 를 기록하세요.',
       '「10000 − 결과」 열이 무엇의 제곱인지 찾으세요.',
       '25 × 35 를 (30−5)(30+5) 로 암산하는 과정을 손으로 쓰고, 곱셈공식이 왜 “계산을 줄이는 기술”인지 정리하세요.'],
    cols:['b','100−b','100+b','곱','10000 − 곱'],
    hint:'힌트 — 큰 정사각형(100²)에서 모서리 작은 정사각형(b²)만 사라졌습니다.',
    read:()=>[S.b,100-S.b,100+S.b,10000-S.b*S.b,S.b*S.b] });
}

/* ---------- LAB 48 근의 공식 — 근을 손으로 찍고 공식으로 검산 ---------- */
function quadRootDemo(root){
  root.innerHTML=`<div class="row"><div class="col">
      <canvas id="qr1" width="400" height="300"></canvas>
      <div class="note" style="margin-top:8px"><b>두 마커(주황)</b>를 끌어 포물선이 x축과
      만나는 자리에 놓으세요 — 맞으면 초록으로 켜집니다.</div>
    </div>
    <div class="col">
      <div class="ctl"><button class="b t sm" id="qrNew">새 포물선</button>
        <button class="b g sm" id="qrShow">공식으로 검산</button></div>
      <div class="out" id="qrout"></div>
      <div class="note" style="margin-top:12px">눈으로 찍은 근과 공식이 계산한 근 — 얼마나 가까울까요? 공식의 역할이 무엇인지 겪어 보세요.</div>
    </div></div>`;
  const cv=$('#qr1'),ctx=cv.getContext('2d'),W=400,H=300;
  const S={ a:1,b:-2,c:-3, g1:-3,g2:4, show:false };
  const X=v=>W/2+v*30, Y=v=>170-v*14;
  const invX=px=>(px-W/2)/30;
  function roots(){ const D=S.b*S.b-4*S.a*S.c;
    if(D<0) return null;
    return [(-S.b-Math.sqrt(D))/(2*S.a), (-S.b+Math.sqrt(D))/(2*S.a)].sort((x,y)=>x-y); }
  function newQ(){
    const rs=[[-3,1],[-1,3],[-2,2],[1,4],[-4,-1],[2,5]][Math.floor(Math.random()*6)];
    S.a=1; S.b=-(rs[0]+rs[1]); S.c=rs[0]*rs[1];
    S.g1=-4.5; S.g2=4.5; S.show=false; draw();
  }
  function draw(){
    ctx.clearRect(0,0,W,H); ctx.fillStyle='#fff'; ctx.fillRect(0,0,W,H);
    ctx.strokeStyle='#F1F3F6';
    for(let v=-6;v<=6;v++){ ctx.beginPath(); ctx.moveTo(X(v),16); ctx.lineTo(X(v),H-40); ctx.stroke(); }
    ctx.strokeStyle='#9CA3AF'; ctx.lineWidth=1.4;
    ctx.beginPath(); ctx.moveTo(X(-6.4),Y(0)); ctx.lineTo(X(6.4),Y(0)); ctx.stroke();
    // 포물선
    ctx.strokeStyle='#2563EB'; ctx.lineWidth=2.4; ctx.beginPath();
    for(let i=0;i<=160;i++){ const x=-6.4+12.8*i/160, y=S.a*x*x+S.b*x+S.c;
      const px=X(x), py=Y(Math.max(-10,Math.min(10,y)));
      i?ctx.lineTo(px,py):ctx.moveTo(px,py); }
    ctx.stroke();
    const rs=roots();
    const ok1=rs&&Math.abs(S.g1-rs[0])<0.15, ok2=rs&&Math.abs(S.g2-rs[1])<0.15;
    // 진짜 근 (검산 켰을 때)
    if(S.show&&rs) rs.forEach(r=>{ ctx.fillStyle='#0E9384';
      ctx.beginPath(); ctx.arc(X(r),Y(0),5,0,7); ctx.fill(); });
    // 추측 마커
    [[S.g1,ok1],[S.g2,ok2]].forEach(q=>{
      handle(ctx, X(q[0]), Y(0), q[1]?'#0E9384':'#B45309','');
    });
    const f=`y = x² ${S.b>=0?'+ '+S.b:'− '+(-S.b)}x ${S.c>=0?'+ '+S.c:'− '+(-S.c)}`;
    $('#qrout').innerHTML =
      `<span class="mono" style="font-size:16px">${f}</span><br>`
      + `내 추측: x ≈ <b>${S.g1.toFixed(2)}</b>, <b>${S.g2.toFixed(2)}</b> ${ok1&&ok2?'<b style="color:#0E9384">— 둘 다 명중!</b>':''}<br>`
      + (S.show&&rs
        ? `<span class="mono">x = (${-S.b} ± √(${S.b*S.b}−${4*S.a*S.c>=0?4*S.a*S.c:'('+4*S.a*S.c+')'})) / 2 = <b>${rs[0]}</b>, <b>${rs[1]}</b></span>`
        : `<span style="color:#6B7280;font-size:12.5px">먼저 눈으로 찍고 「공식으로 검산」을 누르세요.</span>`);
  }
  dragOn(cv,{
    hit:p=>{ if(Math.abs(p.y-Y(0))>20) return null;
      return Math.abs(p.x-X(S.g1))<=Math.abs(p.x-X(S.g2))?'g1':'g2'; },
    move:(h,p)=>{ S[h]=Math.round(invX(p.x)*20)/20; draw(); }
  });
  $('#qrNew').onclick=newQ;
  $('#qrShow').onclick=()=>{ S.show=true; draw(); };
  draw();
  inquiry(root,{ id:'qr', title:'근의 공식 — 찍기를 정확히로',
    q:['「새 포물선」으로 네 번 이상, 추측 → 검산을 반복해 기록하세요.',
       '두 근의 「합」과 「곱」 열을 식의 계수 b, c 와 견주어 규칙을 찾으세요 (근과 계수의 관계).',
       '근의 공식의 분모가 왜 2a 인지, 완전제곱식 유도(LAB 50)와 이어서 손으로 쓰세요.'],
    cols:['식','근 1','근 2','합','곱'],
    hint:'힌트 — (x−p)(x−q) = x² −(p+q)x + pq 를 펼쳐 보세요.',
    read:()=>{ const rs=roots(); if(!rs||!S.show) return null;
      return ['x²'+(S.b>=0?'+':'')+S.b+'x'+(S.c>=0?'+':'')+S.c, rs[0], rs[1],
              rs[0]+rs[1], rs[0]*rs[1]]; } });
}

/* ---------- LAB 49 판별식 — 만나거나 스치거나 비켜가거나 ---------- */
function discrimDemo(root){
  root.innerHTML=`<div class="row"><div class="col">
      <canvas id="dc1" width="400" height="300"></canvas>
      <div class="note" style="margin-top:8px"><b>수평선(주황 손잡이)</b>을 위아래로 끌어
      포물선과의 교점 개수를 바꿔 보세요 — 스치는 순간 딸깍 붙습니다.</div>
    </div>
    <div class="col">
      <div class="out" id="dcout"></div>
      <div class="note" style="margin-top:12px">수평선을 옮기면 교점의 개수가 변합니다 — 풀지 않고도 개수를 미리 아는 방법이 있을까요? D 값을 추적해 보세요.</div>
    </div></div>`;
  const cv=$('#dc1'),ctx=cv.getContext('2d'),W=400,H=300;
  const S={ k:2 };                                    // y = k 수평선, 포물선 y=x²−2x
  const X=v=>W/2+v*34, Y=v=>210-v*26;
  const invY=py=>(210-py)/26;
  function draw(){
    ctx.clearRect(0,0,W,H); ctx.fillStyle='#fff'; ctx.fillRect(0,0,W,H);
    ctx.strokeStyle='#F1F3F6';
    for(let v=-4;v<=5;v++){ ctx.beginPath(); ctx.moveTo(24,Y(v)); ctx.lineTo(W-14,Y(v)); ctx.stroke(); }
    ctx.strokeStyle='#9CA3AF'; ctx.lineWidth=1.3;
    ctx.beginPath(); ctx.moveTo(24,Y(0)); ctx.lineTo(W-14,Y(0)); ctx.stroke();
    // 포물선 y = x²−2x (꼭짓점 (1,−1))
    ctx.strokeStyle='#2563EB'; ctx.lineWidth=2.4; ctx.beginPath();
    for(let i=0;i<=140;i++){ const x=-2.4+7*i/140? -2.4+ (4.8)*i/140*1.4 : 0; }
    ctx.beginPath();
    for(let i=0;i<=140;i++){ const x=-1.6+4.4*i/140, y=x*x-2*x;
      const px=X(x), py=Y(y); i?ctx.lineTo(px,py):ctx.moveTo(px,py); }
    ctx.stroke();
    // 수평선 y=k
    ctx.strokeStyle='#B45309'; ctx.lineWidth=2;
    ctx.beginPath(); ctx.moveTo(24,Y(S.k)); ctx.lineTo(W-14,Y(S.k)); ctx.stroke();
    handle(ctx, W-40, Y(S.k), '#B45309', 'y = '+S.k.toFixed(2));
    // 교점: x²−2x−k=0, D=4+4k
    const D=4+4*S.k;
    if(D>=0){
      const r1=1-Math.sqrt(1+S.k), r2=1+Math.sqrt(1+S.k);
      [r1,r2].forEach(r=>{ ctx.fillStyle='#BE123C';
        ctx.beginPath(); ctx.arc(X(r),Y(S.k),D<0.001?6:5,0,7); ctx.fill(); });
    }
    const kind=D>0.02?'2개':D>-0.02?'1개 (접함!)':'0개';
    $('#dcout').innerHTML =
      `<span class="mono">x² − 2x = k → x² − 2x − k = 0</span><br>`
      + `D = b² − 4ac = 4 + 4k = <b style="color:${D>0.02?'#2563EB':D>-0.02?'#0E9384':'#BE123C'}">${D.toFixed(2)}</b><br>`
      + `교점: <b>${kind}</b> — ${D>0.02?'D > 0, 실근 둘':D>-0.02?'D = 0, 중근(스치는 순간)':'D < 0, 실근 없음'}<br>`
      + `<span style="color:#6B7280;font-size:12.5px">접하는 자리(k = −1)에 가까이 가면 자석처럼 붙습니다.</span>`;
  }
  dragOn(cv,{
    hit:p=>Math.abs(p.y-Y(S.k))<16?'k':null,
    move:(h,p)=>{ let k=Math.round(invY(p.y)*50)/50;
      if(Math.abs(k+1)<0.18) k=-1;                    // 접점 자석
      S.k=Math.max(-3.4,Math.min(4.6,k)); draw(); }
  });
  draw();
  inquiry(root,{ id:'dc', title:'판별식 — 풀기 전에 개수를 안다',
    q:['k 를 위에서 아래로 끌며 여러 값에서 기록하세요. 접하는 순간(k = −1)을 꼭 포함하세요.',
       '「D 의 부호」 열과 「교점 수」 열의 짝을 정리하세요.',
       'D = 0 이 “스치는 순간”인 이유를 근의 공식의 ±√D 로 손으로 설명하세요 — √0 이면 두 근이 어떻게 되나요?'],
    cols:['k','D = 4+4k','부호','교점 수'],
    hint:'힌트 — ±√D 가 두 근의 “벌어짐”입니다. D 가 0 으로 갈수록 두 점이 다가와 하나로 겹칩니다.',
    read:()=>{ const D=4+4*S.k;
      return [S.k.toFixed(2), D.toFixed(2), D>0.02?'+':D>-0.02?'0':'−',
              D>0.02?'2개':D>-0.02?'1개':'0개']; } });
}

/* ---------- LAB 50 완전제곱식 — 타일로 정사각형 만들기 ---------- */
function complSqDemo(root){
  root.innerHTML=`<div class="row"><div class="col">
      <canvas id="cq1" width="400" height="300"></canvas>
      <div class="ctl" style="display:flex;gap:6px;flex-wrap:wrap;margin-top:8px">
        <button class="b t" id="cqFold">x 막대를 반씩 접어 배치</button>
        <button class="b t sm" id="cqFill">모서리 구멍 채우기</button>
        <button class="b g sm" id="cqB">b 바꾸기 (지금 <span id="cqBv">6</span>)</button>
      </div>
    </div>
    <div class="col">
      <div class="out" id="cqout"></div>
      <div class="note" style="margin-top:12px">기역자 모양을 정사각형으로 바꾸려면 무엇이 더 필요할까요? 그 크기는 b 와 어떤 관계일까요?</div>
    </div></div>`;
  const cv=$('#cq1'),ctx=cv.getContext('2d'),W=400,H=300;
  const S={ b:6, stage:0 };                            // 0 나열 → 1 접어 배치 → 2 채움
  const XS=90;                                         // x 타일 픽셀
  function draw(){
    const b=S.b, half=b/2, u=XS/6;                     // 막대 폭 = x/6 스케일 감각용
    ctx.clearRect(0,0,W,H); ctx.fillStyle='#fff'; ctx.fillRect(0,0,W,H);
    const px=60, py=70;
    // x² 타일
    ctx.fillStyle='rgba(37,99,235,.2)'; ctx.fillRect(px,py,XS,XS);
    ctx.strokeStyle='#2563EB'; ctx.lineWidth=1.8; ctx.strokeRect(px,py,XS,XS);
    ctx.fillStyle='#111827'; ctx.font='bold 13px sans-serif'; ctx.textAlign='center';
    ctx.fillText('x²', px+XS/2, py+XS/2+4);
    const bw=14;
    if(S.stage===0){
      // 오른쪽에 x 막대 b개 나열
      for(let i=0;i<b;i++){
        const x=px+XS+18+i*(bw+4);
        ctx.fillStyle='rgba(180,83,9,.3)'; ctx.fillRect(x,py,bw,XS);
        ctx.strokeStyle='#B45309'; ctx.strokeRect(x,py,bw,XS);
      }
      ctx.fillStyle='#374151'; ctx.font='11.5px sans-serif';
      ctx.fillText('x 막대 '+b+'개 — 이대로는 정사각형이 안 됩니다', 210, py+XS+28);
    } else {
      // 반은 오른쪽, 반은 아래
      for(let i=0;i<half;i++){
        const x=px+XS+i*bw;
        ctx.fillStyle='rgba(180,83,9,.3)'; ctx.fillRect(x,py,bw,XS);
        ctx.strokeStyle='#B45309'; ctx.strokeRect(x,py,bw,XS);
        const y=py+XS+i*bw;
        ctx.fillStyle='rgba(180,83,9,.3)'; ctx.fillRect(px,y,XS,bw);
        ctx.strokeStyle='#B45309'; ctx.strokeRect(px,y,XS,bw);
      }
      // 모서리
      const hw=half*bw;
      if(S.stage===2){
        ctx.fillStyle='rgba(14,147,132,.35)';
        ctx.fillRect(px+XS,py+XS,hw,hw);
        ctx.strokeStyle='#0E9384'; ctx.strokeRect(px+XS,py+XS,hw,hw);
        ctx.fillStyle='#0E9384'; ctx.font='bold 11px sans-serif';
        ctx.fillText('(b/2)²', px+XS+hw/2, py+XS+hw/2+4);
        ctx.strokeStyle='#0E9384'; ctx.lineWidth=2.4;
        ctx.strokeRect(px,py,XS+hw,XS+hw);
      } else {
        ctx.strokeStyle='#BE123C'; ctx.setLineDash([4,3]);
        ctx.strokeRect(px+XS,py+XS,hw,hw); ctx.setLineDash([]);
        ctx.fillStyle='#BE123C'; ctx.font='bold 11px sans-serif';
        ctx.fillText('구멍!', px+XS+hw/2, py+XS+hw/2+4);
      }
    }
    const rhs=S.stage===2?`(x + ${half})² = ${half*half} + …`:`x² + ${b}x`;
    $('#cqout').innerHTML =
      `<span class="mono" style="font-size:16px">x² + ${b}x ${S.stage===2?`+ <b style="color:#0E9384">${half*half}</b> = (x + ${half})²`:''}</span><br>`
      + (S.stage===0?`막대 ${b}개를 <b>반씩 접어</b> 배치해 보세요.`
        :S.stage===1?`기역자 완성 — 모서리에 <b style="color:#BE123C">${half}×${half} = ${half*half} 구멍</b>이 남았습니다.`
        :`<b style="color:#0E9384">정사각형 완성.</b> 방정식이라면 우변에도 ${half*half} 을 더해야 균형이 맞습니다.<br>
          <span class="mono">x²+${b}x=7 → (x+${half})² = ${7+half*half} → x = −${half} ± √${7+half*half}</span>`);
  }
  $('#cqFold').onclick=()=>{ if(S.stage===0) S.stage=1; draw(); };
  $('#cqFill').onclick=()=>{ if(S.stage===1) S.stage=2; draw(); };
  $('#cqB').onclick=()=>{ S.b=S.b===6?4:S.b===4?8:6; S.stage=0;
    $('#cqBv').textContent=S.b; draw(); };
  draw();
  inquiry(root,{ id:'cq', title:'완전제곱식 — 구멍을 채우는 풀이',
    q:['b = 4, 6, 8 각각에서 접기 → 채우기를 완주하며 기록하세요.',
       '「구멍의 크기」 열이 b 와 어떤 관계인지 찾으세요.',
       'x² + bx + c = 0 을 문자 그대로 완전제곱식으로 풀어 근의 공식을 유도해 손으로 쓰세요 — 분모의 2a(여기선 2)가 어디서 나오는지 짚으세요.'],
    cols:['b','b/2','구멍 (b/2)²','완성식'],
    hint:'힌트 — 반씩 접는 이유: 정사각형의 두 변에 똑같이 나눠 붙여야 하기 때문입니다. 그 “반”이 공식의 b/2a 입니다.',
    read:()=>[S.b,S.b/2,(S.b/2)*(S.b/2),
              S.stage===2?`(x+${S.b/2})²`:'미완'] });
}

/* ---------- LAB 51 이차함수의 평행이동 — 꼭짓점 택배 ---------- */
function parabShiftDemo(root){
  root.innerHTML=`<div class="row"><div class="col">
      <canvas id="ps1" width="400" height="300"></canvas>
      <div class="note" style="margin-top:8px"><b>꼭짓점(주황)</b>을 끌어 목표 식의 자리로
      포물선을 배달하세요.</div>
    </div>
    <div class="col">
      <div class="ctl"><button class="b t sm" id="psNew">새 목표</button>
        <span class="mono" id="psQ" style="font-size:16px;margin-left:8px"></span></div>
      <div class="out" id="psout"></div>
      <div class="note" style="margin-top:12px">괄호 안의 부호와 실제 이동 방향 — 예상과 같나요? 함정이 어디 숨어 있는지 배달로 찾아내세요.</div>
    </div></div>`;
  const cv=$('#ps1'),ctx=cv.getContext('2d'),W=400,H=300;
  const S={ p:0,q:0, tp:2,tq:-3 };
  const X=v=>W/2+v*26, Y=v=>150-v*26;
  const inv=pt=>({x:Math.round((pt.x-W/2)/26*2)/2, y:Math.round((150-pt.y)/26*2)/2});
  function newQ(){
    S.tp=[-3,-2,-1,1,2,3][Math.floor(Math.random()*6)];
    S.tq=[-3,-2,-1,1,2][Math.floor(Math.random()*5)];
    S.p=0; S.q=0;
    $('#psQ').textContent=`y = (x ${S.tp>=0?'− '+S.tp:'+ '+(-S.tp)})² ${S.tq>=0?'+ '+S.tq:'− '+(-S.tq)}`;
    draw();
  }
  function draw(){
    ctx.clearRect(0,0,W,H); ctx.fillStyle='#fff'; ctx.fillRect(0,0,W,H);
    ctx.strokeStyle='#F1F3F6';
    for(let v=-7;v<=7;v++){ ctx.beginPath(); ctx.moveTo(X(v),12); ctx.lineTo(X(v),H-12); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(20,Y(v-2)); ctx.lineTo(W-12,Y(v-2)); ctx.stroke(); }
    ctx.strokeStyle='#9CA3AF'; ctx.lineWidth=1.4;
    ctx.beginPath(); ctx.moveTo(X(-7.4),Y(0)); ctx.lineTo(X(7.4),Y(0)); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(X(0),Y(5.4)); ctx.lineTo(X(0),Y(-5.4)); ctx.stroke();
    // 원본 y=x² (옅게)
    ctx.strokeStyle='#D1D5DB'; ctx.lineWidth=1.4; ctx.beginPath();
    for(let i=0;i<=100;i++){ const x=-2.6+5.2*i/100;
      const px=X(x), py=Y(x*x); i?ctx.lineTo(px,py):ctx.moveTo(px,py); }
    ctx.stroke();
    // 목표 위치 (유령)
    ctx.strokeStyle='#0E9384'; ctx.setLineDash([4,3]); ctx.lineWidth=1.6; ctx.beginPath();
    for(let i=0;i<=100;i++){ const x=S.tp-2.4+4.8*i/100, y=(x-S.tp)*(x-S.tp)+S.tq;
      const px=X(x), py=Y(Math.min(6,y)); i?ctx.lineTo(px,py):ctx.moveTo(px,py); }
    ctx.stroke(); ctx.setLineDash([]);
    // 내 포물선
    const hit=S.p===S.tp&&S.q===S.tq;
    ctx.strokeStyle=hit?'#0E9384':'#B45309'; ctx.lineWidth=2.4; ctx.beginPath();
    for(let i=0;i<=100;i++){ const x=S.p-2.4+4.8*i/100, y=(x-S.p)*(x-S.p)+S.q;
      const px=X(x), py=Y(Math.min(6,y)); i?ctx.lineTo(px,py):ctx.moveTo(px,py); }
    ctx.stroke();
    handle(ctx, X(S.p), Y(S.q), hit?'#0E9384':'#B45309', '('+S.p+', '+S.q+')');
    $('#psout').innerHTML =
      `내 식: <span class="mono">y = (x ${S.p>=0?'− '+S.p:'+ '+(-S.p)})² ${S.q>=0?'+ '+S.q:'− '+(-S.q)}</span><br>`
      + (hit?`<b style="color:#0E9384">배달 완료! 꼭짓점 (${S.p}, ${S.q}) 명중.</b>`
        :`<span style="color:#6B7280;font-size:12.5px">초록 점선 자리(목표)로 꼭짓점을 끌어 옮기세요.</span>`);
  }
  dragOn(cv,{
    hit:p=>Math.hypot(p.x-X(S.p),p.y-Y(S.q))<20?'v':null,
    move:(h,p)=>{ const v=inv(p);
      S.p=Math.max(-5,Math.min(5,v.x)); S.q=Math.max(-4,Math.min(4,v.y)); draw(); }
  });
  $('#psNew').onclick=newQ;
  newQ();
  inquiry(root,{ id:'ps', title:'이차함수의 평행이동 — 부호의 함정',
    q:['목표 배달을 다섯 번 이상 성공하며 기록하세요.',
       '「괄호 안의 부호」와 「이동 방향」 열을 견주어 함정의 정체를 정리하세요.',
       'x−3 이 오른쪽 이동인 이유를 “y 값이 3 늦게 따라온다”로 손으로 설명하고, y=x²−6x+11 을 완전제곱식으로 고쳐 꼭짓점을 구하세요.'],
    cols:['목표식','p','q','괄호 안','이동 방향'],
    hint:'힌트 — (x−3)² 은 x=3 일 때에야 0 — y=x² 이 x=0 에서 하던 일을 3 에서 합니다.',
    read:()=>[$('#psQ').textContent, S.p, S.q,
              S.p>=0?'x − '+S.p:'x + '+(-S.p),
              (S.p>0?'오른쪽 ':S.p<0?'왼쪽 ':'')+(S.q>0?'· 위':S.q<0?'· 아래':'')] });
}

/* ---------- LAB 52 이차함수 최대·최소 — 울타리 20m ---------- */
function fenceDemo(root){
  root.innerHTML=`<div class="row"><div class="col">
      <canvas id="fn1" width="400" height="300"></canvas>
      <div class="note" style="margin-top:8px"><b>울타리 모서리(주황)</b>를 끌어 폭을 바꾸세요.
      넓이 그래프에 지금 위치가 찍힙니다.</div>
    </div>
    <div class="col">
      <div class="out" id="fnout"></div>
      <div class="note" style="margin-top:12px">둘레가 정해져 있을 때 가장 넓은 울타리는 어떤 모양일까요? 그래프의 봉우리가 답을 알고 있을까요?</div>
    </div></div>`;
  const cv=$('#fn1'),ctx=cv.getContext('2d'),W=400,H=300;
  const S={ w:3 };
  function draw(){
    const w=S.w, h=10-w, A=w*h;
    ctx.clearRect(0,0,W,H); ctx.fillStyle='#fff'; ctx.fillRect(0,0,W,H);
    // 왼쪽: 울타리 직사각형
    const px=30, py=40, SC=9;
    ctx.fillStyle='rgba(14,147,132,.15)';
    ctx.fillRect(px,py+ (10-h)*SC, w*SC*1.4, h*SC);
    ctx.strokeStyle='#0E9384'; ctx.lineWidth=2.2;
    ctx.strokeRect(px,py+(10-h)*SC, w*SC*1.4, h*SC);
    ctx.fillStyle='#374151'; ctx.font='bold 11px sans-serif'; ctx.textAlign='center';
    ctx.fillText('가로 '+w.toFixed(1), px+w*SC*0.7, py+(10-h)*SC-7);
    ctx.save(); ctx.translate(px-9, py+(10-h)*SC+h*SC/2); ctx.rotate(-Math.PI/2);
    ctx.fillText('세로 '+h.toFixed(1), 0, 0); ctx.restore();
    ctx.fillText('넓이 '+A.toFixed(1)+' m²', px+w*SC*0.7, py+(10-h)*SC+h*SC/2+4);
    handle(ctx, px+w*SC*1.4, py+(10-h)*SC, '#B45309','');
    // 오른쪽: S = w(10−w) 그래프
    const gx=210, gy=250, gw=170, gh=190;
    const GX=v=>gx+gw*v/10, GY=v=>gy-gh*v/27;
    ctx.strokeStyle='#9CA3AF'; ctx.lineWidth=1.3;
    ctx.beginPath(); ctx.moveTo(gx,gy); ctx.lineTo(gx+gw,gy); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(gx,gy); ctx.lineTo(gx,gy-gh); ctx.stroke();
    ctx.strokeStyle='#2563EB'; ctx.lineWidth=2.2; ctx.beginPath();
    for(let i=0;i<=80;i++){ const x=10*i/80, y=x*(10-x);
      const pxx=GX(x), pyy=GY(y); i?ctx.lineTo(pxx,pyy):ctx.moveTo(pxx,pyy); }
    ctx.stroke();
    // 최대점 표시선
    ctx.strokeStyle='#D1D5DB'; ctx.setLineDash([3,3]);
    ctx.beginPath(); ctx.moveTo(GX(5),gy); ctx.lineTo(GX(5),GY(25)); ctx.stroke(); ctx.setLineDash([]);
    ctx.fillStyle='#BE123C'; ctx.beginPath(); ctx.arc(GX(w),GY(A),5.5,0,7); ctx.fill();
    ctx.fillStyle='#6B7280'; ctx.font='10px sans-serif';
    ctx.fillText('0', gx, gy+14); ctx.fillText('5', GX(5), gy+14); ctx.fillText('10', GX(10), gy+14);
    ctx.fillText('w', gx+gw+8, gy+4);
    const isMax=Math.abs(w-5)<0.05;
    $('#fnout').innerHTML =
      `<span class="mono">S = w(10 − w) = ${w.toFixed(1)} × ${h.toFixed(1)} = <b>${A.toFixed(2)}</b> m²</span><br>`
      + (isMax?`<b style="color:#0E9384">최대 발견! w = 5 (정사각형) 에서 25 m².</b>`
        :`<span style="color:#6B7280;font-size:12.5px">더 넓게 만들 수 있을까요? 그래프의 봉우리를 찾으세요.</span>`)
      + `<br><span class="mono">S = −(w−5)² + 25</span>
         <span style="color:#6B7280;font-size:12.5px">— 완전제곱식이 봉우리의 좌표를 알려 줍니다. 0 < w < 10 밖은 울타리가 아닙니다.</span>`;
  }
  dragOn(cv,{
    hit:p=>{ const px2=30+S.w*9*1.4, py2=40+(10-(10-S.w))*9;
      return Math.hypot(p.x-px2,p.y-py2)<26?'w':null; },
    move:(h,p)=>{ S.w=Math.max(0.5,Math.min(9.5,Math.round((p.x-30)/12.6*10)/10)); draw(); }
  });
  draw();
  inquiry(root,{ id:'fn', title:'울타리 최적화 — 꼭짓점이 답이다',
    q:['w 를 바꿔 가며 8줄 이상 기록하고, 최대 넓이를 찾으세요.',
       'w 와 10−w 가 「같아지는 순간」과 최대의 관계를 찾으세요.',
       'S = −(w−5)² + 25 로 고치는 과정을 손으로 쓰고, w = 12 같은 값이 왜 답이 될 수 없는지 정의역으로 설명하세요.'],
    cols:['w','10−w','넓이 S','최대와의 차'],
    hint:'힌트 — 합이 일정한 두 수의 곱은 두 수가 같을 때 최대입니다. 완전제곱식이 그 이유를 증명합니다.',
    read:()=>[S.w.toFixed(1),(10-S.w).toFixed(1),(S.w*(10-S.w)).toFixed(2),
              (25-S.w*(10-S.w)).toFixed(2)] });
}

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
      <div class="note" style="margin-top:12px">주황 손잡이로 a·b 의 경계를 끄세요. 전개식의 각 항은 그림의 어느 조각일까요? (a−b)² 모드의 겹침 사건도 조사해 보세요.</div>
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
      <div class="note" style="margin-top:12px">P 를 옮기면 각은 변할까요? 중심각과는 어떤 비율일까요? 직접 재 보고 판정하세요.</div>
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
      <div class="note" style="margin-top:12px">위성 P(주황)를 끌어 보세요. 두 접선의 길이는 서로 어떤 관계인가요? 위성이 높아지면 가시 범위는 어디까지 넓어질 수 있을까요?</div>
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
      <div class="note" style="margin-top:12px">모양을 아무리 바꿔도 변하지 않는 값이 있을까요? 두 대각합을 추적하고, D 를 원에서 떼어 보세요.</div>
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
      <div class="note" style="margin-top:12px">상자와 수염은 자료의 무엇으로 만들어질까요? 점을 끌어 어떤 값이 상자를 움직이는지 찾아보세요.</div>
    </div></div>`;
  const cv=$('#bx1'),ctx=cv.getContext('2d'),W=400,H=300;
  const S={ v:[12,14,15,16,17,18,18,19,20,21,22,24,26] }; let bxHad=false;
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
      + (outs.length?(bxHad=true,`<b style="color:#BE123C">수염 밖 이상치 ${outs.length}개</b> — 상자그림이 자동으로 골라냈습니다.<br>`)
                    :(bxHad?`이상치가 사라졌습니다 — 다시 모두 수염 안으로.<br>`:`이상치 없음 — 모두 수염 안에 있습니다.<br>`))
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
      <div class="note" style="margin-top:12px">파란 점: 공부시간·성적 12명. 빈 곳(특히 구석)을 클릭해 보세요 — 점 하나가 r 에 얼마나 힘을 쓸 수 있을까요?</div>
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

/* ═══════════════ 중1 2차·중2 (LAB 61~91) — 76종판에서 이식 ═══════════════ */
/* ---------- LAB 61 에라토스테네스의 체 [9수01-01] ---------- */
function sieveDemo(root){
  root.innerHTML=`<div class="row"><div class="col">
      <canvas id="sv1" width="380" height="300"></canvas>
    </div>
    <div class="col">
      <div class="ctl" style="display:flex;gap:6px;flex-wrap:wrap">
        <button class="b t" id="svGo">다음 소수로 거르기</button>
        <button class="b g sm" id="svRst">처음부터</button>
      </div>
      <div class="out" id="svout"></div>
      <div class="note" style="margin-top:12px">어느 소수까지 거르면 끝일까요? 더 거를 필요가 없어지는 순간을 찾아보세요.</div>
    </div></div>`;
  const cv=$('#sv1'),ctx=cv.getContext('2d'),W=380,H=300;
  const N=120, COLS=12, CW=(W-24)/COLS, CH=22;
  const S={ done:[], gone:{}, last:null };           // done: 거른 소수들, gone[n]=지운 소수
  const PCOL={2:'#2563EB',3:'#0E9384',5:'#B45309',7:'#7C3AED',11:'#BE123C'};
  function nextP(){ for(let p=2;p<=N;p++){ if(!S.gone[p] && !S.done.includes(p)) return p; } return null; }
  function draw(){
    ctx.clearRect(0,0,W,H); ctx.fillStyle='#fff'; ctx.fillRect(0,0,W,H);
    for(let n=2;n<=N;n++){
      const i=n-1, x=12+(i%COLS)*CW, y=26+Math.floor(i/COLS)*CH;
      const g=S.gone[n];
      if(g){ ctx.fillStyle=PCOL[g]||'#9CA3AF'; ctx.globalAlpha=.16;
        ctx.fillRect(x+1,y-14,CW-3,CH-4); ctx.globalAlpha=1; }
      if(S.done.includes(n)){ ctx.fillStyle=PCOL[n]||'#111827';
        ctx.fillRect(x+1,y-14,CW-3,CH-4); }
      ctx.fillStyle = S.done.includes(n) ? '#fff' : g ? '#B9BEC7' : '#111827';
      ctx.font=(S.done.includes(n)?'bold ':'')+'11px sans-serif'; ctx.textAlign='center';
      ctx.fillText(n, x+CW/2, y+1);
      if(g){ ctx.strokeStyle='#C6CBD3'; ctx.lineWidth=1;
        ctx.beginPath(); ctx.moveTo(x+3,y-2); ctx.lineTo(x+CW-5,y-8); ctx.stroke(); }
    }
    ctx.fillStyle='#6B7280'; ctx.font='11px sans-serif'; ctx.textAlign='left';
    ctx.fillText('2 ~ '+N+' · 색칠된 수 = 거른 소수 · 빗금 = 지워진 배수', 12, 14);
    const p=nextP(), remain=[];
    for(let n=2;n<=N;n++) if(!S.gone[n]) remain.push(n);
    $('#svout').innerHTML =
      (S.last!==null
        ? `<b style="color:${PCOL[S.last]||'#111827'}">${S.last}</b> 의 배수를 지웠습니다 — 새로 지운 수 <b>${S.lastCount}개</b><br>`
        : `「다음 소수로 거르기」를 눌러 시작하세요.<br>`)
      + `지금 남은 수 <b>${remain.length}개</b>`
      + (S.last!==null && S.lastCount===0
        ? `<br><b style="color:#0E9384">${S.last} 부터는 아무것도 새로 지워지지 않습니다 — ${S.last}² = ${S.last*S.last} > ${N}.
           남은 수는 전부 소수입니다!</b>` : '')
      + (p ? `<br><span style="color:#6B7280;font-size:12.5px">다음 후보: ${p} — 지워지지 않고 남은 가장 작은 수는 반드시 소수입니다.</span>` : '');
  }
  $('#svGo').onclick=()=>{
    const p=nextP(); if(!p) return;
    S.done.push(p); S.last=p; S.lastCount=0;
    for(let m=p*p;m<=N;m+=p){ if(!S.gone[m]){ S.gone[m]=p; S.lastCount++; } }
    draw();
  };
  $('#svRst').onclick=()=>{ S.done.length=0; S.gone={}; S.last=null; draw(); };
  draw();
  inquiry(root,{ id:'sv', title:'에라토스테네스의 체 — 어디까지 거르면 끝날까',
    q:['소수 하나로 거를 때마다 「지금 값 기록」을 눌러, 새로 지운 개수가 0 이 될 때까지 기록하세요.',
       '「p²」 열과 120 을 견주어, <b>새로 지워지는 수가 없어지는 경계</b>가 무엇인지 찾으세요.',
       'p 로 거를 때 p² 부터 지워도 되는 이유(그 아래 배수는 이미 지워져 있음)를 손으로 설명하고, 남은 수가 전부 소수인 이유도 적으세요.'],
    cols:['거른 소수 p','p²','새로 지운 수','남은 수','√120 넘었나'],
    hint:'힌트 — p 보다 작은 소수의 배수는 이미 다 지워졌습니다. p 의 배수 중 처음으로 “새로” 지워지는 것은 무엇일까요?',
    read:()=>{ if(S.last===null) return null;
      let remain=0; for(let n=2;n<=N;n++) if(!S.gone[n]) remain++;
      return [S.last, S.last*S.last, S.lastCount, remain, S.last*S.last>N?'넘었다':'아직']; } });
}

/* ---------- LAB 62 절댓값과 평균 오차 [9수01-05] ---------- */
function absErrDemo(root){
  root.innerHTML=`<div class="row"><div class="col">
      <canvas id="ae1" width="380" height="300"></canvas>
      <div class="note" style="margin-top:8px">닷새의 <b>예측 점(주황)을 위아래로 끌어</b>
      실제 기온(파란 막대)에 맞춰 보세요.</div>
    </div>
    <div class="col">
      <div class="out" id="aeout"></div>
      <div class="note" style="margin-top:12px">오차를 부호째 더한 채점 — 공평할까요? 엉망인 예보로 만점을 받는 방법이 있는지 찾아보세요.</div>
    </div></div>`;
  const cv=$('#ae1'),ctx=cv.getContext('2d'),W=380,H=300,P=40;
  const REAL=[3,-2,5,0,-4];                       // 실제 기온
  const S={ pred:[5,-4,7,-2,-6] };                // 예측 (끌기)
  const BW=(W-2*P)/5;
  const Y=v=>160-v*11;
  function draw(){
    ctx.clearRect(0,0,W,H); ctx.fillStyle='#fff'; ctx.fillRect(0,0,W,H);
    ctx.strokeStyle='#D1D5DB'; ctx.lineWidth=1.2;
    ctx.beginPath(); ctx.moveTo(P-10,Y(0)); ctx.lineTo(W-P+10,Y(0)); ctx.stroke();
    ctx.fillStyle='#9CA3AF'; ctx.font='10px sans-serif'; ctx.textAlign='left';
    ctx.fillText('0°C', W-P+12, Y(0)+3);
    REAL.forEach((r,i)=>{
      const x=P+i*BW+BW/2;
      // 실제 막대
      ctx.fillStyle='rgba(37,99,235,.35)';
      ctx.fillRect(x-16, Math.min(Y(0),Y(r)), 32, Math.abs(Y(r)-Y(0)));
      ctx.strokeStyle='#2563EB'; ctx.strokeRect(x-16, Math.min(Y(0),Y(r)), 32, Math.abs(Y(r)-Y(0)));
      // 오차 구간(점선) + 예측 손잡이
      const p=S.pred[i];
      ctx.strokeStyle='#BE123C'; ctx.setLineDash([3,3]);
      ctx.beginPath(); ctx.moveTo(x,Y(r)); ctx.lineTo(x,Y(p)); ctx.stroke(); ctx.setLineDash([]);
      handle(ctx,x,Y(p),'#B45309','');
      ctx.fillStyle='#374151'; ctx.font='10.5px sans-serif'; ctx.textAlign='center';
      ctx.fillText((i+1)+'일', x, 292);
      const e=p-r;
      ctx.fillStyle=e===0?'#0E9384':'#BE123C'; ctx.font='bold 10.5px sans-serif';
      ctx.fillText((e>0?'+':'')+e, x, Y(Math.max(p,r))-10);
    });
    const errs=S.pred.map((p,i)=>p-REAL[i]);
    const sum=errs.reduce((a,b)=>a+b,0), asum=errs.reduce((a,b)=>a+Math.abs(b),0);
    $('#aeout').innerHTML =
      `오차: ${errs.map(e=>(e>0?'+':'')+e).join(' , ')}<br>`
      + `부호 그대로 합: <b style="color:${sum===0&&asum>0?'#BE123C':'#374151'}">${sum>0?'+':''}${sum}</b>
         &nbsp;·&nbsp; |오차| 의 합: <b>${asum}</b> (평균 ${(asum/5).toFixed(1)})<br>`
      + (sum===0&&asum>0
        ? `<b style="color:#BE123C">부호 합은 0 인데 예측은 틀렸습니다!</b> 상쇄가 만든 착시 — 절댓값이 필요한 순간.`
        : asum===0
        ? `<b style="color:#0E9384">완벽한 예보 — 두 값 모두 0.</b>`
        : `<span style="color:#6B7280;font-size:12.5px">부호 합이 0 인데 |오차| 합은 큰 배치를 만들어 보세요.</span>`);
  }
  dragOn(cv,{
    hit:p=>{ for(let i=0;i<5;i++){ const x=P+i*BW+BW/2;
        if(Math.hypot(p.x-x,p.y-Y(S.pred[i]))<16) return i; }
      const i=Math.floor((p.x-P)/BW); return (i>=0&&i<5)?i:null; },
    move:(i,p)=>{ S.pred[i]=Math.max(-10,Math.min(10,Math.round((160-p.y)/11))); draw(); }
  });
  draw();
  inquiry(root,{ id:'ae', title:'절댓값과 평균 오차 — 오차는 어떻게 재야 공평할까',
    q:['예측 점을 끌어 여러 배치를 만들며 기록하세요. <b>부호 합이 0 인데 예측이 엉망인 배치</b>를 꼭 포함하세요.',
       '「부호 합」 열과 「|오차| 합」 열을 견주어, 어느 쪽이 예보의 실력을 제대로 재는지 찾으세요.',
       '부호 합이 0 이 되는 원리를 <b>상쇄</b>라는 말로 손으로 설명하고, 절댓값이 “거리”라는 뜻임을 수직선 그림으로 적으세요.'],
    cols:['1일','2일','3일','4일','5일','부호 합','|오차| 합'],
    hint:'힌트 — +3 과 −3 은 “반대 방향으로 같은 거리”입니다. 방향을 지우고 거리만 남기는 것이 절댓값입니다.',
    read:()=>{ const errs=S.pred.map((p,i)=>p-REAL[i]);
      return errs.map(e=>(e>0?'+':'')+e).concat([
        errs.reduce((a,b)=>a+b,0), errs.reduce((a,b)=>a+Math.abs(b),0)]); } });
}

/* ---------- LAB 63 식의 값과 대입 — 자판기 [9수02-01] ---------- */
function substDemo(root){
  root.innerHTML=`<div class="row"><div class="col">
      <canvas id="sb1" width="380" height="250"></canvas>
      <div class="ctl" style="display:flex;gap:6px;flex-wrap:wrap;margin-top:8px" id="sbCards"></div>
    </div>
    <div class="col">
      <label class="ctl">자판기에 넣을 식
        <select id="sbF" style="width:100%;padding:7px 9px;border:1px solid #E5E7EB;border-radius:8px;font:inherit">
          <option value="0">2a + 3 — 택시 요금(기본 3, km당 2)</option>
          <option value="1">a² — 정사각형의 넓이</option>
          <option value="2">5a − a — 묶어 세기</option>
          <option value="3">24 ÷ a — 나눠 먹기</option></select></label>
      <div class="out" id="sbout"></div>
      <div class="note" style="margin-top:12px">a = 7 일 때 2a — 27 을 내놓는 기계가 있다면 무엇을 잘못 읽은 걸까요? 기계들을 시험해 보세요.</div>
    </div></div>`;
  const cv=$('#sb1'),ctx=cv.getContext('2d'),W=380,H=250;
  const FS=[
    {txt:'2a + 3', f:a=>2*a+3, wrong:a=>+(''+2+a)+3},
    {txt:'a²',     f:a=>a*a,   wrong:a=>a*2},
    {txt:'5a − a', f:a=>4*a,   wrong:a=>5},
    {txt:'24 ÷ a', f:a=>24/a,  wrong:a=>24-a}
  ];
  const S={ log:[], a:null };
  function draw(){
    const F=FS[+$('#sbF').value];
    ctx.clearRect(0,0,W,H); ctx.fillStyle='#fff'; ctx.fillRect(0,0,W,H);
    // 자판기 몸통
    ctx.fillStyle='#EFF4FF'; ctx.strokeStyle='#2563EB'; ctx.lineWidth=2;
    ctx.beginPath(); ctx.roundRect(120,40,140,150,14); ctx.fill(); ctx.stroke();
    ctx.fillStyle='#111827'; ctx.font='bold 20px sans-serif'; ctx.textAlign='center';
    ctx.fillText(F.txt, 190, 86);
    ctx.font='11px sans-serif'; ctx.fillStyle='#6B7280';
    ctx.fillText('식 자판기', 190, 60);
    // 입구·출구
    ctx.fillStyle='#374151'; ctx.fillRect(150,104,80,10);
    ctx.fillStyle='#6B7280'; ctx.font='10px sans-serif';
    ctx.fillText('a 를 넣는 곳', 190, 128);
    ctx.strokeStyle='#0E9384'; ctx.strokeRect(150,146,80,30);
    if(S.a!==null){
      const v=F.f(S.a);
      ctx.fillStyle='#0E9384'; ctx.font='bold 19px sans-serif';
      ctx.fillText(Number.isInteger(v)?v:v.toFixed(2), 190, 168);
      ctx.fillStyle='#374151'; ctx.font='11px sans-serif';
      ctx.fillText('a = '+S.a+' 일 때', 190, 214);
    } else {
      ctx.fillStyle='#9CA3AF'; ctx.font='12px sans-serif'; ctx.fillText('?', 190, 168);
    }
    const rows=S.log.slice(-4).map(r=>`a=${r.a} → ${r.v}`).join(' · ');
    $('#sbout').innerHTML =
      (S.a===null ? '아래 숫자 카드를 눌러 a 를 넣어 보세요.' :
        `<span class="mono" style="font-size:16px">${F.txt.replace(/a/g,'('+S.a+')')} = <b>${F.f(S.a)}</b></span>`)
      + (rows?`<br><span style="color:#6B7280;font-size:12.5px">기록: ${rows}</span>`:'')
      + `<br><br><b>함정 문제</b> — 2a 에 a = 7 을 넣으면?
         <button class="b g sm" data-q="27">27</button>
         <button class="b g sm" data-q="14">14</button>
         <button class="b g sm" data-q="9">9</button>
         <span id="sbQ" style="margin-left:6px;font-weight:800"></span>`;
    $('#sbout').querySelectorAll('[data-q]').forEach(bt=>bt.onclick=()=>{
      const ok=bt.dataset.q==='14';
      $('#sbQ').innerHTML = ok
        ? '<span style="color:#0E9384">맞습니다 — 2a = 2 × a = 14</span>'
        : '<span style="color:#BE123C">'+(bt.dataset.q==='27'?'그건 “2와 7을 이어 쓴 것” — 생략된 것은 곱셈입니다':'2+7 이 아닙니다 — 2a 는 2 × a')+'</span>';
    });
  }
  function cards(){
    $('#sbCards').innerHTML='숫자 카드: '+[1,2,3,4,6,7,8,12].map(v=>
      `<button class="b t sm" data-v="${v}" style="min-width:38px">${v}</button>`).join('');
    $('#sbCards').querySelectorAll('[data-v]').forEach(bt=>bt.onclick=()=>{
      S.a=+bt.dataset.v; const F=FS[+$('#sbF').value];
      S.log.push({a:S.a, v:F.f(S.a)}); draw();
    });
  }
  $('#sbF').onchange=()=>{ S.a=null; S.log=[]; draw(); };
  cards(); draw();
  inquiry(root,{ id:'sb', title:'식의 값과 대입 — 식 자판기',
    q:['네 가지 식에 숫자 카드를 여러 장 넣어 보고, 매번 기록하세요 (8줄 이상).',
       'a 가 1씩 커질 때 식의 값이 <b>얼마씩, 또는 몇 배씩</b> 변하는지 식마다 비교하세요.',
       '2a 에 7 을 넣어 27 이 나오는 기계는 무엇을 잘못 읽은 것인지, <b>생략된 곱셈 기호</b>로 손으로 설명하세요.'],
    cols:['식','넣은 a','식의 값','a 를 1 키우면','값의 변화'],
    hint:'힌트 — 2a+3 은 “일정하게”, a² 은 “점점 크게” 변합니다. 그 차이가 일차식과 이차식의 차이입니다.',
    read:()=>{ if(S.a===null) return null;
      const F=FS[+$('#sbF').value], v=F.f(S.a), v2=F.f(S.a+1);
      return [F.txt, S.a, Number.isInteger(v)?v:v.toFixed(2),
              Number.isInteger(v2)?v2:v2.toFixed(2),
              '+'+(Number.isInteger(v2-v)?(v2-v):(v2-v).toFixed(2))]; } });
}

/* ---------- LAB 64 소금물 실험실 — 비율과 방정식 [9수02-03] ---------- */
function saltDemo(root){
  root.innerHTML=`<div class="row"><div class="col">
      <canvas id="sl1" width="380" height="280"></canvas>
      <div class="ctl" style="display:flex;gap:6px;flex-wrap:wrap;margin-top:8px">
        <button class="b t sm" id="slW">물 +100g</button>
        <button class="b t sm" id="slS">소금 +10g</button>
        <button class="b g sm" id="slE">물 100g 증발</button>
        <button class="b g sm" id="slR">다시 (소금 20g · 물 180g)</button>
      </div>
    </div>
    <div class="col">
      <div class="out" id="slout"></div>
      <div class="note" style="margin-top:12px">물을 부을 때와 증발시킬 때 — 변하는 것과 안 변하는 것은 각각 무엇일까요? 목표 5% 에 도전하세요.</div>
    </div></div>`;
  const cv=$('#sl1'),ctx=cv.getContext('2d'),W=380,H=280;
  const S={ salt:20, water:180, hist:[] };
  const GOAL=5;
  function conc(){ return S.salt/(S.salt+S.water)*100; }
  function draw(){
    const c=conc(), tot=S.salt+S.water;
    ctx.clearRect(0,0,W,H); ctx.fillStyle='#fff'; ctx.fillRect(0,0,W,H);
    // 비커
    const bx=70,by=40,bw=130,bh=190;
    const lvl=Math.min(1, tot/600);
    ctx.fillStyle='rgba(37,99,235,'+(0.10+c/40)+')';
    ctx.fillRect(bx, by+bh*(1-lvl), bw, bh*lvl);
    ctx.strokeStyle='#374151'; ctx.lineWidth=2.4;
    ctx.beginPath(); ctx.moveTo(bx,by); ctx.lineTo(bx,by+bh); ctx.lineTo(bx+bw,by+bh); ctx.lineTo(bx+bw,by); ctx.stroke();
    // 소금 알갱이 (양에 비례)
    ctx.fillStyle='#fff';
    const grains=Math.round(S.salt/2);
    for(let i=0;i<grains;i++){
      const gx=bx+8+((i*37)%(bw-16)), gy=by+bh-6-((i*53)%Math.max(8,bh*lvl-12));
      ctx.fillRect(gx,gy,3,3);
    }
    ctx.fillStyle='#374151'; ctx.font='11px sans-serif'; ctx.textAlign='center';
    ctx.fillText('소금 '+S.salt+'g · 물 '+S.water+'g', bx+bw/2, by+bh+22);
    // 농도 게이지
    const gx=240,gy=48,gh=176;
    ctx.fillStyle='#F3F4F6'; ctx.fillRect(gx,gy,26,gh);
    const ch=gh*Math.min(1,c/15);
    ctx.fillStyle=Math.abs(c-GOAL)<0.25?'#0E9384':'#2563EB';
    ctx.fillRect(gx,gy+gh-ch,26,ch);
    ctx.strokeStyle='#BE123C'; ctx.setLineDash([3,3]);
    ctx.beginPath(); ctx.moveTo(gx-8,gy+gh-gh*GOAL/15); ctx.lineTo(gx+34,gy+gh-gh*GOAL/15); ctx.stroke(); ctx.setLineDash([]);
    ctx.fillStyle='#BE123C'; ctx.font='bold 10.5px sans-serif'; ctx.textAlign='left';
    ctx.fillText('목표 '+GOAL+'%', gx+38, gy+gh-gh*GOAL/15+4);
    ctx.fillStyle='#111827'; ctx.font='bold 15px sans-serif';
    ctx.fillText(c.toFixed(2)+'%', gx-6, gy-12);
    const hit=Math.abs(c-GOAL)<0.25;
    $('#slout').innerHTML =
      `<span class="mono">농도 = ${S.salt} ÷ (${S.salt} + ${S.water}) × 100 = <b>${c.toFixed(2)}%</b></span><br>`
      + (hit?`<b style="color:#0E9384">목표 5% 명중!</b> 어떻게 도착했는지 식으로 설명해 보세요.<br>`:'')
      + `<span style="color:#6B7280;font-size:12.5px">지금 상태에서 5% 가 되려면 —
         물을 <b>${Math.max(0,Math.round(S.salt*100/GOAL-S.salt-S.water))}g</b> 더 붓거나,
         소금을 <b>${Math.max(0,(GOAL*(S.salt+S.water)/100-S.salt)/(1-GOAL/100)).toFixed(1)}g</b> 더 넣으면 됩니다.
         이 수가 곧 방정식의 해입니다.</span>`;
  }
  $('#slW').onclick=()=>{ S.water+=100; draw(); };
  $('#slS').onclick=()=>{ S.salt+=10; draw(); };
  $('#slE').onclick=()=>{ S.water=Math.max(0,S.water-100); draw(); };
  $('#slR').onclick=()=>{ S.salt=20; S.water=180; draw(); };
  draw();
  inquiry(root,{ id:'sl', title:'소금물 실험실 — 비율·농도 문제의 방정식화',
    q:['버튼을 눌러 여러 상태를 만들며 기록하세요 (8줄 이상). 목표 5% 에 명중한 줄을 꼭 포함하세요.',
       '물을 부을 때와 소금을 넣을 때, <b>분자·분모 중 무엇이 변하는지</b> 표에서 확인하세요.',
       '「소금 20g·물 180g 에 물을 x g 부어 5% 로 만든다」를 방정식으로 세우고 풀어, 화면의 안내 수와 같은지 손으로 확인하세요.'],
    cols:['소금(g)','물(g)','전체(g)','농도(%)','5%까지 물','5%까지 소금'],
    hint:'힌트 — 변하지 않는 것을 먼저 찾으세요. 물을 부을 때 소금의 양은 그대로입니다. 20/(200+x) = 5/100.',
    read:()=>{ const c=conc();
      return [S.salt,S.water,S.salt+S.water,c.toFixed(2),
              Math.max(0,Math.round(S.salt*100/GOAL-S.salt-S.water)),
              Math.max(0,(GOAL*(S.salt+S.water)/100-S.salt)/(1-GOAL/100)).toFixed(1)]; } });
}

/* ---------- LAB 65 수직이등분선의 작도 [9수03-03] ---------- */
function pbisectDemo(root){
  root.innerHTML=`<div class="row"><div class="col">
      <canvas id="pb1" width="380" height="300"></canvas>
      <div class="note" style="margin-top:8px"><b>A·B(검정)</b> 를 끌어 옮기고, <b>컴퍼스
      반지름(주황)</b>을 벌리고, 완성된 선 위의 <b>점 P(파랑)</b> 를 끌어 성질을 확인하세요.</div>
    </div>
    <div class="col">
      <div class="out" id="pbout"></div>
      <div class="note" style="margin-top:12px">완성된 선 위의 점 P 는 어떤 특별한 성질을 가질까요? P 를 끌어 A·B 까지의 거리를 감시하세요.</div>
    </div></div>`;
  const cv=$('#pb1'),ctx=cv.getContext('2d'),W=380,H=300;
  const S={ A:{x:110,y:170}, B:{x:270,y:150}, r:105, t:0.3 };   // t: P 의 위치(선 위 매개변수)
  function geom(){
    const dx=S.B.x-S.A.x, dy=S.B.y-S.A.y, d=Math.hypot(dx,dy);
    const M={x:(S.A.x+S.B.x)/2, y:(S.A.y+S.B.y)/2};
    const ok=S.r>d/2+1;
    const h=ok?Math.sqrt(S.r*S.r-d*d/4):0;
    const ux=-dy/d, uy=dx/d;                        // AB 에 수직인 단위벡터
    return {d,M,ok,h,ux,uy,
      P1:{x:M.x+ux*h, y:M.y+uy*h}, P2:{x:M.x-ux*h, y:M.y-uy*h},
      P:{x:M.x+ux*(S.t*130), y:M.y+uy*(S.t*130)}};
  }
  function draw(){
    const g=geom();
    ctx.clearRect(0,0,W,H); ctx.fillStyle='#fff'; ctx.fillRect(0,0,W,H);
    // 두 호(원 전체를 옅게)
    ctx.setLineDash([5,4]); ctx.lineWidth=1.6;
    ctx.strokeStyle='#93B4F7'; ctx.beginPath(); ctx.arc(S.A.x,S.A.y,S.r,0,7); ctx.stroke();
    ctx.strokeStyle='#8AD4C8'; ctx.beginPath(); ctx.arc(S.B.x,S.B.y,S.r,0,7); ctx.stroke();
    ctx.setLineDash([]);
    // 선분 AB
    ctx.strokeStyle='#111827'; ctx.lineWidth=2.2;
    ctx.beginPath(); ctx.moveTo(S.A.x,S.A.y); ctx.lineTo(S.B.x,S.B.y); ctx.stroke();
    if(g.ok){
      // 수직이등분선
      ctx.strokeStyle='#BE123C'; ctx.lineWidth=2.2;
      ctx.beginPath();
      ctx.moveTo(g.M.x+g.ux*150, g.M.y+g.uy*150);
      ctx.lineTo(g.M.x-g.ux*150, g.M.y-g.uy*150); ctx.stroke();
      [g.P1,g.P2].forEach(q=>{ ctx.fillStyle='#BE123C';
        ctx.beginPath(); ctx.arc(q.x,q.y,4.5,0,7); ctx.fill(); });
      // 점 P 와 PA·PB
      ctx.setLineDash([3,3]); ctx.strokeStyle='#2563EB'; ctx.lineWidth=1.5;
      ctx.beginPath(); ctx.moveTo(g.P.x,g.P.y); ctx.lineTo(S.A.x,S.A.y); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(g.P.x,g.P.y); ctx.lineTo(S.B.x,S.B.y); ctx.stroke();
      ctx.setLineDash([]);
      handle(ctx,g.P.x,g.P.y,'#2563EB','P');
    }
    // 손잡이들
    handle(ctx,S.A.x,S.A.y,'#111827','A'); handle(ctx,S.B.x,S.B.y,'#111827','B');
    const hr={x:S.A.x+S.r*Math.cos(-0.9), y:S.A.y+S.r*Math.sin(-0.9)};
    handle(ctx,hr.x,hr.y,'#B45309','r = '+S.r.toFixed(0));
    const pa=g.ok?Math.hypot(g.P.x-S.A.x,g.P.y-S.A.y):0;
    const pb=g.ok?Math.hypot(g.P.x-S.B.x,g.P.y-S.B.y):0;
    $('#pbout').innerHTML =
      `AB = <b>${g.d.toFixed(0)}</b> · 반지름 r = <b>${S.r.toFixed(0)}</b> · AB/2 = ${(g.d/2).toFixed(0)}<br>`
      + (g.ok
        ? `<b style="color:#0E9384">두 호가 만나 수직이등분선이 생겼습니다.</b><br>
           P 에서: PA = <b>${pa.toFixed(1)}</b> · PB = <b>${pb.toFixed(1)}</b>
           ${Math.abs(pa-pb)<0.6?'<b style="color:#0E9384">— 같습니다!</b>':''}<br>
           <span style="color:#6B7280;font-size:12.5px">P 를 어디로 끌어도 두 거리가 같은지 확인하세요.</span>`
        : `<b style="color:#BE123C">r ≤ AB/2 — 두 호가 만나지 않습니다.</b> 컴퍼스를 더 벌리세요.`);
  }
  dragOn(cv,{
    hit:p=>{
      const g=geom();
      const hr={x:S.A.x+S.r*Math.cos(-0.9), y:S.A.y+S.r*Math.sin(-0.9)};
      if(Math.hypot(p.x-hr.x,p.y-hr.y)<18) return 'r';
      if(g.ok && Math.hypot(p.x-g.P.x,p.y-g.P.y)<16) return 'P';
      if(Math.hypot(p.x-S.A.x,p.y-S.A.y)<16) return 'A';
      if(Math.hypot(p.x-S.B.x,p.y-S.B.y)<16) return 'B';
      return null;
    },
    move:(h,p)=>{
      if(h==='r') S.r=Math.max(30,Math.min(180,Math.round(Math.hypot(p.x-S.A.x,p.y-S.A.y))));
      else if(h==='A'){ S.A.x=p.x; S.A.y=p.y; }
      else if(h==='B'){ S.B.x=p.x; S.B.y=p.y; }
      else { const g=geom();
        S.t=Math.max(-1,Math.min(1,((p.x-g.M.x)*g.ux+(p.y-g.M.y)*g.uy)/130)); }
      draw();
    }
  });
  draw();
  inquiry(root,{ id:'pb', title:'수직이등분선의 작도 — 같은 거리의 점들',
    q:['A·B·r 을 바꿔 가며 기록하세요. <b>호가 만나는 경우와 안 만나는 경우</b>를 모두 담으세요.',
       '「PA」와 「PB」 열을 보세요. P 를 어디로 옮겨도 <b>무엇이 성립하는지</b> 찾으세요.',
       '수직이등분선이 “두 점에서 같은 거리인 점들의 모임”인 이유를, <b>두 호의 교점이 왜 그 성질을 갖는지</b>로 손으로 설명하세요.'],
    cols:['AB','r','호가 만나나','PA','PB','PA = PB?'],
    hint:'힌트 — 호 위의 모든 점은 그 중심에서 거리가 r 로 같습니다. 두 호의 교점은 A 에서도 B 에서도 거리가 r 입니다.',
    read:()=>{ const g=geom();
      if(!g.ok) return [g.d.toFixed(0), S.r.toFixed(0), '안 만남', '—','—','—'];
      const pa=Math.hypot(g.P.x-S.A.x,g.P.y-S.A.y), pb=Math.hypot(g.P.x-S.B.x,g.P.y-S.B.y);
      return [g.d.toFixed(0), S.r.toFixed(0), '만남', pa.toFixed(1), pb.toFixed(1),
              Math.abs(pa-pb)<0.6?'같다':'다르다']; } });
}

/* ---------- LAB 66 각의 이등분선 작도 [9수03-03] ---------- */
function abisectDemo(root){
  root.innerHTML=`<div class="row"><div class="col">
      <canvas id="ab1" width="380" height="300"></canvas>
      <div class="note" style="margin-top:8px"><b>각의 크기(검정 손잡이)</b>와 <b>컴퍼스 두 개
      (주황 r₁ · 파랑 r₂)</b>를 끌어 작도를 완성하세요.</div>
    </div>
    <div class="col">
      <div class="out" id="about"></div>
      <div class="note" style="margin-top:12px">컴퍼스 세 번으로 각이 정말 「정확히」 절반이 될까요? 각도기 없이 그것을 믿을 근거는 무엇일까요?</div>
    </div></div>`;
  const cv=$('#ab1'),ctx=cv.getContext('2d'),W=380,H=300;
  const O={x:70,y:230};
  const S={ ang:64, r1:80, r2:70 };
  const rad=d=>d*Math.PI/180;
  function geom(){
    const P1={x:O.x+S.r1, y:O.y};                                   // 아랫변 위
    const P2={x:O.x+S.r1*Math.cos(-rad(S.ang)), y:O.y+S.r1*Math.sin(-rad(S.ang))};
    const d=Math.hypot(P2.x-P1.x,P2.y-P1.y);
    const ok=S.r2>d/2+1;
    let X=null;
    if(ok){
      const M={x:(P1.x+P2.x)/2,y:(P1.y+P2.y)/2};
      const h=Math.sqrt(S.r2*S.r2-d*d/4);
      const ux=-(P2.y-P1.y)/d, uy=(P2.x-P1.x)/d;
      const c1={x:M.x+ux*h,y:M.y+uy*h}, c2={x:M.x-ux*h,y:M.y-uy*h};
      X = (Math.hypot(c1.x-O.x,c1.y-O.y)>Math.hypot(c2.x-O.x,c2.y-O.y))?c1:c2;   // O 에서 먼 쪽
    }
    return {P1,P2,d,ok,X};
  }
  function draw(){
    const g=geom();
    ctx.clearRect(0,0,W,H); ctx.fillStyle='#fff'; ctx.fillRect(0,0,W,H);
    // 두 변
    ctx.strokeStyle='#111827'; ctx.lineWidth=2.2;
    ctx.beginPath(); ctx.moveTo(O.x,O.y); ctx.lineTo(O.x+260,O.y); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(O.x,O.y);
    ctx.lineTo(O.x+260*Math.cos(-rad(S.ang)), O.y+260*Math.sin(-rad(S.ang))); ctx.stroke();
    // 호 r1
    ctx.strokeStyle='#B45309'; ctx.setLineDash([5,4]); ctx.lineWidth=1.8;
    ctx.beginPath(); ctx.arc(O.x,O.y,S.r1,0.15,-rad(S.ang)-0.15,true); ctx.stroke();
    // 두 교점과 호 r2
    [g.P1,g.P2].forEach(q=>{ ctx.fillStyle='#B45309';
      ctx.beginPath(); ctx.arc(q.x,q.y,4,0,7); ctx.fill();
      ctx.strokeStyle='#93B4F7';
      ctx.beginPath(); ctx.arc(q.x,q.y,S.r2,0,7); ctx.stroke(); });
    ctx.setLineDash([]);
    if(g.ok&&g.X){
      ctx.fillStyle='#BE123C'; ctx.beginPath(); ctx.arc(g.X.x,g.X.y,5,0,7); ctx.fill();
      // 이등분선
      const L=Math.hypot(g.X.x-O.x,g.X.y-O.y);
      ctx.strokeStyle='#BE123C'; ctx.lineWidth=2.2;
      ctx.beginPath(); ctx.moveTo(O.x,O.y);
      ctx.lineTo(O.x+(g.X.x-O.x)/L*270, O.y+(g.X.y-O.y)/L*270); ctx.stroke();
      const half=Math.atan2(-(g.X.y-O.y), g.X.x-O.x)*180/Math.PI;
      ctx.fillStyle='#BE123C'; ctx.font='bold 12px sans-serif'; ctx.textAlign='left';
      ctx.fillText(half.toFixed(1)+'°', O.x+96*Math.cos(-rad(half))+8, O.y+96*Math.sin(-rad(half)));
    }
    // 손잡이: 각(윗변 끝), r1(호 위), r2(P1 원 위)
    const hA={x:O.x+230*Math.cos(-rad(S.ang)), y:O.y+230*Math.sin(-rad(S.ang))};
    handle(ctx,hA.x,hA.y,'#111827','각 '+S.ang+'°');
    const h1={x:O.x+S.r1*Math.cos(-rad(S.ang/2)), y:O.y+S.r1*Math.sin(-rad(S.ang/2))};
    handle(ctx,h1.x,h1.y,'#B45309','r₁');
    const h2={x:g.P1.x+S.r2*Math.cos(-1.2), y:g.P1.y+S.r2*Math.sin(-1.2)};
    handle(ctx,h2.x,h2.y,'#2563EB','r₂');
    const half=g.ok&&g.X?Math.atan2(-(g.X.y-O.y),g.X.x-O.x)*180/Math.PI:null;
    $('#about').innerHTML =
      `각 = <b>${S.ang}°</b> · r₁ = ${S.r1.toFixed(0)} · r₂ = ${S.r2.toFixed(0)}<br>`
      + (g.ok
        ? `이등분선의 각: <b>${half.toFixed(1)}°</b> — 절반값 ${
            (S.ang/2).toFixed(1)}° 와 ${Math.abs(half-S.ang/2)<0.6
              ?'<b style="color:#0E9384">일치합니다!</b>'
              :'<b style="color:#BE123C">어긋납니다</b>'}<br>
           <span style="color:#6B7280;font-size:12.5px">각을 끌어 바꿔도 늘 절반인지 확인하세요.</span>`
        : `<b style="color:#BE123C">r₂ 가 짧아 두 호가 만나지 않습니다.</b> 파란 컴퍼스를 더 벌리세요.`);
  }
  dragOn(cv,{
    hit:p=>{
      const g=geom();
      const hA={x:O.x+230*Math.cos(-rad(S.ang)), y:O.y+230*Math.sin(-rad(S.ang))};
      const h1={x:O.x+S.r1*Math.cos(-rad(S.ang/2)), y:O.y+S.r1*Math.sin(-rad(S.ang/2))};
      const h2={x:g.P1.x+S.r2*Math.cos(-1.2), y:g.P1.y+S.r2*Math.sin(-1.2)};
      if(Math.hypot(p.x-h1.x,p.y-h1.y)<16) return 'r1';
      if(Math.hypot(p.x-h2.x,p.y-h2.y)<16) return 'r2';
      if(Math.hypot(p.x-hA.x,p.y-hA.y)<20) return 'A';
      return null;
    },
    move:(h,p)=>{
      if(h==='A'){ let a=Math.atan2(-(p.y-O.y),p.x-O.x)*180/Math.PI;
        S.ang=Math.max(20,Math.min(150,Math.round(a))); }
      else if(h==='r1') S.r1=Math.max(40,Math.min(140,Math.round(Math.hypot(p.x-O.x,p.y-O.y))));
      else { const g=geom();
        S.r2=Math.max(25,Math.min(140,Math.round(Math.hypot(p.x-g.P1.x,p.y-g.P1.y)))); }
      draw();
    }
  });
  draw();
  inquiry(root,{ id:'ab', title:'각의 이등분선 작도 — 각도기 없이 절반 만들기',
    q:['각의 크기를 여러 값으로 바꿔 가며 기록하세요 (8줄 이상). r₁·r₂ 도 함께 바꿔 보세요.',
       '「이등분선의 각」 열과 「절반값」 열을 견주어, r₁·r₂ 를 바꿔도 <b>변하지 않는 것</b>이 무엇인지 찾으세요.',
       '이 작도가 왜 정확히 절반을 만드는지 <b>합동(SSS)</b>으로 손으로 설명하세요 — O 와 교점을 잇는 선이 두 삼각형을 어떻게 겹치게 하나요?'],
    cols:['각','r₁','r₂','이등분선의 각','절반값','일치?'],
    hint:'힌트 — 호 r₁ 이 만든 두 점은 O 에서 같은 거리, 교점은 그 두 점에서 같은 거리입니다. 세 변이 각각 같은 두 삼각형이 숨어 있습니다.',
    read:()=>{ const g=geom(); if(!g.ok||!g.X) return null;
      const half=Math.atan2(-(g.X.y-O.y),g.X.x-O.x)*180/Math.PI;
      return [S.ang+'°',S.r1.toFixed(0),S.r2.toFixed(0),half.toFixed(1)+'°',
              (S.ang/2).toFixed(1)+'°', Math.abs(half-S.ang/2)<0.6?'일치':'어긋남']; } });
}

/* ---------- LAB 67 부채꼴 펼치기 — S = ½rl [9수03-06] ---------- */
function arcAreaDemo(root){
  root.innerHTML=`<div class="row"><div class="col">
      <canvas id="aa1" width="380" height="300"></canvas>
      <div class="ctl" style="display:flex;gap:6px;flex-wrap:wrap;margin-top:8px">
        <button class="b t sm" id="aaCut">더 잘게 자르기 ×2</button>
        <button class="b g sm" id="aaRst">4조각으로</button>
      </div>
    </div>
    <div class="col">
      <div class="out" id="aaout"></div>
      <div class="note" style="margin-top:12px">조각을 잘게 낼수록 무엇에 가까워지나요? 그 도형의 가로·세로에 이름을 붙일 수 있나요?</div>
    </div></div>`;
  const cv=$('#aa1'),ctx=cv.getContext('2d'),W=380,H=300;
  const S={ ang:150, r:95, n:4 };
  const rad=d=>d*Math.PI/180;
  function draw(){
    ctx.clearRect(0,0,W,H); ctx.fillStyle='#fff'; ctx.fillRect(0,0,W,H);
    const t=rad(S.ang), C={x:92,y:130};
    // 왼쪽: 원본 부채꼴 (조각 경계 포함)
    ctx.fillStyle='rgba(37,99,235,.14)';
    ctx.beginPath(); ctx.moveTo(C.x,C.y); ctx.arc(C.x,C.y,S.r,0,-t,true); ctx.closePath(); ctx.fill();
    ctx.strokeStyle='#2563EB'; ctx.lineWidth=1.4;
    for(let i=0;i<=S.n;i++){ const a=-t*i/S.n;
      ctx.beginPath(); ctx.moveTo(C.x,C.y);
      ctx.lineTo(C.x+S.r*Math.cos(a),C.y+S.r*Math.sin(a)); ctx.stroke(); }
    ctx.beginPath(); ctx.arc(C.x,C.y,S.r,0,-t,true); ctx.stroke();
    handle(ctx, C.x+S.r*Math.cos(-t), C.y+S.r*Math.sin(-t), '#B45309','중심각 '+S.ang+'°');
    handle(ctx, C.x+S.r, C.y, '#2563EB','r = '+S.r.toFixed(0));
    // 오른쪽: 번갈아 붙인 평행사변형 근사
    const l=S.r*t, seg=t/S.n, base=l/2/S.n*2;         // 조각 하나의 밑 폭 ≈ l/n
    const px0=225, py0=232, sc=0.9;
    for(let i=0;i<S.n;i++){
      const up=i%2===0;
      const x=px0+i*(l/S.n)*sc*0.5;
      ctx.save(); ctx.translate(x, up?py0:py0-S.r*sc);
      ctx.fillStyle='rgba(14,147,132,.16)'; ctx.strokeStyle='#0E9384'; ctx.lineWidth=1.1;
      ctx.beginPath();
      if(up){ ctx.moveTo(0,0); ctx.lineTo((l/S.n)*sc,0); ctx.lineTo((l/S.n)*sc/2, -S.r*sc); }
      else  { ctx.moveTo((l/S.n)*sc/2,0); ctx.lineTo(0,S.r*sc); ctx.lineTo((l/S.n)*sc,S.r*sc); }
      ctx.closePath(); ctx.fill(); ctx.stroke(); ctx.restore();
    }
    ctx.fillStyle='#6B7280'; ctx.font='10.5px sans-serif'; ctx.textAlign='center';
    ctx.fillText('가로 ≈ l/2 = '+(l/2).toFixed(0), px0+l*sc/4, py0+18);
    ctx.save(); ctx.translate(px0-10, py0-S.r*sc/2); ctx.rotate(-Math.PI/2);
    ctx.fillText('세로 = r', 0, 0); ctx.restore();
    const area=0.5*S.r*l, formula=Math.PI*S.r*S.r*S.ang/360;
    $('#aaout').innerHTML =
      `중심각 <b>${S.ang}°</b> · r = <b>${S.r.toFixed(0)}</b> · 호 l = rθ = <b>${l.toFixed(1)}</b> · ${S.n}조각<br>`
      + `<span class="mono">½ r l = ½ × ${S.r.toFixed(0)} × ${l.toFixed(1)} = <b>${area.toFixed(0)}</b></span><br>`
      + `<span class="mono">πr² × ${S.ang}/360 = <b>${formula.toFixed(0)}</b></span>
         <b style="color:#0E9384">— 두 값이 같습니다</b><br>`
      + `<span style="color:#6B7280;font-size:12.5px">${S.n<32?'조각을 더 잘게 자르면 오른쪽이 점점 반듯한 평행사변형이 됩니다.':'이제 거의 직사각형 — 가로 l/2, 세로 r.'}</span>`;
  }
  dragOn(cv,{
    hit:p=>{
      const t=rad(S.ang), C={x:92,y:130};
      if(Math.hypot(p.x-(C.x+S.r*Math.cos(-t)), p.y-(C.y+S.r*Math.sin(-t)))<18) return 'a';
      if(Math.hypot(p.x-(C.x+S.r), p.y-C.y)<18) return 'r';
      return null;
    },
    move:(h,p)=>{
      const C={x:92,y:130};
      if(h==='a'){ let a=Math.atan2(-(p.y-C.y),p.x-C.x)*180/Math.PI; if(a<0)a+=360;
        S.ang=Math.max(30,Math.min(330,Math.round(a/5)*5)); }
      else S.r=Math.max(50,Math.min(120,Math.round(Math.hypot(p.x-C.x,p.y-C.y))));
      draw();
    }
  });
  $('#aaCut').onclick=()=>{ S.n=Math.min(64,S.n*2); draw(); };
  $('#aaRst').onclick=()=>{ S.n=4; draw(); };
  draw();
  inquiry(root,{ id:'aa', title:'부채꼴 펼치기 — S = ½rl 의 발견',
    q:['중심각과 r 를 바꿔 가며 기록하세요 (8줄 이상). 조각 수를 늘려 가며 오른쪽 모양의 변화도 지켜보세요.',
       '「½rl」 열과 「πr²×각/360」 열을 견주어 무엇이 성립하는지 찾고, 호 l 이 각과 r 에 어떻게 매였는지 확인하세요.',
       '잘라 붙인 평행사변형의 가로가 왜 l 이 아니라 <b>l/2</b> 인지 손으로 설명하고, 원의 넓이 πr² 을 같은 방법으로 유도해 적으세요.'],
    cols:['중심각','r','호 l','½rl','πr²×각/360','일치?'],
    hint:'힌트 — 호는 위쪽 조각과 아래쪽 조각에 절반씩 나뉘어 붙습니다. 삼각형 넓이 ½ × 밑변 × 높이와 같은 구조입니다.',
    read:()=>{ const t=rad(S.ang), l=S.r*t, a1=0.5*S.r*l, a2=Math.PI*S.r*S.r*S.ang/360;
      return [S.ang+'°',S.r.toFixed(0),l.toFixed(1),a1.toFixed(0),a2.toFixed(0),
              Math.abs(a1-a2)<1?'일치':'어긋남']; } });
}

/* ---------- LAB 68 정다면체는 왜 5개뿐일까 [9수03-07] ---------- */
function platonicDemo(root){
  root.innerHTML=`<div class="row"><div class="col">
      <canvas id="pl1" width="380" height="300"></canvas>
    </div>
    <div class="col">
      <label class="ctl">한 꼭짓점에 모을 정다각형
        <select id="plN" style="width:100%;padding:7px 9px;border:1px solid #E5E7EB;border-radius:8px;font:inherit">
          <option value="3">정삼각형 (한 내각 60°)</option>
          <option value="4">정사각형 (90°)</option>
          <option value="5">정오각형 (108°)</option>
          <option value="6">정육각형 (120°)</option></select></label>
      <div class="ctl" style="display:flex;gap:6px;flex-wrap:wrap;margin-top:8px">
        <button class="b t" id="plPut">한 장 모으기</button>
        <button class="b g sm" id="plRst">비우기</button>
      </div>
      <div class="out" id="plout"></div>
      <div class="note" style="margin-top:12px">꼭짓점에 도형을 모아 보세요 — 접히는 경우와 안 접히는 경우의 갈림길은 무엇일까요? 조합을 전부 찾아보세요.</div>
    </div></div>`;
  const cv=$('#pl1'),ctx=cv.getContext('2d'),W=380,H=300;
  const NAME={ '3-3':'정사면체','3-4':'정팔면체','3-5':'정이십면체','4-3':'정육면체','5-3':'정십이면체' };
  const S={ m:0, found:{} };
  const inner=()=>{ const n=+$('#plN').value; return 180*(n-2)/n; };
  function draw(){
    const n=+$('#plN').value, ia=inner(), used=S.m*ia;
    ctx.clearRect(0,0,W,H); ctx.fillStyle='#fff'; ctx.fillRect(0,0,W,H);
    const C={x:150,y:150}, R=84;
    const cols=['#2563EB','#0E9384','#B45309','#7C3AED','#0891B2','#DB2777'];
    for(let i=0;i<S.m;i++){
      const a0=-i*rad2(ia);
      ctx.globalAlpha=.16; ctx.fillStyle=cols[i%cols.length];
      poly(C,R,n,a0); ctx.fill(); ctx.globalAlpha=1;
      ctx.strokeStyle=cols[i%cols.length]; ctx.lineWidth=1.6; poly(C,R,n,a0); ctx.stroke();
    }
    ctx.fillStyle='#111827'; ctx.beginPath(); ctx.arc(C.x,C.y,4,0,7); ctx.fill();
    // 게이지
    ctx.strokeStyle='#E5E7EB'; ctx.lineWidth=7;
    ctx.beginPath(); ctx.arc(C.x,C.y,20,0,7); ctx.stroke();
    ctx.strokeStyle = used<360?'#0E9384':used===360?'#B45309':'#BE123C';
    ctx.beginPath(); ctx.arc(C.x,C.y,20,0,-Math.min(360,used)*Math.PI/180,true); ctx.stroke();
    ctx.fillStyle='#111827'; ctx.font='bold 14px sans-serif'; ctx.textAlign='center';
    ctx.fillText(used+'°', C.x, C.y-32);
    // 발견 목록
    ctx.fillStyle='#374151'; ctx.font='bold 11.5px sans-serif'; ctx.textAlign='left';
    ctx.fillText('찾은 정다면체 '+Object.keys(S.found).length+' / 5', 268, 40);
    ctx.font='11px sans-serif'; let y=58;
    Object.keys(NAME).forEach(k=>{
      ctx.fillStyle=S.found[k]?'#0E9384':'#C6CBD3';
      ctx.fillText((S.found[k]?'✓ ':'· ')+NAME[k], 268, y); y+=18;
    });
    const key=n+'-'+S.m;
    const solid = used<360 && S.m>=3 ? NAME[key] : null;
    if(solid){ S.found[key]=1; }
    $('#plout').innerHTML =
      `정${n}각형 × <b>${S.m}장</b> → 모인 각의 합 <b>${used}°</b><br>`
      + (S.m<3 ? `아직 ${S.m}장 — 입체 꼭짓점이 되려면 <b>3장 이상</b> 모아야 합니다.`
        : used<360 ? `<b style="color:#0E9384">360°보다 작아 오므라들 수 있습니다 — ${solid||'입체'} 완성!</b>`
        : used===360 ? `<b style="color:#B45309">딱 360° — 평평해져 바닥 타일이 됩니다. 입체가 못 됩니다.</b>`
        : `<b style="color:#BE123C">360°를 넘어 겹칩니다 — 이 조합은 불가능합니다.</b>`)
      + `<br><span style="color:#6B7280;font-size:12.5px">네 가지 다각형 × 여러 장수를 전부 시험해 5가지를 모두 찾으세요.</span>`;
  }
  function rad2(d){ return d*Math.PI/180; }
  function poly(C,R,n,a0){
    // 꼭짓점 C 를 공유하는 정n각형 — 한 변을 a0 방향으로
    const ext=Math.PI-rad2(inner());
    ctx.beginPath(); ctx.moveTo(C.x,C.y);
    let x=C.x,y=C.y,dir=a0;
    for(let i=0;i<n;i++){ x+=R*Math.cos(dir); y+=R*Math.sin(dir); ctx.lineTo(x,y); dir+=ext; }
    ctx.closePath();
  }
  $('#plPut').onclick=()=>{ const ia=inner();
    if(S.m*ia>=360+ia) return; S.m++; draw(); };
  $('#plRst').onclick=()=>{ S.m=0; draw(); };
  $('#plN').onchange=()=>{ S.m=0; draw(); };
  draw();
  inquiry(root,{ id:'pl', title:'정다면체는 왜 5개뿐일까 — 꼭짓점의 각 조건',
    q:['(정다각형, 장수) 조합을 전부 시험하며 기록하세요 — 정삼각형 3·4·5·6장, 정사각형 3·4장, 정오각형 3·4장, 정육각형 3장.',
       '「입체가 되나」 열을 보고, 되는 조합이 <b>몇 가지뿐인지</b> 세고 각각 무슨 입체인지 적으세요.',
       '정육각형부터는 왜 단 하나도 안 되는지 <b>한 내각 × 3 ≥ 360°</b> 로 손으로 설명하세요. 이것이 정다면체가 5개뿐인 증명의 뼈대입니다.'],
    cols:['다각형','한 내각','장수','각의 합','입체가 되나','이름'],
    hint:'힌트 — 종이를 한 점에 세 장 모아 붙여 보세요. 합이 360°보다 작아야 오므라들어 볼록해집니다.',
    read:()=>{ const n=+$('#plN').value, ia=inner(), used=S.m*ia;
      const key=n+'-'+S.m, ok=used<360&&S.m>=3;
      return ['정'+n+'각형', ia.toFixed(0)+'°', S.m, used+'°',
              S.m<3?'장수 부족':ok?'된다':'안 된다', ok?(NAME[key]||'—'):'—']; } });
}

/* ---------- LAB 69 일차부등식 — 예산 안에서 [9수02-02] ---------- */
function ineqDemo(root){
  root.innerHTML=`<div class="row"><div class="col">
      <canvas id="iq1" width="380" height="280"></canvas>
      <div class="ctl" style="display:flex;gap:6px;flex-wrap:wrap;margin-top:8px">
        <button class="b t" id="iqAdd">간식 하나 담기 (+800원)</button>
        <button class="b g sm" id="iqDel">하나 빼기</button>
        <button class="b g sm" id="iqRst">비우기</button>
      </div>
    </div>
    <div class="col">
      <div class="out" id="iqout"></div>
      <div class="note" style="margin-top:12px">예산 안에서 몇 개까지 담을 수 있을까요? 그리고 「−2 를 양변에 곱하기」에서는 무엇을 조심해야 할까요?</div>
    </div></div>`;
  const cv=$('#iq1'),ctx=cv.getContext('2d'),W=380,H=280;
  const PRICE=800, BUDGET=5000;
  const S={ x:0, flipped:null };                       // flipped: null | 'ok' | 'bad'
  function draw(){
    ctx.clearRect(0,0,W,H); ctx.fillStyle='#fff'; ctx.fillRect(0,0,W,H);
    // 예산 게이지
    ctx.fillStyle='#F3F4F6'; ctx.fillRect(30,34,W-60,20);
    const used=S.x*PRICE, over=used>BUDGET;
    ctx.fillStyle=over?'#BE123C':'#2563EB';
    ctx.fillRect(30,34,(W-60)*Math.min(1,used/6400),20);
    ctx.strokeStyle='#111827'; ctx.setLineDash([4,3]); ctx.lineWidth=1.6;
    const bx=30+(W-60)*BUDGET/6400;
    ctx.beginPath(); ctx.moveTo(bx,26); ctx.lineTo(bx,62); ctx.stroke(); ctx.setLineDash([]);
    ctx.fillStyle='#374151'; ctx.font='bold 11px sans-serif'; ctx.textAlign='center';
    ctx.fillText('예산 5,000원', bx, 20);
    ctx.textAlign='left';
    ctx.fillText(used.toLocaleString()+'원', 30, 70);
    // 간식들
    for(let i=0;i<S.x;i++){
      const x=42+(i%8)*40, y=104+Math.floor(i/8)*34;
      ctx.fillStyle=(i+1)*PRICE>BUDGET?'#FCE7EB':'#EFF4FF';
      ctx.strokeStyle=(i+1)*PRICE>BUDGET?'#BE123C':'#2563EB'; ctx.lineWidth=1.6;
      ctx.beginPath(); ctx.roundRect(x-15,y-13,30,26,6); ctx.fill(); ctx.stroke();
      ctx.fillStyle='#374151'; ctx.font='10px sans-serif'; ctx.textAlign='center';
      ctx.fillText('800', x, y+4);
    }
    // 수직선 위의 해
    const ny=228, x0=60, x1=W-40;
    ctx.strokeStyle='#9CA3AF'; ctx.lineWidth=1.6;
    ctx.beginPath(); ctx.moveTo(x0-14,ny); ctx.lineTo(x1+14,ny); ctx.stroke();
    const px=v=>x0+(x1-x0)*v/8;
    for(let v=0;v<=8;v++){ ctx.strokeStyle='#D1D5DB';
      ctx.beginPath(); ctx.moveTo(px(v),ny-5); ctx.lineTo(px(v),ny+5); ctx.stroke();
      ctx.fillStyle='#9CA3AF'; ctx.font='10px sans-serif'; ctx.textAlign='center';
      ctx.fillText(v, px(v), ny+18); }
    const sol=BUDGET/PRICE;    // 6.25
    // 해 영역 칠하기 — flipped==='bad' 이면 반대로!
    const badArea = S.flipped==='bad';
    ctx.strokeStyle=badArea?'#BE123C':'#0E9384'; ctx.lineWidth=4;
    ctx.beginPath();
    if(badArea){ ctx.moveTo(px(sol),ny-10); ctx.lineTo(px(8)+14,ny-10); }
    else { ctx.moveTo(px(0)-6,ny-10); ctx.lineTo(px(sol),ny-10); }
    ctx.stroke();
    ctx.fillStyle=badArea?'#BE123C':'#0E9384';
    ctx.beginPath(); ctx.arc(px(sol),ny-10,4.5,0,7); ctx.fill();
    ctx.font='bold 10.5px sans-serif';
    ctx.fillText('x = '+sol, px(sol), ny-20);
    $('#iqout').innerHTML =
      `<span class="mono" style="font-size:16px">800x ≤ 5000 &nbsp;→&nbsp; x ≤ <b>${sol}</b></span><br>`
      + `담은 개수 x = <b>${S.x}</b> · ${used.toLocaleString()}원 —
         ${over?'<b style="color:#BE123C">예산 초과! 부등식을 벗어났습니다</b>'
               :S.x===6?'<b style="color:#0E9384">최대입니다 — 자연수 해 중 가장 큰 6</b>':'아직 담을 수 있습니다'}<br><br>`
      + `<b>양변에 −2 곱하기</b> — −1600x ${S.flipped==='bad'?'≤':'≥'} −10000 이 되어야 할까요?<br>
         <button class="b g sm" data-f="bad">부등호 그대로 (≤)</button>
         <button class="b g sm" data-f="ok">부등호 뒤집기 (≥)</button>
         <span id="iqF" style="font-weight:800">${
           S.flipped==='bad'?'<span style="color:#BE123C">그대로 두면 수직선의 해가 반대로 칠해집니다 — 위를 보세요!</span>'
           :S.flipped==='ok'?'<span style="color:#0E9384">맞습니다 — 음수를 곱하면 대소가 뒤집히므로 부등호도 뒤집습니다.</span>':''}</span>`;
    $('#iqout').querySelectorAll('[data-f]').forEach(bt=>bt.onclick=()=>{ S.flipped=bt.dataset.f; draw(); });
  }
  $('#iqAdd').onclick=()=>{ if(S.x<8){ S.x++; draw(); } };
  $('#iqDel').onclick=()=>{ if(S.x>0){ S.x--; draw(); } };
  $('#iqRst').onclick=()=>{ S.x=0; S.flipped=null; draw(); };
  draw();
  inquiry(root,{ id:'iq', title:'일차부등식 — 예산 안에서 몇 개까지',
    q:['간식을 하나씩 담으며 매번 기록하세요 (0개부터 8개까지).',
       '「부등식 만족?」 열이 바뀌는 경계를 찾아, 해 x ≤ 6.25 와 <b>실제 답(자연수 6)</b>의 관계를 적으세요.',
       '양변에 −2 를 곱할 때 부등호를 뒤집는 이유를 <b>수직선에서 −1 배가 하는 일(반사)</b>로 손으로 설명하세요.'],
    cols:['담은 수 x','금액 800x','예산','부등식 만족?','남은 돈'],
    hint:'힌트 — 3 < 5 의 양변에 −1 을 곱하면 −3 과 −5 — 어느 쪽이 큰가요? 수직선에서 0 을 중심으로 뒤집힌 그림을 그려 보세요.',
    read:()=>[S.x, (S.x*PRICE).toLocaleString(), BUDGET.toLocaleString(),
              S.x*PRICE<=BUDGET?'만족':'위반', Math.max(0,BUDGET-S.x*PRICE).toLocaleString()] });
}

/* ---------- LAB 70 나머지와 해시 — 사물함 배정 [9수01-02] ---------- */
function hashDemo(root){
  root.innerHTML=`<div class="row"><div class="col">
      <canvas id="hh1" width="380" height="300"></canvas>
      <div class="ctl" style="display:flex;gap:6px;flex-wrap:wrap;margin-top:8px" id="hhCards"></div>
    </div>
    <div class="col">
      <label class="ctl">사물함 개수 m (나눗수)
        <select id="hhM" style="width:100%;padding:7px 9px;border:1px solid #E5E7EB;border-radius:8px;font:inherit">
          <option value="10">m = 10 (끝자리 그대로)</option>
          <option value="8">m = 8 (짝수)</option>
          <option value="7" selected>m = 7 (소수)</option>
          <option value="11">m = 11 (소수)</option></select></label>
      <div class="out" id="hhout"></div>
      <div class="note" style="margin-top:12px">번호가 사물함에 배정되는 규칙을 알아낼 수 있나요? m 값에 따라 배정이 공평하기도 몰리기도 하는 이유는?</div>
    </div></div>`;
  const cv=$('#hh1'),ctx=cv.getContext('2d'),W=380,H=300;
  const IDS=[20104,20208,20312,20416,20520,20624,20728,20832,20936,21040,20105,20211];
  const S={ placed:[] };                                // {id, slot}
  function draw(){
    const m=+$('#hhM').value;
    ctx.clearRect(0,0,W,H); ctx.fillStyle='#fff'; ctx.fillRect(0,0,W,H);
    const cw=Math.min(46,(W-40)/m);
    const x0=(W-cw*m)/2, y0=190;
    // 사물함
    const cnt={};
    S.placed.forEach(p=>{ cnt[p.slot]=(cnt[p.slot]||0)+1; });
    for(let k=0;k<m;k++){
      const c=cnt[k]||0;
      ctx.fillStyle=c===0?'#F3F4F6':c===1?'#DCEFE9':'#FCE7EB';
      ctx.strokeStyle=c>=2?'#BE123C':'#9CA3AF'; ctx.lineWidth=c>=2?2:1.2;
      ctx.fillRect(x0+k*cw+2,y0,cw-4,64); ctx.strokeRect(x0+k*cw+2,y0,cw-4,64);
      ctx.fillStyle='#374151'; ctx.font='bold 11px sans-serif'; ctx.textAlign='center';
      ctx.fillText(k, x0+k*cw+cw/2, y0+80);
      if(c){ ctx.fillStyle=c>=2?'#BE123C':'#0E9384'; ctx.font='bold 13px sans-serif';
        ctx.fillText(c+'명', x0+k*cw+cw/2, y0+38); }
    }
    // 배정 화살표(마지막 것)
    const last=S.placed[S.placed.length-1];
    if(last){
      ctx.fillStyle='#111827'; ctx.font='bold 14px sans-serif'; ctx.textAlign='center';
      ctx.fillText(last.id+' % '+m+' = '+last.slot, W/2, 60);
      ctx.strokeStyle='#B45309'; ctx.lineWidth=1.8;
      ctx.beginPath(); ctx.moveTo(W/2,70); ctx.lineTo(x0+last.slot*cw+cw/2, y0-8); ctx.stroke();
    } else {
      ctx.fillStyle='#6B7280'; ctx.font='12px sans-serif'; ctx.textAlign='center';
      ctx.fillText('학번 카드를 눌러 사물함에 배정해 보세요', W/2, 60);
    }
    const used=Object.keys(cnt).length, coll=Object.values(cnt).filter(c=>c>=2).length;
    $('#hhout').innerHTML =
      `배정 ${S.placed.length}명 · 쓰인 사물함 <b>${used} / ${m}</b> · 충돌 칸 <b style="color:${coll?'#BE123C':'#0E9384'}">${coll}개</b><br>`
      + (m%2===0 && S.placed.length>=6 && used<=Math.ceil(m/2)
        ? `<b style="color:#BE123C">몰림 발생!</b> 학번이 짝수뿐이라 짝수 m 으로는 홀수 칸이 텅 빕니다.`
        : `<span style="color:#6B7280;font-size:12.5px">m 을 8 ↔ 7 로 바꿔 같은 학번들을 다시 배정해 비교하세요.</span>`);
  }
  function cards(){
    $('#hhCards').innerHTML='학번: '+IDS.map(v=>{
      const usedId=S.placed.some(p=>p.id===v);
      return `<button class="b ${usedId?'g':'t'} sm" data-v="${v}" ${usedId?'disabled':''}
        style="font-size:11px;padding:4px 7px">${v}</button>`; }).join('')
      + ' <button class="b g sm" id="hhRst">다시</button>';
    $('#hhCards').querySelectorAll('[data-v]').forEach(bt=>bt.onclick=()=>{
      const id=+bt.dataset.v, m=+$('#hhM').value;
      S.placed.push({id, slot:id%m}); cards(); draw(); });
    const r=$('#hhRst'); if(r) r.onclick=()=>{ S.placed=[]; cards(); draw(); };
  }
  $('#hhM').onchange=()=>{ const m=+$('#hhM').value;
    S.placed=S.placed.map(p=>({id:p.id, slot:p.id%m})); draw(); };
  cards(); draw();
  inquiry(root,{ id:'hh', title:'나머지와 해시 — 사물함은 어떻게 정할까',
    q:['같은 학번들을 m = 10 · 8 · 7 · 11 로 각각 배정하고, 매번 「지금 값 기록」을 누르세요.',
       '「쓰인 사물함」 열을 비교해, <b>어떤 m 에서 몰림이 생기는지</b>와 학번들의 공통점(짝수)을 연결하세요.',
       'm 이 짝수이고 학번이 모두 짝수면 나머지가 왜 짝수만 나오는지 <b>짝수 − 짝수 = 짝수</b>로 손으로 설명하고, 소수 m 이 유리한 이유를 적으세요.'],
    cols:['m','배정 인원','쓰인 사물함','충돌 칸','골고루?'],
    hint:'힌트 — 학번 = m×몫 + 나머지. 학번과 m 이 모두 2의 배수면 나머지도 2의 배수일 수밖에 없습니다.',
    read:()=>{ const m=+$('#hhM').value;
      const cnt={}; S.placed.forEach(p=>{ cnt[p.id%m]=(cnt[p.id%m]||0)+1; });
      const used=Object.keys(cnt).length, coll=Object.values(cnt).filter(c=>c>=2).length;
      if(!S.placed.length) return null;
      return [m, S.placed.length, used+'/'+m, coll, used>=Math.min(S.placed.length,m)*0.8?'골고루':'몰림']; } });
}

/* ═══════════════ 중학교 2학년 승격 (LAB 71~76) ═══════════════
   카탈로그의 중2 24종 가운데 완전 중복 2종(일차부등식(예산)=LAB 69 ·
   연립 해=교점은 「해의 개수」와 동일 내용)을 정리하고 22종을 올린다.
   모두 직접 조작과 탐구 보고서를 갖춘다. */

/* ---------- LAB 71 순환소수와 부동소수점 ---------- */
function fracDecDemo(root){
  root.innerHTML=`<div class="row"><div class="col">
      <canvas id="fd1" width="380" height="280"></canvas>
      <div class="ctl" style="display:flex;gap:6px;flex-wrap:wrap;margin-top:8px" id="fdCards"></div>
    </div>
    <div class="col">
      <div class="ctl"><button class="b t" id="fdStep">한 자리 더 나누기</button>
        <button class="b g sm" id="fdRst">처음부터</button></div>
      <div class="out" id="fdout"></div>
      <div class="note" style="margin-top:12px">어떤 분수는 소수가 끝나고 어떤 분수는 영원히 돕니다 — 갈림길은 분수의 어디에 있을까요? 컴퓨터의 0.1+0.2 문제와도 이어집니다.</div>
    </div></div>`;
  const cv=$('#fd1'),ctx=cv.getContext('2d'),W=380,H=280;
  const FR=[[1,3],[1,4],[1,6],[1,7],[1,8],[3,11],[1,10],[7,20]];
  const S={ p:1, q:3, digs:[], rem:1 };
  function pf(n){const f={};let m=n,d=2;while(d*d<=m){while(m%d===0){f[d]=(f[d]||0)+1;m/=d;}d++;}if(m>1)f[m]=(f[m]||0)+1;return f;}
  function only25(n){const f=pf(n);return Object.keys(f).every(k=>k==='2'||k==='5');}
  function reset(){ S.digs=[]; S.rem=S.p%S.q; S.seen={}; S.loop=false; draw(); }
  function step(){
    if(S.rem===0) return;
    S.rem*=10; S.digs.push(Math.floor(S.rem/S.q)); S.rem%=S.q; if(S.seen&&S.seen[S.rem]) S.loop=true; if(S.seen) S.seen[S.rem]=1;
    if(S.digs.length>24) S.digs=S.digs.slice(0,24);
    draw();
  }
  function draw(){
    ctx.clearRect(0,0,W,H); ctx.fillStyle='#fff'; ctx.fillRect(0,0,W,H);
    ctx.fillStyle='#111827'; ctx.font='bold 22px sans-serif'; ctx.textAlign='center';
    const dec='0.'+S.digs.join('')+(S.rem!==0?'…':'');
    ctx.fillText(S.p+'/'+S.q+' = '+(S.digs.length?dec:'?'), W/2, 46);
    // 나머지의 행로 — 순환의 정체
    ctx.font='11px sans-serif'; ctx.fillStyle='#6B7280';
    ctx.fillText('나눗셈에서 나온 나머지들 (같은 나머지가 다시 나오면 그때부터 순환)', W/2, 84);
    let r=S.p%S.q; const rems=[r];
    for(let i=0;i<S.digs.length;i++){ r=(r*10)%S.q; rems.push(r); }
    const seen={};
    rems.forEach((v,i)=>{
      const x=30+(i%11)*30, y=110+Math.floor(i/11)*36;
      const dup=seen[v]!==undefined && v!==0;
      ctx.fillStyle=dup?'#FCE7EB':'#EFF4FF';
      ctx.strokeStyle=dup?'#BE123C':'#2563EB'; ctx.lineWidth=dup?2:1.2;
      ctx.beginPath(); ctx.arc(x,y,13,0,7); ctx.fill(); ctx.stroke();
      ctx.fillStyle='#111827'; ctx.font='bold 11px sans-serif';
      ctx.fillText(v,x,y+4);
      if(seen[v]===undefined) seen[v]=i;
    });
    const fin=only25(S.q);
    $('#fdout').innerHTML =
      `분모 ${S.q} = ${Object.entries(pf(S.q)).map(([p,e])=>p+(e>1?'^'+e:'')).join(' × ')||S.q}
       → <b style="color:${fin?'#0E9384':'#B45309'}">${fin?'2·5 뿐 — 유한소수':'다른 소인수 — 순환소수'}</b><br>`
      + (S.rem===0
        ? `<b style="color:#0E9384">나머지 0 — 나눗셈이 끝났습니다 (유한).</b>`
        : (S.loop?`<b style="color:#B45309">같은 나머지가 다시 나왔습니다 — 여기부터 순환 확정!</b> 나머지는 ${S.q}가지뿐이라 반드시 겹칩니다.`:`같은 나머지(빨간 원)가 다시 나오면 <b>그 뒤는 영원히 반복</b>됩니다 — 나머지는 ${S.q}가지뿐이라 반드시 겹칩니다.`))
      + `<br><br><b>컴퓨터 함정</b> — 0.1 + 0.2 = <span class="mono">${(0.1+0.2)}</span>
        <span style="color:#BE123C">(0.3 이 아닙니다!)</span><br>
        <span style="color:#6B7280;font-size:12.5px">이진법에서 1/10 은 분모에 5 가 있어 순환 — 유한 자리로 자르니 오차가 남습니다.</span>`;
  }
  function cards(){
    $('#fdCards').innerHTML='분수 고르기: '+FR.map(f=>
      `<button class="b ${f[0]===S.p&&f[1]===S.q?'t':'g'} sm" data-p="${f[0]}" data-q="${f[1]}">${f[0]}/${f[1]}</button>`).join('');
    $('#fdCards').querySelectorAll('[data-p]').forEach(bt=>bt.onclick=()=>{
      S.p=+bt.dataset.p; S.q=+bt.dataset.q; cards(); reset(); });
  }
  $('#fdStep').onclick=step; $('#fdRst').onclick=reset;
  cards(); reset();
  inquiry(root,{ id:'fd', title:'순환소수와 부동소수점 — 왜 0.1+0.2 는 0.3 이 아닐까',
    q:['여덟 분수를 모두 골라 끝까지(또는 순환이 보일 때까지) 나눠 보고 기록하세요.',
       '「분모의 소인수」 열과 「유한/순환」 열을 견주어 규칙을 찾으세요.',
       '나머지가 반드시 다시 겹치는 이유(비둘기집)를 손으로 설명하고, 컴퓨터(이진법)에서 1/10 이 순환인 이유도 적으세요.'],
    cols:['분수','분모의 소인수','유한/순환','순환마디','마디 길이'],
    hint:'힌트 — 나머지는 0 ~ (분모−1) 의 가짓수뿐입니다. 유한하지 않으면 반드시 재방문합니다.',
    read:()=>{ if(!S.digs.length) return null;
      const f=pf(S.q), fin=only25(S.q);
      // 순환마디 찾기
      let period='—';
      if(!fin){ let r=S.p%S.q; const idx={}; let ds=''; let i=0;
        while(r!==0 && idx[r]===undefined && i<30){ idx[r]=i; r*=10; ds+=Math.floor(r/S.q); r%=S.q; i++; }
        if(r!==0) period=ds.slice(idx[r]);
      }
      return [S.p+'/'+S.q, Object.keys(f).join('·')||'—', fin?'유한':'순환',
              period, period==='—'?'—':period.length]; } });
}

/* ---------- LAB 72 순환마디로 분수 복원하기 ---------- */
function recurDemo(root){
  root.innerHTML=`<div class="row"><div class="col">
      <canvas id="rc1" width="380" height="270"></canvas>
      <div class="ctl" style="display:flex;gap:6px;flex-wrap:wrap;margin-top:8px">
        <button class="b t" id="rcX10">양변에 ×10</button>
        <button class="b t sm" id="rcSub">두 식 빼기</button>
        <button class="b g sm" id="rcRst">다시</button>
      </div>
      <div class="ctl" style="display:flex;gap:6px;flex-wrap:wrap;margin-top:6px" id="rcCards"></div>
    </div>
    <div class="col">
      <div class="out" id="rcout"></div>
      <div class="note" style="margin-top:12px">×10 을 <b>마디 길이만큼</b> 거듭해야 소수점 아래가
      원래 식과 <b>완전히 겹칩니다</b> — 그때 빼야 무한 꼬리가 통째로 사라집니다.
      덜 곱하고 빼면 꼬리가 어긋나 남습니다.</div>
    </div></div>`;
  const cv=$('#rc1'),ctx=cv.getContext('2d'),W=380,H=270;
  const CASES=[{s:'0.7',mad:'7'},{s:'0.24',mad:'24'},{s:'0.135',mad:'135'},{s:'0.83',mad:'3',pre:'8'}];
  const S={ ci:1, mul:0, sub:null };
  function cur(){ return CASES[S.ci]; }
  function digitsOf(shift){
    // x × 10^shift 의 소수 표현 문자열 (앞 12자리)
    const c=cur(), pre=c.pre||'', mad=c.mad;
    let all=pre+mad.repeat(12);
    const ip=all.slice(0,shift)||'0';
    const fp=all.slice(shift, shift+12);
    return (shift? String(+ip||ip):'0')+'.'+fp+'…';
  }
  function period(){ return cur().mad.length + (cur().pre?cur().pre.length:0); }
  function aligned(){
    const c=cur();
    if(c.pre) return S.mul===c.pre.length+c.mad.length;       // 혼순환은 마디+앞자리
    return S.mul===c.mad.length;
  }
  function draw(){
    const c=cur();
    ctx.clearRect(0,0,W,H); ctx.fillStyle='#fff'; ctx.fillRect(0,0,W,H);
    ctx.font='bold 17px monospace'; ctx.textAlign='left';
    ctx.fillStyle='#111827';
    ctx.fillText('   x = '+digitsOf(0), 30, 60);
    if(S.mul>0){
      ctx.fillStyle='#2563EB';
      ctx.fillText(String(Math.pow(10,S.mul)).padStart(4,' ')+'x = '+digitsOf(S.mul), 30, 100);
      // 소수점 아래 정렬 여부 표시
      const ok=aligned()||(S.mul>0 && !c.pre && S.mul%c.mad.length===0);
      ctx.fillStyle=ok?'#0E9384':'#BE123C'; ctx.font='bold 12px sans-serif';
      ctx.fillText(ok?'소수점 아래가 완전히 겹칩니다 — 이제 빼세요!':'소수점 아래가 어긋나 있습니다 — 더 곱하거나 다시.', 30, 130);
    }
    if(S.sub){
      ctx.fillStyle='#111827'; ctx.font='bold 17px monospace';
      ctx.fillText(S.sub.line, 30, 170);
      ctx.fillStyle='#0E9384'; ctx.font='bold 19px sans-serif';
      ctx.fillText('x = '+S.sub.frac, 30, 210);
    }
    $('#rcout').innerHTML =
      `x = ${c.s.slice(0,2)}<span style="text-decoration:overline">${c.pre?c.mad:c.s.slice(2)}</span>${c.pre?' (혼순환)':''} 꼴<br>`
      + `지금까지 ×10 을 <b>${S.mul}번</b> — 10<sup>${S.mul}</sup>x<br>`
      + (S.sub
        ? `<b style="color:#0E9384">복원 완료:</b> <span class="mono">x = ${S.sub.frac}</span> — 검산 ${S.sub.chk}`
        : `<span style="color:#6B7280;font-size:12.5px">마디 길이는 ${c.mad.length} — 몇 번 곱해야 겹칠까요?</span>`);
  }
  function doSub(){
    const c=cur(); if(S.mul===0) return;
    const p=Math.pow(10,S.mul);
    // 정렬됐을 때만 깨끗이 떨어진다
    const okPure=!c.pre && S.mul%c.mad.length===0;
    const okMix=c.pre && S.mul===c.pre.length+c.mad.length;
    if(okPure){
      const num=+(c.mad.repeat(S.mul/c.mad.length)), den=p-1;
      const g=gcd(num,den);
      S.sub={line:(p+'x − x = '+num), frac:(num/g)+'/'+(den/g),
        chk:((num/den).toFixed(6))};
    } else if(okMix){
      const pl=c.pre.length, small=Math.pow(10,pl);
      const big=+(c.pre+c.mad), sm=+c.pre;
      const num=big-sm, den=p-small;
      const g=gcd(num,den);
      S.sub={line:(p+'x − '+small+'x = '+num), frac:(num/g)+'/'+(den/g), chk:(num/den).toFixed(6)};
    } else {
      S.sub={line:'꼬리가 어긋나 무한소수가 남습니다', frac:'실패 — 정렬부터', chk:''};
    }
    draw();
  }
  function gcd(a,b){ return b?gcd(b,a%b):a; }
  function cards(){
    $('#rcCards').innerHTML=CASES.map((c,i)=>
      `<button class="b ${i===S.ci?'t':'g'} sm" data-i="${i}">${c.s}${c.pre?'':''}…</button>`).join('');
    $('#rcCards').querySelectorAll('[data-i]').forEach(bt=>bt.onclick=()=>{
      S.ci=+bt.dataset.i; S.mul=0; S.sub=null; cards(); draw(); });
  }
  $('#rcX10').onclick=()=>{ if(S.mul<6){ S.mul++; S.sub=null; draw(); } };
  $('#rcSub').onclick=doSub;
  $('#rcRst').onclick=()=>{ S.mul=0; S.sub=null; draw(); };
  cards(); draw();
  inquiry(root,{ id:'rc', title:'순환마디로 분수 복원하기 — ×10 은 몇 번?',
    q:['네 순환소수를 모두 분수로 복원하며 기록하세요. 일부러 덜 곱하고 빼서 실패한 줄도 하나 넣으세요.',
       '「마디 길이」 열과 「×10 횟수」 열을 견주어, 성공하는 횟수의 규칙을 찾으세요.',
       '왜 마디 길이만큼 곱해야 꼬리가 사라지는지 <b>소수점 아래 자릿수 정렬</b>로 손으로 설명하세요. 0.9̄ = 1 인 이유도 같은 방법으로 적으세요.'],
    cols:['순환소수','마디','마디 길이','×10 횟수','복원한 분수','성공?'],
    hint:'힌트 — 뺄셈으로 무한 꼬리를 지우려면 두 식의 꼬리가 같아야 합니다. 같아지는 조건이 곧 자릿수 정렬입니다.',
    read:()=>{ const c=cur();
      return [c.s+'…', c.mad, c.mad.length, S.mul,
              S.sub?S.sub.frac:'—', S.sub&&S.sub.chk?'성공':'—']; } });
}

/* ---------- LAB 73 지수법칙 — 종이 접기 ---------- */
function foldDemo(root){
  root.innerHTML=`<div class="row"><div class="col">
      <canvas id="fo1" width="380" height="290"></canvas>
      <div class="ctl" style="display:flex;gap:6px;flex-wrap:wrap;margin-top:8px">
        <button class="b t" id="foGo">반으로 접기</button>
        <button class="b g sm" id="foRst">펴기</button>
      </div>
    </div>
    <div class="col">
      <div class="out" id="foout"></div>
      <div class="note" style="margin-top:12px">접을 때마다 두께에 무슨 일이 벌어지나요? 더하기로 자라는 것과 어떻게 다른가요?</div>
    </div></div>`;
  const cv=$('#fo1'),ctx=cv.getContext('2d'),W=380,H=290;
  const T0=0.1;                                       // mm
  const MARK=[[0.5,'손가락 (5mm)'],[210,'냉장고 (2.1m)'],[63e3,'63빌딩'],[8.8e6,'에베레스트'],[4e8,'국제우주정거장 (400km)'],[3.84e11,'달 (38만 km)']];
  const S={ n:0 };
  function draw(){
    const t=T0*Math.pow(2,S.n);                       // mm
    ctx.clearRect(0,0,W,H); ctx.fillStyle='#fff'; ctx.fillRect(0,0,W,H);
    // 종이 그림 — 접을수록 좁고 두껍게
    const wPaper=Math.max(18,150/Math.pow(1.35,Math.min(S.n,12)));
    const hPaper=Math.min(120,4+S.n*5);
    ctx.fillStyle='#FFF8EB'; ctx.strokeStyle='#B45309'; ctx.lineWidth=1.6;
    ctx.fillRect(60-wPaper/2,150-hPaper,wPaper,hPaper);
    ctx.strokeRect(60-wPaper/2,150-hPaper,wPaper,hPaper);
    ctx.fillStyle='#374151'; ctx.font='11px sans-serif'; ctx.textAlign='center';
    ctx.fillText(S.n+'번 접음', 60, 170);
    // 로그 눈금 사다리
    const lx=150, ly0=250, ly1=30;
    const yOf=mm=>{ const lo=Math.log10(T0), hi=Math.log10(4e11);
      return ly0-(ly0-ly1)*(Math.log10(Math.max(mm,T0))-lo)/(hi-lo); };
    ctx.strokeStyle='#D1D5DB'; ctx.lineWidth=2;
    ctx.beginPath(); ctx.moveTo(lx,ly0); ctx.lineTo(lx,ly1); ctx.stroke();
    MARK.forEach(m=>{
      const y=yOf(m[0]);
      ctx.strokeStyle='#9CA3AF'; ctx.lineWidth=1;
      ctx.beginPath(); ctx.moveTo(lx-5,y); ctx.lineTo(lx+5,y); ctx.stroke();
      ctx.fillStyle='#6B7280'; ctx.font='10.5px sans-serif'; ctx.textAlign='left';
      ctx.fillText(m[1], lx+10, y+4);
    });
    const y=yOf(t);
    ctx.fillStyle='#BE123C';
    ctx.beginPath(); ctx.moveTo(lx-16,y); ctx.lineTo(lx-4,y-6); ctx.lineTo(lx-4,y+6); ctx.closePath(); ctx.fill();
    ctx.font='bold 11px sans-serif'; ctx.textAlign='right';
    const disp=t<10?t.toFixed(1)+'mm':t<1e4?(t/10).toFixed(1)+'cm':t<1e6?(t/1000).toFixed(1)+'m':(t/1e6).toFixed(1)+'km';
    ctx.fillText(disp, lx-20, y+4);
    $('#foout').innerHTML =
      `두께 = 0.1mm × 2<sup>${S.n}</sup> = <b>${disp}</b><br>`
      + `<span class="mono">2^${S.n} = ${Math.pow(2,S.n)<1e15?Math.pow(2,S.n).toLocaleString():Math.pow(2,S.n).toExponential(2)}</span><br>`
      + (t>=3.84e11 ? `<b style="color:#0E9384">달에 닿았습니다! ${S.n}번.</b>`
        : `<span style="color:#6B7280;font-size:12.5px">달까지는 몇 번일까요? 접기 전에 예상해 보세요.</span>`)
      + `<br><span style="color:#6B7280;font-size:12.5px">만약 매번 0.1mm 씩 더하기였다면 지금 ${(T0*(S.n+1)).toFixed(1)}mm — 곱하기와의 차이.</span>`;
  }
  $('#foGo').onclick=()=>{ if(S.n<50){ S.n++; draw(); } };
  $('#foRst').onclick=()=>{ S.n=0; draw(); };
  draw();
  inquiry(root,{ id:'fo', title:'지수법칙 — 종이 접기의 두께',
    q:['한 번 접을 때마다 기록하며 10번까지 가 보세요. 그다음은 5번씩 건너뛰며 기록해도 됩니다.',
       '「2ⁿ」 열에서 n 이 10 커질 때 값이 약 몇 배가 되는지 찾으세요.',
       '2⁵ × 2³ = 2⁸ 이 되는 이유(접기 5번 뒤 3번 더)를 손으로 설명하고, 달까지 몇 번인지 답과 함께 적으세요.'],
    cols:['접은 횟수 n','2ⁿ','두께','더하기였다면','비교'],
    hint:'힌트 — 접기를 이어서 하는 것이 지수의 곱 aᵐ×aⁿ = aᵐ⁺ⁿ 입니다. 지수끼리는 “더하기”가 되는 이유를 접기로 말해 보세요.',
    read:()=>{ const t=T0*Math.pow(2,S.n);
      const disp=t<10?t.toFixed(1)+'mm':t<1e4?(t/10).toFixed(1)+'cm':t<1e6?(t/1000).toFixed(1)+'m':(t/1e6).toFixed(1)+'km';
      return [S.n, Math.pow(2,S.n)<1e12?Math.pow(2,S.n).toLocaleString():Math.pow(2,S.n).toExponential(1),
              disp, (T0*(S.n+1)).toFixed(1)+'mm', S.n?('×'+(t/(T0*(S.n+1))).toExponential(1)):'—']; } });
}

/* ---------- LAB 53 곱셈공식의 넓이 그림 ---------- */
function sqAreaDemo(root){
  root.innerHTML=`<div class="row"><div class="col">
      <canvas id="sq1" width="380" height="300"></canvas>
      <div class="note" style="margin-top:8px"><b>a·b 경계(주황 손잡이)를 끌어</b>
      두 길이를 바꾸고, 조각을 눌러 넓이를 확인하세요.</div>
    </div>
    <div class="col">
      <label class="ctl">무엇을 확인할까
        <select id="sqM" style="width:100%;padding:7px 9px;border:1px solid #E5E7EB;border-radius:8px;font:inherit">
          <option value="all">(a+b)² — 네 조각 모두</option>
          <option value="wrong">a² + b² 만 — 함정 확인</option></select></label>
      <div class="out" id="sqout"></div>
      <div class="note" style="margin-top:12px">(a+b)² 은 a²+b² 과 같을까요? 그림의 조각들을 세어 판정해 보세요.</div>
    </div></div>`;
  const cv=$('#sq1'),ctx=cv.getContext('2d'),W=380,H=300;
  const S={ a:7, b:4 };
  const OX=60, OY=40, SC=16;
  function draw(){
    const mode=$('#sqM').value, a=S.a, b=S.b, T=(a+b)*SC;
    ctx.clearRect(0,0,W,H); ctx.fillStyle='#fff'; ctx.fillRect(0,0,W,H);
    const px=OX, py=OY;
    // 네 조각
    const pieces=[
      {x:0,y:b,w:a,h:a,col:'#2563EB',t:'a²',on:true},
      {x:a,y:0,w:b,h:b,col:'#0E9384',t:'b²',on:true},
      {x:a,y:b,w:b,h:a,col:'#B45309',t:'ab',on:mode==='all'},
      {x:0,y:0,w:a,h:b,col:'#B45309',t:'ab',on:mode==='all'}
    ];
    pieces.forEach(p=>{
      ctx.globalAlpha=p.on?.28:.05; ctx.fillStyle=p.col;
      ctx.fillRect(px+p.x*SC, py+p.y*SC, p.w*SC, p.h*SC); ctx.globalAlpha=1;
      ctx.strokeStyle=p.col; ctx.lineWidth=p.on?1.8:1; ctx.setLineDash(p.on?[]:[4,3]);
      ctx.strokeRect(px+p.x*SC, py+p.y*SC, p.w*SC, p.h*SC); ctx.setLineDash([]);
      ctx.fillStyle=p.on?'#111827':'#B9BEC7'; ctx.font='bold 13px sans-serif'; ctx.textAlign='center';
      ctx.fillText(p.t+(p.on?' = '+(p.t==='a²'?a*a:p.t==='b²'?b*b:a*b):''),
        px+(p.x+p.w/2)*SC, py+(p.y+p.h/2)*SC+5);
    });
    // 전체 틀과 라벨
    ctx.strokeStyle='#111827'; ctx.lineWidth=2.2; ctx.strokeRect(px,py,T,T);
    ctx.fillStyle='#374151'; ctx.font='bold 12px sans-serif'; ctx.textAlign='center';
    ctx.fillText('a = '+a, px+a*SC/2, py+T+18);
    ctx.fillText('b = '+b, px+a*SC+b*SC/2, py+T+18);
    ctx.save(); ctx.translate(px-16, py+T-a*SC/2); ctx.rotate(-Math.PI/2);
    ctx.fillText('a', 0, 0); ctx.restore();
    ctx.save(); ctx.translate(px-16, py+b*SC/2); ctx.rotate(-Math.PI/2);
    ctx.fillText('b', 0, 0); ctx.restore();
    // 경계 손잡이 (아래 변 위 a·b 의 경계)
    handle(ctx, px+a*SC, py+T, '#B45309','');
    const full=(a+b)*(a+b), wrong=a*a+b*b;
    $('#sqout').innerHTML =
      `<span class="mono">(a+b)² = (${a}+${b})² = <b>${full}</b></span><br>`
      + ($('#sqM').value==='wrong'
        ? `색칠된 두 조각: a² + b² = ${a*a} + ${b*b} = <b style="color:#BE123C">${wrong}</b><br>
           <b style="color:#BE123C">${full-wrong} 이 모자랍니다</b> — 비어 있는 두 조각(ab 둘)이 바로 그 차이 = 2ab = ${2*a*b}.`
        : `a² + 2ab + b² = ${a*a} + ${2*a*b} + ${b*b} = <b style="color:#0E9384">${full}</b> — 그림과 정확히 일치.`);
  }
  dragOn(cv,{
    hit:p=>{
      const T=(S.a+S.b)*SC;
      if(Math.hypot(p.x-(OX+S.a*SC), p.y-(OY+T))<18) return 'ab';
      return null;
    },
    move:(h,p)=>{
      const total=S.a+S.b;
      let a=Math.round((p.x-OX)/SC);
      a=Math.max(2,Math.min(total-2,a));
      S.a=a; S.b=total-a; draw();
    }
  });
  $('#sqM').onchange=draw;
  draw();
  inquiry(root,{ id:'sq', title:'곱셈공식의 넓이 그림 — (a+b)² 은 왜 a²+b² 이 아닐까',
    q:['경계를 끌어 (a, b) 를 여러 쌍으로 바꾸며 기록하세요 (6줄 이상).',
       '「(a+b)² − (a²+b²)」 열이 무엇의 두 배인지 찾으세요.',
       '(a−b)² = a² − 2ab + b² 도 같은 그림에서 유도할 수 있는지, 큰 정사각형에서 무엇을 빼고 무엇이 겹치는지 손으로 그려 설명하세요.'],
    cols:['a','b','(a+b)²','a²+b²','차이','2ab'],
    hint:'힌트 — 식의 전개는 넓이 쪼개기입니다. 항 하나하나가 그림의 조각 하나하나와 짝을 이룹니다.',
    read:()=>[S.a,S.b,(S.a+S.b)*(S.a+S.b),S.a*S.a+S.b*S.b,
              (S.a+S.b)*(S.a+S.b)-S.a*S.a-S.b*S.b, 2*S.a*S.b] });
}

/* ---------- LAB 74 부등호가 뒤집히는 순간 ---------- */
function flipDemo(root){
  root.innerHTML=`<div class="row"><div class="col">
      <canvas id="fl1" width="380" height="280"></canvas>
      <div class="note" style="margin-top:8px">위 수직선의 <b>a·b(파랑·초록)</b> 를 끌고,
      아래의 <b>배율 k(주황)</b> 를 끌어 보세요 — k 가 음수로 넘어가는 순간을 잡으세요.</div>
    </div>
    <div class="col">
      <div class="out" id="flout"></div>
      <div class="note" style="margin-top:12px">곱하는 수에 따라 수직선에 어떤 일이 벌어지나요? 순서가 위험해지는 순간을 찾아보세요.</div>
    </div></div>`;
  const cv=$('#fl1'),ctx=cv.getContext('2d'),W=380,H=280;
  const S={ a:2, b:5, k:1 };
  const Y1=80, Y2=190, KY=248;
  const X=v=>W/2+v*14, invX=px=>(px-W/2)/14;
  function line(y,lab){
    ctx.strokeStyle='#9CA3AF'; ctx.lineWidth=1.4;
    ctx.beginPath(); ctx.moveTo(20,y); ctx.lineTo(W-20,y); ctx.stroke();
    for(let v=-12;v<=12;v+=3){
      ctx.strokeStyle=v===0?'#374151':'#E5E7EB'; ctx.lineWidth=v===0?1.8:1;
      ctx.beginPath(); ctx.moveTo(X(v),y-5); ctx.lineTo(X(v),y+5); ctx.stroke();
      if(v===0){ ctx.fillStyle='#374151'; ctx.font='10px sans-serif'; ctx.textAlign='center';
        ctx.fillText('0', X(0), y+18); }
    }
    ctx.fillStyle='#6B7280'; ctx.font='10.5px sans-serif'; ctx.textAlign='left';
    ctx.fillText(lab, 20, y-14);
  }
  function draw(){
    ctx.clearRect(0,0,W,H); ctx.fillStyle='#fff'; ctx.fillRect(0,0,W,H);
    line(Y1,'곱하기 전 — a 와 b');
    line(Y2,'곱한 뒤 — ka 와 kb');
    const ka=S.k*S.a, kb=S.k*S.b;
    // 대응 화살표
    ctx.strokeStyle='#D1D5DB'; ctx.lineWidth=1.1; ctx.setLineDash([3,3]);
    [[S.a,ka],[S.b,kb]].forEach(q=>{
      ctx.beginPath(); ctx.moveTo(X(q[0]),Y1+8); ctx.lineTo(X(Math.max(-12,Math.min(12,q[1]))),Y2-8); ctx.stroke(); });
    ctx.setLineDash([]);
    handle(ctx, X(S.a), Y1, '#2563EB', 'a='+S.a);
    handle(ctx, X(S.b), Y1, '#0E9384', 'b='+S.b);
    [[ka,'#2563EB','ka'],[kb,'#0E9384','kb']].forEach(q=>{
      const px=X(Math.max(-12,Math.min(12,q[0])));
      ctx.fillStyle=q[1]; ctx.beginPath(); ctx.arc(px,Y2,6,0,7); ctx.fill();
      ctx.font='bold 11px sans-serif'; ctx.textAlign='center';
      ctx.fillText(q[2]+'='+(Math.round(q[0]*10)/10), px, Y2+22);
    });
    // k 축
    ctx.strokeStyle='#D1D5DB'; ctx.lineWidth=2;
    ctx.beginPath(); ctx.moveTo(60,KY); ctx.lineTo(W-60,KY); ctx.stroke();
    const kx=W/2+S.k*30;
    ctx.fillStyle='#9CA3AF'; ctx.font='10px sans-serif'; ctx.textAlign='center';
    [-4,-2,0,2,4].forEach(v=>ctx.fillText(v, W/2+v*30, KY+16));
    handle(ctx, kx, KY, '#B45309', 'k = '+S.k);
    const before=S.a<S.b?'<':S.a>S.b?'>':'=';
    const after=ka<kb?'<':ka>kb?'>':'=';
    const flipped=before!==after&&before!=='='&&after!=='=';
    $('#flout').innerHTML =
      `곱하기 전: <span class="mono">a ${before} b</span> &nbsp;(${S.a} ${before} ${S.b})<br>`
      + `k = <b>${S.k}</b> 를 곱하면: <span class="mono">ka ${after} kb</span> &nbsp;(${Math.round(ka*10)/10} ${after} ${Math.round(kb*10)/10})<br>`
      + (S.k===0 ? `<b style="color:#B45309">k = 0 — 모두 0 이 되어 순서가 사라집니다. 그래서 0 은 곱할 수 없습니다.</b>`
        : flipped ? `<b style="color:#BE123C">순서가 뒤집혔습니다!</b> 음수 배는 0 중심의 반사 — 부등호도 함께 뒤집어야 합니다.`
        : `<b style="color:#0E9384">순서 유지</b> — 양수 배는 늘이기만 할 뿐 순서를 안 바꿉니다.`);
  }
  dragOn(cv,{
    hit:p=>{
      if(Math.abs(p.y-KY)<18) return 'k';
      if(Math.abs(p.y-Y1)<18) return Math.abs(p.x-X(S.a))<=Math.abs(p.x-X(S.b))?'a':'b';
      return null;
    },
    move:(h,p)=>{
      if(h==='k') S.k=Math.max(-4,Math.min(4,Math.round((p.x-W/2)/30*2)/2));
      else { const v=Math.max(-10,Math.min(10,Math.round(invX(p.x))));
        if(h==='a') S.a=v; else S.b=v; }
      draw();
    }
  });
  draw();
  inquiry(root,{ id:'fl', title:'부등호가 뒤집히는 순간 — 음수 배는 반사다',
    q:['k 를 4 → 2 → 1 → 0.5 → −0.5 → −2 로 끌며 매번 기록하세요.',
       '「순서」 열이 바뀌는 것은 k 가 <b>어느 경계를 넘을 때</b>인지 찾으세요. k = 0 에서는 무슨 일이 생기나요?',
       '음수 배가 0 중심의 반사인 이유를 수직선 그림으로 손으로 설명하고, 그래서 −2x < 6 의 해가 x > −3 이 되는 과정을 적으세요.'],
    cols:['a','b','곱하기 전','k','ka','kb','곱한 뒤'],
    hint:'힌트 — 반사는 왼쪽·오른쪽을 통째로 맞바꿉니다. “더 오른쪽에 있다(크다)”는 관계 자체가 뒤집히는 것입니다.',
    read:()=>{ const ka=S.k*S.a, kb=S.k*S.b;
      const before=S.a<S.b?'a < b':S.a>S.b?'a > b':'a = b';
      const after=ka<kb?'ka < kb':ka>kb?'ka > kb':'ka = kb';
      return [S.a,S.b,before,S.k,Math.round(ka*10)/10,Math.round(kb*10)/10,after]; } });
}

/* ---------- LAB 75 연립방정식과 해의 개수 ---------- */
function sysDemo(root){
  root.innerHTML=`<div class="row"><div class="col">
      <canvas id="sy1" width="380" height="300"></canvas>
      <div class="note" style="margin-top:8px">각 직선의 <b>손잡이 두 개</b>(절편·기울기)를
      끌어 보세요. 두 직선을 <b>평행</b>하게, 그리고 <b>완전히 겹치게</b> 만들어 보세요.</div>
    </div>
    <div class="col">
      <div class="out" id="syout"></div>
      <div class="note" style="margin-top:12px">두 직선을 움직이면 해(교점)는 몇 가지 운명을 가질 수 있을까요? 모두 만들어 보세요.</div>
    </div></div>`;
  const cv=$('#sy1'),ctx=cv.getContext('2d'),W=380,H=300,P=34;
  const S={ l1:{m:1, c:-1}, l2:{m:-0.5, c:3} };
  const X=v=>W/2+v*17, Y=v=>H/2-v*17;
  const invX=px=>(px-W/2)/17, invY=py=>(H/2-py)/17;
  function draw(){
    ctx.clearRect(0,0,W,H); ctx.fillStyle='#fff'; ctx.fillRect(0,0,W,H);
    ctx.strokeStyle='#F1F3F6'; ctx.lineWidth=1;
    for(let v=-8;v<=8;v++){ ctx.beginPath(); ctx.moveTo(X(v),10); ctx.lineTo(X(v),H-10); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(24,Y(v)); ctx.lineTo(W-14,Y(v)); ctx.stroke(); }
    ctx.strokeStyle='#9CA3AF'; ctx.lineWidth=1.4;
    ctx.beginPath(); ctx.moveTo(X(-10),Y(0)); ctx.lineTo(X(10),Y(0)); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(X(0),Y(9)); ctx.lineTo(X(0),Y(-9)); ctx.stroke();
    const draw1=(L,col)=>{
      ctx.strokeStyle=col; ctx.lineWidth=2.4;
      ctx.beginPath(); ctx.moveTo(X(-10),Y(L.m*(-10)+L.c)); ctx.lineTo(X(10),Y(L.m*10+L.c)); ctx.stroke();
      handle(ctx, X(0), Y(L.c), col, '');
      handle(ctx, X(4), Y(L.m*4+L.c), col, '');
    };
    draw1(S.l1,'#2563EB'); draw1(S.l2,'#0E9384');
    const same=Math.abs(S.l1.m-S.l2.m)<0.03;
    const sameC=Math.abs(S.l1.c-S.l2.c)<0.25;
    if(!same){
      const x=(S.l2.c-S.l1.c)/(S.l1.m-S.l2.m), y=S.l1.m*x+S.l1.c;
      ctx.fillStyle='#BE123C'; ctx.beginPath(); ctx.arc(X(x),Y(y),6,0,7); ctx.fill();
      ctx.font='bold 11px sans-serif'; ctx.textAlign='left';
      ctx.fillText('('+x.toFixed(1)+', '+y.toFixed(1)+')', X(x)+9, Y(y)-8);
    }
    const f=L=>('y = '+(Math.round(L.m*10)/10)+'x '+(L.c>=0?'+ ':'− ')+Math.abs(Math.round(L.c*10)/10));
    $('#syout').innerHTML =
      `<span style="color:#2563EB" class="mono">${f(S.l1)}</span><br>
       <span style="color:#0E9384" class="mono">${f(S.l2)}</span><br><br>`
      + (!same
        ? `기울기가 달라 <b style="color:#BE123C">한 점에서 만납니다 — 해 1개</b> (빨간 점)`
        : sameC
        ? `기울기·절편 모두 같음 — <b style="color:#B45309">같은 직선, 해가 무수히 많습니다</b>`
        : `기울기만 같음 — <b style="color:#BE123C">평행, 해가 없습니다</b>. 아무리 늘여도 안 만납니다.`);
  }
  dragOn(cv,{
    hit:p=>{
      const c=[['1c',X(0),Y(S.l1.c)],['1m',X(4),Y(S.l1.m*4+S.l1.c)],
               ['2c',X(0),Y(S.l2.c)],['2m',X(4),Y(S.l2.m*4+S.l2.c)]];
      for(const q of c) if(Math.hypot(p.x-q[1],p.y-q[2])<15) return q[0];
      return null;
    },
    move:(h,p)=>{
      const L=h[0]==='1'?S.l1:S.l2;
      if(h[1]==='c') L.c=Math.round(invY(p.y)*4)/4;
      else L.m=Math.round((invY(p.y)-L.c)/4*10)/10;
      // 평행 스냅 — 기울기가 가까우면 딸깍 (반올림 격자 0.1 보다 넉넉하게)
      const o=h[0]==='1'?S.l2:S.l1;
      if(Math.abs(L.m-o.m)<0.15) L.m=o.m;
      draw();
    }
  });
  draw();
  inquiry(root,{ id:'sy', title:'연립방정식과 해의 개수 — 한 점 · 없음 · 무수히',
    q:['세 경우(한 점 · 평행 · 일치)를 각각 만들어 매번 기록하세요 (6줄 이상).',
       '「기울기가 같은가」와 「절편이 같은가」 두 열의 조합이 「해의 개수」를 어떻게 정하는지 표로 정리하세요.',
       '해가 없는 연립방정식을 식으로 하나 만들어 쓰고, 소거법으로 풀면 어떤 이상한 식(예: 0 = 3)이 나오는지 손으로 확인하세요.'],
    cols:['직선1','직선2','기울기 같나','절편 같나','해의 개수'],
    hint:'힌트 — “해가 있다”는 말은 “두 조건을 동시에 만족하는 점이 있다”는 말입니다. 그림에서 그 점은 무엇인가요?',
    read:()=>{ const same=Math.abs(S.l1.m-S.l2.m)<0.03, sameC=Math.abs(S.l1.c-S.l2.c)<0.25;
      const f=L=>('y='+(Math.round(L.m*10)/10)+'x'+(L.c>=0?'+':'−')+Math.abs(Math.round(L.c*10)/10));
      return [f(S.l1), f(S.l2), same?'같다':'다르다', sameC?'같다':'다르다',
              !same?'1개':sameC?'무수히':'없음']; } });
}

/* ---------- LAB 76 소거법 시뮬레이터 ---------- */
function elimDemo(root){
  root.innerHTML=`<div class="row"><div class="col">
      <canvas id="el1" width="380" height="240"></canvas>
      <div class="ctl" style="display:flex;gap:6px;flex-wrap:wrap;margin-top:8px">
        <button class="b t sm" id="el1x">① ×2</button>
        <button class="b t sm" id="el1x3">① ×3</button>
        <button class="b t sm" id="el2x">② ×2</button>
        <button class="b t sm" id="el2x3">② ×3</button>
        <button class="b t" id="elSub">① − ②</button>
        <button class="b t" id="elAdd">① + ②</button>
        <button class="b g sm" id="elRst">처음 식으로</button>
      </div>
    </div>
    <div class="col">
      <div class="out" id="elout"></div>
      <div class="note" style="margin-top:12px">문자 하나를 지우려면 어떤 준비가 필요할까요? 실패하는 시도부터 해 보세요.</div>
    </div></div>`;
  const cv=$('#el1'),ctx=cv.getContext('2d'),W=380,H=240;
  const ORIG=[{a:2,b:3,c:12},{a:3,b:-1,c:7}];       // ax + by = c
  let EQ, hist;
  function reset(){ EQ=[{...ORIG[0]},{...ORIG[1]}]; hist=['처음 식']; draw(); }
  const f=(e)=>`${e.a}x ${e.b>=0?'+ '+e.b:'− '+(-e.b)}y = ${e.c}`;
  function draw(){
    ctx.clearRect(0,0,W,H); ctx.fillStyle='#fff'; ctx.fillRect(0,0,W,H);
    ctx.font='bold 19px monospace'; ctx.textAlign='left';
    ctx.fillStyle='#2563EB'; ctx.fillText('①  '+f(EQ[0]), 40, 60);
    ctx.fillStyle='#0E9384'; ctx.fillText('②  '+f(EQ[1]), 40, 100);
    // 계수 정렬 표시
    const xa=Math.abs(EQ[0].a)===Math.abs(EQ[1].a), yb=Math.abs(EQ[0].b)===Math.abs(EQ[1].b);
    ctx.font='12px sans-serif'; ctx.fillStyle='#6B7280';
    ctx.fillText('x 계수 '+(xa?'정렬됨 ✓':'다름')+' · y 계수 '+(yb?'정렬됨 ✓':'다름'), 40, 132);
    ctx.fillStyle='#374151'; ctx.font='11px sans-serif';
    hist.slice(-4).forEach((h,i)=>ctx.fillText((hist.length-Math.min(4,hist.length)+i+1)+'. '+h, 40, 158+i*18));
    // 한 문자가 사라졌나?
    const solo=EQ.find(e=>e.a===0||e.b===0);
    $('#elout').innerHTML = solo
      ? `<b style="color:#0E9384">문자 하나가 사라졌습니다!</b><br>
         <span class="mono">${f(solo).replace('0x + ','').replace('0x − ','−').replace(' + 0y','').replace(' − 0y','')}</span>
         → ${solo.a===0? 'y = '+(solo.c/solo.b) : 'x = '+(solo.c/solo.a)}<br>
         <span style="color:#6B7280;font-size:12.5px">이 값을 원래 식에 대입하면 나머지 문자도 나옵니다. (답: x=3, y=2)</span>`
      : `계수를 맞춰 <b>①−②</b> 또는 <b>①+②</b>로 한 문자를 지우세요.<br>
         <span style="color:#6B7280;font-size:12.5px">지금 x 를 지우려면? ①×3, ②×2 뒤 빼기. y 를 지우려면? ②×3 뒤 더하기.</span>`;
  }
  function mul(i,k){ EQ[i].a*=k; EQ[i].b*=k; EQ[i].c*=k; hist.push('식'+(i+1)+' 전체에 ×'+k); draw(); }
  function comb(sign){
    EQ[0]={a:EQ[0].a+sign*EQ[1].a, b:EQ[0].b+sign*EQ[1].b, c:EQ[0].c+sign*EQ[1].c};
    hist.push('① '+(sign>0?'+':'−')+' ② 를 ① 자리에'); draw();
  }
  $('#el1x').onclick=()=>mul(0,2); $('#el1x3').onclick=()=>mul(0,3);
  $('#el2x').onclick=()=>mul(1,2); $('#el2x3').onclick=()=>mul(1,3);
  $('#elSub').onclick=()=>comb(-1); $('#elAdd').onclick=()=>comb(1);
  $('#elRst').onclick=reset;
  reset();
  inquiry(root,{ id:'el', title:'소거법 시뮬레이터 — 문자를 지우는 손놀림',
    q:['x 를 지우는 길과 y 를 지우는 길을 각각 찾아 기록하세요 (연산을 누를 때마다 기록).',
       '「무엇에 곱했나」 열을 보고, 곱하기가 우변까지 포함한 <b>식 전체</b>여야 하는 이유를 확인하세요.',
       '①×3, ②×2 로 x 계수를 6 으로 맞춘 과정을 손으로 쓰고, 최소공배수가 왜 등장하는지 설명하세요.'],
    cols:['식①','식②','한 일','x 계수 정렬','y 계수 정렬'],
    hint:'힌트 — 두 계수를 같게 만드는 가장 작은 수는 두 계수의 최소공배수입니다.',
    read:()=>[f(EQ[0]), f(EQ[1]), hist[hist.length-1],
              Math.abs(EQ[0].a)===Math.abs(EQ[1].a)?'정렬':'—',
              Math.abs(EQ[0].b)===Math.abs(EQ[1].b)?'정렬':'—'] });
}

/* ---------- LAB 77 기울기와 절편을 따로 움직이기 ---------- */
function slopeDemo(root){
  root.innerHTML=`<div class="row"><div class="col">
      <canvas id="sp1" width="380" height="300"></canvas>
      <div class="note" style="margin-top:8px"><b>y축 위의 점(파랑 = 절편)</b>과
      <b>직선 위의 점(주황 = 기울기)</b>을 따로 끌어 보세요.</div>
    </div>
    <div class="col">
      <div class="ctl"><button class="b g sm" id="spTrace">잔상 남기기 켜기/끄기</button></div>
      <div class="out" id="spout"></div>
      <div class="note" style="margin-top:12px">두 손잡이는 직선에게 각각 어떤 운동을 시키나요? 잔상을 켜고 두 운동을 구분해 보세요.</div>
    </div></div>`;
  const cv=$('#sp1'),ctx=cv.getContext('2d'),W=380,H=300;
  const S={ m:1, c:1, trace:false, ghosts:[] };
  const X=v=>W/2+v*17, Y=v=>H/2-v*17;
  const invY=py=>(H/2-py)/17;
  function draw(){
    ctx.clearRect(0,0,W,H); ctx.fillStyle='#fff'; ctx.fillRect(0,0,W,H);
    ctx.strokeStyle='#F1F3F6';
    for(let v=-8;v<=8;v++){ ctx.beginPath(); ctx.moveTo(X(v),10); ctx.lineTo(X(v),H-10); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(20,Y(v)); ctx.lineTo(W-14,Y(v)); ctx.stroke(); }
    ctx.strokeStyle='#9CA3AF'; ctx.lineWidth=1.4;
    ctx.beginPath(); ctx.moveTo(X(-11),Y(0)); ctx.lineTo(X(11),Y(0)); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(X(0),Y(9)); ctx.lineTo(X(0),Y(-9)); ctx.stroke();
    // 잔상
    S.ghosts.forEach(g=>{ ctx.strokeStyle='rgba(37,99,235,.12)'; ctx.lineWidth=1.6;
      ctx.beginPath(); ctx.moveTo(X(-11),Y(g.m*(-11)+g.c)); ctx.lineTo(X(11),Y(g.m*11+g.c)); ctx.stroke(); });
    // 본선
    ctx.strokeStyle='#2563EB'; ctx.lineWidth=2.6;
    ctx.beginPath(); ctx.moveTo(X(-11),Y(S.m*(-11)+S.c)); ctx.lineTo(X(11),Y(S.m*11+S.c)); ctx.stroke();
    // 기울기 계단 (1 가면 m 오르기)
    ctx.strokeStyle='#B45309'; ctx.lineWidth=1.6; ctx.setLineDash([3,3]);
    ctx.beginPath(); ctx.moveTo(X(2),Y(S.m*2+S.c)); ctx.lineTo(X(3),Y(S.m*2+S.c)); ctx.lineTo(X(3),Y(S.m*3+S.c)); ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle='#B45309'; ctx.font='10.5px sans-serif'; ctx.textAlign='left';
    ctx.fillText('1', (X(2)+X(3))/2-3, Y(S.m*2+S.c)+13);
    ctx.fillText(String(Math.round(S.m*10)/10), X(3)+5, (Y(S.m*2+S.c)+Y(S.m*3+S.c))/2+4);
    handle(ctx, X(0), Y(S.c), '#2563EB', 'b = '+(Math.round(S.c*10)/10));
    handle(ctx, X(4), Y(S.m*4+S.c), '#B45309', 'a = '+(Math.round(S.m*10)/10));
    $('#spout').innerHTML =
      `<span class="mono" style="font-size:17px">y = ${Math.round(S.m*10)/10}x ${S.c>=0?'+ ':'− '}${Math.abs(Math.round(S.c*10)/10)}</span><br>`
      + `기울기 a = <b>${Math.round(S.m*10)/10}</b> — 오른쪽으로 1 갈 때 <b>${Math.round(S.m*10)/10}</b> 만큼 오르내림<br>`
      + `y절편 b = <b>${Math.round(S.c*10)/10}</b> — y축과 만나는 자리<br>`
      + `<span style="color:#6B7280;font-size:12.5px">잔상을 켜고 한 손잡이만 움직여 보세요 — 회전과 평행이동이 갈립니다.</span>`;
  }
  dragOn(cv,{
    hit:p=>{
      if(Math.hypot(p.x-X(0),p.y-Y(S.c))<15) return 'c';
      if(Math.hypot(p.x-X(4),p.y-Y(S.m*4+S.c))<15) return 'm';
      return null;
    },
    move:(h,p)=>{
      if(S.trace && S.ghosts.length<40) S.ghosts.push({m:S.m,c:S.c});
      if(h==='c') S.c=Math.max(-7,Math.min(7,Math.round(invY(p.y)*4)/4));
      else S.m=Math.max(-3,Math.min(3,Math.round((invY(p.y)-S.c)/4*10)/10));
      draw();
    }
  });
  $('#spTrace').onclick=()=>{ S.trace=!S.trace; if(!S.trace) S.ghosts=[]; draw(); };
  draw();
  inquiry(root,{ id:'sp', title:'기울기와 절편 — 회전과 평행이동',
    q:['잔상을 켜고 절편만 움직인 경우와 기울기만 움직인 경우를 각각 만들어 기록하세요.',
       '기울기를 바꿀 때 <b>움직이지 않는 점</b>이 어디인지 찾으세요.',
       'a 가 “오른쪽으로 1 갈 때의 변화량”임을 계단 그림으로 손으로 설명하고, a < 0 이면 그래프가 어떻게 되는지도 적으세요.'],
    cols:['a','b','식','무엇을 움직였나','직선의 변화'],
    hint:'힌트 — 절편은 “어디서 출발하나”, 기울기는 “얼마나 가파르게 가나”입니다. 출발점과 방향은 서로 독립입니다.',
    read:()=>[Math.round(S.m*10)/10, Math.round(S.c*10)/10,
              'y='+(Math.round(S.m*10)/10)+'x'+(S.c>=0?'+':'−')+Math.abs(Math.round(S.c*10)/10),
              '—','—'] });
}

/* ---------- LAB 78 직선의 방정식 ↔ 그래프 왕복 ---------- */
function lineFitDemo(root){
  root.innerHTML=`<div class="row"><div class="col">
      <canvas id="lf1" width="380" height="300"></canvas>
      <div class="note" style="margin-top:8px">문제의 식을 읽고 <b>직선 위 두 점(주황)을 끌어</b>
      그 식의 그래프를 만드세요. 맞으면 초록으로 켜집니다.</div>
    </div>
    <div class="col">
      <div class="ctl"><button class="b t sm" id="lfNew">새 문제</button>
        <span class="mono" id="lfQ" style="font-size:17px;margin-left:8px"></span></div>
      <div class="out" id="lfout"></div>
      <div class="note" style="margin-top:12px">식 → 그래프의 요령: <b>절편 b 에 점 하나</b>,
      거기서 <b>오른쪽 1·위로 a</b> 가서 점 하나. 두 점이면 직선은 끝납니다.</div>
    </div></div>`;
  const cv=$('#lf1'),ctx=cv.getContext('2d'),W=380,H=300;
  const S={ p1:{x:-2,y:0}, p2:{x:3,y:2}, tm:1, tc:-1 };
  const X=v=>W/2+v*17, Y=v=>H/2-v*17;
  const inv=p=>({x:Math.round((p.x-W/2)/17*2)/2, y:Math.round((H/2-p.y)/17*2)/2});
  function newQ(){
    const ms=[-2,-1,-0.5,0.5,1,2], cs=[-4,-3,-2,-1,1,2,3,4];
    S.tm=ms[Math.floor(Math.random()*ms.length)];
    S.tc=cs[Math.floor(Math.random()*cs.length)];
    $('#lfQ').textContent='y = '+S.tm+'x '+(S.tc>=0?'+ ':'− ')+Math.abs(S.tc);
    draw();
  }
  function myLine(){
    const dx=S.p2.x-S.p1.x;
    if(Math.abs(dx)<0.01) return null;
    const m=(S.p2.y-S.p1.y)/dx, c=S.p1.y-m*S.p1.x;
    return {m:Math.round(m*100)/100, c:Math.round(c*100)/100};
  }
  function draw(){
    ctx.clearRect(0,0,W,H); ctx.fillStyle='#fff'; ctx.fillRect(0,0,W,H);
    ctx.strokeStyle='#F1F3F6';
    for(let v=-8;v<=8;v++){ ctx.beginPath(); ctx.moveTo(X(v),10); ctx.lineTo(X(v),H-10); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(20,Y(v)); ctx.lineTo(W-14,Y(v)); ctx.stroke(); }
    ctx.strokeStyle='#9CA3AF'; ctx.lineWidth=1.4;
    ctx.beginPath(); ctx.moveTo(X(-11),Y(0)); ctx.lineTo(X(11),Y(0)); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(X(0),Y(9)); ctx.lineTo(X(0),Y(-9)); ctx.stroke();
    const L=myLine();
    const ok=L && Math.abs(L.m-S.tm)<0.01 && Math.abs(L.c-S.tc)<0.01;
    if(L){
      ctx.strokeStyle=ok?'#0E9384':'#B45309'; ctx.lineWidth=2.6;
      ctx.beginPath(); ctx.moveTo(X(-11),Y(L.m*(-11)+L.c)); ctx.lineTo(X(11),Y(L.m*11+L.c)); ctx.stroke();
    }
    handle(ctx, X(S.p1.x), Y(S.p1.y), '#B45309','');
    handle(ctx, X(S.p2.x), Y(S.p2.y), '#B45309','');
    $('#lfout').innerHTML = !L
      ? `두 점이 세로로 겹쳤습니다 — 옆으로 벌려 주세요.`
      : (ok
        ? `<b style="color:#0E9384">정답! y = ${L.m}x ${L.c>=0?'+ ':'− '}${Math.abs(L.c)}</b><br>
           <span style="color:#6B7280;font-size:12.5px">「새 문제」로 다음 식에 도전하세요.</span>`
        : `지금 직선: <span class="mono">y = ${L.m}x ${L.c>=0?'+ ':'− '}${Math.abs(L.c)}</span><br>
           <span style="color:#B45309">목표 식과 ${Math.abs(L.m-S.tm)>0.01?'기울기':''}${Math.abs(L.m-S.tm)>0.01&&Math.abs(L.c-S.tc)>0.01?'·':''}${Math.abs(L.c-S.tc)>0.01?'절편':''}이 다릅니다.</span>`);
  }
  dragOn(cv,{
    hit:p=>{
      if(Math.hypot(p.x-X(S.p1.x),p.y-Y(S.p1.y))<15) return 'p1';
      if(Math.hypot(p.x-X(S.p2.x),p.y-Y(S.p2.y))<15) return 'p2';
      return null;
    },
    move:(h,p)=>{ const v=inv(p);
      v.x=Math.max(-8,Math.min(8,v.x)); v.y=Math.max(-7,Math.min(7,v.y));
      S[h]=v; draw(); }
  });
  $('#lfNew').onclick=newQ;
  newQ();
  inquiry(root,{ id:'lf', title:'식 ↔ 그래프 왕복 — 두 점이면 끝',
    q:['「새 문제」로 여섯 문제 이상 풀며 매번 기록하세요.',
       '어떤 두 점을 잡는 것이 가장 빨랐는지(절편+계단 등) 자신의 요령을 정리하세요.',
       '기울기가 분수(0.5)일 때 “오른쪽 2, 위로 1”로 잡는 이유를 손으로 설명하세요.'],
    cols:['목표 식','내가 잡은 두 점','내 직선','정답?'],
    hint:'힌트 — 직선은 두 점이면 정해집니다. 가장 편한 두 점은 절편 (0, b) 와 (1, a+b) 입니다.',
    read:()=>{ const L=myLine();
      return [$('#lfQ').textContent,
              '('+S.p1.x+','+S.p1.y+') ('+S.p2.x+','+S.p2.y+')',
              L?('y='+L.m+'x'+(L.c>=0?'+':'−')+Math.abs(L.c)):'세로',
              L&&Math.abs(L.m-S.tm)<0.01&&Math.abs(L.c-S.tc)<0.01?'정답':'아직']; } });
}

/* ---------- LAB 79 삼각형의 무게중심 ---------- */
function centroidDemo(root){
  root.innerHTML=`<div class="row"><div class="col">
      <canvas id="cd1" width="380" height="300"></canvas>
      <div class="note" style="margin-top:8px"><b>꼭짓점 셋(검정)</b>을 끌어 삼각형을 바꾸고,
      <b>내 추측(주황)</b>을 균형점이라 생각하는 곳에 끌어다 두세요.</div>
    </div>
    <div class="col">
      <div class="ctl"><button class="b t" id="cdChk">중선 그려 확인</button>
        <button class="b g sm" id="cdHide">중선 감추기</button></div>
      <div class="out" id="cdout"></div>
      <div class="note" style="margin-top:12px">세 중선은 반드시 <b>한 점</b>에서 만나고,
      그 점은 각 중선을 꼭짓점 쪽에서 <b>2 : 1</b> 로 나눕니다. 종이 삼각형을
      그 점에서 받치면 실제로 균형이 잡힙니다.</div>
    </div></div>`;
  const cv=$('#cd1'),ctx=cv.getContext('2d'),W=380,H=300;
  const S={ A:{x:80,y:250}, B:{x:320,y:230}, C:{x:180,y:60}, G:{x:120,y:150}, show:false };
  const cen=()=>({x:(S.A.x+S.B.x+S.C.x)/3, y:(S.A.y+S.B.y+S.C.y)/3});
  function draw(){
    ctx.clearRect(0,0,W,H); ctx.fillStyle='#fff'; ctx.fillRect(0,0,W,H);
    ctx.fillStyle='rgba(37,99,235,.08)';
    ctx.beginPath(); ctx.moveTo(S.A.x,S.A.y); ctx.lineTo(S.B.x,S.B.y); ctx.lineTo(S.C.x,S.C.y);
    ctx.closePath(); ctx.fill();
    ctx.strokeStyle='#2563EB'; ctx.lineWidth=2.2; ctx.stroke();
    if(S.show){
      const M=[{f:S.A,t:{x:(S.B.x+S.C.x)/2,y:(S.B.y+S.C.y)/2}},
               {f:S.B,t:{x:(S.A.x+S.C.x)/2,y:(S.A.y+S.C.y)/2}},
               {f:S.C,t:{x:(S.A.x+S.B.x)/2,y:(S.A.y+S.B.y)/2}}];
      ctx.strokeStyle='#0E9384'; ctx.lineWidth=1.5; ctx.setLineDash([4,3]);
      M.forEach(m=>{ ctx.beginPath(); ctx.moveTo(m.f.x,m.f.y); ctx.lineTo(m.t.x,m.t.y); ctx.stroke();
        ctx.setLineDash([]);
        ctx.fillStyle='#0E9384'; ctx.beginPath(); ctx.arc(m.t.x,m.t.y,3.4,0,7); ctx.fill();
        ctx.setLineDash([4,3]); });
      ctx.setLineDash([]);
      const G=cen();
      ctx.fillStyle='#0E9384'; ctx.beginPath(); ctx.arc(G.x,G.y,5.5,0,7); ctx.fill();
      // 2:1 눈금 — 중선 하나에
      const m0=M[0], gx=G.x, gy=G.y;
      ctx.fillStyle='#374151'; ctx.font='bold 10px sans-serif'; ctx.textAlign='center';
      ctx.fillText('2', (m0.f.x+gx)/2, (m0.f.y+gy)/2-6);
      ctx.fillText('1', (m0.t.x+gx)/2, (m0.t.y+gy)/2-6);
    }
    [S.A,S.B,S.C].forEach((P,i)=>handle(ctx,P.x,P.y,'#111827',['A','B','C'][i]));
    handle(ctx,S.G.x,S.G.y,'#B45309','내 추측');
    const G=cen(), d=Math.hypot(S.G.x-G.x,S.G.y-G.y);
    $('#cdout').innerHTML = S.show
      ? (d<12
        ? `<b style="color:#0E9384">명중! 추측이 무게중심에서 ${d.toFixed(0)}px.</b> 세 중선이 정확히 한 점에서 만납니다.`
        : `무게중심에서 <b style="color:#B45309">${d.toFixed(0)}px</b> 벗어났습니다 — 초록 점이 진짜 균형점.`)
        + `<br><span style="color:#6B7280;font-size:12.5px">꼭짓점을 끌어 삼각형을 바꿔도 2:1 이 유지되는지 보세요.</span>`
      : `균형점을 추측해 주황 점을 놓은 뒤 <b>「중선 그려 확인」</b>을 누르세요.`;
  }
  dragOn(cv,{
    hit:p=>{
      const c=[['G',S.G],['A',S.A],['B',S.B],['C',S.C]];
      for(const q of c) if(Math.hypot(p.x-q[1].x,p.y-q[1].y)<16) return q[0];
      return null;
    },
    move:(h,p)=>{ S[h]={x:Math.max(20,Math.min(W-20,p.x)), y:Math.max(20,Math.min(H-20,p.y))}; draw(); }
  });
  $('#cdChk').onclick=()=>{ S.show=true; draw(); };
  $('#cdHide').onclick=()=>{ S.show=false; draw(); };
  draw();
  inquiry(root,{ id:'cd', title:'삼각형의 무게중심 — 균형점 사냥',
    q:['삼각형을 바꿔 가며 추측 → 확인을 반복해 기록하세요 (6회 이상).',
       '「벗어난 거리」가 회를 거듭할수록 줄었는지 보고, 자신이 어떤 요령을 익혔는지 적으세요.',
       '무게중심이 중선을 2:1 로 나누는 것을 그림에서 확인하고, 좌표로 ((x₁+x₂+x₃)/3, …) 이 되는 이유를 중점과 연결해 설명하세요.'],
    cols:['추측 위치','실제 무게중심','벗어난 거리(px)','명중?'],
    hint:'힌트 — 무게중심은 세 꼭짓점의 “평균 위치”입니다. 평균이 균형을 만드는 이유를 시소로 생각해 보세요.',
    read:()=>{ const G=cen(), d=Math.hypot(S.G.x-G.x,S.G.y-G.y);
      return ['('+S.G.x.toFixed(0)+','+S.G.y.toFixed(0)+')',
              '('+G.x.toFixed(0)+','+G.y.toFixed(0)+')', d.toFixed(0), d<12?'명중':'—']; } });
}

/* ---------- LAB 80 평행사변형이 되는 조건 ---------- */
function paragramDemo(root){
  root.innerHTML=`<div class="row"><div class="col">
      <canvas id="pgm1" width="380" height="300"></canvas>
      <div class="note" style="margin-top:8px"><b>네 꼭짓점을 끌어</b> 사각형을 바꾸세요.
      조건 판정이 실시간으로 바뀝니다.</div>
    </div>
    <div class="col">
      <div class="ctl"><button class="b t sm" id="pgmSnap">평행사변형으로 맞추기</button>
        <button class="b g sm" id="pgmTrap">사다리꼴 함정 만들기</button></div>
      <div class="out" id="pgmout"></div>
      <div class="note" style="margin-top:12px">다섯 개의 판정 등은 따로 놀까요, 함께 움직일까요? 꼭짓점을 끌며 어긋나는 순간을 찾아보세요.</div>
    </div></div>`;
  const cv=$('#pgm1'),ctx=cv.getContext('2d'),W=380,H=300;
  const S={ P:[{x:90,y:230},{x:290,y:230},{x:320,y:110},{x:150,y:70}] };
  const vsub=(a,b)=>({x:a.x-b.x,y:a.y-b.y});
  const para=(u,v)=>Math.abs(u.x*v.y-u.y*v.x)<420;
  const len=v=>Math.hypot(v.x,v.y);
  function judge(){
    const [A,B,C,D]=S.P;
    const AB=vsub(B,A), DC=vsub(C,D), AD=vsub(D,A), BC=vsub(C,B);
    const p1=para(AB,DC), p2=para(AD,BC);
    const e1=Math.abs(len(AB)-len(DC))<9, e2=Math.abs(len(AD)-len(BC))<9;
    const M1={x:(A.x+C.x)/2,y:(A.y+C.y)/2}, M2={x:(B.x+D.x)/2,y:(B.y+D.y)/2};
    const diag=Math.hypot(M1.x-M2.x,M1.y-M2.y)<9;
    return {p1,p2,e1,e2,diag, is:p1&&p2};
  }
  function draw(){
    const [A,B,C,D]=S.P, J=judge();
    ctx.clearRect(0,0,W,H); ctx.fillStyle='#fff'; ctx.fillRect(0,0,W,H);
    ctx.fillStyle=J.is?'rgba(14,147,132,.10)':'rgba(190,18,60,.06)';
    ctx.beginPath(); ctx.moveTo(A.x,A.y); [B,C,D].forEach(P=>ctx.lineTo(P.x,P.y));
    ctx.closePath(); ctx.fill();
    ctx.strokeStyle=J.is?'#0E9384':'#BE123C'; ctx.lineWidth=2.2; ctx.stroke();
    // 대각선과 중점
    ctx.strokeStyle='#9CA3AF'; ctx.setLineDash([3,3]); ctx.lineWidth=1.2;
    ctx.beginPath(); ctx.moveTo(A.x,A.y); ctx.lineTo(C.x,C.y); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(B.x,B.y); ctx.lineTo(D.x,D.y); ctx.stroke(); ctx.setLineDash([]);
    const M1={x:(A.x+C.x)/2,y:(A.y+C.y)/2}, M2={x:(B.x+D.x)/2,y:(B.y+D.y)/2};
    ctx.fillStyle='#2563EB'; ctx.beginPath(); ctx.arc(M1.x,M1.y,4,0,7); ctx.fill();
    ctx.fillStyle='#B45309'; ctx.beginPath(); ctx.arc(M2.x,M2.y,4,0,7); ctx.fill();
    S.P.forEach((P,i)=>handle(ctx,P.x,P.y,'#111827',['A','B','C','D'][i]));
    const t=(v,ok)=>`<span style="color:${ok?'#0E9384':'#BE123C'}">${ok?'✓':'✗'} ${v}</span>`;
    $('#pgmout').innerHTML =
      t('AB ∥ DC',J.p1)+'<br>'+t('AD ∥ BC',J.p2)+'<br>'
      +t('AB = DC',J.e1)+'<br>'+t('AD = BC',J.e2)+'<br>'
      +t('대각선이 서로를 이등분 (두 중점 일치)',J.diag)+'<br><br>'
      +(J.is
        ? `<b style="color:#0E9384">평행사변형입니다</b> — 다섯 판정이 함께 켜지는 것을 보세요.`
        : J.p1||J.p2
        ? `<b style="color:#BE123C">한 쌍만 평행 — 사다리꼴입니다.</b> 평행사변형이라 하면 안 됩니다.`
        : `아직 아무 조건도 성립하지 않습니다.`);
  }
  dragOn(cv,{
    hit:p=>{ for(let i=0;i<4;i++) if(Math.hypot(p.x-S.P[i].x,p.y-S.P[i].y)<16) return i;
      return null; },
    move:(i,p)=>{ S.P[i]={x:Math.max(20,Math.min(W-20,p.x)),y:Math.max(20,Math.min(H-20,p.y))}; draw(); }
  });
  $('#pgmSnap').onclick=()=>{ S.P=[{x:90,y:230},{x:290,y:230},{x:330,y:90},{x:130,y:90}]; draw(); };
  $('#pgmTrap').onclick=()=>{ S.P=[{x:80,y:230},{x:300,y:230},{x:260,y:90},{x:140,y:90}]; draw(); };
  draw();
  inquiry(root,{ id:'pgm', title:'평행사변형이 되는 조건 — 다섯 얼굴의 같은 사실',
    q:['꼭짓점을 끌어 여러 사각형을 만들며 판정 다섯 개를 기록하세요 (사다리꼴 함정 포함 6회 이상).',
       '다섯 판정이 <b>따로따로 켜질 수 있는지, 아니면 늘 함께인지</b> 표에서 확인하세요.',
       '「대각선이 서로를 이등분하면 평행사변형」인 이유를 삼각형의 합동(SAS)으로 손으로 증명하세요.'],
    cols:['AB∥DC','AD∥BC','AB=DC','AD=BC','대각선 이등분','평행사변형?'],
    hint:'힌트 — 다섯 조건 중 어느 하나(한 쌍 평행+같음 포함)가 성립하면 나머지가 따라옵니다. 사다리꼴은 왜 안 되나요?',
    read:()=>{ const J=judge();
      const o=v=>v?'✓':'✗';
      return [o(J.p1),o(J.p2),o(J.e1),o(J.e2),o(J.diag),J.is?'맞다':'아니다']; } });
}

/* ---------- LAB 81 닮음과 축척 ---------- */
function scaleMapDemo(root){
  root.innerHTML=`<div class="row"><div class="col">
      <canvas id="sm1" width="380" height="300"></canvas>
      <div class="note" style="margin-top:8px">오른쪽 그림의 <b>모서리 손잡이(주황)</b>를 끌어
      확대·축소해 보세요.</div>
    </div>
    <div class="col">
      <div class="out" id="smout"></div>
      <div class="note" style="margin-top:12px">길이를 k배 하면 넓이는 몇 배가 될까요? 지도 축척과 사진 용량 이야기까지 이어 보세요.</div>
    </div></div>`;
  const cv=$('#sm1'),ctx=cv.getContext('2d'),W=380,H=300;
  const S={ k:1.6 };
  const BASE={x:38,y:190,w:60,h:42};
  function house(x,y,w,h,col){
    ctx.strokeStyle=col; ctx.lineWidth=2;
    ctx.strokeRect(x,y,w,h);
    ctx.beginPath(); ctx.moveTo(x-w*0.08,y); ctx.lineTo(x+w/2,y-h*0.55); ctx.lineTo(x+w*1.08,y); ctx.stroke();
    ctx.strokeRect(x+w*0.38,y+h*0.45,w*0.24,h*0.55);
  }
  function draw(){
    const k=S.k;
    ctx.clearRect(0,0,W,H); ctx.fillStyle='#fff'; ctx.fillRect(0,0,W,H);
    // 원본
    ctx.fillStyle='rgba(37,99,235,.08)';
    ctx.fillRect(BASE.x,BASE.y,BASE.w,BASE.h);
    house(BASE.x,BASE.y,BASE.w,BASE.h,'#2563EB');
    ctx.fillStyle='#6B7280'; ctx.font='10.5px sans-serif'; ctx.textAlign='center';
    ctx.fillText('원본 (1배)', BASE.x+BASE.w/2, BASE.y+BASE.h+30);
    // 닮은 그림
    const x2=170, y2=232-BASE.h*k, w2=BASE.w*k, h2=BASE.h*k;
    ctx.fillStyle='rgba(14,147,132,.10)';
    ctx.fillRect(x2,y2,w2,h2);
    house(x2,y2,w2,h2,'#0E9384');
    handle(ctx,x2+w2,y2,'#B45309','×'+k.toFixed(1));
    ctx.fillStyle='#6B7280'; ctx.textAlign='center';
    ctx.fillText('닮은꼴 ('+k.toFixed(1)+'배)', x2+w2/2, 262);
    // 넓이 타일 시각화 — k² 을 단위 정사각형 수로
    const kk=k*k;
    ctx.fillStyle='#374151'; ctx.font='bold 12px sans-serif'; ctx.textAlign='left';
    ctx.fillText('길이 ×'+k.toFixed(1)+'  →  넓이 ×'+kk.toFixed(2), 38, 46);
    const gx=38;
    for(let i=0;i<Math.min(9,Math.floor(kk));i++){
      ctx.fillStyle='rgba(180,83,9,.35)';
      ctx.fillRect(gx+i*20, 56, 16, 16);
    }
    if(kk-Math.floor(kk)>0.05 && Math.floor(kk)<9){
      ctx.fillStyle='rgba(180,83,9,.35)';
      ctx.fillRect(gx+Math.floor(kk)*20, 56, 16*(kk-Math.floor(kk)), 16);
    }
    ctx.strokeStyle='#B45309';
    ctx.strokeRect(gx-2, 54, 20*Math.min(9,kk)+2, 20);
    $('#smout').innerHTML =
      `닮음비 k = <b>${k.toFixed(2)}</b><br>`
      + `둘레: ×<b>${k.toFixed(2)}</b> · 넓이: ×<b style="color:#B45309">${kk.toFixed(2)}</b><br>`
      + `<span style="color:#6B7280;font-size:12.5px">k = 2 로 맞추면 넓이 타일이 정확히 4장이 되는 것을 확인하세요.
      k = 3 이면? 지도 1:25000 에서 1cm² 는 실제 몇 m² 일까요?</span>`;
  }
  dragOn(cv,{
    hit:p=>{
      const x2=170, y2=232-BASE.h*S.k, w2=BASE.w*S.k;
      return Math.hypot(p.x-(x2+w2), p.y-y2)<20?'k':null;
    },
    move:(h,p)=>{ S.k=Math.max(0.5,Math.min(2.9,Math.round((p.x-170)/BASE.w*20)/20)); draw(); }
  });
  draw();
  inquiry(root,{ id:'sm', title:'닮음과 축척 — 길이는 k배, 넓이는 k²배',
    q:['k 를 0.5 · 1 · 1.5 · 2 · 2.5 로 끌며 기록하세요.',
       '「넓이 배율」 열이 k 와 어떤 관계인지 찾으세요. k=2 에서 타일이 몇 장인지 확인하세요.',
       '넓이가 k² 배가 되는 이유를 <b>가로도 k배, 세로도 k배</b>로 손으로 설명하고, 부피는 몇 배가 될지 예상해 적으세요.'],
    cols:['닮음비 k','둘레 배율','넓이 배율','k²','일치?'],
    hint:'힌트 — 축척은 길이의 비율입니다. 지도에서 넓이를 읽을 때 실수가 잦은 이유가 바로 이 제곱입니다.',
    read:()=>[S.k.toFixed(2), S.k.toFixed(2), (S.k*S.k).toFixed(2), (S.k*S.k).toFixed(2), '일치'] });
}

/* ---------- LAB 82 닮음의 중심과 닮음의 위치 ---------- */
function homothetyDemo(root){
  root.innerHTML=`<div class="row"><div class="col">
      <canvas id="ho1" width="380" height="300"></canvas>
      <div class="note" style="margin-top:8px"><b>닮음의 중심 O(빨강)</b> 과
      <b>배율 손잡이(주황)</b>를 끌어 보세요. 대응점을 잇는 선이 전부 O 를 지납니다.</div>
    </div>
    <div class="col">
      <div class="out" id="hoout"></div>
      <div class="note" style="margin-top:12px">대응점을 이은 선들은 어디를 지나가나요? 빔프로젝터·그림자와 무슨 관계일까요?</div>
    </div></div>`;
  const cv=$('#ho1'),ctx=cv.getContext('2d'),W=380,H=300;
  const S={ O:{x:60,y:150}, k:1.8 };
  const TRI=[{x:130,y:120},{x:190,y:170},{x:140,y:190}];
  const img=P=>({x:S.O.x+(P.x-S.O.x)*S.k, y:S.O.y+(P.y-S.O.y)*S.k});
  function draw(){
    ctx.clearRect(0,0,W,H); ctx.fillStyle='#fff'; ctx.fillRect(0,0,W,H);
    const T2=TRI.map(img);
    // 대응점 연결선 (O 를 지나는 광선)
    ctx.strokeStyle='#D1D5DB'; ctx.lineWidth=1.1; ctx.setLineDash([3,3]);
    TRI.forEach((P,i)=>{ ctx.beginPath(); ctx.moveTo(S.O.x,S.O.y);
      const Q=T2[i], ex=Q.x+(Q.x-S.O.x)*0.25, ey=Q.y+(Q.y-S.O.y)*0.25;
      ctx.lineTo(ex,ey); ctx.stroke(); });
    ctx.setLineDash([]);
    // 원본·상
    const poly=(pts,col,al)=>{ ctx.globalAlpha=al; ctx.fillStyle=col;
      ctx.beginPath(); ctx.moveTo(pts[0].x,pts[0].y); pts.slice(1).forEach(P=>ctx.lineTo(P.x,P.y));
      ctx.closePath(); ctx.fill(); ctx.globalAlpha=1;
      ctx.strokeStyle=col; ctx.lineWidth=2; ctx.stroke(); };
    poly(TRI,'#2563EB',.15); poly(T2,'#0E9384',.12);
    handle(ctx,S.O.x,S.O.y,'#BE123C','O');
    const hk=img(TRI[0]);
    handle(ctx,hk.x,hk.y,'#B45309','k = '+S.k.toFixed(1));
    // 길이 비교
    const d1=Math.hypot(TRI[0].x-TRI[1].x,TRI[0].y-TRI[1].y);
    const d2=Math.hypot(T2[0].x-T2[1].x,T2[0].y-T2[1].y);
    $('#hoout').innerHTML =
      `배율 k = <b>${S.k.toFixed(2)}</b> ${S.k<0?'<b style="color:#BE123C">(음수 — O 반대편에 뒤집혀 생깁니다)</b>':''}<br>`
      + `한 변의 길이: 원본 ${d1.toFixed(0)} → 상 ${d2.toFixed(0)} (×${(d2/d1).toFixed(2)})<br>`
      + `O 에서 대응점까지: OA = ${Math.hypot(TRI[0].x-S.O.x,TRI[0].y-S.O.y).toFixed(0)}
         · OA' = ${Math.hypot(T2[0].x-S.O.x,T2[0].y-S.O.y).toFixed(0)}
         (×${(Math.hypot(T2[0].x-S.O.x,T2[0].y-S.O.y)/Math.hypot(TRI[0].x-S.O.x,TRI[0].y-S.O.y)).toFixed(2)})<br>`
      + `<span style="color:#6B7280;font-size:12.5px">O 를 끌면 상이 통째로 움직입니다 — 광원을 옮기는 셈입니다. k 를 음수까지 끌어 보세요.</span>`;
  }
  dragOn(cv,{
    hit:p=>{
      const hk=img(TRI[0]);
      if(Math.hypot(p.x-hk.x,p.y-hk.y)<16) return 'k';
      if(Math.hypot(p.x-S.O.x,p.y-S.O.y)<16) return 'O';
      return null;
    },
    move:(h,p)=>{
      if(h==='O'){ S.O={x:Math.max(15,Math.min(W-15,p.x)),y:Math.max(15,Math.min(H-15,p.y))}; }
      else {
        // A 방향으로의 사영 비율이 새 k
        const vx=TRI[0].x-S.O.x, vy=TRI[0].y-S.O.y;
        const t=((p.x-S.O.x)*vx+(p.y-S.O.y)*vy)/(vx*vx+vy*vy);
        S.k=Math.max(-2.5,Math.min(2.5,Math.round(t*10)/10));
        if(Math.abs(S.k)<0.2) S.k=0.2*Math.sign(S.k||1);
      }
      draw();
    }
  });
  draw();
  inquiry(root,{ id:'ho', title:'닮음의 중심 — 광원이 그림을 키운다',
    q:['k 와 O 를 바꿔 가며 기록하세요 (k 음수 포함 6줄 이상).',
       '「OA′/OA」 열과 「변의 비」 열을 견주어 무엇이 같은지 찾으세요.',
       '대응점 연결선이 왜 모두 O 를 지나는지 <b>확대의 정의(O 에서의 거리를 k배)</b>로 손으로 설명하세요. k 가 음수면 어디에 생기는지도 적으세요.'],
    cols:['k','OA','OA′','OA′/OA','변의 비'],
    hint:'힌트 — 닮음의 위치는 “O 에서 쏜 빛을 따라 모든 점을 k배 밀어낸 것”입니다. 빛은 곧 그 연결선입니다.',
    read:()=>{ const T2=TRI.map(img);
      const oa=Math.hypot(TRI[0].x-S.O.x,TRI[0].y-S.O.y);
      const oa2=Math.hypot(T2[0].x-S.O.x,T2[0].y-S.O.y);
      const d1=Math.hypot(TRI[0].x-TRI[1].x,TRI[0].y-TRI[1].y);
      const d2=Math.hypot(T2[0].x-T2[1].x,T2[0].y-T2[1].y);
      return [S.k.toFixed(1), oa.toFixed(0), oa2.toFixed(0), (oa2/oa).toFixed(2), (d2/d1).toFixed(2)]; } });
}

/* ---------- LAB 83 피타고라스 정리 — TV 의 55인치 ---------- */
function pythaDemo(root){
  root.innerHTML=`<div class="row"><div class="col">
      <canvas id="py1" width="380" height="300"></canvas>
      <div class="note" style="margin-top:8px"><b>가로·세로 손잡이</b>를 끌어 TV 크기를 바꾸세요.
      세 변 위의 정사각형 넓이가 함께 움직입니다.</div>
    </div>
    <div class="col">
      <div class="out" id="pyout"></div>
      <div class="note" style="margin-top:12px">55인치 TV 의 「55」는 어느 길이일까요? 세 정사각형 넓이 사이의 관계를 추적해 보세요.</div>
    </div></div>`;
  const cv=$('#py1'),ctx=cv.getContext('2d'),W=380,H=300;
  const S={ a:12, b:7 };                              // 가로 a, 세로 b (그림 배율 8px/단위)
  const O={x:100,y:210}, SC=8;
  function draw(){
    const a=S.a, b=S.b, c=Math.sqrt(a*a+b*b);
    ctx.clearRect(0,0,W,H); ctx.fillStyle='#fff'; ctx.fillRect(0,0,W,H);
    // 직각삼각형 (TV 반쪽)
    const A={x:O.x,y:O.y}, B={x:O.x+a*SC,y:O.y}, C={x:O.x+a*SC,y:O.y-b*SC};
    // TV 화면
    ctx.fillStyle='rgba(37,99,235,.10)';
    ctx.fillRect(A.x,C.y,a*SC,b*SC);
    ctx.strokeStyle='#374151'; ctx.lineWidth=2; ctx.strokeRect(A.x,C.y,a*SC,b*SC);
    // 대각선
    ctx.strokeStyle='#BE123C'; ctx.lineWidth=2.6;
    ctx.beginPath(); ctx.moveTo(A.x,A.y); ctx.lineTo(C.x,C.y); ctx.stroke();
    // 넓이 막대 비교 (정사각형 대신 막대 — 화면 절약)
    const bx=252, bw=26;
    const bar=(x,v,col,lab)=>{ const h=v*0.6;
      ctx.fillStyle=col; ctx.globalAlpha=.35; ctx.fillRect(x,240-h,bw,h); ctx.globalAlpha=1;
      ctx.strokeStyle=col; ctx.strokeRect(x,240-h,bw,h);
      ctx.fillStyle='#374151'; ctx.font='bold 10px sans-serif'; ctx.textAlign='center';
      ctx.fillText(lab,x+bw/2,254); ctx.fillText(v.toFixed(0),x+bw/2,236-h); };
    bar(bx,a*a,'#2563EB','a²'); bar(bx+34,b*b,'#0E9384','b²');
    bar(bx+78,c*c,'#BE123C','c²');
    ctx.fillStyle='#374151'; ctx.font='bold 12px sans-serif'; ctx.textAlign='center';
    ctx.fillText('+', bx+32+17-15, 200); ctx.fillText('=', bx+68, 200);
    // 라벨과 손잡이
    ctx.fillStyle='#111827'; ctx.font='bold 12px sans-serif';
    ctx.fillText('가로 a = '+a, A.x+a*SC/2, A.y+20);
    ctx.save(); ctx.translate(B.x+16, C.y+b*SC/2); ctx.rotate(-Math.PI/2);
    ctx.fillText('세로 b = '+b, 0, 0); ctx.restore();
    ctx.fillStyle='#BE123C';
    ctx.fillText('대각선 c = '+c.toFixed(1), A.x+a*SC/2-20, C.y+b*SC/2-8);
    handle(ctx,B.x,B.y,'#2563EB','');
    handle(ctx,C.x,C.y,'#0E9384','');
    $('#pyout').innerHTML =
      `<span class="mono">c² = a² + b² = ${a*a} + ${b*b} = <b>${a*a+b*b}</b></span><br>`
      + `c = √${a*a+b*b} = <b>${c.toFixed(2)}</b><br>`
      + (Math.abs(a-12)<0.5&&Math.abs(b-9)<0.5
        ? `<b style="color:#0E9384">12 : 9 : 15 — 3:4:5 의 3배! 피타고라스 수입니다.</b>`
        : `<span style="color:#6B7280;font-size:12.5px">가로 12·세로 9 로 맞추면 대각선이 딱 떨어지는 수가 됩니다.</span>`);
  }
  dragOn(cv,{
    hit:p=>{
      const B={x:O.x+S.a*SC,y:O.y}, C={x:O.x+S.a*SC,y:O.y-S.b*SC};
      if(Math.hypot(p.x-C.x,p.y-C.y)<16) return 'b';
      if(Math.hypot(p.x-B.x,p.y-B.y)<16) return 'a';
      return null;
    },
    move:(h,p)=>{
      if(h==='a') S.a=Math.max(4,Math.min(17,Math.round((p.x-O.x)/SC)));
      else S.b=Math.max(3,Math.min(15,Math.round((O.y-p.y)/SC)));
      draw();
    }
  });
  draw();
  inquiry(root,{ id:'py', title:'피타고라스 정리 — 55인치의 정체',
    q:['가로·세로를 바꿔 가며 기록하세요 (8줄 이상). (12, 9)·(8, 6)·(5, 12) 를 꼭 포함하세요.',
       '「a²+b²」 열과 「c²」 열이 언제나 같은지 확인하고, c 가 자연수로 떨어지는 (a, b) 를 모으세요.',
       '가로+세로(a+b)가 왜 대각선이 아닌지 삼각형의 성질(두 변의 합)로 설명하고, 55인치 TV 의 가로를 16:9 비율로 구해 보세요.'],
    cols:['a','b','a²+b²','c','c²','a+b (함정)'],
    hint:'힌트 — 대각선은 “꺾어 가는 길(a+b)”보다 짧은 “질러가는 길”입니다. 얼마나 짧은지가 바로 이 정리입니다.',
    read:()=>{ const c=Math.sqrt(S.a*S.a+S.b*S.b);
      return [S.a,S.b,S.a*S.a+S.b*S.b,c.toFixed(2),(c*c).toFixed(0),S.a+S.b]; } });
}

/* ---------- LAB 84 피타고라스 정리의 역 ---------- */
function pythaConvDemo(root){
  root.innerHTML=`<div class="row"><div class="col">
      <canvas id="pc1" width="380" height="300"></canvas>
      <div class="note" style="margin-top:8px"><b>세 변의 길이 손잡이</b>를 끌어 삼각형을
      바꾸세요. 가장 큰 각이 직각인지가 실시간으로 판정됩니다.</div>
    </div>
    <div class="col">
      <div class="out" id="pcout"></div>
      <div class="note" style="margin-top:12px">세 변만 알고 직각인지 판정할 수 있을까요? 어느 변끼리 비교해야 공정한 재판이 될까요?</div>
    </div></div>`;
  const cv=$('#pc1'),ctx=cv.getContext('2d'),W=380,H=300;
  const S={ a:6, b:8, c:15 };
  function tri(){
    // 밑변 c(가장 긴 변으로 재배치하지 않고 학생 몫으로 남긴다 — 화면은 그냥 c 를 밑변으로)
    const {a,b,c}=S;
    if(a+b<=c||b+c<=a||c+a<=b) return null;
    const x=(b*b+c*c-a*a)/(2*c);                     // 꼭짓점 C 의 x (A 기준)
    const h2=b*b-x*x;
    return h2>0?{x,h:Math.sqrt(h2)}:null;
  }
  function draw(){
    const {a,b,c}=S, T=tri();
    ctx.clearRect(0,0,W,H); ctx.fillStyle='#fff'; ctx.fillRect(0,0,W,H);
    const SC=13, O={x:70,y:220};
    if(T){
      const A={x:O.x,y:O.y}, B={x:O.x+c*SC,y:O.y}, C={x:O.x+T.x*SC,y:O.y-T.h*SC};
      ctx.fillStyle='rgba(37,99,235,.10)';
      ctx.beginPath(); ctx.moveTo(A.x,A.y); ctx.lineTo(B.x,B.y); ctx.lineTo(C.x,C.y);
      ctx.closePath(); ctx.fill();
      ctx.strokeStyle='#2563EB'; ctx.lineWidth=2.2; ctx.stroke();
      // 가장 긴 변 표시
      const mx=Math.max(a,b,c);
      ctx.fillStyle='#374151'; ctx.font='bold 11.5px sans-serif'; ctx.textAlign='center';
      ctx.fillText('c쪽 변 = '+c+(c===mx?' (최장)':''), (A.x+B.x)/2, A.y+18);
      ctx.fillText('b = '+b+(b===mx?' (최장)':''), (A.x+C.x)/2-16, (A.y+C.y)/2);
      ctx.fillText('a = '+a+(a===mx?' (최장)':''), (B.x+C.x)/2+16, (B.y+C.y)/2);
      // 최대각 표시(마주 보는 꼭짓점에 호)
      const big = mx===c?'C위':mx===b?'B':'A';
      const ang = Math.acos(Math.max(-1,Math.min(1,(a*a+b*b-c*c)/(2*a*b))));  // c 를 마주 보는 각
      const mxAng = (()=>{ // 가장 긴 변을 마주 보는 각
        const opp=mx;
        const s1=mx===c?a:mx===b?c:b, s2=mx===c?b:mx===b?a:c;
        return Math.acos(Math.max(-1,Math.min(1,(s1*s1+s2*s2-opp*opp)/(2*s1*s2))))*180/Math.PI;
      })();
      ctx.fillStyle=Math.abs(mxAng-90)<0.5?'#0E9384':'#BE123C';
      ctx.font='bold 13px sans-serif';
      ctx.fillText('최대각 '+mxAng.toFixed(1)+'°', C.x, C.y-14);
    } else {
      ctx.fillStyle='#BE123C'; ctx.font='bold 13px sans-serif'; ctx.textAlign='center';
      ctx.fillText('세 변으로 삼각형을 만들 수 없습니다 (삼각부등식)', W/2, 120);
    }
    // 손잡이 축 3개
    const axes=[['a',S.a,60],[ 'b',S.b,74],['c',S.c,88]];
    axes.forEach((q,i)=>{
      const y=252+i*16;
      ctx.strokeStyle='#E5E7EB'; ctx.lineWidth=3;
      ctx.beginPath(); ctx.moveTo(60,y); ctx.lineTo(320,y); ctx.stroke();
      const x=60+(320-60)*(q[1]-3)/12;
      handle(ctx,x,y,['#2563EB','#0E9384','#B45309'][i],q[0]+'='+q[1]);
    });
    const mx=Math.max(a,b,c), rest2=a*a+b*b+c*c-mx*mx;
    const kind = !T?'불가': Math.abs(mx*mx-rest2)<0.5?'직각':(mx*mx<rest2?'예각':'둔각');
    $('#pcout').innerHTML =
      `가장 긴 변² = <b>${mx*mx}</b> vs 나머지 두 변²의 합 = <b>${rest2}</b><br>`
      + `판정: <b style="color:${kind==='직각'?'#0E9384':kind==='불가'?'#9CA3AF':'#B45309'}">${kind}삼각형${kind==='불가'?'':''}</b><br>`
      + `<span style="color:#6B7280;font-size:12.5px">(6, 8, 10)은 직각 — 3·4·5 의 2배. c 를 11 로 늘리면? 9 로 줄이면?</span>`;
  }
  dragOn(cv,{
    hit:p=>{
      for(let i=0;i<3;i++){ const y=252+i*16;
        if(Math.abs(p.y-y)<9) return 'abc'[i]; }
      return null;
    },
    move:(h,p)=>{ S[h]=Math.max(3,Math.min(15,Math.round(3+(p.x-60)*12/260))); draw(); }
  });
  draw();
  inquiry(root,{ id:'pc', title:'피타고라스 정리의 역 — 직각 판정기',
    q:['세 변을 바꿔 가며 직각·예각·둔각을 모두 만들어 기록하세요 (8줄 이상).',
       '「최장변²」과 「나머지²합」의 대소가 「판정」과 어떻게 짝지어지는지 정리하세요.',
       '왜 반드시 <b>가장 긴 변</b>으로 비교해야 하는지, (6,8,10)에서 10 이 아니라 8 을 제곱해 비교하면 어떤 오판이 나는지 손으로 보이세요.'],
    cols:['a','b','c','최장변²','나머지²합','판정'],
    hint:'힌트 — 가장 큰 각은 가장 긴 변과 마주 봅니다. 판정해야 할 각이 그 각이므로 비교도 그 변이어야 합니다.',
    read:()=>{ const {a,b,c}=S, mx=Math.max(a,b,c), rest2=a*a+b*b+c*c-mx*mx;
      const T=tri();
      const kind=!T?'불가':Math.abs(mx*mx-rest2)<0.5?'직각':(mx*mx<rest2?'예각':'둔각');
      return [a,b,c,mx*mx,rest2,kind]; } });
}

/* ---------- LAB 85 피타고라스 수 사냥 ---------- */
function tripleDemo(root){
  root.innerHTML=`<div class="row"><div class="col">
      <canvas id="tp1" width="380" height="300"></canvas>
      <div class="note" style="margin-top:8px">격자에서 <b>(a, b) 칸을 눌러</b> 보세요.
      c = √(a²+b²) 가 자연수면 보물(피타고라스 수)입니다.</div>
    </div>
    <div class="col">
      <div class="out" id="tpout"></div>
      <div class="note" style="margin-top:12px">하나를 찾으면 공짜로 따라오는 것들이 있을까요? 「진짜 새로운」 세 쌍의 기준은 무엇일까요?</div>
    </div></div>`;
  const cv=$('#tp1'),ctx=cv.getContext('2d'),W=380,H=300;
  const N=16, CS=(W-70)/N;
  const S={ found:[], last:null };
  const isTri=(a,b)=>{ const c=Math.sqrt(a*a+b*b); return Math.abs(c-Math.round(c))<1e-9?Math.round(c):0; };
  function draw(){
    ctx.clearRect(0,0,W,H); ctx.fillStyle='#fff'; ctx.fillRect(0,0,W,H);
    for(let a=1;a<=N;a++) for(let b=1;b<=a;b++){
      const x=40+(a-1)*CS, y=270-(b-1)*CS;
      const hit=S.found.some(f=>f[0]===a&&f[1]===b);
      ctx.fillStyle=hit?'#0E9384':'#F3F4F6';
      ctx.fillRect(x,y-CS+2,CS-2,CS-2);
      if(hit){ ctx.fillStyle='#fff'; ctx.font='bold 8px sans-serif'; ctx.textAlign='center';
        ctx.fillText(isTri(a,b), x+CS/2-1, y-CS/2+4); }
    }
    ctx.fillStyle='#6B7280'; ctx.font='10px sans-serif'; ctx.textAlign='center';
    for(let a=2;a<=N;a+=2) ctx.fillText(a, 40+(a-1)*CS+CS/2, 288);
    ctx.save(); ctx.translate(26,270-7*CS); ctx.rotate(-Math.PI/2);
    ctx.fillText('b →', 0, 0); ctx.restore();
    ctx.fillText('a →', 210, 299);
    if(S.last){
      const [a,b,c]=S.last;
      ctx.fillStyle=c?'#0E9384':'#BE123C'; ctx.font='bold 13px sans-serif';
      ctx.fillText(c?`${a}² + ${b}² = ${a*a+b*b} = ${c}² — 보물!`:`${a}² + ${b}² = ${a*a+b*b} — 제곱수가 아닙니다`, W/2, 24);
    } else {
      ctx.fillStyle='#374151'; ctx.font='12px sans-serif';
      ctx.fillText('아래 삼각 격자를 눌러 사냥을 시작하세요 (a ≥ b)', W/2, 24);
    }
    const prim=S.found.filter(f=>{ const g=(x,y)=>y?g(y,x%y):x; return g(f[0],f[1])===1||true; });
    const primOnly=S.found.filter(f=>{ const g=(x,y)=>y?g(y,x%y):x; return g(g(f[0],f[1]),f[2])===1; });
    $('#tpout').innerHTML =
      `찾은 피타고라스 수 <b>${S.found.length}개</b> · 그중 원시(서로소) <b style="color:#0E9384">${primOnly.length}개</b><br>`
      + S.found.slice(-6).map(f=>`(${f[0]},${f[1]},${f[2]})`).join(' · ')
      + `<br><span style="color:#6B7280;font-size:12.5px">원시 수 4개(3,4,5 · 5,12,13 · 8,15,17 · 12,5,13은 같은 것)를 모아 보세요.</span>`;
  }
  cv.style.touchAction='none';
  cv.addEventListener('pointerdown',e=>{
    const r=cv.getBoundingClientRect();
    const x=(e.clientX-r.left)*W/r.width, y=(e.clientY-r.top)*H/r.height;
    const a=Math.floor((x-40)/CS)+1, b=Math.floor((270-y)/CS)+1;
    if(a<1||a>N||b<1||b>a) return;
    const c=isTri(a,b);
    S.last=[a,b,c];
    if(c && !S.found.some(f=>f[0]===a&&f[1]===b)) S.found.push([a,b,c]);
    draw();
  });
  draw();
  inquiry(root,{ id:'tp', title:'피타고라스 수 사냥 — 자연수 직각삼각형',
    q:['보물을 5개 이상 찾아 기록하세요.',
       '찾은 수들 중 <b>서로 배수 관계인 것</b>을 묶고, 배수면 왜 자동으로 보물이 되는지 닮음으로 설명하세요.',
       '(3,4,5)에서 홀수² = 나머지 두 수의 합(9 = 4+5)임을 확인하고, 이 규칙으로 다음 원시 수를 예언해 시험해 보세요.'],
    cols:['a','b','c','a²+b²','원시(서로소)?'],
    hint:'힌트 — 홀수 n 에 대해 (n, (n²−1)/2, (n²+1)/2) 는 늘 피타고라스 수입니다. n=5, 7 로 시험해 보세요.',
    read:()=>{ if(!S.last||!S.last[2]) return null;
      const [a,b,c]=S.last; const g=(x,y)=>y?g(y,x%y):x;
      return [a,b,c,a*a+b*b, g(g(a,b),c)===1?'원시':'배수']; } });
}

/* ---------- LAB 86 합의 법칙 vs 곱의 법칙 ---------- */
function countDemo(root){
  root.innerHTML=`<div class="row"><div class="col">
      <canvas id="ct1" width="380" height="300"></canvas>
      <div class="ctl" style="display:flex;gap:6px;flex-wrap:wrap;margin-top:8px">
        <button class="b t sm" id="ctAnd">김밥 <b>그리고</b> 음료 (세트)</button>
        <button class="b t sm" id="ctOr">김밥 <b>또는</b> 음료 (하나만)</button>
      </div>
    </div>
    <div class="col">
      <div class="out" id="ctout"></div>
      <div class="note" style="margin-top:12px">「또는」과 「그리고」 — 세는 방법이 왜 달라질까요? 나무 그림의 가지 끝을 직접 세어 판정하세요.</div>
    </div></div>`;
  const cv=$('#ct1'),ctx=cv.getContext('2d'),W=380,H=300;
  const KIM=['참치','치즈','불고기'], DR=['콜라','주스'];
  const S={ mode:'and', picked:[], seenOr:false };
  function draw(){
    ctx.clearRect(0,0,W,H); ctx.fillStyle='#fff'; ctx.fillRect(0,0,W,H);
    ctx.textAlign='center';
    if(S.mode==='and'){
      // 나무: 김밥 3 갈래 × 음료 2 갈래
      const R={x:40,y:150};
      ctx.fillStyle='#374151'; ctx.font='bold 12px sans-serif'; ctx.fillText('출발',R.x,R.y-14);
      ctx.beginPath(); ctx.arc(R.x,R.y,4,0,7); ctx.fillStyle='#111827'; ctx.fill();
      KIM.forEach((k,i)=>{
        const K={x:160,y:60+i*90};
        ctx.strokeStyle='#2563EB'; ctx.lineWidth=1.6;
        ctx.beginPath(); ctx.moveTo(R.x,R.y); ctx.lineTo(K.x,K.y); ctx.stroke();
        ctx.fillStyle='#2563EB'; ctx.font='bold 11.5px sans-serif'; ctx.fillText(k,K.x,K.y-10);
        ctx.beginPath(); ctx.arc(K.x,K.y,3.4,0,7); ctx.fill();
        DR.forEach((d,j)=>{
          const D={x:290,y:K.y-20+j*40};
          ctx.strokeStyle='#0E9384';
          ctx.beginPath(); ctx.moveTo(K.x,K.y); ctx.lineTo(D.x,D.y); ctx.stroke();
          ctx.fillStyle='#0E9384'; ctx.font='10.5px sans-serif';
          ctx.fillText(k+'+'+d, D.x+38, D.y+4);
          ctx.beginPath(); ctx.arc(D.x,D.y,3,0,7); ctx.fill();
        });
      });
      $('#ctout').innerHTML =
        `<b>세트 주문 — 김밥 그리고 음료</b><br>
         가지 끝(경우)을 세면: <b>3 × 2 = 6가지</b><br>
         <span style="color:#6B7280;font-size:12.5px">김밥마다 음료 2갈래가 다시 뻗습니다 — 「그리고」는 곱.</span>` + (S.seenOr ? '<br><b style="color:#7C3AED">두 상황을 모두 확인했습니다</b> — 이제 두 법칙을 비교할 수 있습니다.' : '');
    } else {
      // 목록 두 줄
      ctx.fillStyle='#2563EB'; ctx.font='bold 12px sans-serif';
      ctx.fillText('김밥만 고르기', 110, 60);
      KIM.forEach((k,i)=>{ ctx.fillStyle='#EFF4FF';
        ctx.fillRect(50+i*70,80,60,30);
        ctx.strokeStyle='#2563EB'; ctx.strokeRect(50+i*70,80,60,30);
        ctx.fillStyle='#111827'; ctx.font='11px sans-serif'; ctx.fillText(k,80+i*70,99); });
      ctx.fillStyle='#0E9384'; ctx.font='bold 12px sans-serif';
      ctx.fillText('음료만 고르기', 110, 160);
      DR.forEach((d,i)=>{ ctx.fillStyle='#E7F7F5';
        ctx.fillRect(50+i*70,180,60,30);
        ctx.strokeStyle='#0E9384'; ctx.strokeRect(50+i*70,180,60,30);
        ctx.fillStyle='#111827'; ctx.font='11px sans-serif'; ctx.fillText(d,80+i*70,199); });
      $('#ctout').innerHTML =
        `<b>하나만 주문 — 김밥 또는 음료</b><br>
         목록을 이어 세면: <b>3 + 2 = 5가지</b><br>
         <span style="color:#6B7280;font-size:12.5px">동시에 못 고르니 목록이 나란히 놓일 뿐 — 「또는」은 합.</span>`;
    }
  }
  $('#ctAnd').onclick=()=>{ S.mode='and'; draw(); };
  $('#ctOr').onclick=()=>{ S.mode='or'; S.seenOr=true; draw(); };
  draw();
  inquiry(root,{ id:'ct', title:'합의 법칙 vs 곱의 법칙 — 「또는」과 「그리고」',
    q:['두 모드를 오가며 경우의 수를 직접 세어 기록하세요. 김밥 4종·음료 3종이라면 각각 몇인지도 계산해 적으세요.',
       '「그리고」에서 가지가 <b>다시 뻗는</b> 구조와 「또는」에서 목록이 <b>나란한</b> 구조의 차이를 그림으로 정리하세요.',
       '“김밥을 고르고, 음료는 골라도 되고 안 골라도 된다”는 몇 가지인지 두 법칙을 섞어 계산하고 나무로 검산하세요. (답: 3 × 3 = 9)'],
    cols:['상황','김밥 수','음료 수','법칙','경우의 수'],
    hint:'힌트 — “안 고르기”도 한 갈래입니다. 음료 갈래가 2+1 = 3 이 되는 이유입니다.',
    read:()=>[S.mode==='and'?'그리고(세트)':'또는(하나만)', 3, 2,
              S.mode==='and'?'곱의 법칙':'합의 법칙', S.mode==='and'?6:5] });
}

/* ---------- LAB 87 닮음비와 넓이 · 부피비 ---------- */
function cubeScaleDemo(root){
  root.innerHTML=`<div class="row"><div class="col">
      <canvas id="cs1" width="380" height="300"></canvas>
      <div class="note" style="margin-top:8px"><b>배율 손잡이(주황)</b>를 끌어 상자를 키우세요.
      길이·겉넓이·부피 게이지가 서로 다른 속도로 자랍니다.</div>
    </div>
    <div class="col">
      <div class="out" id="csout"></div>
      <div class="note" style="margin-top:12px">크기를 k배 하면 겉넓이와 부피는 각각 몇 배가 될까요? 거인과 코끼리 다리 이야기로 이어 보세요.</div>
    </div></div>`;
  const cv=$('#cs1'),ctx=cv.getContext('2d'),W=380,H=300;
  const S={ k:2 };
  const iso=(x,y,z,o,sc)=>({px:o.x+(x-y)*0.86*sc, py:o.y-z*sc-(x+y)*0.34*sc});
  function box(o,sc,col){
    const p={A:iso(0,0,0,o,sc),B:iso(1,0,0,o,sc),C:iso(1,1,0,o,sc),D:iso(0,1,0,o,sc),
             E:iso(0,0,1,o,sc),F:iso(1,0,1,o,sc),G:iso(1,1,1,o,sc),Hh:iso(0,1,1,o,sc)};
    const face=(q,al)=>{ ctx.globalAlpha=al; ctx.fillStyle=col;
      ctx.beginPath(); ctx.moveTo(q[0].px,q[0].py); q.slice(1).forEach(v=>ctx.lineTo(v.px,v.py));
      ctx.closePath(); ctx.fill(); ctx.globalAlpha=1;
      ctx.strokeStyle=col; ctx.lineWidth=1.3; ctx.stroke(); };
    face([p.E,p.F,p.G,p.Hh],.34); face([p.B,p.C,p.G,p.F],.22); face([p.A,p.B,p.F,p.E],.14);
  }
  function draw(){
    const k=S.k;
    ctx.clearRect(0,0,W,H); ctx.fillStyle='#fff'; ctx.fillRect(0,0,W,H);
    box({x:64,y:238},34,'#2563EB');
    ctx.fillStyle='#6B7280'; ctx.font='10.5px sans-serif'; ctx.textAlign='center';
    ctx.fillText('원본 (1)', 64, 262);
    box({x:210,y:250},34*k*0.62+12,'#0E9384');   // 화면 안에 들어오게 축소 표시
    ctx.fillText('닮음비 '+k.toFixed(1), 235, 276);
    handle(ctx, 210+70, 250-(34*k*0.62+12)*1.4, '#B45309','k = '+k.toFixed(1));
    // 게이지 3개
    const g=(y,v,mx,col,lab)=>{ const w=200*Math.min(1,v/mx);
      ctx.fillStyle='#F3F4F6'; ctx.fillRect(90,y,200,12);
      ctx.fillStyle=col; ctx.fillRect(90,y,w,12);
      ctx.fillStyle='#374151'; ctx.font='bold 10.5px sans-serif'; ctx.textAlign='left';
      ctx.fillText(lab+' ×'+v.toFixed(v<10?2:1), 90, y-4);
    };
    g(34,k,30,'#2563EB','길이');
    g(64,k*k,30,'#0E9384','겉넓이');
    g(94,k*k*k,30,'#B45309','부피(무게)');
    $('#csout').innerHTML =
      `닮음비 k = <b>${S.k.toFixed(1)}</b><br>`
      + `길이 ×<b>${k.toFixed(1)}</b> · 겉넓이 ×<b>${(k*k).toFixed(2)}</b> · 부피 ×<b style="color:#B45309">${(k*k*k).toFixed(2)}</b><br>`
      + `<span style="color:#6B7280;font-size:12.5px">k = 2 에서 부피 8배 — 100g 모형의 2배 크기는 800g.
      k = 3 이면? 몸무게가 부피를 따라갈 때 다리 단면(넓이)은 k² 뿐이라는 게 문제입니다.</span>`;
  }
  dragOn(cv,{
    hit:p=>Math.hypot(p.x-280, p.y-(250-(34*S.k*0.62+12)*1.4))<24?'k':null,
    move:(h,p)=>{ S.k=Math.max(1,Math.min(3,Math.round((250-p.y)/60+1))); draw(); }
  });
  draw();
  inquiry(root,{ id:'cs', title:'닮음비와 넓이·부피비 — 세제곱의 법칙',
    q:['k 를 1 → 1.5 → 2 → 2.5 → 3 으로 바꾸며 기록하세요.',
       '겉넓이 열과 부피 열이 각각 k 의 몇 제곱인지 확인하세요.',
       '“2배 크기 축소 모형의 무게는 왜 2배가 아닌가”를 세 방향의 곱으로 설명하고, 부피/겉넓이 비가 k 에 비례해 커지는 것이 생물에 어떤 의미인지 적으세요.'],
    cols:['k','길이 배율','겉넓이 배율','부피 배율','k³'],
    hint:'힌트 — 가로·세로·높이 세 방향이 모두 k배. 넓이는 두 방향, 부피는 세 방향의 곱입니다.',
    read:()=>[S.k.toFixed(1),S.k.toFixed(1),(S.k*S.k).toFixed(2),(S.k*S.k*S.k).toFixed(2),(S.k*S.k*S.k).toFixed(2)] });
}

/* ---------- LAB 88 여사건 — 적어도 하나 ---------- */
function complementDemo(root){
  root.innerHTML=`<div class="row"><div class="col">
      <canvas id="cm1" width="380" height="300"></canvas>
      <div class="note" style="margin-top:8px">동전 3개의 모든 경우 8가지입니다.
      <b>「적어도 하나 앞면」에 해당하는 칸을 직접 눌러</b> 고르세요.</div>
    </div>
    <div class="col">
      <div class="ctl"><button class="b t sm" id="cmFlip">여사건으로 뒤집어 보기</button>
        <button class="b g sm" id="cmRst">선택 지우기</button></div>
      <div class="out" id="cmout"></div>
      <div class="note" style="margin-top:12px">「적어도 하나」로 가는 두 갈래 길이 있습니다 — 어느 쪽이 빠르고 안전할까요? 둘 다 걸어 보세요.</div>
    </div></div>`;
  const cv=$('#cm1'),ctx=cv.getContext('2d'),W=380,H=300;
  const CASES=['앞앞앞','앞앞뒤','앞뒤앞','뒤앞앞','앞뒤뒤','뒤앞뒤','뒤뒤앞','뒤뒤뒤'];
  const S={ sel:new Set(), flip:false };
  function draw(){
    ctx.clearRect(0,0,W,H); ctx.fillStyle='#fff'; ctx.fillRect(0,0,W,H);
    CASES.forEach((c,i)=>{
      const x=30+(i%4)*84, y=60+Math.floor(i/4)*100;
      const target=c.includes('앞');
      const on=S.sel.has(i);
      const comp=S.flip && c==='뒤뒤뒤';
      ctx.fillStyle= comp?'#FCE7EB': on?'#DCEFE9':'#F8F9FB';
      ctx.strokeStyle= comp?'#BE123C': on?'#0E9384':'#D1D5DB';
      ctx.lineWidth= (on||comp)?2.2:1.2;
      ctx.beginPath(); ctx.roundRect(x,y,72,76,9); ctx.fill(); ctx.stroke();
      // 동전 3개
      c.split('').forEach((ch,j)=>{
        ctx.fillStyle=ch==='앞'?'#F4C542':'#B9BEC7';
        ctx.beginPath(); ctx.arc(x+18+j*18, y+26, 8, 0, 7); ctx.fill();
        ctx.fillStyle='#374151'; ctx.font='bold 8.5px sans-serif'; ctx.textAlign='center';
        ctx.fillText(ch, x+18+j*18, y+29);
      });
      ctx.fillStyle='#6B7280'; ctx.font='10px sans-serif';
      ctx.fillText('1/8', x+36, y+62);
    });
    ctx.fillStyle='#374151'; ctx.font='bold 13px sans-serif'; ctx.textAlign='center';
    ctx.fillText('동전 3개 던지기 — 전체 8가지', W/2, 32);
    const correct=CASES.map((c,i)=>c.includes('앞')?i:-1).filter(i=>i>=0);
    const allRight=correct.every(i=>S.sel.has(i)) && S.sel.size===correct.length;
    const missed=correct.filter(i=>!S.sel.has(i)).length;
    $('#cmout').innerHTML = S.flip
      ? `<b>여사건의 길</b> — 「적어도 하나 앞면」의 반대는 <b>「모두 뒷면」 1칸(빨강)</b><br>
         <span class="mono">P = 1 − 1/8 = <b>7/8</b></span> — 고를 것도, 빠뜨릴 것도 없습니다.`
      : `직접 고른 칸: <b>${S.sel.size}개</b> / 정답 7개
         ${allRight?'<b style="color:#0E9384">— 전부 골랐습니다! P = 7/8</b>'
           :missed>0&&S.sel.size>0?`<span style="color:#B45309">— 아직 ${missed}칸 빠졌습니다 (빠뜨리기 쉬운 게 직접 세기의 함정)</span>`:''}
         <br><span style="color:#6B7280;font-size:12.5px">다 고른 뒤 「여사건으로 뒤집어 보기」와 견줘 보세요.</span>`;
  }
  cv.style.touchAction='none';
  cv.addEventListener('pointerdown',e=>{
    const r=cv.getBoundingClientRect();
    const x=(e.clientX-r.left)*W/r.width, y=(e.clientY-r.top)*H/r.height;
    CASES.forEach((c,i)=>{
      const bx=30+(i%4)*84, by=60+Math.floor(i/4)*100;
      if(x>bx&&x<bx+72&&y>by&&y<by+76){
        if(S.sel.has(i)) S.sel.delete(i); else S.sel.add(i);
        S.flip=false; draw();
      }
    });
  });
  $('#cmFlip').onclick=()=>{ S.flip=!S.flip; draw(); };
  $('#cmRst').onclick=()=>{ S.sel.clear(); S.flip=false; draw(); };
  draw();
  inquiry(root,{ id:'cm', title:'여사건 — 「적어도 하나」의 지름길',
    q:['「적어도 하나 앞면」을 직접 골라 세고, 여사건 길과 비교해 기록하세요. 「적어도 두 개 앞면」도 두 길로 세어 보세요.',
       '직접 세기에서 빠뜨린 칸이 있었는지 되돌아보고, 여사건 길에는 왜 빠뜨림이 없는지 적으세요.',
       '동전 10개일 때 「적어도 하나 앞면」을 두 방법으로 식만 세워 보세요 — 직접 세기가 왜 사실상 불가능한지 체감될 것입니다. (여사건: 1 − 1/1024)'],
    cols:['사건','직접 센 칸 수','여사건 칸 수','확률','어느 길이 빨랐나'],
    hint:'힌트 — 「적어도 하나」의 반대는 언제나 「하나도 없다」입니다. 반대쪽이 훨씬 단순할 때 여사건이 이깁니다.',
    read:()=>{ const correct=CASES.filter(c=>c.includes('앞')).length;
      return ['적어도 하나 앞면', S.sel.size, 1, '7/8', S.flip?'여사건':'직접']; } });
}

/* ---------- LAB 89 독립시행 — 도박사의 오류 ---------- */
function indepDemo(root){
  root.innerHTML=`<div class="row"><div class="col">
      <canvas id="id1" width="380" height="300"></canvas>
      <div class="ctl" style="display:flex;gap:6px;flex-wrap:wrap;margin-top:8px">
        <button class="b t" id="idFlip">동전 던지기</button>
        <button class="b t sm" id="idF20">20번 연달아</button>
        <button class="b g sm" id="idRst">기록 지우기</button>
      </div>
    </div>
    <div class="col">
      <div class="out" id="idout"></div>
      <div class="note" style="margin-top:12px">동전은 <b>기억이 없습니다</b>. 앞면이 다섯 번
      연속 나온 뒤에도 다음이 앞면일 확률은 그대로 1/2 — “이제 뒷면이 나올 때가 됐다”는
      느낌(도박사의 오류)을 데이터로 검증해 보세요.</div>
    </div></div>`;
  const cv=$('#id1'),ctx=cv.getContext('2d'),W=380,H=300;
  const S={ seq:[], afterRun:{h:0,t:0} };            // afterRun: 앞면 3연속 직후의 결과 집계
  function draw(){
    ctx.clearRect(0,0,W,H); ctx.fillStyle='#fff'; ctx.fillRect(0,0,W,H);
    // 최근 40개 기록 띠
    const recent=S.seq.slice(-40);
    recent.forEach((v,i)=>{
      const x=24+(i%20)*17, y=50+Math.floor(i/20)*30;
      ctx.fillStyle=v?'#F4C542':'#B9BEC7';
      ctx.beginPath(); ctx.arc(x,y,7,0,7); ctx.fill();
      ctx.fillStyle='#374151'; ctx.font='bold 8px sans-serif'; ctx.textAlign='center';
      ctx.fillText(v?'앞':'뒤', x, y+3);
    });
    // 연속 표시
    let run=0; for(let i=S.seq.length-1;i>=0&&S.seq[i]===S.seq[S.seq.length-1];i--) run++;
    ctx.fillStyle='#374151'; ctx.font='bold 13px sans-serif'; ctx.textAlign='center';
    ctx.fillText(S.seq.length?('지금 '+(S.seq[S.seq.length-1]?'앞면':'뒷면')+' '+run+'연속'):'동전을 던져 보세요', W/2, 26);
    // 3연속 직후 집계 막대
    const tot=S.afterRun.h+S.afterRun.t;
    ctx.fillStyle='#6B7280'; ctx.font='11px sans-serif'; ctx.textAlign='left';
    ctx.fillText('「앞면 3연속」 바로 다음 결과의 집계 — 뒷면이 나올 때가 됐을까?', 24, 140);
    const bw=140;
    [['다음도 앞면',S.afterRun.h,'#F4C542'],['다음은 뒷면',S.afterRun.t,'#B9BEC7']].forEach((q,i)=>{
      const y=158+i*40, w=tot?bw*q[1]/Math.max(S.afterRun.h,S.afterRun.t,1):0;
      ctx.fillStyle='#F3F4F6'; ctx.fillRect(120,y,bw,18);
      ctx.fillStyle=q[2]; ctx.fillRect(120,y,w,18);
      ctx.fillStyle='#374151'; ctx.font='11px sans-serif';
      ctx.fillText(q[0], 24, y+13);
      ctx.fillText(q[1]+'회'+(tot?' ('+(q[1]/tot*100).toFixed(0)+'%)':''), 268, y+13);
    });
    $('#idout').innerHTML =
      `던진 횟수 <b>${S.seq.length}</b> · 앞면 ${S.seq.filter(v=>v).length} · 뒷면 ${S.seq.filter(v=>!v).length}<br>`
      + (tot>=8
        ? `앞면 3연속 직후: 앞 ${S.afterRun.h} vs 뒤 ${S.afterRun.t} —
           <b style="color:#0E9384">반반에 가깝습니다. 동전은 기억이 없습니다.</b>`
        : `<span style="color:#6B7280;font-size:12.5px">앞면 3연속이 나온 직후의 결과가 쌓이면(8회 이상) 판정이 뜹니다 — 「20번 연달아」로 모으세요.</span>`);
  }
  function flip(){
    const n=S.seq.length;
    if(n>=3 && S.seq[n-1]&&S.seq[n-2]&&S.seq[n-3]){
      const v=Math.random()<0.5; S.seq.push(v);
      if(v) S.afterRun.h++; else S.afterRun.t++;
    } else S.seq.push(Math.random()<0.5);
  }
  $('#idFlip').onclick=()=>{ flip(); draw(); };
  $('#idF20').onclick=()=>{ for(let i=0;i<20;i++) flip(); draw(); };
  $('#idRst').onclick=()=>{ S.seq=[]; S.afterRun={h:0,t:0}; draw(); };
  draw();
  inquiry(root,{ id:'id', title:'독립시행 — 동전은 기억이 없다',
    q:['「20번 연달아」를 여러 번 눌러 100회 이상 모으고, 중간중간 기록하세요.',
       '「앞면 3연속 직후」의 앞·뒤 비율이 횟수가 쌓일수록 어디로 가는지 확인하세요.',
       '“이제 뒷면이 나올 때가 됐다”는 생각이 왜 틀렸는지, <b>각 시행의 독립</b>이라는 말로 설명하세요. 그런데 “100번 중 앞면이 대략 50번쯤”은 왜 참인지(큰 수의 법칙과의 구분)도 적으세요.'],
    cols:['던진 횟수','3연속 직후 앞','3연속 직후 뒤','그 비율','판정'],
    hint:'힌트 — 독립은 “다음 한 번”에 대한 말이고, 큰 수의 법칙은 “아주 많은 전체”에 대한 말입니다. 둘을 섞는 것이 도박사의 오류입니다.',
    read:()=>{ const tot=S.afterRun.h+S.afterRun.t;
      return [S.seq.length, S.afterRun.h, S.afterRun.t,
              tot?(S.afterRun.h/tot*100).toFixed(0)+'%':'—',
              tot>=8?(Math.abs(S.afterRun.h/tot-0.5)<0.2?'반반 근처':'더 모으기'):'표본 부족']; } });
}

/* ---------- LAB 90 조건이 붙으면 확률이 달라진다 ---------- */
function condProbDemo(root){
  root.innerHTML=`<div class="row"><div class="col">
      <canvas id="cp1" width="380" height="300"></canvas>
      <div class="ctl" style="display:flex;gap:6px;flex-wrap:wrap;margin-top:8px">
        <button class="b g sm" id="cpAll">조건 없음 — 전체에서</button>
        <button class="b t sm" id="cpG">조건: 여학생이다</button>
        <button class="b t sm" id="cpGl">조건: 안경을 썼다</button>
      </div>
    </div>
    <div class="col">
      <div class="out" id="cpout"></div>
      <div class="note" style="margin-top:12px">조건이 붙으면 화면의 무엇이 줄어드나요? 그 변화가 확률 계산의 어디에 들어갈까요?</div>
    </div></div>`;
  const cv=$('#cp1'),ctx=cv.getContext('2d'),W=380,H=300;
  // 학급 24명: 남 14(안경 6), 여 10(안경 5)
  const STU=[];
  for(let i=0;i<24;i++) STU.push({g:i<14?'남':'여', gl:(i<6)||(i>=14&&i<19)});
  const S={ cond:'all' };
  function draw(){
    ctx.clearRect(0,0,W,H); ctx.fillStyle='#fff'; ctx.fillRect(0,0,W,H);
    const inCond=s=> S.cond==='all' || (S.cond==='g'&&s.g==='여') || (S.cond==='gl'&&s.gl);
    STU.forEach((s,i)=>{
      const x=40+(i%8)*40, y=60+Math.floor(i/8)*74;
      const dim=!inCond(s);
      ctx.globalAlpha=dim?0.13:1;
      // 사람 아이콘
      ctx.fillStyle=s.g==='여'?'#DB2777':'#2563EB';
      ctx.beginPath(); ctx.arc(x,y,10,0,7); ctx.fill();
      ctx.fillRect(x-9,y+13,18,22);
      if(s.gl){ ctx.strokeStyle='#111827'; ctx.lineWidth=1.6;
        ctx.beginPath(); ctx.arc(x-4,y-1,3.4,0,7); ctx.stroke();
        ctx.beginPath(); ctx.arc(x+4,y-1,3.4,0,7); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(x-1,y-1); ctx.lineTo(x+1,y-1); ctx.stroke(); }
      ctx.globalAlpha=1;
    });
    const den=STU.filter(inCond).length;
    const num=STU.filter(s=>inCond(s)&&s.gl&&s.g==='여').length;
    const evtName='안경 쓴 여학생';
    ctx.fillStyle='#374151'; ctx.font='bold 12px sans-serif'; ctx.textAlign='center';
    ctx.fillText('우리 반 24명 — 밝게 남은 칸이 지금의 「전체」', W/2, 28);
    const condName=S.cond==='all'?'조건 없음':S.cond==='g'?'여학생':'안경';
    $('#cpout').innerHTML =
      `묻는 것: <b>${evtName}</b>일 확률<br>`
      + `조건: <b>${condName}</b> → 분모(밝은 칸) = <b>${den}</b>명<br>`
      + `<span class="mono">P = ${num} / ${den} = <b>${(num/den).toFixed(3)}</b></span><br>`
      + `<span style="color:#6B7280;font-size:12.5px">${
        S.cond==='all'?'조건을 붙여 보세요 — 분자는 그대로인데 분모가 줄어 확률이 커집니다.'
        :S.cond==='g'?'전체 5/24 ≈ 0.208 이던 것이 여학생 무리에서는 5/10 = 0.5 — 조건이 정보를 더한 것입니다.'
        :'안경 무리 11명 중 여학생 5명 — 같은 사건인데 조건마다 확률이 다릅니다.'}</span>`;
  }
  $('#cpAll').onclick=()=>{ S.cond='all'; draw(); };
  $('#cpG').onclick=()=>{ S.cond='g'; draw(); };
  $('#cpGl').onclick=()=>{ S.cond='gl'; draw(); };
  draw();
  inquiry(root,{ id:'cp', title:'조건이 붙으면 확률이 달라진다',
    q:['세 조건(없음·여학생·안경)에서 「안경 쓴 여학생」의 확률을 각각 기록하세요.',
       '분자와 분모 중 <b>무엇이 변하고 무엇이 그대로인지</b> 표에서 확인하세요.',
       'P(안경|여) 와 P(여|안경) 이 왜 다른 수인지, 각각의 분모가 무엇인지로 손으로 설명하세요. (스팸 필터 LAB 02 의 핵심이 바로 이 구분입니다)'],
    cols:['조건','분모(명)','분자(명)','확률','전체 확률과 비교'],
    hint:'힌트 — 조건부확률의 “조건”은 곧 “새로운 전체”입니다. 세상을 조건 안으로 좁히고 그 안에서 다시 세는 것.',
    read:()=>{ const inCond=s=> S.cond==='all' || (S.cond==='g'&&s.g==='여') || (S.cond==='gl'&&s.gl);
      const den=STU.filter(inCond).length;
      const num=STU.filter(s=>inCond(s)&&s.gl&&s.g==='여').length;
      const base=5/24;
      return [S.cond==='all'?'없음':S.cond==='g'?'여학생':'안경', den, num,
              (num/den).toFixed(3), (num/den>base+0.001?'커짐':num/den<base-0.001?'작아짐':'같음')]; } });
}

/* ---------- LAB 91 확률의 덧셈 — 겹침을 빼라 ---------- */
function probAddDemo(root){
  root.innerHTML=`<div class="row"><div class="col">
      <canvas id="pa2" width="380" height="300"></canvas>
      <div class="note" style="margin-top:8px"><b>두 원을 끌어</b> 겹침을 조절하세요.
      P(A∪B) 계산이 실시간으로 바뀝니다.</div>
    </div>
    <div class="col">
      <div class="out" id="paout"></div>
      <div class="note" style="margin-top:12px">P(A 또는 B) = P(A) + P(B) − <b>P(둘 다)</b>.
      겹침을 빼지 않으면 그 부분을 <b>두 번</b> 세게 되고, 확률이 1 을 넘는 사고가 납니다.
      두 원이 떨어져 있을 때(배반)만 그냥 더할 수 있습니다.</div>
    </div></div>`;
  const cv=$('#pa2'),ctx=cv.getContext('2d'),W=380,H=300;
  // 주사위 배수 모델: A = {2의 배수}, B 는 끌어서 바꾸는 가상 사건 — 넓이 모델로
  const S={ A:{x:140,y:150,r:70}, B:{x:250,y:150,r:58} };
  function overlap(){
    const d=Math.hypot(S.A.x-S.B.x,S.A.y-S.B.y), r1=S.A.r, r2=S.B.r;
    if(d>=r1+r2) return 0;
    if(d<=Math.abs(r1-r2)) return Math.PI*Math.min(r1,r2)**2;
    const a1=r1*r1*Math.acos((d*d+r1*r1-r2*r2)/(2*d*r1));
    const a2=r2*r2*Math.acos((d*d+r2*r2-r1*r1)/(2*d*r2));
    const a3=0.5*Math.sqrt((-d+r1+r2)*(d+r1-r2)*(d-r1+r2)*(d+r1+r2));
    return a1+a2-a3;
  }
  const TOTAL=Math.PI*120*120*0.86;      // 전체 표본공간 넓이(정규화 기준)
  function draw(){
    ctx.clearRect(0,0,W,H); ctx.fillStyle='#fff'; ctx.fillRect(0,0,W,H);
    ctx.strokeStyle='#D1D5DB'; ctx.strokeRect(20,40,W-40,220);
    ctx.fillStyle='#6B7280'; ctx.font='10.5px sans-serif'; ctx.textAlign='left';
    ctx.fillText('전체 (표본공간)', 26, 56);
    ctx.globalAlpha=.30;
    ctx.fillStyle='#2563EB'; ctx.beginPath(); ctx.arc(S.A.x,S.A.y,S.A.r,0,7); ctx.fill();
    ctx.fillStyle='#0E9384'; ctx.beginPath(); ctx.arc(S.B.x,S.B.y,S.B.r,0,7); ctx.fill();
    ctx.globalAlpha=1;
    ctx.strokeStyle='#2563EB'; ctx.lineWidth=2; ctx.beginPath(); ctx.arc(S.A.x,S.A.y,S.A.r,0,7); ctx.stroke();
    ctx.strokeStyle='#0E9384'; ctx.beginPath(); ctx.arc(S.B.x,S.B.y,S.B.r,0,7); ctx.stroke();
    ctx.fillStyle='#2563EB'; ctx.font='bold 13px sans-serif';
    ctx.fillText('A', S.A.x-S.A.r+10, S.A.y-S.A.r+22);
    ctx.fillStyle='#0E9384'; ctx.fillText('B', S.B.x+S.B.r-20, S.B.y-S.B.r+22);
    handle(ctx,S.A.x,S.A.y,'#2563EB',''); handle(ctx,S.B.x,S.B.y,'#0E9384','');
    const pA=Math.PI*S.A.r*S.A.r/TOTAL, pB=Math.PI*S.B.r*S.B.r/TOTAL, pAB=overlap()/TOTAL;
    const wrong=pA+pB, right=pA+pB-pAB;
    $('#paout').innerHTML =
      `P(A) = ${pA.toFixed(2)} · P(B) = ${pB.toFixed(2)} · P(A∩B) = <b>${pAB.toFixed(2)}</b><br>`
      + `그냥 더하면: ${pA.toFixed(2)} + ${pB.toFixed(2)} = <b style="color:${wrong>1?'#BE123C':'#B45309'}">${wrong.toFixed(2)}</b>`
      + (wrong>1?' <b style="color:#BE123C">— 1 을 넘었습니다! 겹침을 두 번 셌습니다</b>':'')
      + `<br>겹침을 빼면: <span class="mono">P(A∪B) = ${pA.toFixed(2)} + ${pB.toFixed(2)} − ${pAB.toFixed(2)} = <b style="color:#0E9384">${right.toFixed(2)}</b></span><br>`
      + `<span style="color:#6B7280;font-size:12.5px">${pAB<0.005?'지금은 배반(겹침 0) — 그냥 더해도 됩니다.':'두 원을 떼어 놓으면(배반) 덧셈만으로 충분해집니다.'}</span>`;
  }
  dragOn(cv,{
    hit:p=>{
      if(Math.hypot(p.x-S.A.x,p.y-S.A.y)<20) return 'A';
      if(Math.hypot(p.x-S.B.x,p.y-S.B.y)<20) return 'B';
      return null;
    },
    move:(h,p)=>{ S[h].x=Math.max(60,Math.min(W-60,p.x)); S[h].y=Math.max(90,Math.min(230,p.y)); draw(); }
  });
  draw();
  inquiry(root,{ id:'pa2', title:'확률의 덧셈 — 겹침을 두 번 세지 마라',
    q:['겹침을 크게·작게·0 으로 바꿔 가며 기록하세요 (6줄 이상).',
       '「그냥 더한 값」이 1 을 넘는 순간이 언제인지, 「빼고 더한 값」은 왜 늘 1 이하인지 확인하세요.',
       '주사위에서 A = 2의 배수, B = 3의 배수일 때 P(A∪B) 를 이 공식으로 구하고(4/6), 6 이 두 번 세어질 뻔한 이유를 적으세요.'],
    cols:['P(A)','P(B)','P(A∩B)','그냥 더함','바르게'],
    hint:'힌트 — 겹치는 부분은 A 에서 한 번, B 에서 한 번 — 벌써 두 번 들어가 있습니다. 한 번은 돌려줘야 합니다.',
    read:()=>{ const pA=Math.PI*S.A.r*S.A.r/TOTAL, pB=Math.PI*S.B.r*S.B.r/TOTAL, pAB=overlap()/TOTAL;
      return [pA.toFixed(2),pB.toFixed(2),pAB.toFixed(2),(pA+pB).toFixed(2),(pA+pB-pAB).toFixed(2)]; } });
}

/* ═══════════════ 실험 사다리 (LAB 25~76) ═══════════════
   조작만 있고 목적이 없으면 실습이 아니다. 모든 중학교 실험실에
   STEP 1(관찰) → 2(도전) → 3(확장) 미션을 걸고, 앞 단계를 넘어야 다음이 열린다.
   달성은 화면 문구를 실험실이 스스로 읽어(re) 자동으로 확인하고,
   자동 감지가 없는 미션은 「해냈어요」 자가 확인으로 넘는다. */

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
      <div class="note" style="margin-top:12px">x³ − 2x² − 5x + 6 을 (x − k) 로 나눕니다. 내리고 → 곱하고 → 더하고 — 이 세 동작만으로 나눗셈이 정말 끝날까요? 마지막 칸의 정체는?</div>
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
      <div class="note" style="margin-top:12px">f(x) = x³ − 4x² + x + 6. 주황 점 a 를 끌면 f(a) 가 즉시 계산됩니다. 대입값과 「실제로 나눈 나머지」 — 둘은 어떤 관계일까요?</div>
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
      <div class="note" style="margin-top:12px">복소수 z = a + bi 는 평면의 점 (a, b). 「× i」를 누르면 점은 어디로 갈까요? 반복하면 어떤 여행을 하게 될까요?</div>
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
      <div class="note" style="margin-top:12px">두 근을 구하지 않고도 알 수 있는 값들이 있을까요? b·c 를 움직이며 합과 곱을 추적해 보세요.</div>
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
        ? `<b style="color:#0E9384">문제 해결! 두 수는 ${rs[0].toFixed(0)} 와 ${rs[1].toFixed(0)} ${S.win>=1?'— <span style=\"color:#B45309\">2연승!</span>':''}</b>`
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
      <div class="note" style="margin-top:12px">부등식의 해는 그래프의 어디에 사는 걸까요? 수직선의 초록 칠과 포물선을 함께 지켜보세요.</div>
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
      <div class="note" style="margin-top:12px">빵 x개·케이크 y개. 제약: x+y ≤ 6 (오븐), x+2y ≤ 8 (반죽). 이익이 최대인 계획은 영역의 어디에 숨어 있을까요? 이익선을 밀며 찾아보세요.</div>
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
      <div class="note" style="margin-top:12px">넷(가·나·다·라) 중 둘 — 회장·부회장 뽑기와 청소 짝 뽑기는 같은 문제일까요? 두 목록을 쌓아 비교해 보세요.</div>
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
      <div class="note" style="margin-top:12px">화살표 두 개(e₁·e₂)를 끌면 도형 F 는 어떻게 반응하나요? 행렬 숫자판과 화살표의 관계를 찾아보세요.</div>
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
      <div class="note" style="margin-top:12px">같은 두 변환을 두 판에 서로 반대 순서로 적용하면 — 결과는 같을까요, 다를까요? 먼저 걸고 시험하세요.</div>
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
      <div class="note" style="margin-top:12px">카드를 좌우로 끌어 책상 끝 너머로 내밀어 보세요. 언제 무너지고 언제 버틸까요? 목표: 맨 위 카드를 통째로 책상 밖에 띄우기.</div>
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
      <div id="clQz" class="note" style="margin-top:8px">색은 좌표 (R, G, B) — 슬라이더로 점을 옮기면 색이 변합니다. 삼각형 가운데로 갈수록 색은 어떻게 될까요? 왜 그럴까요?</div>
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

/* ============ 카드 썸네일 ============
   외부 이미지 금지(단일 파일 원칙) → 인라인 SVG로 그린다.
   장식이 아니라 그 실험실에서 학생이 실제로 보게 될 수학적 대상을 그린다.

   20장의 톤을 맞추기 위한 공통 규칙 — 새로 추가할 때도 반드시 지킬 것.
     · 선 굵기는 세 단계만: 격자 1.2 / 보조 1.8 / 주선 2.6
     · 그리는 영역은 x 12~108, y 10~54 안쪽 (viewBox 는 120×64)
     · 색 역할 고정: 주 대상 파랑, 보조·정답 초록, 문제 지점 빨강, 안내선 주황, 흐린 것 회색
     · 주인공은 하나. 시선이 갈 곳을 여러 개 두지 않는다
     · 면(fill)을 옅게 깔아 잉크 비율을 10~18%로 맞춘다 — 선만 있으면 작게 줄었을 때 사라진다 */
const TC = { blue:'#2563EB', teal:'#0E9384', rose:'#BE123C', amber:'#B45309',
             ink:'#111827', mute:'#C3CBD6', grid:'#E8ECF2' };
const T_GRID = `stroke="${TC.grid}" stroke-width="1.2" fill="none"`;
const T_THIN = `stroke-width="1.8" fill="none" stroke-linecap="round" stroke-linejoin="round"`;
const T_BOLD = `stroke-width="2.6" fill="none" stroke-linecap="round" stroke-linejoin="round"`;
const svg = (inner, label) =>
  `<svg class="thumb" viewBox="0 0 120 64" role="img" aria-label="${label}">${inner}</svg>`;
/* 좌표축 — 대부분의 그래프형 썸네일이 함께 쓴다 */
const T_AX = `<path d="M14 54 H108 M14 54 V10" ${T_GRID}/>`;

// 파형은 실제 식 y = sin x + 0.4 sin 2x + 0.25 sin 3x 을 그대로 계산해 그린다
const waveD = (() => {
  let d = '';
  for (let i = 0; i <= 72; i++) {
    const x = 14 + i * 92 / 72, t = i / 72 * 4 * Math.PI;
    const y = 32 - (Math.sin(t) + 0.4*Math.sin(2*t) + 0.25*Math.sin(3*t)) / 1.65 * 18;
    d += (i ? 'L' : 'M') + x.toFixed(1) + ' ' + y.toFixed(1);
  }
  return d;
})();

const THUMBS = [

/* 01 GPS — 세 원이 한 점으로 좁혀진다 */
 svg(`<circle cx="40" cy="26" r="21" fill="${TC.blue}" opacity=".07"/>
   <circle cx="40" cy="26" r="21" stroke="${TC.blue}" ${T_THIN} opacity=".85"/>
   <circle cx="76" cy="21" r="19.2" stroke="${TC.teal}" ${T_THIN} opacity=".85"/>
   <circle cx="58" cy="52" r="22.4" stroke="${TC.amber}" ${T_THIN} opacity=".85"/>
   <circle cx="60" cy="30" r="4.6" fill="${TC.rose}"/>`,
   '세 원이 한 점에서 만나 위치가 정해지는 그림'),

/* 02 베이즈 — 사전확률이 사후확률로 갱신된다 */
 svg(`<rect x="22" y="18" width="76" height="8" rx="4" fill="${TC.grid}"/>
   <rect x="22" y="18" width="20" height="8" rx="4" fill="${TC.blue}"/>
   <rect x="22" y="38" width="76" height="8" rx="4" fill="${TC.grid}"/>
   <rect x="22" y="38" width="56" height="8" rx="4" fill="${TC.rose}"/>
   <path d="M60 29 V35 M56.5 32 L60 35.5 L63.5 32" stroke="${TC.ink}" ${T_THIN} opacity=".45"/>`,
   '사전확률 막대가 사후확률로 크게 갱신되는 그림'),

/* 03 확산 — 느리게 시작해 치솟는 S곡선 */
 svg(`${T_AX}
   <path d="M14 54 C42 54 50 18 76 13 S100 10 106 10 V54 Z" fill="${TC.teal}" opacity=".13"/>
   <path d="M14 54 C42 54 50 18 76 13 S100 10 106 10" stroke="${TC.teal}" ${T_BOLD}/>
   <circle cx="55" cy="30" r="4" fill="${TC.teal}"/>`,
   '느리게 시작해 급격히 치솟는 확산 곡선'),

/* 04 손익분기 — 두 직선의 교점 */
 svg(`${T_AX}
   <path d="M16 46 L104 14" stroke="${TC.blue}" ${T_BOLD}/>
   <path d="M16 22 L104 42" stroke="${TC.teal}" ${T_BOLD}/>
   <path d="M57 31 V54" stroke="${TC.rose}" stroke-width="1.2" stroke-dasharray="3 2.5"/>
   <circle cx="57" cy="31" r="4.6" fill="${TC.rose}"/>`,
   '두 요금제 직선이 한 점에서 만나는 손익분기 그래프'),

/* 05 삼각비 — 올려본각으로 높이를 잰다 */
 svg(`<path d="M12 54 H108" stroke="${TC.grid}" stroke-width="1.2"/>
   <rect x="80" y="16" width="20" height="38" fill="${TC.blue}" opacity=".14"/>
   <rect x="80" y="16" width="20" height="38" stroke="${TC.mute}" stroke-width="1.2" fill="none"/>
   <path d="M22 46 H80" stroke="${TC.amber}" stroke-width="1.2" stroke-dasharray="3 2.5"/>
   <path d="M22 46 L90 16" stroke="${TC.blue}" ${T_BOLD}/>
   <path d="M90 46 V16" stroke="${TC.teal}" ${T_THIN}/>
   <path d="M38 46 A16 16 0 0 0 35 39" stroke="${TC.amber}" ${T_THIN}/>
   <circle cx="22" cy="46" r="3.6" fill="${TC.ink}"/>`,
   '지면에서 건물 꼭대기를 올려본각으로 높이를 재는 직각삼각형'),

/* 06 산점도 — 추세선과 이상치 */
 svg(`${T_AX}
   <path d="M18 48 L104 16" stroke="${TC.blue}" ${T_BOLD} opacity=".9"/>
   ${[[26,44],[36,39],[44,42],[54,31],[62,33],[70,24],[80,22],[92,17],[38,28],[76,35]]
     .map(([x,y])=>`<circle cx="${x}" cy="${y}" r="3" fill="${TC.ink}"/>`).join('')}
   <circle cx="99" cy="49" r="4.4" fill="${TC.rose}"/>`,
   '점들이 오른쪽 위로 몰린 산점도와 추세선, 구석의 이상치'),

/* 07 대푯값 — 한 사람만 튄다 */
 svg(`${[3200,3400,3500,3600,3800,3900,4100,4300,4600,9000]
     .map((v,i)=>{ const h=v/9000*34; return `<rect x="${15+i*9.4}" y="${52-h}" width="7" height="${h}" rx="1.5"
       fill="${i===9?TC.rose:TC.mute}"/>`; }).join('')}
   <path d="M12 28 H108" stroke="${TC.blue}" stroke-width="1.8" stroke-dasharray="4 3"/>
   <path d="M12 38 H108" stroke="${TC.teal}" stroke-width="1.8" stroke-dasharray="4 3"/>
   <path d="M12 52 H108" stroke="${TC.grid}" stroke-width="1.2"/>`,
   '한 사람만 크게 튀는 연봉 막대와 평균선·중앙값선'),

/* 08 경우의 수 — 자리 수가 늘수록 폭증 */
 svg(`<path d="M12 54 H108" stroke="${TC.grid}" stroke-width="1.2"/>
   ${[1,2,3,4,5,6,7].map(i=>{ const h=5+i*6;
     return `<rect x="${16+(i-1)*13}" y="${52-h}" width="9" height="${h}" rx="1.5"
       fill="${i===4?TC.rose:TC.blue}" opacity="${i===4?1:.28}"/>`; }).join('')}
   ${[0,1,2,3].map(i=>`<rect x="${17+i*7}" y="10" width="5" height="6" rx="1.2" fill="${TC.blue}"/>`).join('')}`,
   '자리 수가 늘수록 급격히 커지는 경우의 수 막대'),

/* 09 큰 수의 법칙 — 요동치다 수렴 */
 svg(`${T_AX}
   <path d="M14 36 H106" stroke="${TC.amber}" stroke-width="1.8" stroke-dasharray="4 3"/>
   <path d="M17 14 L25 51 L33 21 L41 45 L51 28 L61 39 L73 33 L85 37 L96 35 L105 36"
     stroke="${TC.blue}" ${T_BOLD}/>`,
   '요동치다가 이론 확률선으로 수렴하는 실험 확률 곡선'),

/* 10 정규분포 — 내 점수의 위치 */
 svg(`<path d="M14 52 C36 52 36 13 60 13 C84 13 84 52 106 52 Z" fill="${TC.blue}" opacity=".10"/>
   <path d="M14 52 C36 52 36 13 60 13 L60 52 Z" fill="${TC.blue}" opacity=".18"/>
   <path d="M14 52 C36 52 36 13 60 13 C84 13 84 52 106 52" stroke="${TC.blue}" ${T_BOLD}/>
   <path d="M60 52 V13" stroke="${TC.amber}" stroke-width="1.8" stroke-dasharray="4 3"/>
   <path d="M79 52 V25" stroke="${TC.rose}" ${T_THIN}/>
   <path d="M12 52 H108" stroke="${TC.grid}" stroke-width="1.2"/>`,
   '정규분포 곡선과 평균선, 내 점수 위치'),

/* 11 복리 — 단리 직선과 갈라진다 */
 svg(`${T_AX}
   <path d="M14 50 C46 47 70 34 106 11 L106 54 L14 54 Z" fill="${TC.blue}" opacity=".10"/>
   <path d="M14 50 L106 30" stroke="${TC.mute}" ${T_THIN}/>
   <path d="M14 50 C46 47 70 34 106 11" stroke="${TC.blue}" ${T_BOLD}/>
   <path d="M64 54 V33" stroke="${TC.rose}" stroke-width="1.2" stroke-dasharray="3 2.5"/>
   <circle cx="64" cy="33" r="4.4" fill="${TC.rose}"/>`,
   '단리 직선과 복리 곡선이 벌어지는 그래프와 두 배 지점'),

/* 12 로그 스케일 — 같은 자료, 다른 눈금 */
 svg(`<path d="M12 54 H108" stroke="${TC.grid}" stroke-width="1.2"/>
   ${[1,2,3,4,5].map((v,i)=>{ const h=8+i*8;
     return `<rect x="${16+i*10}" y="${52-h}" width="7" height="${h}" rx="1.5" fill="${TC.blue}"/>`; }).join('')}
   <path d="M68 14 V52" stroke="${TC.grid}" stroke-width="1.2"/>
   ${[1,10,100,1000,10000].map((v,i)=>{ const h=Math.max(1.4, v/10000*40);
     return `<rect x="${74+i*7}" y="${52-h}" width="5" height="${h}" rx="1" fill="${TC.mute}"/>`; }).join('')}`,
   '로그 눈금과 보통 눈금에서 같은 자료가 다르게 보이는 비교'),

/* 13 순간속도 — 할선이 접선으로 */
 svg(`${T_AX}
   <path d="M14 52 C40 50 60 40 104 11 L104 54 L14 54 Z" fill="${TC.blue}" opacity=".08"/>
   <path d="M14 52 C40 50 60 40 104 11" stroke="${TC.blue}" ${T_BOLD}/>
   <path d="M26 51 L100 20" stroke="${TC.amber}" ${T_THIN}/>
   <path d="M34 51 L96 15" stroke="${TC.rose}" stroke-width="1.8" stroke-dasharray="4 3" fill="none"/>
   <circle cx="56" cy="38" r="4.2" fill="${TC.ink}"/>
   <circle cx="87" cy="24" r="3.4" fill="${TC.amber}"/>`,
   '곡선 위 할선이 접선으로 다가가는 그림'),

/* 14 룬 — 한 칸 걸러 두 배 */
 svg(`<rect x="13" y="17" width="94" height="32" rx="6" fill="${TC.blue}" opacity=".07"/>
   <rect x="13" y="17" width="94" height="32" rx="6" stroke="${TC.ink}" ${T_THIN} opacity=".75"/>
   ${[0,1,2,3,4,5,6,7].map(i=>{ const dbl=i%2===0;
     return `<rect x="${20+i*10.6}" y="29" width="7" height="12" rx="1.6"
       fill="${dbl?TC.amber:TC.mute}"/>`; }).join('')}
   <path d="M20 25 H27 M23.5 22 L23.5 25" stroke="${TC.amber}" stroke-width="1.2"/>`,
   '카드번호에서 한 칸 걸러 두 배 하는 자리'),

/* 15 회귀 — 잔차가 붙은 직선 */
 svg(`${T_AX}
   ${[[28,48,45.2],[44,37,39.6],[58,35,34.7],[74,25,29.1],[92,21,22.8]]
     .map(([x,y,ly])=>`<path d="M${x} ${y} V${ly}" stroke="${TC.rose}" ${T_THIN}/>`).join('')}
   <path d="M18 51 L104 15" stroke="${TC.blue}" ${T_BOLD}/>
   ${[[28,48],[44,37],[58,35],[74,25],[92,21]]
     .map(([x,y])=>`<circle cx="${x}" cy="${y}" r="3.2" fill="${TC.ink}"/>`).join('')}`,
   '점들 사이를 지나는 직선과 빨간 잔차'),

/* 16 경사하강 — 골짜기를 내려간다 */
 svg(`<path d="M18 12 Q60 66 102 12 L102 54 L18 54 Z" fill="${TC.blue}" opacity=".08"/>
   <path d="M18 12 Q60 66 102 12" stroke="${TC.blue}" ${T_BOLD}/>
   ${[[29,25],[40,34],[51,39]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="3.2" fill="${TC.amber}" opacity=".6"/>`).join('')}
   <circle cx="60" cy="41" r="4.8" fill="${TC.rose}"/>
   <path d="M12 54 H108" stroke="${TC.grid}" stroke-width="1.2"/>`,
   '포물선을 따라 최솟값으로 내려가는 점'),

/* 17 몬테카를로 — 사분원 안팎의 점 */
 svg(`<rect x="36" y="10" width="44" height="44" fill="${TC.teal}" opacity=".07"/>
   <rect x="36" y="10" width="44" height="44" stroke="${TC.grid}" stroke-width="1.2" fill="none"/>
   <path d="M36 10 A44 44 0 0 1 80 54" stroke="${TC.ink}" ${T_THIN} opacity=".8"/>
   ${[[44,20],[55,26],[47,41],[66,30],[41,48],[59,15],[50,34]]
     .map(([x,y])=>`<circle cx="${x}" cy="${y}" r="2.8" fill="${TC.teal}"/>`).join('')}
   ${[[73,17],[77,29],[70,13]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="2.8" fill="${TC.mute}"/>`).join('')}`,
   '사분원 안팎에 흩뿌려진 점들'),

/* 18 코사인 유사도 — 두 벡터의 사잇각 */
 svg(`<path d="M24 50 L96 16 L88 40 Z" fill="${TC.blue}" opacity=".09"/>
   <path d="M24 50 L96 16" stroke="${TC.blue}" ${T_BOLD}/>
   <path d="M24 50 L88 40" stroke="${TC.teal}" ${T_BOLD}/>
   <path d="M46 45 A24 24 0 0 0 43 37" stroke="${TC.amber}" ${T_THIN}/>
   <circle cx="24" cy="50" r="3.4" fill="${TC.ink}"/>`,
   '원점에서 뻗은 두 벡터와 사잇각'),

/* 19 합성곱 — 커널이 지나가면 윤곽이 남는다 */
 svg(`${[0,1,2].map(r => [0,1,2].map(c =>
     `<rect x="${14+c*10}" y="${19+r*10}" width="8.6" height="8.6" rx="1.5"
       fill="${r===1&&c===1 ? TC.blue : TC.blue}" opacity="${r===1&&c===1?1:.22}"/>`).join('')).join('')}
   <path d="M50 33 H64 M60 29 L64 33 L60 37" stroke="${TC.ink}" ${T_THIN} opacity=".5"/>
   ${[0,1,2,3].map(r => [0,1,2,3].map(c => {
     const edge = (r===0||r===3||c===0||c===3);
     return `<rect x="${72+c*9}" y="${19+r*9}" width="7.6" height="7.6" rx="1.2"
       fill="${edge ? TC.ink : TC.grid}" opacity="${edge?.9:1}"/>`;}).join('')).join('')}`,
   '3×3 커널이 이미지에 적용되어 윤곽이 드러나는 그림'),

/* 20 파형 — 배음이 겹친 합성파 */
 svg(`<path d="M12 32 H108" stroke="${TC.grid}" stroke-width="1.2"/>
   <path d="${waveD}" stroke="${TC.blue}" ${T_BOLD}/>`,
   '기본음과 배음이 합쳐진 울퉁불퉁한 파형'),

/* 21 y=x 대칭 — 원함수와 역함수가 대각선에 접힌다 */
 svg(`<path d="M14 54 H106 M14 54 V10" ${T_GRID}/>
   <path d="M14 50 L104 12" stroke="${TC.amber}" stroke-width="1.8" stroke-dasharray="4 3" fill="none"/>
   <path d="M30 52 C46 40 54 28 60 14" stroke="${TC.blue}" ${T_BOLD}/>
   <path d="M18 40 C34 34 50 26 66 22" stroke="${TC.teal}" ${T_BOLD}/>
   <path d="M52 24 L34 42" stroke="${TC.rose}" stroke-width="1.2" stroke-dasharray="3 2.5"/>
   <circle cx="52" cy="24" r="3.6" fill="${TC.blue}"/>
   <circle cx="34" cy="42" r="3.6" fill="${TC.teal}"/>`,
   '원함수와 역함수가 y = x 대각선에 대칭인 그래프와 뒤바뀐 대응점'),

/* 22 급수 — 부분합이 극한선에 붙는다 */
 svg(`${T_AX}
   <path d="M14 22 H106" stroke="${TC.amber}" stroke-width="1.8" stroke-dasharray="4 3"/>
   <path d="M18 50 L28 34 L38 27 L50 24 L62 23 L76 22.4 L92 22.1 L106 22"
     stroke="${TC.blue}" ${T_BOLD}/>
   ${[[18,50],[28,34],[38,27],[50,24],[62,23]].map(([x,y])=>
     `<circle cx="${x}" cy="${y}" r="2.8" fill="${TC.blue}"/>`).join('')}`,
   '부분합이 점점 극한선에 다가가는 그래프'),

/* 23 테일러 — 근사가 원함수에 붙는다 */
 svg(`<path d="M12 32 H108 M60 8 V56" ${T_GRID}/>
   <path d="M14 46 C30 12 46 12 60 32 C74 52 90 52 106 18" stroke="${TC.blue}" ${T_BOLD}/>
   <path d="M26 54 C40 16 50 14 60 32 C70 50 78 48 88 14" stroke="${TC.rose}"
     stroke-width="1.8" fill="none" stroke-dasharray="5 3"/>
   <circle cx="60" cy="32" r="3.6" fill="${TC.ink}"/>`,
   '원함수 곡선에 붉은 근사 곡선이 원점 근처에서 겹치는 그림'),

/* 24 회전체 — 원판을 쌓아 부피를 잰다 */
 svg(`<path d="M10 32 H110" stroke="${TC.grid}" stroke-width="1.2"/>
   ${[0,1,2,3,4,5].map(i=>{ const x=18+i*15, r=4+i*3.2;
     return `<rect x="${x}" y="${32-r}" width="13" height="${r*2}" rx="1.5"
       fill="${TC.blue}" opacity=".18" stroke="${TC.blue}" stroke-width="1"/>`;}).join('')}
   <path d="M18 28 L108 12" stroke="${TC.blue}" ${T_BOLD}/>
   <path d="M18 36 L108 52" stroke="${TC.blue}" stroke-width="1.8" fill="none" opacity=".45"/>`,
   '곡선을 축 둘레로 돌려 만든 회전체를 원판으로 쌓은 그림')
,

/* 25 소인수분해 — N 이 두 소수로 갈라지는 나무 */
 svg(`<rect x="46" y="10" width="28" height="15" rx="4" fill="${TC.blue}" opacity=".12"/>
   <rect x="46" y="10" width="28" height="15" rx="4" stroke="${TC.blue}" ${T_THIN}/>
   <path d="M56 25 L32 40 M64 25 L88 40" stroke="${TC.mute}" ${T_THIN}/>
   <rect x="18" y="40" width="26" height="14" rx="4" fill="${TC.teal}" opacity=".14"/>
   <rect x="18" y="40" width="26" height="14" rx="4" stroke="${TC.teal}" ${T_THIN}/>
   <rect x="76" y="40" width="26" height="14" rx="4" fill="${TC.teal}" opacity=".14"/>
   <rect x="76" y="40" width="26" height="14" rx="4" stroke="${TC.teal}" ${T_THIN}/>`,
   '큰 수가 두 소수로 갈라지는 소인수분해 나무'),

/* 26 정수 — 수직선 위에서 음수 쪽으로 갔다가 되돌아오는 화살표 */
 svg(`<path d="M12 38 H108" stroke="${TC.mute}" ${T_THIN}/>
   <path d="M60 32 V44" stroke="${TC.ink}" stroke-width="1.8"/>
   <path d="M30 33 V43 M44 34 V42 M76 34 V42 M92 33 V43" ${T_GRID}/>
   <rect x="30" y="20" width="30" height="10" fill="${TC.rose}" opacity=".10"/>
   <path d="M30 25 H74" stroke="${TC.teal}" ${T_BOLD}/>
   <path d="M74 25 l-7 -4 v8 z" fill="${TC.teal}"/>
   <circle cx="30" cy="38" r="4" fill="${TC.rose}"/>`,
   '수직선 위 음수에서 오른쪽으로 이동하는 화살표'),

/* 27 문자와 식 — 성냥개비 정사각형이 이어지며 늘어나는 규칙 */
 svg(`<path d="M16 20 H40 V44 H16 Z" stroke="${TC.blue}" ${T_THIN}/>
   <path d="M40 20 H64 V44 H40" stroke="${TC.blue}" ${T_THIN}/>
   <path d="M64 20 H88 V44 H64" stroke="${TC.blue}" ${T_THIN}/>
   <rect x="16" y="20" width="24" height="24" fill="${TC.blue}" opacity=".08"/>
   <path d="M16 20 V44" stroke="${TC.amber}" ${T_BOLD}/>
   <path d="M96 26 h8 M96 32 h8 M96 38 h8" stroke="${TC.mute}" ${T_THIN}/>`,
   '성냥개비 정사각형이 옆으로 이어지며 늘어나는 규칙'),

/* 28 저울 — 양팔이 수평으로 균형을 이룬 등식 */
 svg(`<path d="M60 14 V40 M44 40 H76" stroke="${TC.mute}" ${T_THIN}/>
   <path d="M16 20 H104" stroke="${TC.ink}" ${T_BOLD}/>
   <path d="M16 20 V27 M104 20 V27" stroke="${TC.mute}" ${T_GRID}/>
   <rect x="6" y="27" width="30" height="15" rx="3" fill="${TC.blue}" opacity=".14"/>
   <rect x="6" y="27" width="30" height="15" rx="3" stroke="${TC.blue}" ${T_THIN}/>
   <rect x="84" y="27" width="30" height="15" rx="3" fill="${TC.teal}" opacity=".14"/>
   <rect x="84" y="27" width="30" height="15" rx="3" stroke="${TC.teal}" ${T_THIN}/>
   <path d="M52 47 H68" stroke="${TC.mute}" ${T_THIN}/>`,
   '양팔이 수평으로 균형을 이룬 저울'),

/* 29 반비례 — xy 가 일정한 굽은 선과 넓이가 같은 두 직사각형 */
 svg(`${T_AX}
   <rect x="14" y="22" width="22" height="32" fill="${TC.amber}" opacity=".12"/>
   <rect x="14" y="40" width="44" height="14" fill="${TC.teal}" opacity=".12"/>
   <path d="M20 14 C40 14 34 50 104 50" stroke="${TC.amber}" ${T_BOLD}/>
   <circle cx="36" cy="22" r="3.4" fill="${TC.rose}"/>
   <circle cx="58" cy="40" r="3.4" fill="${TC.rose}"/>`,
   '곱이 일정한 반비례 곡선과 넓이가 같은 두 직사각형'),

/* 30 평행선과 각 — 평행한 두 직선을 가로지르는 횡단선의 동위각 */
 svg(`<path d="M12 22 H108 M12 46 H108" stroke="${TC.blue}" ${T_THIN}/>
   <path d="M34 58 L82 10" stroke="${TC.amber}" ${T_BOLD}/>
   <path d="M58 22 a12 12 0 0 0 -8 -11" stroke="${TC.rose}" ${T_THIN}/>
   <path d="M46 46 a12 12 0 0 0 -8 -11" stroke="${TC.teal}" ${T_THIN}/>
   <circle cx="58" cy="22" r="2.6" fill="${TC.ink}"/>
   <circle cx="46" cy="46" r="2.6" fill="${TC.ink}"/>`,
   '평행한 두 직선을 가로지르는 횡단선과 동위각'),

/* 31 합동 — 같은 조건인데 겹치지 않는 두 삼각형 (SSA 반례) */
 svg(`<path d="M20 50 H88 L34 16 Z" fill="${TC.blue}" opacity=".10"/>
   <path d="M20 50 H88 L34 16 Z" stroke="${TC.blue}" ${T_THIN}/>
   <path d="M20 50 H88 L62 22 Z" fill="${TC.rose}" opacity=".10"/>
   <path d="M20 50 H88 L62 22 Z" stroke="${TC.rose}" ${T_BOLD}/>
   <path d="M20 50 L74 10" stroke="${TC.mute}" ${T_GRID}/>
   <circle cx="34" cy="16" r="2.8" fill="${TC.blue}"/>
   <circle cx="62" cy="22" r="2.8" fill="${TC.rose}"/>`,
   '같은 조건인데 겹치지 않는 두 삼각형 — SSA 반례'),

/* 32 부채꼴 — 중심각이 잘라낸 부채꼴과 그만큼의 호 */
 svg(`<circle cx="46" cy="32" r="21" stroke="${TC.grid}" ${T_THIN}/>
   <path d="M46 32 L67 32 A21 21 0 0 0 56 13 Z" fill="${TC.blue}" opacity=".16"/>
   <path d="M46 32 L67 32 M46 32 L56 13" stroke="${TC.mute}" ${T_THIN}/>
   <path d="M67 32 A21 21 0 0 0 56 13" stroke="${TC.blue}" ${T_BOLD}/>
   <rect x="80" y="20" width="28" height="7" rx="3" fill="${TC.grid}"/>
   <rect x="80" y="20" width="13" height="7" rx="3" fill="${TC.blue}"/>
   <rect x="80" y="36" width="28" height="7" rx="3" fill="${TC.grid}"/>
   <rect x="80" y="36" width="13" height="7" rx="3" fill="${TC.teal}"/>`,
   '중심각이 잘라낸 부채꼴과 같은 비율의 두 막대'),

/* 33 대푯값 — 봉우리(최빈값)와 어긋난 평균 눈금 */
 svg(`<path d="M14 54 H108" ${T_GRID}/>
   <rect x="18" y="44" width="12" height="10" fill="${TC.mute}" opacity=".6"/>
   <rect x="32" y="36" width="12" height="18" fill="${TC.mute}" opacity=".6"/>
   <rect x="46" y="16" width="12" height="38" fill="${TC.teal}" opacity=".85"/>
   <rect x="60" y="40" width="12" height="14" fill="${TC.mute}" opacity=".6"/>
   <rect x="74" y="46" width="12" height="8" fill="${TC.mute}" opacity=".6"/>
   <path d="M68 10 V54" stroke="${TC.rose}" stroke-width="1.8" stroke-dasharray="4 3" fill="none"/>`,
   '가장 높은 막대와 어긋난 자리에 있는 평균 눈금'),

/* 34 히스토그램 — 계급 폭이 다른 두 그래프가 다른 인상을 준다 */
 svg(`<path d="M14 54 H108" ${T_GRID}/>
   <rect x="16" y="42" width="10" height="12" fill="${TC.blue}" opacity=".22"/>
   <rect x="27" y="30" width="10" height="24" fill="${TC.blue}" opacity=".35"/>
   <rect x="38" y="20" width="10" height="34" fill="${TC.blue}" opacity=".55"/>
   <rect x="49" y="34" width="10" height="20" fill="${TC.blue}" opacity=".35"/>
   <rect x="70" y="26" width="18" height="28" fill="${TC.rose}" opacity=".18"/>
   <rect x="70" y="26" width="18" height="28" stroke="${TC.rose}" ${T_THIN}/>
   <rect x="89" y="38" width="18" height="16" fill="${TC.rose}" opacity=".18"/>
   <rect x="89" y="38" width="18" height="16" stroke="${TC.rose}" ${T_THIN}/>`,
   '계급 폭이 다른 두 히스토그램이 나란히 놓인 그림')
,

/* 35 최대공약수·최소공배수 — 맞물린 두 톱니바퀴 */
 svg(`<circle cx="42" cy="32" r="17" fill="${TC.blue}" opacity=".10"/>
   <circle cx="42" cy="32" r="17" stroke="${TC.blue}" ${T_THIN}/>
   ${[0,1,2,3,4,5,6,7].map(i=>{const a=i*Math.PI/4;
     return `<path d="M${(42+Math.cos(a)*17).toFixed(1)} ${(32+Math.sin(a)*17).toFixed(1)}
       L${(42+Math.cos(a)*22).toFixed(1)} ${(32+Math.sin(a)*22).toFixed(1)}"
       stroke="${TC.blue}" stroke-width="1.8"/>`;}).join('')}
   <circle cx="84" cy="32" r="13" fill="${TC.teal}" opacity=".10"/>
   <circle cx="84" cy="32" r="13" stroke="${TC.teal}" ${T_THIN}/>
   ${[0,1,2,3,4,5].map(i=>{const a=i*Math.PI/3;
     return `<path d="M${(84+Math.cos(a)*13).toFixed(1)} ${(32+Math.sin(a)*13).toFixed(1)}
       L${(84+Math.cos(a)*18).toFixed(1)} ${(32+Math.sin(a)*18).toFixed(1)}"
       stroke="${TC.teal}" stroke-width="1.8"/>`;}).join('')}
   <circle cx="42" cy="15" r="2.8" fill="${TC.rose}"/>`,
   '맞물려 돌아가는 큰 톱니바퀴와 작은 톱니바퀴'),

/* 36 작도 — 두 원의 교점으로 정해지는 삼각형 */
 svg(`<circle cx="30" cy="48" r="30" stroke="${TC.blue}" ${T_GRID}/>
   <circle cx="90" cy="48" r="24" stroke="${TC.teal}" ${T_GRID}/>
   <path d="M30 48 H90 L57 21 Z" fill="${TC.rose}" opacity=".09"/>
   <path d="M30 48 H90 L57 21 Z" stroke="${TC.rose}" ${T_BOLD}/>
   <circle cx="57" cy="21" r="3.4" fill="${TC.rose}"/>
   <circle cx="30" cy="48" r="2.6" fill="${TC.ink}"/>
   <circle cx="90" cy="48" r="2.6" fill="${TC.ink}"/>`,
   '두 원의 교점을 이어 작도한 삼각형'),

/* 37 다각형 — 한 점에 모여 360°를 채우는 정육각형 */
 svg(`${[0,1,2].map(t=>{
     const IN=Math.PI*2/3, rot=Math.PI+t*IN, R=17, O=[54,32];
     const C=[O[0]+R*Math.cos(rot+IN/2), O[1]+R*Math.sin(rot+IN/2)];
     const th0=rot+IN/2+Math.PI;
     const pts=[0,1,2,3,4,5].map(i=>{const th=th0+i*Math.PI/3;
       return (C[0]+R*Math.cos(th)).toFixed(1)+' '+(C[1]+R*Math.sin(th)).toFixed(1);}).join(' L');
     const col=[TC.blue,TC.teal,TC.amber][t];
     return `<path d="M${pts} Z" fill="${col}" opacity=".13"/><path d="M${pts} Z" stroke="${col}" ${T_THIN}/>`;
   }).join('')}
   <circle cx="54" cy="32" r="3" fill="${TC.rose}"/>`,
   '한 점에 모여 빈틈 없이 채워지는 정육각형 세 개'),

/* 38 다면체와 회전체 — 입체를 가로로 자른 단면 */
 svg(`<path d="M34 52 L60 12 L86 52 Z" fill="${TC.blue}" opacity=".10"/>
   <path d="M34 52 L60 12 L86 52 Z" stroke="${TC.blue}" ${T_THIN}/>
   <ellipse cx="60" cy="52" rx="26" ry="6" stroke="${TC.blue}" ${T_THIN}/>
   <ellipse cx="60" cy="34" rx="14" ry="3.6" fill="${TC.rose}" opacity=".22"/>
   <ellipse cx="60" cy="34" rx="14" ry="3.6" stroke="${TC.rose}" ${T_BOLD}/>
   <path d="M22 34 H98" stroke="${TC.rose}" stroke-width="1.2" stroke-dasharray="4 3" fill="none"/>`,
   '원뿔을 수평으로 자른 자리에 생기는 원 모양 단면'),

/* 39 겉넓이와 부피 — 직육면체의 전개도 */
 svg(`<rect x="40" y="12" width="26" height="13" fill="${TC.teal}" opacity=".14" stroke="${TC.teal}" ${T_THIN}/>
   <rect x="24" y="25" width="16" height="20" fill="${TC.amber}" opacity=".14" stroke="${TC.amber}" ${T_THIN}/>
   <rect x="40" y="25" width="26" height="20" fill="${TC.blue}" opacity=".18" stroke="${TC.blue}" ${T_THIN}/>
   <rect x="66" y="25" width="16" height="20" fill="${TC.amber}" opacity=".14" stroke="${TC.amber}" ${T_THIN}/>
   <rect x="40" y="45" width="26" height="13" fill="${TC.teal}" opacity=".14" stroke="${TC.teal}" ${T_THIN}/>
   <rect x="82" y="25" width="20" height="20" fill="${TC.blue}" opacity=".10" stroke="${TC.blue}" ${T_GRID}/>`,
   '직육면체의 여섯 면을 펼친 전개도'),

/* 40 줄기와 잎 — 줄기 옆에 잎이 늘어선 그림 */
 svg(`<path d="M40 12 V56" stroke="${TC.mute}" ${T_THIN}/>
   ${[0,1,2,3].map(i=>`<text x="30" y="${21+i*12}" font-size="9" fill="${TC.blue}"
      font-weight="700">${4+i}</text>`).join('')}
   ${[3,5,4,2].map((n,i)=>[...Array(n)].map((_,j)=>
      `<rect x="${46+j*11}" y="${14+i*12}" width="8" height="8" rx="2"
        fill="${TC.teal}" opacity=".${i===1?'55':'30'}"/>`).join('')).join('')}`,
   '줄기 옆에 잎이 늘어선 줄기와 잎 그림'),

/* 41 상대도수 — 크기가 다른 두 집단을 같은 높이로 맞춘 막대 */
 svg(`<path d="M14 54 H108" ${T_GRID}/>
   ${[10,26,38,22,12].map((h,i)=>
     `<rect x="${18+i*18}" y="${54-h*0.55}" width="7" height="${h*0.55}" fill="${TC.blue}" opacity=".7"/>`).join('')}
   ${[9,25,37,23,13].map((h,i)=>
     `<rect x="${26+i*18}" y="${54-h*0.55}" width="7" height="${h*0.55}" fill="${TC.teal}" opacity=".7"/>`).join('')}
   <path d="M14 24 H108" stroke="${TC.rose}" stroke-width="1.2" stroke-dasharray="3 3" fill="none"/>`,
   '크기가 다른 두 집단을 같은 비율로 맞춘 두 색 막대그래프'),

/* 42 통계적 탐구 — 표본이 커질수록 좁아지는 흔들림 */
 svg(`<path d="M14 54 H108 M14 54 V10" ${T_GRID}/>
   <path d="M20 14 C44 14 40 30 104 32" stroke="${TC.mute}" ${T_THIN}/>
   <path d="M20 50 C44 50 40 34 104 32" stroke="${TC.mute}" ${T_THIN}/>
   <path d="M20 32 H104" stroke="${TC.rose}" stroke-width="1.2" stroke-dasharray="4 3" fill="none"/>
   ${[[26,20],[26,45],[46,26],[46,39],[70,30],[70,35],[94,32],[94,33]].map(p=>
     `<circle cx="${p[0]}" cy="${p[1]}" r="2.6" fill="${TC.blue}" opacity=".8"/>`).join('')}`,
   '표본이 커질수록 좁아지는 표본평균의 흔들림'),

/* 43 일차식 — 합칠 수 없는 x 타일과 1 타일 */
 svg(`${[0,1,2].map(i=>
     `<rect x="${16+i*17}" y="18" width="14" height="18" rx="2" fill="${TC.blue}"
       opacity=".20" stroke="${TC.blue}" ${T_THIN}/>`).join('')}
   ${[0,1].map(i=>
     `<rect x="${74+i*13}" y="26" width="10" height="10" rx="2" fill="${TC.teal}"
       opacity=".22" stroke="${TC.teal}" ${T_THIN}/>`).join('')}
   <path d="M62 21 L70 33 M70 21 L62 33" stroke="${TC.rose}" ${T_BOLD}/>
   <path d="M16 46 H64" stroke="${TC.blue}" ${T_THIN}/>
   <path d="M74 46 H97" stroke="${TC.teal}" ${T_THIN}/>`,
   '서로 합칠 수 없는 x 타일 세 개와 1 타일 두 개'),

/* 44 그래프 해석 — 오르고 멈추고 되돌아오는 꺾은선 */
 svg(`${T_AX}
   <path d="M14 50 L38 24 L58 24 L82 12 L108 12" stroke="${TC.blue}" ${T_BOLD}/>
   <rect x="38" y="24" width="20" height="26" fill="${TC.amber}" opacity=".12"/>
   <circle cx="38" cy="24" r="3" fill="${TC.blue}"/>
   <circle cx="58" cy="24" r="3" fill="${TC.blue}"/>
   <path d="M38 24 H58" stroke="${TC.amber}" ${T_BOLD}/>`,
   '오르다가 평평해졌다 다시 오르는 거리-시간 꺾은선'),

/* 45 √2+√3 vs √5 — 두 막대와 한 막대 */
 svg(`<rect x="14" y="16" width="33" height="10" rx="2" fill="${TC.blue}" opacity=".4"/>
   <rect x="47" y="16" width="41" height="10" rx="2" fill="${TC.amber}" opacity=".45"/>
   <rect x="14" y="36" width="53" height="10" rx="2" fill="${TC.teal}" opacity=".45"/>
   <text x="92" y="25" font-size="9" font-weight="800" fill="${TC.ink}">√2+√3</text>
   <text x="71" y="45" font-size="9" font-weight="800" fill="${TC.teal}">√5</text>
   <text x="14" y="58" font-size="9" font-weight="800" fill="${TC.rose}">길이가 다르다!</text>`,
   '√2와 √3을 이어붙인 막대가 √5 막대보다 긴 그림'),

/* 46 테오도루스 나선 */
 svg(`${(()=>{let s='',v={x:1,y:0};const c={x:56,y:36},SC=17;
   for(let k=0;k<8;k++){const L=Math.hypot(v.x,v.y);
     const n={x:v.x-v.y/L,y:v.y+v.x/L};
     s+=`<path d="M${c.x} ${c.y} L${(c.x+v.x*SC).toFixed(1)} ${(c.y-v.y*SC).toFixed(1)}" stroke="${TC.blue}" stroke-width="1.1"/>`;
     s+=`<path d="M${(c.x+v.x*SC).toFixed(1)} ${(c.y-v.y*SC).toFixed(1)} L${(c.x+n.x*SC).toFixed(1)} ${(c.y-n.y*SC).toFixed(1)}" stroke="${TC.amber}" stroke-width="1.1"/>`;
     v=n;}
   return s;})()}
   <circle cx="56" cy="36" r="2.4" fill="${TC.ink}"/>
   <text x="96" y="56" font-size="9" font-weight="800" fill="${TC.teal}">√n</text>`,
   '한 변씩 자라며 감기는 무리수 나선'),

/* 47 합차 암산 — 조각이 옮겨 붙는다 */
 svg(`<rect x="16" y="18" width="40" height="30" fill="${TC.blue}" opacity=".2" stroke="${TC.blue}" stroke-width="1.3"/>
   <rect x="48" y="18" width="8" height="30" fill="${TC.amber}" opacity=".45"/>
   <path d="M60 33 L70 33 M67 30 L70 33 L67 36" stroke="#6B7280" stroke-width="1.3" fill="none"/>
   <rect x="74" y="14" width="32" height="32" fill="${TC.teal}" opacity=".18" stroke="${TC.teal}" stroke-width="1.4"/>
   <rect x="96" y="36" width="10" height="10" fill="#fff" stroke="${TC.rose}" stroke-width="1.2" stroke-dasharray="2 2"/>
   <text x="60" y="60" font-size="9.5" font-weight="800" fill="${TC.ink}" text-anchor="middle">100² − b²</text>`,
   '직사각형 조각이 옮겨 붙어 정사각형에서 모서리만 빠진 그림'),

/* 48 근의 공식 — 포물선과 두 근 마커 */
 svg(`${T_AX}
   <path d="M20 20 Q60 78 100 20" stroke="${TC.blue}" ${T_BOLD} fill="none"/>
   <circle cx="33" cy="44" r="4.2" fill="#fff" stroke="${TC.amber}" stroke-width="2.2"/>
   <circle cx="87" cy="44" r="4.2" fill="#fff" stroke="${TC.amber}" stroke-width="2.2"/>
   <text x="60" y="16" font-size="8.5" font-weight="800" fill="${TC.ink}" text-anchor="middle">x = (−b±√D)/2a</text>`,
   '포물선이 x축과 만나는 두 자리에 마커를 놓는 그림'),

/* 49 판별식 — 세 위치의 수평선 */
 svg(`<path d="M24 54 Q60 6 96 54" stroke="${TC.blue}" ${T_BOLD} fill="none"/>
   <path d="M14 22 H106" stroke="${TC.teal}" stroke-width="1.6"/>
   <path d="M14 30 H106" stroke="${TC.amber}" stroke-width="1.6" stroke-dasharray="4 3"/>
   <path d="M14 44 H106" stroke="${TC.rose}" stroke-width="1.6"/>
   <circle cx="41" cy="44" r="3.4" fill="${TC.rose}"/>
   <circle cx="79" cy="44" r="3.4" fill="${TC.rose}"/>
   <circle cx="60" cy="30" r="3.4" fill="${TC.amber}"/>
   <text x="99" y="18" font-size="8" font-weight="800" fill="${TC.teal}">D&lt;0</text>`,
   '수평선의 높이에 따라 교점이 둘 하나 없음으로 갈리는 그림'),

/* 50 완전제곱식 — 기역자와 모서리 구멍 */
 svg(`<rect x="26" y="14" width="34" height="34" fill="${TC.blue}" opacity=".2" stroke="${TC.blue}" stroke-width="1.4"/>
   <rect x="60" y="14" width="12" height="34" fill="${TC.amber}" opacity=".4" stroke="${TC.amber}" stroke-width="1"/>
   <rect x="26" y="48" width="34" height="12" fill="${TC.amber}" opacity=".4" stroke="${TC.amber}" stroke-width="1"/>
   <rect x="60" y="48" width="12" height="12" fill="none" stroke="${TC.rose}" stroke-width="1.4" stroke-dasharray="2.5 2"/>
   <text x="92" y="34" font-size="9" font-weight="800" fill="${TC.rose}">+(b/2)²</text>`,
   '기역자 타일의 모서리 구멍을 채워 정사각형을 만드는 그림'),

/* 51 평행이동 — 원본과 옮겨 간 포물선 */
 svg(`${T_AX}
   <path d="M20 14 Q38 58 56 14" stroke="${TC.grid}" stroke-width="1.6" fill="none"/>
   <path d="M58 24 Q78 66 98 24" stroke="${TC.teal}" ${T_BOLD} fill="none"/>
   <circle cx="78" cy="45" r="3.8" fill="${TC.amber}"/>
   <path d="M40 34 L66 40 M62 36 L66 40 L61 43" stroke="#6B7280" stroke-width="1.2" fill="none"/>
   <text x="84" y="58" font-size="8.5" font-weight="800" fill="${TC.teal}">(p, q)</text>`,
   '포물선이 꼭짓점을 따라 평행이동한 그림'),

/* 52 울타리 최적화 — 직사각형과 봉우리 그래프 */
 svg(`<rect x="16" y="20" width="32" height="26" fill="${TC.teal}" opacity=".18" stroke="${TC.teal}" stroke-width="1.6"/>
   <path d="M60 54 Q81 8 102 54" stroke="${TC.blue}" ${T_BOLD} fill="none"/>
   <circle cx="81" cy="19" r="3.8" fill="${TC.rose}"/>
   <path d="M81 19 V54" stroke="${TC.grid}" stroke-width="1" stroke-dasharray="2.5 2"/>
   <text x="81" y="63" font-size="8.5" font-weight="800" fill="#6B7280" text-anchor="middle">w=5</text>`,
   '울타리 직사각형과 넓이 그래프의 봉우리'),

/* 53 곱셈공식 넓이 — 네 조각 정사각형 */
 svg(`<rect x="34" y="10" width="30" height="30" fill="${TC.blue}" opacity=".22" stroke="${TC.blue}" stroke-width="1.3"/>
   <rect x="64" y="10" width="16" height="30" fill="${TC.amber}" opacity=".35" stroke="${TC.amber}" stroke-width="1"/>
   <rect x="34" y="40" width="30" height="16" fill="${TC.amber}" opacity=".35" stroke="${TC.amber}" stroke-width="1"/>
   <rect x="64" y="40" width="16" height="16" fill="${TC.teal}" opacity=".35" stroke="${TC.teal}" stroke-width="1"/>
   <text x="94" y="26" font-size="9" font-weight="800" fill="${TC.ink}">a²+2ab</text>
   <text x="94" y="40" font-size="9" font-weight="800" fill="${TC.ink}">+b²</text>`,
   '정사각형이 a² ab ab b² 네 조각으로 나뉜 그림'),

/* 54 특수각 — 사분원과 자석 각 */
 svg(`<path d="M14 54 H74 M14 54 V10" ${T_GRID}/>
   <path d="M74 54 A60 60 0 0 0 14 -6" stroke="${TC.mute}" ${T_THIN}/>
   <path d="M14 54 L66 24" stroke="${TC.blue}" ${T_BOLD}/>
   <path d="M66 54 L66 24" stroke="${TC.teal}" ${T_THIN}/>
   <circle cx="66" cy="24" r="3.6" fill="${TC.amber}"/>
   <text x="86" y="22" font-size="9" font-weight="800" fill="${TC.ink}">30·45·60</text>
   <text x="86" y="36" font-size="9" font-weight="800" fill="${TC.teal}">√3/2</text>`,
   '사분원 위에서 특수각에 자석처럼 붙는 점'),

/* 55 삼각비 표 — 표와 보간 직선 */
 svg(`${T_AX}
   <circle cx="34" cy="42" r="3" fill="${TC.blue}"/>
   <circle cx="58" cy="33" r="3" fill="${TC.blue}"/>
   <circle cx="82" cy="26" r="3" fill="${TC.blue}"/>
   <path d="M58 33 L82 26" stroke="${TC.amber}" stroke-width="1.6" stroke-dasharray="3 2"/>
   <circle cx="70" cy="29.5" r="3.4" fill="none" stroke="${TC.rose}" stroke-width="1.8"/>
   <text x="70" y="16" font-size="8.5" font-weight="800" fill="${TC.rose}" text-anchor="middle">sin 37°?</text>`,
   '표의 두 점 사이를 직선으로 이어 값을 추정하는 그림'),

/* 56 원주각 — 같은 호를 보는 두 자리 */
 svg(`<circle cx="60" cy="34" r="26" stroke="${TC.mute}" ${T_THIN}/>
   <path d="M44 55 A26 26 0 0 0 76 55" stroke="${TC.rose}" stroke-width="2.6" fill="none"/>
   <path d="M44 55 L52 12 L76 55" stroke="${TC.blue}" ${T_THIN}/>
   <path d="M44 55 L74 14 L76 55" stroke="${TC.teal}" ${T_THIN} opacity=".8"/>
   <text x="97" y="22" font-size="9" font-weight="800" fill="${TC.ink}">같은 각</text>`,
   '같은 호를 바라보는 두 원주각이 같은 그림'),

/* 57 접선 — 위성과 가시 호 */
 svg(`<circle cx="42" cy="36" r="20" fill="${TC.teal}" opacity=".12"/>
   <circle cx="42" cy="36" r="20" stroke="${TC.teal}" ${T_THIN}/>
   <path d="M28 22 A20 20 0 0 1 57 25" stroke="${TC.rose}" stroke-width="2.6" fill="none"/>
   <path d="M96 14 L28 22 M96 14 L57 25" stroke="${TC.blue}" ${T_THIN}/>
   <circle cx="96" cy="14" r="3.8" fill="${TC.amber}"/>
   <text x="88" y="52" font-size="9" font-weight="800" fill="${TC.ink}">PA=PB</text>`,
   '위성에서 그은 두 접선과 가시 범위 호'),

/* 58 내접 사각형 — 원과 마주보는 두 각 */
 svg(`<circle cx="60" cy="32" r="25" stroke="${TC.mute}" ${T_THIN}/>
   <path d="M38 42 L50 10 L84 20 L74 54 Z" stroke="${TC.blue}" ${T_THIN} fill="${TC.blue}" fill-opacity=".08"/>
   <circle cx="50" cy="10" r="3" fill="${TC.teal}"/>
   <circle cx="74" cy="54" r="3" fill="${TC.teal}"/>
   <text x="99" y="34" font-size="9" font-weight="800" fill="${TC.ink}">합 180°</text>`,
   '원에 내접한 사각형의 마주보는 두 각'),

/* 59 상자그림 — 상자·수염·이상치 */
 svg(`<path d="M20 32 H38 M80 32 H92" stroke="${TC.ink}" stroke-width="1.6"/>
   <path d="M20 26 V38 M92 26 V38" stroke="${TC.ink}" stroke-width="1.6"/>
   <rect x="38" y="22" width="42" height="20" fill="${TC.blue}" opacity=".16" stroke="${TC.blue}" stroke-width="1.4"/>
   <path d="M56 22 V42" stroke="${TC.teal}" stroke-width="2.4"/>
   <circle cx="104" cy="32" r="3.6" fill="${TC.rose}"/>
   <text x="62" y="56" font-size="8.5" font-weight="800" fill="#6B7280" text-anchor="middle">1.5×IQR 밖 = 이상치</text>`,
   '상자와 수염, 수염 밖에 떨어진 이상치 점'),

/* 60 이상치와 상관 — 추세와 반란 점 */
 svg(`${T_AX}
   <circle cx="28" cy="46" r="2.6" fill="${TC.blue}"/><circle cx="40" cy="41" r="2.6" fill="${TC.blue}"/>
   <circle cx="52" cy="37" r="2.6" fill="${TC.blue}"/><circle cx="64" cy="31" r="2.6" fill="${TC.blue}"/>
   <circle cx="76" cy="27" r="2.6" fill="${TC.blue}"/><circle cx="88" cy="22" r="2.6" fill="${TC.blue}"/>
   <path d="M22 50 L98 17" stroke="${TC.teal}" stroke-width="1.6" stroke-dasharray="4 3"/>
   <circle cx="98" cy="48" r="4.4" fill="${TC.rose}"/>
   <text x="98" y="61" font-size="8.5" font-weight="800" fill="${TC.rose}" text-anchor="middle">r↓</text>`,
   '추세를 따르는 점들과 상관을 무너뜨리는 구석의 이상치'),

 svg(`<rect x="16" y="12" width="88" height="40" rx="4" fill="${TC.blue}" opacity=".06"/>
   ${[0,1,2,3].map(r=>[0,1,2,3,4,5,6,7].map(c=>{
     const n=r*8+c+2, prime=[2,3,5,7,11,13,17,19,23,29,31].includes(n);
     const x=20+c*11, y=17+r*9.5;
     return prime
       ? `<rect x="${x-3.4}" y="${y-3.4}" width="6.8" height="6.8" rx="1.4" fill="${TC.blue}"/>`
       : `<path d="M${x-3} ${y+2.6} L${x+3} ${y-2.6}" stroke="${TC.grid}" stroke-width="1.2"/>`;
   }).join('')).join('')}`,
   '수 격자에서 합성수에 빗금이 가고 소수 칸만 남는 그림'),

 svg(`${T_AX}
   <path d="M14 32 H108" stroke="${TC.grid}" stroke-width="1.2"/>
   <rect x="24" y="18" width="9" height="14" fill="${TC.blue}" opacity=".5"/>
   <rect x="44" y="32" width="9" height="12" fill="${TC.blue}" opacity=".5"/>
   <rect x="64" y="20" width="9" height="12" fill="${TC.blue}" opacity=".5"/>
   <rect x="84" y="32" width="9" height="14" fill="${TC.blue}" opacity=".5"/>
   <circle cx="28.5" cy="44" r="3.4" fill="${TC.amber}"/>
   <circle cx="48.5" cy="20" r="3.4" fill="${TC.amber}"/>
   <circle cx="68.5" cy="46" r="3.4" fill="${TC.amber}"/>
   <circle cx="88.5" cy="18" r="3.4" fill="${TC.amber}"/>
   <path d="M28.5 18 V44 M48.5 20 V44 M68.5 20 V46 M88.5 18 V46" stroke="${TC.rose}" stroke-width="1.3" stroke-dasharray="2 2"/>`,
   '실제 막대와 예측 점 사이의 오차가 위아래로 상쇄되는 그림'),

 svg(`<rect x="40" y="12" width="40" height="40" rx="6" fill="${TC.blue}" opacity=".1"/>
   <rect x="40" y="12" width="40" height="40" rx="6" stroke="${TC.blue}" ${T_BOLD}/>
   <text x="60" y="36" font-size="12" font-weight="800" fill="${TC.ink}" text-anchor="middle">2a+3</text>
   <circle cx="20" cy="32" r="8" fill="${TC.amber}" opacity=".9"/>
   <text x="20" y="36" font-size="10" font-weight="800" fill="#fff" text-anchor="middle">7</text>
   <path d="M30 32 H38" stroke="${TC.amber}" ${T_BOLD}/>
   <path d="M82 32 H92" stroke="${TC.teal}" ${T_BOLD}/>
   <text x="103" y="36" font-size="12" font-weight="800" fill="${TC.teal}" text-anchor="middle">17</text>`,
   '식 자판기에 7이 들어가 17이 나오는 그림'),

 svg(`<path d="M38 14 V50 H74 V14" stroke="${TC.ink}" ${T_BOLD}/>
   <rect x="40" y="30" width="32" height="19" fill="${TC.blue}" opacity=".25"/>
   <circle cx="48" cy="44" r="1.4" fill="#fff"/><circle cx="56" cy="40" r="1.4" fill="#fff"/>
   <circle cx="63" cy="45" r="1.4" fill="#fff"/><circle cx="52" cy="36" r="1.4" fill="#fff"/>
   <rect x="88" y="14" width="10" height="36" fill="${TC.grid}"/>
   <rect x="88" y="36" width="10" height="14" fill="${TC.blue}"/>
   <path d="M84 32 H102" stroke="${TC.rose}" stroke-width="1.6" stroke-dasharray="3 2"/>`,
   '비커 속 소금물과 목표 농도 눈금이 있는 게이지'),

 svg(`<circle cx="40" cy="34" r="26" stroke="${TC.blue}" ${T_THIN} stroke-dasharray="4 3" fill="none"/>
   <circle cx="80" cy="34" r="26" stroke="${TC.teal}" ${T_THIN} stroke-dasharray="4 3" fill="none"/>
   <path d="M40 34 H80" stroke="${TC.ink}" ${T_BOLD}/>
   <circle cx="40" cy="34" r="3" fill="${TC.ink}"/><circle cx="80" cy="34" r="3" fill="${TC.ink}"/>
   <path d="M60 10 V58" stroke="${TC.rose}" ${T_BOLD}/>
   <circle cx="60" cy="17" r="3.2" fill="${TC.rose}"/><circle cx="60" cy="51" r="3.2" fill="${TC.rose}"/>`,
   '두 호의 교점을 이어 선분을 수직으로 반 가르는 그림'),

 svg(`<path d="M20 54 H104" stroke="${TC.ink}" ${T_BOLD}/>
   <path d="M20 54 L96 12" stroke="${TC.ink}" ${T_BOLD}/>
   <path d="M52 54 A32 32 0 0 0 48 38" stroke="${TC.amber}" ${T_THIN} stroke-dasharray="3 2" fill="none"/>
   <circle cx="52" cy="54" r="2.6" fill="${TC.amber}"/><circle cx="48" cy="38" r="2.6" fill="${TC.amber}"/>
   <path d="M20 54 L102 32" stroke="${TC.rose}" ${T_BOLD}/>
   <circle cx="78" cy="38" r="3" fill="${TC.rose}"/>`,
   '각 안에 컴퍼스 호를 긋고 절반을 가르는 빨간 선'),

 svg(`<path d="M16 50 L16 20 A30 30 0 0 1 42 36 Z" fill="${TC.blue}" opacity=".2"/>
   <path d="M16 50 L16 20 A30 30 0 0 1 42 36 Z" stroke="${TC.blue}" ${T_THIN} fill="none"/>
   <path d="M50 34 H58" stroke="${TC.ink}" stroke-width="1.6"/>
   <path d="M56 31 L60 34 L56 37" stroke="${TC.ink}" stroke-width="1.6" fill="none"/>
   ${[0,1,2,3,4,5].map(i=>{
     const x=64+i*7, up=i%2===0;
     return up?`<path d="M${x} 50 L${x+7} 50 L${x+3.5} 22 Z" fill="${TC.teal}" opacity=".3" stroke="${TC.teal}" stroke-width=".8"/>`
              :`<path d="M${x+3.5} 50 L${x} 22 L${x+7} 22 Z" fill="${TC.teal}" opacity=".3" stroke="${TC.teal}" stroke-width=".8"/>`;
   }).join('')}`,
   '부채꼴 조각을 번갈아 붙여 평행사변형이 되는 그림'),

 svg(`<circle cx="60" cy="36" r="3" fill="${TC.ink}"/>
   <path d="M60 36 L38 14 L82 14 Z" fill="${TC.blue}" opacity=".18" stroke="${TC.blue}" stroke-width="1.4"/>
   <path d="M60 36 L22 40 L38 14 Z" fill="${TC.teal}" opacity=".18" stroke="${TC.teal}" stroke-width="1.4"/>
   <path d="M60 36 L82 14 L98 40 Z" fill="${TC.amber}" opacity=".18" stroke="${TC.amber}" stroke-width="1.4"/>
   <path d="M40 52 A22 22 0 0 1 80 52" stroke="${TC.rose}" ${T_THIN} stroke-dasharray="3 2" fill="none"/>
   <text x="60" y="60" font-size="9" font-weight="800" fill="${TC.rose}" text-anchor="middle">&lt; 360°</text>`,
   '한 꼭짓점에 정삼각형 세 장이 모여 각이 360도가 안 되는 그림'),

 svg(`${T_AX}
   <rect x="14" y="18" width="60" height="10" rx="3" fill="${TC.blue}" opacity=".5"/>
   <rect x="14" y="18" width="94" height="10" rx="3" stroke="${TC.grid}" fill="none"/>
   <path d="M78 12 V34" stroke="${TC.ink}" stroke-width="1.6" stroke-dasharray="3 2"/>
   <path d="M14 46 H100" stroke="${TC.ink}" stroke-width="1.4"/>
   <path d="M14 42 H76" stroke="${TC.teal}" stroke-width="3.4"/>
   <circle cx="76" cy="42" r="3.6" fill="${TC.teal}"/>`,
   '예산 게이지와 수직선 위에 칠해진 부등식의 해'),

 svg(`<circle cx="26" cy="14" r="6" fill="${TC.amber}" opacity=".9"/>
   <circle cx="60" cy="12" r="6" fill="${TC.blue}" opacity=".9"/>
   <circle cx="92" cy="14" r="6" fill="${TC.teal}" opacity=".9"/>
   <path d="M26 21 L40 40 M60 19 L60 40 M92 21 L78 40" stroke="${TC.grid}" stroke-width="1.4"/>
   ${[0,1,2,3,4,5,6].map(i=>`<rect x="${18+i*12.5}" y="42" width="10" height="14" rx="2"
      fill="${i===2||i===4||i===5?TC.blue:'#EceEF2'.replace('#EceEF2','#ECEEF2')}" opacity="${i===2||i===4||i===5?'.55':'1'}" stroke="${TC.grid}" stroke-width=".9"/>`).join('')}`,
   '학번 공 세 개가 나머지에 따라 사물함으로 갈라져 들어가는 그림'),

 svg(`<text x="26" y="22" font-size="13" font-weight="800" fill="${TC.ink}">1/7 =</text>
   <text x="60" y="22" font-size="12" fill="${TC.blue}">0.142857…</text>
   ${[3,2,6,4,5,1].map((v,i)=>{
     const a=-Math.PI/2+i*Math.PI/3, x=60+20*Math.cos(a), y=42+14*Math.sin(a);
     return `<circle cx="${x}" cy="${y}" r="6.5" fill="${TC.blue}" opacity=".14"/>
       <circle cx="${x}" cy="${y}" r="6.5" stroke="${TC.blue}" stroke-width="1.2" fill="none"/>
       <text x="${x}" y="${y+3.4}" font-size="8.5" font-weight="700" fill="${TC.ink}" text-anchor="middle">${v}</text>`;
   }).join('')}
   <path d="M60 22 A20 14 0 1 1 59 22" stroke="${TC.rose}" stroke-width="1" fill="none" opacity=".0"/>`,
   '나머지 여섯 개가 원을 이루며 도는 순환의 그림'),

 svg(`<text x="16" y="20" font-size="11" font-family="monospace" fill="${TC.ink}">x  = 0.242424…</text>
   <text x="16" y="36" font-size="11" font-family="monospace" fill="${TC.blue}">100x = 24.2424…</text>
   <path d="M14 42 H106" stroke="${TC.ink}" stroke-width="1.4"/>
   <text x="16" y="56" font-size="11" font-family="monospace" font-weight="800" fill="${TC.teal}">99x = 24</text>
   <rect x="52" y="10" width="44" height="30" rx="3" stroke="${TC.amber}" stroke-width="1.2" stroke-dasharray="3 2" fill="none"/>`,
   '10의 거듭제곱을 곱해 꼬리를 맞추고 빼서 분수가 되는 그림'),

 svg(`${T_AX}
   ${[0,1,2,3,4,5,6].map(i=>{
     const h=2.2*Math.pow(1.62,i);
     return `<rect x="${18+i*13}" y="${54-h}" width="9" height="${h}" rx="1.5" fill="${TC.blue}" opacity="${.25+i*.1}"/>`;
   }).join('')}
   <circle cx="99" cy="13" r="6" fill="${TC.amber}" opacity=".85"/>
   <path d="M96 16 L88 24" stroke="${TC.amber}" stroke-width="1.4"/>`,
   '접을 때마다 두께 막대가 두 배씩 치솟아 달에 닿는 그림'),

 svg(`<path d="M14 22 H106" stroke="${TC.grid}" stroke-width="1.4"/>
   <path d="M14 46 H106" stroke="${TC.grid}" stroke-width="1.4"/>
   <path d="M60 16 V52" stroke="${TC.ink}" stroke-width="1.2"/>
   <circle cx="74" cy="22" r="4" fill="${TC.blue}"/>
   <circle cx="92" cy="22" r="4" fill="${TC.teal}"/>
   <circle cx="46" cy="46" r="4" fill="${TC.blue}"/>
   <circle cx="28" cy="46" r="4" fill="${TC.teal}"/>
   <path d="M74 27 L46 41 M92 27 L28 41" stroke="${TC.rose}" stroke-width="1.3" stroke-dasharray="3 2"/>
   <text x="60" y="12" font-size="9" font-weight="800" fill="${TC.rose}" text-anchor="middle">× (−1)</text>`,
   '음수를 곱하자 두 점이 0을 중심으로 자리를 맞바꾸는 그림'),

 svg(`<path d="M14 50 L48 14" stroke="${TC.blue}" ${T_BOLD}/>
   <path d="M14 20 L48 46" stroke="${TC.teal}" ${T_BOLD}/>
   <circle cx="33" cy="30" r="3.6" fill="${TC.rose}"/>
   <path d="M56 46 L86 18" stroke="${TC.blue}" ${T_BOLD}/>
   <path d="M64 54 L94 26" stroke="${TC.teal}" ${T_BOLD}/>
   <path d="M96 50 L106 14 M96 50 L106 14" stroke="${TC.amber}" stroke-width="3.4" stroke-linecap="round"/>
   <text x="33" y="60" font-size="8.5" fill="${TC.ink3}" text-anchor="middle">1개</text>
   <text x="75" y="60" font-size="8.5" fill="${TC.ink3}" text-anchor="middle">없음</text>
   <text x="101" y="60" font-size="8.5" fill="${TC.ink3}" text-anchor="middle">무수히</text>`,
   '교차하는 두 직선과 평행한 두 직선과 겹친 직선 세 경우'),

 svg(`<text x="18" y="22" font-size="12" font-family="monospace" fill="${TC.blue}">2x + 3y = 12</text>
   <text x="18" y="38" font-size="12" font-family="monospace" fill="${TC.teal}">3x −  y = 7</text>
   <path d="M14 44 H106" stroke="${TC.ink}" stroke-width="1.3"/>
   <text x="18" y="58" font-size="12" font-family="monospace" font-weight="800" fill="${TC.rose}">11y = 22</text>
   <rect x="16" y="10" width="16" height="32" rx="3" stroke="${TC.amber}" stroke-width="1.2" stroke-dasharray="3 2" fill="none"/>`,
   '두 식을 더해 x 가 사라지고 y 만 남는 그림'),

 svg(`${T_AX}
   <path d="M14 44 L106 20" stroke="${TC.grid}" stroke-width="1.4"/>
   <path d="M14 50 L106 26" stroke="${TC.grid}" stroke-width="1.4"/>
   <path d="M14 38 L106 32" stroke="${TC.blue}" opacity=".35" stroke-width="1.6"/>
   <path d="M14 46 L106 12" stroke="${TC.blue}" ${T_BOLD}/>
   <circle cx="38" cy="38" r="4" fill="${TC.blue}"/>
   <circle cx="80" cy="24" r="3.6" fill="${TC.amber}"/>`,
   '절편을 축으로 도는 직선과 평행이동한 잔상들'),

 svg(`${T_AX}
   <text x="20" y="20" font-size="10" font-family="monospace" fill="${TC.ink}">y = 2x − 1</text>
   <path d="M22 52 L100 16" stroke="${TC.teal}" ${T_BOLD}/>
   <circle cx="40" cy="44" r="4.4" fill="#fff" stroke="${TC.amber}" stroke-width="2.2"/>
   <circle cx="82" cy="24" r="4.4" fill="#fff" stroke="${TC.amber}" stroke-width="2.2"/>`,
   '주어진 식에 맞춰 두 점을 끌어 놓은 직선'),

 svg(`<path d="M22 54 L98 50 L58 12 Z" fill="${TC.blue}" opacity=".1"/>
   <path d="M22 54 L98 50 L58 12 Z" stroke="${TC.blue}" ${T_BOLD}/>
   <path d="M22 54 L78 31 M98 50 L40 33 M58 12 L60 52" stroke="${TC.teal}" stroke-width="1.3" stroke-dasharray="4 3"/>
   <circle cx="59.3" cy="38.7" r="4.4" fill="${TC.rose}"/>`,
   '세 중선이 무게중심 한 점에서 만나는 삼각형'),

 svg(`<path d="M24 50 L84 50 L96 16 L36 16 Z" fill="${TC.teal}" opacity=".12"/>
   <path d="M24 50 L84 50 L96 16 L36 16 Z" stroke="${TC.teal}" ${T_BOLD}/>
   <path d="M24 50 L96 16 M84 50 L36 16" stroke="${TC.grid}" stroke-width="1.3" stroke-dasharray="3 2"/>
   <circle cx="60" cy="33" r="4" fill="${TC.rose}"/>
   <path d="M50 36 L56 30 M64 36 L70 30" stroke="${TC.amber}" stroke-width="1.6"/>`,
   '대각선 두 개가 서로를 같은 점에서 반으로 나누는 평행사변형'),

 svg(`<rect x="18" y="36" width="18" height="14" stroke="${TC.blue}" stroke-width="1.6" fill="${TC.blue}" opacity=".15"/>
   <path d="M16 36 L27 26 L38 36" stroke="${TC.blue}" stroke-width="1.6" fill="none"/>
   <rect x="52" y="22" width="36" height="28" stroke="${TC.teal}" stroke-width="1.8" fill="${TC.teal}" opacity=".12"/>
   <path d="M48 22 L70 4 L92 22" stroke="${TC.teal}" stroke-width="1.8" fill="none"/>
   <path d="M70 22 V50 M52 36 H88" stroke="${TC.teal}" stroke-width="1" stroke-dasharray="2 2"/>
   <text x="99" y="40" font-size="10" font-weight="800" fill="${TC.amber}">×4</text>`,
   '2배로 커진 집의 넓이가 타일 4장이 되는 그림'),

 svg(`<circle cx="18" cy="32" r="3.4" fill="${TC.rose}"/>
   <path d="M18 32 L104 12 M18 32 L106 36 M18 32 L98 56" stroke="${TC.grid}" stroke-width="1" stroke-dasharray="3 2"/>
   <path d="M44 26 L52 34 L44 38 Z" fill="${TC.blue}" opacity=".25" stroke="${TC.blue}" stroke-width="1.3"/>
   <path d="M78 18 L96 36 L78 46 Z" fill="${TC.teal}" opacity=".2" stroke="${TC.teal}" stroke-width="1.4"/>
   <text x="18" y="24" font-size="9" font-weight="800" fill="${TC.rose}">O</text>`,
   '중심 O에서 광선이 뻗어 작은 삼각형이 큰 삼각형으로 커지는 그림'),

 svg(`<path d="M34 48 L82 48 L82 18 Z" fill="${TC.blue}" opacity=".15" stroke="${TC.blue}" stroke-width="1.6"/>
   <rect x="34" y="48" width="48" height="10" fill="${TC.blue}" opacity=".35"/>
   <rect x="82" y="18" width="10" height="30" fill="${TC.teal}" opacity=".4"/>
   <path d="M34 48 L82 18 L91 32 L43 62 Z" fill="${TC.rose}" opacity=".25" stroke="${TC.rose}" stroke-width="1.2"/>
   <text x="103" y="36" font-size="10" font-weight="800" fill="${TC.ink}">c²</text>
   <text x="22" y="40" font-size="9" fill="${TC.ink3}">a²+b²</text>`,
   '직각삼각형 세 변 위의 정사각형 넓이가 더해지는 그림'),

 svg(`<path d="M20 54 L64 54 L64 20 Z" stroke="${TC.blue}" ${T_BOLD} fill="${TC.blue}" fill-opacity=".1"/>
   <rect x="56" y="46" width="8" height="8" fill="none" stroke="${TC.teal}" stroke-width="1.6"/>
   <path d="M74 54 L112 54 L96 24 Z" stroke="${TC.amber}" stroke-width="1.8" fill="${TC.amber}" fill-opacity=".12"/>
   <text x="42" y="16" font-size="9" font-weight="800" fill="${TC.teal}">c² = a²+b²</text>
   <text x="90" y="16" font-size="9" font-weight="800" fill="${TC.amber}">c² &gt; ?</text>`,
   '직각 표시가 있는 삼각형과 둔각 삼각형을 견주는 그림'),

 svg(`${T_AX}
   ${[[3,4],[6,8],[5,12],[8,6],[9,12]].map(q=>{
     const x=14+q[0]*6.2, y=54-q[1]*3.2;
     return `<circle cx="${x}" cy="${y}" r="3.6" fill="${TC.teal}"/>`;
   }).join('')}
   ${[[4,7],[7,3],[10,5],[12,9]].map(q=>{
     const x=14+q[0]*6.2, y=54-q[1]*3.2;
     return `<circle cx="${x}" cy="${y}" r="2.2" fill="${TC.grid}"/>`;
   }).join('')}
   <text x="86" y="16" font-size="9" font-weight="800" fill="${TC.teal}">(3,4,5)…</text>`,
   '격자에서 피타고라스 수 자리만 초록 보물로 빛나는 그림'),

 svg(`<circle cx="16" cy="32" r="3.4" fill="${TC.ink}"/>
   <path d="M16 32 L48 14 M16 32 L48 32 M16 32 L48 50" stroke="${TC.blue}" stroke-width="1.6"/>
   ${[14,32,50].map(y=>`<circle cx="48" cy="${y}" r="3" fill="${TC.blue}"/>
     <path d="M48 ${y} L78 ${y-6} M48 ${y} L78 ${y+6}" stroke="${TC.teal}" stroke-width="1.3"/>
     <circle cx="78" cy="${y-6}" r="2.4" fill="${TC.teal}"/>
     <circle cx="78" cy="${y+6}" r="2.4" fill="${TC.teal}"/>`).join('')}
   <text x="94" y="36" font-size="11" font-weight="800" fill="${TC.ink}">3×2</text>`,
   '세 갈래에서 두 갈래씩 다시 뻗는 경우의 수 나무'),

 svg(`<rect x="18" y="38" width="14" height="14" stroke="${TC.blue}" stroke-width="1.4" fill="${TC.blue}" opacity=".2"/>
   <rect x="44" y="24" width="28" height="28" stroke="${TC.teal}" stroke-width="1.6" fill="${TC.teal}" opacity=".15"/>
   <rect x="82" y="16" width="22" height="5" rx="2" fill="${TC.blue}" opacity=".6"/>
   <rect x="82" y="27" width="30" height="5" rx="2" fill="${TC.teal}" opacity=".6"/>
   <rect x="82" y="38" width="38" height="5" rx="2" fill="${TC.amber}" opacity=".75"/>
   <text x="82" y="54" font-size="8.5" fill="${TC.ink3}">k · k² · k³</text>`,
   '두 상자와 길이 넓이 부피 게이지가 다른 속도로 자라는 그림'),

 svg(`${[0,1,2,3,4,5,6,7].map(i=>{
     const x=20+(i%4)*23, y=14+Math.floor(i/4)*24;
     const last=i===7;
     return `<rect x="${x}" y="${y}" width="19" height="20" rx="3"
       fill="${last?TC.rose:TC.teal}" opacity="${last?'.4':'.18'}"
       stroke="${last?TC.rose:TC.teal}" stroke-width="1.2"/>`;
   }).join('')}
   <text x="106" y="30" font-size="10" font-weight="800" fill="${TC.ink}">1−</text>
   <text x="103" y="44" font-size="10" font-weight="800" fill="${TC.rose}">1/8</text>`,
   '여덟 칸 중 반대쪽 한 칸만 세어 빼는 여사건 그림'),

 svg(`${[1,1,1,0,1,1,1].map((v,i)=>`<circle cx="${18+i*13}" cy="24" r="5.5"
     fill="${v?'#F4C542':'#B9BEC7'}"/>`).join('')}
   <circle cx="109" cy="24" r="7" fill="none" stroke="${TC.rose}" stroke-width="1.8" stroke-dasharray="3 2"/>
   <text x="109" y="28" font-size="10" font-weight="800" fill="${TC.rose}" text-anchor="middle">?</text>
   <text x="60" y="52" font-size="9.5" fill="${TC.ink3}" text-anchor="middle">기억이 없다 — 여전히 1/2</text>`,
   '앞면이 이어진 뒤에도 다음이 물음표인 동전 행렬'),

 svg(`${[0,1,2,3,4,5,6,7,8,9,10,11].map(i=>{
     const x=20+(i%6)*17, y=20+Math.floor(i/6)*26;
     const inC=i%6>=3;
     return `<circle cx="${x}" cy="${y}" r="6" fill="${i%2?TC.blue:'#DB2777'}" opacity="${inC?'.9':'.15'}"/>`;
   }).join('')}
   <rect x="66" y="8" width="52" height="50" rx="6" stroke="${TC.amber}" stroke-width="1.6" stroke-dasharray="4 3" fill="none"/>
   <text x="92" y="62" font-size="8.5" fill="${TC.amber}" text-anchor="middle">새로운 전체</text>`,
   '조건에 든 사람만 밝게 남아 새 분모가 되는 그림'),

 svg(`<circle cx="48" cy="32" r="24" fill="${TC.blue}" opacity=".25"/>
   <circle cx="74" cy="32" r="20" fill="${TC.teal}" opacity=".25"/>
   <circle cx="48" cy="32" r="24" stroke="${TC.blue}" stroke-width="1.6" fill="none"/>
   <circle cx="74" cy="32" r="20" stroke="${TC.teal}" stroke-width="1.6" fill="none"/>
   <text x="61" y="36" font-size="10" font-weight="800" fill="${TC.rose}" text-anchor="middle">−1번</text>
   <text x="104" y="20" font-size="9" font-weight="800" fill="${TC.ink}">P(A)+P(B)</text>
   <text x="104" y="48" font-size="9" font-weight="800" fill="${TC.rose}">−P(A∩B)</text>`,
   '두 원의 겹친 부분을 한 번 빼 주는 덧셈정리 그림'),

/* 92 조립제법 — 계수의 폭포 */
 svg(`<path d="M30 14 V52 M22 44 H104" stroke="${TC.mute}" stroke-width="1.4"/>
   <text x="44" y="26" font-size="10" font-weight="800" fill="${TC.ink}">1</text>
   <text x="62" y="26" font-size="10" font-weight="800" fill="${TC.ink}">−2</text>
   <text x="82" y="26" font-size="10" font-weight="800" fill="${TC.ink}">−5</text>
   <text x="100" y="26" font-size="10" font-weight="800" fill="${TC.ink}">6</text>
   <text x="62" y="38" font-size="9" fill="${TC.amber}">＋</text>
   <text x="44" y="56" font-size="10" font-weight="800" fill="${TC.teal}">1</text>
   <text x="62" y="56" font-size="10" font-weight="800" fill="${TC.teal}">−1</text>
   <text x="82" y="56" font-size="10" font-weight="800" fill="${TC.teal}">−6</text>
   <text x="100" y="56" font-size="10" font-weight="800" fill="${TC.rose}">0</text>`,
   '계수가 폭포처럼 내려와 나머지 0 에 닿는 조립제법 표'),

/* 93 나머지정리 — f(a) 와 나머지의 일치 */
 svg(`${T_AX}
   <path d="M18 44 C40 8 66 60 102 16" stroke="${TC.blue}" ${T_BOLD}/>
   <circle cx="52" cy="38" r="4" fill="${TC.amber}"/>
   <path d="M52 38 V54" stroke="${TC.amber}" stroke-width="1.4" stroke-dasharray="3 2"/>
   <text x="86" y="52" font-size="9" font-weight="800" fill="${TC.teal}">f(a)=R</text>`,
   '점 a 에서의 함숫값이 곧 나머지임을 보이는 그래프'),

/* 94 복소평면 — i 곱하기 회전 */
 svg(`<path d="M60 8 V56 M18 32 H102" ${T_GRID}/>
   <path d="M60 32 L92 20" stroke="${TC.blue}" ${T_THIN}/>
   <path d="M60 32 L72 0" stroke="${TC.teal}" ${T_THIN} opacity=".85"/>
   <path d="M88 14 A26 26 0 0 0 74 6" stroke="${TC.rose}" stroke-width="1.6" fill="none"/>
   <circle cx="92" cy="20" r="3.6" fill="${TC.blue}"/>
   <circle cx="72" cy="0" r="3.4" fill="${TC.teal}"/>
   <text x="93" y="44" font-size="9" font-weight="800" fill="${TC.rose}">×i = 90°</text>`,
   '복소수에 i 를 곱하면 90도 회전하는 그림'),

/* 95 근과 계수 — 합·곱이 계수로 */
 svg(`${T_AX}
   <path d="M24 16 Q60 74 96 16" stroke="${TC.blue}" ${T_BOLD}/>
   <circle cx="40" cy="54" r="3.6" fill="${TC.rose}"/>
   <circle cx="80" cy="54" r="3.6" fill="${TC.rose}"/>
   <text x="60" y="14" font-size="9" font-weight="800" fill="${TC.ink}" text-anchor="middle">p+q = −b</text>
   <text x="60" y="26" font-size="9" font-weight="800" fill="${TC.teal}" text-anchor="middle">pq = c</text>`,
   '두 근의 합과 곱이 계수에 들어 있는 포물선'),

/* 96 삼차 실근 — 산과 골짜기 */
 svg(`${T_AX}
   <path d="M16 50 C34 8 50 8 60 32 C70 56 86 56 104 14" stroke="${TC.blue}" ${T_BOLD}/>
   <circle cx="40" cy="17" r="3.4" fill="${TC.amber}"/>
   <circle cx="78" cy="47" r="3.4" fill="${TC.amber}"/>
   <circle cx="26" cy="54" r="3" fill="${TC.rose}"/>
   <circle cx="58" cy="54" r="3" fill="${TC.rose}"/>
   <circle cx="97" cy="54" r="3" fill="${TC.rose}"/>`,
   '산과 골짜기가 x축을 사이에 두어 실근이 셋인 삼차 곡선'),

/* 97 이차부등식 — 지하 구간 */
 svg(`${T_AX}
   <path d="M24 12 Q60 78 96 12" stroke="${TC.blue}" ${T_THIN}/>
   <path d="M38 54 Q60 70 82 54" stroke="${TC.rose}" stroke-width="3" fill="none"/>
   <path d="M38 58 H82" stroke="${TC.teal}" stroke-width="3.4"/>
   <circle cx="38" cy="58" r="3" fill="#fff" stroke="${TC.teal}" stroke-width="1.6"/>
   <circle cx="82" cy="58" r="3" fill="#fff" stroke="${TC.teal}" stroke-width="1.6"/>
   <text x="99" y="60" font-size="8.5" font-weight="800" fill="${TC.teal}">해집합</text>`,
   '포물선의 지하 구간이 수직선의 해집합으로 내려오는 그림'),

/* 98 선형계획 — 영역과 이익선 */
 svg(`<path d="M20 54 V12 M20 54 H104" ${T_GRID}/>
   <path d="M20 22 L52 22 L84 40 L96 54 L20 54 Z" fill="${TC.teal}" opacity=".18"/>
   <path d="M20 22 L52 22 L84 40 L96 54" stroke="${TC.teal}" ${T_THIN}/>
   <path d="M30 60 L104 22" stroke="${TC.rose}" stroke-width="2" stroke-dasharray="5 3"/>
   <circle cx="84" cy="40" r="4" fill="${TC.rose}"/>
   <text x="94" y="14" font-size="8.5" font-weight="800" fill="${TC.rose}">z 최대</text>`,
   '이익 직선이 볼록 영역의 꼭짓점을 마지막으로 스치는 그림'),

/* 99 순열·조합 — 12 대 6 */
 svg(`<text x="34" y="22" font-size="10" font-weight="800" fill="${TC.blue}">가나 나가</text>
   <text x="34" y="35" font-size="10" font-weight="800" fill="${TC.blue}">가다 다가 …</text>
   <rect x="24" y="42" width="72" height="16" rx="4" fill="${TC.teal}" opacity=".15"/>
   <text x="60" y="54" font-size="10" font-weight="800" fill="${TC.teal}" text-anchor="middle">{가,나} {가,다} …</text>
   <text x="104" y="24" font-size="10" font-weight="800" fill="${TC.ink}">12</text>
   <text x="104" y="54" font-size="10" font-weight="800" fill="${TC.teal}">6</text>`,
   '순열 12줄이 조합 6묶음으로 접히는 그림'),

/* 100 행렬 변환 — 기저 화살표와 F */
 svg(`<path d="M50 8 V56 M18 40 H106" ${T_GRID}/>
   <path d="M50 40 L84 34" stroke="${TC.blue}" stroke-width="2.2"/>
   <path d="M50 40 L60 12" stroke="${TC.teal}" stroke-width="2.2"/>
   <path d="M62 36 L62 18 L76 16 L76 22 L68 23 L68 26 L74 25 L74 31 L68 32 L68 36 Z" fill="${TC.blue}" opacity=".3" stroke="${TC.blue}" stroke-width="1"/>
   <text x="94" y="52" font-size="8.5" font-weight="800" fill="${TC.ink}">열 = 목적지</text>`,
   '기저 화살표 둘이 도형 F 를 끌고 가는 행렬 변환'),

/* 101 비가환 — 두 순서 두 결과 */
 svg(`<rect x="20" y="18" width="26" height="16" rx="2" fill="${TC.blue}" opacity=".3" stroke="${TC.blue}" stroke-width="1.2" transform="rotate(-18 33 26)"/>
   <rect x="66" y="14" width="16" height="26" rx="2" fill="${TC.teal}" opacity=".3" stroke="${TC.teal}" stroke-width="1.2" transform="rotate(12 74 27)"/>
   <text x="33" y="52" font-size="9" font-weight="800" fill="${TC.blue}" text-anchor="middle">R→S</text>
   <text x="74" y="52" font-size="9" font-weight="800" fill="${TC.teal}" text-anchor="middle">S→R</text>
   <text x="98" y="32" font-size="11" font-weight="800" fill="${TC.rose}">≠</text>`,
   '같은 두 변환을 다른 순서로 적용해 달라진 두 도형'),

 svg(`<rect x="14" y="46" width="52" height="10" fill="${TC.mute}" opacity=".5"/>
   <rect x="30" y="38" width="34" height="7" fill="${TC.blue}" opacity=".3" stroke="${TC.blue}" stroke-width="1"/>
   <rect x="40" y="30" width="34" height="7" fill="${TC.blue}" opacity=".3" stroke="${TC.blue}" stroke-width="1"/>
   <rect x="52" y="22" width="34" height="7" fill="${TC.blue}" opacity=".3" stroke="${TC.blue}" stroke-width="1"/>
   <rect x="68" y="14" width="34" height="7" fill="${TC.teal}" opacity=".45" stroke="${TC.teal}" stroke-width="1.2"/>
   <path d="M66 58 V12" stroke="${TC.rose}" stroke-width="1.2" stroke-dasharray="3 2"/>
   <text x="96" y="52" font-size="8.5" font-weight="800" fill="${TC.rose}">절벽 밖!</text>`,
   '카드가 계단처럼 밀려 맨 위 장이 책상 밖에 뜬 그림'),

 svg(`<path d="M28 52 L60 12 L92 52 Z" stroke="${TC.mute}" stroke-width="1.4" fill="none"/>
   <circle cx="28" cy="52" r="5" fill="#DC2626"/>
   <circle cx="60" cy="12" r="5" fill="#16A34A"/>
   <circle cx="92" cy="52" r="5" fill="#2563EB"/>
   <circle cx="60" cy="38.7" r="4" fill="#9CA3AF" stroke="${TC.ink}" stroke-width="1"/>
   <circle cx="72" cy="42" r="4.6" fill="#B06AC8" stroke="${TC.ink}" stroke-width="1.2"/>
   <text x="60" y="62" font-size="8.5" font-weight="800" fill="${TC.ink3}" text-anchor="middle">색 = 좌표</text>`,
   '세 원색 삼각형 위에서 색이 좌표점으로 움직이는 그림'),

 svg(`<rect x="30" y="12" width="60" height="46" fill="#FFF3DC" stroke="${TC.amber}" stroke-width="1.6"/>
   <path d="M30 35 H90" stroke="${TC.blue}" stroke-width="1.2" stroke-dasharray="4 3"/>
   <path d="M30 58 L90 35" stroke="${TC.teal}" stroke-width="1.3"/>
   <path d="M30 12 L90 58" stroke="${TC.teal}" stroke-width="1.3"/>
   <circle cx="70" cy="43" r="3.4" fill="${TC.rose}"/>
   <path d="M70 58 V12" stroke="${TC.rose}" stroke-width="1.2" stroke-dasharray="3 2"/>
   <text x="60" y="70" font-size="8.5" font-weight="800" fill="${TC.ink3}" text-anchor="middle">1 : 2</text>`,
   '색종이의 접힌 선들이 만나 3등분 점을 만드는 그림'),

 svg(`<path d="M26 20 C46 20 58 44 92 56" stroke="${TC.amber}" stroke-width="1.6" fill="none" stroke-dasharray="5 3"/>
   <circle cx="26" cy="20" r="3.2" fill="${TC.blue}"/>
   <circle cx="42" cy="27" r="3.2" fill="${TC.blue}"/>
   <circle cx="58" cy="37" r="3.2" fill="${TC.blue}"/>
   <circle cx="74" cy="47" r="3.2" fill="${TC.blue}"/>
   <path d="M26 20 L42 27 L58 37 L74 47" stroke="${TC.blue}" stroke-width="1.4" fill="none"/>
   <rect x="84" y="14" width="10" height="10" fill="#fff" stroke="${TC.ink}" stroke-width="1.2"/>
   <circle cx="89" cy="19" r="1.4" fill="${TC.ink}"/>
   <text x="56" y="70" font-size="8.5" font-weight="800" fill="${TC.ink3}" text-anchor="middle">100 × (5/6)ᵗ</text>`,
   '주사위로 굴린 실험값 점들이 지수 감소 곡선을 따라가는 그림'),

 svg(`<circle cx="60" cy="35" r="24" stroke="${TC.mute}" stroke-width="1.4" fill="none"/>
   <path d="M36 35 H84" stroke="${TC.mute}" stroke-width="1"/>
   <path d="M60 11 V59" stroke="${TC.mute}" stroke-width="1"/>
   <path d="M60 35 L39 23" stroke="${TC.ink}" stroke-width="1.8"/>
   <path d="M39 23 V35" stroke="${TC.teal}" stroke-width="1.4" stroke-dasharray="3 2"/>
   <circle cx="39" cy="23" r="3.4" fill="${TC.rose}"/>
   <text x="92" y="30" font-size="8.5" font-weight="800" fill="${TC.teal}">sin+</text>
   <text x="92" y="44" font-size="8.5" font-weight="800" fill="${TC.blue}">cos−</text>`,
   '단위원 위의 점이 각을 따라 도는 그림'),

 svg(`<path d="M20 44 C40 20 80 20 100 44" stroke="${TC.blue}" stroke-width="2" fill="none"/>
   <circle cx="26" cy="38" r="2.6" fill="${TC.rose}"/><circle cx="42" cy="27" r="2.6" fill="${TC.rose}"/>
   <circle cx="60" cy="23" r="2.6" fill="${TC.rose}"/><circle cx="78" cy="27" r="2.6" fill="${TC.rose}"/>
   <circle cx="96" cy="40" r="2.6" fill="${TC.rose}"/>
   <circle cx="60" cy="14" r="5" fill="${TC.amber}"/>
   <text x="60" y="60" font-size="8.5" font-weight="800" fill="${TC.ink3}" text-anchor="middle">일출 시각</text>`,
   '월별 일출 점들 위로 물결 곡선이 지나는 그림'),

 svg(`<rect x="14" y="18" width="92" height="14" fill="#DCEAFB"/>
   <path d="M26 52 H94" stroke="${TC.ink}" stroke-width="1.8"/>
   <path d="M26 52 L64 22" stroke="${TC.blue}" stroke-width="1.6"/>
   <path d="M94 52 L64 22" stroke="${TC.teal}" stroke-width="1.6"/>
   <circle cx="64" cy="22" r="4" fill="#166534"/>
   <text x="34" y="62" font-size="8" font-weight="800" fill="${TC.ink3}">A</text>
   <text x="90" y="62" font-size="8" font-weight="800" fill="${TC.ink3}">B</text>
   <text x="64" y="14" font-size="8.5" font-weight="800" fill="${TC.ink3}" text-anchor="middle">C</text>`,
   '기선 양끝에서 강 건너 나무를 겨누는 삼각형 그림'),

 svg(`<rect x="22" y="14" width="10" height="42" fill="${TC.rose}" opacity=".55"/>
   <rect x="36" y="20" width="10" height="36" fill="${TC.blue}" opacity=".45"/>
   <rect x="50" y="27" width="10" height="29" fill="${TC.blue}" opacity=".45"/>
   <rect x="64" y="34" width="10" height="22" fill="${TC.blue}" opacity=".45"/>
   <rect x="78" y="42" width="10" height="14" fill="${TC.blue}" opacity=".45"/>
   <rect x="92" y="50" width="10" height="6" fill="${TC.blue}" opacity=".45"/>
   <text x="62" y="68" font-size="8.5" font-weight="800" fill="${TC.ink3}" text-anchor="middle">잔액이 줄어드는 모습</text>`,
   '대출 잔액 막대가 점점 줄어드는 그림'),

 svg(`<rect x="26" y="46" width="12" height="10" fill="${TC.blue}" opacity=".45"/>
   <rect x="40" y="36" width="12" height="20" fill="${TC.blue}" opacity=".45"/>
   <rect x="54" y="26" width="12" height="30" fill="${TC.blue}" opacity=".45"/>
   <rect x="26" y="16" width="12" height="30" fill="${TC.rose}" opacity=".32"/>
   <rect x="40" y="16" width="12" height="20" fill="${TC.rose}" opacity=".32"/>
   <rect x="54" y="16" width="12" height="10" fill="${TC.rose}" opacity=".32"/>
   <rect x="26" y="16" width="40" height="40" stroke="${TC.ink}" stroke-width="1.4" fill="none"/>
   <text x="88" y="40" font-size="9" font-weight="800" fill="${TC.ink3}">n(n+1)</text>`,
   '두 계단이 맞물려 직사각형이 되는 그림'),

 svg(`<rect x="24" y="24" width="7" height="30" fill="${TC.rose}" opacity=".6" transform="rotate(-38 27 54)"/>
   <rect x="42" y="24" width="7" height="30" fill="${TC.rose}" opacity=".5" transform="rotate(-24 45 54)"/>
   <rect x="58" y="24" width="7" height="30" fill="${TC.blue}" opacity=".55"/>
   <rect x="74" y="24" width="7" height="30" fill="${TC.blue}" opacity=".55"/>
   <rect x="90" y="24" width="7" height="30" fill="${TC.blue}" opacity=".55"/>
   <path d="M20 58 H104" stroke="${TC.mute}" stroke-width="1.2"/>
   <text x="62" y="70" font-size="8.5" font-weight="800" fill="${TC.ink3}" text-anchor="middle">k → k+1</text>`,
   '도미노가 차례로 넘어지는 그림'),

 svg(`<path d="M22 56 C46 56 62 30 96 12" stroke="${TC.blue}" stroke-width="2" fill="none"/>
   <path d="M18 30 H104" stroke="${TC.rose}" stroke-width="1.6" stroke-dasharray="5 4"/>
   <circle cx="68" cy="30" r="4" fill="${TC.ink}"/>
   <text x="68" y="22" font-size="8.5" font-weight="800" fill="${TC.ink3}" text-anchor="middle">x = ?</text>
   <text x="96" y="62" font-size="8.5" font-weight="800" fill="${TC.blue}">aˣ</text>`,
   '지수 곡선과 가로선이 만나 방정식의 해를 만드는 그림'),

 svg(`<rect x="20" y="16" width="72" height="12" fill="${TC.blue}" opacity=".35"/>
   <rect x="20" y="34" width="34" height="12" fill="${TC.teal}" opacity=".45"/>
   <rect x="20" y="52" width="52" height="12" fill="${TC.rose}" opacity=".4"/>
   <text x="98" y="26" font-size="8" font-weight="800" fill="${TC.blue}">log b</text>
   <text x="60" y="44" font-size="8" font-weight="800" fill="${TC.teal}">log a</text>
   <text x="78" y="62" font-size="8" font-weight="800" fill="${TC.rose}">몫</text>`,
   '두 로그 막대의 비가 밑 변환 값이 되는 그림'),

 svg(`<path d="M20 58 C40 58 52 20 62 12" stroke="${TC.blue}" stroke-width="1.9" fill="none"/>
   <path d="M12 50 C22 40 60 28 100 24" stroke="${TC.teal}" stroke-width="1.9" fill="none"/>
   <path d="M14 62 L102 10" stroke="${TC.amber}" stroke-width="1.2" stroke-dasharray="4 3"/>
   <circle cx="48" cy="28" r="3.2" fill="${TC.blue}"/><circle cx="72" cy="44" r="3.2" fill="${TC.teal}"/>
   <path d="M48 28 L72 44" stroke="${TC.rose}" stroke-width="1.1" stroke-dasharray="3 2"/>`,
   '지수와 로그 곡선이 y=x 에 대해 마주 보는 그림'),

 svg(`<rect x="22" y="26" width="58" height="18" fill="${TC.blue}" opacity=".35"/>
   <rect x="80" y="26" width="14" height="18" fill="${TC.rose}" opacity=".45"/>
   <text x="50" y="20" font-size="8" font-weight="800" fill="${TC.blue}" text-anchor="middle">지표</text>
   <text x="88" y="20" font-size="8" font-weight="800" fill="${TC.rose}" text-anchor="middle">가수</text>
   <text x="58" y="60" font-size="10" font-weight="800" fill="${TC.ink3}" text-anchor="middle">31자리</text>`,
   '로그 값의 지표와 가수가 자릿수를 정하는 그림'),

 svg(`<path d="M16 58 C40 58 54 24 64 10" stroke="#D1D5DB" stroke-width="1.6" fill="none"/>
   <path d="M34 58 C58 58 72 24 82 10" stroke="${TC.blue}" stroke-width="2.1" fill="none"/>
   <path d="M12 44 H106" stroke="${TC.rose}" stroke-width="1.4" stroke-dasharray="5 4"/>
   <text x="100" y="40" font-size="8" font-weight="800" fill="${TC.rose}" text-anchor="end">점근선</text>`,
   '기준 지수 곡선이 오른쪽·위로 밀린 그림'),

 svg(`<path d="M16 35 Q30 8 44 35 T72 35 T100 35" stroke="#D1D5DB" stroke-width="1.5" fill="none"/>
   <path d="M16 35 Q23 6 30 35 T44 35 T58 35 T72 35 T86 35 T100 35" stroke="${TC.blue}" stroke-width="2" fill="none"/>
   <path d="M12 14 H108" stroke="${TC.rose}" stroke-width="1" stroke-dasharray="4 3"/>
   <path d="M12 56 H108" stroke="${TC.rose}" stroke-width="1" stroke-dasharray="4 3"/>
   <text x="60" y="70" font-size="8.5" font-weight="800" fill="${TC.ink3}" text-anchor="middle">주기·진폭</text>`,
   '기준 사인 곡선과 주기가 촘촘해진 곡선을 겹친 그림'),

 svg(`<circle cx="32" cy="30" r="18" stroke="${TC.mute}" stroke-width="1.3" fill="none"/>
   <path d="M14 22 H50" stroke="${TC.rose}" stroke-width="1.2" stroke-dasharray="3 2"/>
   <circle cx="41" cy="22" r="3" fill="${TC.blue}"/><circle cx="23" cy="22" r="3" fill="${TC.blue}"/>
   <path d="M58 40 Q70 16 82 40 T106 40" stroke="${TC.blue}" stroke-width="1.8" fill="none"/>
   <path d="M56 28 H108" stroke="${TC.rose}" stroke-width="1.2" stroke-dasharray="3 2"/>
   <circle cx="66" cy="28" r="2.8" fill="${TC.rose}"/><circle cx="76" cy="28" r="2.8" fill="${TC.rose}"/>`,
   '단위원의 두 해가 사인 곡선에서 반복되는 그림'),

 svg(`<path d="M14 40 Q28 18 42 40 T70 40 T98 40" stroke="#C4B5FD" stroke-width="1.4" fill="none"/>
   <path d="M14 26 Q28 48 42 26 T70 26 T98 26" stroke="#5EEAD4" stroke-width="1.4" fill="none"/>
   <path d="M14 34 Q30 6 46 34 T78 34 T108 34" stroke="${TC.blue}" stroke-width="2.2" fill="none"/>
   <text x="60" y="66" font-size="8.5" font-weight="800" fill="${TC.ink3}" text-anchor="middle">R = √(a²+b²)</text>`,
   '두 파동과 그 합이 겹쳐진 그림'),

 svg(`<path d="M24 52 L96 52 L64 16 Z" fill="${TC.blue}" opacity=".14" stroke="${TC.blue}" stroke-width="1.8"/>
   <text x="60" y="62" font-size="8" font-weight="800" fill="${TC.ink3}" text-anchor="middle">c = 15</text>
   <text x="34" y="34" font-size="8" font-weight="800" fill="${TC.ink3}">b = 14</text>
   <text x="84" y="34" font-size="8" font-weight="800" fill="${TC.ink3}">a = 13</text>
   <text x="60" y="44" font-size="9.5" font-weight="800" fill="${TC.teal}" text-anchor="middle">S = 84</text>`,
   '세 변만 적힌 삼각형과 넓이가 나온 그림'),

 svg(`<path d="M14 34 H30 V16 H46 V52 H62 V16 H78 V52 H94 V34 H106" stroke="${TC.ink}" stroke-width="1.4" fill="none" opacity=".35"/>
   <path d="M14 34 Q24 12 34 34 T54 34 T74 34 T94 34 T108 34" stroke="${TC.blue}" stroke-width="1.9" fill="none"/>
   <rect x="20" y="60" width="10" height="10" fill="${TC.blue}" opacity=".5"/>
   <rect x="38" y="64" width="10" height="6" fill="${TC.blue}" opacity=".5"/>
   <rect x="56" y="66" width="10" height="4" fill="${TC.blue}" opacity=".5"/>
   <rect x="74" y="67" width="10" height="3" fill="${TC.blue}" opacity=".5"/>`,
   '사각파를 배음 막대로 쪼갠 그림'),

 svg(`<rect x="24" y="16" width="34" height="7" fill="${TC.rose}" opacity=".45"/>
   <rect x="24" y="26" width="46" height="7" fill="${TC.blue}" opacity=".38"/>
   <rect x="24" y="36" width="58" height="7" fill="${TC.blue}" opacity=".38"/>
   <rect x="24" y="46" width="70" height="7" fill="${TC.teal}" opacity=".45"/>
   <text x="60" y="68" font-size="8.5" font-weight="800" fill="${TC.ink3}" text-anchor="middle">사다리꼴 좌석</text>`,
   '줄마다 좌석이 늘어나는 사다리꼴 그림'),

 svg(`<path d="M18 54 L100 26" stroke="${TC.blue}" stroke-width="2" fill="none"/>
   <path d="M18 56 C50 54 78 40 100 12" stroke="${TC.teal}" stroke-width="2.2" fill="none"/>
   <circle cx="80" cy="33" r="4" fill="${TC.rose}"/>
   <text x="80" y="26" font-size="8" font-weight="800" fill="${TC.rose}" text-anchor="middle">역전</text>`,
   '직선과 지수 곡선이 교차하는 그림'),

 svg(`<rect x="20" y="30" width="10" height="14" fill="${TC.blue}" opacity=".4"/>
   <rect x="34" y="24" width="10" height="20" fill="${TC.blue}" opacity=".4"/>
   <rect x="48" y="34" width="10" height="10" fill="${TC.blue}" opacity=".4"/>
   <rect x="62" y="20" width="10" height="24" fill="${TC.blue}" opacity=".4"/>
   <path d="M25 66 L39 62 L53 60 L67 52 L81 46 L95 40" stroke="${TC.teal}" stroke-width="2" fill="none"/>
   <text x="96" y="34" font-size="8" font-weight="800" fill="${TC.teal}" text-anchor="end">누적</text>`,
   '일별 막대와 누적 꺾은선이 함께 있는 그림'),

 svg(`<rect x="20" y="52" width="9" height="8" fill="${TC.blue}" opacity=".4"/>
   <rect x="32" y="50" width="9" height="10" fill="${TC.blue}" opacity=".4"/>
   <rect x="44" y="46" width="9" height="14" fill="${TC.blue}" opacity=".4"/>
   <rect x="56" y="38" width="9" height="22" fill="${TC.blue}" opacity=".4"/>
   <rect x="68" y="24" width="9" height="36" fill="${TC.rose}" opacity=".45"/>
   <text x="94" y="34" font-size="8.5" font-weight="800" fill="${TC.ink3}" text-anchor="end">aₙ+aₙ₋₁</text>`,
   '앞의 두 항을 더해 다음 항이 자라는 그림'),

 svg(`<rect x="22" y="20" width="12" height="40" fill="${TC.blue}" opacity=".4"/>
   <rect x="22" y="20" width="12" height="12" fill="${TC.rose}" opacity=".45"/>
   <rect x="40" y="26" width="12" height="34" fill="${TC.blue}" opacity=".4"/>
   <rect x="40" y="26" width="12" height="8" fill="${TC.rose}" opacity=".45"/>
   <rect x="58" y="32" width="12" height="28" fill="${TC.blue}" opacity=".4"/>
   <rect x="76" y="40" width="12" height="20" fill="${TC.blue}" opacity=".4"/>
   <text x="60" y="72" font-size="8" font-weight="800" fill="${TC.rose}" text-anchor="middle">붉은 = 이자</text>`,
   '적금 각 달의 만기 가치가 다른 막대 그림'),

 svg(`<path d="M20 56 L46 56 M46 44 L72 44 M72 32 L98 32" stroke="${TC.blue}" stroke-width="2.2" fill="none"/>
   <circle cx="44" cy="56" r="3.6" fill="${TC.rose}"/>
   <circle cx="74" cy="44" r="3.6" fill="${TC.teal}"/>
   <line x1="72" y1="18" x2="72" y2="64" stroke="${TC.ink3}" stroke-width="1" stroke-dasharray="3 3"/>
   <text x="60" y="74" font-size="8" font-weight="800" fill="${TC.ink3}" text-anchor="middle">좌 ≠ 우</text>`,
   '계단 그래프에서 좌극한과 우극한이 어긋난 그림'),

 svg(`<path d="M20 60 C44 46 62 34 96 20" stroke="${TC.blue}" stroke-width="2.2" fill="none"/>
   <circle cx="60" cy="36" r="4.4" fill="#fff" stroke="${TC.blue}" stroke-width="1.8"/>
   <text x="60" y="26" font-size="8.5" font-weight="800" fill="${TC.rose}" text-anchor="middle">0/0</text>
   <text x="60" y="72" font-size="8" font-weight="800" fill="${TC.ink3}" text-anchor="middle">구멍 하나</text>`,
   '한 점만 비어 있는 곡선과 0/0 표시'),

 svg(`<path d="M18 54 L40 54" stroke="${TC.blue}" stroke-width="2"/>
   <path d="M46 38 L68 38" stroke="${TC.blue}" stroke-width="2"/>
   <path d="M76 62 C84 40 88 26 92 16" stroke="${TC.rose}" stroke-width="2"/>
   <circle cx="43" cy="54" r="3.2" fill="#fff" stroke="${TC.blue}" stroke-width="1.5"/>
   <text x="60" y="76" font-size="8" font-weight="800" fill="${TC.ink3}" text-anchor="middle">구멍·점프·무한</text>`,
   '구멍과 점프와 무한 불연속을 나란히 놓은 그림'),

 svg(`<path d="M18 30 C40 68 70 66 100 24" stroke="${TC.blue}" stroke-width="2.2" fill="none"/>
   <line x1="18" y1="48" x2="100" y2="48" stroke="${TC.ink3}" stroke-width="1"/>
   <circle cx="30" cy="42" r="3.6" fill="${TC.rose}"/>
   <circle cx="90" cy="32" r="3.6" fill="${TC.teal}"/>
   <rect x="52" y="20" width="16" height="56" fill="${TC.blue}" opacity=".12"/>
   <text x="60" y="16" font-size="8" font-weight="800" fill="${TC.ink3}" text-anchor="middle">부호가 다르면</text>`,
   '부호가 다른 두 끝점 사이 구간을 좁히는 그림'),

 svg(`<path d="M22 58 L96 26" stroke="${TC.blue}" stroke-width="2.2" fill="none"/>
   <circle cx="22" cy="58" r="4" fill="${TC.rose}"/>
   <circle cx="96" cy="26" r="4" fill="#fff" stroke="${TC.rose}" stroke-width="1.8"/>
   <text x="98" y="44" font-size="8" font-weight="800" fill="${TC.rose}" text-anchor="end">도달 못 함</text>
   <text x="60" y="74" font-size="8" font-weight="800" fill="${TC.ink3}" text-anchor="middle">열린 끝</text>`,
   '열린 끝점 때문에 최댓값이 없는 그림'),

 svg(`<path d="M22 62 L60 24 L98 62" stroke="${TC.blue}" stroke-width="2.4" fill="none"/>
   <path d="M30 30 L60 24" stroke="${TC.rose}" stroke-width="1.8"/>
   <path d="M60 24 L90 30" stroke="${TC.teal}" stroke-width="1.8"/>
   <circle cx="60" cy="24" r="3.8" fill="${TC.ink3}"/>
   <text x="60" y="74" font-size="8" font-weight="800" fill="${TC.ink3}" text-anchor="middle">−1 vs +1</text>`,
   '뾰족점에서 좌우 기울기가 갈라지는 그림'),

 svg(`<path d="M20 66 C44 66 74 34 100 14" stroke="${TC.blue}" stroke-width="2.2" fill="none"/>
   <line x1="38" y1="66" x2="90" y2="34" stroke="${TC.rose}" stroke-width="2"/>
   <line x1="52" y1="30" x2="76" y2="70" stroke="${TC.teal}" stroke-width="1.8" stroke-dasharray="4 3"/>
   <circle cx="64" cy="50" r="3.8" fill="${TC.ink3}"/>
   <text x="60" y="78" font-size="8" font-weight="800" fill="${TC.ink3}" text-anchor="middle">곱 = −1</text>`,
   '접선과 법선이 한 점에서 수직으로 만나는 그림'),

 svg(`<path d="M20 40 C34 12 46 62 60 36 C74 12 86 52 100 30" stroke="${TC.blue}" stroke-width="2.2" fill="none"/>
   <line x1="20" y1="62" x2="100" y2="62" stroke="${TC.ink3}" stroke-width="1"/>
   <path d="M20 70 C36 54 48 70 62 56 C76 44 88 68 100 54" stroke="${TC.teal}" stroke-width="1.8" fill="none"/>
   <text x="60" y="16" font-size="8" font-weight="800" fill="${TC.rose}" text-anchor="middle">f 와 f′</text>`,
   '함수와 도함수를 위아래로 겹쳐 놓은 그림'),

 svg(`<rect x="26" y="20" width="68" height="48" fill="${TC.blue}" opacity=".12" stroke="${TC.blue}"/>
   <rect x="26" y="20" width="14" height="14" fill="${TC.rose}" opacity=".35"/>
   <rect x="80" y="20" width="14" height="14" fill="${TC.rose}" opacity=".35"/>
   <rect x="26" y="54" width="14" height="14" fill="${TC.rose}" opacity=".35"/>
   <rect x="80" y="54" width="14" height="14" fill="${TC.rose}" opacity=".35"/>
   <text x="60" y="78" font-size="8" font-weight="800" fill="${TC.ink3}" text-anchor="middle">V(x) 최대</text>`,
   '네 모서리를 잘라 상자를 접는 전개도 그림'),

 svg(`<path d="M20 54 C36 22 52 22 66 46" stroke="${TC.blue}" stroke-width="2" fill="none"/>
   <path d="M20 70 L66 70" stroke="${TC.teal}" stroke-width="1.8"/>
   <path d="M66 70 L100 78" stroke="${TC.teal}" stroke-width="1.8"/>
   <circle cx="66" cy="46" r="3.4" fill="${TC.rose}"/>
   <text x="60" y="18" font-size="8" font-weight="800" fill="${TC.ink3}" text-anchor="middle">s · v · a</text>`,
   '위치와 속도와 가속도를 세로로 겹친 그림'),

 svg(`<rect x="24" y="58" width="14" height="8" fill="${TC.blue}" opacity=".35"/>
   <rect x="40" y="50" width="14" height="16" fill="${TC.blue}" opacity=".35"/>
   <rect x="56" y="38" width="14" height="28" fill="${TC.blue}" opacity=".35"/>
   <rect x="72" y="22" width="14" height="44" fill="${TC.blue}" opacity=".35"/>
   <path d="M24 66 C48 64 70 44 88 20" stroke="${TC.rose}" stroke-width="2" fill="none"/>
   <text x="60" y="76" font-size="8" font-weight="800" fill="${TC.ink3}" text-anchor="middle">Σ f·Δx</text>`,
   '곡선 아래를 직사각형으로 메운 그림'),

 svg(`<path d="M20 40 L96 40" stroke="${TC.blue}" stroke-width="2"/>
   <rect x="20" y="40" width="40" height="16" fill="${TC.blue}" opacity=".22"/>
   <path d="M20 74 L96 58" stroke="${TC.teal}" stroke-width="2.2"/>
   <circle cx="60" cy="67" r="3.6" fill="${TC.teal}"/>
   <text x="60" y="30" font-size="8" font-weight="800" fill="${TC.ink3}" text-anchor="middle">A′ = f</text>`,
   '넓이 함수와 그 기울기를 위아래로 놓은 그림'),

 svg(`<path d="M20 30 L96 66" stroke="${TC.teal}" stroke-width="2.2"/>
   <line x1="20" y1="48" x2="96" y2="48" stroke="${TC.ink3}" stroke-width="1"/>
   <path d="M20 30 L58 48 L20 48 Z" fill="${TC.blue}" opacity=".25"/>
   <path d="M58 48 L96 66 L96 48 Z" fill="${TC.rose}" opacity=".25"/>
   <text x="60" y="78" font-size="8" font-weight="800" fill="${TC.ink3}" text-anchor="middle">+ 와 −</text>`,
   '속도 그래프의 양수 넓이와 음수 넓이 그림'),

 svg(`<path d="M22 70 C40 20 56 14 74 22" stroke="${TC.blue}" stroke-width="2" fill="none"/>
   <path d="M22 70 L96 30" stroke="${TC.teal}" stroke-width="2"/>
   <path d="M40 46 C48 30 56 26 64 28 L64 40 Z" fill="${TC.teal}" opacity=".25"/>
   <path d="M64 28 L86 36 L74 22 Z" fill="${TC.rose}" opacity=".28"/>
   <text x="60" y="80" font-size="8" font-weight="800" fill="${TC.ink3}" text-anchor="middle">위 − 아래</text>`,
   '두 곡선이 교차해 위아래가 바뀌는 그림'),

 svg(`<ellipse cx="34" cy="44" rx="6" ry="14" fill="${TC.blue}" opacity=".3"/>
   <ellipse cx="52" cy="44" rx="6" ry="19" fill="${TC.blue}" opacity=".3"/>
   <ellipse cx="70" cy="44" rx="6" ry="24" fill="${TC.blue}" opacity=".3"/>
   <path d="M28 30 C48 18 70 14 88 16" stroke="${TC.rose}" stroke-width="1.8" fill="none"/>
   <path d="M28 58 C48 70 70 74 88 72" stroke="${TC.rose}" stroke-width="1.8" fill="none"/>
   <text x="60" y="80" font-size="8" font-weight="800" fill="${TC.ink3}" text-anchor="middle">πr²Δx</text>`,
   '회전체를 얇은 원판으로 자른 그림')
];

/* 상단 카드는 20종만 — 나머지 실험실은 아래 확장 카탈로그의 제 과목 자리에서 연다.
   LABS 자체는 44종 그대로 두어야 한다. 데모·탭②·검증이 모두 이 배열을 쓴다.
   연수 편성(core)은 9/28·10/12 에 실제로 다루고 탭④에 수업·평가 설계까지 있는 것이므로
   번호가 뒤에 있어도 반드시 상단에 둔다. 나머지는 번호순으로 채우고, 화면에는 다시 번호순으로 늘어놓는다. */
const TOP_N = 20;
const TOP = LABS.map((L,i)=>({L,i})).filter(x=>x.L.core)
  .concat(LABS.map((L,i)=>({L,i})).filter(x=>!x.L.core))
  .slice(0, TOP_N)
  .sort((a,b)=>a.i-b.i);
const cw=$('#cards');
TOP.forEach(({L,i})=>{
  const c=el(`<div class="card">
    <div class="no">LAB ${String(i+1).padStart(2,'0')} <span class="badge ${L.core?'b-core':'b-ext'}">${L.core?'연수 편성':'확장 후보'}</span></div>
    ${THUMBS[i]||''}
    <h3>${L.t}</h3>
    <div class="q">${L.q}</div>
    <div class="tags">${L.m.slice(0,2).map(x=>`<span class="tag m">${x}</span>`).join('')}${L.a.slice(0,1).map(x=>`<span class="tag a">${x}</span>`).join('')}</div>
    <div class="go">▶ 직접 조작해 보기</div></div>`);
  c.onclick=()=>open(L,i); cw.appendChild(c);
});
/* 카탈로그의 「제작 완료」 카드가 부른다 — 번호만 주면 그 실험실이 열린다 */
function stepLadder(root, list){
  const box=document.createElement('div');
  box.className='ldr';
  box.innerHTML = `<div class="ldh">🧗 <b>탐구 사다리</b> — 먼저 예상하고, 실험으로 판정하고, 네 말로 정리하세요
      <span class="ldp" id="ldp">0 / ${list.length}</span></div>`
    + list.map((s,i)=>`<div class="ldi ${i===0?'now':'lock'}">
        <span class="ldn">STEP ${i+1}</span>
        <div class="ldt">${s.t}${s.re?'<span class="ldauto">자동 확인</span>':''}${s.do?'<div class="ldd">▸ 이렇게 — '+s.do+'</div>':''}${s.hand?'<div class="ldw">✍ 손으로 — '+s.hand+'</div>':''}</div>
        <button class="b g sm ldk"${i===0?'':' disabled'}>해냈어요</button>
      </div>`).join('');
  root.prepend(box);
  const items=[...box.querySelectorAll('.ldi')];
  const prog=box.querySelector('#ldp');
  let cur=0;
  function doneStep(k){
    if(k!==cur || cur>=list.length) return;
    const el=items[k];
    el.classList.remove('now'); el.classList.add('done');
    el.querySelector('.ldk').textContent='완료 ✓'; el.querySelector('.ldk').disabled=true;
    cur++;
    prog.textContent=cur+' / '+list.length;
    if(items[cur]){
      items[cur].classList.remove('lock'); items[cur].classList.add('now');
      items[cur].querySelector('.ldk').disabled=false;
    } else {
      prog.textContent='완주! '+list.length+' / '+list.length;
      obs.disconnect();
    }
  }
  items.forEach((el,k)=>{ el.querySelector('.ldk').onclick=()=>doneStep(k); });
  /* 지금 단계의 달성 신호가 화면에 있는지 본다 — 부착 직후·변화 때·단계 통과 직후 모두.
     통과 직후에도 봐야 "이미 지나온 상태"가 다음 단계 신호일 때 연쇄로 잡힌다. */
  function scan(){
    const s=list[cur];
    if(s && s.re && new RegExp(s.re).test(root.innerText)) doneStep(cur);
  }
  const _adv=doneStep;
  doneStep=function(k){ _adv(k); setTimeout(scan,0); };
  items.forEach((el,k)=>{ el.querySelector('.ldk').onclick=()=>doneStep(k); });
  const obs=new MutationObserver(scan);
  obs.observe(root,{subtree:true,childList:true,characterData:true});
  scan();
}

/* 미션표 — 문구를 고칠 일이 있으면 여기만 고친다. re 는 달성 신호(화면 문구). */
const MISSIONS={
 "1": [
  {
   "t": "자유 탐색 — 기지국 A 원 버튼을 눌러 신호를 지도에 그려 보세요. 마커를 원 위 여기저기로 끌며 A까지의 거리 숫자를 지켜보세요. 원 하나로는 후보가 몇 곳인가요?"
  },
  {
   "t": "기지국 2곳이면 위치가 정해질까요? 먼저 예상을 메모하고 — A·C 두 원을 켜서, 두 원이 만나는 자리로 📍 마커를 보내 판정하세요.",
   "re": "후보 지점 포착",
   "do": "① A·C 원 켜기 (B는 끄기) ② 두 원이 만나는 자리로 마커 끌기 ③ 만나는 자리가 모두 몇 곳인지 세기",
   "hand": "두 교차 자리의 좌표를 종이에 적고, 신호 2개(원 2개)가 왜 한 점을 못 만드는지 그림으로 설명"
  },
  {
   "t": "세 번째 신호가 심판입니다 — B 원까지 켜고, 세 신호가 동시에 맞아떨어지는 단 한 곳으로 마커를 보내세요.",
   "re": "조난자 발견",
   "do": "① B 원 켜기 ② 세 원이 모두 지나는 곳 찾기 ③ 차(±) 3개가 전부 0.2 안쪽이 되게 미세 조정",
   "hand": "내가 짚은 좌표 (x, y)로 √((x−1.2)²+(y−1.5)²) 을 종이에서 계산해 4.7 과 대조"
  },
  {
   "t": "현실의 GPS — 오차 슬라이더를 0.5로 올려 보세요. 원이 띠로 변합니다. 조난자가 있을 수 있는 영역을 종이에 스케치하고, 오차가 커지면 수색 범위가 어떻게 변하는지 쓰세요."
  },
  {
   "t": "구조 보고서 — 오늘의 문제에 답하세요: 조난자의 좌표, 그리고 기지국이 2곳뿐일 때 생기는 문제를 실험에서 본 증거로 설명하세요."
  }
 ],
 "2": [
  {
   "t": "자유 탐색 — 오른쪽 사전의 단어를 몇 개 넣어 계산해 보세요. 확률 막대는 무엇에 따라 움직이나요?"
  },
  {
   "t": "문자① 버튼으로 스팸함에 간 문자를 판정해 보세요. 세 단어 중 결정타는 무엇인가요? 단어를 하나씩 지우고 재계산하며 확인하세요.",
   "re": "쿠폰[\\s\\S]{0,600}스팸함으로 이동",
   "do": "① 문자① 버튼 ② 발견 단어 3개의 P 값 확인 ③ 한 단어씩 지우고 재계산하며 확률이 얼마씩 꺼지는지 기록",
   "hand": "분자 0.92×0.90×0.88 을 종이에 계산해 화면의 Πp 값과 대조"
  },
  {
   "t": "문자② — 「무료」가 들어 있는데도 이 문자는 살아남을까요? 예상을 메모하고 버튼으로 판정하세요.",
   "re": "엄마[\\s\\S]{0,600}정상 수신함",
   "do": "② 문자② 버튼 ② 판정 확인 ③ 「엄마」만 지우고 재계산 — 판정이 뒤집히는지 관찰",
   "hand": "무료 하나뿐일 때와 무료+엄마+전화일 때의 확률을 표로 적고, 왜 달라졌는지 한 줄"
  },
  {
   "t": "규칙 사냥 — 단어가 하나 늘 때 확률은 더해지나요, 곱해지나요? (단어들, 확률) 3행 표를 만들고 규칙을 네 말로 쓰세요."
  },
  {
   "t": "설계 도전 — 억울한 문자: 뜻은 정상인데 스팸 판정을 받는 문자를 만들어 보세요. 반대로 스팸인데 통과하는 문자도. 각각 범인 단어를 지목하세요."
  }
 ],
 "3": [
  {
   "t": "자유 탐색 — 슬라이더 셋을 흔들어 보세요. 빨간 점(3일째 실측 4만)과 곡선들은 지금 어떤 관계인가요?"
  },
  {
   "t": "모형 맞추기 — 주황 지수 곡선이 빨간 점을 정확히 지나가게 만드세요. 첫날 5천 뷰이므로 N₀부터 정하고 시작하세요.",
   "re": "실측점 관통",
   "do": "① N₀ = 0.5 (5천 뷰) ② r 를 올리며 곡선을 빨간 점에 가까이 ③ 명중하면 하루 몇 배 성장인지 읽기",
   "hand": "0.5 × 2³ 을 종이에 계산 — 3일 만에 4만이 되려면 하루 몇 배여야 하는지 확인"
  },
  {
   "t": "냉정한 현실 — 이 채널을 실제로 볼 만한 시청자가 30만 명뿐이라면? 포화 한계 K 를 30으로 놓고 7일 뒤 두 곡선의 값을 비교하세요.",
   "re": "풀 30만의 진실",
   "do": "① 모형을 맞춘 상태 유지 ② K = 30 으로 ③ 7일 지점에서 지수·로지스틱 두 값 읽기",
   "hand": "두 값의 차이를 적고, 어느 쪽이 현실에 가까운지 이유와 함께 쓰기"
  },
  {
   "t": "규칙 사냥 — r 를 바꿔 가며 (r, 배가시간) 짝 3개를 표로 모으세요. 어떤 규칙이 보이나요?"
  },
  {
   "t": "판결문 — 「일주일이면 100만」 주장에 최종 판결을 내리세요: 판결 + 근거 숫자 2개 + 성장이 계속될 수 없는 이유."
  }
 ],
 "4": [
  {
   "t": "자유 탐색 — 슬라이더 넷이 두 직선의 무엇을 조종하는지 찾아보세요. 빨간 점은 무엇을 뜻할까요?"
  },
  {
   "t": "📌 버튼으로 문제의 요금제를 불러와 교점을 읽으세요. 초록 선(내 사용량 350분)은 교점의 왼쪽인가요, 오른쪽인가요?",
   "re": "375\\.0분",
   "do": "① 📌 오늘의 문제 요금제 버튼 ② 교점의 분 값 읽기 ③ 350분 초록 선이 교점의 어느 쪽인지 확인",
   "hand": "15000 + 45x = 30000 + 5x 를 종이에서 풀어 화면의 교점과 대조"
  },
  {
   "t": "B 통신사의 반격 — A 요금제는 그대로 두고, B 기본료를 얼마까지 내리면 350분에서 B가 이길까요? 먼저 계산으로 예상하고 슬라이더로 확인하세요.",
   "re": "문제 상황 — 내 사용량 350분: A 30,750원 / B [0-9,]+원 → B가",
   "do": "① 문제 요금제 상태에서 B 기본료만 1,000원씩 내리기 ② 350분 판정이 뒤집히는 경계 찾기",
   "hand": "30,750 = c + 5×350 을 종이에서 풀어 경계 기본료 c 를 구하고 화면과 대조"
  },
  {
   "t": "규칙 사냥 — 기본료·분당 요금을 바꿔 가며 교점 위치 3개를 표로 모으고, 교점을 구하는 나만의 공식을 만들어 보세요."
  },
  {
   "t": "최종 답 — 오늘의 문제에 답하세요: 한 달 350분인 나는 어느 요금제? 몇 분을 넘으면 갈아타야 할까요? 식과 그래프 증거를 함께."
  }
 ],
 "5": [
  {
   "t": "1분 자유 탐색 — 각도·거리·눈높이를 흔들어 보세요. 높이는 무엇 무엇에 달려 있나요?"
  },
  {
   "t": "오늘의 문제부터 — 📌 버튼(또는 d=50, θ=40°, 눈높이 1.6)으로 본관을 재세요. 올라가 보지 않고 높이를 확정할 수 있나요?",
   "re": "본관 높이 확정",
   "do": "① 📌 오늘의 문제 재기 버튼 ② 화면의 높이 읽기 ③ 각을 39°·41°로 흔들어 민감도 확인",
   "hand": "50 × tan40° + 1.6 을 종이에 계산해 화면 값과 대조 (tan40° ≈ 0.839)"
  },
  {
   "t": "마법의 각 — 각을 45°로 맞추면 tan 값은 얼마가 되나요? 그때 높이와 거리 사이에 무슨 일이 벌어지는지 찾아보세요.",
   "re": "tan 45° = 1\\.0000",
   "do": "① 각 45°로 ② tan 값과 높이 읽기 ③ 거리 60·90에서도 높이−눈높이와 거리 비교",
   "hand": "45°일 때 「높이 − 눈높이 = 거리」가 되는 이유를 직각이등변삼각형 그림으로 설명"
  },
  {
   "t": "눈높이를 빼먹으면? — 눈높이를 0으로 내려 같은 각·거리의 높이를 재고, 1.6일 때와 비교하세요.",
   "re": "\\+ 눈높이 0\\.0",
   "do": "① 눈높이 0으로 ② 높이 기록 ③ 1.6으로 되돌려 차이 확인",
   "hand": "두 측정값의 차가 정확히 눈높이와 같은 이유를 식에서 짚기"
  },
  {
   "t": "심화 — 100 m 의 벽: 서로 다른 두 방법(먼 거리·큰 각)으로 높이 100 m를 넘겨 보고, 우리 학교 건물의 실제 측량 계획서(거리 어림법, 각 측정 도구, 예상 오차)를 작성하세요.",
   "re": "= [1-9]\\d\\d\\.\\d\\d m",
   "do": "① 거리 120·각 40°로 한 번 ② 거리 60·각 60°로 또 한 번 ③ 두 조합 기록",
   "hand": "두 조합의 d × tanθ 를 각각 계산해 같은 100 m대가 되는 이유 확인"
  }
 ],
 "6": [
  {
   "t": "1분 자유 탐색 — 관계 세기를 끝에서 끝까지. 점구름과 숫자 r 은 어떻게 붙어 다니나요?"
  },
  {
   "t": "오늘의 문제 데이터 — 📌 버튼으로 우리 반 12명(공부시간, 점수)을 불러오세요. 흐릿한 경향의 정체는 숫자 몇인가요?",
   "re": "자료 12개",
   "do": "① 📌 우리 반 데이터 버튼 ② r 값 읽기 ③ 점구름과 r 를 눈으로 짝짓기",
   "hand": "화면의 공분산·σx·σy 로 r 계산식을 종이에서 한 번 재현"
  },
  {
   "t": "r 를 0.9 위로 올리려면 점구름이 어떤 모양이어야 할까요? 시뮬레이터(세기·잡음)로 만들어 보세요.",
   "re": "= 0\\.9\\d",
   "do": "① 세기 95·잡음 6으로 ② r 확인 ③ 잡음만 키우며 r 하락 관찰",
   "hand": "r=0.95 점구름을 종이에 대충 그리고 「r가 잰 것」을 한 줄로"
  },
  {
   "t": "r 가 음수가 되는 세상은 어떤 모습일까요? −0.5 아래로 내려가 보세요.",
   "re": "= -0\\.[5-9]",
   "do": "① 세기를 −80까지 ② 점구름 방향 관찰 ③ 생활 속 음의 상관 예 떠올리기",
   "hand": "양의 상관·음의 상관 예를 생활에서 하나씩 쓰기"
  },
  {
   "t": "심화 — 전학생의 습격: 📌 버튼으로 반 데이터를 다시 불러온 뒤, 구석(공부 9시간·점수 0점대)에 이상치 한 점을 찍어 보세요. r 는 얼마나 다치나요? 「상관 높음 ≠ 원인」인 짝도 하나 지어 이유를 쓰세요.",
   "re": "자료 13개",
   "do": "① 📌 버튼으로 12명 복원 ② 구석에 한 점 클릭 ③ r 변화 기록",
   "hand": "이상치 전후의 r 를 나란히 적고, 한 점의 힘을 문장으로"
  }
 ],
 "7": [
  {
   "t": "1분 자유 탐색 — 연봉 슬라이더를 흔들어 보세요. 두 대푯값 중 누가 더 예민한가요?"
  },
  {
   "t": "광고 재현 — 사장님 연봉을 6억(60,000만원)으로 올려 오늘의 문제 속 회사를 만들어 보세요. 광고의 「평균 9,440만원」은 거짓말인가요?",
   "re": "광고의 정체",
   "do": "① 사장 연봉 60,000으로 ② 평균·중앙값 위치 확인 ③ 평균보다 적게 받는 사람 수 세기",
   "hand": "(34,400 + 60,000) ÷ 10 을 종이에서 계산해 화면 평균과 대조"
  },
  {
   "t": "되돌리면 두 값은 다시 만날까요? 경계가 어디쯤인지 찾아보세요.",
   "re": "다시 비슷해졌",
   "do": "① 사장 연봉을 4,000으로 ② 두 값이 가까워지는 순간 관찰 ③ 차이 500이 넘는 경계 탐색",
   "hand": "「평균보다 적게 받는 사람 수」가 왜 판단 근거가 되는지 설명"
  },
  {
   "t": "시나리오 3가지의 (평균, 중앙값)을 표로 — 「보통 직원」에 가까운 쪽은? 이유를 네 말로."
  },
  {
   "t": "심화 — 광고 카피라이터의 윤리: 오늘의 광고 문구를 「거짓은 아니지만 오해를 부르는 이유」로 분석하고, 바르게 고친 문구(중앙값 기준)를 지어 보세요. 뉴스에서 평균이 거짓말하는 실제 사례도 하나 찾아 쓰세요."
  }
 ],
 "8": [
  {
   "t": "1분 자유 탐색 — 자리 수·문자 종류·해커의 속도를 바꿔 보세요. 시간 표시가 언제 껑충 뛰나요?"
  },
  {
   "t": "숫자 4자리는 순식간에 뚫립니다. 대소문자+숫자+기호(94종) 12자리로 올려 백만 년 이상 버티게 만들어 보세요.",
   "re": "e\\+\\d년",
   "do": "① 숫자만 4자리의 시간 기록 ② 종류 94종으로 ③ 12자리로 올려 시간 다시 기록",
   "hand": "10⁴ 을 종이에 계산하고 초당 1억 회와 비교해 「순식간」을 초로 확인"
  },
  {
   "t": "이번엔 거꾸로 — 시간 단위가 「년」으로 처음 넘어가는 경계 조합을 찾아보세요. 자리 확대와 종류 확대 중 무엇이 결정적이었나요?",
   "re": "\\d\\.\\d년",
   "do": "① 종류 62종·10자리 근처에서 탐색 ② 년 단위에 진입하는 조합 기록 ③ 자리만·종류만 바꿔 재확인",
   "hand": "(종류, 자리, 시간) 표 3행 — 한 자리 늘 때 몇 배가 되는지 지수로 쓰기"
  },
  {
   "t": "(종류, 자리, 시간) 표 4줄 — 어떤 규칙이 숨어 있나요? kⁿ 지수로 써 보세요."
  },
  {
   "t": "심화 설계 — 1000년 이상 버티는 가장 짧은 비밀번호 규칙을 찾으세요. 몇 종류·몇 자리가 최소인가요? 근거를 대세요.",
   "re": "\\d{4,}\\.\\d년",
   "do": "① 1000년을 넘기는 조합 여러 개 수집 ② 자리 수가 가장 적은 것 고르기",
   "hand": "내 규칙의 가짓수 kⁿ 을 어림해 1000년 조건과 대조"
  }
 ],
 "9": [
  {
   "t": "1분 자유 탐색 — 「다시 뽑기」를 여러 번. 같은 조건인데 결과가 매번 다른 이유는? 흔들림의 폭도 눈여겨 두세요."
  },
  {
   "t": "친구의 20만 원을 구하라 — 횟수를 200으로 맞춰 「200번 뽑으면 무조건 나온다」는 주장을 판정하세요.",
   "re": "친구 주장 판정",
   "do": "① 횟수 200으로 ② 「적어도 1번」 이론값 읽기 ③ 다시 뽑기 몇 번으로 실제 흔들림 확인",
   "hand": "(1−0.005)² 을 종이에 계산해 「2번 다 꽝」 확률부터 감 잡기"
  },
  {
   "t": "당첨 확률이 20배(10%)인 뽑기라면 — 「적어도 1번」이 절반을 넘는 데 몇 번이면 될까요? 0.5%일 때와 비교하세요.",
   "re": "이론 확률 10\\.0%",
   "do": "① 확률을 10%로 ② 절반 넘는 최소 횟수 탐색 ③ 0.5%의 결과와 비율 비교",
   "hand": "1 − 0.9² 을 종이에 계산 — 2번 만에 이미 몇 %인지 확인"
  },
  {
   "t": "(횟수, 적어도 1번 확률) 표 — 규칙을 찾아 네 말로 쓰세요. 200번의 진실은?"
  },
  {
   "t": "심화 — 「거의 확실」의 값: 적어도 1번 확률을 95~99%대에 올려놓는 (확률, 횟수) 조합을 두 가지 찾고, 확률이 1/20이면 횟수는 몇 배 필요한지 규칙을 세우세요.",
   "re": "= 9[5-9]\\.\\d%",
   "do": "① 0.5%에서 95%를 넘기는 횟수 탐색 ② 10%에서도 반복 ③ 두 횟수의 비 계산",
   "hand": "n ≈ 3 ÷ p 어림 공식을 두 경우로 검증"
  }
 ],
 "10": [
  {
   "t": "1분 자유 탐색 — 점수·평균·표준편차를 흔들어 보세요. z 는 무엇에 반응하나요?"
  },
  {
   "t": "같은 78점의 첫 번째 얼굴 — 📌 수학 버튼(78·70·5)으로 내 수학 점수의 위치를 재세요. z 와 상위 %는 얼마인가요?",
   "re": "수학 z = \\+1\\.60",
   "do": "① 📌 수학 버튼 ② z 와 상위 % 기록 ③ 종 모양 그래프에서 내 위치 확인",
   "hand": "(78 − 70) ÷ 5 를 종이에 계산 — 이 값의 뜻을 한 줄로"
  },
  {
   "t": "두 번째 얼굴 — 📌 영어 버튼(78·70·25)으로 같은 78점을 다시 재세요. 어느 시험이 더 대단한 점수인가요? 오늘의 문제에 답하세요.",
   "re": "영어 z = \\+0\\.32",
   "do": "① 📌 영어 버튼 ② 두 z 값 비교 ③ 판정문 쓰기",
   "hand": "(78 − 70) ÷ 25 를 계산하고 두 z 로 오늘의 문제 판정문 완성"
  },
  {
   "t": "0의 자리 — z 가 정확히 0 이 되는 자리는 어디일까요? 평균·편차를 바꿔도 유지되는지 확인하세요.",
   "re": "평균과 같습니다",
   "do": "① 점수 = 평균으로 ② z 확인 ③ 편차를 바꿔도 z=0 유지되는지",
   "hand": "z = 0 의 뜻을 「평균으로부터의 거리」로 설명"
  },
  {
   "t": "심화 — 상위 2%의 세계: z 를 2σ 이상으로 보내는 (점수, 평균, 편차) 조합을 만들고, 그 자리의 상위 %를 읽으세요. 편차가 작은 시험일수록 만점의 가치가 왜 커지는지 결론지으세요.",
   "re": "[2-9]\\.\\d\\dσ 위|[1-9]\\d\\.\\d\\dσ 위",
   "do": "① 편차 5로 ② z=2를 넘는 점수 탐색 ③ 상위 % 기록",
   "hand": "z=2 가 되는 점수를 식 x = m + 2σ 로 계산해 실험과 대조"
  }
 ],
 "11": [
  {
   "t": "1분 자유 탐색 — 이자율·기간을 흔들어 보세요. 두 곡선은 언제부터 벌어지나요?"
  },
  {
   "t": "아빠 검증 — 이자율을 6%로 맞춰 「12년이면 두 배」 주장을 판정하세요. 정확값과 얼마나 가까운가요?",
   "re": "아빠 주장 판정",
   "do": "① 이자율 6.0%로 ② 두 배 햇수 정확값 읽기 ③ 72÷6 과 비교",
   "hand": "72 ÷ 6 을 계산하고, 정확값과의 차이를 소수로 확인"
  },
  {
   "t": "저금리의 세계 — 이자율 3%로 내리면 72법칙 어림값은 얼마이고, 정확값과 얼마나 가까운가요? 고금리에서도 견줘 보세요.",
   "re": "= 24\\.00년",
   "do": "① 이자율 3%로 ② (정확값, 72법칙값) 기록 ③ 12%·20%에서 반복",
   "hand": "세 짝을 표로 적고 어림의 오차가 저금리·고금리 어느 쪽에서 커지는지 판정"
  },
  {
   "t": "(이자율, 정확값, 72법칙) 표 — 왜 하필 72일까요? 짐작을 쓰세요."
  },
  {
   "t": "심화 — 복리의 진짜 위력: 원금·이자율·기간을 조절해 복리와 단리의 차이를 1억 원(10,000만원) 이상으로 벌리세요. 셋 중 무엇이 가장 세게 작용했나요?",
   "re": "차이 (\\d{2,3},\\d{3}|\\d{1,3}(,\\d{3}){2,})만원",
   "do": "① 기간만 2배로 ② 이자율만 2배로 ③ 원금만 2배로 — 각각 차이 배율 기록",
   "hand": "차이가 기간에 대해 가속하는 이유를 (1+r)ⁿ − (1+rn) 꼴에서 설명"
  }
 ],
 "12": [
  {
   "t": "1분 자유 탐색 — 처음 화면에서 작은 값들은 어디에 숨어 있나요?"
  },
  {
   "t": "모든 값이 한눈에 보이게 만들 수 있을까요? 방법을 찾아보세요.",
   "re": "로그 눈금입니다",
   "do": "① 로그 눈금으로 전환 ② 여섯 규모 막대를 비교",
   "hand": "6300만÷6만 을 종이에 계산 — 보통 눈금에서 규모 6 막대가 몇 픽셀일지 어림"
  },
  {
   "t": "다른 세계에서도 통할까요? 자료를 소리 자료로 바꿔 — 속삭임과 제트기의 배율, 자릿수 차이를 읽고 로그 눈금의 필요성을 판정하세요.",
   "re": "소리 세기 \\(× 기준 세기\\)",
   "do": "① 자료를 소리로 전환 ② 보통 눈금에서 안 보이는 항목 세기 ③ 로그 눈금에서 배율·자릿수 읽기",
   "hand": "제트기÷속삭임 배율을 손으로 계산해 화면의 log₁₀ 값과 대조"
  },
  {
   "t": "두 눈금에서 같은 자료의 막대 비를 표로 — 무엇이 보존되고 무엇이 달라졌나요?"
  },
  {
   "t": "심화 — 데시벨·리히터가 로그로 정의되는 이유: 소리 자료의 log 값들이 dB 척도와 어떻게 이어지는지 설명하고, 로그 눈금이 필수인 내 자료를 하나 설계하세요."
  }
 ],
 "13": [
  {
   "t": "1분 자유 탐색 — h 를 줄였다 늘였다. 할선은 무엇을 향해 가고 있나요?"
  },
  {
   "t": "구간단속부터 — t=1, h=2 로 맞춰 오늘의 문제 속 단속 구간(1초→3초)을 재현하세요. 평균속도는 얼마인가요?",
   "re": "구간단속 재현",
   "do": "① t=1.0, h=2.00 으로 ② 평균속도 확인 ③ 같은 구간의 순간속도(t=1과 t=3)와 비교",
   "hand": "(s(3) − s(1)) ÷ 2 = (27 − 5) ÷ 2 를 종이로 계산해 화면과 대조"
  },
  {
   "t": "순간을 잡아라 — h 를 계속 줄이면 할선의 운명은? 예상을 적고 끝까지 밀어붙이세요.",
   "re": "거의 겹쳤습니다",
   "do": "① h를 0.5 → 0.1 → 0.02로 ② 평균속도의 행선지 추적 ③ 접선과의 차이 확인",
   "hand": "h = 1, 0.1, 0.02 의 평균속도를 표로 적고 다가가는 값 쓰기"
  },
  {
   "t": "순간속도는 시각마다 다릅니다 — t 를 4초대로 옮겨 순간속도를 재고, 1초일 때와 비교하세요. 어떤 규칙이 보이나요?",
   "re": "s′\\(4\\.\\d\\)",
   "do": "① t=4.0으로 ② 순간속도 기록 ③ h 를 다시 줄여 할선-접선 겹침 재확인",
   "hand": "s′(t) = 4t + 3 에 t=1 과 t=4 를 넣어 손으로 계산해 화면과 대조"
  },
  {
   "t": "심화 — 판결문: 「평균 11이니 과속 아님」 주장은 유효한가요? 평균값 정리(구간 안 어느 순간엔 반드시 평균속도인 순간이 있다)를 할선·접선 그림으로 논증하고, 구간단속과 순간단속 중 어느 쪽이 왜 공정한지 결론을 쓰세요."
  }
 ],
 "14": [
  {
   "t": "1분 자유 탐색 — 번호를 넣고 판정을 받아 보세요. 검증기는 무엇을 계산하는 걸까요?"
  },
  {
   "t": "한 자리만 슬쩍 바꾸면 검증기가 알아챌까요? 예상하고 시험하세요.",
   "re": "잘못된 번호",
   "do": "① 유효한 번호에서 한 자리만 바꾸기 ② 판정 관찰 ③ 다른 자리로도",
   "hand": "바꾼 자리의 룬 합 변화를 종이에서 계산해 판정과 대조"
  },
  {
   "t": "검증기를 통과하는 번호를 직접 만들 수 있나요? 마지막 숫자의 비밀을 찾으세요.",
   "re": "고쳐 유효한 번호",
   "do": "① 앞 15자리를 정하고 ② 검산 숫자를 0~9로 바꿔 통과값 찾기",
   "hand": "찾은 검산 숫자가 나오는 계산 과정을 종이에 재현"
  },
  {
   "t": "어떤 실수는 잡히고 어떤 맞바꿈은 안 잡히나요? 표로 수집해 경계를 그으세요."
  },
  {
   "t": "내 설명 — 2배 하는 자리가 왜 필요한지, 실험 증거로 논증하세요."
  }
 ],
 "15": [
  {
   "t": "1분 자유 탐색 — 아무 데나 점을 찍어 보세요. 직선은 누가 움직이는 걸까요?"
  },
  {
   "t": "오늘의 문제 데이터 — 📌 버튼으로 카페 12일 (기온, 판매량) 기록을 불러오세요. 내일 30°C 에는 몇 잔이 팔릴까요?",
   "re": "예상 판매",
   "do": "① 📌 카페 데이터 버튼 ② 직선의 식과 R² 읽기 ③ x=10(30°C) 예측점 확인",
   "hand": "직선 식에 x=10 을 넣어 판매 예측값을 종이로 계산, 화면과 대조"
  },
  {
   "t": "점 하나의 파괴력 — 「이상치 하나 추가」로 R² 를 0.8 아래까지 떨어뜨려 보세요. 예측은 어떻게 되나요?",
   "re": "데이터 [12]\\d개 · 잔차제곱합[\\s\\S]{0,120}R² = -?0\\.[0-7]\\d\\d",
   "do": "① 이상치 추가 ② R²·기울기 변화 기록 ③ 30°C 예측값이 얼마나 흔들렸는지 확인",
   "hand": "이상치 전후의 기울기로 x=10 예측값을 각각 계산해 차이 확인"
  },
  {
   "t": "(데이터, 직선 식, R², 30°C 예측) 표 — 예측을 믿을 수 있는 조건을 쓰세요."
  },
  {
   "t": "심화 — 나만의 데이터: 데이터를 지우고 내 손으로 10개 이상을 일렬로 찍어 R² 0.95 이상을 만들어 보세요. 좋은 예측의 조건(점의 수·흩어짐·이상치)을 결론으로 정리하세요.",
   "re": "데이터 1\\d개 · 잔차제곱합[\\s\\S]{0,120}R² = (0\\.9[5-9]|1\\.000)",
   "do": "① 데이터 지우기 ② 일렬로 10점 이상 ③ R² 확인",
   "hand": "점 2개로 기울기(Δy/Δx)를 계산해 화면 직선과 비교"
  }
 ],
 "16": [
  {
   "t": "1분 자유 탐색 — 지형을 클릭해 공을 놓고 걸어 보세요. 공은 무엇을 따라가나요?"
  },
  {
   "t": "공을 굴려 골짜기 바닥에 도착시키세요 — x 가 2.0대에 들어오면 도착입니다. 그때 기울기는 얼마인가요?",
   "re": "= 2\\.0\\d\\d\\d",
   "do": "① 시작점 7, 학습률 0.3 ② 한 걸음씩 진행하며 (x, 기울기) 추적 ③ 자동 20걸음으로 마무리",
   "hand": "현 위치에서 x − α×기울기 를 손으로 계산해 다음 위치 예측 후 대조"
  },
  {
   "t": "보폭(학습률)을 키우면 어떤 사고가 날까요? 일으켜 보세요.",
   "re": "발산!",
   "do": "① 학습률 최대로 ② 20걸음 자동 진행 ③ 공의 운명 기록",
   "hand": "발산이 일어난 이유를 「보폭 > 골짜기 폭」으로 설명"
  },
  {
   "t": "학습률 3가지의 (걸음 수, 운명) 표 — 좋은 보폭의 조건을 네 말로."
  },
  {
   "t": "심화 — 발산도 수렴도 아닌 「영원한 진동」: 시작점 7에서 학습률을 미세 조정해 공이 두 지점만 오가게 만들어 보세요. 그 학습률은 얼마이고, 왜 하필 그 값일까요?",
   "re": "= -3\\.0000",
   "do": "① 시작점 7 되돌리기 ② 학습률 4.00 근처 탐색 ③ 한 걸음씩 눌러 왕복 확인",
   "hand": "x − α·0.5(x−2) 에서 진동 조건(곱하는 수가 −1)을 풀어 α 를 구하고 실험과 대조"
  }
 ],
 "17": [
  {
   "t": "1분 자유 탐색 — 점을 조금 뿌려 보세요. 점으로 어떻게 π 가 나오는 걸까요?"
  },
  {
   "t": "점을 늘리면 추정값은 좋아질까요? 1000개 넘게 뿌려 오차 0.1 아래로 만들어 보세요.",
   "re": "(\\d{1,3},\\d{3}|\\d{4,})개 중 원 안[\\s\\S]*오차 0\\.0",
   "do": "① +1000점을 4번 ② 매번 (점 수, 추정값, 오차) 기록",
   "hand": "원 안 비율×4 를 종이에서 한 번 직접 계산해 화면과 대조"
  },
  {
   "t": "재현성 실험 — 초기화하고 +1,000점 딱 한 번. 조금 전 1000점대의 추정값과 같은 값이 나오나요?",
   "re": "전체 1,000개",
   "do": "① 초기화 ② +1000점 한 번 ③ 추정값 기록 — 한 번 더 반복해 세 값 비교",
   "hand": "세 값이 서로 다른 이유와, 그래도 π 근처에 모이는 이유를 두 줄로"
  },
  {
   "t": "(점 수, 추정값, 오차) 표 — 오차가 줄어드는 속도의 규칙을 찾아 쓰세요."
  },
  {
   "t": "심화 — 정밀도의 대가: 점을 10000개 이상 모아 오차를 확인하세요. 점 100배에 오차는 몇 분의 1이 되나요(√n 법칙)?",
   "re": "전체 [1-9]\\d,\\d{3}개",
   "do": "① +1000점을 반복해 10000개 돌파 ② (점 수, 오차) 짝 3개 수집",
   "hand": "오차의 비를 √(개수의 비) 와 대조해 규칙 검증"
  }
 ],
 "18": [
  {
   "t": "1분 자유 탐색 — 취향 슬라이더를 움직여 보세요. 추천 1위는 무엇을 근거로 바뀌나요?"
  },
  {
   "t": "추천을 뒤집어 보세요 — 지금은 액션파가 1위입니다. 취향을 조절해 로맨스파 서연이 1위가 되게 만들어 보세요.",
   "re": "서연님이 본 영화",
   "do": "① 내 취향을 (3, 8) 근처로 ② 1위가 바뀌는 순간의 (액션, 로맨스) 기록 ③ 사잇각 비교",
   "hand": "(3,8)과 (3,8)·(9,2)의 내적을 종이에서 계산해 어느 쪽이 큰지 확인"
  },
  {
   "t": "경계선 탐사 — 균형파 지훈(7,6)이 1위가 되는 취향 영역은 어디인가요? 그 영역의 경계를 더듬어 찾아보세요.",
   "re": "지훈님이 본 영화",
   "do": "① (5,5) 근처에서 시작 ② 슬라이더를 조금씩 움직여 1위 교대 지점 포착 ③ 영역의 폭 기록",
   "hand": "세 사람과의 사잇각이 같아지는 방향이 왜 경계가 되는지 그림으로 설명"
  },
  {
   "t": "취향 3조합의 코사인 유사도 표 — 유사도가 재는 것과 못 재는 것을 나눠 쓰세요."
  },
  {
   "t": "심화 — 완벽한 취향 쌍둥이: 세기는 달라도 방향이 같으면 유사도가 최대가 됩니다. 민준과의 유사도를 소수 셋째 자리까지 최대로 만드는 서로 다른 조합을 두 개 찾아보세요.",
   "re": "1\\.000",
   "do": "① 민준 벡터 (9,2)의 방향 관찰 ② 그 절반·그 1.5배 취향 시도 ③ 유사도 값 확인",
   "hand": "왜 (4.5, 1)도 만점이 되는지 분자·분모가 함께 커지는 것으로 설명"
  }
 ],
 "19": [
  {
   "t": "1분 자유 탐색 — 필터 넷을 하나씩 눌러 보세요. 그림은 어떻게 달라지나요?"
  },
  {
   "t": "뭉개기의 정체 — 흐리게(평균) 필터를 적용하고, 행렬 칸의 숫자가 전부 무엇인지 읽으세요. 왜 그 숫자면 뭉개질까요?",
   "re": "0\\.11",
   "do": "① 흐리게(평균) 적용 ② 행렬 9칸의 값 읽기 ③ 경계 검출과 결과 비교",
   "hand": "경계 위 한 픽셀의 3×3 평균(모두 1/9 곱해 합)을 종이로 계산해 「중간 밝기」가 되는 이유 확인"
  },
  {
   "t": "가로줄 사냥꾼 — 가로선 강조 필터로 그림 속 가로줄만 도드라지게 만들어 보세요. 행렬의 위·아래 줄은 어떻게 다르게 생겼나요?",
   "re": "-2",
   "do": "① 가로선 강조 적용 ② 결과에서 살아남은 부분 확인 ③ 행렬의 위줄(−1,−2,−1)과 아랫줄(1,2,1) 대조",
   "hand": "가로 경계 픽셀과 세로 경계 픽셀에서 성분곱 합을 각각 계산해 왜 가로만 반응하는지 검증"
  },
  {
   "t": "필터 4종의 (행렬, 효과) 표 — 행렬 숫자의 배치와 효과의 관계를 네 말로."
  },
  {
   "t": "심화 설계 — 세로선만 강조하는 3×3 행렬을 종이에 설계하세요. 가로선 강조 행렬을 어떻게 돌리면 될까요? 설계한 행렬로 세로 경계 픽셀의 성분곱 합을 계산해 근거를 대세요."
  }
 ],
 "20": [
  {
   "t": "1분 자유 탐색 — 진폭들을 움직이고 소리를 들어 보세요. 눈과 귀 중 무엇이 먼저 차이를 아나요?"
  },
  {
   "t": "기본음 없는 소리 — 기본음을 완전히 끄고 2배음만 남기면 소리 높이가 어떻게 되나요? 파형의 반복 간격을 세어 보세요.",
   "re": "y = [01]\\.\\d\\d·sin\\(2x\\)",
   "do": "① 기본음 진폭 0 ② 3·5배음도 0 ③ 2배음만 0.5로 두고 파형·소리 확인",
   "hand": "sin(2x)의 주기가 sin(x)의 절반임을 x=0~2π 표로 확인 — 한 옥타브 위가 되는 이유"
  },
  {
   "t": "잔떨림의 정체 — 5배음을 켜 파형에 생기는 잔떨림을 관찰하세요. 진폭을 키울수록 소리는 어떻게 달라지나요?",
   "re": "·sin\\(5x\\)",
   "do": "① 기본음 되살리기 ② 5배음을 0.3부터 서서히 ③ 파형과 소리의 변화 기록",
   "hand": "y = sin x + 0.3 sin 5x 의 x=π/2 값을 종이로 계산해 파형 높이와 대조"
  },
  {
   "t": "배음 조합 3가지의 (진폭 목록, 파형 특징, 소리 느낌) 표 — 음색의 정체를 네 말로."
  },
  {
   "t": "심화 — 악기 설계사: 같은 높이인데 음색이 전혀 다른 두 소리를 (진폭 목록)으로 설계·기록하세요. 배음을 아무리 더해도 변하지 않는 것은 무엇이고 왜인가요?"
  }
 ],
 "21": [
  {
   "t": "1분 자유 탐색 — 함수 넷을 전환해 보세요. 파란 그래프와 초록 그래프 사이에 어떤 관계가 보이나요?"
  },
  {
   "t": "암호 해독 — 일차함수(f(x)=2x−3)를 골라 x를 5로 끌어 보세요. 기계가 7을 내놓았을 때 원래 수가 5임이 화면에서 확인되나요? 두 그래프의 교점은 어디에 있나요?",
   "re": "교점은 y = x 위의",
   "do": "① 일차함수 선택 ② x를 5로 끌어 (5, 7)과 (7, 5) 확인 ③ 교점 위치 읽기",
   "hand": "y = 2x − 3 의 역함수 식을 x↔y 바꿔치기로 유도하고 7을 넣어 5가 나오는지 검산"
  },
  {
   "t": "y=x 대칭 vs 원점 점대칭 — 점대칭 토글을 켜 보라 곡선과 초록 곡선을 비교하세요. 무엇이 다른가요?",
   "re": "부호를 뒤집습니다",
   "do": "① 점대칭 보기 켜기 ② 같은 a 에서 초록 점·보라 점 좌표 대조 ③ 규칙 차이 기록",
   "hand": "(a, b)가 y=x 대칭·원점 대칭에서 각각 어디로 가는지 좌표로 쓰기"
  },
  {
   "t": "점근선의 운명 — 유리함수로 전환하세요. 원함수의 점근선 두 개는 역함수에서 어디로 가나요?",
   "re": "점근선 x = 1",
   "do": "① 유리함수 선택 ② 두 곡선의 점근선 위치 읽기 ③ x를 점근선 근처로 끌어 관찰",
   "hand": "(원함수 점근선) → (역함수 점근선) 대응을 좌표 맞바꿈으로 설명"
  },
  {
   "t": "심화 — 거꾸로 기계가 없는 함수: 무리함수에서 x를 정의역 경계 밖까지 끌어 대응점을 없애 보세요. 네 함수의 (정의역, 치역) 표를 완성하고, 이차함수 전체가 왜 거꾸로 기계를 못 갖는지 「한 y에 x 두 개」로 논증하세요.",
   "re": "정의역 밖입니다",
   "do": "① 무리함수 선택 ② x를 2 아래로 끌기 ③ 사라지는 경계값과 역함수 쪽 경계 기록",
   "hand": "원함수 정의역 x ≥ 2 와 역함수 정의역 x ≥ 1 이 치역과 맞바뀌는 관계를 표로 검증"
  }
 ],
 "22": [
  {
   "t": "1분 자유 탐색 — 「＋ 한 항 더하기」를 눌러 보세요. 부분합 점들은 어디로 가고 있나요?"
  },
  {
   "t": "오늘의 문제 판정 — 도착지 L 이 1 에 놓여 있습니다. ε 띠를 좁히고 항을 쌓아, 어느 항부터 계속 띠 안에 갇히는지 찾아내세요.",
   "re": "부터 지금까지",
   "do": "① L 손잡이를 1.000 으로 ② ε 을 0.05 근처로 좁히기 ③ ＋10항을 눌러 띠 안에 갇히는지 확인",
   "hand": "부분합 0.5, 0.75, 0.875, … 를 다섯 개 손으로 계산해 1 에 다가감을 확인"
  },
  {
   "t": "터지는 무한합 — 공비가 1보다 큰 급수로 바꿔 보세요. L 을 어디에 두어도 벗어나나요?",
   "re": "커서 발산",
   "do": "① 급수를 (3/2)ⁿ 으로 ② 항을 쌓으며 부분합 추적 ③ L 을 옮겨도 벗어나는지 확인",
   "hand": "두 급수의 운명이 갈린 이유를 공비 하나로 설명"
  },
  {
   "t": "가장 얄궂은 급수 — 항은 0으로 가는데 합은 터지는 조화급수를 시험하세요. 「항이 0으로 가면 합도 멈춘다」는 직관은 참인가요?",
   "re": "합은 발산",
   "do": "① 조화급수 선택 ② ＋10항을 여러 번 ③ 부분합이 계속 오르는지 관찰",
   "hand": "1/1 + 1/2 + … + 1/8 을 손으로 더해 얼마나 느리게 커지는지 확인"
  },
  {
   "t": "심화 — 상쇄의 리듬: 교대급수로 바꿔 도착지를 찾아보세요. 부호가 번갈아 붙을 때 부분합은 어떻게 움직이며, 그 도착지는 무엇인가요?",
   "re": "번갈아 상쇄",
   "do": "① 교대급수 선택 ② 항을 하나씩 더하며 위·아래로 진동하는 모습 관찰 ③ L 을 0.693 근처로",
   "hand": "1 − 1/2 + 1/3 − 1/4 를 손으로 계산해 진동 폭이 줄어드는 것 확인"
  }
 ],
 "23": [
  {
   "t": "1분 자유 탐색 — 항 수를 늘리며 다항식 곡선이 원래 함수에 붙는 모습을 지켜보세요."
  },
  {
   "t": "계산기 흉내 내기 — 평가점을 37°(라디안 0.65) 근처에 두고 항을 쌓아 소수 4자리 이상 일치시키세요. 계산기 속에 표가 없어도 되는 이유가 보이나요?",
   "re": "소수 [4-9]자리까지 일치",
   "do": "① 함수 sin 선택 ② 평가점을 0.65 근처로 ③ 항을 4~6개까지 올리며 일치 자리수 추적",
   "hand": "x − x³/6 + x⁵/120 에 x=0.65 를 넣어 손으로 계산, 화면의 참값과 대조"
  },
  {
   "t": "멀어지면 무너진다 — 평가점을 중심에서 멀리(3 이상) 끌어 보세요. 같은 항 수로 몇 자리까지 버티나요?",
   "re": "소수 [0-2]자리까지 일치",
   "do": "① 평가점을 3 이상으로 ② 일치 자리수 기록 ③ 항을 더 올려 회복되는지 확인",
   "hand": "(항 수, 일치 자리수) 표를 가까운 점·먼 점 두 곳에서 작성"
  },
  {
   "t": "수렴반경의 벽 — 함수를 ln(1+x)로 바꾸고 평가점을 1 밖으로 끌어 보세요. 항을 아무리 쌓아도 소용없는 영역이 정말 있나요?",
   "re": "바깥입니다",
   "do": "① ln(1+x) 선택 ② 평가점을 1.2 이상으로 ③ 항을 크게 올려도 오차가 줄지 않는지 관찰",
   "hand": "수렴반경 안팎에서 오차가 어떻게 달라지는지 두 줄로 정리"
  },
  {
   "t": "심화 — 계산기 설계자: 소수 8자리까지 맞히려면 37°에서 몇 항이 필요한지 실험으로 정하고, 각이 커질수록 항이 더 필요한 이유를 수렴반경으로 설명하세요. 계산기가 각을 먼저 0~45°로 줄이는 이유까지 추론해 보세요."
  }
 ],
 "24": [
  {
   "t": "1분 자유 탐색 — 흰 점을 끌어 그릇 모양을 바꾸고, 원판 수도 바꿔 보세요. 계단은 무엇을 닮아 가나요?"
  },
  {
   "t": "와인잔의 부피 — 와인잔 프리셋을 불러와 원판을 늘려 오차를 0.6% 아래로 만드세요. 공식 없는 그릇의 부피를 잴 수 있나요?",
   "re": "오차 = 0\\.[0-5]\\d%",
   "do": "① 와인잔 버튼 ② 원판 8→16→…→256장 ③ (장수, 오차) 기록하며 목표 도달",
   "hand": "가장 굵은 원판 하나의 πr²Δy 를 종이로 계산해 화면 값과 대조"
  },
  {
   "t": "절반의 법칙 — 원판을 2배로 할 때마다 오차가 몇 배가 되는지 두 번 확인하고, 촘촘히(128장)까지 밀어붙이세요.",
   "re": "원판 128장",
   "do": "① 장수 2배 → 오차 배율 기록 ② 한 번 더 2배 ③ 128장 도달",
   "hand": "절반 규칙으로 256장의 오차를 예측해 두기"
  },
  {
   "t": "(원판 수, 근사값, 오차) 표 — 무한히 얇게 자르면 무슨 일이 벌어질까요? 적분 기호와 이어 쓰세요."
  },
  {
   "t": "심화 — 원뿔 검증: 원뿔 버튼을 눌러 정확한 부피를 읽고, 공식 (1/3)πr²h 손계산과 비교하세요. 반구도 (2/3)πr³ 로 검증해 보세요.",
   "re": "= 8\\.21",
   "do": "① 원뿔 버튼 ② 정확한 부피 읽기 ③ 손계산과 차이 원인(꼭짓점이 0이 아님) 찾기",
   "hand": "(1/3)π × 1.4² × 4 를 계산해 화면 값과 대조"
  }
 ],
 "25": [
  {
   "t": "1분 자유 탐색 — 소수 두 개를 눌러 곱을 만들어 보세요. 곱하기와 되돌리기, 화면 어느 쪽이 바쁜가요?"
  },
  {
   "t": "오늘의 자물쇠 부수기 — 83 과 89 를 눌러 N = 7,387 을 만든 뒤, 나눠 보기(또는 자동)로 소인수를 직접 찾아내세요. 곱하기는 몇 번, 되돌리기는 몇 번이었나요?",
   "re": "찾았습니다!",
   "do": "① 소수 격자에서 83, 89 선택 ② 나눠 보기 연타(또는 자동) ③ 성공까지의 횟수와 √N 비교",
   "hand": "√7387 ≈ 86 을 어림해 「최악의 경우 횟수」를 먼저 예측하고 실험과 대조"
  },
  {
   "t": "자물쇠 낮추기 — 이번엔 아주 작은 소수 쌍(예: 3과 5)으로 N 을 만들어 부숴 보세요. 나눠 본 횟수가 한 자리로 줄어드나요?",
   "re": "나눠 본 횟수 [1-9]번",
   "do": "① 소수 격자에서 3, 5 선택 ② 나눠 보기 연타 ③ 큰 쌍의 횟수와 비교",
   "hand": "두 경우의 (N, √N, 횟수)를 표로 적고 관계 찾기"
  },
  {
   "t": "(p, q, N, √N, 나눠 본 횟수) 표 3행 — 횟수는 무엇에 가까운가요? 규칙을 네 말로."
  },
  {
   "t": "심화 — RSA 의 뿌리: 표에서 가장 큰 소수 둘로 자물쇠를 다시 세우고 부숴 보세요. 자리 수가 늘 때 √N 이 몇 배가 되는지 계산해, 실제 암호가 수백 자리 소수를 쓰는 이유를 추정하세요.",
   "re": "나눠 본 횟수 [7-9]\\d번",
   "do": "① 83×89 이상급 쌍 선택 ② 자동으로 끝까지 ③ 횟수·√N·「다 보면」 값 비교",
   "hand": "자리 수가 2배가 되면 √N 은 몇 배가 되는지 지수로 계산"
  }
 ],
 "26": [
  {
   "t": "1분 자유 탐색 — 파란 점(a)과 주황 화살표 끝을 끌어 보세요. 더하기 화살표는 무엇을 따라 움직이나요?"
  },
  {
   "t": "새벽 기온부터 — a 를 −5 로 끌고 화살표로 +8 을 놓아 낮 기온을 구하세요. 이어서 밤에 6도 내려간 최종 기온까지 만들어 보세요.",
   "re": "-5 \\+ 8 = 3",
   "do": "① 연산을 + 로 ② a 를 −5 로 끌기 ③ 화살표 끝을 8칸 오른쪽으로 (결과 3 확인)",
   "hand": "(−5) + 8 − 6 을 종이에서 왼쪽부터 차례로 계산해 화면과 대조"
  },
  {
   "t": "빼기의 정체 — 연산을 빼기로 바꾸고 화살표를 관찰하세요. 빼기 화살표는 더하기와 어떤 관계인가요?",
   "re": "같은 화살표입니다",
   "do": "① 연산을 a − b 로 전환 ② 같은 b 에서 더하기·빼기 화살표 방향 비교 ③ b 를 끌어 여러 값 시험",
   "hand": "(−5) − 3 과 (−5) + (−3) 을 종이에 나란히 계산해 같은 값임을 확인"
  },
  {
   "t": "수수께끼의 이중 부호 — 빼기 모드에서 화살표 끝을 끌어 b 를 음수로 만들어 보세요. a − (음수)의 화살표는 어느 쪽인가요?",
   "re": "− \\(-\\d+\\) =",
   "do": "① 빼기 모드 유지 ② 화살표 끝을 a 의 오른쪽으로 끌어 b 를 음수로 ③ 결과 화살표 방향 기록",
   "hand": "a − (−b) = a + b 임을 화살표 두 개(빼기의 반전 + 음수의 반전)로 그림 설명"
  },
  {
   "t": "심화 — 일기예보관: 영하 7도의 아침에서 낮에 12도 올랐다가 다시 5도 내려간 하루를 화살표로 재현하고, 부호 4조합 × 연산 2가지 8줄 표로 「실제로 더해진 값」의 규칙을 완성하세요.",
   "re": "-7 \\+ 12 = 5",
   "do": "① 연산을 + 로 ② a 를 −7로 ③ 화살표 끝을 +12만큼 오른쪽으로",
   "hand": "(−7) + 12 − 5 를 종이에서 차례로 계산"
  }
 ],
 "27": [
  {
   "t": "1분 자유 탐색 — 「한 칸 잇기」를 눌러 보세요. 새로 드는 성냥개비(주황 반짝임)는 몇 개인가요?"
  },
  {
   "t": "100칸을 세지 않고 알려면 — 먼저 다섯 칸까지 이어 붙이며 (칸 수, 성냥개비 수)를 기록하세요. 매번 몇 개씩 느나요?",
   "re": "n = 5 일 때",
   "do": "① 한 칸 잇기를 눌러 n=5까지 ② 매번 반짝이는 개수 세기 ③ 표에 기록",
   "hand": "1칸 4개에서 출발해 +3씩 다섯 번 — 종이에서 누적해 화면과 대조"
  },
  {
   "t": "끝까지 — n=8까지 채우세요. 세 가지 식(3n+1 · 4+3(n−1) · 4n−(n−1))은 8에서도 모두 같은 값인가요? 식을 골라 묶음 색깔도 비교하세요.",
   "re": "n = 8 일 때",
   "do": "① n=8까지 잇기 ② 세 식의 값 비교 ③ 식을 하나씩 골라 색 묶음이 어떻게 다른지 관찰",
   "hand": "세 식에 n=8 을 넣어 종이 계산 — 셋 다 25가 되는 과정을 나란히"
  },
  {
   "t": "규칙 사냥 — 같은 그림을 왜 세 가지 식으로 쓸 수 있을까요? 각 식이 성냥개비를 어떻게 묶었는지 그림으로 정리하세요."
  },
  {
   "t": "심화 — 오늘의 문제 답하기: 100칸의 성냥개비 수를 식으로 예언하고(3×100+1), 정삼각형을 이어 붙이는 새 모양의 식을 스스로 만들어 n=4 에서 종이로 검증하세요."
  }
 ],
 "28": [
  {
   "t": "1분 자유 탐색 — 버튼들을 눌러 보세요. 저울과 식은 어떻게 함께 움직이나요?"
  },
  {
   "t": "주머니의 무게를 밝혀라 — 화면의 저울이 곧 오늘의 문제(2x + 3 = 11)입니다. 양변에 같은 일만 해서 x 만 남기세요.",
   "re": "x = 4 를 찾았습니다",
   "do": "① 양변에서 1 빼기를 세 번(또는 다른 순서) ② 양변을 2로 나누기 ③ 결과 확인",
   "hand": "내 조작 순서를 등식 변형으로 종이에 기록하고 2×4+3 = 11 로 검산"
  },
  {
   "t": "균형 보존 실험 — 처음으로 되돌린 뒤, 더하기·빼기·나누기를 각각 해 보세요. 저울은 기울었나요? 식의 「뜻」은 변했나요?",
   "re": "· 양변을 2로 나누기",
   "do": "① 처음으로 ② 양변에 1 더하기 ③ 양변을 2로 나누기 — 매번 수평 확인",
   "hand": "각 조작을 등식 2x+3=11 에 기호로 병기하며 따라 쓰기"
  },
  {
   "t": "반례 제작 — 왼쪽에서만 1을 빼면 무슨 일이 벌어지나요? 등식의 성질이 금지하는 것을 확인하세요.",
   "re": "한쪽만 건드렸습니다",
   "do": "① 왼쪽에서만 1 빼기 실행 ② 저울과 안내문 관찰 ③ 처음으로 복구",
   "hand": "깨진 식과 원래 식에 x=4 를 넣어 한쪽만 성립함을 확인"
  },
  {
   "t": "심화 — 3x+2=14 를 이 저울의 규칙만으로 종이에서 풀고 매 단계를 기록하세요. 그리고 「이항하면 부호가 바뀐다」가 왜 새 규칙이 아니라 등식의 성질의 그림자인지 설명하세요."
  }
 ],
 "29": [
  {
   "t": "1분 자유 탐색 — 손(주황 점)을 끌어 보세요. 필요한 힘은 어떻게 변하나요?"
  },
  {
   "t": "지렛대의 거래 — 손을 받침점에서 2 m 지점으로 옮겨 필요한 힘을 확인하세요. 4 m 일 때(힘 6)와 견주면 무엇이 변하지 않나요?",
   "re": "x = 2\\.0 · y = 12\\.0",
   "do": "① 손을 x=2 로 끌기 ② 힘 y 읽기 ③ 다시 x=4 로 물러나 힘 비교",
   "hand": "2×12 와 4×6 을 계산해 같은 값이 나오는지 확인 — 곱인가 합인가?"
  },
  {
   "t": "곡선 발굴 — 손 위치를 바꿔 가며 「지금 점 찍기」로 점을 3개 이상 모으세요. 숨어 있던 무엇이 드러나나요?",
   "re": "곡선이 드러났습니다",
   "do": "① x=2 에서 점 찍기 ② x=5, x=8 에서도 ③ 드러난 모양 관찰",
   "hand": "세 짝의 x×y 를 종이에서 계산해 모두 같은 값인지 판정"
  },
  {
   "t": "용수철의 세계 — 관계를 정비례로 바꾸고 손을 끌며 y÷x 를 추적하세요. 이번엔 무엇이 변하지 않나요?",
   "re": "y ÷ x = 2\\.40",
   "do": "① 용수철 모드로 전환 ② x 를 여러 값으로 끌며 y÷x 관찰 ③ 점 3개 찍어 모양 비교",
   "hand": "정비례에서 y÷x 가 일정한 이유를 y=ax 식에서 설명"
  },
  {
   "t": "심화 — 아르키메데스의 호언: 손을 받침점 바로 옆 0.5 m 까지 끌어 보세요. 힘이 얼마나 필요한가요? x×y 는 여전히 같은가요? 「충분히 긴 지렛대만 있으면 지구도 들 수 있다」를 이 실험의 규칙으로 해석하세요.",
   "re": "x = 0\\.5 · y = 48\\.0",
   "do": "① 지렛대 모드 확인 ② 손을 0.5 까지 끌기 ③ x×y 값 확인",
   "hand": "지구를 드는 데 필요한 거리 비를 x×y 일정으로 어림해 보기"
  }
 ],
 "30": [
  {
   "t": "1분 자유 탐색 — 주황 손잡이(횡단선)와 파란 손잡이(아랫줄)를 끌어 보세요. 두 각은 언제 붙어 다니나요?"
  },
  {
   "t": "사진의 착시 vs 실제 — 아랫줄을 끌어 평행을 깨뜨려 보세요. 「이름은 동위각인데 크기는 다르다」는 상황이 만들어지나요?",
   "re": "성질은 깨졌습니다",
   "do": "① 평행 상태에서 동위각 두 값 확인 ② 아랫줄을 기울이기 ③ 두 각의 차이 추적",
   "hand": "평행일 때와 8° 어긋났을 때의 (첫째 각, 둘째 각)을 표로 대조"
  },
  {
   "t": "동측내각의 비밀 — 표시를 동측내각으로 바꾸고 평행으로 되돌리세요. 이번엔 「같다」가 아니라 무엇이 성립하나요?",
   "re": "두 각의 합 180°",
   "do": "① 평행으로 되돌리기 ② 동측내각 선택 ③ θ 를 바꿔 가며 합 추적",
   "hand": "동측내각의 합이 왜 180°인지 동위각 + 평각으로 유도"
  },
  {
   "t": "세 종류(동위·엇·동측내) × 평행/어긋남 — 표를 채우고 성립 조건을 한 문장으로."
  },
  {
   "t": "심화 — 원근법의 역설: 철길 사진에서는 평행선이 한 점에서 만나 보입니다. 오늘의 「평행 ⇔ 성질」과 모순인지 아닌지 논증하고, 건널목 차단기가 두 레일과 만드는 각들을 한 장 그림으로 정리하세요."
  }
 ],
 "31": [
  {
   "t": "1분 자유 탐색 — 주황 손잡이(변 b)와 파란 손잡이(각 A)를 끌어 보세요. 삼각형 개수가 언제 변하나요?"
  },
  {
   "t": "철탑이 안 찌그러지는 이유 — 조건을 SSS 로 바꿔 보세요. 세 변이 정해지면 모양은 몇 가지인가요?",
   "re": "SSS — 주어진 값",
   "do": "① SSS 선택 ② 안내문 확인 ③ SAS·ASA 도 눌러 같은지 비교",
   "hand": "사각형 프레임이 왜 찌그러지는지(네 변이 같아도 모양이 여럿) 그림으로 대조"
  },
  {
   "t": "삼각형 소멸 실험 — SSA 로 돌아가 원(변 b)을 줄여 삼각형을 아예 없애 보세요. b 가 얼마부터 사라지나요?",
   "re": "닿지 않아",
   "do": "① SSA 선택 ② b 를 천천히 줄이기 ③ 교점 0이 되는 경계값 기록",
   "hand": "경계값이 B 의 높이(AB·sinA)와 같은 이유를 그림으로 설명"
  },
  {
   "t": "하나로 만들기 — 이번엔 b 를 변 AB(150)보다 크게 끌어 보세요. 삼각형이 몇 개가 되나요? 「두 개」가 되는 b 의 범위를 확정하세요.",
   "re": "삼각형이 하나입니다",
   "do": "① b 를 150 이상으로 ② 교점 수 확인 ③ 두 개가 되는 범위(높이 < b < AB) 검증",
   "hand": "(A=35°, AB=150)일 때 두 개가 되는 b 범위를 계산해 실험과 대조"
  },
  {
   "t": "심화 — 구조 설계사: 다리와 철탑이 삼각형 트러스로 지어지는 이유를 SSS 의 「하나로 정해짐」으로 논증하고, SSA 가 조건이 못 되는 반례를 그림으로 제시하세요."
  }
 ],
 "32": [
  {
   "t": "1분 자유 탐색 — 호의 끝(주황)을 돌리고 반지름 끝(파랑)을 끌어 보세요. 무엇 무엇이 함께 변하나요?"
  },
  {
   "t": "학원 3시간의 조각 — 하루 24시간 중 3시간이면 원그래프에서 몇 도일까요? 계산으로 먼저 정하고, 호 끝을 돌려 그 각을 정확히 만드세요.",
   "re": "중심각 45°",
   "do": "① 360 × 3/24 를 계산 ② 호 끝을 돌려 그 각에 맞추기 ③ 세 비율(각·호·넓이) 확인",
   "hand": "잠 8시간·학교 7시간의 중심각도 같은 방법으로 계산해 표 완성"
  },
  {
   "t": "두 배의 법칙 — 중심각을 240°까지 돌리면 호의 길이와 넓이는 정말 2배가 되나요? 값으로 판정하세요.",
   "re": "중심각 240°",
   "do": "① 120°에서 (호, 넓이) 기록 ② 240°로 돌려 다시 기록 ③ 배율 계산",
   "hand": "2πr × 240/360 을 종이에서 계산해 화면 값과 대조"
  },
  {
   "t": "반지름의 배신? — 각을 그대로 두고 반지름을 120까지 키워 보세요. 호·넓이는 커지는데 세 비율은 어떻게 되나요?",
   "re": "반지름 120",
   "do": "① 각 고정, r 을 120까지 ② 세 비율 관찰 ③ r=60 에서도 확인",
   "hand": "비율 식에서 r 이 약분되는 과정을 손으로 쓰기"
  },
  {
   "t": "심화 — 넓이의 함정: 같은 중심각에서 반지름을 40으로 줄였다가 되돌리며 (호, 넓이)를 기록하세요. 반지름 2배에 호는 몇 배, 넓이는 몇 배인가요? 원그래프가 성립하는 이유를 한 문장으로 정리하세요.",
   "re": "반지름 40",
   "do": "① r=40 에서 (호, 넓이) ② r=80 에서 다시 ③ 배율 두 개 비교",
   "hand": "호는 r 에, 넓이는 r² 에 비례함을 두 기록으로 검증"
  }
 ],
 "33": [
  {
   "t": "1분 자유 탐색 — 진열대를 눌러 팔고, 막대를 눌러 반품해 보세요. 세 대푯값은 각각 무엇에 반응하나요?"
  },
  {
   "t": "유행 만들기 — 개점(다시)으로 비운 뒤, 230 진열대를 눌러 오늘의 유행 치수를 230으로 만들어 보세요. 어느 대푯값이 그것을 알려 주나요?",
   "re": "최빈값 230",
   "do": "① 개점(다시) ② 230 진열대 연타 ③ 다른 치수도 조금 팔아 최빈값 유지 확인",
   "hand": "최빈값이 「가장 많이」라는 물음의 답인 이유를 한 줄로"
  },
  {
   "t": "평균의 거짓말 — 230과 280을 같은 수만큼 팔아 양극화 가게를 만들어 보세요. 중앙값은 어디에 서나요? 평균 치수의 신발은 진열대에 있나요?",
   "re": "중앙값 255",
   "do": "① 230 몇 켤레 ② 280 같은 수만큼 ③ 평균·중앙값의 자리와 진열대 대조",
   "hand": "(230×k + 280×k)÷2k 를 계산해 평균이 「없는 치수」가 됨을 확인"
  },
  {
   "t": "(분포 모양, 평균, 중앙값, 최빈값) 표 3행 — 발주서에 적을 대푯값과 그 이유를 쓰세요."
  },
  {
   "t": "심화 — 대량 데이터의 힘: 하루 손님 버튼을 여러 번 눌러, 가장 많이 팔린 치수가 스무 켤레를 넘도록 판매를 키우세요. 분포는 어떤 모양으로 안정되고, 세 대푯값은 어디로 모이나요?",
   "re": "\\((2[0-9]|[3-9][0-9])켤레\\)",
   "do": "① 하루 손님 +15 를 여러 번 ② 매번 세 대푯값 기록 ③ 분포 모양의 안정 관찰",
   "hand": "기록 4행에서 평균의 흔들림 폭이 줄어드는지 판정"
  }
 ],
 "34": [
  {
   "t": "1분 자유 탐색 — 폭 버튼과 손잡이로 계급을 잘라 보세요. 원자료 점판은 왜 변하지 않나요?"
  },
  {
   "t": "들쭉날쭉의 세계 — 폭을 5까지 좁혀 보세요. 막대가 몇 개가 되고, 어떤 인상을 주나요?",
   "re": "계급의 크기 5점",
   "do": "① 폭 5 적용 ② 계급 수·최고 계급 기록 ③ 폭 10과 인상 비교",
   "hand": "폭 5에서 60~65 구간 도수를 점판에서 직접 세어 막대와 대조"
  },
  {
   "t": "뭉개기의 세계 — 이번엔 폭을 40까지 넓혀 보세요. 분포의 무엇이 사라지나요?",
   "re": "계급의 크기 40점",
   "do": "① 폭 40 적용 ② 남은 계급 수 확인 ③ 봉우리가 어디 갔는지 점판과 대조",
   "hand": "폭 5·10·40의 (계급 수, 인상)을 표로 정리"
  },
  {
   "t": "「정직한 폭」의 기준을 스스로 제안하세요 — 무엇을 드러내고 무엇을 감추지 말아야 하나요?"
  },
  {
   "t": "심화 — 조작의 기술: 시작점 ▲ 을 끌어 옮겨 보세요. 폭이 같아도 최고 봉우리 계급이 달라지나요? 같은 자료로 서로 다른 「1등 구간」을 주장하는 그래프 두 개를 만들고, 그래프를 읽을 때 확인해야 할 것을 정리하세요.",
   "re": "시작점 [1-9]점",
   "do": "① 폭 10 상태에서 시작점을 조금씩 끌기 ② 최고 계급의 이동 기록 ③ 두 주장 그래프 완성",
   "hand": "두 그래프의 (시작점, 최고 계급)을 나란히 적고 어느 쪽도 거짓이 아님을 설명"
  }
 ],
 "35": [
  {
   "t": "1분 자유 탐색 — 「한 칸 돌리기」를 눌러 보세요. 두 빨간 점은 각각 언제 제자리로 오나요?"
  },
  {
   "t": "만남의 예언 — 12·18 톱니가 처음 자리에서 동시에 다시 만나는 칸 수를 먼저 예상하고, 돌려서 판정하세요.",
   "re": "함께 제자리",
   "do": "① 예상 칸 수를 메모 ② 빨리 감기로 끝까지 ③ 멈춘 칸 수와 예상 비교",
   "hand": "12와 18을 소인수분해해 최소공배수를 종이에서 계산"
  },
  {
   "t": "서로소의 세계 — 손잡이를 끌어 공약수가 1뿐인 두 톱니 수로 바꿔 보세요. 만남까지 걸리는 칸 수는 무엇이 되나요?",
   "re": "최대공약수 g = 1",
   "do": "① 톱니 수를 (5, 18) 같은 쌍으로 ② g 값 확인 ③ 만남 칸 수 예상",
   "hand": "서로소일 때 lcm = a×b 가 되는 이유를 소인수로 설명"
  },
  {
   "t": "(a, b, g, lcm, a×b, g×lcm) 표 3행 — 두 열이 늘 같은 이유를 네 말로."
  },
  {
   "t": "심화 — 규칙의 증명대: 새 쌍으로 끝까지 돌려 「g × lcm = a × b」가 유지되는지 검증하고, 소인수 나눠 갖기(공통은 낮게, 전체는 높게)로 증명하세요.",
   "re": "함께 제자리 — 최소공배수 lcm\\((?!12,18)",
   "do": "① 새 쌍(서로소 포함)으로 빨리 감기 완주 ② g×lcm 과 a×b 대조 ③ 한 쌍 더",
   "hand": "a=2²×3, b=2×3² 꼴로 두고 g×lcm 을 지수로 전개해 a×b 와 일치 확인"
  }
 ],
 "36": [
  {
   "t": "1분 자유 탐색 — 세 손잡이(a·b·c)를 끌어 보세요. 두 호가 만났다 떨어지는 순간을 찾아보세요."
  },
  {
   "t": "실패 제작소 — 아무리 해도 삼각형이 안 되는 세 변을 만들어 보세요. 실패의 공통점은 무엇인가요?",
   "re": "— 안 됩니다",
   "do": "① a 를 크게 늘리기 ② 두 호가 떨어지는 순간 관찰 ③ (a,b,c) 실패 사례 3개 수집",
   "hand": "실패 사례마다 「가장 긴 변 vs 나머지 합」 부등호를 종이에 쓰기"
  },
  {
   "t": "경계의 순간 — 가장 긴 변과 나머지 두 변의 합이 정확히 같아지게 만들어 보세요. 이 순간 삼각형은 어떤 모습인가요?",
   "re": "(\\d+) ≥ \\1 —",
   "do": "① b=110, c=90 확인 ② a 를 천천히 끌어 정확히 200에 맞추기 ③ 호가 닿는 자리 관찰",
   "hand": "경계에서 세 점이 한 직선에 놓임(퇴화)을 그림으로 설명"
  },
  {
   "t": "(a, b, c, 성공 여부) 표 — 삼각형이 되는 조건을 부등식 하나로 정리하세요."
  },
  {
   "t": "심화 — 설계 문제: 변 두 개가 110·90으로 정해진 트러스 부품에서, 세 번째 변이 가질 수 있는 길이의 범위를 부등식으로 구하고 화면 실험(양쪽 경계)으로 검증하세요."
  }
 ],
 "37": [
  {
   "t": "1분 자유 탐색 — 타일을 골라 「한 장 붙이기」를 눌러 보세요. 게이지는 무엇을 재고 있나요?"
  },
  {
   "t": "완벽한 바닥 — 정육각형으로 한 점 둘레를 빈틈도 겹침도 없이 채워 보세요. 몇 장이 필요한가요?",
   "re": "딱 360°",
   "do": "① 정육각형 선택 ② 한 장씩 붙이며 게이지 관찰 ③ 채워진 장수와 내각의 관계 확인",
   "hand": "360 ÷ 120 을 계산하고, 정삼각형·정사각형도 같은 방법으로 예언"
  },
  {
   "t": "오각형의 비극 — 정오각형으로 같은 일을 시도해 보세요. 왜 실패하나요? 몇 도가 남나요?",
   "re": "못 채웁니다",
   "do": "① 정오각형 선택 ② 끝까지 붙이기 ③ 남은 각도와 108°의 관계 확인",
   "hand": "360 ÷ 108 을 계산해 자연수가 아님을 확인 — 이것이 실패의 전부인가?"
  },
  {
   "t": "여섯 타일의 (한 내각, 360÷내각, 성공 여부) 표 — 되는 도형이 세 개뿐인 이유를 쓰세요."
  },
  {
   "t": "심화 — 혼합 타일의 발견: 정팔각형을 붙이면 빈틈이 정확히 90°로 남습니다. 그 자리에 들어갈 도형은 무엇인가요? 실제 보도블록(팔각형+정사각형)의 원리를 각도 식으로 설명하고, 또 다른 혼합 조합을 제안하세요.",
   "re": "빈틈 90°",
   "do": "① 정팔각형 두 장 붙이기 ② 남은 각도 읽기 ③ 어울리는 짝 도형 추론",
   "hand": "135+135+90=360 을 쓰고, 3.12.12(정삼각형+정십이각형 2)도 검산"
  }
 ],
 "38": [
  {
   "t": "1분 자유 탐색 — 입체를 끌어 돌리고 빨간 손잡이로 잘라 보세요. 오른쪽 단면 창은 무엇을 보여 주나요?"
  },
  {
   "t": "오일러의 흔적 — 정사면체·정육면체·정팔면체를 차례로 돌려 보며 (v, e, f)를 세고 v−e+f 를 계산하세요. 세 입체에서 무슨 일이?",
   "re": "정팔면체 — 다면체",
   "do": "① 정사면체에서 v·e·f 직접 세기 ② 정육면체 ③ 정팔면체까지 표 완성",
   "hand": "세 입체의 v−e+f 를 종이 표로 계산해 공통값 발견"
  },
  {
   "t": "회전체의 단면 — 원뿔을 골라 여러 높이에서 잘라 보세요. 단면은 항상 무슨 모양인가요? 원기둥·구도 확인하세요.",
   "re": "언제나 원",
   "do": "① 원뿔 선택 ② 손잡이를 위아래로 끌며 단면 관찰 ③ 원기둥·구에서도 반복",
   "hand": "회전체의 단면이 항상 그 모양인 이유를 「회전」의 뜻으로 설명"
  },
  {
   "t": "(입체, 종류, v−e+f 또는 단면) 표 — 다면체의 약속과 회전체의 약속을 나눠 쓰세요."
  },
  {
   "t": "심화 — 구의 단면 법칙: 구를 골라 자르는 높이를 꼭대기 근처로 끌어 보세요. 단면 반지름이 절반 아래로 떨어지는 높이는 어디쯤인가요? 반지름 비율을 식 √(1−(2t−1)²) 으로 손계산해 실험과 대조하세요.",
   "re": "구 — 회전체[\\s\\S]{0,60}반지름 비율 [1-4]\\d%",
   "do": "① 구 선택 ② 높이를 90% 위로 끌기 ③ (높이, 반지름 비율) 짝 3개 수집",
   "hand": "t=0.95 에서 비율을 식으로 계산해 화면 %와 대조"
  }
 ],
 "39": [
  {
   "t": "1분 자유 탐색 — 가로·세로 손잡이를 끌어 보세요. 부피가 8,000으로 고정인데 무엇이 함께 움직이나요?"
  },
  {
   "t": "극단 실험 ① — 우산 상자(8×10×100)를 만들어 보세요. 같은 부피인데 겉넓이는 얼마가 되나요?",
   "re": "높이 100\\.0",
   "do": "① 우산 상자 버튼(또는 손잡이로 8×10) ② 겉넓이 게이지 읽기 ③ 기록",
   "hand": "2(ab+bc+ca)에 8·10·100 을 넣어 종이 계산, 화면과 대조"
  },
  {
   "t": "극단 실험 ② — 이번엔 피자 상자(40×40×5)입니다. 겉넓이는 우산 상자보다 나은가요?",
   "re": "높이 5\\.0",
   "do": "① 피자 상자 버튼 ② 겉넓이 비교 ③ 두 극단의 공통점 생각",
   "hand": "두 극단 상자의 겉넓이를 표로 나란히 적기"
  },
  {
   "t": "(가로, 세로, 높이, 겉넓이) 표 5행 — 겉넓이가 작아지는 모양의 조건을 네 말로."
  },
  {
   "t": "심화 — 최소를 찾아라: 손잡이만 끌어 겉넓이를 빨간 금(2,400)까지 내려 보세요. 어떤 모양에서 바닥에 닿나요? 실제 택배 상자가 그 모양이 아닌 이유도 두 가지 쓰세요.",
   "re": "바닥에 닿았습니다",
   "do": "① 손잡이로 가로·세로를 조금씩 조정 ② 게이지 최저 기록 갱신 ③ 최소 모양 확정",
   "hand": "a=b=c 일 때 겉넓이 6a² 에 a=20 을 넣어 최소값 확인"
  }
 ],
 "40": [
  {
   "t": "1분 자유 탐색 — 점수 카드를 몇 장 눌러 보세요. 카드는 어디로 날아가 무엇이 되나요?"
  },
  {
   "t": "그림 완성 — 카드 25장을 전부 넣어 줄기-잎 그림을 완성하세요. 원자료는 그림 어디에 살아 있나요?",
   "re": "다 넣었습니다",
   "do": "① 카드를 하나씩 눌러 절반쯤 ② 남은 카드 모두 넣기 ③ 잎의 배열 관찰",
   "hand": "완성 그림에서 13번째 값(중앙값)을 잎을 세어 직접 찾기"
  },
  {
   "t": "뭉개기 실험 — 히스토그램으로 뭉개 보세요. 방금까지 셀 수 있던 무엇을 잃었나요?",
   "re": "셀 수 없습니다",
   "do": "① 뭉개기 버튼 ② 잎 숫자들이 어떻게 변했는지 관찰 ③ 중앙값 찾기 재시도",
   "hand": "뭉개진 그림에서 중앙값을 알 수 없는 이유를 한 줄로"
  },
  {
   "t": "(정리 방법, 지키는 정보, 잃는 정보, 한눈에 보이는 것) 표를 채우세요."
  },
  {
   "t": "심화 — 복원과 판단: 다시 눌러 잎으로 되돌리고, 중앙값을 잎에서 직접 세어 확정하세요. 자료가 2,500명이라면 어느 정리를 쓸지, 「얻는 것과 잃는 것」으로 결론을 쓰세요.",
   "re": "중앙값: 65",
   "do": "① 뭉개기 버튼 다시 ② 작은 잎부터 13번째 세기 ③ 화면 값과 대조",
   "hand": "25명일 때와 2,500명일 때의 선택을 각각 근거와 함께"
  }
 ],
 "41": [
  {
   "t": "1분 자유 탐색 — 칸을 눌러 학생을 넣어 보세요. 두 반의 막대는 무엇을 말하나요?"
  },
  {
   "t": "공정의 발명 — 보기를 상대도수로 바꿔 보세요. 두 반 모두에서 변하지 않는 값이 하나 있습니다. 무엇인가요?",
   "re": "두 반 모두 1",
   "do": "① 상대도수로 전환 ② 두 반의 상대도수 합 확인 ③ 칸을 눌러 인원을 바꿔도 합이 그대로인지",
   "hand": "7/28 + 21/28 = 1 처럼 합이 1이 되는 이유를 분수로 설명"
  },
  {
   "t": "불공정 제조기 — B반 인원을 ×3으로 불려 보세요. 도수 그래프는 어떻게 왜곡되고, 상대도수 그래프는 어떻게 버티나요?",
   "re": "인원이 크게 다릅니다",
   "do": "① B반 ×3 버튼 ② 도수 보기에서 두 반 비교 ③ 상대도수 보기로 전환해 재비교",
   "hand": "B반 70점대의 (도수, 상대도수)를 ×3 전후로 표에 적기"
  },
  {
   "t": "(보기 방식, A/B 인원, 봉우리) 표 — 공정한 비교의 규칙을 한 문장으로."
  },
  {
   "t": "심화 — 여론 조작 실험: A반 90점대 칸을 연타해 A반의 봉우리를 90점대로 옮겨 보세요. 몇 명이 필요한가요? 상대도수 그래프에서는 어떻게 보이나요? 「추가 표본이 분포 모양을 바꾸는 조건」을 정리하세요.",
   "re": "봉우리: A반 90점대",
   "do": "① A반 90점대 칸 연타 ② 봉우리 이동 순간 포착 ③ 상대도수로 확인",
   "hand": "봉우리가 바뀌는 데 필요한 최소 인원을 세어 기록"
  }
 ],
 "42": [
  {
   "t": "1분 자유 탐색 — 「다시 뽑기」를 눌러 보세요. 표본이 바뀔 때마다 무엇이 흔들리나요?"
  },
  {
   "t": "흔들림 재기 — 같은 크기로 여러 번 뽑아 평균의 흔들림 폭을 재 보세요. 띠에 쌓이는 점들이 그 기록입니다.",
   "re": "흔들림 폭:",
   "do": "① 표본 30에서 「10번 연달아」 ② 흔들림 폭 읽기 ③ 띠의 점 퍼짐 관찰",
   "hand": "다섯 평균의 최대−최소를 직접 계산해 화면 폭과 대조"
  },
  {
   "t": "크기의 힘 — 손잡이를 끌어 표본을 120명 이상으로 키우고 같은 실험을 반복하세요. 폭은 어떻게 변하나요?",
   "re": "표본 (1[2-9]\\d|200)명",
   "do": "① 손잡이를 120~200으로 ② 10번 연달아 ③ 30명일 때와 폭 비교",
   "hand": "두 폭의 비를 계산하고 √(크기 비)와 견주기"
  },
  {
   "t": "(표본 크기, 흔들림 폭) 표 3행 — 「몇 명이면 믿을 만한가」 기준을 제안하세요."
  },
  {
   "t": "심화 — 새 탐구 설계: 주제를 수면 시간으로 바꿔, 「평균 ○시간」이라고 말하는 데 필요한 표본 크기를 나만의 기준(폭 0.3시간 이하)으로 정하고 실험 근거를 남기세요. 표본을 어디서 뽑아야 공정한지도 쓰세요.",
   "re": "수면 시간 · 표본",
   "do": "① 주제 전환 ② 크기별로 10번 연달아 ③ 기준 만족 크기 확정",
   "hand": "학원가 앞에서만 물으면 안 되는 이유를 표집 편향으로 설명"
  }
 ],
 "43": [
  {
   "t": "첫 실험 — 타일 두 장만 골라 옳은 바구니에 담아 보세요. 어떤 타일이 어느 바구니로 가야 하나요?",
   "re": "담은 타일 2 / 4",
   "do": "① x 타일 하나를 x 바구니로 ② 상수 타일 하나를 상수 바구니로 ③ 틀린 바구니에도 넣어 보기(튕김 관찰)",
   "hand": "x 타일이 상수 바구니에서 튕겨 나오는 이유를 「단위」로 한 줄 설명"
  },
  {
   "t": "정리 완주 — 네 타일을 모두 담아 식을 정리하세요. 바구니가 스스로 합쳐지며 무엇이 되나요?",
   "re": "정리 완료!",
   "do": "① 남은 두 타일 분류 ② 합쳐진 결과 읽기 ③ x=2 검산 버튼으로 확인",
   "hand": "같은 식을 종이에서 동류항 정리로 풀어 타일 결과와 대조"
  },
  {
   "t": "새 문제 버튼으로 두 문제 더 — 계수끼리는 어떻게 되고, 상수끼리는 어떻게 되나요? 표로 기록하세요."
  },
  {
   "t": "(문제, x항의 합, 상수항의 합, 정리 결과) 표 — 묶이는 조건을 「단위」라는 말로 정리하세요."
  },
  {
   "t": "심화 — 괄호의 관문: 2(3x+1) − (x−4) 를 ① 분배로 타일 여섯 장을 종이에 그려 ② 동류항 정리 두 길로 풀고, x=2 검산까지 완성하세요. −(x−4)에서 부호가 모두 뒤집히는 이유도 설명하세요."
  }
 ],
 "44": [
  {
   "t": "1분 자유 탐색 — 좌표평면에 아무 선이나 그어 보세요. 세로축이 「달린 거리」가 아니라 「집에서의 거리」인 것이 왜 중요할까요?"
  },
  {
   "t": "이야기를 그림으로 — 첫 이야기(편의점)의 그래프를 그리고 「정답과 비교」로 채점받으세요.",
   "re": "평균 어긋남: \\d",
   "do": "① 0~20분 전체를 이어 그리기 ② 채점 ③ 겹쳐진 실제 그래프와 차이 관찰",
   "hand": "멈춘 4분 구간이 그래프에서 어떤 모양이어야 하는지 먼저 스케치"
  },
  {
   "t": "정밀 도전 — 다시 그리기로 지우고, 어긋남 8% 미만이 될 때까지 다듬으세요.",
   "re": "— 훌륭합니다",
   "do": "① 다시 그리기 ② 꺾이는 시각(5·9·16분)을 정확히 ③ 채점 반복",
   "hand": "각 구간의 기울기 부호(+·0·−)를 표로 적고 이야기와 대응"
  },
  {
   "t": "(구간, 기울기 부호, 이야기 사건) 표 — 평평함과 내리막의 뜻을 확정하세요."
  },
  {
   "t": "심화 — 왕복의 비대칭: 이야기를 「버스를 타고 갔다가 걸어서 돌아옴」으로 바꿔 그리고 채점받으세요. 가는 구간과 오는 구간의 기울기 크기 비가 무엇을 뜻하나요? 내 하루를 그래프로 그려 짝에게 읽혀 보는 과제까지.",
   "re": "버스\\)은 가파르고",
   "do": "① 이야기 전환 + 다시 그리기 ② 가파른 상승·완만한 하강으로 작도 ③ 채점",
   "hand": "버스 500m/분 vs 도보 250m/분이라면 두 기울기 비를 계산"
  }
 ],
 "45": [
  {
   "t": "1분 자유 탐색 — 막대들을 끌어 보세요. √2·√3·√5 의 길이 관계가 눈에 보이나요?"
  },
  {
   "t": "√2+√3 은 √5 와 같을까요? 예상을 메모하고, 막대를 이어붙여 판정하세요.",
   "re": "한눈에 다릅니다",
   "do": "① √3 막대를 √2 오른쪽 끝에 끌어 붙이기 ② √5 막대와 길이 비교 ③ 화면의 제곱 전개 확인",
   "hand": "(√2+√3)² 을 종이에서 전개해 5 와 비교 — 남는 항은?"
  },
  {
   "t": "√8 의 정체 — 「√8 vs 2√2 대결」 버튼으로 두 막대를 겹쳐 보세요. 이번엔 왜 같은가요?",
   "re": "완전히 겹칩니다",
   "do": "① 대결 버튼 ② 두 막대 길이 비교 ③ √8 을 √4×√2 로 쪼개는 과정 확인",
   "hand": "√8 = √(4×2) = 2√2 를 √a×√b = √(ab) 규칙으로 종이 유도"
  },
  {
   "t": "(√a, √b, 이어붙인 길이, √(a+b)) 표 — 덧셈과 곱셈 중 근호를 통과하는 쪽을 가려내세요."
  },
  {
   "t": "심화 — 재판관: √12 와 3√2, 2√3 중 같은 짝은 누구인가요? 제곱과 소인수분해 두 방법으로 판정하고, √a+√b ≠ √(a+b) 를 (√a+√b)² 전개 한 줄로 증명하세요."
  }
 ],
 "46": [
  {
   "t": "자유 탐색 — 직각변 1 을 붙이면 빗변은 얼마가 되나요? 첫 삼각형을 만들어 보세요.",
   "re": "√2 ≈ 1\\.414"
  },
  {
   "t": "나선을 키우면 √ 들이 차례로 나올까요? 다섯 번째 제곱근까지 가 보세요.",
   "re": "√5 ≈ 2\\.236",
   "do": "① 직각변 1 붙이기를 4회 ② 빗변 값 추적",
   "hand": "1²+1²=2, (√2)²+1²=3 계단을 종이에 이어 쓰기"
  },
  {
   "t": "√2·√3·√5 의 「정확한 자리」를 수직선에 눕혀 보세요 — 반올림과 무엇이 다른가요?",
   "re": "√2 · √3[^\\n]*√5",
   "do": "① √2·√3·√5 눕히기 ② 자리 확인",
   "hand": "컴퍼스 자리가 1.414보다 정확한 이유 쓰기"
  },
  {
   "t": "(n, 빗변, 자연수 여부) 표 — √4·√9 는 어디에 앉나요? 왜?"
  },
  {
   "t": "적용 — √10 까지 키워 3 에서 얼마나 떨어졌는지 확인하고 이유를 쓰세요.",
   "re": "√10 ≈ 3\\.162"
  }
 ],
 "47": [
  {
   "t": "자유 탐색 — b 손잡이를 끌어 보세요. 조각은 어디로 이사 가나요? (b 를 2 이상으로)",
   "re": "10000 − (4|9|16|25|36|49|64|81)"
  },
  {
   "t": "99×101 을 3초에 — 어떻게 가능할까요? 도전 1을 통과하며 비밀을 찾으세요.",
   "re": "도전 2/3",
   "do": "① b를 끌어 조각 이동 관찰 ② 도전 1 통과",
   "hand": "(100−1)(100+1)=100²−1² 을 종이에 쓰고 확인"
  },
  {
   "t": "비밀을 손에 넣었다면 — 남은 두 문제로 3연속 암산에 도전하세요.",
   "re": "암산 3연승",
   "do": "① 남은 두 문제 연속 도전",
   "hand": "97×103 을 같은 틀로 종이 암산"
  },
  {
   "t": "(b, 곱, 10000−곱) 표 — 빠지는 양의 정체는 무엇인가요?"
  },
  {
   "t": "전이 — 25×35 를 같은 기술로 암산하고 과정을 쓰세요."
  }
 ],
 "48": [
  {
   "t": "자유 탐색 — 「새 포물선」을 받고 그래프를 훑어보세요. 근은 어디쯤일까요?"
  },
  {
   "t": "눈으로 찍은 근이 진짜일까요? 두 마커를 올려 명중시키세요.",
   "re": "둘 다 명중",
   "do": "① 마커를 눈대중 자리에 ② 명중 판정 확인",
   "hand": "x²−2x−3 을 인수분해해 근을 종이에서 확정"
  },
  {
   "t": "공식은 내 눈보다 정확할까요? 검산으로 비교하세요.",
   "re": "/ 2 = ",
   "do": "① 검산 버튼으로 공식값 확인 ② 내 값과 비교",
   "hand": "근의 공식에 a,b,c 를 넣어 종이 계산"
  },
  {
   "t": "(근1, 근2, 합, 곱) 표 3줄 — 계수와의 숨은 규칙을 찾아 쓰세요."
  },
  {
   "t": "내 답 — x²−6x+2=0 의 두 근의 합을 풀지 않고 말하고, 근거를 쓰세요."
  }
 ],
 "49": [
  {
   "t": "자유 탐색 — 수평선을 위아래로 끌어 보세요. 교점 개수가 어떻게 변하나요? 먼저 D 를 16 위로.",
   "re": "4k = (1[6-9]|2[0-2])\\."
  },
  {
   "t": "포물선을 스치는 순간을 잡을 수 있나요? 천천히 내려 자석을 느껴 보세요.",
   "re": "중근",
   "do": "① 선을 위로 끌어 D 값 16 이상 만들기 ② 교점 수 기록",
   "hand": "k=3 일 때 D=4+4k 를 종이 계산해 화면과 대조"
  },
  {
   "t": "교점이 사라지는 영역에선 D 가 어떻게 되나요? 확인하세요.",
   "re": "실근 없음",
   "do": "① 자석 접점 잡기 ② 그때 k와 D 기록",
   "hand": "D=0 의 뜻을 ±√D 로 설명"
  },
  {
   "t": "(k, D, 부호, 교점 수) 표 — 풀기 전에 개수를 아는 방법을 네 말로."
  },
  {
   "t": "내 문제 — x²+4x+k=0 의 해가 하나뿐이려면 k 는? 화면 원리로 설명하세요."
  }
 ],
 "50": [
  {
   "t": "자유 탐색 — 처음 화면의 타일들을 보세요. 왜 정사각형이 못 되고 있나요?"
  },
  {
   "t": "x 막대를 반씩 접으면 무엇이 남을까요? 배치해 보세요.",
   "re": "구멍이 남았습니다",
   "do": "① 막대 반 접어 배치 ② 남는 자리 확인",
   "hand": "(6/2)² 을 계산해 구멍 크기 예측 후 대조"
  },
  {
   "t": "남은 자리를 채우면 무슨 일이? 완전한 정사각형을 만들어 보세요.",
   "re": "정사각형 완성",
   "do": "① 구멍 채워 완성 ② 우변 7의 변화 추적",
   "hand": "(x+3)²=16 에서 x 를 종이로 마무리"
  },
  {
   "t": "b 를 4 로 바꿔도 같은 이야기가 반복되나요? 다시 완주해 규칙을 확정하세요.",
   "re": "\\(x \\+ 2\\)²"
  },
  {
   "t": "대장정 — x²+bx+c=0 을 문자 그대로 접어 근의 공식까지 유도해 쓰세요."
  }
 ],
 "51": [
  {
   "t": "자유 탐색 — 꼭짓점을 끌어 보세요. 식의 어디가 따라 움직이나요?"
  },
  {
   "t": "목표 자리(초록 점선)로 포물선을 배달해 보세요 — 괄호 안 부호가 예상대로인가요?",
   "re": "배달 완료",
   "do": "① 꼭짓점 끌어 목표 명중 ② 식의 변화 기록",
   "hand": "y=(x−3)²+2 에 x=3 을 넣어 꼭짓점 확인"
  },
  {
   "t": "왼쪽 목표(괄호가 x+…)도 배달해 보세요 — 부호의 함정을 통과하세요.",
   "re": "꼭짓점 \\(-\\d",
   "do": "① 왼쪽 목표(x+2 꼴) 배달",
   "hand": "「−p 인데 오른쪽」을 x−3=0 으로 설명"
  },
  {
   "t": "(목표식, p, q, 방향) 표 — 「−p 인데 오른쪽」의 정체를 네 말로."
  },
  {
   "t": "내 검산 — y=x²−6x+11 의 꼭짓점을 손으로 구해 배달로 검증하세요."
  }
 ],
 "52": [
  {
   "t": "자유 탐색 — 모서리를 끌어 보세요. 울타리와 그래프 점이 어떻게 붙어 다니나요?"
  },
  {
   "t": "가장 넓은 울타리는 어떤 모양일까요? 예상하고 봉우리를 찾으세요.",
   "re": "최대 발견",
   "do": "① 모서리 끌며 넓이 추적 ② 봉우리 좌표 기록",
   "hand": "w=3,5,7 일 때 w(10−w) 를 종이 계산"
  },
  {
   "t": "w = 4.9 와 5.1 — 넓이가 같을까요? 예상 후 확인하세요.",
   "re": "24\\.99",
   "do": "① 4.9와 5.1 넓이 비교",
   "hand": "S=−(w−5)²+25 로 봉우리를 증명"
  },
  {
   "t": "(w, 넓이) 표 8줄 — 두 변이 같아질 때 무슨 일이? 왜?"
  },
  {
   "t": "반전 — 한 면이 벽이면 정답이 달라질까요? S = w(20−2w) 로 판정하세요."
  }
 ],
 "53": [
  {
   "t": "자유 탐색 — a 손잡이를 끌어 보세요. 네 조각은 각각 무엇을 대표하나요?"
  },
  {
   "t": "a 와 b 가 똑같아지면 조각들은 어떻게 될까요? 만들어 보세요.",
   "re": "네 조각이 같아",
   "do": "① a=b=5 로 맞추기 ② 네 조각 넓이 비교",
   "hand": "(5+5)² 과 5²+5²+5²+5² 을 종이에서 비교"
  },
  {
   "t": "(a−b)² 모드 — 두 번 빼면 왜 사고가 나고, 무엇으로 수습하나요? ①→②→③ 완주.",
   "re": "2ab \\+ b² 완성",
   "do": "① 차의 제곱 모드 ①→②→③ 완주 ② 겹침 조각 확인",
   "hand": "9²−2·9·3+3² 을 종이 계산해 (9−3)² 과 대조"
  },
  {
   "t": "(a², 2ab, b²) 표 — 2ab 의 「2」는 어디서 왔나요? 네 말로."
  },
  {
   "t": "전이 — 21² 과 19² 을 조각 그림으로 암산하고 과정을 쓰세요."
  }
 ],
 "54": [
  {
   "t": "자유 탐색 — 사분원의 점을 끌어 보세요. sin·cos 는 각각 무엇에 반응하나요?"
  },
  {
   "t": "30° 에서 값이 유난히 깔끔한 이유가 있을까요? 자석에 붙여 근거 그림까지 확인하세요.",
   "re": "sin 30° = 1/2",
   "do": "① 점을 30° 자석에 ② 분수값과 근거 그림 확인",
   "hand": "한 변 2 정삼각형 반쪽의 세 변(1, √3, 2)을 종이에 그려 sin30° 확인"
  },
  {
   "t": "45° 에선 왜 두 값이 같아질까요? 예상하고 확인하세요.",
   "re": "tan 45° = 1",
   "do": "① 45° 자석 ② 근거: 정사각형 반쪽 열기",
   "hand": "1:1:√2 에서 tan45° 를 종이로 확인"
  },
  {
   "t": "60° 의 값들은 30° 와 어떤 짝을 이루나요? 발견을 기록하세요.",
   "re": "cos 60° = 1/2"
  },
  {
   "t": "내 검증 — 세 특수각에서 sin²θ+cos²θ 를 계산해 보세요. 늘 같은 값이라면 왜?"
  }
 ],
 "55": [
  {
   "t": "자유 탐색 — 각을 바꿔 보세요. sin 은 어떻게 자라나요? 자라는 속도도 일정한가요?"
  },
  {
   "t": "나만의 삼각비 표를 만들어 보세요 — 서로 다른 각 5개 이상.",
   "re": "표 항목 [5-9]개|표 항목 1\\d개",
   "do": "① 5° 간격으로 5개 이상 기록 버튼 ② 표 완성",
   "hand": "내 표의 35°·40° 값 차이를 종이에서 계산"
  },
  {
   "t": "표에 없는 sin 37° 를 표만으로 알아낼 수 있을까요? 추정해 판정을 통과하세요.",
   "re": "보간 성공",
   "do": "① 보간 도전 열기 ② 추정값 입력·판정",
   "hand": "0.5736 + (2/5)×(0.6428−0.5736) 보간 계산을 종이로"
  },
  {
   "t": "이웃 칸의 차 — 각이 커질수록 어떻게 되나요? 이유를 사분원에서 찾으세요."
  },
  {
   "t": "전이 — 내 표만으로 cos 53° 를 알아내는 방법을 설계하고 값을 구하세요."
  }
 ],
 "56": [
  {
   "t": "자유 탐색 — P 를 원 위에서 끌어 보세요. 각은 변하나요, 안 변하나요?"
  },
  {
   "t": "정말 어디서나 같은지 — 서로 다른 세 곳에서 확정해 보세요.",
   "re": "어디서나 같습니다",
   "do": "① P를 세 곳 이상 옮기며 각 기록 ② 값 비교",
   "hand": "세 위치의 각을 표로 적고 결론 한 줄"
  },
  {
   "t": "A·B 를 지름으로 벌리면 원주각은 몇 도가 될까요? 예상 후 확인.",
   "re": "탈레스",
   "do": "① A·B를 지름으로 ② 원주각 값 확인",
   "hand": "중심각 180°의 절반 계산으로 검증"
  },
  {
   "t": "(중심각, 원주각) 표 — 나눗셈 열의 규칙을 찾아 네 말로."
  },
  {
   "t": "내 설명 — 골대가 같은 각으로 보이는 자리들이 왜 원인지 이 실험으로 설명하세요."
  }
 ],
 "57": [
  {
   "t": "자유 탐색 — 위성을 끌어 보세요. 두 접선과 붉은 호는 어떻게 반응하나요?"
  },
  {
   "t": "위성이 아무리 높아도 못 보는 영역이 있을까요? 가시 범위를 140° 위로 밀어 보세요.",
   "re": "가시 범위 1[4-7]\\d°",
   "do": "① P를 멀리 끌며 가시 범위 추적 ② 140° 돌파 시도",
   "hand": "OP=2r 일 때 cos값으로 가시 반각을 종이 계산"
  },
  {
   "t": "접선 길이에 공식이 숨어 있을까요? 검산 버튼으로 확인하세요.",
   "re": "PA² 일치",
   "do": "① 검산 버튼으로 PA²=OP²−r² 확인",
   "hand": "직각삼각형 OPA 를 그려 공식 유도"
  },
  {
   "t": "(OP, PA, 가시 범위) 표 — 왜 180° 를 못 넘는지 네 말로."
  },
  {
   "t": "내 논증 — 접선이 반지름과 직각인 이유를 「스치기만 한다」로 쓰세요."
  }
 ],
 "58": [
  {
   "t": "자유 탐색 — 꼭짓점들을 원 위에서 끌어 보세요. 두 대각합에 무슨 일이?"
  },
  {
   "t": "모양을 아무리 바꿔도 유지되는 값이 있나요? 세 모양에서 확정하세요.",
   "re": "내접 사각형의 약속",
   "do": "① 꼭짓점 셋을 끌어 세 모양에서 대각합 기록",
   "hand": "세 모양의 (∠A+∠C) 값을 표로"
  },
  {
   "t": "D 를 원에서 떼면 그 약속은 어떻게 되나요? 예상 후 시험.",
   "re": "무너집니다",
   "do": "① D를 원 밖·안으로 ② 합의 변화 방향 기록",
   "hand": "판정 시험 절차를 3줄 매뉴얼로"
  },
  {
   "t": "(원 위/안/밖, 대각합) 표 — 조건과 결론의 관계를 네 말로."
  },
  {
   "t": "전이 — 네 점이 한 원 위에 있는지 판정하는 시험지를 설계하세요."
  }
 ],
 "59": [
  {
   "t": "자유 탐색 — 점 하나를 끌어 보세요. 상자의 어디가 움직이나요?"
  },
  {
   "t": "점을 아주 멀리 보내면 상자그림은 어떻게 반응할까요? 한계를 넘겨 보세요.",
   "re": "수염 밖 이상치",
   "do": "① 한 점을 55까지 끌기 ② 분리되는 순간 값 기록",
   "hand": "Q1·Q3로 1.5×IQR 한계를 종이 계산"
  },
  {
   "t": "다시 데려오면 언제 용서받나요? 경계를 정확히 찾으세요.",
   "re": "다시 모두 수염 안",
   "do": "① 되돌리며 경계 확인 ② 평균·중앙값 추적",
   "hand": "평균과 중앙값 중 강건한 쪽과 이유 쓰기"
  },
  {
   "t": "(값, 평균, 중앙값) 표 — 누가 끌려가고 누가 버티나요? 왜?"
  },
  {
   "t": "평가 — 1.5×IQR 규칙의 장점과 한계를 하나씩 논하세요."
  }
 ],
 "60": [
  {
   "t": "자유 탐색 — 산점도를 읽어 보세요. r 은 이 자료의 무엇을 요약하나요?"
  },
  {
   "t": "점 하나로 r 을 무너뜨릴 수 있을까요? 가장 파괴적인 자리를 찾으세요.",
   "re": "무너뜨렸",
   "do": "① 구석에 이상치 클릭 ② r 낙폭 기록",
   "hand": "추가 전후 r 를 표로 적고 낙폭 계산"
  },
  {
   "t": "제외하면 원래대로 돌아올까요? 토글로 시험하세요.",
   "re": "회복",
   "do": "① 제외 토글 켜기 ② r 값 변화 확인",
   "hand": "빼도 되는 경우/안 되는 경우 한 쌍 쓰기"
  },
  {
   "t": "(이상치 위치, r) 표 — 어느 구석이 왜 센가요? 평균과 이어 쓰세요."
  },
  {
   "t": "윤리 문제 — 지워도 되는 점과 안 되는 점의 예를 하나씩 만들고 기준을 쓰세요."
  }
 ],
 "61": [
  {
   "t": "자유 탐색 — 「다음 소수로 거르기」를 한 번 눌러 보세요. 어떤 수들이 한꺼번에 지워지나요?"
  },
  {
   "t": "예언하며 거르기 — 3으로 거를 때 「새로」 지워지는 수를 먼저 예상해 보세요. 6의 배수는 이미 없습니다! 몇 개가 새로 지워질까요?",
   "re": "3 의 배수를 지웠습니다",
   "do": "① 2로 거른 뒤 ② 3의 배수 중 살아남은 것들을 예상 ③ 눌러서 개수 대조",
   "hand": "3의 배수 중 2의 배수가 아닌 것(9, 15, 21, …)을 종이에 나열해 개수 맞히기"
  },
  {
   "t": "끝의 발견 — 계속 거르다 보면 「새로 지워지는 수」가 0이 되는 소수가 나타납니다. 어느 소수부터인가요? 왜 그런가요?",
   "re": "새로 지워지지 않습니다",
   "do": "① 5, 7 로 계속 거르기 ② 새로 지운 개수 추적 ③ 0이 되는 소수 확정",
   "hand": "11² = 121 > 120 — 이 부등식이 왜 「끝」의 증거인지 설명"
  },
  {
   "t": "(거른 소수 p, p², 새로 지운 수) 표 — p² 부터 지워도 되는 이유를 쓰세요."
  },
  {
   "t": "심화 — 97 판정과 일반화: 97이 끝까지 살아남는 과정을 확인하고, √97 ≈ 9.8 까지의 소수만 확인해도 판정이 끝나는 이유를 정리하세요. 1000까지의 체라면 어느 소수까지 거르면 되는지도 계산하세요."
  }
 ],
 "62": [
  {
   "t": "자유 탐색 — 예측 점을 위아래로 끌어 보세요. 빨간 오차 표시는 무엇을 재고 있나요?"
  },
  {
   "t": "무결점 도전 — 다섯 점을 실제 기온에 정확히 맞춰 보세요. 오차가 전부 0이면 두 채점 값은 각각 얼마인가요?",
   "re": "완벽한 예보",
   "do": "① 각 날의 파란 막대 끝에 점 맞추기 ② 오차 표시가 전부 0이 되게 ③ 두 합 확인",
   "hand": "완벽할 때 부호 합과 |오차| 합이 왜 같은 값(0)인지 한 줄"
  },
  {
   "t": "채점의 구멍 — 부호 합은 0인데 예측은 엉망인 예보를 만들 수 있나요? 만들어 보세요.",
   "re": "부호 합은 0 인데",
   "do": "① +2, −2 처럼 상쇄되는 오차 배치 설계 ② 부호 합 0 확인 ③ |오차| 합 확인",
   "hand": "내 배치의 두 합을 종이로 계산해 화면과 대조"
  },
  {
   "t": "(배치, 부호 합, |오차| 합) 표 3행 — 실력을 제대로 재는 채점을 판정하세요."
  },
  {
   "t": "심화 — 채점 설계사: 상쇄 착시를 막는 채점법(|오차|의 평균)을 제안하고, 절댓값이 「방향을 지운 거리」라는 뜻임을 수직선 그림으로 설명하세요. 실제 기상 예보 평가(MAE)와 이어 보세요."
  }
 ],
 "63": [
  {
   "t": "자유 탐색 — 숫자 카드를 하나 넣어 보세요. 자판기는 카드로 무엇을 하나요?"
  },
  {
   "t": "기록 쌓기 — 같은 식에 카드 서너 장을 차례로 넣어 기록을 만드세요. a 가 커질 때 값은 얼마씩 뛰나요?",
   "re": "기록: a=",
   "do": "① 식 하나 고정 ② 카드 1·2·3·4 차례로 ③ 값의 증가폭 관찰",
   "hand": "2a+3 에서 a가 1 커질 때 값이 늘 2씩 커지는 이유를 식에서 설명"
  },
  {
   "t": "함정 판정 — 2a 에 a=7 을 넣으면 27? 14? 9? 먼저 답을 정하고 판정 버튼을 누르세요.",
   "re": "2 × a = 14",
   "do": "① 내 답 선택 ② 판정 읽기 ③ 오답 두 개가 각각 무엇을 잘못 읽었는지 확인",
   "hand": "생략된 곱셈 기호를 되살려 2a = 2 × a 를 쓰고 27의 정체(자리 잇기)를 지적"
  },
  {
   "t": "(식, a, 값, a+1일 때 값) 표 — 일정하게 크는 식과 점점 빨리 크는 식을 가르세요."
  },
  {
   "t": "심화 — 나눠 먹기의 함정: 24÷a 에 7 을 넣어 보세요. 정수가 아닌 값이 나오는 뜻을 해석하고, a=1~5 에서 a² 과 2a 의 역전이 언제 일어나는지 표로 판정하세요.",
   "re": "= 3\\.42857",
   "do": "① 24÷a 식 선택 ② 카드 7 투입 ③ 값의 뜻 해석",
   "hand": "24÷7 을 분수와 소수 두 표기로 쓰고 어느 쪽이 정확한지 판단"
  }
 ],
 "64": [
  {
   "t": "자유 탐색 — 물·소금 버튼을 눌러 보세요. 농도 게이지는 각각 어느 쪽으로 움직이나요?"
  },
  {
   "t": "분자의 실험 — 소금 +10g 을 눌러 보세요. 농도식의 분자·분모가 어떻게 변하나요? 물을 부을 때와 비교하세요.",
   "re": "농도 = 30 ÷",
   "do": "① 소금 +10g ② 식의 분자·분모 변화 확인 ③ 물 +100g 과 대조",
   "hand": "소금 추가와 물 추가의 농도식을 나란히 쓰고 「변하지 않는 것」에 동그라미"
  },
  {
   "t": "빨간 금에 도달하라 — 정확히 5%를 만드는 조작 순서를 스스로 설계해 실행하세요.",
   "re": "목표 5% 명중",
   "do": "① 필요한 물의 양을 화면 안내로 예측 ② 조작 실행 ③ 명중 확인",
   "hand": "30/(30+x) = 5/100 을 종이에서 풀어 내 조작량과 대조"
  },
  {
   "t": "(소금, 물, 농도) 표 — 조작마다 기록하고 방정식의 해와 대조하세요."
  },
  {
   "t": "심화 — 극한 실험: 물을 전부 증발시키면 농도는 몇 %가 되나요? 그 값의 뜻을 해석하고, 「증발만으로 5%를 만들 수 있는가」를 식으로 판정하세요.",
   "re": "= 100\\.00%",
   "do": "① 증발 버튼 연타 ② 물 0g 도달 ③ 농도 값 해석",
   "hand": "증발 시 farming식 s/(s+w)에서 w→0 이면 왜 100%가 되는지 설명"
  }
 ],
 "65": [
  {
   "t": "자유 탐색 — A·B·컴퍼스·점 P 를 끌어 보세요. 빨간 선은 무엇으로 만들어지나요?"
  },
  {
   "t": "실패 실험 — 컴퍼스 반지름을 줄여 두 호가 만나지 않게 해 보세요. 경계는 어디인가요?",
   "re": "만나지 않습니다",
   "do": "① r 을 천천히 줄이기 ② 선이 사라지는 경계값 기록 ③ AB/2 와 비교",
   "hand": "경계가 AB/2 인 이유를 두 원의 위치 관계로 설명"
  },
  {
   "t": "기준 늘리기 — A·B 를 끌어 AB 를 200 이상으로 벌려 보세요. 선을 살리려면 r 도 함께 벌려야 하나요? P 를 끌어 PA = PB 가 여전한지 확인하세요.",
   "re": "AB = 2\\d\\d",
   "do": "① B 를 오른쪽으로 끌어 AB ≥ 200 ② r 을 AB/2 이상으로 ③ P 세 곳에서 PA·PB 대조",
   "hand": "AB 가 커지면 경계 반지름(AB/2)이 어떻게 변하는지 표로"
  },
  {
   "t": "(AB, r, 호가 만나나, PA, PB) 표 — 수직이등분선의 정의를 한 문장으로."
  },
  {
   "t": "심화 — 우물 문제: 세 마을에서 같은 거리인 우물 자리(외심)를 이 작도 두 번으로 찾는 절차를 설계하고, A·B 를 끌어 옮겨도 성질이 유지되는지 확인하세요."
  }
 ],
 "66": [
  {
   "t": "자유 탐색 — 각·컴퍼스 손잡이를 끌어 보세요. 빨간 선은 각을 어떻게 가르고 있나요?"
  },
  {
   "t": "실패 실험 — 파란 컴퍼스(r₂)를 줄여 작도를 무너뜨려 보세요. 언제 이등분선이 사라지나요?",
   "re": "호가 만나지 않습니다",
   "do": "① r₂ 를 천천히 줄이기 ② 사라지는 경계 기록 ③ 다시 벌려 복구",
   "hand": "경계가 두 교점 사이 거리의 절반인 이유 설명"
  },
  {
   "t": "반지름 무관의 발견 — r₁ 을 120 이상으로 벌려 보세요. 이등분선의 각은 변하나요? r₂ 도 바꿔 확인하세요.",
   "re": "r₁ = 1[2-4]\\d",
   "do": "① r₁ 을 크게 ② 이등분 각 유지 확인 ③ 각 자체를 바꿔도 절반 유지 확인",
   "hand": "r₁·r₂ 가 결과에 안 남는 이유를 SSS 합동의 세 변에서 찾기"
  },
  {
   "t": "(각, r₁, r₂, 이등분선 각, 절반값) 표 — 무엇이 불변인지 쓰세요."
  },
  {
   "t": "심화 — 각도기 없는 세계: 90°에서 시작해 45°, 22.5° 를 만드는 절차를 설계하고, 이 작도가 정확히 절반을 만드는 이유를 숨은 두 삼각형의 SSS 합동으로 증명하세요."
  }
 ],
 "67": [
  {
   "t": "자유 탐색 — 중심각·반지름을 끌고 조각을 잘라 보세요. 오른쪽 도형은 무엇을 닮아 가나요?"
  },
  {
   "t": "무한히 잘게 — 조각을 32조각 이상으로 잘라 오른쪽을 반듯하게 만들어 보세요. 가로와 세로는 각각 무엇이 되나요?",
   "re": "거의 직사각형",
   "do": "① 더 잘게 ×2 를 반복 ② 모양의 변화 관찰 ③ 가로·세로에 이름 붙이기",
   "hand": "가로가 호 전체가 아니라 l/2 인 이유를 위·아래 조각 배치로 설명"
  },
  {
   "t": "원에 도전 — 중심각을 최대(330°)까지 벌려 보세요. ½rl 과 πr²×각/360 은 여전히 같은가요? 360°가 되면 무엇이 될까요?",
   "re": "중심각 330°",
   "do": "① 각을 최대로 ② 두 넓이 값 대조 ③ 360°일 때의 식 상상",
   "hand": "θ=360°를 ½rl 에 넣어 πr² 이 나오는 과정을 종이 유도"
  },
  {
   "t": "(중심각, r, 호 l, ½rl, 공식값) 표 — 새 공식이 언제나 옳은지 판정하세요."
  },
  {
   "t": "심화 — 피자 가게 사장: 반지름 6·호 5 조각의 넓이를 ½rl 로 구하고, 같은 방법(잘라 붙이기)으로 원의 넓이 πr² 을 유도하는 그림 증명을 종이에 완성하세요."
  }
 ],
 "68": [
  {
   "t": "자유 탐색 — 정삼각형을 서너 장 모아 보세요. 게이지의 각의 합이 무엇을 결정하나요?"
  },
  {
   "t": "한계 도전 — 정삼각형을 5장까지 모아 보세요. 합이 300°일 때 완성되는 입체는 무엇인가요?",
   "re": "정이십면체",
   "do": "① 3장(180°)에서 완성 이름 확인 ② 4장(240°) ③ 5장(300°)까지",
   "hand": "60°×3, ×4, ×5 를 계산하고 각각 어떤 입체인지 표로"
  },
  {
   "t": "여섯 장째의 비극 — 한 장 더 모으면 무슨 일이 벌어지나요? 왜 입체가 못 되나요?",
   "re": "평평해져",
   "do": "① 6장째 붙이기 ② 게이지 색 변화 관찰 ③ 바닥 타일과의 관계 생각",
   "hand": "60°×6 = 360° — 오므라들 여유가 0이 되는 이유를 종이접기로 설명"
  },
  {
   "t": "(다각형, 장수, 각의 합, 입체 여부) 표 — 되는 조합 5가지를 전부 찾으세요."
  },
  {
   "t": "심화 — 108°의 기적: 정오각형 3장으로 완성되는 정다면체를 만들고, 4장은 왜 불가능한지 계산으로 판정하세요. 「정다면체는 5개뿐」의 증명을 부등식 (장수 × 한 내각 < 360°, 장수 ≥ 3) 으로 정리하세요.",
   "re": "정십이면체",
   "do": "① 정오각형 선택 ② 3장 모으기 ③ 108×4 = 432 확인",
   "hand": "네 다각형 × 장수 조합 전체를 부등식으로 훑어 5가지뿐임을 손으로 확정"
  }
 ],
 "69": [
  {
   "t": "자유 탐색 — 간식을 담아 보세요. 게이지는 무엇을 감시하나요?"
  },
  {
   "t": "예산을 넘기 직전의 최대 개수는? 예상하고 정확히 담으세요.",
   "do": "① 개수를 늘리며 게이지 추적 ② 최대 개수 명중",
   "hand": "800x ≤ 5000 을 종이에서 풀어 확인"
  },
  {
   "t": "경계에서 무슨 일이 벌어지나요? 하나 더 담아 보세요.",
   "re": "최대입니다",
   "do": "① −2 곱하기 버튼 실험",
   "hand": "뒤집기 전후 해집합을 수직선 두 개로"
  },
  {
   "t": "−2 를 곱하는 순간 부등호는? 예상 후 조작으로 판정하세요.",
   "re": "부등호도 뒤집습니다"
  },
  {
   "t": "내 문제 — 1500원 펜·800원 지우개로 1만 원 부등식을 세워 풀어 보세요."
  }
 ],
 "70": [
  {
   "t": "자유 탐색 — 학번 카드를 두어 장 넣어 보세요. 사물함 배정의 규칙이 보이나요?"
  },
  {
   "t": "공평한 배정 — m=7 에서 학번 6개 이상을 배정해 보세요. 사물함이 골고루 쓰이나요?",
   "re": "배정 ([6-9]|1[0-2])명",
   "do": "① m=7 확인 ② 카드 6장 이상 배정 ③ 쓰인 사물함 수 확인",
   "hand": "20104 % 7 을 종이 나눗셈으로 계산해 화면 배정과 대조"
  },
  {
   "t": "몰림 사고 — m 을 8 로 바꿔 보세요. 같은 학번들인데 무슨 일이 벌어지나요? 원인은 학번들의 어떤 공통점인가요?",
   "re": "몰림 발생",
   "do": "① m=8 로 전환 ② 빈 칸과 몰린 칸 관찰 ③ 학번들이 모두 짝수임을 확인",
   "hand": "짝수 % 짝수가 왜 짝수인지 「학번 = m×몫 + 나머지」로 설명"
  },
  {
   "t": "(m, 쓰인 사물함, 충돌) 표 — 골고루 퍼지는 m 의 조건을 짐작하세요."
  },
  {
   "t": "심화 — 소수의 승리: m=11 로 12명 전원을 배정해 충돌을 세어 보세요. 해시 함수가 소수 나눗수를 쓰는 이유를 결론짓고, 충돌하는 두 학번의 조건(차가 m 의 배수)을 실험으로 확인하세요.",
   "re": "쓰인 사물함 \\d+ / 11",
   "do": "① m=11 전환 ② 남은 카드 전부 배정 ③ 충돌 칸의 두 학번 차 계산",
   "hand": "21040 − 20104 = 936 이 11의 배수인지 판정해 충돌 예측"
  }
 ],
 "71": [
  {
   "t": "자유 탐색 — 쉬운 분수부터 나눠 보세요. 소수는 언제 끝나고 언제 안 끝나나요?"
  },
  {
   "t": "끝나는 분수들의 분모엔 공통점이 있을까요? 2·5 뿐인 분모로 끝까지 가 보세요.",
   "re": "나머지 0 — 나눗셈이 끝났",
   "do": "① 1/8 을 끝까지 나누기 ② 나머지 추적",
   "hand": "1/8 나눗셈 세로셈을 종이로 세 자리까지"
  },
  {
   "t": "1/7 은 언제까지 돌까요? 순환이 확정되는 순간을 잡으세요.",
   "re": "순환 확정",
   "do": "① 1/7 을 같은 나머지가 다시 나올 때까지 ② 나머지 목록 기록",
   "hand": "나머지 후보가 6개뿐 → 반드시 재방문 논증"
  },
  {
   "t": "나머지의 목록을 관찰 — 순환이 「반드시」 오는 이유를 네 말로."
  },
  {
   "t": "예언 규칙 — 분모만 보고 유한·순환을 맞히는 규칙을 쓰고 두 분수로 시험하세요."
  }
 ],
 "72": [
  {
   "t": "자유 탐색 — 0.24̄ 가 기본으로 놓여 있습니다. ×10 버튼은 자릿수에 무슨 일을 하나요?"
  },
  {
   "t": "정렬 작전 — ×10 을 두 번 눌러 100x 를 만드세요. 소수점 아래가 원래 식과 겹쳐졌나요? 화면의 판정을 확인하세요.",
   "re": "×10 을 2번",
   "do": "① ×10 한 번 — 어긋남 확인 ② 한 번 더 — 겹침 확인 ③ 마디 길이와 횟수의 관계 메모",
   "hand": "0.242424… 와 24.2424… 의 소수점 아래를 나란히 써서 겹침을 눈으로 확인"
  },
  {
   "t": "무한 꼬리 소멸 — 「두 식 빼기」로 순환의 꼬리를 통째로 지우세요. x 는 어떤 분수로 복원되나요?",
   "re": "복원 완료",
   "do": "① 두 식 빼기 ② 분수와 검산값 확인 ③ 0.7̄ 카드로도 반복",
   "hand": "100x − x = 24 를 종이에서 풀어 24/99 = 8/33 확정"
  },
  {
   "t": "(순환소수, 마디 길이, ×10 횟수, 분수) 표 — 성공 조건의 규칙을 쓰세요. 일부러 덜 곱해 실패도 시켜 보세요."
  },
  {
   "t": "심화 — 혼순환의 관문: 0.83̄ 은 순환하지 않는 앞자리가 낍니다. 몇 번 곱해 무엇에서 무엇을 빼야 하나요? 복원에 성공하고, 0.9̄ = 1 논쟁도 같은 방법으로 판정하세요.",
   "re": "= 5/6",
   "do": "① 0.83 카드 선택 ② ×10 두 번 ③ 빼기 — 이번엔 100x − 10x 임을 확인",
   "hand": "(83 − 8) ÷ (100 − 10) 을 종이에서 약분해 화면과 대조"
  }
 ],
 "73": [
  {
   "t": "자유 탐색 — 두어 번 접어 보세요. 두께 표시가 어떤 방식으로 자라나요?"
  },
  {
   "t": "열 번의 기적 — 10번 접으면 두께가 몇 배가 될까요? 예상을 메모하고 접어서 확인하세요.",
   "re": "2\\^10 = 1,024",
   "do": "① 예상 배수 메모 ② 10번까지 접기 ③ 사다리에서 위치 확인",
   "hand": "2¹⁰ 을 2×2×… 로 종이에서 계산 (약 1000이 되는 이유)"
  },
  {
   "t": "달까지 몇 번? — 먼저 예상 횟수를 걸고, 접기를 계속해 달에 도달하는 횟수를 확정하세요.",
   "re": "달에 닿았습니다",
   "do": "① 예상 횟수 메모 ② 계속 접으며 사다리의 이정표 통과 관찰 ③ 도달 횟수 기록",
   "hand": "0.1mm × 2⁴² 을 어림해 38만 km 와 비교"
  },
  {
   "t": "(접은 횟수, 2ⁿ, 두께, 더하기였다면) 표 — 곱하기 성장과 더하기 성장의 차이를 쓰세요."
  },
  {
   "t": "심화 — 지수법칙의 몸: 2¹⁰ × 2⁵ = 2¹⁵ 을 「10번 접은 뒤 5번 더」로 설명하고, 실제 종이는 왜 7~8번밖에 못 접는지(가로 길이의 한계) 추론하세요."
  }
 ],
 "74": [
  {
   "t": "자유 탐색 — k 를 움직여 보세요. 두 수의 순서는 언제 안전한가요?"
  },
  {
   "t": "양수 배에서는 순서가 늘 유지될까요? 여러 값으로 확인하세요.",
   "do": "① k를 양수 구간에서 이동 ② 순서 유지 확인",
   "hand": "3<5 양변에 2, −2 를 곱해 종이 비교"
  },
  {
   "t": "k 가 음수로 넘어가는 순간 무슨 일이? 그 순간을 잡으세요.",
   "re": "순서가 뒤집혔습니다",
   "do": "① k를 음수로 넘겨 뒤집힘 포착 ② k=0 도 확인",
   "hand": "−3x<6 풀이를 수직선과 함께 완성"
  },
  {
   "t": "k = 0 은 어느 쪽인가요? 확인하고 세 구간을 정리하세요.",
   "re": "순서가 사라집니다"
  },
  {
   "t": "내 풀이 — −3x < 6 을 수직선 그림과 함께 풀어 쓰세요."
  }
 ],
 "75": [
  {
   "t": "자유 탐색 — 두 직선을 움직여 보세요. 교점은 어디까지 달아날 수 있나요?"
  },
  {
   "t": "교점을 화면 밖으로 쫓아내 보세요 — 완전히 없앨 수도 있을까요?",
   "do": "① 두 직선의 기울기·절편 조절 ② 교점 이동 관찰",
   "hand": "전단 식이 A식의 2배임을 종이에서 확인"
  },
  {
   "t": "해가 없는 상태를 만들어 보세요 — 식으로는 무엇이 남나요?",
   "re": "평행, 해가 없습니다",
   "do": "① 평행(해 없음)·겹침(무수히) 재현",
   "hand": "세 경우를 계수 비교 조건으로 정리"
  },
  {
   "t": "완전히 겹치면 해는 몇 개인가요? 만들어서 확인하세요.",
   "re": "무수히 많습니다"
  },
  {
   "t": "내 문제 — 해가 없는 연립방정식을 설계하고 그래프로 검증하세요."
  }
 ],
 "76": [
  {
   "t": "자유 탐색 — 버튼들을 눌러 보세요. 두 식은 무엇을 공유하는 한 쌍인가요?"
  },
  {
   "t": "x 를 지워라 — 계수를 맞춰 x 를 소거하고 y 값을 구하세요. 어떤 준비(×배수)가 필요했나요?",
   "re": "→ y = 2",
   "do": "① ①×3, ②×2 로 x 계수를 6으로 정렬 ② ①−② 실행 ③ 남은 식 읽기",
   "hand": "6x+9y=36 에서 6x−2y=14 를 빼는 계산을 종이로 재현"
  },
  {
   "t": "다른 길 — 처음 식으로 되돌리고, 이번엔 y 를 지워 x 를 구하세요. 답이 같은가요?",
   "re": "→ x = 3",
   "do": "① 처음 식으로 ② ②×3 으로 y 계수 정렬 ③ ①+② — 부호가 반대면 더하기",
   "hand": "y 소거 때 왜 빼기가 아니라 더하기인지 부호로 설명"
  },
  {
   "t": "두 길의 기록 표 — 소거할 문자와 배수를 고르는 요령(최소공배수)을 정리하세요."
  },
  {
   "t": "심화 — 소거법 설계사: 4x+3y=18, 3x−2y=5 를 종이에서 두 길로 풀고, 어느 길이 계산이 적은지 최소공배수(12 vs 6)로 판정하세요."
  }
 ],
 "77": [
  {
   "t": "자유 탐색 — 파란 점(절편)과 주황 점(기울기)을 끌어 보세요. 직선의 두 가지 운동을 구분할 수 있나요?"
  },
  {
   "t": "평행이동 실험 — 잔상을 켜고 절편만 끌어 b 를 4까지 올리세요. 직선은 어떤 운동을 하나요?",
   "re": "y절편 b = 4 —",
   "do": "① 잔상 켜기 ② 절편 손잡이만 위로 ③ 잔상 무늬 관찰",
   "hand": "절편을 바꾼 전후 두 식을 나란히 쓰고 달라진 항에 동그라미"
  },
  {
   "t": "회전 실험 — 이번엔 기울기만 끌어 a 를 −2까지 내리세요. 회전의 축(움직이지 않는 점)은 어디인가요?",
   "re": "기울기 a = -2 —",
   "do": "① 잔상 지우고 다시 켜기 ② 기울기 손잡이만 아래로 ③ 고정점 좌표 확인",
   "hand": "x=0 을 대입해 고정점이 (0, b) 인 이유를 계산으로"
  },
  {
   "t": "(무엇을 움직였나, 직선의 변화) 표 — 두 운동이 서로 침범하지 않는 이유를 쓰세요."
  },
  {
   "t": "심화 — 정밀 조종: 기울기 0.5, 절편 3 인 직선을 정확히 만들고, 분수 기울기의 계단(오른쪽 2에 위로 1)을 그림으로 설명하세요. a 가 0이 되는 순간 직선은 무엇이 되나요?",
   "re": "y = 0\\.5x \\+ 3",
   "do": "① 절편을 3으로 ② 기울기를 0.5로 ③ 계단 표시(1칸에 0.5) 확인",
   "hand": "(2, 4)가 이 직선 위에 있는지 대입으로 검산"
  }
 ],
 "78": [
  {
   "t": "자유 탐색 — 두 주황 점을 끌어 보세요. 직선은 두 점을 어떻게 따라오나요?"
  },
  {
   "t": "식 → 그래프 명중 — 문제의 식을 읽고 두 점을 끌어 그 직선을 정확히 만드세요.",
   "re": "정답!",
   "do": "① 절편 (0, b) 에 점 하나 ② 오른쪽 1·위로 a 간 곳에 점 하나 ③ 판정 확인",
   "hand": "내가 놓은 두 점이 식을 만족하는지 대입으로 검산"
  },
  {
   "t": "세로선의 함정 — 두 점을 일부러 같은 x 에 포개 보세요. 왜 y = ax + b 꼴이 불가능해지나요?",
   "re": "세로로 겹쳤습니다",
   "do": "① 두 점의 x 를 같게 ② 안내문 읽기 ③ 기울기 계산식에서 무엇이 무너지는지 확인",
   "hand": "기울기 = (y₂−y₁)/(x₂−x₁) 에서 분모 0 의 뜻을 쓰기"
  },
  {
   "t": "새 문제 연속 도전 — 세 문제를 더 풀며 (목표 식, 잡은 두 점) 표를 만드세요. 나만의 순서가 생겼나요?"
  },
  {
   "t": "심화 — 3초의 달인: y = −2x + 4 를 3초 안에 놓는 절차를 글로 쓰고 짝에게 시켜 보세요. 기울기가 분수(0.5)일 때 「오른쪽 2, 위로 1」이 왜 같은 말인지 설명하세요."
  }
 ],
 "79": [
  {
   "t": "자유 탐색 — 꼭짓점 셋을 끌어 삼각형을 바꿔 보세요. 균형점은 어디쯤일 것 같나요?"
  },
  {
   "t": "추측 먼저 — 주황 점을 균형점 후보 자리에 놓고 「중선 그려 확인」을 누르세요. 몇 px 벗어났나요?",
   "re": "무게중심에서",
   "do": "① 눈대중으로 후보 결정 ② 확인 버튼 ③ 초록 점(정답)과의 거리 기록",
   "hand": "세 꼭짓점 좌표의 평균을 종이로 계산해 초록 점과 비교"
  },
  {
   "t": "명중 도전 — 삼각형을 새로 바꾸고, 이번엔 12px 안까지 명중시키세요. 어떤 요령이 생겼나요?",
   "re": "명중!",
   "do": "① 꼭짓점을 끌어 새 삼각형 ② 추측 → 확인 반복 ③ 명중까지",
   "hand": "요령을 한 문장으로 (예: 두 중점을 어림해 잇는다)"
  },
  {
   "t": "(추측, 실제, 거리) 표 — 회를 거듭할수록 거리가 줄었나요? 2:1 눈금도 확인하세요."
  },
  {
   "t": "심화 — 균형의 증명: 무게중심이 중선을 2:1 로 나누는 것을 그림에서 재고, 좌표 평균 ((x₁+x₂+x₃)/3, …) 이 그 점이 되는 이유를 중점 좌표와 연결해 증명하세요. 종이 삼각형을 오려 실제로 손끝에 세워 보세요."
  }
 ],
 "80": [
  {
   "t": "자유 탐색 — 네 꼭짓점을 끌어 보세요. 다섯 판정 등은 따로 노나요, 함께 움직이나요?"
  },
  {
   "t": "조립 실험 — 꼭짓점을 끌어(또는 버튼으로) 다섯 판정 등을 모두 켜 보세요. 어떤 순간 다섯이 한꺼번에 켜지나요?",
   "re": "평행사변형입니다",
   "do": "① 두 대각선 중점(파랑·주황)이 겹치도록 조정 ② 다섯 등 동시 점등 관찰",
   "hand": "다섯 조건을 표로 쓰고 함께 켜진 순간의 좌표 기록"
  },
  {
   "t": "함정 재현 — 한 쌍만 평행한 사다리꼴을 만들어 보세요. 왜 평행사변형이라 부르면 안 되나요?",
   "re": "사다리꼴입니다",
   "do": "① 함정 버튼(또는 직접 조작) ② 판정 등 확인 ③ 나머지 네 판정의 상태 기록",
   "hand": "한 쌍 평행만으로 부족함을 반례 그림으로"
  },
  {
   "t": "(조작, 다섯 판정) 표 — 다섯 조건이 「같은 사실의 다섯 얼굴」인 이유를 쓰세요."
  },
  {
   "t": "심화 — 손끝 복원: 이번엔 버튼 없이 꼭짓점만 끌어, 두 대각선의 중점을 다시 겹치게 만들어 다섯 등을 켜 보세요. 그리고 「대각선이 서로를 이등분하면 평행사변형」을 SAS 합동으로 증명해 마무리하세요.",
   "re": "평행사변형입니다",
   "do": "① 사다리꼴 상태에서 시작 ② 파랑·주황 중점이 겹치도록 한 꼭짓점 조정 ③ 다섯 등 점등 확인",
   "hand": "대각선 교점에서 마주 보는 두 삼각형의 SAS 합동 증명 쓰기"
  }
 ],
 "81": [
  {
   "t": "자유 탐색 — 모서리 손잡이를 끌어 확대·축소해 보세요. 무엇이 함께 변하나요?"
  },
  {
   "t": "반으로 줄이기 — k 를 0.5 로 맞추세요. 넓이는 절반이 되나요, 4분의 1이 되나요?",
   "re": "k = 0\\.50",
   "do": "① k 를 0.5 로 ② 넓이 배율 읽기 ③ 예상과 대조",
   "hand": "0.5 × 0.5 를 계산해 넓이 배율의 정체 확인"
  },
  {
   "t": "두 배의 정체 — k 를 2 로 올리세요. 넓이 타일이 정확히 몇 장이 되나요?",
   "re": "×4\\.00",
   "do": "① k = 2 로 ② 타일 수 세기 ③ 길이 배율과 대조",
   "hand": "가로 2배 × 세로 2배 그림을 그려 4장의 이유 설명"
  },
  {
   "t": "(k, 둘레 배율, 넓이 배율) 표 — 넓이가 k² 인 이유를 두 방향의 곱으로 쓰세요."
  },
  {
   "t": "심화 — 지도 읽기의 함정: k 를 최대(2.9)로 올려 넓이 배율을 확인하고, 지도 1:25000 에서 1cm² 가 실제 몇 m² 인지 계산하세요. 부피라면 몇 제곱이 될지도 예상하세요.",
   "re": "×8\\.41",
   "do": "① k 최대로 ② 넓이 배율 확인 ③ 2.9² 손계산과 대조",
   "hand": "250m × 250m 를 계산해 1cm² 의 실제 넓이 확정"
  }
 ],
 "82": [
  {
   "t": "자유 탐색 — 중심 O(빨강)와 배율 손잡이(주황)를 끌어 보세요. 대응점을 잇는 선들은 어디를 지나나요?"
  },
  {
   "t": "최대 확대 — 배율을 끝(2.5)까지 끌어 보세요. OA′/OA 와 변의 비가 함께 움직이나요?",
   "re": "k = 2\\.50",
   "do": "① k 를 최대로 ② OA·OA′ 값 읽기 ③ 변의 비와 대조",
   "hand": "(OA′/OA) 와 (변의 비)가 같은 이유를 확대의 정의로"
  },
  {
   "t": "거꾸로 세계 — k 를 0 을 지나 음수까지 끌어 보세요. 상은 어디에 어떻게 생기나요?",
   "re": "반대편에 뒤집혀",
   "do": "① k 를 천천히 줄이며 0 근처 관찰 ② 음수로 진입 ③ 상의 위치·방향 기록",
   "hand": "바늘구멍 사진기의 상이 뒤집히는 이유를 이 화면으로 설명"
  },
  {
   "t": "(k, OA, OA′, 비율) 표 — 광선(연결선)이 모두 O 를 지나는 이유를 정의로 쓰세요."
  },
  {
   "t": "심화 — 프로젝터 설계: 스크린을 2배 멀리 두면 화면 크기와 밝기는 어떻게 되나요? O 를 광원으로 보고 (거리, 크기, 넓이) 표를 만들어 결론을 쓰세요."
  }
 ],
 "83": [
  {
   "t": "자유 탐색 — 가로·세로 손잡이를 끌어 보세요. 세 넓이 막대는 무엇을 말하고 있나요?"
  },
  {
   "t": "질러가기 계산 — 가로 5·세로 12 로 맞춰 보세요. 대각선이 얼마로 딱 떨어지나요?",
   "re": "= √169",
   "do": "① a=5, b=12 로 ② c 값 읽기 ③ 5²+12² 과 대조",
   "hand": "25 + 144 = 169 = 13² 을 종이에서 확인"
  },
  {
   "t": "3:4:5 패밀리 — 가로 12·세로 9 로 맞춰 보세요. 어떤 특별한 일이 벌어지나요?",
   "re": "피타고라스 수입니다",
   "do": "① a=12, b=9 로 ② 세 수의 비 확인 ③ 3:4:5 와의 관계 발견",
   "hand": "(12, 9, 15) ÷ 3 = (4, 3, 5) 를 확인하고 다른 배수 예측"
  },
  {
   "t": "(a, b, a²+b², c², a+b) 표 — 꺾어 가기(a+b)와 질러 가기(c)의 차이를 쓰세요."
  },
  {
   "t": "심화 — TV 매장의 수학: (8, 6)으로 또 다른 패밀리를 확인하고, 55인치 TV(16:9)의 가로·세로를 피타고라스로 역산하세요.",
   "re": "= √100",
   "do": "① a=8, b=6 으로 ② c=10 확인 ③ 16:9 에서 대각선 비(√337) 계산 설계",
   "hand": "16²+9² = 337, 55÷√337 × 16 을 어림해 가로 인치 구하기"
  }
 ],
 "84": [
  {
   "t": "자유 탐색 — 세 변을 바꿔 보세요. 판정은 무엇 무엇을 비교해 내려지나요?"
  },
  {
   "t": "재지 않고 직각을 만들 수 있나요? (6,8,10)으로 시험하세요.",
   "re": "직각삼각형",
   "do": "① (6,8,10) 제작 ② 판정 확인",
   "hand": "6²+8² 과 10² 을 종이 비교"
  },
  {
   "t": "c 만 줄이면 각은 어느 쪽으로 기우나요? 예상 후 확인.",
   "re": "예각삼각형",
   "do": "① c를 9→13으로 바꾸며 판정 추적",
   "hand": "세 판정(직각·예각·둔각) 기준을 부등식으로"
  },
  {
   "t": "c 를 늘리면? 경계가 정확히 어디인지 세 변으로 쓰세요.",
   "re": "둔각삼각형"
  },
  {
   "t": "내 판정 — (7, 24, 25) 는 직각인가요? 계산만으로 판결하세요."
  }
 ],
 "85": [
  {
   "t": "자유 탐색 — 격자 칸을 눌러 보세요. 어떤 (a, b)가 특별한가요?"
  },
  {
   "re": "찾은 피타고라스 수 [1-9]",
   "t": "세 변이 모두 자연수인 직각삼각형 — 하나 찾아낼 수 있나요?",
   "do": "① 격자에서 (4,3) 확인 ② 다른 후보 탐색",
   "hand": "5²=3²+4² 를 종이 확인 후 (5,12,?) 예측"
  },
  {
   "t": "배수 말고 「원시」 세 쌍 — 2개 이상 모아 보세요.",
   "re": "원시\\(서로소\\) [2-9]",
   "do": "① 원시 세 쌍 2개 이상 수집",
   "hand": "홀수 공식으로 n=7 세 쌍을 계산해 검증"
  },
  {
   "t": "홀수 공식으로 다음 세 쌍을 예언하고 시험하세요 — 맞았나요?"
  },
  {
   "t": "내 논증 — (3,4,5)의 배수들이 전부 통하는 이유를 닮음으로 쓰세요."
  }
 ],
 "86": [
  {
   "t": "자유 탐색 — 두 버튼을 눌러 보세요. 나무 그림과 나란한 목록, 무엇이 다른가요?"
  },
  {
   "t": "「또는」의 세계 — 하나만 주문하는 상황으로 바꿔 목록을 직접 세어 보세요. 몇 가지인가요?",
   "re": "3 \\+ 2 = 5가지",
   "do": "① 「또는」 버튼 ② 목록 나열해 세기 ③ 덧셈과 대조",
   "hand": "김밥 4종·음료 3종이라면 「또는」이 몇 가지인지 계산"
  },
  {
   "t": "다시 세트로 — 「그리고」로 돌아와 나무의 가지 끝을 직접 세어 보세요. 두 법칙을 모두 여행했다면 비교 준비 완료!",
   "re": "모두 확인했습니다",
   "do": "① 세트 버튼으로 복귀 ② 가지 끝 6개 세기 ③ 두 구조(나란히 vs 다시 뻗음) 비교",
   "hand": "김밥 4종·음료 3종 세트가 몇 가지인지 나무 스케치로 검산"
  },
  {
   "t": "두 구조의 그림 비교 표 — 「또는 = 합」, 「그리고 = 곱」의 이유를 구조로 쓰세요."
  },
  {
   "t": "심화 — 안 골라도 되는 음료: 「김밥을 고르고, 음료는 골라도 안 골라도 됨」은 몇 가지인가요? 두 법칙을 섞어 계산하고 나무로 검산하세요. 상의 4·하의 3·신발 2 코디 문제까지."
  }
 ],
 "87": [
  {
   "t": "자유 탐색 — 배율 손잡이를 끌어 보세요. 세 게이지는 각각 무엇을 재고 있나요?"
  },
  {
   "t": "기준점 — k 를 1 로 되돌려 세 게이지를 나란히 놓으세요. 셋이 같아지는 유일한 k 가 왜 1인가요?",
   "re": "부피 ×1\\.00",
   "do": "① k=1 로 ② 세 게이지 일치 확인 ③ k=2 로 올리며 벌어지는 속도 비교",
   "hand": "k, k², k³ 에 k=1 을 넣으면 모두 1이 되는 이유 한 줄"
  },
  {
   "t": "세제곱의 폭발 — k = 3 이면 부피는 몇 배가 될까요? 먼저 걸고 확인하세요.",
   "re": "×27\\.00",
   "do": "① 예상 메모 ② k=3 으로 ③ 겉넓이(9배)와 부피(27배)의 격차 확인",
   "hand": "3×3×3 을 세 방향의 곱으로 그려 27의 구조 확인"
  },
  {
   "t": "(k, 길이, 겉넓이, 부피) 표 — 각 열이 k 의 몇 제곱인지 확정하세요."
  },
  {
   "t": "심화 — 거인의 역설: 키 2배 거인의 몸무게(8배)와 다리 단면적(4배)을 비교해 「거인은 왜 실존할 수 없는가」를 논증하세요. 코끼리 다리가 굵은 이유, 개미가 자기 몸무게의 몇 배를 드는 이유까지."
  }
 ],
 "88": [
  {
   "t": "자유 탐색 — 표를 훑어보세요. 「적어도 하나」에 해당하는 칸은 몇 개나 될까요?"
  },
  {
   "t": "직접 골라 보세요 — 다 고르는 데 얼마나 걸리나요?",
   "re": "전부 골랐습니다",
   "do": "① 해당 칸 직접 고르기 ② 개수 확인",
   "hand": "고른 7칸을 종이에 나열"
  },
  {
   "t": "반대편(하나도 없음)에서 접근하면? 두 길의 수고를 비교하세요.",
   "re": "고를 것도",
   "do": "① 여사건 길로 재계산 ② 두 답 비교",
   "hand": "1−1/8 계산과 「반대편 1칸」 표시"
  },
  {
   "t": "동전 10개라면 — 직접 세기가 가능할까요? 여사건 식만 세워 보세요."
  },
  {
   "t": "내 계산 — 주사위 두 번, 적어도 한 번 6 — 지름길로 구하세요."
  }
 ],
 "89": [
  {
   "t": "자유 탐색 — 동전을 몇 번 던져 보세요. 연속 기록 뒤에 무엇이 올 것 같은 「느낌」이 드나요?"
  },
  {
   "t": "데이터 쌓기 — 100회 이상 던져 보세요. 앞면 연속 기록은 생각보다 자주 나오나요?",
   "re": "던진 횟수 (1\\d\\d|[2-9]\\d\\d|\\d{4})",
   "do": "① 20번 연달아 버튼 반복 ② 연속 기록 관찰 ③ 앞·뒤 비율 확인",
   "hand": "「앞면 3연속 뒤 다음이 앞면일 확률」 예상값을 먼저 종이에 적기"
  },
  {
   "t": "도박사의 재판 — 앞면 3연속 「직후」의 결과만 모은 집계가 뜰 때까지 던지세요. 다음은 정말 뒷면 차례였나요?",
   "re": "반반에 가깝습니다",
   "do": "① 집계가 8회 이상 쌓일 때까지 던지기 ② 앞·뒤 집계 비교 ③ 내 예상과 대조",
   "hand": "집계 결과와 1/2 을 비교해 판결문 초안 쓰기"
  },
  {
   "t": "(던진 횟수, 3연속 직후 앞·뒤) 표 — 큰 수의 법칙과 독립은 무엇이 다른가요?"
  },
  {
   "t": "심화 — 판결문: 「이제 나올 때가 됐다」(도박사의 오류)에게 독립의 정의(P(다음 앞|과거) = P(다음 앞))로 최종 판결을 쓰고, 로또·게임 뽑기에 같은 논리를 적용해 보세요."
  }
 ],
 "90": [
  {
   "t": "자유 탐색 — 조건 버튼들을 눌러 보세요. 화면의 무엇이 밝아지고 어두워지나요?"
  },
  {
   "t": "조건이 붙으면 분모는 어떻게 되나요? 24명보다 작아지는 순간을 만드세요.",
   "re": "분모\\(밝은 칸\\) = (1[0-9]|[1-9])명",
   "do": "① 조건 버튼으로 밝은 칸 변화 관찰 ② 분모 축소 확인",
   "hand": "조건 전후의 분자/분모를 표로"
  },
  {
   "t": "여학생 조건의 확률을 만들어 보세요 — 분자와 분모는 각각 몇?",
   "re": "P = 5 / 10",
   "do": "① 여학생 조건 확률 만들기",
   "hand": "두 조건부확률을 분수로 나란히 계산"
  },
  {
   "t": "P(A|B) 와 P(B|A) — 같은 값일까요? 분모로 판정해 쓰세요."
  },
  {
   "t": "내 설명 — 양성 판정 ≠ 질병을 분모의 교체로 설명하세요."
  }
 ],
 "91": [
  {
   "t": "자유 탐색 — 두 원을 움직여 보세요. 겹침은 무엇을 나타내나요?"
  },
  {
   "t": "두 확률을 그냥 더하면 항상 맞을까요? 사고가 나는 상황을 만들어 보세요.",
   "do": "① 두 원을 겹쳐 P(A∩B) 관찰 ② 1 초과 사고 재현",
   "hand": "하트 그림카드(3장)를 세어 25−3 확인"
  },
  {
   "t": "언제라면 그냥 더해도 될까요? 그 상태를 만들어 확정하세요.",
   "re": "1 을 넘었습니다",
   "do": "① 두 원 떼어 배반 상태 제작",
   "hand": "덧셈정리 식에 수를 넣어 22/52 완성"
  },
  {
   "t": "(겹침, P(A)+P(B), 진짜 확률) 표 — 빼야 하는 양의 정체를 쓰세요.",
   "re": "그냥 더해도 됩니다"
  },
  {
   "t": "내 문제 — 겹침을 깜빡해 1 이 넘는 가짜 문제를 만들어 친구에게 찾게 하세요."
  }
 ],
 "92": [
  {
   "t": "자유 탐색 — 계수 1, −2, −5, 6 과 k 를 보세요. 이 표는 무엇을 하려는 장치일까요?"
  },
  {
   "t": "세 칸을 진행하면 마지막 칸엔 무엇이 남을까요? 완주하고 정체를 밝히세요.",
   "re": "조립 완료",
   "do": "① k=1로 세 칸 진행 ② 마지막 칸 확인",
   "hand": "같은 나눗셈을 세로셈으로 종이에서 한 번"
  },
  {
   "t": "마지막 칸을 0 으로 만드는 k 가 있을까요? 찾으면 무엇을 얻나요?",
   "re": "는 인수!",
   "do": "① k를 바꿔 R=0 되는 값 셋 수집",
   "hand": "그 k들로 f(x) 인수분해식 쓰기"
  },
  {
   "t": "(k, R, f(k)) 표 — 두 열이 늘 같다면, 그것은 우연일까요?"
  },
  {
   "t": "심화 — 곱셈 횟수의 경제학: k=2 로 놓고 조립제법을 완주해 f(2) 를 구하세요. 직접 대입(2³부터 계산)과 조립제법의 곱셈 횟수를 각각 세어 어느 쪽이 경제적인지 판정하고, 계산기가 다항식을 계산하는 실제 방식(호너의 방법)과 연결하세요.",
   "re": "나머지 R = -4",
   "do": "① k=2 ② 세 칸 완주 ③ 곱셈 횟수: 대입 방식과 조립 방식 각각 세기",
   "hand": "f(2) = 8 − 8 − 10 + 6 을 대입으로도 계산해 마지막 칸과 대조"
  }
 ],
 "93": [
  {
   "t": "자유 탐색 — a 를 끌어 보세요. f(a) 는 그래프의 무엇을 읽고 있나요?"
  },
  {
   "t": "나누지 않고 나머지를 알 수 있을까요? 「실제로 나눠 확인」과 대조하세요.",
   "re": "나머지정리!",
   "do": "① a=2에 놓고 f(2) 확인 ② 나눠 확인 버튼과 대조",
   "hand": "f(2)=8−16+2+6 을 종이 계산"
  },
  {
   "t": "f(a) = 0 인 자리를 잡으면 무엇이 따라오나요? 첫 근을 찾으세요.",
   "re": "근 발견",
   "do": "① 세 근 모두 수집 ② 인수분해 완성 확인",
   "hand": "f(x)=(x+1)(x−2)(x−3) 전개로 역검산"
  },
  {
   "t": "남은 근까지 전부 — 삼차식은 결국 어떤 모습으로 무너지나요?",
   "re": "완전 인수분해"
  },
  {
   "t": "심화 — 정수 근 사냥의 원리: 세 근(−1, 2, 3)이 모두 상수항 6 의 약수인 것은 우연일까요? f(x)=(x−p)(x−q)(x−r) 전개에서 상수항이 −pqr 임을 보이고, 정수 근 후보를 6 의 약수로 좁히는 전략을 x³−7x+6 에 적용해 종이로 전수 검사하세요."
  }
 ],
 "94": [
  {
   "t": "자유 탐색 — z 를 끌어 보세요. 화살표의 길이와 방향은 무엇을 나타내나요?"
  },
  {
   "t": "× i 한 번 — 점은 어디로 갈까요? 먼저 찍어 두고 눌러 확인하세요.",
   "re": "\\+90° 회전",
   "do": "① z=(3,1)에서 ×i ② 새 좌표 기록",
   "hand": "(3+i)·i 를 종이에서 전개해 좌표 대조"
  },
  {
   "t": "× i 를 반복하면 언젠가 제자리로 올까요? 몇 번 만인지 걸고 시험하세요.",
   "re": "i⁴ = 1",
   "do": "① 네 번 곱해 제자리 확인",
   "hand": "i², i³, i⁴ 값을 회전 그림과 함께 정리"
  },
  {
   "t": "켤레 z̄ 는 어디 있을까요? 예상 후 켜고, z·z̄ 의 특징도 잡으세요.",
   "re": "거울 대칭"
  },
  {
   "t": "심화 — i 의 달력: i²⁰²⁶ 을 나머지 계산(2026 ÷ 4)으로 구하고 회전 그림으로 근거를 쓰세요. 이어서 (1+i) 를 두 번 곱하면 무엇이 되는지 화면으로 실험하고, ×(1+i) 가 「45° 회전 + √2배 확대」임을 길이로 검증하세요."
  }
 ],
 "95": [
  {
   "t": "자유 탐색 — b·c 를 움직여 보세요. 두 근과 함께 변하는 값들을 추적하세요."
  },
  {
   "t": "합·곱만 듣고 두 수를 찾을 수 있을까요? 첫 문제에 도전하세요.",
   "re": "문제 해결!",
   "do": "① 도전 열기 ② b·c 조절로 첫 문제 해결",
   "hand": "x²−5x+6 인수분해를 종이에서"
  },
  {
   "t": "음수가 섞여도 통할까요? 다음 문제까지 연달아 잡으세요.",
   "re": "2연승",
   "do": "① 음수 섞인 2번 문제 연속 해결",
   "hand": "합 −1·곱 −12 로 t²+t−12 세워 풀기"
  },
  {
   "t": "(두 근, 합, 곱, −b, c) 표 — 계수에 새겨진 정보를 네 말로."
  },
  {
   "t": "심화 — 3라운드 승부: 합 2 · 곱 −8 인 두 수를 계수로 번역해(b = −합, c = 곱) 방정식으로 잡아내세요. 그리고 「합 7·곱 12」는 방정식 없이 머리로 두 수를 말한 뒤 같은 방법으로 검산하세요.",
   "re": "x² − 2x − 8 = 0",
   "do": "① 합·곱을 b·c 로 번역 ② 슬라이더로 설정 ③ 그래프의 두 근 읽기",
   "hand": "두 근을 t² − 2t − 8 = 0 인수분해로도 구해 화면과 대조"
  }
 ],
 "96": [
  {
   "t": "자유 탐색 — 곡선을 위아래로 끌어 보세요. 실근의 개수가 언제 바뀌나요?"
  },
  {
   "t": "x축을 세 번 건너게 만들 수 있나요? 조건을 찾으세요.",
   "re": "실근 3개",
   "do": "① k를 낮춰 3개 실근 상태 제작 ② 극값 부호 기록",
   "hand": "f(−1)=k+2, f(1)=k−2 를 종이로 유도"
  },
  {
   "t": "두 상태의 경계 — 스치는 순간을 자석으로 잡으세요.",
   "re": "접했습니다",
   "do": "① 자석 접점(k=±2) 포착",
   "hand": "(k+2)(k−2)<0 풀어 범위 확정"
  },
  {
   "t": "(k, 극대, 극소, 실근 수) 표 — 부호 곱의 규칙을 찾아 쓰세요."
  },
  {
   "t": "심화 — 완전 대칭의 순간: k = 0 으로 맞춰 보세요. 곡선은 어떤 대칭을 갖고 세 실근은 무엇인가요? x³ − 3x = 0 을 인수분해로 풀어 교점과 대조하고, 실근이 셋이 되는 k 의 범위를 부등식 (k+2)(k−2) < 0 으로 확정하세요.",
   "re": "극소 f\\(1\\) = -2\\.00",
   "do": "① k 를 0 에 정확히 ② 원점 대칭 확인 ③ 세 교점 좌표 읽기",
   "hand": "x(x−√3)(x+√3) = 0 의 세 근을 쓰고 화면 교점과 대조"
  }
 ],
 "97": [
  {
   "t": "자유 탐색 — 처음 식 x²+1 < 0 — 해가 있을까요? 그래프에서 이유를 찾으세요."
  },
  {
   "t": "해가 「구간」이 되게 만들 수 있나요? c 를 조절해 보세요.",
   "re": "< x <",
   "do": "① b=−4, c=3 설정 ② 초록 해집합 확인",
   "hand": "x²−4x+3 인수분해로 근 두 개 종이 계산"
  },
  {
   "t": "부등호를 뒤집으면 해는 어디로 가나요? 예상 후 확인.",
   "re": "또는 x >",
   "do": "① 부등호 뒤집어 바깥 해 확인",
   "hand": "네 운명(사이·바깥·전부·없음) 조건 표"
  },
  {
   "t": "네 가지 운명(사이·바깥·전부·없음)을 모두 만들어 표로 채우세요."
  },
  {
   "t": "심화 — 네 가지 운명의 지도: 부등호를 뒤집어 해가 「모든 실수」가 되는 상태를 만들어 보세요. (판별식 D 의 부호) × (부등호 방향) 2×2 지도로 네 운명을 정리하고, x² − 2x − 3 < 0 을 손으로 풀어 화면 검산까지 마치세요.",
   "re": "모든 실수 — 포물선",
   "do": "① D < 0 이 되는 b·c 설정 ② 부등호를 > 로 ③ 수직선 전체가 칠해짐 확인",
   "hand": "D = b² − 4c 의 부호와 네 운명을 표로 배치"
  }
 ],
 "98": [
  {
   "t": "자유 탐색 — P 를 이리저리 끌어 보세요. 허용과 위반의 경계는 어떤 모양인가요?"
  },
  {
   "t": "이익이 가장 큰 계획은 영역의 어디에 있을까요? 예상하고 찾으세요.",
   "re": "꼭짓점 명중",
   "do": "① P를 (4,2)에 명중 ② 네 꼭짓점 이익 비교",
   "hand": "네 꼭짓점의 z=3x+2y 를 종이 계산"
  },
  {
   "t": "이익선을 밀어 올려 보세요 — 영역을 떠나기 직전, 어디에 걸려 있나요?",
   "re": "영역을 스칩니다",
   "do": "① 이익선 밀어 마지막 접점 확인",
   "hand": "목적함수 교체 후 새 최적점 계산"
  },
  {
   "t": "목적함수를 바꾸면 최적지도 바뀔까요? 예상 후 확인하세요.",
   "re": "\\(0, 4\\) 가 최대"
  },
  {
   "t": "심화 — 답은 왜 늘 꼭짓점인가: 이익선(평행선 다발)이 영역을 떠나는 마지막 순간이 모서리일 수밖에 없는 이유를 그림 논증으로 쓰세요. 제약이 하나 늘어 오각형 영역이 되면 후보는 몇 곳이 되나요? 실제 급식 식단·공장 생산에서 이 수학이 쓰이는 곳을 한 가지 조사하세요."
  }
 ],
 "99": [
  {
   "t": "자유 탐색 — 두 상황(회장·부회장 / 청소 짝)을 비교해 보세요. 무엇이 다르죠?"
  },
  {
   "t": "순서가 있는 목록은 몇 줄일까요? 예상하고 끝까지 쌓으세요.",
   "re": "순열 12가지",
   "do": "① 순서 있는 목록 12줄 완성",
   "hand": "4×3 계산과 목록 개수 대조"
  },
  {
   "t": "순서를 없애면 몇으로 줄어들까요? 비율까지 예상하고 확인하세요.",
   "re": "조합 6가지",
   "do": "① 짝 목록 6줄 완성 ② 비율 확인",
   "hand": "{가,나}가 대표하는 순열 두 줄을 형광펜 묶기"
  },
  {
   "t": "AABB 나열 — 24가 아니라면 왜일까요? 도전으로 확인하세요.",
   "re": "같은 것이 있는 순열: 6가지"
  },
  {
   "t": "심화 — 공식의 탄생: 5명 중 2명의 순열(₅P₂)과 조합(₅C₂)을 공식으로 구하고, 「조합 하나가 순열 2! 줄을 대표한다」는 오늘의 규칙으로 검산하세요. 우리 반 자리 바꾸기·조 편성에서 순열·조합이 갈리는 실제 상황을 하나씩 들어 계산까지 완성하세요."
  }
 ],
 "100": [
  {
   "t": "자유 탐색 — 두 화살표를 마음대로 끌어 보세요. 도형 F 는 누구 말을 듣나요?"
  },
  {
   "t": "90° 회전을 만들 수 있나요? 도전을 열고 유령에 겹치세요 — 어떤 행렬이 나왔나요?",
   "re": "회전 완성",
   "do": "① 도전 열기 ② e₂→(−1,0), e₁→(0,1) 순서로 명중",
   "hand": "(1,0)→(0,1) 을 표의 어느 열이 맡는지 쓰기"
  },
  {
   "t": "도형을 납작하게 만들어 보세요 — 두 화살표가 어떤 상태일 때인가요?",
   "re": "납작하게 붕괴",
   "do": "① 두 화살표 일직선 → 붕괴 관찰",
   "hand": "det=ad−bc 를 계산해 0 확인"
  },
  {
   "t": "네 행렬의 |det| 표 — 이 숫자는 도형의 무엇을 재고 있나요?"
  },
  {
   "t": "심화 — 예측 후 검산: 180° 회전 행렬을 먼저 종이에 쓰고, 화살표 두 개로 만들어 검산하세요. 90° 회전을 두 번 합성하면 180°가 된다는 것을 행렬 곱 [0 −1; 1 0]² 으로도 확인하세요.",
   "re": "\\[ -1[\\s\\S]{0,6}0 ; 0[\\s\\S]{0,6}-1 \\]",
   "do": "① e₁ 을 (−1, 0) 으로 ② e₂ 를 (0, −1) 로 ③ 도형이 정확히 뒤집혔는지 확인",
   "hand": "[0 −1; 1 0] × [0 −1; 1 0] 을 종이에서 곱해 결과 행렬 확인"
  }
 ],
 "101": [
  {
   "t": "자유 탐색 — 왼쪽 판에 변환 둘을 쌓아 보세요. 합성 행렬은 어떻게 만들어지나요?"
  },
  {
   "t": "순서를 바꾸면 결과도 바뀔까요? 오른쪽 판에 반대 순서로 걸고 비교하세요.",
   "re": "순서가 결과를 바꿉",
   "do": "① 좌: R→X, 우: X→R ② 두 결과 비교",
   "hand": "두 합성 행렬을 종이에서 곱해 대조"
  },
  {
   "t": "순서를 바꿔도 무사한 짝이 있을까요? 찾아내세요.",
   "re": "바꿔도 같습니다",
   "do": "① R·U(모두2배) 짝으로 교환 성공 찾기",
   "hand": "교환되는 조건 짐작을 한 줄로"
  },
  {
   "t": "(순서, 합성 행렬, 같은가) 표 — 교환이 되는 조건을 짐작해 쓰세요."
  },
  {
   "t": "심화 — 순서를 타는 세상: 「양말→신발 vs 신발→양말」처럼 순서를 타는 일상 예 두 가지를 행렬 곱 AB ≠ BA 와 이어 쓰고, 교환이 되는 짝(균등 확대)이 왜 특별한지 「방향을 가리지 않는 변환」으로 설명하세요. 회전 두 개(90°+90°)는 교환이 될까요? 화면으로 판정하세요."
  }
 ],
 "102": [
  {
   "t": "자유 탐색 — 카드 4장을 마음대로 끌어 보세요. 어디까지 버티고 언제 무너지나요?"
  },
  {
   "t": "일부러 무너뜨려 보세요 — 화면은 몇 장째가 문제라고 말하나요? 왜 그럴까요?",
   "re": "무게중심이 받침을 벗어났",
   "do": "① 맨 위 카드를 확 밀어 붕괴 ② 몇 장째 문제인지 기록",
   "hand": "맨 위 카드가 버티는 한계(절반)를 무게중심으로 설명"
  },
  {
   "t": "맨 위 카드를 통째로 책상 밖 허공에 — 가능할까요? 방법을 찾으세요 (힌트 눈금 자유).",
   "re": "완전 돌출",
   "do": "① ½·¼·⅙ 눈금 켜고 4장 배치 ② 목표 달성까지 미세 조정",
   "hand": "½(1+½+⅓+¼) 을 종이 계산해 돌출 한계 확인"
  },
  {
   "t": "(카드 수, 최대 돌출, 이론 한계) 표 — ½(1+½+⅓+…) 의 정체를 네 말로."
  },
  {
   "t": "예언 — 돌출 2카드에 필요한 장수를 이론 한계로 추정하세요. 왜 이렇게 많죠?"
  }
 ],
 "103": [
  {
   "t": "자유 탐색 — 세 슬라이더를 움직여 보세요. 삼각형 위의 점은 언제 가운데로 가나요?"
  },
  {
   "t": "#4B96C8 — 이 암호 같은 코드의 정체는? 좌표로 해독해 그 색을 재현하세요.",
   "re": "해독 성공",
   "do": "① 도전①에서 4B·96·C8 해독 ② 슬라이더 명중",
   "hand": "4B(16) = 4×16+11 을 종이 계산"
  },
  {
   "t": "빨강과 파랑의 1:3 내분점은 무슨 색일까요? 예상하고 찾아내세요.",
   "re": "내분점 \\(1:3\\) 명중",
   "do": "① 1:3 내분 색 도전 ② 좌표 확인",
   "hand": "(3·(255,0,0)+1·(0,0,255))/4 를 종이 계산"
  },
  {
   "t": "회색을 「합성으로」 만들 수 있나요? 중점의 좌표 조건을 찾으세요.",
   "re": "채도 0 도달"
  },
  {
   "t": "내 색 — 좋아하는 색의 코드를 좌표로 환산하고 삼각형에서 위치를 설명하세요."
  }
 ],
 "104": [
  {
   "t": "1분 자유 탐색 — 「다음 접기」를 눌러 색종이에 접힌 선이 하나씩 쌓이는 것을 보세요. 어떤 선들이 만나 점을 만드나요?"
  },
  {
   "t": "3등분 접기 — 오늘의 문제 첫 관문입니다. 3등분 모드에서 끝까지 접어, 밑변을 정확히 나누는 점 P 를 만들어 내세요.",
   "re": "3등분 확정",
   "do": "① 3등분 모드 확인 ② 「다음 접기」를 세 번 ③ 교점 O 와 점 P 의 자리 확인",
   "hand": "닮은 두 삼각형을 찾아 대응변의 비를 쓰고, 그 비가 왜 2 : 1 인지 종이에 증명"
  },
  {
   "t": "5등분 접기 — 이번엔 대각선 두 개가 만드는 교점입니다. 5등분 모드를 끝까지 접어 1 : 4 를 만들어 내세요.",
   "re": "5등분 확정",
   "do": "① 5등분 모드로 전환 ② 「다음 접기」를 세 번 ③ 교점이 나눈 비 확인",
   "hand": "두 대각선이 만든 닮은 삼각형의 비로 1 : 4 를 유도해 종이에 쓰기"
  },
  {
   "t": "(모드, 접기 단계, 내분비, 근거) 표 — 접기가 왜 눈대중이 아닌지 「대칭이동」이라는 말로 정리하세요."
  },
  {
   "t": "심화 — 불가능을 접다: 각 3등분 모드에서 θ 를 60°로 두고 끝까지 접어 3등분선을 만들어 내세요. 자와 컴퍼스로는 불가능한 이 작도가 접기로는 왜 가능한지, 접기가 허용하는 조작(두 점을 동시에 두 직선 위에 올리기)으로 설명하세요.",
   "re": "각 3등분 완성",
   "do": "① 각 3등분 모드 ② θ 를 60°로 ③ 「다음 접기」를 네 번 눌러 완성",
   "hand": "합동인 세 직각삼각형을 표시하고 SSS·SAS 로 세 각이 같음을 증명"
  }
 ],
 "105": [
  {
   "t": "1분 자유 탐색 — 「한 해 굴리기」를 몇 번 눌러 보세요. 남은 세대는 매년 몇 씩 줄어드나요? 일정한 수인가요, 비율인가요?"
  },
  {
   "t": "절반은 언제? — 계속 굴려 남은 세대가 50 이하로 내려가는 해를 찾으세요. 예상 연도를 먼저 메모하고 시작하세요.",
   "re": "절반 붕괴",
   "do": "① 예상 연도 메모 ② 한 해씩 굴리며 남은 수 기록 ③ 50 이하가 된 해 확인",
   "hand": "100(5/6)ˣ = 50 을 로그로 풀어 이론 반감기(≈3.8년)를 구하고 실험과 대조"
  },
  {
   "t": "10년의 실험 — 「10년 자동」으로 오늘의 문제 첫 답을 구하세요. 실험값과 이론값 100(5/6)¹⁰ 의 차이는 얼마인가요?",
   "re": "10년 실험 완료",
   "do": "① 다시(100세대)로 초기화 ② 10년 자동 ③ (실험값, 이론값, 오차) 기록",
   "hand": "(5/6)¹⁰ 을 로그로 어림해 이론값 약 16세대를 손으로 확인"
  },
  {
   "t": "(해, 실험값, 이론값, 오차) 표 10줄 — 「다시」로 세 번 반복해 실험이 이론 둘레에서 얼마나 흔들리는지 기록하세요."
  },
  {
   "t": "심화 — 로그로 예언하기: 오늘의 문제 둘째 답(10세대 이하가 되는 해)을 log2=0.30, log3=0.47 로 먼저 계산한 뒤, 실험을 계속 굴려 실제 도달 해와 비교하세요.",
   "re": "이하 — \\d+년째 도달",
   "do": "① 로그로 예상 연도 계산 ② 계속 굴려 10 이하 도달 ③ 예상과 실제 비교",
   "hand": "x ≥ log10 ÷ (log6 − log5) 를 계산해 약 13년을 유도하고, 실험의 흔들림으로 차이를 설명"
  }
 ],
 "106": [
  {
   "t": "1분 자유 탐색 — 원 위의 점 P 를 끌어 각을 돌려 보세요. sin·cos 값은 무엇을 따라 움직이나요?"
  },
  {
   "t": "오늘의 문제 — 각을 150°로 맞추세요. sin 150° 는 얼마인가요? 그 값이 sin 30° 와 같은 이유가 그림에서 보이나요?",
   "re": "θ = 150° · 제2사분면",
   "do": "① 150° 단추(또는 P 를 끌어 150°) ② sin·cos 값 읽기 ③ 30°와 좌표 비교",
   "hand": "150°의 점 P 좌표를 30°의 점과 나란히 적고, y 좌표가 같고 x 좌표만 부호가 다른 이유 설명"
  },
  {
   "t": "부호의 지도 — 각을 210°로 옮겨 보세요. 제3사분면에서 sin·cos 의 부호는 각각 어떻게 되나요?",
   "re": "θ = 210° · 제3사분면",
   "do": "① 210° 단추 ② 두 부호 기록 ③ 300°(제4사분면)에서도 확인",
   "hand": "사분면 4칸에 (sin, cos) 부호를 채운 지도를 그리기"
  },
  {
   "t": "(각, 사분면, sin, cos, 부호) 표 8줄 — 부호가 바뀌는 경계가 어디인지 확정하세요."
  },
  {
   "t": "심화 — 한 바퀴의 의미: 각을 390°로 만들어 보세요. 30°와 무엇이 같고 무엇이 다른가요? 주기 360°가 뜻하는 바를 정리하고, 음의 각(−60°)도 시험해 해석하세요.",
   "re": "한 바퀴 지났습니다",
   "do": "① 390° 단추 ② 30°와 좌표 비교 ③ 슬라이더로 −60°까지 내려 관찰",
   "hand": "sin(θ + 360°) = sin θ 를 단위원 그림으로 설명하고, sin(−60°) 값을 예측 후 확인"
  }
 ],
 "107": [
  {
   "t": "1분 자유 탐색 — A·D·C 를 하나씩 움직여 보세요. 각각 곡선의 무엇을 조종하나요?"
  },
  {
   "t": "중심선 맞추기 — 먼저 D 를 조절해 곡선이 점들의 한가운데를 지나게 하세요. 1년 평균 일출은 몇 시쯤인가요?",
   "re": "D = 6\\.[3-6]",
   "do": "① A 는 그대로 두고 D 만 조절 ② 점들의 위·아래 균형 맞추기 ③ 값 기록",
   "hand": "12개 값의 평균을 종이에서 계산해 D 와 비교"
  },
  {
   "t": "모형 완성 — A(진폭)와 C(위상)까지 맞춰 평균 오차를 9분(0.15시간) 아래로 낮추세요.",
   "re": "일출 모형 명중",
   "do": "① A 를 여름·겨울 차이의 절반(약 1.2)으로 ② C 를 좌우로 밀며 RMSE 관찰 ③ 0.15 미만 달성",
   "hand": "(가장 늦은 일출 − 가장 이른 일출) ÷ 2 를 계산해 A 의 예상값 먼저 구하기"
  },
  {
   "t": "(A, D, C, RMSE) 표 4줄 — 각 값이 곡선의 무엇을 바꾸는지 자기 말로 정리하세요."
  },
  {
   "t": "심화 — 예보관 되기: 완성한 모형으로 하지(6월 21일)의 일출을 예측하고, 실제 값과 비교해 오차를 평가하세요. 위도가 높은 도시라면 A 는 어떻게 달라질지 예상해 쓰세요."
  }
 ],
 "108": [
  {
   "t": "1분 자유 탐색 — 두 각과 기선을 움직여 보세요. 나무 C 의 자리는 무엇에 따라 정해지나요?"
  },
  {
   "t": "오늘의 문제 — ∠A = 63°, ∠B = 55°, 기선 50 m 로 맞추고 나무까지의 거리를 확정하세요.",
   "re": "건널 수 없는 거리 확정",
   "do": "① 세 슬라이더를 문제 값으로 ② ∠C 계산 확인 ③ AC·BC 읽기",
   "hand": "50 × sin55° ÷ sin62° 를 종이에서 계산해 화면 값과 대조"
  },
  {
   "t": "두 법칙의 만남 — 「코사인법칙으로 검산」을 눌러 보세요. 다른 길로 구한 값이 같은가요?",
   "re": "두 법칙 일치",
   "do": "① 검산 단추 ② 두 값 비교 ③ 각을 바꿔도 일치하는지 재확인",
   "hand": "b² = a² + c² − 2ac·cos B 에 화면 값을 넣어 손으로 검산"
  },
  {
   "t": "(∠A, ∠B, ∠C, 기선, AC, BC) 표 5줄 — 기선을 2배로 하면 거리가 어떻게 변하는지 기록하세요."
  },
  {
   "t": "심화 — 측량 계획서: 두 각의 합이 180°에 가까워지면 무슨 일이 벌어지는지 실험하고(삼각형이 납작해짐), 실제 측량에서 기선을 길게 잡는 이유를 오차 관점에서 설명하세요."
  }
 ],
 "109": [
  {
   "t": "1분 자유 탐색 — 세 슬라이더를 움직여 보세요. 잔액 막대는 처음에 왜 잘 안 줄어들까요?"
  },
  {
   "t": "오늘의 문제 — 원금 1,200만원 · 연 6% · 24개월로 맞추고 월 상환액을 확정하세요.",
   "re": "월 상환액 5[0-9]\\.\\d만원",
   "do": "① 세 슬라이더를 문제 값으로 ② 월 상환액·총이자 읽기 ③ 잔액이 절반이 되는 시점 확인",
   "hand": "i = 0.06/12 를 구하고 m = P·i(1+i)ⁿ/((1+i)ⁿ−1) 에 넣어 어림 계산"
  },
  {
   "t": "기간의 거래 — 기간만 48개월로 늘려 보세요. 월 부담과 총 이자는 각각 어떻게 되나요?",
   "re": "이자가 원금의 10%를 넘었습니다",
   "do": "① 기간을 48개월로 ② 월 상환액 감소폭 기록 ③ 총 이자 증가폭 기록",
   "hand": "두 경우의 (월 상환액, 총 이자)를 표로 적고 무엇을 얻고 무엇을 잃는지 판정"
  },
  {
   "t": "(원금, 이자율, 기간, 월 상환액, 총 이자) 표 6줄 — 총 이자를 가장 크게 키우는 요인을 찾으세요."
  },
  {
   "t": "심화 — 공식의 탄생: 월 상환액 공식이 등비수열의 합에서 나오는 과정을 손으로 유도하세요. 각 달의 상환액을 현재가치로 되돌려 더하면 왜 등비수열이 되는지 식으로 보이세요."
  }
 ],
 "110": [
  {
   "t": "1분 자유 탐색 — n 을 바꾸며 계단을 보세요. 계단의 칸 수와 높이는 무엇을 나타내나요?"
  },
  {
   "t": "가우스의 한 수 — 「거꾸로 된 계단 붙이기」를 눌러 보세요. 두 계단이 만든 도형은 무엇이고, 그 넓이는 얼마인가요?",
   "re": "직사각형 완성",
   "do": "① n=6 에서 붙이기 ② 가로·세로 읽기 ③ n 을 10으로 바꿔 다시 확인",
   "hand": "1+2+…+n 과 n+…+1 을 위아래로 더해 (n+1)이 n 개 생기는 과정을 손으로 쓰기"
  },
  {
   "t": "제곱의 합 — Σk² 로 바꿔 보세요. 실제 합과 공식 n(n+1)(2n+1)/6 이 일치하나요?",
   "re": "일치합니다",
   "do": "① Σk² 선택 ② n 을 3~10 으로 바꾸며 두 값 대조 ③ 어긋나는 n 이 있는지 확인",
   "hand": "n=4 에서 1+4+9+16 을 손으로 더해 공식값과 비교"
  },
  {
   "t": "(n, 실제 합, 공식값, 직사각형 넓이) 표 6줄 — 공식이 언제나 옳은지 판정하세요."
  },
  {
   "t": "심화 — 5050 의 정체: 1부터 100까지의 합을 공식으로 구하고, 같은 방법으로 「홀수만 더하기(1+3+5+…)」의 합 공식을 스스로 만들어 도형으로 설명하세요."
  }
 ],
 "111": [
  {
   "t": "1분 자유 탐색 — 「첫 도미노 밀기」와 「다시 세우기」를 눌러 보세요. 무엇이 있어야 사슬이 이어지나요?"
  },
  {
   "t": "완전한 사슬 — 간격을 1.4 이하로 두고 첫 도미노를 밀어 전부 무너뜨리세요. 두 조건이 모두 갖춰졌나요?",
   "re": "전부 무너졌습니다",
   "do": "① 간격 1.4 확인 ② 5번 빼기 해제 ③ 첫 도미노 밀기",
   "hand": "조건 ①과 ②가 각각 무엇에 해당하는지 화면 판정과 짝지어 쓰기"
  },
  {
   "t": "사슬 끊기 — 「5번째만 빼기」를 켜고 다시 밀어 보세요. 어디에서 멈추나요? k → k+1 이 한 곳만 끊겨도 되나요?",
   "re": "4번에서 멈췄습니다",
   "do": "① 5번 빼기 체크 ② 다시 세우기 ③ 첫 도미노 밀기",
   "hand": "「어떤 k 에 대해서도」라는 조건이 왜 필요한지 이 실험으로 설명"
  },
  {
   "t": "(첫 도미노, k→k+1, 쓰러진 수, 전부 무너짐) 표 4줄 — 네 경우를 모두 만들어 채우세요."
  },
  {
   "t": "심화 — 증명 쓰기: 1 + 2 + … + n = n(n+1)/2 를 수학적 귀납법으로 증명하고, 증명의 어느 문장이 「첫 도미노」이고 어느 문장이 「k → k+1」인지 표시하세요. 간격을 넓혀 두고 밀었을 때가 증명의 어떤 실패에 해당하는지도 쓰세요.",
   "re": "간격이 넓어 못 닿음",
   "do": "① 다시 세우기 ② 간격을 2.0 이상으로 ③ 첫 도미노 밀기",
   "hand": "조건 ②가 깨진 증명의 예를 하나 지어 쓰기"
  }
 ],
 "112": [
  {
   "t": "1분 자유 탐색 — 밑과 k 를 움직여 보세요. 두 선이 만나는 자리는 무엇을 뜻하나요?"
  },
  {
   "t": "오늘의 문제 — 밑을 1.06(연 6%)로 두고 k 를 3.0 으로 맞추세요. 원금이 세 배가 되는 해는 언제인가요?",
   "re": "세 배 되는 해",
   "do": "① 밑 1.06 확인 ② k 를 3.0 으로 ③ 교점의 x 값 읽기",
   "hand": "log 3 ÷ log 1.06 을 종이에서 어림 계산해 화면 값과 대조"
  },
  {
   "t": "딱 떨어지는 해 — 밑을 2로, k 를 8.0 으로 맞춰 보세요. 해가 정수로 떨어지나요?",
   "re": "= 3\\.000",
   "do": "① 밑 2 선택 ② k = 8.0 ③ 교점 x 읽기",
   "hand": "2³ = 8 임을 이용해 로그 없이도 답을 말할 수 있는지 확인"
  },
  {
   "t": "(밑, k, 해) 표 다섯 줄 — k 를 두 배로 하면 해는 얼마나 늘어나나요?"
  },
  {
   "t": "심화 — 뒤집히는 부등호: 밑을 0.5 로 바꾸고 부등식 단추를 눌러 보세요. 해가 「크다」가 아니라 「작다」로 바뀌는 이유를 그래프에서 찾으세요.",
   "re": "부등호가 뒤집힙니다",
   "do": "① 밑 0.5 선택 ② > k 부등식 단추 ③ 초록 영역의 위치 확인",
   "hand": "감소함수에서 대소 관계가 뒤집히는 이유를 두 점의 y 값 비교로 설명"
  }
 ],
 "113": [
  {
   "t": "1분 자유 탐색 — 밑과 진수를 바꿔 보세요. 세 막대는 각각 무엇을 재고 있나요?"
  },
  {
   "t": "오늘의 문제 — 밑을 2, 진수를 100 으로 맞추세요. 밑이 2인 로그 값은 얼마인가요?",
   "re": "오늘의 문제 — log₂",
   "do": "① 밑 2 선택 ② 진수 100 ③ 몫 막대의 값 읽기",
   "hand": "log 100 = 2 이므로 2 ÷ log 2 를 종이에서 계산해 대조"
  },
  {
   "t": "되돌려 검산 — 「거듭제곱으로 검산」을 눌러 보세요. 구한 값을 지수로 올리면 진수가 돌아오나요?",
   "re": "진수와 일치",
   "do": "① 검산 단추 ② 되돌아온 값과 진수 비교 ③ 다른 진수에서도 반복",
   "hand": "a^(log_a b) = b 인 이유를 로그의 정의로 한 줄로"
  },
  {
   "t": "(밑, 진수, log b, log a, log_a b) 표 다섯 줄 — 진수를 제곱하면 값이 어떻게 되나요?"
  },
  {
   "t": "심화 — 스스로를 재기: 「밑 = 진수로 맞추기」를 눌러 보세요. 값이 왜 1 이 되나요? 진수가 1일 때는 어떻게 되는지도 확인하세요.",
   "re": "자기 자신을 자기 자로 재면 1",
   "do": "① 밑 = 진수 단추 ② 값 확인 ③ 진수를 1 근처로 내려 관찰",
   "hand": "log_a a = 1, log_a 1 = 0 을 지수 형태로 바꿔 설명"
  }
 ],
 "114": [
  {
   "t": "1분 자유 탐색 — 대응점 x 를 끌어 보세요. 두 곡선 위의 점은 어떻게 짝지어지나요?"
  },
  {
   "t": "짝점 추적 — x 를 2 로 맞추세요. 지수 위의 (2, 4) 는 로그 위의 어느 점과 짝인가요?",
   "re": "\\(4\\.00, 2\\.0\\)",
   "do": "① x 를 2.0 으로 ② 두 점의 좌표 읽기 ③ 연결선이 y = x 와 만나는 자리 확인",
   "hand": "(p, q) ↔ (q, p) 임을 좌표로 쓰고 두 점의 중점이 y=x 위에 있음을 계산"
  },
  {
   "t": "화면 밖으로 — x 를 4 이상으로 끌어 보세요. 지수함수는 얼마나 빨리 커지나요?",
   "re": "값이 화면 밖입니다",
   "do": "① x 를 4 이상으로 ② 안내문 확인 ③ 로그 쪽은 왜 천천히 자라는지 관찰",
   "hand": "2⁴, 2⁵ 값을 적고 로그 쪽 대응점의 위치와 비교"
  },
  {
   "t": "(x, aˣ, 로그 위의 점) 표 다섯 줄 — 정의역·치역이 어떻게 맞바뀌는지 정리하세요."
  },
  {
   "t": "심화 — 밑이 작아지면: 밑을 0.5 로 바꿔 보세요. 두 곡선이 모두 감소해도 짝 관계는 유지되나요? 로그에 음수를 넣을 수 없는 이유를 지수함수의 치역으로 논증하세요.",
   "re": "둘 다 감소합니다",
   "do": "① 밑 0.5 선택 ② 두 곡선의 방향 확인 ③ 대응점이 여전히 y=x 대칭인지",
   "hand": "a^x > 0 이 언제나 성립함을 밑의 조건으로 설명"
  }
 ],
 "115": [
  {
   "t": "1분 자유 탐색 — 지수 n 을 움직여 보세요. 막대의 파란 부분과 붉은 부분은 각각 무엇인가요?"
  },
  {
   "t": "오늘의 문제 — 밑 2, 지수 100 으로 맞추세요. 2¹⁰⁰ 은 몇 자리 수인가요?",
   "re": "2¹⁰⁰ 은 31자리",
   "do": "① 밑 2 확인 ② 지수 100 ③ 지표·가수·자릿수 읽기",
   "hand": "100 × log 2 = 30.10 을 계산하고 자릿수 = 지표 + 1 을 적용"
  },
  {
   "t": "다른 밑으로 — 3의 거듭제곱으로 바꾸고 지수를 50 으로 두세요. 몇 자리인가요?",
   "re": "= 24자리",
   "do": "① 밑 3 선택 ② 지수 50 ③ 자릿수 기록",
   "hand": "50 × log 3 ≈ 23.85 로 자릿수를 손으로 확인"
  },
  {
   "t": "(수, log 값, 지표, 가수, 자릿수, 첫 자리) 표 다섯 줄 — 지수를 2배 하면 자릿수는?"
  },
  {
   "t": "심화 — 두 배의 법칙: 밑 2에서 지수를 200 으로 올려 보세요. 자릿수가 정확히 두 배가 아닌 이유를 지표의 계산으로 설명하세요.",
   "re": "= 61자리",
   "do": "① 밑 2 ② 지수 200 ③ 100일 때(31자리)와 비교",
   "hand": "200 × log 2 = 60.2 로 61자리가 되는 과정을 쓰고 31×2 와 비교"
  }
 ],
 "116": [
  {
   "t": "1분 자유 탐색 — 세 슬라이더를 하나씩 움직여 보세요. 회색 기준 곡선과 무엇이 달라지나요?"
  },
  {
   "t": "방향 뒤집기 — 밑을 1보다 작게 내려 보세요. 곡선은 어느 쪽으로 기우나요?",
   "re": "감소함수",
   "do": "① 밑을 0.5 근처로 ② 곡선 방향 확인 ③ 밑 2 와 나란히 비교",
   "hand": "a > 1 과 0 < a < 1 에서 aˣ 의 대소를 두 점으로 비교해 쓰기"
  },
  {
   "t": "점근선 들어 올리기 — 세로 이동 q 를 2 로 올려 보세요. 곡선이 아무리 내려가도 넘지 못하는 선은 어디인가요?",
   "re": "점근선이 y = 2 로",
   "do": "① q = 2.0 ② 붉은 점선의 자리 확인 ③ x 를 아주 작게 상상해 보기",
   "hand": "x → −∞ 일 때 aˣ → 0 이므로 y → q 임을 설명"
  },
  {
   "t": "(밑, p, q, 증가/감소, 점근선, y절편) 표 다섯 줄 — 오늘의 문제 식 y = 2^(x−3) + 2 를 만들어 보세요."
  },
  {
   "t": "심화 — 아래로 내려간 점근선: q 를 −2 로 내리고 그래프가 x축을 자르는지 확인하세요. 점근선이 음수일 때 x절편이 생기는 이유를 식으로 설명하세요.",
   "re": "점근선 y = -2\\.0",
   "do": "① q = −2.0 ② x축과 만나는지 확인 ③ 만나는 x 값 어림",
   "hand": "aˣ = 2 를 풀어 x절편을 손으로 구하기"
  }
 ],
 "117": [
  {
   "t": "1분 자유 탐색 — 네 슬라이더를 마음대로. 회색 기준 곡선과 무엇이 달라지나요?"
  },
  {
   "t": "물결을 촘촘하게 — b 만 2 로 올려 보세요. 주기는 어떻게 되나요? (진폭은 그대로인가요?)",
   "re": "주기가 절반",
   "do": "① b = 2.0 ② 주기 값 읽기 ③ 최댓값이 그대로인지 확인",
   "hand": "주기 = 2π ÷ b 에 b=2 를 넣어 π 가 나오는지 계산"
  },
  {
   "t": "키 키우기 — 이번엔 a 만 2.5 로 올려 보세요. 주기는 변하지 않나요?",
   "re": "위아래로 5 만큼",
   "do": "① a = 2.5 ② 최대·최소 선의 자리 확인 ③ 주기 값 재확인",
   "hand": "최댓값 = d + a, 최솟값 = d − a 를 계산해 화면과 대조"
  },
  {
   "t": "(무엇을 움직였나, 주기, 최댓값, 최솟값) 표 여섯 줄 — 계수의 담당을 확정하세요."
  },
  {
   "t": "심화 — 오늘의 문제 식 만들기: y = 2 sin(2(x − π/4)) + 1 이 되도록 네 계수를 맞추고, 위상 이동이 그래프를 어떻게 미는지 확인하세요.",
   "re": "위상 이동 0\\.75",
   "do": "① a=2, b=2, d=1 ② c 를 0.75 로 ③ 기준 곡선과 어긋난 정도 관찰",
   "hand": "π/4 ≈ 0.785 임을 확인하고 c 값과 비교"
  }
 ],
 "118": [
  {
   "t": "1분 자유 탐색 — k 를 위아래로 움직여 보세요. 단위원의 파란 점과 곡선의 붉은 점은 어떻게 함께 움직이나요?"
  },
  {
   "t": "오늘의 문제 — k 를 0.5 로 맞추세요. 한 바퀴(0~360°) 안에 해가 몇 개이고 각각 몇 도인가요?",
   "re": "한 바퀴 안의 해: 30\\.0°",
   "do": "① k = 0.5 단추 ② 단위원의 두 점 확인 ③ 곡선에서 해의 개수 세기",
   "hand": "sin 30° = sin 150° = 0.5 임을 단위원 그림으로 확인"
  },
  {
   "t": "해가 하나뿐인 순간 — k 를 1 로 올려 보세요. 왜 한 바퀴에 해가 하나뿐인가요?",
   "re": "해가 한 바퀴에 하나뿐",
   "do": "① k = 1 단추 ② 단위원에서 점의 위치 확인 ③ 곡선의 꼭짓점과 대조",
   "hand": "sin 의 최댓값이 1 인 이유를 단위원의 반지름으로 설명"
  },
  {
   "t": "(k, 해 ①, 해 ②, 해의 개수) 표 다섯 줄 — 해가 두 개·한 개·없음으로 갈리는 경계를 찾으세요."
  },
  {
   "t": "심화 — 해가 없는 세상: 「k = 1 초과 시도」를 눌러 보세요. 왜 해가 없나요? 관람차 문제의 답(하루 동안 몇 번인지)을 주기로 계산하세요.",
   "re": "해가 없습니다",
   "do": "① k > 1 단추 ② 곡선과 가로선의 관계 확인 ③ 치역 −1 ≤ sin x ≤ 1 확인",
   "hand": "12분 주기라면 24시간에 몇 바퀴인지, 그때 해가 몇 번인지 계산"
  }
 ],
 "119": [
  {
   "t": "1분 자유 탐색 — a·b 를 움직여 보세요. 보라·초록 두 곡선과 파란 합은 어떤 사이인가요?"
  },
  {
   "t": "오늘의 문제 — a = 3, b = 4 로 맞추세요. 합쳐진 파동의 최댓값은 얼마인가요?",
   "re": "3·4·5 삼각형 등장",
   "do": "① a=3.0, b=4.0 ② R 값 읽기 ③ 최대·최소 점선의 자리 확인",
   "hand": "√(3²+4²) 을 계산해 R 과 대조"
  },
  {
   "t": "정말 사인 곡선일까 — 「합성 곡선 겹쳐 보기」를 눌러 보세요. 두 곡선이 완전히 겹치나요?",
   "re": "완전히 겹칩니다",
   "do": "① 겹쳐 보기 단추 ② 붉은 점선과 파란 곡선 비교 ③ a·b 를 바꿔도 겹치는지",
   "hand": "R sin(x+α) 를 전개해 a sin x + b cos x 와 같음을 손으로 보이기"
  },
  {
   "t": "(a, b, R, α, 최댓값) 표 여섯 줄 — R 과 a, b 의 관계를 찾으세요."
  },
  {
   "t": "심화 — 한쪽이 0이면: b 를 0 으로 두면 어떤 곡선이 되나요? a 와 b 를 모두 음수로 하면 위상 α 는 어떻게 되는지 확인하고, (a, b) 를 좌표로 보는 해석을 정리하세요."
  }
 ],
 "120": [
  {
   "t": "1분 자유 탐색 — 세 변을 움직여 보세요. 삼각형이 사라지는 순간이 있나요?"
  },
  {
   "t": "오늘의 문제 — 13, 14, 15 로 맞추세요. 밭의 넓이는 얼마인가요?",
   "re": "넓이가 정확히 84",
   "do": "① a=13, b=14, c=15 ② s 값 확인 ③ 넓이 읽기",
   "hand": "s = 21 을 구하고 √(21×8×7×6) 을 손으로 계산"
  },
  {
   "t": "다른 길로 검산 — 「½ab sin C 로 검산」을 눌러 보세요. 각을 쓰는 공식과 값이 같은가요?",
   "re": "헤론과 일치",
   "do": "① 검산 단추 ② 두 값 비교 ③ 다른 세 변에서도 반복",
   "hand": "코사인법칙으로 cos C 를 구한 뒤 sin C 를 계산해 넓이 확인"
  },
  {
   "t": "(a, b, c, s, 넓이) 표 다섯 줄 — 둘레가 같아도 넓이가 다른 짝을 찾으세요."
  },
  {
   "t": "심화 — 삼각형이 없는 조합: 가장 긴 변을 나머지 두 변의 합보다 크게 만들어 보세요. 헤론의 공식에서 근호 안이 어떻게 되는지 확인하고, 그 부호가 삼각부등식과 어떻게 이어지는지 설명하세요.",
   "re": "삼각부등식 위반",
   "do": "① a=3, b=4, c=20 처럼 설정 ② 화면 판정 확인 ③ s−c 의 부호 계산",
   "hand": "s − c < 0 이 되어 근호 안이 음수가 되는 과정을 쓰기"
  }
 ],
 "121": [
  {
   "t": "1분 자유 탐색 — 1배음만 올려 보세요. 사인 하나로는 각진 목표 파형을 흉내 낼 수 있나요?"
  },
  {
   "t": "홀수 배음 더하기 — 3·5·7 배음을 1/3, 1/5, 1/7 비율(대략 0.4 / 0.25 / 0.15)로 올려 오차를 0.25 아래로 낮추세요.",
   "re": "성분 분해 성공",
   "do": "① 1배음 1.15 ② 3배음 0.40 ③ 5배음 0.25, 7배음 0.15 로 조정하며 오차 관찰",
   "hand": "사각파의 계수 4/π × (1, 1/3, 1/5, 1/7) 을 계산해 슬라이더 값과 비교"
  },
  {
   "t": "모서리의 재료 — 배음 셋이 모두 살아 있는 상태를 만들고 파형의 모서리를 관찰하세요. 높은 배음을 0으로 내리면 무엇이 사라지나요?",
   "re": "홀수 배음 넷이 모두",
   "do": "① 세 배음 모두 0보다 크게 ② 파형의 각진 정도 확인 ③ 7배음만 0으로 내려 비교",
   "hand": "배음을 잘라낼 때 파형이 둥글어지는 이유를 한 줄로"
  },
  {
   "t": "(진폭 조합, 오차) 표 여섯 줄 — 목표에 가까워지는 규칙을 찾으세요."
  },
  {
   "t": "심화 — 스펙트럼 읽기: 목표를 톱니파로 바꿔 같은 실험을 하고, 사각파와 스펙트럼이 어떻게 다른지 비교하세요. MP3가 높은 배음을 버려 용량을 줄이는 원리와 이어 설명하세요."
  }
 ],
 "122": [
  {
   "t": "1분 자유 탐색 — 세 슬라이더를 움직여 보세요. 좌석 배치가 왜 사다리꼴이 되나요?"
  },
  {
   "t": "오늘의 문제 — 첫 줄 12석, 줄마다 2석 증가, 15줄로 맞추세요. 강당 전체는 몇 석인가요?",
   "re": "15줄이면 모두",
   "do": "① a₁ = 12 ② d = 2 ③ n = 15 로 맞추고 Sₙ 읽기",
   "hand": "끝 줄 좌석 12 + 14×2 = 40 을 구하고 15(12+40)/2 를 계산"
  },
  {
   "t": "모두 같은 줄 — 공차를 0 으로 내려 보세요. 사다리꼴이 어떤 모양으로 바뀌나요?",
   "re": "직사각형이 되었습니다",
   "do": "① d = 0 으로 ② 그림의 모양 확인 ③ Sₙ 이 n×a₁ 이 되는지 확인",
   "hand": "공차 0 인 수열의 합을 곱셈 하나로 쓰는 이유를 설명"
  },
  {
   "t": "(a₁, d, n, aₙ, Sₙ) 표 다섯 줄 — 첫 줄과 끝 줄의 평균이 전체 평균과 같은지 확인하세요."
  },
  {
   "t": "심화 — 뒤집어 겹치기: 좌석 배치를 뒤집어 원래 배치 위에 얹으면 모든 줄이 같아집니다. 이 그림으로 Sₙ = n(a₁+aₙ)/2 를 손으로 유도하고, 가우스의 방법(LAB 110)과 비교하세요."
  }
 ],
 "123": [
  {
   "t": "1분 자유 탐색 — 두 곡선을 보세요. 어느 쪽이 직선이고 어느 쪽이 휘나요?"
  },
  {
   "t": "오늘의 문제 — 시작 100만원, 등차 10만원, 등비 5%, 36개월로 맞추세요. 역전은 몇 개월째에 일어나나요?",
   "re": "개월째에 등비가 등차를",
   "do": "① 네 슬라이더를 문제 값으로 ② 붉은 점선의 위치 확인 ③ 36개월 뒤 두 금액 비교",
   "hand": "100×1.05ⁿ 와 100+10n 을 n=25, 27 에서 각각 계산해 역전 구간 확인"
  },
  {
   "t": "비율을 낮추면 — 등비 비율을 1%로 내려 보세요. 36개월 안에도 역전이 일어나나요?",
   "re": "×1\\.01ⁿ",
   "do": "① r = 1% ② 화면 판정 확인 ③ 개월 수를 늘려 언제 역전되는지 탐색",
   "hand": "역전 조건 a(1+r)ⁿ ≥ a + dn 을 부등식으로 쓰기"
  },
  {
   "t": "(d, r, 뒤집히는 달) 표 다섯 줄 — 비율이 커지면 그 시점은 어떻게 변하나요?"
  },
  {
   "t": "심화 — 지수는 왜 이기나: 등비 비율을 아무리 작게 해도(1%) 기간을 늘리면 결국 역전됨을 실험으로 확인하고, 그 이유를 두 일반항의 자라는 방식으로 논증하세요."
  }
 ],
 "124": [
  {
   "t": "1분 자유 탐색 — 막대를 눌러 값을 바꿔 보세요. 아래 꺾은선은 어떻게 반응하나요?"
  },
  {
   "t": "평평한 자료 — 「모두 같게(하루 5)」를 눌러 보세요. 누적선은 어떤 모양이 되나요?",
   "re": "누적합이 직선이 되었습니다",
   "do": "① 모두 같게 단추 ② 누적선 모양 확인 ③ 총합이 n×5 인지 확인",
   "hand": "Σc = nc 를 자료로 검증하고 직선의 기울기가 무엇인지 쓰기"
  },
  {
   "t": "일정하게 증가 — 「매일 2씩 증가」를 눌러 보세요. 이번엔 누적선이 어떻게 휘나요?",
   "re": "이차 곡선이 됩니다",
   "do": "① 매일 2씩 증가 단추 ② 누적선의 휘는 방향 확인 ③ 등차수열의 합과 연결",
   "hand": "등차수열의 합이 n 에 대한 이차식임을 일반항으로 확인"
  },
  {
   "t": "(자료 모양, 총합, 평균, 누적선 모양) 표 다섯 줄 — 막대와 누적선의 관계를 정리하세요."
  },
  {
   "t": "심화 — 시그마의 성질: 자료를 둘로 나눠 각각의 합을 구한 뒤 더한 값과, 자료를 먼저 더해 합을 구한 값이 같은지 확인하세요. Σ(aₖ+bₖ) = Σaₖ + Σbₖ 가 성립하는 이유를 쓰세요."
  }
 ],
 "125": [
  {
   "t": "1분 자유 탐색 — 「다음 항 만들기」를 눌러 보세요. 새 막대는 무엇을 보고 만들어지나요?"
  },
  {
   "t": "오늘의 문제 — 피보나치로 10항 이상 만들어 토끼 쌍의 수를 추적하세요. 이웃 항의 비는 어디로 가나요?",
   "re": "황금비 1\\.618",
   "do": "① 피보나치 확인 ② 10항 한 번에 ③ 이웃 비 값 읽기",
   "hand": "8/5, 13/8, 21/13 을 손으로 계산해 값이 다가가는 곳 확인"
  },
  {
   "t": "숨은 등비 — 점화식을 aₙ₊₁ = 2aₙ + 1 로 바꾸고 여러 항을 만드세요. 각 항에 1을 더하면 무엇이 보이나요?",
   "re": "등비가 숨어 있습니다",
   "do": "① 2aₙ+1 선택 ② 10항 한 번에 ③ 각 항 + 1 을 종이에 적어 비교",
   "hand": "aₙ + 1 이 등비수열임을 보이고 일반항을 구하기"
  },
  {
   "t": "(점화식, 처음 다섯 항, 자라는 속도) 표 네 줄 — 네 규칙을 모두 만들어 비교하세요."
  },
  {
   "t": "심화 — 점화식에서 일반항으로: 등차 점화식(aₙ₊₁ = aₙ + 3)의 일반항을 구하고, 점화식만으로는 「100번째 항」을 바로 알 수 없는 이유를 설명하세요. 재귀 알고리즘의 계산량과도 이어 보세요.",
   "re": "일반항 aₙ =",
   "do": "① 등차 점화식 선택 ② 여섯 항 이상 만들기 ③ 화면의 일반항 안내 확인",
   "hand": "a₁ 과 공차로 일반항을 세우고 n=100 을 대입"
  }
 ],
 "126": [
  {
   "t": "1분 자유 탐색 — 막대 높이가 왼쪽이 높고 오른쪽이 낮습니다. 왜 그럴까요?"
  },
  {
   "t": "오늘의 문제 — 매달 20만원, 연 3%, 12개월로 맞추세요. 만기 금액과 이자는 얼마인가요?",
   "re": "만기에 24[0-9]\\.\\d만원",
   "do": "① 세 슬라이더를 문제 값으로 ② 만기 금액·이자 읽기 ③ 첫 막대와 마지막 막대 비교",
   "hand": "20×((1.0025)¹² − 1)/0.0025 를 어림 계산해 화면과 대조"
  },
  {
   "t": "기간의 힘 — 기간만 24개월 이상으로 늘려 보세요. 이자 비중은 어떻게 변하나요?",
   "re": "이자 비중이 눈에 띄게",
   "do": "① 기간 24개월 이상 ② 이자 금액과 비율 기록 ③ 12개월과 비교",
   "hand": "두 경우의 (원금, 이자, 비율)을 표로 적고 몇 배인지 계산"
  },
  {
   "t": "(매달, 이자율, 기간, 만기, 이자) 표 다섯 줄 — 이자를 가장 크게 키우는 요인을 찾으세요."
  },
  {
   "t": "심화 — 대출과 짝: 적금(LAB 126)과 대출(LAB 109)의 식을 나란히 놓고, 둘 다 등비수열의 합에서 나오지만 방향이 반대인 이유를 설명하세요. 첫 달 돈이 가장 높은 막대인 까닭도 함께."
  }
 ],
 "127": [
  {
   "t": "1분 자유 탐색 — h 슬라이더를 줄여 보세요. 붉은 점과 초록 점이 어디로 다가가나요?"
  },
  {
   "t": "오늘의 문제 — 상황 ②(주차 요금 계단)를 고르고 h 를 최대한 줄이세요. 두 값이 만나나요?",
   "re": "이 점에서 극한은 없습니다",
   "do": "① 상황 ② 선택 ② h 슬라이더를 오른쪽 끝까지 ③ 붉은 값과 초록 값을 비교",
   "hand": "요금표를 식으로 쓰고 x = 2 의 양쪽 값을 각각 계산"
  },
  {
   "t": "구멍 뚫린 그래프 — 상황 ③ 을 고르세요. 다가가는 값은 있는데 그 점의 값은 어떤가요?",
   "re": "그런데 함숫값이 없는",
   "do": "① 상황 ③ 선택 ② f(2) 칸을 확인 ③ 좌·우 값이 같은지 확인",
   "hand": "(x²−4)/(x−2) 를 약분해 x = 2 만 빠지는 이유를 설명"
  },
  {
   "t": "(상황, 좌극한, 우극한, f(2)) 를 세 줄 기록하세요 — 극한과 함숫값이 다른 줄에 표시하세요."
  },
  {
   "t": "심화 — 세 조건으로 정리: 「f(a) 가 있다 / 극한이 있다 / 둘이 같다」 중 세 상황이 각각 무엇을 만족하는지 표로 만들고, 연속의 정의를 자기 말로 쓰세요."
  }
 ],
 "128": [
  {
   "t": "1분 자유 탐색 — 세 식을 바꿔 가며 표의 두 열이 어떤 수로 좁혀지는지 보세요."
  },
  {
   "t": "오늘의 문제 — 식 ②(x²−4)/(x−2) 를 고르세요. 양쪽에서 모이는 값은 얼마인가요?",
   "re": "양쪽에서 4 로 다가갑니다",
   "do": "① 식 ② 선택 ② x = 1.999 와 2.001 의 값 확인 ③ 「a 를 그대로 대입」 눌러 부정형 확인",
   "hand": "분자를 인수분해해 (x−2) 를 약분한 뒤 x = 2 를 대입"
  },
  {
   "t": "뿌리가 있는 식 — 식 ③ 을 고르고 「약분·유리화해 보기」를 누르세요. 어떤 방법을 썼나요?",
   "re": "켤레를 곱하기",
   "do": "① 식 ③ 선택 ② 약분·유리화 버튼 ③ 바뀐 식과 극한값 확인",
   "hand": "분자·분모에 (√(x+4) + 2) 를 곱해 x 를 약분"
  },
  {
   "t": "(식, a, 왼쪽 값, 오른쪽 값, 극한값) 을 세 줄 기록하세요."
  },
  {
   "t": "심화 — 부정형 만들기: 0/0 꼴이면서 극한이 각각 0, 1, ∞ 가 되는 식을 스스로 하나씩 만들고 표로 검증하세요. 「0/0 은 값이 정해지지 않는다」의 뜻이 분명해집니다."
  }
 ],
 "129": [
  {
   "t": "1분 자유 탐색 — 세 끊김을 차례로 보세요. 좌극한·우극한 칸이 어떻게 달라지나요?"
  },
  {
   "t": "오늘의 문제 — ②(구멍)를 고르세요. 값 하나를 채워 이을 수 있나요?",
   "re": "한 점만 고치면 이어집니다",
   "do": "① 끊김 ② 선택 ② 좌·우 극한이 같은지 확인 ③ 「그 점의 값을 고쳐 보기」 누르기",
   "hand": "제거 가능한 불연속의 조건을 극한과 함숫값으로 쓰기"
  },
  {
   "t": "고칠 수 없는 끊김 — ③(무한)을 고르세요. 왜 어떤 값으로도 이을 수 없나요?",
   "re": "값이 무한대로 치솟아",
   "do": "① 끊김 ③ 선택 ② 극한 칸 확인 ③ 고쳐 보기를 눌러 결과 읽기",
   "hand": "1/(x−2)² 에서 x → 2 일 때 값이 커지는 이유를 설명"
  },
  {
   "t": "(끊김, 좌극한, 우극한, 극한, 종류) 를 세 줄 기록하세요."
  },
  {
   "t": "심화 — 깨진 조건 찾기: 연속의 세 조건 중 각 끊김이 어느 것을 깼는지 표로 정리하고, 「극한이 있어야 고칠 수 있다」를 근거와 함께 한 문단으로 쓰세요."
  }
 ],
 "130": [
  {
   "t": "1분 자유 탐색 — a, b 를 움직여 양 끝 점의 색이 어떻게 바뀌는지 보세요."
  },
  {
   "t": "오늘의 문제 — 양 끝의 부호가 서로 다른 구간을 만드세요. (힌트: b 를 2 로)",
   "re": "근이 반드시 있습니다",
   "do": "① b 를 2 로 올리기 ② 두 점의 색이 다른지 확인 ③ 화면 판정 읽기",
   "hand": "f(1) 과 f(2) 를 손으로 계산해 부호를 확인"
  },
  {
   "t": "자릿수 확정 — 「반으로 자르기」를 8번 이상 누르세요. 근을 소수 둘째 자리까지 말할 수 있나요?",
   "re": "근 ≈ 1\\.3",
   "do": "① 반으로 자르기 반복 ② 구간 폭이 0.01 아래로 내려가는지 확인 ③ 중점 읽기",
   "hand": "폭이 매번 절반이 되므로 몇 번 잘라야 0.01 아래가 되는지 계산"
  },
  {
   "t": "(자른 횟수, a, b, 폭, 중점) 을 다섯 줄 기록하세요 — 폭은 어떤 규칙으로 줄어드나요?"
  },
  {
   "t": "심화 — 전제 검사: 사잇값 정리는 연속일 때만 성립합니다. 끊긴 함수에서 양 끝 부호가 달라도 근이 없는 예를 하나 만들고, 왜 반례가 되는지 설명하세요."
  }
 ],
 "131": [
  {
   "t": "1분 자유 탐색 — 구간과 함수를 바꿔 보세요. 끝점의 속 찬 점과 빈 점이 무엇을 뜻하나요?"
  },
  {
   "t": "오늘의 문제 — 구간을 ②(열린구간)로 바꾸세요. 가장 큰 값이 있나요?",
   "re": "도달하지 못함",
   "do": "① 구간 ② 선택 ② 오른쪽 끝점이 빈 점인지 확인 ③ 화면 판정 읽기",
   "hand": "x 를 4 에 가깝게 잡을 때마다 더 큰 값이 나오는 것을 수로 보이기"
  },
  {
   "t": "닫아도 안 되는 경우 — 구간은 ①(닫힘)으로 되돌리고 함수를 ④(끊김)로 바꾸세요.",
   "re": "끊긴 함수라",
   "do": "① 구간 ① ② 함수 ④ ③ x = 2 부근의 빈 점과 판정 확인",
   "hand": "왼쪽 조각에서 최댓값이 없는 이유를 극한으로 설명"
  },
  {
   "t": "네 조합(닫힘·열림 × 연속·끊김) 을 모두 만들어 최댓값 존재 여부를 표로 기록하세요."
  },
  {
   "t": "심화 — 최적화의 전제: 「종이 상자의 부피를 최대로」 같은 문제에서 정의역을 닫힌구간으로 잡는 이유를 이 실험의 결과로 설명하고, 끝점을 반드시 검사해야 하는 까닭을 쓰세요."
  }
 ],
 "132": [
  {
   "t": "1분 자유 탐색 — 간격 h 를 줄여 보세요. 붉은 직선과 초록 직선이 어떻게 되나요?"
  },
  {
   "t": "오늘의 문제 — ②(꺾인 그래프)를 고르고 h 를 최대한 줄이세요. 두 기울기가 하나로 모이나요?",
   "re": "만나지 않아 미분할 수 없습니다",
   "do": "① 그래프 ② 선택 ② h 슬라이더를 오른쪽 끝까지 ③ 왼쪽·오른쪽 값 비교",
   "hand": "|x| 의 좌·우 미분계수를 정의식으로 각각 계산"
  },
  {
   "t": "끊긴 자리 — ③(계단)을 고르세요. 기울기 값이 어떻게 되나요?",
   "re": "기울기가 무한히 커져",
   "do": "① 그래프 ③ 선택 ② h 를 줄이며 값의 변화 관찰 ③ 화면 판정 읽기",
   "hand": "끊긴 점에서 평균변화율이 발산하는 것을 식으로 보이기"
  },
  {
   "t": "(그래프, h, 왼쪽 기울기, 오른쪽 기울기, 미분 가능) 을 여섯 줄 기록하세요."
  },
  {
   "t": "심화 — 함의의 방향: 「미분 가능하면 연속」은 참이지만 역은 거짓입니다. ②가 바로 그 반례임을 근거를 들어 설명하고, AI 가 이 꺾인 점을 어떻게 다루는지(한쪽 기울기를 택함) 조사하세요."
  }
 ],
 "133": [
  {
   "t": "1분 자유 탐색 — 접점을 옮겨 보세요. 접선과 법선이 어떻게 함께 움직이나요?"
  },
  {
   "t": "오늘의 문제 — 접점을 x = 0 으로 옮기세요. 접선의 기울기와 법선은 어떻게 되나요?",
   "re": "접선이 수평",
   "do": "① 접점 x 를 0 으로 ② 접선의 기울기 확인 ③ 법선의 모습 확인",
   "hand": "f′(x) = 2ax 에 x = 0 을 대입해 기울기를 구하기"
  },
  {
   "t": "왼쪽으로 — 접점을 음수 쪽으로 옮기세요. 접선이 어느 쪽으로 기우나요?",
   "re": "접선이 내려가고",
   "do": "① 접점 x 를 −1 정도로 ② 접선의 방향 확인 ③ 법선의 기울기 부호 확인",
   "hand": "x < 0 에서 f′(x) 의 부호를 따져 접선의 방향을 예측"
  },
  {
   "t": "(x, f′(x), 법선 기울기, 곱) 을 다섯 줄 기록하세요 — 곱은 항상 얼마인가요?"
  },
  {
   "t": "심화 — 흔한 실수 잡기: 법선을 −f′(a) 로 잘못 두면 두 직선이 수직이 되지 않습니다. 반례를 하나 만들어 각도를 계산하고, 올바른 조건을 유도하세요."
  }
 ],
 "134": [
  {
   "t": "1분 자유 탐색 — b 를 움직여 보세요. 위 그래프와 아래 그래프가 어떻게 함께 변하나요?"
  },
  {
   "t": "오늘의 문제 — 「b 를 0 으로」를 누르세요. 봉우리와 골짜기가 어떻게 되나요?",
   "re": "봉우리도 골짜기도 없습니다",
   "do": "① b 를 0 으로 ② 아래 그래프가 축 아래로 내려가는지 확인 ③ 위 그래프의 모양 확인",
   "hand": "3x² + b = 0 의 실근 조건을 b 의 부호로 정리"
  },
  {
   "t": "되돌리기 — b 를 음수로 되돌리고 「극값 자리 표시」를 누르세요. 두 표시가 어디에 놓이나요?",
   "re": "표시된 두 자리에서",
   "do": "① b 를 −3 정도로 ② 극값 자리 표시 누르기 ③ 위·아래 표시의 x 좌표 비교",
   "hand": "f′ = 0 의 두 근을 구하고 각각에서 f 의 값을 계산"
  },
  {
   "t": "(b, f′=0 개수, 극댓값, 극솟값) 을 다섯 줄 기록하세요 — 경계가 되는 b 는 얼마인가요?"
  },
  {
   "t": "심화 — 반쪽 명제 고치기: 「f′(a) = 0 이면 x = a 에서 극값」은 거짓입니다. b = 0 을 반례로 들어 반박하고, 극값이 되기 위한 올바른 조건(부호가 바뀔 것)을 문장으로 쓰세요."
  }
 ],
 "135": [
  {
   "t": "1분 자유 탐색 — 잘라내는 길이 x 를 키워 보세요. 부피 그래프는 어떤 모양인가요?"
  },
  {
   "t": "오늘의 문제 — 30 × 30 종이에서 「부피가 최대인 x 로」를 누르세요. 몇 cm 를 잘라야 하나요?",
   "re": "최대 부피 지점",
   "do": "① 가로·세로가 30 인지 확인 ② 버튼 누르기 ③ 그때의 부피와 바닥 크기 읽기",
   "hand": "V(x) = x(30−2x)² 를 전개해 미분하고 V′(x) = 0 을 풀기"
  },
  {
   "t": "정의역의 끝 — 가로·세로를 20 으로 줄이고 x 를 10 으로 올리세요. 부피가 어떻게 되나요?",
   "re": "바닥이 사라져 부피가 0",
   "do": "① 가로 20, 세로 20 ② x 를 10 으로 ③ 화면 판정과 바닥 크기 확인",
   "hand": "정의역 0 < x < 10 의 양 끝에서 V 의 값을 계산"
  },
  {
   "t": "(가로, 세로, 최적 x, 최대 부피) 를 네 줄 기록하세요 — 정사각형일 때 x 와 한 변의 비는 얼마인가요?"
  },
  {
   "t": "심화 — 끝점 검사: 최댓값 후보는 f′ = 0 인 점과 정의역의 끝점입니다. 이 문제에서 끝점을 검사하면 왜 즉시 배제되는지 보이고, 끝점이 답이 되는 다른 상황을 하나 만들어 보세요."
  }
 ],
 "136": [
  {
   "t": "1분 자유 탐색 — 시각 t 를 움직여 보세요. 세 점이 어떻게 함께 움직이나요?"
  },
  {
   "t": "오늘의 문제 — ②(되돌아오는 운동)를 고르고 t 를 4 로 맞추세요. 그 순간 속도는 얼마인가요?",
   "re": "방향이 바뀌는 순간",
   "do": "① 운동 ② 선택 ② t = 4 ③ 위 그래프의 봉우리와 가운데 그래프의 0 을 확인",
   "hand": "v(t) = −t + 4 를 풀어 v = 0 인 시각을 구하기"
  },
  {
   "t": "되돌아오는 구간 — t 를 7 쯤으로 올리세요. 속도의 부호가 무엇을 말하나요?",
   "re": "되돌아오는 중입니다",
   "do": "① t 를 7 로 ② 속도 값의 부호 확인 ③ 위 그래프가 내려가는지 확인",
   "hand": "v(7) 을 계산하고 그 부호의 뜻을 문장으로 쓰기"
  },
  {
   "t": "(t, s, v, a) 를 여섯 줄 기록하세요 — 속도가 0 인 자리에서 위 그래프는 어떤 모양인가요?"
  },
  {
   "t": "심화 — 속력과 속도: 되돌아오는 구간에서 「크기만」 그리면 왕복이 사라집니다. 0 ≤ t ≤ 8 에서 이동 거리와 변위를 각각 구해 두 값이 다른 이유를 설명하세요."
  }
 ],
 "137": [
  {
   "t": "1분 자유 탐색 — 개수 n 을 늘려 보세요. 직사각형과 곡선의 틈이 어떻게 되나요?"
  },
  {
   "t": "오늘의 문제 — 높이를 가운데에서 재고 n 을 크게 키우세요. 오차를 0.001 아래로 만들 수 있나요?",
   "re": "참값 1/3 에 충분히",
   "do": "① 재는 위치를 「가운데」로 ② n 을 200 까지 ③ 오차 칸 확인",
   "hand": "Σk² = n(n+1)(2n+1)/6 을 이용해 왼쪽 합을 n 의 식으로 정리"
  },
  {
   "t": "적은 개수로도 — n 을 6 정도로 줄여 보세요. 가운데에서 재면 오차가 어떤가요?",
   "re": "위아래 오차가 서로 상쇄",
   "do": "① 재는 위치는 「가운데」 유지 ② n 을 6 으로 ③ 왼쪽·오른쪽과 오차 비교",
   "hand": "같은 n 에서 세 방식의 오차를 표로 비교"
  },
  {
   "t": "(n, 재는 위치, 합, 오차) 를 여섯 줄 기록하세요 — 오차는 n 에 어떻게 반비례하나요?"
  },
  {
   "t": "심화 — 정의로 돌아가기: 「어디서 재든 같은 값으로 모인다」가 정적분이 존재한다는 뜻입니다. 왼쪽 합과 오른쪽 합의 차이가 Δx 에 비례해 0 으로 감을 식으로 보이세요."
  }
 ],
 "138": [
  {
   "t": "1분 자유 탐색 — x 를 옮겨 보세요. 위의 파란 넓이와 아래 초록 점이 어떻게 함께 움직이나요?"
  },
  {
   "t": "오늘의 문제 — ②(f(t) = 2)를 고르세요. 높이가 일정할 때 넓이는 어떤 모양으로 자라나요?",
   "re": "넓이는 직선으로 자랍니다",
   "do": "① f(t) 를 ② 로 ② 아래 그래프의 모양 확인 ③ 기울기와 높이 값을 비교",
   "hand": "A(x) = 2x 를 직접 쓰고 미분해 2 가 되는지 확인"
  },
  {
   "t": "곡선으로 — ③(f(t) = t²)을 고르세요. 넓이 함수는 몇 차식이 되나요?",
   "re": "A\\(x\\) = x³/3",
   "do": "① f(t) 를 ③ 으로 ② 아래 그래프의 휘는 정도 확인 ③ 기울기와 높이 대조",
   "hand": "x³/3 을 미분해 x² 가 되는지 확인"
  },
  {
   "t": "(f(t), x, A(x), A 의 기울기, f(x)) 를 여섯 줄 기록하세요 — 두 값이 어긋나는 경우가 있나요?"
  },
  {
   "t": "심화 — 정리의 뜻: A(x+h) − A(x) 가 폭 h 인 얇은 띠의 넓이임을 그림으로 보이고, 이를 h 로 나누어 h → 0 으로 보내면 왜 f(x) 가 되는지 설명하세요."
  }
 ],
 "139": [
  {
   "t": "1분 자유 탐색 — 끝 시각을 옮겨 보세요. 파란 넓이와 붉은 넓이가 언제 생기나요?"
  },
  {
   "t": "오늘의 문제 — ②(왕복 운동)를 고르고 끝 시각을 6 으로 하세요. 변위와 이동 거리가 같은가요?",
   "re": "두 값이 갈라졌습니다",
   "do": "① 운동 ② 선택 ② 끝 시각 6 ③ 두 숫자를 비교",
   "hand": "v(t) = 4 − t 를 0~6 에서 적분하고, 부호를 살린 값과 절댓값을 각각 계산"
  },
  {
   "t": "잘못된 방법 — 「음수 구간도 그냥 더하기」를 켜 보세요. 어떤 값이 나오나요?",
   "re": "실제 위치 변화보다 크게",
   "do": "① 체크 상자 켜기 ② 나오는 값과 변위를 비교 ③ 어느 물음의 답인지 판단",
   "hand": "이동 거리와 변위가 각각 어떤 질문의 답인지 문장으로 정리"
  },
  {
   "t": "(끝 시각, 변위, 이동 거리, 차이) 를 다섯 줄 기록하세요 — 차이는 언제부터 생기나요?"
  },
  {
   "t": "심화 — 두 물음 가르기: 「지금 어디에 있나」와 「얼마나 움직였나」를 각각 어느 적분으로 구하는지 정리하고, 걸음 수 앱이 어느 쪽을 세는지 근거와 함께 답하세요."
  }
 ],
 "140": [
  {
   "t": "1분 자유 탐색 — 구간의 두 끝을 옮겨 보세요. 초록 영역과 붉은 영역이 언제 함께 나타나나요?"
  },
  {
   "t": "오늘의 문제 — 왼쪽 끝을 −1 로 내려 보세요. 두 계산 값이 어떻게 달라지나요?",
   "re": "상쇄가 일어났습니다",
   "do": "① 왼쪽 끝을 −1 로 ② 붉은 영역이 생기는지 확인 ③ 두 값의 차이 확인",
   "hand": "x² = ax 를 풀어 교점을 구하고 구간을 어디서 끊어야 하는지 정하기"
  },
  {
   "t": "끊어서 계산 — 「교점에서 나누어 계산」을 켜 보세요. 어떤 값을 얻나요?",
   "re": "교점에서 끊어 각각 계산하면",
   "do": "① 체크 상자 켜기 ② 얻어진 값과 실제 넓이 비교 ③ 왜 같아졌는지 확인",
   "hand": "두 구간의 적분을 따로 계산해 더하기"
  },
  {
   "t": "(a, 왼쪽, 오른쪽, 그냥 적분, 실제 넓이) 를 다섯 줄 기록하세요."
  },
  {
   "t": "심화 — 절댓값 다루기: ∫|f − g| dx 를 계산하는 절차를 세 단계로 정리하고(교점 찾기 → 부호 판정 → 구간별 적분), 교점이 세 개인 예를 하나 만들어 적용하세요."
  }
 ],
 "141": [
  {
   "t": "1분 자유 탐색 — 원판 개수를 늘려 보세요. 계단 모양이 어떻게 되나요?"
  },
  {
   "t": "오늘의 문제 — 원판 개수를 120 까지 올리세요. 원판 합이 정확한 값에 닿나요?",
   "re": "원판 합이 참값에 닿았습니다",
   "do": "① 원판 개수를 최대로 ② 합과 정확한 값 비교 ③ 오차 칸 확인",
   "hand": "V = π∫₀ʰ x² dx = πh³/3 을 계산해 화면 값과 대조"
  },
  {
   "t": "가장 단순한 그릇 — 반지름이 일정한 ③(원기둥)을 고르세요. 부피는 높이와 어떤 관계인가요?",
   "re": "부피가 높이에 정비례",
   "do": "① 단면 반지름을 ③ 으로 ② 높이를 바꾸며 부피 변화 관찰 ③ 식과 대조",
   "hand": "π·1²·h 가 원기둥의 부피 공식과 같은지 확인"
  },
  {
   "t": "(모양, 개수, 높이, 원판 합, 오차) 를 여섯 줄 기록하세요 — 높이를 두 배로 하면 부피는 몇 배인가요?"
  },
  {
   "t": "심화 — 제곱의 자리: V = π∫r² dx 에서 제곱을 먼저 하지 않고 반지름을 더한 뒤 제곱하면 어떤 값이 나오는지 손으로 계산해 비교하고, 왜 순서가 중요한지 설명하세요."
  }
 ]
};

/* ═══════════════ 문제 해결 수업 모형 엔진 ═══════════════
   탭④ 수행평가 예시의 STEP 구조를 실험실 안으로 가져온다. 한 실험실 = 한 차시.

     ① 문제   실생활 상황 제시 (구체 수치)                      5분
     ② 예상   가설을 손으로 쓴다 — 써야 다음이 열림              5분
     ③ 실험   직접 조작 + 미션 사다리 — STEP 2 이상 달성해야 진행 15분
     ④ 기록·발견  관찰표 3줄 이상 + 규칙을 손글씨로              10분
     ⑤ 원리   내 설명을 쓰고 나서 수식·유도 공개                 5분
     ⑥ 적용   새 문제 하나를 풀어야 통과 (형성평가)              5분
     ⑦ 정리   완주 확인 · 보고서 제출 · 확장 과제                 —

   단계는 순서대로만 열린다. 지나온 단계는 언제든 되돌아가 볼 수 있다. */

const PREDICT = {
 5:{id:'pg05', title:'드론으로 건물 높이 재기',
    lead:'드론을 건물에서 50 m 떨어진 곳에 세우고 꼭대기를 올려다본 각이 40° 였습니다.',
    q:['건물 높이를 <b>숫자로</b> 적으세요. 계산하지 말고 어림으로 좋습니다 — 몇 m 쯤일까요?',
       '그 수가 나온 <b>이유</b>를 적으세요. 50 m 와 40° 를 <b>어떤 식으로 이었는지</b>가 드러나야 합니다.',
       '각을 40° 에서 <b>60° 로 키우면</b> 높이는 몇 배쯤 될지 적으세요. 「2배」처럼 수로 적으세요.'],
    hint:'힌트 — 밑변과 높이를 이어 주는 삼각비는 셋 중 어느 것일까요? 각이 커지면 그 값은 어떻게 되나요?'},
 6:{id:'pg06', title:'산점도와 상관계수',
    lead:'공부 시간과 성적을 점으로 찍으면 오른쪽 위로 올라가는 모양이 됩니다.',
    q:['상관계수 r 이 가질 수 있는 <b>가장 큰 값과 가장 작은 값</b>을 적으세요.',
       '왜 그 범위를 벗어날 수 없는지 적으세요. 공분산을 <b>무엇으로 나누는지</b>가 드러나야 합니다.',
       '점 하나를 오른쪽 아래 멀리 옮기면 r 이 <b>커질지 작아질지</b> 적고, 그렇게 본 이유도 쓰세요.'],
    hint:'힌트 — r 은 「같이 움직이는 정도」를 두 자료의 흩어진 정도로 나눈 값입니다.'},
 7:{id:'pg07', title:'대푯값과 이상치',
    lead:'열 명 중 아홉 명은 3,000만 원대인데 사장 한 사람만 6억을 받는 회사가 있습니다.',
    q:['이 회사의 <b>평균</b>과 <b>중앙값</b>을 각각 어림해 적으세요. 두 수를 모두 적어야 합니다.',
       '둘 중 <b>어느 쪽이 이 회사를 더 잘 말해 주는지</b> 고르고, 왜 그런지 적으세요.',
       '사장 연봉만 6억에서 <b>12억으로 올리면</b> 평균과 중앙값이 각각 어떻게 변할지 적으세요.'],
    hint:'힌트 — 중앙값은 「몇 번째 사람인가」로 정해집니다. 그 사람의 연봉이 바뀌었나요?'},
 8:{id:'pg08', title:'비밀번호와 경우의 수',
    lead:'숫자 네 자리 비밀번호를 씁니다. 각 자리에는 0~9 를 쓸 수 있고 같은 숫자를 또 써도 됩니다.',
    q:['가능한 비밀번호가 <b>모두 몇 가지</b>인지 적으세요.',
       '그 수가 나온 <b>식</b>을 적으세요. 왜 더하기가 아니라 곱하기인지 한 줄로 쓰세요.',
       '자리를 <b>네 자리에서 여섯 자리로</b> 늘리면 몇 배가 되는지 적으세요.'],
    hint:'힌트 — 한 자리를 정할 때마다 앞의 선택과 상관없이 몇 가지가 열리나요?'},
 9:{id:'pg09', title:'뽑기 확률과 큰 수의 법칙',
    lead:'한 번 뽑을 때 나올 확률이 0.5% 인 아이템이 있습니다. 200번을 뽑습니다.',
    q:['<b>한 번이라도 나올 확률</b>을 어림해 적으세요. 「100%」인지 아닌지부터 정하세요.',
       '그 수를 어떻게 구했는지 적으세요. <b>여사건</b>을 쓴 식이 보이면 좋습니다.',
       '<b>2000번</b> 뽑으면 실제로 나온 비율이 몇 % 에 가까워질지 적으세요.'],
    hint:'힌트 — 「적어도 한 번」은 「한 번도 안 나온다」의 반대입니다.'},
10:{id:'pg10', title:'정규분포와 표준점수',
    lead:'두 시험 모두 78점을 받았습니다. 평균은 둘 다 70점인데, 표준편차가 하나는 5점, 하나는 25점입니다.',
    q:['<b>어느 시험의 78점이 더 잘한 것인지</b> 고르고, 두 시험의 z 값을 각각 어림해 적으세요.',
       '그렇게 고른 이유를 적으세요. 78 − 70 을 <b>무엇으로 나누는지</b>가 드러나야 합니다.',
       '표준편차를 <b>5에서 10으로</b> 바꾸면 z 가 어떻게 변할지 적으세요.'],
    hint:'힌트 — 같은 8점 차이라도, 반 전체가 촘촘히 모여 있으면 그 8점은 더 큰 차이입니다.'},
11:{id:'pg11', title:'복리와 72의 법칙',
    lead:'연 6% 로 100만 원을 넣어 둡니다. 이자에 다시 이자가 붙는 복리입니다.',
    q:['원금이 <b>두 배가 되는 데 몇 년</b> 걸릴지 적으세요.',
       '그 수를 어떻게 얻었는지 적으세요. <b>72 를 무엇으로 나눴는지</b>가 드러나야 합니다.',
       '단리로 넣으면 두 배까지 몇 년일지 적고, 복리와 <b>몇 년 차이인지</b>도 쓰세요.'],
    hint:'힌트 — 단리는 매년 같은 금액이 붙고, 복리는 매년 「그 시점의 잔액」에 붙습니다.'},
12:{id:'pg12', title:'로그 스케일',
    lead:'지진 규모는 7과 8이 한 칸 차이로 보이지만, 실제 에너지는 그렇지 않습니다.',
    q:['규모 7과 8의 <b>에너지가 몇 배</b> 차이인지 적으세요.',
       '왜 「1 차이」가 「1배 차이」가 아닌지 적으세요. <b>규모가 무엇의 로그인지</b>를 쓰세요.',
       '보통 눈금에서 <b>보이지 않던 작은 값들</b>이 로그 눈금에서는 어떻게 보일지 적으세요.'],
    hint:'힌트 — 눈금 한 칸이 「더하기」인 그래프와 「곱하기」인 그래프는 무엇이 다를까요?'},
13:{id:'pg13', title:'순간속도와 미분계수',
    lead:'단속 카메라는 자동차가 그 지점을 지나는 <b>한 순간</b>의 속도를 잽니다.',
    q:['한 순간의 속도를 재려면 <b>시간 간격을 얼마로</b> 두어야 할지 적으세요.',
       '왜 그렇게 두어야 하는지 적으세요. <b>평균속도와 순간속도의 차이</b>가 드러나야 합니다.',
       '간격을 0.5초 → 0.1초 → 0.02초로 줄이면 값이 <b>어디에 가까워지는지</b> 적으세요.'],
    hint:'힌트 — 두 점을 지나는 직선(할선)은 두 점이 가까워질수록 무엇에 가까워지나요?'},
14:{id:'pg14', title:'카드번호 검증기 (룬 알고리즘)',
    lead:'카드번호를 한 자리만 잘못 눌러도 결제창은 보내기도 전에 「번호가 틀렸다」고 알려 줍니다.',
    q:['<b>서버에 물어보지 않고</b> 어떻게 알 수 있는지, 방법을 한 줄로 적으세요.',
       '그 방법이 되려면 카드번호에 <b>어떤 성질</b>이 있어야 하는지 적으세요. 나머지·합동식으로 쓰면 좋습니다.',
       '한 자리를 <b>1만큼 바꿨을 때</b> 그 성질이 깨지는지 유지되는지 적고, 이유도 쓰세요.'],
    hint:'힌트 — 전체를 어떤 수로 나눈 나머지가 늘 0 이 되도록 마지막 한 자리를 정해 둔다면?'},
/* 2차 7종 (15~21) — AI 의 수학이 몰려 있는 구간이라 「예상 → 확인」이 특히 크게 남는다 */
15:{id:'pg15', title:'최소제곱 회귀',
    lead:'점들이 흩어져 있습니다. 이 사이로 「가장 알맞은 직선」을 하나 그으려 합니다.',
    q:['「가장 알맞다」를 <b>무엇으로 재야</b> 하는지 한 줄로 적으세요. 「눈으로 보기 좋게」는 답이 아닙니다.',
       '왜 거리를 그냥 더하지 않고 <b>제곱해서</b> 더하는지 적으세요. 부호를 근거로 쓰세요.',
       '점 하나를 <b>위로 멀리</b> 옮기면 직선이 얼마나 따라 올라갈지 적으세요. 「많이/조금」과 그 이유를 쓰세요.'],
    hint:'힌트 — 직선 위쪽 점과 아래쪽 점의 오차를 그냥 더하면 어떻게 될까요?'},
16:{id:'pg16', title:'경사하강법',
    lead:'컴퓨터는 골짜기의 가장 낮은 곳을 한 번에 알지 못합니다. 한 걸음씩 내려갑니다.',
    q:['지금 서 있는 자리에서 <b>어느 쪽으로</b> 발을 내디뎌야 할지 적으세요. 기울기의 부호로 쓰세요.',
       '한 걸음의 <b>보폭을 아주 크게</b> 하면 무슨 일이 생길지 적으세요. 골짜기 그림으로 설명하세요.',
       '가장 낮은 곳에 닿으면 기울기가 <b>얼마</b>가 되는지 적으세요.'],
    hint:'힌트 — 기울기가 양수인 자리에서 값을 줄이려면 x 를 늘려야 할까요, 줄여야 할까요?'},
17:{id:'pg17', title:'몬테카를로 π 추정',
    lead:'한 변이 1인 정사각형 안에 점을 마구 찍습니다. 사분원 안에 들어간 점을 셉니다.',
    q:['사분원 안에 들어갈 점의 <b>비율</b>을 적으세요. 소수로 어림해 적으면 됩니다.',
       '그 비율에 <b>무엇을 곱해야</b> π 가 되는지 적으세요. 넓이의 비로 설명하세요.',
       '점을 100개 찍을 때와 <b>10000개</b> 찍을 때 어느 쪽이 더 정확할지 적고, 이유도 쓰세요.'],
    hint:'힌트 — 점이 고르게 뿌려졌다면, 어떤 영역에 들어갈 확률은 그 영역의 넓이에 비례합니다.'},
18:{id:'pg18', title:'추천 알고리즘과 코사인 유사도',
    lead:'사람마다 「액션·로맨스·코미디」를 얼마나 좋아하는지를 화살표 하나로 나타냅니다.',
    q:['두 사람의 취향이 <b>얼마나 닮았는지</b>를 무엇으로 재면 좋을지 적으세요. 길이인가요, 각인가요?',
       '왜 그것을 골랐는지 적으세요. <b>영화를 많이 본 사람</b>이 무조건 1등이 되면 안 되는 이유를 쓰세요.',
       '완전히 같은 취향, 완전히 반대 취향일 때 그 값이 <b>각각 얼마</b>가 될지 적으세요.'],
    hint:'힌트 — 화살표를 두 배로 늘려도 「가리키는 방향」은 그대로입니다.'},
19:{id:'pg19', title:'이미지 필터와 합성곱',
    lead:'사진에서 윤곽선만 뽑아내려 합니다. 3×3 짜리 작은 표(커널)를 사진 위에 훑고 지나갑니다.',
    q:['윤곽선은 <b>어떤 자리</b>에서 나타나는지 적으세요. 밝기라는 말을 써서 쓰세요.',
       '그 자리를 찾으려면 3×3 표의 숫자 <b>합이 얼마</b>여야 하는지 적고, 왜 그런지 쓰세요.',
       '평평한 부분(밝기가 같은 곳)에 이 표를 대면 결과가 <b>얼마</b>가 될지 적으세요.'],
    hint:'힌트 — 윤곽선은 밝기가 갑자기 바뀌는 곳입니다. 「차이」를 계산하는 표는 합이 얼마일까요?'},
20:{id:'pg20', title:'소리와 삼각함수',
    lead:'피아노와 기타가 같은 「도」를 냅니다. 높이는 같은데 소리는 다르게 들립니다.',
    q:['두 소리의 <b>무엇이 같고 무엇이 다른지</b> 적으세요. 주기·진폭이라는 말을 쓰세요.',
       '악기마다 소리가 다른 이유를 적으세요. <b>배음</b>을 어떻게 하면 그렇게 되는지 쓰세요.',
       '기본음에 2배음·3배음을 더하면 파형 모양이 <b>어떻게</b> 바뀔지 말로 그려 보세요.'],
    hint:'힌트 — sin x 하나는 매끈합니다. 거기에 sin 2x, sin 3x 를 더하면 어떻게 될까요?'},
21:{id:'pg21', title:'y = x 대칭의 발견',
    lead:'y = 2x − 3 의 역함수를 구하고, 두 그래프를 한 좌표평면에 함께 그립니다.',
    q:['두 그래프가 <b>어떤 직선</b>에 대해 대칭일지 적으세요. 식으로 쓰세요.',
       '왜 그 직선인지 적으세요. 점 (a, b) 가 <b>어느 점</b>으로 옮겨 가는지를 근거로 쓰세요.',
       'y = x² 의 역함수를 그리면 <b>왜 문제가 생기는지</b> 적고, 어떻게 고쳐야 할지도 쓰세요.'],
    hint:'힌트 — 역함수는 x 와 y 의 역할을 맞바꾼 것입니다. 맞바꾸면 점은 어디로 갈까요?'
}};

/* 카탈로그의 「제작 완료」 카드가 부른다 — 번호만 주면 그 실험실이 열린다 */
const PROBLEMS={"1":{"sit":"구조 상황실 — 조난자의 휴대폰이 기지국까지의 거리를 알려 왔습니다: A까지 4.7 km, B까지 4.5 km, C까지 4.1 km (지도 1칸 = 1 km).","ask":"조난자는 지도 위 어디에 있을까? 기지국이 2곳뿐이라면 위치를 하나로 정할 수 있을까?"},"2":{"sit":"어제 온 문자 2통 — 「[Web발신] 무료 쿠폰 지급, 지금 클릭」은 스팸함으로, 「엄마: 무료할 때 전화해」는 정상함으로 갔습니다.","ask":"폰은 두 문자를 무슨 계산으로 갈랐을까? 「무료」가 든 엄마 문자는 왜 살아남았을까?"},"3":{"sit":"어떤 쇼츠 영상이 첫날 5천 뷰 → 3일 만에 4만 뷰가 되었습니다. 제작자는 \"일주일이면 100만\"이라고 주장합니다.","ask":"이 주장은 타당할까? 「며칠마다 2배」 규칙이면 언제 100만을 넘고, 그 성장은 언제까지 계속될 수 있을까?"},"4":{"sit":"A요금제: 기본 15,000원 + 분당 45원. B요금제: 기본 30,000원 + 분당 5원. 나는 한 달에 약 350분 통화합니다.","ask":"나는 어느 요금제가 유리할까? 몇 분부터 B가 이기게 될까?"},"5":{"sit":"우리 학교 본관까지 발걸음으로 50m. 그 자리에서 옥상 끝을 올려본 각이 40°였습니다 (내 눈높이 1.6m).","ask":"본관의 높이는 몇 m일까? 올라가 보지 않고 확실히 말할 수 있을까?"},"6":{"sit":"우리 반 12명의 하루 공부 시간과 수학 점수를 조사했더니 점들이 오른쪽 위로 흐릿하게 몰려 있습니다.","ask":"「공부 시간이 길수록 점수가 높다」— 이 흐릿한 경향을 숫자 하나로 잴 수 있을까?"},"7":{"sit":"구인 광고: 「평균 연봉 9,440만 원!」 — 입사해 보니 직원 9명은 3,200~4,600만 원, 사장만 6억이었습니다.","ask":"광고는 거짓말을 한 걸까? 「보통 직원」의 연봉을 대표하는 수는 무엇이어야 할까?"},"8":{"sit":"내 비밀번호는 숫자 4자리입니다. 해커 프로그램은 1초에 1억 개를 시도할 수 있다고 합니다.","ask":"내 비밀번호는 몇 초 만에 뚫릴까? 1000년 이상 버티게 만들려면 무엇을 바꿔야 할까?"},"9":{"sit":"뽑기 기계: 당첨 확률 0.5%. 친구가 \"200번 뽑으면 1번은 무조건 나오지\"라며 20만 원을 쓰려 합니다.","ask":"200번 뽑으면 정말 당첨될까? 「무조건」에 가까워지려면 몇 번이 필요할까?"},"10":{"sit":"수학·영어 두 시험 모두 78점. 반 평균은 둘 다 70점인데, 표준편차가 수학은 5점·영어는 25점입니다.","ask":"같은 78점인데 두 시험에서의 「내 위치」도 같을까? 어느 쪽이 더 대단한 점수일까?"},"11":{"sit":"세뱃돈 100만 원을 연 6% 복리 통장에 넣었습니다. 아빠는 \"12년이면 두 배\"라고 합니다.","ask":"정말 12년이면 두 배가 될까? 두 배 시점을 빨리 어림하는 방법이 있을까?"},"12":{"sit":"지진 규모 6·7·8 은 한 칸씩 차이지만, 방출 에너지는 대략 6만·200만·6300만 단위로 뜁니다. 막대그래프를 그리면 규모 6 이 아예 안 보입니다.","ask":"수만 배 차이 나는 값들을 한 그래프에 정직하게 담을 수 있을까? 눈금이란 무엇일까?"},"13":{"sit":"자율주행 시험차가 출발 t초 후 s(t) = 2t² + 3t (m) 지점을 지납니다. 구간단속 카메라가 잰 1초~3초 사이 평균속도는 11 m/s — 그런데 3초 순간의 속도계는 15 m/s를 가리켰습니다.","ask":"평균 11만 보고 「과속 아님」이라 말할 수 있을까? 순간의 속도는 어떻게 재는 걸까?"},"14":{"sit":"온라인 결제 중 카드번호를 한 자리 잘못 눌렀는데, 사이트가 결제 전에 「번호를 확인하세요」라고 즉시 알려 줍니다.","ask":"서버에 묻지도 않고 오타를 어떻게 알았을까? 카드번호 마지막 자리의 정체는?"},"15":{"sit":"카페 사장이 (기온, 아이스 판매량) 12일 치를 모았습니다. 내일 기온이 30°C라는 예보를 보고 재료를 준비하려 합니다.","ask":"점 12개로 내일 판매량을 예측하는 「가장 좋은 직선」은 어떻게 정할까?"},"16":{"sit":"안개 낀 골짜기에서 조난 — 보이는 건 발밑 경사뿐입니다. AI 도 이렇게 「기울기만 보고」 최적값을 찾는다고 합니다.","ask":"전체 지형을 못 보는데 가장 낮은 곳에 도착할 수 있을까? 보폭이 크면 무슨 일이 생길까?"},"17":{"sit":"원주율을 모른다고 상상합시다. 정사각형 안에 사분원을 그리고, 눈 감고 점을 마구 찍을 수 있습니다.","ask":"점 찍기만으로 π 를 몇 자리까지 알아낼 수 있을까? 점이 몇 개나 필요할까?"},"18":{"sit":"OTT 서비스가 나에게 「액션 9·로맨스 2」인 영화를 추천했습니다. 내 시청 기록은 액션 8·로맨스 3에 가깝습니다.","ask":"서비스는 나와 영화의 「취향 방향」을 무엇으로 비교했을까? 취향의 세기가 달라도 방향이 같으면 추천될까?"},"19":{"sit":"사진 앱의 「샤픈」 버튼 한 번에 흐릿한 글자가 또렷해졌습니다. 앱 속에는 3×3 숫자판 하나가 들어 있다고 합니다.","ask":"숫자 9개가 어떻게 사진을 바꾸는 걸까? 경계만 골라 강조하는 숫자판은 어떤 모양일까?"},"20":{"sit":"피아노와 기타가 같은 도(약 262Hz)를 냈는데 소리는 전혀 다릅니다. 파형을 보니 둘 다 1초에 262번 반복입니다.","ask":"높이가 같은데 음색은 왜 다를까? 파형의 무엇이 「악기다움」을 만들까?"},"21":{"sit":"y = 2x−3 은 「x를 넣으면 y가 나오는 기계」입니다. 거꾸로 y=7 이 나왔을 때 x 를 묻는 기계도 필요합니다.","ask":"거꾸로 기계의 그래프는 원래 기계와 어떤 관계일까? 아무 함수나 거꾸로 기계를 가질 수 있을까?"},"22":{"sit":"1/2 + 1/4 + 1/8 + 1/16 + … — 항은 끝없이 이어지는데 「합은 1」이라고 말합니다.","ask":"무한히 더하는데 합이 유한하다는 게 무슨 뜻일까? 어떤 무한합은 왜 터질까?"},"23":{"sit":"계산기에 sin 37° 를 누르면 0.6018… 이 즉시 나옵니다. 계산기 안에 삼각비 표가 통째로 들어 있는 걸까요?","ask":"계산기는 sin 을 무엇으로 계산할까? 다항식이 sin 을 흉내 낼 수 있을까?"},"24":{"sit":"와인잔에 물을 반쯤 따랐습니다. 잔의 옆모습 곡선은 알고 있지만 부피 공식은 없는 모양입니다.","ask":"공식이 없는 그릇의 부피를 어떻게 잴까? 「썰어서 더하기」는 얼마나 정확할까?"},"25":{"sit":"인터넷 결제의 자물쇠는 「83 × 89 = 7,387」은 클릭 두 번이면 끝나지만, 「7,387 = ? × ?」는 한참 걸린다는 사실 위에 서 있다고 합니다.","ask":"곱하기는 쉬운데 되돌리기는 왜 오래 걸릴까? 자릿수가 늘면 얼마나 더 힘들어질까?"},"26":{"sit":"새벽 기온 영하 5도. 낮에 8도 올랐다가 밤에 6도 내려갔습니다.","ask":"지금 기온은 몇 도일까? 「내려갔다」는 셈을 수직선 위의 움직임으로 그릴 수 있을까?"},"27":{"sit":"성냥개비로 정사각형을 한 줄로 이어 붙입니다: 1칸에 4개, 2칸에 7개, 3칸에 10개….","ask":"100칸이면 성냥개비가 몇 개 필요할까? 세지 않고 아는 방법이 있을까?"},"28":{"sit":"양팔저울 왼쪽에 「?가 든 주머니 2개와 3g 추」, 오른쪽에 「11g 추」 — 저울은 수평입니다.","ask":"주머니 하나의 무게를 알아내려면 저울에 어떤 조작까지 허용될까?"},"29":{"sit":"지렛대로 바위를 듭니다. 받침점에서 2 m 떨어진 곳을 누르면 힘 12가 필요했습니다. 4 m로 물러나 누르면 힘은 6이면 됩니다.","ask":"무게와 거리 사이에 어떤 거래가 성립할까? 곱일까, 합일까?"},"30":{"sit":"기찻길 두 레일은 평행인데, 사진 속에서는 한 점에서 만나 보입니다. 건널목의 비스듬한 차단기가 두 레일과 만드는 각이 보입니다.","ask":"평행선을 자르는 직선이 만드는 여덟 각 사이에는 어떤 약속이 있을까? 평행이 깨지면?"},"31":{"sit":"철탑·다리·자전거 프레임 — 큰 구조물은 온통 삼각형입니다. 사각형 프레임은 손으로도 찌그러집니다.","ask":"삼각형은 왜 안 찌그러질까? 세 변이 같으면 모양까지 같아질까?"},"32":{"sit":"하루 24시간 중 잠 8시간, 학교 7시간, 학원 3시간… 원그래프로 그리려니 「잠」 조각의 각도가 필요합니다.","ask":"8시간짜리 조각의 중심각은 몇 도여야 공정할까? 호의 길이·넓이도 같은 비율일까?"},"33":{"sit":"신발 가게 하루 판매: 250(1) 255(2) 260(5) 265(3) 270(1). 사장은 내일 「가장 잘 나갈 치수」를 더 들여놓으려 합니다.","ask":"사장에게 필요한 대푯값은 평균·중앙값·최빈값 중 무엇일까?"},"34":{"sit":"같은 키 자료로 A신문은 「고른 분포」, B신문은 「양극화!」 히스토그램을 실었습니다. 자료는 동일합니다.","ask":"같은 자료가 어떻게 다른 이야기를 하게 됐을까? 계급 폭은 어떻게 골라야 정직할까?"},"35":{"sit":"톱니 12개와 18개 두 기어가 맞물려 돕니다. 지금 맞닿은 두 이빨에 페인트 점을 찍었습니다.","ask":"두 점이 다시 만나는 것은 각각 몇 바퀴 돈 뒤일까? 두 수의 무엇이 그 답을 쥐고 있을까?"},"36":{"sit":"변 6cm·8cm·15cm 막대 세 개를 받았습니다. 목수는 보자마자 \"삼각형 안 나온다\"고 합니다.","ask":"만들어 보지 않고 어떻게 알았을까? 되는 세 변의 조건은 무엇일까?"},"37":{"sit":"화장실 바닥은 정사각형 타일, 벌집은 정육각형 — 그런데 정오각형 타일 바닥은 본 적이 없습니다.","ask":"정오각형은 왜 바닥이 되지 못할까? 빈틈없이 깔리는 정다각형의 조건은?"},"38":{"sit":"3D 프린터는 어떤 모양이든 얇은 층으로 썰어 쌓습니다. 축구공 같은 다면체에는 꼭짓점·모서리·면이 셀 수 있게 있습니다.","ask":"꼭짓점·모서리·면 사이에 모든 다면체가 지키는 약속이 있을까?"},"39":{"sit":"부피 1000cm³ 물건을 넣을 택배 상자를 주문 제작합니다. 종이값은 겉넓이에 비례합니다.","ask":"같은 부피인데 종이가 가장 적게 드는 상자는 어떤 모양일까?"},"40":{"sit":"우리 반 수학 점수 원자료가 필요한데, 히스토그램만 남아 있으면 「78점이 몇 명인지」는 알 수 없습니다.","ask":"자료를 정리하면서도 원래 값을 잃지 않는 그림이 있을까?"},"41":{"sit":"1반(28명)은 수학 90점 이상이 7명, 2반(35명)은 8명입니다. 2반 담임은 \"우리가 더 많다\"고 자랑합니다.","ask":"사람 수 비교는 공정할까? 크기가 다른 두 집단은 무엇으로 비교해야 할까?"},"42":{"sit":"전교생 800명의 등교 시간이 궁금하지만 전부 물을 수는 없습니다. 30명만 뽑아 물었더니 평균 25분이 나왔습니다.","ask":"30명의 답을 800명의 답이라고 말해도 될까? 뽑을 때마다 값이 다르면 어떡하지?"},"43":{"sit":"3x + 2 + 2x − 5 — 친구는 \"몽땅 더해서 2x\"라고 우깁니다.","ask":"식에서 「더해도 되는 것」과 「안 되는 것」의 경계는 무엇일까?"},"44":{"sit":"동생의 등굣길 그래프: 처음엔 가파르게, 중간에 수평, 다시 완만하게 올라 학교에 도착했습니다.","ask":"수평 구간에서 동생에게 무슨 일이 있었던 걸까? 그래프의 기울기는 무엇을 말할까?"},"45":{"sit":"한 변이 √2 인 정사각형과 √3 인 정사각형의 변을 이어 붙였습니다. 친구는 \"√5 막대와 같다\"고 합니다.","ask":"√2 + √3 = √5 일까? 자로 재지 않고도 판정할 수 있을까?"},"46":{"sit":"수직선 위에 「√2 의 정확한 위치」를 표시해야 합니다. 1.414는 어디까지나 반올림입니다.","ask":"무리수의 정확한 자리를 자와 컴퍼스만으로 짚을 수 있을까?"},"47":{"sit":"암산 대회 문제: 99×101. 옆 친구가 3초 만에 \"9999\"라고 외쳤습니다.","ask":"무슨 계산을 했길래 3초일까? 98×102, 95×105에도 통하는 기술일까?"},"48":{"sit":"y = x²−2x−3 의 그래프가 x축과 만나는 자리가 두 곳 보입니다. 눈대중으로는 −1과 3 근처입니다.","ask":"눈대중을 「정확한 값」으로 바꿔 주는 장치가 있을까?"},"49":{"sit":"게임 캐릭터가 포물선 y=x²−2x 궤적으로 점프합니다. 높이 k 에 수평 장애물이 있습니다.","ask":"부딪히는지(2번·1번·0번) 점프하기 전에 계산만으로 알 수 있을까?"},"50":{"sit":"x² + 6x = 7 — 인수분해가 바로 안 보입니다. 옛 수학자들은 이 식을 「타일 퍼즐」로 풀었다고 합니다.","ask":"기역자 타일을 정사각형으로 만들면 방정식이 풀린다는데, 무엇을 채워야 할까?"},"51":{"sit":"물로켓이 y=x² 포물선을 그리며 날았습니다. 다음 발사대는 오른쪽 3m, 위 2m 지점입니다.","ask":"같은 모양 포물선을 그 자리로 「배달」하는 식은 어떻게 쓸까? 괄호 안 부호는 왜 반대로 보일까?"},"52":{"sit":"울타리 재료가 딱 20m. 벽 없이 네 변을 모두 둘러 텃밭을 만듭니다.","ask":"가장 넓은 텃밭은 어떤 모양일까? 직사각형이면 충분할까?"},"53":{"sit":"가로 (a+b), 세로 (a+b)인 정사각형 땅을 네 구역으로 나눠 씁니다: 꽃밭 a², 채소밭 둘, 창고 b².","ask":"(a+b)² 을 전개한 식의 항 하나하나는 땅의 어느 조각일까? (a−b)² 은 어떤 그림이 될까?"},"54":{"sit":"삼각비 표를 보면 sin 30°=0.5 는 딱 떨어지는데 sin 31°=0.5150… 은 지저분합니다.","ask":"30°·45°·60° 만 값이 깔끔한 이유가 있을까? 그 값들은 어디서 태어났을까?"},"55":{"sit":"1594년 항해사는 계산기 없이 삼각비 표 한 장으로 배의 위치를 구했습니다. 표에는 5° 간격 값뿐입니다.","ask":"표에 없는 sin 37° 는 어떻게 구했을까? 이웃 값으로 어림하는 방법이 통할까?"},"56":{"sit":"축구장 골대를 정면·측면·대각선 어디서 봐도 「같은 각」으로 보이는 자리들이 있다고 코치가 말합니다.","ask":"그런 자리들이 정말 있을까? 있다면 어떤 도형을 이룰까?"},"57":{"sit":"통신위성이 고도를 높이면 지구의 더 넓은 면이 보입니다. 위성 회사는 \"3대면 전 지구 커버\"라고 광고합니다.","ask":"위성 하나는 지구의 몇 %까지 볼 수 있을까? 무한히 높이면 절반을 넘길 수 있을까?"},"58":{"sit":"네 유적지가 「같은 원형 성벽 위에 있었다」는 가설이 나왔습니다. 좌표만 남아 있습니다.","ask":"네 점이 한 원 위에 있는지 판정하는 시험이 있을까? 각도만으로 가능할까?"},"59":{"sit":"체력장 오래매달리기 기록(초): 12,14,15,16,17,18,18,19,20,21,22,24,26 — 한 명이 재측정에서 55초를 냈습니다.","ask":"55초는 「특별한 기록」일까 「의심스러운 기록」일까? 기준을 수로 정할 수 있을까?"},"60":{"sit":"「하루 수면시간과 성적」 조사에서 r=0.81 이 나왔는데, 기자가 자료에 축구선수(수면 10시간·성적 최하) 한 명을 추가했습니다.","ask":"한 명 때문에 결론이 뒤집힐 수 있을까? 그 한 명을 빼도 되는 걸까?"},"61":{"sit":"1부터 120까지에서 소수만 골라내야 합니다. 一一이 나눠 보기엔 너무 많습니다.","ask":"가장 적은 수고로 소수를 전부 남기는 방법은? 몇으로 거르는 것까지가 「필요한 일」일까?"},"62":{"sit":"두 기상캐스터의 5일 예보 오차: A는 +3,−3,+3,−3,0 / B는 +1,0,−1,+1,−1. 부호까지 더하면 둘 다 합계 0입니다.","ask":"합계 0이면 둘 다 만점일까? 실력 차이를 드러내는 공정한 채점은?"},"63":{"sit":"자판기 식 「2a」에 a=7 동전을 넣었더니 어떤 기계는 14를, 고장 기계는 27을 뱉었습니다.","ask":"고장 기계는 무엇을 잘못 읽었을까? 식의 「생략된 약속」은 무엇일까?"},"64":{"sit":"소금 20g에 물 180g을 부어 소금물 200g을 만들었습니다(농도 10%). 레시피는 5%를 요구합니다.","ask":"무엇을 얼마나 더하거나 빼야 정확히 5%가 될까? 물만 부으면 될까?"},"65":{"sit":"두 마을 A·B 사이에 공동 우물을 파려고 합니다 — 두 마을에서 정확히 같은 거리에.","ask":"같은 거리인 지점은 하나뿐일까? 그 지점들을 자와 컴퍼스로 찾을 수 있을까?"},"66":{"sit":"각도기 없이 케이크의 조각 각을 정확히 반으로 나눠야 합니다. 가진 것은 컴퍼스와 자뿐.","ask":"컴퍼스 몇 번이면 어떤 각이든 정확히 절반이 될까? 「정확히」를 어떻게 믿을까?"},"67":{"sit":"피자 반지름 12cm 조각의 호가 9cm입니다. 라벨에는 넓이가 없고, 원 전체 공식만 압니다.","ask":"조각(부채꼴)만의 넓이를 구하는 지름길이 있을까? 잘라 붙이면 무엇이 보일까?"},"68":{"sit":"주사위(정6), 4면체 주사위(d4), 20면체 주사위(d20)는 팔지만 「정7면체 주사위」는 어디에도 없습니다.","ask":"정다면체는 왜 다섯뿐일까? 일곱 번째를 만들 수는 없을까?"},"69":{"sit":"용돈 5,000원, 간식은 개당 800원. 계산대 앞에서 몇 개까지 담을지 정해야 합니다.","ask":"「살 수 있는 개수 전부」를 한 번에 표현할 수 있을까? 답이 하나가 아니라면?"},"70":{"sit":"새 학기 사물함 배정: 학번을 10으로 나눈 나머지 번호 방을 씁니다. 학번 23과 133은 같은 방입니다.","ask":"이 배정은 공평할까? 방 개수를 바꾸면 몰림이 생기거나 사라질까?"},"71":{"sit":"계산기에서 1/8 = 0.125 로 끝나는데 1/7 = 0.142857142857… 은 끝나지 않습니다.","ask":"끝나는 분수와 도는 분수의 갈림길은 분수의 어디에 있을까? 컴퓨터의 0.1+0.2≠0.3 과도 관련 있을까?"},"72":{"sit":"0.242424… 라는 무한소수를 친구는 \"분수로는 절대 못 쓴다\"고 합니다.","ask":"끝없는 소수를 유한한 분수로 붙잡을 수 있을까? 어떤 기술이 꼬리를 지울까?"},"73":{"sit":"두께 0.1mm 종이를 42번 접으면 달(38만 km)에 닿는다는 이야기가 있습니다.","ask":"믿기 힘든 이 주장, 계산으로 판정하면 참일까? 접기가 왜 이렇게 무서운 걸까?"},"74":{"sit":"용돈 협상: 「내 용돈 x는 동생의 2배 이상」— 양변에 −1을 곱해 정리하던 형이 갑자기 동생보다 적어졌습니다.","ask":"음수를 곱하면 부등호에 무슨 일이 일어날까? 등호와 무엇이 다를까?"},"75":{"sit":"문구점 A: 연필 2자루+지우개 1개 = 1,700원. 문구점 B의 전단: 연필 4자루+지우개 2개 = 3,400원.","ask":"두 정보로 연필값을 알아낼 수 있을까? 정보가 「두 개처럼 보이지만 하나」일 수도 있을까?"},"76":{"sit":"x+y=8, x−y=2 — 학원 형은 \"두 식을 그냥 더해 봐\"라고 힌트만 주고 갔습니다.","ask":"식끼리 더한다는 게 무슨 뜻일까? 더하면 왜 문제가 쉬워질까?"},"77":{"sit":"통신사 요금 그래프에서 「기본료 인상」과 「분당 요금 인상」은 직선을 다르게 움직인다고 합니다.","ask":"두 인상은 그래프에서 각각 어떤 운동일까? 서로 흉내 낼 수 있을까?"},"78":{"sit":"칠판의 식 y = (2/3)x + 1 — 선생님이 \"점 두 개면 끝\"이라며 분필 두 번으로 그래프를 그렸습니다.","ask":"어떤 두 점을 고르면 가장 빠르고 정확할까? 분수 기울기도 두 점으로 될까?"},"79":{"sit":"모둠 과제: 삼각형 합판을 손가락 하나로 수평 받치기. 아무 데나 받치면 기울어 떨어집니다.","ask":"받침점은 삼각형의 어디여야 할까? 그 점을 계산으로 찾을 수 있을까?"},"80":{"sit":"접이식 빨래건조대는 아무리 접었다 펴도 각 칸이 평행사변형을 유지합니다.","ask":"변형되는 내내 「평행사변형임」을 보증하는 조건은 무엇일까? 조건 하나면 충분할까?"},"81":{"sit":"1:25000 지도에서 학교와 집 사이가 4cm입니다. 내일 걸어가 볼 계획입니다.","ask":"실제 거리와 걸리는 시간은? 지도를 2배 확대 인쇄하면 축척은 어떻게 될까?"},"82":{"sit":"수업 시간에 빔프로젝터를 뒤로 밀었더니 화면이 훌쩍 커졌습니다.","ask":"거리와 화면 크기 사이의 규칙은? 프로젝터·그림자·바늘구멍 사진기는 같은 원리일까?"},"83":{"sit":"전자매장에서 「55인치」 TV를 재 보니 가로는 122cm뿐입니다. 55인치(140cm)가 아닌 것 같습니다.","ask":"55인치는 어디 길이일까? 가로·세로에서 대각선을 계산할 수 있을까?"},"84":{"sit":"공사장 목수가 줄자 하나로 「이 모서리 직각 맞네」라고 합니다. 각도기는 쓰지 않았습니다.","ask":"세 변 길이만으로 직각을 판정할 수 있을까? 직각이 아니면 무엇이 어긋날까?"},"85":{"sit":"고대 이집트 측량사는 매듭 12개짜리 밧줄로 완벽한 직각을 만들었습니다 — 3·4·5 간격이었다고 합니다.","ask":"세 변이 모두 자연수인 직각삼각형은 (3,4,5)뿐일까? 규칙적으로 더 찾을 수 있을까?"},"86":{"sit":"분식집 세트: 김밥 3종 중 하나 「그리고」 음료 2종 중 하나. 옆 가게는 김밥 3종 「또는」 라면 2종 중 하나만.","ask":"두 가게의 선택 가짓수는 각각 몇일까? 「그리고」와 「또는」은 셈을 어떻게 바꿀까?"},"87":{"sit":"2배 크기 피규어의 가격이 8배라 항의했더니, 사장님이 \"재료(부피)가 정말 8배\"라고 답했습니다.","ask":"길이 2배에 부피 8배 — 사실일까? 겉넓이(도색비)는 몇 배일까?"},"88":{"sit":"동전 3개를 던져 「적어도 하나 앞면」이면 이기는 게임 — 이길 확률을 묻자 친구는 8칸 표를 꺼냅니다.","ask":"8칸을 다 세는 것 말고 지름길이 있을까? 「적어도」의 반대말은 무엇일까?"},"89":{"sit":"룰렛에서 빨강이 5번 연속 나왔습니다. 옆 사람이 \"이제 검정 차례\"라며 판돈을 올립니다.","ask":"5연속 다음엔 정말 반대가 나올 「차례」일까? 동전·룰렛에게 기억이 있을까?"},"90":{"sit":"우리 반 24명 중 안경 5명. 「여학생 중에서」라고 조건을 붙이는 순간 분모가 달라진다고 합니다.","ask":"조건이 붙으면 확률의 무엇이 바뀔까? P(안경|여학생)과 P(여학생|안경)은 같을까?"},"91":{"sit":"트럼프에서 「하트(13장) 또는 그림카드(12장)」를 뽑을 확률 — 친구는 13+12=25장이라 우깁니다.","ask":"그냥 더한 25는 왜 틀릴까? 언제는 그냥 더해도 될까?"},"92":{"sit":"x³−2x²−5x+6 을 (x−1)로 나누라는 문제 — 세로셈은 지저분하고 시간도 오래 걸립니다.","ask":"계수 1,−2,−5,6 만 갖고 나눗셈을 끝내는 지름길이 있을까? 마지막 칸의 정체는?"},"93":{"sit":"f(x)=x³−4x²+x+6 을 (x−2)로 나눈 나머지가 급히 필요합니다. 나눌 시간은 없습니다.","ask":"나누지 않고 나머지를 아는 방법이 있을까? 나머지가 0이면 무엇을 얻을까?"},"94":{"sit":"게임 캐릭터를 시계 반대로 90° 돌리는 코드에 복소수 곱 「×i」 한 줄만 있다고 합니다.","ask":"수를 곱했는데 회전이 된다니 — i 는 평면에서 무슨 일을 하는 걸까?"},"95":{"sit":"문제: 「합이 5, 곱이 6인 두 수는?」 — 친구는 방정식도 안 세우고 \"2랑 3\"이라 답했습니다.","ask":"합·곱 정보만으로 두 수를 찾는 장치가 있을까? 계수와 근은 어떤 거래를 할까?"},"96":{"sit":"x³−3x+k=0 — k 값에 따라 해가 1개였다가 3개였다가 합니다.","ask":"몇 개인지 풀기 전에 알 수 있을까? 그래프의 산과 골짜기가 답을 쥐고 있을까?"},"97":{"sit":"놀이기구 안전 규정: 「탑승 게이지 x 가 x²−4x+3 < 0 을 만족하는 구간만 허용」이라 적혀 있습니다.","ask":"허용 구간은 어디부터 어디까지일까? 부등식의 해가 「구간」이 되는 이유는?"},"98":{"sit":"빵집 하루 생산: 오븐 한도 x+y≤6, 반죽 한도 x+2y≤8. 빵 이익 3, 케이크 이익 2입니다.","ask":"무엇을 몇 개 만들면 이익이 최대일까? 후보가 무한한데 다 따져야 할까?"},"99":{"sit":"학급 임원 선거(회장·부회장)와 청소 당번 짝 뽑기 — 둘 다 「4명 중 2명」이지만 느낌이 다릅니다.","ask":"두 뽑기의 가짓수는 같을까 다를까? 다르다면 정확히 몇 배 차이일까?"},"100":{"sit":"사진 앱의 「90° 회전」 버튼 뒤에는 숫자 4개짜리 표 [0 −1; 1 0] 하나가 있다고 합니다.","ask":"숫자 4개가 어떻게 사진 전체를 돌릴까? 내가 그 표를 직접 만들 수 있을까?"},"101":{"sit":"사진을 「회전 후 가로 늘리기」한 것과 「가로 늘리기 후 회전」한 것이 서로 다르게 나왔습니다.","ask":"같은 두 작업인데 순서만 바꿨는데 왜 다를까? 순서를 바꿔도 괜찮은 짝이 있을까?"},"102":{"sit":"책상 끝에 카드 4장 — 친구가 \"맨 위 카드를 통째로 책상 밖 허공에 띄울 수 있다\"고 내기를 겁니다.","ask":"받침 없이 허공에? 가능하다면 어떤 배치일까, 그리고 카드가 늘면 얼마나 더 나갈 수 있을까?"},"103":{"sit":"그림판에서 색을 고르니 코드 #4B96C8 이 떴습니다. 친구 폰에 이 색을 정확히 전달해야 합니다.","ask":"글자와 숫자가 섞인 이 코드의 정체는? 두 색을 「반씩 섞은」 색도 코드로 예측할 수 있을까?"},"104":{"sit":"색종이를 반으로 접어 2등분은 누구나 합니다. 그런데 3등분은? 게다가 「자와 컴퍼스로는 임의의 각을 3등분할 수 없다」가 수학의 오래된 정리입니다.","ask":"접기만으로 선분을 정확히 3등분·5등분할 수 있을까? 작도로 불가능한 각 3등분도 접기로는 가능할까?"},"105":{"sit":"새 마을로 매년 세대의 1/6 이 이주합니다. 지금 100세대가 살고, 손에는 주사위 100개가 있습니다 (1이 나오면 그 세대는 이주).","ask":"10년 뒤 몇 세대가 남을까? 10세대 이하로 줄어드는 해는 언제일까?"},"106":{"sit":"시험지에 sin 150° 를 구하라는 문제가 나왔습니다. 그런데 배운 것은 직각삼각형의 삼각비뿐 — 150°짜리 직각삼각형은 그릴 수 없습니다.","ask":"sin 150° 는 얼마일까? 90°를 넘는 각의 삼각비는 무엇으로 정의해야 할까?"},"107":{"sit":"대전의 일출 시각은 1월 7시 42분, 6월 5시 16분, 12월 7시 33분 — 1년을 주기로 물결칩니다.","ask":"열두 달의 일출을 식 하나로 쓸 수 있을까? 그 식으로 하지의 일출을 예측할 수 있을까?"},"108":{"sit":"강 건너 나무까지의 거리를 재야 합니다. 강은 건널 수 없고, 이쪽 기슭에서 잰 것은 기선 AB = 50 m 와 두 각 ∠A = 63°, ∠B = 55° 뿐입니다.","ask":"이 세 정보만으로 나무까지의 거리를 확정할 수 있을까?"},"109":{"sit":"학자금 1,200만 원을 연 6%로 빌려 24개월에 나눠 갚기로 했습니다. 은행 앱에는 「월 상환액」이 한 줄로 떠 있습니다.","ask":"이 금액은 어떤 계산에서 나왔을까? 기간을 늘리면 무엇이 이득이고 무엇이 손해일까?"},"110":{"sit":"초등학생 가우스는 「1부터 100까지 더하라」는 벌 문제를 몇 초 만에 5050 이라 답했다고 합니다.","ask":"하나씩 더하지 않고 답을 아는 방법은 무엇일까? 그 방법은 왜 늘 옳을까?"},"111":{"sit":"「모든 자연수 n 에 대하여 성립한다」를 증명해야 합니다. 그런데 자연수는 무한히 많아 하나씩 확인할 수가 없습니다.","ask":"무한히 많은 경우를 유한한 논증으로 덮으려면 무엇과 무엇을 보이면 될까?"},"112":{"sit":"연 6% 복리 통장에 목돈을 넣었습니다. 은행 앱은 「원금의 3배가 되면 알림」을 걸 수 있다고 합니다.","ask":"몇 해 뒤에 세 배가 될까? 지수 자리에 갇힌 x 를 어떻게 꺼낼 수 있을까?"},"113":{"sit":"계산기에는 log(상용로그) 단추만 있습니다. 그런데 문제는 log₂ 100 을 구하라고 합니다.","ask":"밑이 2인 로그를 밑 10짜리 계산기로 구할 수 있을까? 밑을 바꿔도 값은 그대로일까?"},"114":{"sit":"계산기에 log 0 을 넣으면 오류가 뜹니다. 음수를 넣어도 마찬가지입니다.","ask":"로그가 받아 주는 수는 왜 양수뿐일까? 지수함수와 로그함수는 어떤 사이일까?"},"115":{"sit":"2¹⁰⁰ 을 계산기에 넣으면 1.2676506e+30 처럼 뭉뚱그려 나옵니다. 정확한 값은 화면에 다 담기지도 않습니다.","ask":"이 수는 몇 자리일까? 맨 앞자리 숫자는 무엇일까?"},"116":{"sit":"식 y = 2^(x−3) + 2 의 그래프를 그리랬는데, 기준 곡선 y = 2^x 만 머리에 떠오릅니다.","ask":"괄호 안의 −3 과 뒤의 +2 는 그래프를 각각 어떻게 움직일까? 점근선은 어디로 갈까?"},"117":{"sit":"식 y = 2 sin(2x − π/2) + 1 의 그래프를 그리랬는데, 계수가 네 개나 붙어 있어 어디부터 손대야 할지 모르겠습니다.","ask":"네 계수는 각각 그래프의 무엇을 맡을까? 하나를 바꾸면 나머지도 흔들릴까?"},"118":{"sit":"관람차가 한 바퀴 도는 데 12분 걸립니다. 「높이가 정확히 절반인 순간」에 사진을 찍으려 합니다.","ask":"sin x = 0.5 를 만족하는 x 는 몇 개일까? 하루 종일 돌면 그런 순간은 몇 번 올까?"},"119":{"sit":"스피커 두 개가 같은 음을 내는데 하나는 sin, 하나는 cos 형태로 3 : 4 세기로 흔들립니다.","ask":"두 소리가 겹치면 얼마나 크게 들릴까? 합쳐진 파형도 여전히 사인 곡선일까?"},"120":{"sit":"땅 문서에는 삼각형 밭의 세 변 13 m, 14 m, 15 m 만 적혀 있습니다. 각도는 어디에도 없습니다.","ask":"각을 하나도 모르는데 넓이를 구할 수 있을까?"},"121":{"sit":"신시사이저의 사각파 소리는 사인파와 전혀 다르게 「각지게」 들립니다. 그런데 안에는 사인 발생기밖에 없다고 합니다.","ask":"각진 파형을 사인들만으로 만들 수 있을까? 어떤 비율로 섞어야 할까?"},"122":{"sit":"학교 강당의 첫 줄은 12석, 뒤로 갈수록 한 줄에 2석씩 늘어납니다. 모두 15줄입니다.","ask":"강당 전체 좌석은 몇 석일까? 한 줄씩 세지 않고 알 수 있을까?"},"123":{"sit":"저축 방식 둘 — A는 매달 10만원씩 더하고, B는 매달 5%씩 불립니다. 시작은 둘 다 100만원이고, 3년(36개월)을 봅니다.","ask":"지금은 A가 앞서는데, 3년 안에 B가 이길까? 이긴다면 몇 개월째일까?"},"124":{"sit":"학급 봉사 시간을 매일 기록했더니 막대그래프가 들쭉날쭉합니다. 담임은 「지금까지 총 몇 시간인지」를 묻습니다.","ask":"매일의 값에서 누적 총합으로 어떻게 넘어갈까? 누적선의 기울기는 무엇을 뜻할까?"},"125":{"sit":"토끼 한 쌍이 매달 새끼 한 쌍을 낳고, 태어난 쌍도 두 달 뒤부터 낳습니다. (피보나치의 토끼 문제)","ask":"몇 달 뒤 토끼는 몇 쌍이 될까? 다음 달 수를 지금 수로 말할 수 있을까?"},"126":{"sit":"매달 20만원씩 12개월 동안 연 3% 적금에 넣기로 했습니다. 은행은 「만기 금액」을 한 줄로 알려 줍니다.","ask":"같은 20만원인데 왜 첫 달과 마지막 달의 값이 다를까? 만기 금액은 어떻게 계산될까?"},"127":{"sit":"주차장 요금은 1시간마다 2000원씩 올라갑니다. 1시간 59분에 나가면 4000원, 2시간 1분에 나가면 6000원입니다.","ask":"2시간에 한없이 가까이 다가가면 요금은 얼마에 가까워질까? 왼쪽에서 갈 때와 오른쪽에서 갈 때가 같을까?"},"128":{"sit":"(x²−4)/(x−2) 에 x = 2 를 넣었더니 계산기가 오류를 냅니다. 그런데 x = 1.999 나 2.001 을 넣으면 값이 잘 나옵니다.","ask":"x 를 2 에 한없이 가까이 하면 값은 어디로 모일까? 그리고 왜 대입만으로는 알 수 없을까?"},"129":{"sit":"센서가 기록한 그래프 세 개가 모두 x = 2 에서 끊겨 있습니다. 담당자는 \"값 하나만 채우면 되지 않냐\"고 합니다.","ask":"세 끊김 중 값 하나를 채워 이을 수 있는 것은 무엇일까? 나머지는 왜 안 될까?"},"130":{"sit":"x³ − x − 1 = 0 의 근을 구하려는데 인수분해가 되지 않습니다. 계산기도 정확한 식을 주지 못합니다.","ask":"근이 어느 구간에 있는지 부호만으로 알아내고, 소수 둘째 자리까지 좁힐 수 있을까?"},"131":{"sit":"\"0 < x < 4 에서 가장 큰 값을 찾아라\"는 문제를 풀던 학생이 \"가장 큰 값이 없다\"며 손을 듭니다.","ask":"왜 최댓값이 없을까? 어떤 조건을 붙여야 가장 큰 값이 반드시 있다고 말할 수 있을까?"},"132":{"sit":"AI 가 쓰는 ReLU 함수는 y = |x| 처럼 원점에서 뾰족하게 꺾여 있습니다. 학습은 기울기로 하는데, 그 점의 기울기가 문제입니다.","ask":"이어져 있는데도 기울기를 하나로 정할 수 없는 점이 있을까? 있다면 왜 그럴까?"},"133":{"sit":"3D 그래픽에서 빛이 어떻게 반사될지는 표면이 바라보는 방향, 곧 법선으로 정합니다.","ask":"곡선 위 한 점에서 접선과 법선의 기울기는 각각 얼마일까? 둘은 어떤 관계일까?"},"134":{"sit":"롤러코스터 설계도가 y = x³ + bx 꼴입니다. b 를 바꾸면 봉우리와 골짜기가 생겼다 사라집니다.","ask":"b 가 어떤 값일 때 봉우리와 골짜기가 사라질까? 그 경계는 어디일까?"},"135":{"sit":"30cm × 30cm 도화지의 네 모서리를 정사각형으로 잘라 접어 뚜껑 없는 상자를 만듭니다.","ask":"몇 cm 를 잘라야 부피가 가장 클까? 많이 자를수록 좋을까?"},"136":{"sit":"엘리베이터의 위치를 초마다 기록했습니다. 관리자는 \"언제 가장 빨랐고 언제 방향이 바뀌었나\"를 묻습니다.","ask":"위치 그래프만 보고 속도와 가속도를 읽을 수 있을까? 되돌아서는 지점은 그래프에서 어떻게 드러날까?"},"137":{"sit":"y = x² 아래, 0 부터 1 까지의 넓이를 구하려는데 삼각형도 사각형도 아닙니다.","ask":"직사각형을 쌓아 재면 얼마나 정확할까? 개수를 늘리면 어디로 모일까?"},"138":{"sit":"어떤 학생이 \"적분은 미분의 반대\"라고 외웠습니다. 왜 반대인지는 설명하지 못합니다.","ask":"0 부터 x 까지의 넓이를 함수로 보면, 그 함수의 기울기는 무엇일까?"},"139":{"sit":"드론의 속도를 초마다 기록했습니다. 중간에 방향을 바꿔 돌아왔습니다.","ask":"지금 출발점에서 얼마나 떨어져 있을까? 그리고 총 몇 m 를 날았을까? 두 답은 같을까?"},"140":{"sit":"y = x² 와 y = ax 사이의 넓이를 구하라는 문제에서, 한 번에 적분한 학생의 답이 너무 작게 나왔습니다.","ask":"왜 작게 나왔을까? 구간의 어디를 어떻게 처리해야 할까?"},"141":{"sit":"도자기 그릇의 단면 곡선을 알고 있습니다. 이 그릇에 물이 얼마나 들어갈지 알고 싶습니다.","ask":"곡선을 돌려 만든 입체의 부피를 어떻게 잴까? 얇게 자르면 무엇이 보일까?"}};

function openLab(i){ if(LABS[i]) open(LABS[i], i); }

function open(L,i){
  $('#mTitle').textContent=`LAB ${String(i+1).padStart(2,'0')} · ${L.t}`;
  $('#mQ').textContent=L.q;
  const P=PRINS[i];
  /* LAB 05 부터는 원리를 잠근다 — 학생이 자기 말로 먼저 쓰고 나서 연다 */
  const lock = i>=4 && P;
  const prinHTML = (P ? `
    <div class="prin">
      <div class="prinhead"><span class="prinbadge">수학 원리</span><span class="prineq">${texToMathML(P.tex&&P.tex.length?P.tex[P.tex.length-1].t:'',false)}</span></div>
      ${texSteps(P.tex)}
      <div class="pring">
        <div class="prc"><div class="prct">이 실험의 수학은 무엇인가</div><p>${P.what}</p></div>
        <div class="prc probe"><div class="prct">무엇을 만지면 원리가 드러나는가</div><p>${P.probe}</p></div>
        <div class="prc link"><div class="prct">수업의 어느 장면으로 잇는가</div><p>${P.link}</p></div>
      </div>
      ${P.next && P.next.length ? `
      <div class="nxt">
        <div class="nxth">이 활동 다음에 — 학생이 이어서 할 탐구</div>
        ${P.next.map(x=>`
          <div class="nxi ${x.lv==='바로'?'l1':x.lv==='심화'?'l2':'l3'}">
            <span class="nxl">${x.lv}</span>
            <div><b>${x.t}</b><p>${x.d}</p></div>
          </div>`).join('')}
      </div>` : ''}
    </div>` : '');
  $('#mNote').innerHTML = (lock ? `
    <div class="plock" id="plock">
      <div class="plkh"><span class="pgstep">잠긴 원리</span>
        <b>공식을 보기 전에 — 이 실험에서 발견한 규칙을 네 말과 식으로 쓰세요</b></div>
      <div class="plkpad" id="plkPad"></div>
      <div class="pgbar">
        <button class="b t" id="plkGo" disabled>수식·풀이 열기 — 먼저 써야 열립니다</button>
        <span class="pgn" id="plkN">아직 쓴 것이 없습니다</span>
      </div>
    </div>
    <div id="plkBody" style="display:none">
      <p class="plkcmp">⇵ 위에 남은 <b>내 설명</b>과 아래 <b>교과서의 설명</b>을 나란히 견줘 보세요 — 같은 말을 하고 있나요?</p>
      ${prinHTML}
    </div>` : prinHTML)
    + `<details style='margin-top:10px'><summary style='cursor:pointer;color:#6B7280;font-size:12.5px'>👩‍🏫 교사용 수업 포인트 (학생은 먼저 탐구부터!)</summary><div style='margin-top:6px'><b>수업 포인트</b> — ${L.note}<br><br><b>수학</b> ${L.m.join(' · ')} &nbsp;|&nbsp; <b>AI 연계</b> ${L.a.join(' · ')}</div></details>`;
  if(lock){
    const pad=writePad($('#plkPad'), L.t+' — 내가 설명한 원리');
    const go=$('#plkGo'), nte=$('#plkN');
    const chk=()=>{ const ok=pad&&pad.hasInk();
      go.disabled=!ok;
      go.textContent=ok?'다 썼습니다 · 수식·풀이 열기':'수식·풀이 열기 — 먼저 써야 열립니다';
      nte.textContent=ok?'이제 열 수 있습니다':'아직 쓴 것이 없습니다'; };
    if(pad&&pad.onInk) pad.onInk(chk); chk();
    go.onclick=()=>{ $('#plkBody').style.display='block';
      go.disabled=true; go.textContent='열림 — 아래에서 견줘 보세요';
      $('#plkBody').scrollIntoView({behavior:'smooth',block:'start'}); };
  }
  $('#mBody').innerHTML='';
  L.build($('#mBody'));
  // 탐구 사다리 — 단계마다 절차·손계산 과제가 붙는다
  if(typeof MISSIONS!=='undefined' && MISSIONS[i+1]) stepLadder($('#mBody'), MISSIONS[i+1]);
  // 예상 메모판 — 실험을 막지 않는다. 실험하면서 적는다.
  const PBX = typeof PROBLEMS!=='undefined' && PROBLEMS[i+1];
  const PRq = (typeof PREDICT!=='undefined' && PREDICT[i+1] && PREDICT[i+1].q) ||
    ['이 문제의 답을 예상해 적어 두세요 (수·식·그림 무엇이든).','실험 중 확인할 것 한 가지를 정해 적으세요.'];
  { const memo=document.createElement('details'); memo.className='pgmemo';
    memo.innerHTML='<summary>✍ 내 예상 메모판 — 실험하면서 적어 두세요 (펼치기)</summary>'
      +'<ol>'+PRq.map(q=>'<li>'+q+'</li>').join('')+'</ol><div class="pgmpad" id="pgmPad"></div>';
    $('#mBody').prepend(memo);
    memo.addEventListener('toggle',()=>{ if(memo.open && !memo.dataset.init){ memo.dataset.init='1';
      try{ writePad($('#pgmPad'), L.t+' — 내 예상'); }catch(e){} } });
  }
  // 오늘의 문제 — 게이트가 덮어도 항상 보이는 맨 위 카드
  if(PBX){ const pd=document.createElement('div'); pd.className='probx';
    pd.innerHTML='<div class="probh">📌 오늘의 문제</div><p class="probs">'+PBX.sit+'</p><p class="probq">'+PBX.ask+'</p>';
    $('#mBody').prepend(pd); }
  $('#mask').classList.add('on');
}
$('#mX').onclick=()=>{$('#mask').classList.remove('on');audioStop();};
$('#mask').onclick=e=>{if(e.target.id==='mask'){$('#mask').classList.remove('on');audioStop();}};

/* ---------- LAB 1 GPS ---------- */
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

/* ---------- LAB 2 BAYES ---------- */
function bayesDemo(root){
  const W={'무료':0.92,'당첨':0.95,'클릭':0.88,'쿠폰':0.90,'대출':0.90,'광고':0.85,
           '엄마':0.03,'회의':0.10,'과제':0.08,'전화':0.30,'감사':0.15,'내일':0.25};
  root.innerHTML=`<div class="row"><div class="col">
    <label class="ctl">문자 내용을 입력하세요</label>
    <textarea id="bt" rows="3"></textarea>
    <div class="btns">
      <button class="b" id="bgo">스팸 확률 계산</button>
      <button class="b g" id="bq1" data-s="[Web발신] 무료 쿠폰 지급, 지금 클릭">문자① 불러오기</button>
      <button class="b g" id="bq2" data-s="엄마 : 무료할 때 전화해">문자② 불러오기</button>
    </div>
    <div class="out" id="bout"></div></div>
    <div class="col"><label class="ctl">단어별 P(스팸 | 단어) 사전</label>
    <table class="t"><tr><th>단어</th><th>P</th><th>단어</th><th>P</th></tr>
    ${Object.keys(W).reduce((a,k,i)=>{const v=W[k];
      return a+(i%2===0?`<tr><td>${k}</td><td>${v}</td>`:`<td>${k}</td><td>${v}</td></tr>`);},'')}</table>
    <div class="note">이 확률은 지금까지 받은 문자 수만 통에서 학습된 값입니다. 0.5보다 크면 스팸 쪽 증거, 작으면 정상 쪽 증거.</div>
    </div></div>`;
  function calc(){
    const s=$('#bt').value.trim();
    if(!s){$('#bout').innerHTML='문자를 입력하거나, 버튼으로 오늘의 문제의 두 문자를 불러오세요.';return;}
    const hits=Object.keys(W).filter(k=>s.includes(k));
    if(!hits.length){$('#bout').innerHTML=`판정 대상: 「${s}」<br>사전에 있는 단어가 없습니다 — 분류기는 판단 불능. 표의 단어를 넣어 보세요.`;return;}
    let num=1,den=1;
    hits.forEach(k=>{num*=W[k];den*=(1-W[k]);});
    const p=num/(num+den);
    const bar=Math.round(p*100);
    const rows=hits.map(k=>`<tr><td>${k}</td><td class="mono">${W[k].toFixed(2)}</td><td>${W[k]>0.5?'스팸 쪽 ↑':'정상 쪽 ↓'}</td></tr>`).join('');
    $('#bout').innerHTML=`판정 대상: 「${s}」
      <table class="t" style="margin-top:6px"><tr><th>발견 단어</th><th>P(스팸|단어)</th><th>증거 방향</th></tr>${rows}</table>
      <span class="mono">P(스팸|문자) = Πp / (Πp + Π(1−p)) = ${num.toFixed(4)} / (${num.toFixed(4)} + ${den.toFixed(4)})</span>
      <div style="margin-top:10px;height:22px;border-radius:6px;background:#F3F4F6;overflow:hidden">
        <div style="height:100%;width:${bar}%;background:${p>0.8?'#BE123C':p>0.5?'#B45309':'#0E9384'}"></div></div>
      <div style="margin-top:6px;font-size:17px;font-weight:800;color:${p>0.8?'#BE123C':p>0.5?'#B45309':'#0E9384'}">
        스팸 확률 ${bar}% → ${p>0.8?'스팸함으로 이동':p>0.5?'주의 표시':'정상 수신함'}</div>`;
  }
  $('#bgo').onclick=calc;
  root.querySelectorAll('[data-s]').forEach(b=>b.onclick=()=>{$('#bt').value=b.dataset.s;calc();});
  calc();
}

/* ---------- LAB 3 SPREAD ---------- */
function spreadDemo(root){
  root.innerHTML=`<div class="row"><div class="col"><canvas id="s1" width="380" height="300"></canvas>
  <div class="note">🔴 3일째 실측 4만 뷰 — 곡선이 이 점을 지나야 믿을 수 있는 모형입니다.</div></div>
  <div class="col">${slider('sr','증가율 r (하루)',0.05,1,0.05,0.35,'')}
  ${slider('sk','포화 한계 K (만 뷰)',20,100,5,60,'')}
  ${slider('sn','초기값 N₀ (만 뷰)',0.1,5,0.1,0.5,'')}
  <div class="out" id="sout"></div></div></div>`;
  const cv=$('#s1'),ctx=cv.getContext('2d'),W=380,H=300,P=30;
  function draw(){
    const r=+$('#sr').value,K=+$('#sk').value,N0=+$('#sn').value;
    $('#srv').textContent=r.toFixed(2);$('#skv').textContent=K;$('#snv').textContent=N0.toFixed(1);
    axes(ctx,W,H,P);
    const T=14,ymax=K*1.15;
    const px=t=>P+(W-2*P)*t/T, py=v=>H-P-(H-2*P)*Math.min(v,ymax)/ymax;
    ctx.strokeStyle='#9CA3AF';ctx.setLineDash([4,4]);ctx.lineWidth=1.6;ctx.beginPath();
    for(let t=0;t<=T;t+=.5){const v=N0+r*K*0.12*t;ctx.lineTo(px(t),py(v));}ctx.stroke();ctx.setLineDash([]);
    ctx.strokeStyle='#B45309';ctx.lineWidth=2;ctx.beginPath();
    for(let t=0;t<=T;t+=.25){const v=N0*Math.pow(1+r,t);if(v>ymax*1.2)break;ctx.lineTo(px(t),py(v));}ctx.stroke();
    ctx.strokeStyle='#2563EB';ctx.lineWidth=2.6;ctx.beginPath();
    for(let t=0;t<=T;t+=.25){const v=K/(1+((K-N0)/N0)*Math.exp(-r*t));ctx.lineTo(px(t),py(v));}ctx.stroke();
    ctx.strokeStyle='#E5E7EB';ctx.setLineDash([2,3]);ctx.beginPath();ctx.moveTo(P,py(K));ctx.lineTo(W-P,py(K));ctx.stroke();ctx.setLineDash([]);
    ctx.strokeStyle='#7C3AED';ctx.setLineDash([3,3]);ctx.beginPath();ctx.moveTo(px(7),P);ctx.lineTo(px(7),H-P);ctx.stroke();ctx.setLineDash([]);
    ctx.font='11px sans-serif';
    ctx.fillStyle='#7C3AED';ctx.fillText('7일 (주장 100만)',px(7)+4,P+12);
    ctx.fillStyle='#2563EB';ctx.fillText('로지스틱',W-P-58,py(K)+16);
    ctx.fillStyle='#B45309';ctx.fillText('지수',P+8,P+14);
    ctx.fillStyle='#DC2626';ctx.beginPath();ctx.arc(px(3),py(4),5,0,7);ctx.fill();
    ctx.fillText('3일·4만(실측)',px(3)+7,py(4)+4);
    const e3=N0*Math.pow(1+r,3), e7=N0*Math.pow(1+r,7);
    const l7=K/(1+((K-N0)/N0)*Math.exp(-r*7));
    const fitted=Math.abs(N0-0.5)<0.051 && Math.abs(e3-4)<0.35;
    const dt=Math.log(2)/Math.log(1+r);
    let ex='';
    if(fitted) ex=`<br><b>실측점 관통!</b> 하루 ×${(1+r).toFixed(2)} 성장 — 이대로면 7일 뒤 <b>${e7.toFixed(0)}만</b> 뷰 → 주장 100만은 <b>${e7>=100?'달성 가능':'과장'}</b>`;
    if(fitted&&K===30) ex+=`<br><b>시청자 풀 30만의 진실</b> — 로지스틱은 7일 뒤 ${l7.toFixed(1)}만에서 이미 꺾입니다. 끝없는 2배는 없습니다.`;
    $('#sout').innerHTML=`<span class="mono">지수: N = N₀(1+r)^t &nbsp;/&nbsp; 로지스틱: N = K/(1+((K−N₀)/N₀)e^(−rt))</span><br>
      배가시간 = log2/log(1+r) = <b>${dt.toFixed(2)}일</b> · 3일째 모형값 <b>${e3.toFixed(1)}만</b> (실측 4만)<br>
      7일 뒤 예측: 지수 <b>${e7.toFixed(1)}만</b> / 로지스틱 <b>${l7.toFixed(1)}만</b> / 제작자 주장 <b>100만</b>${ex}`;
  }
  ['sr','sk','sn'].forEach(i=>$('#'+i).oninput=draw); draw();
}

/* ---------- LAB 4 LUHN ---------- */
function luhnDemo(root){ let lnHad=false;
  root.innerHTML=`<label class="ctl">카드번호 16자리 (예시용 가상번호)</label>
   <input type="text" id="ln" value="4539 1488 0343 6467" maxlength="19">
   <div class="btns"><button class="b" id="lgo">검증하기</button>
   <button class="b g" id="lbad">한 자리 일부러 틀리기</button></div>
   <div class="out" id="lout"></div>`;
  function run(){
    const raw=$('#ln').value.replace(/\D/g,'');
    if(raw.length!==16){$('#lout').textContent='16자리를 입력하세요.';return;}
    const d=raw.split('').map(Number),steps=[];let sum=0;
    for(let i=0;i<16;i++){
      const pos=16-i; let v=d[i];
      if(pos%2===0){v*=2; if(v>9)v-=9;}
      sum+=v; steps.push({o:d[i],v,dbl:pos%2===0});
    }
    const ok=sum%10===0;
    $('#lout').innerHTML=`<table class="t"><tr><th>원래</th>${steps.map(s=>`<td>${s.o}</td>`).join('')}</tr>
      <tr><th>×2 여부</th>${steps.map(s=>`<td style="color:${s.dbl?'#2563EB':'#9CA3AF'}">${s.dbl?'×2':'−'}</td>`).join('')}</tr>
      <tr><th>변환값</th>${steps.map(s=>`<td><b>${s.v}</b></td>`).join('')}</tr></table>
      <div style="margin-top:12px;font-size:15px">합계 = <b>${sum}</b> &nbsp;→&nbsp; ${sum} mod 10 = <b>${sum%10}</b></div>
      <div style="margin-top:8px;font-size:19px;font-weight:800;color:${ok?'#0E9384':'#BE123C'}">
        ${ok?(lnHad?'✔ 오타를 고쳐 유효한 번호를 만들었습니다':'✔ 유효한 번호 (10으로 나누어떨어짐)'):(lnHad=true,'✘ 잘못된 번호 — 오타가 있습니다')}</div>`;
  }
  $('#lgo').onclick=run;
  $('#lbad').onclick=()=>{const r=$('#ln').value.replace(/\D/g,'').split('');
    const i=Math.floor(Math.random()*16); r[i]=String((+r[i]+1+Math.floor(Math.random()*8))%10);
    $('#ln').value=r.join('').replace(/(.{4})/g,'$1 ').trim(); run();};
  run();
}

/* ---------- LAB 5 REGRESSION ---------- */
function regDemo(root){
  root.innerHTML=`<div class="row"><div class="col">
    <canvas id="r1" width="380" height="300" style="cursor:crosshair"></canvas>
    <div style="font-size:12.5px;color:#6B7280;margin-top:6px">← 그래프를 클릭해 데이터를 추가해 보세요</div></div>
    <div class="col"><div class="out" id="rout"></div>
    <div class="btns"><button class="b t" id="rq">📌 카페 12일 데이터</button>
    <button class="b g" id="rclr">데이터 지우기</button>
    <button class="b g" id="rout2">이상치 하나 추가</button></div>
    <div class="note" style="margin-top:14px">직선은 무엇을 기준으로 「가장 좋은 자리」를 고르는 걸까요? 빨간 선분들을 단서로 추리해 보세요.</div>
    </div></div>`;
  const cv=$('#r1'),ctx=cv.getContext('2d'),W=380,H=300,P=32;
  let pts=[[1,2.4],[2,3.1],[3,4.3],[4,4.6],[5,6.1],[6,6.4],[7,7.8]];
  const X=v=>P+(W-2*P)*v/10, Y=v=>H-P-(H-2*P)*v/10;
  const iX=p=>(p-P)/(W-2*P)*10, iY=p=>(H-P-p)/(H-2*P)*10;
  function draw(){
    axes(ctx,W,H,P);
    const n=pts.length;
    if(n>1){
      const mx=pts.reduce((a,p)=>a+p[0],0)/n, my=pts.reduce((a,p)=>a+p[1],0)/n;
      let sxy=0,sxx=0; pts.forEach(p=>{sxy+=(p[0]-mx)*(p[1]-my);sxx+=(p[0]-mx)**2;});
      const a=sxx?sxy/sxx:0, b=my-a*mx;
      ctx.strokeStyle='#BE123C';ctx.lineWidth=1.3;
      pts.forEach(p=>{ctx.beginPath();ctx.moveTo(X(p[0]),Y(p[1]));ctx.lineTo(X(p[0]),Y(a*p[0]+b));ctx.stroke();});
      ctx.strokeStyle='#2563EB';ctx.lineWidth=2.6;ctx.beginPath();
      ctx.moveTo(X(0),Y(b));ctx.lineTo(X(10),Y(a*10+b));ctx.stroke();
      if(n===12){ ctx.strokeStyle='#B45309'; ctx.setLineDash([4,3]); ctx.lineWidth=1.4;
        ctx.beginPath(); ctx.moveTo(X(10),Y(0)); ctx.lineTo(X(10),Y(a*10+b)); ctx.stroke(); ctx.setLineDash([]);
        ctx.fillStyle='#B45309'; ctx.beginPath(); ctx.arc(X(10),Y(a*10+b),5,0,7); ctx.fill(); }
      const sse=pts.reduce((s,p)=>s+(p[1]-(a*p[0]+b))**2,0);
      const sst=pts.reduce((s,p)=>s+(p[1]-my)**2,0);
      $('#rout').innerHTML=`<span class="mono" style="font-size:15px">ŷ = ${a.toFixed(3)}x + ${b.toFixed(3)}</span><br><br>
        데이터 ${n}개 · 잔차제곱합 SSE = <b>${sse.toFixed(3)}</b><br>
        결정계수 R² = <b>${sst?(1-sse/sst).toFixed(3):'—'}</b><br><br>
        <span style="font-size:12.5px;color:#6B7280">a = Σ(xᵢ−x̄)(yᵢ−ȳ) / Σ(xᵢ−x̄)² &nbsp;,&nbsp; b = ȳ − a·x̄</span>${n===12?'<br><b style="color:#0E9384">📌 내일(30°C, x=10) 예상 판매: 약 '+Math.round((a*10+b)*10)+'잔</b>':''}`;
    } else $('#rout').textContent='점을 2개 이상 찍어 주세요.';
    ctx.fillStyle='#111827';pts.forEach(p=>{ctx.beginPath();ctx.arc(X(p[0]),Y(p[1]),4.5,0,7);ctx.fill();});
  }
  cv.onclick=e=>{const r=cv.getBoundingClientRect();
    const x=iX((e.clientX-r.left)*W/r.width), y=iY((e.clientY-r.top)*H/r.height);
    if(x>=0&&x<=10&&y>=0&&y<=10){pts.push([x,y]);draw();}};
  $('#rclr').onclick=()=>{pts=[];draw();};
  $('#rq').onclick=()=>{ pts=[[2,3.4],[3,4.1],[4,4.4],[5,5.4],[5,4.8],[6,6.1],[7,6.4],[7,7.1],[8,7.6],[9,8.2],[9,7.8],[10,8.9]]; draw(); };
  $('#rout2').onclick=()=>{pts.push([8.5,1.2]);draw();};
  draw();
}

/* ---------- LAB 6 GRADIENT DESCENT ---------- */
function gdDemo(root){
  root.innerHTML=`<div class="row"><div class="col"><canvas id="d1" width="380" height="300"></canvas></div>
   <div class="col">${slider('dlr','학습률 α',0.05,4.5,0.05,0.3,'')}
   ${slider('dx0','시작점 x₀',-4,8,0.2,7,'')}
   <div class="btns"><button class="b" id="dstep">한 걸음 ▶</button>
   <button class="b g" id="drun">자동 20걸음</button><button class="b g" id="drst">되돌리기</button></div>
   <div class="out mono" id="dout"></div></div></div>`;
  const cv=$('#d1'),ctx=cv.getContext('2d'),W=380,H=300,P=30;
  const f=x=>0.25*(x-2)**2+1, df=x=>0.5*(x-2);
  const X=v=>P+(W-2*P)*(v+5)/14, Y=v=>H-P-(H-2*P)*v/9;
  let path=[];
  function reset(){path=[+$('#dx0').value];draw();}
  function draw(){
    const lr=+$('#dlr').value;
    $('#dlrv').textContent=lr.toFixed(2);$('#dx0v').textContent=(+$('#dx0').value).toFixed(1);
    axes(ctx,W,H,P);
    ctx.strokeStyle='#2563EB';ctx.lineWidth=2.4;ctx.beginPath();
    for(let x=-5;x<=9;x+=.1){const y=f(x); if(y<9)ctx.lineTo(X(x),Y(y)); }ctx.stroke();
    ctx.strokeStyle='#B45309';ctx.lineWidth=1.6;
    for(let i=1;i<path.length;i++){ctx.beginPath();
      ctx.moveTo(X(path[i-1]),Y(f(path[i-1])));ctx.lineTo(X(path[i]),Y(f(path[i])));ctx.stroke();}
    path.forEach((x,i)=>{ctx.fillStyle=i===path.length-1?'#BE123C':'rgba(180,83,9,.45)';
      ctx.beginPath();ctx.arc(X(x),Y(f(x)),i===path.length-1?6:3.5,0,7);ctx.fill();});
    const cx=path[path.length-1],g=df(cx);
    ctx.strokeStyle='#0E9384';ctx.lineWidth=1.6;ctx.setLineDash([5,4]);ctx.beginPath();
    ctx.moveTo(X(cx-2),Y(f(cx)-2*g));ctx.lineTo(X(cx+2),Y(f(cx)+2*g));ctx.stroke();ctx.setLineDash([]);
    $('#dout').innerHTML=`f(x) = 0.25(x−2)² + 1 &nbsp;→&nbsp; f′(x) = 0.5(x−2)<br><br>
      x<sub>${path.length-1}</sub> = <b>${cx.toFixed(4)}</b> &nbsp; f = ${f(cx).toFixed(4)}<br>
      기울기 f′ = <b>${g.toFixed(4)}</b><br>
      다음 = x − α·f′ = ${cx.toFixed(3)} − ${lr.toFixed(2)}×${g.toFixed(3)} = <b>${(cx-lr*g).toFixed(4)}</b>
      ${Math.abs(cx)>60?'<br><br><span style="color:#BE123C;font-weight:800">발산! 학습률이 너무 큽니다</span>':''}`;
  }
  $('#dstep').onclick=()=>{const lr=+$('#dlr').value,x=path[path.length-1];path.push(x-lr*df(x));draw();};
  $('#drun').onclick=()=>{const lr=+$('#dlr').value;for(let i=0;i<20;i++){const x=path[path.length-1];path.push(x-lr*df(x));}draw();};
  $('#drst').onclick=reset; $('#dx0').oninput=reset; $('#dlr').oninput=draw; reset();
}

/* ---------- LAB 7 MONTE CARLO ---------- */
function mcDemo(root){
  root.innerHTML=`<div class="row"><div class="col"><canvas id="m1" width="300" height="300"></canvas></div>
   <div class="col"><div class="btns"><button class="b" id="m10">+100 점</button>
   <button class="b" id="m1k">+1,000 점</button><button class="b g" id="mrs">초기화</button></div>
   <div class="out" id="mout"></div>
   <div class="note" style="margin-top:14px">사분원 넓이 : 정사각형 넓이 = <b>π/4 : 1</b><br>
   → π ≈ 4 × (원 안의 점 수) / (전체 점 수)</div></div></div>`;
  const cv=$('#m1'),ctx=cv.getContext('2d'),S=300;let inC=0,tot=0;
  function base(){ctx.clearRect(0,0,S,S);ctx.fillStyle='#FBFCFE';ctx.fillRect(0,0,S,S);
    ctx.strokeStyle='#2563EB';ctx.lineWidth=2;ctx.beginPath();ctx.arc(0,S,S,0,7);ctx.stroke();
    ctx.strokeStyle='#9CA3AF';ctx.strokeRect(0,0,S,S);}
  function add(n){for(let i=0;i<n;i++){const x=Math.random(),y=Math.random();
      const ok=x*x+y*y<=1; if(ok)inC++; tot++;
      ctx.fillStyle=ok?'rgba(37,99,235,.55)':'rgba(190,18,60,.45)';
      ctx.beginPath();ctx.arc(x*S,S-y*S,1.7,0,7);ctx.fill();}
    const est=4*inC/tot;
    $('#mout').innerHTML=`전체 <b>${tot.toLocaleString()}</b>개 중 원 안 <b>${inC.toLocaleString()}</b>개<br><br>
      <span style="font-size:22px;font-weight:800;color:#2563EB">π ≈ ${est.toFixed(5)}</span><br>
      실제 π = 3.14159… &nbsp; 오차 <b>${Math.abs(est-Math.PI).toFixed(5)}</b>`;}
  $('#m10').onclick=()=>add(100);$('#m1k').onclick=()=>add(1000);
  $('#mrs').onclick=()=>{inC=0;tot=0;base();$('#mout').textContent='점을 뿌려 보세요.';};
  base();add(300);
}

/* ---------- LAB 8 COSINE SIMILARITY ---------- */
function cosDemo(root){
  const USERS=[{n:'민준',v:[9,2],c:'#2563EB'},{n:'서연',v:[3,8],c:'#0E9384'},{n:'지훈',v:[7,6],c:'#B45309'}];
  root.innerHTML=`<div class="row"><div class="col"><canvas id="c1" width="330" height="330"></canvas></div>
   <div class="col">${slider('ca','내 취향 · 액션 선호도',0,10,0.5,8,'')}
   ${slider('cr','내 취향 · 로맨스 선호도',0,10,0.5,3,'')}
   <div class="out" id="cout"></div></div></div>`;
  const cv=$('#c1'),ctx=cv.getContext('2d'),W=330,H=330,P=34;
  const X=v=>P+(W-2*P)*v/10, Y=v=>H-P-(H-2*P)*v/10;
  function draw(){
    const a=+$('#ca').value,r=+$('#cr').value;
    $('#cav').textContent=a.toFixed(1);$('#crv').textContent=r.toFixed(1);
    axes(ctx,W,H,P);
    ctx.font='11px sans-serif';ctx.fillStyle='#6B7280';
    ctx.fillText('액션 →',W-P-42,H-P+16); ctx.save();ctx.translate(P-16,P+34);ctx.rotate(-Math.PI/2);ctx.fillText('로맨스 →',0,0);ctx.restore();
    const arrow=(v,c,lab,w)=>{ctx.strokeStyle=c;ctx.lineWidth=w;ctx.beginPath();
      ctx.moveTo(X(0),Y(0));ctx.lineTo(X(v[0]),Y(v[1]));ctx.stroke();
      ctx.fillStyle=c;ctx.beginPath();ctx.arc(X(v[0]),Y(v[1]),4.5,0,7);ctx.fill();
      ctx.font='bold 12px sans-serif';ctx.fillText(lab,X(v[0])+7,Y(v[1])-6);};
    const me=[a,r]; let rows=[];
    USERS.forEach(u=>{
      arrow(u.v,u.c,u.n,2);
      const dot=me[0]*u.v[0]+me[1]*u.v[1];
      const cs=dot/((Math.hypot(...me)||1e-9)*Math.hypot(...u.v));
      rows.push({n:u.n,cs,c:u.c,th:Math.acos(Math.min(1,Math.max(-1,cs)))*180/Math.PI});
    });
    arrow(me,'#BE123C','나',3.2);
    rows.sort((x,y)=>y.cs-x.cs);
    $('#cout').innerHTML=`<span class="mono">cos θ = (a·b) / (|a||b|)</span>
      <table class="t"><tr><th>상대</th><th>코사인 유사도</th><th>사잇각</th></tr>
      ${rows.map((x,i)=>`<tr><td style="color:${x.c};font-weight:700">${x.n}</td>
      <td><b>${x.cs.toFixed(3)}</b></td><td>${x.th.toFixed(1)}°</td></tr>`).join('')}</table>
      <div style="margin-top:10px;font-size:15px">→ <b style="color:${rows[0].c}">${rows[0].n}</b>님이 본 영화를 추천합니다
      <span style="color:#6B7280;font-size:13px">(사잇각이 가장 작음)</span></div>`;
  }
  ['ca','cr'].forEach(i=>$('#'+i).oninput=draw); draw();
}

/* ---------- LAB 9 CONVOLUTION ---------- */
function convDemo(root){
  const K={'경계 검출':[[-1,-1,-1],[-1,8,-1],[-1,-1,-1]],
           '흐리게 (평균)':[[1/9,1/9,1/9],[1/9,1/9,1/9],[1/9,1/9,1/9]],
           '선명하게':[[0,-1,0],[-1,5,-1],[0,-1,0]],
           '가로선 강조':[[-1,-2,-1],[0,0,0],[1,2,1]]};
  root.innerHTML=`<label class="ctl">커널(3×3 행렬) 선택</label>
    <div class="chips" id="kchips">${Object.keys(K).map((k,i)=>`<div class="chip ${i===0?'on':''}" data-k="${k}">${k}</div>`).join('')}</div>
    <div class="row" style="margin-top:14px">
      <div class="col" style="flex:0 0 auto"><div style="font-size:13px;font-weight:700;margin-bottom:6px">원본 (16×16)</div>
      <canvas id="v1" width="192" height="192"></canvas></div>
      <div class="col" style="flex:0 0 auto"><div style="font-size:13px;font-weight:700;margin-bottom:6px">합성곱 결과</div>
      <canvas id="v2" width="192" height="192"></canvas></div>
      <div class="col"><div style="font-size:13px;font-weight:700;margin-bottom:6px">적용 중인 행렬</div>
      <table class="t" id="ktab" style="max-width:210px"></table>
      <div class="note" style="margin-top:12px">필터 행렬의 숫자들이 그림을 어떻게 바꾸는 걸까요? 픽셀 하나에서 계산을 따라가 보세요.</div></div>
    </div>`;
  const N=16,img=[];
  for(let y=0;y<N;y++){img[y]=[];for(let x=0;x<N;x++){
    let v=40;
    if(x>3&&x<12&&y>3&&y<12)v=210;              // 사각형
    if((x-8)**2+(y-8)**2<6)v=90;                 // 안쪽 원
    if(y===13)v=170;                             // 가로줄
    img[y][x]=v;}}
  function paint(cv,d){const c=cv.getContext('2d'),s=192/N;
    for(let y=0;y<N;y++)for(let x=0;x<N;x++){const v=Math.max(0,Math.min(255,d[y][x]));
      c.fillStyle=`rgb(${v},${v},${v})`;c.fillRect(x*s,y*s,s,s);}
    c.strokeStyle='#E5E7EB';c.strokeRect(0,0,192,192);}
  function apply(k){
    const o=[];for(let y=0;y<N;y++){o[y]=[];for(let x=0;x<N;x++){
      let s=0;for(let j=-1;j<=1;j++)for(let i=-1;i<=1;i++){
        const yy=Math.min(N-1,Math.max(0,y+j)),xx=Math.min(N-1,Math.max(0,x+i));
        s+=img[yy][xx]*k[j+1][i+1];}
      o[y][x]=s;}}
    paint($('#v2'),o);
    $('#ktab').innerHTML=k.map(r=>`<tr>${r.map(v=>`<td>${Number(v.toFixed(2))}</td>`).join('')}</tr>`).join('');
  }
  paint($('#v1'),img); apply(K['경계 검출']);
  root.querySelectorAll('#kchips .chip').forEach(c=>c.onclick=()=>{
    root.querySelectorAll('#kchips .chip').forEach(x=>x.classList.remove('on'));
    c.classList.add('on'); apply(K[c.dataset.k]);});
}

/* ---------- LAB 10 WAVE ---------- */
let AC=null,OSC=null;
function audioStop(){if(OSC){try{OSC.forEach(o=>o.stop());}catch(e){}OSC=null;}}
function waveDemo(root){
  root.innerHTML=`<div class="row"><div class="col"><canvas id="w1" width="380" height="240"></canvas>
   <div class="btns"><button class="b" id="wplay">▶ 소리 듣기 (2초)</button><button class="b g" id="wstop">정지</button></div></div>
   <div class="col">${slider('w1a','기본음 sin(x) 진폭',0,1,0.05,1,'')}
   ${slider('w2a','2배음 sin(2x) 진폭',0,1,0.05,0.4,'')}
   ${slider('w3a','3배음 sin(3x) 진폭',0,1,0.05,0.25,'')}
   ${slider('w5a','5배음 sin(5x) 진폭',0,1,0.05,0,'')}
   <div class="out mono" id="wout"></div></div></div>`;
  const cv=$('#w1'),ctx=cv.getContext('2d'),W=380,H=240,P=22;
  function amps(){return [+$('#w1a').value,+$('#w2a').value,+$('#w3a').value,+$('#w5a').value];}
  function draw(){
    const a=amps(); ['w1a','w2a','w3a','w5a'].forEach((id,i)=>$('#'+id+'v').textContent=a[i].toFixed(2));
    ctx.clearRect(0,0,W,H);ctx.strokeStyle='#E5E7EB';ctx.beginPath();
    ctx.moveTo(P,H/2);ctx.lineTo(W-P,H/2);ctx.stroke();
    const H1=[1,2,3,5], C=['rgba(37,99,235,.30)','rgba(14,147,132,.30)','rgba(180,83,9,.30)','rgba(109,40,217,.30)'];
    const f=t=>a.reduce((s,A,i)=>s+A*Math.sin(H1[i]*t),0);
    const tot=a.reduce((s,x)=>s+x,0)||1;
    H1.forEach((h,i)=>{if(a[i]<=0)return;ctx.strokeStyle=C[i];ctx.lineWidth=1.6;ctx.beginPath();
      for(let p=0;p<=W-2*P;p++){const t=p/(W-2*P)*4*Math.PI;
        ctx.lineTo(P+p,H/2-a[i]*Math.sin(h*t)/tot*(H/2-P));}ctx.stroke();});
    ctx.strokeStyle='#111827';ctx.lineWidth=2.6;ctx.beginPath();
    for(let p=0;p<=W-2*P;p++){const t=p/(W-2*P)*4*Math.PI;
      ctx.lineTo(P+p,H/2-f(t)/tot*(H/2-P));}ctx.stroke();
    $('#wout').innerHTML=`y = ${a.map((A,i)=>A>0?`${A.toFixed(2)}·sin(${H1[i]}x)`:null).filter(Boolean).join(' + ')||'0'}
      <br><br>같은 높이(진동수)라도 <b>배음의 섞임</b>이 다르면 음색이 달라집니다.`;
  }
  ['w1a','w2a','w3a','w5a'].forEach(i=>$('#'+i).oninput=draw);
  $('#wplay').onclick=()=>{audioStop();
    try{AC=AC||new (window.AudioContext||window.webkitAudioContext)();}catch(e){return;}
    const a=amps(),H1=[1,2,3,5],g0=AC.createGain();g0.gain.value=0.0001;g0.connect(AC.destination);
    g0.gain.exponentialRampToValueAtTime(0.25,AC.currentTime+0.05);
    g0.gain.exponentialRampToValueAtTime(0.0001,AC.currentTime+2);
    OSC=[];const tot=a.reduce((s,x)=>s+x,0)||1;
    H1.forEach((h,i)=>{if(a[i]<=0)return;const o=AC.createOscillator(),g=AC.createGain();
      o.type='sine';o.frequency.value=262*h;g.gain.value=a[i]/tot;o.connect(g);g.connect(g0);
      o.start();o.stop(AC.currentTime+2);OSC.push(o);});};
  $('#wstop').onclick=audioStop;
  draw();
}
