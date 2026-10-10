# -*- coding: utf-8 -*-
"""LAB 231~240 「오늘의 문제」 그림 — 좌표를 계산해서 그린다.

모양과 비 묶음이다. 그림에 적는 수는 실험 화면과 같은 식으로 구해 assert 로 묶었다.
축 화살촉과 글씨 흰 테두리는 여기서 직접 넣는다.
"""
from math import sqrt, log, pi, cos, sin, cosh, radians, ceil, floor

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


def ngon(cx, cy, r, k, rot=0.0):
    return [(cx + r * cos(radians(rot + 360.0 * i / k)),
             cy + r * sin(radians(rot + 360.0 * i / k))) for i in range(k)]


def shape(pts, col, op='.22', stroke=None, sw=1.6):
    d = ' '.join('%s%.1f %.1f' % ('M' if i == 0 else 'L', p[0], p[1]) for i, p in enumerate(pts))
    return ('<path d="%s Z" fill="%s" fill-opacity="%s" stroke="%s" stroke-width="%s"/>'
            % (d, col, op, stroke or col, sw))


# ── 231 · 페인트 몇 통을 살까 ───────────────────────────────────────
def pt231():
    w, d, h, c, PER, OPEN = 4.0, 3.0, 2.4, 1, 12.0, 5.4
    wall = 2 * (w + d) * h
    net = wall - OPEN
    exact = net * c / PER
    cans = ceil(exact)
    assert abs(wall - 33.6) < 1e-9 and abs(net - 28.2) < 1e-9
    assert abs(exact - 2.35) < 1e-9 and cans == 3
    assert ceil(exact) - exact > 0.6                        # 마지막 통을 조금만 쓴다

    X = lambda m: 60 + 280 * m / (2 * (w + d))              # 둘레 14 m 를 가로로 펼친다
    top, hgt = 48.0, 50.0
    out = [rect(X(0), top, X(2 * (w + d)) - X(0), hgt, '#2563EB', '.20', '#1D4ED8')]
    for x0, ww in ((2.0, 1.8), (8.0, 1.2)):                 # 창 하나 · 문 하나
        out.append(rect(X(x0), top + 8, X(x0 + ww) - X(x0), hgt - 16, '#fff', '1', '#BE123C', 1.4))
    out.append(txt(X(2.9), top + 32, '창·문', 10, '#BE123C', anc='middle', w=800))
    out.append(txt(60, top - 7, '벽을 쭉 펼치면 둘레 14 m × 높이 2.4 m = 33.60 m²', 10, '#1D4ED8', w=800))
    out.append(txt(60, top + hgt + 16, '창·문 5.40 m² 를 빼면 칠할 넓이 28.20 m²', 10, '#BE123C', w=800))
    bw, gapx = 42.0, 8.0
    for i in range(cans):
        x = 60 + i * (bw + gapx)
        fillw = bw if i < cans - 1 else bw * (exact - (cans - 1))
        out.append(rect(x, 118, bw, 30, '#9CA3AF', '.22', '#9CA3AF', 1))
        out.append(rect(x, 118, fillw, 30, '#0E9384', '.45'))
    out.append(txt(60 + 3 * (bw + gapx) + 8, 130, '28.20 ÷ 12 = 2.35', 10, '#0B6E63', w=800))
    out.append(txt(60 + 3 * (bw + gapx) + 8, 146, '→ 3통 (올림)', 10.5, '#0B6E63', w=800))
    out.append(txt(60, 164, '셋째 통은 35%만 쓰고 남는다 — 넓이는 실수, 통은 자연수', 10, '#6B7280'))
    out.append(cap('나눗셈의 몫이 소수여도 통은 올려서 사야 한다'))
    return ''.join(out)


