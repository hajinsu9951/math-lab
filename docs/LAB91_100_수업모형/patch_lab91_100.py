# -*- coding: utf-8 -*-
"""LAB 91~100 — 7단계 수업 모형 + 탐구 노트.

교차 검증에서 나온 것을 처음부터 지키고 만든다.
  · 문제 문장이 답을 미리 말하지 않는다
  · 화면이 내주는 값이 학생의 조작에 따라 실제로 바뀐다 (안 바뀌면 기록표가 안 쌓인다)
  · ① 은 ③ 에서 더 갈 자리가 남는 상태에서 적게 한다
  · 적용 문제는 화면 숫자를 그대로 쓰지 않는 새 수로 낸다
  · 그림의 수는 전부 계산해서 넣고, 핵심 성질은 assert 로 검산한다

사용: python docs/LAB91_100_수업모형/patch_lab91_100.py src/40-demos.js
"""
import sys, math

try:
    sys.stdout.reconfigure(encoding='utf-8')
except Exception:
    pass

HALO = ' paint-order="stroke" stroke="#fff" stroke-width="3.2" stroke-linejoin="round"'


# ── LAB 91 · 겹친 자리를 두 번 세는 그림 ─────────────────────────────
def venn91():
    cx1, cx2, cy, r1, r2 = 168.0, 238.0, 92.0, 56.0, 48.0
    d = cx2 - cx1
    # 두 원의 겹친 넓이 — 두 번 세어진 부분
    a1 = r1 * r1 * math.acos((d * d + r1 * r1 - r2 * r2) / (2 * d * r1))
    a2 = r2 * r2 * math.acos((d * d + r2 * r2 - r1 * r1) / (2 * d * r2))
    tri = 0.5 * math.sqrt(max(0.0, (-d + r1 + r2) * (d + r1 - r2) * (d - r1 + r2) * (d + r1 + r2)))
    lap = a1 + a2 - tri
    assert lap > 0
    out = [
        '<circle cx="%.0f" cy="%.0f" r="%.0f" fill="#2563EB" opacity=".22" stroke="#2563EB" stroke-width="1.8"/>' % (cx1, cy, r1),
        '<circle cx="%.0f" cy="%.0f" r="%.0f" fill="#0E9384" opacity=".22" stroke="#0E9384" stroke-width="1.8"/>' % (cx2, cy, r2),
        '<text x="%.0f" y="%.0f" font-size="12" font-weight="800" fill="#1D4ED8" text-anchor="middle"%s>A</text>' % (cx1 - 30, cy + 4, HALO),
        '<text x="%.0f" y="%.0f" font-size="12" font-weight="800" fill="#0B6E63" text-anchor="middle"%s>B</text>' % (cx2 + 28, cy + 4, HALO),
        '<text x="%.0f" y="%.0f" font-size="10.5" font-weight="800" fill="#BE123C" text-anchor="middle"%s>두 번 세어진 자리</text>' % ((cx1 + cx2) / 2, cy + 4, HALO),
        '<path d="M%.0f %.0f L330 44" stroke="#BE123C" stroke-width="1.2"/>' % ((cx1 + cx2) / 2 + 22, cy - 16),
        '<text x="334" y="44" font-size="10.5" font-weight="800" fill="#BE123C"%s>한 번은 돌려줘야</text>' % HALO,
        '<text x="200" y="20" font-size="10.5" fill="#6B7280" text-anchor="middle"%s>A 를 세고 B 를 세면 겹친 자리는 벌써 두 번 들어가 있다</text>' % HALO,
        '<text x="200" y="166" font-size="10.5" fill="#6B7280" text-anchor="middle"%s>P(A∪B) = P(A) + P(B) − P(A∩B)</text>' % HALO,
    ]
    return ''.join(out)


# ── LAB 92 · 조립제법 한 판 (f(x)=x³−2x²−5x+6, k=2) ─────────────────
def syn92():
    CO = [1, -2, -5, 6]
    k = 2
    row = [CO[0]]
    for i in range(1, 4):
        row.append(CO[i] + row[i - 1] * k)
    fk = CO[0] * k ** 3 + CO[1] * k ** 2 + CO[2] * k + CO[3]
    assert row[3] == fk, (row, fk)
    X = [150, 206, 262, 318]
    out = ['<text x="96" y="52" font-size="12" font-weight="800" fill="#111827" text-anchor="end"%s>k = 2</text>' % HALO,
           '<path d="M112 36 V124 M112 124 H340" stroke="#111827" stroke-width="1.6"/>']
    for i, v in enumerate(CO):
        out.append('<text x="%d" y="52" font-size="13" font-weight="800" fill="#111827" text-anchor="middle"%s>%d</text>' % (X[i], 0 + 52, v) if False else
                   '<text x="%d" y="52" font-size="13" font-weight="800" fill="#111827" text-anchor="middle"%s>%d</text>' % (X[i], HALO, v))
    for i in range(1, 4):
        out.append('<text x="%d" y="88" font-size="12" font-weight="800" fill="#B45309" text-anchor="middle"%s>%d</text>' % (X[i], HALO, row[i - 1] * k))
        out.append('<path d="M%d 60 Q%d 76 %d 80" fill="none" stroke="#B45309" stroke-width="1.2"/>' % (X[i - 1] + 8, X[i - 1] + 34, X[i] - 6))
    for i, v in enumerate(row):
        col = '#BE123C' if i == 3 else '#0E9384'
        out.append('<text x="%d" y="116" font-size="13" font-weight="800" fill="%s" text-anchor="middle"%s>%d</text>' % (X[i], col, HALO, v))
    out.append('<text x="%d" y="140" font-size="10" font-weight="800" fill="#0B6E63" text-anchor="middle"%s>몫의 계수</text>' % (X[1], HALO))
    out.append('<text x="%d" y="140" font-size="10" font-weight="800" fill="#BE123C" text-anchor="middle"%s>나머지</text>' % (X[3], HALO))
    out.append('<text x="200" y="22" font-size="10.5" fill="#6B7280" text-anchor="middle"%s>긴 나눗셈 없이 계수만 내려 적고 곱해 더한다</text>' % HALO)
    out.append('<text x="200" y="162" font-size="10.5" fill="#6B7280" text-anchor="middle"%s>마지막 칸이 왜 하필 f(2) 와 같을까</text>' % HALO)
    return ''.join(out)


# ── LAB 93 · f(x)=x³−4x²+x+6 과 x=a 에서의 값 ───────────────────────
def rem93():
    f = lambda x: x ** 3 - 4 * x * x + x + 6
    for r in (-1, 2, 3):
        assert abs(f(r)) < 1e-9
    X = lambda x: 196 + 42 * x
    Y = lambda y: 96 - 7.6 * y
    pts = []
    x = -1.7
    while x <= 3.9:
        pts.append('%s%.1f %.1f' % ('M' if not pts else 'L', X(x), Y(f(x))))
        x += 0.06
    out = ['<path d="M30 96 H374 M196 20 V158" stroke="#9CA3AF" stroke-width="1.2"/>',
           '<path d="%s" stroke="#2563EB" stroke-width="2.4" fill="none" stroke-linecap="round"/>' % ' '.join(pts)]
    a = 1.0
    out.append('<path d="M%.1f %.1f V%.1f" stroke="#BE123C" stroke-width="1.4" stroke-dasharray="4 3"/>' % (X(a), Y(0), Y(f(a))))
    out.append('<circle cx="%.1f" cy="%.1f" r="5" fill="#BE123C"/>' % (X(a), Y(f(a))))
    out.append('<text x="%.1f" y="%.1f" font-size="10.5" font-weight="800" fill="#BE123C"%s>f(a) = 4</text>' % (X(a) + 9, Y(f(a)) + 4, HALO))
    for r in (-1, 2, 3):
        out.append('<circle cx="%.1f" cy="%.1f" r="3.6" fill="#0E9384"/>' % (X(r), Y(0)))
    out.append('<text x="200" y="20" font-size="10.5" fill="#6B7280" text-anchor="middle"%s>나눗셈을 하지 않고 나머지를 알 수 있을까</text>' % HALO)
    out.append('<text x="200" y="166" font-size="10.5" fill="#6B7280" text-anchor="middle"%s>f(x) = (x − a)Q(x) + R 에 x = a 를 넣으면?</text>' % HALO)
    return ''.join(out)


# ── LAB 94 · i 를 곱할 때마다 90° ───────────────────────────────────
def cplx94():
    O = (200.0, 90.0)
    S = 17.0
    z = (3.0, 1.0)
    pts = []
    re_, im_ = z
    for _ in range(4):
        pts.append((re_, im_))
        re_, im_ = -im_, re_
    assert pts[0] == (3.0, 1.0) and pts[1] == (-1.0, 3.0) and pts[2] == (-3.0, -1.0)
    out = ['<path d="M%0.0f 90 H%0.0f M200 %0.0f V%0.0f" stroke="#9CA3AF" stroke-width="1.2"/>'
           % (O[0] - 86, O[0] + 86, O[1] - 66, O[1] + 66)]
    COL = ['#BE123C', '#2563EB', '#0E9384', '#B45309']
    NM = ['z', 'i z', 'i² z', 'i³ z']
    for k, (a, b) in enumerate(pts):
        x, y = O[0] + a * S, O[1] - b * S
        out.append('<path d="M%.0f %.0f L%.1f %.1f" stroke="%s" stroke-width="1.8"/>' % (O[0], O[1], x, y, COL[k]))
        out.append('<circle cx="%.1f" cy="%.1f" r="4.4" fill="%s"/>' % (x, y, COL[k]))
        dx = 10 if a >= 0 else -10
        an = 'start' if a >= 0 else 'end'
        out.append('<text x="%.1f" y="%.1f" font-size="10.5" font-weight="800" fill="%s" text-anchor="%s"%s>%s</text>'
                   % (x + dx, y + (-6 if b >= 0 else 14), COL[k], an, HALO, NM[k]))
    out.append('<path d="M%.0f %.0f A34 34 0 0 0 %.0f %.0f" fill="none" stroke="#6B7280" stroke-width="1.3" stroke-dasharray="4 3"/>'
               % (O[0] + 34, O[1], O[0], O[1] - 34))
    out.append('<text x="%.0f" y="%.0f" font-size="10" font-weight="800" fill="#6B7280"%s>90°</text>' % (O[0] + 26, O[1] - 26, HALO))
    out.append('<text x="200" y="20" font-size="10.5" fill="#6B7280" text-anchor="middle"%s>i 를 한 번 곱할 때마다 90° 씩 돈다</text>' % HALO)
    out.append('<text x="200" y="166" font-size="10.5" fill="#6B7280" text-anchor="middle"%s>네 번 곱하면 제자리 — 그래서 i⁴ = 1</text>' % HALO)
    return ''.join(out)


# ── LAB 95 · 두 근의 합과 곱이 계수에 들어 있다 ─────────────────────
def viet95():
    b, c = -5.0, 6.0
    D = b * b - 4 * c
    r1 = (-b - math.sqrt(D)) / 2
    r2 = (-b + math.sqrt(D)) / 2
    assert abs(r1 + r2 - (-b)) < 1e-9 and abs(r1 * r2 - c) < 1e-9
    X = lambda x: 112 + 46 * x
    Y = lambda y: 104 - 11 * y
    f = lambda x: x * x + b * x + c
    pts = []
    x = 0.4
    while x <= 4.7:
        pts.append('%s%.1f %.1f' % ('M' if not pts else 'L', X(x), Y(f(x))))
        x += 0.05
    out = ['<path d="M%0.0f 104 H372 M112 24 V150" stroke="#9CA3AF" stroke-width="1.2"/>' % 90,
           '<path d="%s" stroke="#2563EB" stroke-width="2.4" fill="none" stroke-linecap="round"/>' % ' '.join(pts)]
    for r in (r1, r2):
        out.append('<circle cx="%.1f" cy="%.1f" r="5" fill="#BE123C"/>' % (X(r), Y(0)))
        out.append('<text x="%.1f" y="%.0f" font-size="10.5" font-weight="800" fill="#BE123C" text-anchor="middle"%s>%g</text>'
                   % (X(r), 122, HALO, r))
    out.append('<text x="300" y="52" font-size="11.5" font-weight="800" fill="#111827"%s>x² − 5x + 6</text>' % HALO)
    out.append('<text x="300" y="74" font-size="10.5" font-weight="800" fill="#0B6E63"%s>두 근의 합 = 5</text>' % HALO)
    out.append('<text x="300" y="92" font-size="10.5" font-weight="800" fill="#B45309"%s>두 근의 곱 = 6</text>' % HALO)
    out.append('<text x="200" y="20" font-size="10.5" fill="#6B7280" text-anchor="middle"%s>근을 구하지 않고도 합과 곱을 알 수 있을까</text>' % HALO)
    out.append('<text x="200" y="166" font-size="10.5" fill="#6B7280" text-anchor="middle"%s>계수 −5 와 6 을 다시 보라</text>' % HALO)
    return ''.join(out)


