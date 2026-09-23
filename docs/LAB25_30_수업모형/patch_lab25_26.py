# -*- coding: utf-8 -*-
"""LAB 25 소인수분해와 암호 · LAB 26 수직선 위의 정수 — 7단계 수업 모형 + 탐구 노트.

실험 화면은 primeDemo · intDemo 를 그대로 쓴다 (patch_demo_read.py 로 read() 를 내주게 해 두었다).
수업 모형의 inquiry 는 실험 화면이 갖고 있던 것과 **같은 열**을 쓴다 — read() 가 그 길이로 돌려주기 때문이다.

문제 그림(SVG)의 좌표는 식에서 계산한다.

사용: python docs/LAB25_30_수업모형/patch_lab25_26.py src/40-demos.js
"""
import sys, math

# ── LAB 25 문제 그림 — 나눠 볼 횟수가 √N 에서 멈춘다 ──────────
P25 = []
for k in range(0, 41):
    n = 100 + k * (9900 / 40)          # N: 100 → 10000
    x = 36 + 348 * k / 40
    y = 146 - 116 * math.sqrt(n) / 100.0
    P25.append('%s%.1f %.1f' % ('M' if k == 0 else 'L', x, y))
SQRT_PATH = ' '.join(P25)
P25B = []
for k in range(0, 41):
    n = 100 + k * (9900 / 40)
    x = 36 + 348 * k / 40
    y = 146 - 116 * n / 10000.0
    P25B.append('%s%.1f %.1f' % ('M' if k == 0 else 'L', x, y))
FULL_PATH = ' '.join(P25B)

# ── LAB 26 문제 그림 — 수직선과 화살표 ───────────────────────
NX = lambda v: 200 + 15.5 * v          # −10 ~ +10
TICKS = ''.join(
    '<path d="M%.1f 92 V%d" stroke="#9CA3AF" stroke-width="%s"/>'
    % (NX(v), 100 if v % 5 else 104, '1' if v % 5 else '1.6')
    for v in range(-10, 11))
NUMS = ''.join(
    '<text x="%.1f" y="118" font-size="9.5" fill="#6B7280" text-anchor="middle">%d</text>'
    % (NX(v), v) for v in range(-10, 11, 5))

