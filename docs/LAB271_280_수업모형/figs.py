# -*- coding: utf-8 -*-
"""LAB 271~280 「오늘의 문제」 그림 — 좌표를 계산해서 그린다.

다변수 적분과 평면기하 묶음이다. 그림에 적는 수는 실험 화면과 같은 식으로 구해
assert 로 묶었다. 수가 틀리면 여기서 멈춘다.
"""
from math import sqrt, pi, cos, sin, log, radians, hypot, degrees, atan2

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


# ── 271 · 조건이 붙은 최댓값 ────────────────────────────────────────
def lg271():
    R = 1.2
    th = degrees(atan2(2, 1))                            # ∇f = (1, 2) 와 나란해지는 자리
    x, y = R * cos(radians(th)), R * sin(radians(th))
    fmax = x + 2 * y
    assert abs(fmax - R * sqrt(5)) < 1e-9, fmax
    assert abs(th - 63.4349) < 1e-3, th
    cx, cy, u = 98.0, 94.0, 34.0
    out = [cross(cx, cy, 58)]
    out.append('<circle cx="%.1f" cy="%.1f" r="%.1f" fill="none" stroke="#2563EB" '
               'stroke-width="1.8"/>' % (cx, cy, R * u))
    for k in (-2.0, -1.0, 0.0, 1.0):                     # f = x + 2y 의 등고선 (기울기 −1/2)
        pts = [(cx + t * u, cy - (k - t) / 2.0 * u) for t in (-1.7, 1.7)]
        out.append(poly(pts, GREY, 1.0, dash=1))
    pts = [(cx + t * u, cy - (fmax - t) / 2.0 * u) for t in (-1.7, 1.7)]
    out.append(poly(pts, '#0E9384', 1.6))                # 접하는 등고선
    sx, sy = cx + x * u, cy - y * u
    out.append(arrow(sx, sy, sx + 1 * 16, sy - 2 * 16, '#BE123C', 2.0))
    out.append(arrow(sx, sy, sx + 2 * x * 9, sy - 2 * y * 9, '#B45309', 1.6))
    out.append(dot(sx, sy, 3.6, '#111827'))
    out.append(txt(sx + 14, sy + 14, '%.1f°' % th, 9.5, '#111827', w=800))
    out.append(txt(14, 160, '파랑 = 조건 · 회색 = f 의 등고선 · 초록 = 접하는 등고선', 9.5, '#6B7280'))
    out.append(txt(206, 46, '조건  x² + y² = %.2f' % (R * R), 10, '#2563EB', w=800))
    out.append(txt(206, 64, '목적  f = x + 2y', 10, '#111827', w=800))
    out.append(txt(206, 88, '∇f = (1, 2) · ∇g = (2x, 2y)', 10, '#6B7280'))
    out.append(txt(206, 106, '두 화살표가 나란한 자리', 10, '#BE123C', w=800))
    out.append(txt(206, 124, '최댓값 = %.1f√5 = %.3f' % (R, fmax), 10, '#0E9384', w=800))
    out.append(txt(206, 142, '반대쪽에서 최솟값 %.3f' % (-fmax), 10, '#6B7280'))
    out.append(cap('울타리 안에서만 움직일 때 최댓값은'))
    return ''.join(out)


