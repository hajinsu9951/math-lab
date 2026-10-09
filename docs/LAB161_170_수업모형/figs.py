# -*- coding: utf-8 -*-
"""LAB 161~170 「오늘의 문제」 그림 — 좌표를 계산해서 그린다."""
import math
from math import sqrt, hypot, cos, sin, tan, radians, degrees, acos, pi

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


def arrow(x1, y1, x2, y2, col, w=2.2, head=7.0):
    """화살표 하나 — 머리 길이를 선 길이에 맞춰 줄인다."""
    dx, dy = x2 - x1, y2 - y1
    L = hypot(dx, dy)
    if L < 1e-6:
        return ''
    hl = min(head, L * 0.45)
    ux, uy = dx / L, dy / L
    bx, by = x2 - ux * hl, y2 - uy * hl
    px, py = -uy * hl * 0.48, ux * hl * 0.48
    return ('<path d="M%.1f %.1f L%.1f %.1f" stroke="%s" stroke-width="%s" stroke-linecap="round"/>'
            '<path d="M%.1f %.1f L%.1f %.1f L%.1f %.1f Z" fill="%s"/>'
            % (x1, y1, bx, by, col, w, x2, y2, bx + px, by + py, bx - px, by - py, col))


# ── 161 · 스치듯 닿는 순간 ─────────────────────────────────────────
def tc161():
    r, m = 2.0, 1.0
    k_tan = r * sqrt(1 + m * m)
    assert abs(k_tan - 2 * sqrt(2)) < 1e-12
    cases = ((1.2, '두 점에서 만난다', '#2563EB'), (k_tan, '스치듯 한 점 — 접선', '#BE123C'),
             (4.2, '만나지 않는다', '#9CA3AF'))
    for k, _, _ in cases:
        A, B, C = 1 + m * m, 2 * m * k, k * k - r * r
        D = B * B - 4 * A * C
        d = abs(k) / sqrt(1 + m * m)
        assert (D > 0.01) == (d < r - 0.01), (k, D, d)

    X = lambda x: 128 + 24.0 * x
    Y = lambda y: 92 - 24.0 * y
    out = ['<circle cx="%.1f" cy="%.1f" r="%.1f" fill="#2563EB" fill-opacity=".07" stroke="#1D4ED8" stroke-width="2"/>'
           % (X(0), Y(0), 24.0 * r)]
    out.append('<circle cx="%.1f" cy="%.1f" r="3.4" fill="#111827"/>' % (X(0), Y(0)))
    out.append('<text x="%.1f" y="%.1f" font-size="10" fill="#374151"%s>O</text>' % (X(0) + 6, Y(0) + 13, HALO))
    for i, (k, nm, col) in enumerate(cases):
        out.append('<path d="%s" stroke="%s" stroke-width="2.2" fill="none" stroke-linecap="round"/>'
                   % (curve(lambda x, k=k: m * x + k, -3.2, 3.2, X, Y, 20, 150), col))
        out.append('<text x="364" y="%d" font-size="10" font-weight="800" fill="%s" text-anchor="end"%s>'
                   'k = %.2f · 중심까지 %.2f — %s</text>'
                   % (40 + i * 17, col, HALO, k, abs(k) / sqrt(1 + m * m), nm))
    out.append('<text x="%.1f" y="152" font-size="10" fill="#6B7280" text-anchor="middle"%s>'
               '반지름 %g · 중심까지의 거리가 %g 과 같아지는 순간</text>' % (X(0), HALO, r, r))
    out.append(cap('직선을 평행하게 밀면 — 어느 순간 딱 한 번 스친다'))
    return ''.join(out)


