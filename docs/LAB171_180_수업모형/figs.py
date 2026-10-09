# -*- coding: utf-8 -*-
"""LAB 171~180 「오늘의 문제」 그림 — 좌표를 계산해서 그린다."""
import math
from math import sqrt, hypot, cos, sin, pi, e, log, exp

HALO = ' paint-order="stroke" stroke="#fff" stroke-width="3.2" stroke-linejoin="round"'


def curve(f, x0, x1, X, Y, lo=18.0, hi=158.0, n=240):
    segs, cur = [], []
    for i in range(n + 1):
        x = x0 + (x1 - x0) * i / n
        try:
            y = Y(f(x))
        except (ZeroDivisionError, ValueError):
            if cur:
                segs.append(' '.join(cur)); cur = []
            continue
        if lo <= y <= hi:
            cur.append('%s%.1f %.1f' % ('M' if not cur else 'L', X(x), y))
        elif cur:
            segs.append(' '.join(cur)); cur = []
    if cur:
        segs.append(' '.join(cur))
    return ' '.join(segs)


def cap(t):
    return '<text x="200" y="16" font-size="10.5" fill="#6B7280" text-anchor="middle"%s>%s</text>' % (HALO, t)


# ── 171 · 편대의 자리를 정하라 ─────────────────────────────────────
def pv171():
    A, B = (-4.0, -2.0), (4.0, 3.0)
    m, n = 2.0, 1.0
    P = ((n * A[0] + m * B[0]) / (m + n), (n * A[1] + m * B[1]) / (m + n))
    ap, pb = hypot(P[0] - A[0], P[1] - A[1]), hypot(B[0] - P[0], B[1] - P[1])
    assert abs(ap / pb - m / n) < 1e-9
    assert abs(P[0] - 4.0 / 3) < 1e-9 and abs(P[1] - 4.0 / 3) < 1e-9

    X = lambda x: 200 + 32.0 * x
    Y = lambda y: 90 - 22.0 * y
    out = ['<path d="M%.1f %.1f L%.1f %.1f" stroke="#9CA3AF" stroke-width="1.6"/>'
           % (X(A[0]), Y(A[1]), X(B[0]), Y(B[1]))]
    out.append('<path d="M%.1f %.1f L%.1f %.1f" stroke="#2563EB" stroke-width="3"/>'
               % (X(A[0]), Y(A[1]), X(P[0]), Y(P[1])))
    out.append('<path d="M%.1f %.1f L%.1f %.1f" stroke="#0E9384" stroke-width="3"/>'
               % (X(P[0]), Y(P[1]), X(B[0]), Y(B[1])))
    for q, nm, col in ((A, 'A (−4, −2)', '#111827'), (B, 'B (4, 3)', '#111827')):
        out.append('<circle cx="%.1f" cy="%.1f" r="4.6" fill="%s"/>' % (X(q[0]), Y(q[1]), col))
        out.append('<text x="%.1f" y="%.1f" font-size="10" font-weight="800" fill="#374151" text-anchor="middle"%s>%s</text>'
                   % (X(q[0]), Y(q[1]) + (18 if q is A else -9), HALO, nm))
    out.append('<circle cx="%.1f" cy="%.1f" r="5.4" fill="#BE123C"/>' % (X(P[0]), Y(P[1])))
    out.append('<text x="%.1f" y="%.1f" font-size="10.5" font-weight="800" fill="#BE123C"%s>P (%.2f, %.2f)</text>'
               % (X(P[0]) + 9, Y(P[1]) + 4, HALO, P[0], P[1]))
    out.append('<text x="%.1f" y="%.1f" font-size="10" font-weight="800" fill="#1D4ED8" text-anchor="middle"%s>%g</text>'
               % ((X(A[0]) + X(P[0])) / 2, (Y(A[1]) + Y(P[1])) / 2 + 16, HALO, m))
    out.append('<text x="%.1f" y="%.1f" font-size="10" font-weight="800" fill="#0B6E63" text-anchor="middle"%s>%g</text>'
               % ((X(P[0]) + X(B[0])) / 2, (Y(P[1]) + Y(B[1])) / 2 + 16, HALO, n))
    out.append('<text x="364" y="40" font-size="10.5" font-weight="800" fill="#BE123C" text-anchor="end"%s>'
               'AP : PB = %.2f : %.2f = %g : %g</text>' % (HALO, ap, pb, m, n))
    out.append('<text x="364" y="56" font-size="10" fill="#6B7280" text-anchor="end"%s>'
               'P = (nA + mB) ÷ (m + n)</text>' % HALO)
    out.append(cap('두 드론 사이를 %g : %g 로 나누는 자리는 어디일까' % (m, n)))
    return ''.join(out)