# ── 232 · 어디서 시작해도 같은 곳으로 ──────────────────────────────
def gl232():
    PHI = (1 + sqrt(5)) / 2
    f = [1, 1]
    while len(f) < 13:
        f.append(f[-1] + f[-2])
    assert f[:8] == [1, 1, 2, 3, 5, 8, 13, 21]
    assert abs(f[12] / f[11] - PHI) < 2e-4 and abs(PHI * PHI - (PHI + 1)) < 1e-12

    u = 17.0                                                # 한 칸의 픽셀
    ox, oy = 62.0, 140.0                                    # 왼쪽 아래 기준
    X = lambda a: ox + u * a
    Y = lambda b: oy - u * b
    sq = [(0, 0, 5), (5, 2, 3), (5, 0, 2), (7, 1, 1), (7, 0, 1)]
    assert sum(s * s for _, _, s in sq) == 8 * 5            # 조각이 직사각형을 꼭 채운다
    out = []
    for a, b, s in sq:
        out.append(rect(X(a), Y(b + s), u * s, u * s, '#2563EB', '.14', '#1D4ED8', 1.4))
        if s >= 2:
            out.append(txt(X(a + s / 2.0), Y(b + s / 2.0) + 4, str(s), 11, '#1D4ED8',
                           anc='middle', w=800))
    out.append(txt(X(4), Y(5) - 7, '8 × 5 — 이웃한 두 피보나치 수', 10, '#1D4ED8',
                   anc='middle', w=800))
    bx, by0 = 228.0, 56.0
    out.append(txt(bx, by0 - 10, '이웃한 두 수의 비', 10, '#6B7280'))
    for i, n in enumerate((3, 5, 7, 9, 12)):
        r = f[n] / f[n - 1]
        y = by0 + i * 17
        out.append(txt(bx, y + 4, '%d / %d' % (f[n], f[n - 1]), 10, '#111827'))
        out.append(txt(bx + 74, y + 4, '%.6f' % r, 10,
                       '#BE123C' if abs(r - PHI) > 0.01 else '#0B6E63', w=800))
    out.append(poly([(bx - 4, by0 + 5 * 17 + 2), (bx + 136, by0 + 5 * 17 + 2)], GREY, 1.2))
    out.append(txt(bx, by0 + 5 * 17 + 18, 'φ = 1.618034', 10.5, '#0B6E63', w=800))
    out.append(txt(60, 164, 'φ² = φ + 1 — 어떤 두 수로 시작해도', 10, '#6B7280'))
    out.append(cap('어디서 시작해도 이웃한 두 수의 비는 같은 곳으로 간다'))
    return ''.join(out)


# ── 233 · 평면을 빈틈없이 채우려면 ─────────────────────────────────
def ts233():
    ang = lambda k: 180.0 * (k - 2) / k
    assert abs(ang(6) - 120) < 1e-12 and abs(360 / ang(6) - 3) < 1e-12
    assert abs(ang(5) - 108) < 1e-12 and abs(3 * ang(5) - 324) < 1e-12
    assert abs(360 - 3 * ang(5) - 36) < 1e-12               # 정오각형 셋은 36° 가 빈다

    out = []
    for cx, k, col, lab in ((116.0, 6, '#2563EB', '정육각형 3개 = 360°'),
                            (286.0, 5, '#BE123C', '정오각형 3개 = 324°')):
        cy, R = 96.0, 34.0
        n = int(round(360 / ang(k))) if k == 6 else 3
        for i in range(n):
            rot = -90 + (360 / n if k == 6 else ang(k)) * i
            pts = ngon(cx + R * cos(radians(rot)), cy + R * sin(radians(rot)), R, k, rot + 180)
            out.append(shape(pts, col, '.16', col, 1.4))
        out.append(dot(cx, cy, 3.4, '#111827'))
        out.append(txt(cx, 150, lab, 10.5, col, anc='middle', w=800))
    out.append(shape(ngon(286 + 34 * cos(radians(234)), 96 + 34 * sin(radians(234)), 34, 5, 54),
                     '#F59E0B', '.28', '#B45309', 1.4))
    out.append(txt(286, 166, '36° 가 남는다 — 360 ÷ 108 이 자연수가 아니다', 10, '#B45309',
                   anc='middle', w=800))
    out.append(txt(116, 166, '360 ÷ 120 = 3 — 자연수다', 10, '#1D4ED8', anc='middle', w=800))
    out.append(cap('한 꼭짓점에 모은 내각의 합이 꼭 360° 여야 한다'))
    return ''.join(out)