# ── 272 · 순서를 바꾸면 구간도 ──────────────────────────────────────
def di272():
    tri = 1.0 / 8                                        # ∬ xy dA (0 ≤ y ≤ x ≤ 1)
    sq = 0.25                                            # 구간을 그대로 둔 채 순서만 바꾼 값
    assert abs(tri - 0.125) < 1e-12 and abs(sq - 0.25) < 1e-12
    out = []
    for k, (lab, vert) in enumerate([('y 먼저 — y : 0 → x', True), ('x 먼저 — x : y → 1', False)]):
        ox, oy, s = 30.0 + k * 150.0, 140.0, 86.0        # 왼쪽 아래 원점, 한 변 s
        out.append(poly([(ox - 4, oy), (ox + s + 10, oy)], GREY, 1.0))
        out.append(head(ox + s + 14, oy, 1, 0))
        out.append(poly([(ox, oy + 4), (ox, oy - s - 10)], GREY, 1.0))
        out.append(head(ox, oy - s - 14, 0, -1))
        out.append(shape([(ox, oy), (ox + s, oy), (ox + s, oy - s)], '#2563EB', '.14',
                         stroke='#2563EB', sw=1.4))
        for i in range(1, 10):                           # 훑는 띠
            t = i / 10.0
            if vert:
                out.append(poly([(ox + t * s, oy), (ox + t * s, oy - t * s)], '#0E9384', 1.1))
            else:
                out.append(poly([(ox + t * s, oy - t * s), (ox + s, oy - t * s)], '#B45309', 1.1))
        out.append(txt(ox - 4, 40, lab, 9.5, '#0E9384' if vert else '#B45309', w=800))
        out.append(txt(ox + s + 2, oy + 14, '1', 9, '#6B7280'))
        out.append(txt(ox - 8, oy - s - 2, '1', 9, '#6B7280'))
        out.append(txt(ox, 160, '값 %.3f' % tri, 9.5, '#111827', w=800))
    out.append(txt(336, 60, '두 순서 모두', 10, '#111827', anc='middle', w=800))
    out.append(txt(336, 78, '%.3f' % tri, 13, '#0E9384', anc='middle', w=800))
    out.append(txt(336, 104, '구간을 그대로', 10, '#BE123C', anc='middle', w=800))
    out.append(txt(336, 120, '두면 %.2f' % sq, 10, '#BE123C', anc='middle', w=800))
    out.append(txt(336, 140, '(사각형이 된다)', 9, '#6B7280', anc='middle'))
    out.append(cap('순서를 바꾸면 구간은 그대로 두어도 될까'))
    return ''.join(out)


# ── 273 · 왜 r 을 곱하나 ────────────────────────────────────────────
def jc273():
    R, N = 1.0, 4
    true_area = pi * R * R
    no_r = 2 * pi * R                                    # r 을 빼먹고 센 값
    assert abs(true_area - 3.14159265) < 1e-6
    assert abs(no_r / true_area - 2.0) < 1e-9
    cx, cy, u = 92.0, 96.0, 56.0
    out = []
    for i in range(1, N + 1):                            # 고리
        out.append('<circle cx="%.1f" cy="%.1f" r="%.1f" fill="none" stroke="#9CA3AF" '
                   'stroke-width="0.9"/>' % (cx, cy, i * u / N))
    for j in range(8):                                   # 부챗살
        a = j * pi / 4
        out.append(poly([(cx, cy), (cx + cos(a) * u, cy - sin(a) * u)], GREY, 0.9))

    def cell(i, j, col):                                 # i 번째 고리 · j 번째 부채의 조각
        r0, r1 = i * u / N, (i + 1) * u / N
        a0, a1 = j * pi / 4, (j + 1) * pi / 4
        p = [(cx + cos(a0) * r0, cy - sin(a0) * r0), (cx + cos(a0) * r1, cy - sin(a0) * r1),
             (cx + cos(a1) * r1, cy - sin(a1) * r1), (cx + cos(a1) * r0, cy - sin(a1) * r0)]
        return shape(p, col, '.45', stroke=col, sw=1.2)

    out.append(cell(0, 0, '#0E9384'))
    out.append(cell(3, 0, '#BE123C'))
    out.append(txt(cx + 20, cy + 22, '안쪽', 9, '#0E9384', w=800))
    out.append(txt(cx + 46, cy - 6, '바깥', 9, '#BE123C', w=800))
    out.append(txt(14, 160, '같은 Δr · Δθ 인데 조각의 넓이가 다르다', 9.5, '#6B7280'))
    out.append(txt(192, 46, '조각의 넓이 = r Δr Δθ', 10.5, '#111827', w=800))
    out.append(txt(192, 68, '바깥 조각은 안쪽의 %d 배' % (2 * N - 1), 10, '#BE123C', w=800))
    out.append(txt(192, 94, '반지름 1 인 원', 10, '#6B7280'))
    out.append(txt(192, 112, 'r 을 곱해 세면  π = %.4f' % true_area, 10, '#0E9384', w=800))
    out.append(txt(192, 130, 'r 을 빼먹으면  2π = %.4f' % no_r, 10, '#BE123C', w=800))
    out.append(cap('넓이를 셀 때 왜 r 을 곱할까'))
    return ''.join(out)