# ── 172 · 끝없이 가면 어디로 ───────────────────────────────────────
def sl172():
    f = lambda k: (2 * k + 1) / (k + 3.0)
    L = 2.0
    assert abs(f(1000) - L) < 0.006 and f(1) < f(2) < f(3)

    N = 28
    X = lambda k: 54 + 300.0 * (k - 1) / (N - 1)
    Y = lambda v: 140 - 46.0 * v
    out = ['<path d="M46 %g H366" stroke="#9CA3AF" stroke-width="1.2"/>' % Y(0)]
    out.append('<path d="M46 %.1f H366" stroke="#BE123C" stroke-width="1.6" stroke-dasharray="5 4"/>' % Y(L))
    out.append('<text x="364" y="%.1f" font-size="10.5" font-weight="800" fill="#BE123C" text-anchor="end"%s>극한 %g</text>'
               % (Y(L) - 6, HALO, L))
    for k in range(1, N + 1):
        out.append('<circle cx="%.1f" cy="%.1f" r="3.4" fill="#2563EB" opacity=".75"/>' % (X(k), Y(f(k))))
    for k in (1, 3, 10):
        out.append('<text x="%.1f" y="%.1f" font-size="9.5" fill="#1D4ED8" text-anchor="middle"%s>%.3f</text>'
                   % (X(k), Y(f(k)) + 15, HALO, f(k)))
    out.append('<text x="54" y="156" font-size="10" fill="#6B7280"%s>n →</text>' % HALO)
    out.append('<text x="364" y="156" font-size="10" fill="#6B7280" text-anchor="end"%s>'
               'n = 1000 이면 %.4f — 2 에 닿지는 않는다</text>' % (HALO, f(1000)))
    out.append(cap('항을 끝없이 늘어놓으면 어디로 모일까 — 닿기는 할까'))
    return ''.join(out)


# ── 173 · 공비 하나가 운명을 가른다 ────────────────────────────────
def gc173():
    rs = ((0.8, '#0E9384', '0 으로 수렴'), (-0.9, '#2563EB', '0 으로 수렴 (오가며)'),
          (1.0, '#B45309', '1 로 수렴'), (1.15, '#BE123C', '발산'))
    for r, _, _ in rs:
        v = r ** 60
        assert (abs(r) < 1) == (abs(v) < 0.01), (r, v)   # |r| < 1 이면 충분히 가면 0 으로 간다

    N = 22
    X = lambda k: 56 + 290.0 * k / N
    Y = lambda v: 96 - 42.0 * max(-1.6, min(1.6, v))
    out = ['<path d="M48 %g H364" stroke="#9CA3AF" stroke-width="1.2"/>' % Y(0)]
    for i, (r, col, nm) in enumerate(rs):
        pts = []
        for k in range(N + 1):
            v = r ** k
            if abs(v) > 1.6:
                break
            pts.append('%s%.1f %.1f' % ('M' if not pts else 'L', X(k), Y(v)))
        out.append('<path d="%s" stroke="%s" stroke-width="2" fill="none"/>' % (' '.join(pts), col))
        out.append('<text x="364" y="%d" font-size="10" font-weight="800" fill="%s" text-anchor="end"%s>'
                   'r = %.2f → %s</text>' % (36 + i * 16, col, HALO, r, nm))
    out.append('<text x="56" y="152" font-size="10" fill="#6B7280"%s>n →</text>' % HALO)
    out.append('<text x="364" y="152" font-size="10" font-weight="800" fill="#111827" text-anchor="end"%s>'
               '갈림목은 |r| = 1</text>' % HALO)
    out.append(cap('공비를 조금만 바꿨을 뿐인데 운명이 갈린다'))
    return ''.join(out)


