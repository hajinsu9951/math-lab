# -*- coding: utf-8 -*-
"""LAB 131~140 — 7단계 수업 모형 + 탐구 노트.

사용: python docs/LAB131_140_수업모형/patch_lab131_140.py src/40-demos.js
"""
import sys, os, importlib.util

try:
    sys.stdout.reconfigure(encoding='utf-8')
except Exception:
    pass

_s = importlib.util.spec_from_file_location(
    'figs131', os.path.join(os.path.dirname(os.path.abspath(__file__)), 'figs.py'))
FG = importlib.util.module_from_spec(_s)
_s.loader.exec_module(FG)


LESSONS = """LESSON[131]={
 title:'구간을 열어 두면 최댓값이 사라진다 — 최대·최소 정리',
 problem:{
  q:'「오늘 기온이 가장 높았던 순간」은 <b>반드시 있을까요?</b> 당연해 보입니다. 그런데 구간의 <b>끝을 빼거나</b> 그래프가 <b>끊겨 있으면</b> 그 순간이 사라질 수 있습니다.',
  svg:`<svg viewBox="0 0 400 170" role="img" aria-label="닫힌구간과 열린구간에서 끝점을 포함하는지 여부를 견주는 그림">
    __EV131__
  </svg>`,
  sit:'<b>구간</b>(닫힘·열림)과 <b>함수</b>(이어짐·끊김)를 따로 고르면 <b>최댓값</b> · <b>최솟값</b> 이 있는지, 그리고 <b>보장되나</b> 가 표시됩니다. 네 가지 짝을 모두 만들어 볼 수 있습니다.'
 },
 predict:{
  q:['열린구간 (0, 4) 에서 f(x) = x 의 최댓값이 있을지 예상하고 까닭도 적으세요.',
     '끊긴 함수에서는 어떨지 예상하세요.',
     '최댓값이 «반드시» 있으려면 무엇이 필요할지 두 가지로 적어 보세요.'] },
 missions:[
  {t:'구간을 <b>「② 열린구간 (0, 4)」</b> 로 바꿔 보세요. 양 끝이 빠지면 어떻게 되나요?', re:'열림'},
  {t:'구간을 다시 닫고 함수를 <b>「④ 중간에 끊긴 함수」</b> 로 바꿔 보세요.', re:'끊긴 함수라'},
  {t:'아래 <b>탐구 노트</b>로 마무리하세요 — 네 짝을 <b>기록</b>하고, 서로 <b>견주고</b>, 조건을 <b>판단</b>합니다.',
   re:'탐구 노트 통과',
   do:'① 닫힘 + 이어짐 에서 보장되는지 적기 ② 구간만 열어 다시 적기 ③ 함수만 끊어 다시 적기',
   hand:'최대·최소 정리의 두 조건(닫힌구간 · 연속)이 각각 왜 필요한지 반례로 설명하기'}],
 inquiry:{
  id:'ev131', title:'구간을 열어 두면 최댓값이 사라진다',
  q:['구간과 함수를 바꿔 네 가지 짝을 모두 기록하세요.',
     '「보장되나」 열을 보세요. 어느 짝에서만 «예» 인가요?',
     '두 조건이 각각 왜 필요한지 손으로 설명하세요.'],
  cols:['구간','함수','최댓값','최솟값','보장되나'],
  hint:'힌트 — 열린구간에서는 「끝에 다가가지만 도달하지 못하는」 것이 핵심입니다.' },
 apply:{
  q:'새 문제 — 열린구간 <b>(0, 4)</b> 에서 f(x) = x 의 <b>최댓값이 있으면 1, 없으면 0</b> 을 쓰세요.',
  a:0, tol:0.1,
  why:'4 에 얼마든지 가까워지지만 4 에 <b>닿지는 못합니다.</b> 어떤 값을 골라도 그보다 큰 값이 구간 안에 또 있으므로 최댓값이 없습니다.',
  hint:'4 에 가까운 수를 아무거나 골라 보세요. 그보다 큰 수가 구간 안에 또 있나요?' },
 demo(root){ return evtDemo(root); }
};

LESSON[132]={
 title:'여기엔 접선을 못 그린다 — 미분 불가능한 점',
 problem:{
  q:'<b>y = |x|</b> 의 그래프는 x = 0 에서 <b>끊기지 않았습니다.</b> 그런데 그 점에서는 접선을 그릴 수 없습니다. 이어져 있는데 왜 기울기를 말할 수 없을까요?',
  svg:`<svg viewBox="0 0 400 170" role="img" aria-label="y=절댓값x 의 꺾인 점에서 좌우 기울기가 −1 과 +1 로 다른 그림">
    __CU132__
  </svg>`,
  sit:'세 그래프(매끄러움 · 꺾임 · 끊김)를 고르고 <b>기울기를 재는 간격 h</b> 를 줄이면 <b>왼쪽 기울기</b> 와 <b>오른쪽 기울기</b> 가 표시됩니다. 두 값이 같아야만 <b>미분 가능</b> 입니다.'
 },
 predict:{
  q:['y = |x| 의 x = 0 에서 왼쪽·오른쪽 기울기를 각각 예상해 적으세요.',
     'h 를 아주 작게 하면 두 값이 같아질지 예상하세요.',
     '«이어져 있다»와 «미분 가능하다»가 같은 말일지 적어 보세요.'] },
 missions:[
  {t:'<b>「② 꺾인 그래프」</b> 를 골라 h 를 줄여 가며 좌·우 기울기를 견주세요.', re:'만나지 않아'},
  {t:'다시 <b>「① 매끄러운 곡선」</b> 으로 바꿔 h 를 줄여 보세요.', re:'함께 모입니다'},
  {t:'아래 <b>탐구 노트</b>로 마무리하세요 — 두 기울기를 <b>기록</b>하고, h 를 줄여 <b>견주고</b>, 조건을 <b>판단</b>합니다.',
   re:'탐구 노트 통과',
   do:'① 꺾인 그래프에서 좌·우 기울기 적기 ② h 를 줄여 차가 줄어드는지 보기 ③ 매끄러운 곡선으로 바꿔 다시 적기',
   hand:'미분계수가 «평균변화율의 극한»임을 쓰고, 좌·우 극한이 같아야 하는 까닭을 설명하기'}],
 inquiry:{
  id:'cu132', title:'여기엔 접선을 못 그린다',
  q:['세 그래프를 모두 돌려 보며 h 를 여러 크기로 줄여 기록하세요.',
     '「왼쪽」과 「오른쪽」을 견주세요. 어느 그래프에서 끝까지 다른가요?',
     '연속과 미분 가능의 차이를 손으로 정리하세요.'],
  cols:['그래프','h','왼쪽','오른쪽','미분 가능'],
  hint:'힌트 — y = |x| 는 x = 0 에서 이어져 있지만 꺾여 있습니다.' },
 apply:{
  q:'새 문제 — <b>y = |x|</b> 의 x = 0 에서 <b>오른쪽 기울기</b> 는?',
  a:1, tol:0.05,
  why:'x > 0 에서는 y = x 이므로 기울기가 1 입니다. 왼쪽은 y = −x 라 −1 — 두 값이 달라 미분이 안 됩니다.',
  hint:'x > 0 쪽에서 y = |x| 는 어떤 식인가요?' },
 demo(root){ return cuspDemo(root); }
};

LESSON[133]={
 title:'면은 어디를 바라보나 — 접선과 법선',
 problem:{
  q:'공이 곡면에 부딪혀 튕겨 나갑니다. 어느 쪽으로 튈까요? 그것을 정하는 것은 닿은 점에서 면이 <b>바라보는 방향</b> — 접선에 <b>수직</b> 인 선입니다. 그 기울기는 어떻게 구할까요?',
  svg:`<svg viewBox="0 0 400 170" role="img" aria-label="포물선 위 한 점에서의 접선과 그에 수직인 법선">
    __TG133__
  </svg>`,
  sit:'접점의 <b>x 좌표</b> 와 곡선의 계수를 바꾸면 <b>접선의 기울기 m</b> 과 <b>법선의 기울기</b>, 그리고 둘의 <b>곱</b> 이 함께 나옵니다. 곱이 늘 얼마인지 확인합니다.'
 },
 predict:{
  q:['접선과 법선이 이루는 각이 몇 도일지 적어 보세요.',
     '두 기울기의 곱이 얼마일지 예상하세요.',
     '접선이 수평일 때 법선은 어떤 선이 될까요?'] },
 missions:[
  {t:'접점을 옮겨 <b>접선과 법선의 기울기를 곱한 값</b> 을 보세요.', re:'로 확인됩니다'},
  {t:'접점을 <b>x = 0</b> 으로 보내 보세요. 법선이 어떤 선이 되나요?', re:'여기가 극값 후보'},
  {t:'아래 <b>탐구 노트</b>로 마무리하세요 — 두 기울기를 <b>기록</b>하고, 곱을 <b>계산</b>하고, 뜻을 <b>판단</b>합니다.',
   re:'탐구 노트 통과',
   do:'① 지금 접선 m 과 법선 기울기 적기 ② 두 기울기를 곱해 보기 ③ 접점을 옮겨 곱이 그대로인지 확인',
   hand:'두 직선이 수직일 조건이 «기울기의 곱 = −1» 임을 쓰고, 법선이 −1/m 인 까닭을 설명하기'}],
 inquiry:{
  id:'tg133', title:'면은 어디를 바라보나',
  q:['접점과 계수를 바꿔 가며 5줄 이상 기록하세요.',
     '「접선 m」과 「법선」을 곱해 보세요. 늘 얼마인가요?',
     '접선이 수평일 때 법선이 무엇이 되는지 손으로 설명하세요.'],
  cols:['x','y','접선 m','법선','곱'],
  hint:'힌트 — 수직 조건은 두 기울기의 곱이 −1 입니다.' },
 apply:{
  q:'새 문제 — <b>y = 0.5x²</b> 의 <b>x = 1</b> 에서 <b>법선의 기울기</b> 는?',
  a:-1, tol:0.05,
  why:'y′ = x 이므로 x = 1 에서 접선의 기울기는 1 입니다. 법선은 −1 ÷ 1 = −1 — 두 기울기의 곱이 −1 이 됩니다.',
  hint:'먼저 접선의 기울기를 구한 뒤 −1 을 그것으로 나누세요.' },
 demo(root){ return tangentDemo(root); }
};

LESSON[134]={
 title:'봉우리는 어디서 생기나 — 도함수의 부호',
 problem:{
  q:'그래프의 <b>봉우리</b> 는 어디에 생길까요? 「가장 높은 곳」이라고 답하기 쉽지만, 그건 결과입니다. 봉우리가 <b>만들어지는 자리</b> 는 무엇으로 정해질까요?',
  svg:`<svg viewBox="0 0 400 170" role="img" aria-label="f 프라임의 부호가 바뀌는 자리에 극대와 극소가 생기는 삼차함수">
    __SG134__
  </svg>`,
  sit:'<b>f(x) = x³ + bx</b> 의 b 를 바꾸면 <b>f′ = 0 인 자리의 개수</b> 와 <b>극댓값 · 극솟값</b>, <b>증가 구간</b> 이 함께 계산됩니다. b 를 0 이상으로 올려 극값이 사라지는 것도 볼 수 있습니다.'
 },
 predict:{
  q:['f′ > 0 과 f′ < 0 이 각각 그래프의 무엇을 뜻할지 적어 보세요.',
     '봉우리에서 f′ 의 값이 얼마일지 예상하세요.',
     'b 가 양수이면 극값이 있을지 없을지 예상하고 까닭도 적으세요.'] },
 missions:[
  {t:'b 를 <b>음수</b> 로 두고 봉우리·골짜기를 찾아보세요.', re:'봉우리와 골짜기가 각각 하나'},
  {t:'b 를 <b>0 이상</b> 으로 올려 보세요. 극값이 남아 있나요?', re:'계속 증가만'},
  {t:'아래 <b>탐구 노트</b>로 마무리하세요 — 극값을 <b>기록</b>하고, b 를 바꿔 <b>견주고</b>, 조건을 <b>판단</b>합니다.',
   re:'탐구 노트 통과',
   do:'① b 가 음수일 때 극댓값·극솟값 적기 ② 두 값의 차 구하기 ③ b 를 0 이상으로 올려 개수가 어떻게 되는지 보기',
   hand:'3x² + b = 0 이 실근을 가질 b 의 조건을 구하고, 그것이 극값의 개수와 어떻게 이어지는지 쓰기'}],
 inquiry:{
  id:'sg134', title:'봉우리는 어디서 생기나',
  q:['b 를 바꿔 가며 5줄 이상 기록하세요. 극값이 없는 경우도 넣으세요.',
     '「f′=0 개수」와 b 의 부호를 견주세요.',
     '3x² + b = 0 의 실근 조건을 손으로 구하세요.'],
  cols:['b','f′=0 개수','극댓값','극솟값','증가 구간'],
  hint:'힌트 — 3x² + b = 0 이 실근을 가지려면 b 가 어떤 부호여야 하나요?' },
 apply:{
  q:'새 문제 — <b>f(x) = x³ − 3x</b> 의 <b>극댓값</b> 은?',
  a:2, tol:0.05,
  why:'f′ = 3x² − 3 = 0 → x = ±1. x = −1 에서 f(−1) = −1 + 3 = 2 (극대), x = 1 에서 f(1) = −2 (극소)입니다.',
  hint:'f′ = 0 을 풀어 자리를 찾은 뒤 f 에 넣으세요. 왼쪽 자리가 극대입니다.' },
 demo(root){ return signDerivDemo(root); }
};

LESSON[135]={
 title:'종이 한 장으로 가장 큰 상자 — 최적화',
 problem:{
  q:'정사각형 종이의 <b>네 귀퉁이</b> 를 잘라 내고 접어 상자를 만듭니다. 조금만 자르면 <b>낮은 쟁반</b> 이 되고, 많이 자르면 <b>좁은 통</b> 이 됩니다. 가장 큰 상자가 되는 자리는 어디일까요?',
  svg:`<svg viewBox="0 0 400 170" role="img" aria-label="잘라내는 길이에 따른 부피 곡선과 최댓값 자리">
    __BX135__
  </svg>`,
  sit:'종이의 <b>가로·세로</b> 와 <b>잘라내는 길이 x</b> 를 바꾸면 부피가 계산되고, 그 x 가 <b>최적인지</b> 표시됩니다. 「부피가 최대인 x 로」를 누르면 정답 자리로 옮겨 줍니다.'
 },
 predict:{
  q:['x 를 아주 작게 하면 부피가 어떻게 될지 적어 보세요.',
     'x 를 가장 크게 하면 어떻게 될까요?',
     '그 사이 어디쯤에서 가장 클지 예상해 적으세요.'] },
 missions:[
  {t:'x 를 <b>끝까지</b> 키워 보세요. 부피가 어떻게 되나요?', re:'정의역의 오른쪽 끝'},
  {t:'이번에는 부피가 <b>가장 큰 x</b> 를 찾아보세요.', re:'최대 부피 지점'},
  {t:'아래 <b>탐구 노트</b>로 마무리하세요 — 부피를 <b>기록</b>하고, 양쪽과 <b>견주고</b>, 최적을 <b>판단</b>합니다.',
   re:'탐구 노트 통과',
   do:'① 작은 x 에서의 부피 적기 ② 큰 x 로 옮겨 다시 적기 ③ 가장 큰 자리를 찾기',
   hand:'V(x) = x(W−2x)(H−2x) 를 전개해 미분하고, V′(x) = 0 을 푸는 것이 곧 최적을 찾는 일임을 쓰기'}],
 inquiry:{
  id:'bx135', title:'종이 한 장으로 가장 큰 상자',
  q:['x 를 바꿔 가며 5줄 이상 기록하세요. 양 끝 가까운 값도 넣으세요.',
     '「부피」 열을 보세요. 어디서 가장 큰가요?',
     'V′(x) = 0 을 손으로 풀어 그 자리와 맞는지 확인하세요.'],
  cols:['가로','세로','x','부피','최적인가'],
  hint:'힌트 — V(x) = x(W−2x)(H−2x) 를 전개해 미분하면 이차방정식이 됩니다.' },
 apply:{
  q:'새 문제 — <b>30 cm × 30 cm</b> 종이에서 네 귀퉁이를 <b>x cm</b> 씩 잘라 상자를 만들 때, 부피가 최대가 되는 <b>x</b> 는? (cm)',
  a:5, tol:0.15,
  why:'V = x(30−2x)² 를 미분하면 V′ = (30−2x)(30−6x) = 0 → x = 5 또는 15. x = 15 는 상자가 안 되므로 x = 5 이고 그때 부피는 5 × 20 × 20 = 2000 cm³ 입니다.',
  hint:'V = x(30 − 2x)² 를 미분해 0 이 되는 x 를 구하세요. 둘 중 상자가 되는 쪽입니다.' },
 demo(root){ return boxOptDemo(root); }
};

LESSON[136]={
 title:'엘리베이터는 언제 가장 빨랐나 — 위치·속도·가속도',
 problem:{
  q:'엘리베이터를 타면 <b>출발할 때 눌리고</b> <b>멈출 때 뜨는</b> 느낌이 듭니다. 그런데 한창 올라가는 중에는 아무 느낌이 없습니다. 우리 몸이 느끼는 것은 속도일까요, 다른 것일까요?',
  svg:`<svg viewBox="0 0 400 170" role="img" aria-label="위치 그래프의 봉우리에서 속도 그래프가 0 을 지나는 그림">
    __MO136__
  </svg>`,
  sit:'시각 <b>t</b> 를 움직이면 <b>위치 s</b> · <b>속도 v</b> · <b>가속도 a</b> 가 함께 계산되고 <b>방향</b> 이 표시됩니다. 위치 그래프의 봉우리에서 속도가 얼마가 되는지 직접 확인할 수 있습니다.'
 },
 predict:{
  q:['위치 그래프의 봉우리에서 속도가 얼마일지 예상하세요.',
     '«속도가 0» 과 «가속도가 0» 중 몸이 느끼는 것은 무엇일까요?',
     '속도가 음수라는 것이 무슨 뜻일지 적어 보세요.'] },
 missions:[
  {t:'t 를 옮겨 <b>멈추는 순간</b> 을 찾아보세요.', re:'속도가 0'},
  {t:'「② 올라갔다 되돌아오는 운동」 으로 바꾸고 t 를 더 뒤로 밀어 보세요.', re:'되돌아오는 중'},
  {t:'아래 <b>탐구 노트</b>로 마무리하세요 — 세 값을 <b>기록</b>하고, 봉우리와 <b>견주고</b>, 뜻을 <b>판단</b>합니다.',
   re:'탐구 노트 통과',
   do:'① 올라가는 중의 t·s·v 적기 ② v 가 0 이 되는 t 를 찾아 적기 ③ 그때 위치가 가장 큰지 확인',
   hand:'위치를 미분하면 속도, 속도를 미분하면 가속도임을 쓰고, 몸이 느끼는 것이 무엇인지 설명하기'}],
 inquiry:{
  id:'mo136', title:'엘리베이터는 언제 가장 빨랐나',
  q:['t 를 바꿔 가며 5줄 이상 기록하세요. 속도가 0 이 되는 순간을 꼭 넣으세요.',
     '「v」가 0 인 곳에서 「s」가 어떤 값인지 보세요.',
     '위치·속도·가속도의 관계를 손으로 정리하세요.'],
  cols:['t','s','v','a','방향'],
  hint:'힌트 — 위치 그래프의 봉우리에서 속도가 0 입니다.' },
 apply:{
  q:'새 문제 — 위치 그래프가 <b>가장 높은 순간</b> 에 속도는 얼마일까요?',
  a:0, tol:0.05,
  why:'봉우리에서는 접선이 수평이므로 s′ = v = 0 입니다. 올라가다 멈추고 방향이 바뀌는 자리입니다.',
  hint:'봉우리에서 접선의 기울기는 얼마인가요?' },
 demo(root){ return motionDemo(root); }
};

LESSON[137]={
 title:'곡선 아래 넓이를 어떻게 재나 — 구분구적법',
 problem:{
  q:'직사각형 넓이는 가로 × 세로입니다. 그런데 위가 <b>굽은</b> 도형의 넓이는 어떻게 잴까요? 자로 잴 수도, 공식도 없습니다 — 그러면 포기해야 할까요?',
  svg:`<svg viewBox="0 0 400 170" role="img" aria-label="곡선 아래를 여섯 개의 직사각형으로 덮어 넓이를 어림하는 그림">
    __RM137__
  </svg>`,
  sit:'<b>직사각형 개수 n</b> 과 <b>높이를 재는 위치</b>(왼쪽 끝 · 오른쪽 끝 · 가운데)를 바꾸면 <b>합</b> 과 참값과의 <b>오차</b> 가 계산됩니다. n 을 키우면 오차가 어디로 가는지 볼 수 있습니다.'
 },
 predict:{
  q:['직사각형으로 덮으면 참값보다 클지 작을지 예상하세요 — 높이를 왼쪽 끝에서 재면요?',
     'n 을 아주 크게 하면 오차가 어떻게 될까요?',
     '가운데에서 재면 왼쪽·오른쪽보다 나을지 예상하세요.'] },
 missions:[
  {t:'n 을 <b>크게</b> 늘려 참값에 다가가 보세요.', re:'오차가 0.001 아래'},
  {t:'n 을 작게 줄이고 높이를 <b>가운데</b> 에서 재 보세요.', re:'위아래 오차가 서로 상쇄'},
  {t:'아래 <b>탐구 노트</b>로 마무리하세요 — 합을 <b>기록</b>하고, n 을 키워 <b>견주고</b>, 극한을 <b>판단</b>합니다.',
   re:'탐구 노트 통과',
   do:'① n 이 작을 때의 합과 오차 적기 ② n 을 크게 해 다시 적기 ③ 재는 위치를 바꿔 합이 커지는지 작아지는지 보기',
   hand:'왼쪽 끝은 늘 참값보다 작고 오른쪽 끝은 늘 큰 까닭을 그림으로 설명하고, n → ∞ 에서 둘이 만나는 뜻을 쓰기'}],
 inquiry:{
  id:'rm137', title:'곡선 아래 넓이를 어떻게 재나',
  q:['n 과 재는 위치를 바꿔 가며 5줄 이상 기록하세요.',
     '「오차」 열을 보세요. n 을 두 배로 하면 오차가 어떻게 되나요?',
     '왼쪽 끝과 오른쪽 끝의 합 사이에 참값이 끼어 있는 까닭을 손으로 설명하세요.'],
  cols:['n','재는 위치','Δx','합','오차'],
  hint:'힌트 — 왼쪽 끝은 늘 참값보다 작고, 오른쪽 끝은 늘 큽니다.' },
 apply:{
  q:'새 문제 — y = x² 를 0 부터 1 까지, <b>n = 4</b> 의 <b>왼쪽 끝</b> 직사각형 합은? (소수 넷째 자리)',
  a:0.2188, tol:0.0006,
  why:'Δx = 0.25 이고 높이는 0², 0.25², 0.5², 0.75² 이므로 (0 + 0.0625 + 0.25 + 0.5625) × 0.25 = 0.21875 ≒ 0.2188. 참값 0.3333 보다 작습니다.',
  hint:'네 칸의 왼쪽 끝 x 값을 제곱해 더한 뒤 0.25 를 곱하세요.' },
 demo(root){ return riemannDemo(root); }
};

LESSON[138]={
 title:'넓이를 미분하면 높이 — 미적분의 기본정리',
 problem:{
  q:'넓이를 구하는 일(적분)과 기울기를 구하는 일(미분)은 <b>전혀 달라 보입니다.</b> 그런데 이 둘이 사실은 <b>서로 되돌리는 관계</b> 라면 믿어지시나요?',
  svg:`<svg viewBox="0 0 400 170" role="img" aria-label="오른쪽 끝을 조금 밀 때 늘어난 넓이가 높이와 같아지는 그림">
    __FT138__
  </svg>`,
  sit:'오른쪽 끝 <b>x</b> 를 움직이면 쌓인 <b>넓이 A(x)</b> 와 그것을 미분한 <b>A′(x)</b>, 그리고 그 자리의 <b>높이 f(x)</b> 가 나란히 표시됩니다. 두 값이 같은지 직접 확인합니다.'
 },
 predict:{
  q:['오른쪽 끝을 아주 조금 밀면 넓이가 얼마나 늘지 예상해 적으세요.',
     '늘어난 넓이를 민 거리로 나누면 무엇이 될까요?',
     '높이가 일정하면 넓이 그래프가 어떤 모양일지 예상하세요.'] },
 missions:[
  {t:'f(t) 를 <b>「② f(t) = 2 (일정)」</b> 로 바꿔 넓이가 어떻게 자라는지 보세요.', re:'넓이는 직선으로'},
  {t:'f(t) 를 <b>「③ f(t) = t²」</b> 로 바꿔 보세요.', re:'세제곱으로 자랍니다'},
  {t:'아래 <b>탐구 노트</b>로 마무리하세요 — 두 값을 <b>기록</b>하고, 차를 <b>계산</b>하고, 관계를 <b>판단</b>합니다.',
   re:'탐구 노트 통과',
   do:'① 지금 A(x)·A′(x)·f(x) 적기 ② A′(x) − f(x) 를 구하기 ③ f(t) 를 바꿔 다시 확인',
   hand:'오른쪽 끝을 Δx 만큼 밀 때 늘어난 넓이가 거의 f(x)·Δx 임을 그림으로 보이고, 그래서 A′(x) = f(x) 임을 쓰기'}],
 inquiry:{
  id:'ft138', title:'넓이를 미분하면 높이',
  q:['세 가지 f(t) 를 모두 골라 x 를 바꿔 가며 5줄 이상 기록하세요.',
     '「A′(x)」와 「f(x)」를 견주세요. 늘 같은가요?',
     '늘어난 넓이가 왜 f(x)·Δx 인지 손으로 설명하세요.'],
  cols:['f(t)','x','A(x)','A′(x)','f(x)'],
  hint:'힌트 — 높이가 일정하면 넓이는 직선, 높이가 자라면 넓이는 곡선입니다.' },
 apply:{
  q:'새 문제 — <b>f(t) = t</b> 일 때 0 부터 <b>x = 2</b> 까지 쌓인 넓이 <b>A(2)</b> 는?',
  a:2, tol:0.05,
  why:'밑변 2, 높이 2 인 삼각형이므로 2 × 2 ÷ 2 = 2. 참고로 A(x) = x²/2 이고 이것을 미분하면 x — 곧 f(x) 입니다.',
  hint:'삼각형 넓이를 구하세요.' },
 demo(root){ return ftcDemo(root); }
};

LESSON[139]={
 title:'어디에 있나, 얼마나 움직였나 — 정적분과 누적',
 problem:{
  q:'차를 타고 앞으로 갔다가 <b>되돌아왔습니다.</b> 「얼마나 움직였나」와 「어디에 있나」는 같은 답일까요? 주행거리계와 출발점까지의 거리가 왜 다를까요?',
  svg:`<svg viewBox="0 0 400 170" role="img" aria-label="속도가 음수가 되는 구간이 생겨 변위와 이동 거리가 갈리는 그림">
    __AC139__
  </svg>`,
  sit:'운동을 고르고 <b>끝 시각 t</b> 를 바꾸면 <b>변위</b> 와 <b>이동 거리</b> 가 따로 계산되고, 그 <b>차이</b> 가 표시됩니다. 되돌아오는 운동에서 둘이 언제부터 갈리는지 볼 수 있습니다.'
 },
 predict:{
  q:['앞으로만 가면 변위와 이동 거리가 같을지 예상하세요.',
     '되돌아오기 시작하면 어느 쪽이 더 커질까요?',
     '속도가 음수인 구간의 넓이를 어떻게 세어야 할지 적어 보세요.'] },
 missions:[
  {t:'<b>앞으로만</b> 가는 운동에서 두 값을 견주어 보세요.', re:'아직 두 값이 같습니다'},
  {t:'<b>되돌아오는</b> 운동으로 바꾸고 끝 시각을 뒤로 밀어 보세요.', re:'갈라졌습니다'},
  {t:'아래 <b>탐구 노트</b>로 마무리하세요 — 두 값을 <b>기록</b>하고, 차를 <b>계산</b>하고, 뜻을 <b>판단</b>합니다.',
   re:'탐구 노트 통과',
   do:'① 앞으로만 갈 때의 변위·이동 거리 적기 ② 되돌아오는 운동으로 바꿔 다시 적기 ③ 두 값의 차가 언제 생기는지 보기',
   hand:'변위 = ∫v dt, 이동 거리 = ∫|v| dt 를 쓰고, 음수 구간이 둘을 갈라놓는 까닭을 설명하기'}],
 inquiry:{
  id:'ac139', title:'어디에 있나, 얼마나 움직였나',
  q:['두 운동을 모두 돌려 보며 끝 시각을 바꿔 5줄 이상 기록하세요.',
     '「변위」와 「이동 거리」를 견주세요. 언제부터 갈라지나요?',
     '음수 구간을 어떻게 세어야 하는지 손으로 정리하세요.'],
  cols:['운동','끝 시각','변위','이동 거리','차이'],
  hint:'힌트 — v(t) = 4 − t 는 t = 4 부터 음수가 됩니다.' },
 apply:{
  q:'새 문제 — <b>v(t) = 4 − t</b> 로 <b>0 초부터 6 초</b> 까지 움직였을 때 <b>변위</b> 는?',
  a:6, tol:0.1,
  why:'∫₀⁶(4 − t)dt = 24 − 18 = 6. 앞으로 8 갔다가 뒤로 2 왔으므로 변위는 6 이고, 이동 거리는 8 + 2 = 10 입니다.',
  hint:'사다리꼴 두 개로 나눠 보세요 — 0~4초는 +, 4~6초는 −.' },
 demo(root){ return accumDemo(root); }
};

LESSON[140]={
 title:'두 그래프 사이는 얼마나 넓나 — 위아래가 바뀌는 자리',
 problem:{
  q:'두 그래프 사이의 넓이는 <b>(위 − 아래)를 적분</b> 하면 됩니다. 그런데 구간 안에서 <b>위아래가 바뀌면</b> 어떻게 될까요? 그냥 적분하면 답이 작아져 버립니다.',
  svg:`<svg viewBox="0 0 400 170" role="img" aria-label="y=x 와 y=x제곱 사이의 넓이와 두 교점">
    __BT140__
  </svg>`,
  sit:'직선의 기울기 <b>a</b> 와 적분 구간의 <b>양 끝</b> 을 바꾸면 <b>그냥 적분한 값</b> 과 <b>실제 넓이</b> 가 나란히 계산됩니다. 「교점에서 나누어 계산」을 켜면 왜 나눠야 하는지 보입니다.'
 },
 predict:{
  q:['y = x 와 y = x² 의 교점을 구해 적어 보세요.',
     '0 과 1 사이에서는 어느 쪽이 위일지 예상하세요.',
     '구간을 음수 쪽까지 넓히면 위아래가 바뀔지 적어 보세요.'] },
 missions:[
  {t:'구간을 <b>교점 밖까지</b> 넓혀 보세요. 두 값이 달라지나요?', re:'상쇄가 일어났습니다'},
  {t:'<b>「교점에서 나누어 계산」</b> 을 켜 보세요.', re:'교점에서 끊어 각각 계산하면'},
  {t:'아래 <b>탐구 노트</b>로 마무리하세요 — 두 값을 <b>기록</b>하고, 차를 <b>계산</b>하고, 까닭을 <b>판단</b>합니다.',
   re:'탐구 노트 통과',
   do:'① 교점 사이에서 그냥 적분과 실제 넓이 적기 ② 두 값의 차 구하기 ③ 구간을 넓혀 차가 생기게 하기',
   hand:'넓이 = ∫|위 − 아래| dx 임을 쓰고, 교점에서 나누어 계산해야 하는 까닭을 설명하기'}],
 inquiry:{
  id:'bt140', title:'두 그래프 사이는 얼마나 넓나',
  q:['a 와 구간을 바꿔 가며 5줄 이상 기록하세요. 위아래가 바뀌는 구간도 넣으세요.',
     '「그냥 적분」과 「실제 넓이」를 견주세요. 언제 달라지나요?',
     '교점을 어떻게 구하는지, 왜 거기서 나눠야 하는지 손으로 쓰세요.'],
  cols:['a','왼쪽','오른쪽','그냥 적분','실제 넓이'],
  hint:'힌트 — 교점은 x² = ax 를 풀어 x = 0 과 x = a 입니다.' },
 apply:{
  q:'새 문제 — <b>y = x</b> 와 <b>y = x²</b> 사이, <b>0 부터 1</b> 까지의 넓이는? (소수 셋째 자리)',
  a:0.167, tol:0.004,
  why:'∫₀¹(x − x²)dx = 1/2 − 1/3 = 1/6 ≒ 0.167. 이 구간에서는 줄곧 y = x 가 위라 나눌 필요가 없습니다.',
  hint:'위 식에서 아래 식을 빼고 0 부터 1 까지 적분하세요.' },
 demo(root){ return betweenDemo(root); }
};

"""


