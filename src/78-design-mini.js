/* ================= 탭④ STEP별 미니 실험 도구 =================
   탭①의 실험실은 “개념을 보여 주는” 자료이고, 여기 도구는 그 수업의 STEP에서
   학생이 자기 값을 넣어 계산하고 손계산과 대조하는 것이 목적이다.
   그래서 답만 뱉지 않고 반드시 중간 과정을 함께 보여 준다. */

const mfmt = (v, d) => (Math.round(v * Math.pow(10, d||2)) / Math.pow(10, d||2)).toLocaleString('ko-KR');
function miniBox(root, title, ctlHTML, outId){
  root.innerHTML = `<div class="mnb"><div class="mnt">${title}</div>
    <div class="mnc">${ctlHTML}</div><div class="mno" id="${outId}"></div></div>`;
}
const num = (id, label, val, step) =>
  `<label class="mnl">${label}<input type="number" id="${id}" value="${val}" step="${step||'any'}"></label>`;

/* ---------- 손글씨 답안판 ----------
   태블릿 펜·손가락·마우스 모두 pointer 이벤트 하나로 받는다. 필압이 있으면 굵기에 반영한다.
   학생이 식을 손으로 쓰는 것이 이 과제의 본체이므로, 칸을 넉넉히 두고 지우개와 내려받기를 붙였다. */
