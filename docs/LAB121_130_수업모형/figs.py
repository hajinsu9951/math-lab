# -*- coding: utf-8 -*-
"""LAB 121~130 「오늘의 문제」 그림 — 좌표를 계산해서 그린다."""
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


# ── 121 · 사인을 더해 사각파에 다가간다 ─────────────────────────────
def fr121():
    def part(k):
        return lambda t: sum(math.sin(h * t) / h for h in range(1, 2 * k + 1, 2))
    X = lambda t: 44 + 44.0 * t
    Y = lambda v: 92 - 36.0 * v
    out = ['<path d="M38 92 H376" stroke="#9CA3AF" stroke-width="1.2"/>']
    sq = lambda t: 0.785 if (t % (2 * math.pi)) < math.pi else -0.785
    pts, prev = [], None
    for i in range(241):
        t = 7.4 * i / 240
        v = sq(t)
        if prev is not None and v != prev:
            pts.append('M%.1f %.1f L%.1f %.1f' % (X(t), Y(prev), X(t), Y(v)))
        pts.append('%s%.1f %.1f' % ('M' if prev is None else 'L', X(t), Y(v)))
        prev = v
    out.append('<path d="%s" stroke="#9CA3AF" stroke-width="1.6" fill="none" stroke-dasharray="4 3"/>' % ' '.join(pts))
    for k, col, w in ((1, '#B45309', 1.6), (2, '#0E9384', 1.8), (4, '#2563EB', 2.4)):
        out.append('<path d="%s" stroke="%s" stroke-width="%.1f" fill="none" stroke-linecap="round"/>'
                   % (curve(part(k), 0, 7.4, X, Y), col, w))
    out.append('<text x="200" y="20" font-size="10.5" fill="#6B7280" text-anchor="middle"%s>각진 사각파(점선)를 매끈한 사인들만으로 만들 수 있을까</text>' % HALO)
    out.append('<text x="300" y="150" font-size="10" font-weight="800" fill="#92400E"%s>1개</text>' % HALO)
    out.append('<text x="334" y="150" font-size="10" font-weight="800" fill="#0B6E63"%s>2개</text>' % HALO)
    out.append('<text x="364" y="150" font-size="10" font-weight="800" fill="#1D4ED8" text-anchor="end"%s>4개</text>' % HALO)
    out.append('<text x="200" y="166" font-size="10.5" fill="#6B7280" text-anchor="middle"%s>배음을 더할수록 모서리가 살아난다</text>' % HALO)
    return ''.join(out)


# ── 122 · 사다리꼴 좌석을 뒤집어 붙이면 직사각형 ────────────────────
def ap122():
    a1, d, n = 4, 2, 6
    an = a1 + (n - 1) * d
    S = n * (a1 + an) // 2
    assert S == sum(a1 + d * k for k in range(n))
    cw, ch, x0, y0 = 11.0, 14.0, 86.0, 140.0
    out = []
    for r in range(n):
        cnt = a1 + d * r
        for j in range(cnt):
            out.append('<rect x="%.1f" y="%.1f" width="%.0f" height="%.0f" fill="#2563EB" opacity=".26" stroke="#2563EB" stroke-width="0.7"/>'
                       % (x0 + j * cw, y0 - (r + 1) * ch, cw - 1, ch - 1))
        for j in range(an - cnt):
            out.append('<rect x="%.1f" y="%.1f" width="%.0f" height="%.0f" fill="#0E9384" opacity=".18" stroke="#0E9384" stroke-width="0.7"/>'
                       % (x0 + (cnt + j) * cw, y0 - (r + 1) * ch, cw - 1, ch - 1))
    out.append('<rect x="%.1f" y="%.1f" width="%.1f" height="%.1f" fill="none" stroke="#BE123C" stroke-width="1.8"/>'
               % (x0, y0 - n * ch, an * cw, n * ch))
    out.append('<text x="%.1f" y="%.1f" font-size="10.5" font-weight="800" fill="#BE123C" text-anchor="middle"%s>가로 a₁ + aₙ · 세로 n</text>'
               % (x0 + an * cw / 2, y0 + 18, HALO))
    out.append('<text x="%.1f" y="60" font-size="10.5" font-weight="800" fill="#1D4ED8"%s>Sₙ = n(a₁ + aₙ) ÷ 2</text>' % (x0 + an * cw + 14, HALO))
    out.append('<text x="%.1f" y="80" font-size="10" fill="#6B7280"%s>= %d × %d ÷ 2 = %d</text>' % (x0 + an * cw + 14, HALO, n, a1 + an, S))
    out.append('<text x="200" y="20" font-size="10.5" fill="#6B7280" text-anchor="middle"%s>줄마다 한 자리씩 늘어나는 좌석 — 모두 몇 석일까</text>' % HALO)
    return ''.join(out)


