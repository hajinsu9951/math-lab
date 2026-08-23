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