LESSON25 = """LESSON[25]={
 title:'소인수분해와 암호',
 problem:{
  q:'두 소수 61 과 53 을 곱하면 3233 입니다 — 계산기로 1초면 됩니다. 그런데 거꾸로 <b>3233 을 두 소수의 곱으로 쪼개라</b>고 하면, 사람도 컴퓨터도 한참 걸립니다. 인터넷 뱅킹의 안전이 바로 이 «한쪽만 쉬운» 성질에 기대고 있습니다. 왜 되돌리기가 어려울까요?',
  svg:`<svg viewBox="0 0 400 170" role="img" aria-label="N 이 커질 때 2부터 다 나눠 보는 횟수와 루트 N 까지만 나눠 보는 횟수를 견주는 그림">
    <path d="M36 146 H384 M36 146 V22" stroke="#9CA3AF" stroke-width="1.3"/>
    <path d="__FULL__" stroke="#BE123C" stroke-width="2.2" fill="none"/>
    <path d="__SQRT__" stroke="#0E9384" stroke-width="2.4" fill="none"/>
    <text x="380" y="40" font-size="10" font-weight="800" fill="#BE123C" text-anchor="end">2부터 N까지 다 나눠 보면</text>
    <text x="380" y="128" font-size="10" font-weight="800" fill="#0B6E63" text-anchor="end">√N 까지만 나눠 보면</text>
    <text x="200" y="164" font-size="10.5" fill="#6B7280" text-anchor="middle">N 이 커질수록 — 왜 √N 까지만 보면 되는가? 그런데도 왜 여전히 어려운가?</text>
  </svg>`,
  sit:'p 와 q 를 직접 골라 N = p × q 를 만들고, <b>2부터 하나씩 나눠 보며</b> 몇 번 만에 찾는지 셉니다. 나눠 본 횟수와 √N 을 나란히 놓고 보면 «어디까지만 보면 되는가»가 드러납니다. 그리고 p·q 를 크게 키우면 그 √N 조차 감당할 수 없게 커집니다.'
 },
 predict:{
  q:['N = 3233 을 2부터 나눠 본다면 몇 번쯤 만에 찾을 것 같나요? 어림해 적으세요.',
     '2부터 N 까지 다 나눠 볼 필요가 있을까요? 어디까지만 보면 될지 예상하고 까닭도 적으세요.',
     '“곱하기는 쉬운데 되돌리기는 어렵다”가 왜 암호가 되는지 한 문장으로 적으세요.'] },
 missions:[
  {t:'p 와 q 를 골라 N 을 만들고 <b>직접 나눠</b> 찾아 보세요. 몇 번 만에 찾았나요?', re:'찾았'},
  {t:'p·q 를 더 큰 소수로 바꿔 보세요. 나눠 본 횟수가 어떻게 늘어나나요?', re:'나눠'},
  {t:'아래 <b>탐구 노트</b>로 마무리하세요 — 지금 값을 <b>기록</b>하고, √N 과 견주어 <b>계산</b>하고, 더 큰 수로 바꿔 <b>판단</b>합니다.',
   re:'탐구 노트 통과',
   do:'① 지금 p·q·N·나눠 본 횟수 적기 ② √N 을 구해 횟수와 견주기 ③ 더 큰 소수로 바꿔 다시 재고 규칙 확인',
   hand:'왜 √N 까지만 나눠 보면 되는지 «약수는 짝을 이룬다»로 설명하고, 그런데도 왜 큰 수는 어려운지 적기'}],
 inquiry:{
  id:'pf25', title:'소인수분해 — 곱하기는 쉬운데 되돌리기는 어렵다',
  q:['p 와 q 를 작은 것부터 큰 것까지 바꿔 가며 결과를 8줄 이상 기록하세요.',
     '「나눠 본 횟수」 열과 「√N」 열을 견주어, 횟수가 무엇에 가까운지 찾으세요.',
     '왜 √N 까지만 나눠 보면 되는지 <b>약수가 짝을 이룬다</b>는 사실로 손으로 설명하고, 이 성질이 왜 암호가 되는지도 적으세요.'],
  cols:['p','q','N = p × q','√N','나눠 본 횟수','2~N 을 다 보면'],
  hint:'힌트 — N 의 약수 d 에 대해 N ÷ d 도 약수입니다. 두 약수 중 작은 쪽은 반드시 어디 이하일까요?' },
 apply:{
  q:'새 문제 — N = <b>391</b> 을 두 소수의 곱으로 쪼개면 작은 쪽 소수는? (√391 ≈ 19.8 까지만 보면 됩니다)',
  a:17, tol:0.5,
  why:'391 = 17 × 23. 2·3·5·7·11·13 으로는 나누어떨어지지 않고 17 에서 떨어집니다. 19.8 을 넘길 필요가 없습니다.',
  hint:'2부터 19 까지의 소수만 차례로 나눠 보세요.' },
 demo(root){ return primeDemo(root); }
};

"""

