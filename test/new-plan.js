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
