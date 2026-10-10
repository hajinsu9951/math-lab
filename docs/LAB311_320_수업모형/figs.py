# -*- coding: utf-8 -*-
"""LAB 311~320 「오늘의 문제」 그림 — 좌표를 계산해서 그린다.

해석학의 바탕과 대수 구조 묶음이다. 그림에 적는 수는 실험 화면과 같은 식으로 구해
assert 로 묶었다. 수가 틀리면 여기서 멈춘다.
"""
from math import sqrt, pi, cos, sin, tan, acos, exp, log, radians, hypot, degrees, atan2

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


# ── 311 · 최댓값이 없어도 울타리는 있다 ────────────────────────────
def su311():
    out = []
    X = lambda v: 50.0 + v * 150.0                       # 0 … 1 을 50 … 200 으로
    for k, (lab, closed, y) in enumerate([('0 이상 1 미만', False, 72.0),
                                          ('0 이상 1 이하', True, 124.0)]):
        out.append(poly([(X(-0.1), y), (X(1.3), y)], GREY, 1.0))
        out.append(head(X(1.33), y, 1, 0))
        out.append(poly([(X(0), y), (X(1), y)], '#2563EB', 3.2))
        out.append('<circle cx="%.1f" cy="%.1f" r="4.4" fill="#2563EB"/>' % (X(0), y))
        out.append('<circle cx="%.1f" cy="%.1f" r="4.4" fill="%s" stroke="#2563EB" '
                   'stroke-width="1.6"/>' % (X(1), y, '#2563EB' if closed else '#FFFFFF'))
        out.append(txt(X(0), y + 16, '0', 9, '#6B7280', anc='middle'))
        out.append(txt(X(1), y + 16, '1', 9, '#6B7280', anc='middle'))
        out.append(txt(X(-0.12), y - 16, lab, 9.5, '#111827', w=800))
        out.append(txt(X(1) + 16, y + 4, '최댓값 %s · 상한 1' % ('1' if closed else '없음'),
                       9.5, '#0E9384' if closed else '#BE123C', w=800))
    out.append(txt(14, 163, '속이 빈 점 = 그 값은 집합에 들어 있지 않다', 9.5, '#6B7280'))
    out.append(txt(14, 46, '같은 「1」 인데 한쪽은 최댓값이고 한쪽은 아니다', 10, '#111827', w=800))
    out.append(cap('최댓값이 없어도 울타리는 있을까'))
    return ''.join(out)


# ── 312 · 좁혀 가도 닿지 않는다 ─────────────────────────────────────
def cm312():
    a, b = 1.0, 2.0
    rows = []
    for i in range(1, 13):
        m = (a + b) / 2
        if m * m < 2:
            a = m
        else:
            b = m
        if i in (1, 4, 8, 12):
            rows.append((i, a, b, b - a))
    assert abs(rows[-1][3] - 2 ** -12) < 1e-12, rows[-1]
    assert rows[-1][1] < sqrt(2) < rows[-1][2]
    ox, oy, W = 40.0, 62.0, 230.0                        # 1 … 2 를 가로로 편다
    X = lambda v: ox + (v - 1.0) * W
    out = []
    for i, (n, lo, hi, gap) in enumerate(rows):
        y = oy + i * 22.0
        out.append(poly([(ox - 6, y), (ox + W + 10, y)], '#E5E7EB', 1.0))
        out.append(poly([(X(lo), y), (X(hi), y)], '#2563EB', 3.4))
        out.append(txt(ox - 12, y + 4, '%d 번' % n, 9, '#6B7280', anc='end'))
        out.append(txt(ox + W + 16, y + 4, '길이 %.6f' % gap, 9, '#111827'))
    out.append(poly([(X(sqrt(2)), oy - 14), (X(sqrt(2)), oy + 3 * 22 + 12)], '#BE123C', 1.4,
                    dash=1))
    out.append(txt(X(sqrt(2)), oy - 20, '√2', 9.5, '#BE123C', anc='middle', w=800))
    out.append(txt(14, 163, '두 끝은 언제나 유리수인데, 좁혀 가는 그 점은 유리수가 아니다',
                   9.5, '#6B7280'))
    out.append(txt(14, 144, '유리수만 있는 세계에는 이 자리에 「구멍」 이 있다', 10, '#BE123C', w=800))
    out.append(cap('좁혀 가는데 닿을 점이 없다면'))
    return ''.join(out)


