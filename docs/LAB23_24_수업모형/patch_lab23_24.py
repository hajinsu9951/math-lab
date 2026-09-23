# -*- coding: utf-8 -*-
"""LAB 23 테일러 근사 · LAB 24 회전체의 부피 — 7단계 수업 모형 + 탐구 노트.

실험 화면은 이미 있는 taylorDemo · revolveDemo 를 그대로 쓴다.
탐구 노트가 화면 값을 읽어야 하므로 ① 계산 결과를 S.last 에 담아 두고 ② read() 를 돌려준다.

문제 그림(SVG)의 좌표는 모두 **식에서 계산**한다 — 손으로 찍으면 접선이 접선이 아니게 된다
(LAB 13 에서 실제로 그런 일이 있었다).

사용: python docs/LAB23_24_수업모형/patch_lab23_24.py src/40-demos.js
"""
import sys, math

# ══════════════ 실험 화면에 read() 붙이기 ══════════════
TY_OLD = """    const dist=Math.abs(S.x0-S.a);
    $('#tyout').innerHTML ="""
TY_NEW = """    const dist=Math.abs(S.x0-S.a);
    S.last={fa:fa, pa:pa, err:err, digits:digits, dist:dist};   // 탐구 노트가 읽어 간다
    $('#tyout').innerHTML ="""

TY_END_OLD = """  $('#tyRs').onclick=()=>{ S.n=1; draw(); };
  draw();
}"""
TY_END_NEW = """  $('#tyRs').onclick=()=>{ S.n=1; draw(); };
  draw();

  /* 탐구 노트가 읽어 갈 값 — 화면에 지금 보이는 것 그대로 */
  return { read:()=>{
    const L=S.last||{}, NM={sin:'sin x', cos:'cos x', exp:'e^x', geo:'1/(1-x)', log:'ln(1+x)'};
    return [NM[S.k]||S.k, String(S.n+1), S.a.toFixed(2), S.x0.toFixed(2),
            isFinite(L.err)?L.err.toExponential(3):'발산',
            isFinite(L.err)?String(L.digits):'-'];
  }};
}"""

RV_OLD = """    const err=Math.abs(A.v-E)/E*100;
    $('#rvout').innerHTML ="""
RV_NEW = """    const err=Math.abs(A.v-E)/E*100;
    S.last={v:A.v, e:E, err:err, dy:YMAX/S.n};   // 탐구 노트가 읽어 간다
    $('#rvout').innerHTML ="""

RV_END_OLD = """  ['rvP1','rvP2','rvP3','rvP4'].forEach(k=>{
    $('#'+k).onclick=()=>{ S.r=PRESET[k].slice(); draw(); };
  });
  draw();
}"""
RV_END_NEW = """  ['rvP1','rvP2','rvP3','rvP4'].forEach(k=>{
    $('#'+k).onclick=()=>{ S.r=PRESET[k].slice(); draw(); };
  });
  draw();

  /* 탐구 노트가 읽어 갈 값 — 화면에 지금 보이는 것 그대로 */
  return { read:()=>{
    const L=S.last||{};
    return [String(S.n), isFinite(L.dy)?L.dy.toFixed(3):'-',
            isFinite(L.v)?L.v.toFixed(4):'-', isFinite(L.e)?L.e.toFixed(4):'-',
            isFinite(L.err)?L.err.toFixed(2):'-'];
  }};
}"""


# ══════════════ 문제 그림 — 좌표를 식에서 계산한다 ══════════════
def poly(fn, x0, x1, X, Y, n=80):
    pts = []
    for k in range(n + 1):
        x = x0 + (x1 - x0) * k / n
        y = fn(x)
        if y is None or abs(y) > 1e3:
            continue
        pts.append('%s%.1f %.1f' % ('M' if not pts else 'L', X(x), Y(y)))
    return ' '.join(pts)


