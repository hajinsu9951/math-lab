# -*- coding: utf-8 -*-
"""LAB 251~260 탐구 노트 — 기록 → 생각 → 판단. 판정은 화면의 read() 값으로만 한다."""


def note(no, head, c1, c2, c3):
    return "\n %d:{ h:'%s',\n  c:[\n%s,\n%s,\n%s\n ]},\n" % (no, head, c1, c2, c3)


NOTES = (
 note(251, '내가 곱하고 · 내가 견주고 · 내가 판단한다',
 """  {t:'기록 — <b>n 을 작게</b> 두고 (5 아래) 적으세요',
   f:'n = {0} · F(n) = {1} · F(n+1) = {2}',
   chk(got, r, mem){
     if(!r) return {ok:false, msg:'아직 화면 값이 없습니다.'};
     const n=noteNum(r[0]), f=noteNum(r[1]), g=noteNum(r[2]);
     if(!(n<5)) return {ok:false, msg:'n 이 '+r[0]+' 입니다 — 5 보다 작게 두세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-n)>0.5) return {ok:false, msg:'n 은 '+r[0]+' 입니다.'};
     if(Math.abs(got[1]-f)>0.5) return {ok:false, msg:'F(n) 은 '+r[1]+' 입니다.'};
     if(Math.abs(got[2]-g)>0.5) return {ok:false, msg:'F(n+1) 은 '+r[2]+' 입니다.'};
     mem.n1=n; mem.f1=f;
     return {ok:true, msg:'기록했습니다 — 행렬의 네 칸이 이웃한 세 피보나치 수입니다. n 을 키워 봅시다.'};
   }}""",
 """  {t:'생각 — <b>n 을 12</b> 로 키우고 비네 값도 적으세요',
   f:'n = {0} · F(n) = {1} · 비네 값 = {2}',
   chk(got, r, mem){
     if(mem.f1===undefined) return {ok:false, msg:'① 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const n=noteNum(r[0]), f=noteNum(r[1]), bi=noteNum(r[3]);
     if(n!==12) return {ok:false, msg:'n 이 '+r[0]+' 입니다 — 12 로 키우세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-n)>0.5) return {ok:false, msg:'n 은 '+r[0]+' 입니다.'};
     if(Math.abs(got[1]-f)>0.5) return {ok:false, msg:'F(n) 은 '+r[1]+' 입니다.'};
     if(Math.abs(got[2]-bi)>0.0005) return {ok:false, msg:'비네 값은 '+r[3]+' 입니다.'};
     mem.f2=f; mem.bi=bi; mem.ok2=true;
     return {ok:true, msg:'계산했습니다 — F(12) = '+r[1]+' 이고 비네 값도 '+r[3]+' 입니다.'};
   }}""",
 """  {t:'판단 — 두 값의 차를 구해 보고 고르세요',
   f:'F(n) = {0} · 비네 값 = {1} · 두 값의 차 = {2}',
   opts:['[1 1 ; 1 0] 을 n 번 곱하면 네 칸이 <b>이웃한 피보나치 수</b> 로 채워진다 — 점화식이 곱셈 한 번이 되고, 같은 수열을 무리수 식으로도 쓸 수 있다',
         '비네 공식은 어림값일 뿐 정수와는 늘 다르다',
         '행렬을 곱하는 것과 점화식을 따라가는 것은 다른 수열을 만든다'],
   chk(got, r, mem, pick){
     if(!mem.ok2) return {ok:false, msg:'② 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const f=noteNum(r[1]), bi=noteNum(r[3]);
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-f)>0.5) return {ok:false, msg:'F(n) 은 '+r[1]+' 입니다.'};
     if(Math.abs(got[1]-bi)>0.0005) return {ok:false, msg:'비네 값은 '+r[3]+' 입니다.'};
     if(Math.abs(got[2]-(f-bi))>0.002) return {ok:false, msg:'두 값을 빼 보세요 — 거의 0 입니다.'};
     if(pick!==0)
       return {ok:false, msg:'√5 가 잔뜩 든 식이 '+r[3]+' 를 냈고 정수 '+r[1]+' 와 사실상 같습니다. 두 길은 같은 수열일까요? 다시 고르세요.'};
     return {ok:true, msg:'판단했습니다 — <b>같은 수열을 행렬로도, 무리수로도 쓸 수 있습니다.</b> 행렬 쪽은 거듭제곱으로 건너뛰게 해 주고, 무리수 쪽은 n 번째 항을 바로 적게 해 줍니다.'};
   }}""")
 +
 note(252, '내가 소거하고 · 내가 세고 · 내가 판단한다',
 """  {t:'기록 — <b>단계를 0</b> 으로 두고 적으세요',
   f:'단계 = {0} · 계단 아래 0 의 개수 = {1}',
   chk(got, r, mem){
     if(!r) return {ok:false, msg:'아직 화면 값이 없습니다.'};
     const st=noteNum(r[0]), z=noteNum(r[2]);
     if(st!==0) return {ok:false, msg:'단계가 '+r[0]+' 입니다 — 0 으로 내리세요.'};
     if(![0,1].every(j=>isFinite(got[j]))) return {ok:false, msg:'두 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-st)>0.5) return {ok:false, msg:'단계는 '+r[0]+' 입니다.'};
     if(Math.abs(got[1]-z)>0.5) return {ok:false, msg:'계단 아래 0 의 개수는 '+r[2]+' 입니다.'};
     mem.z1=z;
     return {ok:true, msg:'기록했습니다 — 아직 0 이 '+r[2]+' 입니다. 단계를 올려 봅시다.'};
   }}""",
 """  {t:'생각 — <b>단계를 끝까지</b> 올리고 늘어난 개수를 구하세요',
   f:'단계 = {0} · 계단 아래 0 의 개수 = {1} · ①에서 늘어난 개수 = {2}',
   chk(got, r, mem){
     if(mem.z1===undefined) return {ok:false, msg:'① 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const st=noteNum(r[0]), z=noteNum(r[2]);
     if(z!==3) return {ok:false, msg:'0 이 '+r[2]+' 입니다 — 단계를 끝까지 올리세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-st)>0.5) return {ok:false, msg:'단계는 '+r[0]+' 입니다.'};
     if(Math.abs(got[1]-z)>0.5) return {ok:false, msg:'개수는 '+r[2]+' 입니다.'};
     if(Math.abs(got[2]-(z-mem.z1))>0.5) return {ok:false, msg:'3 에서 ①의 '+mem.z1+' 를 빼 보세요.'};
     mem.ok2=true;
     return {ok:true, msg:'계산했습니다 — 계단이 완성되었습니다. 이제 아래에서 위로 되짚어 갈 수 있습니다.'};
   }}""",
 """  {t:'판단 — <b>① 행의 첫 계수를 0</b> 으로 두고 (행 바꾸기는 끈 채) 고르세요',
   f:'단계 = {0} · 계단 아래 0 의 개수 = {1} · 3 보다 작으면 1, 3 이면 0 → {2}',
   opts:['행을 더하고 빼는 조작은 <b>해를 바꾸지 않으므로</b> 마음대로 정리해도 된다 — 다만 나누는 자리(피벗)가 0 이면 더 갈 수 없어 반드시 행을 맞바꿔야 한다',
         '행을 더하고 빼면 해가 달라지므로 조심해야 한다',
         '피벗이 0 이어도 그대로 진행하면 된다'],
   chk(got, r, mem, pick){
     if(!mem.ok2) return {ok:false, msg:'② 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const st=noteNum(r[0]), z=noteNum(r[2]);
     if(z===3) return {ok:false, msg:'아직 계단이 완성되어 있습니다 — ① 행의 첫 계수를 0 으로 두세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-st)>0.5) return {ok:false, msg:'단계는 '+r[0]+' 입니다.'};
     if(Math.abs(got[1]-z)>0.5) return {ok:false, msg:'개수는 '+r[2]+' 입니다.'};
     if(Math.abs(got[2]-1)>0.01) return {ok:false, msg:'지금 개수 '+r[2]+' 를 3 과 견주세요.'};
     if(pick!==0)
       return {ok:false, msg:'끝까지 올리면 0 이 3 개였는데 첫 계수를 0 으로 두자 거기서 멈췄습니다. 무엇이 필요할까요? 다시 고르세요.'};
     return {ok:true, msg:'판단했습니다 — <b>컴퓨터는 계단을 만든 뒤 거꾸로 되짚습니다.</b> 행 조작이 해를 바꾸지 않기에 가능한 일이고, 피벗이 0 이면 행을 맞바꾸는 것이 필수입니다.'};
   }}""")
 +
 note(253, '내가 돌리고 · 내가 겹치고 · 내가 판단한다',
 """  {t:'기록 — <b>두 화살표를 서로 다른 방향</b> 으로 두고 적으세요',
   f:'u 의 x = {0} · v 의 x = {1} · 판정값 = {2}',
   chk(got, r, mem){
     if(!r) return {ok:false, msg:'아직 화면 값이 없습니다.'};
     const ux=noteNum(r[0]), vx=noteNum(r[1]), d=noteNum(r[2]);
     if(Math.abs(d)<1e-9) return {ok:false, msg:'지금 두 화살표가 나란합니다 — ②에서 볼 테니 다르게 두세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-ux)>0.5) return {ok:false, msg:'u 의 x 는 '+r[0]+' 입니다.'};
     if(Math.abs(got[1]-vx)>0.5) return {ok:false, msg:'v 의 x 는 '+r[1]+' 입니다.'};
     if(Math.abs(got[2]-d)>0.5) return {ok:false, msg:'판정값은 '+r[2]+' 입니다.'};
     if(String(r[3])!=='평면') return {ok:false, msg:'화면은 «'+r[3]+'» 이라고 합니다 — 판정값이 0 이 아니면 평면이어야 합니다.'};
     mem.d1=d;
     return {ok:true, msg:'기록했습니다 — 판정값이 '+r[2]+' 이고 평면 어디든 갈 수 있습니다. 나란하게 해 봅시다.'};
   }}""",
 """  {t:'생각 — <b>v 를 u 의 배수</b> 로 만들어 나란하게 하고 적으세요',
   f:'u 의 x = {0} · v 의 x = {1} · 판정값 = {2}',
   chk(got, r, mem){
     if(mem.d1===undefined) return {ok:false, msg:'① 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const ux=noteNum(r[0]), vx=noteNum(r[1]), d=noteNum(r[2]);
     if(Math.abs(d)>1e-9) return {ok:false, msg:'판정값이 '+r[2]+' 입니다 — v 를 u 의 배수로 만들어 0 으로 하세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-ux)>0.5) return {ok:false, msg:'u 의 x 는 '+r[0]+' 입니다.'};
     if(Math.abs(got[1]-vx)>0.5) return {ok:false, msg:'v 의 x 는 '+r[1]+' 입니다.'};
     if(Math.abs(got[2])>0.5) return {ok:false, msg:'판정값은 0 입니다.'};
     if(String(r[3])!=='직선') return {ok:false, msg:'화면은 «'+r[3]+'» 이라고 합니다.'};
     mem.ok2=true;
     return {ok:true, msg:'계산했습니다 — 아무리 더해도 한 직선을 벗어나지 못합니다.'};
   }}""",
 """  {t:'판단 — 두 판정값을 나란히 두고 고르세요',
   f:'①의 판정값 = {0} · ②의 판정값 = {1} · 평면을 덮으려면 필요한 방향의 수 = {2}',
   opts:['두 화살표가 <b>서로의 실수배가 아닐 때만</b> 평면 전체를 덮는다 — uₓv_y − u_yvₓ 가 0 이면 나란해서 한 직선뿐이고, 평면의 차원이 2 라는 말이 바로 이 뜻이다',
         '화살표가 많을수록 갈 수 있는 곳이 넓어진다',
         '두 화살표가 나란해도 계수를 잘 고르면 평면을 덮을 수 있다'],
   chk(got, r, mem, pick){
     if(!mem.ok2) return {ok:false, msg:'② 칸을 먼저 통과하세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-mem.d1)>0.5) return {ok:false, msg:'①에 적은 '+mem.d1+' 입니다.'};
     if(Math.abs(got[1])>0.5) return {ok:false, msg:'②의 판정값은 0 이었습니다.'};
     if(Math.abs(got[2]-2)>0.2) return {ok:false, msg:'평면을 덮으려면 서로 다른 방향이 몇 개 필요한가요?'};
     if(pick!==0)
       return {ok:false, msg:'판정값이 '+mem.d1+' 일 때는 평면, 0 일 때는 직선이었습니다. 무엇이 갈 수 있는 곳을 정할까요? 다시 고르세요.'};
     return {ok:true, msg:'판단했습니다 — <b>「몇 개의 방향이 필요한가」가 곧 차원입니다.</b> 서로 다른 두 방향이면 평면 어디든 갈 수 있고, 나란하면 아무리 더해도 직선 하나입니다.'};
   }}""")
 +
 note(254, '내가 재고 · 내가 내리고 · 내가 판단한다',
 """  {t:'기록 — <b>절편을 0 이 아니게</b> 두고, 곱할 수를 1 이 아닌 값으로 하여 적으세요',
   f:'기울기 = {0} · 절편 = {1} · 실수배 검사 통과이면 1, 탈락이면 0 → {2}',
   chk(got, r, mem){
     if(!r) return {ok:false, msg:'아직 화면 값이 없습니다.'};
     const m=noteNum(r[0]), b=noteNum(r[1]);
     if(Math.abs(b)<1e-9) return {ok:false, msg:'절편이 0 입니다 — ②에서 볼 테니 지금은 0 이 아니게 두세요.'};
     if(String(r[2])!=='탈락') return {ok:false, msg:'실수배 검사가 «'+r[2]+'» 입니다 — 곱할 수를 1 이 아닌 값으로 바꾸세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-m)>0.06) return {ok:false, msg:'기울기는 '+r[0]+' 입니다.'};
     if(Math.abs(got[1]-b)>0.06) return {ok:false, msg:'절편은 '+r[1]+' 입니다.'};
     if(Math.abs(got[2])>0.01) return {ok:false, msg:'화면은 «'+r[2]+'» 이라고 합니다.'};
     mem.b1=b;
     return {ok:true, msg:'기록했습니다 — 실수배를 했더니 직선 밖으로 나갔습니다. 절편을 0 으로 해 봅시다.'};
   }}""",
 """  {t:'생각 — <b>절편을 0</b> 으로 맞추고 두 검사를 적으세요',
   f:'절편 = {0} · 실수배 통과이면 1 → {1} · 덧셈 통과이면 1 → {2}',
   chk(got, r, mem){
     if(mem.b1===undefined) return {ok:false, msg:'① 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const b=noteNum(r[1]);
     if(Math.abs(b)>1e-9) return {ok:false, msg:'절편이 '+r[1]+' 입니다 — 0 으로 맞추세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0])>0.06) return {ok:false, msg:'절편은 0 입니다.'};
     if(Math.abs(got[1]-(String(r[2])==='통과'?1:0))>0.01)
       return {ok:false, msg:'실수배 검사는 «'+r[2]+'» 입니다.'};
     if(Math.abs(got[2]-(String(r[3])==='통과'?1:0))>0.01)
       return {ok:false, msg:'덧셈 검사는 «'+r[3]+'» 입니다.'};
     if(String(r[2])!=='통과'||String(r[3])!=='통과')
       return {ok:false, msg:'절편이 0 이면 두 검사가 모두 통과여야 합니다 — 화면을 다시 보세요.'};
     mem.ok2=true;
     return {ok:true, msg:'계산했습니다 — 원점을 지나니 두 검사를 모두 통과합니다.'};
   }}""",
 """  {t:'판단 — 0 을 곱하면 어떤 점이 나오는지 생각하고 고르세요',
   f:'절편 = {0} · 0 을 곱해 나오는 점의 y = {1} · 그 점이 직선 위에 있으면 1 → {2}',
   opts:['실수배에 닫혀 있으려면 <b>0 을 곱한 결과인 원점</b> 도 품어야 한다 — 그래서 원점을 지나지 않는 직선은 부분공간이 될 수 없고, 덧셈만 검사하면 이것을 놓친다',
         '덧셈 검사만 통과하면 부분공간이다',
         '원점을 지나지 않아도 실수배에 닫힐 수 있다'],
   chk(got, r, mem, pick){
     if(!mem.ok2) return {ok:false, msg:'② 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const b=noteNum(r[1]);
     if(Math.abs(b)>1e-9) return {ok:false, msg:'②와 같이 절편을 0 으로 두고 판단하세요 (지금 '+r[1]+').'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0])>0.06) return {ok:false, msg:'절편은 0 입니다.'};
     if(Math.abs(got[1])>0.06) return {ok:false, msg:'0 을 곱하면 어떤 점이 나오나요?'};
     if(Math.abs(got[2]-1)>0.01) return {ok:false, msg:'원점이 이 직선 위에 있는지 보세요.'};
     if(pick!==0)
       return {ok:false, msg:'절편이 '+mem.b1+' 일 때는 실수배가 탈락했고 0 일 때는 통과했습니다. 0 을 곱하면 어떤 점이 나올까요? 다시 고르세요.'};
     return {ok:true, msg:'판단했습니다 — <b>0 벡터를 품지 못하는 집합은 부분공간이 될 수 없습니다.</b> 실수배 검사는 그 사실을 한 번에 잡아내지만 덧셈 검사만으로는 놓칩니다.'};
   }}""")
 +
 note(255, '내가 넣고 · 내가 겹치고 · 내가 판단한다',
 """  {t:'기록 — <b>개수를 2</b> 로 두고 적으세요',
   f:'넣은 개수 = {0} · 차원 = {1}',
   chk(got, r, mem){
     if(!r) return {ok:false, msg:'아직 화면 값이 없습니다.'};
     const n=noteNum(r[0]), d=noteNum(r[2]);
     if(n!==2) return {ok:false, msg:'개수가 '+r[0]+' 입니다 — 2 로 두세요.'};
     if(![0,1].every(j=>isFinite(got[j]))) return {ok:false, msg:'두 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-n)>0.5) return {ok:false, msg:'넣은 개수는 '+r[0]+' 입니다.'};
     if(Math.abs(got[1]-d)>0.5) return {ok:false, msg:'차원은 '+r[2]+' 입니다.'};
     mem.d1=d;
     return {ok:true, msg:'기록했습니다 — 둘을 넣었더니 차원도 '+r[2]+' 입니다. 하나 더 넣어 봅시다.'};
   }}""",
 """  {t:'생각 — <b>개수를 3</b> 으로 늘리고, 개수와 차원의 차를 구하세요',
   f:'넣은 개수 = {0} · 차원 = {1} · 개수 − 차원 = {2}',
   chk(got, r, mem){
     if(mem.d1===undefined) return {ok:false, msg:'① 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const n=noteNum(r[0]), d=noteNum(r[2]);
     if(n!==3) return {ok:false, msg:'개수가 '+r[0]+' 입니다 — 3 으로 늘리세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-n)>0.5) return {ok:false, msg:'넣은 개수는 '+r[0]+' 입니다.'};
     if(Math.abs(got[1]-d)>0.5) return {ok:false, msg:'차원은 '+r[2]+' 입니다.'};
     if(Math.abs(got[2]-(n-d))>0.5) return {ok:false, msg:r[0]+' 에서 '+r[2]+' 를 빼 보세요.'};
     if(!(n>d)) return {ok:false, msg:'개수가 차원보다 커야 합니다 — ③ 을 ① 의 배수로 만들어 보세요.'};
     mem.ok2=true;
     return {ok:true, msg:'계산했습니다 — 개수는 늘었는데 차원은 그대로입니다.'};
   }}""",
 """  {t:'판단 — <b>개수를 4</b> 로 늘린 뒤 고르세요',
   f:'넣은 개수 = {0} · 차원 = {1} · 개수 − 차원 = {2}',
   opts:['차원은 벡터의 수가 아니라 <b>서로 만들 수 없는 방향의 수</b> 다 — 앞의 벡터들로 만들 수 있는 것을 또 넣어도 갈 수 있는 곳은 넓어지지 않는다',
         '벡터를 하나 넣을 때마다 차원이 하나씩 늘어난다',
         '평면에서도 벡터를 충분히 넣으면 차원이 3 이 될 수 있다'],
   chk(got, r, mem, pick){
     if(!mem.ok2) return {ok:false, msg:'② 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const n=noteNum(r[0]), d=noteNum(r[2]);
     if(n!==4) return {ok:false, msg:'개수가 '+r[0]+' 입니다 — 4 로 늘리세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-n)>0.5) return {ok:false, msg:'넣은 개수는 '+r[0]+' 입니다.'};
     if(Math.abs(got[1]-d)>0.5) return {ok:false, msg:'차원은 '+r[2]+' 입니다.'};
     if(Math.abs(got[2]-(n-d))>0.5) return {ok:false, msg:'4 에서 '+r[2]+' 를 빼 보세요.'};
     if(pick!==0)
       return {ok:false, msg:'둘을 넣었을 때도 '+mem.d1+' , 넷을 넣어도 '+r[2]+' 입니다. 차원이 세는 것은 무엇일까요? 다시 고르세요.'};
     return {ok:true, msg:'판단했습니다 — <b>차원은 개수가 아니라 방향의 수입니다.</b> 평면 안에서는 서로 만들 수 없는 방향이 둘뿐이라, 몇 개를 넣어도 차원은 2 를 넘지 못합니다.'};
   }}""")
 +
 note(256, '내가 재고 · 내가 바꾸고 · 내가 판단한다',
 """  {t:'기록 — <b>표준 기저</b> (1,0) 과 (0,1) 로 두고 적으세요',
   f:'P 의 x = {0} · 새 좌표의 첫 값 = {1} · 두 값이 같으면 1, 다르면 0 → {2}',
   chk(got, r, mem){
     if(!r) return {ok:false, msg:'아직 화면 값이 없습니다.'};
     const px=noteNum(r[0]), s=noteNum(r[3]);
     if(String(r[1])!=='(1,0)'||String(r[2])!=='(0,1)')
       return {ok:false, msg:'기저가 '+r[1]+' · '+r[2]+' 입니다 — (1,0) 과 (0,1) 로 두세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-px)>0.5) return {ok:false, msg:'P 의 x 는 '+r[0]+' 입니다.'};
     if(Math.abs(got[1]-s)>0.02) return {ok:false, msg:'새 좌표의 첫 값은 '+r[3]+' 입니다.'};
     if(Math.abs(got[2]-1)>0.01) return {ok:false, msg:'두 값을 견주세요 — 표준 기저에서는 같습니다.'};
     mem.px=px; mem.ok1=true;
     return {ok:true, msg:'기록했습니다 — 표준 기저에서는 좌표가 그대로입니다. 자를 바꿔 봅시다.'};
   }}""",
 """  {t:'생각 — <b>기저를 바꿔</b> 새 좌표가 달라지게 하고 적으세요',
   f:'P 의 x = {0} · 새 좌표의 첫 값 = {1} · 두 값이 같으면 1, 다르면 0 → {2}',
   chk(got, r, mem){
     if(!mem.ok1) return {ok:false, msg:'① 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const px=noteNum(r[0]), s=noteNum(r[3]);
     if(String(r[3])==='정할 수 없음')
       return {ok:false, msg:'두 기저가 나란합니다 — ③에서 볼 테니 지금은 좌표가 정해지게 두세요.'};
     if(Math.abs(s-px)<0.02) return {ok:false, msg:'새 좌표가 아직 표준과 같습니다 — 기저를 더 바꾸세요.'};
     if(Math.abs(px-mem.px)>0.5) return {ok:false, msg:'점 P 는 ①과 같게 두세요 (①은 x = '+mem.px+').'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-px)>0.5) return {ok:false, msg:'P 의 x 는 '+r[0]+' 입니다.'};
     if(Math.abs(got[1]-s)>0.02) return {ok:false, msg:'새 좌표의 첫 값은 '+r[3]+' 입니다.'};
     if(Math.abs(got[2])>0.01) return {ok:false, msg:'두 값이 다르므로 0 입니다.'};
     mem.s2=s; mem.ok2=true;
     return {ok:true, msg:'계산했습니다 — 점은 그대로인데 읽는 값이 '+r[3]+' 로 바뀌었습니다.'};
   }}""",
 """  {t:'판단 — <b>두 기저를 나란하게</b> 만든 뒤 고르세요',
   f:'P 의 x = {0} · 좌표를 정할 수 있으면 1, 없으면 0 → {1} · 점이 움직였으면 1, 아니면 0 → {2}',
   opts:['좌표는 <b>어떤 자로 재었는지에 달린 값</b> 이다 — 점 자체는 그대로이고, 두 기저가 나란하면 눈금이 되지 못해 좌표를 아예 정할 수 없다',
         '좌표는 점이 가진 고유한 성질이라 기저를 바꿔도 같다',
         '두 기저가 나란해도 좌표는 늘 하나로 정해진다'],
   chk(got, r, mem, pick){
     if(!mem.ok2) return {ok:false, msg:'② 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const px=noteNum(r[0]);
     if(String(r[3])!=='정할 수 없음')
       return {ok:false, msg:'아직 좌표가 정해집니다 — 두 기저를 나란하게 만드세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-px)>0.5) return {ok:false, msg:'P 의 x 는 '+r[0]+' 입니다.'};
     if(Math.abs(got[1])>0.01) return {ok:false, msg:'화면은 «'+r[3]+'» 이라고 합니다.'};
     if(Math.abs(got[2])>0.01) return {ok:false, msg:'점 P 는 처음부터 한 번도 움직이지 않았습니다.'};
     if(pick!==0)
       return {ok:false, msg:'같은 점인데 표준에서는 '+mem.px+' , 바꾼 자에서는 '+mem.s2+' 로 읽혔고, 지금은 아예 읽을 수 없습니다. 좌표는 무엇에 달려 있을까요? 다시 고르세요.'};
     return {ok:true, msg:'판단했습니다 — <b>좌표는 점의 성질이 아니라 자의 성질입니다.</b> 두 기저가 나란하면 평면을 덮지 못해 눈금이 되지 못하고, 그래서 좌표가 정해지지 않습니다.'};
   }}""")
 +
 note(257, '내가 밀고 · 내가 돌리고 · 내가 판단한다',
 """  {t:'기록 — <b>순서 차이가 0 인 설정</b> 에서 적으세요 (각도 0 이나 확대 1 배)',
   f:'각도 = {0} ° · 확대 = {1} 배 · 순서 차이 = {2}',
   chk(got, r, mem){
     if(!r) return {ok:false, msg:'아직 화면 값이 없습니다.'};
     const a=noteNum(r[0]), sc=noteNum(r[1]), df=noteNum(r[4]);
     if(!(df<=0.01)) return {ok:false, msg:'순서 차이가 '+r[4]+' 입니다 — 각도를 0 으로 두거나 확대를 1 배로 하세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-a)>0.5) return {ok:false, msg:'각도는 '+r[0]+' 입니다.'};
     if(Math.abs(got[1]-sc)>0.06) return {ok:false, msg:'확대는 '+r[1]+' 입니다.'};
     if(Math.abs(got[2]-df)>0.005) return {ok:false, msg:'순서 차이는 '+r[4]+' 입니다.'};
     mem.df1=df;
     return {ok:true, msg:'기록했습니다 — 지금은 순서를 바꿔도 결과가 같습니다. 둘을 함께 주어 봅시다.'};
   }}""",
 """  {t:'생각 — <b>회전과 확대를 함께</b> 주어 순서 차이가 생기게 하고 적으세요',
   f:'각도 = {0} ° · 확대 = {1} 배 · 순서 차이 = {2}',
   chk(got, r, mem){
     if(mem.df1===undefined) return {ok:false, msg:'① 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const a=noteNum(r[0]), sc=noteNum(r[1]), df=noteNum(r[4]);
     if(!(df>0.01)) return {ok:false, msg:'순서 차이가 '+r[4]+' 입니다 — 각도와 확대를 모두 주세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-a)>0.5) return {ok:false, msg:'각도는 '+r[0]+' 입니다.'};
     if(Math.abs(got[1]-sc)>0.06) return {ok:false, msg:'확대는 '+r[1]+' 입니다.'};
     if(Math.abs(got[2]-df)>0.005) return {ok:false, msg:'순서 차이는 '+r[4]+' 입니다.'};
     mem.df2=df; mem.ok2=true;
     return {ok:true, msg:'계산했습니다 — 같은 두 가지 일을 했는데 순서를 바꾸자 '+r[4]+' 만큼 어긋났습니다.'};
   }}""",
 """  {t:'판단 — <b>전단만</b> 주고 (각도 0 · 확대 1 배) 행렬식을 보고 고르세요',
   f:'전단 = {0} · 행렬식 = {1} · 1 이면 1, 아니면 0 → {2}',
   opts:['합성변환은 <b>행렬의 곱</b> 이고 행렬 곱셈은 순서를 탄다 — 한편 전단 [1 h ; 0 1] 의 행렬식은 h 와 상관없이 1 이라 넓이를 바꾸지 않는다',
         '변환의 순서를 바꿔도 결과는 늘 같다',
         '전단은 밀어내는 만큼 넓이도 늘린다'],
   chk(got, r, mem, pick){
     if(!mem.ok2) return {ok:false, msg:'② 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const sh=noteNum(r[2]), det=noteNum(r[3]);
     if(!(sh>0.05)) return {ok:false, msg:'전단이 '+r[2]+' 입니다 — 0 보다 크게 주세요.'};
     if(Math.abs(det-1)>0.02) return {ok:false, msg:'행렬식이 '+r[3]+' 입니다 — 각도를 0 으로, 확대를 1 배로 두세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-sh)>0.06) return {ok:false, msg:'전단은 '+r[2]+' 입니다.'};
     if(Math.abs(got[1]-det)>0.005) return {ok:false, msg:'행렬식은 '+r[3]+' 입니다.'};
     if(Math.abs(got[2]-1)>0.01) return {ok:false, msg:'행렬식 '+r[3]+' 를 1 과 견주세요.'};
     if(pick!==0)
       return {ok:false, msg:'순서 차이가 0 일 때도 '+mem.df2+' 일 때도 행렬식은 그대로였습니다. 합성은 무엇에 해당할까요? 다시 고르세요.'};
     return {ok:true, msg:'판단했습니다 — <b>합성변환은 행렬의 곱이고, 곱셈은 순서를 탑니다.</b> 한편 전단은 세로줄을 그대로 두고 가로로만 밀어 넓이를 바꾸지 않습니다.'};
   }}""")
 +
 note(258, '내가 떠나고 · 내가 기다리고 · 내가 판단한다',
 """  {t:'기록 — <b>단계를 몇 단계만</b> 올리고 적으세요 (정상상태에 아직 닿지 않게)',
   f:'단계 = {0} · 지금 A = {1} % · 정상상태 = {2} %',
   chk(got, r, mem){
     if(!r) return {ok:false, msg:'아직 화면 값이 없습니다.'};
     const n=noteNum(r[1]), a=noteNum(r[2]), st=noteNum(r[3]);
     if(!(n>=1)) return {ok:false, msg:'단계가 0 입니다 — 1 이상으로 올리세요.'};
     if(!(Math.abs(a-st)>0.2)) return {ok:false, msg:'이미 정상상태에 닿았습니다 — 단계를 줄이세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-n)>0.5) return {ok:false, msg:'단계는 '+r[1]+' 입니다.'};
     if(Math.abs(got[1]-a)>0.05) return {ok:false, msg:'지금 A 는 '+r[2]+' 입니다.'};
     if(Math.abs(got[2]-st)>0.05) return {ok:false, msg:'정상상태는 '+r[3]+' 입니다.'};
     mem.st=st; mem.a1=a; mem.s01=noteNum(r[0]);
     return {ok:true, msg:'기록했습니다 — 아직 정상상태 '+r[3]+' 에서 떨어져 있습니다. 더 가 봅시다.'};
   }}""",
 """  {t:'생각 — <b>단계를 20 이상</b> 으로 올리고, 정상상태와의 차를 구하세요',
   f:'단계 = {0} · 지금 A = {1} % · 정상상태와의 차 = {2} %p',
   chk(got, r, mem){
     if(mem.st===undefined) return {ok:false, msg:'① 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const n=noteNum(r[1]), a=noteNum(r[2]), st=noteNum(r[3]);
     if(!(n>=20)) return {ok:false, msg:'단계가 '+r[1]+' 입니다 — 20 이상으로 올리세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-n)>0.5) return {ok:false, msg:'단계는 '+r[1]+' 입니다.'};
     if(Math.abs(got[1]-a)>0.05) return {ok:false, msg:'지금 A 는 '+r[2]+' 입니다.'};
     if(Math.abs(got[2]-Math.abs(a-st))>0.05) return {ok:false, msg:r[2]+' 와 '+r[3]+' 의 차를 구해 보세요.'};
     mem.ok2=true;
     return {ok:true, msg:'계산했습니다 — 차이가 거의 0 입니다. 처음 비율을 바꿔 보면 어떨까요?'};
   }}""",
 """  {t:'판단 — <b>처음 A 의 비율을 바꾸고</b> (단계는 20 이상 그대로) 고르세요',
   f:'처음 A = {0} % · 20단계 뒤 A = {1} % · 정상상태 = {2} %',
   opts:['정상상태는 <b>πP = π 를 만족하는 분포</b> 이고, 차이가 매 단계 같은 비율로 줄어 <b>출발점의 기억이 사라진다</b> — 그래서 어디서 떠나든 같은 곳에 닿는다',
         '처음 비율이 다르면 오래 뒤에도 다른 곳에 닿는다',
         '단계가 늘수록 두 가게의 비율 합이 1 보다 커진다'],
   chk(got, r, mem, pick){
     if(!mem.ok2) return {ok:false, msg:'② 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const s0=noteNum(r[0]), n=noteNum(r[1]), a=noteNum(r[2]), st=noteNum(r[3]);
     if(!(n>=20)) return {ok:false, msg:'단계는 20 이상으로 두세요 (지금 '+r[1]+').'};
     if(Math.abs(s0-mem.s01)<1) return {ok:false, msg:'처음 A 의 비율을 ①·②와 다르게 바꾸세요 (지금 '+r[0]+').'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-s0)>1) return {ok:false, msg:'처음 A 는 '+r[0]+' 입니다.'};
     if(Math.abs(got[1]-a)>0.05) return {ok:false, msg:'20단계 뒤 A 는 '+r[2]+' 입니다.'};
     if(Math.abs(got[2]-st)>0.05) return {ok:false, msg:'정상상태는 '+r[3]+' 입니다.'};
     if(Math.abs(a-st)>0.2) return {ok:false, msg:'아직 정상상태에 닿지 않았습니다 — 단계를 더 올리세요.'};
     if(pick!==0)
       return {ok:false, msg:'처음 '+mem.s01+'% 에서 떠났을 때도, '+r[0]+' 에서 떠났을 때도 같은 '+r[3]+' 에 닿았습니다. 출발점은 결과를 정할까요? 다시 고르세요.'};
     return {ok:true, msg:'판단했습니다 — <b>오래 지나면 출발점의 기억이 사라집니다.</b> 정상상태는 πP = π 로 구하고, 검색 순위·날씨 모형·고객 이동이 모두 이 셈을 씁니다.'};
   }}""")
 +
 note(259, '내가 덜어 내고 · 내가 지나치고 · 내가 판단한다',
 """  {t:'기록 — <b>덜어 낼 비율을 0</b> 으로 두고 적으세요',
   f:'비율 = {0} · 내적 = {1} · 사잇각 = {2} °',
   chk(got, r, mem){
     if(!r) return {ok:false, msg:'아직 화면 값이 없습니다.'};
     const t=noteNum(r[1]), d=noteNum(r[2]), ang=noteNum(r[3]);
     if(Math.abs(t)>1e-9) return {ok:false, msg:'비율이 '+r[1]+' 입니다 — 0 으로 내리세요.'};
     if(Math.abs(d)<0.02) return {ok:false, msg:'이미 직각입니다 — v 를 u 와 다른 방향으로 바꾸세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-t)>0.02) return {ok:false, msg:'비율은 '+r[1]+' 입니다.'};
     if(Math.abs(got[1]-d)>0.0005) return {ok:false, msg:'내적은 '+r[2]+' 입니다.'};
     if(Math.abs(got[2]-ang)>0.2) return {ok:false, msg:'사잇각은 '+r[3]+' 입니다.'};
     mem.d1=d; mem.ang1=ang;
     return {ok:true, msg:'기록했습니다 — 내적이 '+r[2]+' 라 아직 직각이 아닙니다. 덜어 내 봅시다.'};
   }}""",
 """  {t:'생각 — 비율을 옮겨 <b>내적이 0</b> 이 되게 하고 적으세요',
   f:'비율 = {0} · 내적 = {1} · 사잇각 = {2} °',
   chk(got, r, mem){
     if(mem.d1===undefined) return {ok:false, msg:'① 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const t=noteNum(r[1]), d=noteNum(r[2]), ang=noteNum(r[3]);
     if(!(Math.abs(d)<0.02)) return {ok:false, msg:'내적이 '+r[2]+' 입니다 — 비율을 옮겨 0 에 맞추세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-t)>0.02) return {ok:false, msg:'비율은 '+r[1]+' 입니다.'};
     if(Math.abs(got[1]-d)>0.0005) return {ok:false, msg:'내적은 '+r[2]+' 입니다.'};
     if(Math.abs(got[2]-ang)>0.2) return {ok:false, msg:'사잇각은 '+r[3]+' 입니다.'};
     if(Math.abs(ang-90)>1) return {ok:false, msg:'사잇각이 90° 가 되어야 합니다 (지금 '+r[3]+').'};
     mem.t2=t; mem.ok2=true;
     return {ok:true, msg:'계산했습니다 — 비율 '+r[1]+' 에서 정확히 직각이 되었습니다.'};
   }}""",
 """  {t:'판단 — <b>비율을 1.3 보다 크게</b> 더 덜어 낸 뒤 고르세요',
   f:'비율 = {0} · 내적 = {1} · 내적이 0 보다 작으면 1, 크면 0 → {2}',
   opts:['w = v − k·u 에서 <b>w·u = 0</b> 을 풀면 k = (v·u)/(u·u) 하나로 정해진다 — 모자라게 덜어 내면 같은 쪽으로, 넘치게 덜어 내면 반대쪽으로 기울어 직각이 되지 않는다',
         '많이 덜어 낼수록 더 직각에 가까워진다',
         '덜어 내는 비율은 v 의 길이에 따라 달라진다'],
   chk(got, r, mem, pick){
     if(!mem.ok2) return {ok:false, msg:'② 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const t=noteNum(r[1]), d=noteNum(r[2]);
     if(!(t>=1.3)) return {ok:false, msg:'비율이 '+r[1]+' 입니다 — 1.3 보다 크게 올리세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-t)>0.02) return {ok:false, msg:'비율은 '+r[1]+' 입니다.'};
     if(Math.abs(got[1]-d)>0.0005) return {ok:false, msg:'내적은 '+r[2]+' 입니다.'};
     if(Math.abs(got[2]-(d<0?1:0))>0.01) return {ok:false, msg:'내적 '+r[2]+' 의 부호를 보세요.'};
     if(pick!==0)
       return {ok:false, msg:'비율 0 에서 내적이 '+mem.d1+' , '+mem.t2+' 에서 0 , 지금은 '+r[2]+' 입니다. 직각이 되는 비율은 몇 개일까요? 다시 고르세요.'};
     return {ok:true, msg:'판단했습니다 — <b>직교화는 「얼마나 덜어 낼까」 한 번으로 끝납니다.</b> 그 비율이 (v·u)/(u·u) 이고, 이것을 차례로 하면 어떤 기저도 직교 기저로 바꿀 수 있습니다.'};
   }}""")
 +
 note(260, '내가 어긋내고 · 내가 맞추고 · 내가 판단한다',
 """  {t:'기록 — <b>직선을 크게 어긋나게</b> 두고 적으세요 (오차 제곱합 1 이상)',
   f:'오차 제곱합 = {0} · 오차 · x = {1} · 오차의 합 = {2}',
   chk(got, r, mem){
     if(!r) return {ok:false, msg:'아직 화면 값이 없습니다.'};
     const sse=noteNum(r[2]), dx=noteNum(r[3]), d1=noteNum(r[4]);
     if(!(sse>=1)) return {ok:false, msg:'오차 제곱합이 '+r[2]+' 입니다 — a 와 b 를 더 어긋나게 두세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-sse)>0.02) return {ok:false, msg:'오차 제곱합은 '+r[2]+' 입니다.'};
     if(Math.abs(got[1]-dx)>0.02) return {ok:false, msg:'오차 · x 는 '+r[3]+' 입니다.'};
     if(Math.abs(got[2]-d1)>0.02) return {ok:false, msg:'오차의 합은 '+r[4]+' 입니다.'};
     mem.sse1=sse; mem.dx1=dx;
     return {ok:true, msg:'기록했습니다 — 오차 제곱합이 '+r[2]+' 이고 두 내적도 0 이 아닙니다. 가장 가까운 직선으로 가 봅시다.'};
   }}""",
 """  {t:'생각 — <b>「가장 가까운 직선 찾기」</b> 를 누르고 다시 적으세요',
   f:'오차 제곱합 = {0} · 오차 · x = {1} · 오차의 합 = {2}',
   chk(got, r, mem){
     if(mem.sse1===undefined) return {ok:false, msg:'① 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const sse=noteNum(r[2]), dx=noteNum(r[3]), d1=noteNum(r[4]);
     if(!(Math.abs(dx)<0.05&&Math.abs(d1)<0.05))
       return {ok:false, msg:'두 내적이 '+r[3]+' 와 '+r[4]+' 입니다 — 「가장 가까운 직선 찾기」 를 누르세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-sse)>0.02) return {ok:false, msg:'오차 제곱합은 '+r[2]+' 입니다.'};
     if(Math.abs(got[1]-dx)>0.02) return {ok:false, msg:'오차 · x 는 '+r[3]+' 입니다.'};
     if(Math.abs(got[2]-d1)>0.02) return {ok:false, msg:'오차의 합은 '+r[4]+' 입니다.'};
     if(!(sse<mem.sse1)) return {ok:false, msg:'오차 제곱합이 ①의 '+mem.sse1+' 보다 작아져야 합니다.'};
     mem.sse2=sse; mem.ok2=true;
     return {ok:true, msg:'계산했습니다 — 오차 제곱합이 가장 작아진 자리에서 두 내적이 모두 0 입니다.'};
   }}""",
 """  {t:'판단 — 두 오차 제곱합을 나란히 두고 고르세요',
   f:'①의 오차 제곱합 = {0} · ②의 오차 제곱합 = {1} · ②가 더 작으면 1, 아니면 0 → {2}',
   opts:['거리가 가장 짧아지는 것은 <b>잔차가 직선을 만드는 방향들과 모두 수직일 때</b> 다 — 그래서 「가장 가까움」과 「직각」이 같은 말이 되고, 두 내적이 0 이라는 정규방정식이 나온다',
         '오차를 0 으로 만들 수 있을 때만 답을 구할 수 있다',
         '오차 제곱합이 가장 작을 때 두 내적은 가장 커진다'],
   chk(got, r, mem, pick){
     if(!mem.ok2) return {ok:false, msg:'② 칸을 먼저 통과하세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-mem.sse1)>0.02) return {ok:false, msg:'①에 적은 '+mem.sse1+' 입니다.'};
     if(Math.abs(got[1]-mem.sse2)>0.02) return {ok:false, msg:'②에 적은 '+mem.sse2+' 입니다.'};
     if(Math.abs(got[2]-1)>0.01) return {ok:false, msg:'두 값을 견주세요.'};
     if(pick!==0)
       return {ok:false, msg:'오차 제곱합이 '+mem.sse1+' 에서 '+mem.sse2+' 로 줄었고, 그때 두 내적이 0 이 되었습니다. 둘은 무슨 관계일까요? 다시 고르세요.'};
     return {ok:true, msg:'판단했습니다 — <b>해가 없어도 가장 가까운 답은 언제나 있습니다.</b> 그 답은 오차를 없애는 답이 아니라 오차를 수직으로 만드는 답이고, 회귀분석과 기계학습이 모두 이 자리에서 시작합니다.'};
   }}""")
)