# ── 313 · ε 을 주면 δ 를 찾는다 ─────────────────────────────────────
def ed313():
    eps, dmax = 0.5, 0.25                                # f(x) = 2x 에서 2δ ≤ ε
    assert abs(2 * dmax - eps) < 1e-12
    ox, oy, u = 150.0, 104.0, 56.0                       # 원점(x₀, f(x₀))
    out = [cross(ox, oy, 60)]
    out.append(poly([(ox - 60, oy + 120), (ox + 60, oy - 120)], '#2563EB', 2.2))
    e = eps * u
    d = dmax * u
    out.append(rect(ox - 70, oy - e, 140, 2 * e, '#0E9384', '.12'))
    out.append(rect(ox - d, oy - 76, 2 * d, 152, '#BE123C', '.12'))
    out.append(dot(ox, oy, 3.6, '#111827'))
    out.append(txt(ox + 74, oy - e + 10, 'ε = %.2f' % eps, 9.5, '#0E9384', w=800))
    out.append(txt(ox + 74, oy + e - 2, 'ε', 9.5, '#0E9384', w=800))
    out.append(txt(ox, oy + 86, 'δ = %.2f' % dmax, 9.5, '#BE123C', anc='middle', w=800))
    out.append(txt(14, 163, '초록 띠 안에 머물게 하는 붉은 띠를 찾으면 된다', 9.5, '#6B7280'))
    out.append(txt(246, 48, 'f(x) = 2x 에서는', 10, '#111827', w=800))
    out.append(txt(246, 70, '2δ ≤ ε  →  δ ≤ ε/2', 10.5, '#BE123C', w=800))
    out.append(txt(246, 96, 'ε = 0.5 이면 δ = 0.25', 10, '#111827'))
    out.append(txt(246, 118, 'ε 을 줄이면 δ 도 줄이면 된다', 9.5, '#6B7280'))
    out.append(txt(246, 140, 'δ 를 고정해 두면', 9.5, '#BE123C'))
    out.append(txt(246, 156, '언젠가 반드시 무너진다', 9.5, '#BE123C'))
    out.append(cap('ε 을 주면 δ 를 찾을 수 있을까'))
    return ''.join(out)


# ── 314 · δ 가 점마다 달라도 될까 ───────────────────────────────────
def uc314():
    e = 0.5

    def need_inv(x):
        return max(1e-6, x - 1 / (1 / x + e))

    xs = [0.8, 0.4, 0.2, 0.1]
    lin = [e / 2] * 4
    inv = [need_inv(x) for x in xs]
    assert inv[0] > inv[-1] * 10, inv
    out = [txt(26, 46, '점 x', 9.5, '#6B7280'), txt(140, 46, 'f(x) = 2x 의 δ', 9.5, '#0E9384',
                                                   w=800),
           txt(280, 46, 'f(x) = 1/x 의 δ', 9.5, '#BE123C', w=800)]
    out.append(poly([(20, 52), (380, 52)], GREY, 1.0))
    for i, x in enumerate(xs):
        y = 70.0 + i * 20.0
        out.append(txt(26, y, '%.2f' % x, 9.5, '#111827'))
        out.append(txt(140, y, '%.3f' % lin[i], 9.5, '#0E9384', w=800))
        out.append(txt(280, y, '%.5f' % inv[i], 9.5, '#BE123C', w=800))
        w1 = lin[i] * 180
        w2 = inv[i] * 180
        out.append(rect(196, y - 9, w1, 9, '#0E9384', '.45'))
        out.append(rect(336, y - 9, max(0.6, w2), 9, '#BE123C', '.45'))
    out.append(txt(14, 163, '같은 ε 에 대해 점마다 필요한 δ — 왼쪽으로 갈수록 1/x 는 0 으로 줄어든다',
                   9.5, '#6B7280'))
    out.append(txt(14, 144, 'δ 를 하나로 고를 수 있으면 균등연속이다', 10, '#111827', w=800))
    out.append(cap('δ 를 점마다 달리 골라도 될까'))
    return ''.join(out)


