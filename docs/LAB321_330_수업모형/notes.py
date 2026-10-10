# -*- coding: utf-8 -*-
"""LAB 321~330 탐구 노트 — 기록 → 생각 → 판단. 판정은 화면의 read() 값으로만 한다."""


def note(no, head, c1, c2, c3):
    return "\n %d:{ h:'%s',\n  c:[\n%s,\n%s,\n%s\n ]},\n" % (no, head, c1, c2, c3)


NOTES = (
 note(321, '내가 맞추고 · 내가 늘이고 · 내가 판단한다',
 """  {t:'기록 — <b>자료 구간 안</b> 을 예측해 적으세요',
   f:'차수 = {0} · 예측값 = {1} · 맞춤 오차 = {2}',
   chk(got, r, mem){
     if(!r) return {ok:false, msg:'아직 화면 값이 없습니다.'};
     const d=noteNum(r[0]), v=noteNum(r[2]), e=noteNum(r[3]);
     if(String(r[4])!=='안') return {ok:false, msg:'예측 지점이 자료 구간 밖입니다 — ②에서 볼 테니 1~8 안으로 두세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-d)>0.5) return {ok:false, msg:'차수는 '+r[0]+' 입니다.'};
     if(Math.abs(got[1]-v)>0.05) return {ok:false, msg:'예측값은 '+r[2]+' 입니다.'};
     if(Math.abs(got[2]-e)>0.01) return {ok:false, msg:'맞춤 오차는 '+r[3]+' 입니다.'};
     mem.v1=v; mem.e1=e;
     return {ok:true, msg:'기록했습니다 — 구간 안에서는 예측이 자료와 잘 맞습니다.'};
   }}""",
 """  {t:'생각 — <b>차수를 5 이상</b> 으로 올리고 <b>구간 밖</b> 을 예측해 적으세요',
   f:'차수 = {0} · 예측값 = {1} · 맞춤 오차 = {2}',
   chk(got, r, mem){
     if(mem.v1===undefined) return {ok:false, msg:'① 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const d=noteNum(r[0]), v=noteNum(r[2]), e=noteNum(r[3]);
     if(!(d>=5)) return {ok:false, msg:'차수가 '+r[0]+' 입니다 — 5 이상으로 올리세요.'};
     if(String(r[4])!=='밖') return {ok:false, msg:'예측 지점이 구간 안입니다 — 밖(14 쯤)으로 옮기세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-d)>0.5) return {ok:false, msg:'차수는 '+r[0]+' 입니다.'};
     if(Math.abs(got[1]-v)>Math.max(0.5,Math.abs(v)*0.02)) return {ok:false, msg:'예측값은 '+r[2]+' 입니다.'};
     if(Math.abs(got[2]-e)>0.01) return {ok:false, msg:'맞춤 오차는 '+r[3]+' 입니다.'};
     mem.v2=v; mem.e2=e; mem.ok2=true;
     return {ok:true, msg:'계산했습니다 — 자료에는 더 잘 맞는데(오차 '+r[3]+') 구간 밖에서는 크게 튑니다.'};
   }}""",
 """  {t:'판단 — 두 예측값을 나란히 두고 고르세요',
   f:'①의 예측값 = {0} · ②의 예측값 = {1} · 자료 밖에서 더 믿을 만한 쪽이 ① 이면 1 → {2}',
   opts:['맞춤 오차가 작다고 <b>예측이 더 믿을 만한 것은 아니다</b> — 차수를 높이면 자료에는 더 잘 맞지만 구간 밖에서는 크게 튄다. 외삽은 모형의 가정을 그대로 증폭한다',
         '자료에 가장 잘 맞는 곡선이 예측도 가장 정확하다',
         '차수를 높일수록 예측이 안정된다'],
   chk(got, r, mem, pick){
     if(!mem.ok2) return {ok:false, msg:'② 칸을 먼저 통과하세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-mem.v1)>0.05) return {ok:false, msg:'①에 적은 '+mem.v1+' 입니다.'};
     if(Math.abs(got[1]-mem.v2)>Math.max(0.5,Math.abs(mem.v2)*0.02)) return {ok:false, msg:'②에 적은 '+mem.v2+' 입니다.'};
     if(Math.abs(got[2]-1)>0.1) return {ok:false, msg:'구간 안이 더 믿을 만했습니다.'};
     if(pick!==0)
       return {ok:false, msg:'맞춤 오차는 5 차가 더 작았는데 구간 밖 예측은 크게 튀었습니다. 무엇을 믿어야 할까요? 다시 고르세요.'};
     return {ok:true, msg:'판단했습니다 — <b>외삽은 가정의 증폭입니다.</b> 예측을 말할 때는 「어느 구간의 자료로 어떤 모형을 썼는지」 를 함께 밝혀야 합니다.'};
   }}""")
 +
 note(322, '내가 기울이고 · 내가 맞추고 · 내가 판단한다',
 """  {t:'기록 — 두 직선이 <b>수직</b> 이 되게 맞추고 적으세요',
   f:'① 기울기 = {0} · ② 기울기 = {1} · 두 기울기의 곱 = {2}',
   chk(got, r, mem){
     if(!r) return {ok:false, msg:'아직 화면 값이 없습니다.'};
     const m1=noteNum(r[0]), m2=noteNum(r[1]), p=noteNum(r[2]);
     if(String(r[3])!=='수직') return {ok:false, msg:'지금 판정이 «'+r[3]+'» 입니다 — 곱이 −1 이 되게 맞추세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-m1)>0.05) return {ok:false, msg:'① 기울기는 '+r[0]+' 입니다.'};
     if(Math.abs(got[1]-m2)>0.05) return {ok:false, msg:'② 기울기는 '+r[1]+' 입니다.'};
     if(Math.abs(got[2]-p)>0.05) return {ok:false, msg:'곱은 '+r[2]+' 입니다.'};
     mem.p1=p;
     return {ok:true, msg:'기록했습니다 — 곱이 −1 이라 직각으로 만납니다.'};
   }}""",
 """  {t:'생각 — 이제 <b>평행</b> 이 되게 맞추고 적으세요',
   f:'① 기울기 = {0} · ② 기울기 = {1} · 두 기울기의 곱 = {2}',
   chk(got, r, mem){
     if(mem.p1===undefined) return {ok:false, msg:'① 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const m1=noteNum(r[0]), m2=noteNum(r[1]), p=noteNum(r[2]);
     if(String(r[3])!=='평행') return {ok:false, msg:'지금 판정이 «'+r[3]+'» 입니다 — 기울기를 같게 하고 절편은 다르게 하세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-m1)>0.05) return {ok:false, msg:'① 기울기는 '+r[0]+' 입니다.'};
     if(Math.abs(got[1]-m2)>0.05) return {ok:false, msg:'② 기울기는 '+r[1]+' 입니다.'};
     if(Math.abs(got[2]-p)>0.05) return {ok:false, msg:'곱은 '+r[2]+' 입니다.'};
     mem.p2=p; mem.ok2=true;
     return {ok:true, msg:'계산했습니다 — 기울기가 같고 절편이 다르니 아무리 늘여도 만나지 않습니다.'};
   }}""",
 """  {t:'판단 — 두 곱을 나란히 두고 고르세요',
   f:'①의 곱 = {0} · ②의 곱 = {1} · 기울기가 3 인 직선과 수직인 직선의 기울기 = {2}',
   opts:['<b>곱이 −1 이면 수직, 기울기가 같고 절편이 다르면 평행</b> 이다 — 그려 보지 않고 기울기와 절편만 보고 판정할 수 있다',
         '기울기가 다르면 언제나 수직이다',
         '기울기가 같으면 두 직선은 늘 같은 직선이다'],
   chk(got, r, mem, pick){
     if(!mem.ok2) return {ok:false, msg:'② 칸을 먼저 통과하세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-mem.p1)>0.05) return {ok:false, msg:'①에 적은 '+mem.p1+' 입니다.'};
     if(Math.abs(got[1]-mem.p2)>0.05) return {ok:false, msg:'②에 적은 '+mem.p2+' 입니다.'};
     if(Math.abs(got[2]+1/3)>0.02) return {ok:false, msg:'3m = −1 을 푸세요.'};
     if(pick!==0)
       return {ok:false, msg:'곱이 −1 일 때 직각이었고, 같을 때 평행이었습니다. 정리하면 어떤 규칙일까요? 다시 고르세요.'};
     return {ok:true, msg:'판단했습니다 — <b>기울기만 보면 됩니다.</b> 수직은 곱이 −1(부호 반대·서로 역수), 평행은 기울기가 같고 절편이 다를 때입니다.'};
   }}""")
 +
 note(323, '내가 넣고 · 내가 나누고 · 내가 판단한다',
 """  {t:'기록 — 점을 <b>직선 밖</b> 에 두고 적으세요',
   f:'식의 값 = {0} · 거리 = {1} · 식의 값 ÷ 거리 = {2}',
   chk(got, r, mem){
     if(!r) return {ok:false, msg:'아직 화면 값이 없습니다.'};
     const v=noteNum(r[2]), d=noteNum(r[3]);
     if(!(d>0.02)) return {ok:false, msg:'점이 직선 위에 있습니다 — ②에서 볼 테니 밖으로 옮기세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-v)>0.01) return {ok:false, msg:'식의 값은 '+r[2]+' 입니다.'};
     if(Math.abs(got[1]-d)>0.01) return {ok:false, msg:'거리는 '+r[3]+' 입니다.'};
     if(Math.abs(Math.abs(got[2])-Math.abs(v)/d)>0.1) return {ok:false, msg:'식의 값을 거리로 나누면 얼마인가요?'};
     mem.d1=d; mem.ratio=Math.abs(v)/d;
     return {ok:true, msg:'기록했습니다 — 식의 값과 거리의 비가 '+ (Math.abs(v)/d).toFixed(2) +' 입니다.'};
   }}""",
 """  {t:'생각 — 점을 <b>직선 위</b> 로 옮기고 적으세요',
   f:'식의 값 = {0} · 거리 = {1}',
   chk(got, r, mem){
     if(mem.d1===undefined) return {ok:false, msg:'① 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const v=noteNum(r[2]), d=noteNum(r[3]);
     if(!(d<0.02)) return {ok:false, msg:'거리가 '+r[3]+' 입니다 — 점을 직선 위로 옮기세요.'};
     if(![0,1].every(j=>isFinite(got[j]))) return {ok:false, msg:'두 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-v)>0.01) return {ok:false, msg:'식의 값은 '+r[2]+' 입니다.'};
     if(Math.abs(got[1]-d)>0.01) return {ok:false, msg:'거리는 '+r[3]+' 입니다.'};
     mem.d2=d; mem.ok2=true;
     return {ok:true, msg:'계산했습니다 — 직선 위에서는 식의 값도 거리도 0 입니다.'};
   }}""",
 """  {t:'판단 — 분모의 뜻을 생각하며 고르세요',
   f:'①의 거리 = {0} · ②의 거리 = {1} · 식의 값을 거리로 바꾸려면 나누어야 하는 수 = {2}',
   opts:['식에 넣은 값은 거리가 아니다 — <b>√(a² + b²) 로 나누어야</b> 거리가 된다. 같은 직선을 2 배로 적으면 식의 값도 2 배가 되지만 분모도 2 배가 되어 거리는 그대로다',
         '식에 넣은 값이 곧 거리다',
         '직선을 2 배로 적으면 거리도 2 배가 된다'],
   chk(got, r, mem, pick){
     if(!mem.ok2) return {ok:false, msg:'② 칸을 먼저 통과하세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-mem.d1)>0.01) return {ok:false, msg:'①에 적은 '+mem.d1+' 입니다.'};
     if(Math.abs(got[1]-mem.d2)>0.01) return {ok:false, msg:'②에 적은 '+mem.d2+' 입니다.'};
     if(Math.abs(got[2]-mem.ratio)>0.1) return {ok:false, msg:'①에서 구한 비 '+mem.ratio.toFixed(2)+' 입니다.'};
     if(pick!==0)
       return {ok:false, msg:'식의 값과 거리의 비가 늘 √(a²+b²) 였습니다. 분모는 무엇일까요? 다시 고르세요.'};
     return {ok:true, msg:'판단했습니다 — <b>분모는 법선벡터의 길이입니다.</b> 그래서 같은 직선을 몇 배로 적어도 거리는 변하지 않습니다.'};
   }}""")
 +
 note(324, '내가 옮기고 · 내가 맞추고 · 내가 판단한다',
 """  {t:'기록 — 직선이 원과 <b>두 점에서 만나게</b> 두고 적으세요',
   f:'반지름 r = {0} · 거리 d = {1} · 만나는 점의 수 = {2}',
   chk(got, r, mem){
     if(!r) return {ok:false, msg:'아직 화면 값이 없습니다.'};
     const rr=noteNum(r[0]), d=noteNum(r[3]);
     if(String(r[4])!=='두 점') return {ok:false, msg:'지금 판정이 «'+r[4]+'» 입니다 — 절편을 줄여 두 점에서 만나게 하세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-rr)>0.05) return {ok:false, msg:'반지름은 '+r[0]+' 입니다.'};
     if(Math.abs(got[1]-d)>0.02) return {ok:false, msg:'거리는 '+r[3]+' 입니다.'};
     if(Math.abs(got[2]-2)>0.1) return {ok:false, msg:'두 점에서 만나고 있습니다.'};
     mem.d1=d; mem.r=rr;
     return {ok:true, msg:'기록했습니다 — d 가 r 보다 작아 두 점에서 만납니다.'};
   }}""",
 """  {t:'생각 — 절편을 옮겨 <b>접하게</b> 하고 적으세요',
   f:'반지름 r = {0} · 거리 d = {1} · 만나는 점의 수 = {2}',
   chk(got, r, mem){
     if(mem.d1===undefined) return {ok:false, msg:'① 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const rr=noteNum(r[0]), d=noteNum(r[3]);
     if(String(r[4])!=='접함') return {ok:false, msg:'지금 판정이 «'+r[4]+'» 입니다 — d 와 r 이 같아지게 맞추세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-rr)>0.05) return {ok:false, msg:'반지름은 '+r[0]+' 입니다.'};
     if(Math.abs(got[1]-d)>0.02) return {ok:false, msg:'거리는 '+r[3]+' 입니다.'};
     if(Math.abs(got[2]-1)>0.1) return {ok:false, msg:'접할 때는 한 점에서 만납니다.'};
     mem.d2=d; mem.ok2=true;
     return {ok:true, msg:'계산했습니다 — d 와 r 이 같아지자 접했습니다.'};
   }}""",
 """  {t:'판단 — 두 거리를 나란히 두고 고르세요',
   f:'①의 d = {0} · ②의 d = {1} · d 가 r 보다 크면 만나는 점의 수 = {2}',
   opts:['중심에서 직선까지의 <b>거리 d 와 반지름 r 만 견주면</b> 된다 — d < r 이면 두 점, d = r 이면 접함, d > r 이면 만나지 않는다. 판별식으로 푸는 것과 같은 결론이다',
         '직선의 기울기가 크면 원과 만난다',
         '연립해서 판별식을 보지 않으면 알 수 없다'],
   chk(got, r, mem, pick){
     if(!mem.ok2) return {ok:false, msg:'② 칸을 먼저 통과하세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-mem.d1)>0.02) return {ok:false, msg:'①에 적은 '+mem.d1+' 입니다.'};
     if(Math.abs(got[1]-mem.d2)>0.02) return {ok:false, msg:'②에 적은 '+mem.d2+' 입니다.'};
     if(Math.abs(got[2])>0.1) return {ok:false, msg:'멀리 떨어지면 만나지 않습니다.'};
     if(pick!==0)
       return {ok:false, msg:'d 를 r 과 견주기만 했는데 세 경우가 갈렸습니다. 무엇만 보면 될까요? 다시 고르세요.'};
     return {ok:true, msg:'판단했습니다 — <b>d 와 r 하나로 끝납니다.</b> 접선의 조건을 구할 때도 「거리 = 반지름」 을 그대로 쓰면 됩니다.'};
   }}""")
 +
 note(325, '내가 옮기고 · 내가 거꾸로 하고 · 내가 판단한다',
 """  {t:'기록 — <b>a 와 b 를 0 이 아니게</b> 옮기고 적으세요',
   f:'오른쪽으로 a = {0} · 위로 b = {1}',
   chk(got, r, mem){
     if(!r) return {ok:false, msg:'아직 화면 값이 없습니다.'};
     const a=noteNum(r[1]), b=noteNum(r[2]);
     if(Math.abs(a)<1e-9 && Math.abs(b)<1e-9) return {ok:false, msg:'아직 옮기지 않았습니다 — a 나 b 를 0 이 아니게 하세요.'};
     if(![0,1].every(j=>isFinite(got[j]))) return {ok:false, msg:'두 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-a)>0.05) return {ok:false, msg:'a 는 '+r[1]+' 입니다.'};
     if(Math.abs(got[1]-b)>0.05) return {ok:false, msg:'b 는 '+r[2]+' 입니다.'};
     mem.a1=a; mem.b1=b;
     return {ok:true, msg:'기록했습니다 — 식에서는 x 자리에 x − a 가 들어갔습니다.'};
   }}""",
 """  {t:'생각 — <b>「부호를 그대로 두기」</b> 를 켜고 적으세요',
   f:'오른쪽으로 a = {0} · 위로 b = {1} · 도형이 반대쪽으로 가면 1, 그대로면 0 → {2}',
   chk(got, r, mem){
     if(mem.a1===undefined) return {ok:false, msg:'① 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const a=noteNum(r[1]), b=noteNum(r[2]);
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-a)>0.05) return {ok:false, msg:'a 는 '+r[1]+' 입니다.'};
     if(Math.abs(got[1]-b)>0.05) return {ok:false, msg:'b 는 '+r[2]+' 입니다.'};
     if(Math.abs(got[2]-1)>0.1) return {ok:false, msg:'부호를 그대로 두면 옮기려던 쪽의 반대로 갑니다.'};
     mem.ok2=true;
     return {ok:true, msg:'계산했습니다 — 부호를 그대로 쓰면 반대로 갑니다.'};
   }}""",
 """  {t:'판단 — 옮기는 규칙을 정리하고 고르세요',
   f:'①의 a = {0} · ①의 b = {1} · 오른쪽으로 a 만큼 옮길 때 x 자리에 x − a 를 넣으면 1 → {2}',
   opts:['옮긴 도형 위의 점 (x, y) 는 <b>원래 도형의 (x − a, y − b)</b> 였다 — 그래서 식에서는 x 자리에 x − a 를 넣게 되고, 모양(기울기·폭)은 그대로 남는다',
         '오른쪽으로 옮기므로 x 자리에 x + a 를 넣는다',
         '평행이동하면 도형의 모양도 함께 바뀐다'],
   chk(got, r, mem, pick){
     if(!mem.ok2) return {ok:false, msg:'② 칸을 먼저 통과하세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-mem.a1)>0.05) return {ok:false, msg:'①에 적은 '+mem.a1+' 입니다.'};
     if(Math.abs(got[1]-mem.b1)>0.05) return {ok:false, msg:'①에 적은 '+mem.b1+' 입니다.'};
     if(Math.abs(got[2]-1)>0.1) return {ok:false, msg:'x − a 를 넣는 것이 맞습니다.'};
     if(pick!==0)
       return {ok:false, msg:'부호를 그대로 두니 반대쪽으로 갔습니다. 왜 빼기를 넣을까요? 다시 고르세요.'};
     return {ok:true, msg:'판단했습니다 — <b>옮겨도 모양은 남고 자리만 바뀝니다.</b> y = f(x − a) + b 의 부호는 「원래 자리로 되돌려 보는 것」 이라고 읽으면 헷갈리지 않습니다.'};
   }}""")
 +
 note(326, '내가 뒤집고 · 내가 맞바꾸고 · 내가 판단한다',
 """  {t:'기록 — <b>x 축 대칭</b> 으로 옮긴 점을 적으세요',
   f:'옮긴 점의 x = {0} · 옮긴 점의 y = {1}',
   chk(got, r, mem){
     if(!r) return {ok:false, msg:'아직 화면 값이 없습니다.'};
     if(String(r[0]).indexOf('x축')<0) return {ok:false, msg:'지금은 «'+r[0]+'» 입니다 — x 축 대칭으로 고르세요.'};
     const q=String(r[2]).match(/-?\\d+(\\.\\d+)?/g);
     if(!q||q.length<2) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     if(![0,1].every(j=>isFinite(got[j]))) return {ok:false, msg:'두 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-(+q[0]))>0.05) return {ok:false, msg:'옮긴 점은 '+r[2]+' 입니다.'};
     if(Math.abs(got[1]-(+q[1]))>0.05) return {ok:false, msg:'옮긴 점은 '+r[2]+' 입니다.'};
     mem.x1=+q[0]; mem.y1=+q[1];
     return {ok:true, msg:'기록했습니다 — x 축 대칭은 y 의 부호만 바뀝니다.'};
   }}""",
 """  {t:'생각 — <b>y = x 대칭</b> 으로 바꾸고 적으세요',
   f:'옮긴 점의 x = {0} · 옮긴 점의 y = {1} · 부호만 바뀌면 1, 자리가 바뀌면 0 → {2}',
   chk(got, r, mem){
     if(mem.x1===undefined) return {ok:false, msg:'① 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     if(String(r[0]).indexOf('y')<0 || String(r[3])!=='x ↔ y') return {ok:false, msg:'지금은 «'+r[0]+'» 대칭입니다 — y = x 대칭으로 바꾸세요.'};
     const q=String(r[2]).match(/-?\\d+(\\.\\d+)?/g);
     if(!q||q.length<2) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-(+q[0]))>0.05) return {ok:false, msg:'옮긴 점은 '+r[2]+' 입니다.'};
     if(Math.abs(got[1]-(+q[1]))>0.05) return {ok:false, msg:'옮긴 점은 '+r[2]+' 입니다.'};
     if(Math.abs(got[2])>0.1) return {ok:false, msg:'화면은 «'+r[3]+'» 이라고 합니다 — 자리가 바뀌었습니다.'};
     mem.x2=+q[0]; mem.ok2=true;
     return {ok:true, msg:'계산했습니다 — y = x 대칭만 두 좌표를 통째로 맞바꿉니다.'};
   }}""",
 """  {t:'판단 — 두 결과를 나란히 두고 고르세요',
   f:'①의 옮긴 x = {0} · ②의 옮긴 x = {1} · (2, 1) 을 y = x 대칭하면 x 좌표 = {2}',
   opts:['x 축 · y 축 · 원점 대칭은 <b>부호만</b> 바꾸지만 y = x 대칭은 <b>x 와 y 를 통째로 맞바꾼다</b> — 그래서 역함수의 그래프가 y = x 에 대해 대칭이다',
         '네 대칭 모두 부호만 바꾼다',
         '원점 대칭과 y = x 대칭은 같은 것이다'],
   chk(got, r, mem, pick){
     if(!mem.ok2) return {ok:false, msg:'② 칸을 먼저 통과하세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-mem.x1)>0.05) return {ok:false, msg:'①에 적은 '+mem.x1+' 입니다.'};
     if(Math.abs(got[1]-mem.x2)>0.05) return {ok:false, msg:'②에 적은 '+mem.x2+' 입니다.'};
     if(Math.abs(got[2]-1)>0.05) return {ok:false, msg:'(2, 1) 의 x 와 y 를 맞바꾸세요.'};
     if(pick!==0)
       return {ok:false, msg:'앞의 셋은 부호만 바뀌었는데 y = x 대칭만 달랐습니다. 무엇이 달랐을까요? 다시 고르세요.'};
     return {ok:true, msg:'판단했습니다 — <b>y = x 대칭만 자리바꿈입니다.</b> (x, y) → (y, x) 이고, 이것이 역함수를 그릴 때 그대로 쓰입니다.'};
   }}""")
 +
 note(327, '내가 칠하고 · 내가 세고 · 내가 판단한다',
 """  {t:'기록 — <b>A ∪ B</b> 를 고르고 적으세요',
   f:'칠해진 구역의 수 = {0} · 원소 수 = {1}',
   chk(got, r, mem){
     if(!r) return {ok:false, msg:'아직 화면 값이 없습니다.'};
     const reg=String(r[1]).match(/[01]/g)||[], on=reg.filter(v=>v==='1').length, n=noteNum(r[2]);
     if(String(r[0]).indexOf('∪')<0 || String(r[0]).indexOf('−')>=0) return {ok:false, msg:'지금은 «'+r[0]+'» 입니다 — A ∪ B 를 고르세요.'};
     if(![0,1].every(j=>isFinite(got[j]))) return {ok:false, msg:'두 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-on)>0.1) return {ok:false, msg:'칠해진 구역은 '+on+' 개입니다.'};
     if(Math.abs(got[1]-n)>0.5) return {ok:false, msg:'원소 수는 '+r[2]+' 입니다.'};
     mem.n1=n;
     return {ok:true, msg:'기록했습니다 — 합집합은 세 구역을 칠합니다.'};
   }}""",
 """  {t:'생각 — <b>A ∩ B</b> 로 바꾸고 적으세요',
   f:'칠해진 구역의 수 = {0} · 원소 수 = {1}',
   chk(got, r, mem){
     if(mem.n1===undefined) return {ok:false, msg:'① 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const reg=String(r[1]).match(/[01]/g)||[], on=reg.filter(v=>v==='1').length, n=noteNum(r[2]);
     if(String(r[0]).indexOf('∩')<0) return {ok:false, msg:'지금은 «'+r[0]+'» 입니다 — A ∩ B 를 고르세요.'};
     if(![0,1].every(j=>isFinite(got[j]))) return {ok:false, msg:'두 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-on)>0.1) return {ok:false, msg:'칠해진 구역은 '+on+' 개입니다.'};
     if(Math.abs(got[1]-n)>0.5) return {ok:false, msg:'원소 수는 '+r[2]+' 입니다.'};
     mem.n2=n; mem.ok2=true;
     return {ok:true, msg:'계산했습니다 — 교집합은 한 구역뿐입니다.'};
   }}""",
 """  {t:'판단 — 두 수를 나란히 두고 고르세요',
   f:'①의 원소 수 = {0} · ②의 원소 수 = {1} · |A| + |B| − |A∩B| = {2}',
   opts:['네 구역(A만 · B만 · 둘다 · 바깥)으로 나누면 <b>모든 연산이 구역의 합</b> 으로 적힌다 — 그래서 |A∪B| = |A| + |B| − |A∩B| 가 자연스럽게 나온다',
         '합집합의 원소 수는 |A| + |B| 다',
         '여집합에는 바깥이 들어가지 않는다'],
   chk(got, r, mem, pick){
     if(!mem.ok2) return {ok:false, msg:'② 칸을 먼저 통과하세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-mem.n1)>0.5) return {ok:false, msg:'①에 적은 '+mem.n1+' 입니다.'};
     if(Math.abs(got[1]-mem.n2)>0.5) return {ok:false, msg:'②에 적은 '+mem.n2+' 입니다.'};
     if(Math.abs(got[2]-mem.n1)>0.5) return {ok:false, msg:'①의 합집합과 같은 값이 나와야 합니다.'};
     if(pick!==0)
       return {ok:false, msg:'합집합은 세 구역, 교집합은 한 구역이었습니다. 어떻게 세면 될까요? 다시 고르세요.'};
     return {ok:true, msg:'판단했습니다 — <b>구역으로 세면 식이 보입니다.</b> |A∪B| = |A| + |B| − |A∩B| 는 겹친 구역을 두 번 세었다가 한 번 빼는 것입니다.'};
   }}""")
 +
 note(328, '내가 나누고 · 내가 밖으로 내고 · 내가 판단한다',
 """  {t:'기록 — <b>내분</b> 으로 두고 적으세요',
   f:'분모 = {0} · 점 P 의 x = {1}',
   chk(got, r, mem){
     if(!r) return {ok:false, msg:'아직 화면 값이 없습니다.'};
     const den=noteNum(r[2]), q=String(r[3]).match(/-?\\d+(\\.\\d+)?/g);
     if(String(r[0])!=='내분') return {ok:false, msg:'지금은 «'+r[0]+'» 입니다 — 내분으로 고르세요.'};
     if(!q) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     if(![0,1].every(j=>isFinite(got[j]))) return {ok:false, msg:'두 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-den)>0.5) return {ok:false, msg:'분모는 '+r[2]+' 입니다.'};
     if(Math.abs(got[1]-(+q[0]))>0.05) return {ok:false, msg:'P 는 '+r[3]+' 입니다.'};
     mem.den1=den; mem.x1=+q[0];
     return {ok:true, msg:'기록했습니다 — 분모가 m + n 이고 점이 선분 안에 있습니다.'};
   }}""",
 """  {t:'생각 — <b>외분</b> 으로 바꾸고 적으세요',
   f:'분모 = {0} · 점 P 의 x = {1}',
   chk(got, r, mem){
     if(mem.den1===undefined) return {ok:false, msg:'① 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const den=noteNum(r[2]), q=String(r[3]).match(/-?\\d+(\\.\\d+)?/g);
     if(String(r[0])!=='외분') return {ok:false, msg:'지금은 «'+r[0]+'» 입니다 — 외분으로 바꾸세요.'};
     if(!q) return {ok:false, msg:'m 과 n 이 같아 외분점이 없습니다 — 다르게 두세요.'};
     if(![0,1].every(j=>isFinite(got[j]))) return {ok:false, msg:'두 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-den)>0.5) return {ok:false, msg:'분모는 '+r[2]+' 입니다.'};
     if(Math.abs(got[1]-(+q[0]))>0.05) return {ok:false, msg:'P 는 '+r[3]+' 입니다.'};
     mem.den2=den; mem.ok2=true;
     return {ok:true, msg:'계산했습니다 — 분모가 m − n 으로 바뀌며 점이 선분 밖으로 나갔습니다.'};
   }}""",
 """  {t:'판단 — 두 분모를 나란히 두고 고르세요',
   f:'①의 분모 = {0} · ②의 분모 = {1} · m = n 일 때 외분의 분모 = {2}',
   opts:['내분은 m + n 으로, 외분은 <b>m − n 으로</b> 나눈다 — 그래서 m 과 n 이 가까울수록 외분점이 멀리 가고, m = n 이면 분모가 0 이 되어 외분점이 아예 없다',
         '내분과 외분은 분자만 다르고 분모는 같다',
         'm = n 이면 외분점이 선분의 한가운데에 생긴다'],
   chk(got, r, mem, pick){
     if(!mem.ok2) return {ok:false, msg:'② 칸을 먼저 통과하세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-mem.den1)>0.5) return {ok:false, msg:'①에 적은 '+mem.den1+' 입니다.'};
     if(Math.abs(got[1]-mem.den2)>0.5) return {ok:false, msg:'②에 적은 '+mem.den2+' 입니다.'};
     if(Math.abs(got[2])>0.1) return {ok:false, msg:'m − n 에 m = n 을 넣어 보세요.'};
     if(pick!==0)
       return {ok:false, msg:'분모가 m + n 에서 m − n 으로 바뀌자 점이 밖으로 나갔습니다. 무엇이 자리를 정할까요? 다시 고르세요.'};
     return {ok:true, msg:'판단했습니다 — <b>분모가 자리를 정합니다.</b> 외분은 n 을 −n 으로 바꾼 내분이라고 보면 식이 하나로 이어집니다.'};
   }}""")
 +
 note(329, '내가 긋고 · 내가 맞추고 · 내가 판단한다',
 """  {t:'기록 — 접선이 <b>아직 나란하지 않은</b> 자리에서 적으세요',
   f:'b = {0} · 평균 변화율 = {1} · f′(c) = {2}',
   chk(got, r, mem){
     if(!r) return {ok:false, msg:'아직 화면 값이 없습니다.'};
     const b=noteNum(r[1]), s=noteNum(r[2]), d=noteNum(r[3]);
     if(!isFinite(d)) return {ok:false, msg:'미분할 수 없는 자리입니다 — c 를 옮기세요.'};
     if(Math.abs(s-d)<0.02) return {ok:false, msg:'이미 나란합니다 — ②에서 볼 테니 c 를 옮겨 두세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-b)>0.05) return {ok:false, msg:'b 는 '+r[1]+' 입니다.'};
     if(Math.abs(got[1]-s)>0.01) return {ok:false, msg:'평균 변화율은 '+r[2]+' 입니다.'};
     if(Math.abs(got[2]-d)>0.01) return {ok:false, msg:'f′(c) 는 '+r[3]+' 입니다.'};
     mem.s1=s; mem.b=b;
     return {ok:true, msg:'기록했습니다 — 아직 두 값이 다릅니다. 접점을 옮겨 봅시다.'};
   }}""",
 """  {t:'생각 — 접점 c 를 옮겨 <b>나란하게</b> 맞추고 적으세요',
   f:'평균 변화율 = {0} · f′(c) = {1} · 두 값의 차 = {2}',
   chk(got, r, mem){
     if(mem.s1===undefined) return {ok:false, msg:'① 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const s=noteNum(r[2]), d=noteNum(r[3]);
     if(!isFinite(d)) return {ok:false, msg:'미분할 수 없는 자리입니다 — c 를 옮기세요.'};
     if(!(Math.abs(s-d)<0.02)) return {ok:false, msg:'아직 '+r[2]+' 와 '+r[3]+' 가 다릅니다 — c 를 더 옮기세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-s)>0.01) return {ok:false, msg:'평균 변화율은 '+r[2]+' 입니다.'};
     if(Math.abs(got[1]-d)>0.01) return {ok:false, msg:'f′(c) 는 '+r[3]+' 입니다.'};
     if(Math.abs(got[2])>0.03) return {ok:false, msg:'두 값이 거의 같습니다.'};
     mem.s2=s; mem.ok2=true;
     return {ok:true, msg:'계산했습니다 — 할선과 나란한 접선을 찾았습니다.'};
   }}""",
 """  {t:'판단 — 그런 c 가 늘 있는지 고르세요',
   f:'①의 평균 변화율 = {0} · ②의 f′(c) = {1} · f(x) = x², 구간 [−2, 3] 일 때의 c = {2}',
   opts:['닫힌 구간에서 연속이고 열린 구간에서 미분가능하면 <b>할선과 나란한 접선이 반드시 있다</b> — 평균 속력과 같은 순간 속력이 반드시 있다는 말이고, 꺾인 점이 있으면 깨질 수 있다',
         '그런 c 는 운이 좋을 때만 있다',
         '어떤 함수에서나 반드시 있다'],
   chk(got, r, mem, pick){
     if(!mem.ok2) return {ok:false, msg:'② 칸을 먼저 통과하세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-mem.s1)>0.01) return {ok:false, msg:'①에 적은 '+mem.s1+' 입니다.'};
     if(Math.abs(got[1]-mem.s2)>0.01) return {ok:false, msg:'②에 적은 '+mem.s2+' 입니다.'};
     if(Math.abs(got[2]-0.5)>0.05) return {ok:false, msg:'평균 변화율 1 에서 2c = 1 을 푸세요.'};
     if(pick!==0)
       return {ok:false, msg:'y = |x| 에서는 나란한 접선이 없었습니다. 조건이 무엇이었을까요? 다시 고르세요.'};
     return {ok:true, msg:'판단했습니다 — <b>조건을 갖추면 반드시 있습니다.</b> 평균값 정리는 「평균이 실제로 일어난 순간이 있다」 는 보장이고, 미분으로 함수의 모양을 읽는 모든 논증의 바탕입니다.'};
   }}""")
 +
 note(330, '내가 세고 · 내가 넓히고 · 내가 판단한다',
 """  {t:'기록 — <b>반례가 하나도 없는 명제</b> 를 골라 적으세요',
   f:'살펴본 범위 = {0} · 삐져나온 수(반례) = {1}',
   chk(got, r, mem){
     if(!r) return {ok:false, msg:'아직 화면 값이 없습니다.'};
     const N=noteNum(r[2]), bad=noteNum(r[3]);
     if(bad!==0) return {ok:false, msg:'반례가 '+r[3]+' 개입니다 — 참인 명제를 고르세요.'};
     if(![0,1].every(j=>isFinite(got[j]))) return {ok:false, msg:'두 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-N)>0.5) return {ok:false, msg:'범위는 '+r[2]+' 입니다.'};
     if(Math.abs(got[1])>0.1) return {ok:false, msg:'반례는 '+r[3]+' 개입니다.'};
     mem.n1=N;
     return {ok:true, msg:'기록했습니다 — 이 범위에서는 반례가 없습니다. 거짓인 명제는 어떨까요?'};
   }}""",
 """  {t:'생각 — <b>거짓인 명제</b> 로 바꾸고 <b>범위를 40 이상</b> 으로 넓혀 적으세요',
   f:'살펴본 범위 = {0} · 삐져나온 수(반례) = {1}',
   chk(got, r, mem){
     if(mem.n1===undefined) return {ok:false, msg:'① 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const N=noteNum(r[2]), bad=noteNum(r[3]);
     if(!(bad>0)) return {ok:false, msg:'반례가 없습니다 — 거짓인 명제로 바꾸세요.'};
     if(!(N>=40)) return {ok:false, msg:'범위가 '+r[2]+' 입니다 — 40 이상으로 넓히세요.'};
     if(![0,1].every(j=>isFinite(got[j]))) return {ok:false, msg:'두 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-N)>0.5) return {ok:false, msg:'범위는 '+r[2]+' 입니다.'};
     if(Math.abs(got[1]-bad)>0.5) return {ok:false, msg:'반례는 '+r[3]+' 개입니다.'};
     mem.bad2=bad; mem.ok2=true;
     return {ok:true, msg:'계산했습니다 — 범위를 넓혀도 반례는 사라지지 않습니다.'};
   }}""",
 """  {t:'판단 — 증명의 무게를 재어 보고 고르세요',
   f:'①의 반례 수 = {0} · ②의 반례 수 = {1} · 거짓임을 보이는 데 필요한 반례의 수 = {2}',
   opts:['참을 보이려면 <b>모든 경우</b> 를 다뤄야 하지만 거짓을 보이는 데는 <b>반례 하나</b> 면 충분하다 — 예를 아무리 많이 모아도 증명이 되지 않는 까닭이다',
         '예를 충분히 많이 확인하면 증명이 된다',
         '반례가 여러 개 있어야 거짓이라고 할 수 있다'],
   chk(got, r, mem, pick){
     if(!mem.ok2) return {ok:false, msg:'② 칸을 먼저 통과하세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0])>0.1) return {ok:false, msg:'①에서는 반례가 0 개였습니다.'};
     if(Math.abs(got[1]-mem.bad2)>0.5) return {ok:false, msg:'②에 적은 '+mem.bad2+' 입니다.'};
     if(Math.abs(got[2]-1)>0.1) return {ok:false, msg:'하나면 충분합니다.'};
     if(pick!==0)
       return {ok:false, msg:'참인 명제는 범위를 넓혀도 반례가 없었고, 거짓인 명제는 하나로 끝났습니다. 둘의 무게가 같을까요? 다시 고르세요.'};
     return {ok:true, msg:'판단했습니다 — <b>반례 하나면 충분합니다.</b> 「4 의 배수 → 2 의 배수」 는 참이지만 그 역은 6 이라는 반례 하나로 거짓이 됩니다 — 충분조건과 필요조건이 갈리는 자리입니다.'};
   }}""")
)