# LAB 23 — sin x 와 3차·5차 테일러
TX0, TX1, TY0, TY1 = 34.0, 386.0, 22.0, 148.0
TXR, TYR = 4.2, 1.9                      # x ∈ [-4.2, 4.2], y ∈ [-1.9, 1.9]
TX = lambda x: (TX0 + TX1) / 2 + (TX1 - TX0) / 2 * x / TXR
TY = lambda y: (TY0 + TY1) / 2 - (TY1 - TY0) / 2 * y / TYR
T_SIN = poly(math.sin, -TXR, TXR, TX, TY)
T_P3 = poly(lambda x: x - x ** 3 / 6, -TXR, TXR, TX, TY)
T_P5 = poly(lambda x: x - x ** 3 / 6 + x ** 5 / 120, -TXR, TXR, TX, TY)

# LAB 24 — 그릇 옆면과 원판
RX0, RY0, RY1 = 92.0, 26.0, 150.0        # 회전축 x, 위 y, 아래 y
RSC = 62.0                                # 반지름 1 = 62px
RPROF = [0.62, 0.92, 1.10, 1.00, 0.70]    # 화면 기본 그릇


def rad(t):
    """제어점 다섯 개를 지나는 부드러운 옆면 — 선형 보간으로 충분하다."""
    u = t * (len(RPROF) - 1)
    i = min(int(u), len(RPROF) - 2)
    f = u - i
    return RPROF[i] * (1 - f) + RPROF[i + 1] * f


R_SIDE = ' '.join('%s%.1f %.1f' % ('M' if k == 0 else 'L',
                                   RX0 + RSC * rad(k / 40), RY1 - (RY1 - RY0) * k / 40)
                  for k in range(41))
R_DISKS = ''.join(
    '<rect x="%.1f" y="%.1f" width="%.1f" height="%.1f" fill="#2563EB" opacity=".16" stroke="#93B4F7" stroke-width="1"/>'
    % (RX0 - RSC * rad((k + .5) / 8), RY1 - (RY1 - RY0) * (k + 1) / 8,
       2 * RSC * rad((k + .5) / 8), (RY1 - RY0) / 8)
    for k in range(8))


