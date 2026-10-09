# -*- coding: utf-8 -*-
"""LAB 141~150 탐구 노트 — 기록 → 생각 → 판단. 판정은 화면의 read() 값으로만 한다."""


def note(no, head, c1, c2, c3):
    return "\n %d:{ h:'%s',\n  c:[\n%s,\n%s,\n%s\n ]},\n" % (no, head, c1, c2, c3)


NOTES = (
 note(141, '내가 자르고 · 내가 늘리고 · 내가 판단한다',
 """  {t:'기록 — 원판 개수를 <b>적게</b> 두고 합과 오차를 적으세요',
   f:'n = {0} · 원판 합 = {1} · 오차 = {2}',
   chk(got, r, mem){
     if(!r) return {ok:false, msg:'아직 화면 값이 없습니다.'};
     const n=noteNum(r[1]), s=noteNum(r[3]), e=noteNum(r[4]);
     if(n>20) return {ok:false, msg:'①은 n 을 20 이하로 두고 적습니다 — 늘리는 것은 ②에서 합니다.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-n)>0.5) return {ok:false, msg:'n 은 '+r[1]+' 입니다.'};
     if(Math.abs(got[1]-s)>0.0006||Math.abs(got[2]-e)>0.0006)
       return {ok:false, msg:'화면은 합 '+r[3]+' · 오차 '+r[4]+' 입니다.'};
     mem.n=n; mem.e=e; mem.shape=String(r[0]);
     return {ok:true, msg:'기록했습니다 — 지금 벽이 r = '+mem.shape+' 이고 오차가 '+r[4]+' 입니다. n 을 늘려 봅시다.'};
   }}""",
 """  {t:'생각 — n 을 <b>다섯 배 넘게</b> 늘려 오차를 다시 구하세요',
   f:'새 n = {0} · 오차 = {1} · ①의 오차보다 줄었으면 1, 아니면 0 → {2}',
   chk(got, r, mem){
     if(mem.n===undefined) return {ok:false, msg:'① 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const n=noteNum(r[1]), e=noteNum(r[4]);
     if(String(r[0])!==mem.shape)
       return {ok:false, msg:'모양은 ①과 같은 r = '+mem.shape+' 으로 두세요 — 한 번에 하나만 바꿉니다.'};
     if(!(n >= mem.n*5)) return {ok:false, msg:'n 이 '+r[1]+' 입니다. ①의 '+mem.n+' 의 다섯 배(='+(mem.n*5)+') 넘게 늘리세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-n)>0.5||Math.abs(got[1]-e)>0.0006)
       return {ok:false, msg:'지금은 n = '+r[1]+' · 오차 '+r[4]+' 입니다.'};
     if(Math.abs(got[2]-(e<mem.e?1:0))>0.01) return {ok:false, msg:'①의 오차 '+mem.e+' 와 견주어 보세요.'};
     mem.ok2=true;
     return {ok:true, msg:'계산했습니다 — 자를수록 계단이 그릇에 가까워집니다.'};
   }}""",
 """  {t:'판단 — <b>모양을 바꿔</b> 같은 것을 해 본 뒤 고르세요',
   f:'새 n = {0} · 원판 합 = {1} · 오차 = {2}',
   opts:['원판 한 장이 <b>π r²Δx</b> 이고, 그 합의 극한이 <b>∫π r² dx</b> 다 — 공식이 없는 모양도 잘라서 더하면 된다',
         '원판으로는 둥근 그릇의 부피를 구할 수 없다',
         'n 을 늘리면 합이 끝없이 커진다'],
   chk(got, r, mem, pick){
     if(!mem.ok2) return {ok:false, msg:'② 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     if(String(r[0])===mem.shape)
       return {ok:false, msg:'모양이 r = '+r[0]+' 로 그대로입니다 — 다른 모양을 고르세요.'};
     const n=noteNum(r[1]), s=noteNum(r[3]), e=noteNum(r[4]);
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-n)>0.5) return {ok:false, msg:'n 은 '+r[1]+' 입니다.'};
     if(Math.abs(got[1]-s)>0.0006||Math.abs(got[2]-e)>0.0006)
       return {ok:false, msg:'지금은 합 '+r[3]+' · 오차 '+r[4]+' 입니다.'};
     if(pick!==0)
       return {ok:false, msg:'모양을 바꿔도 n 을 늘리면 오차가 줄어듭니다 (지금 '+r[4]+'). 다시 고르세요.'};
     return {ok:true, msg:'판단했습니다 — <b>얇게 잘라 아는 모양으로 바꾸고, 더한 뒤, 극한을 본다.</b> 적분이 하는 일이 늘 이것입니다 — 넓이도, 부피도, 일도 같은 틀입니다.'};
   }}""")
 +
 note(142, '내가 뽑고 · 내가 더하고 · 내가 판단한다',
 """  {t:'기록 — 한 자리를 정해 값을 적으세요',
   f:'n = {0} · r = {1} · C(n, r) = {2}',
   chk(got, r, mem){
     if(!r) return {ok:false, msg:'아직 화면 값이 없습니다.'};
     const n=noteNum(r[0]), rr=noteNum(r[1]), v=noteNum(r[2]);
     if(!(n>=2 && rr>=1 && rr<=n-1))
       return {ok:false, msg:'가장자리(r = 0 이나 r = n)는 위 두 수가 한쪽뿐입니다 — 안쪽 자리로 옮기세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-n)>0.5||Math.abs(got[1]-rr)>0.5)
       return {ok:false, msg:'화면은 n = '+r[0]+' · r = '+r[1]+' 입니다.'};
     if(Math.abs(got[2]-v)>0.5) return {ok:false, msg:'C(n, r) 는 '+r[2]+' 입니다.'};
     mem.n=n; mem.r=rr; mem.v=v;
     return {ok:true, msg:'기록했습니다 — 이제 바로 위 두 수를 보겠습니다.'};
   }}""",
 """  {t:'생각 — <b>바로 위 두 수</b> 를 더해 보세요',
   f:'위 두 수의 합 = {0} · C(n, r) 에서 그 합을 빼면 = {1}',
   chk(got, r, mem){
     if(mem.n===undefined) return {ok:false, msg:'① 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const v=noteNum(r[2]), s=noteNum(r[4]);
     if(![0,1].every(j=>isFinite(got[j]))) return {ok:false, msg:'두 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-s)>0.5) return {ok:false, msg:'화면의 「합」은 '+r[4]+' 입니다 (위 두 수: '+r[3]+').'};
     if(Math.abs(got[1]-(v-s))>0.5) return {ok:false, msg:'C(n, r) = '+r[2]+' 에서 그 합을 빼세요.'};
     if(Math.abs(v-s)>0.5) return {ok:false, msg:'두 값이 다릅니다 — 화면을 다시 보세요.'};
     mem.ok2=true;
     return {ok:true, msg:'계산했습니다 — 차가 0 입니다. 다른 자리에서도 그럴까요?'};
   }}""",
 """  {t:'판단 — <b>다른 자리</b> 로 옮겨 다시 확인한 뒤 고르세요',
   f:'새 n = {0} · 새 r = {1} · C(n, r) − (위 두 수의 합) = {2}',
   opts:['한 사람을 정해 <b>「뽑는다 / 안 뽑는다」</b> 로 나누면 C(n,r) = C(n−1,r−1) + C(n−1,r) 가 된다',
         '파스칼 삼각형은 규칙 없이 외워야 하는 표다',
         '위 두 수를 더하는 것은 n 이 작을 때만 맞다'],
   chk(got, r, mem, pick){
     if(!mem.ok2) return {ok:false, msg:'② 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const n=noteNum(r[0]), rr=noteNum(r[1]), v=noteNum(r[2]), s=noteNum(r[4]);
     if(n===mem.n && rr===mem.r) return {ok:false, msg:'①과 같은 자리입니다 — n 이나 r 을 바꾸세요.'};
     if(!(n>=2 && rr>=1 && rr<=n-1)) return {ok:false, msg:'안쪽 자리로 옮기세요 (r 은 1 과 n−1 사이).'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-n)>0.5||Math.abs(got[1]-rr)>0.5)
       return {ok:false, msg:'지금은 n = '+r[0]+' · r = '+r[1]+' 입니다.'};
     if(Math.abs(got[2]-(v-s))>0.5) return {ok:false, msg:'C(n, r) = '+r[2]+' 에서 합 '+r[4]+' 를 빼세요.'};
     if(pick!==0)
       return {ok:false, msg:'자리를 옮겨도 차가 0 입니다. 왜 늘 그런지 「한 사람을 정해」 생각하고 다시 고르세요.'};
     return {ok:true, msg:'판단했습니다 — <b>파스칼 항등식</b> 입니다. 한 사람을 정해 놓고 그를 뽑는 경우 C(n−1, r−1) 과 안 뽑는 경우 C(n−1, r) 로 나누면 빠짐없이·겹침없이 세어집니다.'};
   }}""")
 +
 note(143, '내가 늘어놓고 · 내가 줄이고 · 내가 판단한다',
 """  {t:'기록 — <b>제한 없음</b> 상태로 두고 가짓수를 적으세요',
   f:'사탕 n = {0} · 사람 k = {1} · 가짓수 = {2}',
   chk(got, r, mem){
     if(!r) return {ok:false, msg:'아직 화면 값이 없습니다.'};
     if(String(r[2]).indexOf('제한')<0)
       return {ok:false, msg:'지금 «'+r[2]+'» 입니다. 「모두 1개 이상」 조건을 꺼 두세요.'};
     const n=noteNum(r[0]), k=noteNum(r[1]), c=noteNum(r[4]);
     if(!(n>=k)) return {ok:false, msg:'②에서 조건을 켜려면 사탕이 사람 수 이상이어야 합니다 — n 을 '+k+' 이상으로 올리세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-n)>0.5||Math.abs(got[1]-k)>0.5)
       return {ok:false, msg:'화면은 n = '+r[0]+' · k = '+r[1]+' 입니다.'};
     if(Math.abs(got[2]-c)>0.5) return {ok:false, msg:'가짓수는 '+r[4]+' 입니다 ('+r[3]+').'};
     mem.n=n; mem.k=k; mem.free=c;
     return {ok:true, msg:'기록했습니다 — 자리 '+(n+k-1)+'칸에서 칸막이 '+(k-1)+'칸을 고른 수입니다. 조건을 켜 봅시다.'};
   }}""",
 """  {t:'생각 — <b>「모두 1개 이상씩 받아야 함」</b> 을 켜고 다시 적으세요',
   f:'가짓수 = {0} · ①의 가짓수에서 빼면 = {1}',
   chk(got, r, mem){
     if(mem.n===undefined) return {ok:false, msg:'① 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     if(String(r[2]).indexOf('1개 이상')<0)
       return {ok:false, msg:'지금 «'+r[2]+'» 입니다. 조건을 켜세요.'};
     const n=noteNum(r[0]), k=noteNum(r[1]), c=noteNum(r[4]);
     if(n!==mem.n||k!==mem.k)
       return {ok:false, msg:'n 과 k 는 ①과 같게 두세요 (n = '+mem.n+', k = '+mem.k+') — 조건만 바꿉니다.'};
     if(![0,1].every(j=>isFinite(got[j]))) return {ok:false, msg:'두 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-c)>0.5) return {ok:false, msg:'가짓수는 '+r[4]+' 입니다.'};
     if(Math.abs(got[1]-(mem.free-c))>0.5) return {ok:false, msg:'①의 '+mem.free+' 에서 지금 값을 빼세요.'};
     mem.pos=c; mem.ok2=true;
     return {ok:true, msg:'계산했습니다 — 조건을 걸자 '+(mem.free-c)+'가지가 줄었습니다. 못 받는 사람이 있는 경우들입니다.'};
   }}""",
 """  {t:'판단 — 조건을 끄고 사탕 <b>5개</b>, 사람 <b>3명</b> 으로 맞춘 뒤 고르세요',
   f:'자리 칸 수 = {0} · 고르는 칸막이 수 = {1} · 가짓수 = {2}',
   opts:['★ n 개와 칸막이 (k−1) 개를 한 줄로 놓는 문제 — <b>C(n+k−1, k−1)</b>',
         '사탕이 똑같으니 가짓수는 사람 수와 같다',
         '순서가 있으므로 순열로 세어야 한다'],
   chk(got, r, mem, pick){
     if(!mem.ok2) return {ok:false, msg:'② 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     if(String(r[2]).indexOf('제한')<0) return {ok:false, msg:'조건을 다시 끄세요.'};
     const n=noteNum(r[0]), k=noteNum(r[1]), c=noteNum(r[4]);
     if(!(n===5&&k===3)) return {ok:false, msg:'지금 n = '+r[0]+' · k = '+r[1]+' 입니다. 5개와 3명으로 맞추세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-(n+k-1))>0.5) return {ok:false, msg:'★ '+n+'개와 칸막이 '+(k-1)+'개를 한 줄로 놓으면 자리가 몇 칸인가요?'};
     if(Math.abs(got[1]-(k-1))>0.5) return {ok:false, msg:'사람이 '+k+'명이면 칸막이는 몇 개인가요?'};
     if(Math.abs(got[2]-c)>0.5) return {ok:false, msg:'화면의 가짓수는 '+r[4]+' 입니다.'};
     if(pick!==0)
       return {ok:false, msg:'자리 '+(n+k-1)+'칸에서 칸막이 '+(k-1)+'칸을 고르니 '+r[4]+'가지였습니다. 다시 고르세요.'};
     return {ok:true, msg:'판단했습니다 — <b>같은 것을 나누는 문제는 「자리 고르기」로 바뀝니다.</b> ★ 와 칸막이를 한 줄로 늘어놓는 순간, 셀 수 없어 보이던 것이 조합 하나가 됩니다.'};
   }}""")
 +
 note(144, '내가 고르고 · 내가 나누고 · 내가 판단한다',
 """  {t:'기록 — 한 항을 정해 값을 적으세요',
   f:'n = {0} · c = {1} · r = {2} · C(n, r) = {3} · 계수 = {4}',
   chk(got, r, mem){
     if(!r) return {ok:false, msg:'아직 화면 값이 없습니다.'};
     const n=noteNum(r[0]), c=noteNum(r[1]), rr=noteNum(r[2]), nc=noteNum(r[3]), co=noteNum(r[4]);
     if(!(c>1)) return {ok:false, msg:'①은 c 를 2 이상으로 두고 적습니다 — c = 1 이면 계수와 C 가 같아져 비교가 되지 않습니다.'};
     if(!(rr>=1&&rr<=n)) return {ok:false, msg:'r 을 1 과 n 사이로 두세요 (지금 r = '+r[2]+', n = '+r[0]+').'};
     if(![0,1,2,3,4].every(j=>isFinite(got[j]))) return {ok:false, msg:'다섯 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-n)>0.5||Math.abs(got[1]-c)>0.5||Math.abs(got[2]-rr)>0.5)
       return {ok:false, msg:'화면은 n = '+r[0]+' · c = '+r[1]+' · r = '+r[2]+' 입니다.'};
     if(Math.abs(got[3]-nc)>0.5||Math.abs(got[4]-co)>0.5)
       return {ok:false, msg:'화면은 C(n,r) = '+r[3]+' · 계수 = '+r[4]+' 입니다.'};
     mem.n=n; mem.c=c; mem.r=rr; mem.nc=nc; mem.co=co;
     return {ok:true, msg:'기록했습니다 — C(n,r) 과 계수가 다릅니다. 얼마나 다를까요?'};
   }}""",
 """  {t:'생각 — <b>계수 ÷ C(n, r)</b> 를 구하세요',
   f:'계수 ÷ C(n, r) = {0} · 그 값은 c 의 몇 제곱인가 = {1}',
   chk(got, r, mem){
     if(mem.n===undefined) return {ok:false, msg:'① 칸을 먼저 통과하세요.'};
     if(![0,1].every(j=>isFinite(got[j]))) return {ok:false, msg:'두 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-mem.co/mem.nc)>0.02) return {ok:false, msg:'①의 계수 '+mem.co+' 를 C(n,r) = '+mem.nc+' 로 나누세요.'};
     if(Math.abs(got[1]-mem.r)>0.5) return {ok:false, msg:'나온 값이 '+mem.c+' 의 몇 제곱인가요? 지수를 적으세요.'};
     mem.ok2=true;
     return {ok:true, msg:'계산했습니다 — 계수 = C(n, r) × c^r 입니다. r 과 같은 지수가 붙었습니다.'};
   }}""",
 """  {t:'판단 — c 를 <b>1</b> 로 두고 r 을 <b>n − r</b> 로 바꾼 뒤 고르세요',
   f:'새 r = {0} · C(n, r) = {1} · 계수 = {2}',
   opts:['일반항은 <b>C(n, r)·cʳ·xⁿ⁻ʳ</b> — 괄호마다 x 또는 c 를 고르는 방법의 수가 곧 계수다',
         '계수는 늘 C(n, r) 와 같다',
         '전개해 보기 전에는 계수를 알 수 없다'],
   chk(got, r, mem, pick){
     if(!mem.ok2) return {ok:false, msg:'② 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const n=noteNum(r[0]), c=noteNum(r[1]), rr=noteNum(r[2]), nc=noteNum(r[3]), co=noteNum(r[4]);
     if(c!==1) return {ok:false, msg:'c 를 1 로 내리세요 (지금 '+r[1]+').'};
     if(n!==mem.n) return {ok:false, msg:'n 은 ①과 같은 '+mem.n+' 으로 두세요.'};
     if(rr!==mem.n-mem.r) return {ok:false, msg:'r 을 n − r = '+(mem.n-mem.r)+' 로 맞추세요 (지금 '+r[2]+').'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-rr)>0.5) return {ok:false, msg:'r 은 '+r[2]+' 입니다.'};
     if(Math.abs(got[1]-nc)>0.5||Math.abs(got[2]-co)>0.5)
       return {ok:false, msg:'지금은 C(n,r) = '+r[3]+' · 계수 = '+r[4]+' 입니다.'};
     if(pick!==0)
       return {ok:false, msg:'c = '+mem.c+' 일 때는 계수가 C 의 '+(mem.co/mem.nc)+'배였고, c = 1 이니 둘이 같아졌습니다. 다시 고르세요.'};
     return {ok:true, msg:'판단했습니다 — <b>C(n, r) = C(n, n−r)</b> 라서 c = 1 이면 계수가 좌우 대칭입니다. 계수는 「괄호 n 개에서 c 를 r 번 고르는 방법의 수 × cʳ」입니다.'};
   }}""")
 +
 note(145, '내가 떼고 · 내가 맞추고 · 내가 판단한다',
 """  {t:'기록 — 겹침을 <b>0</b> 으로 내려 보세요',
   f:'P(A) = {0} · P(B) = {1} · P(A)P(B) = {2}',
   chk(got, r, mem){
     if(!r) return {ok:false, msg:'아직 화면 값이 없습니다.'};
     if(String(r[4])!=='배반')
       return {ok:false, msg:'지금 «'+r[4]+'» 입니다. P(A∩B) 를 0 까지 내리세요.'};
     const a=noteNum(r[0]), b=noteNum(r[1]), ab=noteNum(r[3]);
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-a)>0.006||Math.abs(got[1]-b)>0.006)
       return {ok:false, msg:'화면은 P(A) = '+r[0]+' · P(B) = '+r[1]+' 입니다.'};
     if(Math.abs(got[2]-ab)>0.0006) return {ok:false, msg:'P(A)P(B) 는 '+r[3]+' 입니다.'};
     mem.a=a; mem.b=b; mem.ab=ab;
     return {ok:true, msg:'기록했습니다 — 겹침은 0 인데 곱은 '+r[3]+' 입니다. 둘이 다릅니다.'};
   }}""",
 """  {t:'생각 — 겹침을 <b>P(A)P(B) 와 같게</b> 맞춰 보세요',
   f:'P(A∩B) = {0} · P(A)P(B) = {1} · 두 값의 차 = {2}',
   chk(got, r, mem){
     if(mem.a===undefined) return {ok:false, msg:'① 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     if(String(r[4])!=='독립')
       return {ok:false, msg:'아직 «'+r[4]+'» 입니다. 겹침을 곱 '+r[3]+' 에 맞추세요 (P(A)·P(B) 를 눈금에 맞게 고쳐도 됩니다).'};
     const i=noteNum(r[2]), ab=noteNum(r[3]);
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-i)>0.006||Math.abs(got[1]-ab)>0.0006)
       return {ok:false, msg:'화면은 '+r[2]+' 와 '+r[3]+' 입니다.'};
     if(Math.abs(got[2])>0.008) return {ok:false, msg:'두 값을 빼 보세요. 거의 0 이어야 합니다.'};
     mem.ok2=true;
     return {ok:true, msg:'계산했습니다 — 이제 독립입니다. 그런데 이때 겹침은 0 이 아닙니다.'};
   }}""",
 """  {t:'판단 — P(A) 를 바꿔 <b>둘 다 아닌</b> 상태로 만든 뒤 고르세요',
   f:'P(A∩B) = {0} · P(A)P(B) = {1}',
   opts:['배반은 <b>겹침이 0</b>, 독립은 <b>겹침이 곱과 같다</b> — 둘 다 되려면 한쪽 확률이 0 이어야 한다',
         '배반이면 자동으로 독립이다',
         '겹치기만 하면 독립이 아니다'],
   chk(got, r, mem, pick){
     if(!mem.ok2) return {ok:false, msg:'② 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     if(String(r[4])!=='둘 다 아님')
       return {ok:false, msg:'지금 «'+r[4]+'» 입니다. P(A) 를 조금 움직여 겹침이 0 도 아니고 곱과도 다르게 만드세요.'};
     const i=noteNum(r[2]), ab=noteNum(r[3]);
     if(![0,1].every(j=>isFinite(got[j]))) return {ok:false, msg:'두 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-i)>0.006||Math.abs(got[1]-ab)>0.0006)
       return {ok:false, msg:'지금은 '+r[2]+' 와 '+r[3]+' 입니다.'};
     if(pick!==0)
       return {ok:false, msg:'①에서는 겹침 0 인데 곱이 '+mem.ab+' 였고, ②에서는 겹침이 곱과 같았습니다. 두 낱말이 보는 것이 다릅니다. 다시 고르세요.'};
     return {ok:true, msg:'판단했습니다 — <b>배반은 「같이 못 일어난다」, 독립은 「서로 알려 주는 것이 없다」.</b> 배반이면 A 가 일어났다는 말이 B 가 안 일어났음을 알려 주므로 오히려 <b>강하게 영향을 주는</b> 사이입니다.'};
   }}""")
 +
 note(146, '내가 뿌리고 · 내가 재고 · 내가 판단한다',
 """  {t:'기록 — t 를 정하고 <b>1000번 실험</b> 을 돌려 적으세요',
   f:'t = {0} · 이론값(%) = {1} · 실험값(%) = {2}',
   chk(got, r, mem){
     if(!r) return {ok:false, msg:'아직 화면 값이 없습니다.'};
     const t=noteNum(r[0]), p=noteNum(r[1]), cnt=noteNum(r[2]), s=noteNum(r[3]);
     if(!(cnt>=100)) return {ok:false, msg:'아직 실험을 돌리지 않았습니다 — 「1000번 실험해 보기」를 누르세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-t)>0.5) return {ok:false, msg:'t 는 '+r[0]+' 입니다.'};
     if(Math.abs(got[1]-p)>0.06||Math.abs(got[2]-s)>0.06)
       return {ok:false, msg:'화면은 이론값 '+r[1]+' · 실험값 '+r[3]+' 입니다.'};
     mem.t=t; mem.p=p;
     return {ok:true, msg:'기록했습니다 — 이론값과 실험값이 가깝습니다. 이제 t 를 두 배로 해 봅시다.'};
   }}""",
 """  {t:'생각 — t 를 <b>두 배</b> 로 하고 이론값을 다시 적으세요',
   f:'새 t = {0} · 이론값(%) = {1} · ①의 이론값의 두 배와의 차 = {2}',
   chk(got, r, mem){
     if(mem.t===undefined) return {ok:false, msg:'① 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const t=noteNum(r[0]), p=noteNum(r[1]);
     if(Math.abs(t-2*mem.t)>0.5)
       return {ok:false, msg:'t 를 ①의 두 배인 '+(2*mem.t)+'분으로 맞추세요 (지금 '+r[0]+').'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-t)>0.5||Math.abs(got[1]-p)>0.06)
       return {ok:false, msg:'지금은 t = '+r[0]+' · 이론값 '+r[1]+' 입니다.'};
     if(Math.abs(got[2]-(p-2*mem.p))>0.12) return {ok:false, msg:'①의 이론값 '+mem.p+' 의 두 배에서 지금 값을 빼 보세요 (부호 그대로).'};
     mem.ok2=true;
     return {ok:true, msg:'계산했습니다 — t 를 두 배로 했는데 확률은 두 배가 되지 않았습니다. 넓이이기 때문입니다.'};
   }}""",
 """  {t:'판단 — t 를 <b>10분</b> 으로 맞춘 뒤 고르세요',
   f:'이론값(%) = {0} · 못 만나는 두 삼각형의 넓이 합 ÷ 3600 = {1}',
   opts:['셀 수 없이 많은 경우는 <b>넓이의 비</b> 로 센다 — 못 만나는 두 삼각형을 빼는 것이 빠르다',
         't 를 두 배로 하면 확률도 두 배가 된다',
         '경우가 무한하므로 확률을 구할 수 없다'],
   chk(got, r, mem, pick){
     if(!mem.ok2) return {ok:false, msg:'② 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const t=noteNum(r[0]), p=noteNum(r[1]);
     if(t!==10) return {ok:false, msg:'t 를 10분으로 맞추세요 (지금 '+r[0]+').'};
     if(![0,1].every(j=>isFinite(got[j]))) return {ok:false, msg:'두 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-p)>0.06) return {ok:false, msg:'이론값은 '+r[1]+' 입니다.'};
     if(Math.abs(got[1]-(1-p/100))>0.01)
       return {ok:false, msg:'두 삼각형은 밑변·높이가 모두 50 입니다. 넓이 합을 3600 으로 나누면 1 − '+(p/100).toFixed(4)+' 가 나와야 합니다.'};
     if(pick!==0)
       return {ok:false, msg:'t = '+mem.t+' 에서 '+mem.p+'%, 두 배인 '+(2*mem.t)+' 에서도 두 배가 아니었습니다. 왜일까요? 다시 고르세요.'};
     return {ok:true, msg:'판단했습니다 — <b>기하적 확률은 길이·넓이·부피의 비</b> 입니다. 띠가 넓어지는 속도가 t 에 비례하지 않으므로 확률도 t 에 비례하지 않습니다.'};
   }}""")
 +
 note(147, '내가 세고 · 내가 바꾸고 · 내가 판단한다',
 """  {t:'기록 — 유병률을 <b>낮게</b> 두고 두 수를 적으세요',
   f:'가짜 양성 = {0} · P(환자 | 양성) (%) = {1}',
   chk(got, r, mem){
     if(!r) return {ok:false, msg:'아직 화면 값이 없습니다.'};
     const per=noteNum(r[0]), fp=noteNum(r[3]), pv=noteNum(r[4]);
     if(!(pv<50.5)) return {ok:false, msg:'지금 P(환자|양성) 이 '+r[4]+' 입니다. 유병률을 더 내려 절반 아래로 만드세요.'};
     if(![0,1].every(j=>isFinite(got[j]))) return {ok:false, msg:'두 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-fp)>0.15||Math.abs(got[1]-pv)>0.15)
       return {ok:false, msg:'화면은 가짜 양성 '+r[3]+' · '+r[4]+' 입니다.'};
     mem.per=per; mem.pv=pv; mem.spec=noteNum(r[2]);
     return {ok:true, msg:'기록했습니다 — 정확도가 높은데도 양성의 절반 넘게가 가짜입니다. 무엇을 바꾸면 달라질까요?'};
   }}""",
 """  {t:'생각 — <b>유병률만</b> 올려 다시 적으세요',
   f:'새 유병률 = {0} · P(환자 | 양성) (%) = {1} · ①보다 올랐으면 1, 아니면 0 → {2}',
   chk(got, r, mem){
     if(mem.per===undefined) return {ok:false, msg:'① 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const per=noteNum(r[0]), pv=noteNum(r[4]);
     if(!(per > mem.per)) return {ok:false, msg:'유병률이 '+r[0]+' 입니다. ①의 '+mem.per+' 보다 올리세요.'};
     if(Math.abs(noteNum(r[2])-mem.spec)>0.5)
       return {ok:false, msg:'특이도는 ①과 같은 '+mem.spec+'% 로 두세요 — 한 번에 하나만 바꿉니다.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-per)>0.5||Math.abs(got[1]-pv)>0.15)
       return {ok:false, msg:'지금은 유병률 '+r[0]+' · '+r[4]+' 입니다.'};
     if(Math.abs(got[2]-(pv>mem.pv?1:0))>0.01) return {ok:false, msg:'①의 '+mem.pv+'% 와 견주어 보세요.'};
     mem.pv2=pv; mem.ok2=true;
     return {ok:true, msg:'계산했습니다 — 같은 검사인데 신뢰도가 달라졌습니다. 검사가 바뀐 것이 아닙니다.'};
   }}""",
 """  {t:'판단 — 이번에는 <b>특이도</b> 를 올려 보고 고르세요',
   f:'새 특이도(%) = {0} · 가짜 양성 = {1} · P(환자 | 양성) (%) = {2}',
   opts:['양성의 수는 <b>두 모집단의 크기</b> 에 좌우된다 — 건강한 사람이 훨씬 많으면 1%의 실수도 사람 수로는 크다',
         '검사의 정확도가 99% 면 양성일 때 환자일 확률도 99% 다',
         '유병률은 검사 결과와 아무 상관이 없다'],
   chk(got, r, mem, pick){
     if(!mem.ok2) return {ok:false, msg:'② 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const sp=noteNum(r[2]), fp=noteNum(r[3]), pv=noteNum(r[4]);
     if(!(sp > mem.spec)) return {ok:false, msg:'특이도가 '+r[2]+' 입니다. ①의 '+mem.spec+'% 보다 올리세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-sp)>0.5) return {ok:false, msg:'특이도는 '+r[2]+' 입니다.'};
     if(Math.abs(got[1]-fp)>0.15||Math.abs(got[2]-pv)>0.15)
       return {ok:false, msg:'지금은 가짜 양성 '+r[3]+' · '+r[4]+' 입니다.'};
     if(pick!==0)
       return {ok:false, msg:'유병률만 올렸을 때 '+mem.pv+'% → '+mem.pv2+'%, 특이도를 올리니 '+r[4]+' 가 되었습니다. 무엇이 사람 수를 좌우했나요? 다시 고르세요.'};
     return {ok:true, msg:'판단했습니다 — <b>P(환자 | 양성) 은 검사 성능만으로 정해지지 않습니다.</b> 분모가 「진짜 양성 + 가짜 양성」이고, 가짜 양성은 훨씬 큰 건강한 집단에서 나오기 때문입니다 — 베이즈 정리가 말하는 것이 이것입니다.'};
   }}""")
 +
 note(148, '내가 적고 · 내가 기대하고 · 내가 판단한다',
 """  {t:'기록 — 네 칸을 기울여 <b>χ² 를 크게</b> 만들어 적으세요',
   f:'a = {0} · b = {1} · χ² = {2}',
   chk(got, r, mem){
     if(!r) return {ok:false, msg:'아직 화면 값이 없습니다.'};
     const a=noteNum(r[0]), b=noteNum(r[1]), c=noteNum(r[2]), d=noteNum(r[3]), x=noteNum(r[4]);
     if(!(x>3.84)) return {ok:false, msg:'지금 χ² 가 '+r[4]+' 입니다. 네 칸을 더 기울여 3.84 를 넘겨 보세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-a)>0.5||Math.abs(got[1]-b)>0.5)
       return {ok:false, msg:'화면은 a = '+r[0]+' · b = '+r[1]+' 입니다.'};
     if(Math.abs(got[2]-x)>0.004) return {ok:false, msg:'χ² 는 '+r[4]+' 입니다.'};
     mem.a=a; mem.b=b; mem.c=c; mem.d=d; mem.x=x;
     return {ok:true, msg:'기록했습니다 — 관측이 기대에서 많이 벗어났습니다. 그 「기대」가 무엇인지 직접 구해 봅시다.'};
   }}""",
 """  {t:'생각 — 첫 칸(a)의 <b>기대도수</b> 를 손으로 구하세요',
   f:'행 합 = {0} · 열 합 = {1} · 전체 = {2} · 기대도수 = {3}',
   chk(got, r, mem){
     if(mem.a===undefined) return {ok:false, msg:'① 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const a=noteNum(r[0]), b=noteNum(r[1]), c=noteNum(r[2]), d=noteNum(r[3]);
     const n=a+b+c+d, col=a+b, row=a+c, E=col*row/n;
     if(![0,1,2,3].every(j=>isFinite(got[j]))) return {ok:false, msg:'네 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-row)>0.5&&Math.abs(got[0]-col)>0.5)
       return {ok:false, msg:'a 가 든 가로줄의 합은 a + c = '+row+' 입니다.'};
     if(Math.abs(got[1]-col)>0.5&&Math.abs(got[1]-row)>0.5)
       return {ok:false, msg:'a 가 든 세로줄의 합은 a + b = '+col+' 입니다.'};
     if(Math.abs(got[2]-n)>0.5) return {ok:false, msg:'전체는 '+n+'명입니다.'};
     if(Math.abs(got[3]-E)>0.1) return {ok:false, msg:'행 합 × 열 합 ÷ 전체 를 구하세요.'};
     mem.E=E; mem.ok2=true;
     return {ok:true, msg:'계산했습니다 — 관측 '+a+' 에 견주어 기대는 '+E.toFixed(1)+' 입니다. 차이가 '+(a-E).toFixed(1)+' 이군요.'};
   }}""",
 """  {t:'판단 — <b>「독립이 되도록 맞춰 주기」</b> 를 누른 뒤 고르세요',
   f:'맞춘 뒤 a = {0} · χ² = {1}',
   opts:['독립이면 <b>P(A∩B) = P(A)P(B)</b> — 사람 수로 고치면 기대도수 = 행 합 × 열 합 ÷ 전체 다',
         'χ² 가 0 이 아니면 반드시 관계가 있다',
         '네 칸의 수만 보면 독립인지 바로 알 수 있다'],
   chk(got, r, mem, pick){
     if(!mem.ok2) return {ok:false, msg:'② 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const a=noteNum(r[0]), x=noteNum(r[4]);
     if(!(x < mem.x && x < 2))
       return {ok:false, msg:'χ² 가 '+r[4]+' 입니다 — 「독립이 되도록 맞춰 주기」를 눌러 0 가까이 내리세요.'};
     if(![0,1].every(j=>isFinite(got[j]))) return {ok:false, msg:'두 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-a)>0.5) return {ok:false, msg:'a 는 '+r[0]+' 입니다.'};
     if(Math.abs(got[1]-x)>0.004) return {ok:false, msg:'χ² 는 '+r[4]+' 입니다.'};
     if(pick!==0)
       return {ok:false, msg:'기울였을 때 χ² 가 '+mem.x.toFixed(2)+' 였고, 기대도수에 맞추니 '+r[4]+' 가 되었습니다. 그 기대도수는 무엇에서 나왔나요? 다시 고르세요.'};
     return {ok:true, msg:'판단했습니다 — <b>χ² 는 「관측이 기대에서 얼마나 벗어났나」를 한 수로 모은 것</b> 입니다. 0 에 가까우면 독립이라고 볼 만하고, 크면 두 항목이 서로 관계있다고 볼 근거가 됩니다.'};
   }}""")
 +
 note(149, '내가 재고 · 내가 곱하고 · 내가 판단한다',
 """  {t:'기록 — 지금 확률과 손해액으로 기댓값을 적으세요',
   f:'손해액 = {0} · 기댓값 = {1}',
   chk(got, r, mem){
     if(!r) return {ok:false, msg:'아직 화면 값이 없습니다.'};
     const pr=noteNum(r[0]), loss=noteNum(r[1]), E=noteNum(r[2]);
     if(!(pr>0)) return {ok:false, msg:'사고가 날 확률을 0 보다 크게 올리세요.'};
     if(![0,1].every(j=>isFinite(got[j]))) return {ok:false, msg:'두 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-loss)>0.5) return {ok:false, msg:'손해액은 '+r[1]+'만원입니다.'};
     if(Math.abs(got[1]-E)>0.02) return {ok:false, msg:'기댓값은 '+r[2]+'만원입니다.'};
     mem.pr=pr; mem.loss=loss; mem.E=E;
     return {ok:true, msg:'기록했습니다 — 확률 '+r[0]+' 와 손해액 '+r[1]+'만원이 만든 값입니다. 손해액을 두 배로 하면 어떻게 될까요?'};
   }}""",
 """  {t:'생각 — <b>손해액을 두 배</b> 로 하고 기댓값을 다시 적으세요',
   f:'새 손해액 = {0} · 기댓값 = {1} · ①의 기댓값의 두 배와의 차 = {2}',
   chk(got, r, mem){
     if(mem.pr===undefined) return {ok:false, msg:'① 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const pr=noteNum(r[0]), loss=noteNum(r[1]), E=noteNum(r[2]);
     if(Math.abs(pr-mem.pr)>0.05) return {ok:false, msg:'확률은 ①과 같은 '+mem.pr+'% 로 두세요 — 손해액만 바꿉니다.'};
     if(Math.abs(loss-2*mem.loss)>1) return {ok:false, msg:'손해액을 ①의 두 배인 '+(2*mem.loss)+'만원으로 맞추세요 (지금 '+r[1]+').'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-loss)>0.5||Math.abs(got[1]-E)>0.02)
       return {ok:false, msg:'지금은 손해액 '+r[1]+' · 기댓값 '+r[2]+' 입니다.'};
     if(Math.abs(got[2]-(E-2*mem.E))>0.05) return {ok:false, msg:'①의 기댓값 '+mem.E+' 의 두 배에서 지금 값을 빼 보세요.'};
     mem.ok2=true;
     return {ok:true, msg:'계산했습니다 — 차가 0 입니다. 기댓값은 손해액에 정비례합니다.'};
   }}""",
 """  {t:'판단 — 보험료를 <b>기댓값과 거의 같게</b> 맞춘 뒤 고르세요',
   f:'보험료 = {0} · 기댓값 = {1} · 차액 = {2}',
   opts:['E(X) = Σ x·P(x) — <b>많이 반복했을 때의 평균</b> 이므로, 계약이 많아질수록 실제 평균이 여기에 다가간다',
         '기댓값은 이번에 실제로 잃을 금액이다',
         '보험료는 손해액과 같게 매겨야 한다'],
   chk(got, r, mem, pick){
     if(!mem.ok2) return {ok:false, msg:'② 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const fee=noteNum(r[3]), E=noteNum(r[2]), m=noteNum(r[4]);
     if(!(Math.abs(m)<0.5))
       return {ok:false, msg:'차액이 '+r[4]+'만원입니다. 보험료를 기댓값 '+r[2]+'만원에 더 가깝게 맞추세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-fee)>0.5||Math.abs(got[1]-E)>0.02)
       return {ok:false, msg:'지금은 보험료 '+r[3]+' · 기댓값 '+r[2]+' 입니다.'};
     if(Math.abs(got[2]-m)>0.02) return {ok:false, msg:'차액은 '+r[4]+' 입니다.'};
     if(pick!==0)
       return {ok:false, msg:'손해액을 두 배로 했을 때 기댓값도 꼭 두 배였습니다. 기댓값이 「이번 한 번」을 말하는 것일까요? 다시 고르세요.'};
     return {ok:true, msg:'판단했습니다 — <b>기댓값은 한 번의 결과가 아니라 긴 평균</b> 입니다. 보험이 성립하는 까닭이 여기에 있습니다 — 한 사람에게는 도박이지만, 수만 건을 모으면 평균은 기댓값에 아주 가까워집니다.'};
   }}""")
 +
 note(150, '내가 벌리고 · 내가 제곱하고 · 내가 판단한다',
 """  {t:'기록 — 두 반의 흩어짐을 <b>아주 다르게</b> 벌려 적으세요',
   f:'A 분산 = {0} · B 분산 = {1} · 표준편차 차 = {2}',
   chk(got, r, mem){
     if(!r) return {ok:false, msg:'아직 화면 값이 없습니다.'};
     const sa=noteNum(r[0]), sb=noteNum(r[1]), va=noteNum(r[2]), vb=noteNum(r[3]), ds=noteNum(r[4]);
     if(!(Math.abs(va-vb)>50)) return {ok:false, msg:'두 분산의 차가 아직 작습니다 ('+r[2]+' 와 '+r[3]+'). 더 벌려 보세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-va)>0.02||Math.abs(got[1]-vb)>0.02)
       return {ok:false, msg:'화면은 A 분산 '+r[2]+' · B 분산 '+r[3]+' 입니다.'};
     if(Math.abs(got[2]-ds)>0.02) return {ok:false, msg:'표준편차 차는 '+r[4]+' 입니다.'};
     mem.sa=sa; mem.va=va;
     return {ok:true, msg:'기록했습니다 — 평균은 같은데 분산은 이렇게 다릅니다. A반의 흩어짐을 두 배로 해 봅시다.'};
   }}""",
 """  {t:'생각 — <b>A반의 흩어짐을 두 배</b> 로 하고 분산을 다시 적으세요',
   f:'새 A 흩어짐 = {0} · A 분산 = {1} · ①의 A 분산의 몇 배인가 = {2}',
   chk(got, r, mem){
     if(mem.sa===undefined) return {ok:false, msg:'① 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const sa=noteNum(r[0]), va=noteNum(r[2]);
     if(Math.abs(sa-2*mem.sa)>0.5)
       return {ok:false, msg:'A반 흩어짐을 ①의 두 배인 '+(2*mem.sa)+' 로 맞추세요 (지금 '+r[0]+').'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-sa)>0.5||Math.abs(got[1]-va)>0.02)
       return {ok:false, msg:'지금은 흩어짐 '+r[0]+' · A 분산 '+r[2]+' 입니다.'};
     if(Math.abs(got[2]-va/mem.va)>0.12) return {ok:false, msg:'①의 A 분산 '+mem.va+' 로 지금 분산을 나누어 보세요.'};
     mem.ok2=true;
     return {ok:true, msg:'계산했습니다 — 흩어짐을 두 배로 했더니 분산은 네 배입니다. 제곱해서 평균 냈기 때문입니다.'};
   }}""",
 """  {t:'판단 — <b>「둘을 같게」</b> 를 누른 뒤 고르세요',
   f:'A 분산 = {0} · B 분산 = {1} · 표준편차 차 = {2}',
   opts:['편차의 합은 늘 0 이라 <b>제곱해서 평균</b> 낸 것이 분산이고, 그 제곱근이 자료와 단위가 같은 표준편차다',
         '분산과 표준편차는 단위가 같다',
         '평균이 같으면 두 자료는 같은 자료다'],
   chk(got, r, mem, pick){
     if(!mem.ok2) return {ok:false, msg:'② 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const va=noteNum(r[2]), vb=noteNum(r[3]), ds=noteNum(r[4]);
     if(!(Math.abs(va-vb)<0.05))
       return {ok:false, msg:'두 분산이 아직 다릅니다 ('+r[2]+' 와 '+r[3]+'). 「둘을 같게」를 누르세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-va)>0.02||Math.abs(got[1]-vb)>0.02)
       return {ok:false, msg:'지금은 '+r[2]+' 와 '+r[3]+' 입니다.'};
     if(Math.abs(got[2]-ds)>0.02) return {ok:false, msg:'표준편차 차는 '+r[4]+' 입니다.'};
     if(pick!==0)
       return {ok:false, msg:'흩어짐을 두 배로 하니 분산이 네 배가 되었습니다. 왜 그랬을까요? 다시 고르세요.'};
     return {ok:true, msg:'판단했습니다 — <b>평균은 가운데를, 표준편차는 퍼짐을 말합니다.</b> 둘을 함께 보아야 자료가 보입니다 — 같은 평균점수라도 「고르게 잘하는 반」과 「잘하는 사람과 못하는 사람이 섞인 반」은 전혀 다른 수업이 필요합니다.'};
   }}""")
)
