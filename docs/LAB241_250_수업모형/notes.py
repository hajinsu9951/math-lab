# -*- coding: utf-8 -*-
"""LAB 241~250 탐구 노트 — 기록 → 생각 → 판단. 판정은 화면의 read() 값으로만 한다."""


def note(no, head, c1, c2, c3):
    return "\n %d:{ h:'%s',\n  c:[\n%s,\n%s,\n%s\n ]},\n" % (no, head, c1, c2, c3)


NOTES = (
 note(241, '내가 세고 · 내가 나누고 · 내가 판단한다',
 """  {t:'기록 — <b>며칠 뒤를 7 의 배수가 아닌 값</b> 으로 두고 적으세요',
   f:'며칠 뒤 = {0} 일 · 7 로 나눈 나머지 = {1} · 7 × 몫 + 나머지 = {2}',
   chk(got, r, mem){
     if(!r) return {ok:false, msg:'아직 화면 값이 없습니다.'};
     const k=noteNum(r[2]), rem=noteNum(r[3]);
     if(!(k>0)) return {ok:false, msg:'며칠 뒤가 0 입니다 — 0 보다 크게 두세요.'};
     if(k%7===0) return {ok:false, msg:'며칠 뒤가 7 의 배수입니다 — ②에서 볼 테니 지금은 아닌 값으로 두세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-k)>0.5) return {ok:false, msg:'며칠 뒤는 '+r[2]+' 일입니다.'};
     if(Math.abs(got[1]-rem)>0.5) return {ok:false, msg:'나머지는 '+r[3]+' 입니다.'};
     if(Math.abs(got[2]-k)>0.5) return {ok:false, msg:'7 × 몫 에 나머지를 더하면 '+r[2]+' 가 나와야 합니다.'};
     mem.rem1=rem; mem.k1=k; mem.w1=String(r[4]);
     return {ok:true, msg:'기록했습니다 — 나머지 '+r[3]+' 만큼 밀려 '+r[4]+' 가 되었습니다. 7 의 배수로 바꿔 봅시다.'};
   }}""",
 """  {t:'생각 — <b>며칠 뒤를 7 의 배수</b> 로 바꾸고 요일을 견주세요',
   f:'며칠 뒤 = {0} 일 · 나머지 = {1} · 처음 요일과 같으면 1, 다르면 0 → {2}',
   chk(got, r, mem){
     if(mem.rem1===undefined) return {ok:false, msg:'① 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const k=noteNum(r[2]), rem=noteNum(r[3]);
     if(!(k>0&&k%7===0)) return {ok:false, msg:'며칠 뒤가 '+r[2]+' 입니다 — 7 · 14 · 28 처럼 7 의 배수로 두세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-k)>0.5) return {ok:false, msg:'며칠 뒤는 '+r[2]+' 일입니다.'};
     if(Math.abs(got[1])>0.5) return {ok:false, msg:'7 의 배수를 7 로 나눈 나머지는 0 입니다.'};
     if(Math.abs(got[2]-(String(r[1])===String(r[4])?1:0))>0.01)
       return {ok:false, msg:'처음 요일 '+r[1]+' 와 그날 요일 '+r[4]+' 를 견주세요.'};
     mem.ok2=true;
     return {ok:true, msg:'계산했습니다 — 나머지가 0 이라 요일이 제자리로 돌아왔습니다.'};
   }}""",
 """  {t:'판단 — 1년이 지나면 며칠 밀리는지 구하고 고르세요',
   f:'①의 나머지 = {0} · ②의 나머지 = {1} · 365 를 7 로 나눈 나머지 = {2}',
   opts:['요일은 일곱 개가 돌고 돌므로 <b>며칠 뒤를 7 로 나눈 나머지</b> 만큼만 밀린다 — 365 = 7 × 52 + 1 이라 평년에는 하루, 366 일인 윤년에는 이틀 밀린다',
         '요일은 날수에 비례해 밀리므로 100일 뒤면 100 칸 밀린다',
         '1년이 지나면 같은 날짜의 요일은 늘 그대로다'],
   chk(got, r, mem, pick){
     if(!mem.ok2) return {ok:false, msg:'② 칸을 먼저 통과하세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-mem.rem1)>0.5) return {ok:false, msg:'①에 적은 '+mem.rem1+' 입니다.'};
     if(Math.abs(got[1])>0.5) return {ok:false, msg:'②의 나머지는 0 이었습니다.'};
     if(Math.abs(got[2]-1)>0.5) return {ok:false, msg:'365 를 7 로 나누어 보세요 — 52 와 나머지가 나옵니다.'};
     if(pick!==0)
       return {ok:false, msg:'나머지가 '+mem.rem1+' 일 때는 그만큼 밀렸고 0 일 때는 그대로였습니다. 요일을 정하는 것은 무엇일까요? 다시 고르세요.'};
     return {ok:true, msg:'판단했습니다 — <b>달력 계산은 7 로 나눈 나머지를 따라가는 일입니다.</b> 그래서 내 생일은 해마다 하루씩, 윤년을 지나면 이틀씩 밀립니다.'};
   }}""")
 +
 note(242, '내가 바꾸고 · 내가 늘리고 · 내가 판단한다',
 """  {t:'기록 — <b>60 진법</b> 으로 바꾸고 적으세요',
   f:'수 = {0} · 밑 = {1} · 자릿수 = {2}',
   chk(got, r, mem){
     if(!r) return {ok:false, msg:'아직 화면 값이 없습니다.'};
     const n=noteNum(r[0]), b=noteNum(r[1]), L=noteNum(r[3]);
     if(b!==60) return {ok:false, msg:'지금 밑이 '+r[1]+' 입니다 — 60 진법으로 바꾸세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-n)>0.5) return {ok:false, msg:'수는 '+r[0]+' 입니다.'};
     if(Math.abs(got[1]-b)>0.5) return {ok:false, msg:'밑은 '+r[1]+' 입니다.'};
     if(Math.abs(got[2]-L)>0.5) return {ok:false, msg:'자릿수는 '+r[3]+' 입니다.'};
     mem.n=n; mem.L1=L;
     return {ok:true, msg:'기록했습니다 — 밑이 크니 '+r[3]+' 자리로 짧습니다. 밑을 작게 해 봅시다.'};
   }}""",
 """  {t:'생각 — <b>2 진법</b> 으로 바꾸고 (수는 그대로) 늘어난 자릿수를 구하세요',
   f:'밑 = {0} · 자릿수 = {1} · ①보다 늘어난 자릿수 = {2}',
   chk(got, r, mem){
     if(mem.L1===undefined) return {ok:false, msg:'① 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const n=noteNum(r[0]), b=noteNum(r[1]), L=noteNum(r[3]);
     if(b!==2) return {ok:false, msg:'지금 밑이 '+r[1]+' 입니다 — 2 진법으로 바꾸세요.'};
     if(n!==mem.n) return {ok:false, msg:'수를 ①과 같은 '+mem.n+' 으로 두세요 (지금 '+r[0]+').'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-b)>0.5) return {ok:false, msg:'밑은 '+r[1]+' 입니다.'};
     if(Math.abs(got[1]-L)>0.5) return {ok:false, msg:'자릿수는 '+r[3]+' 입니다.'};
     if(Math.abs(got[2]-(L-mem.L1))>0.5) return {ok:false, msg:r[3]+' 에서 ①의 '+mem.L1+' 를 빼 보세요.'};
     mem.L2=L; mem.ok2=true;
     return {ok:true, msg:'계산했습니다 — 같은 수인데 자리가 '+(L-mem.L1)+' 개나 늘었습니다.'};
   }}""",
 """  {t:'판단 — 2 의 거듭제곱과 견주어 보고 고르세요',
   f:'수 = {0} · 2 진법 자릿수 = {1} · 2 의 (자릿수 − 1) 제곱 = {2}',
   opts:['자릿수는 대략 <b>log(수) ÷ log(밑)</b> 이다 — 밑이 작을수록 같은 수를 적는 데 자리가 많이 들고, 대신 기호는 적게 든다',
         '밑을 바꾸면 수 자체가 달라진다',
         '밑이 클수록 자릿수도 함께 늘어난다'],
   chk(got, r, mem, pick){
     if(!mem.ok2) return {ok:false, msg:'② 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const n=noteNum(r[0]), b=noteNum(r[1]), L=noteNum(r[3]);
     if(b!==2) return {ok:false, msg:'2 진법으로 두고 판단하세요 (지금 '+r[1]+').'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-n)>0.5) return {ok:false, msg:'수는 '+r[0]+' 입니다.'};
     if(Math.abs(got[1]-L)>0.5) return {ok:false, msg:'자릿수는 '+r[3]+' 입니다.'};
     if(Math.abs(got[2]-Math.pow(2,L-1))>Math.max(1,Math.pow(2,L-1)*0.02))
       return {ok:false, msg:'2 를 '+(L-1)+' 번 곱해 보세요 — 그 수가 '+r[0]+' 이하여야 합니다.'};
     if(Math.pow(2,L-1)>n) return {ok:false, msg:'자릿수를 다시 세어 보세요 — 2^(자릿수−1) 이 수보다 크면 안 됩니다.'};
     if(pick!==0)
       return {ok:false, msg:'60 진법에서는 '+mem.L1+' 자리, 2 진법에서는 '+mem.L2+' 자리였습니다. 무엇이 자릿수를 정할까요? 다시 고르세요.'};
     return {ok:true, msg:'판단했습니다 — <b>자릿값은 약속이고, 밑이 그 약속을 정합니다.</b> 컴퓨터가 2 를 쓰는 것은 기호가 둘뿐이면 되기 때문이고, 시계가 60 을 쓰는 것은 약수가 많아 나누기 좋기 때문입니다.'};
   }}""")
 +
 note(243, '내가 더하고 · 내가 나누고 · 내가 판단한다',
 """  {t:'기록 — 지금 n 에서 두 합을 적으세요',
   f:'전체 합 = {0} · 한 줄 합 = {1} · 전체 합 ÷ n = {2}',
   chk(got, r, mem){
     if(!r) return {ok:false, msg:'아직 화면 값이 없습니다.'};
     const n=noteNum(r[0]), tot=noteNum(r[1]), line=noteNum(r[2]);
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-tot)>0.5) return {ok:false, msg:'전체 합은 '+r[1]+' 입니다.'};
     if(Math.abs(got[1]-line)>0.5) return {ok:false, msg:'한 줄 합은 '+r[2]+' 입니다.'};
     if(Math.abs(got[2]-tot/n)>0.5) return {ok:false, msg:r[1]+' 를 '+r[0]+' 로 나누어 보세요.'};
     if(Math.abs(tot/n-line)>0.5) return {ok:false, msg:'화면 값이 맞지 않습니다 — 다시 보세요.'};
     mem.n1=n; mem.line1=line;
     return {ok:true, msg:'기록했습니다 — 전체 합을 줄 수로 나눈 것이 곧 한 줄의 합입니다. n 을 바꿔 봅시다.'};
   }}""",
 """  {t:'생각 — <b>n 을 바꿔</b> 다시 적으세요',
   f:'n = {0} · 전체 합 = {1} · 한 줄 합 = {2}',
   chk(got, r, mem){
     if(mem.n1===undefined) return {ok:false, msg:'① 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const n=noteNum(r[0]), tot=noteNum(r[1]), line=noteNum(r[2]);
     if(n===mem.n1) return {ok:false, msg:'n 이 ①과 같습니다 ('+r[0]+') — 다른 값으로 바꾸세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-n)>0.5) return {ok:false, msg:'n 은 '+r[0]+' 입니다.'};
     if(Math.abs(got[1]-tot)>0.5) return {ok:false, msg:'전체 합은 '+r[1]+' 입니다.'};
     if(Math.abs(got[2]-line)>0.5) return {ok:false, msg:'한 줄 합은 '+r[2]+' 입니다.'};
     mem.n2=n; mem.line2=line; mem.ok2=true;
     return {ok:true, msg:'계산했습니다 — n 이 바뀌자 한 줄의 합도 함께 정해졌습니다.'};
   }}""",
 """  {t:'판단 — n(n² + 1) ÷ 2 를 손으로 구해 보고 고르세요',
   f:'n = {0} · n(n² + 1) ÷ 2 = {1} · 화면의 한 줄 합 = {2}',
   opts:['1 부터 n² 까지의 합이 <b>n²(n² + 1) ÷ 2</b> 이고 그것을 n 줄로 나누므로 한 줄의 합은 <b>n(n² + 1) ÷ 2</b> 로 처음부터 정해져 있다',
         '한 줄의 합은 숫자를 어떻게 놓느냐에 따라 달라진다',
         '한 줄의 합은 가장 큰 수와 가장 작은 수의 평균이다'],
   chk(got, r, mem, pick){
     if(!mem.ok2) return {ok:false, msg:'② 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const n=noteNum(r[0]), line=noteNum(r[2]);
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-n)>0.5) return {ok:false, msg:'n 은 '+r[0]+' 입니다.'};
     if(Math.abs(got[1]-n*(n*n+1)/2)>0.5) return {ok:false, msg:n+' × ('+n+'² + 1) ÷ 2 를 구해 보세요.'};
     if(Math.abs(got[2]-line)>0.5) return {ok:false, msg:'화면의 한 줄 합은 '+r[2]+' 입니다.'};
     if(pick!==0)
       return {ok:false, msg:'n = '+mem.n1+' 에서는 '+mem.line1+' , n = '+mem.n2+' 에서는 '+mem.line2+' 였습니다. 이 수는 무엇으로 정해질까요? 다시 고르세요.'};
     return {ok:true, msg:'판단했습니다 — <b>한 줄의 합은 숫자를 놓기도 전에 정해져 있습니다.</b> 그래서 마방진 만들기는 「합을 맞추는 일」이 아니라 「정해진 합에 맞게 배치를 찾는 일」입니다.'};
   }}""")
 +
 note(244, '내가 조이고 · 내가 늘리고 · 내가 판단한다',
 """  {t:'기록 — <b>변의 수를 적게</b> 두고 (24 아래) 두 값을 적으세요',
   f:'내접 = {0} · 외접 = {1} · 구간 폭 = {2}',
   chk(got, r, mem){
     if(!r) return {ok:false, msg:'아직 화면 값이 없습니다.'};
     const n=noteNum(r[0]), lo=noteNum(r[1]), hi=noteNum(r[2]), w=noteNum(r[3]);
     if(!(n<24)) return {ok:false, msg:'변의 수가 '+r[0]+' 입니다 — 24 보다 적게 두세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-lo)>0.000005) return {ok:false, msg:'내접은 '+r[1]+' 입니다.'};
     if(Math.abs(got[1]-hi)>0.000005) return {ok:false, msg:'외접은 '+r[2]+' 입니다.'};
     if(Math.abs(got[2]-w)>0.000005) return {ok:false, msg:'구간 폭은 '+r[3]+' 입니다.'};
     mem.w1=w; mem.n1=n;
     return {ok:true, msg:'기록했습니다 — 아직 폭이 '+r[3]+' 로 넓습니다. 변을 늘려 조여 봅시다.'};
   }}""",
 """  {t:'생각 — <b>변의 수를 96</b> 으로 늘리고, 폭이 몇 분의 1 이 되었는지 구하세요',
   f:'변의 수 = {0} · 구간 폭 = {1} · ①의 폭 ÷ 지금 폭 = {2}',
   chk(got, r, mem){
     if(mem.w1===undefined) return {ok:false, msg:'① 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const n=noteNum(r[0]), w=noteNum(r[3]);
     if(n!==96) return {ok:false, msg:'변의 수가 '+r[0]+' 입니다 — 96 으로 늘리세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-n)>0.5) return {ok:false, msg:'변의 수는 '+r[0]+' 입니다.'};
     if(Math.abs(got[1]-w)>0.000005) return {ok:false, msg:'구간 폭은 '+r[3]+' 입니다.'};
     if(Math.abs(got[2]-mem.w1/w)>Math.max(2, mem.w1/w*0.06))
       return {ok:false, msg:'①의 '+mem.w1+' 를 지금 '+r[3]+' 로 나누어 보세요.'};
     mem.w2=w; mem.ok2=true;
     return {ok:true, msg:'계산했습니다 — 폭이 '+mem.w1+' 에서 '+r[3]+' 로 줄었습니다. 참값은 그 안에 있습니다.'};
   }}""",
 """  {t:'판단 — π 가 그 사이에 있는지 확인하고 고르세요',
   f:'내접 = {0} · 외접 = {1} · π 가 그 사이에 있으면 1, 아니면 0 → {2}',
   opts:['내접 다각형의 둘레는 원보다 짧고 외접은 길므로 <b>n·sin(180°/n) < π < n·tan(180°/n)</b> 이다 — 변을 늘리면 두 값이 같은 곳으로 다가가 참값을 가둔다',
         '다각형의 둘레는 원의 둘레보다 늘 길다',
         '변을 늘려도 두 값의 차는 줄지 않는다'],
   chk(got, r, mem, pick){
     if(!mem.ok2) return {ok:false, msg:'② 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const lo=noteNum(r[1]), hi=noteNum(r[2]);
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-lo)>0.000005) return {ok:false, msg:'내접은 '+r[1]+' 입니다.'};
     if(Math.abs(got[1]-hi)>0.000005) return {ok:false, msg:'외접은 '+r[2]+' 입니다.'};
     if(Math.abs(got[2]-((lo<Math.PI&&Math.PI<hi)?1:0))>0.01)
       return {ok:false, msg:'π = 3.14159… 가 '+r[1]+' 와 '+r[2]+' 사이에 있는지 보세요.'};
     if(pick!==0)
       return {ok:false, msg:'폭이 '+mem.w1+' 에서 '+mem.w2+' 로 줄었고 두 값 사이에 늘 π 가 있었습니다. 안과 밖은 각각 무엇보다 길고 짧을까요? 다시 고르세요.'};
     return {ok:true, msg:'판단했습니다 — <b>재지 않고도 가둘 수 있습니다.</b> 안팎에서 조여 오는 두 수열이 같은 곳으로 다가가는 것 — 이것이 극한의 원형이고, 아르키메데스는 96각형에서 소수 둘째 자리를 확정했습니다.'};
   }}""")
 +
 note(245, '내가 나누고 · 내가 늘리고 · 내가 판단한다',
 """  {t:'기록 — <b>역설이 「없음」 인 의석 수</b> 에서 배분을 적으세요',
   f:'의석 = {0} · 가 = {1} · 나 = {2} · 다 = {3}',
   chk(got, r, mem){
     if(!r) return {ok:false, msg:'아직 화면 값이 없습니다.'};
     const s=noteNum(r[0]), A=noteNum(r[1]), B=noteNum(r[2]), C=noteNum(r[3]);
     if(String(r[4])!=='없음') return {ok:false, msg:'지금은 역설이 «'+r[4]+'» 입니다 — 없는 의석 수로 옮기세요.'};
     if(![0,1,2,3].every(j=>isFinite(got[j]))) return {ok:false, msg:'네 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-s)>0.5) return {ok:false, msg:'의석은 '+r[0]+' 입니다.'};
     if(Math.abs(got[1]-A)>0.5||Math.abs(got[2]-B)>0.5||Math.abs(got[3]-C)>0.5)
       return {ok:false, msg:'화면은 '+r[1]+' · '+r[2]+' · '+r[3]+' 입니다.'};
     if(Math.abs(A+B+C-s)>0.5) return {ok:false, msg:'세 수를 더하면 의석 수와 같아야 합니다.'};
     mem.s1=s; mem.C1=C;
     return {ok:true, msg:'기록했습니다 — 여기서는 늘려도 줄어드는 곳이 없습니다. 역설이 나는 자리를 찾아봅시다.'};
   }}""",
 """  {t:'생각 — <b>역설이 「있음」 인 의석 수</b> 로 옮기고 적으세요',
   f:'의석 = {0} · 다 = {1} · 세 지역의 합 = {2}',
   chk(got, r, mem){
     if(mem.s1===undefined) return {ok:false, msg:'① 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const s=noteNum(r[0]), A=noteNum(r[1]), B=noteNum(r[2]), C=noteNum(r[3]);
     if(String(r[4])!=='있음') return {ok:false, msg:'아직 역설이 «'+r[4]+'» 입니다 — 의석 수를 바꿔 「있음」 을 찾으세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-s)>0.5) return {ok:false, msg:'의석은 '+r[0]+' 입니다.'};
     if(Math.abs(got[1]-C)>0.5) return {ok:false, msg:'다 지역은 '+r[3]+' 석입니다.'};
     if(Math.abs(got[2]-s)>0.5) return {ok:false, msg:'세 수를 더하면 의석 수 '+r[0]+' 가 됩니다.'};
     mem.s2=s; mem.C2=C; mem.ok2=true;
     return {ok:true, msg:'계산했습니다 — 여기서 한 석을 더 늘리면 어느 지역의 몫이 줄어듭니다.'};
   }}""",
 """  {t:'판단 — <b>「나눗셈식(동트)으로 배분」</b> 을 누른 뒤 고르세요 (의석 수는 그대로)',
   f:'의석 = {0} · 가 = {1} · 역설이 있으면 1, 없으면 0 → {2}',
   opts:['최대잉여식은 <b>소수 부분만</b> 보고 남은 의석을 주므로, 전체가 늘면 소수 부분의 순서가 뒤바뀌어 한 곳이 줄어들 수 있다 — 나눗셈식에서는 이런 일이 생기지 않는다',
         '어떤 배분 방법이든 늘리면 줄어드는 일은 생길 수 없다',
         '인구가 가장 적은 지역은 늘 손해를 본다'],
   chk(got, r, mem, pick){
     if(!mem.ok2) return {ok:false, msg:'② 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const s=noteNum(r[0]), A=noteNum(r[1]);
     if(s!==mem.s2) return {ok:false, msg:'②와 같은 '+mem.s2+'석으로 두세요 (지금 '+r[0]+').'};
     if(String(r[4])!=='없음') return {ok:false, msg:'아직 역설이 «'+r[4]+'» 입니다 — 「나눗셈식(동트)으로 배분」 을 누르세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-s)>0.5) return {ok:false, msg:'의석은 '+r[0]+' 입니다.'};
     if(Math.abs(got[1]-A)>0.5) return {ok:false, msg:'가 지역은 '+r[1]+' 석입니다.'};
     if(Math.abs(got[2])>0.01) return {ok:false, msg:'화면은 «'+r[4]+'» 이라고 합니다.'};
     if(pick!==0)
       return {ok:false, msg:'같은 '+mem.s2+'석인데 최대잉여식에서는 역설이 있었고 나눗셈식에서는 없어졌습니다. 두 방법은 무엇을 다르게 보고 있을까요? 다시 고르세요.'};
     return {ok:true, msg:'판단했습니다 — <b>「공정하게 나눈다」에도 여러 뜻이 있습니다.</b> 어떤 방법도 모든 좋은 조건을 다 만족시키지는 못한다는 것이 증명되어 있습니다 — 수학이 정치 제도를 설계하는 자리입니다.'};
   }}""")
 +
 note(246, '내가 깨고 · 내가 늘리고 · 내가 판단한다',
 """  {t:'기록 — <b>열쇠 한 글자</b> 로 두고 <b>「빈도로 깨 보기」</b> 를 누른 뒤 적으세요',
   f:'이동값 = {0} · 추정 이동값 = {1} · 두 값의 차 = {2}',
   chk(got, r, mem){
     if(!r) return {ok:false, msg:'아직 화면 값이 없습니다.'};
     const k=noteNum(r[0]), L=noteNum(r[1]), g=noteNum(r[3]), m=noteNum(r[4]);
     if(L!==1) return {ok:false, msg:'열쇠 글자 수가 '+r[1]+' 입니다 — 1 로 두세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-k)>0.5) return {ok:false, msg:'이동값은 '+r[0]+' 입니다.'};
     if(Math.abs(got[1]-g)>0.5) return {ok:false, msg:'추정 이동값은 '+r[3]+' 입니다.'};
     if(Math.abs(got[2]-(k-g))>0.5) return {ok:false, msg:'두 값을 빼 보세요 — 제대로 깼다면 0 입니다.'};
     mem.m1=m; mem.ok1=true;
     return {ok:true, msg:'기록했습니다 — 막대 하나만 보고 열쇠를 되찾았습니다. 평균 대비 '+r[4]+' 나 튀어 있습니다.'};
   }}""",
 """  {t:'생각 — <b>열쇠 글자 수를 3 이상</b> 으로 늘리고 평균 대비를 견주세요',
   f:'열쇠 글자 수 = {0} · 평균 대비 = {1} 배 · ①의 평균 대비 = {2} 배',
   chk(got, r, mem){
     if(!mem.ok1) return {ok:false, msg:'① 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const L=noteNum(r[1]), m=noteNum(r[4]);
     if(!(L>=3)) return {ok:false, msg:'열쇠 글자 수가 '+r[1]+' 입니다 — 3 이상으로 늘리세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-L)>0.5) return {ok:false, msg:'열쇠 글자 수는 '+r[1]+' 입니다.'};
     if(Math.abs(got[1]-m)>0.02) return {ok:false, msg:'평균 대비는 '+r[4]+' 입니다.'};
     if(Math.abs(got[2]-mem.m1)>0.02) return {ok:false, msg:'①에 적은 '+mem.m1+' 입니다.'};
     if(!(m<mem.m1)) return {ok:false, msg:'막대가 아직 고르지 않습니다 — 열쇠를 더 늘려 보세요.'};
     mem.m2=m; mem.ok2=true;
     return {ok:true, msg:'계산했습니다 — 가장 높은 막대가 '+mem.m1+' 에서 '+r[4]+' 로 낮아졌습니다.'};
   }}""",
 """  {t:'판단 — 두 평균 대비를 나란히 두고 고르세요',
   f:'①의 평균 대비 = {0} 배 · ②의 평균 대비 = {1} 배 · ②가 더 작으면 1, 아니면 0 → {2}',
   opts:['열쇠를 모르더라도 <b>통계적 흔적</b> 이 남으면 깨진다 — 한 칸씩 미는 암호는 봉우리가 통째로 옮겨질 뿐이라 가장 높은 막대 하나로 열쇠가 드러난다',
         '열쇠의 가짓수가 많으면 그것만으로 안전하다',
         '열쇠를 길게 하면 암호문이 짧아진다'],
   chk(got, r, mem, pick){
     if(!mem.ok2) return {ok:false, msg:'② 칸을 먼저 통과하세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-mem.m1)>0.02) return {ok:false, msg:'①에 적은 '+mem.m1+' 입니다.'};
     if(Math.abs(got[1]-mem.m2)>0.02) return {ok:false, msg:'②에 적은 '+mem.m2+' 입니다.'};
     if(Math.abs(got[2]-1)>0.01) return {ok:false, msg:'두 값을 견주세요.'};
     if(pick!==0)
       return {ok:false, msg:'열쇠 한 글자일 때는 막대 하나가 '+mem.m1+' 배로 튀어 바로 깨졌습니다. 암호를 지키는 것은 무엇일까요? 다시 고르세요.'};
     return {ok:true, msg:'판단했습니다 — <b>암호의 안전함은 열쇠의 가짓수만으로 정해지지 않습니다.</b> 통계적 흔적을 지워야 하고, 그래서 현대 암호는 빈도가 고르게 퍼지도록 설계합니다.'};
   }}""")
 +
 note(247, '내가 풀고 · 내가 막고 · 내가 판단한다',
 """  {t:'기록 — <b>ad − bc 가 0 이 아닌</b> 계수에서 적으세요',
   f:'a × d = {0} · b × c = {1} · ad − bc = {2}',
   chk(got, r, mem){
     if(!r) return {ok:false, msg:'아직 화면 값이 없습니다.'};
     const ab=String(r[0]).split(' '), cd=String(r[1]).split(' ');
     const a=+ab[0], b=+ab[1], c=+cd[0], d=+cd[1], det=noteNum(r[2]);
     if(Math.abs(det)<1e-9) return {ok:false, msg:'지금 ad − bc 가 0 입니다 — 0 이 아닌 계수로 두세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-a*d)>0.5) return {ok:false, msg:'a 와 d 를 곱해 보세요 ('+r[0]+' · '+r[1]+').'};
     if(Math.abs(got[1]-b*c)>0.5) return {ok:false, msg:'b 와 c 를 곱해 보세요.'};
     if(Math.abs(got[2]-det)>0.5) return {ok:false, msg:'ad − bc 는 '+r[2]+' 입니다.'};
     if(String(r[3])!=='한 점') return {ok:false, msg:'해가 «'+r[3]+'» 입니다 — ad − bc 가 0 이 아니면 한 점이어야 합니다.'};
     mem.det1=det; mem.ok1=true;
     return {ok:true, msg:'기록했습니다 — ad − bc 가 0 이 아니라 해가 한 점으로 정해집니다. 0 으로 만들어 봅시다.'};
   }}""",
 """  {t:'생각 — <b>ad − bc 를 0 으로</b> 만들어 해가 없게 하고 적으세요',
   f:'a × d = {0} · b × c = {1} · ad − bc = {2}',
   chk(got, r, mem){
     if(!mem.ok1) return {ok:false, msg:'① 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const ab=String(r[0]).split(' '), cd=String(r[1]).split(' ');
     const a=+ab[0], b=+ab[1], c=+cd[0], d=+cd[1], det=noteNum(r[2]);
     if(Math.abs(det)>1e-9) return {ok:false, msg:'ad − bc 가 '+r[2]+' 입니다 — 0 으로 만드세요.'};
     if(String(r[3])!=='없음') return {ok:false, msg:'해가 «'+r[3]+'» 입니다 — 해가 하나도 없게 상수항을 맞추세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-a*d)>0.5) return {ok:false, msg:'a 와 d 를 곱해 보세요.'};
     if(Math.abs(got[1]-b*c)>0.5) return {ok:false, msg:'b 와 c 를 곱해 보세요.'};
     if(Math.abs(got[2])>0.5) return {ok:false, msg:'두 곱이 같으니 차는 0 입니다.'};
     mem.ok2=true;
     return {ok:true, msg:'계산했습니다 — 두 곱이 같아져 행렬식이 0 이고, 두 직선이 나란히 비켜 갑니다.'};
   }}""",
 """  {t:'판단 — 계수는 그대로 두고 <b>상수항을 바꿔 해가 무수히 많게</b> 한 뒤 고르세요',
   f:'ad − bc = {0} · 해가 무수히 많으면 1 → {1} · 그때도 ad − bc 는 {2}',
   opts:['ad − bc 가 0 이면 <b>역행렬이 없어</b> 해가 하나로 정해지지 않는다 — 두 식이 같은 직선이면 해가 무수히 많고, 나란히 비켜 가면 하나도 없다',
         'ad − bc 가 0 이면 해가 반드시 없다',
         '상수항을 바꾸면 ad − bc 도 함께 바뀐다'],
   chk(got, r, mem, pick){
     if(!mem.ok2) return {ok:false, msg:'② 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const det=noteNum(r[2]);
     if(Math.abs(det)>1e-9) return {ok:false, msg:'계수는 그대로 두세요 — ad − bc 가 '+r[2]+' 입니다.'};
     if(String(r[3])!=='무수히') return {ok:false, msg:'해가 «'+r[3]+'» 입니다 — 상수항을 바꿔 두 식이 같은 직선이 되게 하세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0])>0.5) return {ok:false, msg:'ad − bc 는 '+r[2]+' 입니다.'};
     if(Math.abs(got[1]-1)>0.01) return {ok:false, msg:'화면이 «'+r[3]+'» 라고 합니다.'};
     if(Math.abs(got[2])>0.5) return {ok:false, msg:'상수항을 바꿔도 계수는 그대로이니 0 입니다.'};
     if(pick!==0)
       return {ok:false, msg:'같은 0 인데 ②에서는 해가 없었고 지금은 무수히 많습니다. 행렬식이 말해 주는 것은 무엇까지일까요? 다시 고르세요.'};
     return {ok:true, msg:'판단했습니다 — <b>행렬식은 「풀리는가」까지만 말합니다.</b> 0 이 아니면 해가 꼭 하나, 0 이면 상수항까지 보아야 없는지 많은지 갈립니다 — 계산하기 전에 묻는 질문입니다.'};
   }}""")
 +
 note(248, '내가 보내고 · 내가 뒤집고 · 내가 판단한다',
 """  {t:'기록 — 지금 성분에서 행렬식과 넓이를 적으세요',
   f:'ad − bc = {0} · 넓이 = {1} · 1 보다 작으면 1, 크면 0 → {2}',
   chk(got, r, mem){
     if(!r) return {ok:false, msg:'아직 화면 값이 없습니다.'};
     const det=noteNum(r[2]), ar=noteNum(r[3]);
     if(Math.abs(det)<0.05) return {ok:false, msg:'행렬식이 거의 0 입니다 — ③에서 볼 테니 지금은 0 이 아니게 두세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-det)>0.005) return {ok:false, msg:'ad − bc 는 '+r[2]+' 입니다.'};
     if(Math.abs(got[1]-ar)>0.005) return {ok:false, msg:'넓이는 '+r[3]+' 입니다.'};
     if(Math.abs(got[2]-(ar<1?1:0))>0.01) return {ok:false, msg:'넓이 '+r[3]+' 를 1 과 견주세요.'};
     mem.det1=det; mem.ar1=ar;
     return {ok:true, msg:'기록했습니다 — 넓이 1 이던 정사각형이 '+r[3]+' 배가 되었습니다. 부호를 바꿔 봅시다.'};
   }}""",
 """  {t:'생각 — <b>ad − bc 를 음수</b> 로 만들고 적으세요',
   f:'ad − bc = {0} · 넓이 = {1} · 부호가 음수이면 1, 양수이면 0 → {2}',
   chk(got, r, mem){
     if(mem.det1===undefined) return {ok:false, msg:'① 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const det=noteNum(r[2]), ar=noteNum(r[3]);
     if(!(det<-0.02)) return {ok:false, msg:'ad − bc 가 '+r[2]+' 입니다 — 음수로 만드세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-det)>0.005) return {ok:false, msg:'ad − bc 는 '+r[2]+' 입니다.'};
     if(Math.abs(got[1]-ar)>0.005) return {ok:false, msg:'넓이는 '+r[3]+' 입니다.'};
     if(Math.abs(got[2]-1)>0.01) return {ok:false, msg:'부호를 보세요 — 지금 '+r[2]+' 입니다.'};
     if(Math.abs(ar-Math.abs(det))>0.005) return {ok:false, msg:'넓이가 행렬식의 절댓값과 같은지 확인하세요.'};
     mem.ok2=true;
     return {ok:true, msg:'계산했습니다 — 부호는 음수인데 넓이는 양수입니다. 넓이는 절댓값이기 때문입니다.'};
   }}""",
 """  {t:'판단 — <b>두 열이 나란해지게</b> 하여 넓이를 0 으로 만든 뒤 고르세요',
   f:'ad − bc = {0} · 넓이 = {1} · 0 이면 1, 아니면 0 → {2}',
   opts:['행렬식의 <b>절댓값은 넓이 배율</b>, <b>부호는 방향</b> 이다 — 0 이 되면 평면 전체가 한 직선으로 눌려 되돌릴 수 없고, 그래서 역행렬도 없다',
         '행렬식이 음수면 넓이도 음수가 된다',
         '행렬식이 0 이어도 평행사변형의 넓이는 남아 있다'],
   chk(got, r, mem, pick){
     if(!mem.ok2) return {ok:false, msg:'② 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const det=noteNum(r[2]), ar=noteNum(r[3]);
     if(!(Math.abs(det)<0.05)) return {ok:false, msg:'ad − bc 가 '+r[2]+' 입니다 — 두 열이 나란해지게 하여 0 에 가깝게 만드세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-det)>0.005) return {ok:false, msg:'ad − bc 는 '+r[2]+' 입니다.'};
     if(Math.abs(got[1]-ar)>0.005) return {ok:false, msg:'넓이는 '+r[3]+' 입니다.'};
     if(Math.abs(got[2]-1)>0.01) return {ok:false, msg:'넓이가 0 인지 보세요.'};
     if(pick!==0)
       return {ok:false, msg:'①에서는 '+mem.ar1+' 배, ②에서는 음수였는데 넓이는 양수였고, 지금은 0 입니다. 행렬식의 부호와 크기는 각각 무엇을 말할까요? 다시 고르세요.'};
     return {ok:true, msg:'판단했습니다 — <b>행렬식은 넓이 배율이라는 한 개의 수입니다.</b> 0 이면 평면이 납작해져 되돌릴 수 없고, 그래서 「역행렬이 없다」와 「해가 하나로 정해지지 않는다」가 같은 말이 됩니다.'};
   }}""")
 +
 note(249, '내가 돌리고 · 내가 멈추고 · 내가 판단한다',
 """  {t:'기록 — <b>고유 방향이 아닌 각</b> 에서 적으세요 (sin 이 0.1 보다 큰 곳)',
   f:'각 = {0} ° · sin = {1} · 0 보다 크면 1, 0 이면 0 → {2}',
   chk(got, r, mem){
     if(!r) return {ok:false, msg:'아직 화면 값이 없습니다.'};
     const th=noteNum(r[0]), sn=noteNum(r[2]);
     if(!(sn>0.1)) return {ok:false, msg:'sin 이 '+r[2]+' 로 이미 작습니다 — 다른 각으로 돌리세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-th)>0.5) return {ok:false, msg:'각은 '+r[0]+' 입니다.'};
     if(Math.abs(got[1]-sn)>0.0005) return {ok:false, msg:'sin 은 '+r[2]+' 입니다.'};
     if(Math.abs(got[2]-1)>0.01) return {ok:false, msg:'sin 이 0 인지 아닌지 보세요.'};
     mem.sn1=sn; mem.th1=th;
     return {ok:true, msg:'기록했습니다 — 넣은 벡터와 나온 벡터의 방향이 '+r[2]+' 만큼 어긋났습니다. 어긋나지 않는 각을 찾아봅시다.'};
   }}""",
 """  {t:'생각 — <b>sin 이 0.03 보다 작아지는 각</b> 을 찾아 적으세요',
   f:'각 = {0} ° · sin = {1} · 배율 = {2}',
   chk(got, r, mem){
     if(mem.sn1===undefined) return {ok:false, msg:'① 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const th=noteNum(r[0]), sn=noteNum(r[2]), lam=noteNum(r[3]);
     if(!(sn<0.03)) return {ok:false, msg:'sin 이 '+r[2]+' 입니다 — 더 돌려 0 에 가깝게 만드세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-th)>0.5) return {ok:false, msg:'각은 '+r[0]+' 입니다.'};
     if(Math.abs(got[1]-sn)>0.0005) return {ok:false, msg:'sin 은 '+r[2]+' 입니다.'};
     if(Math.abs(got[2]-lam)>0.005) return {ok:false, msg:'배율은 '+r[3]+' 입니다.'};
     mem.lam=lam; mem.th2=th; mem.ok2=true;
     return {ok:true, msg:'계산했습니다 — 방향이 그대로이고 길이만 '+r[3]+' 배가 되었습니다. 이 수는 어디서 나올까요?'};
   }}""",
 """  {t:'판단 — 특성방정식의 큰 근과 견주고 고르세요 (a=2 · b=1 · c=1 · d=3 일 때 λ² − 5λ + 5 = 0)',
   f:'배율 = {0} · (5 + √5) ÷ 2 = {1} · 두 값이 같으면 1, 다르면 0 → {2}',
   opts:['Av 가 v 와 같은 방향이면 <b>Av = λv</b> 이고, 이것이 성립하는 λ 는 <b>λ² − (a+d)λ + (ad−bc) = 0</b> 의 근이다 — 그 방향이 고유벡터, 그 배율이 고윳값이다',
         '모든 벡터는 변환해도 방향이 바뀌지 않는다',
         '고윳값은 행렬의 성분을 모두 더한 값이다'],
   chk(got, r, mem, pick){
     if(!mem.ok2) return {ok:false, msg:'② 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const sn=noteNum(r[2]), lam=noteNum(r[3]);
     if(!(sn<0.03)) return {ok:false, msg:'②와 같이 고유 방향으로 두세요 (지금 sin '+r[2]+').'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-lam)>0.005) return {ok:false, msg:'배율은 '+r[3]+' 입니다.'};
     if(Math.abs(got[1]-(5+Math.sqrt(5))/2)>0.02) return {ok:false, msg:'√5 ≒ 2.236 을 써서 (5 + √5) ÷ 2 를 구해 보세요.'};
     if(Math.abs(got[2]-(Math.abs(lam-(5+Math.sqrt(5))/2)<0.02?1:0))>0.01)
       return {ok:false, msg:'두 값을 견주세요 — 계수가 a=2 · b=1 · c=1 · d=3 일 때의 이야기입니다.'};
     if(pick!==0)
       return {ok:false, msg:'각이 '+mem.th1+'° 일 때는 sin 이 '+mem.sn1+' 였는데 '+mem.th2+'° 에서는 0 에 붙었고 배율이 '+r[3]+' 였습니다. 이 수는 어떤 방정식의 근일까요? 다시 고르세요.'};
     return {ok:true, msg:'판단했습니다 — <b>변환이 붙잡아 두는 축이 있습니다.</b> 그 방향으로 놓인 벡터는 휘지 않고 길이만 λ 배가 되며, λ 는 특성방정식의 근입니다 — 진동·구조·검색 순위가 모두 이 축에서 읽힙니다.'};
   }}""")
 +
 note(250, '내가 곱하고 · 내가 건너뛰고 · 내가 판단한다',
 """  {t:'기록 — <b>n 을 작게</b> 두고 (5 아래) 적으세요',
   f:'n = {0} · λ₁ = {1} · λ₁ⁿ = {2}',
   chk(got, r, mem){
     if(!r) return {ok:false, msg:'아직 화면 값이 없습니다.'};
     const n=noteNum(r[0]), l1=noteNum(r[2]), p=noteNum(r[3]);
     if(!(n<5)) return {ok:false, msg:'n 이 '+r[0]+' 입니다 — 5 보다 작게 두세요.'};
     if(!isFinite(l1)) return {ok:false, msg:'고윳값이 복소수입니다 — 성분을 바꿔 실수가 되게 하세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-n)>0.5) return {ok:false, msg:'n 은 '+r[0]+' 입니다.'};
     if(Math.abs(got[1]-l1)>0.0005) return {ok:false, msg:'λ₁ 은 '+r[2]+' 입니다.'};
     if(Math.abs(got[2]-p)>Math.max(0.05, p*0.01)) return {ok:false, msg:'λ₁ⁿ 은 '+r[3]+' 입니다.'};
     mem.l1=l1; mem.n1=n;
     return {ok:true, msg:'기록했습니다 — 큰 고윳값이 '+r[2]+' 입니다. n 을 키워 봅시다.'};
   }}""",
 """  {t:'생각 — <b>n 을 12</b> 로 키우고, 첫 행의 두 성분을 적으세요',
   f:'n = {0} · A^n 첫 성분 = {1} · λ₁ⁿ = {2}',
   chk(got, r, mem){
     if(mem.l1===undefined) return {ok:false, msg:'① 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const n=noteNum(r[0]), first=noteNum(r[1]), l1=noteNum(r[2]), p=noteNum(r[3]);
     if(n!==12) return {ok:false, msg:'n 이 '+r[0]+' 입니다 — 12 로 키우세요.'};
     if(Math.abs(l1-mem.l1)>0.0005) return {ok:false, msg:'성분을 ①과 같게 두세요 (①의 λ₁ 은 '+mem.l1+').'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-n)>0.5) return {ok:false, msg:'n 은 '+r[0]+' 입니다.'};
     if(Math.abs(got[1]-first)>Math.max(1, first*0.01)) return {ok:false, msg:'A^n 의 첫 성분은 '+r[1]+' 입니다.'};
     if(Math.abs(got[2]-p)>Math.max(1, p*0.01)) return {ok:false, msg:'λ₁ⁿ 은 '+r[3]+' 입니다.'};
     mem.first=first; mem.p=p; mem.ok2=true;
     return {ok:true, msg:'계산했습니다 — 성분이 '+r[1]+' 까지 커졌는데 λ₁ⁿ 이 '+r[3]+' 로 같은 크기입니다.'};
   }}""",
 """  {t:'판단 — λ₁ 에서 1 을 빼 보고 고르세요',
   f:'λ₁ = {0} · λ₁ − 1 = {1} · 첫 행 두 성분의 비가 다가가는 수 = {2}',
   opts:['A = P D P⁻¹ 이면 <b>Aⁿ = P Dⁿ P⁻¹</b> 이라 행렬의 거듭제곱이 수 두 개의 거듭제곱으로 바뀐다 — n 이 커지면 큰 고윳값 쪽만 남아 성분의 비가 그 고유벡터의 기울기로 굳는다',
         'n 이 커지면 두 고윳값이 모두 똑같이 커진다',
         '행렬의 거듭제곱은 성분을 각각 거듭제곱하면 된다'],
   chk(got, r, mem, pick){
     if(!mem.ok2) return {ok:false, msg:'② 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const l1=noteNum(r[2]);
     if(Math.abs(l1-mem.l1)>0.0005) return {ok:false, msg:'성분을 ①·②와 같게 두세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-l1)>0.0005) return {ok:false, msg:'λ₁ 은 '+r[2]+' 입니다.'};
     if(Math.abs(got[1]-(l1-1))>0.005) return {ok:false, msg:r[2]+' 에서 1 을 빼 보세요.'};
     if(Math.abs(got[2]-(l1-1))>0.02) return {ok:false, msg:'화면에서 A^n 의 첫 행 두 성분을 나누어 보세요 — 방금 구한 값과 가까워집니다.'};
     if(pick!==0)
       return {ok:false, msg:'n = '+mem.n1+' 에서 '+mem.l1+' 이던 것이 n = 12 에서 성분 '+mem.first+' 와 λ₁ⁿ '+mem.p+' 로 나란히 커졌습니다. 무엇이 살아남은 걸까요? 다시 고르세요.'};
     return {ok:true, msg:'판단했습니다 — <b>대각화하면 거듭제곱이 쉬워집니다.</b> Aⁿ = P Dⁿ P⁻¹ 이라 99 번 곱할 일이 수 두 개를 거듭제곱하는 일로 바뀌고, n 이 커질수록 큰 고윳값의 방향만 남습니다.'};
   }}""")
)
