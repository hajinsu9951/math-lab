# -*- coding: utf-8 -*-
"""LAB 261~270 「오늘의 문제」 그림 — 좌표를 계산해서 그린다.

주성분과 다변수 미적분 묶음이다. 그림에 적는 수는 실험 화면과 같은 식으로 구해
assert 로 묶었다. 수가 틀리면 여기서 멈춘다.
"""
from math import sqrt, pi, cos, sin, log, radians, hypot, degrees, atan2

HALO = ' paint-order="stroke" stroke="#fff" stroke-width="3.2" stroke-linejoin="round"'
GREY = '#9CA3AF'


def cap(t):
    return ('<text x="200" y="16" font-size="10.5" fill="#6B7280" text-anchor="middle"%s>%s</text>'
            % (HALO, t))


def txt(x, y, t, fs=10.5, col='#111827', anc='start', w=None):
    return ('<text x="%.1f" y="%.1f" font-size="%s" fill="%s" text-anchor="%s"%s%s>%s</text>'
            % (x, y, fs, col, anc, (' font-weight="%s"' % w) if w else '', HALO, t))


def head(x, y, dx, dy, col=GREY, L=7.0, W=3.4):
    bx, by = x - dx * L, y - dy * L
    px, py = -dy * W, dx * W
    return ('<path d="M%.1f %.1f L%.1f %.1f L%.1f %.1f Z" fill="%s"/>'
            % (x, y, bx + px, by + py, bx - px, by - py, col))


def axes(x0, x1, y0, y1, col=GREY):
    return ('<path d="M%.1f %.1f H%.1f M%.1f %.1f V%.1f" stroke="%s" stroke-width="1.2" fill="none"/>'
            % (x0 - 4, y0, x1, x0, y0 + 4, y1, col)
            + head(x1 + 4, y0, 1, 0, col) + head(x0, y1 - 4, 0, -1, col))


def cross(cx, cy, r, col=GREY):
    return ('<path d="M%.1f %.1f H%.1f M%.1f %.1f V%.1f" stroke="%s" stroke-width="1.1" fill="none"/>'
            % (cx - r, cy, cx + r, cx, cy + r, cy - r, col)
            + head(cx + r + 4, cy, 1, 0, col) + head(cx, cy - r - 4, 0, -1, col))


def poly(pts, col, w=2.4, dash=None, fill='none'):
    d = ' '.join('%s%.1f %.1f' % ('M' if i == 0 else 'L', p[0], p[1]) for i, p in enumerate(pts))
    return ('<path d="%s" stroke="%s" stroke-width="%s" fill="%s" stroke-linecap="round" '
            'stroke-linejoin="round"%s/>'
            % (d, col, w, fill, ' stroke-dasharray="5 4"' if dash else ''))


def arrow(x0, y0, x1, y1, col, w=2.2):
    L = hypot(x1 - x0, y1 - y0)
    if L < 1e-6:
        return ''
    ux, uy = (x1 - x0) / L, (y1 - y0) / L
    return poly([(x0, y0), (x1 - ux * 6, y1 - uy * 6)], col, w) + head(x1, y1, ux, uy, col)


def dot(x, y, r=5.0, col='#111827'):
    return '<circle cx="%.1f" cy="%.1f" r="%.1f" fill="%s"/>' % (x, y, r, col)


def rect(x, y, w, h, col, op='.30', stroke=None, sw=1.2):
    return ('<rect x="%.1f" y="%.1f" width="%.1f" height="%.1f" fill="%s" fill-opacity="%s"%s/>'
            % (x, y, w, h, col, op,
               ' stroke="%s" stroke-width="%s"' % (stroke, sw) if stroke else ''))


def shape(pts, col, op='.18', stroke=None, sw=1.6):
    d = ' '.join('%s%.1f %.1f' % ('M' if i == 0 else 'L', p[0], p[1]) for i, p in enumerate(pts))
    return ('<path d="%s Z" fill="%s" fill-opacity="%s" stroke="%s" stroke-width="%s"/>'
            % (d, col, op, stroke or col, sw))