# ── 162 · 물살을 거슬러 어디로 향할까 ──────────────────────────────
def va162():
    v, c, ang = 5.0, 3.0, 90.0
    bx, by = v * cos(radians(ang)), v * sin(radians(ang))
    rx, ry = bx + c, by
    assert abs(hypot(rx, ry) - sqrt(34)) < 1e-9
    W = 8.0
    t = W / ry
    drift = rx * t
    assert abs(drift - 4.8) < 1e-9

    X = lambda x: 70 + 17.0 * x
    Y = lambda y: 146 - 13.0 * y
    out = ['<rect x="%.1f" y="%.1f" width="%.1f" height="%.1f" fill="#2563EB" opacity=".07"/>'
           % (X(-1), Y(W), 17.0 * 13, 13.0 * W)]
    out.append('<path d="M%.1f %.1f H%.1f" stroke="#9CA3AF" stroke-width="1.2"/>' % (X(-1), Y(0), X(12)))
    out.append('<path d="M%.1f %.1f H%.1f" stroke="#9CA3AF" stroke-width="1.2"/>' % (X(-1), Y(W), X(12)))
    out.append(arrow(X(0), Y(0), X(bx), Y(by), '#2563EB'))
    out.append(arrow(X(0), Y(0), X(c), Y(0), '#0E9384'))
    out.append(arrow(X(0), Y(0), X(rx), Y(ry), '#BE123C', 2.6))
    out.append('<path d="M%.1f %.1f L%.1f %.1f M%.1f %.1f L%.1f %.1f" stroke="#9CA3AF" stroke-width="1" stroke-dasharray="3 3"/>'
               % (X(bx), Y(by), X(rx), Y(ry), X(c), Y(0), X(rx), Y(ry)))
    out.append('<circle cx="%.1f" cy="%.1f" r="4.6" fill="#BE123C"/>' % (X(drift), Y(W)))
    out.append('<text x="%.1f" y="%.1f" font-size="10" font-weight="800" fill="#1D4ED8" text-anchor="end"%s>뱃머리 %g</text>'
               % (X(bx) - 6, Y(by / 2), HALO, v))
    out.append('<text x="%.1f" y="%.1f" font-size="10" font-weight="800" fill="#0B6E63"%s>물살 %g</text>'
               % (X(c / 2) - 4, Y(0) + 15, HALO, c))
    out.append('<text x="%.1f" y="%.1f" font-size="10" font-weight="800" fill="#BE123C"%s>실제 %.2f</text>'
               % (X(rx) + 6, Y(ry / 2), HALO, hypot(rx, ry)))
    out.append('<text x="%.1f" y="%.1f" font-size="10" font-weight="800" fill="#BE123C" text-anchor="middle"%s>'
               '%.1f m 떠내려감</text>' % (X(drift), Y(W) - 10, HALO, drift))
    out.append('<text x="%.1f" y="%.1f" font-size="9.5" fill="#6B7280"%s>강폭 %g m</text>' % (X(-0.6), Y(W / 2), HALO, W))
    out.append(cap('뱃머리를 건너편으로 똑바로 두었는데 왜 비스듬히 닿을까'))
    return ''.join(out)


# ── 163 · 나란한지 어떻게 아나 ─────────────────────────────────────
def vs163():
    a = (2.0, 1.0)
    cases = ((1.8, (3.6, 1.8), True), (None, (3.0, 2.5), False))
    for k, b, par in cases:
        cross = a[0] * b[1] - a[1] * b[0]
        assert (abs(cross) < 1e-9) == par, (b, cross)

    X = lambda x: 72 + 34.0 * x
    Y = lambda y: 128 - 34.0 * y
    out = ['<path d="M64 %g H364 M72 136 V26" stroke="#9CA3AF" stroke-width="1.2"/>' % Y(0)]
    out.append(arrow(X(0), Y(0), X(a[0]), Y(a[1]), '#111827', 2.6))
    out.append('<text x="%.1f" y="%.1f" font-size="10.5" font-weight="800" fill="#111827"%s>a (2, 1)</text>'
               % (X(a[0]) - 4, Y(a[1]) + 16, HALO))
    k, b, _ = cases[0]
    out.append(arrow(X(0), Y(0), X(b[0]), Y(b[1]), '#0E9384', 2.4))
    out.append('<text x="%.1f" y="%.1f" font-size="10" font-weight="800" fill="#0B6E63"%s>%g·a — 나란하다</text>'
               % (X(b[0]) + 6, Y(b[1]) + 4, HALO, k))
    b2 = cases[1][1]
    out.append(arrow(X(0), Y(0), X(b2[0]), Y(b2[1]), '#BE123C', 2.4))
    out.append('<text x="%.1f" y="%.1f" font-size="10" font-weight="800" fill="#BE123C"%s>b — 아니다</text>'
               % (X(b2[0]) + 6, Y(b2[1]) - 4, HALO))
    out.append('<text x="364" y="148" font-size="10" fill="#6B7280" text-anchor="end"%s>'
               '가위곱 2·%g − 1·%g = %g (나란함) · 2·%g − 1·%g = %g</text>'
               % (HALO, cases[0][1][1], cases[0][1][0], a[0] * cases[0][1][1] - a[1] * cases[0][1][0],
                  b2[1], b2[0], a[0] * b2[1] - a[1] * b2[0]))
    out.append(cap('두 화살표가 나란한지 — 눈이 아니라 수로 가릴 수 있을까'))
    return ''.join(out)


