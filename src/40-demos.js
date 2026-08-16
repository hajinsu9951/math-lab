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
{n:4,core:0,t:'카드번호 검증기 (룬 알고리즘)',q:'오타 난 카드번호를 왜 즉시 잡아낼까?',
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
 build:waveDemo}
];

const cw=$('#cards');
LABS.forEach(L=>{
  const c=el(`<div class="card">
    <div class="no">LAB ${String(L.n).padStart(2,'0')} <span class="badge ${L.core?'b-core':'b-ext'}">${L.core?'연수 편성':'확장 후보'}</span></div>
    <h3>${L.t}</h3>
    <div class="q">${L.q}</div>
    <div class="tags">${L.m.slice(0,2).map(x=>`<span class="tag m">${x}</span>`).join('')}${L.a.slice(0,1).map(x=>`<span class="tag a">${x}</span>`).join('')}</div>
    <div class="go">▶ 직접 조작해 보기</div></div>`);
  c.onclick=()=>open(L); cw.appendChild(c);
});
function open(L){
  $('#mTitle').textContent=`LAB ${String(L.n).padStart(2,'0')} · ${L.t}`;
  $('#mQ').textContent=L.q;
  $('#mNote').innerHTML=`<b>수업 포인트</b> — ${L.note}<br><br><b>수학</b> ${L.m.join(' · ')} &nbsp;|&nbsp; <b>AI 연계</b> ${L.a.join(' · ')}`;
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