LESSON26 = """LESSON[26]={
 title:'수직선 위의 정수 — 빼기는 왜 반대로 가는가',
 problem:{
  q:'아침 기온이 <b>영하 5도</b>였는데 낮에 <b>3도 올랐</b>습니다. 지금은 몇 도일까요? 그러면 «영하 5도에서 영하 3도를 <b>뺀다</b>»는 것은 무슨 뜻일까요? 빼기는 왜 반대 방향으로 가는 걸까요?',
  svg:`<svg viewBox="0 0 400 170" role="img" aria-label="수직선 위에서 더하기는 오른쪽, 빼기는 왼쪽으로 가는 화살표 그림">
    <path d="M28 92 H372" stroke="#111827" stroke-width="1.8"/>
    <path d="M366 88 l8 4 l-8 4 z" fill="#111827"/>
    __TICKS__
    __NUMS__
    <path d="M__A__ 66 H__B__" stroke="#0E9384" stroke-width="2.4"/>
    <path d="M__B2__ 62 l7 4 l-7 4 z" fill="#0E9384"/>
    <text x="__AM__" y="56" font-size="10" font-weight="800" fill="#0B6E63" text-anchor="middle">+3 — 오른쪽</text>
    <path d="M__C__ 132 H__D__" stroke="#BE123C" stroke-width="2.4"/>
    <path d="M__D2__ 128 l-7 4 l7 4 z" fill="#BE123C"/>
    <text x="__CM__" y="150" font-size="10" font-weight="800" fill="#BE123C" text-anchor="middle">−3 — 왼쪽</text>
    <circle cx="__A__" cy="92" r="4.2" fill="#111827"/>
    <text x="__A__" y="82" font-size="10" font-weight="800" fill="#111827" text-anchor="middle">−5</text>
    <text x="200" y="166" font-size="10.5" fill="#6B7280" text-anchor="middle">화살표의 길이는 늘 |b| — 바뀌는 것은 방향뿐이다</text>
  </svg>`,
  sit:'a 와 b 를 정하고 <b>＋ 와 −</b> 를 바꿔 가며 수직선 위의 화살표가 어느 쪽으로 가는지 봅니다. 「실제로 더해진 값」 칸이 뺄셈일 때 무엇으로 바뀌는지 — 그것이 a − b = a + (−b) 입니다.'
 },
 predict:{
  q:['영하 5도에서 3도가 오르면 몇 도일까요? 수직선에 화살표를 그려 예상하세요.',
     '“−5 − 3” 과 “−5 + (−3)” 은 같을까요, 다를까요? 그렇게 생각한 까닭을 적으세요.',
     '“−5 − (−3)” 은 오른쪽으로 갈까요, 왼쪽으로 갈까요? 예상하고 까닭도 적으세요.'] },
 missions:[
  {t:'a = −5 로 두고 <b>＋3</b> 을 해 보세요. 화살표가 어느 쪽으로 가나요?', re:'오른쪽'},
  {t:'이번에는 <b>−(−3)</b> 을 해 보세요. 화살표 방향이 어떻게 되나요?', re:'왼쪽'},
  {t:'아래 <b>탐구 노트</b>로 마무리하세요 — 지금 값을 <b>기록</b>하고, 실제로 더해진 값을 <b>계산</b>하고, 부호를 바꿔 <b>판단</b>합니다.',
   re:'탐구 노트 통과',
   do:'① 지금 a·연산·b·결과 적기 ② 「실제로 더해진 값」이 b 와 어떤 관계인지 구하기 ③ b 의 부호를 바꿔 다시 재고 규칙 확인',
   hand:'a − b = a + (−b) 를 화살표 그림으로 설명하고, a − (−b) 가 왜 오른쪽으로 가는지도 적기'}],
 inquiry:{
  id:'iz26', title:'수직선 위의 정수 — 빼기는 왜 반대 방향으로 갈까',
  q:['a 와 b 의 부호를 네 가지로 조합하고, 각각 더하기와 빼기를 모두 기록하세요 (8줄 이상).',
     '「실제로 더해진 값」 열을 보세요. 뺄셈일 때 이 값이 b 와 어떤 관계인지 찾으세요.',
     'a − b = a + (−b) 임을 <b>화살표 그림</b>으로 손으로 설명하고, a − (−b) 가 왜 오른쪽으로 가는지도 적으세요.'],
  cols:['a','연산','b','실제로 더해진 값','결과','화살표 방향'],
  hint:'힌트 — 화살표의 길이는 언제나 |b| 입니다. 바뀌는 것은 방향뿐입니다. 무엇이 방향을 정하나요?' },
 apply:{
  q:'새 문제 — 영하 <b>7</b>도에서 <b>−4</b>도를 빼면 몇 도일까요?',
  a:-3, tol:0.5,
  why:'−7 − (−4) = −7 + 4 = −3. 빼기는 부호를 뒤집어 더하는 것이므로 오른쪽으로 4 만큼 갑니다.',
  hint:'− (−4) 는 +4 입니다. 수직선에서 오른쪽으로 4 만큼.' },
 demo(root){ return intDemo(root); }
};

"""

