# -*- coding: utf-8 -*-
"""LAB 201~210 탐구 노트 — 기록 → 생각 → 판단. 판정은 화면의 read() 값으로만 한다.

지키는 것
  · 세 칸은 차례대로 열린다 (mem 에 앞 칸의 값을 남겨 다음 칸이 그것과 견준다)
  · ①은 「지금 화면을 그대로 적기」, ②는 「조건을 바꿔 다시 적고 손으로 계산」,
    ③은 「판단」 — 보기의 첫째 줄이 정답이다 (shufOpts 가 화면에서 섞어 준다)
  · 조건이 맞지 않으면 통과시키지 않고, 무엇을 어떻게 바꿔야 하는지 화면 값으로 알려 준다
"""


def note(no, head, c1, c2, c3):
    return "\n %d:{ h:'%s',\n  c:[\n%s,\n%s,\n%s\n ]},\n" % (no, head, c1, c2, c3)


NOTES = (
 note(201, '내가 묶고 · 내가 풀고 · 내가 판단한다',
 """  {t:'기록 — <b>「a 만 최적으로 (b = 0 고정)」</b> 를 누르고 적으세요',
   f:'a = {0} · b = {1} · 손실 = {2}',
   chk(got, r, mem){
     if(!r) return {ok:false, msg:'아직 화면 값이 없습니다.'};
     const a=noteNum(r[0]), b=noteNum(r[1]), L=noteNum(r[2]), L0=noteNum(r[3]);
     if(Math.abs(b)>1e-9) return {ok:false, msg:'절편이 '+r[1]+' 입니다 — 「a 만 최적으로 (b = 0 고정)」 를 누르세요.'};
     if(Math.abs(L-L0)>0.05) return {ok:false, msg:'아직 b = 0 의 최선이 아닙니다 — 단추를 눌러 주세요 (지금 손실 '+r[2]+', 최선 '+r[3]+').'};
     if(![0,1,2].every(k=>isFinite(got[k]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-a)>0.06||Math.abs(got[1]-b)>0.06)
       return {ok:false, msg:'화면은 a = '+r[0]+' · b = '+r[1]+' 입니다.'};
     if(Math.abs(got[2]-L)>0.01) return {ok:false, msg:'손실은 '+r[2]+' 입니다.'};
     mem.l0=L;
     return {ok:true, msg:'기록했습니다 — 기울기를 가장 잘 맞췄는데도 손실이 '+r[2]+' 나 남았습니다. 절편을 풀어 봅시다.'};
   }}""",
 """  {t:'생각 — <b>「a 와 b 를 함께 최적으로」</b> 를 누르고, 줄어든 손실을 구하세요',
   f:'a = {0} · 손실 = {1} · ①의 손실에서 뺀 차 = {2}',
   chk(got, r, mem){
     if(mem.l0===undefined) return {ok:false, msg:'① 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const a=noteNum(r[0]), L=noteNum(r[2]), L1=noteNum(r[4]);
     if(Math.abs(L-L1)>0.05) return {ok:false, msg:'아직 둘 다 맞춘 최선이 아닙니다 — 「a 와 b 를 함께 최적으로」 를 누르세요 (지금 손실 '+r[2]+', 최선 '+r[4]+').'};
     if(![0,1,2].every(k=>isFinite(got[k]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-a)>0.06) return {ok:false, msg:'a 는 '+r[0]+' 입니다.'};
     if(Math.abs(got[1]-L)>0.01) return {ok:false, msg:'손실은 '+r[2]+' 입니다.'};
     if(Math.abs(got[2]-(mem.l0-L))>0.05) return {ok:false, msg:'①의 손실 '+mem.l0+' 에서 지금 손실 '+r[2]+' 를 빼 보세요.'};
     mem.b=noteNum(r[1]); mem.ok2=true;
     return {ok:true, msg:'계산했습니다 — 절편 하나를 풀어 주자 손실이 '+(mem.l0-L).toFixed(3)+' 나 사라졌습니다. 그 절편은 무엇일까요?'};
   }}""",
 """  {t:'판단 — 최적 직선이 자료의 평균점을 지나는지 확인하고 고르세요 (x 의 평균 3, y 의 평균 11)',
   f:'a = {0} · 절편 b = {1} · a × 3 + b = {2}',
   opts:['자료가 원점을 지나지 않으므로 <b>절편 b 가 반드시 필요하다</b> — b 는 「x 가 0 일 때의 기본값」이고, 최적 직선은 자료의 평균점을 지난다',
         '절편은 그림을 보기 좋게 하는 값이고 손실과는 관계가 없다',
         '기울기를 더 잘 맞추면 절편 없이도 손실을 0 으로 만들 수 있다'],
   chk(got, r, mem, pick){
     if(!mem.ok2) return {ok:false, msg:'② 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const b=noteNum(r[1]), L=noteNum(r[2]), L1=noteNum(r[4]);
     if(Math.abs(L-L1)>0.05) return {ok:false, msg:'「a 와 b 를 함께 최적으로」 를 다시 눌러 주세요.'};
     if(![0,1,2].every(k=>isFinite(got[k]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-noteNum(r[0]))>0.06) return {ok:false, msg:'a 는 '+r[0]+' 입니다.'};
     if(Math.abs(got[1]-b)>0.06) return {ok:false, msg:'절편은 '+r[1]+' 입니다.'};
     if(Math.abs(got[2]-(noteNum(r[0])*3+b))>0.08) return {ok:false, msg:r[0]+' × 3 에 절편 '+r[1]+' 을 더해 보세요.'};
     if(Math.abs(noteNum(r[0])*3+b-11)>0.25) return {ok:false, msg:'평균점을 지나지 않습니다 — 「a 와 b 를 함께 최적으로」 를 다시 누르세요.'};
     if(pick!==0)
       return {ok:false, msg:'b 를 0 으로 묶었더니 손실이 '+mem.l0+' 였고, 풀어 주자 거의 0 이 되었습니다. 그 b 는 무엇의 값일까요? 다시 고르세요.'};
     return {ok:true, msg:'판단했습니다 — <b>배워야 할 것은 기울기만이 아닙니다.</b> 절편은 「아무것도 하지 않았을 때의 기본값」이고, 이것을 묶어 두면 모형이 아무리 애써도 자료 위를 지나갈 수 없습니다.'};
   }}""")
 +
 note(202, '내가 세고 · 내가 재고 · 내가 판단한다',
 """  {t:'기록 — <b>횟수를 1</b> 로 내리고 적으세요',
   f:'실효이자율 = {0} % · 표시 이율과의 차이 = {1} %p',
   chk(got, r, mem){
     if(!r) return {ok:false, msg:'아직 화면 값이 없습니다.'};
     const k=noteNum(r[1]), e=noteNum(r[2]), g=noteNum(r[3]);
     if(k!==1) return {ok:false, msg:'횟수가 '+r[1]+' 입니다 — 1 로 내리세요.'};
     if(![0,1].every(j=>isFinite(got[j]))) return {ok:false, msg:'두 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-e)>0.006) return {ok:false, msg:'실효이자율은 '+r[2]+' 입니다.'};
     if(Math.abs(got[1]-g)>0.006) return {ok:false, msg:'차이는 '+r[3]+' %p 입니다.'};
     mem.e1=e; mem.r0=r[0];
     return {ok:true, msg:'기록했습니다 — 한 번만 붙이면 표시된 이율과 꼭 같습니다. 자주 붙여 봅시다.'};
   }}""",
 """  {t:'생각 — <b>「매주 붙이기」</b> 를 누르고, 천장까지 남은 거리를 구하세요',
   f:'실효이자율 = {0} % · 천장 = {1} % · 천장 − 실효 = {2} %p',
   chk(got, r, mem){
     if(mem.e1===undefined) return {ok:false, msg:'① 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const k=noteNum(r[1]), e=noteNum(r[2]), c=noteNum(r[4]);
     if(!(k>=52)) return {ok:false, msg:'횟수가 '+r[1]+' 입니다 — 「매주 붙이기」 를 눌러 52 로 올리세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-e)>0.006) return {ok:false, msg:'실효이자율은 '+r[2]+' 입니다.'};
     if(Math.abs(got[1]-c)>0.006) return {ok:false, msg:'천장은 '+r[4]+' 입니다.'};
     if(Math.abs(got[2]-(c-e))>0.009) return {ok:false, msg:'천장 '+r[4]+' 에서 실효 '+r[2]+' 를 빼 보세요.'};
     if(!(e>mem.e1)) return {ok:false, msg:'①의 '+mem.e1+' 보다 커지지 않았습니다 — 표시 연이율을 0 보다 크게 두세요.'};
     mem.e2=e; mem.cap=c; mem.ok2=true;
     return {ok:true, msg:'계산했습니다 — 52번이나 붙였는데 천장까지 '+(c-e).toFixed(3)+' %p 밖에 남지 않았습니다.'};
   }}""",
 """  {t:'판단 — 두 실효이자율을 나란히 두고 고르세요',
   f:'횟수 1 의 실효 = {0} % · 횟수 52 의 실효 = {1} % · 더 큰 쪽이 52 이면 1, 1 이면 0 → {2}',
   opts:['같은 r 이라도 <b>k 가 커지면 실효이자율이 커진다</b> — 다만 (1 + r/k)^k 가 e^r 로 다가가 멈추므로 e^r − 1 을 넘지 못한다',
         '횟수를 늘리면 실효이자율이 끝없이 커진다',
         '이자를 붙이는 횟수는 실효이자율과 아무 관계가 없다'],
   chk(got, r, mem, pick){
     if(!mem.ok2) return {ok:false, msg:'② 칸을 먼저 통과하세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-mem.e1)>0.006) return {ok:false, msg:'①에 적은 '+mem.e1+' 입니다.'};
     if(Math.abs(got[1]-mem.e2)>0.006) return {ok:false, msg:'②에 적은 '+mem.e2+' 입니다.'};
     if(Math.abs(got[2]-1)>0.01) return {ok:false, msg:'두 값을 견주어 더 큰 쪽을 보세요.'};
     if(pick!==0)
       return {ok:false, msg:'1번은 '+mem.e1+' , 52번은 '+mem.e2+' , 천장은 '+mem.cap+' 였습니다. 커지기는 하는데 왜 멈출까요? 다시 고르세요.'};
     return {ok:true, msg:'판단했습니다 — <b>「연 12%」만 보고 고르면 속습니다.</b> 비교해야 할 것은 실효이자율이고, 그 값에도 e^r − 1 이라는 천장이 있습니다 — 자연상수가 금융 광고 속에 숨어 있는 셈입니다.'};
   }}""")
 +
 note(203, '내가 넘기고 · 내가 나누고 · 내가 판단한다',
 """  {t:'기록 — <b>「구간 경계 바로 아래로」</b> 를 누르고 적으세요',
   f:'소득 = {0} 만원 · 세금 = {1} 만원 · 한계세율 = {2} %',
   chk(got, r, mem){
     if(!r) return {ok:false, msg:'아직 화면 값이 없습니다.'};
     const inc=noteNum(r[0]), t=noteNum(r[1]), m=noteNum(r[2]);
     if(inc!==4900) return {ok:false, msg:'소득이 '+r[0]+' 만원입니다 — 「구간 경계 바로 아래로」 를 누르세요.'};
     if(![0,1,2].every(k=>isFinite(got[k]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-inc)>1) return {ok:false, msg:'소득은 '+r[0]+' 만원입니다.'};
     if(Math.abs(got[1]-t)>0.6) return {ok:false, msg:'세금은 '+r[1]+' 만원입니다.'};
     if(Math.abs(got[2]-m)>0.6) return {ok:false, msg:'한계세율은 '+r[2]+' 입니다.'};
     mem.t1=t; mem.i1=inc;
     return {ok:true, msg:'기록했습니다 — 여기까지는 가장 높은 세율이 '+r[2]+' 입니다. 경계를 넘겨 봅시다.'};
   }}""",
 """  {t:'생각 — <b>「경계를 막 넘겨서」</b> 를 누르고, 늘어난 세금을 구하세요',
   f:'소득 = {0} 만원 · 세금 = {1} 만원 · ①에서 늘어난 세금 = {2} 만원',
   chk(got, r, mem){
     if(mem.t1===undefined) return {ok:false, msg:'① 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const inc=noteNum(r[0]), t=noteNum(r[1]);
     if(inc!==5100) return {ok:false, msg:'소득이 '+r[0]+' 만원입니다 — 「경계를 막 넘겨서」 를 누르세요.'};
     if(![0,1,2].every(k=>isFinite(got[k]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-inc)>1) return {ok:false, msg:'소득은 '+r[0]+' 만원입니다.'};
     if(Math.abs(got[1]-t)>0.6) return {ok:false, msg:'세금은 '+r[1]+' 만원입니다.'};
     if(Math.abs(got[2]-(t-mem.t1))>0.6) return {ok:false, msg:'지금 세금 '+r[1]+' 에서 ①의 '+mem.t1+' 를 빼 보세요.'};
     mem.t2=t; mem.i2=inc; mem.ok2=true;
     return {ok:true, msg:'계산했습니다 — 소득이 200만원 늘고 세금은 '+(t-mem.t1).toFixed(0)+' 만원 늘었습니다. 이 비율이 몇 %일까요?'};
   }}""",
 """  {t:'판단 — 늘어난 세금을 늘어난 소득으로 나누어 보고 고르세요',
   f:'늘어난 소득 = {0} 만원 · 늘어난 세금 = {1} 만원 · 늘어난 세금 ÷ 늘어난 소득 = {2} %',
   opts:['늘어난 소득이 <b>두 구간에 걸쳐</b> 있어 100만원은 15%, 100만원은 24% 로 갈라 붙었다 — 그래서 평균이 둘 사이인 19.5% 가 된다',
         '경계를 넘는 순간 전체 소득에 24% 가 붙는다',
         '세율이 올랐으므로 세금도 두 배가 된다'],
   chk(got, r, mem, pick){
     if(!mem.ok2) return {ok:false, msg:'② 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     if(noteNum(r[0])!==5100) return {ok:false, msg:'「경계를 막 넘겨서」 자리에서 판단하세요.'};
     const di=mem.i2-mem.i1, dt=mem.t2-mem.t1;
     if(![0,1,2].every(k=>isFinite(got[k]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-di)>1) return {ok:false, msg:'소득은 '+mem.i1+' 에서 '+mem.i2+' 로 늘었습니다.'};
     if(Math.abs(got[1]-dt)>0.6) return {ok:false, msg:'②에서 구한 '+dt.toFixed(0)+' 만원입니다.'};
     if(Math.abs(got[2]-dt/di*100)>0.6) return {ok:false, msg:dt.toFixed(0)+' ÷ '+di+' 를 백분율로 바꿔 보세요.'};
     if(pick!==0)
       return {ok:false, msg:'19.5% 는 15% 와 24% 사이의 수입니다. 늘어난 200만원이 어디에 어떻게 나뉘어 들어갔을까요? 다시 고르세요.'};
     return {ok:true, msg:'판단했습니다 — <b>「구간이 오르면 손해」는 틀린 말입니다.</b> 높은 세율은 경계를 넘은 부분에만 붙으므로, 소득이 늘면 손에 쥐는 돈도 반드시 늘어납니다. 한계세율과 실효세율을 섞어 쓰면 이런 오해가 생깁니다.'};
   }}""")
 +
 note(204, '내가 없애고 · 내가 붙이고 · 내가 판단한다',
 """  {t:'기록 — <b>수수료를 0</b> 으로 내리고 두 길의 결과를 적으세요',
   f:'두 번 바꾼 결과 = {0} 엔 · 바로 바꾼 결과 = {1} 엔 · 차이 = {2} 엔',
   chk(got, r, mem){
     if(!r) return {ok:false, msg:'아직 화면 값이 없습니다.'};
     const fee=noteNum(r[2]), v=noteNum(r[3]), d=noteNum(r[4]);
     if(Math.abs(fee)>1e-9) return {ok:false, msg:'수수료가 '+r[2]+' 입니다 — 0 으로 내리세요.'};
     if(![0,1,2].every(k=>isFinite(got[k]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-v)>2||Math.abs(got[1]-d)>2)
       return {ok:false, msg:'화면은 '+r[3]+' 엔 과 '+r[4]+' 엔 입니다.'};
     if(Math.abs(got[2])>2) return {ok:false, msg:'두 값을 빼 보세요 — 수수료가 없으면 차이가 0 입니다.'};
     mem.ok1=true;
     return {ok:true, msg:'기록했습니다 — 수수료가 없으면 두 길의 결과가 똑같습니다. 이제 수수료를 붙여 봅시다.'};
   }}""",
 """  {t:'생각 — <b>수수료를 1% 이상</b> 으로 올리고 차이를 구하세요',
   f:'수수료 = {0} % · 두 번 = {1} 엔 · 바로 = {2} 엔 · 차이 = {3} 엔',
   chk(got, r, mem){
     if(!mem.ok1) return {ok:false, msg:'① 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const fee=noteNum(r[2]), v=noteNum(r[3]), d=noteNum(r[4]);
     if(!(fee>=1)) return {ok:false, msg:'수수료가 '+r[2]+' 입니다 — 1% 이상으로 올리세요.'};
     if(![0,1,2,3].every(k=>isFinite(got[k]))) return {ok:false, msg:'네 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-fee)>0.06) return {ok:false, msg:'수수료는 '+r[2]+' 입니다.'};
     if(Math.abs(got[1]-v)>2||Math.abs(got[2]-d)>2)
       return {ok:false, msg:'지금은 '+r[3]+' 엔 과 '+r[4]+' 엔 입니다.'};
     if(Math.abs(got[3]-(d-v))>2) return {ok:false, msg:'바로 바꾼 '+r[4]+' 에서 두 번 바꾼 '+r[3]+' 를 빼 보세요.'};
     if(!(d-v>0)) return {ok:false, msg:'차이가 아직 0 입니다 — 수수료를 더 올리세요.'};
     mem.d2=d-v; mem.ok2=true;
     return {ok:true, msg:'계산했습니다 — 수수료를 한 번 더 내느라 '+(d-v)+' 엔이 사라졌습니다. 환율은 그대로였습니다.'};
   }}""",
 """  {t:'판단 — 교차환율을 손으로 구해 보고 고르세요',
   f:'원/달러 = {0} · 엔/달러 = {1} · 원/달러 ÷ 엔/달러 = {2}',
   opts:['수수료가 0 이면 두 길은 <b>같은 나눗셈</b> 이라 결과가 같다 — 차이는 환율이 아니라 <b>수수료를 몇 번 내는지</b> 에서 온다',
         '두 번 바꾸는 사이에 환율이 나빠져서 손해가 난다',
         '교차환율은 두 환율을 더해서 구한다'],
   chk(got, r, mem, pick){
     if(!mem.ok2) return {ok:false, msg:'② 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const kd=noteNum(r[0]), jd=noteNum(r[1]);
     if(![0,1,2].every(k=>isFinite(got[k]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-kd)>1||Math.abs(got[1]-jd)>0.6)
       return {ok:false, msg:'화면은 '+r[0]+' 원 과 '+r[1]+' 엔 입니다.'};
     if(Math.abs(got[2]-kd/jd)>0.01) return {ok:false, msg:kd+' ÷ '+jd+' 를 구해 보세요.'};
     if(pick!==0)
       return {ok:false, msg:'수수료를 0 으로 두었을 때 두 값이 꼭 같았습니다. 그때 환율은 바뀌지 않았는데 무엇이 달라졌을까요? 다시 고르세요.'};
     return {ok:true, msg:'판단했습니다 — <b>달러는 가운데서 약분되어 사라집니다.</b> (1/a) × b 와 1 ÷ (a/b) 가 같은 수이기 때문입니다. 남는 손해는 환율이 아니라 수수료를 몇 번 내느냐에서 옵니다.'};
   }}""")
 +
 note(205, '내가 맞추고 · 내가 내리고 · 내가 판단한다',
 """  {t:'기록 — <b>이자율을 물가 상승률과 같게</b> 맞추고 적으세요',
   f:'명목 = {0} 원 · 실질 = {1} 원',
   chk(got, r, mem){
     if(!r) return {ok:false, msg:'아직 화면 값이 없습니다.'};
     const i=noteNum(r[0]), rr=noteNum(r[1]), nv=noteNum(r[3]), rv=noteNum(r[4]);
     if(Math.abs(i-rr)>0.01) return {ok:false, msg:'물가 '+r[0]+' · 이자 '+r[1]+' 입니다 — 두 값을 같게 맞추세요.'};
     if(!(i>0.01)) return {ok:false, msg:'둘 다 0 이면 아무 일도 일어나지 않습니다 — 물가와 이자를 같은 값으로 올리세요.'};
     if(![0,1].every(k=>isFinite(got[k]))) return {ok:false, msg:'두 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-nv)>2) return {ok:false, msg:'명목은 '+r[3]+' 원입니다.'};
     if(Math.abs(got[1]-rv)>2) return {ok:false, msg:'실질은 '+r[4]+' 원입니다.'};
     mem.n1=nv; mem.ok1=true;
     return {ok:true, msg:'기록했습니다 — 통장은 '+r[3]+' 원으로 늘었는데 살 수 있는 양은 처음 1만원 그대로입니다.'};
   }}""",
 """  {t:'생각 — <b>이자율을 물가 상승률보다 낮게</b> 내리고 적으세요',
   f:'물가 = {0} % · 이자 = {1} % · 명목 = {2} 원 · 실질 = {3} 원',
   chk(got, r, mem){
     if(!mem.ok1) return {ok:false, msg:'① 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const i=noteNum(r[0]), rr=noteNum(r[1]), nv=noteNum(r[3]), rv=noteNum(r[4]);
     if(!(rr<i-0.01)) return {ok:false, msg:'이자 '+r[1]+' 가 물가 '+r[0]+' 보다 낮아야 합니다.'};
     if(![0,1,2,3].every(k=>isFinite(got[k]))) return {ok:false, msg:'네 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-i)>0.06||Math.abs(got[1]-rr)>0.06)
       return {ok:false, msg:'화면은 물가 '+r[0]+' · 이자 '+r[1]+' 입니다.'};
     if(Math.abs(got[2]-nv)>2) return {ok:false, msg:'명목은 '+r[3]+' 원입니다.'};
     if(Math.abs(got[3]-rv)>2) return {ok:false, msg:'실질은 '+r[4]+' 원입니다.'};
     if(!(rv<9999)) return {ok:false, msg:'실질이 아직 1만원 아래로 내려오지 않았습니다 — 이자를 더 내리거나 기간을 늘리세요.'};
     mem.r2=rv; mem.ok2=true;
     return {ok:true, msg:'계산했습니다 — 통장은 '+r[3]+' 원인데 살 수 있는 양은 '+r[4]+' 원, 처음보다 줄었습니다.'};
   }}""",
 """  {t:'판단 — 실질을 처음 1만원과 견주어 보고 고르세요',
   f:'명목 = {0} 원 · 실질 = {1} 원 · 실질이 10000 보다 작으면 1, 크면 0 → {2}',
   opts:['중요한 것은 이자율이 아니라 <b>이자율 − 물가 상승률</b> 이다 — 둘이 같으면 살 수 있는 양이 그대로이고, 이자가 더 낮으면 돈이 늘어도 가난해진다',
         '통장 금액이 늘면 살 수 있는 양도 반드시 늘어난다',
         '물가는 통장에 찍힌 금액을 직접 줄인다'],
   chk(got, r, mem, pick){
     if(!mem.ok2) return {ok:false, msg:'② 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const nv=noteNum(r[3]), rv=noteNum(r[4]);
     if(![0,1,2].every(k=>isFinite(got[k]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-nv)>2||Math.abs(got[1]-rv)>2)
       return {ok:false, msg:'지금은 명목 '+r[3]+' 원 · 실질 '+r[4]+' 원 입니다.'};
     if(Math.abs(got[2]-(rv<10000?1:0))>0.01) return {ok:false, msg:'실질 '+r[4]+' 원을 처음 10000 원과 견주세요.'};
     if(pick!==0)
       return {ok:false, msg:'①에서는 실질이 10000 원 그대로였고 ②에서는 '+mem.r2+' 원으로 줄었습니다. 그 사이에 달라진 것은 이자와 물가의 어떤 관계일까요? 다시 고르세요.'};
     return {ok:true, msg:'판단했습니다 — <b>돈의 크기는 숫자가 아니라 살 수 있는 양입니다.</b> 명목 ÷ 물가지수 가 실질이고, 실질을 지키는 조건은 이자율 ≥ 물가 상승률 입니다 — 임금 협상에서도 똑같이 쓰는 셈법입니다.'};
   }}""")
 +
 note(206, '내가 옮기고 · 내가 뒤집고 · 내가 판단한다',
 """  {t:'기록 — <b>「지금 90만원과 견주기」</b> 를 누르고, 지금이 유리한 자리에서 적으세요',
   f:'현재가치 = {0} 원 · 깎인 금액 = {1} 원 · 두 수의 합 = {2} 원',
   chk(got, r, mem){
     if(!r) return {ok:false, msg:'아직 화면 값이 없습니다.'};
     const v=noteNum(r[2]), c=noteNum(r[3]);
     if(String(r[4])!=='지금이 유리') return {ok:false, msg:'지금 화면은 «'+r[4]+'» 입니다 — 할인율을 올리거나 시점을 멀리 두어 지금이 유리한 자리로 가세요.'};
     if(![0,1,2].every(k=>isFinite(got[k]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-v)>600) return {ok:false, msg:'현재가치는 '+r[2]+' 원입니다.'};
     if(Math.abs(got[1]-c)>600) return {ok:false, msg:'깎인 금액은 '+r[3]+' 원입니다.'};
     if(Math.abs(got[2]-1000000)>1200) return {ok:false, msg:'두 수를 더하면 미래금액 100만원이 되어야 합니다.'};
     mem.v1=v; mem.ok1=true;
     return {ok:true, msg:'기록했습니다 — 3년을 기다리는 값으로 '+r[3]+' 원이 깎였습니다. 뒤집히는 자리를 찾아봅시다.'};
   }}""",
 """  {t:'생각 — <b>기다리는 편이 나아지는 자리</b> 로 옮기고 적으세요',
   f:'할인율 = {0} % · 시점 = {1} 년 · 현재가치 = {2} 원',
   chk(got, r, mem){
     if(!mem.ok1) return {ok:false, msg:'① 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const rr=noteNum(r[0]), n=noteNum(r[1]), v=noteNum(r[2]);
     if(String(r[4])!=='기다림 유리') return {ok:false, msg:'아직 «'+r[4]+'» 입니다 — 할인율을 내리거나 시점을 당기세요 (지금 현재가치 '+r[2]+' 원).'};
     if(![0,1,2].every(k=>isFinite(got[k]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-rr)>0.06||Math.abs(got[1]-n)>0.6)
       return {ok:false, msg:'화면은 할인율 '+r[0]+' · 시점 '+r[1]+' 년 입니다.'};
     if(Math.abs(got[2]-v)>600) return {ok:false, msg:'현재가치는 '+r[2]+' 원입니다.'};
     if(!(v>900000)) return {ok:false, msg:'현재가치가 90만원을 넘어야 합니다 (지금 '+r[2]+' 원).'};
     mem.v2=v; mem.ok2=true;
     return {ok:true, msg:'계산했습니다 — 같은 100만원인데 이번에는 기다리는 편이 낫습니다. 무엇이 판단을 뒤집었을까요?'};
   }}""",
 """  {t:'판단 — 두 현재가치를 90만원과 나란히 두고 고르세요',
   f:'①의 현재가치 = {0} 원 · ②의 현재가치 = {1} 원 · ②가 90만원보다 크면 1, 작으면 0 → {2}',
   opts:['시점이 다른 돈은 <b>(1+r)ⁿ 으로 나누어 같은 시점으로 옮긴</b> 뒤에야 견줄 수 있다 — 할인율이 낮거나 기다림이 짧으면 미래의 돈이 이긴다',
         '언제나 금액이 큰 쪽이 이득이다',
         '할인율이 커지면 미래 돈의 현재가치도 함께 커진다'],
   chk(got, r, mem, pick){
     if(!mem.ok2) return {ok:false, msg:'② 칸을 먼저 통과하세요.'};
     if(![0,1,2].every(k=>isFinite(got[k]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-mem.v1)>600) return {ok:false, msg:'①에 적은 '+mem.v1+' 원입니다.'};
     if(Math.abs(got[1]-mem.v2)>600) return {ok:false, msg:'②에 적은 '+mem.v2+' 원입니다.'};
     if(Math.abs(got[2]-1)>0.01) return {ok:false, msg:'②의 현재가치를 900000 원과 견주세요.'};
     if(pick!==0)
       return {ok:false, msg:'같은 100만원인데 한 번은 '+mem.v1+' 원, 한 번은 '+mem.v2+' 원이었습니다. 금액은 그대로인데 무엇이 달라졌을까요? 다시 고르세요.'};
     return {ok:true, msg:'판단했습니다 — <b>돈에는 금액뿐 아니라 시점이 붙어 있습니다.</b> 현재가치 = 미래금액 ÷ (1+r)ⁿ 으로 시점을 맞춘 뒤에야 비교가 성립합니다 — 보상금·투자·연금을 고를 때 쓰는 그 셈법입니다.'};
   }}""")
 +
 note(207, '내가 내리고 · 내가 맞추고 · 내가 판단한다',
 """  {t:'기록 — <b>가격을 균형보다 훨씬 낮게</b> 내리고 적으세요',
   f:'가격 = {0} · 수요량 = {1} · 공급량 = {2} · 차이 = {3}',
   chk(got, r, mem){
     if(!r) return {ok:false, msg:'아직 화면 값이 없습니다.'};
     const p=noteNum(r[0]), qd=noteNum(r[1]), qs=noteNum(r[2]), g=noteNum(r[3]);
     if(!(g>6)) return {ok:false, msg:'차이가 '+r[3]+' 입니다 — 가격을 더 내려 차이를 6 보다 크게 만드세요.'};
     if(![0,1,2,3].every(k=>isFinite(got[k]))) return {ok:false, msg:'네 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-p)>0.06) return {ok:false, msg:'가격은 '+r[0]+' 입니다.'};
     if(Math.abs(got[1]-qd)>0.2||Math.abs(got[2]-qs)>0.2)
       return {ok:false, msg:'화면은 수요량 '+r[1]+' · 공급량 '+r[2]+' 입니다.'};
     if(Math.abs(got[3]-g)>0.2) return {ok:false, msg:'차이는 '+r[3]+' 입니다.'};
     mem.g1=g; mem.eq=noteNum(r[4]);
     return {ok:true, msg:'기록했습니다 — 사려는 양이 팔려는 양보다 '+r[3]+' 만큼 많습니다. 모자랍니다.'};
   }}""",
 """  {t:'생각 — <b>「균형가격으로」</b> 를 누르고 다시 적으세요',
   f:'가격 = {0} · 수요량 = {1} · 공급량 = {2} · 차이 = {3}',
   chk(got, r, mem){
     if(mem.g1===undefined) return {ok:false, msg:'① 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const p=noteNum(r[0]), qd=noteNum(r[1]), qs=noteNum(r[2]), g=noteNum(r[3]);
     if(!(Math.abs(g)<0.6)) return {ok:false, msg:'차이가 '+r[3]+' 입니다 — 「균형가격으로」 를 누르세요.'};
     if(![0,1,2,3].every(k=>isFinite(got[k]))) return {ok:false, msg:'네 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-p)>0.06) return {ok:false, msg:'가격은 '+r[0]+' 입니다.'};
     if(Math.abs(got[1]-qd)>0.2||Math.abs(got[2]-qs)>0.2)
       return {ok:false, msg:'화면은 수요량 '+r[1]+' · 공급량 '+r[2]+' 입니다.'};
     if(Math.abs(got[3]-g)>0.2) return {ok:false, msg:'차이는 '+r[3]+' 입니다.'};
     mem.ok2=true;
     return {ok:true, msg:'계산했습니다 — 차이가 거의 0 입니다. 남지도 모자라지도 않습니다.'};
   }}""",
 """  {t:'판단 — 균형가격을 손으로 구해 화면과 맞춰 보고 고르세요',
   f:'화면의 균형가격 = {0} · 60 ÷ (수요 기울기 + 4) 를 손으로 = {1} · 두 값이 같으면 1, 다르면 0 → {2}',
   opts:['수요량과 공급량을 <b>같다고 놓고 푼 일차방정식의 해</b> 가 균형가격이다 — 그보다 낮으면 모자라고 높으면 남으므로, 가격은 그 한 점으로 밀려간다',
         '균형가격은 수요량과 공급량의 평균이다',
         '가격이 낮아지면 사려는 양과 팔려는 양이 함께 늘어난다'],
   chk(got, r, mem, pick){
     if(!mem.ok2) return {ok:false, msg:'② 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const eq=noteNum(r[4]);
     if(![0,1,2].every(k=>isFinite(got[k]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-eq)>0.01) return {ok:false, msg:'화면의 균형가격은 '+r[4]+' 입니다.'};
     if(Math.abs(got[1]-eq)>0.02) return {ok:false, msg:'60 을 (지금 수요 기울기 + 4) 로 나누어 보세요 — 화면의 '+r[4]+' 와 같아져야 합니다.'};
     if(Math.abs(got[2]-1)>0.01) return {ok:false, msg:'두 값을 견주세요.'};
     if(pick!==0)
       return {ok:false, msg:'가격이 낮을 때 차이가 '+mem.g1+' 였는데 한 점에서 0 이 되었습니다. 그 한 점은 무슨 식의 해일까요? 다시 고르세요.'};
     return {ok:true, msg:'판단했습니다 — <b>균형가격은 두 일차함수의 교점입니다.</b> 60 − dP = 4P 를 푸는 것과 시장에서 가격이 정해지는 일이 같은 셈이고, 교점을 구하는 연립방정식이 그대로 경제의 언어가 됩니다.'};
   }}""")
 +
 note(208, '내가 찾고 · 내가 올리고 · 내가 판단한다',
 """  {t:'기록 — <b>「매출이 가장 큰 가격으로」</b> 를 누르고 적으세요',
   f:'가격 = {0} · 매출 = {1} · 탄력성 = {2}',
   chk(got, r, mem){
     if(!r) return {ok:false, msg:'아직 화면 값이 없습니다.'};
     const p=noteNum(r[0]), rv=noteNum(r[2]), el=noteNum(r[3]), bp=noteNum(r[4]);
     if(Math.abs(p-bp)>0.3||Math.abs(el-1)>0.1) return {ok:false, msg:'가격이 '+r[0]+' · 탄력성이 '+r[3]+' 입니다 — 「매출이 가장 큰 가격으로」 를 누르세요 (최대 가격 '+r[4]+').'};
     if(![0,1,2].every(k=>isFinite(got[k]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-p)>0.06) return {ok:false, msg:'가격은 '+r[0]+' 입니다.'};
     if(Math.abs(got[1]-rv)>0.2) return {ok:false, msg:'매출은 '+r[2]+' 입니다.'};
     if(Math.abs(got[2]-el)>0.02) return {ok:false, msg:'탄력성은 '+r[3]+' 입니다.'};
     mem.rev1=rv; mem.p1=p;
     return {ok:true, msg:'기록했습니다 — 매출이 가장 큰 자리의 탄력성이 '+r[3]+' 입니다. 여기서 값을 더 올려 봅시다.'};
   }}""",
 """  {t:'생각 — <b>가격을 더 올려</b> 탄력성을 1 보다 크게 만들고, 줄어든 매출을 구하세요',
   f:'가격 = {0} · 매출 = {1} · 탄력성 = {2} · ①의 매출에서 줄어든 양 = {3}',
   chk(got, r, mem){
     if(mem.rev1===undefined) return {ok:false, msg:'① 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const p=noteNum(r[0]), rv=noteNum(r[2]), el=noteNum(r[3]);
     if(!(el>1.2)) return {ok:false, msg:'탄력성이 '+r[3]+' 입니다 — 가격을 더 올려 1.2 보다 크게 만드세요.'};
     if(![0,1,2,3].every(k=>isFinite(got[k]))) return {ok:false, msg:'네 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-p)>0.06) return {ok:false, msg:'가격은 '+r[0]+' 입니다.'};
     if(Math.abs(got[1]-rv)>0.2) return {ok:false, msg:'매출은 '+r[2]+' 입니다.'};
     if(Math.abs(got[2]-el)>0.02) return {ok:false, msg:'탄력성은 '+r[3]+' 입니다.'};
     if(Math.abs(got[3]-(mem.rev1-rv))>0.3) return {ok:false, msg:'①의 매출 '+mem.rev1+' 에서 지금 매출 '+r[2]+' 를 빼 보세요.'};
     mem.rev2=rv; mem.ok2=true;
     return {ok:true, msg:'계산했습니다 — 값을 올렸는데 매출이 '+(mem.rev1-rv).toFixed(1)+' 줄었습니다. 손님이 더 많이 떠난 셈입니다.'};
   }}""",
 """  {t:'판단 — <b>「매출이 가장 큰 가격으로」</b> 를 다시 누른 뒤 고르세요',
   f:'매출이 가장 큰 가격 = {0} · 그 자리의 탄력성 = {1} · 1 이면 1, 아니면 0 → {2}',
   opts:['매출은 가격의 <b>이차함수</b> 이고 꼭짓점에서 최대가 된다 — 바로 그 자리의 탄력성이 정확히 1 이며, 1 보다 커지면 올릴수록 매출이 줄어든다',
         '탄력성이 클수록 매출도 크다',
         '값을 올리면 매출은 언제나 늘어난다'],
   chk(got, r, mem, pick){
     if(!mem.ok2) return {ok:false, msg:'② 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const p=noteNum(r[0]), el=noteNum(r[3]), bp=noteNum(r[4]);
     if(Math.abs(p-bp)>0.3||Math.abs(el-1)>0.1) return {ok:false, msg:'「매출이 가장 큰 가격으로」 를 다시 눌러 주세요 (지금 가격 '+r[0]+' · 탄력성 '+r[3]+').'};
     if(![0,1,2].every(k=>isFinite(got[k]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-p)>0.06) return {ok:false, msg:'가격은 '+r[0]+' 입니다.'};
     if(Math.abs(got[1]-el)>0.02) return {ok:false, msg:'탄력성은 '+r[3]+' 입니다.'};
     if(Math.abs(got[2]-1)>0.01) return {ok:false, msg:'탄력성 '+r[3]+' 을 1 과 견주세요.'};
     if(pick!==0)
       return {ok:false, msg:'매출이 '+mem.rev1+' 에서 '+mem.rev2+' 로 줄었고, 가장 큰 자리의 탄력성은 '+r[3]+' 였습니다. 매출을 가격의 식으로 쓰면 무슨 모양일까요? 다시 고르세요.'};
     return {ok:true, msg:'판단했습니다 — <b>「값을 올리면 더 번다」는 탄력성이 1 보다 작을 때만 맞습니다.</b> 매출 = P(60 − sP) 는 아래로 열린 이차함수이고, 꼭짓점이 바로 탄력성 1 인 자리입니다 — 이차함수의 최대가 가격 정책이 되는 셈입니다.'};
   }}""")
 +
 note(209, '내가 누르고 · 내가 풀고 · 내가 판단한다',
 """  {t:'기록 — <b>「강한 규제 (4천원)」</b> 를 누르고 적으세요',
   f:'상한 = {0} · 수요량 = {1} · 공급량 = {2} · 부족분 = {3}',
   chk(got, r, mem){
     if(!r) return {ok:false, msg:'아직 화면 값이 없습니다.'};
     const cap=noteNum(r[0]), qd=noteNum(r[1]), qs=noteNum(r[2]), s=noteNum(r[3]);
     if(String(r[4])!=='있음') return {ok:false, msg:'지금 상한은 효력이 «'+r[4]+'» 입니다 — 「강한 규제 (4천원)」 를 누르세요.'};
     if(!(s>=10)) return {ok:false, msg:'부족분이 '+r[3]+' 입니다 — 상한을 더 낮춰 10 이상으로 만드세요.'};
     if(![0,1,2,3].every(k=>isFinite(got[k]))) return {ok:false, msg:'네 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-cap)>0.06) return {ok:false, msg:'상한은 '+r[0]+' 입니다.'};
     if(Math.abs(got[1]-qd)>0.2||Math.abs(got[2]-qs)>0.2)
       return {ok:false, msg:'화면은 수요량 '+r[1]+' · 공급량 '+r[2]+' 입니다.'};
     if(Math.abs(got[3]-s)>0.2) return {ok:false, msg:'부족분은 '+r[3]+' 입니다.'};
     if(Math.abs(s-(qd-qs))>0.3) return {ok:false, msg:'부족분이 수요량 − 공급량 과 맞지 않습니다 — 화면을 다시 보세요.'};
     mem.s1=s; mem.c1=cap;
     return {ok:true, msg:'기록했습니다 — 값은 눌렀지만 '+r[3]+' 만큼이 모자랍니다. 이번에는 규제를 없애 봅시다.'};
   }}""",
 """  {t:'생각 — <b>「규제 없애기」</b> 를 누르고 다시 적으세요',
   f:'상한 = {0} · 수요량 = {1} · 공급량 = {2} · 부족분 = {3}',
   chk(got, r, mem){
     if(mem.s1===undefined) return {ok:false, msg:'① 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const cap=noteNum(r[0]), qd=noteNum(r[1]), qs=noteNum(r[2]), s=noteNum(r[3]);
     if(String(r[4])!=='없음') return {ok:false, msg:'아직 효력이 «'+r[4]+'» 입니다 — 「규제 없애기」 를 눌러 상한을 균형보다 높게 올리세요.'};
     if(![0,1,2,3].every(k=>isFinite(got[k]))) return {ok:false, msg:'네 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-cap)>0.06) return {ok:false, msg:'상한은 '+r[0]+' 입니다.'};
     if(Math.abs(got[1]-qd)>0.2||Math.abs(got[2]-qs)>0.2)
       return {ok:false, msg:'화면은 수요량 '+r[1]+' · 공급량 '+r[2]+' 입니다.'};
     if(Math.abs(got[3]-s)>0.2) return {ok:false, msg:'부족분은 '+r[3]+' 입니다.'};
     if(Math.abs(s)>0.2) return {ok:false, msg:'부족분이 아직 '+r[3]+' 입니다 — 상한을 균형가격보다 더 높이 올리세요.'};
     mem.ok2=true;
     return {ok:true, msg:'계산했습니다 — 상한이 균형보다 높으면 부족분이 0 입니다. 아무 일도 하지 않은 셈입니다.'};
   }}""",
 """  {t:'판단 — 두 부족분을 나란히 두고 고르세요',
   f:'①의 부족분 = {0} · ②의 부족분 = {1} · 상한이 균형보다 낮을 때만 부족분이 생기면 1, 아니면 0 → {2}',
   opts:['상한은 <b>균형가격보다 낮을 때만</b> 효력이 있고, 그때 수요량 − 공급량 만큼 부족분이 생긴다 — 가격을 눌러도 두 식은 움직이지 않는다',
         '상한을 두면 언제나 부족분이 생긴다',
         '가격을 누르면 팔려는 양도 함께 늘어나 모두가 싸게 산다'],
   chk(got, r, mem, pick){
     if(!mem.ok2) return {ok:false, msg:'② 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     if(![0,1,2].every(k=>isFinite(got[k]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-mem.s1)>0.2) return {ok:false, msg:'①에 적은 '+mem.s1+' 입니다.'};
     if(Math.abs(got[1])>0.2) return {ok:false, msg:'②의 부족분은 0 이었습니다.'};
     if(Math.abs(got[2]-1)>0.01) return {ok:false, msg:'두 경우를 견주어 보세요.'};
     if(pick!==0)
       return {ok:false, msg:'상한 '+mem.c1+' 에서는 '+mem.s1+' 이 모자랐는데, 상한을 높이자 0 이 되었습니다. 상한이 하는 일은 언제 생길까요? 다시 고르세요.'};
     return {ok:true, msg:'판단했습니다 — <b>가격을 눌러도 수요와 공급의 식은 그대로입니다.</b> 눌린 가격과 두 식 사이의 틈이 곧 부족분이고, 그 틈은 줄·추첨·웃돈 같은 다른 방식으로 메워집니다 — 정책을 부등식으로 읽는 셈입니다.'};
   }}""")
 +
 note(210, '내가 몰고 · 내가 재고 · 내가 판단한다',
 """  {t:'기록 — <b>곡선</b> 인 채로 비율을 <b>30% 이하</b> 로 두고 적으세요',
   f:'비율 = {0} % · 빵 = {1} · 우유 = {2} · 기회비용 = {3}',
   chk(got, r, mem){
     if(!r) return {ok:false, msg:'아직 화면 값이 없습니다.'};
     const t=noteNum(r[0]), b=noteNum(r[1]), m=noteNum(r[2]), o=noteNum(r[3]);
     if(String(r[4])!=='곡선') return {ok:false, msg:'생산 방식이 «'+r[4]+'» 입니다 — 곡선으로 바꾸세요.'};
     if(!(t<=30)) return {ok:false, msg:'비율이 '+r[0]+' 입니다 — 30% 이하로 내리세요.'};
     if(!isFinite(o)) return {ok:false, msg:'기회비용이 «'+r[3]+'» 입니다 — 비율을 조금 내려 보세요.'};
     if(![0,1,2,3].every(k=>isFinite(got[k]))) return {ok:false, msg:'네 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-t)>1) return {ok:false, msg:'비율은 '+r[0]+' 입니다.'};
     if(Math.abs(got[1]-b)>0.2||Math.abs(got[2]-m)>0.2)
       return {ok:false, msg:'화면은 빵 '+r[1]+' · 우유 '+r[2]+' 입니다.'};
     if(Math.abs(got[3]-o)>0.02) return {ok:false, msg:'기회비용은 '+r[3]+' 입니다.'};
     mem.o1=o;
     return {ok:true, msg:'기록했습니다 — 빵을 조금 만드는 자리에서는 우유를 '+r[3]+' 만큼만 포기합니다. 빵 쪽으로 몰아 봅시다.'};
   }}""",
 """  {t:'생각 — 비율을 <b>80% 이상</b> 으로 올리고, 늘어난 기회비용을 구하세요',
   f:'비율 = {0} % · 기회비용 = {1} · ①의 기회비용에서 뺀 차 = {2}',
   chk(got, r, mem){
     if(mem.o1===undefined) return {ok:false, msg:'① 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const t=noteNum(r[0]), o=noteNum(r[3]);
     if(String(r[4])!=='곡선') return {ok:false, msg:'②는 곡선에서 봅니다 — 생산 방식을 곡선으로 두세요.'};
     if(!(t>=80)) return {ok:false, msg:'비율이 '+r[0]+' 입니다 — 80% 이상으로 올리세요.'};
     if(!isFinite(o)) return {ok:false, msg:'기회비용이 «'+r[3]+'» 입니다 — 비율을 100% 아래로 내리세요.'};
     if(![0,1,2].every(k=>isFinite(got[k]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-t)>1) return {ok:false, msg:'비율은 '+r[0]+' 입니다.'};
     if(Math.abs(got[1]-o)>0.02) return {ok:false, msg:'기회비용은 '+r[3]+' 입니다.'};
     if(Math.abs(got[2]-(o-mem.o1))>0.03) return {ok:false, msg:'지금 '+r[3]+' 에서 ①의 '+mem.o1+' 를 빼 보세요.'};
     if(!(o>mem.o1)) return {ok:false, msg:'①의 '+mem.o1+' 보다 커지지 않았습니다 — 비율을 더 올리세요.'};
     mem.o2=o; mem.ok2=true;
     return {ok:true, msg:'계산했습니다 — 같은 10%p 를 옮기는데 포기하는 우유가 '+(o-mem.o1).toFixed(3)+' 만큼 더 늘었습니다.'};
   }}""",
 """  {t:'판단 — <b>생산 방식을 직선</b> 으로 바꾼 뒤 고르세요',
   f:'직선의 기회비용 = {0} · 30 ÷ 40 = {1} · 두 값이 같으면 1, 다르면 0 → {2}',
   opts:['기회비용은 <b>곡선의 기울기의 절댓값</b> 이다 — 곡선이 휘어 있으면 한쪽으로 몰수록 커지고, 직선이면 어디서나 같아 특화의 이득이 없다',
         '기회비용은 포기한 것을 돈으로 바꾼 값이다',
         '곡선이든 직선이든 기회비용은 늘 같다'],
   chk(got, r, mem, pick){
     if(!mem.ok2) return {ok:false, msg:'② 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const o=noteNum(r[3]);
     if(String(r[4])!=='직선') return {ok:false, msg:'생산 방식을 «직선» 으로 바꾸세요 (지금 '+r[4]+').'};
     if(!isFinite(o)) return {ok:false, msg:'기회비용이 «'+r[3]+'» 입니다 — 비율을 100% 아래로 내리세요.'};
     if(![0,1,2].every(k=>isFinite(got[k]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-o)>0.02) return {ok:false, msg:'기회비용은 '+r[3]+' 입니다.'};
     if(Math.abs(got[1]-0.75)>0.02) return {ok:false, msg:'30 을 40 으로 나누어 보세요.'};
     if(Math.abs(got[2]-1)>0.01) return {ok:false, msg:'두 값을 견주세요.'};
     if(pick!==0)
       return {ok:false, msg:'곡선에서는 '+mem.o1+' 에서 '+mem.o2+' 로 커졌는데, 직선에서는 비율을 아무리 옮겨도 '+r[3]+' 입니다. 두 경우에 달라지는 것이 무엇일까요? 다시 고르세요.'};
     return {ok:true, msg:'판단했습니다 — <b>기회비용은 곡선의 기울기입니다.</b> 바깥으로 휜 곡선은 「각자 잘하는 것부터 한다」는 특화를 뜻하고, 그래서 한쪽으로 몰수록 포기해야 할 양이 커집니다 — 진로와 시간을 쓰는 일도 같은 모양입니다.'};
   }}""")
)
