# -*- coding: utf-8 -*-
"""LAB 251~260 「오늘의 문제」 그림 — 좌표를 계산해서 그린다.

선형대수 묶음이다. 그림에 적는 수는 실험 화면과 같은 식으로 구해 assert 로 묶었다.
"""
from math import sqrt, pi, cos, sin, radians, hypot, degrees, acos

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


# ── 251 · 한 번에 뛰어넘기 ──────────────────────────────────────────
def fb251():
    F = [0, 1]
    while len(F) < 16:
        F.append(F[-1] + F[-2])
    assert F[12] == 144 and F[13] == 233 and F[11] == 89
    PHI, PSI = (1 + sqrt(5)) / 2, (1 - sqrt(5)) / 2
    assert abs((PHI ** 12 - PSI ** 12) / sqrt(5) - 144) < 1e-6
    assert abs(PSI ** 12) < 0.01                            # ψⁿ 은 금세 0 에 가까워진다

    out = []
    for i, n in enumerate((1, 2, 3, 12)):
        y = 50 + i * 26
        out.append(txt(62, y, 'n = %-2d' % n, 10, '#6B7280'))
        out.append(txt(118, y, '[ %d  %d ]' % (F[n + 1], F[n]), 10.5, '#2563EB', w=800))
        out.append(txt(118, y + 11, '[ %d  %d ]' % (F[n], F[n - 1]), 10.5, '#2563EB', w=800))
        out.append(txt(232, y + 6, 'F(%d)=%d · F(%d)=%d' % (n + 1, F[n + 1], n, F[n]),
                       10, '#111827'))
    out.append(poly([(58, 44), (392, 44)], '#E5E7EB', 1.0))
    out.append(txt(62, 36, '[1 1 ; 1 0] 을 n 번 곱하면 네 칸이 이웃한 피보나치 수가 된다',
                   10, '#1D4ED8', w=800))
    out.append(poly([(58, 152), (392, 152)], '#E5E7EB', 1.0))
    out.append(txt(62, 166, '비네 공식 (φ¹² − ψ¹²) ÷ √5 = 144 — 무리수만 든 식이 정수를 낸다',
                   10, '#BE123C', w=800))
    out.append(cap('점화식을 한 번의 곱셈으로 바꾸는 두 가지 길'))
    return ''.join(out)


# ── 252 · 계단으로 만들면 풀린다 ───────────────────────────────────
def gs252():
    M = [[2, 1, -1, 3], [1, 3, 2, 13], [3, -1, 1, 4]]
    log = [('처음 상태', [r[:] for r in M])]
    for i in (1, 2):
        f = M[i][0] / M[0][0]
        M[i] = [v - f * M[0][j] for j, v in enumerate(M[i])]
        log.append(('%d행 − %.1f × 1행' % (i + 1, f), [r[:] for r in M]))
    f = M[2][1] / M[1][1]
    M[2] = [v - f * M[1][j] for j, v in enumerate(M[2])]
    log.append(('3행 − %.1f × 2행' % f, [r[:] for r in M]))
    zeros = sum(1 for i, j in ((1, 0), (2, 0), (2, 1)) if abs(M[i][j]) < 1e-9)
    assert zeros == 3 and len(log) == 4
    assert abs(M[2][3] / M[2][2] - 2.2) < 1e-9              # z = 2.2 로 되짚어 간다

    cw, rh = 26.0, 19.0
    out = []
    for p, (lab, G) in enumerate([log[0], log[3]]):
        x0 = 66.0 + p * 184
        out.append(txt(x0, 44, lab, 10, '#6B7280'))
        for i in range(3):
            for j in range(4):
                v = G[i][j]
                zero = j < 3 and i > j and abs(v) < 1e-9
                out.append(rect(x0 + cw * j, 52 + rh * i, cw, rh,
                                '#0E9384' if zero else '#2563EB', '.22' if zero else '.08',
                                '#E5E7EB', 1))
                out.append(txt(x0 + cw * j + cw / 2, 52 + rh * i + 13,
                               '%g' % round(v, 1), 9.5,
                               '#0B6E63' if zero else '#111827', anc='middle',
                               w=800 if zero else None))
        out.append(poly([(x0 + cw * 3, 52), (x0 + cw * 3, 52 + rh * 3)], '#9CA3AF', 1.2, dash=1))
    out.append(poly([(252, 72), (268, 72)], GREY, 1.8) + head(274, 72, 1, 0))
    out.append(txt(62, 134, '초록 칸 셋이 모두 0 이면 계단 완성 — 아래에서 위로 되짚어 간다',
                   10, '#0B6E63', w=800))
    out.append(txt(62, 152, '행을 더하고 빼는 조작은 해를 바꾸지 않는다', 10, '#6B7280'))
    out.append(txt(62, 166, '첫 계수가 0 이면 반드시 행을 맞바꿔야 한다', 10, '#BE123C', w=800))
    out.append(cap('컴퓨터는 계단 모양을 만든 뒤 거꾸로 되짚어 푼다'))
    return ''.join(out)