NOTE25 = """
 /* LAB 25 소인수분해 — 내가 나눠 본 횟수를 √N 과 견준다 */
 25:{ h:'내가 나눠 보고 · 내가 세고 · 내가 판단한다',
  c:[
  {t:'기록 — p 와 q 를 골라 <b>직접 나눠</b> 찾은 뒤 화면의 값을 그대로 옮겨 적으세요',
   f:'p = {0} · q = {1} · N = {2} · 나눠 본 횟수 = {3}',
   chk(got, r, mem){
     if(!r) return {ok:false, msg:'아직 화면 값이 없습니다. p 와 q 를 골라 찾아 보세요.'};
     const p=noteNum(r[0]), q=noteNum(r[1]), N=noteNum(r[2]), t=noteNum(r[4]);
     if(N<100) return {ok:false, msg:'N 이 '+N+' 로 너무 작습니다. p·q 를 더 큰 소수로 바꾸세요.'};
     if(![0,1,2,3].every(j=>isFinite(got[j]))) return {ok:false, msg:'네 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-p)>0.5||Math.abs(got[1]-q)>0.5)
       return {ok:false, msg:'화면의 p·q 는 '+p+' 와 '+q+' 입니다.'};
     if(Math.abs(got[2]-N)>0.5) return {ok:false, msg:'N 은 '+N+' 입니다. p × q 를 그대로 옮기세요.'};
     if(Math.abs(got[3]-t)>0.5) return {ok:false, msg:'나눠 본 횟수는 '+t+' 입니다.'};
     mem.p=p; mem.q=q; mem.N=N; mem.t=t;
     return {ok:true, msg:'기록했습니다 — 이 «나눠 본 횟수»가 되돌리기의 값입니다.'};
   }},
  {t:'생각 — √N 을 구해 나눠 본 횟수와 견주고, 2~N 을 다 보는 경우와도 견주세요',
   f:'√N = {0} · 나눠 본 횟수 ÷ √N = {1} · 2~N 을 다 보면 = {2} 번',
   chk(got, r, mem){
     if(mem.N===undefined) return {ok:false, msg:'① 칸을 먼저 통과하세요.'};
     const s=Math.sqrt(mem.N), all=mem.N-1;
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-s)>0.6) return {ok:false, msg:'√'+mem.N+' 을 소수 첫째 자리까지 구하세요.'};
     if(Math.abs(got[1]-mem.t/s)>0.25) return {ok:false, msg:'①의 횟수 '+mem.t+' 를 √N 으로 나누세요.'};
     if(Math.abs(got[2]-all)>0.5) return {ok:false, msg:'2 부터 N 까지면 '+all+' 번입니다.'};
     mem.s=s;
     return {ok:true, msg:'계산했습니다 — 횟수가 √N 언저리입니다. N−1 번이 아니라 √N 번이면 되는 까닭을 곧 판단합니다.'};
   }},
  {t:'판단 — p·q 를 <b>더 큰 소수</b>로 바꿔 다시 찾은 뒤 고르세요',
   f:'새 N = {0} · 새 나눠 본 횟수 = {1}',
   opts:['N 이 커지면 √N 도 커져 되돌리기가 급격히 어려워진다 — 그래서 암호가 된다',
         'N 이 커져도 나눠 본 횟수는 비슷하다',
         'N 이 커지면 오히려 빨리 찾힌다'],
   chk(got, r, mem, pick){
     if(mem.s===undefined) return {ok:false, msg:'② 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const N2=noteNum(r[2]), t2=noteNum(r[4]);
     if(!(N2 > mem.N*1.5)) return {ok:false, msg:'아직 N = '+N2+' 입니다. ①의 '+mem.N+' 보다 훨씬 큰 소수로 바꾸세요.'};
     if(![0,1].every(j=>isFinite(got[j]))) return {ok:false, msg:'두 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-N2)>0.5) return {ok:false, msg:'지금 N 은 '+N2+' 입니다.'};
     if(Math.abs(got[1]-t2)>0.5) return {ok:false, msg:'지금 횟수는 '+t2+' 입니다.'};
     if(pick!==0)
       return {ok:false, msg:'N 이 '+mem.N+' → '+N2+' 로 커지자 횟수가 '+mem.t+' → '+t2+' 로 늘었습니다. 이 사실을 보고 다시 고르세요.'};
     return {ok:true, msg:'판단했습니다 — <b>곱하기는 한 번, 되돌리기는 √N 번.</b> 실제 암호는 자릿수가 600 쯤 되는 소수를 씁니다. 그 √N 은 우주의 나이로도 모자랍니다. 어려움이 곧 안전입니다.'};
   }}
 ]},
"""

