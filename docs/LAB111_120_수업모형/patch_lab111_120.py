# -*- coding: utf-8 -*-
"""LAB 111~120 — 7단계 수업 모형 + 탐구 노트.

사용: python docs/LAB111_120_수업모형/patch_lab111_120.py src/40-demos.js
"""
import sys, os, importlib.util

try:
    sys.stdout.reconfigure(encoding='utf-8')
except Exception:
    pass

_s = importlib.util.spec_from_file_location(
    'figs111', os.path.join(os.path.dirname(os.path.abspath(__file__)), 'figs.py'))
FG = importlib.util.module_from_spec(_s)
_s.loader.exec_module(FG)


LESSONS = """LESSON[111]={
 title:'도미노가 다 무너지려면 — 수학적 귀납법',
 problem:{
  q:'도미노를 줄 세우고 <b>첫 장을 밀었습니다.</b> 그러면 끝까지 다 무너질까요? 첫 장을 민 것만으로는 <b>부족합니다.</b> 무엇이 더 있어야 할까요?',
  svg:`<svg viewBox="0 0 400 170" role="img" aria-label="빠짐없이 이어진 줄과 한 자리가 끊긴 줄을 견주는 도미노 그림">
    __DM111__
  </svg>`,
  sit:'도미노 개수와 <b>간격</b> 을 바꾸고 첫 장을 밀어 봅니다. 간격이 너무 넓으면 <b>k → k+1</b> 이 «끊김» 으로 바뀌고, 「5번째만 빼기」로 가운데를 일부러 끊어 볼 수도 있습니다.'
 },
 predict:{
  q:['첫 장을 밀면 끝까지 갈지 예상하고 까닭도 적으세요.',
     '간격을 아주 넓히면 어떻게 될지 예상하세요.',
     '가운데 한 장을 빼면 그 뒤는 어떻게 될까요?'] },
 missions:[
  {t:'간격을 좁혀 두고 첫 장을 밀어 <b>끝까지</b> 무너뜨려 보세요.', re:'무너짐'},
  {t:'간격을 넓히거나 <b>가운데를 빼</b> 보세요. 어디서 멈추나요?', re:'끊김'},
  {t:'아래 <b>탐구 노트</b>로 마무리하세요 — 두 조건을 <b>기록</b>하고, 하나씩 깨 <b>견주고</b>, 까닭을 <b>판단</b>합니다.',
   re:'탐구 노트 통과',
   do:'① 둘 다 갖춘 상태에서 쓰러진 수 적기 ② 연결을 끊어 다시 적기 ③ 첫 장을 밀지 않고 해 보기',
   hand:'귀납법의 두 조건 ①「n = 1 일 때 참」②「n = k 이면 n = k+1 도 참」이 도미노의 무엇에 해당하는지 쓰기'}],
 inquiry:{
  id:'dm111', title:'도미노가 다 무너지려면',
  q:['간격과 끊김을 바꿔 가며 5줄 이상 기록하세요.',
     '「첫 도미노」와 「k→k+1」 두 열을 보세요. 어느 하나만 있어도 끝까지 가나요?',
     '수학적 귀납법의 두 조건이 각각 무엇에 해당하는지 손으로 쓰세요.'],
  cols:['첫 도미노','k→k+1','쓰러진 수','전부 무너짐?'],
  hint:'힌트 — 조건 ②는 「어떤 k 에 대해서도」여야 합니다. 한 곳만 끊겨도 그 뒤는 보장되지 않습니다.' },
 apply:{
  q:'새 문제 — 「n = 1 일 때 참」만 보이고 「n = k 이면 n = k+1 도 참」은 보이지 못했습니다. 모든 자연수에서 참임이 <b>증명되었으면 1, 아니면 0</b> 을 쓰세요.',
  a:0, tol:0.1,
  why:'첫 장이 넘어져도 다음을 미는 연결이 없으면 거기서 멈춥니다. 두 조건이 <b>모두</b> 있어야 모든 자연수로 번집니다.',
  hint:'도미노 줄에서 첫 장만 민 경우를 떠올리세요.' },
 demo(root){ return dominoDemo(root); }
};

LESSON[112]={
 title:'몇 해 뒤에 세 배? — 지수방정식과 부등식',
 problem:{
  q:'해마다 <b>10 %</b> 씩 늘어나는 것이 <b>세 배</b> 가 되는 데 몇 해가 걸릴까요? 10 % 씩이니까 <b>30해</b> 쯤일까요? 실제로는 그보다 훨씬 짧습니다.',
  svg:`<svg viewBox="0 0 400 170" role="img" aria-label="해마다 1.1배씩 늘어 세 배에 이르는 곡선과 그 해">
    __XE112__
  </svg>`,
  sit:'<b>밑 a</b> 와 <b>오른쪽 값 k</b> 를 바꾸면 <b>aˣ = k</b> 의 해가 계산됩니다. 「= k」와 「&gt; k」를 오가면 <b>부등식의 해</b> 가 어떻게 달라지는지도 볼 수 있습니다 — 밑이 1보다 작으면 방향이 뒤집힙니다.'
 },
 predict:{
  q:['해마다 10 % 씩 늘면 세 배가 되는 데 몇 해 걸릴지 예상해 적으세요.',
     '밑이 1보다 작으면(줄어들면) 부등식의 방향이 어떻게 될지 예상하세요.',
     '지수방정식을 풀려면 어떤 도구가 필요할까요?'] },
 missions:[
  {t:'밑과 k 를 바꿔 <b>해 x</b> 가 어떻게 변하는지 보세요.', re:'해'},
  {t:'밑을 <b>1보다 작게</b> 해 부등식의 해를 보세요. 방향이 바뀌나요?', re:'부등식'},
  {t:'아래 <b>탐구 노트</b>로 마무리하세요 — 해를 <b>기록</b>하고, 밑을 바꿔 <b>견주고</b>, 방향을 <b>판단</b>합니다.',
   re:'탐구 노트 통과',
   do:'① 밑이 1보다 클 때의 해와 부등식의 해 적기 ② 밑을 1보다 작게 바꿔 다시 적기 ③ 두 부등식의 방향을 견주기',
   hand:'aˣ = k 의 양변에 로그를 취해 x 를 구하는 과정을 쓰고, 밑이 1보다 작을 때 방향이 뒤집히는 까닭을 설명하기'}],
 inquiry:{
  id:'xe112', title:'몇 해 뒤에 세 배',
  q:['밑과 k 를 바꿔 가며 5줄 이상 기록하세요. 밑이 1보다 작은 경우도 넣으세요.',
     '「밑 a」와 「부등식의 해」를 견주세요. 언제 방향이 뒤집히나요?',
     '양변에 로그를 취해 x 를 구하는 과정을 손으로 쓰세요.'],
  cols:['밑 a','k','해 x','부등식의 해'],
  hint:'힌트 — 지수함수는 밑이 1보다 크면 증가, 작으면 감소합니다. 감소하면 대소 관계가 뒤집힙니다.' },
 apply:{
  q:'새 문제 — <b>2ˣ = 8</b> 의 해 x 는?',
  a:3, tol:0.05,
  why:'2 를 세 번 곱하면 8 이므로 x = 3. 로그로 쓰면 x = log 8 ÷ log 2 = 3 입니다.',
  hint:'2 를 몇 번 곱해야 8 이 되나요?' },
 demo(root){ return expEqDemo(root); }
};

LESSON[113]={
 title:'계산기에 없는 밑 — 로그의 밑 변환',
 problem:{
  q:'계산기에는 <b>log</b> (밑 10)와 <b>ln</b> (밑 e)뿐입니다. 그러면 <b>log₂ 50</b> 은 어떻게 구할까요? 밑 2 짜리 단추는 어디에도 없습니다.',
  svg:`<svg viewBox="0 0 400 170" role="img" aria-label="log 밑2 50 을 log50 나누기 log2 로 바꾸는 식">
    __LB113__
  </svg>`,
  sit:'<b>밑 a</b> 와 <b>진수 b</b> 를 바꾸면 <b>log b</b> · <b>log a</b> · 그 몫인 <b>log_a b</b> 가 나란히 나옵니다. 「거듭제곱으로 검산」을 누르면 a 를 그 수만큼 곱해 정말 b 가 되는지 확인해 줍니다.'
 },
 predict:{
  q:['log₂ 50 이 대략 얼마쯤일지 2의 거듭제곱으로 어림해 적으세요.',
     'aˣ = b 의 양변에 상용로그를 취하면 어떤 식이 될까요?',
     '밑과 진수가 같으면 값이 얼마가 될지 적어 보세요.'] },
 missions:[
  {t:'밑과 진수를 바꿔 <b>log_a b</b> 가 어떻게 변하는지 보세요.', re:'log'},
  {t:'<b>거듭제곱으로 검산</b> 해 보세요. 정말 맞나요?', re:'진수'},
  {t:'아래 <b>탐구 노트</b>로 마무리하세요 — 세 값을 <b>기록</b>하고, 나눠 <b>견주고</b>, 까닭을 <b>판단</b>합니다.',
   re:'탐구 노트 통과',
   do:'① 지금 log b 와 log a 적기 ② 둘을 나눠 log_a b 와 견주기 ③ 밑을 진수와 같게 해 보기',
   hand:'aˣ = b 의 양변에 상용로그를 취해 x = log b ÷ log a 가 나오는 과정을 쓰기'}],
 inquiry:{
  id:'lb113', title:'계산기에 없는 밑',
  q:['밑과 진수를 바꿔 가며 5줄 이상 기록하세요.',
     '「log b」를 「log a」로 나눈 값과 「log_a b」를 견주세요.',
     '밑 변환 공식이 나오는 과정을 손으로 쓰세요.'],
  cols:['밑 a','진수 b','log b','log a','log_a b'],
  hint:'힌트 — a^x = b 의 양변에 상용로그를 취하면 x·log a = log b 가 됩니다.' },
 apply:{
  q:'새 문제 — <b>log₂ 1000</b> 의 값은? (log 2 ≒ 0.3010, 소수 둘째 자리)',
  a:9.97, tol:0.06,
  why:'log 1000 ÷ log 2 = 3 ÷ 0.3010 ≒ 9.97. 2를 열 번 곱하면 1024 이니 10 에 살짝 못 미치는 것이 맞습니다.',
  hint:'log 1000 은 얼마인가요? 그것을 log 2 로 나누세요.' },
 demo(root){ return logBaseDemo(root); }
};

LESSON[114]={
 title:'좌표를 맞바꾼 짝 — 지수와 로그의 대칭',
 problem:{
  q:'<b>2³ = 8</b> 과 <b>log₂ 8 = 3</b> 은 같은 말입니다. 그런데 두 함수의 그래프를 한 좌표평면에 그리면 어떤 관계로 보일까요? 그냥 <b>닮은</b> 정도일까요?',
  svg:`<svg viewBox="0 0 400 170" role="img" aria-label="지수함수와 로그함수가 y=x 에 대칭이고 두 점의 좌표가 맞바뀐 그림">
    __EL114__
  </svg>`,
  sit:'대응점 <b>x</b> 를 움직이면 지수 위의 점 <b>(x, aˣ)</b> 과 그 좌표를 맞바꾼 <b>로그 위의 점</b> 이 함께 찍힙니다. 두 점을 이은 선분이 <b>y = x</b> 와 어떤 사이인지 바로 보입니다.'
 },
 predict:{
  q:['(1, 2) 가 지수 위의 점이면 로그 위에는 어떤 점이 있을지 예상하세요.',
     '두 점을 이은 선분의 중점이 어디에 있을지 적어 보세요.',
     '지수함수의 치역과 로그함수의 정의역을 견주면 어떨까요?'] },
 missions:[
  {t:'x 를 움직여 <b>두 점의 좌표</b> 가 어떻게 바뀌는지 보세요.', re:'로그 위의 점'},
  {t:'두 점을 이은 선분과 <b>y = x</b> 의 사이를 보세요.', re:'대칭축'},
  {t:'아래 <b>탐구 노트</b>로 마무리하세요 — 두 점을 <b>기록</b>하고, 중점을 <b>계산</b>하고, 관계를 <b>판단</b>합니다.',
   re:'탐구 노트 통과',
   do:'① 지금 x 와 aˣ 적기 ② 두 점의 중점을 계산하기 ③ 그 중점이 y = x 위에 있는지 확인',
   hand:'역함수가 정의역과 치역을 맞바꾸는 일임을 쓰고, 그래서 y = x 에 대칭인 까닭을 설명하기'}],
 inquiry:{
  id:'el114', title:'좌표를 맞바꾼 짝',
  q:['x 를 바꿔 가며 5줄 이상 기록하세요.',
     '「x」와 「a^x」, 「로그 위의 점」을 견주세요. 무엇이 맞바뀌나요?',
     '두 그래프가 y = x 에 대칭인 까닭을 손으로 설명하세요.'],
  cols:['x','a^x','로그 위의 점','대칭축'],
  hint:'힌트 — (p, q) 가 지수 위의 점이면 (q, p) 는 로그 위의 점입니다. 두 점의 중점은 y = x 위에 있습니다.' },
 apply:{
  q:'새 문제 — 지수함수 위에 점 <b>(2, 4)</b> 가 있습니다. 그 역함수(로그함수) 위에 있는 짝이 되는 점의 <b>x 좌표</b>는?',
  a:4, tol:0.1,
  why:'좌표를 맞바꾼 (4, 2) 가 로그함수 위의 점입니다. 그래서 x 좌표는 4 입니다.',
  hint:'역함수는 좌표를 맞바꿉니다.' },
 demo(root){ return expLogDemo(root); }
};

LESSON[115]={
 title:'2의 100제곱은 몇 자리? — 상용로그의 지표와 가수',
 problem:{
  q:'<b>2¹⁰⁰</b> 을 계산기에 넣으면 넘쳐서 제대로 안 나옵니다. 그런데 이 수가 <b>몇 자리</b> 인지, <b>첫 자리가 무엇</b> 인지는 알 수 있습니다. 어떻게 가능할까요?',
  svg:`<svg viewBox="0 0 400 170" role="img" aria-label="log 2의100제곱 값의 정수 부분과 소수 부분이 자릿수와 첫 자리를 정하는 그림">
    __LG115__
  </svg>`,
  sit:'밑과 지수를 바꾸면 <b>log 값</b> 이 계산되고, 그 <b>정수 부분(지표)</b> 과 <b>소수 부분(가수)</b> 가 나뉘어 <b>자릿수</b> 와 <b>첫 자리</b> 를 알려 줍니다.'
 },
 predict:{
  q:['2¹⁰⁰ 이 몇 자리쯤일지 어림해 적으세요.',
     '어떤 수의 자릿수가 무엇으로 정해질지 예상하세요 — 10의 몇 제곱 사이인지로요.',
     'log 값의 소수 부분은 무엇을 알려 줄까요?'] },
 missions:[
  {t:'지수를 바꿔 <b>자릿수</b> 가 어떻게 늘어나는지 보세요.', re:'자릿수'},
  {t:'<b>지표</b> 와 <b>가수</b> 가 각각 무엇을 정하는지 보세요.', re:'가수'},
  {t:'아래 <b>탐구 노트</b>로 마무리하세요 — 값을 <b>기록</b>하고, 지표로 <b>계산</b>하고, 규칙을 <b>판단</b>합니다.',
   re:'탐구 노트 통과',
   do:'① 지금 log 값과 지표 적기 ② 지표 + 1 이 자릿수와 같은지 확인 ③ 지수를 바꿔 다시 확인',
   hand:'10^지표 ≤ N < 10^(지표+1) 에서 자릿수가 지표 + 1 임을 설명하기'}],
 inquiry:{
  id:'lg115', title:'2의 100제곱은 몇 자리',
  q:['밑과 지수를 바꿔 가며 5줄 이상 기록하세요.',
     '「지표」와 「자릿수」를 견주세요. 어떤 관계인가요?',
     '자릿수가 지표 + 1 인 까닭을 손으로 설명하세요.'],
  cols:['수','log 값','지표','가수','자릿수','첫 자리'],
  hint:'힌트 — 어떤 수 N 의 자릿수는 10 의 몇 제곱과 몇 제곱 사이에 있는지가 정합니다.' },
 apply:{
  q:'새 문제 — <b>2¹⁰⁰</b> 은 몇 <b>자리</b> 수일까요? (log 2 ≒ 0.3010)',
  a:31, tol:0.5,
  why:'log(2¹⁰⁰) = 100 × 0.3010 = 30.10 이므로 지표가 30, 자릿수는 30 + 1 = <b>31자리</b> 입니다.',
  hint:'log 값을 구한 뒤 정수 부분에 1을 더하세요.' },
 demo(root){ return log10Demo(root); }
};

LESSON[116]={
 title:'밑을 바꾸면 곡선이 뒤집힌다 — 지수함수의 변신',
 problem:{
  q:'<b>y = 2ˣ</b> 는 오른쪽으로 갈수록 올라갑니다. 그런데 <b>y = 0.5ˣ</b> 는 내려갑니다. 또 <b>+ 3</b> 을 붙이면 그래프가 올라가는데, 그때 <b>점근선</b> 은 어떻게 될까요?',
  svg:`<svg viewBox="0 0 400 170" role="img" aria-label="기준 곡선과 오른쪽 1 위로 3 민 곡선, 들어 올려진 점근선">
    __EM116__
  </svg>`,
  sit:'<b>밑 a</b> · <b>가로 이동 p</b> · <b>세로 이동 q</b> 를 따로 움직이면 <b>증가/감소</b> · <b>점근선</b> · <b>y절편</b> 이 함께 계산됩니다. 셋 중 무엇이 점근선을 바꾸는지 직접 확인합니다.'
 },
 predict:{
  q:['밑이 1보다 작으면 곡선이 어떻게 될지 예상하세요.',
     'y = 2ˣ 의 점근선은 어디일까요?',
     '+ 3 을 붙이면 점근선이 따라 올라갈지 예상하고 까닭도 적으세요.'] },
 missions:[
  {t:'밑을 <b>1보다 작게</b> 해 보세요. 증가가 감소로 바뀌나요?', re:'감소'},
  {t:'<b>q 만</b> 움직여 보세요. 점근선이 따라 올라가나요?', re:'점근선'},
  {t:'아래 <b>탐구 노트</b>로 마무리하세요 — 값을 <b>기록</b>하고, p·q 를 따로 움직여 <b>견주고</b>, 담당을 <b>판단</b>합니다.',
   re:'탐구 노트 통과',
   do:'① 지금 밑·p·q 와 점근선 적기 ② p 만 바꿔 점근선이 그대로인지 보기 ③ q 만 바꿔 다시 보기',
   hand:'y = a^(x−p) + q 에서 p 와 q 가 각각 무엇을 미는지 쓰고, 왜 q 만 점근선을 들어 올리는지 설명하기'}],
 inquiry:{
  id:'em116', title:'밑을 바꾸면 곡선이 뒤집힌다',
  q:['밑·p·q 를 바꿔 가며 5줄 이상 기록하세요. 밑이 1보다 작은 경우도 넣으세요.',
     '「점근선」 열을 보세요. p 와 q 중 무엇이 점근선을 바꾸나요?',
     'y 절편이 a^(−p) + q 인 까닭을 손으로 설명하세요.'],
  cols:['밑 a','p','q','증가/감소','점근선','y절편'],
  hint:'힌트 — y = a^(x−p) + q 는 기준 곡선을 오른쪽 p, 위로 q 만큼 민 것입니다.' },
 apply:{
  q:'새 문제 — <b>y = 2^(x − 1) + 3</b> 의 <b>y 절편</b> 은? (소수 첫째 자리)',
  a:3.5, tol:0.05,
  why:'x = 0 을 넣으면 2⁻¹ + 3 = 0.5 + 3 = 3.5. 점근선은 y = 3 이고 거기서 0.5 만큼 위입니다.',
  hint:'x 에 0 을 넣으세요.' },
 demo(root){ return expMoveDemo(root); }
};

LESSON[117]={
 title:'무엇이 무엇을 바꿨나 — 주기·진폭·위상',
 problem:{
  q:'<b>y = a sin(b(x − c)) + d</b> 에는 숫자가 네 개 있습니다. 어떤 것을 바꾸면 <b>파도가 높아지고</b>, 어떤 것을 바꾸면 <b>빨라질까요?</b> 넷을 뒤섞으면 구별이 안 됩니다.',
  svg:`<svg viewBox="0 0 400 170" role="img" aria-label="기준 사인 곡선과 진폭 2 주기 절반인 곡선, 주기 표시">
    __TP117__
  </svg>`,
  sit:'<b>a · b · c · d</b> 를 하나씩 움직이면 <b>주기</b> · <b>최댓값</b> · <b>최솟값</b> 이 함께 계산됩니다. 한 번에 하나만 바꿔 보면 각 숫자의 담당이 분명해집니다.'
 },
 predict:{
  q:['a 를 키우면 파도가 어떻게 될지 예상하세요.',
     'b 를 키우면 어떻게 될까요? 주기는 길어질까요, 짧아질까요?',
     '최댓값이 d + a 인 까닭을 한 줄로 적어 보세요.'] },
 missions:[
  {t:'<b>a 만</b> 바꿔 보세요. 무엇이 변하나요?', re:'최댓값'},
  {t:'<b>b 만</b> 바꿔 보세요. 주기가 어떻게 되나요?', re:'주기'},
  {t:'아래 <b>탐구 노트</b>로 마무리하세요 — 값을 <b>기록</b>하고, 하나씩만 바꿔 <b>견주고</b>, 담당을 <b>판단</b>합니다.',
   re:'탐구 노트 통과',
   do:'① 지금 a·b 와 주기·최댓값 적기 ② a 만 바꿔 주기가 그대로인지 보기 ③ b 만 바꿔 최댓값이 그대로인지 보기',
   hand:'b 가 x 에 곱해져 «시간을 빠르게», a 가 y 에 곱해져 «크기를 키우게» 한다는 것을 그림으로 설명하기'}],
 inquiry:{
  id:'tp117', title:'무엇이 무엇을 바꿨나',
  q:['네 값을 하나씩만 바꿔 가며 5줄 이상 기록하세요.',
     '「주기」와 b, 「최댓값」과 a·d 를 각각 견주세요.',
     '각 숫자의 담당을 손으로 정리하세요.'],
  cols:['a','b','c','d','주기','최댓값','최솟값'],
  hint:'힌트 — b 는 x 에 곱해져 「시간을 빠르게」, a 는 y 에 곱해져 「크기를 키우게」 합니다.' },
 apply:{
  q:'새 문제 — <b>y = 3 sin 4x</b> 의 <b>주기</b> 는? (소수 셋째 자리, π ≒ 3.1416)',
  a:1.571, tol:0.02,
  why:'주기 = 2π ÷ b = 2 × 3.1416 ÷ 4 ≒ 1.571. 진폭 3 은 주기와 아무 상관이 없습니다.',
  hint:'주기는 2π ÷ b 입니다.' },
 demo(root){ return trigParamDemo(root); }
};

LESSON[118]={
 title:'해가 왜 무한히 많을까 — 삼각방정식',
 problem:{
  q:'<b>x² = 4</b> 의 해는 두 개입니다. 그런데 <b>sin x = 0.5</b> 의 해는 <b>무한히 많습니다.</b> 방정식 하나에 해가 끝없이 많다는 것이 어떻게 가능할까요?',
  svg:`<svg viewBox="0 0 400 170" role="img" aria-label="사인 곡선과 높이 0.5 인 직선이 끝없이 만나는 그림">
    __TE118__
  </svg>`,
  sit:'오른쪽 값 <b>k</b> 를 바꾸면 한 바퀴 안의 <b>해 두 개</b> 와 <b>해의 개수</b> 가 표시됩니다. k 를 1 로 올리거나 1 을 넘기면 해가 하나로 줄거나 아예 없어지는 것도 볼 수 있습니다.'
 },
 predict:{
  q:['sin x = 0.5 의 해가 한 바퀴 안에 몇 개일지 예상하세요.',
     'k = 1 이면 해가 몇 개가 될까요?',
     'k 가 1보다 크면 어떻게 될지 적어 보세요.'] },
 missions:[
  {t:'k 를 바꿔 <b>한 바퀴 해의 수</b> 를 보세요.', re:'해'},
  {t:'k 를 <b>1보다 크게</b> 해 보세요. 해가 있나요?', re:'없음'},
  {t:'아래 <b>탐구 노트</b>로 마무리하세요 — 해를 <b>기록</b>하고, k 를 바꿔 <b>견주고</b>, 일반해를 <b>판단</b>합니다.',
   re:'탐구 노트 통과',
   do:'① k 를 정해 한 바퀴 안의 두 해 적기 ② 두 해를 더해 보기 ③ k 를 1 로 올려 해의 수가 줄어드는 것 보기',
   hand:'단위원에서 높이가 k 인 점이 보통 두 곳인 까닭과, «+ 360°n» 이 붙는 까닭을 설명하기'}],
 inquiry:{
  id:'te118', title:'해가 왜 무한히 많을까',
  q:['k 를 바꿔 가며 5줄 이상 기록하세요. 해가 없는 경우도 넣으세요.',
     '「해 ①」과 「해 ②」를 더해 보세요. 늘 얼마인가요?',
     '일반해에 «+ 360°n» 이 붙는 까닭을 손으로 설명하세요.'],
  cols:['k','해 ①','해 ②','한 바퀴 해의 수','일반해'],
  hint:'힌트 — 단위원에서 높이가 k 인 점은 보통 두 곳입니다. 한 바퀴 더 돌면 같은 자리로 돌아옵니다.' },
 apply:{
  q:'새 문제 — <b>sin x = 0.5</b> 의 해 중 <b>0° 와 360° 사이</b> 의 두 해를 더하면?',
  a:180, tol:1,
  why:'두 해는 30° 와 150° 이고 30 + 150 = 180°. 단위원에서 높이가 같은 두 점은 세로축에 대칭이라 합이 늘 180° 입니다.',
  hint:'두 해를 각각 구한 뒤 더하세요.' },
 demo(root){ return trigEqDemo(root); }
};

LESSON[119]={
 title:'두 파동을 더하면 — 삼각함수의 합성',
 problem:{
  q:'<b>2 sin x</b> 와 <b>cos x</b> 를 더하면 어떤 모양이 될까요? 울퉁불퉁한 이상한 곡선이 될 것 같지만, 놀랍게도 <b>또 하나의 깨끗한 파동</b> 이 됩니다. 그 파동의 높이는 얼마일까요?',
  svg:`<svg viewBox="0 0 400 170" role="img" aria-label="2sinx 와 cosx 를 더한 곡선이 또 하나의 사인 곡선이 되는 그림">
    __TS119__
  </svg>`,
  sit:'계수 <b>a</b> 와 <b>b</b> 를 바꾸면 두 파동과 그 합이 함께 그려지고, 합의 <b>높이 R</b> 과 <b>밀린 각 α</b> 가 계산됩니다. 「합성 곡선 겹쳐 보기」로 정말 한 개의 사인 곡선인지 확인할 수 있습니다.'
 },
 predict:{
  q:['두 파동을 더하면 모양이 깨질지, 또 하나의 파동이 될지 예상하세요.',
     '합의 최댓값이 2 + 1 = 3 일지 예상하고 까닭도 적으세요.',
     '(a, b) 를 좌표로 보면 무엇이 보일까요?'] },
 missions:[
  {t:'a 와 b 를 바꿔 <b>R</b> 이 어떻게 변하는지 보세요.', re:'R'},
  {t:'<b>합성 곡선</b> 을 겹쳐 보세요. 정말 한 개의 파동인가요?', re:'최댓값'},
  {t:'아래 <b>탐구 노트</b>로 마무리하세요 — 값을 <b>기록</b>하고, √(a²+b²) 를 <b>계산</b>하고, 뜻을 <b>판단</b>합니다.',
   re:'탐구 노트 통과',
   do:'① 지금 a·b·R 적기 ② √(a²+b²) 를 직접 계산해 R 과 견주기 ③ a·b 를 바꿔 다시 확인',
   hand:'(a, b) 를 좌표로 볼 때 R 이 원점까지의 거리, α 가 방향각임을 그림으로 설명하기'}],
 inquiry:{
  id:'ts119', title:'두 파동을 더하면',
  q:['a 와 b 를 바꿔 가며 5줄 이상 기록하세요.',
     '「R」과 √(a² + b²) 를 견주세요.',
     '(a, b) 를 좌표로 볼 때 R 과 α 가 무엇인지 손으로 설명하세요.'],
  cols:['a','b','R','α','최댓값'],
  hint:'힌트 — (a, b) 를 좌표로 보면 R 은 원점까지의 거리, α 는 그 점의 방향각입니다.' },
 apply:{
  q:'새 문제 — <b>3 sin x + 4 cos x</b> 의 <b>최댓값</b> 은?',
  a:5, tol:0.1,
  why:'R = √(3² + 4²) = √25 = 5. 3 + 4 = 7 이 아닙니다 — 두 파동의 꼭대기가 같은 자리에 오지 않기 때문입니다.',
  hint:'R = √(a² + b²) 를 쓰세요.' },
 demo(root){ return trigSumDemo(root); }
};

LESSON[120]={
 title:'각 없이 넓이 구하기 — 헤론의 공식',
 problem:{
  q:'삼각형의 넓이는 <b>밑변 × 높이 ÷ 2</b> 입니다. 그런데 밭의 <b>세 변 길이</b> 만 알고 높이도 각도 모른다면 어떻게 할까요? 재러 들어갈 수도 없다면요.',
  svg:`<svg viewBox="0 0 400 170" role="img" aria-label="세 변이 13 14 15 인 삼각형과 헤론 공식으로 구한 넓이 84">
    __HR120__
  </svg>`,
  sit:'세 변 <b>a · b · c</b> 를 바꾸면 <b>s</b> 와 <b>헤론 넓이</b> 가 계산되고, 「½ab sin C 로 검산」을 누르면 다른 방법으로 구한 넓이와 나란히 놓입니다. 삼각형이 아예 안 되는 조합도 만들어 볼 수 있습니다.'
 },
 predict:{
  q:['세 변만으로 넓이가 하나로 정해질지 예상하고 까닭도 적으세요.',
     '세 변이 3, 4, 10 이면 삼각형이 될까요?',
     '같은 세 변을 가진 삼각형이 여럿 있을 수 있을까요?'] },
 missions:[
  {t:'세 변을 바꿔 <b>헤론 넓이</b> 가 어떻게 변하는지 보세요.', re:'헤론'},
  {t:'<b>½ab sin C 로 검산</b> 해 두 값을 견주어 보세요.', re:'sinC'},
  {t:'아래 <b>탐구 노트</b>로 마무리하세요 — 값을 <b>기록</b>하고, 두 방법을 <b>견주고</b>, 까닭을 <b>판단</b>합니다.',
   re:'탐구 노트 통과',
   do:'① 지금 세 변과 s·헤론 넓이 적기 ② 검산해 ½ab sin C 와의 차 구하기 ③ 삼각형이 안 되는 세 변 만들어 보기',
   hand:'세 변이 같으면 삼각형이 합동이고, 합동이면 넓이가 같을 수밖에 없음을 쓰기'}],
 inquiry:{
  id:'hr120', title:'각 없이 넓이 구하기',
  q:['세 변을 바꿔 가며 5줄 이상 기록하세요. 삼각형이 안 되는 조합도 넣으세요.',
     '「헤론 넓이」와 「½ab sinC」를 견주세요.',
     '세 변만으로 넓이가 정해지는 까닭을 합동으로 손으로 설명하세요.'],
  cols:['a','b','c','s','헤론 넓이','½ab sinC'],
  hint:'힌트 — 세 변이 같으면 삼각형은 합동입니다. 합동이면 넓이도 같을 수밖에 없습니다.' },
 apply:{
  q:'새 문제 — 세 변이 <b>13 · 14 · 15</b> 인 삼각형의 넓이는?',
  a:84, tol:0.5,
  why:'s = (13 + 14 + 15) ÷ 2 = 21 이고 √(21 × 8 × 7 × 6) = √7056 = 84. 각은 하나도 재지 않았습니다.',
  hint:'s 를 먼저 구한 뒤 √(s(s−a)(s−b)(s−c)) 를 계산하세요.' },
 demo(root){ return heronDemo(root); }
};

"""