# ── 261 · 가장 퍼진 방향 ────────────────────────────────────────────
BASE = [(-2.2, 0.6), (-1.8, -1.4), (-1.4, 1.8), (-1.0, -0.2), (-0.6, 1.0), (-0.2, -2.2),
        (0.2, 2.2), (0.6, -1.0), (1.0, 0.2), (1.4, -1.8), (1.8, 1.4), (2.2, -0.6)]


def pca_at(r):
    """실험 화면의 pcaDemo 와 똑같은 식으로 공분산·고윳값·주축 각도를 구한다."""
    D = [(x, r * x + sqrt(max(0.0, 1 - r * r)) * y) for x, y in BASE]
    n = len(D)
    mx = sum(p[0] for p in D) / n
    my = sum(p[1] for p in D) / n
    sxx = sum((p[0] - mx) ** 2 for p in D) / n
    syy = sum((p[1] - my) ** 2 for p in D) / n
    sxy = sum((p[0] - mx) * (p[1] - my) for p in D) / n
    tr = sxx + syy
    disc = sqrt(max(0.0, tr * tr - 4 * (sxx * syy - sxy * sxy)))
    l1, l2 = (tr + disc) / 2, (tr - disc) / 2
    ang = degrees(atan2(l1 - sxx, sxy)) % 180
    return D, mx, my, l1, l2, tr, ang


def pc261():
    D, mx, my, l1, l2, tr, ang = pca_at(0.9)
    assert abs(l1 + l2 - tr) < 1e-9                     # 두 고윳값의 합 = 전체 분산
    assert 0.945 < l1 / tr < 0.946, l1 / tr
    assert 43.0 < ang < 44.0, ang
    cx, cy, u = 104.0, 96.0, 26.0
    dx, dy = cos(radians(ang)), sin(radians(ang))
    out = [cross(cx, cy, 62)]
    out.append(poly([(cx - dx * 72, cy + dy * 72), (cx + dx * 72, cy - dy * 72)], '#0E9384', 2.0))
    for x, y in D:
        px, py = cx + (x - mx) * u, cy - (y - my) * u
        t = (x - mx) * dx + (y - my) * dy
        qx, qy = cx + t * dx * u, cy - t * dy * u
        out.append(poly([(px, py), (qx, qy)], GREY, 0.9))
        out.append(dot(px, py, 3.4, '#2563EB'))
        out.append(dot(qx, qy, 2.4, '#BE123C'))
    out.append(txt(cx + dx * 76, cy - dy * 76 - 4, '%.1f°' % ang, 9.5, '#0E9384', w=800))
    # 오른쪽 — 두 고윳값이 담는 비율
    out.append(txt(214, 44, '이 방향으로 내려 찍었을 때 가장 넓게 퍼진다', 10, '#111827', w=800))
    out.append(txt(214, 66, '고윳값 %.3f · %.3f' % (l1, l2), 10, '#6B7280'))
    out.append(txt(214, 84, '두 고윳값의 합 = 전체 분산 %.3f' % tr, 10, '#6B7280'))
    bw = 168.0
    out.append(rect(214, 96, bw * l1 / tr, 13, '#2563EB', '.75'))
    out.append(rect(214 + bw * l1 / tr, 96, bw * l2 / tr, 13, '#BE123C', '.45'))
    out.append(txt(214, 126, '첫 축 하나가 전체 퍼짐의 %.1f %%' % (l1 / tr * 100), 10.5, '#1D4ED8', w=800))
    out.append(txt(214, 144, '둘째 축은 %.1f %% — 버려도 될까' % (l2 / tr * 100), 10, '#BE123C'))
    out.append(cap('축을 줄여도 정보를 지킬 수 있을까'))
    return ''.join(out)


