# -*- coding: utf-8 -*-
"""LAB 01 「GPS 위치 추정」 수업 고도화 — LESSON[1] · PRINS[0] · LABS[0].note 교체, 삽화 4장(webp base64) 삽입.
사용: python patch_lab1.py <index.html>"""
import sys, os, base64, re
HERE = os.path.dirname(os.path.abspath(__file__))
def b64(name):
    return 'data:image/webp;base64,' + base64.b64encode(open(os.path.join(HERE, name + '.webp'), 'rb').read()).decode()

LESSON = r'''LESSON[1]={
 title:'GPS 위치 추정',
 problem:{
  q:'밤 9시, 친구에게서 전화가 옵니다. “나 지금 어딘지 모르겠어… 폰이 그러는데 <b>편의점에서 500 m, 도서관에서 500 m, 학교에서 400 m</b> 떨어져 있대.” 지도와 거리 세 개만으로 친구를 찾을 수 있을까요?',
  svg:`<img class="lsimg" src="__HERO__" alt="밤거리에서 휴대폰을 든 학생, 편의점·학교·도서관 둘레의 원 세 개가 학생이 선 자리에서 만난다">
    <svg viewBox="0 0 400 190" role="img" aria-label="세 기준점의 좌표와 물음표 위치까지의 거리가 표시된 동네 지도">
    <rect x="8" y="8" width="384" height="174" rx="10" fill="#F4F7FB" stroke="#D9E1EC"/>
    <path d="M8 128 H392 M132 8 V182 M262 8 V96" stroke="#E3E9F2" stroke-width="7"/>
    <g font-size="11.5" font-weight="800" text-anchor="middle">
      <rect x="30" y="132" width="70" height="30" rx="5" fill="#DBE7FB" stroke="#2563EB" stroke-width="1.4"/>
      <text x="65" y="151" fill="#1D4ED8">편의점 (1, 1)</text>
      <rect x="306" y="78" width="62" height="30" rx="5" fill="#D9F2EE" stroke="#0E9384" stroke-width="1.4"/>
      <text x="337" y="97" fill="#0B6E63">학교 (9, 4)</text>
      <rect x="160" y="16" width="74" height="30" rx="5" fill="#FCEBD7" stroke="#B45309" stroke-width="1.4"/>
      <text x="197" y="35" fill="#92400E">도서관 (5, 9)</text>
    </g>
    <circle cx="205" cy="104" r="13" fill="#FCE7EB" stroke="#BE123C" stroke-width="2"/>
    <text x="205" y="109" font-size="14" font-weight="800" fill="#BE123C" text-anchor="middle">?</text>
    <g stroke-dasharray="5 4" stroke-width="1.6" fill="none">
      <path d="M92 134 L194 110" stroke="#2563EB"/>
      <path d="M306 96 L218 102" stroke="#0E9384"/>
      <path d="M199 46 L204 90" stroke="#B45309"/>
    </g>
    <g font-size="11" font-weight="800" text-anchor="middle">
      <text x="136" y="114" fill="#1D4ED8">500 m</text>
      <text x="262" y="92" fill="#0B6E63">400 m</text>
      <text x="226" y="70" fill="#92400E">500 m</text>
    </g>
    <text x="205" y="134" font-size="10.5" fill="#6B7280" text-anchor="middle">1칸 = 100 m · 거리 세 개만 알고 있다</text>
  </svg>`,
  sit:'지도의 1칸은 100 m입니다. 편의점 P₁(1, 1) · 도서관 P₂(5, 9) · 학교 P₃(9, 4). <b>생각 열기</b> ─ ① “편의점에서 500 m”를 만족하는 자리는 지도 위에 몇 곳일까요? 그 자리들을 모두 모으면 무슨 도형이 될까요? ② 조건이 둘이면? 셋이면? ③ 폰의 거리 측정이 50 m쯤 틀린다면 무엇이 달라질까요? — 이 활동이 끝나면 여러분은 <b>원의 방정식 세 개를 연립해</b> 친구의 좌표를 손으로 구하게 됩니다.'
 },
 predict:{
  q:['“P₁에서 거리 5”를 만족하는 점 전체는 어떤 도형인지 이름을 쓰고, 그 도형의 <b>식</b>을 아는 대로 세워 보세요. 거리 조건이 몇 개면 위치가 하나로 정해질지 숫자로 적으세요.',
     '왜 그렇게 생각했는지 그림으로 — 원을 하나, 둘, 셋 그려 가며 후보가 어떻게 줄어드는지 표시하세요.',
     '거리에 오차가 있으면 원 세 개가 어떻게 될지, 그때 “친구 위치”를 어떻게 정할지 예상해 적으세요.'] },
 missions:[
  {t:'원 1개 — 지도에서 “편의점에서 500 m” 조건에 맞는 자리를 3곳 이상 찍어 보세요. 그리고 오른쪽 수학 노트 ①에 이 원의 방정식을 써서 확인을 통과하세요.',
   re:'미션1 달성', do:'① 「기준점 1개」 ② 파란 원 위를 눌러 초록 핀 3개 ③ 노트 ①에 (x−1)²+(y−1)²=25', hand:'핀 하나의 좌표를 식에 대입해 정말 25가 되는지 종이에 계산'},
  {t:'원 2개 — 두 원이 만나는 두 곳을 모두 찾으세요. 그다음 노트 ①·②의 두 식을 빼서 나오는 <b>직선</b>의 식을 노트 ④에 넣어 지도에 그리세요.',
   re:'미션2 달성', do:'① 「기준점 2개」 ② 교점 두 곳에 핀 ③ (x−1)²+(y−1)²=25 와 (x−5)²+(y−9)²=25 를 전개해 빼기 → x+2y=13', hand:'두 식을 빼면 x², y² 이 사라지는 이유를 한 줄로 설명'},
  {t:'원 3개 — 세 번째 원과의 차로 직선을 하나 더 얻고, 두 직선을 <b>연립</b>해 (x, y)를 손으로 구한 뒤 노트 ⑤에 입력하세요. 맞으면 친구가 나타납니다. 마지막으로 오차를 0.4 로 올려 세 원이 어떻게 되는지 보세요.',
   re:'미션3 달성', do:'① 「기준점 3개」 ② ①−③ → 8x+3y=52 ③ x+2y=13 과 연립 → (5, 4) 입력 ④ 오차 슬라이더', hand:'연립방정식 풀이 전 과정을 종이에 남기고, 구한 점을 세 식에 대입해 검산'}],
 inquiry:{
  id:'gps', title:'GPS 위치 추정 — 조건 하나는 도형 하나, 조건 셋은 점 하나',
  q:['기준점 수를 1 → 2 → 3 으로 바꿔 가며 각각 기록하세요. 오차를 0.4 로 켠 경우도 한 줄 기록하세요.',
     '「후보의 수」가 기준점 수에 따라 무한 → 2 → 1 로 줄어드는 이유를 <b>도형(원·직선·점)</b>의 말로 정리하세요.',
     '두 원의 식을 빼면 왜 직선이 되는지(x², y² 항의 소거), 그 직선이 두 교점을 모두 지나는 이유를 손으로 설명하세요. 오차가 있을 때 “가장 그럴듯한 한 점”을 어떻게 정할지도 제안하세요.'],
  cols:['기준점 수','오차','후보의 수','내 핀 (x, y)','핀의 오차 합'],
  hint:'힌트 — “P 에서 거리 r” = “중심 P, 반지름 r 인 원 위”. 원 두 개의 식을 빼면 일차식(직선), 직선 두 개를 연립하면 점 하나.' },
 apply:{
  q:`<img class="lsimg" src="__QUAKE__" alt="세 지진 관측소에서 그린 원이 진원에서 만나는 지도">
     새 문제 — 지진이 났습니다. 관측소 S₁(0, 0) · S₂(8, 0) · S₃(4, 7) 에서 P파와 S파의 도착 시간 차로 계산한 <b>진원까지의 거리</b>가 각각 5 km, 5 km, 4 km 입니다. 원의 방정식 세 개를 세워 연립하면 진원의 <b>y 좌표</b>는 얼마일까요? (1칸 = 1 km)`,
  a:3, tol:0.01,
  why:'x²+y²=25 와 (x−8)²+y²=25 를 빼면 x=4, 대입하면 y=±3. 세 번째 원 (x−4)²+(y−7)²=16 에 넣으면 y=3 만 맞습니다 — 지진학자가 진원을 찾는 방법이 바로 이 연립입니다.',
  hint:'두 식을 빼 보세요 — x 가 먼저 나옵니다. 후보가 둘 남으면 세 번째 원이 심판입니다.' },
 demo(root){
  root.innerHTML=`<div class="lg1wrap">
   <div class="lg1map">
    <canvas id="lg1" width="400" height="330"></canvas>
    <div class="ctl" style="display:flex;gap:6px;flex-wrap:wrap;margin-top:8px">
      <button class="b t sm" data-k="1">기준점 1개</button>
      <button class="b t sm" data-k="2">기준점 2개</button>
      <button class="b t sm" data-k="3">기준점 3개</button>
      <label class="ctl" style="margin:0 0 0 8px">오차
        <input type="range" id="lgz" min="0" max="0.9" step="0.1" value="0" style="width:90px"> <span id="lgzv">0.0</span></label>
      <button class="b g sm" id="lgc">핀 지우기</button></div>
    <div class="note" style="margin-top:8px"><b>지도를 클릭</b>해 “친구가 있을 만한 곳”에 핀을 꽂으세요. 1칸 = 100 m. 핀이 거리 조건에 맞으면 초록, 아니면 빨강입니다.</div>
   </div>
   <div class="lg1math">
    <div class="lg1mh">✎ 수학 노트 — 화면이 아니라 식으로 찾는다</div>
    <div class="eqc" data-i="0"><div class="eqt"><span class="eqn" style="background:#2563EB">①</span> 편의점 P₁(1, 1) · 거리 5</div>
      <div class="eqf">(x − <input class="eqi" data-f="a"> )² + (y − <input class="eqi" data-f="b"> )² = <input class="eqi w" data-f="r"></div>
      <div class="eqb"><button class="b t sm eqk">식 확인</button><span class="eqr"></span></div></div>
    <div class="eqc" data-i="1" hidden><div class="eqt"><span class="eqn" style="background:#B45309">②</span> 도서관 P₂(5, 9) · 거리 5</div>
      <div class="eqf">(x − <input class="eqi" data-f="a"> )² + (y − <input class="eqi" data-f="b"> )² = <input class="eqi w" data-f="r"></div>
      <div class="eqb"><button class="b t sm eqk">식 확인</button><span class="eqr"></span></div></div>
    <div class="eqc" data-i="2" hidden><div class="eqt"><span class="eqn" style="background:#0E9384">③</span> 학교 P₃(9, 4) · 거리 4</div>
      <div class="eqf">(x − <input class="eqi" data-f="a"> )² + (y − <input class="eqi" data-f="b"> )² = <input class="eqi w" data-f="r"></div>
      <div class="eqb"><button class="b t sm eqk">식 확인</button><span class="eqr"></span></div></div>
    <div class="eqc ln" data-l="0" hidden><div class="eqt"><span class="eqn" style="background:#7C3AED">④</span> ① − ② 를 하면 x², y² 이 사라진다 → 직선</div>
      <div class="eqf"><input class="eqi" data-f="A"> x + <input class="eqi" data-f="B"> y = <input class="eqi w" data-f="C"></div>
      <div class="eqb"><button class="b t sm lnk">직선 그리기</button><span class="eqr"></span></div></div>
    <div class="eqc ln" data-l="1" hidden><div class="eqt"><span class="eqn" style="background:#7C3AED">⑤</span> ① − ③ 도 직선 — 그리고 두 직선을 연립</div>
      <div class="eqf"><input class="eqi" data-f="A"> x + <input class="eqi" data-f="B"> y = <input class="eqi w" data-f="C"></div>
      <div class="eqf">풀면 x = <input class="eqi" data-f="x"> , y = <input class="eqi" data-f="y"></div>
      <div class="eqb"><button class="b t sm slk">위치 확정</button><span class="eqr"></span></div></div>
    <div class="note" id="lgzn" hidden>오차가 켜져 있으면 거리가 참값이 아니라 식 검사는 잠깁니다. 오차를 0으로 돌리세요.</div>
   </div>
  </div>
  <div class="out" id="lgout"></div>`;
  const cv=root.querySelector('#lg1'),ctx=cv.getContext('2d'),W=400,H=330,P=26,SC=(W-2*P)/10;
  const X=v=>P+v*SC, Y=v=>H-P-v*SC;
  /* 기준점 순서: 편의점 → 도서관 → 학교. 처음 두 원의 교점 (5,4)·(1,6) 이 모두 지도 안에 오고,
     세 식이 정수 계수라 손계산이 된다: ①−② → x+2y=13, ①−③ → 8x+3y=52, 연립 → (5,4). */
  const A=[[1,1],[5,9],[9,4]], R=[5,5,4], C=['#2563EB','#B45309','#0E9384'], NM=['편의점','도서관','학교'];
  const T=[5,4];                                        // 친구의 실제 위치 (숨김)
  const LINES=[[1,2,13],[8,3,52]];                      // ①−②, ①−③
  const S={ k:1, nz:0, pins:[], okSpots:[], found2:new Set(), eq:[false,false,false], ln:[false,false], solved:false };
  const dMeas=i=>R[i]+(i===0?S.nz:i===1?-S.nz*0.7:S.nz*0.5);
  const judge=p=>{ const e=[]; for(let i=0;i<S.k;i++) e.push(Math.abs(Math.hypot(p[0]-A[i][0],p[1]-A[i][1])-dMeas(i))); return e; };
  function inter2(){
    const [x1,y1]=A[0],[x2,y2]=A[1],r1=dMeas(0),r2=dMeas(1);
    const d=Math.hypot(x2-x1,y2-y1), a=(r1*r1-r2*r2+d*d)/(2*d), h2=r1*r1-a*a; if(h2<0) return [];
    const h=Math.sqrt(h2), mx=x1+a*(x2-x1)/d, my=y1+a*(y2-y1)/d;
    return [[mx+h*(y2-y1)/d, my-h*(x2-x1)/d],[mx-h*(y2-y1)/d, my+h*(x2-x1)/d]];
  }
  function drawLine(L,col){ const [a,b,c]=L; ctx.strokeStyle=col; ctx.lineWidth=1.6; ctx.setLineDash([6,4]); ctx.beginPath();
    if(Math.abs(b)>1e-9){ ctx.moveTo(X(0),Y((c-a*0)/b)); ctx.lineTo(X(10),Y((c-a*10)/b)); } else { ctx.moveTo(X(c/a),Y(0)); ctx.lineTo(X(c/a),Y(10)); }
    ctx.stroke(); ctx.setLineDash([]); }
  function draw(){
    axes(ctx,W,H,P);
    for(let i=0;i<S.k;i++){
      if(S.nz>0){ ctx.strokeStyle=C[i]; ctx.globalAlpha=0.18; ctx.lineWidth=Math.max(3,2*S.nz*SC); ctx.beginPath(); ctx.arc(X(A[i][0]),Y(A[i][1]),dMeas(i)*SC,0,7); ctx.stroke(); ctx.globalAlpha=1; }
      ctx.strokeStyle=C[i]; ctx.lineWidth=S.eq[i]?2.6:1.6; ctx.beginPath(); ctx.arc(X(A[i][0]),Y(A[i][1]),dMeas(i)*SC,0,7); ctx.stroke();
      ctx.fillStyle=C[i]; ctx.beginPath(); ctx.arc(X(A[i][0]),Y(A[i][1]),5,0,7); ctx.fill();
      ctx.font='bold 11px sans-serif'; ctx.fillText(NM[i]+' '+dMeas(i).toFixed(1),X(A[i][0])+8,Y(A[i][1])-8);
    }
    if(S.k>=2&&S.ln[0]) drawLine(LINES[0],'#7C3AED');
    if(S.k>=3&&S.ln[1]) drawLine(LINES[1],'#7C3AED');
    S.pins.forEach(p=>{ const ok=judge(p).every(e=>e<0.18);
      ctx.fillStyle=ok?'#0E9384':'#BE123C'; ctx.beginPath(); ctx.arc(X(p[0]),Y(p[1]),6,0,7); ctx.fill();
      ctx.strokeStyle='#fff'; ctx.lineWidth=1.6; ctx.beginPath(); ctx.arc(X(p[0]),Y(p[1]),6,0,7); ctx.stroke(); });
    if(S.solved){ ctx.fillStyle='#BE123C'; ctx.font='bold 22px sans-serif'; ctx.fillText('★',X(T[0])-8,Y(T[1])+8);
      ctx.font='bold 11px sans-serif'; ctx.fillText('친구 (5, 4)',X(T[0])+10,Y(T[1])-8); }
    root.querySelector('#lgzv').textContent=S.nz.toFixed(1);
    root.querySelector('#lgzn').hidden=!(S.nz>0);
    root.querySelectorAll('.eqc').forEach(el=>{ const i=el.dataset.i!=null?+el.dataset.i:null, l=el.dataset.l!=null?+el.dataset.l:null;
      el.hidden = i!=null ? i>=S.k : (l===0 ? S.k<2 : S.k<3); });
    const last=S.pins[S.pins.length-1]; let msg;
    if(!last) msg='지도를 클릭해 첫 핀을 꽂으세요.';
    else { const errs=judge(last), ok=errs.every(e=>e<0.18);
      msg=`마지막 핀 (${last[0].toFixed(1)}, ${last[1].toFixed(1)}) — `+errs.map((e,i)=>`P${i+1} 오차 ${e.toFixed(2)}`).join(' · ')
        +(ok?' <b style="color:#0E9384">조건 만족!</b>':' <span style="color:#BE123C">조건 미달</span>');
      if(ok){
        if(S.k===1){ S.okSpots.push(last); const far=S.okSpots.some(q=>Math.hypot(q[0]-last[0],q[1]-last[1])>0.8);
          if(S.okSpots.length>=2&&far) msg+='<br><b style="color:#B45309">조건에 맞는 곳이 또 있습니다 — 후보가 하나가 아닙니다! 원 위 어디든 가능합니다.</b>'; }
        if(S.k===2){ inter2().forEach((q,idx)=>{ if(Math.hypot(q[0]-last[0],q[1]-last[1])<0.35) S.found2.add(idx); });
          if(S.found2.size>=2) msg+='<br><b style="color:#B45309">후보 두 곳을 모두 찾았습니다 — 원 두 개의 교점 2개!</b>';
          else if(S.found2.size===1) msg+='<br><span style="color:#6B7280">교점 하나 발견 — 다른 한 곳도 찾아보세요.</span>'; }
        if(S.k===3){ if(S.nz<0.05&&Math.hypot(last[0]-T[0],last[1]-T[1])<0.25) msg+='<br><b style="color:#0E9384">세 원이 한 점에서 만납니다 — 이제 노트 ⑤에서 식으로도 확정하세요.</b>';
          else if(S.nz>=0.05) msg+='<br><span style="color:#B45309">오차가 있으면 세 원이 한 점에서 안 만납니다 — 초록 핀들이 「오차 삼각형」 안에 흩어집니다. 오차 합이 가장 작은 핀이 “가장 그럴듯한 위치”입니다.</span>'; } } }
    const far1=S.okSpots.length>=2&&S.okSpots.some(q=>S.okSpots.some(w=>Math.hypot(q[0]-w[0],q[1]-w[1])>0.8));
    const st=[]; if(far1&&S.eq[0]) st.push('🏁 미션1 달성'); if(S.found2.size>=2&&S.ln[0]) st.push('🏁 미션2 달성'); if(S.solved) st.push('🏁 미션3 달성');
    root.querySelector('#lgout').innerHTML=msg+(st.length?'<div style="margin-top:6px;font-weight:800;color:#0E9384">'+st.join(' · ')+'</div>':'');
  }
  const num=el=>{ const v=parseFloat(String(el.value).replace(/[^0-9.\-]/g,'')); return isFinite(v)?v:NaN; };
  const near=(a,b,t)=>Math.abs(a-b)<=(t||0.01);
  root.querySelectorAll('.eqc[data-i]').forEach(el=>{ const i=+el.dataset.i;
    el.querySelector('.eqk').onclick=()=>{ const r=el.querySelector('.eqr');
      if(S.nz>0){ r.innerHTML='<span style="color:#B45309">오차를 0으로 돌린 뒤 검사하세요.</span>'; return; }
      const a=num(el.querySelector('[data-f=a]')), b=num(el.querySelector('[data-f=b]')), q=num(el.querySelector('[data-f=r]'));
      const ok=near(a,A[i][0])&&near(b,A[i][1])&&near(q,R[i]*R[i]);
      S.eq[i]=ok; r.innerHTML=ok?`<b style="color:#0E9384">식${['①','②','③'][i]} 통과 — 원이 굵어집니다</b>`
        : `<span style="color:#BE123C">${!near(q,R[i]*R[i])&&near(q,R[i])?'우변은 r 이 아니라 r² 입니다.':'중심 (a, b) 와 r² 를 다시 보세요.'}</span>`; draw(); }; });
  root.querySelectorAll('.eqc.ln').forEach(el=>{ const l=+el.dataset.l;
    const chkLine=()=>{ const a=num(el.querySelector('[data-f=A]')), b=num(el.querySelector('[data-f=B]')), c=num(el.querySelector('[data-f=C]'));
      const [p,q,s]=LINES[l]; if(!(isFinite(a)&&isFinite(b)&&isFinite(c))||(a===0&&b===0)) return false;
      const k=(Math.abs(p)>0?a/p:b/q); return k!==0&&isFinite(k)&&near(b,q*k,0.02*Math.abs(k)+1e-9)&&near(c,s*k,0.02*Math.abs(k)+1e-9)&&near(a,p*k,0.02*Math.abs(k)+1e-9); };
    const btn=el.querySelector('.lnk')||el.querySelector('.slk'); btn.onclick=()=>{ const r=el.querySelector('.eqr');
      if(S.nz>0){ r.innerHTML='<span style="color:#B45309">오차를 0으로 돌린 뒤 검사하세요.</span>'; return; }
      if(!S.eq[0]||!S.eq[l+1]){ r.innerHTML='<span style="color:#B45309">먼저 원의 방정식 ①과 '+(l?'③':'②')+'을 통과하세요.</span>'; return; }
      const okL=chkLine(); S.ln[l]=okL;
      if(l===0){ r.innerHTML=okL?'<b style="color:#0E9384">직선 통과 — 두 교점을 모두 지나는 보라 점선</b>':'<span style="color:#BE123C">두 식을 전개해서 빼 보세요. x², y² 은 사라지고 x, y 항과 상수만 남습니다.</span>'; }
      else { if(!okL){ r.innerHTML='<span style="color:#BE123C">①−③ 직선이 아직 맞지 않습니다. (x−1)²+(y−1)² 에서 (x−9)²+(y−4)² 을 빼 보세요.</span>'; S.solved=false; draw(); return; }
        const x=num(el.querySelector('[data-f=x]')), y=num(el.querySelector('[data-f=y]'));
        S.solved=near(x,T[0],0.05)&&near(y,T[1],0.05);
        r.innerHTML=S.solved?'<b style="color:#0E9384">위치 확정! 친구는 (5, 4) — 손으로 푼 답이 지도와 맞습니다 🎯</b>':'<span style="color:#BE123C">직선은 맞는데 연립 풀이가 어긋납니다. x+2y=13 에서 x=13−2y 를 다른 식에 대입해 보세요.</span>'; }
      draw(); }; });
  cv.style.touchAction='none';
  cv.addEventListener('pointerdown',e=>{ const r=cv.getBoundingClientRect();
    const p=[((e.clientX-r.left)*W/r.width-P)/SC,(H-(e.clientY-r.top)*H/r.height-P)/SC];
    if(p[0]<0||p[0]>10||p[1]<0||p[1]>10) return; S.pins.push(p); if(S.pins.length>12) S.pins.shift(); draw(); });
  root.querySelectorAll('[data-k]').forEach(b=>b.onclick=()=>{ S.k=+b.dataset.k; S.okSpots=[]; S.found2=new Set(); draw(); });
  root.querySelector('#lgz').oninput=e=>{ S.nz=+e.target.value; draw(); };
  root.querySelector('#lgc').onclick=()=>{ S.pins=[]; S.okSpots=[]; S.found2=new Set(); draw(); };
  draw();
  return { read:()=>{ const last=S.pins[S.pins.length-1]; if(!last) return null; const errs=judge(last);
    return [S.k, S.nz.toFixed(1), S.k===1?'원 위 무한':S.k===2?'2곳':S.nz<0.05?'1곳':'오차 영역',
            `(${last[0].toFixed(1)}, ${last[1].toFixed(1)})`, errs.reduce((a,b)=>a+b,0).toFixed(2)]; } };
 }
};
'''

