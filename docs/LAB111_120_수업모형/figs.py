# -*- coding: utf-8 -*-
"""LAB 111~120 「오늘의 문제」 그림 — 좌표를 계산해서 그린다."""
import math

HALO = ' paint-order="stroke" stroke="#fff" stroke-width="3.2" stroke-linejoin="round"'


def curve(f, x0, x1, X, Y, lo=20.0, hi=156.0, n=200):
    """화면 밖으로 나가는 부분은 끊어 그린다."""
    segs, cur = [], []
    for i in range(n + 1):
        x = x0 + (x1 - x0) * i / n
        y = Y(f(x))
        if lo <= y <= hi:
            cur.append('%s%.1f %.1f' % ('M' if not cur else 'L', X(x), y))
        elif cur:
            segs.append(' '.join(cur)); cur = []
    if cur:
        segs.append(' '.join(cur))
    return ' '.join(segs)


# ── 111 · 도미노 — 조건 두 개가 다 있어야 ──────────────────────────
def dm111():
    out = []
    for i, (gap, nm, col, ok) in enumerate(((True, '빠짐없이 이어져 있다', '#0E9384', True),
                                            (False, '한 자리가 끊겨 있다', '#BE123C', False))):
        ox, y = 30 + i * 190, 112.0
        for k in range(9):
            if not gap and k == 4:
                continue
            x = ox + 6 + k * 18
            fallen = ok or k < 4
            if fallen and k < (9 if ok else 4):
                out.append('<rect x="%.1f" y="%.1f" width="16" height="6" rx="1.5" fill="%s" opacity=".40" stroke="%s" stroke-width="1"/>'
                           % (x - 4, y - 6, col, col))
            else:
                out.append('<rect x="%.1f" y="%.1f" width="6" height="34" rx="1.5" fill="%s" opacity=".30" stroke="%s" stroke-width="1"/>'
                           % (x, y - 34, col, col))
        out.append('<path d="M%d %.0f H%d" stroke="#9CA3AF" stroke-width="1.4"/>' % (ox, y + 2, ox + 170))
        out.append('<text x="%d" y="146" font-size="10.5" font-weight="800" fill="%s" text-anchor="middle"%s>%s</text>'
                   % (ox + 85, col, HALO, nm))
        out.append('<text x="%d" y="%.0f" font-size="10" font-weight="800" fill="%s" text-anchor="middle"%s>%s</text>'
                   % (ox + 85, 46, col, HALO, '끝까지 무너진다' if ok else '거기서 멈춘다'))
    out.append('<text x="200" y="20" font-size="10.5" fill="#6B7280" text-anchor="middle"%s>첫 장을 밀었다 — 그것만으로 끝까지 갈까</text>' % HALO)
    out.append('<text x="200" y="166" font-size="10.5" fill="#6B7280" text-anchor="middle"%s>「첫 장이 넘어진다」와 「넘어진 장이 다음을 민다」 — 둘 다 있어야 한다</text>' % HALO)
    return ''.join(out)


# ── 112 · 몇 해 뒤에 세 배 ──────────────────────────────────────────
def xe112():
    a, k = 1.1, 3.0
    x = math.log(k) / math.log(a)
    assert abs(a ** x - k) < 1e-9
    X = lambda t: 56 + 23.0 * t
    Y = lambda v: 144 - 30.0 * (v - 0.6)
    out = ['<path d="M48 144 H376 M56 152 V24" stroke="#9CA3AF" stroke-width="1.2"/>',
           '<path d="%s" stroke="#2563EB" stroke-width="2.4" fill="none" stroke-linecap="round"/>'
           % curve(lambda t: a ** t, 0, 13.5, X, Y),
           '<path d="M56 %.1f H376" stroke="#BE123C" stroke-width="1.3" stroke-dasharray="5 3"/>' % Y(k),
           '<text x="372" y="%.1f" font-size="10" font-weight="800" fill="#BE123C" text-anchor="end"%s>세 배</text>' % (Y(k) - 6, HALO),
           '<path d="M%.1f %.1f V144" stroke="#BE123C" stroke-width="1.2" stroke-dasharray="3 3"/>' % (X(x), Y(k)),
           '<circle cx="%.1f" cy="%.1f" r="5" fill="#BE123C"/>' % (X(x), Y(k)),
           '<text x="%.1f" y="158" font-size="10.5" font-weight="800" fill="#BE123C" text-anchor="middle"%s>%.1f 해</text>' % (X(x), HALO, x)]
    out.append('<text x="200" y="20" font-size="10.5" fill="#6B7280" text-anchor="middle"%s>해마다 10 %% 씩 늘면 세 배가 되는 데 몇 해 걸릴까</text>' % HALO)
    out.append('<text x="300" y="56" font-size="10.5" font-weight="800" fill="#1D4ED8"%s>1.1ˣ = 3</text>' % HALO)
    return ''.join(out)


