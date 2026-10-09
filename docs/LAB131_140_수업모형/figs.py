# -*- coding: utf-8 -*-
"""LAB 131~140 「오늘의 문제」 그림 — 좌표를 계산해서 그린다."""
import math

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


# ── 131 · 닫힌 구간과 열린 구간 ─────────────────────────────────────
def ev131():
    f = lambda x: 1.0 + 2.6 * x - 0.6 * x * x
    out = []
    for i, (closed, nm, col) in enumerate(((True, '닫힌구간 [0, 4] — 최댓값이 있다', '#0E9384'),
                                           (False, '열린구간 (0, 4) — 끝에 못 닿는다', '#BE123C'))):
        ox = 26 + i * 188
        X = lambda t: ox + 12 + 38.0 * t
        Y = lambda v: 124 - 15.0 * v
        out.append('<rect x="%d" y="28" width="170" height="104" rx="9" fill="#fff" stroke="#E5E7EB" stroke-width="1.2"/>' % ox)
        out.append('<path d="M%.0f 124 H%.0f" stroke="#9CA3AF" stroke-width="1.1"/>' % (ox + 8, ox + 164))
        out.append('<path d="%s" stroke="%s" stroke-width="2.4" fill="none" stroke-linecap="round"/>'
                   % (curve(f, 0, 4, X, Y, 30, 130), col))
        for t in (0.0, 4.0):
            if closed:
                out.append('<circle cx="%.1f" cy="%.1f" r="4.4" fill="%s"/>' % (X(t), Y(f(t)), col))
            else:
                out.append('<circle cx="%.1f" cy="%.1f" r="4.4" fill="#fff" stroke="%s" stroke-width="2"/>' % (X(t), Y(f(t)), col))
        # 꼭대기 (x = 2.1667) 는 두 경우 모두 안쪽이라 있다 — 끝값이 최대인 쪽을 보이려고 함수를 단조로 바꾼다
        out.append('<text x="%d" y="150" font-size="10.5" font-weight="800" fill="%s" text-anchor="middle"%s>%s</text>'
                   % (ox + 85, col, HALO, nm))
    out.append('<text x="200" y="20" font-size="10.5" fill="#6B7280" text-anchor="middle"%s>끝을 포함하느냐 아니냐 — 그것만 다르다</text>' % HALO)
    out.append('<text x="200" y="166" font-size="10.5" fill="#6B7280" text-anchor="middle"%s>닫힌구간에서 «연속»이면 최댓값·최솟값이 반드시 있다</text>' % HALO)
    return ''.join(out)


# ── 132 · 꺾인 점에는 접선이 없다 ───────────────────────────────────
def cu132():
    X = lambda t: 200 + 46.0 * t
    Y = lambda v: 132 - 40.0 * v
    out = ['<path d="M44 132 H368 M200 24 V152" stroke="#9CA3AF" stroke-width="1.2"/>',
           '<path d="%s" stroke="#2563EB" stroke-width="2.6" fill="none" stroke-linejoin="round"/>'
           % curve(lambda t: abs(t), -2.4, 2.4, X, Y),
           '<circle cx="%.0f" cy="%.0f" r="5" fill="#BE123C"/>' % (X(0), Y(0))]
    for s, nm, col in ((-1, '왼쪽 기울기 −1', '#B45309'), (1, '오른쪽 기울기 +1', '#0E9384')):
        out.append('<path d="M%.1f %.1f L%.1f %.1f" stroke="%s" stroke-width="1.8" stroke-dasharray="5 3"/>'
                   % (X(0), Y(0), X(s * 2.2), Y(2.2), col))
        out.append('<text x="%.1f" y="%.1f" font-size="10" font-weight="800" fill="%s" text-anchor="%s"%s>%s</text>'
                   % (X(s * 2.3), Y(2.3) + (14 if s < 0 else 14), col, 'start' if s < 0 else 'end', HALO, nm))
    out.append('<text x="200" y="20" font-size="10.5" fill="#6B7280" text-anchor="middle"%s>이어져 있는데도 «그 점의 기울기»를 말할 수 없다</text>' % HALO)
    out.append('<text x="200" y="166" font-size="10.5" fill="#6B7280" text-anchor="middle"%s>좌·우 기울기가 달라 하나로 정해지지 않는다</text>' % HALO)
    return ''.join(out)


