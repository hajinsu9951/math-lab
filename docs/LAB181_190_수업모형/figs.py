# -*- coding: utf-8 -*-
"""LAB 181~190 「오늘의 문제」 그림 — 좌표를 계산해서 그린다."""
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


def arrow(x1, y1, x2, y2, col, w=2.2, head=7.0):
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


# ── 181 · 휘는 방향이 바뀌는 자리 ──────────────────────────────────
def if181():
    b = 1.5
    f = lambda x: x ** 4 + b * x ** 3 + x
    f2 = lambda x: 12 * x * x + 6 * b * x
    r1, r2 = -b / 2, 0.0
    assert abs(f2(r1)) < 1e-12 and abs(f2(r2)) < 1e-12
    assert f2(r1 - 0.1) > 0 > f2((r1 + r2) / 2) and f2(r2 + 0.1) > 0   # 부호가 두 번 바뀐다

    X = lambda x: 200 + 108.0 * x
    Y = lambda y: 96 - 26.0 * y
    out = ['<path d="M44 %g H364 M%.1f 150 V26" stroke="#9CA3AF" stroke-width="1.2"/>' % (Y(0), X(0))]
    # 위로 볼록한 구간을 옅게 칠한다
    band = []
    for i in range(41):
        x = r1 + (r2 - r1) * i / 40
        band.append('%s%.1f %.1f' % ('M' if i == 0 else 'L', X(x), Y(f(x))))
    band.append('L%.1f %.1f L%.1f %.1f Z' % (X(r2), Y(0), X(r1), Y(0)))
    out.append('<path d="%s" fill="#BE123C" opacity=".10"/>' % ' '.join(band))
    out.append('<path d="%s" stroke="#1D4ED8" stroke-width="2.6" fill="none" stroke-linecap="round"/>'
               % curve(f, -1.5, 0.95, X, Y, 22, 146))
    for x in (r1, r2):
        out.append('<circle cx="%.1f" cy="%.1f" r="5" fill="#BE123C"/>' % (X(x), Y(f(x))))
        out.append('<path d="M%.1f %.1f V150" stroke="#BE123C" stroke-width="1.1" stroke-dasharray="4 3"/>'
                   % (X(x), Y(f(x))))
        out.append('<text x="%.1f" y="162" font-size="10" font-weight="800" fill="#BE123C" text-anchor="middle"%s>x = %g</text>'
                   % (X(x), HALO, x))
    out.append('<text x="%.1f" y="%.1f" font-size="10" font-weight="800" fill="#BE123C" text-anchor="middle"%s>위로 볼록</text>'
               % (X((r1 + r2) / 2), Y(f((r1 + r2) / 2)) + 18, HALO))
    out.append('<text x="364" y="40" font-size="10.5" font-weight="800" fill="#1D4ED8" text-anchor="end"%s>'
               'f″(x) = 12x² + %gx = 6x(2x + %g)</text>' % (HALO, 6 * b, b))
    out.append('<text x="364" y="56" font-size="10" fill="#6B7280" text-anchor="end"%s>'
               '두 자리에서 부호가 바뀐다 → 변곡점 2개</text>' % HALO)
    out.append(cap('그래프가 「휘는 방향」을 바꾸는 자리를 찾을 수 있을까'))
    return ''.join(out)


