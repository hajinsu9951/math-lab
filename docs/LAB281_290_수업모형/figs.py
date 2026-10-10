# -*- coding: utf-8 -*-
"""LAB 281~290 「오늘의 문제」 그림 — 좌표를 계산해서 그린다.

원과 반전, 공간도형 묶음이다. 그림에 적는 수는 실험 화면과 같은 식으로 구해
assert 로 묶었다. 수가 틀리면 여기서 멈춘다.
"""
from math import sqrt, pi, cos, sin, tan, acos, log, radians, hypot, degrees, atan2

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


# ── 281 · 어떤 할선이든 같은 곱 ─────────────────────────────────────
def pw281():
    R, d = 1.3, 2.2
    pw = d * d - R * R                                   # 방멱
    tan = sqrt(pw)
    assert abs(pw - 3.15) < 1e-9, pw
    ux, uy = cos(radians(160)), sin(radians(160))        # P 에서 원을 가르는 방향
    b = 2 * (d * ux)
    t1 = (-b - sqrt(b * b - 4 * pw)) / 2
    t2 = (-b + sqrt(b * b - 4 * pw)) / 2
    assert abs(t1 * t2 - pw) < 1e-9
    cx, cy, u = 128.0, 96.0, 40.0
    px, py = cx + d * u, cy
    out = ['<circle cx="%.1f" cy="%.1f" r="%.1f" fill="none" stroke="#2563EB" '
           'stroke-width="1.8"/>' % (cx, cy, R * u)]
    ax, ay = px + t1 * ux * u, py - t1 * uy * u
    bx, by = px + t2 * ux * u, py - t2 * uy * u
    out.append(poly([(px, py), (bx + ux * u * 0.25, by - uy * u * 0.25)], '#0E9384', 1.6))
    th = acos(R / d)                                     # 접점까지의 각
    tx, ty = cx + R * cos(th) * u, cy - R * sin(th) * u
    out.append(poly([(px, py), (tx, ty)], '#BE123C', 1.6))
    out.append(dot(cx, cy, 2.6, GREY))
    out.append(dot(px, py, 3.6, '#111827'))
    out.append(dot(ax, ay, 3.2, '#0E9384'))
    out.append(dot(bx, by, 3.2, '#0E9384'))
    out.append(dot(tx, ty, 3.2, '#BE123C'))
    out.append(txt(px + 6, py + 4, 'P', 9.5, '#111827', w=800))
    out.append(txt(ax - 5, ay + 2, 'A', 9.5, '#0E9384', anc='end', w=800))
    out.append(txt(bx - 5, by + 2, 'B', 9.5, '#0E9384', anc='end', w=800))
    out.append(txt(tx + 5, ty - 3, 'T', 9.5, '#BE123C', w=800))
    out.append(txt(cx - 4, cy + 13, 'O', 9, '#6B7280', anc='end'))
    out.append(txt(14, 160, '어느 방향으로 그어도 PA × PB 는 그대로다', 9.5, '#6B7280'))
    out.append(txt(228, 46, 'PA = %.3f · PB = %.3f' % (t1, t2), 10, '#0E9384', w=800))
    out.append(txt(228, 66, 'PA × PB = %.3f' % pw, 11, '#111827', w=800))
    out.append(txt(228, 92, 'PT = %.3f' % tan, 10, '#BE123C', w=800))
    out.append(txt(228, 110, 'PT² = %.3f' % (tan * tan), 11, '#BE123C', w=800))
    out.append(txt(228, 136, 'd² − r² = %.1f² − %.1f² = %.2f' % (d, R, pw), 10, '#6B7280'))
    out.append(cap('어떤 할선을 그어도 곱이 같을까'))
    return ''.join(out)


