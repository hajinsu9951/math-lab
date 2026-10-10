# -*- coding: utf-8 -*-
"""LAB 211~220 탐구 노트 — 기록 → 생각 → 판단. 판정은 화면의 read() 값으로만 한다.

세 칸은 차례대로 열리고, 조건이 맞지 않으면 무엇을 어떻게 바꿔야 하는지
화면 값으로 일러 준다. 보기의 첫째 줄이 정답이며 화면에서는 섞여 나온다.
"""


def note(no, head, c1, c2, c3):
    return "\n %d:{ h:'%s',\n  c:[\n%s,\n%s,\n%s\n ]},\n" % (no, head, c1, c2, c3)


NOTES = (
 note(211, '내가 세고 · 내가 올리고 · 내가 판단한다',
 """  {t:'기록 — <b>고정비를 60만원 이하</b> 로 두고, 지금 값을 적으세요',
   f:'고정비 = {0} 만원 · 공헌이익 = {1} 천원 · 손익분기 = {2} 개',
   chk(got, r, mem){
     if(!r) return {ok:false, msg:'아직 화면 값이 없습니다.'};
     const F=noteNum(r[0]), cm=noteNum(r[3]), be=noteNum(r[4]);
     if(!(cm>0)) return {ok:false, msg:'공헌이익이 '+r[3]+' 입니다 — 가격을 변동비보다 높이세요.'};
     if(!(F<=60)) return {ok:false, msg:'고정비가 '+r[0]+' 만원입니다 — ②에서 두 배로 올려야 하니 60 이하로 두세요.'};
     if(![0,1,2].every(k=>isFinite(got[k]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-F)>1) return {ok:false, msg:'고정비는 '+r[0]+' 만원입니다.'};
     if(Math.abs(got[1]-cm)>0.06) return {ok:false, msg:'공헌이익은 '+r[3]+' 입니다.'};
     if(Math.abs(got[2]-be)>1) return {ok:false, msg:'손익분기는 '+r[4]+' 개입니다.'};
     mem.F1=F; mem.cm1=cm; mem.be1=be;
     return {ok:true, msg:'기록했습니다 — 한 개 팔 때마다 '+r[3]+' 천원이 남아 고정비를 메웁니다. 고정비를 두 배로 해 봅시다.'};
   }}""",
 """  {t:'생각 — <b>고정비만 두 배</b> 로 올리고 (가격·변동비는 그대로) 다시 적으세요',
   f:'새 고정비 = {0} 만원 · 손익분기 = {1} 개 · ①의 몇 배인지 = {2}',
   chk(got, r, mem){
     if(mem.F1===undefined) return {ok:false, msg:'① 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const F=noteNum(r[0]), cm=noteNum(r[3]), be=noteNum(r[4]);
     if(Math.abs(cm-mem.cm1)>0.06) return {ok:false, msg:'공헌이익이 '+r[3]+' 로 바뀌었습니다 — 가격과 변동비는 ①과 같게 두세요 (원래 '+mem.cm1+').'};
     if(Math.abs(F-2*mem.F1)>1) return {ok:false, msg:'고정비를 '+(2*mem.F1)+' 만원으로 맞추세요 (지금 '+r[0]+').'};
     if(![0,1,2].every(k=>isFinite(got[k]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-F)>1) return {ok:false, msg:'고정비는 '+r[0]+' 만원입니다.'};
     if(Math.abs(got[1]-be)>1) return {ok:false, msg:'손익분기는 '+r[4]+' 개입니다.'};
     if(Math.abs(got[2]-be/mem.be1)>0.06) return {ok:false, msg:'지금 '+r[4]+' 를 ①의 '+mem.be1+' 로 나누어 보세요.'};
     mem.be2=be; mem.ok2=true;
     return {ok:true, msg:'계산했습니다 — 고정비가 두 배가 되니 본전 수량도 두 배입니다. 비례합니다.'};
   }}""",
 """  {t:'판단 — <b>가격을 변동비보다 낮게</b> 내려 공헌이익을 0 이하로 만든 뒤 고르세요',
   f:'가격 = {0} 천원 · 변동비 = {1} 천원 · 공헌이익 = {2} 천원',
   opts:['본전 수량 = 고정비 ÷ 공헌이익 인데 <b>공헌이익이 0 이하면 나눌 수가 없다</b> — 한 개 팔 때마다 손해라서 아무리 팔아도 고정비를 메우지 못한다',
         '공헌이익이 0 이하여도 많이 팔면 언젠가 본전이 된다',
         '본전 수량은 고정비와 아무 관계가 없다'],
   chk(got, r, mem, pick){
     if(!mem.ok2) return {ok:false, msg:'② 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const v=noteNum(r[1]), p=noteNum(r[2]), cm=noteNum(r[3]);
     if(!(cm<=0)) return {ok:false, msg:'공헌이익이 아직 '+r[3]+' 입니다 — 가격을 변동비 '+r[1]+' 보다 낮게 내리세요.'};
     if(![0,1,2].every(k=>isFinite(got[k]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-p)>0.06) return {ok:false, msg:'가격은 '+r[2]+' 입니다.'};
     if(Math.abs(got[1]-v)>0.06) return {ok:false, msg:'변동비는 '+r[1]+' 입니다.'};
     if(Math.abs(got[2]-cm)>0.06) return {ok:false, msg:'공헌이익은 '+r[3]+' 입니다.'};
     if(pick!==0)
       return {ok:false, msg:'고정비를 두 배로 하자 본전 수량도 두 배였습니다. 그런데 지금은 「없음」입니다 — 무엇으로 나누고 있었을까요? 다시 고르세요.'};
     return {ok:true, msg:'판단했습니다 — <b>본전은 「한 개에 남는 돈」이 고정비를 다 메우는 순간입니다.</b> 그래서 고정비 ÷ 공헌이익 이고, 공헌이익이 0 이하면 아예 성립하지 않습니다 — 창업 계획에서 가장 먼저 보는 수입니다.'};
   }}""")
 +
 note(212, '내가 몰고 · 내가 나누고 · 내가 판단한다',
 """  {t:'기록 — <b>A 에 100%</b> 담고 적으세요',
   f:'기대수익 = {0} % · 흔들림 = {1} %',
   chk(got, r, mem){
     if(!r) return {ok:false, msg:'아직 화면 값이 없습니다.'};
     const w=noteNum(r[0]), m=noteNum(r[2]), s=noteNum(r[3]);
     if(w!==100) return {ok:false, msg:'A 비율이 '+r[0]+' 입니다 — 100% 로 올리세요.'};
     if(![0,1].every(k=>isFinite(got[k]))) return {ok:false, msg:'두 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-m)>0.02) return {ok:false, msg:'기대수익은 '+r[2]+' 입니다.'};
     if(Math.abs(got[1]-s)>0.02) return {ok:false, msg:'흔들림은 '+r[3]+' 입니다.'};
     mem.m1=m; mem.s1=s;
     return {ok:true, msg:'기록했습니다 — 한쪽에 다 담으니 기대수익도 흔들림도 가장 큽니다. 나눠 담아 봅시다.'};
   }}""",
 """  {t:'생각 — <b>「흔들림이 가장 작은 배분으로」</b> 를 누르고, 줄어든 흔들림을 구하세요',
   f:'A 비율 = {0} % · 기대수익 = {1} % · 흔들림 = {2} % · ①에서 줄어든 양 = {3}',
   chk(got, r, mem){
     if(mem.s1===undefined) return {ok:false, msg:'① 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const w=noteNum(r[0]), bw=noteNum(r[4]), m=noteNum(r[2]), s=noteNum(r[3]);
     if(Math.abs(w-bw)>3) return {ok:false, msg:'가장 안정된 배분은 A '+r[4]+' 입니다 — 단추를 누르세요 (지금 '+r[0]+').'};
     if(![0,1,2,3].every(k=>isFinite(got[k]))) return {ok:false, msg:'네 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-w)>1) return {ok:false, msg:'A 비율은 '+r[0]+' 입니다.'};
     if(Math.abs(got[1]-m)>0.02) return {ok:false, msg:'기대수익은 '+r[2]+' 입니다.'};
     if(Math.abs(got[2]-s)>0.02) return {ok:false, msg:'흔들림은 '+r[3]+' 입니다.'};
     if(Math.abs(got[3]-(mem.s1-s))>0.05) return {ok:false, msg:'①의 '+mem.s1+' 에서 지금 '+r[3]+' 를 빼 보세요.'};
     if(!(s<mem.s1)) return {ok:false, msg:'흔들림이 ①보다 줄지 않았습니다 — 단추를 다시 눌러 보세요.'};
     mem.s2=s; mem.ok2=true;
     return {ok:true, msg:'계산했습니다 — 기대수익은 조금 내려갔는데 흔들림은 '+(mem.s1-s).toFixed(2)+' %p 나 줄었습니다.'};
   }}""",
 """  {t:'판단 — <b>함께 움직이는 정도를 −100%</b> 로 두고 다시 단추를 누른 뒤 고르세요',
   f:'상관 = {0} % · A 비율 = {1} % · 흔들림 = {2} %',
   opts:['흔들림 식에는 <b>w² 이 들어 있어 아래로 볼록한 이차식</b> 이 된다 — 그래서 양 끝보다 작은 최소가 가운데 어딘가에 생기고, 반대로 움직이는 둘이면 거의 0 까지 내려간다',
         '흔들림도 기대수익처럼 비율의 일차식이라 직선이다',
         '나눠 담으면 기대수익과 흔들림이 모두 커진다'],
   chk(got, r, mem, pick){
     if(!mem.ok2) return {ok:false, msg:'② 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const rho=noteNum(r[1]), w=noteNum(r[0]), bw=noteNum(r[4]), s=noteNum(r[3]);
     if(rho!==-100) return {ok:false, msg:'상관이 '+r[1]+' 입니다 — −100% 로 내리세요.'};
     if(Math.abs(w-bw)>3) return {ok:false, msg:'「흔들림이 가장 작은 배분으로」 를 다시 누르세요 (지금 A '+r[0]+').'};
     if(![0,1,2].every(k=>isFinite(got[k]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-rho)>1) return {ok:false, msg:'상관은 '+r[1]+' 입니다.'};
     if(Math.abs(got[1]-w)>1) return {ok:false, msg:'A 비율은 '+r[0]+' 입니다.'};
     if(Math.abs(got[2]-s)>0.02) return {ok:false, msg:'흔들림은 '+r[3]+' 입니다.'};
     if(!(s<1)) return {ok:false, msg:'흔들림이 아직 '+r[3]+' 입니다 — 단추를 눌러 가장 안정된 배분으로 가세요.'};
     if(pick!==0)
       return {ok:false, msg:'한쪽에 몰 때 '+mem.s1+' 였던 흔들림이 섞으니 '+r[3]+' 가 되었습니다. 직선이라면 이런 최소가 생길까요? 다시 고르세요.'};
     return {ok:true, msg:'판단했습니다 — <b>나눠 담기의 이득은 이차식에서 나옵니다.</b> 흔들림은 w 의 이차식이라 아래로 볼록하고, 함께 움직이지 않는 둘을 섞을수록 그 바닥이 깊어집니다 — 「한 바구니에 담지 말라」가 수학으로 설명되는 자리입니다.'};
   }}""")
 +
 note(213, '내가 없애고 · 내가 키우고 · 내가 판단한다',
 """  {t:'기록 — <b>도박의 폭을 0</b> 으로 내리고 적으세요',
   f:'확실 만족도 = {0} · 도박 만족도 = {1} · 확실성등가 = {2} 만원',
   chk(got, r, mem){
     if(!r) return {ok:false, msg:'아직 화면 값이 없습니다.'};
     const sp=noteNum(r[0]), us=noteNum(r[2]), ug=noteNum(r[3]), ce=noteNum(r[4]);
     if(sp!==0) return {ok:false, msg:'폭이 '+r[0]+' 입니다 — 0 으로 내리세요.'};
     if(![0,1,2].every(k=>isFinite(got[k]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-us)>0.01||Math.abs(got[1]-ug)>0.01)
       return {ok:false, msg:'화면은 '+r[2]+' 와 '+r[3]+' 입니다.'};
     if(Math.abs(got[2]-ce)>0.2) return {ok:false, msg:'확실성등가는 '+r[4]+' 만원입니다.'};
     mem.ok1=true;
     return {ok:true, msg:'기록했습니다 — 폭이 0 이면 도박이 아니라서 두 쪽이 똑같습니다. 폭을 키워 봅시다.'};
   }}""",
 """  {t:'생각 — <b>폭을 60만원 이상</b> 으로 키우고, 두 만족도의 차를 구하세요',
   f:'폭 = {0} 만원 · 확실 만족도 = {1} · 도박 만족도 = {2} · 두 만족도의 차 = {3}',
   chk(got, r, mem){
     if(!mem.ok1) return {ok:false, msg:'① 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const sp=noteNum(r[0]), us=noteNum(r[2]), ug=noteNum(r[3]);
     if(!(sp>=60)) return {ok:false, msg:'폭이 '+r[0]+' 입니다 — 60 이상으로 키우세요.'};
     if(![0,1,2,3].every(k=>isFinite(got[k]))) return {ok:false, msg:'네 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-sp)>1) return {ok:false, msg:'폭은 '+r[0]+' 입니다.'};
     if(Math.abs(got[1]-us)>0.01||Math.abs(got[2]-ug)>0.01)
       return {ok:false, msg:'지금은 '+r[2]+' 와 '+r[3]+' 입니다.'};
     if(Math.abs(got[3]-(us-ug))>0.01) return {ok:false, msg:'확실 '+r[2]+' 에서 도박 '+r[3]+' 를 빼 보세요.'};
     if(!(us-ug>0.01)) return {ok:false, msg:'차가 아직 거의 0 입니다 — 만족도 곡선의 휨을 1 보다 작게 두세요.'};
     mem.ce2=noteNum(r[4]); mem.gap=us-ug; mem.ok2=true;
     return {ok:true, msg:'계산했습니다 — 기댓값은 그대로 100만원인데 도박의 만족도만 내려갔습니다.'};
   }}""",
 """  {t:'판단 — 확실성등가가 100 에서 얼마나 내려갔는지 구하고 고르세요',
   f:'확실성등가 = {0} 만원 · 100 에서 내려간 양 = {1} 만원 · 도박 만족도가 더 작으면 1, 아니면 0 → {2}',
   opts:['만족도 곡선이 <b>위로 볼록</b> 하면 두 점을 이은 선분이 곡선 아래에 놓인다 — 그래서 기댓값이 같아도 도박의 평균 만족도가 낮고, 확실성등가가 기댓값보다 작아진다',
         '기댓값이 같으면 만족도도 반드시 같다',
         '곡선이 위로 볼록하면 도박 쪽 만족도가 더 커진다'],
   chk(got, r, mem, pick){
     if(!mem.ok2) return {ok:false, msg:'② 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const sp=noteNum(r[0]), us=noteNum(r[2]), ug=noteNum(r[3]), ce=noteNum(r[4]);
     if(!(sp>=60)) return {ok:false, msg:'②와 같은 자리에서 판단하세요 — 폭을 60 이상으로 두세요.'};
     if(![0,1,2].every(k=>isFinite(got[k]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-ce)>0.2) return {ok:false, msg:'확실성등가는 '+r[4]+' 만원입니다.'};
     if(Math.abs(got[1]-(100-ce))>0.2) return {ok:false, msg:'100 에서 '+r[4]+' 를 빼 보세요.'};
     if(Math.abs(got[2]-(ug<us?1:0))>0.01) return {ok:false, msg:'두 만족도 '+r[2]+' 와 '+r[3]+' 를 견주세요.'};
     if(pick!==0)
       return {ok:false, msg:'폭이 0 일 때는 둘이 같았는데 폭을 키우자 도박만 '+mem.gap.toFixed(3)+' 내려갔습니다. 곡선이 어느 쪽으로 휘어 있을까요? 다시 고르세요.'};
     return {ok:true, msg:'판단했습니다 — <b>기댓값은 선택의 전부가 아닙니다.</b> 확실성등가와 기댓값의 차가 곧 「위험을 피하려고 기꺼이 내놓는 돈」이고, 그것이 보험료의 정체입니다.'};
   }}""")
 +
 note(214, '내가 고르고 · 내가 재고 · 내가 판단한다',
 """  {t:'기록 — <b>「완전 평등으로」</b> 를 누르고 적으세요',
   f:'곡선 아래 넓이 = {0} · 지니계수 = {1}',
   chk(got, r, mem){
     if(!r) return {ok:false, msg:'아직 화면 값이 없습니다.'};
     const a=noteNum(r[1]), g=noteNum(r[2]);
     if(!(g<0.02)) return {ok:false, msg:'지니계수가 '+r[2]+' 입니다 — 「완전 평등으로」 를 누르세요.'};
     if(![0,1].every(k=>isFinite(got[k]))) return {ok:false, msg:'두 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-a)>0.01) return {ok:false, msg:'곡선 아래 넓이는 '+r[1]+' 입니다.'};
     if(Math.abs(got[1]-g)>0.01) return {ok:false, msg:'지니계수는 '+r[2]+' 입니다.'};
     mem.a1=a; mem.ok1=true;
     return {ok:true, msg:'기록했습니다 — 곡선이 대각선과 겹치면 넓이가 삼각형 넓이 0.5 와 같아집니다. 이제 반대쪽을 봅시다.'};
   }}""",
 """  {t:'생각 — <b>「매우 불평등하게」</b> 를 누르고, 지니계수를 손으로 구하세요',
   f:'곡선 아래 넓이 = {0} · (0.5 − 넓이) ÷ 0.5 = {1} · 화면의 지니계수 = {2}',
   chk(got, r, mem){
     if(!mem.ok1) return {ok:false, msg:'① 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const a=noteNum(r[1]), g=noteNum(r[2]);
     if(!(g>=0.45)) return {ok:false, msg:'지니계수가 '+r[2]+' 입니다 — 「매우 불평등하게」 를 누르세요.'};
     if(![0,1,2].every(k=>isFinite(got[k]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-a)>0.01) return {ok:false, msg:'곡선 아래 넓이는 '+r[1]+' 입니다.'};
     if(Math.abs(got[1]-(0.5-a)/0.5)>0.02) return {ok:false, msg:'0.5 에서 '+r[1]+' 를 빼고 0.5 로 나누어 보세요.'};
     if(Math.abs(got[2]-g)>0.01) return {ok:false, msg:'화면의 지니계수는 '+r[2]+' 입니다.'};
     mem.a2=a; mem.g2=g; mem.ok2=true;
     return {ok:true, msg:'계산했습니다 — 손으로 구한 값이 화면과 같습니다. 넓이 하나로 불평등을 잰 셈입니다.'};
   }}""",
 """  {t:'판단 — 두 넓이를 나란히 두고 고르세요',
   f:'①의 넓이 = {0} · ②의 넓이 = {1} · 둘 다 0.5 이하이면 1, 아니면 0 → {2}',
   opts:['지니계수는 <b>두 넓이의 비</b> 다 — 곡선이 늘 대각선 아래에 있어 넓이가 0 과 0.5 사이이므로, 지니계수는 반드시 0 과 1 사이가 된다',
         '지니계수는 상위 20%의 몫을 그대로 쓴 값이다',
         '곡선 아래 넓이가 0.5 보다 커지는 분배도 있다'],
   chk(got, r, mem, pick){
     if(!mem.ok2) return {ok:false, msg:'② 칸을 먼저 통과하세요.'};
     if(![0,1,2].every(k=>isFinite(got[k]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-mem.a1)>0.01) return {ok:false, msg:'①에 적은 '+mem.a1+' 입니다.'};
     if(Math.abs(got[1]-mem.a2)>0.01) return {ok:false, msg:'②에 적은 '+mem.a2+' 입니다.'};
     if(Math.abs(got[2]-1)>0.01) return {ok:false, msg:'두 넓이를 0.5 와 견주세요.'};
     if(pick!==0)
       return {ok:false, msg:'완전 평등에서 넓이가 '+mem.a1+' 로 가장 컸고, 불평등해지자 '+mem.a2+' 로 줄었습니다. 지니계수는 무엇을 무엇으로 나눈 값일까요? 다시 고르세요.'};
     return {ok:true, msg:'판단했습니다 — <b>넓이 하나로 분배를 잽니다.</b> 대각선과 곡선 사이가 벌어질수록 지니계수가 1 에 가까워지고, 겹치면 0 이 됩니다 — 정적분이 사회 지표가 되는 자리입니다.'};
   }}""")
 +
 note(215, '내가 올리고 · 내가 나누고 · 내가 판단한다',
 """  {t:'기록 — <b>명목 성장률을 물가보다 높게</b> 두고 적으세요',
   f:'명목 배율 = {0} · 실질 배율 = {1}',
   chk(got, r, mem){
     if(!r) return {ok:false, msg:'아직 화면 값이 없습니다.'};
     const g=noteNum(r[0]), i=noteNum(r[1]), n=noteNum(r[2]), nb=noteNum(r[3]), rb=noteNum(r[4]);
     if(!(g>i+0.01)) return {ok:false, msg:'명목 '+r[0]+' · 물가 '+r[1]+' 입니다 — 명목을 더 높이세요.'};
     if(![0,1].every(k=>isFinite(got[k]))) return {ok:false, msg:'두 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-nb)>0.004) return {ok:false, msg:'명목 배율은 '+r[3]+' 입니다.'};
     if(Math.abs(got[1]-rb)>0.004) return {ok:false, msg:'실질 배율은 '+r[4]+' 입니다.'};
     mem.nb=nb; mem.rb=rb; mem.g=g; mem.i=i; mem.n=n;
     return {ok:true, msg:'기록했습니다 — 통장은 '+r[3]+' 배인데 살 수 있는 양은 '+r[4]+' 배입니다. 그 차이가 어디서 오는지 봅시다.'};
   }}""",
 """  {t:'생각 — 두 배율을 나누고, 물가 배율과 견주세요',
   f:'명목 배율 ÷ 실질 배율 = {0} · 1 더하기 물가 상승률을 기간만큼 거듭제곱한 값 = {1}',
   chk(got, r, mem){
     if(mem.nb===undefined) return {ok:false, msg:'① 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const nb=noteNum(r[3]), rb=noteNum(r[4]), i=noteNum(r[1]), n=noteNum(r[2]);
     if(Math.abs(nb-mem.nb)>0.004||Math.abs(rb-mem.rb)>0.004)
       return {ok:false, msg:'①과 같은 자리에서 계산하세요 — 지금 배율은 '+r[3]+' 와 '+r[4]+' 입니다.'};
     if(![0,1].every(k=>isFinite(got[k]))) return {ok:false, msg:'두 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-nb/rb)>0.02) return {ok:false, msg:r[3]+' 를 '+r[4]+' 로 나누어 보세요.'};
     if(Math.abs(got[1]-Math.pow(1+i/100,n))>0.02)
       return {ok:false, msg:'물가 '+r[1]+' 를 소수로 바꿔 1 을 더하고 '+r[2]+' 번 거듭제곱해 보세요.'};
     if(Math.abs(nb/rb-Math.pow(1+i/100,n))>0.02)
       return {ok:false, msg:'두 값이 같아져야 합니다 — 화면 값을 다시 확인하세요.'};
     mem.ok2=true;
     return {ok:true, msg:'계산했습니다 — 명목을 실질로 나눈 것이 곧 물가 배율입니다. 실질은 명목을 물가로 «나눈» 것이었습니다.'};
   }}""",
 """  {t:'판단 — <b>명목 성장률과 물가 상승률을 같게</b> 맞춘 뒤 고르세요',
   f:'명목 = {0} % · 물가 = {1} % · 실질 배율 = {2}',
   opts:['실질은 명목에서 물가를 <b>빼는 것이 아니라 나누는 것</b> — 그래서 명목과 물가가 같으면 실질 배율이 정확히 1 이 되고, 실질 성장률은 0 이 된다',
         '명목에서 물가를 빼면 실질 성장률이 정확히 나온다',
         '물가가 올라도 실질 배율은 명목 배율과 같다'],
   chk(got, r, mem, pick){
     if(!mem.ok2) return {ok:false, msg:'② 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const g=noteNum(r[0]), i=noteNum(r[1]), rb=noteNum(r[4]);
     if(Math.abs(g-i)>0.01) return {ok:false, msg:'명목 '+r[0]+' · 물가 '+r[1]+' 입니다 — 두 값을 같게 맞추세요.'};
     if(![0,1,2].every(k=>isFinite(got[k]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-g)>0.06||Math.abs(got[1]-i)>0.06)
       return {ok:false, msg:'화면은 '+r[0]+' 와 '+r[1]+' 입니다.'};
     if(Math.abs(got[2]-rb)>0.004) return {ok:false, msg:'실질 배율은 '+r[4]+' 입니다.'};
     if(Math.abs(rb-1)>0.004) return {ok:false, msg:'실질 배율이 1 이 되어야 합니다 (지금 '+r[4]+').'};
     if(pick!==0)
       return {ok:false, msg:'②에서 명목 ÷ 실질 이 물가 배율과 같았습니다. 그러면 실질은 명목을 무엇으로 한 값일까요? 다시 고르세요.'};
     return {ok:true, msg:'판단했습니다 — <b>실질 = 명목 ÷ 물가</b> 입니다. 「명목 − 물가」 는 둘 다 작을 때만 쓸 수 있는 근사값이고, 로그 눈금에서 직선이 되는 것도 해마다 같은 «비율» 로 곱해지기 때문입니다.'};
   }}""")
 +
 note(216, '내가 재고 · 내가 올리고 · 내가 판단한다',
 """  {t:'기록 — 지금의 1년 뒤 두 값을 적으세요',
   f:'1년 뒤 정액 = {0} 만원 · 1년 뒤 정률 = {1} 만원 · 두 값의 차 = {2} 만원',
   chk(got, r, mem){
     if(!r) return {ok:false, msg:'아직 화면 값이 없습니다.'};
     const rr=noteNum(r[1]), lin=noteNum(r[3]), geo=noteNum(r[4]);
     if(![0,1,2].every(k=>isFinite(got[k]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-lin)>1) return {ok:false, msg:'1년 뒤 정액은 '+r[3]+' 만원입니다.'};
     if(Math.abs(got[1]-geo)>1) return {ok:false, msg:'1년 뒤 정률은 '+r[4]+' 만원입니다.'};
     if(Math.abs(got[2]-(lin-geo))>1) return {ok:false, msg:'정액 '+r[3]+' 에서 정률 '+r[4]+' 를 빼 보세요.'};
     mem.r1=rr; mem.geo1=geo;
     return {ok:true, msg:'기록했습니다 — 첫해부터 정률법이 '+(lin-geo).toFixed(0)+' 만원 더 떨어집니다. 비율을 올려 봅시다.'};
   }}""",
 """  {t:'생각 — <b>정률법의 비율을 35% 이상</b> 으로 올리고, 더 떨어진 양을 구하세요',
   f:'비율 = {0} % · 1년 뒤 정률 = {1} 만원 · ①보다 더 떨어진 양 = {2} 만원',
   chk(got, r, mem){
     if(mem.geo1===undefined) return {ok:false, msg:'① 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const rr=noteNum(r[1]), geo=noteNum(r[4]);
     if(!(rr>=35)) return {ok:false, msg:'비율이 '+r[1]+' 입니다 — 35% 이상으로 올리세요.'};
     if(!(rr>mem.r1)) return {ok:false, msg:'①의 '+mem.r1+' % 보다 높여야 합니다.'};
     if(![0,1,2].every(k=>isFinite(got[k]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-rr)>1) return {ok:false, msg:'비율은 '+r[1]+' 입니다.'};
     if(Math.abs(got[1]-geo)>1) return {ok:false, msg:'1년 뒤 정률은 '+r[4]+' 만원입니다.'};
     if(Math.abs(got[2]-(mem.geo1-geo))>1) return {ok:false, msg:'①의 '+mem.geo1+' 에서 지금 '+r[4]+' 를 빼 보세요.'};
     mem.ok2=true;
     return {ok:true, msg:'계산했습니다 — 비율을 올리자 첫해에만 '+(mem.geo1-geo).toFixed(0)+' 만원이 더 날아갔습니다.'};
   }}""",
 """  {t:'판단 — <b>「절반이 되는 해 찾기」</b> 를 누른 뒤 고르세요',
   f:'비율 = {0} % · 1년 뒤 정액 = {1} 만원 · 1년 뒤 정률 = {2} 만원',
   opts:['정액법은 <b>같은 금액씩 빼는 등차수열</b>, 정률법은 <b>같은 비율씩 곱하는 등비수열</b> 이다 — 그래서 정률법은 처음에 많이 떨어지고, 아무리 지나도 정확히 0 이 되지 않는다',
         '두 방법 모두 쓰는 기간이 끝나면 값이 0 이 된다',
         '정률법이 정액법보다 늘 천천히 떨어진다'],
   chk(got, r, mem, pick){
     if(!mem.ok2) return {ok:false, msg:'② 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const rr=noteNum(r[1]), lin=noteNum(r[3]), geo=noteNum(r[4]);
     if(rr!==30) return {ok:false, msg:'비율이 '+r[1]+' 입니다 — 「절반이 되는 해 찾기」 를 누르세요.'};
     if(![0,1,2].every(k=>isFinite(got[k]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-rr)>1) return {ok:false, msg:'비율은 '+r[1]+' 입니다.'};
     if(Math.abs(got[1]-lin)>1) return {ok:false, msg:'1년 뒤 정액은 '+r[3]+' 만원입니다.'};
     if(Math.abs(got[2]-geo)>1) return {ok:false, msg:'1년 뒤 정률은 '+r[4]+' 만원입니다.'};
     if(pick!==0)
       return {ok:false, msg:'정액은 해마다 같은 금액이 빠지고, 정률은 해마다 같은 비율이 곱해졌습니다. 어느 쪽이 등차이고 어느 쪽이 등비일까요? 다시 고르세요.'};
     return {ok:true, msg:'판단했습니다 — <b>같은 「깎인다」도 빼기와 곱하기는 전혀 다릅니다.</b> 등비수열은 0 에 가까워질 뿐 닿지 않으므로, 중고차는 처음 몇 해에 가장 크게 값이 빠집니다 — 몇 년 된 차를 살지가 수열 문제인 셈입니다.'};
   }}""")
 +
 note(217, '내가 약분하고 · 내가 뒤집고 · 내가 판단한다',
 """  {t:'기록 — <b>「한 단계 진행」</b> 을 끝까지 눌러 최종 값을 적으세요',
   f:'최종 값 = {0} · 정답 = {1} · 두 값의 차 = {2}',
   chk(got, r, mem){
     if(!r) return {ok:false, msg:'아직 화면 값이 없습니다.'};
     const v=noteNum(r[2]), ans=noteNum(r[4]);
     if(String(r[3])==='진행 중') return {ok:false, msg:'아직 '+r[1]+' 단계입니다 — 「한 단계 진행」 을 끝까지 누르세요.'};
     if(Math.abs(v-ans)>Math.max(0.01,Math.abs(ans)*0.01))
       return {ok:false, msg:'지금 값은 '+r[2]+' 로 정답 '+r[4]+' 와 다릅니다 — 「처음으로」 를 누르고 바르게 진행하세요.'};
     if(![0,1,2].every(k=>isFinite(got[k]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-v)>Math.max(0.01,Math.abs(v)*0.01)) return {ok:false, msg:'최종 값은 '+r[2]+' 입니다.'};
     if(Math.abs(got[1]-ans)>Math.max(0.01,Math.abs(ans)*0.01)) return {ok:false, msg:'정답은 '+r[4]+' 입니다.'};
     if(Math.abs(got[2])>Math.max(0.02,Math.abs(ans)*0.02)) return {ok:false, msg:'두 값을 빼 보세요 — 바르게 진행했다면 0 입니다.'};
     mem.v1=v; mem.ans=ans;
     return {ok:true, msg:'기록했습니다 — 단위가 모두 약분되어 '+r[3]+' 만 남았고 값도 정답과 같습니다. 거꾸로 해 봅시다.'};
   }}""",
 """  {t:'생각 — <b>「거꾸로 곱해 보기」</b> 를 누르고, 몇 배로 어긋나는지 구하세요',
   f:'거꾸로 곱한 값 = {0} · 바른 값 = {1} · 거꾸로 ÷ 바른 = {2}',
   chk(got, r, mem){
     if(mem.v1===undefined) return {ok:false, msg:'① 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const v=noteNum(r[2]), ans=noteNum(r[4]);
     if(Math.abs(v-ans)<=Math.max(0.01,Math.abs(ans)*0.01))
       return {ok:false, msg:'아직 바른 값입니다 — 「거꾸로 곱해 보기」 를 누르세요.'};
     if(Math.abs(ans-mem.ans)>Math.max(0.01,Math.abs(mem.ans)*0.01))
       return {ok:false, msg:'①과 같은 문제에서 보세요 — 바꿀 값을 ①과 같게 두세요.'};
     if(![0,1,2].every(k=>isFinite(got[k]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-v)>Math.max(0.01,Math.abs(v)*0.02)) return {ok:false, msg:'거꾸로 곱한 값은 '+r[2]+' 입니다.'};
     if(Math.abs(got[1]-mem.v1)>Math.max(0.01,Math.abs(mem.v1)*0.02)) return {ok:false, msg:'①에 적은 '+mem.v1+' 입니다.'};
     if(Math.abs(got[2]-v/mem.v1)>Math.max(0.02,Math.abs(v/mem.v1)*0.03))
       return {ok:false, msg:r[2]+' 를 '+mem.v1+' 로 나누어 보세요.'};
     mem.v2=v; mem.ok2=true;
     return {ok:true, msg:'계산했습니다 — 환산인자를 뒤집었더니 답이 엉뚱한 자리로 갔습니다. 왜 그럴까요?'};
   }}""",
 """  {t:'판단 — <b>「처음으로」</b> 를 누르고 다시 바르게 끝낸 뒤 고르세요',
   f:'환산인자 1000 m ÷ 1 km 의 값 = {0} · 바른 최종 값 = {1} · 정답과 같으면 1, 다르면 0 → {2}',
   opts:['환산인자는 <b>값이 1 인 분수</b> 라서 곱해도 값은 그대로이고 <b>단위만</b> 바뀐다 — 없애고 싶은 단위가 분모에 오도록 놓으면 약분되어 답의 단위만 남는다',
         '환산인자를 곱하면 값이 1000배씩 커진다',
         '단위는 보지 말고 큰 수로 나누면 된다'],
   chk(got, r, mem, pick){
     if(!mem.ok2) return {ok:false, msg:'② 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const v=noteNum(r[2]), ans=noteNum(r[4]);
     if(String(r[3])==='진행 중') return {ok:false, msg:'끝까지 진행하세요 (지금 '+r[1]+' 단계).'};
     if(Math.abs(v-ans)>Math.max(0.01,Math.abs(ans)*0.01))
       return {ok:false, msg:'아직 거꾸로 곱한 값입니다 — 「처음으로」 를 누르고 바르게 진행하세요.'};
     if(![0,1,2].every(k=>isFinite(got[k]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-1)>0.01) return {ok:false, msg:'1000 m 와 1 km 는 같은 길이입니다 — 나누면 얼마인가요?'};
     if(Math.abs(got[1]-v)>Math.max(0.01,Math.abs(v)*0.01)) return {ok:false, msg:'최종 값은 '+r[2]+' 입니다.'};
     if(Math.abs(got[2]-1)>0.01) return {ok:false, msg:'최종 값과 정답 '+r[4]+' 를 견주세요.'};
     if(pick!==0)
       return {ok:false, msg:'바르게 하면 '+mem.v1+' , 뒤집으면 '+mem.v2+' 였습니다. 곱한 분수의 «값» 은 얼마였을까요? 다시 고르세요.'};
     return {ok:true, msg:'판단했습니다 — <b>곱할까 나눌까는 외우는 것이 아니라 단위를 보고 정합니다.</b> 환산인자는 값이 1 이라 값을 바꾸지 않고 단위만 바꾸며, 약분되는 쪽이 늘 맞습니다 — 실험 보고서에서 가장 자주 틀리는 자리입니다.'};
   }}""")
 +
 note(218, '내가 맞추고 · 내가 키우고 · 내가 판단한다',
 """  {t:'기록 — <b>축척을 1 : 50</b> 으로 맞추고 적으세요',
   f:'실제 가로 = {0} m · 도면 넓이 = {1} cm² · 실제 넓이 = {2} m²',
   chk(got, r, mem){
     if(!r) return {ok:false, msg:'아직 화면 값이 없습니다.'};
     const N=noteNum(String(r[0]).split(':')[1]), rl=noteNum(r[2]), da=noteNum(r[3]), ra=noteNum(r[4]);
     if(N!==50) return {ok:false, msg:'축척이 '+r[0]+' 입니다 — 1 : 50 으로 맞추세요.'};
     if(![0,1,2].every(k=>isFinite(got[k]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-rl)>0.02) return {ok:false, msg:'실제 가로는 '+r[2]+' 입니다.'};
     if(Math.abs(got[1]-da)>0.2) return {ok:false, msg:'도면 넓이는 '+r[3]+' 입니다.'};
     if(Math.abs(got[2]-ra)>0.02) return {ok:false, msg:'실제 넓이는 '+r[4]+' 입니다.'};
     mem.N1=N; mem.a1=ra; mem.da=da;
     return {ok:true, msg:'기록했습니다 — 길이는 50배인데 넓이는 2,500배입니다. 축척을 더 키워 봅시다.'};
   }}""",
 """  {t:'생각 — <b>축척을 1 : 150 이상</b> 으로 키우고, 몇 배가 되었는지 구하세요',
   f:'축척의 N = {0} · 실제 넓이 = {1} m² · ①의 몇 배인지 = {2}',
   chk(got, r, mem){
     if(mem.a1===undefined) return {ok:false, msg:'① 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const N=noteNum(String(r[0]).split(':')[1]), da=noteNum(r[3]), ra=noteNum(r[4]);
     if(!(N>=150)) return {ok:false, msg:'축척이 '+r[0]+' 입니다 — N 을 150 이상으로 키우세요.'};
     if(Math.abs(da-mem.da)>0.2) return {ok:false, msg:'도면에서 잰 값은 ①과 같게 두세요 (①은 '+mem.da+' cm²).'};
     if(![0,1,2].every(k=>isFinite(got[k]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-N)>1) return {ok:false, msg:'축척은 '+r[0]+' 입니다.'};
     if(Math.abs(got[1]-ra)>0.05) return {ok:false, msg:'실제 넓이는 '+r[4]+' 입니다.'};
     if(Math.abs(got[2]-ra/mem.a1)>0.2) return {ok:false, msg:'지금 '+r[4]+' 를 ①의 '+mem.a1+' 로 나누어 보세요.'};
     mem.N2=N; mem.ok2=true;
     return {ok:true, msg:'계산했습니다 — 길이 배율은 '+(N/mem.N1).toFixed(1)+' 배인데 넓이는 그 제곱만큼 늘었습니다.'};
   }}""",
 """  {t:'판단 — 두 배율을 직접 구해 보고 고르세요',
   f:'길이 배율 = {0} · 넓이 배율 = {1} · 넓이 배율 ÷ 길이 배율 = {2}',
   opts:['길이가 N 배면 <b>가로도 N 배, 세로도 N 배</b> 가 되어 넓이는 N² 배가 된다 — 그래서 넓이 배율을 길이 배율로 나누면 다시 N 이 나온다',
         '길이가 N 배면 넓이도 N 배가 된다',
         '넓이 배율은 길이 배율의 두 배다'],
   chk(got, r, mem, pick){
     if(!mem.ok2) return {ok:false, msg:'② 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const N=noteNum(String(r[0]).split(':')[1]);
     if(![0,1,2].every(k=>isFinite(got[k]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-N)>1) return {ok:false, msg:'길이 배율은 축척의 N 인 '+N+' 입니다.'};
     if(Math.abs(got[1]-N*N)>Math.max(1,N*N*0.01)) return {ok:false, msg:'넓이 배율은 '+N+' 을 두 번 곱한 값입니다.'};
     if(Math.abs(got[2]-N)>1) return {ok:false, msg:'넓이 배율을 길이 배율로 나누어 보세요.'};
     if(pick!==0)
       return {ok:false, msg:'1:50 에서 '+mem.a1+' m² 였던 것이 1:'+mem.N2+' 에서는 몇 배가 되었나요? 길이 배율의 제곱과 견주어 다시 고르세요.'};
     return {ok:true, msg:'판단했습니다 — <b>길이는 N 배, 넓이는 N² 배, 부피는 N³ 배입니다.</b> 도면에서 1 mm 를 잘못 읽으면 길이는 조금 틀리지만 넓이는 그 제곱만큼 틀립니다 — 자재 발주에서 바로 돈이 되는 셈입니다.'};
   }}""")
 +
 note(219, '내가 깎고 · 내가 곱하고 · 내가 판단한다',
 """  {t:'기록 — <b>두 번째 할인을 0 보다 크게</b> 올리고 적으세요',
   f:'최종 가격 = {0} 원 · 실제 할인율 = {1} % · 단순 합 = {2} %',
   chk(got, r, mem){
     if(!r) return {ok:false, msg:'아직 화면 값이 없습니다.'};
     const a=noteNum(r[0]), b=noteNum(r[1]), pr=noteNum(r[2]), eff=noteNum(r[3]), sum=noteNum(r[4]);
     if(!(a>0&&b>0)) return {ok:false, msg:'두 할인율이 '+r[0]+' 와 '+r[1]+' 입니다 — 둘 다 0 보다 크게 하세요.'};
     if(![0,1,2].every(k=>isFinite(got[k]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-pr)>200) return {ok:false, msg:'최종 가격은 '+r[2]+' 원입니다.'};
     if(Math.abs(got[1]-eff)>0.2) return {ok:false, msg:'실제 할인율은 '+r[3]+' 입니다.'};
     if(Math.abs(got[2]-sum)>0.6) return {ok:false, msg:'단순 합은 '+r[4]+' 입니다.'};
     mem.a=a; mem.b=b; mem.eff=eff; mem.sum=sum;
     return {ok:true, msg:'기록했습니다 — 더하면 '+r[4]+' 인데 실제로는 '+r[3]+' 만 깎였습니다. 왜 그런지 손으로 봅시다.'};
   }}""",
 """  {t:'생각 — <b>남는 비율</b> 끼리 곱해 보세요',
   f:'1 − 첫 할인 = {0} · 1 − 둘째 할인 = {1} · 두 수의 곱 = {2}',
   chk(got, r, mem){
     if(mem.eff===undefined) return {ok:false, msg:'① 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const a=noteNum(r[0])/100, b=noteNum(r[1])/100, eff=noteNum(r[3])/100;
     if(!(a>0&&b>0)) return {ok:false, msg:'①과 같이 두 할인율을 0 보다 크게 두세요.'};
     if(![0,1,2].every(k=>isFinite(got[k]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-(1-a))>0.01) return {ok:false, msg:'첫 할인이 '+r[0]+' 이니 남는 비율은 얼마인가요?'};
     if(Math.abs(got[1]-(1-b))>0.01) return {ok:false, msg:'둘째 할인이 '+r[1]+' 이니 남는 비율은 얼마인가요?'};
     if(Math.abs(got[2]-(1-a)*(1-b))>0.01) return {ok:false, msg:'두 남는 비율을 곱해 보세요.'};
     if(Math.abs((1-(1-a)*(1-b))-eff)>0.01)
       return {ok:false, msg:'1 에서 그 곱을 빼면 화면의 실제 할인율 '+r[3]+' 가 나와야 합니다.'};
     mem.ok2=true;
     return {ok:true, msg:'계산했습니다 — 1 에서 그 곱을 빼면 화면의 실제 할인율과 같습니다. 할인은 남는 쪽을 곱하는 일이었습니다.'};
   }}""",
 """  {t:'판단 — <b>「같은 효과의 한 번 할인 계산」</b> 을 누른 뒤 고르세요',
   f:'실제 할인율 = {0} % · 단순 합 = {1} % · 단순 합이 더 크면 1, 아니면 0 → {2}',
   opts:['1 − (1−a)(1−b) = a + b − ab 이므로 실제 할인율은 <b>단순 합보다 ab 만큼 작다</b> — 두 번째 할인은 이미 깎이고 남은 금액에만 붙기 때문이다',
         '할인율은 더해지므로 30% 두 번은 60% 가 맞다',
         '두 번 깎으면 단순 합보다 더 많이 깎인다'],
   chk(got, r, mem, pick){
     if(!mem.ok2) return {ok:false, msg:'② 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const a=noteNum(r[0]), b=noteNum(r[1]), eff=noteNum(r[3]), sum=noteNum(r[4]);
     if(!(a>0&&b>0)) return {ok:false, msg:'두 할인율을 0 보다 크게 두고 판단하세요.'};
     if(![0,1,2].every(k=>isFinite(got[k]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-eff)>0.2) return {ok:false, msg:'실제 할인율은 '+r[3]+' 입니다.'};
     if(Math.abs(got[1]-sum)>0.6) return {ok:false, msg:'단순 합은 '+r[4]+' 입니다.'};
     if(Math.abs(got[2]-1)>0.01) return {ok:false, msg:'두 값을 견주세요.'};
     if(pick!==0)
       return {ok:false, msg:'남는 비율끼리 곱했더니 1 − (1−a)(1−b) 가 화면의 '+r[3]+' 와 같았습니다. 이것을 전개하면 어떤 꼴이 될까요? 다시 고르세요.'};
     return {ok:true, msg:'판단했습니다 — <b>할인은 더하기가 아니라 곱하기입니다.</b> 실제 할인율은 늘 단순 합보다 ab 만큼 작고, 그래서 50% 두 번도 공짜가 되지 않습니다 — 광고 문구를 읽는 수학입니다.'};
   }}""")
 +
 note(220, '내가 곱해 보고 · 내가 나누고 · 내가 판단한다',
 """  {t:'기록 — <b>「«곱해서» 계산해 보기」</b> 를 누르고 두 투입량을 적으세요',
   f:'올바른 투입 = {0} 개 · 잘못된 투입 = {1} 개 · 차이 = {2} 개',
   chk(got, r, mem){
     if(!r) return {ok:false, msg:'아직 화면 값이 없습니다.'};
     const l=noteNum(r[1]), ri=noteNum(r[2]), wr=noteNum(r[3]), d=noteNum(r[4]);
     if(!(l>0)) return {ok:false, msg:'손실률이 '+r[1]+' 입니다 — 0 보다 크게 올리세요.'};
     if(![0,1,2].every(k=>isFinite(got[k]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-ri)>1) return {ok:false, msg:'올바른 투입은 '+r[2]+' 개입니다.'};
     if(Math.abs(got[1]-wr)>1) return {ok:false, msg:'잘못된 투입은 '+r[3]+' 개입니다.'};
     if(Math.abs(got[2]-d)>1) return {ok:false, msg:'차이는 '+r[4]+' 개입니다.'};
     mem.l1=l; mem.d1=d;
     return {ok:true, msg:'기록했습니다 — 곱해서 센 쪽이 '+r[4]+' 개 적습니다. 손실률을 올려 봅시다.'};
   }}""",
 """  {t:'생각 — <b>손실률을 35% 이상</b> 으로 올리고 다시 적으세요',
   f:'손실률 = {0} % · 올바른 투입 = {1} 개 · 잘못된 투입 = {2} 개 · 차이 = {3} 개',
   chk(got, r, mem){
     if(mem.d1===undefined) return {ok:false, msg:'① 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const l=noteNum(r[1]), ri=noteNum(r[2]), wr=noteNum(r[3]), d=noteNum(r[4]);
     if(!(l>=35)) return {ok:false, msg:'손실률이 '+r[1]+' 입니다 — 35% 이상으로 올리세요.'};
     if(![0,1,2,3].every(k=>isFinite(got[k]))) return {ok:false, msg:'네 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-l)>1) return {ok:false, msg:'손실률은 '+r[1]+' 입니다.'};
     if(Math.abs(got[1]-ri)>1) return {ok:false, msg:'올바른 투입은 '+r[2]+' 개입니다.'};
     if(Math.abs(got[2]-wr)>1) return {ok:false, msg:'잘못된 투입은 '+r[3]+' 개입니다.'};
     if(Math.abs(got[3]-d)>1) return {ok:false, msg:'차이는 '+r[4]+' 개입니다.'};
     if(!(d>mem.d1)) return {ok:false, msg:'차이가 ①의 '+mem.d1+' 개보다 커지지 않았습니다 — 손실률을 더 올리세요.'};
     mem.d2=d; mem.ok2=true;
     return {ok:true, msg:'계산했습니다 — 손실률이 커지자 두 방법의 차가 '+mem.d1+' 개에서 '+d+' 개로 벌어졌습니다.'};
   }}""",
 """  {t:'판단 — 올바른 투입을 손으로 구해 보고 고르세요',
   f:'필요량 = {0} 개 · 1 − 손실률 = {1} · 필요량 ÷ (1 − 손실률) = {2} 개',
   opts:['투입 x 에서 <b>x × (1 − 손실률)</b> 이 완성되므로 x = 필요량 ÷ (1 − 손실률) 이다 — 곱해서 더하면 이미 줄어든 쪽에 비율을 붙이는 셈이라 늘 모자란다',
         '손실률만큼 더 넣으면 되므로 필요량 × (1 + 손실률) 이 맞다',
         '손실률은 투입량과 아무 관계가 없다'],
   chk(got, r, mem, pick){
     if(!mem.ok2) return {ok:false, msg:'② 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const n=noteNum(r[0]), l=noteNum(r[1])/100, ri=noteNum(r[2]);
     if(![0,1,2].every(k=>isFinite(got[k]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-n)>1) return {ok:false, msg:'필요량은 '+r[0]+' 개입니다.'};
     if(Math.abs(got[1]-(1-l))>0.01) return {ok:false, msg:'손실률이 '+r[1]+' 이니 남는 비율은 얼마인가요?'};
     if(Math.abs(got[2]-n/(1-l))>1.2) return {ok:false, msg:n+' 을 '+(1-l).toFixed(2)+' 로 나누어 보세요 — 화면의 '+r[2]+' 개와 거의 같아야 합니다.'};
     if(pick!==0)
       return {ok:false, msg:'곱해서 센 쪽은 손실률 '+r[1]+' 에서 '+mem.d2+' 개나 모자랐습니다. 완성되는 것은 투입의 몇 배였을까요? 다시 고르세요.'};
     return {ok:true, msg:'판단했습니다 — <b>「몇 % 버려진다」는 남는 비율로 나누는 문제입니다.</b> 곱해서 더하면 줄어든 쪽에 비율을 붙이는 셈이라 손실률이 클수록 크게 모자랍니다 — 발주서 한 줄이 생산을 멈추게 하는 자리입니다.'};
   }}""")
)