# ── 174 · 무한히 더하면 어디로 ─────────────────────────────────────
def sp174():
    N = 24
    geo = [sum(0.5 ** k for k in range(1, i + 1)) for i in range(1, N + 1)]
    har = [sum(1.0 / k for k in range(1, i + 1)) for i in range(1, N + 1)]
    assert abs(geo[-1] - 1) < 1e-6 and har[-1] > 3.7

    X = lambda i: 56 + 290.0 * (i - 1) / (N - 1)
    Y = lambda v: 140 - 26.0 * v
    out = ['<path d="M48 %g H366" stroke="#9CA3AF" stroke-width="1.2"/>' % Y(0)]
    out.append('<path d="M48 %.1f H366" stroke="#0E9384" stroke-width="1.4" stroke-dasharray="5 4"/>' % Y(1.0))
    for vals, col in ((geo, '#0E9384'), (har, '#BE123C')):
        out.append('<path d="%s" stroke="%s" stroke-width="2.2" fill="none"/>'
                   % (' '.join('%s%.1f %.1f' % ('M' if i == 0 else 'L', X(i + 1), Y(v))
                               for i, v in enumerate(vals) if Y(v) > 20), col))
    out.append('<text x="364" y="40" font-size="10.5" font-weight="800" fill="#0B6E63" text-anchor="end"%s>'
               '1/2 + 1/4 + 1/8 + … → %g (수렴)</text>' % (HALO, 1))
    out.append('<text x="364" y="56" font-size="10.5" font-weight="800" fill="#BE123C" text-anchor="end"%s>'
               '1 + 1/2 + 1/3 + … → 끝없이 커짐 (발산)</text>' % HALO)
    out.append('<text x="364" y="72" font-size="10" fill="#6B7280" text-anchor="end"%s>'
               '%d항까지 %.3f 대 %.3f</text>' % (HALO, N, geo[-1], har[-1]))
    out.append('<text x="56" y="156" font-size="10" fill="#6B7280"%s>더한 항의 수 →</text>' % HALO)
    out.append(cap('항이 모두 0 으로 가는데도 합은 끝없이 커질 수 있을까'))
    return ''.join(out)


# ── 175 · 0.999… 는 1인가 ──────────────────────────────────────────
def rd175():
    a, r = 0.9, 0.1
    S = [a * (1 - r ** n) / (1 - r) for n in range(1, 7)]
    assert abs(S[-1] - 0.999999) < 1e-9 and abs(a / (1 - r) - 1.0) < 1e-12

    X = lambda v: 52 + 300.0 * v
    out = ['<path d="M%.1f 118 H%.1f" stroke="#9CA3AF" stroke-width="1.4"/>' % (X(0), X(1.04))]
    out.append('<path d="M%.1f 110 V126" stroke="#BE123C" stroke-width="2"/>' % X(1.0))
    out.append('<text x="%.1f" y="140" font-size="10.5" font-weight="800" fill="#BE123C" text-anchor="middle"%s>1</text>'
               % (X(1.0), HALO))
    out.append('<text x="%.1f" y="140" font-size="10" fill="#6B7280" text-anchor="middle"%s>0</text>' % (X(0), HALO))
    for i, s in enumerate(S):
        y = 40 + i * 12
        out.append('<path d="M%.1f %.1f H%.1f" stroke="#2563EB" stroke-width="3" opacity=".55" stroke-linecap="round"/>'
                   % (X(0), y, X(s)))
        out.append('<text x="%.1f" y="%.1f" font-size="9" fill="#1D4ED8"%s>%s</text>'
                   % (X(s) + 5, y + 3, HALO, ('0.' + '9' * (i + 1))))
    out.append('<text x="364" y="%.1f" font-size="10" font-weight="800" fill="#111827" text-anchor="end"%s>'
               '남은 틈 = 10⁻ⁿ → 0</text>' % (40 + len(S) * 12 + 6, HALO))
    out.append('<text x="200" y="158" font-size="10" fill="#6B7280" text-anchor="middle"%s>'
               '첫 항 0.9 · 공비 0.1 의 무한등비급수 합 = 0.9 ÷ (1 − 0.1) = 1</text>' % HALO)
    out.append(cap('9 를 아무리 붙여도 1 보다 작다 — 그런데 「…」 을 붙이면'))
    return ''.join(out)