# ── 282 · 힘이 같은 점들 ────────────────────────────────────────────
def rx282():
    R1, R2, d = 1.2, 0.9, 1.8
    xr = (R1 * R1 - R2 * R2) / (2 * d)                   # 근축의 x
    assert abs(xr - 0.175) < 1e-9, xr
    py = 1.4
    p1 = (xr + d / 2) ** 2 + py * py - R1 * R1
    p2 = (xr - d / 2) ** 2 + py * py - R2 * R2
    assert abs(p1 - p2) < 1e-9, (p1, p2)
    cx, cy, u = 120.0, 94.0, 38.0
    o1 = (cx - d / 2 * u, cy)
    o2 = (cx + d / 2 * u, cy)
    out = ['<circle cx="%.1f" cy="%.1f" r="%.1f" fill="none" stroke="#2563EB" '
           'stroke-width="1.6"/>' % (o1[0], o1[1], R1 * u),
           '<circle cx="%.1f" cy="%.1f" r="%.1f" fill="none" stroke="#0E9384" '
           'stroke-width="1.6"/>' % (o2[0], o2[1], R2 * u)]
    xx = cx + xr * u
    out.append(poly([(xx, 30), (xx, 150)], '#BE123C', 1.8, dash=1))
    ppx, ppy = xx, cy - py * u
    out.append(poly([(ppx, ppy), (o1[0], o1[1])], GREY, 0.9))
    out.append(poly([(ppx, ppy), (o2[0], o2[1])], GREY, 0.9))
    out.append(dot(o1[0], o1[1], 2.4, '#2563EB'))
    out.append(dot(o2[0], o2[1], 2.4, '#0E9384'))
    out.append(dot(ppx, ppy, 3.6, '#111827'))
    out.append(txt(ppx + 7, ppy - 3, 'P', 9.5, '#111827', w=800))
    out.append(txt(xx + 6, 146, '근축', 9.5, '#BE123C', w=800))
    out.append(txt(14, 160, '붉은 점선 위의 어느 점에서나 두 방멱이 같다', 9.5, '#6B7280'))
    out.append(txt(222, 48, '왼쪽 원의 방멱 %.4f' % p1, 10, '#2563EB', w=800))
    out.append(txt(222, 68, '오른쪽 원의 방멱 %.4f' % p2, 10, '#0E9384', w=800))
    out.append(txt(222, 92, '차이 = 0', 11, '#BE123C', w=800))
    out.append(txt(222, 118, '근축은 중심을 잇는 선에', 9.5, '#6B7280'))
    out.append(txt(222, 134, '언제나 수직이다', 9.5, '#6B7280'))
    out.append(txt(222, 154, 'x = (r₁² − r₂²) ÷ 2d = %.3f' % xr, 9.5, '#111827', w=800))
    out.append(cap('두 원에 대해 힘이 같은 점들은 어디에'))
    return ''.join(out)


# ── 283 · 직선이 원이 되는 순간 ─────────────────────────────────────
def in283():
    r, c = 1.4, 0.7
    rad = r * r / (2 * c)                                # 생기는 원의 반지름
    assert abs(rad - 1.4) < 1e-9, rad
    foot, img = c, r * r / c                             # 수선의 발과 그 상
    assert abs(img - 2.8) < 1e-9
    cx, cy, u = 92.0, 96.0, 36.0
    out = ['<circle cx="%.1f" cy="%.1f" r="%.1f" fill="none" stroke="#9CA3AF" '
           'stroke-width="1.2" stroke-dasharray="4 3"/>' % (cx, cy, r * u)]
    lx = cx + c * u
    out.append(poly([(lx, 34), (lx, 158)], '#0E9384', 1.8))
    out.append('<circle cx="%.1f" cy="%.1f" r="%.1f" fill="none" stroke="#BE123C" '
               'stroke-width="1.8"/>' % (cx + rad * u, cy, rad * u))
    out.append(dot(cx, cy, 3.2, '#111827'))
    out.append(dot(lx, cy, 3.2, '#0E9384'))
    out.append(dot(cx + img * u, cy, 3.2, '#BE123C'))
    out.append(txt(cx - 6, cy + 14, 'O', 9.5, '#111827', anc='end', w=800))
    out.append(txt(lx + 5, cy - 6, 'P', 9.5, '#0E9384', w=800))
    out.append(txt(cx + img * u + 6, cy - 6, "P'", 9.5, '#BE123C', w=800))
    out.append(txt(cx + r * u + 4, cy + 26, '반전원 r = %.1f' % r, 9, '#6B7280'))
    out.append(txt(14, 160, '초록 직선의 상이 붉은 원 — 원은 중심 O 를 지난다', 9.5, '#6B7280'))
    out.append(txt(236, 48, 'OP = %.1f' % foot, 10, '#0E9384', w=800))
    out.append(txt(236, 68, "OP' = r² ÷ OP = %.1f" % img, 10, '#BE123C', w=800))
    out.append(txt(236, 94, '생긴 원의 반지름', 10, '#6B7280'))
    out.append(txt(236, 112, 'r² ÷ 2c = %.1f' % rad, 12, '#BE123C', w=800))
    out.append(txt(236, 138, 'c 가 반으로 줄면', 9.5, '#6B7280'))
    out.append(txt(236, 154, '반지름은 두 배가 된다', 9.5, '#6B7280'))
    out.append(cap('직선이 원이 되는 순간'))
    return ''.join(out)


