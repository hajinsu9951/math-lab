# -*- coding: utf-8 -*-
"""LAB 151~160 「오늘의 문제」 그림 — 좌표를 계산해서 그린다.

그림 속 숫자는 모두 여기서 계산한다. 각 함수는 끝에서 assert 로 참인지 확인한다.
"""
import math
from math import comb, sqrt, erf, exp, pi, ceil, cos, sin, cosh, sinh, radians, hypot

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


def pmf(n, k, p):
    return comb(n, k) * p ** k * (1 - p) ** (n - k)


def nrm(x, mu, sd):
    return exp(-(x - mu) ** 2 / (2 * sd * sd)) / (sd * sqrt(2 * pi))


# ── 151 · 100번에 60번 앞면 ────────────────────────────────────────
def bd151():
    n, p, k0 = 100, 0.5, 60
    ps = [pmf(n, i, p) for i in range(n + 1)]
    tail = sum(ps[k0:])
    z = (k0 - n * p) / sqrt(n * p * (1 - p))
    assert abs(z - 2.0) < 1e-12
    assert abs(tail * 100 - 2.84) < 0.01, tail

    lo, hi = 28, 72                       # 눈에 보이는 범위만 그린다 (바깥은 거의 0)
    assert sum(ps[lo:hi + 1]) > 0.999
    BW = 300.0 / (hi - lo + 1)
    X = lambda i: 50 + BW * (i - lo)
    base, top = 132.0, 40.0
    S = (base - top) / max(ps)
    out = ['<path d="M44 %g H364" stroke="#9CA3AF" stroke-width="1.2"/>' % base]
    for i in range(lo, hi + 1):
        hot = i >= k0
        out.append('<rect x="%.1f" y="%.1f" width="%.1f" height="%.1f" fill="%s" opacity="%s"/>'
                   % (X(i), base - S * ps[i], BW - 0.6, S * ps[i],
                      '#BE123C' if hot else '#2563EB', '.55' if hot else '.26'))
    for i, lab in ((50, 'μ = 50'), (k0, '60')):
        out.append('<path d="M%.1f %.1f V%.1f" stroke="#111827" stroke-width="1.1" stroke-dasharray="4 3"/>'
                   % (X(i) + BW / 2, base, base - S * ps[i] - 12))
        out.append('<text x="%.1f" y="%.1f" font-size="10" font-weight="800" fill="#111827" text-anchor="middle"%s>%s</text>'
                   % (X(i) + BW / 2, base - S * ps[i] - 16, HALO, lab))
    out.append('<text x="364" y="60" font-size="10.5" font-weight="800" fill="#BE123C" text-anchor="end"%s>'
               'P(X ≥ %d) = %.2f%%</text>' % (HALO, k0, tail * 100))
    out.append('<text x="364" y="76" font-size="10" fill="#6B7280" text-anchor="end"%s>'
               'z = (%d − %g) ÷ %g = %.1f</text>' % (HALO, k0, n * p, sqrt(n * p * (1 - p)), z))
    out.append('<text x="50" y="148" font-size="10" fill="#6B7280"%s>앞면이 나온 횟수 →</text>' % HALO)
    out.append(cap('100번 던져 60번 앞면 — 그냥 운일까, 의심할 일일까'))
    return ''.join(out)


# ── 152 · 이항분포가 종 모양이 되는 순간 ───────────────────────────
def dm152():
    p = 0.5
    panels = (5, 20, 80)
    out = []
    for j, n in enumerate(panels):
        ox = 18 + j * 128
        ps = [pmf(n, i, p) for i in range(n + 1)]
        mu, sd = n * p, sqrt(n * p * (1 - p))
        lo = max(0, int(mu - 3.2 * sd)); hi = min(n, int(mu + 3.2 * sd) + 1)
        BW = 104.0 / (hi - lo + 1)
        X = lambda i: ox + 6 + BW * (i - lo)
        base, top = 132.0, 46.0
        S = (base - top) / max(ps)
        out.append('<rect x="%d" y="30" width="116" height="112" rx="8" fill="#fff" stroke="#E5E7EB" stroke-width="1.1"/>' % ox)
        for i in range(lo, hi + 1):
            out.append('<rect x="%.1f" y="%.1f" width="%.1f" height="%.1f" fill="#2563EB" opacity=".26"/>'
                       % (X(i), base - S * ps[i], max(BW - 0.6, 0.8), S * ps[i]))
        out.append('<path d="%s" stroke="#BE123C" stroke-width="1.8" fill="none"/>'
                   % curve(lambda x: base - S * nrm(x, mu, sd), lo - 0.5, hi + 0.5,
                           lambda x: X(x) + BW / 2, lambda v: v, 36, 136))
        out.append('<text x="%d" y="%d" font-size="10.5" font-weight="800" fill="#1D4ED8" text-anchor="middle"%s>n = %d</text>'
                   % (ox + 58, 44, HALO, n))
        out.append('<text x="%d" y="156" font-size="9.5" fill="#6B7280" text-anchor="middle"%s>np = %g · n(1−p) = %g</text>'
                   % (ox + 58, HALO, n * p, n * (1 - p)))
    assert panels[0] * p < 5 <= panels[1] * p      # 5 를 넘기는 자리가 두 번째 칸이다
    out.append(cap('던지는 횟수를 늘리면 막대가 무엇으로 바뀔까'))
    return ''.join(out)