function writePad(root, label){
  let H = 240;
  root.innerHTML = `<div class="wpb">
    <div class="wph"><span class="wpt">✎ 풀이와 답안 — 손·펜·마우스로 직접 쓰세요</span>
      <span class="wpc">
        <button class="b g sm" data-t="big">칸 넓히기</button>
        <button class="wpk on" data-c="#111827" title="검정"></button>
        <button class="wpk" data-c="#2563EB" title="파랑"></button>
        <button class="wpk" data-c="#BE123C" title="빨강"></button>
        <button class="b g sm" data-t="er">지우개</button>
        <button class="b g sm" data-t="cl">전체 지우기</button>
        <button class="b g sm" data-t="dl">이미지로 저장</button>
      </span></div>
    <canvas class="wpcv"></canvas></div>`;
  const cv = root.querySelector('canvas'), cx = cv.getContext('2d');
  const S = { col:'#111827', er:false, drawing:false, last:null, dpr:Math.min(2, window.devicePixelRatio||1) };
  let strokes = [];                                   // 크기가 바뀌어도 다시 그리기 위해 보관
  function fit(){
    const w = Math.max(240, root.clientWidth || 320);
    cv.width = w*S.dpr; cv.height = H*S.dpr;
    cv.style.width='100%'; cv.style.height=H+'px';
    cx.setTransform(S.dpr,0,0,S.dpr,0,0);
    redraw(w);
  }
  function redraw(w){
    cx.clearRect(0,0,cv.width,cv.height);
    cx.fillStyle='#fff'; cx.fillRect(0,0,cv.width,cv.height);
    cx.strokeStyle='#EEF1F5'; cx.lineWidth=1;                 // 공책 줄
    for(let y=32;y<H;y+=32){ cx.beginPath();cx.moveTo(8,y);cx.lineTo((w||cv.width/S.dpr)-8,y);cx.stroke(); }
    strokes.forEach(st=>{
      cx.strokeStyle=st.c; cx.lineCap='round'; cx.lineJoin='round';
      for(let i=1;i<st.p.length;i++){
        cx.lineWidth=st.w*(st.p[i][2]||1);
        cx.beginPath();cx.moveTo(st.p[i-1][0],st.p[i-1][1]);cx.lineTo(st.p[i][0],st.p[i][1]);cx.stroke();
      }
    });
  }
  const pos = e => { const r=cv.getBoundingClientRect();
    return [ (e.clientX-r.left)*(cv.width/S.dpr)/(r.width||1), (e.clientY-r.top)*H/(r.height||H),
             e.pressure && e.pressure>0 ? 0.5+e.pressure : 1 ]; };
  cv.addEventListener('pointerdown', e=>{
    e.preventDefault(); cv.setPointerCapture(e.pointerId);
    S.drawing=true;
    strokes.push({ c:S.er?'#ffffff':S.col, w:S.er?18:2.2, p:[pos(e)] });
    redraw();
  });
  cv.addEventListener('pointermove', e=>{
    if(!S.drawing) return;
    strokes[strokes.length-1].p.push(pos(e)); redraw();
  });
  ['pointerup','pointercancel','pointerleave'].forEach(t=>cv.addEventListener(t,()=>{S.drawing=false;}));
  root.querySelectorAll('.wpk').forEach(b=>b.onclick=()=>{
    root.querySelectorAll('.wpk').forEach(x=>x.classList.remove('on'));
    b.classList.add('on'); S.col=b.dataset.c; S.er=false;
    root.querySelector('[data-t=er]').classList.remove('on');
  });
  root.querySelector('[data-t=er]').onclick = e =>{ S.er=!S.er; e.target.classList.toggle('on',S.er); };
  root.querySelector('[data-t=cl]').onclick = ()=>{ if(strokes.length && confirm('쓴 내용을 모두 지웁니다.')){ strokes=[]; redraw(); } };
  root.querySelector('[data-t=dl]').onclick = ()=>{
    const a=document.createElement('a');
    a.href=cv.toDataURL('image/png');
    a.download=(label||'풀이와 답안').replace(/[\\/:*?"<>|]/g,'')+'.png'; a.click();
  };
  root.querySelector('[data-t=big]').onclick = e =>{
    H = H>=560 ? 240 : H+160; e.target.textContent = H>=560 ? '칸 줄이기' : '칸 넓히기'; fit();
  };
  if(window.ResizeObserver) new ResizeObserver(()=>fit()).observe(root);
  fit();
}

const MINI = {

/* ---------- GPS 수행평가 ---------- */
/* STEP 0 — 지도에서 직접 찍는 방식.
   구글 지도를 iframe·API 로 끼워 넣으면 외부 접속이 필요해져 단일 파일·오프라인 원칙이 깨진다.
   그래서 지도 자체는 페이지 안에서 그리고, 실제 지도 앱은 새 탭으로 여는 버튼으로 잇는다. */
geo(root){
  const W=384, H=288, MPP=800/W;           // 가로 384px = 800 m
  const G = { base:[36.3209,127.3822], A:[0,0], B:[600,600], drag:null };
  root.innerHTML = `<div class="mnb"><div class="mnt">STEP 0 · 지도에서 두 지점 찍기 → 거리 재기</div>
    <div class="mnc">
      <label class="mnl">기준점(원점) 위도<input type="number" id="g_bla" value="36.3209" step="0.0001"></label>
      <label class="mnl">기준점 경도<input type="number" id="g_blo" value="127.3822" step="0.0001"></label>
      <span class="mnhint">지도 위를 <b>끌어서</b> A·B를 옮기세요. 눈금 한 칸 = 100 m</span>
    </div>
    <div class="mnmap"><canvas id="g_cv" width="${W}" height="${H}"></canvas></div>
    <div class="mnc" id="g_ll"></div>
    <div class="mno" id="g_out"></div>
    <div class="mnc mnbtns">
      <button class="b g sm" id="g_open">구글 지도에서 두 지점 보기 ↗</button>
      <button class="b g sm" id="g_kakao">카카오맵에서 A 지점 열기 ↗</button>
      <button class="b g sm" id="g_reset">예시 값으로</button>
    </div></div>`;
  const cv=$('#g_cv'), cx=cv.getContext('2d');
  const toLL = p => {                       // [동쪽 m, 북쪽 m] → [위도, 경도]
    const la = G.base[0] + p[1]/111000;
    const lo = G.base[1] + p[0]/(111000*Math.cos(G.base[0]*Math.PI/180));
    return [la, lo];
  };
  const X = m => 24 + m/MPP, Y = m => H-30 - m/MPP;
  function draw(){
    cx.clearRect(0,0,W,H);
    cx.fillStyle='#F4F6F4'; cx.fillRect(0,0,W,H);
    // 간이 거리 격자 + 도로
    cx.strokeStyle='#E2E6E2';
    for(let m=0;m<=800;m+=100){ cx.beginPath();cx.moveTo(X(m),0);cx.lineTo(X(m),H);cx.stroke();
      cx.beginPath();cx.moveTo(0,Y(m));cx.lineTo(W,Y(m));cx.stroke(); }
    cx.strokeStyle='#D8DCD8'; cx.lineWidth=9;
    [200,500].forEach(m=>{cx.beginPath();cx.moveTo(0,Y(m));cx.lineTo(W,Y(m));cx.stroke();});
    [250,600].forEach(m=>{cx.beginPath();cx.moveTo(X(m),0);cx.lineTo(X(m),H);cx.stroke();});
    cx.lineWidth=1;
    // 두 점과 잇는 선 + 직각삼각형
    const a=G.A, b=G.B;
    cx.strokeStyle='#B45309'; cx.setLineDash([4,3]);
    cx.beginPath();cx.moveTo(X(a[0]),Y(a[1]));cx.lineTo(X(b[0]),Y(a[1]));cx.lineTo(X(b[0]),Y(b[1]));cx.stroke();
    cx.setLineDash([]);
    cx.strokeStyle='#2563EB'; cx.lineWidth=2.4;
    cx.beginPath();cx.moveTo(X(a[0]),Y(a[1]));cx.lineTo(X(b[0]),Y(b[1]));cx.stroke();
    [[a,'A','#BE123C'],[b,'B','#0E9384']].forEach(([p,t,c])=>{
      cx.fillStyle=c;cx.beginPath();cx.arc(X(p[0]),Y(p[1]),7,0,7);cx.fill();
      cx.fillStyle='#fff';cx.font='bold 10px sans-serif';cx.textAlign='center';cx.textBaseline='middle';
      cx.fillText(t,X(p[0]),Y(p[1]));cx.textAlign='left';cx.textBaseline='alphabetic';});
    // 축척 막대
    cx.fillStyle='#374151';cx.font='10px sans-serif';
    cx.fillRect(24,H-16,100/MPP,3); cx.fillText('100 m',26+100/MPP,H-11);
    calc();
  }
  function calc(){
    const [la1,lo1]=toLL(G.A), [la2,lo2]=toLL(G.B);
    const dla=la2-la1, dlo=lo2-lo1, phi=(la1+la2)/2, cosp=Math.cos(phi*Math.PI/180);
    const ns=dla*111000, ew=dlo*111000*cosp, d=Math.hypot(ns,ew);
    $('#g_ll').innerHTML =
      `<span class="mnpt a">A · 위도 ${mfmt(la1,6)} · 경도 ${mfmt(lo1,6)}</span>
       <span class="mnpt b">B · 위도 ${mfmt(la2,6)} · 경도 ${mfmt(lo2,6)}</span>`;
    $('#g_out').innerHTML=
      `<div class="mnr">Δ위도 = ${mfmt(dla,6)}° &nbsp;·&nbsp; Δ경도 = ${mfmt(dlo,6)}°</div>
       <div class="mnr">cos(${mfmt(phi,4)}°) = <b>${mfmt(cosp,4)}</b> ← 경도에만 곱하는 값</div>
       <div class="mnr">세로 거리 = ${mfmt(dla,6)} × 111,000 = <b>${mfmt(ns,1)} m</b></div>
       <div class="mnr">가로 거리 = ${mfmt(dlo,6)} × 111,000 × ${mfmt(cosp,4)} = <b>${mfmt(ew,1)} m</b></div>
       <div class="mnr big">두 지점 거리 = √(${mfmt(ew,1)}² + ${mfmt(ns,1)}²) = <b>${mfmt(d,1)} m</b></div>
       <div class="mnr">좌표평면으로 옮기면 (1칸 = 100 m) A(0, 0) · B(${mfmt(ew/100,2)}, ${mfmt(ns/100,2)}) →
         √(${mfmt(ew/100,2)}² + ${mfmt(ns/100,2)}²) × 100 = <b>${mfmt(d,1)} m</b> · 두 값이 같은지 확인</div>`;
  }
  const pick = e => {
    const r=cv.getBoundingClientRect();
    // 탭이 숨겨져 있으면 rect 가 0 이 되어 0 으로 나누게 된다. 그때는 캔버스 원래 크기를 쓴다.
    const sw = r.width  || W, sh = r.height || H;
    const mx=((e.clientX-r.left)*W/sw-24)*MPP, my=((H-30)-(e.clientY-r.top)*H/sh)*MPP;
    const fix = v => Number.isFinite(v) ? Math.max(0,Math.min(800,v)) : 0;
    return [fix(mx), fix(my)];
  };
  const near = (p,q) => Math.hypot(X(p[0])-X(q[0]), Y(p[1])-Y(q[1])) < 16;
  cv.style.cursor='grab';
  cv.onpointerdown = e => { const m=pick(e);
    G.drag = near(m,G.A) ? 'A' : near(m,G.B) ? 'B' : null;
    if(!G.drag){ G.drag = Math.hypot(m[0]-G.A[0],m[1]-G.A[1]) < Math.hypot(m[0]-G.B[0],m[1]-G.B[1]) ? 'A':'B'; }
    G[G.drag]=m; cv.setPointerCapture(e.pointerId); cv.style.cursor='grabbing'; draw(); };
  cv.onpointermove = e => { if(G.drag){ G[G.drag]=pick(e); draw(); } };
  cv.onpointerup = () => { G.drag=null; cv.style.cursor='grab'; };
  ['g_bla','g_blo'].forEach(i=>$('#'+i).oninput=()=>{
    G.base=[+$('#g_bla').value, +$('#g_blo').value]; draw(); });
  $('#g_reset').onclick = ()=>{ G.A=[0,0]; G.B=[600,600]; draw(); };
  $('#g_open').onclick = ()=>{ const [a,b]=[toLL(G.A),toLL(G.B)];
    window.open(`https://www.google.com/maps/dir/${a[0]},${a[1]}/${b[0]},${b[1]}`,'_blank','noopener'); };
  $('#g_kakao').onclick = ()=>{ const a=toLL(G.A);
    window.open(`https://map.kakao.com/link/map/A지점,${a[0]},${a[1]}`,'_blank','noopener'); };
  draw();
},

divpt(root){
  miniBox(root, '내분점 계산기 — 비를 바꿔 가며',
    num('d_x1','A의 x',2,0.5)+num('d_y1','A의 y',1,0.5)+num('d_x2','B의 x',8,0.5)+num('d_y2','B의 y',7,0.5)+
    num('d_m','비 m',1,1)+num('d_n','비 n',2,1), 'd_out');
  const cv=el('<canvas width="300" height="220" class="mncv"></canvas>');
  const calc=()=>{
    const x1=+$('#d_x1').value,y1=+$('#d_y1').value,x2=+$('#d_x2').value,y2=+$('#d_y2').value;
    const m=+$('#d_m').value,n=+$('#d_n').value, s=m+n;
    if(!s) return;
    const px=(m*x2+n*x1)/s, py=(m*y2+n*y1)/s, mx=(x1+x2)/2, my=(y1+y2)/2;
    $('#d_out').innerHTML=
      `<div class="mnr">P = ( (m·x₂ + n·x₁)/(m+n) , (m·y₂ + n·y₁)/(m+n) )</div>
       <div class="mnr">= ( (${m}·${x2} + ${n}·${x1})/${s} , (${m}·${y2} + ${n}·${y1})/${s} )</div>
       <div class="mnr big"><b>${m} : ${n} 내분점 = (${mfmt(px)}, ${mfmt(py)})</b></div>
       <div class="mnr">참고 · 중점 M = (${mfmt(mx)}, ${mfmt(my)})</div>`;
    $('#d_out').appendChild(cv);
    const c=cv.getContext('2d'), X=v=>20+v*26, Y=v=>200-v*26;
    c.clearRect(0,0,300,220); c.strokeStyle='#EEE';
    for(let i=0;i<=10;i++){c.beginPath();c.moveTo(X(i),Y(0));c.lineTo(X(i),Y(7.5));c.stroke();
      c.beginPath();c.moveTo(X(0),Y(i*0.75));c.lineTo(X(10),Y(i*0.75));c.stroke();}
    c.strokeStyle='#9CA3AF';c.lineWidth=1.6;c.beginPath();c.moveTo(X(x1),Y(y1));c.lineTo(X(x2),Y(y2));c.stroke();
    c.fillStyle='#111827';[[x1,y1,'A'],[x2,y2,'B']].forEach(p=>{
      c.beginPath();c.arc(X(p[0]),Y(p[1]),4,0,7);c.fill();
      c.font='bold 11px sans-serif';c.fillText(p[2],X(p[0])+6,Y(p[1])-6);});
    c.fillStyle='#0E9384';c.beginPath();c.arc(X(mx),Y(my),3.5,0,7);c.fill();
    c.fillStyle='#BE123C';c.beginPath();c.arc(X(px),Y(py),5,0,7);c.fill();
    c.font='bold 11px sans-serif';c.fillText('P',X(px)+7,Y(py)-6);
  };
  ['d_x1','d_y1','d_x2','d_y2','d_m','d_n'].forEach(i=>$('#'+i).oninput=calc); calc();
},

perp(root){
  miniBox(root, '수직·평행 직선 구하기 — 도로 ax + by + c = 0',
    num('p_a','a',3,1)+num('p_b','b',4,1)+num('p_c','c',-12,1)+
    num('p_px','점 P의 x',5,0.5)+num('p_py','점 P의 y',4,0.5), 'p_out');
  const calc=()=>{
    const a=+$('#p_a').value,b=+$('#p_b').value,c=+$('#p_c').value,x=+$('#p_px').value,y=+$('#p_py').value;
    const sl = b!==0 ? -a/b : null;
    // 평행: a x + b y = a x0 + b y0   /   수직: b x - a y = b x0 - a y0
    const par=a*x+b*y, per=b*x-a*y;
    $('#p_out').innerHTML=
      `<div class="mnr">도로의 기울기 = −a/b = ${sl===null?'정의되지 않음(세로선)':mfmt(sl,3)}</div>
       <div class="mnr"><b>평행</b> — 기울기가 같아야 하므로 a, b 를 그대로 두고 상수만 바꿉니다.</div>
       <div class="mnr big">${a}x + ${b}y − ${mfmt(par,2)} = 0</div>
       <div class="mnr"><b>수직</b> — 기울기 곱이 −1 이 되려면 a 와 b 를 맞바꾸고 부호를 하나 뒤집습니다.</div>
       <div class="mnr big">${b}x − ${a}y − ${mfmt(per,2)} = 0</div>
       <div class="mnr">검산 · 두 기울기의 곱 = ${sl===null||a===0?'—':mfmt(sl*(b/a),3)} (−1 이어야 함)</div>`;
  };
  ['p_a','p_b','p_c','p_px','p_py'].forEach(i=>$('#'+i).oninput=calc); calc();
},

pdist(root){
  miniBox(root, '점과 직선 사이 거리 — 세 후보 비교',
    num('q_a','a',3,1)+num('q_b','b',4,1)+num('q_c','c',-12,1)+
    num('q_x1','M의 x',5,0.5)+num('q_y1','M의 y',4,0.5)+
    num('q_x2','P₁의 x',4,0.5)+num('q_y2','P₁의 y',3,0.5)+
    num('q_x3','P₂의 x',6,0.5)+num('q_y3','P₂의 y',5,0.5), 'q_out');
  const calc=()=>{
    const a=+$('#q_a').value,b=+$('#q_b').value,c=+$('#q_c').value, den=Math.hypot(a,b);
    const pts=[['M',+$('#q_x1').value,+$('#q_y1').value],['P₁',+$('#q_x2').value,+$('#q_y2').value],
               ['P₂',+$('#q_x3').value,+$('#q_y3').value]];
    const ds=pts.map(p=>({n:p[0],x:p[1],y:p[2],d:Math.abs(a*p[1]+b*p[2]+c)/den}));
    const min=Math.min(...ds.map(o=>o.d));
    $('#q_out').innerHTML=
      `<div class="mnr">d = |ax₀ + by₀ + c| / √(a² + b²) &nbsp;·&nbsp; 분모 √(${a}² + ${b}²) = <b>${mfmt(den,3)}</b></div>`
      + ds.map(o=>`<div class="mnr ${o.d===min?'hit':''}">${o.n}(${o.x}, ${o.y}) →
          |${a}·${o.x} + ${b}·${o.y} + ${c}| / ${mfmt(den,3)} = <b>${mfmt(o.d,2)}</b>${o.d===min?' ← 가장 가까움':''}</div>`).join('');
  };
  ['q_a','q_b','q_c','q_x1','q_y1','q_x2','q_y2','q_x3','q_y3'].forEach(i=>$('#'+i).oninput=calc); calc();
},

circline(root){
  miniBox(root, '원과 직선의 위치 관계 판정기',
    num('c_h','중심 x',5,0.5)+num('c_k','중심 y',4,0.5)+num('c_r','반지름 r',4,0.1)+
    num('c_a','a',3,1)+num('c_b','b',4,1)+num('c_c','c',-12,1), 'c_out');
  const cv=el('<canvas width="300" height="230" class="mncv"></canvas>');
  const calc=()=>{
    const h=+$('#c_h').value,k=+$('#c_k').value,r=+$('#c_r').value,
          a=+$('#c_a').value,b=+$('#c_b').value,c0=+$('#c_c').value;
    const den=Math.hypot(a,b)||1, d=Math.abs(a*h+b*k+c0)/den;
    const rel = d<r ? '두 점에서 만난다 (할선)' : Math.abs(d-r)<1e-9 ? '한 점에서 만난다 (접선)' : '만나지 않는다';
    const cls = d<r ? 'ok' : Math.abs(d-r)<1e-9 ? 'mid' : 'no';
    $('#c_out').innerHTML=
      `<div class="mnr">원 : (x − ${h})² + (y − ${k})² = ${mfmt(r*r,2)}</div>
       <div class="mnr">중심에서 직선까지 d = |${a}·${h} + ${b}·${k} + ${c0}| / ${mfmt(den,3)} = <b>${mfmt(d,3)}</b></div>
       <div class="mnr big ${cls}">d = ${mfmt(d,2)} ${d<r?'<':Math.abs(d-r)<1e-9?'=':'>'} r = ${mfmt(r,2)} → <b>${rel}</b></div>`;
    $('#c_out').appendChild(cv);
    const cx=cv.getContext('2d'), X=v=>20+v*26, Y=v=>210-v*26;
    cx.clearRect(0,0,300,230); cx.strokeStyle='#EEE';
    for(let i=0;i<=10;i++){cx.beginPath();cx.moveTo(X(i),Y(0));cx.lineTo(X(i),Y(8));cx.stroke();
      cx.beginPath();cx.moveTo(X(0),Y(i*0.8));cx.lineTo(X(10),Y(i*0.8));cx.stroke();}
    cx.strokeStyle='#111827';cx.lineWidth=1.8;cx.beginPath();
    if(b!==0){cx.moveTo(X(0),Y(-c0/b));cx.lineTo(X(10),Y((-c0-a*10)/b));}
    else {cx.moveTo(X(-c0/a),Y(0));cx.lineTo(X(-c0/a),Y(8));}
    cx.stroke();
    cx.strokeStyle=d<r?'#0E9384':d>r?'#BE123C':'#B45309';cx.lineWidth=2.2;
    cx.beginPath();cx.arc(X(h),Y(k),r*26,0,7);cx.stroke();
    cx.fillStyle='#2563EB';cx.beginPath();cx.arc(X(h),Y(k),3.5,0,7);cx.fill();
  };
  ['c_h','c_k','c_r','c_a','c_b','c_c'].forEach(i=>$('#'+i).oninput=calc); calc();
},

/* ---------- y = x 대칭의 발견 수행평가 ---------- */
invfn(root){
  miniBox(root, '역함수 계산기 — x 와 y 를 맞바꾸면',
    `<label class="mnl">함수 종류<select id="v_k">
       <option value="lin">일차 f(x) = ax + b</option>
       <option value="rat">유리 f(x) = (ax + b)/(cx + d)</option></select></label>`
    +num('v_a','a',2,1)+num('v_b','b',-3,1)+num('v_c','c',0,1)+num('v_d','d',1,1)
    +num('v_t','확인할 x 값',3,0.5), 'v_out');
  const cv=el('<canvas width="300" height="300" class="mncv"></canvas>');
  const calc=()=>{
    const k=$('#v_k').value, a=+$('#v_a').value, b=+$('#v_b').value,
          c=+$('#v_c').value, d=+$('#v_d').value, t=+$('#v_t').value;
    $('#v_c').parentNode.style.display = k==='rat' ? '' : 'none';
    $('#v_d').parentNode.style.display = k==='rat' ? '' : 'none';
    let f, g, fs, gs, steps;
    if(k==='lin'){
      f=x=>a*x+b; g=y=>(y-b)/a;
      fs=`f(x) = ${a}x ${b<0?'−':'+'} ${Math.abs(b)}`;
      gs=`f⁻¹(x) = (x ${b<0?'+':'−'} ${Math.abs(b)}) / ${a}`;
      steps=[`y = ${a}x ${b<0?'−':'+'} ${Math.abs(b)} 에서 x 와 y 를 맞바꾼다`,
             `x = ${a}y ${b<0?'−':'+'} ${Math.abs(b)}`,
             `y 에 대해 풀면 → ${gs}`];
    } else {
      f=x=>(a*x+b)/(c*x+d); g=y=>(d*y-b)/(-c*y+a);
      // 역함수의 계수 (d, −b) / (−c, a) 를 약분하고 부호를 정리해 교과서 형태로 만든다.
      // 그러지 않으면 (−1x − 1)/(−1x + 2) 처럼 나와 채점기준의 (x+1)/(x−2) 와 모양이 달라진다.
      const gcd=(m,n)=>{m=Math.abs(m);n=Math.abs(n);while(n){[m,n]=[n,m%n];}return m||1;};
      let A=d, B=-b, C=-c, D=a;
      const k=gcd(gcd(A,B),gcd(C,D));
      if(k>1){A/=k;B/=k;C/=k;D/=k;}
      if(C<0 || (C===0 && D<0)){A=-A;B=-B;C=-C;D=-D;}   // 분모의 x 계수를 양수로
      const lin=(m,n)=>{
        const mx = m===0 ? '' : (m===1?'x':m===-1?'−x':`${m}x`);
        if(n===0) return mx || '0';
        return (mx? mx+' ' : '') + (n<0?'− ':'+ ') + Math.abs(n);
      };
      fs=`f(x) = (${lin(a,b)}) / (${lin(c,d)})`;
      gs=`f⁻¹(x) = (${lin(A,B)}) / (${lin(C,D)})`;
      steps=[`y = (${lin(a,b)}) / (${lin(c,d)}) 에서 x 와 y 를 맞바꾼다`,
             `x(${lin(c,d).replace(/x/,'y')}) = ${lin(a,b).replace(/x/,'y')} 로 분모를 넘긴다`,
             `y 에 대해 정리하면 → ${gs}`];
    }
    const ft=f(t), gt=g(ft);
    $('#v_out').innerHTML =
      `<div class="mnr">${fs}</div>`
      + steps.map((s,i)=>`<div class="mnr">${i+1}. ${s}</div>`).join('')
      + `<div class="mnr big">${gs}</div>
         <div class="mnr">대응점 확인 · f(${t}) = <b>${mfmt(ft,3)}</b> 이므로 원함수 위의 점은 (${t}, ${mfmt(ft,3)})</div>
         <div class="mnr">역함수 위의 점은 좌표가 뒤바뀐 (${mfmt(ft,3)}, ${mfmt(gt,3)}) → f⁻¹(f(${t})) = <b>${mfmt(gt,3)}</b></div>`;
    $('#v_out').appendChild(cv);
    const cx=cv.getContext('2d'), S=28, O=150, X=v=>O+v*S, Y=v=>O-v*S;
    cx.clearRect(0,0,300,300);
    cx.strokeStyle='#EEE'; for(let i=-5;i<=5;i++){
      cx.beginPath();cx.moveTo(X(i),0);cx.lineTo(X(i),300);cx.stroke();
      cx.beginPath();cx.moveTo(0,Y(i));cx.lineTo(300,Y(i));cx.stroke();}
    cx.strokeStyle='#9CA3AF';cx.beginPath();cx.moveTo(0,O);cx.lineTo(300,O);
    cx.moveTo(O,0);cx.lineTo(O,300);cx.stroke();
    cx.strokeStyle='#B45309';cx.setLineDash([4,3]);cx.beginPath();
    cx.moveTo(X(-5),Y(-5));cx.lineTo(X(5),Y(5));cx.stroke();cx.setLineDash([]);
    const plot=(fn,col)=>{ cx.strokeStyle=col;cx.lineWidth=2.2;cx.beginPath();let up=true;
      for(let px=0;px<=300;px++){ const x=(px-O)/S, y=fn(x);
        if(!isFinite(y)||Math.abs(y)>8){up=true;continue;}
        if(up){cx.moveTo(px,Y(y));up=false;} else cx.lineTo(px,Y(y)); }
      cx.stroke(); };
    plot(f,'#2563EB'); plot(g,'#0E9384');
    cx.fillStyle='#6B7280';cx.font='10px sans-serif';
    cx.fillText('f(x)',8,14); cx.fillText('f⁻¹(x)',8,26); cx.fillText('y = x',8,38);
    cx.fillStyle='#2563EB';cx.fillRect(36,7,10,3);
    cx.fillStyle='#0E9384';cx.fillRect(36,19,10,3);
    cx.fillStyle='#B45309';cx.fillRect(36,31,10,3);
  };
  ['v_k','v_a','v_b','v_c','v_d','v_t'].forEach(i=>{const e=$('#'+i); e.oninput=calc; e.onchange=calc;}); calc();
},

invroot(root){
  miniBox(root, '무리함수의 역함수 — 정의역 제한이 왜 생기는가',
    num('r_p','y = √(x − p) + q 의 p',2,0.5)+num('r_q','q',1,0.5), 'r_out');
  const cv=el('<canvas width="300" height="300" class="mncv"></canvas>');
  const calc=()=>{
    const p=+$('#r_p').value, q=+$('#r_q').value;
    const f=x=>x>=p?Math.sqrt(x-p)+q:NaN, g=x=>x>=q?Math.pow(x-q,2)+p:NaN;
    $('#r_out').innerHTML=
      `<div class="mnr">1. y = √(x − ${p}) + ${q} 에서 양변에서 ${q} 를 뺀다 → y − ${q} = √(x − ${p})</div>
       <div class="mnr">2. 제곱한다 → (y − ${q})² = x − ${p}</div>
       <div class="mnr">3. x 와 y 를 맞바꾸면 → y = (x − ${q})² + ${p}</div>
       <div class="mnr big">f⁻¹(x) = (x − ${q})² + ${p} ,&nbsp; 단 <b>x ≥ ${q}</b></div>
       <div class="mnr">원함수 · 정의역 x ≥ <b>${p}</b> , 치역 y ≥ <b>${q}</b></div>
       <div class="mnr">역함수 · 정의역 x ≥ <b>${q}</b> ← 원함수의 <b>치역</b>이 그대로 옵니다</div>
       <div class="mnr">← 제곱하는 순간 아래쪽 가지까지 생기므로, 제한하지 않으면 함수가 아니게 됩니다.</div>
       <div class="mnr">합성 검증 · f(f⁻¹(x)) = √((x − ${q})² + ${p} − ${p}) + ${q} = |x − ${q}| + ${q} = x (x ≥ ${q} 이므로)</div>`;
    $('#r_out').appendChild(cv);
    const cx=cv.getContext('2d'), S=26, O=90, X=v=>O+v*S, Y=v=>300-O-v*S;
    cx.clearRect(0,0,300,300);
    cx.strokeStyle='#EEE'; for(let i=-3;i<=8;i++){
      cx.beginPath();cx.moveTo(X(i),0);cx.lineTo(X(i),300);cx.stroke();
      cx.beginPath();cx.moveTo(0,Y(i));cx.lineTo(300,Y(i));cx.stroke();}
    cx.strokeStyle='#9CA3AF';cx.beginPath();cx.moveTo(0,Y(0));cx.lineTo(300,Y(0));
    cx.moveTo(X(0),0);cx.lineTo(X(0),300);cx.stroke();
    cx.strokeStyle='#B45309';cx.setLineDash([4,3]);cx.beginPath();
    cx.moveTo(X(-3),Y(-3));cx.lineTo(X(8),Y(8));cx.stroke();cx.setLineDash([]);
    // 버려지는 아래쪽 가지 — 왜 제한이 필요한지 보이기 위해 흐리게 그린다
    cx.strokeStyle='#E5E7EB';cx.lineWidth=2;cx.beginPath();
    for(let px=0;px<=300;px++){const x=(px-O)/S; if(x<q)continue; cx.lineTo(px,Y(-Math.pow(x-q,2)-p+2*p));}
    cx.stroke();
    const plot=(fn,col)=>{cx.strokeStyle=col;cx.lineWidth=2.4;cx.beginPath();let up=true;
      for(let px=0;px<=300;px++){const x=(px-O)/S,y=fn(x);
        if(!isNaN(y)&&isFinite(y)&&Math.abs(y)<12){ if(up){cx.moveTo(px,Y(y));up=false;} else cx.lineTo(px,Y(y)); } else up=true;}
      cx.stroke();};
    plot(f,'#2563EB'); plot(g,'#0E9384');
    cx.fillStyle='#6B7280';cx.font='10px sans-serif';
    cx.fillText('√ 원함수',8,14); cx.fillText('제한된 이차 = 역함수',8,26); cx.fillText('버려지는 가지',8,38);
    cx.fillStyle='#2563EB';cx.fillRect(108,7,10,3);
    cx.fillStyle='#0E9384';cx.fillRect(108,19,10,3);
    cx.fillStyle='#D1D5DB';cx.fillRect(108,31,10,3);
  };
  ['r_p','r_q'].forEach(i=>$('#'+i).oninput=calc); calc();
},

symmove(root){
  miniBox(root, '대칭 작도기 — y = x 선대칭과 점대칭을 나란히',
    `<label class="mnl">대칭 종류<select id="s_k">
       <option value="yx">y = x 대칭 (x, y) → (y, x)</option>
       <option value="o">원점 점대칭 (x, y) → (−x, −y)</option>
       <option value="pq">점 (p, q) 대칭 (x, y) → (2p−x, 2q−y)</option>
       <option value="both">셋 다 겹쳐 보기</option></select></label>`
    +num('s_p','p',3,0.5)+num('s_q','q',3,0.5)
    +`<label class="mnl">꼭짓점 (x,y 쌍)<input type="text" id="s_pts" value="1,3 3,7 2,4 5,6"></label>`, 's_out');
  const cv=el('<canvas width="320" height="320" class="mncv"></canvas>');
  const calc=()=>{
    const k=$('#s_k').value, p=+$('#s_p').value, q=+$('#s_q').value;
    const pts=($('#s_pts').value||'').trim().split(/\s+/).map(s=>s.split(',').map(Number))
              .filter(a=>a.length===2 && a.every(v=>!isNaN(v)));
    const show = k==='pq' || k==='both';
    $('#s_p').parentNode.style.display = show?'':'none';
    $('#s_q').parentNode.style.display = show?'':'none';
    const yx = pts.map(a=>[a[1],a[0]]), o = pts.map(a=>[-a[0],-a[1]]),
          pq = pts.map(a=>[2*p-a[0], 2*q-a[1]]);
    const nm='ABCDEFGH';
    const row=(t,arr,c,mk)=>`<div class="mnr" style="color:${c}">${t} : `
      + arr.map((a,i)=>`${nm[i]}${mk}(${mfmt(a[0],1)}, ${mfmt(a[1],1)})`).join('  ') + '</div>';
    let html = `<div class="mnr">원래 : ` + pts.map((a,i)=>`${nm[i]}(${a[0]}, ${a[1]})`).join('  ') + '</div>';
    if(k==='yx'||k==='both') html += row('y = x 대칭  (x, y) → (y, x)', yx, '#2563EB', '′');
    if(k==='o' ||k==='both') html += row('원점 점대칭  (x, y) → (−x, −y)', o, '#BE123C', '″');
    if(k==='pq'||k==='both') html += row(`점 (${p}, ${q}) 대칭  (x, y) → (${2*p}−x, ${2*q}−y)`, pq, '#7C3AED', '‴');
    html += `<div class="mnr big">y = x 대칭은 <b>좌표를 맞바꾸고</b>, 점대칭은 <b>부호를 뒤집습니다.</b>
             둘 다 길이와 각을 보존하므로 오목·볼록은 바뀌지 않습니다.</div>`;
    $('#s_out').innerHTML = html;
    $('#s_out').appendChild(cv);
    const cx=cv.getContext('2d'), S=20, O=160, X=v=>O+v*S, Y=v=>O-v*S;
    cx.clearRect(0,0,320,320);
    cx.strokeStyle='#F1F3F6'; for(let i=-8;i<=8;i++){
      cx.beginPath();cx.moveTo(X(i),0);cx.lineTo(X(i),320);cx.stroke();
      cx.beginPath();cx.moveTo(0,Y(i));cx.lineTo(320,Y(i));cx.stroke();}
    cx.strokeStyle='#9CA3AF';cx.beginPath();cx.moveTo(0,Y(0));cx.lineTo(320,Y(0));
    cx.moveTo(X(0),0);cx.lineTo(X(0),320);cx.stroke();
    cx.strokeStyle='#B45309';cx.setLineDash([4,3]);cx.beginPath();
    cx.moveTo(X(-8),Y(-8));cx.lineTo(X(8),Y(8));cx.stroke();cx.setLineDash([]);
    const poly=(arr,col,lab)=>{
      if(!arr.length) return;
      cx.strokeStyle=col;cx.lineWidth=2;cx.beginPath();
      arr.forEach((a,i)=>i?cx.lineTo(X(a[0]),Y(a[1])):cx.moveTo(X(a[0]),Y(a[1])));
      cx.closePath();cx.stroke();
      cx.fillStyle=col;arr.forEach((a,i)=>{cx.beginPath();cx.arc(X(a[0]),Y(a[1]),3,0,7);cx.fill();
        cx.font='bold 10px sans-serif';cx.fillText(nm[i]+lab,X(a[0])+5,Y(a[1])-5);});
    };
    poly(pts,'#111827','');
    if(k==='yx'||k==='both') poly(yx,'#2563EB','′');
    if(k==='o' ||k==='both') poly(o,'#BE123C','″');
    if(k==='pq'||k==='both'){ poly(pq,'#7C3AED','‴');
      cx.fillStyle='#7C3AED';cx.beginPath();cx.arc(X(p),Y(q),4,0,7);cx.fill(); }
  };
  ['s_k','s_p','s_q','s_pts'].forEach(i=>{const e=$('#'+i);e.oninput=calc;e.onchange=calc;}); calc();
},

/* ---------- 베이즈 수행평가 ---------- */
cond(root){
  miniBox(root, '조건부확률 계산기 — 분모가 무엇인지 보기',
    num('b_ps','P(스팸)',0.3,0.01)+num('b_ws','P(단어|스팸)',0.6,0.01)+num('b_wn','P(단어|정상)',0.05,0.01), 'b_out');
  const calc=()=>{
    const ps=+$('#b_ps').value, ws=+$('#b_ws').value, wn=+$('#b_wn').value, pn=1-ps;
    const num1=ws*ps, den=ws*ps+wn*pn, post=den?num1/den:0;
    $('#b_out').innerHTML=
      `<div class="mnr">분자 = P(단어|스팸)·P(스팸) = ${ws} × ${mfmt(ps,3)} = <b>${mfmt(num1,4)}</b></div>
       <div class="mnr">분모 = 위 + P(단어|정상)·P(정상) = ${mfmt(num1,4)} + ${wn} × ${mfmt(pn,3)} = <b>${mfmt(den,4)}</b></div>
       <div class="mnr">← 분모는 “전체”가 아니라 <b>그 단어가 나올 모든 경우</b>입니다.</div>
       <div class="mnr big">P(스팸|단어) = ${mfmt(num1,4)} / ${mfmt(den,4)} = <b>${mfmt(post*100,1)}%</b></div>
       <div class="mnr">사전 ${mfmt(ps*100,1)}% → 사후 <b>${mfmt(post*100,1)}%</b> (${post>ps?'올라감':'내려감'})</div>`;
  };
  ['b_ps','b_ws','b_wn'].forEach(i=>$('#'+i).oninput=calc); calc();
},

bayeschain(root){
  miniBox(root, '단어를 하나씩 더할 때의 갱신 — 사후가 다음의 사전이 된다',
    num('n_p0','처음 P(스팸)',0.3,0.01)+
    `<label class="mnl">단어별 P(w|S) : P(w|N) — 쉼표로<input type="text" id="n_list" value="0.6:0.05, 0.4:0.1, 0.5:0.2"></label>`, 'n_out');
  const calc=()=>{
    let p=+$('#n_p0').value;
    const rows=[`<div class="mnr">시작 · P(스팸) = <b>${mfmt(p*100,1)}%</b></div>`];
    ($('#n_list').value||'').split(',').forEach((s,i)=>{
      const m=s.split(':').map(x=>parseFloat(x.trim()));
      if(m.length<2 || isNaN(m[0]) || isNaN(m[1])) return;
      const num1=m[0]*p, den=num1+m[1]*(1-p);
      const np=den?num1/den:p;
      rows.push(`<div class="mnr">단어 ${i+1} (${m[0]} : ${m[1]}) → ${mfmt(p*100,1)}% 에서
        <b>${mfmt(np*100,1)}%</b> 로 갱신</div>`);
      p=np;
    });
    rows.push(`<div class="mnr big">최종 P(스팸 | 모든 단어) = <b>${mfmt(p*100,1)}%</b></div>`);
    $('#n_out').innerHTML=rows.join('');
  };
  ['n_p0','n_list'].forEach(i=>$('#'+i).oninput=calc); calc();
},

/* ---------- 확산 수행평가 ---------- */
expmodel(root){
  miniBox(root, '지수 모델 계산기 — 직관과 얼마나 다른가',
    num('e_a','처음 값 a',10,1)+num('e_r','전파율 r',1.5,0.05)+num('e_x','며칠 뒤 x',10,1), 'e_out');
  const calc=()=>{
    const a=+$('#e_a').value, r=+$('#e_r').value, x=+$('#e_x').value;
    const y=a*Math.pow(r,x);
    let tb='<div class="mnt2">날짜별 값</div><div class="mntb">';
    for(let i=0;i<=Math.min(x,10);i++) tb+=`<span>${i}일 · ${mfmt(a*Math.pow(r,i),0)}</span>`;
    tb+='</div>';
    $('#e_out').innerHTML=
      `<div class="mnr">y = a·rˣ = ${a} × ${r}^${x}</div>
       <div class="mnr big">${x}일 뒤 = <b>${mfmt(y,0)}</b> (처음의 ${mfmt(y/a,1)}배)</div>`+tb;
  };
  ['e_a','e_r','e_x'].forEach(i=>$('#'+i).oninput=calc); calc();
},

doubling(root){
  miniBox(root, '배가시간 — 로그가 지수를 끌어내리는 자리',
    num('t_r','전파율 r',1.5,0.01), 't_out');
  const calc=()=>{
    const r=+$('#t_r').value;
    if(r<=1){ $('#t_out').innerHTML='<div class="mnr big no">r 이 1보다 커야 두 배가 됩니다.</div>'; return; }
    const t=Math.log(2)/Math.log(r);
    $('#t_out').innerHTML=
      `<div class="mnr">2 = r<sup>t</sup> 의 양변에 로그를 취하면</div>
       <div class="mnr">log 2 = t · log r &nbsp;⇒&nbsp; t = log 2 / log r</div>
       <div class="mnr">log 2 = ${mfmt(Math.log10(2),4)} &nbsp;·&nbsp; log ${r} = ${mfmt(Math.log10(r),4)}</div>
       <div class="mnr big">배가시간 t = <b>${mfmt(t,2)} 일</b></div>
       <div class="mnr">참고 · 72의 법칙 : 72 / ${mfmt((r-1)*100,1)} = ${mfmt(72/((r-1)*100),2)} 일 (근사)</div>`;
  };
  $('#t_r').oninput=calc; calc();
},

logaxis(root){
  miniBox(root, '로그 축으로 바꾸면 왜 직선이 되는가',
    num('l_a','처음 값 a',10,1)+num('l_r','전파율 r',1.5,0.05), 'l_out');
  const cv=el('<canvas width="320" height="200" class="mncv"></canvas>');
  const calc=()=>{
    const a=+$('#l_a').value, r=+$('#l_r').value;
    $('#l_out').innerHTML=
      `<div class="mnr">log y = log a + x·log r = ${mfmt(Math.log10(a),3)} + x × ${mfmt(Math.log10(r),3)}</div>
       <div class="mnr big">x 에 대한 <b>일차식</b>이므로 로그 축에서는 직선이고, 기울기는 log r = ${mfmt(Math.log10(r),3)}</div>
       <div class="mnr">아래 · 왼쪽은 보통 축, 오른쪽은 세로를 로그로 바꾼 축</div>`;
    $('#l_out').appendChild(cv);
    const c=cv.getContext('2d'); c.clearRect(0,0,320,200);
    const N=14, ys=[]; for(let i=0;i<=N;i++) ys.push(a*Math.pow(r,i));
    const mx=Math.max(...ys);
    [0,1].forEach(k=>{
      const ox=k*165+10;
      c.strokeStyle='#E5E7EB';c.strokeRect(ox,10,140,175);
      c.strokeStyle=k?'#0E9384':'#2563EB';c.lineWidth=2.2;c.beginPath();
      ys.forEach((v,i)=>{
        const px=ox+i/N*140;
        const py=k ? 185-(Math.log10(v)-Math.log10(a))/(Math.log10(mx)-Math.log10(a)||1)*170
                   : 185-v/mx*170;
        c.lineTo(px,py);
      });
      c.stroke();
      c.fillStyle='#6B7280';c.font='10px sans-serif';
      c.fillText(k?'세로축 = log y':'보통 축', ox+4, 197);
    });
  };
  ['l_a','l_r'].forEach(i=>$('#'+i).oninput=calc); calc();
}
};