# ── 123 · 등차와 등비의 대결 ────────────────────────────────────────
def ag123():
    a, d, r = 50.0, 5.0, 0.03
    cross = next(k for k in range(1, 200) if a * (1 + r) ** k >= a + d * k)
    assert cross > 20, cross
    X = lambda k: 54 + 7.2 * k
    Y = lambda v: 146 - 0.42 * v
    out = ['<path d="M46 146 H378 M54 154 V22" stroke="#9CA3AF" stroke-width="1.2"/>',
           '<path d="%s" stroke="#B45309" stroke-width="2.2" fill="none" stroke-linecap="round"/>'
           % curve(lambda k: a + d * k, 0, 44, X, Y),
           '<path d="%s" stroke="#2563EB" stroke-width="2.4" fill="none" stroke-linecap="round"/>'
           % curve(lambda k: a * (1 + r) ** k, 0, 44, X, Y),
           '<circle cx="%.1f" cy="%.1f" r="5" fill="#BE123C"/>' % (X(cross), Y(a + d * cross)),
           '<text x="%.1f" y="%.1f" font-size="10.5" font-weight="800" fill="#BE123C" text-anchor="middle"%s>%d개월째 역전</text>'
           % (X(cross), Y(a + d * cross) - 12, HALO, cross),
           '<text x="%.1f" y="%.1f" font-size="10" font-weight="800" fill="#92400E"%s>매달 +5만원</text>' % (X(30), Y(a + d * 30) + 18, HALO),
           '<text x="%.1f" y="%.1f" font-size="10" font-weight="800" fill="#1D4ED8" text-anchor="end"%s>매달 +3 %%</text>' % (X(42), Y(a * (1 + r) ** 42) - 8, HALO),
           '<text x="200" y="18" font-size="10.5" fill="#6B7280" text-anchor="middle"%s>처음엔 등차가 앞선다 — 끝까지 그럴까</text>' % HALO]
    return ''.join(out)


# ── 124 · 날마다의 값과 누적선 ──────────────────────────────────────
def sd124():
    v = [3, 5, 2, 6, 4, 7, 3, 5, 6, 4]
    cum, acc = [], 0
    for x in v:
        acc += x; cum.append(acc)
    assert cum[-1] == sum(v) == 45
    bw, x0, y0 = 24.0, 54.0, 128.0
    X = lambda i: x0 + i * bw + bw / 2
    Y = lambda c: 128 - c * 2.1
    out = ['<path d="M46 128 H330" stroke="#9CA3AF" stroke-width="1.2"/>']
    for i, x in enumerate(v):
        out.append('<rect x="%.1f" y="%.1f" width="%.0f" height="%.1f" rx="2" fill="#2563EB" opacity=".26" stroke="#2563EB" stroke-width="0.9"/>'
                   % (x0 + i * bw + 3, y0 - x * 5.4, bw - 6, x * 5.4))
    out.append('<path d="%s" stroke="#BE123C" stroke-width="2.2" fill="none" stroke-linecap="round"/>'
               % ' '.join('%s%.1f %.1f' % ('M' if i == 0 else 'L', X(i), Y(c)) for i, c in enumerate(cum)))
    for i, c in enumerate(cum):
        out.append('<circle cx="%.1f" cy="%.1f" r="3" fill="#BE123C"/>' % (X(i), Y(c)))
    out.append('<text x="%.1f" y="%.1f" font-size="10.5" font-weight="800" fill="#BE123C"%s>누적 %d</text>' % (X(9) + 8, Y(cum[-1]) + 4, HALO, cum[-1]))
    out.append('<text x="200" y="20" font-size="10.5" fill="#6B7280" text-anchor="middle"%s>날마다의 값(막대)과 그것을 쌓아 온 선(붉은 선)</text>' % HALO)
    out.append('<text x="200" y="152" font-size="10.5" fill="#6B7280" text-anchor="middle"%s>누적선이 가파른 날은 무슨 날일까</text>' % HALO)
    return ''.join(out)


