# -*- coding: utf-8 -*-
"""LAB 241~250 「오늘의 문제」 그림 — 좌표를 계산해서 그린다.

수와 행렬 묶음이다. 그림에 적는 수는 실험 화면과 같은 식으로 구해 assert 로 묶었다.
"""
from math import sqrt, log, pi, cos, sin, tan, radians, floor, hypot

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


def poly(pts, col, w=2.4, dash=None, fill='none'):
    d = ' '.join('%s%.1f %.1f' % ('M' if i == 0 else 'L', p[0], p[1]) for i, p in enumerate(pts))
    return ('<path d="%s" stroke="%s" stroke-width="%s" fill="%s" stroke-linecap="round" '
            'stroke-linejoin="round"%s/>'
            % (d, col, w, fill, ' stroke-dasharray="5 4"' if dash else ''))


def dot(x, y, r=5.0, col='#111827'):
    return '<circle cx="%.1f" cy="%.1f" r="%.1f" fill="%s"/>' % (x, y, r, col)


def rect(x, y, w, h, col, op='.30', stroke=None, sw=1.2):
    return ('<rect x="%.1f" y="%.1f" width="%.1f" height="%.1f" fill="%s" fill-opacity="%s"%s/>'
            % (x, y, w, h, col, op,
               ' stroke="%s" stroke-width="%s"' % (stroke, sw) if stroke else ''))


def shape(pts, col, op='.22', stroke=None, sw=1.6):
    d = ' '.join('%s%.1f %.1f' % ('M' if i == 0 else 'L', p[0], p[1]) for i, p in enumerate(pts))
    return ('<path d="%s Z" fill="%s" fill-opacity="%s" stroke="%s" stroke-width="%s"/>'
            % (d, col, op, stroke or col, sw))


# ── 241 · 그날은 무슨 요일일까 ──────────────────────────────────────
def wd241():
    assert 100 % 7 == 2 and 100 // 7 == 14                  # 100일 뒤는 이틀 민다
    assert 365 % 7 == 1 and 366 % 7 == 2                    # 평년 하루, 윤년 이틀

    NM = ['일', '월', '화', '수', '목', '금', '토']
    cw, x0, y0 = 38.0, 62.0, 46.0
    start = 2                                               # 1일이 화요일인 달
    out = []
    for i, n in enumerate(NM):
        out.append(txt(x0 + cw * i + cw / 2, y0 - 6, n, 10,
                       '#BE123C' if i == 0 else '#6B7280', anc='middle', w=800))
    for day in range(1, 29):
        k = start + day - 1
        r, c = k // 7, k % 7
        x, y = x0 + cw * c, y0 + 20 * r
        hit = day in (3, 10, 17, 24)
        out.append(rect(x, y, cw - 2, 18, '#2563EB' if hit else '#fff',
                        '.26' if hit else '1', '#E5E7EB', 1))
        out.append(txt(x + cw / 2, y + 13, str(day), 9.5,
                       '#1D4ED8' if hit else '#6B7280', anc='middle', w=800 if hit else None))
    out.append(txt(62, 148, '3일 · 10일 · 17일 · 24일 — 7 일마다 같은 요일', 10, '#1D4ED8', w=800))
    out.append(txt(62, 164, '100 = 7 × 14 + 2 — 나머지 2 만큼만 밀린다', 10.5, '#BE123C', w=800))
    out.append(cap('달력 계산은 7 로 나눈 나머지를 따라가는 일이다'))
    return ''.join(out)