# ── 113 · 밑 변환 ───────────────────────────────────────────────────
def lb113():
    a, b = 2.0, 50.0
    v = math.log10(b) / math.log10(a)
    assert abs(a ** v - b) < 1e-6
    out = ['<text x="88" y="68" font-size="15" font-weight="800" fill="#111827" text-anchor="middle"%s>log₂ 50</text>' % HALO,
           '<text x="140" y="68" font-size="15" font-weight="800" fill="#6B7280" text-anchor="middle"%s>=</text>' % HALO,
           '<text x="214" y="56" font-size="13" font-weight="800" fill="#1D4ED8" text-anchor="middle"%s>log 50</text>' % HALO,
           '<path d="M174 64 H254" stroke="#111827" stroke-width="1.6"/>',
           '<text x="214" y="82" font-size="13" font-weight="800" fill="#0B6E63" text-anchor="middle"%s>log 2</text>' % HALO,
           '<text x="282" y="68" font-size="15" font-weight="800" fill="#6B7280" text-anchor="middle"%s>=</text>' % HALO,
           '<text x="338" y="68" font-size="14" font-weight="800" fill="#BE123C" text-anchor="middle"%s>%.4f</text>' % (HALO, v),
           '<text x="200" y="116" font-size="11" font-weight="800" fill="#111827" text-anchor="middle"%s>검산 — 2 를 %.4f 번 곱하면 %.1f</text>' % (HALO, v, a ** v),
           '<text x="200" y="22" font-size="10.5" fill="#6B7280" text-anchor="middle"%s>계산기에는 log 와 ln 뿐 — 밑이 2 인 로그는 어떻게 구할까</text>' % HALO,
           '<text x="200" y="146" font-size="10.5" fill="#6B7280" text-anchor="middle"%s>아래위 모두 같은 밑으로 바꾸면 된다</text>' % HALO]
    return ''.join(out)


# ── 114 · 지수와 로그는 y = x 에 대칭 ───────────────────────────────
def el114():
    a = 2.0
    X = lambda t: 200 + 23.0 * t
    Y = lambda v: 92 - 23.0 * v
    out = ['<path d="M34 92 H370 M200 18 V162" stroke="#9CA3AF" stroke-width="1.2"/>',
           '<path d="M%.0f %.0f L%.0f %.0f" stroke="#9CA3AF" stroke-width="1.3" stroke-dasharray="5 3"/>'
           % (X(-2.8), Y(-2.8), X(2.8), Y(2.8)),
           '<path d="%s" stroke="#2563EB" stroke-width="2.4" fill="none" stroke-linecap="round"/>'
           % curve(lambda t: a ** t, -3.4, 3.0, X, Y),
           '<path d="%s" stroke="#0E9384" stroke-width="2.4" fill="none" stroke-linecap="round"/>'
           % curve(lambda t: math.log(t) / math.log(a), 0.08, 7.2, X, Y)]
    p = (1.0, 2.0)
    out.append('<circle cx="%.1f" cy="%.1f" r="4.6" fill="#1D4ED8"/>' % (X(p[0]), Y(p[1])))
    out.append('<circle cx="%.1f" cy="%.1f" r="4.6" fill="#0B6E63"/>' % (X(p[1]), Y(p[0])))
    out.append('<path d="M%.1f %.1f L%.1f %.1f" stroke="#BE123C" stroke-width="1.2" stroke-dasharray="3 3"/>'
               % (X(p[0]), Y(p[1]), X(p[1]), Y(p[0])))
    out.append('<text x="%.1f" y="%.1f" font-size="10" font-weight="800" fill="#1D4ED8" text-anchor="end"%s>(1, 2)</text>' % (X(p[0]) - 7, Y(p[1]) + 4, HALO))
    out.append('<text x="%.1f" y="%.1f" font-size="10" font-weight="800" fill="#0B6E63"%s>(2, 1)</text>' % (X(p[1]) + 7, Y(p[0]) + 4, HALO))
    out.append('<text x="%.1f" y="%.1f" font-size="10" font-weight="800" fill="#6B7280"%s>y = x</text>' % (X(2.0) + 8, Y(2.4), HALO))
    out.append('<text x="200" y="14" font-size="10.5" fill="#6B7280" text-anchor="middle"%s>좌표를 맞바꾼 두 점 — 두 그래프는 어떤 사이일까</text>' % HALO)
    return ''.join(out)