# ── 153 · 68 · 95 · 99.7 법칙 ──────────────────────────────────────
def sr153():
    mu, sd = 0.0, 1.0
    pct = [erf(z / sqrt(2)) for z in (1, 2, 3)]
    assert abs(pct[0] * 100 - 68.3) < 0.05 and abs(pct[1] * 100 - 95.4) < 0.05 and abs(pct[2] * 100 - 99.7) < 0.05

    X = lambda x: 200 + 48.0 * x
    base = 132.0
    Y = lambda v: base - 190.0 * v
    out = []
    for z, col, op in ((3, '#2563EB', '.10'), (2, '#2563EB', '.16'), (1, '#2563EB', '.26')):
        pts = []
        for i in range(81):
            x = -z + 2 * z * i / 80.0
            pts.append('%s%.1f %.1f' % ('M' if i == 0 else 'L', X(x), Y(nrm(x, mu, sd))))
        pts.append('L%.1f %.1f L%.1f %.1f Z' % (X(z), base, X(-z), base))
        out.append('<path d="%s" fill="%s" opacity="%s"/>' % (' '.join(pts), col, op))
    out.append('<path d="M44 %g H364" stroke="#9CA3AF" stroke-width="1.2"/>' % base)
    out.append('<path d="%s" stroke="#1D4ED8" stroke-width="2.4" fill="none"/>'
               % curve(lambda x: nrm(x, mu, sd), -3.5, 3.5, X, Y, 24, 136))
    for i, z in enumerate((1, 2, 3)):
        out.append('<path d="M%.1f %g V%.1f" stroke="#6B7280" stroke-width="1" stroke-dasharray="3 3"/>'
                   % (X(z), base, Y(nrm(z, mu, sd))))
        out.append('<path d="M%.1f %g V%.1f" stroke="#6B7280" stroke-width="1" stroke-dasharray="3 3"/>'
                   % (X(-z), base, Y(nrm(-z, mu, sd))))
        out.append('<text x="%.1f" y="%d" font-size="10" fill="#374151" text-anchor="middle"%s>+%dσ</text>'
                   % (X(z), base + 14, HALO, z))
        out.append('<text x="%.1f" y="%d" font-size="10" fill="#374151" text-anchor="middle"%s>−%dσ</text>'
                   % (X(-z), base + 14, HALO, z))
        out.append('<text x="364" y="%d" font-size="10.5" font-weight="800" fill="#1D4ED8" text-anchor="end"%s>'
                   '±%dσ 안쪽 %.1f%%</text>' % (44 + i * 17, HALO, z, pct[i] * 100))
    out.append('<text x="%.1f" y="%d" font-size="10" fill="#6B7280" text-anchor="middle"%s>μ</text>'
               % (X(0), base + 14, HALO))
    out.append(cap('평균에서 2σ 안에는 몇 %나 들어 있을까'))
    return ''.join(out)


