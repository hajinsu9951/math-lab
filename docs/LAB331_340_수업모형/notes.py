# -*- coding: utf-8 -*-
"""LAB 331~340 탐구 노트 — 기록 → 생각 → 판단. 판정은 화면의 read() 값으로만 한다."""


def note(no, head, c1, c2, c3):
    return "\n %d:{ h:'%s',\n  c:[\n%s,\n%s,\n%s\n ]},\n" % (no, head, c1, c2, c3)


NOTES = (
 note(331, '내가 세고 · 내가 바꾸고 · 내가 판단한다',
 """  {t:'기록 — <b>f(x) = 2x − 1</b> 에서 수평선과 만나는 점을 세어 적으세요',
   f:'높이 y = {0} · 만나는 점 = {1} 개 · 판정이 일대일 대응이면 1, 아니면 0 → {2}',
   chk(got, r, mem){
     if(!r) return {ok:false, msg:'아직 화면 값이 없습니다.'};
     if(String(r[0]).indexOf('2x')<0) return {ok:false, msg:'대응을 f(x) = 2x − 1 로 고르세요.'};
     const y=noteNum(r[1]), c=noteNum(r[2]);
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-y)>0.05) return {ok:false, msg:'높이는 '+r[1]+' 입니다.'};
     if(Math.abs(got[1]-c)>0.1) return {ok:false, msg:'화면에 만나는 점이 '+r[2]+' 개로 적혀 있습니다.'};
     if(Math.abs(got[2]-1)>0.1) return {ok:false, msg:'판정이 「일대일 대응」 이니 1 입니다.'};
     mem.c1=c;
     return {ok:true, msg:'기록했습니다 — 어느 높이에서든 한 점입니다.'};
   }}""",
 """  {t:'생각 — <b>f(x) = x²</b> 로 바꾸고 같은 높이에서 다시 세어 적으세요',
   f:'높이 y = {0} · 만나는 점 = {1} 개 · 판정이 일대일 대응이면 1, 아니면 0 → {2}',
   chk(got, r, mem){
     if(mem.c1===undefined) return {ok:false, msg:'① 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     if(String(r[3]).indexOf('일대일이 아님')<0) return {ok:false, msg:'대응을 「f(x) = x 제곱」 으로 바꾸세요.'};
     const y=noteNum(r[1]), c=noteNum(r[2]);
     if(!(c===2)) return {ok:false, msg:'높이를 0 보다 크게(y = 3 쯤) 두어 두 점에서 만나게 하세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-y)>0.05) return {ok:false, msg:'높이는 '+r[1]+' 입니다.'};
     if(Math.abs(got[1]-2)>0.1) return {ok:false, msg:'화면에 만나는 점이 '+r[2]+' 개로 적혀 있습니다.'};
     if(Math.abs(got[2])>0.1) return {ok:false, msg:'판정이 「일대일이 아님」 이니 0 입니다.'};
     mem.c2=c; mem.ok2=true;
     return {ok:true, msg:'계산했습니다 — 서로 다른 두 x 가 같은 값으로 갔습니다.'};
   }}""",
 """  {t:'판단 — 두 대응을 나란히 두고 고르세요',
   f:'①의 만나는 점 = {0} 개 · ②의 만나는 점 = {1} 개 · f(x) = x² 에서 y = 4 일 때 만나는 점 = {2} 개',
   opts:['<b>모든 수평선과 꼭 한 번씩</b> 만나야 되돌릴 수 있다 — 한 높이에서 두 점을 만나면 「이 값은 어느 x 였나」 를 가릴 수 없으므로 역함수가 없다',
         '만나는 점이 많을수록 더 좋은 대응이다',
         '한 높이에서라도 만나면 역함수가 있다'],
   chk(got, r, mem, pick){
     if(!mem.ok2) return {ok:false, msg:'② 칸을 먼저 통과하세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-1)>0.1) return {ok:false, msg:'①에서는 한 점이었습니다.'};
     if(Math.abs(got[1]-2)>0.1) return {ok:false, msg:'②에서는 두 점이었습니다.'};
     if(Math.abs(got[2]-2)>0.1) return {ok:false, msg:'x² = 4 의 해를 모두 구해 보세요.'};
     if(pick!==0)
       return {ok:false, msg:'y = 4 에서 x 가 2 와 −2 둘이었습니다. 값만 알고 x 를 되찾을 수 있을까요? 다시 고르세요.'};
     return {ok:true, msg:'판단했습니다 — <b>모든 높이에서 정확히 한 점</b> 이어야 역함수가 있습니다. x² 를 x ≥ 0 으로 줄이면 한 점만 남아 역함수 √x 가 생깁니다.'};
   }}""")
 + note(332, '내가 읽고 · 내가 옮기고 · 내가 판단한다',
 """  {t:'기록 — <b>p = 0 · q = 0</b> 으로 두고 점근선을 적으세요',
   f:'k = {0} · 세로 점근선 x = {1} · 가로 점근선 y = {2}',
   chk(got, r, mem){
     if(!r) return {ok:false, msg:'아직 화면 값이 없습니다.'};
     const k=noteNum(r[0]), p=noteNum(r[1]), q=noteNum(r[2]);
     if(Math.abs(p)>0.01||Math.abs(q)>0.01) return {ok:false, msg:'p 와 q 를 0 으로 두세요 — ②에서 옮겨 볼 테니까요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-k)>0.05) return {ok:false, msg:'k 는 '+r[0]+' 입니다.'};
     if(Math.abs(got[1])>0.05) return {ok:false, msg:'세로 점근선은 x = 0 입니다.'};
     if(Math.abs(got[2])>0.05) return {ok:false, msg:'가로 점근선은 y = 0 입니다.'};
     mem.p1=p; mem.q1=q;
     return {ok:true, msg:'기록했습니다 — 분모가 0 이 되는 x 가 세로 점근선입니다.'};
   }}""",
 """  {t:'생각 — <b>p = 2 · q = 1</b> 로 옮기고 다시 적으세요',
   f:'옮긴 뒤 세로 점근선 x = {0} · 가로 점근선 y = {1} · 정의역에서 빼야 하는 x = {2}',
   chk(got, r, mem){
     if(mem.p1===undefined) return {ok:false, msg:'① 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const p=noteNum(r[1]), q=noteNum(r[2]);
     if(Math.abs(p-2)>0.01||Math.abs(q-1)>0.01) return {ok:false, msg:'p 를 2, q 를 1 로 맞추세요 (지금 p = '+r[1]+' , q = '+r[2]+').'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-2)>0.05) return {ok:false, msg:'세로 점근선은 x = 2 입니다.'};
     if(Math.abs(got[1]-1)>0.05) return {ok:false, msg:'가로 점근선은 y = 1 입니다.'};
     if(Math.abs(got[2]-2)>0.05) return {ok:false, msg:'분모 x − 2 를 0 으로 만드는 x 입니다.'};
     mem.p2=p; mem.ok2=true;
     return {ok:true, msg:'계산했습니다 — 점근선이 p, q 만큼 그대로 따라 옮겨졌습니다.'};
   }}""",
 """  {t:'판단 — 점근선의 뜻을 고르세요',
   f:'①의 세로 점근선 x = {0} · ②의 세로 점근선 x = {1} · y = 2/(x − 1) + 1 에서 x = 1.1 일 때 y = {2}',
   opts:['점근선은 <b>그래프가 닿지 않으면서 한없이 가까워지는 선</b> 이다 — 세로 점근선의 x 는 분모를 0 으로 만드는 값이라 정의역에서 아예 빠진다',
         '점근선은 그래프가 지나가는 선이므로 그 위의 점도 정의역에 든다',
         '점근선은 그래프를 충분히 멀리 늘이면 결국 닿는다'],
   chk(got, r, mem, pick){
     if(!mem.ok2) return {ok:false, msg:'② 칸을 먼저 통과하세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0])>0.05) return {ok:false, msg:'①에서는 x = 0 이었습니다.'};
     if(Math.abs(got[1]-2)>0.05) return {ok:false, msg:'②에서는 x = 2 였습니다.'};
     if(Math.abs(got[2]-21)>0.5) return {ok:false, msg:'2 ÷ 0.1 + 1 을 계산해 보세요.'};
     if(pick!==0)
       return {ok:false, msg:'x = 1.1 에서 y 가 21 까지 올라갔지만 x = 1 은 정의역 밖이었습니다. 닿을 수 있을까요? 다시 고르세요.'};
     return {ok:true, msg:'판단했습니다 — <b>한없이 가까워지되 닿지 않습니다.</b> x = 1 을 넣으면 분모가 0 이 되어 값이 아예 없습니다.'};
   }}""")
 + note(333, '내가 풀고 · 내가 뒤집고 · 내가 판단한다',
 """  {t:'기록 — <b>a 를 양수</b> 로 두고 <b>p = 1</b> 에서 정의역의 경계를 적으세요',
   f:'a = {0} · p = {1} · 정의역의 경계 x = {2}',
   chk(got, r, mem){
     if(!r) return {ok:false, msg:'아직 화면 값이 없습니다.'};
     const a=noteNum(r[0]), p=noteNum(r[1]), b=noteNum(r[3]);
     if(!(a>0)) return {ok:false, msg:'a 를 양수로 두세요 — ②에서 음수로 바꿔 볼 테니까요.'};
     if(Math.abs(p-1)>0.01) return {ok:false, msg:'p 를 1 로 맞추세요 (지금 '+r[1]+').'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-a)>0.05) return {ok:false, msg:'a 는 '+r[0]+' 입니다.'};
     if(Math.abs(got[1]-1)>0.05) return {ok:false, msg:'p 는 1 입니다.'};
     if(Math.abs(got[2]-b)>0.05) return {ok:false, msg:'화면의 정의역이 '+r[3]+' 입니다.'};
     mem.b1=b;
     return {ok:true, msg:'기록했습니다 — 근호 안을 0 으로 만드는 x 가 경계입니다.'};
   }}""",
 """  {t:'생각 — <b>a 를 음수</b> 로 바꾸고 정의역을 다시 적으세요',
   f:'a = {0} · 정의역은 x ≤ {1} · 부등호 방향이 ①과 뒤집혔으면 1, 그대로면 0 → {2}',
   chk(got, r, mem){
     if(mem.b1===undefined) return {ok:false, msg:'① 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const a=noteNum(r[0]), b=noteNum(r[3]);
     if(!(a<0)) return {ok:false, msg:'a 를 음수로 내리세요 (지금 '+r[0]+').'};
     if(String(r[3]).indexOf('≤')<0) return {ok:false, msg:'화면의 정의역이 아직 '+r[3]+' 입니다.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-a)>0.05) return {ok:false, msg:'a 는 '+r[0]+' 입니다.'};
     if(Math.abs(got[1]-b)>0.05) return {ok:false, msg:'화면의 정의역이 '+r[3]+' 입니다.'};
     if(Math.abs(got[2]-1)>0.1) return {ok:false, msg:'x ≥ 에서 x ≤ 로 뒤집혔으니 1 입니다.'};
     mem.ok2=true;
     return {ok:true, msg:'계산했습니다 — 음수로 나누자 부등호가 뒤집혔습니다.'};
   }}""",
 """  {t:'판단 — 정의역을 구하는 절차를 고르세요',
   f:'①의 정의역 경계 = {0} · ②에서 부등호가 뒤집혔으면 1 → {1} · y = √(2(x − 3)) 의 정의역 경계 = {2}',
   opts:['정의역은 <b>근호 안 ≥ 0 을 푼 것</b> 이다 — 근호 안의 계수가 음수면 양변을 음수로 나누므로 부등호가 뒤집힌다',
         '정의역은 늘 x ≥ p 이고 계수의 부호와는 상관이 없다',
         '근호가 있으면 정의역은 언제나 모든 실수이다'],
   chk(got, r, mem, pick){
     if(!mem.ok2) return {ok:false, msg:'② 칸을 먼저 통과하세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-mem.b1)>0.05) return {ok:false, msg:'①에 적은 '+mem.b1+' 입니다.'};
     if(Math.abs(got[1]-1)>0.1) return {ok:false, msg:'②에서 뒤집혔으니 1 입니다.'};
     if(Math.abs(got[2]-3)>0.05) return {ok:false, msg:'2(x − 3) ≥ 0 을 푸세요.'};
     if(pick!==0)
       return {ok:false, msg:'a 를 음수로 바꾸자 부등호가 뒤집혔습니다. 계수의 부호와 상관이 없을까요? 다시 고르세요.'};
     return {ok:true, msg:'판단했습니다 — <b>근호 안 ≥ 0 을 푸는 것</b> 이 정의역입니다. 음수로 나눌 때 부등호를 뒤집는 것만 빠뜨리지 않으면 됩니다.'};
   }}""")
 + note(334, '내가 흔들고 · 내가 재고 · 내가 판단한다',
 """  {t:'기록 — <b>벌어진 정도 0.5</b> 에서 해와 증폭률을 적으세요',
   f:'벌어진 정도 = {0} · 해의 y = {1} · 증폭률 = {2}',
   chk(got, r, mem){
     if(!r) return {ok:false, msg:'아직 화면 값이 없습니다.'};
     const t=noteNum(r[0]), a=noteNum(r[3]);
     const m=String(r[2]).match(/-?\\d+(\\.\\d+)?/g);
     const y=m&&m.length>1?+m[1]:NaN;
     if(!(t>=0.3)) return {ok:false, msg:'벌어진 정도를 0.3 이상(0.5 쯤)으로 두세요 — ②에서 줄여 볼 테니까요.'};
     if(!isFinite(a)) return {ok:false, msg:'흔든 양을 0 이 아니게 두세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-t)>0.01) return {ok:false, msg:'벌어진 정도는 '+r[0]+' 입니다.'};
     if(Math.abs(got[1]-y)>0.05) return {ok:false, msg:'화면의 해가 '+r[2]+' 입니다 — y 를 적으세요.'};
     if(Math.abs(got[2]-a)>0.05) return {ok:false, msg:'증폭률은 '+r[3]+' 입니다.'};
     mem.a1=a; mem.t1=t;
     return {ok:true, msg:'기록했습니다 — 비스듬히 만나면 해가 거의 움직이지 않습니다.'};
   }}""",
 """  {t:'생각 — <b>벌어진 정도를 0.04 이하</b> 로 줄이고 다시 적으세요',
   f:'벌어진 정도 = {0} · 해의 y = {1} · 증폭률 = {2}',
   chk(got, r, mem){
     if(mem.a1===undefined) return {ok:false, msg:'① 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const t=noteNum(r[0]), a=noteNum(r[3]);
     const m=String(r[2]).match(/-?\\d+(\\.\\d+)?/g);
     const y=m&&m.length>1?+m[1]:NaN;
     if(!(t<=0.06)) return {ok:false, msg:'벌어진 정도가 '+r[0]+' 입니다 — 0.04 이하로 줄이세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-t)>0.01) return {ok:false, msg:'벌어진 정도는 '+r[0]+' 입니다.'};
     if(Math.abs(got[1]-y)>0.05) return {ok:false, msg:'화면의 해가 '+r[2]+' 입니다 — y 를 적으세요.'};
     if(Math.abs(got[2]-a)>Math.max(0.1,Math.abs(a)*0.02)) return {ok:false, msg:'증폭률은 '+r[3]+' 입니다.'};
     mem.a2=a; mem.ok2=true;
     return {ok:true, msg:'계산했습니다 — 같은 흔들림인데 증폭률이 '+mem.a1.toFixed(2)+' 에서 '+a.toFixed(2)+' 로 뛰었습니다.'};
   }}""",
 """  {t:'판단 — 두 증폭률을 나란히 두고 고르세요',
   f:'①의 증폭률 = {0} · ②의 증폭률 = {1} · x + y = 2 · x + 1.1y = 2.1 의 해에서 y = {2}',
   opts:['같은 식이라도 <b>두 직선이 거의 나란하면</b> 작은 오차가 크게 증폭된다 — 해를 쓸 때는 자료의 오차가 몇 배로 커지는지 함께 밝혀야 한다',
         '해를 구하는 공식이 정확하면 자료의 오차와는 상관이 없다',
         '벌어진 정도가 작을수록 해가 더 안정된다'],
   chk(got, r, mem, pick){
     if(!mem.ok2) return {ok:false, msg:'② 칸을 먼저 통과하세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-mem.a1)>0.1) return {ok:false, msg:'①에 적은 '+mem.a1.toFixed(2)+' 입니다.'};
     if(Math.abs(got[1]-mem.a2)>Math.max(0.2,Math.abs(mem.a2)*0.02)) return {ok:false, msg:'②에 적은 '+mem.a2.toFixed(2)+' 입니다.'};
     if(Math.abs(got[2]-1)>0.05) return {ok:false, msg:'두 식을 빼면 0.1y = 0.1 이 남습니다.'};
     if(pick!==0)
       return {ok:false, msg:'공식은 그대로였는데 증폭률만 '+mem.a1.toFixed(2)+' → '+mem.a2.toFixed(2)+' 로 뛰었습니다. 자료의 오차와 무관할까요? 다시 고르세요.'};
     return {ok:true, msg:'판단했습니다 — <b>거의 나란한 연립방정식은 해를 믿기 어렵습니다.</b> 증폭률이 √2 ÷ (벌어진 정도) 이므로 벌어진 정도가 분모로 들어갑니다.'};
   }}""")
 + note(335, '내가 재고 · 내가 눈높이를 바꾸고 · 내가 판단한다',
 """  {t:'기록 — <b>θ = 50°</b> 에서 소실점의 자리를 적으세요',
   f:'θ = {0}° · 눈높이 = {1} · 소실점의 가로 자리 = {2} px',
   chk(got, r, mem){
     if(!r) return {ok:false, msg:'아직 화면 값이 없습니다.'};
     const th=noteNum(r[0]), h=noteNum(r[1]), v=noteNum(r[2]);
     if(Math.abs(th-50)>0.5) return {ok:false, msg:'θ 를 50° 로 맞추세요 (지금 '+r[0]+').'};
     if(!isFinite(v)) return {ok:false, msg:'소실점이 화면 밖입니다 — θ 를 50° 로 두세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-50)>0.5) return {ok:false, msg:'θ 는 50 입니다.'};
     if(Math.abs(got[1]-h)>0.05) return {ok:false, msg:'눈높이는 '+r[1]+' 입니다.'};
     if(Math.abs(got[2]-v)>0.5) return {ok:false, msg:'소실점의 자리는 '+r[2]+' 입니다.'};
     mem.v1=v; mem.h1=h;
     return {ok:true, msg:'기록했습니다 — 같은 방향의 선들이 이 한 점으로 모였습니다.'};
   }}""",
 """  {t:'생각 — θ 는 그대로 두고 <b>눈높이를 2.5 이상</b> 으로 올려 다시 적으세요',
   f:'눈높이 = {0} · 소실점의 가로 자리 = {1} px · ①과 달라졌으면 1, 그대로면 0 → {2}',
   chk(got, r, mem){
     if(mem.v1===undefined) return {ok:false, msg:'① 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const th=noteNum(r[0]), h=noteNum(r[1]), v=noteNum(r[2]);
     if(Math.abs(th-50)>0.5) return {ok:false, msg:'θ 는 50° 로 두세요 — 이번에는 눈높이만 바꿉니다.'};
     if(!(h>=2.5)) return {ok:false, msg:'눈높이가 '+r[1]+' 입니다 — 2.5 이상으로 올리세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-h)>0.05) return {ok:false, msg:'눈높이는 '+r[1]+' 입니다.'};
     if(Math.abs(got[1]-v)>0.5) return {ok:false, msg:'소실점의 자리는 '+r[2]+' 입니다.'};
     if(Math.abs(got[2])>0.1) return {ok:false, msg:'①과 같은 '+r[2]+' 이니 0 입니다.'};
     mem.v2=v; mem.ok2=true;
     return {ok:true, msg:'계산했습니다 — 눈높이를 올려도 소실점의 가로 자리는 그대로입니다.'};
   }}""",
 """  {t:'판단 — 무엇이 소실점을 정하는지 고르세요',
   f:'①의 소실점 자리 = {0} px · ②의 소실점 자리 = {1} px · θ = 45° 일 때의 소실점 자리 = {2} px',
   opts:['소실점은 <b>선의 방향</b> 이 정한다 — 선이 어디에 있든 눈높이가 얼마든, 방향이 같으면 모두 같은 소실점으로 모인다',
         '소실점은 눈높이가 정하므로 눈높이를 올리면 옆으로 옮겨진다',
         '소실점은 선이 떨어져 있는 간격이 정한다'],
   chk(got, r, mem, pick){
     if(!mem.ok2) return {ok:false, msg:'② 칸을 먼저 통과하세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-mem.v1)>0.5) return {ok:false, msg:'①에 적은 '+mem.v1.toFixed(1)+' 입니다.'};
     if(Math.abs(got[1]-mem.v2)>0.5) return {ok:false, msg:'②에 적은 '+mem.v2.toFixed(1)+' 입니다.'};
     if(Math.abs(got[2]-220)>5) return {ok:false, msg:'220 × cot 45° 를 계산해 보세요.'};
     if(pick!==0)
       return {ok:false, msg:'눈높이를 바꾸었는데도 소실점 자리가 '+mem.v1.toFixed(1)+' 에서 '+mem.v2.toFixed(1)+' 로 그대로였습니다. 다시 고르세요.'};
     return {ok:true, msg:'판단했습니다 — <b>방향이 소실점을 정합니다.</b> θ 가 0 에 가까워지면 cot θ 가 끝없이 커져 소실점이 달아나는데, 그 달아난 자리를 무한원점이라 부릅니다.'};
   }}""")
 + note(336, '내가 한 걸음 · 내가 네 걸음 · 내가 판단한다',
 """  {t:'기록 — <b>x² − 2 = 0 · 시작점 2 · 1 걸음</b> 에서 오차의 지수를 적으세요',
   f:'시작점 = {0} · 걸음 = {1} · 오차의 지수(e 뒤의 수) = {2}',
   chk(got, r, mem){
     if(!r) return {ok:false, msg:'아직 화면 값이 없습니다.'};
     if(!/e-2$/.test(String(r[3]))) return {ok:false, msg:'방정식을 「x 제곱 − 2 = 0」 으로, 시작점을 2 로 두세요.'};
     const x0=noteNum(r[1]), n=noteNum(r[2]);
     const e=String(r[3]).match(/e([+-]?\\d+)/);
     if(Math.abs(x0-2)>0.01) return {ok:false, msg:'시작점을 2 로 맞추세요 (지금 '+r[1]+').'};
     if(n!==1) return {ok:false, msg:'걸음 수를 1 로 두세요 (지금 '+r[2]+').'};
     if(!e) return {ok:false, msg:'오차가 아직 지수로 적히지 않았습니다 — 걸음을 1 로 두세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-2)>0.01) return {ok:false, msg:'시작점은 2 입니다.'};
     if(Math.abs(got[1]-1)>0.1) return {ok:false, msg:'걸음은 1 입니다.'};
     if(Math.abs(got[2]-(+e[1]))>0.1) return {ok:false, msg:'화면의 오차가 '+r[3]+' 이니 지수는 '+e[1]+' 입니다.'};
     mem.e1=+e[1];
     return {ok:true, msg:'기록했습니다 — 한 걸음에 1.5 까지 왔습니다.'};
   }}""",
 """  {t:'생각 — <b>걸음 수를 4</b> 로 올려 다시 적으세요',
   f:'걸음 = {0} · 오차의 지수 = {1} · ①보다 지수가 몇 만큼 내려갔는가 = {2}',
   chk(got, r, mem){
     if(mem.e1===undefined) return {ok:false, msg:'① 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     if(!/e-12$/.test(String(r[3]))) return {ok:false, msg:'방정식을 「x 제곱 − 2 = 0」 으로, 시작점을 2 로, 걸음을 4 로 두세요.'};
     const n=noteNum(r[2]);
     const e=String(r[3]).match(/e([+-]?\\d+)/);
     if(n!==4) return {ok:false, msg:'걸음 수를 4 로 두세요 (지금 '+r[2]+').'};
     if(!e) return {ok:false, msg:'오차를 읽을 수 없습니다 — 시작점을 2 로 두세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-n)>0.1) return {ok:false, msg:'걸음은 '+r[2]+' 입니다.'};
     if(Math.abs(got[1]-(+e[1]))>0.1) return {ok:false, msg:'화면의 오차가 '+r[3]+' 이니 지수는 '+e[1]+' 입니다.'};
     if(Math.abs(got[2]-(mem.e1-(+e[1])))>0.1) return {ok:false, msg:'①의 '+mem.e1+' 에서 '+e[1]+' 을 빼 보세요.'};
     mem.e2=+e[1]; mem.ok2=true;
     return {ok:true, msg:'계산했습니다 — 세 걸음 더 가는 동안 지수가 '+(mem.e1-(+e[1]))+' 만큼 내려갔습니다.'};
   }}""",
 """  {t:'판단 — 수렴의 빠르기를 고르세요',
   f:'①의 오차 지수 = {0} · ②의 오차 지수 = {1} · x₀ = 2 에서 한 걸음 간 x₁ = {2}',
   opts:['접선을 따라가면 <b>맞는 자릿수가 걸음마다 대략 배로</b> 늘어난다 — 다만 시작점에서 접선이 거의 평평하면 멀리 튕겨 나가 헤맨다',
         '걸음마다 오차가 일정한 양씩 줄어든다',
         '시작점을 어디로 잡아도 걸음 수만 늘리면 반드시 해에 닿는다'],
   chk(got, r, mem, pick){
     if(!mem.ok2) return {ok:false, msg:'② 칸을 먼저 통과하세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-mem.e1)>0.1) return {ok:false, msg:'①에 적은 '+mem.e1+' 입니다.'};
     if(Math.abs(got[1]-mem.e2)>0.1) return {ok:false, msg:'②에 적은 '+mem.e2+' 입니다.'};
     if(Math.abs(got[2]-1.5)>0.02) return {ok:false, msg:'2 − 2 ÷ 4 를 계산하세요.'};
     if(pick!==0)
       return {ok:false, msg:'지수가 '+mem.e1+' 에서 '+mem.e2+' 로 한꺼번에 내려갔습니다. 일정한 양씩 줄어든 것일까요? 다시 고르세요.'};
     return {ok:true, msg:'판단했습니다 — <b>자릿수가 배로 늘어납니다.</b> 그래서 네 걸음이면 소수점 아래 열두 자리까지 맞습니다. 시작점을 0.25 로 두면 접선이 평평해 멀리 튕겨 나갔던 것도 함께 기억해 두십시오.'};
   }}""")
 + note(337, '내가 색칠하고 · 내가 줄이고 · 내가 판단한다',
 """  {t:'기록 — <b>시간대 4 개</b> 에서 겹친 짝과 실제로 쓰인 색의 수를 적으세요',
   f:'시간대 = {0} 개 · 겹친 짝 = {1} 쌍 · 실제로 쓰인 색의 수 = {2}',
   chk(got, r, mem){
     if(!r) return {ok:false, msg:'아직 화면 값이 없습니다.'};
     const k=noteNum(r[0]), bad=noteNum(r[1]);
     const used=new Set(String(r[2]).split('')).size;
     if(!(k>=4)) return {ok:false, msg:'시간대 수를 4 개로 두세요 — ②에서 줄여 볼 테니까요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-k)>0.1) return {ok:false, msg:'시간대는 '+r[0]+' 개입니다.'};
     if(Math.abs(got[1]-bad)>0.1) return {ok:false, msg:'겹친 짝은 '+r[1]+' 쌍입니다.'};
     if(Math.abs(got[2]-used)>0.1) return {ok:false, msg:'배정을 보면 서로 다른 교시가 '+used+' 가지입니다.'};
     mem.bad1=bad; mem.used1=used;
     return {ok:true, msg:'기록했습니다 — 4 개를 주었는데 실제로는 '+used+' 가지만 썼습니다.'};
   }}""",
 """  {t:'생각 — <b>시간대 2 개</b> 로 줄이고 겹친 짝을 다시 적으세요',
   f:'시간대 = {0} 개 · 겹친 짝 = {1} 쌍 · 겹침 없이 짤 수 있는 가장 작은 시간대 수 = {2}',
   chk(got, r, mem){
     if(mem.bad1===undefined) return {ok:false, msg:'① 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const k=noteNum(r[0]), bad=noteNum(r[1]);
     if(k!==2) return {ok:false, msg:'시간대 수를 2 개로 줄이세요 (지금 '+r[0]+').'};
     if(!(bad>0)) return {ok:false, msg:'겹친 짝이 보이지 않습니다 — 화면을 다시 확인하세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-2)>0.1) return {ok:false, msg:'시간대는 2 개입니다.'};
     if(Math.abs(got[1]-bad)>0.1) return {ok:false, msg:'겹친 짝은 '+r[1]+' 쌍입니다.'};
     if(Math.abs(got[2]-3)>0.1) return {ok:false, msg:'3 개로는 겹침이 0 이었고 2 개로는 '+r[1]+' 쌍이 남았습니다.'};
     mem.bad2=bad; mem.ok2=true;
     return {ok:true, msg:'계산했습니다 — 하나 줄이자 겹친 짝 '+r[1]+' 쌍이 생겼습니다.'};
   }}""",
 """  {t:'판단 — 더 줄일 수 없는 까닭을 고르세요',
   f:'①의 겹친 짝 = {0} 쌍 · ②의 겹친 짝 = {1} 쌍 · 서로 모두 이어진 세 과목이 있을 때 필요한 최소 시간대 수 = {2}',
   opts:['<b>서로 모두 이어진 세 꼭짓점(삼각형)</b> 이 있으면 색이 적어도 셋 필요하다 — 그래서 2 개로 맞추면 겹친 짝이 반드시 남는다',
         '색을 고르는 순서를 잘 바꾸면 2 개로도 겹침 없이 짤 수 있다',
         '꼭짓점이 여섯 개이므로 시간대도 여섯 개 필요하다'],
   chk(got, r, mem, pick){
     if(!mem.ok2) return {ok:false, msg:'② 칸을 먼저 통과하세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-mem.bad1)>0.1) return {ok:false, msg:'①에 적은 '+mem.bad1+' 입니다.'};
     if(Math.abs(got[1]-mem.bad2)>0.1) return {ok:false, msg:'②에 적은 '+mem.bad2+' 입니다.'};
     if(Math.abs(got[2]-3)>0.1) return {ok:false, msg:'셋이 서로 모두 이어지면 같은 시간을 쓸 수 있는 짝이 없습니다.'};
     if(pick!==0)
       return {ok:false, msg:'수학·영어·과학이 서로 모두 이어져 있습니다. 순서를 바꾸면 2 개로 될까요? 다시 고르세요.'};
     return {ok:true, msg:'판단했습니다 — <b>삼각형 하나가 색 셋을 강제합니다.</b> 시간표·주파수 배정·지도 색칠이 모두 이 문제입니다.'};
   }}""")
 + note(338, '내가 좁히고 · 내가 재고 · 내가 판단한다',
 """  {t:'기록 — <b>n = 2 · 살펴볼 점 0.5</b> 에서 그 점의 값과 밑변을 적으세요',
   f:'n = {0} · 그 점의 값 f<sub>n</sub>(x) = {1} · 밑변 = {2}',
   chk(got, r, mem){
     if(!r) return {ok:false, msg:'아직 화면 값이 없습니다.'};
     const n=noteNum(r[0]), x=noteNum(r[1]), v=noteNum(r[2]), w=noteNum(r[3]);
     if(!(n<=5)) return {ok:false, msg:'n 을 5 이하(2 쯤)로 두세요 — ②에서 키워 볼 테니까요.'};
     if(Math.abs(x-0.5)>0.01) return {ok:false, msg:'살펴볼 점을 0.5 로 맞추세요 (지금 '+r[1]+').'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-n)>0.1) return {ok:false, msg:'n 은 '+r[0]+' 입니다.'};
     if(Math.abs(got[1]-v)>0.01) return {ok:false, msg:'그 점의 값은 '+r[2]+' 입니다.'};
     if(Math.abs(got[2]-w)>0.01) return {ok:false, msg:'밑변은 '+r[3]+' 입니다.'};
     mem.v1=v; mem.n1=n;
     return {ok:true, msg:'기록했습니다 — 아직 봉우리가 이 점을 덮고 있습니다.'};
   }}""",
 """  {t:'생각 — <b>n 을 20 이상</b> 으로 올리고(점은 0.5 그대로) 다시 적으세요',
   f:'n = {0} · 그 점의 값 = {1} · 밑변 × 높이 ÷ 2 = {2}',
   chk(got, r, mem){
     if(mem.v1===undefined) return {ok:false, msg:'① 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const n=noteNum(r[0]), x=noteNum(r[1]), v=noteNum(r[2]), w=noteNum(r[3]);
     if(!(n>=20)) return {ok:false, msg:'n 이 '+r[0]+' 입니다 — 20 이상으로 올리세요.'};
     if(!(x>=0.2)) return {ok:false, msg:'살펴볼 점을 0.2 이상(0.5 쯤)에 두세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-n)>0.1) return {ok:false, msg:'n 은 '+r[0]+' 입니다.'};
     if(Math.abs(got[1]-v)>0.01) return {ok:false, msg:'그 점의 값은 '+r[2]+' 입니다.'};
     if(Math.abs(got[2]-w*n/2)>0.03) return {ok:false, msg:'밑변 '+r[3]+' 에 높이 '+r[0]+' 을 곱하고 2 로 나누세요.'};
     mem.v2=v; mem.ok2=true;
     return {ok:true, msg:'계산했습니다 — 이 점의 값은 0 인데 넓이는 1 그대로입니다.'};
   }}""",
 """  {t:'판단 — 극한과 적분의 순서를 고르세요',
   f:'①의 값 = {0} · ②의 값 = {1} · n = 10 일 때 봉우리 아래 넓이 = {2}',
   opts:['각 점에서 0 으로 가도 <b>넓이는 1 그대로</b> 다 — lim ∫ fₙ = 1 인데 ∫ lim fₙ = 0 이므로 극한과 적분의 순서를 함부로 바꿀 수 없다',
         '각 점에서 0 으로 가면 넓이도 반드시 0 으로 간다',
         'n 을 키우면 넓이도 n 에 비례해 커진다'],
   chk(got, r, mem, pick){
     if(!mem.ok2) return {ok:false, msg:'② 칸을 먼저 통과하세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-mem.v1)>0.01) return {ok:false, msg:'①에 적은 '+mem.v1+' 입니다.'};
     if(Math.abs(got[1]-mem.v2)>0.01) return {ok:false, msg:'②에 적은 '+mem.v2+' 입니다.'};
     if(Math.abs(got[2]-1)>0.05) return {ok:false, msg:'½ × 0.2 × 10 을 계산하세요.'};
     if(pick!==0)
       return {ok:false, msg:'②에서 그 점의 값은 0 이 되었는데 넓이는 1 이었습니다. 넓이도 0 으로 갔을까요? 다시 고르세요.'};
     return {ok:true, msg:'판단했습니다 — <b>함수는 사라지는데 넓이는 남습니다.</b> 극한을 먼저 하면 0, 적분을 먼저 하면 1 — 순서를 바꾸려면 따로 조건(고른 수렴 따위)이 필요합니다.'};
   }}""")
 + note(339, '내가 세고 · 내가 나누고 · 내가 판단한다',
 """  {t:'기록 — <b>나누지 않기</b> 에서 엔트로피를 적으세요',
   f:'나누기 전 엔트로피 = {0} 비트 · 정보 이득 = {1} · 사과는 모두 몇 개 = {2}',
   chk(got, r, mem){
     if(!r) return {ok:false, msg:'아직 화면 값이 없습니다.'};
     if(String(r[0]).indexOf('나누지')<0) return {ok:false, msg:'기준을 「나누지 않기」 로 두세요 — ②에서 나눠 볼 테니까요.'};
     const h=noteNum(r[1]), g=noteNum(r[2]);
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-h)>0.01) return {ok:false, msg:'화면의 엔트로피가 '+r[1]+' 입니다.'};
     if(Math.abs(got[1]-g)>0.01) return {ok:false, msg:'아직 나누지 않았으니 이득은 '+r[2]+' 입니다.'};
     if(Math.abs(got[2]-8)>0.1) return {ok:false, msg:'그림에서 동그라미(사과)의 수를 세어 보세요.'};
     mem.h1=h;
     return {ok:true, msg:'기록했습니다 — 반반이라 뒤섞임이 가장 심한 1 비트입니다.'};
   }}""",
 """  {t:'생각 — <b>색으로 나누기</b> 를 골라 나눈 뒤를 적으세요',
   f:'색으로 나눈 뒤 엔트로피 = {0} · 정보 이득 = {1} · 한 묶음에 든 사과의 개수 = {2}',
   chk(got, r, mem){
     if(mem.h1===undefined) return {ok:false, msg:'① 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     if(String(r[0]).indexOf('색')<0) return {ok:false, msg:'기준을 「색으로 나누기」 로 고르세요 (지금 '+r[0]+').'};
     const h=noteNum(r[1]), g=noteNum(r[2]);
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-h)>0.01) return {ok:false, msg:'나눈 뒤 엔트로피는 '+r[1]+' 입니다.'};
     if(Math.abs(got[1]-g)>0.01) return {ok:false, msg:'정보 이득은 '+r[2]+' 입니다.'};
     if(Math.abs(got[2]-7)>0.1) return {ok:false, msg:'왼쪽 묶음에서 동그라미를 세어 보세요.'};
     mem.g2=g; mem.ok2=true;
     return {ok:true, msg:'계산했습니다 — 한 번 나누자 '+r[2]+' 비트를 얻었습니다.'};
   }}""",
 """  {t:'판단 — 화면을 <b>크기로 나누기</b> 로 바꾸고 고르세요',
   f:'①의 엔트로피 = {0} · ②(색)의 정보 이득 = {1} · 지금 화면(크기)의 정보 이득 = {2}',
   opts:['같은 자료라도 <b>어느 기준으로 묻느냐에 따라 얻는 정보가 다르다</b> — 결정트리는 이득이 가장 큰 질문부터 쓰고, 이득이 0 인 질문은 아예 쓰지 않는다',
         '자료를 나누기만 하면 어떤 기준이든 뒤섞임이 줄어든다',
         '묶음의 크기가 같게 나누는 기준이 가장 좋은 기준이다'],
   chk(got, r, mem, pick){
     if(!mem.ok2) return {ok:false, msg:'② 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     if(String(r[0]).indexOf('크기')<0) return {ok:false, msg:'기준을 「크기로 나누기」 로 바꾸고 다시 누르세요.'};
     const g=noteNum(r[2]);
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-mem.h1)>0.01) return {ok:false, msg:'①에 적은 '+mem.h1+' 입니다.'};
     if(Math.abs(got[1]-mem.g2)>0.01) return {ok:false, msg:'②에 적은 '+mem.g2+' 입니다.'};
     if(Math.abs(got[2]-g)>0.01) return {ok:false, msg:'화면의 정보 이득이 '+r[2]+' 입니다.'};
     if(pick!==0)
       return {ok:false, msg:'크기로도 똑같이 두 묶음으로 나누었는데 이득이 '+r[2]+' 였습니다. 나누기만 하면 줄어들까요? 다시 고르세요.'};
     return {ok:true, msg:'판단했습니다 — <b>묻는 방식이 얻는 정보를 정합니다.</b> 크기로 나누면 양쪽이 또 반반이어서 뒤섞임이 그대로였습니다.'};
   }}""")
 + note(340, '내가 0 을 만들고 · 내가 되살리고 · 내가 판단한다',
 """  {t:'기록 — <b>등장 횟수 0 · α = 0</b> 에서 확률을 적으세요',
   f:'등장 횟수 = {0} 회 · α = {1} · P(축제) = {2}',
   chk(got, r, mem){
     if(!r) return {ok:false, msg:'아직 화면 값이 없습니다.'};
     const c=noteNum(r[0]), a=noteNum(r[1]), p=noteNum(r[2]), pr=noteNum(r[3]);
     if(Math.abs(c)>0.1) return {ok:false, msg:'등장 횟수를 0 으로 내리세요 (지금 '+r[0]+').'};
     if(Math.abs(a)>0.01) return {ok:false, msg:'α 를 0 으로 두세요 — ②에서 올려 볼 테니까요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0])>0.1) return {ok:false, msg:'등장 횟수는 0 입니다.'};
     if(Math.abs(got[1])>0.01) return {ok:false, msg:'α 는 0 입니다.'};
     if(Math.abs(got[2]-p)>0.0005) return {ok:false, msg:'화면의 확률이 '+r[2]+' 입니다.'};
     mem.p1=p; mem.pr1=pr;
     return {ok:true, msg:'기록했습니다 — 한 단어가 0 이 되자 곱 전체가 0 이 되었습니다.'};
   }}""",
 """  {t:'생각 — 횟수는 0 그대로 두고 <b>α 를 1</b> 로 올려 다시 적으세요',
   f:'α = {0} · P(축제) = {1} · 분모 = {2}',
   chk(got, r, mem){
     if(mem.p1===undefined) return {ok:false, msg:'① 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const c=noteNum(r[0]), a=noteNum(r[1]), p=noteNum(r[2]);
     if(Math.abs(c)>0.1) return {ok:false, msg:'등장 횟수는 0 으로 두세요 — 이번에는 α 만 올립니다.'};
     if(!(a>=0.5)) return {ok:false, msg:'α 가 '+r[1]+' 입니다 — 1 로 올리세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-a)>0.01) return {ok:false, msg:'α 는 '+r[1]+' 입니다.'};
     if(Math.abs(got[1]-p)>0.0005) return {ok:false, msg:'화면의 확률이 '+r[2]+' 입니다.'};
     if(Math.abs(got[2]-(60+a*40))>0.5) return {ok:false, msg:'분모는 60 + α × 40 입니다.'};
     mem.p2=p; mem.ok2=true;
     return {ok:true, msg:'계산했습니다 — 0 이던 확률이 '+r[2]+' 로 살아났습니다.'};
   }}""",
 """  {t:'판단 — 보정의 뜻을 고르세요',
   f:'①의 P(축제) = {0} · ②의 P(축제) = {1} · ②의 세 확률의 곱이 0 이 아니면 1, 0 이면 0 → {2}',
   opts:['<b>본 적 없다는 것과 있을 수 없다는 것은 다르다</b> — 아주 작은 몫을 나눠 주어 곱이 0 이 되는 것을 막아야 다른 단어가 모아 둔 증거가 묻히지 않는다',
         '학습 자료에 없던 단어는 확률 0 으로 두는 것이 정확하다',
         'α 를 크게 할수록 분류가 늘 좋아진다'],
   chk(got, r, mem, pick){
     if(!mem.ok2) return {ok:false, msg:'② 칸을 먼저 통과하세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-mem.p1)>0.0005) return {ok:false, msg:'①에 적은 '+mem.p1+' 입니다.'};
     if(Math.abs(got[1]-mem.p2)>0.0005) return {ok:false, msg:'②에 적은 '+mem.p2+' 입니다.'};
     if(Math.abs(got[2]-1)>0.1) return {ok:false, msg:'②에서는 곱이 0 이 아니었으니 1 입니다.'};
     if(pick!==0)
       return {ok:false, msg:'한 단어를 0 으로 두자 다른 두 단어의 증거가 모두 지워졌습니다. 그것이 정확한 판단일까요? 다시 고르세요.'};
     return {ok:true, msg:'판단했습니다 — <b>0 을 막는 아주 작은 몫</b> 이 라플라스 보정입니다. 다만 α 를 너무 크게 하면 모든 단어가 비슷해져 자료에서 배운 차이가 흐려집니다.'};
   }}""")
)