# ── 164 · 두 도로는 몇 도로 만날까 ─────────────────────────────────
def da164():
    a, b = (3.0, 4.0), (4.0, 3.0)
    dot = a[0] * b[0] + a[1] * b[1]
    la, lb = hypot(*a), hypot(*b)
    cs = dot / (la * lb)
    th = degrees(acos(cs))
    assert dot == 24 and la == 5 and lb == 5
    assert abs(cs - 0.96) < 1e-12 and abs(th - 16.26) < 0.02, th

    X = lambda x: 86 + 30.0 * x
    Y = lambda y: 134 - 24.0 * y
    out = ['<path d="M78 %g H364 M86 142 V28" stroke="#9CA3AF" stroke-width="1.2"/>' % Y(0)]
    out.append(arrow(X(0), Y(0), X(a[0]), Y(a[1]), '#2563EB', 2.6))
    out.append(arrow(X(0), Y(0), X(b[0]), Y(b[1]), '#0E9384', 2.6))
    # 사잇각 호
    rr = 34.0
    pts = []
    a0, a1 = math.atan2(a[1], a[0]), math.atan2(b[1], b[0])
    for i in range(25):
        t = a1 + (a0 - a1) * i / 24
        pts.append('%s%.1f %.1f' % ('M' if i == 0 else 'L', X(0) + rr * cos(t), Y(0) - rr * sin(t)))
    out.append('<path d="%s" stroke="#BE123C" stroke-width="1.6" fill="none"/>' % ' '.join(pts))
    tm = (a0 + a1) / 2
    out.append('<text x="%.1f" y="%.1f" font-size="10" font-weight="800" fill="#BE123C"%s>%.1f°</text>'
               % (X(0) + (rr + 10) * cos(tm), Y(0) - (rr + 10) * sin(tm) + 4, HALO, th))
    out.append('<text x="%.1f" y="%.1f" font-size="10" font-weight="800" fill="#1D4ED8"%s>a (3, 4)</text>'
               % (X(a[0]) + 6, Y(a[1]), HALO))
    out.append('<text x="%.1f" y="%.1f" font-size="10" font-weight="800" fill="#0B6E63"%s>b (4, 3)</text>'
               % (X(b[0]) + 6, Y(b[1]) + 18, HALO))
    out.append('<text x="364" y="44" font-size="10.5" font-weight="800" fill="#111827" text-anchor="end"%s>'
               'a·b = 3·4 + 4·3 = %g</text>' % (HALO, dot))
    out.append('<text x="364" y="60" font-size="10" fill="#6B7280" text-anchor="end"%s>'
               'cos θ = %g ÷ (%g × %g) = %.2f</text>' % (HALO, dot, la, lb, cs))
    out.append(cap('두 길이 몇 도로 만나는지 — 각도기 없이 잴 수 있을까'))
    return ''.join(out)


