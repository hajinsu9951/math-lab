# -*- coding: utf-8 -*-
"""LAB 181~190 탐구 노트 — 기록 → 생각 → 판단. 판정은 화면의 read() 값으로만 한다."""


def note(no, head, c1, c2, c3):
    return "\n %d:{ h:'%s',\n  c:[\n%s,\n%s,\n%s\n ]},\n" % (no, head, c1, c2, c3)


NOTES = (
 note(181, '내가 휘고 · 내가 세고 · 내가 판단한다',
 """  {t:'기록 — b 를 <b>0 이 아니게</b> 두고 적으세요',
   f:'b = {0} · −b ÷ 2 = {1} · 변곡점 수 = {2}',
   chk(got, r, mem){
     if(!r) return {ok:false, msg:'아직 화면 값이 없습니다.'};
     const b=noteNum(r[0]), cnt=noteNum(r[3]);
     if(Math.abs(b)<1e-9) return {ok:false, msg:'b 가 0 입니다 — 0 이 아닌 값으로 두세요. b = 0 은 ③에서 봅니다.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-b)>0.02) return {ok:false, msg:'b 는 '+r[0]+' 입니다.'};
     if(Math.abs(got[1]-(-b/2))>0.02) return {ok:false, msg:'−b 를 2 로 나누세요 — 화면의 「f″=0 인 x」에 같은 수가 있습니다.'};
     if(Math.abs(got[2]-cnt)>0.5) return {ok:false, msg:'변곡점 수는 '+r[3]+' 입니다.'};
     mem.b=b; mem.cnt=cnt;
     return {ok:true, msg:'기록했습니다 — f″ = 6x(2x + b) 의 두 근이 0 과 −b/2 입니다.'};
   }}""",
 """  {t:'생각 — 두 근 <b>사이</b> 와 <b>바깥</b> 에서 f″ 의 부호를 따지세요',
   f:'두 근 사이에서 f″ 의 부호가 음수면 −1, 양수면 1 → {0} · 바깥에서는 → {1}',
   chk(got, r, mem){
     if(mem.b===undefined) return {ok:false, msg:'① 칸을 먼저 통과하세요.'};
     if(![0,1].every(j=>isFinite(got[j]))) return {ok:false, msg:'두 칸을 모두 채우세요.'};
     if(Math.abs(got[0]+1)>0.01) return {ok:false, msg:'6x(2x + b) 에 두 근 사이의 x 를 넣어 보세요 — 두 괄호의 부호가 다릅니다.'};
     if(Math.abs(got[1]-1)>0.01) return {ok:false, msg:'바깥쪽 x 를 넣어 보세요 — 두 괄호의 부호가 같습니다.'};
     mem.ok2=true;
     return {ok:true, msg:'계산했습니다 — 부호가 양 → 음 → 양 으로 두 번 바뀌니 변곡점이 둘입니다.'};
   }}""",
 """  {t:'판단 — <b>「b 를 0 으로」</b> 를 누른 뒤 고르세요',
   f:'f″ = 0 인 x 의 개수 = {0} · 변곡점 수 = {1}',
   opts:['변곡점의 조건은 「f″ = 0」 이 아니라 <b>f″ 의 부호가 바뀜</b> — 중근이면 부호가 그대로라 변곡점이 아니다',
         'f″ = 0 이면 언제나 변곡점이다',
         'f′ = 0 인 자리가 변곡점이다'],
   chk(got, r, mem, pick){
     if(!mem.ok2) return {ok:false, msg:'② 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const b=noteNum(r[0]), cnt=noteNum(r[3]);
     if(Math.abs(b)>1e-9) return {ok:false, msg:'b 를 0 으로 맞추세요 (지금 '+r[0]+').'};
     if(![0,1].every(j=>isFinite(got[j]))) return {ok:false, msg:'두 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-1)>0.5) return {ok:false, msg:'b = 0 이면 f″ = 12x² — 0 이 되는 x 가 몇 개인가요? (중근은 한 자리로 셉니다)'};
     if(Math.abs(got[1]-cnt)>0.5) return {ok:false, msg:'화면의 변곡점 수는 '+r[3]+' 입니다.'};
     if(pick!==0)
       return {ok:false, msg:'f″ = 0 인 자리는 있는데 변곡점은 '+r[3]+'개입니다. 무엇이 모자랐을까요? 다시 고르세요.'};
     return {ok:true, msg:'판단했습니다 — <b>f″ = 0 은 변곡점의 필요조건일 뿐</b> 입니다. 부호가 실제로 바뀌는지까지 확인해야 합니다 — f′ = 0 이 극값의 필요조건인 것과 똑같은 구조입니다.'};
   }}""")
 +
 note(182, '내가 바꾸고 · 내가 빠뜨리고 · 내가 판단한다',
 """  {t:'기록 — <b>「구간만 바꿔 계산」</b> 을 누르고 두 값을 적으세요',
   f:'참값 = {0} · 빠뜨린 값 = {1}',
   chk(got, r, mem){
     if(!r) return {ok:false, msg:'아직 화면 값이 없습니다.'};
     const k=noteNum(r[0]), ex=noteNum(r[3]), wr=noteNum(r[4]);
     if(![0,1].every(j=>isFinite(got[j]))) return {ok:false, msg:'두 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-ex)>1e-4||Math.abs(got[1]-wr)>1e-4)
       return {ok:false, msg:'화면은 참값 '+r[3]+' · 빠뜨린 값 '+r[4]+' 입니다.'};
     mem.k=k; mem.ex=ex; mem.wr=wr;
     return {ok:true, msg:'기록했습니다 — 두 값이 다릅니다. 얼마나 다른지 나눠 봅시다.'};
   }}""",
 """  {t:'생각 — <b>빠뜨린 값 ÷ 참값</b> 을 구해 k 와 맞추세요',
   f:'빠뜨린 값 ÷ 참값 = {0} · 화면의 k = {1} · 두 값의 차 = {2}',
   chk(got, r, mem){
     if(mem.k===undefined) return {ok:false, msg:'① 칸을 먼저 통과하세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-mem.wr/mem.ex)>0.02) return {ok:false, msg:'①의 '+mem.wr+' 를 '+mem.ex+' 로 나누세요.'};
     if(Math.abs(got[1]-mem.k)>0.06) return {ok:false, msg:'①에서 본 k 는 '+mem.k+' 입니다.'};
     if(Math.abs(got[2])>0.05) return {ok:false, msg:'두 값을 빼 보세요. 무엇이 나오나요?'};
     mem.ok2=true;
     return {ok:true, msg:'계산했습니다 — 정확히 k 배 어긋났습니다. 빠뜨린 것이 바로 그 k 입니다.'};
   }}""",
 """  {t:'판단 — k 를 <b>바꾸고</b> 「du = k·dx 를 반영하기」를 누른 뒤 고르세요',
   f:'새 k = {0} · 참값 = {1} · 빠뜨린 값 ÷ 참값 = {2}',
   opts:['u = kx 이면 du = k dx 이므로 <b>dx = du/k</b> — 구간만 바꾸고 이 1/k 을 빠뜨리면 답이 k 배가 된다',
         '변수를 바꾸면 넓이 자체가 k 배로 커진다',
         '구간을 바꿨으니 답이 달라지는 것이 맞다'],
   chk(got, r, mem, pick){
     if(!mem.ok2) return {ok:false, msg:'② 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const k=noteNum(r[0]), ex=noteNum(r[3]), wr=noteNum(r[4]);
     if(Math.abs(k-mem.k)<0.2) return {ok:false, msg:'k 가 거의 그대로입니다 — 바꿔 보세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-k)>0.06) return {ok:false, msg:'k 는 '+r[0]+' 입니다.'};
     if(Math.abs(got[1]-ex)>1e-4) return {ok:false, msg:'참값은 '+r[3]+' 입니다.'};
     if(Math.abs(got[2]-k)>0.06) return {ok:false, msg:'빠뜨린 값을 참값으로 나누세요 — k 와 같아야 합니다.'};
     if(pick!==0)
       return {ok:false, msg:'k 를 바꿔도 어긋나는 배수가 늘 k 와 같았습니다. 무엇을 빠뜨린 걸까요? 다시 고르세요.'};
     return {ok:true, msg:'판단했습니다 — <b>넓이는 변하지 않습니다. 변하는 것은 「세는 자」입니다.</b> 변수를 바꾸면 자의 눈금도 함께 바뀌므로 du 를 반드시 끌고 와야 합니다.'};
   }}""")
 +
 note(183, '내가 고르고 · 내가 견주고 · 내가 판단한다',
 """  {t:'기록 — u 를 <b>x</b> 로 두고 적으세요',
   f:'정적분 값 = {0} · 남은 적분이 쉬우면 1, 어려우면 0 → {1}',
   chk(got, r, mem){
     if(!r) return {ok:false, msg:'아직 화면 값이 없습니다.'};
     if(String(r[0]).indexOf('u = x')<0)
       return {ok:false, msg:'지금 «'+r[0]+'» 입니다. u = x 인 선택을 고르세요.'};
     const v=noteNum(r[4]);
     const easy=(String(r[2])==='쉬움')?1:0;
     if(![0,1].every(j=>isFinite(got[j]))) return {ok:false, msg:'두 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-v)>1e-4) return {ok:false, msg:'정적분 값은 '+r[4]+' 입니다.'};
     if(Math.abs(got[1]-easy)>0.01) return {ok:false, msg:'화면의 난이도는 «'+r[2]+'» 입니다.'};
     mem.v=v; mem.rest=String(r[1]);
     return {ok:true, msg:'기록했습니다 — 남은 적분이 «'+mem.rest+'» 입니다. 반대로 골라 봅시다.'};
   }}""",
 """  {t:'생각 — u 를 <b>eˣ</b> 로 바꿔 적으세요',
   f:'정적분 값 = {0} · ①의 값과의 차 = {1} · 남은 적분이 쉬우면 1, 어려우면 0 → {2}',
   chk(got, r, mem){
     if(mem.v===undefined) return {ok:false, msg:'① 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     if(String(r[0]).indexOf('eˣ')<0)
       return {ok:false, msg:'지금 «'+r[0]+'» 입니다. u = eˣ 인 선택으로 바꾸세요.'};
     const v=noteNum(r[4]);
     const easy=(String(r[2])==='쉬움')?1:0;
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-v)>1e-4) return {ok:false, msg:'정적분 값은 '+r[4]+' 입니다.'};
     if(Math.abs(got[1]-(v-mem.v))>1e-3) return {ok:false, msg:'①의 값 '+mem.v+' 와의 차를 적으세요.'};
     if(Math.abs(got[2]-easy)>0.01) return {ok:false, msg:'화면의 난이도는 «'+r[2]+'» 입니다.'};
     mem.rest2=String(r[1]); mem.ok2=true;
     return {ok:true, msg:'계산했습니다 — 답은 같은데 남은 적분이 «'+mem.rest2+'» 로 더 어려워졌습니다.'};
   }}""",
 """  {t:'판단 — 구간의 오른쪽 끝을 <b>바꿔</b> 본 뒤 고르세요',
   f:'새 구간의 오른쪽 끝 = {0} · 정적분 값 = {1}',
   opts:['∫u dv = uv − ∫v du 에서 <b>남는 적분 ∫v du 가 쉬워지도록</b> — 미분하면 간단해지는 쪽을 u 로 잡는다',
         'u 를 무엇으로 두든 결과도 난이도도 같다',
         '적분하면 간단해지는 쪽을 u 로 잡아야 한다'],
   chk(got, r, mem, pick){
     if(!mem.ok2) return {ok:false, msg:'② 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const b=noteNum(r[3]), v=noteNum(r[4]);
     if(![0,1].every(j=>isFinite(got[j]))) return {ok:false, msg:'두 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-b)>0.06) return {ok:false, msg:'구간은 '+r[3]+' 입니다 — 오른쪽 끝만 적으세요.'};
     if(Math.abs(got[1]-v)>1e-4) return {ok:false, msg:'정적분 값은 '+r[4]+' 입니다.'};
     if(pick!==0)
       return {ok:false, msg:'u = x 일 때는 «'+mem.rest+'», u = eˣ 일 때는 «'+mem.rest2+'» 가 남았습니다. 어느 쪽이 풀 만한가요? 다시 고르세요.'};
     return {ok:true, msg:'판단했습니다 — <b>답은 같지만 가는 길의 수고가 다릅니다.</b> x 는 미분하면 1 이 되어 사라지고, eˣ 는 미분해도 그대로라 남는 적분이 더 복잡해집니다.'};
   }}""")
 +
 note(184, '내가 돌리고 · 내가 곱하고 · 내가 판단한다',
 """  {t:'기록 — <b>② 등속 원운동</b> 에서 세 값을 적으세요',
   f:'속력 = {0} · |a| = {1} · v · a = {2}',
   chk(got, r, mem){
     if(!r) return {ok:false, msg:'아직 화면 값이 없습니다.'};
     if(String(r[0])!=='원운동') return {ok:false, msg:'「② 등속 원운동」을 고르세요 (지금 «'+r[0]+'»).'};
     const sp=noteNum(r[2]), aa=noteNum(r[3]), dot=noteNum(r[4]);
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-sp)>1e-3||Math.abs(got[1]-aa)>1e-3)
       return {ok:false, msg:'화면은 속력 '+r[2]+' · |a| '+r[3]+' 입니다.'};
     if(Math.abs(got[2]-dot)>1e-3) return {ok:false, msg:'v · a 는 '+r[4]+' 입니다.'};
     mem.sp=sp; mem.t=noteNum(r[1]);
     return {ok:true, msg:'기록했습니다 — 가속도가 0 이 아닌데 내적은 0 입니다. t 를 옮겨도 그럴까요?'};
   }}""",
 """  {t:'생각 — t 를 <b>크게 옮겨</b> 세 값을 다시 적으세요',
   f:'새 t = {0} · 속력 = {1} · v · a = {2}',
   chk(got, r, mem){
     if(mem.sp===undefined) return {ok:false, msg:'① 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     if(String(r[0])!=='원운동') return {ok:false, msg:'「② 등속 원운동」을 고른 채로 하세요.'};
     const t=noteNum(r[1]), sp=noteNum(r[2]), dot=noteNum(r[4]);
     if(Math.abs(t-mem.t)<0.5) return {ok:false, msg:'t 가 거의 그대로입니다 — 더 옮기세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-t)>0.03) return {ok:false, msg:'t 는 '+r[1]+' 입니다.'};
     if(Math.abs(got[1]-sp)>1e-3) return {ok:false, msg:'속력은 '+r[2]+' 입니다.'};
     if(Math.abs(got[2]-dot)>1e-3) return {ok:false, msg:'v · a 는 '+r[4]+' 입니다.'};
     if(Math.abs(sp-mem.sp)>1e-2) return {ok:false, msg:'속력이 달라졌습니다 — 등속 원운동인지 확인하세요.'};
     mem.ok2=true;
     return {ok:true, msg:'계산했습니다 — 어디로 옮겨도 속력은 그대로이고 내적은 0 입니다.'};
   }}""",
 """  {t:'판단 — <b>① 포물선 운동</b> 으로 바꾼 뒤 고르세요',
   f:'속력 = {0} · |a| = {1} · v · a = {2}',
   opts:['가속도가 속도에 <b>수직</b> 이면 속력(크기)은 그대로이고 <b>방향만</b> 바뀐다 — 속력이 일정해도 가속도는 0 이 아니다',
         '속력이 변하지 않으면 가속도는 0 이다',
         '가속도의 크기가 0 이 아니면 속력도 반드시 변한다'],
   chk(got, r, mem, pick){
     if(!mem.ok2) return {ok:false, msg:'② 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     if(String(r[0])==='원운동') return {ok:false, msg:'「① 포물선 운동」으로 바꾸세요.'};
     const sp=noteNum(r[2]), aa=noteNum(r[3]), dot=noteNum(r[4]);
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-sp)>1e-3||Math.abs(got[1]-aa)>1e-3)
       return {ok:false, msg:'지금은 속력 '+r[2]+' · |a| '+r[3]+' 입니다.'};
     if(Math.abs(got[2]-dot)>1e-3) return {ok:false, msg:'v · a 는 '+r[4]+' 입니다.'};
     if(pick!==0)
       return {ok:false, msg:'원운동에서는 속력 '+mem.sp+' 가 그대로였는데도 |a| 가 0 이 아니었습니다. 다시 고르세요.'};
     return {ok:true, msg:'판단했습니다 — <b>가속도는 「빨라짐」이 아니라 「속도 벡터의 변화」</b> 입니다. 그래서 등속 원운동에도 가속도가 있고, 그 힘을 우리는 원심력으로 느낍니다.'};
   }}""")
 +
 note(185, '내가 잇고 · 내가 잘게 쪼개고 · 내가 판단한다',
 """  {t:'기록 — 조각 수를 <b>적게</b> 두고 적으세요',
   f:'n = {0} · 이은 길이 = {1} · 오차 = {2}',
   chk(got, r, mem){
     if(!r) return {ok:false, msg:'아직 화면 값이 없습니다.'};
     const n=noteNum(r[0]), L=noteNum(r[3]), e=noteNum(r[4]);
     if(n>12) return {ok:false, msg:'①은 조각을 12개 이하로 두고 적습니다 — 늘리는 것은 ②에서 합니다.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-n)>0.5) return {ok:false, msg:'n 은 '+r[0]+' 입니다.'};
     if(Math.abs(got[1]-L)>1e-5||Math.abs(got[2]-e)>1e-5)
       return {ok:false, msg:'화면은 이은 길이 '+r[3]+' · 오차 '+r[4]+' 입니다.'};
     mem.n=n; mem.L=L; mem.e=e; mem.b=noteNum(r[1]);
     return {ok:true, msg:'기록했습니다 — 꺾은선이 곡선 안쪽을 가로질러 조금 짧습니다. 더 쪼개 봅시다.'};
   }}""",
 """  {t:'생각 — 조각 수를 <b>다섯 배 넘게</b> 늘리세요',
   f:'새 n = {0} · 이은 길이 = {1} · ①보다 길어졌으면 1, 아니면 0 → {2}',
   chk(got, r, mem){
     if(mem.n===undefined) return {ok:false, msg:'① 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const n=noteNum(r[0]), b=noteNum(r[1]), L=noteNum(r[3]);
     if(Math.abs(b-mem.b)>0.06) return {ok:false, msg:'오른쪽 끝 b 는 ①과 같은 '+mem.b+' 로 두세요.'};
     if(!(n >= mem.n*5)) return {ok:false, msg:'n 이 '+r[0]+' 입니다. ①의 '+mem.n+' 의 다섯 배 넘게 늘리세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-n)>0.5||Math.abs(got[1]-L)>1e-5)
       return {ok:false, msg:'지금은 n = '+r[0]+' · 길이 '+r[3]+' 입니다.'};
     if(Math.abs(got[2]-(L>mem.L?1:0))>0.01) return {ok:false, msg:'①의 길이 '+mem.L+' 와 견주어 보세요.'};
     mem.L2=L; mem.ok2=true;
     return {ok:true, msg:'계산했습니다 — 쪼갤수록 길어지며 참값에 다가갑니다 (아래에서 올라옵니다).'};
   }}""",
 """  {t:'판단 — 오른쪽 끝 b 를 <b>바꿔</b> 본 뒤 고르세요',
   f:'새 b = {0} · 이은 길이 = {1} · 오차가 양수면 1, 음수면 0 → {2}',
   opts:['한 조각이 √(Δx² + Δy²) 이므로 합의 극한이 <b>∫√(1 + (y′)²) dx</b> — 두 점 사이 최단은 직선이라 꺾은선은 늘 짧다',
         '조각을 늘리면 길이가 줄어들어 참값에 다가간다',
         '꺾은선의 길이가 참값보다 길 수도 있다'],
   chk(got, r, mem, pick){
     if(!mem.ok2) return {ok:false, msg:'② 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const b=noteNum(r[1]), L=noteNum(r[3]), e=noteNum(r[4]);
     if(Math.abs(b-mem.b)<0.2) return {ok:false, msg:'b 가 거의 그대로입니다 — 바꿔 보세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-b)>0.06||Math.abs(got[1]-L)>1e-5)
       return {ok:false, msg:'지금은 b = '+r[1]+' · 길이 '+r[3]+' 입니다.'};
     if(Math.abs(got[2]-1)>0.01) return {ok:false, msg:'화면의 오차 '+r[4]+' 는 「참값 − 이은 길이」의 크기입니다 — 이은 길이가 늘 짧으니 몇일까요?'};
     if(pick!==0)
       return {ok:false, msg:'n 을 '+mem.n+' 에서 늘리자 길이가 '+mem.L+' → '+mem.L2+' 로 <b>늘어나며</b> 참값에 다가갔습니다. 다시 고르세요.'};
     return {ok:true, msg:'판단했습니다 — <b>잘게 쪼개 직선으로 잇고, 더해, 극한을 본다.</b> 넓이·부피에서 쓴 그 틀이 길이에도 그대로 쓰입니다.'};
   }}""")
 +
 note(186, '내가 규칙을 고르고 · 내가 기르고 · 내가 판단한다',
 """  {t:'기록 — <b>① y′ = 0.6</b> 에서 t = 6 의 값을 적으세요',
   f:'y(0) = {0} · t = 6 의 y = {1} · 늘어난 양 = {2}',
   chk(got, r, mem){
     if(!r) return {ok:false, msg:'아직 화면 값이 없습니다.'};
     if(String(r[0]).indexOf('0.6y')>=0||String(r[0]).indexOf('로지스틱')>=0)
       return {ok:false, msg:'「① y′ = 0.6」 을 고르세요 (지금 «'+r[0]+'»).'};
     const y0=noteNum(r[1]), y6=noteNum(r[2]);
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-y0)>0.06) return {ok:false, msg:'y(0) 은 '+r[1]+' 입니다.'};
     if(Math.abs(got[1]-y6)>0.02) return {ok:false, msg:'t = 6 의 y 는 '+r[2]+' 입니다.'};
     if(Math.abs(got[2]-(y6-y0))>0.05) return {ok:false, msg:'끝 값에서 출발값을 빼세요 — 0.6 × 6 과 견주어 보세요.'};
     mem.y0=y0; mem.lin=y6;
     return {ok:true, msg:'기록했습니다 — 일정하게 늘어 0.6 × 6 = 3.6 만큼 커졌습니다. 규칙을 바꿔 봅시다.'};
   }}""",
 """  {t:'생각 — <b>② y′ = 0.6y</b> 로 바꾸세요 (출발값은 그대로)',
   f:'t = 6 의 y = {0} · ①의 값의 몇 배인가 = {1}',
   chk(got, r, mem){
     if(mem.y0===undefined) return {ok:false, msg:'① 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     if(String(r[0]).indexOf('0.6y')<0) return {ok:false, msg:'「② y′ = 0.6y」 를 고르세요 (지금 «'+r[0]+'»).'};
     const y0=noteNum(r[1]), y6=noteNum(r[2]);
     if(Math.abs(y0-mem.y0)>0.06) return {ok:false, msg:'출발값은 ①과 같은 '+mem.y0+' 로 두세요.'};
     if(![0,1].every(j=>isFinite(got[j]))) return {ok:false, msg:'두 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-y6)>0.05) return {ok:false, msg:'t = 6 의 y 는 '+r[2]+' 입니다.'};
     if(Math.abs(got[1]-y6/mem.lin)>0.6) return {ok:false, msg:'①의 '+mem.lin+' 로 나누어 보세요.'};
     mem.exp=y6; mem.ok2=true;
     return {ok:true, msg:'계산했습니다 — 같은 출발값인데 미래가 크게 갈렸습니다.'};
   }}""",
 """  {t:'판단 — <b>③ 한계가 있는 성장</b> 으로 바꾼 뒤 고르세요',
   f:'t = 6 의 y = {0} · 한계값 = {1}',
   opts:['미분방정식은 <b>「지금 값」이 아니라 「변하는 규칙」</b> 을 적는다 — 같은 출발값도 규칙이 다르면 다른 미래가 된다',
         '출발값이 같으면 미래도 같다',
         '변화율이 크면 언제나 더 커진다'],
   chk(got, r, mem, pick){
     if(!mem.ok2) return {ok:false, msg:'② 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     if(String(r[0]).indexOf('로지스틱')<0) return {ok:false, msg:'「③ 한계가 있는 성장」 을 고르세요 (지금 «'+r[0]+'»).'};
     const y6=noteNum(r[2]), lim=noteNum(r[4]);
     if(![0,1].every(j=>isFinite(got[j]))) return {ok:false, msg:'두 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-y6)>0.05) return {ok:false, msg:'t = 6 의 y 는 '+r[2]+' 입니다.'};
     if(Math.abs(got[1]-lim)>0.1) return {ok:false, msg:'화면의 한계는 '+r[4]+' 입니다.'};
     if(!(y6<lim)) return {ok:false, msg:'한계를 넘었습니다 — 화면을 다시 보세요.'};
     if(pick!==0)
       return {ok:false, msg:'같은 출발값 '+mem.y0+' 에서 '+mem.lin+' · '+mem.exp+' · '+r[2]+' 로 갈렸습니다. 무엇이 달랐나요? 다시 고르세요.'};
     return {ok:true, msg:'판단했습니다 — <b>미래를 정하는 것은 지금 값이 아니라 변하는 규칙</b> 입니다. 전염병·인구·냉각·이자가 모두 미분방정식 한 줄로 적히고, 그 한 줄이 모든 것을 가릅니다.'};
   }}""")
 +
 note(187, '내가 긋고 · 내가 옮기고 · 내가 판단한다',
 """  {t:'기록 — <b>AND 또는 OR</b> 에서 네 점을 모두 맞혀 보세요',
   f:'w₁ = {0} · w₂ = {1} · θ = {2} · 맞힌 수 = {3}',
   chk(got, r, mem){
     if(!r) return {ok:false, msg:'아직 화면 값이 없습니다.'};
     const k=String(r[0]), w1=noteNum(r[1]), w2=noteNum(r[2]), th=noteNum(r[3]), n=noteNum(r[4]);
     if(k.indexOf('XOR')>=0) return {ok:false, msg:'①은 AND 나 OR 에서 합니다 — XOR 은 ③에서 봅니다.'};
     if(n!==4) return {ok:false, msg:'아직 '+r[4]+'개입니다. 「이 문제에 맞는 값 찾아 주기」를 누르거나 직접 맞추세요.'};
     if(![0,1,2,3].every(j=>isFinite(got[j]))) return {ok:false, msg:'네 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-w1)>0.06||Math.abs(got[1]-w2)>0.06||Math.abs(got[2]-th)>0.06)
       return {ok:false, msg:'화면은 w₁ '+r[1]+' · w₂ '+r[2]+' · θ '+r[3]+' 입니다.'};
     if(Math.abs(got[3]-4)>0.5) return {ok:false, msg:'맞힌 수는 '+r[4]+' 입니다.'};
     mem.k=k; mem.n=4;
     return {ok:true, msg:'기록했습니다 — 직선 하나로 네 점이 갈라졌습니다. XOR 도 될까요?'};
   }}""",
 """  {t:'생각 — <b>③ XOR</b> 로 바꾸고 <b>가장 많이</b> 맞혀 보세요',
   f:'맞힌 수 = {0} · ①보다 몇 개 모자란가 = {1}',
   chk(got, r, mem){
     if(mem.k===undefined) return {ok:false, msg:'① 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const k=String(r[0]), n=noteNum(r[4]);
     if(k.indexOf('XOR')<0) return {ok:false, msg:'「③ XOR」 로 바꾸세요 (지금 «'+r[0]+'»).'};
     if(n<3) return {ok:false, msg:'아직 '+r[4]+'개입니다 — 가중치를 움직여 3개까지 맞혀 보세요.'};
     if(![0,1].every(j=>isFinite(got[j]))) return {ok:false, msg:'두 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-n)>0.5) return {ok:false, msg:'맞힌 수는 '+r[4]+' 입니다.'};
     if(Math.abs(got[1]-(4-n))>0.5) return {ok:false, msg:'4 에서 지금 맞힌 수를 빼세요.'};
     mem.xor=n; mem.ok2=true;
     return {ok:true, msg:'계산했습니다 — 3개까지는 되는데 네 번째가 끝내 안 됩니다.'};
   }}""",
 """  {t:'판단 — 가중치를 <b>크게 바꿔</b> 더 해 본 뒤 고르세요',
   f:'w₁ = {0} · w₂ = {1} · 맞힌 수 = {2}',
   opts:['w₁x₁ + w₂x₂ = θ 는 <b>직선</b> 이다 — XOR 의 1 인 두 점이 대각선에 있어 직선 하나로는 갈라지지 않는다',
         '가중치를 더 크게 하면 XOR 도 풀 수 있다',
         'XOR 은 점이 네 개뿐이라 원래 풀 수 없는 문제다'],
   chk(got, r, mem, pick){
     if(!mem.ok2) return {ok:false, msg:'② 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const k=String(r[0]), w1=noteNum(r[1]), w2=noteNum(r[2]), n=noteNum(r[4]);
     if(k.indexOf('XOR')<0) return {ok:false, msg:'「③ XOR」 을 고른 채로 하세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-w1)>0.06||Math.abs(got[1]-w2)>0.06)
       return {ok:false, msg:'지금은 w₁ '+r[1]+' · w₂ '+r[2]+' 입니다.'};
     if(Math.abs(got[2]-n)>0.5) return {ok:false, msg:'맞힌 수는 '+r[4]+' 입니다.'};
     if(n>3) return {ok:false, msg:'4개를 맞혔다면 XOR 이 아닙니다 — 문제를 확인하세요.'};
     if(pick!==0)
       return {ok:false, msg:'가중치를 아무리 바꿔도 '+mem.xor+'개를 넘지 못했습니다. 식이 그리는 것이 무엇인지 보고 다시 고르세요.'};
     return {ok:true, msg:'판단했습니다 — <b>퍼셉트론 하나는 직선 하나</b> 입니다. 이 한계가 1969년 인공지능의 겨울을 불렀고, 층을 쌓아 직선을 여러 개 쓰는 다층 신경망이 그 벽을 넘었습니다.'};
   }}""")
 +
 note(188, '내가 재고 · 내가 속아 보고 · 내가 판단한다',
 """  {t:'기록 — 재현율과 오경보율을 <b>모두 0</b> 으로 내리세요',
   f:'양성 비율 = {0} · 재현율 = {1} · 정확도 = {2}',
   chk(got, r, mem){
     if(!r) return {ok:false, msg:'아직 화면 값이 없습니다.'};
     const p=noteNum(r[0]), rec=noteNum(r[1]), fpr=noteNum(r[2]), acc=noteNum(r[3]);
     if(!(rec===0 && fpr===0)) return {ok:false, msg:'재현율과 오경보율을 모두 0 으로 내리세요 (지금 '+r[1]+', '+r[2]+').'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-p)>0.5) return {ok:false, msg:'양성 비율은 '+r[0]+' 입니다.'};
     if(Math.abs(got[1])>0.5) return {ok:false, msg:'재현율은 '+r[1]+' 입니다.'};
     if(Math.abs(got[2]-acc)>0.15) return {ok:false, msg:'정확도는 '+r[3]+' 입니다.'};
     mem.p=p; mem.acc0=acc;
     return {ok:true, msg:'기록했습니다 — 한 명도 못 잡았는데 정확도가 '+r[3]+' 입니다.'};
   }}""",
 """  {t:'생각 — <b>100 − 양성 비율</b> 을 구해 그 정확도와 맞추세요',
   f:'100 − 양성 비율 = {0} · ①의 정확도 = {1} · 두 값의 차 = {2}',
   chk(got, r, mem){
     if(mem.p===undefined) return {ok:false, msg:'① 칸을 먼저 통과하세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-(100-mem.p))>0.5) return {ok:false, msg:'100 에서 ①의 양성 비율 '+mem.p+' 를 빼세요.'};
     if(Math.abs(got[1]-mem.acc0)>0.15) return {ok:false, msg:'①의 정확도는 '+mem.acc0+' 였습니다.'};
     if(Math.abs(got[2])>0.3) return {ok:false, msg:'두 값을 빼 보세요. 거의 0 이어야 합니다.'};
     mem.ok2=true;
     return {ok:true, msg:'계산했습니다 — 「전부 음성」의 정확도는 곧 음성의 비율입니다. 드물수록 높아집니다.'};
   }}""",
 """  {t:'판단 — 재현율을 <b>90% 이상</b> 으로 올린 뒤 고르세요',
   f:'재현율 = {0} · 정확도 = {1} · ①의 정확도보다 몇 %p 올랐나 = {2}',
   opts:['드문 일에서는 <b>정확도가 거의 변하지 않는다</b> — 재현율·정밀도를 함께 보아야 모형의 쓸모를 알 수 있다',
         '정확도가 높으면 좋은 모형이다',
         '재현율을 올리면 정확도가 크게 오른다'],
   chk(got, r, mem, pick){
     if(!mem.ok2) return {ok:false, msg:'② 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const rec=noteNum(r[1]), acc=noteNum(r[3]);
     if(!(rec>=90)) return {ok:false, msg:'재현율을 90% 이상으로 올리세요 (지금 '+r[1]+').'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-rec)>0.5) return {ok:false, msg:'재현율은 '+r[1]+' 입니다.'};
     if(Math.abs(got[1]-acc)>0.15) return {ok:false, msg:'정확도는 '+r[3]+' 입니다.'};
     if(Math.abs(got[2]-(acc-mem.acc0))>0.3) return {ok:false, msg:'①의 정확도 '+mem.acc0+' 를 빼세요.'};
     if(pick!==0)
       return {ok:false, msg:'아무도 못 잡는 모형이 '+mem.acc0+', 거의 다 잡는 모형이 '+r[3]+' — 정확도 차이가 겨우 이만큼입니다. 다시 고르세요.'};
     return {ok:true, msg:'판단했습니다 — <b>정확도 하나로는 드문 일을 다루는 모형을 가릴 수 없습니다.</b> 암 진단·사기 탐지·불량 검출처럼 「드물지만 중요한 것」에는 재현율과 정밀도를 함께 봐야 합니다.'};
   }}""")
 +
 note(189, '내가 세고 · 내가 바꾸고 · 내가 판단한다',
 """  {t:'기록 — 같은 단어가 <b>두 번</b> 나오는 문장을 골라 <b>원-핫</b> 으로 적으세요',
   f:'크기 = {0} · 0 이 아닌 자리 = {1}',
   chk(got, r, mem){
     if(!r) return {ok:false, msg:'아직 화면 값이 없습니다.'};
     if(String(r[1]).indexOf('원-핫')<0) return {ok:false, msg:'방식을 「원-핫」으로 두세요 (지금 «'+r[1]+'»).'};
     const vecs=(String(r[2]).match(/\\d+/g)||[]).map(Number);
     const sz=noteNum(r[3]), nz=noteNum(r[4]);
     if(!vecs.length) return {ok:false, msg:'화면의 벡터를 읽을 수 없습니다 — 다시 골라 보세요.'};
     if(![0,1].every(j=>isFinite(got[j]))) return {ok:false, msg:'두 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-sz)>1e-3) return {ok:false, msg:'크기는 '+r[3]+' 입니다.'};
     if(Math.abs(got[1]-nz)>0.5) return {ok:false, msg:'0 이 아닌 자리는 '+r[4]+' 개입니다.'};
     mem.si=String(r[0]); mem.one=sz; mem.nz=nz;
     return {ok:true, msg:'기록했습니다 — 같은 문장을 빈도수로 바꾸면 달라질까요?'};
   }}""",
 """  {t:'생각 — <b>같은 문장</b> 을 <b>빈도수</b> 로 바꿔 적으세요',
   f:'크기 = {0} · ①의 크기와의 차 = {1} · 0 이 아닌 자리 = {2}',
   chk(got, r, mem){
     if(mem.si===undefined) return {ok:false, msg:'① 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     if(String(r[0])!==mem.si) return {ok:false, msg:'문장은 ①과 같은 «'+mem.si+'» 으로 두세요 — 방식만 바꿉니다.'};
     if(String(r[1]).indexOf('빈도수')<0) return {ok:false, msg:'방식을 「빈도수」로 바꾸세요 (지금 «'+r[1]+'»).'};
     const sz=noteNum(r[3]), nz=noteNum(r[4]);
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-sz)>1e-3) return {ok:false, msg:'크기는 '+r[3]+' 입니다.'};
     if(Math.abs(got[1]-(sz-mem.one))>2e-3) return {ok:false, msg:'①의 크기 '+mem.one+' 와의 차를 적으세요.'};
     if(Math.abs(got[2]-nz)>0.5) return {ok:false, msg:'0 이 아닌 자리는 '+r[4]+' 개입니다.'};
     if(Math.abs(nz-mem.nz)>0.5) return {ok:false, msg:'자리 수가 달라졌습니다 — 같은 문장인지 확인하세요.'};
     mem.cnt=sz; mem.ok2=true;
     return {ok:true, msg:'계산했습니다 — 자리 수는 같은데 크기가 커졌습니다. 반복이 값에 남은 것입니다.'};
   }}""",
 """  {t:'판단 — 단어가 <b>겹치지 않는</b> 문장을 골라 두 방식을 견준 뒤 고르세요',
   f:'원-핫 크기 = {0} · 빈도수 크기 = {1} · 두 값의 차 = {2}',
   opts:['두 방식은 <b>반복을 담느냐 버리느냐</b> 로 갈린다 — 겹치는 단어가 없으면 둘이 같아지고, 어순은 어느 쪽도 담지 못한다',
         '원-핫과 빈도수는 언제나 같은 벡터를 준다',
         '빈도수 벡터는 어순까지 담을 수 있다'],
   chk(got, r, mem, pick){
     if(!mem.ok2) return {ok:false, msg:'② 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     if(String(r[0])===mem.si) return {ok:false, msg:'다른 문장을 고르세요 — 같은 단어가 겹치지 않는 문장이 있습니다.'};
     const sz=noteNum(r[3]);
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[2]-(got[1]-got[0]))>2e-3) return {ok:false, msg:'셋째 칸은 둘째에서 첫째를 뺀 값입니다.'};
     if(Math.abs(got[2])>2e-3)
       return {ok:false, msg:'두 방식의 크기가 같은 문장을 고르세요 — 같은 단어가 두 번 나오지 않는 문장입니다.'};
     if(Math.abs(got[1]-sz)>1e-3) return {ok:false, msg:'지금 화면의 크기는 '+r[3]+' 입니다 — 방식을 맞춰 두 값을 각각 읽으세요.'};
     if(pick!==0)
       return {ok:false, msg:'반복이 있던 문장에서는 '+mem.one+' 와 '+mem.cnt+' 로 달랐는데, 지금은 같아졌습니다. 무엇이 둘을 갈랐나요? 다시 고르세요.'};
     return {ok:true, msg:'판단했습니다 — <b>숫자로 바꾸는 순간 무엇을 담고 무엇을 버릴지 고르게 됩니다.</b> 둘 다 어순을 버리기 때문에 「개가 사람을 물다」와 「사람이 개를 물다」가 같은 벡터가 됩니다.'};
   }}""")
 +
 note(190, '내가 세고 · 내가 깎고 · 내가 판단한다',
 """  {t:'기록 — 방식을 <b>② 빈도수만</b> 으로 두고 1등을 적으세요',
   f:'영화 TF = {0} · 영화 DF = {1} · 1등 단어가 「영화」이면 1, 아니면 0 → {2}',
   chk(got, r, mem){
     if(!r) return {ok:false, msg:'아직 화면 값이 없습니다.'};
     if(String(r[0])!=='TF') return {ok:false, msg:'방식을 「② 빈도수만 (TF)」 으로 두세요 (지금 «'+r[0]+'»).'};
     const tf=noteNum(r[1]), df=noteNum(r[2]);
     const isMovie=(String(r[4])==='영화')?1:0;
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-tf)>0.5||Math.abs(got[1]-df)>0.5)
       return {ok:false, msg:'화면은 TF '+r[1]+' · DF '+r[2]+' 입니다.'};
     if(Math.abs(got[2]-isMovie)>0.01) return {ok:false, msg:'화면의 1등 단어는 «'+r[4]+'» 입니다.'};
     mem.top=String(r[4]); mem.df=df;
     return {ok:true, msg:'기록했습니다 — 빈도수만 보면 1등이 «'+mem.top+'» 입니다. IDF 를 붙여 봅시다.'};
   }}""",
 """  {t:'생각 — 방식을 <b>① TF × IDF</b> 로 바꾸고 IDF 를 손으로 구하세요',
   f:'10 ÷ DF = {0} · 그 자연로그(IDF) = {1} · 1등 단어가 바뀌었으면 1, 아니면 0 → {2}',
   chk(got, r, mem){
     if(mem.top===undefined) return {ok:false, msg:'① 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     if(String(r[0])!=='TF-IDF') return {ok:false, msg:'방식을 「① TF × IDF」 로 바꾸세요 (지금 «'+r[0]+'»).'};
     const df=noteNum(r[2]), idf=noteNum(r[3]);
     if(Math.abs(df-mem.df)>0.5) return {ok:false, msg:'DF 는 ①과 같은 '+mem.df+' 로 두세요 — 방식만 바꿉니다.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-10/df)>0.05) return {ok:false, msg:'10 을 DF = '+r[2]+' 로 나누세요.'};
     if(Math.abs(got[1]-idf)>0.01) return {ok:false, msg:'그 값의 자연로그를 구하세요 — 화면의 IDF 는 '+r[3]+' 입니다.'};
     const changed=(String(r[4])!==mem.top)?1:0;
     if(Math.abs(got[2]-changed)>0.01) return {ok:false, msg:'지금 1등은 «'+r[4]+'», ①에서는 «'+mem.top+'» 였습니다.'};
     mem.ok2=true;
     return {ok:true, msg:'계산했습니다 — IDF 가 흔한 단어의 점수를 깎습니다.'};
   }}""",
 """  {t:'판단 — 「영화」의 문서 수를 <b>10</b> 으로 올린 뒤 고르세요',
   f:'DF = {0} · IDF = {1} · 1등 단어가 「영화」이면 1, 아니면 0 → {2}',
   opts:['IDF = ln(전체 ÷ 그 단어가 나온 문서 수) — <b>모든 문서에 있으면 ln 1 = 0</b> 이 되어 아무리 자주 나와도 점수가 0 이 된다',
         '자주 나오는 단어일수록 그 글의 주제어다',
         'IDF 는 단어의 길이에 따라 정해진다'],
   chk(got, r, mem, pick){
     if(!mem.ok2) return {ok:false, msg:'② 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     if(String(r[0])!=='TF-IDF') return {ok:false, msg:'방식은 「① TF × IDF」 로 둔 채 하세요.'};
     const df=noteNum(r[2]), idf=noteNum(r[3]);
     if(df!==10) return {ok:false, msg:'문서 수를 10 으로 올리세요 (지금 '+r[2]+').'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-df)>0.5) return {ok:false, msg:'DF 는 '+r[2]+' 입니다.'};
     if(Math.abs(got[1]-idf)>0.01) return {ok:false, msg:'IDF 는 '+r[3]+' 입니다.'};
     if(Math.abs(got[2]-((String(r[4])==='영화')?1:0))>0.01)
       return {ok:false, msg:'지금 1등 단어는 «'+r[4]+'» 입니다.'};
     if(pick!==0)
       return {ok:false, msg:'빈도수가 가장 큰데도 IDF 가 '+r[3]+' 이라 1등을 놓쳤습니다. IDF 가 무엇을 재는지 보고 다시 고르세요.'};
     return {ok:true, msg:'판단했습니다 — <b>「모두가 쓰는 말은 구별에 쓸모없다」가 식으로 적힌 것</b> 이 IDF 입니다. 검색엔진이 「그리고」·「입니다」를 무시하는 것도 같은 이치입니다.'};
   }}""")
)
