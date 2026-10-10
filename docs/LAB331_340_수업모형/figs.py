# -*- coding: utf-8 -*-
"""LAB 331~340 「오늘의 문제」 그림 — 좌표를 계산해서 그린다.

함수의 성질과 수치·정보 묶음이다. 그림에 적는 수는 실험 화면과 같은 식으로 구해
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


# ── 331 · 짝이 하나씩 맞는가 ────────────────────────────────────────
def oo331():
    y0 = 3.0
    xs_sq = [sqrt(y0), -sqrt(y0)]                        # y = x² 는 두 점
    xs_cu = [y0 ** (1 / 3)]                              # y = x³ 는 한 점
    assert len(xs_sq) == 2 and len(xs_cu) == 1
    out = []
    for k, (lab, f, xs, col, note) in enumerate(
            [('y = x²', lambda x: x * x, xs_sq, '#BE123C', '한 높이에서 두 점 — 일대일이 아니다'),
             ('y = x³', lambda x: x ** 3, xs_cu, '#0E9384', '어느 높이에서나 한 점 — 일대일')]):
        cx, cy, u = 92.0 + k * 196.0, 118.0, 22.0
        out.append(cross(cx, cy, 54))
        pts = []
        for i in range(81):
            x = -2.2 + i * 4.4 / 80
            v = f(x)
            if -1.6 < v < 4.4:
                pts.append((cx + x * u, cy - v * u))
        out.append(poly(pts, '#2563EB', 2.0))
        out.append(poly([(cx - 52, cy - y0 * u), (cx + 52, cy - y0 * u)], col, 1.6, dash=1))
        for x in xs:
            out.append(dot(cx + x * u, cy - y0 * u, 3.8, col))
        out.append(txt(cx, 44, lab, 10, '#2563EB', anc='middle', w=800))
        out.append(txt(cx, 162, note, 9, col, anc='middle', w=800))
    out.append(txt(14, 24, '', 9, GREY))
    out.append(cap('수평선을 그어 보면 알 수 있을까'))
    return ''.join(out)


# ── 332 · 닿지 않는 선 ──────────────────────────────────────────────
def ra332():
    k, p, q = 2.0, 1.0, 1.0
    xs = [p + d for d in (1.0, 0.5, 0.2, 0.1)]
    vals = [k / (x - p) + q for x in xs]
    assert abs(vals[-1] - 21) < 1e-9, vals
    cx, cy, u = 104.0, 96.0, 24.0
    out = [cross(cx, cy, 58)]
    out.append(poly([(cx + p * u, 30), (cx + p * u, 160)], '#BE123C', 1.2, dash=1))
    out.append(poly([(28, cy - q * u), (190, cy - q * u)], '#BE123C', 1.2, dash=1))
    for sgn in (1, -1):
        pts = []
        for i in range(1, 70):
            x = p + sgn * i * 0.05
            v = k / (x - p) + q
            if -2.6 < v < 3.4 and -2.2 < x - 0 < 3.4:
                pts.append((cx + x * u, cy - v * u))
        if pts:
            out.append(poly(pts, '#2563EB', 2.0))
    out.append(txt(cx + p * u + 5, 40, 'x = %g' % p, 9, '#BE123C', w=800))
    out.append(txt(32, cy - q * u - 5, 'y = %g' % q, 9, '#BE123C', w=800))
    out.append(txt(14, 163, '붉은 점선 = 점근선 — 닿지는 않고 한없이 가까워진다', 9.5, '#6B7280'))
    out.append(txt(212, 44, 'y = %g ÷ (x − %g) + %g' % (k, p, q), 10, '#2563EB', w=800))
    out.append(txt(212, 68, 'x 가 %g 에 다가가면' % p, 9.5, '#6B7280'))
    for i, (x, v) in enumerate(zip(xs, vals)):
        out.append(txt(212, 86 + i * 16, 'x = %.1f → y = %.1f' % (x, v), 9.5, '#111827'))
    out.append(txt(212, 152, '정의역은 x ≠ %g' % p, 9.5, '#BE123C', w=800))
    out.append(cap('닿지 않으면서 한없이 가까워지는 선'))
    return ''.join(out)


# ── 333 · 여기서부터 시작 ───────────────────────────────────────────
def ir333():
    a, p, q = 1.0, 1.0, 0.0
    assert a > 0
    cx, cy, u = 104.0, 120.0, 26.0
    out = [cross(cx, cy, 58)]
    pts = [(cx + (p + t * t) * u, cy - (sqrt(a * t * t) + q) * u) for t in
           [i * 1.6 / 60 for i in range(61)]]
    out.append(poly(pts, '#2563EB', 2.2))
    out.append(dot(cx + p * u, cy - q * u, 4.0, '#BE123C'))
    out.append(poly([(cx + p * u, cy - q * u + 6), (cx + p * u, cy - q * u - 70)],
                    '#BE123C', 1.0, dash=1))
    out.append(txt(cx + p * u + 7, cy - q * u + 16, '시작점 (%g, %g)' % (p, q), 9.5, '#BE123C',
                   w=800))
    out.append(rect(28, cy - 66, cx + p * u - 28, 72, '#9CA3AF', '.14'))
    out.append(txt(30, cy - 56, '값이 없는 곳', 9, '#6B7280'))
    out.append(txt(14, 163, '근호 안이 음수가 되는 x 에서는 값이 아예 없다', 9.5, '#6B7280'))
    out.append(txt(212, 46, 'y = √(a(x − p)) + q', 10.5, '#2563EB', w=800))
    out.append(txt(212, 72, 'a > 0 이면  x ≥ %g' % p, 10, '#111827', w=800))
    out.append(txt(212, 92, 'a < 0 이면  x ≤ %g' % p, 10, '#B45309', w=800))
    out.append(txt(212, 118, '그래프는 시작점에서', 9.5, '#6B7280'))
    out.append(txt(212, 134, '한쪽으로만 뻗는다', 9.5, '#6B7280'))
    out.append(cap('어디서부터 그려지는가'))
    return ''.join(out)


# ── 334 · 조금 흔들었을 뿐인데 ──────────────────────────────────────
def ic334():
    d = 0.1
    ts = [0.8, 0.5, 0.2, 0.04]
    ys = [d / t for t in ts]
    amp = [hypot(-y, y) / d for y in ys]
    assert abs(ys[-1] - 2.5) < 1e-9, ys
    assert amp[-1] > amp[0] * 10, amp
    out = [txt(26, 46, '벌어진 정도', 9.5, '#6B7280'), txt(140, 46, '해의 y', 9.5, '#6B7280'),
           txt(250, 46, '증폭률', 9.5, '#6B7280')]
    out.append(poly([(20, 52), (330, 52)], GREY, 1.0))
    for i, (t, y, a) in enumerate(zip(ts, ys, amp)):
        yy = 72.0 + i * 20.0
        col = '#BE123C' if t <= 0.2 else '#111827'
        out.append(txt(26, yy, '%.2f' % t, 9.5, col))
        out.append(txt(140, yy, '%+.2f' % y, 9.5, col, w=800 if t <= 0.2 else None))
        out.append(txt(250, yy, '%.1f 배' % a, 9.5, col, w=800 if t <= 0.2 else None))
        out.append(rect(300, yy - 9, min(70, a * 2.6), 9, col, '.45'))
    out.append(txt(14, 163, '우변을 %.2f 만큼 흔들었을 때 해가 얼마나 움직이는가' % d, 9.5, '#6B7280'))
    out.append(txt(14, 140, '두 직선이 거의 나란할수록 같은 흔들림이 크게 증폭된다',
                   10, '#BE123C', w=800))
    out.append(cap('조금 흔들었을 뿐인데 답이 달아난다'))
    return ''.join(out)


# ── 335 · 나란한 것이 만나는 곳 ─────────────────────────────────────
def vp335():
    h = 1.5
    out = []
    ox, oy = 40.0, 150.0
    hz = 62.0                                            # 지평선
    vx = 250.0                                           # 소실점
    out.append(poly([(14, hz), (386, hz)], '#9CA3AF', 1.2))
    out.append(txt(18, hz - 6, '지평선 (눈높이)', 9, '#6B7280'))
    for y0 in (150.0, 132.0, 114.0, 96.0):
        out.append(poly([(ox, y0), (vx, hz)], '#2563EB', 1.4))
    out.append(dot(vx, hz, 4.4, '#BE123C'))
    out.append(txt(vx + 8, hz + 12, '소실점', 9.5, '#BE123C', w=800))
    out.append(txt(14, 163, '실제로는 나란한 선들이 그림에서는 한 점에서 만난다', 9.5, '#6B7280'))
    out.append(txt(276, 86, '방향이 같은 선은', 9.5, '#111827', w=800))
    out.append(txt(276, 102, '모두 같은 소실점으로', 9.5, '#6B7280'))
    out.append(txt(276, 118, '모인다', 9.5, '#6B7280'))
    out.append(txt(276, 140, '화면과 나란해지면', 9.5, '#BE123C', w=800))
    out.append(txt(276, 156, '소실점이 달아난다', 9.5, '#BE123C', w=800))
    out.append(cap('나란한 것들이 만나는 곳'))
    return ''.join(out)


# ── 336 · 접선을 따라 내려가기 ──────────────────────────────────────
def nw336():
    xs = [2.0]
    for _ in range(4):
        x = xs[-1]
        xs.append(x - (x * x - 2) / (2 * x))
    errs = [abs(x - sqrt(2)) for x in xs]
    assert errs[4] < 1e-10, errs
    ox, oy, u = 60.0, 140.0, 62.0
    X = lambda x: ox + (x - 1.0) * u
    Y = lambda v: oy - v * 14.0
    out = [poly([(ox - 10, oy), (ox + 120, oy)], GREY, 1.0), head(ox + 124, oy, 1, 0)]
    out.append(poly([(X(1.0 + i * 1.2 / 60), Y((1.0 + i * 1.2 / 60) ** 2 - 2)) for i in range(61)],
                    '#2563EB', 2.0))
    for i in range(3):
        x0, x1 = xs[i], xs[i + 1]
        out.append(poly([(X(x0), Y(x0 * x0 - 2)), (X(x1), Y(0))], '#BE123C', 1.2, dash=1))
        out.append(poly([(X(x1), Y(0)), (X(x1), Y(x1 * x1 - 2))], GREY, 0.9))
        out.append(dot(X(x0), Y(x0 * x0 - 2), 2.8, '#BE123C'))
    out.append(dot(X(sqrt(2)), Y(0), 3.6, '#0E9384'))
    out.append(txt(X(sqrt(2)) - 4, Y(0) + 15, '√2', 9.5, '#0E9384', anc='middle', w=800))
    out.append(txt(14, 163, '붉은 점선 = 접선 — 축과 만나는 곳이 다음 걸음', 9.5, '#6B7280'))
    out.append(txt(206, 44, 'x² − 2 = 0 · 시작점 2', 10, '#111827', w=800))
    for i in range(5):
        out.append(txt(206, 66 + i * 18, '%d 걸음  %.9f' % (i, xs[i]), 9.5,
                       '#0E9384' if i >= 3 else '#6B7280', w=800 if i >= 3 else None))
    out.append(txt(206, 152, '네 걸음 만에 오차 %.0e' % errs[4], 9.5, '#BE123C', w=800))
    out.append(cap('접선을 따라가면 답에 닿을까'))
    return ''.join(out)


# ── 337 · 같은 시간에 둘 수 없다 ────────────────────────────────────
GC_E = [(0, 1), (1, 2), (2, 0), (0, 3), (1, 3), (2, 4), (3, 4), (4, 5), (5, 0)]


def _greedy_color(k):
    adj = {v: set() for v in range(6)}
    for a, b in GC_E:
        adj[a].add(b)
        adj[b].add(a)
    c = [0] * 6
    for v in range(6):
        used = {c[u] for u in adj[v] if c[u]}
        c[v] = next((t for t in range(1, k + 1) if t not in used), 0) or 1
    return c


def gc337():
    c3, c2 = _greedy_color(3), _greedy_color(2)
    bad3 = [e for e in GC_E if c3[e[0]] == c3[e[1]]]
    bad2 = [e for e in GC_E if c2[e[0]] == c2[e[1]]]
    assert len(bad3) == 0 and len(bad2) > 0, (c3, bad3, c2, bad2)
    V = [(cos(radians(90 + 60 * i)) , sin(radians(90 + 60 * i))) for i in range(6)]
    PAL = {1: '#2563EB', 2: '#0E9384', 3: '#B45309'}
    out = []
    for k, (cc, bad, lab) in enumerate([(c3, bad3, '세 시간대 — 겹친 짝 0'),
                                        (c2, bad2, '두 시간대 — 겹친 짝 %d' % len(bad2))]):
        ox, oy, u = 92.0 + k * 196.0, 104.0, 42.0
        for a, b in GC_E:
            p = (ox + V[a][0] * u, oy - V[a][1] * u)
            q = (ox + V[b][0] * u, oy - V[b][1] * u)
            clash = cc[a] == cc[b]
            out.append(poly([p, q], '#BE123C' if clash else '#D1D5DB', 2.0 if clash else 1.1))
        for i, v in enumerate(V):
            out.append(dot(ox + v[0] * u, oy - v[1] * u, 6.0, PAL[cc[i]]))
        out.append(txt(ox, 44, lab, 9.5, '#0E9384' if not bad else '#BE123C',
                       anc='middle', w=800))
    out.append(txt(14, 163, '선으로 이어진 두 과목은 같은 시간에 둘 수 없다 — 붉은 선이 충돌',
                   9.5, '#6B7280'))
    out.append(cap('시간표를 몇 칸으로 짤 수 있을까'))
    return ''.join(out)


# ── 338 · 넓이는 그대로인데 함수는 사라진다 ────────────────────────
def li338():
    ns = [1, 2, 4, 8]
    areas = [0.5 * (2 / n) * n for n in ns]
    assert all(abs(a - 1) < 1e-12 for a in areas)
    ox, oy, u = 40.0, 142.0, 130.0                       # x: 0 … 1 을 u 로
    out = [poly([(ox - 6, oy), (ox + u + 14, oy)], GREY, 1.0), head(ox + u + 18, oy, 1, 0),
           poly([(ox, oy + 6), (ox, 36)], GREY, 1.0), head(ox, 32, 0, -1)]
    for n, col in zip(ns, ['#BFDBFE', '#93C5FD', '#3B82F6', '#1D4ED8']):
        w = 2.0 / n
        h = min(n, 7.5)
        out.append(poly([(ox, oy), (ox + w / 2 * u, oy - h * 13), (ox + w * u, oy)], col, 1.8))
    out.append(txt(ox + 6, 48, 'n 이 커질수록 좁고 높아진다', 9, '#6B7280'))
    out.append(dot(ox + 0.5 * u, oy, 3.0, '#BE123C'))
    out.append(txt(ox + 0.5 * u, oy + 12, 'x = 0.5', 9, '#BE123C', anc='middle', w=800))
    out.append(txt(14, 167, '한 점에서 보면 0 으로 가지만, 봉우리의 넓이는 늘 1 이다', 9.5, '#6B7280'))
    out.append(txt(212, 46, '밑변 2/n · 높이 n', 10, '#111827', w=800))
    out.append(txt(212, 70, '넓이 = ½ × 2/n × n = 1', 10.5, '#0E9384', w=800))
    out.append(txt(212, 96, 'x = 0.5 에서의 값', 10, '#6B7280'))
    for i, n in enumerate([2, 4, 8]):
        w = 2.0 / n
        v = 0 if 0.5 >= w else (n * (0.5 / (w / 2)) if 0.5 <= w / 2 else n * ((w - 0.5) / (w / 2)))
        out.append(txt(212, 116 + i * 16, 'n = %-2d → %.2f' % (n, v), 9.5, '#2563EB'))
    out.append(cap('함수는 사라지는데 넓이는 남는다'))
    return ''.join(out)


# ── 339 · 어느 질문을 먼저 할까 ─────────────────────────────────────
def es339():
    from math import log2
    groups = {'색': [(7, 1), (1, 7)], '크기': [(4, 4), (4, 4)]}

    def H2(a, b):
        n = a + b
        if not n:
            return 0.0
        p = a / n
        return 0.0 if p in (0, 1) else -(p * log2(p) + (1 - p) * log2(1 - p))

    H0 = H2(8, 8)
    gains = {k: H0 - sum((a + b) / 16 * H2(a, b) for a, b in g) for k, g in groups.items()}
    assert abs(H0 - 1) < 1e-12
    assert gains['색'] > 0.45 and abs(gains['크기']) < 1e-12, gains
    out = [txt(20, 46, '나누기 전 뒤섞임(엔트로피) = %.3f' % H0, 10, '#111827', w=800)]
    for k, (nm, col) in enumerate([('색', '#0E9384'), ('크기', '#BE123C')]):
        y = 76.0 + k * 42.0
        out.append(txt(20, y, '%s 로 나누면' % nm, 10, col, w=800))
        for j, (a, b) in enumerate(groups[nm]):
            x = 120.0 + j * 104.0
            out.append(rect(x, y - 14, 96, 20, col, '.12', stroke=col, sw=1.0))
            out.append(txt(x + 48, y, '○ %d · ● %d' % (a, b), 9.5, '#111827', anc='middle'))
        out.append(txt(336, y, '이득 %.3f' % gains[nm], 10, col, w=800))
    out.append(txt(20, 150, '같은 자료라도 먼저 던지는 질문에 따라 얻는 정보가 다르다',
                   9.5, '#111827', w=800))
    out.append(txt(14, 165, '○ = 한 쪽 무리 · ● = 다른 쪽 무리 (모두 16 개)', 9, '#6B7280'))
    out.append(cap('어느 질문을 먼저 던져야 할까'))
    return ''.join(out)


# ── 340 · 본 적 없다고 없는 건 아니다 ──────────────────────────────
def lp340():
    cnt = [12, 0, 7]
    tot, V = 60, 40
    p0 = [(c + 0) / (tot + 0) for c in cnt]
    p1 = [(c + 1) / (tot + V) for c in cnt]
    pr0 = p0[0] * p0[1] * p0[2]
    pr1 = p1[0] * p1[1] * p1[2]
    assert pr0 == 0 and pr1 > 0, (pr0, pr1)
    words = ['할인', '축제', '무료']
    out = [txt(24, 46, '단어', 9.5, '#6B7280'), txt(100, 46, '나온 횟수', 9.5, '#6B7280'),
           txt(196, 46, 'α = 0', 9.5, '#BE123C', w=800), txt(300, 46, 'α = 1', 9.5, '#0E9384',
                                                            w=800)]
    out.append(poly([(18, 52), (380, 52)], GREY, 1.0))
    for i, w in enumerate(words):
        y = 74.0 + i * 20.0
        out.append(txt(24, y, w, 10, '#111827'))
        out.append(txt(100, y, '%d 회' % cnt[i], 9.5, '#6B7280'))
        out.append(txt(196, y, '%.4f' % p0[i], 9.5, '#BE123C' if cnt[i] == 0 else '#111827',
                       w=800 if cnt[i] == 0 else None))
        out.append(txt(300, y, '%.4f' % p1[i], 9.5, '#0E9384'))
    out.append(poly([(18, 140), (380, 140)], GREY, 1.0))
    out.append(txt(24, 158, '세 확률의 곱', 10, '#111827', w=800))
    out.append(txt(196, 158, '%.4f' % pr0, 10, '#BE123C', w=800))
    out.append(txt(300, 158, '%.2e' % pr1, 10, '#0E9384', w=800))
    out.append(txt(24, 130, '한 단어가 0 이면 곱 전체가 0 — 다른 증거가 모두 묻힌다',
                   9.5, '#BE123C', w=800))
    out.append(cap('본 적 없다고 없는 것일까'))
    return ''.join(out)


FNS = [('oo331', oo331), ('ra332', ra332), ('ir333', ir333), ('ic334', ic334), ('vp335', vp335),
       ('nw336', nw336), ('gc337', gc337), ('li338', li338), ('es339', es339), ('lp340', lp340)]

if __name__ == '__main__':
    import sys
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass
    for nm, f in FNS:
        sys.stdout.write('%-7s %5d자  ok\n' % (nm, len(f())))