# ── 115 · 2의 100제곱은 몇 자리 ─────────────────────────────────────
def lg115():
    L = 100 * math.log10(2)
    ji = math.floor(L)
    assert ji + 1 == 31
    out = ['<text x="200" y="48" font-size="14" font-weight="800" fill="#111827" text-anchor="middle"%s>log(2¹⁰⁰) = 100 × 0.3010 = %.4f</text>' % (HALO, L),
           '<path d="M70 72 H330" stroke="#9CA3AF" stroke-width="1.4"/>',
           '<path d="M70 66 V78 M330 66 V78" stroke="#9CA3AF" stroke-width="1.4"/>',
           '<circle cx="%.1f" cy="72" r="5.4" fill="#BE123C"/>' % (70 + (L - ji) * 260),
           '<text x="70" y="96" font-size="11" font-weight="800" fill="#1D4ED8" text-anchor="middle"%s>%d</text>' % (HALO, ji),
           '<text x="330" y="96" font-size="11" font-weight="800" fill="#1D4ED8" text-anchor="middle"%s>%d</text>' % (HALO, ji + 1),
           '<text x="%.1f" y="60" font-size="10.5" font-weight="800" fill="#BE123C" text-anchor="middle"%s>가수 %.4f</text>' % (70 + (L - ji) * 260, HALO, L - ji),
           '<text x="200" y="120" font-size="12" font-weight="800" fill="#0B6E63" text-anchor="middle"%s>10^%d ≤ 2¹⁰⁰ &lt; 10^%d → %d자리</text>' % (HALO, ji, ji + 1, ji + 1),
           '<text x="200" y="22" font-size="10.5" fill="#6B7280" text-anchor="middle"%s>계산기가 넘치는 큰 수도 자릿수는 알 수 있다</text>' % HALO,
           '<text x="200" y="150" font-size="10.5" fill="#6B7280" text-anchor="middle"%s>정수 부분(지표)이 자릿수를, 소수 부분(가수)이 첫 자리를 정한다</text>' % HALO]
    return ''.join(out)


# ── 116 · 밑과 이동 ─────────────────────────────────────────────────
def em116():
    a, p, q = 2.0, 1.0, 3.0
    yint = a ** (-p) + q
    assert abs(yint - 3.5) < 1e-9
    X = lambda t: 200 + 32.0 * t
    Y = lambda v: 140 - 20.0 * v
    out = ['<path d="M36 140 H372 M200 20 V158" stroke="#9CA3AF" stroke-width="1.2"/>',
           '<path d="%s" stroke="#9CA3AF" stroke-width="2" fill="none" stroke-dasharray="5 3"/>'
           % curve(lambda t: a ** t, -4.6, 3.0, X, Y),
           '<path d="%s" stroke="#2563EB" stroke-width="2.4" fill="none" stroke-linecap="round"/>'
           % curve(lambda t: a ** (t - p) + q, -4.6, 3.4, X, Y),
           '<path d="M36 %.1f H372" stroke="#BE123C" stroke-width="1.3" stroke-dasharray="4 3"/>' % Y(q),
           '<text x="368" y="%.1f" font-size="10" font-weight="800" fill="#BE123C" text-anchor="end"%s>점근선 y = 3</text>' % (Y(q) - 6, HALO),
           '<circle cx="%.1f" cy="%.1f" r="4.6" fill="#0E9384"/>' % (X(0), Y(yint)),
           '<text x="%.1f" y="%.1f" font-size="10" font-weight="800" fill="#0B6E63"%s>y절편 %.1f</text>' % (X(0) + 8, Y(yint) - 6, HALO, yint),
           '<text x="200" y="16" font-size="10.5" fill="#6B7280" text-anchor="middle"%s>밑을 바꾸면 · 밀면 · 들어 올리면 곡선은 어떻게 되나</text>' % HALO,
           '<text x="200" y="166" font-size="10.5" fill="#6B7280" text-anchor="middle"%s>세로로 미는 q 만이 점근선을 통째로 들어 올린다</text>' % HALO]
    return ''.join(out)