# ── 234 · 스스로를 닮은 도형 ────────────────────────────────────────
def fr234():
    assert abs((4 / 3) ** 6 - 5.6187) < 1e-3
    assert abs(log(4) / log(3) - 1.2619) < 1e-3
    assert (3 / 4) ** 6 < 0.2 and (4 / 3) ** 6 > 5          # 둘레는 늘고 넓이는 준다

    def koch(p, q, n):
        if n == 0:
            return [p]
        ax, ay = p
        bx, by = q
        dx, dy = (bx - ax) / 3.0, (by - ay) / 3.0
        c = (ax + dx, ay + dy)
        e = (ax + 2 * dx, ay + 2 * dy)
        ang = radians(-60)
        mx = c[0] + dx * cos(ang) - dy * sin(ang)
        my = c[1] + dx * sin(ang) + dy * cos(ang)
        return (koch(p, c, n - 1) + koch(c, (mx, my), n - 1)
                + koch((mx, my), e, n - 1) + koch(e, q, n - 1))

    out = []
    for i, n in enumerate((0, 1, 2, 3)):
        y = 46 + i * 28
        pts = koch((64.0, y), (244.0, y), n) + [(244.0, y)]
        out.append(poly(pts, '#2563EB', 1.8))
        out.append(txt(252, y + 4, '%d번 — 길이 (4/3)^%d = %.4f배' % (n, n, (4 / 3) ** n),
                       10, '#1D4ED8' if n else '#6B7280'))
    out.append(txt(64, 162, '6번 반복하면 5.619배 — 계속하면 끝없이 길어진다', 10, '#BE123C', w=800))
    out.append(txt(64, 36, '차원 = log 4 ÷ log 3 = 1.2619 — 선도 면도 아닌 수', 10, '#6B7280'))
    out.append(cap('조각 하나가 전체와 닮았다 — 그래서 끝없이 반복된다'))
    return ''.join(out)


# ── 235 · 왜 그 두 음은 어울릴까 ───────────────────────────────────
def mu235():
    RAT = [(2, 1, '옥타브', 12), (3, 2, '완전 5도', 7), (4, 3, '완전 4도', 5),
           (5, 4, '장 3도', 4), (45, 32, '증 4도', 6)]
    cents = []
    for p, q, nm, semi in RAT:
        eq = 2 ** (semi / 12.0)
        cents.append(1200 * (log(eq / (p / q)) / log(2)))
    assert abs(cents[0]) < 1e-9 and abs(cents[1] + 1.955) < 1e-3
    assert abs(cents[3] - 13.686) < 1e-3 and abs(cents[4] - 9.776) < 1e-3
    assert abs(1200 / 12.0 - 100) < 1e-12                   # 반음 하나는 100 센트

    out = []
    for i, (p, q, lab, col) in enumerate(((2, 1, '2 : 1 — 한 주기에 딱 맞는다', '#0E9384'),
                                          (3, 2, '3 : 2 — 두 주기에 맞는다', '#2563EB'))):
        cy = 58 + i * 46
        X = lambda t: 60 + 150 * t
        out.append(poly([(60, cy), (210, cy)], '#E5E7EB', 1.0))
        for f, c2, wd in ((q, '#9CA3AF', 1.4), (p, col, 2.0)):
            pts = [(X(j / 90.0), cy - 13 * sin(2 * pi * f * j / 90.0)) for j in range(91)]
            out.append(poly(pts, c2, wd))
        out.append(poly([(210, cy - 16), (210, cy + 16)], col, 1.6, dash=1))
        out.append(txt(60, cy - 22, lab, 10, col, w=800))
    out.append(txt(60, 142, '다시 겹치기까지 걸리는 주기가 짧을수록 어울려 들린다', 10, '#6B7280'))
    bx = 232.0
    out.append(txt(bx, 44, '순정률 / 평균율의 차이', 10, '#6B7280'))
    for i, (p, q, nm, semi) in enumerate(RAT):
        y = 56 + i * 16
        out.append(txt(bx, y, '%s  %d : %d' % (nm, p, q), 10, '#111827'))
        c = cents[i]
        out.append(txt(392, y, '%+.2f 센트' % c, 10,
                       '#BE123C' if abs(c) >= 9 else '#0B6E63', anc='end', w=800))
    out.append(txt(bx, 160, '한 옥타브 = 1200 센트', 10, '#6B7280'))
    out.append(cap('어울림은 취향이 아니라 진동수 비의 단순함이다'))
    return ''.join(out)


