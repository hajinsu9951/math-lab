# -*- coding: utf-8 -*-
"""LAB 121~130 — 7단계 수업 모형 + 탐구 노트.

사용: python docs/LAB121_130_수업모형/patch_lab121_130.py src/40-demos.js
"""
import sys, os, importlib.util

try:
    sys.stdout.reconfigure(encoding='utf-8')
except Exception:
    pass

_s = importlib.util.spec_from_file_location(
    'figs121', os.path.join(os.path.dirname(os.path.abspath(__file__)), 'figs.py'))
FG = importlib.util.module_from_spec(_s)
_s.loader.exec_module(FG)


LESSONS = """LESSON[121]={
 title:'소리를 성분으로 쪼개다 — 푸리에의 직관',
 problem:{
  q:'사인 곡선은 <b>매끈합니다.</b> 그런데 사각파는 <b>각이 져</b> 있습니다. 매끈한 것만 아무리 더해도 각진 모양이 나올 리 없어 보입니다 — 정말 그럴까요?',
  svg:`<svg viewBox="0 0 400 170" role="img" aria-label="사인 1개 2개 4개를 더해 갈수록 사각파에 가까워지는 그림">
    __FR121__
  </svg>`,
  sit:'<b>1배음 · 3배음 · 5배음 · 7배음</b> 의 세기를 따로 조절하면 합쳐진 파형이 바뀌고, 목표 파형과 얼마나 어긋나는지 <b>오차</b> 로 나옵니다. 높은 배음을 끄면 모서리가 어떻게 되는지 바로 보입니다.'
 },
 predict:{
  q:['매끈한 사인만 더해서 각진 파형을 만들 수 있을지 예상하고 까닭도 적으세요.',
     '모서리를 날카롭게 하려면 높은 배음이 필요할지 낮은 배음이 필요할지 적어 보세요.',
     '사각파에서 3배음의 세기가 1배음의 몇 분의 몇일지 짐작해 보세요.'] },
 missions:[
  {t:'1배음만 켜 보세요. <b>오차</b> 가 얼마인가요?', re:'오차'},
  {t:'3·5·7배음을 차례로 더해 <b>오차를 줄여</b> 보세요.', re:'배음'},
  {t:'아래 <b>탐구 노트</b>로 마무리하세요 — 세기를 <b>기록</b>하고, 비를 <b>계산</b>하고, 규칙을 <b>판단</b>합니다.',
   re:'탐구 노트 통과',
   do:'① 1배음만 켜고 오차 적기 ② 3배음을 더해 오차가 줄어드는지 보기 ③ 3배음 ÷ 1배음 을 구하기',
   hand:'사각파가 홀수 배음을 1, 1/3, 1/5, 1/7 … 비율로 더해 만들어짐을 쓰고, 높은 배음을 자르면 왜 모서리가 둥글어지는지 설명하기'}],
 inquiry:{
  id:'fr121', title:'소리를 성분으로 쪼개다',
  q:['배음 세기를 바꿔 가며 5줄 이상 기록하세요. 오차가 줄어드는 과정을 남기세요.',
     '「3배음」을 「1배음」으로 나눠 보세요. 어떤 수에 가까운가요?',
     '어떤 파형이든 사인들의 합으로 쪼갤 수 있다는 뜻을 손으로 정리하세요.'],
  cols:['1배음','3배음','5배음','7배음','오차'],
  hint:'힌트 — 각진 파형일수록 높은 배음이 필요합니다. 배음을 잘라내면 모서리가 둥글어집니다.' },
 apply:{
  q:'새 문제 — 사각파에서 <b>3배음</b> 의 세기는 1배음의 몇 배일까요? (소수 셋째 자리)',
  a:0.333, tol:0.01,
  why:'사각파는 홀수 배음을 1 : 1/3 : 1/5 : 1/7 … 로 더해 만듭니다. 3배음은 1배음의 1/3 ≒ 0.333 배입니다.',
  hint:'1, 1/3, 1/5, 1/7 … 의 두 번째 수입니다.' },
 demo(root){ return fourierDemo(root); }
};

LESSON[122]={
 title:'극장 좌석은 모두 몇 석? — 등차수열과 사다리꼴',
 problem:{
  q:'앞줄은 12석, 뒤로 갈수록 한 줄에 <b>2석씩</b> 늘어납니다. 8줄이면 모두 몇 석일까요? 한 줄씩 더하면 되지만, 줄이 <b>100줄</b> 이라면요?',
  svg:`<svg viewBox="0 0 400 170" role="img" aria-label="사다리꼴 좌석 배치를 뒤집어 붙이면 직사각형이 되는 그림">
    __AP122__
  </svg>`,
  sit:'첫 줄 좌석 <b>a₁</b> · 늘어나는 수 <b>d</b> · 줄 수 <b>n</b> 을 바꾸면 끝 줄 <b>aₙ</b> 과 총합 <b>Sₙ</b> 이 계산되고, <b>평균</b> 도 함께 나옵니다.'
 },
 predict:{
  q:['첫 줄 12석, 2석씩 늘어 8줄이면 끝 줄이 몇 석일지 구해 보세요.',
     '총합을 빨리 구하는 방법을 예상해 적으세요.',
     '첫 줄과 끝 줄의 평균이 무슨 뜻일지 짐작해 보세요.'] },
 missions:[
  {t:'a₁·d·n 을 바꿔 <b>Sₙ</b> 이 어떻게 변하는지 보세요.', re:'Sₙ'},
  {t:'<b>평균</b> 과 「첫 줄 · 끝 줄」을 견주어 보세요.', re:'평균'},
  {t:'아래 <b>탐구 노트</b>로 마무리하세요 — 값을 <b>기록</b>하고, 평균 × n 을 <b>계산</b>하고, 까닭을 <b>판단</b>합니다.',
   re:'탐구 노트 통과',
   do:'① 지금 a₁·aₙ·n·Sₙ 적기 ② (a₁+aₙ)÷2 × n 을 계산해 Sₙ 과 견주기 ③ n 을 바꿔 다시 확인',
   hand:'좌석 배치를 뒤집어 얹으면 모든 줄이 (a₁+aₙ) 개인 직사각형이 되는 과정을 그림으로 쓰기'}],
 inquiry:{
  id:'ap122', title:'극장 좌석은 모두 몇 석',
  q:['a₁·d·n 을 바꿔 가며 5줄 이상 기록하세요.',
     '「평균」과 「Sₙ ÷ n」을 견주세요. 무엇이 보이나요?',
     '뒤집어 얹는 방법을 손으로 그려 설명하세요.'],
  cols:['a₁','d','n','aₙ','Sₙ','평균'],
  hint:'힌트 — 좌석 배치를 뒤집어 원래 배치 위에 얹으면 모든 줄이 (a₁+aₙ) 개인 직사각형이 됩니다.' },
 apply:{
  q:'새 문제 — 첫 줄 <b>10석</b>, 한 줄마다 <b>3석</b> 씩 늘어 <b>12줄</b> 이면 모두 몇 석일까요?',
  a:318, tol:0.5,
  why:'끝 줄 a₁₂ = 10 + 11×3 = 43 이고 S = 12 × (10 + 43) ÷ 2 = 12 × 26.5 = 318 석입니다.',
  hint:'먼저 끝 줄 좌석 수를 구한 뒤 Sₙ = n(a₁ + aₙ)/2 를 쓰세요.' },
 demo(root){ return apDemo(root); }
};

LESSON[123]={
 title:'매달 1만원 vs 매달 1 % — 등차와 등비의 대결',
 problem:{
  q:'50만원으로 시작해 <b>매달 5만원씩 더하는 쪽</b> 과 <b>매달 3 %씩 늘어나는 쪽</b> 중 어느 쪽이 더 많아질까요? 처음에는 더하는 쪽이 한참 앞섭니다. 끝까지 그럴까요?',
  svg:`<svg viewBox="0 0 400 170" role="img" aria-label="등차 직선과 등비 곡선이 어느 시점에 교차하는 그림">
    __AG123__
  </svg>`,
  sit:'시작 금액 · <b>d</b>(매달 더하는 돈) · <b>r</b>(매달 늘어나는 비율) · 개월 수를 바꾸면 두 쪽의 금액이 함께 계산되고, <b>역전 시점</b> 이 몇 개월째인지 표시됩니다.'
 },
 predict:{
  q:['처음 몇 달은 어느 쪽이 앞설지 예상하고 까닭도 적으세요.',
     '충분히 오래 두면 어느 쪽이 이길지 예상하세요.',
     '비율을 아주 작게(1 %) 하면 영영 못 따라잡을지 적어 보세요.'] },
 missions:[
  {t:'개월 수를 늘려 <b>역전 시점</b> 이 나오게 해 보세요.', re:'역전'},
  {t:'비율 r 을 <b>작게</b> 해 보세요. 역전이 아예 없어지나요?', re:'등비'},
  {t:'아래 <b>탐구 노트</b>로 마무리하세요 — 두 금액을 <b>기록</b>하고, r 을 바꿔 <b>견주고</b>, 결론을 <b>판단</b>합니다.',
   re:'탐구 노트 통과',
   do:'① 지금 등차·등비 금액과 역전 시점 적기 ② r 을 작게 해 역전 시점이 어떻게 되는지 보기 ③ 개월 수를 늘려 다시 확인',
   hand:'등차는 직선(일차), 등비는 지수임을 쓰고, 지수가 어떤 직선도 결국 넘어서는 까닭을 설명하기'}],
 inquiry:{
  id:'ag123', title:'등차와 등비의 대결',
  q:['d 와 r 을 바꿔 가며 5줄 이상 기록하세요. 역전이 아직인 경우도 넣으세요.',
     '「역전 시점」 열을 보세요. r 이 작아지면 어떻게 되나요? 영영 없어지나요?',
     '지수가 어떤 직선도 결국 넘어서는 까닭을 손으로 설명하세요.'],
  cols:['시작','d','r','n개월 뒤 등차','n개월 뒤 등비','역전 시점'],
  hint:'힌트 — 등차는 직선(일차), 등비는 지수입니다. 지수는 어떤 직선도 결국 넘어섭니다.' },
 apply:{
  q:'새 문제 — 매달 <b>3 %</b> 씩 늘어나면 처음의 <b>두 배</b> 가 되는 데 몇 개월이 걸릴까요? (자연수로)',
  a:24, tol:0.5,
  why:'1.03ⁿ ≥ 2 → n ≥ log 2 ÷ log 1.03 ≒ 23.45 이므로 <b>24개월</b> 째입니다. 「3 %니까 34개월」이 아닙니다.',
  hint:'양변에 로그를 취한 뒤 올림하세요.' },
 demo(root){ return apGpDemo(root); }
};

LESSON[124]={
 title:'집계란 무엇인가 — 시그마와 누적합',
 problem:{
  q:'날마다의 판매량을 적은 표가 있습니다. 「지금까지 모두 얼마?」를 알려면 <b>누적합</b> 을 봅니다. 그런데 누적선이 <b>가파른 날</b> 은 무슨 날일까요?',
  svg:`<svg viewBox="0 0 400 170" role="img" aria-label="날마다의 막대와 그것을 쌓아 온 누적선">
    __SD124__
  </svg>`,
  sit:'자료를 <b>모두 같게</b> · <b>매일 증가</b> · <b>들쭉날쭉</b> 으로 바꿔 가며 <b>총합</b> · <b>평균</b> 과 <b>누적선의 모양</b> 이 어떻게 달라지는지 봅니다.'
 },
 predict:{
  q:['날마다 같은 값이면 누적선이 어떤 모양일지 예상하세요.',
     '날마다 늘어나면 누적선이 어떻게 휠까요?',
     '누적선의 기울기가 무엇을 뜻할지 적어 보세요.'] },
 missions:[
  {t:'<b>모두 같게</b> 로 바꿔 누적선이 어떤 모양인지 보세요.', re:'직선'},
  {t:'<b>매일 증가</b> 로 바꿔 보세요. 선이 어떻게 휘나요?', re:'휘는'},
  {t:'아래 <b>탐구 노트</b>로 마무리하세요 — 모양을 <b>기록</b>하고, 총합을 <b>계산</b>하고, 뜻을 <b>판단</b>합니다.',
   re:'탐구 노트 통과',
   do:'① 모두 같을 때의 총합·평균·누적선 모양 적기 ② 증가로 바꿔 다시 적기 ③ 두 누적선 모양을 견주기',
   hand:'누적합의 «증가량»이 곧 그날의 값임을 쓰고, 그것이 미분·적분과 같은 구조임을 설명하기'}],
 inquiry:{
  id:'sd124', title:'집계란 무엇인가',
  q:['세 가지 자료 모양을 모두 만들어 보며 기록하세요.',
     '「누적선 모양」과 자료의 모양을 견주세요.',
     '누적합의 증가량이 그날의 값인 까닭을 손으로 설명하세요.'],
  cols:['자료 모양','총합','평균','누적선 모양'],
  hint:'힌트 — 누적합의 「증가량」이 곧 그날의 값입니다. 미분과 적분의 관계와 같은 구조입니다.' },
 apply:{
  q:'새 문제 — 닷새 동안 <b>3 · 5 · 2 · 6 · 4</b> 를 팔았습니다. 마지막 날의 <b>누적합</b> 은?',
  a:20, tol:0.5,
  why:'3 + 5 + 2 + 6 + 4 = 20. 누적합의 마지막 값은 언제나 전체 총합과 같습니다.',
  hint:'다섯 수를 모두 더하세요.' },
 demo(root){ return sumDataDemo(root); }
};

LESSON[125]={
 title:'다음 항은 앞 항이 정한다 — 점화식',
 problem:{
  q:'수열을 적는 방법은 <b>식</b> 만 있는 게 아닙니다. 「앞의 두 항을 더하면 다음 항」처럼 <b>만드는 규칙</b> 으로도 적습니다. 그러면 100번째 항은 어떻게 알까요?',
  svg:`<svg viewBox="0 0 400 170" role="img" aria-label="앞의 두 항을 더해 다음 항을 만드는 피보나치 수열">
    __RQ125__
  </svg>`,
  sit:'네 가지 점화식 중 하나를 고르고 「다음 항 만들기」를 누르면 항이 하나씩 자랍니다. <b>마지막 항</b> 과 <b>이웃 비</b> 가 함께 나와, 수열이 어디로 가는지 볼 수 있습니다.'
 },
 predict:{
  q:['1, 1 로 시작해 앞의 두 항을 더하면 다섯째 항이 무엇일지 적어 보세요.',
     '이웃한 두 항의 비가 어떤 수에 가까워질지 예상하세요.',
     '같은 규칙이라도 «씨앗»이 다르면 어떻게 될까요?'] },
 missions:[
  {t:'점화식을 고르고 항을 <b>여러 개</b> 만들어 보세요.', re:'항'},
  {t:'<b>이웃 비</b> 가 어떤 수에 가까워지는지 보세요.', re:'비'},
  {t:'아래 <b>탐구 노트</b>로 마무리하세요 — 항을 <b>기록</b>하고, 비를 <b>계산</b>하고, 규칙을 <b>판단</b>합니다.',
   re:'탐구 노트 통과',
   do:'① 지금 점화식과 마지막 항 적기 ② 항을 더 만들어 이웃 비를 보기 ③ 다른 점화식으로 바꿔 견주기',
   hand:'점화식이 «씨앗 + 만드는 규칙»임을 쓰고, 토끼 쌍·예금 잔액·재귀 알고리즘이 같은 꼴인 까닭을 적기'}],
 inquiry:{
  id:'rq125', title:'다음 항은 앞 항이 정한다',
  q:['네 가지 점화식을 모두 돌려 보며 5줄 이상 기록하세요.',
     '「이웃 비」 열을 보세요. 점화식마다 어떤 수에 가까워지나요?',
     '점화식과 일반항의 차이를 손으로 정리하세요.'],
  cols:['점화식','항 수','마지막 항','이웃 비'],
  hint:'힌트 — 점화식은 「씨앗(첫 항) + 만드는 규칙」입니다. 씨앗이 다르면 전혀 다른 수열이 됩니다.' },
 apply:{
  q:'새 문제 — <b>1, 1</b> 로 시작해 「앞의 두 항을 더한다」를 되풀이할 때 <b>여덟째 항</b> 은?',
  a:21, tol:0.5,
  why:'1, 1, 2, 3, 5, 8, 13, <b>21</b>. 피보나치 수열입니다.',
  hint:'하나씩 더해 가며 여덟 번째까지 적어 보세요.' },
 demo(root){ return recurSeqDemo(root); }
};

LESSON[126]={
 title:'매달 넣으면 만기에 얼마? — 적금과 등비수열',
 problem:{
  q:'매달 10만원씩 6개월 넣으면 원금은 60만원입니다. 그런데 만기에 받는 돈은 그보다 많습니다. <b>똑같이 10만원씩</b> 넣었는데 왜 이자가 생길까요 — 그리고 왜 단순한 곱셈으로 안 될까요?',
  svg:`<svg viewBox="0 0 400 170" role="img" aria-label="넣은 달마다 이자가 붙는 기간이 다른 것을 막대로 보인 그림">
    __SV126__
  </svg>`,
  sit:'매달 넣는 돈 · 이자율 · 기간을 바꾸면 <b>원금 합</b> 과 <b>만기 금액</b>, 그 차인 <b>이자</b> 가 계산됩니다. 기간을 늘리면 이자가 어떻게 자라는지 볼 수 있습니다.'
 },
 predict:{
  q:['첫 달에 넣은 돈과 마지막 달에 넣은 돈 중 어느 쪽에 이자가 더 붙을지 적어 보세요.',
     '만기 금액이 원금 × (1 + 이자율) 로 간단히 나올지 예상하고 까닭도 적으세요.',
     '기간을 두 배로 늘리면 이자가 두 배가 될까요?'] },
 missions:[
  {t:'기간을 바꿔 <b>만기 금액</b> 이 어떻게 변하는지 보세요.', re:'만기'},
  {t:'<b>이자</b> 가 기간에 따라 어떻게 자라는지 보세요.', re:'이자'},
  {t:'아래 <b>탐구 노트</b>로 마무리하세요 — 값을 <b>기록</b>하고, 원금과 <b>견주고</b>, 까닭을 <b>판단</b>합니다.',
   re:'탐구 노트 통과',
   do:'① 지금 원금 합과 만기 금액 적기 ② 둘의 차(이자) 구하기 ③ 기간을 늘려 이자가 몇 배가 되는지 보기',
   hand:'첫 달 돈은 (1+i)^(n−1) 배, 마지막 달 돈은 1 배임을 쓰고, 그 합이 등비수열의 합이 되는 과정을 적기'}],
 inquiry:{
  id:'sv126', title:'매달 넣으면 만기에 얼마',
  q:['매달 넣는 돈·이자율·기간을 바꿔 가며 5줄 이상 기록하세요.',
     '기간만 두 배로 늘렸을 때 「이자」가 두 배가 되는지 견주세요.',
     '만기 금액이 등비수열의 합인 까닭을 손으로 쓰세요.'],
  cols:['매달','이자율','기간','원금 합','만기 금액','이자'],
  hint:'힌트 — 첫 달 돈은 (1+i)^(n−1) 배, 마지막 달 돈은 1 배. 이들을 더하면 등비수열의 합입니다.' },
 apply:{
  q:'새 문제 — <b>1 + 1.01 + 1.01² + 1.01³ + 1.01⁴ + 1.01⁵</b> 의 합은? (소수 셋째 자리)',
  a:6.152, tol:0.01,
  why:'등비수열의 합 (1.01⁶ − 1) ÷ 0.01 = (1.06152 − 1) ÷ 0.01 ≒ 6.152. 단순히 6 이 아닌 것이 이자가 붙은 몫입니다.',
  hint:'첫항 1, 공비 1.01, 항 수 6 인 등비수열의 합입니다.' },
 demo(root){ return savingDemo(root); }
};

LESSON[127]={
 title:'정각에 나가면 얼마? — 좌극한과 우극한',
 problem:{
  q:'주차 요금이 <b>1시간마다 2,000원</b> 입니다. 정확히 <b>2시간</b> 에 나가면 4,000원일까요, 6,000원일까요? 1초만 늦어도 값이 뛴다면, 「2시간일 때의 요금」이란 게 있기는 할까요?',
  svg:`<svg viewBox="0 0 400 170" role="img" aria-label="계단 모양 주차 요금과 2시간에서 갈리는 좌극한 우극한">
    __LL127__
  </svg>`,
  sit:'세 가지 상황(이어진 곡선 · 계단 · 구멍)을 고르고 <b>x = 2 에서 떨어진 거리 h</b> 를 줄여 가며 <b>좌극한</b> 과 <b>우극한</b> 을 봅니다. 두 값이 같아야만 「극한이 있다」고 말합니다.'
 },
 predict:{
  q:['계단에서 h 를 아주 작게 하면 좌·우 두 값이 같아질지 예상하세요.',
     '이어진 곡선에서는 어떨까요?',
     '「그 점의 값」과 「다가가는 값」이 다를 수 있을지 적어 보세요.'] },
 missions:[
  {t:'<b>계단</b> 을 골라 h 를 줄여 보세요. 두 값이 같아지나요?', re:'계단'},
  {t:'<b>이어진</b> 곡선으로 바꿔 보세요. 이번엔 어떤가요?', re:'있음'},
  {t:'아래 <b>탐구 노트</b>로 마무리하세요 — 두 극한을 <b>기록</b>하고, h 를 줄여 <b>견주고</b>, 있는지 <b>판단</b>합니다.',
   re:'탐구 노트 통과',
   do:'① 계단에서 h 를 줄여 좌·우 극한 적기 ② 두 값의 차 구하기 ③ 이어진 곡선으로 바꿔 다시 적기',
   hand:'극한이 «그 점의 값»이 아니라 «다가가는 값»임을 쓰고, 좌·우가 같아야 하는 까닭을 설명하기'}],
 inquiry:{
  id:'ll127', title:'정각에 나가면 얼마',
  q:['세 상황을 모두 돌려 보며 5줄 이상 기록하세요. h 를 여러 크기로 줄이세요.',
     '「좌극한」과 「우극한」을 견주세요. 어느 상황에서 끝까지 다른가요?',
     '극한이 있다는 말의 뜻을 손으로 정리하세요.'],
  cols:['상황','h','좌극한','우극한','f(2)','극한 있나'],
  hint:'힌트 — 계단에서는 h 를 아무리 줄여도 두 값의 차이가 그대로 남습니다.' },
 apply:{
  q:'새 문제 — 1시간마다 2,000원인 계단 요금에서 <b>2시간 지점의 좌극한과 우극한의 차</b> 는? (원)',
  a:2000, tol:1,
  why:'좌극한 4,000원 · 우극한 6,000원 이므로 차는 2,000원 — 계단의 높이 그대로입니다. 두 값이 다르니 x = 2 에서 극한은 없습니다.',
  hint:'계단 한 칸의 높이가 곧 그 차입니다.' },
 demo(root){ return lrLimDemo(root); }
};

LESSON[128]={
 title:'계산기가 오류를 낸다 — 0/0 꼴의 정체',
 problem:{
  q:'<b>(x² − 4) ÷ (x − 2)</b> 에 x = 2 를 넣으면 <b>0 ÷ 0</b> — 계산기는 오류를 냅니다. 그런데 x 를 2 에 아주 가깝게 하면 값이 한 곳으로 모입니다. 답이 없는 걸까요, 있는 걸까요?',
  svg:`<svg viewBox="0 0 400 170" role="img" aria-label="x=2 에만 구멍이 뚫린 직선과 좌우에서 4로 모이는 값">
    __ZD128__
  </svg>`,
  sit:'세 가지 식을 고르고 <b>a 를 그대로 대입</b> 하면 0/0 이 나옵니다. <b>약분·유리화</b> 를 눌러 식을 고치면 같은 자리에서 값이 나옵니다 — 왼쪽 값과 오른쪽 값이 함께 표시됩니다.'
 },
 predict:{
  q:['0 ÷ 0 이 왜 «답이 없다»가 아닌지 생각해 적어 보세요.',
     'x = 2 에 가까워질 때 (x²−4)/(x−2) 가 어떤 수에 모일지 예상하세요.',
     '약분하면 어떤 식이 남을지 적어 보세요.'] },
 missions:[
  {t:'<b>a 를 그대로 대입</b> 해 보세요. 무엇이 나오나요?', re:'a'},
  {t:'<b>약분·유리화</b> 해 보세요. 이제 값이 나오나요?', re:'극한값'},
  {t:'아래 <b>탐구 노트</b>로 마무리하세요 — 두 쪽 값을 <b>기록</b>하고, 차를 <b>계산</b>하고, 뜻을 <b>판단</b>합니다.',
   re:'탐구 노트 통과',
   do:'① 지금 왼쪽 값과 오른쪽 값 적기 ② 두 값의 차 구하기 ③ 다른 식으로 바꿔 다시 확인',
   hand:'0/0 이 «답이 없다»가 아니라 «이 모양으로는 아직 모른다»임을 쓰고, 약분이 무엇을 없앤 것인지 설명하기'}],
 inquiry:{
  id:'zd128', title:'0/0 꼴의 정체',
  q:['세 식을 모두 돌려 보며 기록하세요.',
     '「왼쪽 값」과 「오른쪽 값」을 견주세요. 같은가요?',
     '약분·유리화가 무엇을 없앤 것인지 손으로 설명하세요.'],
  cols:['식','a','왼쪽 값','오른쪽 값','극한값'],
  hint:'힌트 — 0/0 은 「모른다」가 아니라 「이 모양으로는 아직 모른다」입니다.' },
 apply:{
  q:'새 문제 — <b>x → 2</b> 일 때 <b>(x² − 4) ÷ (x − 2)</b> 의 극한값은?',
  a:4, tol:0.05,
  why:'x² − 4 = (x+2)(x−2) 이므로 약분하면 x + 2 가 남고, x → 2 에서 4 입니다. x = 2 에서의 «값»은 없지만 «다가가는 값»은 4 입니다.',
  hint:'분자를 인수분해해 약분하세요.' },
 demo(root){ return zeroDivDemo(root); }
};

LESSON[129]={
 title:'이 끊김은 고칠 수 있을까 — 불연속의 세 종류',
 problem:{
  q:'그래프가 끊겨 있습니다. 그 점의 값을 <b>적당히 정해 주면</b> 이어 붙일 수 있을까요? 어떤 끊김은 고쳐지고 어떤 끊김은 손쓸 수 없습니다 — 무엇이 둘을 가를까요?',
  svg:`<svg viewBox="0 0 400 170" role="img" aria-label="점프 구멍 무한 세 가지 불연속">
    __DC129__
  </svg>`,
  sit:'세 가지 끊김(점프 · 구멍 · 무한)을 고르면 <b>좌극한 · 우극한 · 극한</b> 과 <b>종류</b> 가 표시됩니다. 「그 점의 값을 고쳐 보기」를 누르면 정말 이어지는지 확인할 수 있습니다.'
 },
 predict:{
  q:['구멍 하나뿐인 끊김은 고칠 수 있을지 예상하고 까닭도 적으세요.',
     '좌·우 극한이 다르면 어떤 값을 정해도 이어질 수 있을까요?',
     '연속이려면 무엇무엇이 필요할지 세 가지로 적어 보세요.'] },
 missions:[
  {t:'<b>구멍</b> 을 골라 「값을 고쳐 보기」를 눌러 보세요. 이어지나요?', re:'제거 가능'},
  {t:'<b>점프</b> 로 바꿔 같은 것을 해 보세요. 이번에는?', re:'점프'},
  {t:'아래 <b>탐구 노트</b>로 마무리하세요 — 극한을 <b>기록</b>하고, 종류를 <b>견주고</b>, 기준을 <b>판단</b>합니다.',
   re:'탐구 노트 통과',
   do:'① 구멍일 때의 좌·우 극한과 종류 적기 ② 점프로 바꿔 다시 적기 ③ 두 경우의 «극한» 열을 견주기',
   hand:'연속의 세 조건 ① f(a) 가 있다 ② 극한이 있다 ③ 둘이 같다 — 끊김마다 어느 조건이 깨졌는지 적기'}],
 inquiry:{
  id:'dc129', title:'이 끊김은 고칠 수 있을까',
  q:['세 가지 끊김을 모두 돌려 보며 기록하세요.',
     '「극한」 열을 보세요. 고칠 수 있는 것과 없는 것이 무엇으로 갈리나요?',
     '연속의 세 조건 중 어느 것이 깨졌는지 각각 손으로 적으세요.'],
  cols:['끊김','좌극한','우극한','극한','종류'],
  hint:'힌트 — 극한이 있어야 고칠 수 있습니다. 극한이 없으면 손쓸 방법이 없습니다.' },
 apply:{
  q:'새 문제 — <b>f(x) = (x² − 9) ÷ (x − 3)</b> 은 x = 3 에서 끊겨 있습니다. <b>f(3)</b> 을 얼마로 정하면 이어질까요?',
  a:6, tol:0.05,
  why:'약분하면 x + 3 이므로 x → 3 의 극한은 6 입니다. f(3) = 6 으로 정하면 «제거 가능한» 끊김이 메워집니다.',
  hint:'극한값을 구해 그 값으로 정하세요.' },
 demo(root){ return discontDemo(root); }
};

LESSON[130]={
 title:'근이 어디 있는지 부호만으로 — 사잇값 정리',
 problem:{
  q:'<b>x³ − x − 1 = 0</b> 의 근을 구하려 합니다. 인수분해가 되지 않습니다. 그런데 <b>풀지 않고도</b> 근이 어디쯤 있는지 좁혀 갈 수 있습니다 — 값 두 개의 <b>부호</b> 만으로요.',
  svg:`<svg viewBox="0 0 400 170" role="img" aria-label="f(1) 이 음수 f(2) 가 양수라 그 사이에 근이 있는 그래프">
    __IV130__
  </svg>`,
  sit:'구간의 양 끝 <b>a · b</b> 를 정하면 <b>f(a)</b> 와 <b>f(b)</b> 의 부호가 표시됩니다. 「구간을 반으로 자르기」를 누를 때마다 근을 가둔 <b>폭</b> 이 절반씩 줄어듭니다.'
 },
 predict:{
  q:['f(1) 과 f(2) 를 직접 계산해 부호를 적어 보세요.',
     '부호가 반대라는 것이 무엇을 뜻할지 예상하세요.',
     '구간을 반으로 자르기를 열 번 하면 폭이 얼마나 줄지 어림해 보세요.'] },
 missions:[
  {t:'구간을 잡아 <b>f(a)</b> 와 <b>f(b)</b> 의 부호가 <b>반대</b> 가 되게 해 보세요.', re:'부호'},
  {t:'<b>반으로 자르기</b> 를 여러 번 눌러 폭을 줄여 보세요.', re:'폭'},
  {t:'아래 <b>탐구 노트</b>로 마무리하세요 — 부호를 <b>기록</b>하고, 폭을 <b>계산</b>하고, 까닭을 <b>판단</b>합니다.',
   re:'탐구 노트 통과',
   do:'① 부호가 반대인 구간과 그 폭 적기 ② 반으로 자른 뒤 폭이 절반인지 확인 ③ 여러 번 잘라 폭을 0.05 아래로 줄이기',
   hand:'f 가 연속일 때 부호가 바뀌면 반드시 0 을 지나는 까닭을 그림으로 설명하기'}],
 inquiry:{
  id:'iv130', title:'근이 어디 있는지 부호만으로',
  q:['구간을 잘라 가며 5줄 이상 기록하세요.',
     '「폭」 열을 보세요. 한 번 자를 때마다 몇 배가 되나요?',
     '연속이라는 조건이 왜 꼭 필요한지 손으로 설명하세요.'],
  cols:['a','b','f(a) 부호','f(b) 부호','폭','중점'],
  hint:'힌트 — [1, 2] 에서 시작해 보세요. f(1) = −1, f(2) = 5 입니다.' },
 apply:{
  q:'새 문제 — <b>f(x) = x³ − x − 1</b> 에서 <b>f(1.5)</b> 의 값은? (소수 셋째 자리)',
  a:0.875, tol:0.005,
  why:'1.5³ − 1.5 − 1 = 3.375 − 2.5 = 0.875 (양수). f(1) 이 음수였으니 근은 [1, 1.5] 안으로 좁혀집니다.',
  hint:'1.5 를 세 번 곱한 뒤 1.5 와 1 을 빼세요.' },
 demo(root){ return ivtDemo(root); }
};

"""