PRIN = r'''{tex:[
  {t:'\\sqrt{(x-a)^2+(y-b)^2}=r', s:'기준점 <b>(a, b)</b> 에서 잰 거리가 r 이라는 말을 두 점 사이의 거리 공식으로 그대로 옮긴 것입니다. 조건 하나가 도형 하나 — 원입니다.'},
  {t:'(x-1)^2+(y-1)^2=25,\\quad (x-5)^2+(y-9)^2=25,\\quad (x-9)^2+(y-4)^2=16', s:'양변을 제곱하면 <b>원의 방정식</b>이 됩니다. 오늘의 세 조건은 이 세 식입니다 — “거리를 안다”가 “원 위에 있다”와 같은 말이 되는 지점입니다.'},
  {t:'\\text{①}-\\text{②}:\\; x+2y=13,\\qquad \\text{①}-\\text{③}:\\; 8x+3y=52', s:'두 원의 식을 빼면 x², y² 이 <b>소거되어 일차식</b>만 남습니다. 이 직선은 두 원의 교점을 모두 지납니다(교점은 두 식을 동시에 만족하므로 차도 만족). 원의 방정식 연립이 <b>연립일차방정식</b>으로 바뀌는 순간입니다.'},
  {t:'x+2y=13,\\; 8x+3y=52 \\;\\Rightarrow\\; x=5,\\; y=4', s:'직선 둘의 교점은 하나. 세 원이 한 점을 지나면 그 점이 바로 이 해입니다. 검산: (5−9)²+(4−4)²=16 ✓. 실제 GPS는 평면이 아니라 <b>공간</b>이라 구 3개의 식 대신, 시계 오차까지 미지수로 두고 위성 4개의 식을 연립합니다.'}
 ],
 next:[
  {lv:'바로',   t:'우리 동네 좌표로 바꿔 보기', d:'지도 앱에서 학교·집·자주 가는 가게의 위도·경도를 읽어 기준점 세 곳에 넣습니다. 오차를 5 m·20 m·50 m로 바꾸며 <b>교점이 번지는 범위</b>가 실제로 몇 미터인지 재어 보세요.'},
  {lv:'심화',   t:'세 원이 안 만날 때 — 가장 그럴듯한 점', d:'거리에 오차가 있으면 세 원은 한 점에서 만나지 않습니다. 후보 점 P 에 대해 (P 에서 각 기준점까지의 거리 − 측정 거리)² 의 합을 계산하고, 이 합이 <b>가장 작은 P</b> 를 찾아보세요. 실험실의 「핀의 오차 합」이 그 값입니다 — 최소제곱법의 첫 장면입니다.'},
  {lv:'프로젝트', t:'교실 안 실내 측위 만들기', d:'교실 세 모서리를 기준점으로 두고 와이파이 신호 세기(또는 걸음 수)로 거리를 추정해 자리를 맞혀 보는 장치를 설계합니다. GPS가 안 통하는 실내를 어떻게 해결할지가 과제입니다.'}
 ],
 eq:'(x − a)² + (y − b)² = r²',
 what:'<img class="lsimg" src="__SAT__" alt="위성 세 대의 신호 구가 휴대폰 위치에서 만나는 그림">기준점에서 잰 거리가 <b>r</b> 이라는 사실 하나는 “나는 그 점을 중심으로 반지름 r 인 원 위에 있다”는 뜻입니다. 기준점이 둘이면 두 원의 교점 두 곳으로, 셋이면 한 점으로 좁혀집니다. 위치를 찾는 일이 <b>원의 방정식 연립 → 일차식 연립</b>으로 바뀌는 것이 오늘의 수학입니다. 위성 GPS 는 같은 일을 공간의 구(球)로 합니다.',
 probe:'<img class="lsimg" src="__NOISE__" alt="오차 때문에 세 원이 한 점에서 만나지 않고 작은 삼각형이 남은 그림">기준점을 1 → 2 → 3 으로 늘리면 후보가 원 전체 → 두 점 → 한 점으로 줄어듭니다. 오차를 켜면 세 원이 만나지 않고 <b>“오차 삼각형”</b>이 남는데, 그 안에서 오차 합이 가장 작은 한 점을 고르는 것이 최소제곱의 직관입니다. 폰의 GPS 가 “정확도 ±15 m”라고 말하는 것이 바로 이 삼각형의 크기입니다.',
 link:'공통수학2 「도형의 방정식」— 원의 방정식 단원의 도입·정리 두 자리에 모두 씁니다. 도입에서는 공식을 주지 말고 “거리를 안다 = 원 위에 있다”를 화면으로 먼저 겪게 한 뒤 식을 세우게 하고, 정리에서는 두 원의 식의 차(두 교점을 지나는 직선)와 연립일차방정식으로 좌표를 구하는 손계산까지 잇습니다. 평가는 노트 ①~⑤의 식·연립 풀이 과정과 탐구 보고서(오차가 있을 때 위치를 정하는 방법 제안)로 합니다.'},
'''