# ── 253 · 화살표 둘로 어디까지 ─────────────────────────────────────
def sp253():
    u, v1, v2 = (2, 1), (-1, 2), (4, 2)
    assert u[0] * v1[1] - u[1] * v1[0] == 5                 # 서로 다른 방향
    assert u[0] * v2[1] - u[1] * v2[0] == 0                 # 나란하다

    out = []
    for p, (v, lab, col) in enumerate(((v1, '서로 다른 방향 — 평면 전체', '#0E9384'),
                                       (v2, '나란함 — 한 직선뿐', '#BE123C'))):
        cx, cy, s = 112.0 + p * 176, 96.0, 15.0
        out.append(cross(cx, cy, 52))
        if p == 0:
            for a in range(-3, 4):
                for b in range(-3, 4):
                    x, y = a * u[0] + b * v[0], a * u[1] + b * v[1]
                    if abs(x * s) < 50 and abs(y * s) < 50:
                        out.append(dot(cx + s * x, cy - s * y, 1.7, '#9CA3AF'))
        else:
            out.append(poly([(cx - 50, cy + 25), (cx + 50, cy - 25)], '#BE123C', 1.4, dash=1))
            for a in range(-6, 7):
                x, y = a * u[0], a * u[1]
                if abs(x * s) < 50:
                    out.append(dot(cx + s * x, cy - s * y, 1.7, '#9CA3AF'))
        out.append(arrow(cx, cy, cx + s * u[0], cy - s * u[1], '#2563EB'))
        out.append(arrow(cx, cy, cx + s * v[0], cy - s * v[1], col))
        out.append(txt(cx, 162, lab, 10, col, anc='middle', w=800))
        out.append(txt(cx, 40, 'uₓv_y − u_yvₓ = %d' % (u[0] * v[1] - u[1] * v[0]),
                       10, col, anc='middle', w=800))
    out.append(cap('두 방향이 서로 다를 때만 평면 어디든 갈 수 있다'))
    return ''.join(out)


# ── 254 · 원점을 지나야 하는 이유 ──────────────────────────────────
def sb254():
    m, b = 1.0, 2.0
    on = lambda x, bb: m * x + bb
    assert abs(2 * on(1, b) - on(2, b)) > 1e-9              # 절편이 0 이 아니면 실수배로 벗어난다
    assert abs(2 * on(1, 0) - on(2, 0)) < 1e-9             # 0 이면 그대로 남는다

    out = []
    for p, (bb, lab, col) in enumerate(((2.0, 'y = x + 2 — 원점을 지나지 않는다', '#BE123C'),
                                        (0.0, 'y = x — 원점을 지난다', '#0E9384'))):
        cx, cy, s = 112.0 + p * 176, 98.0, 15.0
        out.append(cross(cx, cy, 50))
        X = lambda x: cx + s * x
        Y = lambda y: cy - s * y
        out.append(poly([(X(-3), Y(m * -3 + bb)), (X(3), Y(m * 3 + bb))], col, 2.2))
        px = -1.0
        py = m * px + bb
        qx, qy = 2 * px, 2 * py
        out.append(dot(X(px), Y(py), 4.2, '#2563EB'))
        out.append(dot(X(qx), Y(qy), 4.2, '#B45309'))
        out.append(poly([(X(px), Y(py)), (X(qx), Y(qy))], '#B45309', 1.2, dash=1))
        out.append(txt(X(qx) - 6, Y(qy) + 4, '2배', 9.5, '#B45309', anc='end', w=800))
        out.append(txt(cx, 164, lab, 10, col, anc='middle', w=800))
        out.append(txt(cx, 38, '2배 한 점이 직선 ' + ('밖' if bb else '위'),
                       10, col, anc='middle', w=800))
    out.append(cap('0 을 곱하면 반드시 원점이 나온다 — 그래서 원점을 품어야 한다'))
    return ''.join(out)


