# -*- coding: utf-8 -*-
"""LAB 171~180 탐구 노트 — 기록 → 생각 → 판단. 판정은 화면의 read() 값으로만 한다."""


def note(no, head, c1, c2, c3):
    return "\n %d:{ h:'%s',\n  c:[\n%s,\n%s,\n%s\n ]},\n" % (no, head, c1, c2, c3)


NOTES = (
 note(171, '내가 나누고 · 내가 재고 · 내가 판단한다',
 """  {t:'기록 — m 과 n 을 <b>다르게</b> 두고 두 거리를 적으세요',
   f:'m = {0} · n = {1} · A 까지 = {2} · B 까지 = {3}',
   chk(got, r, mem){
     if(!r) return {ok:false, msg:'아직 화면 값이 없습니다.'};
     const m=noteNum(r[0]), n=noteNum(r[1]), da=noteNum(r[3]), db=noteNum(r[4]);
     if(!(m>0&&n>0)) return {ok:false, msg:'m 과 n 을 모두 0 보다 크게 하세요 (지금 '+r[0]+', '+r[1]+').'};
     if(m===n) return {ok:false, msg:'①은 m 과 n 이 다를 때 적습니다 — 같게 두는 것은 ③에서 합니다.'};
     if(![0,1,2,3].every(j=>isFinite(got[j]))) return {ok:false, msg:'네 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-m)>0.5||Math.abs(got[1]-n)>0.5)
       return {ok:false, msg:'화면은 m = '+r[0]+' · n = '+r[1]+' 입니다.'};
     if(Math.abs(got[2]-da)>0.02||Math.abs(got[3]-db)>0.02)
       return {ok:false, msg:'화면은 A 까지 '+r[3]+' · B 까지 '+r[4]+' 입니다.'};
     mem.m=m; mem.n=n; mem.da=da; mem.db=db;
     return {ok:true, msg:'기록했습니다 — 두 거리의 비가 m : n 과 같은지 봅시다.'};
   }}""",
 """  {t:'생각 — <b>A 까지 ÷ B 까지</b> 를 구해 m ÷ n 과 맞추세요',
   f:'A 까지 ÷ B 까지 = {0} · m ÷ n = {1} · 두 값의 차 = {2}',
   chk(got, r, mem){
     if(mem.m===undefined) return {ok:false, msg:'① 칸을 먼저 통과하세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-mem.da/mem.db)>0.04) return {ok:false, msg:'①의 '+mem.da+' 를 '+mem.db+' 로 나누세요.'};
     if(Math.abs(got[1]-mem.m/mem.n)>0.04) return {ok:false, msg:'①의 m = '+mem.m+' 을 n = '+mem.n+' 으로 나누세요.'};
     if(Math.abs(got[2])>0.06) return {ok:false, msg:'두 값을 빼 보세요. 무엇이 나오나요?'};
     mem.ok2=true;
     return {ok:true, msg:'계산했습니다 — 거리의 비가 곧 m : n 입니다.'};
   }}""",
 """  {t:'판단 — m 과 n 을 <b>같게</b> 맞춘 뒤 고르세요',
   f:'P 의 x 좌표 = {0} · A 까지 = {1} · B 까지 = {2}',
   opts:['P = <b>(nA + mB) ÷ (m + n)</b> — A 쪽에 n 이, B 쪽에 m 이 <b>엇갈려</b> 붙는다 (m 이 크면 B 에 가깝다)',
         'A 에 m 을, B 에 n 을 곱해 더하면 된다',
         '내분점은 늘 두 점의 한가운데다'],
   chk(got, r, mem, pick){
     if(!mem.ok2) return {ok:false, msg:'② 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const m=noteNum(r[0]), n=noteNum(r[1]), da=noteNum(r[3]), db=noteNum(r[4]);
     if(!(m===n && m>0)) return {ok:false, msg:'m 과 n 을 같은 값(0 보다 큰)으로 맞추세요 (지금 '+r[0]+', '+r[1]+').'};
     const px=noteNum(r[2]);
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-px)>0.03) return {ok:false, msg:'P 는 '+r[2]+' 입니다 — x 좌표만 적으세요.'};
     if(Math.abs(got[1]-da)>0.02||Math.abs(got[2]-db)>0.02)
       return {ok:false, msg:'지금은 A 까지 '+r[3]+' · B 까지 '+r[4]+' 입니다.'};
     if(Math.abs(da-db)>0.02) return {ok:false, msg:'두 거리가 아직 다릅니다 — m 과 n 을 정확히 같게 하세요.'};
     if(pick!==0)
       return {ok:false, msg:'m : n = '+mem.m+' : '+mem.n+' 일 때 거리의 비도 그랬고, 같게 하니 가운데가 되었습니다. 계수가 어느 쪽에 붙던가요? 다시 고르세요.'};
     return {ok:true, msg:'판단했습니다 — <b>가까운 쪽에 작은 계수</b> 가 붙습니다. m 이 크면 P 가 B 쪽으로 가야 하므로 B 에 m 이 붙는 것입니다 — 무게중심도 같은 셈법의 세 점 판입니다.'};
   }}""")
 +
 note(172, '내가 늘리고 · 내가 좁히고 · 내가 판단한다',
 """  {t:'기록 — <b>극한이 있는 수열</b> 을 골라 n 이 작을 때를 적으세요',
   f:'n = {0} · aₙ = {1} · 극한과의 차이 = {2}',
   chk(got, r, mem){
     if(!r) return {ok:false, msg:'아직 화면 값이 없습니다.'};
     const n=noteNum(r[1]), a=noteNum(r[2]), g=noteNum(r[4]);
     if(!isFinite(g)) return {ok:false, msg:'지금 수열은 극한이 «'+r[3]+'» 입니다 — 극한이 있는 수열을 고르세요.'};
     if(n>40) return {ok:false, msg:'①은 n 을 40 이하로 두고 적습니다 — 늘리는 것은 ②에서 합니다.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-n)>0.5) return {ok:false, msg:'n 은 '+r[1]+' 입니다.'};
     if(Math.abs(got[1]-a)>0.0006||Math.abs(got[2]-g)>0.0006)
       return {ok:false, msg:'화면은 aₙ = '+r[2]+' · 차이 '+r[4]+' 입니다.'};
     mem.n=n; mem.g=g; mem.s=String(r[0]);
     return {ok:true, msg:'기록했습니다 — 차이가 '+r[4]+' 입니다. n 을 크게 늘려 봅시다.'};
   }}""",
 """  {t:'생각 — 같은 수열에서 n 을 <b>다섯 배 넘게</b> 늘리세요',
   f:'새 n = {0} · 차이 = {1} · ①의 차이 ÷ 지금 차이 = {2}',
   chk(got, r, mem){
     if(mem.n===undefined) return {ok:false, msg:'① 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const n=noteNum(r[1]), g=noteNum(r[4]);
     if(String(r[0])!==mem.s) return {ok:false, msg:'수열은 ①과 같은 «'+mem.s+'» 로 두세요.'};
     if(!(n >= mem.n*5)) return {ok:false, msg:'n 이 '+r[1]+' 입니다. ①의 '+mem.n+' 의 다섯 배 넘게 늘리세요.'};
     if(!isFinite(g)||g<=0) return {ok:false, msg:'차이를 읽을 수 없습니다 — 화면을 다시 보세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-n)>0.5||Math.abs(got[1]-g)>0.0006)
       return {ok:false, msg:'지금은 n = '+r[1]+' · 차이 '+r[4]+' 입니다.'};
     if(Math.abs(got[2]-mem.g/g)>0.9) return {ok:false, msg:'①의 차이 '+mem.g+' 를 지금 차이로 나누세요.'};
     mem.g2=g; mem.ok2=true;
     return {ok:true, msg:'계산했습니다 — 차이가 '+r[4]+' 로 줄었지만 0 은 아닙니다.'};
   }}""",
 """  {t:'판단 — <b>② (−1)ⁿ</b> 으로 바꿔 본 뒤 고르세요',
   f:'극한이 있으면 1, 없으면 0 → {0} · 차이가 정확히 0 이 되는 n 이 있으면 1, 없으면 0 → {1}',
   opts:['극한은 <b>「어떤 작은 수를 줘도 그보다 가까워지는 n 이 있다」</b> — 닿는 것이 아니라 한없이 가까워지는 것이다',
         '극한은 수열이 실제로 그 값을 갖는 항이 있다는 뜻이다',
         '항이 오르내리기만 하면 극한이 있다'],
   chk(got, r, mem, pick){
     if(!mem.ok2) return {ok:false, msg:'② 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     if(String(r[0]).indexOf('−1')<0 && String(r[0]).indexOf('(-1)')<0)
       return {ok:false, msg:'지금 «'+r[0]+'» 입니다. 「② (−1)ⁿ」 을 고르세요.'};
     const has=(String(r[3])==='없음')?0:1;
     if(![0,1].every(j=>isFinite(got[j]))) return {ok:false, msg:'두 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-has)>0.01) return {ok:false, msg:'화면의 극한은 «'+r[3]+'» 입니다.'};
     if(Math.abs(got[1])>0.01)
       return {ok:false, msg:'①②에서 차이가 정확히 0 이 된 적이 있었나요? 0 또는 1 로 답하세요.'};
     if(pick!==0)
       return {ok:false, msg:'차이가 '+mem.g+' → '+mem.g2+' 로 줄었지만 끝내 0 은 아니었습니다. 그래도 「수렴한다」고 말합니다. 왜일까요? 다시 고르세요.'};
     return {ok:true, msg:'판단했습니다 — <b>「닿는다」가 아니라 「한없이 가까워진다」</b> 입니다. (−1)ⁿ 처럼 두 값을 오가면 어떤 한 수에도 가까워지지 않으므로 극한이 없습니다.'};
   }}""")
 +
 note(173, '내가 곱하고 · 내가 넘기고 · 내가 판단한다',
 """  {t:'기록 — |r| 을 <b>1 보다 작게</b> 두고 적으세요',
   f:'r = {0} · n = {1} · rⁿ = {2}',
   chk(got, r, mem){
     if(!r) return {ok:false, msg:'아직 화면 값이 없습니다.'};
     const rr=noteNum(r[0]), n=noteNum(r[1]), v=noteNum(r[2]), ar=noteNum(r[4]);
     if(!(ar<1)) return {ok:false, msg:'|r| 이 '+r[4]+' 입니다. 1 보다 작게 하세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-rr)>0.03||Math.abs(got[1]-n)>0.5)
       return {ok:false, msg:'화면은 r = '+r[0]+' · n = '+r[1]+' 입니다.'};
     if(Math.abs(got[2]-v)>0.0006) return {ok:false, msg:'rⁿ 은 '+r[2]+' 입니다.'};
     mem.r=rr; mem.n=n; mem.v=Math.abs(v); mem.j=String(r[3]);
     return {ok:true, msg:'기록했습니다 — 판정이 «'+mem.j+'» 입니다. n 을 늘려 봅시다.'};
   }}""",
 """  {t:'생각 — 같은 r 에서 n 을 <b>두 배 넘게</b> 늘리세요',
   f:'새 n = {0} · rⁿ = {1} · 크기가 줄었으면 1, 아니면 0 → {2}',
   chk(got, r, mem){
     if(mem.r===undefined) return {ok:false, msg:'① 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const rr=noteNum(r[0]), n=noteNum(r[1]), v=noteNum(r[2]);
     if(Math.abs(rr-mem.r)>0.03) return {ok:false, msg:'r 은 ①과 같은 '+mem.r+' 로 두세요 — n 만 바꿉니다.'};
     if(!(n >= mem.n*2)) return {ok:false, msg:'n 이 '+r[1]+' 입니다. ①의 '+mem.n+' 의 두 배 넘게 늘리세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-n)>0.5||Math.abs(got[1]-v)>0.0006)
       return {ok:false, msg:'지금은 n = '+r[1]+' · rⁿ = '+r[2]+' 입니다.'};
     if(Math.abs(got[2]-(Math.abs(v)<mem.v?1:0))>0.01)
       return {ok:false, msg:'①의 크기 '+mem.v+' 와 견주어 보세요.'};
     mem.ok2=true;
     return {ok:true, msg:'계산했습니다 — |r| < 1 이면 거듭 곱할수록 작아집니다.'};
   }}""",
 """  {t:'판단 — r 을 <b>1 보다 크게</b> 올린 뒤 고르세요',
   f:'r = {0} · |r| = {1} · 판정이 「발산」이면 1, 아니면 0 → {2}',
   opts:['거듭제곱의 운명은 <b>|r| 하나</b> 가 정한다 — |r| < 1 이면 0 으로, |r| > 1 이면 발산, r = −1 이면 진동',
         'r 이 음수이면 언제나 발산한다',
         'n 을 충분히 늘리면 어떤 r 이든 0 으로 간다'],
   chk(got, r, mem, pick){
     if(!mem.ok2) return {ok:false, msg:'② 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const rr=noteNum(r[0]), ar=noteNum(r[4]);
     if(!(ar>1)) return {ok:false, msg:'|r| 이 '+r[4]+' 입니다. 1 보다 크게 올리세요.'};
     const div=(String(r[3])==='발산')?1:0;
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-rr)>0.03||Math.abs(got[1]-ar)>0.03)
       return {ok:false, msg:'지금은 r = '+r[0]+' · |r| = '+r[4]+' 입니다.'};
     if(Math.abs(got[2]-div)>0.01) return {ok:false, msg:'화면의 판정은 «'+r[3]+'» 입니다.'};
     if(pick!==0)
       return {ok:false, msg:'|r| = '+mem.v.toFixed(3)+' 쪽에서는 «'+mem.j+'» 였고 지금은 «'+r[3]+'» 입니다. 부호가 아니라 무엇이 갈랐나요? 다시 고르세요.'};
     return {ok:true, msg:'판단했습니다 — <b>|r| = 1 이 갈림목</b> 입니다. 공 튀기기·약물 농도·이자·감가상각 — 「매번 같은 비율」로 변하는 모든 것이 이 하나의 조건으로 갈립니다.'};
   }}""")
 +
 note(174, '내가 더하고 · 내가 늘리고 · 내가 판단한다',
 """  {t:'기록 — <b>① 등비급수</b> 에서 항을 늘려 부분합을 적으세요',
   f:'n = {0} · 마지막 항 = {1} · 부분합 = {2}',
   chk(got, r, mem){
     if(!r) return {ok:false, msg:'아직 화면 값이 없습니다.'};
     const n=noteNum(r[1]), t=noteNum(r[2]), S=noteNum(r[3]);
     if(String(r[4])!=='수렴') return {ok:false, msg:'①은 수렴하는 급수에서 적습니다 — 「① 등비급수」를 고르세요.'};
     if(!(n>=8)) return {ok:false, msg:'항을 8개 이상 더해 보세요 (지금 '+r[1]+').'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-n)>0.5) return {ok:false, msg:'n 은 '+r[1]+' 입니다.'};
     if(Math.abs(got[1]-t)>0.0006||Math.abs(got[2]-S)>0.0006)
       return {ok:false, msg:'화면은 마지막 항 '+r[2]+' · 부분합 '+r[3]+' 입니다.'};
     mem.n=n; mem.t=t; mem.S=S;
     return {ok:true, msg:'기록했습니다 — 항은 아주 작고 합은 1 에 거의 닿았습니다. 조화급수는 어떨까요?'};
   }}""",
 """  {t:'생각 — <b>② 조화급수</b> 로 바꿔 <b>같은 항 수</b> 에서 적으세요',
   f:'마지막 항 = {0} · 부분합 = {1} · ①의 부분합보다 크면 1, 아니면 0 → {2}',
   chk(got, r, mem){
     if(mem.n===undefined) return {ok:false, msg:'① 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const n=noteNum(r[1]), t=noteNum(r[2]), S=noteNum(r[3]);
     if(String(r[4])!=='발산') return {ok:false, msg:'지금 «'+r[4]+'» 입니다. 「② 조화급수」를 고르세요.'};
     if(n!==mem.n) return {ok:false, msg:'항의 수는 ①과 같은 '+mem.n+' 으로 두세요 — 급수만 바꿉니다.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-t)>0.0006||Math.abs(got[1]-S)>0.0006)
       return {ok:false, msg:'지금은 마지막 항 '+r[2]+' · 부분합 '+r[3]+' 입니다.'};
     if(Math.abs(got[2]-(S>mem.S?1:0))>0.01) return {ok:false, msg:'①의 부분합 '+mem.S+' 와 견주어 보세요.'};
     mem.ok2=true;
     return {ok:true, msg:'계산했습니다 — 두 급수 모두 항이 0 으로 가는데 합은 다릅니다.'};
   }}""",
 """  {t:'판단 — 조화급수의 항을 <b>200개 넘게</b> 더해 본 뒤 고르세요',
   f:'n = {0} · 마지막 항 = {1} · 부분합 = {2}',
   opts:['「항 → 0」 은 수렴의 <b>필요조건일 뿐</b> — 0 으로 가는 <b>빠르기</b> 가 모자라면 합은 끝없이 커진다',
         '항이 0 으로 가면 합은 반드시 어떤 값에 모인다',
         '항이 작아지는 급수는 모두 수렴한다'],
   chk(got, r, mem, pick){
     if(!mem.ok2) return {ok:false, msg:'② 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const n=noteNum(r[1]), t=noteNum(r[2]), S=noteNum(r[3]);
     if(String(r[4])!=='발산') return {ok:false, msg:'「② 조화급수」를 고른 채로 하세요.'};
     if(!(n>=200)) return {ok:false, msg:'항을 200개 넘게 더하세요 (지금 '+r[1]+').'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-n)>0.5) return {ok:false, msg:'n 은 '+r[1]+' 입니다.'};
     if(Math.abs(got[1]-t)>0.0006||Math.abs(got[2]-S)>0.0006)
       return {ok:false, msg:'지금은 '+r[2]+' 와 '+r[3]+' 입니다.'};
     if(pick!==0)
       return {ok:false, msg:'마지막 항이 '+r[2]+' 로 거의 0 인데 합은 '+r[3]+' 까지 커졌습니다. 등비급수는 '+mem.S+' 에서 멈췄는데 말입니다. 다시 고르세요.'};
     return {ok:true, msg:'판단했습니다 — <b>1/2ⁿ 은 충분히 빨리 줄지만 1/n 은 느립니다.</b> 그래서 조화급수는 아주 천천히, 그러나 끝없이 커집니다 — 「작아지니까 멈추겠지」는 틀린 직관입니다.'};
   }}""")
 +
 note(175, '내가 붙이고 · 내가 좁히고 · 내가 판단한다',
 """  {t:'기록 — <b>① 0.999…</b> 에서 자릿수가 작을 때를 적으세요',
   f:'자릿수 = {0} · 부분합 = {1} · 참값 − 부분합 = {2}',
   chk(got, r, mem){
     if(!r) return {ok:false, msg:'아직 화면 값이 없습니다.'};
     const n=noteNum(r[1]), S=noteNum(r[2]), L=noteNum(r[3]);
     if(String(r[0])!=='1') return {ok:false, msg:'「① 0.999…」 를 고르세요 (지금 참값이 «'+r[0]+'» 입니다).'};
     if(n>6) return {ok:false, msg:'①은 자릿수를 6 이하로 두고 적습니다 — 늘리는 것은 ②에서 합니다.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-n)>0.5) return {ok:false, msg:'자릿수는 '+r[1]+' 입니다.'};
     if(Math.abs(got[1]-S)>1e-9) return {ok:false, msg:'부분합은 '+r[2]+' 입니다 — 소수 자리를 그대로 옮기세요.'};
     if(Math.abs(got[2]-(L-S))>1e-9) return {ok:false, msg:'참값 '+r[3]+' 에서 부분합을 빼세요.'};
     mem.n=n; mem.gap=L-S;
     return {ok:true, msg:'기록했습니다 — 남은 틈이 '+(L-S).toExponential(2)+' 입니다. 자릿수를 늘려 봅시다.'};
   }}""",
 """  {t:'생각 — 자릿수를 <b>12 이상</b> 으로 늘리세요',
   f:'자릿수 = {0} · 부분합 = {1} · ①의 틈보다 작으면 1, 아니면 0 → {2}',
   chk(got, r, mem){
     if(mem.n===undefined) return {ok:false, msg:'① 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const n=noteNum(r[1]), S=noteNum(r[2]), L=noteNum(r[3]);
     if(String(r[0])!=='1') return {ok:false, msg:'「① 0.999…」 를 고른 채로 하세요.'};
     if(!(n>=12)) return {ok:false, msg:'자릿수가 '+r[1]+' 입니다. 12 이상으로 늘리세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-n)>0.5) return {ok:false, msg:'자릿수는 '+r[1]+' 입니다.'};
     if(Math.abs(got[1]-S)>1e-9) return {ok:false, msg:'부분합은 '+r[2]+' 입니다.'};
     if(Math.abs(got[2]-((L-S)<mem.gap?1:0))>0.01) return {ok:false, msg:'①의 틈과 견주어 보세요.'};
     mem.ok2=true;
     return {ok:true, msg:'계산했습니다 — 틈이 10 의 거듭제곱 분의 1 로 줄어듭니다.'};
   }}""",
 """  {t:'판단 — <b>② 0.333…</b> 으로 바꿔 참값을 확인한 뒤 고르세요',
   f:'참값 = {0} · 그 값의 세 배 = {1}',
   opts:['0.999… 는 1 <b>에 가까운 수가 아니라 1 그 자체</b> — 남은 틈이 0 으로 가므로 두 수의 차가 0 이다',
         '0.999… 는 1 보다 아주 조금 작은 수다',
         '무한소수는 값을 정할 수 없다'],
   chk(got, r, mem, pick){
     if(!mem.ok2) return {ok:false, msg:'② 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const L=noteNum(r[3]);
     if(String(r[0]).indexOf('1/3')<0) return {ok:false, msg:'「② 0.333…」 을 고르세요 (지금 «'+r[0]+'»).'};
     if(![0,1].every(j=>isFinite(got[j]))) return {ok:false, msg:'두 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-L)>0.0006) return {ok:false, msg:'참값은 '+r[3]+' 입니다.'};
     if(Math.abs(got[1]-3*L)>0.002) return {ok:false, msg:'참값에 3 을 곱하세요. 무엇이 나오나요?'};
     if(pick!==0)
       return {ok:false, msg:'0.333… 이 1/3 이라면 그 세 배인 0.999… 는 무엇이어야 할까요? 다시 고르세요.'};
     return {ok:true, msg:'판단했습니다 — <b>0.333… × 3 = 0.999… 이고 (1/3) × 3 = 1</b> 입니다. 두 수의 차가 어떤 양수보다도 작으면 그 차는 0 — 서로 다른 표기가 같은 수를 가리킬 뿐입니다.'};
   }}""")
 +
 note(176, '내가 줄이고 · 내가 바꾸고 · 내가 판단한다',
 """  {t:'기록 — <b>라디안</b> 으로 두고 x 가 클 때를 적으세요',
   f:'x = {0} · sin x = {1} · 비 = {2}',
   chk(got, r, mem){
     if(!r) return {ok:false, msg:'아직 화면 값이 없습니다.'};
     if(String(r[0])!=='라디안') return {ok:false, msg:'단위를 라디안으로 두세요 (지금 «'+r[0]+'»).'};
     const x=noteNum(r[1]), s=noteNum(r[2]), q=noteNum(r[4]);
     if(!(x>0.2)) return {ok:false, msg:'①은 x 가 0.2 보다 클 때 적습니다 — 줄이는 것은 ②에서 합니다.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-x)>1e-5||Math.abs(got[1]-s)>1e-7)
       return {ok:false, msg:'화면은 x = '+r[1]+' · sin x = '+r[2]+' 입니다.'};
     if(Math.abs(got[2]-q)>1e-7) return {ok:false, msg:'비는 '+r[4]+' 입니다.'};
     mem.x=x; mem.q=q;
     return {ok:true, msg:'기록했습니다 — 비가 '+r[4]+' 로 1 보다 조금 작습니다. x 를 줄여 봅시다.'};
   }}""",
 """  {t:'생각 — x 를 <b>0.01 보다 작게</b> 줄이세요',
   f:'x = {0} · 비 = {1} · 1 에서 뺀 값 = {2}',
   chk(got, r, mem){
     if(mem.x===undefined) return {ok:false, msg:'① 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     if(String(r[0])!=='라디안') return {ok:false, msg:'라디안으로 둔 채 하세요.'};
     const x=noteNum(r[1]), q=noteNum(r[4]);
     if(!(x<0.01)) return {ok:false, msg:'x 가 '+r[1]+' 입니다. 0.01 보다 작게 줄이세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-x)>1e-5||Math.abs(got[1]-q)>1e-7)
       return {ok:false, msg:'지금은 x = '+r[1]+' · 비 '+r[4]+' 입니다.'};
     if(Math.abs(got[2]-(1-q))>1e-6) return {ok:false, msg:'1 에서 비를 빼세요 — 아주 작은 수가 나옵니다.'};
     mem.ok2=true;
     return {ok:true, msg:'계산했습니다 — 비가 1 에 붙었습니다. 이제 단위만 바꿔 봅시다.'};
   }}""",
 """  {t:'판단 — x 는 그대로 두고 단위를 <b>도(°)</b> 로 바꾼 뒤 고르세요',
   f:'분모 = {0} · 비 = {1} · 라디안에서의 비 ÷ 지금 비 = {2}',
   opts:['라디안에서는 <b>호의 길이가 곧 각의 값</b> 이라 sin x 와 x 가 포개진다 — 도로 재면 π/180 이라는 군더더기가 남는다',
         '단위를 바꾸면 sin x 의 값 자체가 달라진다',
         '극한은 단위와 무관하므로 둘 다 1 이어야 한다'],
   chk(got, r, mem, pick){
     if(!mem.ok2) return {ok:false, msg:'② 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     if(String(r[0])!=='도') return {ok:false, msg:'단위를 「도(°)」 로 바꾸세요 (지금 «'+r[0]+'»).'};
     const den=noteNum(r[3]), q=noteNum(r[4]);
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-den)>1e-5||Math.abs(got[1]-q)>1e-7)
       return {ok:false, msg:'지금은 분모 '+r[3]+' · 비 '+r[4]+' 입니다.'};
     if(Math.abs(got[2]-57.3)>1.2) return {ok:false, msg:'라디안에서의 비(거의 1)를 지금 비로 나누어 보세요 — 180/π 가 나와야 합니다.'};
     if(pick!==0)
       return {ok:false, msg:'sin x 는 그대로인데 분모만 180/π 배가 되었습니다. 달라진 것은 무엇인가요? 다시 고르세요.'};
     return {ok:true, msg:'판단했습니다 — <b>미적분이 라디안을 쓰는 까닭</b> 입니다. 도로 재면 (sin x)′ = (π/180)cos x 가 되어 식마다 군더더기가 따라붙습니다.'};
   }}""")
 +
 note(177, '내가 미분하고 · 내가 나누고 · 내가 판단한다',
 """  {t:'기록 — 밑을 <b>2</b> 쯤으로 두고 두 값을 적으세요',
   f:'a = {0} · f(x) = {1} · f′(x) = {2}',
   chk(got, r, mem){
     if(!r) return {ok:false, msg:'아직 화면 값이 없습니다.'};
     const a=noteNum(r[0]), ln=noteNum(r[1]), f=noteNum(r[3]), d=noteNum(r[4]);
     if(Math.abs(ln-1)<0.01) return {ok:false, msg:'①은 ln a 가 1 이 아닌 밑에서 적습니다 — e 는 ③에서 찾습니다.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-a)>0.02) return {ok:false, msg:'a 는 '+r[0]+' 입니다.'};
     if(Math.abs(got[1]-f)>0.0006||Math.abs(got[2]-d)>0.0006)
       return {ok:false, msg:'화면은 f(x) = '+r[3]+' · f′(x) = '+r[4]+' 입니다.'};
     mem.a=a; mem.ln=ln; mem.f=f; mem.d=d;
     return {ok:true, msg:'기록했습니다 — 두 값이 다릅니다. 얼마나 다른지 나눠 봅시다.'};
   }}""",
 """  {t:'생각 — <b>f′(x) ÷ f(x)</b> 를 구해 ln a 와 맞추세요',
   f:'f′(x) ÷ f(x) = {0} · 화면의 ln a = {1} · 두 값의 차 = {2}',
   chk(got, r, mem){
     if(mem.a===undefined) return {ok:false, msg:'① 칸을 먼저 통과하세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-mem.d/mem.f)>0.004) return {ok:false, msg:'①의 '+mem.d+' 를 '+mem.f+' 로 나누세요.'};
     if(Math.abs(got[1]-mem.ln)>0.0006) return {ok:false, msg:'①에서 본 ln a 는 '+mem.ln+' 입니다.'};
     if(Math.abs(got[2])>0.006) return {ok:false, msg:'두 값을 빼 보세요. 무엇이 나오나요?'};
     mem.ok2=true;
     return {ok:true, msg:'계산했습니다 — 그 비가 x 와 상관없이 ln a 하나입니다. 그렇다면 1 이 되게 하려면?'};
   }}""",
 """  {t:'판단 — <b>ln a 가 1</b> 이 되는 밑을 찾은 뒤 고르세요',
   f:'a = {0} · ln a = {1} · f′(x) − f(x) = {2}',
   opts:['(aˣ)′ = aˣ·<b>ln a</b> 이므로 ln a = 1 인 밑에서만 미분해도 그대로 — 그 밑을 <b>e</b> 라 부른다',
         'e 는 소수점이 끝없이 이어지는 특이한 상수일 뿐 뜻은 없다',
         '모든 지수함수는 미분해도 그대로다'],
   chk(got, r, mem, pick){
     if(!mem.ok2) return {ok:false, msg:'② 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const a=noteNum(r[0]), ln=noteNum(r[1]), f=noteNum(r[3]), d=noteNum(r[4]);
     if(Math.abs(ln-1)>0.01) return {ok:false, msg:'ln a 가 '+r[1]+' 입니다. 「두 곡선이 겹치는 a 찾기」를 누르거나 a 를 맞추세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-a)>0.02||Math.abs(got[1]-ln)>0.006)
       return {ok:false, msg:'지금은 a = '+r[0]+' · ln a = '+r[1]+' 입니다.'};
     if(Math.abs(got[2]-(d-f))>0.004) return {ok:false, msg:'f′(x) 에서 f(x) 를 빼세요 — '+r[4]+' − '+r[3]+' 입니다.'};
     if(pick!==0)
       return {ok:false, msg:'a = '+mem.a+' 에서는 비가 '+mem.ln+' 였고, 지금 a = '+r[0]+' 에서 1 이 되었습니다. 다시 고르세요.'};
     return {ok:true, msg:'판단했습니다 — <b>e 는 외워야 할 숫자가 아니라 「미분해도 그대로인 밑」이라는 조건이 낳은 수</b> 입니다. 그래서 연속 복리·방사성 붕괴·인구 모형이 모두 e 로 쓰입니다.'};
   }}""")
 +
 note(178, '내가 미분하고 · 내가 돌리고 · 내가 판단한다',
 """  {t:'기록 — 미분 <b>0번</b> 과 <b>1번</b> 의 값을 적으세요',
   f:'x = {0} · 0번 미분의 값 = {1} · 1번 미분의 값 = {2}',
   chk(got, r, mem){
     if(!r) return {ok:false, msg:'아직 화면 값이 없습니다.'};
     const n=noteNum(r[0]), x=noteNum(r[2]), v=noteNum(r[3]), g=noteNum(r[4]);
     if(n!==0) return {ok:false, msg:'미분 횟수를 0 으로 두세요 (지금 '+r[0]+').'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-x)>0.006) return {ok:false, msg:'x 는 '+r[2]+' 입니다.'};
     if(Math.abs(got[1]-v)>0.0006) return {ok:false, msg:'0번 미분의 값은 '+r[3]+' 입니다.'};
     if(Math.abs(got[2]-g)>0.0006) return {ok:false, msg:'한 번 더 미분한 값(「기울기」)은 '+r[4]+' 입니다.'};
     mem.x=x; mem.v0=v;
     return {ok:true, msg:'기록했습니다 — 미분 한 번에 sin 이 cos 으로 바뀌었습니다. 두 번이면?'};
   }}""",
 """  {t:'생각 — 미분 횟수를 <b>2</b> 로 올리세요',
   f:'값 = {0} · 0번 미분의 값과 더하면 = {1}',
   chk(got, r, mem){
     if(mem.x===undefined) return {ok:false, msg:'① 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const n=noteNum(r[0]), x=noteNum(r[2]), v=noteNum(r[3]);
     if(n!==2) return {ok:false, msg:'미분 횟수를 2 로 맞추세요 (지금 '+r[0]+').'};
     if(Math.abs(x-mem.x)>0.006) return {ok:false, msg:'x 는 ①과 같은 '+mem.x+' 로 두세요.'};
     if(![0,1].every(j=>isFinite(got[j]))) return {ok:false, msg:'두 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-v)>0.0006) return {ok:false, msg:'값은 '+r[3]+' 입니다.'};
     if(Math.abs(got[1])>0.002) return {ok:false, msg:'①의 값 '+mem.v0+' 와 더해 보세요. 무엇이 나오나요?'};
     mem.ok2=true;
     return {ok:true, msg:'계산했습니다 — 두 번 미분하니 부호만 뒤집혔습니다 (합이 0).'};
   }}""",
 """  {t:'판단 — 미분 횟수를 <b>4</b> 로 올린 뒤 고르세요',
   f:'값 = {0} · 0번 미분의 값에서 빼면 = {1}',
   opts:['미분 한 번이 그래프를 <b>90° 미는 일</b> 이라서 네 번이면 360° — 제자리로 돌아온다',
         '네 번 미분하면 우연히 비슷해질 뿐 같지는 않다',
         '두 번 미분하면 이미 제자리로 돌아온다'],
   chk(got, r, mem, pick){
     if(!mem.ok2) return {ok:false, msg:'② 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const n=noteNum(r[0]), x=noteNum(r[2]), v=noteNum(r[3]);
     if(n!==4) return {ok:false, msg:'미분 횟수를 4 로 맞추세요 (지금 '+r[0]+').'};
     if(Math.abs(x-mem.x)>0.006) return {ok:false, msg:'x 는 ①과 같은 '+mem.x+' 로 두세요.'};
     if(![0,1].every(j=>isFinite(got[j]))) return {ok:false, msg:'두 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-v)>0.0006) return {ok:false, msg:'값은 '+r[3]+' 입니다.'};
     if(Math.abs(got[1])>0.002) return {ok:false, msg:'①의 값 '+mem.v0+' 를 빼 보세요. 무엇이 나오나요?'};
     if(pick!==0)
       return {ok:false, msg:'2번에서는 더해서 0 이었고(부호 반대), 4번에서는 빼서 0 입니다(똑같음). 다시 고르세요.'};
     return {ok:true, msg:'판단했습니다 — <b>sin⁽ⁿ⁾x = sin(x + nπ/2)</b> 로 한 줄에 담깁니다. 미분이 90° 밀기라는 것 — 그래서 진동·파동·교류가 모두 삼각함수로 쓰입니다.'};
   }}""")
 +
 note(179, '내가 이어 붙이고 · 내가 곱하고 · 내가 판단한다',
 """  {t:'기록 — k 를 정하고 두 조각을 적으세요',
   f:'k = {0} · f′(g) = {1} · g′ = {2} · 곱 = {3}',
   chk(got, r, mem){
     if(!r) return {ok:false, msg:'아직 화면 값이 없습니다.'};
     const k=noteNum(r[0]), fg=noteNum(r[2]), gp=noteNum(r[3]), pd=noteNum(r[4]);
     if(![0,1,2,3].every(j=>isFinite(got[j]))) return {ok:false, msg:'네 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-k)>0.06) return {ok:false, msg:'k 는 '+r[0]+' 입니다.'};
     if(Math.abs(got[1]-fg)>0.0006||Math.abs(got[2]-gp)>0.0006)
       return {ok:false, msg:'화면은 f′(g) = '+r[2]+' · g′ = '+r[3]+' 입니다.'};
     if(Math.abs(got[3]-pd)>0.0006) return {ok:false, msg:'곱은 '+r[4]+' 입니다.'};
     mem.k=k; mem.pd=pd; mem.x=noteNum(r[1]);
     return {ok:true, msg:'기록했습니다 — 두 조각을 곱한 것이 진짜 기울기인지 확인해 봅시다.'};
   }}""",
 """  {t:'생각 — 손으로 <b>f′(g) × g′</b> 를 구해 화면과 맞추세요',
   f:'f′(g) × g′ = {0} · 화면의 곱 = {1} · 두 값의 차 = {2}',
   chk(got, r, mem){
     if(mem.k===undefined) return {ok:false, msg:'① 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const fg=noteNum(r[2]), gp=noteNum(r[3]), pd=noteNum(r[4]);
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-fg*gp)>0.004) return {ok:false, msg:'화면의 '+r[2]+' 와 '+r[3]+' 를 곱하세요.'};
     if(Math.abs(got[1]-pd)>0.0006) return {ok:false, msg:'화면의 곱은 '+r[4]+' 입니다.'};
     if(Math.abs(got[2])>0.004) return {ok:false, msg:'두 값을 빼 보세요.'};
     mem.ok2=true;
     return {ok:true, msg:'계산했습니다 — 바깥 미분 × 안쪽 미분이 곧 기울기입니다.'};
   }}""",
 """  {t:'판단 — k 를 <b>두 배 넘게</b> 올린 뒤 고르세요',
   f:'새 k = {0} · 곱 = {1} · ①의 k 로 나눈 값 = {2}',
   opts:['(f∘g)′ = <b>f′(g)·g′</b> — 안쪽이 k 배 빨라지면 기울기도 k 배가 된다',
         '합성함수는 바깥만 미분하면 된다',
         '안쪽 함수를 바꿔도 기울기는 그대로다'],
   chk(got, r, mem, pick){
     if(!mem.ok2) return {ok:false, msg:'② 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const k=noteNum(r[0]), pd=noteNum(r[4]);
     if(!(k >= mem.k*2)) return {ok:false, msg:'k 가 '+r[0]+' 입니다. ①의 '+mem.k+' 의 두 배 넘게 올리세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-k)>0.06) return {ok:false, msg:'k 는 '+r[0]+' 입니다.'};
     if(Math.abs(got[1]-pd)>0.0006) return {ok:false, msg:'곱은 '+r[4]+' 입니다.'};
     if(Math.abs(got[2]-k/mem.k)>0.12) return {ok:false, msg:'지금 k 를 ①의 '+mem.k+' 로 나누어 보세요.'};
     if(pick!==0)
       return {ok:false, msg:'k 를 '+mem.k+' 에서 '+r[0]+' 로 올리자 기울기도 그만큼 커졌습니다. 식의 어디에서 그 배수가 나왔나요? 다시 고르세요.'};
     return {ok:true, msg:'판단했습니다 — <b>사슬 규칙</b> 입니다. 바깥을 미분한 값에 안쪽을 미분한 값을 곱합니다 — 딥러닝의 역전파가 바로 이 규칙을 층마다 이어 붙인 것입니다.'};
   }}""")
 +
 note(180, '내가 미분하고 · 내가 바꾸고 · 내가 판단한다',
 """  {t:'기록 — <b>원</b> 위의 한 점에서 좌표와 기울기를 적으세요',
   f:'x = {0} · y = {1} · 기울기 = {2}',
   chk(got, r, mem){
     if(!r) return {ok:false, msg:'아직 화면 값이 없습니다.'};
     if(String(r[0])!=='원') return {ok:false, msg:'「① 원」 을 고르세요 (지금 «'+r[0]+'»).'};
     const x=noteNum(r[2]), y=noteNum(r[3]), m=noteNum(r[4]);
     if(!isFinite(m)) return {ok:false, msg:'지금 접선이 «'+r[4]+'» 입니다 — 점을 옮기세요. 수직인 자리는 ③에서 봅니다.'};
     if(Math.abs(y)<0.2) return {ok:false, msg:'y 가 0 에 너무 가깝습니다 — 점을 옮기세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-x)>0.006||Math.abs(got[1]-y)>0.006)
       return {ok:false, msg:'화면은 x = '+r[2]+' · y = '+r[3]+' 입니다.'};
     if(Math.abs(got[2]-m)>0.006) return {ok:false, msg:'기울기는 '+r[4]+' 입니다.'};
     mem.x=x; mem.y=y; mem.m=m;
     return {ok:true, msg:'기록했습니다 — 이 기울기가 −x/y 인지 손으로 확인해 봅시다.'};
   }}""",
 """  {t:'생각 — <b>−x ÷ y</b> 를 구하고, 반지름의 기울기와 곱하세요',
   f:'−x ÷ y = {0} · 반지름의 기울기 y ÷ x = {1} · 두 기울기의 곱 = {2}',
   chk(got, r, mem){
     if(mem.x===undefined) return {ok:false, msg:'① 칸을 먼저 통과하세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-(-mem.x/mem.y))>0.01) return {ok:false, msg:'①의 x = '+mem.x+' 와 y = '+mem.y+' 로 −x/y 를 구하세요.'};
     if(Math.abs(got[1]-(mem.y/mem.x))>0.01) return {ok:false, msg:'반지름의 기울기는 y ÷ x 입니다.'};
     if(Math.abs(got[2]+1)>0.02) return {ok:false, msg:'두 기울기를 곱해 보세요. 무엇이 나오나요?'};
     mem.ok2=true;
     return {ok:true, msg:'계산했습니다 — 곱이 −1 이니 접선과 반지름이 수직입니다.'};
   }}""",
 """  {t:'판단 — <b>② 사이클로이드</b> 로 바꿔 본 뒤 고르세요',
   f:'t = {0} · x = {1} · 기울기 = {2}',
   opts:['y = f(x) 로 못 풀어도 <b>양변을 미분하거나(음함수) 매개변수로 나누어(dy/dt ÷ dx/dt)</b> 기울기를 구할 수 있다',
         'y 로 풀 수 없는 곡선은 기울기도 구할 수 없다',
         '매개변수 곡선은 t 로만 미분하면 된다'],
   chk(got, r, mem, pick){
     if(!mem.ok2) return {ok:false, msg:'② 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     if(String(r[0])==='원') return {ok:false, msg:'「② 사이클로이드」 로 바꾸세요.'};
     const t=noteNum(r[1]), x=noteNum(r[2]), m=noteNum(r[4]);
     if(!isFinite(m)) return {ok:false, msg:'지금 기울기가 «'+r[4]+'» 입니다 — t 를 조금 옮기세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-t)>0.03) return {ok:false, msg:'t 는 '+r[1]+' 입니다.'};
     if(Math.abs(got[1]-x)>0.006) return {ok:false, msg:'x 는 '+r[2]+' 입니다.'};
     if(Math.abs(got[2]-m)>0.006) return {ok:false, msg:'기울기는 '+r[4]+' 입니다.'};
     if(pick!==0)
       return {ok:false, msg:'원에서는 −x/y 로, 여기서는 t 로 나누어 기울기가 나왔습니다. 둘 다 y 로 풀지 않았습니다. 다시 고르세요.'};
     return {ok:true, msg:'판단했습니다 — <b>「y = …」 꼴로 풀 수 있느냐와 기울기를 구할 수 있느냐는 다른 문제</b> 입니다. 음함수 미분과 매개변수 미분이 그 둘을 떼어 놓습니다.'};
   }}""")
)