# ── 262 · 비를 보면 안다 ────────────────────────────────────────────
def rt262():
    s09 = 0.9 / (1 - 0.9)                               # k = 1 부터 더한 무한합
    s11 = sum(1.1 ** k for k in range(1, 21))
    assert abs(s09 - 9.0) < 1e-9, s09
    assert 62.9 < s11 < 63.1, s11
    out = [txt(14, 42, '비 = 0.90 < 1 → 모인다 (합 %.2f)' % s09, 10.5, '#0E9384', w=800),
           txt(14, 64, '비 = 1.10 > 1 → 흩어진다 (20항 %.2f)' % s11, 10.5, '#BE123C', w=800),
           txt(14, 86, '비 = 1.00 → 판정법이 아무 말도 못 한다', 10.5, '#B45309', w=800),
           txt(14, 118, '더해 보지 않고 이웃한 두 항의 비만 본다', 10, '#111827', w=800),
           txt(14, 136, '경계 1 에서는 p 에 따라 갈린다', 10, '#6B7280')]
    mxh = 1.1 ** 10
    for i, (r, col, base, lab) in enumerate([(0.9, '#0E9384', 78.0, '항의 크기  r = 0.9'),
                                             (1.1, '#BE123C', 150.0, '항의 크기  r = 1.1')]):
        out.append(txt(230, base - 40, lab, 9.5, col, w=800))
        for k in range(1, 11):
            h = r ** k / mxh * 30.0
            out.append(rect(230 + (k - 1) * 14, base - h, 11, h, col, '.60'))
        out.append(poly([(226, base), (386, base)], GREY, 1.0))
    out.append(cap('더해 보지 않고 수렴을 알 수 있을까'))
    return ''.join(out)


# ── 263 · 0 으로 가는데도 무한 ──────────────────────────────────────
def ps263():
    H = sum(1.0 / k for k in range(1, 51))
    I1 = log(50.0)
    Z = sum(1.0 / k ** 2 for k in range(1, 51))
    I2 = (50.0 ** -1 - 1) / -1.0
    assert 4.499 < H < 4.500, H
    assert 3.912 < I1 < 3.913, I1
    assert 1.625 < Z < 1.626, Z
    assert abs(I2 - 0.98) < 1e-9, I2
    x0, y0, w, hmax = 26.0, 142.0, 21.0, 86.0           # 막대 왼쪽·바닥·폭·최대 높이
    out = []
    for k in range(1, 9):
        h = hmax / k
        out.append(rect(x0 + (k - 1) * w, y0 - h, w - 1.5, h, '#2563EB', '.22',
                        stroke='#2563EB', sw=0.9))
    pts = []
    for i in range(81):
        x = 1 + i * 8.0 / 80
        pts.append((x0 + (x - 1) * w, y0 - hmax / x))
    out.append(poly(pts, '#BE123C', 2.0))
    out.append(poly([(x0 - 4, y0), (x0 + 8 * w + 6, y0)], GREY, 1.1))
    out.append(head(x0 + 8 * w + 10, y0, 1, 0))
    out.append(txt(x0, 36, '막대 = 1/k 를 더한 것 · 붉은 선 = 1/x 아래 넓이', 9.5, '#6B7280'))
    out.append(txt(x0 + 3 * w, y0 + 14, '막대가 곡선보다 높다 — 합 > 넓이', 9.5, '#111827', w=800))
    out.append(txt(214, 60, 'p = 1 : 50항 합 %.3f · 넓이 %.3f' % (H, I1), 10, '#BE123C', w=800))
    out.append(txt(214, 78, '→ 넓이가 무한하니 합도 무한', 10, '#BE123C'))
    out.append(txt(214, 102, 'p = 2 : 50항 합 %.3f · 넓이 %.3f' % (Z, I2), 10, '#0E9384', w=800))
    out.append(txt(214, 120, '→ 넓이가 유한하니 합도 멈춘다', 10, '#0E9384'))
    out.append(cap('항이 0 으로 가면 합도 유한할까'))
    return ''.join(out)