NOTE = r'''note:'50분 흐름 — 문제 5분(삽화·생각 열기) → 예상 5분(원의 식 세우기 시도) → 실험 15분(핀 → 원의 방정식 ①②③ → 두 식의 차 → 연립) → 기록·발견 10분 → 원리 5분 → 적용 5분(지진 진원). 핵심은 <b>클릭이 아니라 식</b>입니다: 미션 1~3 은 지도 조작만으로는 넘어가지 않고 원의 방정식·직선·연립의 손계산을 통과해야 열립니다. 발문 — “조건 하나가 도형 하나라면, 조건 셋은 무엇인가?”, “두 식을 뺐더니 왜 직선이 나왔나?”, “세 원이 안 만나면 어디를 답으로 하겠는가?”. 오차를 켠 뒤의 「오차 합」 열은 최소제곱법의 씨앗이며, 「인공지능 수학」의 손실함수로 이어집니다.','''

CSS = r'''
/* LAB 01 수업 고도화 — 삽화·수학 노트 (2026-09-18) */
.lsimg{display:block;width:100%;max-width:680px;height:auto;border-radius:12px;margin:2px auto 10px;border:1px solid var(--line)}
.lsnfig .lsimg{max-width:720px}
.lg1wrap{display:grid;grid-template-columns:minmax(300px,420px) 1fr;gap:14px;align-items:start}
@media(max-width:820px){.lg1wrap{grid-template-columns:1fr}}
.lg1map canvas{width:100%;max-width:420px;height:auto;background:#fff;border:1px solid var(--line);border-radius:10px}
.lg1math{background:#FBFCFE;border:1px solid var(--line);border-radius:12px;padding:10px 12px}
.lg1mh{font-size:12.5px;font-weight:800;color:var(--ink);margin-bottom:8px;padding-bottom:6px;border-bottom:1px dashed var(--line)}
.eqc{background:#fff;border:1px solid var(--line);border-radius:10px;padding:8px 10px;margin-bottom:8px}
.eqc.ln{border-color:#DDD6FE;background:#FBFAFF}
.eqt{font-size:12.3px;font-weight:700;color:var(--ink2);margin-bottom:6px;display:flex;align-items:center;gap:6px}
.eqn{display:inline-flex;width:20px;height:20px;border-radius:50%;color:#fff;font-size:11px;align-items:center;justify-content:center}
.eqf{font-family:"Cambria Math","Times New Roman",serif;font-size:15px;color:var(--ink);line-height:2.1;white-space:nowrap;overflow-x:auto}
.eqi{width:44px;padding:2px 4px;border:1px solid #C7D8F7;border-radius:6px;font:inherit;font-size:14px;text-align:center;background:#fff}
.eqi.w{width:58px}
.eqb{display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-top:4px}
.eqr{font-size:12.3px;line-height:1.5}
'''

