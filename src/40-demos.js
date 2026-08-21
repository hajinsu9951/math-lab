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
      ${slider('pa','A 요금제 기본료',0,30000,1000,10000,'원')}
      ${slider('pb','A 요금제 분당 요금',0,200,10,50,'원')}
      ${slider('pc','B 요금제 기본료',0,30000,1000,20000,'원')}
      ${slider('pd','B 요금제 분당 요금',0,200,10,20,'원')}
      <div class="out" id="plout"></div>
      <div class="note" style="margin-top:12px">두 <b>일차함수의 교점</b>이 곧 “갈아탈 시점”입니다.
      기본료는 <b>y절편</b>, 분당 요금은 <b>기울기</b>입니다.</div>
    </div></div>`;
  const cv=$('#pl1'),ctx=cv.getContext('2d'),W=380,H=300,P=40;
  const MAXM=400;
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
           x = (${c.toLocaleString()} − ${a.toLocaleString()}) / (${b} − ${d}) = <b>${m.toFixed(1)}분</b><br><br>
           <b>${m.toFixed(0)}분보다 적게 쓰면 ${b<d?'A':'B'}</b>, 많이 쓰면 <b>${b<d?'B':'A'}</b>가 저렴합니다.<br>
           그때 요금은 둘 다 <b>${Math.round(y).toLocaleString()}원</b>`;
    }
    $('#plout').innerHTML=msg;
  }
  ['pa','pb','pc','pd'].forEach(i=>$('#'+i).oninput=draw); draw();
}

/* ---------- LAB 12 드론으로 높이 재기 (삼각비) ---------- */
function trigDemo(root){
  root.innerHTML=`<div class="row"><div class="col"><canvas id="tg1" width="380" height="300"></canvas></div>
    <div class="col">
      ${slider('tth','올려본각 θ',5,80,1,35,'°')}
      ${slider('tds','수평 거리 d',10,120,1,50,'m')}
      ${slider('teh','내 눈높이',0,3,0.1,1.6,'m')}
      <div class="out" id="tgout"></div>
      <div class="note" style="margin-top:12px">각을 재고 거리를 알면 <b>tan</b> 하나로 높이가 나옵니다.
      드론·측량기가 하는 일이 정확히 이것입니다.</div>
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
       참고 · 시선 길이(빗변) = ${d} / cos ${th}° = ${hyp.toFixed(2)} m`;
  }
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
      <div class="btns"><button class="b g" id="crnew">새로 뽑기</button>
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
  $('#crnew').onclick=()=>{gen();draw();};
  $('#crclr').onclick=()=>{pts=[];draw();};
  ['crs','crn'].forEach(i=>$('#'+i).oninput=()=>{gen();draw();});
  gen(); draw();
}

