# -*- coding: utf-8 -*-
"""LAB 51~60 — 7단계 수업 모형 + 탐구 노트.

실험 화면은 이미 있는 열 개 데모를 그대로 쓴다 (patch_demo_read.py 로 read() 를 내주게 해 두었다).
「생각 열기」 사진은 실험실당 **한 장**을 기본으로 붙인다 — 단일 파일 크기를 지키기 위해서다.

사용: python docs/LAB51_60_수업모형/patch_lab51_60.py src/40-demos.js
"""
import sys, math

# ══════════════ 문제 그림 — 좌표를 계산한다 ══════════════
def curve(f, x0, x1, X, Y, n=60):
    return ' '.join('%s%.1f %.1f' % ('M' if i == 0 else 'L', X(x0 + (x1 - x0) * i / n),
                                     Y(f(x0 + (x1 - x0) * i / n)))
                    for i in range(n + 1))


# LAB 51 — y = x² 와 y = (x−2)² + 1
X51 = lambda x: 200 + 36 * x
Y51 = lambda y: 142 - 22 * y
P51A = curve(lambda x: x * x, -2.6, 2.6, X51, Y51)
P51B = curve(lambda x: (x - 2) ** 2 + 1, -0.6, 4.6, X51, Y51)

# LAB 52 — S = w(10−w), 최댓값 w=5 에서 25
X52 = lambda w: 44 + 33 * w
Y52 = lambda s: 146 - 4.4 * s
P52 = curve(lambda w: w * (10 - w), 0, 10, X52, Y52)

# LAB 54 — 30·45·60 도 특수각 삼각형
def tri54(ox, pts, col):
    return '<polygon points="%s" fill="%s" opacity=".14" stroke="%s" stroke-width="1.8"/>' % (
        ' '.join('%.1f,%.1f' % (ox + p[0], 132 - p[1]) for p in pts), col, col)


T54 = (tri54(20, [(0, 0), (76, 0), (76, 76)], '#2563EB')            # 45-45-90
       + tri54(150, [(0, 0), (70, 0), (0, 40.4)], '#0E9384')        # 30-60-90 (1 : √3)
       + tri54(250, [(0, 0), (40.4, 0), (0, 70)], '#B45309'))

# LAB 59 — 상자그림
BOX59 = ('<path d="M60 92 H120" stroke="#111827" stroke-width="1.6"/>'
         '<rect x="120" y="70" width="120" height="44" rx="3" fill="#2563EB" opacity=".22" stroke="#2563EB" stroke-width="1.8"/>'
         '<path d="M180 70 V114" stroke="#BE123C" stroke-width="2.2"/>'
         '<path d="M240 92 H300" stroke="#111827" stroke-width="1.6"/>'
         '<path d="M60 80 V104 M300 80 V104" stroke="#111827" stroke-width="1.6"/>'
         '<circle cx="348" cy="92" r="5" fill="#BE123C"/>')