# ── 133 · 접선과 법선은 수직 ────────────────────────────────────────
def tg133():
    a, c = 1.0, 0.5
    m = 2 * c * a
    nslope = -1 / m
    assert abs(m * nslope + 1) < 1e-12
    X = lambda t: 150 + 54.0 * t
    Y = lambda v: 132 - 36.0 * v
    out = ['<path d="M40 132 H368 M150 20 V152" stroke="#9CA3AF" stroke-width="1.2"/>',
           '<path d="%s" stroke="#2563EB" stroke-width="2.4" fill="none" stroke-linecap="round"/>'
           % curve(lambda t: c * t * t, -1.8, 2.5, X, Y)]
    px, py = a, c * a * a
    for sl, col, nm, L in ((m, '#BE123C', '접선', 1.5), (nslope, '#0E9384', '법선', 1.0)):
        out.append('<path d="M%.1f %.1f L%.1f %.1f" stroke="%s" stroke-width="2"/>'
                   % (X(px - L), Y(py - sl * L), X(px + L), Y(py + sl * L), col))
        out.append('<text x="%.1f" y="%.1f" font-size="10.5" font-weight="800" fill="%s"%s>%s</text>'
                   % (X(px + L) + 5, Y(py + sl * L) + 4, col, HALO, nm))
    out.append('<circle cx="%.1f" cy="%.1f" r="5" fill="#111827"/>' % (X(px), Y(py)))
    out.append('<text x="300" y="42" font-size="10.5" font-weight="800" fill="#111827"%s>접선 × 법선 = −1</text>' % HALO)
    out.append('<text x="200" y="16" font-size="10.5" fill="#6B7280" text-anchor="middle"%s>곡면이 «바라보는 쪽»은 접선에 수직이다</text>' % HALO)
    return ''.join(out)


# ── 134 · 도함수의 부호가 봉우리를 만든다 ───────────────────────────
def sg134():
    b = -3.0
    f = lambda x: x ** 3 + b * x
    r = math.sqrt(-b / 3)
    assert abs(f(-r) - 2) < 1e-9 and abs(f(r) + 2) < 1e-9
    X = lambda t: 200 + 44.0 * t
    Y = lambda v: 88 - 13.0 * v
    out = ['<path d="M40 88 H368 M200 20 V156" stroke="#9CA3AF" stroke-width="1.2"/>',
           '<path d="%s" stroke="#2563EB" stroke-width="2.4" fill="none" stroke-linecap="round"/>'
           % curve(f, -2.5, 2.5, X, Y)]
    for t, nm, col in ((-r, '극대', '#BE123C'), (r, '극소', '#0E9384')):
        out.append('<circle cx="%.1f" cy="%.1f" r="5" fill="%s"/>' % (X(t), Y(f(t)), col))
        out.append('<path d="M%.1f %.1f H%.1f" stroke="%s" stroke-width="1.6" stroke-dasharray="4 3"/>'
                   % (X(t) - 26, Y(f(t)), X(t) + 26, col))
        out.append('<text x="%.1f" y="%.1f" font-size="10.5" font-weight="800" fill="%s" text-anchor="middle"%s>%s %.0f</text>'
                   % (X(t), Y(f(t)) + (-11 if t < 0 else 18), col, HALO, nm, f(t)))
    out.append('<text x="%.1f" y="150" font-size="10" font-weight="800" fill="#92400E" text-anchor="middle"%s>f′ &gt; 0</text>' % (X(-1.9), HALO))
    out.append('<text x="200" y="150" font-size="10" font-weight="800" fill="#92400E" text-anchor="middle"%s>f′ &lt; 0</text>' % HALO)
    out.append('<text x="%.1f" y="150" font-size="10" font-weight="800" fill="#92400E" text-anchor="middle"%s>f′ &gt; 0</text>' % (X(1.9), HALO))
    out.append('<text x="200" y="16" font-size="10.5" fill="#6B7280" text-anchor="middle"%s>오르막이 내리막으로 바뀌는 자리 — 거기가 봉우리</text>' % HALO)
    return ''.join(out)