# ── 315 · 점마다 0 인데 오차는 1 ────────────────────────────────────
def fs315():
    ns = [1, 3, 10, 30]
    at = [0.5 ** n for n in ns]
    assert at[-1] < 1e-9
    ox, oy, u = 44.0, 140.0, 108.0                       # 0 … 1 을 가로 u 로
    out = [poly([(ox - 6, oy), (ox + u + 14, oy)], GREY, 1.0),
           head(ox + u + 18, oy, 1, 0),
           poly([(ox, oy + 6), (ox, oy - u - 10)], GREY, 1.0), head(ox, oy - u - 14, 0, -1)]
    for n, col in zip(ns, ['#93C5FD', '#60A5FA', '#2563EB', '#1D4ED8']):
        pts = [(ox + i / 60 * u, oy - (i / 60) ** n * u) for i in range(61)]
        out.append(poly(pts, col, 1.8))
        out.append(txt(ox + u + 4, oy - u * (1 - 0.0) + 0, '', 9, col))
    out.append(txt(ox + u + 6, oy - u + 4, 'n = 1', 9, '#93C5FD', w=800))
    out.append(txt(ox + u * 0.62, oy - 10, 'n = 30', 9, '#1D4ED8', w=800))
    out.append(dot(ox + u, oy - u, 3.4, '#BE123C'))
    out.append(txt(ox + u - 4, oy - u - 8, 'x = 1 에서는 늘 1', 9, '#BE123C', anc='end', w=800))
    out.append(txt(ox, oy + 12, '0', 9, '#6B7280', anc='middle'))
    out.append(txt(ox + u, oy + 12, '1', 9, '#6B7280', anc='middle'))
    out.append(txt(14, 163, 'xⁿ — 점마다 보면 0 으로 가지만 최대 오차는 줄지 않는다',
                   9.5, '#6B7280'))
    out.append(txt(206, 48, 'x = 0.5 에서', 10, '#111827', w=800))
    for i, (n, v) in enumerate(zip(ns, at)):
        out.append(txt(206, 68 + i * 18, 'n = %-3d  %.3e' % (n, v), 9.5, '#2563EB'))
    out.append(txt(206, 146, '그런데 최대 오차는 늘 1.000', 10, '#BE123C', w=800))
    out.append(cap('점마다 0 인데 오차가 줄지 않는다면'))
    return ''.join(out)


# ── 316 · 급수가 원을 그린다 ────────────────────────────────────────
def ef316():
    th = radians(60)
    pts = []
    re_, im_ = 0.0, 0.0
    term_re, term_im = 1.0, 0.0
    for k in range(12):
        re_ += term_re
        im_ += term_im
        pts.append((re_, im_))
        term_re, term_im = -term_im * th / (k + 1), term_re * th / (k + 1)
    err = hypot(pts[-1][0] - cos(th), pts[-1][1] - sin(th))
    assert err < 1e-6, err
    cx, cy, u = 120.0, 100.0, 58.0
    out = [cross(cx, cy, 68)]
    out.append('<circle cx="%.1f" cy="%.1f" r="%.1f" fill="none" stroke="#9CA3AF" '
               'stroke-width="1.1" stroke-dasharray="4 3"/>' % (cx, cy, u))
    out.append(poly([(cx + p[0] * u, cy - p[1] * u) for p in pts], '#BE123C', 1.4))
    for p in pts[:8]:
        out.append(dot(cx + p[0] * u, cy - p[1] * u, 2.2, '#BE123C'))
    tx, ty = cx + cos(th) * u, cy - sin(th) * u
    out.append(poly([(cx, cy), (tx, ty)], '#0E9384', 1.6))
    out.append(dot(tx, ty, 3.8, '#0E9384'))
    out.append(txt(tx + 7, ty - 4, 'e^(iθ)', 9.5, '#0E9384', w=800))
    out.append(txt(14, 163, '붉은 꺾인 선 = 급수의 부분합이 한 점으로 모여 가는 길', 9.5, '#6B7280'))
    out.append(txt(228, 48, 'θ = 60° 일 때', 10, '#111827', w=800))
    out.append(txt(228, 70, 'cos θ = %.5f' % cos(th), 10, '#6B7280'))
    out.append(txt(228, 88, 'sin θ = %.5f' % sin(th), 10, '#6B7280'))
    out.append(txt(228, 112, '12 항까지의 오차', 10, '#111827', w=800))
    out.append(txt(228, 130, '%.1e' % err, 11, '#BE123C', w=800))
    out.append(txt(228, 152, '크기는 언제나 1 — 원 위의 점', 9.5, '#0E9384', w=800))
    out.append(cap('급수가 어떻게 원을 그릴까'))
    return ''.join(out)