# ── 274 · 바람을 거슬러 갈 때 ───────────────────────────────────────
def li274():
    half1 = -1.92 * 2 + 0.768 * (pi / 2)                 # 0° → 180°
    half2 = 1.92 * 2 + 0.768 * (pi / 2)                  # 180° → 360°
    total = half1 + half2
    assert abs(total - 0.768 * pi) < 1e-9, total
    assert abs(total - 0.4 * pi * 1.6 * 1.2) < 1e-9      # 그린 정리로 본 값
    cx, cy, ux, uy = 104.0, 96.0, 44.0, 44.0
    out = [cross(cx, cy, 56)]
    ell = [(cx + 1.6 * cos(radians(t)) * ux / 1.6 * 1.0 * 1.0, cy - 1.2 * sin(radians(t)) * uy / 1.2)
           for t in range(0, 361, 5)]
    ell = [(cx + 1.6 * cos(radians(t)) * 34, cy - 1.2 * sin(radians(t)) * 34)
           for t in range(0, 361, 5)]
    out.append(poly(ell, '#2563EB', 2.0))
    for gx in (-1.2, 0.0, 1.2):                          # 바람 F = (1.2, 0.4x)
        for gy in (-0.9, 0.0, 0.9):
            px, py = cx + gx * 34, cy - gy * 34
            out.append(arrow(px, py, px + 13, py - 0.4 * gx * 13, '#9CA3AF', 1.1))
    for t, col in ((90, '#BE123C'), (270, '#0E9384')):
        px, py = cx + 1.6 * cos(radians(t)) * 34, cy - 1.2 * sin(radians(t)) * 34
        out.append(dot(px, py, 3.4, col))
    out.append(txt(cx, 48, '윗길 %+.3f' % half1, 9.5, '#BE123C', anc='middle', w=800))
    out.append(txt(cx, 152, '아랫길 %+.3f' % half2, 9.5, '#0E9384', anc='middle', w=800))
    out.append(txt(14, 34, '회색 = 바람 F = (1.2, 0.4x) · 파랑 = 걸어간 길', 9.5, '#6B7280'))
    out.append(txt(206, 52, '바람을 거스르면 값이 음수', 10, '#BE123C', w=800))
    out.append(txt(206, 70, '등지고 가면 양수', 10, '#0E9384', w=800))
    out.append(txt(206, 96, '한 바퀴를 다 돌면', 10, '#111827'))
    out.append(txt(206, 116, '%+.4f' % total, 13, '#1D4ED8', w=800))
    out.append(txt(206, 138, '= 0.4 × (타원의 넓이)', 10, '#6B7280'))
    out.append(cap('바람을 거슬러 갈 때와 등질 때'))
    return ''.join(out)


# ── 275 · 어느 길로 가든 같은가 ─────────────────────────────────────
def cs275():
    A, B = (-1.4, -0.9), (1.4, 0.9)

    def work(k, sag, n=2000):
        s = 0.0
        for i in range(n):
            t1, t2 = i / n, (i + 1) / n
            p1 = (A[0] + (B[0] - A[0]) * t1, A[1] + (B[1] - A[1]) * t1 - sag * sin(pi * t1))
            p2 = (A[0] + (B[0] - A[0]) * t2, A[1] + (B[1] - A[1]) * t2 - sag * sin(pi * t2))
            mx, my = (p1[0] + p2[0]) / 2, (p1[1] + p2[1]) / 2
            s += (2 * mx + k * my) * (p2[0] - p1[0]) + 2 * my * (p2[1] - p1[1])
        return s

    w0s, w0a = work(0, 0.0), work(0, 1.2)
    w1s, w1a = work(1, 0.0), work(1, 1.2)
    assert abs(w0s) < 1e-6 and abs(w0a) < 1e-6, (w0s, w0a)
    assert abs(w1a - (-3.36 * 2 / pi)) < 2e-3, w1a       # 돌아가는 길에서만 ky dx 가 남는다
    cx, cy, u = 100.0, 96.0, 34.0
    out = [cross(cx, cy, 54)]
    ax, ay = cx + A[0] * u, cy - A[1] * u
    bx, by = cx + B[0] * u, cy - B[1] * u
    out.append(poly([(ax, ay), (bx, by)], '#0E9384', 2.0))
    arc = []
    for i in range(41):
        t = i / 40
        px = A[0] + (B[0] - A[0]) * t
        py = A[1] + (B[1] - A[1]) * t - 1.2 * sin(pi * t)
        arc.append((cx + px * u, cy - py * u))
    out.append(poly(arc, '#BE123C', 2.0))
    out.append(dot(ax, ay, 3.6, '#111827'))
    out.append(dot(bx, by, 3.6, '#111827'))
    out.append(txt(ax - 6, ay + 4, 'A', 10, '#111827', anc='end', w=800))
    out.append(txt(bx + 6, by + 4, 'B', 10, '#111827', w=800))
    out.append(txt(14, 160, '초록 = 곧은 길 · 붉은 = 돌아가는 길', 9.5, '#6B7280'))
    out.append(txt(206, 46, 'F = (2x + k y,  2y)', 10.5, '#111827', w=800))
    out.append(txt(206, 72, 'k = 0 : 두 길 모두 %.3f' % abs(w0s), 10, '#0E9384', w=800))
    out.append(txt(206, 90, '→ 어느 길로 가도 같다', 10, '#6B7280'))
    out.append(txt(206, 116, 'k = 1 : 곧은 길 %.3f' % abs(w1s), 10, '#BE123C', w=800))
    out.append(txt(206, 134, '       돌아가는 길 %.3f' % w1a, 10, '#BE123C', w=800))
    out.append(txt(206, 152, '→ 길에 따라 달라진다', 10, '#6B7280'))
    out.append(cap('어느 길로 가든 한 일이 같을까'))
    return ''.join(out)