# ── 135 · 종이 한 장으로 가장 큰 상자 ───────────────────────────────
def bx135():
    W = H = 30.0
    V = lambda x: x * (W - 2 * x) * (H - 2 * x)
    best = max((V(i / 1000.0), i / 1000.0) for i in range(1, 14990))
    assert abs(best[1] - 5.0) < 0.01 and abs(best[0] - 2000.0) < 1.0, best
    X = lambda x: 56 + 20.0 * x
    Y = lambda v: 146 - 0.056 * v
    out = ['<path d="M48 146 H378 M56 154 V22" stroke="#9CA3AF" stroke-width="1.2"/>',
           '<path d="%s" stroke="#2563EB" stroke-width="2.4" fill="none" stroke-linecap="round"/>'
           % curve(V, 0.1, 14.6, X, Y),
           '<circle cx="%.1f" cy="%.1f" r="5.4" fill="#BE123C"/>' % (X(best[1]), Y(best[0])),
           '<path d="M%.1f %.1f V146" stroke="#BE123C" stroke-width="1.3" stroke-dasharray="4 3"/>' % (X(best[1]), Y(best[0])),
           '<text x="%.1f" y="%.1f" font-size="10.5" font-weight="800" fill="#BE123C" text-anchor="middle"%s>x = %g 에서 %g cm³</text>'
           % (X(best[1]) + 46, Y(best[0]) - 8, HALO, best[1], best[0]),
           '<text x="%.1f" y="160" font-size="10" fill="#6B7280" text-anchor="middle"%s>잘라내는 길이 x →</text>' % (X(7), HALO),
           '<text x="200" y="18" font-size="10.5" fill="#6B7280" text-anchor="middle"%s>조금 자르면 낮고, 많이 자르면 좁다 — 어디가 가장 클까</text>' % HALO]
    return ''.join(out)


# ── 136 · 위치 · 속도 · 가속도 ──────────────────────────────────────
def mo136():
    s = lambda t: 6.0 * t * t - 0.4 * t * t * t
    v = lambda t: 12.0 * t - 1.2 * t * t
    top = 10.0
    assert abs(v(top)) < 1e-9
    X = lambda t: 54 + 30.0 * t
    out = []
    Ys = lambda u: 86 - 0.30 * u
    Yv = lambda u: 150 - 1.1 * u
    out.append('<path d="M46 86 H374" stroke="#9CA3AF" stroke-width="1.1"/>')
    out.append('<path d="M46 150 H374" stroke="#9CA3AF" stroke-width="1.1"/>')
    out.append('<path d="%s" stroke="#2563EB" stroke-width="2.4" fill="none" stroke-linecap="round"/>'
               % curve(s, 0, 10.4, X, Ys, 20, 92))
    out.append('<path d="%s" stroke="#0E9384" stroke-width="2.2" fill="none" stroke-linecap="round"/>'
               % curve(v, 0, 10.4, X, Yv, 96, 158))
    out.append('<circle cx="%.1f" cy="%.1f" r="4.6" fill="#BE123C"/>' % (X(top), Ys(s(top))))
    out.append('<circle cx="%.1f" cy="%.1f" r="4.6" fill="#BE123C"/>' % (X(top), Yv(0)))
    out.append('<path d="M%.1f %.1f V%.1f" stroke="#BE123C" stroke-width="1.2" stroke-dasharray="4 3"/>' % (X(top), Ys(s(top)), Yv(0)))
    out.append('<text x="%.1f" y="%.1f" font-size="10" font-weight="800" fill="#BE123C" text-anchor="end"%s>여기서 멈춘다</text>' % (X(top) - 7, Ys(s(top)) - 6, HALO))
    out.append('<text x="60" y="34" font-size="10" font-weight="800" fill="#1D4ED8"%s>위치 s</text>' % HALO)
    out.append('<text x="60" y="110" font-size="10" font-weight="800" fill="#0B6E63"%s>속도 v</text>' % HALO)
    out.append('<text x="200" y="18" font-size="10.5" fill="#6B7280" text-anchor="middle"%s>위치 그래프의 봉우리에서 속도는 얼마일까</text>' % HALO)
    return ''.join(out)