# ── 154 · 표본평균의 분포가 좁아진다 ───────────────────────────────
def cl154():
    sig = 2.42
    ns = (1, 4, 16)
    sds = [sig / sqrt(n) for n in ns]
    assert abs(sds[1] - sig / 2) < 1e-12 and abs(sds[2] - sig / 4) < 1e-12

    X = lambda x: 200 + 42.0 * x
    base = 134.0
    S = 150.0 / max(nrm(0, 0, s) for s in sds)
    out = ['<path d="M44 %g H364" stroke="#9CA3AF" stroke-width="1.2"/>' % base]
    for i, (n, s) in enumerate(zip(ns, sds)):
        col = ('#9CA3AF', '#0E9384', '#BE123C')[i]
        out.append('<path d="%s" stroke="%s" stroke-width="2.2" fill="none"/>'
                   % (curve(lambda x, s=s: base - S * nrm(x, 0, s), -3.4, 3.4, X, lambda v: v, 24, 138), col))
        out.append('<text x="364" y="%d" font-size="10.5" font-weight="800" fill="%s" text-anchor="end"%s>'
                   'n = %d → σ/√n = %.2f</text>' % (44 + i * 17, col, HALO, n, s))
    out.append('<path d="M%.1f 30 V%g" stroke="#111827" stroke-width="1.1" stroke-dasharray="4 3"/>' % (X(0), base))
    out.append('<text x="%.1f" y="%d" font-size="10" fill="#374151" text-anchor="middle"%s>모평균 μ</text>'
               % (X(0), base + 14, HALO))
    out.append('<text x="50" y="%d" font-size="10" fill="#6B7280"%s>표본평균 →</text>' % (base + 14, HALO))
    out.append(cap('한 명은 들쭉날쭉한데 평균은 왜 안정될까'))
    return ''.join(out)


# ── 155 · 95% 신뢰란 무슨 뜻일까 ───────────────────────────────────
def ci155():
    true_p, n, z = 0.50, 400, 1.960
    half = z * sqrt(0.25 / n)
    assert abs(half - 0.049) < 1e-4
    # 20번의 조사 — 가운데 값을 정규분포에서 뽑은 것처럼 고르게 흩어 놓는다
    offs = [-1.73, 0.42, -0.58, 1.08, -0.21, 0.77, -1.21, 0.15, 2.21, -0.86,
            0.63, -0.34, 1.42, -1.05, 0.28, -0.72, 0.95, -0.12, 0.51, -1.48]
    sd = half / z                       # 표준오차
    cent = [true_p + o * sd for o in offs]
    miss = [i for i, c in enumerate(cent) if abs(c - true_p) > half]
    assert len(miss) == 1 and miss[0] == 8, miss   # 20번 중 한 번만 놓친다

    X = lambda v: 200 + 1700.0 * (v - true_p)
    out = ['<path d="M%.1f 28 V148" stroke="#BE123C" stroke-width="1.6"/>' % X(true_p)]
    out.append('<text x="%.1f" y="24" font-size="10" font-weight="800" fill="#BE123C" text-anchor="middle"%s>참값</text>'
               % (X(true_p), HALO))
    for i, c in enumerate(cent):
        y = 36 + i * 5.6
        bad = i in miss
        col = '#BE123C' if bad else '#2563EB'
        out.append('<path d="M%.1f %.1f H%.1f" stroke="%s" stroke-width="%s" opacity="%s"/>'
                   % (X(c - half), y, X(c + half), col, '2.4' if bad else '1.8', '1' if bad else '.55'))
        out.append('<circle cx="%.1f" cy="%.1f" r="1.8" fill="%s"/>' % (X(c), y, col))
    out.append('<text x="364" y="%.1f" font-size="10" font-weight="800" fill="#BE123C" text-anchor="end"%s>이 한 번만 빗나갔다</text>'
               % (36 + miss[0] * 5.6 + 3.5, HALO))
    out.append('<text x="36" y="160" font-size="10" fill="#6B7280"%s>같은 조사를 20번 — %d번이 참값을 품었다 (%d/20)</text>'
               % (HALO, 20 - len(miss), 20 - len(miss)))
    out.append(cap('「95% 신뢰」는 무엇이 95%라는 말일까'))
    return ''.join(out)