# ── 264 · 항을 늘려도 나빠진다 ──────────────────────────────────────
def rd264():
    N = 7
    A = [(1 - 0.5 ** k) / 0.5 for k in range(1, N + 1)]
    B = [(1.2 ** k - 1) / 0.2 for k in range(1, N + 1)]
    assert abs(A[-1] - 1.984375) < 1e-9, A[-1]
    assert 12.91 < B[-1] < 12.92, B[-1]
    vmax = 13.0
    X = lambda i: 30.0 + i * 26.0
    Y = lambda v: 148.0 - v / vmax * 96.0
    out = [poly([(26, Y(0)), (26 + N * 26, Y(0))], GREY, 1.1),
           head(30 + N * 26, Y(0), 1, 0),
           poly([(26, 150), (26, 44)], GREY, 1.1), head(26, 40, 0, -1)]
    out.append(poly([(28, Y(2)), (210, Y(2))], '#9CA3AF', 1.0, dash=1))
    out.append(poly([(X(i), Y(v)) for i, v in enumerate(A)], '#0E9384', 2.2))
    out.append(poly([(X(i), Y(v)) for i, v in enumerate(B)], '#BE123C', 2.2))
    for i, v in enumerate(A):
        out.append(dot(X(i), Y(v), 2.6, '#0E9384'))
    for i, v in enumerate(B):
        out.append(dot(X(i), Y(v), 2.6, '#BE123C'))
    out.append(txt(34, Y(2) - 7, '참값 2', 9.5, '#6B7280'))
    out.append(txt(X(N - 1) + 6, Y(A[-1]) + 4, '%.3f' % A[-1], 9.5, '#0E9384', w=800))
    out.append(txt(X(N - 1) + 6, Y(B[-1]) + 4, '%.2f' % B[-1], 9.5, '#BE123C', w=800))
    out.append(txt(26, 160, '더한 항의 수 1 → %d' % N, 9.5, '#6B7280'))
    out.append(txt(252, 54, 'x = 0.5 (반경 안)', 10, '#0E9384', w=800))
    out.append(txt(252, 72, '참값 2 로 다가간다', 10, '#6B7280'))
    out.append(txt(252, 98, 'x = 1.2 (반경 밖)', 10, '#BE123C', w=800))
    out.append(txt(252, 116, '참값은 −5 인데 합은 커진다', 10, '#6B7280'))
    out.append(txt(252, 140, '항을 늘릴수록 멀어진다', 10, '#111827', w=800))
    out.append(cap('근사는 어디까지 통할까'))
    return ''.join(out)


# ── 265 · 어느 길로 가느냐에 따라 ───────────────────────────────────
def pl265():
    ms = [0.0, 0.5, 1.0]
    vs = [m / (1 + m * m) for m in ms]
    assert [round(v, 4) for v in vs] == [0.0, 0.4, 0.5], vs
    ox, oy, L = 96.0, 124.0, 72.0
    out = [poly([(ox - 10, oy), (ox + 104, oy)], GREY, 1.0),
           poly([(ox, oy + 10), (ox, oy - 92)], GREY, 1.0),
           head(ox + 108, oy, 1, 0), head(ox, oy - 96, 0, -1)]
    cols = ['#0E9384', '#B45309', '#BE123C']
    for m, v, col in zip(ms, vs, cols):
        ux, uy = 1 / hypot(1, m), m / hypot(1, m)
        out.append(poly([(ox, oy), (ox + ux * L, oy - uy * L)], col, 1.8))
        for t in (0.25, 0.5, 0.8):
            out.append(dot(ox + ux * L * t, oy - uy * L * t, 2.4, col))
        out.append(txt(ox + ux * L + 6, oy - uy * L + 3, 'm = %.1f → %.3f' % (m, v), 9.5, col, w=800))
    out.append(dot(ox, oy, 3.6, '#111827'))
    out.append(txt(ox - 6, oy + 14, '원점', 9.5, '#6B7280', anc='end'))
    out.append(txt(14, 150, 'f(x, y) = xy / (x² + y²) — 길 위에서는 값이 변하지 않는다',
                   10, '#111827', w=800))
    out.append(txt(258, 118, '길마다 값이 다르다', 10.5, '#BE123C', w=800))
    out.append(txt(258, 136, '→ 원점에서 극한은 없다', 10.5, '#111827', w=800))
    out.append(cap('가까이 가면 값이 정해질까'))
    return ''.join(out)