# ── 284 · 어려운 배치를 단순하게 ────────────────────────────────────
def is284():
    gap, rr = 2.0, 1.0                                   # 나란한 두 직선 사이와 그 사이의 원
    assert abs(gap / 2 - rr) < 1e-12
    out = []
    # 왼쪽 — 접하는 두 원과 그 사이에 낀 작은 원
    ox, oy, u = 86.0, 96.0, 30.0
    out.append('<circle cx="%.1f" cy="%.1f" r="%.1f" fill="none" stroke="#2563EB" '
               'stroke-width="1.6"/>' % (ox - 1.5 * u, oy, 1.5 * u))
    out.append('<circle cx="%.1f" cy="%.1f" r="%.1f" fill="none" stroke="#0E9384" '
               'stroke-width="1.6"/>' % (ox + 0.9 * u, oy, 0.9 * u))
    out.append(dot(ox, oy, 3.6, '#BE123C'))
    out.append(txt(ox + 4, oy + 16, '접점', 9, '#BE123C', anc='middle', w=800))
    out.append(txt(ox - 4, 42, '접하는 두 원', 9.5, '#111827', anc='middle', w=800))
    # 오른쪽 — 반전 뒤: 나란한 두 직선과 그 사이의 원
    bx, by = 236.0, 96.0
    for k, col in ((-1, '#2563EB'), (1, '#0E9384')):
        out.append(poly([(bx - 46, by + k * gap / 2 * u), (bx + 86, by + k * gap / 2 * u)],
                        col, 1.8))
    out.append('<circle cx="%.1f" cy="%.1f" r="%.1f" fill="none" stroke="#BE123C" '
               'stroke-width="1.6"/>' % (bx + 10, by, rr * u))
    out.append(txt(bx + 20, 42, '접점을 중심으로 반전하면', 9.5, '#111827', anc='middle', w=800))
    out.append(txt(bx - 44, by + gap / 2 * u + 16, '사이 간격 %.0f' % gap, 9.5, '#6B7280'))
    out.append(txt(bx + 10, by + 4, 'r = %.0f' % rr, 9.5, '#BE123C', anc='middle', w=800))
    out.append(txt(14, 160, '휘어 있던 두 원이 곧은 두 직선이 된다 — 끼인 원은 한 크기로 정해진다',
                   9.5, '#6B7280'))
    out.append(cap('어려운 배치를 단순하게 바꿀 수 있을까'))
    return ''.join(out)


