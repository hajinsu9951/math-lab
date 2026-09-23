# -*- coding: utf-8 -*-
"""LAB 71~80 — 7단계 수업 모형 + 탐구 노트.

실험 화면은 이미 있는 열 개 데모를 그대로 쓴다 (patch_demo_read.py 로 read() 를 내주게 한다).
그림은 좌표를 계산해서 그린다.

사용: python docs/LAB71_80_수업모형/patch_lab71_80.py src/40-demos.js
"""
import sys, math

# ── LAB 71 · 1/3 을 나누면 나머지가 되돌아온다 ────────────────────
def loop71():
    """1 ÷ 7 의 나머지 1·3·2·6·4·5 가 고리를 이루는 그림."""
    rs, r = [], 1
    for _ in range(6):
        rs.append(r)
        r = (r * 10) % 7
    cx, cy, R = 300.0, 88.0, 46.0
    out = []
    pts = []
    for k, v in enumerate(rs):
        a = math.radians(-90 + k * 60)
        x, y = cx + R * math.cos(a), cy + R * math.sin(a)
        pts.append((x, y))
        out.append('<circle cx="%.1f" cy="%.1f" r="12" fill="#2563EB" opacity=".16" stroke="#2563EB" stroke-width="1.4"/>' % (x, y))
        out.append('<text x="%.1f" y="%.1f" font-size="11" font-weight="800" fill="#1D4ED8" text-anchor="middle">%d</text>' % (x, y + 4, v))
    for k in range(6):
        x0, y0 = pts[k]
        x1, y1 = pts[(k + 1) % 6]
        dx, dy = x1 - x0, y1 - y0
        L = math.hypot(dx, dy)
        ux, uy = dx / L, dy / L
        out.append('<path d="M%.1f %.1f L%.1f %.1f" stroke="#9CA3AF" stroke-width="1.3"/>'
                   % (x0 + ux * 14, y0 + uy * 14, x1 - ux * 15, y1 - uy * 15))
    return ''.join(out)


L71 = loop71()

# ── LAB 73 · 0.1 mm 종이를 n 번 접었을 때의 두께 (로그 눈금) ───────
def fold73():
    X = lambda n: 52 + 7.4 * n
    Y = lambda mm: 146 - 9.6 * math.log10(max(mm, 0.1) / 0.1)
    pts = ' '.join('%s%.1f %.1f' % ('M' if n == 0 else 'L', X(n), Y(0.1 * 2 ** n)) for n in range(43))
    out = ['<path d="M46 146 H382 M46 146 V22" stroke="#9CA3AF" stroke-width="1.3"/>',
           '<path d="%s" stroke="#2563EB" stroke-width="2.4" fill="none"/>' % pts]
    moon = 384400e6            # mm
    ym = Y(moon)
    out.append('<path d="M46 %.1f H382" stroke="#BE123C" stroke-width="1.4" stroke-dasharray="5 3"/>' % ym)
    out.append('<text x="378" y="%.1f" font-size="10" font-weight="800" fill="#BE123C" text-anchor="end">달까지 384,400 km</text>' % (ym - 5))
    n42 = 0.1 * 2 ** 42
    out.append('<circle cx="%.1f" cy="%.1f" r="5" fill="#BE123C"/>' % (X(42), Y(n42)))
    out.append('<text x="%.1f" y="%.1f" font-size="10.5" font-weight="800" fill="#BE123C" text-anchor="end">42번</text>' % (X(42) - 8, Y(n42) + 4))
    # 더하기였다면 — 43 장 겹친 두께는 4.3mm, 눈금에서 거의 바닥
    out.append('<path d="M%.1f %.1f L%.1f %.1f" stroke="#0E9384" stroke-width="2" stroke-dasharray="4 3"/>'
               % (X(0), Y(0.1), X(42), Y(0.1 * 43)))
    out.append('<text x="%.1f" y="%.1f" font-size="10" font-weight="800" fill="#0B6E63">한 장씩 «더하기» 였다면</text>' % (X(20), Y(0.1 * 43) - 6))
    out.append('<text x="200" y="164" font-size="10.5" fill="#6B7280" text-anchor="middle">세로는 «10배마다 한 칸» — 그래야 이 차이가 한 화면에 들어간다</text>')
    return ''.join(out)


F73 = fold73()

# ── LAB 74 · −2 를 곱하면 수직선이 뒤집힌다 ───────────────────────
def flip74():
    X = lambda v: 200 + 15.5 * v
    out = ['<path d="M36 62 H384" stroke="#9CA3AF" stroke-width="1.3"/>',
           '<path d="M36 128 H384" stroke="#9CA3AF" stroke-width="1.3"/>']
    for v, lab, col in ((2, 'a', '#2563EB'), (5, 'b', '#0E9384')):
        out.append('<circle cx="%.1f" cy="62" r="5" fill="%s"/>' % (X(v), col))
        out.append('<text x="%.1f" y="50" font-size="11" font-weight="800" fill="%s" text-anchor="middle">%s = %d</text>' % (X(v), col, lab, v))
    for v, lab, col in ((-4, '−2a', '#2563EB'), (-10, '−2b', '#0E9384')):
        out.append('<circle cx="%.1f" cy="128" r="5" fill="%s"/>' % (X(v), col))
        out.append('<text x="%.1f" y="148" font-size="11" font-weight="800" fill="%s" text-anchor="middle">%s = %d</text>' % (X(v), col, lab, v))
    out.append('<path d="M%.1f 68 L%.1f 122" stroke="#B45309" stroke-width="1.5" stroke-dasharray="4 3"/>' % (X(2), X(-4)))
    out.append('<path d="M%.1f 68 L%.1f 122" stroke="#B45309" stroke-width="1.5" stroke-dasharray="4 3"/>' % (X(5), X(-10)))
    out.append('<text x="200" y="26" font-size="10.5" fill="#6B7280" text-anchor="middle">위에서는 a 가 왼쪽 — 아래에서는 −2a 가 오른쪽</text>')
    out.append('<text x="200" y="166" font-size="10.5" fill="#6B7280" text-anchor="middle">두 점의 «앞뒤»가 통째로 맞바뀌었다</text>')
    return ''.join(out)


P74 = flip74()

# ── LAB 75 · 세 가지 경우 ─────────────────────────────────────────
def sys75():
    out = []
    for k, (title, ls, col) in enumerate((
            ('한 점에서 만난다', [(1.0, -1.0), (-0.9, 2.2)], '#2563EB'),
            ('평행 — 해가 없다', [(1.0, -1.0), (1.0, 1.6)], '#BE123C'),
            ('겹친다 — 무수히', [(1.0, -0.2), (1.0, -0.2)], '#0E9384'))):
        ox = 24 + k * 126
        out.append('<rect x="%d" y="30" width="108" height="94" rx="8" fill="#fff" stroke="#E5E7EB" stroke-width="1.3"/>' % ox)
        for i, (m, c) in enumerate(ls):
            x0, x1 = ox + 8, ox + 100
            def Y(x):
                t = (x - (ox + 54)) / 24.0
                return 77 - (m * t + c) * 16
            off = 2.4 if (i and ls[0] == ls[1]) else 0
            out.append('<path d="M%.1f %.1f L%.1f %.1f" stroke="%s" stroke-width="2" opacity="%s"/>'
                       % (x0, Y(x0) + off, x1, Y(x1) + off, col, '.55' if off else '1'))
        out.append('<text x="%d" y="140" font-size="10.5" font-weight="800" fill="%s" text-anchor="middle">%s</text>'
                   % (ox + 54, col, title))
    out.append('<text x="200" y="20" font-size="10.5" fill="#6B7280" text-anchor="middle">연립방정식의 해는 «두 직선이 만나는 점»이다</text>')
    return ''.join(out)


Y75 = sys75()

# ── LAB 77 · 기울기와 절편은 따로 논다 ───────────────────────────
def slope77():
    X = lambda x: 200 + 30 * x
    Y = lambda y: 86 - 22 * y
    out = ['<path d="M30 86 H378 M200 16 V156" stroke="#9CA3AF" stroke-width="1.2"/>']
    for m, c, col, w in ((1, 1, '#9CA3AF', 1.6), (2.2, 1, '#2563EB', 2.4), (1, -1.6, '#0E9384', 2.4)):
        x0, x1 = -5.2, 5.2
        y0, y1 = m * x0 + c, m * x1 + c
        # 화면 밖으로 나가지 않게 자른다
        for _ in range(40):
            if Y(y0) < 18:
                x0 += 0.1; y0 = m * x0 + c
            elif Y(y0) > 154:
                x0 += 0.1; y0 = m * x0 + c
            else:
                break
        for _ in range(40):
            if Y(y1) < 18 or Y(y1) > 154:
                x1 -= 0.1; y1 = m * x1 + c
            else:
                break
        out.append('<path d="M%.1f %.1f L%.1f %.1f" stroke="%s" stroke-width="%.1f"/>'
                   % (X(x0), Y(y0), X(x1), Y(y1), col, w))
    out.append('<circle cx="%.1f" cy="%.1f" r="4.6" fill="#1D4ED8"/>' % (X(0), Y(1)))
    out.append('<text x="%.1f" y="%.1f" font-size="10" font-weight="800" fill="#1D4ED8">절편은 그대로 · 기울기만</text>' % (X(0.3), Y(1) - 8))
    out.append('<circle cx="%.1f" cy="%.1f" r="4.6" fill="#0B6E63"/>' % (X(0), Y(-1.6)))
    out.append('<text x="%.1f" y="%.1f" font-size="10" font-weight="800" fill="#0B6E63">기울기는 그대로 · 절편만</text>' % (X(0.3), Y(-1.6) + 16))
    out.append('<text x="200" y="168" font-size="10.5" fill="#6B7280" text-anchor="middle">«얼마나 가파른가»와 «어디서 출발하는가»는 서로 상관이 없다</text>')
    return ''.join(out)


S77 = slope77()

# ── LAB 79 · 무게중심은 세 꼭짓점의 평균 ─────────────────────────
def cent79():
    A, B, C = (96.0, 140.0), (300.0, 130.0), (186.0, 34.0)
    G = ((A[0] + B[0] + C[0]) / 3, (A[1] + B[1] + C[1]) / 3)
    out = ['<polygon points="%.1f,%.1f %.1f,%.1f %.1f,%.1f" fill="#2563EB" opacity=".10" stroke="#2563EB" stroke-width="1.8"/>'
           % (A[0], A[1], B[0], B[1], C[0], C[1])]
    for P, Q, R, col in ((A, B, C, '#B45309'), (B, C, A, '#B45309'), (C, A, B, '#B45309')):
        M = ((P[0] + Q[0]) / 2, (P[1] + Q[1]) / 2)
        out.append('<path d="M%.1f %.1f L%.1f %.1f" stroke="%s" stroke-width="1.3" stroke-dasharray="4 3"/>'
                   % (R[0], R[1], M[0], M[1], col))
        out.append('<circle cx="%.1f" cy="%.1f" r="3" fill="%s"/>' % (M[0], M[1], col))
    out.append('<circle cx="%.1f" cy="%.1f" r="6" fill="#BE123C"/>' % G)
    out.append('<text x="%.1f" y="%.1f" font-size="10.5" font-weight="800" fill="#BE123C">무게중심</text>' % (G[0] + 10, G[1] + 4))
    for P, nm in ((A, 'A'), (B, 'B'), (C, 'C')):
        out.append('<circle cx="%.1f" cy="%.1f" r="4" fill="#111827"/>' % P)
        out.append('<text x="%.1f" y="%.1f" font-size="10.5" font-weight="800" fill="#111827">%s</text>'
                   % (P[0] - 12 if P[0] < 200 else P[0] + 8, P[1] + 4, nm))
    out.append('<text x="200" y="20" font-size="10.5" fill="#6B7280" text-anchor="middle">세 중선이 한 점에서 만난다 — 그 점이 손끝에 놓인다</text>')
    out.append('<text x="200" y="164" font-size="10.5" fill="#6B7280" text-anchor="middle">그 점의 좌표는 세 꼭짓점의 «평균»이다</text>')
    return ''.join(out)