LESSONS = """LESSON[51]={
 title:'이차함수의 평행이동 — 꼭짓점 택배',
 problem:{
  q:'y = x² 의 그래프를 <b>오른쪽으로 2, 위로 1</b> 옮기면 식이 어떻게 될까요? 많은 학생이 y = (x + 2)² + 1 이라고 씁니다. 오른쪽으로 옮겼는데 왜 식에는 <b>빼기</b>가 나올까요?',
  svg:`<svg viewBox="0 0 400 170" role="img" aria-label="y=x제곱 그래프와 오른쪽 위로 옮긴 그래프를 견주는 그림">
    <path d="M24 142 H384 M200 20 V158" stroke="#9CA3AF" stroke-width="1.3"/>
    <path d="__P51A__" stroke="#9CA3AF" stroke-width="2" fill="none" stroke-dasharray="5 3"/>
    <path d="__P51B__" stroke="#2563EB" stroke-width="2.6" fill="none"/>
    <circle cx="200" cy="142" r="4.2" fill="#6B7280"/>
    <circle cx="272" cy="120" r="5" fill="#BE123C"/>
    <text x="278" y="114" font-size="10.5" font-weight="800" fill="#BE123C">꼭짓점 (2, 1)</text>
    <text x="200" y="166" font-size="10.5" fill="#6B7280" text-anchor="middle">오른쪽으로 옮겼는데 식에는 왜 «빼기»가 나올까?</text>
  </svg>`,
  sit:'목표 식이 주어지면 <b>꼭짓점을 직접 끌어</b> 그래프를 그 자리로 옮깁니다. p 와 q 가 함께 표시되고 «괄호 안»이 <b>x − p</b> 인지 <b>x + p</b> 인지 바로 보입니다.'
 },
 predict:{
  q:['y = x² 를 오른쪽으로 2 옮기면 식이 어떻게 될지 적으세요.',
     '«오른쪽»인데 식에 빼기가 나오는 까닭을 예상해 적으세요.',
     '위로 1 옮기면 식의 어디가 달라질까요?'] },
 missions:[
  {t:'꼭짓점을 끌어 <b>오른쪽</b>으로 옮겨 보세요. 괄호 안이 어떻게 되나요?', re:'오른쪽'},
  {t:'이번에는 <b>왼쪽</b>으로 옮겨 보세요. 부호가 바뀌나요?', re:'왼쪽'},
  {t:'아래 <b>탐구 노트</b>로 마무리하세요 — p·q 를 <b>기록</b>하고, 이동 방향과 <b>견주고</b>, 부호 규칙을 <b>판단</b>합니다.',
   re:'탐구 노트 통과',
   do:'① 오른쪽으로 옮긴 뒤 p·q 적기 ② 괄호 안의 부호 확인하기 ③ 왼쪽으로 옮겨 부호가 바뀌는지 보기',
   hand:'«오른쪽으로 p 만큼»인데 식에 x − p 가 나오는 까닭을 «같은 y 값을 내려면 x 가 p 만큼 더 커야 한다»로 설명하기'}],
 inquiry:{
  id:'ps51', title:'꼭짓점 택배 — 평행이동과 식',
  q:['꼭짓점을 여러 자리로 옮겨 가며 8줄 이상 기록하세요.',
     '「p」 열과 「괄호 안」 열을 견주세요. 부호가 어떻게 이어지나요?',
     '«오른쪽으로 p»가 식에서 «x − p»가 되는 까닭을 손으로 설명하세요.'],
  cols:['목표식','p','q','괄호 안','이동 방향'],
  hint:'힌트 — (x − p)² 이 0 이 되는 x 는 무엇인가요? 그 자리가 꼭짓점입니다.' },
 apply:{
  q:'새 문제 — y = x² 를 <b>왼쪽으로 3</b>, <b>아래로 2</b> 옮긴 식 y = (x − p)² + q 에서 <b>p</b> 의 값은?',
  a:-3, tol:0.1,
  why:'왼쪽으로 3 이면 p = −3 이므로 (x + 3)², 아래로 2 이면 q = −2. 식은 y = (x + 3)² − 2 입니다.',
  hint:'오른쪽이 +p, 왼쪽이 −p 입니다.' },
 demo(root){ return parabShiftDemo(root); }
};

LESSON[52]={
 title:'이차함수의 최적화 — 울타리 20 m',
 problem:{
  q:'울타리 <b>20 m</b> 로 직사각형 땅을 두릅니다. 가로를 길게 하면 세로가 짧아지고, 세로를 길게 하면 가로가 짧아집니다. <b>가장 넓은 땅</b>이 되는 것은 어떤 모양일까요?',
  svg:`<svg viewBox="0 0 400 170" role="img" aria-label="가로 길이에 따른 넓이가 포물선을 그리며 가운데서 최대가 되는 그림">
    <path d="M44 146 H384 M44 146 V20" stroke="#9CA3AF" stroke-width="1.3"/>
    <path d="__P52__" stroke="#2563EB" stroke-width="2.6" fill="none"/>
    <circle cx="209" cy="36" r="5" fill="#BE123C"/>
    <path d="M209 36 V146" stroke="#BE123C" stroke-width="1.4" stroke-dasharray="4 3"/>
    <text x="216" y="32" font-size="10.5" font-weight="800" fill="#BE123C">여기가 가장 넓다</text>
    <text x="378" y="162" font-size="9.5" fill="#6B7280" text-anchor="end">가로 w →</text>
    <text x="48" y="18" font-size="9.5" fill="#6B7280">넓이 S</text>
    <text x="200" y="166" font-size="10.5" fill="#6B7280" text-anchor="middle">가로를 바꾸면 넓이가 어떻게 변하는가</text>
  </svg>`,
  sit:'가로 w 를 끌면 세로 <b>10 − w</b> 와 넓이 <b>S = w(10 − w)</b> 가 함께 바뀝니다. 「최대와의 차」 칸이 0 이 되는 자리를 찾으면, 그 모양이 무엇인지 드러납니다.'
 },
 predict:{
  q:['가장 넓은 땅은 어떤 모양일지 예상하고 까닭도 적으세요.',
     '가로를 2 m 로 하면 넓이가 얼마일지 계산해 보세요.',
     '둘레가 같을 때 넓이가 최대가 되는 모양을 한 줄로 적어 보세요.'] },
 missions:[
  {t:'가로 w 를 끌어 <b>넓이</b>가 어떻게 변하는지 보세요.', re:'넓이'},
  {t:'「최대와의 차」가 <b>0</b> 이 되는 자리를 찾아보세요.', re:'최대'},
  {t:'아래 <b>탐구 노트</b>로 마무리하세요 — 지금 값을 <b>기록</b>하고, 두 자리를 <b>견주고</b>, 최대인 모양을 <b>판단</b>합니다.',
   re:'탐구 노트 통과',
   do:'① 지금 w·세로·넓이 적기 ② 다른 w 로 옮겨 넓이 다시 적고 견주기 ③ 최대와의 차가 0 인 자리 찾기',
   hand:'S = w(10 − w) 를 완전제곱으로 고쳐 최댓값과 그때의 w 를 구하기'}],
 inquiry:{
  id:'fn52', title:'울타리 20 m 의 최대 넓이',
  q:['w 를 바꿔 가며 8줄 이상 기록하세요.',
     '「최대와의 차」 열을 보세요. 언제 0 이 되나요?',
     'S = w(10 − w) = −(w − 5)² + 25 로 고쳐 최댓값을 손으로 구하세요.'],
  cols:['w','10−w','넓이 S','최대와의 차'],
  hint:'힌트 — 둘레가 20 이면 가로 + 세로 = 10 입니다. 두 수의 합이 일정할 때 곱은 언제 최대인가요?' },
 apply:{
  q:'새 문제 — 울타리 <b>24 m</b> 로 직사각형을 두를 때 넓이의 최댓값은? (㎡)',
  a:36, tol:0.5,
  why:'가로 + 세로 = 12 이므로 둘이 같을 때(6, 6) 최대이고 넓이는 6 × 6 = 36 ㎡ 입니다.',
  hint:'가로와 세로가 같을 때 최대입니다.' },
 demo(root){ return fenceDemo(root); }
};

LESSON[53]={
 title:'곱셈 공식 — 전개를 그림으로',
 problem:{
  q:'(a + b)² 을 a² + b² 이라고 쓰면 왜 틀릴까요? 빠진 <b>2ab</b> 는 어디에 있는 걸까요? 식을 <b>넓이</b>로 바꿔 놓으면 눈에 보입니다.',
  svg:`<svg viewBox="0 0 400 170" role="img" aria-label="한 변이 a+b 인 정사각형이 네 조각으로 나뉜 넓이 모형">
    <rect x="96" y="26" width="120" height="86" rx="3" fill="#2563EB" opacity=".26" stroke="#2563EB" stroke-width="1.6"/>
    <text x="156" y="76" font-size="14" font-weight="800" fill="#1D4ED8" text-anchor="middle">a²</text>
    <rect x="216" y="26" width="60" height="86" rx="3" fill="#0E9384" opacity=".26" stroke="#0E9384" stroke-width="1.6"/>
    <text x="246" y="76" font-size="12" font-weight="800" fill="#0B6E63" text-anchor="middle">ab</text>
    <rect x="96" y="112" width="120" height="44" rx="3" fill="#0E9384" opacity=".26" stroke="#0E9384" stroke-width="1.6"/>
    <text x="156" y="140" font-size="12" font-weight="800" fill="#0B6E63" text-anchor="middle">ab</text>
    <rect x="216" y="112" width="60" height="44" rx="3" fill="#B45309" opacity=".26" stroke="#B45309" stroke-width="1.6"/>
    <text x="246" y="140" font-size="12" font-weight="800" fill="#92400E" text-anchor="middle">b²</text>
    <text x="330" y="70" font-size="11.5" font-weight="800" fill="#111827">(a+b)²</text>
    <text x="330" y="94" font-size="11" fill="#6B7280">= a² + 2ab + b²</text>
    <text x="200" y="20" font-size="10.5" fill="#6B7280" text-anchor="middle">ab 조각이 두 개 — 그것이 2ab 다</text>
  </svg>`,
  sit:'a 를 끌면 정사각형이 네 조각으로 다시 나뉘고, <b>a² · 2ab · b²</b> 의 넓이가 각각 계산됩니다. 셋을 더한 값과 <b>(a + b)²</b> 이 같은지 나란히 확인합니다.'
 },
 predict:{
  q:['(a + b)² 을 전개하면 어떻게 될지 적어 보세요.',
     'a² + b² 과 (a + b)² 의 차이는 무엇일까요?',
     '그 차이가 그림의 어느 조각일지 예상하세요.'] },
 missions:[
  {t:'a 를 끌어 <b>네 조각</b>의 넓이가 어떻게 변하는지 보세요.', re:'a²'},
  {t:'세 값을 더한 것과 <b>(a+b)²</b> 을 견주어 보세요.', re:'(a+b)'},
  {t:'아래 <b>탐구 노트</b>로 마무리하세요 — 조각을 <b>기록</b>하고, 합을 <b>계산</b>하고, 2ab 의 자리를 <b>판단</b>합니다.',
   re:'탐구 노트 통과',
   do:'① 지금 a·b·a²·2ab·b² 적기 ② 셋을 더해 (a+b)² 과 견주기 ③ a 를 바꿔 늘 같은지 확인',
   hand:'(a+b)² = a² + 2ab + b² 를 넓이 그림으로 설명하고, 2ab 가 어느 조각인지 짚기'}],
 inquiry:{
  id:'xp53', title:'전개를 그림으로 — 곱셈 공식',
  q:['a 를 바꿔 가며 8줄 이상 기록하세요.',
     '「a²」「2ab」「b²」 세 열을 더한 값과 「(a+b)²」 열을 견주세요.',
     '2ab 가 왜 두 개인지 <b>넓이 그림</b>으로 손으로 설명하세요.'],
  cols:['a','b','a²','2ab','b²','(a+b)²'],
  hint:'힌트 — 가로 a, 세로 b 인 직사각형이 <b>두 군데</b> 생깁니다. 그래서 ab 가 두 번 더해집니다.' },
 apply:{
  q:'새 문제 — <b>(7 + 3)²</b> 을 전개해 계산하면? (a² + 2ab + b² 를 써서)',
  a:100, tol:0.5,
  why:'49 + 2·7·3 + 9 = 49 + 42 + 9 = 100. 물론 10² = 100 과 같습니다.',
  hint:'a = 7, b = 3 을 공식에 넣으세요.' },
 demo(root){ return xpDemo(root); }
};

LESSON[54]={
 title:'특수각의 삼각비 — 왜 하필 그 수일까',
 problem:{
  q:'sin 30° = 1/2, sin 45° = √2/2, sin 60° = √3/2 를 외웁니다. 그런데 <b>왜 하필 그 수</b>일까요? 이 값들은 외워야 하는 것이 아니라, <b>두 개의 삼각형</b>에서 그냥 읽어 내는 것입니다.',
  svg:`<svg viewBox="0 0 400 170" role="img" aria-label="45도 직각이등변삼각형과 30-60-90 삼각형을 견주는 그림">
    __T54__
    <text x="58" y="150" font-size="10.5" font-weight="800" fill="#1D4ED8" text-anchor="middle">45° — 1 : 1 : √2</text>
    <text x="230" y="150" font-size="10.5" font-weight="800" fill="#0B6E63" text-anchor="middle">30°·60° — 1 : √3 : 2</text>
    <text x="200" y="20" font-size="10.5" fill="#6B7280" text-anchor="middle">두 삼각형의 변의 비에서 그냥 읽어 내는 값</text>
  </svg>`,
  sit:'각을 30°·45°·60° 로 맞추면 <b>sin · cos · tan</b> 가 정확한 꼴로 표시되고, 그 값이 삼각형의 <b>변의 비</b> 에서 어떻게 나오는지 함께 보여 줍니다.'
 },
 predict:{
  q:['sin 45° 가 √2/2 인 까닭을 직각이등변삼각형으로 설명해 보세요.',
     'sin 30° 와 cos 60° 는 왜 같을까요?',
     'tan 45° 가 1 인 까닭을 적어 보세요.'] },
 missions:[
  {t:'각을 <b>45°</b> 로 맞춰 세 값을 보세요. 무엇이 같은가요?', re:'45'},
  {t:'<b>30°</b> 와 <b>60°</b> 를 오가며 sin 과 cos 를 견주어 보세요.', re:'30'},
  {t:'아래 <b>탐구 노트</b>로 마무리하세요 — 값을 <b>기록</b>하고, 제곱의 합을 <b>계산</b>하고, 두 각의 관계를 <b>판단</b>합니다.',
   re:'탐구 노트 통과',
   do:'① 한 각의 sin·cos 적기 ② sin² + cos² 을 구하기 ③ 30° 와 60° 를 견주어 관계 찾기',
   hand:'sin²θ + cos²θ = 1 이 피타고라스 정리와 같은 말임을 그림으로 설명하기'}],
 inquiry:{
  id:'ta54', title:'특수각의 삼각비 — 왜 그 수인가',
  q:['세 특수각을 모두 골라 값을 기록하세요.',
     'sin 과 cos 열을 견주세요. 30° 와 60° 사이에 어떤 관계가 있나요?',
     'sin²θ + cos²θ = 1 이 <b>피타고라스 정리</b>와 같은 말임을 손으로 설명하세요.'],
  cols:['θ','sin','cos','tan'],
  hint:'힌트 — 빗변을 1 로 둔 직각삼각형에서 두 변이 sin θ 와 cos θ 입니다. 피타고라스 정리를 써 보세요.' },
 apply:{
  q:'새 문제 — <b>sin² 30° + cos² 30°</b> 의 값은?',
  a:1, tol:0.02,
  why:'(1/2)² + (√3/2)² = 1/4 + 3/4 = 1. 어떤 각에서도 sin²θ + cos²θ = 1 입니다.',
  hint:'피타고라스 정리를 떠올리세요.' },
 demo(root){ return taDemo(root); }
};

LESSON[55]={
 title:'삼각비의 표와 보간 — 계산기 이전의 계산기',
 problem:{
  q:'계산기가 없던 시절, 배를 타고 별을 보며 위치를 구하던 사람들은 sin 37° 를 어떻게 알았을까요? <b>표</b> 하나로 그 사이의 값까지 알아내는 방법이 있었습니다.',
  svg:`<svg viewBox="0 0 400 170" role="img" aria-label="삼각비 표에서 이웃한 두 값 사이를 직선으로 잇는 보간 그림">
    <path d="M40 140 H370 M40 140 V26" stroke="#9CA3AF" stroke-width="1.3"/>
    <circle cx="110" cy="104" r="4.6" fill="#2563EB"/>
    <circle cx="260" cy="58" r="4.6" fill="#2563EB"/>
    <path d="M110 104 L260 58" stroke="#B45309" stroke-width="2" stroke-dasharray="5 3"/>
    <circle cx="176" cy="84" r="5" fill="#BE123C"/>
    <path d="M176 84 V140" stroke="#BE123C" stroke-width="1.3" stroke-dasharray="3 3"/>
    <text x="182" y="80" font-size="10.5" font-weight="800" fill="#BE123C">표에 없는 각</text>
    <text x="106" y="120" font-size="10" font-weight="800" fill="#1D4ED8" text-anchor="middle">표의 값</text>
    <text x="264" y="50" font-size="10" font-weight="800" fill="#1D4ED8">표의 값</text>
    <text x="200" y="164" font-size="10.5" fill="#6B7280" text-anchor="middle">두 값 사이를 직선으로 이어 어림한다 — 선형보간</text>
  </svg>`,
  sit:'각을 바꾸며 <b>표의 값</b>을 읽고, 이웃한 두 칸의 차를 봅니다. 표에 없는 각은 <b>두 값 사이를 직선으로 이어</b> 어림하는데, 그 어림이 실제 값과 얼마나 차이 나는지 확인합니다.'
 },
 predict:{
  q:['표에 37° 가 없다면 어떻게 값을 구할 수 있을지 적어 보세요.',
     '이웃한 두 각의 sin 값 차이는 각도가 커질수록 어떻게 될지 예상하세요.',
     '직선으로 이어 어림하면 왜 오차가 생길까요?'] },
 missions:[
  {t:'각을 바꿔 가며 <b>sin 값</b>과 이웃 칸과의 차를 보세요.', re:'sin'},
  {t:'각을 크게 해 보세요. 이웃 칸과의 차가 어떻게 되나요?', re:'차'},
  {t:'아래 <b>탐구 노트</b>로 마무리하세요 — 두 값을 <b>기록</b>하고, 중간값을 <b>어림</b>하고, 실제와 <b>견주어 판단</b>합니다.',
   re:'탐구 노트 통과',
   do:'① 이웃한 두 각의 sin 값 적기 ② 두 값의 평균으로 가운데 각을 어림하기 ③ 실제 값과 견주어 오차 보기',
   hand:'선형보간이 왜 오차를 내는지 «곡선을 직선으로 대신했다»로 설명하기'}],
 inquiry:{
  id:'tb55', title:'계산기 이전의 계산기 — 표와 보간',
  q:['각을 바꿔 가며 sin 값을 8줄 이상 기록하세요.',
     '「이웃 칸과의 차」를 보세요. 각이 커질수록 어떻게 변하나요?',
     '선형보간의 오차가 어디서 오는지 손으로 설명하세요.'],
  cols:['θ','sin θ','이웃 칸과의 차'],
  hint:'힌트 — sin 곡선은 직선이 아닙니다. 짧은 구간일수록 직선에 가까워 어림이 잘 맞습니다.' },
 apply:{
  q:'새 문제 — sin 30° = 0.5000, sin 32° = 0.5299 입니다. <b>sin 31°</b> 를 선형보간으로 어림하면? (소수 넷째 자리)',
  a:0.5150, tol:0.0006,
  why:'두 값의 가운데이므로 (0.5000 + 0.5299) ÷ 2 = 0.51495 ≈ 0.5150. 실제 값 0.5150 과 거의 같습니다.',
  hint:'두 값의 평균을 구하세요.' },
 demo(root){ return tbDemo(root); }
};

LESSON[56]={
 title:'원주각 — 어디서 봐도 같은 각',
 problem:{
  q:'축구 골대를 향해 공을 찰 때, <b>어느 자리</b>에서 차면 골대가 가장 넓어 보일까요? 놀랍게도 원 위에서는 <b>어디서 봐도 똑같이</b> 보이는 자리들이 있습니다.',
  svg:`<svg viewBox="0 0 400 170" role="img" aria-label="한 호에 대한 원주각이 어느 점에서나 같고 중심각의 절반임을 보여 주는 그림">
    <circle cx="200" cy="88" r="62" fill="none" stroke="#9CA3AF" stroke-width="1.6"/>
    <circle cx="152" cy="127" r="4.2" fill="#BE123C"/>
    <circle cx="248" cy="127" r="4.2" fill="#BE123C"/>
    <path d="M152 127 L200 88 L248 127" stroke="#B45309" stroke-width="1.8" fill="none"/>
    <path d="M152 127 L178 28 L248 127" stroke="#2563EB" stroke-width="1.8" fill="none"/>
    <path d="M152 127 L252 42 L248 127" stroke="#0E9384" stroke-width="1.8" fill="none"/>
    <circle cx="200" cy="88" r="3.4" fill="#111827"/>
    <text x="200" y="80" font-size="9.5" font-weight="800" fill="#92400E" text-anchor="middle">중심각</text>
    <text x="178" y="22" font-size="9.5" font-weight="800" fill="#1D4ED8" text-anchor="middle">원주각</text>
    <text x="258" y="38" font-size="9.5" font-weight="800" fill="#0B6E63">원주각</text>
    <text x="200" y="166" font-size="10.5" fill="#6B7280" text-anchor="middle">두 원주각은 같을까? 중심각과는 어떤 관계일까?</text>
  </svg>`,
  sit:'원 위의 점 P 를 <b>직접 끌어</b> 옮기면 원주각이 함께 계산되고, <b>중심각 ÷ 원주각</b> 이 나란히 표시됩니다. P 를 아무리 옮겨도 그 값이 그대로인지 확인합니다.'
 },
 predict:{
  q:['원 위의 점을 옮기면 각이 달라질지 예상하고 까닭도 적으세요.',
     '중심각과 원주각 중 어느 쪽이 클지 예상하세요.',
     '반원에 대한 원주각은 몇 도일지 적어 보세요.'] },
 missions:[
  {t:'점 P 를 원 위에서 <b>끌어 옮겨</b> 보세요. 원주각이 달라지나요?', re:'원주각'},
  {t:'<b>중심각 ÷ 원주각</b> 을 보세요. 얼마인가요?', re:'나눗셈'},
  {t:'아래 <b>탐구 노트</b>로 마무리하세요 — 두 각을 <b>기록</b>하고, 나눗셈을 <b>계산</b>하고, P 를 옮겨 <b>판단</b>합니다.',
   re:'탐구 노트 통과',
   do:'① 지금 중심각과 원주각 적기 ② 중심각 ÷ 원주각 구하기 ③ P 를 멀리 옮겨 값이 그대로인지 확인',
   hand:'원주각이 중심각의 절반인 까닭을 이등변삼각형으로 설명하기'}],
 inquiry:{
  id:'ia56', title:'어디서 봐도 같은 각 — 원주각',
  q:['P 를 여러 자리로 옮겨 가며 8줄 이상 기록하세요.',
     '「나눗셈」 열을 보세요. P 를 옮겨도 값이 변하나요?',
     '원주각이 중심각의 <b>절반</b>인 까닭을 손으로 설명하세요.'],
  cols:['중심각','원주각','나눗셈'],
  hint:'힌트 — 중심과 P 를 이으면 이등변삼각형이 두 개 생깁니다. 외각의 성질을 써 보세요.' },
 apply:{
  q:'새 문제 — 중심각이 <b>110°</b> 인 호에 대한 원주각은 몇 도일까요?',
  a:55, tol:0.5,
  why:'원주각 = 중심각 ÷ 2 = 110 ÷ 2 = 55°. 호가 같으면 원주각은 어디서 봐도 같습니다.',
  hint:'원주각은 중심각의 절반입니다.' },
 demo(root){ return iaDemo(root); }
};

LESSON[57]={
 title:'원의 접선 — 위성은 어디까지 보나',
 problem:{
  q:'인공위성은 지구의 <b>어디까지</b> 볼 수 있을까요? 높이 올라갈수록 더 멀리 보이는데, 그 경계는 위성에서 지구로 그은 <b>접선</b>이 닿는 자리입니다. 그 거리를 계산할 수 있을까요?',
  svg:`<svg viewBox="0 0 400 170" role="img" aria-label="위성에서 지구에 그은 두 접선과 가시 범위를 보여 주는 그림">
    <circle cx="150" cy="88" r="52" fill="#2563EB" opacity=".12" stroke="#2563EB" stroke-width="1.8"/>
    <circle cx="150" cy="88" r="3" fill="#111827"/>
    <circle cx="330" cy="88" r="5" fill="#BE123C"/>
    <text x="330" y="74" font-size="10" font-weight="800" fill="#BE123C" text-anchor="middle">위성</text>
    <path d="M330 88 L165.0 38.1 M330 88 L165.0 137.9" stroke="#B45309" stroke-width="1.8"/>
    <path d="M150 88 L165.0 38.1 M150 88 L165.0 137.9" stroke="#9CA3AF" stroke-width="1.2" stroke-dasharray="3 3"/>
    <circle cx="165.0" cy="38.1" r="4" fill="#B45309"/>
    <circle cx="165.0" cy="137.9" r="4" fill="#B45309"/>
    <text x="200" y="22" font-size="10.5" fill="#6B7280" text-anchor="middle">접점에서 반지름과 접선은 수직이다</text>
    <text x="200" y="164" font-size="10.5" fill="#6B7280" text-anchor="middle">이 두 점 사이가 «보이는 범위»</text>
  </svg>`,
  sit:'위성을 <b>끌어 올리면</b> 중심까지의 거리 OP 와 접선의 길이 PA, 그리고 <b>가시 범위</b> 가 함께 계산됩니다. 접점에서 반지름과 접선이 직각을 이루므로 피타고라스 정리로 바로 구할 수 있습니다.'
 },
 predict:{
  q:['위성을 더 높이 올리면 보이는 범위가 어떻게 될지 예상하세요.',
     '접선의 길이를 구하려면 무엇을 알아야 할까요?',
     '접점에서 반지름과 접선이 이루는 각은 몇 도일지 적어 보세요.'] },
 missions:[
  {t:'위성을 <b>끌어 올려</b> 보세요. 접선의 길이가 어떻게 변하나요?', re:'접선'},
  {t:'<b>가시 범위</b>가 어떻게 넓어지는지 보세요.', re:'범위'},
  {t:'아래 <b>탐구 노트</b>로 마무리하세요 — 거리를 <b>기록</b>하고, 접선 길이를 <b>계산</b>하고, 높이를 바꿔 <b>판단</b>합니다.',
   re:'탐구 노트 통과',
   do:'① 지금 OP 와 접선 PA 적기 ② 피타고라스로 PA 를 계산해 견주기 ③ 위성을 더 올려 범위가 넓어지는지 확인',
   hand:'PA² = OP² − r² 가 나오는 까닭을 «접점에서 직각»으로 설명하기'}],
 inquiry:{
  id:'tn57', title:'위성은 어디까지 보나 — 원의 접선',
  q:['위성의 높이를 바꿔 가며 8줄 이상 기록하세요.',
     '「OP」와 「접선 PA」를 견주세요. 피타고라스 정리가 성립하나요?',
     '접점에서 반지름과 접선이 <b>수직</b>인 까닭을 손으로 설명하세요.'],
  cols:['OP','접선 PA','가시 범위'],
  hint:'힌트 — 접점에서 직각이므로 직각삼각형 OAP 에서 OP² = r² + PA² 입니다.' },
 apply:{
  q:'새 문제 — 반지름이 <b>5</b> 인 원의 중심에서 <b>13</b> 만큼 떨어진 점에서 그은 접선의 길이는?',
  a:12, tol:0.1,
  why:'PA² = 13² − 5² = 169 − 25 = 144 이므로 PA = 12. 접점에서 직각이기 때문입니다.',
  hint:'PA² = OP² − r².' },
 demo(root){ return tnDemo(root); }
};

LESSON[58]={
 title:'원에 내접하는 사각형',
 problem:{
  q:'네 점이 <b>한 원 위</b>에 있으면 무엇이 정해질까요? 사각형의 네 각은 제각각인데, 그중 <b>마주 보는 두 각</b>에는 숨은 규칙이 있습니다.',
  svg:`<svg viewBox="0 0 400 170" role="img" aria-label="원에 내접하는 사각형에서 마주 보는 두 각의 합이 180도임을 보여 주는 그림">
    <circle cx="200" cy="86" r="62" fill="none" stroke="#9CA3AF" stroke-width="1.6"/>
    <polygon points="200,24 254,64 232,142 152,130" fill="#2563EB" opacity=".10" stroke="#2563EB" stroke-width="1.8"/>
    <circle cx="200" cy="24" r="4" fill="#BE123C"/><text x="200" y="16" font-size="10" font-weight="800" fill="#BE123C" text-anchor="middle">A</text>
    <circle cx="254" cy="64" r="4" fill="#0E9384"/><text x="264" y="62" font-size="10" font-weight="800" fill="#0B6E63">B</text>
    <circle cx="232" cy="142" r="4" fill="#BE123C"/><text x="240" y="156" font-size="10" font-weight="800" fill="#BE123C">C</text>
    <circle cx="152" cy="130" r="4" fill="#0E9384"/><text x="138" y="142" font-size="10" font-weight="800" fill="#0B6E63">D</text>
    <text x="200" y="166" font-size="10.5" fill="#6B7280" text-anchor="middle">∠A + ∠C 와 ∠B + ∠D 는 각각 얼마일까?</text>
  </svg>`,
  sit:'꼭짓점을 <b>끌어 옮기며</b> 네 각을 바꾸면 <b>∠A + ∠C</b> 와 <b>∠B + ∠D</b> 가 함께 계산됩니다. 점 D 를 원 밖으로 끌어내면 그 합이 어떻게 깨지는지도 확인할 수 있습니다.'
 },
 predict:{
  q:['원에 내접하는 사각형에서 마주 보는 두 각의 합이 얼마일지 예상하세요.',
     '꼭짓점을 옮겨도 그 합이 그대로일지 예상하고 까닭도 적으세요.',
     '점 하나가 원 밖으로 나가면 어떻게 될까요?'] },
 missions:[
  {t:'꼭짓점을 끌어 <b>네 각</b>을 바꿔 보세요. 두 합이 어떻게 되나요?', re:'∠'},
  {t:'점 D 를 <b>원 밖으로</b> 끌어내 보세요. 합이 어떻게 되나요?', re:'원 위'},
  {t:'아래 <b>탐구 노트</b>로 마무리하세요 — 두 합을 <b>기록</b>하고, 합계를 <b>계산</b>하고, 원 밖으로 내보내 <b>판단</b>합니다.',
   re:'탐구 노트 통과',
   do:'① 원 위에 있을 때 두 합 적기 ② 두 합을 더해 360° 가 되는지 확인 ③ D 를 원 밖으로 내보내 합이 깨지는지 보기',
   hand:'마주 보는 두 각의 합이 180° 인 까닭을 원주각으로 설명하기'}],
 inquiry:{
  id:'cy58', title:'네 점이 한 원 위에 있다면',
  q:['꼭짓점을 옮겨 가며 8줄 이상 기록하세요. 원 밖으로 나간 경우도 섞으세요.',
     '「∠A+∠C」와 「∠B+∠D」 열을 보세요. 원 위일 때와 아닐 때가 어떻게 다른가요?',
     '마주 보는 두 각의 합이 180° 인 까닭을 <b>원주각</b>으로 손으로 설명하세요.'],
  cols:['∠A+∠C','∠B+∠D','D는 원 위?'],
  hint:'힌트 — ∠A 와 ∠C 는 서로 다른 호에 대한 원주각입니다. 두 호를 합치면 원 전체가 됩니다.' },
 apply:{
  q:'새 문제 — 원에 내접하는 사각형에서 <b>∠A = 78°</b> 일 때 <b>∠C</b> 는 몇 도일까요?',
  a:102, tol:0.5,
  why:'마주 보는 두 각의 합이 180° 이므로 180 − 78 = 102°.',
  hint:'∠A + ∠C = 180°.' },
 demo(root){ return cyDemo(root); }
};

LESSON[59]={
 title:'상자그림 — 이상치를 자동으로 찾는다',
 problem:{
  q:'자료 하나가 <b>유난히 크면</b> 눈으로는 금방 알아챕니다. 그런데 자료가 수백 개라면요? 사람의 눈 대신 <b>규칙</b>으로 이상치를 찾아내는 그림이 있습니다.',
  svg:`<svg viewBox="0 0 400 170" role="img" aria-label="상자그림의 상자·수염·중앙값과 바깥의 이상치 점">
    __BOX59__
    <text x="180" y="62" font-size="10" font-weight="800" fill="#BE123C" text-anchor="middle">중앙값</text>
    <text x="180" y="132" font-size="10" font-weight="800" fill="#1D4ED8" text-anchor="middle">가운데 절반이 이 상자 안</text>
    <text x="348" y="76" font-size="10" font-weight="800" fill="#BE123C" text-anchor="middle">이상치</text>
    <text x="200" y="26" font-size="10.5" fill="#6B7280" text-anchor="middle">수염 밖으로 나가면 «이상치»로 표시된다</text>
    <text x="200" y="158" font-size="10.5" fill="#6B7280" text-anchor="middle">기준은 눈이 아니라 «상자 길이의 1.5배»</text>
  </svg>`,
  sit:'값 하나를 <b>직접 끌어</b> 크게 만들면, 어느 순간 <b>이상치</b>로 표시됩니다. 평균과 중앙값이 함께 표시되어 «이상치가 어느 쪽을 흔드는지»도 같이 보입니다.'
 },
 predict:{
  q:['자료 하나를 아주 크게 만들면 평균과 중앙값 중 어느 쪽이 더 움직일지 예상하세요.',
     '«이상치»를 가르는 기준을 스스로 정한다면 무엇으로 할지 적어 보세요.',
     '상자그림의 «상자»는 무엇을 나타낼까요?'] },
 missions:[
  {t:'값 하나를 <b>끌어 크게</b> 만들어 보세요. 언제 이상치가 되나요?', re:'이상치'},
  {t:'그때 <b>평균</b>과 <b>중앙값</b>이 각각 어떻게 움직이는지 보세요.', re:'중앙값'},
  {t:'아래 <b>탐구 노트</b>로 마무리하세요 — 값을 <b>기록</b>하고, 두 대푯값의 차를 <b>계산</b>하고, 이상치의 영향을 <b>판단</b>합니다.',
   re:'탐구 노트 통과',
   do:'① 이상치가 되기 전의 값·평균·중앙값 적기 ② 이상치가 되게 키운 뒤 다시 적기 ③ 두 대푯값의 변화를 견주기',
   hand:'이상치가 평균만 크게 흔드는 까닭을 «합을 나눈다»로 설명하기'}],
 inquiry:{
  id:'bx59', title:'이상치를 자동으로 찾는 그림 — 상자그림',
  q:['값을 여러 크기로 옮겨 가며 8줄 이상 기록하세요.',
     '「이상치?」 열이 바뀌는 경계를 찾으세요.',
     '이상치가 <b>평균</b>과 <b>중앙값</b>에 각각 어떤 영향을 주는지 손으로 정리하세요.'],
  cols:['움직인 값','이상치?','평균','중앙값'],
  hint:'힌트 — 상자의 길이(IQR)의 1.5배를 넘어가면 이상치로 봅니다. 중앙값은 순서만 보므로 잘 흔들리지 않습니다.' },
 apply:{
  q:'새 문제 — Q1 = 20, Q3 = 40 일 때 이상치로 판정되는 <b>위쪽 경계</b>는?',
  a:70, tol:0.5,
  why:'IQR = 40 − 20 = 20 이고 경계는 Q3 + 1.5 × IQR = 40 + 30 = 70 입니다.',
  hint:'Q3 + 1.5 × (Q3 − Q1).' },
 demo(root){ return bxDemo(root); }
};

LESSON[60]={
 title:'이상치와 상관 — 점 하나의 권력',
 problem:{
  q:'자료 스무 개로 «관계가 있다»는 결론을 냈습니다. 그런데 <b>점 하나</b>를 빼자 결론이 뒤집혔습니다. 점 하나가 어떻게 전체 결론을 바꿀 수 있을까요?',
  svg:`<svg viewBox="0 0 400 170" role="img" aria-label="이상치 하나가 상관계수를 크게 바꾸는 산점도">
    <path d="M36 142 H380 M36 142 V22" stroke="#9CA3AF" stroke-width="1.3"/>
    ${[[70,120],[92,112],[108,124],[124,108],[140,118],[156,104],[172,114],[188,100],[204,110],[220,96]].map(p=>`<circle cx="${p[0]}" cy="${p[1]}" r="3.8" fill="#111827" opacity=".8"/>`).join('')}
    <circle cx="336" cy="40" r="6" fill="#BE123C"/>
    <circle cx="336" cy="40" r="13" fill="none" stroke="#BE123C" stroke-width="2"/>
    <text x="330" y="28" font-size="10" font-weight="800" fill="#BE123C" text-anchor="end">이 점 하나</text>
    <path d="M60 122 L238 98" stroke="#0E9384" stroke-width="2" stroke-dasharray="5 3"/>
    <path d="M60 128 L348 52" stroke="#2563EB" stroke-width="2"/>
    <text x="200" y="164" font-size="10.5" fill="#6B7280" text-anchor="middle">점 하나를 넣고 빼면 직선이 얼마나 달라지는가</text>
  </svg>`,
  sit:'이상치를 <b>직접 끌어</b> 옮기면 <b>포함했을 때의 r</b> 과 <b>제외했을 때의 r</b> 이 나란히 표시됩니다. 점 하나를 멀리 보낼수록 두 값이 얼마나 벌어지는지 직접 확인합니다.'
 },
 predict:{
  q:['점 하나가 상관계수를 크게 바꿀 수 있을지 예상하고 까닭도 적으세요.',
     '이상치를 어디에 두면 r 이 가장 크게 흔들릴지 예상하세요.',
     '«관계가 있다»고 말하기 전에 무엇을 먼저 해야 할까요?'] },
 missions:[
  {t:'이상치를 <b>끌어 옮겨</b> 보세요. 두 r 값이 얼마나 벌어지나요?', re:'r'},
  {t:'이상치를 <b>아주 멀리</b> 보내 보세요. 결론이 뒤집히나요?', re:'제외'},
  {t:'아래 <b>탐구 노트</b>로 마무리하세요 — 두 r 을 <b>기록</b>하고, 차를 <b>계산</b>하고, 더 멀리 보내 <b>판단</b>합니다.',
   re:'탐구 노트 통과',
   do:'① 지금 r(포함)과 r(제외) 적기 ② 두 값의 차 구하기 ③ 이상치를 더 멀리 보내 차가 커지는지 확인',
   hand:'«상관계수 하나만 보고 판단하면 안 되는 까닭»을 내가 만든 자료를 근거로 쓰기'}],
 inquiry:{
  id:'oc60', title:'점 하나의 권력 — 이상치와 상관',
  q:['이상치를 여러 자리로 옮겨 가며 8줄 이상 기록하세요.',
     '「r (포함)」과 「r (제외)」 열을 견주세요. 언제 가장 크게 벌어지나요?',
     '상관계수를 볼 때 <b>산점도를 반드시 함께 봐야 하는 까닭</b>을 손으로 설명하세요.'],
  cols:['이상치 위치','r (포함)','r (제외)'],
  hint:'힌트 — r 은 평균에서 멀리 떨어진 점에 크게 끌려갑니다. 그래서 숫자 하나만으로는 위험합니다.' },
 apply:{
  q:'새 문제 — 자료 스무 개의 r 이 <b>0.8</b> 이었는데 점 하나를 빼자 <b>0.2</b> 가 되었습니다. 두 값의 <b>차</b>는?',
  a:0.6, tol:0.02,
  why:'0.8 − 0.2 = 0.6. 점 하나가 상관계수를 0.6 이나 움직였다면, 그 결론은 그 점 하나에 기대고 있던 것입니다.',
  hint:'두 값을 빼세요.' },
 demo(root){ return ocDemo(root); }
};

"""


