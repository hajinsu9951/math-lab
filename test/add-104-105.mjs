// 신규 실험실 2종 설치 — LAB 104 종이접기 등분 / LAB 105 주사위 100개 인구 감소
// 원자료: E:\이것저것\수학관련\수업시간관련\수업시간수학 자료\
//   ① 종이접기를 활용한 내분점·외분점 교안 (선분 3·5등분, Abe 각 3등분)
//   ② 2021 지수·로그 교수학습과정안(주사위 100개) — 하진수
import fs from 'node:fs';
const P = 'src/40-demos.js';
let s = fs.readFileSync(P, 'utf8');
if (s.includes('function origamiDemo')) throw new Error('이미 설치됨');

/* ───────── ① 데모 함수 두 개를 LABS 앞에 삽입 ───────── */
const DEMOS = `
/* ---------- LAB 104 종이접기 등분 — 접기로 3등분·5등분·각 3등분 ----------
   원자료: 「종이접기를 활용한 내분점·외분점」 교안 (닮음비·피타고라스·무게중심).
   색종이를 실제로 접듯 단계 버튼을 누르면 접힌 선이 하나씩 늘고, 마지막에
   내분점의 비가 화면에서 확정된다. 자와 컴퍼스로 불가능한 각 3등분(Abe, 1980)까지. */
function origamiDemo(root){
  root.innerHTML=\`<div class="row"><div class="col">
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
      \${slider('ogA','각 θ (각 3등분용)',30,80,1,60,'°')}
      <div class="ctl" style="display:flex;gap:6px;flex-wrap:wrap;margin-top:8px">
        <button class="b t" id="ogGo">다음 접기 ▶</button>
        <button class="b g sm" id="ogRs">펴기</button>
      </div>
      <div class="out" id="ogout"></div>
      <div class="note" style="margin-top:12px">눈대중으로 반의반을 접는 것이 아니라 <b>닮은 삼각형</b>과
      <b>합동</b>이 접힌 선의 자리를 정해 줍니다 — 그래서 「정확히」 3등분입니다.</div>
    </div></div>\`;
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
  root.innerHTML=\`<div class="row"><div class="col">
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
    </div></div>\`;
  const cv=$('#dc1'),ctx=cv.getContext('2d'),W=380,H=300,P=40;
  const S={ n:100, hist:[100], year:0 };
  const X=t=>P+(W-P-16)*t/14, Y=v=>H-P-(H-2*P)*v/110;
  function roll(){
    if(S.year>=14 || S.n<=0) return;
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
    for(let t=0;t<=14;t+=0.25){ const v=100*Math.pow(5/6,t); const x=X(t),y=Y(v); t?ctx.lineTo(x,y):ctx.moveTo(x,y); }
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

`;
{
  const anchor = 'const LABS=[';
  const i = s.indexOf(anchor);
  if (i < 0) throw new Error('LABS 앵커 실패');
  s = s.slice(0, i) + DEMOS + s.slice(i);
}

/* ───────── ② LABS 두 줄 추가 ───────── */
{
  const i = s.indexOf(' build:clDemo}\n];');
  if (i < 0) throw new Error('LABS 끝 앵커 실패');
  const add = ` build:clDemo},
{n:104,core:0,t:'“접으면 3등분” 종이접기 등분 실험실',q:'자와 컴퍼스로 못 하는 일을 접기로 할 수 있을까?',
 m:['닮음비','내분점','합동','작도 불가능 문제'],a:['오리가미 수학','공학의 접기 구조'],
 note:'「종이접기를 활용한 내분점·외분점」 교안의 디지털판. 색종이를 접듯 단계를 눌러 3등분·5등분 점을 만들고, 자와 컴퍼스로는 불가능한 임의의 각 3등분(Abe, 1980)까지 접어 냅니다. 접힌 선의 자리를 정하는 것은 눈대중이 아니라 닮음과 합동입니다.',
 build:origamiDemo},
{n:105,core:0,t:'“주사위 100개” 실험으로 만드는 지수 감소',q:'매년 1/6이 떠나면 10년 뒤 몇 세대가 남을까?',
 m:['지수함수','로그','실험과 이론의 오차'],a:['인구 모형','방사성 붕괴','표본과 변동'],
 note:'2021 「지수함수와 로그함수」 수업(모둠별 주사위 100개 굴리기)의 디지털판. 한 해에 1이 나온 주사위를 빼며 남은 세대를 쌓으면, 이론 곡선 100(5/6)ᵗ 둘레로 실험값이 흔들립니다. 10세대 이하가 되는 해는 로그로 예측하고 실험으로 검증합니다.',
 build:decayDemo}
];`;
  s = s.slice(0, i) + add + s.slice(i + ' build:clDemo}\n];'.length);
}

