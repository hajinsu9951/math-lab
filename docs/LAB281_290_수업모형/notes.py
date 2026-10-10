# -*- coding: utf-8 -*-
"""LAB 281~290 탐구 노트 — 기록 → 생각 → 판단. 판정은 화면의 read() 값으로만 한다."""


def note(no, head, c1, c2, c3):
    return "\n %d:{ h:'%s',\n  c:[\n%s,\n%s,\n%s\n ]},\n" % (no, head, c1, c2, c3)


NOTES = (
 note(281, '내가 긋고 · 내가 돌리고 · 내가 판단한다',
 """  {t:'기록 — 점을 <b>원 밖</b> 에 둔 채 한 방향에서 적으세요',
   f:'거리 d = {0} · PA × PB = {1} · d² − r² = {2}',
   chk(got, r, mem){
     if(!r) return {ok:false, msg:'아직 화면 값이 없습니다.'};
     const d=noteNum(r[0]), a=noteNum(r[1]), p=noteNum(r[2]), q=noteNum(r[3]);
     if(!(q>0.05)) return {ok:false, msg:'점이 원 안에 있습니다 — 거리를 1.4 보다 크게 하세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-d)>0.05) return {ok:false, msg:'거리는 '+r[0]+' 입니다.'};
     if(Math.abs(got[1]-p)>0.02) return {ok:false, msg:'PA × PB 는 '+r[2]+' 입니다.'};
     if(Math.abs(got[2]-q)>0.02) return {ok:false, msg:'d² − r² 는 '+r[3]+' 입니다.'};
     mem.p1=p; mem.a1=a;
     return {ok:true, msg:'기록했습니다 — 두 거리의 곱이 '+r[2]+' 이고 d² − r² 도 같습니다. 방향을 바꿔 봅시다.'};
   }}""",
 """  {t:'생각 — <b>할선의 각도만</b> 바꾸고 다시 적으세요',
   f:'각 = {0} ° · PA × PB = {1} · ①의 곱과의 차 = {2}',
   chk(got, r, mem){
     if(mem.p1===undefined) return {ok:false, msg:'① 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const a=noteNum(r[1]), p=noteNum(r[2]);
     if(Math.abs(a-mem.a1)<1) return {ok:false, msg:'각이 그대로입니다 — 할선의 각도를 바꾸세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-a)>1) return {ok:false, msg:'각은 '+r[1]+' 입니다.'};
     if(Math.abs(got[1]-p)>0.02) return {ok:false, msg:'PA × PB 는 '+r[2]+' 입니다.'};
     if(Math.abs(got[2]-(p-mem.p1))>0.02) return {ok:false, msg:'①의 '+mem.p1+' 을 빼면 얼마인가요?'};
     mem.p2=p; mem.ok2=true;
     return {ok:true, msg:'계산했습니다 — 방향을 바꿨는데 곱이 그대로입니다.'};
   }}""",
 """  {t:'판단 — 점을 원 안에 넣었을 때를 떠올리며 고르세요',
   f:'①의 곱 = {0} · ②의 곱 = {1} · d = 0.5 일 때 d² − r² (r = 1.3) = {2}',
   opts:['할선의 방향과 상관없이 곱은 <b>d² − r²</b> 하나로 정해진다 — 이것이 방멱이고, 점이 원 안이면 음수가 되어 두 거리가 반대 방향임을 알려 준다',
         '각이 커질수록 두 거리의 곱도 커진다',
         '점이 원 안에 있으면 방멱이 0 이 된다'],
   chk(got, r, mem, pick){
     if(!mem.ok2) return {ok:false, msg:'② 칸을 먼저 통과하세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-mem.p1)>0.02) return {ok:false, msg:'①에 적은 '+mem.p1+' 입니다.'};
     if(Math.abs(got[1]-mem.p2)>0.02) return {ok:false, msg:'②에 적은 '+mem.p2+' 입니다.'};
     if(Math.abs(got[2]-(0.25-1.69))>0.02) return {ok:false, msg:'0.5² − 1.3² 을 계산하세요.'};
     if(pick!==0)
       return {ok:false, msg:'각을 바꿔도 곱이 같았고, 점이 원 안으로 들어가자 음수가 되었습니다. 무엇이 값을 정할까요? 다시 고르세요.'};
     return {ok:true, msg:'판단했습니다 — <b>방멱은 점 하나로 정해집니다.</b> 어떤 할선을 그어도 PA × PB = d² − r² 이고, 접선을 그으면 그 길이의 제곱이 바로 이 값입니다.'};
   }}""")
 +
 note(282, '내가 옮기고 · 내가 맞추고 · 내가 판단한다',
 """  {t:'기록 — 두 방멱이 <b>다른 점</b> 에서 적으세요',
   f:'왼쪽 방멱 = {0} · 오른쪽 방멱 = {1} · 차이 = {2}',
   chk(got, r, mem){
     if(!r) return {ok:false, msg:'아직 화면 값이 없습니다.'};
     const p1=noteNum(r[1]), p2=noteNum(r[2]), g=noteNum(r[3]);
     if(!(Math.abs(g)>=0.15)) return {ok:false, msg:'지금 두 방멱이 거의 같습니다 — ②에서 볼 테니 점을 옮겨 두세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-p1)>0.02) return {ok:false, msg:'왼쪽 방멱은 '+r[1]+' 입니다.'};
     if(Math.abs(got[1]-p2)>0.02) return {ok:false, msg:'오른쪽 방멱은 '+r[2]+' 입니다.'};
     if(Math.abs(got[2]-g)>0.02) return {ok:false, msg:'차이는 '+r[3]+' 입니다.'};
     mem.g1=g;
     return {ok:true, msg:'기록했습니다 — 두 방멱이 '+r[3]+' 만큼 다릅니다. 같아지는 자리를 찾아봅시다.'};
   }}""",
 """  {t:'생각 — 점을 옮겨 <b>차이를 0</b> 에 가깝게 하고 적으세요',
   f:'왼쪽 방멱 = {0} · 오른쪽 방멱 = {1} · 차이 = {2}',
   chk(got, r, mem){
     if(mem.g1===undefined) return {ok:false, msg:'① 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const p1=noteNum(r[1]), p2=noteNum(r[2]), g=noteNum(r[3]);
     if(!(Math.abs(g)<0.15)) return {ok:false, msg:'차이가 '+r[3]+' 입니다 — 점의 x 를 옮겨 0 에 가깝게 하세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-p1)>0.02) return {ok:false, msg:'왼쪽 방멱은 '+r[1]+' 입니다.'};
     if(Math.abs(got[1]-p2)>0.02) return {ok:false, msg:'오른쪽 방멱은 '+r[2]+' 입니다.'};
     if(Math.abs(got[2]-g)>0.02) return {ok:false, msg:'차이는 '+r[3]+' 입니다.'};
     mem.g2=g; mem.ok2=true;
     return {ok:true, msg:'계산했습니다 — 두 방멱이 같아졌습니다. 이런 점들이 모여 근축이 됩니다.'};
   }}""",
 """  {t:'판단 — 두 차이를 나란히 두고 고르세요',
   f:'①의 차이 = {0} · ②의 차이 = {1} · 근축 위에서 두 방멱의 차이 = {2}',
   opts:['두 방멱이 같은 점들은 <b>중심선에 수직인 한 직선</b> 을 이룬다 — 두 식을 빼면 y² 이 지워져 x 에 대한 일차식만 남기 때문이고, 두 원이 만나지 않아도 이 직선은 그대로 있다',
         '두 원이 만나야만 그런 점이 생긴다',
         '두 방멱이 같은 점은 두 원의 한가운데 한 점뿐이다'],
   chk(got, r, mem, pick){
     if(!mem.ok2) return {ok:false, msg:'② 칸을 먼저 통과하세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-mem.g1)>0.02) return {ok:false, msg:'①에 적은 '+mem.g1+' 입니다.'};
     if(Math.abs(got[1]-mem.g2)>0.02) return {ok:false, msg:'②에 적은 '+mem.g2+' 입니다.'};
     if(Math.abs(got[2])>0.02) return {ok:false, msg:'근축 위에서는 두 방멱이 같습니다.'};
     if(pick!==0)
       return {ok:false, msg:'두 원을 떼어 만나지 않게 해도 근축은 그대로 있었습니다. 그 점들은 어떤 모양일까요? 다시 고르세요.'};
     return {ok:true, msg:'판단했습니다 — <b>근축은 중심선에 수직인 직선입니다.</b> 두 원이 만나면 그 교점을 지나고, 만나지 않아도 자리는 그대로 있습니다.'};
   }}""")
 +
 note(283, '내가 떨어뜨리고 · 내가 당기고 · 내가 판단한다',
 """  {t:'기록 — 직선을 <b>중심에서 떨어뜨려</b> 원이 되게 하고 적으세요',
   f:'반전 반지름 r = {0} · 거리 c = {1} · 생긴 원의 반지름 = {2}',
   chk(got, r, mem){
     if(!r) return {ok:false, msg:'아직 화면 값이 없습니다.'};
     const rr=noteNum(r[0]), c=noteNum(r[1]), rad=noteNum(r[3]);
     if(String(r[2])!=='원') return {ok:false, msg:'지금은 «'+r[2]+'» 입니다 — 직선을 중심에서 떨어뜨리세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-rr)>0.05) return {ok:false, msg:'반전 반지름은 '+r[0]+' 입니다.'};
     if(Math.abs(got[1]-c)>0.05) return {ok:false, msg:'거리는 '+r[1]+' 입니다.'};
     if(Math.abs(got[2]-rad)>0.02) return {ok:false, msg:'생긴 원의 반지름은 '+r[3]+' 입니다.'};
     mem.c1=c; mem.rad1=rad;
     return {ok:true, msg:'기록했습니다 — 직선이 반지름 '+r[3]+' 인 원이 되었습니다. 거리를 줄여 봅시다.'};
   }}""",
 """  {t:'생각 — <b>거리 c 를 ①의 절반 가까이</b> 로 줄이고 적으세요',
   f:'거리 c = {0} · 생긴 원의 반지름 = {1} · ①의 몇 배 = {2}',
   chk(got, r, mem){
     if(mem.c1===undefined) return {ok:false, msg:'① 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const c=noteNum(r[1]), rad=noteNum(r[3]);
     if(String(r[2])!=='원') return {ok:false, msg:'지금은 «'+r[2]+'» 입니다 — 거리를 0 보다 크게 두세요.'};
     if(!(c<mem.c1-0.05)) return {ok:false, msg:'거리가 '+r[1]+' 입니다 — ①의 '+mem.c1+' 보다 줄이세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-c)>0.05) return {ok:false, msg:'거리는 '+r[1]+' 입니다.'};
     if(Math.abs(got[1]-rad)>0.02) return {ok:false, msg:'반지름은 '+r[3]+' 입니다.'};
     if(Math.abs(got[2]-rad/mem.rad1)>0.1) return {ok:false, msg:'①의 '+mem.rad1+' 로 나누면 얼마인가요?'};
     mem.rad2=rad; mem.ok2=true;
     return {ok:true, msg:'계산했습니다 — 거리를 줄였더니 원이 커졌습니다.'};
   }}""",
 """  {t:'판단 — 두 반지름을 나란히 두고 고르세요',
   f:'①의 반지름 = {0} · ②의 반지름 = {1} · c 가 반으로 줄면 반지름은 몇 배 = {2}',
   opts:['중심을 지나지 않는 직선은 <b>중심을 지나는 원</b> 이 된다 — 반지름이 r² ÷ (2c) 이므로 c 가 반이 되면 반지름은 두 배가 되고, c = 0 이면 반지름이 무한이 되어 직선 그대로 남는다',
         '직선은 반전해도 언제나 직선이다',
         '거리 c 가 커질수록 생기는 원도 커진다'],
   chk(got, r, mem, pick){
     if(!mem.ok2) return {ok:false, msg:'② 칸을 먼저 통과하세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-mem.rad1)>0.02) return {ok:false, msg:'①에 적은 '+mem.rad1+' 입니다.'};
     if(Math.abs(got[1]-mem.rad2)>0.02) return {ok:false, msg:'②에 적은 '+mem.rad2+' 입니다.'};
     if(Math.abs(got[2]-2)>0.1) return {ok:false, msg:'r² ÷ (2c) 에서 c 가 반이 되면 어떻게 되나요?'};
     if(pick!==0)
       return {ok:false, msg:'거리를 줄이자 원이 커졌고, 0 으로 하자 직선이 되었습니다. 규칙은 무엇일까요? 다시 고르세요.'};
     return {ok:true, msg:'판단했습니다 — <b>반전은 직선과 원을 서로 바꿉니다.</b> 중심을 지나는 것만 모양이 그대로 남고, 나머지는 원 ↔ 직선으로 넘나듭니다.'};
   }}""")
 +
 note(284, '내가 옮기고 · 내가 펴고 · 내가 판단한다',
 """  {t:'기록 — 반전 중심을 <b>접점에서 벗어난 자리</b> 에 두고 적으세요',
   f:'반전 중심의 위치 = {0} · 두 원의 크기 비 = {1}',
   chk(got, r, mem){
     if(!r) return {ok:false, msg:'아직 화면 값이 없습니다.'};
     const c=noteNum(r[0]), k=noteNum(r[1]);
     if(!(Math.abs(c)>=0.6)) return {ok:false, msg:'중심이 접점에 가깝습니다 — ②에서 볼 테니 0.6 넘게 옮겨 두세요.'};
     if(String(r[2])!=='원') return {ok:false, msg:'화면은 «'+r[2]+'» 이라고 합니다.'};
     if(![0,1].every(j=>isFinite(got[j]))) return {ok:false, msg:'두 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-c)>0.05) return {ok:false, msg:'중심의 위치는 '+r[0]+' 입니다.'};
     if(Math.abs(got[1]-k)>0.05) return {ok:false, msg:'크기 비는 '+r[1]+' 입니다.'};
     mem.c1=c;
     return {ok:true, msg:'기록했습니다 — 중심이 접점 밖에 있으면 상은 여전히 원입니다. 접점으로 옮겨 봅시다.'};
   }}""",
 """  {t:'생각 — 반전 중심을 <b>두 원의 접점(0)</b> 에 두고 적으세요',
   f:'반전 중심의 위치 = {0} · 결과가 직선이면 1, 원이면 0 → {1}',
   chk(got, r, mem){
     if(mem.c1===undefined) return {ok:false, msg:'① 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const c=noteNum(r[0]);
     if(String(r[2])!=='직선') return {ok:false, msg:'화면은 «'+r[2]+'» 이라고 합니다 — 중심을 접점(0)에 두세요.'};
     if(![0,1].every(j=>isFinite(got[j]))) return {ok:false, msg:'두 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-c)>0.05) return {ok:false, msg:'중심의 위치는 '+r[0]+' 입니다.'};
     if(Math.abs(got[1]-1)>0.01) return {ok:false, msg:'지금 두 상은 직선입니다.'};
     mem.c2=c; mem.ok2=true;
     return {ok:true, msg:'계산했습니다 — 두 원이 나란한 두 직선이 되었습니다. 그림이 통째로 단순해졌습니다.'};
   }}""",
 """  {t:'판단 — 나란해진 두 직선 사이를 생각하며 고르세요',
   f:'①의 중심 = {0} · ②의 중심 = {1} · 간격이 2 인 두 직선에 모두 접하는 원의 반지름 = {2}',
   opts:['반전 중심을 <b>접점에 두면</b> 두 원이 모두 중심을 지나므로 나란한 두 직선이 된다 — 어려운 배치가 쉬운 배치로 바뀌고, 끼인 원의 크기가 한눈에 정해진다',
         '반전 중심은 어디에 두어도 결과가 같다',
         '두 원을 직선으로 바꾸려면 중심을 원 밖 멀리 두어야 한다'],
   chk(got, r, mem, pick){
     if(!mem.ok2) return {ok:false, msg:'② 칸을 먼저 통과하세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-mem.c1)>0.05) return {ok:false, msg:'①에 적은 '+mem.c1+' 입니다.'};
     if(Math.abs(got[1]-mem.c2)>0.05) return {ok:false, msg:'②에 적은 '+mem.c2+' 입니다.'};
     if(Math.abs(got[2]-1)>0.05) return {ok:false, msg:'지름이 간격과 같습니다.'};
     if(pick!==0)
       return {ok:false, msg:'중심이 접점에 있을 때만 두 원이 직선이 되었습니다. 그 까닭은 무엇일까요? 다시 고르세요.'};
     return {ok:true, msg:'판단했습니다 — <b>중심을 어디에 두느냐가 전부입니다.</b> 반전 중심을 지나는 원은 직선이 되므로, 접점을 중심으로 삼으면 두 원이 나란한 두 직선이 되어 문제가 단순해집니다.'};
   }}""")
 +
 note(285, '내가 기울이고 · 내가 견주고 · 내가 판단한다',
 """  {t:'기록 — <b>기울이기 전(20° 아래)</b> 에 두 복비를 적으세요',
   f:'기울기 = {0} ° · 원래 복비 = {1} · 옮긴 복비 = {2}',
   chk(got, r, mem){
     if(!r) return {ok:false, msg:'아직 화면 값이 없습니다.'};
     const a=noteNum(r[0]), c1=noteNum(r[1]), c2=noteNum(r[2]);
     if(!(Math.abs(a)<20)) return {ok:false, msg:'기울기가 '+r[0]+' 입니다 — ②에서 크게 기울일 테니 지금은 20° 아래로 두세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-a)>1) return {ok:false, msg:'기울기는 '+r[0]+' 입니다.'};
     if(Math.abs(got[1]-c1)>0.002) return {ok:false, msg:'원래 복비는 '+r[1]+' 입니다.'};
     if(Math.abs(got[2]-c2)>0.002) return {ok:false, msg:'옮긴 복비는 '+r[2]+' 입니다.'};
     mem.cr1=c1;
     return {ok:true, msg:'기록했습니다 — 두 복비가 같습니다. 크게 기울여도 그럴까요?'};
   }}""",
 """  {t:'생각 — <b>20° 넘게 크게 기울이고</b> 다시 적으세요',
   f:'기울기 = {0} ° · 옮긴 복비 = {1} · 원래 복비와의 차 = {2}',
   chk(got, r, mem){
     if(mem.cr1===undefined) return {ok:false, msg:'① 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const a=noteNum(r[0]), c1=noteNum(r[1]), c2=noteNum(r[2]);
     if(!(Math.abs(a)>=20)) return {ok:false, msg:'기울기가 '+r[0]+' 입니다 — 20° 넘게 기울이세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-a)>1) return {ok:false, msg:'기울기는 '+r[0]+' 입니다.'};
     if(Math.abs(got[1]-c2)>0.002) return {ok:false, msg:'옮긴 복비는 '+r[2]+' 입니다.'};
     if(Math.abs(got[2]-(c2-c1))>0.002) return {ok:false, msg:'두 복비의 차는 얼마인가요?'};
     mem.cr2=c2; mem.ok2=true;
     return {ok:true, msg:'계산했습니다 — 크게 기울였는데도 두 복비가 같습니다.'};
   }}""",
 """  {t:'판단 — 길이의 비와 견주어 보고 고르세요',
   f:'①의 복비 = {0} · ②의 복비 = {1} · 기울여도 변하지 않으면 1, 변하면 0 → {2}',
   opts:['한 점에서 쏘아 옮겨 찍어도 <b>복비는 그대로</b> 남는다 — 길이도 길이의 비도 바뀌지만 「비의 비」 인 복비는 보존되고, 그래서 사진 한 장으로도 원래 비율을 되찾을 수 있다',
         '길이의 비도 복비도 모두 보존된다',
         '복비는 기울기가 커질수록 함께 커진다'],
   chk(got, r, mem, pick){
     if(!mem.ok2) return {ok:false, msg:'② 칸을 먼저 통과하세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-mem.cr1)>0.002) return {ok:false, msg:'①에 적은 '+mem.cr1+' 입니다.'};
     if(Math.abs(got[1]-mem.cr2)>0.002) return {ok:false, msg:'②에 적은 '+mem.cr2+' 입니다.'};
     if(Math.abs(got[2]-1)>0.01) return {ok:false, msg:'두 복비가 같았나요, 달랐나요?'};
     if(pick!==0)
       return {ok:false, msg:'길이의 비는 눈에 띄게 달라졌는데 복비는 그대로였습니다. 무엇이 남은 것일까요? 다시 고르세요.'};
     return {ok:true, msg:'판단했습니다 — <b>복비는 사영에서 살아남는 값입니다.</b> 원근법으로 찌그러진 사진에서도 복비를 이용하면 실제 비율을 되살릴 수 있습니다.'};
   }}""")
 +
 note(286, '내가 기울이고 · 내가 밀고 · 내가 판단한다',
 """  {t:'기록 — 지금 평면의 <b>d 와 원점까지 거리</b> 를 적으세요',
   f:'d = {0} · 원점까지 거리 = {1}',
   chk(got, r, mem){
     if(!r) return {ok:false, msg:'아직 화면 값이 없습니다.'};
     const d=noteNum(r[1]), dist=noteNum(r[2]);
     if(!(Math.abs(d)>0.5)) return {ok:false, msg:'d 가 '+r[1]+' 입니다 — 0 이 아닌 값으로 두세요.'};
     if(![0,1].every(j=>isFinite(got[j]))) return {ok:false, msg:'두 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-d)>0.05) return {ok:false, msg:'d 는 '+r[1]+' 입니다.'};
     if(Math.abs(got[1]-dist)>0.02) return {ok:false, msg:'원점까지 거리는 '+r[2]+' 입니다.'};
     mem.d1=d; mem.dist1=dist;
     return {ok:true, msg:'기록했습니다 — d = '+r[1]+' 일 때 거리가 '+r[2]+' 입니다. d 를 키워 봅시다.'};
   }}""",
 """  {t:'생각 — <b>d 를 3 이상</b> 으로 키우고 다시 적으세요 (법선은 그대로)',
   f:'d = {0} · 원점까지 거리 = {1} · ①의 몇 배 = {2}',
   chk(got, r, mem){
     if(mem.d1===undefined) return {ok:false, msg:'① 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const d=noteNum(r[1]), dist=noteNum(r[2]);
     if(!(Math.abs(d)>=3)) return {ok:false, msg:'d 가 '+r[1]+' 입니다 — 3 이상으로 키우세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-d)>0.05) return {ok:false, msg:'d 는 '+r[1]+' 입니다.'};
     if(Math.abs(got[1]-dist)>0.02) return {ok:false, msg:'원점까지 거리는 '+r[2]+' 입니다.'};
     if(Math.abs(got[2]-dist/mem.dist1)>0.1) return {ok:false, msg:'①의 '+mem.dist1+' 로 나누면 얼마인가요?'};
     mem.dist2=dist; mem.d2=d; mem.ok2=true;
     return {ok:true, msg:'계산했습니다 — 기울기는 그대로인데 평면만 원점에서 멀어졌습니다.'};
   }}""",
 """  {t:'판단 — 거리의 식을 거꾸로 써 보고 고르세요',
   f:'①의 거리 = {0} · ②의 거리 = {1} · 법선의 길이 |n| = |d| ÷ 거리 = {2}',
   opts:['법선은 <b>기울기</b> 를, d 는 <b>자리</b> 를 정한다 — 거리가 |d| ÷ |n| 이므로 법선이 같으면 나란한 평면들이 d 에 따라 줄지어 놓인다',
         'd 만 알면 평면이 하나로 정해진다',
         '법선을 두 배로 늘리면 평면도 두 배 멀어진다'],
   chk(got, r, mem, pick){
     if(!mem.ok2) return {ok:false, msg:'② 칸을 먼저 통과하세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-mem.dist1)>0.02) return {ok:false, msg:'①에 적은 '+mem.dist1+' 입니다.'};
     if(Math.abs(got[1]-mem.dist2)>0.02) return {ok:false, msg:'②에 적은 '+mem.dist2+' 입니다.'};
     if(Math.abs(got[2]-Math.abs(mem.d2)/mem.dist2)>0.05) return {ok:false, msg:'|d| 를 거리로 나누면 법선의 길이가 됩니다.'};
     if(pick!==0)
       return {ok:false, msg:'법선을 그대로 두고 d 만 키웠더니 평면이 멀어졌습니다. 둘은 각각 무엇을 정할까요? 다시 고르세요.'};
     return {ok:true, msg:'판단했습니다 — <b>방향만으로는 부족합니다.</b> 법선이 기울기를, d 가 자리를 정하고, 원점까지의 거리는 |d| ÷ |n| 입니다.'};
   }}""")
 +
 note(287, '내가 세우고 · 내가 뒤집고 · 내가 판단한다',
 """  {t:'기록 — 지금 <b>법선이 이루는 각</b> 과 <b>약속한 각</b> 을 적으세요',
   f:'법선이 이루는 각 = {0} ° · 약속한 각 = {1} °',
   chk(got, r, mem){
     if(!r) return {ok:false, msg:'아직 화면 값이 없습니다.'};
     const raw=noteNum(r[2]), ac=noteNum(r[3]);
     if(![0,1].every(j=>isFinite(got[j]))) return {ok:false, msg:'두 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-raw)>0.5) return {ok:false, msg:'법선이 이루는 각은 '+r[2]+' 입니다.'};
     if(Math.abs(got[1]-ac)>0.5) return {ok:false, msg:'약속한 각은 '+r[3]+' 입니다.'};
     mem.raw1=raw; mem.ac1=ac;
     return {ok:true, msg:'기록했습니다 — 두 값이 다릅니다. 법선을 뒤집으면 어떻게 될까요?'};
   }}""",
 """  {t:'생각 — <b>「법선 뒤집기」</b> 를 켜고 다시 적으세요',
   f:'법선이 이루는 각 = {0} ° · 약속한 각 = {1} ° · ①의 법선 각과의 합 = {2} °',
   chk(got, r, mem){
     if(mem.raw1===undefined) return {ok:false, msg:'① 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const raw=noteNum(r[2]), ac=noteNum(r[3]);
     if(Math.abs(raw-mem.raw1)<1) return {ok:false, msg:'법선 각이 그대로입니다 — 「법선 뒤집기」 를 켜세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-raw)>0.5) return {ok:false, msg:'법선이 이루는 각은 '+r[2]+' 입니다.'};
     if(Math.abs(got[1]-ac)>0.5) return {ok:false, msg:'약속한 각은 '+r[3]+' 입니다.'};
     if(Math.abs(got[2]-(raw+mem.raw1))>1) return {ok:false, msg:'①의 '+mem.raw1+'° 와 더하면 얼마인가요?'};
     mem.raw2=raw; mem.ok2=true;
     return {ok:true, msg:'계산했습니다 — 두 법선 각을 더하니 180° 입니다. 서로 보각입니다.'};
   }}""",
 """  {t:'판단 — 두 법선 각을 나란히 두고 고르세요',
   f:'①의 법선 각 = {0} ° · ②의 법선 각 = {1} ° · 두 각의 합 = {2} °',
   opts:['법선은 <b>뒤집어도 같은 평면</b> 을 가리키므로 각이 θ 와 180° − θ 둘로 나온다 — 그래서 이면각은 그 가운데 <b>예각</b> 으로 쓰기로 약속한다',
         '법선이 이루는 각을 그대로 쓰면 된다',
         '두 평면이 이루는 각은 언제나 둔각이다'],
   chk(got, r, mem, pick){
     if(!mem.ok2) return {ok:false, msg:'② 칸을 먼저 통과하세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-mem.raw1)>0.5) return {ok:false, msg:'①에 적은 '+mem.raw1+' 입니다.'};
     if(Math.abs(got[1]-mem.raw2)>0.5) return {ok:false, msg:'②에 적은 '+mem.raw2+' 입니다.'};
     if(Math.abs(got[2]-180)>1) return {ok:false, msg:'두 각을 더하세요.'};
     if(pick!==0)
       return {ok:false, msg:'법선을 뒤집었더니 각이 보각이 되었습니다. 그래서 무엇을 약속해야 할까요? 다시 고르세요.'};
     return {ok:true, msg:'판단했습니다 — <b>법선의 방향이 둘이라 각도 둘입니다.</b> 그 가운데 예각을 이면각으로 쓰기로 약속해야 값이 하나로 정해집니다.'};
   }}""")
 +
 note(288, '내가 고르고 · 내가 자르고 · 내가 판단한다',
 """  {t:'기록 — <b>타원포물면</b> 을 z = 1 로 자르고 적으세요',
   f:'높이 z = {0} · 단면 원의 반지름 = {1}',
   chk(got, r, mem){
     if(!r) return {ok:false, msg:'아직 화면 값이 없습니다.'};
     const z=noteNum(r[1]), rr=noteNum(r[3]);
     if(String(r[0])!=='타원포물면') return {ok:false, msg:'지금은 «'+r[0]+'» 입니다 — 타원포물면으로 고르세요.'};
     if(String(r[2])!=='원') return {ok:false, msg:'단면이 «'+r[2]+'» 입니다 — 높이를 0 보다 크게 하세요.'};
     if(![0,1].every(j=>isFinite(got[j]))) return {ok:false, msg:'두 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-z)>0.05) return {ok:false, msg:'높이는 '+r[1]+' 입니다.'};
     if(Math.abs(got[1]-rr)>0.02) return {ok:false, msg:'반지름은 '+r[3]+' 입니다.'};
     mem.z1=z; mem.r1=rr;
     return {ok:true, msg:'기록했습니다 — 높이 '+r[1]+' 에서 반지름이 '+r[3]+' 입니다. 더 높이 잘라 봅시다.'};
   }}""",
 """  {t:'생각 — <b>높이를 2</b> 로 올리고 반지름의 제곱도 적으세요',
   f:'높이 z = {0} · 반지름 = {1} · 반지름의 제곱 = {2}',
   chk(got, r, mem){
     if(mem.r1===undefined) return {ok:false, msg:'① 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const z=noteNum(r[1]), rr=noteNum(r[3]);
     if(String(r[0])!=='타원포물면') return {ok:false, msg:'타원포물면으로 두고 적으세요.'};
     if(!(z>mem.z1+0.3)) return {ok:false, msg:'높이가 '+r[1]+' 입니다 — ①의 '+mem.z1+' 보다 높이 올리세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-z)>0.05) return {ok:false, msg:'높이는 '+r[1]+' 입니다.'};
     if(Math.abs(got[1]-rr)>0.02) return {ok:false, msg:'반지름은 '+r[3]+' 입니다.'};
     if(Math.abs(got[2]-rr*rr)>0.05) return {ok:false, msg:'반지름을 제곱하면 얼마인가요?'};
     mem.r2=rr; mem.z2=z; mem.ok2=true;
     return {ok:true, msg:'계산했습니다 — 반지름의 제곱이 높이와 같습니다. z = x² + y² 그대로입니다.'};
   }}""",
 """  {t:'판단 — 다른 입체와 견주어 보고 고르세요',
   f:'①의 반지름 = {0} · ②의 반지름 = {1} · 일엽쌍곡면을 z = 2 로 자른 반지름 √(1+2²) = {2}',
   opts:['단면은 <b>입체마다 다른 규칙</b> 으로 변한다 — 타원포물면은 √z, 원뿔면은 |z|, 일엽쌍곡면은 √(1 + z²) 이고, 쌍곡포물면은 아예 쌍곡선이 된다',
         '어떤 입체든 수평으로 자르면 원이 된다',
         '높이를 두 배로 하면 반지름도 두 배가 된다'],
   chk(got, r, mem, pick){
     if(!mem.ok2) return {ok:false, msg:'② 칸을 먼저 통과하세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-mem.r1)>0.02) return {ok:false, msg:'①에 적은 '+mem.r1+' 입니다.'};
     if(Math.abs(got[1]-mem.r2)>0.02) return {ok:false, msg:'②에 적은 '+mem.r2+' 입니다.'};
     if(Math.abs(got[2]-Math.sqrt(5))>0.02) return {ok:false, msg:'√5 를 계산하세요.'};
     if(pick!==0)
       return {ok:false, msg:'같은 높이로 잘라도 입체마다 단면이 달랐습니다. 무엇이 다른 것일까요? 다시 고르세요.'};
     return {ok:true, msg:'판단했습니다 — <b>단면이 입체의 지문입니다.</b> 높이에 따라 크기가 어떻게 변하는지만 보아도 어떤 이차곡면인지 가려낼 수 있습니다.'};
   }}""")
 +
 note(289, '내가 돌리고 · 내가 축을 바꾸고 · 내가 판단한다',
 """  {t:'기록 — <b>y 축으로 한 바퀴(100%)</b> 돌리고 적으세요',
   f:'돌린 정도 = {0} % · 높이 1.2 에서의 반지름 (1.2 ÷ 0.6) = {1}',
   chk(got, r, mem){
     if(!r) return {ok:false, msg:'아직 화면 값이 없습니다.'};
     const t=noteNum(r[2]);
     if(String(r[1])!=='y 축') return {ok:false, msg:'지금은 «'+r[1]+'» 입니다 — y 축으로 두세요.'};
     if(!(t>=99)) return {ok:false, msg:'돌린 정도가 '+r[2]+' 입니다 — 100% 까지 돌리세요.'};
     if(![0,1].every(j=>isFinite(got[j]))) return {ok:false, msg:'두 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-t)>1) return {ok:false, msg:'돌린 정도는 '+r[2]+' 입니다.'};
     if(Math.abs(got[1]-2)>0.05) return {ok:false, msg:'1.2 를 0.6 으로 나누세요.'};
     mem.ry=2;
     return {ok:true, msg:'기록했습니다 — 곡선 하나가 원뿔면이 되었고, 높이 1.2 에서 반지름이 2 입니다.'};
   }}""",
 """  {t:'생각 — <b>돌리는 축을 x 축</b> 으로 바꾸고 적으세요',
   f:'x = 2 에서의 반지름 (0.6 × 2) = {0} · ①의 반지름과의 차 = {1}',
   chk(got, r, mem){
     if(mem.ry===undefined) return {ok:false, msg:'① 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     if(String(r[1])!=='x 축') return {ok:false, msg:'지금은 «'+r[1]+'» 입니다 — x 축으로 바꾸세요.'};
     if(![0,1].every(j=>isFinite(got[j]))) return {ok:false, msg:'두 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-1.2)>0.05) return {ok:false, msg:'0.6 × 2 를 계산하세요.'};
     if(Math.abs(got[1]-(mem.ry-1.2))>0.05) return {ok:false, msg:'①의 '+mem.ry+' 에서 빼면 얼마인가요?'};
     mem.rx=1.2; mem.ok2=true;
     return {ok:true, msg:'계산했습니다 — 같은 곡선인데 축이 바뀌니 반지름이 달라집니다.'};
   }}""",
 """  {t:'판단 — 두 입체를 나란히 두고 고르세요',
   f:'y 축으로 돌릴 때 = {0} · x 축으로 돌릴 때 = {1} · 두 입체가 같으면 1, 다르면 0 → {2}',
   opts:['회전면의 반지름은 <b>축에서 곡선까지의 거리</b> 다 — 같은 곡선이라도 축이 바뀌면 그 거리가 달라지므로 전혀 다른 입체가 나온다',
         '같은 곡선을 돌리면 축과 상관없이 같은 입체가 된다',
         '축을 바꾸면 크기만 달라지고 모양은 같다'],
   chk(got, r, mem, pick){
     if(!mem.ok2) return {ok:false, msg:'② 칸을 먼저 통과하세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-mem.ry)>0.05) return {ok:false, msg:'①에 적은 '+mem.ry+' 입니다.'};
     if(Math.abs(got[1]-mem.rx)>0.05) return {ok:false, msg:'②에 적은 '+mem.rx+' 입니다.'};
     if(Math.abs(got[2])>0.01) return {ok:false, msg:'화면의 입체 이름이 같았나요?'};
     if(pick!==0)
       return {ok:false, msg:'같은 직선인데 축을 바꾸니 반지름도 입체 이름도 달라졌습니다. 무엇이 반지름을 정할까요? 다시 고르세요.'};
     return {ok:true, msg:'판단했습니다 — <b>축이 바뀌면 입체가 바뀝니다.</b> 회전면을 다룰 때는 「무엇을 돌리는가」 만큼 「무엇을 중심으로 돌리는가」 가 중요합니다.'};
   }}""")
 +
 note(290, '내가 크게 그리고 · 내가 견주고 · 내가 판단한다',
 """  {t:'기록 — 삼각형을 <b>크게</b> 만들어 적으세요 (구면 초과 20° 이상)',
   f:'내각의 합 = {0} ° · 구면 초과 = {1} °',
   chk(got, r, mem){
     if(!r) return {ok:false, msg:'아직 화면 값이 없습니다.'};
     const s=noteNum(r[2]), ex=noteNum(r[3]);
     if(!(ex>=20)) return {ok:false, msg:'구면 초과가 '+r[3]+' 입니다 — 삼각형을 더 크게 만드세요.'};
     if(![0,1].every(j=>isFinite(got[j]))) return {ok:false, msg:'두 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-s)>0.5) return {ok:false, msg:'내각의 합은 '+r[2]+' 입니다.'};
     if(Math.abs(got[1]-ex)>0.5) return {ok:false, msg:'구면 초과는 '+r[3]+' 입니다.'};
     mem.s1=s; mem.ex1=ex;
     return {ok:true, msg:'기록했습니다 — 내각의 합이 '+r[2]+' 로 180°를 크게 넘었습니다.'};
   }}""",
 """  {t:'생각 — <b>「평면 공식으로 계산하기」</b> 를 켜고 다시 적으세요',
   f:'내각의 합 = {0} ° · 구면 초과 = {1} ° · ①의 합과의 차 = {2} °',
   chk(got, r, mem){
     if(mem.s1===undefined) return {ok:false, msg:'① 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const s=noteNum(r[2]), ex=noteNum(r[3]);
     if(Math.abs(s-180)>0.5) return {ok:false, msg:'내각의 합이 '+r[2]+' 입니다 — 「평면 공식으로 계산하기」 를 켜세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-s)>0.5) return {ok:false, msg:'내각의 합은 '+r[2]+' 입니다.'};
     if(Math.abs(got[1]-ex)>0.5) return {ok:false, msg:'구면 초과는 '+r[3]+' 입니다.'};
     if(Math.abs(got[2]-(mem.s1-s))>0.6) return {ok:false, msg:'①의 '+mem.s1+'° 에서 빼면 얼마인가요?'};
     mem.s2=s; mem.ok2=true;
     return {ok:true, msg:'계산했습니다 — 평면 공식은 아무리 크게 그려도 180° 라고 합니다.'};
   }}""",
 """  {t:'판단 — 두 합을 나란히 두고 고르세요',
   f:'①의 합 = {0} ° · ②의 합 = {1} ° · 평면에서 삼각형 내각의 합 = {2} °',
   opts:['구면에서는 <b>「직선」이 대원(大圓)</b> 이라 삼각형이 커질수록 내각의 합이 180°를 넘는다 — 넘친 만큼(구면 초과)이 삼각형의 넓이에 비례하고, 아주 작게 그리면 평면과 같아진다',
         '구면에서도 내각의 합은 언제나 180° 이고 계산이 틀린 것이다',
         '삼각형이 커질수록 내각의 합이 180°보다 작아진다'],
   chk(got, r, mem, pick){
     if(!mem.ok2) return {ok:false, msg:'② 칸을 먼저 통과하세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-mem.s1)>0.5) return {ok:false, msg:'①에 적은 '+mem.s1+' 입니다.'};
     if(Math.abs(got[1]-mem.s2)>0.5) return {ok:false, msg:'②에 적은 '+mem.s2+' 입니다.'};
     if(Math.abs(got[2]-180)>0.5) return {ok:false, msg:'평면에서는 언제나 얼마인가요?'};
     if(pick!==0)
       return {ok:false, msg:'같은 삼각형인데 구면에서는 '+mem.s1+'° 였고 평면 공식으로는 180° 였습니다. 어느 쪽이 지구 위의 참값일까요? 다시 고르세요.'};
     return {ok:true, msg:'판단했습니다 — <b>평면의 상식이 구면에서는 그대로 통하지 않습니다.</b> 내각의 합이 180°를 넘고, 넘친 만큼이 넓이가 됩니다. 비행기의 항로와 지도 투영이 모두 이 기하 위에 있습니다.'};
   }}""")
)