LESSON23 = """LESSON[23]={
 title:'테일러 근사 — 다항식으로 흉내 내기',
 problem:{
  q:'계산기에 sin 1 을 넣으면 0.8414709848… 이 뜹니다. 그런데 계산기 안에는 삼각함수표도 자도 없습니다. <b>덧셈과 곱셈만</b> 할 줄 아는 기계가 어떻게 sin 을 알까요?',
  svg:`<svg viewBox="0 0 400 170" role="img" aria-label="사인 곡선과 3차·5차 테일러 다항식이 원점 근처에서 겹치다가 멀어지며 벌어지는 그림">
    <path d="M34 85 H386 M210 22 V148" stroke="#9CA3AF" stroke-width="1.2"/>
    <path d="__SIN__" stroke="#111827" stroke-width="2.4" fill="none"/>
    <path d="__P3__" stroke="#B45309" stroke-width="1.8" fill="none" stroke-dasharray="5 3"/>
    <path d="__P5__" stroke="#0E9384" stroke-width="1.8" fill="none"/>
    <circle cx="210" cy="85" r="4" fill="#BE123C"/>
    <text x="216" y="80" font-size="9.5" font-weight="800" fill="#BE123C">전개 중심 a = 0</text>
    <text x="384" y="34" font-size="10" font-weight="800" fill="#92400E" text-anchor="end">x − x³/6</text>
    <text x="384" y="50" font-size="10" font-weight="800" fill="#0B6E63" text-anchor="end">x − x³/6 + x⁵/120</text>
    <text x="200" y="164" font-size="10.5" fill="#6B7280" text-anchor="middle">중심 가까이는 겹치고, 멀어지면 벌어진다 — 항을 더 쌓으면?</text>
  </svg>`,
  sit:'항을 <b>한 개씩 손으로 쌓거나 빼고</b>, 전개 중심 a 를 축에서 끌어 옮기고, 검사점 x 를 끌어 그 자리의 오차를 읽습니다. 아래 오차 곡선이 «a 근처에서만 잘 맞는다»와 «수렴반경 밖에서는 항을 늘릴수록 더 벌어진다»를 동시에 보여 줍니다.'
 },
 predict:{
  q:['sin x 를 x 하나로만 흉내 내면 어디까지 맞을까요? 그림에 선을 그어 예상해 보세요.',
     '항을 더 쌓으면 <b>어디가</b> 좋아질지 예상하세요 — 전체일까요, 중심 근처일까요?',
     '1/(1 − x) 는 x = 2 에서도 항을 쌓으면 맞을까요? 그렇게 생각한 까닭을 적으세요.'] },
 missions:[
  {t:'sin x 에서 <b>＋항</b> 을 눌러 항을 쌓아 보세요. 검은 곡선과 언제부터 겹쳐 보이나요?', re:'자리까지 일치'},
  {t:'f(x) = 1/(1 − x) 로 바꾸고 검사점 x 를 <b>1 보다 크게</b> 끌어 보세요. 항을 늘리면 어떻게 되나요?', re:'수렴반경'},
  {t:'아래 <b>탐구 노트</b>로 마무리하세요 — 지금 오차를 <b>기록</b>하고, 항을 더 쌓아 <b>몇 배로 줄었는지 계산</b>하고, 검사점을 멀리 옮겨 <b>판단</b>합니다.',
   re:'탐구 노트 통과',
   do:'① 항 5개 이상에서 (항수·a·x·오차) 적기 ② 항을 2개 더 쌓아 새 오차를 적고 몇 배로 줄었는지 구하기 ③ 검사점을 중심에서 2 이상 멀리 옮겨 다시 재기',
   hand:'“항을 늘리면 언제나 좋아진다”가 참인지 거짓인지, 내가 잰 수치를 근거로 적기'}],
 inquiry:{
  id:'ty23', title:'테일러 — 중심 가까이만, 그러나 아주 정확하게',
  q:['함수·항 수·중심 a·검사점 x 를 바꿔 가며 오차를 여섯 줄 이상 기록하세요.',
     '같은 x 에서 항을 두 개 늘리면 오차가 몇 배로 줄어드나요? 중심에서 가까울 때와 멀 때를 각각 확인하세요.',
     '1/(1 − x) 에서 x > 1 이면 왜 항을 늘려도 벌어지는지 손으로 설명하세요.'],
  cols:['함수','쌓은 항 수','중심 a','검사점 x','오차','맞는 자릿수'],
  hint:'힌트 — 오차는 대략 |x − a| 의 거듭제곱으로 줄어듭니다. 그래서 <b>멀어지면</b> 항을 늘려도 더디게 좋아집니다.' },
 apply:{
  q:'새 문제 — sin x ≈ x − x³/6 로 <b>sin 0.5</b> 를 구하면? (소수 넷째 자리까지)',
  a:0.4792, tol:0.0006,
  why:'0.5 − 0.5³/6 = 0.5 − 0.125/6 = 0.5 − 0.0208333 = 0.4791667 → 0.4792. 참값 0.4794 와 셋째 자리까지 같습니다.',
  hint:'x = 0.5 를 그대로 넣으세요. 0.5³ = 0.125.' },
 demo(root){ return taylorDemo(root); }
};

"""