# ── 242 · 시계는 왜 60 일까 ─────────────────────────────────────────
def bs242():
    def conv(n, b):
        d = []
        while n > 0:
            d.append(n % b)
            n //= b
        return d[::-1] or [0]

    assert conv(754, 2) == [1, 0, 1, 1, 1, 1, 0, 0, 1, 0] and len(conv(754, 2)) == 10
    assert conv(754, 60) == [12, 34] and 12 * 60 + 34 == 754
    assert conv(754, 16) == [2, 15, 2] and 2 * 256 + 15 * 16 + 2 == 754

    rows = [(10, '754', '7×10² + 5×10¹ + 4×10⁰', 3, '#6B7280'),
            (2, '1011110010', '1×2⁹ + 0×2⁸ + … + 0×2⁰', 10, '#2563EB'),
            (16, '2F2', '2×16² + 15×16¹ + 2×16⁰', 3, '#0E9384'),
            (60, '12, 34', '12×60¹ + 34×60⁰ = 12분 34초', 2, '#BE123C')]
    out = []
    for i, (b, rep, exp, ln, col) in enumerate(rows):
        y = 48 + i * 28
        out.append(txt(62, y, '%d 진법' % b, 10, col, w=800))
        out.append(txt(126, y, rep, 11, col, w=800))
        out.append(txt(222, y, exp, 9.5, '#6B7280'))
        out.append(txt(392, y, '%d 자리' % ln, 10, col, anc='end', w=800))
    out.append(txt(62, 164, '밑이 작을수록 자릿수는 길어지고, 클수록 기호가 더 필요하다',
                   10, '#6B7280'))
    out.append(cap('같은 수 754 를 네 가지 자릿값 약속으로 쓴 것'))
    return ''.join(out)


# ── 243 · 모든 줄의 합이 같게 ───────────────────────────────────────
def mg243():
    g = [[16, 2, 3, 13], [5, 11, 10, 8], [9, 7, 6, 12], [4, 14, 15, 1]]
    t = 34
    assert sum(sum(r) for r in g) == 16 * 17 // 2 == 136
    assert all(sum(r) == t for r in g)
    assert all(sum(g[i][j] for i in range(4)) == t for j in range(4))
    assert sum(g[i][i] for i in range(4)) == t and sum(g[i][3 - i] for i in range(4)) == t
    assert 4 * (4 * 4 + 1) // 2 == t                        # n(n²+1)/2

    cw, x0, y0 = 26.0, 70.0, 42.0
    out = []
    for i in range(4):
        for j in range(4):
            out.append(rect(x0 + cw * j, y0 + cw * i, cw, cw, '#2563EB', '.10', '#1D4ED8', 1))
            out.append(txt(x0 + cw * j + cw / 2, y0 + cw * i + cw / 2 + 4, str(g[i][j]),
                           11, '#111827', anc='middle', w=800))
        out.append(txt(x0 + cw * 4 + 7, y0 + cw * i + cw / 2 + 4, '34', 10, '#0B6E63', w=800))
    for j in range(4):
        out.append(txt(x0 + cw * j + cw / 2, y0 + cw * 4 + 13, '34', 10, '#0B6E63',
                       anc='middle', w=800))
    out.append(poly([(x0, y0), (x0 + cw * 4, y0 + cw * 4)], '#BE123C', 1.4, dash=1))
    out.append(poly([(x0 + cw * 4, y0), (x0, y0 + cw * 4)], '#BE123C', 1.4, dash=1))
    out.append(txt(214, 56, '1 + 2 + … + 16 = 136', 10.5, '#111827', w=800))
    out.append(txt(214, 76, '136 ÷ 4 줄 = 34', 10.5, '#0B6E63', w=800))
    out.append(txt(214, 98, '한 줄의 합은 고르기 전에', 10, '#6B7280'))
    out.append(txt(214, 114, '이미 정해져 있다', 10, '#6B7280'))
    out.append(txt(214, 136, 'n(n² + 1) ÷ 2', 10.5, '#BE123C', w=800))
    out.append(cap('무엇을 어디에 놓든 한 줄의 합은 미리 정해져 있다'))
    return ''.join(out)