NOTE26 = """
 /* LAB 26 수직선 위의 정수 — 빼기는 부호를 뒤집어 더하는 것 */
 26:{ h:'내가 옮기고 · 내가 읽고 · 내가 판단한다',
  c:[
  {t:'기록 — a 와 b 를 정하고 연산을 고른 뒤, 화면의 값을 그대로 옮겨 적으세요',
   f:'a = {0} · b = {1} · 실제로 더해진 값 = {2} · 결과 = {3}',
   chk(got, r, mem){
     if(!r) return {ok:false, msg:'아직 화면 값이 없습니다. 수직선에서 a 와 b 를 옮겨 보세요.'};
     const a=noteNum(r[0]), b=noteNum(r[2]), eff=noteNum(r[3]), res=noteNum(r[4]);
     if(b===0) return {ok:false, msg:'b 가 0 이면 화살표가 없습니다. b 를 0 이 아닌 값으로 바꾸세요.'};
     if(![0,1,2,3].every(j=>isFinite(got[j]))) return {ok:false, msg:'네 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-a)>0.5) return {ok:false, msg:'a 는 '+a+' 입니다.'};
     if(Math.abs(got[1]-b)>0.5) return {ok:false, msg:'b 는 '+b+' 입니다.'};
     if(Math.abs(got[2]-eff)>0.5) return {ok:false, msg:'「실제로 더해진 값」은 '+r[3]+' 입니다.'};
     if(Math.abs(got[3]-res)>0.5) return {ok:false, msg:'결과는 '+res+' 입니다.'};
     mem.a=a; mem.b=b; mem.eff=eff; mem.op=String(r[1]);
     return {ok:true, msg:'기록했습니다 — 「실제로 더해진 값」을 눈여겨보세요.'};
   }},
  {t:'생각 — 실제로 더해진 값이 b 와 어떤 관계인지 수로 나타내세요',
   f:'실제로 더해진 값 ÷ b = {0} · a + (그 값) = {1}',
   chk(got, r, mem){
     if(mem.eff===undefined) return {ok:false, msg:'① 칸을 먼저 통과하세요.'};
     const k=mem.eff/mem.b;
     if(![0,1].every(j=>isFinite(got[j]))) return {ok:false, msg:'두 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-k)>0.05)
       return {ok:false, msg:'①의 「실제로 더해진 값」('+mem.eff+')을 b('+mem.b+')로 나누세요.'};
     if(Math.abs(got[1]-(mem.a+mem.eff))>0.5) return {ok:false, msg:'a 에 그 값을 더하면 결과가 나옵니다.'};
     mem.k=k;
     return {ok:true, msg:'계산했습니다 — 더하기면 '+(k>0?'＋1':'−1')+' 배, 빼기면 그 반대입니다. <b>길이는 |b| 그대로, 방향만 뒤집힙니다.</b>'};
   }},
  {t:'판단 — b 의 <b>부호를 바꿔</b> 같은 연산을 다시 해 본 뒤 고르세요',
   f:'바꾼 b = {0} · 그때 실제로 더해진 값 = {1}',
   opts:['빼기는 <b>부호를 뒤집어 더하는 것</b>이다 — a − b = a + (−b)',
         '빼기는 언제나 왼쪽으로 간다',
         '빼기는 b 의 부호와 상관없이 늘 같은 방향이다'],
   chk(got, r, mem, pick){
     if(mem.k===undefined) return {ok:false, msg:'② 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const b2=noteNum(r[2]), eff2=noteNum(r[3]);
     if(!(b2*mem.b < 0)) return {ok:false, msg:'아직 b 의 부호가 같습니다 — ①에서는 '+mem.b+', 지금은 '+b2+'. 부호를 뒤집으세요.'};
     if(String(r[1])!==mem.op) return {ok:false, msg:'연산은 ①과 같게 두고 b 의 부호만 바꾸세요.'};
     if(![0,1].every(j=>isFinite(got[j]))) return {ok:false, msg:'두 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-b2)>0.5) return {ok:false, msg:'지금 b 는 '+b2+' 입니다.'};
     if(Math.abs(got[1]-eff2)>0.5) return {ok:false, msg:'지금 「실제로 더해진 값」은 '+r[3]+' 입니다.'};
     if(pick!==0)
       return {ok:false, msg:'b 를 '+mem.b+' → '+b2+' 로 바꾸니 더해진 값이 '+mem.eff+' → '+eff2+' 로 함께 뒤집혔습니다. 이 사실을 보고 다시 고르세요.'};
     return {ok:true, msg:'판단했습니다 — <b>a − b = a + (−b).</b> 뺄셈은 새로운 연산이 아니라 «부호를 뒤집은 덧셈»입니다. 그래서 a − (−3) 은 오른쪽으로 3 만큼 갑니다.'};
   }}
 ]},
"""


