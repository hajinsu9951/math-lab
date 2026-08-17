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
 link:'공통수학2 역함수·무리함수 단원의 발견 활동입니다. 공식을 주지 말고 여러 함수의 역함수를 직접 구하게 한 뒤 <b>공통점을 학생이 말하게</b> 하십시오. 도형의 y = x 대칭이동 [10공수2-01-07] 과 하나로 이으면 통합적 사고가 완성됩니다.'}
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
{n:4,core:1,t:'“어느 요금제가 이득일까?” 손익분기',q:'두 요금제, 몇 분부터 갈아타야 이득일까?',
 m:['일차함수','기울기와 y절편','연립방정식(교점)'],a:['선형 비용 모델','손익분기 분석'],
 note:'네 슬라이더를 움직여 보세요. 분당 요금을 같게 맞추면 두 직선이 <b>평행</b>해져 교점이 사라집니다. “해가 없다”가 그래프에서 무엇인지 눈으로 보는 순간입니다. 기본료는 y절편, 분당 요금은 기울기라는 대응도 그대로 드러납니다.',
 build:planDemo},
{n:5,core:1,t:'“저 건물 몇 층일까?” 드론으로 높이 재기',q:'올라가지 않고 건물 높이를 어떻게 잴까?',
 m:['삼각비 tan','직각삼각형','각도와 라디안'],a:['드론 측량','레이저 거리계·LiDAR'],
 note:'각을 재고 거리를 알면 <b>tan 하나</b>로 높이가 나옵니다. 눈높이를 더하는 것을 빠뜨리면 실제보다 낮게 나오는데, 이 “한 항의 누락”이 측량에서 가장 흔한 실수입니다.',
 build:trigDemo},
{n:6,core:1,t:'“정말 관계가 있을까?” 산점도와 상관계수',q:'공부 시간과 성적, 정말 관계가 있을까?',
 m:['산점도','상관계수 r','평균·표준편차'],a:['특성 선택','상관 ≠ 인과'],
 note:'관계의 세기를 −100%에서 +100%까지 바꿔 보고, 구석에 <b>이상치</b>를 하나 찍어 보세요. r 이 얼마나 흔들리는지 바로 보입니다. r 은 반드시 −1과 1 사이라는 것도 화면에서 확인됩니다.',
 build:corrDemo},
{n:7,core:1,t:'“평균 연봉”의 함정 — 대푯값과 이상치',q:'평균 연봉 8천만 원, 이 회사 정말 좋은 회사일까?',
 m:['평균·중앙값·최빈값','이상치','자료의 분포'],a:['데이터 전처리','robust 통계'],
 note:'사장님 연봉 하나만 올려 보세요. <b>평균은 끌려가는데 중앙값은 버팁니다.</b> “평균보다 적게 받는 사람이 몇 명인지”가 함께 나오므로, 대푯값을 왜 골라 써야 하는지가 숫자로 드러납니다.',
 build:repDemo},
{n:8,core:1,t:'“내 비밀번호 안전할까?” 경우의 수',q:'내 비밀번호, 몇 초 만에 뚫릴까?',
 m:['경우의 수','중복순열 kⁿ','지수의 위력'],a:['탐색 공간','무차별 대입 공격'],
 note:'자리 수를 하나 늘리는 것과 문자 종류를 늘리는 것 중 <b>무엇이 더 강력한지</b> 비교해 보세요. 밑이 커지는 것과 지수가 커지는 것의 차이를 눈으로 보는 자리입니다. 로그 눈금 막대라 12자리까지 한 화면에 들어옵니다.',
 build:pwDemo},
{n:9,core:1,t:'“0.5% 뽑기, 200번이면 나올까?”',q:'확률 0.5%짜리를 200번 뽑으면 나올까?',
 m:['확률의 뜻','여사건','큰 수의 법칙'],a:['표본과 추정','시뮬레이션'],
 note:'뽑는 횟수를 늘리면 파란 실험 곡선이 주황 이론선으로 <b>수렴</b>합니다. 동시에 “적어도 한 번 당첨될 확률 1 − (1−p)ⁿ”이 함께 나와서, 감으로 찍은 답이 왜 틀리는지 숫자로 드러납니다.',
 build:lawDemo},
{n:10,core:1,t:'“내 점수는 몇 등급?” 정규분포와 표준점수',q:'같은 78점인데 왜 등급이 다를까?',
 m:['정규분포','표준편차','표준점수 z'],a:['특성 표준화','정규화(normalization)'],
 note:'점수를 그대로 둔 채 <b>표준편차만</b> 바꿔 보세요. z 와 백분위가 크게 달라집니다. 원점수로는 비교할 수 없고 z 로 바꿔야 한다는 것이 곡선 위에서 그대로 보입니다.',
 build:zDemo},
{n:11,core:1,t:'“복리가 왜 무서울까?” 72의 법칙',q:'적금과 대출, 두 배가 되는 데 몇 년 걸릴까?',
 m:['지수함수','로그','등비수열'],a:['누적 비용 모델','학습률 감쇠'],
 note:'단리(회색 직선)와 복리(파란 곡선)를 겹쳐 놓았습니다. 기간을 늘릴수록 차이가 벌어지는 것이 그대로 보이고, <b>두 배 되는 햇수</b>를 로그로 구한 값과 72의 법칙 어림값이 얼마나 가까운지도 나란히 확인됩니다.',
 build:cmpDemo},
{n:12,core:1,t:'“왜 로그로 그릴까?” 로그 스케일',q:'지진 규모 7과 8은 몇 배 차이일까?',
 m:['로그의 뜻','자릿수','로그 그래프'],a:['로그 손실','데이터 시각화'],
 note:'같은 자료를 <b>보통 눈금과 로그 눈금</b>으로 번갈아 보세요. 보통 눈금에서는 작은 값들이 바닥에 붙어 아무것도 안 보이다가, 로그로 바꾸는 순간 전부 비교 가능해집니다. 축을 바꾸는 것이 왜 “해석”인지 알게 됩니다.',
 build:logDemo},
{n:13,core:1,t:'“단속 카메라는 어떻게 알까?” 순간속도',q:'한 순간의 속도를 어떻게 잴 수 있을까?',
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
 build:symDemo}
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
   '원함수와 역함수가 y = x 대각선에 대칭인 그래프와 뒤바뀐 대응점')
];