G79 = cent79()

# ── LAB 80 · 사다리꼴은 왜 탈락인가 ──────────────────────────────
def para80():
    out = []
    P1 = [(40, 128), (152, 128), (176, 56), (64, 56)]          # 평행사변형
    P2 = [(228, 128), (372, 128), (338, 56), (256, 56)]        # 사다리꼴
    for pts, col, cap in ((P1, '#0E9384', '평행사변형'), (P2, '#BE123C', '사다리꼴')):
        out.append('<polygon points="%s" fill="%s" opacity=".12" stroke="%s" stroke-width="2"/>'
                   % (' '.join('%d,%d' % p for p in pts), col, col))
        cx = sum(p[0] for p in pts) / 4
        out.append('<text x="%.0f" y="152" font-size="10.5" font-weight="800" fill="%s" text-anchor="middle">%s</text>' % (cx, col, cap))
    # 두 대각선의 교점 — 평행사변형에서는 서로를 이등분한다
    def inter(a, b, c, d):
        x1, y1 = a; x2, y2 = b; x3, y3 = c; x4, y4 = d
        den = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4)
        px = ((x1 * y2 - y1 * x2) * (x3 - x4) - (x1 - x2) * (x3 * y4 - y3 * x4)) / den
        py = ((x1 * y2 - y1 * x2) * (y3 - y4) - (y1 - y2) * (x3 * y4 - y3 * x4)) / den
        return px, py
    for pts, col in ((P1, '#0E9384'), (P2, '#BE123C')):
        out.append('<path d="M%d %d L%d %d M%d %d L%d %d" stroke="%s" stroke-width="1.2" stroke-dasharray="4 3"/>'
                   % (pts[0][0], pts[0][1], pts[2][0], pts[2][1],
                      pts[1][0], pts[1][1], pts[3][0], pts[3][1], col))
        X = inter(pts[0], pts[2], pts[1], pts[3])
        out.append('<circle cx="%.1f" cy="%.1f" r="4" fill="%s"/>' % (X[0], X[1], col))
    out.append('<text x="200" y="20" font-size="10.5" fill="#6B7280" text-anchor="middle">한 쌍만 평행하면 왜 모자랄까</text>')
    out.append('<text x="200" y="168" font-size="10.5" fill="#6B7280" text-anchor="middle">대각선이 서로를 «이등분»하는가 — 거기서 갈린다</text>')
    return ''.join(out)


Q80 = para80()