# ── LAB 96 · 산과 골짜기가 x축을 사이에 두는가 ──────────────────────
def cubic96():
    out = []
    for i, k in enumerate((3.0, 2.0, 0.0)):
        ox = 24 + i * 126
        X = lambda x: ox + 54 + 21 * x
        Y = lambda y: 96 - 7.0 * y
        f = lambda x: x ** 3 - 3 * x + k
        hi, lo = k + 2, k - 2
        n = 2 if min(abs(hi), abs(lo)) < 0.03 else (3 if hi * lo < 0 else 1)
        pts = []
        x = -2.4
        while x <= 2.4:
            pts.append('%s%.1f %.1f' % ('M' if not pts else 'L', X(x), Y(f(x))))
            x += 0.08
        out.append('<rect x="%d" y="28" width="108" height="104" rx="8" fill="#fff" stroke="#E5E7EB" stroke-width="1.2"/>' % ox)
        out.append('<path d="M%d 96 H%d" stroke="#9CA3AF" stroke-width="1.1"/>' % (ox + 8, ox + 100))
        col = ('#BE123C', '#B45309', '#0E9384')[i]
        out.append('<path d="%s" stroke="%s" stroke-width="2.2" fill="none" stroke-linecap="round"/>' % (' '.join(pts), col))
        out.append('<text x="%d" y="146" font-size="10.5" font-weight="800" fill="%s" text-anchor="middle"%s>k = %g — 실근 %d개</text>'
                   % (ox + 54, col, HALO, k, n))
    out.append('<text x="200" y="20" font-size="10.5" fill="#6B7280" text-anchor="middle"%s>산꼭대기와 골짜기가 x축을 «사이에 두면» 세 번 건넌다</text>' % HALO)
    return ''.join(out)


# ── LAB 97 · 해집합이 칠해진다 (x²−5x+6 < 0) ────────────────────────
def ineq97():
    b, c = -5.0, 6.0
    r1, r2 = 2.0, 3.0
    f = lambda x: x * x + b * x + c
    assert abs(f(r1)) < 1e-9 and abs(f(r2)) < 1e-9 and f(2.5) < 0
    X = lambda x: 90 + 54 * x
    Y = lambda y: 92 - 13 * y
    pts = []
    x = 0.6
    while x <= 4.5:
        pts.append('%s%.1f %.1f' % ('M' if not pts else 'L', X(x), Y(f(x))))
        x += 0.05
    out = ['<path d="M44 92 H374" stroke="#9CA3AF" stroke-width="1.3"/>',
           '<rect x="%.1f" y="92" width="%.1f" height="30" fill="#BE123C" opacity=".14"/>' % (X(r1), X(r2) - X(r1)),
           '<path d="%s" stroke="#2563EB" stroke-width="2.4" fill="none" stroke-linecap="round"/>' % ' '.join(pts)]
    for r in (r1, r2):
        out.append('<circle cx="%.1f" cy="92" r="5" fill="#BE123C"/>' % X(r))
        out.append('<text x="%.1f" y="112" font-size="10.5" font-weight="800" fill="#BE123C" text-anchor="middle"%s>%g</text>' % (X(r), HALO, r))
    out.append('<path d="M%.1f 136 H%.1f" stroke="#BE123C" stroke-width="3.4" stroke-linecap="round"/>' % (X(r1), X(r2)))
    out.append('<text x="%.1f" y="152" font-size="10.5" font-weight="800" fill="#BE123C" text-anchor="middle"%s>해집합 2 &lt; x &lt; 3</text>' % ((X(r1) + X(r2)) / 2, HALO))
    out.append('<text x="314" y="50" font-size="11" font-weight="800" fill="#1D4ED8"%s>x² − 5x + 6</text>' % HALO)
    out.append('<text x="200" y="20" font-size="10.5" fill="#6B7280" text-anchor="middle"%s>부등식을 푼다는 것은 그래프의 «지하 구간»을 읽는 일</text>' % HALO)
    return ''.join(out)


# ── LAB 98 · 가능 영역과 이익선 ─────────────────────────────────────
def lp98():
    V = [(0, 0), (6, 0), (4, 2), (0, 4)]
    z = lambda p: 3 * p[0] + 2 * p[1]
    best = max(V, key=z)
    assert best == (6, 0) and z(best) == 18, (best, z(best))
    X = lambda x: 70 + 38 * x
    Y = lambda y: 142 - 24 * y
    out = ['<path d="M62 142 H356 M70 150 V26" stroke="#9CA3AF" stroke-width="1.2"/>',
           '<polygon points="%s" fill="#2563EB" opacity=".14" stroke="#2563EB" stroke-width="1.8"/>'
           % ' '.join('%.0f,%.0f' % (X(a), Y(b)) for a, b in V)]
    for p in V:
        col = '#BE123C' if p == best else '#2563EB'
        out.append('<circle cx="%.0f" cy="%.0f" r="%.1f" fill="%s"/>' % (X(p[0]), Y(p[1]), 5.6 if p == best else 4, col))
        # 꼭짓점 이름은 늘 점의 «위»에 — 아래로 내리면 맨 아래 설명과 겹친다
        out.append('<text x="%.0f" y="%.0f" font-size="9.5" font-weight="800" fill="%s" text-anchor="middle"%s>(%d, %d)</text>'
                   % (X(p[0]) + (-16 if (p[0] == 0 and p[1] == 0) else 0), Y(p[1]) - 10, col, HALO, p[0], p[1]))
    # 이익선 3x + 2y = 18 (최적점을 지난다)
    x0, y0 = 2.0, 6.0
    x1, y1 = 6.0, 0.0
    out.append('<path d="M%.0f %.0f L%.0f %.0f" stroke="#B45309" stroke-width="2" stroke-dasharray="5 3"/>'
               % (X(x0), Y(y0), X(x1), Y(y1)))
    out.append('<text x="%.0f" y="%.0f" font-size="10" font-weight="800" fill="#92400E"%s>3x + 2y = 18</text>' % (X(x0) + 8, Y(y0) + 2, HALO))
    out.append('<text x="200" y="20" font-size="10.5" fill="#6B7280" text-anchor="middle"%s>이익선을 평행하게 밀면 마지막에 닿는 곳은 어디일까</text>' % HALO)
    out.append('<text x="200" y="166" font-size="10.5" fill="#6B7280" text-anchor="middle"%s>답은 영역의 안쪽이 아니라 늘 «모서리»에 있다</text>' % HALO)
    return ''.join(out)


# ── LAB 99 · 순서를 따지는가 ────────────────────────────────────────
def perm99():
    out = []
    for i, (t, pairs, col) in enumerate((
            ('회장 · 부회장 — 순서가 있다', [('가', '나'), ('나', '가')], '#2563EB'),
            ('청소 짝 — 순서가 없다', [('가', '나')], '#0E9384'))):
        ox = 30 + i * 186
        out.append('<rect x="%d" y="34" width="160" height="96" rx="9" fill="#fff" stroke="#E5E7EB" stroke-width="1.3"/>' % ox)
        for k, (a, b) in enumerate(pairs):
            y = 68 + k * 34
            out.append('<rect x="%d" y="%d" width="38" height="24" rx="5" fill="%s" opacity=".20" stroke="%s" stroke-width="1.2"/>' % (ox + 24, y - 17, col, col))
            out.append('<text x="%d" y="%d" font-size="12" font-weight="800" fill="%s" text-anchor="middle"%s>%s</text>' % (ox + 43, y, col, HALO, a))
            out.append('<rect x="%d" y="%d" width="38" height="24" rx="5" fill="%s" opacity=".20" stroke="%s" stroke-width="1.2"/>' % (ox + 84, y - 17, col, col))
            out.append('<text x="%d" y="%d" font-size="12" font-weight="800" fill="%s" text-anchor="middle"%s>%s</text>' % (ox + 103, y, col, HALO, b))
        if i == 1:
            out.append('<text x="%d" y="%d" font-size="10.5" font-weight="800" fill="#6B7280" text-anchor="middle"%s>(나, 가) 는 같은 짝</text>' % (ox + 80, 112, HALO))
        out.append('<text x="%d" y="146" font-size="10.5" font-weight="800" fill="%s" text-anchor="middle"%s>%s</text>' % (ox + 80, col, HALO, t))
    out.append('<text x="200" y="22" font-size="10.5" fill="#6B7280" text-anchor="middle"%s>같은 두 사람인데 왜 가짓수가 다를까</text>' % HALO)
    return ''.join(out)


# ── LAB 100 · 숫자 넷이 모양을 바꾼다 ───────────────────────────────
def mat100():
    M = (1.0, 0.8, 0.0, 1.0)      # [[1,0.8],[0,1]] — 밀기
    det = M[0] * M[3] - M[1] * M[2]
    assert abs(det - 1.0) < 1e-9
    sq = [(0, 0), (1, 0), (1, 1), (0, 1)]
    ap = lambda p: (M[0] * p[0] + M[1] * p[1], M[2] * p[0] + M[3] * p[1])
    X0, Y0, S = 72.0, 132.0, 46.0
    X1 = 248.0
    out = []
    out.append('<polygon points="%s" fill="#2563EB" opacity=".20" stroke="#2563EB" stroke-width="1.8"/>'
               % ' '.join('%.1f,%.1f' % (X0 + a * S, Y0 - b * S) for a, b in sq))
    out.append('<polygon points="%s" fill="#0E9384" opacity=".20" stroke="#0E9384" stroke-width="1.8"/>'
               % ' '.join('%.1f,%.1f' % (X1 + ap(p)[0] * S, Y0 - ap(p)[1] * S) for p in sq))
    out.append('<text x="%.0f" y="150" font-size="10.5" font-weight="800" fill="#1D4ED8" text-anchor="middle"%s>원래 — 넓이 1</text>' % (X0 + S / 2, HALO))
    out.append('<text x="%.0f" y="150" font-size="10.5" font-weight="800" fill="#0B6E63" text-anchor="middle"%s>기울인 뒤 — 넓이는?</text>' % (X1 + S * 0.9, HALO))
    out.append('<path d="M%0.0f 96 H%0.0f" stroke="#B45309" stroke-width="2"/>' % (X0 + S + 16, X1 - 14))
    out.append('<path d="M%0.0f 91 L%0.0f 96 L%0.0f 101" fill="none" stroke="#B45309" stroke-width="2"/>' % (X1 - 20, X1 - 14, X1 - 20))
    out.append('<text x="%.0f" y="86" font-size="10.5" font-weight="800" fill="#92400E" text-anchor="middle"%s>숫자 넷</text>' % ((X0 + S + X1) / 2, HALO))
    out.append('<text x="200" y="22" font-size="10.5" fill="#6B7280" text-anchor="middle"%s>사진을 기울이는 데 필요한 것은 숫자 네 개뿐이다</text>' % HALO)
    out.append('<text x="200" y="166" font-size="10.5" fill="#6B7280" text-anchor="middle"%s>모양은 달라졌는데 넓이는 어떻게 되었을까</text>' % HALO)
    return ''.join(out)