# ── 165 · 비스듬한 그림자는 얼마나 짧아질까 ────────────────────────
def pl165():
    L = 6.0
    angs = (0, 30, 60, 90)
    sh = [L * cos(radians(d)) for d in angs]
    assert abs(sh[0] - L) < 1e-12 and abs(sh[3]) < 1e-12 and abs(sh[2] - L / 2) < 1e-12

    S = 34.0
    base = 126.0
    out = ['<path d="M28 %g H372" stroke="#9CA3AF" stroke-width="1.4"/>' % base]
    for i, d in enumerate(angs):
        ox = 44 + i * 86
        tx, ty = ox + S * cos(radians(d)), base - S * sin(radians(d))
        out.append('<path d="M%.1f %.1f L%.1f %.1f" stroke="#2563EB" stroke-width="3" stroke-linecap="round"/>'
                   % (ox, base, tx, ty))
        out.append('<path d="M%.1f %.1f H%.1f" stroke="#BE123C" stroke-width="3.4" stroke-linecap="round"/>'
                   % (ox, base + 9, ox + S * cos(radians(d))))
        if d not in (0, 90):
            out.append('<path d="M%.1f %.1f V%.1f" stroke="#9CA3AF" stroke-width="1" stroke-dasharray="3 3"/>'
                       % (tx, ty, base))
        out.append('<text x="%.1f" y="%d" font-size="10" font-weight="800" fill="#1D4ED8" text-anchor="middle"%s>%d°</text>'
                   % (ox + 16, 44, HALO, d))
        out.append('<text x="%.1f" y="%d" font-size="10" font-weight="800" fill="#BE123C" text-anchor="middle"%s>%.2f</text>'
                   % (ox + 16, base + 26, HALO, sh[i]))
        out.append('<text x="%.1f" y="%d" font-size="9.5" fill="#6B7280" text-anchor="middle"%s>cos = %.2f</text>'
                   % (ox + 16, base + 40, HALO, cos(radians(d))))
    out.append('<text x="28" y="30" font-size="10" fill="#6B7280"%s>막대 길이 %g — 그림자 = 길이 × cos</text>'
               % (HALO, L))
    out.append(cap('같은 막대인데 세울수록 그림자가 짧아진다 — 얼마나'))
    return ''.join(out)


# ── 166 · 기울어진 판의 그림자 넓이 ────────────────────────────────
def pa166():
    w, hh, d = 4.0, 3.0, 60.0
    S = w * hh
    Sp = S * cos(radians(d))
    assert abs(Sp - S / 2) < 1e-12

    X0, Y0, U = 70.0, 118.0, 26.0
    out = []
    # 원래 판 (기울어진 모습 — 가로는 그대로, 세로만 cos 만큼 눌린다)
    out.append('<path d="M%.1f %.1f h%.1f v%.1f h%.1f Z" fill="#2563EB" opacity=".18" stroke="#1D4ED8" stroke-width="1.6"/>'
               % (X0, Y0 - U * hh, U * w, U * hh, -U * w))
    out.append('<text x="%.1f" y="%.1f" font-size="10.5" font-weight="800" fill="#1D4ED8" text-anchor="middle"%s>'
               'S = %g × %g = %g</text>' % (X0 + U * w / 2, Y0 - U * hh - 8, HALO, w, hh, S))
    # 그림자 (세로가 cos d 배로 눌린 모습)
    sx = X0 + U * w + 44
    out.append('<path d="M%.1f %.1f h%.1f v%.1f h%.1f Z" fill="#BE123C" opacity=".20" stroke="#BE123C" stroke-width="1.6"/>'
               % (sx, Y0 - U * hh * cos(radians(d)), U * w, U * hh * cos(radians(d)), -U * w))
    out.append('<text x="%.1f" y="%.1f" font-size="10.5" font-weight="800" fill="#BE123C" text-anchor="middle"%s>'
               'S′ = S × cos %g° = %g</text>' % (sx + U * w / 2, Y0 - U * hh * cos(radians(d)) - 8, HALO, d, Sp))
    out.append(arrow(X0 + U * w + 8, Y0 - U * hh / 2, sx - 8, Y0 - U * hh / 2, '#6B7280', 1.8))
    out.append('<text x="%.1f" y="%.1f" font-size="9.5" fill="#6B7280" text-anchor="middle"%s>%g° 기울이면</text>'
               % ((X0 + U * w + sx) / 2, Y0 - U * hh / 2 - 8, HALO, d))
    out.append('<path d="M%.1f %.1f H%.1f" stroke="#9CA3AF" stroke-width="1.2"/>' % (X0 - 14, Y0, sx + U * w + 14))
    out.append('<text x="364" y="150" font-size="10" fill="#6B7280" text-anchor="end"%s>'
               '가로는 그대로, 세로만 cos 만큼 눌린다 — 그래서 넓이도 cos 배</text>' % HALO)
    out.append(cap('판을 기울이면 그림자 넓이는 얼마가 될까'))
    return ''.join(out)