# ── 266 · 촘촘한 곳이 가파른 곳 ─────────────────────────────────────
def ct266():
    rs = [sqrt(k) for k in (1, 2, 3, 4)]
    gaps = [rs[i + 1] - rs[i] for i in range(3)]
    assert [round(g, 3) for g in gaps] == [0.414, 0.318, 0.268], gaps
    p1, p2 = (0.25, 0.25), (1.2, 1.2)
    g1 = hypot(2 * p1[0], 2 * p1[1])
    g2 = hypot(2 * p2[0], 2 * p2[1])
    assert abs(g1 - 0.70711) < 1e-5 and abs(g2 - 3.39411) < 1e-5, (g1, g2)
    cx, cy, u = 98.0, 94.0, 26.0
    out = [cross(cx, cy, 60)]
    for r in rs:
        out.append('<circle cx="%.1f" cy="%.1f" r="%.1f" fill="none" stroke="#2563EB" '
                   'stroke-width="1.3" stroke-opacity=".55"/>' % (cx, cy, r * u))
    for (px, py), g, col, sc in ((p1, g1, '#0E9384', 16.0), (p2, g2, '#BE123C', 9.0)):
        sx, sy = cx + px * u, cy - py * u
        out.append(arrow(sx, sy, sx + 2 * px * sc, sy - 2 * py * sc, col, 2.0))
        out.append(dot(sx, sy, 3.2, '#111827'))
    out.append(txt(cx + p1[0] * u + 10, cy - p1[1] * u + 14, '%.2f' % g1, 9.5, '#0E9384', w=800))
    out.append(txt(cx + 2 * p2[0] * 9.0 + p2[0] * u + 6, cy - p2[1] * u - 2 * p2[1] * 9.0 + 2,
                   '%.2f' % g2, 9.5, '#BE123C', w=800))
    out.append(txt(14, 160, '등고선 x² + y² = 1, 2, 3, 4', 9.5, '#6B7280'))
    out.append(txt(206, 48, '같은 높이 차인데 간격이 좁아진다', 10, '#111827', w=800))
    out.append(txt(206, 68, '반지름 %.3f → %.3f → %.3f → %.3f' % tuple(rs), 10, '#6B7280'))
    out.append(txt(206, 86, '간격 %.3f → %.3f → %.3f' % tuple(gaps), 10, '#6B7280'))
    out.append(txt(206, 112, '(0.25, 0.25) 에서 |∇f| = %.2f' % g1, 10, '#0E9384', w=800))
    out.append(txt(206, 130, '(1.2, 1.2) 에서 |∇f| = %.2f' % g2, 10, '#BE123C', w=800))
    out.append(txt(206, 152, '촘촘한 곳이 가파른 곳이다', 10.5, '#111827', w=800))
    out.append(cap('지도의 등고선은 무엇을 말할까'))
    return ''.join(out)


# ── 267 · 하나만 붙잡고 보면 ────────────────────────────────────────
def pd267():
    px, py = 1.0, 0.5
    f = lambda x, y: x * x - 0.6 * y * y + 0.8 * x * y
    fx, fy = 2 * px + 0.8 * py, -1.2 * py + 0.8 * px
    assert abs(f(px, py) - 1.25) < 1e-12
    assert abs(fx - 2.4) < 1e-12 and abs(fy - 0.2) < 1e-12
    out = []
    for k, (lab, g, t0, slope, col) in enumerate([
            ('y 를 0.5 로 붙잡았다 — f(x, 0.5)', lambda t: f(t, py), px, fx, '#2563EB'),
            ('x 를 1 로 붙잡았다 — f(1, y)', lambda t: f(px, t), py, fy, '#0E9384')]):
        ox = 24.0 + k * 194.0
        vs = [g(-2 + i * 4.0 / 60) for i in range(61)]
        lo, hi = min(vs), max(vs)
        X = lambda t, ox=ox: ox + (t + 2) * 38.0
        Y = lambda v, lo=lo, hi=hi: 146.0 - (v - lo) / (hi - lo) * 84.0
        out.append(poly([(ox - 4, 148), (ox + 158, 148)], GREY, 1.0))
        out.append(head(ox + 162, 148, 1, 0))
        out.append(poly([(ox, 150), (ox, 54)], GREY, 1.0))
        out.append(head(ox, 50, 0, -1))
        out.append(poly([(X(-2 + i * 4.0 / 60), Y(vs[i])) for i in range(61)], col, 2.2))
        dYdX = -slope * (84.0 / (hi - lo)) / 38.0
        out.append(poly([(X(t0) - 34, Y(g(t0)) - dYdX * 34),
                         (X(t0) + 34, Y(g(t0)) + dYdX * 34)], '#BE123C', 1.8, dash=1))
        out.append(dot(X(t0), Y(g(t0)), 3.6, '#111827'))
        out.append(txt(ox - 4, 40, lab, 9.5, col, w=800))
        out.append(txt(X(t0) + 8, Y(g(t0)) + 14, 'f = 1.25', 9.5, '#111827', w=800))
        out.append(txt(ox + 2, 162, '%s = %+.2f' % ('∂f/∂x' if k == 0 else '∂f/∂y', slope),
                       9.5, '#BE123C', w=800))
    out.append(cap('변수가 둘이면 기울기는 몇 개일까'))
    return ''.join(out)