# ── 244 · 안팎에서 조여 오는 수 ─────────────────────────────────────
def pi244():
    lo = lambda n: n * sin(pi / n)
    hi = lambda n: n * tan(pi / n)
    assert abs(lo(6) - 3) < 1e-12                           # 정육각형은 정확히 3
    assert abs(hi(6) - 3.4641016) < 1e-6
    assert abs(hi(96) - lo(96) - 0.0016828) < 1e-6 and lo(96) < pi < hi(96)

    cx, cy, R = 104.0, 96.0, 44.0
    out = ['<circle cx="%.1f" cy="%.1f" r="%.1f" fill="none" stroke="#9CA3AF" stroke-width="1.4"/>'
           % (cx, cy, R)]
    n = 6
    inn = [(cx + R * cos(radians(-90 + 360 * i / n)), cy + R * sin(radians(-90 + 360 * i / n)))
           for i in range(n)]
    Ro = R / cos(pi / n)
    outr = [(cx + Ro * cos(radians(-60 + 360 * i / n)), cy + Ro * sin(radians(-60 + 360 * i / n)))
            for i in range(n)]
    out.append(shape(inn, '#2563EB', '.14', '#1D4ED8', 1.8))
    out.append(shape(outr, 'none', '0', '#BE123C', 1.8))
    out.append(txt(cx, cy + R + 10, '정육각형 — 안과 밖', 10, '#6B7280', anc='middle'))
    X = lambda v: 196 + 156 * (v - 2.98) / 0.52
    for i, (n_, col) in enumerate(((6, '#9CA3AF'), (12, '#6B7280'), (96, '#BE123C'))):
        y = 52 + i * 26
        out.append(poly([(X(lo(n_)), y), (X(hi(n_)), y)], col, 5.0))
        out.append(txt(192, y + 4, '%d' % n_, 10, col, anc='end', w=800))
        out.append(txt(X(hi(n_)) + 7, y + 4, '%.4f' % (hi(n_) - lo(n_)), 9.5, col))
    out.append(poly([(X(pi), 40), (X(pi), 134)], '#0E9384', 1.6, dash=1))
    out.append(txt(X(pi), 148, 'π', 11, '#0B6E63', anc='middle', w=800))
    out.append(txt(196, 128, '변을 늘릴수록 두 값이 π 를 조여 온다', 10, '#6B7280'))
    out.append(txt(62, 164, '96각형에서 3.14103 < π < 3.14271 — 소수 둘째 자리가 확정된다',
                   10, '#BE123C', w=800))
    out.append(cap('안팎에서 함께 조이면 참값이 그 사이에 있다고 확신할 수 있다'))
    return ''.join(out)


# ── 245 · 하나 늘렸는데 줄어든다 ───────────────────────────────────
def ap245():
    def hare(p, s):
        T = sum(p)
        q = [v * s / T for v in p]
        f = [floor(x) for x in q]
        left = s - sum(f)
        idx = sorted([(q[i] - f[i], i) for i in range(len(p))], key=lambda t: -t[0])
        out = f[:]
        for i in range(left):
            out[idx[i][1]] += 1
        return out

    p = [60, 60, 20]
    a10, a11 = hare(p, 10), hare(p, 11)
    assert a10 == [4, 4, 2] and a11 == [5, 5, 1]
    assert sum(a10) == 10 and sum(a11) == 11 and a11[2] < a10[2]

    NM = ['가', '나', '다']
    COL = ['#2563EB', '#0E9384', '#BE123C']
    out = []
    for r, (s, arr) in enumerate(((10, a10), (11, a11))):
        y = 50 + r * 46
        out.append(txt(62, y + 14, '%d석' % s, 11, '#111827', w=800))
        x = 102.0
        for i, v in enumerate(arr):
            for k in range(v):
                out.append(rect(x, y, 18, 24, COL[i], '.34', COL[i]))
                x += 21
            out.append(txt(x - 10.5, y - 5, NM[i], 10, COL[i], anc='middle', w=800))
            x += 10
    out.append(txt(392, 44, '다 2석', 10, '#B45309', anc='end', w=800))
    out.append(txt(392, 90, '다 1석', 10, '#B45309', anc='end', w=800))
    out.append(txt(62, 150, '정확한 몫 — 가 4.286 · 나 4.286 · 다 1.429 (10석)', 10, '#6B7280'))
    out.append(txt(62, 166, '전체를 하나 늘렸는데 한 곳의 몫이 줄었다 — 알라바마 역설',
                   10.5, '#BE123C', w=800))
    out.append(cap('소수 부분이 큰 순서로 주는 방법에서 생기는 일'))
    return ''.join(out)