# ── 176 · 왜 라디안을 쓰는가 ───────────────────────────────────────
def sn176():
    xs = (0.5, 0.2, 0.05, 0.01)
    rad = [sin(x) / x for x in xs]
    deg = [sin(x) / (x * 180 / pi) for x in xs]
    assert rad[-1] > 0.9999 and abs(deg[-1] - pi / 180) < 1e-6

    cx, cy, R = 120.0, 128.0, 86.0
    th = 0.62
    out = ['<path d="M%.1f %.1f A%.1f %.1f 0 0 0 %.1f %.1f" stroke="#C7D2E4" stroke-width="1.6" fill="none"/>'
           % (cx + R, cy, R, R, cx + R * cos(1.1), cy - R * sin(1.1))]
    out.append('<path d="M%.1f %.1f H%.1f" stroke="#9CA3AF" stroke-width="1.2"/>' % (cx, cy, cx + R + 14))
    out.append('<path d="M%.1f %.1f L%.1f %.1f" stroke="#9CA3AF" stroke-width="1.2"/>'
               % (cx, cy, cx + (R + 14) * cos(th), cy - (R + 14) * sin(th)))
    px, py = cx + R * cos(th), cy - R * sin(th)
    out.append('<path d="M%.1f %.1f V%.1f" stroke="#BE123C" stroke-width="2.6"/>' % (px, py, cy))
    arc = ['M%.1f %.1f' % (cx + R, cy)]
    for i in range(1, 33):
        t = th * i / 32
        arc.append('L%.1f %.1f' % (cx + R * cos(t), cy - R * sin(t)))
    out.append('<path d="%s" stroke="#0E9384" stroke-width="2.8" fill="none"/>' % ' '.join(arc))
    out.append('<text x="%.1f" y="%.1f" font-size="10" font-weight="800" fill="#BE123C"%s>sin x</text>'
               % (px + 6, (py + cy) / 2, HALO))
    out.append('<text x="%.1f" y="%.1f" font-size="10" font-weight="800" fill="#0B6E63"%s>호 x</text>'
               % (cx + (R + 6) * cos(th / 2) - 4, cy - (R + 6) * sin(th / 2) - 6, HALO))
    out.append('<text x="364" y="38" font-size="10" fill="#6B7280" text-anchor="end"%s>x 가 작아질수록 호와 현이 포개진다</text>' % HALO)
    for i, x in enumerate(xs):
        out.append('<text x="364" y="%d" font-size="10" font-weight="800" fill="#1D4ED8" text-anchor="end"%s>'
                   'x = %.2f → 라디안 %.5f · 도 %.5f</text>' % (56 + i * 17, HALO, x, rad[i], deg[i]))
    out.append('<text x="364" y="140" font-size="10" font-weight="800" fill="#BE123C" text-anchor="end"%s>'
               '도로 재면 π/180 = %.5f 로 간다</text>' % (HALO, pi / 180))
    out.append(cap('같은 각인데 단위만 바꾸면 극한이 달라진다 — 왜'))
    return ''.join(out)


# ── 177 · 미분해도 그대로인 함수 ───────────────────────────────────
def ed177():
    aa = (2.0, e, 3.0)
    at0 = [log(a) for a in aa]                 # x = 0 에서의 기울기 = ln a
    assert abs(at0[1] - 1.0) < 1e-12 and at0[0] < 1 < at0[2]

    X = lambda x: 200 + 54.0 * x
    Y = lambda v: 136 - 26.0 * v
    out = ['<path d="M44 %g H364 M%.1f 144 V26" stroke="#9CA3AF" stroke-width="1.2"/>' % (Y(0), X(0))]
    for i, a in enumerate(aa):
        col = ('#0E9384', '#BE123C', '#2563EB')[i]
        out.append('<path d="%s" stroke="%s" stroke-width="%s" fill="none"/>'
                   % (curve(lambda x, a=a: a ** x, -2.6, 1.7, X, Y, 22, 142), col, '2.8' if i == 1 else '2'))
        s = at0[i]
        out.append('<path d="M%.1f %.1f L%.1f %.1f" stroke="%s" stroke-width="1.4" stroke-dasharray="4 3"/>'
                   % (X(-1.1), Y(1 - 1.1 * s), X(1.1), Y(1 + 1.1 * s), col))
        out.append('<text x="364" y="%d" font-size="10.5" font-weight="800" fill="%s" text-anchor="end"%s>'
                   'a = %.4f → x = 0 에서 기울기 %.4f</text>' % (38 + i * 17, col, HALO, a, s))
    out.append('<circle cx="%.1f" cy="%.1f" r="4.4" fill="#111827"/>' % (X(0), Y(1)))
    out.append('<text x="%.1f" y="%.1f" font-size="10" fill="#374151"%s>(0, 1)</text>' % (X(0) + 7, Y(1) + 14, HALO))
    out.append('<text x="200" y="158" font-size="10" fill="#6B7280" text-anchor="middle"%s>'
               'y = aˣ 의 x = 0 에서의 기울기는 ln a — 그것이 1 이 되는 a 가 e</text>' % HALO)
    out.append(cap('미분했는데 자기 자신이 나오는 함수가 있을까'))
    return ''.join(out)