LESSONS = """LESSON[91]={
 title:'겹침을 두 번 세지 마라 — 확률의 덧셈',
 problem:{
  q:'반 학생 중 <b>축구를 좋아하는 학생이 60 %</b>, <b>농구를 좋아하는 학생이 50 %</b> 입니다. 그러면 «둘 중 하나라도 좋아하는» 학생은 <b>110 %</b> 일까요? 어디서 잘못된 걸까요?',
  svg:`<svg viewBox="0 0 400 170" role="img" aria-label="두 원이 겹친 자리를 두 번 세는 것을 보여 주는 그림">
    __V91__
  </svg>`,
  sit:'두 원을 <b>직접 끌어</b> 겹치는 정도를 바꾸면 <b>P(A)</b> · <b>P(B)</b> · <b>P(A∩B)</b> 가 계산되고, <b>그냥 더한 값</b> 과 <b>바르게 구한 값</b> 이 나란히 표시됩니다. 두 원을 아예 떼어 놓을 수도 있습니다.'
 },
 predict:{
  q:['두 확률을 그냥 더하면 왜 100 %를 넘을 수 있을까요?',
     '겹친 부분은 몇 번 세어졌을지 적어 보세요.',
     '두 원이 전혀 겹치지 않으면 어떻게 될지 예상하세요.'] },
 missions:[
  {t:'두 원을 겹쳐 보세요. <b>그냥 더함</b> 과 <b>바르게</b> 가 얼마나 벌어지나요?', re:'바르게'},
  {t:'두 원을 <b>떼어 놓아</b> 보세요. 두 값이 어떻게 되나요?', re:'P(A'},
  {t:'아래 <b>탐구 노트</b>로 마무리하세요 — 세 확률을 <b>기록</b>하고, 직접 <b>계산</b>하고, 떼어 놓아 <b>판단</b>합니다.',
   re:'탐구 노트 통과',
   do:'① 겹친 상태에서 P(A)·P(B)·P(A∩B) 적기 ② P(A)+P(B)−P(A∩B) 를 직접 계산하기 ③ 두 원을 떼어 보기',
   hand:'겹친 부분이 왜 «두 번» 들어가는지 그림으로 설명하고, 서로 배반일 때 식이 어떻게 줄어드는지 쓰기'}],
 inquiry:{
  id:'pa91', title:'겹침을 두 번 세지 마라',
  q:['두 원의 겹침을 바꿔 가며 5줄 이상 기록하세요. 떼어 놓은 경우도 넣으세요.',
     '「그냥 더함」과 「바르게」의 차를 보세요. 그 차가 무엇과 같나요?',
     '겹친 부분이 두 번 세어지는 까닭을 손으로 설명하세요.'],
  cols:['P(A)','P(B)','P(A∩B)','그냥 더함','바르게'],
  hint:'힌트 — 겹치는 부분은 A 에서 한 번, B 에서 한 번 — 벌써 두 번 들어가 있습니다. 한 번은 돌려줘야 합니다.' },
 apply:{
  q:'새 문제 — P(A) = <b>0.5</b>, P(B) = <b>0.4</b>, P(A∩B) = <b>0.15</b> 일 때 <b>P(A∪B)</b> 는?',
  a:0.75, tol:0.005,
  why:'0.5 + 0.4 − 0.15 = 0.75. 그냥 더하면 0.9 — 겹친 0.15 를 두 번 센 만큼 커집니다.',
  hint:'더한 뒤 겹친 것을 한 번 빼세요.' },
 demo(root){ return probAddDemo(root); }
};

LESSON[92]={
 title:'계수만으로 나눗셈 — 조립제법',
 problem:{
  q:'다항식을 <b>(x − k)</b> 로 나누려면 긴 나눗셈을 해야 합니다. 그런데 <b>계수만 내려 적고</b> 곱해서 더하는 것만으로 같은 답이 나옵니다. 이 줄임법은 <b>왜</b> 통하는 걸까요?',
  svg:`<svg viewBox="0 0 400 170" role="img" aria-label="계수 1 −2 −5 6 을 k=2 로 조립제법한 한 판">
    __S92__
  </svg>`,
  sit:'나눗수 <b>k</b> 를 고르고 「한 칸 진행」을 누를 때마다 한 자리씩 내려오고 곱해 더해집니다. 끝까지 가면 <b>몫의 계수</b> 와 <b>나머지 R</b> 이 나오고, 옆에 <b>f(k)</b> 가 함께 표시됩니다.'
 },
 predict:{
  q:['긴 나눗셈에서 실제로 쓰이는 것은 무엇일지 적어 보세요 — 문자일까요, 계수일까요?',
     '마지막 칸에 나오는 수가 무엇일지 예상하세요.',
     '그 수가 f(k) 와 같을지 예상하고 까닭도 적어 보세요.'] },
 missions:[
  {t:'k 를 정하고 <b>끝까지</b> 진행해 보세요. 몫과 나머지가 나오나요?', re:'나머지'},
  {t:'<b>나머지 R</b> 와 <b>f(k)</b> 를 견주어 보세요.', re:'f(k)'},
  {t:'아래 <b>탐구 노트</b>로 마무리하세요 — 값을 <b>기록</b>하고, k 를 바꿔 <b>견주고</b>, 까닭을 <b>판단</b>합니다.',
   re:'탐구 노트 통과',
   do:'① 지금 k·나머지·f(k) 적기 ② 두 수의 차 구하기 ③ k 를 바꿔 다시 끝까지 진행하기',
   hand:'f(x) = (x − k)Q(x) + R 에 x = k 를 넣으면 무엇이 사라지는지 쓰기'}],
 inquiry:{
  id:'sn92', title:'계수만으로 나눗셈 — 조립제법',
  q:['k 를 바꿔 가며 끝까지 진행해 5줄 이상 기록하세요.',
     '「나머지 R」과 「f(k)」 열을 견주세요. 늘 같나요?',
     '그 까닭을 나눗셈 등식으로 손으로 설명하세요.'],
  cols:['k','몫의 계수','나머지 R','f(k)'],
  hint:'힌트 — 마지막 칸(R)과 f(k) 를 나란히 적어 보세요. 늘 같습니다. 우연일까요?' },
 apply:{
  q:'새 문제 — <b>f(x) = x³ − 2x² − 5x + 6</b> 을 <b>(x − 2)</b> 로 나눈 나머지는?',
  a:-4, tol:0.5,
  why:'f(2) = 8 − 8 − 10 + 6 = −4. 조립제법의 마지막 칸도 −4 가 나옵니다.',
  hint:'나누지 말고 x = 2 를 넣어 보세요.' },
 demo(root){ return snDemo(root); }
};

LESSON[93]={
 title:'나누지 않고 아는 나머지 — 나머지정리',
 problem:{
  q:'<b>f(x) = x³ − 4x² + x + 6</b> 을 <b>(x − 5)</b> 로 나눈 나머지를 구하려 합니다. 긴 나눗셈을 해야 할까요? <b>숫자 하나만 넣으면</b> 끝납니다. 왜 그럴까요?',
  svg:`<svg viewBox="0 0 400 170" role="img" aria-label="삼차함수 그래프와 x=a 에서의 함숫값">
    __R93__
  </svg>`,
  sit:'점 <b>a</b> 를 직접 끌면 <b>f(a)</b> 가 계산되고, 「확인」을 누르면 실제로 <b>(x − a) 로 나눈 나머지</b> 가 나와 두 값이 같은지 보여 줍니다.'
 },
 predict:{
  q:['f(x) = (x − a)Q(x) + R 에 x = a 를 넣으면 어떤 항이 사라질지 적으세요.',
     '그러면 남는 것이 무엇일지 예상하세요.',
     'f(a) = 0 이면 그 a 는 무엇을 뜻할까요?'] },
 missions:[
  {t:'점 a 를 끌어 <b>f(a)</b> 가 어떻게 변하는지 보세요.', re:'f(a'},
  {t:'「확인」을 눌러 <b>나눈 나머지</b> 와 견주어 보세요.', re:'나머지'},
  {t:'아래 <b>탐구 노트</b>로 마무리하세요 — 값을 <b>기록</b>하고, 차를 <b>계산</b>하고, a 를 바꿔 <b>판단</b>합니다.',
   re:'탐구 노트 통과',
   do:'① 지금 a 와 f(a) 적기 ② 확인을 눌러 나머지와 견주기 ③ a 를 바꿔 다시 확인',
   hand:'나눗셈 등식에 x = a 를 대입하면 Q(x) 항이 통째로 사라지는 과정을 쓰기'}],
 inquiry:{
  id:'rm93', title:'나누지 않고 아는 나머지',
  q:['a 를 바꿔 가며 5줄 이상 기록하세요. f(a) = 0 이 되는 a 도 넣으세요.',
     '「f(a)」와 「나눈 나머지」 열을 견주세요.',
     '나눗셈 등식에 x = a 를 넣으면 왜 Q(x) 가 사라지는지 손으로 설명하세요.'],
  cols:['a','f(a)','나눈 나머지','같은가'],
  hint:'힌트 — 나눗셈 등식에 x = a 를 대입하면 Q(x) 항이 통째로 사라집니다.' },
 apply:{
  q:'새 문제 — <b>f(x) = x³ − 2x + 5</b> 를 <b>(x − 2)</b> 로 나눈 나머지는?',
  a:9, tol:0.5,
  why:'f(2) = 8 − 4 + 5 = 9. 나눗셈을 한 줄도 하지 않고 구했습니다.',
  hint:'x 에 2 를 넣으세요.' },
 demo(root){ return rmDemo(root); }
};

LESSON[94]={
 title:'i 를 곱하면 90° 회전 — 복소평면',
 problem:{
  q:'<b>i² = −1</b> 이라고 외웁니다. 그런데 «제곱해서 −1 이 되는 수»가 대체 무엇일까요? <b>수직선 위에는 없습니다.</b> 평면으로 나가면 i 가 하는 일이 보입니다.',
  svg:`<svg viewBox="0 0 400 170" role="img" aria-label="복소평면에서 i 를 곱할 때마다 90도씩 도는 네 점">
    __C94__
  </svg>`,
  sit:'점 <b>z</b> 를 직접 찍고 「×i」 를 누를 때마다 그 점이 어디로 가는지 자취가 남습니다. 네 번 누르면 어디로 돌아오는지 직접 확인합니다.'
 },
 predict:{
  q:['i 를 한 번 곱하면 점이 어디로 갈지 예상해 적으세요.',
     '두 번 곱하면 어떻게 될까요? 그것이 i² = −1 과 무슨 관계일까요?',
     '네 번 곱하면 어디에 있을지 예상하세요.'] },
 missions:[
  {t:'「×i」 를 눌러 점이 어디로 가는지 보세요.', re:'×i'},
  {t:'<b>네 번</b> 눌러 보세요. 처음 자리로 돌아오나요?', re:'z'},
  {t:'아래 <b>탐구 노트</b>로 마무리하세요 — 자취를 <b>기록</b>하고, 각을 <b>세고</b>, 규칙을 <b>판단</b>합니다.',
   re:'탐구 노트 통과',
   do:'① 처음 z 의 실수부·허수부 적기 ② ×i 한 번 뒤의 실수부·허수부 적기 ③ 네 번 눌러 제자리인지 확인',
   hand:'i² = −1 이 「90°를 두 번 = 180°」, 곧 부호 뒤집기임을 그림으로 설명하기'}],
 inquiry:{
  id:'cx94', title:'i 를 곱하면 90° 회전',
  q:['여러 z 로 시작해 ×i 를 네 번까지 눌러 가며 5줄 이상 기록하세요.',
     '「×i 2번」 열을 보세요. 처음 z 와 어떤 관계인가요?',
     'i² = −1 을 회전으로 손으로 설명하세요.'],
  cols:['z','×i 1번','×i 2번','×i 4번'],
  hint:'힌트 — i² = −1 은 「90° 를 두 번 = 180°」, 즉 부호 뒤집기입니다.' },
 apply:{
  q:'새 문제 — <b>z = 2 + 3i</b> 에 <b>i</b> 를 한 번 곱하면 <b>실수부</b>는?',
  a:-3, tol:0.1,
  why:'i(2 + 3i) = 2i + 3i² = −3 + 2i. 실수부는 −3 입니다 — 점 (2, 3) 이 90° 돌아 (−3, 2) 로 갔습니다.',
  hint:'i² = −1 을 써서 전개하세요.' },
 demo(root){ return cxDemo(root); }
};

LESSON[95]={
 title:'구하지 않고 아는 합과 곱 — 근과 계수',
 problem:{
  q:'<b>x² − 5x + 6 = 0</b> 의 두 근의 <b>합</b>과 <b>곱</b>을 구하려 합니다. 근을 먼저 구해야 할까요? 계수 <b>−5</b> 와 <b>6</b> 을 다시 보면, 답이 이미 거기 적혀 있습니다.',
  svg:`<svg viewBox="0 0 400 170" role="img" aria-label="x제곱 빼기 5x 더하기 6 의 그래프와 두 근 2 · 3">
    __V95__
  </svg>`,
  sit:'계수 <b>b</b> 와 <b>c</b> 를 바꾸면 <b>두 근</b> 과 그 <b>합</b> · <b>곱</b> 이 함께 계산됩니다. 근이 아예 없는 경우도 만들어 볼 수 있습니다.'
 },
 predict:{
  q:['두 근의 합이 계수와 어떤 관계일지 예상해 적으세요.',
     '두 근의 곱은 어떨까요?',
     '(x − p)(x − q) 를 전개하면 어떤 식이 될지 써 보세요.'] },
 missions:[
  {t:'b 와 c 를 바꿔 <b>두 근</b> 과 그 <b>합</b> 을 견주어 보세요.', re:'합'},
  {t:'<b>곱</b> 과 c 를 견주어 보세요.', re:'곱'},
  {t:'아래 <b>탐구 노트</b>로 마무리하세요 — 값을 <b>기록</b>하고, 계수와 <b>견주고</b>, 규칙을 <b>판단</b>합니다.',
   re:'탐구 노트 통과',
   do:'① 지금 b·c 와 두 근의 합·곱 적기 ② 합과 −b 의 차, 곱과 c 의 차 구하기 ③ b·c 를 바꿔 다시 확인',
   hand:'(x − p)(x − q) = x² − (p+q)x + pq 를 전개해 보이고, 계수가 근의 요약본임을 쓰기'}],
 inquiry:{
  id:'vt95', title:'구하지 않고 아는 합과 곱',
  q:['b 와 c 를 바꿔 가며 5줄 이상 기록하세요.',
     '「합」과 b, 「곱」과 c 를 각각 견주세요.',
     '(x − p)(x − q) 를 전개해 손으로 설명하세요.'],
  cols:['b','c','두 근','합','곱'],
  hint:'힌트 — (x−p)(x−q) = x² −(p+q)x + pq. 계수는 근의 요약본입니다.' },
 apply:{
  q:'새 문제 — <b>x² − 7x + 12 = 0</b> 의 두 근의 <b>합</b>은?',
  a:7, tol:0.1,
  why:'합 = −(−7) = 7 입니다. (근은 3 과 4 — 구해 보면 3 + 4 = 7 로 같습니다.)',
  hint:'합은 −b 입니다.' },
 demo(root){ return vtDemo(root); }
};

LESSON[96]={
 title:'산과 골짜기가 정하는 근의 수 — 삼차방정식',
 problem:{
  q:'<b>x³ − 3x + k = 0</b> 의 실근은 <b>몇 개</b>일까요? k 에 따라 <b>1개일 때도 3개일 때도</b> 있습니다. 식을 풀지 않고 <b>그래프만 보고</b> 알 수 있을까요?',
  svg:`<svg viewBox="0 0 400 170" role="img" aria-label="k 가 3 · 2 · 0 일 때 삼차함수가 x축을 각각 1번 2번 3번 만나는 그림">
    __B96__
  </svg>`,
  sit:'k 를 바꾸면 <b>극대</b>(k + 2)와 <b>극소</b>(k − 2)가 함께 계산되고, 그래프가 x축을 <b>몇 번 건너는지</b> 가 표시됩니다. 극값이 x축에 딱 닿는 순간도 만들어 볼 수 있습니다.'
 },
 predict:{
  q:['산꼭대기와 골짜기가 둘 다 x축 위에 있으면 몇 번 만날지 예상하세요.',
     '하나는 위, 하나는 아래라면 몇 번일까요?',
     '골짜기가 x축에 딱 닿으면 어떻게 될까요?'] },
 missions:[
  {t:'k 를 바꿔 <b>실근 수</b> 가 어떻게 변하는지 보세요.', re:'실근'},
  {t:'극값이 x축에 <b>딱 닿는</b> 순간을 찾아보세요.', re:'극'},
  {t:'아래 <b>탐구 노트</b>로 마무리하세요 — 극값을 <b>기록</b>하고, 곱을 <b>계산</b>하고, 경계를 <b>판단</b>합니다.',
   re:'탐구 노트 통과',
   do:'① 실근이 3개인 k 에서 극대·극소 적기 ② 두 극값을 곱해 부호 보기 ③ 실근이 1개가 되게 k 를 옮겨 다시 곱하기',
   hand:'«산꼭대기와 골짜기가 x축을 사이에 두면 세 번 건넌다»를 부등식 (k+2)(k−2) < 0 으로 쓰기'}],
 inquiry:{
  id:'cb96', title:'산과 골짜기가 정하는 근의 수',
  q:['k 를 바꿔 가며 5줄 이상 기록하세요. 실근이 1·2·3개인 경우를 모두 넣으세요.',
     '「극대」와 「극소」의 부호를 보세요. 실근 수와 어떻게 이어지나요?',
     '그 조건을 부등식으로 손으로 쓰세요.'],
  cols:['k','극대','극소','실근 수'],
  hint:'힌트 — 산꼭대기와 골짜기가 x축을 「사이에 두면」 세 번 건넙니다.' },
 apply:{
  q:'새 문제 — <b>x³ − 3x + 1 = 0</b> 의 <b>실근의 개수</b>는?',
  a:3, tol:0.1,
  why:'극대는 1 + 2 = 3 (> 0), 극소는 1 − 2 = −1 (< 0) 로 부호가 반대이므로 x축을 세 번 건넙니다.',
  hint:'k = 1 일 때 극대와 극소의 부호를 보세요.' },
 demo(root){ return cbDemo(root); }
};

LESSON[97]={
 title:'해집합이 칠해진다 — 이차부등식',
 problem:{
  q:'<b>x² − 5x + 6 &lt; 0</b> 을 푸세요. 방정식이라면 답이 <b>두 개</b>인데, 부등식의 답은 <b>구간 하나</b> 입니다. 두 수 사이가 답이 되는 까닭은 무엇일까요?',
  svg:`<svg viewBox="0 0 400 170" role="img" aria-label="포물선이 x축 아래로 내려간 구간 2와 3 사이가 해집합인 그림">
    __Q97__
  </svg>`,
  sit:'계수 <b>b</b> · <b>c</b> 를 바꾸고 부등호를 <b>&lt; 0</b> 과 <b>&gt; 0</b> 사이에서 뒤집으면, 포물선의 <b>지하 구간</b> 과 <b>지상 구간</b> 이 칠해지며 해집합이 함께 적힙니다.'
 },
 predict:{
  q:['「< 0」 은 그래프의 어느 쪽을 읽는 것일지 적어 보세요.',
     '부등호를 뒤집으면 해집합이 어떻게 달라질까요?',
     '포물선이 x축에 닿지 않으면 해집합은 무엇이 될까요?'] },
 missions:[
  {t:'b·c 를 바꿔 해집합이 <b>두 수 사이</b> 가 되게 해 보세요.', re:'해'},
  {t:'부등호를 <b>뒤집어</b> 보세요. 해집합이 어떻게 달라지나요?', re:'0'},
  {t:'아래 <b>탐구 노트</b>로 마무리하세요 — 해집합을 <b>기록</b>하고, 뒤집어 <b>견주고</b>, 규칙을 <b>판단</b>합니다.',
   re:'탐구 노트 통과',
   do:'① < 0 일 때의 b·c 와 해집합 적기 ② 부등호를 뒤집어 해집합 다시 적기 ③ 두 해집합을 합치면 무엇이 되는지 보기',
   hand:'«< 0 은 지하 구간, > 0 은 지상 구간»을 포물선 그림으로 설명하기'}],
 inquiry:{
  id:'qi97', title:'해집합이 칠해진다 — 이차부등식',
  q:['b·c 와 부등호를 바꿔 가며 5줄 이상 기록하세요. 해가 없는 경우도 넣으세요.',
     '같은 b·c 에서 부등호만 뒤집어 두 해집합을 견주세요.',
     '두 해집합을 합치면 무엇이 되는지 손으로 설명하세요.'],
  cols:['b','c','부등호','해집합'],
  hint:'힌트 — 「< 0」은 포물선의 지하 구간, 「> 0」은 지상 구간을 읽는 일입니다.' },
 apply:{
  q:'새 문제 — <b>x² − 5x + 6 ≤ 0</b> 을 만족하는 <b>정수 x 의 개수</b>는?',
  a:2, tol:0.1,
  why:'해집합은 2 ≤ x ≤ 3 이므로 정수는 2 와 3 — 두 개입니다. 등호가 없으면 2 < x < 3 이라 정수는 하나도 없습니다.',
  hint:'먼저 해집합을 구한 뒤 그 안의 정수를 세세요.' },
 demo(root){ return qiDemo(root); }
};

LESSON[98]={
 title:'답은 늘 꼭짓점에 있다 — 선형계획',
 problem:{
  q:'조건을 만족하는 (x, y) 는 <b>영역 안에 무수히</b> 많습니다. 그런데 이익이 가장 큰 자리는 <b>꼭짓점 네 곳만</b> 따져 보면 끝납니다. 영역 한가운데가 답이 되는 일은 왜 없을까요?',
  svg:`<svg viewBox="0 0 400 170" role="img" aria-label="가능 영역의 네 꼭짓점과 이익선 3x+2y=18 이 (6,0) 에 닿는 그림">
    __L98__
  </svg>`,
  sit:'점 <b>P</b> 를 영역 안에서 직접 끌면 두 목적함수의 값이 함께 계산됩니다. 이익선이 평행하게 밀리는 것을 보면서, <b>마지막으로 닿는 자리</b> 를 직접 찾습니다.'
 },
 predict:{
  q:['이익이 가장 큰 자리가 영역의 어디쯤일지 예상하고 까닭도 적으세요.',
     '이익선을 평행하게 밀면 마지막에 어디에 닿을까요?',
     '목적함수를 바꾸면 최적점도 바뀔지 예상하세요.'] },
 missions:[
  {t:'점 P 를 영역 안에서 끌어 <b>z 값</b> 이 어떻게 변하는지 보세요.', re:'z'},
  {t:'<b>가장 큰 z</b> 가 되는 자리를 찾아보세요.', re:'꼭짓점'},
  {t:'아래 <b>탐구 노트</b>로 마무리하세요 — 값을 <b>기록</b>하고, 꼭짓점을 <b>견주고</b>, 까닭을 <b>판단</b>합니다.',
   re:'탐구 노트 통과',
   do:'① 영역 안쪽 한 점에서 z 적기 ② 네 꼭짓점의 z 를 각각 적기 ③ 가장 큰 값이 어디인지 찾기',
   hand:'이익선이 평행이동만 하므로 마지막 접촉점이 모서리일 수밖에 없는 까닭을 그림으로 쓰기'}],
 inquiry:{
  id:'lp98', title:'답은 늘 꼭짓점에 있다',
  q:['영역 안의 여러 점에서 5줄 이상 기록하세요. 네 꼭짓점을 모두 넣으세요.',
     '두 목적함수 열을 견주세요. 최적점이 서로 다른가요?',
     '최적점이 늘 꼭짓점인 까닭을 손으로 설명하세요.'],
  cols:['꼭짓점','z = 3x+2y','z = x+3y'],
  hint:'힌트 — 이익선은 기울기가 고정된 채 평행이동만 합니다. 마지막 접촉점은 모서리일 수밖에 없습니다.' },
 apply:{
  q:'새 문제 — x ≥ 0, y ≥ 0, x + y ≤ 6, x + 2y ≤ 8 일 때 <b>z = 3x + 2y</b> 의 <b>최댓값</b>은?',
  a:18, tol:0.5,
  why:'꼭짓점 (0,0)·(6,0)·(4,2)·(0,4) 에서 z 는 0 · 18 · 16 · 8 입니다. 최댓값은 (6, 0) 에서 18 — 안쪽 점은 아무리 좋아도 모서리를 못 이깁니다.',
  hint:'네 꼭짓점의 좌표를 넣어 하나씩 계산해 보세요.' },
 demo(root){ return lpDemo(root); }
};

LESSON[99]={
 title:'순서의 값은 2! 배 — 순열과 조합',
 problem:{
  q:'네 사람 중 둘을 뽑습니다. <b>회장과 부회장</b> 을 뽑으면 12가지, <b>청소 짝</b> 을 뽑으면 6가지 — 같은 두 사람인데 왜 가짓수가 다를까요?',
  svg:`<svg viewBox="0 0 400 170" role="img" aria-label="순서가 있는 경우와 없는 경우를 견주는 그림">
    __P99__
  </svg>`,
  sit:'두 상황을 오가며 <b>실제로 만들어지는 경우</b> 를 모두 늘어놓아 셉니다. <b>순서</b> 를 따지는지 아닌지, <b>가짓수</b>, 그리고 그 <b>식</b> 이 함께 표시됩니다.'
 },
 predict:{
  q:['회장·부회장과 청소 짝 중 어느 쪽이 가짓수가 많을지 예상하세요.',
     '(가, 나) 와 (나, 가) 는 같은 경우일까요, 다른 경우일까요? 상황마다 적어 보세요.',
     '두 가짓수의 비가 얼마일지 예상하세요.'] },
 missions:[
  {t:'<b>회장·부회장</b> 을 골라 경우를 모두 늘어놓아 보세요.', re:'순서'},
  {t:'<b>청소 짝</b> 으로 바꿔 다시 세어 보세요.', re:'가짓수'},
  {t:'아래 <b>탐구 노트</b>로 마무리하세요 — 두 수를 <b>기록</b>하고, 비를 <b>계산</b>하고, 까닭을 <b>판단</b>합니다.',
   re:'탐구 노트 통과',
   do:'① 회장·부회장일 때의 가짓수 적기 ② 청소 짝으로 바꿔 다시 적기 ③ 두 수를 나눠 보기',
   hand:'나눈 값 2 가 「두 사람을 늘어놓는 방법의 수 2!」임을 보이고, 셋을 뽑으면 왜 3! 로 나누는지 쓰기'}],
 inquiry:{
  id:'pm99', title:'순서의 값은 2! 배',
  q:['두 상황을 오가며 기록하세요. 같은 것이 있는 경우(AABB)도 넣으세요.',
     '「가짓수」 열을 견주세요. 몇 배 차이인가요?',
     '그 배수가 무엇을 뜻하는지 손으로 설명하세요.'],
  cols:['상황','순서','가짓수','식'],
  hint:'힌트 — 나눗셈은 늘 「겹쳐 세어진 배수」를 지우는 동작입니다.' },
 apply:{
  q:'새 문제 — <b>5명</b> 중에서 <b>회장과 부회장</b> 을 뽑는 방법은 몇 가지일까요?',
  a:20, tol:0.5,
  why:'회장 5가지 × 남은 4명 중 부회장 4가지 = 20가지. 순서를 따지지 않는 «둘 뽑기»라면 2! 로 나눠 10가지가 됩니다.',
  hint:'회장을 먼저 뽑고, 남은 사람 중 부회장을 뽑으세요.' },
 demo(root){ return pmDemo(root); }
};

LESSON[100]={
 title:'사진을 움직이는 숫자판 — 행렬과 변환',
 problem:{
  q:'사진 편집 프로그램이 그림을 <b>돌리고 · 늘이고 · 기울이는</b> 데 필요한 것은 <b>숫자 네 개</b> 뿐입니다. 그 네 숫자는 각각 무슨 일을 할까요?',
  svg:`<svg viewBox="0 0 400 170" role="img" aria-label="정사각형이 행렬에 의해 평행사변형으로 기울어지는 그림">
    __M100__
  </svg>`,
  sit:'행렬의 네 수를 직접 바꾸면 도형이 그 자리에서 변합니다. <b>|det|</b> 가 함께 표시되어 <b>넓이가 몇 배</b> 가 되었는지 바로 보입니다. 「도전」을 누르면 90° 회전을 직접 만들어 볼 수 있습니다.'
 },
 predict:{
  q:['네 숫자 중 어느 것을 바꾸면 도형이 기울어질지 예상하세요.',
     '넓이가 변하지 않는 변환이 있을지 적어 보세요.',
     '90° 회전을 만들려면 네 숫자가 무엇이어야 할지 예상하세요.'] },
 missions:[
  {t:'네 수를 바꿔 도형이 어떻게 변하는지 보세요.', re:'행렬'},
  {t:'<b>|det|</b> 가 <b>1</b> 인데 모양은 달라지는 변환을 만들어 보세요.', re:'det'},
  {t:'아래 <b>탐구 노트</b>로 마무리하세요 — 행렬을 <b>기록</b>하고, det 를 <b>계산</b>하고, 뜻을 <b>판단</b>합니다.',
   re:'탐구 노트 통과',
   do:'① 지금 네 수와 |det| 적기 ② ad − bc 를 직접 계산해 견주기 ③ |det| 가 1 인 변환을 만들어 보기',
   hand:'행렬의 두 열이 각각 (1,0) 과 (0,1) 이 가는 자리임을 그림으로 보이고, |det| 가 넓이 배율인 까닭을 쓰기'}],
 inquiry:{
  id:'mx100', title:'사진을 움직이는 숫자판',
  q:['여러 행렬을 만들어 가며 5줄 이상 기록하세요. |det| 가 1 인 것과 아닌 것을 모두 넣으세요.',
     '「|det|」와 도형의 넓이 변화를 견주세요.',
     '행렬의 두 열이 무엇을 뜻하는지 손으로 설명하세요.'],
  cols:['행렬','도형 변화','|det|'],
  hint:'힌트 — 열이 곧 기저의 목적지입니다. 어디로 보낼지 정하면 행렬은 저절로 나옵니다.' },
 apply:{
  q:'새 문제 — 행렬 <b>[2 0 ; 0 3]</b> (a=2, b=0, c=0, d=3) 의 <b>|ad − bc|</b> 는?',
  a:6, tol:0.1,
  why:'2 × 3 − 0 × 0 = 6. 가로로 2배, 세로로 3배 늘였으니 넓이는 6배 — |det| 가 곧 넓이 배율입니다.',
  hint:'ad − bc 를 계산하세요.' },
 demo(root){ return mxDemo(root); }
};

"""