LESSON24 = """LESSON[24]={
 title:'회전체의 부피 — 원판으로 쌓기',
 problem:{
  q:'도자기 그릇에 물이 몇 mL 들어갈까요? 그릇은 <b>곡선을 축 둘레로 돌린</b> 모양입니다. 자로는 옆면의 반지름밖에 잴 수 없는데, 그것만으로 부피를 알 수 있을까요?',
  svg:`<svg viewBox="0 0 400 170" role="img" aria-label="그릇의 옆면을 회전축 둘레로 돌리고 원판을 여덟 장 쌓아 부피를 어림하는 그림">
    __DISKS__
    <path d="M__AX__ __TOP__ V__BOT__" stroke="#BE123C" stroke-width="1.5" stroke-dasharray="5 3"/>
    <text x="__AXT__" y="20" font-size="9.5" font-weight="800" fill="#BE123C" text-anchor="middle">회전축</text>
    <path d="__SIDE__" stroke="#111827" stroke-width="2.4" fill="none"/>
    <path d="__SIDEM__" stroke="#111827" stroke-width="1.2" fill="none" opacity=".35"/>
    <path d="M250 150 H372" stroke="#9CA3AF" stroke-width="1.2"/>
    <text x="312" y="140" font-size="10.5" font-weight="800" fill="#1D4ED8" text-anchor="middle">원판 한 장</text>
    <text x="312" y="124" font-size="10" fill="#6B7280" text-anchor="middle">π r² × Δy</text>
    <text x="200" y="166" font-size="10.5" fill="#6B7280" text-anchor="middle">원판을 더 얇게 더 많이 쌓으면 참값에 얼마나 붙을까?</text>
  </svg>`,
  sit:'제어점 다섯 개를 끌어 <b>내 그릇의 옆면 r(y) 를 직접</b> 만들고, 원판을 한 장씩 늘려 가며 Σπr²Δy 가 참값에 붙는 과정을 봅니다. 참값은 촘촘한 수치적분(2000등분)으로 따로 구해 두고 오차를 % 로 보여 줍니다.'
 },
 predict:{
  q:['원판 여덟 장으로 어림한 부피는 참값보다 클까요, 작을까요? 그릇 모양을 보고 예상하세요.',
     '원판을 두 배로 늘리면 오차는 어떻게 될지 예상하세요 — 절반? 4분의 1? 그대로?',
     '그릇을 더 잘록하게 만들면 같은 원판 수에서 오차가 어떻게 달라질지 적으세요.'] },
 missions:[
  {t:'원판 수를 <b>＋2배</b> 로 늘려 가며 오차가 어떻게 줄어드는지 보세요.', re:'오차'},
  {t:'제어점을 끌어 <b>내 그릇</b>을 만들어 보세요. 잘록한 그릇에서 오차가 더 큰가요?', re:'정확한 부피'},
  {t:'아래 <b>탐구 노트</b>로 마무리하세요 — 원판 8장의 값을 <b>기록</b>하고, 두 배로 늘려 오차가 <b>몇 배로 줄었는지 계산</b>하고, 규칙을 <b>판단</b>합니다.',
   re:'탐구 노트 통과',
   do:'① 원판 8장에서 (근사 부피·정확한 부피·오차) 적기 ② 16장으로 늘려 새 오차를 적고 몇 배로 줄었는지 구하기 ③ 한 번 더 두 배로 늘려 같은 규칙인지 확인',
   hand:'원판 수와 오차 사이의 관계를 내 말로 적고, 왜 그렇게 되는지 그림으로 설명하기'}],
 inquiry:{
  id:'rv24', title:'회전체 — 얇게 많이 쌓을수록',
  q:['원판 수를 2배씩 늘려 가며 (n, Δy, 근사 부피, 정확한 부피, 오차%) 를 여섯 줄 이상 기록하세요.',
     '원판 수가 2배가 될 때 오차는 몇 배가 되나요? 표에서 직접 확인하세요.',
     '“원판을 무한히 얇게 하면 적분이 된다”를 기록한 수치를 근거로 설명하세요.'],
  cols:['원판 수 n','Δy','근사 부피','정확한 부피','오차(%)'],
  hint:'힌트 — Δy 가 절반이 되면 각 원판의 어긋남도 대략 절반이 됩니다.' },
 apply:{
  q:'새 문제 — 반지름이 <b>늘 2</b> 인 원기둥을 높이 <b>5</b> 만큼 쌓으면 부피는? (π = 3.14, 소수 첫째 자리)',
  a:62.8, tol:0.4,
  why:'원판의 넓이가 늘 π r² = 3.14 × 4 = 12.56 이므로 부피 = 12.56 × 5 = 62.8.',
  hint:'반지름이 변하지 않으면 Σπr²Δy = πr² × (전체 높이).' },
 demo(root){ return revolveDemo(root); }
};

"""