# ── 117 · 주기 · 진폭 · 위상 ────────────────────────────────────────
def tp117():
    a, b, c, d = 2.0, 2.0, 0.0, 0.0
    T = 2 * math.pi / b
    assert abs(T - math.pi) < 1e-9
    X = lambda t: 52 + 42.0 * t
    Y = lambda v: 88 - 19.0 * v
    out = ['<path d="M44 88 H376 M52 24 V152" stroke="#9CA3AF" stroke-width="1.2"/>',
           '<path d="%s" stroke="#9CA3AF" stroke-width="1.8" fill="none" stroke-dasharray="5 3"/>'
           % curve(lambda t: math.sin(t), 0, 7.2, X, Y),
           '<path d="%s" stroke="#2563EB" stroke-width="2.4" fill="none" stroke-linecap="round"/>'
           % curve(lambda t: a * math.sin(b * t), 0, 7.2, X, Y),
           '<path d="M52 %.1f H376" stroke="#B45309" stroke-width="1.1" stroke-dasharray="3 3"/>' % Y(a),
           '<text x="372" y="%.1f" font-size="10" font-weight="800" fill="#92400E" text-anchor="end"%s>최댓값 = d + a</text>' % (Y(a) - 6, HALO),
           '<path d="M%.1f 140 H%.1f" stroke="#BE123C" stroke-width="1.8"/>' % (X(0), X(T)),
           '<path d="M%.1f 134 V146 M%.1f 134 V146" stroke="#BE123C" stroke-width="1.4"/>' % (X(0), X(T)),
           '<text x="%.1f" y="158" font-size="10.5" font-weight="800" fill="#BE123C" text-anchor="middle"%s>주기 = 2π ÷ b</text>' % ((X(0) + X(T)) / 2, HALO),
           '<text x="200" y="18" font-size="10.5" fill="#6B7280" text-anchor="middle"%s>네 숫자 a · b · c · d 는 각각 무엇을 바꿀까</text>' % HALO]
    return ''.join(out)


# ── 118 · 해가 무한히 많은 까닭 ─────────────────────────────────────
def te118():
    k = 0.5
    s1 = math.degrees(math.asin(k))
    s2 = 180 - s1
    assert abs(s1 - 30) < 1e-9 and abs(s2 - 150) < 1e-9
    X = lambda deg: 46 + 0.41 * deg
    Y = lambda v: 92 - 38.0 * v
    out = ['<path d="M40 92 H376 M46 34 V150" stroke="#9CA3AF" stroke-width="1.2"/>',
           '<path d="%s" stroke="#2563EB" stroke-width="2.4" fill="none" stroke-linecap="round"/>'
           % curve(lambda t: math.sin(math.radians(t)), 0, 780, X, Y),
           '<path d="M46 %.1f H376" stroke="#BE123C" stroke-width="1.3" stroke-dasharray="5 3"/>' % Y(k),
           '<text x="372" y="%.1f" font-size="10" font-weight="800" fill="#BE123C" text-anchor="end"%s>k = 0.5</text>' % (Y(k) - 6, HALO)]
    hits = []
    for n in range(3):
        hits += [s1 + 360 * n, s2 + 360 * n]
    for t in hits:
        if X(t) <= 376:
            out.append('<circle cx="%.1f" cy="%.1f" r="4.2" fill="#BE123C"/>' % (X(t), Y(k)))
    out.append('<text x="%.1f" y="%.1f" font-size="10" font-weight="800" fill="#BE123C" text-anchor="middle"%s>30°</text>' % (X(s1), Y(k) + 20, HALO))
    out.append('<text x="%.1f" y="%.1f" font-size="10" font-weight="800" fill="#BE123C" text-anchor="middle"%s>150°</text>' % (X(s2), Y(k) + 20, HALO))
    out.append('<text x="200" y="26" font-size="10.5" fill="#6B7280" text-anchor="middle"%s>직선 하나를 그었을 뿐인데 만나는 곳이 끝이 없다</text>' % HALO)
    out.append('<text x="200" y="166" font-size="10.5" fill="#6B7280" text-anchor="middle"%s>한 바퀴마다 같은 일이 되풀이된다 — 그래서 «+ 360°n»</text>' % HALO)
    return ''.join(out)


