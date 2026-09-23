# -*- coding: utf-8 -*-
"""LAB 27 문자와 식 · LAB 28 등식의 성질 · LAB 29 정비례와 반비례 · LAB 30 평행선과 각
— 7단계 수업 모형 + 탐구 노트.

실험 화면은 letterDemo · scaleDemo · propDemo · paraDemo 를 그대로 쓴다.
수업 모형의 inquiry 는 실험 화면이 갖고 있던 것과 **같은 열**을 쓴다 — read() 가 그 길이로 돌려주기 때문이다.

사용: python docs/LAB25_30_수업모형/patch_lab27_30.py src/40-demos.js
"""
import sys

# ══════════════ 문제 그림 — 좌표를 계산한다 ══════════════
# LAB 27 성냥개비: 한 칸 4개, 이후 3개씩
def matches(n, x0=40.0, y0=58.0, w=52.0, h=52.0):
    out = []
    for k in range(n):
        x = x0 + k * w
        out.append('<path d="M%.0f %.0f h%.0f M%.0f %.0f h%.0f M%.0f %.0f v%.0f" '
                   'stroke="#B45309" stroke-width="3.4" stroke-linecap="round"/>'
                   % (x, y0, w, x, y0 + h, w, x, y0, h))
    out.append('<path d="M%.0f %.0f v%.0f" stroke="#B45309" stroke-width="3.4" stroke-linecap="round"/>'
               % (x0 + n * w, y0, h))
    return ''.join(out)


M27 = matches(5)

# LAB 29 지렛대: 반비례 xy = k
L29 = ' '.join('%s%.1f %.1f' % ('M' if i == 0 else 'L', 40 + 330 * (x / 10.0), 146 - 110 * (24.0 / x) / 24.0)
               for i, x in enumerate([1 + k * 9 / 60.0 for k in range(61)]) if 24.0 / x <= 24)

# LAB 30 평행선: 두 평행선과 가로지르는 선
import math
TH = 54.0
CUT = 'M%.0f %.0f L%.0f %.0f' % (120, 150, 120 + 200 / math.tan(math.radians(TH)), -50)