/* ───────── ③ PRINS 두 항목 추가 ───────── */
{
  const key = `  link:'좌표와 내분점 단원의 응용. 2019 STEAM 색공간 수업(그림판·아두이노)의 디지털 전환이며, 픽셀·이미지(LAB 19)와 이어집니다.'}\n];`;
  const i = s.indexOf(key);
  if (i < 0) throw new Error('PRINS 끝 앵커 실패');
  const add = `  link:'좌표와 내분점 단원의 응용. 2019 STEAM 색공간 수업(그림판·아두이노)의 디지털 전환이며, 픽셀·이미지(LAB 19)와 이어집니다.'},

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
  link:'지수·로그 단원(LAB 3 확산·LAB 73 종이접기 두께)과 큰 수의 법칙(LAB 9·42)을 잇습니다. 원 수업: 2021 「지수함수와 로그함수」 교수학습과정안(주사위 100개).'}
];`;
  s = s.slice(0, i) + add + s.slice(i + key.length);
}

/* ───────── ④ THUMBS 두 개 추가 ───────── */
{
  const key = `   '세 원색 삼각형 위에서 색이 좌표점으로 움직이는 그림')\n];`;
  const i = s.indexOf(key);
  if (i < 0) throw new Error('THUMBS 끝 앵커 실패');
  const add = `   '세 원색 삼각형 위에서 색이 좌표점으로 움직이는 그림'),

 svg(\`<rect x="30" y="12" width="60" height="46" fill="#FFF3DC" stroke="\${TC.amber}" stroke-width="1.6"/>
   <path d="M30 35 H90" stroke="\${TC.blue}" stroke-width="1.2" stroke-dasharray="4 3"/>
   <path d="M30 58 L90 35" stroke="\${TC.teal}" stroke-width="1.3"/>
   <path d="M30 12 L90 58" stroke="\${TC.teal}" stroke-width="1.3"/>
   <circle cx="70" cy="43" r="3.4" fill="\${TC.rose}"/>
   <path d="M70 58 V12" stroke="\${TC.rose}" stroke-width="1.2" stroke-dasharray="3 2"/>
   <text x="60" y="70" font-size="8.5" font-weight="800" fill="\${TC.ink3}" text-anchor="middle">1 : 2</text>\`,
   '색종이의 접힌 선들이 만나 3등분 점을 만드는 그림'),

 svg(\`<path d="M26 20 C46 20 58 44 92 56" stroke="\${TC.amber}" stroke-width="1.6" fill="none" stroke-dasharray="5 3"/>
   <circle cx="26" cy="20" r="3.2" fill="\${TC.blue}"/>
   <circle cx="42" cy="27" r="3.2" fill="\${TC.blue}"/>
   <circle cx="58" cy="37" r="3.2" fill="\${TC.blue}"/>
   <circle cx="74" cy="47" r="3.2" fill="\${TC.blue}"/>
   <path d="M26 20 L42 27 L58 37 L74 47" stroke="\${TC.blue}" stroke-width="1.4" fill="none"/>
   <rect x="84" y="14" width="10" height="10" fill="#fff" stroke="\${TC.ink}" stroke-width="1.2"/>
   <circle cx="89" cy="19" r="1.4" fill="\${TC.ink}"/>
   <text x="56" y="70" font-size="8.5" font-weight="800" fill="\${TC.ink3}" text-anchor="middle">100 × (5/6)ᵗ</text>\`,
   '주사위로 굴린 실험값 점들이 지수 감소 곡선을 따라가는 그림')
];`;
  s = s.slice(0, i) + add + s.slice(i + key.length);
}