# ── 236 · 평행선이 만나는 곳 ────────────────────────────────────────
def pp236():
    f, gap, n = 200.0, 2.0, 6
    px = lambda i: 40 + f * 2.2 / (4 + i * gap)
    ph = lambda i: f * 3 / (4 + i * gap)
    assert abs(ph(0) / ph(n - 1) - (4 + (n - 1) * gap) / 4) < 1e-9   # 높이의 비 = 거리의 비
    assert abs(ph(0) - 150) < 1e-9

    vy = 104.0
    out = [poly([(20, vy), (380, vy)], '#E5E7EB', 1.2)]
    out.append(txt(24, vy - 6, '지평선 = 소실점의 높이', 10, '#9CA3AF'))
    for i in range(n):
        x, hh = px(i), ph(i) * 0.42
        out.append(poly([(x, vy + hh / 2), (x, vy - hh / 2)], '#2563EB', 2.2))
        if i == 0 or i == n - 1:                          # 뒤쪽은 간격이 좁아 글씨가 겹친다
            out.append(txt(x, vy + hh / 2 + 13, '%dm' % (4 + i * gap), 9, '#9CA3AF', anc='middle'))
    out.append(poly([(px(0), vy + ph(0) * 0.21), (px(n - 1) + 40, vy)], '#BE123C', 1.2, dash=1))
    out.append(poly([(px(0), vy - ph(0) * 0.21), (px(n - 1) + 40, vy)], '#BE123C', 1.2, dash=1))
    out.append(txt(60, 38, '첫 기둥 150 · 마지막 42.9 — 비 3.500', 10, '#1D4ED8', w=800))
    out.append(txt(60, 54, '거리 14 ÷ 4 = 3.500 — 같은 수다', 10, '#BE123C', w=800))
    out.append(txt(60, 162, '같은 간격으로 세워도 화면 크기는 거리에 반비례해 줄어든다',
                   10, '#6B7280'))
    out.append(cap('평행선이 만나 보이는 자리가 소실점이다'))
    return ''.join(out)