NOTE23 = """
 /* LAB 23 테일러 근사 — 내가 쌓은 항으로 내가 오차를 재고 규칙을 찾는다 */
 23:{ h:'내가 쌓고 · 내가 재고 · 내가 판단한다',
  c:[
  {t:'기록 — 항을 <b>5개 이상</b> 쌓은 뒤 화면의 값을 그대로 옮겨 적으세요',
   f:'쌓은 항 수 = {0} · 중심 a = {1} · 검사점 x = {2} · 오차 = {3}',
   chk(got, r, mem){
     if(!r) return {ok:false, msg:'아직 화면 값이 없습니다. ＋항 을 눌러 보세요.'};
     const n=noteNum(r[1]), a=noteNum(r[2]), x=noteNum(r[3]), e=noteNum(r[4]);
     if(!isFinite(e)) return {ok:false, msg:'지금은 발산하고 있습니다. 검사점을 중심 가까이로 옮기세요.'};
     if(n<5) return {ok:false, msg:'항이 '+n+'개뿐입니다. 5개 이상 쌓으세요.'};
     if(![0,1,2,3].every(j=>isFinite(got[j]))) return {ok:false, msg:'네 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-n)>0.5) return {ok:false, msg:'항 수가 다릅니다 — 화면은 '+n+' 입니다.'};
     if(Math.abs(got[1]-a)>0.02) return {ok:false, msg:'중심 a 가 다릅니다 — 화면은 '+a+' 입니다.'};
     if(Math.abs(got[2]-x)>0.02) return {ok:false, msg:'검사점 x 가 다릅니다 — 화면은 '+x+' 입니다.'};
     if(!(got[3]>0) || Math.abs(Math.log10(got[3])-Math.log10(e))>0.25)
       return {ok:false, msg:'오차가 다릅니다 — 화면은 '+r[4]+' 입니다. 지수 표기 그대로 옮겨 적어도 됩니다.'};
     mem.n=n; mem.a=a; mem.x=x; mem.e=e;
     return {ok:true, msg:'기록했습니다 — 이 오차가 «지금 이 항 수에서의 실력»입니다.'};
   }},
  {t:'생각 — 항을 <b>2개 더</b> 쌓은 뒤 새 오차를 적고, 몇 배로 줄었는지 구하세요',
   f:'새 오차 = {0} · 줄어든 배수 (이전 오차 ÷ 새 오차) = {1}',
   chk(got, r, mem){
     if(mem.e===undefined) return {ok:false, msg:'① 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const n=noteNum(r[1]), e2=noteNum(r[4]);
     if(n < mem.n+2) return {ok:false, msg:'아직 '+n+'항입니다. ①의 '+mem.n+'항에서 <b>2개 더</b> 쌓으세요.'};
     if(Math.abs(noteNum(r[3])-mem.x)>0.02) return {ok:false, msg:'검사점이 바뀌었습니다. ②에서는 x 를 그대로 두세요.'};
     if(!isFinite(e2)||e2<=0) return {ok:false, msg:'오차를 읽을 수 없습니다.'};
     if(![0,1].every(j=>isFinite(got[j]))) return {ok:false, msg:'두 칸을 모두 채우세요.'};
     if(!(got[0]>0) || Math.abs(Math.log10(got[0])-Math.log10(e2))>0.25)
       return {ok:false, msg:'새 오차가 다릅니다 — 화면은 '+r[4]+' 입니다.'};
     const k=mem.e/e2;
     if(!(got[1]>0) || Math.abs(Math.log10(got[1])-Math.log10(k))>0.3)
       return {ok:false, msg:'①의 오차를 새 오차로 나누세요.'};
     mem.k=k;
     return {ok:true, msg:'계산했습니다 — 항 두 개에 오차가 약 '+k.toFixed(0)+'배 줄었습니다. 이것이 중심 근처에서의 힘입니다.'};
   }},
  {t:'판단 — 검사점 x 를 중심에서 <b>2 이상 멀리</b> 옮겨 같은 항 수로 다시 재고, 고르세요',
   f:'멀리 옮긴 x = {0} · 그때의 오차 = {1}',
   opts:['중심에서 멀어지면 같은 항 수로도 오차가 훨씬 커진다 — 항은 중심 근처를 먼저 산다',
         '중심에서 멀어져도 항 수만 같으면 오차는 비슷하다',
         '중심에서 멀어지면 오히려 오차가 작아진다'],
   chk(got, r, mem, pick){
     if(mem.k===undefined) return {ok:false, msg:'② 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const x2=noteNum(r[3]), e3=noteNum(r[4]);
     if(Math.abs(x2-mem.a) < Math.abs(mem.x-mem.a)+2)
       return {ok:false, msg:'아직 중심에서 '+Math.abs(x2-mem.a).toFixed(2)+' 떨어져 있습니다. ①보다 <b>2 이상 더</b> 멀리 옮기세요.'};
     if(![0,1].every(j=>isFinite(got[j]))) return {ok:false, msg:'두 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-x2)>0.05) return {ok:false, msg:'지금 검사점은 '+x2+' 입니다.'};
     if(!isFinite(e3)){
       if(pick!==0) return {ok:false, msg:'지금은 아예 발산합니다. 이 사실을 보고 다시 고르세요.'};
     } else {
       if(!(got[1]>0) || Math.abs(Math.log10(got[1])-Math.log10(e3))>0.25)
         return {ok:false, msg:'지금 오차는 '+r[4]+' 입니다.'};
       if(pick!==0)
         return {ok:false, msg:'①에서 '+mem.e.toExponential(2)+' 이던 오차가 지금 '+e3.toExponential(2)+' 입니다. 이 사실을 보고 다시 고르세요.'};
     }
     return {ok:true, msg:'판단했습니다 — <b>테일러 다항식은 중심 근처를 먼저 삽니다.</b> 항을 늘리면 중심 가까이는 빠르게 정확해지지만, 멀리서는 더디고 수렴반경 밖에서는 아예 벌어집니다. 계산기는 그래서 <b>x 를 중심 가까이로 먼저 옮겨</b> 계산합니다.'};
   }}
 ]},
"""