# ── 285 · 비스듬히 찍어도 남는 값 ───────────────────────────────────
def cr285():
    xs = [-2.2, 0.4, 1.2, 2.4]
    cr = ((xs[0] - xs[2]) * (xs[1] - xs[3])) / ((xs[1] - xs[2]) * (xs[0] - xs[3]))
    assert abs(cr - 1.847826) < 1e-5, cr
    S = (0.0, 2.4)
    ang = 35.0
    dirv = (cos(radians(ang)), sin(radians(ang)))
    p0 = (0.0, -0.1)

    def proj(P):
        dx, dy = P[0] - S[0], P[1] - S[1]
        det = dx * (-dirv[1]) - dy * (-dirv[0])
        t = ((p0[0] - S[0]) * (-dirv[1]) - (p0[1] - S[1]) * (-dirv[0])) / det
        return (S[0] + dx * t, S[1] + dy * t)

    img = [proj((x, -1.2)) for x in xs]
    co = [p[0] * dirv[0] + p[1] * dirv[1] for p in img]
    cr2 = ((co[0] - co[2]) * (co[1] - co[3])) / ((co[1] - co[2]) * (co[0] - co[3]))
    assert abs(cr - cr2) < 1e-6, (cr, cr2)
    cx, cy, u = 150.0, 108.0, 32.0
    sx, sy = cx + S[0] * u, cy - S[1] * u
    out = [poly([(cx - 2.8 * u, cy + 1.2 * u), (cx + 2.8 * u, cy + 1.2 * u)], '#2563EB', 1.8)]
    out.append(poly([(cx + (p0[0] - dirv[0] * 2.8) * u, cy - (p0[1] - dirv[1] * 2.8) * u),
                     (cx + (p0[0] + dirv[0] * 2.4) * u, cy - (p0[1] + dirv[1] * 2.4) * u)],
                    '#0E9384', 1.8))
    for x, q in zip(xs, img):
        out.append(poly([(sx, sy), (cx + q[0] * u, cy - q[1] * u)], GREY, 0.8))
        out.append(dot(cx + x * u, cy + 1.2 * u, 3.0, '#2563EB'))
        out.append(dot(cx + q[0] * u, cy - q[1] * u, 3.0, '#0E9384'))
    out.append(dot(sx, sy, 3.6, '#111827'))
    out.append(txt(sx + 6, sy - 4, '시점', 9.5, '#111827', w=800))
    out.append(txt(14, 160, '파랑 위의 네 점을 초록 직선으로 옮겨 찍었다', 9.5, '#6B7280'))
    out.append(txt(276, 50, '원래 복비', 10, '#2563EB', w=800))
    out.append(txt(276, 68, '%.5f' % cr, 11, '#2563EB', w=800))
    out.append(txt(276, 94, '옮긴 복비', 10, '#0E9384', w=800))
    out.append(txt(276, 112, '%.5f' % cr2, 11, '#0E9384', w=800))
    out.append(txt(276, 140, '길이의 비는 바뀌는데', 9.5, '#6B7280'))
    out.append(txt(276, 156, '복비는 그대로다', 9.5, '#111827', w=800))
    out.append(cap('비스듬히 찍어도 남는 값이 있을까'))
    return ''.join(out)


# ── 286 · 방향만으로는 부족하다 ─────────────────────────────────────
def pn286():
    a, b, c, d = 1.0, 1.0, 2.0, 2.0
    dist = abs(d) / sqrt(a * a + b * b + c * c)
    assert abs(dist - 0.8164966) < 1e-6, dist
    ox, oy = 108.0, 112.0
    ex, ey = 30.0, -16.0                                 # 비스듬한 x 축
    yx, yy = 46.0, 10.0                                  # y 축
    zx, zy = 0.0, -44.0                                  # z 축
    P = lambda X, Y, Z: (ox + X * ex + Y * yx + Z * zx, oy + X * ey + Y * yy + Z * zy)
    out = [poly([(ox, oy), P(2.4, 0, 0)], GREY, 1.0), head(*P(2.5, 0, 0), ex / 34, ey / 34),
           poly([(ox, oy), P(0, 1.9, 0)], GREY, 1.0), head(*P(2.0, 0, 0)[:0] or P(0, 2.0, 0),
                                                           yx / 47, yy / 47),
           poly([(ox, oy), P(0, 0, 1.9)], GREY, 1.0), head(*P(0, 0, 2.0), 0, -1)]
    A, B, C = P(d / a, 0, 0), P(0, d / b, 0), P(0, 0, d / c)
    out.append(shape([A, B, C], '#2563EB', '.18', stroke='#2563EB', sw=1.6))
    nx, ny = (a * ex + b * yx + c * zx) / 60, (a * ey + b * yy + c * zy) / 60
    out.append(arrow(ox, oy, ox + nx * 42, oy + ny * 42, '#BE123C', 2.0))
    out.append(dot(ox, oy, 3.0, '#111827'))
    out.append(txt(ox - 7, oy + 12, 'O', 9.5, '#111827', anc='end', w=800))
    out.append(txt(A[0] + 4, A[1] + 12, 'x 절편 %g' % (d / a), 9, '#6B7280'))
    out.append(txt(B[0] + 6, B[1] + 4, 'y 절편 %g' % (d / b), 9, '#6B7280'))
    out.append(txt(C[0] - 6, C[1] - 4, 'z 절편 %g' % (d / c), 9, '#6B7280', anc='end'))
    out.append(txt(ox + nx * 46, oy + ny * 46 - 4, '법선 (%g, %g, %g)' % (a, b, c),
                   9.5, '#BE123C', w=800))
    out.append(txt(14, 160, '법선이 기울기를 정하고 d 가 자리를 정한다', 9.5, '#6B7280'))
    out.append(txt(242, 52, '%gx + %gy + %gz = %g' % (a, b, c, d), 10.5, '#2563EB', w=800))
    out.append(txt(242, 78, '원점까지 거리', 10, '#6B7280'))
    out.append(txt(242, 96, '|d| ÷ |n| = %g ÷ %.4f' % (d, sqrt(6)), 9.5, '#111827'))
    out.append(txt(242, 114, '= %.4f' % dist, 11, '#BE123C', w=800))
    out.append(txt(242, 140, 'd 를 키우면 같은 기울기로', 9.5, '#6B7280'))
    out.append(txt(242, 156, '원점에서 멀어진다', 9.5, '#6B7280'))
    out.append(cap('방향만 알면 평면이 정해질까'))
    return ''.join(out)


