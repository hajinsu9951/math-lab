# -*- coding: utf-8 -*-
"""LAB 61~70 — 7단계 수업 모형 + 탐구 노트.

실험 화면은 이미 있는 열 개 데모를 그대로 쓴다 (patch_demo_read.py 로 read() 를 내주게 해 두었다).
그림은 좌표를 **계산해서** 그린다 — 눈대중으로 찍지 않는다.

사용: python docs/LAB61_70_수업모형/patch_lab61_70.py src/40-demos.js
"""
import sys, math

# ── LAB 61 · 2~60 의 체 (60칸, 10열) ─────────────────────────────
def sieve61():
    N, COLS, CW, CH, X0, Y0 = 60, 10, 27, 22, 58, 26
    gone = set()
    for p in (2, 3, 5, 7):
        for m in range(p * p, N + 1, p):
            gone.add(m)
    out = []
    for n in range(2, N + 1):
        k = n - 2
        x, y = X0 + (k % COLS) * CW, Y0 + (k // COLS) * CH
        if n in gone:
            out.append('<rect x="%d" y="%d" width="22" height="17" rx="2" fill="#E5E7EB"/>' % (x, y))
            out.append('<path d="M%d %d L%d %d" stroke="#9CA3AF" stroke-width="1.2"/>'
                       % (x + 3, y + 3, x + 19, y + 14))
        else:
            col = '#BE123C' if n in (2, 3, 5, 7) else '#1D4ED8'
            out.append('<rect x="%d" y="%d" width="22" height="17" rx="2" fill="%s" opacity=".16"/>'
                       % (x, y, col))
            out.append('<text x="%d" y="%d" font-size="10" font-weight="800" fill="%s" text-anchor="middle">%d</text>'
                       % (x + 11, y + 13, col, n))
    return ''.join(out)


S61 = sieve61()

# ── LAB 62 · 예보 오차 막대 (합은 0, |오차| 합은 12) ──────────────
E62 = [3, -3, 4, -4, 2]
def bars62():
    X0, BW, GAP, ZERO, SC = 66, 34, 22, 92, 9.0
    out = ['<path d="M50 %d H372" stroke="#9CA3AF" stroke-width="1.4"/>' % ZERO]
    for i, e in enumerate(E62):
        x = X0 + i * (BW + GAP)
        h = abs(e) * SC
        y = ZERO - h if e > 0 else ZERO
        col = '#2563EB' if e > 0 else '#BE123C'
        out.append('<rect x="%d" y="%.1f" width="%d" height="%.1f" rx="2" fill="%s" opacity=".78"/>'
                   % (x, y, BW, h, col))
        out.append('<text x="%d" y="%.1f" font-size="10.5" font-weight="800" fill="%s" text-anchor="middle">%+d</text>'
                   % (x + BW // 2, y - 5 if e > 0 else y + h + 13, col, e))
        out.append('<text x="%d" y="150" font-size="9.5" fill="#6B7280" text-anchor="middle">%d일</text>'
                   % (x + BW // 2, i + 1))
    return ''.join(out)


B62 = bars62()

# ── LAB 67 · 부채꼴을 잘라 붙인 평행사변형 ────────────────────────
def fan67():
    """중심각 120°, r = 54. 호 l = r·θ. 여섯 조각을 번갈아 붙인 띠."""
    r, ang, n = 54.0, 120.0, 6
    cx, cy = 96.0, 104.0
    t0 = math.radians(-ang / 2 - 90)
    step = math.radians(ang) / n
    out = []
    for k in range(n):
        a, b = t0 + k * step, t0 + (k + 1) * step
        out.append('<path d="M%.1f %.1f L%.1f %.1f A%.1f %.1f 0 0 1 %.1f %.1f Z" fill="%s" opacity=".30" stroke="#2563EB" stroke-width="1"/>'
                   % (cx, cy, cx + r * math.cos(a), cy + r * math.sin(a), r, r,
                      cx + r * math.cos(b), cy + r * math.sin(b),
                      '#2563EB' if k % 2 == 0 else '#0E9384'))
    # 오른쪽 — 같은 조각을 번갈아 뒤집어 붙인 띠. 가로는 l/2, 세로는 r
    l = r * math.radians(ang)          # 호의 길이
    w = l / 2
    bx, by = 232.0, 132.0
    sw = w / (n / 2)
    for k in range(n):
        up = k % 2 == 0
        x = bx + (k // 2) * sw + (0 if up else sw * 0.5)
        col = '#2563EB' if up else '#0E9384'
        if up:
            pts = [(x, by), (x + sw, by), (x + sw * 0.5, by - r)]
        else:
            pts = [(x, by - r), (x + sw, by - r), (x + sw * 0.5, by)]
        out.append('<polygon points="%s" fill="%s" opacity=".30" stroke="%s" stroke-width="1"/>'
                   % (' '.join('%.1f,%.1f' % p for p in pts), col, col))
    out.append('<path d="M%.1f %.1f V%.1f" stroke="#BE123C" stroke-width="1.6"/>' % (bx - 10, by, by - r))
    out.append('<text x="%.1f" y="%.1f" font-size="10" font-weight="800" fill="#BE123C" text-anchor="end">r</text>'
               % (bx - 14, by - r / 2 + 4))
    out.append('<path d="M%.1f %.1f H%.1f" stroke="#B45309" stroke-width="1.6"/>' % (bx, by + 12, bx + w))
    out.append('<text x="%.1f" y="%.1f" font-size="10" font-weight="800" fill="#92400E" text-anchor="middle">l / 2</text>'
               % (bx + w / 2, by + 26))
    return ''.join(out)


F67 = fan67()

# ── LAB 68 · 한 꼭짓점에 모인 각 (정오각형 3장 = 324°) ────────────
def vtx68():
    out, cx, cy, R = [], 200.0, 96.0, 58.0
    used = 0.0
    for k in range(3):
        a0 = math.radians(-90 + used)
        a1 = math.radians(-90 + used + 108)
        out.append('<path d="M%.1f %.1f L%.1f %.1f A%.1f %.1f 0 0 1 %.1f %.1f Z" fill="#2563EB" opacity=".18" stroke="#2563EB" stroke-width="1.6"/>'
                   % (cx, cy, cx + R * math.cos(a0), cy + R * math.sin(a0), R, R,
                      cx + R * math.cos(a1), cy + R * math.sin(a1)))
        used += 108
    g0 = math.radians(-90 + used)
    g1 = math.radians(-90 + 360)
    out.append('<path d="M%.1f %.1f L%.1f %.1f A%.1f %.1f 0 0 1 %.1f %.1f Z" fill="#BE123C" opacity=".22" stroke="#BE123C" stroke-width="1.6" stroke-dasharray="4 3"/>'
               % (cx, cy, cx + R * math.cos(g0), cy + R * math.sin(g0), R, R,
                  cx + R * math.cos(g1), cy + R * math.sin(g1)))
    mid = math.radians(-90 + used + 18)
    out.append('<text x="%.1f" y="%.1f" font-size="10" font-weight="800" fill="#BE123C" text-anchor="middle">남는 틈</text>'
               % (cx + (R + 24) * math.cos(mid), cy + (R + 24) * math.sin(mid) + 4))
    return ''.join(out)


V68 = vtx68()

# ── LAB 69 · 800x ≤ 5000 ─────────────────────────────────────────
def line69():
    X = lambda x: 52 + 40 * x
    out = ['<path d="M40 100 H384" stroke="#9CA3AF" stroke-width="1.4"/>']
    for k in range(9):
        out.append('<path d="M%.0f 94 V106" stroke="#9CA3AF" stroke-width="1.1"/>' % X(k))
        out.append('<text x="%.0f" y="122" font-size="10" fill="#6B7280" text-anchor="middle">%d</text>' % (X(k), k))
    out.append('<rect x="%.0f" y="86" width="%.0f" height="14" rx="3" fill="#2563EB" opacity=".22"/>'
               % (X(0), X(6.25) - X(0)))
    out.append('<circle cx="%.0f" cy="93" r="5" fill="#BE123C"/>' % X(6.25))
    out.append('<text x="%.0f" y="74" font-size="10.5" font-weight="800" fill="#BE123C" text-anchor="middle">6.25</text>' % X(6.25))
    out.append('<circle cx="%.0f" cy="93" r="5.4" fill="#0E9384"/>' % X(6))
    out.append('<text x="%.0f" y="58" font-size="10.5" font-weight="800" fill="#0B6E63" text-anchor="middle">실제로 살 수 있는 수</text>' % X(4.6))
    out.append('<path d="M%.0f 62 L%.0f 86" stroke="#0E9384" stroke-width="1.3"/>' % (X(4.6), X(6)))
    return ''.join(out)


L69 = line69()

# ── LAB 70 · 20 개의 짝수 학번을 m = 10 과 m = 7 로 ────────────────
IDS70 = [2026000 + 2 * k for k in range(20)]
def hash70():
    out = []
    for j, (m, y, col) in enumerate(((10, 52, '#BE123C'), (7, 116, '#0E9384'))):
        cnt = {}
        for i in IDS70:
            cnt[i % m] = cnt.get(i % m, 0) + 1
        for s in range(m):
            x = 66 + s * 28
            c = cnt.get(s, 0)
            out.append('<rect x="%d" y="%d" width="24" height="30" rx="3" fill="#F3F4F6" stroke="#D1D5DB" stroke-width="1"/>' % (x, y))
            if c:
                h = min(26, 5 * c)
                out.append('<rect x="%d" y="%d" width="24" height="%d" rx="3" fill="%s" opacity=".55"/>' % (x, y + 30 - h, h, col))
                out.append('<text x="%d" y="%d" font-size="9.5" font-weight="800" fill="%s" text-anchor="middle">%d</text>' % (x + 12, y + 44, col, c))
        out.append('<text x="52" y="%d" font-size="10.5" font-weight="800" fill="%s" text-anchor="end">m=%d</text>' % (y + 20, col, m))
    return ''.join(out)


H70 = hash70()


LESSONS = """LESSON[61]={
 title:'에라토스테네스의 체 — 어디까지 걸러야 끝날까',
 problem:{
  q:'2 부터 120 까지의 <b>소수를 빠짐없이</b> 찾으려 합니다. 2 의 배수를 지우고, 3 의 배수를 지우고… 이렇게 계속하면 <b>언제 멈춰도 될까요?</b> 119 까지 다 해 봐야 할까요?',
  svg:`<svg viewBox="0 0 400 170" role="img" aria-label="2부터 60까지의 수에서 2·3·5·7 의 배수를 지우고 남은 소수를 보여 주는 체">
    __S61__
    <text x="200" y="16" font-size="10.5" fill="#6B7280" text-anchor="middle">2·3·5·7 의 배수만 지웠는데 — 남은 것은 전부 소수다</text>
    <text x="200" y="164" font-size="10.5" fill="#6B7280" text-anchor="middle">어디까지 걸러야 «더 지울 것이 없다»가 될까?</text>
  </svg>`,
  sit:'소수 하나를 고를 때마다 그 배수가 지워지고, <b>새로 지운 수</b>가 몇 개인지 표시됩니다. 「p²」 열과 120 을 견주면, <b>새로 지워지는 것이 0 이 되는 경계</b>가 어디인지 눈에 보입니다.'
 },
 predict:{
  q:['120 까지의 소수를 찾을 때 어느 소수까지 걸러야 할지 예상하고 까닭도 적으세요.',
     'p 의 배수를 지울 때 왜 p × p 부터 지워도 되는지 예상해 적으세요.',
     '마지막에 남은 수들이 모두 소수인 까닭을 한 줄로 적어 보세요.'] },
 missions:[
  {t:'소수를 하나씩 눌러 걸러 보세요. <b>새로 지운 수</b>가 어떻게 줄어드나요?', re:'지운'},
  {t:'「p²」 가 <b>120 을 넘는</b> 순간을 찾아보세요.', re:'p²'},
  {t:'아래 <b>탐구 노트</b>로 마무리하세요 — 거른 소수를 <b>기록</b>하고, p² 을 120 과 <b>견주고</b>, 멈출 자리를 <b>판단</b>합니다.',
   re:'탐구 노트 통과',
   do:'① 지금 거른 소수 p 와 p² 적기 ② 새로 지운 수가 0 이 되는 p 찾기 ③ p² 과 120 을 견주기',
   hand:'p² > 120 이면 더 지울 것이 없는 까닭을 «작은 인수는 이미 걸러졌다»로 설명하기'}],
 inquiry:{
  id:'sv61', title:'어디까지 거르면 끝날까',
  q:['소수 하나로 거를 때마다 기록하세요 — 새로 지운 개수가 0 이 될 때까지.',
     '「p²」 열과 120 을 견주세요. 경계가 어디인가요?',
     'p 로 거를 때 p² 부터 지워도 되는 까닭을 손으로 설명하세요.'],
  cols:['거른 소수 p','p²','새로 지운 수','남은 수','√120 넘었나'],
  hint:'힌트 — 합성수 n 이 있다면 √n 이하의 인수를 반드시 하나 갖습니다. 그 인수로 이미 지워졌습니다.' },
 apply:{
  q:'새 문제 — 2 부터 <b>200</b> 까지의 소수를 모두 찾으려면, 어느 소수까지 걸러야 충분할까요? (그 소수의 값)',
  a:13, tol:0.5,
  why:'√200 ≒ 14.1 이므로 14 이하의 소수 2·3·5·7·11·13 까지만 거르면 됩니다. 17² = 289 는 이미 200 을 넘습니다.',
  hint:'√200 보다 작은 소수까지만 거르면 됩니다.' },
 demo(root){ return sieveDemo(root); }
};

LESSON[62]={
 title:'오차는 어떻게 재야 공평할까 — 절댓값',
 problem:{
  q:'일기예보가 5일 동안 <b>+3 · −3 · +4 · −4 · +2</b> 만큼 빗나갔습니다. 그냥 더하면 <b>+2</b> — 거의 맞힌 것처럼 보입니다. 그런데 정말 잘 맞힌 예보일까요?',
  svg:`<svg viewBox="0 0 400 170" role="img" aria-label="5일간의 예보 오차 막대 — 위아래로 상쇄되어 합이 거의 0이 된다">
    __B62__
    <text x="200" y="20" font-size="10.5" fill="#6B7280" text-anchor="middle">위로 넘친 것과 아래로 모자란 것이 서로 지워진다</text>
    <text x="200" y="166" font-size="10.5" fill="#6B7280" text-anchor="middle">부호를 그대로 두면 «틀린 정도»가 사라진다</text>
  </svg>`,
  sit:'예측 점을 <b>직접 끌어</b> 오차를 만들면 <b>부호 합</b> 과 <b>|오차| 합</b> 이 나란히 계산됩니다. 부호 합이 0 인데도 예보가 엉망인 배치를 직접 만들어 볼 수 있습니다.'
 },
 predict:{
  q:['오차 +3 과 −3 을 더하면 0 입니다. 이 예보는 완벽할까요? 까닭도 적으세요.',
     '«틀린 정도»를 공평하게 재려면 무엇을 지워야 할까요?',
     '절댓값이 «거리»라는 말의 뜻을 한 줄로 적어 보세요.'] },
 missions:[
  {t:'예측 점을 끌어 <b>부호 합이 0</b> 인데 예보가 엉망인 배치를 만들어 보세요.', re:'부호'},
  {t:'그때 <b>|오차| 합</b> 이 얼마인지 보세요.', re:'오차'},
  {t:'아래 <b>탐구 노트</b>로 마무리하세요 — 두 합을 <b>기록</b>하고, 더 나쁘게 만들어 <b>견주고</b>, 어느 쪽이 실력을 재는지 <b>판단</b>합니다.',
   re:'탐구 노트 통과',
   do:'① 지금 부호 합과 |오차| 합 적기 ② 부호 합은 그대로 두고 더 크게 빗나가게 만들기 ③ 두 합의 변화를 견주기',
   hand:'부호 합이 0 이 되는 까닭을 «상쇄»로 설명하고, 절댓값이 «거리»임을 수직선으로 쓰기'}],
 inquiry:{
  id:'ae62', title:'오차는 어떻게 재야 공평할까',
  q:['예측 점을 끌어 여러 배치를 만들며 8줄 이상 기록하세요. 부호 합이 0 인 배치를 꼭 넣으세요.',
     '「부호 합」과 「|오차| 합」을 견주세요. 어느 쪽이 예보의 실력을 재나요?',
     '절댓값이 «거리»라는 뜻임을 수직선 그림으로 손으로 설명하세요.'],
  cols:['1일','2일','3일','4일','5일','부호 합','|오차| 합'],
  hint:'힌트 — +3 과 −3 은 «반대 방향으로 같은 거리»입니다. 방향을 지우고 거리만 남기는 것이 절댓값입니다.' },
 apply:{
  q:'새 문제 — 오차가 <b>+4 · −4 · +2 · −2 · +3</b> 일 때 <b>|오차| 의 합</b>은?',
  a:15, tol:0.5,
  why:'4 + 4 + 2 + 2 + 3 = 15. 부호 합은 +3 이지만, 실제로 빗나간 거리의 합은 15 입니다.',
  hint:'부호를 떼고 모두 더하세요.' },
 demo(root){ return absErrDemo(root); }
};

LESSON[63]={
 title:'식의 값과 대입 — 식 자판기',
 problem:{
  q:'<b>2a</b> 에 a = 7 을 넣으면 얼마일까요? 많은 학생이 <b>27</b> 이라고 씁니다. 왜 그런 착각이 생길까요? 그리고 정답은 왜 14 일까요?',
  svg:`<svg viewBox="0 0 400 170" role="img" aria-label="숫자 카드를 넣으면 식의 값이 나오는 자판기 그림">
    <rect x="128" y="24" width="144" height="118" rx="12" fill="#2563EB" opacity=".10" stroke="#2563EB" stroke-width="1.8"/>
    <rect x="150" y="44" width="100" height="30" rx="6" fill="#fff" stroke="#9CA3AF" stroke-width="1.3"/>
    <text x="200" y="64" font-size="15" font-weight="800" fill="#111827" text-anchor="middle">2a</text>
    <rect x="150" y="98" width="100" height="30" rx="6" fill="#0E9384" opacity=".16" stroke="#0E9384" stroke-width="1.3"/>
    <text x="200" y="118" font-size="15" font-weight="800" fill="#0B6E63" text-anchor="middle">?</text>
    <rect x="42" y="66" width="52" height="36" rx="6" fill="#B45309" opacity=".18" stroke="#B45309" stroke-width="1.5"/>
    <text x="68" y="90" font-size="16" font-weight="800" fill="#92400E" text-anchor="middle">7</text>
    <path d="M98 84 H124" stroke="#B45309" stroke-width="2"/>
    <path d="M118 79 L124 84 L118 89" fill="none" stroke="#B45309" stroke-width="2"/>
    <text x="336" y="78" font-size="12" font-weight="800" fill="#BE123C" text-anchor="middle">27 ?</text>
    <text x="336" y="100" font-size="12" font-weight="800" fill="#0B6E63" text-anchor="middle">14 ?</text>
    <text x="200" y="164" font-size="10.5" fill="#6B7280" text-anchor="middle">2a 의 2 와 a 사이에는 «보이지 않는 곱셈 기호»가 있다</text>
  </svg>`,
  sit:'네 가지 식 중 하나를 고르고 숫자 카드를 넣으면 <b>식의 값</b> 이 나옵니다. <b>a 를 1 키웠을 때</b> 값이 얼마씩 변하는지도 함께 표시되어, 일차식과 이차식의 차이가 드러납니다.'
 },
 predict:{
  q:['2a 에 a = 7 을 넣은 값을 적고, 왜 그렇게 되는지 쓰세요.',
     '2a + 3 에서 a 를 1 키우면 값은 얼마나 커질까요?',
     'a² 에서 a 를 1 키우면 값이 «일정하게» 커질까요, «점점 크게» 커질까요?'] },
 missions:[
  {t:'식을 고르고 숫자 카드를 넣어 <b>식의 값</b>을 보세요.', re:'식'},
  {t:'a 를 1 키웠을 때 <b>값의 변화</b> 가 어떻게 되는지 보세요.', re:'변화'},
  {t:'아래 <b>탐구 노트</b>로 마무리하세요 — 값을 <b>기록</b>하고, 한 칸 키워 <b>견주고</b>, 식의 성격을 <b>판단</b>합니다.',
   re:'탐구 노트 통과',
   do:'① 지금 식·넣은 a·식의 값 적기 ② a 를 1 키운 값과의 차 구하기 ③ 식을 바꿔 그 차가 일정한지 보기',
   hand:'2a 에 7 을 넣어 27 이 나오는 잘못을 «생략된 곱셈 기호»로 설명하기'}],
 inquiry:{
  id:'sb63', title:'식 자판기 — 식의 값과 대입',
  q:['네 가지 식에 카드를 여러 장 넣어 8줄 이상 기록하세요.',
     '「값의 변화」 열을 식마다 견주세요. 일정한 식과 점점 커지는 식이 무엇인가요?',
     '2a 에 7 을 넣어 27 이 나오는 잘못을 손으로 설명하세요.'],
  cols:['식','넣은 a','식의 값','a 를 1 키우면','값의 변화'],
  hint:'힌트 — 2a+3 은 «일정하게», a² 은 «점점 크게» 변합니다. 그 차이가 일차식과 이차식의 차이입니다.' },
 apply:{
  q:'새 문제 — <b>3a − 5</b> 에 a = 7 을 넣으면?',
  a:16, tol:0.5,
  why:'3 × 7 − 5 = 21 − 5 = 16. 3a 는 «3 과 a 를 곱한다»는 뜻입니다.',
  hint:'3a 는 3 × a 입니다.' },
 demo(root){ return substDemo(root); }
};

LESSON[64]={
 title:'소금물을 5 % 로 — 비율과 방정식',
 problem:{
  q:'소금 <b>20 g</b> 에 물 <b>180 g</b> 을 섞으면 10 % 소금물입니다. 여기에 물을 부어 <b>5 %</b> 로 만들려고 합니다. 소금은 한 알도 늘지 않는데 농도만 내려갑니다 — <b>물을 몇 g 부어야 할까요?</b>',
  svg:`<svg viewBox="0 0 400 170" role="img" aria-label="소금의 양은 그대로 두고 물만 부어 농도를 반으로 낮추는 두 비커">
    <path d="M78 34 V128 a10 10 0 0 0 10 10 H136 a10 10 0 0 0 10 -10 V34" fill="none" stroke="#9CA3AF" stroke-width="2"/>
    <path d="M78 74 V128 a10 10 0 0 0 10 10 H136 a10 10 0 0 0 10 -10 V74 Z" fill="#2563EB" opacity=".20"/>
    <text x="112" y="106" font-size="12" font-weight="800" fill="#1D4ED8" text-anchor="middle">10 %</text>
    <text x="112" y="154" font-size="10" fill="#6B7280" text-anchor="middle">소금 20 · 물 180</text>
    <path d="M254 34 V128 a10 10 0 0 0 10 10 H312 a10 10 0 0 0 10 -10 V34" fill="none" stroke="#9CA3AF" stroke-width="2"/>
    <path d="M254 44 V128 a10 10 0 0 0 10 10 H312 a10 10 0 0 0 10 -10 V44 Z" fill="#0E9384" opacity=".20"/>
    <text x="288" y="100" font-size="12" font-weight="800" fill="#0B6E63" text-anchor="middle">5 %</text>
    <text x="288" y="154" font-size="10" fill="#6B7280" text-anchor="middle">소금 20 · 물 180 + x</text>
    <path d="M166 86 H232" stroke="#B45309" stroke-width="2"/>
    <path d="M226 81 L232 86 L226 91" fill="none" stroke="#B45309" stroke-width="2"/>
    <text x="199" y="78" font-size="10.5" font-weight="800" fill="#92400E" text-anchor="middle">물만 붓는다</text>
    <text x="200" y="22" font-size="10.5" fill="#6B7280" text-anchor="middle">변하지 않는 것은 소금 20 g — 변하는 것은 전체의 양</text>
  </svg>`,
  sit:'단추를 눌러 <b>소금</b>이나 <b>물</b>을 넣으면 농도가 다시 계산되고, 목표 5 % 까지 <b>몇 g 더 필요한지</b> 도 함께 표시됩니다. 분자가 변하는지 분모가 변하는지 직접 확인할 수 있습니다.'
 },
 predict:{
  q:['물을 부으면 왜 농도가 내려가는지 «분자·분모»로 적어 보세요.',
     '5 % 로 만들려면 전체가 몇 g 이 되어야 할지 예상하세요.',
     '소금을 더 넣어 5 % 로 낮출 수 있을까요? 까닭도 적으세요.'] },
 missions:[
  {t:'물을 부어 보세요. <b>농도</b>가 어떻게 변하나요?', re:'농도'},
  {t:'<b>5 % 까지 물</b> 이 0 이 되도록 맞춰 보세요.', re:'5'},
  {t:'아래 <b>탐구 노트</b>로 마무리하세요 — 값을 <b>기록</b>하고, 전체 양을 <b>계산</b>하고, 방정식으로 <b>판단</b>합니다.',
   re:'탐구 노트 통과',
   do:'① 지금 소금·물·농도 적기 ② 5 % 가 되는 전체의 양 구하기 ③ 부어야 할 물의 양 계산하기',
   hand:'20 / (200 + x) = 5/100 을 세워 풀고, 화면의 안내 수와 같은지 확인하기'}],
 inquiry:{
  id:'sl64', title:'소금물 실험실 — 비율을 방정식으로',
  q:['여러 상태를 만들며 8줄 이상 기록하세요. 5 % 에 명중한 줄을 꼭 넣으세요.',
     '물을 부을 때와 소금을 넣을 때, 분자·분모 중 무엇이 변하는지 표에서 확인하세요.',
     '20 / (200 + x) = 5/100 을 세워 풀고 화면의 수와 견주세요.'],
  cols:['소금(g)','물(g)','전체(g)','농도(%)','5%까지 물','5%까지 소금'],
  hint:'힌트 — 변하지 않는 것을 먼저 찾으세요. 물을 부을 때 소금의 양은 그대로입니다.' },
 apply:{
  q:'새 문제 — 소금 20 g · 물 180 g 인 소금물에 물을 <b>몇 g</b> 부어야 5 % 가 될까요?',
  a:200, tol:2,
  why:'20 / (200 + x) = 0.05 → 200 + x = 400 → x = 200. 소금이 그대로이므로 전체가 두 배가 되면 농도는 반이 됩니다.',
  hint:'5 % 가 되려면 전체가 몇 g 이어야 할까요?' },
 demo(root){ return saltDemo(root); }
};

LESSON[65]={
 title:'수직이등분선의 작도 — 같은 거리의 점들',
 problem:{
  q:'자로 재지 않고 선분의 <b>한가운데</b>를 찾을 수 있을까요? 컴퍼스로 두 끝에서 같은 반지름의 호를 그리면 교점이 생깁니다. 그 교점이 <b>왜</b> 한가운데를 알려 줄까요?',
  svg:`<svg viewBox="0 0 400 170" role="img" aria-label="선분 AB 의 두 끝에서 같은 반지름의 호를 그려 만든 두 교점과 수직이등분선">
    <path d="M120 96 H280" stroke="#111827" stroke-width="2.2"/>
    <circle cx="120" cy="96" r="4.6" fill="#BE123C"/><text x="112" y="112" font-size="11" font-weight="800" fill="#BE123C">A</text>
    <circle cx="280" cy="96" r="4.6" fill="#BE123C"/><text x="286" y="112" font-size="11" font-weight="800" fill="#BE123C">B</text>
    <circle cx="120" cy="96" r="96" fill="none" stroke="#9CA3AF" stroke-width="1.2" stroke-dasharray="4 3"/>
    <circle cx="280" cy="96" r="96" fill="none" stroke="#9CA3AF" stroke-width="1.2" stroke-dasharray="4 3"/>
    <circle cx="200" cy="43.6" r="4.6" fill="#2563EB"/>
    <circle cx="200" cy="148.4" r="4.6" fill="#2563EB"/>
    <path d="M200 30 V162" stroke="#2563EB" stroke-width="2.2"/>
    <path d="M192 88 H208 V104" fill="none" stroke="#0E9384" stroke-width="1.6"/>
    <text x="200" y="22" font-size="10.5" fill="#6B7280" text-anchor="middle">두 호의 교점을 이으면 왜 한가운데를 지날까</text>
  </svg>`,
  sit:'A·B 의 자리와 반지름 <b>r</b> 를 바꾸면 두 호의 교점 P 가 다시 계산되고, <b>PA</b> 와 <b>PB</b> 가 나란히 표시됩니다. 호가 아예 만나지 않는 경우도 만들어 볼 수 있습니다.'
 },
 predict:{
  q:['두 호의 교점에서 A 까지와 B 까지의 거리를 견주면 어떨지 예상하세요.',
     '반지름 r 를 바꾸면 교점을 이은 선이 달라질지 예상하고 까닭도 적으세요.',
     '호가 만나지 않으려면 r 가 어떠해야 할까요?'] },
 missions:[
  {t:'A·B·r 를 바꿔 <b>PA</b> 와 <b>PB</b> 를 견주어 보세요.', re:'PA'},
  {t:'r 를 줄여 호가 <b>만나지 않게</b> 해 보세요.', re:'만'},
  {t:'아래 <b>탐구 노트</b>로 마무리하세요 — 두 거리를 <b>기록</b>하고, 차를 <b>계산</b>하고, r 를 바꿔 <b>판단</b>합니다.',
   re:'탐구 노트 통과',
   do:'① 지금 PA 와 PB 적기 ② 두 거리의 차 구하기 ③ r 를 바꿔도 차가 0 인지 확인',
   hand:'두 호의 교점이 왜 A·B 에서 같은 거리인지 «호 위의 점은 중심에서 거리가 같다»로 설명하기'}],
 inquiry:{
  id:'pb65', title:'같은 거리의 점들 — 수직이등분선',
  q:['A·B·r 를 바꿔 가며 8줄 이상 기록하세요. 만나는 경우와 안 만나는 경우를 모두 넣으세요.',
     '「PA」와 「PB」 열을 보세요. P 를 어디로 옮겨도 무엇이 성립하나요?',
     '수직이등분선이 «두 점에서 같은 거리인 점들의 모임»인 까닭을 손으로 설명하세요.'],
  cols:['AB','r','호가 만나나','PA','PB','PA = PB?'],
  hint:'힌트 — 호 위의 모든 점은 중심에서 거리가 r 로 같습니다. 두 호의 교점은 A 에서도 B 에서도 r 입니다.' },
 apply:{
  q:'새 문제 — 선분 AB 의 수직이등분선 위의 점 P 에서 <b>PA = 7</b> 일 때, <b>PB</b> 의 길이는?',
  a:7, tol:0.1,
  why:'수직이등분선은 두 점에서 거리가 같은 점들의 모임이므로 PB = PA = 7 입니다.',
  hint:'수직이등분선 위의 점은 두 끝점에서 같은 거리입니다.' },
 demo(root){ return pbisectDemo(root); }
};

LESSON[66]={
 title:'각의 이등분선 작도 — 각도기 없이 절반',
 problem:{
  q:'각도기가 없습니다. 그런데 <b>어떤 각이든</b> 정확히 반으로 나눌 수 있을까요? 컴퍼스와 자만으로 가능합니다 — 그런데 그 작도는 <b>왜</b> 정확히 절반을 만들까요?',
  svg:`<svg viewBox="0 0 400 170" role="img" aria-label="각의 두 변에 같은 호를 그려 만든 두 점에서 다시 호를 그려 이등분선을 얻는 작도">
    <path d="M96 140 L308 140" stroke="#111827" stroke-width="2"/>
    <path d="M96 140 L266.7 41.5" stroke="#111827" stroke-width="2"/>
    <circle cx="96" cy="140" r="4" fill="#111827"/>
    <path d="M176 140 A80 80 0 0 0 136 70.7" fill="none" stroke="#9CA3AF" stroke-width="1.3" stroke-dasharray="4 3"/>
    <circle cx="176" cy="140" r="4.4" fill="#BE123C"/>
    <circle cx="136" cy="70.7" r="4.4" fill="#BE123C"/>
    <circle cx="176" cy="140" r="66" fill="none" stroke="#D1D5DB" stroke-width="1.1" stroke-dasharray="3 3"/>
    <circle cx="136" cy="70.7" r="66" fill="none" stroke="#D1D5DB" stroke-width="1.1" stroke-dasharray="3 3"/>
    <path d="M96 140 L241.5 96" stroke="#2563EB" stroke-width="2.4"/>
    <text x="252" y="94" font-size="10.5" font-weight="800" fill="#1D4ED8">이등분선</text>
    <text x="200" y="20" font-size="10.5" fill="#6B7280" text-anchor="middle">세 변이 같은 두 삼각형이 숨어 있다 — SSS</text>
  </svg>`,
  sit:'각의 크기와 두 반지름 <b>r₁ · r₂</b> 를 바꾸면 이등분선이 다시 그려지고, 그 <b>이등분선의 각</b> 과 <b>각의 절반값</b> 이 나란히 표시됩니다. r 를 바꿔도 변하지 않는 것이 무엇인지 확인합니다.'
 },
 predict:{
  q:['컴퍼스 반지름을 바꾸면 이등분선이 달라질지 예상하고 까닭도 적으세요.',
     '이 작도가 정확히 절반을 만드는 까닭을 미리 예상해 적으세요.',
     '어떤 도형의 합동이 숨어 있을지 짐작해 보세요.'] },
 missions:[
  {t:'각의 크기를 바꿔 가며 <b>이등분선의 각</b>과 <b>절반값</b>을 견주어 보세요.', re:'이등분'},
  {t:'<b>r₁ · r₂</b> 를 바꿔 보세요. 결과가 달라지나요?', re:'r'},
  {t:'아래 <b>탐구 노트</b>로 마무리하세요 — 두 각을 <b>기록</b>하고, 차를 <b>계산</b>하고, r 를 바꿔 <b>판단</b>합니다.',
   re:'탐구 노트 통과',
   do:'① 지금 각과 이등분선의 각 적기 ② 각의 절반과의 차 구하기 ③ r₁ 이나 r₂ 를 바꿔 그대로인지 확인',
   hand:'이 작도가 절반을 만드는 까닭을 <b>합동(SSS)</b> 으로 설명하기'}],
 inquiry:{
  id:'ab66', title:'각도기 없이 절반 만들기',
  q:['각의 크기를 여러 값으로 바꿔 가며 8줄 이상 기록하세요. r₁·r₂ 도 함께 바꾸세요.',
     '「이등분선의 각」과 「절반값」을 견주세요. r 를 바꿔도 변하지 않는 것이 무엇인가요?',
     '이 작도가 왜 정확히 절반인지 <b>합동(SSS)</b> 으로 손으로 설명하세요.'],
  cols:['각','r₁','r₂','이등분선의 각','절반값','일치?'],
  hint:'힌트 — 호 r₁ 이 만든 두 점은 O 에서 같은 거리, 교점은 그 두 점에서 같은 거리입니다.' },
 apply:{
  q:'새 문제 — <b>112°</b> 인 각을 이등분선으로 나누면 한쪽 각은 몇 도일까요?',
  a:56, tol:0.5,
  why:'112 ÷ 2 = 56°. 작도는 각도기 없이도 이 절반을 정확히 만들어 냅니다.',
  hint:'절반입니다.' },
 demo(root){ return abisectDemo(root); }
};

LESSON[67]={
 title:'부채꼴을 펼치면 보인다 — S = ½rl',
 problem:{
  q:'부채꼴의 넓이 공식 <b>S = ½ r l</b> 은 어디서 왔을까요? 외워서 쓰기는 쉽지만, 왜 <b>½</b> 이 붙고 왜 <b>l 이 아니라 l/2</b> 가 가로가 되는지는 잘 설명하기 어렵습니다.',
  svg:`<svg viewBox="0 0 400 170" role="img" aria-label="부채꼴을 여러 조각으로 잘라 번갈아 붙이면 가로 l/2 세로 r 인 평행사변형이 되는 그림">
    __F67__
    <text x="200" y="18" font-size="10.5" fill="#6B7280" text-anchor="middle">잘라서 번갈아 붙이면 «가로 l/2 · 세로 r» 인 띠가 된다</text>
    <text x="96" y="164" font-size="10" fill="#6B7280" text-anchor="middle">부채꼴</text>
    <text x="270" y="164" font-size="10" fill="#6B7280" text-anchor="middle">삼각형 넓이와 같은 구조</text>
  </svg>`,
  sit:'중심각과 반지름 r 를 바꾸면 호의 길이 l 이 다시 계산되고, <b>½ r l</b> 과 <b>π r² × 각/360</b> 이 나란히 표시됩니다. 조각 수를 늘리면 오른쪽 모양이 점점 평행사변형에 가까워집니다.'
 },
 predict:{
  q:['부채꼴을 여러 조각으로 잘라 번갈아 붙이면 어떤 모양이 될지 예상하세요.',
     '그 모양의 가로와 세로가 각각 무엇일지 예상해 적으세요.',
     '왜 가로가 l 이 아니라 l/2 일지 짐작해 보세요.'] },
 missions:[
  {t:'중심각과 r 를 바꿔 가며 <b>½rl</b> 과 <b>πr²×각/360</b> 을 견주어 보세요.', re:'rl'},
  {t:'조각 수를 늘려 오른쪽 모양이 어떻게 변하는지 보세요.', re:'일치'},
  {t:'아래 <b>탐구 노트</b>로 마무리하세요 — 두 값을 <b>기록</b>하고, 차를 <b>계산</b>하고, 각을 바꿔 <b>판단</b>합니다.',
   re:'탐구 노트 통과',
   do:'① 지금 중심각·r·호 l 적기 ② ½rl 과 πr²×각/360 을 견주기 ③ 각을 바꿔도 늘 같은지 확인',
   hand:'가로가 왜 l 이 아니라 <b>l/2</b> 인지 «호가 위아래로 절반씩 나뉜다»로 설명하기'}],
 inquiry:{
  id:'aa67', title:'부채꼴 펼치기 — S = ½rl 의 발견',
  q:['중심각과 r 를 바꿔 가며 8줄 이상 기록하세요.',
     '「½rl」과 「πr²×각/360」 열을 견주세요. 무엇이 성립하나요?',
     '평행사변형의 가로가 왜 l/2 인지 손으로 설명하고, πr² 도 같은 방법으로 유도해 적으세요.'],
  cols:['중심각','r','호 l','½rl','πr²×각/360','일치?'],
  hint:'힌트 — 호는 위쪽 조각과 아래쪽 조각에 절반씩 나뉘어 붙습니다. 삼각형 넓이 ½ × 밑변 × 높이와 같은 구조입니다.' },
 apply:{
  q:'새 문제 — 반지름이 <b>6</b>, 호의 길이가 <b>10</b> 인 부채꼴의 넓이는?',
  a:30, tol:0.5,
  why:'S = ½ r l = ½ × 6 × 10 = 30. 중심각을 몰라도 r 와 l 만 있으면 바로 구해집니다.',
  hint:'S = ½ × r × l.' },
 demo(root){ return arcAreaDemo(root); }
};

LESSON[68]={
 title:'정다면체는 왜 5개뿐일까',
 problem:{
  q:'정다면체는 <b>단 다섯 가지</b>뿐입니다. 삼각형·사각형·오각형은 되는데 <b>육각형부터는 하나도 없습니다.</b> 왜 그럴까요? 그 이유는 한 꼭짓점에 모인 각에 있습니다.',
  svg:`<svg viewBox="0 0 400 170" role="img" aria-label="정오각형 세 장을 한 점에 모으면 324도가 되어 36도의 틈이 남는 그림">
    __V68__
    <text x="200" y="20" font-size="10.5" fill="#6B7280" text-anchor="middle">한 점에 모은 각의 합이 360° 보다 «작아야» 오므라든다</text>
    <text x="200" y="164" font-size="10.5" fill="#6B7280" text-anchor="middle">정오각형 3장 = 108° × 3 = 324° — 36° 가 남는다</text>
  </svg>`,
  sit:'정다각형의 종류와 <b>장수</b>를 고르면 한 내각과 각의 합이 계산되고, <b>입체가 되는지</b> 와 그 입체의 <b>이름</b> 이 표시됩니다. 되는 조합이 정말 다섯 가지뿐인지 직접 세어 볼 수 있습니다.'
 },
 predict:{
  q:['한 점에 모인 각의 합이 360° 이면 어떻게 될지 예상하세요.',
     '정육각형 세 장을 한 점에 모으면 몇 도가 될지 계산해 보세요.',
     '정다면체가 다섯 가지뿐인 까닭을 미리 예상해 적으세요.'] },
 missions:[
  {t:'여러 조합을 시험해 <b>입체가 되는</b> 경우를 찾아보세요.', re:'된다'},
  {t:'<b>정육각형 3장</b> 을 시험해 보세요. 각의 합이 얼마인가요?', re:'각'},
  {t:'아래 <b>탐구 노트</b>로 마무리하세요 — 각의 합을 <b>기록</b>하고, 360 과 <b>견주고</b>, 다섯 가지뿐임을 <b>판단</b>합니다.',
   re:'탐구 노트 통과',
   do:'① 지금 다각형·한 내각·장수·각의 합 적기 ② 각의 합과 360 의 차 구하기 ③ 정육각형 3장을 시험하기',
   hand:'정육각형부터는 왜 하나도 안 되는지 <b>한 내각 × 3 ≥ 360°</b> 로 설명하기'}],
 inquiry:{
  id:'pl68', title:'정다면체는 왜 5개뿐일까',
  q:['(정다각형, 장수) 조합을 전부 시험하며 기록하세요.',
     '「입체가 되나」 열을 보고 되는 조합이 몇 가지인지 세고, 각각 무슨 입체인지 적으세요.',
     '정육각형부터는 왜 단 하나도 안 되는지 손으로 설명하세요.'],
  cols:['다각형','한 내각','장수','각의 합','입체가 되나','이름'],
  hint:'힌트 — 종이를 한 점에 세 장 모아 붙여 보세요. 합이 360° 보다 작아야 오므라들어 볼록해집니다.' },
 apply:{
  q:'새 문제 — <b>정오각형 3장</b> 을 한 점에 모았을 때 각의 합은 몇 도일까요?',
  a:324, tol:1,
  why:'정오각형의 한 내각은 108° 이므로 108 × 3 = 324°. 360° 보다 36° 작으므로 오므라들어 정십이면체가 됩니다.',
  hint:'정오각형의 한 내각은 108° 입니다.' },
 demo(root){ return platonicDemo(root); }
};

LESSON[69]={
 title:'예산 안에서 몇 개까지 — 일차부등식',
 problem:{
  q:'5,000원으로 <b>800원</b> 짜리 간식을 삽니다. 부등식을 풀면 <b>x ≤ 6.25</b> 가 나옵니다. 그런데 간식을 <b>6.25 개</b> 살 수는 없습니다. 그러면 답은 무엇일까요?',
  svg:`<svg viewBox="0 0 400 170" role="img" aria-label="수직선 위에 800x 이하 5000 의 해와 실제로 살 수 있는 자연수 6 을 표시한 그림">
    __L69__
    <text x="200" y="22" font-size="10.5" fill="#6B7280" text-anchor="middle">800x ≤ 5000 → x ≤ 6.25</text>
    <text x="200" y="150" font-size="10.5" fill="#6B7280" text-anchor="middle">식의 해와 «실제로 살 수 있는 수»는 다르다</text>
  </svg>`,
  sit:'간식을 하나씩 담으면 금액과 <b>부등식을 만족하는지</b> 가 함께 표시됩니다. 만족에서 위반으로 <b>바뀌는 경계</b> 를 직접 찾아, 그 경계와 6.25 의 관계를 확인합니다.'
 },
 predict:{
  q:['5,000원으로 800원짜리를 몇 개까지 살 수 있을지 예상하세요.',
     'x ≤ 6.25 라는 답과 실제 답이 왜 다를지 적어 보세요.',
     '양변에 −2 를 곱하면 부등호는 어떻게 될까요?'] },
 missions:[
  {t:'간식을 하나씩 담아 <b>부등식 만족</b>이 언제 깨지는지 보세요.', re:'만족'},
  {t:'그 경계에서 <b>남은 돈</b> 이 얼마인지 확인하세요.', re:'남은'},
  {t:'아래 <b>탐구 노트</b>로 마무리하세요 — 경계를 <b>기록</b>하고, 6.25 와 <b>견주고</b>, 실제 답을 <b>판단</b>합니다.',
   re:'탐구 노트 통과',
   do:'① 만족하는 마지막 개수와 금액 적기 ② 하나 더 담아 위반이 되는 것을 확인 ③ 6.25 와 견주기',
   hand:'양변에 −2 를 곱할 때 부등호를 뒤집는 까닭을 «수직선에서 −1 배는 반사»로 설명하기'}],
 inquiry:{
  id:'iq69', title:'예산 안에서 몇 개까지 — 일차부등식',
  q:['간식을 하나씩 담으며 0개부터 8개까지 기록하세요.',
     '「부등식 만족?」 열이 바뀌는 경계를 찾아, x ≤ 6.25 와 실제 답의 관계를 적으세요.',
     '양변에 −2 를 곱할 때 부등호를 뒤집는 까닭을 손으로 설명하세요.'],
  cols:['담은 수 x','금액 800x','예산','부등식 만족?','남은 돈'],
  hint:'힌트 — 3 < 5 의 양변에 −1 을 곱하면 −3 과 −5 — 어느 쪽이 큰가요?' },
 apply:{
  q:'새 문제 — 예산 <b>12,000원</b> 으로 <b>1,500원</b> 짜리를 <b>최대 몇 개</b> 살 수 있을까요?',
  a:8, tol:0.5,
  why:'1500x ≤ 12000 → x ≤ 8. 마침 딱 떨어지므로 8개를 사고 남는 돈은 0원입니다.',
  hint:'12000 ÷ 1500 을 계산하세요.' },
 demo(root){ return ineqDemo(root); }
};

LESSON[70]={
 title:'나머지와 해시 — 사물함은 어떻게 정할까',
 problem:{
  q:'수천 명의 자료를 컴퓨터는 어느 서랍에 넣을까요? 흔히 <b>학번을 m 으로 나눈 나머지</b> 를 씁니다. 그런데 m 을 잘못 고르면 <b>한쪽에만 몰립니다.</b> 왜 그럴까요?',
  svg:`<svg viewBox="0 0 400 170" role="img" aria-label="짝수 학번 스무 개를 m=10 과 m=7 로 나눈 나머지에 따라 서랍에 넣은 결과">
    __H70__
    <text x="200" y="18" font-size="10.5" fill="#6B7280" text-anchor="middle">짝수 학번 20 개를 m = 10 과 m = 7 로 나눈 나머지</text>
    <text x="200" y="164" font-size="10.5" fill="#6B7280" text-anchor="middle">m = 10 은 절반이 빈다 — m = 7 은 골고루 찬다</text>
  </svg>`,
  sit:'학번들을 <b>m = 10 · 8 · 7 · 11</b> 로 각각 배정하면 <b>쓰인 사물함</b> 과 <b>충돌 칸</b> 이 계산됩니다. 어떤 m 에서 몰림이 생기는지, 그것이 학번의 성질과 어떻게 얽히는지 확인합니다.'
 },
 predict:{
  q:['학번이 모두 짝수인데 m = 10 으로 나누면 나머지는 어떤 수들일지 예상하세요.',
     '어떤 m 이 골고루 퍼뜨릴지 예상하고 까닭도 적으세요.',
     '«충돌»이 생기면 무엇이 불편해질까요?'] },
 missions:[
  {t:'m 을 바꿔 가며 <b>쓰인 사물함</b> 이 몇 칸인지 보세요.', re:'사물함'},
  {t:'<b>몰림</b> 이 생기는 m 과 <b>골고루</b> 인 m 을 각각 찾아보세요.', re:'골고루'},
  {t:'아래 <b>탐구 노트</b>로 마무리하세요 — 결과를 <b>기록</b>하고, 두 m 을 <b>견주고</b>, 좋은 m 을 <b>판단</b>합니다.',
   re:'탐구 노트 통과',
   do:'① m = 10 일 때 쓰인 사물함 수 적기 ② m = 7 로 바꿔 다시 적기 ③ 두 결과를 견주기',
   hand:'m 이 짝수이고 학번도 짝수면 나머지가 왜 짝수뿐인지 «짝수 − 짝수 = 짝수»로 설명하기'}],
 inquiry:{
  id:'hh70', title:'나머지와 해시 — 사물함은 어떻게 정할까',
  q:['같은 학번들을 m = 10 · 8 · 7 · 11 로 각각 배정하며 기록하세요.',
     '「쓰인 사물함」 열을 견주어, 어떤 m 에서 몰림이 생기는지 찾으세요.',
     'm 이 짝수이고 학번이 모두 짝수면 나머지가 왜 짝수뿐인지 손으로 설명하세요.'],
  cols:['m','배정 인원','쓰인 사물함','충돌 칸','골고루?'],
  hint:'힌트 — 학번 = m × 몫 + 나머지. 학번과 m 이 모두 2의 배수면 나머지도 2의 배수일 수밖에 없습니다.' },
 apply:{
  q:'새 문제 — 학번 <b>20260917</b> 을 <b>m = 7</b> 로 나눈 나머지는?',
  a:5, tol:0.5,
  why:'20260917 = 7 × 2894416 + 5 이므로 나머지는 5 입니다. 이 학생은 5번 사물함을 씁니다.',
  hint:'7 로 나누고 남는 수를 구하세요.' },
 demo(root){ return hashDemo(root); }
};

"""


def note(no, head, c1, c2, c3):
    return "\n %d:{ h:'%s',\n  c:[\n%s,\n%s,\n%s\n ]},\n" % (no, head, c1, c2, c3)


NOTES = (
 note(61, '내가 거르고 · 내가 견주고 · 내가 판단한다',
 """  {t:'기록 — 소수 하나로 거른 뒤 화면의 값을 적으세요',
   f:'거른 소수 p = {0} · p² = {1} · 새로 지운 수 = {2}',
   chk(got, r, mem){
     if(!r) return {ok:false, msg:'아직 거르지 않았습니다. 소수를 하나 눌러 보세요.'};
     const p=noteNum(r[0]), p2=noteNum(r[1]), d=noteNum(r[2]);
     if(![0,1,2].every(k=>isFinite(got[k]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-p)>0.5) return {ok:false, msg:'화면의 p 는 '+p+' 입니다.'};
     if(Math.abs(got[1]-p2)>0.5) return {ok:false, msg:'p² 은 '+p2+' 입니다.'};
     if(Math.abs(got[2]-d)>0.5) return {ok:false, msg:'새로 지운 수는 '+d+' 입니다.'};
     mem.p=p; mem.d=d;
     return {ok:true, msg:'기록했습니다 — 계속 걸러 새로 지운 수가 0 이 되는 자리를 찾아봅시다.'};
   }}""",
 """  {t:'생각 — <b>새로 지운 수가 0</b> 이 되는 소수까지 걸러 본 뒤 적으세요',
   f:'그때 p = {0} · p² = {1} · p² − 120 = {2}',
   chk(got, r, mem){
     if(mem.p===undefined) return {ok:false, msg:'① 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const p=noteNum(r[0]), p2=noteNum(r[1]), d=noteNum(r[2]);
     if(!(d===0)) return {ok:false, msg:'아직 '+d+' 개를 새로 지웠습니다. 다음 소수로 더 걸러 보세요.'};
     if(![0,1,2].every(k=>isFinite(got[k]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-p)>0.5||Math.abs(got[1]-p2)>0.5)
       return {ok:false, msg:'지금은 p = '+p+' · p² = '+p2+' 입니다.'};
     if(Math.abs(got[2]-(p2-120))>0.5) return {ok:false, msg:'p² 에서 120 을 빼세요.'};
     mem.p2=p2;
     return {ok:true, msg:'계산했습니다 — p² 이 120 을 <b>넘은</b> 자리입니다.'};
   }}""",
 """  {t:'판단 — 「√120 넘었나」 칸을 확인한 뒤 고르세요',
   f:'남은 수 = {0} 개',
   opts:['<b>p² 이 120 을 넘으면 멈춰도 된다</b> — 합성수는 √n 이하의 인수를 반드시 갖기 때문',
         '119 까지 모든 수로 다 걸러야 한다',
         '소수의 개수만큼 걸러야 한다'],
   chk(got, r, mem, pick){
     if(mem.p2===undefined) return {ok:false, msg:'② 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     if(String(r[4]).indexOf('넘')<0)
       return {ok:false, msg:'아직 «'+r[4]+'» 입니다. p² 이 120 을 넘을 때까지 걸러 보세요.'};
     const rem=noteNum(r[3]);
     if(!isFinite(got[0])) return {ok:false, msg:'칸을 채우세요.'};
     if(Math.abs(got[0]-rem)>0.5) return {ok:false, msg:'남은 수는 '+r[3]+' 개입니다.'};
     if(pick!==0)
       return {ok:false, msg:'p² = '+mem.p2+' 이 120 을 넘은 뒤로는 새로 지워지는 것이 없었습니다. 이 사실을 보고 다시 고르세요.'};
     return {ok:true, msg:'판단했습니다 — <b>합성수 n 은 √n 이하의 인수를 반드시 하나 갖습니다.</b> 그 인수로 이미 지워졌으니, √120 을 넘는 소수로는 더 지울 것이 없습니다.'};
   }}""")
 +
 note(62, '내가 끌고 · 내가 더하고 · 내가 판단한다',
 """  {t:'기록 — 예측 점을 끌어 오차를 만든 뒤 두 합을 적으세요',
   f:'부호 합 = {0} · |오차| 합 = {1}',
   chk(got, r, mem){
     if(!r) return {ok:false, msg:'아직 화면 값이 없습니다.'};
     const s=noteNum(r[5]), a=noteNum(r[6]);
     if(!(a>0)) return {ok:false, msg:'오차가 하나도 없습니다. 예측 점을 끌어 빗나가게 해 보세요.'};
     if(![0,1].every(k=>isFinite(got[k]))) return {ok:false, msg:'두 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-s)>0.5) return {ok:false, msg:'부호 합은 '+r[5]+' 입니다.'};
     if(Math.abs(got[1]-a)>0.5) return {ok:false, msg:'|오차| 합은 '+r[6]+' 입니다.'};
     mem.s=s; mem.a=a;
     return {ok:true, msg:'기록했습니다 — 이제 더 크게 빗나가게 만들어 봅시다.'};
   }}""",
 """  {t:'생각 — <b>|오차| 합이 더 커지도록</b> 만든 뒤 두 합의 변화를 적으세요',
   f:'새 부호 합 = {0} · 새 |오차| 합 = {1} · |오차| 합의 증가 = {2}',
   chk(got, r, mem){
     if(mem.a===undefined) return {ok:false, msg:'① 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const s=noteNum(r[5]), a=noteNum(r[6]);
     if(!(a > mem.a + 0.5))
       return {ok:false, msg:'아직 |오차| 합이 '+a+' 입니다. ①의 '+mem.a+' 보다 커지게 더 빗나가게 하세요.'};
     if(![0,1,2].every(k=>isFinite(got[k]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-s)>0.5||Math.abs(got[1]-a)>0.5)
       return {ok:false, msg:'지금은 '+r[5]+' 와 '+r[6]+' 입니다.'};
     if(Math.abs(got[2]-(a-mem.a))>0.5) return {ok:false, msg:'지금 |오차| 합에서 ①의 값을 빼세요.'};
     mem.ok2=true;
     return {ok:true, msg:'계산했습니다 — |오차| 합은 '+(a-mem.a)+' 만큼 커졌습니다. 부호 합은 어땠나요?'};
   }}""",
 """  {t:'판단 — <b>부호 합이 0</b> 이 되게 맞춘 뒤 |오차| 합을 보고 고르세요',
   f:'그때 |오차| 합 = {0}',
   opts:['<b>|오차| 합</b>이 예보의 실력을 잰다 — 부호 합은 서로 <b>상쇄</b>되어 틀린 정도를 지워 버린다',
         '부호 합이 0 이면 완벽한 예보다',
         '두 합은 늘 같은 값이다'],
   chk(got, r, mem, pick){
     if(!mem.ok2) return {ok:false, msg:'② 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const s=noteNum(r[5]), a=noteNum(r[6]);
     if(Math.abs(s)>0.5) return {ok:false, msg:'아직 부호 합이 '+r[5]+' 입니다. 0 이 되게 맞추세요.'};
     if(!(a>0.5)) return {ok:false, msg:'오차를 0 으로 만들면 안 됩니다 — 부호 합만 0 이고 실제로는 빗나간 배치를 만드세요.'};
     if(!isFinite(got[0])) return {ok:false, msg:'칸을 채우세요.'};
     if(Math.abs(got[0]-a)>0.5) return {ok:false, msg:'지금 |오차| 합은 '+r[6]+' 입니다.'};
     if(pick!==0)
       return {ok:false, msg:'부호 합은 0 인데 |오차| 합은 '+a+' 입니다. 이 예보가 완벽한가요? 다시 고르세요.'};
     return {ok:true, msg:'판단했습니다 — <b>+3 과 −3 은 «반대 방향으로 같은 거리»</b> 입니다. 방향을 지우고 거리만 남기는 것이 절댓값이고, 그래서 |오차| 의 합이 실력을 잽니다.'};
   }}""")
 +
 note(63, '내가 넣고 · 내가 견주고 · 내가 판단한다',
 """  {t:'기록 — 식을 고르고 숫자 카드를 넣은 뒤 적으세요',
   f:'넣은 a = {0} · 식의 값 = {1} · a 를 1 키우면 = {2}',
   chk(got, r, mem){
     if(!r) return {ok:false, msg:'아직 카드를 넣지 않았습니다.'};
     const a=noteNum(r[1]), v=noteNum(r[2]), v2=noteNum(r[3]);
     if(![0,1,2].every(k=>isFinite(got[k]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-a)>0.05) return {ok:false, msg:'넣은 a 는 '+r[1]+' 입니다.'};
     if(Math.abs(got[1]-v)>0.05) return {ok:false, msg:'식의 값은 '+r[2]+' 입니다.'};
     if(Math.abs(got[2]-v2)>0.05) return {ok:false, msg:'a 를 1 키우면 '+r[3]+' 입니다.'};
     mem.f=String(r[0]); mem.dv=v2-v;
     return {ok:true, msg:'기록했습니다 — 지금 식은 «'+mem.f+'» 이고, 한 칸 키우면 '+mem.dv.toFixed(2)+' 만큼 변합니다.'};
   }}""",
 """  {t:'생각 — 같은 식에 <b>다른 a</b> 를 넣고 변화량을 다시 구하세요',
   f:'새 a = {0} · 그때의 변화량 = {1} · ①의 변화량과의 차 = {2}',
   chk(got, r, mem){
     if(mem.f===undefined) return {ok:false, msg:'① 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     if(String(r[0])!==mem.f) return {ok:false, msg:'식을 «'+mem.f+'» 로 되돌리고 a 만 바꾸세요.'};
     const a=noteNum(r[1]), v=noteNum(r[2]), v2=noteNum(r[3]), dv=v2-v;
     if(![0,1,2].every(k=>isFinite(got[k]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-a)>0.05) return {ok:false, msg:'지금 a 는 '+r[1]+' 입니다.'};
     if(Math.abs(got[1]-dv)>0.05) return {ok:false, msg:'「a 를 1 키우면」에서 「식의 값」을 빼세요.'};
     if(Math.abs(got[2]-(dv-mem.dv))>0.05) return {ok:false, msg:'지금 변화량에서 ①의 변화량을 빼세요.'};
     mem.same=Math.abs(dv-mem.dv)<0.05; mem.ok2=true;
     return {ok:true, msg:mem.same?'계산했습니다 — 변화량이 <b>그대로</b> 입니다.':'계산했습니다 — 변화량이 <b>달라졌습니다.</b>'};
   }}""",
 """  {t:'판단 — 「값의 변화」가 <b>일정한 식</b>과 <b>점점 커지는 식</b>을 모두 시험한 뒤 고르세요',
   f:'지금 넣은 a = {0} · 식의 값 = {1}',
   opts:['a 를 1 키울 때 <b>일차식</b>은 늘 같은 만큼, <b>이차식</b>은 점점 크게 변한다',
         '어떤 식이든 변화량은 늘 같다',
         'a 가 커지면 어떤 식이든 변화량이 줄어든다'],
   chk(got, r, mem, pick){
     if(!mem.ok2) return {ok:false, msg:'② 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const a=noteNum(r[1]), v=noteNum(r[2]);
     if(![0,1].every(k=>isFinite(got[k]))) return {ok:false, msg:'두 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-a)>0.05||Math.abs(got[1]-v)>0.05)
       return {ok:false, msg:'지금은 a = '+r[1]+' · 값 '+r[2]+' 입니다.'};
     if(pick!==0)
       return {ok:false, msg:'식을 바꿔 가며 「값의 변화」 열을 다시 보세요. 일정한 식과 점점 커지는 식이 나뉩니다.'};
     return {ok:true, msg:'판단했습니다 — <b>2a 의 2 와 a 사이에는 생략된 곱셈 기호가 있습니다.</b> 그래서 a = 7 일 때 27 이 아니라 2 × 7 = 14 입니다.'};
   }}""")
 +
 note(64, '내가 붓고 · 내가 계산하고 · 내가 판단한다',
 """  {t:'기록 — 지금 소금물의 상태를 적으세요',
   f:'소금 = {0} g · 물 = {1} g · 농도 = {2} %',
   chk(got, r, mem){
     if(!r) return {ok:false, msg:'아직 화면 값이 없습니다.'};
     const s=noteNum(r[0]), w=noteNum(r[1]), c=noteNum(r[3]);
     if(![0,1,2].every(k=>isFinite(got[k]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-s)>0.5||Math.abs(got[1]-w)>0.5)
       return {ok:false, msg:'화면은 소금 '+r[0]+' g · 물 '+r[1]+' g 입니다.'};
     if(Math.abs(got[2]-c)>0.05) return {ok:false, msg:'농도는 '+r[3]+' % 입니다.'};
     mem.s=s; mem.w=w; mem.c=c;
     return {ok:true, msg:'기록했습니다 — 이제 <b>물만</b> 부어 봅시다. 소금은 그대로입니다.'};
   }}""",
 """  {t:'생각 — <b>물만</b> 부어 농도를 낮춘 뒤 무엇이 변했는지 적으세요',
   f:'소금 = {0} g · 물 = {1} g · 농도 = {2} %',
   chk(got, r, mem){
     if(mem.s===undefined) return {ok:false, msg:'① 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const s=noteNum(r[0]), w=noteNum(r[1]), c=noteNum(r[3]);
     if(Math.abs(s-mem.s)>0.5) return {ok:false, msg:'소금이 달라졌습니다. <b>물만</b> 부어 보세요 (소금은 '+mem.s+' g 그대로).'};
     if(!(w > mem.w + 0.5)) return {ok:false, msg:'아직 물이 '+r[1]+' g 입니다. ①의 '+mem.w+' g 보다 더 부으세요.'};
     if(![0,1,2].every(k=>isFinite(got[k]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-s)>0.5||Math.abs(got[1]-w)>0.5)
       return {ok:false, msg:'지금은 소금 '+r[0]+' g · 물 '+r[1]+' g 입니다.'};
     if(Math.abs(got[2]-c)>0.05) return {ok:false, msg:'지금 농도는 '+r[3]+' % 입니다.'};
     if(!(c < mem.c - 0.01)) return {ok:false, msg:'농도가 내려가지 않았습니다. 물을 더 부으세요.'};
     mem.ok2=true;
     return {ok:true, msg:'계산했습니다 — 소금(분자)은 그대로인데 전체(분모)만 커져 농도가 내려갔습니다.'};
   }}""",
 """  {t:'판단 — 농도를 <b>5 %</b> 에 맞춘 뒤 전체의 양을 보고 고르세요',
   f:'그때 전체 = {0} g · 농도 = {1} %',
   opts:['소금이 그대로일 때 <b>전체가 두 배</b>가 되면 농도는 <b>반</b>이 된다 — 20 / (200 + x) = 5/100 에서 x = 200',
         '물을 부으면 소금도 함께 늘어난다',
         '농도는 물의 양에만 달려 있고 소금과는 관계가 없다'],
   chk(got, r, mem, pick){
     if(!mem.ok2) return {ok:false, msg:'② 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const t=noteNum(r[2]), c=noteNum(r[3]);
     if(Math.abs(c-5)>0.12) return {ok:false, msg:'아직 농도가 '+r[3]+' % 입니다. 5 % 에 맞추세요.'};
     if(![0,1].every(k=>isFinite(got[k]))) return {ok:false, msg:'두 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-t)>1) return {ok:false, msg:'전체는 '+r[2]+' g 입니다.'};
     if(Math.abs(got[1]-c)>0.12) return {ok:false, msg:'농도는 '+r[3]+' % 입니다.'};
     if(pick!==0)
       return {ok:false, msg:'소금은 '+r[0]+' g 그대로인데 전체가 '+r[2]+' g 이 되었습니다. 이 사실을 보고 다시 고르세요.'};
     return {ok:true, msg:'판단했습니다 — <b>변하지 않는 것(소금)을 먼저 찾는 것</b>이 비율 문제를 방정식으로 바꾸는 열쇠입니다.'};
   }}""")
 +
 note(65, '내가 그리고 · 내가 재고 · 내가 판단한다',
 """  {t:'기록 — 두 호가 <b>만나는</b> 상태에서 PA 와 PB 를 적으세요',
   f:'PA = {0} · PB = {1}',
   chk(got, r, mem){
     if(!r) return {ok:false, msg:'아직 화면 값이 없습니다.'};
     if(String(r[2]).indexOf('안')>=0)
       return {ok:false, msg:'지금 «'+r[2]+'» 입니다. r 를 키워 두 호가 만나게 하세요.'};
     const pa=noteNum(r[3]), pb=noteNum(r[4]);
     if(![0,1].every(k=>isFinite(got[k]))) return {ok:false, msg:'두 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-pa)>0.2||Math.abs(got[1]-pb)>0.2)
       return {ok:false, msg:'화면은 '+r[3]+' 과 '+r[4]+' 입니다.'};
     mem.pa=pa; mem.r=noteNum(r[1]);
     return {ok:true, msg:'기록했습니다 — 두 거리가 어떤가요?'};
   }}""",
 """  {t:'생각 — 두 거리의 <b>차</b>를 구하세요',
   f:'PA − PB = {0}',
   chk(got, r, mem){
     if(mem.pa===undefined) return {ok:false, msg:'① 칸을 먼저 통과하세요.'};
     if(!isFinite(got[0])) return {ok:false, msg:'칸을 채우세요.'};
     if(Math.abs(got[0])>0.3) return {ok:false, msg:'①에 적은 두 거리를 빼 보세요. 무엇이 나오나요?'};
     mem.ok2=true;
     return {ok:true, msg:'계산했습니다 — 차가 0 입니다. r 를 바꿔도 그대로일까요?'};
   }}""",
 """  {t:'판단 — <b>r 를 바꿔</b> 다시 재어 본 뒤 고르세요',
   f:'새 r = {0} · 그때 PA = {1} · PB = {2}',
   opts:['두 호의 교점은 <b>A 에서도 B 에서도 거리가 r 로 같다</b> — 그래서 늘 PA = PB 다',
         'r 를 바꾸면 PA 와 PB 가 달라진다',
         '교점은 A 에 더 가깝다'],
   chk(got, r, mem, pick){
     if(!mem.ok2) return {ok:false, msg:'② 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     if(String(r[2]).indexOf('안')>=0) return {ok:false, msg:'«'+r[2]+'» 입니다. 두 호가 만나게 하세요.'};
     const rr=noteNum(r[1]), pa=noteNum(r[3]), pb=noteNum(r[4]);
     if(Math.abs(rr-mem.r)<1) return {ok:false, msg:'r 가 그대로입니다 — 바꿔 보세요.'};
     if(![0,1,2].every(k=>isFinite(got[k]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-rr)>0.6) return {ok:false, msg:'지금 r 는 '+r[1]+' 입니다.'};
     if(Math.abs(got[1]-pa)>0.2||Math.abs(got[2]-pb)>0.2)
       return {ok:false, msg:'지금은 '+r[3]+' 과 '+r[4]+' 입니다.'};
     if(pick!==0)
       return {ok:false, msg:'r 를 바꿨는데도 PA 와 PB 가 같습니다. 이 사실을 보고 다시 고르세요.'};
     return {ok:true, msg:'판단했습니다 — <b>호 위의 모든 점은 중심에서 거리가 r 로 같습니다.</b> 두 호의 교점은 A 에서도 B 에서도 r 이므로, 그 점들을 이은 선이 곧 «두 점에서 같은 거리인 점들의 모임» — 수직이등분선입니다.'};
   }}""")
 +
 note(66, '내가 작도하고 · 내가 재고 · 내가 판단한다',
 """  {t:'기록 — 각을 정해 작도한 뒤 두 각을 적으세요',
   f:'각 = {0} ° · 이등분선의 각 = {1} °',
   chk(got, r, mem){
     if(!r) return {ok:false, msg:'아직 작도가 되지 않았습니다. 호가 만나도록 r 를 맞추세요.'};
     const a=noteNum(r[0]), h=noteNum(r[3]);
     if(![0,1].every(k=>isFinite(got[k]))) return {ok:false, msg:'두 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-a)>0.8) return {ok:false, msg:'각은 '+r[0]+' 입니다.'};
     if(Math.abs(got[1]-h)>0.8) return {ok:false, msg:'이등분선의 각은 '+r[3]+' 입니다.'};
     mem.a=a; mem.h=h; mem.r1=noteNum(r[1]);
     return {ok:true, msg:'기록했습니다 — 이 각이 정말 절반인지 계산해 봅시다.'};
   }}""",
 """  {t:'생각 — <b>각 ÷ 2</b> 를 구해 이등분선의 각과 견주세요',
   f:'각 ÷ 2 = {0} · 이등분선의 각과의 차 = {1}',
   chk(got, r, mem){
     if(mem.a===undefined) return {ok:false, msg:'① 칸을 먼저 통과하세요.'};
     if(![0,1].every(k=>isFinite(got[k]))) return {ok:false, msg:'두 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-mem.a/2)>0.6) return {ok:false, msg:'①의 각을 2 로 나누세요.'};
     if(Math.abs(got[1])>0.8) return {ok:false, msg:'그 값에서 이등분선의 각을 빼 보세요. 무엇이 나오나요?'};
     mem.ok2=true;
     return {ok:true, msg:'계산했습니다 — 차가 거의 0 입니다. r 를 바꿔도 그럴까요?'};
   }}""",
 """  {t:'판단 — <b>r₁ 이나 r₂ 를 바꿔</b> 다시 작도한 뒤 고르세요',
   f:'새 r₁ = {0} · 그때 이등분선의 각 = {1} ° · 절반값 = {2} °',
   opts:['컴퍼스 반지름을 바꿔도 <b>이등분선은 그대로</b> 다 — 세 변이 같은 두 삼각형(SSS)이 만들어지기 때문',
         '반지름을 키우면 이등분선도 기운다',
         '반지름이 클수록 더 정확해진다'],
   chk(got, r, mem, pick){
     if(!mem.ok2) return {ok:false, msg:'② 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'작도가 되지 않았습니다. 호가 만나도록 r 를 맞추세요.'};
     const r1=noteNum(r[1]), h=noteNum(r[3]), hf=noteNum(r[4]);
     if(Math.abs(r1-mem.r1)<2) return {ok:false, msg:'r₁ 이 그대로입니다 — 바꿔 보세요.'};
     if(![0,1,2].every(k=>isFinite(got[k]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-r1)>1.5) return {ok:false, msg:'지금 r₁ 은 '+r[1]+' 입니다.'};
     if(Math.abs(got[1]-h)>0.8||Math.abs(got[2]-hf)>0.8)
       return {ok:false, msg:'지금은 '+r[3]+' 과 '+r[4]+' 입니다.'};
     if(pick!==0)
       return {ok:false, msg:'r₁ 을 바꿨는데도 이등분선의 각이 절반값과 «'+r[5]+'» 입니다. 이 사실을 보고 다시 고르세요.'};
     return {ok:true, msg:'판단했습니다 — <b>호 r₁ 이 만든 두 점은 O 에서 같은 거리, 교점은 그 두 점에서 같은 거리</b> 입니다. 세 변이 각각 같은 두 삼각형이 겹치므로(SSS) 두 각이 같아집니다 — 각도기 없이도 정확한 절반입니다.'};
   }}""")
 +
 note(67, '내가 자르고 · 내가 견주고 · 내가 판단한다',
 """  {t:'기록 — 중심각과 r 를 정한 뒤 값을 적으세요',
   f:'중심각 = {0} ° · r = {1} · 호 l = {2}',
   chk(got, r, mem){
     if(!r) return {ok:false, msg:'아직 화면 값이 없습니다.'};
     const a=noteNum(r[0]), rr=noteNum(r[1]), l=noteNum(r[2]);
     if(![0,1,2].every(k=>isFinite(got[k]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-a)>0.8||Math.abs(got[1]-rr)>0.8)
       return {ok:false, msg:'화면은 '+r[0]+' 와 '+r[1]+' 입니다.'};
     if(Math.abs(got[2]-l)>0.2) return {ok:false, msg:'호 l 은 '+r[2]+' 입니다.'};
     mem.rr=rr; mem.l=l;
     return {ok:true, msg:'기록했습니다 — 이제 두 가지 방법으로 넓이를 구해 견주어 봅시다.'};
   }}""",
 """  {t:'생각 — <b>½ × r × l</b> 을 직접 계산해 화면의 두 값과 견주세요',
   f:'½ r l = {0} · 화면의 πr²×각/360 = {1} · 두 값의 차 = {2}',
   chk(got, r, mem){
     if(mem.rr===undefined) return {ok:false, msg:'① 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const a1=noteNum(r[3]), a2=noteNum(r[4]);
     if(![0,1,2].every(k=>isFinite(got[k]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-a1)>1.5) return {ok:false, msg:'①의 r 와 l 을 곱하고 반으로 나누세요 — 화면에는 '+r[3]+' 로 나와 있습니다.'};
     if(Math.abs(got[1]-a2)>1.5) return {ok:false, msg:'화면의 값은 '+r[4]+' 입니다.'};
     if(Math.abs(got[2])>2) return {ok:false, msg:'두 값을 빼 보세요. 무엇이 나오나요?'};
     mem.ok2=true;
     return {ok:true, msg:'계산했습니다 — 두 값이 같습니다. 각을 바꿔도 그럴까요?'};
   }}""",
 """  {t:'판단 — <b>중심각을 바꿔</b> 다시 견준 뒤 고르세요',
   f:'새 중심각 = {0} ° · ½rl = {1} · πr²×각/360 = {2}',
   opts:['부채꼴을 잘라 붙이면 <b>가로 l/2 · 세로 r</b> 인 띠가 된다 — 그래서 S = ½ r l 이다',
         '가로가 l 이고 세로가 r 이므로 S = r l 이다',
         '½ 은 그냥 공식을 외울 때 붙는 수다'],
   chk(got, r, mem, pick){
     if(!mem.ok2) return {ok:false, msg:'② 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const a=noteNum(r[0]), a1=noteNum(r[3]), a2=noteNum(r[4]);
     if(![0,1,2].every(k=>isFinite(got[k]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-a)>0.8) return {ok:false, msg:'지금 중심각은 '+r[0]+' 입니다.'};
     if(Math.abs(got[1]-a1)>1.5||Math.abs(got[2]-a2)>1.5)
       return {ok:false, msg:'지금은 '+r[3]+' 와 '+r[4]+' 입니다.'};
     if(pick!==0)
       return {ok:false, msg:'각을 바꿔도 두 값이 «'+r[5]+'» 입니다. 조각을 번갈아 붙인 띠의 가로가 무엇이었는지 다시 보세요.'};
     return {ok:true, msg:'판단했습니다 — <b>호는 위쪽 조각과 아래쪽 조각에 절반씩 나뉘어 붙습니다.</b> 그래서 가로가 l 이 아니라 l/2 이고, 삼각형 넓이 ½ × 밑변 × 높이와 똑같은 구조가 됩니다.'};
   }}""")
 +
 note(68, '내가 모으고 · 내가 재고 · 내가 판단한다',
 """  {t:'기록 — 조합을 하나 골라 화면의 값을 적으세요',
   f:'한 내각 = {0} ° · 장수 = {1} · 각의 합 = {2} °',
   chk(got, r, mem){
     if(!r) return {ok:false, msg:'아직 화면 값이 없습니다.'};
     const ia=noteNum(r[1]), m=noteNum(r[2]), s=noteNum(r[3]);
     if(m<3) return {ok:false, msg:'장수를 3 장 이상으로 맞추세요 — 두 장으로는 꼭짓점이 생기지 않습니다.'};
     if(![0,1,2].every(k=>isFinite(got[k]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-ia)>0.8) return {ok:false, msg:'한 내각은 '+r[1]+' 입니다.'};
     if(Math.abs(got[1]-m)>0.5) return {ok:false, msg:'장수는 '+r[2]+' 입니다.'};
     if(Math.abs(got[2]-s)>0.8) return {ok:false, msg:'각의 합은 '+r[3]+' 입니다.'};
     mem.s=s; mem.poly=String(r[0]);
     return {ok:true, msg:'기록했습니다 — 이 합을 360° 와 견주어 봅시다.'};
   }}""",
 """  {t:'생각 — <b>360 − 각의 합</b> 을 구하세요',
   f:'360 − 각의 합 = {0} · 남는 틈이 있으면 1, 없거나 모자라면 0 → {1}',
   chk(got, r, mem){
     if(mem.s===undefined) return {ok:false, msg:'① 칸을 먼저 통과하세요.'};
     if(![0,1].every(k=>isFinite(got[k]))) return {ok:false, msg:'두 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-(360-mem.s))>0.8) return {ok:false, msg:'360 에서 ①의 각의 합을 빼세요.'};
     const want=(360-mem.s)>0?1:0;
     if(Math.abs(got[1]-want)>0.01)
       return {ok:false, msg:'360 − 각의 합 = '+(360-mem.s)+' 입니다. 남는 틈이 있나요?'};
     mem.ok2=true;
     return {ok:true, msg:'계산했습니다 — 이제 <b>정육각형 3장</b> 을 시험해 봅시다.'};
   }}""",
 """  {t:'판단 — <b>정육각형 3장</b> 을 맞춘 뒤 고르세요',
   f:'한 내각 = {0} ° · 각의 합 = {1} ° · 360 − 각의 합 = {2}',
   opts:['한 점에 모인 각의 합이 <b>360° 보다 작아야</b> 오므라들어 입체가 된다 — 그래서 정다면체는 5개뿐이다',
         '각의 합이 360° 여야 입체가 된다',
         '각의 합이 클수록 더 좋은 입체가 된다'],
   chk(got, r, mem, pick){
     if(!mem.ok2) return {ok:false, msg:'② 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const ia=noteNum(r[1]), m=noteNum(r[2]), s=noteNum(r[3]);
     if(String(r[0]).indexOf('6')<0||Math.abs(m-3)>0.5)
       return {ok:false, msg:'지금 «'+r[0]+' '+r[2]+'장» 입니다. 정육각형 3장으로 맞추세요.'};
     if(![0,1,2].every(k=>isFinite(got[k]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-ia)>0.8||Math.abs(got[1]-s)>0.8)
       return {ok:false, msg:'지금은 '+r[1]+' 와 '+r[3]+' 입니다.'};
     if(Math.abs(got[2]-(360-s))>0.8) return {ok:false, msg:'360 에서 각의 합을 빼세요.'};
     if(pick!==0)
       return {ok:false, msg:'정육각형 3장의 합은 딱 360° — 틈이 0 이라 평평하게 깔릴 뿐 오므라들지 않습니다(«'+r[4]+'»). 이 사실을 보고 다시 고르세요.'};
     return {ok:true, msg:'판단했습니다 — <b>한 내각 × 3 ≥ 360°</b> 이면 단 하나도 만들 수 없습니다. 정육각형(108°가 아니라 120°) 부터는 그래서 전멸이고, 남는 조합이 정삼각형 3·4·5장, 정사각형 3장, 정오각형 3장 — 모두 다섯 가지뿐입니다.'};
   }}""")
 +
 note(69, '내가 담고 · 내가 견주고 · 내가 판단한다',
 """  {t:'기록 — 간식을 담아 <b>아직 만족하는</b> 상태에서 적으세요',
   f:'담은 수 x = {0} · 금액 = {1} 원 · 남은 돈 = {2} 원',
   chk(got, r, mem){
     if(!r) return {ok:false, msg:'아직 화면 값이 없습니다.'};
     if(String(r[3]).indexOf('위반')>=0)
       return {ok:false, msg:'지금 «'+r[3]+'» 입니다. 하나 덜어 만족하는 상태로 만드세요.'};
     const x=noteNum(r[0]), m=noteNum(r[1]), left=noteNum(r[4]);
     if(!(x>0)) return {ok:false, msg:'간식을 하나 이상 담아 보세요.'};
     if(![0,1,2].every(k=>isFinite(got[k]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-x)>0.5) return {ok:false, msg:'담은 수는 '+r[0]+' 입니다.'};
     if(Math.abs(got[1]-m)>1) return {ok:false, msg:'금액은 '+r[1]+' 원입니다.'};
     if(Math.abs(got[2]-left)>1) return {ok:false, msg:'남은 돈은 '+r[4]+' 원입니다.'};
     mem.x=x; mem.left=left;
     return {ok:true, msg:'기록했습니다 — 하나씩 더 담아 언제 깨지는지 봅시다.'};
   }}""",
 """  {t:'생각 — 하나씩 더 담아 <b>위반</b>이 되는 순간에서 적으세요',
   f:'위반이 된 x = {0} · 그 직전의 x = {1}',
   chk(got, r, mem){
     if(mem.x===undefined) return {ok:false, msg:'① 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     if(String(r[3]).indexOf('위반')<0)
       return {ok:false, msg:'아직 «'+r[3]+'» 입니다. 하나 더 담아 예산을 넘겨 보세요.'};
     const x=noteNum(r[0]);
     if(![0,1].every(k=>isFinite(got[k]))) return {ok:false, msg:'두 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-x)>0.5) return {ok:false, msg:'지금 x 는 '+r[0]+' 입니다.'};
     if(Math.abs(got[1]-(x-1))>0.5) return {ok:false, msg:'위반이 된 수보다 하나 작은 수입니다.'};
     mem.edge=x-1;
     return {ok:true, msg:'계산했습니다 — 살 수 있는 마지막 개수는 <b>'+mem.edge+'개</b> 입니다.'};
   }}""",
 """  {t:'판단 — 그 경계와 <b>6.25</b> 를 견주어 고르세요',
   f:'경계의 개수 = {0} · 6.25 − 경계 = {1}',
   opts:['부등식의 해는 x ≤ 6.25 지만, <b>셀 수 있는 것</b>이므로 실제 답은 자연수 <b>6</b> 이다',
         '6.25 개를 살 수 있다',
         '부등식을 잘못 푼 것이므로 답은 7 이다'],
   chk(got, r, mem, pick){
     if(mem.edge===undefined) return {ok:false, msg:'② 칸을 먼저 통과하세요.'};
     if(![0,1].every(k=>isFinite(got[k]))) return {ok:false, msg:'두 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-mem.edge)>0.5) return {ok:false, msg:'②에서 찾은 경계는 '+mem.edge+' 입니다.'};
     if(Math.abs(got[1]-(6.25-mem.edge))>0.05) return {ok:false, msg:'6.25 에서 경계를 빼세요.'};
     if(pick!==0)
       return {ok:false, msg:'실제로 담아 보니 '+mem.edge+'개까지였습니다. 이 사실을 보고 다시 고르세요.'};
     return {ok:true, msg:'판단했습니다 — <b>식의 해와 «실제로 살 수 있는 수»는 다릅니다.</b> 셀 수 있는 것을 묻는 문제에서는 해를 구한 뒤 반드시 «자연수로 답하기»를 한 번 더 해야 합니다.'};
   }}""")
 +
 note(70, '내가 나누고 · 내가 세고 · 내가 판단한다',
 """  {t:'기록 — <b>m = 10</b> 으로 배정한 뒤 화면의 값을 적으세요',
   f:'m = {0} · 배정 인원 = {1} · 충돌 칸 = {2}',
   chk(got, r, mem){
     if(!r) return {ok:false, msg:'아직 배정하지 않았습니다. 학번을 넣어 보세요.'};
     const m=noteNum(r[0]), n=noteNum(r[1]), used=noteNum(r[2]), coll=noteNum(r[3]);
     if(Math.abs(m-10)>0.5) return {ok:false, msg:'지금 m = '+r[0]+' 입니다. 먼저 m = 10 으로 맞추세요.'};
     if(![0,1,2].every(k=>isFinite(got[k]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-m)>0.5) return {ok:false, msg:'m 은 '+r[0]+' 입니다.'};
     if(Math.abs(got[1]-n)>0.5) return {ok:false, msg:'배정 인원은 '+r[1]+' 입니다.'};
     if(Math.abs(got[2]-coll)>0.5) return {ok:false, msg:'충돌 칸은 '+r[3]+' 입니다.'};
     mem.used10=used; mem.coll10=coll; mem.n=n;
     return {ok:true, msg:'기록했습니다 — m = 10 에서는 '+r[2]+' 칸만 쓰였습니다. 다른 m 은 어떨까요?'};
   }}""",
 """  {t:'생각 — <b>m = 7</b> 로 바꿔 배정한 뒤 견주세요',
   f:'쓰인 사물함 칸 수 = {0} · m = 10 일 때와의 차 = {1}',
   chk(got, r, mem){
     if(mem.used10===undefined) return {ok:false, msg:'① 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const m=noteNum(r[0]), used=noteNum(r[2]);
     if(Math.abs(m-7)>0.5) return {ok:false, msg:'지금 m = '+r[0]+' 입니다. m = 7 로 맞추세요.'};
     if(![0,1].every(k=>isFinite(got[k]))) return {ok:false, msg:'두 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-used)>0.5) return {ok:false, msg:'쓰인 사물함은 «'+r[2]+'» — 앞의 수를 적으세요.'};
     if(Math.abs(got[1]-(used-mem.used10))>0.5) return {ok:false, msg:'지금 칸 수에서 ①의 칸 수를 빼세요.'};
     mem.used7=used;
     return {ok:true, msg:'계산했습니다 — m = 7 에서는 '+r[2]+' 칸이 쓰였습니다.'};
   }}""",
 """  {t:'판단 — 두 결과를 견주어 고르세요',
   f:'m = 10 일 때 쓰인 칸 = {0} · m = 7 일 때 쓰인 칸 = {1}',
   opts:['학번이 모두 짝수인데 m 도 짝수면 <b>나머지가 짝수뿐</b> 이라 절반이 빈다 — 그래서 소수 m 이 유리하다',
         'm 이 클수록 무조건 골고루 퍼진다',
         '나머지는 학번의 성질과 관계없이 늘 골고루 퍼진다'],
   chk(got, r, mem, pick){
     if(mem.used7===undefined) return {ok:false, msg:'② 칸을 먼저 통과하세요.'};
     if(![0,1].every(k=>isFinite(got[k]))) return {ok:false, msg:'두 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-mem.used10)>0.5||Math.abs(got[1]-mem.used7)>0.5)
       return {ok:false, msg:'①과 ②에 적은 '+mem.used10+' 과 '+mem.used7+' 을 넣으세요.'};
     if(pick!==0)
       return {ok:false, msg:'m = 10 에서는 '+mem.used10+' 칸, m = 7 에서는 '+mem.used7+' 칸이 쓰였습니다. m = 10 에서 어떤 칸들이 비었는지 화면에서 보고 다시 고르세요.'};
     return {ok:true, msg:'판단했습니다 — <b>학번 = m × 몫 + 나머지</b> 이므로 학번과 m 이 모두 2의 배수면 나머지도 2의 배수일 수밖에 없습니다. 실제 해시 함수가 소수를 즐겨 쓰는 이유가 이것입니다.'};
   }}""")
)


def main(path):
    h = open(path, encoding='utf-8').read()
    if 'LESSON[61]=' in h:
        sys.stdout.write('already applied\n')
        return
    L = (LESSONS.replace('__S61__', S61).replace('__B62__', B62)
         .replace('__F67__', F67).replace('__V68__', V68)
         .replace('__L69__', L69).replace('__H70__', H70))
    a = 'LESSON[356]={'
    assert h.count(a) == 1
    h = h.replace(a, L + a, 1)
    b = '\n};\n\nfunction labNo(spec)'
    assert h.count(b) == 1
    h = h.replace(b, NOTES + b, 1)
    open(path, 'w', encoding='utf-8').write(h)
    sys.stdout.write('LAB 61~70 ok %.2f MB\n' % (len(h.encode('utf-8')) / 1048576))


if __name__ == '__main__':
    main(sys.argv[1])