# ── 119 · 두 파동을 더하면 ──────────────────────────────────────────
def ts119():
    a, b = 2.0, 1.0
    R = math.hypot(a, b)
    al = math.atan2(b, a)
    for t in (0.3, 1.1, 2.7):
        assert abs(a * math.sin(t) + b * math.cos(t) - R * math.sin(t + al)) < 1e-9
    X = lambda t: 48 + 44.0 * t
    Y = lambda v: 90 - 20.0 * v
    out = ['<path d="M40 90 H376 M48 28 V152" stroke="#9CA3AF" stroke-width="1.2"/>',
           '<path d="%s" stroke="#9CA3AF" stroke-width="1.6" fill="none" stroke-dasharray="4 3"/>'
           % curve(lambda t: a * math.sin(t), 0, 7.2, X, Y),
           '<path d="%s" stroke="#B45309" stroke-width="1.6" fill="none" stroke-dasharray="4 3"/>'
           % curve(lambda t: b * math.cos(t), 0, 7.2, X, Y),
           '<path d="%s" stroke="#2563EB" stroke-width="2.6" fill="none" stroke-linecap="round"/>'
           % curve(lambda t: a * math.sin(t) + b * math.cos(t), 0, 7.2, X, Y),
           '<path d="M48 %.1f H376" stroke="#BE123C" stroke-width="1.2" stroke-dasharray="4 3"/>' % Y(R),
           '<text x="372" y="%.1f" font-size="10" font-weight="800" fill="#BE123C" text-anchor="end"%s>최댓값 R = √5</text>' % (Y(R) - 6, HALO),
           '<text x="200" y="22" font-size="10.5" fill="#6B7280" text-anchor="middle"%s>두 파동을 더했더니 — 또 하나의 파동이 되었다</text>' % HALO,
           '<text x="200" y="166" font-size="10.5" fill="#6B7280" text-anchor="middle"%s>a sin x + b cos x = R sin(x + α)</text>' % HALO]
    return ''.join(out)


# ── 120 · 각 없이 넓이 ──────────────────────────────────────────────
def hr120():
    a, b, c = 13.0, 14.0, 15.0
    s = (a + b + c) / 2
    ar = math.sqrt(s * (s - a) * (s - b) * (s - c))
    assert abs(ar - 84.0) < 1e-9, ar
    # c 를 밑변으로 두고 꼭짓점 찾기
    x = (c * c + b * b - a * a) / (2 * c)
    y = math.sqrt(b * b - x * x)
    sc = 7.6
    bx, by = 118.0, 136.0
    P = [(bx, by), (bx + c * sc, by), (bx + x * sc, by - y * sc)]
    out = ['<polygon points="%s" fill="#0E9384" opacity=".16" stroke="#0E9384" stroke-width="2"/>'
           % ' '.join('%.1f,%.1f' % p for p in P)]
    lab = [((P[0][0] + P[1][0]) / 2, by + 18, 'c = 15', '#92400E'),
           ((P[0][0] + P[2][0]) / 2 - 16, (P[0][1] + P[2][1]) / 2, 'b = 14', '#1D4ED8'),
           ((P[1][0] + P[2][0]) / 2 + 18, (P[1][1] + P[2][1]) / 2, 'a = 13', '#1D4ED8')]
    for lx, ly, t, col in lab:
        out.append('<text x="%.1f" y="%.1f" font-size="10.5" font-weight="800" fill="%s" text-anchor="middle"%s>%s</text>'
                   % (lx, ly, col, HALO, t))
    out.append('<text x="310" y="52" font-size="11" font-weight="800" fill="#111827"%s>s = (13+14+15)÷2 = 21</text>' % HALO)
    out.append('<text x="310" y="74" font-size="11" font-weight="800" fill="#BE123C"%s>넓이 = %.0f</text>' % (HALO, ar))
    out.append('<text x="200" y="20" font-size="10.5" fill="#6B7280" text-anchor="middle"%s>각을 하나도 재지 않고 넓이를 구할 수 있을까</text>' % HALO)
    return ''.join(out)