LESSONS = """LESSON[71]={
 title:'0.1 + 0.2 는 왜 0.3 이 아닐까',
 problem:{
  q:'계산기에 <b>0.1 + 0.2</b> 를 넣으면 0.3 이 나옵니다. 그런데 파이썬에 넣으면 <b>0.30000000000000004</b> 가 나옵니다. 컴퓨터가 고장 난 걸까요? 이 답은 <b>1/3 = 0.333…</b> 과 같은 자리에서 나옵니다.',
  svg:`<svg viewBox="0 0 400 170" role="img" aria-label="1을 7로 나눌 때 나머지 1·3·2·6·4·5 가 고리를 이루며 되돌아오는 그림">
    <text x="130" y="48" font-size="12" font-weight="800" fill="#111827" text-anchor="middle">1 ÷ 7 의 나머지</text>
    <text x="130" y="72" font-size="10.5" fill="#6B7280" text-anchor="middle">나머지는 0 ~ 6 의</text>
    <text x="130" y="90" font-size="10.5" fill="#6B7280" text-anchor="middle">일곱 가지뿐이다</text>
    <text x="130" y="114" font-size="10.5" font-weight="800" fill="#B45309" text-anchor="middle">그러니 반드시 되돌아온다</text>
    __L71__
    <text x="200" y="164" font-size="10.5" fill="#6B7280" text-anchor="middle">되돌아온 자리에서 같은 자릿수가 다시 시작된다 — 그것이 순환마디</text>
  </svg>`,
  sit:'분수를 하나 골라 <b>한 자리씩</b> 나눠 보면 나머지가 어떻게 이어지는지 보입니다. <b>분모의 소인수</b> 와 <b>유한/순환</b> 이 나란히 표시되어, 무엇이 둘을 가르는지 직접 찾을 수 있습니다.'
 },
 predict:{
  q:['1/4 는 유한소수인데 1/3 은 순환소수입니다. 무엇이 둘을 가를지 예상하세요.',
     '1/7 의 나머지가 언젠가 반드시 반복되는 까닭을 적어 보세요.',
     '컴퓨터가 0.1 을 정확히 담지 못하는 까닭을 짐작해 보세요.'] },
 missions:[
  {t:'분수를 골라 <b>한 자리씩</b> 나눠 보세요. 나머지가 어떻게 되나요?', re:'순환'},
  {t:'<b>분모의 소인수</b> 와 <b>유한/순환</b> 을 견주어 보세요.', re:'유한'},
  {t:'아래 <b>탐구 노트</b>로 마무리하세요 — 분수를 <b>기록</b>하고, 소인수를 <b>견주고</b>, 규칙을 <b>판단</b>합니다.',
   re:'탐구 노트 통과',
   do:'① 유한소수가 되는 분수 하나 적기 ② 순환소수가 되는 분수 하나 적기 ③ 두 분모의 소인수를 견주기',
   hand:'나머지가 반드시 겹치는 까닭을 <b>비둘기집</b> 으로 설명하고, 이진법에서 1/10 이 순환인 까닭도 적기'}],
 inquiry:{
  id:'fd71', title:'왜 0.1 + 0.2 는 0.3 이 아닐까',
  q:['여덟 분수를 모두 골라 끝까지(또는 순환이 보일 때까지) 나눠 보고 기록하세요.',
     '「분모의 소인수」와 「유한/순환」 열을 견주어 규칙을 찾으세요.',
     '나머지가 반드시 겹치는 까닭을 손으로 설명하고, 이진법에서 1/10 이 순환인 까닭도 적으세요.'],
  cols:['분수','분모의 소인수','유한/순환','순환마디','마디 길이'],
  hint:'힌트 — 나머지는 0 ~ (분모−1) 의 가짓수뿐입니다. 유한하지 않으면 반드시 재방문합니다.' },
 apply:{
  q:'새 문제 — <b>1/7 = 0.142857142857…</b> 의 순환마디는 142857 입니다. 이 마디의 <b>길이</b>는?',
  a:6, tol:0.5,
  why:'142857 은 여섯 자리입니다. 나머지가 1·3·2·6·4·5 여섯 가지를 돌고 다시 1 로 돌아오기 때문입니다.',
  hint:'몇 자리가 되풀이되나요?' },
 demo(root){ return fracDecDemo(root); }
};

LESSON[72]={
 title:'0.242424… 를 분수로 — 순환마디 복원',
 problem:{
  q:'<b>0.242424…</b> 는 끝없이 이어집니다. 그런데 이 무한한 수를 <b>분수 하나</b> 로 정확히 쓸 수 있습니다. 끝이 없는 꼬리를 어떻게 없앨 수 있을까요?',
  svg:`<svg viewBox="0 0 400 170" role="img" aria-label="x 와 100x 를 세로로 맞추어 빼면 무한한 꼬리가 사라지는 그림">
    <text x="60" y="52" font-size="13" font-weight="800" fill="#111827">100x =</text>
    <text x="124" y="52" font-size="13" font-weight="800" fill="#1D4ED8">24</text>
    <text x="150" y="52" font-size="13" font-weight="800" fill="#B45309">.242424…</text>
    <text x="72" y="86" font-size="13" font-weight="800" fill="#111827">x =</text>
    <text x="130" y="86" font-size="13" font-weight="800" fill="#1D4ED8">0</text>
    <text x="150" y="86" font-size="13" font-weight="800" fill="#B45309">.242424…</text>
    <path d="M52 100 H300" stroke="#111827" stroke-width="1.6"/>
    <text x="60" y="126" font-size="13" font-weight="800" fill="#111827">99x =</text>
    <text x="124" y="126" font-size="13" font-weight="800" fill="#0B6E63">24</text>
    <rect x="146" y="30" width="96" height="62" rx="5" fill="#B45309" opacity=".12" stroke="#B45309" stroke-width="1.3" stroke-dasharray="4 3"/>
    <text x="316" y="62" font-size="10.5" font-weight="800" fill="#92400E">꼬리가</text>
    <text x="316" y="80" font-size="10.5" font-weight="800" fill="#92400E">똑같다</text>
    <text x="316" y="126" font-size="10.5" font-weight="800" fill="#0B6E63">사라졌다</text>
    <text x="200" y="152" font-size="10.5" fill="#6B7280" text-anchor="middle">두 식의 꼬리가 «같아지도록» 자릿수를 맞추는 것이 열쇠</text>
    <text x="200" y="166" font-size="10.5" fill="#6B7280" text-anchor="middle">x = 24/99 = 8/33</text>
  </svg>`,
  sit:'순환소수를 고르고 <b>양변에 ×10</b> 을 눌러 자릿수를 옮기다가, 꼬리가 같아졌을 때 <b>두 식 빼기</b> 를 누릅니다. 몇 번 곱해야 하는지가 <b>마디 길이</b> 와 어떻게 얽히는지 직접 확인합니다.'
 },
 predict:{
  q:['0.242424… 의 꼬리를 없애려면 몇 번 ×10 을 해야 할지 예상하세요.',
     '마디가 세 자리라면 몇 번 곱해야 할까요?',
     '왜 꼭 «같은 꼬리»여야 빼서 지울 수 있을까요?'] },
 missions:[
  {t:'<b>×10</b> 을 눌러 자릿수를 옮겨 보세요. 꼬리가 언제 같아지나요?', re:'10'},
  {t:'꼬리가 같아졌을 때 <b>두 식 빼기</b> 를 눌러 분수를 복원하세요.', re:'성공'},
  {t:'아래 <b>탐구 노트</b>로 마무리하세요 — 마디를 <b>기록</b>하고, 곱한 횟수와 <b>견주고</b>, 규칙을 <b>판단</b>합니다.',
   re:'탐구 노트 통과',
   do:'① 마디와 마디 길이 적기 ② ×10 을 몇 번 해야 성공하는지 세기 ③ 다른 순환소수로 다시 확인',
   hand:'왜 «마디 길이만큼» 곱해야 하는지 «꼬리가 같아야 뺄 수 있다»로 설명하기'}],
 inquiry:{
  id:'rc72', title:'순환마디 복원 — 무한을 분수로',
  q:['네 가지 순환소수를 모두 복원하며 기록하세요.',
     '「마디 길이」와 「×10 횟수」를 견주세요. 무엇이 같나요?',
     '꼬리가 같아야 빼서 지울 수 있는 까닭을 손으로 설명하세요.'],
  cols:['순환소수','마디','마디 길이','×10 횟수','복원한 분수','성공?'],
  hint:'힌트 — 뺄셈으로 무한 꼬리를 지우려면 두 식의 꼬리가 같아야 합니다. 같아지는 조건이 곧 자릿수 정렬입니다.' },
 apply:{
  q:'새 문제 — <b>0.242424…</b> 를 기약분수로 고치면 8/33 입니다. 그 <b>분모</b>는?',
  a:33, tol:0.5,
  why:'100x − x = 24 이므로 99x = 24, x = 24/99. 3 으로 약분하면 8/33 이므로 분모는 33 입니다.',
  hint:'99x = 24 를 약분하세요.' },
 demo(root){ return recurDemo(root); }
};

LESSON[73]={
 title:'42번 접으면 달까지 — 지수법칙',
 problem:{
  q:'0.1 mm 짜리 종이를 <b>42번</b> 접으면 두께가 <b>달까지</b> 닿는다고 합니다. 말도 안 되는 소리 같지만 사실입니다. 왜 우리의 직감은 이렇게 크게 빗나갈까요?',
  svg:`<svg viewBox="0 0 400 170" role="img" aria-label="접은 횟수에 따른 두께가 달까지의 거리를 넘어서는 로그 눈금 그래프">
    __F73__
    <text x="200" y="18" font-size="10.5" fill="#6B7280" text-anchor="middle">«두 배씩»과 «한 장씩»은 전혀 다른 세계다</text>
  </svg>`,
  sit:'「반으로 접기」를 누를 때마다 <b>2ⁿ</b> 과 <b>두께</b> 가 계산되고, 같은 횟수만큼 <b>한 장씩 더했다면</b> 얼마였을지도 나란히 표시됩니다. 두 값의 배율이 얼마나 벌어지는지 직접 봅니다.'
 },
 predict:{
  q:['0.1 mm 종이를 10번 접으면 두께가 얼마일지 예상해 적으세요.',
     '30번 접으면 몇 m 쯤 될지 예상하세요.',
     '«두 배씩»과 «한 장씩»의 차이를 한 줄로 적어 보세요.'] },
 missions:[
  {t:'접기를 이어 눌러 <b>두께</b>가 어떻게 자라는지 보세요.', re:'접'},
  {t:'같은 횟수를 <b>한 장씩 더했다면</b> 얼마인지 견주어 보세요.', re:'더하기'},
  {t:'아래 <b>탐구 노트</b>로 마무리하세요 — 두께를 <b>기록</b>하고, 더하기와 <b>견주고</b>, 배율을 <b>판단</b>합니다.',
   re:'탐구 노트 통과',
   do:'① 10번 접었을 때의 2ⁿ 과 두께 적기 ② 20번까지 접어 다시 적기 ③ 두 2ⁿ 의 «비»를 구하기',
   hand:'aᵐ × aⁿ = aᵐ⁺ⁿ 을 «접기를 이어서 한다»로 설명하기'}],
 inquiry:{
  id:'fo73', title:'42번 접으면 달까지 — 지수법칙',
  q:['접은 횟수를 0 부터 늘려 가며 기록하세요.',
     '「2ⁿ」과 「더하기였다면」 열을 견주세요. 얼마나 벌어지나요?',
     'aᵐ × aⁿ = aᵐ⁺ⁿ 을 접기로 손으로 설명하세요.'],
  cols:['접은 횟수 n','2ⁿ','두께','더하기였다면','비교'],
  hint:'힌트 — 접기를 이어서 하는 것이 지수의 곱입니다. 지수끼리는 «더하기»가 되는 이유를 접기로 말해 보세요.' },
 apply:{
  q:'새 문제 — 0.1 mm 종이를 <b>30번</b> 접으면 두께는 약 몇 <b>km</b> 일까요? (소수 첫째 자리까지)',
  a:107.4, tol:0.6,
  why:'0.1 × 2³⁰ mm = 107,374,182.4 mm ≒ 107.4 km. 서른 번만으로 이미 성층권을 지납니다.',
  hint:'2³⁰ ≒ 10억. 0.1 mm 를 곱한 뒤 km 로 바꾸세요.' },
 demo(root){ return foldDemo(root); }
};

LESSON[74]={
 title:'−2 를 곱하는 순간 — 부등호의 반전',
 problem:{
  q:'<b>2 &lt; 5</b> 입니다. 양변에 <b>−2</b> 를 곱하면 −4 와 −10 — 이제 <b>−4 &gt; −10</b> 입니다. 부등호가 뒤집혔습니다. 왜 곱하기 하나에 <b>대소 관계 자체</b> 가 바뀔까요?',
  svg:`<svg viewBox="0 0 400 170" role="img" aria-label="수직선 위의 두 점에 −2 를 곱하면 좌우 순서가 맞바뀌는 그림">
    __P74__
  </svg>`,
  sit:'a·b 와 곱하는 수 <b>k</b> 를 직접 끌면, 곱하기 전후의 대소 관계가 <b>a &lt; b</b> · <b>ka &gt; kb</b> 같은 꼴로 나란히 표시됩니다. k 를 0 으로 만들면 무슨 일이 생기는지도 확인할 수 있습니다.'
 },
 predict:{
  q:['3 < 5 의 양변에 −1 을 곱하면 어떻게 될지 예상하세요.',
     '양수를 곱할 때는 왜 부등호가 그대로일까요?',
     'k = 0 을 곱하면 어떻게 될지 적어 보세요.'] },
 missions:[
  {t:'k 를 <b>양수</b>로 두고 곱해 보세요. 부등호가 그대로인가요?', re:'k'},
  {t:'k 를 <b>음수</b>로 바꿔 보세요. 무엇이 달라지나요?', re:'kb'},
  {t:'아래 <b>탐구 노트</b>로 마무리하세요 — 관계를 <b>기록</b>하고, 부호를 바꿔 <b>견주고</b>, 규칙을 <b>판단</b>합니다.',
   re:'탐구 노트 통과',
   do:'① k 가 양수일 때의 곱하기 전·후 관계 적기 ② k 를 음수로 바꿔 다시 적기 ③ 두 결과를 견주기',
   hand:'−1 배가 수직선에서 하는 일(<b>반사</b>)로 부등호가 뒤집히는 까닭을 설명하기'}],
 inquiry:{
  id:'fl74', title:'−2 를 곱하는 순간 — 부등호의 반전',
  q:['a·b·k 를 바꿔 가며 8줄 이상 기록하세요. k 가 양수인 경우와 음수인 경우를 모두 넣으세요.',
     '「곱하기 전」과 「곱한 뒤」 열을 견주세요. 언제 뒤집히나요?',
     '반사가 왜 대소를 뒤집는지 수직선으로 손으로 설명하세요.'],
  cols:['a','b','곱하기 전','k','ka','kb','곱한 뒤'],
  hint:'힌트 — 반사는 왼쪽·오른쪽을 통째로 맞바꿉니다. «더 오른쪽에 있다(크다)»는 관계 자체가 뒤집히는 것입니다.' },
 apply:{
  q:'새 문제 — <b>−3 &lt; 5</b> 의 양변에 <b>−2</b> 를 곱했을 때 <b>왼쪽 값</b>은?',
  a:6, tol:0.1,
  why:'(−3) × (−2) = 6, 5 × (−2) = −10. 이제 6 > −10 이므로 부등호가 뒤집힙니다.',
  hint:'−3 에 −2 를 곱하세요.' },
 demo(root){ return flipDemo(root); }
};

LESSON[75]={
 title:'만나거나 · 평행하거나 · 겹치거나',
 problem:{
  q:'연립방정식을 풀면 대개 해가 <b>하나</b> 나옵니다. 그런데 어떤 것은 <b>해가 없고</b>, 어떤 것은 <b>해가 무수히</b> 많습니다. 식만 봐서는 잘 모르겠는데, <b>그림으로 보면</b> 왜 그런지 한눈에 보입니다.',
  svg:`<svg viewBox="0 0 400 170" role="img" aria-label="두 직선이 한 점에서 만나거나 평행하거나 겹치는 세 가지 경우">
    __Y75__
    <text x="200" y="164" font-size="10.5" fill="#6B7280" text-anchor="middle">기울기와 절편 두 가지만 보면 어느 경우인지 정해진다</text>
  </svg>`,
  sit:'두 직선을 <b>직접 끌어</b> 움직이면 <b>기울기가 같은지</b> · <b>절편이 같은지</b> 와 함께 <b>해의 개수</b> 가 표시됩니다. 셋 중 어느 경우인지 식을 풀지 않고도 판정할 수 있습니다.'
 },
 predict:{
  q:['두 직선의 기울기가 같으면 해가 몇 개일지 예상하세요.',
     '기울기도 절편도 같으면 어떻게 될까요?',
     '«해가 있다»는 말을 그림의 말로 바꿔 한 줄로 적으세요.'] },
 missions:[
  {t:'두 직선을 움직여 <b>한 점에서 만나게</b> 해 보세요.', re:'1개'},
  {t:'기울기를 같게 만들어 <b>해가 없게</b> 해 보세요.', re:'없음'},
  {t:'아래 <b>탐구 노트</b>로 마무리하세요 — 두 직선을 <b>기록</b>하고, 세 경우를 <b>만들어 보고</b>, 판정 기준을 <b>판단</b>합니다.',
   re:'탐구 노트 통과',
   do:'① 한 점에서 만나는 상태 적기 ② 기울기를 같게 해 해가 없게 만들기 ③ 절편까지 같게 해 무수히 만들기',
   hand:'세 경우를 <b>기울기와 절편</b> 두 가지로 판정하는 표를 손으로 만들기'}],
 inquiry:{
  id:'sy75', title:'해가 하나 · 없음 · 무수히',
  q:['두 직선을 움직여 가며 8줄 이상 기록하세요. 세 경우를 모두 넣으세요.',
     '「기울기 같나」·「절편 같나」와 「해의 개수」를 견주세요.',
     '«해가 있다»가 그림에서 무엇을 뜻하는지 손으로 설명하세요.'],
  cols:['직선1','직선2','기울기 같나','절편 같나','해의 개수'],
  hint:'힌트 — «해가 있다»는 «두 조건을 동시에 만족하는 점이 있다»는 말입니다. 그림에서 그 점은 무엇인가요?' },
 apply:{
  q:'새 문제 — <b>y = 2x + 1</b> 과 <b>y = 2x − 3</b> 을 연립하면 해가 <b>몇 개</b> 일까요?',
  a:0, tol:0.1,
  why:'기울기가 둘 다 2 로 같은데 절편이 다르므로 두 직선은 평행합니다. 만나지 않으니 해는 0 개입니다.',
  hint:'기울기와 절편을 견주세요.' },
 demo(root){ return sysDemo(root); }
};

LESSON[76]={
 title:'문자를 하나씩 지운다 — 소거법',
 problem:{
  q:'연립방정식을 푸는 길은 <b>문자를 하나 지우는</b> 것입니다. 그런데 두 식을 그냥 빼면 아무것도 지워지지 않을 때가 많습니다. <b>무엇을 먼저 해야</b> 지워질까요?',
  svg:`<svg viewBox="0 0 400 170" role="img" aria-label="두 식의 계수를 맞춘 뒤 빼면 문자가 사라지는 과정">
    <text x="48" y="48" font-size="13" font-weight="800" fill="#111827">①</text>
    <text x="74" y="48" font-size="13" font-weight="800" fill="#1D4ED8">2x</text>
    <text x="106" y="48" font-size="13" font-weight="800" fill="#111827">+ 3y = 12</text>
    <text x="48" y="80" font-size="13" font-weight="800" fill="#111827">②</text>
    <text x="74" y="80" font-size="13" font-weight="800" fill="#1D4ED8">2x</text>
    <text x="106" y="80" font-size="13" font-weight="800" fill="#111827">−  y =  4</text>
    <rect x="66" y="32" width="34" height="58" rx="5" fill="#2563EB" opacity=".14" stroke="#2563EB" stroke-width="1.3" stroke-dasharray="4 3"/>
    <text x="232" y="64" font-size="10.5" font-weight="800" fill="#1D4ED8">x 의 계수가 이미 같다</text>
    <path d="M44 96 H210" stroke="#111827" stroke-width="1.6"/>
    <text x="48" y="122" font-size="13" font-weight="800" fill="#111827">①−②</text>
    <text x="106" y="122" font-size="13" font-weight="800" fill="#0B6E63">4y = 8</text>
    <text x="232" y="122" font-size="10.5" font-weight="800" fill="#0B6E63">x 가 사라졌다 → y = 2</text>
    <text x="200" y="152" font-size="10.5" fill="#6B7280" text-anchor="middle">계수가 다르면 «같아지도록» 먼저 곱해야 한다</text>
    <text x="200" y="166" font-size="10.5" fill="#6B7280" text-anchor="middle">가장 작은 수는 두 계수의 최소공배수</text>
  </svg>`,
  sit:'식에 <b>×2 · ×3</b> 을 곱하고 <b>더하거나 빼면서</b> 계수를 맞춥니다. <b>x 계수 정렬</b> · <b>y 계수 정렬</b> 이 표시되어, 무엇이 지워질 준비가 되었는지 바로 알 수 있습니다.'
 },
 predict:{
  q:['두 식을 그냥 뺐을 때 아무것도 지워지지 않는 까닭을 적으세요.',
     '계수를 같게 만들려면 무엇을 곱해야 할까요?',
     '가장 작은 수로 맞추려면 어떤 수를 찾아야 할까요?'] },
 missions:[
  {t:'식에 곱해서 <b>x 계수</b> 나 <b>y 계수</b> 를 «정렬» 로 만들어 보세요.', re:'정렬'},
  {t:'정렬된 상태에서 <b>더하거나 빼서</b> 문자를 지워 보세요.', re:'①'},
  {t:'아래 <b>탐구 노트</b>로 마무리하세요 — 식을 <b>기록</b>하고, 곱해서 <b>맞추고</b>, 지워지는 까닭을 <b>판단</b>합니다.',
   re:'탐구 노트 통과',
   do:'① 처음 두 식을 적기 ② 곱해서 한쪽 계수를 정렬시키기 ③ 더하거나 빼서 문자 하나를 지우기',
   hand:'두 계수를 같게 만드는 가장 작은 수가 <b>최소공배수</b> 인 까닭을 설명하기'}],
 inquiry:{
  id:'el76', title:'문자를 하나씩 지운다 — 소거법',
  q:['식에 곱하고 더하고 빼며 한 단계마다 기록하세요.',
     '「x 계수 정렬」·「y 계수 정렬」이 언제 «정렬» 이 되는지 찾으세요.',
     '두 계수를 같게 만드는 가장 작은 수가 왜 최소공배수인지 손으로 설명하세요.'],
  cols:['식①','식②','한 일','x 계수 정렬','y 계수 정렬'],
  hint:'힌트 — 두 계수를 같게 만드는 가장 작은 수는 두 계수의 최소공배수입니다.' },
 apply:{
  q:'새 문제 — <b>2x + 3y = 12</b> 에서 <b>2x − y = 4</b> 를 빼면 4y = 8 입니다. <b>y</b> 의 값은?',
  a:2, tol:0.1,
  why:'x 의 계수가 둘 다 2 라 그냥 빼도 x 가 사라집니다. 4y = 8 이므로 y = 2 입니다.',
  hint:'4y = 8 을 푸세요.' },
 demo(root){ return elimDemo(root); }
};

LESSON[77]={
 title:'회전과 평행이동 — 기울기와 절편',
 problem:{
  q:'<b>y = ax + b</b> 에서 a 와 b 는 각각 무슨 일을 할까요? 둘 다 직선을 움직이는데, <b>움직이는 방식이 전혀 다릅니다.</b> 하나는 돌리고, 하나는 밀어 올립니다.',
  svg:`<svg viewBox="0 0 400 170" role="img" aria-label="절편을 고정하고 기울기만 바꾼 직선과 기울기를 고정하고 절편만 바꾼 직선">
    __S77__
  </svg>`,
  sit:'a 와 b 를 따로따로 움직이며 직선이 어떻게 변하는지 봅니다. <b>잔상 남기기</b> 를 켜면 지나온 직선들이 남아, a 만 바꿨을 때와 b 만 바꿨을 때의 모양이 확실히 갈립니다.'
 },
 predict:{
  q:['a 만 키우면 직선이 어떻게 움직일지 예상하세요.',
     'b 만 키우면 직선이 어떻게 움직일지 예상하세요.',
     'a 를 바꿔도 변하지 않는 점이 있을까요?'] },
 missions:[
  {t:'<b>잔상 남기기</b> 를 켜고 a 만 바꿔 보세요. 어떤 모양이 남나요?', re:'a'},
  {t:'이번에는 b 만 바꿔 보세요. 모양이 어떻게 다른가요?', re:'b'},
  {t:'아래 <b>탐구 노트</b>로 마무리하세요 — 식을 <b>기록</b>하고, 하나씩만 바꿔 <b>견주고</b>, 두 역할을 <b>판단</b>합니다.',
   re:'탐구 노트 통과',
   do:'① 지금 a·b 적기 ② b 는 그대로 두고 a 만 바꾸기 ③ a 는 그대로 두고 b 만 바꾸기',
   hand:'절편이 «어디서 출발하나», 기울기가 «얼마나 가파르게 가나»임을 그림으로 설명하기'}],
 inquiry:{
  id:'sp77', title:'회전과 평행이동 — 기울기와 절편',
  q:['a 와 b 를 바꿔 가며 8줄 이상 기록하세요.',
     'a 만 바꿨을 때와 b 만 바꿨을 때 직선이 어떻게 다르게 움직이는지 적으세요.',
     '두 값이 서로 독립인 까닭을 손으로 설명하세요.'],
  cols:['a','b','식','무엇을 움직였나','직선의 변화'],
  hint:'힌트 — 절편은 «어디서 출발하나», 기울기는 «얼마나 가파르게 가나»입니다. 출발점과 방향은 서로 독립입니다.' },
 apply:{
  q:'새 문제 — <b>y = −3x + 5</b> 에서 x 가 <b>1 커지면</b> y 는 얼마나 변할까요?',
  a:-3, tol:0.1,
  why:'기울기가 −3 이므로 x 가 1 커질 때 y 는 3 작아집니다 — 변화량은 −3 입니다. 절편 5 는 여기에 아무 영향도 주지 않습니다.',
  hint:'기울기가 곧 «x 가 1 커질 때의 y 의 변화»입니다.' },
 demo(root){ return slopeDemo(root); }
};

LESSON[78]={
 title:'식을 읽고 직선을 놓아라',
 problem:{
  q:'<b>y = 2x − 1</b> 이라는 식을 보고 직선을 <b>바로 그릴 수 있나요?</b> 표를 만들어 점을 여러 개 찍는 대신, <b>두 점</b> 만 잘 고르면 됩니다. 어느 두 점이 가장 편할까요?',
  svg:`<svg viewBox="0 0 400 170" role="img" aria-label="절편 점과 그 옆 점 두 개만으로 직선을 정하는 그림">
    <path d="M40 92 H372 M200 18 V162" stroke="#9CA3AF" stroke-width="1.2"/>
    <path d="M110 158 L300 26" stroke="#2563EB" stroke-width="2.4"/>
    <circle cx="200" cy="106" r="5.4" fill="#BE123C"/>
    <text x="206" y="124" font-size="10.5" font-weight="800" fill="#BE123C">(0, b)</text>
    <circle cx="228" cy="86" r="5.4" fill="#0E9384"/>
    <text x="234" y="80" font-size="10.5" font-weight="800" fill="#0B6E63">(1, a+b)</text>
    <path d="M200 106 H228" stroke="#B45309" stroke-width="1.4"/>
    <path d="M228 106 V86" stroke="#B45309" stroke-width="1.4"/>
    <text x="214" y="120" font-size="9.5" font-weight="800" fill="#92400E" text-anchor="middle">1</text>
    <text x="240" y="100" font-size="9.5" font-weight="800" fill="#92400E">a</text>
    <text x="200" y="14" font-size="10.5" fill="#6B7280" text-anchor="middle">직선은 두 점이면 정해진다</text>
  </svg>`,
  sit:'화면이 <b>목표 식</b> 을 내면, 점 두 개를 직접 놓아 직선을 만듭니다. <b>정답인지</b> 바로 판정되므로, 식에서 그래프로 가는 길을 여러 번 왕복해 볼 수 있습니다.'
 },
 predict:{
  q:['y = 2x − 1 을 그리려면 어느 두 점을 고르는 것이 가장 편할지 적으세요.',
     'x = 0 을 넣으면 y 는 무엇이 될까요?',
     'x = 1 을 넣으면 y 는 무엇이 될까요?'] },
 missions:[
  {t:'점 두 개를 놓아 목표 식의 직선을 만들어 보세요.', re:'정답'},
  {t:'<b>새 문제</b> 를 눌러 다른 식으로 다시 해 보세요.', re:'목표'},
  {t:'아래 <b>탐구 노트</b>로 마무리하세요 — 두 점을 <b>기록</b>하고, 식과 <b>견주고</b>, 편한 두 점을 <b>판단</b>합니다.',
   re:'탐구 노트 통과',
   do:'① 목표 식과 내가 잡은 두 점 적기 ② 정답이 될 때까지 옮기기 ③ (0, b) 와 (1, a+b) 로 다시 해 보기',
   hand:'왜 (0, b) 와 (1, a+b) 가 가장 편한 두 점인지 설명하기'}],
 inquiry:{
  id:'lf78', title:'식 ↔ 그래프 왕복',
  q:['새 문제를 여러 번 받아 풀며 기록하세요.',
     '어느 두 점을 고를 때 가장 빨리 맞았는지 적으세요.',
     '(0, b) 와 (1, a+b) 가 편한 까닭을 손으로 설명하세요.'],
  cols:['목표 식','내가 잡은 두 점','내 직선','정답?'],
  hint:'힌트 — 직선은 두 점이면 정해집니다. 가장 편한 두 점은 절편 (0, b) 와 (1, a+b) 입니다.' },
 apply:{
  q:'새 문제 — 두 점 <b>(0, −1)</b> 과 <b>(1, 1)</b> 을 지나는 직선의 <b>기울기</b>는?',
  a:2, tol:0.1,
  why:'x 가 0 에서 1 로 1 커질 때 y 가 −1 에서 1 로 2 커졌으므로 기울기는 2 입니다. 식은 y = 2x − 1 입니다.',
  hint:'y 의 변화량 ÷ x 의 변화량.' },
 demo(root){ return lineFitDemo(root); }
};

LESSON[79]={
 title:'균형점을 찾아라 — 삼각형의 무게중심',
 problem:{
  q:'두꺼운 종이로 삼각형을 오려 손끝에 올리면, <b>딱 한 점</b> 에서만 균형이 잡힙니다. 그 점은 어디일까요? 눈대중이 아니라 <b>계산</b>으로 찾을 수 있습니다.',
  svg:`<svg viewBox="0 0 400 170" role="img" aria-label="삼각형의 세 중선이 한 점에서 만나고 그 점이 세 꼭짓점의 평균인 그림">
    __G79__
  </svg>`,
  sit:'무게중심이라고 생각하는 자리를 <b>직접 찍어</b> 보면, 실제 무게중심과 <b>얼마나 벗어났는지</b> px 로 표시됩니다. 「중선 그려 확인」을 누르면 세 중선이 한 점에서 만나는 것을 볼 수 있습니다.'
 },
 predict:{
  q:['삼각형의 균형점이 어디쯤일지 예상해 적으세요.',
     '세 꼭짓점의 좌표를 모두 더해 3 으로 나누면 무엇이 나올까요?',
     '중선이 왜 균형과 관계가 있을지 짐작해 보세요.'] },
 missions:[
  {t:'무게중심이라고 생각하는 자리를 찍어 <b>벗어난 거리</b> 를 보세요.', re:'벗어'},
  {t:'<b>명중</b> 할 때까지 옮겨 보세요.', re:'명중'},
  {t:'아래 <b>탐구 노트</b>로 마무리하세요 — 위치를 <b>기록</b>하고, 평균을 <b>계산</b>하고, 일치를 <b>판단</b>합니다.',
   re:'탐구 노트 통과',
   do:'① 내가 찍은 자리와 실제 무게중심 적기 ② 벗어난 거리를 줄여 명중시키기 ③ 세 꼭짓점의 평균과 같은지 확인',
   hand:'평균이 왜 균형을 만드는지 <b>시소</b> 로 설명하기'}],
 inquiry:{
  id:'cd79', title:'균형점을 찾아라 — 무게중심',
  q:['삼각형을 여러 모양으로 바꿔 가며 기록하세요.',
     '「실제 무게중심」과 세 꼭짓점의 평균을 견주세요.',
     '평균이 균형을 만드는 까닭을 손으로 설명하세요.'],
  cols:['추측 위치','실제 무게중심','벗어난 거리(px)','명중?'],
  hint:'힌트 — 무게중심은 세 꼭짓점의 «평균 위치»입니다. 평균이 균형을 만드는 이유를 시소로 생각해 보세요.' },
 apply:{
  q:'새 문제 — A(0, 0) · B(6, 0) · C(3, 9) 인 삼각형의 무게중심의 <b>y 좌표</b>는?',
  a:3, tol:0.1,
  why:'(0 + 0 + 9) ÷ 3 = 3. 무게중심의 좌표는 세 꼭짓점의 평균입니다.',
  hint:'세 y 좌표를 더해 3 으로 나누세요.' },
 demo(root){ return centroidDemo(root); }
};

LESSON[80]={
 title:'사다리꼴은 왜 탈락일까 — 평행사변형의 조건',
 problem:{
  q:'사다리꼴도 <b>두 변이 평행</b> 합니다. 그런데 평행사변형은 아닙니다. <b>무엇이 하나 모자란</b> 걸까요? 조건을 정확히 말할 수 있어야 «맞다·아니다»를 판정할 수 있습니다.',
  svg:`<svg viewBox="0 0 400 170" role="img" aria-label="평행사변형과 사다리꼴의 대각선 교점을 견주는 그림">
    __Q80__
  </svg>`,
  sit:'네 꼭짓점을 <b>직접 끌어</b> 보면 다섯 가지 조건(두 쌍의 평행 · 두 쌍의 길이 · 대각선 이등분)이 각각 <b>✓ 인지 ✗ 인지</b> 표시되고, 최종 판정도 함께 나옵니다. 「사다리꼴 함정 만들기」로 아슬아슬한 경우도 만들어 볼 수 있습니다.'
 },
 predict:{
  q:['한 쌍만 평행한 사각형이 평행사변형이 아닌 까닭을 적으세요.',
     '평행사변형이 되려면 최소한 무엇이 필요할지 예상하세요.',
     '대각선은 평행사변형에서 어떤 성질을 가질까요?'] },
 missions:[
  {t:'<b>평행사변형으로 맞추기</b> 를 눌러 다섯 조건이 모두 ✓ 가 되는 것을 보세요.', re:'맞다'},
  {t:'<b>사다리꼴 함정</b> 을 만들어 어느 조건이 ✗ 가 되는지 보세요.', re:'아니다'},
  {t:'아래 <b>탐구 노트</b>로 마무리하세요 — 조건을 <b>기록</b>하고, 함정과 <b>견주고</b>, 무엇이 모자란지 <b>판단</b>합니다.',
   re:'탐구 노트 통과',
   do:'① 평행사변형일 때 다섯 조건 적기 ② 사다리꼴로 바꿔 다시 적기 ③ 달라진 조건을 짚기',
   hand:'다섯 조건 중 어느 하나만 성립해도 나머지가 따라오는 까닭을 설명하기'}],
 inquiry:{
  id:'pg80', title:'사다리꼴은 왜 탈락일까',
  q:['꼭짓점을 옮겨 가며 8줄 이상 기록하세요. 평행사변형과 사다리꼴을 모두 넣으세요.',
     '다섯 조건 열을 견주어, 사다리꼴에서 무엇이 ✗ 가 되는지 찾으세요.',
     '어느 한 조건이 성립하면 나머지가 따라오는 까닭을 손으로 설명하세요.'],
  cols:['AB∥DC','AD∥BC','AB=DC','AD=BC','대각선 이등분','평행사변형?'],
  hint:'힌트 — 다섯 조건 중 어느 하나(한 쌍 평행 + 같음 포함)가 성립하면 나머지가 따라옵니다. 사다리꼴은 왜 안 되나요?' },
 apply:{
  q:'새 문제 — 평행사변형 ABCD 에서 <b>∠A = 68°</b> 일 때 <b>∠B</b> 는 몇 도일까요?',
  a:112, tol:0.5,
  why:'이웃한 두 각은 평행선의 동측내각이므로 합이 180° 입니다. 180 − 68 = 112°.',
  hint:'AD ∥ BC 이므로 ∠A + ∠B = 180°.' },
 demo(root){ return paragramDemo(root); }
};

"""