# ── 287 · 지붕의 각을 재려면 ────────────────────────────────────────
def pa287():
    A = B = 60.0
    n1 = (sin(radians(A)), cos(radians(A)))
    n2 = (-sin(radians(B)), cos(radians(B)))
    raw = degrees(acos(max(-1.0, min(1.0, n1[0] * n2[0] + n1[1] * n2[1]))))
    acute = min(raw, 180 - raw)
    assert abs(raw - 120.0) < 1e-9 and abs(acute - 60.0) < 1e-9, (raw, acute)
    ox, oy, L = 118.0, 118.0, 62.0
    out = [poly([(ox - L * cos(radians(A)), oy - L * sin(radians(A))), (ox, oy),
                 (ox + L * cos(radians(B)), oy - L * sin(radians(B)))], '#2563EB', 2.2)]
    out.append(arrow(ox - L * 0.5 * cos(radians(A)), oy - L * 0.5 * sin(radians(A)),
                     ox - L * 0.5 * cos(radians(A)) + n1[0] * 30,
                     oy - L * 0.5 * sin(radians(A)) - n1[1] * 30, '#BE123C', 1.8))
    out.append(arrow(ox + L * 0.5 * cos(radians(B)), oy - L * 0.5 * sin(radians(B)),
                     ox + L * 0.5 * cos(radians(B)) + n2[0] * 30,
                     oy - L * 0.5 * sin(radians(B)) - n2[1] * 30, '#B45309', 1.8))
    out.append(dot(ox, oy, 3.4, '#111827'))
    out.append(txt(ox, oy + 14, '모서리', 9.5, '#111827', anc='middle', w=800))
    out.append(txt(ox - 46, oy - 54, '① 평면', 9.5, '#2563EB', anc='end', w=800))
    out.append(txt(ox + 46, oy - 54, '② 평면', 9.5, '#2563EB', w=800))
    out.append(txt(14, 160, '붉은·주황 = 두 평면의 법선', 9.5, '#6B7280'))
    out.append(txt(228, 48, '두 평면이 이루는 각 %.0f°' % acute, 10.5, '#2563EB', w=800))
    out.append(txt(228, 72, '법선이 이루는 각 %.0f°' % raw, 10.5, '#BE123C', w=800))
    out.append(txt(228, 96, '%.0f° + %.0f° = 180°' % (acute, raw), 10, '#111827', w=800))
    out.append(txt(228, 122, '법선을 뒤집으면 보각이 되므로', 9.5, '#6B7280'))
    out.append(txt(228, 138, '둘 중 예각을 이면각으로', 9.5, '#6B7280'))
    out.append(txt(228, 154, '쓰기로 약속한다', 9.5, '#6B7280'))
    out.append(cap('지붕의 두 면이 이루는 각을 어떻게 잴까'))
    return ''.join(out)