# ── 156 · 몇 명에게 물어야 하나 ────────────────────────────────────
def ss156():
    z = 1.960
    err = lambda n: z * sqrt(0.25 / n) * 100
    need = ceil((z / 0.03) ** 2 * 0.25)
    assert need == 1068, need
    assert abs(err(400) - 4.90) < 0.01 and err(need) <= 3.0 < err(need - 1)

    X = lambda n: 52 + 300.0 * (n - 100) / 3900.0
    Y = lambda e: 140 - 13.0 * e
    out = ['<path d="M46 140 H364 M52 148 V28" stroke="#9CA3AF" stroke-width="1.2"/>']
    out.append('<path d="%s" stroke="#2563EB" stroke-width="2.4" fill="none" stroke-linecap="round"/>'
               % curve(err, 100, 4000, X, Y, 20, 146))
    out.append('<path d="M52 %.1f H364" stroke="#BE123C" stroke-width="1.2" stroke-dasharray="4 3"/>' % Y(3.0))
    out.append('<text x="364" y="%.1f" font-size="10" font-weight="800" fill="#BE123C" text-anchor="end"%s>±3%%p</text>'
               % (Y(3.0) - 5, HALO))
    out.append('<path d="M%.1f %.1f V140" stroke="#BE123C" stroke-width="1.2" stroke-dasharray="4 3"/>'
               % (X(need), Y(3.0)))
    out.append('<circle cx="%.1f" cy="%.1f" r="5" fill="#BE123C"/>' % (X(need), Y(3.0)))
    out.append('<text x="%.1f" y="%.1f" font-size="10.5" font-weight="800" fill="#BE123C"%s>n = %d</text>'
               % (X(need) + 9, Y(3.0) - 6, HALO, need))
    for n in (400, 1600):
        out.append('<circle cx="%.1f" cy="%.1f" r="3.6" fill="#2563EB"/>' % (X(n), Y(err(n))))
        out.append('<text x="%.1f" y="%.1f" font-size="9.5" fill="#1D4ED8"%s>%d명 → ±%.2f%%p</text>'
                   % (X(n) + 7, Y(err(n)) - 5, HALO, n, err(n)))
    out.append('<text x="200" y="156" font-size="10" fill="#6B7280" text-anchor="middle"%s>표본 크기 n →</text>' % HALO)
    out.append(cap('사람을 네 배로 늘리면 오차는 몇 분의 1이 될까'))
    return ''.join(out)


# ── 157 · 위성 안테나가 접시 모양인 까닭 ───────────────────────────
def pf157():
    p = 1.0                                  # y = x²/(4p), 초점 (0, p), 준선 y = −p
    f = lambda x: x * x / (4 * p)
    for x in (0.6, 1.4, 2.2):
        P = (x, f(x))
        assert abs(hypot(P[0], P[1] - p) - (P[1] + p)) < 1e-12   # 초점까지 = 준선까지

    X = lambda x: 200 + 52.0 * x
    Y = lambda y: 128 - 30.0 * y
    out = ['<path d="M%.1f %.1f H%.1f" stroke="#9CA3AF" stroke-width="1.3" stroke-dasharray="5 4"/>'
           % (X(-2.8), Y(-p), X(2.8))]
    out.append('<text x="%.1f" y="%.1f" font-size="9.5" fill="#6B7280"%s>준선 y = −p</text>' % (X(-2.8), Y(-p) + 13, HALO))
    out.append('<path d="%s" stroke="#1D4ED8" stroke-width="2.6" fill="none" stroke-linecap="round"/>'
               % curve(f, -2.6, 2.6, X, Y, 22, 140))
    for x in (-2.2, -1.2, 1.2, 2.2):
        P = (X(x), Y(f(x)))
        out.append('<path d="M%.1f 26 V%.1f" stroke="#0E9384" stroke-width="1.6"/>' % (P[0], P[1]))
        out.append('<path d="M%.1f %.1f L%.1f %.1f" stroke="#0E9384" stroke-width="1.6"/>'
                   % (P[0], P[1], X(0), Y(p)))
    out.append('<circle cx="%.1f" cy="%.1f" r="5.2" fill="#BE123C"/>' % (X(0), Y(p)))
    out.append('<text x="%.1f" y="%.1f" font-size="10.5" font-weight="800" fill="#BE123C"%s>초점 F</text>'
               % (X(0) + 9, Y(p) - 5, HALO))
    xs = 1.8
    out.append('<circle cx="%.1f" cy="%.1f" r="4" fill="#111827"/>' % (X(xs), Y(f(xs))))
    out.append('<text x="364" y="46" font-size="10.5" font-weight="800" fill="#1D4ED8" text-anchor="end"%s>'
               '점 P 에서 초점까지 = %.2f</text>' % (HALO, hypot(xs, f(xs) - p)))
    out.append('<text x="364" y="62" font-size="10.5" font-weight="800" fill="#0B6E63" text-anchor="end"%s>'
               'P 에서 준선까지 = %.2f</text>' % (HALO, f(xs) + p))
    out.append(cap('어디에 떨어진 전파든 같은 한 점으로 모인다 — 왜'))
    return ''.join(out)