# ── 182 · 변수를 바꾸면 넓이도 바뀔까 ──────────────────────────────
def si182():
    k, b = 2.0, 1.0
    g = lambda x: 0.5 * cos(k * x) + 0.7
    exact = 0.5 * sin(k * b) / k + 0.7 * b
    wrong = 0.5 * sin(k * b) + 0.7 * b * k          # du 를 빠뜨렸을 때
    assert abs(wrong - k * exact) < 1e-12           # du 를 빠뜨리면 정확히 k 배가 된다

    out = []
    for i, (lab, lo, hi, val, col) in enumerate(
            (('원래 구간 [0, %g]' % b, 0.0, b, exact, '#2563EB'),
             ('u 로 바꾼 구간 [0, %g]' % (k * b), 0.0, k * b, wrong, '#BE123C'))):
        ox = 24 + i * 190
        X = lambda x, ox=ox, hi=hi: ox + 10 + 148.0 * x / hi
        Y = lambda y: 126 - 36.0 * y
        out.append('<rect x="%d" y="30" width="172" height="110" rx="9" fill="#fff" stroke="#E5E7EB" stroke-width="1.2"/>' % ox)
        pts = []
        for j in range(61):
            x = lo + (hi - lo) * j / 60
            pts.append('%s%.1f %.1f' % ('M' if j == 0 else 'L', X(x), Y(g(x) if i == 0 else 0.5 * cos(x) + 0.7)))
        pts.append('L%.1f %.1f L%.1f %.1f Z' % (X(hi), Y(0), X(lo), Y(0)))
        out.append('<path d="%s" fill="%s" opacity=".20" stroke="%s" stroke-width="1.8"/>' % (' '.join(pts), col, col))
        out.append('<path d="M%.1f %g H%.1f" stroke="#9CA3AF" stroke-width="1.1"/>' % (X(lo) - 6, Y(0), X(hi) + 6))
        out.append('<text x="%d" y="44" font-size="10" font-weight="800" fill="%s" text-anchor="middle"%s>%s</text>'
                   % (ox + 86, col, HALO, lab))
        out.append('<text x="%d" y="154" font-size="10.5" font-weight="800" fill="%s" text-anchor="middle"%s>넓이 %.4f</text>'
                   % (ox + 86, col, HALO, val))
    out.append('<text x="200" y="166" font-size="10" fill="#6B7280" text-anchor="middle"%s>'
               'du = %g·dx 를 빠뜨리면 답이 정확히 %g 배가 된다 (%.4f = %g × %.4f)</text>'
               % (HALO, k, k, wrong, k, exact))
    out.append(cap('구간만 바꿔 적분하면 왜 넓이가 달라질까'))
    return ''.join(out)


# ── 183 · 곱을 나누어 넘기기 ───────────────────────────────────────
def bp183():
    b = 1.0
    val = (b - 1) * exp(b) + 1
    assert abs(val - 1.0) < 1e-12

    out = []
    rows = (('u = x,  dv = eˣdx', '남은 적분  ∫eˣdx', '쉬움', '#0E9384'),
            ('u = eˣ,  dv = x dx', '남은 적분  ∫(x²/2)eˣdx', '어려움', '#BE123C'))
    for i, (pick, rest, hard, col) in enumerate(rows):
        y = 44 + i * 42
        out.append('<rect x="36" y="%d" width="300" height="34" rx="8" fill="%s" opacity=".10" stroke="%s" stroke-width="1.2"/>'
                   % (y - 22, col, col))
        out.append('<text x="48" y="%d" font-size="10.5" font-weight="800" fill="%s"%s>%s</text>' % (y, col, HALO, pick))
        out.append('<text x="190" y="%d" font-size="10" fill="#374151"%s>%s</text>' % (y, HALO, rest))
        out.append('<text x="328" y="%d" font-size="10.5" font-weight="800" fill="%s" text-anchor="end"%s>%s</text>'
                   % (y, col, HALO, hard))
    out.append('<text x="36" y="138" font-size="10.5" font-weight="800" fill="#111827"%s>'
               '∫u dv = uv − ∫v du — 남는 적분이 더 쉬워지도록 u 를 고른다</text>' % HALO)
    out.append('<text x="36" y="156" font-size="10" fill="#6B7280"%s>'
               '보기 — ∫₀¹ x·eˣ dx = (1 − 1)e¹ + 1 = %g</text>' % (HALO, val))
    out.append(cap('무엇을 u 로 두느냐에 따라 쉬워지기도 어려워지기도 한다'))
    return ''.join(out)