# ── 137 · 직사각형으로 곡선 아래를 덮는다 ───────────────────────────
def rm137():
    f = lambda x: x * x
    n = 6
    dx = 1.0 / n
    left = sum(f(i * dx) * dx for i in range(n))
    assert left < 1.0 / 3
    X = lambda x: 72 + 232.0 * x
    Y = lambda v: 146 - 112.0 * v
    out = ['<path d="M64 146 H340 M72 154 V26" stroke="#9CA3AF" stroke-width="1.2"/>']
    for i in range(n):
        xl = i * dx
        out.append('<rect x="%.1f" y="%.1f" width="%.1f" height="%.1f" fill="#2563EB" opacity=".20" stroke="#2563EB" stroke-width="0.9"/>'
                   % (X(xl), Y(f(xl)), 232.0 * dx, 146 - Y(f(xl))))
    out.append('<path d="%s" stroke="#BE123C" stroke-width="2.4" fill="none" stroke-linecap="round"/>'
               % curve(f, 0, 1, X, Y))
    out.append('<text x="348" y="60" font-size="10.5" font-weight="800" fill="#1D4ED8"%s>왼쪽 끝 합</text>' % HALO)
    out.append('<text x="348" y="78" font-size="11" font-weight="800" fill="#1D4ED8"%s>%.4f</text>' % (HALO, left))
    out.append('<text x="348" y="104" font-size="10.5" font-weight="800" fill="#BE123C"%s>참값</text>' % HALO)
    out.append('<text x="348" y="122" font-size="11" font-weight="800" fill="#BE123C"%s>0.3333</text>' % HALO)
    out.append('<text x="200" y="20" font-size="10.5" fill="#6B7280" text-anchor="middle"%s>굽은 곡선 아래 넓이를 네모로 덮어 잰다</text>' % HALO)
    return ''.join(out)


# ── 138 · 넓이를 미분하면 높이 ──────────────────────────────────────
def ft138():
    f = lambda t: t
    A = lambda x: x * x / 2
    x0 = 2.0
    d = (A(x0 + 1e-5) - A(x0 - 1e-5)) / 2e-5
    assert abs(d - f(x0)) < 1e-6
    X = lambda t: 60 + 62.0 * t
    Y = lambda v: 140 - 26.0 * v
    out = ['<path d="M52 140 H366 M60 148 V26" stroke="#9CA3AF" stroke-width="1.2"/>',
           '<path d="M%.1f %.1f L%.1f %.1f L%.1f %.1f Z" fill="#2563EB" opacity=".20" stroke="#2563EB" stroke-width="1.2"/>'
           % (X(0), Y(0), X(x0), Y(0), X(x0), Y(f(x0))),
           '<path d="%s" stroke="#2563EB" stroke-width="2.4" fill="none" stroke-linecap="round"/>'
           % curve(f, 0, 4.6, X, Y),
           '<path d="M%.1f %.1f V%.1f" stroke="#BE123C" stroke-width="2"/>' % (X(x0), Y(0), Y(f(x0))),
           '<text x="%.1f" y="%.1f" font-size="10.5" font-weight="800" fill="#BE123C"%s>높이 f(x) = %g</text>' % (X(x0) + 8, Y(f(x0)) + 4, HALO, f(x0)),
           '<text x="%.1f" y="%.1f" font-size="10.5" font-weight="800" fill="#1D4ED8" text-anchor="middle"%s>넓이 A(x) = %g</text>' % (X(x0 * 0.55), Y(0.45), HALO, A(x0)),
           '<text x="200" y="20" font-size="10.5" fill="#6B7280" text-anchor="middle"%s>오른쪽 끝을 조금 밀면 넓이가 얼마나 늘까</text>' % HALO,
           '<text x="200" y="164" font-size="10.5" fill="#6B7280" text-anchor="middle"%s>늘어난 넓이 ÷ 민 거리 — 그것이 바로 높이다</text>' % HALO]
    return ''.join(out)


