# -*- coding: utf-8 -*-
"""LAB 03 「정보 확산 시뮬레이터」 — 수학 노트(식 검사) 추가 + 삽화 4장.

작업지시 3절 「LAB 03 에 넣을 식 검사」: N(t)=N₀(1+r)^t · 배가시간 T = log2/log(1+r).
N₀=100, r=0.5 → 5일 뒤 759, T ≈ 1.71일.

격자 확산은 난수를 쓰므로 실험값 자체에는 정답이 없다. 그래서 **정확한 값인 r 슬라이더**에
식 검사를 걸고, 실제 곡선에서 인원이 두 배가 된 날을 표시해 모형의 T 와 견주게 한다.
(격자에서는 한 사람이 이웃 넷에게 전하므로 실제 배율이 1+r 보다 크다 — 그 어긋남 자체가
 「모형을 쓸 때 무엇을 가정했는가」를 묻는 자리가 된다.)

사용: python docs/LAB03_고도화/patch_lab3.py dist/index.html
"""
import sys, os, base64

HERE = os.path.dirname(os.path.abspath(__file__))
IMGD = os.path.join(os.path.dirname(HERE), '썸네일_힉스필드', '상황삽화')


def img(name, alt):
    p = os.path.join(IMGD, name + '.webp')
    if not os.path.exists(p):
        return ''
    b = base64.b64encode(open(p, 'rb').read()).decode()
    return '<img class="lsimg" src="data:image/webp;base64,%s" alt="%s">' % (b, alt)