def note(no, head, c1, c2, c3):
    return "\n %d:{ h:'%s',\n  c:[\n%s,\n%s,\n%s\n ]},\n" % (no, head, c1, c2, c3)


NOTES = (
 note(71, '내가 나누고 · 내가 견주고 · 내가 판단한다',
 """  {t:'기록 — <b>유한소수</b>가 되는 분수를 골라 나눠 본 뒤 적으세요',
   f:'분모의 소인수 중 2 가 있으면 1, 없으면 0 → {0} · 5 가 있으면 1, 없으면 0 → {1}',
   chk(got, r, mem){
     if(!r) return {ok:false, msg:'아직 나누지 않았습니다. 「한 자리 더 나누기」를 눌러 보세요.'};
     if(String(r[2]).indexOf('유한')<0)
       return {ok:false, msg:'지금 «'+r[2]+'» 입니다. 유한소수가 되는 분수를 골라 보세요.'};
     const f=String(r[1]);
     if(![0,1].every(k=>isFinite(got[k]))) return {ok:false, msg:'두 칸을 모두 채우세요.'};
     const has2=f.indexOf('2')>=0?1:0, has5=f.indexOf('5')>=0?1:0;
     if(Math.abs(got[0]-has2)>0.01||Math.abs(got[1]-has5)>0.01)
       return {ok:false, msg:'화면의 「분모의 소인수」는 «'+f+'» 입니다.'};
     mem.fin=f;
     return {ok:true, msg:'기록했습니다 — 유한소수의 분모에는 «'+f+'» 뿐입니다.'};
   }}""",
 """  {t:'생각 — 이번에는 <b>순환소수</b>가 되는 분수를 골라 마디를 적으세요',
   f:'마디 길이 = {0} · 분모의 소인수에 2·5 말고 다른 수가 있으면 1 → {1}',
   chk(got, r, mem){
     if(mem.fin===undefined) return {ok:false, msg:'① 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     if(String(r[2]).indexOf('순환')<0)
       return {ok:false, msg:'지금 «'+r[2]+'» 입니다. 순환소수가 되는 분수를 골라 끝까지 나눠 보세요.'};
     const len=noteNum(r[4]);
     if(!isFinite(len)) return {ok:false, msg:'순환마디가 아직 보이지 않습니다. 몇 자리 더 나눠 보세요.'};
     if(![0,1].every(k=>isFinite(got[k]))) return {ok:false, msg:'두 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-len)>0.5) return {ok:false, msg:'마디 길이는 '+r[4]+' 입니다.'};
     if(Math.abs(got[1]-1)>0.01) return {ok:false, msg:'「분모의 소인수」가 «'+r[1]+'» 입니다. 2·5 말고 다른 수가 있나요?'};
     mem.rec=String(r[1]); mem.len=len;
     return {ok:true, msg:'계산했습니다 — 순환소수의 분모에는 «'+mem.rec+'» 가 들어 있습니다.'};
   }}""",
 """  {t:'판단 — 두 분수의 <b>분모의 소인수</b> 를 견주어 고르세요',
   f:'유한일 때 마디 길이(순환마디가 없으면 0) = {0} · 순환일 때 마디 길이 = {1}',
   opts:['분모의 소인수가 <b>2 와 5 뿐이면 유한소수</b>, 다른 소인수가 있으면 순환소수다',
         '분자가 1 이면 유한소수다',
         '분모가 크면 순환소수가 된다'],
   chk(got, r, mem, pick){
     if(mem.len===undefined) return {ok:false, msg:'② 칸을 먼저 통과하세요.'};
     if(![0,1].every(k=>isFinite(got[k]))) return {ok:false, msg:'두 칸을 모두 채우세요.'};
     if(Math.abs(got[0])>0.01) return {ok:false, msg:'유한소수에는 순환마디가 없습니다 — 0 을 적으세요.'};
     if(Math.abs(got[1]-mem.len)>0.5) return {ok:false, msg:'②에 적은 '+mem.len+' 을 넣으세요.'};
     if(pick!==0)
       return {ok:false, msg:'유한일 때는 «'+mem.fin+'», 순환일 때는 «'+mem.rec+'» 였습니다. 이 사실을 보고 다시 고르세요.'};
     return {ok:true, msg:'판단했습니다 — <b>10 = 2 × 5</b> 이므로 분모가 2 와 5 만으로 되어 있을 때만 10 의 거듭제곱으로 딱 나누어집니다. 컴퓨터는 밑이 <b>2</b> 뿐이라 분모에 5 가 있는 1/10 조차 순환이 되고, 그래서 0.1 + 0.2 ≠ 0.3 이 됩니다.'};
   }}""")
 +
 note(72, '내가 곱하고 · 내가 빼고 · 내가 판단한다',
 """  {t:'기록 — 순환소수를 하나 골라 마디를 적으세요',
   f:'마디 길이 = {0} · 지금까지 ×10 한 횟수 = {1}',
   chk(got, r, mem){
     if(!r) return {ok:false, msg:'아직 화면 값이 없습니다.'};
     const len=noteNum(r[2]), mul=noteNum(r[3]);
     if(![0,1].every(k=>isFinite(got[k]))) return {ok:false, msg:'두 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-len)>0.5) return {ok:false, msg:'마디 «'+r[1]+'» 는 '+r[2]+' 자리입니다.'};
     if(Math.abs(got[1]-mul)>0.5) return {ok:false, msg:'지금까지 ×10 을 '+r[3]+' 번 했습니다.'};
     mem.len=len; mem.mad=String(r[1]);
     return {ok:true, msg:'기록했습니다 — 마디 «'+mem.mad+'» 는 '+mem.len+' 자리입니다. 몇 번 곱해야 꼬리가 같아질까요?'};
   }}""",
 """  {t:'생각 — <b>×10</b> 을 눌러 꼬리를 맞춘 뒤 <b>두 식 빼기</b> 로 성공시키세요',
   f:'성공했을 때 ×10 횟수 = {0} · 마디 길이와의 차 = {1}',
   chk(got, r, mem){
     if(mem.len===undefined) return {ok:false, msg:'① 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     if(String(r[5]).indexOf('성공')<0)
       return {ok:false, msg:'아직 복원되지 않았습니다. ×10 으로 꼬리를 맞춘 뒤 「두 식 빼기」를 누르세요.'};
     const mul=noteNum(r[3]);
     if(![0,1].every(k=>isFinite(got[k]))) return {ok:false, msg:'두 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-mul)>0.5) return {ok:false, msg:'지금 ×10 횟수는 '+r[3]+' 입니다.'};
     if(Math.abs(got[1]-(mul-mem.len))>0.5) return {ok:false, msg:'①의 마디 길이를 빼세요.'};
     mem.frac=String(r[4]); mem.ok2=true;
     return {ok:true, msg:'계산했습니다 — 복원한 분수는 «'+mem.frac+'» 입니다.'};
   }}""",
 """  {t:'판단 — <b>다른 순환소수</b> 로 한 번 더 성공시킨 뒤 고르세요',
   f:'새 마디 길이 = {0} · 그때의 ×10 횟수 = {1}',
   opts:['<b>마디 길이만큼</b> ×10 해야 두 식의 꼬리가 같아진다 — 같아야 빼서 지울 수 있다',
         '늘 ×10 을 한 번만 하면 된다',
         '×10 을 많이 할수록 정확해진다'],
   chk(got, r, mem, pick){
     if(!mem.ok2) return {ok:false, msg:'② 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     if(String(r[1])===mem.mad) return {ok:false, msg:'같은 순환소수입니다 — 다른 것을 골라 보세요.'};
     if(String(r[5]).indexOf('성공')<0) return {ok:false, msg:'이 순환소수도 복원해 성공시키세요.'};
     const len=noteNum(r[2]), mul=noteNum(r[3]);
     if(![0,1].every(k=>isFinite(got[k]))) return {ok:false, msg:'두 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-len)>0.5||Math.abs(got[1]-mul)>0.5)
       return {ok:false, msg:'지금은 마디 길이 '+r[2]+' · ×10 횟수 '+r[3]+' 입니다.'};
     if(pick!==0)
       return {ok:false, msg:'두 번 모두 «마디 길이»와 «×10 횟수»가 맞물렸습니다. 이 사실을 보고 다시 고르세요.'};
     return {ok:true, msg:'판단했습니다 — <b>꼬리가 같아야 빼서 지울 수 있습니다.</b> 그래서 마디 길이만큼 자릿수를 옮기는 것이고, 마디가 n 자리면 10ⁿ − 1 (9, 99, 999…) 이 분모가 됩니다.'};
   }}""")
 +
 note(73, '내가 접고 · 내가 견주고 · 내가 판단한다',
 """  {t:'기록 — <b>10번</b> 접은 뒤 화면의 값을 적으세요',
   f:'접은 횟수 n = {0} · 2ⁿ = {1}',
   chk(got, r, mem){
     if(!r) return {ok:false, msg:'아직 화면 값이 없습니다.'};
     const n=noteNum(r[0]), p=noteNum(r[1]);
     if(Math.abs(n-10)>0.5) return {ok:false, msg:'지금 '+n+'번입니다. 10번까지 접어 보세요.'};
     if(![0,1].every(k=>isFinite(got[k]))) return {ok:false, msg:'두 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-n)>0.5) return {ok:false, msg:'접은 횟수는 '+n+' 입니다.'};
     if(Math.abs(got[1]-1024)>0.5) return {ok:false, msg:'화면의 2ⁿ 은 '+r[1]+' 입니다.'};
     mem.p10=1024;
     return {ok:true, msg:'기록했습니다 — 2¹⁰ = 1024 입니다. 열 번 더 접으면 어떻게 될까요?'};
   }}""",
 """  {t:'생각 — <b>20번</b> 까지 접은 뒤, 10번 때와의 <b>비</b>를 구하세요',
   f:'20번일 때 2ⁿ = {0} · 10번일 때의 2ⁿ 으로 나눈 값 = {1}',
   chk(got, r, mem){
     if(mem.p10===undefined) return {ok:false, msg:'① 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const n=noteNum(r[0]);
     if(Math.abs(n-20)>0.5) return {ok:false, msg:'지금 '+n+'번입니다. 20번까지 접어 보세요.'};
     if(![0,1].every(k=>isFinite(got[k]))) return {ok:false, msg:'두 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-1048576)>1) return {ok:false, msg:'화면의 2ⁿ 은 '+r[1]+' 입니다.'};
     if(Math.abs(got[1]-1024)>1) return {ok:false, msg:'2²⁰ 을 2¹⁰ 으로 나누세요.'};
     mem.ok2=true;
     return {ok:true, msg:'계산했습니다 — 몫이 또 <b>2¹⁰</b> 입니다. 2²⁰ = 2¹⁰ × 2¹⁰ 이기 때문입니다.'};
   }}""",
 """  {t:'판단 — <b>30번 이상</b> 접어 「더하기였다면」 과 견준 뒤 고르세요',
   f:'접은 횟수 = {0}',
   opts:['두 배씩 늘어나면 <b>지수</b>로 커진다 — 한 장씩 더하는 것과는 비교가 되지 않는다',
         '접을수록 두 방식의 차이는 줄어든다',
         '두 방식은 결국 비슷해진다'],
   chk(got, r, mem, pick){
     if(!mem.ok2) return {ok:false, msg:'② 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const n=noteNum(r[0]);
     if(n<30) return {ok:false, msg:'지금 '+n+'번입니다. 30번 넘게 접어 보세요.'};
     if(!isFinite(got[0])) return {ok:false, msg:'칸을 채우세요.'};
     if(Math.abs(got[0]-n)>0.5) return {ok:false, msg:'지금 '+n+'번입니다.'};
     if(pick!==0)
       return {ok:false, msg:'지금 두께는 «'+r[2]+'» 인데 한 장씩 더했다면 «'+r[3]+'» 입니다. 이 사실을 보고 다시 고르세요.'};
     return {ok:true, msg:'판단했습니다 — <b>접기를 이어서 하는 것이 지수의 곱</b> 입니다. 2ᵐ × 2ⁿ = 2ᵐ⁺ⁿ — 지수끼리는 더하기가 되고, 그래서 42번이면 달까지 닿습니다.'};
   }}""")
 +
 note(74, '내가 곱하고 · 내가 견주고 · 내가 판단한다',
 """  {t:'기록 — k 를 <b>양수</b>로 두고 곱한 뒤 적으세요',
   f:'a = {0} · b = {1} · k = {2}',
   chk(got, r, mem){
     if(!r) return {ok:false, msg:'아직 화면 값이 없습니다.'};
     const a=noteNum(r[0]), b=noteNum(r[1]), k=noteNum(r[3]);
     if(!(k>0)) return {ok:false, msg:'지금 k = '+k+' 입니다. k 를 양수로 맞추세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-a)>0.1||Math.abs(got[1]-b)>0.1)
       return {ok:false, msg:'화면은 a = '+r[0]+' · b = '+r[1]+' 입니다.'};
     if(Math.abs(got[2]-k)>0.1) return {ok:false, msg:'k 는 '+r[3]+' 입니다.'};
     mem.before=String(r[2]); mem.after=String(r[6]);
     return {ok:true, msg:'기록했습니다 — 곱하기 전 «'+mem.before+'», 곱한 뒤 «'+mem.after+'» — 그대로입니다.'};
   }}""",
 """  {t:'생각 — k 를 <b>음수</b>로 바꾼 뒤 ka 와 kb 를 적으세요',
   f:'k = {0} · ka = {1} · kb = {2}',
   chk(got, r, mem){
     if(mem.before===undefined) return {ok:false, msg:'① 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const k=noteNum(r[3]), ka=noteNum(r[4]), kb=noteNum(r[5]);
     if(!(k<0)) return {ok:false, msg:'지금 k = '+k+' 입니다. k 를 <b>음수</b>로 바꾸세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-k)>0.1) return {ok:false, msg:'k 는 '+r[3]+' 입니다.'};
     if(Math.abs(got[1]-ka)>0.15||Math.abs(got[2]-kb)>0.15)
       return {ok:false, msg:'화면은 ka = '+r[4]+' · kb = '+r[5]+' 입니다.'};
     mem.after2=String(r[6]);
     return {ok:true, msg:'계산했습니다 — 곱한 뒤가 «'+mem.after2+'» 로 바뀌었습니다.'};
   }}""",
 """  {t:'판단 — 곱하기 전과 후의 관계를 견주어 고르세요',
   f:'k 가 양수일 때 관계가 그대로면 1 → {0} · k 가 음수일 때 뒤집혔으면 1 → {1}',
   opts:['<b>음수</b>를 곱하면 수직선이 통째로 <b>반사</b>되어 «왼쪽·오른쪽»이 맞바뀐다 — 그래서 부등호가 뒤집힌다',
         '음수를 곱해도 부등호는 그대로다',
         '곱하는 수가 클수록 부등호가 뒤집힌다'],
   chk(got, r, mem, pick){
     if(mem.after2===undefined) return {ok:false, msg:'② 칸을 먼저 통과하세요.'};
     if(![0,1].every(k=>isFinite(got[k]))) return {ok:false, msg:'두 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-1)>0.01)
       return {ok:false, msg:'①에서 곱하기 전 «'+mem.before+'», 곱한 뒤 «'+mem.after+'» 였습니다. 그대로였나요?'};
     if(Math.abs(got[1]-1)>0.01)
       return {ok:false, msg:'②에서 곱한 뒤가 «'+mem.after2+'» 가 되었습니다. 뒤집혔나요?'};
     if(pick!==0)
       return {ok:false, msg:'양수일 때는 «'+mem.after+'», 음수일 때는 «'+mem.after2+'» 입니다. 이 사실을 보고 다시 고르세요.'};
     return {ok:true, msg:'판단했습니다 — <b>−1 배는 수직선의 반사</b> 입니다. «더 오른쪽에 있다(크다)»는 관계 자체가 통째로 맞바뀌므로 부등호를 뒤집어야 합니다. k = 0 이면 순서 자체가 사라지므로 곱할 수 없습니다.'};
   }}""")
 +
 note(75, '내가 움직이고 · 내가 세고 · 내가 판단한다',
 """  {t:'기록 — 두 직선이 <b>한 점에서 만나게</b> 한 뒤 적으세요',
   f:'기울기가 같으면 1, 다르면 0 → {0} · 해의 개수 = {1}',
   chk(got, r, mem){
     if(!r) return {ok:false, msg:'아직 화면 값이 없습니다.'};
     if(String(r[4]).indexOf('1개')<0)
       return {ok:false, msg:'지금 해가 «'+r[4]+'» 입니다. 두 직선이 한 점에서 만나게 하세요.'};
     if(![0,1].every(k=>isFinite(got[k]))) return {ok:false, msg:'두 칸을 모두 채우세요.'};
     if(Math.abs(got[0])>0.01) return {ok:false, msg:'화면의 「기울기 같나」는 «'+r[2]+'» 입니다.'};
     if(Math.abs(got[1]-1)>0.01) return {ok:false, msg:'해의 개수는 «'+r[4]+'» 입니다.'};
     mem.ok1=true;
     return {ok:true, msg:'기록했습니다 — 기울기가 다르면 반드시 한 점에서 만납니다.'};
   }}""",
 """  {t:'생각 — 기울기를 <b>같게</b> 만들어 <b>해가 없게</b> 한 뒤 적으세요',
   f:'기울기가 같으면 1 → {0} · 절편이 같으면 1, 다르면 0 → {1}',
   chk(got, r, mem){
     if(!mem.ok1) return {ok:false, msg:'① 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     if(String(r[4]).indexOf('없음')<0)
       return {ok:false, msg:'지금 해가 «'+r[4]+'» 입니다. 기울기는 같게, 절편은 다르게 만드세요.'};
     if(![0,1].every(k=>isFinite(got[k]))) return {ok:false, msg:'두 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-1)>0.01) return {ok:false, msg:'「기울기 같나」는 «'+r[2]+'» 입니다.'};
     if(Math.abs(got[1])>0.01) return {ok:false, msg:'「절편 같나」는 «'+r[3]+'» 입니다.'};
     mem.ok2=true;
     return {ok:true, msg:'계산했습니다 — 기울기는 같은데 절편이 다르면 <b>평행</b> — 만나지 않습니다.'};
   }}""",
 """  {t:'판단 — 절편까지 같게 만들어 <b>해가 무수히</b> 되게 한 뒤 고르세요',
   f:'기울기가 같으면 1 → {0} · 절편이 같으면 1 → {1}',
   opts:['기울기가 다르면 <b>1개</b>, 기울기만 같으면 <b>없음</b>, 기울기와 절편이 모두 같으면 <b>무수히</b> 많다',
         '식이 두 개이므로 해는 늘 하나다',
         '절편이 같으면 늘 해가 하나다'],
   chk(got, r, mem, pick){
     if(!mem.ok2) return {ok:false, msg:'② 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     if(String(r[4]).indexOf('무수히')<0)
       return {ok:false, msg:'지금 해가 «'+r[4]+'» 입니다. 두 직선을 완전히 겹치게 하세요.'};
     if(![0,1].every(k=>isFinite(got[k]))) return {ok:false, msg:'두 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-1)>0.01||Math.abs(got[1]-1)>0.01)
       return {ok:false, msg:'「기울기 같나」는 «'+r[2]+'», 「절편 같나」는 «'+r[3]+'» 입니다.'};
     if(pick!==0)
       return {ok:false, msg:'세 경우를 모두 만들어 보았습니다. 기울기와 절편 두 가지로 정해집니다. 다시 고르세요.'};
     return {ok:true, msg:'판단했습니다 — <b>«해가 있다»는 «두 조건을 동시에 만족하는 점이 있다»</b> 는 말입니다. 그림에서 그 점이 곧 교점이고, 교점의 개수가 해의 개수입니다.'};
   }}""")
 +
 note(76, '내가 곱하고 · 내가 지우고 · 내가 판단한다',
 """  {t:'기록 — 지금 두 식의 <b>x 계수</b> 를 적으세요',
   f:'식① 의 x 계수 = {0} · 식② 의 x 계수 = {1}',
   chk(got, r, mem){
     if(!r) return {ok:false, msg:'아직 화면 값이 없습니다.'};
     const a=noteNum(r[0]), b=noteNum(r[1]);
     if(![0,1].every(k=>isFinite(got[k]))) return {ok:false, msg:'두 칸을 모두 채우세요.'};
     if(Math.abs(Math.abs(got[0])-Math.abs(a))>0.1||Math.abs(Math.abs(got[1])-Math.abs(b))>0.1)
       return {ok:false, msg:'화면의 두 식은 «'+r[0]+'» 와 «'+r[1]+'» 입니다.'};
     mem.e1=String(r[0]); mem.e2=String(r[1]);
     return {ok:true, msg:'기록했습니다 — 이제 어느 한쪽 계수를 <b>정렬</b> 시켜 봅시다.'};
   }}""",
 """  {t:'생각 — 식에 곱해 <b>x 나 y 의 계수를 정렬</b> 시킨 뒤 적으세요',
   f:'x 가 정렬되었으면 1, 아니면 0 → {0} · y 가 정렬되었으면 1, 아니면 0 → {1}',
   chk(got, r, mem){
     if(mem.e1===undefined) return {ok:false, msg:'① 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const xs=String(r[3]).indexOf('정렬')>=0?1:0, ys=String(r[4]).indexOf('정렬')>=0?1:0;
     if(!xs&&!ys) return {ok:false, msg:'아직 어느 쪽도 정렬되지 않았습니다. ×2 나 ×3 을 눌러 계수를 맞추세요.'};
     if(![0,1].every(k=>isFinite(got[k]))) return {ok:false, msg:'두 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-xs)>0.01||Math.abs(got[1]-ys)>0.01)
       return {ok:false, msg:'화면은 x «'+r[3]+'» · y «'+r[4]+'» 입니다.'};
     mem.xs=xs; mem.ys=ys;
     return {ok:true, msg:'계산했습니다 — 정렬되었습니다. 이제 더하거나 빼면 그 문자가 사라집니다.'};
   }}""",
 """  {t:'판단 — <b>더하거나 빼서</b> 문자 하나를 지운 뒤 고르세요',
   f:'지운 뒤 남은 식① 의 x 계수 = {0}',
   opts:['계수를 <b>같게 맞춘 뒤</b> 더하거나 빼야 문자가 사라진다 — 가장 작은 수는 두 계수의 <b>최소공배수</b> 다',
         '두 식을 그냥 빼면 언제나 문자가 하나 사라진다',
         '큰 수를 곱할수록 잘 지워진다'],
   chk(got, r, mem, pick){
     if(mem.xs===undefined) return {ok:false, msg:'② 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const act=String(r[2]);
     if(act.indexOf('+')<0&&act.indexOf('−')<0&&act.indexOf('-')<0)
       return {ok:false, msg:'아직 «'+act+'» 입니다. 「① − ②」 나 「① + ②」 를 눌러 지워 보세요.'};
     const a=noteNum(r[0]);
     if(!isFinite(got[0])) return {ok:false, msg:'칸을 채우세요.'};
     if(Math.abs(Math.abs(got[0])-Math.abs(a))>0.1) return {ok:false, msg:'지금 식① 은 «'+r[0]+'» 입니다.'};
     if(pick!==0)
       return {ok:false, msg:'계수를 맞추기 전에는 지워지지 않았습니다. 이 사실을 보고 다시 고르세요.'};
     return {ok:true, msg:'판단했습니다 — <b>소거법은 «두 식의 계수를 같게 만든 뒤 빼서 지운다»</b> 입니다. 두 계수를 같게 만드는 가장 작은 수가 최소공배수이므로, 거기에 맞춰 곱하면 계산이 가장 간단해집니다.'};
   }}""")
 +
 note(77, '내가 움직이고 · 내가 견주고 · 내가 판단한다',
 """  {t:'기록 — 지금의 a 와 b 를 적으세요',
   f:'a = {0} · b = {1}',
   chk(got, r, mem){
     if(!r) return {ok:false, msg:'아직 화면 값이 없습니다.'};
     const a=noteNum(r[0]), b=noteNum(r[1]);
     if(![0,1].every(k=>isFinite(got[k]))) return {ok:false, msg:'두 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-a)>0.12||Math.abs(got[1]-b)>0.12)
       return {ok:false, msg:'화면은 a = '+r[0]+' · b = '+r[1]+' 입니다.'};
     mem.a=a; mem.b=b;
     return {ok:true, msg:'기록했습니다 — 이제 <b>b 는 그대로 두고 a 만</b> 바꿔 봅시다.'};
   }}""",
 """  {t:'생각 — <b>b 는 그대로</b> 두고 <b>a 만</b> 바꾼 뒤 적으세요',
   f:'새 a = {0} · b = {1} · a 의 변화량 = {2}',
   chk(got, r, mem){
     if(mem.a===undefined) return {ok:false, msg:'① 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const a=noteNum(r[0]), b=noteNum(r[1]);
     if(Math.abs(b-mem.b)>0.12) return {ok:false, msg:'b 가 '+r[1]+' 로 달라졌습니다. b 는 '+mem.b+' 로 두고 a 만 바꾸세요.'};
     if(Math.abs(a-mem.a)<0.3) return {ok:false, msg:'a 가 거의 그대로입니다 — 더 바꿔 보세요.'};
     if(![0,1,2].every(k=>isFinite(got[k]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-a)>0.12||Math.abs(got[1]-b)>0.12)
       return {ok:false, msg:'지금은 a = '+r[0]+' · b = '+r[1]+' 입니다.'};
     if(Math.abs(got[2]-(a-mem.a))>0.15) return {ok:false, msg:'지금 a 에서 ①의 a 를 빼세요.'};
     mem.a2=a; mem.ok2=true;
     return {ok:true, msg:'계산했습니다 — 절편은 그대로인데 직선이 <b>돌아갔습니다.</b> 이번에는 반대로 해 봅시다.'};
   }}""",
 """  {t:'판단 — 이번에는 <b>a 는 그대로</b> 두고 <b>b 만</b> 바꾼 뒤 고르세요',
   f:'a = {0} · 새 b = {1} · b 의 변화량 = {2}',
   opts:['<b>a 는 회전(얼마나 가파른가), b 는 평행이동(어디서 출발하나)</b> — 둘은 서로 상관이 없다',
         'a 를 바꾸면 절편도 함께 움직인다',
         'b 를 바꾸면 기울기도 함께 바뀐다'],
   chk(got, r, mem, pick){
     if(!mem.ok2) return {ok:false, msg:'② 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const a=noteNum(r[0]), b=noteNum(r[1]);
     if(Math.abs(a-mem.a2)>0.12) return {ok:false, msg:'a 가 '+r[0]+' 로 달라졌습니다. a 는 '+mem.a2+' 로 두고 b 만 바꾸세요.'};
     if(Math.abs(b-mem.b)<0.3) return {ok:false, msg:'b 가 거의 그대로입니다 — 바꿔 보세요.'};
     if(![0,1,2].every(k=>isFinite(got[k]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-a)>0.12||Math.abs(got[1]-b)>0.12)
       return {ok:false, msg:'지금은 a = '+r[0]+' · b = '+r[1]+' 입니다.'};
     if(Math.abs(got[2]-(b-mem.b))>0.15) return {ok:false, msg:'지금 b 에서 ①의 b 를 빼세요.'};
     if(pick!==0)
       return {ok:false, msg:'a 만 바꿨을 때와 b 만 바꿨을 때 직선이 어떻게 달리 움직였는지 잔상으로 보세요. 그리고 다시 고르세요.'};
     return {ok:true, msg:'판단했습니다 — <b>기울기는 «얼마나 가파르게 가나», 절편은 «어디서 출발하나»</b> 입니다. 출발점과 방향은 서로 독립이므로, 한쪽을 바꿔도 다른 쪽은 그대로입니다.'};
   }}""")
 +
 note(78, '내가 놓고 · 내가 맞히고 · 내가 판단한다',
 """  {t:'기록 — 점 두 개를 놓아 <b>정답</b> 을 맞힌 뒤 적으세요',
   f:'맞혔으면 1, 아직이면 0 → {0}',
   chk(got, r, mem){
     if(!r) return {ok:false, msg:'아직 화면 값이 없습니다.'};
     if(String(r[3]).indexOf('정답')<0)
       return {ok:false, msg:'아직 «'+r[3]+'» 입니다. 점을 옮겨 목표 식의 직선을 만드세요.'};
     if(!isFinite(got[0])) return {ok:false, msg:'칸을 채우세요.'};
     if(Math.abs(got[0]-1)>0.01) return {ok:false, msg:'화면에 «'+r[3]+'» 이라고 나와 있습니다.'};
     mem.q1=String(r[0]); mem.l1=String(r[2]);
     return {ok:true, msg:'기록했습니다 — 내 직선은 «'+mem.l1+'» 입니다.'};
   }}""",
 """  {t:'생각 — <b>새 문제</b> 를 받아 한 번 더 맞힌 뒤, 그때 잡은 두 점을 적으세요',
   f:'첫째 점의 x = {0} · 둘째 점의 x = {1}',
   chk(got, r, mem){
     if(mem.q1===undefined) return {ok:false, msg:'① 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     if(String(r[0])===mem.q1) return {ok:false, msg:'같은 문제입니다 — 「새 문제」를 누르세요.'};
     if(String(r[3]).indexOf('정답')<0) return {ok:false, msg:'이 문제도 맞혀 보세요. 지금은 «'+r[3]+'» 입니다.'};
     if(![0,1].every(k=>isFinite(got[k]))) return {ok:false, msg:'두 칸을 모두 채우세요.'};
     const p=String(r[1]).match(/-?\\d+/g)||[];
     if(p.length<4) return {ok:false, msg:'화면의 두 점은 «'+r[1]+'» 입니다.'};
     if(Math.abs(got[0]-(+p[0]))>0.1||Math.abs(got[1]-(+p[2]))>0.1)
       return {ok:false, msg:'화면의 두 점은 «'+r[1]+'» — 각각의 x 를 적으세요.'};
     mem.ok2=true;
     return {ok:true, msg:'계산했습니다 — 이번에는 x = 0 과 x = 1 로 잡아 봅시다.'};
   }}""",
 """  {t:'판단 — 이번에는 <b>x = 0 과 x = 1</b> 인 두 점으로 맞힌 뒤 고르세요',
   f:'x = 0 일 때의 y = {0} · x = 1 일 때의 y = {1} · 둘의 차 = {2}',
   opts:['x = 0 일 때가 <b>절편 b</b>, x = 1 일 때가 <b>a + b</b> — 그래서 둘의 차가 곧 <b>기울기 a</b> 다',
         '두 점은 멀수록 정확하다',
         '점은 세 개 이상 찍어야 직선이 정해진다'],
   chk(got, r, mem, pick){
     if(!mem.ok2) return {ok:false, msg:'② 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     if(String(r[3]).indexOf('정답')<0) return {ok:false, msg:'먼저 정답을 맞히세요. 지금은 «'+r[3]+'» 입니다.'};
     const p=(String(r[1]).match(/-?\\d+/g)||[]).map(Number);
     if(p.length<4) return {ok:false, msg:'두 점이 보이지 않습니다.'};
     const has0=p[0]===0||p[2]===0, has1=p[0]===1||p[2]===1;
     if(!has0||!has1)
       return {ok:false, msg:'지금 두 점은 «'+r[1]+'» 입니다. x = 0 과 x = 1 인 두 점으로 잡아 보세요.'};
     const y0=p[0]===0?p[1]:p[3], y1=p[0]===1?p[1]:p[3];
     if(![0,1,2].every(k=>isFinite(got[k]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-y0)>0.1||Math.abs(got[1]-y1)>0.1)
       return {ok:false, msg:'화면의 두 점은 «'+r[1]+'» 입니다.'};
     if(Math.abs(got[2]-(y1-y0))>0.1) return {ok:false, msg:'x = 1 일 때의 y 에서 x = 0 일 때의 y 를 빼세요.'};
     if(pick!==0)
       return {ok:false, msg:'둘의 차가 '+(y1-y0)+' 입니다. 내 직선 «'+r[2]+'» 의 기울기와 견주어 보고 다시 고르세요.'};
     return {ok:true, msg:'판단했습니다 — <b>직선은 두 점이면 정해집니다.</b> 가장 편한 두 점은 (0, b) 와 (1, a+b) — 식에서 값을 그대로 읽어 찍을 수 있기 때문입니다.'};
   }}""")
 +
 note(79, '내가 찍고 · 내가 계산하고 · 내가 판단한다',
 """  {t:'기록 — 균형점이라고 생각하는 자리를 찍고 화면의 값을 적으세요',
   f:'벗어난 거리 = {0} px',
   chk(got, r, mem){
     if(!r) return {ok:false, msg:'아직 화면 값이 없습니다.'};
     const d=noteNum(r[2]);
     if(!isFinite(got[0])) return {ok:false, msg:'칸을 채우세요.'};
     if(Math.abs(got[0]-d)>1) return {ok:false, msg:'화면에는 '+r[2]+' px 로 나와 있습니다.'};
     mem.d=d;
     return {ok:true, msg:'기록했습니다 — 이제 실제 무게중심을 계산해 봅시다.'};
   }}""",
 """  {t:'생각 — 화면의 <b>실제 무게중심</b> 좌표를 그대로 적으세요',
   f:'x = {0} · y = {1}',
   chk(got, r, mem){
     if(mem.d===undefined) return {ok:false, msg:'① 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const g=(String(r[1]).match(/-?\\d+/g)||[]).map(Number);
     if(g.length<2) return {ok:false, msg:'실제 무게중심이 보이지 않습니다.'};
     if(![0,1].every(k=>isFinite(got[k]))) return {ok:false, msg:'두 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-g[0])>1.5||Math.abs(got[1]-g[1])>1.5)
       return {ok:false, msg:'화면의 실제 무게중심은 «'+r[1]+'» 입니다.'};
     mem.gx=g[0]; mem.gy=g[1];
     return {ok:true, msg:'계산했습니다 — 이 점을 «명중» 시켜 봅시다.'};
   }}""",
 """  {t:'판단 — <b>명중</b> 시킨 뒤 고르세요',
   f:'그때 벗어난 거리 = {0} px · ①의 거리에서 줄어든 만큼 = {1}',
   opts:['무게중심은 세 꼭짓점의 <b>평균 위치</b> 다 — 그래서 세 중선이 한 점에서 만난다',
         '무게중심은 가장 긴 변의 한가운데다',
         '무게중심은 삼각형의 안쪽이면 어디든 상관없다'],
   chk(got, r, mem, pick){
     if(mem.gx===undefined) return {ok:false, msg:'② 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     if(String(r[3]).indexOf('명중')<0)
       return {ok:false, msg:'아직 '+r[2]+' px 벗어나 있습니다. 실제 무게중심에 더 가까이 찍으세요.'};
     const d=noteNum(r[2]);
     if(![0,1].every(k=>isFinite(got[k]))) return {ok:false, msg:'두 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-d)>1) return {ok:false, msg:'지금 벗어난 거리는 '+r[2]+' px 입니다.'};
     if(Math.abs(got[1]-(mem.d-d))>1.5) return {ok:false, msg:'①의 거리에서 지금 거리를 빼세요.'};
     if(pick!==0)
       return {ok:false, msg:'「중선 그려 확인」을 눌러 세 중선이 어디서 만나는지 보세요. 그리고 다시 고르세요.'};
     return {ok:true, msg:'판단했습니다 — <b>무게중심의 좌표는 세 꼭짓점의 평균</b> 입니다. 시소에서 두 사람의 균형점이 두 자리의 «가운데»인 것과 같은 이치입니다.'};
   }}""")
 +
 note(80, '내가 맞추고 · 내가 견주고 · 내가 판단한다',
 """  {t:'기록 — <b>평행사변형</b> 으로 맞춘 뒤 조건을 적으세요',
   f:'AB∥DC 가 ✓ 면 1 → {0} · 대각선 이등분이 ✓ 면 1 → {1}',
   chk(got, r, mem){
     if(!r) return {ok:false, msg:'아직 화면 값이 없습니다.'};
     if(String(r[5]).indexOf('맞다')<0)
       return {ok:false, msg:'지금 «'+r[5]+'» 입니다. 「평행사변형으로 맞추기」를 눌러 보세요.'};
     if(![0,1].every(k=>isFinite(got[k]))) return {ok:false, msg:'두 칸을 모두 채우세요.'};
     const p1=String(r[0]).indexOf('✓')>=0?1:0, dg=String(r[4]).indexOf('✓')>=0?1:0;
     if(Math.abs(got[0]-p1)>0.01||Math.abs(got[1]-dg)>0.01)
       return {ok:false, msg:'화면은 AB∥DC «'+r[0]+'» · 대각선 이등분 «'+r[4]+'» 입니다.'};
     mem.ok1=true;
     return {ok:true, msg:'기록했습니다 — 다섯 조건이 모두 성립합니다. 이제 사다리꼴로 만들어 봅시다.'};
   }}""",
 """  {t:'생각 — <b>사다리꼴 함정</b> 을 만든 뒤 무엇이 ✗ 가 되었는지 적으세요',
   f:'AB∥DC 가 ✓ 면 1 → {0} · AD∥BC 가 ✓ 면 1 → {1} · 대각선 이등분이 ✓ 면 1 → {2}',
   chk(got, r, mem){
     if(!mem.ok1) return {ok:false, msg:'① 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     if(String(r[5]).indexOf('아니')<0)
       return {ok:false, msg:'아직 «'+r[5]+'» 입니다. 「사다리꼴 함정 만들기」를 눌러 보세요.'};
     if(![0,1,2].every(k=>isFinite(got[k]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     const v=[0,1,4].map(i=>String(r[i]).indexOf('✓')>=0?1:0);
     if([0,1,2].some(k=>Math.abs(got[k]-v[k])>0.01))
       return {ok:false, msg:'화면은 «'+r[0]+'» · «'+r[1]+'» · «'+r[4]+'» 입니다.'};
     mem.ok2=true;
     return {ok:true, msg:'계산했습니다 — 한 쌍은 평행한데 나머지가 따라오지 않았습니다.'};
   }}""",
 """  {t:'판단 — 다시 <b>평행사변형</b> 으로 되돌린 뒤 고르세요',
   f:'평행사변형이면 1 → {0} · 이때 ✓ 인 조건의 개수(다섯 중) = {1}',
   opts:['<b>한 쌍만 평행해서는 모자란다</b> — 두 쌍이 평행하거나, 한 쌍이 «평행하고 길이도 같아야» 나머지가 따라온다',
         '한 쌍만 평행해도 평행사변형이다',
         '네 변의 길이가 모두 같아야 평행사변형이다'],
   chk(got, r, mem, pick){
     if(!mem.ok2) return {ok:false, msg:'② 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     if(String(r[5]).indexOf('맞다')<0)
       return {ok:false, msg:'지금 «'+r[5]+'» 입니다. 다시 평행사변형으로 맞추세요.'};
     const n=[0,1,2,3,4].filter(i=>String(r[i]).indexOf('✓')>=0).length;
     if(![0,1].every(k=>isFinite(got[k]))) return {ok:false, msg:'두 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-1)>0.01) return {ok:false, msg:'화면에 «'+r[5]+'» 라고 나와 있습니다.'};
     if(Math.abs(got[1]-n)>0.5) return {ok:false, msg:'화면에서 ✓ 인 칸을 세어 보세요.'};
     if(pick!==0)
       return {ok:false, msg:'사다리꼴일 때는 한 쌍만 평행했고 대각선은 서로를 이등분하지 않았습니다. 지금은 ✓ 가 '+n+'개입니다. 이 사실을 보고 다시 고르세요.'};
     return {ok:true, msg:'판단했습니다 — <b>다섯 조건 중 어느 하나(두 쌍 평행 · 두 쌍 같음 · 한 쌍이 평행하고 같음 · 대각선 이등분)가 성립하면 나머지가 따라옵니다.</b> 사다리꼴은 한 쌍만 평행해서 그 연쇄가 시작되지 않습니다.'};
   }}""")
)


def main(path):
    h = open(path, encoding='utf-8').read()
    if 'LESSON[71]=' in h:
        sys.stdout.write('already applied\n')
        return
    L = (LESSONS.replace('__L71__', L71).replace('__F73__', F73)
         .replace('__P74__', P74).replace('__Y75__', Y75)
         .replace('__S77__', S77).replace('__G79__', G79).replace('__Q80__', Q80))
    a = 'LESSON[356]={'
    assert h.count(a) == 1
    h = h.replace(a, L + a, 1)
    b = '\n};\n\nfunction labNo(spec)'
    assert h.count(b) == 1
    h = h.replace(b, NOTES + b, 1)
    open(path, 'w', encoding='utf-8').write(h)
    sys.stdout.write('LAB 71~80 ok %.2f MB\n' % (len(h.encode('utf-8')) / 1048576))


if __name__ == '__main__':
    main(sys.argv[1])