NOTE24 = """
 /* LAB 24 회전체의 부피 — 원판을 두 배로 늘리면 오차는 몇 배가 되는가 */
 24:{ h:'내가 쌓고 · 내가 재고 · 내가 판단한다',
  c:[
  {t:'기록 — 원판을 <b>8장</b>으로 맞춘 뒤 화면의 값을 그대로 옮겨 적으세요',
   f:'원판 수 n = {0} · 근사 부피 = {1} · 정확한 부피 = {2} · 오차 = {3} %',
   chk(got, r, mem){
     if(!r) return {ok:false, msg:'아직 화면 값이 없습니다.'};
     const n=noteNum(r[0]), v=noteNum(r[2]), e=noteNum(r[3]), er=noteNum(r[4]);
     if(n!==8) return {ok:false, msg:'지금 원판이 '+n+'장입니다. 8장으로 맞추세요.'};
     if(![0,1,2,3].every(j=>isFinite(got[j]))) return {ok:false, msg:'네 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-8)>0.5) return {ok:false, msg:'원판 수는 8 입니다.'};
     if(Math.abs(got[1]-v)>0.01) return {ok:false, msg:'근사 부피가 다릅니다 — 화면은 '+v+' 입니다.'};
     if(Math.abs(got[2]-e)>0.01) return {ok:false, msg:'정확한 부피가 다릅니다 — 화면은 '+e+' 입니다.'};
     if(Math.abs(got[3]-er)>0.06) return {ok:false, msg:'오차가 다릅니다 — 화면은 '+er+' % 입니다.'};
     mem.v=v; mem.e=e; mem.er=er; mem.n=8;
     return {ok:true, msg:'기록했습니다 — 원판 8장으로 어림한 값과 참값의 차이입니다.'};
   }},
  {t:'생각 — 원판을 <b>16장</b>으로 늘린 뒤 새 오차를 적고, 몇 배로 줄었는지 구하세요',
   f:'16장일 때 오차 = {0} % · 줄어든 배수 (8장 오차 ÷ 16장 오차) = {1}',
   chk(got, r, mem){
     if(mem.er===undefined) return {ok:false, msg:'① 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const n=noteNum(r[0]), er2=noteNum(r[4]);
     if(n!==16) return {ok:false, msg:'지금 원판이 '+n+'장입니다. ＋2배 를 눌러 16장으로 맞추세요.'};
     if(Math.abs(noteNum(r[3])-mem.e)>0.02) return {ok:false, msg:'그릇 모양이 바뀌었습니다. ②에서는 그릇을 그대로 두세요.'};
     if(![0,1].every(j=>isFinite(got[j]))) return {ok:false, msg:'두 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-er2)>0.06) return {ok:false, msg:'새 오차가 다릅니다 — 화면은 '+er2+' % 입니다.'};
     const k = er2>0 ? mem.er/er2 : 0;
     if(!(got[1]>0) || Math.abs(got[1]-k)>Math.max(0.35, k*0.25))
       return {ok:false, msg:'①의 오차 '+mem.er+' 를 새 오차 '+er2+' 로 나누세요.'};
     mem.k=k; mem.er2=er2;
     return {ok:true, msg:'계산했습니다 — 원판을 두 배로 하니 오차가 약 '+k.toFixed(1)+'배 줄었습니다.'};
   }},
  {t:'판단 — 한 번 더 <b>두 배(32장)</b>로 늘려 확인한 뒤 고르세요',
   f:'32장일 때 오차 = {0} %',
   opts:['원판 수를 두 배로 할 때마다 오차는 대략 <b>절반</b>이 된다',
         '원판 수를 두 배로 하면 오차도 두 배가 된다',
         '원판 수를 아무리 늘려도 오차는 그대로다'],
   chk(got, r, mem, pick){
     if(mem.k===undefined) return {ok:false, msg:'② 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const n=noteNum(r[0]), er3=noteNum(r[4]);
     if(n!==32) return {ok:false, msg:'지금 원판이 '+n+'장입니다. 32장으로 맞추세요.'};
     if(!isFinite(got[0])) return {ok:false, msg:'칸을 채우세요.'};
     if(Math.abs(got[0]-er3)>0.06) return {ok:false, msg:'지금 오차는 '+er3+' % 입니다.'};
     if(pick!==0)
       return {ok:false, msg:'오차가 '+mem.er+' → '+mem.er2+' → '+er3+' % 로 줄었습니다. 이 수치를 보고 다시 고르세요.'};
     return {ok:true, msg:'판단했습니다 — <b>원판을 두 배로 얇게 할 때마다 오차는 대략 절반</b>이 됩니다. 이 «무한히 얇게»의 끝이 바로 적분 ∫πr²dy 입니다. 구분구적법은 이 과정을 식으로 적은 것입니다.'};
   }}
 ]},
"""