LESSON = r'''LESSON[3]={
 title:'정보 확산 시뮬레이터',
 problem:{
  q:'한 영상이 하루 만에 조회수 100만을 넘겼습니다. 첫날엔 겨우 몇 명이 봤는데 — 어떻게 이런 일이 벌어질까요? 그리고 왜 어느 순간 성장이 멈출까요?',
  svg:`__B_PROBLEM__
   <svg viewBox="0 0 400 170" role="img" aria-label="한 명에서 시작해 두 배씩 퍼지다 포화되는 조회수 S자 곡선">
    <g stroke="#9CA3AF" stroke-width="1.4">
      <path d="M40 146 H382" /><path d="M40 146 V14" /></g>
    <path d="M40 118 H382" stroke="#D1D5DB" stroke-width="1.2" stroke-dasharray="4 4"/>
    <text x="46" y="112" font-size="10" fill="#6B7280">100만 (더 볼 사람이 없다)</text>
    <path d="M40 144 C 130 142, 160 138, 196 112 S 250 34, 300 24 S 360 18, 380 17"
      stroke="#2563EB" stroke-width="3" fill="none" stroke-linecap="round"/>
    <circle cx="52" cy="143.4" r="4.5" fill="#BE123C"/>
    <text x="52" y="162" font-size="10.5" font-weight="800" fill="#BE123C" text-anchor="middle">첫날 3명</text>
    <g font-size="10.5" font-weight="800" fill="#B45309" text-anchor="middle">
      <text x="205" y="98">여기서 무슨 일이?</text>
      <path d="M205 102 L201 112" stroke="#B45309" stroke-width="1.4" fill="none"/>
    </g>
    <text x="330" y="44" font-size="10.5" font-weight="800" fill="#0E9384" text-anchor="middle">왜 멈출까?</text>
    <g font-size="12" text-anchor="middle">
      <text x="88" y="60">🧍</text>
      <text x="118" y="48">🧍🧍</text>
      <text x="158" y="36">🧍🧍🧍🧍</text>
      <path d="M97 55 L108 50 M130 45 L142 40" stroke="#9CA3AF" stroke-width="1.2"/>
    </g>
    <text x="360" y="160" font-size="10" fill="#6B7280" text-anchor="end">날짜 →</text>
    <text x="30" y="26" font-size="10" fill="#6B7280" writing-mode="tb">조회수</text>
  </svg>`,
  sit:'교실 64명을 축소 모형으로 씁니다. 소문을 들은 사람이 매일 옆 사람에게 전할 확률 <b>r</b> 로 이야기를 퍼뜨립니다. 첫 유포자는 여러분이 직접 고릅니다. <b>생각 열기</b> ─ ① 매일 같은 비율로 는다면 “며칠 뒤”를 어떻게 식으로 쓸까요? ② “두 배가 되는 데 며칠”을 구하려면 지수에 있는 t 를 어떻게 끌어내릴까요? ③ 격자에서는 한 사람이 이웃 <b>넷</b>에게 전합니다 — 그래도 매일 (1+r)배일까요?'
 },
 predict:{
  q:['64명 전원이 알게 되기까지 며칠 걸릴지 숫자로 예상하세요 (r=0.5 기준).',
     '퍼지는 속도가 처음·중간·끝에서 어떻게 다를지 그래프 모양으로 그려 보세요.',
     'r 를 절반으로 줄이면 걸리는 날이 딱 두 배가 될지 예상을 적으세요.'] },
 missions:[
  {t:'첫 유포자를 클릭으로 고르고 3일 진행해 보세요. 초반이 얼마나 가파른지 눈에 익힙니다.',
   re:'미션1 달성', do:'① 왼쪽 격자에서 한 칸 클릭 ② 「하루 진행」 세 번',
   hand:'1일차·2일차·3일차의 인원을 적고, 앞 날의 몇 배인지 나눠 보기'},
  {t:'절반(32명)을 넘기세요. 그리고 오른쪽 수학 노트 ①②에 <b>지수 모형</b>의 식을 세워 통과하세요.',
   re:'미션2 달성', do:'① 「5일 진행」 ② 노트 ① 에 하루 배율 (1+r) ③ 노트 ② 에 100명이 5일 뒤 몇 명인지',
   hand:'N(t) = N₀(1+r)^t 를 쓰고, t=5 를 대입하는 과정을 종이에 남기기'},
  {t:'끝까지 진행해 S자 곡선을 완성한 뒤, 노트 ③에 <b>배가시간</b>을 넣으세요. 모형의 T 와 화면이 재어 준 실제 배가시간을 견주어 보세요.',
   re:'미션3 달성', do:'① 「5일 진행」을 포화까지 ② 노트 ③ 에 T = log2 ÷ log(1+r)',
   hand:'2 = (1+r)^T 에서 로그를 취해 T 를 끌어내리는 과정을 쓰고, 실제와 어긋난 까닭을 한 줄로'}],
 inquiry:{
  id:'spr', title:'정보 확산 — 지수에서 S곡선으로',
  q:['하루 진행할 때마다 「지금 값 기록」을 눌러 표를 채우세요 (8줄 이상).',
     '「새로 안 사람」 열이 언제 최대인지 찾으세요 — 처음? 중간? 끝?',
     '초반이 지수적(매일 ×배)인 이유와, 후반이 느려지는 이유(전할 상대가 없음)를 손으로 설명하세요. 모형의 배가시간 T 와 화면이 잰 실제 배가시간이 다른 까닭도 함께 쓰세요.'],
  cols:['날짜','아는 사람','새로 안 사람','남은 사람','비율(%)'],
  hint:'힌트 — 새로 아는 수 = (아는 사람의 전파) × (아직 모르는 이웃의 비율). 두 요인이 곱해져 있습니다.' },
 apply:{
  q:`__B_APPLY__
     새 문제 — 어떤 소문이 매일 1.26배로 늘어납니다. 두 배가 되는 데 며칠일까요? <span class="mono">log2 ÷ log1.26</span> 을 계산하세요. (소수 첫째 자리)`,
  a:3.0, tol:0.1,
  why:'log2/log1.26 ≈ 3.0 — 「매일 26% 성장 = 3일마다 두 배」. 이것이 배가시간입니다. 밑이 무엇이든(상용로그든 자연로그든) 비로 계산하므로 같은 값이 나옵니다.',
  hint:'계산기에서 log 2 ÷ log 1.26. 0.301/0.1004.' },
 demo(root){
  root.innerHTML=`<div class="lg3wrap">
   <div class="lg3sim">
    <div style="display:flex;gap:14px;flex-wrap:wrap">
      <canvas id="lp1" width="200" height="200"></canvas>
      <canvas id="lp2" width="190" height="200"></canvas></div>
    <div class="ctl" style="display:flex;gap:6px;flex-wrap:wrap;margin-top:8px">
      <button class="b t" id="lpDay">하루 진행</button>
      <button class="b t sm" id="lpD5">5일 진행</button>
      <label class="ctl" style="margin:0 0 0 6px">전파율 r
        <input type="range" id="lpr" min="0.1" max="0.9" step="0.05" value="0.5" style="width:80px">
        <span id="lprv">0.5</span></label>
      <button class="b g sm" id="lpRst">처음부터</button></div>
    <div class="out" id="lpout"></div>
    <div class="note" style="margin-top:6px"><b>왼쪽 격자에서 첫 유포자를 클릭</b>하세요. 오른쪽은 누적 곡선이고, <b>주황 눈금</b>은 인원이 두 배가 된 날입니다.</div>
   </div>
   <div class="lg1math">
    <div class="lg1mh">✎ 수학 노트 — 지금 슬라이더의 r 로 계산합니다</div>
    <div class="eqc" data-n="0"><div class="eqt"><span class="eqn" style="background:#2563EB">①</span> 하루 지나면 몇 배? (전파율 r = <span class="lg3r">0.5</span>)</div>
      <div class="eqf">1 + r = <input class="eqi w" data-f="v"></div>
      <div class="eqb"><button class="b t sm eqk">값 확인</button><span class="eqr"></span></div></div>
    <div class="eqc" data-n="1"><div class="eqt"><span class="eqn" style="background:#B45309">②</span> 100명에서 시작하면 5일 뒤는?</div>
      <div class="eqf">N(5) = 100 × (1 + <span class="lg3r">0.5</span>)<sup>5</sup> = <input class="eqi w" data-f="v"></div>
      <div class="eqb"><button class="b t sm eqk">값 확인</button><span class="eqr"></span></div></div>
    <div class="eqc ln" data-n="2"><div class="eqt"><span class="eqn" style="background:#7C3AED">③</span> 두 배가 되는 데 며칠? — 지수를 끌어내린다</div>
      <div class="eqf">2 = (1 + r)<sup>T</sup> → T = log2 ÷ log(1 + <span class="lg3r">0.5</span>) = <input class="eqi w" data-f="v"></div>
      <div class="eqb"><button class="b t sm eqk">값 확인</button><span class="eqr"></span></div></div>
    <div class="note" id="lg3cmp" hidden></div>
   </div>
  </div>`;
  const cv=root.querySelector('#lp1'),ctx=cv.getContext('2d');
  const c2=root.querySelector('#lp2'),x2=c2.getContext('2d');
  const N=8, CS=200/N;
  const S={ inf:new Set(), day:0, hist:[], r:0.5, half:false, sat:false, eq:[false,false,false] };
  function neighbors(i){
    const r0=Math.floor(i/N), c0=i%N, out=[];
    [[1,0],[-1,0],[0,1],[0,-1]].forEach(d=>{
      const rr=r0+d[0], cc=c0+d[1];
      if(rr>=0&&rr<N&&cc>=0&&cc<N) out.push(rr*N+cc);
    });
    return out;
  }
  /* 실제 곡선에서 인원이 처음으로 2배·4배·8배가 된 날 — 난수와 무관하게 기록에서 읽는다 */
  function doublings(){
    if(S.hist.length<2||!S.hist[0]) return [];
    const n0=S.hist[0], out=[];
    let target=n0*2;
    for(let i=1;i<S.hist.length&&out.length<3;i++){
      if(S.hist[i]>=target){ out.push(i); target*=2; }
    }
    return out;
  }
  function draw(){
    ctx.clearRect(0,0,200,200);
    for(let i=0;i<N*N;i++){
      const x=(i%N)*CS, y=Math.floor(i/N)*CS;
      ctx.fillStyle=S.inf.has(i)?'#BE123C':'#E8EDF4';
      ctx.beginPath(); ctx.arc(x+CS/2,y+CS/2,CS*0.34,0,7); ctx.fill();
    }
    x2.clearRect(0,0,190,200); x2.fillStyle='#fff'; x2.fillRect(0,0,190,200);
    x2.strokeStyle='#E5E7EB';
    x2.beginPath(); x2.moveTo(26,10); x2.lineTo(26,176); x2.lineTo(184,176); x2.stroke();
    x2.strokeStyle='#D1D5DB'; x2.setLineDash([2,3]);
    x2.beginPath(); x2.moveTo(26,176-64*2.5); x2.lineTo(184,176-160); x2.stroke(); x2.setLineDash([]);
    // 두 배가 된 날 — 주황 눈금
    const dbl=doublings();
    x2.strokeStyle='#B45309'; x2.lineWidth=1.2; x2.setLineDash([3,3]);
    dbl.forEach(i=>{ const px=26+i*10; x2.beginPath(); x2.moveTo(px,176); x2.lineTo(px,18); x2.stroke(); });
    x2.setLineDash([]);
    x2.strokeStyle='#2563EB'; x2.lineWidth=2; x2.beginPath();
    S.hist.forEach((v,i)=>{ const px=26+i*10, py=176-v*2.5;
      i?x2.lineTo(px,py):x2.moveTo(px,py); });
    x2.stroke();
    x2.fillStyle='#6B7280'; x2.font='9.5px sans-serif';
    x2.fillText('64', 8, 20); x2.fillText('일 →', 168, 190); x2.fillText('아는 사람', 30, 20);
    root.querySelectorAll('.lg3r').forEach(el=>el.textContent=S.r);
    const n=S.inf.size, newest=S.hist.length>1?n-S.hist[S.hist.length-2]:n;
    let msg = S.day===0
      ? (n? '첫 유포자 '+n+'명 선택됨 — 「하루 진행」을 누르세요.' : '격자를 클릭해 첫 유포자를 고르세요.')
      : `<b>${S.day}일차</b> — 아는 사람 <b>${n}명</b> (+${newest}) / 64명`;
    if(n>=32) S.half=true;
    if(S.half) msg+=' · <b style="color:#B45309">절반을 넘었습니다</b>';
    if(n>=62) S.sat=true;
    if(S.sat) msg+=' · <b style="color:#0E9384">더 전할 사람이 없습니다 — S자 곡선 완성</b>';
    if(dbl.length) msg+=`<br><span style="color:#B45309">화면이 잰 실제 배가시간 — 처음 두 배가 되기까지 <b>${dbl[0]}일</b>`
      +(dbl.length>1?` · 그다음 두 배까지 ${dbl[1]-dbl[0]}일`:'')+'</span>';
    const st=[];
    if(S.day>=3) st.push('🏁 미션1 달성');
    if(S.half&&S.eq[0]&&S.eq[1]) st.push('🏁 미션2 달성');
    if(S.sat&&S.eq[2]) st.push('🏁 미션3 달성');
    root.querySelector('#lpout').innerHTML=msg+(st.length?'<div style="margin-top:6px;font-weight:800;color:#0E9384">'+st.join(' · ')+'</div>':'');
    const cmp=root.querySelector('#lg3cmp');
    if(S.eq[2]&&dbl.length){
      const T=Math.log(2)/Math.log(1+S.r);
      cmp.hidden=false;
      cmp.innerHTML=`모형은 <b>T = ${T.toFixed(2)}일</b>, 화면이 잰 실제는 <b>${dbl[0]}일</b>입니다. `
        +(dbl[0]<T?'실제가 더 빠릅니다 — 격자에서는 한 사람이 <b>이웃 넷</b>에게 전하므로 하루 배율이 1+r 보다 큽니다. 모형이 무엇을 가정했는지 되짚어 보세요.'
                  :'후반에는 전할 상대가 줄어 실제가 모형보다 느려집니다 — 지수 모형에는 <b>상한</b>이 없기 때문입니다.');
    } else cmp.hidden=true;
  }
  function step(){
    if(!S.inf.size) return;
    const add=new Set();
    S.inf.forEach(i=>neighbors(i).forEach(j=>{
      if(!S.inf.has(j)&&Math.random()<S.r) add.add(j);
    }));
    add.forEach(j=>S.inf.add(j));
    S.day++; S.hist.push(S.inf.size);
    draw();
  }
  const num=el=>{ const v=parseFloat(String(el.value).replace(/[^0-9.\-]/g,'')); return isFinite(v)?v:NaN; };
  root.querySelectorAll('.eqc[data-n]').forEach(el=>{ const k=+el.dataset.n;
    el.querySelector('.eqk').onclick=()=>{ const r=el.querySelector('.eqr'), v=num(el.querySelector('[data-f=v]'));
      const want=[1+S.r, 100*Math.pow(1+S.r,5), Math.log(2)/Math.log(1+S.r)][k];
      const tol=[0.001, 1, 0.02][k];
      const ok=isFinite(v)&&Math.abs(v-want)<=tol;
      S.eq[k]=ok;
      if(ok) r.innerHTML='<b style="color:#0E9384">통과</b>';
      else if(k===0) r.innerHTML='<span style="color:#BE123C">r 를 더하는 것입니다 — 곱하거나 빼지 마세요.</span>';
      else if(k===1) r.innerHTML=(isFinite(v)&&Math.abs(v-100*(1+5*S.r))<1)
          ? '<span style="color:#BE123C">매일 같은 <b>수</b>를 더한 값입니다. 지수는 같은 <b>비율</b>을 거듭 곱합니다.</span>'
          : '<span style="color:#BE123C">100 × (1+r) 을 다섯 번 곱하세요.</span>';
      else r.innerHTML=(isFinite(v)&&Math.abs(v-Math.log(2)/Math.log(S.r))<0.05)
          ? '<span style="color:#BE123C">분모는 log r 이 아니라 <b>log(1+r)</b> 입니다 — 하루 배율은 r 이 아니라 1+r 이니까요.</span>'
          : '<span style="color:#BE123C">2 = (1+r)^T 의 양변에 로그를 취해 T 를 끌어내리세요.</span>';
      draw(); }; });
  cv.style.touchAction='none';
  cv.addEventListener('pointerdown',e=>{
    if(S.day>0) return;
    const r=cv.getBoundingClientRect();
    const x=Math.floor((e.clientX-r.left)*200/r.width/CS), y=Math.floor((e.clientY-r.top)*200/r.height/CS);
    const i=y*N+x;
    if(S.inf.has(i)) S.inf.delete(i); else S.inf.add(i);
    S.hist=[S.inf.size]; draw();
  });
  root.querySelector('#lpDay').onclick=step;
  root.querySelector('#lpD5').onclick=()=>{ for(let i=0;i<5;i++) step(); };
  /* r 을 바꾸면 앞서 통과한 값은 더 이상 그 r 의 답이 아니다 — 검사를 되돌린다 */
  root.querySelector('#lpr').oninput=e=>{ S.r=+e.target.value; root.querySelector('#lprv').textContent=S.r;
    S.eq=[false,false,false]; root.querySelectorAll('.eqr').forEach(el=>el.innerHTML=''); draw(); };
  root.querySelector('#lpRst').onclick=()=>{ S.inf=new Set(); S.day=0; S.hist=[]; S.half=false; S.sat=false; draw(); };
  draw();
  return { read:()=>{ if(!S.hist.length) return null;
    const n=S.inf.size, newest=S.hist.length>1?n-S.hist[S.hist.length-2]:n;
    return [S.day, n, newest, 64-n, (n/64*100).toFixed(0)]; } };
 }
};
'''