# ── 184 · 속력이 일정한데 가속도가 있다 ────────────────────────────
def mv184():
    R, t = 2.0, 0.9
    v = (-R * sin(t), R * cos(t))
    a = (-R * cos(t), -R * sin(t))
    assert abs(hypot(*v) - R) < 1e-12 and abs(v[0] * a[0] + v[1] * a[1]) < 1e-12

    X = lambda x: 132 + 30.0 * x
    Y = lambda y: 90 - 30.0 * y
    P = (R * cos(t), R * sin(t))
    out = ['<circle cx="%.1f" cy="%.1f" r="%.1f" fill="none" stroke="#C7D2E4" stroke-width="1.8"/>'
           % (X(0), Y(0), 30.0 * R)]
    out.append('<circle cx="%.1f" cy="%.1f" r="4.4" fill="#111827"/>' % (X(P[0]), Y(P[1])))
    out.append(arrow(X(P[0]), Y(P[1]), X(P[0] + v[0] * 0.8), Y(P[1] + v[1] * 0.8), '#0E9384', 2.6))
    out.append(arrow(X(P[0]), Y(P[1]), X(P[0] + a[0] * 0.8), Y(P[1] + a[1] * 0.8), '#BE123C', 2.6))
    out.append('<text x="%.1f" y="%.1f" font-size="10" font-weight="800" fill="#0B6E63"%s>속도 v</text>'
               % (X(P[0] + v[0] * 0.9) - 6, Y(P[1] + v[1] * 0.9) - 6, HALO))
    out.append('<text x="%.1f" y="%.1f" font-size="10" font-weight="800" fill="#BE123C"%s>가속도 a</text>'
               % (X(P[0] + a[0] * 0.9) + 4, Y(P[1] + a[1] * 0.9) + 12, HALO))
    out.append('<text x="364" y="40" font-size="10.5" font-weight="800" fill="#0B6E63" text-anchor="end"%s>'
               '속력 |v| = %g — 변하지 않는다</text>' % (HALO, hypot(*v)))
    out.append('<text x="364" y="56" font-size="10.5" font-weight="800" fill="#BE123C" text-anchor="end"%s>'
               '|a| = %g — 0 이 아니다</text>' % (HALO, hypot(*a)))
    out.append('<text x="364" y="72" font-size="10.5" font-weight="800" fill="#111827" text-anchor="end"%s>'
               'v · a = %g — 늘 수직</text>' % (HALO, v[0] * a[0] + v[1] * a[1]))
    out.append('<text x="200" y="160" font-size="10" fill="#6B7280" text-anchor="middle"%s>'
               '속력은 그대로인데 방향이 바뀐다 — 그것이 가속도다</text>' % HALO)
    out.append(cap('속력계 바늘이 움직이지 않는데도 가속도가 있을까'))
    return ''.join(out)


# ── 185 · 구부러진 길의 길이 ───────────────────────────────────────
def al185():
    f = lambda x: 0.5 * x * x
    b, n = 2.0, 6
    dx = b / n
    poly = sum(hypot(dx, f((i + 1) * dx) - f(i * dx)) for i in range(n))
    exact = 0.5 * (b * sqrt(1 + b * b) + log(b + sqrt(1 + b * b)))
    assert abs(exact - 2.9579) < 1e-3
    assert 0 < exact - poly < 0.02, (poly, exact)

    X = lambda x: 56 + 140.0 * x
    Y = lambda y: 140 - 44.0 * y
    out = ['<path d="M48 %g H364 M56 148 V26" stroke="#9CA3AF" stroke-width="1.2"/>' % Y(0)]
    out.append('<path d="%s" stroke="#C7D2E4" stroke-width="3" fill="none"/>'
               % curve(f, 0, b, X, Y, 20, 146))
    pts = ['M%.1f %.1f' % (X(0), Y(f(0)))]
    for i in range(1, n + 1):
        pts.append('L%.1f %.1f' % (X(i * dx), Y(f(i * dx))))
    out.append('<path d="%s" stroke="#BE123C" stroke-width="2" fill="none"/>' % ' '.join(pts))
    for i in range(n + 1):
        out.append('<circle cx="%.1f" cy="%.1f" r="2.8" fill="#BE123C"/>' % (X(i * dx), Y(f(i * dx))))
    out.append('<text x="364" y="40" font-size="10.5" font-weight="800" fill="#BE123C" text-anchor="end"%s>'
               '%d 조각으로 이은 길이 %.4f</text>' % (HALO, n, poly))
    out.append('<text x="364" y="56" font-size="10.5" font-weight="800" fill="#1D4ED8" text-anchor="end"%s>'
               '참값 ∫₀² √(1 + x²) dx = %.4f</text>' % (HALO, exact))
    out.append('<text x="364" y="72" font-size="10" fill="#6B7280" text-anchor="end"%s>'
               '이은 길이는 늘 조금 짧다 (오차 %.4f)</text>' % (HALO, exact - poly))
    out.append(cap('구부러진 길의 길이를 자로 재지 않고 구할 수 있을까'))
    return ''.join(out)


