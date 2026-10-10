# -*- coding: utf-8 -*-
"""LAB 341~350 탐구 노트 — 기록 → 생각 → 판단.

관문은 글자가 아니라 «화면이 내놓는 수» 로만 세운다 (2026-10-10 LAB 331·336 교훈).
"""


def note(no, head, c1, c2, c3):
    return "\n %d:{ h:'%s',\n  c:[\n%s,\n%s,\n%s\n ]},\n" % (no, head, c1, c2, c3)


NOTES = (
 note(341, '내가 맞추고 · 내가 지나치고 · 내가 판단한다',
 """  {t:'기록 — <b>차수를 5</b> 로 두고 두 오차를 적으세요',
   f:'차수 = {0} · 훈련 오차 = {1} · 검증 오차 = {2}',
   chk(got, r, mem){
     if(!r) return {ok:false, msg:'아직 화면 값이 없습니다.'};
     const d=noteNum(r[0]), e=noteNum(r[1]), v=noteNum(r[2]);
     if(d!==5) return {ok:false, msg:'차수를 5 로 맞추세요 (지금 '+r[0]+').'};
     if(!isFinite(v)) return {ok:false, msg:'검증 오차가 보이지 않습니다 — 「훈련 자료만 보고 고르기」 를 꺼 두세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-5)>0.1) return {ok:false, msg:'차수는 5 입니다.'};
     if(Math.abs(got[1]-e)>0.001) return {ok:false, msg:'훈련 오차는 '+r[1]+' 입니다.'};
     if(Math.abs(got[2]-v)>0.001) return {ok:false, msg:'검증 오차는 '+r[2]+' 입니다.'};
     mem.e1=e; mem.v1=v;
     return {ok:true, msg:'기록했습니다 — 여기가 검증 오차가 가장 낮은 자리입니다.'};
   }}""",
 """  {t:'생각 — <b>차수를 9</b> 로 올려 다시 적으세요',
   f:'차수 = {0} · 훈련 오차 = {1} · 검증 오차 = {2}',
   chk(got, r, mem){
     if(mem.v1===undefined) return {ok:false, msg:'① 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const d=noteNum(r[0]), e=noteNum(r[1]), v=noteNum(r[2]);
     if(d!==9) return {ok:false, msg:'차수를 9 로 올리세요 (지금 '+r[0]+').'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-9)>0.1) return {ok:false, msg:'차수는 9 입니다.'};
     if(Math.abs(got[1]-e)>0.001) return {ok:false, msg:'훈련 오차는 '+r[1]+' 입니다.'};
     if(Math.abs(got[2]-v)>0.001) return {ok:false, msg:'검증 오차는 '+r[2]+' 입니다.'};
     if(!(v>mem.v1)) return {ok:false, msg:'검증 오차가 ①보다 커져야 합니다 — 「훈련 자료만 보고 고르기」 를 꺼 두세요.'};
     mem.e2=e; mem.v2=v; mem.ok2=true;
     return {ok:true, msg:'계산했습니다 — 훈련 오차는 '+r[1]+' 까지 줄었는데 검증 오차는 되레 커졌습니다.'};
   }}""",
 """  {t:'판단 — 두 오차를 나란히 두고 고르세요',
   f:'①의 검증 오차 = {0} · ②의 검증 오차 = {1} · 훈련 자료 10 개를 모두 지나는 최소 차수 = {2}',
   opts:['훈련 오차가 0 이 된 것은 <b>점을 외울 자유도가 생겼기 때문</b> 이다 — 배운 자료에서의 점수는 실력이 아니라 기억력을 재므로, 한 번도 보지 않은 자료로 채점해야 한다',
         '훈련 오차가 작을수록 더 좋은 모형이다',
         '차수를 올릴수록 새 자료에서도 더 잘 맞는다'],
   chk(got, r, mem, pick){
     if(!mem.ok2) return {ok:false, msg:'② 칸을 먼저 통과하세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-mem.v1)>0.001) return {ok:false, msg:'①에 적은 '+mem.v1+' 입니다.'};
     if(Math.abs(got[1]-mem.v2)>0.001) return {ok:false, msg:'②에 적은 '+mem.v2+' 입니다.'};
     if(Math.abs(got[2]-9)>0.1) return {ok:false, msg:'두 점이면 1 차, 세 점이면 2 차였습니다.'};
     if(pick!==0)
       return {ok:false, msg:'9 차의 훈련 오차는 '+mem.e2+' 인데 검증 오차는 ①보다 컸습니다. 훈련 오차가 작을수록 좋을까요? 다시 고르세요.'};
     return {ok:true, msg:'판단했습니다 — <b>배운 자료에서의 점수는 기억력입니다.</b> 그래서 자료를 훈련과 검증으로 나누어, 한 번도 보지 않은 쪽으로 채점합니다.'};
   }}"""
 )
 + note(342, '내가 남기고 · 내가 고르고 · 내가 판단한다',
 """  {t:'기록 — <b>최대 풀링</b> 에서 <b>잡음 밝기를 1.0</b> 으로 올려 적으세요',
   f:'잡음 밝기 = {0} · 그 칸의 결과값 = {1} · 경계의 뚜렷함 = {2}',
   chk(got, r, mem){
     if(!r) return {ok:false, msg:'아직 화면 값이 없습니다.'};
     const nz=noteNum(r[1]), v=noteNum(r[2]), e=noteNum(r[3]);
     if(!(v>=0.9)) return {ok:false, msg:'최대 풀링으로 두고 잡음 밝기를 1.0 으로 올리세요 (지금 그 칸의 값 '+r[2]+').'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-nz)>0.01) return {ok:false, msg:'잡음 밝기는 '+r[1]+' 입니다.'};
     if(Math.abs(got[1]-v)>0.002) return {ok:false, msg:'그 칸의 값은 '+r[2]+' 입니다.'};
     if(Math.abs(got[2]-e)>0.002) return {ok:false, msg:'경계의 뚜렷함은 '+r[3]+' 입니다.'};
     mem.v1=v; mem.e1=e;
     return {ok:true, msg:'기록했습니다 — 잡음 한 점이 네 칸을 통째로 대표했습니다.'};
   }}""",
 """  {t:'생각 — <b>평균 풀링</b> 으로 바꿔 다시 적으세요 (잡음은 그대로)',
   f:'그 칸의 결과값 = {0} · 경계의 뚜렷함 = {1} · ①보다 잡음이 눌렸으면 1 아니면 0 → {2}',
   chk(got, r, mem){
     if(mem.v1===undefined) return {ok:false, msg:'① 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const nz=noteNum(r[1]), v=noteNum(r[2]), e=noteNum(r[3]);
     if(!(nz>=0.9)) return {ok:false, msg:'잡음 밝기는 1.0 으로 두세요 — 이번에는 방식만 바꿉니다.'};
     if(!(v<mem.v1)) return {ok:false, msg:'아직 최대 풀링입니다 — 평균 풀링으로 바꾸세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-v)>0.002) return {ok:false, msg:'그 칸의 값은 '+r[2]+' 입니다.'};
     if(Math.abs(got[1]-e)>0.002) return {ok:false, msg:'경계의 뚜렷함은 '+r[3]+' 입니다.'};
     if(Math.abs(got[2]-1)>0.1) return {ok:false, msg:'①의 '+mem.v1+' 에서 '+r[2]+' 로 눌렸으니 1 입니다.'};
     if(!(e<mem.e1)) return {ok:false, msg:'경계도 함께 흐려졌는지 화면을 다시 보세요.'};
     mem.v2=v; mem.e2=e; mem.ok2=true;
     return {ok:true, msg:'계산했습니다 — 잡음은 눌렸는데 경계도 '+mem.e1+' 에서 '+r[3]+' 로 흐려졌습니다.'};
   }}""",
 """  {t:'판단 — 두 방식을 나란히 두고 고르세요',
   f:'①(최대)의 그 칸 값 = {0} · ②(평균)의 그 칸 값 = {1} · 네 칸이 1.00·0.40·0.15·0.15 일 때의 평균 = {2}',
   opts:['<b>얻는 것과 잃는 것이 함께 온다</b> — 평균은 잡음을 눌러 주지만 경계도 함께 흐리고, 최대는 경계를 살리지만 잡음 한 점도 그대로 남긴다',
         '평균 풀링이 언제나 더 좋은 방식이다',
         '풀링은 칸 수만 줄일 뿐 남는 값은 달라지지 않는다'],
   chk(got, r, mem, pick){
     if(!mem.ok2) return {ok:false, msg:'② 칸을 먼저 통과하세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-mem.v1)>0.002) return {ok:false, msg:'①에 적은 '+mem.v1+' 입니다.'};
     if(Math.abs(got[1]-mem.v2)>0.002) return {ok:false, msg:'②에 적은 '+mem.v2+' 입니다.'};
     if(Math.abs(got[2]-0.425)>0.005) return {ok:false, msg:'네 값을 더해 4 로 나누세요.'};
     if(pick!==0)
       return {ok:false, msg:'평균으로 바꾸자 잡음은 눌렸지만 경계도 '+mem.e1+' 에서 '+mem.e2+' 로 흐려졌습니다. 언제나 더 좋을까요? 다시 고르세요.'};
     return {ok:true, msg:'판단했습니다 — <b>무엇을 남길지 고르는 일</b> 입니다. 잡음이 걱정이면 평균, 경계가 중요하면 최대 — 공짜로 둘 다 얻을 수는 없습니다.'};
   }}"""
 )
 + note(343, '내가 눌러 보고 · 내가 가파르게 하고 · 내가 판단한다',
 """  {t:'기록 — <b>w = 1 · b = 0 · x = 0</b> 으로 두고 확률을 적으세요',
   f:'w = {0} · b = {1} · x = 0 에서의 확률 = {2}',
   chk(got, r, mem){
     if(!r) return {ok:false, msg:'아직 화면 값이 없습니다.'};
     const w=noteNum(r[0]), b=noteNum(r[1]), x=noteNum(r[2]), p=noteNum(r[3]);
     if(Math.abs(x)>0.01) return {ok:false, msg:'확인할 x 를 0 으로 맞추세요 (지금 '+r[2]+').'};
     if(Math.abs(b)>0.01) return {ok:false, msg:'b 를 0 으로 맞추세요 (지금 '+r[1]+').'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-w)>0.05) return {ok:false, msg:'w 는 '+r[0]+' 입니다.'};
     if(Math.abs(got[1])>0.05) return {ok:false, msg:'b 는 0 입니다.'};
     if(Math.abs(got[2]-p)>0.0005) return {ok:false, msg:'화면의 확률이 '+r[3]+' 입니다.'};
     mem.p1=p;
     return {ok:true, msg:'기록했습니다 — z = 0 이면 확률이 꼭 0.5 입니다.'};
   }}""",
 """  {t:'생각 — <b>w 를 6 이상</b> 으로 올리고 <b>x = 0.5</b> 에서의 확률을 적으세요',
   f:'w = {0} · x = {1} · 확률 = {2}',
   chk(got, r, mem){
     if(mem.p1===undefined) return {ok:false, msg:'① 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const w=noteNum(r[0]), x=noteNum(r[2]), p=noteNum(r[3]);
     if(!(w>=5)) return {ok:false, msg:'w 가 '+r[0]+' 입니다 — 6 이상으로 올리세요.'};
     if(Math.abs(x-0.5)>0.01) return {ok:false, msg:'확인할 x 를 0.5 로 맞추세요 (지금 '+r[2]+').'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-w)>0.05) return {ok:false, msg:'w 는 '+r[0]+' 입니다.'};
     if(Math.abs(got[1]-0.5)>0.05) return {ok:false, msg:'x 는 0.5 입니다.'};
     if(Math.abs(got[2]-p)>0.0005) return {ok:false, msg:'화면의 확률이 '+r[3]+' 입니다.'};
     mem.p2=p; mem.ok2=true;
     return {ok:true, msg:'계산했습니다 — 경계에서 0.5 만큼만 떨어졌는데 확률이 '+r[3]+' 까지 올랐습니다.'};
   }}""",
 """  {t:'판단 — 경계의 자리를 고르세요',
   f:'①의 확률 = {0} · ②의 확률 = {1} · w = 2 · b = −4 일 때의 판정 경계 x = {2}',
   opts:['판정 경계는 <b>z = 0 이 되는 자리</b>, 곧 x = −b / w 다 — b 는 경계를 옮기고 w 는 경계 둘레에서 확률이 뒤집히는 가파름을 정한다',
         'w 를 키우면 판정 경계도 함께 옮겨 간다',
         '판정 경계는 늘 x = 0 이다'],
   chk(got, r, mem, pick){
     if(!mem.ok2) return {ok:false, msg:'② 칸을 먼저 통과하세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-mem.p1)>0.0005) return {ok:false, msg:'①에 적은 '+mem.p1+' 입니다.'};
     if(Math.abs(got[1]-mem.p2)>0.0005) return {ok:false, msg:'②에 적은 '+mem.p2+' 입니다.'};
     if(Math.abs(got[2]-2)>0.05) return {ok:false, msg:'z = 2x − 4 = 0 을 푸세요.'};
     if(pick!==0)
       return {ok:false, msg:'②에서 w 만 키웠는데 경계는 그대로 x = 0 이었습니다. w 가 경계를 옮겼을까요? 다시 고르세요.'};
     return {ok:true, msg:'판단했습니다 — <b>경계는 −b/w, 가파름은 w.</b> 둘이 하는 일이 다릅니다.'};
   }}"""
 )
 + note(344, '내가 한 걸음 · 내가 또 한 걸음 · 내가 판단한다',
 """  {t:'기록 — <b>한 단계 진행</b> 을 한 번 누르고 적으세요',
   f:'k = {0} · 단계 = {1} · 중심이 움직인 거리 = {2}',
   chk(got, r, mem){
     if(!r) return {ok:false, msg:'아직 화면 값이 없습니다.'};
     const k=noteNum(r[0]), it=noteNum(r[1]), mv=noteNum(r[2]);
     if(it!==1) return {ok:false, msg:'「한 단계 진행」 을 한 번만 눌러 주세요 (지금 '+r[1]+' 단계).'};
     if(!(mv>0)) return {ok:false, msg:'중심이 움직인 거리가 0 입니다 — 「처음으로」 를 누르고 다시 한 번 진행하세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-k)>0.1) return {ok:false, msg:'k 는 '+r[0]+' 입니다.'};
     if(Math.abs(got[1]-1)>0.1) return {ok:false, msg:'단계는 1 입니다.'};
     if(Math.abs(got[2]-mv)>0.001) return {ok:false, msg:'움직인 거리는 '+r[2]+' 입니다.'};
     mem.mv1=mv;
     return {ok:true, msg:'기록했습니다 — 중심이 '+r[2]+' 만큼 옮겨 갔습니다.'};
   }}""",
 """  {t:'생각 — <b>한 번 더</b> 눌러 다시 적으세요',
   f:'단계 = {0} · 중심이 움직인 거리 = {1} · 더 움직였으면 1 멈췄으면 0 → {2}',
   chk(got, r, mem){
     if(mem.mv1===undefined) return {ok:false, msg:'① 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const it=noteNum(r[1]), mv=noteNum(r[2]);
     if(!(it>=2)) return {ok:false, msg:'「한 단계 진행」 을 한 번 더 누르세요 (지금 '+r[1]+' 단계).'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-it)>0.1) return {ok:false, msg:'단계는 '+r[1]+' 입니다.'};
     if(Math.abs(got[1]-mv)>0.001) return {ok:false, msg:'움직인 거리는 '+r[2]+' 입니다.'};
     if(Math.abs(got[2]-(mv>0.001?1:0))>0.1) return {ok:false, msg:'움직인 거리가 '+r[2]+' 이니 '+(mv>0.001?1:0)+' 입니다.'};
     mem.mv2=mv; mem.ok2=true;
     return {ok:true, msg:'계산했습니다 — 중심이 제자리에 섰습니다.'};
   }}""",
 """  {t:'판단 — 언제 멈추는지 고르세요',
   f:'①에서 움직인 거리 = {0} · ②에서 움직인 거리 = {1} · 멈추는 때의 움직인 거리 = {2}',
   opts:['<b>중심이 움직이지 않으면</b> 붙이기 결과도 바뀌지 않으므로 더 되풀이해도 같은 자리다 — 두 걸음 모두 거리 제곱합을 늘리지 않으니 이 셈은 반드시 멈춘다',
         '단계를 충분히 많이 되풀이하면 언제나 가장 좋은 답에 닿는다',
         '거리 제곱합은 단계마다 커졌다 작아졌다 한다'],
   chk(got, r, mem, pick){
     if(!mem.ok2) return {ok:false, msg:'② 칸을 먼저 통과하세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-mem.mv1)>0.001) return {ok:false, msg:'①에 적은 '+mem.mv1+' 입니다.'};
     if(Math.abs(got[1]-mem.mv2)>0.001) return {ok:false, msg:'②에 적은 '+mem.mv2+' 입니다.'};
     if(Math.abs(got[2])>0.001) return {ok:false, msg:'더 움직일 곳이 없으면 몇일까요?'};
     if(pick!==0)
       return {ok:false, msg:'시작 중심을 모두 한쪽 구석에 두었는데도 멈췄습니다. 멈춘 자리가 늘 가장 좋은 자리일까요? 다시 고르세요.'};
     return {ok:true, msg:'판단했습니다 — <b>반드시 멈추지만, 멈춘 자리가 가장 좋다는 보장은 없습니다.</b> 시작 중심을 달리 잡아 여러 번 돌려 보는 까닭입니다.'};
   }}"""
 )
 + note(345, '내가 기준을 두고 · 내가 낮추고 · 내가 판단한다',
 """  {t:'기록 — <b>기준값 0.5</b> 에서 두 비율을 적으세요',
   f:'기준값 = {0} · 잡아낸 비율 = {1} % · 헛경보 비율 = {2} %',
   chk(got, r, mem){
     if(!r) return {ok:false, msg:'아직 화면 값이 없습니다.'};
     const t=noteNum(r[0]), tp=noteNum(r[1]), fp=noteNum(r[2]);
     if(Math.abs(t-0.5)>0.01) return {ok:false, msg:'기준값을 0.50 으로 맞추세요 (지금 '+r[0]+').'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-0.5)>0.01) return {ok:false, msg:'기준값은 0.5 입니다.'};
     if(Math.abs(got[1]-tp)>0.2) return {ok:false, msg:'잡아낸 비율은 '+r[1]+' 입니다.'};
     if(Math.abs(got[2]-fp)>0.2) return {ok:false, msg:'헛경보 비율은 '+r[2]+' 입니다.'};
     mem.tp1=tp; mem.fp1=fp;
     return {ok:true, msg:'기록했습니다 — 가운데 기준에서의 한 점입니다.'};
   }}""",
 """  {t:'생각 — <b>기준값을 0.2 이하</b> 로 낮추고 다시 적으세요',
   f:'기준값 = {0} · 잡아낸 비율 = {1} % · 헛경보 비율 = {2} %',
   chk(got, r, mem){
     if(mem.tp1===undefined) return {ok:false, msg:'① 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const t=noteNum(r[0]), tp=noteNum(r[1]), fp=noteNum(r[2]);
     if(!(t<=0.2)) return {ok:false, msg:'기준값이 '+r[0]+' 입니다 — 0.2 이하로 낮추세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-t)>0.01) return {ok:false, msg:'기준값은 '+r[0]+' 입니다.'};
     if(Math.abs(got[1]-tp)>0.2) return {ok:false, msg:'잡아낸 비율은 '+r[1]+' 입니다.'};
     if(Math.abs(got[2]-fp)>0.2) return {ok:false, msg:'헛경보 비율은 '+r[2]+' 입니다.'};
     if(!(tp>=mem.tp1 && fp>=mem.fp1)) return {ok:false, msg:'기준을 낮추면 두 비율이 함께 커져야 합니다 — 떨어진 정도는 그대로 두세요.'};
     mem.tp2=tp; mem.fp2=fp; mem.ok2=true;
     return {ok:true, msg:'계산했습니다 — 잡아냄이 '+mem.tp1+' 에서 '+r[1]+' 로 올랐는데 헛경보도 '+mem.fp1+' 에서 '+r[2]+' 로 올랐습니다.'};
   }}""",
 """  {t:'판단 — 기준값을 <b>0.6</b> 으로 올리고 고르세요',
   f:'①의 헛경보 = {0} % · ②의 헛경보 = {1} % · 지금 화면(기준값 0.6)의 잡아낸 비율 = {2} %',
   opts:['기준값을 옮기는 일은 <b>곡선 위를 미끄러지는 일</b> 이다 — 놓침과 헛경보를 동시에 줄일 수는 없고, 곡선 자체를 올리려면 두 무리를 더 잘 가르는 특징을 찾아야 한다',
         '기준값을 잘 고르면 놓침과 헛경보를 동시에 0 으로 만들 수 있다',
         '기준값을 옮기면 AUC 도 함께 올라간다'],
   chk(got, r, mem, pick){
     if(!mem.ok2) return {ok:false, msg:'② 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const t=noteNum(r[0]), tp=noteNum(r[1]);
     if(Math.abs(t-0.6)>0.01) return {ok:false, msg:'기준값을 0.60 으로 올리고 다시 누르세요 (지금 '+r[0]+').'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-mem.fp1)>0.2) return {ok:false, msg:'①에 적은 '+mem.fp1+' 입니다.'};
     if(Math.abs(got[1]-mem.fp2)>0.2) return {ok:false, msg:'②에 적은 '+mem.fp2+' 입니다.'};
     if(Math.abs(got[2]-tp)>0.2) return {ok:false, msg:'화면의 잡아낸 비율이 '+r[1]+' 입니다.'};
     if(pick!==0)
       return {ok:false, msg:'기준을 낮추니 헛경보가 '+mem.fp1+' 에서 '+mem.fp2+' 로 늘었고, 올리니 잡아냄이 줄었습니다. 동시에 0 이 될까요? 다시 고르세요.'};
     return {ok:true, msg:'판단했습니다 — <b>기준값은 곡선 위의 한 점을 고르는 일</b> 이고, 곡선 전체의 힘은 AUC 가 말해 줍니다.'};
   }}"""
 )
 + note(346, '내가 꺾어 가고 · 내가 곧게 가고 · 내가 판단한다',
 """  {t:'기록 — <b>가로 3 칸 · 세로 4 칸</b> 으로 두고 두 거리를 적으세요',
   f:'가로 = {0} 칸 · 유클리드 거리 = {1} · 맨해튼 거리 = {2}',
   chk(got, r, mem){
     if(!r) return {ok:false, msg:'아직 화면 값이 없습니다.'};
     const dx=noteNum(r[0]), dy=noteNum(r[1]), eu=noteNum(r[2]), mh=noteNum(r[3]);
     if(dx!==3 || dy!==4) return {ok:false, msg:'가로 3 칸 · 세로 4 칸으로 맞추세요 (지금 '+r[0]+' , '+r[1]+').'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-3)>0.1) return {ok:false, msg:'가로는 3 칸입니다.'};
     if(Math.abs(got[1]-eu)>0.002) return {ok:false, msg:'유클리드 거리는 '+r[2]+' 입니다.'};
     if(Math.abs(got[2]-mh)>0.1) return {ok:false, msg:'맨해튼 거리는 '+r[3]+' 입니다.'};
     mem.d1=mh-eu;
     return {ok:true, msg:'기록했습니다 — 꺾어 가면 '+(mh-eu).toFixed(2)+' 만큼 더 걷습니다.'};
   }}""",
 """  {t:'생각 — <b>세로를 0 칸</b> 으로 두고 다시 적으세요',
   f:'세로 = {0} 칸 · 유클리드 거리 = {1} · 두 거리가 같으면 1 다르면 0 → {2}',
   chk(got, r, mem){
     if(mem.d1===undefined) return {ok:false, msg:'① 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const dy=noteNum(r[1]), eu=noteNum(r[2]), mh=noteNum(r[3]);
     if(dy!==0) return {ok:false, msg:'세로를 0 칸으로 맞추세요 (지금 '+r[1]+').'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0])>0.1) return {ok:false, msg:'세로는 0 칸입니다.'};
     if(Math.abs(got[1]-eu)>0.002) return {ok:false, msg:'유클리드 거리는 '+r[2]+' 입니다.'};
     if(Math.abs(got[2]-1)>0.1) return {ok:false, msg:'두 거리가 '+r[2]+' 와 '+r[3]+' 로 같으니 1 입니다.'};
     mem.d2=mh-eu; mem.ok2=true;
     return {ok:true, msg:'계산했습니다 — 한 줄만 가면 꺾을 일이 없어 두 거리가 같습니다.'};
   }}""",
 """  {t:'판단 — 두 거리의 관계를 고르세요',
   f:'①의 두 거리 차 = {0} · ②의 두 거리 차 = {1} · 가로 3 칸 · 세로 4 칸의 맨해튼 거리 = {2}',
   opts:['맨해튼 거리는 <b>유클리드 거리보다 작아질 수 없다</b> — 직각삼각형에서 빗변이 두 변의 합보다 짧기 때문이고, 두 거리가 같아지는 것은 한쪽이 0 일 때뿐이다',
         '두 거리는 어느 쪽이 클지 경우에 따라 바뀐다',
         '격자에서는 맨해튼 거리가 늘 유클리드 거리보다 짧다'],
   chk(got, r, mem, pick){
     if(!mem.ok2) return {ok:false, msg:'② 칸을 먼저 통과하세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-mem.d1)>0.002) return {ok:false, msg:'①의 차는 '+mem.d1.toFixed(4)+' 입니다.'};
     if(Math.abs(got[1]-mem.d2)>0.002) return {ok:false, msg:'②의 차는 0 이었습니다.'};
     if(Math.abs(got[2]-7)>0.1) return {ok:false, msg:'3 + 4 를 계산하세요.'};
     if(pick!==0)
       return {ok:false, msg:'①에서는 차가 '+mem.d1.toFixed(2)+' 이었고 ②에서는 0 이었습니다. 맨해튼 쪽이 짧아진 적이 있었나요? 다시 고르세요.'};
     return {ok:true, msg:'판단했습니다 — <b>빗변은 두 변의 합보다 짧습니다.</b> 이것이 삼각부등식이고, 등호는 한쪽이 0 일 때뿐입니다.'};
   }}"""
 )
 + note(347, '내가 떼어 놓고 · 내가 붙이고 · 내가 판단한다',
 """  {t:'기록 — <b>a = 2 · b = 8</b> 로 두고 두 평균을 적으세요',
   f:'a = {0} · 산술평균 = {1} · 기하평균 = {2}',
   chk(got, r, mem){
     if(!r) return {ok:false, msg:'아직 화면 값이 없습니다.'};
     const a=noteNum(r[0]), b=noteNum(r[1]), am=noteNum(r[2]), gm=noteNum(r[3]);
     if(Math.abs(a-2)>0.01 || Math.abs(b-8)>0.01) return {ok:false, msg:'a 를 2, b 를 8 로 맞추세요 (지금 '+r[0]+' , '+r[1]+').'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-2)>0.05) return {ok:false, msg:'a 는 2 입니다.'};
     if(Math.abs(got[1]-am)>0.002) return {ok:false, msg:'산술평균은 '+r[2]+' 입니다.'};
     if(Math.abs(got[2]-gm)>0.002) return {ok:false, msg:'기하평균은 '+r[3]+' 입니다.'};
     mem.g1=am-gm;
     return {ok:true, msg:'기록했습니다 — 산술평균이 기하평균보다 '+(am-gm).toFixed(2)+' 만큼 큽니다.'};
   }}""",
 """  {t:'생각 — <b>a 와 b 를 같게</b> (둘 다 4) 두고 다시 적으세요',
   f:'a = {0} · 산술평균 = {1} · 기하평균 = {2}',
   chk(got, r, mem){
     if(mem.g1===undefined) return {ok:false, msg:'① 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const a=noteNum(r[0]), b=noteNum(r[1]), am=noteNum(r[2]), gm=noteNum(r[3]);
     if(Math.abs(a-b)>0.01) return {ok:false, msg:'a 와 b 를 같게 두세요 (지금 '+r[0]+' , '+r[1]+').'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-a)>0.05) return {ok:false, msg:'a 는 '+r[0]+' 입니다.'};
     if(Math.abs(got[1]-am)>0.002) return {ok:false, msg:'산술평균은 '+r[2]+' 입니다.'};
     if(Math.abs(got[2]-gm)>0.002) return {ok:false, msg:'기하평균은 '+r[3]+' 입니다.'};
     mem.g2=am-gm; mem.ok2=true;
     return {ok:true, msg:'계산했습니다 — 두 평균이 꼭 같아졌습니다.'};
   }}""",
 """  {t:'판단 — 두 평균의 관계를 고르세요',
   f:'①의 두 평균 차 = {0} · ②의 두 평균 차 = {1} · a = 2 · b = 8 의 산술평균 − 기하평균 = {2}',
   opts:['언제나 <b>산술평균 ≥ 기하평균</b> 이고 등호는 a = b 일 때만 성립한다 — (√a − √b)² ≥ 0 을 펼치면 a + b ≥ 2√(ab) 가 되기 때문이다',
         '두 평균 중 어느 쪽이 큰지는 a, b 에 따라 바뀐다',
         'a 와 b 가 멀어질수록 두 평균이 가까워진다'],
   chk(got, r, mem, pick){
     if(!mem.ok2) return {ok:false, msg:'② 칸을 먼저 통과하세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-mem.g1)>0.002) return {ok:false, msg:'①의 차는 '+mem.g1.toFixed(4)+' 입니다.'};
     if(Math.abs(got[1]-mem.g2)>0.002) return {ok:false, msg:'②의 차는 0 이었습니다.'};
     if(Math.abs(got[2]-1)>0.02) return {ok:false, msg:'5 와 4 의 차를 구하세요.'};
     if(pick!==0)
       return {ok:false, msg:'떼어 놓으니 차가 '+mem.g1.toFixed(2)+' 이었고 붙이니 0 이 되었습니다. 어느 쪽이 큰지 바뀐 적이 있었나요? 다시 고르세요.'};
     return {ok:true, msg:'판단했습니다 — <b>(√a − √b)² ≥ 0</b> 하나로 끝납니다. 두 해 동안 2 배와 8 배였다면 평균은 4 배씩입니다.'};
   }}"""
 )
 + note(348, '내가 제대로 더하고 · 내가 잘못 더하고 · 내가 판단한다',
 """  {t:'기록 — <b>α = 30° · β = 45°</b> 에서 올바른 값을 적으세요',
   f:'α = {0}° · β = {1}° · sin(α + β) = {2}',
   chk(got, r, mem){
     if(!r) return {ok:false, msg:'아직 화면 값이 없습니다.'};
     const a=noteNum(r[0]), b=noteNum(r[1]), s1=noteNum(r[2]);
     if(a!==30 || b!==45) return {ok:false, msg:'α 를 30°, β 를 45° 로 맞추세요 (지금 '+r[0]+' , '+r[1]+').'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-30)>0.5) return {ok:false, msg:'α 는 30 입니다.'};
     if(Math.abs(got[1]-45)>0.5) return {ok:false, msg:'β 는 45 입니다.'};
     if(Math.abs(got[2]-s1)>0.002) return {ok:false, msg:'화면의 sin(α + β) 가 '+r[2]+' 입니다.'};
     mem.s1=s1;
     return {ok:true, msg:'기록했습니다 — sin 75° 는 1 보다 작습니다.'};
   }}""",
 """  {t:'생각 — 화면에서 <b>잘못 더한 값</b> 을 읽어 두 값을 견주세요',
   f:'sin α + sin β = {0} · ①의 값 = {1} · 잘못 더한 값이 1 을 넘으면 1 아니면 0 → {2}',
   chk(got, r, mem){
     if(mem.s1===undefined) return {ok:false, msg:'① 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const a=noteNum(r[0]), b=noteNum(r[1]), s2=noteNum(r[3]);
     if(a!==30 || b!==45) return {ok:false, msg:'각은 30° 와 45° 로 두세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-s2)>0.002) return {ok:false, msg:'화면의 sinα + sinβ 가 '+r[3]+' 입니다.'};
     if(Math.abs(got[1]-mem.s1)>0.002) return {ok:false, msg:'①에 적은 '+mem.s1+' 입니다.'};
     if(Math.abs(got[2]-(s2>1?1:0))>0.1) return {ok:false, msg:'잘못 더한 값이 '+r[3]+' 이니 '+(s2>1?1:0)+' 입니다.'};
     mem.s2=s2; mem.ok2=true;
     return {ok:true, msg:'계산했습니다 — 1 을 넘었으니 sin 값일 수 없습니다.'};
   }}""",
 """  {t:'판단 — 무엇을 더해야 하는지 고르세요',
   f:'①의 sin(α + β) = {0} · ②의 sinα + sinβ = {1} · 두 값의 차 = {2}',
   opts:['sin(α + β) = <b>sin α cos β + cos α sin β</b> 다 — 그냥 더한 값은 1 을 넘어 sin 값이 될 수조차 없으니, 이 하나만으로도 틀린 셈임을 알 수 있다',
         'sin(α + β) 와 sin α + sin β 는 각이 작을 때는 정확히 같다',
         'sin 값도 1 보다 클 수 있다'],
   chk(got, r, mem, pick){
     if(!mem.ok2) return {ok:false, msg:'② 칸을 먼저 통과하세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-mem.s1)>0.002) return {ok:false, msg:'①에 적은 '+mem.s1+' 입니다.'};
     if(Math.abs(got[1]-mem.s2)>0.002) return {ok:false, msg:'②에 적은 '+mem.s2+' 입니다.'};
     if(Math.abs(got[2]-(mem.s2-mem.s1))>0.003) return {ok:false, msg:'②에서 ①을 빼 보세요.'};
     if(pick!==0)
       return {ok:false, msg:'잘못 더한 값이 '+mem.s2+' 로 1 을 넘었습니다. sin 값이 1 을 넘을 수 있을까요? 다시 고르세요.'};
     return {ok:true, msg:'판단했습니다 — <b>sin α cos β + cos α sin β</b> 입니다. α = β 로 두면 그대로 sin 2α = 2 sin α cos α 가 됩니다.'};
   }}"""
 )
 + note(349, '내가 나누고 · 내가 또 나누고 · 내가 판단한다',
 """  {t:'기록 — <b>가로 48 · 세로 18</b> 로 두고 적으세요',
   f:'a = {0} · 최대공약수 = {1} · 나눗셈 횟수 = {2}',
   chk(got, r, mem){
     if(!r) return {ok:false, msg:'아직 화면 값이 없습니다.'};
     const a=noteNum(r[0]), b=noteNum(r[1]), g=noteNum(r[2]), n=noteNum(r[3]);
     if(a!==48 || b!==18) return {ok:false, msg:'가로 48 · 세로 18 로 맞추세요 (지금 '+r[0]+' , '+r[1]+').'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-48)>0.5) return {ok:false, msg:'a 는 48 입니다.'};
     if(Math.abs(got[1]-g)>0.1) return {ok:false, msg:'최대공약수는 '+r[2]+' 입니다.'};
     if(Math.abs(got[2]-n)>0.1) return {ok:false, msg:'나눗셈 횟수는 '+r[3]+' 입니다.'};
     mem.g1=g; mem.n1=n;
     return {ok:true, msg:'기록했습니다 — 나눗셈 '+r[3]+' 번 만에 '+r[2]+' 에 닿았습니다.'};
   }}""",
 """  {t:'생각 — <b>세로를 35</b> 로 바꿔 다시 적으세요',
   f:'b = {0} · 최대공약수 = {1} · 나눗셈 횟수 = {2}',
   chk(got, r, mem){
     if(mem.g1===undefined) return {ok:false, msg:'① 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const b=noteNum(r[1]), g=noteNum(r[2]), n=noteNum(r[3]);
     if(b!==35) return {ok:false, msg:'세로를 35 로 맞추세요 (지금 '+r[1]+').'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-35)>0.5) return {ok:false, msg:'b 는 35 입니다.'};
     if(Math.abs(got[1]-g)>0.1) return {ok:false, msg:'최대공약수는 '+r[2]+' 입니다.'};
     if(Math.abs(got[2]-n)>0.1) return {ok:false, msg:'나눗셈 횟수는 '+r[3]+' 입니다.'};
     mem.g2=g; mem.n2=n; mem.ok2=true;
     return {ok:true, msg:'계산했습니다 — 최대공약수가 1 이니 두 수가 서로소입니다.'};
   }}""",
 """  {t:'판단 — 이 셈이 멈추는 까닭을 고르세요',
   f:'①의 최대공약수 = {0} · ②의 최대공약수 = {1} · 48 과 18 의 최대공약수 = {2}',
   opts:['<b>나머지는 나누는 수보다 반드시 작다</b> — 그래서 나머지가 줄어들다 반드시 0 에 닿고, 그 직전의 나누는 수가 최대공약수다',
         '두 수를 소인수분해해 보아야만 최대공약수를 알 수 있다',
         '나눗셈을 되풀이하면 나머지가 커질 수도 있어 멈춘다는 보장이 없다'],
   chk(got, r, mem, pick){
     if(!mem.ok2) return {ok:false, msg:'② 칸을 먼저 통과하세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-mem.g1)>0.1) return {ok:false, msg:'①에 적은 '+mem.g1+' 입니다.'};
     if(Math.abs(got[1]-mem.g2)>0.1) return {ok:false, msg:'②에 적은 '+mem.g2+' 입니다.'};
     if(Math.abs(got[2]-6)>0.1) return {ok:false, msg:'48 = 18 × 2 + 12 부터 이어가 보세요.'};
     if(pick!==0)
       return {ok:false, msg:'소인수분해는 한 번도 하지 않았는데 '+mem.n1+' 번과 '+mem.n2+' 번 만에 답이 나왔습니다. 다시 고르세요.'};
     return {ok:true, msg:'판단했습니다 — <b>gcd(a, b) = gcd(b, a mod b)</b> 를 나머지가 0 이 될 때까지 되풀이할 뿐입니다. 소인수분해보다 훨씬 빠릅니다.'};
   }}"""
 )
 + note(350, '내가 겹치고 · 내가 어긋나고 · 내가 판단한다',
 """  {t:'기록 — <b>a = −2 · b = 3</b> 으로 두고 적으세요',
   f:'a = {0} · b = {1} · 구간의 길이 = {2}',
   chk(got, r, mem){
     if(!r) return {ok:false, msg:'아직 화면 값이 없습니다.'};
     const a=noteNum(r[0]), b=noteNum(r[1]), L=noteNum(r[3]);
     if(a!==-2 || b!==3) return {ok:false, msg:'a 를 −2, b 를 3 으로 맞추세요 (지금 '+r[0]+' , '+r[1]+').'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]+2)>0.1) return {ok:false, msg:'a 는 −2 입니다.'};
     if(Math.abs(got[1]-3)>0.1) return {ok:false, msg:'b 는 3 입니다.'};
     if(Math.abs(got[2]-L)>0.1) return {ok:false, msg:'구간의 길이는 '+r[3]+' 입니다.'};
     mem.L1=L;
     return {ok:true, msg:'기록했습니다 — 두 범위가 겹치는 곳이 해입니다.'};
   }}""",
 """  {t:'생각 — <b>a = 3 · b = −1</b> 로 어긋나게 두고 다시 적으세요',
   f:'a = {0} · b = {1} · 해가 있으면 1 없으면 0 → {2}',
   chk(got, r, mem){
     if(mem.L1===undefined) return {ok:false, msg:'① 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const a=noteNum(r[0]), b=noteNum(r[1]), L=noteNum(r[3]);
     if(!(a>b)) return {ok:false, msg:'a 를 b 보다 크게 두세요 (지금 '+r[0]+' , '+r[1]+').'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-a)>0.1) return {ok:false, msg:'a 는 '+r[0]+' 입니다.'};
     if(Math.abs(got[1]-b)>0.1) return {ok:false, msg:'b 는 '+r[1]+' 입니다.'};
     if(Math.abs(got[2])>0.1) return {ok:false, msg:'화면에 해가 '+r[2]+' 이라고 적혀 있습니다 — 0 입니다.'};
     mem.L2=L; mem.ok2=true;
     return {ok:true, msg:'계산했습니다 — 두 범위가 어긋나 겹치는 곳이 하나도 없습니다.'};
   }}""",
 """  {t:'판단 — 해가 있을 조건을 고르세요',
   f:'①의 구간 길이 = {0} · ②의 구간 길이 = {1} · x ≥ −2 와 x ≤ 3 의 구간 길이 = {2}',
   opts:['연립부등식의 해는 두 해집합의 <b>교집합</b> 이다 — 왼쪽 끝 a 가 오른쪽 끝 b 보다 크면 겹치는 곳이 없어 해가 없고, a = b 이면 점 하나만 남는다',
         '두 부등식의 해를 모두 합친 것이 연립부등식의 해다',
         '부등식이 둘 있으면 해는 언제나 있다'],
   chk(got, r, mem, pick){
     if(!mem.ok2) return {ok:false, msg:'② 칸을 먼저 통과하세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-mem.L1)>0.1) return {ok:false, msg:'①에 적은 '+mem.L1+' 입니다.'};
     if(Math.abs(got[1]-mem.L2)>0.1) return {ok:false, msg:'②의 길이는 0 이었습니다.'};
     if(Math.abs(got[2]-5)>0.1) return {ok:false, msg:'3 에서 −2 를 빼세요.'};
     if(pick!==0)
       return {ok:false, msg:'②에서는 두 부등식이 모두 멀쩡한데도 해가 없었습니다. 합친 것이 해라면 그럴 수 있을까요? 다시 고르세요.'};
     return {ok:true, msg:'판단했습니다 — <b>겹치는 곳만 해입니다.</b> a ≤ b 여야 해가 있고, a = b 이면 단 하나뿐입니다.'};
   }}"""
 )
)