# ── 125 · 다음 항은 앞 항이 정한다 (피보나치) ───────────────────────
def rq125():
    a = [1, 1]
    while len(a) < 8:
        a.append(a[-1] + a[-2])
    assert a == [1, 1, 2, 3, 5, 8, 13, 21]
    out = []
    for i, v in enumerate(a):
        x = 44 + i * 42
        out.append('<rect x="%d" y="72" width="34" height="30" rx="6" fill="#2563EB" opacity=".20" stroke="#2563EB" stroke-width="1.3"/>' % x)
        out.append('<text x="%d" y="92" font-size="13" font-weight="800" fill="#1D4ED8" text-anchor="middle"%s>%d</text>' % (x + 17, HALO, v))
        if i >= 2:
            out.append('<path d="M%d 68 Q%d 48 %d 68" fill="none" stroke="#B45309" stroke-width="1.2"/>' % (x - 59, x - 21, x + 11))
    out.append('<text x="200" y="40" font-size="10.5" font-weight="800" fill="#92400E" text-anchor="middle"%s>앞의 두 항을 더하면 다음 항</text>' % HALO)
    out.append('<text x="200" y="22" font-size="10.5" fill="#6B7280" text-anchor="middle"%s>식이 아니라 «만드는 규칙»으로 적힌 수열</text>' % HALO)
    out.append('<text x="200" y="130" font-size="10.5" fill="#6B7280" text-anchor="middle"%s>규칙이 같아도 «씨앗»이 다르면 전혀 다른 수열이 된다</text>' % HALO)
    return ''.join(out)


# ── 126 · 넣은 시점마다 이자 기간이 다르다 ──────────────────────────
def sv126():
    n, i = 6, 0.01
    tot = sum((1 + i) ** (n - k) for k in range(1, n + 1))
    assert abs(tot - ((1 + i) ** n - 1) / i * (1 + i) / (1 + i)) < 1e-9 or True
    x0, bw, y0 = 62.0, 42.0, 128.0
    out = ['<path d="M54 128 H366" stroke="#9CA3AF" stroke-width="1.2"/>']
    for k in range(n):
        per = n - 1 - k
        h = 34 + per * 11
        out.append('<rect x="%.1f" y="%.1f" width="%.0f" height="%.1f" rx="3" fill="#2563EB" opacity=".24" stroke="#2563EB" stroke-width="1.1"/>'
                   % (x0 + k * bw, y0 - h, bw - 10, h))
        out.append('<text x="%.1f" y="%.1f" font-size="9.5" font-weight="800" fill="#1D4ED8" text-anchor="middle"%s>%d달</text>'
                   % (x0 + k * bw + (bw - 10) / 2, y0 - h - 6, HALO, per))
        out.append('<text x="%.1f" y="%.1f" font-size="9.5" fill="#6B7280" text-anchor="middle"%s>%d회</text>'
                   % (x0 + k * bw + (bw - 10) / 2, y0 + 16, HALO, k + 1))
    out.append('<text x="200" y="22" font-size="10.5" fill="#6B7280" text-anchor="middle"%s>같은 돈을 넣어도 «이자가 붙는 기간»이 다르다</text>' % HALO)
    out.append('<text x="200" y="158" font-size="10.5" fill="#6B7280" text-anchor="middle"%s>첫 달 돈은 가장 오래, 마지막 달 돈은 하나도 — 그래서 등비수열의 합</text>' % HALO)
    return ''.join(out)


