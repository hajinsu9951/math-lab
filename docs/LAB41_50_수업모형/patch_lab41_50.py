# -*- coding: utf-8 -*-
"""LAB 41~50 — 7단계 수업 모형 + 탐구 노트.

실험 화면은 이미 있는 열 개 데모를 그대로 쓴다 (patch_demo_read.py 로 read() 를 내주게 해 두었다).
「생각 열기」 사진은 실험실당 **한 장**만 붙인다 (patch_openfigs.py).

사용: python docs/LAB41_50_수업모형/patch_lab41_50.py src/40-demos.js
"""
import sys, math

# ── 문제 그림 좌표 계산 ──────────────────────────────────────
# LAB 46 테오도루스의 나선 — 직각삼각형을 이어 붙여 √n 을 만든다
SP = []
x, y, ang = 210.0, 92.0, 0.0
pts = [(x, y)]
UNIT = 30.0
SCALE = 17.0
prev = (x + SCALE * math.sqrt(1), y)
tri = []
for n in range(1, 10):
    r0, r1 = math.sqrt(n), math.sqrt(n + 1)
    a0 = math.atan2(1, math.sqrt(n)) if n == 1 else None
    tri.append(n)
ANGS = [0.0]
for n in range(1, 10):
    ANGS.append(ANGS[-1] + math.degrees(math.atan2(1.0, math.sqrt(n))))
SPIRAL = []
for n in range(1, 11):
    a = math.radians(ANGS[n - 1])
    r = SCALE * math.sqrt(n)
    SPIRAL.append((x + r * math.cos(a), y - r * math.sin(a)))
SP_PATH = ' '.join('%s%.1f %.1f' % ('M' if i == 0 else 'L', px, py)
                   for i, (px, py) in enumerate(SPIRAL))
SP_SPOKES = ''.join('<path d="M%.1f %.1f L%.1f %.1f" stroke="#93B4F7" stroke-width="1"/>'
                    % (x, y, px, py) for px, py in SPIRAL)

# LAB 49 판별식 — y = x² + 2x − k 가 k 에 따라 x축과 만나는 횟수
def para(k, col):
    p = []
    for i in range(41):
        t = -3.4 + 6.8 * i / 40
        v = t * t + 2 * t - k
        p.append('%s%.1f %.1f' % ('M' if i == 0 else 'L', 200 + t * 44, 120 - v * 13))
    return '<path d="%s" stroke="%s" stroke-width="2" fill="none"/>' % (' '.join(p), col)


PAR49 = para(-2.0, '#BE123C') + para(-1.0, '#B45309') + para(2.0, '#0E9384')

# LAB 47 — (100−b)(100+b) 를 넓이로 보는 직사각형
R47 = ''.join('<rect x="%d" y="%d" width="%d" height="%d" rx="2" fill="%s" opacity=".%s" stroke="%s" stroke-width="1.6"/>'
              % v for v in [(60, 46, 150, 84, '#2563EB', '22', '#2563EB'),
                            (210, 46, 30, 84, '#BE123C', '20', '#BE123C'),
                            (60, 130, 150, 18, '#BE123C', '20', '#BE123C')])


