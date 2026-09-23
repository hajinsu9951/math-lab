# -*- coding: utf-8 -*-
"""LAB 31~40 — 7단계 수업 모형 + 탐구 노트.

실험 화면은 이미 있는 열 개 데모를 그대로 쓴다 (patch_demo_read.py 로 read() 를 내주게 해 두었다).
수업 모형의 inquiry 는 실험 화면이 갖고 있던 것과 **같은 열**을 쓴다.

이 배치부터 「생각 열기 사진」은 넣지 않는다 — 남은 326종에 3장씩 넣으면 단일 파일이 50 MB 를 넘어
USB·오프라인 배포가 깨진다. 문제 그림(SVG)은 좌표를 계산해 넣는다.

사용: python docs/LAB31_40_수업모형/patch_lab31_40.py src/40-demos.js
"""
import sys, math

# ══════════════ 문제 그림 — 좌표를 계산한다 ══════════════
def poly_pts(n, cx, cy, r, rot=-90):
    return ' '.join('%.1f,%.1f' % (cx + r * math.cos(math.radians(rot + 360 * k / n)),
                                   cy + r * math.sin(math.radians(rot + 360 * k / n)))
                    for k in range(n))


def sector_path(cx, cy, r, a0, a1):
    x0, y0 = cx + r * math.cos(math.radians(a0)), cy + r * math.sin(math.radians(a0))
    x1, y1 = cx + r * math.cos(math.radians(a1)), cy + r * math.sin(math.radians(a1))
    big = 1 if (a1 - a0) % 360 > 180 else 0
    return 'M%.1f %.1f L%.1f %.1f A%.1f %.1f 0 %d 1 %.1f %.1f Z' % (cx, cy, x0, y0, r, r, big, x1, y1)


SEC32 = sector_path(110, 90, 62, -90, -90 + 360 * 0.32)       # 32% 부채꼴
TRI31 = poly_pts(3, 300, 92, 54)
PENT37 = poly_pts(5, 118, 88, 46)
HEX37 = poly_pts(6, 282, 88, 46)
# LAB 39 — 부피 1000 을 유지하며 가로를 늘렸을 때 겉넓이
B39 = []
for k in range(41):
    a = 4 + k * 0.6                      # 가로 4 → 28
    b = c = math.sqrt(1000.0 / a)
    S = 2 * (a * b + b * c + c * a)
    B39.append('%s%.1f %.1f' % ('M' if k == 0 else 'L', 44 + 336 * k / 40, 150 - (S - 600) * 0.09))
B39 = ' '.join(B39)


