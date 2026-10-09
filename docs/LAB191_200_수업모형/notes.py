# -*- coding: utf-8 -*-
"""LAB 191~200 탐구 노트 — 기록 → 생각 → 판단. 판정은 화면의 read() 값으로만 한다."""


def note(no, head, c1, c2, c3):
    return "\n %d:{ h:'%s',\n  c:[\n%s,\n%s,\n%s\n ]},\n" % (no, head, c1, c2, c3)


NOTES = (
 note(191, '내가 겹치고 · 내가 나누고 · 내가 판단한다',
 """  {t:'기록 — 두 문장을 <b>조금만 겹치게</b> 골라 적으세요',
   f:'∩ = {0} · ∪ = {1} · J = {2}',
   chk(got, r, mem){
     if(!r) return {ok:false, msg:'아직 화면 값이 없습니다.'};
     const i=noteNum(r[2]), u=noteNum(r[3]), j=noteNum(r[4]);
     if(!(i>0 && i<u)) return {ok:false, msg:'조금만 겹치는 두 문장을 고르세요 (지금 ∩ = '+r[2]+', ∪ = '+r[3]+').'};
     if(![0,1,2].every(k=>isFinite(got[k]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-i)>0.5||Math.abs(got[1]-u)>0.5)
       return {ok:false, msg:'화면은 ∩ = '+r[2]+' · ∪ = '+r[3]+' 입니다.'};
     if(Math.abs(got[2]-j)>0.004) return {ok:false, msg:'J 는 '+r[4]+' 입니다.'};
     mem.i=i; mem.u=u; mem.j=j;
     return {ok:true, msg:'기록했습니다 — ∩ 을 ∪ 로 나눈 값이 J 입니다.'};
   }}""",
 """  {t:'생각 — <b>∩ ÷ ∪</b> 를 손으로 구해 J 와 맞추세요',
   f:'∩ ÷ ∪ = {0} · 화면의 J = {1} · 두 값의 차 = {2}',
   chk(got, r, mem){
     if(mem.i===undefined) return {ok:false, msg:'① 칸을 먼저 통과하세요.'};
     if(![0,1,2].every(k=>isFinite(got[k]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-mem.i/mem.u)>0.006) return {ok:false, msg:'①의 '+mem.i+' 를 '+mem.u+' 로 나누세요.'};
     if(Math.abs(got[1]-mem.j)>0.004) return {ok:false, msg:'①에서 본 J 는 '+mem.j+' 입니다.'};
     if(Math.abs(got[2])>0.008) return {ok:false, msg:'두 값을 빼 보세요.'};
     mem.ok2=true;
     return {ok:true, msg:'계산했습니다 — 이제 양 끝을 만들어 봅시다.'};
   }}""",
 """  {t:'판단 — 두 문장을 <b>같게</b> 맞춘 뒤 고르세요',
   f:'∩ = {0} · ∪ = {1} · J = {2}',
   opts:['J = |A∩B| ÷ |A∪B| — 분모가 <b>합집합</b> 이라 많이 가진 쪽이 유리해지지 않고, 값은 늘 0 과 1 사이에 있다',
         '겹치는 개수만 세면 더 공평하다',
         'J 는 1 보다 커질 수도 있다'],
   chk(got, r, mem, pick){
     if(!mem.ok2) return {ok:false, msg:'② 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const i=noteNum(r[2]), u=noteNum(r[3]), j=noteNum(r[4]);
     if(Math.abs(j-1)>0.004) return {ok:false, msg:'J 가 '+r[4]+' 입니다. 두 문장을 같게 맞추세요.'};
     if(![0,1,2].every(k=>isFinite(got[k]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-i)>0.5||Math.abs(got[1]-u)>0.5)
       return {ok:false, msg:'지금은 ∩ = '+r[2]+' · ∪ = '+r[3]+' 입니다.'};
     if(Math.abs(got[2]-j)>0.004) return {ok:false, msg:'J 는 '+r[4]+' 입니다.'};
     if(pick!==0)
       return {ok:false, msg:'①에서는 '+mem.j+' 였고 같게 하니 1 이 되었습니다. 분모가 무엇이었나요? 다시 고르세요.'};
     return {ok:true, msg:'판단했습니다 — <b>교집합은 늘 합집합 안에 있으므로 J 는 0 과 1 사이</b> 입니다. 추천·표절 검사·문서 분류가 이 한 줄로 「비슷함」을 잽니다.'};
   }}""")
 +
 note(192, '내가 더하고 · 내가 벌리고 · 내가 판단한다',
 """  {t:'기록 — 밝기를 <b>0 이 아니게</b> 두고 평균을 적으세요',
   f:'밝기 = {0} · 평균 = {1}',
   chk(got, r, mem){
     if(!r) return {ok:false, msg:'아직 화면 값이 없습니다.'};
     const b=noteNum(r[0]), m=noteNum(r[2]), mn=noteNum(r[3]), mx=noteNum(r[4]);
     if(mn<=0||mx>=255) return {ok:false, msg:'지금 값이 잘려 있습니다 (최소 '+r[3]+', 최대 '+r[4]+') — 밝기를 줄여 잘리지 않게 하세요.'};
     if(![0,1].every(k=>isFinite(got[k]))) return {ok:false, msg:'두 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-b)>0.5||Math.abs(got[1]-m)>0.15)
       return {ok:false, msg:'화면은 밝기 '+r[0]+' · 평균 '+r[2]+' 입니다.'};
     mem.b=b; mem.m=m;
     return {ok:true, msg:'기록했습니다 — 밝기를 바꾸면 평균이 그만큼 따라올까요?'};
   }}""",
 """  {t:'생각 — 밝기만 <b>바꿔</b> 평균의 변화를 견주세요',
   f:'새 밝기 = {0} · 평균 = {1} · 밝기의 변화량 = {2} · 평균의 변화량 = {3}',
   chk(got, r, mem){
     if(mem.b===undefined) return {ok:false, msg:'① 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const b=noteNum(r[0]), m=noteNum(r[2]), mn=noteNum(r[3]), mx=noteNum(r[4]);
     if(Math.abs(b-mem.b)<5) return {ok:false, msg:'밝기가 거의 그대로입니다 — 바꿔 보세요.'};
     if(mn<=0||mx>=255) return {ok:false, msg:'값이 잘렸습니다 — 잘리지 않는 범위로 두세요.'};
     if(![0,1,2,3].every(k=>isFinite(got[k]))) return {ok:false, msg:'네 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-b)>0.5||Math.abs(got[1]-m)>0.15)
       return {ok:false, msg:'지금은 밝기 '+r[0]+' · 평균 '+r[2]+' 입니다.'};
     if(Math.abs(got[2]-(b-mem.b))>0.5) return {ok:false, msg:'①의 밝기 '+mem.b+' 와의 차를 적으세요.'};
     if(Math.abs(got[3]-(m-mem.m))>0.3) return {ok:false, msg:'①의 평균 '+mem.m+' 와의 차를 적으세요.'};
     if(Math.abs((b-mem.b)-(m-mem.m))>0.6) return {ok:false, msg:'두 변화량이 다르게 나왔습니다 — 값이 잘리지 않았는지 확인하세요.'};
     mem.ok2=true;
     return {ok:true, msg:'계산했습니다 — 두 변화량이 같습니다. 모든 칸에 같은 수를 더했으니까요.'};
   }}""",
 """  {t:'판단 — 밝기와 대비를 <b>끝까지</b> 올려 값을 잘리게 한 뒤 고르세요',
   f:'최소 = {0} · 최대 = {1}',
   opts:['사진은 숫자 표이고 밝기 조절은 <b>모든 칸에 같은 수를 더하는 일</b> — 다만 0~255 를 벗어나면 잘려 되돌릴 수 없다',
         '밝기를 올렸다 내리면 언제나 원래 사진으로 돌아온다',
         '대비를 바꾸면 평균도 함께 바뀐다'],
   chk(got, r, mem, pick){
     if(!mem.ok2) return {ok:false, msg:'② 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const mn=noteNum(r[3]), mx=noteNum(r[4]);
     if(!(mn<=0 || mx>=255)) return {ok:false, msg:'아직 잘리지 않았습니다 (최소 '+r[3]+', 최대 '+r[4]+') — 더 올려 보세요.'};
     if(![0,1].every(k=>isFinite(got[k]))) return {ok:false, msg:'두 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-mn)>0.5||Math.abs(got[1]-mx)>0.5)
       return {ok:false, msg:'지금은 최소 '+r[3]+' · 최대 '+r[4]+' 입니다.'};
     if(pick!==0)
       return {ok:false, msg:'끝이 0 이나 255 에 눌어붙었습니다. 그 칸들의 원래 차이를 되살릴 수 있을까요? 다시 고르세요.'};
     return {ok:true, msg:'판단했습니다 — <b>밝기는 덧셈, 대비는 평균에서 벌리는 곱셈</b> 입니다. 끝에서 잘린 값은 서로 구별이 사라져 되돌릴 수 없습니다 — 사진 보정의 한계가 여기서 생깁니다.'};
   }}""")
 +
 note(193, '내가 겹치고 · 내가 끄고 · 내가 판단한다',
 """  {t:'기록 — 세 세기를 <b>1 배</b> 로 두고 두 평균을 적으세요',
   f:'가중 평균 = {0} · 단순 평균 = {1} · 두 값의 차 = {2}',
   chk(got, r, mem){
     if(!r) return {ok:false, msg:'아직 화면 값이 없습니다.'};
     const kr=noteNum(r[0]), kg=noteNum(r[1]), kb=noteNum(r[2]);
     const w=noteNum(r[3]), s=noteNum(r[4]);
     if(Math.abs(kr-1)>0.05||Math.abs(kg-1)>0.05||Math.abs(kb-1)>0.05)
       return {ok:false, msg:'세 세기를 모두 1 배로 맞추세요 (지금 '+r[0]+', '+r[1]+', '+r[2]+').'};
     if(![0,1,2].every(k=>isFinite(got[k]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-w)>0.6||Math.abs(got[1]-s)>0.6)
       return {ok:false, msg:'화면은 가중 평균 '+r[3]+' · 단순 평균 '+r[4]+' 입니다.'};
     if(Math.abs(got[2]-(w-s))>1.2) return {ok:false, msg:'두 값을 빼세요.'};
     mem.w=w; mem.s=s;
     return {ok:true, msg:'기록했습니다 — 같은 점인데 두 값이 다릅니다. 어느 색이 가장 크게 바꿀까요?'};
   }}""",
 """  {t:'생각 — <b>초록 세기만</b> 0 가까이 내려 두 평균을 다시 적으세요',
   f:'가중 평균 = {0} · 단순 평균 = {1} · ①에서 가중 평균이 얼마나 떨어졌나 = {2}',
   chk(got, r, mem){
     if(mem.w===undefined) return {ok:false, msg:'① 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const kr=noteNum(r[0]), kg=noteNum(r[1]), kb=noteNum(r[2]);
     const w=noteNum(r[3]), s=noteNum(r[4]);
     if(!(kg<=0.2)) return {ok:false, msg:'초록 세기가 '+r[1]+' 입니다. 0.2 아래로 내리세요.'};
     if(Math.abs(kr-1)>0.05||Math.abs(kb-1)>0.05)
       return {ok:false, msg:'빨강과 파랑은 1 배로 두세요 — 초록만 바꿉니다.'};
     if(![0,1,2].every(k=>isFinite(got[k]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-w)>0.6||Math.abs(got[1]-s)>0.6)
       return {ok:false, msg:'지금은 '+r[3]+' 와 '+r[4]+' 입니다.'};
     if(Math.abs(got[2]-(mem.w-w))>1.2) return {ok:false, msg:'①의 가중 평균 '+mem.w+' 에서 지금 값을 빼세요.'};
     mem.drop=mem.w-w; mem.ok2=true;
     return {ok:true, msg:'계산했습니다 — 초록만 껐는데 '+(mem.w-w).toFixed(0)+' 만큼 어두워졌습니다.'};
   }}""",
 """  {t:'판단 — 초록을 되돌리고 <b>파랑만</b> 0 가까이 내린 뒤 고르세요',
   f:'가중 평균 = {0} · ①에서 얼마나 떨어졌나 = {1}',
   opts:['세 계수의 합이 1 이라 전체 밝기는 지켜지고, <b>초록의 계수가 가장 커서</b> 초록을 끌 때 가장 많이 어두워진다',
         '세 색의 영향이 똑같으므로 단순 평균을 써도 된다',
         '파랑의 계수가 가장 커서 파랑이 가장 중요하다'],
   chk(got, r, mem, pick){
     if(!mem.ok2) return {ok:false, msg:'② 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const kg=noteNum(r[1]), kb=noteNum(r[2]), w=noteNum(r[3]);
     if(!(kb<=0.2)) return {ok:false, msg:'파랑 세기를 0.2 아래로 내리세요 (지금 '+r[2]+').'};
     if(Math.abs(kg-1)>0.05) return {ok:false, msg:'초록은 1 배로 되돌리세요 (지금 '+r[1]+').'};
     if(![0,1].every(k=>isFinite(got[k]))) return {ok:false, msg:'두 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-w)>0.6) return {ok:false, msg:'가중 평균은 '+r[3]+' 입니다.'};
     if(Math.abs(got[1]-(mem.w-w))>1.2) return {ok:false, msg:'①의 '+mem.w+' 에서 지금 값을 빼세요.'};
     if(pick!==0)
       return {ok:false, msg:'초록을 껐을 때는 '+mem.drop.toFixed(0)+' 떨어졌는데 파랑을 끄니 '+(mem.w-w).toFixed(0)+' 뿐입니다. 계수를 보고 다시 고르세요.'};
     return {ok:true, msg:'판단했습니다 — <b>컬러 한 장은 숫자 표 세 장</b> 이고, 흑백으로 합칠 때는 사람 눈의 민감도에 맞춘 가중치를 씁니다. 그래서 초록이 0.587 로 가장 큽니다.'};
   }}""")
 +
 note(194, '내가 맞바꾸고 · 내가 되돌리고 · 내가 판단한다',
 """  {t:'기록 — <b>① 원본</b> 에서 두 자리의 수를 적으세요',
   f:'(1,2) 원소 = {0} · (2,1) 원소 = {1}',
   chk(got, r, mem){
     if(!r) return {ok:false, msg:'아직 화면 값이 없습니다.'};
     if(String(r[0])!=='원본') return {ok:false, msg:'「① 원본」을 고르세요 (지금 «'+r[0]+'»).'};
     const a=noteNum(r[2]), b=noteNum(r[3]);
     if(![0,1].every(k=>isFinite(got[k]))) return {ok:false, msg:'두 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-a)>0.5||Math.abs(got[1]-b)>0.5)
       return {ok:false, msg:'화면은 '+r[2]+' 와 '+r[3]+' 입니다.'};
     mem.a=a; mem.b=b;
     return {ok:true, msg:'기록했습니다 — 전치하면 이 두 수가 어떻게 될까요?'};
   }}""",
 """  {t:'생각 — <b>② 전치</b> 로 바꿔 두 자리를 다시 적으세요',
   f:'(1,2) 원소 = {0} · (2,1) 원소 = {1} · ①과 맞바뀌었으면 1, 아니면 0 → {2}',
   chk(got, r, mem){
     if(mem.a===undefined) return {ok:false, msg:'① 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     if(String(r[0])!=='전치') return {ok:false, msg:'「② 전치」로 바꾸세요 (지금 «'+r[0]+'»).'};
     const a=noteNum(r[2]), b=noteNum(r[3]);
     if(![0,1,2].every(k=>isFinite(got[k]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-a)>0.5||Math.abs(got[1]-b)>0.5)
       return {ok:false, msg:'지금은 '+r[2]+' 와 '+r[3]+' 입니다.'};
     const sw=(Math.abs(a-mem.b)<0.5 && Math.abs(b-mem.a)<0.5)?1:0;
     if(Math.abs(got[2]-sw)>0.01) return {ok:false, msg:'①의 '+mem.a+' 와 '+mem.b+' 가 서로 자리를 바꾸었는지 보세요.'};
     mem.ok2=true;
     return {ok:true, msg:'계산했습니다 — 두 수가 서로 자리를 바꾸었습니다.'};
   }}""",
 """  {t:'판단 — <b>「전치를 두 번 하기」</b> 를 누른 뒤 고르세요',
   f:'(1,2) 원소 = {0} · 원본과 같으면 1, 다르면 0 → {1}',
   opts:['전치는 (i, j) 를 (j, i) 로 보내므로 <b>두 번 하면 제자리</b> — (Aᵀ)ᵀ = A 다',
         '전치는 행렬의 값을 바꾸는 연산이다',
         '전치를 두 번 하면 90° 회전이 된다'],
   chk(got, r, mem, pick){
     if(!mem.ok2) return {ok:false, msg:'② 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const a=noteNum(r[2]), same=(String(r[4])==='같음')?1:0;
     if(!same) return {ok:false, msg:'아직 «'+r[4]+'» 입니다 — 「전치를 두 번 하기」를 눌러 원본으로 되돌리세요.'};
     if(![0,1].every(k=>isFinite(got[k]))) return {ok:false, msg:'두 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-a)>0.5) return {ok:false, msg:'(1,2) 원소는 '+r[2]+' 입니다.'};
     if(Math.abs(got[1]-same)>0.01) return {ok:false, msg:'화면에 «'+r[4]+'» 이라고 나와 있습니다.'};
     if(pick!==0)
       return {ok:false, msg:'한 번 전치했을 때 '+mem.a+' 와 '+mem.b+' 가 바뀌었고, 두 번 하니 제자리입니다. 다시 고르세요.'};
     return {ok:true, msg:'판단했습니다 — <b>전치는 값을 바꾸지 않고 자리만 바꿉니다.</b> 같은 자료를 가로로 읽느냐 세로로 읽느냐의 차이이고, 그래서 두 번이면 제자리입니다.'};
   }}""")
 +
 note(195, '내가 옮기고 · 내가 재고 · 내가 판단한다',
 """  {t:'기록 — 네 수를 정하고 <b>행렬식</b> 을 손으로 구하세요',
   f:'a×d = {0} · b×c = {1} · ad − bc = {2}',
   chk(got, r, mem){
     if(!r) return {ok:false, msg:'아직 화면 값이 없습니다.'};
     const a=noteNum(r[0]), b=noteNum(r[1]), c=noteNum(r[2]), d=noteNum(r[3]), det=noteNum(r[4]);
     if(Math.abs(det)<0.05) return {ok:false, msg:'①은 행렬식이 0 이 아닌 자리에서 적습니다 — 0 은 ③에서 만듭니다.'};
     if(![0,1,2].every(k=>isFinite(got[k]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-a*d)>0.06||Math.abs(got[1]-b*c)>0.06)
       return {ok:false, msg:'화면의 a = '+r[0]+', b = '+r[1]+', c = '+r[2]+', d = '+r[3]+' 로 각각 곱하세요.'};
     if(Math.abs(got[2]-det)>0.03) return {ok:false, msg:'화면의 행렬식은 '+r[4]+' 입니다.'};
     mem.det=det;
     return {ok:true, msg:'기록했습니다 — 이 수가 넓이의 배율입니다. 뒤집어 봅시다.'};
   }}""",
 """  {t:'생각 — <b>「좌우 뒤집기 행렬」</b> 을 눌러 행렬식의 부호를 보세요',
   f:'행렬식 = {0} · 부호가 음수이면 −1, 양수이면 1 → {1}',
   chk(got, r, mem){
     if(mem.det===undefined) return {ok:false, msg:'① 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const det=noteNum(r[4]);
     if(!(det<-0.05)) return {ok:false, msg:'행렬식이 '+r[4]+' 입니다. 음수가 되게 만드세요.'};
     if(![0,1].every(k=>isFinite(got[k]))) return {ok:false, msg:'두 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-det)>0.03) return {ok:false, msg:'행렬식은 '+r[4]+' 입니다.'};
     if(Math.abs(got[1]+1)>0.01) return {ok:false, msg:'부호가 음수이므로 −1 을 적으세요.'};
     mem.ok2=true;
     return {ok:true, msg:'계산했습니다 — 음수는 「뒤집혔다」는 뜻입니다. 크기는 여전히 넓이 배율입니다.'};
   }}""",
 """  {t:'판단 — 네 수를 맞춰 행렬식을 <b>0</b> 으로 만든 뒤 고르세요',
   f:'a×d = {0} · b×c = {1} · 행렬식 = {2}',
   opts:['행렬식은 <b>넓이의 배율</b> 이고 부호는 뒤집힘을 뜻한다 — 0 이면 도형이 납작해져 되돌릴 수 없다',
         '행렬식은 도형의 둘레가 몇 배 되는지를 말한다',
         '행렬식이 0 이어도 원래 도형으로 되돌릴 수 있다'],
   chk(got, r, mem, pick){
     if(!mem.ok2) return {ok:false, msg:'② 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const a=noteNum(r[0]), b=noteNum(r[1]), c=noteNum(r[2]), d=noteNum(r[3]), det=noteNum(r[4]);
     if(Math.abs(det)>0.05) return {ok:false, msg:'행렬식이 '+r[4]+' 입니다. 0 이 되게 맞추세요 (ad 와 bc 를 같게).'};
     if(![0,1,2].every(k=>isFinite(got[k]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-a*d)>0.06||Math.abs(got[1]-b*c)>0.06)
       return {ok:false, msg:'a×d 와 b×c 를 각각 구하세요 — 둘이 같아야 합니다.'};
     if(Math.abs(got[2]-det)>0.03) return {ok:false, msg:'행렬식은 '+r[4]+' 입니다.'};
     if(pick!==0)
       return {ok:false, msg:'①에서 '+mem.det+' 였던 배율이 0 이 되자 도형이 선분으로 눌렸습니다. 다시 고르세요.'};
     return {ok:true, msg:'판단했습니다 — <b>행렬식 0 은 「차원이 하나 사라졌다」</b> 는 뜻입니다. 넓이가 0 이 되면 서로 다른 점들이 한 점으로 겹쳐 버려 되돌릴 수 없습니다 — 역행렬이 없는 까닭입니다.'};
   }}""")
 +
 note(196, '내가 세고 · 내가 흔들고 · 내가 판단한다',
 """  {t:'기록 — <b>「본보기 T 그대로」</b> 를 누르고 두 거리를 적으세요',
   f:'T 까지 = {0} · L 까지 = {1}',
   chk(got, r, mem){
     if(!r) return {ok:false, msg:'아직 화면 값이 없습니다.'};
     const dT=noteNum(r[0]), dL=noteNum(r[1]);
     if(dT!==0) return {ok:false, msg:'T 까지의 거리가 '+r[0]+' 입니다 — 「본보기 T 그대로」를 누르세요.'};
     if(![0,1].every(k=>isFinite(got[k]))) return {ok:false, msg:'두 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-dT)>0.5||Math.abs(got[1]-dL)>0.5)
       return {ok:false, msg:'화면은 '+r[0]+' 와 '+r[1]+' 입니다.'};
     mem.dL=dL;
     return {ok:true, msg:'기록했습니다 — 거리 0 은 똑같다는 뜻입니다. 잡음을 넣어 봅시다.'};
   }}""",
 """  {t:'생각 — <b>「잡음 두 칸 넣기」</b> 를 누르고 다시 적으세요',
   f:'T 까지 = {0} · L 까지 = {1} · 판정이 T 이면 1, 아니면 0 → {2}',
   chk(got, r, mem){
     if(mem.dL===undefined) return {ok:false, msg:'① 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const dT=noteNum(r[0]), dL=noteNum(r[1]);
     if(dT===0) return {ok:false, msg:'아직 본보기 그대로입니다 — 「잡음 두 칸 넣기」를 누르세요.'};
     if(![0,1,2].every(k=>isFinite(got[k]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-dT)>0.5||Math.abs(got[1]-dL)>0.5)
       return {ok:false, msg:'지금은 '+r[0]+' 와 '+r[1]+' 입니다.'};
     if(Math.abs(got[2]-((String(r[2])==='T')?1:0))>0.01)
       return {ok:false, msg:'화면의 판정은 «'+r[2]+'» 입니다.'};
     mem.dT2=dT; mem.ok2=true;
     return {ok:true, msg:'계산했습니다 — 잡음이 조금 섞여도 여전히 T 쪽이 가깝습니다.'};
   }}""",
 """  {t:'판단 — <b>「두 본보기의 딱 가운데로」</b> 를 누른 뒤 고르세요',
   f:'T 까지 = {0} · L 까지 = {1} · 두 거리가 같으면 1, 아니면 0 → {2}',
   opts:['해밍 거리는 <b>다른 칸의 수</b> — 가장 가까운 본보기로 고르면 잡음에 어느 정도 버티지만, 같은 거리면 가릴 수 없다',
         '잡음이 하나라도 섞이면 분류할 수 없다',
         '거리가 같으면 둘 다 맞는 답이다'],
   chk(got, r, mem, pick){
     if(!mem.ok2) return {ok:false, msg:'② 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const dT=noteNum(r[0]), dL=noteNum(r[1]);
     if(dT!==dL) return {ok:false, msg:'두 거리가 '+r[0]+' 와 '+r[1]+' 로 다릅니다 — 「딱 가운데로」를 누르세요.'};
     if(![0,1,2].every(k=>isFinite(got[k]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-dT)>0.5||Math.abs(got[1]-dL)>0.5)
       return {ok:false, msg:'지금은 '+r[0]+' 와 '+r[1]+' 입니다.'};
     if(Math.abs(got[2]-1)>0.01) return {ok:false, msg:'두 거리가 같으니 1 을 적으세요.'};
     if(pick!==0)
       return {ok:false, msg:'잡음 두 칸까지는 T 로 바르게 가렸는데(②), 딱 가운데에서는 '+r[0]+' 로 같아져 가릴 수 없습니다. 다시 고르세요.'};
     return {ok:true, msg:'판단했습니다 — <b>「가장 가까운 본보기」 는 단순하지만 꽤 잘 듣습니다.</b> 다만 경계에 놓인 입력에서는 결정을 내릴 수 없고, 그 경계를 어떻게 다루느냐가 분류기의 품질을 가릅니다.'};
   }}""")
 +
 note(197, '내가 곱하고 · 내가 더하고 · 내가 판단한다',
 """  {t:'기록 — 세 입력과 출력 z₁ 을 적으세요',
   f:'x₁ = {0} · x₂ = {1} · x₃ = {2} · z₁ = {3}',
   chk(got, r, mem){
     if(!r) return {ok:false, msg:'아직 화면 값이 없습니다.'};
     const x=[noteNum(r[0]),noteNum(r[1]),noteNum(r[2])], z=noteNum(r[3]);
     if(![0,1,2,3].every(k=>isFinite(got[k]))) return {ok:false, msg:'네 칸을 모두 채우세요.'};
     for(let k=0;k<3;k++) if(Math.abs(got[k]-x[k])>0.03)
       return {ok:false, msg:'화면은 '+r[0]+' · '+r[1]+' · '+r[2]+' 입니다.'};
     if(Math.abs(got[3]-z)>0.004) return {ok:false, msg:'z₁ 은 '+r[3]+' 입니다.'};
     mem.x1=x[0]; mem.z=z;
     return {ok:true, msg:'기록했습니다 — x₁ 만 바꾸면 z₁ 이 얼마나 움직일까요?'};
   }}""",
 """  {t:'생각 — <b>x₁ 만</b> 바꿔 z₁ 의 변화를 견주세요',
   f:'새 x₁ = {0} · z₁ = {1} · z₁ 의 변화 ÷ x₁ 의 변화 = {2}',
   chk(got, r, mem){
     if(mem.x1===undefined) return {ok:false, msg:'① 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const x1=noteNum(r[0]), z=noteNum(r[3]);
     if(Math.abs(x1-mem.x1)<0.09) return {ok:false, msg:'x₁ 이 거의 그대로입니다 — 0.1 넘게 바꾸세요.'};
     if(![0,1,2].every(k=>isFinite(got[k]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-x1)>0.03||Math.abs(got[1]-z)>0.004)
       return {ok:false, msg:'지금은 x₁ = '+r[0]+' · z₁ = '+r[3]+' 입니다.'};
     if(Math.abs(got[2]-(z-mem.z)/(x1-mem.x1))>0.06)
       return {ok:false, msg:'z₁ 의 변화를 x₁ 의 변화로 나누세요 — 가중치 하나가 나옵니다.'};
     mem.w1=(z-mem.z)/(x1-mem.x1); mem.ok2=true;
     return {ok:true, msg:'계산했습니다 — 그 비가 곧 x₁ 에 붙은 가중치 '+mem.w1.toFixed(2)+' 입니다.'};
   }}""",
 """  {t:'판단 — <b>「가중치 한 줄 지우기」</b> 를 누른 뒤 고르세요',
   f:'x₁ = {0} · z₁ = {1} · x₁ 을 바꿔도 z₁ 이 그대로면 1, 아니면 0 → {2}',
   opts:['한 층이 하는 일은 <b>z = Wx + b</b> — 입력마다 가중치를 곱해 더하고 편향을 더할 뿐이다',
         '신경망의 층은 복잡한 비선형 계산을 한다',
         '가중치를 지워도 출력은 입력을 그대로 따라간다'],
   chk(got, r, mem, pick){
     if(!mem.ok2) return {ok:false, msg:'② 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const x1=noteNum(r[0]), z=noteNum(r[3]);
     if(![0,1,2].every(k=>isFinite(got[k]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-x1)>0.03||Math.abs(got[1]-z)>0.004)
       return {ok:false, msg:'지금은 x₁ = '+r[0]+' · z₁ = '+r[3]+' 입니다.'};
     if(Math.abs(got[2]-1)>0.01)
       return {ok:false, msg:'가중치를 지운 뒤 x₁ 을 움직여 보세요 — z₁ 이 따라 변하던가요?'};
     if(pick!==0)
       return {ok:false, msg:'②에서 x₁ 을 바꾸면 z₁ 이 '+mem.w1.toFixed(2)+' 배로 따라왔는데, 가중치를 지우니 꼼짝하지 않습니다. 다시 고르세요.'};
     return {ok:true, msg:'판단했습니다 — <b>가중치가 0 이면 그 입력을 아예 보지 않습니다.</b> 학습이란 이 가중치들을 조금씩 고쳐 「무엇을 얼마나 볼지」를 정하는 일입니다.'};
   }}""")
 +
 note(198, '내가 재고 · 내가 옮기고 · 내가 판단한다',
 """  {t:'기록 — a 를 <b>최적이 아닌</b> 자리에 두고 적으세요',
   f:'a = {0} · L(a) = {1} · 최소와의 차 = {2}',
   chk(got, r, mem){
     if(!r) return {ok:false, msg:'아직 화면 값이 없습니다.'};
     const a=noteNum(r[0]), L=noteNum(r[1]), g=noteNum(r[2]);
     if(String(r[4])==='예') return {ok:false, msg:'①은 골짜기가 아닌 자리에서 적습니다 — a 를 옮기세요. 바닥은 ③에서 찾습니다.'};
     if(![0,1,2].every(k=>isFinite(got[k]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-a)>0.06) return {ok:false, msg:'a 는 '+r[0]+' 입니다.'};
     if(Math.abs(got[1]-L)>0.004||Math.abs(got[2]-g)>0.004)
       return {ok:false, msg:'화면은 L(a) = '+r[1]+' · 차 '+r[2]+' 입니다.'};
     mem.a=a; mem.L=L; mem.best=noteNum(r[3]);
     return {ok:true, msg:'기록했습니다 — 최적은 '+mem.best+' 라고 합니다. 양쪽으로 옮겨 봅시다.'};
   }}""",
 """  {t:'생각 — a 를 <b>반대쪽</b> 으로 옮겨 L 을 다시 적으세요',
   f:'새 a = {0} · L(a) = {1} · ①의 L 보다 크면 1, 작으면 0 → {2}',
   chk(got, r, mem){
     if(mem.a===undefined) return {ok:false, msg:'① 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const a=noteNum(r[0]), L=noteNum(r[1]);
     if((mem.a-mem.best)*(a-mem.best) > 0)
       return {ok:false, msg:'①과 같은 쪽입니다 — 최적 '+mem.best+' 의 <b>반대쪽</b> 으로 옮기세요.'};
     if(![0,1,2].every(k=>isFinite(got[k]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-a)>0.06||Math.abs(got[1]-L)>0.004)
       return {ok:false, msg:'지금은 a = '+r[0]+' · L(a) = '+r[1]+' 입니다.'};
     if(Math.abs(got[2]-(L>mem.L?1:0))>0.01) return {ok:false, msg:'①의 L = '+mem.L+' 와 견주어 보세요.'};
     mem.ok2=true;
     return {ok:true, msg:'계산했습니다 — 어느 쪽으로 가도 가운데보다 큽니다. 골짜기가 하나입니다.'};
   }}""",
 """  {t:'판단 — <b>「손실이 가장 작은 a 로」</b> 를 누른 뒤 고르세요',
   f:'최적 a = {0} · L(a) = {1} · 최소와의 차 = {2}',
   opts:['L(a) = 평균((y − ax)²) 는 a 에 대한 <b>아래로 볼록한 이차식</b> — 골짜기가 하나뿐이라 가장 좋은 a 가 하나로 정해진다',
         '손실 곡선은 골짜기가 여러 개라 어디로 갈지 알 수 없다',
         '손실이 작을수록 직선이 자료에서 멀다'],
   chk(got, r, mem, pick){
     if(!mem.ok2) return {ok:false, msg:'② 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const a=noteNum(r[0]), L=noteNum(r[1]), g=noteNum(r[2]);
     if(String(r[4])!=='예') return {ok:false, msg:'아직 골짜기가 아닙니다 — 「손실이 가장 작은 a 로」를 누르세요.'};
     if(![0,1,2].every(k=>isFinite(got[k]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-a)>0.06||Math.abs(got[1]-L)>0.004||Math.abs(got[2]-g)>0.004)
       return {ok:false, msg:'지금은 '+r[0]+' · '+r[1]+' · '+r[2]+' 입니다.'};
     if(pick!==0)
       return {ok:false, msg:'양쪽 어디로 가도 L 이 커졌고 가운데가 가장 작았습니다. 그 모양이 무엇일까요? 다시 고르세요.'};
     return {ok:true, msg:'판단했습니다 — <b>「좋다」를 수 하나로 바꾸는 순간, 좋은 직선 찾기가 「가장 작은 값 찾기」가 됩니다.</b> 이것이 기계학습이 하는 일의 전부에 가깝습니다.'};
   }}""")
 +
 note(199, '내가 흔들고 · 내가 견주고 · 내가 판단한다',
 """  {t:'기록 — 이상치를 <b>0</b> 으로 두고 두 기울기를 적으세요',
   f:'MSE 기울기 = {0} · MAE 기울기 = {1} · 차 = {2}',
   chk(got, r, mem){
     if(!r) return {ok:false, msg:'아직 화면 값이 없습니다.'};
     const o=noteNum(r[0]), fm=noteNum(r[1]), fa=noteNum(r[2]), d=noteNum(r[3]);
     if(o!==0) return {ok:false, msg:'이상치를 0 으로 내리세요 (지금 '+r[0]+').'};
     if(![0,1,2].every(k=>isFinite(got[k]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-fm)>0.004||Math.abs(got[1]-fa)>0.004)
       return {ok:false, msg:'화면은 '+r[1]+' 와 '+r[2]+' 입니다.'};
     if(Math.abs(got[2]-d)>0.004) return {ok:false, msg:'차는 '+r[3]+' 입니다.'};
     mem.d0=d;
     return {ok:true, msg:'기록했습니다 — 이상치가 없으니 두 기준이 거의 같은 답을 냅니다.'};
   }}""",
 """  {t:'생각 — 이상치를 <b>크게</b> 키워 두 기울기를 다시 적으세요',
   f:'이상치 = {0} · MSE 기울기 = {1} · MAE 기울기 = {2} · 차 = {3}',
   chk(got, r, mem){
     if(mem.d0===undefined) return {ok:false, msg:'① 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const o=noteNum(r[0]), fm=noteNum(r[1]), fa=noteNum(r[2]), d=noteNum(r[3]);
     if(!(o>=12)) return {ok:false, msg:'이상치가 '+r[0]+' 입니다. 12 이상으로 키우세요.'};
     if(![0,1,2,3].every(k=>isFinite(got[k]))) return {ok:false, msg:'네 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-o)>0.5) return {ok:false, msg:'이상치는 '+r[0]+' 입니다.'};
     if(Math.abs(got[1]-fm)>0.004||Math.abs(got[2]-fa)>0.004)
       return {ok:false, msg:'지금은 '+r[1]+' 와 '+r[2]+' 입니다.'};
     if(Math.abs(got[3]-d)>0.004) return {ok:false, msg:'차는 '+r[3]+' 입니다.'};
     if(!(d>mem.d0)) return {ok:false, msg:'차가 ①의 '+mem.d0+' 보다 커지지 않았습니다 — 이상치를 더 키우세요.'};
     mem.d1=d; mem.fm=fm; mem.fa=fa; mem.ok2=true;
     return {ok:true, msg:'계산했습니다 — 한쪽이 훨씬 많이 끌려갔습니다. 어느 쪽일까요?'};
   }}""",
 """  {t:'판단 — 어느 기울기가 더 많이 움직였는지 보고 고르세요',
   f:'MSE 기울기 = {0} · MAE 기울기 = {1} · 더 많이 끌려간 쪽이 MSE 이면 1, MAE 이면 0 → {2}',
   opts:['제곱은 큰 오차를 <b>훨씬 크게</b> 센다 — 그래서 MSE 는 이상치 하나에도 크게 끌려가고, MAE 는 상대적으로 버틴다',
         '절댓값이 제곱보다 큰 오차에 민감하다',
         '두 기준은 이상치가 있어도 같은 답을 낸다'],
   chk(got, r, mem, pick){
     if(!mem.ok2) return {ok:false, msg:'② 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const fm=noteNum(r[1]), fa=noteNum(r[2]);
     if(![0,1,2].every(k=>isFinite(got[k]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-fm)>0.004||Math.abs(got[1]-fa)>0.004)
       return {ok:false, msg:'지금은 '+r[1]+' 와 '+r[2]+' 입니다.'};
     if(Math.abs(got[2]-1)>0.01) return {ok:false, msg:'①의 두 값과 견주어 어느 쪽이 더 많이 움직였는지 보세요.'};
     if(pick!==0)
       return {ok:false, msg:'이상치가 없을 때 차가 '+mem.d0+' 였는데 키우니 '+mem.d1+' 가 되었습니다. 오차 10 을 제곱하면 얼마인가요? 다시 고르세요.'};
     return {ok:true, msg:'판단했습니다 — <b>무엇을 오차로 볼지가 답을 바꿉니다.</b> 이상치가 진짜 신호라면 MSE 가, 잘못 들어온 값이라면 MAE 가 낫습니다 — 손실함수를 고르는 일도 수학적 판단입니다.'};
   }}""")
 +
 note(200, '내가 걷고 · 내가 넘기고 · 내가 판단한다',
 """  {t:'기록 — 보폭을 <b>작게</b> 두고 도착한 자리를 적으세요',
   f:'학습률 = {0} · 걸음 수 = {1} · 도착 = {2}',
   chk(got, r, mem){
     if(!r) return {ok:false, msg:'아직 화면 값이 없습니다.'};
     const e=noteNum(r[0]), n=noteNum(r[1]), x=noteNum(r[3]);
     if(!(e<=0.3)) return {ok:false, msg:'①은 보폭을 0.3 이하로 두고 적습니다 (지금 '+r[0]+').'};
     if(String(r[4])==='수렴') return {ok:false, msg:'벌써 바닥입니다 — 걸음 수를 줄이거나 보폭을 더 작게 하세요.'};
     if(![0,1,2].every(k=>isFinite(got[k]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-e)>0.006||Math.abs(got[1]-n)>0.5)
       return {ok:false, msg:'화면은 학습률 '+r[0]+' · 걸음 '+r[1]+' 입니다.'};
     if(Math.abs(got[2]-x)>0.004) return {ok:false, msg:'도착은 '+r[3]+' 입니다.'};
     mem.e=e; mem.x=Math.abs(x);
     return {ok:true, msg:'기록했습니다 — 아직 바닥에서 '+Math.abs(x).toFixed(2)+' 떨어져 있습니다. 보폭을 키워 봅시다.'};
   }}""",
 """  {t:'생각 — 보폭을 키워 <b>바닥</b> 까지 내려가 보세요',
   f:'새 학습률 = {0} · 도착 = {1} · ①보다 가까워졌으면 1, 아니면 0 → {2}',
   chk(got, r, mem){
     if(mem.e===undefined) return {ok:false, msg:'① 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const e=noteNum(r[0]), x=noteNum(r[3]);
     if(String(r[4])!=='수렴') return {ok:false, msg:'아직 «'+r[4]+'» 입니다 — 보폭을 키워 바닥에 닿게 하세요.'};
     if(![0,1,2].every(k=>isFinite(got[k]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-e)>0.006) return {ok:false, msg:'학습률은 '+r[0]+' 입니다.'};
     if(Math.abs(got[1]-x)>0.004) return {ok:false, msg:'도착은 '+r[3]+' 입니다.'};
     if(Math.abs(got[2]-(Math.abs(x)<mem.x?1:0))>0.01) return {ok:false, msg:'①의 '+mem.x.toFixed(3)+' 와 견주어 보세요.'};
     mem.ok2=true;
     return {ok:true, msg:'계산했습니다 — 알맞은 보폭이면 몇 걸음에 바닥입니다. 더 키우면 어떨까요?'};
   }}""",
 """  {t:'판단 — 보폭을 <b>2 보다 크게</b> 올린 뒤 고르세요',
   f:'학습률 = {0} · 도착 = {1} · 1 − 학습률 의 크기 = {2}',
   opts:['한 걸음마다 x 가 <b>(1 − ε) 배</b> 가 되므로 |1 − ε| < 1, 곧 <b>0 < ε < 2</b> 여야 바닥으로 모인다',
         '보폭이 클수록 빨리 도착한다',
         '보폭은 아무리 커도 언젠가는 바닥에 닿는다'],
   chk(got, r, mem, pick){
     if(!mem.ok2) return {ok:false, msg:'② 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const e=noteNum(r[0]), x=noteNum(r[3]);
     if(!(e>2.0)) return {ok:false, msg:'학습률이 '+r[0]+' 입니다. 2 보다 크게 올리세요.'};
     if(![0,1,2].every(k=>isFinite(got[k]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-e)>0.006) return {ok:false, msg:'학습률은 '+r[0]+' 입니다.'};
     if(!isFinite(x)) { if(Math.abs(got[1])<1e9) return {ok:false, msg:'도착이 «'+r[3]+'» 입니다 — 아주 큰 수를 적거나 걸음 수를 줄여 보세요.'}; }
     else if(Math.abs(got[1]-x)>Math.max(0.01, Math.abs(x)*0.02)) return {ok:false, msg:'도착은 '+r[3]+' 입니다.'};
     if(Math.abs(got[2]-Math.abs(1-e))>0.03) return {ok:false, msg:'1 에서 학습률을 뺀 값의 크기를 구하세요.'};
     if(!(Math.abs(1-e)>1)) return {ok:false, msg:'|1 − ε| 이 아직 1 보다 작습니다 — 더 올리세요.'};
     if(pick!==0)
       return {ok:false, msg:'ε = '+mem.e+' 에서는 더디고, 알맞게 키우니 바닥에 닿았고, 2 를 넘기자 멀어졌습니다. 다시 고르세요.'};
     return {ok:true, msg:'판단했습니다 — <b>학습률은 크지도 작지도 않아야 합니다.</b> 작으면 끝없이 더디고, 2 를 넘으면 골짜기를 건너뛰며 점점 멀어집니다 — 딥러닝에서 가장 먼저 손보는 값이 이것입니다.'};
   }}""")
)