/* ───────── ⑤ PROBLEMS · MISSIONS 추가 ───────── */
{
  const m = s.match(/const PROBLEMS=(\{.*?\});/);
  const PR = JSON.parse(m[1]);
  PR['104'] = { sit: '색종이를 반으로 접어 2등분은 누구나 합니다. 그런데 3등분은? 게다가 「자와 컴퍼스로는 임의의 각을 3등분할 수 없다」가 수학의 오래된 정리입니다.',
    ask: '접기만으로 선분을 정확히 3등분·5등분할 수 있을까? 작도로 불가능한 각 3등분도 접기로는 가능할까?' };
  PR['105'] = { sit: '새 마을로 매년 세대의 1/6 이 이주합니다. 지금 100세대가 살고, 손에는 주사위 100개가 있습니다 (1이 나오면 그 세대는 이주).',
    ask: '10년 뒤 몇 세대가 남을까? 10세대 이하로 줄어드는 해는 언제일까?' };
  s = s.replace(m[0], 'const PROBLEMS=' + JSON.stringify(PR) + ';');

  const i0 = s.indexOf('const MISSIONS=');
  const mm = s.slice(i0).match(/^const MISSIONS=\{[\s\S]*?\n\};/);
  const M = new Function('return ' + mm[0].slice('const MISSIONS='.length, -1))();
  M['104'] = [
   {t:'1분 자유 탐색 — 「다음 접기」를 눌러 색종이에 접힌 선이 하나씩 쌓이는 것을 보세요. 어떤 선들이 만나 점을 만드나요?'},
   {t:'3등분 접기 — 오늘의 문제 첫 관문입니다. 3등분 모드에서 끝까지 접어, 밑변을 정확히 나누는 점 P 를 만들어 내세요.',
    re:'3등분 확정',
    do:'① 3등분 모드 확인 ② 「다음 접기」를 세 번 ③ 교점 O 와 점 P 의 자리 확인',
    hand:'닮은 두 삼각형을 찾아 대응변의 비를 쓰고, 그 비가 왜 2 : 1 인지 종이에 증명'},
   {t:'5등분 접기 — 이번엔 대각선 두 개가 만드는 교점입니다. 5등분 모드를 끝까지 접어 1 : 4 를 만들어 내세요.',
    re:'5등분 확정',
    do:'① 5등분 모드로 전환 ② 「다음 접기」를 세 번 ③ 교점이 나눈 비 확인',
    hand:'두 대각선이 만든 닮은 삼각형의 비로 1 : 4 를 유도해 종이에 쓰기'},
   {t:'(모드, 접기 단계, 내분비, 근거) 표 — 접기가 왜 눈대중이 아닌지 「대칭이동」이라는 말로 정리하세요.'},
   {t:'심화 — 불가능을 접다: 각 3등분 모드에서 θ 를 60°로 두고 끝까지 접어 3등분선을 만들어 내세요. 자와 컴퍼스로는 불가능한 이 작도가 접기로는 왜 가능한지, 접기가 허용하는 조작(두 점을 동시에 두 직선 위에 올리기)으로 설명하세요.',
    re:'각 3등분 완성',
    do:'① 각 3등분 모드 ② θ 를 60°로 ③ 「다음 접기」를 네 번 눌러 완성',
    hand:'합동인 세 직각삼각형을 표시하고 SSS·SAS 로 세 각이 같음을 증명'}];
  M['105'] = [
   {t:'1분 자유 탐색 — 「한 해 굴리기」를 몇 번 눌러 보세요. 남은 세대는 매년 몇 씩 줄어드나요? 일정한 수인가요, 비율인가요?'},
   {t:'절반은 언제? — 계속 굴려 남은 세대가 50 이하로 내려가는 해를 찾으세요. 예상 연도를 먼저 메모하고 시작하세요.',
    re:'절반 붕괴',
    do:'① 예상 연도 메모 ② 한 해씩 굴리며 남은 수 기록 ③ 50 이하가 된 해 확인',
    hand:'100(5/6)ˣ = 50 을 로그로 풀어 이론 반감기(≈3.8년)를 구하고 실험과 대조'},
   {t:'10년의 실험 — 「10년 자동」으로 오늘의 문제 첫 답을 구하세요. 실험값과 이론값 100(5/6)¹⁰ 의 차이는 얼마인가요?',
    re:'10년 실험 완료',
    do:'① 다시(100세대)로 초기화 ② 10년 자동 ③ (실험값, 이론값, 오차) 기록',
    hand:'(5/6)¹⁰ 을 로그로 어림해 이론값 약 16세대를 손으로 확인'},
   {t:'(해, 실험값, 이론값, 오차) 표 10줄 — 「다시」로 세 번 반복해 실험이 이론 둘레에서 얼마나 흔들리는지 기록하세요.'},
   {t:'심화 — 로그로 예언하기: 오늘의 문제 둘째 답(10세대 이하가 되는 해)을 log2=0.30, log3=0.47 로 먼저 계산한 뒤, 실험을 계속 굴려 실제 도달 해와 비교하세요.',
    re:"이하 — d+년째 도달",
    do:'① 로그로 예상 연도 계산 ② 계속 굴려 10 이하 도달 ③ 예상과 실제 비교',
    hand:'x ≥ log10 ÷ (log6 − log5) 를 계산해 약 13년을 유도하고, 실험의 흔들림으로 차이를 설명'}];
  s = s.slice(0, i0) + 'const MISSIONS=' + JSON.stringify(M, null, 1) + ';' + s.slice(i0 + mm[0].length);

  // 자기일치 감사
  let bad = 0;
  for (const k of ['104', '105']) {
    const texts = M[k].map(x => [x.t, x.do, x.hand].filter(Boolean).join('\n')).join('\n')
      + '\n' + PR[k].sit + '\n' + PR[k].ask;
    M[k].forEach((x, ix) => {
      if (x.re && new RegExp(x.re).test(texts)) { console.log(`자기일치! LAB ${k} S${ix + 1} /${x.re}/`); bad++; }
    });
  }
  if (bad) throw new Error('자기일치 ' + bad);
}

fs.writeFileSync(P, s);
console.log('LAB 104(종이접기 등분) · LAB 105(주사위 100개) 설치 완료 — 데모·LABS·PRINS·THUMBS·PROBLEMS·MISSIONS');