# ── 167 · 공간에서 수직을 어떻게 확인하나 ──────────────────────────
def tp167():
    PH, HA = 3.0, 4.0
    PA = hypot(PH, HA)
    assert abs(PA - 5.0) < 1e-12

    pr = lambda x, y, z: (104 + 30.0 * x + 15.0 * y, 124 - 22.0 * z + 10.0 * y)
    H = pr(0, 0, 0); P = pr(0, 0, PH); A = pr(0, HA, 0)
    L0 = pr(-2.4, HA, 0); L1 = pr(3.6, HA, 0)
    pts = [pr(-2.6, -1.2, 0), pr(4.4, -1.2, 0), pr(4.4, 5.4, 0), pr(-2.6, 5.4, 0)]
    out = ['<path d="%s Z" fill="#2563EB" fill-opacity=".07" stroke="#C7D2E4" stroke-width="1.1"/>'
           % ' '.join('%s%.1f %.1f' % ('M' if i == 0 else 'L', q[0], q[1]) for i, q in enumerate(pts))]
    out.append('<path d="M%.1f %.1f L%.1f %.1f" stroke="#0E9384" stroke-width="2.4"/>' % (L0[0], L0[1], L1[0], L1[1]))
    out.append('<path d="M%.1f %.1f L%.1f %.1f" stroke="#BE123C" stroke-width="2.6"/>' % (H[0], H[1], P[0], P[1]))
    out.append('<path d="M%.1f %.1f L%.1f %.1f" stroke="#2563EB" stroke-width="2.2"/>' % (H[0], H[1], A[0], A[1]))
    out.append('<path d="M%.1f %.1f L%.1f %.1f" stroke="#7C3AED" stroke-width="2.6"/>' % (P[0], P[1], A[0], A[1]))
    for q, nm, col, dx, dy in ((P, 'P', '#BE123C', 7, -6), (H, 'H', '#111827', -14, 12), (A, 'A', '#2563EB', 8, 12)):
        out.append('<circle cx="%.1f" cy="%.1f" r="4.4" fill="%s"/>' % (q[0], q[1], col))
        out.append('<text x="%.1f" y="%.1f" font-size="11" font-weight="800" fill="#374151"%s>%s</text>'
                   % (q[0] + dx, q[1] + dy, HALO, nm))
    out.append('<text x="%.1f" y="%.1f" font-size="10" font-weight="800" fill="#0B6E63"%s>직선 ℓ</text>'
               % (L1[0] + 5, L1[1] + 4, HALO))
    out.append('<text x="364" y="40" font-size="10.5" font-weight="800" fill="#BE123C" text-anchor="end"%s>'
               'PH = %g (평면에 수직)</text>' % (HALO, PH))
    out.append('<text x="364" y="56" font-size="10.5" font-weight="800" fill="#1D4ED8" text-anchor="end"%s>'
               'HA = %g (ℓ 에 수직)</text>' % (HALO, HA))
    out.append('<text x="364" y="72" font-size="10.5" font-weight="800" fill="#6D28D9" text-anchor="end"%s>'
               'PA = √(%g² + %g²) = %g → ℓ 에 수직</text>' % (HALO, PH, HA, PA))
    out.append(cap('바닥에 수직, 선에 수직 — 그러면 비스듬한 선도 수직일까'))
    return ''.join(out)