# ── 178 · 네 번 미분하면 제자리 ────────────────────────────────────
def td178():
    names = ('sin x', 'cos x', '−sin x', '−cos x', 'sin x')
    fs = [lambda x, n=n: sin(x + n * pi / 2) for n in range(5)]
    for x in (0.3, 1.1, 2.4):
        assert abs(fs[0](x) - fs[4](x)) < 1e-12
        assert abs(fs[1](x) - cos(x)) < 1e-12

    out = []
    for i in range(4):
        ox = 14 + i * 96
        X = lambda t, ox=ox: ox + 13.6 * t
        Y = lambda v: 92 - 26.0 * v
        out.append('<rect x="%d" y="30" width="88" height="104" rx="8" fill="#fff" stroke="#E5E7EB" stroke-width="1.1"/>' % ox)
        out.append('<path d="M%d %g H%d" stroke="#C7D2E4" stroke-width="1"/>' % (ox + 4, Y(0), ox + 84))
        col = ('#2563EB', '#0E9384', '#B45309', '#BE123C')[i]
        out.append('<path d="%s" stroke="%s" stroke-width="2.2" fill="none"/>'
                   % (curve(fs[i], 0, 2 * pi, X, Y, 32, 132), col))
        out.append('<text x="%d" y="44" font-size="10.5" font-weight="800" fill="%s" text-anchor="middle"%s>%s</text>'
                   % (ox + 44, col, HALO, names[i + 1] if i < 4 else names[0]))
        out.append('<text x="%d" y="146" font-size="9.5" fill="#6B7280" text-anchor="middle"%s>%d번 미분</text>'
                   % (ox + 44, HALO, i + 1))
        if i < 3:
            out.append('<text x="%d" y="92" font-size="13" fill="#9CA3AF" text-anchor="middle">→</text>' % (ox + 92))
    out.append('<text x="200" y="160" font-size="10" font-weight="800" fill="#111827" text-anchor="middle"%s>'
               '네 번 미분하면 sin x 로 돌아온다 — 90° 씩 밀리기 때문</text>' % HALO)
    out.append(cap('미분을 네 번 하면 처음 그 함수로 돌아온다'))
    return ''.join(out)


# ── 179 · 사슬처럼 이어 붙이기 ─────────────────────────────────────
def cr179():
    k = 3.0
    at0 = k * cos(0)
    assert abs(at0 - 3.0) < 1e-12
    num = (sin(k * 1e-5) - sin(-k * 1e-5)) / 2e-5        # 수치미분으로 검산
    assert abs(num - at0) < 1e-6, num

    X = lambda x: 56 + 94.0 * x
    Y = lambda v: 92 - 17.0 * v
    out = ['<path d="M48 %g H364 M%.1f 150 V26" stroke="#9CA3AF" stroke-width="1.2"/>' % (Y(0), X(0))]
    out.append('<path d="%s" stroke="#2563EB" stroke-width="2.4" fill="none"/>'
               % curve(lambda x: sin(k * x), 0, 3.2, X, Y, 22, 146))
    out.append('<path d="%s" stroke="#BE123C" stroke-width="2" fill="none" stroke-dasharray="5 4"/>'
               % curve(lambda x: k * cos(k * x), 0, 3.2, X, Y, 22, 146))
    out.append('<path d="M%.1f %.1f L%.1f %.1f" stroke="#0E9384" stroke-width="1.8"/>'
               % (X(0), Y(0), X(0.5), Y(0.5 * at0)))
    out.append('<circle cx="%.1f" cy="%.1f" r="4.2" fill="#111827"/>' % (X(0), Y(0)))
    out.append('<text x="364" y="38" font-size="10.5" font-weight="800" fill="#1D4ED8" text-anchor="end"%s>'
               'y = sin(%gx)</text>' % (HALO, k))
    out.append('<text x="364" y="54" font-size="10.5" font-weight="800" fill="#BE123C" text-anchor="end"%s>'
               'y′ = %g·cos(%gx) — 높이가 %g배</text>' % (HALO, k, k, k))
    out.append('<text x="364" y="70" font-size="10" font-weight="800" fill="#0B6E63" text-anchor="end"%s>'
               'x = 0 에서 기울기 %g</text>' % (HALO, at0))
    out.append('<text x="200" y="160" font-size="10" fill="#6B7280" text-anchor="middle"%s>'
               '안쪽이 %g배 빨라지면 기울기도 %g배 — 바깥 미분 × 안쪽 미분</text>' % (HALO, k, k))
    out.append(cap('안쪽 함수를 빠르게 하면 기울기는 몇 배가 될까'))
    return ''.join(out)


