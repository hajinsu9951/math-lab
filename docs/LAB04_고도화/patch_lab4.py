# -*- coding: utf-8 -*-
"""LAB 04 「요금제 손익분기」 고도화 — 끌기만 하던 것을 「식으로 푸는」 수업으로.

무엇이 문제였나
  · 미션 셋이 전부 마커 끌기였다. 「손익분기를 1분 단위로 사냥하세요」가 전부.
  · 게다가 경계 ±3분에 **자석**이 걸려 있어, 근처만 가면 화면이 150분을 맞춰 줬다.
    손으로 풀 이유가 없었다.

어떻게 바꿨나
  · 오른쪽에 수학 노트 ①②③ — 두 요금제를 식으로 세우고, 연립해 경계를 손으로 구하고,
    경계에서의 요금까지 확인해야 미션이 열린다.
  · **자석은 노트 ②를 통과한 뒤에만 켜진다.** 손으로 구한 답을 화면이 확인해 주는 순서다.
  · 「분 입력」 칸을 두어, 구한 값을 직접 넣어 확인한다 (끌어서 찾는 것이 아니라).
  · 삽화 3장 — 두 직선의 교점 · 기본료와 분당요금이 그래프의 어디인가 · 차이를 메우는 그림.

사용: python docs/LAB04_고도화/patch_lab4.py src/40-demos.js
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


LESSON = r'''LESSON[4]={
 title:'요금제 손익분기',
 problem:{
  q:'알뜰 요금제 A(기본 8,000원 + 분당 120원)와 표준 요금제 B(기본 20,000원 + 분당 40원). 나는 매달 몇 분이나 통화하지? — 어느 쪽을 골라야 손해가 없을까요?',
  svg:`__B_PROBLEM__
   <svg viewBox="0 0 400 176" role="img" aria-label="두 요금제의 직선이 한 점에서 만나는 그래프">
    <g stroke="#9CA3AF" stroke-width="1.3"><path d="M44 150 H384"/><path d="M44 150 V16"/></g>
    <path d="M44 132 L384 34" stroke="#2563EB" stroke-width="2.6" fill="none"/>
    <path d="M44 84 L384 52" stroke="#0E9384" stroke-width="2.6" fill="none"/>
    <circle cx="206" cy="89" r="5" fill="#B45309"/>
    <path d="M206 89 V150" stroke="#B45309" stroke-width="1.4" stroke-dasharray="4 3"/>
    <g font-size="11" font-weight="800">
      <text x="352" y="30" fill="#1D4ED8">A</text>
      <text x="352" y="48" fill="#0B6E63">B</text>
      <text x="150" y="80" fill="#92400E" text-anchor="end">여기가 어디?</text>
    </g>
    <text x="214" y="164" font-size="10" fill="#6B7280">통화량(분) →</text>
    <text x="34" y="26" font-size="10" fill="#6B7280" writing-mode="tb">요금</text>
    <text x="52" y="142" font-size="9.5" fill="#1D4ED8">8,000</text>
    <text x="52" y="80" font-size="9.5" fill="#0B6E63">20,000</text>
  </svg>`,
  sit:'요금은 둘 다 「기본료 + 분당 요금 × 통화량」 — 통화량에 따라 곧게 자라는 구조입니다. <b>생각 열기</b> ─ ① 두 요금제를 각각 식으로 쓰면 무엇이 상수이고 무엇이 x 의 계수일까요? ② 두 직선이 만나는 곳은 무슨 뜻일까요? ③ 기본료 차이 12,000원을 분당 요금 차이 80원이 메우려면 몇 분이 필요할까요? — 이 활동은 <b>끌어서 찾는 것이 아니라 풀어서 찾는</b> 수업입니다.'
 },
 predict:{
  q:['한 달 100분이라면 어느 요금제가 쌀지 예상을 적으세요.',
     '몇 분쯤에서 유불리가 뒤집힐지 <b>숫자로 어림</b>해 적고, 그렇게 어림한 근거를 쓰세요.',
     '그 경계에서 두 요금제의 관계를 <b>식 한 줄</b>로 적으세요 (등호를 쓰세요).'] },
 missions:[
  {t:'마커를 끌어 <b>A 가 유리한 달</b>과 <b>B 가 유리한 달</b>을 각각 만들어 보세요. 그리고 오른쪽 수학 노트 ①에 두 요금제를 식으로 세우세요.',
   re:'미션1 달성', do:'① 마커를 왼쪽 끝과 오른쪽 끝으로 ② 노트 ① — 기본료는 상수, 분당 요금은 x 의 계수',
   hand:'두 식을 종이에 나란히 쓰고, 어느 항이 「고정비」이고 어느 항이 「쓴 만큼」인지 표시'},
  {t:'화면을 보지 말고 <b>손으로</b> 경계를 구하세요. 두 식을 같게 놓고 노트 ②를 채우면 됩니다.',
   re:'미션2 달성', do:'8000 + 120x = 20000 + 40x → x 항끼리, 상수끼리 모으기',
   hand:'이항하는 과정을 한 줄씩 남기고, 「기본료 차 ÷ 분당 요금 차」로도 같은 답이 나오는지 확인'},
  {t:'구한 분수를 <b>「분 입력」 칸에 넣어</b> 두 요금이 정말 같아지는지 확인하고, 그때의 요금을 노트 ③에 적으세요.',
   re:'미션3 달성', do:'① 노트 ②를 통과하면 마커가 경계에 잘 붙습니다 ② 입력 칸에 구한 값 ③ 노트 ③ 에 그때의 요금',
   hand:'두 식에 각각 대입해 같은 값이 나오는지 검산 — 한쪽만 맞으면 계산이 틀린 것'}],
 inquiry:{
  id:'pl4', title:'요금제 손익분기 — 교점이 결정을 가른다',
  q:['통화량을 바꿔 가며 6줄 이상 기록하세요 (경계 앞뒤와 경계 자체를 꼭 포함).',
     '「차액」 열의 부호가 바뀌는 지점을 찾고, 두 그래프에서 그곳이 무엇인지 확인하세요.',
     '8000 + 120x = 20000 + 40x 를 손으로 풀어 150분이 나오는 과정을 쓰고, 기울기 차(80원)가 “격차가 줄어드는 속도”임을 설명하세요.'],
  cols:['통화량(분)','A 요금','B 요금','차액(A−B)','판정'],
  hint:'힌트 — 그래프의 교점 = 두 식의 연립방정식의 해 = 결정이 뒤집히는 경계. 세 가지가 같은 것입니다.' },
 apply:{
  q:'새 문제 — C(기본 15,000 + 분당 80원) vs D(기본 22,000 + 분당 45원). <b>몇 분부터 D 가 유리</b>해질까요? (경계 분수)',
  a:200, tol:0.01,
  why:'15000+80x = 22000+45x → 35x = 7000 → x = 200. 기울기 차 35원이 기본료 차 7,000원을 메우는 데 200분. 오늘 배운 「기본료 차 ÷ 분당 요금 차」가 그대로 쓰입니다.',
  hint:'기본료 차이 7,000원을 분당 요금 차이 35원으로 나눠 보세요.' },
 demo(root){
  root.innerHTML=`<div class="lg4wrap">
   <div class="lg4plot">
    <canvas id="l4c" width="400" height="300"></canvas>
    <div class="ctl" style="display:flex;gap:6px;flex-wrap:wrap;align-items:center;margin-top:8px">
      <label style="margin:0">분 입력 <input type="number" id="l4x" min="0" max="300" step="1"
        style="width:74px;padding:2px 4px;border:1px solid #C7D8F7;border-radius:6px;font:inherit;text-align:center"></label>
      <button class="b t sm" id="l4go">그 분으로 이동</button>
      <span id="l4lock" style="font-size:11.5px;color:#B45309"></span></div>
    <div class="out" id="l4o"></div>
    <div class="note" style="margin-top:6px"><b>가로축의 통화량 마커(주황)를 끌거나</b> 위 칸에 분을 직접 넣으세요.
      경계는 <b>끌어서 찾는 것이 아니라 풀어서 찾습니다</b>.</div>
   </div>
   <div class="lg1math">
    <div class="lg1mh">✎ 수학 노트 — 요금제를 식으로 옮긴다</div>
    <div class="eqc" data-n="0"><div class="eqt"><span class="eqn" style="background:#2563EB">①</span> 두 요금제를 식으로</div>
      <div class="eqf">A = <input class="eqi w" data-f="a0"> + <input class="eqi" data-f="a1"> x</div>
      <div class="eqf">B = <input class="eqi w" data-f="b0"> + <input class="eqi" data-f="b1"> x</div>
      <div class="eqb"><button class="b t sm eqk">식 확인</button><span class="eqr"></span></div></div>
    <div class="eqc ln" data-n="1"><div class="eqt"><span class="eqn" style="background:#7C3AED">②</span> 같아지는 곳 — 두 식을 연립</div>
      <div class="eqf">정리하면 <input class="eqi" data-f="c"> x = <input class="eqi w" data-f="d"></div>
      <div class="eqf">x = <input class="eqi w" data-f="x"> 분</div>
      <div class="eqb"><button class="b t sm eqk">풀이 확인</button><span class="eqr"></span></div></div>
    <div class="eqc ln" data-n="2"><div class="eqt"><span class="eqn" style="background:#0E9384">③</span> 경계에서 두 요금은 얼마인가</div>
      <div class="eqf">A(150) = B(150) = <input class="eqi w" data-f="v"> 원</div>
      <div class="eqb"><button class="b t sm eqk">검산</button><span class="eqr"></span></div></div>
   </div>
  </div>`;
  const cv=root.querySelector('#l4c'),ctx=cv.getContext('2d'),W=400,H=300,P=40;
  const A=x=>8000+120*x, B=x=>20000+40*x, BE=150, BEV=A(150);   // 손익분기 150분 · 26,000원
  const S={x:60, aWin:false, bWin:false, atBE:false, eq:[false,false,false]};
  const MX=300, MY=45000;
  const X=v=>P+(W-P-14)*v/MX, Y=v=>H-P-(H-P-40)*v/MY;
  const invX=px=>(px-P)*MX/(W-P-14);
  function draw(){
    ctx.clearRect(0,0,W,H); ctx.fillStyle='#fff'; ctx.fillRect(0,0,W,H);
    ctx.strokeStyle='#F1F3F6';
    for(let m=0;m<=300;m+=50){ ctx.beginPath(); ctx.moveTo(X(m),30); ctx.lineTo(X(m),H-P); ctx.stroke(); }
    ctx.strokeStyle='#9CA3AF'; ctx.lineWidth=1.4;
    ctx.beginPath(); ctx.moveTo(P,H-P); ctx.lineTo(W-14,H-P); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(P,30); ctx.lineTo(P,H-P); ctx.stroke();
    ctx.strokeStyle='#2563EB'; ctx.lineWidth=2.4;
    ctx.beginPath(); ctx.moveTo(X(0),Y(A(0))); ctx.lineTo(X(300),Y(A(300))); ctx.stroke();
    ctx.strokeStyle='#0E9384';
    ctx.beginPath(); ctx.moveTo(X(0),Y(B(0))); ctx.lineTo(X(300),Y(B(300))); ctx.stroke();
    ctx.font='bold 11px sans-serif';
    ctx.fillStyle='#2563EB'; ctx.fillText('A', X(285), Y(A(285))-8);
    ctx.fillStyle='#0E9384'; ctx.fillText('B', X(285), Y(B(285))-8);
    /* 노트 ②를 통과하기 전에는 교점을 표시하지 않는다 — 손으로 구할 것이 화면에 있으면 안 된다 */
    if(S.eq[1]){ ctx.fillStyle='#B45309'; ctx.beginPath(); ctx.arc(X(BE),Y(BEV),5,0,7); ctx.fill(); }
    const x=S.x, a=A(x), b=B(x);
    ctx.strokeStyle='#B45309'; ctx.setLineDash([4,3]); ctx.lineWidth=1.5;
    ctx.beginPath(); ctx.moveTo(X(x),30); ctx.lineTo(X(x),H-P); ctx.stroke(); ctx.setLineDash([]);
    [[a,'#2563EB'],[b,'#0E9384']].forEach(q=>{ ctx.fillStyle=q[1];
      ctx.beginPath(); ctx.arc(X(x),Y(q[0]),5,0,7); ctx.fill(); });
    handle(ctx, X(x), H-P, '#B45309', x+'분');
    ctx.fillStyle='#6B7280'; ctx.font='10.5px sans-serif';
    ctx.fillText('통화량(분)', W-72, H-P+26);
    if(a<b) S.aWin=true; if(a>b) S.bWin=true; if(x===BE) S.atBE=true;
    root.querySelector('#l4lock').textContent = S.eq[1]
      ? '경계 자석 켜짐 — 구한 값 가까이 가면 딱 붙습니다.'
      : '노트 ②를 통과하면 경계 표시와 자석이 켜집니다.';
    root.querySelectorAll('.eqc.ln').forEach(el=>{
      el.hidden = el.dataset.n==='1' ? !S.eq[0] : !S.eq[1]; });
    const diff=a-b, hit=(x===BE);
    let msg=`<span class="mono">A: 8000 + 120×${x} = <b style="color:#2563EB">${a.toLocaleString()}원</b>
       &nbsp; B: 20000 + 40×${x} = <b style="color:#0E9384">${b.toLocaleString()}원</b></span><br>`
      + (hit
        ? `<b style="color:#B45309">두 요금이 정확히 같습니다 — ${a.toLocaleString()}원.</b>
           <span style="color:#6B7280;font-size:12.5px">여기가 두 직선의 교점이고, 연립방정식 8000+120x = 20000+40x 의 해입니다.</span>`
        : diff<0
        ? `차액 ${(-diff).toLocaleString()}원 — <b style="color:#2563EB">A 요금제가 유리</b>합니다.`
        : `차액 ${diff.toLocaleString()}원 — <b style="color:#0E9384">B 요금제가 유리</b>합니다.`);
    const st=[];
    if(S.aWin&&S.bWin&&S.eq[0]) st.push('🏁 미션1 달성');
    if(S.eq[1]) st.push('🏁 미션2 달성');
    if(S.atBE&&S.eq[2]) st.push('🏁 미션3 달성');
    root.querySelector('#l4o').innerHTML=msg+(st.length?'<div style="margin-top:6px;font-weight:800;color:#0E9384">'+st.join(' · ')+'</div>':'');
  }
  const num=el=>{ const v=parseFloat(String(el.value).replace(/[^0-9.\-]/g,'')); return isFinite(v)?v:NaN; };
  const near=(a,b)=>Math.abs(a-b)<0.5;
  root.querySelectorAll('.eqc[data-n]').forEach(el=>{ const k=+el.dataset.n;
    el.querySelector('.eqk').onclick=()=>{ const r=el.querySelector('.eqr'); let ok=false;
      if(k===0){
        const a0=num(el.querySelector('[data-f=a0]')), a1=num(el.querySelector('[data-f=a1]')),
              b0=num(el.querySelector('[data-f=b0]')), b1=num(el.querySelector('[data-f=b1]'));
        ok=near(a0,8000)&&near(a1,120)&&near(b0,20000)&&near(b1,40);
        r.innerHTML=ok?'<b style="color:#0E9384">통과 — 기본료가 상수, 분당 요금이 x 의 계수입니다.</b>'
          :(near(a0,120)||near(a1,8000)?'<span style="color:#BE123C">상수와 계수가 뒤바뀌었습니다. x 에 곱해지는 것이 분당 요금입니다.</span>'
            :'<span style="color:#BE123C">문제의 두 요금제를 다시 읽어 보세요 — 기본료와 분당 요금입니다.</span>');
      } else if(k===1){
        const c=num(el.querySelector('[data-f=c]')), d=num(el.querySelector('[data-f=d]')), x=num(el.querySelector('[data-f=x]'));
        ok=near(c,80)&&near(d,12000)&&near(x,BE);
        r.innerHTML=ok?'<b style="color:#0E9384">통과 — 80x = 12000, x = 150분. 이제 화면에서 확인해 보세요 🎯</b>'
          :(near(x,BE)?'<span style="color:#BE123C">답은 맞는데 정리한 식이 어긋납니다. x 항끼리(120−40), 상수끼리(20000−8000) 모아 보세요.</span>'
            :'<span style="color:#BE123C">8000 + 120x = 20000 + 40x 에서 x 항을 한쪽으로, 상수를 다른 쪽으로 옮기세요.</span>');
      } else {
        const v=num(el.querySelector('[data-f=v]'));
        ok=near(v,BEV);
        r.innerHTML=ok?`<b style="color:#0E9384">검산 통과 — 8000+120×150 = 26,000 = 20000+40×150 ✓</b>`
          :'<span style="color:#BE123C">150 을 두 식에 각각 대입해 보세요. 두 값이 같아야 합니다.</span>';
      }
      S.eq[k]=ok; draw(); }; });
  function setX(v){ S.x=Math.max(0,Math.min(300,Math.round(v))); draw(); }
  root.querySelector('#l4go').onclick=()=>{ const v=num(root.querySelector('#l4x')); if(isFinite(v)) setX(v); };
  root.querySelector('#l4x').onkeydown=e=>{ if(e.key==='Enter') root.querySelector('#l4go').click(); };
  dragOn(cv,{
    hit:p=>(Math.abs(p.y-(H-P))<24||Math.abs(p.x-X(S.x))<14)?'x':null,
    move:(h,p)=>{ let v=Math.round(invX(p.x));
      v=Math.max(0,Math.min(300,v));
      /* 자석은 노트 ②를 통과한 뒤에만 — 손으로 구한 답을 화면이 확인해 주는 순서다 */
      if(S.eq[1]&&Math.abs(v-BE)<=3) v=BE;
      S.x=v; draw(); }
  });
  draw();
  return { read:()=>{ const a=A(S.x), b=B(S.x);
    return [S.x, a.toLocaleString(), b.toLocaleString(), (a-b).toLocaleString(),
            a<b?'A 유리':a>b?'B 유리':'같음(경계)']; } };
 }
};
'''

CSS_NOTE = '''
/* LAB 04 수업 고도화 — 그래프와 수학 노트 나란히 (2026-09-21) */
.lg4wrap{display:grid;grid-template-columns:minmax(300px,430px) 1fr;gap:14px;align-items:start}
@media(max-width:820px){.lg4wrap{grid-template-columns:1fr}}
.lg4plot canvas{background:#fff;border:1px solid var(--line);border-radius:10px;max-width:100%;height:auto}
'''


def main(path):
    h = open(path, encoding='utf-8').read()

    i = h.find('LESSON[4]={')
    j = h.find('LESSON[5]={', i)
    assert i > 0 and j > i, 'LESSON[4] 자리를 못 찾음'
    # LESSON[5] 앞의 주석 줄까지 살려 둔다
    cut = h.rfind('/* ----------', i, j)
    end = cut if cut > i else j
    L = LESSON.replace('__B_PROBLEM__', img('c04_cross', '두 직선이 한 점에서 만나고, 그 점을 기준으로 유리한 쪽이 갈리는 그래프'))
    h = h[:i] + L + '\n' + h[end:]

    # PRINS[3] — 원리·탐침에 삽화
    k = h.find('const PRINS')
    assert k > 0, 'PRINS 를 못 찾음'
    starts, pos = [], k
    while len(starts) < 5:
        pos = h.find('\n{tex:[', pos + 1)
        assert pos > 0, 'PRINS 원소 경계를 못 찾음'
        starts.append(pos + 1)
    a, b = starts[3], starts[4]
    seg = h[a:b]
    for key, name, alt in [
        ('what', 'c04_parts', '직선 하나에서 시작 높이(기본료)와 기울기(분당 요금)를 표시한 그림'),
        ('probe', 'c04_gap', '왼쪽의 벌어진 차이를 같은 크기의 작은 조각들이 하나씩 메워 한 점에 닿는 그림'),
    ]:
        tag = img(name, alt)
        anchor = ' ' + key + ":'"
        if tag and tag not in seg and anchor in seg:
            seg = seg.replace(anchor, anchor + tag, 1)
    h = h[:a] + seg + h[b:]

    open(path, 'w', encoding='utf-8').write(h)
    print('LAB 04 고도화 적용 · 파일', round(len(h.encode('utf-8')) / 1048576, 2), 'MB')

    # CSS 는 styles.css 에
    css = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(path))), 'src', 'styles.css')
    if not os.path.exists(css):
        css = os.path.join(os.path.dirname(os.path.abspath(path)), 'styles.css')
    if os.path.exists(css):
        c = open(css, encoding='utf-8').read()
        if '.lg4wrap{' not in c:
            open(css, 'w', encoding='utf-8').write(c + CSS_NOTE)
            print('styles.css 에 .lg4wrap 추가')
        else:
            print('styles.css 이미 반영됨')


if __name__ == '__main__':
    main(sys.argv[1])