LESSONS = """LESSON[31]={
 title:'삼각형의 합동 조건',
 problem:{
  q:'다리와 철탑은 모두 <b>삼각형</b>으로 짜여 있습니다. 사각형은 힘을 주면 찌그러지는데 삼각형은 버팁니다. 세 변의 길이만 정해지면 <b>모양이 하나로 굳는다</b>는 뜻인데 — 무엇을 알아야 삼각형이 하나로 정해질까요?',
  svg:`<svg viewBox="0 0 400 170" role="img" aria-label="찌그러지는 사각형과 모양이 굳는 삼각형을 견주는 그림">
    <path d="M40 132 H120 L146 46 H66 Z" fill="#BE123C" opacity=".10" stroke="#BE123C" stroke-width="2"/>
    <text x="93" y="154" font-size="10.5" font-weight="800" fill="#BE123C" text-anchor="middle">사각형 — 찌그러진다</text>
    <polygon points="__TRI31__" fill="#0E9384" opacity=".12" stroke="#0E9384" stroke-width="2.2"/>
    <text x="300" y="154" font-size="10.5" font-weight="800" fill="#0B6E63" text-anchor="middle">삼각형 — 모양이 굳는다</text>
    <text x="200" y="22" font-size="10.5" fill="#6B7280" text-anchor="middle">무엇을 알아야 삼각형이 «하나로» 정해질까?</text>
  </svg>`,
  sit:'조건을 SSS · SAS · ASA · <b>SSA</b> 로 바꿔 가며, 그 조건을 만족하는 삼각형이 <b>몇 개</b> 그려지는지 셉니다. SSA 에서는 두 개가 나오는 것을 눈으로 보게 됩니다 — 그래서 SSA 는 합동 조건이 아닙니다.'
 },
 predict:{
  q:['세 변의 길이만 알면 삼각형이 하나로 정해질까요? 그렇게 생각한 까닭도 적으세요.',
     '두 변과 «끼인 각이 아닌» 각을 알면 어떻게 될지 예상하세요.',
     '사각형이 찌그러지는 까닭을 삼각형과 견주어 적으세요.'] },
 missions:[
  {t:'<b>SSS</b> 와 <b>SAS</b> 를 골라 보세요. 그려지는 삼각형은 몇 개인가요?', re:'맞다'},
  {t:'<b>SSA</b> 로 바꿔 보세요. 이번에는 몇 개가 그려지나요?', re:'아니다'},
  {t:'아래 <b>탐구 노트</b>로 마무리하세요 — 지금 조건을 <b>기록</b>하고, 개수를 <b>견주고</b>, 무엇이 조건인지 <b>판단</b>합니다.',
   re:'탐구 노트 통과',
   do:'① SSA 에서 삼각형 개수 적기 ② SAS 로 바꿔 개수 적고 차이 구하기 ③ 합동 조건이 되는 것과 안 되는 것 가리기',
   hand:'SSA 가 왜 합동 조건이 아닌지 두 삼각형을 그려 설명하기'}],
 inquiry:{
  id:'cg31', title:'삼각형의 합동 — 무엇을 알아야 하나로 정해지나',
  q:['조건 네 가지를 모두 고르고 각도와 변을 바꿔 가며 8줄 이상 기록하세요.',
     '「삼각형 개수」 열을 보세요. 어느 조건에서 2가 나오는지 찾으세요.',
     'SSA 가 왜 합동 조건이 아닌지 <b>두 개가 그려지는 그림</b>과 함께 손으로 설명하세요.'],
  cols:['조건','각 A','변 b','삼각형 개수','합동 조건인가'],
  hint:'힌트 — «하나로 정해진다»가 합동 조건의 뜻입니다. 두 개가 그려지면 정해진 것이 아닙니다.' },
 apply:{
  q:'새 문제 — 두 삼각형에서 «세 각»이 각각 같으면 반드시 합동일까요? 합동이면 1, 아니면 0 을 적으세요.',
  a:0, tol:0.1,
  why:'세 각이 같으면 <b>닮음</b>일 뿐입니다. 크기가 다를 수 있으므로 합동이 아닙니다 — 변의 길이가 하나는 있어야 합니다.',
  hint:'큰 삼각형과 작은 삼각형의 각이 같을 수 있을까요?' },
 demo(root){ return congDemo(root); }
};

LESSON[32]={
 title:'부채꼴 — 원그래프의 각도',
 problem:{
  q:'설문 결과 «32%»를 원그래프로 그리려 합니다. 컴퍼스와 각도기는 있는데, <b>몇 도</b>로 그려야 할까요? 그리고 그 조각의 <b>호의 길이</b>와 <b>넓이</b>도 32%일까요?',
  svg:`<svg viewBox="0 0 400 170" role="img" aria-label="원의 32퍼센트에 해당하는 부채꼴 그림">
    <circle cx="110" cy="90" r="62" fill="#F1F5FB" stroke="#9CA3AF" stroke-width="1.4"/>
    <path d="__SEC32__" fill="#2563EB" opacity=".30" stroke="#2563EB" stroke-width="2"/>
    <text x="110" y="24" font-size="10.5" font-weight="800" fill="#1D4ED8" text-anchor="middle">전체의 32%</text>
    <text x="220" y="62" font-size="11" font-weight="800" fill="#111827">중심각 = 360° × 32%</text>
    <text x="220" y="88" font-size="11" fill="#6B7280">호의 길이도 32% 일까?</text>
    <text x="220" y="112" font-size="11" fill="#6B7280">넓이도 32% 일까?</text>
    <text x="200" y="162" font-size="10.5" fill="#6B7280" text-anchor="middle">세 가지 비율이 모두 같은지 직접 재어 확인하자</text>
  </svg>`,
  sit:'중심각과 반지름을 바꾸면 <b>호의 길이</b>와 <b>넓이</b>가 함께 계산되고, 각각이 원 전체의 몇 % 인지 나란히 표시됩니다. 세 비율이 늘 같은지 — 반지름을 바꿔도 그런지 확인합니다.'
 },
 predict:{
  q:['32%를 원그래프로 그리면 중심각은 몇 도일지 예상하세요.',
     '중심각이 전체의 32%면 호의 길이도 32%일까요? 그렇게 생각한 까닭을 적으세요.',
     '반지름을 두 배로 하면 그 비율들이 달라질지 예상하세요.'] },
 missions:[
  {t:'중심각을 바꿔 가며 <b>세 가지 비율</b>을 견주어 보세요.', re:'%'},
  {t:'반지름을 바꿔 보세요. 비율이 달라지나요?', re:'반지름'},
  {t:'아래 <b>탐구 노트</b>로 마무리하세요 — 지금 값을 <b>기록</b>하고, 32%의 중심각을 <b>계산</b>하고, 반지름을 바꿔 <b>판단</b>합니다.',
   re:'탐구 노트 통과',
   do:'① 지금 중심각·반지름·호·넓이 적기 ② 32%에 해당하는 중심각 구하기 ③ 반지름을 바꿔 비율이 그대로인지 확인',
   hand:'호의 길이와 넓이가 중심각에 비례하는 까닭을 «전체를 360등분한다»로 설명하기'}],
 inquiry:{
  id:'se32', title:'부채꼴 — 중심각·호·넓이는 같은 비율인가',
  q:['중심각과 반지름을 바꿔 가며 8줄 이상 기록하세요.',
     '세 비율 열(중심각·호·넓이)을 견주어 무엇이 같은지 찾으세요.',
     '반지름을 바꿔도 비율이 같은 까닭을 손으로 설명하세요.'],
  cols:['중심각','반지름 r','호의 길이','넓이','중심각 비율','호 비율','넓이 비율'],
  hint:'힌트 — 호도 넓이도 «360도 중 몇 도인가»로만 정해집니다. 반지름은 크기만 바꿉니다.' },
 apply:{
  q:'새 문제 — 원그래프에서 <b>25%</b> 를 나타내는 부채꼴의 중심각은 몇 도일까요?',
  a:90, tol:0.5,
  why:'360° × 0.25 = 90°. 전체를 360° 로 보고 비율을 곱합니다.',
  hint:'360 × 비율.' },
 demo(root){ return sectDemo(root); }
};

LESSON[33]={
 title:'대푯값 — 평균·중앙값·최빈값',
 problem:{
  q:'신발 가게 주인이 «우리 손님 평균 발 크기는 265 mm» 라는 것을 알았습니다. 그래서 265 를 가장 많이 들여놓았더니 <b>재고가 쌓였습니다.</b> 무엇이 잘못됐을까요?',
  svg:`<svg viewBox="0 0 400 170" role="img" aria-label="치수별 판매량 막대와 평균·중앙값·최빈값의 자리를 견주는 그림">
    <path d="M30 140 H380" stroke="#9CA3AF" stroke-width="1.3"/>
    ${[6,10,16,24,34,22,14,9,6,4,3,2].map((v,i)=>`<rect x="${36+i*28}" y="${140-v*3}" width="20" height="${v*3}" rx="2" fill="#2563EB" opacity=".55"/>`).join('')}
    <path d="M148 26 V140" stroke="#BE123C" stroke-width="2"/>
    <text x="150" y="22" font-size="10" font-weight="800" fill="#BE123C">최빈값</text>
    <path d="M204 26 V140" stroke="#B45309" stroke-width="2" stroke-dasharray="5 3"/>
    <text x="206" y="22" font-size="10" font-weight="800" fill="#92400E">평균</text>
    <text x="200" y="160" font-size="10.5" fill="#6B7280" text-anchor="middle">가장 많이 팔린 치수와 평균 치수가 같은 자리인가?</text>
  </svg>`,
  sit:'치수별로 팔린 켤레 수를 직접 바꾸면 <b>평균·중앙값·최빈값</b>이 함께 움직입니다. 「평균 − 최빈값」 칸을 보며 언제 셋이 갈라지는지 확인합니다.'
 },
 predict:{
  q:['가게 주인은 어떤 대푯값을 봤어야 할까요? 그렇게 생각한 까닭도 적으세요.',
     '평균과 최빈값이 크게 벌어지는 것은 어떤 모양일 때일지 예상하세요.',
     '«평균 키의 사람»이 실제로 가장 많을까요? 적어 보세요.'] },
 missions:[
  {t:'막대를 바꿔 가며 <b>평균·중앙값·최빈값</b>이 어떻게 움직이는지 보세요.', re:'최빈값'},
  {t:'한쪽으로 치우친 모양을 만들어 보세요. 셋이 얼마나 벌어지나요?', re:'평균'},
  {t:'아래 <b>탐구 노트</b>로 마무리하세요 — 지금 세 값을 <b>기록</b>하고, 차를 <b>계산</b>하고, 무엇을 들여놓을지 <b>판단</b>합니다.',
   re:'탐구 노트 통과',
   do:'① 지금 평균·중앙값·최빈값 적기 ② 평균 − 최빈값 구하기 ③ 치우친 모양을 만들어 차가 커지는지 확인',
   hand:'가게 주인이 어느 대푯값을 봤어야 하는지 근거를 들어 쓰기'}],
 inquiry:{
  id:'rm33', title:'대푯값 — 어느 것을 봐야 하나',
  q:['막대를 여러 모양으로 바꿔 가며 8줄 이상 기록하세요.',
     '「평균 − 최빈값」 열을 보세요. 언제 커지고 언제 작아지나요?',
     '«가장 많이 팔리는 치수»를 알고 싶을 때 어느 대푯값을 봐야 하는지 근거를 들어 설명하세요.'],
  cols:['팔린 수','평균','중앙값','최빈값','최빈값 켤레 수','평균 − 최빈값'],
  hint:'힌트 — 평균은 «모두를 고르게 나눈 값», 최빈값은 «가장 흔한 값»입니다. 가게에 필요한 것은 어느 쪽인가요?' },
 apply:{
  q:'새 문제 — 다섯 사람의 용돈이 1·1·2·2·44(만 원) 입니다. <b>중앙값</b>은?',
  a:2, tol:0.1,
  why:'정렬하면 1·1·2·2·44 이고 가운데는 2. 평균은 10 만 원이지만 44 한 사람 때문에 끌려 올라간 값입니다.',
  hint:'가운데 자리의 값을 고르세요.' },
 demo(root){ return repM1Demo(root); }
};

LESSON[34]={
 title:'도수분포표와 히스토그램',
 problem:{
  q:'같은 반 학생들의 <b>같은 점수</b>를 가지고 두 사람이 히스토그램을 그렸는데, 하나는 «고르게 퍼진» 모양이고 다른 하나는 «한쪽으로 몰린» 모양입니다. 자료는 같은데 왜 그래프가 달라 보일까요?',
  svg:`<svg viewBox="0 0 400 170" role="img" aria-label="같은 자료를 계급 크기만 달리해 그린 두 히스토그램">
    ${[3,7,12,18,14,9,5,2].map((v,i)=>`<rect x="${26+i*20}" y="${132-v*5}" width="17" height="${v*5}" rx="2" fill="#2563EB" opacity=".55"/>`).join('')}
    <text x="94" y="152" font-size="10.5" font-weight="800" fill="#1D4ED8" text-anchor="middle">계급 크기 5점</text>
    ${[10,30,23,7].map((v,i)=>`<rect x="${232+i*38}" y="${132-v*2.6}" width="34" height="${v*2.6}" rx="2" fill="#0E9384" opacity=".55"/>`).join('')}
    <text x="300" y="152" font-size="10.5" font-weight="800" fill="#0B6E63" text-anchor="middle">계급 크기 20점</text>
    <text x="200" y="20" font-size="10.5" fill="#6B7280" text-anchor="middle">같은 자료 · 다른 계급 크기 — 무엇이 달라 보이는가?</text>
  </svg>`,
  sit:'계급의 <b>크기</b>와 <b>시작점</b>을 바꾸면 같은 자료가 전혀 다른 모양이 됩니다. 「최대 도수 계급」이 어디로 옮겨 가는지 보며, 그래프를 읽을 때 무엇을 먼저 확인해야 하는지 알게 됩니다.'
 },
 predict:{
  q:['계급의 크기를 크게 하면 그래프가 어떻게 변할지 예상하세요.',
     '시작점만 바꿔도 «가장 높은 막대»가 달라질 수 있을까요?',
     '히스토그램을 볼 때 가장 먼저 확인해야 할 것은 무엇일까요?'] },
 missions:[
  {t:'<b>계급의 크기</b>를 바꿔 보세요. 모양이 얼마나 달라지나요?', re:'계급'},
  {t:'<b>시작점</b>만 바꿔 보세요. 가장 높은 막대가 옮겨 가나요?', re:'도수'},
  {t:'아래 <b>탐구 노트</b>로 마무리하세요 — 지금 설정을 <b>기록</b>하고, 바꿔서 <b>견주고</b>, 무엇을 확인해야 하는지 <b>판단</b>합니다.',
   re:'탐구 노트 통과',
   do:'① 지금 계급 크기·계급 수·최대 도수 적기 ② 계급 크기를 바꿔 다시 적고 견주기 ③ 자료가 그대로인지 확인',
   hand:'같은 자료가 다르게 보이는 까닭을 적고, 그래프를 읽을 때 확인할 것을 정리하기'}],
 inquiry:{
  id:'hi34', title:'히스토그램 — 같은 자료가 다르게 보이는 까닭',
  q:['계급의 크기와 시작점을 바꿔 가며 8줄 이상 기록하세요.',
     '「최대 도수 계급」 열을 보세요. 설정만 바꿨는데 어디로 옮겨 가나요?',
     '자료는 그대로인데 왜 모양이 달라지는지, 그리고 그래프를 읽을 때 무엇을 확인해야 하는지 설명하세요.'],
  cols:['계급의 크기','시작점','계급 수','최대 도수 계급','그 도수','전체 대비'],
  hint:'힌트 — 히스토그램은 «자료»가 아니라 «자료를 나눈 방법»까지 함께 보여 줍니다.' },
 apply:{
  q:'새 문제 — 자료 40개를 계급 크기 <b>10</b> 으로 나눴더니 계급이 <b>5</b> 개 나왔습니다. 자료가 퍼진 범위는 대략 몇일까요?',
  a:50, tol:1,
  why:'계급 5개 × 크기 10 = 50. 자료는 대략 50 만큼의 범위에 퍼져 있습니다.',
  hint:'계급 수 × 계급 크기.' },
 demo(root){ return histDemo(root); }
};

LESSON[35]={
 title:'최대공약수와 최소공배수',
 problem:{
  q:'톱니가 <b>12개</b>와 <b>18개</b>인 두 톱니바퀴가 맞물려 돌아갑니다. 지금 맞닿은 두 톱니가 <b>다시 처음처럼</b> 만나는 것은 언제일까요? 그리고 그 답이 두 수의 무엇과 관계있을까요?',
  svg:`<svg viewBox="0 0 400 170" role="img" aria-label="맞물린 두 톱니바퀴 그림">
    <circle cx="140" cy="86" r="52" fill="#F1F5FB" stroke="#2563EB" stroke-width="2.4"/>
    ${Array.from({length:12},(_,k)=>{const a=k*30*Math.PI/180;return `<path d="M${(140+52*Math.cos(a)).toFixed(1)} ${(86+52*Math.sin(a)).toFixed(1)} L${(140+62*Math.cos(a)).toFixed(1)} ${(86+62*Math.sin(a)).toFixed(1)}" stroke="#2563EB" stroke-width="3.2" stroke-linecap="round"/>`;}).join('')}
    <circle cx="268" cy="86" r="42" fill="#F1FBF8" stroke="#0E9384" stroke-width="2.4"/>
    ${Array.from({length:18},(_,k)=>{const a=k*20*Math.PI/180;return `<path d="M${(268+42*Math.cos(a)).toFixed(1)} ${(86+42*Math.sin(a)).toFixed(1)} L${(268+52*Math.cos(a)).toFixed(1)} ${(86+52*Math.sin(a)).toFixed(1)}" stroke="#0E9384" stroke-width="2.8" stroke-linecap="round"/>`;}).join('')}
    <text x="140" y="160" font-size="10.5" font-weight="800" fill="#1D4ED8" text-anchor="middle">톱니 12개</text>
    <text x="268" y="160" font-size="10.5" font-weight="800" fill="#0B6E63" text-anchor="middle">톱니 18개</text>
    <text x="200" y="20" font-size="10.5" fill="#6B7280" text-anchor="middle">다시 처음처럼 만나는 때는?</text>
  </svg>`,
  sit:'두 수 a 와 b 를 바꾸면 <b>최대공약수</b>와 <b>최소공배수</b>가 함께 계산되고, <b>a × b</b> 와 <b>최대공약수 × 최소공배수</b> 가 나란히 표시됩니다. 두 열을 견주면 규칙이 드러납니다.'
 },
 predict:{
  q:['12 와 18 의 톱니바퀴가 다시 처음처럼 만나는 것은 몇 개의 톱니가 지난 뒤일지 예상하세요.',
     '최대공약수와 최소공배수를 곱하면 무엇이 될지 예상하고 까닭도 적으세요.',
     '두 수가 서로소이면 최소공배수는 무엇이 될지 적으세요.'] },
 missions:[
  {t:'a 와 b 를 바꿔 가며 <b>최대공약수</b>와 <b>최소공배수</b>를 보세요.', re:'최소공배수'},
  {t:'<b>a × b</b> 열과 <b>최대공약수 × 최소공배수</b> 열을 견주어 보세요.', re:'최대공약수'},
  {t:'아래 <b>탐구 노트</b>로 마무리하세요 — 지금 값을 <b>기록</b>하고, 두 곱을 <b>계산</b>해 견주고, 다른 수로 <b>판단</b>합니다.',
   re:'탐구 노트 통과',
   do:'① 지금 a·b·최대공약수·최소공배수 적기 ② a×b 와 (최대공약수×최소공배수) 구해 견주기 ③ 다른 a,b 로 바꿔 같은지 확인',
   hand:'a × b = (최대공약수) × (최소공배수) 가 왜 성립하는지 소인수분해로 설명하기'}],
 inquiry:{
  id:'gc35', title:'톱니바퀴는 언제 다시 만날까',
  q:['a 와 b 를 바꿔 가며 8줄 이상 기록하세요.',
     '「a × b」 열과 「최대공약수 × 최소공배수」 열을 견주어 무엇이 같은지 찾으세요.',
     '그 관계가 왜 성립하는지 <b>소인수분해</b>로 손으로 설명하세요.'],
  cols:['a','b','최대공약수','최소공배수','a × b','최대공약수 × 최소공배수'],
  hint:'힌트 — 소인수마다 «작은 쪽 지수»가 최대공약수, «큰 쪽 지수»가 최소공배수입니다. 둘을 곱하면?' },
 apply:{
  q:'새 문제 — 두 수의 최대공약수가 <b>6</b>, 최소공배수가 <b>72</b> 입니다. 두 수의 <b>곱</b>은?',
  a:432, tol:0.5,
  why:'a × b = (최대공약수) × (최소공배수) = 6 × 72 = 432.',
  hint:'두 곱이 같다는 규칙을 그대로 쓰세요.' },
 demo(root){ return gcdDemo(root); }
};

LESSON[36]={
 title:'삼각형의 작도 — 세 변이면 되는가',
 problem:{
  q:'막대 세 개를 주고 «삼각형을 만들어 보라»고 했습니다. 그런데 <b>2 cm · 3 cm · 9 cm</b> 를 주면 아무리 애써도 삼각형이 되지 않습니다. 세 변만 있으면 되는 줄 알았는데 — 무엇이 더 필요할까요?',
  svg:`<svg viewBox="0 0 400 170" role="img" aria-label="삼각형이 되는 세 변과 되지 않는 세 변을 견주는 그림">
    <path d="M30 120 H110" stroke="#2563EB" stroke-width="5" stroke-linecap="round"/>
    <path d="M30 138 H150" stroke="#2563EB" stroke-width="5" stroke-linecap="round"/>
    <path d="M30 102 H190" stroke="#2563EB" stroke-width="5" stroke-linecap="round"/>
    <polygon points="50,74 178,74 132,30" fill="#0E9384" opacity=".14" stroke="#0E9384" stroke-width="2"/>
    <text x="110" y="158" font-size="10.5" font-weight="800" fill="#0B6E63" text-anchor="middle">두 짧은 변의 합 &gt; 긴 변 — 된다</text>
    <path d="M230 120 H262" stroke="#BE123C" stroke-width="5" stroke-linecap="round"/>
    <path d="M230 138 H278" stroke="#BE123C" stroke-width="5" stroke-linecap="round"/>
    <path d="M230 102 H374" stroke="#BE123C" stroke-width="5" stroke-linecap="round"/>
    <path d="M230 74 L262 74 M374 74 L326 74" stroke="#BE123C" stroke-width="2" stroke-dasharray="4 3"/>
    <text x="300" y="158" font-size="10.5" font-weight="800" fill="#BE123C" text-anchor="middle">닿지 않는다 — 안 된다</text>
    <text x="200" y="20" font-size="10.5" fill="#6B7280" text-anchor="middle">세 변이 있으면 언제나 삼각형이 될까?</text>
  </svg>`,
  sit:'세 변의 길이를 직접 바꾸면 삼각형이 <b>그려지거나 그려지지 않습니다.</b> 「가장 긴 변」과 「나머지 두 변의 합」 을 나란히 놓고 보면 경계가 어디인지 드러납니다.'
 },
 predict:{
  q:['2 · 3 · 9 로 삼각형이 안 되는 까닭을 그림으로 설명해 보세요.',
     '삼각형이 되는 조건을 «가장 긴 변»을 써서 한 줄로 적어 보세요.',
     '두 변의 합이 나머지 한 변과 «정확히 같으면» 어떻게 될지 예상하세요.'] },
 missions:[
  {t:'세 변을 바꿔 가며 삼각형이 <b>되는 경우</b>를 만들어 보세요.', re:'된다'},
  {t:'이번에는 <b>안 되는 경우</b>를 만들어 보세요.', re:'안 된다'},
  {t:'아래 <b>탐구 노트</b>로 마무리하세요 — 되는 경우를 <b>기록</b>하고, 두 값을 <b>견주고</b>, 안 되는 경우로 <b>판단</b>합니다.',
   re:'탐구 노트 통과',
   do:'① 되는 세 변과 (가장 긴 변, 나머지 두 변의 합) 적기 ② 두 값의 차 구하기 ③ 안 되는 경우로 바꿔 두 값 다시 견주기',
   hand:'삼각형이 되는 조건을 부등식으로 쓰고, 왜 그런지 «두 변을 펼쳐 닿는다»로 설명하기'}],
 inquiry:{
  id:'cs36', title:'세 변이면 삼각형이 정해지는가',
  q:['세 변을 바꿔 가며 되는 경우와 안 되는 경우를 8줄 이상 기록하세요.',
     '「가장 긴 변」과 「나머지 두 변의 합」 을 견주어 경계가 어디인지 찾으세요.',
     '삼각형이 되는 조건을 <b>부등식</b>으로 쓰고 손으로 설명하세요.'],
  cols:['a','b','c','가장 긴 변','나머지 두 변의 합','삼각형?'],
  hint:'힌트 — 두 짧은 변을 쭉 펼쳐도 긴 변의 두 끝에 «닿지 못하면» 삼각형이 될 수 없습니다.' },
 apply:{
  q:'새 문제 — 두 변이 <b>5</b> 와 <b>9</b> 일 때, 나머지 한 변이 될 수 있는 가장 <b>큰 정수</b>는?',
  a:13, tol:0.5,
  why:'나머지 변 c 는 c < 5 + 9 = 14 이어야 하므로 가장 큰 정수는 13. (c > 4 도 함께 만족해야 합니다.)',
  hint:'가장 긴 변이 나머지 두 변의 합보다 작아야 합니다.' },
 demo(root){ return constructDemo(root); }
};

LESSON[37]={
 title:'다각형의 성질 — 바닥을 채우는 모양',
 problem:{
  q:'욕실 바닥 타일은 <b>정사각형·정삼각형·정육각형</b>뿐입니다. 정오각형 타일은 왜 없을까요? 한 점에 모인 각이 <b>360°</b> 가 되어야 빈틈이 없다는데 — 어떤 정다각형이 그 조건을 만족할까요?',
  svg:`<svg viewBox="0 0 400 170" role="img" aria-label="정오각형은 빈틈이 생기고 정육각형은 빈틈 없이 채워지는 그림">
    <polygon points="__PENT37__" fill="#BE123C" opacity=".12" stroke="#BE123C" stroke-width="2"/>
    <text x="118" y="152" font-size="10.5" font-weight="800" fill="#BE123C" text-anchor="middle">정오각형 — 빈틈이 남는다</text>
    <polygon points="__HEX37__" fill="#0E9384" opacity=".14" stroke="#0E9384" stroke-width="2"/>
    <text x="282" y="152" font-size="10.5" font-weight="800" fill="#0B6E63" text-anchor="middle">정육각형 — 딱 맞는다</text>
    <text x="200" y="20" font-size="10.5" fill="#6B7280" text-anchor="middle">한 내각으로 360° 를 나눌 수 있는가?</text>
  </svg>`,
  sit:'변의 수 n 을 바꾸면 <b>내각의 합</b>과 <b>한 내각</b>이 계산되고, <b>360 ÷ 한 내각</b> 이 나란히 표시됩니다. 이 값이 정수일 때만 한 종류로 바닥을 채울 수 있습니다.'
 },
 predict:{
  q:['정오각형 타일이 없는 까닭을 예상해 적으세요.',
     '한 종류로 바닥을 채우려면 «한 내각»이 어떤 조건을 만족해야 할까요?',
     '정십이각형은 될까요? 예상하고 까닭도 적으세요.'] },
 missions:[
  {t:'n 을 바꿔 가며 <b>한 내각</b>과 <b>360 ÷ 한 내각</b> 을 보세요.', re:'내각'},
  {t:'<b>안 되는</b> n 을 찾아보세요. 무엇이 다른가요?', re:'안 된다'},
  {t:'아래 <b>탐구 노트</b>로 마무리하세요 — 되는 경우를 <b>기록</b>하고, 360÷한 내각을 <b>계산</b>하고, 안 되는 경우로 <b>판단</b>합니다.',
   re:'탐구 노트 통과',
   do:'① 되는 n 과 한 내각 적기 ② 360 ÷ 한 내각 구하기 ③ 안 되는 n 으로 바꿔 값이 정수가 아닌 것 확인',
   hand:'한 종류로 바닥을 채울 수 있는 정다각형이 셋뿐인 까닭을 계산으로 보이기'}],
 inquiry:{
  id:'pg37', title:'바닥 타일은 왜 그 모양들뿐일까',
  q:['n 을 3부터 12까지 바꿔 가며 모두 기록하세요.',
     '「360 ÷ 한 내각」 열을 보세요. 어떤 n 에서 정수가 되나요?',
     '한 종류로 바닥을 채울 수 있는 정다각형이 <b>셋뿐</b>인 까닭을 손으로 설명하세요.'],
  cols:['n','내각의 합','한 내각','360 ÷ 한 내각','한 종류로 채우기'],
  hint:'힌트 — 한 점에 같은 각이 몇 개 모여 360° 가 되려면, 360 ÷ (한 내각) 이 «정수»여야 합니다.' },
 apply:{
  q:'새 문제 — <b>정팔각형</b>의 한 내각은 몇 도일까요?',
  a:135, tol:0.5,
  why:'내각의 합 = 180 × (8 − 2) = 1080°, 한 내각 = 1080 ÷ 8 = 135°.',
  hint:'180 × (n − 2) ÷ n.' },
 demo(root){ return polyDemo(root); }
};

LESSON[38]={
 title:'다면체와 회전체 — 단면으로 알아보기',
 problem:{
  q:'3D 프린터는 입체를 <b>얇게 썬 단면</b>을 한 층씩 쌓아 만듭니다. 그렇다면 거꾸로, <b>단면만 보고</b> 그 입체가 무엇인지 알 수 있을까요? 원뿔과 구는 어떻게 다를까요?',
  svg:`<svg viewBox="0 0 400 170" role="img" aria-label="원뿔·원기둥·구를 가로로 자른 단면을 견주는 그림">
    <path d="M60 130 L100 40 L140 130 Z" fill="#2563EB" opacity=".14" stroke="#2563EB" stroke-width="2"/>
    <ellipse cx="100" cy="130" rx="40" ry="10" fill="#2563EB" opacity=".18" stroke="#2563EB" stroke-width="1.6"/>
    <text x="100" y="156" font-size="10.5" font-weight="800" fill="#1D4ED8" text-anchor="middle">원뿔</text>
    <path d="M180 48 H244 V126 H180 Z" fill="#0E9384" opacity=".14" stroke="#0E9384" stroke-width="2"/>
    <ellipse cx="212" cy="48" rx="32" ry="9" fill="#0E9384" opacity=".2" stroke="#0E9384" stroke-width="1.6"/>
    <ellipse cx="212" cy="126" rx="32" ry="9" fill="#0E9384" opacity=".2" stroke="#0E9384" stroke-width="1.6"/>
    <text x="212" y="156" font-size="10.5" font-weight="800" fill="#0B6E63" text-anchor="middle">원기둥</text>
    <circle cx="310" cy="88" r="42" fill="#B45309" opacity=".13" stroke="#B45309" stroke-width="2"/>
    <ellipse cx="310" cy="88" rx="42" ry="11" fill="#B45309" opacity=".2" stroke="#B45309" stroke-width="1.6"/>
    <text x="310" y="156" font-size="10.5" font-weight="800" fill="#92400E" text-anchor="middle">구</text>
    <text x="200" y="20" font-size="10.5" fill="#6B7280" text-anchor="middle">가로로 자르면 셋 다 원 — 무엇이 다른가?</text>
  </svg>`,
  sit:'입체를 골라 <b>자르는 높이</b>를 바꾸면 단면이 함께 바뀝니다. 다면체는 <b>꼭짓점 v · 모서리 e · 면 f</b> 가 표시되고 <b>v − e + f</b> 가 함께 계산됩니다 — 어떤 다면체든 같은 값이 나오는지 확인합니다.'
 },
 predict:{
  q:['원뿔·원기둥·구를 가로로 자르면 단면이 어떻게 다를지 예상하세요.',
     '정사면체의 꼭짓점·모서리·면의 수를 세어 v − e + f 를 구해 보세요.',
     '다른 다면체에서도 같은 값이 나올지 예상하세요.'] },
 missions:[
  {t:'입체를 바꿔 가며 <b>단면</b>이 어떻게 달라지는지 보세요.', re:'단면'},
  {t:'다면체를 골라 <b>v − e + f</b> 를 확인해 보세요.', re:'다면체'},
  {t:'아래 <b>탐구 노트</b>로 마무리하세요 — 한 다면체를 <b>기록</b>하고, v−e+f 를 <b>계산</b>하고, 다른 다면체로 <b>판단</b>합니다.',
   re:'탐구 노트 통과',
   do:'① 다면체 하나의 v·e·f 적기 ② v − e + f 구하기 ③ 다른 다면체로 바꿔 같은 값인지 확인',
   hand:'v − e + f 가 늘 같다는 것을 «오일러의 다면체 정리»로 정리해 쓰기'}],
 inquiry:{
  id:'sd38', title:'다면체와 회전체 — 단면과 오일러 정리',
  q:['입체를 모두 골라 가며 단면과 v·e·f 를 8줄 이상 기록하세요.',
     '「v − e + f」 열을 보세요. 다면체마다 값이 어떤가요?',
     '회전체에는 왜 v·e·f 를 쓸 수 없는지, 그리고 단면만으로 입체를 가릴 수 있는지 설명하세요.'],
  cols:['입체','종류','v','e','f','v − e + f','단면'],
  hint:'힌트 — 오일러의 다면체 정리는 «구멍이 없는» 다면체에서 성립합니다. 회전체는 꼭짓점과 모서리를 셀 수 없습니다.' },
 apply:{
  q:'새 문제 — 어떤 다면체의 꼭짓점이 <b>8</b> 개, 면이 <b>6</b> 개입니다. 모서리는 몇 개일까요?',
  a:12, tol:0.5,
  why:'v − e + f = 2 이므로 8 − e + 6 = 2 → e = 12. 정육면체입니다.',
  hint:'v − e + f = 2 에 넣어 풀어 보세요.' },
 demo(root){ return solidDemo(root); }
};

LESSON[39]={
 title:'겉넓이와 부피 — 택배 상자의 모양',
 problem:{
  q:'택배 상자는 왜 <b>길쭉하지 않고</b> 정육면체에 가까울까요? 같은 부피를 담더라도 모양에 따라 <b>드는 종이의 양</b>이 다르다면 — 어떤 모양이 가장 적게 들까요?',
  svg:`<svg viewBox="0 0 400 170" role="img" aria-label="부피를 유지하며 가로를 늘릴 때 겉넓이가 어떻게 변하는지 보여 주는 곡선">
    <path d="M44 150 H384 M44 150 V20" stroke="#9CA3AF" stroke-width="1.3"/>
    <path d="__B39__" stroke="#2563EB" stroke-width="2.4" fill="none"/>
    <text x="380" y="36" font-size="10" font-weight="800" fill="#1D4ED8" text-anchor="end">겉넓이 (드는 종이)</text>
    <text x="378" y="142" font-size="9.5" fill="#6B7280" text-anchor="end">가로를 길게 →</text>
    <text x="200" y="166" font-size="10.5" fill="#6B7280" text-anchor="middle">부피는 그대로인데 종이는 어디서 가장 적게 드는가?</text>
  </svg>`,
  sit:'가로·세로를 바꾸면 <b>부피</b>와 <b>겉넓이</b>가 함께 계산되고, 같은 부피의 <b>정육면체보다 몇 % 더 드는지</b> 표시됩니다. 길쭉하게 만들수록 종이가 얼마나 더 드는지 직접 확인합니다.'
 },
 predict:{
  q:['같은 부피라면 어떤 모양이 종이가 가장 적게 들지 예상하세요.',
     '가로를 두 배로 길게 하면 겉넓이가 어떻게 될지 예상하세요.',
     '택배 상자가 정육면체에 가까운 까닭을 적어 보세요.'] },
 missions:[
  {t:'가로·세로를 바꿔 가며 <b>겉넓이</b>가 어떻게 변하는지 보세요.', re:'겉넓이'},
  {t:'<b>정육면체에 가깝게</b> 만들어 보세요. 몇 % 더 드나요?', re:'%'},
  {t:'아래 <b>탐구 노트</b>로 마무리하세요 — 지금 상자를 <b>기록</b>하고, 길쭉하게 바꿔 <b>견주고</b>, 가장 적게 드는 모양을 <b>판단</b>합니다.',
   re:'탐구 노트 통과',
   do:'① 지금 가로·세로·높이·부피·겉넓이 적기 ② 길쭉하게 바꿔 겉넓이 다시 적고 견주기 ③ 정육면체에 가깝게 만들어 확인',
   hand:'같은 부피에서 겉넓이가 가장 작은 모양이 무엇인지 적고 까닭을 설명하기'}],
 inquiry:{
  id:'bx39', title:'택배 상자는 왜 그 크기일까',
  q:['가로·세로를 바꿔 가며 8줄 이상 기록하세요. 부피가 비슷한 것끼리 모으세요.',
     '「정육면체보다 몇 % 더 드나」 열을 보세요. 언제 0 에 가까워지나요?',
     '같은 부피에서 겉넓이가 가장 작은 모양이 무엇인지 손으로 설명하세요.'],
  cols:['가로','세로','높이','부피','겉넓이','정육면체보다 몇 % 더 드나'],
  hint:'힌트 — 길쭉할수록 «옆면»이 넓어집니다. 세 변이 고를수록 겉넓이가 줄어듭니다.' },
 apply:{
  q:'새 문제 — 한 모서리가 <b>10 cm</b> 인 정육면체의 겉넓이는 몇 cm² 일까요?',
  a:600, tol:1,
  why:'정육면체의 겉넓이 = 6 × (한 면의 넓이) = 6 × 10 × 10 = 600 cm².',
  hint:'면이 여섯 개입니다.' },
 demo(root){ return boxDemo(root); }
};

LESSON[40]={
 title:'줄기와 잎 그림 — 무엇을 얻고 무엇을 잃나',
 problem:{
  q:'자료를 그래프로 바꾸면 «한눈에» 들어옵니다. 그런데 히스토그램을 보고 <b>원래의 값 하나하나</b>를 되살릴 수 있나요? 정리하면서 우리는 무엇을 얻고 <b>무엇을 잃을까요?</b>',
  svg:`<svg viewBox="0 0 400 170" role="img" aria-label="줄기와 잎 그림과 히스토그램을 견주는 그림">
    <path d="M96 34 V140" stroke="#111827" stroke-width="1.6"/>
    ${[['6','2 5 8'],['7','1 3 4 7 9'],['8','0 2 5'],['9','1']].map((r,i)=>`<text x="88" y="${52+i*24}" font-size="12" font-weight="800" fill="#1D4ED8" text-anchor="end">${r[0]}</text><text x="104" y="${52+i*24}" font-size="12" fill="#111827">${r[1]}</text>`).join('')}
    <text x="120" y="158" font-size="10.5" font-weight="800" fill="#1D4ED8" text-anchor="middle">줄기와 잎 — 값이 남는다</text>
    ${[3,5,3,1].map((v,i)=>`<rect x="${256+i*30}" y="${140-v*18}" width="26" height="${v*18}" rx="2" fill="#B45309" opacity=".5"/>`).join('')}
    <text x="316" y="158" font-size="10.5" font-weight="800" fill="#92400E" text-anchor="middle">히스토그램 — 값이 사라진다</text>
    <text x="200" y="20" font-size="10.5" fill="#6B7280" text-anchor="middle">정리하면 무엇을 얻고 무엇을 잃는가?</text>
  </svg>`,
  sit:'자료를 하나씩 넣어 <b>줄기와 잎 그림</b>을 만든 뒤, 단추 하나로 <b>히스토그램</b>으로 바꿉니다. 자료의 개수는 그대로인데 «원래 값»과 «중앙값을 셀 수 있는가»가 어떻게 달라지는지 확인합니다.'
 },
 predict:{
  q:['줄기와 잎 그림에서는 중앙값을 셀 수 있을까요? 히스토그램에서는 어떨까요?',
     '히스토그램으로 바꾸면 무엇이 사라질지 예상하세요.',
     '자료를 정리하는 목적이 무엇인지 한 줄로 적어 보세요.'] },
 missions:[
  {t:'자료를 <b>10개 이상</b> 넣어 줄기와 잎 그림을 만들어 보세요.', re:'줄기'},
  {t:'<b>히스토그램</b>으로 바꿔 보세요. 무엇이 달라지나요?', re:'히스토그램'},
  {t:'아래 <b>탐구 노트</b>로 마무리하세요 — 넣은 자료 수를 <b>기록</b>하고, 바꾼 뒤와 <b>견주고</b>, 무엇을 잃는지 <b>판단</b>합니다.',
   re:'탐구 노트 통과',
   do:'① 줄기와 잎에서 넣은 자료 수 적기 ② 히스토그램으로 바꿔 자료 수가 그대로인지 확인 ③ 원래 값이 남는지 판단',
   hand:'«한눈에 보인다»와 «값이 남는다» 중 무엇이 필요한 상황인지 예를 들어 쓰기'}],
 inquiry:{
  id:'st40', title:'원자료를 잃지 않고 정리하려면',
  q:['자료를 넣어 가며 두 정리 방법을 오가고 8줄 이상 기록하세요.',
     '「원래 값이」 열과 「중앙값을 셀 수 있나」 열을 견주세요.',
     '자료를 정리할 때 <b>무엇을 얻고 무엇을 잃는지</b> 손으로 정리하세요.'],
  cols:['정리 방법','넣은 자료 수','원래 값이','중앙값을 셀 수 있나','한눈에 보이는 것'],
  hint:'힌트 — 줄기와 잎은 «값을 그대로 담은 그림»입니다. 히스토그램은 «개수만 담은 그림»입니다.' },
 apply:{
  q:'새 문제 — 줄기와 잎 그림에 자료가 <b>15</b> 개 있습니다. 중앙값은 작은 것부터 세어 <b>몇 번째</b> 값일까요?',
  a:8, tol:0.1,
  why:'15개의 가운데는 (15 + 1) ÷ 2 = 8번째 값입니다.',
  hint:'(자료 수 + 1) ÷ 2.' },
 demo(root){ return stemDemo(root); }
};

"""