# ── 255 · 개수와 차원은 다르다 ─────────────────────────────────────
def dm255():
    V = [(2, 1), (-1, 2), (4, 2), (1, -3)]
    assert V[2][0] * V[0][1] - V[2][1] * V[0][0] == 0       # ③ 은 ① 의 2배
    assert V[0][0] * V[1][1] - V[0][1] * V[1][0] == 5       # ①②는 서로 다른 방향

    cx, cy, s = 128.0, 98.0, 17.0
    out = [cross(cx, cy, 58)]
    COL = ['#2563EB', '#0E9384', '#BE123C', '#B45309']
    for i, (x, y) in enumerate(V):
        out.append(arrow(cx, cy, cx + s * x, cy - s * y, COL[i], 2.0))
        out.append(txt(cx + s * x + (7 if x >= 0 else -7), cy - s * y + 4,
                       '%d' % (i + 1), 10, COL[i], anc='start' if x >= 0 else 'end', w=800))
    out.append(txt(228, 54, '넣은 벡터 4 개', 10.5, '#111827', w=800))
    out.append(txt(228, 74, '③ 은 ① 의 2 배 — 새 방향이 아니다', 10, '#BE123C'))
    out.append(txt(228, 92, '④ 도 ①② 로 만들 수 있다', 10, '#B45309'))
    out.append(txt(228, 114, '차원 = 2', 12, '#0B6E63', w=800))
    out.append(txt(62, 166, '차원은 벡터의 수가 아니라 서로 만들 수 없는 방향의 수',
                   10, '#6B7280'))
    out.append(cap('넷을 넣어도 평면에서는 차원이 2 를 넘지 못한다'))
    return ''.join(out)


# ── 256 · 같은 점, 다른 좌표 ───────────────────────────────────────
def b2256():
    P = (3, 2)
    e1, e2 = (2, 0), (0, 2)
    det = e1[0] * e2[1] - e1[1] * e2[0]
    s = (P[0] * e2[1] - P[1] * e2[0]) / det
    t = (e1[0] * P[1] - e1[1] * P[0]) / det
    assert det == 4 and abs(s - 1.5) < 1e-12 and abs(t - 1) < 1e-12
    assert abs(s * e1[0] + t * e2[0] - P[0]) < 1e-12        # 같은 점을 가리킨다

    out = []
    for p, (a, b, lab, col) in enumerate((((1, 0), (0, 1), '표준 자 — 좌표 (3, 2)', '#2563EB'),
                                          (e1, e2, '새 자 — 좌표 (1.5, 1)', '#0E9384'))):
        cx, cy, sc = 112.0 + p * 176, 100.0, 15.0
        out.append(cross(cx, cy, 50))
        for i in range(-3, 4):
            for j in range(-3, 4):
                x, y = i * a[0] + j * b[0], i * a[1] + j * b[1]
                if abs(x * sc) < 48 and abs(y * sc) < 48:
                    out.append(dot(cx + sc * x, cy - sc * y, 1.6, '#C7D2E4'))
        out.append(arrow(cx, cy, cx + sc * a[0], cy - sc * a[1], col, 2.0))
        out.append(arrow(cx, cy, cx + sc * b[0], cy - sc * b[1], col, 2.0))
        out.append(dot(cx + sc * P[0], cy - sc * P[1], 5.0, '#BE123C'))
        out.append(txt(cx + sc * P[0] + 7, cy - sc * P[1] + 4, 'P', 11, '#BE123C', w=800))
        out.append(txt(cx, 164, lab, 10, col, anc='middle', w=800))
    out.append(txt(200, 40, '점은 움직이지 않았다 — 자만 바뀌었다', 10, '#6B7280', anc='middle'))
    out.append(cap('좌표는 점의 성질이 아니라 어떤 자로 재었는지에 달린 값'))
    return ''.join(out)