# ── 317 · 각을 두 배로 ──────────────────────────────────────────────
def cx317():
    r, deg = 1.0, 30.0
    assert abs(r * r - 1) < 1e-12
    out = []
    for k, (lab, ang, rr, col) in enumerate([('z', deg, r, '#2563EB'),
                                             ('z²', 2 * deg, r * r, '#BE123C')]):
        cx, cy, u = 92.0 + k * 196.0, 100.0, 50.0
        out.append(cross(cx, cy, 58))
        out.append('<circle cx="%.1f" cy="%.1f" r="%.1f" fill="none" stroke="#9CA3AF" '
                   'stroke-width="1.0" stroke-dasharray="4 3"/>' % (cx, cy, u))
        half = [(cx + cos(radians(t)) * u, cy - sin(radians(t)) * u)
                for t in range(0, 181 if k == 0 else 361, 5)]
        out.append(poly(half, col, 2.2))
        px, py = cx + cos(radians(ang)) * rr * u, cy - sin(radians(ang)) * rr * u
        out.append(poly([(cx, cy), (px, py)], col, 1.6))
        out.append(dot(px, py, 3.8, col))
        out.append(txt(px + 7, py - 4, '%.0f°' % ang, 9.5, col, w=800))
        out.append(txt(cx, 44, lab + (' (위쪽 반원)' if k == 0 else ' (원 전체)'), 10, col,
                       anc='middle', w=800))
    out.append(txt(14, 163, '크기는 제곱되고 각은 두 배가 된다 — 반원이 원 전체를 덮는다',
                   9.5, '#6B7280'))
    out.append(cap('제곱하면 각이 어떻게 될까'))
    return ''.join(out)


# ── 318 · 12시 다음이 1시 ───────────────────────────────────────────
def mg318():
    n, a = 5, 2
    inv = (n - a) % n
    assert (a + inv) % n == 0
    cx, cy, u = 104.0, 98.0, 54.0
    out = ['<circle cx="%.1f" cy="%.1f" r="%.1f" fill="none" stroke="#9CA3AF" '
           'stroke-width="1.2"/>' % (cx, cy, u)]
    for i in range(n):
        ang = pi / 2 - 2 * pi * i / n
        px, py = cx + cos(ang) * u, cy - sin(ang) * u
        hot = i in (a, inv)
        out.append('<circle cx="%.1f" cy="%.1f" r="12" fill="%s" fill-opacity="%s" '
                   'stroke="%s" stroke-width="1.3"/>'
                   % (px, py, '#2563EB' if hot else '#FFFFFF', '.20' if hot else '1',
                      '#2563EB' if hot else '#9CA3AF'))
        out.append(txt(px, py + 4, str(i), 10, '#2563EB' if hot else '#6B7280',
                       anc='middle', w=800 if hot else None))
    a_ang = pi / 2 - 2 * pi * a / n
    out.append(arrow(cx, cy, cx + cos(a_ang) * (u - 16), cy - sin(a_ang) * (u - 16),
                     '#0E9384', 1.8))
    out.append(txt(14, 163, '0 부터 %d 까지만 있는 시계 — 넘으면 다시 0 으로 돌아온다' % (n - 1),
                   9.5, '#6B7280'))
    out.append(txt(214, 44, 'n = %d 인 시계' % n, 10, '#111827', w=800))
    out.append(txt(214, 66, 'a = %d 의 역원은 %d' % (a, inv), 10.5, '#2563EB', w=800))
    out.append(txt(214, 88, '%d + %d = %d → 나머지 0' % (a, inv, a + inv), 10.5, '#0E9384',
                   w=800))
    out.append(txt(214, 112, '어떤 a 를 골라도', 9.5, '#6B7280'))
    out.append(txt(214, 128, '0 으로 되돌리는 짝이 있다', 9.5, '#6B7280'))
    out.append(txt(214, 148, '이것이 군(群)의 조건이다', 9.5, '#111827', w=800))
    out.append(cap('12시 다음이 1시인 셈에도 규칙이 있을까'))
    return ''.join(out)