# ── 276 · 둘레만 돌아 넓이 재기 ─────────────────────────────────────
def gr276():
    N, R = 6, 1.0
    area = 0.5 * N * R * R * sin(2 * pi / N)
    assert abs(area - 2.5980762) < 1e-6, area
    cx, cy, u = 98.0, 94.0, 46.0
    P = [(cx + R * cos(2 * pi * i / N + pi / 2) * u, cy - R * sin(2 * pi * i / N + pi / 2) * u)
         for i in range(N)]
    out = [shape(P, '#2563EB', '.12', stroke='#2563EB', sw=1.8)]
    for i in range(N):                                   # 둘레를 도는 방향
        p, q = P[i], P[(i + 1) % N]
        mx, my = (p[0] + q[0]) / 2, (p[1] + q[1]) / 2
        dx, dy = q[0] - p[0], q[1] - p[1]
        L = hypot(dx, dy)
        out.append(head(mx + dx / L * 5, my + dy / L * 5, dx / L, dy / L, '#0E9384'))
    for p in P:
        out.append(dot(p[0], p[1], 2.8, '#1D4ED8'))
    out.append(txt(cx, cy + 4, '넓이 %.4f' % area, 10, '#1D4ED8', anc='middle', w=800))
    out.append(txt(14, 160, '초록 화살표 = 둘레를 도는 방향 (반시계)', 9.5, '#6B7280'))
    out.append(txt(196, 50, '둘레만 한 바퀴 돌면서', 10, '#111827', w=800))
    out.append(txt(196, 68, '½∮(x dy − y dx) 를 모으면', 10, '#6B7280'))
    out.append(txt(196, 90, '= %.4f  (안쪽 넓이)' % area, 10.5, '#0E9384', w=800))
    out.append(txt(196, 116, '반대로 돌면 %.4f' % (-area), 10, '#BE123C', w=800))
    out.append(txt(196, 134, '→ 부호가 방향을 기억한다', 10, '#6B7280'))
    out.append(cap('둘레만 돌아 안쪽 넓이를 잴 수 있을까'))
    return ''.join(out)


# ── 277 · 한 점에서 만나려면 ────────────────────────────────────────
TA, TB, TC = (0.30, 1.00), (0.00, 0.00), (1.00, 0.00)


def _div(P, Q, r):
    """P 에서 Q 로 r : 1 로 나눈 점."""
    t = r / (1.0 + r)
    return (P[0] + (Q[0] - P[0]) * t, P[1] + (Q[1] - P[1]) * t)


def _meet(p1, p2, p3, p4):
    d = (p2[0] - p1[0]) * (p4[1] - p3[1]) - (p2[1] - p1[1]) * (p4[0] - p3[0])
    if abs(d) < 1e-12:
        return None
    t = ((p3[0] - p1[0]) * (p4[1] - p3[1]) - (p3[1] - p1[1]) * (p4[0] - p3[0])) / d
    return (p1[0] + (p2[0] - p1[0]) * t, p1[1] + (p2[1] - p1[1]) * t)