# ── 257 · 돌리고 늘이면 다르다 ─────────────────────────────────────
def lt257():
    ang, sc = radians(45), 1.8
    R = [cos(ang), -sin(ang), sin(ang), cos(ang)]
    S = [sc, 0, 0, 1]
    mul = lambda X, Y: [X[0] * Y[0] + X[1] * Y[2], X[0] * Y[1] + X[1] * Y[3],
                        X[2] * Y[0] + X[3] * Y[2], X[2] * Y[1] + X[3] * Y[3]]
    M1, M2 = mul(R, S), mul(S, R)
    assert abs((M1[0] * M1[3] - M1[1] * M1[2]) - sc) < 1e-12
    assert abs((M2[0] * M2[3] - M2[1] * M2[2]) - sc) < 1e-12   # 행렬식은 같다
    assert max(abs(M1[i] - M2[i]) for i in range(4)) > 0.3     # 그런데 행렬은 다르다

    sq = [(0, 0), (1, 0), (1, 1), (0, 1)]
    out = []
    for p, (M, lab, col) in enumerate(((M1, '돌리고 → 늘이기', '#2563EB'),
                                       (M2, '늘이고 → 돌리기', '#BE123C'))):
        cx, cy, u = 112.0 + p * 176, 104.0, 30.0
        out.append(cross(cx, cy, 52))
        out.append(shape([(cx + u * x, cy - u * y) for x, y in sq], '#9CA3AF', '.10', '#9CA3AF', 1.2))
        pts = [(M[0] * x + M[1] * y, M[2] * x + M[3] * y) for x, y in sq]
        out.append(shape([(cx + u * x, cy - u * y) for x, y in pts], col, '.22', col, 1.8))
        out.append(txt(cx, 164, lab, 10, col, anc='middle', w=800))
        out.append(txt(cx, 40, '행렬식 %.1f' % sc, 10, '#6B7280', anc='middle'))
    out.append(txt(62, 150, '회전 45° 와 가로 1.8배 — 넓이 배율은 같은데 모양이 어긋난다',
                   10, '#111827', w=800))
    out.append(cap('합성변환은 행렬의 곱이고, 곱셈은 순서를 탄다'))
    return ''.join(out)


# ── 258 · 오래 지나면 어디에 ───────────────────────────────────────
def mk258():
    p, q = 0.30, 0.20
    star = q / (p + q)
    step = lambda a: a * (1 - p) + (1 - a) * q
    assert abs(star - 0.4) < 1e-12 and abs(step(star) - star) < 1e-12
    paths = []
    for s0 in (1.0, 0.0, 0.7):
        a, seq = s0, [s0]
        for _ in range(14):
            a = step(a)
            seq.append(a)
        paths.append(seq)
        assert abs(seq[-1] - star) < 0.01                    # 어디서 떠나도 같은 곳

    X = lambda n: 60 + 290 * n / 14
    Y = lambda v: 146 - 106 * v
    out = [axes(60, 356, 146, 30)]
    out.append(poly([(60, Y(star)), (350, Y(star))], '#BE123C', 1.8, dash=1))
    for seq, col in zip(paths, ('#2563EB', '#0E9384', '#B45309')):
        out.append(poly([(X(n), Y(v)) for n, v in enumerate(seq)], col, 2.2))
        out.append(dot(X(0), Y(seq[0]), 4.0, col))
    out.append(txt(66, Y(star) - 7, '정상상태 A = 40%', 10, '#BE123C', w=800))
    out.append(txt(66, 44, '출발점 100% · 70% · 0% — 세 길이 같은 곳으로 모인다',
                   10, '#6B7280'))
    out.append(txt(X(0), 160, '0 단계', 9.5, '#6B7280', anc='middle'))
    out.append(txt(X(14), 160, '14 단계', 9.5, '#6B7280', anc='middle'))
    out.append(cap('차이가 매 단계 같은 비율로 줄어 출발점의 기억이 사라진다'))
    return ''.join(out)