# ── 237 · 단청은 왜 어긋나지 않을까 ────────────────────────────────
def sy237():
    n = 6
    assert abs(360.0 / n - 60) < 1e-12 and 2 * n == 12      # 회전 6 + 반사 6

    cx, cy, R = 150.0, 98.0, 52.0
    out = ['<circle cx="%.1f" cy="%.1f" r="%.1f" fill="none" stroke="#E5E7EB" '
           'stroke-width="1.2"/>' % (cx, cy, R)]
    for i in range(n):                                       # 거울선 n 개
        a = radians(180.0 * i / n)
        out.append(poly([(cx - R * cos(a), cy - R * sin(a)), (cx + R * cos(a), cy + R * sin(a))],
                        '#9CA3AF', 1.0, dash=1))
    for i in range(n):                                       # 모티프 n 개
        a = radians(-90 + 360.0 * i / n)
        tip = (cx + R * 0.92 * cos(a), cy + R * 0.92 * sin(a))
        l = (cx + R * 0.44 * cos(a - radians(16)), cy + R * 0.44 * sin(a - radians(16)))
        r = (cx + R * 0.44 * cos(a + radians(16)), cy + R * 0.44 * sin(a + radians(16)))
        out.append(shape([(cx, cy), l, tip, r], '#2563EB' if i % 2 == 0 else '#0E9384',
                         '.30', '#1D4ED8' if i % 2 == 0 else '#0B6E63', 1.2))
    out.append(dot(cx, cy, 3.2, '#111827'))
    out.append(txt(246, 54, '회전 60° 마다 제자리 — 6 가지', 10, '#1D4ED8', w=800))
    out.append(txt(246, 72, '거울선 6 개 — 6 가지 더', 10, '#6B7280'))
    out.append(txt(246, 92, '모두 2 × 6 = 12 가지', 11, '#BE123C', w=800))
    out.append(txt(246, 112, '이것이 이면군', 10, '#6B7280'))
    out.append(txt(60, 164, '문양의 짜임은 「몇 가지 방법으로 제자리에 겹치는가」로 잴 수 있다',
                   10, '#6B7280'))
    out.append(cap('회전만 세면 n 가지, 거울선까지 세면 2n 가지'))
    return ''.join(out)


# ── 238 · 그린란드는 왜 그렇게 클까 ────────────────────────────────
def mc238():
    k = lambda la: 1 / cos(radians(la))
    assert abs(k(60) - 2) < 1e-9 and abs(k(60) ** 2 - 4) < 1e-9
    assert abs(k(70) ** 2 - 8.5486) < 1e-3                  # 70° 에서 여덟 배 넘는다

    out = []
    base = 20.0
    for i, la in enumerate((0, 40, 60, 70)):
        s = base * k(la)
        cx = 92.0 + i * 86
        out.append(rect(cx - s / 2, 112 - s, s, s, '#2563EB', '.26', '#1D4ED8', 1.4))
        out.append(txt(cx, 128, '위도 %d°' % la, 10, '#6B7280', anc='middle'))
        out.append(txt(cx, 144, '넓이 ×%.2f' % (k(la) ** 2), 10,
                       '#BE123C' if k(la) ** 2 >= 4 else '#1D4ED8', anc='middle', w=800))
    out.append(txt(60, 42, '땅에서는 넷 다 같은 크기 — 지도에서만 커진다', 10, '#6B7280'))
    out.append(txt(60, 164, '가로 확대 1 / cos φ · 넓이 확대 그 제곱 — 그래서 고위도가 부풀어 보인다',
                   10, '#BE123C', w=800))
    out.append(cap('둥근 것을 평면에 펴면 무언가는 반드시 잃는다'))
    return ''.join(out)