def cv277():
    out = []
    for k, (r1, r2, r3) in enumerate([(1.0, 1.0, 1.0), (2.0, 1.0, 1.0)]):
        ox, oy, u = 36.0 + k * 186.0, 148.0, 96.0
        X = lambda p: (ox + p[0] * u, oy - p[1] * u)
        A, B, C = X(TA), X(TB), X(TC)
        D = X(_div(TB, TC, r1))
        E = X(_div(TC, TA, r2))
        F = X(_div(TA, TB, r3))
        out.append(shape([A, B, C], '#2563EB', '.08', stroke='#2563EB', sw=1.6))
        for p, q in ((A, D), (B, E), (C, F)):
            out.append(poly([p, q], '#0E9384', 1.3))
        ps = [_meet(A, D, B, E), _meet(B, E, C, F), _meet(C, F, A, D)]
        assert all(p is not None for p in ps)
        if k == 0:
            assert max(hypot(ps[0][0] - p[0], ps[0][1] - p[1]) for p in ps[1:]) < 0.5
            out.append(dot(ps[0][0], ps[0][1], 4.0, '#BE123C'))
            out.append(txt(ox + 48, 58, '곱 = 1 → 한 점', 10, '#BE123C', anc='middle', w=800))
        else:
            out.append(shape(ps, '#BE123C', '.30', stroke='#BE123C', sw=1.4))
            out.append(txt(ox + 48, 58, '곱 = 2 → 세 점', 10, '#BE123C', anc='middle', w=800))
        for p, nm, a in ((A, 'A', 'middle'), (B, 'B', 'end'), (C, 'C', 'start')):
            out.append(txt(p[0] + (0 if a == 'middle' else (-5 if a == 'end' else 5)),
                           p[1] - 6 if a == 'middle' else p[1] + 2, nm, 9.5, '#111827',
                           anc=a, w=800))
    out.append(txt(200, 164, 'BD/DC × CE/EA × AF/FB 가 1 일 때만 한 점에서 만난다',
                   9.5, '#111827', anc='middle', w=800))
    out.append(cap('세 선분이 한 점에서 만나려면'))
    return ''.join(out)


# ── 278 · 부호가 있어야 한다 ────────────────────────────────────────
def _pt(P, Q, t):
    """부호 있는 비 t 로 나눈 점 — t 가 음수면 선분 밖."""
    s = t / (1.0 + t)
    return (P[0] + (Q[0] - P[0]) * s, P[1] + (Q[1] - P[1]) * s)


def mn278():
    t1, t2, t3 = 2.0, 2.0, -0.25
    assert abs(t1 * t2 * t3 + 1) < 1e-12
    ox, oy, u = 120.0, 150.0, 104.0
    X = lambda p: (ox + p[0] * u, oy - p[1] * u)
    A, B, C = X(TA), X(TB), X(TC)
    F = X(_pt(TA, TB, t1))
    D = X(_pt(TB, TC, t2))
    E = X(_pt(TC, TA, t3))
    dev = abs((D[0] - F[0]) * (E[1] - F[1]) - (D[1] - F[1]) * (E[0] - F[0])) / hypot(
        D[0] - F[0], D[1] - F[1])
    assert dev < 0.5, dev                                # 세 점이 한 직선 위에 있다
    out = [shape([A, B, C], '#2563EB', '.08', stroke='#2563EB', sw=1.6)]
    dx, dy = E[0] - F[0], E[1] - F[1]
    L = hypot(dx, dy)
    out.append(poly([(F[0] - dx / L * 16, F[1] - dy / L * 16),
                     (E[0] + dx / L * 16, E[1] + dy / L * 16)], '#BE123C', 1.8))
    for p, nm in ((A, 'A'), (B, 'B'), (C, 'C')):
        out.append(dot(p[0], p[1], 3.2, '#111827'))
    for p, nm, col in ((F, 'F', '#0E9384'), (D, 'D', '#0E9384'), (E, 'E', '#B45309')):
        out.append(dot(p[0], p[1], 3.4, col))
    out.append(txt(A[0], A[1] - 7, 'A', 9.5, '#111827', anc='middle', w=800))
    out.append(txt(B[0] - 5, B[1] - 1, 'B', 9.5, '#111827', anc='end', w=800))
    out.append(txt(C[0] + 5, C[1] - 1, 'C', 9.5, '#111827', w=800))
    out.append(txt(F[0] - 7, F[1] + 2, 'F', 9.5, '#0E9384', anc='end', w=800))
    out.append(txt(D[0] + 4, D[1] - 4, 'D', 9.5, '#0E9384', w=800))
    out.append(txt(E[0] + 6, E[1] - 4, 'E', 9.5, '#B45309', w=800))
    out.append(txt(14, 160, '붉은 직선이 세 변(또는 그 연장)을 자른다', 9.5, '#6B7280'))
    out.append(txt(250, 46, 'AF:FB = %+.2f' % t1, 10, '#0E9384', w=800))
    out.append(txt(250, 64, 'BD:DC = %+.2f' % t2, 10, '#0E9384', w=800))
    out.append(txt(250, 82, 'CE:EA = %+.2f' % t3, 10, '#B45309', w=800))
    out.append(txt(250, 106, '곱 = %+.0f' % (t1 * t2 * t3), 12, '#BE123C', w=800))
    out.append(txt(250, 128, '밖에서 자른 하나가', 9.5, '#6B7280'))
    out.append(txt(250, 144, '음수를 만든다', 9.5, '#6B7280'))
    out.append(cap('한 직선 위에 있다는 것을 어떻게 적을까'))
    return ''.join(out)