NOTE = r'''note:'50분 흐름 — 문제 5분 → 예상 5분 → 실험 15분(격자 확산 + 수학 노트 ①②③) → 기록·발견 10분 → 원리 5분 → 적용 5분(배가시간). 선형 → 지수 → 로지스틱으로 <b>모델이 진화</b>하는 과정을 한 화면에서 비교합니다. 미션 2·3 은 조작만으로는 열리지 않고 <b>지수 모형의 식과 배가시간</b>을 손으로 세워야 열립니다. 화면은 실제 곡선에서 인원이 두 배가 된 날을 주황 눈금으로 재어 주므로, 모형의 T = log2/log(1+r) 와 <b>견주어 어긋남을 이야기</b>할 수 있습니다 — 격자에서는 한 사람이 이웃 넷에게 전하므로 하루 배율이 1+r 보다 큽니다. 발문 — “왜 로그가 필요한가?”, “모형이 며칠째까지 맞았나?”, “무엇을 가정했기에 어긋났나?”','''

CSS = r'''
/* LAB 03 수업 고도화 — 격자와 수학 노트 나란히 (2026-09-18) */
.lg3wrap{display:grid;grid-template-columns:minmax(300px,430px) 1fr;gap:14px;align-items:start}
@media(max-width:820px){.lg3wrap{grid-template-columns:1fr}}
.lg3sim canvas{background:#fff;border:1px solid var(--line);border-radius:10px;max-width:100%;height:auto}
'''