LESSONS = """LESSON[41]={
 title:'상대도수 — 크기가 다른 두 집단 비교',
 problem:{
  q:'A반은 <b>10명</b>, B반은 <b>30명</b>입니다. 어떤 문항에 A반 4명, B반 9명이 «그렇다»고 답했습니다. B반 막대가 더 높다고 «B반이 더 그렇다»고 말해도 될까요?',
  svg:`<svg viewBox="0 0 400 170" role="img" aria-label="인원이 다른 두 반의 도수 막대와 상대도수 막대를 견주는 그림">
    <path d="M30 140 H190 M30 140 V26" stroke="#9CA3AF" stroke-width="1.3"/>
    <rect x="52" y="104" width="34" height="36" rx="2" fill="#2563EB" opacity=".55"/>
    <rect x="112" y="59" width="34" height="81" rx="2" fill="#0E9384" opacity=".55"/>
    <text x="110" y="158" font-size="10.5" font-weight="800" fill="#6B7280" text-anchor="middle">사람 수 — B가 훨씬 높다</text>
    <path d="M220 140 H380 M220 140 V26" stroke="#9CA3AF" stroke-width="1.3"/>
    <rect x="242" y="50" width="34" height="90" rx="2" fill="#2563EB" opacity=".55"/>
    <rect x="302" y="73" width="34" height="67" rx="2" fill="#0E9384" opacity=".55"/>
    <text x="300" y="158" font-size="10.5" font-weight="800" fill="#BE123C" text-anchor="middle">비율 — A가 더 높다!</text>
    <text x="200" y="20" font-size="10.5" fill="#6B7280" text-anchor="middle">같은 자료인데 판단이 뒤집힌다 — 무엇을 봐야 하나?</text>
  </svg>`,
  sit:'두 반의 인원을 다르게 두고 도수 막대와 <b>상대도수</b> 막대를 나란히 봅니다. 인원이 다르면 «사람 수»로는 비교할 수 없다는 것을, 봉우리가 어디로 옮겨 가는지로 확인합니다.'
 },
 predict:{
  q:['인원이 3배면 막대도 3배가 됩니다. 이것을 «비교»라고 할 수 있을까요?',
     '크기가 다른 두 집단을 견주려면 무엇으로 바꿔야 할까요?',
     '상대도수를 모두 더하면 얼마가 될지 예상하세요.'] },
 missions:[
  {t:'두 반의 <b>인원</b>을 다르게 해 보세요. 도수 막대가 어떻게 되나요?', re:'인원'},
  {t:'<b>상대도수</b>로 바꿔 보세요. 봉우리가 옮겨 가나요?', re:'상대도수'},
  {t:'아래 <b>탐구 노트</b>로 마무리하세요 — 인원을 <b>기록</b>하고, 상대도수의 합을 <b>확인</b>하고, 무엇으로 비교할지 <b>판단</b>합니다.',
   re:'탐구 노트 통과',
   do:'① 두 반 인원과 봉우리 적기 ② 상대도수의 합 확인하기 ③ 인원 차이를 키워 봉우리가 뒤집히는지 보기',
   hand:'크기가 다른 집단을 비교할 때 왜 상대도수를 써야 하는지 예를 들어 쓰기'}],
 inquiry:{
  id:'rf41', title:'상대도수 — 크기가 다른 두 반을 어떻게 비교할까',
  q:['두 반의 인원을 여러 가지로 바꿔 가며 8줄 이상 기록하세요.',
     '「A반 봉우리」와 「B반 봉우리」 열을 보세요. 도수로 볼 때와 상대도수로 볼 때가 어떻게 다른가요?',
     '상대도수의 합이 늘 1 인 까닭을 손으로 설명하세요.'],
  cols:['보기','A반 인원','B반 인원','A반 봉우리','B반 봉우리','상대도수의 합'],
  hint:'힌트 — 상대도수 = (그 계급의 도수) ÷ (전체 도수). 전체로 나누면 «크기»가 지워집니다.' },
 apply:{
  q:'새 문제 — 40명 중 <b>14명</b>이 «그렇다»고 답했습니다. 상대도수는? (소수 둘째 자리)',
  a:0.35, tol:0.005,
  why:'14 ÷ 40 = 0.35. 상대도수는 전체에 대한 비율이므로 0 과 1 사이의 수입니다.',
  hint:'도수 ÷ 전체.' },
 demo(root){ return relfreqDemo(root); }
};

LESSON[42]={
 title:'통계적 탐구 — 몇 명에게 물어야 하나',
 problem:{
  q:'«우리 학교 학생들은 하루 몇 시간 잘까?»를 알아보려 합니다. 전교생 800명에게 다 물을 수는 없습니다. <b>우리 반 30명</b>만 물어도 될까요? 30명과 200명은 무엇이 다를까요?',
  svg:`<svg viewBox="0 0 400 170" role="img" aria-label="표본이 작을 때와 클 때 평균이 흔들리는 정도를 견주는 그림">
    <path d="M30 96 H370" stroke="#9CA3AF" stroke-width="1.3"/>
    <path d="M200 30 V150" stroke="#BE123C" stroke-width="1.6" stroke-dasharray="5 3"/>
    <text x="204" y="26" font-size="10" font-weight="800" fill="#BE123C">참값</text>
    ${[-62,-38,44,70,-14,26].map((d,i)=>`<circle cx="${200+d}" cy="58" r="4.6" fill="#B45309" opacity=".8"/>`).join('')}
    <text x="34" y="62" font-size="10.5" font-weight="800" fill="#92400E">표본 30명 — 널뛴다</text>
    ${[-12,-6,8,4,-3,11].map((d,i)=>`<circle cx="${200+d}" cy="130" r="4.6" fill="#0E9384" opacity=".8"/>`).join('')}
    <text x="34" y="134" font-size="10.5" font-weight="800" fill="#0B6E63">표본 200명 — 모인다</text>
    <text x="200" y="166" font-size="10.5" fill="#6B7280" text-anchor="middle">표본을 키우면 무엇이 좋아지는가?</text>
  </svg>`,
  sit:'탐구 문제를 고르고 <b>표본 크기</b>를 바꿔 가며 표본을 새로 뽑습니다. 같은 크기로 여러 번 뽑아 보면 <b>평균이 얼마나 널뛰는지</b>가 드러납니다 — 표본이 커질수록 흔들림이 줄어듭니다.'
 },
 predict:{
  q:['우리 반 30명으로 학교 전체를 말할 수 있을까요? 그렇게 생각한 까닭도 적으세요.',
     '표본을 두 배로 키우면 무엇이 좋아질지 예상하세요.',
     '«우리 반»으로만 뽑으면 생길 수 있는 문제를 적어 보세요.'] },
 missions:[
  {t:'표본 크기를 <b>작게</b> 두고 여러 번 새로 뽑아 보세요. 평균이 얼마나 널뛰나요?', re:'표본'},
  {t:'표본 크기를 <b>크게</b> 해 보세요. 이번에는 어떤가요?', re:'평균'},
  {t:'아래 <b>탐구 노트</b>로 마무리하세요 — 작은 표본을 <b>기록</b>하고, 큰 표본과 <b>견주고</b>, 몇 명이 필요한지 <b>판단</b>합니다.',
   re:'탐구 노트 통과',
   do:'① 작은 표본의 크기와 평균 적기 ② 표본을 크게 해 평균 다시 적기 ③ 두 평균의 차를 보고 판단',
   hand:'표본이 커질수록 무엇이 좋아지는지, 그래도 남는 위험은 무엇인지 쓰기'}],
 inquiry:{
  id:'si42', title:'몇 명에게 물어야 할까 — 표본과 오차',
  q:['같은 표본 크기로 여러 번 뽑아 평균을 8줄 이상 기록하세요.',
     '표본 크기를 바꿔 가며 평균이 흔들리는 폭을 견주세요.',
     '표본을 키우면 왜 평균이 안정되는지, 그래도 «편향»은 왜 남는지 손으로 설명하세요.'],
  cols:['탐구 문제','표본 크기','평균','중앙값','표준편차'],
  hint:'힌트 — 표본을 키우면 «우연한 흔들림»은 줄지만, 한쪽으로 치우쳐 뽑으면 아무리 키워도 빗나갑니다.' },
 apply:{
  q:'새 문제 — 표본 크기를 <b>4배</b>로 늘리면 평균의 흔들림(표준오차)은 몇 배가 될까요? (분수로 적어도 됩니다)',
  a:0.5, tol:0.02,
  why:'표준오차는 √n 에 반비례합니다. n 이 4배면 √4 = 2 배로 나뉘어 <b>1/2</b> 이 됩니다.',
  hint:'√n 에 반비례합니다.' },
 demo(root){ return statInqDemo(root); }
};

LESSON[43]={
 title:'일차식의 덧셈 — 같은 것끼리만',
 problem:{
  q:'3x + 2 를 «5x» 라고 쓰면 왜 틀릴까요? 3과 2는 더해지는데 <b>3x와 2</b>는 왜 묶이지 않을까요? 숫자 대신 <b>타일</b>로 바꿔 놓고 보면 답이 보입니다.',
  svg:`<svg viewBox="0 0 400 170" role="img" aria-label="긴 x 타일과 작은 1 타일은 서로 묶이지 않는다는 그림">
    ${[0,1,2].map(i=>`<rect x="${40+i*54}" y="44" width="46" height="26" rx="3" fill="#2563EB" opacity=".55" stroke="#2563EB" stroke-width="1.4"/>`).join('')}
    <text x="122" y="34" font-size="10.5" font-weight="800" fill="#1D4ED8" text-anchor="middle">x 타일 3개</text>
    ${[0,1].map(i=>`<rect x="${226+i*30}" y="52" width="22" height="18" rx="3" fill="#B45309" opacity=".55" stroke="#B45309" stroke-width="1.4"/>`).join('')}
    <text x="264" y="34" font-size="10.5" font-weight="800" fill="#92400E" text-anchor="middle">1 타일 2개</text>
    <text x="200" y="104" font-size="12" font-weight="800" fill="#BE123C" text-anchor="middle">길이가 다른 타일은 한 줄로 묶이지 않는다</text>
    <text x="200" y="134" font-size="11" fill="#6B7280" text-anchor="middle">3x + 2 는 3x + 2 일 뿐 — 5x 가 아니다</text>
  </svg>`,
  sit:'타일을 끌어다 놓으면 <b>x 항</b>과 <b>상수항</b>이 따로 모입니다. 정리한 식과 원래 식에 <b>x = 2</b> 를 넣어 값이 같은지 확인하면, 정리가 «값을 바꾸지 않는 일»임을 알 수 있습니다.'
 },
 predict:{
  q:['3x + 2 를 더 간단히 할 수 있을까요? 그렇게 생각한 까닭도 적으세요.',
     '«같은 것끼리 묶는다»에서 «같은 것»이란 무엇일까요?',
     '식을 정리하면 값이 달라질까요?'] },
 missions:[
  {t:'타일을 끌어 <b>x 항</b>과 <b>상수항</b>을 각각 모아 보세요.', re:'항'},
  {t:'정리한 식과 원래 식에 <b>x = 2</b> 를 넣어 값을 견주어 보세요.', re:'x=2'},
  {t:'아래 <b>탐구 노트</b>로 마무리하세요 — 두 합을 <b>기록</b>하고, 두 값을 <b>견주고</b>, 왜 묶이지 않는지 <b>판단</b>합니다.',
   re:'탐구 노트 통과',
   do:'① x 항의 합과 상수항의 합 적기 ② x=2 일 때 원래 식과 정리한 식의 값 적기 ③ 두 값이 같은지 보고 판단',
   hand:'3x 와 2 가 왜 묶이지 않는지 타일 그림으로 설명하기'}],
 inquiry:{
  id:'le43', title:'같은 것끼리만 묶인다 — 일차식의 덧셈',
  q:['여러 식을 만들어 가며 8줄 이상 기록하세요.',
     '「x=2 원래 식」과 「x=2 정리한 식」 열을 견주세요. 언제나 같은가요?',
     '3x + 2 를 5x 라고 쓰면 왜 틀리는지 <b>x 에 수를 넣어</b> 손으로 보이세요.'],
  cols:['문제','x 항의 합','상수항의 합','정리한 식','x=2 원래 식','x=2 정리한 식'],
  hint:'힌트 — 정리는 «모양을 바꾸는 일»이지 «값을 바꾸는 일»이 아닙니다. 값이 달라졌다면 잘못 묶은 것입니다.' },
 apply:{
  q:'새 문제 — <b>5x − 3 + 2x + 8</b> 을 정리했을 때 <b>상수항</b>은?',
  a:5, tol:0.1,
  why:'x 항은 5x + 2x = 7x, 상수항은 −3 + 8 = 5. 정리하면 7x + 5 입니다.',
  hint:'숫자끼리만 더하세요.' },
 demo(root){ return linexprDemo(root); }
};

LESSON[44]={
 title:'그래프 해석 — 이 그래프는 무슨 이야기일까',
 problem:{
  q:'시간–거리 그래프에서 <b>평평한 구간</b>을 보았습니다. 이것은 «멈춰 있었다»일까요, 아니면 «같은 자리로 돌아왔다»일까요? 그래프 하나가 들려주는 <b>이야기</b>를 어떻게 읽어야 할까요?',
  svg:`<svg viewBox="0 0 400 170" role="img" aria-label="올라가다 평평해지고 다시 0으로 내려오는 시간 거리 그래프">
    <path d="M36 142 H382 M36 142 V22" stroke="#9CA3AF" stroke-width="1.3"/>
    <path d="M36 142 L110 70 L190 70 L262 34 L330 142" stroke="#2563EB" stroke-width="2.6" fill="none"/>
    <path d="M110 70 H190" stroke="#B45309" stroke-width="4"/>
    <text x="150" y="60" font-size="10" font-weight="800" fill="#92400E" text-anchor="middle">평평한 구간</text>
    <circle cx="330" cy="142" r="4.6" fill="#BE123C"/>
    <text x="336" y="136" font-size="10" font-weight="800" fill="#BE123C">0 으로 복귀</text>
    <text x="378" y="158" font-size="9.5" fill="#6B7280" text-anchor="end">시간 →</text>
    <text x="40" y="18" font-size="9.5" fill="#6B7280">거리</text>
    <text x="200" y="166" font-size="10.5" fill="#6B7280" text-anchor="middle">평평한 구간은 멈춘 것인가, 돌아온 것인가?</text>
  </svg>`,
  sit:'이야기를 고르고 <b>그래프를 직접 그립니다.</b> 그린 그래프가 이야기와 얼마나 어긋나는지 «평균 어긋남»으로 표시되고, «평평한 구간»과 «0 복귀»를 제대로 넣었는지 따로 확인해 줍니다.'
 },
 predict:{
  q:['시간–거리 그래프에서 평평한 구간은 무엇을 뜻할지 적으세요.',
     '«집으로 돌아왔다»는 그래프에서 어떻게 나타날까요?',
     '그래프가 «아래로 내려간다»는 것은 무슨 뜻일까요?'] },
 missions:[
  {t:'이야기를 고르고 그래프를 <b>직접 그려</b> 보세요. 어긋남이 얼마나 되나요?', re:'어긋남'},
  {t:'<b>평평한 구간</b>과 <b>0 복귀</b> 를 넣어 보세요.', re:'평평'},
  {t:'아래 <b>탐구 노트</b>로 마무리하세요 — 어긋남을 <b>기록</b>하고, 고쳐 그려 <b>줄이고</b>, 두 특징을 넣었는지 <b>판단</b>합니다.',
   re:'탐구 노트 통과',
   do:'① 지금 그린 칸 수와 평균 어긋남 적기 ② 고쳐 그려 어긋남을 줄이기 ③ 평평한 구간과 0 복귀를 넣었는지 확인',
   hand:'평평한 구간이 «멈춤»을 뜻하는 까닭을 기울기로 설명하기'}],
 inquiry:{
  id:'co44', title:'이 그래프는 무슨 이야기일까',
  q:['이야기를 바꿔 가며 그려 보고 8줄 이상 기록하세요.',
     '「평평한 구간 넣었나」와 「0 복귀 넣었나」 열을 보세요. 어긋남과 어떤 관계가 있나요?',
     '시간–거리 그래프에서 «기울기»가 무엇을 뜻하는지 손으로 정리하세요.'],
  cols:['이야기','그린 칸 수','평균 어긋남','평평한 구간 넣었나','0 복귀 넣었나'],
  hint:'힌트 — 기울기는 «시간당 거리의 변화», 곧 속도입니다. 기울기가 0 이면 속도가 0 입니다.' },
 apply:{
  q:'새 문제 — 시간–거리 그래프에서 기울기가 <b>0</b> 인 구간의 속도는 얼마일까요?',
  a:0, tol:0.05,
  why:'기울기 = 거리의 변화 ÷ 시간의 변화 = 속도. 기울기가 0 이면 거리가 변하지 않으므로 속도는 0, 즉 멈춰 있습니다.',
  hint:'기울기가 곧 속도입니다.' },
 demo(root){ return coordDemo(root); }
};

LESSON[45]={
 title:'제곱근 — √2 + √3 은 √5 가 아니다',
 problem:{
  q:'√4 + √9 = 2 + 3 = 5 인데 √13 은 5 가 아닙니다. 그런데도 많은 사람이 <b>√2 + √3 = √5</b> 라고 씁니다. 근호끼리는 왜 더하지 못할까요? 길이로 <b>직접 이어 붙여</b> 확인해 봅시다.',
  svg:`<svg viewBox="0 0 400 170" role="img" aria-label="루트2와 루트3을 이어붙인 길이와 루트5를 견주는 그림">
    <path d="M40 66 h84" stroke="#2563EB" stroke-width="7" stroke-linecap="round"/>
    <path d="M124 66 h103" stroke="#0E9384" stroke-width="7" stroke-linecap="round"/>
    <text x="82" y="52" font-size="10.5" font-weight="800" fill="#1D4ED8" text-anchor="middle">√2 ≈ 1.414</text>
    <text x="176" y="52" font-size="10.5" font-weight="800" fill="#0B6E63" text-anchor="middle">√3 ≈ 1.732</text>
    <text x="238" y="70" font-size="10.5" font-weight="800" fill="#111827">= 3.146</text>
    <path d="M40 118 h133" stroke="#BE123C" stroke-width="7" stroke-linecap="round"/>
    <text x="106" y="106" font-size="10.5" font-weight="800" fill="#BE123C" text-anchor="middle">√5 ≈ 2.236</text>
    <path d="M173 112 V124 M227 112 V124" stroke="#111827" stroke-width="1.4"/>
    <text x="200" y="140" font-size="10" font-weight="800" fill="#111827" text-anchor="middle">이만큼 모자란다</text>
    <text x="200" y="162" font-size="10.5" fill="#6B7280" text-anchor="middle">길이를 직접 이어 붙여 보면 답이 보인다</text>
  </svg>`,
  sit:'√2 와 √3 의 길이를 <b>직접 끌어 이어 붙이고</b>, 그 옆에 √5 를 놓아 견줍니다. 눈으로 보면 «같지 않다»가 분명해지고, 수로 재면 얼마나 차이 나는지도 알 수 있습니다.'
 },
 predict:{
  q:['√2 + √3 과 √5 중 어느 쪽이 클지 예상하고 까닭도 적으세요.',
     '√4 + √9 = √13 일까요? 계산해 보세요.',
     '근호끼리 더할 수 있는 경우는 언제일지 적어 보세요.'] },
 missions:[
  {t:'√2 와 √3 을 <b>이어 붙여</b> 보세요. 길이가 얼마인가요?', re:'√'},
  {t:'그 길이를 <b>√5</b> 와 견주어 보세요. 같은가요?', re:'같'},
  {t:'아래 <b>탐구 노트</b>로 마무리하세요 — 두 길이를 <b>기록</b>하고, 차를 <b>계산</b>하고, 규칙을 <b>판단</b>합니다.',
   re:'탐구 노트 통과',
   do:'① 이어붙인 길이와 √(a+b) 적기 ② 두 값의 차 구하기 ③ 다른 a·b 로 바꿔 늘 그런지 확인',
   hand:'√a + √b ≠ √(a+b) 임을 길이 그림으로 설명하고, 언제 같아지는지도 적기'}],
 inquiry:{
  id:'sq45', title:'√2 + √3 은 √5 일까',
  q:['a 와 b 를 바꿔 가며 8줄 이상 기록하세요.',
     '「이어붙인 길이」와 「√(a+b)」 열을 견주세요. 언제나 어느 쪽이 큰가요?',
     '√a + √b 와 √(a+b) 의 대소를 <b>제곱해서</b> 손으로 비교하세요.'],
  cols:['√a','√b','이어붙인 길이','√(a+b)','같은가'],
  hint:'힌트 — 양변을 제곱해 보세요. (√a + √b)² = a + b + 2√(ab) 입니다. 2√(ab) 가 남습니다.' },
 apply:{
  q:'새 문제 — <b>√9 + √16</b> 의 값은?',
  a:7, tol:0.05,
  why:'√9 + √16 = 3 + 4 = 7. √25 = 5 와 다릅니다 — 근호는 따로 계산해 더해야 합니다.',
  hint:'각각의 근호를 먼저 푸세요.' },
 demo(root){ return sqrtAddDemo(root); }
};

LESSON[46]={
 title:'테오도루스의 나선 — √n 은 어디에 있나',
 problem:{
  q:'√2 는 «1.414…» 라고 배웁니다. 그런데 그 수는 수직선 <b>정확히 어디</b>에 있을까요? 소수로는 끝없이 이어지는데, <b>자와 컴퍼스</b>만으로 그 자리를 찍을 수 있을까요?',
  svg:`<svg viewBox="0 0 400 170" role="img" aria-label="직각삼각형을 이어 붙여 루트 n 을 만드는 테오도루스의 나선">
    __SPOKES__
    <path d="__SPIRAL__" stroke="#2563EB" stroke-width="2" fill="none"/>
    <circle cx="210" cy="92" r="3.4" fill="#111827"/>
    <text x="200" y="20" font-size="10.5" fill="#6B7280" text-anchor="middle">직각삼각형을 이어 붙이면 √2 · √3 · √4 … 가 차례로 나온다</text>
    <text x="200" y="164" font-size="10.5" fill="#6B7280" text-anchor="middle">빗변의 길이를 수직선에 눕히면 그 자리가 √n 이다</text>
  </svg>`,
  sit:'직각을 낀 두 변이 <b>√n 과 1</b> 인 삼각형을 이어 붙이면 빗변이 <b>√(n+1)</b> 이 됩니다. 그 빗변을 <b>수직선에 눕혀</b> √n 의 자리를 정확히 찍습니다 — 근삿값이 아니라 «바로 그 점»입니다.'
 },
 predict:{
  q:['√2 를 자와 컴퍼스로 정확히 그릴 수 있을까요? 그렇게 생각한 까닭도 적으세요.',
     '빗변이 √(n+1) 이 되는 까닭을 피타고라스 정리로 설명해 보세요.',
     '√4 · √9 처럼 자연수가 되는 n 은 나선에서 어떻게 보일지 예상하세요.'] },
 missions:[
  {t:'삼각형을 이어 붙여 <b>n 을 늘려</b> 보세요. 빗변이 어떻게 되나요?', re:'√'},
  {t:'빗변을 <b>수직선에 눕혀</b> 보세요. 어디에 닿나요?', re:'눕'},
  {t:'아래 <b>탐구 노트</b>로 마무리하세요 — 지금 n 을 <b>기록</b>하고, 근삿값을 <b>계산</b>하고, 자연수가 되는 n 을 <b>판단</b>합니다.',
   re:'탐구 노트 통과',
   do:'① 지금 n 과 근삿값 적기 ② 그 값을 제곱해 n 이 되는지 확인 ③ 자연수가 되는 n 을 찾아 적기',
   hand:'빗변이 √(n+1) 이 되는 까닭을 피타고라스 정리로 설명하기'}],
 inquiry:{
  id:'sp46', title:'√2 의 정확한 자리 — 테오도루스의 나선',
  q:['n 을 1부터 늘려 가며 모두 기록하세요.',
     '「자연수인가」 열을 보세요. 어떤 n 에서 자연수가 되나요?',
     '무리수를 «자와 컴퍼스로 정확히 찍을 수 있다»는 것이 무슨 뜻인지 손으로 설명하세요.'],
  cols:['n','빗변 √n','근삿값','자연수인가','눕힘'],
  hint:'힌트 — 소수로는 끝이 없지만, 길이로는 «한 점»입니다. 근삿값과 «그 수 자체»는 다릅니다.' },
 apply:{
  q:'새 문제 — 직각을 낀 두 변이 <b>√7</b> 과 <b>1</b> 인 직각삼각형의 빗변의 길이는? (√ 안의 수만 적으세요)',
  a:8, tol:0.1,
  why:'빗변² = (√7)² + 1² = 7 + 1 = 8 이므로 빗변은 √8 입니다.',
  hint:'피타고라스 정리에 그대로 넣으세요.' },
 demo(root){ return spiralDemo(root); }
};

LESSON[47]={
 title:'인수분해로 암산하기 — 99 × 101',
 problem:{
  q:'<b>99 × 101</b> 을 3초 안에 계산할 수 있을까요? 세로셈으로는 어렵지만, 두 수를 <b>100 − 1</b> 과 <b>100 + 1</b> 로 보면 순식간입니다. 무슨 일이 일어나는 걸까요?',
  svg:`<svg viewBox="0 0 400 170" role="img" aria-label="100 곱하기 100 에서 b 곱하기 b 를 덜어 내는 넓이 그림">
    __R47__
    <text x="135" y="94" font-size="12" font-weight="800" fill="#1D4ED8" text-anchor="middle">(100−b)(100+b)</text>
    <text x="225" y="94" font-size="10" font-weight="800" fill="#BE123C" text-anchor="middle">b</text>
    <text x="135" y="144" font-size="10" font-weight="800" fill="#BE123C" text-anchor="middle">b</text>
    <text x="300" y="70" font-size="12" font-weight="800" fill="#111827">100² − b²</text>
    <text x="300" y="96" font-size="11" fill="#6B7280">= 10000 − b²</text>
    <text x="200" y="164" font-size="10.5" fill="#6B7280" text-anchor="middle">더 큰 정사각형에서 작은 정사각형을 덜어 낸 것</text>
  </svg>`,
  sit:'b 를 바꾸면 <b>(100 − b)</b> 와 <b>(100 + b)</b> 의 곱이 계산되고, <b>10000 − b²</b> 와 나란히 표시됩니다. 두 값이 늘 같은지 — 그리고 그 까닭이 넓이 그림에서 어떻게 보이는지 확인합니다.'
 },
 predict:{
  q:['99 × 101 을 암산으로 구해 보고, 어떻게 구했는지 적으세요.',
     '(100 − b)(100 + b) 를 전개하면 무엇이 남을지 예상하세요.',
     '98 × 102 도 같은 방법으로 될까요?'] },
 missions:[
  {t:'b 를 바꿔 가며 <b>곱</b>과 <b>10000 − b²</b> 를 견주어 보세요.', re:'곱'},
  {t:'b 를 크게 해 보세요. 그래도 두 값이 같은가요?', re:'10000'},
  {t:'아래 <b>탐구 노트</b>로 마무리하세요 — 지금 b 를 <b>기록</b>하고, 두 값을 <b>계산</b>해 견주고, 다른 b 로 <b>판단</b>합니다.',
   re:'탐구 노트 통과',
   do:'① 지금 b 와 두 인수 적기 ② 곱과 10000 − b² 를 각각 구해 견주기 ③ 다른 b 로 바꿔 늘 같은지 확인',
   hand:'(a + b)(a − b) = a² − b² 를 넓이 그림으로 설명하기'}],
 inquiry:{
  id:'me47', title:'99 × 101 을 3초에 — 합차 공식',
  q:['b 를 바꿔 가며 8줄 이상 기록하세요.',
     '「곱」 열과 「10000 − 곱」 열을 보세요. 무엇이 규칙인가요?',
     '(a + b)(a − b) = a² − b² 를 <b>넓이 그림</b>으로 손으로 설명하세요.'],
  cols:['b','100−b','100+b','곱','10000 − 곱'],
  hint:'힌트 — 큰 정사각형(100×100)에서 작은 정사각형(b×b)을 덜어 낸 모양을 떠올리세요.' },
 apply:{
  q:'새 문제 — <b>97 × 103</b> 을 합차 공식으로 계산하면?',
  a:9991, tol:0.5,
  why:'97 × 103 = (100 − 3)(100 + 3) = 10000 − 9 = 9991.',
  hint:'가운데 수 100 을 찾고, 떨어진 만큼을 제곱해 빼세요.' },
 demo(root){ return mentalDemo(root); }
};

LESSON[48]={
 title:'근의 공식 — 해는 어디서 오는가',
 problem:{
  q:'이차방정식의 해를 구할 때 우리는 <b>근의 공식</b>을 외워 씁니다. 그런데 그 공식은 어디서 나왔을까요? 그리고 공식으로 구한 두 근은 <b>그래프의 어디</b>에 있을까요?',
  svg:`<svg viewBox="0 0 400 170" role="img" aria-label="포물선이 x축과 만나는 두 점이 두 근임을 보여 주는 그림">
    <path d="M30 120 H380 M200 24 V152" stroke="#9CA3AF" stroke-width="1.3"/>
    <path d="M92 32 Q200 196 308 32" stroke="#2563EB" stroke-width="2.6" fill="none"/>
    <circle cx="126" cy="120" r="5" fill="#BE123C"/>
    <circle cx="274" cy="120" r="5" fill="#BE123C"/>
    <text x="126" y="142" font-size="10.5" font-weight="800" fill="#BE123C" text-anchor="middle">근 1</text>
    <text x="274" y="142" font-size="10.5" font-weight="800" fill="#BE123C" text-anchor="middle">근 2</text>
    <text x="200" y="20" font-size="10.5" fill="#6B7280" text-anchor="middle">x축과 만나는 두 점 — 그것이 두 근이다</text>
  </svg>`,
  sit:'계수를 바꿔 포물선을 움직이고, <b>근이라고 생각하는 자리를 직접 찍은 뒤</b> 근의 공식으로 검산합니다. 「두 근의 합」과 「곱」이 계수와 어떤 관계인지도 함께 드러납니다.'
 },
 predict:{
  q:['이차방정식의 해는 그래프에서 어디에 있을지 예상하세요.',
     '두 근을 더하면 계수와 어떤 관계가 있을지 적어 보세요.',
     '근이 하나뿐이거나 없는 경우는 그래프가 어떤 모양일까요?'] },
 missions:[
  {t:'계수를 바꿔 포물선을 움직이고 <b>근을 직접 찍어</b> 보세요.', re:'근'},
  {t:'근의 공식으로 <b>검산</b>해 보세요. 맞았나요?', re:'합'},
  {t:'아래 <b>탐구 노트</b>로 마무리하세요 — 두 근을 <b>기록</b>하고, 합과 곱을 <b>계산</b>하고, 계수와의 관계를 <b>판단</b>합니다.',
   re:'탐구 노트 통과',
   do:'① 두 근 적기 ② 두 근의 합과 곱 구하기 ③ 계수를 바꿔 같은 관계가 유지되는지 확인',
   hand:'근과 계수의 관계를 식으로 쓰고, 근의 공식이 완전제곱에서 나온 것임을 정리하기'}],
 inquiry:{
  id:'qr48', title:'근을 찍고 공식으로 검산',
  q:['계수를 바꿔 가며 두 근과 그 합·곱을 8줄 이상 기록하세요.',
     '「합」 열과 「곱」 열을 계수와 견주어 규칙을 찾으세요.',
     '근과 계수의 관계를 손으로 쓰고, 왜 그런지 설명하세요.'],
  cols:['식','근 1','근 2','합','곱'],
  hint:'힌트 — x² + bx + c = (x − α)(x − β) 로 인수분해하면 전개했을 때 b 와 c 가 무엇이 되나요?' },
 apply:{
  q:'새 문제 — <b>x² − 7x + 12 = 0</b> 의 두 근의 <b>합</b>은?',
  a:7, tol:0.1,
  why:'두 근의 합 = −b = 7 (두 근은 3 과 4 이고 3 + 4 = 7).',
  hint:'x² + bx + c 에서 두 근의 합은 −b 입니다.' },
 demo(root){ return quadRootDemo(root); }
};

LESSON[49]={
 title:'판별식 — 풀기 전에 해의 개수를 안다',
 problem:{
  q:'이차방정식을 <b>풀지 않고도</b> 해가 몇 개인지 알 수 있을까요? 포물선이 x축과 <b>두 번 만나는지·한 번 스치는지·아예 안 만나는지</b>를 미리 가려내는 수 하나가 있습니다.',
  svg:`<svg viewBox="0 0 400 170" role="img" aria-label="k 값에 따라 포물선이 x축과 두 번 만나거나 스치거나 만나지 않는 그림">
    <path d="M20 120 H384" stroke="#9CA3AF" stroke-width="1.4"/>
    __PAR49__
    <text x="376" y="42" font-size="10" font-weight="800" fill="#0B6E63" text-anchor="end">D &gt; 0 — 두 점</text>
    <text x="376" y="60" font-size="10" font-weight="800" fill="#92400E" text-anchor="end">D = 0 — 한 점</text>
    <text x="376" y="78" font-size="10" font-weight="800" fill="#BE123C" text-anchor="end">D &lt; 0 — 없음</text>
    <text x="200" y="164" font-size="10.5" fill="#6B7280" text-anchor="middle">풀지 않고 개수만 먼저 아는 방법</text>
  </svg>`,
  sit:'k 를 끌어 포물선을 위아래로 움직이면 <b>D = 4 + 4k</b> 가 함께 계산되고, 부호와 <b>x축과의 교점 수</b> 가 나란히 표시됩니다. 부호가 바뀌는 순간 교점 수가 어떻게 달라지는지 직접 보게 됩니다.'
 },
 predict:{
  q:['포물선이 x축과 만나지 않으면 해는 몇 개일까요?',
     '«한 점에서 스친다»는 것은 해가 몇 개라는 뜻일까요?',
     'D 의 부호와 해의 개수가 어떻게 이어질지 예상하세요.'] },
 missions:[
  {t:'k 를 바꿔 <b>D 의 부호</b>가 바뀌는 자리를 찾아보세요.', re:'D'},
  {t:'D = 0 이 되는 자리를 정확히 맞춰 보세요. 교점은 몇 개인가요?', re:'1개'},
  {t:'아래 <b>탐구 노트</b>로 마무리하세요 — D 를 <b>기록</b>하고, 부호를 <b>계산</b>하고, 개수와의 관계를 <b>판단</b>합니다.',
   re:'탐구 노트 통과',
   do:'① 지금 k 와 D 적기 ② D 의 부호와 교점 수 확인 ③ 부호가 반대가 되게 k 를 바꿔 다시 보기',
   hand:'D 의 부호와 해의 개수의 관계를 표로 정리하고, 왜 그런지 근의 공식으로 설명하기'}],
 inquiry:{
  id:'di49', title:'풀기 전에 개수를 안다 — 판별식',
  q:['k 를 바꿔 가며 8줄 이상 기록하세요. 부호가 바뀌는 경계를 반드시 포함하세요.',
     '「부호」 열과 「교점 수」 열을 견주어 규칙을 찾으세요.',
     'D = b² − 4ac 의 부호가 왜 해의 개수를 정하는지 <b>근의 공식</b>으로 손으로 설명하세요.'],
  cols:['k','D = 4+4k','부호','교점 수'],
  hint:'힌트 — 근의 공식에서 √ 안에 들어가는 것이 D 입니다. 음수의 제곱근은 실수 범위에 없습니다.' },
 apply:{
  q:'새 문제 — <b>x² − 6x + 9 = 0</b> 의 판별식 D 의 값은?',
  a:0, tol:0.1,
  why:'D = b² − 4ac = (−6)² − 4·1·9 = 36 − 36 = 0. 해가 <b>하나</b>(중근)입니다.',
  hint:'D = b² − 4ac 에 그대로 넣으세요.' },
 demo(root){ return discrimDemo(root); }
};

LESSON[50]={
 title:'완전제곱식 — 근의 공식은 어디서 왔나',
 problem:{
  q:'x² + 6x 를 <b>정사각형</b>으로 만들려면 무엇을 더해야 할까요? 이 «구멍 채우기»가 바로 근의 공식을 만들어 낸 방법입니다. 얼마를 채워야 딱 맞을까요?',
  svg:`<svg viewBox="0 0 400 170" role="img" aria-label="x 제곱과 직사각형 두 개에 작은 정사각형을 채워 완전제곱을 만드는 그림">
    <rect x="60" y="34" width="76" height="76" rx="3" fill="#2563EB" opacity=".3" stroke="#2563EB" stroke-width="1.6"/>
    <text x="98" y="78" font-size="13" font-weight="800" fill="#1D4ED8" text-anchor="middle">x²</text>
    <rect x="136" y="34" width="34" height="76" rx="3" fill="#0E9384" opacity=".3" stroke="#0E9384" stroke-width="1.6"/>
    <text x="153" y="78" font-size="11" font-weight="800" fill="#0B6E63" text-anchor="middle">3x</text>
    <rect x="60" y="110" width="76" height="34" rx="3" fill="#0E9384" opacity=".3" stroke="#0E9384" stroke-width="1.6"/>
    <text x="98" y="132" font-size="11" font-weight="800" fill="#0B6E63" text-anchor="middle">3x</text>
    <rect x="136" y="110" width="34" height="34" rx="3" fill="#BE123C" opacity=".22" stroke="#BE123C" stroke-width="1.8" stroke-dasharray="4 3"/>
    <text x="153" y="132" font-size="11" font-weight="800" fill="#BE123C" text-anchor="middle">?</text>
    <text x="250" y="66" font-size="12" font-weight="800" fill="#111827">x² + 6x + ?</text>
    <text x="250" y="92" font-size="12" font-weight="800" fill="#BE123C">= (x + 3)²</text>
    <text x="200" y="164" font-size="10.5" fill="#6B7280" text-anchor="middle">구멍의 한 변은 얼마인가 — 그 넓이가 채울 수</text>
  </svg>`,
  sit:'b 를 바꾸면 <b>b/2</b> 와 <b>(b/2)²</b> 이 계산되고, 그림의 «구멍»이 함께 바뀝니다. 구멍을 채우는 순간 식이 <b>(x + b/2)²</b> 으로 접히는 것을 눈으로 확인합니다.'
 },
 predict:{
  q:['x² + 6x 를 정사각형으로 만들려면 얼마를 더해야 할지 예상하세요.',
     '그 수가 b 와 어떤 관계인지 적어 보세요.',
     '이 방법으로 x² + bx + c = 0 을 풀면 무엇이 나올지 예상하세요.'] },
 missions:[
  {t:'b 를 바꿔 가며 <b>(b/2)²</b> 이 어떻게 변하는지 보세요.', re:'b/2'},
  {t:'구멍을 채워 <b>완전제곱식</b>을 완성해 보세요.', re:'완성'},
  {t:'아래 <b>탐구 노트</b>로 마무리하세요 — b 를 <b>기록</b>하고, 채울 수를 <b>계산</b>하고, 식이 접히는지 <b>판단</b>합니다.',
   re:'탐구 노트 통과',
   do:'① 지금 b 와 b/2 적기 ② 채워야 할 수 (b/2)² 구하기 ③ 구멍을 채워 완전제곱식이 되는지 확인',
   hand:'x² + bx + (b/2)² = (x + b/2)² 를 넓이 그림으로 설명하고, 근의 공식으로 잇기'}],
 inquiry:{
  id:'cq50', title:'구멍을 채워라 — 완전제곱식',
  q:['b 를 바꿔 가며 8줄 이상 기록하세요.',
     '「b/2」 열과 「구멍 (b/2)²」 열을 보세요. b 와 어떤 관계인가요?',
     'x² + bx + (b/2)² = (x + b/2)² 를 <b>넓이 그림</b>으로 손으로 설명하세요.'],
  cols:['b','b/2','구멍 (b/2)²','완성식'],
  hint:'힌트 — bx 를 반으로 갈라 두 변에 붙이면, 남는 구석의 한 변이 b/2 입니다.' },
 apply:{
  q:'새 문제 — <b>x² + 10x + ?</b> 가 완전제곱식이 되려면 ? 에 들어갈 수는?',
  a:25, tol:0.1,
  why:'(b/2)² = (10/2)² = 5² = 25. 그러면 x² + 10x + 25 = (x + 5)² 입니다.',
  hint:'b 를 반으로 나눈 뒤 제곱하세요.' },
 demo(root){ return complSqDemo(root); }
};

"""