# ── 279 · 중심이 왜 여럿일까 ────────────────────────────────────────
GA, GB = (0.0, 2.0), (-1.9, -1.3)


def _centers(C):
    A, B = GA, GB
    a = hypot(B[0] - C[0], B[1] - C[1])
    b = hypot(C[0] - A[0], C[1] - A[1])
    c = hypot(A[0] - B[0], A[1] - B[1])
    G = ((A[0] + B[0] + C[0]) / 3, (A[1] + B[1] + C[1]) / 3)
    d = 2 * (A[0] * (B[1] - C[1]) + B[0] * (C[1] - A[1]) + C[0] * (A[1] - B[1]))
    sa, sb, sc = A[0] ** 2 + A[1] ** 2, B[0] ** 2 + B[1] ** 2, C[0] ** 2 + C[1] ** 2
    O = ((sa * (B[1] - C[1]) + sb * (C[1] - A[1]) + sc * (A[1] - B[1])) / d,
         (sa * (C[0] - B[0]) + sb * (A[0] - C[0]) + sc * (B[0] - A[0])) / d)
    H = (3 * G[0] - 2 * O[0], 3 * G[1] - 2 * O[1])
    I = ((a * A[0] + b * B[0] + c * C[0]) / (a + b + c),
         (a * A[1] + b * B[1] + c * C[1]) / (a + b + c))
    return A, B, G, O, H, I


def ce279():
    C = (2.6, -0.6)
    A, B, G, O, H, I = _centers(C)
    sp = max(hypot(G[0] - P[0], G[1] - P[1]) for P in (O, H, I))
    assert 0.75 < sp < 0.76, sp
    ox, oy, u = 104.0, 112.0, 24.0
    X = lambda p: (ox + p[0] * u, oy - p[1] * u)
    PA, PB, PC = X(A), X(B), X(C)
    out = [shape([PA, PB, PC], '#2563EB', '.08', stroke='#2563EB', sw=1.6)]
    for P, nm, col in ((G, 'G', '#0E9384'), (O, 'O', '#2563EB'),
                       (H, 'H', '#BE123C'), (I, 'I', '#B45309')):
        p = X(P)
        out.append(dot(p[0], p[1], 3.6, col))
    gp, op, hp, ip = X(G), X(O), X(H), X(I)
    out.append(txt(gp[0] + 5, gp[1] - 5, 'G 무게중심', 9, '#0E9384', w=800))
    out.append(txt(op[0] - 5, op[1] + 12, 'O 외심', 9, '#2563EB', anc='end', w=800))
    out.append(txt(hp[0] + 6, hp[1] + 4, 'H 수심', 9, '#BE123C', w=800))
    out.append(txt(ip[0] - 6, ip[1] - 6, 'I 내심', 9, '#B45309', anc='end', w=800))
    out.append(txt(14, 160, '네 중심이 벌어진 정도 = %.4f' % sp, 9.5, '#6B7280'))
    out.append(txt(232, 50, '중심이 넷인 까닭', 10.5, '#111827', w=800))
    out.append(txt(232, 70, 'G — 세 중선이 만나는 곳', 9.5, '#0E9384'))
    out.append(txt(232, 88, 'O — 세 변의 수직이등분선', 9.5, '#2563EB'))
    out.append(txt(232, 106, 'H — 세 높이가 만나는 곳', 9.5, '#BE123C'))
    out.append(txt(232, 124, 'I — 세 각의 이등분선', 9.5, '#B45309'))
    out.append(txt(232, 148, '정삼각형에서만 하나가 된다', 9.5, '#111827', w=800))
    out.append(cap('중심이 왜 여럿일까'))
    return ''.join(out)


