# -*- coding: utf-8 -*-
"""LAB 261~270 탐구 노트 — 기록 → 생각 → 판단. 판정은 화면의 read() 값으로만 한다."""


def note(no, head, c1, c2, c3):
    return "\n %d:{ h:'%s',\n  c:[\n%s,\n%s,\n%s\n ]},\n" % (no, head, c1, c2, c3)


NOTES = (
 note(261, '내가 돌리고 · 내가 재고 · 내가 판단한다',
 """  {t:'기록 — <b>상관을 0.9</b> 로 키우고 방향은 그대로 둔 채 적으세요',
   f:'상관 = {0} · 방향 = {1} ° · 그 방향의 분산 = {2}',
   chk(got, r, mem){
     if(!r) return {ok:false, msg:'아직 화면 값이 없습니다.'};
     const cr=noteNum(r[0]), th=noteNum(r[1]), v=noteNum(r[2]), l1=noteNum(r[3]);
     if(!(cr>=0.85)) return {ok:false, msg:'상관이 '+r[0]+' 입니다 — 0.9 로 키우세요.'};
     if(!(l1-v>0.05)) return {ok:false, msg:'이미 가장 퍼지는 방향입니다 — ②에서 볼 테니 방향을 돌려 두세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-cr)>0.05) return {ok:false, msg:'상관은 '+r[0]+' 입니다.'};
     if(Math.abs(got[1]-th)>0.5) return {ok:false, msg:'방향은 '+r[1]+' 입니다.'};
     if(Math.abs(got[2]-v)>0.01) return {ok:false, msg:'그 방향의 분산은 '+r[2]+' 입니다.'};
     mem.v1=v; mem.l1=l1;
     return {ok:true, msg:'기록했습니다 — 이 방향의 분산이 '+r[2]+' 입니다. 더 퍼지는 방향이 있을까요?'};
   }}""",
 """  {t:'생각 — <b>「가장 퍼지는 방향 찾기」</b> 를 누르고 다시 적으세요',
   f:'방향 = {0} ° · 그 방향의 분산 = {1} · 가능한 최댓값 = {2}',
   chk(got, r, mem){
     if(mem.v1===undefined) return {ok:false, msg:'① 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const th=noteNum(r[1]), v=noteNum(r[2]), l1=noteNum(r[3]);
     if(!(l1-v<0.01)) return {ok:false, msg:'분산이 '+r[2]+' 로 최댓값 '+r[3]+' 보다 작습니다 — 「가장 퍼지는 방향 찾기」 를 누르세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-th)>0.5) return {ok:false, msg:'방향은 '+r[1]+' 입니다.'};
     if(Math.abs(got[1]-v)>0.01) return {ok:false, msg:'분산은 '+r[2]+' 입니다.'};
     if(Math.abs(got[2]-l1)>0.01) return {ok:false, msg:'가능한 최댓값은 '+r[3]+' 입니다.'};
     mem.v2=v; mem.ok2=true;
     return {ok:true, msg:'계산했습니다 — 분산이 최댓값과 같아졌습니다. 이 방향이 첫 번째 주성분입니다.'};
   }}""",
 """  {t:'판단 — 첫 축이 담는 비율을 구해 보고 고르세요',
   f:'①의 분산 = {0} · ②의 분산 = {1} · 첫 축이 담는 비율 = {2} %',
   opts:['분산이 가장 커지는 방향이 <b>가장 큰 고윳값의 고유벡터</b> 다 — 두 고윳값의 합이 전체 분산이므로, 큰 고윳값의 비율만큼 정보를 지키면서 축을 줄일 수 있다',
         '축을 줄이면 정보가 절반으로 줄어든다',
         '어느 방향으로 내려 찍어도 퍼진 정도는 같다'],
   chk(got, r, mem, pick){
     if(!mem.ok2) return {ok:false, msg:'② 칸을 먼저 통과하세요.'};
     const ratio=noteNum(r[4]);
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-mem.v1)>0.01) return {ok:false, msg:'①에 적은 '+mem.v1+' 입니다.'};
     if(Math.abs(got[1]-mem.v2)>0.01) return {ok:false, msg:'②에 적은 '+mem.v2+' 입니다.'};
     if(Math.abs(got[2]-ratio)>0.5) return {ok:false, msg:'화면의 「첫 축이 담는 비율」 은 '+r[4]+' 입니다.'};
     if(pick!==0)
       return {ok:false, msg:'방향을 돌려도 분산이 더 커지지 않았고, 그 값이 큰 고윳값과 같았습니다. 무엇이 축을 정할까요? 다시 고르세요.'};
     return {ok:true, msg:'판단했습니다 — <b>두 고윳값의 합은 언제나 전체 분산입니다.</b> 첫 축이 담는 비율이 크면 축을 하나로 줄여도 자료의 모양이 거의 남습니다. 이것이 차원 축소입니다.'};
   }}""")
 +
 note(262, '내가 더하고 · 내가 재고 · 내가 판단한다',
 """  {t:'기록 — <b>항의 수를 30 이상</b> 으로 키우고 적으세요 (r 은 0.9)',
   f:'r = {0} · 더한 항의 수 = {1} · 비 = {2}',
   chk(got, r, mem){
     if(!r) return {ok:false, msg:'아직 화면 값이 없습니다.'};
     const rr=noteNum(r[0]), n=noteNum(r[2]), ra=noteNum(r[3]);
     if(!(n>=30)) return {ok:false, msg:'항의 수가 '+r[2]+' 입니다 — 30 이상으로 키우세요.'};
     if(!(ra<1)) return {ok:false, msg:'비가 '+r[3]+' 입니다 — r 을 1 보다 작게 두세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-rr)>0.02) return {ok:false, msg:'r 은 '+r[0]+' 입니다.'};
     if(Math.abs(got[1]-n)>0.5) return {ok:false, msg:'항의 수는 '+r[2]+' 입니다.'};
     if(Math.abs(got[2]-ra)>0.02) return {ok:false, msg:'비는 '+r[3]+' 입니다.'};
     mem.r1=ra;
     return {ok:true, msg:'기록했습니다 — 비가 '+r[3]+' 로 1 보다 작으니 부분합이 멈춰 섭니다. 비를 1 로 맞춰 봅시다.'};
   }}""",
 """  {t:'생각 — <b>밑 r 을 1.00</b> 으로 맞추고 1 과의 차를 적으세요',
   f:'r = {0} · 비 = {1} · 비와 1 의 차 = {2}',
   chk(got, r, mem){
     if(mem.r1===undefined) return {ok:false, msg:'① 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const rr=noteNum(r[0]), ra=noteNum(r[3]);
     if(Math.abs(ra-1)>1e-6) return {ok:false, msg:'비가 '+r[3]+' 입니다 — r 을 1.00 으로 맞추세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-rr)>0.02) return {ok:false, msg:'r 은 '+r[0]+' 입니다.'};
     if(Math.abs(got[1]-ra)>0.02) return {ok:false, msg:'비는 '+r[3]+' 입니다.'};
     if(Math.abs(got[2])>0.02) return {ok:false, msg:'비에서 1 을 빼면 얼마인가요?'};
     mem.r2=ra; mem.ok2=true;
     return {ok:true, msg:'계산했습니다 — 비가 꼭 1 입니다. 이때 화면이 「아무 말도 못 한다」 고 합니다.'};
   }}""",
 """  {t:'판단 — 두 비를 나란히 두고 고르세요',
   f:'①의 비 = {0} · ②의 비 = {1} · 판정법이 침묵하는 비의 값 = {2}',
   opts:['비가 1 보다 <b>작으면 모이고 크면 흩어진다</b> — 그러나 꼭 1 이면 비판정법은 아무 말도 못 하고, 그때는 p 를 보고 따로 판정해야 한다',
         '비가 1 이면 언제나 수렴한다',
         '항이 0 으로 가기만 하면 비는 볼 필요가 없다'],
   chk(got, r, mem, pick){
     if(!mem.ok2) return {ok:false, msg:'② 칸을 먼저 통과하세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-mem.r1)>0.02) return {ok:false, msg:'①에 적은 '+mem.r1+' 입니다.'};
     if(Math.abs(got[1]-mem.r2)>0.02) return {ok:false, msg:'②에 적은 '+mem.r2+' 입니다.'};
     if(Math.abs(got[2]-1)>0.02) return {ok:false, msg:'판정법이 아무 말도 못 하던 비의 값을 적으세요.'};
     if(pick!==0)
       return {ok:false, msg:'비 0.9 에서는 모였고 비 1 에서는 화면이 침묵했습니다. 판정법은 무엇을 보고 말할까요? 다시 고르세요.'};
     return {ok:true, msg:'판단했습니다 — <b>비판정법은 r 만 봅니다.</b> r < 1 이면 등비급수에 갇혀 수렴하고, r > 1 이면 항이 커져 발산합니다. 경계 r = 1 에서는 Σ1/n 과 Σ1/n² 처럼 결과가 갈리므로 판정법이 침묵합니다.'};
   }}""")
 +
 note(263, '내가 더하고 · 내가 재고 · 내가 판단한다',
 """  {t:'기록 — <b>p = 1 · 항의 수를 300 이상</b> 으로 두고 적으세요',
   f:'p = {0} · 부분합 = {1} · 곡선 아래 넓이 = {2}',
   chk(got, r, mem){
     if(!r) return {ok:false, msg:'아직 화면 값이 없습니다.'};
     const p=noteNum(r[0]), n=noteNum(r[1]), s=noteNum(r[2]), I=noteNum(r[3]);
     if(!(p<=1.0001)) return {ok:false, msg:'p 가 '+r[0]+' 입니다 — 1 로 두세요.'};
     if(!(n>=300)) return {ok:false, msg:'항의 수가 '+r[1]+' 입니다 — 300 이상으로 키우세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-p)>0.05) return {ok:false, msg:'p 는 '+r[0]+' 입니다.'};
     if(Math.abs(got[1]-s)>0.01) return {ok:false, msg:'부분합은 '+r[2]+' 입니다.'};
     if(Math.abs(got[2]-I)>0.01) return {ok:false, msg:'넓이는 '+r[3]+' 입니다.'};
     mem.s1=s;
     return {ok:true, msg:'기록했습니다 — 항은 0 으로 가는데 합은 '+r[2]+' 까지 자랐습니다. p 를 올려 봅시다.'};
   }}""",
 """  {t:'생각 — <b>p 를 2</b> 로 올리고 다시 적으세요',
   f:'p = {0} · 부분합 = {1} · 곡선 아래 넓이 = {2}',
   chk(got, r, mem){
     if(mem.s1===undefined) return {ok:false, msg:'① 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const p=noteNum(r[0]), s=noteNum(r[2]), I=noteNum(r[3]);
     if(!(p>1.0001)) return {ok:false, msg:'p 가 '+r[0]+' 입니다 — 1 보다 크게 올리세요.'};
     if(!(s<2)) return {ok:false, msg:'부분합이 '+r[2]+' 입니다 — p 를 2 로 올리세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-p)>0.05) return {ok:false, msg:'p 는 '+r[0]+' 입니다.'};
     if(Math.abs(got[1]-s)>0.01) return {ok:false, msg:'부분합은 '+r[2]+' 입니다.'};
     if(Math.abs(got[2]-I)>0.01) return {ok:false, msg:'넓이는 '+r[3]+' 입니다.'};
     mem.s2=s; mem.ok2=true;
     return {ok:true, msg:'계산했습니다 — 같은 항의 수인데 합이 '+r[2]+' 에서 멈췄습니다.'};
   }}""",
 """  {t:'판단 — 두 부분합을 나란히 두고 고르세요',
   f:'①의 부분합 = {0} · ②의 부분합 = {1} · 모이기 시작하는 p 의 경계 = {2}',
   opts:['항이 0 으로 가는 것만으로는 모자라고 <b>1/xᵖ 아래 넓이가 유한해야</b> 한다 — 그 경계가 p = 1 이고, 막대가 곡선보다 높으니 넓이가 무한하면 합도 무한하다',
         '항이 0 으로 가면 합은 언제나 유한하다',
         '항의 수를 늘리면 어떤 p 에서든 합이 멈춘다'],
   chk(got, r, mem, pick){
     if(!mem.ok2) return {ok:false, msg:'② 칸을 먼저 통과하세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-mem.s1)>0.01) return {ok:false, msg:'①에 적은 '+mem.s1+' 입니다.'};
     if(Math.abs(got[1]-mem.s2)>0.01) return {ok:false, msg:'②에 적은 '+mem.s2+' 입니다.'};
     if(Math.abs(got[2]-1)>0.05) return {ok:false, msg:'p 가 얼마보다 커야 합이 멈췄나요?'};
     if(pick!==0)
       return {ok:false, msg:'p = 1 에서는 넓이도 합도 자랐고, p = 2 에서는 둘 다 멈췄습니다. 무엇이 급수를 가두었을까요? 다시 고르세요.'};
     return {ok:true, msg:'판단했습니다 — <b>적분이 급수를 가둡니다.</b> 1/xᵖ 아래 넓이가 유한한 p > 1 에서만 합이 멈추고, p ≤ 1 이면 항이 0 으로 가도 합은 끝없이 자랍니다.'};
   }}""")
 +
 note(264, '내가 늘리고 · 내가 재고 · 내가 판단한다',
 """  {t:'기록 — <b>x = 0.5 · 항의 수 12 이상</b> 으로 두고 적으세요',
   f:'x = {0} · 부분합 = {1} · 참값 = {2}',
   chk(got, r, mem){
     if(!r) return {ok:false, msg:'아직 화면 값이 없습니다.'};
     const x=noteNum(r[0]), n=noteNum(r[1]), s=noteNum(r[2]), t=noteNum(r[3]);
     if(!(Math.abs(x)<1)) return {ok:false, msg:'x 가 '+r[0]+' 입니다 — 1 보다 작게 두세요.'};
     if(!(n>=12)) return {ok:false, msg:'항의 수가 '+r[1]+' 입니다 — 12 이상으로 키우세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-x)>0.02) return {ok:false, msg:'x 는 '+r[0]+' 입니다.'};
     if(Math.abs(got[1]-s)>0.01) return {ok:false, msg:'부분합은 '+r[2]+' 입니다.'};
     if(Math.abs(got[2]-t)>0.01) return {ok:false, msg:'참값은 '+r[3]+' 입니다.'};
     mem.s1=s; mem.t1=t;
     return {ok:true, msg:'기록했습니다 — 부분합 '+r[2]+' 이 참값 '+r[3]+' 에 거의 닿았습니다. 반경 밖으로 나가 봅시다.'};
   }}""",
 """  {t:'생각 — <b>x 를 1.2</b> 로 올리고 다시 적으세요 (항의 수는 그대로)',
   f:'x = {0} · 부분합 = {1} · 참값 = {2}',
   chk(got, r, mem){
     if(mem.s1===undefined) return {ok:false, msg:'① 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const x=noteNum(r[0]), s=noteNum(r[2]), t=noteNum(r[3]);
     if(!(Math.abs(x)>=1)) return {ok:false, msg:'x 가 '+r[0]+' 입니다 — 1.2 로 올리세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-x)>0.02) return {ok:false, msg:'x 는 '+r[0]+' 입니다.'};
     if(Math.abs(got[1]-s)>0.05) return {ok:false, msg:'부분합은 '+r[2]+' 입니다.'};
     if(Math.abs(got[2]-t)>0.02) return {ok:false, msg:'참값은 '+r[3]+' 입니다.'};
     mem.s2=s; mem.t2=t; mem.ok2=true;
     return {ok:true, msg:'계산했습니다 — 참값은 '+r[3]+' 인데 부분합은 '+r[2]+' 입니다. 더할수록 멀어집니다.'};
   }}""",
 """  {t:'판단 — 두 부분합을 참값과 견주고 고르세요',
   f:'①의 부분합 = {0} · ②의 부분합 = {1} · 참값에 다가간 쪽이 ① 이면 1 → {2}',
   opts:['급수는 <b>|x| < 1 에서만</b> 그 함수와 같다 — 반경 안에서는 xⁿ 이 0 으로 가 오차가 사라지지만, 반경 밖에서는 xⁿ 이 커져 항을 늘릴수록 멀어진다',
         '항을 늘리면 어떤 x 에서든 정확해진다',
         '참값이 음수면 급수는 언제나 발산한다'],
   chk(got, r, mem, pick){
     if(!mem.ok2) return {ok:false, msg:'② 칸을 먼저 통과하세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-mem.s1)>0.01) return {ok:false, msg:'①에 적은 '+mem.s1+' 입니다.'};
     if(Math.abs(got[1]-mem.s2)>0.05) return {ok:false, msg:'②에 적은 '+mem.s2+' 입니다.'};
     if(Math.abs(got[2]-1)>0.01) return {ok:false, msg:'참값에 다가간 쪽은 ① 이었습니다.'};
     if(pick!==0)
       return {ok:false, msg:'x = 0.5 에서는 참값에 붙었고 x = 1.2 에서는 멀어졌습니다. 무엇이 그 경계를 정할까요? 다시 고르세요.'};
     return {ok:true, msg:'판단했습니다 — <b>부분합은 (1 − xⁿ)/(1 − x) 입니다.</b> |x| < 1 이면 xⁿ 이 0 으로 가 참값 1/(1−x) 가 되고, |x| ≥ 1 이면 xⁿ 이 커져 더할수록 나빠집니다. 이 경계가 수렴반경입니다.'};
   }}""")
 +
 note(265, '내가 길을 고르고 · 내가 가까이 가고 · 내가 판단한다',
 """  {t:'기록 — <b>길의 기울기 m 을 1</b> 로 두고 적으세요',
   f:'m = {0} · 원점까지의 거리 = {1} · f 값 = {2}',
   chk(got, r, mem){
     if(!r) return {ok:false, msg:'아직 화면 값이 없습니다.'};
     const m=noteNum(r[0]), t=noteNum(r[1]), v=noteNum(r[2]), vl=noteNum(r[3]);
     if(!(Math.abs(vl)>0.2)) return {ok:false, msg:'이 길의 값이 '+r[3]+' 입니다 — m 을 1 로 두어 가로축과 다른 길로 가세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-m)>0.05) return {ok:false, msg:'m 은 '+r[0]+' 입니다.'};
     if(Math.abs(got[1]-t)>0.02) return {ok:false, msg:'거리는 '+r[1]+' 입니다.'};
     if(Math.abs(got[2]-v)>0.01) return {ok:false, msg:'f 값은 '+r[2]+' 입니다.'};
     mem.v1=v; mem.t1=t;
     return {ok:true, msg:'기록했습니다 — 이 길에서는 f 가 '+r[2]+' 입니다. 더 가까이 가 봅시다.'};
   }}""",
 """  {t:'생각 — 같은 길에서 <b>거리를 0.1 이하</b> 로 줄이고 적으세요',
   f:'거리 = {0} · f 값 = {1} · ①의 f 값과의 차 = {2}',
   chk(got, r, mem){
     if(mem.v1===undefined) return {ok:false, msg:'① 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const t=noteNum(r[1]), v=noteNum(r[2]);
     if(!(t<=0.1)) return {ok:false, msg:'거리가 '+r[1]+' 입니다 — 0.1 이하로 줄이세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-t)>0.02) return {ok:false, msg:'거리는 '+r[1]+' 입니다.'};
     if(Math.abs(got[1]-v)>0.01) return {ok:false, msg:'f 값은 '+r[2]+' 입니다.'};
     if(Math.abs(got[2]-(v-mem.v1))>0.01) return {ok:false, msg:'①의 f 값 '+mem.v1+' 을 빼면 얼마인가요?'};
     mem.v2=v; mem.ok2=true;
     return {ok:true, msg:'계산했습니다 — 백 배 가까이 갔는데도 값이 그대로입니다. 길 위에서는 거리가 사라집니다.'};
   }}""",
 """  {t:'판단 — 두 길의 값을 나란히 두고 고르세요',
   f:'m = 0 인 길의 값 = {0} · m = 1 인 길의 값 = {1} · 극한이 있으면 1, 없으면 0 → {2}',
   opts:['어느 길로 가도 <b>같은 값</b> 이 나와야 극한이다 — y = mx 를 넣으면 f = m/(1 + m²) 으로 거리가 사라지고 길마다 값이 다르므로, 원점에서 극한은 없다',
         '가까이 갈수록 값이 변하지 않으니 극한이 있다',
         '두 길의 값을 평균하면 그것이 극한이다'],
   chk(got, r, mem, pick){
     if(!mem.ok2) return {ok:false, msg:'② 칸을 먼저 통과하세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0])>0.01) return {ok:false, msg:'화면에 적힌 「가로축 길(m = 0)의 값」 을 보세요.'};
     if(Math.abs(got[1]-mem.v1)>0.01) return {ok:false, msg:'①에 적은 '+mem.v1+' 입니다.'};
     if(Math.abs(got[2])>0.01) return {ok:false, msg:'두 길의 값이 다른데 극한이 있다고 할 수 있을까요?'};
     if(pick!==0)
       return {ok:false, msg:'거리를 줄여도 값은 그대로였지만, 길을 바꾸면 값이 달라졌습니다. 극한이 있다는 말은 무슨 뜻일까요? 다시 고르세요.'};
     return {ok:true, msg:'판단했습니다 — <b>길마다 값이 다르면 극한은 없습니다.</b> 평면에서는 다가가는 길이 무한히 많으므로, 한 길에서 값이 정해지는 것만으로는 극한이 있다고 말할 수 없습니다.'};
   }}""")
 +
 note(266, '내가 옮기고 · 내가 재고 · 내가 판단한다',
 """  {t:'기록 — 점을 <b>중심 가까이</b> 둔 채 적으세요 (|∇f| 가 2 보다 작은 곳)',
   f:'x² 의 계수 a = {0} · 그 점의 f 값 = {1} · |∇f| = {2}',
   chk(got, r, mem){
     if(!r) return {ok:false, msg:'아직 화면 값이 없습니다.'};
     const a=noteNum(r[0]), v=noteNum(r[2]), g=noteNum(r[3]);
     if(!(g<2)) return {ok:false, msg:'|∇f| 가 '+r[3]+' 입니다 — 점을 중심 가까이 두세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-a)>0.05) return {ok:false, msg:'a 는 '+r[0]+' 의 첫 수입니다.'};
     if(Math.abs(got[1]-v)>0.01) return {ok:false, msg:'f 값은 '+r[2]+' 입니다.'};
     if(Math.abs(got[2]-g)>0.01) return {ok:false, msg:'|∇f| 는 '+r[3]+' 입니다.'};
     mem.g1=g;
     return {ok:true, msg:'기록했습니다 — 여기서는 |∇f| 가 '+r[3]+' 입니다. 등고선이 촘촘한 곳으로 가 봅시다.'};
   }}""",
 """  {t:'생각 — 점을 <b>(2, 2) 쪽</b> 으로 옮기고 ①의 몇 배인지 적으세요',
   f:'그 점의 f 값 = {0} · |∇f| = {1} · ①의 몇 배 = {2}',
   chk(got, r, mem){
     if(mem.g1===undefined) return {ok:false, msg:'① 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const v=noteNum(r[2]), g=noteNum(r[3]);
     if(!(g>=5)) return {ok:false, msg:'|∇f| 가 '+r[3]+' 입니다 — 점을 더 밖으로 옮기세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-v)>0.01) return {ok:false, msg:'f 값은 '+r[2]+' 입니다.'};
     if(Math.abs(got[1]-g)>0.01) return {ok:false, msg:'|∇f| 는 '+r[3]+' 입니다.'};
     if(Math.abs(got[2]-g/mem.g1)>0.3) return {ok:false, msg:'|∇f| 를 ①의 '+mem.g1+' 로 나누면 얼마인가요?'};
     mem.g2=g; mem.ok2=true;
     return {ok:true, msg:'계산했습니다 — 같은 등고선 지도인데 기울기가 '+(g/mem.g1).toFixed(1)+' 배가 되었습니다.'};
   }}""",
 """  {t:'판단 — 두 |∇f| 를 나란히 두고 고르세요',
   f:'①의 |∇f| = {0} · ②의 |∇f| = {1} · 등고선이 더 촘촘한 쪽이 ② 이면 1 → {2}',
   opts:['<b>등고선이 촘촘한 곳이 가파른 곳</b> 이다 — x² + y² = k 의 반지름이 √k 로 자라므로 밖으로 갈수록 간격이 좁아지고, ∇f 는 등고선과 직각이며 그 길이가 가파름이다',
         '등고선 간격은 어디서나 같고 색만 다르다',
         '등고선이 촘촘한 곳에서는 높이가 변하지 않는다'],
   chk(got, r, mem, pick){
     if(!mem.ok2) return {ok:false, msg:'② 칸을 먼저 통과하세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-mem.g1)>0.01) return {ok:false, msg:'①에 적은 '+mem.g1+' 입니다.'};
     if(Math.abs(got[1]-mem.g2)>0.01) return {ok:false, msg:'②에 적은 '+mem.g2+' 입니다.'};
     if(Math.abs(got[2]-1)>0.01) return {ok:false, msg:'|∇f| 가 더 큰 쪽이 더 촘촘한 쪽입니다.'};
     if(pick!==0)
       return {ok:false, msg:'중심 가까이에서는 '+mem.g1+' 이고 밖에서는 '+mem.g2+' 였습니다. 등고선 간격과 무슨 관계일까요? 다시 고르세요.'};
     return {ok:true, msg:'판단했습니다 — <b>간격이 좁을수록 가파릅니다.</b> 지도에서 등고선이 몰려 있는 곳이 급경사이고, 그 가파름의 크기가 바로 |∇f| 입니다.'};
   }}""")
 +
 note(267, '내가 붙잡고 · 내가 옮기고 · 내가 판단한다',
 """  {t:'기록 — 점을 <b>x = 1 · y = 0.5</b> 에 두고 두 기울기를 적으세요',
   f:'f 값 = {0} · ∂f/∂x = {1} · ∂f/∂y = {2}',
   chk(got, r, mem){
     if(!r) return {ok:false, msg:'아직 화면 값이 없습니다.'};
     const v=noteNum(r[1]), fx=noteNum(r[2]), fy=noteNum(r[3]);
     if(Math.abs(noteNum(r[0])-1)>0.01) return {ok:false, msg:'점이 '+r[0]+' 입니다 — x = 1 로 두세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-v)>0.01) return {ok:false, msg:'f 값은 '+r[1]+' 입니다.'};
     if(Math.abs(got[1]-fx)>0.01) return {ok:false, msg:'∂f/∂x 는 '+r[2]+' 입니다.'};
     if(Math.abs(got[2]-fy)>0.01) return {ok:false, msg:'∂f/∂y 는 '+r[3]+' 입니다.'};
     mem.fx1=fx; mem.fy1=fy;
     return {ok:true, msg:'기록했습니다 — 같은 점인데 기울기가 '+r[2]+' 와 '+r[3]+' 로 둘입니다. 점을 옮겨 봅시다.'};
   }}""",
 """  {t:'생각 — 점을 <b>x = 2 · y = 1</b> 로 옮기고 다시 적으세요',
   f:'f 값 = {0} · ∂f/∂x = {1} · ∂f/∂y = {2}',
   chk(got, r, mem){
     if(mem.fx1===undefined) return {ok:false, msg:'① 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const v=noteNum(r[1]), fx=noteNum(r[2]), fy=noteNum(r[3]);
     if(!(noteNum(r[0])>=1.5)) return {ok:false, msg:'점이 '+r[0]+' 입니다 — x = 2 로 옮기세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-v)>0.01) return {ok:false, msg:'f 값은 '+r[1]+' 입니다.'};
     if(Math.abs(got[1]-fx)>0.01) return {ok:false, msg:'∂f/∂x 는 '+r[2]+' 입니다.'};
     if(Math.abs(got[2]-fy)>0.01) return {ok:false, msg:'∂f/∂y 는 '+r[3]+' 입니다.'};
     mem.fx2=fx; mem.fy2=fy; mem.ok2=true;
     return {ok:true, msg:'계산했습니다 — 점이 바뀌니 두 기울기도 함께 바뀌었습니다.'};
   }}""",
 """  {t:'판단 — 두 편미분을 더해 보고 고르세요',
   f:'①의 ∂f/∂x = {0} · ②의 ∂f/∂x = {1} · ②에서 ∂f/∂x + ∂f/∂y = {2}',
   opts:['편미분은 <b>다른 변수를 상수로 보고</b> 한 방향으로만 움직였을 때의 기울기다 — 두 변수를 함께 움직이면 두 편미분의 합(방향도함수)이 되고, 점이 바뀌면 기울기도 바뀐다',
         '편미분은 점이 바뀌어도 늘 같은 값이다',
         '두 변수를 함께 움직이면 기울기는 두 편미분의 곱이 된다'],
   chk(got, r, mem, pick){
     if(!mem.ok2) return {ok:false, msg:'② 칸을 먼저 통과하세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-mem.fx1)>0.01) return {ok:false, msg:'①에 적은 '+mem.fx1+' 입니다.'};
     if(Math.abs(got[1]-mem.fx2)>0.01) return {ok:false, msg:'②에 적은 '+mem.fx2+' 입니다.'};
     if(Math.abs(got[2]-(mem.fx2+mem.fy2))>0.02) return {ok:false, msg:'②의 두 편미분 '+mem.fx2+' 와 '+mem.fy2+' 를 더하세요.'};
     if(pick!==0)
       return {ok:false, msg:'한 변수를 붙잡으면 기울기가 하나로 정해졌고, 둘을 함께 움직이면 그 합이 되었습니다. 편미분이란 무엇일까요? 다시 고르세요.'};
     return {ok:true, msg:'판단했습니다 — <b>붙잡아 둔 변수는 상수와 같습니다.</b> 그래서 ∂f/∂x 는 y 를 상수로 보고 미분한 것이고, 방향을 비스듬히 잡으면 두 편미분이 섞인 방향도함수가 됩니다.'};
   }}""")
 +
 note(268, '내가 좁히고 · 내가 재고 · 내가 판단한다',
 """  {t:'기록 — <b>범위를 0.3 이상</b> 으로 넓게 두고 적으세요',
   f:'범위 R = {0} · 곡면과 접평면의 최대 차이 = {1}',
   chk(got, r, mem){
     if(!r) return {ok:false, msg:'아직 화면 값이 없습니다.'};
     const R=noteNum(r[1]), w=noteNum(r[2]);
     if(String(r[3])!=='아니오') return {ok:false, msg:'「기울기 하나만 쓰기」 를 끄고 적으세요 — ②에서 쓸 것입니다.'};
     if(!(R>=0.3)) return {ok:false, msg:'범위가 '+r[1]+' 입니다 — 0.3 이상으로 넓히세요.'};
     if(![0,1].every(j=>isFinite(got[j]))) return {ok:false, msg:'두 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-R)>0.02) return {ok:false, msg:'범위는 '+r[1]+' 입니다.'};
     if(Math.abs(got[1]-w)>0.005) return {ok:false, msg:'최대 차이는 '+r[2]+' 입니다.'};
     mem.R1=R; mem.w1=w;
     return {ok:true, msg:'기록했습니다 — 이만큼 넓게 보면 차이가 '+r[2]+' 입니다. 창을 반으로 좁혀 봅시다.'};
   }}""",
 """  {t:'생각 — <b>범위를 0.2 이하</b> 로 좁히고 ①의 몇 분의 1 인지 적으세요',
   f:'범위 R = {0} · 최대 차이 = {1} · ①의 몇 분의 1 = {2}',
   chk(got, r, mem){
     if(mem.w1===undefined) return {ok:false, msg:'① 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const R=noteNum(r[1]), w=noteNum(r[2]);
     if(String(r[3])!=='아니오') return {ok:false, msg:'「기울기 하나만 쓰기」 를 끄고 적으세요.'};
     if(!(R<=0.2)) return {ok:false, msg:'범위가 '+r[1]+' 입니다 — 0.2 이하로 좁히세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-R)>0.02) return {ok:false, msg:'범위는 '+r[1]+' 입니다.'};
     if(Math.abs(got[1]-w)>0.005) return {ok:false, msg:'최대 차이는 '+r[2]+' 입니다.'};
     if(w<=1e-9) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     if(Math.abs(got[2]-mem.w1/w)>0.4) return {ok:false, msg:'①의 '+mem.w1+' 을 '+r[2]+' 로 나누면 얼마인가요?'};
     mem.w2=w; mem.ok2=true;
     return {ok:true, msg:'계산했습니다 — 범위를 반으로 줄였더니 차이가 넷으로 줄었습니다.'};
   }}""",
 """  {t:'판단 — 두 차이를 나란히 두고 고르세요',
   f:'①의 차이 = {0} · ②의 차이 = {1} · R 를 반으로 줄이면 차이는 몇 분의 1 = {2}',
   opts:['차이가 <b>R² 로 줄기 때문에</b> 아주 가까이서는 곡면과 접평면을 구별할 수 없다 — 차이가 (x−a)² + (y−b)² 이라 일차항이 모두 사라지고, 기울기 둘을 모두 써야 그렇게 된다',
         '차이가 R 에 비례해 줄어든다',
         '범위를 좁혀도 차이는 그대로다'],
   chk(got, r, mem, pick){
     if(!mem.ok2) return {ok:false, msg:'② 칸을 먼저 통과하세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-mem.w1)>0.005) return {ok:false, msg:'①에 적은 '+mem.w1+' 입니다.'};
     if(Math.abs(got[1]-mem.w2)>0.005) return {ok:false, msg:'②에 적은 '+mem.w2+' 입니다.'};
     if(Math.abs(got[2]-4)>0.4) return {ok:false, msg:'R 를 반으로 줄였을 때 차이는 몇 분의 1 이 되었나요?'};
     if(pick!==0)
       return {ok:false, msg:'범위를 반으로 줄였더니 차이가 넷으로 줄었습니다. 차이는 R 의 몇 제곱으로 줄어드는 것일까요? 다시 고르세요.'};
     return {ok:true, msg:'판단했습니다 — <b>가까이서는 곡면도 평평합니다.</b> 차이가 R² 로 줄기 때문에 접평면은 곡면의 「가장 좋은 일차 근사」 가 되고, 기울기 하나만 쓰면 차이가 R 로만 줄어 접하지 못합니다.'};
   }}""")
 +
 note(269, '내가 돌리고 · 내가 재고 · 내가 판단한다',
 """  {t:'기록 — 방향을 <b>가장 가파른 쪽이 아닌 곳</b> 에 두고 적으세요',
   f:'방향 = {0} ° · 그 방향의 변화율 = {1} · |∇f| = {2}',
   chk(got, r, mem){
     if(!r) return {ok:false, msg:'아직 화면 값이 없습니다.'};
     const th=noteNum(r[1]), d=noteNum(r[2]), gn=noteNum(r[3]);
     if(!(gn-Math.abs(d)>0.05)) return {ok:false, msg:'이미 가장 가파른 방향입니다 — ②에서 볼 테니 방향을 돌려 두세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-th)>0.5) return {ok:false, msg:'방향은 '+r[1]+' 입니다.'};
     if(Math.abs(got[1]-d)>0.01) return {ok:false, msg:'변화율은 '+r[2]+' 입니다.'};
     if(Math.abs(got[2]-gn)>0.01) return {ok:false, msg:'|∇f| 는 '+r[3]+' 입니다.'};
     mem.d1=d; mem.gn=gn;
     return {ok:true, msg:'기록했습니다 — 변화율 '+r[2]+' 가 |∇f| '+r[3]+' 보다 작습니다. 가장 가파른 방향으로 가 봅시다.'};
   }}""",
 """  {t:'생각 — <b>「가장 가파른 방향으로」</b> 를 누르고 다시 적으세요',
   f:'방향 = {0} ° · 그 방향의 변화율 = {1} · |∇f| = {2}',
   chk(got, r, mem){
     if(mem.gn===undefined) return {ok:false, msg:'① 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const th=noteNum(r[1]), d=noteNum(r[2]), gn=noteNum(r[3]);
     if(!(gn-Math.abs(d)<0.01)) return {ok:false, msg:'변화율이 '+r[2]+' 로 |∇f| '+r[3]+' 보다 작습니다 — 「가장 가파른 방향으로」 를 누르세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-th)>0.5) return {ok:false, msg:'방향은 '+r[1]+' 입니다.'};
     if(Math.abs(got[1]-d)>0.01) return {ok:false, msg:'변화율은 '+r[2]+' 입니다.'};
     if(Math.abs(got[2]-gn)>0.01) return {ok:false, msg:'|∇f| 는 '+r[3]+' 입니다.'};
     mem.d2=d; mem.ok2=true;
     return {ok:true, msg:'계산했습니다 — 변화율이 |∇f| 와 같아졌습니다. 더 가파른 방향은 없습니다.'};
   }}""",
 """  {t:'판단 — 변화율이 0 이 되는 방향까지 몇 ° 인지 적고 고르세요',
   f:'②의 변화율 = {0} · |∇f| = {1} · 변화율이 0 이 되려면 몇 ° 돌리는가 = {2}',
   opts:['변화율은 <b>∇f · u = |∇f| cos θ</b> 다 — 그래서 ∇f 와 같은 방향에서 |∇f| 로 가장 커지고, 직각으로 90° 돌리면 0 이 되며 그 방향이 바로 등고선이다',
         '방향을 돌릴수록 변화율이 한없이 커진다',
         '변화율이 0 이 되는 방향은 ∇f 와 같은 방향이다'],
   chk(got, r, mem, pick){
     if(!mem.ok2) return {ok:false, msg:'② 칸을 먼저 통과하세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-mem.d2)>0.01) return {ok:false, msg:'②에 적은 '+mem.d2+' 입니다.'};
     if(Math.abs(got[1]-mem.gn)>0.01) return {ok:false, msg:'|∇f| 는 '+mem.gn+' 입니다.'};
     if(Math.abs(got[2]-90)>2) return {ok:false, msg:'cos θ 가 0 이 되는 θ 를 생각하세요.'};
     if(pick!==0)
       return {ok:false, msg:'가장 가파른 방향에서 변화율이 |∇f| 였습니다. 방향을 돌리면 변화율이 어떤 꼴로 바뀌던가요? 다시 고르세요.'};
     return {ok:true, msg:'판단했습니다 — <b>∇f 는 모든 방향의 기울기를 한 벡터에 담고 있습니다.</b> 가장 빨리 오르는 방향이 ∇f 이고 그 변화율이 |∇f| 이며, 직각 방향은 높이가 그대로인 등고선입니다. 경사하강법은 이 방향의 반대로 걷는 것입니다.'};
   }}""")
 +
 note(270, '내가 휘고 · 내가 되돌리고 · 내가 판단한다',
 """  {t:'기록 — <b>y 방향의 휨 b 를 음수</b> 로 두고 적으세요',
   f:'a = {0} · b = {1} · 4ab − c² = {2}',
   chk(got, r, mem){
     if(!r) return {ok:false, msg:'아직 화면 값이 없습니다.'};
     const a=noteNum(r[0]), b=noteNum(r[1]), D=noteNum(r[3]);
     if(!(D<-0.01)) return {ok:false, msg:'판정식이 '+r[3]+' 입니다 — b 를 음수로 두어 0 보다 작게 하세요.'};
     if(String(r[4])!=='안장점') return {ok:false, msg:'화면은 «'+r[4]+'» 이라고 합니다 — 판정식이 음수여야 안장점입니다.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-a)>0.05) return {ok:false, msg:'a 는 '+r[0]+' 입니다.'};
     if(Math.abs(got[1]-b)>0.05) return {ok:false, msg:'b 는 '+r[1]+' 입니다.'};
     if(Math.abs(got[2]-D)>0.05) return {ok:false, msg:'판정식은 '+r[3]+' 입니다.'};
     mem.d1=D;
     return {ok:true, msg:'기록했습니다 — 한쪽으로는 오르고 다른 쪽으로는 내려가는 안장점입니다. 극소로 되돌려 봅시다.'};
   }}""",
 """  {t:'생각 — <b>b 를 1 로 되돌리고 섞임 c 를 0</b> 으로 두고 적으세요',
   f:'b = {0} · c = {1} · 4ab − c² = {2}',
   chk(got, r, mem){
     if(mem.d1===undefined) return {ok:false, msg:'① 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const b=noteNum(r[1]), c=noteNum(r[2]), D=noteNum(r[3]);
     if(!(D>0.01)) return {ok:false, msg:'판정식이 '+r[3]+' 입니다 — b 를 1 로 되돌리세요.'};
     if(String(r[4])!=='극소') return {ok:false, msg:'화면은 «'+r[4]+'» 이라고 합니다 — a 와 b 를 모두 양수로 두세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-b)>0.05) return {ok:false, msg:'b 는 '+r[1]+' 입니다.'};
     if(Math.abs(got[1]-c)>0.05) return {ok:false, msg:'c 는 '+r[2]+' 입니다.'};
     if(Math.abs(got[2]-D)>0.05) return {ok:false, msg:'판정식은 '+r[3]+' 입니다.'};
     mem.d2=D; mem.ok2=true;
     return {ok:true, msg:'계산했습니다 — 판정식이 '+r[3]+' 로 0 보다 크고 등고선이 원이 되었습니다.'};
   }}""",
 """  {t:'판단 — c 를 2 로 바꿨을 때의 판정식을 구해 보고 고르세요',
   f:'①의 판정식 = {0} · ②의 판정식 = {1} · a = 1 · b = 1 · c = 2 일 때의 판정식 = {2}',
   opts:['두 방향 모두 위로 휘어도(a > 0, b > 0) <b>섞임 c 가 크면</b> 4ab − c² 이 0 보다 작아져 안장점이 된다 — 휨만 보고는 알 수 없고 판정식의 부호를 봐야 하며, 0 이면 이차항만으로는 판정할 수 없다',
         'a 와 b 가 모두 양수면 언제나 극소다',
         '판정식이 0 이면 극값도 안장점도 아닌 평면이다'],
   chk(got, r, mem, pick){
     if(!mem.ok2) return {ok:false, msg:'② 칸을 먼저 통과하세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-mem.d1)>0.05) return {ok:false, msg:'①에 적은 '+mem.d1+' 입니다.'};
     if(Math.abs(got[1]-mem.d2)>0.05) return {ok:false, msg:'②에 적은 '+mem.d2+' 입니다.'};
     if(Math.abs(got[2])>0.05) return {ok:false, msg:'4 × 1 × 1 − 2² 를 계산하세요.'};
     if(pick!==0)
       return {ok:false, msg:'b 가 음수일 때도, a 와 b 가 양수인데 c 가 클 때도 판정식이 0 보다 작았습니다. 무엇이 판정을 가를까요? 다시 고르세요.'};
     return {ok:true, msg:'판단했습니다 — <b>기울기가 0 이어도 극값이 아닐 수 있습니다.</b> 4ab − c² 이 양수면 극값, 음수면 안장점, 0 이면 이차항만으로는 알 수 없습니다. 기계학습의 최적화가 안장점에서 멈춰 버리는 것도 이 때문입니다.'};
   }}""")
)