def note(no, head, c1, c2, c3):
    return "\n %d:{ h:'%s',\n  c:[\n%s,\n%s,\n%s\n ]},\n" % (no, head, c1, c2, c3)


NOTES = (
 note(41, '내가 세고 · 내가 비율로 바꾸고 · 내가 판단한다',
 """  {t:'기록 — 두 반의 인원을 <b>다르게</b> 두고 화면의 값을 적으세요',
   f:'A반 인원 = {0} · B반 인원 = {1} · 상대도수의 합 = {2}',
   chk(got, r, mem){
     if(!r) return {ok:false, msg:'아직 화면 값이 없습니다.'};
     const a=noteNum(r[1]), b=noteNum(r[2]), s=noteNum(r[5]);
     if(Math.abs(a-b)<3) return {ok:false, msg:'두 반 인원이 '+a+' 과 '+b+' 로 비슷합니다. 차이를 크게 하세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-a)>0.5||Math.abs(got[1]-b)>0.5)
       return {ok:false, msg:'화면은 '+a+'명 과 '+b+'명 입니다.'};
     if(Math.abs(got[2]-s)>0.05) return {ok:false, msg:'상대도수의 합은 '+r[5]+' 입니다.'};
     mem.a=a; mem.b=b;
     return {ok:true, msg:'기록했습니다 — 상대도수를 모두 더하면 늘 1 입니다.'};
   }}""",
 """  {t:'생각 — 인원이 다른 두 반에서 같은 «도수 4명»이 <b>각각 몇 %</b> 인지 구하세요',
   f:'4 ÷ A반 인원 = {0} % · 4 ÷ B반 인원 = {1} %',
   chk(got, r, mem){
     if(mem.a===undefined) return {ok:false, msg:'① 칸을 먼저 통과하세요.'};
     if(![0,1].every(j=>isFinite(got[j]))) return {ok:false, msg:'두 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-400/mem.a)>1.5) return {ok:false, msg:'4 를 A반 인원 '+mem.a+' 으로 나눈 뒤 100 을 곱하세요.'};
     if(Math.abs(got[1]-400/mem.b)>1.5) return {ok:false, msg:'4 를 B반 인원 '+mem.b+' 으로 나눈 뒤 100 을 곱하세요.'};
     mem.ok2=true;
     return {ok:true, msg:'계산했습니다 — <b>같은 4명</b>인데 비율은 전혀 다릅니다.'};
   }}""",
 """  {t:'판단 — 인원 차이를 더 키운 뒤 <b>봉우리</b>가 어떻게 되는지 보고 고르세요',
   f:'그때 A반 인원 = {0} · B반 인원 = {1}',
   opts:['크기가 다른 집단은 <b>상대도수</b>로 견줘야 한다 — 사람 수로는 비교가 되지 않는다',
         '사람 수가 많은 쪽이 언제나 더 높다고 보면 된다',
         '인원이 달라도 도수 막대로 비교하면 된다'],
   chk(got, r, mem, pick){
     if(!mem.ok2) return {ok:false, msg:'② 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const a=noteNum(r[1]), b=noteNum(r[2]);
     if(!(Math.abs(a-b) > Math.abs(mem.a-mem.b)))
       return {ok:false, msg:'인원 차이가 아직 '+Math.abs(a-b)+' 입니다. ①의 '+Math.abs(mem.a-mem.b)+' 보다 크게 벌리세요.'};
     if(![0,1].every(j=>isFinite(got[j]))) return {ok:false, msg:'두 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-a)>0.5||Math.abs(got[1]-b)>0.5)
       return {ok:false, msg:'지금은 '+a+'명 과 '+b+'명 입니다.'};
     if(pick!==0)
       return {ok:false, msg:'②에서 같은 4명이 서로 다른 비율이 된 것을 보았습니다. 이 사실을 보고 다시 고르세요.'};
     return {ok:true, msg:'판단했습니다 — <b>상대도수는 «크기»를 지우고 «모양»만 남깁니다.</b> 그래서 인원이 다른 집단도 나란히 놓고 볼 수 있습니다.'};
   }}""")
 +
 note(42, '내가 뽑고 · 내가 견주고 · 내가 판단한다',
 """  {t:'기록 — 표본 크기를 <b>작게</b> 두고 뽑은 뒤 적으세요',
   f:'표본 크기 = {0} · 평균 = {1}',
   chk(got, r, mem){
     if(!r) return {ok:false, msg:'아직 표본이 없습니다. 표본을 뽑아 보세요.'};
     const n=noteNum(r[1]), me=noteNum(r[2]);
     if(n>40) return {ok:false, msg:'표본이 '+n+'명으로 큽니다. 40명 이하로 줄여 보세요.'};
     if(![0,1].every(j=>isFinite(got[j]))) return {ok:false, msg:'두 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-n)>0.5) return {ok:false, msg:'표본 크기는 '+n+' 입니다.'};
     if(Math.abs(got[1]-me)>0.15) return {ok:false, msg:'평균은 '+me+' 입니다.'};
     mem.n=n; mem.me=me;
     return {ok:true, msg:'기록했습니다 — 같은 크기로 다시 뽑으면 이 평균이 얼마나 흔들릴까요?'};
   }}""",
 """  {t:'생각 — 표본 크기를 <b>크게</b> 해서 다시 뽑고, 두 평균의 차를 구하세요',
   f:'큰 표본의 크기 = {0} · 그 평균 = {1} · 두 평균의 차 = {2}',
   chk(got, r, mem){
     if(mem.n===undefined) return {ok:false, msg:'① 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'표본을 다시 뽑아 보세요.'};
     const n=noteNum(r[1]), me=noteNum(r[2]);
     if(!(n >= mem.n*2)) return {ok:false, msg:'아직 '+n+'명입니다. ①의 '+mem.n+'명의 <b>두 배 이상</b>으로 키우세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-n)>0.5) return {ok:false, msg:'지금 표본 크기는 '+n+' 입니다.'};
     if(Math.abs(got[1]-me)>0.15) return {ok:false, msg:'지금 평균은 '+me+' 입니다.'};
     if(Math.abs(got[2]-(me-mem.me))>0.2) return {ok:false, msg:'지금 평균에서 ①의 평균을 빼세요.'};
     mem.n2=n;
     return {ok:true, msg:'계산했습니다 — 이제 같은 크기로 <b>여러 번</b> 뽑아 흔들림을 견주어 봅니다.'};
   }}""",
 """  {t:'판단 — 큰 표본으로 <b>여러 번</b> 다시 뽑아 본 뒤 고르세요',
   f:'지금 표본 크기 = {0} · 지금 평균 = {1}',
   opts:['표본을 키우면 평균의 <b>흔들림</b>이 줄어든다 — 다만 치우쳐 뽑으면 아무리 키워도 빗나간다',
         '표본을 키우면 평균이 반드시 커진다',
         '표본 크기는 결과와 상관이 없다'],
   chk(got, r, mem, pick){
     if(mem.n2===undefined) return {ok:false, msg:'② 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'표본을 다시 뽑아 보세요.'};
     const n=noteNum(r[1]), me=noteNum(r[2]);
     if(n < mem.n*2) return {ok:false, msg:'큰 표본을 그대로 두고 다시 뽑으세요.'};
     if(![0,1].every(j=>isFinite(got[j]))) return {ok:false, msg:'두 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-n)>0.5||Math.abs(got[1]-me)>0.15)
       return {ok:false, msg:'지금은 '+n+'명 · 평균 '+me+' 입니다.'};
     if(pick!==0)
       return {ok:false, msg:'작은 표본에서는 평균이 '+mem.me+' 였고 큰 표본에서는 '+me+' 근처에 모입니다. 이 사실을 보고 다시 고르세요.'};
     return {ok:true, msg:'판단했습니다 — <b>표본을 키우면 «우연한 흔들림»은 줄지만 «치우침»은 줄지 않습니다.</b> 우리 반만 뽑으면 800명을 대표할 수 없습니다.'};
   }}""")
 +
 note(43, '내가 모으고 · 내가 넣어 보고 · 내가 판단한다',
 """  {t:'기록 — 타일을 모은 뒤 두 합을 적으세요',
   f:'x 항의 합 = {0} · 상수항의 합 = {1}',
   chk(got, r, mem){
     if(!r) return {ok:false, msg:'아직 타일이 없습니다. 타일을 놓아 보세요.'};
     const sx=noteNum(r[1]), sk=noteNum(r[2]);
     if(sx===0&&sk===0) return {ok:false, msg:'타일이 모두 비어 있습니다.'};
     if(![0,1].every(j=>isFinite(got[j]))) return {ok:false, msg:'두 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-sx)>0.1||Math.abs(got[1]-sk)>0.1)
       return {ok:false, msg:'화면은 x 항 '+sx+' · 상수항 '+sk+' 입니다.'};
     mem.sx=sx; mem.sk=sk;
     return {ok:true, msg:'기록했습니다 — 정리한 식은 '+sx+'x + '+sk+' 입니다.'};
   }}""",
 """  {t:'생각 — <b>x = 2</b> 를 넣었을 때 원래 식과 정리한 식의 값을 적으세요',
   f:'원래 식의 값 = {0} · 정리한 식의 값 = {1} · 두 값의 차 = {2}',
   chk(got, r, mem){
     if(mem.sx===undefined) return {ok:false, msg:'① 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const v1=noteNum(r[4]), v2=noteNum(r[5]);
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-v1)>0.1||Math.abs(got[1]-v2)>0.1)
       return {ok:false, msg:'화면은 '+v1+' 과 '+v2+' 입니다.'};
     if(Math.abs(got[2])>0.1) return {ok:false, msg:'두 값을 빼 보세요. 무엇이 나오나요?'};
     mem.ok2=true;
     return {ok:true, msg:'계산했습니다 — 차가 0 입니다. <b>정리해도 값은 그대로</b>입니다.'};
   }}""",
 """  {t:'판단 — x 항과 상수항을 보고 고르세요',
   f:'x 항의 합 = {0} · 상수항의 합 = {1}',
   opts:['<b>같은 종류의 항끼리만</b> 묶을 수 있다 — x 항과 상수항은 길이가 다른 타일이다',
         '숫자는 모두 더할 수 있으므로 3x + 2 = 5x 이다',
         '정리하면 값이 조금 달라진다'],
   chk(got, r, mem, pick){
     if(!mem.ok2) return {ok:false, msg:'② 칸을 먼저 통과하세요.'};
     if(![0,1].every(j=>isFinite(got[j]))) return {ok:false, msg:'두 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-mem.sx)>0.1||Math.abs(got[1]-mem.sk)>0.1)
       return {ok:false, msg:'①에 적은 '+mem.sx+' 와 '+mem.sk+' 를 넣으세요.'};
     if(pick!==0)
       return {ok:false, msg:'②에서 정리 전후의 값이 같았습니다. 잘못 묶으면 값이 달라집니다. 이 사실을 보고 다시 고르세요.'};
     return {ok:true, msg:'판단했습니다 — <b>3x 와 2 는 길이가 다른 타일이라 한 줄로 묶이지 않습니다.</b> 그래서 3x + 2 는 더 줄일 수 없습니다.'};
   }}""")
 +
 note(44, '내가 그리고 · 내가 고치고 · 내가 판단한다',
 """  {t:'기록 — 이야기를 고르고 그래프를 그린 뒤 적으세요',
   f:'그린 칸 수 = {0} · 평균 어긋남 = {1}',
   chk(got, r, mem){
     if(!r) return {ok:false, msg:'아직 그린 것이 없습니다. 그래프를 그려 보세요.'};
     const n=noteNum(r[1]), e=noteNum(r[2]);
     if(n<5) return {ok:false, msg:'그린 칸이 '+n+'개뿐입니다. 더 그려 보세요.'};
     if(![0,1].every(j=>isFinite(got[j]))) return {ok:false, msg:'두 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-n)>0.5) return {ok:false, msg:'그린 칸은 '+n+'개입니다.'};
     if(Math.abs(got[1]-e)>0.3) return {ok:false, msg:'평균 어긋남은 '+e+' 입니다.'};
     mem.e=e;
     return {ok:true, msg:'기록했습니다 — 이제 고쳐 그려 어긋남을 줄여 봅니다.'};
   }}""",
 """  {t:'생각 — 고쳐 그려 <b>어긋남을 줄인</b> 뒤 얼마나 줄었는지 구하세요',
   f:'고친 뒤 평균 어긋남 = {0} · 줄어든 양 = {1}',
   chk(got, r, mem){
     if(mem.e===undefined) return {ok:false, msg:'① 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const e2=noteNum(r[2]);
     if(!(e2 < mem.e - 0.05)) return {ok:false, msg:'아직 어긋남이 '+e2+' 입니다. ①의 '+mem.e+' 보다 줄여 보세요.'};
     if(![0,1].every(j=>isFinite(got[j]))) return {ok:false, msg:'두 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-e2)>0.3) return {ok:false, msg:'지금 어긋남은 '+e2+' 입니다.'};
     if(Math.abs(got[1]-(mem.e-e2))>0.4) return {ok:false, msg:'①의 어긋남에서 지금 어긋남을 빼세요.'};
     mem.e2=e2;
     return {ok:true, msg:'계산했습니다 — 이야기에 가까워졌습니다.'};
   }}""",
 """  {t:'판단 — <b>평평한 구간</b>과 <b>0 복귀</b> 를 모두 넣은 뒤 고르세요',
   f:'그때 평균 어긋남 = {0}',
   opts:['평평한 구간은 <b>기울기가 0</b> — 멈춰 있다는 뜻이고, 0 으로 내려오면 출발점으로 돌아온 것이다',
         '평평한 구간은 되돌아오고 있다는 뜻이다',
         '그래프가 아래로 내려가면 속도가 음수라는 뜻일 뿐 자리는 그대로다'],
   chk(got, r, mem, pick){
     if(mem.e2===undefined) return {ok:false, msg:'② 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     if(String(r[3]).indexOf('O')<0&&String(r[3]).indexOf('넣')<0&&String(r[3]).indexOf('예')<0)
       return {ok:false, msg:'아직 평평한 구간이 «'+r[3]+'» 입니다. 넣어 보세요.'};
     const e3=noteNum(r[2]);
     if(!isFinite(got[0])) return {ok:false, msg:'칸을 채우세요.'};
     if(Math.abs(got[0]-e3)>0.3) return {ok:false, msg:'지금 어긋남은 '+e3+' 입니다.'};
     if(pick!==0)
       return {ok:false, msg:'평평한 구간을 넣자 어긋남이 줄었습니다. 이 사실을 보고 다시 고르세요.'};
     return {ok:true, msg:'판단했습니다 — <b>기울기가 곧 속도입니다.</b> 평평하면 멈춘 것이고, 0 으로 내려오면 출발점으로 돌아온 것입니다.'};
   }}""")
 +
 note(45, '내가 이어 붙이고 · 내가 재고 · 내가 판단한다',
 """  {t:'기록 — √a 와 √b 를 <b>이어 붙인</b> 뒤 화면의 값을 적으세요',
   f:'이어붙인 길이 = {0} · √(a+b) = {1}',
   chk(got, r, mem){
     if(!r) return {ok:false, msg:'아직 이어 붙이지 않았습니다. 두 막대를 끌어 이어 붙이세요.'};
     const j=noteNum(r[2]), s=noteNum(r[3]);
     if(![0,1].every(j2=>isFinite(got[j2]))) return {ok:false, msg:'두 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-j)>0.02) return {ok:false, msg:'이어붙인 길이는 '+r[2]+' 입니다.'};
     if(Math.abs(got[1]-s)>0.02) return {ok:false, msg:'√(a+b) 는 '+r[3]+' 입니다.'};
     mem.j=j; mem.s=s;
     return {ok:true, msg:'기록했습니다 — 두 값이 눈에 띄게 다릅니다.'};
   }}""",
 """  {t:'생각 — 두 값의 <b>차</b>를 구하고, 어느 쪽이 큰지 적으세요',
   f:'(이어붙인 길이) − √(a+b) = {0} · 이어붙인 쪽이 크면 1, 작으면 0 → {1}',
   chk(got, r, mem){
     if(mem.j===undefined) return {ok:false, msg:'① 칸을 먼저 통과하세요.'};
     if(![0,1].every(j=>isFinite(got[j]))) return {ok:false, msg:'두 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-(mem.j-mem.s))>0.03) return {ok:false, msg:'①에 적은 두 값을 빼세요.'};
     const want = mem.j>mem.s ? 1 : 0;
     if(Math.abs(got[1]-want)>0.01) return {ok:false, msg:'두 값을 견주어 다시 판단하세요.'};
     mem.d=mem.j-mem.s;
     return {ok:true, msg:'계산했습니다 — 차가 '+mem.d.toFixed(3)+' 입니다. 늘 이럴까요?'};
   }}""",
 """  {t:'판단 — a 와 b 를 <b>다른 수</b>로 바꿔 다시 확인한 뒤 고르세요',
   f:'새 이어붙인 길이 = {0} · 새 √(a+b) = {1}',
   opts:['√a + √b 는 언제나 √(a+b) <b>보다 크다</b> — 근호끼리는 그냥 더할 수 없다',
         'a 와 b 를 잘 고르면 둘이 같아지기도 한다',
         '√(a+b) 쪽이 더 큰 경우도 있다'],
   chk(got, r, mem, pick){
     if(mem.d===undefined) return {ok:false, msg:'② 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'다시 이어 붙여 보세요.'};
     const j=noteNum(r[2]), s=noteNum(r[3]);
     if(Math.abs(j-mem.j)<0.02) return {ok:false, msg:'값이 그대로입니다 — a 나 b 를 바꾸세요.'};
     if(![0,1].every(k=>isFinite(got[k]))) return {ok:false, msg:'두 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-j)>0.02||Math.abs(got[1]-s)>0.02)
       return {ok:false, msg:'화면은 '+r[2]+' 과 '+r[3]+' 입니다.'};
     if(pick!==0)
       return {ok:false, msg:'이번에도 이어붙인 쪽이 '+(j-s).toFixed(3)+' 만큼 큽니다. 이 사실을 보고 다시 고르세요.'};
     return {ok:true, msg:'판단했습니다 — <b>(√a + √b)² = a + b + 2√(ab).</b> 2√(ab) 가 더 남기 때문에 언제나 √(a+b) 보다 큽니다.'};
   }}""")
 +
 note(46, '내가 잇고 · 내가 재고 · 내가 판단한다',
 """  {t:'기록 — 삼각형을 이어 붙여 n 을 늘린 뒤 적으세요',
   f:'n = {0} · 빗변의 근삿값 = {1}',
   chk(got, r, mem){
     if(!r) return {ok:false, msg:'아직 화면 값이 없습니다.'};
     const n=noteNum(r[0]), v=noteNum(r[2]);
     if(n<3) return {ok:false, msg:'n 이 '+n+' 입니다. 3 이상으로 이어 붙이세요.'};
     if(![0,1].every(j=>isFinite(got[j]))) return {ok:false, msg:'두 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-n)>0.5) return {ok:false, msg:'n 은 '+n+' 입니다.'};
     if(Math.abs(got[1]-v)>0.002) return {ok:false, msg:'근삿값은 '+r[2]+' 입니다.'};
     mem.n=n; mem.v=v;
     return {ok:true, msg:'기록했습니다 — 이 값을 제곱하면 무엇이 나올까요?'};
   }}""",
 """  {t:'생각 — 근삿값을 <b>제곱</b>해 n 이 나오는지 확인하세요',
   f:'근삿값 × 근삿값 = {0} · n 과의 차 = {1}',
   chk(got, r, mem){
     if(mem.n===undefined) return {ok:false, msg:'① 칸을 먼저 통과하세요.'};
     if(![0,1].every(j=>isFinite(got[j]))) return {ok:false, msg:'두 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-mem.v*mem.v)>0.02) return {ok:false, msg:'①에 적은 근삿값을 제곱하세요.'};
     if(Math.abs(got[1]-(mem.v*mem.v-mem.n))>0.02) return {ok:false, msg:'제곱한 값에서 n 을 빼세요.'};
     mem.ok2=true;
     return {ok:true, msg:'계산했습니다 — 거의 0 이지만 <b>꼭 0 은 아닙니다.</b> 소수로는 끝이 없기 때문입니다.'};
   }}""",
 """  {t:'판단 — <b>자연수가 되는 n</b> 을 찾아 맞춘 뒤 고르세요',
   f:'자연수가 되는 n = {0} · 그때 빗변 = {1}',
   opts:['n 이 <b>제곱수</b>일 때만 빗변이 자연수다 — 그 밖에는 무리수이지만 <b>길이로는 정확한 한 점</b>이다',
         '근삿값이 소수이므로 √n 의 자리는 정확히 찍을 수 없다',
         '모든 n 에서 빗변은 무리수다'],
   chk(got, r, mem, pick){
     if(!mem.ok2) return {ok:false, msg:'② 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     if(String(r[3]).indexOf('자연수')<0)
       return {ok:false, msg:'지금 n 에서는 «'+r[3]+'» 입니다. 제곱수인 n 으로 맞추세요.'};
     const n=noteNum(r[0]), v=noteNum(r[2]);
     if(![0,1].every(j=>isFinite(got[j]))) return {ok:false, msg:'두 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-n)>0.5||Math.abs(got[1]-v)>0.02)
       return {ok:false, msg:'지금 n 은 '+n+' · 빗변은 '+r[2]+' 입니다.'};
     if(pick!==0)
       return {ok:false, msg:'n = '+n+' 에서만 «'+r[3]+'» 입니다. 이 사실을 보고 다시 고르세요.'};
     return {ok:true, msg:'판단했습니다 — <b>소수로는 끝이 없어도 길이로는 한 점입니다.</b> 자와 컴퍼스로 √n 의 자리를 «근사»가 아니라 «정확히» 찍을 수 있습니다.'};
   }}""")
 +
 note(47, '내가 고르고 · 내가 곱해 보고 · 내가 판단한다',
 """  {t:'기록 — b 를 정한 뒤 두 인수와 곱을 적으세요',
   f:'b = {0} · 100−b = {1} · 100+b = {2} · 곱 = {3}',
   chk(got, r, mem){
     if(!r) return {ok:false, msg:'아직 화면 값이 없습니다.'};
     const b=noteNum(r[0]), lo=noteNum(r[1]), hi=noteNum(r[2]), p=noteNum(r[3]);
     if(b===0) return {ok:false, msg:'b 가 0 입니다. 0 이 아닌 값으로 바꾸세요.'};
     if(![0,1,2,3].every(j=>isFinite(got[j]))) return {ok:false, msg:'네 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-b)>0.5||Math.abs(got[1]-lo)>0.5||Math.abs(got[2]-hi)>0.5)
       return {ok:false, msg:'화면은 b = '+b+' · '+lo+' · '+hi+' 입니다.'};
     if(Math.abs(got[3]-p)>0.5) return {ok:false, msg:'곱은 '+p+' 입니다.'};
     mem.b=b; mem.p=p;
     return {ok:true, msg:'기록했습니다 — 이 곱을 10000 에서 빼면 무엇이 나올까요?'};
   }}""",
 """  {t:'생각 — <b>10000 − 곱</b> 을 구하고, b² 과 견주세요',
   f:'10000 − 곱 = {0} · b × b = {1} · 두 값의 차 = {2}',
   chk(got, r, mem){
     if(mem.b===undefined) return {ok:false, msg:'① 칸을 먼저 통과하세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-(10000-mem.p))>0.5) return {ok:false, msg:'10000 에서 ①의 곱을 빼세요.'};
     if(Math.abs(got[1]-mem.b*mem.b)>0.5) return {ok:false, msg:'①에 적은 b 를 제곱하세요.'};
     if(Math.abs(got[2])>0.5) return {ok:false, msg:'두 값을 빼 보세요. 무엇이 나오나요?'};
     mem.ok2=true;
     return {ok:true, msg:'계산했습니다 — 차가 0 입니다. 곱 = 10000 − b² 입니다.'};
   }}""",
 """  {t:'판단 — b 를 <b>다른 값</b>으로 바꿔 다시 확인한 뒤 고르세요',
   f:'새 b = {0} · 그때 10000 − 곱 = {1}',
   opts:['<b>(100 − b)(100 + b) = 100² − b²</b> — 큰 정사각형에서 작은 정사각형을 덜어 낸 것',
         'b 가 작을 때만 성립한다',
         '우연히 그렇게 나온 것이다'],
   chk(got, r, mem, pick){
     if(!mem.ok2) return {ok:false, msg:'② 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const b=noteNum(r[0]), q=noteNum(r[4]);
     if(b===mem.b) return {ok:false, msg:'b 가 그대로입니다 — 다른 값으로 바꾸세요.'};
     if(![0,1].every(j=>isFinite(got[j]))) return {ok:false, msg:'두 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-b)>0.5||Math.abs(got[1]-q)>0.5)
       return {ok:false, msg:'지금 b 는 '+b+' · 10000 − 곱 은 '+q+' 입니다.'};
     if(pick!==0)
       return {ok:false, msg:'b = '+b+' 에서도 10000 − 곱 = '+q+' = b² 입니다. 이 사실을 보고 다시 고르세요.'};
     return {ok:true, msg:'판단했습니다 — <b>(a + b)(a − b) = a² − b².</b> 99 × 101 = 10000 − 1 = 9999 를 3초에 구할 수 있는 까닭입니다.'};
   }}""")
 +
 note(48, '내가 찍고 · 내가 검산하고 · 내가 판단한다',
 """  {t:'기록 — 근을 찍어 확인한 뒤 두 근을 적으세요',
   f:'근 1 = {0} · 근 2 = {1}',
   chk(got, r, mem){
     if(!r) return {ok:false, msg:'아직 근이 확인되지 않았습니다. 근을 찍고 검산해 보세요.'};
     const a=noteNum(r[1]), b=noteNum(r[2]);
     if(![0,1].every(j=>isFinite(got[j]))) return {ok:false, msg:'두 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-a)>0.06||Math.abs(got[1]-b)>0.06)
       return {ok:false, msg:'화면의 두 근은 '+a+' 와 '+b+' 입니다.'};
     mem.r1=a; mem.r2=b;
     return {ok:true, msg:'기록했습니다 — 이 두 근으로 합과 곱을 구해 봅니다.'};
   }}""",
 """  {t:'생각 — 두 근의 <b>합</b>과 <b>곱</b>을 구하세요',
   f:'합 = {0} · 곱 = {1}',
   chk(got, r, mem){
     if(mem.r1===undefined) return {ok:false, msg:'① 칸을 먼저 통과하세요.'};
     if(![0,1].every(j=>isFinite(got[j]))) return {ok:false, msg:'두 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-(mem.r1+mem.r2))>0.08) return {ok:false, msg:'①에 적은 두 근을 더하세요.'};
     if(Math.abs(got[1]-mem.r1*mem.r2)>0.12) return {ok:false, msg:'①에 적은 두 근을 곱하세요.'};
     mem.s=mem.r1+mem.r2; mem.p=mem.r1*mem.r2;
     return {ok:true, msg:'계산했습니다 — 합 '+mem.s.toFixed(2)+' · 곱 '+mem.p.toFixed(2)+'. 계수와 견주어 보세요.'};
   }}""",
 """  {t:'판단 — 계수를 바꿔 다른 식으로 만든 뒤 합과 곱을 다시 보고 고르세요',
   f:'새 합 = {0} · 새 곱 = {1}',
   opts:['x² + bx + c 에서 두 근의 <b>합은 −b</b>, <b>곱은 c</b> 이다 — 인수분해하면 바로 보인다',
         '두 근의 합과 곱은 계수와 관계가 없다',
         '합은 b 이고 곱은 −c 이다'],
   chk(got, r, mem, pick){
     if(mem.s===undefined) return {ok:false, msg:'② 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'근을 다시 찍어 확인하세요.'};
     const a=noteNum(r[1]), b=noteNum(r[2]);
     if(Math.abs(a-mem.r1)<0.05&&Math.abs(b-mem.r2)<0.05)
       return {ok:false, msg:'식이 그대로입니다 — 계수를 바꿔 다른 식으로 만드세요.'};
     if(![0,1].every(j=>isFinite(got[j]))) return {ok:false, msg:'두 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-(a+b))>0.08||Math.abs(got[1]-a*b)>0.12)
       return {ok:false, msg:'지금 두 근 '+a+' 와 '+b+' 로 합과 곱을 구하세요.'};
     if(pick!==0)
       return {ok:false, msg:'화면의 식과 견주어 보세요 — 합은 x 의 계수와 부호만 반대이고, 곱은 상수항과 같습니다.'};
     return {ok:true, msg:'판단했습니다 — <b>x² + bx + c = (x − α)(x − β)</b> 를 전개하면 b = −(α+β), c = αβ 입니다. 근의 공식은 이 식을 완전제곱으로 접어 얻은 것입니다.'};
   }}""")
 +
 note(49, '내가 옮기고 · 내가 세고 · 내가 판단한다',
 """  {t:'기록 — k 를 정한 뒤 D 와 교점 수를 적으세요',
   f:'k = {0} · D = {1} · 교점 수 = {2}',
   chk(got, r, mem){
     if(!r) return {ok:false, msg:'아직 화면 값이 없습니다.'};
     const k=noteNum(r[0]), D=noteNum(r[1]), c=noteNum(r[3]);
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-k)>0.05) return {ok:false, msg:'k 는 '+r[0]+' 입니다.'};
     if(Math.abs(got[1]-D)>0.05) return {ok:false, msg:'D 는 '+r[1]+' 입니다.'};
     if(Math.abs(got[2]-c)>0.5) return {ok:false, msg:'교점 수는 '+r[3]+' 입니다.'};
     mem.D=D; mem.c=c;
     return {ok:true, msg:'기록했습니다 — D 의 부호는 «'+r[2]+'» 입니다.'};
   }}""",
 """  {t:'생각 — <b>D = 0</b> 이 되는 k 를 구하세요',
   f:'4 + 4k = 0 이 되는 k = {0}',
   chk(got, r, mem){
     if(mem.D===undefined) return {ok:false, msg:'① 칸을 먼저 통과하세요.'};
     if(!isFinite(got[0])) return {ok:false, msg:'칸을 채우세요.'};
     if(Math.abs(got[0]+1)>0.06) return {ok:false, msg:'4 + 4k = 0 을 풀어 보세요.'};
     mem.ok2=true;
     return {ok:true, msg:'계산했습니다 — k = −1 에서 D 가 0 이 됩니다. 그 자리로 옮겨 봅시다.'};
   }}""",
 """  {t:'판단 — D 의 <b>부호가 반대</b>가 되게 k 를 바꾼 뒤 고르세요',
   f:'그때 D = {0} · 교점 수 = {1}',
   opts:['D &gt; 0 이면 두 점, D = 0 이면 한 점, D &lt; 0 이면 만나지 않는다 — <b>풀지 않고 개수를 안다</b>',
         'D 의 부호와 교점 수는 상관이 없다',
         'D 가 클수록 교점이 많아진다'],
   chk(got, r, mem, pick){
     if(!mem.ok2) return {ok:false, msg:'② 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const D=noteNum(r[1]), c=noteNum(r[3]);
     if(!(D*mem.D < 0)) return {ok:false, msg:'아직 D 의 부호가 같습니다 — ①에서는 '+mem.D+', 지금은 '+D+'. 반대 부호가 되게 바꾸세요.'};
     if(![0,1].every(j=>isFinite(got[j]))) return {ok:false, msg:'두 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-D)>0.05||Math.abs(got[1]-c)>0.5)
       return {ok:false, msg:'지금 D 는 '+r[1]+' · 교점 수는 '+r[3]+' 입니다.'};
     if(pick!==0)
       return {ok:false, msg:'D 가 '+mem.D+' 일 때 '+mem.c+'개, '+D+' 일 때 '+c+'개입니다. 이 사실을 보고 다시 고르세요.'};
     return {ok:true, msg:'판단했습니다 — <b>D 는 근의 공식에서 √ 안에 들어가는 수입니다.</b> 음수의 제곱근은 실수에 없으므로 D &lt; 0 이면 해가 없습니다.'};
   }}""")
 +
 note(50, '내가 채우고 · 내가 접고 · 내가 판단한다',
 """  {t:'기록 — b 를 정한 뒤 화면의 값을 적으세요',
   f:'b = {0} · b/2 = {1} · 채워야 할 수 (b/2)² = {2}',
   chk(got, r, mem){
     if(!r) return {ok:false, msg:'아직 화면 값이 없습니다.'};
     const b=noteNum(r[0]), h=noteNum(r[1]), sq=noteNum(r[2]);
     if(b===0) return {ok:false, msg:'b 가 0 입니다. 0 이 아닌 값으로 바꾸세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-b)>0.1) return {ok:false, msg:'b 는 '+b+' 입니다.'};
     if(Math.abs(got[1]-h)>0.1) return {ok:false, msg:'b/2 는 '+h+' 입니다.'};
     if(Math.abs(got[2]-sq)>0.15) return {ok:false, msg:'(b/2)² 은 '+sq+' 입니다.'};
     mem.b=b; mem.h=h; mem.sq=sq;
     return {ok:true, msg:'기록했습니다 — 구멍의 한 변이 b/2 이고 그 넓이가 채울 수입니다.'};
   }}""",
 """  {t:'생각 — 채운 뒤의 식이 <b>(x + b/2)²</b> 인지 확인하세요',
   f:'(b/2)² = {0} · b/2 를 제곱한 값 = {1} · 두 값의 차 = {2}',
   chk(got, r, mem){
     if(mem.b===undefined) return {ok:false, msg:'① 칸을 먼저 통과하세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-mem.sq)>0.15) return {ok:false, msg:'①에 적은 (b/2)² 을 넣으세요.'};
     if(Math.abs(got[1]-mem.h*mem.h)>0.15) return {ok:false, msg:'①에 적은 b/2 를 제곱하세요.'};
     if(Math.abs(got[2])>0.15) return {ok:false, msg:'두 값을 빼 보세요. 무엇이 나오나요?'};
     mem.ok2=true;
     return {ok:true, msg:'계산했습니다 — 채울 수는 <b>b/2 를 제곱한 값</b>입니다.'};
   }}""",
 """  {t:'판단 — 구멍을 채워 <b>완전제곱식</b>을 완성한 뒤 고르세요',
   f:'지금 b = {0} · 채운 수 = {1}',
   opts:['x² + bx 에 <b>(b/2)²</b> 을 더하면 (x + b/2)² 이 된다 — 근의 공식은 이 «구멍 채우기»에서 나왔다',
         'x² + bx 에 b² 을 더하면 완전제곱이 된다',
         'x² + bx 는 완전제곱으로 만들 수 없다'],
   chk(got, r, mem, pick){
     if(!mem.ok2) return {ok:false, msg:'② 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     if(String(r[3]).indexOf('미완')>=0)
       return {ok:false, msg:'아직 «'+r[3]+'» 입니다. 구멍을 채워 완성하세요.'};
     const b=noteNum(r[0]), sq=noteNum(r[2]);
     if(![0,1].every(j=>isFinite(got[j]))) return {ok:false, msg:'두 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-b)>0.1||Math.abs(got[1]-sq)>0.15)
       return {ok:false, msg:'지금 b 는 '+b+' · 채운 수는 '+r[2]+' 입니다.'};
     if(pick!==0)
       return {ok:false, msg:'화면이 «'+r[3]+'» 라고 말하고 있습니다. 이 사실을 보고 다시 고르세요.'};
     return {ok:true, msg:'판단했습니다 — <b>x² + bx + (b/2)² = (x + b/2)².</b> 여기에 상수항을 옮기고 제곱근을 취하면 그대로 근의 공식이 나옵니다.'};
   }}""")
)


def main(path):
    h = open(path, encoding='utf-8').read()
    if 'LESSON[41]=' in h:
        print('이미 반영됨')
        return
    L = (LESSONS.replace('__SPIRAL__', SP_PATH).replace('__SPOKES__', SP_SPOKES)
         .replace('__PAR49__', PAR49).replace('__R47__', R47))
    a = 'LESSON[356]={'
    assert h.count(a) == 1
    h = h.replace(a, L + a, 1)
    b = '\n};\n\nfunction labNo(spec)'
    assert h.count(b) == 1
    h = h.replace(b, NOTES + b, 1)
    open(path, 'w', encoding='utf-8').write(h)
    print('LAB 41~50 수업 모형 + 탐구 노트 삽입 — 파일 %.2f MB' % (len(h.encode('utf-8')) / 1048576))


if __name__ == '__main__':
    main(sys.argv[1])