# ── 268 · 가까이서는 평평하다 ───────────────────────────────────────
def tp268():
    rows = [(R, 2 * R * R, 2 * R * R + R) for R in (0.4, 0.2, 0.1, 0.05)]
    assert [round(b, 3) for _, b, _ in rows] == [0.32, 0.08, 0.02, 0.005]
    assert [round(c, 3) for _, _, c in rows] == [0.72, 0.28, 0.12, 0.055]
    a = 0.5
    cur = lambda x: x * x
    tan = lambda x: a * a + 2 * a * (x - a)
    X = lambda x: 36.0 + (x + 0.5) * 78.0                # x ∈ [−0.5, 1.5] → 36 … 192
    Y = lambda v: 146.0 - v / 2.3 * 92.0
    out = [poly([(32, Y(0)), (196, Y(0))], GREY, 1.0), head(200, Y(0), 1, 0),
           poly([(36, 148), (36, 44)], GREY, 1.0), head(36, 40, 0, -1)]
    out.append(poly([(X(-0.5 + i * 2.0 / 60), Y(cur(-0.5 + i * 2.0 / 60))) for i in range(61)],
                    '#2563EB', 2.2))
    out.append(poly([(X(-0.1), Y(tan(-0.1))), (X(1.3), Y(tan(1.3)))], '#BE123C', 1.8, dash=1))
    out.append(rect(X(a - 0.4), Y(a * a + 0.4), X(a + 0.4) - X(a - 0.4),
                    Y(a * a - 0.4) - Y(a * a + 0.4), '#0E9384', '.10', stroke='#0E9384', sw=1.0))
    out.append(dot(X(a), Y(a * a), 3.6, '#111827'))
    out.append(txt(X(a) + 8, Y(a * a) + 16, '접점', 9.5, '#111827', w=800))
    out.append(txt(32, 36, '파랑 = 곡면 · 붉은 = 접평면 · 초록 창을 좁혀 본다', 9.5, '#6B7280'))
    out.append(txt(32, 162, '창을 좁힐수록 두 선이 겹쳐 간다', 9.5, '#0E9384', w=800))
    out.append(txt(214, 44, '창의 크기 R', 9.5, '#6B7280'))
    out.append(txt(286, 44, '두 기울기', 9.5, '#0E9384', w=800))
    out.append(txt(348, 44, '한쪽만', 9.5, '#BE123C', w=800))
    for i, (R, b, c) in enumerate(rows):
        y = 64.0 + i * 20.0
        out.append(txt(214, y, '%.2f' % R, 9.5, '#111827'))
        out.append(txt(286, y, '%.3f' % b, 9.5, '#0E9384', w=800))
        out.append(txt(348, y, '%.3f' % c, 9.5, '#BE123C', w=800))
    out.append(txt(214, 160, 'R² 로 줄면 접하고 R 로 줄면 못 접한다', 9.5, '#111827', w=800))
    out.append(cap('곡면을 일차식으로 대신할 수 있을까'))
    return ''.join(out)