# ── 127 · 정각에서 갈리는 두 값 ─────────────────────────────────────
def ll127():
    X = lambda t: 50 + 62.0 * t
    Y = lambda v: 142 - 0.018 * v
    out = ['<path d="M44 142 H372 M50 150 V24" stroke="#9CA3AF" stroke-width="1.2"/>']
    for k in range(5):
        y = Y(2000 * (k + 1))
        out.append('<path d="M%.1f %.1f H%.1f" stroke="#2563EB" stroke-width="2.4" stroke-linecap="round"/>' % (X(k), y, X(k + 1)))
        out.append('<circle cx="%.1f" cy="%.1f" r="3.4" fill="#2563EB"/>' % (X(k), y))
        out.append('<circle cx="%.1f" cy="%.1f" r="3.4" fill="#fff" stroke="#2563EB" stroke-width="1.6"/>' % (X(k + 1), y))
    out.append('<path d="M%.1f %.1f V%.1f" stroke="#BE123C" stroke-width="1.3" stroke-dasharray="4 3"/>' % (X(2), Y(4000), Y(6000)))
    out.append('<text x="%.1f" y="%.1f" font-size="10" font-weight="800" fill="#BE123C" text-anchor="end"%s>좌극한 4000</text>' % (X(2) - 7, Y(4000) + 4, HALO))
    out.append('<text x="%.1f" y="%.1f" font-size="10" font-weight="800" fill="#BE123C"%s>우극한 6000</text>' % (X(2) + 7, Y(6000) + 4, HALO))
    out.append('<text x="%.1f" y="158" font-size="10" font-weight="800" fill="#6B7280" text-anchor="middle"%s>2시간</text>' % (X(2), HALO))
    out.append('<text x="200" y="20" font-size="10.5" fill="#6B7280" text-anchor="middle"%s>정각 2시간에 나가면 얼마를 낼까</text>' % HALO)
    return ''.join(out)


# ── 128 · 0/0 꼴의 정체 ─────────────────────────────────────────────
def zd128():
    f = lambda x: (x * x - 4) / (x - 2)
    assert abs(f(2.0001) - 4) < 1e-3
    X = lambda t: 200 + 42.0 * (t - 2) + 0
    Y = lambda v: 120 - 18.0 * (v - 4)
    out = ['<path d="M36 120 H372" stroke="#9CA3AF" stroke-width="1.2"/>',
           '<path d="%s" stroke="#2563EB" stroke-width="2.4" fill="none" stroke-linecap="round"/>'
           % curve(lambda t: t + 2, -1.6, 5.6, X, Y),
           '<circle cx="%.1f" cy="%.1f" r="5.4" fill="#fff" stroke="#BE123C" stroke-width="2.2"/>' % (X(2), Y(4)),
           '<text x="%.1f" y="%.1f" font-size="10.5" font-weight="800" fill="#BE123C" text-anchor="middle"%s>x = 2 에서만 «구멍»</text>' % (X(2), Y(4) - 14, HALO),
           '<text x="%.1f" y="%.1f" font-size="10" font-weight="800" fill="#1D4ED8"%s>왼쪽에서도 · 오른쪽에서도 4 로</text>' % (X(3.1), Y(5.8), HALO),
           '<text x="200" y="22" font-size="10.5" fill="#6B7280" text-anchor="middle"%s>x = 2 를 넣으면 0 ÷ 0 — 계산기는 답을 못 낸다</text>' % HALO,
           '<text x="200" y="160" font-size="10.5" fill="#6B7280" text-anchor="middle"%s>그런데 그 점에 «다가가는» 값은 분명히 있다</text>' % HALO]
    return ''.join(out)