def note(no, head, c1, c2, c3):
    return """
 %d:{ h:'%s',
  c:[
%s,
%s,
%s
 ]},
""" % (no, head, c1, c2, c3)


NOTES = (
 note(31, '내가 세고 · 내가 견주고 · 내가 판단한다',
 """  {t:'기록 — <b>SSA</b> 를 고르고 각과 변을 정한 뒤 화면의 값을 적으세요',
   f:'각 A = {0} ° · 변 b = {1} · 그려진 삼각형 개수 = {2}',
   chk(got, r, mem){
     if(!r) return {ok:false, msg:'아직 화면 값이 없습니다.'};
     if(String(r[0]).indexOf('SSA')<0) return {ok:false, msg:'먼저 <b>SSA</b> 를 고르세요. 지금은 '+r[0]+' 입니다.'};
     const A=noteNum(r[1]), b=noteNum(r[2]), n=noteNum(r[3]);
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-A)>0.6||Math.abs(got[1]-b)>0.6)
       return {ok:false, msg:'화면은 각 '+A+'° · 변 '+b+' 입니다.'};
     if(Math.abs(got[2]-n)>0.5) return {ok:false, msg:'그려진 삼각형은 '+n+'개입니다.'};
     mem.n=n; mem.A=A;
     return {ok:true, msg:'기록했습니다 — 조건을 만족하는 삼각형이 '+n+'개입니다.'};
   }}""",
 """  {t:'생각 — <b>SAS</b> 로 바꾼 뒤 개수를 적고, SSA 와 견주세요',
   f:'SAS 에서의 개수 = {0} · SSA 개수 − SAS 개수 = {1}',
   chk(got, r, mem){
     if(mem.n===undefined) return {ok:false, msg:'① 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     if(String(r[0]).indexOf('SAS')<0) return {ok:false, msg:'아직 '+r[0]+' 입니다. SAS 로 바꾸세요.'};
     const n2=noteNum(r[3]);
     if(![0,1].every(j=>isFinite(got[j]))) return {ok:false, msg:'두 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-n2)>0.5) return {ok:false, msg:'지금 개수는 '+n2+' 입니다.'};
     if(Math.abs(got[1]-(mem.n-n2))>0.5) return {ok:false, msg:'①의 개수에서 지금 개수를 빼세요.'};
     mem.n2=n2;
     return {ok:true, msg:'계산했습니다 — SSA 는 '+mem.n+'개, SAS 는 '+n2+'개입니다.'};
   }}""",
 """  {t:'판단 — 두 조건을 견주어 고르세요',
   f:'SSA 개수 = {0} · SAS 개수 = {1}',
   opts:['삼각형이 <b>하나로</b> 정해질 때만 합동 조건이다 — SSA 는 두 개가 나오므로 조건이 아니다',
         '개수와 상관없이 세 값을 알면 모두 합동 조건이다',
         'SAS 가 두 개를 만들므로 조건이 아니다'],
   chk(got, r, mem, pick){
     if(mem.n2===undefined) return {ok:false, msg:'② 칸을 먼저 통과하세요.'};
     if(![0,1].every(j=>isFinite(got[j]))) return {ok:false, msg:'두 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-mem.n)>0.5||Math.abs(got[1]-mem.n2)>0.5)
       return {ok:false, msg:'①②에 적은 개수는 '+mem.n+' 과 '+mem.n2+' 입니다.'};
     if(pick!==0)
       return {ok:false, msg:'SSA 는 '+mem.n+'개, SAS 는 '+mem.n2+'개였습니다. 이 사실을 보고 다시 고르세요.'};
     return {ok:true, msg:'판단했습니다 — <b>합동 조건이란 «하나로 정해진다»는 뜻입니다.</b> SSA 는 두 개가 그려지므로 조건이 될 수 없습니다.'};
   }}""")
 +
 note(32, '내가 재고 · 내가 계산하고 · 내가 판단한다',
 """  {t:'기록 — 중심각과 반지름을 정한 뒤 화면의 값을 적으세요',
   f:'중심각 = {0} ° · 반지름 = {1} · 호의 길이 = {2} · 넓이 = {3}',
   chk(got, r, mem){
     if(!r) return {ok:false, msg:'아직 화면 값이 없습니다.'};
     const a=noteNum(r[0]), rr=noteNum(r[1]), arc=noteNum(r[2]), ar=noteNum(r[3]);
     if(a<20) return {ok:false, msg:'중심각이 '+a+'° 로 너무 작습니다. 20° 이상으로 키우세요.'};
     if(![0,1,2,3].every(j=>isFinite(got[j]))) return {ok:false, msg:'네 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-a)>0.6||Math.abs(got[1]-rr)>0.6)
       return {ok:false, msg:'화면은 중심각 '+a+'° · 반지름 '+rr+' 입니다.'};
     if(Math.abs(got[2]-arc)>0.3||Math.abs(got[3]-ar)>0.6)
       return {ok:false, msg:'화면은 호 '+arc+' · 넓이 '+ar+' 입니다.'};
     mem.a=a; mem.r=rr;
     return {ok:true, msg:'기록했습니다 — 이제 세 비율이 같은지 봅니다.'};
   }}""",
 """  {t:'생각 — <b>32%</b> 를 나타내려면 중심각이 몇 도여야 하는지 구하세요',
   f:'360 × 0.32 = {0} ° · 지금 중심각의 비율 = {1} %',
   chk(got, r, mem){
     if(mem.a===undefined) return {ok:false, msg:'① 칸을 먼저 통과하세요.'};
     if(![0,1].every(j=>isFinite(got[j]))) return {ok:false, msg:'두 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-115.2)>0.8) return {ok:false, msg:'360 × 0.32 를 계산하세요.'};
     if(Math.abs(got[1]-mem.a/360*100)>1.2)
       return {ok:false, msg:'①에 적은 중심각 '+mem.a+'° 가 360° 의 몇 % 인지 구하세요.'};
     mem.ok2=true;
     return {ok:true, msg:'계산했습니다 — 중심각은 «전체를 360등분한 것 중 몇 칸인가»입니다.'};
   }}""",
 """  {t:'판단 — <b>반지름만</b> 바꾼 뒤 세 비율을 다시 보고 고르세요',
   f:'바꾼 반지름 = {0} · 그때 넓이 비율 = {1} %',
   opts:['반지름을 바꿔도 <b>세 비율은 그대로</b>다 — 비율은 중심각만으로 정해진다',
         '반지름을 키우면 넓이 비율도 커진다',
         '반지름을 키우면 호 비율만 커진다'],
   chk(got, r, mem, pick){
     if(!mem.ok2) return {ok:false, msg:'② 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const rr=noteNum(r[1]), pa=noteNum(r[6]);
     if(Math.abs(rr-mem.r)<1) return {ok:false, msg:'반지름이 그대로입니다 — 바꿔 보세요.'};
     if(Math.abs(noteNum(r[0])-mem.a)>0.6) return {ok:false, msg:'중심각은 ①과 같게 두고 반지름만 바꾸세요.'};
     if(![0,1].every(j=>isFinite(got[j]))) return {ok:false, msg:'두 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-rr)>0.6) return {ok:false, msg:'지금 반지름은 '+rr+' 입니다.'};
     if(Math.abs(got[1]-pa)>1.2) return {ok:false, msg:'지금 넓이 비율은 '+r[6]+' 입니다.'};
     if(pick!==0)
       return {ok:false, msg:'반지름을 '+mem.r+' 에서 '+rr+' 로 바꿨는데 넓이 비율은 '+r[6]+' 그대로입니다. 이 사실을 보고 다시 고르세요.'};
     return {ok:true, msg:'판단했습니다 — <b>호도 넓이도 «360° 중 몇 도인가»로만 정해집니다.</b> 반지름은 크기만 바꿀 뿐 비율을 바꾸지 않습니다.'};
   }}""")
 +
 note(33, '내가 세고 · 내가 견주고 · 내가 판단한다',
 """  {t:'기록 — 지금 화면의 세 대푯값을 그대로 적으세요',
   f:'평균 = {0} · 중앙값 = {1} · 최빈값 = {2}',
   chk(got, r, mem){
     if(!r) return {ok:false, msg:'아직 자료가 없습니다. 막대를 세워 보세요.'};
     const me=noteNum(r[1]), md=noteNum(r[2]), mo=noteNum(r[3]);
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-me)>0.15||Math.abs(got[1]-md)>0.6||Math.abs(got[2]-mo)>0.6)
       return {ok:false, msg:'화면은 평균 '+me+' · 중앙값 '+md+' · 최빈값 '+mo+' 입니다.'};
     mem.me=me; mem.mo=mo;
     return {ok:true, msg:'기록했습니다 — 세 대푯값이 같은 자리에 있나요?'};
   }}""",
 """  {t:'생각 — 평균과 최빈값의 <b>차</b>를 구하세요',
   f:'평균 − 최빈값 = {0}',
   chk(got, r, mem){
     if(mem.me===undefined) return {ok:false, msg:'① 칸을 먼저 통과하세요.'};
     if(!isFinite(got[0])) return {ok:false, msg:'칸을 채우세요.'};
     if(Math.abs(got[0]-(mem.me-mem.mo))>0.2) return {ok:false, msg:'①에 적은 평균에서 최빈값을 빼세요.'};
     mem.d=mem.me-mem.mo;
     return {ok:true, msg:'계산했습니다 — 차가 '+mem.d.toFixed(1)+' 입니다. 이 차가 커지는 모양을 만들어 봅시다.'};
   }}""",
 """  {t:'판단 — 막대를 <b>한쪽으로 치우치게</b> 바꾼 뒤 고르세요',
   f:'그때 평균 = {0} · 최빈값 = {1}',
   opts:['«가장 많이 팔리는 치수»는 <b>최빈값</b>이 알려 준다 — 평균은 치우친 자료에서 엉뚱한 곳을 가리킨다',
         '평균이 언제나 가장 믿을 만하다',
         '중앙값이 가장 많이 팔리는 값이다'],
   chk(got, r, mem, pick){
     if(mem.d===undefined) return {ok:false, msg:'② 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const me=noteNum(r[1]), mo=noteNum(r[3]), d2=Math.abs(me-mo);
     if(!(d2 > Math.abs(mem.d)+0.3))
       return {ok:false, msg:'아직 평균과 최빈값의 차가 '+d2.toFixed(1)+' 입니다. 더 치우치게 만들어 차를 키우세요.'};
     if(![0,1].every(j=>isFinite(got[j]))) return {ok:false, msg:'두 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-me)>0.15||Math.abs(got[1]-mo)>0.6)
       return {ok:false, msg:'지금 평균은 '+me+' · 최빈값은 '+mo+' 입니다.'};
     if(pick!==0)
       return {ok:false, msg:'차가 '+Math.abs(mem.d).toFixed(1)+' 에서 '+d2.toFixed(1)+' 로 벌어졌습니다. 이 사실을 보고 다시 고르세요.'};
     return {ok:true, msg:'판단했습니다 — <b>물음이 무엇이냐에 따라 봐야 할 대푯값이 다릅니다.</b> 가게 주인에게 필요한 것은 평균이 아니라 최빈값이었습니다.'};
   }}""")
 +
 note(34, '내가 나누고 · 내가 견주고 · 내가 판단한다',
 """  {t:'기록 — 지금 설정을 그대로 적으세요',
   f:'계급의 크기 = {0} · 계급 수 = {1} · 가장 높은 막대의 도수 = {2}',
   chk(got, r, mem){
     if(!r) return {ok:false, msg:'아직 화면 값이 없습니다.'};
     const w=noteNum(r[0]), k=noteNum(r[2]), c=noteNum(r[4]);
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-w)>0.5||Math.abs(got[1]-k)>0.5||Math.abs(got[2]-c)>0.5)
       return {ok:false, msg:'화면은 계급 크기 '+r[0]+' · 계급 수 '+k+' · 도수 '+c+' 입니다.'};
     mem.w=w; mem.k=k; mem.c=c; mem.peak=String(r[3]);
     return {ok:true, msg:'기록했습니다 — 이제 계급의 크기만 바꿔 봅니다.'};
   }}""",
 """  {t:'생각 — <b>계급의 크기</b>를 바꾼 뒤 다시 적고 견주세요',
   f:'바꾼 계급 크기 = {0} · 그때 계급 수 = {1} · 계급 수의 차 = {2}',
   chk(got, r, mem){
     if(mem.w===undefined) return {ok:false, msg:'① 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const w=noteNum(r[0]), k=noteNum(r[2]);
     if(Math.abs(w-mem.w)<0.5) return {ok:false, msg:'계급 크기가 그대로입니다 — 바꿔 보세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-w)>0.5||Math.abs(got[1]-k)>0.5)
       return {ok:false, msg:'지금은 계급 크기 '+r[0]+' · 계급 수 '+k+' 입니다.'};
     if(Math.abs(got[2]-(mem.k-k))>0.5) return {ok:false, msg:'①의 계급 수에서 지금 계급 수를 빼세요.'};
     mem.peak2=String(r[3]); mem.k2=k;
     return {ok:true, msg:'계산했습니다 — 자료는 그대로인데 계급 수가 '+mem.k+' 에서 '+k+' 로 바뀌었습니다.'};
   }}""",
 """  {t:'판단 — 「가장 높은 막대」가 어디로 갔는지 보고 고르세요',
   f:'지금 가장 높은 막대의 도수 = {0}',
   opts:['자료는 그대로인데 <b>나눈 방법</b>만으로 모양이 달라진다 — 그래서 계급 설정을 먼저 확인해야 한다',
         '계급을 바꾸면 자료 자체가 바뀐다',
         '계급을 어떻게 나눠도 그래프 모양은 같다'],
   chk(got, r, mem, pick){
     if(mem.k2===undefined) return {ok:false, msg:'② 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const c=noteNum(r[4]);
     if(!isFinite(got[0])) return {ok:false, msg:'칸을 채우세요.'};
     if(Math.abs(got[0]-c)>0.5) return {ok:false, msg:'지금 도수는 '+c+' 입니다.'};
     if(pick!==0)
       return {ok:false, msg:'가장 높은 막대가 «'+mem.peak+'» 에서 «'+r[3]+'» 로 옮겨 갔습니다. 이 사실을 보고 다시 고르세요.'};
     return {ok:true, msg:'판단했습니다 — <b>히스토그램은 «자료»와 «나눈 방법»을 함께 보여 줍니다.</b> 그래서 남의 그래프를 볼 때 계급 설정을 먼저 확인해야 합니다.'};
   }}""")
 +
 note(35, '내가 구하고 · 내가 곱해 보고 · 내가 판단한다',
 """  {t:'기록 — a 와 b 를 정한 뒤 화면의 값을 적으세요',
   f:'a = {0} · b = {1} · 최대공약수 = {2} · 최소공배수 = {3}',
   chk(got, r, mem){
     if(!r) return {ok:false, msg:'아직 화면 값이 없습니다.'};
     const a=noteNum(r[0]), b=noteNum(r[1]), g=noteNum(r[2]), l=noteNum(r[3]);
     if(![0,1,2,3].every(j=>isFinite(got[j]))) return {ok:false, msg:'네 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-a)>0.5||Math.abs(got[1]-b)>0.5)
       return {ok:false, msg:'화면은 a = '+a+' · b = '+b+' 입니다.'};
     if(Math.abs(got[2]-g)>0.5||Math.abs(got[3]-l)>0.5)
       return {ok:false, msg:'화면은 최대공약수 '+g+' · 최소공배수 '+l+' 입니다.'};
     mem.a=a; mem.b=b; mem.g=g; mem.l=l;
     return {ok:true, msg:'기록했습니다 — 이제 두 곱을 견주어 봅니다.'};
   }}""",
 """  {t:'생각 — <b>a × b</b> 와 <b>최대공약수 × 최소공배수</b> 를 각각 구하세요',
   f:'a × b = {0} · 최대공약수 × 최소공배수 = {1} · 두 값의 차 = {2}',
   chk(got, r, mem){
     if(mem.a===undefined) return {ok:false, msg:'① 칸을 먼저 통과하세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-mem.a*mem.b)>0.5) return {ok:false, msg:'①에 적은 a 와 b 를 곱하세요.'};
     if(Math.abs(got[1]-mem.g*mem.l)>0.5) return {ok:false, msg:'①에 적은 최대공약수와 최소공배수를 곱하세요.'};
     if(Math.abs(got[2])>0.5) return {ok:false, msg:'두 값을 빼 보세요. 무엇이 나오나요?'};
     mem.ok2=true;
     return {ok:true, msg:'계산했습니다 — 차가 0 입니다. 두 곱이 같습니다.'};
   }}""",
 """  {t:'판단 — a 와 b 를 <b>다른 수</b>로 바꿔 다시 확인한 뒤 고르세요',
   f:'새 a × b = {0} · 새 (최대공약수 × 최소공배수) = {1}',
   opts:['어떤 두 수에서도 <b>a × b = (최대공약수) × (최소공배수)</b> 이다',
         '두 수가 서로소일 때만 그렇다',
         '우연히 그렇게 나온 것이다'],
   chk(got, r, mem, pick){
     if(!mem.ok2) return {ok:false, msg:'② 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const a=noteNum(r[0]), b=noteNum(r[1]), p=noteNum(r[4]), q=noteNum(r[5]);
     if(a===mem.a && b===mem.b) return {ok:false, msg:'a 와 b 가 그대로입니다 — 다른 수로 바꾸세요.'};
     if(![0,1].every(j=>isFinite(got[j]))) return {ok:false, msg:'두 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-p)>0.5||Math.abs(got[1]-q)>0.5)
       return {ok:false, msg:'화면은 '+p+' 와 '+q+' 입니다.'};
     if(pick!==0)
       return {ok:false, msg:'a = '+a+' · b = '+b+' 에서도 두 곱이 '+p+' 로 같습니다. 이 사실을 보고 다시 고르세요.'};
     return {ok:true, msg:'판단했습니다 — <b>a × b = (최대공약수) × (최소공배수).</b> 소인수마다 작은 지수와 큰 지수를 나눠 가진 것이므로, 곱하면 원래의 지수가 됩니다.'};
   }}""")
 +
 note(36, '내가 만들고 · 내가 견주고 · 내가 판단한다',
 """  {t:'기록 — 삼각형이 <b>되는</b> 세 변을 만들어 적으세요',
   f:'가장 긴 변 = {0} · 나머지 두 변의 합 = {1}',
   chk(got, r, mem){
     if(!r) return {ok:false, msg:'아직 화면 값이 없습니다.'};
     if(String(r[5]).indexOf('안')>=0) return {ok:false, msg:'지금은 «'+r[5]+'» 입니다. 삼각형이 되는 세 변으로 바꾸세요.'};
     const mx=noteNum(r[3]), rest=noteNum(r[4]);
     if(![0,1].every(j=>isFinite(got[j]))) return {ok:false, msg:'두 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-mx)>0.5||Math.abs(got[1]-rest)>0.5)
       return {ok:false, msg:'화면은 '+mx+' 와 '+rest+' 입니다.'};
     mem.mx=mx; mem.rest=rest;
     return {ok:true, msg:'기록했습니다 — 두 값 중 어느 쪽이 큰가요?'};
   }}""",
 """  {t:'생각 — 두 값의 <b>차</b>를 구하세요',
   f:'(나머지 두 변의 합) − (가장 긴 변) = {0}',
   chk(got, r, mem){
     if(mem.mx===undefined) return {ok:false, msg:'① 칸을 먼저 통과하세요.'};
     if(!isFinite(got[0])) return {ok:false, msg:'칸을 채우세요.'};
     if(Math.abs(got[0]-(mem.rest-mem.mx))>0.5) return {ok:false, msg:'①에 적은 두 값을 빼세요.'};
     mem.d=mem.rest-mem.mx;
     return {ok:true, msg:'계산했습니다 — 차가 '+mem.d+' 로 <b>양수</b>입니다. 이번에는 안 되는 경우를 만들어 봅니다.'};
   }}""",
 """  {t:'판단 — 삼각형이 <b>안 되는</b> 세 변으로 바꾼 뒤 고르세요',
   f:'그때 (나머지 두 변의 합) − (가장 긴 변) = {0}',
   opts:['나머지 두 변의 합이 <b>가장 긴 변보다 커야</b> 삼각형이 된다',
         '세 변의 길이만 정해지면 언제나 삼각형이 된다',
         '가장 긴 변이 나머지 두 변의 합보다 커야 한다'],
   chk(got, r, mem, pick){
     if(mem.d===undefined) return {ok:false, msg:'② 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     if(String(r[5]).indexOf('안')<0) return {ok:false, msg:'아직 «'+r[5]+'» 입니다. 삼각형이 안 되는 세 변으로 바꾸세요.'};
     const d2=noteNum(r[4])-noteNum(r[3]);
     if(!isFinite(got[0])) return {ok:false, msg:'칸을 채우세요.'};
     if(Math.abs(got[0]-d2)>0.5) return {ok:false, msg:'지금 두 값의 차는 '+d2+' 입니다.'};
     if(pick!==0)
       return {ok:false, msg:'될 때는 차가 '+mem.d+' 였고 안 될 때는 '+d2+' 입니다. 이 사실을 보고 다시 고르세요.'};
     return {ok:true, msg:'판단했습니다 — <b>가장 긴 변 &lt; 나머지 두 변의 합.</b> 두 짧은 변을 쭉 펼쳐도 긴 변의 두 끝에 닿지 못하면 삼각형이 될 수 없습니다.'};
   }}""")
 +
 note(37, '내가 세고 · 내가 나누고 · 내가 판단한다',
 """  {t:'기록 — 바닥을 <b>채울 수 있는</b> n 을 골라 적으세요',
   f:'n = {0} · 내각의 합 = {1} ° · 한 내각 = {2} °',
   chk(got, r, mem){
     if(!r) return {ok:false, msg:'아직 화면 값이 없습니다.'};
     if(String(r[4]).indexOf('안')>=0) return {ok:false, msg:'지금 n 으로는 «'+r[4]+'» 입니다. 채울 수 있는 n 을 고르세요.'};
     const n=noteNum(r[0]), s=noteNum(r[1]), ia=noteNum(r[2]);
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-n)>0.5) return {ok:false, msg:'n 은 '+n+' 입니다.'};
     if(Math.abs(got[1]-s)>1) return {ok:false, msg:'내각의 합은 '+r[1]+' 입니다.'};
     if(Math.abs(got[2]-ia)>0.6) return {ok:false, msg:'한 내각은 '+r[2]+' 입니다.'};
     mem.n=n; mem.ia=ia;
     return {ok:true, msg:'기록했습니다 — 한 점에 이 각이 몇 개 모이면 360° 가 될까요?'};
   }}""",
 """  {t:'생각 — <b>360 ÷ 한 내각</b> 을 구하세요',
   f:'360 ÷ {0} = {1} · 정수이면 1, 아니면 0 → {2}',
   chk(got, r, mem){
     if(mem.ia===undefined) return {ok:false, msg:'① 칸을 먼저 통과하세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-mem.ia)>0.6) return {ok:false, msg:'①에 적은 한 내각을 넣으세요.'};
     const q=360/mem.ia;
     if(Math.abs(got[1]-q)>0.05) return {ok:false, msg:'360 을 '+mem.ia+' 로 나누세요.'};
     if(Math.abs(got[2]-1)>0.01) return {ok:false, msg:'이 n 은 채울 수 있는 경우이므로 정수가 나와야 합니다.'};
     mem.q=q;
     return {ok:true, msg:'계산했습니다 — 한 점에 '+q.toFixed(0)+'개가 모여 360° 가 됩니다.'};
   }}""",
 """  {t:'판단 — 채울 수 <b>없는</b> n 으로 바꾼 뒤 고르세요',
   f:'그때 n = {0} · 360 ÷ 한 내각 = {1}',
   opts:['<b>360 ÷ (한 내각) 이 정수</b>일 때만 한 종류로 바닥을 채울 수 있다',
         '내각의 합이 360° 의 배수이면 채울 수 있다',
         '변이 많을수록 잘 채워진다'],
   chk(got, r, mem, pick){
     if(mem.q===undefined) return {ok:false, msg:'② 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     if(String(r[4]).indexOf('안')<0) return {ok:false, msg:'아직 «'+r[4]+'» 입니다. 채울 수 없는 n 으로 바꾸세요.'};
     const n=noteNum(r[0]), q=noteNum(r[3]);
     if(![0,1].every(j=>isFinite(got[j]))) return {ok:false, msg:'두 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-n)>0.5) return {ok:false, msg:'지금 n 은 '+n+' 입니다.'};
     if(Math.abs(got[1]-q)>0.05) return {ok:false, msg:'지금 값은 '+r[3]+' 입니다.'};
     if(pick!==0)
       return {ok:false, msg:'될 때는 '+mem.q.toFixed(3)+', 안 될 때는 '+r[3]+' 입니다. 이 사실을 보고 다시 고르세요.'};
     return {ok:true, msg:'판단했습니다 — <b>정삼각형·정사각형·정육각형 셋뿐</b>입니다. 360 ÷ (한 내각) 이 정수가 되는 n 이 그 셋밖에 없기 때문입니다.'};
   }}""")
 +
 note(38, '내가 세고 · 내가 계산하고 · 내가 판단한다',
 """  {t:'기록 — <b>다면체</b> 하나를 골라 v · e · f 를 적으세요',
   f:'꼭짓점 v = {0} · 모서리 e = {1} · 면 f = {2}',
   chk(got, r, mem){
     if(!r) return {ok:false, msg:'아직 화면 값이 없습니다.'};
     if(String(r[1]).indexOf('다면체')<0) return {ok:false, msg:'먼저 <b>다면체</b>를 고르세요. 지금은 '+r[1]+' 입니다.'};
     const v=noteNum(r[2]), e=noteNum(r[3]), f=noteNum(r[4]);
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-v)>0.5||Math.abs(got[1]-e)>0.5||Math.abs(got[2]-f)>0.5)
       return {ok:false, msg:'화면은 v = '+v+' · e = '+e+' · f = '+f+' 입니다.'};
     mem.v=v; mem.e=e; mem.f=f; mem.nm=String(r[0]);
     return {ok:true, msg:'기록했습니다 — '+mem.nm+' 의 세 수입니다.'};
   }}""",
 """  {t:'생각 — <b>v − e + f</b> 를 구하세요',
   f:'{0} − {1} + {2} = {3}',
   chk(got, r, mem){
     if(mem.v===undefined) return {ok:false, msg:'① 칸을 먼저 통과하세요.'};
     if(![0,1,2,3].every(j=>isFinite(got[j]))) return {ok:false, msg:'네 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-mem.v)>0.5||Math.abs(got[1]-mem.e)>0.5||Math.abs(got[2]-mem.f)>0.5)
       return {ok:false, msg:'①에 적은 v·e·f 를 그대로 넣으세요.'};
     if(Math.abs(got[3]-(mem.v-mem.e+mem.f))>0.5) return {ok:false, msg:'v − e + f 를 계산하세요.'};
     mem.chi=mem.v-mem.e+mem.f;
     return {ok:true, msg:'계산했습니다 — '+mem.nm+' 에서 v − e + f = '+mem.chi+' 입니다.'};
   }}""",
 """  {t:'판단 — <b>다른 다면체</b>로 바꿔 다시 구한 뒤 고르세요',
   f:'새 다면체의 v − e + f = {0}',
   opts:['구멍이 없는 다면체라면 <b>v − e + f 는 늘 2</b> 이다 — 오일러의 다면체 정리',
         '다면체마다 값이 다르다',
         '면이 많을수록 값이 커진다'],
   chk(got, r, mem, pick){
     if(mem.chi===undefined) return {ok:false, msg:'② 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     if(String(r[1]).indexOf('다면체')<0) return {ok:false, msg:'회전체에는 v·e·f 가 없습니다. 다른 <b>다면체</b>를 고르세요.'};
     if(String(r[0])===mem.nm) return {ok:false, msg:'아직 '+mem.nm+' 입니다 — 다른 다면체로 바꾸세요.'};
     const chi=noteNum(r[5]);
     if(!isFinite(got[0])) return {ok:false, msg:'칸을 채우세요.'};
     if(Math.abs(got[0]-chi)>0.5) return {ok:false, msg:'화면의 v − e + f 는 '+r[5]+' 입니다.'};
     if(pick!==0)
       return {ok:false, msg:mem.nm+' 에서 '+mem.chi+', '+r[0]+' 에서도 '+r[5]+' 입니다. 이 사실을 보고 다시 고르세요.'};
     return {ok:true, msg:'판단했습니다 — <b>v − e + f = 2.</b> 모양이 아무리 달라도 «구멍이 없는» 다면체라면 늘 2 입니다. 회전체는 꼭짓점과 모서리를 셀 수 없어 이 정리를 쓸 수 없습니다.'};
   }}""")
 +
 note(39, '내가 만들고 · 내가 재고 · 내가 판단한다',
 """  {t:'기록 — 지금 상자의 값을 그대로 적으세요',
   f:'부피 = {0} · 겉넓이 = {1}',
   chk(got, r, mem){
     if(!r) return {ok:false, msg:'아직 화면 값이 없습니다.'};
     const V=noteNum(r[3]), S=noteNum(r[4]);
     if(![0,1].every(j=>isFinite(got[j]))) return {ok:false, msg:'두 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-V)>1.5||Math.abs(got[1]-S)>1.5)
       return {ok:false, msg:'화면은 부피 '+V+' · 겉넓이 '+S+' 입니다.'};
     mem.V=V; mem.S=S; mem.ex=noteNum(r[5]);
     return {ok:true, msg:'기록했습니다 — 정육면체보다 '+r[5]+' 더 들고 있습니다.'};
   }}""",
 """  {t:'생각 — 상자를 <b>더 길쭉하게</b> 바꾼 뒤 겉넓이를 다시 적고 견주세요',
   f:'길쭉하게 바꾼 뒤 겉넓이 = {0} · 처음보다 늘어난 양 = {1}',
   chk(got, r, mem){
     if(mem.S===undefined) return {ok:false, msg:'① 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const S2=noteNum(r[4]), ex2=noteNum(r[5]);
     if(!(ex2 > mem.ex + 1))
       return {ok:false, msg:'아직 «'+r[5]+'» 입니다. 더 길쭉하게 만들어 낭비를 키워 보세요.'};
     if(![0,1].every(j=>isFinite(got[j]))) return {ok:false, msg:'두 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-S2)>1.5) return {ok:false, msg:'지금 겉넓이는 '+S2+' 입니다.'};
     if(Math.abs(got[1]-(S2-mem.S))>2) return {ok:false, msg:'지금 겉넓이에서 ①의 겉넓이를 빼세요.'};
     mem.ex2=ex2;
     return {ok:true, msg:'계산했습니다 — 길쭉하게 할수록 종이가 더 듭니다.'};
   }}""",
 """  {t:'판단 — 이번에는 <b>정육면체에 가깝게</b> 만든 뒤 고르세요',
   f:'그때 «정육면체보다 몇 % 더 드나» = {0} %',
   opts:['같은 부피라면 <b>정육면체에 가까울수록</b> 종이가 적게 든다',
         '길쭉할수록 종이가 적게 든다',
         '모양과 상관없이 종이는 같이 든다'],
   chk(got, r, mem, pick){
     if(mem.ex2===undefined) return {ok:false, msg:'② 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const ex=noteNum(r[5]);
     if(!(ex < mem.ex2 - 1)) return {ok:false, msg:'아직 «'+r[5]+'» 입니다. 세 변을 고르게 만들어 낭비를 줄이세요.'};
     if(!isFinite(got[0])) return {ok:false, msg:'칸을 채우세요.'};
     if(Math.abs(got[0]-ex)>1.2) return {ok:false, msg:'지금 값은 '+r[5]+' 입니다.'};
     if(pick!==0)
       return {ok:false, msg:'길쭉할 때는 '+mem.ex2+'%, 고를 때는 '+ex+'% 입니다. 이 사실을 보고 다시 고르세요.'};
     return {ok:true, msg:'판단했습니다 — <b>같은 부피에서 겉넓이가 가장 작은 직육면체는 정육면체입니다.</b> 택배 상자가 정육면체에 가까운 까닭이 이것입니다.'};
   }}""")
 +
 note(40, '내가 담고 · 내가 바꾸고 · 내가 판단한다',
 """  {t:'기록 — <b>줄기와 잎</b> 그림에 자료를 10개 이상 넣고 적으세요',
   f:'넣은 자료 수 = {0}',
   chk(got, r, mem){
     if(!r) return {ok:false, msg:'아직 화면 값이 없습니다.'};
     if(String(r[0]).indexOf('줄기')<0) return {ok:false, msg:'먼저 <b>줄기와 잎</b> 그림으로 두세요. 지금은 '+r[0]+' 입니다.'};
     const n=noteNum(r[1]);
     if(n<10) return {ok:false, msg:'자료가 '+n+'개뿐입니다. 10개 이상 넣으세요.'};
     if(!isFinite(got[0])) return {ok:false, msg:'칸을 채우세요.'};
     if(Math.abs(got[0]-n)>0.5) return {ok:false, msg:'넣은 자료는 '+n+'개입니다.'};
     mem.n=n;
     return {ok:true, msg:'기록했습니다 — 이 그림에서는 원래 값이 «'+r[2]+'».'};
   }}""",
 """  {t:'생각 — <b>히스토그램</b>으로 바꾼 뒤 자료 수가 그대로인지 보세요',
   f:'바꾼 뒤 자료 수 = {0} · 처음과 같으면 1, 다르면 0 → {1}',
   chk(got, r, mem){
     if(mem.n===undefined) return {ok:false, msg:'① 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     if(String(r[0]).indexOf('히스토그램')<0) return {ok:false, msg:'아직 '+r[0]+' 입니다. 히스토그램으로 바꾸세요.'};
     const n=noteNum(r[1]);
     if(![0,1].every(j=>isFinite(got[j]))) return {ok:false, msg:'두 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-n)>0.5) return {ok:false, msg:'지금 자료 수는 '+n+'개입니다.'};
     const same = Math.abs(n-mem.n)<0.5 ? 1 : 0;
     if(Math.abs(got[1]-same)>0.01) return {ok:false, msg:'①의 '+mem.n+'개와 견주어 다시 판단하세요.'};
     mem.same=same;
     return {ok:true, msg:'계산했습니다 — 자료의 <b>개수</b>는 그대로입니다. 그런데 원래 값은 «'+r[2]+'».'};
   }}""",
 """  {t:'판단 — 두 그림에서 「원래 값이」 칸이 어떻게 달랐는지 보고 고르세요',
   f:'지금 자료 수 = {0}',
   opts:['개수는 그대로지만 <b>원래 값 하나하나는 사라진다</b> — 정리하면 한눈에 보이는 대신 잃는 것이 있다',
         '히스토그램으로 바꾸면 자료 수도 줄어든다',
         '두 그림에서 얻는 것과 잃는 것이 똑같다'],
   chk(got, r, mem, pick){
     if(mem.same===undefined) return {ok:false, msg:'② 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const n=noteNum(r[1]);
     if(!isFinite(got[0])) return {ok:false, msg:'칸을 채우세요.'};
     if(Math.abs(got[0]-n)>0.5) return {ok:false, msg:'지금 자료 수는 '+n+'개입니다.'};
     if(pick!==0)
       return {ok:false, msg:'자료 수는 '+mem.n+'개 그대로인데 원래 값은 «'+r[2]+'» 입니다. 이 사실을 보고 다시 고르세요.'};
     return {ok:true, msg:'판단했습니다 — <b>정리는 공짜가 아닙니다.</b> 한눈에 보이는 것을 얻는 대신 값 하나하나를 잃습니다. 무엇이 필요한 상황인지 먼저 정해야 합니다.'};
   }}""")
)


def main(path):
    h = open(path, encoding='utf-8').read()
    if 'LESSON[31]=' in h:
        print('이미 반영됨')
        return
    L = (LESSONS.replace('__TRI31__', TRI31).replace('__SEC32__', SEC32)
         .replace('__PENT37__', PENT37).replace('__HEX37__', HEX37).replace('__B39__', B39))
    a = 'LESSON[356]={'
    assert h.count(a) == 1
    h = h.replace(a, L + a, 1)
    b = '\n};\n\nfunction labNo(spec)'
    assert h.count(b) == 1
    h = h.replace(b, NOTES + b, 1)
    open(path, 'w', encoding='utf-8').write(h)
    print('LAB 31~40 수업 모형 + 탐구 노트 삽입 — 파일 %.2f MB' % (len(h.encode('utf-8')) / 1048576))


if __name__ == '__main__':
    main(sys.argv[1])
