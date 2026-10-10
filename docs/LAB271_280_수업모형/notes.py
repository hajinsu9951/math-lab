# -*- coding: utf-8 -*-
"""LAB 271~280 탐구 노트 — 기록 → 생각 → 판단. 판정은 화면의 read() 값으로만 한다."""


def note(no, head, c1, c2, c3):
    return "\n %d:{ h:'%s',\n  c:[\n%s,\n%s,\n%s\n ]},\n" % (no, head, c1, c2, c3)


NOTES = (
 note(271, '내가 돌리고 · 내가 맞추고 · 내가 판단한다',
 """  {t:'기록 — <b>두 화살표가 어긋난 자리</b> 에서 적으세요',
   f:'각 = {0} ° · f 값 = {1} · 어긋남 = {2}',
   chk(got, r, mem){
     if(!r) return {ok:false, msg:'아직 화면 값이 없습니다.'};
     const th=noteNum(r[1]), v=noteNum(r[2]), cr=noteNum(r[3]);
     if(!(Math.abs(cr)>=0.05)) return {ok:false, msg:'지금은 두 화살표가 나란합니다 — ②에서 볼 테니 각을 돌려 두세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-th)>0.5) return {ok:false, msg:'각은 '+r[1]+' 입니다.'};
     if(Math.abs(got[1]-v)>0.01) return {ok:false, msg:'f 값은 '+r[2]+' 입니다.'};
     if(Math.abs(got[2]-cr)>0.01) return {ok:false, msg:'어긋남은 '+r[3]+' 입니다.'};
     mem.v1=v; mem.R=noteNum(r[0]);
     return {ok:true, msg:'기록했습니다 — 여기서는 f 가 '+r[2]+' 입니다. 가장 큰 자리로 가 봅시다.'};
   }}""",
 """  {t:'생각 — <b>「가장 큰 자리로」</b> 를 누르고 다시 적으세요',
   f:'각 = {0} ° · f 값 = {1} · 어긋남 = {2}',
   chk(got, r, mem){
     if(mem.v1===undefined) return {ok:false, msg:'① 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const th=noteNum(r[1]), v=noteNum(r[2]), cr=noteNum(r[3]);
     if(!(Math.abs(cr)<0.05 && v>0)) return {ok:false, msg:'어긋남이 '+r[3]+' 입니다 — 「가장 큰 자리로」 를 누르세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-th)>0.5) return {ok:false, msg:'각은 '+r[1]+' 입니다.'};
     if(Math.abs(got[1]-v)>0.01) return {ok:false, msg:'f 값은 '+r[2]+' 입니다.'};
     if(Math.abs(got[2]-cr)>0.01) return {ok:false, msg:'어긋남은 '+r[3]+' 입니다.'};
     mem.v2=v; mem.ok2=true;
     return {ok:true, msg:'계산했습니다 — 어긋남이 거의 0 입니다. 두 기울기가 나란한 자리입니다.'};
   }}""",
 """  {t:'판단 — 최댓값을 반지름으로 나눠 보고 고르세요',
   f:'①의 f 값 = {0} · ②의 f 값 = {1} · ②의 f 값 ÷ 반지름 = {2}',
   opts:['조건 위에서 f 가 가장 커지는 곳은 <b>∇f 와 ∇g 가 나란해지는 자리</b> 다 — 등고선과 조건이 접하는 곳이고, 그래서 ∇f = λ∇g 로 적으면 울타리 안의 최댓값을 구할 수 있다',
         'f 를 미분해 0 이 되는 곳이 조건 위의 최댓값이다',
         '최댓값은 반지름과 상관없이 언제나 같다'],
   chk(got, r, mem, pick){
     if(!mem.ok2) return {ok:false, msg:'② 칸을 먼저 통과하세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-mem.v1)>0.01) return {ok:false, msg:'①에 적은 '+mem.v1+' 입니다.'};
     if(Math.abs(got[1]-mem.v2)>0.01) return {ok:false, msg:'②에 적은 '+mem.v2+' 입니다.'};
     if(Math.abs(got[2]-mem.v2/mem.R)>0.02) return {ok:false, msg:'②의 f 값을 반지름 '+mem.R+' 로 나누세요.'};
     if(pick!==0)
       return {ok:false, msg:'f 가 가장 컸을 때 어긋남이 0 이었습니다. 그 자리는 어떤 자리였나요? 다시 고르세요.'};
     return {ok:true, msg:'판단했습니다 — <b>최댓값 ÷ 반지름 = √5 = |∇f| 입니다.</b> 조건이 원이면 최댓값은 반지름에 비례하고, 그 자리에서 ∇f = λ∇g 가 성립합니다. 이것이 라그랑주 승수법입니다.'};
   }}""")
 +
 note(272, '내가 훑고 · 내가 바꾸고 · 내가 판단한다',
 """  {t:'기록 — <b>y 먼저</b> · 구간을 바르게 고친 채로 적으세요',
   f:'계산값 = {0} · 참값과의 차 = {1}',
   chk(got, r, mem){
     if(!r) return {ok:false, msg:'아직 화면 값이 없습니다.'};
     const v=noteNum(r[2]), d=noteNum(r[3]);
     if(String(r[1])!=='고침') return {ok:false, msg:'「구간은 그대로 두기」 를 끄고 적으세요 — ②에서 쓸 것입니다.'};
     if(![0,1].every(j=>isFinite(got[j]))) return {ok:false, msg:'두 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-v)>0.003) return {ok:false, msg:'계산값은 '+r[2]+' 입니다.'};
     if(Math.abs(got[1]-d)>0.003) return {ok:false, msg:'참값과의 차는 '+r[3]+' 입니다.'};
     mem.v1=v;
     return {ok:true, msg:'기록했습니다 — 바르게 고치면 '+r[2]+' 입니다. 구간을 그대로 두면 어떻게 될까요?'};
   }}""",
 """  {t:'생각 — <b>「구간은 그대로 두기」</b> 를 켜고 적으세요',
   f:'계산값 = {0} · 참값과의 차 = {1} · ①의 몇 배 = {2}',
   chk(got, r, mem){
     if(mem.v1===undefined) return {ok:false, msg:'① 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const v=noteNum(r[2]), d=noteNum(r[3]);
     if(String(r[1])!=='그대로') return {ok:false, msg:'「구간은 그대로 두기」 를 켜세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-v)>0.003) return {ok:false, msg:'계산값은 '+r[2]+' 입니다.'};
     if(Math.abs(got[1]-d)>0.003) return {ok:false, msg:'참값과의 차는 '+r[3]+' 입니다.'};
     if(Math.abs(got[2]-v/mem.v1)>0.1) return {ok:false, msg:'①의 '+mem.v1+' 로 나누면 얼마인가요?'};
     mem.v2=v; mem.ok2=true;
     return {ok:true, msg:'계산했습니다 — 영역이 삼각형에서 사각형으로 넓어져 '+(v/mem.v1).toFixed(0)+' 배가 되었습니다.'};
   }}""",
 """  {t:'판단 — 두 값을 나란히 두고 고르세요',
   f:'①의 계산값 = {0} · ②의 계산값 = {1} · 구간까지 바르게 고친 값 = {2}',
   opts:['순서를 바꾸면 <b>구간도 함께 바뀐다</b> — 0 ≤ y ≤ x ≤ 1 을 x 부터 적분하면 x 는 y 부터 1 까지이고, 구간을 그대로 두면 영역이 사각형으로 넓어져 다른 값이 된다',
         '순서를 바꾸면 값이 달라지는 것이 당연하다',
         '구간은 그대로 두어도 되고 순서만 맞추면 된다'],
   chk(got, r, mem, pick){
     if(!mem.ok2) return {ok:false, msg:'② 칸을 먼저 통과하세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-mem.v1)>0.003) return {ok:false, msg:'①에 적은 '+mem.v1+' 입니다.'};
     if(Math.abs(got[1]-mem.v2)>0.003) return {ok:false, msg:'②에 적은 '+mem.v2+' 입니다.'};
     if(Math.abs(got[2]-mem.v1)>0.003) return {ok:false, msg:'구간까지 고치면 ①과 같은 값이 됩니다.'};
     if(pick!==0)
       return {ok:false, msg:'순서만 바꿨을 때는 달랐고, 구간까지 고치니 같았습니다. 무엇을 함께 바꿔야 할까요? 다시 고르세요.'};
     return {ok:true, msg:'판단했습니다 — <b>적분 순서를 바꾸면 구간도 함께 바뀝니다.</b> 그림에서 띠 하나가 어디서 어디까지인지 읽어야 구간을 바르게 쓸 수 있고, 그래야 값이 같아집니다.'};
   }}""")
 +
 note(273, '내가 자르고 · 내가 빼먹고 · 내가 판단한다',
 """  {t:'기록 — <b>r 을 곱해</b> 세는 채로 적으세요 (조각 수는 16 이상)',
   f:'조각 수 = {0} · 계산값 = {1} · 참값 = {2}',
   chk(got, r, mem){
     if(!r) return {ok:false, msg:'아직 화면 값이 없습니다.'};
     const N=noteNum(r[1]), v=noteNum(r[3]), t=noteNum(r[4]);
     if(String(r[2])!=='예') return {ok:false, msg:'「r 을 곱하지 않기」 를 끄고 적으세요 — ②에서 켤 것입니다.'};
     if(!(N>=16)) return {ok:false, msg:'조각 수가 '+r[1]+' 입니다 — 16 이상으로 늘리세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-N)>0.5) return {ok:false, msg:'조각 수는 '+r[1]+' 입니다.'};
     if(Math.abs(got[1]-v)>0.01) return {ok:false, msg:'계산값은 '+r[3]+' 입니다.'};
     if(Math.abs(got[2]-t)>0.01) return {ok:false, msg:'참값은 '+r[4]+' 입니다.'};
     mem.v1=v;
     return {ok:true, msg:'기록했습니다 — 참값 πr² 에 딱 맞습니다. 이제 r 을 빼먹어 봅시다.'};
   }}""",
 """  {t:'생각 — <b>「r 을 곱하지 않기」</b> 를 켜고 적으세요',
   f:'계산값 = {0} · 참값 = {1} · 참값의 몇 배 = {2}',
   chk(got, r, mem){
     if(mem.v1===undefined) return {ok:false, msg:'① 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const v=noteNum(r[3]), t=noteNum(r[4]);
     if(String(r[2])!=='아니오') return {ok:false, msg:'「r 을 곱하지 않기」 를 켜세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-v)>0.01) return {ok:false, msg:'계산값은 '+r[3]+' 입니다.'};
     if(Math.abs(got[1]-t)>0.01) return {ok:false, msg:'참값은 '+r[4]+' 입니다.'};
     if(Math.abs(got[2]-v/t)>0.05) return {ok:false, msg:'계산값을 참값 '+r[4]+' 로 나누면 얼마인가요?'};
     mem.v2=v; mem.ok2=true;
     return {ok:true, msg:'계산했습니다 — r 을 빼먹으니 참값의 '+(v/t).toFixed(1)+' 배가 되었습니다.'};
   }}""",
 """  {t:'판단 — 두 계산값의 비를 구해 보고 고르세요',
   f:'①의 계산값 = {0} · ②의 계산값 = {1} · ② ÷ ① = {2}',
   opts:['극좌표에서 넓이 한 칸은 <b>r Δr Δθ</b> 다 — 같은 Δθ 라도 바깥쪽 호가 더 길기 때문이고, r 을 빼먹으면 바깥 조각을 안쪽과 같게 세어 넓이가 2 배로 부푼다',
         'r 은 계산을 편하게 하려고 곱하는 수일 뿐이다',
         '조각을 더 잘게 자르면 r 을 빼먹어도 참값에 가까워진다'],
   chk(got, r, mem, pick){
     if(!mem.ok2) return {ok:false, msg:'② 칸을 먼저 통과하세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-mem.v1)>0.01) return {ok:false, msg:'①에 적은 '+mem.v1+' 입니다.'};
     if(Math.abs(got[1]-mem.v2)>0.01) return {ok:false, msg:'②에 적은 '+mem.v2+' 입니다.'};
     if(Math.abs(got[2]-mem.v2/mem.v1)>0.05) return {ok:false, msg:'②를 ①로 나누세요.'};
     if(pick!==0)
       return {ok:false, msg:'조각을 아무리 잘게 잘라도 r 을 빼먹으면 늘 2 배였습니다. 왜 그럴까요? 다시 고르세요.'};
     return {ok:true, msg:'판단했습니다 — <b>r 이 바로 야코비안입니다.</b> 좌표를 바꾸면 한 칸의 넓이가 달라지므로, 그 늘어난 비율을 곱해 주어야 넓이가 맞습니다.'};
   }}""")
 +
 note(274, '내가 거스르고 · 내가 돌고 · 내가 판단한다',
 """  {t:'기록 — <b>출발 각도 0° · 절반(50%)</b> 만 걸은 자리에서 적으세요',
   f:'출발각 = {0} ° · 진행률 = {1} % · 값 = {2}',
   chk(got, r, mem){
     if(!r) return {ok:false, msg:'아직 화면 값이 없습니다.'};
     const a=noteNum(r[0]), p=noteNum(r[1]), v=noteNum(r[3]);
     if(String(r[2])!=='내적') return {ok:false, msg:'「크기의 곱으로 세기」 를 끄고 적으세요 — ②에서 쓸 것입니다.'};
     if(!(v<-0.05)) return {ok:false, msg:'값이 '+r[3]+' 입니다 — 출발 각도를 0° 로 두고 절반쯤 걸어 음수를 만드세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-a)>2) return {ok:false, msg:'출발각은 '+r[0]+' 입니다.'};
     if(Math.abs(got[1]-p)>2) return {ok:false, msg:'진행률은 '+r[1]+' 입니다.'};
     if(Math.abs(got[2]-v)>0.02) return {ok:false, msg:'값은 '+r[3]+' 입니다.'};
     mem.v1=v;
     return {ok:true, msg:'기록했습니다 — 바람을 거슬렀으니 값이 음수입니다. 한 바퀴를 마저 돌아 봅시다.'};
   }}""",
 """  {t:'생각 — <b>100% 까지</b> 걸어 한 바퀴를 채우고 적으세요',
   f:'진행률 = {0} % · 값 = {1} · ①보다 얼마나 늘었나 = {2}',
   chk(got, r, mem){
     if(mem.v1===undefined) return {ok:false, msg:'① 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const p=noteNum(r[1]), v=noteNum(r[3]);
     if(String(r[2])!=='내적') return {ok:false, msg:'「크기의 곱으로 세기」 를 끄고 적으세요.'};
     if(!(p>=99)) return {ok:false, msg:'진행률이 '+r[1]+' 입니다 — 100% 까지 걸으세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-p)>2) return {ok:false, msg:'진행률은 '+r[1]+' 입니다.'};
     if(Math.abs(got[1]-v)>0.02) return {ok:false, msg:'값은 '+r[3]+' 입니다.'};
     if(Math.abs(got[2]-(v-mem.v1))>0.03) return {ok:false, msg:'①의 '+mem.v1+' 을 빼면 얼마인가요?'};
     mem.v2=v; mem.ok2=true;
     return {ok:true, msg:'계산했습니다 — 거스른 만큼과 등진 만큼이 상쇄되고 '+r[3]+' 이 남았습니다.'};
   }}""",
 """  {t:'판단 — 타원의 넓이로 견주어 보고 고르세요',
   f:'①의 값 = {0} · ②의 값 = {1} · 0.4 × (π × 1.6 × 1.2) = {2}',
   opts:['힘과 걸음의 <b>방향이 함께 세어지는 것</b>이 선적분이다 — 거스르면 음수, 등지면 양수이고, 한 바퀴를 돌면 상쇄되고 남는 값이 0.4 × 넓이와 같다',
         '한 바퀴를 돌면 제자리로 왔으니 값은 언제나 0 이다',
         '거리와 힘의 크기를 곱해 세어도 같은 값이 나온다'],
   chk(got, r, mem, pick){
     if(!mem.ok2) return {ok:false, msg:'② 칸을 먼저 통과하세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-mem.v1)>0.02) return {ok:false, msg:'①에 적은 '+mem.v1+' 입니다.'};
     if(Math.abs(got[1]-mem.v2)>0.02) return {ok:false, msg:'②에 적은 '+mem.v2+' 입니다.'};
     if(Math.abs(got[2]-0.4*Math.PI*1.6*1.2)>0.03) return {ok:false, msg:'π × 1.6 × 1.2 를 구한 뒤 0.4 를 곱하세요.'};
     if(pick!==0)
       return {ok:false, msg:'한 바퀴를 돌았는데 값이 0 이 아니라 '+mem.v2+' 였습니다. 무엇이 남은 것일까요? 다시 고르세요.'};
     return {ok:true, msg:'판단했습니다 — <b>한 바퀴에 남는 값은 회전의 총량입니다.</b> 그것이 0.4 × (안쪽 넓이) 와 같다는 것이 그린 정리이고, 다음 시간에 둘레만 돌아 넓이를 재게 됩니다.'};
   }}""")
 +
 note(275, '내가 휘고 · 내가 되돌리고 · 내가 판단한다',
 """  {t:'기록 — <b>k 를 0.5 이상</b> 으로 키우고 두 길의 값을 적으세요',
   f:'k = {0} · 곧은 길 = {1} · 돌아가는 길 = {2}',
   chk(got, r, mem){
     if(!r) return {ok:false, msg:'아직 화면 값이 없습니다.'};
     const k=noteNum(r[0]), s=noteNum(r[2]), c=noteNum(r[3]), g=noteNum(r[4]);
     if(!(Math.abs(k)>=0.5)) return {ok:false, msg:'k 가 '+r[0]+' 입니다 — 0.5 이상으로 키우세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-k)>0.05) return {ok:false, msg:'k 는 '+r[0]+' 입니다.'};
     if(Math.abs(got[1]-s)>0.02) return {ok:false, msg:'곧은 길의 값은 '+r[2]+' 입니다.'};
     if(Math.abs(got[2]-c)>0.02) return {ok:false, msg:'돌아가는 길의 값은 '+r[3]+' 입니다.'};
     mem.g1=g;
     return {ok:true, msg:'기록했습니다 — 두 길의 값이 다릅니다(차이 '+r[4]+'). k 를 0 으로 되돌려 봅시다.'};
   }}""",
 """  {t:'생각 — <b>k 를 0</b> 으로 되돌리고 아래 길을 크게 휘어 적으세요',
   f:'곧은 길 = {0} · 돌아가는 길 = {1} · 두 값의 차이 = {2}',
   chk(got, r, mem){
     if(mem.g1===undefined) return {ok:false, msg:'① 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const k=noteNum(r[0]), s=noteNum(r[2]), c=noteNum(r[3]), g=noteNum(r[4]);
     if(!(Math.abs(k)<1e-9)) return {ok:false, msg:'k 가 '+r[0]+' 입니다 — 0 으로 되돌리세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-s)>0.02) return {ok:false, msg:'곧은 길의 값은 '+r[2]+' 입니다.'};
     if(Math.abs(got[1]-c)>0.02) return {ok:false, msg:'돌아가는 길의 값은 '+r[3]+' 입니다.'};
     if(Math.abs(got[2]-g)>0.02) return {ok:false, msg:'두 값의 차이는 '+r[4]+' 입니다.'};
     mem.g2=g; mem.ok2=true;
     return {ok:true, msg:'계산했습니다 — 길을 아무리 휘어도 값이 같습니다. 차이가 '+r[4]+' 입니다.'};
   }}""",
 """  {t:'판단 — 두 차이를 나란히 두고 고르세요',
   f:'①의 차이 = {0} · ②의 차이 = {1} · 보존장이 되는 k = {2}',
   opts:['<b>회전(∂Q/∂x − ∂P/∂y)이 0</b> 일 때만 길에 상관없이 같은 값이 된다 — 그때 퍼텐셜 φ 가 있어 한 일이 φ(B) − φ(A) 로 끝나고, 길의 길이는 아무 상관이 없다',
         '길이 짧을수록 한 일이 적으므로 곧은 길이 언제나 작다',
         '회전이 있어도 출발점과 도착점이 같으면 값은 같다'],
   chk(got, r, mem, pick){
     if(!mem.ok2) return {ok:false, msg:'② 칸을 먼저 통과하세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-mem.g1)>0.02) return {ok:false, msg:'①에 적은 '+mem.g1+' 입니다.'};
     if(Math.abs(got[1]-mem.g2)>0.02) return {ok:false, msg:'②에 적은 '+mem.g2+' 입니다.'};
     if(Math.abs(got[2])>0.05) return {ok:false, msg:'두 길의 값이 같아지던 k 를 적으세요.'};
     if(pick!==0)
       return {ok:false, msg:'k 가 0 일 때는 길을 아무리 휘어도 같았고, k 가 0 이 아닐 때는 달라졌습니다. 무엇이 갈랐을까요? 다시 고르세요.'};
     return {ok:true, msg:'판단했습니다 — <b>회전이 0 인 장이 보존장입니다.</b> 중력처럼 퍼텐셜이 있는 힘은 어느 길로 가든 한 일이 같고, 소용돌이가 있으면 길마다 달라집니다.'};
   }}""")
 +
 note(276, '내가 돌고 · 내가 되돌고 · 내가 판단한다',
 """  {t:'기록 — <b>반시계로 한 바퀴(100%)</b> 를 돌고 적으세요',
   f:'꼭짓점 수 = {0} · 둘레 적분 = {1} · 실제 넓이 = {2}',
   chk(got, r, mem){
     if(!r) return {ok:false, msg:'아직 화면 값이 없습니다.'};
     const N=noteNum(r[0]), v=noteNum(r[3]), a=noteNum(r[4]);
     if(String(r[2])!=='반시계') return {ok:false, msg:'「반대로 돌기」 를 끄고 적으세요 — ②에서 켤 것입니다.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-N)>0.5) return {ok:false, msg:'꼭짓점 수는 '+r[0]+' 입니다.'};
     if(Math.abs(got[1]-v)>0.02) return {ok:false, msg:'둘레 적분은 '+r[3]+' 입니다.'};
     if(Math.abs(got[2]-a)>0.02) return {ok:false, msg:'실제 넓이는 '+r[4]+' 입니다.'};
     mem.v1=v;
     return {ok:true, msg:'기록했습니다 — 둘레만 돌았는데 안쪽 넓이가 그대로 나왔습니다. 반대로 돌아 봅시다.'};
   }}""",
 """  {t:'생각 — <b>「반대로 돌기」</b> 를 켜고 다시 적으세요',
   f:'둘레 적분 = {0} · 실제 넓이 = {1} · ①과 부호가 반대이면 1, 같으면 0 → {2}',
   chk(got, r, mem){
     if(mem.v1===undefined) return {ok:false, msg:'① 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const v=noteNum(r[3]), a=noteNum(r[4]);
     if(String(r[2])!=='시계') return {ok:false, msg:'「반대로 돌기」 를 켜세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-v)>0.02) return {ok:false, msg:'둘레 적분은 '+r[3]+' 입니다.'};
     if(Math.abs(got[1]-a)>0.02) return {ok:false, msg:'실제 넓이는 '+r[4]+' 입니다.'};
     if(Math.abs(got[2]-1)>0.01) return {ok:false, msg:'①의 '+mem.v1+' 과 지금 값의 부호를 견주세요.'};
     mem.v2=v; mem.ok2=true;
     return {ok:true, msg:'계산했습니다 — 크기는 그대로인데 부호만 바뀌었습니다.'};
   }}""",
 """  {t:'판단 — 두 값을 더해 보고 고르세요',
   f:'①의 둘레 적분 = {0} · ②의 둘레 적분 = {1} · 두 값을 더하면 = {2}',
   opts:['둘레를 한 바퀴 도는 것만으로 <b>안쪽 넓이</b>가 나온다 — 원점과 변이 만드는 삼각형들이 쌓이기 때문이고, 반대로 돌면 같은 크기에 부호만 바뀐다',
         '둘레의 길이가 곧 넓이이다',
         '방향을 바꾸면 넓이도 달라진다'],
   chk(got, r, mem, pick){
     if(!mem.ok2) return {ok:false, msg:'② 칸을 먼저 통과하세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-mem.v1)>0.02) return {ok:false, msg:'①에 적은 '+mem.v1+' 입니다.'};
     if(Math.abs(got[1]-mem.v2)>0.02) return {ok:false, msg:'②에 적은 '+mem.v2+' 입니다.'};
     if(Math.abs(got[2])>0.03) return {ok:false, msg:'두 값을 더하면 얼마인가요?'};
     if(pick!==0)
       return {ok:false, msg:'반시계로 돌면 넓이, 시계로 돌면 그 음수였습니다. 둘레가 무엇을 알려 준 것일까요? 다시 고르세요.'};
     return {ok:true, msg:'판단했습니다 — <b>그린 정리입니다.</b> 안쪽을 훑지 않고 둘레만 돌아도 넓이가 나오고, 도는 방향이 부호를 기억합니다. 측량기(플래니미터)가 바로 이 원리로 넓이를 잽니다.'};
   }}""")
 +
 note(277, '내가 나누고 · 내가 맞추고 · 내가 판단한다',
 """  {t:'기록 — 세 비의 <b>곱이 1 이 아닌</b> 자리에서 적으세요',
   f:'세 비의 곱 = {0} · 교점이 벌어진 정도 = {1}',
   chk(got, r, mem){
     if(!r) return {ok:false, msg:'아직 화면 값이 없습니다.'};
     const p=noteNum(r[3]), sp=noteNum(r[4]);
     if(!(Math.abs(p-1)>=0.02)) return {ok:false, msg:'지금 곱이 '+r[3]+' 입니다 — ②에서 볼 테니 비를 바꿔 두세요.'};
     if(![0,1].every(j=>isFinite(got[j]))) return {ok:false, msg:'두 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-p)>0.02) return {ok:false, msg:'세 비의 곱은 '+r[3]+' 입니다.'};
     if(Math.abs(got[1]-sp)>0.02) return {ok:false, msg:'벌어진 정도는 '+r[4]+' 입니다.'};
     mem.p1=p; mem.s1=sp;
     return {ok:true, msg:'기록했습니다 — 곱이 '+r[3]+' 이고 교점 셋이 '+r[4]+' 만큼 벌어져 있습니다.'};
   }}""",
 """  {t:'생각 — 세 비의 <b>곱을 1</b> 로 맞추고 다시 적으세요',
   f:'세 비의 곱 = {0} · 벌어진 정도 = {1} · ①보다 얼마나 줄었나 = {2}',
   chk(got, r, mem){
     if(mem.p1===undefined) return {ok:false, msg:'① 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const p=noteNum(r[3]), sp=noteNum(r[4]);
     if(!(Math.abs(p-1)<0.02)) return {ok:false, msg:'곱이 '+r[3]+' 입니다 — 1 에 맞추세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-p)>0.02) return {ok:false, msg:'세 비의 곱은 '+r[3]+' 입니다.'};
     if(Math.abs(got[1]-sp)>0.02) return {ok:false, msg:'벌어진 정도는 '+r[4]+' 입니다.'};
     if(Math.abs(got[2]-(mem.s1-sp))>0.03) return {ok:false, msg:'①의 '+mem.s1+' 에서 지금 값을 빼세요.'};
     mem.ok2=true;
     return {ok:true, msg:'계산했습니다 — 벌어짐이 거의 0 입니다. 세 선분이 한 점에서 만났습니다.'};
   }}""",
 """  {t:'판단 — 두 곱을 나란히 두고 고르세요',
   f:'①의 곱 = {0} · ②의 곱 = {1} · 한 점에서 만날 때의 곱 = {2}',
   opts:['세 비의 곱이 <b>꼭 1 일 때만</b> 한 점에서 만난다 — 세 중선은 1 × 1 × 1 = 1 이라 언제나 한 점에서 만나고, 곱이 1 에서 벗어나면 교점이 셋으로 갈라진다',
         '비를 모두 같게 하면 언제나 한 점에서 만난다',
         '곱이 클수록 교점이 가운데로 모인다'],
   chk(got, r, mem, pick){
     if(!mem.ok2) return {ok:false, msg:'② 칸을 먼저 통과하세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-mem.p1)>0.02) return {ok:false, msg:'①에 적은 '+mem.p1+' 입니다.'};
     if(Math.abs(got[1]-1)>0.02) return {ok:false, msg:'②에서는 곱이 1 이었습니다.'};
     if(Math.abs(got[2]-1)>0.02) return {ok:false, msg:'벌어짐이 0 이 되던 곱의 값을 적으세요.'};
     if(pick!==0)
       return {ok:false, msg:'곱이 '+mem.p1+' 일 때는 벌어졌고 1 일 때는 한 점이었습니다. 조건은 무엇일까요? 다시 고르세요.'};
     return {ok:true, msg:'판단했습니다 — <b>체바 정리입니다.</b> 세 비의 곱이 1 이면 세 선분이 한 점에서 만나고, 세 중선·세 각의 이등분선이 한 점에서 만나는 것도 모두 이 식으로 설명됩니다.'};
   }}""")
 +
 note(278, '내가 자르고 · 내가 부호를 붙이고 · 내가 판단한다',
 """  {t:'기록 — 세 비의 <b>곱이 −1 이 아닌</b> 자리에서 적으세요',
   f:'세 비의 곱 = {0} · 세 점이 벗어난 정도 = {1}',
   chk(got, r, mem){
     if(!r) return {ok:false, msg:'아직 화면 값이 없습니다.'};
     const p=noteNum(r[3]), d=noteNum(r[4]);
     if(!(Math.abs(p+1)>=0.03)) return {ok:false, msg:'지금 곱이 '+r[3]+' 입니다 — ②에서 볼 테니 비를 바꿔 두세요.'};
     if(![0,1].every(j=>isFinite(got[j]))) return {ok:false, msg:'두 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-p)>0.05) return {ok:false, msg:'세 비의 곱은 '+r[3]+' 입니다.'};
     if(Math.abs(got[1]-d)>0.05) return {ok:false, msg:'벗어난 정도는 '+r[4]+' 입니다.'};
     mem.p1=p; mem.d1=d;
     return {ok:true, msg:'기록했습니다 — 곱이 '+r[3]+' 이고 세 점이 '+r[4]+' 만큼 어긋나 있습니다.'};
   }}""",
 """  {t:'생각 — 세 비의 <b>곱을 −1</b> 로 맞추고 다시 적으세요',
   f:'세 비의 곱 = {0} · 벗어난 정도 = {1} · 음수인 비는 몇 개 = {2}',
   chk(got, r, mem){
     if(mem.p1===undefined) return {ok:false, msg:'① 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const p=noteNum(r[3]), d=noteNum(r[4]);
     const neg=[0,1,2].filter(j=>noteNum(r[j])<0).length;
     if(!(Math.abs(p+1)<0.03)) return {ok:false, msg:'곱이 '+r[3]+' 입니다 — −1 에 맞추세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-p)>0.05) return {ok:false, msg:'세 비의 곱은 '+r[3]+' 입니다.'};
     if(Math.abs(got[1]-d)>0.05) return {ok:false, msg:'벗어난 정도는 '+r[4]+' 입니다.'};
     if(Math.abs(got[2]-neg)>0.5) return {ok:false, msg:'세 비 가운데 음수인 것을 세어 보세요.'};
     mem.ok2=true;
     return {ok:true, msg:'계산했습니다 — 벗어남이 거의 0 이고, 음수인 비가 '+neg+' 개입니다.'};
   }}""",
 """  {t:'판단 — 체바의 1 과 견주어 보고 고르세요',
   f:'①의 곱 = {0} · ②의 곱 = {1} · 한 점에서 만날 때의 곱(체바) = {2}',
   opts:['직선은 삼각형의 세 변을 <b>모두 안쪽에서 자를 수 없다</b> — 반드시 한 변의 연장을 지나므로 음수가 홀수 개 생기고, 그래서 한 직선 조건은 −1, 한 점 조건은 +1 이 된다',
         '부호는 적는 방식일 뿐이어서 절댓값만 보면 된다',
         '한 직선 조건과 한 점 조건은 완전히 같은 식이다'],
   chk(got, r, mem, pick){
     if(!mem.ok2) return {ok:false, msg:'② 칸을 먼저 통과하세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-mem.p1)>0.05) return {ok:false, msg:'①에 적은 '+mem.p1+' 입니다.'};
     if(Math.abs(got[1]+1)>0.05) return {ok:false, msg:'②에서는 곱이 −1 이었습니다.'};
     if(Math.abs(got[2]-1)>0.05) return {ok:false, msg:'지난 시간 체바 정리의 곱은 얼마였나요?'};
     if(pick!==0)
       return {ok:false, msg:'곱이 −1 일 때 세 점이 한 직선 위에 있었습니다. 음수는 어디서 왔을까요? 다시 고르세요.'};
     return {ok:true, msg:'판단했습니다 — <b>부호가 있어야 두 정리가 갈립니다.</b> 한 점에서 만나면 +1, 한 직선 위에 있으면 −1 — 절댓값만 보면 이 둘을 구별할 수 없습니다.'};
   }}""")
 +
 note(279, '내가 옮기고 · 내가 모으고 · 내가 판단한다',
 """  {t:'기록 — 네 중심이 <b>벌어져 있는</b> 자리에서 적으세요',
   f:'가장 큰 각 = {0} ° · 네 중심이 벌어진 정도 = {1}',
   chk(got, r, mem){
     if(!r) return {ok:false, msg:'아직 화면 값이 없습니다.'};
     const ang=noteNum(r[1]), sp=noteNum(r[2]);
     if(!(sp>=0.08)) return {ok:false, msg:'지금은 네 중심이 거의 모여 있습니다 — ②에서 볼 테니 C 를 옮겨 두세요.'};
     if(![0,1].every(j=>isFinite(got[j]))) return {ok:false, msg:'두 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-ang)>0.5) return {ok:false, msg:'가장 큰 각은 '+r[1]+' 입니다.'};
     if(Math.abs(got[1]-sp)>0.02) return {ok:false, msg:'벌어진 정도는 '+r[2]+' 입니다.'};
     mem.s1=sp;
     return {ok:true, msg:'기록했습니다 — 네 중심이 '+r[2]+' 만큼 떨어져 있습니다. 정삼각형으로 가 봅시다.'};
   }}""",
 """  {t:'생각 — C 를 옮겨 <b>정삼각형</b> 에 가깝게 하고 적으세요',
   f:'가장 큰 각 = {0} ° · 벌어진 정도 = {1} · ①보다 얼마나 줄었나 = {2}',
   chk(got, r, mem){
     if(mem.s1===undefined) return {ok:false, msg:'① 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const ang=noteNum(r[1]), sp=noteNum(r[2]);
     if(!(sp<0.08)) return {ok:false, msg:'벌어진 정도가 '+r[2]+' 입니다 — C 를 (1.9, −1.3) 가까이로 옮기세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-ang)>0.5) return {ok:false, msg:'가장 큰 각은 '+r[1]+' 입니다.'};
     if(Math.abs(got[1]-sp)>0.02) return {ok:false, msg:'벌어진 정도는 '+r[2]+' 입니다.'};
     if(Math.abs(got[2]-(mem.s1-sp))>0.03) return {ok:false, msg:'①의 '+mem.s1+' 에서 지금 값을 빼세요.'};
     mem.ok2=true;
     return {ok:true, msg:'계산했습니다 — 가장 큰 각이 '+r[1]+' 이고 네 중심이 한 점으로 모였습니다.'};
   }}""",
 """  {t:'판단 — 둔각일 때를 떠올리며 고르세요',
   f:'①의 벌어짐 = {0} · ②의 벌어짐 = {1} · 둔각일 때 삼각형 밖으로 나가는 중심의 수 = {2}',
   opts:['네 중심은 <b>각각 다른 것의 교점</b> 이라 따로 있다 — 정삼각형에서만 대칭 때문에 한 점이 되고, 둔각이 되면 외심과 수심 둘이 삼각형 밖으로 나간다',
         '네 중심은 언제나 삼각형 안에 있다',
         '삼각형이 커지면 네 중심이 한 점으로 모인다'],
   chk(got, r, mem, pick){
     if(!mem.ok2) return {ok:false, msg:'② 칸을 먼저 통과하세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-mem.s1)>0.02) return {ok:false, msg:'①에 적은 '+mem.s1+' 입니다.'};
     if(Math.abs(got[1])>0.08) return {ok:false, msg:'②에서는 벌어짐이 거의 0 이었습니다.'};
     if(Math.abs(got[2]-2)>0.2) return {ok:false, msg:'둔각으로 만들어 보세요 — 밖으로 나가는 중심이 몇 개인가요?'};
     if(pick!==0)
       return {ok:false, msg:'정삼각형에서만 한 점이 되었고, 둔각에서는 둘이 밖으로 나갔습니다. 중심이 넷인 까닭은 무엇일까요? 다시 고르세요.'};
     return {ok:true, msg:'판단했습니다 — <b>무게중심과 내심은 언제나 안에 있고, 외심과 수심은 둔각이면 밖으로 나갑니다.</b> 중심이 넷인 것은 각각 다른 선들의 교점이기 때문이고, 정삼각형에서만 넷이 하나가 됩니다.'};
   }}""")
 +
 note(280, '내가 옮기고 · 내가 재고 · 내가 판단한다',
 """  {t:'기록 — 내심이 <b>직선에서 벗어난</b> 자리에서 적으세요 (C ≒ (2.0, 1.8))',
   f:'OG = {0} · GH = {1} · 내심이 벗어난 정도 = {2}',
   chk(got, r, mem){
     if(!r) return {ok:false, msg:'아직 화면 값이 없습니다.'};
     const og=noteNum(r[1]), gh=noteNum(r[2]), dv=noteNum(r[4]);
     if(!(dv>=0.1)) return {ok:false, msg:'내심이 '+r[4]+' 만큼만 벗어나 있습니다 — C 를 (2.0, 1.8) 가까이로 옮기세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-og)>0.02) return {ok:false, msg:'OG 는 '+r[1]+' 입니다.'};
     if(Math.abs(got[1]-gh)>0.02) return {ok:false, msg:'GH 는 '+r[2]+' 입니다.'};
     if(Math.abs(got[2]-dv)>0.02) return {ok:false, msg:'내심이 벗어난 정도는 '+r[4]+' 입니다.'};
     mem.og=og; mem.gh=gh;
     return {ok:true, msg:'기록했습니다 — 세 중심은 한 줄인데 내심만 '+r[4]+' 만큼 벗어나 있습니다.'};
   }}""",
 """  {t:'생각 — C 를 옮겨 <b>두 변의 길이가 같게</b> 하고 적으세요',
   f:'OG = {0} · GH = {1} · 내심이 벗어난 정도 = {2}',
   chk(got, r, mem){
     if(mem.og===undefined) return {ok:false, msg:'① 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const og=noteNum(r[1]), gh=noteNum(r[2]), dv=noteNum(r[4]);
     if(!(og>0.05)) return {ok:false, msg:'네 점이 거의 겹쳐 직선이 사라졌습니다 — C 를 (0.4, −0.4) 가까이로 옮기세요.'};
     if(!(dv<0.05)) return {ok:false, msg:'내심이 '+r[4]+' 만큼 벗어나 있습니다 — 두 변의 길이가 같아지도록 옮기세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-og)>0.02) return {ok:false, msg:'OG 는 '+r[1]+' 입니다.'};
     if(Math.abs(got[1]-gh)>0.02) return {ok:false, msg:'GH 는 '+r[2]+' 입니다.'};
     if(Math.abs(got[2]-dv)>0.02) return {ok:false, msg:'내심이 벗어난 정도는 '+r[4]+' 입니다.'};
     mem.og2=og; mem.gh2=gh; mem.ok2=true;
     return {ok:true, msg:'계산했습니다 — 이등변이 되자 내심까지 같은 직선 위에 올라왔습니다. 비는 그대로입니다.'};
   }}""",
 """  {t:'판단 — 두 번의 비를 견주어 보고 고르세요',
   f:'①의 GH ÷ OG = {0} · ②의 GH ÷ OG = {1} · OG = 1.2 라면 OH = {2}',
   opts:['무게중심은 외심과 수심을 <b>언제나 1 : 2 로 나눈다</b> — H = 3G − 2O 이기 때문이고, 그래서 OH = 3 × OG 이며 삼각형을 아무리 바꿔도 이 비는 변하지 않는다',
         '삼각형의 모양에 따라 비가 달라진다',
         '내심도 언제나 그 직선 위에 있다'],
   chk(got, r, mem, pick){
     if(!mem.ok2) return {ok:false, msg:'② 칸을 먼저 통과하세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-mem.gh/mem.og)>0.05) return {ok:false, msg:'①의 GH '+mem.gh+' 를 OG '+mem.og+' 로 나누세요.'};
     if(Math.abs(got[1]-mem.gh2/mem.og2)>0.05) return {ok:false, msg:'②의 GH '+mem.gh2+' 를 OG '+mem.og2+' 로 나누세요.'};
     if(Math.abs(got[2]-3.6)>0.05) return {ok:false, msg:'OH = OG + GH 이고 GH 는 OG 의 2 배입니다.'};
     if(pick!==0)
       return {ok:false, msg:'삼각형을 바꿔도 비가 2 로 같았습니다. 무엇이 이 비를 정할까요? 다시 고르세요.'};
     return {ok:true, msg:'판단했습니다 — <b>오일러 직선입니다.</b> 외심 · 무게중심 · 수심은 언제나 한 직선 위에 있고 1 : 2 로 나뉩니다. 내심은 이등변일 때만 그 위에 올라오고, 정삼각형에서는 넷이 아예 한 점이 됩니다.'};
   }}""")
)