# ── 246 · 가장 잦은 글자 ────────────────────────────────────────────
def cp246():
    EN = [8.2, 1.5, 2.8, 4.3, 12.7, 2.2, 2.0, 6.1, 7.0, 0.2, 0.8, 4.0, 2.4,
          6.7, 7.5, 1.9, 0.1, 6.0, 6.3, 9.1, 2.8, 1.0, 2.4, 0.2, 2.0, 0.1]
    assert len(EN) == 26 and abs(sum(EN) - 100) < 1.5
    assert EN.index(max(EN)) == 4                           # e 가 가장 잦다
    k = 3
    sh = [EN[(i - k) % 26] for i in range(26)]
    assert sh.index(max(sh)) == (4 + k) % 26 == 7           # 암호문에서는 h 가 가장 잦다

    bw = 10.4
    rows2 = ((EN, 76.0, '#2563EB', 'e', '평문 — e 가 가장 높다'),
             (sh, 150.0, '#BE123C', 'h', '시저 암호 (k = 3) — 봉우리가 3 칸 밀렸다'))
    out = []
    for arr, base, col, letter, lab in rows2:
        out.append(poly([(58, base), (58 + bw * 26, base)], GREY, 1.0))
        for i, v in enumerate(arr):
            hgt = v * 2.6
            out.append(rect(58 + bw * i + 1, base - hgt, bw - 2, hgt, col,
                            '.60' if v == max(arr) else '.26'))
        top = arr.index(max(arr))
        out.append(txt(58 + bw * top + bw / 2, base - max(arr) * 2.6 - 4, letter,
                       10.5, col, anc='middle', w=800))
        out.append(txt(392, base - 26, lab, 10, col, anc='end', w=800))
    xe, xh = 58 + bw * 4 + bw / 2, 58 + bw * 7 + bw / 2
    out.append(poly([(xe, 94), (xh - 5, 94)], '#B45309', 1.6) + head(xh, 94, 1, 0, '#B45309'))
    out.append(txt((xe + xh) / 2, 88, '3 칸', 9.5, '#B45309', anc='middle', w=800))
    out.append(txt(58, 166, '열쇠를 모르고도 가장 높은 막대 하나로 이동값을 되찾을 수 있다',
                   10, '#BE123C', w=800))
    out.append(cap('통계적 흔적이 남으면 열쇠의 가짓수는 소용이 없다'))
    return ''.join(out)


# ── 247 · 풀리는지 먼저 묻는다 ─────────────────────────────────────
def iv247():
    cases = [((2, 1, 1, 3, 5, 6), '한 점', '#0E9384'),
             ((2, 1, 4, 2, 5, 6), '없음', '#BE123C'),
             ((2, 1, 4, 2, 5, 10), '무수히 많음', '#B45309')]
    for (a, b, c, d, e, f), kind, _ in cases:
        det = a * d - b * c
        if kind == '한 점':
            assert det != 0
        else:
            assert det == 0
            same = (a * f - c * e == 0 and b * f - d * e == 0)
            assert same == (kind == '무수히 많음')

    out = []
    for i, ((a, b, c, d, e, f), kind, col) in enumerate(cases):
        cx = 92.0 + i * 108
        cy, R = 82.0, 32.0
        out.append(axes(cx - R, cx + R, cy + R, cy - R))
        def ln(A, B, C, cc, dash=None):            # Ax + By = C
            pts = []
            for t in (-3.2, 3.2):
                if abs(B) > 1e-9:
                    pts.append((t, (C - A * t) / B))
                elif abs(A) > 1e-9:
                    pts.append((C / A, t))
            return poly([(cx + R * x / 3.4, cy - R * y / 3.4) for x, y in pts], cc, 2.2, dash)
        out.append(ln(a, b, e, '#2563EB'))
        out.append(ln(c, d, f, '#BE123C', dash=1 if kind == '무수히 많음' else None))
        out.append(txt(cx, cy + R + 16, 'ad − bc = %d' % (a * d - b * c), 10,
                       col, anc='middle', w=800))
        out.append(txt(cx, cy + R + 30, kind, 10.5, col, anc='middle', w=800))
        out.append(txt(cx, 40, ['두 직선이 만난다', '나란히 비켜 간다', '같은 직선이다'][i],
                       10, '#6B7280', anc='middle'))
    out.append(txt(62, 164, '계수만 보고도 풀리는지 알 수 있다 — ad − bc 가 0 인지부터 본다',
                   10, '#6B7280'))
    out.append(cap('행렬식이 0 이면 역행렬이 없고, 그때 해는 없거나 끝없이 많다'))
    return ''.join(out)