# ── 239 · 다리의 줄은 포물선일까 ───────────────────────────────────
def cc239():
    a, w = 30.0, 120.0
    half = w / 2
    cat = lambda x: a * cosh(x / a) - a
    sag = cat(half)
    par = lambda x: sag * (x / half) ** 2
    g, gx = 0.0, 0.0
    for i in range(201):
        x = -half + 2 * half * i / 200.0
        if abs(cat(x) - par(x)) > g:
            g, gx = abs(cat(x) - par(x)), x
    assert abs(sag - 82.8659) < 1e-3 and abs(g - 6.0933) < 1e-3 and abs(gx + 43.2) < 1e-6
    assert abs(cat(half) - par(half)) < 1e-9                # 양 끝에서는 꼭 만난다

    X = lambda x: 200 + 290 * x / w
    Y = lambda y: 44 + 96 * y / sag
    out = [poly([(X(-half), Y(0)), (X(half), Y(0))], '#9CA3AF', 1.2, dash=1)]
    xs = [-half + 2 * half * i / 120.0 for i in range(121)]
    out.append(poly([(X(x), Y(cat(x))) for x in xs], '#2563EB', 2.6))
    out.append(poly([(X(x), Y(par(x))) for x in xs], '#BE123C', 2.2, dash=1))
    out.append(poly([(X(gx), Y(cat(gx))), (X(gx), Y(par(gx)))], '#B45309', 2.0))
    out.append(dot(X(gx), Y(cat(gx)), 4.0, '#1D4ED8'))
    out.append(dot(X(gx), Y(par(gx)), 4.0, '#BE123C'))
    out.append(txt(X(gx) + 8, (Y(cat(gx)) + Y(par(gx))) / 2 + 4, '최대 차이 6.09 m',
                   10, '#B45309', w=800))
    out.append(txt(60, 38, '파란 실선 — 제 무게로 늘어진 줄 (현수선)', 10, '#1D4ED8', w=800))
    out.append(txt(60, 54, '붉은 점선 — 포물선', 10, '#BE123C', w=800))
    out.append(txt(60, 160, '양 끝에서는 포개지지만 그 사이에서 벌어진다', 10, '#6B7280'))
    out.append(cap('cosh 의 급수에서 앞 두 항만 남기면 포물선이 된다'))
    return ''.join(out)


# ── 240 · 잘라도 모양 그대로 ───────────────────────────────────────
def pr240():
    r = sqrt(2)
    assert abs(r - 2 / r) < 1e-12 and abs(r * r - 2) < 1e-12
    assert abs(297 / 210.0 - r) < 0.002                     # A4 가 실제로 그 비다

    H0 = 104.0
    W0 = H0 * r
    ox, oy = 62.0, 42.0
    out = [rect(ox, oy, W0, H0, '#2563EB', '.10', '#1D4ED8', 1.6)]
    x, y, ww, hh = ox, oy, W0, H0
    for i in range(1, 6):                                    # 반으로 자르기를 다섯 번
        if i % 2 == 1:
            ww /= 2
            x += ww
        else:
            hh /= 2
            y += hh
        out.append(rect(x, y, ww, hh, '#0E9384', '.16', '#0B6E63', 1.3))
        if ww > 26 and hh > 18:
            out.append(txt(x + ww / 2, y + hh / 2 + 4, 'A%d' % i, 10.5, '#0B6E63',
                           anc='middle', w=800))
    out.append(txt(ox + 24, oy + H0 / 2 + 4, 'A0', 11, '#1D4ED8', anc='middle', w=800))
    out.append(txt(ox, oy - 7, '긴 변 ÷ 짧은 변 = 1.414', 10, '#1D4ED8', w=800))
    out.append(txt(236, 62, '반으로 자르면 비가 2 ÷ r 가 된다', 10, '#6B7280'))
    out.append(txt(236, 84, 'r = 2 ÷ r 를 풀면 r² = 2', 10.5, '#BE123C', w=800))
    out.append(txt(236, 102, '곧 r = √2 하나뿐이다', 10.5, '#BE123C', w=800))
    out.append(txt(236, 126, 'A4 는 210 × 297', 10, '#6B7280'))
    out.append(txt(236, 142, '297 ÷ 210 = 1.4143', 10, '#6B7280'))
    out.append(cap('반으로 잘라도 닮은 종이는 √2 비 하나뿐이다'))
    return ''.join(out)


FNS = [('pt231', pt231), ('gl232', gl232), ('ts233', ts233), ('fr234', fr234), ('mu235', mu235),
       ('pp236', pp236), ('sy237', sy237), ('mc238', mc238), ('cc239', cc239), ('pr240', pr240)]

if __name__ == '__main__':
    import sys
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass
    for nm, f in FNS:
        sys.stdout.write('%-7s %5d자  ok\n' % (nm, len(f())))
