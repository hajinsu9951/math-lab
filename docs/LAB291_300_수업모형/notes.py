# -*- coding: utf-8 -*-
"""LAB 291~300 탐구 노트 — 기록 → 생각 → 판단. 판정은 화면의 read() 값으로만 한다."""


def note(no, head, c1, c2, c3):
    return "\n %d:{ h:'%s',\n  c:[\n%s,\n%s,\n%s\n ]},\n" % (no, head, c1, c2, c3)


NOTES = (
 note(291, '내가 그리고 · 내가 세고 · 내가 판단한다',
 """  {t:'기록 — <b>직선을 하나만</b> 그려 두고 적으세요',
   f:'점의 위치 = {0} · 그린 직선 수 = {1}',
   chk(got, r, mem){
     if(!r) return {ok:false, msg:'아직 화면 값이 없습니다.'};
     const p=noteNum(r[0]), n=noteNum(r[2]);
     if(!(n<=2)) return {ok:false, msg:'직선이 '+r[2]+' 개입니다 — ②에서 늘릴 테니 지금은 1~2 개로 두세요.'};
     if(![0,1].every(j=>isFinite(got[j]))) return {ok:false, msg:'두 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-p)>0.03) return {ok:false, msg:'점의 위치는 '+r[0]+' 입니다.'};
     if(Math.abs(got[1]-n)>0.5) return {ok:false, msg:'그린 직선 수는 '+r[2]+' 입니다.'};
     mem.n1=n;
     return {ok:true, msg:'기록했습니다 — 유클리드에서는 여기까지가 전부입니다. 더 그려 봅시다.'};
   }}""",
 """  {t:'생각 — <b>직선을 4 개 이상</b> 으로 늘리고 적으세요',
   f:'그린 직선 수 = {0} · 유클리드에서는 = {1} · 그 차 = {2}',
   chk(got, r, mem){
     if(mem.n1===undefined) return {ok:false, msg:'① 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const n=noteNum(r[2]), e=noteNum(r[3]);
     if(!(n>=4)) return {ok:false, msg:'직선이 '+r[2]+' 개입니다 — 4 개 이상으로 늘리세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-n)>0.5) return {ok:false, msg:'그린 직선 수는 '+r[2]+' 입니다.'};
     if(Math.abs(got[1]-e)>0.5) return {ok:false, msg:'유클리드에서는 '+r[3]+' 입니다.'};
     if(Math.abs(got[2]-(n-e))>0.5) return {ok:false, msg:'두 수의 차를 적으세요.'};
     mem.n2=n; mem.ok2=true;
     return {ok:true, msg:'계산했습니다 — 모두 기준 직선과 만나지 않습니다. 더 그릴 수도 있습니다.'};
   }}""",
 """  {t:'판단 — 두 세계를 나란히 두고 고르세요',
   f:'①의 직선 수 = {0} · ②의 직선 수 = {1} · 유클리드에서 가능한 수 = {2}',
   opts:['평행선 공준은 <b>증명된 정리가 아니라 약속</b> 이다 — 그것만 바꾸면 한 점을 지나 만나지 않는 직선이 무한히 많은 기하가 모순 없이 열린다',
         '쌍곡기하는 그림을 잘못 그린 것일 뿐 실제로는 평행선이 하나다',
         '평행선이 하나라는 것은 다른 공리에서 증명된다'],
   chk(got, r, mem, pick){
     if(!mem.ok2) return {ok:false, msg:'② 칸을 먼저 통과하세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-mem.n1)>0.5) return {ok:false, msg:'①에 적은 '+mem.n1+' 입니다.'};
     if(Math.abs(got[1]-mem.n2)>0.5) return {ok:false, msg:'②에 적은 '+mem.n2+' 입니다.'};
     if(Math.abs(got[2]-1)>0.1) return {ok:false, msg:'유클리드에서는 몇 개였나요?'};
     if(pick!==0)
       return {ok:false, msg:'원판 안에서는 만나지 않는 직선을 얼마든지 그릴 수 있었습니다. 무엇이 달랐을까요? 다시 고르세요.'};
     return {ok:true, msg:'판단했습니다 — <b>약속을 바꾸면 다른 기하가 열립니다.</b> 쌍곡기하에서는 평행선이 무한히 많고 삼각형의 내각의 합이 180°보다 작습니다. 상대성이론의 시공간도 이런 기하 위에 있습니다.'};
   }}""")
 +
 note(292, '내가 켜고 · 내가 바꾸고 · 내가 판단한다',
 """  {t:'기록 — <b>AND</b> 회로에서 <b>두 스위치를 모두 켜고</b> 적으세요',
   f:'A = {0} · B = {1} · 출력 = {2}',
   chk(got, r, mem){
     if(!r) return {ok:false, msg:'아직 화면 값이 없습니다.'};
     const a=noteNum(r[1]), b=noteNum(r[2]), o=noteNum(r[3]), c=noteNum(r[4]);
     if(String(r[0])!=='AND') return {ok:false, msg:'지금은 «'+r[0]+'» 입니다 — AND 로 두세요.'};
     if(!(a===1&&b===1)) return {ok:false, msg:'두 스위치를 모두 켜세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-a)>0.1||Math.abs(got[1]-b)>0.1) return {ok:false, msg:'A 와 B 는 '+r[1]+' 과 '+r[2]+' 입니다.'};
     if(Math.abs(got[2]-o)>0.1) return {ok:false, msg:'출력은 '+r[3]+' 입니다.'};
     mem.c1=c;
     return {ok:true, msg:'기록했습니다 — AND 는 둘 다 켜야 켜집니다. 계단 스위치는 어떨까요?'};
   }}""",
 """  {t:'생각 — 회로를 <b>XOR</b> 로 바꾸고 (스위치는 둘 다 켠 채) 적으세요',
   f:'출력 = {0} · 켜지는 줄 = {1} · AND 의 켜지는 줄과의 차 = {2}',
   chk(got, r, mem){
     if(mem.c1===undefined) return {ok:false, msg:'① 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const o=noteNum(r[3]), c=noteNum(r[4]);
     if(String(r[0])!=='XOR') return {ok:false, msg:'지금은 «'+r[0]+'» 입니다 — XOR 로 바꾸세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-o)>0.1) return {ok:false, msg:'출력은 '+r[3]+' 입니다.'};
     if(Math.abs(got[1]-c)>0.1) return {ok:false, msg:'켜지는 줄은 '+r[4]+' 줄입니다.'};
     if(Math.abs(got[2]-(c-mem.c1))>0.1) return {ok:false, msg:'①의 '+mem.c1+' 줄을 빼면 얼마인가요?'};
     mem.c2=c; mem.ok2=true;
     return {ok:true, msg:'계산했습니다 — 둘 다 켰는데 오히려 꺼졌습니다. 이것이 계단 스위치입니다.'};
   }}""",
 """  {t:'판단 — 회로마다 켜지는 줄을 세어 보고 고르세요',
   f:'AND 의 켜지는 줄 = {0} · XOR 의 켜지는 줄 = {1} · NAND 의 켜지는 줄 = {2}',
   opts:['회로는 <b>네 줄의 출력</b> 으로 정해진다 — 켜지는 줄이 AND 는 1 줄, XOR 은 2 줄, NAND 는 3 줄이고, 계단 스위치처럼 「어느 쪽을 눌러도 바뀌는」 동작은 XOR 이다',
         '회로가 달라도 켜지는 줄의 수는 모두 같다',
         '스위치를 둘 다 켜면 어떤 회로든 전등이 켜진다'],
   chk(got, r, mem, pick){
     if(!mem.ok2) return {ok:false, msg:'② 칸을 먼저 통과하세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-mem.c1)>0.1) return {ok:false, msg:'①에서 본 '+mem.c1+' 줄입니다.'};
     if(Math.abs(got[1]-mem.c2)>0.1) return {ok:false, msg:'②에서 본 '+mem.c2+' 줄입니다.'};
     if(Math.abs(got[2]-3)>0.1) return {ok:false, msg:'NAND 는 둘 다 켰을 때만 꺼집니다 — 나머지 줄을 세어 보세요.'};
     if(pick!==0)
       return {ok:false, msg:'같은 스위치 상태인데 회로에 따라 출력이 달랐습니다. 무엇이 회로를 정할까요? 다시 고르세요.'};
     return {ok:true, msg:'판단했습니다 — <b>진리표가 곧 회로입니다.</b> 그리고 NAND 하나만 있으면 AND·OR·NOT 을 모두 만들 수 있어, 실제 반도체는 NAND 를 쌓아 올립니다.'};
   }}""")
 +
 note(293, '내가 겹치고 · 내가 바꾸고 · 내가 판단한다',
 """  {t:'기록 — <b>(A∪B)′ 과 A′∩B′</b> 을 겹쳐 보고 적으세요',
   f:'어긋난 구역 = {0} · 같으면 1, 다르면 0 → {1}',
   chk(got, r, mem){
     if(!r) return {ok:false, msg:'아직 화면 값이 없습니다.'};
     const d=noteNum(r[2]);
     if(!(d===0)) return {ok:false, msg:'어긋난 구역이 '+r[2]+' 입니다 — 오른쪽 식을 A′∩B′ 으로 두세요.'};
     if(![0,1].every(j=>isFinite(got[j]))) return {ok:false, msg:'두 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-d)>0.1) return {ok:false, msg:'어긋난 구역은 '+r[2]+' 입니다.'};
     if(Math.abs(got[1]-1)>0.1) return {ok:false, msg:'두 그림이 같으면 1 입니다.'};
     mem.d1=d;
     return {ok:true, msg:'기록했습니다 — 한 치도 어긋나지 않습니다. 기호를 바꾸지 않으면 어떨까요?'};
   }}""",
 """  {t:'생각 — 오른쪽 식을 <b>A′∪B′</b> 으로 바꾸고 적으세요',
   f:'어긋난 구역 = {0} · 같으면 1, 다르면 0 → {1}',
   chk(got, r, mem){
     if(mem.d1===undefined) return {ok:false, msg:'① 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const d=noteNum(r[2]);
     if(!(d>0)) return {ok:false, msg:'어긋난 구역이 '+r[2]+' 입니다 — 오른쪽 식을 A′∪B′ 으로 바꾸세요.'};
     if(![0,1].every(j=>isFinite(got[j]))) return {ok:false, msg:'두 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-d)>0.1) return {ok:false, msg:'어긋난 구역은 '+r[2]+' 입니다.'};
     if(Math.abs(got[1])>0.1) return {ok:false, msg:'두 그림이 다르면 0 입니다.'};
     mem.d2=d; mem.ok2=true;
     return {ok:true, msg:'계산했습니다 — 기호를 바꾸지 않았더니 '+r[2]+' 구역이 어긋납니다.'};
   }}""",
 """  {t:'판단 — 두 결과를 나란히 두고 고르세요',
   f:'①의 어긋난 구역 = {0} · ②의 어긋난 구역 = {1} · (A∩B)′ 과 같은 것이 A′∪B′ 이면 1, A′∩B′ 이면 0 → {2}',
   opts:['부정을 괄호 안으로 넣으면 <b>∪ 와 ∩ 이 서로 바뀐다</b> — (A∪B)′ = A′∩B′ 이고 (A∩B)′ = A′∪B′ 이다. 「둘 다는 아니다」와 「둘 다 아니다」가 다른 말인 것과 같다',
         '부정은 각 집합에만 붙이면 되고 기호는 그대로 둔다',
         '(A∪B)′ 과 A′∪B′ 은 어차피 같은 것이다'],
   chk(got, r, mem, pick){
     if(!mem.ok2) return {ok:false, msg:'② 칸을 먼저 통과하세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-mem.d1)>0.1) return {ok:false, msg:'①에 적은 '+mem.d1+' 입니다.'};
     if(Math.abs(got[1]-mem.d2)>0.1) return {ok:false, msg:'②에 적은 '+mem.d2+' 입니다.'};
     if(Math.abs(got[2]-1)>0.1) return {ok:false, msg:'∩ 의 부정은 ∪ 로 바뀝니다.'};
     if(pick!==0)
       return {ok:false, msg:'기호를 바꾼 짝만 한 치도 어긋나지 않았습니다. 규칙은 무엇일까요? 다시 고르세요.'};
     return {ok:true, msg:'판단했습니다 — <b>부정은 기호를 뒤집습니다.</b> 프로그램의 조건문을 뒤집을 때 and 를 or 로 바꾸지 않아 생기는 버그가 바로 이 자리입니다.'};
   }}""")
 +
 note(294, '내가 더하고 · 내가 빼고 · 내가 판단한다',
 """  {t:'기록 — <b>두 곳 겹침</b> 을 넣고 (세 곳 모두는 0 으로) 적으세요',
   f:'가·나 겹침 = {0} · 세 곳 모두 = {1} · 정확한 값 = {2}',
   chk(got, r, mem){
     if(!r) return {ok:false, msg:'아직 화면 값이 없습니다.'};
     const ab=noteNum(r[0]), abc=noteNum(r[3]), v=noteNum(r[4]);
     if(!(ab>=3)) return {ok:false, msg:'가·나 겹침이 '+r[0]+' 명입니다 — 3 명 이상 넣으세요.'};
     if(abc!==0) return {ok:false, msg:'세 곳 모두에 든 인원을 0 으로 두고 적으세요 — ②에서 넣을 것입니다.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-ab)>0.5) return {ok:false, msg:'가·나 겹침은 '+r[0]+' 명입니다.'};
     if(Math.abs(got[1]-abc)>0.5) return {ok:false, msg:'세 곳 모두는 '+r[3]+' 명입니다.'};
     if(Math.abs(got[2]-v)>0.5) return {ok:false, msg:'정확한 값은 '+r[4]+' 명입니다.'};
     mem.v1=v;
     return {ok:true, msg:'기록했습니다 — 두 번 센 사람을 빼냈습니다. 세 곳에 모두 든 사람은 어떨까요?'};
   }}""",
 """  {t:'생각 — <b>세 곳 모두에 3 명</b> 을 넣고 다시 적으세요',
   f:'세 곳 모두 = {0} · 정확한 값 = {1} · ①보다 얼마나 늘었나 = {2}',
   chk(got, r, mem){
     if(mem.v1===undefined) return {ok:false, msg:'① 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const abc=noteNum(r[3]), v=noteNum(r[4]);
     if(!(abc>=1)) return {ok:false, msg:'세 곳 모두가 '+r[3]+' 명입니다 — 1 명 이상 넣으세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-abc)>0.5) return {ok:false, msg:'세 곳 모두는 '+r[3]+' 명입니다.'};
     if(Math.abs(got[1]-v)>0.5) return {ok:false, msg:'정확한 값은 '+r[4]+' 명입니다.'};
     if(Math.abs(got[2]-(v-mem.v1))>0.5) return {ok:false, msg:'①의 '+mem.v1+' 명을 빼면 얼마인가요?'};
     mem.v2=v; mem.abc=abc; mem.ok2=true;
     return {ok:true, msg:'계산했습니다 — 세 곳에 든 사람 수만큼 그대로 늘었습니다.'};
   }}""",
 """  {t:'판단 — 그냥 더한 값과 견주고 고르세요',
   f:'①의 정확한 값 = {0} · ②의 정확한 값 = {1} · 그냥 더한 105 명과 ②의 차 = {2}',
   opts:['두 곳에 든 사람은 두 번 세어지니 <b>빼고</b>, 세 곳에 든 사람은 세 번 더했다가 세 번 빠져 <b>다시 더해야</b> 한다 — 그래서 더하고 빼고 다시 더한다',
         '겹친 사람을 모두 한 번씩만 빼면 된다',
         '세 곳에 든 사람은 어차피 적으니 무시해도 된다'],
   chk(got, r, mem, pick){
     if(!mem.ok2) return {ok:false, msg:'② 칸을 먼저 통과하세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-mem.v1)>0.5) return {ok:false, msg:'①에 적은 '+mem.v1+' 입니다.'};
     if(Math.abs(got[1]-mem.v2)>0.5) return {ok:false, msg:'②에 적은 '+mem.v2+' 입니다.'};
     if(Math.abs(got[2]-(105-mem.v2))>0.5) return {ok:false, msg:'105 에서 ②의 값을 빼세요.'};
     if(pick!==0)
       return {ok:false, msg:'세 곳에 든 사람을 다시 더했더니 값이 늘었습니다. 왜 다시 더해야 했을까요? 다시 고르세요.'};
     return {ok:true, msg:'판단했습니다 — <b>|A∪B∪C| = ΣA − Σ(둘) + (셋) 입니다.</b> 더하고 빼고 다시 더하는 이 규칙이 포함배제의 원리입니다.'};
   }}""")
 +
 note(295, '내가 넣고 · 내가 늘리고 · 내가 판단한다',
 """  {t:'기록 — <b>물건을 상자보다 많게</b> 하고 적으세요',
   f:'물건 n = {0} · 상자 k = {1} · 보장값 = {2}',
   chk(got, r, mem){
     if(!r) return {ok:false, msg:'아직 화면 값이 없습니다.'};
     const n=noteNum(r[0]), k=noteNum(r[1]), g=noteNum(r[3]);
     if(!(n>k)) return {ok:false, msg:'물건이 '+r[0]+' 개, 상자가 '+r[1]+' 칸입니다 — 물건을 더 넣으세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-n)>0.5) return {ok:false, msg:'물건은 '+r[0]+' 개입니다.'};
     if(Math.abs(got[1]-k)>0.5) return {ok:false, msg:'상자는 '+r[1]+' 칸입니다.'};
     if(Math.abs(got[2]-g)>0.5) return {ok:false, msg:'보장값은 '+r[3]+' 입니다.'};
     mem.g1=g; mem.k=k;
     return {ok:true, msg:'기록했습니다 — 어떻게 넣어도 한 칸에 '+r[3]+' 개는 반드시 듭니다.'};
   }}""",
 """  {t:'생각 — <b>물건을 12 개 이상</b> 으로 늘리고 적으세요',
   f:'물건 n = {0} · 보장값 = {1} · n ÷ k 를 올림한 값 = {2}',
   chk(got, r, mem){
     if(mem.g1===undefined) return {ok:false, msg:'① 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const n=noteNum(r[0]), k=noteNum(r[1]), g=noteNum(r[3]);
     if(!(g>=3)) return {ok:false, msg:'보장값이 '+r[3]+' 입니다 — 물건을 더 늘리세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-n)>0.5) return {ok:false, msg:'물건은 '+r[0]+' 개입니다.'};
     if(Math.abs(got[1]-g)>0.5) return {ok:false, msg:'보장값은 '+r[3]+' 입니다.'};
     if(Math.abs(got[2]-Math.ceil(n/k))>0.5) return {ok:false, msg:n+' ÷ '+k+' 를 올림하면 얼마인가요?'};
     mem.g2=g; mem.ok2=true;
     return {ok:true, msg:'계산했습니다 — 보장값이 바로 ⌈n ÷ k⌉ 입니다.'};
   }}""",
 """  {t:'판단 — 더 큰 수로 옮겨 보고 고르세요',
   f:'①의 보장값 = {0} · ②의 보장값 = {1} · n = 21, k = 5 일 때의 보장값 = {2}',
   opts:['모든 칸이 그보다 적게 들었다고 하면 <b>전체 수가 모자라 모순</b> 이 된다 — 그래서 적어도 한 칸에는 ⌈n ÷ k⌉ 개가 반드시 들고, 세어 보지 않고도 단언할 수 있다',
         '넣는 방식을 잘 고르면 겹치는 칸을 피할 수 있다',
         '보장값은 n 을 k 로 나눈 몫(버림)이다'],
   chk(got, r, mem, pick){
     if(!mem.ok2) return {ok:false, msg:'② 칸을 먼저 통과하세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-mem.g1)>0.5) return {ok:false, msg:'①에 적은 '+mem.g1+' 입니다.'};
     if(Math.abs(got[1]-mem.g2)>0.5) return {ok:false, msg:'②에 적은 '+mem.g2+' 입니다.'};
     if(Math.abs(got[2]-5)>0.5) return {ok:false, msg:'21 ÷ 5 = 4.2 를 올림하세요.'};
     if(pick!==0)
       return {ok:false, msg:'넣는 방식을 바꿔도 보장값보다 적어지지 않았습니다. 왜 그럴까요? 다시 고르세요.'};
     return {ok:true, msg:'판단했습니다 — <b>세어 보지 않고도 아는 것</b>이 비둘기집 원리입니다. 서울 사람의 머리카락 수(최대 약 15만)보다 사람이 훨씬 많으므로 같은 사람이 반드시 있습니다.'};
   }}""")
 +
 note(296, '내가 옮기고 · 내가 늘리고 · 내가 판단한다',
 """  {t:'기록 — <b>원반을 적게(5 개 아래)</b> 두고 최소 횟수를 적으세요',
   f:'원반 수 = {0} · 최소 횟수 = {1}',
   chk(got, r, mem){
     if(!r) return {ok:false, msg:'아직 화면 값이 없습니다.'};
     const n=noteNum(r[0]), t=noteNum(r[1]);
     if(!(n<5)) return {ok:false, msg:'원반이 '+r[0]+' 개입니다 — 5 개보다 적게 두세요.'};
     if(![0,1].every(j=>isFinite(got[j]))) return {ok:false, msg:'두 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-n)>0.5) return {ok:false, msg:'원반 수는 '+r[0]+' 개입니다.'};
     if(Math.abs(got[1]-t)>0.5) return {ok:false, msg:'최소 횟수는 '+r[1]+' 번입니다.'};
     mem.n1=n; mem.t1=t;
     return {ok:true, msg:'기록했습니다 — 원반 '+r[0]+' 개에 '+r[1]+' 번입니다. 하나 늘려 봅시다.'};
   }}""",
 """  {t:'생각 — <b>원반을 하나 더</b> 늘리고 적으세요',
   f:'원반 수 = {0} · 최소 횟수 = {1} · ①의 두 배 + 1 = {2}',
   chk(got, r, mem){
     if(mem.t1===undefined) return {ok:false, msg:'① 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const n=noteNum(r[0]), t=noteNum(r[1]);
     if(n!==mem.n1+1) return {ok:false, msg:'원반을 '+(mem.n1+1)+' 개로 두세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-n)>0.5) return {ok:false, msg:'원반 수는 '+r[0]+' 개입니다.'};
     if(Math.abs(got[1]-t)>0.5) return {ok:false, msg:'최소 횟수는 '+r[1]+' 번입니다.'};
     if(Math.abs(got[2]-(2*mem.t1+1))>0.5) return {ok:false, msg:'①의 '+mem.t1+' 을 두 배 하고 1 을 더하세요.'};
     mem.t2=t; mem.ok2=true;
     return {ok:true, msg:'계산했습니다 — 2 × '+mem.t1+' + 1 = '+r[1]+' 그대로입니다.'};
   }}""",
 """  {t:'판단 — 10 개까지 밀어 보고 고르세요',
   f:'①의 횟수 = {0} · ②의 횟수 = {1} · 원반이 10 개일 때의 횟수 = {2}',
   opts:['큰 원반 하나를 옮기려면 그 위의 n−1 개를 <b>두 번</b> 옮겨야 한다 — T(n) = 2T(n−1) + 1 이고 그 값이 2ⁿ − 1 이라, 원반 하나에 시간이 두 배씩 늘어난다',
         '원반이 하나 늘면 횟수도 하나 늘어난다',
         '원반이 늘어도 요령을 찾으면 횟수를 줄일 수 있다'],
   chk(got, r, mem, pick){
     if(!mem.ok2) return {ok:false, msg:'② 칸을 먼저 통과하세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-mem.t1)>0.5) return {ok:false, msg:'①에 적은 '+mem.t1+' 입니다.'};
     if(Math.abs(got[1]-mem.t2)>0.5) return {ok:false, msg:'②에 적은 '+mem.t2+' 입니다.'};
     if(Math.abs(got[2]-1023)>0.5) return {ok:false, msg:'2의 10제곱에서 1 을 빼세요.'};
     if(pick!==0)
       return {ok:false, msg:'하나 늘 때마다 두 배 + 1 이었습니다. 그 까닭은 무엇일까요? 다시 고르세요.'};
     return {ok:true, msg:'판단했습니다 — <b>2ⁿ − 1 입니다.</b> 64 개라면 1 초에 하나씩 옮겨도 5,845 억 년 — 알고리즘이 지수 시간이면 컴퓨터가 빨라져도 소용이 없습니다.'};
   }}""")
 +
 note(297, '내가 고르고 · 내가 세고 · 내가 판단한다',
 """  {t:'기록 — <b>한 번에 그릴 수 있는 도형</b> 에서 적으세요',
   f:'간선 수 = {0} · 홀수 점 = {1}',
   chk(got, r, mem){
     if(!r) return {ok:false, msg:'아직 화면 값이 없습니다.'};
     const e=noteNum(r[1]), od=noteNum(r[2]);
     if(String(r[3])==='불가능') return {ok:false, msg:'지금 도형은 «불가능» 입니다 — 그릴 수 있는 도형으로 고르세요.'};
     if(![0,1].every(j=>isFinite(got[j]))) return {ok:false, msg:'두 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-e)>0.5) return {ok:false, msg:'간선 수는 '+r[1]+' 입니다.'};
     if(Math.abs(got[1]-od)>0.5) return {ok:false, msg:'홀수 점은 '+r[2]+' 개입니다.'};
     mem.od1=od;
     return {ok:true, msg:'기록했습니다 — 홀수 점이 '+r[2]+' 개일 때 그릴 수 있었습니다. 안 되는 도형은 어떨까요?'};
   }}""",
 """  {t:'생각 — <b>그릴 수 없는 도형</b> 으로 바꾸고 적으세요',
   f:'간선 수 = {0} · 홀수 점 = {1} · ①보다 몇 개 많은가 = {2}',
   chk(got, r, mem){
     if(mem.od1===undefined) return {ok:false, msg:'① 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const e=noteNum(r[1]), od=noteNum(r[2]);
     if(String(r[3])!=='불가능') return {ok:false, msg:'지금 도형은 «'+r[3]+'» 입니다 — 그릴 수 없는 도형으로 바꾸세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-e)>0.5) return {ok:false, msg:'간선 수는 '+r[1]+' 입니다.'};
     if(Math.abs(got[1]-od)>0.5) return {ok:false, msg:'홀수 점은 '+r[2]+' 개입니다.'};
     if(Math.abs(got[2]-(od-mem.od1))>0.5) return {ok:false, msg:'①의 '+mem.od1+' 개를 빼면 얼마인가요?'};
     mem.od2=od; mem.ok2=true;
     return {ok:true, msg:'계산했습니다 — 홀수 점이 '+r[2]+' 개가 되자 그릴 수 없습니다.'};
   }}""",
 """  {t:'판단 — 두 도형의 홀수 점을 나란히 두고 고르세요',
   f:'①의 홀수 점 = {0} · ②의 홀수 점 = {1} · 한 번에 그릴 수 있는 홀수 점의 최대 수 = {2}',
   opts:['지나가는 꼭짓점은 <b>들어오고 나가는 선이 짝</b> 을 이루어야 하므로 차수가 짝수여야 한다 — 홀수 점은 출발점과 도착점뿐이므로 0 개이거나 2 개일 때만 한 번에 그릴 수 있다',
         '간선이 많을수록 그리기 어려워진다',
         '홀수 점이 몇 개든 요령만 좋으면 그릴 수 있다'],
   chk(got, r, mem, pick){
     if(!mem.ok2) return {ok:false, msg:'② 칸을 먼저 통과하세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-mem.od1)>0.5) return {ok:false, msg:'①에 적은 '+mem.od1+' 입니다.'};
     if(Math.abs(got[1]-mem.od2)>0.5) return {ok:false, msg:'②에 적은 '+mem.od2+' 입니다.'};
     if(Math.abs(got[2]-2)>0.5) return {ok:false, msg:'홀수 점이 몇 개까지면 그릴 수 있었나요?'};
     if(pick!==0)
       return {ok:false, msg:'홀수 점이 2 개일 때는 되고 4 개일 때는 안 되었습니다. 꼭짓점에서 무슨 일이 일어날까요? 다시 고르세요.'};
     return {ok:true, msg:'판단했습니다 — <b>홀수 점이 0 개면 닫힌 한붓그리기, 2 개면 열린 한붓그리기입니다.</b> 쾨니히스베르크의 일곱 다리를 오일러가 이렇게 풀면서 그래프 이론이 시작되었습니다.'};
   }}""")
 +
 note(298, '내가 세고 · 내가 두 번 세고 · 내가 판단한다',
 """  {t:'기록 — <b>악수를 5 번 이상</b> 으로 두고 적으세요',
   f:'악수 횟수 = {0} · 차수의 합 = {1}',
   chk(got, r, mem){
     if(!r) return {ok:false, msg:'아직 화면 값이 없습니다.'};
     const e=noteNum(r[1]), s=noteNum(r[2]);
     if(!(e>=5)) return {ok:false, msg:'악수가 '+r[1]+' 번입니다 — 5 번 이상으로 늘리세요.'};
     if(![0,1].every(j=>isFinite(got[j]))) return {ok:false, msg:'두 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-e)>0.5) return {ok:false, msg:'악수 횟수는 '+r[1]+' 번입니다.'};
     if(Math.abs(got[1]-s)>0.5) return {ok:false, msg:'차수의 합은 '+r[2]+' 입니다.'};
     mem.e1=e; mem.s1=s;
     return {ok:true, msg:'기록했습니다 — 악수 '+r[1]+' 번에 차수의 합이 '+r[2]+' 입니다.'};
   }}""",
 """  {t:'생각 — <b>악수 횟수를 바꾸고</b> 합을 횟수로 나눠 보세요',
   f:'악수 횟수 = {0} · 차수의 합 = {1} · 합 ÷ 횟수 = {2}',
   chk(got, r, mem){
     if(mem.s1===undefined) return {ok:false, msg:'① 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const e=noteNum(r[1]), s=noteNum(r[2]);
     if(e===mem.e1) return {ok:false, msg:'악수 횟수가 그대로입니다 — 바꿔 보세요.'};
     if(!(e>0)) return {ok:false, msg:'악수 횟수를 1 번 이상으로 두세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-e)>0.5) return {ok:false, msg:'악수 횟수는 '+r[1]+' 번입니다.'};
     if(Math.abs(got[1]-s)>0.5) return {ok:false, msg:'차수의 합은 '+r[2]+' 입니다.'};
     if(Math.abs(got[2]-s/e)>0.05) return {ok:false, msg:'합을 횟수로 나누면 얼마인가요?'};
     mem.e2=e; mem.s2=s; mem.ok2=true;
     return {ok:true, msg:'계산했습니다 — 횟수를 바꿔도 비가 언제나 2 입니다.'};
   }}""",
 """  {t:'판단 — 두 번 센 까닭을 생각하며 고르세요',
   f:'①의 차수의 합 = {0} · ②의 차수의 합 = {1} · 악수가 10 번이면 차수의 합 = {2}',
   opts:['악수 한 번이 <b>두 사람</b> 의 횟수를 하나씩 올리므로 차수의 합은 언제나 악수 횟수의 두 배다 — 같은 것을 두 방법으로 센 것이고, 그래서 홀수 번 악수한 사람은 반드시 짝수 명이다',
         '사람이 많을수록 차수의 합이 커질 뿐 정해진 관계는 없다',
         '차수의 합은 악수 횟수와 같다'],
   chk(got, r, mem, pick){
     if(!mem.ok2) return {ok:false, msg:'② 칸을 먼저 통과하세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-mem.s1)>0.5) return {ok:false, msg:'①에 적은 '+mem.s1+' 입니다.'};
     if(Math.abs(got[1]-mem.s2)>0.5) return {ok:false, msg:'②에 적은 '+mem.s2+' 입니다.'};
     if(Math.abs(got[2]-20)>0.5) return {ok:false, msg:'10 의 두 배입니다.'};
     if(pick!==0)
       return {ok:false, msg:'악수 횟수를 어떻게 바꿔도 합이 정확히 두 배였습니다. 왜 두 배일까요? 다시 고르세요.'};
     return {ok:true, msg:'판단했습니다 — <b>같은 것을 두 방법으로 세면 식이 나옵니다.</b> 차수의 합 = 2 × 간선 수이고, 여기서 「홀수 차수인 꼭짓점은 짝수 개」 라는 사실이 바로 따라 나옵니다.'};
   }}""")
 +
 note(299, '내가 고르고 · 내가 빼먹고 · 내가 판단한다',
 """  {t:'기록 — <b>길을 5 개</b> 까지 제대로 골라 적으세요',
   f:'고른 길 = {0} · 비용 = {1} · 덩어리 = {2}',
   chk(got, r, mem){
     if(!r) return {ok:false, msg:'아직 화면 값이 없습니다.'};
     const k=noteNum(r[0]), c=noteNum(r[2]), comp=noteNum(r[3]);
     if(String(r[1])!=='함') return {ok:false, msg:'「사이클 검사를 하지 않기」 를 끄고 적으세요 — ②에서 켤 것입니다.'};
     if(!(comp===1)) return {ok:false, msg:'아직 덩어리가 '+r[3]+' 개입니다 — 길을 더 고르세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-k)>0.5) return {ok:false, msg:'고른 길은 '+r[0]+' 개입니다.'};
     if(Math.abs(got[1]-c)>0.5) return {ok:false, msg:'비용은 '+r[2]+' 입니다.'};
     if(Math.abs(got[2]-comp)>0.5) return {ok:false, msg:'덩어리는 '+r[3]+' 개입니다.'};
     mem.c1=c; mem.k1=k;
     return {ok:true, msg:'기록했습니다 — 길 '+r[0]+' 개로 여섯 마을이 모두 이어졌고 비용은 '+r[2]+' 입니다.'};
   }}""",
 """  {t:'생각 — <b>「사이클 검사를 하지 않기」</b> 를 켜고 다시 골라 적으세요',
   f:'비용 = {0} · 덩어리 = {1} · ①보다 덩어리가 몇 개 많은가 = {2}',
   chk(got, r, mem){
     if(mem.c1===undefined) return {ok:false, msg:'① 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const c=noteNum(r[2]), comp=noteNum(r[3]);
     if(String(r[1])!=='안 함') return {ok:false, msg:'「사이클 검사를 하지 않기」 를 켜세요.'};
     if(!(comp>1)) return {ok:false, msg:'아직 덩어리가 '+r[3]+' 개입니다 — 길을 3 개 이상 골라 보세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-c)>0.5) return {ok:false, msg:'비용은 '+r[2]+' 입니다.'};
     if(Math.abs(got[1]-comp)>0.5) return {ok:false, msg:'덩어리는 '+r[3]+' 개입니다.'};
     if(Math.abs(got[2]-(comp-1))>0.5) return {ok:false, msg:'①에서는 덩어리가 1 개였습니다.'};
     mem.c2=c; mem.comp2=comp; mem.ok2=true;
     return {ok:true, msg:'계산했습니다 — 같은 수의 길을 놓고도 마을이 다 이어지지 않았습니다.'};
   }}""",
 """  {t:'판단 — 두 결과를 나란히 두고 고르세요',
   f:'①의 비용 = {0} · ②의 덩어리 = {1} · 마을 6 개를 모두 잇는 데 필요한 길의 수 = {2}',
   opts:['싼 길부터 고르되 <b>사이클이 생기면 건너뛰어야</b> 한다 — 이미 이어진 두 마을을 또 이으면 덩어리는 그대로인데 비용만 늘고, 마을 n 개를 잇는 데는 길 n − 1 개면 충분하다',
         '싼 길부터 고르기만 하면 언제나 최선이다',
         '길이 많을수록 안전하니 사이클이 있어도 괜찮다'],
   chk(got, r, mem, pick){
     if(!mem.ok2) return {ok:false, msg:'② 칸을 먼저 통과하세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-mem.c1)>0.5) return {ok:false, msg:'①에 적은 '+mem.c1+' 입니다.'};
     if(Math.abs(got[1]-mem.comp2)>0.5) return {ok:false, msg:'②에 적은 '+mem.comp2+' 입니다.'};
     if(Math.abs(got[2]-5)>0.5) return {ok:false, msg:'마을 6 개면 길은 몇 개일까요?'};
     if(pick!==0)
       return {ok:false, msg:'검사를 빼니 같은 수의 길로도 마을이 다 이어지지 않았습니다. 무엇을 함께 확인해야 할까요? 다시 고르세요.'};
     return {ok:true, msg:'판단했습니다 — <b>싼 길부터, 단 고리가 생기면 건너뛴다</b> — 크러스컬 알고리즘입니다. 통신망·전력망·도로망을 가장 싸게 까는 데 그대로 쓰입니다.'};
   }}""")
 +
 note(300, '내가 퍼뜨리고 · 내가 파고들고 · 내가 판단한다',
 """  {t:'기록 — <b>너비 우선</b> 으로 끝까지 살펴보고 적으세요',
   f:'살펴본 칸 = {0} · 찾은 길이 = {1} · 최단 길이 = {2}',
   chk(got, r, mem){
     if(!r) return {ok:false, msg:'아직 화면 값이 없습니다.'};
     const seen=noteNum(r[1]), len=noteNum(r[2]), best=noteNum(r[3]);
     if(String(r[0])!=='너비 우선') return {ok:false, msg:'지금은 «'+r[0]+'» 입니다 — 너비 우선으로 두세요.'};
     if(!isFinite(len)) return {ok:false, msg:'아직 길을 찾지 못했습니다 — 살펴본 칸 수를 끝까지 늘리세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-seen)>0.5) return {ok:false, msg:'살펴본 칸은 '+r[1]+' 개입니다.'};
     if(Math.abs(got[1]-len)>0.5) return {ok:false, msg:'찾은 길이는 '+r[2]+' 입니다.'};
     if(Math.abs(got[2]-best)>0.5) return {ok:false, msg:'최단 길이는 '+r[3]+' 입니다.'};
     mem.len1=len; mem.best=best;
     return {ok:true, msg:'기록했습니다 — 찾은 길이가 최단 길이와 같습니다.'};
   }}""",
 """  {t:'생각 — <b>깊이 우선</b> 으로 바꿔 끝까지 살펴보고 적으세요',
   f:'찾은 길이 = {0} · 최단 길이 = {1} · 최단보다 몇 칸 긴가 = {2}',
   chk(got, r, mem){
     if(mem.len1===undefined) return {ok:false, msg:'① 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const len=noteNum(r[2]), best=noteNum(r[3]);
     if(String(r[0])!=='깊이 우선') return {ok:false, msg:'지금은 «'+r[0]+'» 입니다 — 깊이 우선으로 바꾸세요.'};
     if(!isFinite(len)) return {ok:false, msg:'아직 길을 찾지 못했습니다 — 살펴본 칸 수를 끝까지 늘리세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-len)>0.5) return {ok:false, msg:'찾은 길이는 '+r[2]+' 입니다.'};
     if(Math.abs(got[1]-best)>0.5) return {ok:false, msg:'최단 길이는 '+r[3]+' 입니다.'};
     if(Math.abs(got[2]-(len-best))>0.5) return {ok:false, msg:'찾은 길이에서 최단 길이를 빼세요.'};
     mem.len2=len; mem.ok2=true;
     return {ok:true, msg:'계산했습니다 — 길은 찾았지만 최단은 아닙니다.'};
   }}""",
 """  {t:'판단 — 두 방법을 나란히 두고 고르세요',
   f:'①의 찾은 길이 = {0} · ②의 찾은 길이 = {1} · 최단이 필요할 때 큐를 쓰면 1, 스택을 쓰면 0 → {2}',
   opts:['큐는 <b>가까운 곳부터 고르게</b> 퍼지므로 처음 닿은 길이 곧 최단이다 — 스택은 한 방향으로 끝까지 파고들어 길을 찾기는 해도 그것이 최단이라는 보장이 없다',
         '둘 다 최단을 찾지만 속도만 다르다',
         '스택이 더 깊이 보므로 더 짧은 길을 찾는다'],
   chk(got, r, mem, pick){
     if(!mem.ok2) return {ok:false, msg:'② 칸을 먼저 통과하세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-mem.len1)>0.5) return {ok:false, msg:'①에 적은 '+mem.len1+' 입니다.'};
     if(Math.abs(got[1]-mem.len2)>0.5) return {ok:false, msg:'②에 적은 '+mem.len2+' 입니다.'};
     if(Math.abs(got[2]-1)>0.1) return {ok:false, msg:'최단을 보장한 쪽은 어느 쪽이었나요?'};
     if(pick!==0)
       return {ok:false, msg:'너비 우선은 최단이었고 깊이 우선은 더 길었습니다. 무엇이 그 차이를 만들까요? 다시 고르세요.'};
     return {ok:true, msg:'판단했습니다 — <b>꺼내는 순서가 알고리즘을 바꿉니다.</b> 큐를 쓰면 너비 우선(최단 보장), 스택을 쓰면 깊이 우선 — 자료구조 하나만 바꿨을 뿐인데 성질이 달라집니다.'};
   }}""")
)