# ── 259 · 기울어진 축을 곧게 ───────────────────────────────────────
def gm259():
    U = (3.0, 0.5)
    v = (2.0, 2.5)
    uu = U[0] ** 2 + U[1] ** 2
    k = (v[0] * U[0] + v[1] * U[1]) / uu
    w = (v[0] - k * U[0], v[1] - k * U[1])
    assert abs(k - 0.78378) < 1e-4
    assert abs(w[0] * U[0] + w[1] * U[1]) < 1e-9             # 딱 한 번 덜어 내면 직각

    cx, cy, s = 150.0, 110.0, 30.0
    X = lambda x: cx + s * x
    Y = lambda y: cy - s * y
    out = [cross(cx, cy, 86)]
    out.append(arrow(X(0), Y(0), X(U[0]), Y(U[1]), '#2563EB', 2.4))
    out.append(arrow(X(0), Y(0), X(v[0]), Y(v[1]), '#0E9384', 2.4))
    out.append(arrow(X(0), Y(0), X(k * U[0]), Y(k * U[1]), '#9CA3AF', 1.8))
    out.append(poly([(X(k * U[0]), Y(k * U[1])), (X(v[0]), Y(v[1]))], '#BE123C', 1.6, dash=1))
    out.append(arrow(X(0), Y(0), X(w[0]), Y(w[1]), '#BE123C', 2.4))
    out.append(txt(X(U[0]) + 7, Y(U[1]) + 4, 'u', 11, '#1D4ED8', w=800))
    out.append(txt(X(v[0]) + 7, Y(v[1]) + 4, 'v', 11, '#0B6E63', w=800))
    out.append(txt(X(w[0]) - 7, Y(w[1]) - 4, 'w', 11, '#BE123C', anc='end', w=800))
    out.append(txt(252, 48, '(v·u) ÷ (u·u) = 0.784', 10, '#6B7280'))
    out.append(txt(252, 66, '그만큼 u 방향을 덜어 내면', 10, '#6B7280'))
    out.append(txt(252, 84, 'w · u = 0 — 직각', 11, '#BE123C', w=800))
    out.append(txt(62, 166, '덜어 내는 비율이 모자라도 넘쳐도 직각이 되지 않는다',
                   10, '#6B7280'))
    out.append(cap('직교화는 「얼마만큼 덜어 낼까」 한 번으로 끝난다'))
    return ''.join(out)


# ── 260 · 딱 맞는 답이 없을 때 ─────────────────────────────────────
def ls260():
    P = [(1, 2), (2, 3), (3, 5)]
    n = len(P)
    sx = sum(p[0] for p in P)
    sy = sum(p[1] for p in P)
    sxy = sum(p[0] * p[1] for p in P)
    sxx = sum(p[0] ** 2 for p in P)
    a = (n * sxy - sx * sy) / (n * sxx - sx * sx)
    b = (sy - a * sx) / n
    r = [p[1] - (a * p[0] + b) for p in P]
    assert abs(a - 1.5) < 1e-9 and abs(b - 1 / 3.0) < 1e-9
    assert abs(sum(r)) < 1e-9 and abs(sum(r[i] * P[i][0] for i in range(n))) < 1e-9
    assert abs(sum(x * x for x in r) - 1 / 6.0) < 1e-9       # 가장 작은 오차 제곱합

    X = lambda x: 70 + 72 * x
    Y = lambda y: 150 - 21 * y
    out = [axes(70, 330, 150, 36)]
    out.append(poly([(X(0.3), Y(a * 0.3 + b)), (X(3.7), Y(a * 3.7 + b))], '#2563EB', 2.4))
    for i, (x, y) in enumerate(P):
        out.append(poly([(X(x), Y(y)), (X(x), Y(a * x + b))], '#BE123C', 2.0))
        out.append(dot(X(x), Y(y), 4.6, '#111827'))
        out.append(txt(X(x) + 7, Y(y) - 5, '%+.3f' % r[i], 9.5, '#BE123C', w=800))
    out.append(txt(70, 30, '세 점을 모두 지나는 직선은 없다 — 가장 가까운 직선을 찾는다',
                   10, '#6B7280'))
    out.append(txt(338, 70, 'y = 1.5x + 0.333', 10, '#1D4ED8', anc='end', w=800))
    out.append(txt(338, 90, '오차의 합 = 0', 10, '#BE123C', anc='end', w=800))
    out.append(txt(338, 108, '오차 · x = 0', 10, '#BE123C', anc='end', w=800))
    out.append(txt(338, 128, '오차 제곱합 0.1667', 10, '#111827', anc='end', w=800))
    out.append(txt(70, 166, '가장 가까운 답은 오차를 수직으로 만드는 답이다', 10, '#111827', w=800))
    out.append(cap('해가 없어도 가장 가까운 답은 언제나 있다'))
    return ''.join(out)


FNS = [('fb251', fb251), ('gs252', gs252), ('sp253', sp253), ('sb254', sb254), ('dm255', dm255),
       ('b2256', b2256), ('lt257', lt257), ('mk258', mk258), ('gm259', gm259), ('ls260', ls260)]

if __name__ == '__main__':
    import sys
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass
    for nm, f in FNS:
        sys.stdout.write('%-7s %5d자  ok\n' % (nm, len(f())))