def main(path):
    h = open(path, encoding='utf-8').read()
    if 'LESSON[23]=' in h:
        print('이미 반영됨')
        return

    l23 = (LESSON23.replace('__SIN__', T_SIN).replace('__P3__', T_P3).replace('__P5__', T_P5))
    l24 = (LESSON24.replace('__DISKS__', R_DISKS).replace('__SIDE__', R_SIDE)
           .replace('__SIDEM__', R_SIDE.replace('M%.1f' % (RX0 + RSC * rad(0)), 'M%.1f' % (RX0 - RSC * rad(0))))
           .replace('__AX__', '%.1f' % RX0).replace('__AXT__', '%.1f' % RX0)
           .replace('__TOP__', '%.1f' % (RY0 - 4)).replace('__BOT__', '%.1f' % (RY1 + 4)))
    # 왼쪽 옆면(거울상)을 따로 만든다
    mirror = ' '.join('%s%.1f %.1f' % ('M' if k == 0 else 'L',
                                       RX0 - RSC * rad(k / 40), RY1 - (RY1 - RY0) * k / 40)
                      for k in range(41))
    l24 = l24.replace(R_SIDE.replace('M%.1f' % (RX0 + RSC * rad(0)), 'M%.1f' % (RX0 - RSC * rad(0))), mirror)

    for old, new, what in ((TY_OLD, TY_NEW, 'taylor 값 보관'), (TY_END_OLD, TY_END_NEW, 'taylor read()'),
                           (RV_OLD, RV_NEW, 'revolve 값 보관'), (RV_END_OLD, RV_END_NEW, 'revolve read()')):
        assert h.count(old) == 1, '%s — 자리를 못 찾음 (%d곳)' % (what, h.count(old))
        h = h.replace(old, new, 1)

    a = 'LESSON[356]={'
    assert h.count(a) == 1
    h = h.replace(a, l23 + l24 + a, 1)

    b = '\n};\n\nfunction labNo(spec)'
    assert h.count(b) == 1
    h = h.replace(b, NOTE23 + NOTE24 + b, 1)

    open(path, 'w', encoding='utf-8').write(h)
    print('LAB 23 · 24 수업 모형 + 탐구 노트 삽입 — 파일 %.2f MB' % (len(h.encode('utf-8')) / 1048576))


if __name__ == '__main__':
    main(sys.argv[1])