# ── 168 · 드론은 지금 어디에 ───────────────────────────────────────
def s3168():
    x, y, z = 2.0, 3.0, 6.0
    g = hypot(x, y)
    d = hypot(x, y, z)
    assert abs(d - 7.0) < 1e-12 and abs(g - sqrt(13)) < 1e-12

    pr = lambda a, b, c: (96 + 30.0 * a + 16.0 * b, 132 - 15.0 * c + 11.0 * b)
    O = pr(0, 0, 0); G = pr(x, y, 0); D = pr(x, y, z)
    ax = pr(x, 0, 0); ay = pr(0, y, 0)
    plane = [pr(-0.8, -0.8, 0), pr(5.2, -0.8, 0), pr(5.2, 4.6, 0), pr(-0.8, 4.6, 0)]
    out = ['<path d="%s Z" fill="#2563EB" fill-opacity=".07" stroke="#C7D2E4" stroke-width="1.1"/>'
           % ' '.join('%s%.1f %.1f' % ('M' if i == 0 else 'L', q[0], q[1]) for i, q in enumerate(plane))]
    for q, col in ((ax, '#9CA3AF'), (ay, '#9CA3AF')):
        out.append('<path d="M%.1f %.1f L%.1f %.1f" stroke="%s" stroke-width="1.1" stroke-dasharray="4 3"/>'
                   % (O[0], O[1], q[0], q[1], col))
        out.append('<path d="M%.1f %.1f L%.1f %.1f" stroke="#9CA3AF" stroke-width="1.1" stroke-dasharray="4 3"/>'
                   % (q[0], q[1], G[0], G[1]))
    out.append('<path d="M%.1f %.1f L%.1f %.1f" stroke="#0E9384" stroke-width="2.4"/>' % (O[0], O[1], G[0], G[1]))
    out.append('<path d="M%.1f %.1f L%.1f %.1f" stroke="#BE123C" stroke-width="2.4" stroke-dasharray="5 4"/>'
               % (G[0], G[1], D[0], D[1]))
    out.append('<path d="M%.1f %.1f L%.1f %.1f" stroke="#7C3AED" stroke-width="2.6"/>' % (O[0], O[1], D[0], D[1]))
    out.append('<circle cx="%.1f" cy="%.1f" r="4.2" fill="#111827"/>' % (O[0], O[1]))
    out.append('<text x="%.1f" y="%.1f" font-size="10" fill="#374151"%s>관제탑</text>' % (O[0] - 34, O[1] + 6, HALO))
    out.append('<circle cx="%.1f" cy="%.1f" r="5.4" fill="#BE123C"/>' % (D[0], D[1]))
    out.append('<text x="%.1f" y="%.1f" font-size="10.5" font-weight="800" fill="#BE123C"%s>드론 (%g, %g, %g)</text>'
               % (D[0] + 8, D[1] - 5, HALO, x, y, z))
    out.append('<circle cx="%.1f" cy="%.1f" r="3.6" fill="#0E9384"/>' % (G[0], G[1]))
    out.append('<text x="%.1f" y="%.1f" font-size="9.5" fill="#0B6E63"%s>바닥의 그림자</text>' % (G[0] + 7, G[1] + 13, HALO))
    out.append('<text x="364" y="40" font-size="10.5" font-weight="800" fill="#0B6E63" text-anchor="end"%s>'
               '바닥 거리 √(%g² + %g²) = %.3f</text>' % (HALO, x, y, g))
    out.append('<text x="364" y="56" font-size="10.5" font-weight="800" fill="#6D28D9" text-anchor="end"%s>'
               '전체 거리 √(%.3f² + %g²) = %g</text>' % (HALO, g, z, d))
    out.append(cap('피타고라스를 두 번 쓰면 하늘의 거리도 잴 수 있을까'))
    return ''.join(out)


# ── 169 · 공을 자르면 무슨 모양 ────────────────────────────────────
def sc169():
    R, h = 5.0, 3.0
    rr = sqrt(R * R - h * h)
    assert abs(rr - 4.0) < 1e-12

    U = 17.0
    cx, cy = 150.0, 92.0
    out = ['<circle cx="%.1f" cy="%.1f" r="%.1f" fill="#2563EB" fill-opacity=".07" stroke="#1D4ED8" stroke-width="2"/>'
           % (cx, cy, U * R)]
    yk = cy - U * h
    out.append('<path d="M%.1f %.1f H%.1f" stroke="#BE123C" stroke-width="2.2"/>' % (cx - U * R - 16, yk, cx + U * R + 16))
    out.append('<ellipse cx="%.1f" cy="%.1f" rx="%.1f" ry="%.1f" fill="#BE123C" fill-opacity=".18" stroke="#BE123C" stroke-width="1.8"/>'
               % (cx, yk, U * rr, U * rr * 0.26))
    out.append('<path d="M%.1f %.1f L%.1f %.1f L%.1f %.1f Z" fill="none" stroke="#0E9384" stroke-width="1.8"/>'
               % (cx, cy, cx, yk, cx + U * rr, yk))
    out.append('<path d="M%.1f %.1f h8 v-8" stroke="#0E9384" stroke-width="1.2" fill="none"/>' % (cx, yk))
    out.append('<circle cx="%.1f" cy="%.1f" r="3.4" fill="#111827"/>' % (cx, cy))
    out.append('<text x="%.1f" y="%.1f" font-size="10" fill="#374151"%s>중심</text>' % (cx + 5, cy + 14, HALO))
    out.append('<text x="%.1f" y="%.1f" font-size="10" font-weight="800" fill="#0B6E63" text-anchor="end"%s>h = %g</text>'
               % (cx - 5, (cy + yk) / 2 + 4, HALO, h))
    out.append('<text x="%.1f" y="%.1f" font-size="10" font-weight="800" fill="#BE123C" text-anchor="middle"%s>단면 반지름 %g</text>'
               % (cx + U * rr / 2, yk - 10, HALO, rr))
    out.append('<text x="364" y="44" font-size="10.5" font-weight="800" fill="#1D4ED8" text-anchor="end"%s>'
               'R = %g · h = %g</text>' % (HALO, R, h))
    out.append('<text x="364" y="60" font-size="10.5" font-weight="800" fill="#BE123C" text-anchor="end"%s>'
               '단면 반지름 = √(%g² − %g²) = %g</text>' % (HALO, R, h, rr))
    out.append('<text x="364" y="76" font-size="10" fill="#6B7280" text-anchor="end"%s>'
               '넓이 = π × %g = %.2f</text>' % (HALO, rr * rr, pi * rr * rr))
    out.append(cap('공을 어떻게 잘라도 자른 자리는 늘 같은 모양일까'))
    return ''.join(out)