# ── 186 · 변화율이 미래를 정한다 ───────────────────────────────────
def de186():
    y0, K = 0.5, 4.0
    def run(g, T=6.0, dt=0.005):
        y, t, pts = y0, 0.0, [(0.0, y0)]
        while t < T:
            y += g(y) * dt; t += dt; pts.append((t, y))
        return pts
    lin = run(lambda y: 0.6)
    ex = run(lambda y: 0.6 * y)
    lo = run(lambda y: 0.6 * y * (1 - y / K))
    assert abs(lin[-1][1] - (y0 + 3.6)) < 0.01
    assert ex[-1][1] > 17, ex[-1][1]                       # 지수는 치솟는다
    assert 0.8 * K < lo[-1][1] < K, lo[-1][1]              # 로지스틱은 K 에 다가가되 넘지 않는다

    X = lambda t: 54 + 50.0 * t
    Y = lambda y: 142 - 24.0 * min(y, 5.0)
    out = ['<path d="M46 %g H364 M54 150 V26" stroke="#9CA3AF" stroke-width="1.2"/>' % Y(0)]
    out.append('<path d="M54 %.1f H364" stroke="#BE123C" stroke-width="1.2" stroke-dasharray="4 3"/>' % Y(K))
    for pts, col, nm in ((lin, '#9CA3AF', 'y′ = 0.6 — 직선'), (ex, '#BE123C', 'y′ = 0.6y — 지수'),
                         (lo, '#0E9384', 'y′ = 0.6y(1 − y/4) — S 자')):
        d = []
        for t, y in pts[::6]:
            if Y(y) < 24:
                break
            d.append('%s%.1f %.1f' % ('M' if not d else 'L', X(t), Y(y)))
        out.append('<path d="%s" stroke="%s" stroke-width="2.2" fill="none"/>' % (' '.join(d), col))
    out.append('<text x="364" y="38" font-size="10" font-weight="800" fill="#6B7280" text-anchor="end"%s>y′ = 0.6 — 직선</text>' % HALO)
    out.append('<text x="364" y="54" font-size="10" font-weight="800" fill="#BE123C" text-anchor="end"%s>y′ = 0.6y — 지수로 치솟음</text>' % HALO)
    out.append('<text x="364" y="70" font-size="10" font-weight="800" fill="#0B6E63" text-anchor="end"%s>y′ = 0.6y(1 − y/4) — %g 에서 멈춤</text>' % (HALO, K))
    out.append('<text x="54" y="160" font-size="10" fill="#6B7280"%s>같은 출발값 y(0) = %g 인데 미래가 다르다</text>' % (HALO, y0))
    out.append(cap('지금 값이 아니라 「변하는 규칙」이 미래를 정한다'))
    return ''.join(out)


# ── 187 · 직선 하나로 가를 수 있을까 ───────────────────────────────
def pc187():
    PTS = ((0, 0), (0, 1), (1, 0), (1, 1))
    AND = (0, 0, 0, 1)
    XOR = (0, 1, 1, 0)
    best_and = max(sum(1 for i, p in enumerate(PTS) if ((w1 * p[0] + w2 * p[1]) >= th) == bool(AND[i]))
                   for w1 in [x / 2 for x in range(-4, 5)]
                   for w2 in [x / 2 for x in range(-4, 5)]
                   for th in [x / 2 for x in range(-4, 5)])
    best_xor = max(sum(1 for i, p in enumerate(PTS) if ((w1 * p[0] + w2 * p[1]) >= th) == bool(XOR[i]))
                   for w1 in [x / 4 for x in range(-8, 9)]
                   for w2 in [x / 4 for x in range(-8, 9)]
                   for th in [x / 4 for x in range(-8, 9)])
    assert best_and == 4 and best_xor == 3, (best_and, best_xor)

    out = []
    for i, (nm, tgt, line) in enumerate((('AND — 가를 수 있다', AND, (1.0, 1.0, 1.5)),
                                         ('XOR — 가를 수 없다', XOR, None))):
        ox = 40 + i * 190
        X = lambda u, ox=ox: ox + 22 + 86.0 * u
        Y = lambda v: 128 - 86.0 * v
        out.append('<rect x="%d" y="34" width="150" height="112" rx="9" fill="#fff" stroke="#E5E7EB" stroke-width="1.2"/>' % ox)
        if line:
            w1, w2, th = line
            out.append('<path d="M%.1f %.1f L%.1f %.1f" stroke="#0E9384" stroke-width="2"/>'
                       % (X(-0.1), Y((th - w1 * -0.1) / w2), X(1.1), Y((th - w1 * 1.1) / w2)))
        for j, p in enumerate(PTS):
            col = '#BE123C' if tgt[j] else '#9CA3AF'
            out.append('<circle cx="%.1f" cy="%.1f" r="6" fill="%s"/>' % (X(p[0]), Y(p[1]), col))
        out.append('<text x="%d" y="48" font-size="10.5" font-weight="800" fill="%s" text-anchor="middle"%s>%s</text>'
                   % (ox + 75, '#0B6E63' if line else '#BE123C', HALO, nm))
        out.append('<text x="%d" y="158" font-size="10" fill="#6B7280" text-anchor="middle"%s>직선 하나로 최대 %d / 4</text>'
                   % (ox + 75, HALO, best_and if line else best_xor))
    out.append(cap('붉은 점과 회색 점을 직선 하나로 가를 수 있을까'))
    return ''.join(out)