# ── 269 · 어느 쪽이 가장 가파른가 ───────────────────────────────────
def gd269():
    gx, gy = 1.2 * 1.0, 2.8 * 0.5                        # f = 0.6x² + 1.4y² 의 ∇f, 점 (1, 0.5)
    gn = hypot(gx, gy)
    best = degrees(atan2(gy, gx)) % 360
    zero = (best + 90) % 360
    assert abs(gn - 1.84391) < 1e-5, gn
    assert 49.3 < best < 49.5, best
    X = lambda th: 30.0 + th * (340.0 / 360.0)
    Y = lambda v: 96.0 - v / 1.9 * 48.0
    out = [poly([(26, Y(0)), (374, Y(0))], GREY, 1.0), head(378, Y(0), 1, 0)]
    out.append(poly([(X(i * 4), Y(gx * cos(radians(i * 4)) + gy * sin(radians(i * 4))))
                     for i in range(91)], '#2563EB', 2.2))
    for th, v, col in ((best, gn, '#BE123C'), (zero, 0.0, '#0E9384'),
                       ((best + 180) % 360, -gn, '#B45309')):
        out.append(dot(X(th), Y(v), 3.4, col))
    out.append(txt(30, 32, 'f = 0.6x² + 1.4y² · 점 (1, 0.5) · ∇f = (%.1f, %.1f)' % (gx, gy),
                   9.5, '#6B7280'))
    out.append(txt(X(best) + 10, 44, '%.1f° — 변화율 %.3f = |∇f|' % (best, gn), 9.5, '#BE123C', w=800))
    out.append(txt(X(zero) + 8, 88, '%.1f° — 변화율 0 (등고선 방향)' % zero, 9.5, '#0E9384', w=800))
    out.append(txt(X((best + 180) % 360) + 8, 152, '%.1f° — 가장 빨리 내려간다'
                   % ((best + 180) % 360), 9.5, '#B45309', w=800))
    out.append(txt(30, 162, '가려는 방향 0° → 360°', 9.5, '#6B7280'))
    out.append(cap('가장 빨리 오르는 방향은 어디일까'))
    return ''.join(out)


# ── 270 · 0 인데 극값이 아니다 ──────────────────────────────────────
def sd270():
    cases = [(1.0, -1.0, 0.0), (1.0, 1.0, 0.0)]
    ds = [4 * a * b - c * c for a, b, c in cases]
    assert ds == [-4.0, 4.0], ds
    u = 26.5
    out = []
    for k, ((a, b, c), D) in enumerate(zip(cases, ds)):
        cx = 100.0 + k * 190.0
        cy = 96.0
        out.append(cross(cx, cy, 50))
        if D < 0:                                        # x² − y² = ±1, ±2 → 쌍곡선
            for kk in (1.0, 2.0):
                for sg in (1, -1):
                    ptsA = [(cx + sg * sqrt(kk + t * t) * u, cy - t * u)
                            for t in [-1.3 + i * 2.6 / 40 for i in range(41)]]
                    out.append(poly(ptsA, '#BE123C', 1.3))
                    ptsB = [(cx + t * u, cy - sg * sqrt(kk + t * t) * u)
                            for t in [-1.3 + i * 2.6 / 40 for i in range(41)]]
                    out.append(poly(ptsB, '#2563EB', 1.3))
        else:                                            # x² + y² = 1, 2, 3 → 원
            for kk in (1.0, 2.0, 3.0):
                out.append('<circle cx="%.1f" cy="%.1f" r="%.1f" fill="none" stroke="#0E9384" '
                           'stroke-width="1.3" stroke-opacity=".6"/>' % (cx, cy, sqrt(kk) * u))
        out.append(dot(cx, cy, 3.6, '#111827'))
        mn = lambda v: ('%g' % v).replace('-', '−')          # 교과서 빼기표로
        out.append(txt(cx, 40, 'a = %s · b = %s · c = %s' % (mn(a), mn(b), mn(c)),
                       9.5, '#6B7280', anc='middle'))
        out.append(txt(cx, 156, '4ab − c² = %s → %s' % (('%+g' % D).replace('-', '−'),
                                                        '안장점' if D < 0 else '극소'),
                       10, '#BE123C' if D < 0 else '#0E9384', anc='middle', w=800))
    out.append(txt(200, 96, '기울기는\n둘 다 0', 9.5, '#111827', anc='middle', w=800)
               .replace('\n', ' '))
    out.append(cap('기울기가 0 이면 극값일까'))
    return ''.join(out)


FNS = [('pc261', pc261), ('rt262', rt262), ('ps263', ps263), ('rd264', rd264), ('pl265', pl265),
       ('ct266', ct266), ('pd267', pd267), ('tp268', tp268), ('gd269', gd269), ('sd270', sd270)]

if __name__ == '__main__':
    import sys
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass
    for nm, f in FNS:
        sys.stdout.write('%-7s %5d자  ok\n' % (nm, len(f())))
