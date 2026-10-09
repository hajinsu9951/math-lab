# -*- coding: utf-8 -*-
"""LAB 151~160 탐구 노트 — 기록 → 생각 → 판단. 판정은 화면의 read() 값으로만 한다."""


def note(no, head, c1, c2, c3):
    return "\n %d:{ h:'%s',\n  c:[\n%s,\n%s,\n%s\n ]},\n" % (no, head, c1, c2, c3)


NOTES = (
 note(151, '내가 세고 · 내가 재고 · 내가 판단한다',
 """  {t:'기록 — 지금 n 과 p 로 <b>평균과 표준편차</b> 를 손으로 구하세요',
   f:'n = {0} · 평균 np = {1} · 표준편차 √(np(1−p)) = {2}',
   chk(got, r, mem){
     if(!r) return {ok:false, msg:'아직 화면 값이 없습니다.'};
     const n=noteNum(r[0]), p=noteNum(r[1])/100;
     const mu=n*p, sd=Math.sqrt(n*p*(1-p));
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-n)>0.5) return {ok:false, msg:'n 은 '+r[0]+' 입니다.'};
     if(Math.abs(got[1]-mu)>0.15) return {ok:false, msg:'n 과 p 를 곱하세요 (p = '+r[1]+').'};
     if(Math.abs(got[2]-sd)>0.08) return {ok:false, msg:'√(np(1−p)) 를 구하세요.'};
     mem.n=n; mem.p=p; mem.mu=mu; mem.sd=sd;
     return {ok:true, msg:'기록했습니다 — 평균 '+mu.toFixed(1)+', 표준편차 '+sd.toFixed(2)+'. 이제 관찰값이 여기서 얼마나 떨어졌는지 재 봅시다.'};
   }}""",
 """  {t:'생각 — z 를 손으로 구해 화면과 맞춰 보세요',
   f:'k = {0} · (k − 평균) ÷ 표준편차 = {1} · 화면의 z 와의 차 = {2}',
   chk(got, r, mem){
     if(mem.n===undefined) return {ok:false, msg:'① 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const n=noteNum(r[0]), k=noteNum(r[2]), z=noteNum(r[4]);
     if(n!==mem.n) return {ok:false, msg:'n 은 ①과 같은 '+mem.n+' 으로 두세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-k)>0.5) return {ok:false, msg:'k 는 '+r[2]+' 입니다.'};
     if(Math.abs(got[1]-z)>0.04) return {ok:false, msg:'①의 평균 '+mem.mu.toFixed(1)+' 과 표준편차 '+mem.sd.toFixed(2)+' 를 쓰세요.'};
     if(Math.abs(got[2])>0.04) return {ok:false, msg:'내가 구한 값에서 화면의 z = '+r[4]+' 를 빼 보세요.'};
     mem.z=z; mem.rate=k/n; mem.ok2=true;
     return {ok:true, msg:'계산했습니다 — z 가 '+r[4]+' 입니다. 비율은 그대로 두고 n 만 키우면 어떻게 될까요?'};
   }}""",
 """  {t:'판단 — <b>n 을 두 배 넘게</b> 키우고 같은 비율이 되도록 k 를 맞춘 뒤 고르세요',
   f:'새 n = {0} · 새 k = {1} · z = {2}',
   opts:['같은 비율이어도 <b>n 이 커지면 z 가 커진다</b> — 표준편차는 √n 에 비례해 느리게 자라기 때문',
         '비율이 같으면 드문 정도도 같다',
         'n 이 커지면 z 가 작아진다'],
   chk(got, r, mem, pick){
     if(!mem.ok2) return {ok:false, msg:'② 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const n=noteNum(r[0]), k=noteNum(r[2]), z=noteNum(r[4]);
     if(!(n >= mem.n*2)) return {ok:false, msg:'n 이 '+r[0]+' 입니다. ①의 '+mem.n+' 의 두 배 넘게 키우세요.'};
     if(Math.abs(k/n - mem.rate) > 0.015)
       return {ok:false, msg:'비율을 ②와 같게 맞추세요 — k 가 약 '+Math.round(mem.rate*n)+' 이어야 합니다 (지금 '+r[2]+').'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-n)>0.5||Math.abs(got[1]-k)>0.5)
       return {ok:false, msg:'지금은 n = '+r[0]+' · k = '+r[2]+' 입니다.'};
     if(Math.abs(got[2]-z)>0.04) return {ok:false, msg:'화면의 z 는 '+r[4]+' 입니다.'};
     if(pick!==0)
       return {ok:false, msg:'같은 비율인데 z 가 '+mem.z+' 에서 '+r[4]+' 로 바뀌었습니다. 다시 고르세요.'};
     return {ok:true, msg:'판단했습니다 — <b>평균은 n 에 비례해 자라지만 표준편차는 √n 에만 비례합니다.</b> 그래서 같은 60%라도 10번에 6번은 흔하고 1000번에 600번은 거의 일어나지 않습니다.'};
   }}""")
 +
 note(152, '내가 키우고 · 내가 치우치게 하고 · 내가 판단한다',
 """  {t:'기록 — <b>np 가 5 보다 작게</b> 만들고 오차를 적으세요',
   f:'n = {0} · np = {1} · 상대 오차(%) = {2}',
   chk(got, r, mem){
     if(!r) return {ok:false, msg:'아직 화면 값이 없습니다.'};
     const n=noteNum(r[0]), np=noteNum(r[2]), e=noteNum(r[4]);
     if(!(np<5)) return {ok:false, msg:'지금 np = '+r[2]+' 입니다. n 이나 p 를 줄여 5 아래로 만드세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-n)>0.5) return {ok:false, msg:'n 은 '+r[0]+' 입니다.'};
     if(Math.abs(got[1]-np)>0.15||Math.abs(got[2]-e)>0.15)
       return {ok:false, msg:'화면은 np = '+r[2]+' · 상대 오차 '+r[4]+' 입니다.'};
     mem.n=n; mem.np=np; mem.e=e; mem.p=noteNum(r[1]);
     return {ok:true, msg:'기록했습니다 — 아직 막대와 곡선이 많이 어긋납니다. n 을 키워 봅시다.'};
   }}""",
 """  {t:'생각 — p 는 그대로 두고 <b>n 을 네 배 넘게</b> 키우세요',
   f:'새 n = {0} · np = {1} · 상대 오차(%) = {2}',
   chk(got, r, mem){
     if(mem.n===undefined) return {ok:false, msg:'① 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const n=noteNum(r[0]), p=noteNum(r[1]), np=noteNum(r[2]), e=noteNum(r[4]);
     if(Math.abs(p-mem.p)>0.5) return {ok:false, msg:'p 는 ①과 같은 '+mem.p+'% 로 두세요 — n 만 바꿉니다.'};
     if(!(n >= mem.n*4)) return {ok:false, msg:'n 이 '+r[0]+' 입니다. ①의 '+mem.n+' 의 네 배 넘게 키우세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-n)>0.5||Math.abs(got[1]-np)>0.15||Math.abs(got[2]-e)>0.15)
       return {ok:false, msg:'지금은 n = '+r[0]+' · np = '+r[2]+' · 오차 '+r[4]+' 입니다.'};
     if(!(e < mem.e)) return {ok:false, msg:'오차가 '+r[4]+' 로 ①의 '+mem.e+'% 보다 줄지 않았습니다 — 더 키워 보세요.'};
     mem.ok2=true;
     return {ok:true, msg:'계산했습니다 — np 가 5 를 넘자 막대가 곡선에 포개집니다.'};
   }}""",
 """  {t:'판단 — n 은 그대로 두고 <b>p 를 한쪽으로 치우치게</b> 한 뒤 고르세요',
   f:'p(%) = {0} · np = {1} · 상대 오차(%) = {2}',
   opts:['n 이 아니라 <b>np 와 n(1−p) 가 모두 5 이상</b> 이어야 종 모양으로 봐도 된다 — 꼬리가 0 에 잘리면 안 되기 때문',
         'n 만 충분히 크면 p 가 무엇이든 괜찮다',
         'p 가 작을수록 종 모양에 빨리 가까워진다'],
   chk(got, r, mem, pick){
     if(!mem.ok2) return {ok:false, msg:'② 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const p=noteNum(r[1]), np=noteNum(r[2]), nq=noteNum(r[3]), e=noteNum(r[4]);
     if(!(p<=15||p>=85)) return {ok:false, msg:'p 가 '+r[1]+' 입니다. 15% 아래나 85% 위로 치우치게 하세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-p)>0.5) return {ok:false, msg:'p 는 '+r[1]+' 입니다.'};
     if(Math.abs(got[1]-np)>0.15||Math.abs(got[2]-e)>0.15)
       return {ok:false, msg:'지금은 np = '+r[2]+' · 오차 '+r[4]+' 입니다.'};
     if(pick!==0)
       return {ok:false, msg:'n 은 그대로인데 p 를 치우치게 하니 np = '+r[2]+', n(1−p) = '+r[3]+' 가 되고 오차가 '+r[4]+' 로 달라졌습니다. 다시 고르세요.'};
     return {ok:true, msg:'판단했습니다 — <b>기준은 n 이 아니라 np 와 n(1−p) 입니다.</b> 둘 중 하나라도 작으면 분포가 0 쪽에 눌려 한쪽으로 치우치고, 좌우 대칭인 정규곡선으로는 설명되지 않습니다.'};
   }}""")
 +
 note(153, '내가 재고 · 내가 넓히고 · 내가 판단한다',
 """  {t:'기록 — 구간 폭을 <b>1σ</b> 로 두고 적으세요',
   f:'μ = {0} · σ = {1} · 안쪽 % = {2}',
   chk(got, r, mem){
     if(!r) return {ok:false, msg:'아직 화면 값이 없습니다.'};
     const mu=noteNum(r[0]), sd=noteNum(r[1]), z=noteNum(r[2]), pc=noteNum(r[4]);
     if(Math.abs(z-1)>0.01) return {ok:false, msg:'구간 폭이 '+r[2]+'σ 입니다. 1σ 로 맞추세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-mu)>0.5||Math.abs(got[1]-sd)>0.5)
       return {ok:false, msg:'화면은 μ = '+r[0]+' · σ = '+r[1]+' 입니다.'};
     if(Math.abs(got[2]-pc)>0.15) return {ok:false, msg:'안쪽 %는 '+r[4]+' 입니다.'};
     mem.mu=mu; mem.sd=sd; mem.p1=pc;
     return {ok:true, msg:'기록했습니다 — 1σ 안에 '+r[4]+' 입니다. 폭을 2σ 로 넓혀 봅시다.'};
   }}""",
 """  {t:'생각 — 구간 폭을 <b>2σ</b> 로 넓혀 적으세요',
   f:'구간의 아래끝 = {0} · 위끝 = {1} · 안쪽 % = {2}',
   chk(got, r, mem){
     if(mem.mu===undefined) return {ok:false, msg:'① 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const mu=noteNum(r[0]), sd=noteNum(r[1]), z=noteNum(r[2]), pc=noteNum(r[4]);
     if(Math.abs(z-2)>0.01) return {ok:false, msg:'구간 폭이 '+r[2]+'σ 입니다. 2σ 로 맞추세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-(mu-2*sd))>0.6||Math.abs(got[1]-(mu+2*sd))>0.6)
       return {ok:false, msg:'μ ± 2σ 를 계산하세요 — 화면에 '+r[3]+' 로 나와 있습니다.'};
     if(Math.abs(got[2]-pc)>0.15) return {ok:false, msg:'안쪽 %는 '+r[4]+' 입니다.'};
     mem.p2=pc; mem.ok2=true;
     return {ok:true, msg:'계산했습니다 — 2σ 안에 '+r[4]+' 입니다. 이제 μ 와 σ 를 바꿔 봅시다.'};
   }}""",
 """  {t:'판단 — 폭은 <b>2σ 그대로</b> 두고 μ 와 σ 를 바꾼 뒤 고르세요',
   f:'새 μ = {0} · 새 σ = {1} · 안쪽 % = {2}',
   opts:['z = (x − μ)/σ 로 <b>표준화</b> 하면 μ 와 σ 가 사라진다 — 그래서 어떤 정규분포든 비율이 같다',
         'σ 가 크면 안쪽 비율도 커진다',
         'μ 를 옮기면 안쪽 비율이 달라진다'],
   chk(got, r, mem, pick){
     if(!mem.ok2) return {ok:false, msg:'② 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const mu=noteNum(r[0]), sd=noteNum(r[1]), z=noteNum(r[2]), pc=noteNum(r[4]);
     if(Math.abs(z-2)>0.01) return {ok:false, msg:'폭은 2σ 그대로 두세요 (지금 '+r[2]+'σ).'};
     if(mu===mem.mu && sd===mem.sd)
       return {ok:false, msg:'μ 와 σ 가 그대로입니다 — 둘 다 바꿔 보세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-mu)>0.5||Math.abs(got[1]-sd)>0.5)
       return {ok:false, msg:'지금은 μ = '+r[0]+' · σ = '+r[1]+' 입니다.'};
     if(Math.abs(got[2]-pc)>0.15) return {ok:false, msg:'안쪽 %는 '+r[4]+' 입니다.'};
     if(pick!==0)
       return {ok:false, msg:'μ 와 σ 를 바꿨는데도 안쪽이 '+mem.p2+'% 에서 '+r[4]+' 로 그대로입니다. 다시 고르세요.'};
     return {ok:true, msg:'판단했습니다 — <b>68 · 95 · 99.7</b> 은 모든 정규분포에 그대로 통합니다. 「2σ 밖이면 이상하다」가 품질관리·이상치 판정의 관습적 기준이 된 까닭입니다.'};
   }}""")
 +
 note(154, '내가 뽑고 · 내가 늘리고 · 내가 판단한다',
 """  {t:'기록 — n 을 <b>1</b> 로 두고 500번 뽑아 적으세요',
   f:'표본평균의 표준편차 = {0} · 이론값 σ/√n = {1}',
   chk(got, r, mem){
     if(!r) return {ok:false, msg:'아직 화면 값이 없습니다.'};
     const n=noteNum(r[0]), cnt=noteNum(r[1]), sd=noteNum(r[3]), th=noteNum(r[4]);
     if(n!==1) return {ok:false, msg:'표본 크기를 1 로 맞추세요 (지금 '+r[0]+').'};
     if(!(cnt>=100)) return {ok:false, msg:'아직 표본을 뽑지 않았습니다 — 「표본 500번 뽑기」를 누르세요.'};
     if(![0,1].every(j=>isFinite(got[j]))) return {ok:false, msg:'두 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-sd)>0.012||Math.abs(got[1]-th)>0.006)
       return {ok:false, msg:'화면은 '+r[3]+' 와 '+r[4]+' 입니다.'};
     mem.sd1=sd; mem.n=1;
     return {ok:true, msg:'기록했습니다 — n = 1 이면 표본평균이 곧 원자료라 흩어짐이 그대로입니다. 네 개씩 모아 봅시다.'};
   }}""",
 """  {t:'생각 — n 을 <b>4</b> 로 하고 다시 500번 뽑으세요',
   f:'표본평균의 표준편차 = {0} · ①의 몇 분의 1인가 = {1}',
   chk(got, r, mem){
     if(mem.sd1===undefined) return {ok:false, msg:'① 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const n=noteNum(r[0]), cnt=noteNum(r[1]), sd=noteNum(r[3]);
     if(n!==4) return {ok:false, msg:'표본 크기를 4 로 맞추세요 (지금 '+r[0]+').'};
     if(!(cnt>=100)) return {ok:false, msg:'n 을 바꾼 뒤 다시 「표본 500번 뽑기」를 누르세요.'};
     if(![0,1].every(j=>isFinite(got[j]))) return {ok:false, msg:'두 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-sd)>0.012) return {ok:false, msg:'화면은 '+r[3]+' 입니다.'};
     if(Math.abs(got[1]-mem.sd1/sd)>0.25) return {ok:false, msg:'①의 '+mem.sd1+' 를 지금 값으로 나누어 보세요.'};
     mem.sd4=sd; mem.ok2=true;
     return {ok:true, msg:'계산했습니다 — 네 개씩 모았더니 흩어짐이 거의 절반입니다. 네 배가 아니라 두 배로 줄었습니다.'};
   }}""",
 """  {t:'판단 — n 을 <b>16</b> 으로 하고 다시 뽑은 뒤 고르세요',
   f:'표본평균의 표준편차 = {0} · 이론값 σ/√n = {1} · ①의 몇 분의 1인가 = {2}',
   opts:['표본평균의 표준편차는 <b>σ/√n</b> — n 을 네 배로 모아야 흩어짐이 절반이 된다',
         'n 을 네 배로 하면 흩어짐이 4분의 1이 된다',
         '표본을 아무리 늘려도 흩어짐은 그대로다'],
   chk(got, r, mem, pick){
     if(!mem.ok2) return {ok:false, msg:'② 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const n=noteNum(r[0]), cnt=noteNum(r[1]), sd=noteNum(r[3]), th=noteNum(r[4]);
     if(n!==16) return {ok:false, msg:'표본 크기를 16 으로 맞추세요 (지금 '+r[0]+').'};
     if(!(cnt>=100)) return {ok:false, msg:'n 을 바꾼 뒤 다시 뽑으세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-sd)>0.012||Math.abs(got[1]-th)>0.006)
       return {ok:false, msg:'지금은 '+r[3]+' 와 '+r[4]+' 입니다.'};
     if(Math.abs(got[2]-mem.sd1/sd)>0.7) return {ok:false, msg:'①의 '+mem.sd1+' 를 지금 값으로 나누어 보세요.'};
     if(pick!==0)
       return {ok:false, msg:'n 이 1 → 4 → 16 으로 커질 때 흩어짐은 '+mem.sd1+' → '+mem.sd4+' → '+r[3]+' 였습니다. 몇 분의 1씩인가요? 다시 고르세요.'};
     return {ok:true, msg:'판단했습니다 — <b>흩어짐은 n 이 아니라 √n 에 반비례합니다.</b> 그래서 평균은 개인보다 안정되고, 여론조사가 표본을 네 배로 늘려야 겨우 오차를 절반으로 줄입니다.'};
   }}""")
 +
 note(155, '내가 돌리고 · 내가 세고 · 내가 판단한다',
 """  {t:'기록 — 신뢰수준 <b>95%</b> 로 40번 돌려 적으세요',
   f:'포함 = {0} · 전체 = {1} · 포함 비율(%) = {2}',
   chk(got, r, mem){
     if(!r) return {ok:false, msg:'아직 화면 값이 없습니다.'};
     const c=noteNum(r[1]), hit=noteNum(r[2]), tot=noteNum(r[3]);
     if(c!==95) return {ok:false, msg:'신뢰수준을 95% 로 맞추세요 (지금 '+r[1]+').'};
     if(!(tot>=40)) return {ok:false, msg:'아직 '+tot+'번입니다 — 「조사 40번 반복」을 누르세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-hit)>0.5||Math.abs(got[1]-tot)>0.5)
       return {ok:false, msg:'화면은 포함 '+r[2]+' · 전체 '+r[3]+' 입니다.'};
     if(Math.abs(got[2]-hit/tot*100)>1.2) return {ok:false, msg:'포함을 전체로 나누고 100 을 곱하세요.'};
     mem.rate=hit/tot*100; mem.half=noteNum(r[4]);
     return {ok:true, msg:'기록했습니다 — 포함 비율이 '+(hit/tot*100).toFixed(1)+'% 입니다. 신뢰수준 95 와 견주어 보세요.'};
   }}""",
 """  {t:'생각 — 포함 비율과 <b>신뢰수준</b> 의 차를 구하세요',
   f:'포함 비율(%) − 95 = {0} · 오차한계(%p) = {1}',
   chk(got, r, mem){
     if(mem.rate===undefined) return {ok:false, msg:'① 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const half=noteNum(r[4]);
     if(![0,1].every(j=>isFinite(got[j]))) return {ok:false, msg:'두 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-(mem.rate-95))>1.5) return {ok:false, msg:'①의 포함 비율 '+mem.rate.toFixed(1)+'% 에서 95 를 빼세요.'};
     if(Math.abs(got[1]-half)>0.08) return {ok:false, msg:'오차한계는 '+r[4]+' 입니다.'};
     mem.ok2=true;
     return {ok:true, msg:'계산했습니다 — 딱 95 는 아니지만 그 둘레입니다. 40번이 아니라 수천 번이면 더 가까워집니다.'};
   }}""",
 """  {t:'판단 — 신뢰수준을 <b>99%</b> 로 올려 다시 40번 돌린 뒤 고르세요',
   f:'포함 = {0} · 오차한계(%p) = {1} · ①보다 넓어졌으면 1, 아니면 0 → {2}',
   opts:['「95%」는 <b>같은 방법을 되풀이했을 때 95%의 구간이 참값을 품는다</b>는 뜻 — 참값이 움직이는 것이 아니다',
         '참값이 이 구간 안에 있을 확률이 95% 라는 뜻이다',
         '신뢰수준을 올리면 구간이 좁아져 더 정확해진다'],
   chk(got, r, mem, pick){
     if(!mem.ok2) return {ok:false, msg:'② 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const c=noteNum(r[1]), hit=noteNum(r[2]), tot=noteNum(r[3]), half=noteNum(r[4]);
     if(c!==99) return {ok:false, msg:'신뢰수준을 99% 로 올리세요 (지금 '+r[1]+').'};
     if(!(tot>=40)) return {ok:false, msg:'신뢰수준을 바꾼 뒤 다시 40번 돌리세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-hit)>0.5) return {ok:false, msg:'포함은 '+r[2]+' 입니다.'};
     if(Math.abs(got[1]-half)>0.08) return {ok:false, msg:'오차한계는 '+r[4]+' 입니다.'};
     if(Math.abs(got[2]-(half>mem.half?1:0))>0.01) return {ok:false, msg:'①의 오차한계 '+mem.half+' 와 견주어 보세요.'};
     if(pick!==0)
       return {ok:false, msg:'95%에서 '+mem.rate.toFixed(1)+'% 가 참값을 품었고, 99%로 올리니 구간이 넓어졌습니다. 「95%」가 가리키는 것이 무엇일까요? 다시 고르세요.'};
     return {ok:true, msg:'판단했습니다 — <b>확률은 구간 쪽에 있습니다.</b> 참값은 하나로 고정되어 있고, 조사를 되풀이할 때마다 새로 만들어지는 구간들 가운데 95%가 그것을 품습니다. 더 확실해지려면 더 넓어지는 것을 받아들여야 합니다.'};
   }}""")
 +
 note(156, '내가 모으고 · 내가 늘리고 · 내가 판단한다',
 """  {t:'기록 — 지금 n 에서 오차한계를 적으세요',
   f:'n = {0} · 오차한계(%p) = {1} · ±3%p 에 필요한 n = {2}',
   chk(got, r, mem){
     if(!r) return {ok:false, msg:'아직 화면 값이 없습니다.'};
     const n=noteNum(r[0]), e=noteNum(r[3]), need=noteNum(r[4]);
     if(n>1000) return {ok:false, msg:'①은 n 을 1000 이하로 두고 적습니다 — 늘리는 것은 ②에서 합니다.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-n)>0.5) return {ok:false, msg:'n 은 '+r[0]+' 입니다.'};
     if(Math.abs(got[1]-e)>0.03||Math.abs(got[2]-need)>1.5)
       return {ok:false, msg:'화면은 오차한계 '+r[3]+' · 필요 n '+r[4]+' 입니다.'};
     mem.n=n; mem.e=e; mem.c=noteNum(r[1]);
     return {ok:true, msg:'기록했습니다 — n 을 네 배로 하면 오차가 어떻게 될까요?'};
   }}""",
 """  {t:'생각 — n 을 <b>정확히 네 배</b> 로 키우세요',
   f:'새 n = {0} · 오차한계(%p) = {1} · ①의 오차 ÷ 지금 오차 = {2}',
   chk(got, r, mem){
     if(mem.n===undefined) return {ok:false, msg:'① 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const n=noteNum(r[0]), c=noteNum(r[1]), e=noteNum(r[3]);
     if(Math.abs(c-mem.c)>0.5) return {ok:false, msg:'신뢰수준은 ①과 같은 '+mem.c+'% 로 두세요.'};
     if(n!==mem.n*4) return {ok:false, msg:'n 을 ①의 네 배인 '+(mem.n*4)+' 으로 맞추세요 (지금 '+r[0]+').'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-n)>0.5||Math.abs(got[1]-e)>0.03)
       return {ok:false, msg:'지금은 n = '+r[0]+' · 오차 '+r[3]+' 입니다.'};
     if(Math.abs(got[2]-mem.e/e)>0.12) return {ok:false, msg:'①의 오차 '+mem.e+' 를 지금 오차로 나누어 보세요.'};
     mem.ok2=true;
     return {ok:true, msg:'계산했습니다 — 네 배를 모아 겨우 절반입니다. 비용은 네 배인데 말입니다.'};
   }}""",
 """  {t:'판단 — n 은 그대로 두고 <b>신뢰수준을 올린</b> 뒤 고르세요',
   f:'신뢰수준(%) = {0} · z = {1} · 오차한계(%p) = {2}',
   opts:['오차한계 = z√(0.25/n) — n 은 <b>제곱근 아래</b> 에 있고, 모집단 크기는 식에 아예 없다',
         '모집단이 클수록 표본도 비례해서 커야 한다',
         'n 을 두 배로 하면 오차가 절반이 된다'],
   chk(got, r, mem, pick){
     if(!mem.ok2) return {ok:false, msg:'② 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const c=noteNum(r[1]), z=noteNum(r[2]), e=noteNum(r[3]);
     if(!(c > mem.c)) return {ok:false, msg:'신뢰수준이 '+r[1]+' 입니다. ①의 '+mem.c+'% 보다 올리세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-c)>0.5) return {ok:false, msg:'신뢰수준은 '+r[1]+' 입니다.'};
     if(Math.abs(got[1]-z)>0.01||Math.abs(got[2]-e)>0.03)
       return {ok:false, msg:'지금은 z = '+r[2]+' · 오차 '+r[3]+' 입니다.'};
     if(pick!==0)
       return {ok:false, msg:'n 을 네 배로 해도 오차는 절반이었고, 신뢰수준을 올리니 같은 n 에서 오차가 커졌습니다. 식의 어디를 보아야 할까요? 다시 고르세요.'};
     return {ok:true, msg:'판단했습니다 — <b>정확도는 비싸게 사는 것입니다.</b> 오차를 절반으로 줄이려면 사람을 네 배 모아야 하고, 그래서 전국 조사든 한 도시 조사든 표본은 1000명 남짓에서 멈춥니다.'};
   }}""")
 +
 note(157, '내가 재고 · 내가 옮기고 · 내가 판단한다',
 """  {t:'기록 — 점을 하나 정해 두 거리를 적으세요',
   f:'x = {0} · 초점까지 = {1} · 준선까지 = {2}',
   chk(got, r, mem){
     if(!r) return {ok:false, msg:'아직 화면 값이 없습니다.'};
     const x=noteNum(r[1]), dF=noteNum(r[3]), dL=noteNum(r[4]);
     if(Math.abs(x)<0.3) return {ok:false, msg:'꼭짓점(x = 0)은 너무 특별합니다 — 옆으로 옮기세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-x)>0.06) return {ok:false, msg:'x 는 '+r[1]+' 입니다.'};
     if(Math.abs(got[1]-dF)>0.004||Math.abs(got[2]-dL)>0.004)
       return {ok:false, msg:'화면은 초점까지 '+r[3]+' · 준선까지 '+r[4]+' 입니다.'};
     mem.x=x; mem.p=noteNum(r[0]); mem.d=dF;
     return {ok:true, msg:'기록했습니다 — 두 값이 같아 보입니다. 정말 같은지 빼 봅시다.'};
   }}""",
 """  {t:'생각 — <b>점을 옮겨</b> 두 거리의 차를 구하세요',
   f:'새 x = {0} · 초점까지 − 준선까지 = {1}',
   chk(got, r, mem){
     if(mem.x===undefined) return {ok:false, msg:'① 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const x=noteNum(r[1]), dF=noteNum(r[3]), dL=noteNum(r[4]);
     if(Math.abs(x-mem.x)<0.4) return {ok:false, msg:'점이 거의 그대로입니다 — 더 옮기세요.'};
     if(![0,1].every(j=>isFinite(got[j]))) return {ok:false, msg:'두 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-x)>0.06) return {ok:false, msg:'x 는 '+r[1]+' 입니다.'};
     if(Math.abs(got[1]-(dF-dL))>0.006) return {ok:false, msg:'두 값을 빼 보세요 — '+r[3]+' 와 '+r[4]+' 입니다.'};
     mem.ok2=true;
     return {ok:true, msg:'계산했습니다 — 어디로 옮겨도 차가 0 입니다.'};
   }}""",
 """  {t:'판단 — <b>p 를 바꿔</b> 접시 모양을 바꾼 뒤 고르세요',
   f:'새 p = {0} · 초점까지 = {1} · 준선까지 = {2}',
   opts:['포물선은 <b>초점과 준선에서 같은 거리</b> 인 점들의 자취 — 그래서 어느 경로로 와도 길이가 같아 전파가 한 점에서 보강된다',
         '접시가 둥글수록 전파가 잘 모인다',
         '초점에 가까운 점일수록 먼저 도착한다'],
   chk(got, r, mem, pick){
     if(!mem.ok2) return {ok:false, msg:'② 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const p=noteNum(r[0]), dF=noteNum(r[3]), dL=noteNum(r[4]);
     if(Math.abs(p-mem.p)<0.25) return {ok:false, msg:'p 가 거의 그대로입니다 — 바꿔 보세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-p)>0.06) return {ok:false, msg:'p 는 '+r[0]+' 입니다.'};
     if(Math.abs(got[1]-dF)>0.004||Math.abs(got[2]-dL)>0.004)
       return {ok:false, msg:'지금은 '+r[3]+' 와 '+r[4]+' 입니다.'};
     if(pick!==0)
       return {ok:false, msg:'점을 옮겨도, p 를 바꿔도 두 거리가 같았습니다. 그것이 무엇의 정의일까요? 다시 고르세요.'};
     return {ok:true, msg:'판단했습니다 — <b>준선까지의 거리 = 초점까지의 거리</b> 이므로, 멀리서 나란히 온 전파는 어느 자리에 떨어지든 같은 길이를 지나 초점에 닿습니다. 위상이 맞아 신호가 커지는 것 — 그래서 접시는 공이 아니라 포물면입니다.'};
   }}""")
 +
 note(158, '내가 당기고 · 내가 돌리고 · 내가 판단한다',
 """  {t:'기록 — 지금 연필 자리에서 두 거리를 적으세요',
   f:'PF₁ = {0} · PF₂ = {1} · 합 = {2}',
   chk(got, r, mem){
     if(!r) return {ok:false, msg:'아직 화면 값이 없습니다.'};
     const a=noteNum(r[0]), c=noteNum(r[1]), d1=noteNum(r[3]), d2=noteNum(r[4]), s=noteNum(r[5]);
     if(!(c>0.3)) return {ok:false, msg:'압정이 거의 겹쳐 원입니다 — c 를 0.3 보다 크게 하세요. 원은 ③에서 만듭니다.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-d1)>0.006||Math.abs(got[1]-d2)>0.006)
       return {ok:false, msg:'화면은 PF₁ = '+r[3]+' · PF₂ = '+r[4]+' 입니다.'};
     if(Math.abs(got[2]-s)>0.008) return {ok:false, msg:'두 거리를 더하세요 — 합은 '+r[5]+' 입니다.'};
     mem.a=a; mem.c=c; mem.s=s; mem.t=String(r[2]);
     return {ok:true, msg:'기록했습니다 — 합이 '+r[5]+' 입니다. 연필을 돌려도 그대로일까요?'};
   }}""",
 """  {t:'생각 — <b>각도를 크게 돌려</b> 합을 다시 구하세요',
   f:'합 = {0} · ①의 합과의 차 = {1} · 합 ÷ a = {2}',
   chk(got, r, mem){
     if(mem.a===undefined) return {ok:false, msg:'① 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const a=noteNum(r[0]), s=noteNum(r[5]);
     if(String(r[2])===mem.t) return {ok:false, msg:'각도가 «'+r[2]+'» 로 그대로입니다 — 돌려 보세요.'};
     if(Math.abs(a-mem.a)>0.06) return {ok:false, msg:'a 는 ①과 같은 '+mem.a.toFixed(1)+' 로 두세요 — 각도만 바꿉니다.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-s)>0.008) return {ok:false, msg:'합은 '+r[5]+' 입니다.'};
     if(Math.abs(got[1]-(s-mem.s))>0.01) return {ok:false, msg:'①의 합 '+mem.s+' 와의 차를 적으세요.'};
     if(Math.abs(got[2]-s/a)>0.03) return {ok:false, msg:'합을 a 로 나누어 보세요. 무엇이 나오나요?'};
     mem.ok2=true;
     return {ok:true, msg:'계산했습니다 — 각도를 돌려도 합이 그대로이고, 그 값은 a 의 두 배입니다.'};
   }}""",
 """  {t:'판단 — c 를 <b>0</b> 으로 줄여 두 압정을 겹친 뒤 고르세요',
   f:'c = {0} · PF₁ = {1} · PF₂ = {2}',
   opts:['타원은 <b>두 초점까지의 거리의 합이 일정</b> 한 점들의 자취 — 그 합이 곧 실의 길이 2a 다',
         '타원은 원을 비스듬히 본 것일 뿐 정의가 따로 없다',
         '연필을 돌리면 두 거리의 합도 함께 변한다'],
   chk(got, r, mem, pick){
     if(!mem.ok2) return {ok:false, msg:'② 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const c=noteNum(r[1]), d1=noteNum(r[3]), d2=noteNum(r[4]);
     if(!(c<0.05)) return {ok:false, msg:'c 가 '+r[1]+' 입니다. 0 까지 줄이세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-c)>0.06) return {ok:false, msg:'c 는 '+r[1]+' 입니다.'};
     if(Math.abs(got[1]-d1)>0.006||Math.abs(got[2]-d2)>0.006)
       return {ok:false, msg:'지금은 '+r[3]+' 와 '+r[4]+' 입니다.'};
     if(Math.abs(d1-d2)>0.01) return {ok:false, msg:'두 거리가 아직 다릅니다 — c 를 끝까지 줄이세요.'};
     if(pick!==0)
       return {ok:false, msg:'각도를 돌려도 합은 '+mem.s+' 로 그대로였고, 압정을 겹치니 두 거리가 같아져 원이 되었습니다. 다시 고르세요.'};
     return {ok:true, msg:'판단했습니다 — <b>원은 두 초점이 한 점으로 겹친 타원</b> 입니다. 행성은 태양을 한 초점에 둔 타원을 돕니다(케플러 제1법칙) — 가까울 때와 멀 때가 생기는 까닭입니다.'};
   }}""")
 +
 note(159, '내가 밀고 · 내가 좁히고 · 내가 판단한다',
 """  {t:'기록 — x 를 <b>작게</b> 두고 간격을 적으세요',
   f:'x = {0} · 곡선 y = {1} · 점근선 y = {2} · 간격 = {3}',
   chk(got, r, mem){
     if(!r) return {ok:false, msg:'아직 화면 값이 없습니다.'};
     const a=noteNum(r[0]), b=noteNum(r[1]), x=noteNum(r[2]);
     const yc=noteNum(r[3]), ya=noteNum(r[4]), g=noteNum(r[5]);
     if(x>8) return {ok:false, msg:'①은 x 를 8 이하로 두고 적습니다 — 멀리 미는 것은 ②에서 합니다.'};
     if(![0,1,2,3].every(j=>isFinite(got[j]))) return {ok:false, msg:'네 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-x)>0.06) return {ok:false, msg:'x 는 '+r[2]+' 입니다.'};
     if(Math.abs(got[1]-yc)>0.0006||Math.abs(got[2]-ya)>0.0006)
       return {ok:false, msg:'화면은 곡선 '+r[3]+' · 점근선 '+r[4]+' 입니다.'};
     if(Math.abs(got[3]-g)>0.0002) return {ok:false, msg:'간격은 '+r[5]+' 입니다.'};
     mem.x=x; mem.g=g; mem.a=a; mem.b=b;
     return {ok:true, msg:'기록했습니다 — 간격이 '+r[5]+' 입니다. x 를 멀리 밀어 봅시다.'};
   }}""",
 """  {t:'생각 — x 를 <b>세 배 넘게</b> 밀어 간격을 다시 구하세요',
   f:'새 x = {0} · 간격 = {1} · ①의 간격 ÷ 지금 간격 = {2}',
   chk(got, r, mem){
     if(mem.x===undefined) return {ok:false, msg:'① 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const a=noteNum(r[0]), b=noteNum(r[1]), x=noteNum(r[2]), g=noteNum(r[5]);
     if(Math.abs(a-mem.a)>0.06||Math.abs(b-mem.b)>0.06)
       return {ok:false, msg:'a 와 b 는 ①과 같게 두세요 (a = '+mem.a.toFixed(1)+', b = '+mem.b.toFixed(1)+').'};
     if(!(x >= mem.x*3)) return {ok:false, msg:'x 가 '+r[2]+' 입니다. ①의 '+mem.x.toFixed(1)+' 의 세 배 넘게 미세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-x)>0.06||Math.abs(got[1]-g)>0.0002)
       return {ok:false, msg:'지금은 x = '+r[2]+' · 간격 '+r[5]+' 입니다.'};
     if(!(g>0)) return {ok:false, msg:'간격이 0 으로 나왔습니다 — 화면을 다시 보세요.'};
     if(Math.abs(got[2]-mem.g/g)>0.6) return {ok:false, msg:'①의 간격 '+mem.g+' 를 지금 간격으로 나누어 보세요.'};
     mem.g2=g; mem.ok2=true;
     return {ok:true, msg:'계산했습니다 — 간격이 크게 줄었지만 '+r[5]+' 로 아직 0 이 아닙니다.'};
   }}""",
 """  {t:'판단 — 간격이 <b>정확히 0</b> 이 되는 x 가 있는지 판정한 뒤 고르세요',
   f:'지금 간격 = {0} · 간격이 0 이 되는 x 가 있으면 1, 없으면 0 → {1}',
   opts:['간격은 0 으로 <b>수렴</b> 하지만 어떤 x 에서도 0 이 되지 않는다 — 이것이 「점근」 이다',
         'x 가 충분히 크면 곡선이 점근선과 만난다',
         '간격이 0.001 아래면 만난 것으로 본다'],
   chk(got, r, mem, pick){
     if(!mem.ok2) return {ok:false, msg:'② 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const g=noteNum(r[5]);
     if(![0,1].every(j=>isFinite(got[j]))) return {ok:false, msg:'두 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-g)>0.0002) return {ok:false, msg:'화면의 간격은 '+r[5]+' 입니다.'};
     if(Math.abs(got[1])>0.01)
       return {ok:false, msg:'x 를 아무리 크게 해도 간격이 0 이 되던가요? 0 또는 1 로 답하세요.'};
     if(pick!==0)
       return {ok:false, msg:'간격이 '+mem.g+' 에서 '+mem.g2+' 로 줄었지만 0 은 아니었습니다. 다시 고르세요.'};
     return {ok:true, msg:'판단했습니다 — <b>한없이 가까워지지만 결코 만나지 않는다.</b> 「0 으로 수렴한다」와 「0 이 된다」가 다르다는 것 — 극한이 말하는 바가 바로 이것입니다.'};
   }}""")
 +
 note(160, '내가 재고 · 내가 나누고 · 내가 판단한다',
 """  {t:'기록 — 시간 차를 정하고 <b>거리 차</b> 를 손으로 구하세요',
   f:'시간 차(ms) = {0} · 0.343 × 시간 차 = {1} · 화면의 거리 차와의 차 = {2}',
   chk(got, r, mem){
     if(!r) return {ok:false, msg:'아직 화면 값이 없습니다.'};
     const dt=noteNum(r[0]), dd=noteNum(r[1]);
     if(Math.abs(dt)<0.5) return {ok:false, msg:'시간 차가 '+r[0]+' 입니다. 0 에서 충분히 벗어나게 하세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-dt)>0.06) return {ok:false, msg:'시간 차는 '+r[0]+' 입니다.'};
     if(Math.abs(got[1]-0.343*dt)>0.02) return {ok:false, msg:'0.343 에 시간 차를 곱하세요.'};
     if(Math.abs(got[2])>0.02) return {ok:false, msg:'내가 구한 값에서 화면의 거리 차 '+r[1]+' 를 빼 보세요.'};
     mem.dt=dt; mem.dd=dd;
     return {ok:true, msg:'기록했습니다 — 시간 차 하나로 거리 차가 정해집니다. 이 값이 쌍곡선의 무엇일까요?'};
   }}""",
 """  {t:'생각 — <b>거리 차 ÷ 2</b> 를 구해 화면의 a 와 맞춰 보세요',
   f:'거리 차 ÷ 2 = {0} · 화면의 a = {1} · 두 값의 차 = {2}',
   chk(got, r, mem){
     if(mem.dt===undefined) return {ok:false, msg:'① 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const dd=noteNum(r[1]), a=noteNum(r[2]);
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-Math.abs(dd)/2)>0.02) return {ok:false, msg:'거리 차 '+r[1]+' 를 2 로 나누세요.'};
     if(Math.abs(got[1]-a)>0.02) return {ok:false, msg:'화면의 a 는 '+r[2]+' 입니다.'};
     if(Math.abs(got[2])>0.02) return {ok:false, msg:'두 값을 빼 보세요. 무엇이 나오나요?'};
     mem.ok2=true;
     return {ok:true, msg:'계산했습니다 — 거리 차가 쌍곡선의 2a 입니다. 그런데 아직 어디인지는 모릅니다.'};
   }}""",
 """  {t:'판단 — <b>「세 번째 마이크 켜기」</b> 를 누른 뒤 고르세요',
   f:'마이크 수 = {0} · 알 수 있는 것이 「한 점」이면 1, 「곡선 하나」면 0 → {1}',
   opts:['거리 차가 일정한 점의 자취가 <b>쌍곡선</b> — 곡선 하나로는 한 점이 안 되고, 두 곡선이 만나야 정해진다',
         '마이크 둘이면 소리가 난 곳이 정해진다',
         '거리를 알아야만 위치를 구할 수 있다'],
   chk(got, r, mem, pick){
     if(!mem.ok2) return {ok:false, msg:'② 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const mic=noteNum(r[3]), one=String(r[4]).indexOf('한 점')>=0?1:0;
     if(mic<3) return {ok:false, msg:'아직 마이크가 '+r[3]+'개입니다 — 「세 번째 마이크 켜기」를 누르세요.'};
     if(![0,1].every(j=>isFinite(got[j]))) return {ok:false, msg:'두 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-mic)>0.5) return {ok:false, msg:'마이크는 '+r[3]+'개입니다.'};
     if(Math.abs(got[1]-one)>0.01) return {ok:false, msg:'화면에 «'+r[4]+'» 라고 나와 있습니다.'};
     if(pick!==0)
       return {ok:false, msg:'마이크 둘일 때는 곡선 하나였고, 셋이 되자 한 점이 되었습니다. 다시 고르세요.'};
     return {ok:true, msg:'판단했습니다 — <b>거리를 몰라도 거리의 차만으로 자취가 정해집니다.</b> GPS 도 위성 신호의 도착 시간 차를 쓰고, 번개의 위치·총성의 위치도 이렇게 찾습니다.'};
   }}""")
)
