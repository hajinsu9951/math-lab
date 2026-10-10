# -*- coding: utf-8 -*-
"""LAB 321~330 「오늘의 문제」 그림 — 좌표를 계산해서 그린다.

도형과 식, 논리의 기본기 묶음이다. 그림에 적는 수는 실험 화면과 같은 식으로 구해
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


# ── 321 · 어디까지 믿어도 될까 ──────────────────────────────────────
EX_X = [1, 2, 3, 4, 5, 6, 7, 8]
EX_Y = [2.1, 3.9, 6.2, 7.8, 10.1, 12.2, 13.8, 16.1]


def _fit(deg):
    """최소제곱 다항식 — 정규방정식을 가우스 소거로 푼다."""
    n = deg + 1
    A = [[sum(x ** (i + j) for x in EX_X) for j in range(n)] for i in range(n)]
    b = [sum(y * x ** i for x, y in zip(EX_X, EX_Y)) for i in range(n)]
    for i in range(n):
        p = max(range(i, n), key=lambda r: abs(A[r][i]))
        A[i], A[p] = A[p], A[i]
        b[i], b[p] = b[p], b[i]
        for r in range(i + 1, n):
            f = A[r][i] / A[i][i]
            for c in range(i, n):
                A[r][c] -= f * A[i][c]
            b[r] -= f * b[i]
    c = [0.0] * n
    for i in range(n - 1, -1, -1):
        c[i] = (b[i] - sum(A[i][j] * c[j] for j in range(i + 1, n))) / A[i][i]
    return c


def _ev(c, x):
    return sum(v * x ** i for i, v in enumerate(c))


def ex321():
    c1, c5 = _fit(1), _fit(5)
    p1, p5 = _ev(c1, 14), _ev(c5, 14)
    assert abs(p1 - 28) < 1.5, p1
    assert abs(p5 - p1) > 20, (p1, p5)
    ox, oy = 36.0, 142.0
    X = lambda x: ox + x * 20.0
    lo = min(0, p5)
    hi = max(30, p5)
    Y = lambda v: oy - (v - lo) / (hi - lo) * 100.0
    out = [poly([(ox - 6, oy), (ox + 310, oy)], GREY, 1.0), head(ox + 314, oy, 1, 0),
           poly([(ox, oy + 6), (ox, 36)], GREY, 1.0), head(ox, 32, 0, -1)]
    out.append(rect(X(1), 38, X(8) - X(1), oy - 38, '#2563EB', '.06'))
    out.append(txt((X(1) + X(8)) / 2, 50, '자료가 있는 구간', 9, '#6B7280', anc='middle'))
    out.append(poly([(X(x / 4), Y(_ev(c1, x / 4))) for x in range(0, 57)], '#0E9384', 1.8))
    pts5 = [(X(x / 4), Y(_ev(c5, x / 4))) for x in range(0, 57)]
    out.append(poly([p for p in pts5 if 20 < p[1] < 160], '#BE123C', 1.8))
    for x, y in zip(EX_X, EX_Y):
        out.append(dot(X(x), Y(y), 2.8, '#111827'))
    out.append(dot(X(14), Y(p1), 3.4, '#0E9384'))
    out.append(txt(14, 163, '검은 점 = 자료 · 초록 = 1 차 · 붉은 = 5 차 맞춤', 9.5, '#6B7280'))
    out.append(txt(X(14) - 2, 36, 'x = 14', 9, '#111827', anc='middle'))
    out.append(txt(206, 46, '구간 밖 x = 14 의 예측', 10, '#111827', w=800))
    out.append(txt(206, 68, '1 차  %.1f' % p1, 10.5, '#0E9384', w=800))
    out.append(txt(206, 88, '5 차  %.0f' % p5, 10.5, '#BE123C', w=800))
    out.append(txt(206, 112, '자료에는 5 차가 더 잘 맞는데', 9.5, '#6B7280'))
    out.append(txt(206, 128, '밖에서는 크게 튄다', 9.5, '#BE123C', w=800))
    out.append(cap('자료 밖의 예측을 어디까지 믿을까'))
    return ''.join(out)


# ── 322 · 만날까 나란할까 ───────────────────────────────────────────
def pp322():
    m1, m2 = 2.0, -0.5
    assert abs(m1 * m2 + 1) < 1e-12
    out = []
    for k, (lab, mm, bb, col, note) in enumerate(
            [('수직 — 기울기의 곱이 −1', [(m1, 1.0), (m2, -1.0)], None, '#BE123C', '곱 = −1'),
             ('평행 — 기울기가 같다', [(1.0, 1.5), (1.0, -1.5)], None, '#0E9384', '기울기가 같다')]):
        cx, cy, u = 92.0 + k * 196.0, 100.0, 26.0
        out.append(cross(cx, cy, 56))
        for (m, b) in mm:
            pts = [(cx + t * u, cy - (m * t + b) * u) for t in (-2.2, 2.2)]
            out.append(poly(pts, col, 2.0))
        out.append(txt(cx, 44, lab, 9.5, col, anc='middle', w=800))
        out.append(txt(cx, 162, note, 9.5, col, anc='middle', w=800))
    out.append(txt(14, 24, '', 9, GREY))
    out.append(txt(200, 150, 'm₁ m₂ = −1 이면 수직 · m₁ = m₂ 이고 절편이 다르면 평행',
                   9.5, '#111827', anc='middle', w=800))
    out.append(cap('두 직선이 만날까 나란할까'))
    return ''.join(out)


# ── 323 · 얼마나 떨어져 있나 ────────────────────────────────────────
def pl323():
    a, b, c = 3.0, -4.0, 2.0
    px, py = 2.0, 1.0
    val = a * px + b * py + c
    d = abs(val) / hypot(a, b)
    assert abs(hypot(a, b) - 5) < 1e-12 and abs(d - 0.8) < 1e-12, (val, d)
    cx, cy, u = 120.0, 96.0, 30.0
    out = [cross(cx, cy, 58)]
    pts = [(cx + t * u, cy - ((a * t + c) / -b) * u) for t in (-3.4, 3.4)]
    out.append(poly(pts, '#2563EB', 2.0))
    sx, sy = cx + px * u, cy - py * u
    nx, ny = a / hypot(a, b), b / hypot(a, b)
    fx, fy = px - val / (a * a + b * b) * a, py - val / (a * a + b * b) * b
    out.append(poly([(sx, sy), (cx + fx * u, cy - fy * u)], '#BE123C', 1.8, dash=1))
    out.append(dot(sx, sy, 3.8, '#111827'))
    out.append(dot(cx + fx * u, cy - fy * u, 3.0, '#BE123C'))
    out.append(txt(sx + 7, sy - 4, 'P(%g, %g)' % (px, py), 9.5, '#111827', w=800))
    out.append(txt(14, 163, '붉은 점선 = 직선에 내린 수선 — 그 길이가 거리다', 9.5, '#6B7280'))
    out.append(txt(214, 46, '직선  %gx %+gy %+g = 0' % (a, b, c), 10, '#2563EB', w=800))
    out.append(txt(214, 70, '식에 넣은 값  %+g' % val, 10, '#6B7280'))
    out.append(txt(214, 90, '√(a² + b²) = %g' % hypot(a, b), 10, '#6B7280'))
    out.append(txt(214, 114, '거리 = |%+g| ÷ %g = %.1f' % (val, hypot(a, b), d), 10.5,
                   '#BE123C', w=800))
    out.append(txt(214, 134, '분모를 빼먹으면', 9.5, '#6B7280'))
    out.append(txt(214, 150, '거리가 아니라 식의 값일 뿐', 9.5, '#6B7280'))
    out.append(cap('점과 직선은 얼마나 떨어져 있나'))
    return ''.join(out)


# ── 324 · 만날까 스칠까 비켜 갈까 ───────────────────────────────────
def cl324():
    r, m = 1.5, 0.5
    ks = [0.5, r * hypot(m, 1), 2.6]
    ds = [abs(k) / hypot(m, -1) for k in ks]
    assert abs(ds[1] - r) < 1e-9, ds
    assert ds[0] < r < ds[2], ds
    out = []
    for k, (kk, dd, lab, col) in enumerate(zip(ks, ds, ['두 점에서 만난다', '접한다', '만나지 않는다'],
                                               ['#0E9384', '#B45309', '#BE123C'])):
        cx, cy, u = 72.0 + k * 130.0, 98.0, 23.0
        out.append('<circle cx="%.1f" cy="%.1f" r="%.1f" fill="none" stroke="#2563EB" '
                   'stroke-width="1.6"/>' % (cx, cy, r * u))
        pts = [(cx + t * u, cy - (m * t + kk) * u) for t in (-2.6, 2.6)]
        out.append(poly(pts, col, 1.8))
        out.append(poly([(cx, cy), (cx - m * dd / hypot(m, 1) * u, cy - dd / hypot(m, 1) * u)],
                        GREY, 1.0, dash=1))
        out.append(dot(cx, cy, 2.6, '#9CA3AF'))
        out.append(txt(cx, 48, lab, 9.5, col, anc='middle', w=800))
        out.append(txt(cx, 150, 'd = %.2f' % dd, 9.5, col, anc='middle', w=800))
    out.append(txt(14, 163, '원의 반지름 r = %.1f — d 와 r 을 견주면 판정이 끝난다' % r, 9.5, '#6B7280'))
    out.append(cap('원과 직선은 만날까 스칠까'))
    return ''.join(out)


# ── 325 · 옮겨도 남는 것 ────────────────────────────────────────────
def fs325():
    a, b = 2.0, -1.0
    assert abs(a) > 0
    cx, cy, u = 108.0, 112.0, 26.0
    out = [cross(cx, cy, 62)]
    for sh, col, w in ((0, '#9CA3AF', 1.4), (1, '#2563EB', 2.2)):
        pts = []
        for i in range(61):
            x = -2.4 + i * 4.8 / 60
            y = (x - (a if sh else 0)) ** 2 + (b if sh else 0)
            if -1.6 < y < 3.4:
                pts.append((cx + x * u + (0 if not sh else 0), cy - y * u))
        out.append(poly(pts, col, w))
    out.append(arrow(cx - 10, cy - 1.4 * u, cx + a * u - 10, cy - (1.4 + b) * u, '#BE123C', 1.6))
    out.append(txt(14, 163, '회색 = y = x² · 파랑 = 옮긴 도형 — 모양은 그대로다', 9.5, '#6B7280'))
    out.append(txt(214, 46, '오른쪽으로 %g · 위로 %g' % (a, b), 10, '#111827', w=800))
    out.append(txt(214, 72, 'y = (x − %g)² + (%g)' % (a, b), 11, '#2563EB', w=800))
    out.append(txt(214, 98, 'x 자리에는 x − a 를 넣는다', 10, '#BE123C', w=800))
    out.append(txt(214, 120, '오른쪽으로 옮기는데 식에서는', 9.5, '#6B7280'))
    out.append(txt(214, 136, '빼기 — 부호를 거꾸로 쓰면', 9.5, '#6B7280'))
    out.append(txt(214, 152, '반대쪽으로 간다', 9.5, '#6B7280'))
    out.append(cap('옮겨도 남는 것과 바뀌는 것'))
    return ''.join(out)


# ── 326 · 무엇이 바뀌는가 ───────────────────────────────────────────
def rf326():
    p = (2.0, 1.0)
    maps = [('x 축', (p[0], -p[1]), '#BE123C'), ('y 축', (-p[0], p[1]), '#0E9384'),
            ('원점', (-p[0], -p[1]), '#B45309'), ('y = x', (p[1], p[0]), '#7C3AED')]
    assert maps[3][1] == (1.0, 2.0)
    cx, cy, u = 110.0, 96.0, 26.0
    out = [cross(cx, cy, 60)]
    out.append(poly([(cx - 60, cy + 60), (cx + 60, cy - 60)], '#D1D5DB', 1.0, dash=1))
    out.append(dot(cx + p[0] * u, cy - p[1] * u, 4.2, '#111827'))
    out.append(txt(cx + p[0] * u + 7, cy - p[1] * u - 4, 'P(2, 1)', 9.5, '#111827', w=800))
    for nm, q, col in maps:
        out.append(dot(cx + q[0] * u, cy - q[1] * u, 3.6, col))
        out.append(txt(cx + q[0] * u + (7 if q[0] >= 0 else -7), cy - q[1] * u + 13,
                       nm, 8.5, col, anc='start' if q[0] >= 0 else 'end', w=800))
    out.append(txt(14, 163, '점선 = y = x — 이 대칭만 x 와 y 를 통째로 맞바꾼다', 9.5, '#6B7280'))
    out.append(txt(212, 44, 'P(2, 1) 을 옮기면', 10, '#111827', w=800))
    for i, (nm, q, col) in enumerate(maps):
        out.append(txt(212, 66 + i * 20, '%-5s → (%g, %g)' % (nm, q[0], q[1]), 10, col, w=800))
    out.append(txt(212, 152, '앞 셋은 부호만, 끝은 자리바꿈', 9.5, '#6B7280'))
    out.append(cap('대칭이동에서 무엇이 바뀌는가'))
    return ''.join(out)


# ── 327 · 어디를 칠할까 ─────────────────────────────────────────────
def so327():
    CNT = [12, 9, 6, 13]                                 # A만 · B만 · 둘다 · 바깥
    REG = {'A ∪ B': [1, 1, 1, 0], 'A ∩ B': [0, 0, 1, 0], 'A − B': [1, 0, 0, 0],
           'Aᶜ': [0, 1, 0, 1]}
    vals = {k: sum(v * c for v, c in zip(r, CNT)) for k, r in REG.items()}
    assert vals['A ∪ B'] == 27 and vals['A ∩ B'] == 6 and vals['A − B'] == 12
    assert vals['Aᶜ'] == 22
    out = []
    for k, (nm, reg, col) in enumerate([('A ∪ B', REG['A ∪ B'], '#2563EB'),
                                        ('A ∩ B', REG['A ∩ B'], '#0E9384'),
                                        ('A − B', REG['A − B'], '#B45309'),
                                        ('Aᶜ', REG['Aᶜ'], '#BE123C')]):
        ox, oy, r = 62.0 + k * 92.0, 92.0, 25.0
        out.append(rect(ox - 44, oy - 34, 88, 68, '#111827', '.04', stroke='#D1D5DB', sw=0.9))
        if reg[3]:
            out.append(rect(ox - 44, oy - 34, 88, 68, col, '.16'))
        for idx, dx in ((0, -12), (1, 12)):
            if reg[idx]:
                out.append('<circle cx="%.1f" cy="%.1f" r="%.1f" fill="%s" fill-opacity=".30" '
                           'stroke="none"/>' % (ox + dx, oy, r, col))
        if reg[2]:
            out.append('<circle cx="%.1f" cy="%.1f" r="%.1f" fill="%s" fill-opacity=".45" '
                       'stroke="none"/>' % (ox, oy, 11, col))
        for dx in (-12, 12):
            out.append('<circle cx="%.1f" cy="%.1f" r="%.1f" fill="none" stroke="#6B7280" '
                       'stroke-width="1.1"/>' % (ox + dx, oy, r))
        out.append(txt(ox, 46, nm, 10.5, col, anc='middle', w=800))
        out.append(txt(ox, 148, '%d 명' % vals[nm], 10, col, anc='middle', w=800))
    out.append(txt(14, 163, 'A 만 %d · B 만 %d · 둘 다 %d · 바깥 %d (모두 %d 명)'
                   % (CNT[0], CNT[1], CNT[2], CNT[3], sum(CNT)), 9.5, '#6B7280'))
    out.append(cap('어느 구역을 칠해야 할까'))
    return ''.join(out)


# ── 328 · 안이냐 밖이냐 ─────────────────────────────────────────────
def dp328():
    A, B = (-3.0, -1.0), (3.0, 2.0)
    m, n = 1.0, 2.0
    Pin = ((m * B[0] + n * A[0]) / (m + n), (m * B[1] + n * A[1]) / (m + n))
    Pex = ((m * B[0] - n * A[0]) / (m - n), (m * B[1] - n * A[1]) / (m - n))
    assert abs(Pin[0] + 1) < 1e-12 and abs(Pin[1]) < 1e-12, Pin
    assert abs(Pex[0] + 9) < 1e-12 and abs(Pex[1] + 4) < 1e-12, Pex
    cx, cy, u = 190.0, 84.0, 17.0
    X = lambda p: (cx + p[0] * u, cy - p[1] * u)
    out = [cross(cx, cy, 70)]
    out.append(poly([X(A), X(B)], '#2563EB', 2.4))
    out.append(poly([X(Pex), X(A)], '#D1D5DB', 1.2, dash=1))
    for p, nm, col in ((A, 'A(−3, −1)', '#111827'), (B, 'B(3, 2)', '#111827'),
                       (Pin, '내분점 (−1, 0)', '#0E9384'), (Pex, '외분점 (−9, −4)', '#BE123C')):
        q = X(p)
        out.append(dot(q[0], q[1], 3.8, col))
        out.append(txt(q[0] + 8, q[1] + (-7 if (p is B or p is Pex) else 14), nm,
                       9, col, w=800))
    out.append(txt(14, 163, 'm : n = 1 : 2 — 내분은 안쪽, 외분은 바깥쪽에 생긴다', 9.5, '#6B7280'))
    out.append(txt(14, 46, '내분  (mB + nA) ÷ (m + n)', 10, '#0E9384', w=800))
    out.append(txt(14, 66, '외분  (mB − nA) ÷ (m − n)', 10, '#BE123C', w=800))
    out.append(txt(14, 92, 'm = n 이면 분모가 0', 9.5, '#111827', w=800))
    out.append(txt(14, 108, '→ 외분점이 없다', 9.5, '#6B7280'))
    out.append(cap('안에서 나누기와 밖에서 나누기'))
    return ''.join(out)


# ── 329 · 반드시 있는 자리 ──────────────────────────────────────────
def mv329():
    a, b = -2.0, 2.0
    slope = (b * b - a * a) / (b - a)                    # 평균 변화율
    c = slope / 2                                        # f'(c) = 2c
    assert abs(slope - 0) < 1e-12 and abs(c) < 1e-12, (slope, c)
    b2 = 3.0
    s2 = (b2 * b2 - a * a) / (b2 - a)
    c2 = s2 / 2
    assert abs(s2 - 1) < 1e-12 and abs(c2 - 0.5) < 1e-12, (s2, c2)
    ox, oy, u = 150.0, 136.0, 26.0
    X = lambda x: ox + x * u
    Y = lambda y: oy - y * u * 0.5
    out = [poly([(X(-2.6), oy), (X(3.4), oy)], GREY, 1.0), head(X(3.5), oy, 1, 0),
           poly([(ox, oy + 6), (ox, 36)], GREY, 1.0), head(ox, 32, 0, -1)]
    out.append(poly([(X(-2.4 + i * 5.8 / 60), Y((-2.4 + i * 5.8 / 60) ** 2)) for i in range(61)],
                    '#2563EB', 2.0))
    out.append(poly([(X(a), Y(a * a)), (X(b2), Y(b2 * b2))], '#0E9384', 1.6))
    out.append(poly([(X(c2 - 1.2), Y(c2 * c2 - 1.2 * s2)), (X(c2 + 1.2), Y(c2 * c2 + 1.2 * s2))],
                    '#BE123C', 1.6, dash=1))
    for x, col in ((a, '#0E9384'), (b2, '#0E9384'), (c2, '#BE123C')):
        out.append(dot(X(x), Y(x * x), 3.4, col))
    out.append(txt(X(c2) + 6, Y(c2 * c2) + 16, 'c = %.1f' % c2, 9.5, '#BE123C', w=800))
    out.append(txt(14, 163, '초록 = 두 끝을 잇는 할선 · 붉은 점선 = 그와 나란한 접선', 9.5, '#6B7280'))
    out.append(txt(254, 46, 'f(x) = x² · 구간 [%g, %g]' % (a, b2), 9.5, '#111827', w=800))
    out.append(txt(254, 68, '평균 변화율 = %g' % s2, 10, '#0E9384', w=800))
    out.append(txt(254, 88, "f′(c) = 2c = %g" % s2, 10, '#BE123C', w=800))
    out.append(txt(254, 108, '→ c = %.1f' % c2, 11, '#BE123C', w=800))
    out.append(txt(254, 132, '구간 안에 이런 c 가', 9.5, '#6B7280'))
    out.append(txt(254, 148, '반드시 하나는 있다', 9.5, '#6B7280'))
    out.append(cap('할선과 나란한 접선이 반드시 있을까'))
    return ''.join(out)


# ── 330 · 하나면 충분하다 ───────────────────────────────────────────
def ce330():
    rows = [('4의 배수', '2의 배수', True, '—'),
            ('2의 배수', '4의 배수', False, '6'),
            ('6의 배수', '3의 배수', True, '—'),
            ('3의 배수', '홀수', False, '6')]
    assert sum(1 for r in rows if r[2]) == 2
    out = [txt(24, 46, 'p 이면', 9.5, '#6B7280'), txt(132, 46, 'q 이다', 9.5, '#6B7280'),
           txt(248, 46, '참 / 거짓', 9.5, '#6B7280'), txt(330, 46, '반례', 9.5, '#6B7280')]
    out.append(poly([(14, 52), (386, 52)], GREY, 1.0))
    for i, (p, q, ok, cs) in enumerate(rows):
        y = 76.0 + i * 24.0
        col = '#0E9384' if ok else '#BE123C'
        out.append(txt(24, y, p, 10, '#111827'))
        out.append(txt(118, y, '→', 10, '#9CA3AF'))
        out.append(txt(132, y, q, 10, '#111827'))
        out.append(txt(248, y, '참' if ok else '거짓', 10, col, w=800))
        out.append(txt(330, y, cs, 10, '#B45309' if not ok else '#D1D5DB', w=800))
    out.append(txt(14, 163, '반례가 하나라도 있으면 그 명제는 거짓이다 — 아무리 많은 예도 증명은 아니다',
                   9.5, '#6B7280'))
    out.append(cap('반례 하나면 충분하다'))
    return ''.join(out)


FNS = [('ex321', ex321), ('pp322', pp322), ('pl323', pl323), ('cl324', cl324), ('fs325', fs325),
       ('rf326', rf326), ('so327', so327), ('dp328', dp328), ('mv329', mv329), ('ce330', ce330)]

if __name__ == '__main__':
    import sys
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass
    for nm, f in FNS:
        sys.stdout.write('%-7s %5d자  ok\n' % (nm, len(f())))