# ── 158 · 두 압정과 실로 그리는 타원 ───────────────────────────────
def el158():
    a, c = 3.0, 1.5
    b = sqrt(a * a - c * c)
    for t in (20, 50, 140, 250):
        x, y = a * cos(radians(t)), b * sin(radians(t))
        assert abs(hypot(x + c, y) + hypot(x - c, y) - 2 * a) < 1e-9

    X = lambda x: 200 + 42.0 * x
    Y = lambda y: 90 - 42.0 * y
    pts = []
    for i in range(121):
        t = 2 * pi * i / 120
        pts.append('%s%.1f %.1f' % ('M' if i == 0 else 'L', X(a * cos(t)), Y(b * sin(t))))
    out = ['<path d="%s Z" stroke="#1D4ED8" stroke-width="2.4" fill="#2563EB" fill-opacity=".07"/>' % ' '.join(pts)]
    t = radians(50)
    P = (a * cos(t), b * sin(t))
    for s, nm, col in ((-c, 'F₁', '#BE123C'), (c, 'F₂', '#BE123C')):
        out.append('<path d="M%.1f %.1f L%.1f %.1f" stroke="#0E9384" stroke-width="2"/>'
                   % (X(s), Y(0), X(P[0]), Y(P[1])))
        out.append('<rect x="%.1f" y="%.1f" width="8" height="8" rx="2" fill="%s"/>' % (X(s) - 4, Y(0) - 4, col))
        out.append('<text x="%.1f" y="%.1f" font-size="10" font-weight="800" fill="%s" text-anchor="middle"%s>%s</text>'
                   % (X(s), Y(0) + 20, col, HALO, nm))
    out.append('<circle cx="%.1f" cy="%.1f" r="4.4" fill="#111827"/>' % (X(P[0]), Y(P[1])))
    out.append('<text x="%.1f" y="%.1f" font-size="10" font-weight="800" fill="#111827"%s>P</text>'
               % (X(P[0]) + 7, Y(P[1]) - 5, HALO))
    d1, d2 = hypot(P[0] + c, P[1]), hypot(P[0] - c, P[1])
    out.append('<text x="364" y="44" font-size="10.5" font-weight="800" fill="#0B6E63" text-anchor="end"%s>'
               'PF₁ = %.2f · PF₂ = %.2f</text>' % (HALO, d1, d2))
    out.append('<text x="364" y="60" font-size="10.5" font-weight="800" fill="#1D4ED8" text-anchor="end"%s>'
               '합 = %.2f = 2a (실 길이)</text>' % (HALO, d1 + d2))
    out.append('<text x="36" y="160" font-size="10" fill="#6B7280"%s>압정 사이 2c = %g · 실 길이 2a = %g</text>'
               % (HALO, 2 * c, 2 * a))
    out.append(cap('실을 팽팽히 당긴 채 연필을 돌리면 무엇이 그려질까'))
    return ''.join(out)


# ── 159 · 다가가지만 닿지 않는다 ───────────────────────────────────
def hy159():
    a, b = 2.0, 1.4
    yc = lambda x: b * sqrt(x * x / (a * a) - 1)
    ya = lambda x: b / a * x
    g1, g2 = ya(3) - yc(3), ya(9) - yc(9)
    assert g1 > g2 > 0 and g1 / g2 > 3, (g1, g2)   # x 가 세 배가 되면 간격은 3분의 1 아래로

    X = lambda x: 44 + 34.0 * x
    Y = lambda y: 136 - 26.0 * y
    out = ['<path d="M38 136 H366 M44 144 V26" stroke="#9CA3AF" stroke-width="1.2"/>']
    out.append('<path d="%s" stroke="#9CA3AF" stroke-width="1.6" stroke-dasharray="5 4" fill="none"/>'
               % curve(ya, 0, 9.4, X, Y, 20, 140))
    out.append('<path d="%s" stroke="#BE123C" stroke-width="2.4" fill="none" stroke-linecap="round"/>'
               % curve(yc, a, 9.4, X, Y, 20, 140))
    for x, g in ((3.0, g1), (9.0, g2)):
        out.append('<path d="M%.1f %.1f V%.1f" stroke="#0E9384" stroke-width="2.2"/>'
                   % (X(x), Y(yc(x)), Y(ya(x))))
        out.append('<text x="%.1f" y="%.1f" font-size="10" font-weight="800" fill="#0B6E63" text-anchor="middle"%s>%.3f</text>'
                   % (X(x), Y(ya(x)) - 6, HALO, g))
        out.append('<text x="%.1f" y="150" font-size="9.5" fill="#6B7280" text-anchor="middle"%s>x = %g</text>'
                   % (X(x), HALO, x))
    out.append('<text x="%.1f" y="%.1f" font-size="10" font-weight="800" fill="#6B7280"%s>점근선 y = (b/a)x</text>'
               % (X(6.4), Y(ya(6.4)) - 8, HALO))
    out.append('<text x="364" y="44" font-size="10.5" font-weight="800" fill="#BE123C" text-anchor="end"%s>'
               '간격 %.3f → %.3f (0 으로 간다)</text>' % (HALO, g1, g2))
    out.append(cap('가까워지는데 끝내 만나지 않는다 — 그런 선이 있을까'))
    return ''.join(out)


