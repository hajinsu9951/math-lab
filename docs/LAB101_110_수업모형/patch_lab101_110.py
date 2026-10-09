# -*- coding: utf-8 -*-
"""LAB 101~110 — 7단계 수업 모형 + 탐구 노트.

그림은 docs/LAB101_110_수업모형/figs.py 가 좌표를 계산해 만든다 (핵심 성질은 assert 로 검산).
사용: python docs/LAB101_110_수업모형/patch_lab101_110.py src/40-demos.js
"""
import sys, os, importlib.util

try:
    sys.stdout.reconfigure(encoding='utf-8')
except Exception:
    pass

_s = importlib.util.spec_from_file_location(
    'figs', os.path.join(os.path.dirname(os.path.abspath(__file__)), 'figs.py'))
FG = importlib.util.module_from_spec(_s)
_s.loader.exec_module(FG)


LESSONS = """LESSON[101]={
 title:'순서를 타는 곱셈 — 행렬 곱의 비가환',
 problem:{
  q:'<b>3 × 5 와 5 × 3</b> 은 같습니다. 그런데 «회전한 뒤 늘이기»와 «늘인 뒤 회전하기»도 같을까요? 수에서는 당연하던 것이 여기서도 통할까요?',
  svg:`<svg viewBox="0 0 400 170" role="img" aria-label="같은 두 변환을 차례만 바꿔 적용했을 때 결과가 달라지는 그림">
    __NC101__
  </svg>`,
  sit:'왼쪽·오른쪽에 변환 단추를 <b>차례로</b> 눌러 쌓으면 두 줄의 합성 결과가 나란히 그려지고, <b>합성 행렬</b> 과 <b>같은가</b> 가 표시됩니다. 같은 변환을 순서만 바꿔 넣어 볼 수 있습니다.'
 },
 predict:{
  q:['«회전 90° → 가로 2배»와 «가로 2배 → 회전 90°»가 같을지 예상하고 까닭도 적으세요.',
     '수의 곱셈에서는 왜 순서를 바꿔도 될까요?',
     '순서를 바꿔도 같은 변환 짝이 있을지 예상해 보세요.'] },
 missions:[
  {t:'왼쪽과 오른쪽에 <b>같은 두 변환을 순서만 바꿔</b> 넣어 보세요.', re:'다르다'},
  {t:'순서를 바꿔도 <b>같아지는</b> 짝을 찾아보세요.', re:'같다'},
  {t:'아래 <b>탐구 노트</b>로 마무리하세요 — 두 결과를 <b>기록</b>하고, 성분을 <b>견주고</b>, 까닭을 <b>판단</b>합니다.',
   re:'탐구 노트 통과',
   do:'① 회전 → 가로 2배 로 넣고 결과 적기 ② 순서를 바꿔 다시 적기 ③ 모두 2배 를 섞어 같아지는 짝 찾기',
   hand:'«방향을 가리는 변환»끼리가 순서를 타는 까닭을 그림으로 설명하기'}],
 inquiry:{
  id:'nc101', title:'순서를 타는 곱셈',
  q:['여러 순서 짝을 만들어 가며 5줄 이상 기록하세요. 같아지는 짝도 넣으세요.',
     '「같은가」 열을 보세요. 언제 같고 언제 다른가요?',
     '어떤 변환끼리 순서를 타는지 손으로 정리하세요.'],
  cols:['순서','합성 행렬','같은가'],
  hint:'힌트 — 균등 확대(모두 2배)는 방향을 안 가립니다. 방향을 가리는 변환끼리가 순서를 탑니다.' },
 apply:{
  q:'새 문제 — A = [1 2 ; 0 1], B = [1 0 ; 3 1] 일 때 <b>AB 의 (1, 1) 성분</b>은?',
  a:7, tol:0.1,
  why:'A 의 1행 (1, 2) 와 B 의 1열 (1, 3) 을 곱해 더하면 1×1 + 2×3 = 7. 참고로 BA 의 (1,1) 은 1 입니다 — 순서를 바꾸면 달라집니다.',
  hint:'1행과 1열을 짝지어 곱해 더하세요.' },
 demo(root){ return ncDemo(root); }
};

LESSON[102]={
 title:'책상 밖으로 무한히 — 카드 쌓기와 조화급수',
 problem:{
  q:'카드를 책상 끝에 쌓아 밖으로 내밉니다. 한 장으로는 <b>반 장</b> 까지가 한계입니다. 그러면 카드를 아주 많이 쓰면 <b>얼마까지</b> 내밀 수 있을까요? 한 장? 두 장? 아니면 끝이 없을까요?',
  svg:`<svg viewBox="0 0 400 170" role="img" aria-label="카드를 겹쳐 쌓아 책상 밖으로 내민 모습과 이론 한계">
    __OV102__
  </svg>`,
  sit:'카드 수를 정하고 각 장을 <b>직접 밀어</b> 봅니다. 무게중심이 받침을 넘으면 <b>무너짐</b> 으로 표시되고, <b>이론 한계 ½Hₙ</b> 과 지금 돌출의 <b>차이</b> 가 함께 나옵니다.'
 },
 predict:{
  q:['카드 두 장으로 최대 얼마나 내밀 수 있을지 예상해 적으세요.',
     '카드를 무한히 쓰면 돌출도 무한히 커질지 예상하고 까닭도 적으세요.',
     '맨 위 카드부터 미는 것이 좋을지, 맨 아래부터가 좋을지 적어 보세요.'] },
 missions:[
  {t:'카드를 밀어 <b>무너지기 직전</b> 까지 내밀어 보세요.', re:'돌출'},
  {t:'카드 수를 늘려 <b>이론 한계</b> 가 어떻게 커지는지 보세요.', re:'한계'},
  {t:'아래 <b>탐구 노트</b>로 마무리하세요 — 돌출을 <b>기록</b>하고, 한계와 <b>견주고</b>, 끝이 있는지 <b>판단</b>합니다.',
   re:'탐구 노트 통과',
   do:'① 지금 카드 수와 최대 돌출 적기 ② 이론 한계와의 차 보기 ③ 카드 수를 늘려 한계가 얼마나 느는지 견주기',
   hand:'위 k장의 무게중심이 받침 끝에 딱 걸치는 한 걸음이 1/(2k) 인 까닭을 쓰고, 그 합이 끝없이 커짐을 설명하기'}],
 inquiry:{
  id:'ov102', title:'책상 밖으로 무한히',
  q:['카드 수를 바꿔 가며 5줄 이상 기록하세요. 무너진 경우도 넣으세요.',
     '「이론 한계 ½Hₙ」 열을 보세요. 카드를 두 배로 늘리면 한계도 두 배가 되나요?',
     '합 1 + ½ + ⅓ + … 이 끝없이 커지는 까닭을 손으로 설명하세요.'],
  cols:['카드 수','최대 돌출','이론 한계 ½Hₙ','차이'],
  hint:'힌트 — 위 k장의 무게중심은 받침 끝에 「딱 걸치는」 순간까지만 밀 수 있습니다. 그 한 걸음이 1/(2k) 입니다.' },
 apply:{
  q:'새 문제 — 카드 <b>4장</b> 일 때 이론 한계 <b>½(1 + ½ + ⅓ + ¼)</b> 은? (카드 길이 단위, 소수 셋째 자리)',
  a:1.042, tol:0.004,
  why:'1 + 0.5 + 0.3333 + 0.25 = 2.0833 이고 그 절반은 1.0417 ≒ 1.042 — 넉 장만으로 이미 한 장 길이를 넘습니다.',
  hint:'괄호 안을 먼저 더한 뒤 2로 나누세요.' },
 demo(root){ return ovDemo(root); }
};

LESSON[103]={
 title:'색은 좌표다 — RGB 색 좌표',
 problem:{
  q:'화면의 모든 색은 <b>숫자 세 개</b> 로 적혀 있습니다. 그런데 두 색을 «반반 섞은» 색은 어떻게 구할까요? 도형 시간에 배운 <b>내분점</b> 이 여기서 다시 나옵니다.',
  svg:`<svg viewBox="0 0 400 170" role="img" aria-label="빨강 초록 파랑 세 빛이 겹쳐 색을 만드는 그림">
    __CL103__
  </svg>`,
  sit:'R·G·B 세 값을 바꾸면 색과 <b>16진 코드</b> 가 함께 나옵니다. 도전 과제에서는 <b>목표 색</b> 을 맞추거나 두 색을 <b>내분</b> 해 가운데 색을 만들어 봅니다.'
 },
 predict:{
  q:['빨강(255, 0, 0)과 파랑(0, 0, 255)을 반반 섞으면 어떤 수가 될지 예상하세요.',
     '세 값이 모두 같으면 어떤 색이 될까요?',
     '색을 «좌표»라고 부르는 까닭을 한 줄로 적어 보세요.'] },
 missions:[
  {t:'R·G·B 를 바꿔 <b>16진 코드</b> 가 어떻게 따라오는지 보세요.', re:'16진'},
  {t:'세 값을 <b>모두 같게</b> 해 보세요. 어떤 색이 되나요?', re:'R, G, B'},
  {t:'아래 <b>탐구 노트</b>로 마무리하세요 — 두 색을 <b>기록</b>하고, 가운데를 <b>계산</b>하고, 맞는지 <b>판단</b>합니다.',
   re:'탐구 노트 통과',
   do:'① 어떤 색의 (R, G, B) 적기 ② 다른 색으로 바꿔 다시 적기 ③ 두 색의 한가운데 값을 계산해 맞춰 보기',
   hand:'색 섞기가 좌표의 «내분»과 같은 일임을 두 점 사이의 내분점 공식으로 설명하기'}],
 inquiry:{
  id:'cl103', title:'색은 좌표다',
  q:['여러 색을 만들며 5줄 이상 기록하세요.',
     '「(R, G, B)」와 「16진 코드」를 견주세요. 어떻게 이어지나요?',
     '두 색의 한가운데 색을 내분점 공식으로 손으로 구하세요.'],
  cols:['색 이름','(R, G, B)','16진 코드'],
  hint:'힌트 — 색 합성은 좌표의 내분입니다. 도형 단원의 내분점 공식이 미술 시간의 팔레트에서 다시 태어납니다.' },
 apply:{
  q:'새 문제 — 빨강 <b>(255, 0, 0)</b> 과 파랑 <b>(0, 0, 255)</b> 을 <b>1 : 1</b> 로 섞은 색의 <b>R</b> 값은?',
  a:127.5, tol:1,
  why:'(255 + 0) ÷ 2 = 127.5 — 두 점의 중점과 똑같은 계산입니다. 화면에서는 보통 128 로 반올림해 씁니다.',
  hint:'두 R 값의 한가운데입니다.' },
 demo(root){ return clDemo(root); }
};

LESSON[104]={
 title:'접으면 3등분 — 종이접기 등분',
 problem:{
  q:'선분을 <b>3등분</b> 하려면 자로 재야 할까요? 종이를 몇 번 접는 것만으로 정확히 3등분할 수 있습니다. 접은 선이 <b>왜</b> 하필 그 자리를 짚을까요?',
  svg:`<svg viewBox="0 0 400 170" role="img" aria-label="정사각형에 그은 두 선이 만나는 점이 가로로 3분의 2 지점임을 보여 주는 그림">
    __OG104__
  </svg>`,
  sit:'모드를 고르고 접기 단계를 하나씩 진행하면 <b>만들어진 점</b> 과 그 점이 나누는 <b>내분비</b> 가 표시됩니다. 그 비가 <b>닮음</b> 에서 오는지 <b>합동</b> 에서 오는지도 함께 나옵니다.'
 },
 predict:{
  q:['정사각형의 대각선과 한 변의 중점을 잇는 선이 만나는 점이 어디쯤일지 예상하세요.',
     '그 점이 가로를 몇 대 몇으로 나눌지 예상해 적으세요.',
     '접기가 «무엇의 이동»인지 한 줄로 적어 보세요.'] },
 missions:[
  {t:'모드를 고르고 <b>끝까지</b> 접어 보세요. 어떤 점이 만들어지나요?', re:'내분비'},
  {t:'다른 모드로 바꿔 <b>내분비</b> 가 어떻게 달라지는지 보세요.', re:'등분'},
  {t:'아래 <b>탐구 노트</b>로 마무리하세요 — 비를 <b>기록</b>하고, 다른 모드와 <b>견주고</b>, 근거를 <b>판단</b>합니다.',
   re:'탐구 노트 통과',
   do:'① 3등분 모드로 끝까지 접고 내분비 적기 ② 다른 모드로 바꿔 다시 적기 ③ 근거(닮음/합동)가 무엇인지 보기',
   hand:'접기가 «대칭 이동»이고 접힌 선이 수직이등분선이거나 각의 이등분선임을 설명하기'}],
 inquiry:{
  id:'og104', title:'접으면 3등분',
  q:['세 모드를 모두 끝까지 접어 보며 기록하세요.',
     '「내분비」와 「근거」 열을 견주세요. 닮음과 합동은 각각 언제 쓰이나요?',
     '접기가 왜 정확한 등분을 만드는지 손으로 설명하세요.'],
  cols:['모드','접기 단계','만들어진 점','내분비','근거(닮음/합동)'],
  hint:'힌트 — 접기는 「대칭 이동」입니다. 접힌 선은 두 점을 겹치게 하는 수직이등분선이거나 각의 이등분선입니다.' },
 apply:{
  q:'새 문제 — 선분을 <b>3등분</b> 하는 두 점 중 <b>왼쪽 점</b> 은 전체 길이의 몇 분의 몇일까요? (소수 셋째 자리)',
  a:0.333, tol:0.005,
  why:'1 ÷ 3 ≒ 0.333 입니다. 접기로 얻은 점이 가로를 2 : 1 로 나누면 그 점은 ⅔ 자리이고, 반대쪽에서 보면 ⅓ 자리입니다.',
  hint:'세 토막 중 첫 토막이 전체의 얼마인가요?' },
 demo(root){ return origamiDemo(root); }
};

LESSON[105]={
 title:'주사위 100개 — 실험으로 만드는 지수 감소',
 problem:{
  q:'주사위 100개를 굴려 <b>1이 나온 것만</b> 버립니다. 이것을 해마다 되풀이하면 100개가 <b>10개 아래</b> 로 줄어드는 데 몇 해가 걸릴까요? 매번 같은 수만큼 줄어들까요?',
  svg:`<svg viewBox="0 0 400 170" role="img" aria-label="100개가 해마다 6분의 5로 줄어 10개에 이르는 곡선">
    __DC105__
  </svg>`,
  sit:'「한 해 굴리기」를 누를 때마다 실제로 주사위를 굴려 <b>남은 수</b> 가 줄어듭니다. 옆에 <b>이론값 100(5/6)ˣ</b> 이 함께 그려져, 실험과 이론이 얼마나 맞는지 바로 보입니다.'
 },
 predict:{
  q:['한 해에 몇 개쯤 사라질지 예상해 적으세요.',
     '해마다 사라지는 «개수»가 일정할지, «비율»이 일정할지 적어 보세요.',
     '100개가 10개가 되는 데 몇 해가 걸릴지 예상하세요.'] },
 missions:[
  {t:'한 해씩 굴려 <b>남은 수</b> 가 어떻게 줄어드는지 보세요.', re:'남은'},
  {t:'<b>10개 이하</b> 가 될 때까지 굴려 보세요.', re:'10세대'},
  {t:'아래 <b>탐구 노트</b>로 마무리하세요 — 값을 <b>기록</b>하고, 비를 <b>계산</b>하고, 규칙을 <b>판단</b>합니다.',
   re:'탐구 노트 통과',
   do:'① 어떤 해의 남은 수와 이론값 적기 ② 다음 해 남은 수를 앞 해로 나눠 보기 ③ 10개 이하가 되는 해 찾기',
   hand:'100(5/6)ˣ ≤ 10 을 로그로 풀어 ①②에서 본 해와 맞는지 확인하기'}],
 inquiry:{
  id:'dc105', title:'주사위 100개의 지수 감소',
  q:['해마다 굴리며 5줄 이상 기록하세요.',
     '「실험 남은 수」를 앞 해로 나눠 보세요. 그 비가 무엇에 가까운가요?',
     '100(5/6)ˣ ≤ 10 을 로그로 손으로 푸세요.'],
  cols:['해','실험 남은 수','이론값','오차','비고'],
  hint:'힌트 — 100(5/6)^x ≤ 10 → x ≥ log10 ÷ (log6 − log5). log6 = log2 + log3, log5 = 1 − log2 로 바꿔 계산합니다.' },
 apply:{
  q:'새 문제 — 100개가 <b>10개 이하</b> 가 되는 것은 <b>몇 해째</b> 일까요? (log 2 ≒ 0.3010, log 3 ≒ 0.4771)',
  a:13, tol:0.5,
  why:'100(5/6)ˣ ≤ 10 → x ≥ 1 ÷ (log 6 − log 5) = 1 ÷ (0.7781 − 0.6990) ≒ 12.63 이므로 <b>13해째</b> 입니다.',
  hint:'양변에 로그를 취하고 x 에 대해 푸세요. 답은 자연수로 올림합니다.' },
 demo(root){ return decayDemo(root); }
};

LESSON[106]={
 title:'90°가 넘으면? — 단위원으로 넓힌 삼각비',
 problem:{
  q:'삼각비는 <b>직각삼각형</b> 에서 배웁니다. 그런데 직각삼각형에 <b>120°</b> 인 각은 없습니다. 그러면 sin 120° 는 아예 없는 값일까요?',
  svg:`<svg viewBox="0 0 400 170" role="img" aria-label="단위원 위 210도 자리의 점과 그 좌표가 sin cos 임을 보여 주는 그림">
    __UC106__
  </svg>`,
  sit:'각을 <b>−90° 에서 750° 까지</b> 돌리면 단위원 위의 점이 함께 움직이고, 그 점의 <b>y 좌표(sin)</b> · <b>x 좌표(cos)</b> 와 <b>사분면</b> · <b>부호</b> 가 표시됩니다. 한 바퀴를 넘겨 볼 수도 있습니다.'
 },
 predict:{
  q:['sin 120° 의 값이 양수일지 음수일지 예상하고 까닭도 적으세요.',
     '제3사분면에서 sin 과 cos 의 부호가 어떨지 적어 보세요.',
     '각이 한 바퀴(360°)를 넘으면 값이 어떻게 될까요?'] },
 missions:[
  {t:'각을 90° 넘게 돌려 <b>sin</b> 과 <b>cos</b> 의 부호를 보세요.', re:'사분면'},
  {t:'각을 <b>360° 넘게</b> 돌려 보세요. 값이 되풀이되나요?', re:'sin'},
  {t:'아래 <b>탐구 노트</b>로 마무리하세요 — 값을 <b>기록</b>하고, 360° 더해 <b>견주고</b>, 규칙을 <b>판단</b>합니다.',
   re:'탐구 노트 통과',
   do:'① 어떤 각의 사분면·sin·cos 적기 ② 360° 더한 각으로 옮겨 다시 적기 ③ 두 값을 견주기',
   hand:'단위원 위 점의 좌표가 그대로 cos·sin 임을 그림으로 설명하고, 사분면별 부호표를 만들기'}],
 inquiry:{
  id:'uc106', title:'90°가 넘으면 — 단위원',
  q:['각을 바꿔 가며 5줄 이상 기록하세요. 네 사분면을 모두 넣으세요.',
     '「부호(sin, cos)」 열을 사분면별로 정리하세요.',
     '한 바퀴를 더해도 값이 같은 까닭을 손으로 설명하세요.'],
  cols:['θ','사분면','sin θ','cos θ','부호(sin, cos)'],
  hint:'힌트 — 단위원 위의 점 P 의 y 좌표가 sin, x 좌표가 cos 입니다. 부호는 좌표의 부호 그대로입니다.' },
 apply:{
  q:'새 문제 — <b>sin 210°</b> 의 값은?',
  a:-0.5, tol:0.02,
  why:'210° 는 제3사분면이고 기준각이 30° 이므로 sin 210° = −sin 30° = −0.5. 단위원에서 y 좌표가 음수인 자리입니다.',
  hint:'제3사분면에서 sin 의 부호는 무엇인가요? 기준각은 몇 도인가요?' },
 demo(root){ return unitCircleDemo(root); }
};

LESSON[107]={
 title:'해는 왜 물결처럼 뜰까 — 일출 시각 모형',
 problem:{
  q:'1월부터 12월까지의 일출 시각을 점으로 찍으면 <b>직선이 아닙니다.</b> 오르내리며 되풀이됩니다. 이 모양을 식 하나로 적을 수 있을까요?',
  svg:`<svg viewBox="0 0 400 170" role="img" aria-label="열두 달 일출 시각 점과 그 위에 맞춘 사인 곡선">
    __SR107__
  </svg>`,
  sit:'<b>진폭 A</b> · <b>중심 D</b> · <b>위상 C</b> 세 값을 움직이면 곡선이 따라 움직이고, 실제 자료와 얼마나 어긋나는지가 <b>RMSE</b> 로 계산됩니다. 0.15 아래로 줄이면 <b>명중</b> 입니다.'
 },
 predict:{
  q:['1년 평균 일출 시각이 몇 시쯤일지 자료를 보고 예상하세요.',
     '여름과 겨울의 차이가 몇 시간쯤일지 적어 보세요.',
     '그 차이와 진폭 A 가 어떤 관계일지 예상하세요.'] },
 missions:[
  {t:'<b>중심 D</b> 를 움직여 곡선을 자료의 가운데로 옮겨 보세요.', re:'D'},
  {t:'<b>A 와 C</b> 를 맞춰 <b>명중</b> 을 만들어 보세요.', re:'명중'},
  {t:'아래 <b>탐구 노트</b>로 마무리하세요 — 세 값을 <b>기록</b>하고, 줄여 <b>견주고</b>, 뜻을 <b>판단</b>합니다.',
   re:'탐구 노트 통과',
   do:'① 지금 A·D·C 와 RMSE 적기 ② 값을 고쳐 RMSE 를 더 줄이기 ③ 명중이 될 때의 세 값 보기',
   hand:'A·D·C 가 각각 그래프의 무엇을 바꾸는지 한 줄씩 쓰고, 자료의 최대·최소로 A 와 D 를 어림하는 법을 쓰기'}],
 inquiry:{
  id:'sr107', title:'해는 왜 물결처럼 뜰까',
  q:['세 값을 바꿔 가며 5줄 이상 기록하세요. RMSE 가 줄어드는 과정을 남기세요.',
     '「A」와 자료의 최대−최소, 「D」와 자료의 평균을 견주세요.',
     '세 값이 각각 무엇을 바꾸는지 손으로 정리하세요.'],
  cols:['A','D','C','RMSE(시간)','판정'],
  hint:'힌트 — D 는 1년 평균 일출, A 는 여름·겨울의 차이 절반, C 는 곡선을 좌우로 미는 값입니다.' },
 apply:{
  q:'새 문제 — 1년 중 가장 이른 일출이 <b>5.27시</b>, 가장 늦은 일출이 <b>7.70시</b> 입니다. <b>진폭 A</b> 는?',
  a:1.215, tol:0.02,
  why:'A = (최대 − 최소) ÷ 2 = (7.70 − 5.27) ÷ 2 = 1.215 시간. 중심 D 는 두 값의 한가운데인 6.485 시쯤입니다.',
  hint:'진폭은 위아래로 흔들리는 폭의 «절반» 입니다.' },
 demo(root){ return sunriseDemo(root); }
};

LESSON[108]={
 title:'강 건너까지 몇 m — 사인법칙 측량',
 problem:{
  q:'강 건너 나무까지의 거리를 재야 합니다. <b>강을 건널 수는 없습니다.</b> 이쪽 기슭에서 잴 수 있는 것은 두 지점 사이의 거리와 각뿐입니다. 그것만으로 충분할까요?',
  svg:`<svg viewBox="0 0 400 170" role="img" aria-label="이쪽 기슭의 기선과 두 각으로 건너편 점까지의 거리를 구하는 삼각형">
    __LW108__
  </svg>`,
  sit:'<b>기선 AB</b> 의 길이와 양 끝 각 <b>∠A · ∠B</b> 를 정하면 삼각형이 하나로 정해지고, 건너편까지의 거리 <b>AC · BC</b> 가 계산됩니다. 각을 바꿔 가며 어떤 조합이 재기 좋은지 볼 수 있습니다.'
 },
 predict:{
  q:['한 변과 양 끝 각을 알면 삼각형이 하나로 정해질지 예상하고 까닭도 적으세요.',
     '∠C 를 어떻게 구할 수 있을지 적어 보세요.',
     '기선을 길게 잡는 것과 짧게 잡는 것 중 어느 쪽이 정확할지 예상하세요.'] },
 missions:[
  {t:'기선과 두 각을 정해 <b>AC · BC</b> 가 나오는지 보세요.', re:'BC'},
  {t:'각을 바꿔 가며 <b>∠C</b> 가 어떻게 따라오는지 보세요.', re:'∠C'},
  {t:'아래 <b>탐구 노트</b>로 마무리하세요 — 값을 <b>기록</b>하고, 사인법칙으로 <b>계산</b>하고, 맞는지 <b>판단</b>합니다.',
   re:'탐구 노트 통과',
   do:'① 지금 ∠A·∠B·기선 적기 ② ∠C 를 180에서 빼서 구하기 ③ 사인법칙으로 BC 를 계산해 화면과 견주기',
   hand:'한 변과 양 끝 각이면 삼각형이 하나뿐인 까닭(ASA)과, 사인법칙으로 나머지 변이 바로 나오는 과정을 쓰기'}],
 inquiry:{
  id:'lw108', title:'강 건너까지 몇 m',
  q:['각과 기선을 바꿔 가며 5줄 이상 기록하세요.',
     '「∠A + ∠B + ∠C」를 더해 보세요. 늘 얼마인가요?',
     '사인법칙으로 BC 를 손으로 계산해 화면과 견주세요.'],
  cols:['∠A','∠B','∠C','기선 c','AC','BC'],
  hint:'힌트 — 한 변과 양 끝 각이 정해지면 삼각형은 하나뿐(ASA)입니다. 나머지 두 변은 사인법칙으로 즉시 나옵니다.' },
 apply:{
  q:'새 문제 — ∠A = <b>50°</b>, ∠B = <b>60°</b>, 기선 AB = <b>100 m</b> 일 때 <b>BC</b> 의 길이는? (m, 소수 첫째 자리)',
  a:81.5, tol:0.4,
  why:'∠C = 180 − 50 − 60 = 70°. 사인법칙에서 BC / sin A = AB / sin C 이므로 BC = 100 × sin 50° ÷ sin 70° ≒ 81.5 m.',
  hint:'먼저 ∠C 를 구한 뒤 BC / sin A = AB / sin C 를 쓰세요.' },
 demo(root){ return lawsDemo(root); }
};

LESSON[109]={
 title:'월 상환액은 어떻게 정해질까 — 대출과 등비수열',
 problem:{
  q:'800만원을 빌려 36개월 동안 <b>똑같은 금액</b> 으로 갚습니다. 그 금액은 어떻게 정할까요? 단순히 <b>800 ÷ 36</b> 이 아닌 까닭은 무엇일까요?',
  svg:`<svg viewBox="0 0 400 170" role="img" aria-label="갚는 돈 전체가 원금과 이자로 나뉜 막대">
    __LN109__
  </svg>`,
  sit:'<b>원금 · 연이자율 · 기간</b> 을 바꾸면 <b>월 상환액</b> 과 <b>총 이자</b> 가 계산됩니다. 기간을 늘리면 월 부담은 줄지만 총 이자가 어떻게 되는지 직접 확인할 수 있습니다.'
 },
 predict:{
  q:['월 상환액이 800 ÷ 36 보다 클지 작을지 예상하고 까닭도 적으세요.',
     '기간을 두 배로 늘리면 총 이자가 어떻게 될지 예상하세요.',
     '첫 달에 갚는 돈과 마지막 달에 갚는 돈 중 어느 쪽에 이자가 더 오래 붙을까요?'] },
 missions:[
  {t:'원금·이자율·기간을 바꿔 <b>월 상환액</b> 이 어떻게 변하는지 보세요.', re:'상환'},
  {t:'기간을 늘려 <b>총 이자</b> 가 어떻게 되는지 보세요.', re:'이자'},
  {t:'아래 <b>탐구 노트</b>로 마무리하세요 — 값을 <b>기록</b>하고, 기간을 늘려 <b>견주고</b>, 뜻을 <b>판단</b>합니다.',
   re:'탐구 노트 통과',
   do:'① 지금 원금·기간·월 상환액·총 이자 적기 ② 기간을 늘려 다시 적기 ③ 월 부담과 총 이자의 변화를 견주기',
   hand:'갚는 돈마다 이자가 붙는 기간이 달라 등비수열의 합이 되는 과정을 식으로 쓰기'}],
 inquiry:{
  id:'lo109', title:'월 상환액은 어떻게 정해질까',
  q:['원금·이자율·기간을 바꿔 가며 5줄 이상 기록하세요.',
     '기간만 늘렸을 때 「월 상환액」과 「총 이자」가 각각 어떻게 변하는지 견주세요.',
     '월 상환액이 등비수열의 합에서 나오는 과정을 손으로 쓰세요.'],
  cols:['원금','연이자율','기간','월 상환액','총 이자'],
  hint:'힌트 — n개월 뒤 가치로 환산하면 P(1+i)ⁿ = m{(1+i)ⁿ⁻¹ + … + 1} 이고, 오른쪽이 등비수열의 합입니다.' },
 apply:{
  q:'새 문제 — 원금 <b>1,200만원</b>, 연이자율 <b>6 %</b>, <b>24개월</b> 일 때 월 상환액은? (만원, 소수 첫째 자리)',
  a:53.2, tol:0.4,
  why:'월이율 i = 0.06 ÷ 12 = 0.005, (1.005)²⁴ ≒ 1.1272 이므로 m = 1200 × 0.005 × 1.1272 ÷ 0.1272 ≒ 53.2만원입니다. 단순히 1200 ÷ 24 = 50만원보다 큽니다.',
  hint:'m = P·i(1+i)ⁿ ÷ {(1+i)ⁿ − 1} 을 쓰세요.' },
 demo(root){ return loanDemo(root); }
};

LESSON[110]={
 title:'1부터 100까지를 한 번에 — 시그마와 계단',
 problem:{
  q:'<b>1 + 2 + 3 + … + 100</b> 을 구하라고 하면 보통 하나씩 더합니다. 그런데 가우스는 어린 나이에 <b>몇 초 만에</b> 답을 냈다고 합니다. 무엇을 본 걸까요?',
  svg:`<svg viewBox="0 0 400 170" role="img" aria-label="계단 두 개를 거꾸로 붙여 직사각형을 만드는 그림">
    __SG110__
  </svg>`,
  sit:'n 을 바꾸면 계단이 그려지고 <b>실제 합</b> 과 <b>n(n+1)/2</b> 이 나란히 계산됩니다. 「뒤집어 붙이기」를 켜면 같은 계단이 거꾸로 붙어 <b>직사각형</b> 이 되는 것을 볼 수 있습니다.'
 },
 predict:{
  q:['1 + 2 + … + n 을 빨리 구하는 방법을 예상해 적으세요.',
     '같은 계단을 거꾸로 붙이면 어떤 모양이 될지 예상하세요.',
     '그 모양의 가로와 세로가 각각 무엇일지 적어 보세요.'] },
 missions:[
  {t:'n 을 바꿔 <b>실제 합</b> 과 <b>n(n+1)/2</b> 을 견주어 보세요.', re:'일치'},
  {t:'<b>뒤집어 붙여</b> 직사각형을 만들어 보세요.', re:'직사각형'},
  {t:'아래 <b>탐구 노트</b>로 마무리하세요 — 값을 <b>기록</b>하고, 넓이를 <b>계산</b>하고, 까닭을 <b>판단</b>합니다.',
   re:'탐구 노트 통과',
   do:'① 지금 n 과 실제 합 적기 ② 직사각형 넓이를 구해 합의 두 배인지 보기 ③ n 을 바꿔 다시 확인',
   hand:'1+2+…+n 과 n+…+2+1 을 위아래로 더하면 (n+1) 이 n 개 생기는 과정을 쓰기'}],
 inquiry:{
  id:'sg110', title:'1부터 100까지를 한 번에',
  q:['n 을 바꿔 가며 5줄 이상 기록하세요.',
     '「직사각형 넓이」와 「실제 합」을 견주세요. 몇 배인가요?',
     '위아래로 더해 (n+1) 이 n 개 생기는 과정을 손으로 쓰세요.'],
  cols:['n','실제 합','n(n+1)/2','직사각형 넓이','일치?'],
  hint:'힌트 — 1+2+…+n 과 n+…+2+1 을 위아래로 더하면 (n+1) 이 n 개 생깁니다.' },
 apply:{
  q:'새 문제 — <b>1 + 2 + 3 + … + 100</b> 의 값은?',
  a:5050, tol:0.5,
  why:'100 × 101 ÷ 2 = 5050. 계단 두 개를 붙이면 가로 100 · 세로 101 인 직사각형이 되고, 그 절반이 답입니다.',
  hint:'n(n+1)/2 에 n = 100 을 넣으세요.' },
 demo(root){ return sigmaDemo(root); }
};

"""