LESSONS = """LESSON[27]={
 title:'문자와 식 — 규칙을 한 줄로',
 problem:{
  q:'성냥개비로 정사각형을 한 줄로 이어 붙입니다. 1칸은 4개, 2칸은 7개, 3칸은 10개… <b>100번째 도형</b>에는 몇 개가 필요할까요? 하나씩 세어 볼 수는 없습니다. 규칙을 <b>한 줄의 식</b>으로 적을 수 있을까요?',
  svg:`<svg viewBox="0 0 400 170" role="img" aria-label="성냥개비로 정사각형을 다섯 칸 이어 붙인 그림">
    __M27__
    <text x="200" y="26" font-size="10.5" font-weight="800" fill="#92400E" text-anchor="middle">첫 칸은 4개 — 그다음부터는 몇 개씩 늘어날까?</text>
    <text x="200" y="164" font-size="10.5" fill="#6B7280" text-anchor="middle">세어서 답하지 말고, 100번째도 바로 답할 수 있는 식을 찾자</text>
  </svg>`,
  sit:'「한 칸 잇기」를 누르면 도형이 한 칸씩 늘어나고, 성냥개비 수와 <b>세 가지 식의 값</b>이 나란히 표시됩니다. 생김새가 다른 세 식이 왜 늘 같은 값을 내는지 — 어느 성냥개비를 어떻게 묶었는지 보면 알 수 있습니다.'
 },
 predict:{
  q:['4칸이면 성냥개비가 몇 개일지 세지 말고 예상하고, 그 까닭도 적으세요.',
     '한 칸이 늘 때마다 <b>몇 개씩</b> 더 드는지 적으세요.',
     '100번째 도형의 개수를 구하는 식을 한 줄로 적어 보세요.'] },
 missions:[
  {t:'「한 칸 잇기」를 눌러 n 을 <b>5 이상</b>으로 늘려 보세요. 한 칸마다 몇 개씩 느나요?', re:'성냥개비'},
  {t:'세 가지 식의 값을 견주어 보세요. 생김새가 다른데 값은 어떤가요?', re:'3n'},
  {t:'아래 <b>탐구 노트</b>로 마무리하세요 — 지금 값을 <b>기록</b>하고, 100번째를 <b>계산</b>하고, 세 식을 견주어 <b>판단</b>합니다.',
   re:'탐구 노트 통과',
   do:'① 지금 n 과 성냥개비 수 적기 ② 한 칸마다 늘어나는 수로 100번째 구하기 ③ 세 식의 값이 같은지 확인',
   hand:'세 식이 왜 모두 같은지 «어느 성냥개비를 어떻게 묶었는지» 그림으로 설명하기'}],
 inquiry:{
  id:'lt27', title:'규칙을 한 줄로 — 문자와 식',
  q:['「한 칸 잇기」로 n 을 1부터 8까지 늘리며 모두 기록하세요.',
     '세 식의 값 열을 비교해 무엇이 같은지 확인하고, 성냥개비가 <b>한 칸 늘 때마다 몇 개씩</b> 드는지 찾으세요.',
     '세 식이 왜 모두 같은지 <b>어느 성냥개비를 어떻게 묶었는지</b> 그림으로 손으로 설명하세요. 그리고 2a 를 “2와 a”로 읽으면 왜 안 되는지도 적으세요.'],
  cols:['n','성냥개비 수','3n + 1','4 + 3(n−1)','4n − (n−1)','앞 칸보다 늘어난 수'],
  hint:'힌트 — 첫 칸은 4개, 그다음부터는 몇 개씩 늘어나나요? 그 “몇 개씩”이 식의 어디에 나타나 있나요?' },
 apply:{
  q:'새 문제 — 같은 규칙으로 <b>100칸</b>을 이어 붙이면 성냥개비는 몇 개 필요할까요?',
  a:301, tol:0.5,
  why:'3n + 1 에 n = 100 을 넣으면 300 + 1 = 301. 첫 칸 4개에 99칸 × 3개를 더해도 4 + 297 = 301 로 같습니다.',
  hint:'한 칸마다 3개씩 늘고, 맨 앞에 세로 1개가 더 있습니다.' },
 demo(root){ return letterDemo(root); }
};

LESSON[28]={
 title:'등식의 성질 — 저울의 균형',
 problem:{
  q:'2x + 3 = 11 을 풀 때 “3을 오른쪽으로 <b>넘긴다</b>”고 배웁니다. 그런데 넘기면 왜 부호가 바뀔까요? 넘기는 것이 아니라 <b>양변에서 3을 뺀</b> 것이라면, 저울은 어떻게 될까요?',
  svg:`<svg viewBox="0 0 400 170" role="img" aria-label="양팔 저울이 균형을 이룬 그림과 한쪽만 덜어 기울어진 그림">
    <path d="M100 118 V52 M40 118 H160" stroke="#6B7280" stroke-width="3"/>
    <path d="M44 52 H156" stroke="#111827" stroke-width="3.4"/>
    <path d="M56 52 V70 M144 52 V70" stroke="#9CA3AF" stroke-width="1.6"/>
    <rect x="34" y="70" width="44" height="18" rx="3" fill="#2563EB" opacity=".75"/>
    <rect x="122" y="70" width="44" height="18" rx="3" fill="#0E9384" opacity=".75"/>
    <text x="100" y="140" font-size="10.5" font-weight="800" fill="#0B6E63" text-anchor="middle">양변에 똑같이 → 균형 유지</text>
    <path d="M300 118 V52 M240 118 H360" stroke="#6B7280" stroke-width="3"/>
    <path d="M246 62 L354 42" stroke="#111827" stroke-width="3.4"/>
    <path d="M258 60 V78 M344 44 V62" stroke="#9CA3AF" stroke-width="1.6"/>
    <rect x="236" y="78" width="44" height="18" rx="3" fill="#2563EB" opacity=".75"/>
    <rect x="322" y="62" width="44" height="18" rx="3" fill="#BE123C" opacity=".75"/>
    <text x="300" y="140" font-size="10.5" font-weight="800" fill="#BE123C" text-anchor="middle">한쪽만 건드리면 → 기운다</text>
    <text x="200" y="164" font-size="10.5" fill="#6B7280" text-anchor="middle">“넘긴다”가 아니라 “양변에서 뺀다” — 그러면 부호가 저절로 설명된다</text>
  </svg>`,
  sit:'단추를 누를 때마다 저울과 식이 함께 바뀝니다. <b>양변에 같은 일</b>을 하면 저울이 그대로이고, <b>한쪽만</b> 건드리면 기웁니다. 「방금 한 일」과 「균형」 칸을 보며 이항의 정체를 확인합니다.'
 },
 predict:{
  q:['2x + 3 = 11 에서 x 를 구하려면 먼저 무엇을 해야 할지 적으세요.',
     '“3을 넘긴다”와 “양변에서 3을 뺀다”는 같은 말일까요? 그렇게 생각한 까닭을 적으세요.',
     '한쪽에서만 3을 빼면 어떻게 될지 예상하세요.'] },
 missions:[
  {t:'<b>양변에서 1 빼기</b> 를 세 번 눌러 왼쪽의 낱개를 없애 보세요. 저울은 어떤가요?', re:'유지'},
  {t:'<b>양변을 2로 나누기</b> 를 눌러 x 를 혼자 남기세요.', re:'나누'},
  {t:'아래 <b>탐구 노트</b>로 마무리하세요 — 상수를 없앤 뒤를 <b>기록</b>하고, x 를 <b>계산</b>하고, 한쪽만 건드려 <b>판단</b>합니다.',
   re:'탐구 노트 통과',
   do:'① 양변에서 1 빼기를 세 번 눌러 «2x = 8» 을 만들고 적기 ② 양변을 2로 나눈 결과 x 구하기 ③ 왼쪽에서만 1 빼기를 눌러 균형이 깨지는 것 확인',
   hand:'등식의 성질 두 가지를 식으로 쓰고, 이항이 왜 부호를 바꾸는지 저울 그림으로 설명하기'}],
 inquiry:{
  id:'sc28', title:'저울이 균형을 이루려면 — 등식의 성질',
  q:['단추를 누를 때마다 기록하세요. 2x + 3 = 11 을 x 만 남을 때까지 푼 과정을 전부 담으세요.',
     '「균형」 열을 보세요. 양변에 같은 일을 했을 때와 한쪽만 건드렸을 때 무엇이 달라지는지 찾으세요.',
     '등식의 성질 두 가지를 식으로 쓰고, <b>이항이 왜 부호를 바꾸는지</b>를 저울 그림으로 손으로 설명하세요.'],
  cols:['왼쪽','오른쪽','방금 한 일','균형'],
  hint:'힌트 — “3을 오른쪽으로 넘겼다”가 아니라 “양변에서 3을 뺐다”로 말해 보세요. 부호가 왜 바뀌는지가 저절로 설명됩니다.' },
 apply:{
  q:'새 문제 — <b>5x − 4 = 16</b> 을 풀면 x 는?',
  a:4, tol:0.1,
  why:'양변에 4를 더하면 5x = 20, 양변을 5로 나누면 x = 4.',
  hint:'먼저 양변에 4를 더해 낱개를 없애세요.' },
 demo(root){ return scaleDemo(root); }
};

LESSON[29]={
 title:'정비례와 반비례 — 지렛대',
 problem:{
  q:'무거운 돌을 지렛대로 듭니다. 받침점에서 <b>두 배 멀리</b> 잡으면 힘은 <b>절반</b>이면 됩니다. 거리를 늘리면 힘이 줄어드는 이 관계와, 거리를 늘리면 값도 함께 느는 관계 — 둘을 무엇으로 가릴까요?',
  svg:`<svg viewBox="0 0 400 170" role="img" aria-label="거리가 늘면 힘이 줄어드는 반비례 곡선 그림">
    <path d="M40 146 H384 M40 146 V22" stroke="#9CA3AF" stroke-width="1.3"/>
    <path d="__L29__" stroke="#0E9384" stroke-width="2.4" fill="none"/>
    <text x="378" y="44" font-size="10" font-weight="800" fill="#0B6E63" text-anchor="end">x × y 가 일정 — 반비례</text>
    <text x="378" y="138" font-size="9.5" fill="#6B7280" text-anchor="end">받침점에서의 거리 x →</text>
    <text x="44" y="18" font-size="9.5" fill="#6B7280">드는 힘 y</text>
    <text x="200" y="166" font-size="10.5" fill="#6B7280" text-anchor="middle">그래프 모양으로 먼저 판정하지 말 것 — 표의 어느 열이 일정한가?</text>
  </svg>`,
  sit:'손잡이를 끌어 거리 x 를 바꾸면 드는 힘 y 가 함께 바뀌고, <b>x × y</b> 와 <b>y ÷ x</b> 가 나란히 표시됩니다. 정비례와 반비례를 오가며 <b>어느 쪽이 일정한지</b>를 봅니다.'
 },
 predict:{
  q:['받침점에서의 거리를 두 배로 하면 드는 힘은 어떻게 될지 예상하세요.',
     '정비례와 반비례를 «무엇이 일정한가»로 구분해 적어 보세요.',
     '그래프 모양만 보고 판정해도 될까요? 그렇게 생각한 까닭을 적으세요.'] },
 missions:[
  {t:'<b>반비례</b>를 고르고 손잡이를 끌어 x 를 바꿔 보세요. x × y 는 어떻게 되나요?', re:'반비례'},
  {t:'<b>정비례</b>로 바꿔 보세요. 이번에는 어느 열이 일정한가요?', re:'정비례'},
  {t:'아래 <b>탐구 노트</b>로 마무리하세요 — 두 자리를 <b>기록</b>하고, x × y 를 <b>계산</b>해 견주고, 관계를 바꿔 <b>판단</b>합니다.',
   re:'탐구 노트 통과',
   do:'① 반비례에서 (x, y, x×y) 적기 ② x 를 바꿔 다시 적고 x×y 가 같은지 보기 ③ 정비례로 바꿔 y÷x 가 일정한지 확인',
   hand:'두 관계를 «무엇이 일정한가»로 정리하고, 그것이 그래프 모양과 어떻게 이어지는지 설명하기'}],
 inquiry:{
  id:'pp29', title:'지렛대는 왜 힘이 덜 들까 — 정비례와 반비례',
  q:['반비례와 정비례를 모두 고르고, 각각 손을 끌어 x 를 바꿔 가며 8줄 이상 기록하세요.',
     '「x × y」 열과 「y ÷ x」 열을 보세요. 각 관계에서 <b>어느 쪽이 일정한지</b> 찾으세요.',
     '두 관계를 “무엇이 일정한가”로 구분해 손으로 정리하고, 그것이 <b>그래프 모양</b>과 어떻게 이어지는지 설명하세요.'],
  cols:['관계','x','y','x × y','y ÷ x','그래프 모양'],
  hint:'힌트 — 그래프 모양을 먼저 보고 판정하지 마세요. 표의 두 열 중 변하지 않는 쪽이 무엇인지가 먼저입니다.' },
 apply:{
  q:'새 문제 — 반비례에서 x = 3 일 때 y = 8 이었습니다. x = 6 이면 y 는?',
  a:4, tol:0.1,
  why:'x × y 가 일정하므로 3 × 8 = 24, 6 × y = 24 → y = 4. 거리를 두 배로 하면 힘은 절반입니다.',
  hint:'x × y 를 먼저 구하세요.' },
 demo(root){ return propDemo(root); }
};

LESSON[30]={
 title:'평행선과 각 — 원근법의 원리',
 problem:{
  q:'그림 속 철길은 멀어질수록 좁아 보입니다. 그런데 실제 철길은 <b>평행</b>합니다. 평행선을 한 직선이 가로지르면 여기저기 각이 생기는데, 그중 <b>어떤 각끼리 같아지고</b> 또 왜 그럴까요?',
  svg:`<svg viewBox="0 0 400 170" role="img" aria-label="두 평행선을 한 직선이 가로지르며 생기는 각들의 그림">
    <path d="M30 56 H370" stroke="#2563EB" stroke-width="2.2"/>
    <path d="M30 122 H370" stroke="#2563EB" stroke-width="2.2"/>
    <path d="__CUT__" stroke="#BE123C" stroke-width="2"/>
    <text x="360" y="48" font-size="9.5" font-weight="800" fill="#1D4ED8" text-anchor="end">평행선 ①</text>
    <text x="360" y="140" font-size="9.5" font-weight="800" fill="#1D4ED8" text-anchor="end">평행선 ②</text>
    <text x="200" y="164" font-size="10.5" fill="#6B7280" text-anchor="middle">같아지는 각은 어느 자리에 있는가 — 그리고 평행이 깨지면?</text>
  </svg>`,
  sit:'가로지르는 선의 각 θ 를 바꾸고, <b>동위각·엇각·동측내각</b> 중 하나를 골라 두 각을 나란히 읽습니다. <b>평행을 깨뜨리는 손잡이</b>도 있어, 성질이 «평행할 때만» 성립한다는 것을 직접 확인할 수 있습니다.'
 },
 predict:{
  q:['평행선을 가로지르면 같은 크기의 각이 생길 것 같나요? 어느 자리일지 그림에 표시해 보세요.',
     '“동위각”이라는 이름은 «크기가 같다»는 뜻일까요, «자리»를 가리키는 말일까요?',
     '평행이 아니면 그 성질이 어떻게 될지 예상하세요.'] },
 missions:[
  {t:'<b>동위각</b>을 고르고 θ 를 여러 값으로 바꿔 보세요. 두 각은 어떤가요?', re:'동위각'},
  {t:'<b>동측내각</b>으로 바꿔 보세요. 두 각의 합은 얼마인가요?', re:'180'},
  {t:'아래 <b>탐구 노트</b>로 마무리하세요 — 두 각을 <b>기록</b>하고, 합과 차를 <b>계산</b>하고, 평행을 깨뜨려 <b>판단</b>합니다.',
   re:'탐구 노트 통과',
   do:'① 동위각에서 두 각 적기 ② 두 각의 차와 합 구하기 ③ 평행을 깨뜨린 뒤 다시 재어 견주기',
   hand:'동위각·엇각·동측내각을 «자리»로 구별해 그림과 함께 설명하고, 왜 평행할 때만 성립하는지 적기'}],
 inquiry:{
  id:'pa30', title:'평행선과 각 — 그림의 원근법',
  q:['각의 종류 세 가지를 모두 고르고, θ 를 여러 값으로 바꿔 가며 기록하세요 (9줄 이상). 평행을 깨뜨린 줄도 반드시 섞으세요.',
     '「두 각의 합」 열과 「성질이 성립하는가」 열을 보세요. <b>어느 종류에서 무엇이 성립하는지</b>, 그리고 <b>평행이 깨지면 어떻게 되는지</b> 찾으세요.',
     '동위각·엇각·동측내각을 <b>자리로</b> 구별해 그림과 함께 손으로 설명하고, 이 관계들이 왜 <b>평행할 때만</b> 성립하는지 적으세요.'],
  cols:['각의 종류','평행인가','첫째 각','둘째 각','두 각의 합','성질이 성립하는가'],
  hint:'힌트 — 각의 이름은 “크기가 같다”는 뜻이 아니라 “어느 자리에 있다”는 뜻입니다. 이름과 성질을 섞지 마세요.' },
 apply:{
  q:'새 문제 — 평행선을 가로지르는 직선이 만든 <b>동측내각</b> 중 한 각이 <b>65°</b> 입니다. 다른 한 각은?',
  a:115, tol:0.5,
  why:'동측내각의 합은 180° 이므로 180 − 65 = 115°.',
  hint:'동측내각은 «같다»가 아니라 «합이 180°» 입니다.' },
 demo(root){ return paraDemo(root); }
};

"""