def note(no, head, c1, c2, c3):
    return "\n %d:{ h:'%s',\n  c:[\n%s,\n%s,\n%s\n ]},\n" % (no, head, c1, c2, c3)


NOTES = (
 note(91, '내가 겹치고 · 내가 빼고 · 내가 판단한다',
 """  {t:'기록 — 두 원을 <b>겹쳐 둔 채</b> 세 확률을 적으세요',
   f:'P(A) = {0} · P(B) = {1} · P(A∩B) = {2}',
   chk(got, r, mem){
     if(!r) return {ok:false, msg:'아직 화면 값이 없습니다.'};
     const a=noteNum(r[0]), b=noteNum(r[1]), ab=noteNum(r[2]);
     if(!(ab>0.02)) return {ok:false, msg:'두 원이 거의 안 겹칩니다 — 겹치게 끌어 놓고 적으세요. 떼어 놓는 것은 ③에서 합니다.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-a)>0.012||Math.abs(got[1]-b)>0.012||Math.abs(got[2]-ab)>0.012)
       return {ok:false, msg:'화면은 '+r[0]+' · '+r[1]+' · '+r[2]+' 입니다.'};
     mem.a=a; mem.b=b; mem.ab=ab;
     return {ok:true, msg:'기록했습니다 — 이제 그냥 더한 값과 바른 값을 직접 구해 봅시다.'};
   }}""",
 """  {t:'생각 — 직접 <b>더하고 빼</b> 보세요',
   f:'P(A) + P(B) = {0} · 거기서 P(A∩B) 를 뺀 값 = {1} · 화면의 「바르게」 와의 차 = {2}',
   chk(got, r, mem){
     if(mem.a===undefined) return {ok:false, msg:'① 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const ok=noteNum(r[4]);
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-(mem.a+mem.b))>0.02) return {ok:false, msg:'①의 두 확률을 더하세요.'};
     if(Math.abs(got[1]-(mem.a+mem.b-mem.ab))>0.02) return {ok:false, msg:'그 값에서 ①의 P(A∩B) 를 빼세요.'};
     if(Math.abs(got[2])>0.03) return {ok:false, msg:'내가 구한 값과 화면의 「바르게」('+r[4]+')를 빼 보세요.'};
     mem.ok2=true;
     return {ok:true, msg:'계산했습니다 — 차가 0 입니다. 이제 두 원을 떼어 놓아 봅시다.'};
   }}""",
 """  {t:'판단 — 두 원을 <b>떼어 놓은</b> 뒤 고르세요',
   f:'그때 P(A∩B) = {0} · 「그냥 더함」과 「바르게」의 차 = {1}',
   opts:['겹친 자리를 두 번 세었으므로 <b>한 번 빼 준다</b> — 서로 배반이면 뺄 것이 없어 그냥 더하면 된다',
         '확률은 언제나 그냥 더하면 된다',
         '겹친 자리는 두 번 다 세는 것이 맞다'],
   chk(got, r, mem, pick){
     if(!mem.ok2) return {ok:false, msg:'② 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const ab=noteNum(r[2]), s=noteNum(r[3]), ok=noteNum(r[4]);
     if(!(ab<0.01)) return {ok:false, msg:'아직 P(A∩B) = '+r[2]+' 입니다. 두 원이 닿지 않게 떼어 놓으세요.'};
     if(![0,1].every(j=>isFinite(got[j]))) return {ok:false, msg:'두 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-ab)>0.012) return {ok:false, msg:'지금 P(A∩B) 는 '+r[2]+' 입니다.'};
     if(Math.abs(got[1]-(s-ok))>0.02) return {ok:false, msg:'「그냥 더함」에서 「바르게」를 빼세요.'};
     if(pick!==0)
       return {ok:false, msg:'겹쳤을 때 두 값의 차가 '+mem.ab.toFixed(2)+' 였고, 떼어 놓으니 0 이 되었습니다. 그 차가 무엇과 같았나요? 다시 고르세요.'};
     return {ok:true, msg:'판단했습니다 — <b>P(A∪B) = P(A) + P(B) − P(A∩B).</b> 뺀 값이 곧 두 번 세어진 몫이고, 서로 배반이면 그 몫이 0 이라 그냥 더해도 됩니다.'};
   }}""")
 +
 note(92, '내가 내려 적고 · 내가 견주고 · 내가 판단한다',
 """  {t:'기록 — k 를 정해 <b>끝까지</b> 진행한 뒤 적으세요',
   f:'k = {0} · 나머지 R = {1} · f(k) = {2}',
   chk(got, r, mem){
     if(!r) return {ok:false, msg:'아직 화면 값이 없습니다.'};
     if(String(r[2]).indexOf('미완')>=0)
       return {ok:false, msg:'아직 끝나지 않았습니다 — 「한 칸 진행」을 눌러 마지막 칸까지 가세요.'};
     const k=noteNum(r[0]), R=noteNum(r[2]), fk=noteNum(r[3]);
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-k)>0.5) return {ok:false, msg:'k 는 '+r[0]+' 입니다.'};
     if(Math.abs(got[1]-R)>0.5) return {ok:false, msg:'나머지는 '+r[2]+' 입니다.'};
     if(Math.abs(got[2]-fk)>0.5) return {ok:false, msg:'f(k) 는 '+r[3]+' 입니다.'};
     mem.k=k; mem.R=R;
     return {ok:true, msg:'기록했습니다 — 두 수를 견주어 봅시다.'};
   }}""",
 """  {t:'생각 — <b>나머지 − f(k)</b> 를 구하세요',
   f:'나머지 − f(k) = {0}',
   chk(got, r, mem){
     if(mem.k===undefined) return {ok:false, msg:'① 칸을 먼저 통과하세요.'};
     if(!isFinite(got[0])) return {ok:false, msg:'칸을 채우세요.'};
     if(Math.abs(got[0])>0.5) return {ok:false, msg:'①에 적은 두 수를 빼 보세요. 무엇이 나오나요?'};
     mem.ok2=true;
     return {ok:true, msg:'계산했습니다 — 차가 0 입니다. k 를 바꿔도 그럴까요?'};
   }}""",
 """  {t:'판단 — <b>k 를 바꿔</b> 끝까지 다시 진행한 뒤 고르세요',
   f:'새 k = {0} · 나머지 R = {1} · f(k) = {2}',
   opts:['f(x) = (x − k)Q(x) + R 에 <b>x = k</b> 를 넣으면 앞 항이 통째로 0 이 되어 <b>R = f(k)</b> 가 남는다',
         '우연히 몇 번 같았을 뿐이다',
         '조립제법은 몫만 주고 나머지는 따로 구해야 한다'],
   chk(got, r, mem, pick){
     if(!mem.ok2) return {ok:false, msg:'② 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     if(String(r[2]).indexOf('미완')>=0) return {ok:false, msg:'끝까지 진행하세요.'};
     const k=noteNum(r[0]), R=noteNum(r[2]), fk=noteNum(r[3]);
     if(Math.abs(k-mem.k)<0.5) return {ok:false, msg:'k 가 그대로입니다 — 다른 k 로 바꿔 보세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-k)>0.5||Math.abs(got[1]-R)>0.5||Math.abs(got[2]-fk)>0.5)
       return {ok:false, msg:'지금은 '+r[0]+' · '+r[2]+' · '+r[3]+' 입니다.'};
     if(pick!==0)
       return {ok:false, msg:'k = '+mem.k+' 에서도 k = '+k+' 에서도 나머지와 f(k) 가 같았습니다. 나눗셈 등식에 x = k 를 넣어 보고 다시 고르세요.'};
     return {ok:true, msg:'판단했습니다 — <b>조립제법이 긴 나눗셈과 같은 답을 주는 것은 계수 자리만 옮겨 적었기 때문</b>이고, 마지막 칸이 f(k) 인 것은 나눗셈 등식에 x = k 를 넣으면 (x − k)Q(x) 가 사라지기 때문입니다.'};
   }}""")
 +
 note(93, '내가 넣고 · 내가 확인하고 · 내가 판단한다',
 """  {t:'기록 — 점 a 를 정한 뒤 f(a) 를 적으세요',
   f:'a = {0} · f(a) = {1}',
   chk(got, r, mem){
     if(!r) return {ok:false, msg:'아직 화면 값이 없습니다.'};
     const a=noteNum(r[0]), fa=noteNum(r[1]);
     if(![0,1].every(j=>isFinite(got[j]))) return {ok:false, msg:'두 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-a)>0.12) return {ok:false, msg:'a 는 '+r[0]+' 입니다.'};
     if(Math.abs(got[1]-fa)>0.05) return {ok:false, msg:'f(a) 는 '+r[1]+' 입니다.'};
     mem.a=a; mem.fa=fa;
     return {ok:true, msg:'기록했습니다 — 이제 「확인」을 눌러 실제 나머지와 견주어 봅시다.'};
   }}""",
 """  {t:'생각 — 「확인」을 눌러 <b>나눈 나머지</b> 와 견주세요',
   f:'나눈 나머지 = {0} · f(a) 와의 차 = {1}',
   chk(got, r, mem){
     if(mem.a===undefined) return {ok:false, msg:'① 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     if(String(r[2]).indexOf('미확인')>=0)
       return {ok:false, msg:'아직 확인하지 않았습니다 — 「확인」 단추를 누르세요.'};
     const R=noteNum(r[2]);
     if(![0,1].every(j=>isFinite(got[j]))) return {ok:false, msg:'두 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-R)>0.05) return {ok:false, msg:'화면의 나머지는 '+r[2]+' 입니다.'};
     if(Math.abs(got[1])>0.08) return {ok:false, msg:'나머지에서 ①의 f(a) 를 빼 보세요.'};
     mem.ok2=true;
     return {ok:true, msg:'계산했습니다 — 두 값이 같습니다. a 를 바꿔도 그럴까요?'};
   }}""",
 """  {t:'판단 — <b>a 를 바꿔</b> 다시 확인한 뒤 고르세요',
   f:'새 a = {0} · f(a) = {1} · 나눈 나머지 = {2}',
   opts:['x = a 를 넣으면 <b>(x − a)Q(x) 가 통째로 0</b> 이 되어 R 만 남는다 — 그래서 R = f(a)',
         'a 가 정수일 때만 성립한다',
         '나머지는 나눠 봐야만 알 수 있다'],
   chk(got, r, mem, pick){
     if(!mem.ok2) return {ok:false, msg:'② 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     if(String(r[2]).indexOf('미확인')>=0) return {ok:false, msg:'「확인」을 눌러 나머지를 띄우세요.'};
     const a=noteNum(r[0]), fa=noteNum(r[1]), R=noteNum(r[2]);
     if(Math.abs(a-mem.a)<0.4) return {ok:false, msg:'a 가 거의 그대로입니다 — 더 옮겨 보세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-a)>0.12||Math.abs(got[1]-fa)>0.05||Math.abs(got[2]-R)>0.05)
       return {ok:false, msg:'지금은 '+r[0]+' · '+r[1]+' · '+r[2]+' 입니다.'};
     if(pick!==0)
       return {ok:false, msg:'a = '+mem.a+' 에서도 a = '+a+' 에서도 두 값이 같았습니다. 나눗셈 등식에 x = a 를 넣어 보고 다시 고르세요.'};
     return {ok:true, msg:'판단했습니다 — <b>f(x) = (x − a)Q(x) + R 에 x = a 를 넣으면 (a − a) = 0 이라 앞 항이 통째로 사라집니다.</b> 그래서 f(a) 가 곧 나머지이고, f(a) = 0 이면 (x − a) 로 딱 나누어떨어집니다.'};
   }}""")
 +
 note(94, '내가 돌리고 · 내가 세고 · 내가 판단한다',
 """  {t:'기록 — 처음 z 와 <b>×i 한 번</b> 뒤의 자리를 적으세요',
   f:'처음 z 의 실수부 = {0} · ×i 한 번 뒤의 실수부 = {1} · 그때의 허수부 = {2}',
   chk(got, r, mem){
     if(!r) return {ok:false, msg:'아직 화면 값이 없습니다.'};
     const p=s=>{ const m=String(s).match(/-?\\d+(?:\\.\\d+)?/g); return m&&m.length>=2?[+m[0],+m[1]]:null; };
     const z=p(r[0]), z1=p(r[1]);
     if(!z1) return {ok:false, msg:'아직 ×i 를 누르지 않았습니다 — 한 번 눌러 보세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-z[0])>0.12) return {ok:false, msg:'처음 z 는 '+r[0]+' 입니다.'};
     if(Math.abs(got[1]-z1[0])>0.12||Math.abs(got[2]-z1[1])>0.12)
       return {ok:false, msg:'×i 한 번 뒤는 '+r[1]+' 입니다.'};
     mem.z=z; mem.z1=z1;
     return {ok:true, msg:'기록했습니다 — 실수부와 허수부가 어떻게 맞바뀌었는지 보이나요?'};
   }}""",
 """  {t:'생각 — <b>×i 두 번</b> 뒤의 자리를 처음 z 와 견주세요',
   f:'×i 두 번 뒤의 실수부 = {0} · 처음 z 의 실수부와 더한 값 = {1}',
   chk(got, r, mem){
     if(mem.z===undefined) return {ok:false, msg:'① 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const p=s=>{ const m=String(s).match(/-?\\d+(?:\\.\\d+)?/g); return m&&m.length>=2?[+m[0],+m[1]]:null; };
     const z2=p(r[2]);
     if(!z2) return {ok:false, msg:'아직 두 번 누르지 않았습니다 — 「×i」 를 한 번 더 누르세요.'};
     if(![0,1].every(j=>isFinite(got[j]))) return {ok:false, msg:'두 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-z2[0])>0.12) return {ok:false, msg:'×i 두 번 뒤는 '+r[2]+' 입니다.'};
     if(Math.abs(got[1])>0.12) return {ok:false, msg:'①의 실수부와 더해 보세요. 무엇이 나오나요?'};
     mem.ok2=true;
     return {ok:true, msg:'계산했습니다 — 합이 0 — 두 번 곱하면 <b>부호가 뒤집힌</b> 자리입니다.'};
   }}""",
 """  {t:'판단 — <b>네 번</b> 눌러 어디에 있는지 보고 고르세요',
   f:'×i 네 번 뒤의 실수부 = {0} · 허수부 = {1}',
   opts:['i 를 한 번 곱하면 <b>90° 회전</b> — 두 번이면 180° 라 부호가 뒤집히고(i² = −1), 네 번이면 제자리(i⁴ = 1)',
         'i 를 곱하면 점이 원점에서 멀어진다',
         'i 를 네 번 곱하면 원점으로 간다'],
   chk(got, r, mem, pick){
     if(!mem.ok2) return {ok:false, msg:'② 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const p=s=>{ const m=String(s).match(/-?\\d+(?:\\.\\d+)?/g); return m&&m.length>=2?[+m[0],+m[1]]:null; };
     const z4=p(r[3]);
     if(!z4) return {ok:false, msg:'아직 네 번 누르지 않았습니다 — 「×i」 를 네 번까지 누르세요.'};
     if(![0,1].every(j=>isFinite(got[j]))) return {ok:false, msg:'두 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-z4[0])>0.12||Math.abs(got[1]-z4[1])>0.12)
       return {ok:false, msg:'네 번 뒤는 '+r[3]+' 입니다.'};
     if(Math.abs(z4[0]-mem.z[0])>0.2||Math.abs(z4[1]-mem.z[1])>0.2)
       return {ok:false, msg:'네 번 눌렀는데 처음 자리가 아닙니다 — 「다시」로 되돌린 뒤 정확히 네 번 눌러 보세요.'};
     if(pick!==0)
       return {ok:false, msg:'네 번 눌렀더니 처음 자리 '+r[0]+' 로 돌아왔습니다. 한 번에 몇 도씩 돈 걸까요? 다시 고르세요.'};
     return {ok:true, msg:'판단했습니다 — <b>i 를 곱하는 것은 원점을 중심으로 90° 돌리는 일</b> 입니다. 두 번 돌리면 180° — 그것이 i² = −1 의 뜻이고, 네 번이면 360° 라 제자리입니다. 「제곱해서 −1 이 되는 수」는 수직선에는 없고 평면에 있습니다.'};
   }}""")
 +
 note(95, '내가 바꾸고 · 내가 견주고 · 내가 판단한다',
 """  {t:'기록 — b 와 c 를 정한 뒤 두 근의 합과 곱을 적으세요',
   f:'b = {0} · 두 근의 합 = {1} · 두 근의 곱 = {2}',
   chk(got, r, mem){
     if(!r) return {ok:false, msg:'아직 화면 값이 없습니다.'};
     if(String(r[2]).indexOf('없음')>=0)
       return {ok:false, msg:'지금은 근이 없습니다 — c 를 줄이거나 b 를 키워 근이 생기게 하세요.'};
     const b=noteNum(r[0]), s=noteNum(r[3]), p=noteNum(r[4]);
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-b)>0.12) return {ok:false, msg:'b 는 '+r[0]+' 입니다.'};
     if(Math.abs(got[1]-s)>0.12||Math.abs(got[2]-p)>0.12)
       return {ok:false, msg:'화면은 합 '+r[3]+' · 곱 '+r[4]+' 입니다.'};
     mem.b=b; mem.c=noteNum(r[1]); mem.s=s; mem.p=p;
     return {ok:true, msg:'기록했습니다 — 이 두 수를 계수와 견주어 봅시다.'};
   }}""",
 """  {t:'생각 — 계수와 견주세요',
   f:'합 − (−b) = {0} · 곱 − c = {1}',
   chk(got, r, mem){
     if(mem.b===undefined) return {ok:false, msg:'① 칸을 먼저 통과하세요.'};
     if(![0,1].every(j=>isFinite(got[j]))) return {ok:false, msg:'두 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-(mem.s+mem.b))>0.15) return {ok:false, msg:'①의 합에서 −b 를 빼세요. b 는 '+mem.b+' 입니다.'};
     if(Math.abs(got[1]-(mem.p-mem.c))>0.15) return {ok:false, msg:'①의 곱에서 c 를 빼세요. c 는 '+mem.c+' 입니다.'};
     mem.ok2=true;
     return {ok:true, msg:'계산했습니다 — 둘 다 0 입니다. 계수를 바꿔도 그럴까요?'};
   }}""",
 """  {t:'판단 — <b>b 와 c 를 바꿔</b> 다시 견준 뒤 고르세요',
   f:'새 b = {0} · 새 합 = {1} · 새 곱 = {2}',
   opts:['(x − p)(x − q) 를 전개하면 <b>x² − (p+q)x + pq</b> — 계수가 곧 근의 합과 곱이다',
         '합과 곱은 근을 구해야만 알 수 있다',
         '합은 b, 곱은 −c 다'],
   chk(got, r, mem, pick){
     if(!mem.ok2) return {ok:false, msg:'② 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     if(String(r[2]).indexOf('없음')>=0) return {ok:false, msg:'근이 있는 상태로 맞추세요.'};
     const b=noteNum(r[0]), s=noteNum(r[3]), p=noteNum(r[4]);
     if(Math.abs(b-mem.b)<0.5) return {ok:false, msg:'b 가 그대로입니다 — 바꿔 보세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-b)>0.12||Math.abs(got[1]-s)>0.12||Math.abs(got[2]-p)>0.12)
       return {ok:false, msg:'지금은 '+r[0]+' · 합 '+r[3]+' · 곱 '+r[4]+' 입니다.'};
     if(Math.abs(s+b)>0.3)
       return {ok:false, msg:'합 '+r[3]+' 과 −b = '+(-b)+' 를 견주어 보세요.'};
     if(pick!==0)
       return {ok:false, msg:'두 번 모두 합 = −b, 곱 = c 였습니다. (x − p)(x − q) 를 전개해 보고 다시 고르세요.'};
     return {ok:true, msg:'판단했습니다 — <b>계수는 근의 요약본</b> 입니다. 근을 구하지 않고도 합과 곱을 바로 읽을 수 있고, 거꾸로 합과 곱을 알면 그 두 수를 근으로 갖는 이차식을 바로 쓸 수 있습니다.'};
   }}""")
 +
 note(96, '내가 올리고 · 내가 곱하고 · 내가 판단한다',
 """  {t:'기록 — 실근이 <b>3개</b> 가 되게 맞춘 뒤 극값을 적으세요',
   f:'k = {0} · 극대 = {1} · 극소 = {2}',
   chk(got, r, mem){
     if(!r) return {ok:false, msg:'아직 화면 값이 없습니다.'};
     if(String(r[3]).indexOf('3')<0)
       return {ok:false, msg:'지금 실근이 «'+r[3]+'» 입니다. k 를 옮겨 3개가 되게 하세요.'};
     const k=noteNum(r[0]), hi=noteNum(r[1]), lo=noteNum(r[2]);
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-k)>0.06||Math.abs(got[1]-hi)>0.06||Math.abs(got[2]-lo)>0.06)
       return {ok:false, msg:'화면은 '+r[0]+' · '+r[1]+' · '+r[2]+' 입니다.'};
     mem.hi=hi; mem.lo=lo;
     return {ok:true, msg:'기록했습니다 — 두 극값의 부호가 어떤가요?'};
   }}""",
 """  {t:'생각 — 두 극값을 <b>곱해</b> 보세요',
   f:'극대 × 극소 = {0} · 음수면 1, 양수면 0 → {1}',
   chk(got, r, mem){
     if(mem.hi===undefined) return {ok:false, msg:'① 칸을 먼저 통과하세요.'};
     if(![0,1].every(j=>isFinite(got[j]))) return {ok:false, msg:'두 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-mem.hi*mem.lo)>0.3) return {ok:false, msg:'①의 두 극값을 곱하세요.'};
     if(Math.abs(got[1]-1)>0.01) return {ok:false, msg:'곱이 '+(mem.hi*mem.lo).toFixed(2)+' 입니다. 음수인가요?'};
     mem.ok2=true;
     return {ok:true, msg:'계산했습니다 — 곱이 <b>음수</b> — 두 극값이 x축을 사이에 두고 있습니다.'};
   }}""",
 """  {t:'판단 — k 를 옮겨 실근이 <b>1개</b> 가 되게 한 뒤 고르세요',
   f:'새 k = {0} · 극대 × 극소 = {1}',
   opts:['극대와 극소가 <b>x축을 사이에 두면</b> 세 번 건넌다 — 곧 (k+2)(k−2) < 0 일 때 실근이 3개',
         '극대가 클수록 실근이 많다',
         'k 가 양수면 실근이 3개다'],
   chk(got, r, mem, pick){
     if(!mem.ok2) return {ok:false, msg:'② 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     if(String(r[3]).indexOf('1')<0)
       return {ok:false, msg:'지금 실근이 «'+r[3]+'» 입니다. k 를 더 옮겨 1개가 되게 하세요.'};
     const k=noteNum(r[0]), hi=noteNum(r[1]), lo=noteNum(r[2]);
     if(![0,1].every(j=>isFinite(got[j]))) return {ok:false, msg:'두 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-k)>0.06) return {ok:false, msg:'지금 k 는 '+r[0]+' 입니다.'};
     if(Math.abs(got[1]-hi*lo)>0.3) return {ok:false, msg:'지금 두 극값을 곱하세요.'};
     if(!(hi*lo>0)) return {ok:false, msg:'곱이 아직 음수입니다 — 실근이 1개가 되도록 더 옮기세요.'};
     if(pick!==0)
       return {ok:false, msg:'실근 3개일 때 곱이 '+(mem.hi*mem.lo).toFixed(1)+' (음수), 1개일 때 '+(hi*lo).toFixed(1)+' (양수) 였습니다. 다시 고르세요.'};
     return {ok:true, msg:'판단했습니다 — <b>식을 풀지 않고 극값의 부호만 보고</b> 실근의 개수를 알 수 있습니다. 극값이 x축에 딱 닿으면(곱이 0) 중근이 생겨 2개가 됩니다.'};
   }}""")
 +
 note(97, '내가 칠하고 · 내가 뒤집고 · 내가 판단한다',
 """  {t:'기록 — <b>&lt; 0</b> 으로 두고 해집합이 <b>두 수 사이</b> 가 되게 맞춘 뒤 적으세요',
   f:'b = {0} · c = {1}',
   chk(got, r, mem){
     if(!r) return {ok:false, msg:'아직 화면 값이 없습니다.'};
     if(String(r[2]).indexOf('<')<0)
       return {ok:false, msg:'지금 부등호가 «'+r[2]+'» 입니다. 「< 0」 으로 바꾸세요.'};
     const sol=String(r[3]);
     if(sol.indexOf('<')<0||sol.indexOf('없')>=0)
       return {ok:false, msg:'지금 해집합이 «'+sol+'» 입니다. b·c 를 바꿔 두 수 사이가 되게 하세요.'};
     const b=noteNum(r[0]), c=noteNum(r[1]);
     if(![0,1].every(j=>isFinite(got[j]))) return {ok:false, msg:'두 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-b)>0.5||Math.abs(got[1]-c)>0.5)
       return {ok:false, msg:'화면은 b = '+r[0]+' · c = '+r[1]+' 입니다.'};
     mem.b=b; mem.c=c; mem.lt=sol;
     return {ok:true, msg:'기록했습니다 — 해집합은 «'+sol+'» 입니다. 이제 부등호를 뒤집어 봅시다.'};
   }}""",
 """  {t:'생각 — <b>b·c 는 그대로</b> 두고 부등호만 <b>&gt; 0</b> 으로 뒤집으세요',
   f:'b = {0} · c = {1} · 해집합이 두 구간으로 갈라졌으면 1, 아니면 0 → {2}',
   chk(got, r, mem){
     if(mem.b===undefined) return {ok:false, msg:'① 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     if(String(r[2]).indexOf('>')<0)
       return {ok:false, msg:'아직 «'+r[2]+'» 입니다. 부등호를 「> 0」 으로 뒤집으세요.'};
     const b=noteNum(r[0]), c=noteNum(r[1]);
     if(Math.abs(b-mem.b)>0.5||Math.abs(c-mem.c)>0.5)
       return {ok:false, msg:'b·c 가 달라졌습니다 — b = '+mem.b+' · c = '+mem.c+' 로 되돌리고 부등호만 뒤집으세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-b)>0.5||Math.abs(got[1]-c)>0.5) return {ok:false, msg:'지금 b·c 를 그대로 적으세요.'};
     if(Math.abs(got[2]-1)>0.01)
       return {ok:false, msg:'지금 해집합은 «'+r[3]+'» 입니다. 한 구간인가요, 두 구간인가요?'};
     mem.gt=String(r[3]);
     return {ok:true, msg:'계산했습니다 — 「< 0」 은 «'+mem.lt+'», 「> 0」 은 «'+mem.gt+'» 입니다.'};
   }}""",
 """  {t:'판단 — 두 해집합을 견주어 고르세요',
   f:'두 해집합이 겹치는 곳이 있으면 1, 없으면 0 → {0} · 두 해집합에 모두 빠진 수의 개수 = {1}',
   opts:['포물선의 <b>지하 구간</b>이 「&lt; 0」, <b>지상 구간</b>이 「&gt; 0」 — 둘을 합치면 x축과 만나는 두 점만 남는다',
         '부등호를 뒤집으면 해집합도 그대로다',
         '두 해집합을 합치면 실수 전체가 된다'],
   chk(got, r, mem, pick){
     if(mem.gt===undefined) return {ok:false, msg:'② 칸을 먼저 통과하세요.'};
     if(![0,1].every(j=>isFinite(got[j]))) return {ok:false, msg:'두 칸을 모두 채우세요.'};
     if(Math.abs(got[0])>0.01)
       return {ok:false, msg:'«'+mem.lt+'» 와 «'+mem.gt+'» 를 수직선에 그려 보세요. 겹치는 곳이 있나요?'};
     if(Math.abs(got[1]-2)>0.01)
       return {ok:false, msg:'두 해집합 어디에도 안 들어가는 수는 포물선이 x축에 «닿는» 자리뿐입니다. 몇 개인가요?'};
     if(pick!==0)
       return {ok:false, msg:'「< 0」 은 «'+mem.lt+'», 「> 0」 은 «'+mem.gt+'» — 겹치지 않고, 빠진 수는 두 근뿐이었습니다. 다시 고르세요.'};
     return {ok:true, msg:'판단했습니다 — <b>부등식을 푼다는 것은 그래프의 어느 쪽을 읽을지 정하는 일</b> 입니다. 두 근이 경계가 되고, 그 사이가 지하, 바깥이 지상입니다.'};
   }}""")
 +
 note(98, '내가 끌고 · 내가 재고 · 내가 판단한다',
 """  {t:'기록 — 영역 <b>안쪽</b> 의 한 점에서 z 를 적으세요',
   f:'z = 3x+2y 의 값 = {0}',
   chk(got, r, mem){
     if(!r) return {ok:false, msg:'아직 화면 값이 없습니다.'};
     const p=String(r[0]).match(/-?\\d+(?:\\.\\d+)?/g)||[];
     if(p.length<2) return {ok:false, msg:'점 P 를 영역 안으로 끌어 놓으세요.'};
     const x=+p[0], y=+p[1], z=noteNum(r[1]);
     if(x+y>5.6 || x<0.4 || y<0.4)
       return {ok:false, msg:'①은 <b>영역 안쪽</b>에서 적습니다 — 모서리가 아니라 가운데쯤으로 끌어 놓으세요. 꼭짓점은 ②③에서 봅니다.'};
     if(!isFinite(got[0])) return {ok:false, msg:'칸을 채우세요.'};
     if(Math.abs(got[0]-z)>0.15) return {ok:false, msg:'화면의 z 는 '+r[1]+' 입니다.'};
     mem.zin=z;
     return {ok:true, msg:'기록했습니다 — 안쪽에서 z = '+z+' 입니다. 모서리는 어떨까요?'};
   }}""",
 """  {t:'생각 — <b>꼭짓점 (6, 0)</b> 으로 끌어다 놓고 z 를 적으세요',
   f:'그때 z = {0} · 안쪽에서 잰 값보다 큰 만큼 = {1}',
   chk(got, r, mem){
     if(mem.zin===undefined) return {ok:false, msg:'① 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const p=String(r[0]).match(/-?\\d+(?:\\.\\d+)?/g)||[];
     const x=+p[0], y=+p[1], z=noteNum(r[1]);
     if(Math.abs(x-6)>0.2||Math.abs(y)>0.2)
       return {ok:false, msg:'지금 P('+p[0]+', '+p[1]+') 입니다. 꼭짓점 (6, 0) 으로 끌어다 놓으세요.'};
     if(![0,1].every(j=>isFinite(got[j]))) return {ok:false, msg:'두 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-z)>0.15) return {ok:false, msg:'화면의 z 는 '+r[1]+' 입니다.'};
     if(Math.abs(got[1]-(z-mem.zin))>0.2) return {ok:false, msg:'지금 z 에서 ①의 z 를 빼세요.'};
     mem.z60=z;
     return {ok:true, msg:'계산했습니다 — 모서리에서 '+(z-mem.zin).toFixed(1)+' 만큼 더 큽니다.'};
   }}""",
 """  {t:'판단 — 나머지 꼭짓점 <b>(4, 2)</b> 도 재어 본 뒤 고르세요',
   f:'(4, 2) 에서의 z = {0} · (6, 0) 에서의 z 와의 차 = {1}',
   opts:['이익선은 <b>기울기가 고정된 채 평행이동만</b> 하므로 마지막 접촉점은 반드시 <b>꼭짓점</b> 이다',
         '영역의 한가운데가 가장 좋다',
         '꼭짓점 중에서는 원점에서 가장 먼 곳이 늘 최적이다'],
   chk(got, r, mem, pick){
     if(mem.z60===undefined) return {ok:false, msg:'② 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const p=String(r[0]).match(/-?\\d+(?:\\.\\d+)?/g)||[];
     const x=+p[0], y=+p[1], z=noteNum(r[1]);
     if(Math.abs(x-4)>0.2||Math.abs(y-2)>0.2)
       return {ok:false, msg:'지금 P('+p[0]+', '+p[1]+') 입니다. 꼭짓점 (4, 2) 로 끌어다 놓으세요.'};
     if(![0,1].every(j=>isFinite(got[j]))) return {ok:false, msg:'두 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-z)>0.15) return {ok:false, msg:'화면의 z 는 '+r[1]+' 입니다.'};
     if(Math.abs(got[1]-(mem.z60-z))>0.2) return {ok:false, msg:'②의 z 에서 지금 z 를 빼세요.'};
     if(pick!==0)
       return {ok:false, msg:'안쪽 '+mem.zin+' · (4,2) '+z+' · (6,0) '+mem.z60+' 이었습니다. 이익선을 밀어 보고 다시 고르세요.'};
     return {ok:true, msg:'판단했습니다 — <b>이익선을 평행하게 밀 때 영역에서 마지막으로 떨어지는 점이 최적점</b> 이고, 그 점은 늘 모서리입니다. 그래서 꼭짓점 네 곳만 따져 보면 끝납니다. 다만 <b>어느</b> 꼭짓점인지는 목적함수에 따라 달라집니다 — z = x + 3y 로 바꿔 확인해 보세요.'};
   }}""")
 +
 note(99, '내가 늘어놓고 · 내가 나누고 · 내가 판단한다',
 """  {t:'기록 — <b>회장 · 부회장</b> 을 골라 가짓수를 적으세요',
   f:'가짓수 = {0}',
   chk(got, r, mem){
     if(!r) return {ok:false, msg:'아직 화면 값이 없습니다.'};
     if(String(r[1]).indexOf('있음')<0)
       return {ok:false, msg:'지금 «'+r[0]+'» 입니다. 「회장·부회장」 을 골라 순서가 있는 경우로 만드세요.'};
     const n=noteNum(r[2]);
     if(!isFinite(got[0])) return {ok:false, msg:'칸을 채우세요.'};
     if(Math.abs(got[0]-n)>0.5) return {ok:false, msg:'화면의 가짓수는 '+r[2]+' 입니다.'};
     mem.P=n;
     return {ok:true, msg:'기록했습니다 — '+n+'가지입니다. 순서를 안 따지면 어떻게 될까요?'};
   }}""",
 """  {t:'생각 — <b>청소 짝</b> 으로 바꿔 가짓수를 적고 나눠 보세요',
   f:'가짓수 = {0} · 앞의 가짓수를 이 수로 나눈 값 = {1}',
   chk(got, r, mem){
     if(mem.P===undefined) return {ok:false, msg:'① 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     if(String(r[1]).indexOf('없음')<0)
       return {ok:false, msg:'지금 «'+r[0]+'» 입니다. 「청소 짝」 을 골라 순서가 없는 경우로 만드세요.'};
     const n=noteNum(r[2]);
     if(![0,1].every(j=>isFinite(got[j]))) return {ok:false, msg:'두 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-n)>0.5) return {ok:false, msg:'화면의 가짓수는 '+r[2]+' 입니다.'};
     if(Math.abs(got[1]-mem.P/n)>0.05) return {ok:false, msg:'①의 '+mem.P+' 를 지금 가짓수로 나누세요.'};
     mem.C=n; mem.ratio=mem.P/n;
     return {ok:true, msg:'계산했습니다 — 몫이 '+mem.ratio+' 입니다. 이 수가 어디서 왔을까요?'};
   }}""",
 """  {t:'판단 — 몫이 무엇인지 고르세요',
   f:'두 사람을 한 줄로 늘어놓는 방법의 수 = {0} · ②의 몫과 같으면 1 → {1}',
   opts:['순서를 안 따지면 <b>(가,나) 와 (나,가) 가 한 경우로 뭉친다</b> — 그래서 2! 로 나눈다',
         '청소 짝이 더 어려워서 가짓수가 적다',
         '두 상황의 가짓수는 늘 2 만큼 차이 난다'],
   chk(got, r, mem, pick){
     if(mem.ratio===undefined) return {ok:false, msg:'② 칸을 먼저 통과하세요.'};
     if(![0,1].every(j=>isFinite(got[j]))) return {ok:false, msg:'두 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-2)>0.01) return {ok:false, msg:'두 사람을 줄 세우는 방법은 (가,나) 와 (나,가) — 몇 가지인가요?'};
     if(Math.abs(got[1]-1)>0.01) return {ok:false, msg:'②의 몫은 '+mem.ratio+' 였습니다. 같은가요?'};
     if(pick!==0)
       return {ok:false, msg:'순서 있음 '+mem.P+'가지, 순서 없음 '+mem.C+'가지 — 몫이 '+mem.ratio+' 였습니다. 다시 고르세요.'};
     return {ok:true, msg:'판단했습니다 — <b>나눗셈은 늘 «겹쳐 세어진 배수»를 지우는 동작</b> 입니다. 셋을 뽑으면 (가,나,다) 를 늘어놓는 3! = 6 가지가 한 경우로 뭉치므로 6 으로 나눕니다.'};
   }}""")
 +
 note(100, '내가 바꾸고 · 내가 계산하고 · 내가 판단한다',
 """  {t:'기록 — 행렬의 네 수를 바꾼 뒤 적으세요',
   f:'a = {0} · b = {1} · c = {2} · d = {3}',
   chk(got, r, mem){
     if(!r) return {ok:false, msg:'아직 화면 값이 없습니다.'};
     const m=(String(r[0]).match(/-?\\d+(?:\\.\\d+)?/g)||[]).map(Number);
     if(m.length<4) return {ok:false, msg:'행렬이 읽히지 않습니다 — 화살표 끝을 끌어 보세요.'};
     if(m[0]===1&&m[1]===0&&m[2]===0&&m[3]===1)
       return {ok:false, msg:'아직 아무것도 바꾸지 않았습니다 — 화살표 끝을 끌어 도형을 바꿔 보세요.'};
     if(![0,1,2,3].every(j=>isFinite(got[j]))) return {ok:false, msg:'네 칸을 모두 채우세요.'};
     if([0,1,2,3].some(j=>Math.abs(got[j]-m[j])>0.08))
       return {ok:false, msg:'화면의 행렬은 '+r[0]+' 입니다.'};
     mem.m=m; mem.det=Math.abs(m[0]*m[3]-m[1]*m[2]);
     return {ok:true, msg:'기록했습니다 — 이제 ad − bc 를 직접 구해 봅시다.'};
   }}""",
 """  {t:'생각 — <b>ad − bc</b> 를 직접 계산해 화면의 |det| 와 견주세요',
   f:'a × d = {0} · b × c = {1} · |ad − bc| = {2}',
   chk(got, r, mem){
     if(mem.m===undefined) return {ok:false, msg:'① 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const m=mem.m, det=noteNum(r[2]);
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-m[0]*m[3])>0.08) return {ok:false, msg:'①의 a 와 d 를 곱하세요.'};
     if(Math.abs(got[1]-m[1]*m[2])>0.08) return {ok:false, msg:'①의 b 와 c 를 곱하세요.'};
     if(Math.abs(got[2]-Math.abs(m[0]*m[3]-m[1]*m[2]))>0.08)
       return {ok:false, msg:'두 곱을 빼고 절댓값을 구하세요 — 화면에는 '+r[2]+' 로 나와 있습니다.'};
     mem.ok2=true;
     return {ok:true, msg:'계산했습니다 — 화면의 |det| 와 같습니다. 이 수가 무엇을 뜻할까요?'};
   }}""",
 """  {t:'판단 — <b>|det| 가 1</b> 인데 모양은 달라지는 행렬을 만든 뒤 고르세요',
   f:'그때 a = {0} · d = {1} · |det| = {2}',
   opts:['|det| 는 <b>넓이가 몇 배가 되었는가</b> — 1 이면 모양은 변해도 넓이는 그대로다',
         '|det| 는 도형이 돌아간 각이다',
         '|det| 가 1 이면 도형이 전혀 변하지 않는다'],
   chk(got, r, mem, pick){
     if(!mem.ok2) return {ok:false, msg:'② 칸을 먼저 통과하세요.'};
     if(!r) return {ok:false, msg:'화면을 다시 만져 보세요.'};
     const m=(String(r[0]).match(/-?\\d+(?:\\.\\d+)?/g)||[]).map(Number);
     const det=noteNum(r[2]);
     if(Math.abs(det-1)>0.06)
       return {ok:false, msg:'지금 |det| 가 '+r[2]+' 입니다. 1 이 되도록 네 수를 맞추세요 (예: a=1, b 를 기울이고, c=0, d=1).'};
     if(m[0]===1&&m[1]===0&&m[2]===0&&m[3]===1)
       return {ok:false, msg:'그것은 아무것도 바꾸지 않은 행렬입니다 — 모양이 달라지면서 |det| 가 1 인 것을 찾으세요.'};
     if(![0,1,2].every(j=>isFinite(got[j]))) return {ok:false, msg:'세 칸을 모두 채우세요.'};
     if(Math.abs(got[0]-m[0])>0.08||Math.abs(got[1]-m[3])>0.08)
       return {ok:false, msg:'화면의 행렬은 '+r[0]+' 입니다.'};
     if(Math.abs(got[2]-det)>0.06) return {ok:false, msg:'지금 |det| 는 '+r[2]+' 입니다.'};
     if(pick!==0)
       return {ok:false, msg:'모양은 기울어졌는데 |det| 는 1 입니다. 도형의 넓이는 어떻게 되었나요? 다시 고르세요.'};
     return {ok:true, msg:'판단했습니다 — <b>행렬의 두 열은 (1,0) 과 (0,1) 이 각각 가는 자리</b> 이고, 그 둘이 만드는 평행사변형의 넓이가 |det| 입니다. 그래서 |det| 가 넓이 배율이 되고, 1 이면 밀기(기울이기)처럼 넓이를 보존하는 변환입니다.'};
   }}""")
)


def main(path):
    h = open(path, encoding='utf-8').read()
    if 'LESSON[91]=' in h:
        sys.stdout.write('이미 반영됨\n')
        return
    L = (LESSONS.replace('__V91__', venn91()).replace('__S92__', syn92())
         .replace('__R93__', rem93()).replace('__C94__', cplx94())
         .replace('__V95__', viet95()).replace('__B96__', cubic96())
         .replace('__Q97__', ineq97()).replace('__L98__', lp98())
         .replace('__P99__', perm99()).replace('__M100__', mat100()))
    a = 'LESSON[356]={'
    assert h.count(a) == 1
    h = h.replace(a, L + a, 1)
    b = '\n};\n\nfunction labNo(spec)'
    assert h.count(b) == 1
    h = h.replace(b, NOTES + b, 1)
    open(path, 'w', encoding='utf-8').write(h)
    sys.stdout.write('LAB 91~100 ok %.2f MB\n' % (len(h.encode('utf-8')) / 1048576))


if __name__ == '__main__':
    main(sys.argv[1])