def note(no, head, c1, c2, c3):
    return "\n %d:{ h:'%s',\n  c:[\n%s,\n%s,\n%s\n ]},\n" % (no, head, c1, c2, c3)


NOTES = (
 note(121, '내가 더하고 · 내가 재고 · 내가 판단한다',
 """  {t:'기록 — <b>1배음만</b> 켜고(나머지는 0) 오차를 적으세요',
   f:'1배음 = {0} · 오차 = {1}',
   chk(got, r, mem){
     if(!r) return {ok:false, msg:'아직 화면 값이 없습니다.'};
     const a1=noteNum(r[0]), a3=noteNum(r[1]), a5=noteNum(r[2]), a7=noteNum(r[3]), e=noteNum(r[4]);
     if(!(a1>0.1)) return {ok:false, msg:'1배음을 켜세요 — 지금 '+r[0]+' 입니다.'};
     if(a3>0.02||a5>0.02||a7>0.02)
       return {ok:false, msg:'①은 1배음만 켠 상태에서 적습니다 — 3·5·7배음을 0 으로 내리세요. 더하는 것은 ②③에서 합니다.'};
     if(![0,1].every(j=>isFinite(got[j]))) return {ok:false, msg:'두 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-a1)>0.03) return {ok:false, msg:'1배음은 '+r[0]+' 입니다.'};
     if(Math.abs(got[1]-e)>0.004) return {ok:false, msg:'오차는 '+r[4]+' 입니다.'};
     mem.a1=a1; mem.e=e;
     return {ok:true, msg:'기록했습니다 — 사인 하나로는 오차가 '+e+' 입니다. 배음을 더해 봅시다.'};
   }}""",
 """  {t:'생각 — <b>3배음을 더해</b> 오차를 줄이고, 두 세기의 비를 구하세요',
   f:'3배음 = {0} · 그때 오차 = {1} · 3배음 ÷ 1배음 = {2}',
   chk(got, r, mem){
     if(mem.a1===undefined) return {ok:false, msg:'① 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const a1=noteNum(r[0]), a3=noteNum(r[1]), e=noteNum(r[4]);
     if(!(a3>0.05)) return {ok:false, msg:'3배음을 올려 보세요 — 지금 '+r[1]+' 입니다.'};
     if(!(e < mem.e)) return {ok:false, msg:'아직 오차가 '+r[4]+' 입니다. ①의 '+mem.e+' 보다 줄어들게 3배음을 맞추세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-a3)>0.03||Math.abs(got[1]-e)>0.004)
       return {ok:false, msg:'지금은 3배음 '+r[1]+' · 오차 '+r[4]+' 입니다.'};
     if(Math.abs(got[2]-a3/a1)>0.06) return {ok:false, msg:'3배음을 1배음으로 나누세요.'};
     mem.ratio=a3/a1; mem.e2=e;
     return {ok:true, msg:'계산했습니다 — 비가 약 '+mem.ratio.toFixed(2)+' 입니다. 1/3 에 가깝나요?'};
   }}""",
 """  {t:'판단 — <b>5·7배음까지</b> 더해 오차를 더 줄인 뒤 고르세요',
   f:'5배음 = {0} · 7배음 = {1} · 그때 오차 = {2}',
   opts:['사각파는 홀수 배음을 <b>1 : 1/3 : 1/5 : 1/7 …</b> 로 더해 만들어진다 — 높은 배음이 모서리를 만든다',
         '사인만으로는 각진 파형을 만들 수 없다',
         '배음을 많이 더할수록 오차가 커진다'],
   chk(got, r, mem, pick){
     if(mem.ratio===undefined) return {ok:false, msg:'② 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const a5=noteNum(r[2]), a7=noteNum(r[3]), e=noteNum(r[4]);
     if(!(a5>0.02&&a7>0.02)) return {ok:false, msg:'5배음과 7배음도 올려 보세요.'};
     if(!(e < mem.e2)) return {ok:false, msg:'아직 오차가 '+r[4]+' 입니다. ②의 '+mem.e2+' 보다 더 줄이세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-a5)>0.03||Math.abs(got[1]-a7)>0.03||Math.abs(got[2]-e)>0.004)
       return {ok:false, msg:'지금은 '+r[2]+' · '+r[3]+' · '+r[4]+' 입니다.'};
     if(pick!==0)
       return {ok:false, msg:'오차가 '+mem.e+' → '+mem.e2+' → '+e+' 로 줄었습니다. 매끈한 사인만 더했는데 말입니다. 다시 고르세요.'};
     return {ok:true, msg:'판단했습니다 — <b>어떤 파형이든 사인들의 합으로 쪼갤 수 있다</b> 는 것이 푸리에의 생각입니다. 각진 모양일수록 높은 배음이 더 필요하고, 그것을 잘라내면 모서리가 둥글어집니다 — 소리 압축이 바로 이 일을 합니다.'};
   }}""")
 +
 note(122, '내가 세고 · 내가 뒤집고 · 내가 판단한다',
 """  {t:'기록 — a₁·d·n 을 정한 뒤 적으세요',
   f:'a₁ = {0} · aₙ = {1} · Sₙ = {2}',
   chk(got, r, mem){
     if(!r) return {ok:false, msg:'아직 화면 값이 없습니다.'};
     const a1=noteNum(r[0]), n=noteNum(r[2]), an=noteNum(r[3]), S=noteNum(r[4]);
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-a1)>0.5||Math.abs(got[1]-an)>0.5)
       return {ok:false, msg:'화면은 a₁ = '+r[0]+' · aₙ = '+r[3]+' 입니다.'};
     if(Math.abs(got[2]-S)>0.5) return {ok:false, msg:'Sₙ 은 '+r[4]+' 입니다.'};
     mem.a1=a1; mem.an=an; mem.n=n; mem.S=S;
     return {ok:true, msg:'기록했습니다 — 첫 줄과 끝 줄의 평균으로 구해 봅시다.'};
   }}""",
 """  {t:'생각 — <b>(a₁ + aₙ) ÷ 2 × n</b> 을 직접 계산해 견주세요',
   f:'(a₁ + aₙ) ÷ 2 = {0} · × n = {1} · Sₙ 과의 차 = {2}',
   chk(got, r, mem){
     if(mem.a1===undefined) return {ok:false, msg:'① 칸을 먼저 통과하세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-(mem.a1+mem.an)/2)>0.12) return {ok:false, msg:'①의 a₁ 과 aₙ 을 더해 2로 나누세요.'};
     if(Math.abs(got[1]-mem.S)>0.6) return {ok:false, msg:'그 평균에 n = '+mem.n+' 을 곱하세요.'};
     if(Math.abs(got[2])>0.6) return {ok:false, msg:'내가 구한 값에서 ①의 Sₙ 을 빼세요.'};
     mem.ok2=true;
     return {ok:true, msg:'계산했습니다 — 차가 0 입니다. 줄 수를 바꿔도 그럴까요?'};
   }}""",
 """  {t:'판단 — <b>n 을 바꿔</b> 다시 확인한 뒤 고르세요',
   f:'새 n = {0} · 그때 Sₙ = {1} · 평균 = {2}',
   opts:['뒤집어 얹으면 모든 줄이 <b>(a₁ + aₙ) 개</b> 인 직사각형이 된다 — 그 절반이 합이다',
         '총합은 첫 줄 × 줄 수다',
         '줄마다 하나씩 더해 보는 수밖에 없다'],
   chk(got, r, mem, pick){
     if(!mem.ok2) return {ok:false, msg:'② 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const n=noteNum(r[2]), S=noteNum(r[4]), av=noteNum(r[5]);
     if(Math.abs(n-mem.n)<0.5) return {ok:false, msg:'n 이 그대로입니다 — 바꿔 보세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-n)>0.5||Math.abs(got[1]-S)>0.5||Math.abs(got[2]-av)>0.12)
       return {ok:false, msg:'지금은 '+r[2]+' · '+r[4]+' · '+r[5]+' 입니다.'};
     if(pick!==0)
       return {ok:false, msg:'두 번 모두 평균 × n 이 Sₙ 과 같았습니다. 좌석 배치를 뒤집어 얹으면 무엇이 되는지 보고 다시 고르세요.'};
     return {ok:true, msg:'판단했습니다 — <b>Sₙ = n(a₁ + aₙ)/2</b> 는 «첫 줄과 끝 줄의 평균에 줄 수를 곱한 것» 입니다. 100줄이든 1000줄이든 한 번에 구할 수 있습니다.'};
   }}""")
 +
 note(123, '내가 키우고 · 내가 견주고 · 내가 판단한다',
 """  {t:'기록 — 지금 두 쪽의 금액을 적으세요',
   f:'n개월 뒤 등차 = {0} · n개월 뒤 등비 = {1}',
   chk(got, r, mem){
     if(!r) return {ok:false, msg:'아직 화면 값이 없습니다.'};
     const ar=noteNum(r[3]), gm=noteNum(r[4]);
     if(![0,1].every(j=>isFinite(got[j]))) return {ok:false, msg:'두 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-ar)>0.6||Math.abs(got[1]-gm)>0.6)
       return {ok:false, msg:'화면은 '+r[3]+' 와 '+r[4]+' 입니다.'};
     mem.ar=ar; mem.gm=gm; mem.n=noteNum(r[5]);
     return {ok:true, msg:'기록했습니다 — 지금은 어느 쪽이 앞서 있나요?'};
   }}""",
 """  {t:'생각 — <b>개월 수를 늘려</b> 역전 시점이 나오게 하세요',
   f:'역전 시점 = {0} 개월 · 그때 등비 − 등차 = {1}',
   chk(got, r, mem){
     if(mem.ar===undefined) return {ok:false, msg:'① 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     if(String(r[5]).indexOf('아직')>=0)
       return {ok:false, msg:'아직 역전이 없습니다 — 개월 수를 늘리거나 비율을 키워 보세요.'};
     const c=noteNum(r[5]), ar=noteNum(r[3]), gm=noteNum(r[4]);
     if(![0,1].every(j=>isFinite(got[j]))) return {ok:false, msg:'두 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-c)>0.5) return {ok:false, msg:'역전 시점은 '+r[5]+' 입니다.'};
     if(Math.abs(got[1]-(gm-ar))>1.2) return {ok:false, msg:'지금 등비에서 등차를 빼세요.'};
     mem.cross=c;
     return {ok:true, msg:'계산했습니다 — '+c+'개월째에 뒤집혔습니다. 비율을 작게 하면 어떻게 될까요?'};
   }}""",
 """  {t:'판단 — 비율 r 을 <b>작게</b> 하고 개월 수를 충분히 늘린 뒤 고르세요',
   f:'새 r 의 역전 시점 = {0} 개월 · ②보다 늦어진 만큼 = {1}',
   opts:['등차는 직선, 등비는 지수 — <b>비율이 아무리 작아도 지수는 결국 어떤 직선도 넘어선다</b>',
         '비율이 작으면 영영 못 따라잡는다',
         '등차가 언제나 이긴다'],
   chk(got, r, mem, pick){
     if(mem.cross===undefined) return {ok:false, msg:'② 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     if(String(r[5]).indexOf('아직')>=0)
       return {ok:false, msg:'아직 역전이 안 보입니다 — 개월 수를 더 늘려 보세요. 영영 없는지, 늦을 뿐인지 확인하는 것이 이 칸의 목적입니다.'};
     const c=noteNum(r[5]);
     if(!(c > mem.cross)) return {ok:false, msg:'역전이 '+r[5]+' 로 ②와 비슷합니다. r 을 더 작게 해 보세요.'};
     if(![0,1].every(j=>isFinite(got[j]))) return {ok:false, msg:'두 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-c)>0.5) return {ok:false, msg:'지금 역전 시점은 '+r[5]+' 입니다.'};
     if(Math.abs(got[1]-(c-mem.cross))>0.6) return {ok:false, msg:'②의 '+mem.cross+' 를 빼세요.'};
     if(pick!==0)
       return {ok:false, msg:'r 을 줄이니 역전이 '+mem.cross+'개월 → '+c+'개월로 «늦어졌을 뿐» 사라지지 않았습니다. 다시 고르세요.'};
     return {ok:true, msg:'판단했습니다 — <b>등차는 일차, 등비는 지수</b> 입니다. 지수는 처음엔 느려도 결국 어떤 직선보다 커집니다 — 비율이 작으면 그 시점이 뒤로 밀릴 뿐입니다.'};
   }}""")
 +
 note(124, '내가 쌓고 · 내가 견주고 · 내가 판단한다',
 """  {t:'기록 — <b>모두 같게</b> 로 바꾼 뒤 적으세요',
   f:'총합 = {0} · 평균 = {1}',
   chk(got, r, mem){
     if(!r) return {ok:false, msg:'아직 화면 값이 없습니다.'};
     if(String(r[0]).indexOf('모두 같음')<0)
       return {ok:false, msg:'지금 «'+r[0]+'» 입니다. 「모두 같게 (하루 5)」를 눌러 보세요.'};
     const s=noteNum(r[1]), av=noteNum(r[2]);
     if(![0,1].every(j=>isFinite(got[j]))) return {ok:false, msg:'두 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-s)>0.5||Math.abs(got[1]-av)>0.12)
       return {ok:false, msg:'화면은 총합 '+r[1]+' · 평균 '+r[2]+' 입니다.'};
     mem.flat=String(r[3]); mem.s=s;
     return {ok:true, msg:'기록했습니다 — 누적선이 «'+mem.flat+'» 입니다. 자료를 바꿔 봅시다.'};
   }}""",
 """  {t:'생각 — <b>매일 증가</b> 로 바꾼 뒤 적으세요',
   f:'총합 = {0} · 평균 = {1} · 누적선이 휘면 1, 직선이면 0 → {2}',
   chk(got, r, mem){
     if(mem.flat===undefined) return {ok:false, msg:'① 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     if(String(r[0]).indexOf('변동')<0)
       return {ok:false, msg:'지금 «'+r[0]+'» 입니다. 「매일 2씩 증가」를 눌러 보세요.'};
     const s=noteNum(r[1]), av=noteNum(r[2]);
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-s)>0.5||Math.abs(got[1]-av)>0.12)
       return {ok:false, msg:'지금은 총합 '+r[1]+' · 평균 '+r[2]+' 입니다.'};
     if(Math.abs(got[2]-1)>0.01) return {ok:false, msg:'화면의 누적선 모양은 «'+r[3]+'» 입니다.'};
     mem.ok2=true;
     return {ok:true, msg:'계산했습니다 — 날마다의 값이 늘면 누적선이 휩니다.'};
   }}""",
 """  {t:'판단 — <b>들쭉날쭉</b> 으로 바꿔 본 뒤 고르세요',
   f:'총합 = {0} · 누적선이 휘면 1 → {1}',
   opts:['누적선의 <b>기울기</b> 가 곧 그날의 값이다 — 많이 판 날은 누적선이 가파르다',
         '누적선은 자료와 상관없이 늘 직선이다',
         '누적선의 높이가 그날의 값이다'],
   chk(got, r, mem, pick){
     if(!mem.ok2) return {ok:false, msg:'② 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const s=noteNum(r[1]);
     if(![0,1].every(j=>isFinite(got[j]))) return {ok:false, msg:'두 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-s)>0.5) return {ok:false, msg:'총합은 '+r[1]+' 입니다.'};
     if(Math.abs(got[1]-(String(r[3]).indexOf('휘')>=0?1:0))>0.01)
       return {ok:false, msg:'화면의 누적선 모양은 «'+r[3]+'» 입니다.'};
     if(pick!==0)
       return {ok:false, msg:'모두 같을 때는 «'+mem.flat+'», 변동이 있을 때는 «'+r[3]+'» 이었습니다. 막대가 높은 날 누적선이 어떻게 되던가요? 다시 고르세요.'};
     return {ok:true, msg:'판단했습니다 — <b>누적합의 «증가량»이 곧 그날의 값</b> 입니다. 쌓은 것에서 그날 것을 되찾는 이 구조가 나중에 배울 미분과 적분의 관계와 똑같습니다.'};
   }}""")
 +
 note(125, '내가 만들고 · 내가 나누고 · 내가 판단한다',
 """  {t:'기록 — 점화식을 고르고 항을 <b>다섯 개 넘게</b> 만든 뒤 적으세요',
   f:'항 수 = {0} · 마지막 항 = {1}',
   chk(got, r, mem){
     if(!r) return {ok:false, msg:'아직 화면 값이 없습니다.'};
     const n=noteNum(r[1]), last=noteNum(r[2]);
     if(n<5) return {ok:false, msg:'아직 '+n+'항입니다. 「다음 항 만들기」로 다섯 개 넘게 만드세요.'};
     if(![0,1].every(j=>isFinite(got[j]))) return {ok:false, msg:'두 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-n)>0.5||Math.abs(got[1]-last)>0.5)
       return {ok:false, msg:'화면은 '+r[1]+'항 · 마지막 '+r[2]+' 입니다.'};
     mem.k=String(r[0]); mem.n=n;
     return {ok:true, msg:'기록했습니다 — 점화식 «'+mem.k+'» 입니다. 더 만들어 이웃 비를 봅시다.'};
   }}""",
 """  {t:'생각 — 항을 <b>더 만들어</b> 이웃 비를 적으세요',
   f:'새 항 수 = {0} · 마지막 항 = {1} · 이웃 비 = {2}',
   chk(got, r, mem){
     if(mem.n===undefined) return {ok:false, msg:'① 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     if(String(r[0])!==mem.k) return {ok:false, msg:'점화식을 «'+mem.k+'» 로 되돌리고 항만 더 만드세요.'};
     const n=noteNum(r[1]), last=noteNum(r[2]), q=noteNum(r[3]);
     if(!(n > mem.n)) return {ok:false, msg:'항이 '+n+'개입니다. ①의 '+mem.n+'개보다 더 만드세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-n)>0.5||Math.abs(got[1]-last)>0.5)
       return {ok:false, msg:'지금은 '+r[1]+'항 · 마지막 '+r[2]+' 입니다.'};
     if(Math.abs(got[2]-q)>0.004) return {ok:false, msg:'이웃 비는 '+r[3]+' 입니다.'};
     mem.q=q;
     return {ok:true, msg:'계산했습니다 — 이웃 비가 '+q+' 입니다. 다른 점화식은 어떨까요?'};
   }}""",
 """  {t:'판단 — <b>다른 점화식</b> 으로 바꿔 항을 쌓은 뒤 고르세요',
   f:'새 마지막 항 = {0} · 새 이웃 비 = {1}',
   opts:['점화식은 <b>씨앗 + 만드는 규칙</b> 이다 — 규칙이 같아도 씨앗이 다르면 전혀 다른 수열이 된다',
         '점화식으로는 수열을 적을 수 없다',
         '모든 점화식의 이웃 비는 같은 수에 가까워진다'],
   chk(got, r, mem, pick){
     if(mem.q===undefined) return {ok:false, msg:'② 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     if(String(r[0])===mem.k) return {ok:false, msg:'같은 점화식입니다 — 다른 것을 고르세요.'};
     const n=noteNum(r[1]), last=noteNum(r[2]), q=noteNum(r[3]);
     if(n<3) return {ok:false, msg:'항을 세 개 넘게 만들어 이웃 비가 나오게 하세요.'};
     if(![0,1].every(j=>isFinite(got[j]))) return {ok:false, msg:'두 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-last)>0.5) return {ok:false, msg:'마지막 항은 '+r[2]+' 입니다.'};
     if(Math.abs(got[1]-q)>0.004) return {ok:false, msg:'이웃 비는 '+r[3]+' 입니다.'};
     if(pick!==0)
       return {ok:false, msg:'«'+mem.k+'» 의 이웃 비는 '+mem.q+', «'+r[0]+'» 는 '+r[3]+' 입니다. 같지 않습니다. 다시 고르세요.'};
     return {ok:true, msg:'판단했습니다 — <b>점화식은 «다음을 만드는 규칙»</b> 입니다. 토끼 쌍의 수, 예금 잔액, 재귀 알고리즘이 모두 이 꼴로 적히고, 피보나치의 이웃 비는 황금비 1.618… 에 가까워집니다.'};
   }}""")
 +
 note(126, '내가 넣고 · 내가 빼고 · 내가 판단한다',
 """  {t:'기록 — 지금 조건에서 원금 합과 만기 금액을 적으세요',
   f:'기간 = {0} 개월 · 원금 합 = {1} · 만기 금액 = {2}',
   chk(got, r, mem){
     if(!r) return {ok:false, msg:'아직 화면 값이 없습니다.'};
     const n=noteNum(r[2]), p=noteNum(r[3]), t=noteNum(r[4]);
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-n)>0.5) return {ok:false, msg:'기간은 '+r[2]+' 입니다.'};
     if(Math.abs(got[1]-p)>0.6||Math.abs(got[2]-t)>0.15)
       return {ok:false, msg:'화면은 원금 '+r[3]+' · 만기 '+r[4]+' 입니다.'};
     mem.n=n; mem.p=p; mem.t=t; mem.i=noteNum(r[5]);
     return {ok:true, msg:'기록했습니다 — 두 값의 차가 이자입니다.'};
   }}""",
 """  {t:'생각 — <b>만기 − 원금</b> 을 구해 화면의 이자와 견주세요',
   f:'만기 − 원금 = {0} · 화면의 이자와의 차 = {1}',
   chk(got, r, mem){
     if(mem.n===undefined) return {ok:false, msg:'① 칸을 먼저 통과하세요.'};
     if(![0,1].every(j=>isFinite(got[j]))) return {ok:false, msg:'두 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-(mem.t-mem.p))>0.2) return {ok:false, msg:'①의 만기에서 원금을 빼세요.'};
     if(Math.abs(got[1])>0.2) return {ok:false, msg:'내가 구한 값에서 화면의 이자를 빼세요.'};
     mem.ok2=true;
     return {ok:true, msg:'계산했습니다 — 이자가 '+(mem.t-mem.p).toFixed(1)+' 입니다. 기간을 늘리면 어떻게 될까요?'};
   }}""",
 """  {t:'판단 — <b>기간을 두 배</b> 로 늘린 뒤 고르세요',
   f:'새 기간 = {0} 개월 · 새 이자 = {1} · ①의 이자의 몇 배 = {2}',
   opts:['넣은 달마다 <b>이자가 붙는 기간이 달라</b> 만기 금액이 등비수열의 합이 된다 — 이자는 기간보다 빨리 는다',
         '기간을 두 배로 하면 이자도 정확히 두 배가 된다',
         '이자는 기간과 상관없이 일정하다'],
   chk(got, r, mem, pick){
     if(!mem.ok2) return {ok:false, msg:'② 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const n=noteNum(r[2]), it=noteNum(r[5]);
     if(!(n >= mem.n * 2 - 0.5)) return {ok:false, msg:'기간이 '+r[2]+' 입니다. ①의 '+mem.n+'개월의 두 배로 늘리세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-n)>0.5||Math.abs(got[1]-it)>0.2)
       return {ok:false, msg:'지금은 '+r[2]+' · 이자 '+r[5]+' 입니다.'};
     if(Math.abs(got[2]-it/mem.i)>0.25) return {ok:false, msg:'지금 이자를 ①의 이자 '+mem.i+' 로 나누세요.'};
     if(pick!==0)
       return {ok:false, msg:'기간은 두 배인데 이자는 '+(it/mem.i).toFixed(1)+' 배가 되었습니다. 두 배가 아닙니다. 다시 고르세요.'};
     return {ok:true, msg:'판단했습니다 — <b>첫 달 돈은 (1+i)^(n−1) 배, 마지막 달 돈은 1 배</b> 입니다. 이들을 더하면 등비수열의 합이 되고, 기간을 늘리면 «돈이 많아지는 것»과 «오래 묵는 것»이 겹쳐 이자가 기간보다 빨리 늡니다.'};
   }}""")
 +
 note(127, '내가 다가가고 · 내가 견주고 · 내가 판단한다',
 """  {t:'기록 — <b>계단</b> 을 고르고 h 를 줄인 뒤 적으세요',
   f:'h = {0} · 좌극한 = {1} · 우극한 = {2}',
   chk(got, r, mem){
     if(!r) return {ok:false, msg:'아직 화면 값이 없습니다.'};
     if(String(r[0]).indexOf('계단')<0)
       return {ok:false, msg:'지금 «'+r[0]+'» 입니다. 「계단 — 주차 요금」을 고르세요.'};
     const h=noteNum(r[1]), L=noteNum(r[2]), R=noteNum(r[3]);
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-h)>0.0006) return {ok:false, msg:'h 는 '+r[1]+' 입니다.'};
     if(Math.abs(got[1]-L)>0.6||Math.abs(got[2]-R)>0.6)
       return {ok:false, msg:'화면은 '+r[2]+' 와 '+r[3]+' 입니다.'};
     mem.h=h; mem.d=Math.abs(L-R);
     return {ok:true, msg:'기록했습니다 — 두 값의 차가 '+mem.d+' 입니다. h 를 더 줄이면 좁아질까요?'};
   }}""",
 """  {t:'생각 — h 를 <b>더 줄여</b> 두 값의 차를 다시 구하세요',
   f:'새 h = {0} · 좌·우 극한의 차 = {1}',
   chk(got, r, mem){
     if(mem.h===undefined) return {ok:false, msg:'① 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     if(String(r[0]).indexOf('계단')<0) return {ok:false, msg:'「계단」을 고른 채로 하세요.'};
     const h=noteNum(r[1]), L=noteNum(r[2]), R=noteNum(r[3]);
     if(!(h < mem.h)) return {ok:false, msg:'h 가 '+r[1]+' 입니다. ①의 '+mem.h+' 보다 줄이세요.'};
     if(![0,1].every(j=>isFinite(got[j]))) return {ok:false, msg:'두 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-h)>0.0006) return {ok:false, msg:'h 는 '+r[1]+' 입니다.'};
     if(Math.abs(got[1]-Math.abs(L-R))>0.6) return {ok:false, msg:'좌극한과 우극한을 빼세요.'};
     mem.ok2=true;
     return {ok:true, msg:'계산했습니다 — h 를 줄여도 차가 '+Math.abs(L-R)+' 로 그대로입니다.'};
   }}""",
 """  {t:'판단 — <b>이어진</b> 곡선으로 바꿔 같은 것을 해 본 뒤 고르세요',
   f:'그때 좌극한 = {0} · 우극한 = {1} · 두 값의 차 = {2}',
   opts:['극한은 «그 점의 값»이 아니라 <b>«다가가는 값»</b> — 좌·우가 같아야만 극한이 있다고 말한다',
         'h 를 충분히 줄이면 어떤 그래프에서든 좌·우가 같아진다',
         '극한은 그 점의 함숫값과 늘 같다'],
   chk(got, r, mem, pick){
     if(!mem.ok2) return {ok:false, msg:'② 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     if(String(r[0]).indexOf('이어진')<0)
       return {ok:false, msg:'지금 «'+r[0]+'» 입니다. 「이어진 그래프」로 바꾸세요.'};
     const L=noteNum(r[2]), R=noteNum(r[3]);
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-L)>0.02||Math.abs(got[1]-R)>0.02)
       return {ok:false, msg:'지금은 '+r[2]+' 와 '+r[3]+' 입니다.'};
     if(Math.abs(got[2]-Math.abs(L-R))>0.03) return {ok:false, msg:'두 값을 빼세요.'};
     if(pick!==0)
       return {ok:false, msg:'계단에서는 차가 '+mem.d+' 로 끝까지 남았는데, 이어진 곡선에서는 '+Math.abs(L-R).toFixed(3)+' 입니다. 다시 고르세요.'};
     return {ok:true, msg:'판단했습니다 — <b>좌극한과 우극한이 같을 때만 «극한이 있다»</b> 고 말합니다. 계단에서는 h 를 아무리 줄여도 차가 그대로라 x = 2 에서 극한이 없습니다 — 그래서 「정각의 요금」은 규정으로 정해 줘야 합니다.'};
   }}""")
 +
 note(128, '내가 대입하고 · 내가 약분하고 · 내가 판단한다',
 """  {t:'기록 — 식을 고르고 양쪽에서 다가간 값을 적으세요',
   f:'왼쪽 값 = {0} · 오른쪽 값 = {1}',
   chk(got, r, mem){
     if(!r) return {ok:false, msg:'아직 화면 값이 없습니다.'};
     const L=noteNum(r[2]), R=noteNum(r[3]);
     if(![0,1].every(j=>isFinite(got[j]))) return {ok:false, msg:'두 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-L)>0.0006||Math.abs(got[1]-R)>0.0006)
       return {ok:false, msg:'화면은 '+r[2]+' 와 '+r[3]+' 입니다.'};
     mem.s=String(r[0]); mem.L=L; mem.R=R; mem.lim=String(r[4]);
     return {ok:true, msg:'기록했습니다 — 양쪽에서 거의 같은 값으로 모입니다.'};
   }}""",
 """  {t:'생각 — 두 값의 <b>차</b> 를 구하고, 모이는 값을 적으세요',
   f:'오른쪽 − 왼쪽 = {0} · 두 값이 모이는 수 = {1}',
   chk(got, r, mem){
     if(mem.L===undefined) return {ok:false, msg:'① 칸을 먼저 통과하세요.'};
     if(![0,1].every(j=>isFinite(got[j]))) return {ok:false, msg:'두 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-(mem.R-mem.L))>0.002) return {ok:false, msg:'①의 두 값을 빼세요.'};
     const want=noteNum(mem.lim);
     if(!isFinite(want)) return {ok:false, msg:'화면의 극한값은 «'+mem.lim+'» 입니다.'};
     if(Math.abs(got[1]-want)>0.02) return {ok:false, msg:'화면의 극한값은 '+mem.lim+' 입니다.'};
     mem.ok2=true;
     return {ok:true, msg:'계산했습니다 — 차가 거의 0 이고 한 수로 모입니다. 다른 식도 그럴까요?'};
   }}""",
 """  {t:'판단 — <b>다른 식</b> 으로 바꿔 같은 것을 해 본 뒤 고르세요',
   f:'새 왼쪽 값 = {0} · 새 오른쪽 값 = {1} · 새 극한값 = {2}',
   opts:['0/0 은 «답이 없다»가 아니라 <b>«이 모양으로는 아직 모른다»</b> — 약분·유리화로 모양을 바꾸면 값이 보인다',
         '0/0 은 언제나 1 이다',
         '0/0 이 나오면 극한도 없다'],
   chk(got, r, mem, pick){
     if(!mem.ok2) return {ok:false, msg:'② 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     if(String(r[0])===mem.s) return {ok:false, msg:'같은 식입니다 — 다른 식을 고르세요.'};
     const L=noteNum(r[2]), R=noteNum(r[3]), lim=noteNum(r[4]);
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-L)>0.0006||Math.abs(got[1]-R)>0.0006)
       return {ok:false, msg:'지금은 '+r[2]+' 와 '+r[3]+' 입니다.'};
     if(Math.abs(got[2]-lim)>0.02) return {ok:false, msg:'지금 극한값은 '+r[4]+' 입니다.'};
     if(pick!==0)
       return {ok:false, msg:'첫 식의 극한은 '+mem.lim+', 이 식은 '+r[4]+' 입니다. 둘 다 0/0 이었는데 값이 다릅니다. 다시 고르세요.'};
     return {ok:true, msg:'판단했습니다 — <b>0/0 은 «부정형»</b> 입니다. 식마다 값이 다르니 «언제나 얼마»가 아니고, 약분·유리화로 0 이 되는 인수를 없애야 비로소 값이 드러납니다.'};
   }}""")
 +
 note(129, '내가 고쳐 보고 · 내가 견주고 · 내가 판단한다',
 """  {t:'기록 — <b>구멍</b> 을 고른 뒤 적으세요',
   f:'좌극한 = {0} · 우극한 = {1}',
   chk(got, r, mem){
     if(!r) return {ok:false, msg:'아직 화면 값이 없습니다.'};
     if(String(r[0]).indexOf('구멍')<0)
       return {ok:false, msg:'지금 «'+r[0]+'» 입니다. 「구멍 — 한 점만 빠진 그래프」를 고르세요.'};
     const L=noteNum(r[1]), R=noteNum(r[2]);
     if(![0,1].every(j=>isFinite(got[j]))) return {ok:false, msg:'두 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-L)>0.06||Math.abs(got[1]-R)>0.06)
       return {ok:false, msg:'화면은 '+r[1]+' 와 '+r[2]+' 입니다.'};
     mem.hole=String(r[4]); mem.lim=String(r[3]);
     return {ok:true, msg:'기록했습니다 — 좌·우가 같고 극한이 «'+mem.lim+'» 입니다. 종류는 «'+mem.hole+'» 입니다.'};
   }}""",
 """  {t:'생각 — <b>점프</b> 로 바꾼 뒤 적고 견주세요',
   f:'좌극한 = {0} · 우극한 = {1} · 두 값의 차 = {2}',
   chk(got, r, mem){
     if(mem.hole===undefined) return {ok:false, msg:'① 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     if(String(r[0]).indexOf('점프')<0)
       return {ok:false, msg:'지금 «'+r[0]+'» 입니다. 「점프 — 배송비가 뛰는 지점」을 고르세요.'};
     const L=noteNum(r[1]), R=noteNum(r[2]);
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-L)>0.06||Math.abs(got[1]-R)>0.06)
       return {ok:false, msg:'지금은 '+r[1]+' 와 '+r[2]+' 입니다.'};
     if(Math.abs(got[2]-Math.abs(R-L))>0.08) return {ok:false, msg:'두 값을 빼세요.'};
     mem.jump=String(r[4]); mem.jlim=String(r[3]);
     return {ok:true, msg:'계산했습니다 — 여기서는 극한이 «'+mem.jlim+'» 이고 종류가 «'+mem.jump+'» 입니다.'};
   }}""",
 """  {t:'판단 — <b>무한</b> 까지 본 뒤 고르세요',
   f:'세 끊김 중 극한이 있는 것의 개수 = {0}',
   opts:['<b>극한이 있어야 고칠 수 있다</b> — 그 점의 값을 극한값으로 정하면 이어진다. 극한이 없으면 손쓸 수 없다',
         '모든 끊김은 값을 잘 정하면 고칠 수 있다',
         '끊김은 어느 것도 고칠 수 없다'],
   chk(got, r, mem, pick){
     if(mem.jump===undefined) return {ok:false, msg:'② 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     if(String(r[0]).indexOf('무한')<0)
       return {ok:false, msg:'지금 «'+r[0]+'» 입니다. 「무한 — 1/(x−2)²」 을 골라 보고 나서 고르세요.'};
     if(!isFinite(got[0])) return {ok:false, msg:'칸을 채우세요.'};
     if(Math.abs(got[0]-1)>0.01)
       return {ok:false, msg:'구멍은 극한 «'+mem.lim+'», 점프는 «'+mem.jlim+'», 무한은 «'+r[3]+'» 입니다. 몇 개가 극한이 있나요?'};
     if(pick!==0)
       return {ok:false, msg:'구멍만 «'+mem.hole+'» 이고 나머지는 아니었습니다. 셋 중 무엇이 달랐나요? 다시 고르세요.'};
     return {ok:true, msg:'판단했습니다 — <b>연속의 세 조건은 ① f(a) 가 있고 ② 극한이 있고 ③ 둘이 같다</b> 입니다. 구멍은 ①만 빠져서 값을 정해 주면 메워지고(제거 가능), 점프와 무한은 ② 자체가 없어 손쓸 방법이 없습니다.'};
   }}""")
 +
 note(130, '내가 가두고 · 내가 자르고 · 내가 판단한다',
 """  {t:'기록 — 양 끝의 부호가 <b>반대</b> 인 구간을 잡고 적으세요',
   f:'a = {0} · b = {1} · 폭 = {2}',
   chk(got, r, mem){
     if(!r) return {ok:false, msg:'아직 화면 값이 없습니다.'};
     const a=noteNum(r[0]), b=noteNum(r[1]), w=noteNum(r[4]);
     const sa=String(r[2]), sb=String(r[3]);
     if(sa===sb) return {ok:false, msg:'양 끝의 부호가 «'+sa+'» 로 같습니다. [1, 2] 처럼 부호가 반대인 구간을 잡으세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-a)>0.004||Math.abs(got[1]-b)>0.004)
       return {ok:false, msg:'화면은 a = '+r[0]+' · b = '+r[1]+' 입니다.'};
     if(Math.abs(got[2]-w)>0.004) return {ok:false, msg:'폭은 '+r[4]+' 입니다.'};
     mem.w=w;
     return {ok:true, msg:'기록했습니다 — 부호가 반대이니 그 사이에 근이 있습니다. 좁혀 봅시다.'};
   }}""",
 """  {t:'생각 — <b>반으로 자르기</b> 를 한 번 누르고 폭을 적으세요',
   f:'새 폭 = {0} · 앞 폭으로 나눈 값 = {1}',
   chk(got, r, mem){
     if(mem.w===undefined) return {ok:false, msg:'① 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const w=noteNum(r[4]);
     if(!(w < mem.w - 1e-6)) return {ok:false, msg:'폭이 '+r[4]+' 입니다. 「구간을 반으로 자르기」를 누르세요.'};
     if(![0,1].every(j=>isFinite(got[j]))) return {ok:false, msg:'두 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-w)>0.004) return {ok:false, msg:'지금 폭은 '+r[4]+' 입니다.'};
     if(Math.abs(got[1]-0.5)>0.03) return {ok:false, msg:'지금 폭을 ①의 폭 '+mem.w+' 로 나누세요.'};
     mem.ok2=true;
     return {ok:true, msg:'계산했습니다 — 한 번에 절반씩 줄어듭니다. 열 번이면 1/1024 입니다.'};
   }}""",
 """  {t:'판단 — 폭을 <b>0.05 아래</b> 로 줄인 뒤 고르세요',
   f:'그때 폭 = {0} · 중점 = {1}',
   opts:['이어진 그래프에서 <b>양 끝의 부호가 반대면 그 사이에 반드시 근이 있다</b> — 풀지 않고도 가둘 수 있다',
         '부호가 반대여도 근이 없을 수 있다',
         '근을 찾으려면 반드시 식을 풀어야 한다'],
   chk(got, r, mem, pick){
     if(!mem.ok2) return {ok:false, msg:'② 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const w=noteNum(r[4]), mid=noteNum(r[5]);
     if(!(w < 0.05)) return {ok:false, msg:'아직 폭이 '+r[4]+' 입니다. 더 잘라 0.05 아래로 줄이세요.'};
     if(![0,1].every(j=>isFinite(got[j]))) return {ok:false, msg:'두 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-w)>0.004||Math.abs(got[1]-mid)>0.004)
       return {ok:false, msg:'지금은 폭 '+r[4]+' · 중점 '+r[5]+' 입니다.'};
     if(pick!==0)
       return {ok:false, msg:'식을 한 번도 풀지 않고 근을 '+r[5]+' 까지 좁혔습니다. 무엇만 보고 그랬나요? 다시 고르세요.'};
     return {ok:true, msg:'판단했습니다 — <b>f 가 연속이고 f(a)·f(b) < 0 이면 (a, b) 안에 f(c) = 0 인 c 가 있다</b> — 사잇값 정리입니다. 끊긴 그래프에서는 뛰어넘어 버릴 수 있으니 «연속»이 꼭 필요합니다. 계산기가 근을 찾는 방법이 바로 이 반씩 자르기입니다.'};
   }}""")
)


def main(path):
    h = open(path, encoding='utf-8').read()
    if 'LESSON[121]=' in h:
        sys.stdout.write('이미 반영됨\n')
        return
    L = (LESSONS.replace('__FR121__', FG.fr121()).replace('__AP122__', FG.ap122())
         .replace('__AG123__', FG.ag123()).replace('__SD124__', FG.sd124())
         .replace('__RQ125__', FG.rq125()).replace('__SV126__', FG.sv126())
         .replace('__LL127__', FG.ll127()).replace('__ZD128__', FG.zd128())
         .replace('__DC129__', FG.dc129()).replace('__IV130__', FG.iv130()))
    a = 'LESSON[356]={'
    assert h.count(a) == 1
    h = h.replace(a, L + a, 1)
    b = '\n};\n\nfunction labNo(spec)'
    assert h.count(b) == 1
    h = h.replace(b, NOTES + b, 1)
    open(path, 'w', encoding='utf-8').write(h)
    sys.stdout.write('LAB 121~130 ok %.2f MB\n' % (len(h.encode('utf-8')) / 1048576))


if __name__ == '__main__':
    main(sys.argv[1])