# ── 188 · 정확도 95%인데 쓸모가 없다 ───────────────────────────────
def at188():
    N, p = 1000, 0.03
    pos, neg = int(N * p), N - int(N * p)
    lazy_acc = neg / N                               # 전부 음성이라 답하면
    rec, fpr = 0.60, 0.00
    tp, fp = round(pos * rec), round(neg * fpr)
    acc = (tp + (neg - fp)) / N
    assert abs(lazy_acc - 0.97) < 1e-9, lazy_acc          # 전부 음성이어도 97%
    assert abs(acc - 0.988) < 1e-9 and acc - lazy_acc < 0.02, (acc, lazy_acc)

    out = []
    for i, (nm, tp_, rec_, acc_, col) in enumerate(
            (('전부 「음성」이라 답하는 모형', 0, 0.0, lazy_acc, '#BE123C'),
             ('실제로 잡아내는 모형', tp, rec, acc, '#0E9384'))):
        y = 48 + i * 48
        out.append('<rect x="34" y="%d" width="332" height="40" rx="9" fill="%s" opacity=".10" stroke="%s" stroke-width="1.2"/>'
                   % (y - 24, col, col))
        out.append('<text x="46" y="%d" font-size="10.5" font-weight="800" fill="%s"%s>%s</text>' % (y - 8, col, HALO, nm))
        out.append('<text x="46" y="%d" font-size="10" fill="#374151"%s>환자 %d명 중 %d명 잡음 — 재현율 %.0f%%</text>'
                   % (y + 8, HALO, pos, tp_, rec_ * 100))
        out.append('<text x="356" y="%d" font-size="13" font-weight="800" fill="%s" text-anchor="end"%s>정확도 %.1f%%</text>'
                   % (y, col, HALO, acc_ * 100))
    out.append('<text x="200" y="146" font-size="10.5" font-weight="800" fill="#111827" text-anchor="middle"%s>'
               '아무것도 못 잡는 모형도 정확도 %.0f%% — 드문 일에는 정확도가 거짓말을 한다</text>' % (HALO, lazy_acc * 100))
    out.append('<text x="200" y="162" font-size="10" fill="#6B7280" text-anchor="middle"%s>'
               '%d명 가운데 실제 양성은 %d명뿐이기 때문</text>' % (HALO, N, pos))
    out.append(cap('정확도 97%% 인 모형이 환자를 한 명도 못 잡을 수 있을까'))
    return ''.join(out)