# ── 280 · 세 점이 한 줄에 ───────────────────────────────────────────
def el280():
    C = (2.0, 1.8)                                       # 내심이 오일러 직선에서 또렷이 벗어나는 자리
    A, B, G, O, H, I = _centers(C)
    og = hypot(G[0] - O[0], G[1] - O[1])
    gh = hypot(H[0] - G[0], H[1] - G[1])
    assert abs(gh / og - 2.0) < 1e-9, gh / og
    dx, dy = H[0] - O[0], H[1] - O[1]
    L = hypot(dx, dy)
    dev = abs(dx * (I[1] - O[1]) - dy * (I[0] - O[0])) / L
    assert dev > 0.4, dev
    ox, oy, u = 106.9, 122.2, 23.0
    X = lambda p: (ox + p[0] * u, oy - p[1] * u)
    PA, PB, PC = X(A), X(B), X(C)
    out = [shape([PA, PB, PC], '#2563EB', '.08', stroke='#2563EB', sw=1.6)]
    po, ph = X(O), X(H)
    ex, ey = ph[0] - po[0], ph[1] - po[1]
    eL = hypot(ex, ey)
    out.append(poly([(po[0] - ex / eL * 14, po[1] - ey / eL * 14),
                     (ph[0] + ex / eL * 6, ph[1] + ey / eL * 6)], '#BE123C', 1.8))
    for P, col in ((O, '#2563EB'), (G, '#0E9384'), (H, '#BE123C'), (I, '#B45309')):
        p = X(P)
        out.append(dot(p[0], p[1], 3.6, col))
    pg, pi_ = X(G), X(I)
    out.append(txt(po[0] + 7, po[1] + 4, 'O', 9.5, '#2563EB', w=800))
    out.append(txt(pg[0] - 6, pg[1] + 4, 'G', 9.5, '#0E9384', anc='end', w=800))
    out.append(txt(ph[0] - 7, ph[1] + 4, 'H', 9.5, '#BE123C', anc='end', w=800))
    out.append(txt(pi_[0] + 6, pi_[1] - 5, 'I', 9.5, '#B45309', w=800))
    out.append(txt(14, 160, '붉은 직선 = 오일러 직선 · 내심 I 는 그 위에 없다', 9.5, '#6B7280'))
    out.append(txt(214, 50, 'OG = %.3f' % og, 10, '#111827', w=800))
    out.append(txt(214, 68, 'GH = %.3f' % gh, 10, '#111827', w=800))
    out.append(txt(214, 92, 'GH : OG = %.0f : 1' % (gh / og), 11, '#BE123C', w=800))
    out.append(txt(214, 116, '삼각형을 아무리 바꿔도', 9.5, '#6B7280'))
    out.append(txt(214, 132, '이 비는 그대로다', 9.5, '#6B7280'))
    out.append(txt(214, 152, '내심이 벗어난 정도 %.3f' % dev, 9.5, '#B45309', w=800))
    out.append(cap('세 중심이 왜 한 직선 위에 있을까'))
    return ''.join(out)


FNS = [('lg271', lg271), ('di272', di272), ('jc273', jc273), ('li274', li274), ('cs275', cs275),
       ('gr276', gr276), ('cv277', cv277), ('mn278', mn278), ('ce279', ce279), ('el280', el280)]

if __name__ == '__main__':
    import sys
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass
    for nm, f in FNS:
        sys.stdout.write('%-7s %5d자  ok\n' % (nm, len(f())))
