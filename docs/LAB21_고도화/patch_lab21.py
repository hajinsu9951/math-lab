# -*- coding: utf-8 -*-
"""LAB 21 「y = x 대칭의 발견」 — 무리함수 추가 · 수학 노트(식 검사) · 삽화 4장.

작업지시 3절 「LAB 21 에 넣을 식 검사」:
  y = √(x−2) + 1 의 역함수는 y = (x−1)² + 2 (x ≥ 1).
  정의역 제한을 빠뜨리면 함수가 아니게 되는 지점이 핵심.

그래서 세 번째 함수 버튼으로 무리함수를 넣고, 노트에서
  ① f(x) = 2x − 3 의 역함수 꼴
  ② 무리함수의 역함수 꼴과 정의역
  ③ 정의역을 빼면 y = 6 이 되는 x 가 몇 개인가 (2개 → 제한하면 1개)
를 손으로 세우게 한다. 미션 2 는 식 없이 조작만으로 — x² 전체에서 깨지는 것을 보고 고치는 자리다.

사용: python docs/LAB21_고도화/patch_lab21.py dist/index.html
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


MISSIONS = r''' missions:[
  {t:'f(x) = 2x − 3 위의 파란 점을 끌어 거울 반대편 자취를 15점 이상 남기세요. 그리고 오른쪽 수학 노트 ①에 이 함수의 <b>역함수</b>를 세우세요.',
   re:'미션1 달성', do:'① 파란 점을 좌우로 끌기 ② 노트 ① — y = 2x − 3 을 x 에 대해 풀기',
   hand:'x 와 y 를 맞바꾸고 y 로 정리하는 과정을 종이에 쓰고, f⁻¹(f(4)) = 4 인지 검산'},
  {t:'함수를 y = x² (전체) 로 바꿔 <b>위쪽 가지와 아래쪽 가지를 모두</b> 지나며 자취를 남기세요. 무엇이 깨지는지 본 뒤, 「정의역 제한」을 켜 고치세요.',
   re:'미션2 달성', do:'① 「y = x² (전체)」 ② 점을 왼쪽 끝까지, 다시 오른쪽 끝까지 ③ 「정의역 제한 (x ≥ 0)」 체크',
   hand:'자취에 세로선을 그어 두 번 만나는 곳을 표시하고, 그것이 왜 함수가 아닌지 「한 입력 한 출력」으로 쓰기'},
  {t:'무리함수 y = √(x−2) + 1 로 바꿔 자취를 남기고, 노트 ②③으로 <b>역함수의 식과 정의역</b>을 확정하세요.',
   re:'미션3 달성', do:'① 「y = √(x−2) + 1」 ② 노트 ② 역함수 꼴과 정의역 ③ 노트 ③ 정의역을 빼면 몇 개인가',
   hand:'√ 를 없애려고 양변을 제곱할 때 무엇을 잃는지 쓰고, 그래서 정의역을 왜 적어야 하는지 설명'}],'''

NOTE_UI = r'''<div class="lg21wrap">
   <div class="lg21plot">
    <canvas id="ly1" width="400" height="330"></canvas>
    <div class="ctl" style="display:flex;gap:6px;flex-wrap:wrap;margin-top:8px">
      <button class="b t sm" data-f="lin">f(x) = 2x − 3</button>
      <button class="b t sm" data-f="sq">y = x² (전체)</button>
      <button class="b t sm" data-f="sqrt">y = √(x−2) + 1</button>
      <label class="ctl" style="margin:0 0 0 6px"><input type="checkbox" id="lyR"> 정의역 제한 (x ≥ 0)</label>
      <button class="b g sm" id="lyC">자취 지우기</button></div>
    <div class="out" id="lyout"></div>
    <div class="note" style="margin-top:6px"><b>파란 점을 그래프를 따라 끌면</b> 거울 반대편에 초록 자취가 남습니다.</div>
   </div>
   <div class="lg1math">
    <div class="lg1mh">✎ 수학 노트 — 거울을 식으로 옮긴다</div>
    <div class="eqc" data-n="0"><div class="eqt"><span class="eqn" style="background:#2563EB">①</span> f(x) = 2x − 3 의 역함수</div>
      <div class="eqf">f⁻¹(x) = ( x + <input class="eqi" data-f="a"> ) ÷ <input class="eqi" data-f="b"></div>
      <div class="eqb"><button class="b t sm eqk">식 확인</button><span class="eqr"></span></div></div>
    <div class="eqc ln" data-n="1"><div class="eqt"><span class="eqn" style="background:#0E9384">②</span> y = √(x−2) + 1 의 역함수와 정의역</div>
      <div class="eqf">y = ( x − <input class="eqi" data-f="a"> )<sup>2</sup> + <input class="eqi" data-f="b"></div>
      <div class="eqf">정의역 : x ≥ <input class="eqi" data-f="c"></div>
      <div class="eqb"><button class="b t sm eqk">식 확인</button><span class="eqr"></span></div></div>
    <div class="eqc ln" data-n="2"><div class="eqt"><span class="eqn" style="background:#BE123C">③</span> 정의역을 빼면 무엇이 깨지나</div>
      <div class="eqf">y = (x−1)² + 2 에서 y = 6 이 되는 x 는 <input class="eqi" data-f="a"> 개</div>
      <div class="eqf">x ≥ 1 로 제한하면 <input class="eqi" data-f="b"> 개</div>
      <div class="eqb"><button class="b t sm eqk">개수 확인</button><span class="eqr"></span></div></div>
   </div>
  </div>'''

DEMO_TAIL = r'''  const num=el=>{ const v=parseFloat(String(el.value).replace(/[^0-9.\-]/g,'')); return isFinite(v)?v:NaN; };
  const near=(a,b)=>Math.abs(a-b)<0.001;
  root.querySelectorAll('.eqc[data-n]').forEach(el=>{ const k=+el.dataset.n;
    el.querySelector('.eqk').onclick=()=>{ const r=el.querySelector('.eqr');
      const a=num(el.querySelector('[data-f=a]')), b=num(el.querySelector('[data-f=b]'));
      const cEl=el.querySelector('[data-f=c]'), c=cEl?num(cEl):null;
      let ok=false;
      if(k===0){ ok=near(a,3)&&near(b,2);
        r.innerHTML=ok?'<b style="color:#0E9384">통과 — f⁻¹(x) = (x+3)/2. 검산 f⁻¹(7) = 5, f(5) = 7 ✓</b>'
          :(near(a,-3)?'<span style="color:#BE123C">부호를 보세요 — y = 2x − 3 에서 3 을 <b>넘기면</b> 더해집니다.</span>'
            :'<span style="color:#BE123C">y = 2x − 3 을 x 에 대해 풀어 보세요.</span>'); }
      else if(k===1){ ok=near(a,1)&&near(b,2)&&near(c,1);
        r.innerHTML=ok?'<b style="color:#0E9384">통과 — y = (x−1)² + 2, 단 x ≥ 1. 원함수의 <b>치역</b>이 역함수의 정의역이 됩니다.</b>'
          :(near(a,1)&&near(b,2)&&(c===null||!near(c,1))
            ? '<span style="color:#BE123C">식은 맞습니다. 그런데 정의역을 적지 않으면 <b>함수가 아닙니다</b> — 원함수의 y 값은 늘 1 이상이었습니다.</span>'
            : '<span style="color:#BE123C">x 와 y 를 맞바꾸고 √ 를 없애려 양변을 제곱해 보세요.</span>'); }
      else { ok=near(a,2)&&near(b,1);
        r.innerHTML=ok?'<b style="color:#0E9384">통과 — 제한이 없으면 x = 3 과 x = −1 두 개, 제한하면 x = 3 하나. 이것이 정의역을 적는 까닭입니다.</b>'
          :'<span style="color:#BE123C">(x−1)² = 4 를 푸세요. 제곱해서 4 가 되는 수는 몇 개입니까?</span>'; }
      S.eq[k]=ok; draw(); }; });
  dragOn(cv,{
    hit:p=>{ const D=F[S.f], fa=D.f(S.a);
      return Math.hypot(p.x-XX(S.a),p.y-YY(fa))<22?'a':null; },
    move:(h,p)=>{ const D=F[S.f];
      const lo=S.restrict&&S.f==='sq'?0:D.lo;
      S.a=Math.max(lo,Math.min(D.hi,(p.x-O)/SC));
      const fa=D.f(S.a);
      if(Math.abs(fa)<=6){
        const last=S.trail[S.trail.length-1];
        if(!last||Math.hypot(last[0]-S.a,last[1]-fa)>0.18) S.trail.push([S.a,fa]);
        if(S.trail.length>60) S.trail.shift();
      }
      draw(); }
  });
  root.querySelectorAll('[data-f]').forEach(b=>{ if(!b.dataset.f||b.tagName!=='BUTTON') return;
    b.onclick=()=>{ S.f=b.dataset.f; S.a=S.f==='sqrt'?3:1.5; S.trail=[]; draw(); }; });
  root.querySelector('#lyR').onchange=e=>{ S.restrict=e.target.checked; S.trail=[]; draw(); };
  root.querySelector('#lyC').onclick=()=>{ S.trail=[]; draw(); };
  draw();
  return { read:()=>{ const D=F[S.f], fa=D.f(S.a);
    return [S.f==='lin'?'2x−3':S.f==='sqrt'?'√(x−2)+1':'x²'+(S.restrict?'(x≥0)':'(전체)'),
            '('+S.a.toFixed(1)+', '+fa.toFixed(1)+')',
            '('+fa.toFixed(1)+', '+S.a.toFixed(1)+')','맞바뀜',
            S.f==='sq'&&!S.restrict?'함수 아님':'함수']; } };
 }
};'''


def main(path):
    h = open(path, encoding='utf-8').read()
    i = h.find('LESSON[21]={')
    j = h.find('/* ═══════════════ 수업 모형 확장 배치 A', i)
    assert i > 0 and j > i, 'LESSON[21] 자리를 못 찾음'
    block = h[i:j]

    # 1) 문제·적용 삽화
    t = img('b21_problem', '점선으로 그은 대각선 양쪽에 거울처럼 마주 보는 두 곡선')
    if t and 'class="lsimg"' not in block.split('predict:')[0]:
        block = block.replace('  svg:`<svg viewBox="0 0 400 175"', '  svg:`' + t + '\n   <svg viewBox="0 0 400 175"', 1)

    old_apply = """ apply:{
  q:'새 문제 — f(x) = 2x − 3 의 역함수를 구해 <b>f⁻¹(7)</b> 을 계산하세요.',
  a:5, tol:0.001,
  why:'y = 2x−3 에서 x = (y+3)/2 — 그래서 f⁻¹(7) = 10/2 = 5. 검산: f(5) = 7 ✓',
  hint:'x 와 y 를 맞바꾸고 y 로 정리해 보세요. 또는 “7 이 나오는 입력”을 직접 찾아도 됩니다.' },"""
    new_apply = (""" apply:{
  q:`""" + img('b21_apply', '점선 대각선을 사이에 두고 마주 보는 제곱근 곡선과 포물선') + """
     새 문제 — f(x) = √(x−2) + 1 의 역함수 f⁻¹ 에 대해 <b>f⁻¹(4)</b> 를 구하세요.`,
  a:11, tol:0.001,
  why:'y = √(x−2)+1 에서 x 와 y 를 맞바꿔 풀면 y = (x−1)² + 2 (x ≥ 1). 4 를 넣으면 (4−1)² + 2 = 11. 검산: f(11) = √9 + 1 = 4 ✓. 정의역 x ≥ 1 이 있어야 답이 <b>하나</b>로 정해집니다.',
  hint:'√ 를 없애려면 양변을 제곱하세요. 그리고 원함수의 y 가 어디까지 갈 수 있었는지 보세요.' },""")
    # 두 번째로 돌릴 때는 이미 바뀌어 있다 — 그때는 건너뛴다 (패치는 몇 번을 돌려도 같아야 한다)
    if old_apply in block:
        block = block.replace(old_apply, new_apply, 1)
    else:
        assert 'f⁻¹(4)' in block, 'LESSON[21].apply 자리를 못 찾음'

    # 2) 미션 — 식 검사를 신호에 묶는다
    ms = block.find(' missions:[')
    me = block.find(' inquiry:{', ms)
    assert ms > 0 and me > ms, 'LESSON[21].missions 자리를 못 찾음'
    block = block[:ms] + MISSIONS + '\n' + block[me:]

    # 3) demo 통째로 — 무리함수 · 수학 노트 · 미션 신호
    ds = block.find(' demo(root){')
    assert ds > 0, 'LESSON[21].demo 자리를 못 찾음'
    demo = r''' demo(root){
  root.innerHTML=`''' + NOTE_UI + r'''`;
  const cv=root.querySelector('#ly1'),ctx=cv.getContext('2d'),W=400,H=330,O=170,SC=27;
  const XX=v=>O+v*SC, YY=v=>165-v*SC;
  const S={ f:'lin', a:1.5, trail:[], badSeen:false, fixSeen:false, linDone:false, sqrtSeen:false,
            restrict:false, eq:[false,false,false] };
  /* 끌 수 있는 범위는 |y| ≤ 6 안으로 둔다.
     원래는 lin 이 x∈[−4,5](y 는 −11까지) · sq 가 x∈[−3.4,3.4](y 는 11.6까지)여서,
     끝까지 끌면 손잡이가 화면 밖으로 나가 다시 잡을 수 없었다. */
  const F={ lin:{ f:x=>2*x-3, lo:-1.5, hi:4.5 },
            sq:{ f:x=>x*x, lo:-2.44, hi:2.44 },
            sqrt:{ f:x=>Math.sqrt(x-2)+1, lo:2, hi:6 } };
  /* sqrt 의 거울상은 포물선이라 가파르다 — x 를 6 까지로 두어야 초록 자취가 화면 안에 남는다 */
  const NAME={ lin:'f(x) = 2x − 3', sq:'y = x²', sqrt:'y = √(x−2) + 1' };
  function draw(){
    const D=F[S.f];
    ctx.clearRect(0,0,W,H); ctx.fillStyle='#fff'; ctx.fillRect(0,0,W,H);
    ctx.strokeStyle='#F1F3F6';
    for(let v=-6;v<=8;v++){ ctx.beginPath(); ctx.moveTo(XX(v),8); ctx.lineTo(XX(v),H-8); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(10,YY(v)); ctx.lineTo(W-8,YY(v)); ctx.stroke(); }
    ctx.strokeStyle='#9CA3AF'; ctx.lineWidth=1.4;
    ctx.beginPath(); ctx.moveTo(XX(-6),YY(0)); ctx.lineTo(XX(8),YY(0)); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(XX(0),YY(6)); ctx.lineTo(XX(0),YY(-6)); ctx.stroke();
    ctx.strokeStyle='#B45309'; ctx.setLineDash([5,3]); ctx.lineWidth=1.8;
    ctx.beginPath(); ctx.moveTo(XX(-5.6),YY(-5.6)); ctx.lineTo(XX(6),YY(6)); ctx.stroke(); ctx.setLineDash([]);
    ctx.fillStyle='#B45309'; ctx.font='bold 11px sans-serif';
    ctx.fillText('y = x (거울)', XX(4.3), YY(4.9));
    const lo=S.restrict&&S.f==='sq'?0:D.lo;
    ctx.strokeStyle='#2563EB'; ctx.lineWidth=2.4; ctx.beginPath(); let on=false;
    for(let i=0;i<=200;i++){ const x=lo+(D.hi-lo)*i/200, y=D.f(x);
      if(Math.abs(y)>6.2){on=false;continue;}
      const px=XX(x), py=YY(y); on?ctx.lineTo(px,py):ctx.moveTo(px,py); on=true; }
    ctx.stroke();
    S.trail.forEach(t=>{ ctx.fillStyle='rgba(14,147,132,.55)';
      ctx.beginPath(); ctx.arc(XX(t[1]),YY(t[0]),3,0,7); ctx.fill(); });
    const a=S.a, fa=D.f(a);
    if(Math.abs(fa)<=6){
      ctx.strokeStyle='#BE123C'; ctx.setLineDash([3,3]); ctx.lineWidth=1.3;
      ctx.beginPath(); ctx.moveTo(XX(a),YY(fa)); ctx.lineTo(XX(fa),YY(a)); ctx.stroke(); ctx.setLineDash([]);
      handle(ctx, XX(a), YY(fa), '#2563EB','('+a.toFixed(1)+', '+fa.toFixed(1)+')');
      ctx.fillStyle='#0E9384'; ctx.beginPath(); ctx.arc(XX(fa),YY(a),5.5,0,7); ctx.fill();
      ctx.fillStyle='#111827'; ctx.font='bold 10.5px sans-serif';
      ctx.fillText('('+fa.toFixed(1)+', '+a.toFixed(1)+')', XX(fa)+8, YY(a)-7);
    }
    let msg=`<span class="mono">${NAME[S.f]}${S.f==='sq'?(S.restrict?' (x ≥ 0)':' (전체)'):''}</span> · 자취 ${S.trail.length}점`;
    if(S.f==='lin'&&S.trail.length>=15){ S.linDone=true;
      msg+=' — <b style="color:#0E9384">초록 자취가 곧 역함수의 그래프입니다.</b>'; }
    if(S.f==='sq'&&!S.restrict){
      const dup=S.trail.some(t=>S.trail.some(u=>Math.abs(t[1]-u[1])<0.15&&Math.abs(t[0]-u[0])>0.5&&Math.abs(t[0]+u[0])<0.4));
      if(dup||(S.trail.filter(t=>t[1]>0.5).length>=6&&S.trail.some(t=>t[0]<-0.4)&&S.trail.some(t=>t[0]>0.4))){
        msg+=' — <b style="color:#BE123C">한 x 에 y 가 두 개! 세로선이 자취를 두 번 뚫습니다 — 함수가 아닙니다.</b>';
        S.badSeen=true;
      } else msg+=' — <span style="color:#6B7280">위쪽 가지와 아래쪽 가지를 모두 지나 보세요.</span>';
    }
    if(S.f==='sq'&&S.restrict){ if(S.badSeen&&S.trail.length>=6) S.fixSeen=true;
      msg+=' — <b style="color:#0E9384">잘라 내니(x ≥ 0) 한 입력에 한 출력 — 이제 역함수가 됩니다.</b>'; }
    if(S.f==='sqrt'){ if(S.trail.length>=10) S.sqrtSeen=true;
      msg+=' — <span style="color:#6B7280">초록 자취가 포물선의 <b>오른쪽 반쪽</b>만 그립니다. 왼쪽 반쪽은 어디로 갔을까요?</span>'; }
    const st=[];
    if(S.linDone&&S.eq[0]) st.push('🏁 미션1 달성');
    if(S.badSeen&&S.fixSeen) st.push('🏁 미션2 달성');
    if(S.sqrtSeen&&S.eq[1]&&S.eq[2]) st.push('🏁 미션3 달성');
    root.querySelector('#lyout').innerHTML=msg+(st.length?'<div style="margin-top:6px;font-weight:800;color:#0E9384">'+st.join(' · ')+'</div>':'');
  }
''' + DEMO_TAIL
    block = block[:ds] + demo

    h = h[:i] + block + '\n\n' + h[j:]

    # 4) PRINS[20] — what · probe 앞에 삽화
    k = h.find('const PRINS = [')
    starts = []
    pos = k
    while len(starts) < 22:
        pos = h.find('\n{tex:[', pos + 1)
        assert pos > 0, 'PRINS 원소 경계를 못 찾음'
        starts.append(pos + 1)
    a, b = starts[20], starts[21]
    seg = h[a:b]
    for key, name, alt in [('what', 'b21_what', '점선 대각선을 따라 접으면 두 곡선이 정확히 포개지는 종이'),
                           ('probe', 'b21_probe', '한쪽 반쪽이 회색으로 지워진 포물선과 꼭짓점을 자르는 가위')]:
        tag = img(name, alt)
        anchor = ' ' + key + ":'"
        if tag and tag not in seg and anchor in seg:
            seg = seg.replace(anchor, anchor + tag, 1)
    h = h[:a] + seg + h[b:]

    # 5) CSS
    css = '''
/* LAB 21 수업 고도화 — 그래프와 수학 노트 나란히 (2026-09-18) */
.lg21wrap{display:grid;grid-template-columns:minmax(300px,430px) 1fr;gap:14px;align-items:start}
@media(max-width:820px){.lg21wrap{grid-template-columns:1fr}}
.lg21plot canvas{background:#fff;border:1px solid var(--line);border-radius:10px;max-width:100%;height:auto}
'''
    if '.lg21wrap{' not in h:
        h = h.replace('</style>', css + '</style>', 1)

    open(path, 'w', encoding='utf-8').write(h)
    print('patched; size MB', round(len(h.encode('utf-8')) / 1048576, 2))


if __name__ == '__main__':
    main(sys.argv[1])