# ── 189 · 문장을 숫자로 ────────────────────────────────────────────
def tx189():
    VOCAB = ['이', '영화', '정말', '재미있다', '지루하다', '최고']
    S = ['이', '영화', '정말', '정말', '지루하다']
    cnt = [S.count(v) for v in VOCAB]
    one = [1 if c else 0 for c in cnt]
    assert cnt == [1, 1, 2, 0, 1, 0] and one == [1, 1, 1, 0, 1, 0]
    assert abs(hypot(*cnt) - sqrt(7)) < 1e-12

    CW, X0 = 50.0, 50.0
    out = []
    for j, w in enumerate(VOCAB):
        out.append('<text x="%.1f" y="46" font-size="10" fill="#374151" text-anchor="middle"%s>%s</text>'
                   % (X0 + CW * j + CW / 2, HALO, w))
    for i, (nm, vec, col) in enumerate((('원-핫', one, '#2563EB'), ('빈도수', cnt, '#BE123C'))):
        y = 56 + i * 34
        out.append('<text x="40" y="%.1f" font-size="10" font-weight="800" fill="%s" text-anchor="end"%s>%s</text>'
                   % (y + 18, col, HALO, nm))
        for j, v in enumerate(vec):
            x = X0 + CW * j
            out.append('<rect x="%.1f" y="%.1f" width="%.0f" height="26" fill="%s" opacity="%s" stroke="%s" stroke-width="1.1"/>'
                       % (x, y, CW - 4, col, '.26' if v else '.06', col))
            out.append('<text x="%.1f" y="%.1f" font-size="11.5" font-weight="800" fill="%s" text-anchor="middle"%s>%d</text>'
                       % (x + (CW - 4) / 2, y + 18, col if v else '#9CA3AF', HALO, v))
    out.append('<text x="200" y="140" font-size="10.5" font-weight="800" fill="#111827" text-anchor="middle"%s>'
               '「%s」</text>' % (HALO, ' '.join(S)))
    out.append('<text x="200" y="158" font-size="10" fill="#6B7280" text-anchor="middle"%s>'
               '빈도수 벡터의 크기 = √%d = %.3f — 「정말」이 두 번이라 1 이 아니다</text>'
               % (HALO, sum(c * c for c in cnt), hypot(*cnt)))
    out.append(cap('컴퓨터는 글을 읽지 못한다 — 그러면 어떻게 다룰까'))
    return ''.join(out)


# ── 190 · 흔한 단어는 깎는다 ───────────────────────────────────────
def tf190():
    N = 10
    W = (('영화', 5, 10), ('재미있다', 3, 3), ('연출', 2, 2), ('배우', 4, 6), ('각본', 1, 1))
    tf_top = max(W, key=lambda o: o[1])[0]
    idf = {w: log(N / df) for w, _, df in W}
    tfidf = {w: tf * idf[w] for w, tf, _ in W}
    ti_top = max(tfidf, key=lambda w: tfidf[w])
    assert tf_top == '영화' and abs(idf['영화']) < 1e-12
    assert ti_top != tf_top, (tf_top, ti_top)

    base, top = 128.0, 44.0
    mx = max(max(o[1] for o in W), max(tfidf.values()))
    S = (base - top) / mx
    X = lambda i: 52 + 62.0 * i
    out = ['<path d="M44 %g H364" stroke="#9CA3AF" stroke-width="1.2"/>' % base]
    for i, (w, tf, df) in enumerate(W):
        out.append('<rect x="%.1f" y="%.1f" width="22" height="%.1f" fill="#9CA3AF" opacity=".35"/>'
                   % (X(i), base - S * tf, S * tf))
        v = tfidf[w]
        hot = (w == ti_top)
        out.append('<rect x="%.1f" y="%.1f" width="22" height="%.1f" fill="%s" opacity=".55"/>'
                   % (X(i) + 24, base - S * v, S * v, '#BE123C' if hot else '#2563EB'))
        out.append('<text x="%.1f" y="%.0f" font-size="10" fill="#374151" text-anchor="middle"%s>%s</text>'
                   % (X(i) + 23, base + 14, HALO, w))
        out.append('<text x="%.1f" y="%.0f" font-size="9" fill="#6B7280" text-anchor="middle"%s>df %d</text>'
                   % (X(i) + 23, base + 27, HALO, df))
    out.append('<text x="364" y="38" font-size="10" font-weight="800" fill="#6B7280" text-anchor="end"%s>회색 = 빈도수(TF)</text>' % HALO)
    out.append('<text x="364" y="54" font-size="10" font-weight="800" fill="#1D4ED8" text-anchor="end"%s>파랑 = TF × IDF</text>' % HALO)
    out.append('<text x="200" y="158" font-size="10" fill="#6B7280" text-anchor="middle"%s>'
               '빈도수 1등은 「%s」지만 모든 문서에 있어 IDF = 0 — TF-IDF 1등은 「%s」</text>'
               % (HALO, tf_top, ti_top))
    out.append(cap('가장 많이 나온 단어가 그 글의 주제어일까'))
    return ''.join(out)


FNS = [('if181', if181), ('si182', si182), ('bp183', bp183), ('mv184', mv184), ('al185', al185),
       ('de186', de186), ('pc187', pc187), ('at188', at188), ('tx189', tx189), ('tf190', tf190)]

if __name__ == '__main__':
    import sys
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass
    for nm, f in FNS:
        sys.stdout.write('%-7s %5d자  ok\n' % (nm, len(f())))