# ── 288 · 자른 면만 보고 알아맞히기 ─────────────────────────────────
def qs288():
    z = 1.0
    rows = [('타원포물면  z = x² + y²', '원', sqrt(z)),
            ('쌍곡포물면  z = x² − y²', '쌍곡선', None),
            ('원뿔면  z² = x² + y²', '원', abs(z)),
            ('일엽쌍곡면  x² + y² − z² = 1', '원', sqrt(1 + z * z))]
    assert abs(rows[3][2] - 1.4142136) < 1e-6
    cx, cy, u = 92.0, 100.0, 30.0
    out = []
    pts = [(cx + t * u * 0.9, cy - (t * t) * u * 0.55) for t in
           [-1.7 + i * 3.4 / 40 for i in range(41)]]
    out.append(poly(pts, '#2563EB', 2.0))                # 포물면의 옆모습
    zy = cy - z * u * 0.55 * 1.7 * 1.7 / 2.9
    zy = cy - 30.0
    out.append(poly([(cx - 58, zy), (cx + 58, zy)], '#BE123C', 1.6, dash=1))
    out.append('<ellipse cx="%.1f" cy="%.1f" rx="%.1f" ry="%.1f" fill="none" stroke="#BE123C" '
               'stroke-width="1.6"/>' % (cx, zy, 38, 11))
    out.append(txt(cx + 62, zy - 4, 'z = %g' % z, 9.5, '#BE123C', w=800))
    out.append(txt(cx, 44, '자른 면이 곧 단면', 9.5, '#111827', anc='middle', w=800))
    out.append(txt(14, 160, '같은 높이로 잘라도 입체마다 단면이 다르다', 9.5, '#6B7280'))
    for i, (nm, kind, rr) in enumerate(rows):
        y = 52.0 + i * 26.0
        out.append(txt(180, y, nm, 9.5, '#111827'))
        out.append(txt(368, y, kind + ('' if rr is None else '  %.4f' % rr), 9.5,
                       '#0E9384' if kind == '원' else '#B45309', anc='end', w=800))
    out.append(cap('자른 면만 보고 입체를 알아맞힐 수 있을까'))
    return ''.join(out)


# ── 289 · 곡선을 돌리면 ─────────────────────────────────────────────
def rv289():
    k = 0.6
    y0, r_about_y = 1.2, 1.2 / 0.6                       # y 축으로 돌릴 때 높이 y 의 반지름
    x0, r_about_x = 2.0, 0.6 * 2.0                       # x 축으로 돌릴 때
    assert abs(r_about_y - 2.0) < 1e-12 and abs(r_about_x - 1.2) < 1e-12
    out = []
    for j, (lab, axis) in enumerate([('y 축으로 돌리면 — 원뿔', 'y'), ('x 축으로 돌리면 — 나팔', 'x')]):
        ox, oy, u = 70.0 + j * 190.0, 132.0, 34.0
        out.append(poly([(ox - 8, oy), (ox + 90, oy)], GREY, 1.0))
        out.append(head(ox + 94, oy, 1, 0))
        out.append(poly([(ox, oy + 8), (ox, oy - 86)], GREY, 1.0))
        out.append(head(ox, oy - 90, 0, -1))
        out.append(poly([(ox, oy), (ox + 2.4 * u, oy - 2.4 * k * u)], '#2563EB', 2.0))
        if axis == 'y':
            for yy in (0.4, 0.8, 1.2):
                rx = yy / k
                out.append('<ellipse cx="%.1f" cy="%.1f" rx="%.1f" ry="%.1f" fill="none" '
                           'stroke="#BE123C" stroke-width="1.2" stroke-opacity=".8"/>'
                           % (ox, oy - yy * u, rx * u * 0.7, 5))
            out.append(txt(ox + 8, oy - 1.2 * u - 10, '높이 %.1f 의 반지름 %.1f'
                           % (y0, r_about_y), 9, '#BE123C', w=800))
        else:
            for xx in (0.8, 1.6, 2.4):
                ry = k * xx
                out.append('<ellipse cx="%.1f" cy="%.1f" rx="%.1f" ry="%.1f" fill="none" '
                           'stroke="#0E9384" stroke-width="1.2" stroke-opacity=".8"/>'
                           % (ox + xx * u, oy, 5, ry * u * 0.8))
            out.append(txt(ox + 2.0 * u - 4, oy + 30, 'x = %.0f 의 반지름 %.1f'
                           % (x0, r_about_x), 9, '#0E9384', anc='middle', w=800))
        out.append(txt(ox - 8, 44, lab, 9.5, '#111827', w=800))
    out.append(txt(14, 160, '같은 곡선 y = 0.6x 인데 돌리는 축을 바꾸면 다른 입체가 된다',
                   9.5, '#6B7280'))
    out.append(cap('곡선 하나를 돌리면 무엇이 될까'))
    return ''.join(out)