def main(path):
    h = open(path, encoding='utf-8').read()
    # 1) LESSON[1]
    i = h.find('LESSON[1]={'); j = h.find('/* ---------- LAB 02', i); assert i > 0 and j > i
    L = LESSON.replace('__HERO__', b64('hero')).replace('__QUAKE__', b64('quake'))
    h = h[:i] + L + '\n' + h[j:]
    # 2) PRINS[0]
    k = h.find('const PRINS = [\n'); k2 = k + len('const PRINS = [\n'); e = h.find('\n{tex:[', k2 + 10); assert k > 0 and e > k2
    Pn = PRIN.replace('__SAT__', b64('sat')).replace('__NOISE__', b64('noise'))
    h = h[:k2] + Pn + h[e:]
    # 3) LABS[0].note
    n0 = h.find("{n:1,core:1,t:'“여기 어디지?” GPS 위치 추정'"); n1 = h.find("note:'", n0); n2 = h.find("',\n build:gpsDemo", n1); assert n0 > 0 and n1 > n0 and n2 > n1
    h = h[:n1] + NOTE.rstrip(',') + h[n2 + len("'"):]
    # 4) CSS
    if '.lg1wrap{' not in h:
        h = h.replace('</style>', CSS + '</style>', 1)
    open(path, 'w', encoding='utf-8').write(h)
    print('patched; size MB', round(len(h.encode('utf-8')) / 1048576, 2))

if __name__ == '__main__':
    main(sys.argv[1])