def note(no, head, c1, c2, c3):
    return "\n %d:{ h:'%s',\n  c:[\n%s,\n%s,\n%s\n ]},\n" % (no, head, c1, c2, c3)


NOTES = (
 note(101, '내가 쌓고 · 내가 견주고 · 내가 판단한다',
 """  {t:'기록 — 같은 두 변환을 <b>순서만 바꿔</b> 양쪽에 넣으세요',
   f:'결과가 같으면 1, 다르면 0 → {0}',
   chk(got, r, mem){
     if(!r) return {ok:false, msg:'아직 아무것도 넣지 않았습니다.'};
     const s=String(r[0]);
     if(s.indexOf('—')>=0) return {ok:false, msg:'양쪽 모두에 변환을 넣으세요.'};
     const L=s.split(' vs ')[0].split('→').filter(Boolean);
     const R=s.split(' vs ')[1].split('→').filter(Boolean);
     if(L.length<2||R.length<2) return {ok:false, msg:'양쪽에 <b>두 개씩</b> 넣으세요.'};
     if(L.slice().sort().join()!==R.slice().sort().join())
       return {ok:false, msg:'양쪽에 <b>같은</b> 변환을 넣되 <b>순서만</b> 바꾸세요. 지금은 «'+s+'» 입니다.'};
     if(L.join()===R.join()) return {ok:false, msg:'순서가 같습니다 — 한쪽의 차례를 바꾸세요.'};
     if(!isFinite(got[0])) return {ok:false, msg:'칸을 채우세요.'};
     const same=String(r[2]).indexOf('같다')>=0?1:0;
     if(Math.abs(got[0]-same)>0.01) return {ok:false, msg:'화면에 «'+r[2]+'» 라고 나와 있습니다.'};
     mem.pair=L.slice().sort().join(); mem.same1=same;
     return {ok:true, msg:same?'기록했습니다 — 이 짝은 순서를 타지 않는군요.':'기록했습니다 — 순서만 바꿨는데 결과가 달라졌습니다.'};
   }}""",
 """  {t:'생각 — 두 합성 행렬의 <b>첫 성분</b> 을 각각 적으세요',
   f:'왼쪽 행렬의 첫 수 = {0} · 오른쪽 행렬의 첫 수 = {1}',
   chk(got, r, mem){
     if(mem.pair===undefined) return {ok:false, msg:'① 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const parts=String(r[1]).split('/');
     const a=(parts[0].match(/-?\\d+(?:\\.\\d+)?/g)||[]).map(Number);
     const b=(parts[1]||'').match(/-?\\d+(?:\\.\\d+)?/g)||[];
     if(a.length<4||b.length<4) return {ok:false, msg:'합성 행렬이 읽히지 않습니다 — 양쪽에 변환을 넣으세요.'};
     if(![0,1].every(j=>isFinite(got[j]))) return {ok:false, msg:'두 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-a[0])>0.08||Math.abs(got[1]-(+b[0]))>0.08)
       return {ok:false, msg:'화면의 두 행렬은 «'+r[1]+'» 입니다.'};
     mem.ok2=true;
     return {ok:true, msg:'계산했습니다 — 성분 하나만 봐도 두 행렬이 같은지 알 수 있습니다.'};
   }}""",
 """  {t:'판단 — <b>«모두 2배»를 섞어</b> 순서를 바꿔도 같아지는 짝을 만든 뒤 고르세요',
   f:'그때 같으면 1, 다르면 0 → {0}',
   opts:['<b>방향을 가리는 변환끼리</b>가 순서를 탄다 — 균등 확대처럼 모든 방향을 똑같이 바꾸는 것은 순서를 안 탄다',
         '행렬 곱은 언제나 순서를 바꿔도 된다',
         '행렬 곱은 언제나 순서를 바꾸면 안 된다'],
   chk(got, r, mem, pick){
     if(!mem.ok2) return {ok:false, msg:'② 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const s=String(r[0]);
     if(s.indexOf('U')<0) return {ok:false, msg:'「모두 2배」를 섞어 보세요. 지금은 «'+s+'» 입니다.'};
     const same=String(r[2]).indexOf('같다')>=0?1:0;
     if(!same) return {ok:false, msg:'아직 «'+r[2]+'» 입니다. 「모두 2배」와 다른 변환 하나로 짝을 만들어 순서를 바꿔 보세요.'};
     if(!isFinite(got[0])) return {ok:false, msg:'칸을 채우세요.'};
     if(Math.abs(got[0]-1)>0.01) return {ok:false, msg:'화면에 «'+r[2]+'» 라고 나와 있습니다.'};
     if(pick!==0)
       return {ok:false, msg:'①에서는 달랐는데 「모두 2배」를 섞으니 같아졌습니다. 그 변환은 다른 것들과 무엇이 다른가요? 다시 고르세요.'};
     return {ok:true, msg:'판단했습니다 — <b>행렬 곱은 «순서를 바꿔도 된다»가 보장되지 않습니다.</b> 변환을 이어서 하는 일이기 때문입니다. 양말과 신발처럼, 무엇을 먼저 하느냐가 결과를 바꿉니다.'};
   }}""")
 +
 note(102, '내가 밀고 · 내가 견주고 · 내가 판단한다',
 """  {t:'기록 — 카드를 <b>무너지기 직전</b> 까지 밀고 적으세요',
   f:'카드 수 = {0} · 최대 돌출 = {1} · 이론 한계 = {2}',
   chk(got, r, mem){
     if(!r) return {ok:false, msg:'아직 화면 값이 없습니다.'};
     if(String(r[1]).indexOf('무너')>=0)
       return {ok:false, msg:'지금 무너졌습니다 — 조금 되밀어 서 있는 상태에서 적으세요.'};
     const n=noteNum(r[0]), ov=noteNum(r[1]), lim=noteNum(r[2]);
     if(!(ov>0.3)) return {ok:false, msg:'아직 '+r[1]+' 장밖에 안 나갔습니다. 더 밀어 보세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-n)>0.5) return {ok:false, msg:'카드 수는 '+r[0]+' 입니다.'};
     if(Math.abs(got[1]-ov)>0.03) return {ok:false, msg:'최대 돌출은 '+r[1]+' 입니다.'};
     if(Math.abs(got[2]-lim)>0.004) return {ok:false, msg:'이론 한계는 '+r[2]+' 입니다.'};
     mem.n=n; mem.lim=lim;
     return {ok:true, msg:'기록했습니다 — 카드를 늘리면 한계가 얼마나 커질까요?'};
   }}""",
 """  {t:'생각 — 카드 수를 <b>늘려</b> 이론 한계가 얼마나 커지는지 보세요',
   f:'새 카드 수 = {0} · 그때 이론 한계 = {1} · 늘어난 만큼 = {2}',
   chk(got, r, mem){
     if(mem.n===undefined) return {ok:false, msg:'① 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const n=noteNum(r[0]), lim=noteNum(r[2]);
     if(!(n > mem.n)) return {ok:false, msg:'카드 수가 '+r[0]+' 입니다. ①의 '+mem.n+'장보다 늘리세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-n)>0.5||Math.abs(got[1]-lim)>0.004)
       return {ok:false, msg:'지금은 '+r[0]+' · '+r[2]+' 입니다.'};
     if(Math.abs(got[2]-(lim-mem.lim))>0.006) return {ok:false, msg:'지금 한계에서 ①의 한계를 빼세요.'};
     mem.gain=lim-mem.lim; mem.n2=n; mem.lim2=lim;
     return {ok:true, msg:'계산했습니다 — '+(n-mem.n)+'장을 더 썼는데 한계는 '+mem.gain.toFixed(3)+'만 늘었습니다.'};
   }}""",
 """  {t:'판단 — 늘어난 폭을 보고 고르세요',
   f:'카드를 '+'{0}'+'장에서 {1}장으로 늘렸을 때 한계가 늘어난 만큼 = {2}',
   opts:['더할수록 <b>한 걸음은 작아지지만</b> 1/(2k) 의 합은 끝이 없다 — 카드만 충분하면 얼마든지 내밀 수 있다',
         '한계가 거의 안 늘어나므로 어느 길이에서 멈춘다',
         '카드를 두 배로 늘리면 한계도 두 배가 된다'],
   chk(got, r, mem, pick){
     if(mem.gain===undefined) return {ok:false, msg:'② 칸을 먼저 통과하세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-mem.n)>0.5||Math.abs(got[1]-mem.n2)>0.5)
       return {ok:false, msg:'①과 ②의 카드 수 '+mem.n+' 과 '+mem.n2+' 을 넣으세요.'};
     if(Math.abs(got[2]-mem.gain)>0.006) return {ok:false, msg:'②에서 구한 '+mem.gain.toFixed(3)+' 을 넣으세요.'};
     if(pick!==0)
       return {ok:false, msg:'한 걸음은 1/(2k) 로 자꾸 작아집니다. 그런데 그 합도 어딘가에서 멈출까요? 1 + ½ + ⅓ + … 를 떠올리고 다시 고르세요.'};
     return {ok:true, msg:'판단했습니다 — <b>한 걸음은 1/(2k) 로 작아지지만 그 합(조화급수)은 끝없이 커집니다.</b> 느리게 커질 뿐 멈추지 않으므로, 카드가 충분하면 돌출에는 한계가 없습니다 — 다만 2장 길이를 내밀려면 카드가 수십 장 필요합니다.'};
   }}""")
 +
 note(103, '내가 섞고 · 내가 계산하고 · 내가 판단한다',
 """  {t:'기록 — 색 하나를 만들고 세 값을 적으세요',
   f:'R = {0} · G = {1} · B = {2}',
   chk(got, r, mem){
     if(!r) return {ok:false, msg:'아직 화면 값이 없습니다.'};
     const v=(String(r[1]).match(/\\d+/g)||[]).map(Number);
     if(v.length<3) return {ok:false, msg:'색 값이 읽히지 않습니다.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if([0,1,2].some(j=>Math.abs(got[j]-v[j])>1))
       return {ok:false, msg:'화면의 색은 '+r[1]+' 입니다.'};
     mem.c1=v;
     return {ok:true, msg:'기록했습니다 — 이제 다른 색으로 바꿔 봅시다.'};
   }}""",
 """  {t:'생각 — <b>다른 색</b> 으로 바꾼 뒤, 두 색의 <b>한가운데</b> 를 계산하세요',
   f:'새 R = {0} · 두 R 의 한가운데 = {1} · 두 G 의 한가운데 = {2}',
   chk(got, r, mem){
     if(mem.c1===undefined) return {ok:false, msg:'① 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const v=(String(r[1]).match(/\\d+/g)||[]).map(Number);
     if(Math.abs(v[0]-mem.c1[0])<20&&Math.abs(v[1]-mem.c1[1])<20&&Math.abs(v[2]-mem.c1[2])<20)
       return {ok:false, msg:'색이 거의 그대로입니다 — 더 다른 색으로 바꾸세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-v[0])>1) return {ok:false, msg:'지금 R 은 '+v[0]+' 입니다.'};
     if(Math.abs(got[1]-(mem.c1[0]+v[0])/2)>1.5) return {ok:false, msg:'①의 R 과 지금 R 을 더해 2로 나누세요.'};
     if(Math.abs(got[2]-(mem.c1[1]+v[1])/2)>1.5) return {ok:false, msg:'①의 G 와 지금 G 로 같은 계산을 하세요.'};
     mem.c2=v; mem.mid=[(mem.c1[0]+v[0])/2,(mem.c1[1]+v[1])/2,(mem.c1[2]+v[2])/2];
     return {ok:true, msg:'계산했습니다 — 이 값으로 색을 맞추면 두 색의 한가운데가 나옵니다.'};
   }}""",
 """  {t:'판단 — 계산한 <b>한가운데 색</b> 을 실제로 맞춘 뒤 고르세요',
   f:'맞춘 R = {0} · G = {1} · B = {2}',
   opts:['색 섞기는 <b>좌표의 내분</b> 이다 — 두 색의 한가운데는 세 값을 각각 반씩 나눈 중점이다',
         '색은 섞으면 늘 어두워진다',
         '색의 세 값은 서로 묶여 있어 따로 계산할 수 없다'],
   chk(got, r, mem, pick){
     if(mem.mid===undefined) return {ok:false, msg:'② 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const v=(String(r[1]).match(/\\d+/g)||[]).map(Number);
     if([0,1,2].some(j=>Math.abs(v[j]-mem.mid[j])>6))
       return {ok:false, msg:'②에서 구한 ('+mem.mid.map(x=>Math.round(x)).join(', ')+') 에 맞추세요. 지금은 '+r[1]+' 입니다. (눈금이 5라 몇 차이는 괜찮습니다)'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if([0,1,2].some(j=>Math.abs(got[j]-v[j])>1)) return {ok:false, msg:'화면의 색은 '+r[1]+' 입니다.'};
     if(pick!==0)
       return {ok:false, msg:'세 값을 각각 반씩 나눈 것만으로 한가운데 색이 나왔습니다. 두 점의 중점 공식과 같지 않나요? 다시 고르세요.'};
     return {ok:true, msg:'판단했습니다 — <b>색은 (R, G, B) 라는 좌표</b> 이고, 섞기는 그 좌표의 내분입니다. 1 : 2 로 섞고 싶으면 내분점 공식 그대로 (2a + b)/3 을 쓰면 됩니다.'};
   }}""")
 +
 note(104, '내가 접고 · 내가 재고 · 내가 판단한다',
 """  {t:'기록 — 모드를 고르고 <b>끝까지</b> 접은 뒤 적으세요',
   f:'접기 단계 = {0} 단계까지 · 근거가 닮음이면 1, 합동이면 0 → {1}',
   chk(got, r, mem){
     if(!r) return {ok:false, msg:'아직 화면 값이 없습니다.'};
     const st=(String(r[1]).match(/\\d+/g)||[]).map(Number);
     if(st.length<2||st[0]<st[1])
       return {ok:false, msg:'아직 '+r[1]+' 입니다. 끝까지 접으세요.'};
     if(![0,1].every(j=>isFinite(got[j]))) return {ok:false, msg:'두 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-st[0])>0.5) return {ok:false, msg:'지금 '+r[1]+' 입니다.'};
     const sim=String(r[4]).indexOf('닮음')>=0?1:0;
     if(Math.abs(got[1]-sim)>0.01) return {ok:false, msg:'화면의 근거는 «'+r[4]+'» 입니다.'};
     mem.mode=String(r[0]); mem.ratio=String(r[3]);
     return {ok:true, msg:'기록했습니다 — 내분비가 «'+mem.ratio+'» 입니다. 다른 모드는 어떨까요?'};
   }}""",
 """  {t:'생각 — <b>다른 모드</b> 로 바꿔 끝까지 접은 뒤 내분비를 견주세요',
   f:'접기 단계 = {0} 단계까지 · 근거가 닮음이면 1, 합동이면 0 → {1}',
   chk(got, r, mem){
     if(mem.mode===undefined) return {ok:false, msg:'① 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     if(String(r[0])===mem.mode) return {ok:false, msg:'같은 모드입니다 — 다른 모드를 고르세요.'};
     const st=(String(r[1]).match(/\\d+/g)||[]).map(Number);
     if(st.length<2||st[0]<st[1]) return {ok:false, msg:'아직 '+r[1]+' 입니다. 끝까지 접으세요.'};
     if(![0,1].every(j=>isFinite(got[j]))) return {ok:false, msg:'두 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-st[0])>0.5) return {ok:false, msg:'지금 '+r[1]+' 입니다.'};
     const sim=String(r[4]).indexOf('닮음')>=0?1:0;
     if(Math.abs(got[1]-sim)>0.01) return {ok:false, msg:'화면의 근거는 «'+r[4]+'» 입니다.'};
     mem.ratio2=String(r[3]); mem.mode2=String(r[0]);
     return {ok:true, msg:'계산했습니다 — «'+mem.mode+'» 는 '+mem.ratio+', «'+mem.mode2+'» 는 '+mem.ratio2+' 입니다.'};
   }}""",
 """  {t:'판단 — 두 모드의 근거를 견주어 고르세요',
   f:'선분을 나눌 때 근거가 닮음이면 1 → {0} · 각을 나눌 때 근거가 합동이면 1 → {1}',
   opts:['접기는 <b>대칭 이동</b> 이다 — 접힌 선이 수직이등분선이거나 각의 이등분선이라서 정확한 비가 나온다',
         '접기는 눈대중이라 대략 맞을 뿐이다',
         '접기로는 2등분만 할 수 있다'],
   chk(got, r, mem, pick){
     if(mem.ratio2===undefined) return {ok:false, msg:'② 칸을 먼저 통과하세요.'};
     if(![0,1].every(j=>isFinite(got[j]))) return {ok:false, msg:'두 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-1)>0.01||Math.abs(got[1]-1)>0.01)
       return {ok:false, msg:'①②에서 본 「근거」 열을 다시 보세요 — 선분 등분과 각 등분의 근거가 달랐습니다.'};
     if(pick!==0)
       return {ok:false, msg:'접은 자리가 «우연히» 3등분이 되었을까요? 접힌 선이 무엇인지 생각하고 다시 고르세요.'};
     return {ok:true, msg:'판단했습니다 — <b>접기는 대칭 이동</b> 이라, 접힌 선은 두 점을 겹치게 하는 수직이등분선이거나 각의 이등분선입니다. 그래서 닮음(선분)과 합동(각)으로 비가 <b>증명</b>되고, 눈대중이 아닙니다.'};
   }}""")
 +
 note(105, '내가 굴리고 · 내가 나누고 · 내가 판단한다',
 """  {t:'기록 — 몇 해 굴린 뒤 값을 적으세요',
   f:'해 = {0} · 실험 남은 수 = {1} · 이론값 = {2}',
   chk(got, r, mem){
     if(!r) return {ok:false, msg:'아직 화면 값이 없습니다.'};
     const y=noteNum(r[0]), n=noteNum(r[1]), th=noteNum(r[2]);
     if(!(y>=2)) return {ok:false, msg:'아직 '+y+'해입니다. 두 해 이상 굴려 보세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-y)>0.5||Math.abs(got[1]-n)>0.5)
       return {ok:false, msg:'화면은 '+r[0]+'해 · '+r[1]+'개 입니다.'};
     if(Math.abs(got[2]-th)>0.15) return {ok:false, msg:'이론값은 '+r[2]+' 입니다.'};
     mem.y=y; mem.n=n;
     return {ok:true, msg:'기록했습니다 — 한 해 더 굴려 비를 구해 봅시다.'};
   }}""",
 """  {t:'생각 — <b>한 해 더</b> 굴린 뒤, 앞 해로 나눠 보세요',
   f:'새 해 = {0} · 남은 수 = {1} · 앞 해로 나눈 값 = {2}',
   chk(got, r, mem){
     if(mem.y===undefined) return {ok:false, msg:'① 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const y=noteNum(r[0]), n=noteNum(r[1]);
     if(!(y > mem.y)) return {ok:false, msg:'아직 '+y+'해입니다. 더 굴리세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-y)>0.5||Math.abs(got[1]-n)>0.5)
       return {ok:false, msg:'지금은 '+r[0]+'해 · '+r[1]+'개 입니다.'};
     if(Math.abs(got[2]-n/mem.n)>0.06) return {ok:false, msg:'지금 남은 수를 ①의 '+mem.n+' 으로 나누세요.'};
     mem.ok2=true;
     return {ok:true, msg:'계산했습니다 — 약 '+(n/mem.n).toFixed(2)+' 입니다. 5/6 ≒ 0.83 에 가깝나요?'};
   }}""",
 """  {t:'판단 — <b>10개 이하</b> 가 될 때까지 굴린 뒤 고르세요',
   f:'그때 해 = {0} · 남은 수 = {1}',
   opts:['해마다 <b>같은 비율</b>(5/6)로 줄어든다 — 개수가 아니라 비율이 일정한 것이 지수 감소다',
         '해마다 같은 개수씩 줄어든다',
         '줄어드는 속도가 점점 빨라진다'],
   chk(got, r, mem, pick){
     if(!mem.ok2) return {ok:false, msg:'② 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const y=noteNum(r[0]), n=noteNum(r[1]);
     if(!(n<=10)) return {ok:false, msg:'아직 '+r[1]+'개 남았습니다. 10개 이하가 될 때까지 굴리세요.'};
     if(![0,1].every(j=>isFinite(got[j]))) return {ok:false, msg:'두 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-y)>0.5||Math.abs(got[1]-n)>0.5)
       return {ok:false, msg:'지금은 '+r[0]+'해 · '+r[1]+'개 입니다.'};
     if(pick!==0)
       return {ok:false, msg:'②에서 구한 비가 해마다 비슷했습니다. 처음에는 한 해에 16개쯤 사라지는데 끝에는 두어 개뿐입니다. 무엇이 일정한가요? 다시 고르세요.'};
     return {ok:true, msg:'판단했습니다 — <b>일정한 것은 «개수»가 아니라 «비율»</b> 입니다. 그래서 100(5/6)ˣ 꼴이 되고, 반으로 줄어드는 데 걸리는 시간이 늘 같습니다 — 약물 반감기와 방사성 붕괴가 같은 꼴입니다.'};
   }}""")
 +
 note(106, '내가 돌리고 · 내가 읽고 · 내가 판단한다',
 """  {t:'기록 — 각을 <b>90° 보다 크게</b> 돌린 뒤 적으세요',
   f:'θ = {0} ° · sin θ = {1} · cos θ = {2}',
   chk(got, r, mem){
     if(!r) return {ok:false, msg:'아직 화면 값이 없습니다.'};
     const a=noteNum(r[0]), s=noteNum(r[2]), c=noteNum(r[3]);
     if(!(a>90&&a<360)) return {ok:false, msg:'지금 '+a+'° 입니다. 90° 와 360° 사이로 돌리세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-a)>0.6) return {ok:false, msg:'각은 '+r[0]+' 입니다.'};
     if(Math.abs(got[1]-s)>0.004||Math.abs(got[2]-c)>0.004)
       return {ok:false, msg:'화면은 sin '+r[2]+' · cos '+r[3]+' 입니다.'};
     mem.a=a; mem.s=s; mem.c=c; mem.q=String(r[1]);
     return {ok:true, msg:'기록했습니다 — «'+mem.q+'» 이고 부호는 «'+r[4]+'» 입니다.'};
   }}""",
 """  {t:'생각 — <b>360° 를 더한</b> 각으로 옮겨 값을 견주세요',
   f:'새 θ = {0} ° · sin θ = {1} · ①의 sin 과의 차 = {2}',
   chk(got, r, mem){
     if(mem.a===undefined) return {ok:false, msg:'① 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const a=noteNum(r[0]), s=noteNum(r[2]);
     if(Math.abs(a-(mem.a+360))>0.6)
       return {ok:false, msg:'①의 '+mem.a+'° 에 360 을 더한 '+(mem.a+360)+'° 로 맞추세요. 지금은 '+r[0]+' 입니다.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-a)>0.6||Math.abs(got[1]-s)>0.004)
       return {ok:false, msg:'지금은 '+r[0]+' · sin '+r[2]+' 입니다.'};
     if(Math.abs(got[2])>0.006) return {ok:false, msg:'①의 sin 과 빼 보세요. 무엇이 나오나요?'};
     mem.ok2=true;
     return {ok:true, msg:'계산했습니다 — 차가 0 — 한 바퀴를 돌아 같은 자리로 왔습니다.'};
   }}""",
 """  {t:'판단 — <b>제3사분면</b> 으로 옮겨 부호를 보고 고르세요',
   f:'그때 sin 이 음수면 1 → {0} · cos 이 음수면 1 → {1}',
   opts:['단위원 위 점의 <b>y 가 sin, x 가 cos</b> — 사분면의 부호가 그대로 삼각비의 부호가 된다',
         '90° 가 넘으면 sin 과 cos 은 정의되지 않는다',
         '각이 커지면 sin 도 늘 커진다'],
   chk(got, r, mem, pick){
     if(!mem.ok2) return {ok:false, msg:'② 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     if(String(r[1]).indexOf('제3')<0)
       return {ok:false, msg:'지금 «'+r[1]+'» 입니다. 제3사분면(180°~270°)으로 옮기세요.'};
     const s=noteNum(r[2]), c=noteNum(r[3]);
     if(![0,1].every(j=>isFinite(got[j]))) return {ok:false, msg:'두 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-(s<0?1:0))>0.01||Math.abs(got[1]-(c<0?1:0))>0.01)
       return {ok:false, msg:'화면의 부호는 «'+r[4]+'» 입니다.'};
     if(pick!==0)
       return {ok:false, msg:'제3사분면에서는 점의 x 도 y 도 음수입니다. 그 좌표가 무엇이었나요? 다시 고르세요.'};
     return {ok:true, msg:'판단했습니다 — <b>직각삼각형으로는 예각밖에 못 다루지만, 단위원으로 옮기면 어떤 각이든 다룰 수 있습니다.</b> 점의 좌표를 그대로 읽으면 되고, 360° 를 더해도 같은 점이라 값이 되풀이됩니다.'};
   }}""")
 +
 note(107, '내가 맞추고 · 내가 줄이고 · 내가 판단한다',
 """  {t:'기록 — 지금 세 값과 어긋남을 적으세요',
   f:'A = {0} · D = {1} · RMSE = {2}',
   chk(got, r, mem){
     if(!r) return {ok:false, msg:'아직 화면 값이 없습니다.'};
     const A=noteNum(r[0]), D=noteNum(r[1]), e=noteNum(r[3]);
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-A)>0.03||Math.abs(got[1]-D)>0.03)
       return {ok:false, msg:'화면은 A = '+r[0]+' · D = '+r[1]+' 입니다.'};
     if(Math.abs(got[2]-e)>0.004) return {ok:false, msg:'RMSE 는 '+r[3]+' 입니다.'};
     mem.e=e;
     return {ok:true, msg:'기록했습니다 — 이 어긋남을 줄여 봅시다.'};
   }}""",
 """  {t:'생각 — 세 값을 고쳐 <b>RMSE 를 더 줄이고</b> 적으세요',
   f:'새 RMSE = {0} · ①보다 줄어든 만큼 = {1}',
   chk(got, r, mem){
     if(mem.e===undefined) return {ok:false, msg:'① 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const e=noteNum(r[3]);
     if(!(e < mem.e - 0.004)) return {ok:false, msg:'아직 RMSE 가 '+r[3]+' 입니다. ①의 '+mem.e.toFixed(3)+' 보다 줄이세요.'};
     if(![0,1].every(j=>isFinite(got[j]))) return {ok:false, msg:'두 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-e)>0.004) return {ok:false, msg:'지금 RMSE 는 '+r[3]+' 입니다.'};
     if(Math.abs(got[1]-(mem.e-e))>0.006) return {ok:false, msg:'①의 RMSE 에서 지금 값을 빼세요.'};
     mem.ok2=true;
     return {ok:true, msg:'계산했습니다 — 더 줄여 «명중» 까지 가 봅시다.'};
   }}""",
 """  {t:'판단 — <b>명중</b> 이 될 때까지 맞춘 뒤 고르세요',
   f:'명중일 때 A = {0} · D = {1} · RMSE = {2}',
   opts:['<b>A 는 흔들리는 폭의 절반, D 는 가운데 높이, C 는 좌우로 미는 값</b> — 셋이 각각 다른 일을 한다',
         '세 값은 모두 곡선을 위아래로만 움직인다',
         'A 를 키우면 곡선이 오른쪽으로 간다'],
   chk(got, r, mem, pick){
     if(!mem.ok2) return {ok:false, msg:'② 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     if(String(r[4]).indexOf('명중')<0)
       return {ok:false, msg:'아직 «'+r[4]+'» 입니다. RMSE 를 0.15 아래로 줄이세요.'};
     const A=noteNum(r[0]), D=noteNum(r[1]), e=noteNum(r[3]);
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-A)>0.03||Math.abs(got[1]-D)>0.03||Math.abs(got[2]-e)>0.004)
       return {ok:false, msg:'지금은 '+r[0]+' · '+r[1]+' · '+r[3]+' 입니다.'};
     if(pick!==0)
       return {ok:false, msg:'맞춘 A 가 '+r[0]+' 입니다. 자료의 최대 7.70 과 최소 5.27 의 차이 절반과 견주어 보고 다시 고르세요.'};
     return {ok:true, msg:'판단했습니다 — <b>A = (최대 − 최소) ÷ 2, D = 두 값의 한가운데</b> 로 어림잡고 C 만 맞추면 금방 명중합니다. 되풀이되는 자연 현상은 이렇게 사인 곡선 하나로 적을 수 있습니다.'};
   }}""")
 +
 note(108, '내가 재고 · 내가 계산하고 · 내가 판단한다',
 """  {t:'기록 — 기선과 두 각을 정한 뒤 적으세요',
   f:'∠A = {0} ° · ∠B = {1} ° · 기선 = {2} m',
   chk(got, r, mem){
     if(!r) return {ok:false, msg:'아직 화면 값이 없습니다 — 두 각의 합이 180° 를 넘지 않게 하세요.'};
     const A=noteNum(r[0]), B=noteNum(r[1]), c=noteNum(r[3]);
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-A)>0.6||Math.abs(got[1]-B)>0.6||Math.abs(got[2]-c)>0.6)
       return {ok:false, msg:'화면은 '+r[0]+' · '+r[1]+' · '+r[3]+' 입니다.'};
     mem.A=A; mem.B=B; mem.c=c;
     return {ok:true, msg:'기록했습니다 — 이제 ∠C 와 BC 를 직접 구해 봅시다.'};
   }}""",
 """  {t:'생각 — <b>∠C</b> 를 구하고 <b>사인법칙</b> 으로 BC 를 계산하세요',
   f:'∠C = {0} ° · BC = 기선 × sin A ÷ sin C = {1} · 화면의 BC 와의 차 = {2}',
   chk(got, r, mem){
     if(mem.A===undefined) return {ok:false, msg:'① 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const C=noteNum(r[2]), bc=noteNum(r[5]);
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-(180-mem.A-mem.B))>0.8) return {ok:false, msg:'180 에서 ①의 두 각을 빼세요.'};
     const want=mem.c*Math.sin(mem.A*Math.PI/180)/Math.sin((180-mem.A-mem.B)*Math.PI/180);
     if(Math.abs(got[1]-want)>0.6) return {ok:false, msg:'기선 × sin A ÷ sin C 를 계산하세요 — 화면에는 '+r[5]+' 로 나와 있습니다.'};
     if(Math.abs(got[2])>0.8) return {ok:false, msg:'내가 구한 값에서 화면의 BC 를 빼세요.'};
     mem.ok2=true;
     return {ok:true, msg:'계산했습니다 — 손으로 구한 값과 화면이 같습니다.'};
   }}""",
 """  {t:'판단 — <b>기선은 그대로</b> 두고 <b>두 각만</b> 바꿔 본 뒤 고르세요',
   f:'새 ∠A = {0} ° · 새 ∠B = {1} ° · 그때 BC = {2}',
   opts:['한 변과 <b>양 끝 각</b> 이면 삼각형이 하나뿐(ASA)이라, 건너가지 않고도 나머지 변이 정해진다',
         '건너편 거리를 알려면 반드시 건너가 봐야 한다',
         '기선만 알면 각은 몰라도 된다'],
   chk(got, r, mem, pick){
     if(!mem.ok2) return {ok:false, msg:'② 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const A=noteNum(r[0]), B=noteNum(r[1]), c=noteNum(r[3]), bc=noteNum(r[5]);
     if(Math.abs(c-mem.c)>0.6) return {ok:false, msg:'기선이 '+r[3]+' 로 달라졌습니다 — '+mem.c+' 로 되돌리고 각만 바꾸세요.'};
     if(Math.abs(A-mem.A)<2&&Math.abs(B-mem.B)<2) return {ok:false, msg:'각이 거의 그대로입니다 — 바꿔 보세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-A)>0.6||Math.abs(got[1]-B)>0.6||Math.abs(got[2]-bc)>0.6)
       return {ok:false, msg:'지금은 '+r[0]+' · '+r[1]+' · '+r[5]+' 입니다.'};
     if(pick!==0)
       return {ok:false, msg:'기선은 그대로인데 각만 바꿨더니 BC 가 '+r[5]+' 로 달라졌습니다. 삼각형이 하나로 정해진다는 뜻이 아닐까요? 다시 고르세요.'};
     return {ok:true, msg:'판단했습니다 — <b>한 변과 양 끝 각(ASA)이면 삼각형은 하나뿐</b> 입니다. 그래서 이쪽 기슭에서 기선 하나와 각 둘만 재면 건너편까지의 거리가 계산으로 나옵니다 — 삼각측량이 바로 이것입니다.'};
   }}""")
 +
 note(109, '내가 빌리고 · 내가 견주고 · 내가 판단한다',
 """  {t:'기록 — 지금 조건과 상환액을 적으세요',
   f:'기간 = {0} 개월 · 월 상환액 = {1} · 총 이자 = {2}',
   chk(got, r, mem){
     if(!r) return {ok:false, msg:'아직 화면 값이 없습니다.'};
     const n=noteNum(r[2]), m=noteNum(r[3]), it=noteNum(r[4]);
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-n)>0.5) return {ok:false, msg:'기간은 '+r[2]+' 입니다.'};
     if(Math.abs(got[1]-m)>0.15||Math.abs(got[2]-it)>0.5)
       return {ok:false, msg:'화면은 월 '+r[3]+' · 총 이자 '+r[4]+' 입니다.'};
     mem.P=noteNum(r[0]); mem.n=n; mem.m=m; mem.it=it;
     return {ok:true, msg:'기록했습니다 — 원금을 기간으로 그냥 나눈 값과 견주어 봅시다.'};
   }}""",
 """  {t:'생각 — <b>원금 ÷ 기간</b> 과 견주세요',
   f:'원금 ÷ 기간 = {0} · 월 상환액이 그보다 큰 만큼 = {1}',
   chk(got, r, mem){
     if(mem.P===undefined) return {ok:false, msg:'① 칸을 먼저 통과하세요.'};
     if(![0,1].every(j=>isFinite(got[j]))) return {ok:false, msg:'두 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-mem.P/mem.n)>0.2) return {ok:false, msg:'①의 원금을 기간으로 나누세요.'};
     if(Math.abs(got[1]-(mem.m-mem.P/mem.n))>0.25) return {ok:false, msg:'①의 월 상환액에서 방금 값을 빼세요.'};
     mem.ok2=true;
     return {ok:true, msg:'계산했습니다 — 그 차이가 바로 <b>이자</b> 몫입니다. 기간을 늘리면 어떻게 될까요?'};
   }}""",
 """  {t:'판단 — <b>기간만 늘려</b> 보고 고르세요',
   f:'새 기간 = {0} 개월 · 새 월 상환액 = {1} · 새 총 이자 = {2}',
   opts:['기간을 늘리면 <b>월 부담은 줄지만 총 이자는 늘어난다</b> — 돈을 더 오래 빌리는 것이기 때문',
         '기간을 늘리면 총 이자도 줄어든다',
         '기간은 월 상환액만 바꾸고 총 이자와는 무관하다'],
   chk(got, r, mem, pick){
     if(!mem.ok2) return {ok:false, msg:'② 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const P=noteNum(r[0]), n=noteNum(r[2]), m=noteNum(r[3]), it=noteNum(r[4]);
     if(Math.abs(P-mem.P)>0.6) return {ok:false, msg:'원금이 달라졌습니다 — '+mem.P+'만원으로 되돌리고 기간만 늘리세요.'};
     if(!(n > mem.n)) return {ok:false, msg:'기간이 '+r[2]+' 입니다. ①의 '+mem.n+'개월보다 늘리세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-n)>0.5||Math.abs(got[1]-m)>0.15||Math.abs(got[2]-it)>0.5)
       return {ok:false, msg:'지금은 '+r[2]+' · '+r[3]+' · '+r[4]+' 입니다.'};
     if(pick!==0)
       return {ok:false, msg:'월 상환액은 '+mem.m.toFixed(1)+' → '+m.toFixed(1)+', 총 이자는 '+mem.it.toFixed(1)+' → '+it.toFixed(1)+' 로 움직였습니다. 두 방향이 같은가요? 다시 고르세요.'};
     return {ok:true, msg:'판단했습니다 — <b>갚는 돈마다 이자가 붙는 기간이 달라서</b> 월 상환액은 등비수열의 합에서 나옵니다. 기간을 늘리면 한 달 부담은 가벼워지지만 돈을 더 오래 빌리는 셈이라 총 이자는 늘어납니다.'};
   }}""")
 +
 note(110, '내가 쌓고 · 내가 붙이고 · 내가 판단한다',
 """  {t:'기록 — n 을 정한 뒤 합을 적으세요',
   f:'n = {0} · 실제 합 = {1} · n(n+1)/2 = {2}',
   chk(got, r, mem){
     if(!r) return {ok:false, msg:'아직 화면 값이 없습니다.'};
     const n=noteNum(r[0]), s=noteNum(r[1]), f=noteNum(r[2]);
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-n)>0.5) return {ok:false, msg:'n 은 '+r[0]+' 입니다.'};
     if(Math.abs(got[1]-s)>0.5||Math.abs(got[2]-f)>0.5)
       return {ok:false, msg:'화면은 '+r[1]+' 과 '+r[2]+' 입니다.'};
     mem.n=n; mem.s=s;
     return {ok:true, msg:'기록했습니다 — 이제 같은 계단을 거꾸로 붙여 봅시다.'};
   }}""",
 """  {t:'생각 — <b>직사각형 넓이</b> 를 합과 견주세요',
   f:'직사각형 넓이 = {0} · 실제 합으로 나눈 값 = {1}',
   chk(got, r, mem){
     if(mem.n===undefined) return {ok:false, msg:'① 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const a=noteNum(r[3]);
     if(![0,1].every(j=>isFinite(got[j]))) return {ok:false, msg:'두 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-a)>0.5) return {ok:false, msg:'직사각형 넓이는 '+r[3]+' 입니다.'};
     if(Math.abs(got[1]-2)>0.05) return {ok:false, msg:'그 넓이를 ①의 실제 합 '+mem.s+' 으로 나누세요.'};
     mem.ok2=true;
     return {ok:true, msg:'계산했습니다 — 직사각형은 합의 <b>두 배</b> 입니다.'};
   }}""",
 """  {t:'판단 — <b>n 을 바꿔</b> 다시 확인한 뒤 고르세요',
   f:'새 n = {0} · 직사각형 넓이 = {1} · 그 절반 = {2}',
   opts:['같은 계단을 거꾸로 붙이면 <b>가로 n · 세로 (n+1)</b> 인 직사각형이 된다 — 그 절반이 합이다',
         '계단의 넓이는 n² 이다',
         'n 이 커지면 두 배 관계가 깨진다'],
   chk(got, r, mem, pick){
     if(!mem.ok2) return {ok:false, msg:'② 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const n=noteNum(r[0]), s=noteNum(r[1]), a=noteNum(r[3]);
     if(Math.abs(n-mem.n)<0.5) return {ok:false, msg:'n 이 그대로입니다 — 바꿔 보세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-n)>0.5||Math.abs(got[1]-a)>0.5)
       return {ok:false, msg:'지금은 n = '+r[0]+' · 넓이 '+r[3]+' 입니다.'};
     if(Math.abs(got[2]-a/2)>0.5) return {ok:false, msg:'그 넓이를 반으로 나누세요.'};
     if(Math.abs(a/2-s)>0.5) return {ok:false, msg:'절반이 실제 합 '+r[1]+' 과 같은지 보세요.'};
     if(pick!==0)
       return {ok:false, msg:'n = '+mem.n+' 에서도 n = '+n+' 에서도 직사각형의 절반이 합이었습니다. 그 직사각형의 가로와 세로가 무엇이었나요? 다시 고르세요.'};
     return {ok:true, msg:'판단했습니다 — <b>1+2+…+n 과 n+…+2+1 을 위아래로 더하면 (n+1) 이 n 개</b> 생깁니다. 그래서 2S = n(n+1), 곧 S = n(n+1)/2 — 가우스가 본 것이 이 직사각형입니다.'};
   }}""")
)


def main(path):
    h = open(path, encoding='utf-8').read()
    if 'LESSON[101]=' in h:
        sys.stdout.write('이미 반영됨\n')
        return
    L = (LESSONS.replace('__NC101__', FG.nc101()).replace('__OV102__', FG.ov102())
         .replace('__CL103__', FG.cl103()).replace('__OG104__', FG.og104())
         .replace('__DC105__', FG.dc105()).replace('__UC106__', FG.uc106())
         .replace('__SR107__', FG.sr107()).replace('__LW108__', FG.lw108())
         .replace('__LN109__', FG.ln109()).replace('__SG110__', FG.sg110()))
    a = 'LESSON[356]={'
    assert h.count(a) == 1
    h = h.replace(a, L + a, 1)
    b = '\n};\n\nfunction labNo(spec)'
    assert h.count(b) == 1
    h = h.replace(b, NOTES + b, 1)
    open(path, 'w', encoding='utf-8').write(h)
    sys.stdout.write('LAB 101~110 ok %.2f MB\n' % (len(h.encode('utf-8')) / 1048576))


if __name__ == '__main__':
    main(sys.argv[1])