def note(no, head, c1, c2, c3):
    return "\n %d:{ h:'%s',\n  c:[\n%s,\n%s,\n%s\n ]},\n" % (no, head, c1, c2, c3)


NOTES = (
 note(51, '내가 옮기고 · 내가 읽고 · 내가 판단한다',
 """  {t:'기록 — 꼭짓점을 <b>오른쪽</b>으로 옮긴 뒤 화면의 값을 적으세요',
   f:'p = {0} · q = {1}',
   chk(got, r, mem){
     if(!r) return {ok:false, msg:'아직 화면 값이 없습니다. 꼭짓점을 끌어 보세요.'};
     const p=noteNum(r[1]), q=noteNum(r[2]);
     if(!(p>0)) return {ok:false, msg:'아직 p = '+p+' 입니다. <b>오른쪽</b>으로 옮겨 p 를 양수로 만드세요.'};
     if(![0,1].every(j=>isFinite(got[j]))) return {ok:false, msg:'두 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-p)>0.1||Math.abs(got[1]-q)>0.1)
       return {ok:false, msg:'화면은 p = '+p+' · q = '+q+' 입니다.'};
     mem.p=p; mem.paren=String(r[3]);
     return {ok:true, msg:'기록했습니다 — 괄호 안이 «'+mem.paren+'» 입니다.'};
   }}""",
 """  {t:'생각 — 괄호 안이 <b>0</b> 이 되는 x 를 구하세요',
   f:'괄호 안이 0 이 되는 x = {0} · 그 값이 p 와 같으면 1, 다르면 0 → {1}',
   chk(got, r, mem){
     if(mem.p===undefined) return {ok:false, msg:'① 칸을 먼저 통과하세요.'};
     if(![0,1].every(j=>isFinite(got[j]))) return {ok:false, msg:'두 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-mem.p)>0.1) return {ok:false, msg:'«'+mem.paren+'» 이 0 이 되는 x 를 구하세요.'};
     if(Math.abs(got[1]-1)>0.01) return {ok:false, msg:'구한 x 와 ①의 p 를 견주어 보세요.'};
     mem.ok2=true;
     return {ok:true, msg:'계산했습니다 — 괄호 안이 0 이 되는 자리가 곧 <b>꼭짓점의 x</b> 입니다.'};
   }}""",
 """  {t:'판단 — 이번에는 <b>왼쪽</b>으로 옮긴 뒤 괄호 안의 부호를 보고 고르세요',
   f:'왼쪽으로 옮긴 뒤 p = {0}',
   opts:['오른쪽으로 p 만큼 옮기면 식에는 <b>x − p</b> — 괄호 안이 0 이 되는 자리가 꼭짓점이기 때문',
         '오른쪽으로 옮기면 식에도 더하기가 나온다',
         '평행이동은 식의 부호와 관계가 없다'],
   chk(got, r, mem, pick){
     if(!mem.ok2) return {ok:false, msg:'② 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const p=noteNum(r[1]);
     if(!(p<0)) return {ok:false, msg:'아직 p = '+p+' 입니다. <b>왼쪽</b>으로 옮겨 p 를 음수로 만드세요.'};
     if(!isFinite(got[0])) return {ok:false, msg:'칸을 채우세요.'};
     if(Math.abs(got[0]-p)>0.1) return {ok:false, msg:'지금 p 는 '+p+' 입니다.'};
     if(pick!==0)
       return {ok:false, msg:'오른쪽일 때 «'+mem.paren+'», 왼쪽일 때 «'+r[3]+'» 입니다. 이 사실을 보고 다시 고르세요.'};
     return {ok:true, msg:'판단했습니다 — <b>«오른쪽으로 p»가 식에서 x − p 가 되는 것은</b>, 같은 y 값을 내려면 x 가 p 만큼 더 커야 하기 때문입니다.'};
   }}""")
 +
 note(52, '내가 끌고 · 내가 재고 · 내가 판단한다',
 """  {t:'기록 — 가로 w 를 정한 뒤 화면의 값을 적으세요',
   f:'가로 w = {0} · 세로 = {1} · 넓이 S = {2}',
   chk(got, r, mem){
     if(!r) return {ok:false, msg:'아직 화면 값이 없습니다.'};
     const w=noteNum(r[0]), h=noteNum(r[1]), S=noteNum(r[2]);
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-w)>0.12||Math.abs(got[1]-h)>0.12)
       return {ok:false, msg:'화면은 '+w+' 과 '+h+' 입니다.'};
     if(Math.abs(got[2]-S)>0.2) return {ok:false, msg:'넓이는 '+S+' 입니다.'};
     mem.w=w; mem.S=S;
     return {ok:true, msg:'기록했습니다 — 가로와 세로를 더하면 늘 10 입니다.'};
   }}""",
 """  {t:'생각 — w 를 <b>다른 값</b>으로 옮겨 넓이를 다시 적고 견주세요',
   f:'새 w = {0} · 새 넓이 = {1} · 넓이의 차 = {2}',
   chk(got, r, mem){
     if(mem.w===undefined) return {ok:false, msg:'① 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const w=noteNum(r[0]), S=noteNum(r[2]);
     if(Math.abs(w-mem.w)<0.6) return {ok:false, msg:'w 가 거의 그대로입니다 — 더 옮겨 보세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-w)>0.12||Math.abs(got[1]-S)>0.2)
       return {ok:false, msg:'지금은 w = '+w+' · 넓이 '+S+' 입니다.'};
     if(Math.abs(got[2]-(S-mem.S))>0.3) return {ok:false, msg:'지금 넓이에서 ①의 넓이를 빼세요.'};
     mem.ok2=true;
     return {ok:true, msg:'계산했습니다 — 이제 «최대와의 차»가 0 이 되는 자리를 찾아봅시다.'};
   }}""",
 """  {t:'판단 — 「최대와의 차」가 <b>0</b> 이 되는 자리를 찾은 뒤 고르세요',
   f:'그때 w = {0} · 세로 = {1}',
   opts:['둘레가 같을 때는 <b>가로와 세로가 같을 때</b> 넓이가 가장 크다 — 정사각형이다',
         '가로를 길게 할수록 넓이가 커진다',
         '가로를 짧게 할수록 넓이가 커진다'],
   chk(got, r, mem, pick){
     if(!mem.ok2) return {ok:false, msg:'② 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const w=noteNum(r[0]), h=noteNum(r[1]), d=noteNum(r[3]);
     if(Math.abs(d)>0.15) return {ok:false, msg:'아직 최대와의 차가 '+d+' 입니다. 0 이 되는 자리를 찾으세요.'};
     if(![0,1].every(j=>isFinite(got[j]))) return {ok:false, msg:'두 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-w)>0.12||Math.abs(got[1]-h)>0.12)
       return {ok:false, msg:'지금은 '+w+' 과 '+h+' 입니다.'};
     if(pick!==0)
       return {ok:false, msg:'가로와 세로가 모두 '+w+' 일 때 최대였습니다. 이 사실을 보고 다시 고르세요.'};
     return {ok:true, msg:'판단했습니다 — <b>S = w(10 − w) = −(w − 5)² + 25.</b> 완전제곱으로 고치면 w = 5 에서 최댓값 25 임이 바로 보입니다.'};
   }}""")
 +
 note(53, '내가 나누고 · 내가 더하고 · 내가 판단한다',
 """  {t:'기록 — a 를 정한 뒤 네 조각의 넓이를 적으세요',
   f:'a = {0} · a² = {1} · 2ab = {2} · b² = {3}',
   chk(got, r, mem){
     if(!r) return {ok:false, msg:'아직 화면 값이 없습니다.'};
     const a=noteNum(r[0]), a2=noteNum(r[2]), ab=noteNum(r[3]), b2=noteNum(r[4]);
     if(![0,1,2,3].every(j=>isFinite(got[j]))) return {ok:false, msg:'네 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-a)>0.1) return {ok:false, msg:'a 는 '+a+' 입니다.'};
     if(Math.abs(got[1]-a2)>0.5||Math.abs(got[2]-ab)>0.5||Math.abs(got[3]-b2)>0.5)
       return {ok:false, msg:'화면은 '+a2+' · '+ab+' · '+b2+' 입니다.'};
     mem.a2=a2; mem.ab=ab; mem.b2=b2;
     return {ok:true, msg:'기록했습니다 — 네 조각 중 ab 가 <b>두 개</b>입니다.'};
   }}""",
 """  {t:'생각 — 세 넓이를 <b>더해</b> (a+b)² 과 견주세요',
   f:'a² + 2ab + b² = {0} · 화면의 (a+b)² = {1} · 두 값의 차 = {2}',
   chk(got, r, mem){
     if(mem.a2===undefined) return {ok:false, msg:'① 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const t=noteNum(r[5]);
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-(mem.a2+mem.ab+mem.b2))>0.5) return {ok:false, msg:'①에 적은 세 값을 더하세요.'};
     if(Math.abs(got[1]-t)>0.5) return {ok:false, msg:'화면의 (a+b)² 은 '+t+' 입니다.'};
     if(Math.abs(got[2])>0.5) return {ok:false, msg:'두 값을 빼 보세요. 무엇이 나오나요?'};
     mem.ok2=true;
     return {ok:true, msg:'계산했습니다 — 차가 0 입니다. 네 조각의 합이 큰 정사각형과 같습니다.'};
   }}""",
 """  {t:'판단 — a 를 <b>다른 값</b>으로 바꿔 다시 확인한 뒤 고르세요',
   f:'새 a = {0} · 그때 2ab = {1}',
   opts:['(a + b)² = a² + <b>2ab</b> + b² — ab 조각이 <b>두 개</b>이기 때문이다',
         '(a + b)² = a² + b² 이다',
         'ab 조각은 한 개뿐이다'],
   chk(got, r, mem, pick){
     if(!mem.ok2) return {ok:false, msg:'② 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const a=noteNum(r[0]), ab=noteNum(r[3]);
     if(Math.abs(ab-mem.ab)<0.5) return {ok:false, msg:'값이 그대로입니다 — a 를 바꾸세요.'};
     if(![0,1].every(j=>isFinite(got[j]))) return {ok:false, msg:'두 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-a)>0.1||Math.abs(got[1]-ab)>0.5)
       return {ok:false, msg:'지금은 a = '+a+' · 2ab = '+ab+' 입니다.'};
     if(pick!==0)
       return {ok:false, msg:'②에서 세 조각의 합이 (a+b)² 과 같았습니다. 이 사실을 보고 다시 고르세요.'};
     return {ok:true, msg:'판단했습니다 — <b>가로 a 세로 b 인 직사각형이 두 군데 생깁니다.</b> 그래서 ab 가 두 번 더해져 2ab 가 됩니다.'};
   }}""")
 +
 note(54, '내가 맞추고 · 내가 제곱하고 · 내가 판단한다',
 """  {t:'기록 — 각을 <b>30°·45°·60°</b> 중 하나로 맞추고 값을 적으세요',
   f:'θ = {0} ° · sin = {1} · cos = {2}',
   chk(got, r, mem){
     if(!r) return {ok:false, msg:'아직 화면 값이 없습니다.'};
     const th=noteNum(r[0]), s=noteNum(r[1]), c=noteNum(r[2]);
     if([30,45,60].every(v=>Math.abs(th-v)>0.6))
       return {ok:false, msg:'지금 '+th+'° 입니다. 30·45·60 중 하나로 맞추세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-th)>0.6) return {ok:false, msg:'각은 '+th+'° 입니다.'};
     if(Math.abs(got[1]-s)>0.01||Math.abs(got[2]-c)>0.01)
       return {ok:false, msg:'화면은 sin '+r[1]+' · cos '+r[2]+' 입니다.'};
     mem.th=th; mem.s=s; mem.c=c;
     return {ok:true, msg:'기록했습니다 — 이 두 값을 제곱해 더해 봅시다.'};
   }}""",
 """  {t:'생각 — <b>sin² + cos²</b> 을 구하세요',
   f:'sin² = {0} · cos² = {1} · 둘의 합 = {2}',
   chk(got, r, mem){
     if(mem.s===undefined) return {ok:false, msg:'① 칸을 먼저 통과하세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-mem.s*mem.s)>0.02) return {ok:false, msg:'①의 sin 값을 제곱하세요.'};
     if(Math.abs(got[1]-mem.c*mem.c)>0.02) return {ok:false, msg:'①의 cos 값을 제곱하세요.'};
     if(Math.abs(got[2]-1)>0.03) return {ok:false, msg:'두 값을 더해 보세요. 무엇이 나오나요?'};
     mem.ok2=true;
     return {ok:true, msg:'계산했습니다 — 합이 <b>1</b> 입니다. 피타고라스 정리와 같은 말입니다.'};
   }}""",
 """  {t:'판단 — <b>다른 특수각</b>으로 바꿔 sin·cos 를 보고 고르세요',
   f:'새 θ = {0} ° · 그때 sin = {1}',
   opts:['sin²θ + cos²θ = 1 은 <b>어떤 각에서나</b> 성립한다 — 피타고라스 정리를 빗변 1 로 쓴 것이다',
         '특수각에서만 성립하는 우연이다',
         '각이 커지면 합도 커진다'],
   chk(got, r, mem, pick){
     if(!mem.ok2) return {ok:false, msg:'② 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const th=noteNum(r[0]), s=noteNum(r[1]);
     if(Math.abs(th-mem.th)<1) return {ok:false, msg:'각이 그대로입니다 — 다른 각으로 바꾸세요.'};
     if(![0,1].every(j=>isFinite(got[j]))) return {ok:false, msg:'두 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-th)>0.6||Math.abs(got[1]-s)>0.01)
       return {ok:false, msg:'지금은 '+th+'° · sin '+r[1]+' 입니다.'};
     if(pick!==0)
       return {ok:false, msg:'②에서 합이 1 이었습니다. 이 각에서도 구해 보세요. 그리고 다시 고르세요.'};
     return {ok:true, msg:'판단했습니다 — <b>빗변을 1 로 둔 직각삼각형에서 두 변이 sin θ 와 cos θ 입니다.</b> 피타고라스 정리가 곧 sin² + cos² = 1 입니다.'};
   }}""")
 +
 note(55, '내가 읽고 · 내가 어림하고 · 내가 판단한다',
 """  {t:'기록 — 각을 정해 <b>표의 값</b>을 읽어 적으세요',
   f:'θ = {0} ° · sin θ = {1}',
   chk(got, r, mem){
     if(!r) return {ok:false, msg:'아직 화면 값이 없습니다.'};
     const th=noteNum(r[0]), s=noteNum(r[1]);
     if(th<10||th>80) return {ok:false, msg:'각을 10°~80° 사이로 맞추세요.'};
     if(![0,1].every(j=>isFinite(got[j]))) return {ok:false, msg:'두 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-th)>0.6) return {ok:false, msg:'각은 '+th+'° 입니다.'};
     if(Math.abs(got[1]-s)>0.0008) return {ok:false, msg:'sin 값은 '+r[1]+' 입니다.'};
     mem.th=th; mem.s=s;
     return {ok:true, msg:'기록했습니다 — 이제 <b>2° 큰 각</b>의 값도 읽어 봅시다.'};
   }}""",
 """  {t:'생각 — <b>2° 큰 각</b>의 값을 읽고, 두 값의 평균으로 가운데 각을 어림하세요',
   f:'2° 큰 각의 sin = {0} · 두 값의 평균 = {1}',
   chk(got, r, mem){
     if(mem.s===undefined) return {ok:false, msg:'① 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const th=noteNum(r[0]), s=noteNum(r[1]);
     if(Math.abs(th-(mem.th+2))>0.6)
       return {ok:false, msg:'①의 '+mem.th+'° 보다 <b>2° 큰</b> '+(mem.th+2)+'° 로 맞추세요. 지금은 '+th+'° 입니다.'};
     if(![0,1].every(j=>isFinite(got[j]))) return {ok:false, msg:'두 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-s)>0.0008) return {ok:false, msg:'지금 sin 값은 '+r[1]+' 입니다.'};
     if(Math.abs(got[1]-(mem.s+s)/2)>0.0012) return {ok:false, msg:'두 sin 값의 평균을 구하세요.'};
     mem.mid=(mem.s+s)/2; mem.th2=th;
     return {ok:true, msg:'계산했습니다 — 이것이 <b>선형보간</b>으로 어림한 가운데 각의 값입니다.'};
   }}""",
 """  {t:'판단 — 가운데 각(<b>'+'</b>)의 <b>실제 값</b>을 읽어 어림과 견준 뒤 고르세요',
   f:'가운데 각 = {0} ° · 실제 sin = {1} · 어림과의 차 = {2}',
   opts:['곡선을 직선으로 대신했기 때문에 <b>작은 오차</b>가 생긴다 — 구간이 좁을수록 잘 맞는다',
         '선형보간은 언제나 정확하다',
         '선형보간은 쓸모없이 크게 빗나간다'],
   chk(got, r, mem, pick){
     if(mem.mid===undefined) return {ok:false, msg:'② 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const th=noteNum(r[0]), s=noteNum(r[1]);
     if(Math.abs(th-(mem.th+1))>0.6)
       return {ok:false, msg:'가운데 각 '+(mem.th+1)+'° 로 맞추세요. 지금은 '+th+'° 입니다.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-th)>0.6||Math.abs(got[1]-s)>0.0008)
       return {ok:false, msg:'지금은 '+th+'° · sin '+r[1]+' 입니다.'};
     if(Math.abs(got[2]-(mem.mid-s))>0.0015) return {ok:false, msg:'②의 어림값에서 실제 값을 빼세요.'};
     if(pick!==0)
       return {ok:false, msg:'어림과 실제의 차가 '+(mem.mid-s).toFixed(5)+' 로 아주 작습니다. 이 사실을 보고 다시 고르세요.'};
     return {ok:true, msg:'판단했습니다 — <b>곡선을 짧은 구간에서 직선으로 대신한 것</b>이 선형보간입니다. 구간이 좁을수록 오차가 작아집니다 — 옛 항해사들은 이렇게 표 하나로 별을 읽었습니다.'};
   }}""")
 +
 note(56, '내가 끌고 · 내가 나누고 · 내가 판단한다',
 """  {t:'기록 — 점 P 를 원 위에 두고 두 각을 적으세요',
   f:'중심각 = {0} ° · 원주각 = {1} °',
   chk(got, r, mem){
     if(!r) return {ok:false, msg:'아직 화면 값이 없습니다.'};
     const c=noteNum(r[0]), i=noteNum(r[1]);
     if(!(i>3)) return {ok:false, msg:'원주각이 너무 작습니다. 점들을 벌려 보세요.'};
     if(![0,1].every(j=>isFinite(got[j]))) return {ok:false, msg:'두 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-c)>1.2||Math.abs(got[1]-i)>1.2)
       return {ok:false, msg:'화면은 '+r[0]+' 와 '+r[1]+' 입니다.'};
     mem.c=c; mem.i=i;
     return {ok:true, msg:'기록했습니다 — 두 각의 관계를 구해 봅시다.'};
   }}""",
 """  {t:'생각 — <b>중심각 ÷ 원주각</b> 을 구하세요',
   f:'{0} ÷ {1} = {2}',
   chk(got, r, mem){
     if(mem.c===undefined) return {ok:false, msg:'① 칸을 먼저 통과하세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-mem.c)>1.2||Math.abs(got[1]-mem.i)>1.2)
       return {ok:false, msg:'①에 적은 두 각을 그대로 넣으세요.'};
     if(Math.abs(got[2]-mem.c/mem.i)>0.12) return {ok:false, msg:'중심각을 원주각으로 나누세요.'};
     mem.k=mem.c/mem.i;
     return {ok:true, msg:'계산했습니다 — 약 '+mem.k.toFixed(2)+' 입니다. P 를 옮겨도 그대로일까요?'};
   }}""",
 """  {t:'판단 — 점 P 를 <b>멀리 옮긴</b> 뒤 다시 보고 고르세요',
   f:'옮긴 뒤 원주각 = {0} ° · 나눗셈 = {1}',
   opts:['같은 호에 대한 원주각은 <b>어디서 봐도 같고</b>, 중심각의 <b>절반</b>이다',
         'P 를 옮기면 원주각도 함께 커진다',
         '원주각이 중심각의 두 배다'],
   chk(got, r, mem, pick){
     if(mem.k===undefined) return {ok:false, msg:'② 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const i=noteNum(r[1]), k=noteNum(r[2]);
     if(![0,1].every(j=>isFinite(got[j]))) return {ok:false, msg:'두 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-i)>1.2) return {ok:false, msg:'지금 원주각은 '+r[1]+' 입니다.'};
     if(Math.abs(got[1]-k)>0.12) return {ok:false, msg:'지금 나눗셈 값은 '+r[2]+' 입니다.'};
     if(pick!==0)
       return {ok:false, msg:'P 를 옮겼는데도 나눗셈이 '+mem.k.toFixed(2)+' 에서 '+r[2]+' 로 그대로입니다. 이 사실을 보고 다시 고르세요.'};
     return {ok:true, msg:'판단했습니다 — <b>원주각 = 중심각 ÷ 2.</b> 중심과 P 를 이으면 이등변삼각형이 생기고, 외각의 성질로 절반이 나옵니다.'};
   }}""")
 +
 note(57, '내가 올리고 · 내가 계산하고 · 내가 판단한다',
 """  {t:'기록 — 위성을 띄운 뒤 화면의 값을 적으세요',
   f:'OP = {0} · 접선 PA = {1}',
   chk(got, r, mem){
     if(!r) return {ok:false, msg:'아직 화면 값이 없습니다. 위성을 끌어 보세요.'};
     const d=noteNum(r[0]), L=noteNum(r[1]);
     if(!(L>0.2)) return {ok:false, msg:'접선이 생기지 않았습니다. 위성을 원 밖으로 끌어내세요.'};
     if(![0,1].every(j=>isFinite(got[j]))) return {ok:false, msg:'두 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-d)>0.03||Math.abs(got[1]-L)>0.03)
       return {ok:false, msg:'화면은 '+r[0]+' 와 '+r[1]+' 입니다.'};
     mem.d=d; mem.L=L;
     return {ok:true, msg:'기록했습니다 — 이제 피타고라스로 확인해 봅시다.'};
   }}""",
 """  {t:'생각 — <b>OP² − PA²</b> 을 구해 보세요 (그것이 반지름의 제곱입니다)',
   f:'OP² = {0} · PA² = {1} · OP² − PA² = {2}',
   chk(got, r, mem){
     if(mem.d===undefined) return {ok:false, msg:'① 칸을 먼저 통과하세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-mem.d*mem.d)>0.12) return {ok:false, msg:'①의 OP 를 제곱하세요.'};
     if(Math.abs(got[1]-mem.L*mem.L)>0.12) return {ok:false, msg:'①의 PA 를 제곱하세요.'};
     if(Math.abs(got[2]-(mem.d*mem.d-mem.L*mem.L))>0.15) return {ok:false, msg:'두 값을 빼세요.'};
     mem.r2=mem.d*mem.d-mem.L*mem.L;
     return {ok:true, msg:'계산했습니다 — 이 값이 <b>반지름의 제곱</b>입니다. 위성을 옮겨도 그대로일까요?'};
   }}""",
 """  {t:'판단 — 위성을 <b>더 높이</b> 올린 뒤 같은 계산을 하고 고르세요',
   f:'새 OP = {0} · 새 PA = {1} · OP² − PA² = {2}',
   opts:['접점에서 <b>반지름과 접선이 직각</b>이므로 OP² = r² + PA² — 높이가 달라져도 r² 은 그대로다',
         '위성이 높아지면 r² 도 커진다',
         '접선의 길이는 높이와 관계가 없다'],
   chk(got, r, mem, pick){
     if(mem.r2===undefined) return {ok:false, msg:'② 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const d=noteNum(r[0]), L=noteNum(r[1]);
     if(!(d > mem.d + 0.15)) return {ok:false, msg:'아직 OP = '+r[0]+' 입니다. ①의 '+mem.d+' 보다 더 높이 올리세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-d)>0.03||Math.abs(got[1]-L)>0.03)
       return {ok:false, msg:'지금은 '+r[0]+' 와 '+r[1]+' 입니다.'};
     if(Math.abs(got[2]-(d*d-L*L))>0.2) return {ok:false, msg:'OP² − PA² 를 계산하세요.'};
     if(pick!==0)
       return {ok:false, msg:'높이를 올렸는데도 OP² − PA² 가 '+mem.r2.toFixed(2)+' 에서 '+(d*d-L*L).toFixed(2)+' 로 그대로입니다. 이 사실을 보고 다시 고르세요.'};
     return {ok:true, msg:'판단했습니다 — <b>접점에서 직각</b>이기 때문입니다. 그래서 PA = √(OP² − r²) 로 «보이는 거리»를 바로 구할 수 있습니다.'};
   }}""")
 +
 note(58, '내가 옮기고 · 내가 더하고 · 내가 판단한다',
 """  {t:'기록 — 네 점이 <b>모두 원 위</b>에 있을 때 두 합을 적으세요',
   f:'∠A + ∠C = {0} ° · ∠B + ∠D = {1} °',
   chk(got, r, mem){
     if(!r) return {ok:false, msg:'아직 화면 값이 없습니다.'};
     if(String(r[2]).indexOf('아니')>=0||String(r[2]).indexOf('밖')>=0)
       return {ok:false, msg:'점 D 가 원 위에 있지 않습니다 — «'+r[2]+'». 원 위로 옮기세요.'};
     const ac=noteNum(r[0]), bd=noteNum(r[1]);
     if(![0,1].every(j=>isFinite(got[j]))) return {ok:false, msg:'두 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-ac)>1.5||Math.abs(got[1]-bd)>1.5)
       return {ok:false, msg:'화면은 '+r[0]+' 와 '+r[1]+' 입니다.'};
     mem.ac=ac; mem.bd=bd;
     return {ok:true, msg:'기록했습니다 — 두 합이 각각 얼마인가요?'};
   }}""",
 """  {t:'생각 — 두 합을 <b>더해</b> 보세요',
   f:'(∠A+∠C) + (∠B+∠D) = {0} ° · 사각형 네 각의 합과 같으면 1 → {1}',
   chk(got, r, mem){
     if(mem.ac===undefined) return {ok:false, msg:'① 칸을 먼저 통과하세요.'};
     if(![0,1].every(j=>isFinite(got[j]))) return {ok:false, msg:'두 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-(mem.ac+mem.bd))>2) return {ok:false, msg:'①에 적은 두 합을 더하세요.'};
     if(Math.abs(got[1]-1)>0.01) return {ok:false, msg:'사각형 네 각의 합은 360° 입니다. 견주어 보세요.'};
     mem.ok2=true;
     return {ok:true, msg:'계산했습니다 — 둘을 더하면 360°, 그러니 각각은 <b>180°</b> 입니다.'};
   }}""",
 """  {t:'판단 — 점 D 를 <b>원 밖으로</b> 끌어낸 뒤 고르세요',
   f:'그때 ∠A + ∠C = {0} °',
   opts:['네 점이 <b>한 원 위에 있을 때만</b> 마주 보는 두 각의 합이 180° 다',
         '어떤 사각형에서나 마주 보는 두 각의 합은 180° 다',
         '원 밖으로 나가면 네 각의 합도 달라진다'],
   chk(got, r, mem, pick){
     if(!mem.ok2) return {ok:false, msg:'② 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     if(String(r[2]).indexOf('아니')<0&&String(r[2]).indexOf('밖')<0)
       return {ok:false, msg:'아직 «'+r[2]+'» 입니다. D 를 원 밖으로 끌어내세요.'};
     const ac=noteNum(r[0]);
     if(!isFinite(got[0])) return {ok:false, msg:'칸을 채우세요.'};
     if(Math.abs(got[0]-ac)>1.5) return {ok:false, msg:'지금 합은 '+r[0]+' 입니다.'};
     if(pick!==0)
       return {ok:false, msg:'원 위일 때 '+mem.ac.toFixed(0)+'°, 원 밖일 때 '+ac.toFixed(0)+'° 입니다. 이 사실을 보고 다시 고르세요.'};
     return {ok:true, msg:'판단했습니다 — <b>∠A 와 ∠C 는 서로 다른 호에 대한 원주각</b>입니다. 두 호를 합치면 원 전체(360°)이므로 원주각의 합은 그 절반인 180° 가 됩니다.'};
   }}""")
 +
 note(59, '내가 끌고 · 내가 재고 · 내가 판단한다',
 """  {t:'기록 — 값이 <b>아직 이상치가 아닐 때</b> 세 값을 적으세요',
   f:'움직인 값 = {0} · 평균 = {1} · 중앙값 = {2}',
   chk(got, r, mem){
     if(!r) return {ok:false, msg:'아직 화면 값이 없습니다.'};
     if(String(r[1]).indexOf('이상치')>=0)
       return {ok:false, msg:'지금 이미 이상치입니다. 값을 줄여 이상치가 아닌 상태로 만드세요.'};
     const v=noteNum(r[0]), me=noteNum(r[2]), md=noteNum(r[3]);
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-v)>0.6||Math.abs(got[1]-me)>0.3||Math.abs(got[2]-md)>0.6)
       return {ok:false, msg:'화면은 '+v+' · '+me+' · '+md+' 입니다.'};
     mem.v=v; mem.me=me; mem.md=md;
     return {ok:true, msg:'기록했습니다 — 이제 값을 키워 이상치로 만들어 봅시다.'};
   }}""",
 """  {t:'생각 — 값을 키워 <b>이상치</b>로 만든 뒤 두 대푯값의 변화를 구하세요',
   f:'평균의 변화 = {0} · 중앙값의 변화 = {1}',
   chk(got, r, mem){
     if(mem.v===undefined) return {ok:false, msg:'① 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     if(String(r[1]).indexOf('이상치')<0)
       return {ok:false, msg:'아직 «'+r[1]+'» 입니다. 값을 더 키워 이상치로 만드세요.'};
     const me=noteNum(r[2]), md=noteNum(r[3]);
     if(![0,1].every(j=>isFinite(got[j]))) return {ok:false, msg:'두 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-(me-mem.me))>0.4) return {ok:false, msg:'지금 평균에서 ①의 평균을 빼세요.'};
     if(Math.abs(got[1]-(md-mem.md))>0.7) return {ok:false, msg:'지금 중앙값에서 ①의 중앙값을 빼세요.'};
     mem.dme=me-mem.me; mem.dmd=md-mem.md;
     return {ok:true, msg:'계산했습니다 — 평균은 '+mem.dme.toFixed(1)+', 중앙값은 '+mem.dmd.toFixed(1)+' 움직였습니다.'};
   }}""",
 """  {t:'판단 — 두 변화를 견주어 고르세요',
   f:'평균의 변화 = {0} · 중앙값의 변화 = {1}',
   opts:['이상치는 <b>평균을 크게 흔들고</b> 중앙값은 거의 흔들지 못한다 — 평균은 합을 나누기 때문',
         '이상치는 중앙값을 더 크게 흔든다',
         '이상치는 두 대푯값을 똑같이 흔든다'],
   chk(got, r, mem, pick){
     if(mem.dme===undefined) return {ok:false, msg:'② 칸을 먼저 통과하세요.'};
     if(![0,1].every(j=>isFinite(got[j]))) return {ok:false, msg:'두 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-mem.dme)>0.4||Math.abs(got[1]-mem.dmd)>0.7)
       return {ok:false, msg:'②에 적은 '+mem.dme.toFixed(1)+' 과 '+mem.dmd.toFixed(1)+' 을 넣으세요.'};
     if(pick!==0)
       return {ok:false, msg:'평균은 '+mem.dme.toFixed(1)+', 중앙값은 '+mem.dmd.toFixed(1)+' 움직였습니다. 이 사실을 보고 다시 고르세요.'};
     return {ok:true, msg:'판단했습니다 — <b>상자그림은 «상자 길이의 1.5배»라는 규칙으로 이상치를 자동으로 찾아냅니다.</b> 사람 눈이 아니라 기준이 판정하므로 자료가 수백 개여도 됩니다.'};
   }}""")
 +
 note(60, '내가 옮기고 · 내가 견주고 · 내가 판단한다',
 """  {t:'기록 — 이상치를 둔 채 두 상관계수를 적으세요',
   f:'r (포함) = {0} · r (제외) = {1}',
   chk(got, r, mem){
     if(!r) return {ok:false, msg:'아직 화면 값이 없습니다.'};
     if(String(r[0]).indexOf('없음')>=0) return {ok:false, msg:'이상치가 없습니다. 점을 하나 놓아 보세요.'};
     const a=noteNum(r[1]), b=noteNum(r[2]);
     if(![0,1].every(j=>isFinite(got[j]))) return {ok:false, msg:'두 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-a)>0.02||Math.abs(got[1]-b)>0.02)
       return {ok:false, msg:'화면은 '+r[1]+' 과 '+r[2]+' 입니다.'};
     mem.a=a; mem.b=b;
     return {ok:true, msg:'기록했습니다 — 점 하나를 빼고 넣었을 뿐인데 값이 다릅니다.'};
   }}""",
 """  {t:'생각 — 두 값의 <b>차</b>를 구하세요',
   f:'| r(포함) − r(제외) | = {0}',
   chk(got, r, mem){
     if(mem.a===undefined) return {ok:false, msg:'① 칸을 먼저 통과하세요.'};
     if(!isFinite(got[0])) return {ok:false, msg:'칸을 채우세요.'};
     if(Math.abs(got[0]-Math.abs(mem.a-mem.b))>0.03) return {ok:false, msg:'①에 적은 두 값의 차를 절댓값으로 구하세요.'};
     mem.d=Math.abs(mem.a-mem.b);
     return {ok:true, msg:'계산했습니다 — 차가 '+mem.d.toFixed(2)+' 입니다. 더 멀리 보내면 어떻게 될까요?'};
   }}""",
 """  {t:'판단 — 이상치를 <b>더 멀리</b> 보낸 뒤 고르세요',
   f:'그때 r (포함) = {0} · 두 값의 차 = {1}',
   opts:['점 <b>하나</b>가 상관계수를 크게 바꿀 수 있다 — 숫자만 보지 말고 <b>산점도를 함께</b> 봐야 한다',
         '자료가 많으면 점 하나는 영향을 주지 못한다',
         '상관계수만 보면 충분하다'],
   chk(got, r, mem, pick){
     if(mem.d===undefined) return {ok:false, msg:'② 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const a=noteNum(r[1]), b=noteNum(r[2]), d2=Math.abs(a-b);
     if(!(d2 > mem.d + 0.02))
       return {ok:false, msg:'아직 차가 '+d2.toFixed(2)+' 입니다. ②의 '+mem.d.toFixed(2)+' 보다 커지게 더 멀리 보내세요.'};
     if(![0,1].every(j=>isFinite(got[j]))) return {ok:false, msg:'두 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-a)>0.02) return {ok:false, msg:'지금 r(포함)은 '+r[1]+' 입니다.'};
     if(Math.abs(got[1]-d2)>0.03) return {ok:false, msg:'지금 두 값의 차는 '+d2.toFixed(2)+' 입니다.'};
     if(pick!==0)
       return {ok:false, msg:'차가 '+mem.d.toFixed(2)+' 에서 '+d2.toFixed(2)+' 로 커졌습니다. 이 사실을 보고 다시 고르세요.'};
     return {ok:true, msg:'판단했습니다 — <b>r 은 평균에서 멀리 떨어진 점에 크게 끌려갑니다.</b> 그래서 «상관계수가 0.8 이다»만으로는 아무것도 보장되지 않습니다. 반드시 그림을 함께 보아야 합니다.'};
   }}""")
)


def main(path):
    h = open(path, encoding='utf-8').read()
    if 'LESSON[51]=' in h:
        print('이미 반영됨')
        return
    L = (LESSONS.replace('__P51A__', P51A).replace('__P51B__', P51B)
         .replace('__P52__', P52).replace('__T54__', T54).replace('__BOX59__', BOX59))
    a = 'LESSON[356]={'
    assert h.count(a) == 1
    h = h.replace(a, L + a, 1)
    b = '\n};\n\nfunction labNo(spec)'
    assert h.count(b) == 1
    h = h.replace(b, NOTES + b, 1)
    open(path, 'w', encoding='utf-8').write(h)
    sys.stdout.write('LAB 51~60 ok %.2f MB
' % (len(h.encode('utf-8')) / 1048576))


if __name__ == '__main__':
    main(sys.argv[1])
