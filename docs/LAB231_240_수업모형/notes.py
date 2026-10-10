# -*- coding: utf-8 -*-
"""LAB 231~240 탐구 노트 — 기록 → 생각 → 판단. 판정은 화면의 read() 값으로만 한다."""


def note(no, head, c1, c2, c3):
    return "\n %d:{ h:'%s',\n  c:[\n%s,\n%s,\n%s\n ]},\n" % (no, head, c1, c2, c3)


NOTES = (
 note(231, '내가 빼고 · 내가 되돌리고 · 내가 판단한다',
 """  {t:'기록 — <b>창·문 빼기를 켠 채</b> 지금 값을 적으세요',
   f:'필요 넓이 = {0} m² · 통 수 = {1} 통 · 통 수 × 12 − 필요 넓이 = {2} m²',
   chk(got, r, mem){
     if(!r) return {ok:false, msg:'아직 화면 값이 없습니다.'};
     const w=noteNum(r[0]), d=noteNum(r[1]), h=noteNum(r[2]), ar=noteNum(r[3]), n=noteNum(r[4]);
     const wall=2*(w+d)*h;
     if(Math.abs(ar/wall-Math.round(ar/wall))<0.01)
       return {ok:false, msg:'창·문을 빼지 않은 것 같습니다 — 체크 상자를 켜세요.'};
     if(![0,1,2].every(k=>isFinite(got[k]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-ar)>0.06) return {ok:false, msg:'필요 넓이는 '+r[3]+' m² 입니다.'};
     if(Math.abs(got[1]-n)>0.5) return {ok:false, msg:'통 수는 '+r[4]+' 통입니다.'};
     if(Math.abs(got[2]-(n*12-ar))>0.12) return {ok:false, msg:n+' × 12 에서 '+r[3]+' 를 빼 보세요.'};
     mem.a1=ar; mem.n1=n;
     return {ok:true, msg:'기록했습니다 — '+n+'통을 사면 '+(n*12-ar).toFixed(2)+' m² 어치가 남습니다. 창·문을 빼지 않으면 어떻게 될까요?'};
   }}""",
 """  {t:'생각 — <b>창·문 빼기를 꺼서</b> 늘어난 넓이를 구하세요',
   f:'필요 넓이 = {0} m² · 통 수 = {1} 통 · ①에서 늘어난 넓이 = {2} m²',
   chk(got, r, mem){
     if(mem.a1===undefined) return {ok:false, msg:'① 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const w=noteNum(r[0]), d=noteNum(r[1]), h=noteNum(r[2]), ar=noteNum(r[3]), n=noteNum(r[4]);
     const wall=2*(w+d)*h;
     if(!(Math.abs(ar/wall-Math.round(ar/wall))<0.01))
       return {ok:false, msg:'아직 창·문을 빼고 있습니다 — 체크 상자를 끄세요.'};
     if(!(ar>mem.a1)) return {ok:false, msg:'넓이가 ①의 '+mem.a1+' 보다 커져야 합니다 — 방 크기는 그대로 두세요.'};
     if(![0,1,2].every(k=>isFinite(got[k]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-ar)>0.06) return {ok:false, msg:'필요 넓이는 '+r[3]+' m² 입니다.'};
     if(Math.abs(got[1]-n)>0.5) return {ok:false, msg:'통 수는 '+r[4]+' 통입니다.'};
     if(Math.abs(got[2]-(ar-mem.a1))>0.12) return {ok:false, msg:r[3]+' 에서 ①의 '+mem.a1+' 를 빼 보세요.'};
     if(Math.abs((ar-mem.a1)/5.4-Math.round((ar-mem.a1)/5.4))>0.02)
       return {ok:false, msg:'방 크기를 ①과 같게 두세요 — 늘어난 넓이가 창·문 5.4 m² 의 배수여야 합니다.'};
     mem.a2=ar; mem.n2=n; mem.ok2=true;
     return {ok:true, msg:'계산했습니다 — 창·문 몫만큼 넓이가 늘었고 통 수는 '+mem.n1+' 에서 '+r[4]+' 가 되었습니다.'};
   }}""",
 """  {t:'판단 — <b>남는 양이 7 m² 를 넘는 자리</b> 를 찾은 뒤 고르세요',
   f:'필요 넓이 = {0} m² · 통 수 = {1} 통 · 남는 양 = {2} m²',
   opts:['넓이는 실수지만 통은 자연수라서 <b>반드시 올림</b> 해야 한다 — 그래서 마지막 통을 조금만 쓰고 남기는 일이 생긴다',
         '소수 부분이 0.5 보다 작으면 내림해도 된다',
         '창·문을 빼지 않아도 통 수는 달라지지 않는다'],
   chk(got, r, mem, pick){
     if(!mem.ok2) return {ok:false, msg:'② 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const ar=noteNum(r[3]), n=noteNum(r[4]), left=n*12-ar;
     if(!(left>=7)) return {ok:false, msg:'남는 양이 '+left.toFixed(2)+' m² 입니다 — 칠하는 횟수나 방 크기를 바꿔 7 m² 를 넘겨 보세요.'};
     if(![0,1,2].every(k=>isFinite(got[k]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-ar)>0.06) return {ok:false, msg:'필요 넓이는 '+r[3]+' m² 입니다.'};
     if(Math.abs(got[1]-n)>0.5) return {ok:false, msg:'통 수는 '+r[4]+' 통입니다.'};
     if(Math.abs(got[2]-left)>0.12) return {ok:false, msg:n+' × 12 에서 '+r[3]+' 를 빼 보세요.'};
     if(pick!==0)
       return {ok:false, msg:'필요한 양이 '+(ar/12).toFixed(2)+'통인데 '+n+'통을 샀습니다. 왜 '+(n-1)+'통으로는 안 될까요? 다시 고르세요.'};
     return {ok:true, msg:'판단했습니다 — <b>나눗셈의 몫이 소수여도 살 수 있는 것은 자연수뿐입니다.</b> 그래서 올림이 필요하고, 그만큼 남는 양이 생깁니다 — 자재 발주에서 늘 따라다니는 셈입니다.'};
   }}""")
 +
 note(232, '내가 늘리고 · 내가 다가가고 · 내가 판단한다',
 """  {t:'기록 — <b>항을 적게</b> 두어 φ 와의 차가 0.01 보다 크게 하고 적으세요',
   f:'항 수 = {0} · 비 = {1} · φ 와의 차 = {2}',
   chk(got, r, mem){
     if(!r) return {ok:false, msg:'아직 화면 값이 없습니다.'};
     const n=noteNum(r[1]), ra=noteNum(r[3]), d=noteNum(r[4]);
     if(!(d>0.01)) return {ok:false, msg:'차가 '+r[4]+' 로 이미 작습니다 — 항 수를 줄이세요.'};
     if(![0,1,2].every(k=>isFinite(got[k]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-n)>0.5) return {ok:false, msg:'항 수는 '+r[1]+' 입니다.'};
     if(Math.abs(got[1]-ra)>0.000005) return {ok:false, msg:'비는 '+r[3]+' 입니다.'};
     if(Math.abs(got[2]-d)>0.000005) return {ok:false, msg:'φ 와의 차는 '+r[4]+' 입니다.'};
     mem.d1=d; mem.r1=ra;
     return {ok:true, msg:'기록했습니다 — 아직 φ 에서 '+r[4]+' 만큼 떨어져 있습니다. 항을 늘려 봅시다.'};
   }}""",
 """  {t:'생각 — <b>항을 12</b> 로 늘리고 다시 적으세요',
   f:'항 수 = {0} · 비 = {1} · φ 와의 차 = {2}',
   chk(got, r, mem){
     if(mem.d1===undefined) return {ok:false, msg:'① 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const n=noteNum(r[1]), ra=noteNum(r[3]), d=noteNum(r[4]);
     if(!(d<0.001)) return {ok:false, msg:'차가 '+r[4]+' 입니다 — 항 수를 12 로 늘리세요.'};
     if(![0,1,2].every(k=>isFinite(got[k]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-n)>0.5) return {ok:false, msg:'항 수는 '+r[1]+' 입니다.'};
     if(Math.abs(got[1]-ra)>0.000005) return {ok:false, msg:'비는 '+r[3]+' 입니다.'};
     if(Math.abs(got[2]-d)>0.000005) return {ok:false, msg:'φ 와의 차는 '+r[4]+' 입니다.'};
     if(!(d<mem.d1)) return {ok:false, msg:'①의 '+mem.d1+' 보다 작아져야 합니다.'};
     mem.d2=d; mem.r2=ra; mem.ok2=true;
     return {ok:true, msg:'계산했습니다 — 차가 '+mem.d1+' 에서 '+r[4]+' 로 줄었습니다. 이 비에는 어떤 성질이 있을까요?'};
   }}""",
 """  {t:'판단 — 지금 비를 제곱해 보고 고르세요',
   f:'비 = {0} · 비 × 비 = {1} · 비 × 비 − 비 = {2}',
   opts:['φ 는 <b>x² = x + 1</b> 의 양의 근이다 — 그래서 제곱에서 자기 자신을 빼면 1 이 되고, 어떤 두 수로 시작해도 이웃한 두 수의 비는 이 한 수로 모인다',
         'φ 는 피보나치 수열에서만 나오는 특별한 수라 식으로는 구할 수 없다',
         '시작하는 두 수를 바꾸면 비가 다른 수로 간다'],
   chk(got, r, mem, pick){
     if(!mem.ok2) return {ok:false, msg:'② 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const ra=noteNum(r[3]), d=noteNum(r[4]);
     if(!(d<0.001)) return {ok:false, msg:'②와 같이 항을 12 로 두세요 (지금 차 '+r[4]+').'};
     if(![0,1,2].every(k=>isFinite(got[k]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-ra)>0.000005) return {ok:false, msg:'비는 '+r[3]+' 입니다.'};
     if(Math.abs(got[1]-ra*ra)>0.002) return {ok:false, msg:r[3]+' 를 두 번 곱해 보세요.'};
     if(Math.abs(got[2]-1)>0.01) return {ok:false, msg:'제곱에서 비를 빼 보세요 — 1 에 아주 가까운 수가 나옵니다.'};
     if(pick!==0)
       return {ok:false, msg:'비를 제곱해 자기 자신을 뺐더니 1 이 나왔습니다. 그러면 이 수는 어떤 방정식의 근일까요? 다시 고르세요.'};
     return {ok:true, msg:'판단했습니다 — <b>φ² = φ + 1</b> 이 전부입니다. 이 한 줄에서 황금사각형의 자기닮음도, 피보나치 비의 수렴도 모두 나옵니다.'};
   }}""")
 +
 note(233, '내가 모으고 · 내가 바꾸고 · 내가 판단한다',
 """  {t:'기록 — <b>평면을 채울 수 있는 도형</b> 을 골라 꼭 360° 가 되게 모으고 적으세요',
   f:'정 {0} 각형 · 한 내각 = {1} ° · 모은 각의 합 = {2} °',
   chk(got, r, mem){
     if(!r) return {ok:false, msg:'아직 화면 값이 없습니다.'};
     const k=noteNum(r[0]), ang=noteNum(r[1]), cnt=noteNum(r[2]), tot=noteNum(r[3]);
     if(String(r[4])!=='가능') return {ok:false, msg:'지금 도형은 한 종류로 채울 수 없습니다 — 삼각형·사각형·육각형 가운데 고르세요.'};
     if(Math.abs(tot-360)>0.01) return {ok:false, msg:'모은 각이 '+r[3]+' 입니다 — 개수를 바꿔 360° 로 맞추세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-k)>0.5) return {ok:false, msg:'도형은 '+r[0]+' 입니다.'};
     if(Math.abs(got[1]-ang)>0.02) return {ok:false, msg:'한 내각은 '+r[1]+' 입니다.'};
     if(Math.abs(got[2]-tot)>0.02) return {ok:false, msg:'모은 각의 합은 '+r[3]+' 입니다.'};
     mem.k1=k; mem.ang1=ang; mem.cnt1=cnt;
     return {ok:true, msg:'기록했습니다 — '+r[0]+' '+cnt+'개로 꼭 360° 입니다. 정오각형은 어떨까요?'};
   }}""",
 """  {t:'생각 — <b>정오각형 3개</b> 로 바꾸고, 모자란 각을 구하세요',
   f:'한 내각 = {0} ° · 3개를 모으면 {1} ° · 360 에서 모자란 각 = {2} °',
   chk(got, r, mem){
     if(mem.ang1===undefined) return {ok:false, msg:'① 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const k=noteNum(r[0]), ang=noteNum(r[1]), cnt=noteNum(r[2]), tot=noteNum(r[3]);
     if(k!==5) return {ok:false, msg:'지금은 '+r[0]+' 입니다 — 정오각형으로 바꾸세요.'};
     if(cnt!==3) return {ok:false, msg:'개수가 '+r[2]+' 입니다 — 3개로 맞추세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-ang)>0.02) return {ok:false, msg:'한 내각은 '+r[1]+' 입니다.'};
     if(Math.abs(got[1]-tot)>0.02) return {ok:false, msg:'모은 각의 합은 '+r[3]+' 입니다.'};
     if(Math.abs(got[2]-(360-tot))>0.02) return {ok:false, msg:'360 에서 '+r[3]+' 를 빼 보세요.'};
     mem.ok2=true;
     return {ok:true, msg:'계산했습니다 — '+(360-tot).toFixed(2)+'° 가 남습니다. 넷을 모으면 넘쳐 버립니다.'};
   }}""",
 """  {t:'판단 — 360 ÷ 내각 을 구해 보고 고르세요',
   f:'한 내각 = {0} ° · 360 ÷ 내각 = {1} · 자연수이면 1, 아니면 0 → {2}',
   opts:['한 꼭짓점에 모은 내각의 합이 <b>꼭 360° 여야</b> 하므로 360 ÷ 내각이 자연수여야 한다 — 정다각형 가운데 그런 것은 삼각형·사각형·육각형뿐이다',
         '정다각형이면 어느 것이든 평면을 채울 수 있다',
         '변이 많을수록 평면을 잘 채운다'],
   chk(got, r, mem, pick){
     if(!mem.ok2) return {ok:false, msg:'② 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const ang=noteNum(r[1]), okTile=String(r[4])==='가능';
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-ang)>0.02) return {ok:false, msg:'한 내각은 '+r[1]+' 입니다.'};
     if(Math.abs(got[1]-360/ang)>0.01) return {ok:false, msg:'360 을 '+r[1]+' 로 나누어 보세요.'};
     if(Math.abs(got[2]-(okTile?1:0))>0.01) return {ok:false, msg:'그 값이 자연수인지 보세요 — 화면은 «'+r[4]+'» 라고 합니다.'};
     if(pick!==0)
       return {ok:false, msg:'정'+mem.k1+'각형은 '+mem.cnt1+'개로 꼭 맞았는데 정오각형은 36° 가 남았습니다. 무엇이 자연수여야 할까요? 다시 고르세요.'};
     return {ok:true, msg:'판단했습니다 — <b>360 ÷ 내각이 자연수인가</b> 가 전부입니다. 한 내각은 180(n − 2) ÷ n 이고, 이것이 360 의 약수가 되는 n 은 3 · 4 · 6 뿐입니다.'};
   }}""")
 +
 note(234, '내가 늘리고 · 내가 줄이고 · 내가 판단한다',
 """  {t:'기록 — <b>코흐 눈송이를 6번</b> 반복하고 적으세요',
   f:'반복 = {0} 번 · 둘레 배율 = {1} · 4 ÷ 3 을 여섯 번 곱한 값 = {2}',
   chk(got, r, mem){
     if(!r) return {ok:false, msg:'아직 화면 값이 없습니다.'};
     const n=noteNum(r[1]), g=noteNum(r[2]);
     if(String(r[0])!=='코흐') return {ok:false, msg:'지금 도형은 «'+r[0]+'» 입니다 — 코흐 눈송이로 바꾸세요.'};
     if(n!==6) return {ok:false, msg:'반복이 '+r[1]+' 번입니다 — 6번으로 맞추세요.'};
     if(![0,1,2].every(k=>isFinite(got[k]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-n)>0.5) return {ok:false, msg:'반복은 '+r[1]+' 번입니다.'};
     if(Math.abs(got[1]-g)>0.0005) return {ok:false, msg:'둘레 배율은 '+r[2]+' 입니다.'};
     if(Math.abs(got[2]-Math.pow(4/3,6))>0.01) return {ok:false, msg:'4 ÷ 3 을 여섯 번 곱해 보세요 — 화면의 '+r[2]+' 와 같아야 합니다.'};
     mem.g1=g;
     return {ok:true, msg:'기록했습니다 — 여섯 번에 '+r[2]+' 배입니다. 넓이가 줄어드는 쪽도 봅시다.'};
   }}""",
 """  {t:'생각 — <b>시에르핀스키 삼각형을 6번</b> 반복하고 적으세요',
   f:'반복 = {0} 번 · 남은 넓이 = {1} · 3 ÷ 4 를 여섯 번 곱한 값 = {2}',
   chk(got, r, mem){
     if(mem.g1===undefined) return {ok:false, msg:'① 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const n=noteNum(r[1]), a=noteNum(r[3]);
     if(String(r[0])!=='시에르핀스키') return {ok:false, msg:'지금 도형은 «'+r[0]+'» 입니다 — 시에르핀스키 삼각형으로 바꾸세요.'};
     if(n!==6) return {ok:false, msg:'반복이 '+r[1]+' 번입니다 — 6번으로 맞추세요.'};
     if(![0,1,2].every(k=>isFinite(got[k]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-n)>0.5) return {ok:false, msg:'반복은 '+r[1]+' 번입니다.'};
     if(Math.abs(got[1]-a)>0.0005) return {ok:false, msg:'남은 넓이는 '+r[3]+' 입니다.'};
     if(Math.abs(got[2]-Math.pow(3/4,6))>0.005) return {ok:false, msg:'3 ÷ 4 를 여섯 번 곱해 보세요 — 화면의 '+r[3]+' 와 같아야 합니다.'};
     mem.a2=a; mem.ok2=true;
     return {ok:true, msg:'계산했습니다 — 둘레는 '+mem.g1+' 배로 늘고 넓이는 '+r[3]+' 배로 줄었습니다. 공비가 다릅니다.'};
   }}""",
 """  {t:'판단 — <b>코흐로 되돌린 뒤</b> 차원을 확인하고 고르세요',
   f:'차원 = {0} · log 4 ÷ log 3 을 손으로 = {1} · 1 과 2 사이이면 1 → {2}',
   opts:['반복마다 같은 비율을 곱하는 <b>등비수열</b> 이라 공비가 1 보다 크면 끝없이 커지고 작으면 0 으로 간다 — 그래서 둘레는 무한인데 넓이는 유한할 수 있다',
         '둘레가 무한이면 넓이도 반드시 무한이다',
         '차원은 언제나 1 이나 2 같은 정수여야 한다'],
   chk(got, r, mem, pick){
     if(!mem.ok2) return {ok:false, msg:'② 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const dm=noteNum(r[4]);
     if(String(r[0])!=='코흐') return {ok:false, msg:'코흐 눈송이로 되돌리세요 (지금 «'+r[0]+'»).'};
     if(![0,1,2].every(k=>isFinite(got[k]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-dm)>0.0005) return {ok:false, msg:'차원은 '+r[4]+' 입니다.'};
     if(Math.abs(got[1]-Math.log(4)/Math.log(3))>0.005) return {ok:false, msg:'log 4 를 log 3 으로 나누어 보세요.'};
     if(Math.abs(got[2]-1)>0.01) return {ok:false, msg:'그 값이 1 과 2 사이인지 보세요.'};
     if(pick!==0)
       return {ok:false, msg:'둘레는 '+mem.g1+' 배로 늘었는데 시에르핀스키의 넓이는 '+mem.a2+' 배로 줄었습니다. 두 경우의 공비는 무엇이었을까요? 다시 고르세요.'};
     return {ok:true, msg:'판단했습니다 — <b>자기닮음은 등비수열입니다.</b> 공비가 4/3 이면 발산하고 3/4 이면 0 으로 가며, 그 사이에서 차원이 정수가 아닌 도형이 생깁니다.'};
   }}""")
 +
 note(235, '내가 맞추고 · 내가 바꾸고 · 내가 판단한다',
 """  {t:'기록 — <b>완전 5도</b> 에서 <b>반음 수를 7</b> 로 맞추고 적으세요',
   f:'순정률 = {0} · 평균율 = {1} · 센트 차 = {2}',
   chk(got, r, mem){
     if(!r) return {ok:false, msg:'아직 화면 값이 없습니다.'};
     const ju=noteNum(r[2]), eq=noteNum(r[3]), c=noteNum(r[4]);
     if(Math.abs(ju-1.5)>0.001) return {ok:false, msg:'지금 음정은 «'+r[0]+'» 입니다 — 완전 5도로 바꾸세요.'};
     if(Math.abs(eq-1.498307)>0.001) return {ok:false, msg:'평균율이 '+r[3]+' 입니다 — 반음 수를 7 로 맞추세요.'};
     if(![0,1,2].every(k=>isFinite(got[k]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-ju)>0.000005) return {ok:false, msg:'순정률은 '+r[2]+' 입니다.'};
     if(Math.abs(got[1]-eq)>0.000005) return {ok:false, msg:'평균율은 '+r[3]+' 입니다.'};
     if(Math.abs(got[2]-c)>0.02) return {ok:false, msg:'센트 차는 '+r[4]+' 입니다.'};
     mem.c1=c;
     return {ok:true, msg:'기록했습니다 — 두 방식이 '+r[4]+' 센트밖에 다르지 않습니다. 다른 음정은 어떨까요?'};
   }}""",
 """  {t:'생각 — <b>장 3도</b> 에서 <b>반음 수를 4</b> 로 맞추고 적으세요',
   f:'순정률 = {0} · 평균율 = {1} · 센트 차 = {2}',
   chk(got, r, mem){
     if(mem.c1===undefined) return {ok:false, msg:'① 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const ju=noteNum(r[2]), eq=noteNum(r[3]), c=noteNum(r[4]);
     if(Math.abs(ju-1.25)>0.001) return {ok:false, msg:'지금 음정은 «'+r[0]+'» 입니다 — 장 3도로 바꾸세요.'};
     if(Math.abs(eq-1.259921)>0.001) return {ok:false, msg:'평균율이 '+r[3]+' 입니다 — 반음 수를 4 로 맞추세요.'};
     if(![0,1,2].every(k=>isFinite(got[k]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-ju)>0.000005) return {ok:false, msg:'순정률은 '+r[2]+' 입니다.'};
     if(Math.abs(got[1]-eq)>0.000005) return {ok:false, msg:'평균율은 '+r[3]+' 입니다.'};
     if(Math.abs(got[2]-c)>0.02) return {ok:false, msg:'센트 차는 '+r[4]+' 입니다.'};
     mem.c2=c; mem.ok2=true;
     return {ok:true, msg:'계산했습니다 — 장 3도는 '+r[4]+' 센트나 어긋납니다. 완전 5도보다 훨씬 큽니다.'};
   }}""",
 """  {t:'판단 — 두 센트 차를 나란히 두고 고르세요',
   f:'①의 센트 차 = {0} · ②의 센트 차 = {1} · 1200 ÷ 12 = {2} 센트',
   opts:['평균율은 한 옥타브를 <b>2^(1/12) 로 12등분</b> 한 것이라 순정률의 단순한 분수와 꼭 맞지 않는다 — 어느 조로 옮겨도 쓸 수 있게 조금씩 어긋나기로 한 타협이다',
         '평균율과 순정률은 모든 음정에서 정확히 같다',
         '센트는 진동수의 차를 그대로 센 눈금이다'],
   chk(got, r, mem, pick){
     if(!mem.ok2) return {ok:false, msg:'② 칸을 먼저 통과하세요.'};
     if(![0,1,2].every(k=>isFinite(got[k]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-mem.c1)>0.02) return {ok:false, msg:'①에 적은 '+mem.c1+' 입니다.'};
     if(Math.abs(got[1]-mem.c2)>0.02) return {ok:false, msg:'②에 적은 '+mem.c2+' 입니다.'};
     if(Math.abs(got[2]-100)>0.5) return {ok:false, msg:'1200 을 12 로 나누어 보세요.'};
     if(pick!==0)
       return {ok:false, msg:'완전 5도는 '+mem.c1+' 센트, 장 3도는 '+mem.c2+' 센트 어긋났습니다. 평균율은 무엇을 똑같이 나눈 것일까요? 다시 고르세요.'};
     return {ok:true, msg:'판단했습니다 — <b>어울림은 진동수 비의 단순함입니다.</b> 평균율은 그 단순한 분수를 조금씩 포기하는 대신 어느 조로도 옮길 수 있게 만든 약속이고, 센트는 그 어긋남을 로그로 재는 눈금입니다.'};
   }}""")
 +
 note(236, '내가 세우고 · 내가 늘리고 · 내가 판단한다',
 """  {t:'기록 — <b>기둥을 6개</b> 로 두고 적으세요',
   f:'첫 높이 = {0} · 마지막 높이 = {1} · 비 = {2}',
   chk(got, r, mem){
     if(!r) return {ok:false, msg:'아직 화면 값이 없습니다.'};
     const n=noteNum(r[0]), gp=noteNum(r[1]), h1=noteNum(r[2]), hn=noteNum(r[3]), ra=noteNum(r[4]);
     if(n!==6) return {ok:false, msg:'기둥이 '+r[0]+'개입니다 — 6개로 맞추세요.'};
     if(![0,1,2].every(k=>isFinite(got[k]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-h1)>0.2) return {ok:false, msg:'첫 높이는 '+r[2]+' 입니다.'};
     if(Math.abs(got[1]-hn)>0.2) return {ok:false, msg:'마지막 높이는 '+r[3]+' 입니다.'};
     if(Math.abs(got[2]-ra)>0.01) return {ok:false, msg:'비는 '+r[4]+' 입니다.'};
     mem.n1=n; mem.ra1=ra; mem.gp=gp;
     return {ok:true, msg:'기록했습니다 — 첫 기둥이 마지막보다 '+r[4]+' 배 큽니다. 기둥을 더 세워 봅시다.'};
   }}""",
 """  {t:'생각 — <b>기둥을 12개</b> 로 늘리고, 거리의 비를 손으로 구하세요',
   f:'기둥 수 = {0} · 화면 높이의 비 = {1} · (4 + (기둥수 − 1) × 간격) ÷ 4 = {2}',
   chk(got, r, mem){
     if(mem.ra1===undefined) return {ok:false, msg:'① 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const n=noteNum(r[0]), gp=noteNum(r[1]), ra=noteNum(r[4]);
     if(n!==12) return {ok:false, msg:'기둥이 '+r[0]+'개입니다 — 12개로 늘리세요.'};
     if(![0,1,2].every(k=>isFinite(got[k]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-n)>0.5) return {ok:false, msg:'기둥 수는 '+r[0]+' 입니다.'};
     if(Math.abs(got[1]-ra)>0.01) return {ok:false, msg:'비는 '+r[4]+' 입니다.'};
     if(Math.abs(got[2]-(4+(n-1)*gp)/4)>0.02)
       return {ok:false, msg:'간격이 '+r[1]+' 이니 마지막 기둥까지의 거리를 먼저 구하세요.'};
     mem.ra2=ra; mem.ok2=true;
     return {ok:true, msg:'계산했습니다 — 손으로 구한 거리의 비가 화면의 높이의 비와 같습니다.'};
   }}""",
 """  {t:'판단 — 두 비를 나란히 두고 고르세요',
   f:'화면 높이의 비 = {0} · 거리의 비 = {1} · 두 값이 같으면 1, 다르면 0 → {2}',
   opts:['화면에 맺히는 크기는 <b>거리에 반비례</b> 한다 — 그래서 높이의 비가 거리의 비와 같아지고, 같은 간격으로 세워도 뒤로 갈수록 좁고 작아 보인다',
         '화면 크기는 거리에 정비례한다',
         '소실점은 기둥 개수를 늘리면 움직인다'],
   chk(got, r, mem, pick){
     if(!mem.ok2) return {ok:false, msg:'② 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const n=noteNum(r[0]), gp=noteNum(r[1]), ra=noteNum(r[4]);
     if(![0,1,2].every(k=>isFinite(got[k]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-ra)>0.01) return {ok:false, msg:'화면 높이의 비는 '+r[4]+' 입니다.'};
     if(Math.abs(got[1]-(4+(n-1)*gp)/4)>0.02) return {ok:false, msg:'거리의 비를 다시 구해 보세요.'};
     if(Math.abs(got[2]-1)>0.01) return {ok:false, msg:'두 값을 견주세요.'};
     if(pick!==0)
       return {ok:false, msg:'기둥 6개일 때 '+mem.ra1+' , 12개일 때 '+mem.ra2+' 였고 둘 다 거리의 비와 같았습니다. 크기와 거리는 어떤 관계일까요? 다시 고르세요.'};
     return {ok:true, msg:'판단했습니다 — <b>원근법은 거리의 역수입니다.</b> 같은 간격이 좁아 보이는 것도, 평행선이 한 점에서 만나 보이는 것도 모두 1/거리 에서 나옵니다.'};
   }}""")
 +
 note(237, '내가 돌리고 · 내가 비추고 · 내가 판단한다',
 """  {t:'기록 — <b>거울선을 끈 채</b> 차수를 정하고 적으세요',
   f:'차수 n = {0} · 회전각 = {1} ° · 대칭의 수 = {2}',
   chk(got, r, mem){
     if(!r) return {ok:false, msg:'아직 화면 값이 없습니다.'};
     const n=noteNum(r[0]), ang=noteNum(r[1]), tot=noteNum(r[3]);
     if(String(r[2])!=='없음') return {ok:false, msg:'거울선이 켜져 있습니다 — 끄고 적으세요.'};
     if(![0,1,2].every(k=>isFinite(got[k]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-n)>0.5) return {ok:false, msg:'차수는 '+r[0]+' 입니다.'};
     if(Math.abs(got[1]-ang)>0.02) return {ok:false, msg:'회전각은 '+r[1]+' 입니다.'};
     if(Math.abs(got[2]-tot)>0.5) return {ok:false, msg:'대칭의 수는 '+r[3]+' 입니다.'};
     if(Math.abs(tot-n)>0.5) return {ok:false, msg:'거울선이 꺼져 있으면 대칭의 수가 n 과 같아야 합니다.'};
     mem.n1=n; mem.t1=tot;
     return {ok:true, msg:'기록했습니다 — 회전만 세니 '+r[3]+' 가지입니다. 거울선을 켜 봅시다.'};
   }}""",
 """  {t:'생각 — <b>거울선을 켜고</b> (차수는 그대로) 몇 배가 되는지 구하세요',
   f:'차수 n = {0} · 대칭의 수 = {1} · ①의 몇 배인지 = {2}',
   chk(got, r, mem){
     if(mem.t1===undefined) return {ok:false, msg:'① 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const n=noteNum(r[0]), tot=noteNum(r[3]);
     if(String(r[2])!=='있음') return {ok:false, msg:'거울선을 켜세요.'};
     if(n!==mem.n1) return {ok:false, msg:'차수를 ①과 같은 '+mem.n1+' 로 두세요 (지금 '+r[0]+').'};
     if(![0,1,2].every(k=>isFinite(got[k]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-n)>0.5) return {ok:false, msg:'차수는 '+r[0]+' 입니다.'};
     if(Math.abs(got[1]-tot)>0.5) return {ok:false, msg:'대칭의 수는 '+r[3]+' 입니다.'};
     if(Math.abs(got[2]-tot/mem.t1)>0.05) return {ok:false, msg:r[3]+' 를 ①의 '+mem.t1+' 로 나누어 보세요.'};
     mem.ok2=true;
     return {ok:true, msg:'계산했습니다 — 거울선을 더하니 꼭 두 배가 됩니다.'};
   }}""",
 """  {t:'판단 — <b>차수를 6</b> 으로 맞춘 뒤 고르세요 (거울선은 켠 채)',
   f:'차수 n = {0} · 회전각 = {1} ° · 2n = {2}',
   opts:['제자리에 겹치는 방법은 <b>회전 n 가지 + 반사 n 가지 = 2n 가지</b> 다 — 차수만 알면 문양의 짜임을 수로 셀 수 있다',
         '거울선이 있어도 방법의 수는 n 가지 그대로다',
         '차수가 커지면 회전각도 함께 커진다'],
   chk(got, r, mem, pick){
     if(!mem.ok2) return {ok:false, msg:'② 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const n=noteNum(r[0]), ang=noteNum(r[1]), tot=noteNum(r[3]);
     if(n!==6) return {ok:false, msg:'차수가 '+r[0]+' 입니다 — 6 으로 맞추세요.'};
     if(String(r[2])!=='있음') return {ok:false, msg:'거울선을 켠 채로 판단하세요.'};
     if(![0,1,2].every(k=>isFinite(got[k]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-n)>0.5) return {ok:false, msg:'차수는 '+r[0]+' 입니다.'};
     if(Math.abs(got[1]-ang)>0.02) return {ok:false, msg:'회전각은 '+r[1]+' 입니다.'};
     if(Math.abs(got[2]-tot)>0.5) return {ok:false, msg:'2 × '+r[0]+' 를 구해 화면의 '+r[3]+' 와 맞추세요.'};
     if(pick!==0)
       return {ok:false, msg:'거울선을 끄면 '+mem.t1+' 가지, 켜면 그 두 배였습니다. 반사도 「제자리에 겹치는 방법」일까요? 다시 고르세요.'};
     return {ok:true, msg:'판단했습니다 — <b>문양의 짜임을 수로 셀 수 있습니다.</b> 회전만이면 n 가지, 거울선까지면 2n 가지 — 단청과 창살과 보도블록이 모두 이 수로 설명됩니다.'};
   }}""")
 +
 note(238, '내가 내려가고 · 내가 올라가고 · 내가 판단한다',
 """  {t:'기록 — <b>위도를 0°</b> 로 내려 적도에서 적으세요',
   f:'1 ÷ cos φ = {0} · 넓이 배율 = {1}',
   chk(got, r, mem){
     if(!r) return {ok:false, msg:'아직 화면 값이 없습니다.'};
     const la=noteNum(r[0]), k=noteNum(r[1]), a=noteNum(r[2]);
     if(la!==0) return {ok:false, msg:'위도가 '+r[0]+' 입니다 — 0° 로 내리세요.'};
     if(![0,1].every(j=>isFinite(got[j]))) return {ok:false, msg:'두 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-k)>0.005) return {ok:false, msg:'가로 확대는 '+r[1]+' 입니다.'};
     if(Math.abs(got[1]-a)>0.02) return {ok:false, msg:'넓이 배율은 '+r[2]+' 입니다.'};
     mem.ok1=true;
     return {ok:true, msg:'기록했습니다 — 적도에서는 cos 0° = 1 이라 왜곡이 없습니다. 북쪽으로 가 봅시다.'};
   }}""",
 """  {t:'생각 — <b>위도를 60°</b> 로 올리고, 가로 배율의 제곱을 구하세요',
   f:'위도 = {0} ° · 1 ÷ cos φ = {1} · 그 제곱 = {2} · 화면의 넓이 배율 = {3}',
   chk(got, r, mem){
     if(!mem.ok1) return {ok:false, msg:'① 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const la=noteNum(r[0]), k=noteNum(r[1]), a=noteNum(r[2]);
     if(la!==60) return {ok:false, msg:'위도가 '+r[0]+' 입니다 — 60° 로 맞추세요.'};
     if(![0,1,2,3].every(j=>isFinite(got[j]))) return {ok:false, msg:'네 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-la)>0.5) return {ok:false, msg:'위도는 '+r[0]+' 입니다.'};
     if(Math.abs(got[1]-k)>0.005) return {ok:false, msg:'가로 확대는 '+r[1]+' 입니다.'};
     if(Math.abs(got[2]-k*k)>0.03) return {ok:false, msg:r[1]+' 를 두 번 곱해 보세요.'};
     if(Math.abs(got[3]-a)>0.02) return {ok:false, msg:'화면의 넓이 배율은 '+r[2]+' 입니다.'};
     mem.k2=k; mem.a2=a; mem.ok2=true;
     return {ok:true, msg:'계산했습니다 — 가로가 '+r[1]+' 배 늘자 넓이는 그 제곱인 '+r[2]+' 배가 되었습니다.'};
   }}""",
 """  {t:'판단 — 지도에서 보이는 넓이와 실제 넓이를 견주고 고르세요',
   f:'실제 넓이 = {0} · 지도에서 = {1} · 지도 ÷ 실제 = {2}',
   opts:['위도선의 둘레가 cos φ 에 비례해 줄어들므로 가로를 <b>1 ÷ cos φ</b> 배로 펴야 하고, 세로도 같은 비율로 늘어나 <b>넓이는 그 제곱</b> 배가 된다',
         '메르카토르 지도는 넓이를 그대로 지킨다',
         '넓이 배율은 가로 배율과 같다'],
   chk(got, r, mem, pick){
     if(!mem.ok2) return {ok:false, msg:'② 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const a=noteNum(r[2]), re=noteNum(r[3]), mp=noteNum(r[4]);
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-re)>1) return {ok:false, msg:'실제 넓이는 '+r[3]+' 입니다.'};
     if(Math.abs(got[1]-mp)>1) return {ok:false, msg:'지도에서는 '+r[4]+' 입니다.'};
     if(Math.abs(got[2]-a)>0.06) return {ok:false, msg:r[4]+' 를 '+r[3]+' 로 나누어 보세요 — 넓이 배율 '+r[2]+' 가 나옵니다.'};
     if(pick!==0)
       return {ok:false, msg:'적도에서는 1 배였는데 위도 60° 에서 가로가 '+mem.k2+' 배, 넓이가 '+mem.a2+' 배가 되었습니다. 둘의 관계는 무엇일까요? 다시 고르세요.'};
     return {ok:true, msg:'판단했습니다 — <b>가로를 1 ÷ cos φ 로 펴면 넓이는 그 제곱으로 부풉니다.</b> 둥근 것을 평면에 펴면 각·넓이·거리 가운데 무엇을 지킬지 골라야 하고, 메르카토르는 각을 지키고 넓이를 버린 지도입니다.'};
   }}""")
 +
 note(239, '내가 당기고 · 내가 늘어뜨리고 · 내가 판단한다',
 """  {t:'기록 — <b>a 를 100 이상</b> 으로 올려 팽팽하게 당기고 적으세요',
   f:'a = {0} · 처짐 = {1} m · 포물선과의 최대 차이 = {2} m',
   chk(got, r, mem){
     if(!r) return {ok:false, msg:'아직 화면 값이 없습니다.'};
     const a=noteNum(r[0]), sg=noteNum(r[2]), g=noteNum(r[3]);
     if(!(a>=100)) return {ok:false, msg:'a 가 '+r[0]+' 입니다 — 100 이상으로 올리세요.'};
     if(![0,1,2].every(k=>isFinite(got[k]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-a)>1) return {ok:false, msg:'a 는 '+r[0]+' 입니다.'};
     if(Math.abs(got[1]-sg)>0.02) return {ok:false, msg:'처짐은 '+r[2]+' m 입니다.'};
     if(Math.abs(got[2]-g)>0.005) return {ok:false, msg:'최대 차이는 '+r[3]+' m 입니다.'};
     mem.g1=g; mem.a1=a; mem.w=noteNum(r[1]);
     return {ok:true, msg:'기록했습니다 — 팽팽하게 당기니 두 곡선의 차이가 '+r[3]+' m 뿐입니다. 헐겁게 늘어뜨려 봅시다.'};
   }}""",
 """  {t:'생각 — <b>a 를 20 이하</b> 로 내려 헐겁게 늘어뜨리고, 몇 배인지 구하세요',
   f:'a = {0} · 처짐 = {1} m · 최대 차이 = {2} m · ①의 몇 배인지 = {3}',
   chk(got, r, mem){
     if(mem.g1===undefined) return {ok:false, msg:'① 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const a=noteNum(r[0]), w=noteNum(r[1]), sg=noteNum(r[2]), g=noteNum(r[3]);
     if(!(a<=20)) return {ok:false, msg:'a 가 '+r[0]+' 입니다 — 20 이하로 내리세요.'};
     if(Math.abs(w-mem.w)>1) return {ok:false, msg:'폭은 ①과 같게 두세요 (①은 '+mem.w+' m).'};
     if(![0,1,2,3].every(k=>isFinite(got[k]))) return {ok:false, msg:'네 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-a)>1) return {ok:false, msg:'a 는 '+r[0]+' 입니다.'};
     if(Math.abs(got[1]-sg)>0.05) return {ok:false, msg:'처짐은 '+r[2]+' m 입니다.'};
     if(Math.abs(got[2]-g)>0.05) return {ok:false, msg:'최대 차이는 '+r[3]+' m 입니다.'};
     if(Math.abs(got[3]-g/mem.g1)>Math.max(1, g/mem.g1*0.06))
       return {ok:false, msg:r[3]+' 를 ①의 '+mem.g1+' 로 나누어 보세요.'};
     if(!(g>mem.g1)) return {ok:false, msg:'차이가 ①보다 커져야 합니다 — a 를 더 내리세요.'};
     mem.g2=g; mem.ok2=true;
     return {ok:true, msg:'계산했습니다 — 헐거워지자 차이가 '+mem.g1+' 에서 '+r[3]+' 로 크게 벌어졌습니다.'};
   }}""",
 """  {t:'판단 — 두 차이를 나란히 두고 고르세요',
   f:'팽팽할 때 차이 = {0} m · 헐거울 때 차이 = {1} m · 헐거울 때가 크면 1, 아니면 0 → {2}',
   opts:['cosh t 를 급수로 펴면 <b>1 + t²/2 + t⁴/24 + …</b> 이고 앞 두 항만 남긴 것이 포물선이다 — 팽팽할수록 t 가 작아 버린 항이 작고, 헐거울수록 t 가 커져 차이가 드러난다',
         '늘어진 줄은 언제나 정확한 포물선이다',
         '팽팽하게 당길수록 두 곡선이 더 많이 벌어진다'],
   chk(got, r, mem, pick){
     if(!mem.ok2) return {ok:false, msg:'② 칸을 먼저 통과하세요.'};
     if(![0,1,2].every(k=>isFinite(got[k]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-mem.g1)>0.005) return {ok:false, msg:'①에 적은 '+mem.g1+' 입니다.'};
     if(Math.abs(got[1]-mem.g2)>0.05) return {ok:false, msg:'②에 적은 '+mem.g2+' 입니다.'};
     if(Math.abs(got[2]-1)>0.01) return {ok:false, msg:'두 값을 견주세요.'};
     if(pick!==0)
       return {ok:false, msg:'팽팽할 때는 '+mem.g1+' m, 헐거울 때는 '+mem.g2+' m 였습니다. 무엇이 두 곡선을 가르고 있었을까요? 다시 고르세요.'};
     return {ok:true, msg:'판단했습니다 — <b>현수선과 포물선은 다른 곡선입니다.</b> 팽팽할 때 거의 포개지는 것은 급수의 앞 두 항이 같기 때문이고, 그래서 갈릴레오도 오래 헷갈렸습니다.'};
   }}""")
 +
 note(240, '내가 자르고 · 내가 맞추고 · 내가 판단한다',
 """  {t:'기록 — <b>비 r 을 1.5 쯤</b> 으로 두어 차이가 크게 하고 적으세요',
   f:'r = {0} · 2 ÷ r = {1} · 차이 = {2}',
   chk(got, r, mem){
     if(!r) return {ok:false, msg:'아직 화면 값이 없습니다.'};
     const rr=noteNum(r[0]), tw=noteNum(r[1]), d=noteNum(r[2]);
     if(!(d>0.05)) return {ok:false, msg:'차이가 '+r[2]+' 로 이미 작습니다 — r 을 1.5 쯤으로 두세요.'};
     if(![0,1,2].every(k=>isFinite(got[k]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-rr)>0.002) return {ok:false, msg:'r 은 '+r[0]+' 입니다.'};
     if(Math.abs(got[1]-tw)>0.002) return {ok:false, msg:'2 ÷ r 은 '+r[1]+' 입니다.'};
     if(Math.abs(got[2]-d)>0.002) return {ok:false, msg:'차이는 '+r[2]+' 입니다.'};
     mem.d1=d; mem.r1=rr;
     return {ok:true, msg:'기록했습니다 — 자르고 나면 비가 '+r[1]+' 로 바뀝니다. 모양이 달라진 것입니다.'};
   }}""",
 """  {t:'생각 — <b>차이가 0.02 아래</b> 가 되도록 r 을 맞추고, 제곱을 구하세요',
   f:'r = {0} · 2 ÷ r = {1} · 차이 = {2} · r × r = {3}',
   chk(got, r, mem){
     if(mem.d1===undefined) return {ok:false, msg:'① 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const rr=noteNum(r[0]), tw=noteNum(r[1]), d=noteNum(r[2]);
     if(!(d<0.02)) return {ok:false, msg:'차이가 '+r[2]+' 입니다 — r 을 1.41 쯤으로 맞추세요.'};
     if(![0,1,2,3].every(k=>isFinite(got[k]))) return {ok:false, msg:'네 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-rr)>0.002) return {ok:false, msg:'r 은 '+r[0]+' 입니다.'};
     if(Math.abs(got[1]-tw)>0.002) return {ok:false, msg:'2 ÷ r 은 '+r[1]+' 입니다.'};
     if(Math.abs(got[2]-d)>0.002) return {ok:false, msg:'차이는 '+r[2]+' 입니다.'};
     if(Math.abs(got[3]-rr*rr)>0.02) return {ok:false, msg:r[0]+' 을 두 번 곱해 보세요 — 2 에 아주 가까운 수가 나옵니다.'};
     mem.r2=rr; mem.ok2=true;
     return {ok:true, msg:'계산했습니다 — 제곱이 2 에 아주 가깝습니다. 잘라도 비가 그대로인 종이를 찾은 것입니다.'};
   }}""",
 """  {t:'판단 — <b>네 번 이상 자른 뒤</b> 남은 넓이를 확인하고 고르세요',
   f:'A n = {0} · 남은 넓이 = {1} % · 100 ÷ 2ⁿ = {2} %',
   opts:['자르기 전의 비 r 과 자른 뒤의 비 2 ÷ r 이 같아야 하므로 <b>r² = 2</b>, 곧 r = √2 하나뿐이다 — 넓이는 반씩 줄어도 모양은 그대로다',
         '반으로 자르면 어떤 종이든 모양이 그대로다',
         '넓이가 반이 되면 가로세로 비도 반이 된다'],
   chk(got, r, mem, pick){
     if(!mem.ok2) return {ok:false, msg:'② 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const n=noteNum(r[3]), ar=noteNum(r[4]);
     if(!(n>=4)) return {ok:false, msg:'지금 '+r[3]+' 입니다 — 네 번 이상 잘라 보세요.'};
     if(![0,1,2].every(k=>isFinite(got[k]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-n)>0.5) return {ok:false, msg:'지금은 '+r[3]+' 입니다.'};
     if(Math.abs(got[1]-ar)>0.01) return {ok:false, msg:'남은 넓이는 '+r[4]+' % 입니다.'};
     if(Math.abs(got[2]-100/Math.pow(2,n))>0.02) return {ok:false, msg:'100 을 2 의 '+n+'제곱으로 나누어 보세요.'};
     if(pick!==0)
       return {ok:false, msg:'r 이 '+mem.r1+' 일 때는 자르고 나서 비가 달라졌는데 '+mem.r2+' 에서는 그대로였습니다. 어떤 식이 성립해야 할까요? 다시 고르세요.'};
     return {ok:true, msg:'판단했습니다 — <b>r = 2 ÷ r 을 풀면 r² = 2 입니다.</b> 그래서 반으로 잘라도 닮은 종이는 √2 비 하나뿐이고, A4 를 A3 로 확대해도 여백이 생기지 않습니다.'};
   }}""")
)
