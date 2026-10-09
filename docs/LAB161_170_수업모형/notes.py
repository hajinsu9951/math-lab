# -*- coding: utf-8 -*-
"""LAB 161~170 탐구 노트 — 기록 → 생각 → 판단. 판정은 화면의 read() 값으로만 한다."""


def note(no, head, c1, c2, c3):
    return "\n %d:{ h:'%s',\n  c:[\n%s,\n%s,\n%s\n ]},\n" % (no, head, c1, c2, c3)


NOTES = (
 note(161, '내가 밀고 · 내가 스치고 · 내가 판단한다',
 """  {t:'기록 — 직선이 <b>두 점에서 만나는</b> 자리에 두고 적으세요',
   f:'k = {0} · 판별식 D = {1} · 중심까지 거리 = {2}',
   chk(got, r, mem){
     if(!r) return {ok:false, msg:'아직 화면 값이 없습니다.'};
     const k=noteNum(r[1]), D=noteNum(r[2]), n=noteNum(r[3]), d=noteNum(r[4]);
     if(n!==2) return {ok:false, msg:'지금 교점이 '+r[3]+'개입니다. k 를 줄여 두 점에서 만나게 하세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-k)>0.06) return {ok:false, msg:'k 는 '+r[1]+' 입니다.'};
     if(Math.abs(got[1]-D)>0.0006||Math.abs(got[2]-d)>0.0006)
       return {ok:false, msg:'화면은 D = '+r[2]+' · 거리 '+r[4]+' 입니다.'};
     mem.D=D; mem.d=d; mem.m=noteNum(r[0]);
     return {ok:true, msg:'기록했습니다 — D 가 양수이고 거리가 반지름보다 작습니다. 이제 스치는 자리를 찾아봅시다.'};
   }}""",
 """  {t:'생각 — <b>딱 한 점에서 스치도록</b> 맞추고 적으세요',
   f:'k = {0} · 판별식 D = {1} · 중심까지 거리 = {2}',
   chk(got, r, mem){
     if(mem.D===undefined) return {ok:false, msg:'① 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const k=noteNum(r[1]), D=noteNum(r[2]), n=noteNum(r[3]), d=noteNum(r[4]);
     if(n!==1) return {ok:false, msg:'지금 교점이 '+r[3]+'개입니다. 「접하도록 k 맞추기」를 누르거나 직접 맞추세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-k)>0.06) return {ok:false, msg:'k 는 '+r[1]+' 입니다.'};
     if(Math.abs(got[1]-D)>0.02) return {ok:false, msg:'D 는 '+r[2]+' 입니다 — 거의 0 이지요.'};
     if(Math.abs(got[2]-d)>0.006) return {ok:false, msg:'거리는 '+r[4]+' 입니다.'};
     mem.dt=d; mem.ok2=true;
     return {ok:true, msg:'계산했습니다 — D 가 0 이고, 중심까지의 거리가 반지름 '+d.toFixed(2)+' 과 같아졌습니다.'};
   }}""",
 """  {t:'판단 — k 를 더 밀어 <b>만나지 않게</b> 한 뒤 고르세요',
   f:'k = {0} · 판별식 D = {1} · 중심까지 거리 = {2}',
   opts:['「D = 0」 과 「중심까지의 거리 = 반지름」 은 <b>같은 조건</b> 이다 — 대수로 풀든 기하로 풀든 같은 순간을 가리킨다',
         '접선은 원을 한 번 스치기만 하면 되므로 조건이 따로 없다',
         'D 가 음수일 때 접선이 된다'],
   chk(got, r, mem, pick){
     if(!mem.ok2) return {ok:false, msg:'② 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const k=noteNum(r[1]), D=noteNum(r[2]), n=noteNum(r[3]), d=noteNum(r[4]);
     if(n!==0) return {ok:false, msg:'지금 교점이 '+r[3]+'개입니다. k 를 더 밀어 아예 만나지 않게 하세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-k)>0.06) return {ok:false, msg:'k 는 '+r[1]+' 입니다.'};
     if(Math.abs(got[1]-D)>0.0006||Math.abs(got[2]-d)>0.0006)
       return {ok:false, msg:'지금은 D = '+r[2]+' · 거리 '+r[4]+' 입니다.'};
     if(pick!==0)
       return {ok:false, msg:'D 가 '+mem.D+' → 0 → '+r[2]+' 로, 거리가 '+mem.d+' → '+mem.dt.toFixed(2)+' → '+r[4]+' 로 함께 움직였습니다. 다시 고르세요.'};
     return {ok:true, msg:'판단했습니다 — <b>접한다 = 교점이 하나 = D = 0 = 거리가 반지름과 같다.</b> 같은 사실을 대수와 기하가 각각의 말로 한 것뿐입니다 — 문제에서 더 쉬운 쪽을 고르면 됩니다.'};
   }}""")
 +
 note(162, '내가 젓고 · 내가 돌리고 · 내가 판단한다',
 """  {t:'기록 — 뱃머리를 <b>건너편으로 똑바로(90°)</b> 두고 적으세요',
   f:'합의 크기 = {0} · 떠내려감 = {1}',
   chk(got, r, mem){
     if(!r) return {ok:false, msg:'아직 화면 값이 없습니다.'};
     const a=noteNum(r[0]), v=noteNum(r[1]), c=noteNum(r[2]), s=noteNum(r[3]), dr=noteNum(r[4]);
     if(a!==90) return {ok:false, msg:'뱃머리를 90° 로 맞추세요 (지금 '+r[0]+').'};
     if(!(c>0.2)) return {ok:false, msg:'물살을 0 보다 크게 하세요 — 물살이 없으면 떠내려가지 않습니다.'};
     if(![0,1].every(j=>isFinite(got[j]))) return {ok:false, msg:'두 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-s)>0.02||Math.abs(got[1]-dr)>0.02)
       return {ok:false, msg:'화면은 합의 크기 '+r[3]+' · 떠내려감 '+r[4]+' 입니다.'};
     mem.v=v; mem.c=c; mem.s=s; mem.dr=dr;
     return {ok:true, msg:'기록했습니다 — 뱃머리는 정면인데 '+r[4]+' m 떠내려갑니다. 어디를 향해야 할까요?'};
   }}""",
 """  {t:'생각 — 뱃머리를 <b>상류 쪽으로</b> 돌려 정면에 닿게 하세요',
   f:'그때 뱃머리 각 = {0} · 떠내려감 = {1} · 가로 성분의 합 = {2}',
   chk(got, r, mem){
     if(mem.v===undefined) return {ok:false, msg:'① 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const a=noteNum(r[0]), v=noteNum(r[1]), c=noteNum(r[2]), dr=noteNum(r[4]);
     if(!(a>90)) return {ok:false, msg:'뱃머리를 90° 보다 크게(상류 쪽으로) 돌리세요 — 지금 '+r[0]+'.'};
     if(!(Math.abs(dr)<0.15)) return {ok:false, msg:'아직 '+r[4]+' m 떠내려갑니다. 각을 더 맞춰 0 에 가깝게 하세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-a)>2.5) return {ok:false, msg:'뱃머리 각은 '+r[0]+' 입니다.'};
     if(Math.abs(got[1]-dr)>0.02) return {ok:false, msg:'떠내려감은 '+r[4]+' 입니다.'};
     if(Math.abs(got[2])>0.2) return {ok:false, msg:'배의 가로 성분 v·cos(각) 과 물살 '+r[2]+' 를 더해 보세요.'};
     mem.a2=a; mem.ok2=true;
     return {ok:true, msg:'계산했습니다 — 가로 성분이 서로 지워져 정면에 닿습니다.'};
   }}""",
 """  {t:'판단 — 뱃머리를 <b>물살과 나란하게(0° 또는 180°)</b> 돌린 뒤 고르세요',
   f:'뱃머리 각 = {0} · 세로 성분 = {1}',
   opts:['속도는 <b>가로·세로 성분으로 나누어</b> 따로 더한다 — 가로 합이 0 이면 정면, 세로 합이 0 이면 아예 못 건넌다',
         '물살이 빠르면 배가 더 빨리 건넌다',
         '뱃머리를 어디로 두든 건너는 시간은 같다'],
   chk(got, r, mem, pick){
     if(!mem.ok2) return {ok:false, msg:'② 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const a=noteNum(r[0]);
     if(!(a===0||a===180)) return {ok:false, msg:'뱃머리를 0° 나 180° 로 맞추세요 (지금 '+r[0]+').'};
     if(String(r[4]).indexOf('못 건넘')<0)
       return {ok:false, msg:'아직 건너고 있습니다 — 화면의 「떠내려감」이 «못 건넘» 이 되어야 합니다.'};
     if(![0,1].every(j=>isFinite(got[j]))) return {ok:false, msg:'두 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-a)>2.5) return {ok:false, msg:'뱃머리 각은 '+r[0]+' 입니다.'};
     if(Math.abs(got[1])>0.1) return {ok:false, msg:'v·sin(각) 을 구해 보세요. 0° 와 180° 에서 얼마인가요?'};
     if(pick!==0)
       return {ok:false, msg:'90° 에서는 '+mem.dr+' m 떠내려갔고, '+mem.a2+'° 에서는 정면에 닿았고, 지금은 아예 못 건넙니다. 다시 고르세요.'};
     return {ok:true, msg:'판단했습니다 — <b>벡터의 합은 성분끼리 따로 더하는 것</b> 입니다. 가로는 떠내려감을, 세로는 건너는 속도를 맡습니다 — 비행기가 바람 속에서 기수를 돌리는 것도 같은 계산입니다.'};
   }}""")
 +
 note(163, '내가 곱하고 · 내가 맞추고 · 내가 판단한다',
 """  {t:'기록 — b 가 a 와 <b>나란하지 않을 때</b> 가위곱을 적으세요',
   f:'k = {0} · 가위곱 = {1}',
   chk(got, r, mem){
     if(!r) return {ok:false, msg:'아직 화면 값이 없습니다.'};
     const k=noteNum(r[0]), cr=noteNum(r[3]);
     if(String(r[4]).indexOf('평행')>=0)
       return {ok:false, msg:'지금 나란합니다 — b 를 움직여 나란하지 않게 만든 뒤 적으세요. 나란한 경우는 ②에서 봅니다.'};
     if(![0,1].every(j=>isFinite(got[j]))) return {ok:false, msg:'두 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-k)>0.06) return {ok:false, msg:'k 는 '+r[0]+' 입니다.'};
     if(Math.abs(got[1]-cr)>0.02) return {ok:false, msg:'가위곱은 '+r[3]+' 입니다.'};
     mem.cr=cr;
     return {ok:true, msg:'기록했습니다 — 가위곱이 0 이 아닙니다. 이제 나란하게 맞춰 봅시다.'};
   }}""",
 """  {t:'생각 — b 를 움직여 a 와 <b>나란하게</b> 맞추세요',
   f:'가위곱 = {0} · b 는 a 의 몇 배인가 = {1}',
   chk(got, r, mem){
     if(mem.cr===undefined) return {ok:false, msg:'① 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const cr=noteNum(r[3]);
     if(String(r[4]).indexOf('평행')<0)
       return {ok:false, msg:'아직 «'+r[4]+'» 입니다. b 의 x 를 y 의 두 배로 맞추세요 (a = (2, 1) 이므로).'};
     const b=String(r[2]).match(/-?\\d+(\\.\\d+)?/g)||[];
     const by=+b[1];
     if(![0,1].every(j=>isFinite(got[j]))) return {ok:false, msg:'두 칸을 모두 채우세요.'};
     if(Math.abs(got[0])>0.02) return {ok:false, msg:'가위곱은 '+r[3]+' 입니다.'};
     if(!isFinite(by)) return {ok:false, msg:'화면의 b 를 읽을 수 없습니다 — 슬라이더를 한 번 더 움직여 보세요.'};
     if(Math.abs(got[1]-by)>0.06) return {ok:false, msg:'b = '+r[2]+' 를 a = (2, 1) 로 나누어 보세요.'};
     mem.ok2=true;
     return {ok:true, msg:'계산했습니다 — 가위곱이 0 이고, b 가 a 의 '+by+'배입니다.'};
   }}""",
 """  {t:'판단 — k 를 <b>음수</b> 로 내려 본 뒤 고르세요',
   f:'k = {0} · 가위곱 = {1}',
   opts:['b = k·a 와 <b>a₁b₂ − a₂b₁ = 0</b> 은 같은 조건 — k 가 음수여도 「한 직선 위」라는 뜻은 그대로다',
         'k 가 음수이면 두 벡터는 나란하지 않다',
         '가위곱이 음수이면 나란하지 않다'],
   chk(got, r, mem, pick){
     if(!mem.ok2) return {ok:false, msg:'② 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const k=noteNum(r[0]), cr=noteNum(r[3]);
     if(!(k<0)) return {ok:false, msg:'k 를 음수로 내리세요 (지금 '+r[0]+').'};
     if(![0,1].every(j=>isFinite(got[j]))) return {ok:false, msg:'두 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-k)>0.06) return {ok:false, msg:'k 는 '+r[0]+' 입니다.'};
     if(Math.abs(got[1]-cr)>0.02) return {ok:false, msg:'가위곱은 '+r[3]+' 입니다.'};
     if(pick!==0)
       return {ok:false, msg:'k 를 음수로 해도 k·a 는 a 와 같은 직선 위에 있습니다. 화살표 방향만 뒤집혔을 뿐입니다. 다시 고르세요.'};
     return {ok:true, msg:'판단했습니다 — <b>실수배는 길이와 방향(앞뒤)만 바꾸고 「놓인 직선」은 바꾸지 않습니다.</b> 그래서 평행 조건은 성분의 비가 같은 것, 곧 가위곱이 0 인 것입니다.'};
   }}""")
 +
 note(164, '내가 곱하고 · 내가 나누고 · 내가 판단한다',
 """  {t:'기록 — 두 벡터를 정하고 내적과 각을 적으세요',
   f:'a·b = {0} · cos θ = {1} · θ = {2}',
   chk(got, r, mem){
     if(!r) return {ok:false, msg:'아직 화면 값이 없습니다.'};
     const dot=noteNum(r[2]), cs=noteNum(r[3]), th=noteNum(r[4]);
     if(!(dot>0.5)) return {ok:false, msg:'①은 <b>예각</b> 인 자리에서 적습니다 — 내적이 양수가 되게 b 를 돌리세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-dot)>0.02||Math.abs(got[1]-cs)>0.004)
       return {ok:false, msg:'화면은 a·b = '+r[2]+' · cos θ = '+r[3]+' 입니다.'};
     if(Math.abs(got[2]-th)>0.15) return {ok:false, msg:'θ 는 '+r[4]+' 입니다.'};
     mem.dot=dot; mem.th=th;
     return {ok:true, msg:'기록했습니다 — 내적이 양수이고 각이 90° 보다 작습니다. 수직으로 만들어 봅시다.'};
   }}""",
 """  {t:'생각 — <b>「b 를 a 에 수직으로」</b> 를 눌러 보세요',
   f:'a·b = {0} · θ = {1}',
   chk(got, r, mem){
     if(mem.dot===undefined) return {ok:false, msg:'① 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const dot=noteNum(r[2]), th=noteNum(r[4]);
     if(Math.abs(dot)>0.02) return {ok:false, msg:'아직 a·b = '+r[2]+' 입니다. 수직으로 만드세요.'};
     if(![0,1].every(j=>isFinite(got[j]))) return {ok:false, msg:'두 칸을 모두 채우세요.'};
     if(Math.abs(got[0])>0.02) return {ok:false, msg:'내적은 '+r[2]+' 입니다.'};
     if(Math.abs(got[1]-90)>0.6) return {ok:false, msg:'θ 는 '+r[4]+' 입니다.'};
     mem.ok2=true;
     return {ok:true, msg:'계산했습니다 — 내적이 0 이면 각이 꼭 90° 입니다.'};
   }}""",
 """  {t:'판단 — b 를 돌려 <b>둔각</b> 을 만든 뒤 고르세요',
   f:'a·b = {0} · cos θ = {1} · θ = {2}',
   opts:['a·b = |a||b|cos θ — 길이는 늘 양수이므로 <b>내적의 부호가 곧 cos 의 부호</b>, 즉 예각·직각·둔각을 가른다',
         '내적이 음수이면 두 벡터의 길이가 음수라는 뜻이다',
         '내적만으로는 각을 알 수 없고 그림이 필요하다'],
   chk(got, r, mem, pick){
     if(!mem.ok2) return {ok:false, msg:'② 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const dot=noteNum(r[2]), cs=noteNum(r[3]), th=noteNum(r[4]);
     if(!(dot<-0.02)) return {ok:false, msg:'아직 a·b = '+r[2]+' 입니다. b 를 더 돌려 음수로 만드세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-dot)>0.02||Math.abs(got[1]-cs)>0.004)
       return {ok:false, msg:'지금은 '+r[2]+' 와 '+r[3]+' 입니다.'};
     if(Math.abs(got[2]-th)>0.15) return {ok:false, msg:'θ 는 '+r[4]+' 입니다.'};
     if(!(th>90)) return {ok:false, msg:'θ 가 '+r[4]+' 입니다 — 90° 를 넘겨야 둔각입니다.'};
     if(pick!==0)
       return {ok:false, msg:'내적이 '+mem.dot+'(예각) → 0(직각) → '+r[2]+'(둔각) 으로 바뀌었습니다. 식의 어느 자리가 부호를 쥐고 있나요? 다시 고르세요.'};
     return {ok:true, msg:'판단했습니다 — <b>내적 하나로 각의 종류까지 읽힙니다.</b> 그래서 컴퓨터 그래픽은 빛과 면의 각을 각도기 없이 내적으로 계산하고, 검색엔진도 두 문서의 「닮음」을 내적으로 잽니다.'};
   }}""")
 +
 note(165, '내가 세우고 · 내가 재고 · 내가 판단한다',
 """  {t:'기록 — 비스듬한 각에서 그림자를 적으세요',
   f:'길이 = {0} · 각 = {1} · 그림자 = {2}',
   chk(got, r, mem){
     if(!r) return {ok:false, msg:'아직 화면 값이 없습니다.'};
     const L=noteNum(r[0]), d=noteNum(r[1]), sh=noteNum(r[3]);
     if(d===0||d===90) return {ok:false, msg:'①은 0° 도 90° 도 아닌 비스듬한 각에서 적습니다 (지금 '+r[1]+').'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-L)>0.06) return {ok:false, msg:'길이는 '+r[0]+' 입니다.'};
     if(Math.abs(got[1]-d)>0.6) return {ok:false, msg:'각은 '+r[1]+' 입니다.'};
     if(Math.abs(got[2]-sh)>0.006) return {ok:false, msg:'그림자는 '+r[3]+' 입니다.'};
     mem.L=L; mem.d=d; mem.sh=sh;
     return {ok:true, msg:'기록했습니다 — 그림자 ÷ 길이 가 무엇과 같은지 봅시다.'};
   }}""",
 """  {t:'생각 — <b>그림자 ÷ 길이</b> 를 구해 cos 과 맞추세요',
   f:'그림자 ÷ 길이 = {0} · 화면의 cos = {1} · 두 값의 차 = {2}',
   chk(got, r, mem){
     if(mem.L===undefined) return {ok:false, msg:'① 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const cs=noteNum(r[2]);
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-mem.sh/mem.L)>0.006) return {ok:false, msg:'①의 그림자 '+mem.sh+' 를 길이 '+mem.L+' 로 나누세요.'};
     if(Math.abs(got[1]-cs)>0.004) return {ok:false, msg:'화면의 cos 은 '+r[2]+' 입니다.'};
     if(Math.abs(got[2])>0.008) return {ok:false, msg:'두 값을 빼 보세요. 무엇이 나오나요?'};
     mem.ok2=true;
     return {ok:true, msg:'계산했습니다 — 길이가 얼마든 비율은 cos 하나로 정해집니다.'};
   }}""",
 """  {t:'판단 — 각을 <b>60°</b> 로 맞춘 뒤 고르세요',
   f:'그림자 = {0} · 길이의 몇 배인가 = {1}',
   opts:['정사영의 길이 = 원래 길이 × <b>cos θ</b> — 각에 비례하는 것이 아니라 cos 에 비례한다',
         '각이 절반이면 그림자도 절반이 된다',
         '45°에서 그림자가 길이의 절반이 된다'],
   chk(got, r, mem, pick){
     if(!mem.ok2) return {ok:false, msg:'② 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const L=noteNum(r[0]), d=noteNum(r[1]), sh=noteNum(r[3]);
     if(d!==60) return {ok:false, msg:'각을 60° 로 맞추세요 (지금 '+r[1]+').'};
     if(![0,1].every(j=>isFinite(got[j]))) return {ok:false, msg:'두 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-sh)>0.006) return {ok:false, msg:'그림자는 '+r[3]+' 입니다.'};
     if(Math.abs(got[1]-0.5)>0.02) return {ok:false, msg:'그림자를 길이 '+r[0]+' 로 나누어 보세요.'};
     if(pick!==0)
       return {ok:false, msg:'45° 가 아니라 60° 에서 절반이 되었습니다. 비율을 정하는 것은 각 자체가 아니라 무엇일까요? 다시 고르세요.'};
     return {ok:true, msg:'판단했습니다 — <b>그림자는 cos 만큼 줄어듭니다.</b> 햇빛이 비스듬히 드는 겨울에 같은 땅이 받는 빛이 적어지는 것, 위성 사진에서 비탈이 눌려 보이는 것이 모두 이 cos 입니다.'};
   }}""")
 +
 note(166, '내가 눕히고 · 내가 세우고 · 내가 판단한다',
 """  {t:'기록 — 지금 판의 넓이와 그림자 넓이를 적으세요',
   f:'S = {0} · S′ = {1} · S′ ÷ S = {2}',
   chk(got, r, mem){
     if(!r) return {ok:false, msg:'아직 화면 값이 없습니다.'};
     const d=noteNum(r[2]), S=noteNum(r[3]), Sp=noteNum(r[4]);
     if(d===0||d===90) return {ok:false, msg:'①은 0° 도 90° 도 아닌 비스듬한 각에서 적습니다 (지금 '+r[2]+').'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-S)>0.06||Math.abs(got[1]-Sp)>0.02)
       return {ok:false, msg:'화면은 S = '+r[3]+' · S′ = '+r[4]+' 입니다.'};
     if(Math.abs(got[2]-Sp/S)>0.008) return {ok:false, msg:'S′ 를 S 로 나누세요.'};
     mem.S=S; mem.d=d; mem.ratio=Sp/S;
     return {ok:true, msg:'기록했습니다 — 비가 '+(Sp/S).toFixed(3)+' 입니다. 판의 크기를 바꾸면 달라질까요?'};
   }}""",
 """  {t:'생각 — 각은 그대로 두고 <b>가로나 세로를 바꿔</b> 보세요',
   f:'새 S = {0} · S′ = {1} · S′ ÷ S = {2}',
   chk(got, r, mem){
     if(mem.S===undefined) return {ok:false, msg:'① 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const d=noteNum(r[2]), S=noteNum(r[3]), Sp=noteNum(r[4]);
     if(d!==mem.d) return {ok:false, msg:'각은 ①과 같은 '+mem.d+'° 로 두세요 — 판의 크기만 바꿉니다.'};
     if(Math.abs(S-mem.S)<0.4) return {ok:false, msg:'판의 크기가 거의 그대로입니다 — 가로나 세로를 바꾸세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-S)>0.06||Math.abs(got[1]-Sp)>0.02)
       return {ok:false, msg:'지금은 S = '+r[3]+' · S′ = '+r[4]+' 입니다.'};
     if(Math.abs(got[2]-Sp/S)>0.008) return {ok:false, msg:'S′ 를 S 로 나누세요.'};
     if(Math.abs(Sp/S-mem.ratio)>0.01) return {ok:false, msg:'비가 달라졌습니다 — 각이 그대로인지 확인하세요.'};
     mem.ok2=true;
     return {ok:true, msg:'계산했습니다 — 판이 커져도 비는 그대로입니다. 비를 정하는 것은 각뿐입니다.'};
   }}""",
 """  {t:'판단 — 각을 <b>60°</b> 로 맞춘 뒤 고르세요',
   f:'S′ ÷ S = {0} · cos 60° 와의 차 = {1}',
   opts:['기울여도 <b>한 방향(회전축과 나란한 쪽)은 줄지 않으므로</b> 넓이는 cos 배 — cos² 배가 아니다',
         '길이가 cos 배였으니 넓이는 cos² 배다',
         '넓이는 기울여도 변하지 않는다'],
   chk(got, r, mem, pick){
     if(!mem.ok2) return {ok:false, msg:'② 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const d=noteNum(r[2]), S=noteNum(r[3]), Sp=noteNum(r[4]);
     if(d!==60) return {ok:false, msg:'각을 60° 로 맞추세요 (지금 '+r[2]+').'};
     if(![0,1].every(j=>isFinite(got[j]))) return {ok:false, msg:'두 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-Sp/S)>0.008) return {ok:false, msg:'S′ 를 S 로 나누세요 — '+r[4]+' ÷ '+r[3]+' 입니다.'};
     if(Math.abs(got[1])>0.012) return {ok:false, msg:'cos 60° = 0.5 와 견주어 차를 적으세요.'};
     if(pick!==0)
       return {ok:false, msg:'cos² 60° 는 0.25 인데 비는 0.5 였습니다. 두 변 가운데 몇 개가 줄었나요? 다시 고르세요.'};
     return {ok:true, msg:'판단했습니다 — <b>S′ = S cos θ</b> 입니다. 태양광 패널의 각도를 계절마다 바꾸는 것, 위성 사진에서 비탈의 넓이를 되살려 계산하는 것이 모두 이 식입니다.'};
   }}""")
 +
 note(167, '내가 세우고 · 내가 옮기고 · 내가 판단한다',
 """  {t:'기록 — HA 를 0 이 아니게 두고 A 를 <b>수선의 발 바로 앞</b> 으로 맞추세요',
   f:'PH = {0} · HA = {1} · PA = {2}',
   chk(got, r, mem){
     if(!r) return {ok:false, msg:'아직 화면 값이 없습니다.'};
     const ph=noteNum(r[0]), ha=noteNum(r[1]), pa=noteNum(r[2]), d1=noteNum(r[3]), d2=noteNum(r[4]);
     if(!(ha>0.2)) return {ok:false, msg:'HA 가 '+r[1]+' 입니다 — H 에서 ℓ 까지의 거리를 0 보다 크게 하세요.'};
     if(Math.abs(d1)>1e-6) return {ok:false, msg:'아직 HA·ℓ = '+r[3]+' 입니다. A 를 옮겨 0 으로 만드세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-ph)>0.06||Math.abs(got[1]-ha)>0.02)
       return {ok:false, msg:'화면은 PH = '+r[0]+' · HA = '+r[1]+' 입니다.'};
     if(Math.abs(got[2]-pa)>0.006) return {ok:false, msg:'PA 는 '+r[2]+' 입니다.'};
     mem.ph=ph; mem.ha=ha; mem.pa=pa;
     return {ok:true, msg:'기록했습니다 — HA·ℓ 와 PA·ℓ 가 함께 0 입니다. 세 길이의 관계를 봅시다.'};
   }}""",
 """  {t:'생각 — <b>PH² + HA²</b> 를 구해 PA² 와 맞추세요',
   f:'PH² + HA² = {0} · PA² = {1} · 두 값의 차 = {2}',
   chk(got, r, mem){
     if(mem.ph===undefined) return {ok:false, msg:'① 칸을 먼저 통과하세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     const s=mem.ph*mem.ph+mem.ha*mem.ha;
     if(Math.abs(got[0]-s)>0.08) return {ok:false, msg:'①의 PH 와 HA 를 각각 제곱해 더하세요.'};
     if(Math.abs(got[1]-mem.pa*mem.pa)>0.08) return {ok:false, msg:'①의 PA = '+mem.pa+' 를 제곱하세요.'};
     if(Math.abs(got[2])>0.1) return {ok:false, msg:'두 값을 빼 보세요. 무엇이 나오나요?'};
     mem.ok2=true;
     return {ok:true, msg:'계산했습니다 — 차가 0 이니 삼각형 PHA 는 H 가 직각인 직각삼각형입니다.'};
   }}""",
 """  {t:'판단 — A 를 ℓ 위에서 <b>옆으로 옮긴</b> 뒤 고르세요',
   f:'HA·ℓ = {0} · PA·ℓ = {1}',
   opts:['PH ⊥ 평면이면 PH ⊥ ℓ 이고, 여기에 HA ⊥ ℓ 이 더해지면 ℓ 이 <b>평면 PHA 전체에 수직</b> — 그래서 PA ⊥ ℓ',
         'PA 는 비스듬하므로 ℓ 에 수직일 수 없다',
         '두 내적은 서로 상관없이 따로 움직인다'],
   chk(got, r, mem, pick){
     if(!mem.ok2) return {ok:false, msg:'② 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const d1=noteNum(r[3]), d2=noteNum(r[4]);
     if(Math.abs(d1)<1e-6) return {ok:false, msg:'A 를 ℓ 위에서 옆으로 옮기세요 — 지금 HA·ℓ 가 아직 0 입니다.'};
     if(![0,1].every(j=>isFinite(got[j]))) return {ok:false, msg:'두 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-d1)>0.02||Math.abs(got[1]-d2)>0.02)
       return {ok:false, msg:'화면은 '+r[3]+' 와 '+r[4]+' 입니다.'};
     if(pick!==0)
       return {ok:false, msg:'A 를 옮기자 두 내적이 <b>함께</b> 0 에서 벗어났습니다 ('+r[3]+', '+r[4]+'). 왜 함께 움직일까요? 다시 고르세요.'};
     return {ok:true, msg:'판단했습니다 — <b>삼수선 정리</b> 입니다. 셋 중 둘이 수직이면 나머지 하나도 수직 — 공간의 수직을 평면에서의 수직 하나로 확인할 수 있게 해 줍니다.'};
   }}""")
 +
 note(168, '내가 띄우고 · 내가 재고 · 내가 판단한다',
 """  {t:'기록 — 드론을 띄우고 <b>바닥 거리</b> 를 손으로 구하세요',
   f:'x = {0} · y = {1} · √(x² + y²) = {2}',
   chk(got, r, mem){
     if(!r) return {ok:false, msg:'아직 화면 값이 없습니다.'};
     const x=noteNum(r[0]), y=noteNum(r[1]), z=noteNum(r[2]), g=noteNum(r[3]);
     if(!(z>0.2)) return {ok:false, msg:'높이를 0 보다 크게 올리세요 (지금 '+r[2]+').'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-x)>0.06||Math.abs(got[1]-y)>0.06)
       return {ok:false, msg:'화면은 x = '+r[0]+' · y = '+r[1]+' 입니다.'};
     if(Math.abs(got[2]-g)>0.006) return {ok:false, msg:'x 와 y 를 제곱해 더한 뒤 제곱근을 구하세요 — 화면은 '+r[3]+' 입니다.'};
     mem.x=x; mem.y=y; mem.z=z; mem.g=g;
     return {ok:true, msg:'기록했습니다 — 바닥 거리를 구했습니다. 이제 높이를 합쳐 봅시다.'};
   }}""",
 """  {t:'생각 — 바닥 거리와 높이로 <b>전체 거리</b> 를 구하세요',
   f:'√(바닥 거리² + z²) = {0} · 화면의 전체 거리 = {1} · 두 값의 차 = {2}',
   chk(got, r, mem){
     if(mem.x===undefined) return {ok:false, msg:'① 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const d=noteNum(r[4]);
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-Math.sqrt(mem.g*mem.g+mem.z*mem.z))>0.012)
       return {ok:false, msg:'①의 바닥 거리 '+mem.g+' 와 높이 '+mem.z+' 를 다시 피타고라스로 합치세요.'};
     if(Math.abs(got[1]-d)>0.006) return {ok:false, msg:'화면의 전체 거리는 '+r[4]+' 입니다.'};
     if(Math.abs(got[2])>0.012) return {ok:false, msg:'두 값을 빼 보세요.'};
     mem.ok2=true;
     return {ok:true, msg:'계산했습니다 — 피타고라스를 두 번 썼더니 √(x²+y²+z²) 가 되었습니다.'};
   }}""",
 """  {t:'판단 — 높이를 <b>0</b> 으로 내린 뒤 고르세요',
   f:'바닥 거리 = {0} · 전체 거리 = {1} · 두 값의 차 = {2}',
   opts:['공간의 거리 √(x²+y²+z²) 는 <b>피타고라스를 두 번 쓴 결과</b> — 평면의 거리 공식을 한 차원 넓힌 것이다',
         '차원이 하나 늘면 공식도 완전히 새로 만들어야 한다',
         '높이가 0 이어도 전체 거리는 바닥 거리보다 크다'],
   chk(got, r, mem, pick){
     if(!mem.ok2) return {ok:false, msg:'② 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const z=noteNum(r[2]), g=noteNum(r[3]), d=noteNum(r[4]);
     if(!(z<0.05)) return {ok:false, msg:'높이를 0 으로 내리세요 (지금 '+r[2]+').'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-g)>0.006||Math.abs(got[1]-d)>0.006)
       return {ok:false, msg:'지금은 '+r[3]+' 와 '+r[4]+' 입니다.'};
     if(Math.abs(got[2])>0.008) return {ok:false, msg:'두 값을 빼 보세요. 무엇이 나오나요?'};
     if(pick!==0)
       return {ok:false, msg:'높이를 0 으로 내리니 두 거리가 같아졌습니다 — 공간의 식이 평면의 식을 품고 있다는 뜻입니다. 다시 고르세요.'};
     return {ok:true, msg:'판단했습니다 — <b>z = 0 을 넣으면 평면의 거리 공식이 그대로 나옵니다.</b> 차원이 늘어도 식이 새로 생기는 것이 아니라 한 항이 더해질 뿐입니다 — GPS 도 이 식으로 높이까지 계산합니다.'};
   }}""")
 +
 note(169, '내가 자르고 · 내가 옮기고 · 내가 판단한다',
 """  {t:'기록 — 중심을 지나게 잘라 <b>가장 큰 단면</b> 을 만드세요',
   f:'R = {0} · h = {1} · 단면 반지름 = {2}',
   chk(got, r, mem){
     if(!r) return {ok:false, msg:'아직 화면 값이 없습니다.'};
     const R=noteNum(r[0]), h=noteNum(r[1]), rr=noteNum(r[3]);
     if(!(Math.abs(h)<0.05)) return {ok:false, msg:'h 가 '+r[1]+' 입니다. 0 으로 맞춰 중심을 지나게 자르세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-R)>0.06||Math.abs(got[1]-h)>0.06)
       return {ok:false, msg:'화면은 R = '+r[0]+' · h = '+r[1]+' 입니다.'};
     if(Math.abs(got[2]-rr)>0.006) return {ok:false, msg:'단면 반지름은 '+r[3]+' 입니다.'};
     mem.R=R; mem.r0=rr;
     return {ok:true, msg:'기록했습니다 — 중심을 지나니 단면 반지름이 구의 반지름과 같습니다(대원). 비켜서 잘라 봅시다.'};
   }}""",
 """  {t:'생각 — h 를 <b>0 이 아니게</b> 옮기고 √(R² − h²) 를 손으로 구하세요',
   f:'h = {0} · R² − h² = {1} · √(R² − h²) = {2}',
   chk(got, r, mem){
     if(mem.R===undefined) return {ok:false, msg:'① 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const R=noteNum(r[0]), h=noteNum(r[1]), k=noteNum(r[2]), rr=noteNum(r[3]);
     if(Math.abs(R-mem.R)>0.06) return {ok:false, msg:'R 은 ①과 같은 '+mem.R+' 로 두세요 — h 만 옮깁니다.'};
     if(!(Math.abs(h)>0.3)) return {ok:false, msg:'h 를 0 에서 충분히 옮기세요 (지금 '+r[1]+').'};
     if(!isFinite(rr)) return {ok:false, msg:'단면이 사라졌습니다 — h 를 R 안쪽으로 되돌리세요. 사라지는 경우는 ③에서 봅니다.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-h)>0.06) return {ok:false, msg:'h 는 '+r[1]+' 입니다.'};
     if(Math.abs(got[1]-k)>0.03) return {ok:false, msg:'R² 에서 h² 를 빼세요 — 화면은 '+r[2]+' 입니다.'};
     if(Math.abs(got[2]-rr)>0.006) return {ok:false, msg:'그 값의 제곱근을 구하세요 — 화면은 '+r[3]+' 입니다.'};
     mem.ok2=true;
     return {ok:true, msg:'계산했습니다 — 비켜 자를수록 단면이 작아집니다. 어디까지 작아질까요?'};
   }}""",
 """  {t:'판단 — h 를 R 보다 <b>크게</b> 해 단면을 없앤 뒤 고르세요',
   f:'R = {0} · h = {1} · R² − h² = {2}',
   opts:['중심 · 단면의 중심 · 단면 위의 점이 <b>직각삼각형</b> 을 이루므로 단면 반지름 = √(R² − h²) — h > R 이면 제곱근 안이 음수라 단면이 없다',
         '어떻게 잘라도 단면의 크기는 같다',
         'h 가 R 보다 커도 작은 원이 남는다'],
   chk(got, r, mem, pick){
     if(!mem.ok2) return {ok:false, msg:'② 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const R=noteNum(r[0]), h=noteNum(r[1]), k=noteNum(r[2]);
     if(!(Math.abs(h)>R)) return {ok:false, msg:'|h| 를 R = '+r[0]+' 보다 크게 하세요 (지금 '+r[1]+').'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-R)>0.06||Math.abs(got[1]-h)>0.06)
       return {ok:false, msg:'지금은 R = '+r[0]+' · h = '+r[1]+' 입니다.'};
     if(Math.abs(got[2]-k)>0.03) return {ok:false, msg:'R² − h² 는 '+r[2]+' 입니다 — 부호까지 적으세요.'};
     if(!(k<0)) return {ok:false, msg:'R² − h² 가 아직 음수가 아닙니다 — h 를 더 키우세요.'};
     if(pick!==0)
       return {ok:false, msg:'h = 0 에서 '+mem.r0+' 였던 단면이 점점 작아지다가, R² − h² 가 '+r[2]+' 가 되자 사라졌습니다. 다시 고르세요.'};
     return {ok:true, msg:'판단했습니다 — <b>단면은 늘 원이고 그 반지름은 √(R² − h²)</b> 입니다. 제곱근 안이 음수가 되는 순간이 「평면이 구를 벗어나는」 순간입니다 — 식이 그 사실을 그대로 말해 줍니다.'};
   }}""")
 +
 note(170, '내가 기울이고 · 내가 넘기고 · 내가 판단한다',
 """  {t:'기록 — 자르는 각을 <b>45° 보다 작게</b> 두고 적으세요',
   f:'자른 각 = {0} · e = {1}',
   chk(got, r, mem){
     if(!r) return {ok:false, msg:'아직 화면 값이 없습니다.'};
     const t=noteNum(r[0]), e=noteNum(r[1]);
     if(!(t<45)) return {ok:false, msg:'자르는 각을 45° 보다 작게 하세요 (지금 '+r[0]+').'};
     if(![0,1].every(j=>isFinite(got[j]))) return {ok:false, msg:'두 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-t)>0.6) return {ok:false, msg:'자른 각은 '+r[0]+' 입니다.'};
     if(Math.abs(got[1]-e)>0.004) return {ok:false, msg:'e 는 '+r[1]+' 입니다.'};
     mem.t=t; mem.e=e; mem.kind=String(r[2]);
     return {ok:true, msg:'기록했습니다 — e 가 1 보다 작고 단면이 «'+mem.kind+'» 입니다. 더 세워 봅시다.'};
   }}""",
 """  {t:'생각 — 각을 <b>45°</b> 로 맞추고 e 를 적으세요',
   f:'e = {0} · 1 에서 뺀 값 = {1}',
   chk(got, r, mem){
     if(mem.t===undefined) return {ok:false, msg:'① 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const t=noteNum(r[0]), e=noteNum(r[1]);
     if(Math.abs(t-45)>0.6) return {ok:false, msg:'각을 45° 로 맞추세요 (지금 '+r[0]+').'};
     if(![0,1].every(j=>isFinite(got[j]))) return {ok:false, msg:'두 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-e)>0.004) return {ok:false, msg:'e 는 '+r[1]+' 입니다.'};
     if(Math.abs(got[1])>0.008) return {ok:false, msg:'1 에서 지금 e 를 빼 보세요. 무엇이 나오나요?'};
     mem.ok2=true;
     return {ok:true, msg:'계산했습니다 — 모선 각과 같아지는 순간 e 가 꼭 1 이 되고 단면이 «'+r[2]+'» 이 되었습니다.'};
   }}""",
 """  {t:'판단 — 45° 보다 <b>더 세워</b> 본 뒤 고르세요',
   f:'자른 각 = {0} · e = {1} · 겹 수 = {2}',
   opts:['원 · 타원 · 포물선 · 쌍곡선은 <b>같은 원뿔을 각도만 달리해 자른 한 집안</b> — 갈림목은 e = 1, 곧 자르는 각이 모선 각과 같아지는 순간',
         '네 곡선은 서로 관계없는 다른 도형이다',
         '자르는 각이 커질수록 단면이 점점 작아진다'],
   chk(got, r, mem, pick){
     if(!mem.ok2) return {ok:false, msg:'② 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const t=noteNum(r[0]), e=noteNum(r[1]), n=noteNum(r[4]);
     if(!(t>45)) return {ok:false, msg:'45° 보다 더 세우세요 (지금 '+r[0]+').'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-t)>0.6) return {ok:false, msg:'자른 각은 '+r[0]+' 입니다.'};
     if(Math.abs(got[1]-e)>0.004) return {ok:false, msg:'e 는 '+r[1]+' 입니다.'};
     if(Math.abs(got[2]-n)>0.5) return {ok:false, msg:'겹 수는 '+r[4]+' 입니다.'};
     if(!(e>1)) return {ok:false, msg:'e 가 아직 1 을 넘지 않았습니다 — 더 세우세요.'};
     if(pick!==0)
       return {ok:false, msg:'e 가 '+mem.e+'(«'+mem.kind+'») → 1(포물선) → '+r[1]+'(«'+r[2]+'») 로 이어졌습니다. 다시 고르세요.'};
     return {ok:true, msg:'판단했습니다 — <b>이심률 e 하나가 네 곡선을 한 줄로 꿰고 있습니다.</b> 행성은 e < 1 로 돌아오고, 일부 혜성은 e ≥ 1 이라 한 번 스치고 영영 떠납니다 — 같은 중력, 다른 이심률입니다.'};
   }}""")
)