# ── 248 · 넓이가 몇 배가 되는가 ────────────────────────────────────
def da248():
    a, c, b, d = 1.0, 0.2, 0.5, 1.0
    det = a * d - b * c
    assert abs(det - 0.9) < 1e-9
    assert abs(abs(det) - 0.9) < 1e-9                       # 넓이는 절댓값

    ox, oy, u = 82.0, 132.0, 46.0
    X = lambda x: ox + u * x
    Y = lambda y: oy - u * y
    out = [axes(ox - 10, ox + 150, oy + 10, 38)]
    out.append(shape([(X(0), Y(0)), (X(1), Y(0)), (X(1), Y(1)), (X(0), Y(1))],
                     '#9CA3AF', '.16', '#9CA3AF', 1.4))
    out.append(txt(X(0.5), Y(0.5) + 4, '1', 11, '#6B7280', anc='middle', w=800))
    ox2 = 246.0
    X2 = lambda x: ox2 + u * x
    out.append(axes(ox2 - 10, ox2 + 130, oy + 10, 38))
    P = [(X2(0), Y(0)), (X2(a), Y(c)), (X2(a + b), Y(c + d)), (X2(b), Y(d))]
    out.append(shape(P, '#2563EB', '.22', '#1D4ED8', 1.8))
    out.append(poly([(X2(0), Y(0)), (X2(a), Y(c))], '#BE123C', 2.2) + head(X2(a), Y(c), a / hypot(a, c), -c / hypot(a, c), '#BE123C'))
    out.append(poly([(X2(0), Y(0)), (X2(b), Y(d))], '#0E9384', 2.2) + head(X2(b), Y(d), b / hypot(b, d), -d / hypot(b, d), '#0E9384'))
    out.append(txt(X2(a) + 6, Y(c) + 4, '(1, 0.2)', 9.5, '#BE123C', w=800))
    out.append(txt(X2(b) - 6, Y(d) - 4, '(0.5, 1)', 9.5, '#0B6E63', anc='end', w=800))
    out.append(txt(X2(0.75), Y(0.6) + 4, '0.9', 11, '#1D4ED8', anc='middle', w=800))
    out.append(poly([(196, 90), (228, 90)], GREY, 1.8) + head(234, 90, 1, 0))
    out.append(txt(212, 82, '변환', 10, '#6B7280', anc='middle'))
    out.append(txt(62, 164, 'ad − bc = 1 × 1 − 0.5 × 0.2 = 0.9 — 넓이가 0.9 배가 되었다',
                   10, '#1D4ED8', w=800))
    out.append(cap('행렬식은 「넓이를 몇 배로 바꾸는가」라는 한 개의 수'))
    return ''.join(out)


# ── 249 · 휘지 않는 화살표 ──────────────────────────────────────────
def eg249():
    a, b, c, d = 2.0, 1.0, 1.0, 3.0
    tr, de = a + d, a * d - b * c
    l1 = (tr + sqrt(tr * tr - 4 * de)) / 2
    l2 = (tr - sqrt(tr * tr - 4 * de)) / 2
    assert abs(l1 - 3.618034) < 1e-6 and abs(l2 - 1.381966) < 1e-6
    assert abs(l1 * l2 - de) < 1e-9 and abs(l1 + l2 - tr) < 1e-9
    k1 = (l1 - a) / b                                        # 고유 방향의 기울기
    assert abs(k1 - 1.618034) < 1e-6

    cx, cy, u = 150.0, 102.0, 30.0
    X = lambda x: cx + u * x
    Y = lambda y: cy - u * y
    out = [axes(cx - 90, cx + 90, cy + 56, 36)]
    for deg, col in ((10, '#9CA3AF'), (58.28, '#BE123C'), (120, '#9CA3AF')):
        r = radians(deg)
        vx, vy = cos(r) * 1.5, sin(r) * 1.5
        wx, wy = a * vx + b * vy, c * vx + d * vy
        sc = 1.5 / max(1e-9, hypot(wx, wy)) * 1.5
        wx, wy = wx * sc, wy * sc
        out.append(poly([(X(0), Y(0)), (X(vx), Y(vy))], col, 1.6)
                   + head(X(vx), Y(vy), cos(r), -sin(r), col))
        out.append(poly([(X(0), Y(0)), (X(wx), Y(wy))], col, 2.4, dash=1)
                   + head(X(wx), Y(wy), wx / hypot(wx, wy), -wy / hypot(wx, wy), col))
    out.append(poly([(X(-2.2), Y(-2.2 * k1)), (X(2.2), Y(2.2 * k1))], '#BE123C', 1.2, dash=1))
    out.append(txt(X(1.1) + 7, Y(1.1 * k1), '고유 방향', 10, '#BE123C', w=800))
    out.append(txt(254, 52, 'λ² − 5λ + 5 = 0', 10.5, '#111827', w=800))
    out.append(txt(254, 70, 'λ₁ = 3.618  λ₂ = 1.382', 10, '#0B6E63', w=800))
    out.append(txt(254, 92, '그 선 위의 벡터만', 10, '#6B7280'))
    out.append(txt(254, 108, '방향이 그대로다', 10, '#6B7280'))
    out.append(txt(62, 164, '실선 = 넣은 벡터 · 점선 = 변환한 벡터 — 두 개는 휘고 하나만 그대로',
                   10, '#6B7280'))
    out.append(cap('변환해도 방향이 바뀌지 않는 축이 있다'))
    return ''.join(out)