def note(no, head, c1, c2, c3):
    return "\n %d:{ h:'%s',\n  c:[\n%s,\n%s,\n%s\n ]},\n" % (no, head, c1, c2, c3)


NOTES = (
 note(131, '내가 닫고 · 내가 열고 · 내가 판단한다',
 """  {t:'기록 — <b>닫힌구간 + 이어진 함수</b> 로 두고 두 값을 적으세요',
   f:'최댓값 = {0} · 최솟값 = {1}',
   chk(got, r, mem){
     if(!r) return {ok:false, msg:'아직 화면 값이 없습니다.'};
     if(r[0]!=='닫힘'||r[1]!=='연속')
       return {ok:false, msg:'지금 «'+r[0]+' · '+r[1]+'» 입니다. 구간을 「① 닫힌구간」, 함수를 「③ 이어진 함수」로 맞추세요.'};
     const mx=noteNum(r[2]), mn=noteNum(r[3]);
     if(![0,1].every(j=>isFinite(got[j]))) return {ok:false, msg:'두 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-mx)>0.06||Math.abs(got[1]-mn)>0.06)
       return {ok:false, msg:'화면은 최댓값 '+r[2]+' · 최솟값 '+r[3]+' 입니다.'};
     mem.base=(r[4]==='보장')?1:0; mem.mx=String(r[2]);
     return {ok:true, msg:'기록했습니다 — 둘 다 있고 보장은 «'+r[4]+'» 입니다. 이제 조건을 하나씩 깨 봅시다.'};
   }}""",
 """  {t:'생각 — <b>구간만</b> 열어 보세요 (함수는 그대로 「③ 이어진 함수」)',
   f:'최댓값이 있으면 1, 없으면 0 → {0} · 최솟값이 있으면 1, 없으면 0 → {1}',
   chk(got, r, mem){
     if(mem.base===undefined) return {ok:false, msg:'① 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     if(r[0]!=='열림')
       return {ok:false, msg:'지금 «'+r[0]+'» 입니다. 구간을 「② 열린구간」으로 바꾸세요.'};
     if(r[1]!=='연속')
       return {ok:false, msg:'함수는 「③ 이어진 함수」로 두세요 — 한 번에 하나만 바꿔야 무엇 때문인지 알 수 있습니다.'};
     const hx=(r[2]==='없음')?0:1, hn=(r[3]==='없음')?0:1;
     if(![0,1].every(j=>isFinite(got[j]))) return {ok:false, msg:'두 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-hx)>0.01||Math.abs(got[1]-hn)>0.01)
       return {ok:false, msg:'화면에 최댓값 «'+r[2]+'», 최솟값 «'+r[3]+'» 이라고 나와 있습니다.'};
     mem.open=String(r[4]); mem.ok2=true;
     return {ok:true, msg:'계산했습니다 — 구간만 열었는데 둘 다 사라지고 보장이 «'+r[4]+'» 이 되었습니다. '+mem.mx+' 에 다가가기만 하고 닿지 못하기 때문입니다.'};
   }}""",
 """  {t:'판단 — 구간을 다시 닫고 이번에는 <b>함수만</b> 끊어 본 뒤 고르세요',
   f:'최댓값이 있으면 1, 없으면 0 → {0} · 최솟값이 있으면 1, 없으면 0 → {1}',
   opts:['<b>닫힌구간</b> 이고 <b>연속</b> 이어야 최댓값·최솟값이 «반드시» 있다 — 하나만 빠지면 보장이 깨진다 (있을 수도, 없을 수도 있다)',
         '연속이기만 하면 구간은 아무래도 된다',
         '조건이 깨지면 최댓값과 최솟값이 늘 함께 사라진다'],
   chk(got, r, mem, pick){
     if(!mem.ok2) return {ok:false, msg:'② 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     if(r[0]!=='닫힘')
       return {ok:false, msg:'구간을 다시 「① 닫힌구간」으로 되돌리세요.'};
     if(r[1]!=='끊김')
       return {ok:false, msg:'지금 «'+r[1]+'» 입니다. 함수를 「④ 중간에 끊긴 함수」로 바꾸세요.'};
     const hx=(r[2]==='없음')?0:1, hn=(r[3]==='없음')?0:1;
     if(![0,1].every(j=>isFinite(got[j]))) return {ok:false, msg:'두 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-hx)>0.01||Math.abs(got[1]-hn)>0.01)
       return {ok:false, msg:'잘 보세요 — 최댓값은 «'+r[2]+'», 최솟값은 «'+r[3]+'» 입니다. 둘이 다릅니다.'};
     if(pick!==0)
       return {ok:false, msg:'열린구간에서는 둘 다 사라졌는데, 끊긴 함수에서는 최댓값만 사라지고 최솟값 '+r[3]+' 은 남았습니다. 다시 고르세요.'};
     return {ok:true, msg:'판단했습니다 — <b>최대·최소 정리는 «닫힌구간에서 연속»일 때만 「반드시 있다」를 보장합니다.</b> 조건이 깨지면 없다고 단정하는 것이 아니라 <b>보장이 사라질</b> 뿐입니다 — 끊긴 함수에서도 최솟값 '+r[3]+' 은 x = 2 에서 그대로 가졌습니다.'};
   }}""")
 +
 note(132, '내가 재고 · 내가 좁히고 · 내가 판단한다',
 """  {t:'기록 — <b>꺾인 그래프</b> 를 골라 좌·우 기울기를 적으세요',
   f:'왼쪽 = {0} · 오른쪽 = {1}',
   chk(got, r, mem){
     if(!r) return {ok:false, msg:'아직 화면 값이 없습니다.'};
     if(r[0]!=='꺾임')
       return {ok:false, msg:'지금 «'+r[0]+'» 입니다. 「② 꺾인 그래프 — y = |x|」 를 고르세요.'};
     const L=noteNum(r[2]), R=noteNum(r[3]);
     if(![0,1].every(j=>isFinite(got[j]))) return {ok:false, msg:'두 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-L)>0.02||Math.abs(got[1]-R)>0.02)
       return {ok:false, msg:'화면은 '+r[2]+' 와 '+r[3]+' 입니다.'};
     mem.h=noteNum(r[1]); mem.d=Math.abs(L-R);
     return {ok:true, msg:'기록했습니다 — 두 기울기의 차가 '+mem.d.toFixed(2)+' 입니다. 재는 간격 h 를 줄이면 좁아질까요?'};
   }}""",
 """  {t:'생각 — h 를 <b>더 줄여</b> 두 기울기의 차를 다시 구하세요',
   f:'새 h = {0} · 왼쪽 − 오른쪽 = {1}',
   chk(got, r, mem){
     if(mem.h===undefined) return {ok:false, msg:'① 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     if(r[0]!=='꺾임') return {ok:false, msg:'「② 꺾인 그래프」를 고른 채로 하세요.'};
     const h=noteNum(r[1]), L=noteNum(r[2]), R=noteNum(r[3]);
     if(!(h < mem.h - 1e-9)) return {ok:false, msg:'h 가 '+r[1]+' 입니다. ①의 '+mem.h.toFixed(4)+' 보다 줄이세요.'};
     if(![0,1].every(j=>isFinite(got[j]))) return {ok:false, msg:'두 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-h)>0.0008) return {ok:false, msg:'h 는 '+r[1]+' 입니다.'};
     if(Math.abs(got[1]-(L-R))>0.03) return {ok:false, msg:'왼쪽에서 오른쪽을 빼세요.'};
     mem.ok2=true;
     return {ok:true, msg:'계산했습니다 — h 를 줄여도 차가 '+Math.abs(L-R).toFixed(2)+' 로 그대로입니다. 좁혀지지 않습니다.'};
   }}""",
 """  {t:'판단 — <b>매끄러운 곡선</b> 으로 바꿔 같은 것을 해 본 뒤 고르세요',
   f:'왼쪽 = {0} · 오른쪽 = {1} · 두 값의 차 = {2}',
   opts:['미분계수는 <b>평균변화율의 극한</b> — 좌·우가 같아야 「그 점의 기울기」가 하나로 정해진다',
         '이어져 있으면 언제나 미분할 수 있다',
         'h 를 충분히 줄이면 꺾인 점에서도 기울기가 하나로 정해진다'],
   chk(got, r, mem, pick){
     if(!mem.ok2) return {ok:false, msg:'② 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     if(r[0]!=='매끄러움')
       return {ok:false, msg:'지금 «'+r[0]+'» 입니다. 「① 매끄러운 곡선」으로 바꾸세요.'};
     const L=noteNum(r[2]), R=noteNum(r[3]);
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-L)>0.02||Math.abs(got[1]-R)>0.02)
       return {ok:false, msg:'지금은 '+r[2]+' 와 '+r[3]+' 입니다.'};
     if(Math.abs(got[2]-(L-R))>0.03) return {ok:false, msg:'두 값을 빼세요.'};
     if(pick!==0)
       return {ok:false, msg:'꺾인 그래프에서는 차가 '+mem.d.toFixed(2)+' 로 끝까지 남았고, 매끄러운 곡선에서는 '+Math.abs(L-R).toFixed(3)+' 입니다. 다시 고르세요.'};
     return {ok:true, msg:'판단했습니다 — <b>이어져 있는 것(연속)과 기울기를 말할 수 있는 것(미분 가능)은 다릅니다.</b> y = |x| 는 x = 0 에서 이어져 있지만 꺾여 있어 미분이 안 됩니다 — 딥러닝의 ReLU 가 바로 그 모양입니다.'};
   }}""")
 +
 note(133, '내가 옮기고 · 내가 곱하고 · 내가 판단한다',
 """  {t:'기록 — 접점을 정한 뒤 두 기울기를 적으세요',
   f:'x = {0} · 접선 m = {1} · 법선 = {2}',
   chk(got, r, mem){
     if(!r) return {ok:false, msg:'아직 화면 값이 없습니다.'};
     const x=noteNum(r[0]), m=noteNum(r[2]), nn=noteNum(r[3]);
     if(!isFinite(nn)) return {ok:false, msg:'접선이 수평이라 법선이 «'+r[3]+'» 입니다 — 접점을 옆으로 옮겨 보세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-x)>0.06) return {ok:false, msg:'x 는 '+r[0]+' 입니다.'};
     if(Math.abs(got[1]-m)>0.004||Math.abs(got[2]-nn)>0.004)
       return {ok:false, msg:'화면은 접선 '+r[2]+' · 법선 '+r[3]+' 입니다.'};
     mem.x=x; mem.m=m; mem.n=nn;
     return {ok:true, msg:'기록했습니다 — 두 기울기를 곱해 봅시다.'};
   }}""",
 """  {t:'생각 — 두 기울기를 <b>곱해</b> 보세요',
   f:'접선 × 법선 = {0} · 그 값에 1 을 더하면 = {1}',
   chk(got, r, mem){
     if(mem.m===undefined) return {ok:false, msg:'① 칸을 먼저 통과하세요.'};
     if(![0,1].every(j=>isFinite(got[j]))) return {ok:false, msg:'두 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-mem.m*mem.n)>0.04) return {ok:false, msg:'①에 적은 두 기울기를 곱하세요.'};
     if(Math.abs(got[1])>0.04) return {ok:false, msg:'곱한 값에 1 을 더해 보세요. 무엇이 나오나요?'};
     mem.ok2=true;
     return {ok:true, msg:'계산했습니다 — 곱이 −1 입니다. 접점을 옮겨도 그럴까요?'};
   }}""",
 """  {t:'판단 — <b>접점을 옮겨</b> 다시 곱해 본 뒤 고르세요',
   f:'새 x = {0} · 접선 m = {1} · 접선 × 법선 = {2}',
   opts:['두 직선이 <b>수직</b> 일 조건은 기울기의 곱이 −1 — 그래서 법선의 기울기는 <b>−1/m</b> 이다',
         '법선의 기울기는 접선과 같다',
         '곱이 −1 인 것은 이 점에서만 우연히 그렇다'],
   chk(got, r, mem, pick){
     if(!mem.ok2) return {ok:false, msg:'② 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const x=noteNum(r[0]), m=noteNum(r[2]), nn=noteNum(r[3]);
     if(Math.abs(x-mem.x)<0.25) return {ok:false, msg:'접점이 거의 그대로입니다 — 옮겨 보세요.'};
     if(!isFinite(nn)) return {ok:false, msg:'접선이 수평인 자리입니다 — 조금 더 옮기세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-x)>0.06||Math.abs(got[1]-m)>0.004)
       return {ok:false, msg:'지금은 x = '+r[0]+' · 접선 '+r[2]+' 입니다.'};
     if(Math.abs(got[2]+1)>0.04) return {ok:false, msg:'지금 접선과 법선을 곱해 보세요.'};
     if(pick!==0)
       return {ok:false, msg:'접점을 옮겼는데도 곱이 −1 로 그대로입니다. 다시 고르세요.'};
     return {ok:true, msg:'판단했습니다 — <b>법선은 접선에 수직</b> 이므로 기울기가 −1/m 입니다. 빛의 반사, 공의 튕김, 3D 그래픽의 음영이 모두 이 «면이 바라보는 방향»으로 계산됩니다.'};
   }}""")
 +
 note(134, '내가 바꾸고 · 내가 세고 · 내가 판단한다',
 """  {t:'기록 — b 를 <b>음수</b> 로 두고 극값을 적으세요',
   f:'b = {0} · 극댓값 = {1} · 극솟값 = {2}',
   chk(got, r, mem){
     if(!r) return {ok:false, msg:'아직 화면 값이 없습니다.'};
     const b=noteNum(r[0]), n=noteNum(r[1]), hi=noteNum(r[2]), lo=noteNum(r[3]);
     if(!(b<0)) return {ok:false, msg:'지금 b = '+r[0]+' 입니다. 음수로 맞추세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-b)>0.06) return {ok:false, msg:'b 는 '+r[0]+' 입니다.'};
     if(Math.abs(got[1]-hi)>0.03||Math.abs(got[2]-lo)>0.03)
       return {ok:false, msg:'화면은 극대 '+r[2]+' · 극소 '+r[3]+' 입니다.'};
     mem.b=b; mem.n=n; mem.hi=hi; mem.lo=lo;
     return {ok:true, msg:'기록했습니다 — f′ = 0 인 자리가 '+r[1]+'개입니다.'};
   }}""",
 """  {t:'생각 — <b>극댓값 − 극솟값</b> 을 구하세요',
   f:'극댓값 − 극솟값 = {0} · 두 값의 부호가 반대면 1, 아니면 0 → {1}',
   chk(got, r, mem){
     if(mem.b===undefined) return {ok:false, msg:'① 칸을 먼저 통과하세요.'};
     if(![0,1].every(j=>isFinite(got[j]))) return {ok:false, msg:'두 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-(mem.hi-mem.lo))>0.06) return {ok:false, msg:'①에 적은 두 값을 빼세요.'};
     const opp=(mem.hi>0&&mem.lo<0)?1:0;
     if(Math.abs(got[1]-opp)>0.01) return {ok:false, msg:'극대 '+mem.hi+' 와 극소 '+mem.lo+' 의 부호를 보세요.'};
     mem.ok2=true;
     return {ok:true, msg:'계산했습니다 — 이제 b 를 0 이상으로 올려 봅시다.'};
   }}""",
 """  {t:'판단 — b 를 <b>0 이상</b> 으로 올린 뒤 고르세요',
   f:'새 b = {0} · f′ = 0 인 자리의 개수 = {1}',
   opts:['f′ 의 <b>부호가 바뀌는 자리</b> 에 극값이 생긴다 — 3x² + b = 0 이 서로 다른 실근을 가져야 하므로 b < 0 일 때만',
         'b 가 무엇이든 극값은 늘 두 개다',
         'b 가 클수록 극값이 많아진다'],
   chk(got, r, mem, pick){
     if(!mem.ok2) return {ok:false, msg:'② 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const b=noteNum(r[0]), n=noteNum(r[1]);
     if(!(b>=0)) return {ok:false, msg:'지금 b = '+r[0]+' 입니다. 0 이상으로 올리세요.'};
     if(![0,1].every(j=>isFinite(got[j]))) return {ok:false, msg:'두 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-b)>0.06) return {ok:false, msg:'b 는 '+r[0]+' 입니다.'};
     if(Math.abs(got[1]-n)>0.5) return {ok:false, msg:'화면의 개수는 '+r[1]+' 입니다.'};
     if(pick!==0)
       return {ok:false, msg:'b 가 음수일 때는 '+mem.n+'개였고 지금은 '+r[1]+'개, 극값은 «'+r[2]+'» 입니다. 3x² + b = 0 을 풀어 보고 다시 고르세요.'};
     return {ok:true, msg:'판단했습니다 — <b>f′ > 0 이면 증가, f′ < 0 이면 감소</b> 이므로 부호가 «+에서 −»로 바뀌는 자리가 극대, 반대가 극소입니다. b ≥ 0 이면 f′ = 3x² + b 가 늘 0 이상이라 부호가 바뀌지 않아 줄곧 증가합니다.'};
   }}""")
 +
 note(135, '내가 자르고 · 내가 재고 · 내가 판단한다',
 """  {t:'기록 — x 를 <b>작게</b> 두고 부피를 적으세요',
   f:'x = {0} · 부피 = {1}',
   chk(got, r, mem){
     if(!r) return {ok:false, msg:'아직 화면 값이 없습니다.'};
     const x=noteNum(r[2]), v=noteNum(r[3]);
     if(String(r[4]).indexOf('최적')>=0)
       return {ok:false, msg:'①은 최적이 <b>아닌</b> 자리에서 적습니다 — x 를 더 작게 해 보세요. 최적은 ③에서 찾습니다.'};
     if(![0,1].every(j=>isFinite(got[j]))) return {ok:false, msg:'두 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-x)>0.06||Math.abs(got[1]-v)>0.6)
       return {ok:false, msg:'화면은 x = '+r[2]+' · 부피 '+r[3]+' 입니다.'};
     mem.x1=x; mem.v1=v;
     return {ok:true, msg:'기록했습니다 — 이번엔 x 를 크게 해 봅시다.'};
   }}""",
 """  {t:'생각 — x 를 <b>크게</b> 해 보고 부피를 견주세요',
   f:'새 x = {0} · 부피 = {1} · ①보다 늘었으면 1, 줄었으면 0 → {2}',
   chk(got, r, mem){
     if(mem.x1===undefined) return {ok:false, msg:'① 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const x=noteNum(r[2]), v=noteNum(r[3]);
     if(!(x > mem.x1 + 1.5)) return {ok:false, msg:'x 가 '+r[2]+' 입니다. ①의 '+mem.x1.toFixed(1)+' 보다 1.5 넘게 크게 하세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-x)>0.06||Math.abs(got[1]-v)>0.6)
       return {ok:false, msg:'지금은 x = '+r[2]+' · 부피 '+r[3]+' 입니다.'};
     if(Math.abs(got[2]-(v>mem.v1?1:0))>0.01)
       return {ok:false, msg:'①의 부피 '+mem.v1.toFixed(1)+' 와 견주어 보세요.'};
     mem.v2=v; mem.ok2=true;
     return {ok:true, msg:'계산했습니다 — 양 끝에서는 작고 가운데 어딘가에서 가장 큽니다.'};
   }}""",
 """  {t:'판단 — <b>최적</b> 인 x 를 찾은 뒤 고르세요',
   f:'최적 x = {0} · 그때 부피 = {1}',
   opts:['V(x) = x(W−2x)(H−2x) 를 미분해 <b>V′(x) = 0</b> 을 푸는 것이 곧 가장 큰 상자를 찾는 일이다',
         'x 를 크게 할수록 부피가 커진다',
         '부피가 최대인 자리는 눈대중으로만 알 수 있다'],
   chk(got, r, mem, pick){
     if(!mem.ok2) return {ok:false, msg:'② 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     if(String(r[4]).indexOf('최적')<0)
       return {ok:false, msg:'아직 «'+r[4]+'» 입니다. 「부피가 최대인 x 로」를 누르거나 직접 찾으세요.'};
     const x=noteNum(r[2]), v=noteNum(r[3]);
     if(![0,1].every(j=>isFinite(got[j]))) return {ok:false, msg:'두 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-x)>0.06||Math.abs(got[1]-v)>0.6)
       return {ok:false, msg:'지금은 x = '+r[2]+' · 부피 '+r[3]+' 입니다.'};
     if(!(v >= mem.v1 - 1e-9 && v >= mem.v2 - 1e-9))
       return {ok:false, msg:'①('+mem.v1.toFixed(1)+')·②('+mem.v2.toFixed(1)+')보다 커야 최적입니다 — 종이 크기를 바꾸었다면 되돌리고 다시 찾으세요.'};
     if(pick!==0)
       return {ok:false, msg:'작은 x 에서 '+mem.v1.toFixed(1)+', 큰 x 에서 '+mem.v2.toFixed(1)+', 최적 '+r[2]+' 에서 '+r[3]+' 였습니다. 다시 고르세요.'};
     return {ok:true, msg:'판단했습니다 — <b>봉우리에서 접선이 수평</b> 이므로 V′(x) = 0 을 풀면 최적 자리가 나옵니다. 「가장 크게·가장 싸게·가장 빠르게」 같은 문제는 모두 이 꼴입니다.'};
   }}""")
 +
 note(136, '내가 움직이고 · 내가 읽고 · 내가 판단한다',
 """  {t:'기록 — 올라가는 <b>도중</b> 의 값을 적으세요',
   f:'t = {0} · 위치 s = {1} · 속도 v = {2}',
   chk(got, r, mem){
     if(!r) return {ok:false, msg:'아직 화면 값이 없습니다.'};
     const t=noteNum(r[0]), s=noteNum(r[1]), v=noteNum(r[2]);
     if(!(v>0.3)) return {ok:false, msg:'지금 속도가 '+r[2]+' 입니다. 아직 올라가는 중(v > 0)인 시각으로 맞추세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-t)>0.06) return {ok:false, msg:'t 는 '+r[0]+' 입니다.'};
     if(Math.abs(got[1]-s)>0.03||Math.abs(got[2]-v)>0.03)
       return {ok:false, msg:'화면은 s = '+r[1]+' · v = '+r[2]+' 입니다.'};
     mem.t=t; mem.s=s; mem.dir=String(r[4]);
     return {ok:true, msg:'기록했습니다 — 방향이 «'+mem.dir+'» 입니다. 이번에는 속도가 0 이 되는 순간을 찾아봅시다.'};
   }}""",
 """  {t:'생각 — <b>멈추는 순간</b>(v = 0) 을 찾아 적으세요 — 가장 높이 올라간 자리입니다',
   f:'그때 t = {0} · 위치 s = {1} · 가속도 a = {2}',
   chk(got, r, mem){
     if(mem.t===undefined) return {ok:false, msg:'① 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const t=noteNum(r[0]), s=noteNum(r[1]), v=noteNum(r[2]), a=noteNum(r[3]);
     if(Math.abs(v)>0.08) return {ok:false, msg:'아직 v = '+r[2]+' 입니다. t 를 옮겨 속도가 0 에 닿게 하세요.'};
     if(!(s > mem.s))
       return {ok:false, msg:'여기는 ①(s = '+mem.s+')보다 낮습니다 — 출발 직전도 속도가 0 입니다. 「② 올라갔다 되돌아오는 운동」을 골라 가장 높은 자리를 찾으세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-t)>0.12) return {ok:false, msg:'t 는 '+r[0]+' 입니다.'};
     if(Math.abs(got[1]-s)>0.06||Math.abs(got[2]-a)>0.03)
       return {ok:false, msg:'화면은 s = '+r[1]+' · a = '+r[3]+' 입니다.'};
     mem.a2=a; mem.ok2=true;
     return {ok:true, msg:'계산했습니다 — 속도는 0 인데 가속도는 '+r[3]+' 입니다. 멈춘 순간에도 가속도는 0 이 아닙니다.'};
   }}""",
 """  {t:'판단 — t 를 더 뒤로 밀어 <b>속도가 음수</b> 가 되게 한 뒤 고르세요',
   f:'그때 t = {0} · 속도 v = {1} · 방향이 「후진」이면 1, 아니면 0 → {2}',
   opts:['위치를 미분하면 속도, 속도를 미분하면 가속도 — 봉우리에서 <b>v = 0</b> 이고, 몸이 느끼는 것은 <b>가속도</b> 다',
         '몸이 느끼는 것은 속도다',
         '속도가 0 이면 가속도도 반드시 0 이다'],
   chk(got, r, mem, pick){
     if(!mem.ok2) return {ok:false, msg:'② 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const t=noteNum(r[0]), v=noteNum(r[2]);
     if(!(v < -0.1)) return {ok:false, msg:'아직 v = '+r[2]+' 입니다. t 를 더 뒤로 밀어 속도를 음수로 만드세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-t)>0.12||Math.abs(got[1]-v)>0.03)
       return {ok:false, msg:'지금은 t = '+r[0]+' · v = '+r[2]+' 입니다.'};
     if(Math.abs(got[2]-(String(r[4])==='후진'?1:0))>0.01)
       return {ok:false, msg:'화면의 방향은 «'+r[4]+'» 입니다.'};
     if(pick!==0)
       return {ok:false, msg:'멈춰 있던 ②의 순간에도 가속도는 '+mem.a2+' 였습니다. 엘리베이터에서 언제 몸이 눌리던가요? 다시 고르세요.'};
     return {ok:true, msg:'판단했습니다 — <b>속도의 부호가 방향</b> 이고 봉우리에서는 v = 0 입니다. 한창 올라갈 때 아무 느낌이 없는 것은 속도가 일정해 <b>가속도가 0</b> 이기 때문입니다 — 몸은 속도가 아니라 가속도를 느낍니다.'};
   }}""")
 +
 note(137, '내가 덮고 · 내가 늘리고 · 내가 판단한다',
 """  {t:'기록 — n 을 <b>작게</b> 두고 합과 오차를 적으세요',
   f:'n = {0} · 합 = {1} · 오차 = {2}',
   chk(got, r, mem){
     if(!r) return {ok:false, msg:'아직 화면 값이 없습니다.'};
     const n=noteNum(r[0]), s=noteNum(r[3]), e=noteNum(r[4]);
     if(n>20) return {ok:false, msg:'①은 n 을 작게(20 이하) 두고 적습니다 — 늘리는 것은 ②에서 합니다.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-n)>0.5) return {ok:false, msg:'n 은 '+r[0]+' 입니다.'};
     if(Math.abs(got[1]-s)>0.004||Math.abs(got[2]-e)>0.004)
       return {ok:false, msg:'화면은 합 '+r[3]+' · 오차 '+r[4]+' 입니다.'};
     mem.n=n; mem.e=e; mem.sum=s; mem.mode=String(r[1]);
     return {ok:true, msg:'기록했습니다 — 지금 «'+mem.mode+'» 에서 재고 있고 오차가 '+r[4]+' 입니다. n 을 늘려 봅시다.'};
   }}""",
 """  {t:'생각 — n 을 <b>열 배 넘게</b> 늘려 오차를 다시 구하세요',
   f:'새 n = {0} · 오차 = {1} · ①의 오차보다 줄었으면 1, 아니면 0 → {2}',
   chk(got, r, mem){
     if(mem.n===undefined) return {ok:false, msg:'① 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const n=noteNum(r[0]), e=noteNum(r[4]);
     if(!(n >= mem.n * 10)) return {ok:false, msg:'n 이 '+r[0]+' 입니다. ①의 '+mem.n+' 의 열 배(='+(mem.n*10)+') 넘게 늘리세요.'};
     if(String(r[1])!==mem.mode) return {ok:false, msg:'재는 위치는 «'+mem.mode+'» 로 두세요 — 한 번에 하나만 바꿔야 n 때문인지 알 수 있습니다.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-n)>0.5||Math.abs(got[1]-e)>0.004)
       return {ok:false, msg:'지금은 n = '+r[0]+' · 오차 '+r[4]+' 입니다.'};
     if(Math.abs(got[2]-(e<mem.e?1:0))>0.01)
       return {ok:false, msg:'①의 오차 '+mem.e+' 와 견주어 보세요.'};
     mem.ok2=true;
     return {ok:true, msg:'계산했습니다 — 오차가 '+r[4]+' 로 줄었습니다. 이번에는 재는 위치를 바꿔 봅시다.'};
   }}""",
 """  {t:'판단 — <b>재는 위치</b> 를 바꾼 뒤, 참값 0.33333 과 견주어 고르세요',
   f:'합 = {0} · 0.33333 − 합 = {1}',
   opts:['왼쪽 끝은 늘 참값보다 <b>작고</b> 오른쪽 끝은 늘 <b>크다</b> — n 을 키우면 둘이 참값 하나로 모인다',
         '직사각형으로는 참값에 다가갈 수 없다',
         '재는 위치를 바꿔도 합은 같다'],
   chk(got, r, mem, pick){
     if(!mem.ok2) return {ok:false, msg:'② 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     if(String(r[1])===mem.mode)
       return {ok:false, msg:'재는 위치가 «'+r[1]+'» 로 그대로입니다 — 다른 위치로 바꾸세요.'};
     const s=noteNum(r[3]);
     if(![0,1].every(j=>isFinite(got[j]))) return {ok:false, msg:'두 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-s)>0.004) return {ok:false, msg:'화면의 합은 '+r[3]+' 입니다.'};
     if(Math.abs(got[1]-(1/3-s))>0.004) return {ok:false, msg:'0.33333 에서 합을 빼세요 — 부호까지 그대로 적으세요.'};
     if(pick!==0)
       return {ok:false, msg:'«'+mem.mode+'»에서는 0.33333 − 합 = '+(1/3-mem.sum).toFixed(5)+' 였고 «'+r[1]+'»에서는 '+(1/3-s).toFixed(5)+' 입니다. 부호를 보고 다시 고르세요.'};
     return {ok:true, msg:'판단했습니다 — <b>n → ∞ 에서 왼쪽 합과 오른쪽 합이 한 값으로 모입니다.</b> 그 값이 곧 정적분이고, 「잘게 나누어 더해 극한을 본다」가 구분구적법입니다.'};
   }}""")
 +
 note(138, '내가 밀고 · 내가 미분하고 · 내가 판단한다',
 """  {t:'기록 — x 를 정한 뒤 세 값을 적으세요',
   f:'x = {0} · A(x) = {1} · f(x) = {2}',
   chk(got, r, mem){
     if(!r) return {ok:false, msg:'아직 화면 값이 없습니다.'};
     const x=noteNum(r[1]), A=noteNum(r[2]), fx=noteNum(r[4]);
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-x)>0.06) return {ok:false, msg:'x 는 '+r[1]+' 입니다.'};
     if(Math.abs(got[1]-A)>0.0006||Math.abs(got[2]-fx)>0.0006)
       return {ok:false, msg:'화면은 A(x) = '+r[2]+' · f(x) = '+r[4]+' 입니다.'};
     mem.x=x; mem.A=A; mem.f=fx; mem.k=String(r[0]);
     return {ok:true, msg:'기록했습니다 — 지금 f(t) = '+mem.k+' 입니다. 이제 A′(x) 와 견주어 봅시다.'};
   }}""",
 """  {t:'생각 — <b>A′(x) − f(x)</b> 를 구하세요',
   f:'A′(x) = {0} · f(x) = {1} · 두 값의 차 = {2}',
   chk(got, r, mem){
     if(mem.x===undefined) return {ok:false, msg:'① 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const Ap=noteNum(r[3]), fx=noteNum(r[4]);
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-Ap)>0.0012||Math.abs(got[1]-fx)>0.0012)
       return {ok:false, msg:'화면은 A′(x) = '+r[3]+' · f(x) = '+r[4]+' 입니다.'};
     if(Math.abs(got[2])>0.002) return {ok:false, msg:'두 값을 빼 보세요. 무엇이 나오나요?'};
     mem.ok2=true;
     return {ok:true, msg:'계산했습니다 — 차가 0 입니다. f(t) 를 바꿔도 그럴까요?'};
   }}""",
 """  {t:'판단 — <b>f(t) 를 바꿔</b> 다시 견준 뒤 고르세요',
   f:'새 x = {0} · A′(x) = {1} · f(x) = {2}',
   opts:['오른쪽 끝을 Δx 만큼 밀면 넓이가 거의 <b>f(x)·Δx</b> 만큼 는다 — 그래서 <b>A′(x) = f(x)</b>',
         '넓이를 미분하면 넓이가 다시 나온다',
         'A′(x) 와 f(x) 가 같은 것은 f 가 직선일 때뿐이다'],
   chk(got, r, mem, pick){
     if(!mem.ok2) return {ok:false, msg:'② 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     if(String(r[0])===mem.k) return {ok:false, msg:'f(t) 가 «'+r[0]+'» 로 그대로입니다 — 다른 것을 고르세요.'};
     const x=noteNum(r[1]), Ap=noteNum(r[3]), fx=noteNum(r[4]);
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-x)>0.06) return {ok:false, msg:'x 는 '+r[1]+' 입니다.'};
     if(Math.abs(got[1]-Ap)>0.0012||Math.abs(got[2]-fx)>0.0012)
       return {ok:false, msg:'지금은 '+r[3]+' 와 '+r[4]+' 입니다.'};
     if(pick!==0)
       return {ok:false, msg:'f(t) 를 «'+mem.k+'»에서 «'+r[0]+'»로 바꿨는데도 A′(x) 와 f(x) 가 같습니다. 오른쪽 끝을 조금 밀 때 늘어나는 조각이 어떤 모양인지 보고 다시 고르세요.'};
     return {ok:true, msg:'판단했습니다 — <b>A′(x) = f(x), 넓이를 미분하면 높이</b> 입니다. 적분과 미분이 서로를 되돌리는 관계라는 것이 미적분의 기본정리이고, 그래서 넓이를 «잘게 더하지 않고» 원시함수로 구할 수 있습니다.'};
   }}""")
 +
 note(139, '내가 가고 · 내가 돌아오고 · 내가 판단한다',
 """  {t:'기록 — <b>앞으로만</b> 가는 운동에서 두 값을 적으세요',
   f:'변위 = {0} · 이동 거리 = {1} · 차이 = {2}',
   chk(got, r, mem){
     if(!r) return {ok:false, msg:'아직 화면 값이 없습니다.'};
     if(String(r[0]).indexOf('앞으로')<0)
       return {ok:false, msg:'지금 «'+r[0]+'» 입니다. 「계속 앞으로」 가는 운동을 고르세요.'};
     const d=noteNum(r[2]), s=noteNum(r[3]), g=noteNum(r[4]);
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-d)>0.004||Math.abs(got[1]-s)>0.004)
       return {ok:false, msg:'화면은 변위 '+r[2]+' · 이동 거리 '+r[3]+' 입니다.'};
     if(Math.abs(got[2]-g)>0.004) return {ok:false, msg:'차이는 '+r[4]+' 입니다.'};
     mem.g1=g;
     return {ok:true, msg:'기록했습니다 — 앞으로만 가면 차이가 '+r[4]+' 입니다. 되돌아오면 어떨까요?'};
   }}""",
 """  {t:'생각 — <b>되돌아오는</b> 운동으로 바꾸고 끝 시각을 <b>충분히 뒤로</b> 미세요',
   f:'끝 시각 = {0} · 변위 = {1} · 이동 거리 = {2} · 차이 = {3}',
   chk(got, r, mem){
     if(mem.g1===undefined) return {ok:false, msg:'① 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     if(String(r[0]).indexOf('왕복')<0)
       return {ok:false, msg:'지금 «'+r[0]+'» 입니다. 「갔다가 되돌아오기」를 고르세요.'};
     const T=noteNum(r[1]), d=noteNum(r[2]), s=noteNum(r[3]), g=noteNum(r[4]);
     if(!(g > 0.05))
       return {ok:false, msg:'아직 차이가 '+r[4]+' 입니다. 끝 시각을 더 뒤로 밀어 속도가 음수인 구간이 생기게 하세요.'};
     if(![0,1,2,3].every(j=>isFinite(got[j]))) return {ok:false, msg:'네 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-T)>0.06) return {ok:false, msg:'끝 시각은 '+r[1]+' 입니다.'};
     if(Math.abs(got[1]-d)>0.004||Math.abs(got[2]-s)>0.004||Math.abs(got[3]-g)>0.004)
       return {ok:false, msg:'지금은 '+r[2]+' · '+r[3]+' · '+r[4]+' 입니다.'};
     mem.T=T; mem.gap=g; mem.ok2=true;
     return {ok:true, msg:'계산했습니다 — 되돌아오자 두 값이 '+r[4]+' 만큼 갈라졌습니다.'};
   }}""",
 """  {t:'판단 — 끝 시각을 <b>더 뒤로</b> 밀어 차이를 키운 뒤 고르세요',
   f:'새 끝 시각 = {0} · 변위 = {1} · 이동 거리 = {2}',
   opts:['변위 = ∫v dt 는 <b>부호를 그대로</b> 더하고, 이동 거리 = ∫|v| dt 는 <b>부호를 지우고</b> 더한다',
         '변위와 이동 거리는 늘 같다',
         '이동 거리가 변위보다 작을 수도 있다'],
   chk(got, r, mem, pick){
     if(!mem.ok2) return {ok:false, msg:'② 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const T=noteNum(r[1]), d=noteNum(r[2]), s=noteNum(r[3]), g=noteNum(r[4]);
     if(!(T > mem.T + 0.3)) return {ok:false, msg:'끝 시각이 '+r[1]+' 입니다. ②의 '+mem.T+' 보다 더 뒤로 미세요.'};
     if(!(g > mem.gap)) return {ok:false, msg:'차이가 '+r[4]+' 로 ②의 '+mem.gap+' 보다 커지지 않았습니다 — 운동을 「갔다가 되돌아오기」로 둔 채 더 미세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-T)>0.06) return {ok:false, msg:'끝 시각은 '+r[1]+' 입니다.'};
     if(Math.abs(got[1]-d)>0.004||Math.abs(got[2]-s)>0.004)
       return {ok:false, msg:'지금은 변위 '+r[2]+' · 이동 거리 '+r[3]+' 입니다.'};
     if(!(s >= d - 1e-6)) return {ok:false, msg:'이동 거리가 변위보다 작게 나왔습니다 — 화면을 다시 보세요.'};
     if(pick!==0)
       return {ok:false, msg:'앞으로만 갈 때는 차이가 '+mem.g1+' 였는데, 끝 시각을 '+mem.T+' → '+r[1]+' 로 밀자 '+mem.gap+' → '+r[4]+' 로 커졌습니다. 음수 구간을 어떻게 센 걸까요? 다시 고르세요.'};
     return {ok:true, msg:'판단했습니다 — <b>변위 = ∫v dt, 이동 거리 = ∫|v| dt</b> 입니다. 되돌아온 만큼은 변위에서 빠지지만 주행거리계에는 그대로 더해집니다 — 그래서 집에 돌아오면 변위는 0 이어도 주행거리는 남습니다.'};
   }}""")
 +
 note(140, '내가 칠하고 · 내가 넓히고 · 내가 판단한다',
 """  {t:'기록 — 구간을 <b>두 교점 사이</b> 로 두고 두 값을 적으세요',
   f:'그냥 적분 = {0} · 실제 넓이 = {1} · 실제 넓이 − 그냥 적분 = {2}',
   chk(got, r, mem){
     if(!r) return {ok:false, msg:'아직 화면 값이 없습니다.'};
     const a=noteNum(r[0]), L=noteNum(r[1]), R=noteNum(r[2]), s=noteNum(r[3]), ab=noteNum(r[4]);
     if(!(a>0.2)) return {ok:false, msg:'a 를 양수로 두세요 — 그때 교점이 x = 0 과 x = a 입니다.'};
     if(!(Math.abs(L)<0.05 && Math.abs(R-a)<0.06))
       return {ok:false, msg:'구간을 두 교점 사이(왼쪽 0.0, 오른쪽 '+a.toFixed(1)+')로 맞추세요. 지금은 '+r[1]+' ~ '+r[2]+' 입니다.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-s)>0.004||Math.abs(got[1]-ab)>0.004)
       return {ok:false, msg:'화면은 '+r[3]+' 와 '+r[4]+' 입니다.'};
     if(Math.abs(got[2]-(ab-s))>0.006) return {ok:false, msg:'실제 넓이에서 그냥 적분을 빼세요.'};
     mem.a=a; mem.s1=s; mem.ab1=ab;
     return {ok:true, msg:'기록했습니다 — 교점 사이에서는 두 값의 차가 '+(ab-s).toFixed(4)+' 입니다. 구간을 넓히면 어떻게 될까요?'};
   }}""",
 """  {t:'생각 — 구간을 <b>교점 밖까지</b> 넓혀 두 값이 갈리게 하세요',
   f:'왼쪽 끝 = {0} · 오른쪽 끝 = {1} · 그냥 적분 = {2} · 실제 넓이 = {3}',
   chk(got, r, mem){
     if(mem.a===undefined) return {ok:false, msg:'① 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const a=noteNum(r[0]), L=noteNum(r[1]), R=noteNum(r[2]), s=noteNum(r[3]), ab=noteNum(r[4]);
     if(Math.abs(a-mem.a)>0.06) return {ok:false, msg:'a 는 ①과 같은 '+mem.a.toFixed(1)+' 로 두세요 — 구간만 바꾸어야 무엇 때문인지 알 수 있습니다.'};
     if(!(ab - s > 0.02))
       return {ok:false, msg:'아직 두 값이 같습니다 — 오른쪽 끝을 교점 '+mem.a.toFixed(1)+' 보다 크게 하거나 왼쪽 끝을 0 아래로 내려 보세요.'};
     if(![0,1,2,3].every(j=>isFinite(got[j]))) return {ok:false, msg:'네 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-L)>0.06||Math.abs(got[1]-R)>0.06)
       return {ok:false, msg:'구간은 '+r[1]+' ~ '+r[2]+' 입니다.'};
     if(Math.abs(got[2]-s)>0.004||Math.abs(got[3]-ab)>0.004)
       return {ok:false, msg:'지금은 '+r[3]+' 와 '+r[4]+' 입니다.'};
     mem.gap=ab-s; mem.ok2=true;
     return {ok:true, msg:'계산했습니다 — 차이가 '+mem.gap.toFixed(4)+' 입니다. 왜 생겼을까요?'};
   }}""",
 """  {t:'판단 — <b>교점에서 나누어 계산</b> 을 켜 보고, 교점을 손으로 구한 뒤 고르세요',
   f:'교점의 x 좌표 두 개 = {0} 과 {1} · 지금 실제 넓이 = {2}',
   opts:['구간 안에서 <b>위아래가 바뀌면</b> 그냥 적분은 서로 상쇄된다 — 넓이는 ∫|위 − 아래| dx 로 <b>교점에서 끊어</b> 구한다',
         '그냥 적분이 늘 넓이와 같다',
         '위아래가 바뀌면 넓이를 구할 수 없다'],
   chk(got, r, mem, pick){
     if(!mem.ok2) return {ok:false, msg:'② 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const a=noteNum(r[0]), ab=noteNum(r[4]);
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0])>0.06) return {ok:false, msg:'x² = ax 를 푸세요. 한 근은 아주 간단합니다.'};
     if(Math.abs(got[1]-a)>0.06) return {ok:false, msg:'x² = ax → x(x − a) = 0 입니다. 다른 한 근은 지금 a = '+r[0]+' 와 같습니다.'};
     if(Math.abs(got[2]-ab)>0.004) return {ok:false, msg:'화면의 실제 넓이는 '+r[4]+' 입니다.'};
     if(pick!==0)
       return {ok:false, msg:'교점 사이에서는 두 값의 차가 '+(mem.ab1-mem.s1).toFixed(4)+' 였는데, 밖으로 넓히니 '+mem.gap.toFixed(4)+' 만큼 벌어졌습니다. 그 구간에서 무엇이 바뀌었나요? 다시 고르세요.'};
     return {ok:true, msg:'판단했습니다 — <b>넓이 = ∫|위 − 아래| dx</b> 입니다. 교점 x = 0, x = '+r[0]+' 을 지나면 «위 − 아래»의 부호가 바뀌어 그냥 적분하면 서로 지워집니다. 그래서 <b>교점에서 끊어</b> 각각 구한 뒤 더해야 합니다.'};
   }}""")
)

def main(path):
    h = open(path, encoding='utf-8').read()
    if 'LESSON[131]=' in h:
        sys.stdout.write('이미 반영됨\n')
        return
    L = (LESSONS.replace('__EV131__', FG.ev131()).replace('__CU132__', FG.cu132())
         .replace('__TG133__', FG.tg133()).replace('__SG134__', FG.sg134())
         .replace('__BX135__', FG.bx135()).replace('__MO136__', FG.mo136())
         .replace('__RM137__', FG.rm137()).replace('__FT138__', FG.ft138())
         .replace('__AC139__', FG.ac139()).replace('__BT140__', FG.bt140()))
    a = 'LESSON[356]={'
    assert h.count(a) == 1
    h = h.replace(a, L + a, 1)
    b = '\n};\n\nfunction labNo(spec)'
    assert h.count(b) == 1
    h = h.replace(b, NOTES + b, 1)
    open(path, 'w', encoding='utf-8').write(h)
    sys.stdout.write('LAB 131~140 ok %.2f MB\n' % (len(h.encode('utf-8')) / 1048576))


if __name__ == '__main__':
    main(sys.argv[1])