def note(no, head, c1, c2, c3):
    return "\n %d:{ h:'%s',\n  c:[\n%s,\n%s,\n%s\n ]},\n" % (no, head, c1, c2, c3)


NOTES = (
 note(111, '내가 밀고 · 내가 끊고 · 내가 판단한다',
 """  {t:'기록 — 간격을 좁게 두고 첫 장을 밀어 <b>끝까지</b> 무너뜨린 뒤 적으세요',
   f:'쓰러진 수 = {0} · 전부 무너졌으면 1 → {1}',
   chk(got, r, mem){
     if(!r) return {ok:false, msg:'아직 화면 값이 없습니다.'};
     if(String(r[3]).indexOf('예')<0)
       return {ok:false, msg:'아직 «'+r[2]+'개» 만 쓰러졌습니다. 간격을 좁히고 첫 장을 밀어 끝까지 가게 하세요.'};
     const n=noteNum(r[2]);
     if(![0,1].every(j=>isFinite(got[j]))) return {ok:false, msg:'두 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-n)>0.5) return {ok:false, msg:'쓰러진 수는 '+r[2]+' 입니다.'};
     if(Math.abs(got[1]-1)>0.01) return {ok:false, msg:'화면에 «'+r[3]+'» 라고 나와 있습니다.'};
     mem.all=n;
     return {ok:true, msg:'기록했습니다 — 두 조건이 다 갖춰진 경우입니다. 하나를 깨 봅시다.'};
   }}""",
 """  {t:'생각 — <b>연결을 끊고</b>(간격을 넓히거나 5번째 빼기) 다시 밀어 보세요',
   f:'그때 쓰러진 수 = {0} · ①보다 줄어든 만큼 = {1}',
   chk(got, r, mem){
     if(mem.all===undefined) return {ok:false, msg:'① 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     if(String(r[1]).indexOf('끊김')<0)
       return {ok:false, msg:'아직 «'+r[1]+'» 입니다. 간격을 1.8 보다 넓히거나 「5번째만 빼기」를 켜세요.'};
     if(String(r[0]).indexOf('밀었')<0) return {ok:false, msg:'첫 장을 밀어 보세요.'};
     const n=noteNum(r[2]);
     if(![0,1].every(j=>isFinite(got[j]))) return {ok:false, msg:'두 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-n)>0.5) return {ok:false, msg:'쓰러진 수는 '+r[2]+' 입니다.'};
     if(Math.abs(got[1]-(mem.all-n))>0.5) return {ok:false, msg:'①의 '+mem.all+' 에서 지금 수를 빼세요.'};
     mem.cut=n;
     return {ok:true, msg:'계산했습니다 — 거기서 멈췄습니다. 이번에는 첫 장을 밀지 말아 봅시다.'};
   }}""",
 """  {t:'판단 — 연결은 이어 두고 <b>첫 장을 밀지 않은</b> 상태에서 고르세요',
   f:'그때 쓰러진 수 = {0}',
   opts:['두 조건이 <b>모두</b> 있어야 끝까지 간다 — 「첫 장이 넘어진다」와 「넘어진 장이 다음을 민다」',
         '첫 장만 밀면 끝까지 간다',
         '연결만 이어져 있으면 저절로 무너진다'],
   chk(got, r, mem, pick){
     if(mem.cut===undefined) return {ok:false, msg:'② 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     if(String(r[1]).indexOf('이어짐')<0)
       return {ok:false, msg:'연결을 다시 이어 주세요 — 간격을 좁히고 「5번째만 빼기」를 끄세요.'};
     if(String(r[0]).indexOf('아니오')<0)
       return {ok:false, msg:'아직 민 상태입니다 — 「처음부터」로 되돌려 밀지 않은 상태로 두세요.'};
     const n=noteNum(r[2]);
     if(!isFinite(got[0])) return {ok:false, msg:'칸을 채우세요.'};
     if(Math.abs(got[0]-n)>0.5) return {ok:false, msg:'쓰러진 수는 '+r[2]+' 입니다.'};
     if(pick!==0)
       return {ok:false, msg:'다 갖췄을 때 '+mem.all+'개, 끊었을 때 '+mem.cut+'개, 밀지 않았을 때 '+n+'개였습니다. 다시 고르세요.'};
     return {ok:true, msg:'판단했습니다 — <b>①「n = 1 일 때 참」이 첫 장을 미는 일, ②「n = k 이면 n = k+1 도 참」이 다음을 미는 연결</b> 입니다. 둘 중 하나만 빠져도 모든 자연수로 번지지 않습니다.'};
   }}""")
 +
 note(112, '내가 풀고 · 내가 뒤집고 · 내가 판단한다',
 """  {t:'기록 — 밑을 <b>1보다 크게</b> 두고 해를 적으세요',
   f:'밑 a = {0} · k = {1} · 해 x = {2}',
   chk(got, r, mem){
     if(!r) return {ok:false, msg:'아직 화면 값이 없습니다.'};
     const a=noteNum(r[0]), k=noteNum(r[1]), x=noteNum(r[2]);
     if(!(a>1)) return {ok:false, msg:'지금 밑이 '+r[0]+' 입니다. 1보다 크게 맞추세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-a)>0.06||Math.abs(got[1]-k)>0.12)
       return {ok:false, msg:'화면은 '+r[0]+' 와 '+r[1]+' 입니다.'};
     if(Math.abs(got[2]-x)>0.006) return {ok:false, msg:'해는 '+r[2]+' 입니다.'};
     mem.a=a; mem.x=x; mem.ineq=String(r[3]);
     return {ok:true, msg:'기록했습니다 — 부등식의 해가 «'+mem.ineq+'» 입니다.'};
   }}""",
 """  {t:'생각 — 직접 <b>로그로</b> 풀어 화면과 견주세요',
   f:'log k ÷ log a = {0} · 화면의 해와의 차 = {1}',
   chk(got, r, mem){
     if(mem.a===undefined) return {ok:false, msg:'① 칸을 먼저 통과하세요.'};
     if(![0,1].every(j=>isFinite(got[j]))) return {ok:false, msg:'두 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-mem.x)>0.02) return {ok:false, msg:'①의 k 와 a 로 log k ÷ log a 를 계산하세요.'};
     if(Math.abs(got[1])>0.02) return {ok:false, msg:'내가 구한 값에서 ①의 해를 빼세요.'};
     mem.ok2=true;
     return {ok:true, msg:'계산했습니다 — 로그로 푼 값과 화면이 같습니다.'};
   }}""",
 """  {t:'판단 — 밑을 <b>1보다 작게</b> 바꾼 뒤 부등식의 해를 보고 고르세요',
   f:'새 밑 a = {0} · 새 해 x = {1}',
   opts:['밑이 1보다 작으면 지수함수가 <b>감소</b> 하므로 부등식의 <b>방향이 뒤집힌다</b>',
         '밑이 무엇이든 부등식의 방향은 같다',
         '밑이 작으면 해가 아예 없다'],
   chk(got, r, mem, pick){
     if(!mem.ok2) return {ok:false, msg:'② 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const a=noteNum(r[0]), x=noteNum(r[2]), nw=String(r[3]);
     if(!(a<1)) return {ok:false, msg:'지금 밑이 '+r[0]+' 입니다. 1보다 작게 바꾸세요.'};
     if(![0,1].every(j=>isFinite(got[j]))) return {ok:false, msg:'두 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-a)>0.06||Math.abs(got[1]-x)>0.006)
       return {ok:false, msg:'지금은 '+r[0]+' 와 '+r[2]+' 입니다.'};
     if(pick!==0)
       return {ok:false, msg:'①에서는 «'+mem.ineq+'», 지금은 «'+nw+'» 입니다. 무엇이 달라졌나요? 다시 고르세요.'};
     return {ok:true, msg:'판단했습니다 — <b>양변에 로그를 취해 x 를 구하되, 밑이 1보다 작으면 log a 가 음수</b> 라 나눌 때 부등호가 뒤집힙니다. 음수로 나누면 뒤집히는 것과 같은 일입니다.'};
   }}""")
 +
 note(113, '내가 나누고 · 내가 검산하고 · 내가 판단한다',
 """  {t:'기록 — 밑과 진수를 정한 뒤 두 로그를 적으세요',
   f:'log b = {0} · log a = {1} · 화면의 log_a b = {2}',
   chk(got, r, mem){
     if(!r) return {ok:false, msg:'아직 화면 값이 없습니다.'};
     const lb=noteNum(r[2]), la=noteNum(r[3]), v=noteNum(r[4]);
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-lb)>0.0006||Math.abs(got[1]-la)>0.0006)
       return {ok:false, msg:'화면은 '+r[2]+' 와 '+r[3]+' 입니다.'};
     if(Math.abs(got[2]-v)>0.0006) return {ok:false, msg:'log_a b 는 '+r[4]+' 입니다.'};
     mem.lb=lb; mem.la=la; mem.v=v; mem.a=noteNum(r[0]);
     return {ok:true, msg:'기록했습니다 — 앞의 두 수를 나눠 봅시다.'};
   }}""",
 """  {t:'생각 — <b>log b ÷ log a</b> 를 직접 계산해 견주세요',
   f:'log b ÷ log a = {0} · 화면의 log_a b 와의 차 = {1}',
   chk(got, r, mem){
     if(mem.lb===undefined) return {ok:false, msg:'① 칸을 먼저 통과하세요.'};
     if(![0,1].every(j=>isFinite(got[j]))) return {ok:false, msg:'두 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-mem.lb/mem.la)>0.004) return {ok:false, msg:'①의 두 값을 나누세요.'};
     if(Math.abs(got[1])>0.004) return {ok:false, msg:'나눈 값에서 ①의 log_a b 를 빼세요.'};
     mem.ok2=true;
     return {ok:true, msg:'계산했습니다 — 차가 0 입니다. 밑과 진수를 바꿔도 그럴까요?'};
   }}""",
 """  {t:'판단 — <b>밑을 진수와 같게</b> 맞춘 뒤 고르세요',
   f:'그때 log_a b = {0}',
   opts:['aˣ = b 의 양변에 로그를 취하면 x·log a = log b — 그래서 <b>log_a b = log b ÷ log a</b>',
         '로그는 밑을 바꿀 수 없다',
         '밑과 진수가 같으면 값이 0 이다'],
   chk(got, r, mem, pick){
     if(!mem.ok2) return {ok:false, msg:'② 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const a=noteNum(r[0]), b=noteNum(r[1]), v=noteNum(r[4]);
     if(Math.abs(a-b)>0.5) return {ok:false, msg:'밑 '+r[0]+' 과 진수 '+r[1]+' 이 다릅니다. 「밑 = 진수로 맞추기」를 눌러 보세요.'};
     if(!isFinite(got[0])) return {ok:false, msg:'칸을 채우세요.'};
     if(Math.abs(got[0]-v)>0.004) return {ok:false, msg:'화면의 값은 '+r[4]+' 입니다.'};
     if(Math.abs(v-1)>0.01) return {ok:false, msg:'밑과 진수를 정확히 같게 맞추세요.'};
     if(pick!==0)
       return {ok:false, msg:'밑과 진수가 같으니 log b ÷ log a 가 1 이 되었습니다. 이 식이 어디서 왔는지 생각하고 다시 고르세요.'};
     return {ok:true, msg:'판단했습니다 — <b>밑이 무엇이든 같은 밑으로 아래위를 맞추면 된다</b> 는 것이 밑 변환 공식입니다. 계산기에 log 와 ln 뿐이어도 어떤 밑이든 구할 수 있습니다.'};
   }}""")
 +
 note(114, '내가 옮기고 · 내가 맞바꾸고 · 내가 판단한다',
 """  {t:'기록 — 대응점 x 를 정한 뒤 두 점을 적으세요',
   f:'x = {0} · a^x = {1}',
   chk(got, r, mem){
     if(!r) return {ok:false, msg:'아직 화면 값이 없습니다.'};
     const x=noteNum(r[0]), f=noteNum(r[1]);
     if(![0,1].every(j=>isFinite(got[j]))) return {ok:false, msg:'두 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-x)>0.06||Math.abs(got[1]-f)>0.02)
       return {ok:false, msg:'화면은 x = '+r[0]+' · a^x = '+r[1]+' 입니다.'};
     mem.x=x; mem.f=f;
     return {ok:true, msg:'기록했습니다 — 로그 위의 점은 «'+r[2]+'» 입니다. 좌표가 맞바뀌었나요?'};
   }}""",
 """  {t:'생각 — 두 점의 <b>중점</b> 을 구하세요',
   f:'중점의 x 좌표 = {0} · 중점의 y 좌표 = {1} · 두 좌표의 차 = {2}',
   chk(got, r, mem){
     if(mem.x===undefined) return {ok:false, msg:'① 칸을 먼저 통과하세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     const mx=(mem.x+mem.f)/2;
     if(Math.abs(got[0]-mx)>0.03||Math.abs(got[1]-mx)>0.03)
       return {ok:false, msg:'(x, a^x) 과 (a^x, x) 의 중점입니다 — 두 좌표를 각각 더해 2로 나누세요.'};
     if(Math.abs(got[2])>0.03) return {ok:false, msg:'두 좌표를 빼 보세요. 무엇이 나오나요?'};
     mem.ok2=true;
     return {ok:true, msg:'계산했습니다 — x 좌표와 y 좌표가 같습니다. 그 점은 어디 위에 있을까요?'};
   }}""",
 """  {t:'판단 — <b>x 를 다른 값으로</b> 옮겨 다시 확인한 뒤 고르세요',
   f:'새 x = {0} · a^x = {1} · 중점의 두 좌표가 같으면 1 → {2}',
   opts:['역함수는 <b>정의역과 치역을 맞바꾼다</b> — 그래서 두 점은 y = x 에 대칭이고 중점이 y = x 위에 있다',
         '두 그래프는 x축에 대칭이다',
         '두 그래프는 서로 평행이동 관계다'],
   chk(got, r, mem, pick){
     if(!mem.ok2) return {ok:false, msg:'② 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const x=noteNum(r[0]), f=noteNum(r[1]);
     if(Math.abs(x-mem.x)<0.3) return {ok:false, msg:'x 가 거의 그대로입니다 — 옮겨 보세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-x)>0.06||Math.abs(got[1]-f)>0.02)
       return {ok:false, msg:'지금은 x = '+r[0]+' · a^x = '+r[1]+' 입니다.'};
     if(Math.abs(got[2]-1)>0.01) return {ok:false, msg:'중점의 두 좌표를 다시 계산해 보세요.'};
     if(pick!==0)
       return {ok:false, msg:'어디로 옮겨도 중점의 두 좌표가 같았습니다. 그런 점들이 모인 직선은 무엇인가요? 다시 고르세요.'};
     return {ok:true, msg:'판단했습니다 — <b>(p, q) 가 지수 위에 있으면 (q, p) 가 로그 위에 있습니다.</b> 두 점의 중점은 늘 x 좌표와 y 좌표가 같으니 y = x 위에 있고, 그래서 두 그래프가 y = x 에 대칭입니다.'};
   }}""")
 +
 note(115, '내가 재고 · 내가 세고 · 내가 판단한다',
 """  {t:'기록 — 밑과 지수를 정한 뒤 적으세요',
   f:'log 값 = {0} · 지표 = {1} · 자릿수 = {2}',
   chk(got, r, mem){
     if(!r) return {ok:false, msg:'아직 화면 값이 없습니다.'};
     const L=noteNum(r[1]), ji=noteNum(r[2]), dg=noteNum(r[4]);
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-L)>0.0006) return {ok:false, msg:'log 값은 '+r[1]+' 입니다.'};
     if(Math.abs(got[1]-ji)>0.5||Math.abs(got[2]-dg)>0.5)
       return {ok:false, msg:'화면은 지표 '+r[2]+' · 자릿수 '+r[4]+' 입니다.'};
     mem.ji=ji; mem.dg=dg;
     return {ok:true, msg:'기록했습니다 — 지표와 자릿수 사이에 무엇이 보이나요?'};
   }}""",
 """  {t:'생각 — <b>자릿수 − 지표</b> 를 구하세요',
   f:'자릿수 − 지표 = {0}',
   chk(got, r, mem){
     if(mem.ji===undefined) return {ok:false, msg:'① 칸을 먼저 통과하세요.'};
     if(!isFinite(got[0])) return {ok:false, msg:'칸을 채우세요.'};
     if(Math.abs(got[0]-(mem.dg-mem.ji))>0.5) return {ok:false, msg:'①의 자릿수에서 지표를 빼세요.'};
     if(Math.abs(got[0]-1)>0.5) return {ok:false, msg:'계산을 다시 해 보세요 — ①의 두 수를 뺀 값입니다.'};
     mem.ok2=true;
     return {ok:true, msg:'계산했습니다 — 늘 1 입니다. 지수를 바꿔도 그럴까요?'};
   }}""",
 """  {t:'판단 — <b>지수를 크게</b> 바꿔 다시 확인한 뒤 고르세요',
   f:'새 지표 = {0} · 새 자릿수 = {1} · 첫 자리 = {2}',
   opts:['10^지표 ≤ N &lt; 10^(지표+1) 이므로 <b>자릿수 = 지표 + 1</b> — 소수 부분(가수)은 첫 자리를 정한다',
         '자릿수는 log 값을 반올림한 것이다',
         '가수가 자릿수를 정한다'],
   chk(got, r, mem, pick){
     if(!mem.ok2) return {ok:false, msg:'② 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const ji=noteNum(r[2]), dg=noteNum(r[4]), fd=noteNum(r[5]);
     if(!(ji > mem.ji + 3)) return {ok:false, msg:'지표가 '+r[2]+' 입니다. 지수를 더 크게 해 지표를 '+(mem.ji+4)+' 보다 크게 만드세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-ji)>0.5||Math.abs(got[1]-dg)>0.5||Math.abs(got[2]-fd)>0.5)
       return {ok:false, msg:'지금은 '+r[2]+' · '+r[4]+' · '+r[5]+' 입니다.'};
     if(pick!==0)
       return {ok:false, msg:'지표가 '+mem.ji+' → '+ji+' 로 커져도 자릿수는 늘 지표보다 1 컸습니다. 다시 고르세요.'};
     return {ok:true, msg:'판단했습니다 — <b>정수 부분(지표)이 «10의 몇 제곱대인가»를, 소수 부분(가수)이 «첫 자리가 무엇인가»를 정합니다.</b> 그래서 계산기가 넘치는 큰 수도 자릿수와 첫 자리는 알 수 있습니다.'};
   }}""")
 +
 note(116, '내가 밀고 · 내가 들고 · 내가 판단한다',
 """  {t:'기록 — 지금 세 값과 점근선을 적으세요',
   f:'밑 a = {0} · p = {1} · q = {2}',
   chk(got, r, mem){
     if(!r) return {ok:false, msg:'아직 화면 값이 없습니다.'};
     const a=noteNum(r[0]), p=noteNum(r[1]), q=noteNum(r[2]);
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-a)>0.06||Math.abs(got[1]-p)>0.06||Math.abs(got[2]-q)>0.06)
       return {ok:false, msg:'화면은 '+r[0]+' · '+r[1]+' · '+r[2]+' 입니다.'};
     mem.a=a; mem.p=p; mem.q=q; mem.asym=noteNum(r[4]);
     return {ok:true, msg:'기록했습니다 — 점근선이 «'+r[4]+'» 입니다. p 만 움직여 봅시다.'};
   }}""",
 """  {t:'생각 — <b>p 만</b> 바꾸고 점근선을 보세요',
   f:'새 p = {0} · 그때 점근선의 y 값 = {1} · ①의 점근선과의 차 = {2}',
   chk(got, r, mem){
     if(mem.a===undefined) return {ok:false, msg:'① 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const p=noteNum(r[1]), q=noteNum(r[2]), as=noteNum(r[4]);
     if(Math.abs(q-mem.q)>0.06) return {ok:false, msg:'q 가 '+r[2]+' 로 달라졌습니다 — q 는 '+mem.q+' 로 두고 p 만 바꾸세요.'};
     if(Math.abs(p-mem.p)<0.4) return {ok:false, msg:'p 가 거의 그대로입니다 — 바꿔 보세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-p)>0.06||Math.abs(got[1]-as)>0.06)
       return {ok:false, msg:'지금은 p = '+r[1]+' · 점근선 '+r[4]+' 입니다.'};
     if(Math.abs(got[2])>0.06) return {ok:false, msg:'①의 점근선과 빼 보세요. 무엇이 나오나요?'};
     mem.ok2=true;
     return {ok:true, msg:'계산했습니다 — 차가 0 — p 는 점근선을 건드리지 않습니다.'};
   }}""",
 """  {t:'판단 — 이번에는 <b>q 만</b> 바꾼 뒤 고르세요',
   f:'새 q = {0} · 그때 점근선의 y 값 = {1} · 두 값이 같으면 1 → {2}',
   opts:['<b>p 는 좌우로 밀 뿐이고, 점근선을 들어 올리는 것은 q</b> 다 — 그래서 점근선은 y = q',
         'p 와 q 둘 다 점근선을 올린다',
         '밑 a 가 점근선을 정한다'],
   chk(got, r, mem, pick){
     if(!mem.ok2) return {ok:false, msg:'② 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const q=noteNum(r[2]), as=noteNum(r[4]);
     if(Math.abs(q-mem.q)<0.4) return {ok:false, msg:'q 가 그대로입니다 — 바꿔 보세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-q)>0.06||Math.abs(got[1]-as)>0.06)
       return {ok:false, msg:'지금은 q = '+r[2]+' · 점근선 '+r[4]+' 입니다.'};
     if(Math.abs(got[2]-1)>0.01) return {ok:false, msg:'q 와 점근선의 y 값을 견주어 보세요.'};
     if(pick!==0)
       return {ok:false, msg:'p 를 바꿨을 때는 점근선이 그대로였고, q 를 바꾸니 따라 움직였습니다. 다시 고르세요.'};
     return {ok:true, msg:'판단했습니다 — <b>y = a^(x−p) + q 는 기준 곡선을 오른쪽 p, 위로 q 만큼 민 것</b> 입니다. 가로로 밀어도 바닥 높이는 그대로이고, 세로로 들어 올릴 때만 점근선이 따라 올라갑니다.'};
   }}""")
 +
 note(117, '내가 하나만 바꾸고 · 내가 재고 · 내가 판단한다',
 """  {t:'기록 — 지금 a·b 와 주기·최댓값을 적으세요',
   f:'a = {0} · b = {1} · 주기 = {2}',
   chk(got, r, mem){
     if(!r) return {ok:false, msg:'아직 화면 값이 없습니다.'};
     const a=noteNum(r[0]), b=noteNum(r[1]), T=noteNum(r[4]);
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-a)>0.06||Math.abs(got[1]-b)>0.06)
       return {ok:false, msg:'화면은 a = '+r[0]+' · b = '+r[1]+' 입니다.'};
     if(Math.abs(got[2]-T)>0.03) return {ok:false, msg:'주기는 '+r[4]+' 입니다.'};
     mem.a=a; mem.b=b; mem.T=T; mem.mx=noteNum(r[5]);
     return {ok:true, msg:'기록했습니다 — 이제 <b>a 만</b> 바꿔 봅시다.'};
   }}""",
 """  {t:'생각 — <b>a 만</b> 바꾸고 주기가 그대로인지 보세요',
   f:'새 a = {0} · 그때 주기 = {1} · ①의 주기와의 차 = {2}',
   chk(got, r, mem){
     if(mem.a===undefined) return {ok:false, msg:'① 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const a=noteNum(r[0]), b=noteNum(r[1]), T=noteNum(r[4]);
     if(Math.abs(b-mem.b)>0.06) return {ok:false, msg:'b 가 '+r[1]+' 로 달라졌습니다 — b 는 '+mem.b+' 로 두고 a 만 바꾸세요.'};
     if(Math.abs(a-mem.a)<0.2) return {ok:false, msg:'a 가 거의 그대로입니다 — 바꿔 보세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-a)>0.06||Math.abs(got[1]-T)>0.03)
       return {ok:false, msg:'지금은 a = '+r[0]+' · 주기 '+r[4]+' 입니다.'};
     if(Math.abs(got[2])>0.03) return {ok:false, msg:'①의 주기와 빼 보세요.'};
     mem.ok2=true;
     return {ok:true, msg:'계산했습니다 — a 는 주기를 건드리지 않습니다. 이번에는 b 만 바꿔 봅시다.'};
   }}""",
 """  {t:'판단 — <b>b 만</b> 바꿔 주기와 최댓값을 보고 고르세요',
   f:'새 b = {0} · 그때 주기 = {1} · 2π ÷ b = {2}',
   opts:['<b>a 는 크기(최댓값), b 는 빠르기(주기)</b> — 각 숫자의 담당이 따로 있다',
         'a 와 b 둘 다 주기를 바꾼다',
         'b 를 키우면 주기가 길어진다'],
   chk(got, r, mem, pick){
     if(!mem.ok2) return {ok:false, msg:'② 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const b=noteNum(r[1]), T=noteNum(r[4]);
     if(Math.abs(b-mem.b)<0.2) return {ok:false, msg:'b 가 그대로입니다 — 바꿔 보세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-b)>0.06||Math.abs(got[1]-T)>0.03)
       return {ok:false, msg:'지금은 b = '+r[1]+' · 주기 '+r[4]+' 입니다.'};
     if(Math.abs(got[2]-2*Math.PI/b)>0.04) return {ok:false, msg:'2π 를 지금 b 로 나누세요.'};
     if(pick!==0)
       return {ok:false, msg:'a 를 바꿨을 때는 주기가 그대로였고, b 를 바꾸니 '+mem.T.toFixed(2)+' → '+T.toFixed(2)+' 로 달라졌습니다. 다시 고르세요.'};
     return {ok:true, msg:'판단했습니다 — <b>b 는 x 에 곱해져 «시간을 빠르게» 하고, a 는 y 에 곱해져 «크기를 키웁니다».</b> 그래서 주기 = 2π ÷ b, 최댓값 = d + a 로 담당이 갈립니다.'};
   }}""")
 +
 note(118, '내가 긋고 · 내가 세고 · 내가 판단한다',
 """  {t:'기록 — k 를 <b>1보다 작게</b> 두고 한 바퀴 안의 두 해를 적으세요',
   f:'해 ① = {0} ° · 해 ② = {1} ° · 한 바퀴 해의 수 = {2}',
   chk(got, r, mem){
     if(!r) return {ok:false, msg:'아직 화면 값이 없습니다.'};
     const n=noteNum(r[3]);
     if(n<2) return {ok:false, msg:'지금 해가 '+n+'개입니다. k 를 −1 과 1 사이(1 은 빼고)로 맞추세요.'};
     const s1=noteNum(r[1]), s2=noteNum(r[2]);
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-s1)>0.6||Math.abs(got[1]-s2)>0.6)
       return {ok:false, msg:'화면은 '+r[1]+' 와 '+r[2]+' 입니다.'};
     if(Math.abs(got[2]-n)>0.5) return {ok:false, msg:'해의 수는 '+r[3]+' 입니다.'};
     mem.s1=s1; mem.s2=s2; mem.k=noteNum(r[0]);
     return {ok:true, msg:'기록했습니다 — 두 해를 더하면 무엇이 나올까요?'};
   }}""",
 """  {t:'생각 — 두 해를 <b>더해</b> 보세요',
   f:'해 ① + 해 ② = {0} ° · 180 과의 차 = {1}',
   chk(got, r, mem){
     if(mem.s1===undefined) return {ok:false, msg:'① 칸을 먼저 통과하세요.'};
     if(![0,1].every(j=>isFinite(got[j]))) return {ok:false, msg:'두 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-(mem.s1+mem.s2))>1.2) return {ok:false, msg:'①에 적은 두 해를 더하세요.'};
     if(Math.abs(got[1])>1.5) return {ok:false, msg:'그 합에서 180 을 빼세요. 무엇이 나오나요?'};
     mem.ok2=true;
     return {ok:true, msg:'계산했습니다 — 합이 180° 입니다. k 를 바꿔도 그럴까요?'};
   }}""",
 """  {t:'판단 — k 를 <b>1보다 크게</b> 해 본 뒤 고르세요',
   f:'그때 한 바퀴 해의 수 = {0}',
   opts:['단위원에서 높이가 k 인 점이 보통 <b>두 곳</b> 이고, 한 바퀴 돌면 같은 자리로 와서 <b>+ 360°n</b> 이 붙는다',
         '삼각방정식은 해가 늘 두 개다',
         'k 가 1보다 커도 해는 있다'],
   chk(got, r, mem, pick){
     if(!mem.ok2) return {ok:false, msg:'② 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const n=noteNum(r[3]);
     if(String(r[4]).indexOf('없음')<0 && n>0)
       return {ok:false, msg:'아직 해가 '+n+'개입니다. 「|k| > 1 로 넘겨 보기」로 k 를 1 보다 크게 해 보세요.'};
     if(!isFinite(got[0])) return {ok:false, msg:'칸을 채우세요.'};
     if(Math.abs(got[0]-n)>0.5) return {ok:false, msg:'해의 수는 '+r[3]+' 입니다.'};
     if(pick!==0)
       return {ok:false, msg:'k 가 1 보다 작을 때는 두 개, 1 보다 클 때는 '+n+'개였습니다. sin 의 값이 어디까지 갈 수 있나요? 다시 고르세요.'};
     return {ok:true, msg:'판단했습니다 — <b>sin 값은 −1 과 1 사이</b> 라 k 가 그 밖이면 해가 없습니다. 안쪽이면 단위원에서 높이가 k 인 점이 두 곳이고, 한 바퀴마다 같은 일이 되풀이되어 해가 무한히 많아집니다.'};
   }}""")
 +
 note(119, '내가 더하고 · 내가 재고 · 내가 판단한다',
 """  {t:'기록 — a 와 b 를 정한 뒤 R 을 적으세요',
   f:'a = {0} · b = {1} · 화면의 R = {2}',
   chk(got, r, mem){
     if(!r) return {ok:false, msg:'아직 화면 값이 없습니다.'};
     const a=noteNum(r[0]), b=noteNum(r[1]), R=noteNum(r[2]);
     if(!(Math.abs(a)>0.2&&Math.abs(b)>0.2))
       return {ok:false, msg:'a 와 b 를 둘 다 0 이 아닌 값으로 두세요 — 두 파동을 더해야 합니다.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-a)>0.06||Math.abs(got[1]-b)>0.06)
       return {ok:false, msg:'화면은 a = '+r[0]+' · b = '+r[1]+' 입니다.'};
     if(Math.abs(got[2]-R)>0.004) return {ok:false, msg:'R 은 '+r[2]+' 입니다.'};
     mem.a=a; mem.b=b; mem.R=R;
     return {ok:true, msg:'기록했습니다 — a + b 가 아니라 R 이 최댓값입니다. 왜일까요?'};
   }}""",
 """  {t:'생각 — <b>√(a² + b²)</b> 를 직접 계산해 견주세요',
   f:'a² + b² = {0} · 그 제곱근 = {1} · 화면의 R 과의 차 = {2}',
   chk(got, r, mem){
     if(mem.a===undefined) return {ok:false, msg:'① 칸을 먼저 통과하세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-(mem.a*mem.a+mem.b*mem.b))>0.12) return {ok:false, msg:'①의 a 와 b 를 각각 제곱해 더하세요.'};
     if(Math.abs(got[1]-mem.R)>0.03) return {ok:false, msg:'그 값의 제곱근을 구하세요.'};
     if(Math.abs(got[2])>0.03) return {ok:false, msg:'내가 구한 값에서 ①의 R 을 빼세요.'};
     mem.ok2=true;
     return {ok:true, msg:'계산했습니다 — 같습니다. (a, b) 를 좌표로 보면 무엇일까요?'};
   }}""",
 """  {t:'판단 — a 와 b 를 바꿔 <b>a + b 와 R 을 견준</b> 뒤 고르세요',
   f:'새 a + b = {0} · 그때 R = {1} · 둘의 차 = {2}',
   opts:['(a, b) 를 좌표로 보면 <b>R 은 원점까지의 거리</b> — 두 파동의 꼭대기가 어긋나 있어 a + b 가 되지 않는다',
         '최댓값은 a + b 다',
         'R 은 a 와 b 중 큰 쪽이다'],
   chk(got, r, mem, pick){
     if(!mem.ok2) return {ok:false, msg:'② 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const a=noteNum(r[0]), b=noteNum(r[1]), R=noteNum(r[2]);
     if(!(a>0.2&&b>0.2)) return {ok:false, msg:'a 와 b 를 둘 다 <b>양수</b>로 두고 견주세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-(a+b))>0.08) return {ok:false, msg:'지금 a 와 b 를 더하세요.'};
     if(Math.abs(got[1]-R)>0.004) return {ok:false, msg:'지금 R 은 '+r[2]+' 입니다.'};
     if(Math.abs(got[2]-(a+b-R))>0.08) return {ok:false, msg:'a + b 에서 R 을 빼세요.'};
     if(pick!==0)
       return {ok:false, msg:'a + b = '+(a+b).toFixed(1)+' 인데 R 은 '+r[2]+' 입니다. 왜 더 작을까요? 다시 고르세요.'};
     return {ok:true, msg:'판단했습니다 — <b>a sin x + b cos x = R sin(x + α), R = √(a² + b²)</b> 입니다. (a, b) 를 좌표로 보면 R 이 원점까지의 거리, α 가 그 방향각입니다 — 피타고라스 정리가 여기서 다시 나옵니다.'};
   }}""")
 +
 note(120, '내가 재고 · 내가 검산하고 · 내가 판단한다',
 """  {t:'기록 — 세 변을 정해 <b>삼각형이 되는</b> 상태에서 적으세요',
   f:'s = {0} · 헤론 넓이 = {1}',
   chk(got, r, mem){
     if(!r) return {ok:false, msg:'아직 화면 값이 없습니다.'};
     if(String(r[4]).indexOf('없음')>=0)
       return {ok:false, msg:'지금 세 변으로는 삼각형이 되지 않습니다 — 가장 긴 변을 줄이세요.'};
     const s=noteNum(r[3]), ar=noteNum(r[4]);
     if(![0,1].every(j=>isFinite(got[j]))) return {ok:false, msg:'두 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-s)>0.06) return {ok:false, msg:'s 는 '+r[3]+' 입니다.'};
     if(Math.abs(got[1]-ar)>0.006) return {ok:false, msg:'헤론 넓이는 '+r[4]+' 입니다.'};
     mem.a=noteNum(r[0]); mem.b=noteNum(r[1]); mem.c=noteNum(r[2]); mem.s=s; mem.ar=ar;
     return {ok:true, msg:'기록했습니다 — 각을 하나도 재지 않았습니다. 정말 맞을까요?'};
   }}""",
 """  {t:'생각 — <b>½ab sin C 로 검산</b> 해 두 넓이를 견주세요',
   f:'½ab sinC = {0} · 헤론 넓이와의 차 = {1}',
   chk(got, r, mem){
     if(mem.ar===undefined) return {ok:false, msg:'① 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     if(String(r[5]).indexOf('없음')>=0) return {ok:false, msg:'삼각형이 되는 세 변으로 맞추세요.'};
     const v=noteNum(r[5]);
     if(![0,1].every(j=>isFinite(got[j]))) return {ok:false, msg:'두 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-v)>0.006) return {ok:false, msg:'화면의 ½ab sinC 는 '+r[5]+' 입니다.'};
     if(Math.abs(got[1])>0.01) return {ok:false, msg:'①의 헤론 넓이와 빼 보세요.'};
     mem.ok2=true;
     return {ok:true, msg:'계산했습니다 — 두 방법이 같은 답을 줍니다.'};
   }}""",
 """  {t:'판단 — 세 변을 바꿔 <b>삼각형이 안 되게</b> 해 본 뒤 고르세요',
   f:'그때 가장 긴 변 = {0} · 나머지 두 변의 합 = {1}',
   opts:['세 변이 같으면 삼각형이 <b>합동</b> 이라 넓이도 하나로 정해진다 — 다만 두 변의 합이 나머지보다 커야 한다',
         '세 변만으로는 넓이가 정해지지 않는다',
         '세 변이 어떤 값이든 삼각형이 된다'],
   chk(got, r, mem, pick){
     if(!mem.ok2) return {ok:false, msg:'② 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     if(String(r[4]).indexOf('없음')<0)
       return {ok:false, msg:'아직 삼각형이 됩니다 — 한 변을 아주 길게 해 「없음」이 되게 하세요.'};
     const a=noteNum(r[0]), b=noteNum(r[1]), c=noteNum(r[2]);
     const mx=Math.max(a,b,c), rest=a+b+c-mx;
     if(![0,1].every(j=>isFinite(got[j]))) return {ok:false, msg:'두 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-mx)>0.5) return {ok:false, msg:'가장 긴 변은 '+mx+' 입니다.'};
     if(Math.abs(got[1]-rest)>0.5) return {ok:false, msg:'나머지 두 변을 더하세요.'};
     if(pick!==0)
       return {ok:false, msg:'가장 긴 변 '+mx+' 이 나머지 두 변의 합 '+rest+' 보다 큽니다. 그래서 닫히지 않습니다. 다시 고르세요.'};
     return {ok:true, msg:'판단했습니다 — <b>세 변이 같으면 삼각형은 합동(SSS)이고, 합동이면 넓이도 같을 수밖에 없습니다.</b> 그래서 각을 하나도 재지 않고 세 변만으로 넓이가 정해집니다 — 다만 두 변의 합이 나머지보다 커야 삼각형이 됩니다.'};
   }}""")
)


def main(path):
    h = open(path, encoding='utf-8').read()
    if 'LESSON[111]=' in h:
        sys.stdout.write('이미 반영됨\n')
        return
    L = (LESSONS.replace('__DM111__', FG.dm111()).replace('__XE112__', FG.xe112())
         .replace('__LB113__', FG.lb113()).replace('__EL114__', FG.el114())
         .replace('__LG115__', FG.lg115()).replace('__EM116__', FG.em116())
         .replace('__TP117__', FG.tp117()).replace('__TE118__', FG.te118())
         .replace('__TS119__', FG.ts119()).replace('__HR120__', FG.hr120()))
    a = 'LESSON[356]={'
    assert h.count(a) == 1
    h = h.replace(a, L + a, 1)
    b = '\n};\n\nfunction labNo(spec)'
    assert h.count(b) == 1
    h = h.replace(b, NOTES + b, 1)
    open(path, 'w', encoding='utf-8').write(h)
    sys.stdout.write('LAB 111~120 ok %.2f MB\n' % (len(h.encode('utf-8')) / 1048576))


if __name__ == '__main__':
    main(sys.argv[1])