def main(path):
    h = open(path, encoding='utf-8').read()
    if 'LESSON[25]=' in h:
        print('이미 반영됨')
        return

    A, B = -5.0, -2.0                       # −5 에서 +3
    C, D = -5.0, -8.0                       # −5 에서 −3
    l26 = (LESSON26.replace('__TICKS__', TICKS).replace('__NUMS__', NUMS)
           .replace('__AM__', '%.1f' % ((200 + 15.5 * A + 200 + 15.5 * B) / 2))
           .replace('__CM__', '%.1f' % ((200 + 15.5 * C + 200 + 15.5 * D) / 2))
           .replace('__A__', '%.1f' % (200 + 15.5 * A))
           .replace('__B2__', '%.1f' % (200 + 15.5 * B - 7))
           .replace('__B__', '%.1f' % (200 + 15.5 * B))
           .replace('__C__', '%.1f' % (200 + 15.5 * C))
           .replace('__D2__', '%.1f' % (200 + 15.5 * D + 7))
           .replace('__D__', '%.1f' % (200 + 15.5 * D)))
    l25 = LESSON25.replace('__SQRT__', SQRT_PATH).replace('__FULL__', FULL_PATH)

    a = 'LESSON[356]={'
    assert h.count(a) == 1
    h = h.replace(a, l25 + l26 + a, 1)

    b = '\n};\n\nfunction labNo(spec)'
    assert h.count(b) == 1
    h = h.replace(b, NOTE25 + NOTE26 + b, 1)

    open(path, 'w', encoding='utf-8').write(h)
    print('LAB 25 · 26 수업 모형 + 탐구 노트 삽입 — 파일 %.2f MB' % (len(h.encode('utf-8')) / 1048576))


if __name__ == '__main__':
    main(sys.argv[1])
