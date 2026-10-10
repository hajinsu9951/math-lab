# -*- coding: utf-8 -*-
"""LAB 221~230 탐구 노트 — 기록 → 생각 → 판단. 판정은 화면의 read() 값으로만 한다."""


def note(no, head, c1, c2, c3):
    return "\n %d:{ h:'%s',\n  c:[\n%s,\n%s,\n%s\n ]},\n" % (no, head, c1, c2, c3)


NOTES = (
 note(221, '내가 굵게 재고 · 내가 가늘게 재고 · 내가 판단한다',
 """  {t:'기록 — <b>최소 눈금을 1 cm</b> 로 두고 적으세요',
   f:'읽은 가로 = {0} · 읽은 세로 = {1} · 상대오차 = {2} %',
   chk(got, r, mem){
     if(!r) return {ok:false, msg:'아직 화면 값이 없습니다.'};
     const st=noteNum(r[0]), ra=noteNum(r[1]), rb=noteNum(r[2]), e=noteNum(r[4]);
     if(Math.abs(st-1)>1e-9) return {ok:false, msg:'눈금이 '+r[0]+' 입니다 — 1 cm 로 두세요.'};
     if(!(e>0.5)) return {ok:false, msg:'오차가 '+r[4]+' 로 너무 작습니다 — 가로·세로를 눈금에 딱 떨어지지 않는 값으로 옮기세요.'};
     if(![0,1,2].every(k=>isFinite(got[k]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-ra)>0.02||Math.abs(got[1]-rb)>0.02)
       return {ok:false, msg:'화면은 '+r[1]+' 와 '+r[2]+' 입니다.'};
     if(Math.abs(got[2]-e)>0.02) return {ok:false, msg:'상대오차는 '+r[4]+' 입니다.'};
     mem.e1=e;
     return {ok:true, msg:'기록했습니다 — 굵은 눈금으로 읽으니 오차가 '+r[4]+' 나 납니다. 눈금을 가늘게 해 봅시다.'};
   }}""",
 """  {t:'생각 — <b>최소 눈금을 0.1 cm</b> 로 바꾸고, 오차가 몇 분의 1 로 줄었는지 구하세요',
   f:'읽은 가로 = {0} · 상대오차 = {1} % · ①의 오차 ÷ 지금 오차 = {2}',
   chk(got, r, mem){
     if(mem.e1===undefined) return {ok:false, msg:'① 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const st=noteNum(r[0]), ra=noteNum(r[1]), e=noteNum(r[4]);
     if(Math.abs(st-0.1)>1e-9) return {ok:false, msg:'눈금이 '+r[0]+' 입니다 — 0.1 cm 로 바꾸세요.'};
     if(!(e>0.009)) return {ok:false, msg:'오차가 '+r[4]+' 로 너무 작아 나눌 수 없습니다 — 가로·세로를 조금 옮기세요.'};
     if(![0,1,2].every(k=>isFinite(got[k]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-ra)>0.02) return {ok:false, msg:'읽은 가로는 '+r[1]+' 입니다.'};
     if(Math.abs(got[1]-e)>0.02) return {ok:false, msg:'상대오차는 '+r[4]+' 입니다.'};
     if(Math.abs(got[2]-mem.e1/e)>Math.max(0.4, mem.e1/e*0.06))
       return {ok:false, msg:'①의 '+mem.e1+' 를 지금 '+r[4]+' 로 나누어 보세요.'};
     mem.e2=e; mem.ok2=true;
     return {ok:true, msg:'계산했습니다 — 눈금을 10배 가늘게 하자 오차도 그만큼 줄었습니다.'};
   }}""",
 """  {t:'판단 — <b>최소 눈금을 0.01 cm</b> 로 바꾼 뒤 고르세요',
   f:'눈금 = {0} cm · 상대오차 = {1} % · 참값과 같아졌으면 1, 아니면 0 → {2}',
   opts:['읽은 값의 <b>마지막 자리가 곧 「모르는 자리」</b> 다 — 눈금이 가늘수록 유효숫자가 늘고, 넓이는 가로와 세로에서 오차가 한 번씩 붙어 약 두 배로 번진다',
         '계산기가 준 소수 여덟 자리는 모두 아는 값이다',
         '눈금을 바꿔도 넓이의 오차는 달라지지 않는다'],
   chk(got, r, mem, pick){
     if(!mem.ok2) return {ok:false, msg:'② 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const st=noteNum(r[0]), e=noteNum(r[4]);
     if(Math.abs(st-0.01)>1e-9) return {ok:false, msg:'눈금이 '+r[0]+' 입니다 — 0.01 cm 로 바꾸세요.'};
     if(![0,1,2].every(k=>isFinite(got[k]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-st)>1e-6) return {ok:false, msg:'눈금은 '+r[0]+' 입니다.'};
     if(Math.abs(got[1]-e)>0.02) return {ok:false, msg:'상대오차는 '+r[4]+' 입니다.'};
     if(Math.abs(got[2]-(e<0.005?1:0))>0.01) return {ok:false, msg:'상대오차 '+r[4]+' 가 0 인지 보세요.'};
     if(pick!==0)
       return {ok:false, msg:'눈금 1 cm 에서 '+mem.e1+' , 0.1 cm 에서 '+mem.e2+' , 지금은 '+r[4]+' 입니다. 무엇이 늘어난 걸까요? 다시 고르세요.'};
     return {ok:true, msg:'판단했습니다 — <b>계산기의 자리 수가 아니라 자의 눈금이 정밀도를 정합니다.</b> 곱셈에서는 유효숫자가 적은 쪽에 맞추고, 넓이의 오차는 길이의 오차의 약 두 배로 잡아야 합니다.'};
   }}""")
 +
 note(222, '내가 재고 · 내가 맞추고 · 내가 판단한다',
 """  {t:'기록 — <b>두 조의 인원을 다르게</b> 두고 적으세요',
   f:'가중평균 = {0} · 그냥 평균 = {1} · 차이 = {2}',
   chk(got, r, mem){
     if(!r) return {ok:false, msg:'아직 화면 값이 없습니다.'};
     const n1=noteNum(r[0]), n2=noteNum(r[1]), wt=noteNum(r[2]), sp=noteNum(r[3]), d=noteNum(r[4]);
     if(n1===n2) return {ok:false, msg:'두 조의 인원이 같습니다 — 다르게 두세요.'};
     if(!(d>0.5)) return {ok:false, msg:'차이가 '+r[4]+' 로 너무 작습니다 — 두 조의 평균도 다르게 두세요.'};
     if(![0,1,2].every(k=>isFinite(got[k]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-wt)>0.01) return {ok:false, msg:'가중평균은 '+r[2]+' 입니다.'};
     if(Math.abs(got[1]-sp)>0.01) return {ok:false, msg:'그냥 평균은 '+r[3]+' 입니다.'};
     if(Math.abs(got[2]-d)>0.01) return {ok:false, msg:'차이는 '+r[4]+' 입니다.'};
     mem.d1=d; mem.n1=n1; mem.n2=n2;
     return {ok:true, msg:'기록했습니다 — 두 값이 '+r[4]+' 점이나 다릅니다. 인원을 같게 해 봅시다.'};
   }}""",
 """  {t:'생각 — <b>두 조의 인원을 똑같이</b> 맞추고 다시 적으세요',
   f:'A 인원 = {0} · B 인원 = {1} · 차이 = {2}',
   chk(got, r, mem){
     if(mem.d1===undefined) return {ok:false, msg:'① 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const n1=noteNum(r[0]), n2=noteNum(r[1]), d=noteNum(r[4]);
     if(n1!==n2) return {ok:false, msg:'인원이 '+r[0]+' 과 '+r[1]+' 입니다 — 같게 맞추세요.'};
     if(![0,1,2].every(k=>isFinite(got[k]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-n1)>0.5||Math.abs(got[1]-n2)>0.5)
       return {ok:false, msg:'화면은 '+r[0]+' 과 '+r[1]+' 입니다.'};
     if(Math.abs(got[2]-d)>0.01) return {ok:false, msg:'차이는 '+r[4]+' 입니다.'};
     if(!(d<0.001)) return {ok:false, msg:'차이가 아직 '+r[4]+' 입니다 — 인원을 정확히 같게 두세요.'};
     mem.ok2=true;
     return {ok:true, msg:'계산했습니다 — 인원이 같아지자 두 평균이 정확히 일치합니다.'};
   }}""",
 """  {t:'판단 — <b>인원 차를 15명 이상</b> 으로 벌린 뒤 고르세요',
   f:'A 인원 = {0} · B 인원 = {1} · 가중평균 = {2}',
   opts:['가중평균 = Σ(값 × 인원) ÷ Σ인원 이므로 <b>인원이 많은 쪽으로 끌려간다</b> — 두 인원이 같을 때만 그냥 평균과 일치한다',
         '전체 평균은 두 조의 평균을 더해 2 로 나눈 값이다',
         '인원이 달라도 전체 평균은 바뀌지 않는다'],
   chk(got, r, mem, pick){
     if(!mem.ok2) return {ok:false, msg:'② 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const n1=noteNum(r[0]), n2=noteNum(r[1]), wt=noteNum(r[2]), sp=noteNum(r[3]);
     if(Math.abs(n1-n2)<15) return {ok:false, msg:'인원 차가 '+Math.abs(n1-n2)+'명입니다 — 15명 이상으로 벌리세요.'};
     if(![0,1,2].every(k=>isFinite(got[k]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-n1)>0.5||Math.abs(got[1]-n2)>0.5)
       return {ok:false, msg:'화면은 '+r[0]+' 과 '+r[1]+' 입니다.'};
     if(Math.abs(got[2]-wt)>0.01) return {ok:false, msg:'가중평균은 '+r[2]+' 입니다.'};
     if(pick!==0)
       return {ok:false, msg:'인원이 같을 때는 두 값이 딱 맞았는데 지금은 '+r[2]+' 와 '+r[3]+' 로 갈라졌습니다. 무엇이 가중평균을 끌어당길까요? 다시 고르세요.'};
     return {ok:true, msg:'판단했습니다 — <b>평균을 다시 평균 내면 몫의 크기가 지워집니다.</b> 성적·물가·불량률처럼 묶음의 크기가 다른 자료는 반드시 가중평균으로 모아야 합니다.'};
   }}""")
 +
 note(223, '내가 없애고 · 내가 붙이고 · 내가 판단한다',
 """  {t:'기록 — <b>협업 손실을 0</b> 으로 내리고, 인원 × 실제 시간을 구하세요',
   f:'인원 = {0} 명 · 실제 시간 = {1} · 인원 × 실제 시간 = {2}',
   chk(got, r, mem){
     if(!r) return {ok:false, msg:'아직 화면 값이 없습니다.'};
     const Wk=noteNum(r[0]), n=noteNum(r[1]), l=noteNum(r[2]), t=noteNum(r[4]);
     if(l!==0) return {ok:false, msg:'협업 손실이 '+r[2]+' 입니다 — 0 으로 내리세요.'};
     if(![0,1,2].every(k=>isFinite(got[k]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-n)>0.5) return {ok:false, msg:'인원은 '+r[1]+' 명입니다.'};
     if(Math.abs(got[1]-t)>0.02) return {ok:false, msg:'실제 시간은 '+r[4]+' 입니다.'};
     if(Math.abs(got[2]-Wk)>0.3) return {ok:false, msg:'인원과 실제 시간을 곱해 보세요 — 일의 양 '+r[0]+' 가 나와야 합니다.'};
     mem.W=Wk; mem.n1=n; mem.t1=t;
     return {ok:true, msg:'기록했습니다 — 손실이 없으면 인원 × 시간이 늘 일의 양 '+r[0]+' 입니다. 손실을 붙여 봅시다.'};
   }}""",
 """  {t:'생각 — <b>협업 손실을 10% 이상</b> 으로 올리고, 이상과의 차를 구하세요',
   f:'손실 = {0} % · 이상 시간 = {1} · 실제 시간 = {2} · 실제 − 이상 = {3}',
   chk(got, r, mem){
     if(mem.W===undefined) return {ok:false, msg:'① 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const n=noteNum(r[1]), l=noteNum(r[2]), id=noteNum(r[3]), t=noteNum(r[4]);
     if(!(l>=10)) return {ok:false, msg:'협업 손실이 '+r[2]+' 입니다 — 10% 이상으로 올리세요.'};
     if(Math.abs(n-mem.n1)>0.5) return {ok:false, msg:'①과 같은 인원 '+mem.n1+'명으로 두세요 (지금 '+r[1]+').'};
     if(![0,1,2,3].every(k=>isFinite(got[k]))) return {ok:false, msg:'네 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-l)>0.5) return {ok:false, msg:'손실은 '+r[2]+' 입니다.'};
     if(Math.abs(got[1]-id)>0.02||Math.abs(got[2]-t)>0.02)
       return {ok:false, msg:'화면은 '+r[3]+' 와 '+r[4]+' 입니다.'};
     if(Math.abs(got[3]-(t-id))>0.03) return {ok:false, msg:'실제 '+r[4]+' 에서 이상 '+r[3]+' 를 빼 보세요.'};
     mem.n2=n; mem.t2=t; mem.l2=l; mem.ok2=true;
     return {ok:true, msg:'계산했습니다 — 같은 인원인데 손실 때문에 '+(t-id).toFixed(2)+' 만큼 더 걸립니다.'};
   }}""",
 """  {t:'판단 — 손실은 그대로 두고 <b>인원을 20명</b> 으로 올린 뒤 고르세요',
   f:'인원 = {0} 명 · 실제 시간 = {1} · ②의 실제 시간보다 크면 1, 작으면 0 → {2}',
   opts:['손실이 있으면 <b>n × (1−l)ⁿ⁻¹ 이 어느 인원에서 가장 커지고</b> 그 뒤로는 줄어든다 — 그래서 사람을 더 넣을수록 오히려 느려지는 구간이 생긴다',
         '사람을 늘리면 언제나 시간이 줄어든다',
         '협업 손실은 인원과 아무 관계가 없다'],
   chk(got, r, mem, pick){
     if(!mem.ok2) return {ok:false, msg:'② 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const n=noteNum(r[1]), l=noteNum(r[2]), t=noteNum(r[4]);
     if(Math.abs(l-mem.l2)>0.5) return {ok:false, msg:'손실은 ②와 같은 '+mem.l2+'% 로 두세요 (지금 '+r[2]+').'};
     if(!(n>=20)) return {ok:false, msg:'인원이 '+r[1]+' 명입니다 — 20명으로 올리세요.'};
     if(![0,1,2].every(k=>isFinite(got[k]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-n)>0.5) return {ok:false, msg:'인원은 '+r[1]+' 명입니다.'};
     if(Math.abs(got[1]-t)>0.02) return {ok:false, msg:'실제 시간은 '+r[4]+' 입니다.'};
     if(Math.abs(got[2]-(t>mem.t2?1:0))>0.01) return {ok:false, msg:'②의 '+mem.t2+' 와 견주세요.'};
     if(!(t>mem.t2)) return {ok:false, msg:'아직 ②보다 빠릅니다 — 손실을 더 올리거나 인원을 더 넣어 보세요.'};
     if(pick!==0)
       return {ok:false, msg:'②에서 '+mem.n2+'명일 때 '+mem.t2+' 였는데 20명으로 늘리자 '+r[4]+' 가 되었습니다. 사람을 늘렸는데 왜 느려졌을까요? 다시 고르세요.'};
     return {ok:true, msg:'판단했습니다 — <b>「사람 수 × 시간 = 일의 양」은 손실이 없을 때만 성립합니다.</b> 손실이 있으면 가장 빠른 인원이 따로 있고, 그 너머로는 넣을수록 느려집니다 — 인력 배치가 최댓값 문제가 되는 자리입니다.'};
   }}""")
 +
 note(224, '내가 재고 · 내가 흔들고 · 내가 판단한다',
 """  {t:'기록 — <b>「30일 기록 만들기」</b> 를 누르고 적으세요',
   f:'평균 np = {0} · 관리 상한 = {1} · 벗어난 날 = {2} 일',
   chk(got, r, mem){
     if(!r) return {ok:false, msg:'아직 화면 값이 없습니다.'};
     const mu=noteNum(r[2]), ucl=noteNum(r[3]);
     if(String(r[4])==='기록 없음') return {ok:false, msg:'아직 기록이 없습니다 — 「30일 기록 만들기」 를 누르세요.'};
     const out=noteNum(r[4]);
     if(!(out<=1)) return {ok:false, msg:'벗어난 날이 '+r[4]+'일입니다 — 「30일 기록 만들기」 를 다시 눌러 안정된 기록을 얻으세요.'};
     if(![0,1,2].every(k=>isFinite(got[k]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-mu)>0.02) return {ok:false, msg:'평균 np 는 '+r[2]+' 입니다.'};
     if(Math.abs(got[1]-ucl)>0.2) return {ok:false, msg:'관리 상한은 '+r[3]+' 입니다.'};
     if(Math.abs(got[2]-out)>0.5) return {ok:false, msg:'벗어난 날은 '+r[4]+'일입니다.'};
     mem.out1=out; mem.mu=mu; mem.ucl=ucl;
     return {ok:true, msg:'기록했습니다 — 30일 가운데 '+r[4]+'일만 한계를 벗어났습니다. 공정을 나빠지게 해 봅시다.'};
   }}""",
 """  {t:'생각 — <b>「중간에 공정이 나빠지게」</b> 를 누르고, 늘어난 날을 구하세요',
   f:'벗어난 날 = {0} 일 · ①의 벗어난 날 = {1} 일 · 늘어난 날 = {2} 일',
   chk(got, r, mem){
     if(mem.out1===undefined) return {ok:false, msg:'① 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     if(String(r[4])==='기록 없음') return {ok:false, msg:'기록이 지워졌습니다 — 「중간에 공정이 나빠지게」 를 누르세요.'};
     const out=noteNum(r[4]);
     if(!(out>=2)) return {ok:false, msg:'벗어난 날이 '+r[4]+'일입니다 — 「중간에 공정이 나빠지게」 를 누르세요.'};
     if(![0,1,2].every(k=>isFinite(got[k]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-out)>0.5) return {ok:false, msg:'벗어난 날은 '+r[4]+'일입니다.'};
     if(Math.abs(got[1]-mem.out1)>0.5) return {ok:false, msg:'①에 적은 '+mem.out1+'일입니다.'};
     if(Math.abs(got[2]-(out-mem.out1))>0.5) return {ok:false, msg:r[4]+' 에서 '+mem.out1+' 을 빼 보세요.'};
     mem.out2=out; mem.ok2=true;
     return {ok:true, msg:'계산했습니다 — 벗어난 날이 '+mem.out1+'일에서 '+r[4]+'일로 늘었습니다. 이것이 멈출 신호입니다.'};
   }}""",
 """  {t:'판단 — 관리 상한을 손으로 구해 보고 고르세요',
   f:'평균 np = {0} · 표준편차 = {1} · 평균 + 3 × 표준편차 = {2}',
   opts:['불량품 수는 이항분포를 따르고 그 표준편차가 <b>√(np(1−p))</b> 다 — 3σ 안에 99.7% 가 들어오므로 그 바깥은 우연으로 보기 어려워 원인을 찾는다',
         '관리 한계는 평균의 두 배와 절반으로 정한다',
         '3σ 바깥이 나오는 일은 절대 없다'],
   chk(got, r, mem, pick){
     if(!mem.ok2) return {ok:false, msg:'② 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const p=noteNum(r[0])/100, n=noteNum(r[1]), mu=noteNum(r[2]), ucl=noteNum(r[3]);
     const sd=Math.sqrt(n*p*(1-p));
     if(![0,1,2].every(k=>isFinite(got[k]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-mu)>0.02) return {ok:false, msg:'평균 np 는 '+r[2]+' 입니다.'};
     if(Math.abs(got[1]-sd)>0.06) return {ok:false, msg:'np(1−p) 의 제곱근을 구해 보세요 — np = '+r[2]+' , p = '+r[0]+' 입니다.'};
     if(Math.abs(got[2]-ucl)>0.2) return {ok:false, msg:'평균에 표준편차의 세 배를 더하면 화면의 '+r[3]+' 가 나와야 합니다.'};
     if(pick!==0)
       return {ok:false, msg:'안정된 공정에서는 '+mem.out1+'일, 나빠진 공정에서는 '+mem.out2+'일이 한계를 벗어났습니다. 그 한계는 무엇으로 그은 선일까요? 다시 고르세요.'};
     return {ok:true, msg:'판단했습니다 — <b>관리도는 「우연의 폭」을 미리 그려 두는 일입니다.</b> 그 폭이 3σ 이고, 바깥으로 나간 점은 운이 아니라 원인이 있다고 보는 것 — 확률이 공장의 판단 기준이 되는 자리입니다.'};
   }}""")
 +
 note(225, '내가 섞고 · 내가 맞추고 · 내가 판단한다',
 """  {t:'기록 — <b>두 용액의 양을 다르게</b> 두고 적으세요',
   f:'녹은 양 = {0} g · 전체 = {1} g · 섞은 농도 = {2} %',
   chk(got, r, mem){
     if(!r) return {ok:false, msg:'아직 화면 값이 없습니다.'};
     const v1=noteNum(r[0]), c1=noteNum(r[1]), v2=noteNum(r[2]), c2=noteNum(r[3]), c=noteNum(r[4]);
     if(!(v1>0&&v2>0)) return {ok:false, msg:'두 용액을 모두 0 보다 크게 두세요.'};
     if(v1===v2) return {ok:false, msg:'양이 같습니다 — ②에서 같게 할 테니 지금은 다르게 두세요.'};
     if(c1===c2) return {ok:false, msg:'두 농도가 같습니다 — 다르게 두세요.'};
     if(![0,1,2].every(k=>isFinite(got[k]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-(c1*v1+c2*v2)/100)>0.6)
       return {ok:false, msg:'A 에 녹은 양과 B 에 녹은 양을 각각 구해 더해 보세요.'};
     if(Math.abs(got[1]-(v1+v2))>1) return {ok:false, msg:'전체 양은 '+r[0]+' + '+r[2]+' 입니다.'};
     if(Math.abs(got[2]-c)>0.05) return {ok:false, msg:'섞은 농도는 '+r[4]+' 입니다.'};
     if(!(c>Math.min(c1,c2)-0.01&&c<Math.max(c1,c2)+0.01))
       return {ok:false, msg:'섞은 농도가 두 농도 사이에 있는지 확인하세요.'};
     mem.c1=c1; mem.c2=c2; mem.ok1=true;
     return {ok:true, msg:'기록했습니다 — 섞은 농도 '+r[4]+' 가 '+r[1]+' 와 '+r[3]+' 사이에 있습니다. 양을 같게 해 봅시다.'};
   }}""",
 """  {t:'생각 — <b>두 용액의 양을 똑같이</b> 맞추고, 한가운데인지 확인하세요',
   f:'A 양 = {0} g · B 양 = {1} g · 섞은 농도 = {2} % · 두 농도의 한가운데와 같으면 1 → {3}',
   chk(got, r, mem){
     if(!mem.ok1) return {ok:false, msg:'① 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const v1=noteNum(r[0]), c1=noteNum(r[1]), v2=noteNum(r[2]), c2=noteNum(r[3]), c=noteNum(r[4]);
     if(!(v1>0&&v1===v2)) return {ok:false, msg:'두 양이 '+r[0]+' 과 '+r[2]+' 입니다 — 0 보다 큰 같은 값으로 맞추세요.'};
     if(![0,1,2,3].every(k=>isFinite(got[k]))) return {ok:false, msg:'네 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-v1)>1||Math.abs(got[1]-v2)>1)
       return {ok:false, msg:'화면은 '+r[0]+' 과 '+r[2]+' 입니다.'};
     if(Math.abs(got[2]-c)>0.05) return {ok:false, msg:'섞은 농도는 '+r[4]+' 입니다.'};
     if(Math.abs(c-(c1+c2)/2)>0.05) return {ok:false, msg:'화면 값이 한가운데가 아닙니다 — 양을 정확히 같게 두세요.'};
     if(Math.abs(got[3]-1)>0.01) return {ok:false, msg:'두 농도의 한가운데를 구해 '+r[4]+' 와 견주세요.'};
     mem.ok2=true;
     return {ok:true, msg:'계산했습니다 — 양이 같을 때만 단순 평균과 같아집니다. 한쪽을 0 으로 해 봅시다.'};
   }}""",
 """  {t:'판단 — <b>B 의 양을 0</b> 으로 내린 뒤 고르세요',
   f:'A 농도 = {0} % · B 양 = {1} g · 섞은 농도 = {2} %',
   opts:['섞은 농도는 <b>양을 무게로 둔 가중평균</b> 이다 — 그래서 두 농도 사이를 벗어나지 못하고, 한쪽 양이 0 이면 다른 쪽 농도가 그대로 나온다',
         '두 농도를 더하면 섞은 농도가 된다',
         '많이 섞을수록 농도가 두 농도 바깥으로 나갈 수 있다'],
   chk(got, r, mem, pick){
     if(!mem.ok2) return {ok:false, msg:'② 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const v1=noteNum(r[0]), c1=noteNum(r[1]), v2=noteNum(r[2]), c=noteNum(r[4]);
     if(!(v2===0&&v1>0)) return {ok:false, msg:'B 의 양이 '+r[2]+' 입니다 — 0 으로 내리세요 (A 는 0 보다 크게).'};
     if(![0,1,2].every(k=>isFinite(got[k]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-c1)>0.5) return {ok:false, msg:'A 의 농도는 '+r[1]+' 입니다.'};
     if(Math.abs(got[1])>0.5) return {ok:false, msg:'B 의 양은 0 입니다.'};
     if(Math.abs(got[2]-c)>0.05) return {ok:false, msg:'섞은 농도는 '+r[4]+' 입니다.'};
     if(Math.abs(c-c1)>0.05) return {ok:false, msg:'A 의 농도와 같아져야 합니다 — 화면을 다시 보세요.'};
     if(pick!==0)
       return {ok:false, msg:'양이 같을 때는 한가운데, 한쪽이 0 일 때는 다른 쪽 그대로였습니다. 농도를 섞는 일은 무엇을 하는 셈일까요? 다시 고르세요.'};
     return {ok:true, msg:'판단했습니다 — <b>농도는 가중평균입니다.</b> 녹은 양끼리 더하고 전체 양끼리 더해 나누는 것이고, 그래서 아무리 섞어도 두 농도 사이를 벗어날 수 없습니다 — 배합과 조제의 기본 셈입니다.'};
   }}""")
 +
 note(226, '내가 조이고 · 내가 밀고 · 내가 판단한다',
 """  {t:'기록 — <b>평균은 100 에 두고 산포를 줄여</b> Cp 가 1.33 이상이 되게 한 뒤 적으세요',
   f:'σ = {0} · 불량률 = {1} % · Cpk = {2}',
   chk(got, r, mem){
     if(!r) return {ok:false, msg:'아직 화면 값이 없습니다.'};
     const mu=noteNum(r[0]), sd=noteNum(r[1]), tol=noteNum(r[2]), bad=noteNum(r[3]), cpk=noteNum(r[4]);
     if(Math.abs(mu-100)>0.01) return {ok:false, msg:'평균이 '+r[0]+' 입니다 — 100 에 맞추세요.'};
     if(!(tol/(3*sd)>=1.33)) return {ok:false, msg:'Cp 가 '+(tol/(3*sd)).toFixed(2)+' 입니다 — 산포를 더 줄이거나 허용폭을 넓히세요.'};
     if(![0,1,2].every(k=>isFinite(got[k]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-sd)>0.02) return {ok:false, msg:'σ 는 '+r[1]+' 입니다.'};
     if(Math.abs(got[1]-bad)>0.02) return {ok:false, msg:'불량률은 '+r[3]+' 입니다.'};
     if(Math.abs(got[2]-cpk)>0.02) return {ok:false, msg:'Cpk 는 '+r[4]+' 입니다.'};
     mem.sd=sd; mem.tol=tol; mem.cpk1=cpk; mem.bad1=bad;
     return {ok:true, msg:'기록했습니다 — 중심이 맞고 폭이 넉넉하니 불량률이 '+r[3]+' 입니다. 중심만 밀어 봅시다.'};
   }}""",
 """  {t:'생각 — <b>산포는 그대로 두고 평균만 2 이상</b> 옮기고 다시 적으세요',
   f:'평균 = {0} · σ = {1} · 불량률 = {2} % · Cpk = {3}',
   chk(got, r, mem){
     if(mem.sd===undefined) return {ok:false, msg:'① 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const mu=noteNum(r[0]), sd=noteNum(r[1]), bad=noteNum(r[3]), cpk=noteNum(r[4]);
     if(Math.abs(sd-mem.sd)>0.02) return {ok:false, msg:'σ 가 '+r[1]+' 로 바뀌었습니다 — ①과 같은 '+mem.sd+' 로 두세요.'};
     if(Math.abs(mu-100)<2) return {ok:false, msg:'평균이 '+r[0]+' 입니다 — 100 에서 2 이상 떨어뜨리세요.'};
     if(![0,1,2,3].every(k=>isFinite(got[k]))) return {ok:false, msg:'네 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-mu)>0.06||Math.abs(got[1]-sd)>0.02)
       return {ok:false, msg:'화면은 '+r[0]+' 과 '+r[1]+' 입니다.'};
     if(Math.abs(got[2]-bad)>0.02) return {ok:false, msg:'불량률은 '+r[3]+' 입니다.'};
     if(Math.abs(got[3]-cpk)>0.02) return {ok:false, msg:'Cpk 는 '+r[4]+' 입니다.'};
     if(!(cpk<mem.cpk1)) return {ok:false, msg:'Cpk 가 ①의 '+mem.cpk1+' 보다 낮아져야 합니다 — 평균을 더 옮기세요.'};
     mem.cpk2=cpk; mem.bad2=bad; mem.ok2=true;
     return {ok:true, msg:'계산했습니다 — 폭은 그대로인데 불량률이 '+mem.bad1+'% 에서 '+r[3]+' 로 늘었습니다.'};
   }}""",
 """  {t:'판단 — Cp 를 손으로 구해 ①·②와 견주고 고르세요',
   f:'허용폭 ÷ (3 × σ) = {0} · ①의 Cpk = {1} · ②의 Cpk = {2}',
   opts:['Cp 는 <b>폭만</b> 보므로 중심을 옮겨도 그대로지만, Cpk 는 <b>가까운 쪽 여유</b> 를 보므로 중심이 밀리면 떨어진다 — 그래서 Cp 만 보고 합격이라 하면 안 된다',
         'Cp 와 Cpk 는 늘 같은 값이다',
         '중심이 밀리면 Cp 가 먼저 떨어진다'],
   chk(got, r, mem, pick){
     if(!mem.ok2) return {ok:false, msg:'② 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const sd=noteNum(r[1]), tol=noteNum(r[2]);
     if(Math.abs(sd-mem.sd)>0.02) return {ok:false, msg:'σ 는 ①·②와 같은 '+mem.sd+' 로 두세요 (지금 '+r[1]+').'};
     if(![0,1,2].every(k=>isFinite(got[k]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-tol/(3*sd))>0.03) return {ok:false, msg:'허용폭 '+r[2]+' 를 3 × '+r[1]+' 로 나누어 보세요.'};
     if(Math.abs(got[1]-mem.cpk1)>0.02) return {ok:false, msg:'①에 적은 '+mem.cpk1+' 입니다.'};
     if(Math.abs(got[2]-mem.cpk2)>0.02) return {ok:false, msg:'②에 적은 '+mem.cpk2+' 입니다.'};
     if(pick!==0)
       return {ok:false, msg:'Cp 는 '+(tol/(3*sd)).toFixed(2)+' 로 그대로인데 Cpk 는 '+mem.cpk1+' 에서 '+mem.cpk2+' 로 떨어졌습니다. 둘은 무엇을 다르게 보고 있을까요? 다시 고르세요.'};
     return {ok:true, msg:'판단했습니다 — <b>산포가 작아도 중심이 밀리면 불량이 납니다.</b> Cp 는 폭, Cpk 는 폭과 치우침 — 정규분포의 넓이를 읽는 일이 그대로 설비 조정의 기준이 됩니다.'};
   }}""")
 +
 note(227, '내가 재고 · 내가 올리고 · 내가 판단한다',
 """  {t:'기록 — 지금 각에서 tan 과 높이를 적으세요 (눈높이는 1 m 이상)',
   f:'각 = {0} ° · tan = {1} · 높이 = {2} m',
   chk(got, r, mem){
     if(!r) return {ok:false, msg:'아직 화면 값이 없습니다.'};
     const d=noteNum(r[0]), a=noteNum(r[1]), t=noteNum(r[2]), e=noteNum(r[3]), h=noteNum(r[4]);
     if(!(e>=1)) return {ok:false, msg:'눈높이가 '+r[3]+' 입니다 — 1 m 이상으로 두세요.'};
     if(!(a<65)) return {ok:false, msg:'각이 '+r[1]+' 입니다 — ②에서 올릴 테니 지금은 65° 아래로 두세요.'};
     if(![0,1,2].every(k=>isFinite(got[k]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-a)>0.5) return {ok:false, msg:'각은 '+r[1]+' 입니다.'};
     if(Math.abs(got[1]-t)>0.002) return {ok:false, msg:'tan 은 '+r[2]+' 입니다.'};
     if(Math.abs(got[2]-h)>0.02) return {ok:false, msg:'높이는 '+r[4]+' 입니다.'};
     if(Math.abs(h-(d*t+e))>0.02) return {ok:false, msg:'화면 값이 거리 × tan + 눈높이 와 맞지 않습니다.'};
     mem.h1=h; mem.e=e; mem.d=d; mem.a1=a;
     return {ok:true, msg:'기록했습니다 — 높이 '+r[4]+' 가운데 '+r[3]+' 는 눈높이 몫입니다. 각을 키워 봅시다.'};
   }}""",
 """  {t:'생각 — <b>올려본각을 65° 이상</b> 으로 올리고, 늘어난 높이를 구하세요',
   f:'각 = {0} ° · tan = {1} · 높이 = {2} m · ①에서 늘어난 높이 = {3} m',
   chk(got, r, mem){
     if(mem.h1===undefined) return {ok:false, msg:'① 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const d=noteNum(r[0]), a=noteNum(r[1]), t=noteNum(r[2]), h=noteNum(r[4]);
     if(!(a>=65)) return {ok:false, msg:'각이 '+r[1]+' 입니다 — 65° 이상으로 올리세요.'};
     if(Math.abs(d-mem.d)>0.5) return {ok:false, msg:'거리는 ①과 같은 '+mem.d+' m 로 두세요 (지금 '+r[0]+').'};
     if(![0,1,2,3].every(k=>isFinite(got[k]))) return {ok:false, msg:'네 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-a)>0.5) return {ok:false, msg:'각은 '+r[1]+' 입니다.'};
     if(Math.abs(got[1]-t)>0.002) return {ok:false, msg:'tan 은 '+r[2]+' 입니다.'};
     if(Math.abs(got[2]-h)>0.02) return {ok:false, msg:'높이는 '+r[4]+' 입니다.'};
     if(Math.abs(got[3]-(h-mem.h1))>0.05) return {ok:false, msg:'지금 '+r[4]+' 에서 ①의 '+mem.h1+' 를 빼 보세요.'};
     mem.h2=h; mem.ok2=true;
     return {ok:true, msg:'계산했습니다 — 각을 올리자 tan 이 급격히 커져 높이가 '+(h-mem.h1).toFixed(2)+' m 나 늘었습니다.'};
   }}""",
 """  {t:'판단 — <b>눈높이를 0</b> 으로 내린 뒤 고르세요 (각과 거리는 그대로)',
   f:'눈높이 = {0} m · 높이 = {1} m · ②의 높이에서 줄어든 양 = {2} m',
   opts:['각을 잰 기준선이 눈높이이므로 <b>높이 = 거리 × tan(각) + 눈높이</b> 다 — 눈높이를 빠뜨리면 늘 그 눈높이만큼 모자라게 나온다',
         '눈높이는 거리에 더해야 한다',
         '눈높이는 각이 작을 때만 더하면 된다'],
   chk(got, r, mem, pick){
     if(!mem.ok2) return {ok:false, msg:'② 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const a=noteNum(r[1]), e=noteNum(r[3]), h=noteNum(r[4]);
     if(Math.abs(e)>0.01) return {ok:false, msg:'눈높이가 '+r[3]+' 입니다 — 0 으로 내리세요.'};
     if(!(a>=65)) return {ok:false, msg:'각은 ②와 같이 65° 이상으로 두세요 (지금 '+r[1]+').'};
     if(![0,1,2].every(k=>isFinite(got[k]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0])>0.05) return {ok:false, msg:'눈높이는 0 입니다.'};
     if(Math.abs(got[1]-h)>0.02) return {ok:false, msg:'높이는 '+r[4]+' 입니다.'};
     if(Math.abs(got[2]-(mem.h2-h))>0.05) return {ok:false, msg:'②의 '+mem.h2+' 에서 지금 '+r[4]+' 를 빼 보세요.'};
     if(Math.abs((mem.h2-h)-mem.e)>0.05)
       return {ok:false, msg:'줄어든 양이 ①의 눈높이 '+mem.e+' m 와 같아야 합니다 — 거리와 각을 ②와 같게 두세요.'};
     if(pick!==0)
       return {ok:false, msg:'눈높이를 0 으로 내리자 높이가 정확히 '+mem.e+' m 줄었습니다. 그 눈높이는 식의 어디에 들어 있었을까요? 다시 고르세요.'};
     return {ok:true, msg:'판단했습니다 — <b>각은 눈에서 잰 것입니다.</b> 그래서 거리 × tan 은 「눈높이 위쪽」일 뿐이고, 눈높이를 더해야 건물의 실제 높이가 됩니다 — 현장 측량에서 가장 흔한 실수입니다.'};
   }}""")
 +
 note(228, '내가 넣고 · 내가 섞고 · 내가 판단한다',
 """  {t:'기록 — 지금 자재에서 두 가지 버림을 적으세요',
   f:'A 만 버림 = {0} cm · 섞어 버림 = {1} cm · 줄어든 양 = {2} cm',
   chk(got, r, mem){
     if(!r) return {ok:false, msg:'아직 화면 값이 없습니다.'};
     const L=noteNum(r[0]), na=noteNum(r[3]), mx=noteNum(r[4]);
     if(!(na>mx)) return {ok:false, msg:'지금은 섞어도 줄지 않습니다 (A만 '+r[3]+' · 섞어 '+r[4]+') — 자재나 길이를 바꿔 보세요.'};
     if(![0,1,2].every(k=>isFinite(got[k]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-na)>1) return {ok:false, msg:'A 만 넣을 때 버림은 '+r[3]+' cm 입니다.'};
     if(Math.abs(got[1]-mx)>1) return {ok:false, msg:'섞어 넣을 때 버림은 '+r[4]+' cm 입니다.'};
     if(Math.abs(got[2]-(na-mx))>1) return {ok:false, msg:r[3]+' 에서 '+r[4]+' 를 빼 보세요.'};
     mem.L1=L; mem.na1=na; mem.mx1=mx;
     return {ok:true, msg:'기록했습니다 — 조합을 바꾸자 '+(na-mx)+' cm 를 덜 버립니다. 자재 길이를 바꿔 봅시다.'};
   }}""",
 """  {t:'생각 — <b>자재 길이를 바꿔</b> 다시 적으세요',
   f:'자재 = {0} cm · A 만 버림 = {1} · 섞어 버림 = {2} · 줄어든 양 = {3}',
   chk(got, r, mem){
     if(mem.L1===undefined) return {ok:false, msg:'① 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const L=noteNum(r[0]), na=noteNum(r[3]), mx=noteNum(r[4]);
     if(L===mem.L1) return {ok:false, msg:'자재 길이가 ①과 같습니다 ('+r[0]+') — 다른 길이로 바꾸세요.'};
     if(![0,1,2,3].every(k=>isFinite(got[k]))) return {ok:false, msg:'네 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-L)>1) return {ok:false, msg:'자재는 '+r[0]+' cm 입니다.'};
     if(Math.abs(got[1]-na)>1||Math.abs(got[2]-mx)>1)
       return {ok:false, msg:'화면은 '+r[3]+' 와 '+r[4]+' 입니다.'};
     if(Math.abs(got[3]-(na-mx))>1) return {ok:false, msg:r[3]+' 에서 '+r[4]+' 를 빼 보세요.'};
     mem.ok2=true;
     return {ok:true, msg:'계산했습니다 — 자재가 달라지면 알뜰한 조합도 달라집니다.'};
   }}""",
 """  {t:'판단 — <b>버리는 양이 0 이 되는 조합</b> 을 찾은 뒤 고르세요',
   f:'자재 = {0} · A = {1} · B = {2} · 섞어 버림 = {3}',
   opts:['버리는 양은 <b>L − (aA + bB)</b> 이고, 이것을 가장 작게 하는 자연수 a, b 를 찾는 문제다 — 나눗셈의 나머지를 두 수로 함께 줄이는 셈이다',
         '자재가 길수록 버리는 양도 반드시 늘어난다',
         'A 만 넣는 것이 언제나 가장 알뜰하다'],
   chk(got, r, mem, pick){
     if(!mem.ok2) return {ok:false, msg:'② 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const L=noteNum(r[0]), A=noteNum(r[1]), B=noteNum(r[2]), mx=noteNum(r[4]);
     if(mx!==0) return {ok:false, msg:'섞어 버림이 '+r[4]+' cm 입니다 — 0 이 되는 조합을 찾아보세요 (예: 400 · 150 · 100).'};
     if(![0,1,2,3].every(k=>isFinite(got[k]))) return {ok:false, msg:'네 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-L)>1||Math.abs(got[1]-A)>1||Math.abs(got[2]-B)>1)
       return {ok:false, msg:'화면은 '+r[0]+' · '+r[1]+' · '+r[2]+' 입니다.'};
     if(Math.abs(got[3])>0.5) return {ok:false, msg:'섞어 버림은 0 입니다.'};
     if(pick!==0)
       return {ok:false, msg:'같은 자재인데 조합만 바꾸자 버림이 '+mem.na1+' 에서 '+mem.mx1+' 로 줄었고, 지금은 0 입니다. 무엇을 가장 작게 만든 걸까요? 다시 고르세요.'};
     return {ok:true, msg:'판단했습니다 — <b>재단 계획은 나머지를 가장 작게 하는 조합 찾기입니다.</b> 한 종류만 넣으면 나눗셈의 나머지가 그대로 쓰레기가 되고, 두 종류를 섞으면 그 나머지를 다시 쪼갤 수 있습니다.'};
   }}""")
 +
 note(229, '내가 재고 · 내가 넘기고 · 내가 판단한다',
 """  {t:'기록 — <b>「경계 바로 아래로」</b> 를 누르고 적으세요',
   f:'요금 = {0} 원 · 평균 단가 = {1} · 마지막 구간 단가 = {2}',
   chk(got, r, mem){
     if(!r) return {ok:false, msg:'아직 화면 값이 없습니다.'};
     const u=noteNum(r[0]), c=noteNum(r[1]), avg=noteNum(r[2]), mg=noteNum(r[3]);
     if(u!==390) return {ok:false, msg:'사용량이 '+r[0]+' kWh 입니다 — 「경계 바로 아래로」 를 누르세요.'};
     if(![0,1,2].every(k=>isFinite(got[k]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-c)>60) return {ok:false, msg:'요금은 '+r[1]+' 원입니다.'};
     if(Math.abs(got[1]-avg)>0.6) return {ok:false, msg:'평균 단가는 '+r[2]+' 입니다.'};
     if(Math.abs(got[2]-mg)>0.6) return {ok:false, msg:'마지막 구간 단가는 '+r[3]+' 입니다.'};
     mem.u1=u; mem.c1=c; mem.mg1=mg;
     return {ok:true, msg:'기록했습니다 — 아직 평균 단가가 마지막 단가보다 낮습니다. 경계를 넘겨 봅시다.'};
   }}""",
 """  {t:'생각 — <b>「경계를 막 넘겨서」</b> 를 누르고, 1 kWh 당 얼마인지 구하세요',
   f:'요금 = {0} 원 · ①에서 늘어난 요금 = {1} 원 · 늘어난 요금 ÷ 20 kWh = {2} 원',
   chk(got, r, mem){
     if(mem.c1===undefined) return {ok:false, msg:'① 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const u=noteNum(r[0]), c=noteNum(r[1]);
     if(u!==410) return {ok:false, msg:'사용량이 '+r[0]+' kWh 입니다 — 「경계를 막 넘겨서」 를 누르세요.'};
     if(![0,1,2].every(k=>isFinite(got[k]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-c)>60) return {ok:false, msg:'요금은 '+r[1]+' 원입니다.'};
     if(Math.abs(got[1]-(c-mem.c1))>60) return {ok:false, msg:'지금 요금에서 ①의 '+mem.c1+' 원을 빼 보세요.'};
     if(Math.abs(got[2]-(c-mem.c1)/20)>6) return {ok:false, msg:'늘어난 요금을 20 kWh 로 나누어 보세요.'};
     mem.c2=c; mem.per=(c-mem.c1)/20; mem.ok2=true;
     return {ok:true, msg:'계산했습니다 — 20 kWh 를 더 썼는데 '+(c-mem.c1)+' 원이 늘어 1 kWh 가 '+((c-mem.c1)/20).toFixed(0)+' 원꼴입니다.'};
   }}""",
 """  {t:'판단 — 방금 구한 값을 마지막 구간 단가와 견주고 고르세요',
   f:'마지막 구간 단가 = {0} 원 · 방금 구한 1 kWh 당 = {1} 원 · 뒤가 더 크면 1, 아니면 0 → {2}',
   opts:['구간을 넘으면 단가만 오르는 것이 아니라 <b>기본요금까지 함께 뛴다</b> — 그래서 경계 근처의 1 kWh 는 표에 적힌 단가보다 훨씬 비싸게 먹힌다',
         '요금은 사용량에 정비례하므로 1 kWh 의 값은 늘 같다',
         '평균 단가가 마지막 구간 단가보다 늘 크다'],
   chk(got, r, mem, pick){
     if(!mem.ok2) return {ok:false, msg:'② 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const u=noteNum(r[0]), mg=noteNum(r[3]);
     if(u!==410) return {ok:false, msg:'②와 같은 자리에서 판단하세요 — 「경계를 막 넘겨서」 를 누르세요.'};
     if(![0,1,2].every(k=>isFinite(got[k]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-mg)>0.6) return {ok:false, msg:'마지막 구간 단가는 '+r[3]+' 입니다.'};
     if(Math.abs(got[1]-mem.per)>6) return {ok:false, msg:'②에서 구한 '+mem.per.toFixed(0)+' 원입니다.'};
     if(Math.abs(got[2]-1)>0.01) return {ok:false, msg:'두 값을 견주세요.'};
     if(pick!==0)
       return {ok:false, msg:'표에 적힌 단가는 '+r[3]+' 원인데 실제로는 1 kWh 에 '+mem.per.toFixed(0)+' 원이 들었습니다. 그 차이는 어디서 왔을까요? 다시 고르세요.'};
     return {ok:true, msg:'판단했습니다 — <b>요금 그래프는 경계에서 위로 뛰어오릅니다.</b> 그래서 「평균 단가」와 「마지막 단가」, 그리고 「경계를 넘을 때의 값」이 모두 다릅니다 — 절약 계획은 지금 내가 어느 구간에 있는지부터 봐야 합니다.'};
   }}""")
 +
 note(230, '내가 내려가고 · 내가 올라가고 · 내가 판단한다',
 """  {t:'기록 — <b>위도를 0°</b> 로 내려 적도에서 적으세요',
   f:'위도 1° = {0} km · 경도 1° = {1} km · 두 값의 차 = {2} km',
   chk(got, r, mem){
     if(!r) return {ok:false, msg:'아직 화면 값이 없습니다.'};
     const lat=noteNum(r[0]), kl=noteNum(r[1]), ko=noteNum(r[2]);
     if(lat!==0) return {ok:false, msg:'위도가 '+r[0]+' 입니다 — 0° 로 내리세요.'};
     if(![0,1,2].every(k=>isFinite(got[k]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-kl)>0.06) return {ok:false, msg:'위도 1° 는 '+r[1]+' km 입니다.'};
     if(Math.abs(got[1]-ko)>0.06) return {ok:false, msg:'경도 1° 는 '+r[2]+' km 입니다.'};
     if(Math.abs(got[2])>0.06) return {ok:false, msg:'두 값을 빼 보세요 — 적도에서는 0 입니다.'};
     mem.kl=kl;
     return {ok:true, msg:'기록했습니다 — 적도에서는 cos 0° = 1 이라 가로와 세로의 1도가 같습니다. 북쪽으로 가 봅시다.'};
   }}""",
 """  {t:'생각 — <b>위도를 60° 이상</b> 으로 올리고, 경도를 위도로 나누세요',
   f:'위도 = {0} ° · 경도 1° = {1} km · 경도 ÷ 위도 = {2}',
   chk(got, r, mem){
     if(mem.kl===undefined) return {ok:false, msg:'① 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const lat=noteNum(r[0]), kl=noteNum(r[1]), ko=noteNum(r[2]);
     if(!(lat>=60)) return {ok:false, msg:'위도가 '+r[0]+' 입니다 — 60° 이상으로 올리세요.'};
     if(![0,1,2].every(k=>isFinite(got[k]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-lat)>0.5) return {ok:false, msg:'위도는 '+r[0]+' 입니다.'};
     if(Math.abs(got[1]-ko)>0.06) return {ok:false, msg:'경도 1° 는 '+r[2]+' km 입니다.'};
     if(Math.abs(got[2]-ko/kl)>0.02) return {ok:false, msg:r[2]+' 를 '+r[1]+' 로 나누어 보세요.'};
     if(Math.abs(ko/kl-Math.cos(lat*Math.PI/180))>0.01)
       return {ok:false, msg:'그 값이 cos('+r[0]+') 와 같은지 확인하세요.'};
     mem.lat2=lat; mem.ok2=true;
     return {ok:true, msg:'계산했습니다 — 그 비가 바로 cos(위도) 입니다. 위도가 높아질수록 가로가 줄어듭니다.'};
   }}""",
 """  {t:'판단 — cos 을 넣은 거리와 빼먹은 거리를 견주고 고르세요',
   f:'cos 을 넣은 거리 = {0} km · cos 을 빼먹은 거리 = {1} km · 빼먹은 쪽이 크면 1 → {2}',
   opts:['경도선의 간격은 <b>위도선의 반지름에 비례</b> 하므로 경도 1° 는 111 × cos(위도) km 다 — cos 을 빼먹으면 가로를 실제보다 길게 세어 거리를 부풀리게 된다',
         '위도와 경도는 어디서나 같은 길이이므로 cos 은 필요 없다',
         'cos 은 세로인 위도 쪽에 붙여야 한다'],
   chk(got, r, mem, pick){
     if(!mem.ok2) return {ok:false, msg:'② 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const lat=noteNum(r[0]), d=noteNum(r[3]), w=noteNum(r[4]);
     if(!(lat>=60)) return {ok:false, msg:'②와 같이 위도를 60° 이상으로 두세요 (지금 '+r[0]+').'};
     if(!(w>d+0.01)) return {ok:false, msg:'두 거리가 같습니다 — 경도 차를 0 보다 크게 두세요.'};
     if(![0,1,2].every(k=>isFinite(got[k]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-d)>0.05) return {ok:false, msg:'cos 을 넣은 거리는 '+r[3]+' km 입니다.'};
     if(Math.abs(got[1]-w)>0.05) return {ok:false, msg:'cos 을 빼먹은 거리는 '+r[4]+' km 입니다.'};
     if(Math.abs(got[2]-1)>0.01) return {ok:false, msg:'두 값을 견주세요.'};
     if(pick!==0)
       return {ok:false, msg:'적도에서는 두 값이 같았는데 위도 '+r[0]+' 에서는 '+r[3]+' 와 '+r[4]+' 로 갈라졌습니다. cos 은 어느 쪽에 붙어 있었을까요? 다시 고르세요.'};
     return {ok:true, msg:'판단했습니다 — <b>가로에만 cos 이 붙습니다.</b> 위도 1° 는 어디서나 111 km 지만 경도 1° 는 111 × cos(위도) km 이고, 고위도로 갈수록 지도의 가로가 늘어나 보이는 것도 같은 이유입니다.'};
   }}""")
)