# ── 290 · 180°를 넘는 삼각형 ────────────────────────────────────────
def sp290():
    lat, lon = 5.0, 60.0                                 # 실험 화면과 같은 식으로 구한다
    co = cos(radians(90 - lat))
    base = degrees(atan2(1.0, co * tan(radians(lon / 2))))
    s = lon + 2 * base
    assert 230 < s < 240, s
    cx, cy, Rr = 104.0, 98.0, 56.0
    out = ['<circle cx="%.1f" cy="%.1f" r="%.1f" fill="#EFF6FF" stroke="#9CA3AF" '
           'stroke-width="1.2"/>' % (cx, cy, Rr)]
    out.append('<ellipse cx="%.1f" cy="%.1f" rx="%.1f" ry="%.1f" fill="none" stroke="#9CA3AF" '
               'stroke-width="1.0" stroke-dasharray="4 3"/>' % (cx, cy, Rr, 16))
    top = (cx, cy - Rr)
    for sgn in (-1, 1):                                  # 두 자오선
        pts = []
        for i in range(31):
            t = i / 30.0
            a = -pi / 2 + t * (pi / 2)
            pts.append((cx + sgn * Rr * cos(a) * 0.52 * t ** 0.5 + sgn * 0, cy + Rr * sin(a)))
        pts = [(cx + sgn * Rr * 0.52 * sin(t * pi / 2), cy - Rr * cos(t * pi / 2))
               for t in [i / 30.0 for i in range(31)]]
        out.append(poly(pts, '#BE123C', 1.8))
    out.append(poly([(cx - Rr * 0.52, cy), (cx - Rr * 0.3, cy + 7), (cx, cy + 9),
                     (cx + Rr * 0.3, cy + 7), (cx + Rr * 0.52, cy)], '#BE123C', 1.8))
    out.append(dot(top[0], top[1], 3.4, '#111827'))
    out.append(dot(cx - Rr * 0.52, cy, 3.0, '#111827'))
    out.append(dot(cx + Rr * 0.52, cy, 3.0, '#111827'))
    out.append(txt(cx, top[1] - 7, '극', 9.5, '#111827', anc='middle', w=800))
    out.append(txt(cx, cy + 22, '적도', 9, '#6B7280', anc='middle'))
    out.append(txt(14, 163, '두 자오선과 적도가 만든 삼각형 — 밑각은 둘 다 직각이다', 9.5, '#6B7280'))
    out.append(txt(214, 42, '경도 폭 %.0f° · 위도 폭 %.0f°' % (lon, lat), 10, '#6B7280'))
    out.append(txt(214, 66, '내각의 합 %.2f°' % s, 11.5, '#BE123C', w=800))
    out.append(txt(214, 88, '구면 초과 %.2f°' % (s - 180), 10.5, '#BE123C', w=800))
    out.append(txt(214, 114, '평면이라면 언제나 180°', 10, '#111827', w=800))
    out.append(txt(214, 132, '구면에서는 넘친 만큼이', 9.5, '#6B7280'))
    out.append(txt(214, 148, '삼각형의 넓이가 된다', 9.5, '#6B7280'))
    out.append(cap('내각의 합이 180°를 넘을 수 있을까'))
    return ''.join(out)


FNS = [('pw281', pw281), ('rx282', rx282), ('in283', in283), ('is284', is284), ('cr285', cr285),
       ('pn286', pn286), ('pa287', pa287), ('qs288', qs288), ('rv289', rv289), ('sp290', sp290)]

if __name__ == '__main__':
    import sys
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass
    for nm, f in FNS:
        sys.stdout.write('%-7s %5d자  ok\n' % (nm, len(f())))