# ── 180 · y 로 풀 수 없어도 ────────────────────────────────────────
def im180():
    R = 2.0
    t = pi / 4
    x, y = R * cos(t), R * sin(t)
    sl = -x / y
    assert abs(sl + 1.0) < 1e-12 and abs(x * x + y * y - R * R) < 1e-12

    X = lambda u: 110 + 30.0 * u
    Y = lambda v: 92 - 30.0 * v
    out = ['<circle cx="%.1f" cy="%.1f" r="%.1f" fill="#2563EB" fill-opacity=".07" stroke="#1D4ED8" stroke-width="2"/>'
           % (X(0), Y(0), 30.0 * R)]
    out.append('<path d="M%.1f %.1f H%.1f M%.1f %.1f V%.1f" stroke="#9CA3AF" stroke-width="1.1"/>'
               % (X(-2.7), Y(0), X(2.7), X(0), Y(-2.1), Y(2.1)))
    L = 1.5
    out.append('<path d="M%.1f %.1f L%.1f %.1f" stroke="#BE123C" stroke-width="2.4"/>'
               % (X(x - L), Y(y - L * sl), X(x + L), Y(y + L * sl)))
    out.append('<path d="M%.1f %.1f L%.1f %.1f" stroke="#0E9384" stroke-width="1.6" stroke-dasharray="4 3"/>'
               % (X(0), Y(0), X(x), Y(y)))
    out.append('<circle cx="%.1f" cy="%.1f" r="4.6" fill="#BE123C"/>' % (X(x), Y(y)))
    out.append('<text x="%.1f" y="%.1f" font-size="10" font-weight="800" fill="#BE123C"%s>P (%.2f, %.2f)</text>'
               % (X(x) + 8, Y(y) - 6, HALO, x, y))
    out.append('<text x="364" y="40" font-size="10.5" font-weight="800" fill="#111827" text-anchor="end"%s>'
               'x² + y² = %g 를 x 로 미분</text>' % (HALO, R * R))
    out.append('<text x="364" y="56" font-size="10" fill="#6B7280" text-anchor="end"%s>'
               '2x + 2y·y′ = 0 → y′ = −x/y</text>' % HALO)
    out.append('<text x="364" y="72" font-size="10.5" font-weight="800" fill="#BE123C" text-anchor="end"%s>'
               'P 에서 y′ = −%.2f ÷ %.2f = %g</text>' % (HALO, x, y, sl))
    out.append('<text x="364" y="88" font-size="10" fill="#0B6E63" text-anchor="end"%s>'
               '반지름과 접선이 수직 — 기울기의 곱이 −1</text>' % HALO)
    out.append(cap('y = … 꼴로 못 풀어도 기울기를 구할 수 있을까'))
    return ''.join(out)


FNS = [('pv171', pv171), ('sl172', sl172), ('gc173', gc173), ('sp174', sp174), ('rd175', rd175),
       ('sn176', sn176), ('ed177', ed177), ('td178', td178), ('cr179', cr179), ('im180', im180)]

if __name__ == '__main__':
    import sys
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass
    for nm, f in FNS:
        sys.stdout.write('%-7s %5d자  ok\n' % (nm, len(f())))