/* ---------- LAB 07 대푯값과 이상치 ---------- */
function repDemo(root){
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
       평균보다 적게 받는 사람 = <b>${arr.filter(v=>v<mean).length}명 / 10명</b><br><br>
       <span style="color:#6B7280;font-size:12.5px">${gap>500
         ? '한 사람의 값이 평균을 크게 끌어올렸습니다. 이럴 때는 중앙값이 “보통 사람”을 더 잘 나타냅니다.'
         : '아직 이상치가 크지 않아 평균과 중앙값이 비슷합니다. 사장님 연봉을 올려 보세요.'}</span>`;
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
      ${slider('lwn','뽑은 횟수',10,3000,10,500,'회')}
      <div class="btns"><button class="b" id="lwgo">다시 뽑기</button></div>
      <div class="out" id="lwout"></div>
      <div class="note" style="margin-top:12px">시행을 늘릴수록 실험 확률이 이론 확률로 <b>수렴</b>합니다.
      “확률 0.5%”가 무슨 뜻인지 몸으로 알게 되는 자리입니다.</div>
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
       = 1 − (1−${p.toFixed(3)})<sup>${n}</sup> = <b style="font-size:16px">${(atLeast*100).toFixed(1)}%</b><br><br>
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
       <span style="color:#6B7280;font-size:12.5px">표준편차를 바꿔 보세요. 점수는 그대로인데 z 와 백분위가 크게 달라집니다.</span>`;
  }
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
      <div class="note" style="margin-top:12px">단리는 직선, 복리는 곡선입니다.
      <b>72를 이자율로 나누면</b> 두 배 되는 햇수가 나오는데, 왜 하필 72인지 로그로 확인할 수 있습니다.</div>
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
      <div class="note" style="margin-top:12px">보통 눈금에서는 작은 값들이 <b>바닥에 붙어 아무것도 안 보입니다.</b>
      로그 눈금으로 바꾸면 비로소 비교가 됩니다.</div>
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
      <div class="note" style="margin-top:12px">h 를 0에 가깝게 줄여 보세요. <b>할선이 접선으로</b> 다가갑니다.
      과속 단속 카메라가 재는 것이 바로 이 극한값입니다.</div>
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
      <div class="note" style="margin-top:12px">곱하는 것은 <b>한 번</b>이면 끝나는데, 되돌리는 것은
      나눠 보는 수밖에 없습니다. 이 비대칭이 <b>공개키 암호(RSA)</b>가 서는 자리입니다.
      실제 암호는 자릿수가 <b>수백 자리</b>인 소수를 씁니다.</div>
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
      <div class="note" style="margin-top:12px">뺄셈은 <b>반대 방향으로 가는 덧셈</b>입니다.
      a − b = a + (−b). 화살표의 <b>길이는 |b| 그대로</b>이고 방향만 뒤집힙니다.</div>
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
      <div class="note" style="margin-top:12px"><b>2a</b> 는 “2와 a”가 아니라 <b>2 × a</b> 입니다.
      a = 7 이면 2a = 14 이지 27 이 아닙니다 — 약속을 잘못 읽으면 대입이 통째로 어긋납니다.</div>
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
      <div class="note" style="margin-top:12px"><b>곱 x × y 가 일정</b>하면 반비례,
      <b>비 y ÷ x 가 일정</b>하면 정비례입니다. 점을 여러 개 찍은 뒤 두 값을 견줘 보세요.</div>
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
      <div class="note" style="margin-top:12px">평행선이라는 <b>조건</b>이 있어야 같습니다.
      평행이 아니면 이름(동위각·엇각)은 그대로여도 <b>크기는 달라집니다</b> —
      그림에서 철길이 만나 보이는 소실점이 바로 그 어긋남입니다.</div>
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
      <div class="note" style="margin-top:12px">조건이 맞으면 <b>모양이 하나로 정해집니다</b>.
      SSA 는 컴퍼스 원이 반직선을 <b>두 번 자를 수 있어</b> 두 개가 나옵니다 —
      그래서 다리·철탑은 세 변을 고정하는 <b>삼각형(SSS)</b>으로 짓습니다.</div>
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
      <div class="note" style="margin-top:12px">호의 길이도 넓이도 <b>중심각에 정비례</b>합니다.
      반지름을 두 배로 하면 호는 두 배, 넓이는 <b>네 배</b>가 되지만
      <b>비율(각/360 · 호/둘레 · 넓이/원)</b>은 셋 다 그대로입니다 —
      그래서 원그래프는 원의 크기와 상관없이 읽을 수 있습니다.</div>
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
      <div class="note" style="margin-top:12px">평균 치수의 신발은 <b>아무도 안 살 수도</b> 있습니다.
      “가장 많이 팔린 것”을 묻고 있다면 답은 <b>최빈값</b>입니다.
      대푯값은 하나가 아니라 <b>물음에 따라 고르는 것</b>입니다.</div>
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
      <div class="note" style="margin-top:12px">같은 자료인데 <b>계급을 어떻게 자르느냐</b>에 따라
      봉우리가 하나가 되기도, 둘이 되기도 합니다. 그래서 히스토그램에는
      <b>계급의 크기를 반드시 밝혀야</b> 합니다.</div>
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
      <div class="note" style="margin-top:12px">처음 맞물린 자리로 <b>다시 돌아오는 때</b>가
      최소공배수입니다. 소인수분해로 보면 두 바퀴의 소인수를 <b>모두(높은 지수로)</b>
      담아야 두 바퀴가 동시에 정수 바퀴를 돌기 때문입니다.</div>
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
      <div class="note" style="margin-top:12px">원은 “그 점에서 거리가 같은 점들”의 모임입니다.
      반지름 b 인 호와 반지름 c 인 호가 만나는 점이 곧 <b>두 조건을 동시에 만족하는 꼭짓점</b>입니다.
      호가 만나지 못하면 — 그런 삼각형은 세상에 없습니다.</div>
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
      <div class="note" style="margin-top:12px">한 점에 모인 각이 <b>정확히 360°</b>여야 빈틈도
      겹침도 없습니다. 붙일 수 있는 정다각형이 <b>세 가지뿐</b>인 이유를 직접 확인하세요.
      (벌집이 정육각형인 것도 같은 이유입니다)</div>
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
      <div class="note" style="margin-top:12px">다면체는 <b>v − e + f = 2</b> (오일러 공식)가
      성립하고, 회전체의 단면은 축에 수직으로 자르면 <b>언제나 원</b>입니다 —
      돌려 보고 잘라 보면 두 성질이 함께 보입니다.</div>
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
      <div class="note" style="margin-top:12px">같은 부피라도 겉넓이는 다릅니다.
      <b>정육면체에 가까울수록</b> 종이가 적게 듭니다 — 그런데 실제 택배 상자는 왜
      정육면체가 아닐까요? (물건 모양·쌓기·손잡이…) 그것이 수학과 현실의 대화입니다.</div>
    </div></div>`;
  const cv=$('#bx1'),ctx=cv.getContext('2d'),W=380,H=300;
  const V=8000;
  const S={ a:20, b:20, best:Infinity };
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
      <div class="note" style="margin-top:12px">줄기와 잎은 <b>원래 값을 그대로 남깁니다</b> —
      중앙값을 잎에서 직접 셀 수 있습니다. 히스토그램은 값을 <b>구간 개수로 뭉개는</b>
      대신 큰 자료의 분포를 한눈에 보여 줍니다. 목적에 따라 골라 쓰는 것입니다.</div>
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
      <div class="note" style="margin-top:12px">몇 명에게 묻느냐에 따라 결론이 흔들립니다.
      <b>같은 크기로 여러 번</b> 뽑아 흔들림의 폭을 재는 것 — 그것이 “몇 명이면 충분한가”에
      답하는 유일한 방법입니다. 누구에게 묻는가(편향)도 함께 생각하세요.</div>
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
 link:'좌표평면과 그래프 단원에서 씁니다. 기울기를 “빠르기”로 읽는 감각은 중2 <b>일차함수</b>의 기울기, 고등학교 <b>미분계수</b>로 곧장 이어집니다.'}
];

/* ============ 10종 실험실 정의 ============ */
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
 build:coordDemo}
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
      <div class="note" style="margin-top:12px">파란 원함수와 초록 역함수는 <b>주황 점선 y = x 에 대칭</b>입니다.
      대응점의 좌표가 서로 뒤바뀌는 것을 슬라이더로 확인해 보세요.</div>
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
      <div class="note" style="margin-top:12px">원판 한 장의 부피는 <b>π r² Δy</b> 입니다.
      반지름을 <b>제곱</b>하기 때문에, 굵기를 2배로 하면 부피는 <b>4배</b>가 됩니다.
      원판을 늘릴수록 계단이 곡선에 붙어 오차가 줄어듭니다.</div>
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
   '오르다가 평평해졌다 다시 오르는 거리-시간 꺾은선')
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
  box.innerHTML = `<div class="ldh">🧗 <b>실험 사다리</b> — 단계를 하나씩 넘으세요
      <span class="ldp" id="ldp">0 / ${list.length}</span></div>`
    + list.map((s,i)=>`<div class="ldi ${i===0?'now':'lock'}">
        <span class="ldn">STEP ${i+1}</span>
        <div class="ldt">${s.t}${s.re?'<span class="ldauto">자동 확인</span>':''}</div>
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
   "t": "기준점을 2개로 줄이고 — 내 위치 후보가 몇 개 남는지 읽으세요.",
   "re": "아직 후보가 둘"
  },
  {
   "t": "기준점 3개·오차 0 — 후보를 한 점으로 좁히세요.",
   "re": "위치 확정"
  },
  {
   "t": "오차를 키워 교점이 「오차 삼각형」으로 번지게 만들고, 가장 그럴듯한 자리를 눈으로 정하세요.",
   "re": "그럴듯한 위치"
  },
  {
   "t": "기록·발견 — 오차 0.2·0.6·1.0 에서 번짐의 크기를 표로 적고, 오차와 후보 영역의 관계를 한 줄로 쓰세요."
  },
  {
   "t": "적용 — 내 위치를 다른 곳으로 옮기고, 세 원의 반지름이 각각 어떻게 변할지 예측한 뒤 확인하세요."
  }
 ],
 "2": [
  {
   "t": "문자에 단어를 넣어 분류기가 단어를 잡아내는 것을 확인하세요."
  },
  {
   "t": "가중치를 조절해 광고 문자가 스팸함으로 가게 만드세요 — 확률이 어떻게 변하는지 읽으세요."
  },
  {
   "t": "사전에 없는 단어만 넣어 분류기가 왜 판단을 못 하는지 직접 확인하세요.",
   "re": "사전에 있는 단어가 없습니다"
  },
  {
   "t": "기록·발견 — 같은 단어를 두 번 넣을 때와 한 번 넣을 때 확률 변화를 표로 적으세요."
  },
  {
   "t": "적용 — 정상 문자가 스팸으로 막히는(거짓양성) 예를 하나 설계하고, 어떤 단어 때문인지 쓰세요."
  }
 ],
 "3": [
  {
   "t": "성장률을 움직여 「며칠 만에 두 배」(배가시간)가 변하는 것을 읽으세요."
  },
  {
   "t": "배가시간을 2일 미만으로 만드세요 — 성장률이 얼마나 필요한가요?",
   "re": "= 1\\.\\d\\d일"
  },
  {
   "t": "로지스틱 곡선이 지수 곡선과 갈라지는 시점을 찾아 12일 뒤 두 값을 비교하세요."
  },
  {
   "t": "기록·발견 — 성장률 3가지에서 배가시간을 표로 적고, 공식과 맞는지 검산하세요."
  },
  {
   "t": "적용 — 포화 한계 K 를 절반으로 줄이면 곡선의 어디가 먼저 변할지 예측한 뒤 확인하세요."
  }
 ],
 "4": [
  {
   "t": "네 슬라이더를 움직여 교점(손익분기점)이 따라 움직이는 것을 확인하세요."
  },
  {
   "t": "분당 요금을 같게 맞춰 두 직선이 나란해지는 순간을 잡으세요 — 교점이 사라집니다.",
   "re": "평행"
  },
  {
   "t": "기본료까지 같게 — 두 요금제를 완전히 겹치게 만드세요.",
   "re": "완전히 같습니다"
  },
  {
   "t": "기록·발견 — 「해가 하나·없음·무수히 많음」 세 경우를 각각 만들어 조건을 표로 정리하세요."
  },
  {
   "t": "적용 — 교점이 정확히 300분에 오는 요금제 조합을 하나 설계하고 식으로 검산하세요."
  }
 ],
 "5": [
  {
   "t": "각도·거리를 움직여 건물 높이가 어떻게 변하는지 확인하세요."
  },
  {
   "t": "건물 높이를 100 m 이상으로 만드세요 — 각도와 거리를 어떻게 조합했나요?",
   "re": "= [1-9]\\d\\d\\.\\d\\d m"
  },
  {
   "t": "같은 건물을 가까이·멀리 두 곳에서 재어 높이가 같게 나오는지 확인하세요."
  },
  {
   "t": "기록·발견 — 눈높이를 빼먹으면 측정값이 얼마나 어긋나는지 두 경우를 표로 적으세요."
  },
  {
   "t": "적용 — 각이 45도일 때 높이와 거리 사이의 관계를 쓰고, 화면으로 검산하세요."
  }
 ],
 "6": [
  {
   "t": "관계 세기를 움직여 점구름 모양과 상관계수가 함께 변하는 것을 보세요."
  },
  {
   "t": "강한 양의 상관 — 상관계수를 0.9 이상으로 만드세요.",
   "re": "= 0\\.9\\d"
  },
  {
   "t": "음의 상관 — 상관계수를 −0.5 아래로 내려 보세요.",
   "re": "= -0\\.[5-9]"
  },
  {
   "t": "구석에 이상치를 하나 찍어 상관계수가 얼마나 무너지는지 기록하세요."
  },
  {
   "t": "적용 — 「상관이 높다 ≠ 원인이다」의 예를 하나 만들어 쓰세요."
  }
 ],
 "7": [
  {
   "t": "현재 자료의 평균과 중앙값을 읽고 차이를 확인하세요."
  },
  {
   "t": "사장님 연봉을 크게 올려 평균이 끌려가는 순간을 만드세요.",
   "re": "크게 끌어올렸습니다"
  },
  {
   "t": "연봉을 되돌려 평균과 중앙값이 다시 가까워지게 만드세요.",
   "re": "비슷합니다"
  },
  {
   "t": "기록·발견 — 연봉 3가지 시나리오에서 평균·중앙값을 표로 적고 어느 쪽이 「보통 직원」에 가까운지 쓰세요."
  },
  {
   "t": "적용 — 뉴스에서 평균이 쓰이면 안 되는 사례를 하나 들고 중앙값으로 고쳐 쓰세요."
  }
 ],
 "8": [
  {
   "t": "자리 수를 하나씩 늘려 가짓수 막대(로그 눈금)가 얼마나 뛰는지 보세요."
  },
  {
   "t": "숫자만 4자리일 때 뚫는 시간을 읽고, 대소문자+숫자+기호 12자리와 비교하세요."
  },
  {
   "t": "자리 수 하나 늘리기 vs 문자 종류 늘리기 — 어느 쪽이 더 센지 두 실험으로 판정하세요."
  },
  {
   "t": "기록·발견 — (문자 종류, 자리 수, 시간) 을 4줄 표로 적고 지수 규칙을 쓰세요."
  },
  {
   "t": "적용 — 1000년 이상 버티는 가장 짧은 비밀번호 규칙을 설계하세요."
  }
 ],
 "9": [
  {
   "t": "0.5% 뽑기를 돌려 「200번이면 나오겠지」가 맞는지 확인하세요.",
   "re": "절반도 안 됩니다"
  },
  {
   "t": "몇 번부터 절반을 넘는지 찾아내세요.",
   "re": "절반을 넘었습니다"
  },
  {
   "t": "같은 시행을 여러 번 반복 — 시행마다 결과가 흔들리는 폭을 관찰하세요."
  },
  {
   "t": "기록·발견 — 뽑기 횟수 3가지에서 「적어도 1번 나올 확률」을 표로 적고 규칙을 쓰세요."
  },
  {
   "t": "적용 — 「이제 나올 때가 됐다」는 말이 왜 틀렸는지 실험 근거로 쓰세요."
  }
 ],
 "10": [
  {
   "t": "내 점수를 움직여 표준점수가 변하는 것을 읽으세요."
  },
  {
   "t": "점수를 평균과 정확히 같게 만드세요.",
   "re": "평균과 같습니다"
  },
  {
   "t": "점수를 2 시그마 위로 올려 보세요 — 상위 몇 % 인가요?",
   "re": "[2-9]\\.\\d\\dσ 위|[1-9]\\d\\.\\d\\dσ 위"
  },
  {
   "t": "기록·발견 — 표준편차를 바꿀 때 같은 점수의 z 가 어떻게 변하는지 표로 적으세요."
  },
  {
   "t": "적용 — 수학 85점(평균70·표준편차10)과 영어 80점(평균65·표준편차5) 중 어느 쪽이 잘 본 시험인지 z 로 판정하세요."
  }
 ],
 "11": [
  {
   "t": "단리·복리 두 곡선이 갈라지는 지점을 관찰하세요."
  },
  {
   "t": "이자율을 조절해 「두 배 되는 햇수」를 8년 아래로 내리세요.",
   "re": "= [1-7]\\.\\d\\d년"
  },
  {
   "t": "72의 법칙 어림값과 정확값의 차이를 이자율 3곳에서 비교하세요."
  },
  {
   "t": "기록·발견 — (이자율, 정확값, 72법칙값) 표를 만들고 왜 72인지 짐작을 쓰세요."
  },
  {
   "t": "적용 — 연 3% 적금이 두 배 되는 데 몇 년 걸릴지 계산한 뒤 화면으로 검산하세요."
  }
 ],
 "12": [
  {
   "t": "처음 화면(보통 눈금)에서 작은 값들이 왜 안 보이는지 확인하세요."
  },
  {
   "t": "눈금을 전환해 모든 값이 함께 보이는 화면을 만드세요.",
   "re": "로그 눈금입니다"
  },
  {
   "t": "한 칸의 뜻이 「+1」에서 「×10」으로 바뀐 것을 두 값으로 확인하세요."
  },
  {
   "t": "기록·발견 — 두 눈금에서 같은 자료의 막대 높이 비를 표로 적으세요."
  },
  {
   "t": "적용 — 로그 눈금이 꼭 필요한 실제 자료(지진·소리·감염)를 하나 골라 이유를 쓰세요."
  }
 ],
 "13": [
  {
   "t": "구간 폭 h 를 조금씩 줄여 할선의 기울기가 변하는 것을 보세요."
  },
  {
   "t": "h 를 충분히 줄여 할선이 접선과 하나가 되게 만드세요.",
   "re": "거의 겹쳤습니다"
  },
  {
   "t": "다른 시각에서도 같은 실험 — 순간속도가 곳마다 다른 것을 확인하세요."
  },
  {
   "t": "기록·발견 — h = 1, 0.1, 0.01 에서 평균속도를 표로 적고 어디로 다가가는지 쓰세요."
  },
  {
   "t": "적용 — 구간 단속(평균속도)과 순간 단속의 차이를 이 화면으로 설명하세요."
  }
 ],
 "14": [
  {
   "t": "카드번호 검증기에 번호를 넣어 판정을 받아 보세요."
  },
  {
   "t": "한 자리만 바꿔 오타를 만들어 검증기에 딱 걸리게 하세요.",
   "re": "잘못된 번호"
  },
  {
   "t": "검산 숫자를 조절해 검증기를 통과하는 번호를 직접 만드세요.",
   "re": "유효한 번호"
  },
  {
   "t": "기록·발견 — 어떤 자리를 바꾸면 잡히고 어떤 맞바꿈은 안 잡히는지 표로 적으세요."
  },
  {
   "t": "적용 — 2배 하는 자리가 왜 필요한지(이웃 맞바꿈 검출) 실험 근거로 쓰세요."
  }
 ],
 "15": [
  {
   "t": "그래프를 클릭해 점을 몇 개 찍어 직선이 스스로 조정되는 것을 확인하세요."
  },
  {
   "t": "데이터를 지운 뒤, 점들을 거의 일렬로 5개 이상 찍어 결정계수를 0.95 이상으로 올리세요.",
   "re": "R² = 0\\.9[5-9]"
  },
  {
   "t": "이상치를 하나 추가해 직선이 얼마나 끌려가는지 관찰하세요."
  },
  {
   "t": "기록·발견 — 이상치 전과 후의 잔차제곱합·결정계수를 표로 적으세요."
  },
  {
   "t": "적용 — 공부시간→성적 예측 직선이라면 이상치를 지워야 할까요? 근거를 쓰세요."
  }
 ],
 "16": [
  {
   "t": "학습률을 작게 두고 공이 계곡 바닥으로 내려가는 것을 관찰하세요."
  },
  {
   "t": "기울기가 0 에 가까워지는 지점까지 진행하세요 — 왜 거기서 멈추나요?"
  },
  {
   "t": "학습률을 크게 올려 공을 골짜기 밖으로 튕겨 보세요.",
   "re": "발산!"
  },
  {
   "t": "기록·발견 — 학습률 3가지에서 (걸음 수, 운명) 표를 만드세요."
  },
  {
   "t": "적용 — 이동 규칙 x ← x − η·f′ 에서 마이너스의 뜻을 그림으로 쓰세요."
  }
 ],
 "17": [
  {
   "t": "점을 조금 뿌려 원 안·밖 개수와 π 추정값이 나타나는 것을 확인하세요."
  },
  {
   "t": "점을 1000개 넘게 뿌려 오차를 0.1 미만으로 줄이세요.",
   "re": "(\\d{1,3},\\d{3}|\\d{4,})개 중 원 안[\\s\\S]*오차 0\\.0"
  },
  {
   "t": "뿌릴 때마다 추정값이 달라지는 것을 3회 반복으로 확인하세요."
  },
  {
   "t": "기록·발견 — (점 수, 추정값, 오차) 를 표로 적고 규칙을 쓰세요."
  },
  {
   "t": "적용 — 점을 100배 뿌리면 오차가 몇 배쯤 줄어들지 예측한 뒤 실험으로 판정하세요."
  }
 ],
 "18": [
  {
   "t": "내 취향 슬라이더를 움직여 추천 영화가 바뀌는 것을 확인하세요."
  },
  {
   "t": "취향을 정반대로 바꿔 추천이 뒤집히는 조합을 찾으세요."
  },
  {
   "t": "두 취향 벡터의 사잇각이 가장 작아지는 경우를 만들어 보세요."
  },
  {
   "t": "기록·발견 — 취향 3조합에서 코사인 유사도를 표로 적으세요."
  },
  {
   "t": "적용 — 유사도가 같아도 취향의 강도가 다를 수 있는 예를 만들어 쓰세요."
  }
 ],
 "19": [
  {
   "t": "세 필터를 하나씩 적용해 결과 그림의 차이를 관찰하세요."
  },
  {
   "t": "경계 검출 행렬의 값을 읽고, 왜 경계에서 값이 커지는지 픽셀 하나로 계산해 보세요."
  },
  {
   "t": "평균 필터가 픽셀을 어떻게 뭉개는지 성분곱을 따라가 보세요."
  },
  {
   "t": "기록·발견 — 필터 3종의 (행렬, 효과) 표를 만드세요."
  },
  {
   "t": "적용 — 세로선만 강조하는 3×3 행렬을 설계하고 근거를 쓰세요."
  }
 ],
 "20": [
  {
   "t": "기본음만 켜고 소리를 들어 보세요 — 파형이 매끈합니다."
  },
  {
   "t": "2배음·3배음을 섞어 파형이 울퉁해지는 것을 눈과 귀로 확인하세요."
  },
  {
   "t": "배음 조합을 바꿔 「같은 높이, 다른 음색」 두 소리를 만드세요."
  },
  {
   "t": "기록·발견 — 배음 조합 3가지의 (진폭, 파형 모양, 들리는 느낌) 표를 만드세요."
  },
  {
   "t": "적용 — 배음을 더해도 주기는 왜 변하지 않는지 근거를 쓰세요."
  }
 ],
 "21": [
  {
   "t": "네 함수를 차례로 전환하며 원함수·역함수 그래프를 관찰하세요 (무리함수까지)."
  },
  {
   "t": "대응점 연결선을 켜 (a,b) 가 (b,a) 로 옮겨 가는 것을 확인하세요."
  },
  {
   "t": "원점 점대칭 토글과 비교 — y=x 대칭과 무엇이 다른지 찾으세요."
  },
  {
   "t": "기록·발견 — 함수 4종의 (원함수 정의역, 역함수 정의역) 표를 만드세요."
  },
  {
   "t": "적용 — 제한 없는 이차함수의 역이 왜 함수가 아닌지 화면 근거로 쓰세요."
  }
 ],
 "22": [
  {
   "t": "기하급수의 항을 계속 쌓아 부분합 점이 쌓이는 것을 관찰하세요."
  },
  {
   "t": "L 과 ε 을 옮겨 어느 번째부터 끝까지 벗어나지 않는 상태를 만드세요 — 이것이 수렴의 정의입니다.",
   "re": "부터 지금까지"
  },
  {
   "t": "공비를 1보다 크게 — 합이 커지기만 하는 급수를 만드세요.",
   "re": "커서 발산"
  },
  {
   "t": "조화급수로 전환 — 항은 0으로 가는데 합은 어떻게 되는지 확인하세요.",
   "re": "합은 발산"
  },
  {
   "t": "교대급수로 전환 — 합이 ln 2 로 조여드는 이유를 확인하고 기록하세요.",
   "re": "번갈아 상쇄"
  }
 ],
 "23": [
  {
   "t": "항을 5개 넘게 쌓아 다항식이 곡선에 달라붙는 것을 관찰하세요.",
   "re": "P[5-9]|P1\\d"
  },
  {
   "t": "평가점 x 를 중심에서 멀리 끌어 일치 자리수가 무너지는 것을 확인하세요.",
   "re": "소수 [0-2]자리까지 일치"
  },
  {
   "t": "수렴반경 밖으로 나가 항을 늘려도 소용없는 영역을 확인하세요.",
   "re": "바깥입니다"
  },
  {
   "t": "기록·발견 — (항 수, 일치 자리수) 표를 두 위치에서 만드세요."
  },
  {
   "t": "적용 — 계산기가 sin 을 몇 항으로 계산하면 8자리 정확한지 실험으로 정하세요."
  }
 ],
 "24": [
  {
   "t": "원판 수를 바꿔 계단 모양이 그릇에 다가가는 것을 관찰하세요."
  },
  {
   "t": "원판을 늘려 오차를 1% 미만으로 줄이세요.",
   "re": "오차 = 0\\.\\d\\d"
  },
  {
   "t": "원판 2배 → 오차가 대략 절반이 되는지 두 번 확인하세요."
  },
  {
   "t": "기록·발견 — (원판 수, 부피 근사값, 오차) 표를 만드세요."
  },
  {
   "t": "적용 — 원판의 합이 적분으로 넘어가는 이유를 자기 말로 쓰세요."
  }
 ],
 "25": [
  {
   "t": "두 소수 p·q 를 아무 값으로 두고 한 번 돌려 보세요 — 나눠 본 횟수가 곧 시간입니다."
  },
  {
   "t": "p·q 를 작게 두고 「나눠 본 횟수」를 읽어 두세요."
  },
  {
   "t": "p·q 를 모두 60 이상으로 — 횟수가 어떻게 치솟는지 잡으세요."
  },
  {
   "t": "√N 까지만 보면 되는 이유를 표의 두 막대로 확인하세요."
  },
  {
   "t": "적용 — 자리 수가 하나 늘 때 뚫는 시간이 몇 배로 뛰는지 예측을 쓰고, 실험으로 확인하세요."
  }
 ],
 "26": [
  {
   "t": "수직선에서 더하기·빼기 화살표를 한 번씩 놓아 이동 방향을 눈으로 확인하세요."
  },
  {
   "t": "덧셈 화살표를 네 방향(+·−짝) 모두 관찰하세요."
  },
  {
   "t": "뺄셈이 덧셈과 반대 방향이 되는 경우를 만드세요."
  },
  {
   "t": "a−(−b) 가 오른쪽으로 가는 이유를 기록표에 남기세요."
  },
  {
   "t": "적용 — 영하 7도에서 12도 오른 뒤 5도 내리면? 식을 쓰고 화살표로 검산하세요."
  }
 ],
 "27": [
  {
   "t": "n 을 1→2→3 으로 바꾸며 개수가 얼마씩 늘어나는지 읽으세요."
  },
  {
   "t": "n 을 1~5 로 바꾸며 성냥개비 수의 규칙을 보세요."
  },
  {
   "t": "세 식(3n+1 …)이 항상 같은 값임을 표로 확인하세요."
  },
  {
   "t": "n=100 일 때의 개수를 식으로 예측해 적으세요."
  },
  {
   "t": "적용 — 칸이 100개일 때의 개수를 식으로 먼저 구하고 화면 값과 맞춰 보세요."
  }
 ],
 "28": [
  {
   "t": "양변에 같은 수를 한 번 더해 저울이 그대로 수평인 것을 확인하세요."
  },
  {
   "t": "양변에 같은 조작을 해 균형이 유지되는 것을 보세요."
  },
  {
   "t": "2x+3=11 을 x 만 남을 때까지 풀어내세요."
  },
  {
   "t": "한쪽만 건드려 균형이 깨지는 반례를 만들어 두세요."
  },
  {
   "t": "적용 — 3x+2=14 를 저울 조작만으로 풀고, 각 단계에서 무엇을 했는지 쓰세요."
  }
 ],
 "29": [
  {
   "t": "받침점(또는 x)을 움직여 다른 쪽 값이 어떻게 따라 변하는지 한 번 관찰하세요."
  },
  {
   "t": "정비례에서 y÷x 가 일정한 것을 확인하세요."
  },
  {
   "t": "반비례로 바꿔 x×y 가 일정한 것을 발견하세요."
  },
  {
   "t": "두 관계의 그래프 모양 차이를 기록하세요."
  },
  {
   "t": "적용 — 무게 60 을 힘 15 로 들려면 거리 비를 어떻게 해야 할지 계산하고 확인하세요."
  }
 ],
 "30": [
  {
   "t": "평행선 위 동위각 두 개의 값을 읽어 같은지 확인하세요."
  },
  {
   "t": "평행일 때 동위각이 같은 것을 관찰하세요."
  },
  {
   "t": "평행을 깨서 각이 어긋나는 순간을 잡으세요."
  },
  {
   "t": "엇각까지 같은 짝을 모두 찾아 정리하세요."
  },
  {
   "t": "적용 — 엇각·동측내각까지 세 쌍의 관계를 표로 정리하세요."
  }
 ],
 "31": [
  {
   "t": "SSS 조건으로 삼각형을 한 번 만들어 두 삼각형이 겹치는지 보세요."
  },
  {
   "t": "세 변(SSS)으로 합동인 삼각형을 만드세요."
  },
  {
   "t": "두 변과 끼이지 않은 각(SSA)의 반례를 만드세요."
  },
  {
   "t": "합동 조건이 세 가지뿐인 이유를 기록하세요."
  },
  {
   "t": "적용 — 합동 조건이 SSS·SAS·ASA 셋뿐인 이유를 반례와 함께 쓰세요."
  }
 ],
 "32": [
  {
   "t": "중심각을 움직여 호의 길이가 따라 변하는 것을 확인하세요."
  },
  {
   "t": "중심각을 바꾸며 호의 길이 변화를 보세요."
  },
  {
   "t": "넓이도 중심각에 비례하는지 확인하세요."
  },
  {
   "t": "원그래프 32% 조각의 각도를 계산해 맞히세요."
  },
  {
   "t": "적용 — 하루 24시간 중 수면 8시간의 원그래프 중심각을 계산하고 화면으로 검산하세요."
  }
 ],
 "33": [
  {
   "t": "자료에서 평균·중앙값·최빈값 세 값을 먼저 읽으세요."
  },
  {
   "t": "평균·중앙값·최빈값을 나란히 읽으세요."
  },
  {
   "t": "세 대푯값의 추천이 갈리는 자료를 만드세요."
  },
  {
   "t": "신발 가게가 최빈값을 쓰는 이유를 적으세요."
  },
  {
   "t": "적용 — 신발 가게 주인이라면 어느 대푯값으로 주문할지, 이유를 자료로 쓰세요."
  }
 ],
 "34": [
  {
   "t": "계급 폭을 한 번 바꿔 히스토그램 모양이 변하는 것을 보세요."
  },
  {
   "t": "계급 폭을 바꾸며 모양 변화를 관찰하세요."
  },
  {
   "t": "같은 자료가 완전히 다르게 보이는 폭을 찾으세요."
  },
  {
   "t": "정직한 폭의 기준을 제안해 기록하세요."
  },
  {
   "t": "적용 — 같은 자료가 다르게 보이는 「과장 폭」과 「정직한 폭」을 정해 근거를 쓰세요."
  }
 ],
 "35": [
  {
   "t": "두 톱니 수를 아무 값으로 두고 다시 만날 때까지 돌려 보세요."
  },
  {
   "t": "톱니를 돌려 처음 자리로 돌아오는 때를 보세요."
  },
  {
   "t": "gcd × lcm = a × b 를 기록표에서 발견하세요."
  },
  {
   "t": "서로소인 두 수로 같은 규칙을 확인하세요."
  },
  {
   "t": "적용 — 최대공약수×최소공배수 = 두 수의 곱이 새 숫자 두 쌍에서도 성립하는지 확인하고 이유를 쓰세요."
  }
 ],
 "36": [
  {
   "t": "세 변 길이로 삼각형 작도를 한 번 완성해 보세요."
  },
  {
   "t": "되는 세 변으로 삼각형을 작도하세요."
  },
  {
   "t": "안 되는 세 변(합이 부족)을 직접 찾으세요."
  },
  {
   "t": "한 변을 고정하고 되는 범위를 구해 적으세요."
  },
  {
   "t": "적용 — 한 변을 10으로 고정할 때 삼각형이 되는 나머지 두 변의 범위를 구하고 실험으로 확인하세요."
  }
 ],
 "37": [
  {
   "t": "정삼각형 타일로 바닥을 한 번 채워 보세요."
  },
  {
   "t": "정삼각형·정사각형으로 바닥을 채워 보세요."
  },
  {
   "t": "정오각형이 안 되는 이유를 각도로 확인하세요."
  },
  {
   "t": "두 종류를 섞은 타일을 설계해 보세요."
  },
  {
   "t": "적용 — 두 종류 정다각형을 섞은 나만의 타일 설계를 만들고 꼭짓점 각도 합으로 증명하세요."
  }
 ],
 "38": [
  {
   "t": "회전체 하나를 돌려 어떤 입체가 생기는지 확인하세요."
  },
  {
   "t": "회전체의 단면이 모두 원인 것을 확인하세요."
  },
  {
   "t": "v − e + f = 2 를 세 입체에서 세어 보세요."
  },
  {
   "t": "공식이 깨질 만한 도형이 있을지 기록하세요."
  },
  {
   "t": "적용 — 꼭짓점−모서리+면 을 세 입체에서 계산해 표로 만들고, 항상 2가 되는지 쓰세요."
  }
 ],
 "39": [
  {
   "t": "부피를 고정한 채 가로·세로를 움직여 겉넓이 변화를 보세요."
  },
  {
   "t": "부피를 고정하고 겉넓이 변화를 관찰하세요."
  },
  {
   "t": "겉넓이가 가장 작은 모양을 찾아내세요."
  },
  {
   "t": "택배 상자의 이상적 비율을 제안하세요."
  },
  {
   "t": "적용 — 부피 1000 상자의 겉넓이가 가장 작은 모양을 찾아 비율을 제안하세요."
  }
 ],
 "40": [
  {
   "t": "카드 몇 장을 줄기·잎 자리에 놓아 보세요."
  },
  {
   "t": "카드를 넣어 줄기와 잎 그림을 완성하세요."
  },
  {
   "t": "히스토그램과 견줘 무엇을 잃는지 확인하세요."
  },
  {
   "t": "두 반을 등맞댄 그림으로 비교해 보세요."
  },
  {
   "t": "적용 — 히스토그램과 견줘 줄기와 잎 그림이 지켜 주는 정보가 무엇인지 쓰세요."
  }
 ],
 "41": [
  {
   "t": "한 계급의 도수를 상대도수로 바꿔 읽어 보세요."
  },
  {
   "t": "도수를 상대도수로 바꿔 읽으세요."
  },
  {
   "t": "상대도수의 합이 언제나 1 인 것을 확인하세요."
  },
  {
   "t": "크기가 다른 두 반을 비교해 판정하세요."
  },
  {
   "t": "적용 — 크기가 다른 두 반 중 어느 쪽이 더 잘했는지 상대도수로 판정하고 근거를 쓰세요."
  }
 ],
 "42": [
  {
   "t": "표본을 한 번 뽑아 표본평균을 읽으세요."
  },
  {
   "t": "표본 하나를 뽑아 평균을 읽으세요."
  },
  {
   "t": "여러 번 뽑아 흔들림 폭을 재세요."
  },
  {
   "t": "표본을 키우면 폭이 좁아지는지 확인하세요."
  },
  {
   "t": "적용 — 표본 크기를 4배로 늘리면 흔들림 폭이 어떻게 되는지 예측하고 실험으로 확인하세요."
  }
 ],
 "43": [
  {
   "t": "동류항 타일을 같은 색끼리 한 번 모아 보세요."
  },
  {
   "t": "동류항 타일을 종류별로 분류하세요."
  },
  {
   "t": "3x 와 2 를 왜 못 묶는지 반례로 확인하세요."
  },
  {
   "t": "분배법칙으로 괄호를 풀어 정리하세요."
  },
  {
   "t": "적용 — 2(3x+1)−(x−4) 를 타일로 정리하고 식 계산과 맞춰 보세요."
  }
 ],
 "44": [
  {
   "t": "그래프의 한 구간을 짚어 무슨 일이 벌어지는 구간인지 읽어 보세요."
  },
  {
   "t": "이야기와 그래프를 짝지어 보세요."
  },
  {
   "t": "평평한 구간의 뜻을 판정하세요."
  },
  {
   "t": "내 하루를 거리-시간 그래프로 그려 보세요."
  },
  {
   "t": "적용 — 내 하루를 시간-거리 그래프로 그리고 평평한 구간의 뜻을 쓰세요."
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
    + `<b>수업 포인트</b> — ${L.note}<br><br><b>수학</b> ${L.m.join(' · ')} &nbsp;|&nbsp; <b>AI 연계</b> ${L.a.join(' · ')}`;
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
  // 실험 사다리 — STEP 을 넘어야 다음이 열린다 (실습 3단계 이상 + 생각 단계)
  if(typeof MISSIONS!=='undefined' && MISSIONS[i+1]) stepLadder($('#mBody'), MISSIONS[i+1]);
  // 예상 먼저 쓰기 — 손으로 쓰기 전에는 실험 화면을 열지 않는다
  if(typeof PREDICT!=='undefined' && PREDICT[i+1]) predictGate($('#mBody'), PREDICT[i+1]);
  $('#mask').classList.add('on');
}
$('#mX').onclick=()=>{$('#mask').classList.remove('on');audioStop();};
$('#mask').onclick=e=>{if(e.target.id==='mask'){$('#mask').classList.remove('on');audioStop();}};

/* ---------- LAB 1 GPS ---------- */
function gpsDemo(root){
  root.innerHTML=`<div class="row">
   <div class="col"><canvas id="g1" width="380" height="330"></canvas></div>
   <div class="col">
   ${slider('gx','내 실제 위치 x',1,9,0.1,5.4,'')}
   ${slider('gy','내 실제 위치 y',1,9,0.1,4.2,'')}
   ${slider('gn','거리 측정 오차',0,1.2,0.05,0,'')}
   ${slider('gk','사용 기준점 수',1,3,1,3,' 개')}
   <div class="out mono" id="gout"></div></div></div>`;
  const A=[[1.2,1.5],[8.6,2.0],[4.8,8.6]],C=['#2563EB','#0E9384','#B45309'];
  const cv=$('#g1'),ctx=cv.getContext('2d'),W=380,H=330,P=26,S=(W-2*P)/10;
  const X=v=>P+v*S, Y=v=>H-P-v*S;
  function draw(){
    const px=+$('#gx').value,py=+$('#gy').value,nz=+$('#gn').value,k=+$('#gk').value;
    $('#gxv').textContent=px.toFixed(1);$('#gyv').textContent=py.toFixed(1);
    $('#gnv').textContent=nz.toFixed(2);$('#gkv').textContent=k+' 개';
    axes(ctx,W,H,P);
    let txt='';
    for(let i=0;i<k;i++){
      const d=Math.hypot(px-A[i][0],py-A[i][1]);
      const dm=d+(i===0?nz:i===1?-nz*0.7:nz*0.5);
      ctx.strokeStyle=C[i];ctx.lineWidth=1.8;ctx.beginPath();
      ctx.arc(X(A[i][0]),Y(A[i][1]),Math.max(dm,0.05)*S,0,7);ctx.stroke();
      ctx.fillStyle=C[i];ctx.beginPath();ctx.arc(X(A[i][0]),Y(A[i][1]),5,0,7);ctx.fill();
      ctx.font='11px sans-serif';ctx.fillText('P'+(i+1),X(A[i][0])+8,Y(A[i][1])-8);
      txt+=`(x−${A[i][0]})² + (y−${A[i][1]})² = ${dm.toFixed(2)}²\n`;
    }
    ctx.fillStyle='#BE123C';ctx.beginPath();ctx.arc(X(px),Y(py),6,0,7);ctx.fill();
    ctx.fillStyle='#111827';ctx.font='bold 12px sans-serif';ctx.fillText('내 위치',X(px)+9,Y(py)+4);
    $('#gout').innerHTML=txt.trim().replace(/\n/g,'<br>')+
      `<br><br>→ ${k===1?'원 위 어디든 가능 (위치 미확정)':k===2?'교점 2개 — 아직 후보가 둘':nz>0?'오차 때문에 한 점에서 만나지 않음 → <b>가장 그럴듯한 위치</b> 추정 필요':'세 원이 <b>한 점</b>에서 만남 → 위치 확정!'}`;
  }
  ['gx','gy','gn','gk'].forEach(i=>$('#'+i).oninput=draw); draw();
}

/* ---------- LAB 2 BAYES ---------- */
function bayesDemo(root){
  const W={'무료':0.92,'당첨':0.95,'클릭':0.88,'대출':0.90,'광고':0.85,'긴급':0.75,
           '회의':0.10,'과제':0.08,'수업':0.06,'안녕':0.20,'감사':0.15,'내일':0.25};
  root.innerHTML=`<div class="row"><div class="col">
    <label class="ctl">문자 내용을 입력하세요</label>
    <textarea id="bt" rows="3">무료 대출 당첨 지금 클릭</textarea>
    <div class="btns">
      <button class="b" id="bgo">스팸 확률 계산</button>
      <button class="b g" data-s="내일 수업 자료 감사합니다">정상 문자 예시</button>
      <button class="b g" data-s="긴급 광고 무료 회의">애매한 문자</button>
    </div>
    <div class="out" id="bout"></div></div>
    <div class="col"><label class="ctl">단어별 P(스팸 | 단어) 사전</label>
    <table class="t"><tr><th>단어</th><th>P</th><th>단어</th><th>P</th></tr>
    ${Object.keys(W).reduce((a,k,i)=>{const v=W[k];
      return a+(i%2===0?`<tr><td>${k}</td><td>${v}</td>`:`<td>${k}</td><td>${v}</td></tr>`);},'')}</table>
    </div></div>`;
  function calc(){
    const s=$('#bt').value;
    const hits=Object.keys(W).filter(k=>s.includes(k));
    if(!hits.length){$('#bout').innerHTML='사전에 있는 단어가 없습니다. 위 표의 단어를 넣어 보세요.';return;}
    let num=1,den=1;
    hits.forEach(k=>{num*=W[k];den*=(1-W[k]);});
    const p=num/(num+den);
    const bar=Math.round(p*100);
    $('#bout').innerHTML=`발견 단어: <b>${hits.join(', ')}</b><br>
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
  root.innerHTML=`<div class="row"><div class="col"><canvas id="s1" width="380" height="300"></canvas></div>
  <div class="col">${slider('sr','증가율 r',0.05,1,0.05,0.35,'')}
  ${slider('sk','포화 한계 K (만 뷰)',20,100,5,60,'')}
  ${slider('sn','초기값 N₀',0.1,5,0.1,0.5,'')}
  <div class="out" id="sout"></div></div></div>`;
  const cv=$('#s1'),ctx=cv.getContext('2d'),W=380,H=300,P=30;
  function draw(){
    const r=+$('#sr').value,K=+$('#sk').value,N0=+$('#sn').value;
    $('#srv').textContent=r.toFixed(2);$('#skv').textContent=K;$('#snv').textContent=N0.toFixed(1);
    axes(ctx,W,H,P);
    const T=24,ymax=K*1.15;
    const px=t=>P+(W-2*P)*t/T, py=v=>H-P-(H-2*P)*Math.min(v,ymax)/ymax;
    // linear
    ctx.strokeStyle='#9CA3AF';ctx.setLineDash([4,4]);ctx.lineWidth=1.6;ctx.beginPath();
    for(let t=0;t<=T;t+=.5){const v=N0+r*K*0.12*t;ctx.lineTo(px(t),py(v));}ctx.stroke();ctx.setLineDash([]);
    // exponential
    ctx.strokeStyle='#B45309';ctx.lineWidth=2;ctx.beginPath();
    for(let t=0;t<=T;t+=.25){const v=N0*Math.pow(1+r,t);if(v>ymax*1.2)break;ctx.lineTo(px(t),py(v));}ctx.stroke();
    // logistic
    ctx.strokeStyle='#2563EB';ctx.lineWidth=2.6;ctx.beginPath();
    for(let t=0;t<=T;t+=.25){const v=K/(1+((K-N0)/N0)*Math.exp(-r*t));ctx.lineTo(px(t),py(v));}ctx.stroke();
    ctx.strokeStyle='#E5E7EB';ctx.setLineDash([2,3]);ctx.beginPath();ctx.moveTo(P,py(K));ctx.lineTo(W-P,py(K));ctx.stroke();ctx.setLineDash([]);
    ctx.font='11px sans-serif';ctx.fillStyle='#2563EB';ctx.fillText('로지스틱',W-P-58,py(K)+16);
    ctx.fillStyle='#B45309';ctx.fillText('지수',P+8,P+14);
    ctx.fillStyle='#9CA3AF';ctx.fillText('선형',P+8,H-P-8);
    const dt=Math.log(2)/Math.log(1+r);
    $('#sout').innerHTML=`<span class="mono">지수: N = N₀(1+r)^t &nbsp; / &nbsp; 로지스틱: N = K / (1 + ((K−N₀)/N₀)e^(−rt))</span><br><br>
      배가시간 = log2 / log(1+r) = <b>${dt.toFixed(2)}일</b> → 이 값이 “며칠 만에 두 배”의 정체입니다.<br>
      12일 뒤: 지수 <b>${(N0*Math.pow(1+r,12)).toFixed(1)}</b>만 / 로지스틱 <b>${(K/(1+((K-N0)/N0)*Math.exp(-r*12))).toFixed(1)}</b>만`;
  }
  ['sr','sk','sn'].forEach(i=>$('#'+i).oninput=draw); draw();
}

/* ---------- LAB 4 LUHN ---------- */
function luhnDemo(root){
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
        ${ok?'✔ 유효한 번호 (10으로 나누어떨어짐)':'✘ 잘못된 번호 — 오타가 있습니다'}</div>`;
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
    <div class="btns"><button class="b g" id="rclr">데이터 지우기</button>
    <button class="b g" id="rout2">이상치 하나 추가</button></div>
    <div class="note" style="margin-top:14px">잔차(빨간 선분)의 <b>제곱합 SSE</b>가 최소가 되도록 직선이 자동 조정됩니다. 이것이 “학습”의 가장 단순한 형태입니다.</div>
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
      const sse=pts.reduce((s,p)=>s+(p[1]-(a*p[0]+b))**2,0);
      const sst=pts.reduce((s,p)=>s+(p[1]-my)**2,0);
      $('#rout').innerHTML=`<span class="mono" style="font-size:15px">ŷ = ${a.toFixed(3)}x + ${b.toFixed(3)}</span><br><br>
        데이터 ${n}개 · 잔차제곱합 SSE = <b>${sse.toFixed(3)}</b><br>
        결정계수 R² = <b>${sst?(1-sse/sst).toFixed(3):'—'}</b><br><br>
        <span style="font-size:12.5px;color:#6B7280">a = Σ(xᵢ−x̄)(yᵢ−ȳ) / Σ(xᵢ−x̄)² &nbsp;,&nbsp; b = ȳ − a·x̄</span>`;
    } else $('#rout').textContent='점을 2개 이상 찍어 주세요.';
    ctx.fillStyle='#111827';pts.forEach(p=>{ctx.beginPath();ctx.arc(X(p[0]),Y(p[1]),4.5,0,7);ctx.fill();});
  }
  cv.onclick=e=>{const r=cv.getBoundingClientRect();
    const x=iX((e.clientX-r.left)*W/r.width), y=iY((e.clientY-r.top)*H/r.height);
    if(x>=0&&x<=10&&y>=0&&y<=10){pts.push([x,y]);draw();}};
  $('#rclr').onclick=()=>{pts=[];draw();};
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
      <div class="note" style="margin-top:12px">각 픽셀마다 주변 3×3 값에 행렬을 <b>성분별로 곱해 더한 값</b>을 새 밝기로 씁니다. CNN이 “특징을 추출한다”는 말의 실체입니다.</div></div>
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
      o.type='sine';o.frequency.value=220*h;g.gain.value=a[i]/tot;o.connect(g);g.connect(g0);
      o.start();o.stop(AC.currentTime+2);OSC.push(o);});};
  $('#wstop').onclick=audioStop;
  draw();
}