NOTES = """
 /* LAB 27 문자와 식 — 세어서 답하지 않고 식으로 답한다 */
 27:{ h:'내가 세고 · 내가 식으로 옮기고 · 내가 판단한다',
  c:[
  {t:'기록 — 「한 칸 잇기」로 n 을 <b>5 이상</b>으로 늘린 뒤 화면의 값을 옮겨 적으세요',
   f:'n = {0} · 성냥개비 수 = {1} · 앞 칸보다 늘어난 수 = {2}',
   chk(got, r, mem){
     if(!r) return {ok:false, msg:'아직 화면 값이 없습니다. 「한 칸 잇기」를 눌러 보세요.'};
     const n=noteNum(r[0]), m=noteNum(r[1]), d=noteNum(r[5]);
     if(n<5) return {ok:false, msg:'지금 n = '+n+' 입니다. 5 이상으로 늘리세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-n)>0.5) return {ok:false, msg:'n 은 '+n+' 입니다.'};
     if(Math.abs(got[1]-m)>0.5) return {ok:false, msg:'성냥개비 수는 '+m+' 입니다.'};
     if(Math.abs(got[2]-d)>0.5) return {ok:false, msg:'앞 칸보다 늘어난 수는 '+r[5]+' 입니다.'};
     mem.n=n; mem.m=m; mem.d=d;
     return {ok:true, msg:'기록했습니다 — 한 칸마다 '+d+'개씩 늘어난다는 것이 열쇠입니다.'};
   }},
  {t:'생각 — 늘어나는 수로 <b>100번째</b> 도형의 성냥개비를 구하세요',
   f:'100번째 = 첫 칸 4 + 99 × {0} = {1}',
   chk(got, r, mem){
     if(mem.d===undefined) return {ok:false, msg:'① 칸을 먼저 통과하세요.'};
     if(![0,1].every(j=>isFinite(got[j]))) return {ok:false, msg:'두 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-mem.d)>0.5) return {ok:false, msg:'①에 적은 «늘어난 수»를 넣으세요.'};
     if(Math.abs(got[1]-(4+99*mem.d))>0.5) return {ok:false, msg:'4 + 99 × '+mem.d+' 를 계산하세요.'};
     mem.h=4+99*mem.d;
     return {ok:true, msg:'계산했습니다 — 세지 않고 <b>식으로</b> 답했습니다. 이것이 문자를 쓰는 까닭입니다.'};
   }},
  {t:'판단 — 화면의 <b>세 식</b>의 값을 견주어 본 뒤 고르세요',
   f:'3n + 1 = {0} · 4 + 3(n−1) = {1} · 4n − (n−1) = {2}',
   opts:['생김새가 달라도 <b>값이 늘 같으면</b> 같은 식이다 — 묶는 방법이 다를 뿐이다',
         '식이 다르면 값도 달라야 한다',
         '셋 중 하나만 맞고 나머지는 틀렸다'],
   chk(got, r, mem, pick){
     if(mem.h===undefined) return {ok:false, msg:'② 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const a=noteNum(r[2]), b=noteNum(r[3]), c=noteNum(r[4]);
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-a)>0.5||Math.abs(got[1]-b)>0.5||Math.abs(got[2]-c)>0.5)
       return {ok:false, msg:'화면의 세 값은 '+a+' · '+b+' · '+c+' 입니다.'};
     if(pick!==0)
       return {ok:false, msg:'세 값이 '+a+' · '+b+' · '+c+' 로 모두 같습니다. 이 사실을 보고 다시 고르세요.'};
     return {ok:true, msg:'판단했습니다 — <b>같은 것을 다르게 묶으면 다른 식이 나오지만 값은 같습니다.</b> 그래서 식을 «어떻게 묶었는지»로 읽어야 합니다.'};
   }}
 ]},

 /* LAB 28 등식의 성질 — 양변에 똑같이 해야 저울이 남는다 */
 28:{ h:'내가 덜어 내고 · 내가 나누고 · 내가 판단한다',
  c:[
  {t:'기록 — <b>양변에서 1 빼기</b> 를 세 번 눌러 왼쪽의 낱개를 없앤 뒤 적으세요',
   f:'왼쪽의 x 계수 = {0} · 오른쪽 수 = {1}',
   chk(got, r, mem){
     if(!r) return {ok:false, msg:'아직 화면 값이 없습니다.'};
     if(String(r[3]).indexOf('유지')<0) return {ok:false, msg:'저울이 깨져 있습니다. 「처음으로」를 눌러 다시 시작하세요.'};
     if(String(r[0]).indexOf('+')>=0 || String(r[0]).indexOf('−')>=0)
       return {ok:false, msg:'아직 왼쪽이 «'+r[0]+'» 입니다. 양변에서 1 빼기를 눌러 낱개를 없애세요.'};
     const la=noteNum(r[0]), rb=noteNum(r[1]);
     if(![0,1].every(j=>isFinite(got[j]))) return {ok:false, msg:'두 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-la)>0.1) return {ok:false, msg:'왼쪽은 «'+r[0]+'» 이므로 x 계수는 '+la+' 입니다.'};
     if(Math.abs(got[1]-rb)>0.1) return {ok:false, msg:'오른쪽은 '+rb+' 입니다.'};
     mem.la=la; mem.rb=rb;
     return {ok:true, msg:'기록했습니다 — 양변에서 <b>똑같이</b> 뺐더니 저울이 그대로입니다.'};
   }},
  {t:'생각 — 양변을 x 계수로 나누면 x 가 얼마인지 구하세요',
   f:'x = {0} ÷ {1} = {2}',
   chk(got, r, mem){
     if(mem.la===undefined) return {ok:false, msg:'① 칸을 먼저 통과하세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-mem.rb)>0.1) return {ok:false, msg:'①에 적은 오른쪽 수를 넣으세요.'};
     if(Math.abs(got[1]-mem.la)>0.1) return {ok:false, msg:'①에 적은 x 계수를 넣으세요.'};
     if(Math.abs(got[2]-mem.rb/mem.la)>0.1) return {ok:false, msg:mem.rb+' ÷ '+mem.la+' 를 계산하세요.'};
     mem.x=mem.rb/mem.la;
     return {ok:true, msg:'계산했습니다 — x = '+mem.x+'. 「양변을 2로 나누기」를 눌러 화면에서도 확인해 보세요.'};
   }},
  {t:'판단 — <b>왼쪽에서만 1 빼기</b> 를 눌러 한쪽만 건드려 본 뒤 고르세요',
   f:'저울이 깨진 뒤 — 오른쪽 수 = {0}',
   opts:['양변에 <b>똑같이</b> 해야 등식이 유지된다 — 한쪽만 건드리면 답이 달라진다',
         '한쪽만 바꿔도 답은 그대로다',
         '저울은 기울어도 식은 옳다'],
   chk(got, r, mem, pick){
     if(mem.x===undefined) return {ok:false, msg:'② 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     if(String(r[3]).indexOf('깨짐')<0)
       return {ok:false, msg:'아직 균형이 «'+r[3]+'» 입니다. 「왼쪽에서만 1 빼기」를 눌러 보세요.'};
     const rr=noteNum(r[1]);
     if(!isFinite(got[0])) return {ok:false, msg:'칸을 채우세요.'};
     if(Math.abs(got[0]-rr)>0.2)
       return {ok:false, msg:'지금 오른쪽은 «'+r[1]+'» 입니다. 왼쪽만 «'+r[0]+'» 로 달라졌습니다.'};
     if(pick!==0)
       return {ok:false, msg:'한쪽만 건드리자 저울이 «'+r[3]+'» 이 되었습니다. 이 사실을 보고 다시 고르세요.'};
     return {ok:true, msg:'판단했습니다 — <b>“넘긴다”는 없습니다.</b> 양변에서 3을 뺐기 때문에 오른쪽에 −3 이 나타난 것입니다. 이항의 부호가 바뀌는 까닭이 이것입니다.'};
   }}
 ]},

 /* LAB 29 정비례와 반비례 — 그래프 모양이 아니라 «무엇이 일정한가» */
 29:{ h:'내가 끌고 · 내가 곱해 보고 · 내가 판단한다',
  c:[
  {t:'기록 — <b>반비례</b>를 고르고 손잡이를 끌어 한 자리를 적으세요',
   f:'x = {0} · y = {1} · x × y = {2}',
   chk(got, r, mem){
     if(!r) return {ok:false, msg:'아직 화면 값이 없습니다.'};
     if(String(r[0]).indexOf('반비례')<0) return {ok:false, msg:'먼저 <b>반비례</b>를 고르세요. 지금은 '+r[0]+' 입니다.'};
     const x=noteNum(r[1]), y=noteNum(r[2]), p=noteNum(r[3]);
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-x)>0.15||Math.abs(got[1]-y)>0.15)
       return {ok:false, msg:'화면은 x = '+x+' · y = '+y+' 입니다.'};
     if(Math.abs(got[2]-p)>0.3) return {ok:false, msg:'x × y 는 '+p+' 입니다.'};
     mem.x=x; mem.p=p;
     return {ok:true, msg:'기록했습니다 — 이제 x 를 바꿔 이 곱이 어떻게 되는지 봅니다.'};
   }},
  {t:'생각 — x 를 <b>다른 값</b>으로 끌어 옮긴 뒤 다시 적고, 두 곱을 견주세요',
   f:'새 x = {0} · 새 y = {1} · 새 x × y = {2}',
   chk(got, r, mem){
     if(mem.p===undefined) return {ok:false, msg:'① 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     if(String(r[0]).indexOf('반비례')<0) return {ok:false, msg:'②에서는 반비례를 그대로 두세요.'};
     const x=noteNum(r[1]), y=noteNum(r[2]), p=noteNum(r[3]);
     if(Math.abs(x-mem.x)<0.6) return {ok:false, msg:'x 가 거의 그대로입니다 — 더 옮겨 보세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-x)>0.15||Math.abs(got[1]-y)>0.15)
       return {ok:false, msg:'화면은 x = '+x+' · y = '+y+' 입니다.'};
     if(Math.abs(got[2]-p)>0.3) return {ok:false, msg:'x × y 는 '+p+' 입니다.'};
     mem.p2=p;
     return {ok:true, msg:'계산했습니다 — x 는 바뀌었는데 x × y 는 '+mem.p+' 에서 '+p+' 로 «거의 그대로»입니다.'};
   }},
  {t:'판단 — <b>정비례</b>로 바꿔 y ÷ x 를 확인한 뒤 고르세요',
   f:'정비례에서 x = {0} · y ÷ x = {1}',
   opts:['반비례는 <b>x × y</b> 가, 정비례는 <b>y ÷ x</b> 가 일정하다',
         '둘 다 x × y 가 일정하다',
         '그래프 모양만 보면 바로 구분할 수 있다'],
   chk(got, r, mem, pick){
     if(mem.p2===undefined) return {ok:false, msg:'② 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     if(String(r[0]).indexOf('정비례')<0) return {ok:false, msg:'아직 '+r[0]+' 입니다. 정비례로 바꾸세요.'};
     const x=noteNum(r[1]), q=noteNum(r[4]);
     if(![0,1].every(j=>isFinite(got[j]))) return {ok:false, msg:'두 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-x)>0.15) return {ok:false, msg:'지금 x 는 '+x+' 입니다.'};
     if(Math.abs(got[1]-q)>0.3) return {ok:false, msg:'y ÷ x 는 '+q+' 입니다.'};
     if(pick!==0)
       return {ok:false, msg:'반비례에서는 x × y 가 '+mem.p+' 로 그대로였고, 정비례에서는 y ÷ x 가 '+q+' 입니다. 이 사실을 보고 다시 고르세요.'};
     return {ok:true, msg:'판단했습니다 — <b>이름이 아니라 «무엇이 일정한가»로 가릅니다.</b> 지렛대는 x × y 가 일정해서, 두 배 멀리 잡으면 힘이 절반이 됩니다.'};
   }}
 ]},

 /* LAB 30 평행선과 각 — 이름은 자리를 가리키고, 성질은 평행일 때만 */
 30:{ h:'내가 재고 · 내가 견주고 · 내가 판단한다',
  c:[
  {t:'기록 — <b>동위각</b>을 고르고 θ 를 정한 뒤 두 각을 적으세요',
   f:'첫째 각 = {0} ° · 둘째 각 = {1} °',
   chk(got, r, mem){
     if(!r) return {ok:false, msg:'아직 화면 값이 없습니다.'};
     if(String(r[0]).indexOf('동위각')<0) return {ok:false, msg:'먼저 <b>동위각</b>을 고르세요. 지금은 '+r[0]+' 입니다.'};
     if(String(r[1]).indexOf('어긋남')>=0)
       return {ok:false, msg:'먼저 <b>평행</b>인 상태에서 재세요. 지금은 «'+r[1]+'» 입니다. 「아랫줄을 평행으로 되돌리기」를 누르세요.'};
     const a=noteNum(r[2]), b=noteNum(r[3]);
     if(![0,1].every(j=>isFinite(got[j]))) return {ok:false, msg:'두 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-a)>1||Math.abs(got[1]-b)>1)
       return {ok:false, msg:'화면의 두 각은 '+a+'° 와 '+b+'° 입니다.'};
     mem.a=a; mem.b=b;
     return {ok:true, msg:'기록했습니다 — 두 각을 있는 그대로 옮겨 적었습니다.'};
   }},
  {t:'생각 — 두 각의 <b>차</b>와 <b>합</b>을 구하세요',
   f:'첫째 − 둘째 = {0} · 첫째 + 둘째 = {1}',
   chk(got, r, mem){
     if(mem.a===undefined) return {ok:false, msg:'① 칸을 먼저 통과하세요.'};
     if(![0,1].every(j=>isFinite(got[j]))) return {ok:false, msg:'두 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-(mem.a-mem.b))>1) return {ok:false, msg:'①에 적은 두 각의 차를 구하세요.'};
     if(Math.abs(got[1]-(mem.a+mem.b))>1) return {ok:false, msg:'①에 적은 두 각의 합을 구하세요.'};
     mem.diff=mem.a-mem.b;
     return {ok:true, msg:'계산했습니다 — 차가 '+mem.diff.toFixed(0)+'° 입니다. 동위각은 «같다»는 뜻이었군요.'};
   }},
  {t:'판단 — <b>평행을 깨뜨린 뒤</b> 같은 동위각을 다시 재고 고르세요',
   f:'평행을 깬 뒤 첫째 각 = {0} ° · 둘째 각 = {1} °',
   opts:['각의 이름은 <b>자리</b>를 가리킬 뿐 — 같아지는 것은 <b>평행일 때만</b>이다',
         '동위각은 평행이 아니어도 늘 같다',
         '평행이 깨지면 각이 아예 생기지 않는다'],
   chk(got, r, mem, pick){
     if(mem.diff===undefined) return {ok:false, msg:'② 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     if(String(r[1]).indexOf('어긋남')<0)
       return {ok:false, msg:'아직 «'+r[1]+'» 입니다. 아랫줄을 끌어 평행을 깨뜨리세요.'};
     const a=noteNum(r[2]), b=noteNum(r[3]);
     if(![0,1].every(j=>isFinite(got[j]))) return {ok:false, msg:'두 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-a)>1||Math.abs(got[1]-b)>1)
       return {ok:false, msg:'지금 두 각은 '+a+'° 와 '+b+'° 입니다.'};
     if(pick!==0)
       return {ok:false, msg:'평행일 때는 차가 '+mem.diff.toFixed(0)+'° 였는데 지금은 '+(a-b).toFixed(0)+'° 입니다. 이 사실을 보고 다시 고르세요.'};
     return {ok:true, msg:'판단했습니다 — <b>동위각·엇각·동측내각은 «자리»의 이름입니다.</b> 크기가 같아지는 것은 평행선일 때뿐이고, 그래서 증명에서 «평행하므로»를 반드시 씁니다.'};
   }}
 ]},
"""


def main(path):
    h = open(path, encoding='utf-8').read()
    if 'LESSON[27]=' in h:
        print('이미 반영됨')
        return
    L = (LESSONS.replace('__M27__', M27).replace('__L29__', L29).replace('__CUT__', CUT))
    a = 'LESSON[356]={'
    assert h.count(a) == 1
    h = h.replace(a, L + a, 1)
    b = '\n};\n\nfunction labNo(spec)'
    assert h.count(b) == 1
    h = h.replace(b, NOTES + b, 1)
    open(path, 'w', encoding='utf-8').write(h)
    print('LAB 27 · 28 · 29 · 30 수업 모형 + 탐구 노트 삽입 — 파일 %.2f MB'
          % (len(h.encode('utf-8')) / 1048576))


if __name__ == '__main__':
    main(sys.argv[1])