# ── 160 · 소리가 언제 도착했나로 위치 찾기 ─────────────────────────
def td160():
    V, dt = 0.343, 4.0                      # m/ms, ms
    dd = V * dt
    assert abs(dd - 1.372) < 1e-9
    A, B, C = (-4.0, 0.0), (4.0, 0.0), (0.0, 5.0)
    src = (1.6, 3.2)

    def hyp(P1, P2, diff):
        cx, cy = (P1[0] + P2[0]) / 2, (P1[1] + P2[1]) / 2
        dx, dy = P2[0] - P1[0], P2[1] - P1[1]
        L = hypot(dx, dy); c = L / 2
        aa = abs(diff) / 2
        assert aa < c, (aa, c)
        bb = sqrt(c * c - aa * aa)
        ang = math.atan2(dy, dx); sgn = -1 if diff > 0 else 1
        pts = []
        for i in range(81):
            t = -2.0 + 4.0 * i / 80
            u, v = sgn * aa * cosh(t), bb * sinh(t)
            pts.append((cx + u * cos(ang) - v * sin(ang), cy + u * sin(ang) + v * cos(ang)))
        return pts

    d2 = hypot(src[0] - A[0], src[1] - A[1]) - hypot(src[0] - C[0], src[1] - C[1])
    X = lambda x: 200 + 26.0 * x
    Y = lambda y: 142 - 22.0 * y
    out = ['<path d="M30 %g H370" stroke="#E5E7EB" stroke-width="1.1"/>' % Y(0)]
    for pts, col in ((hyp(A, B, dd), '#2563EB'), (hyp(A, C, d2), '#0E9384')):
        out.append('<path d="%s" stroke="%s" stroke-width="2.2" fill="none"/>'
                   % (' '.join('%s%.1f %.1f' % ('M' if i == 0 else 'L', X(x), Y(y))
                               for i, (x, y) in enumerate(pts) if 18 < Y(y) < 160), col))
    for P, nm in ((A, 'A'), (B, 'B'), (C, 'C')):
        out.append('<rect x="%.1f" y="%.1f" width="10" height="10" fill="#111827"/>' % (X(P[0]) - 5, Y(P[1]) - 5))
        out.append('<text x="%.1f" y="%.1f" font-size="10" font-weight="800" fill="#374151" text-anchor="middle"%s>%s</text>'
                   % (X(P[0]), Y(P[1]) + 20, HALO, nm))
    out.append('<circle cx="%.1f" cy="%.1f" r="5.4" fill="#BE123C"/>' % (X(src[0]), Y(src[1])))
    out.append('<text x="%.1f" y="%.1f" font-size="10" font-weight="800" fill="#BE123C"%s>소리가 난 곳</text>'
               % (X(src[0]) + 9, Y(src[1]) - 6, HALO))
    out.append('<text x="36" y="40" font-size="10.5" font-weight="800" fill="#1D4ED8"%s>'
               '시간 차 %g ms → 거리 차 0.343 × %g = %.3f m</text>' % (HALO, dt, dt, dd))
    out.append('<text x="36" y="158" font-size="10" fill="#6B7280"%s>마이크 두 개면 곡선 하나 · 세 개면 한 점</text>' % HALO)
    out.append(cap('소리가 몇 밀리초 먼저 닿았는지만으로 어디인지 알 수 있을까'))
    return ''.join(out)


FNS = [('bd151', bd151), ('dm152', dm152), ('sr153', sr153), ('cl154', cl154), ('ci155', ci155),
       ('ss156', ss156), ('pf157', pf157), ('el158', el158), ('hy159', hy159), ('td160', td160)]

if __name__ == '__main__':
    import sys
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass
    for nm, f in FNS:
        sys.stdout.write('%-7s %5d자  ok\n' % (nm, len(f())))