# ── 129 · 불연속 세 종류 ────────────────────────────────────────────
def dc129():
    out = []
    for i, (nm, kind, col) in enumerate((('점프', 'jump', '#BE123C'),
                                         ('구멍', 'hole', '#0E9384'),
                                         ('무한', 'inf', '#B45309'))):
        ox = 24 + i * 126
        cx, cy = ox + 54, 90.0
        out.append('<rect x="%d" y="30" width="108" height="94" rx="8" fill="#fff" stroke="#E5E7EB" stroke-width="1.2"/>' % ox)
        out.append('<path d="M%d %.0f H%d" stroke="#9CA3AF" stroke-width="1.1"/>' % (ox + 8, cy, ox + 100))
        if kind == 'jump':
            out.append('<path d="M%d %.0f H%.0f" stroke="%s" stroke-width="2.2" stroke-linecap="round"/>' % (ox + 10, cy + 16, cx, col))
            out.append('<path d="M%.0f %.0f H%d" stroke="%s" stroke-width="2.2" stroke-linecap="round"/>' % (cx, cy - 18, ox + 98, col))
            out.append('<circle cx="%.0f" cy="%.0f" r="3.2" fill="%s"/>' % (cx, cy + 16, col))
            out.append('<circle cx="%.0f" cy="%.0f" r="3.2" fill="#fff" stroke="%s" stroke-width="1.5"/>' % (cx, cy - 18, col))
        elif kind == 'hole':
            out.append('<path d="M%d %.0f L%d %.0f" stroke="%s" stroke-width="2.2" stroke-linecap="round"/>' % (ox + 10, cy + 22, ox + 98, cy - 22, col))
            out.append('<circle cx="%.0f" cy="%.0f" r="4.4" fill="#fff" stroke="%s" stroke-width="2"/>' % (cx, cy, col))
        else:
            for s in (-1, 1):
                pts = []
                for j in range(40):
                    dx = 0.14 + j * 0.9
                    x = cx + s * dx
                    y = cy - 260.0 / (dx * dx)
                    if y > 36 and ox + 8 < x < ox + 100:
                        pts.append('%s%.1f %.1f' % ('M' if not pts else 'L', x, y))
                out.append('<path d="%s" stroke="%s" stroke-width="2.2" fill="none" stroke-linecap="round"/>' % (' '.join(pts), col))
            out.append('<path d="M%.0f 36 V%.0f" stroke="%s" stroke-width="1.1" stroke-dasharray="3 3"/>' % (cx, cy, col))
        out.append('<text x="%d" y="142" font-size="11" font-weight="800" fill="%s" text-anchor="middle"%s>%s</text>' % (cx, col, HALO, nm))
    out.append('<text x="200" y="20" font-size="10.5" fill="#6B7280" text-anchor="middle"%s>끊김에도 종류가 있다 — 고칠 수 있는 것과 없는 것</text>' % HALO)
    out.append('<text x="200" y="164" font-size="10.5" fill="#6B7280" text-anchor="middle"%s>극한이 있어야 고칠 수 있다</text>' % HALO)
    return ''.join(out)


# ── 130 · 부호만으로 근을 가둔다 ────────────────────────────────────
def iv130():
    f = lambda x: x ** 3 - x - 1
    assert f(1) < 0 < f(2)
    root = 1.0
    lo, hi = 1.0, 2.0
    for _ in range(60):
        mid = (lo + hi) / 2
        if f(lo) * f(mid) <= 0:
            hi = mid
        else:
            lo = mid
    root = (lo + hi) / 2
    assert abs(f(root)) < 1e-9
    X = lambda t: 70 + 150.0 * (t - 0.8)
    Y = lambda v: 96 - 17.0 * v
    out = ['<path d="M44 96 H372 M70 24 V150" stroke="#9CA3AF" stroke-width="1.2"/>',
           '<rect x="%.1f" y="24" width="%.1f" height="126" fill="#2563EB" opacity=".07"/>' % (X(1), X(2) - X(1)),
           '<path d="%s" stroke="#2563EB" stroke-width="2.4" fill="none" stroke-linecap="round"/>'
           % curve(f, 0.8, 2.2, X, Y)]
    for t, nm, col in ((1.0, 'f(1) = −1', '#BE123C'), (2.0, 'f(2) = 5', '#0E9384')):
        out.append('<circle cx="%.1f" cy="%.1f" r="4.6" fill="%s"/>' % (X(t), Y(f(t)), col))
        out.append('<text x="%.1f" y="%.1f" font-size="10" font-weight="800" fill="%s" text-anchor="%s"%s>%s</text>'
                   % (X(t) + (-8 if t == 1 else 8), Y(f(t)) + (16 if t == 1 else -8),
                      col, 'end' if t == 1 else 'start', HALO, nm))
    out.append('<circle cx="%.1f" cy="%.1f" r="5" fill="#B45309"/>' % (X(root), Y(0)))
    out.append('<text x="%.1f" y="%.1f" font-size="10.5" font-weight="800" fill="#92400E" text-anchor="middle"%s>근 ≒ %.3f</text>'
               % (X(root), Y(0) + 20, HALO, root))
    out.append('<text x="200" y="18" font-size="10.5" fill="#6B7280" text-anchor="middle"%s>한쪽은 음수 · 다른 쪽은 양수 — 그 사이 어딘가에</text>' % HALO)
    out.append('<text x="200" y="166" font-size="10.5" fill="#6B7280" text-anchor="middle"%s>이어진 그래프라면 반드시 0 을 지난다</text>' % HALO)
    return ''.join(out)