# ── 170 · 하나의 원뿔, 네 가지 곡선 ────────────────────────────────
def cc170():
    A = 45.0                                   # 모선 각
    es = {t: sin(radians(t)) / cos(radians(A)) for t in (0, 30, 45, 65)}
    assert abs(es[0]) < 1e-12 and abs(es[45] - 1.0) < 1e-12
    assert es[30] < 1 < es[65] and abs(es[30] - 0.7071) < 1e-4
    kinds = {0: '원', 30: '타원', 45: '포물선', 65: '쌍곡선'}

    out = []
    ax, ay, HH, RR = 92.0, 36.0, 86.0, 46.0
    out.append('<path d="M%.1f %.1f L%.1f %.1f M%.1f %.1f L%.1f %.1f" stroke="#1D4ED8" stroke-width="2"/>'
               % (ax, ay, ax - RR, ay + HH, ax, ay, ax + RR, ay + HH))
    out.append('<path d="M%.1f %.1f L%.1f %.1f M%.1f %.1f L%.1f %.1f" stroke="#1D4ED8" stroke-width="2" opacity=".45"/>'
               % (ax, ay, ax - RR * 0.62, ay - HH * 0.62, ax, ay, ax + RR * 0.62, ay - HH * 0.62))
    out.append('<ellipse cx="%.1f" cy="%.1f" rx="%.1f" ry="13" fill="none" stroke="#1D4ED8" stroke-width="1.3" opacity=".5"/>'
               % (ax, ay + HH, RR))
    for i, t in enumerate(sorted(es)):
        col = ('#0E9384', '#2563EB', '#B45309', '#BE123C')[i]
        cyp = ay + 30 + i * 18
        r = radians(t)
        out.append('<path d="M%.1f %.1f L%.1f %.1f" stroke="%s" stroke-width="2" opacity=".85"/>'
                   % (ax - 58 * cos(r), cyp + 58 * sin(r), ax + 58 * cos(r), cyp - 58 * sin(r), col))
        out.append('<text x="364" y="%d" font-size="10.5" font-weight="800" fill="%s" text-anchor="end"%s>'
                   '%2d° → %s · e = %.3f</text>' % (44 + i * 18, col, HALO, t, kinds[t], es[t]))
    out.append('<text x="200" y="158" font-size="10" fill="#6B7280" text-anchor="middle"%s>'
               'e = sin(자른 각) ÷ cos(모선 각) — 45°에서 e = 1, 그 너머는 두 갈래</text>' % HALO)
    out.append(cap('원뿔 하나를 각도만 바꿔 자른다 — 네 곡선이 한 집안이다'))
    return ''.join(out)


FNS = [('tc161', tc161), ('va162', va162), ('vs163', vs163), ('da164', da164), ('pl165', pl165),
       ('pa166', pa166), ('tp167', tp167), ('s3168', s3168), ('sc169', sc169), ('cc170', cc170)]

if __name__ == '__main__':
    import sys
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass
    for nm, f in FNS:
        sys.stdout.write('%-7s %5d자  ok\n' % (nm, len(f())))