# ── 319 · 돌리고 뒤집기 ─────────────────────────────────────────────
def sg319():
    """정삼각형의 대칭 여섯 — r(120° 회전) 과 s(한 축 뒤집기) 는 순서가 중요하다."""
    def comp(p, q):                                      # p 다음 q
        return tuple(q[p[i]] for i in range(3))

    e = (0, 1, 2)
    r = (1, 2, 0)
    s = (0, 2, 1)
    rs = comp(r, s)
    sr = comp(s, r)
    assert rs != sr, (rs, sr)
    out = []
    for k, (lab, perm, col) in enumerate([('먼저 돌리고 → 뒤집기', rs, '#2563EB'),
                                          ('먼저 뒤집고 → 돌리기', sr, '#BE123C')]):
        ox, oy, u = 92.0 + k * 196.0, 110.0, 44.0
        P = [(ox + cos(radians(90 + 120 * i)) * u, oy - sin(radians(90 + 120 * i)) * u)
             for i in range(3)]
        out.append(shape(P, col, '.10', stroke=col, sw=1.6))
        names = ['가', '나', '다']
        for i in range(3):
            out.append(dot(P[i][0], P[i][1], 4.0, col))
            out.append(txt(P[i][0], P[i][1] - 9, names[perm[i]], 9.5, col,
                           anc='middle', w=800))
        out.append(txt(ox, 42, lab, 9.5, col, anc='middle', w=800))
    out.append(txt(14, 163, '같은 두 동작인데 순서를 바꾸면 꼭짓점이 다른 자리에 간다', 9.5, '#6B7280'))
    out.append(txt(200, 150, '→ 교환법칙이 성립하지 않는다', 10, '#111827', anc='middle', w=800))
    out.append(cap('돌리고 뒤집는 순서가 중요할까'))
    return ''.join(out)


# ── 320 · 가정을 하나 바꾸면 ────────────────────────────────────────
def sn320():
    DATA = [100, 118, 140, 166, 192, 225]
    g = 0.20

    def model(k, t):
        if k == 'exp':
            return 100 * (1 + g) ** t
        if k == 'lin':
            return 100 + 100 * g * t
        K = 900.0
        return K / (1 + (K / 100 - 1) * exp(-g * t))

    T = 24
    vals = {k: model(k, T) for k in ('exp', 'log', 'lin')}
    spread = max(vals.values()) / min(vals.values())
    assert spread > 3, spread
    ox, oy, W, H = 40.0, 146.0, 150.0, 104.0
    mx = max(model('exp', t) for t in range(T + 1))
    X = lambda t: ox + t / T * W
    Y = lambda v: oy - v / mx * H
    out = [poly([(ox - 6, oy), (ox + W + 12, oy)], GREY, 1.0), head(ox + W + 16, oy, 1, 0),
           poly([(ox, oy + 6), (ox, oy - H - 10)], GREY, 1.0), head(ox, oy - H - 14, 0, -1)]
    for k, col in (('exp', '#BE123C'), ('log', '#0E9384'), ('lin', '#2563EB')):
        out.append(poly([(X(t), Y(model(k, t))) for t in range(T + 1)], col, 2.0))
    for i, v in enumerate(DATA):
        out.append(dot(X(i), Y(v), 2.8, '#111827'))
    out.append(txt(ox + 4, oy - H - 2, '같은 6 개월 자료에서 출발', 9, '#6B7280'))
    out.append(txt(14, 163, '검은 점 = 실제 관측값 · 세 곡선 모두 이 점들에 맞춘 것', 9.5, '#6B7280'))
    out.append(txt(212, 44, '%d 개월 뒤 예측' % T, 10, '#111827', w=800))
    for i, (k, nm, col) in enumerate((('exp', '지수', '#BE123C'), ('log', '로지스틱', '#0E9384'),
                                      ('lin', '선형', '#2563EB'))):
        out.append(txt(212, 66 + i * 18, '%-5s %s' % (nm, '{:,}'.format(int(round(vals[k])))),
                       10, col, w=800))
    out.append(txt(212, 126, '가장 큰 값이 가장 작은 값의', 9.5, '#6B7280'))
    out.append(txt(212, 144, '%.1f 배 — 가정 하나의 차이다' % spread, 10, '#BE123C', w=800))
    out.append(cap('가정을 하나 바꾸면 예측이 얼마나 달라질까'))
    return ''.join(out)


FNS = [('su311', su311), ('cm312', cm312), ('ed313', ed313), ('uc314', uc314), ('fs315', fs315),
       ('ef316', ef316), ('cx317', cx317), ('mg318', mg318), ('sg319', sg319), ('sn320', sn320)]

if __name__ == '__main__':
    import sys
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass
    for nm, f in FNS:
        sys.stdout.write('%-7s %5d자  ok\n' % (nm, len(f())))
