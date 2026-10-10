# -*- coding: utf-8 -*-
"""LAB 351~355 탐구 노트 — 기록 → 생각 → 판단. 관문은 화면이 내놓는 수로만 세운다."""


def note(no, head, c1, c2, c3):
    return "\n %d:{ h:'%s',\n  c:[\n%s,\n%s,\n%s\n ]},\n" % (no, head, c1, c2, c3)


NOTES = (
 note(351, '내가 기울이고 · 내가 세우고 · 내가 판단한다',
 """  {t:'기록 — <b>각을 70°</b> 로 두고 적으세요',
   f:'각 = {0}° · 중심까지의 거리 = {1} · 만나는 점 = {2} 개',
   chk(got, r, mem){
     if(!r) return {ok:false, msg:'아직 화면 값이 없습니다.'};
     const th=noteNum(r[0]), d=noteNum(r[1]), h=noteNum(r[2]);
     if(th!==70) return {ok:false, msg:'각을 70° 로 맞추세요 (지금 '+r[0]+').'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-70)>0.5) return {ok:false, msg:'각은 70 입니다.'};
     if(Math.abs(got[1]-d)>0.05) return {ok:false, msg:'중심까지의 거리는 '+r[1]+' 입니다.'};
     if(Math.abs(got[2]-h)>0.1) return {ok:false, msg:'만나는 점은 '+r[2]+' 개입니다.'};
     mem.d1=d; mem.h1=h;
     return {ok:true, msg:'기록했습니다 — 반지름보다 가까우니 원을 뚫고 지납니다.'};
   }}""",
 """  {t:'생각 — <b>각을 90°</b> 로 맞추고 다시 적으세요',
   f:'각 = {0}° · 중심까지의 거리 = {1} · 만나는 점 = {2} 개',
   chk(got, r, mem){
     if(mem.d1===undefined) return {ok:false, msg:'① 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const th=noteNum(r[0]), d=noteNum(r[1]), h=noteNum(r[2]);
     if(h!==1) return {ok:false, msg:'아직 두 점에서 만납니다 — 각을 90° 로 맞추세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-th)>0.5) return {ok:false, msg:'각은 '+r[0]+' 입니다.'};
     if(Math.abs(got[1]-d)>0.05) return {ok:false, msg:'중심까지의 거리는 '+r[1]+' 입니다.'};
     if(Math.abs(got[2]-1)>0.1) return {ok:false, msg:'만나는 점은 1 개입니다.'};
     mem.d2=d; mem.ok2=true;
     return {ok:true, msg:'계산했습니다 — 거리가 반지름과 꼭 같아졌습니다.'};
   }}""",
 """  {t:'판단 — 접선의 조건을 고르세요',
   f:'①의 거리 = {0} · ②의 거리 = {1} · 접선이 될 때의 거리 = {2}',
   opts:['중심에서 직선까지의 거리가 <b>반지름과 같을 때</b> 만 접한다 — 그 수선의 발이 접점이므로 접선은 접점에서 그은 반지름과 수직이다',
         '직선이 원 위의 한 점을 지나기만 하면 접선이다',
         '거리가 반지름보다 멀수록 더 잘 접한다'],
   chk(got, r, mem, pick){
     if(!mem.ok2) return {ok:false, msg:'② 칸을 먼저 통과하세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-mem.d1)>0.05) return {ok:false, msg:'①에 적은 '+mem.d1+' 입니다.'};
     if(Math.abs(got[1]-mem.d2)>0.05) return {ok:false, msg:'②에 적은 '+mem.d2+' 입니다.'};
     if(Math.abs(got[2]-95)>1) return {ok:false, msg:'②에서 한 점이 되었을 때의 거리입니다.'};
     if(pick!==0)
       return {ok:false, msg:'①도 원 위의 한 점을 지났지만 두 점에서 만났습니다. 그것도 접선일까요? 다시 고르세요.'};
     return {ok:true, msg:'판단했습니다 — <b>거리 = 반지름</b> 일 때만 접합니다. 그래서 접선은 접점의 반지름과 수직입니다.'};
   }}"""
 )
 + note(352, '내가 담고 · 내가 줄이고 · 내가 판단한다',
 """  {t:'기록 — <b>가는 줄무늬</b> 를 고르고 <b>N = 24</b> 에서 적으세요',
   f:'N = {0} · 칸 수 = {1} · 보이는 줄 수 = {2}',
   chk(got, r, mem){
     if(!r) return {ok:false, msg:'아직 화면 값이 없습니다.'};
     const N=noteNum(r[1]), cnt=noteNum(r[2]), sh=noteNum(r[3]);
     if(sh!==8) return {ok:false, msg:'「가는 줄무늬」 를 고르고 N 을 24 로 두세요 — 원본대로 줄이 여덟 개 보여야 합니다.'};
     if(N!==24) return {ok:false, msg:'N 을 24 로 맞추세요 (지금 '+r[1]+').'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-24)>0.5) return {ok:false, msg:'N 은 24 입니다.'};
     if(Math.abs(got[1]-cnt)>0.5) return {ok:false, msg:'칸 수는 '+r[2]+' 입니다.'};
     if(Math.abs(got[2]-8)>0.1) return {ok:false, msg:'보이는 줄 수는 '+r[3]+' 입니다.'};
     mem.sh1=sh;
     return {ok:true, msg:'기록했습니다 — 아직 여덟 줄이 그대로 담겼습니다.'};
   }}""",
 """  {t:'생각 — <b>N 을 12</b> 로 줄이고 다시 적으세요',
   f:'N = {0} · 칸 수 = {1} · 보이는 줄 수 = {2}',
   chk(got, r, mem){
     if(mem.sh1===undefined) return {ok:false, msg:'① 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const N=noteNum(r[1]), cnt=noteNum(r[2]), sh=noteNum(r[3]);
     if(N!==12) return {ok:false, msg:'N 을 12 로 줄이세요 (지금 '+r[1]+').'};
     if(!(sh>0 && sh!==8)) return {ok:false, msg:'「가는 줄무늬」 를 고른 채로 줄이세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-12)>0.5) return {ok:false, msg:'N 은 12 입니다.'};
     if(Math.abs(got[1]-cnt)>0.5) return {ok:false, msg:'칸 수는 '+r[2]+' 입니다.'};
     if(Math.abs(got[2]-sh)>0.1) return {ok:false, msg:'보이는 줄 수는 '+r[3]+' 입니다.'};
     mem.sh2=sh; mem.ok2=true;
     return {ok:true, msg:'계산했습니다 — 여덟 줄이 '+r[3]+' 줄로 보입니다. 없던 무늬입니다.'};
   }}""",
 """  {t:'판단 — 담을 수 있는 조건을 고르세요',
   f:'①의 보이는 줄 수 = {0} · ②의 보이는 줄 수 = {1} · N = 12 일 때의 칸 수 = {2}',
   opts:['무늬 <b>한 주기 안에 칸이 둘은 들어가야</b> 담긴다 — 그보다 성기게 재면 담기지 않을 뿐 아니라 원래 없던 가짜 무늬가 나타난다',
         '칸을 줄이면 무늬가 흐려질 뿐 개수는 그대로다',
         '칸을 줄일수록 무늬가 더 또렷해진다'],
   chk(got, r, mem, pick){
     if(!mem.ok2) return {ok:false, msg:'② 칸을 먼저 통과하세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-8)>0.1) return {ok:false, msg:'①에서는 여덟 줄이었습니다.'};
     if(Math.abs(got[1]-mem.sh2)>0.1) return {ok:false, msg:'②에 적은 '+mem.sh2+' 입니다.'};
     if(Math.abs(got[2]-144)>1) return {ok:false, msg:'12 를 제곱하세요.'};
     if(pick!==0)
       return {ok:false, msg:'②에서 줄 수가 8 에서 '+mem.sh2+' 로 바뀌었습니다. 개수가 그대로였나요? 다시 고르세요.'};
     return {ok:true, msg:'판단했습니다 — <b>한 주기에 칸 둘</b> 이 최소 조건입니다. 그러지 못하면 가짜 무늬가 생깁니다.'};
   }}"""
 )
 + note(353, '내가 풀고 · 내가 걷고 · 내가 판단한다',
 """  {t:'기록 — <b>정규방정식으로</b> 를 눌러 그 답을 적으세요',
   f:'a = {0} · b = {1} · 잔차제곱합 = {2}',
   chk(got, r, mem){
     if(!r) return {ok:false, msg:'아직 화면 값이 없습니다.'};
     if(isFinite(noteNum(r[0]))) return {ok:false, msg:'「정규방정식으로」 를 눌러 주세요 (지금은 걸음 '+r[0]+').'};
     const a=noteNum(r[1]), b=noteNum(r[2]), s=noteNum(r[3]);
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-a)>0.001) return {ok:false, msg:'a 는 '+r[1]+' 입니다.'};
     if(Math.abs(got[1]-b)>0.001) return {ok:false, msg:'b 는 '+r[2]+' 입니다.'};
     if(Math.abs(got[2]-s)>0.001) return {ok:false, msg:'잔차제곱합은 '+r[3]+' 입니다.'};
     mem.A=a; mem.B=b; mem.S=s;
     return {ok:true, msg:'기록했습니다 — 식 두 개를 풀어 한 번에 나온 답입니다.'};
   }}""",
 """  {t:'생각 — <b>처음으로</b> 를 누른 뒤 <b>100걸음</b> 을 네 번 눌러 다시 적으세요',
   f:'걸음 = {0} · a = {1} · 잔차제곱합 = {2}',
   chk(got, r, mem){
     if(mem.A===undefined) return {ok:false, msg:'① 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const st=noteNum(r[0]), a=noteNum(r[1]), s=noteNum(r[3]);
     if(!isFinite(st)) return {ok:false, msg:'아직 「정규방정식으로」 의 답입니다 — 「처음으로」 를 누르고 걸어 보세요.'};
     if(!(st>=400)) return {ok:false, msg:'걸음이 '+r[0]+' 입니다 — 400 걸음까지 가세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-st)>0.5) return {ok:false, msg:'걸음은 '+r[0]+' 입니다.'};
     if(Math.abs(got[1]-a)>0.001) return {ok:false, msg:'a 는 '+r[1]+' 입니다.'};
     if(Math.abs(got[2]-s)>0.001) return {ok:false, msg:'잔차제곱합은 '+r[3]+' 입니다.'};
     if(!(s>=mem.S)) return {ok:false, msg:'걸어서 간 자리의 잔차제곱합이 ①보다 작을 수는 없습니다 — 화면을 다시 보세요.'};
     mem.a2=a; mem.ok2=true;
     return {ok:true, msg:'계산했습니다 — 400 걸음 걸어 겨우 ①의 자리에 닿았습니다.'};
   }}""",
 """  {t:'판단 — 두 길을 나란히 두고 고르세요',
   f:'①(정규방정식)의 a = {0} · ②(400걸음)의 a = {1} · a, b 로 미분해 0 으로 둔 식의 개수 = {2}',
   opts:['미지수가 a, b 둘이므로 식도 둘이고, 이 <b>연립일차방정식을 풀면 한 번에</b> 답이 나온다 — 걸어서 가도 같은 곳에 닿지만 수백 걸음이 든다',
         '걸어서 가는 길과 풀어서 가는 길은 서로 다른 답에 닿는다',
         '되풀이해 걷는 쪽이 언제나 더 빠르다'],
   chk(got, r, mem, pick){
     if(!mem.ok2) return {ok:false, msg:'② 칸을 먼저 통과하세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-mem.A)>0.001) return {ok:false, msg:'①에 적은 '+mem.A+' 입니다.'};
     if(Math.abs(got[1]-mem.a2)>0.001) return {ok:false, msg:'②에 적은 '+mem.a2+' 입니다.'};
     if(Math.abs(got[2]-2)>0.1) return {ok:false, msg:'미지수가 몇 개인가요?'};
     if(pick!==0)
       return {ok:false, msg:'①의 a 는 '+mem.A+' , ②의 a 는 '+mem.a2+' 로 거의 같았습니다. 서로 다른 답일까요? 다시 고르세요.'};
     return {ok:true, msg:'판단했습니다 — <b>같은 곳에 닿습니다.</b> 다만 미지수가 적을 때는 풀어서 가는 쪽이 한 번에 끝나고, 미지수가 아주 많아지면 걸어서 가는 쪽이 유리해집니다.'};
   }}"""
 )
 + note(354, '내가 그냥 가고 · 내가 관성을 주고 · 내가 판단한다',
 """  {t:'기록 — <b>β = 0</b> 으로 두고 <b>20걸음</b> 간 뒤 적으세요',
   f:'β = {0} · 걸음 = {1} · 바닥까지 남은 거리 = {2}',
   chk(got, r, mem){
     if(!r) return {ok:false, msg:'아직 화면 값이 없습니다.'};
     const be=noteNum(r[1]), st=noteNum(r[2]), d=noteNum(r[3]);
     if(Math.abs(be)>0.01) return {ok:false, msg:'관성 β 를 0 으로 두세요 (지금 '+r[1]+').'};
     if(!(st>=20)) return {ok:false, msg:'「20걸음」 을 눌러 주세요 (지금 '+r[2]+' 걸음).'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0])>0.05) return {ok:false, msg:'β 는 0 입니다.'};
     if(Math.abs(got[1]-st)>0.5) return {ok:false, msg:'걸음은 '+r[2]+' 입니다.'};
     if(Math.abs(got[2]-d)>0.01) return {ok:false, msg:'남은 거리는 '+r[3]+' 입니다.'};
     mem.d1=d;
     return {ok:true, msg:'기록했습니다 — 스무 걸음을 갔는데 아직 '+r[3]+' 이 남았습니다.'};
   }}""",
 """  {t:'생각 — <b>처음으로</b> 를 누르고 <b>β = 0.8</b> 로 올려 다시 <b>20걸음</b> 간 뒤 적으세요',
   f:'β = {0} · 바닥까지 남은 거리 = {1} · ①보다 가까워졌으면 1 아니면 0 → {2}',
   chk(got, r, mem){
     if(mem.d1===undefined) return {ok:false, msg:'① 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const be=noteNum(r[1]), st=noteNum(r[2]), d=noteNum(r[3]);
     if(!(be>=0.7)) return {ok:false, msg:'관성 β 를 0.8 로 올리세요 (지금 '+r[1]+').'};
     if(st!==20) return {ok:false, msg:'「처음으로」 를 누르고 「20걸음」 을 한 번만 눌러 주세요 (지금 '+r[2]+' 걸음).'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-be)>0.05) return {ok:false, msg:'β 는 '+r[1]+' 입니다.'};
     if(Math.abs(got[1]-d)>0.01) return {ok:false, msg:'남은 거리는 '+r[3]+' 입니다.'};
     if(Math.abs(got[2]-1)>0.1) return {ok:false, msg:'①의 '+mem.d1+' 에서 '+r[3]+' 로 줄었으니 1 입니다.'};
     if(!(d<mem.d1)) return {ok:false, msg:'①보다 가까워져야 합니다 — 「처음으로」 를 누르고 다시 가 보세요.'};
     mem.d2=d; mem.ok2=true;
     return {ok:true, msg:'계산했습니다 — 같은 스무 걸음으로 훨씬 가까이 갔습니다.'};
   }}""",
 """  {t:'판단 — 관성이 한 일을 고르세요',
   f:'①(β = 0)의 남은 거리 = {0} · ②(β = 0.8)의 남은 거리 = {1} · 두 거리의 차 = {2}',
   opts:['관성은 <b>같은 방향으로 거듭된 작은 걸음을 겹쳐 쌓아</b> 준다 — 그래서 기울기가 작은 완만한 쪽으로도 같은 걸음 수에 훨씬 멀리 나아간다',
         '관성은 한 걸음의 크기를 키우므로 β 가 클수록 언제나 좋다',
         '관성을 주면 가파른 쪽으로 더 빨리 내려간다'],
   chk(got, r, mem, pick){
     if(!mem.ok2) return {ok:false, msg:'② 칸을 먼저 통과하세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-mem.d1)>0.01) return {ok:false, msg:'①에 적은 '+mem.d1+' 입니다.'};
     if(Math.abs(got[1]-mem.d2)>0.01) return {ok:false, msg:'②에 적은 '+mem.d2+' 입니다.'};
     if(Math.abs(got[2]-(mem.d1-mem.d2))>0.02) return {ok:false, msg:'①에서 ②를 빼 보세요.'};
     if(pick!==0)
       return {ok:false, msg:'①에서도 세로(가파른 쪽)는 이미 바닥에 닿아 있었습니다. 관성이 가파른 쪽을 도운 걸까요? β 를 0.9 로 올려 보고 다시 고르세요.'};
     return {ok:true, msg:'판단했습니다 — <b>작은 걸음을 겹쳐 쌓습니다.</b> 다만 β 를 0.9 로 올리면 바닥을 지나쳐 되레 멀어집니다.'};
   }}"""
 )
 + note(355, '내가 게으르게 하고 · 내가 제대로 하고 · 내가 판단한다',
 """  {t:'기록 — <b>양성 비율 1 %</b> · <b>모두 「음성」</b> 으로 두고 적으세요',
   f:'양성 비율 = {0} % · 정확도 = {1} % · 재현율 = {2} %',
   chk(got, r, mem){
     if(!r) return {ok:false, msg:'아직 화면 값이 없습니다.'};
     const pr=noteNum(r[0]), acc=noteNum(r[2]), rec=noteNum(r[3]);
     if(!(pr<=5)) return {ok:false, msg:'실제 양성 비율을 1 % 로 낮추세요 (지금 '+r[0]+').'};
     if(rec!==0) return {ok:false, msg:'「모두 「음성」이라고만 답하기」 를 켜 주세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-pr)>0.5) return {ok:false, msg:'양성 비율은 '+r[0]+' 입니다.'};
     if(Math.abs(got[1]-acc)>0.2) return {ok:false, msg:'정확도는 '+r[2]+' 입니다.'};
     if(Math.abs(got[2])>0.2) return {ok:false, msg:'한 명도 찾지 못했으니 재현율은 0 입니다.'};
     mem.acc1=acc;
     return {ok:true, msg:'기록했습니다 — 정확도 '+r[2]+' 인데 환자는 한 명도 못 찾았습니다.'};
   }}""",
 """  {t:'생각 — 체크를 <b>꺼서 제대로 검사</b> 하고 다시 적으세요',
   f:'정확도 = {0} % · 재현율 = {1} % · 정확도가 ①보다 낮으면 1 아니면 0 → {2}',
   chk(got, r, mem){
     if(mem.acc1===undefined) return {ok:false, msg:'① 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const pr=noteNum(r[0]), acc=noteNum(r[2]), rec=noteNum(r[3]);
     if(!(pr<=5)) return {ok:false, msg:'양성 비율은 1 % 로 두세요 — 이번에는 체크만 끕니다.'};
     if(!(rec>0)) return {ok:false, msg:'아직 모두 「음성」 입니다 — 체크를 꺼 주세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-acc)>0.2) return {ok:false, msg:'정확도는 '+r[2]+' 입니다.'};
     if(Math.abs(got[1]-rec)>0.2) return {ok:false, msg:'재현율은 '+r[3]+' 입니다.'};
     if(Math.abs(got[2]-1)>0.1) return {ok:false, msg:'①의 '+mem.acc1+' 보다 낮아졌으니 1 입니다.'};
     if(!(acc<mem.acc1)) return {ok:false, msg:'정확도가 ①보다 낮아져야 합니다 — 화면을 다시 보세요.'};
     mem.acc2=acc; mem.rec2=rec; mem.ok2=true;
     return {ok:true, msg:'계산했습니다 — 정확도는 내려갔는데 환자는 '+r[3]+' 를 찾아냈습니다.'};
   }}""",
 """  {t:'판단 — 무엇을 함께 보아야 하는지 고르세요',
   f:'①의 정확도 = {0} % · ①의 재현율 = {1} % · ②의 재현율 = {2} %',
   opts:['드문 것을 찾는 문제에서 <b>정확도는 「아무것도 안 하기」에 상을 준다</b> — 실제로 찾아낸 비율인 재현율과, 찾았다고 한 것 중 맞은 비율인 정밀도를 함께 보고해야 한다',
         '정확도가 높으면 좋은 검사이므로 하나만 보아도 된다',
         '재현율이 올라가면 정확도도 반드시 함께 올라간다'],
   chk(got, r, mem, pick){
     if(!mem.ok2) return {ok:false, msg:'② 칸을 먼저 통과하세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-mem.acc1)>0.2) return {ok:false, msg:'①에 적은 '+mem.acc1+' 입니다.'};
     if(Math.abs(got[1])>0.2) return {ok:false, msg:'①에서는 한 명도 못 찾았으니 0 입니다.'};
     if(Math.abs(got[2]-mem.rec2)>0.2) return {ok:false, msg:'②에 적은 '+mem.rec2+' 입니다.'};
     if(pick!==0)
       return {ok:false, msg:'정확도가 더 높았던 쪽은 환자를 한 명도 못 찾은 ① 이었습니다. 하나만 보아도 될까요? 다시 고르세요.'};
     return {ok:true, msg:'판단했습니다 — <b>정확도 하나로는 속습니다.</b> 네 칸으로 갈라 재현율과 정밀도를 함께 보아야 합니다.'};
   }}"""
 )
)