def main(path):
    h = open(path, encoding='utf-8').read()

    # 1) LESSON[3]
    i = h.find('LESSON[3]={')
    j = h.find('/* ---------- LAB 21', i)
    assert i > 0 and j > i, 'LESSON[3] 자리를 못 찾음'
    L = (LESSON
         .replace('__B_PROBLEM__', img('b03_problem', '가운데 한 점에서 바깥으로 퍼져 나가는 연결망, 바깥 고리일수록 촘촘하다'))
         .replace('__B_APPLY__', img('b03_apply', '도시 윤곽 위로 솟아오르는 유행 곡선과 기울기가 꺾이는 자리를 나타낸 점선')))
    h = h[:i] + L + '\n' + h[j:]

    # 2) PRINS[2] — what · probe 앞에 삽화만 끼운다 (본문은 그대로 둔다)
    for key, name, alt in [
        ('what', 'b03_what', '한 점에서 시작한 두 곡선 — 하나는 끝없이 치솟고 하나는 S자로 눕는다'),
        ('probe', 'b03_probe', '눈금 사이가 갈수록 절반씩 좁아지는 자 위에 두 배를 나타내는 괄호'),
    ]:
        tag = img(name, alt)
        if not tag:
            continue
        anchor = {
            'what': " what:'같은 비율을 <b>거듭 곱하는</b> 변화입니다.",
            'probe': " probe:'전파율을 조금만 올려 보세요.",
        }[key]
        if tag in h:
            continue
        n = h.count(anchor)
        assert n == 1, 'PRINS[2].%s 자리를 %d 번 찾음' % (key, n)
        h = h.replace(anchor, anchor.replace(":'", ":'" + tag, 1))

    # 3) LABS[2].note
    n0 = h.find("{n:3,core:1,t:'“왜 순식간에 퍼질까?” 확산 시뮬레이터'")
    n1 = h.find("note:'", n0)
    n2 = h.find("',\n build:", n1)
    assert n0 > 0 and n1 > n0 and n2 > n1, 'LABS[2].note 자리를 못 찾음'
    h = h[:n1] + NOTE.rstrip(',') + h[n2 + len("'"):]

    # 4) CSS
    if '.lg3wrap{' not in h:
        h = h.replace('</style>', CSS + '</style>', 1)

    open(path, 'w', encoding='utf-8').write(h)
    print('patched; size MB', round(len(h.encode('utf-8')) / 1048576, 2))


if __name__ == '__main__':
    main(sys.argv[1])
