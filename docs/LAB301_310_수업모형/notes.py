# -*- coding: utf-8 -*-
"""LAB 301~310 탐구 노트 — 기록 → 생각 → 판단. 판정은 화면의 read() 값으로만 한다."""


def note(no, head, c1, c2, c3):
    return "\n %d:{ h:'%s',\n  c:[\n%s,\n%s,\n%s\n ]},\n" % (no, head, c1, c2, c3)


NOTES = (
 note(301, '내가 확정하고 · 내가 줄이고 · 내가 판단한다',
 """  {t:'기록 — <b>끝까지 확정</b> 한 뒤 적으세요 (가·라 는 3 이상)',
   f:'확정한 곳의 수 = {0} · 바까지의 거리 = {1} · 최종값 = {2}',
   chk(got, r, mem){
     if(!r) return {ok:false, msg:'아직 화면 값이 없습니다.'};
     const k=noteNum(r[0]), w=noteNum(r[1]), d=noteNum(r[2]), f=noteNum(r[3]);
     if(!(k>=5)) return {ok:false, msg:'확정한 곳이 '+r[0]+' 곳입니다 — 끝까지 늘리세요.'};
     if(!(w>=3)) return {ok:false, msg:'가·라 가 '+r[1]+' 입니다 — ②에서 줄일 테니 3 이상으로 두세요.'};
     if(!isFinite(d)) return {ok:false, msg:'아직 바까지 닿지 못했습니다.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-k)>0.5) return {ok:false, msg:'확정한 곳의 수는 '+r[0]+' 입니다.'};
     if(Math.abs(got[1]-d)>0.5) return {ok:false, msg:'바까지의 거리는 '+r[2]+' 입니다.'};
     if(Math.abs(got[2]-f)>0.5) return {ok:false, msg:'최종값은 '+r[3]+' 입니다.'};
     mem.d1=d;
     return {ok:true, msg:'기록했습니다 — 가까운 곳부터 확정했더니 '+r[2]+' 로 정해졌습니다.'};
   }}""",
 """  {t:'생각 — <b>가·라 구간을 1</b> 로 줄이고 다시 적으세요',
   f:'가·라 길이 = {0} · 바까지의 거리 = {1} · ①보다 얼마나 줄었나 = {2}',
   chk(got, r, mem){
     if(mem.d1===undefined) return {ok:false, msg:'① 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const w=noteNum(r[1]), d=noteNum(r[2]);
     if(!(w<=1)) return {ok:false, msg:'가·라 가 '+r[1]+' 입니다 — 1 로 줄이세요.'};
     if(!isFinite(d)) return {ok:false, msg:'확정한 곳의 수를 끝까지 늘리세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-w)>0.5) return {ok:false, msg:'가·라 길이는 '+r[1]+' 입니다.'};
     if(Math.abs(got[1]-d)>0.5) return {ok:false, msg:'바까지의 거리는 '+r[2]+' 입니다.'};
     if(Math.abs(got[2]-(mem.d1-d))>0.5) return {ok:false, msg:'①의 '+mem.d1+' 에서 빼면 얼마인가요?'};
     mem.d2=d; mem.ok2=true;
     return {ok:true, msg:'계산했습니다 — 구간 하나가 짧아지자 최단 경로가 아래쪽으로 갈아탔습니다.'};
   }}""",
 """  {t:'판단 — 두 거리를 나란히 두고 고르세요',
   f:'①의 거리 = {0} · ②의 거리 = {1} · 길 하나가 바뀌면 경로가 갈아탈 수 있으면 1 → {2}',
   opts:['아직 확정되지 않은 곳 가운데 <b>가장 가까운 곳</b> 을 확정하면 그 값은 더 줄어들 수 없다 — 그래서 되돌아가 고칠 일이 없고, 한 번씩만 보고도 최단 거리가 정해진다',
         '모든 경로를 다 따져 보아야만 최단 거리를 알 수 있다',
         '한 구간의 길이가 바뀌어도 최단 경로는 그대로다'],
   chk(got, r, mem, pick){
     if(!mem.ok2) return {ok:false, msg:'② 칸을 먼저 통과하세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-mem.d1)>0.5) return {ok:false, msg:'①에 적은 '+mem.d1+' 입니다.'};
     if(Math.abs(got[1]-mem.d2)>0.5) return {ok:false, msg:'②에 적은 '+mem.d2+' 입니다.'};
     if(Math.abs(got[2]-1)>0.1) return {ok:false, msg:'경로가 갈아탔나요, 그대로였나요?'};
     if(pick!==0)
       return {ok:false, msg:'가까운 곳부터 확정했더니 고칠 일이 없었습니다. 왜 그럴까요? 다시 고르세요.'};
     return {ok:true, msg:'판단했습니다 — <b>가장 가까운 곳은 더 줄어들 수 없습니다.</b> 그래서 한 번 확정한 값은 끝까지 그대로이고, 내비게이션이 이 방법으로 길을 찾습니다.'};
   }}""")
 +
 note(302, '내가 고르고 · 내가 바꾸고 · 내가 판단한다',
 """  {t:'기록 — 동전 묶음을 <b>1 · 3 · 4 원</b> 으로 바꾸고 적으세요',
   f:'금액 = {0} · 큰 것부터 = {1} · 가장 적게 = {2}',
   chk(got, r, mem){
     if(!r) return {ok:false, msg:'아직 화면 값이 없습니다.'};
     const m=noteNum(r[1]), g=noteNum(r[2]), b=noteNum(r[3]);
     if(!(g>b)) return {ok:false, msg:'지금은 두 값이 같습니다 — 묶음을 1 · 3 · 4 원으로 바꾸고 금액을 18 원쯤으로 두세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-m)>0.5) return {ok:false, msg:'금액은 '+r[1]+' 원입니다.'};
     if(Math.abs(got[1]-g)>0.5) return {ok:false, msg:'큰 것부터는 '+r[2]+' 개입니다.'};
     if(Math.abs(got[2]-b)>0.5) return {ok:false, msg:'가장 적게는 '+r[3]+' 개입니다.'};
     mem.g1=g; mem.b1=b;
     return {ok:true, msg:'기록했습니다 — 큰 것부터 골랐더니 '+(g-b)+' 개를 더 썼습니다.'};
   }}""",
 """  {t:'생각 — 묶음을 <b>1 · 5 · 10 · 50 원</b> 으로 되돌리고 적으세요',
   f:'금액 = {0} · 큰 것부터 = {1} · 가장 적게 = {2}',
   chk(got, r, mem){
     if(mem.g1===undefined) return {ok:false, msg:'① 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const m=noteNum(r[1]), g=noteNum(r[2]), b=noteNum(r[3]);
     if(g!==b) return {ok:false, msg:'두 값이 '+r[2]+' 와 '+r[3]+' 로 다릅니다 — 1 · 5 · 10 · 50 원 묶음으로 두세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-m)>0.5) return {ok:false, msg:'금액은 '+r[1]+' 원입니다.'};
     if(Math.abs(got[1]-g)>0.5) return {ok:false, msg:'큰 것부터는 '+r[2]+' 개입니다.'};
     if(Math.abs(got[2]-b)>0.5) return {ok:false, msg:'가장 적게는 '+r[3]+' 개입니다.'};
     mem.g2=g; mem.b2=b; mem.ok2=true;
     return {ok:true, msg:'계산했습니다 — 우리 동전에서는 큰 것부터 골라도 최선입니다.'};
   }}""",
 """  {t:'판단 — 두 경우의 차를 나란히 두고 고르세요',
   f:'①의 차(큰 것부터 − 가장 적게) = {0} · ②의 차 = {1} · 큰 것부터가 늘 최선이면 1, 아니면 0 → {2}',
   opts:['탐욕법은 <b>동전 묶음에 따라</b> 최선이 되기도 하고 아니기도 한다 — 1 · 5 · 10 · 50 원에서는 늘 최선이지만 1 · 3 · 4 원에서는 한 개를 더 쓰게 된다',
         '큰 것부터 고르는 방법은 어떤 동전 묶음에서도 최선이다',
         '동전의 종류가 많을수록 탐욕법이 유리하다'],
   chk(got, r, mem, pick){
     if(!mem.ok2) return {ok:false, msg:'② 칸을 먼저 통과하세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-(mem.g1-mem.b1))>0.5) return {ok:false, msg:'①에서 '+mem.g1+' − '+mem.b1+' 입니다.'};
     if(Math.abs(got[1]-(mem.g2-mem.b2))>0.5) return {ok:false, msg:'②에서 '+mem.g2+' − '+mem.b2+' 입니다.'};
     if(Math.abs(got[2])>0.1) return {ok:false, msg:'①에서 손해가 났으니 「늘 최선」은 아닙니다.'};
     if(pick!==0)
       return {ok:false, msg:'묶음을 바꾸자 같은 방법이 손해가 되었습니다. 무엇에 달린 것일까요? 다시 고르세요.'};
     return {ok:true, msg:'판단했습니다 — <b>매번의 최선이 전체의 최선은 아닙니다.</b> 탐욕법이 통하는지는 증명해야 하고, 통하지 않으면 모든 경우를 따지는 방법(동적 계획법)이 필요합니다.'};
   }}""")
 +
 note(303, '내가 고르고 · 내가 치우치게 하고 · 내가 판단한다',
 """  {t:'기록 — 네 빈도를 <b>모두 같게</b> 두고 적으세요',
   f:'가 의 빈도 = {0} · 전체 비트 수 = {1} · 압축률 = {2} %',
   chk(got, r, mem){
     if(!r) return {ok:false, msg:'아직 화면 값이 없습니다.'};
     const a=noteNum(r[0]), bits=noteNum(r[2]), ratio=noteNum(r[3]);
     if(!(ratio>=99)) return {ok:false, msg:'압축률이 '+r[3]+' 입니다 — 네 빈도를 모두 같게 두세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-a)>0.5) return {ok:false, msg:'가 의 빈도는 '+r[0]+' 의 첫 수입니다.'};
     if(Math.abs(got[1]-bits)>0.5) return {ok:false, msg:'전체 비트 수는 '+r[2]+' 입니다.'};
     if(Math.abs(got[2]-ratio)>0.5) return {ok:false, msg:'압축률은 '+r[3]+' 입니다.'};
     mem.r1=ratio; mem.b1=bits;
     return {ok:true, msg:'기록했습니다 — 빈도가 고르면 압축이 되지 않습니다. 치우치게 해 봅시다.'};
   }}""",
 """  {t:'생각 — <b>가 의 빈도를 60</b> 으로 키우고 다시 적으세요',
   f:'가 의 빈도 = {0} · 전체 비트 수 = {1} · 압축률 = {2} %',
   chk(got, r, mem){
     if(mem.r1===undefined) return {ok:false, msg:'① 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const a=noteNum(r[0]), bits=noteNum(r[2]), ratio=noteNum(r[3]);
     if(!(ratio<=90)) return {ok:false, msg:'압축률이 '+r[3]+' 입니다 — 가 의 빈도를 크게 키우세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-a)>0.5) return {ok:false, msg:'가 의 빈도는 '+r[0]+' 의 첫 수입니다.'};
     if(Math.abs(got[1]-bits)>0.5) return {ok:false, msg:'전체 비트 수는 '+r[2]+' 입니다.'};
     if(Math.abs(got[2]-ratio)>0.5) return {ok:false, msg:'압축률은 '+r[3]+' 입니다.'};
     mem.r2=ratio; mem.ok2=true;
     return {ok:true, msg:'계산했습니다 — 자주 나오는 글자가 1 비트를 받아 전체가 줄었습니다.'};
   }}""",
 """  {t:'판단 — 두 압축률을 나란히 두고 고르세요',
   f:'①의 압축률 = {0} % · ②의 압축률 = {1} % · 빈도가 고르면 압축이 되면 1, 안 되면 0 → {2}',
   opts:['압축은 <b>빈도가 치우칠수록</b> 잘 된다 — 자주 나오는 글자에 짧은 부호를 주기 때문이고, 어떤 부호도 다른 부호의 앞부분이 되지 않아 헷갈리지 않는다',
         '부호를 짧게 하면 언제나 압축이 된다',
         '빈도가 고를수록 압축이 잘 된다'],
   chk(got, r, mem, pick){
     if(!mem.ok2) return {ok:false, msg:'② 칸을 먼저 통과하세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-mem.r1)>0.5) return {ok:false, msg:'①에 적은 '+mem.r1+' 입니다.'};
     if(Math.abs(got[1]-mem.r2)>0.5) return {ok:false, msg:'②에 적은 '+mem.r2+' 입니다.'};
     if(Math.abs(got[2])>0.1) return {ok:false, msg:'①에서 압축률이 100 % 였습니다.'};
     if(pick!==0)
       return {ok:false, msg:'빈도가 고를 때는 100 % 였고 치우치자 줄었습니다. 무엇이 압축을 만들까요? 다시 고르세요.'};
     return {ok:true, msg:'판단했습니다 — <b>치우침이 곧 압축의 재료입니다.</b> 모든 글자가 똑같이 나오면 줄일 것이 없고, 치우칠수록 많이 줄어듭니다 — ZIP 과 JPEG 가 모두 이 생각 위에 있습니다.'};
   }}""")
 +
 note(304, '내가 뒤집고 · 내가 짚어 내고 · 내가 판단한다',
 """  {t:'기록 — <b>뒤집지 않은 채</b> 세 검사 결과를 적으세요',
   f:'뒤집힌 자리 = {0} · 세 검사 = {1} · 짚어 낸 위치 = {2}',
   chk(got, r, mem){
     if(!r) return {ok:false, msg:'아직 화면 값이 없습니다.'};
     const e=noteNum(r[1]), s=noteNum(r[2]), p=noteNum(r[3]);
     if(e!==0) return {ok:false, msg:'뒤집힌 자리가 '+r[1]+' 번입니다 — ②에서 뒤집을 테니 지금은 0 으로 두세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-e)>0.1) return {ok:false, msg:'뒤집힌 자리는 '+r[1]+' 입니다.'};
     if(Math.abs(got[1]-s)>0.1) return {ok:false, msg:'세 검사는 '+r[2]+' 입니다.'};
     if(Math.abs(got[2]-p)>0.1) return {ok:false, msg:'짚어 낸 위치는 '+r[3]+' 입니다.'};
     mem.p1=p;
     return {ok:true, msg:'기록했습니다 — 아무 데도 틀리지 않았으니 세 검사가 모두 0 입니다.'};
   }}""",
 """  {t:'생각 — <b>5 번 자리를 뒤집고</b> 다시 적으세요',
   f:'뒤집힌 자리 = {0} · 세 검사 = {1} · 짚어 낸 위치 = {2}',
   chk(got, r, mem){
     if(mem.p1===undefined) return {ok:false, msg:'① 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const e=noteNum(r[1]), s=noteNum(r[2]), p=noteNum(r[3]);
     if(!(e>0)) return {ok:false, msg:'뒤집힌 자리가 0 입니다 — 한 자리를 뒤집으세요.'};
     if(p!==e) return {ok:false, msg:'「검사를 하나만 쓰기」 를 끄세요 — 세 검사를 모두 써야 자리를 짚어 냅니다.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-e)>0.1) return {ok:false, msg:'뒤집힌 자리는 '+r[1]+' 입니다.'};
     if(Math.abs(got[1]-s)>0.1) return {ok:false, msg:'세 검사는 '+r[2]+' 입니다.'};
     if(Math.abs(got[2]-p)>0.1) return {ok:false, msg:'짚어 낸 위치는 '+r[3]+' 입니다.'};
     mem.p2=p; mem.e2=e; mem.ok2=true;
     return {ok:true, msg:'계산했습니다 — 뒤집은 자리와 짚어 낸 자리가 같습니다.'};
   }}""",
 """  {t:'판단 — 검사의 수를 생각하며 고르세요',
   f:'①의 위치 = {0} · ②의 위치 = {1} · 검사가 하나뿐이면 (위치까지 알면 1, 틀림만 알면 0) → {2}',
   opts:['세 검사 결과를 <b>1 · 2 · 4 의 자리값</b> 으로 읽으면 그대로 위치가 된다 — 그렇게 되도록 비트를 배치했기 때문이고, 검사가 하나뿐이면 틀렸다는 것까지만 알 수 있다',
         '검사를 하나만 써도 위치를 알 수 있다',
         '검사를 늘리면 오류를 아예 막을 수 있다'],
   chk(got, r, mem, pick){
     if(!mem.ok2) return {ok:false, msg:'② 칸을 먼저 통과하세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-mem.p1)>0.1) return {ok:false, msg:'①에 적은 '+mem.p1+' 입니다.'};
     if(Math.abs(got[1]-mem.p2)>0.1) return {ok:false, msg:'②에 적은 '+mem.p2+' 입니다.'};
     if(Math.abs(got[2])>0.1) return {ok:false, msg:'검사 하나로는 어디인지 알 수 없었습니다.'};
     if(pick!==0)
       return {ok:false, msg:'세 검사 결과를 숫자로 읽었더니 자리가 그대로 나왔습니다. 어떻게 읽은 것일까요? 다시 고르세요.'};
     return {ok:true, msg:'판단했습니다 — <b>검사를 셋으로 늘리면 「어디인지」까지 알 수 있습니다.</b> QR 코드가 일부 가려져도 읽히는 것, 저장장치가 스스로 고치는 것이 모두 이 원리입니다.'};
   }}""")
 +
 note(305, '내가 키우고 · 내가 재고 · 내가 판단한다',
 """  {t:'기록 — <b>n 을 작게(1000 아래)</b> 두고 적으세요',
   f:'n = {0} · n² = {1} · 비 = {2}',
   chk(got, r, mem){
     if(!r) return {ok:false, msg:'아직 화면 값이 없습니다.'};
     const n=noteNum(r[0]), sq=noteNum(r[2]), ratio=noteNum(r[3]);
     if(!(ratio<100)) return {ok:false, msg:'비가 '+r[3]+' 입니다 — ②에서 키울 테니 지금은 n 을 작게 두세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-n)>0.5) return {ok:false, msg:'n 은 '+r[0]+' 입니다.'};
     if(Math.abs(got[1]-sq)>1) return {ok:false, msg:'n² 은 '+r[2]+' 입니다.'};
     if(Math.abs(got[2]-ratio)>0.5) return {ok:false, msg:'비는 '+r[3]+' 입니다.'};
     mem.n1=n; mem.r1=ratio;
     return {ok:true, msg:'기록했습니다 — 아직 두 방법의 차이가 '+r[3]+' 배입니다. n 을 키워 봅시다.'};
   }}""",
 """  {t:'생각 — <b>n 을 10 배</b> 로 키우고 다시 적으세요',
   f:'n = {0} · n² = {1} · 비 = {2}',
   chk(got, r, mem){
     if(mem.r1===undefined) return {ok:false, msg:'① 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const n=noteNum(r[0]), sq=noteNum(r[2]), ratio=noteNum(r[3]);
     if(!(n>=mem.n1*5)) return {ok:false, msg:'n 이 '+r[0]+' 입니다 — ①의 '+mem.n1+' 보다 훨씬 크게 키우세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-n)>0.5) return {ok:false, msg:'n 은 '+r[0]+' 입니다.'};
     if(Math.abs(got[1]-sq)>1) return {ok:false, msg:'n² 은 '+r[2]+' 입니다.'};
     if(Math.abs(got[2]-ratio)>0.5) return {ok:false, msg:'비는 '+r[3]+' 입니다.'};
     mem.r2=ratio; mem.ok2=true;
     return {ok:true, msg:'계산했습니다 — 비가 '+mem.r1+' 에서 '+r[3]+' 로 커졌습니다.'};
   }}""",
 """  {t:'판단 — 두 비를 나란히 두고 고르세요',
   f:'①의 비 = {0} · ②의 비 = {1} · n 이 10 배가 되면 n² 은 몇 배 = {2}',
   opts:['n² 과 n log n 의 비는 <b>n ÷ log n</b> 이라 n 이 커질수록 계속 벌어진다 — 자료가 작을 때는 차이가 없어 보여도, 커지면 차수가 모든 것을 정한다',
         'n 이 10 배가 되면 n² 도 10 배가 된다',
         '컴퓨터가 빨라지면 차수의 차이는 사라진다'],
   chk(got, r, mem, pick){
     if(!mem.ok2) return {ok:false, msg:'② 칸을 먼저 통과하세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-mem.r1)>0.5) return {ok:false, msg:'①에 적은 '+mem.r1+' 입니다.'};
     if(Math.abs(got[1]-mem.r2)>0.5) return {ok:false, msg:'②에 적은 '+mem.r2+' 입니다.'};
     if(Math.abs(got[2]-100)>0.5) return {ok:false, msg:'(10n)² = 100n² 입니다.'};
     if(pick!==0)
       return {ok:false, msg:'n 을 키우자 비가 함께 커졌습니다. 그 비는 무엇이었을까요? 다시 고르세요.'};
     return {ok:true, msg:'판단했습니다 — <b>차수가 다르면 언젠가 반드시 벌어집니다.</b> 그래서 알고리즘을 고를 때는 작은 자료에서의 빠르기가 아니라 자료가 커질 때의 차수를 봅니다.'};
   }}""")
 +
 note(306, '내가 바꾸고 · 내가 세고 · 내가 판단한다',
 """  {t:'기록 — 자료의 모양을 <b>정렬됨</b> 으로 두고 적으세요',
   f:'삽입 정렬 = {0} · 병합 정렬 = {1}',
   chk(got, r, mem){
     if(!r) return {ok:false, msg:'아직 화면 값이 없습니다.'};
     const ins=noteNum(r[2]), mer=noteNum(r[3]);
     if(String(r[1])!=='정렬됨') return {ok:false, msg:'지금은 «'+r[1]+'» 입니다 — 정렬됨 으로 바꾸세요.'};
     if(![0,1].every(j=>isFinite(got[j]))) return {ok:false, msg:'두 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-ins)>0.5) return {ok:false, msg:'삽입 정렬은 '+r[2]+' 회입니다.'};
     if(Math.abs(got[1]-mer)>0.5) return {ok:false, msg:'병합 정렬은 '+r[3]+' 회입니다.'};
     mem.i1=ins; mem.m1=mer;
     return {ok:true, msg:'기록했습니다 — 이미 정렬된 자료에서는 삽입 정렬이 더 적게 비교합니다.'};
   }}""",
 """  {t:'생각 — 모양을 <b>거꾸로</b> 로 바꾸고 다시 적으세요',
   f:'삽입 정렬 = {0} · 병합 정렬 = {1} · ①의 삽입보다 몇 배 = {2}',
   chk(got, r, mem){
     if(mem.i1===undefined) return {ok:false, msg:'① 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const ins=noteNum(r[2]), mer=noteNum(r[3]);
     if(String(r[1])!=='거꾸로') return {ok:false, msg:'지금은 «'+r[1]+'» 입니다 — 거꾸로 로 바꾸세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-ins)>0.5) return {ok:false, msg:'삽입 정렬은 '+r[2]+' 회입니다.'};
     if(Math.abs(got[1]-mer)>0.5) return {ok:false, msg:'병합 정렬은 '+r[3]+' 회입니다.'};
     if(Math.abs(got[2]-ins/mem.i1)>0.6) return {ok:false, msg:'①의 '+mem.i1+' 회로 나누면 얼마인가요?'};
     mem.i2=ins; mem.m2=mer; mem.ok2=true;
     return {ok:true, msg:'계산했습니다 — 같은 개수인데 삽입 정렬만 크게 늘었습니다.'};
   }}""",
 """  {t:'판단 — 두 정렬을 나란히 두고 고르세요',
   f:'①의 삽입 = {0} · ②의 삽입 = {1} · 자료의 모양에 따라 달라지는 쪽이 삽입이면 1 → {2}',
   opts:['빠르기는 <b>자료의 모양까지</b> 함께 보아야 한다 — 삽입 정렬은 정렬된 자료에서 n−1 회로 가장 빠르지만 거꾸로면 n(n−1)/2 회가 되고, 병합 정렬은 모양과 상관없이 일정하다',
         '어떤 자료에서도 병합 정렬이 언제나 빠르다',
         '자료의 개수만 같으면 비교 횟수도 같다'],
   chk(got, r, mem, pick){
     if(!mem.ok2) return {ok:false, msg:'② 칸을 먼저 통과하세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-mem.i1)>0.5) return {ok:false, msg:'①에 적은 '+mem.i1+' 입니다.'};
     if(Math.abs(got[1]-mem.i2)>0.5) return {ok:false, msg:'②에 적은 '+mem.i2+' 입니다.'};
     if(Math.abs(got[2]-1)>0.1) return {ok:false, msg:'크게 달라진 쪽은 어느 쪽이었나요?'};
     if(pick!==0)
       return {ok:false, msg:'같은 개수인데 모양에 따라 삽입 정렬만 10 배가 되었습니다. 무엇을 함께 보아야 할까요? 다시 고르세요.'};
     return {ok:true, msg:'판단했습니다 — <b>자료의 모양이 빠르기를 정합니다.</b> 거의 정렬된 자료라면 삽입 정렬이, 모양을 모르면 병합 정렬이 안전합니다.'};
   }}""")
 +
 note(307, '내가 가정하고 · 내가 밀고 · 내가 판단한다',
 """  {t:'기록 — <b>앞 단계(3 단계 아래)</b> 에서 적으세요',
   f:'지금 단계 = {0} · 모순이면 1, 아직이면 0 → {1}',
   chk(got, r, mem){
     if(!r) return {ok:false, msg:'아직 화면 값이 없습니다.'};
     const k=noteNum(r[0]);
     if(String(r[2])==='모순') return {ok:false, msg:'벌써 모순까지 왔습니다 — ②에서 볼 테니 앞 단계로 되돌리세요.'};
     if(!(k<=3)) return {ok:false, msg:'지금 '+r[0]+' 단계입니다 — 3 단계 아래로 두세요.'};
     if(![0,1].every(j=>isFinite(got[j]))) return {ok:false, msg:'두 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-k)>0.5) return {ok:false, msg:'지금 단계는 '+r[0]+' 입니다.'};
     if(Math.abs(got[1])>0.1) return {ok:false, msg:'아직 모순이 아니므로 0 입니다.'};
     mem.k1=k;
     return {ok:true, msg:'기록했습니다 — 여기까지는 아무 문제가 없습니다. 끝까지 밀어 봅시다.'};
   }}""",
 """  {t:'생각 — <b>끝 단계까지</b> 올리고 다시 적으세요',
   f:'지금 단계 = {0} · 모순이면 1, 아직이면 0 → {1}',
   chk(got, r, mem){
     if(mem.k1===undefined) return {ok:false, msg:'① 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const k=noteNum(r[0]);
     if(String(r[2])!=='모순') return {ok:false, msg:'아직 «'+r[2]+'» 입니다 — 끝 단계까지 올리세요.'};
     if(![0,1].every(j=>isFinite(got[j]))) return {ok:false, msg:'두 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-k)>0.5) return {ok:false, msg:'지금 단계는 '+r[0]+' 입니다.'};
     if(Math.abs(got[1]-1)>0.1) return {ok:false, msg:'모순에 이르렀으므로 1 입니다.'};
     mem.k2=k; mem.ok2=true;
     return {ok:true, msg:'계산했습니다 — 서로소라고 해 놓고 둘 다 짝수가 나왔습니다.'};
   }}""",
 """  {t:'판단 — 무엇이 무너졌는지 고르세요',
   f:'①의 단계 = {0} · ②의 단계 = {1} · 무너진 것이 처음 가정이면 1, 결론이면 0 → {2}',
   opts:['가정에서 출발해 <b>그 가정 자신이 깨지는 곳</b> 까지 밀고 가는 것이 귀류법이다 — 모순이 나왔으니 처음 가정이 틀린 것이고, 따라서 √2 는 유리수가 아니다',
         '모순이 나오면 계산을 잘못한 것이다',
         '증명할 것을 가정에 넣어도 같은 증명이 된다'],
   chk(got, r, mem, pick){
     if(!mem.ok2) return {ok:false, msg:'② 칸을 먼저 통과하세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-mem.k1)>0.5) return {ok:false, msg:'①에 적은 '+mem.k1+' 입니다.'};
     if(Math.abs(got[1]-mem.k2)>0.5) return {ok:false, msg:'②에 적은 '+mem.k2+' 입니다.'};
     if(Math.abs(got[2]-1)>0.1) return {ok:false, msg:'서로소라던 것은 가정이었습니다.'};
     if(pick!==0)
       return {ok:false, msg:'계산은 한 줄도 틀리지 않았는데 끝에서 어긋났습니다. 무엇이 틀린 것일까요? 다시 고르세요.'};
     return {ok:true, msg:'판단했습니다 — <b>가정이 스스로 무너지면 그 가정이 거짓입니다.</b> 다만 증명할 것을 가정에 몰래 넣으면 순환논법이 되어 아무것도 증명하지 못합니다.'};
   }}""")
 +
 note(308, '내가 고르고 · 내가 반례를 찾고 · 내가 판단한다',
 """  {t:'기록 — <b>전건긍정</b> 을 고르고 적으세요',
   f:'타당하면 1, 아니면 0 → {0} · 반례가 있으면 1, 없으면 0 → {1}',
   chk(got, r, mem){
     if(!r) return {ok:false, msg:'아직 화면 값이 없습니다.'};
     if(String(r[0])!=='전건긍정') return {ok:false, msg:'지금은 «'+r[0]+'» 입니다 — 전건긍정을 고르세요.'};
     if(![0,1].every(j=>isFinite(got[j]))) return {ok:false, msg:'두 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-1)>0.1) return {ok:false, msg:'화면은 «'+r[2]+'» 이라고 합니다.'};
     if(Math.abs(got[1])>0.1) return {ok:false, msg:'반례가 «'+r[3]+'» 입니다.'};
     mem.ok1=true;
     return {ok:true, msg:'기록했습니다 — 비가 오면 젖는다, 비가 왔다 → 젖었다. 반례가 없습니다.'};
   }}""",
 """  {t:'생각 — <b>후건긍정</b> 으로 바꾸고 적으세요',
   f:'타당하면 1, 아니면 0 → {0} · 반례가 있으면 1, 없으면 0 → {1}',
   chk(got, r, mem){
     if(!mem.ok1) return {ok:false, msg:'① 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     if(String(r[0])!=='후건긍정') return {ok:false, msg:'지금은 «'+r[0]+'» 입니다 — 후건긍정으로 바꾸세요.'};
     if(![0,1].every(j=>isFinite(got[j]))) return {ok:false, msg:'두 칸을 모두 채우세요.'};
     if(Math.abs(got[0])>0.1) return {ok:false, msg:'화면은 «'+r[2]+'» 이라고 합니다.'};
     if(Math.abs(got[1]-1)>0.1) return {ok:false, msg:'반례가 «'+r[3]+'» 로 있습니다.'};
     mem.ok2=true;
     return {ok:true, msg:'계산했습니다 — 젖었다고 비가 온 것은 아닙니다. 물차가 지나갔을 수도 있습니다.'};
   }}""",
 """  {t:'판단 — 네 형태를 모두 보고 고르세요',
   f:'①의 판정(타당 1) = {0} · ②의 판정(타당 1) = {1} · 네 형태 가운데 타당한 것의 수 = {2}',
   opts:['<b>전건긍정과 후건부정</b> 둘만 타당하다 — 후건부정은 대우와 같은 말이고, 후건긍정(역)과 전건부정(이)은 반례가 있어 보장되지 않는다',
         '네 형태 모두 일상에서는 쓸 수 있으므로 타당하다',
         '반례가 있어도 대부분 맞으면 타당하다'],
   chk(got, r, mem, pick){
     if(!mem.ok2) return {ok:false, msg:'② 칸을 먼저 통과하세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-1)>0.1) return {ok:false, msg:'①은 타당했습니다.'};
     if(Math.abs(got[1])>0.1) return {ok:false, msg:'②는 타당하지 않았습니다.'};
     if(Math.abs(got[2]-2)>0.1) return {ok:false, msg:'네 형태를 하나씩 눌러 판정을 세어 보세요.'};
     if(pick!==0)
       return {ok:false, msg:'반례가 하나라도 있으면 그 형태는 타당하지 않았습니다. 타당한 것은 몇 개였나요? 다시 고르세요.'};
     return {ok:true, msg:'판단했습니다 — <b>참인 조건문의 역은 참이 아닙니다.</b> 「검사에서 양성이면 병이다」 같은 말이 흔히 저지르는 후건긍정이고, 조건부확률에서 다시 만나게 됩니다.'};
   }}""")
 +
 note(309, '내가 세고 · 내가 줄에 갇히고 · 내가 판단한다',
 """  {t:'기록 — <b>대각선으로 30 번 이상</b> 세고 적으세요',
   f:'붙인 번호 = {0} · 서로 다른 분수의 수 = {1}',
   chk(got, r, mem){
     if(!r) return {ok:false, msg:'아직 화면 값이 없습니다.'};
     const n=noteNum(r[0]), d=noteNum(r[3]);
     if(String(r[2])!=='대각선') return {ok:false, msg:'「분모별로 세기」 를 끄고 적으세요 — ②에서 켤 것입니다.'};
     if(!(n>=30)) return {ok:false, msg:'번호가 '+r[0]+' 입니다 — 30 번 이상까지 붙이세요.'};
     if(![0,1].every(j=>isFinite(got[j]))) return {ok:false, msg:'두 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-n)>0.5) return {ok:false, msg:'붙인 번호는 '+r[0]+' 입니다.'};
     if(Math.abs(got[1]-d)>0.5) return {ok:false, msg:'서로 다른 분수의 수는 '+r[3]+' 입니다.'};
     mem.n1=n; mem.d1=d;
     return {ok:true, msg:'기록했습니다 — 대각선으로 훑으니 여러 줄의 분수가 골고루 번호를 받습니다.'};
   }}""",
 """  {t:'생각 — <b>「분모별로 세기」</b> 를 켜고 같은 번호까지 세어 적으세요',
   f:'붙인 번호 = {0} · 서로 다른 분수의 수 = {1} · ①보다 얼마나 많은가 = {2}',
   chk(got, r, mem){
     if(mem.d1===undefined) return {ok:false, msg:'① 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const n=noteNum(r[0]), d=noteNum(r[3]);
     if(String(r[2])!=='분모별') return {ok:false, msg:'「분모별로 세기」 를 켜세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-n)>0.5) return {ok:false, msg:'붙인 번호는 '+r[0]+' 입니다.'};
     if(Math.abs(got[1]-d)>0.5) return {ok:false, msg:'서로 다른 분수의 수는 '+r[3]+' 입니다.'};
     if(Math.abs(got[2]-(d-mem.d1))>0.5) return {ok:false, msg:'①의 '+mem.d1+' 을 빼면 얼마인가요?'};
     mem.d2=d; mem.ok2=true;
     return {ok:true, msg:'계산했습니다 — 겹치는 분수는 없지만 분모 1 인 줄에 갇혀 1/2 에는 영영 닿지 못합니다.'};
   }}""",
 """  {t:'판단 — 두 방법을 나란히 두고 고르세요',
   f:'①의 서로 다른 분수 = {0} · ②의 서로 다른 분수 = {1} · 1/2 이 번호를 받는 쪽이 대각선이면 1 → {2}',
   opts:['<b>번호를 빠짐없이 붙일 수 있으면</b> 자연수만큼 있는 것이다 — 대각선으로 훑으면 어떤 분수든 유한 번째에 나오지만, 분모별로 세면 한 줄에 갇혀 다른 줄에 영영 닿지 못한다',
         '분수는 자연수 사이사이에 빽빽하므로 자연수보다 많다',
         '겹치는 분수가 있으므로 번호를 붙일 수 없다'],
   chk(got, r, mem, pick){
     if(!mem.ok2) return {ok:false, msg:'② 칸을 먼저 통과하세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-mem.d1)>0.5) return {ok:false, msg:'①에 적은 '+mem.d1+' 입니다.'};
     if(Math.abs(got[1]-mem.d2)>0.5) return {ok:false, msg:'②에 적은 '+mem.d2+' 입니다.'};
     if(Math.abs(got[2]-1)>0.1) return {ok:false, msg:'1/2 은 어느 쪽에서 번호를 받았나요?'};
     if(pick!==0)
       return {ok:false, msg:'대각선으로는 모든 분수가 언젠가 번호를 받았습니다. 그것은 무슨 뜻일까요? 다시 고르세요.'};
     return {ok:true, msg:'판단했습니다 — <b>분수는 자연수만큼 있습니다(가산).</b> 빽빽하게 들어차 있는 것과 「개수」 는 다른 이야기입니다.'};
   }}""")
 +
 note(310, '내가 만들고 · 내가 늘리고 · 내가 판단한다',
 """  {t:'기록 — <b>대각선을 바꿔 새 수</b> 를 만들고 적으세요',
   f:'목록 개수 = {0} · 만든 수 = {1}',
   chk(got, r, mem){
     if(!r) return {ok:false, msg:'아직 화면 값이 없습니다.'};
     const n=noteNum(r[0]), v=noteNum(r[1]);
     if(!isFinite(v)) return {ok:false, msg:'「대각선을 바꿔 새 수 만들기」 를 누르세요.'};
     if(String(r[2])!=='없음') return {ok:false, msg:'화면은 «'+r[2]+'» 이라고 합니다 — 「9 를 0 으로 바꾸기」 를 끄고 다시 만드세요.'};
     if(![0,1].every(j=>isFinite(got[j]))) return {ok:false, msg:'두 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-n)>0.5) return {ok:false, msg:'목록 개수는 '+r[0]+' 입니다.'};
     if(Math.abs(got[1]-v)>0.0005) return {ok:false, msg:'만든 수는 '+r[1]+' 입니다.'};
     mem.n1=n; mem.v1=v;
     return {ok:true, msg:'기록했습니다 — 만든 수가 목록의 어느 줄과도 다릅니다.'};
   }}""",
 """  {t:'생각 — <b>목록을 더 길게</b> 하고 다시 만들어 적으세요',
   f:'목록 개수 = {0} · 만든 수 = {1} · 목록에 있으면 1, 없으면 0 → {2}',
   chk(got, r, mem){
     if(mem.v1===undefined) return {ok:false, msg:'① 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const n=noteNum(r[0]), v=noteNum(r[1]);
     if(!(n>mem.n1)) return {ok:false, msg:'목록이 '+r[0]+' 줄입니다 — ①의 '+mem.n1+' 보다 늘리세요.'};
     if(!isFinite(v)) return {ok:false, msg:'「대각선을 바꿔 새 수 만들기」 를 다시 누르세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-n)>0.5) return {ok:false, msg:'목록 개수는 '+r[0]+' 입니다.'};
     if(Math.abs(got[1]-v)>0.0005) return {ok:false, msg:'만든 수는 '+r[1]+' 입니다.'};
     if(Math.abs(got[2]-(String(r[2])==='있음'?1:0))>0.1) return {ok:false, msg:'화면은 «'+r[2]+'» 이라고 합니다.'};
     mem.n2=n; mem.ok2=true;
     return {ok:true, msg:'계산했습니다 — 목록을 늘려도 또 목록에 없는 수가 만들어집니다.'};
   }}""",
 """  {t:'판단 — 목록을 아무리 늘려도 어떤지 고르세요',
   f:'①의 목록 개수 = {0} · ②의 목록 개수 = {1} · 목록을 아무리 늘려도 빠진 수가 생기면 1 → {2}',
   opts:['n 번째 줄과 <b>n 번째 자리</b> 를 다르게 만들면 그 줄과는 반드시 다르다 — 어떤 목록을 가져와도 같은 방법으로 빠진 수를 만들 수 있으므로, 0 과 1 사이의 수에는 번호를 붙일 수 없다',
         '목록을 충분히 길게 하면 언젠가는 모든 수가 들어간다',
         '만든 수도 결국 목록 어딘가에 있을 것이다'],
   chk(got, r, mem, pick){
     if(!mem.ok2) return {ok:false, msg:'② 칸을 먼저 통과하세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-mem.n1)>0.5) return {ok:false, msg:'①에 적은 '+mem.n1+' 입니다.'};
     if(Math.abs(got[1]-mem.n2)>0.5) return {ok:false, msg:'②에 적은 '+mem.n2+' 입니다.'};
     if(Math.abs(got[2]-1)>0.1) return {ok:false, msg:'목록을 늘려도 또 빠진 수가 나왔습니다.'};
     if(pick!==0)
       return {ok:false, msg:'목록을 늘릴 때마다 새로 빠진 수가 생겼습니다. 왜 그럴 수밖에 없을까요? 다시 고르세요.'};
     return {ok:true, msg:'판단했습니다 — <b>실수는 자연수만큼이 아닙니다(비가산).</b> 분수에는 번호를 붙일 수 있었지만 실수에는 어떤 목록도 빠짐없을 수 없습니다 — 무한에도 크기가 여럿입니다.'};
   }}""")
)
