# -*- coding: utf-8 -*-
"""LAB 311~320 탐구 노트 — 기록 → 생각 → 판단. 판정은 화면의 read() 값으로만 한다."""


def note(no, head, c1, c2, c3):
    return "\n %d:{ h:'%s',\n  c:[\n%s,\n%s,\n%s\n ]},\n" % (no, head, c1, c2, c3)


NOTES = (
 note(311, '내가 고르고 · 내가 견주고 · 내가 판단한다',
 """  {t:'기록 — <b>최댓값이 없는 집합</b> 을 고르고 적으세요',
   f:'최댓값이 있으면 1, 없으면 0 → {0} · 상한 = {1}',
   chk(got, r, mem){
     if(!r) return {ok:false, msg:'아직 화면 값이 없습니다.'};
     const sup=noteNum(r[2]);
     if(String(r[1])!=='없음') return {ok:false, msg:'지금 집합은 최댓값이 '+r[1]+' 입니다 — 최댓값이 없는 집합을 고르세요.'};
     if(!isFinite(sup)) return {ok:false, msg:'상한도 없는 집합입니다 — 상한이 있는 집합으로 고르세요.'};
     if(![0,1].every(j=>isFinite(got[j]))) return {ok:false, msg:'두 칸을 모두 채우세요.'};
     if(Math.abs(got[0])>0.1) return {ok:false, msg:'최댓값이 «'+r[1]+'» 이므로 0 입니다.'};
     if(Math.abs(got[1]-sup)>0.02) return {ok:false, msg:'상한은 '+r[2]+' 입니다.'};
     mem.sup1=sup;
     return {ok:true, msg:'기록했습니다 — 최댓값은 없는데 상한은 '+r[2]+' 입니다.'};
   }}""",
 """  {t:'생각 — <b>닫힌 집합(0 이상 1 이하)</b> 으로 바꾸고 적으세요',
   f:'최댓값이 있으면 1, 없으면 0 → {0} · 상한 = {1}',
   chk(got, r, mem){
     if(mem.sup1===undefined) return {ok:false, msg:'① 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const mx=noteNum(r[1]), sup=noteNum(r[2]);
     if(!isFinite(mx)) return {ok:false, msg:'아직 최댓값이 «'+r[1]+'» 입니다 — 닫힌 집합으로 바꾸세요.'};
     if(![0,1].every(j=>isFinite(got[j]))) return {ok:false, msg:'두 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-1)>0.1) return {ok:false, msg:'최댓값이 '+r[1]+' 이므로 1 입니다.'};
     if(Math.abs(got[1]-sup)>0.02) return {ok:false, msg:'상한은 '+r[2]+' 입니다.'};
     mem.sup2=sup; mem.ok2=true;
     return {ok:true, msg:'계산했습니다 — 닫혀 있으니 상한이 곧 최댓값입니다.'};
   }}""",
 """  {t:'판단 — 두 상한을 나란히 두고 고르세요',
   f:'①의 상한 = {0} · ②의 상한 = {1} · 상한이 집합에 들어 있으면 그것이 최댓값이면 1 → {2}',
   opts:['상한은 <b>울타리 가운데 가장 작은 것</b> 이다 — 최댓값은 집합 안에 있어야 하지만 상한은 밖에 있어도 되고, 상한이 집합에 들어 있을 때만 그것이 최댓값이 된다',
         '최댓값이 없으면 상한도 없다',
         '상한은 집합 안에 반드시 들어 있다'],
   chk(got, r, mem, pick){
     if(!mem.ok2) return {ok:false, msg:'② 칸을 먼저 통과하세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-mem.sup1)>0.02) return {ok:false, msg:'①에 적은 '+mem.sup1+' 입니다.'};
     if(Math.abs(got[1]-mem.sup2)>0.02) return {ok:false, msg:'②에 적은 '+mem.sup2+' 입니다.'};
     if(Math.abs(got[2]-1)>0.1) return {ok:false, msg:'닫힌 집합에서는 상한이 최댓값이었습니다.'};
     if(pick!==0)
       return {ok:false, msg:'두 집합의 상한은 같았는데 한쪽만 최댓값이었습니다. 무엇이 달랐을까요? 다시 고르세요.'};
     return {ok:true, msg:'판단했습니다 — <b>상한은 가장 작은 울타리입니다.</b> 실수에서는 위로 유계인 집합에 상한이 반드시 있고(완비성), 이것이 극한과 적분의 바탕이 됩니다.'};
   }}""")
 +
 note(312, '내가 좁히고 · 내가 더 좁히고 · 내가 판단한다',
 """  {t:'기록 — <b>서너 번</b> 좁힌 뒤 두 끝을 적으세요',
   f:'좁힌 횟수 = {0} · 아래끝 = {1} · 위끝 = {2}',
   chk(got, r, mem){
     if(!r) return {ok:false, msg:'아직 화면 값이 없습니다.'};
     const n=noteNum(r[0]), a=noteNum(r[1]), b=noteNum(r[2]);
     if(!(n>=3&&n<=8)) return {ok:false, msg:'좁힌 횟수가 '+r[0]+' 입니다 — 3~8 번으로 두세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-n)>0.5) return {ok:false, msg:'좁힌 횟수는 '+r[0]+' 입니다.'};
     if(Math.abs(got[1]-a)>0.002) return {ok:false, msg:'아래끝은 '+r[1]+' 입니다.'};
     if(Math.abs(got[2]-b)>0.002) return {ok:false, msg:'위끝은 '+r[2]+' 입니다.'};
     mem.a1=a; mem.n1=n;
     return {ok:true, msg:'기록했습니다 — 두 끝 모두 유리수입니다. 더 좁혀 봅시다.'};
   }}""",
 """  {t:'생각 — <b>12 번 이상</b> 좁히고 다시 적으세요',
   f:'좁힌 횟수 = {0} · 아래끝 = {1} · 위끝 = {2}',
   chk(got, r, mem){
     if(mem.a1===undefined) return {ok:false, msg:'① 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const n=noteNum(r[0]), a=noteNum(r[1]), b=noteNum(r[2]);
     if(!(n>=12)) return {ok:false, msg:'좁힌 횟수가 '+r[0]+' 입니다 — 12 번 이상으로 늘리세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-n)>0.5) return {ok:false, msg:'좁힌 횟수는 '+r[0]+' 입니다.'};
     if(Math.abs(got[1]-a)>0.002) return {ok:false, msg:'아래끝은 '+r[1]+' 입니다.'};
     if(Math.abs(got[2]-b)>0.002) return {ok:false, msg:'위끝은 '+r[2]+' 입니다.'};
     mem.a2=a; mem.ok2=true;
     return {ok:true, msg:'계산했습니다 — 구간이 한없이 좁아졌는데도 두 끝은 여전히 유리수입니다.'};
   }}""",
 """  {t:'판단 — 두 아래끝을 나란히 두고 고르세요',
   f:'①의 아래끝 = {0} · ②의 아래끝 = {1} · 두 끝 사이에 남는 수가 유리수이면 1, 아니면 0 → {2}',
   opts:['두 끝이 모두 유리수라도 <b>그 사이에 남는 점은 유리수가 아닐 수 있다</b> — 유리수만 있는 세계에는 그 자리에 구멍이 있고, 그 구멍을 메운 것이 실수다',
         '두 끝이 유리수이면 사이의 점도 반드시 유리수다',
         '구간을 충분히 좁히면 언젠가 √2 에 정확히 닿는다'],
   chk(got, r, mem, pick){
     if(!mem.ok2) return {ok:false, msg:'② 칸을 먼저 통과하세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-mem.a1)>0.002) return {ok:false, msg:'①에 적은 '+mem.a1+' 입니다.'};
     if(Math.abs(got[1]-mem.a2)>0.002) return {ok:false, msg:'②에 적은 '+mem.a2+' 입니다.'};
     if(Math.abs(got[2])>0.1) return {ok:false, msg:'남는 수는 √2 — 유리수가 아닙니다.'};
     if(pick!==0)
       return {ok:false, msg:'끝없이 좁혀도 두 끝은 유리수였고, 남는 점은 √2 였습니다. 무엇을 뜻할까요? 다시 고르세요.'};
     return {ok:true, msg:'판단했습니다 — <b>유리수에는 구멍이 있습니다.</b> 좁혀 가는 구간에 반드시 한 점이 남는다는 것(완비성)이 실수를 실수이게 합니다.'};
   }}""")
 +
 note(313, '내가 받고 · 내가 찾고 · 내가 판단한다',
 """  {t:'기록 — <b>통하는 δ</b> 를 하나 찾아 적으세요',
   f:'ε = {0} · δ = {1} · 최대 오차 = {2}',
   chk(got, r, mem){
     if(!r) return {ok:false, msg:'아직 화면 값이 없습니다.'};
     const e=noteNum(r[0]), d=noteNum(r[1]), w=noteNum(r[2]);
     if(String(r[3])!=='통함') return {ok:false, msg:'지금은 «'+r[3]+'» 입니다 — δ 를 줄여 통하게 하세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-e)>0.02) return {ok:false, msg:'ε 은 '+r[0]+' 입니다.'};
     if(Math.abs(got[1]-d)>0.02) return {ok:false, msg:'δ 는 '+r[1]+' 입니다.'};
     if(Math.abs(got[2]-w)>0.02) return {ok:false, msg:'최대 오차는 '+r[2]+' 입니다.'};
     mem.e1=e; mem.d1=d;
     return {ok:true, msg:'기록했습니다 — 최대 오차 '+r[2]+' 가 ε 안에 들어왔습니다.'};
   }}""",
 """  {t:'생각 — <b>ε 을 0.15 아래</b> 로 줄이고 통하는 δ 를 다시 찾으세요',
   f:'ε = {0} · δ = {1} · δ ÷ ε = {2}',
   chk(got, r, mem){
     if(mem.e1===undefined) return {ok:false, msg:'① 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const e=noteNum(r[0]), d=noteNum(r[1]);
     if(!(e<=0.15)) return {ok:false, msg:'ε 이 '+r[0]+' 입니다 — 0.15 아래로 줄이세요.'};
     if(String(r[3])!=='통함') return {ok:false, msg:'지금은 «'+r[3]+'» 입니다 — δ 를 더 줄이세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-e)>0.02) return {ok:false, msg:'ε 은 '+r[0]+' 입니다.'};
     if(Math.abs(got[1]-d)>0.02) return {ok:false, msg:'δ 는 '+r[1]+' 입니다.'};
     if(Math.abs(got[2]-d/e)>0.15) return {ok:false, msg:'δ 를 ε 으로 나누면 얼마인가요?'};
     mem.e2=e; mem.d2=d; mem.ok2=true;
     return {ok:true, msg:'계산했습니다 — ε 이 작아져도 그에 맞춰 δ 를 줄이면 됩니다.'};
   }}""",
 """  {t:'판단 — 두 ε 을 나란히 두고 고르세요',
   f:'①의 ε = {0} · ②의 ε = {1} · ε = 0.08 일 때 통하는 δ 의 최댓값 = {2}',
   opts:['연속은 <b>「어떤 ε 에도 δ 가 있다」</b> 는 말이다 — f(x) = 2x 에서는 δ = ε/2 로 잡으면 언제나 통하고, δ 를 고정해 두면 ε 을 줄이는 순간 무너진다',
         'δ 를 충분히 작게 한 번만 정해 두면 모든 ε 에 통한다',
         'ε 이 작아지면 δ 를 키워야 한다'],
   chk(got, r, mem, pick){
     if(!mem.ok2) return {ok:false, msg:'② 칸을 먼저 통과하세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-mem.e1)>0.02) return {ok:false, msg:'①에 적은 '+mem.e1+' 입니다.'};
     if(Math.abs(got[1]-mem.e2)>0.02) return {ok:false, msg:'②에 적은 '+mem.e2+' 입니다.'};
     if(Math.abs(got[2]-0.04)>0.005) return {ok:false, msg:'2δ ≤ 0.08 을 δ 에 대해 푸세요.'};
     if(pick!==0)
       return {ok:false, msg:'ε 을 줄일 때마다 δ 도 줄여서 통하게 했습니다. 연속이란 무슨 말일까요? 다시 고르세요.'};
     return {ok:true, msg:'판단했습니다 — <b>ε 을 먼저 받고 δ 를 나중에 찾습니다.</b> 이 순서가 극한과 연속의 정의를 엄밀하게 만들어 줍니다.'};
   }}""")
 +
 note(314, '내가 옮기고 · 내가 바꾸고 · 내가 판단한다',
 """  {t:'기록 — 함수를 <b>2x</b> 로 두고 점을 왼쪽으로 옮겨 적으세요',
   f:'x = {0} · ε = {1} · 통하는 δ = {2}',
   chk(got, r, mem){
     if(!r) return {ok:false, msg:'아직 화면 값이 없습니다.'};
     const x=noteNum(r[1]), e=noteNum(r[2]), d=noteNum(r[3]);
     if(String(r[0])!=='2x') return {ok:false, msg:'지금은 «'+r[0]+'» 입니다 — 2x 로 두세요.'};
     if(!(x<=0.3)) return {ok:false, msg:'x 가 '+r[1]+' 입니다 — 0.3 아래로 옮기세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-x)>0.02) return {ok:false, msg:'x 는 '+r[1]+' 입니다.'};
     if(Math.abs(got[1]-e)>0.02) return {ok:false, msg:'ε 은 '+r[2]+' 입니다.'};
     if(Math.abs(got[2]-d)>0.002) return {ok:false, msg:'통하는 δ 는 '+r[3]+' 입니다.'};
     mem.d1=d; mem.x1=x;
     return {ok:true, msg:'기록했습니다 — 왼쪽 끝으로 가도 δ 가 그대로입니다.'};
   }}""",
 """  {t:'생각 — 함수를 <b>1/x</b> 로 바꾸고 같은 자리에서 적으세요',
   f:'x = {0} · 통하는 δ = {1} · ①의 δ 의 몇 분의 1 = {2}',
   chk(got, r, mem){
     if(mem.d1===undefined) return {ok:false, msg:'① 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const x=noteNum(r[1]), d=noteNum(r[3]);
     if(String(r[0])!=='1/x') return {ok:false, msg:'지금은 «'+r[0]+'» 입니다 — 1/x 로 바꾸세요.'};
     if(!(x<=0.3)) return {ok:false, msg:'x 가 '+r[1]+' 입니다 — 0.3 아래로 옮기세요.'};
     if(!(d>0)) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-x)>0.02) return {ok:false, msg:'x 는 '+r[1]+' 입니다.'};
     if(Math.abs(got[1]-d)>0.002) return {ok:false, msg:'통하는 δ 는 '+r[3]+' 입니다.'};
     if(Math.abs(got[2]-mem.d1/d)>Math.max(3,mem.d1/d*0.15)) return {ok:false, msg:'①의 '+mem.d1+' 을 지금 δ 로 나누면 얼마인가요?'};
     mem.d2=d; mem.ok2=true;
     return {ok:true, msg:'계산했습니다 — 같은 ε 인데 δ 가 수십 분의 1 로 줄었습니다.'};
   }}""",
 """  {t:'판단 — 두 δ 를 나란히 두고 고르세요',
   f:'①의 δ (2x) = {0} · ②의 δ (1/x) = {1} · 구간 전체에 통하는 δ 를 고를 수 있는 쪽이 2x 이면 1 → {2}',
   opts:['점마다 δ 를 찾을 수 있는 것이 연속이고, <b>구간 전체에 통하는 δ 를 하나로 고를 수 있는 것</b> 이 균등연속이다 — 1/x 는 0 에 가까울수록 δ 가 0 으로 줄어 하나로 고를 수 없다',
         '연속이면 언제나 균등연속이다',
         '1/x 는 연속이 아니다'],
   chk(got, r, mem, pick){
     if(!mem.ok2) return {ok:false, msg:'② 칸을 먼저 통과하세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-mem.d1)>0.002) return {ok:false, msg:'①에 적은 '+mem.d1+' 입니다.'};
     if(Math.abs(got[1]-mem.d2)>0.002) return {ok:false, msg:'②에 적은 '+mem.d2+' 입니다.'};
     if(Math.abs(got[2]-1)>0.1) return {ok:false, msg:'δ 가 일정했던 쪽은 2x 였습니다.'};
     if(pick!==0)
       return {ok:false, msg:'1/x 도 모든 점에서 연속이었지만 δ 가 점마다 달랐습니다. 둘을 어떻게 가를까요? 다시 고르세요.'};
     return {ok:true, msg:'판단했습니다 — <b>연속과 균등연속은 다릅니다.</b> 닫힌 구간에서 연속이면 균등연속이 되지만(하이네-칸토어), 열린 구간에서는 1/x 처럼 어긋날 수 있습니다.'};
   }}""")
 +
 note(315, '내가 키우고 · 내가 재고 · 내가 판단한다',
 """  {t:'기록 — <b>n 이 작을 때</b> 한 점의 값을 적으세요',
   f:'n = {0} · x = {1} · 최대 오차 = {2}',
   chk(got, r, mem){
     if(!r) return {ok:false, msg:'아직 화면 값이 없습니다.'};
     const n=noteNum(r[0]), x=noteNum(r[1]), mx=noteNum(r[3]);
     if(!(n<=10)) return {ok:false, msg:'n 이 '+r[0]+' 입니다 — ②에서 키울 테니 10 아래로 두세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-n)>0.5) return {ok:false, msg:'n 은 '+r[0]+' 입니다.'};
     if(Math.abs(got[1]-x)>0.02) return {ok:false, msg:'x 는 '+r[1]+' 입니다.'};
     if(Math.abs(got[2]-mx)>0.02) return {ok:false, msg:'최대 오차는 '+r[3]+' 입니다.'};
     mem.n1=n; mem.mx1=mx;
     return {ok:true, msg:'기록했습니다 — 최대 오차가 '+r[3]+' 입니다. n 을 키워 봅시다.'};
   }}""",
 """  {t:'생각 — <b>n 을 25 이상</b> 으로 키우고 다시 적으세요',
   f:'n = {0} · 최대 오차 = {1} · ①의 최대 오차와의 차 = {2}',
   chk(got, r, mem){
     if(mem.mx1===undefined) return {ok:false, msg:'① 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const n=noteNum(r[0]), mx=noteNum(r[3]);
     if(!(n>=25)) return {ok:false, msg:'n 이 '+r[0]+' 입니다 — 25 이상으로 키우세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-n)>0.5) return {ok:false, msg:'n 은 '+r[0]+' 입니다.'};
     if(Math.abs(got[1]-mx)>0.02) return {ok:false, msg:'최대 오차는 '+r[3]+' 입니다.'};
     if(Math.abs(got[2]-(mx-mem.mx1))>0.02) return {ok:false, msg:'①의 '+mem.mx1+' 을 빼면 얼마인가요?'};
     mem.mx2=mx; mem.ok2=true;
     return {ok:true, msg:'계산했습니다 — 그 점의 값은 0 에 가까워졌는데 최대 오차는 그대로입니다.'};
   }}""",
 """  {t:'판단 — 두 최대 오차를 나란히 두고 고르세요',
   f:'①의 최대 오차 = {0} · ②의 최대 오차 = {1} · 점마다는 0 인데 최대 오차는 그대로이면 1 → {2}',
   opts:['점마다 0 으로 가는 것(점별 수렴)과 <b>구간 전체에서 한꺼번에</b> 가까워지는 것(균등 수렴)은 다르다 — xⁿ 은 x = 1 근처가 끝까지 버텨 최대 오차가 1 에서 줄지 않는다',
         '점마다 0 으로 가면 최대 오차도 0 으로 간다',
         'n 을 충분히 키우면 최대 오차도 0 이 된다'],
   chk(got, r, mem, pick){
     if(!mem.ok2) return {ok:false, msg:'② 칸을 먼저 통과하세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-mem.mx1)>0.02) return {ok:false, msg:'①에 적은 '+mem.mx1+' 입니다.'};
     if(Math.abs(got[1]-mem.mx2)>0.02) return {ok:false, msg:'②에 적은 '+mem.mx2+' 입니다.'};
     if(Math.abs(got[2]-1)>0.1) return {ok:false, msg:'최대 오차가 줄지 않았습니다.'};
     if(pick!==0)
       return {ok:false, msg:'x = 0.5 에서는 0 이 되었는데 최대 오차는 1 그대로였습니다. 어떻게 둘 다 참일까요? 다시 고르세요.'};
     return {ok:true, msg:'판단했습니다 — <b>점별 수렴과 균등 수렴은 다릅니다.</b> 균등 수렴이어야 극한과 적분·미분의 순서를 바꿀 수 있습니다.'};
   }}""")
 +
 note(316, '내가 더하고 · 내가 늘리고 · 내가 판단한다',
 """  {t:'기록 — <b>항이 적을 때</b> 급수 값을 적으세요',
   f:'θ = {0} ° · 항 수 = {1} · 급수 값의 실수부 = {2}',
   chk(got, r, mem){
     if(!r) return {ok:false, msg:'아직 화면 값이 없습니다.'};
     const th=noteNum(r[0]), N=noteNum(r[1]), re=noteNum(r[2]);
     if(!(N<=6)) return {ok:false, msg:'항 수가 '+r[1]+' 입니다 — ②에서 늘릴 테니 6 이하로 두세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-th)>1) return {ok:false, msg:'θ 는 '+r[0]+' 입니다.'};
     if(Math.abs(got[1]-N)>0.5) return {ok:false, msg:'항 수는 '+r[1]+' 입니다.'};
     if(Math.abs(got[2]-re)>0.002) return {ok:false, msg:'급수 값의 실수부는 '+r[2]+' 의 앞 수입니다.'};
     mem.re1=re; mem.th=th;
     return {ok:true, msg:'기록했습니다 — 아직 원 위의 점에서 조금 벗어나 있습니다.'};
   }}""",
 """  {t:'생각 — <b>항 수를 10 이상</b> 으로 늘리고 적으세요',
   f:'항 수 = {0} · 급수 값의 실수부 = {1} · cos 60° = {2}',
   chk(got, r, mem){
     if(mem.re1===undefined) return {ok:false, msg:'① 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const N=noteNum(r[1]), re=noteNum(r[2]);
     if(!(N>=10)) return {ok:false, msg:'항 수가 '+r[1]+' 입니다 — 10 이상으로 늘리세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-N)>0.5) return {ok:false, msg:'항 수는 '+r[1]+' 입니다.'};
     if(Math.abs(got[1]-re)>0.002) return {ok:false, msg:'실수부는 '+r[2]+' 의 앞 수입니다.'};
     if(Math.abs(got[2]-0.5)>0.01) return {ok:false, msg:'cos 60° 의 값을 적으세요.'};
     mem.re2=re; mem.ok2=true;
     return {ok:true, msg:'계산했습니다 — 급수의 실수부가 cos θ 와 같아졌습니다.'};
   }}""",
 """  {t:'판단 — θ 를 180° 로 두었을 때를 생각하며 고르세요',
   f:'①의 실수부 = {0} · ②의 실수부 = {1} · θ = 180° 일 때의 실수부 = {2}',
   opts:['e<sup>iθ</sup> 의 급수를 실수부와 허수부로 나누면 <b>cos θ 와 sin θ 의 급수</b> 가 그대로 나온다 — 그래서 크기가 언제나 1 이고 점이 단위원 위를 돈다',
         '지수에 허수를 넣으면 값이 한없이 커진다',
         '급수의 값은 θ 와 상관없이 1 이다'],
   chk(got, r, mem, pick){
     if(!mem.ok2) return {ok:false, msg:'② 칸을 먼저 통과하세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-mem.re1)>0.002) return {ok:false, msg:'①에 적은 '+mem.re1+' 입니다.'};
     if(Math.abs(got[1]-mem.re2)>0.002) return {ok:false, msg:'②에 적은 '+mem.re2+' 입니다.'};
     if(Math.abs(got[2]+1)>0.02) return {ok:false, msg:'cos 180° 의 값입니다.'};
     if(pick!==0)
       return {ok:false, msg:'항을 늘리자 실수부가 cos θ 로, 허수부가 sin θ 로 갔습니다. 왜 그럴까요? 다시 고르세요.'};
     return {ok:true, msg:'판단했습니다 — <b>e^(iθ) = cos θ + i sin θ 입니다.</b> θ = π 를 넣으면 e^(iπ) + 1 = 0 — 다섯 상수가 한 식에 모입니다.'};
   }}""")
 +
 note(317, '내가 돌리고 · 내가 키우고 · 내가 판단한다',
 """  {t:'기록 — 크기를 <b>1</b> 로 두고 각을 하나 골라 적으세요',
   f:'각 = {0} ° · 옮겨진 각 = {1} ° · 옮겨진 각 ÷ 각 = {2}',
   chk(got, r, mem){
     if(!r) return {ok:false, msg:'아직 화면 값이 없습니다.'};
     const a=noteNum(r[1]), b=noteNum(r[3]);
     if(!(a>0)) return {ok:false, msg:'각을 0 보다 크게 두세요.'};
     if(!(b>a*1.5)) return {ok:false, msg:'「각을 그대로 두기」 를 끄세요 — 각이 두 배가 되어야 합니다.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-a)>1) return {ok:false, msg:'각은 '+r[1]+' 입니다.'};
     if(Math.abs(got[1]-b)>1) return {ok:false, msg:'옮겨진 각은 '+r[3]+' 입니다.'};
     if(Math.abs(got[2]-b/a)>0.1) return {ok:false, msg:'옮겨진 각을 원래 각으로 나누면 얼마인가요?'};
     mem.ratio=b/a;
     return {ok:true, msg:'기록했습니다 — 각이 정확히 두 배가 되었습니다.'};
   }}""",
 """  {t:'생각 — <b>크기를 1 이 아닌 값</b> 으로 바꾸고 적으세요',
   f:'크기 = {0} · 옮겨진 크기 = {1} · 크기의 제곱 = {2}',
   chk(got, r, mem){
     if(mem.ratio===undefined) return {ok:false, msg:'① 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const rr=noteNum(r[0]), rr2=noteNum(r[2]);
     if(Math.abs(rr-1)<0.02) return {ok:false, msg:'크기가 '+r[0]+' 입니다 — 1 이 아닌 값으로 바꾸세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-rr)>0.02) return {ok:false, msg:'크기는 '+r[0]+' 입니다.'};
     if(Math.abs(got[1]-rr2)>0.02) return {ok:false, msg:'옮겨진 크기는 '+r[2]+' 입니다.'};
     if(Math.abs(got[2]-rr*rr)>0.02) return {ok:false, msg:'크기를 제곱하면 얼마인가요?'};
     mem.r2=rr2; mem.ok2=true;
     return {ok:true, msg:'계산했습니다 — 옮겨진 크기가 원래 크기의 제곱과 같습니다.'};
   }}""",
 """  {t:'판단 — 두 규칙을 한꺼번에 쓰고 고르세요',
   f:'①의 각의 비 = {0} · ②의 옮겨진 크기 = {1} · 크기 2 · 각 45° 를 제곱하면 크기 = {2}',
   opts:['극형식에서 z² 은 <b>크기는 제곱되고 각은 두 배</b> 가 된다 — 그래서 위쪽 반원(0°~180°)이 원 전체(0°~360°)를 덮고, 복소함수는 평면을 늘이고 돌린다',
         '제곱하면 크기와 각이 모두 두 배가 된다',
         '제곱해도 각은 그대로이고 크기만 바뀐다'],
   chk(got, r, mem, pick){
     if(!mem.ok2) return {ok:false, msg:'② 칸을 먼저 통과하세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-mem.ratio)>0.1) return {ok:false, msg:'①에 적은 '+mem.ratio+' 입니다.'};
     if(Math.abs(got[1]-mem.r2)>0.02) return {ok:false, msg:'②에 적은 '+mem.r2+' 입니다.'};
     if(Math.abs(got[2]-4)>0.05) return {ok:false, msg:'2 를 제곱하세요.'};
     if(pick!==0)
       return {ok:false, msg:'각은 두 배, 크기는 제곱이었습니다. 둘을 함께 적으면 어떤 규칙일까요? 다시 고르세요.'};
     return {ok:true, msg:'판단했습니다 — <b>z² 은 각을 두 배로, 크기를 제곱으로 만듭니다.</b> 드무아브르 공식이고, 복소수의 거듭제곱근을 구할 때 그대로 뒤집어 씁니다.'};
   }}""")
 +
 note(318, '내가 돌리고 · 내가 되돌리고 · 내가 판단한다',
 """  {t:'기록 — <b>0 이 아닌 a</b> 를 골라 역원과 함께 적으세요',
   f:'a = {0} · 역원 = {1} · a + 역원 = {2}',
   chk(got, r, mem){
     if(!r) return {ok:false, msg:'아직 화면 값이 없습니다.'};
     const a=noteNum(r[1]), inv=noteNum(r[2]), s=noteNum(r[3]);
     if(!(a>0)) return {ok:false, msg:'a 가 0 입니다 — 0 이 아닌 값으로 고르세요.'};
     if(s!==0) return {ok:false, msg:'「나머지를 음수로 두기」 를 끄세요 — 합이 0 이 되어야 합니다.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-a)>0.5) return {ok:false, msg:'a 는 '+r[1]+' 입니다.'};
     if(Math.abs(got[1]-inv)>0.5) return {ok:false, msg:'역원은 '+r[2]+' 입니다.'};
     if(Math.abs(got[2]-s)>0.5) return {ok:false, msg:'a + 역원 은 '+r[3]+' 입니다.'};
     mem.a1=a; mem.inv1=inv;
     return {ok:true, msg:'기록했습니다 — '+r[1]+' + '+r[2]+' 가 시계에서 0 으로 돌아옵니다.'};
   }}""",
 """  {t:'생각 — <b>다른 a</b> 로 바꾸고 다시 적으세요',
   f:'a = {0} · 역원 = {1} · a + 역원 = {2}',
   chk(got, r, mem){
     if(mem.a1===undefined) return {ok:false, msg:'① 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const a=noteNum(r[1]), inv=noteNum(r[2]), s=noteNum(r[3]);
     if(a===mem.a1) return {ok:false, msg:'a 가 그대로입니다 — 다른 값으로 바꾸세요.'};
     if(!(a>0)) return {ok:false, msg:'0 이 아닌 a 로 고르세요.'};
     if(s!==0) return {ok:false, msg:'「나머지를 음수로 두기」 를 끄세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-a)>0.5) return {ok:false, msg:'a 는 '+r[1]+' 입니다.'};
     if(Math.abs(got[1]-inv)>0.5) return {ok:false, msg:'역원은 '+r[2]+' 입니다.'};
     if(Math.abs(got[2]-s)>0.5) return {ok:false, msg:'a + 역원 은 '+r[3]+' 입니다.'};
     mem.a2=a; mem.ok2=true;
     return {ok:true, msg:'계산했습니다 — 어떤 a 를 골라도 0 으로 되돌리는 짝이 있습니다.'};
   }}""",
 """  {t:'판단 — 다른 시계에서도 되는지 고르세요',
   f:'①의 a + 역원 = {0} · ②의 a + 역원 = {1} · n = 7 일 때 a = 3 의 역원 = {2}',
   opts:['모든 원소에 <b>0 으로 되돌리는 짝(역원)</b> 이 있고 더하기가 닫혀 있으면 군이 된다 — 시계 산술에서 a 의 역원은 n − a 이고, 이 구조가 암호와 오류정정의 바탕이다',
         '시계 산술에서는 빼기를 할 수 없다',
         '역원이 있는 원소는 0 뿐이다'],
   chk(got, r, mem, pick){
     if(!mem.ok2) return {ok:false, msg:'② 칸을 먼저 통과하세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0])>0.5) return {ok:false, msg:'①에서 합은 0 이었습니다.'};
     if(Math.abs(got[1])>0.5) return {ok:false, msg:'②에서도 합은 0 이었습니다.'};
     if(Math.abs(got[2]-4)>0.5) return {ok:false, msg:'3 + □ 가 7 이 되는 수를 적으세요.'};
     if(pick!==0)
       return {ok:false, msg:'어떤 a 를 골라도 0 으로 되돌아왔습니다. 그것이 무엇을 뜻할까요? 다시 고르세요.'};
     return {ok:true, msg:'판단했습니다 — <b>되돌아오는 셈에도 규칙이 있습니다.</b> 닫힘 · 결합 · 항등원 · 역원 네 조건을 갖추면 군이고, 시계 산술이 가장 친숙한 군입니다.'};
   }}""")
 +
 note(319, '내가 돌리고 · 내가 뒤집고 · 내가 판단한다',
 """  {t:'기록 — <b>회전끼리</b> 두 동작을 골라 적으세요',
   f:'순서를 바꿔도 같으면 1, 다르면 0 → {0} · 정삼각형의 대칭 동작은 모두 몇 가지 = {1}',
   chk(got, r, mem){
     if(!r) return {ok:false, msg:'아직 화면 값이 없습니다.'};
     if(String(r[4])!=='같음') return {ok:false, msg:'지금은 «'+r[4]+'» 입니다 — 회전끼리 골라 같아지게 하세요.'};
     if(![0,1].every(j=>isFinite(got[j]))) return {ok:false, msg:'두 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-1)>0.1) return {ok:false, msg:'화면은 «'+r[4]+'» 이라고 합니다.'};
     if(Math.abs(got[1]-6)>0.1) return {ok:false, msg:'회전 3 가지와 뒤집기 3 가지를 더하세요.'};
     mem.ok1=true;
     return {ok:true, msg:'기록했습니다 — 회전끼리는 순서를 바꿔도 결과가 같습니다.'};
   }}""",
 """  {t:'생각 — <b>회전과 뒤집기</b> 를 섞어 고르고 적으세요',
   f:'순서를 바꿔도 같으면 1, 다르면 0 → {0} · 대칭 동작의 수 = {1}',
   chk(got, r, mem){
     if(!mem.ok1) return {ok:false, msg:'① 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     if(String(r[4])!=='다름') return {ok:false, msg:'지금은 «'+r[4]+'» 입니다 — 회전과 뒤집기를 섞어 고르세요.'};
     if(![0,1].every(j=>isFinite(got[j]))) return {ok:false, msg:'두 칸을 모두 채우세요.'};
     if(Math.abs(got[0])>0.1) return {ok:false, msg:'화면은 «'+r[4]+'» 이라고 합니다.'};
     if(Math.abs(got[1]-6)>0.1) return {ok:false, msg:'대칭 동작은 모두 6 가지입니다.'};
     mem.ok2=true;
     return {ok:true, msg:'계산했습니다 — 순서를 바꾸었더니 결과가 달라졌습니다.'};
   }}""",
 """  {t:'판단 — 두 경우를 나란히 두고 고르세요',
   f:'①(회전끼리) = {0} · ②(회전과 뒤집기) = {1} · 교환법칙이 언제나 성립하면 1, 아니면 0 → {2}',
   opts:['정삼각형의 대칭 여섯은 합성에 대해 군을 이루지만 <b>교환법칙은 성립하지 않는다</b> — 회전끼리는 순서를 바꿔도 같지만 뒤집기가 섞이면 달라진다',
         '모든 군에서는 교환법칙이 성립한다',
         '순서를 바꾸면 언제나 결과가 달라진다'],
   chk(got, r, mem, pick){
     if(!mem.ok2) return {ok:false, msg:'② 칸을 먼저 통과하세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-1)>0.1) return {ok:false, msg:'①에서는 같았습니다.'};
     if(Math.abs(got[1])>0.1) return {ok:false, msg:'②에서는 달랐습니다.'};
     if(Math.abs(got[2])>0.1) return {ok:false, msg:'②에서 성립하지 않았습니다.'};
     if(pick!==0)
       return {ok:false, msg:'회전끼리는 같았고 뒤집기가 섞이자 달라졌습니다. 교환법칙은 늘 성립할까요? 다시 고르세요.'};
     return {ok:true, msg:'판단했습니다 — <b>순서가 결과를 바꿉니다.</b> 정삼각형의 대칭군은 가장 작은 비가환군이고, 행렬의 곱셈이 교환되지 않는 것과 같은 이야기입니다.'};
   }}""")
 +
 note(320, '내가 맞추고 · 내가 바꾸고 · 내가 판단한다',
 """  {t:'기록 — 가정을 <b>지수</b> 로 두고 <b>24개월 이상</b> 을 예측해 적으세요',
   f:'기간 = {0} 개월 · 예측값 = {1} · 맞춤 오차 = {2}',
   chk(got, r, mem){
     if(!r) return {ok:false, msg:'아직 화면 값이 없습니다.'};
     const T=noteNum(r[2]), v=noteNum(r[3]), f=noteNum(r[4]);
     if(String(r[0])!=='지수') return {ok:false, msg:'지금은 «'+r[0]+'» 입니다 — 지수로 두세요.'};
     if(!(T>=24)) return {ok:false, msg:'기간이 '+r[2]+' 입니다 — 24개월 이상으로 늘리세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-T)>0.5) return {ok:false, msg:'기간은 '+r[2]+' 입니다.'};
     if(Math.abs(got[1]-v)>Math.max(1,v*0.01)) return {ok:false, msg:'예측값은 '+r[3]+' 입니다.'};
     if(Math.abs(got[2]-f)>0.5) return {ok:false, msg:'맞춤 오차는 '+r[4]+' 입니다.'};
     mem.v1=v; mem.f1=f; mem.T=T;
     return {ok:true, msg:'기록했습니다 — 지수 가정으로는 '+r[3]+' 입니다. 가정을 바꿔 봅시다.'};
   }}""",
 """  {t:'생각 — 가정을 <b>로지스틱</b> 으로 바꾸고 같은 기간을 적으세요',
   f:'예측값 = {0} · 맞춤 오차 = {1} · ①의 예측값 ÷ 지금 예측값 = {2}',
   chk(got, r, mem){
     if(mem.v1===undefined) return {ok:false, msg:'① 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const T=noteNum(r[2]), v=noteNum(r[3]), f=noteNum(r[4]);
     if(String(r[0])!=='로지스틱') return {ok:false, msg:'지금은 «'+r[0]+'» 입니다 — 로지스틱으로 바꾸세요.'};
     if(Math.abs(T-mem.T)>0.5) return {ok:false, msg:'기간을 ①과 같은 '+mem.T+'개월로 두세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-v)>Math.max(1,v*0.01)) return {ok:false, msg:'예측값은 '+r[3]+' 입니다.'};
     if(Math.abs(got[1]-f)>0.5) return {ok:false, msg:'맞춤 오차는 '+r[4]+' 입니다.'};
     if(Math.abs(got[2]-mem.v1/v)>Math.max(0.3,mem.v1/v*0.1)) return {ok:false, msg:'①의 '+mem.v1+' 을 지금 값으로 나누세요.'};
     mem.v2=v; mem.ok2=true;
     return {ok:true, msg:'계산했습니다 — 같은 자료에 맞췄는데 예측이 몇 배나 벌어집니다.'};
   }}""",
 """  {t:'판단 — 두 예측값을 나란히 두고 고르세요',
   f:'①의 예측값 = {0} · ②의 예측값 = {1} · 같은 자료인데 예측이 갈리면 1, 아니면 0 → {2}',
   opts:['모형의 예측은 <b>가정의 예측</b> 이다 — 처음 몇 달은 어느 가정이든 자료에 잘 맞지만, 먼 미래로 갈수록 가정의 차이가 그대로 벌어진다',
         '자료에 잘 맞는 모형은 예측도 정확하다',
         '모형이 여럿이면 평균을 내면 된다'],
   chk(got, r, mem, pick){
     if(!mem.ok2) return {ok:false, msg:'② 칸을 먼저 통과하세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-mem.v1)>Math.max(1,mem.v1*0.01)) return {ok:false, msg:'①에 적은 '+mem.v1+' 입니다.'};
     if(Math.abs(got[1]-mem.v2)>Math.max(1,mem.v2*0.01)) return {ok:false, msg:'②에 적은 '+mem.v2+' 입니다.'};
     if(Math.abs(got[2]-1)>0.1) return {ok:false, msg:'두 예측값이 크게 달랐습니다.'};
     if(pick!==0)
       return {ok:false, msg:'맞춤 오차는 비슷한데 예측이 몇 배나 갈렸습니다. 무엇이 예측을 정한 것일까요? 다시 고르세요.'};
     return {ok:true, msg:'판단했습니다 — <b>예측값에는 가정이 함께 적혀야 합니다.</b> 감염병·인구·매출 예측이 기관마다 다른 것도 자료가 아니라 가정이 다르기 때문입니다.'};
   }}""")
)