# ── 250 · 백 번 곱하지 않는 법 ─────────────────────────────────────
def mp250():
    A = [2, 1, 1, 1]
    tr, de = A[0] + A[3], A[0] * A[3] - A[1] * A[2]
    l1 = (tr + sqrt(tr * tr - 4 * de)) / 2
    assert abs(l1 - 2.618034) < 1e-6 and abs(de - 1) < 1e-12

    def mul(M, N):
        return [M[0] * N[0] + M[1] * N[2], M[0] * N[1] + M[1] * N[3],
                M[2] * N[0] + M[3] * N[2], M[2] * N[1] + M[3] * N[3]]

    M = [1, 0, 0, 1]
    rows = []
    for n in range(1, 13):
        M = mul(M, A)
        rows.append((n, M[0], M[1], M[0] / M[1]))
    assert rows[-1][1] == 75025 and rows[-1][2] == 46368   # F(25) · F(24)
    assert abs(rows[-1][3] - (1 + sqrt(5)) / 2) < 1e-6

    X = lambda n: 60 + 280 * (n - 1) / 11
    Y = lambda v: 140 - 100 * log(v) / log(75025.0)
    out = [axes(60, 356, 140, 34)]
    out.append(poly([(X(n), Y(v)) for n, v, _, _ in rows], '#2563EB', 2.4))
    out.append(poly([(X(n), Y(l1 ** n * 1.17)) for n in range(1, 13)], '#BE123C', 1.8, dash=1))
    for n, v, _, _ in rows:
        out.append(dot(X(n), Y(v), 3.0, '#1D4ED8'))
    out.append(txt(66, 44, '세로는 로그 눈금 — 점들이 직선으로 놓인다', 10, '#6B7280'))
    out.append(txt(348, Y(rows[-1][1]) + 14, 'A¹² 의 첫 성분 75,025', 10, '#1D4ED8',
                   anc='end', w=800))
    out.append(txt(348, Y(l1 ** 12 * 1.17) - 8, 'λ₁ⁿ 과 같은 기울기', 10, '#BE123C',
                   anc='end', w=800))
    out.append(txt(X(1), 156, 'n = 1', 9.5, '#6B7280', anc='middle'))
    out.append(txt(X(12), 156, 'n = 12', 9.5, '#6B7280', anc='middle'))
    out.append(txt(62, 170, '', 9))
    out.append(cap('성분의 비가 1.618 로 굳는다 — 큰 고윳값만 살아남는다'))
    return ''.join(out)


FNS = [('wd241', wd241), ('bs242', bs242), ('mg243', mg243), ('pi244', pi244), ('ap245', ap245),
       ('cp246', cp246), ('iv247', iv247), ('da248', da248), ('eg249', eg249), ('mp250', mp250)]

if __name__ == '__main__':
    import sys
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass
    for nm, f in FNS:
        sys.stdout.write('%-7s %5d자  ok\n' % (nm, len(f())))