# ── 139 · 변위와 이동 거리 ──────────────────────────────────────────
def ac139():
    v = lambda t: 4 - t
    T = 6.0
    disp = 4 * T - T * T / 2
    dist = 8 + 2
    assert abs(disp - 6) < 1e-9 and abs(dist - 10) < 1e-9
    X = lambda t: 58 + 48.0 * t
    Y = lambda u: 92 - 12.0 * u
    out = ['<path d="M50 92 H370 M58 26 V152" stroke="#9CA3AF" stroke-width="1.2"/>',
           '<path d="M%.1f %.1f L%.1f %.1f L%.1f %.1f Z" fill="#0E9384" opacity=".22" stroke="#0E9384" stroke-width="1.2"/>'
           % (X(0), Y(0), X(4), Y(0), X(0), Y(4)),
           '<path d="M%.1f %.1f L%.1f %.1f L%.1f %.1f Z" fill="#BE123C" opacity=".22" stroke="#BE123C" stroke-width="1.2"/>'
           % (X(4), Y(0), X(6), Y(0), X(6), Y(-2)),
           '<path d="%s" stroke="#2563EB" stroke-width="2.4" fill="none" stroke-linecap="round"/>'
           % curve(v, 0, 6.4, X, Y),
           '<text x="%.1f" y="%.1f" font-size="11" font-weight="800" fill="#0B6E63" text-anchor="middle"%s>+8</text>' % (X(1.3), Y(1.1), HALO),
           '<text x="%.1f" y="%.1f" font-size="11" font-weight="800" fill="#BE123C" text-anchor="middle"%s>−2</text>' % (X(5.3), Y(-0.8), HALO),
           '<text x="200" y="20" font-size="10.5" fill="#6B7280" text-anchor="middle"%s>속도가 음수가 되면 — 되돌아온다</text>' % HALO,
           '<text x="200" y="166" font-size="10.5" fill="#6B7280" text-anchor="middle"%s>변위는 8 − 2 = 6, 이동 거리는 8 + 2 = 10</text>' % HALO]
    return ''.join(out)


# ── 140 · 두 그래프 사이의 넓이 ─────────────────────────────────────
def bt140():
    a = 1.0
    area = a ** 3 / 6
    assert abs(area - 1.0 / 6) < 1e-12
    X = lambda x: 112 + 112.0 * x
    Y = lambda v: 134 - 76.0 * v
    out = ['<path d="M46 134 H366 M112 24 V152" stroke="#9CA3AF" stroke-width="1.2"/>']
    band = []
    for i in range(61):
        x = i / 60.0
        band.append('%s%.1f %.1f' % ('M' if i == 0 else 'L', X(x), Y(a * x)))
    for i in range(60, -1, -1):
        x = i / 60.0
        band.append('L%.1f %.1f' % (X(x), Y(x * x)))
    out.append('<path d="%s Z" fill="#2563EB" opacity=".18"/>' % ' '.join(band))
    out.append('<path d="%s" stroke="#0E9384" stroke-width="2.2" fill="none" stroke-linecap="round"/>'
               % curve(lambda x: a * x, -0.5, 1.7, X, Y))
    out.append('<path d="%s" stroke="#BE123C" stroke-width="2.2" fill="none" stroke-linecap="round"/>'
               % curve(lambda x: x * x, -0.5, 1.4, X, Y))
    for t in (0.0, 1.0):
        out.append('<circle cx="%.1f" cy="%.1f" r="4.4" fill="#111827"/>' % (X(t), Y(t * t)))
    out.append('<text x="%.1f" y="%.1f" font-size="10.5" font-weight="800" fill="#1D4ED8" text-anchor="middle"%s>넓이 = 1/6</text>' % (X(0.55), Y(0.36), HALO))
    out.append('<text x="%.1f" y="%.1f" font-size="10" font-weight="800" fill="#0B6E63"%s>y = x</text>' % (X(1.3) + 4, Y(1.3), HALO))
    out.append('<text x="%.1f" y="%.1f" font-size="10" font-weight="800" fill="#BE123C"%s>y = x²</text>' % (X(1.25) + 4, Y(1.25 ** 2) + 14, HALO))
    out.append('<text x="200" y="18" font-size="10.5" fill="#6B7280" text-anchor="middle"%s>어느 쪽이 위인지 바뀌면 그냥 적분은 틀린다</text>' % HALO)
    return ''.join(out)