const cw=$('#cards');
LABS.forEach((L,i)=>{
  const c=el(`<div class="card">
    <div class="no">LAB ${String(i+1).padStart(2,'0')} <span class="badge ${L.core?'b-core':'b-ext'}">${L.core?'연수 편성':'확장 후보'}</span></div>
    ${THUMBS[i]||''}
    <h3>${L.t}</h3>
    <div class="q">${L.q}</div>
    <div class="tags">${L.m.slice(0,2).map(x=>`<span class="tag m">${x}</span>`).join('')}${L.a.slice(0,1).map(x=>`<span class="tag a">${x}</span>`).join('')}</div>
    <div class="go">▶ 직접 조작해 보기</div></div>`);
  c.onclick=()=>open(L,i); cw.appendChild(c);
});
function open(L,i){
  $('#mTitle').textContent=`LAB ${String(i+1).padStart(2,'0')} · ${L.t}`;
  $('#mQ').textContent=L.q;
  const P=PRINS[i];
  $('#mNote').innerHTML = (P ? `
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
    </div>` : '')
    + `<b>수업 포인트</b> — ${L.note}<br><br><b>수학</b> ${L.m.join(' · ')} &nbsp;|&nbsp; <b>AI 연계</b> ${L.a.join(' · ')}`;
  $('#mBody').innerHTML=''; L.build($('#mBody')); $('#mask').classList.add('on');
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
   <div class="col">${slider('dlr','학습률 α',0.05,1.05,0.05,0.3,'')}
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
