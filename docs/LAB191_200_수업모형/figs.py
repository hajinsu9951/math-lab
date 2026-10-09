# -*- coding: utf-8 -*-
"""LAB 191~200 「오늘의 문제」 그림 — 좌표를 계산해서 그린다."""
import math
from math import sqrt, hypot, cos, sin, pi, log, exp

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


def grid(vals, x0, y0, cw, fmt='%d', fill=None, fs=10.5, stroke='#C7D2E4'):
    """숫자 격자 하나 — vals 는 2차원 리스트."""
    out = []
    for i, row in enumerate(vals):
        for j, v in enumerate(row):
            x, y = x0 + cw * j, y0 + cw * i
            out.append('<rect x="%.1f" y="%.1f" width="%.1f" height="%.1f" fill="%s" stroke="%s" stroke-width="1"/>'
                       % (x, y, cw, cw, fill(v) if fill else '#fff', stroke))
            out.append('<text x="%.1f" y="%.1f" font-size="%s" fill="#111827" text-anchor="middle"%s>%s</text>'
                       % (x + cw / 2, y + cw / 2 + 3.6, fs, HALO, fmt % v))
    return ''.join(out)


# ── 191 · 겹치는 만큼 비슷하다 ─────────────────────────────────────
def jc191():
    A = ['재미있다', '최고', '배우', '좋다']
    B = ['배우', '좋다', '연출']
    inter = [w for w in A if w in B]
    uni = A + [w for w in B if w not in A]
    J = len(inter) / len(uni)
    assert len(inter) == 2 and len(uni) == 5 and abs(J - 0.4) < 1e-12

    cx1, cx2, cy, R = 150.0, 232.0, 88.0, 58.0
    out = ['<circle cx="%.1f" cy="%.1f" r="%.1f" fill="#2563EB" fill-opacity=".14" stroke="#1D4ED8" stroke-width="1.8"/>'
           % (cx1, cy, R),
           '<circle cx="%.1f" cy="%.1f" r="%.1f" fill="#0E9384" fill-opacity=".14" stroke="#0B6E63" stroke-width="1.8"/>'
           % (cx2, cy, R)]
    only_a = [w for w in A if w not in B]
    only_b = [w for w in B if w not in A]
    for i, w in enumerate(only_a):
        out.append('<text x="%.1f" y="%.1f" font-size="10" fill="#1D4ED8" text-anchor="middle"%s>%s</text>'
                   % (cx1 - 26, cy - 10 + i * 15, HALO, w))
    for i, w in enumerate(inter):
        out.append('<text x="%.1f" y="%.1f" font-size="10" font-weight="800" fill="#111827" text-anchor="middle"%s>%s</text>'
                   % ((cx1 + cx2) / 2, cy - 6 + i * 15, HALO, w))
    for i, w in enumerate(only_b):
        out.append('<text x="%.1f" y="%.1f" font-size="10" fill="#0B6E63" text-anchor="middle"%s>%s</text>'
                   % (cx2 + 28, cy + i * 15, HALO, w))
    out.append('<text x="%.1f" y="%.1f" font-size="10.5" font-weight="800" fill="#1D4ED8" text-anchor="middle"%s>A</text>'
               % (cx1 - 40, cy - R + 2, HALO))
    out.append('<text x="%.1f" y="%.1f" font-size="10.5" font-weight="800" fill="#0B6E63" text-anchor="middle"%s>B</text>'
               % (cx2 + 40, cy - R + 2, HALO))
    out.append('<text x="368" y="52" font-size="10.5" font-weight="800" fill="#111827" text-anchor="end"%s>'
               '∩ = %d · ∪ = %d</text>' % (HALO, len(inter), len(uni)))
    out.append('<text x="368" y="70" font-size="12" font-weight="800" fill="#BE123C" text-anchor="end"%s>'
               'J = %d ÷ %d = %.1f</text>' % (HALO, len(inter), len(uni), J))
    out.append(cap('두 글이 얼마나 비슷한지를 하나의 수로 말할 수 있을까'))
    return ''.join(out)


# ── 192 · 사진은 숫자 표다 ─────────────────────────────────────────
def ix192():
    BASE = [[30, 60, 90, 120], [60, 90, 120, 150], [90, 120, 150, 180], [120, 150, 180, 210]]
    b = 30
    out_v = [[min(255, v + b) for v in row] for row in BASE]
    m0 = sum(sum(r) for r in BASE) / 16.0
    m1 = sum(sum(r) for r in out_v) / 16.0
    assert abs(m1 - m0 - b) < 1e-9, (m0, m1)

    sh = lambda v: 'rgb(%d,%d,%d)' % (v, v, v)
    out = [grid(BASE, 40, 44, 24, fill=sh, fs=9.5),
           grid(out_v, 244, 44, 24, fill=sh, fs=9.5)]
    out.append(arrow(150, 92, 232, 92, '#BE123C', 2.4))
    out.append('<text x="191" y="84" font-size="10.5" font-weight="800" fill="#BE123C" text-anchor="middle"%s>+ %d</text>'
               % (HALO, b))
    out.append('<text x="88" y="38" font-size="10" fill="#6B7280" text-anchor="middle"%s>원래 사진</text>' % HALO)
    out.append('<text x="292" y="38" font-size="10" fill="#6B7280" text-anchor="middle"%s>밝기를 더한 사진</text>' % HALO)
    out.append('<text x="88" y="156" font-size="10.5" font-weight="800" fill="#1D4ED8" text-anchor="middle"%s>평균 %.1f</text>'
               % (HALO, m0))
    out.append('<text x="292" y="156" font-size="10.5" font-weight="800" fill="#BE123C" text-anchor="middle"%s>평균 %.1f</text>'
               % (HALO, m1))
    out.append(cap('사진을 밝게 한다는 것은 숫자에 무엇을 하는 일일까'))
    return ''.join(out)


# ── 193 · 컬러는 세 장이다 ─────────────────────────────────────────
def rg193():
    R, G, B = 120, 150, 90
    gray = 0.299 * R + 0.587 * G + 0.114 * B
    simple = (R + G + B) / 3.0
    assert abs(gray - 134.19) < 0.01 and abs(simple - 120.0) < 1e-9
    assert abs(0.299 + 0.587 + 0.114 - 1.0) < 1e-12

    out = []
    for i, (nm, v, col) in enumerate((('R', R, '#DC2626'), ('G', G, '#16A34A'), ('B', B, '#2563EB'))):
        ox = 38 + i * 64
        out.append('<rect x="%d" y="46" width="54" height="54" rx="6" fill="%s" opacity="%s" stroke="%s" stroke-width="1.4"/>'
                   % (ox, col, v / 255.0 * 0.8 + 0.1, col))
        out.append('<text x="%d" y="40" font-size="10.5" font-weight="800" fill="%s" text-anchor="middle"%s>%s</text>'
                   % (ox + 27, col, HALO, nm))
        out.append('<text x="%d" y="78" font-size="13" font-weight="800" fill="#111827" text-anchor="middle"%s>%d</text>'
                   % (ox + 27, HALO, v))
        out.append('<text x="%d" y="114" font-size="9.5" fill="#6B7280" text-anchor="middle"%s>× %.3f</text>'
                   % (ox + 27, HALO, (0.299, 0.587, 0.114)[i]))
    out.append(arrow(236, 73, 268, 73, '#111827', 2.4))
    out.append('<rect x="276" y="46" width="54" height="54" rx="6" fill="rgb(%d,%d,%d)" stroke="#111827" stroke-width="1.4"/>'
               % (round(gray), round(gray), round(gray)))
    out.append('<text x="303" y="40" font-size="10.5" font-weight="800" fill="#111827" text-anchor="middle"%s>흑백</text>' % HALO)
    out.append('<text x="303" y="78" font-size="13" font-weight="800" fill="#fff" text-anchor="middle">%d</text>' % round(gray))
    out.append('<text x="200" y="136" font-size="10.5" font-weight="800" fill="#111827" text-anchor="middle"%s>'
               '0.299 × %d + 0.587 × %d + 0.114 × %d = %.2f</text>' % (HALO, R, G, B, gray))
    out.append('<text x="200" y="154" font-size="10" fill="#6B7280" text-anchor="middle"%s>'
               '단순 평균이라면 %.0f — 사람 눈이 초록에 가장 민감해서 가중치가 다르다</text>' % (HALO, simple))
    out.append(cap('컬러 사진 한 장은 사실 숫자 표 몇 장일까'))
    return ''.join(out)


# ── 194 · 행과 열을 맞바꾸면 ───────────────────────────────────────
def tr194():
    A = [[1, 2, 3], [4, 5, 6]]
    T = [[A[i][j] for i in range(2)] for j in range(3)]
    TT = [[T[i][j] for i in range(3)] for j in range(2)]
    assert T == [[1, 4], [2, 5], [3, 6]] and TT == A

    out = [grid(A, 32, 56, 26)]
    out.append('<text x="71" y="48" font-size="10.5" font-weight="800" fill="#1D4ED8" text-anchor="middle"%s>A (2 × 3)</text>' % HALO)
    out.append(arrow(120, 82, 152, 82, '#BE123C', 2.4))
    out.append('<text x="136" y="74" font-size="10" font-weight="800" fill="#BE123C" text-anchor="middle"%s>ᵀ</text>' % HALO)
    out.append(grid(T, 162, 43, 26))
    out.append('<text x="188" y="36" font-size="10.5" font-weight="800" fill="#BE123C" text-anchor="middle"%s>Aᵀ (3 × 2)</text>' % HALO)
    out.append(arrow(228, 82, 260, 82, '#0E9384', 2.4))
    out.append('<text x="244" y="74" font-size="10" font-weight="800" fill="#0B6E63" text-anchor="middle"%s>ᵀ</text>' % HALO)
    out.append(grid(TT, 270, 56, 26))
    out.append('<text x="309" y="48" font-size="10.5" font-weight="800" fill="#0B6E63" text-anchor="middle"%s>(Aᵀ)ᵀ = A</text>' % HALO)
    out.append('<text x="200" y="150" font-size="10.5" font-weight="800" fill="#111827" text-anchor="middle"%s>'
               '(1, 2) 자리의 %d 가 (2, 1) 자리로 — 행과 열이 맞바뀐다</text>' % (HALO, A[0][1]))
    out.append('<text x="200" y="166" font-size="10" fill="#6B7280" text-anchor="middle"%s>'
               '두 번 하면 제자리 — 전치는 스스로를 되돌리는 연산이다</text>' % HALO)
    out.append(cap('행과 열을 맞바꾸면 무엇이 달라지고 무엇이 그대로일까'))
    return ''.join(out)


# ── 195 · 좌표를 옮기는 규칙 ───────────────────────────────────────
def mm195():
    a, b, c, d = 1.4, 0.9, 0.3, 1.2
    det = a * d - b * c
    assert abs(det - (1.4 * 1.2 - 0.9 * 0.3)) < 1e-12
    sq = ((0, 0), (1, 0), (1, 1), (0, 1))
    tr = [(a * x + b * y, c * x + d * y) for x, y in sq]
    # 변환된 평행사변형의 넓이가 |det| 와 같은지 신발끈 공식으로 검산
    area = abs(sum(tr[i][0] * tr[(i + 1) % 4][1] - tr[(i + 1) % 4][0] * tr[i][1] for i in range(4))) / 2
    assert abs(area - abs(det)) < 1e-12, (area, det)

    X = lambda x: 112 + 54.0 * x
    Y = lambda y: 128 - 54.0 * y
    out = ['<path d="M50 %g H330 M%.1f 150 V30" stroke="#9CA3AF" stroke-width="1.1"/>' % (Y(0), X(0))]
    out.append('<path d="%s Z" fill="#9CA3AF" opacity=".18" stroke="#6B7280" stroke-width="1.4"/>'
               % ' '.join('%s%.1f %.1f' % ('M' if i == 0 else 'L', X(x), Y(y)) for i, (x, y) in enumerate(sq)))
    out.append('<path d="%s Z" fill="#2563EB" opacity=".22" stroke="#1D4ED8" stroke-width="2"/>'
               % ' '.join('%s%.1f %.1f' % ('M' if i == 0 else 'L', X(x), Y(y)) for i, (x, y) in enumerate(tr)))
    out.append('<text x="%.1f" y="%.1f" font-size="10" fill="#6B7280" text-anchor="middle"%s>넓이 1</text>'
               % (X(0.5), Y(0.5) + 4, HALO))
    out.append('<text x="%.1f" y="%.1f" font-size="10.5" font-weight="800" fill="#1D4ED8" text-anchor="middle"%s>넓이 %.2f</text>'
               % (X((tr[0][0] + tr[2][0]) / 2), Y((tr[0][1] + tr[2][1]) / 2) + 4, HALO, area))
    out.append('<text x="368" y="44" font-size="10.5" font-weight="800" fill="#111827" text-anchor="end"%s>'
               '[%g %g ; %g %g]</text>' % (HALO, a, b, c, d))
    out.append('<text x="368" y="62" font-size="10.5" font-weight="800" fill="#BE123C" text-anchor="end"%s>'
               '행렬식 = %g×%g − %g×%g = %.2f</text>' % (HALO, a, d, b, c, det))
    out.append('<text x="368" y="80" font-size="10" fill="#6B7280" text-anchor="end"%s>'
               '넓이가 %.2f 배로 — 행렬식이 곧 넓이 배율</text>' % (HALO, det))
    out.append(cap('행렬을 곱한다는 것은 도형에 무엇을 하는 일일까'))
    return ''.join(out)


# ── 196 · 가장 가까운 본보기로 ─────────────────────────────────────
def hm196():
    T = [[1, 1, 1, 1], [0, 1, 1, 0], [0, 1, 1, 0], [0, 1, 1, 0]]
    L = [[1, 1, 0, 0], [1, 1, 0, 0], [1, 1, 0, 0], [1, 1, 1, 1]]
    G = [[1, 1, 1, 1], [0, 1, 1, 0], [0, 1, 1, 0], [0, 1, 0, 0]]   # T 에 잡음 한 칸
    dist = lambda P, Q: sum(1 for i in range(4) for j in range(4) if P[i][j] != Q[i][j])
    dT, dL = dist(G, T), dist(G, L)
    assert dT == 1 and dL > dT, (dT, dL)

    pix = lambda v: '#111827' if v else '#F3F4F6'
    out = []
    for i, (nm, M, col) in enumerate((('본보기 T', T, '#6B7280'), ('입력 (잡음 1칸)', G, '#BE123C'),
                                      ('본보기 L', L, '#6B7280'))):
        ox = 46 + i * 112
        for r in range(4):
            for c in range(4):
                out.append('<rect x="%.1f" y="%.1f" width="17" height="17" fill="%s" stroke="#C7D2E4" stroke-width="0.8"/>'
                           % (ox + 17 * c, 48 + 17 * r, pix(M[r][c])))
        out.append('<text x="%.1f" y="42" font-size="10" font-weight="800" fill="%s" text-anchor="middle"%s>%s</text>'
                   % (ox + 34, col, HALO, nm))
    out.append('<text x="%.1f" y="134" font-size="10.5" font-weight="800" fill="#BE123C" text-anchor="middle"%s>'
               '다른 칸 %d개</text>' % (46 + 112 + 34 - 56, HALO, dT))
    out.append('<text x="%.1f" y="134" font-size="10.5" font-weight="800" fill="#6B7280" text-anchor="middle"%s>'
               '다른 칸 %d개</text>' % (46 + 112 + 34 + 56, HALO, dL))
    out.append('<text x="200" y="156" font-size="10.5" font-weight="800" fill="#111827" text-anchor="middle"%s>'
               '더 가까운 쪽은 T — 16칸 가운데 %d칸만 다르다</text>' % (HALO, dT))
    out.append(cap('삐뚤게 쓴 글자를 어떻게 알아볼까 — 가장 가까운 본보기로'))
    return ''.join(out)


# ── 197 · 층 하나 = 행렬 하나 ──────────────────────────────────────
def dl197():
    W = [[1.0, -1.0, 2.0], [0.5, 1.5, -0.5]]
    Bv = [0.5, -0.2]
    x = [0.8, 0.2, 0.5]
    z = [sum(W[i][j] * x[j] for j in range(3)) + Bv[i] for i in range(2)]
    assert abs(z[0] - 2.1) < 1e-12, z

    out = []
    for j, v in enumerate(x):
        y = 52 + j * 32
        out.append('<circle cx="78" cy="%.1f" r="14" fill="#2563EB" opacity=".18" stroke="#1D4ED8" stroke-width="1.4"/>' % y)
        out.append('<text x="78" y="%.1f" font-size="10.5" font-weight="800" fill="#1D4ED8" text-anchor="middle"%s>%.1f</text>'
                   % (y + 4, HALO, v))
        out.append('<text x="52" y="%.1f" font-size="10" fill="#374151" text-anchor="end"%s>x%s</text>'
                   % (y + 4, HALO, '₁₂₃'[j]))
    for i, v in enumerate(z):
        y = 68 + i * 40
        for j in range(3):
            out.append('<path d="M92 %.1f L%.1f %.1f" stroke="%s" stroke-width="%.1f" opacity=".6"/>'
                       % (52 + j * 32, 226, y, '#BE123C' if W[i][j] < 0 else '#0E9384', 0.8 + abs(W[i][j])))
        out.append('<circle cx="240" cy="%.1f" r="16" fill="#BE123C" opacity=".18" stroke="#BE123C" stroke-width="1.6"/>' % y)
        out.append('<text x="240" y="%.1f" font-size="11" font-weight="800" fill="#BE123C" text-anchor="middle"%s>%.2f</text>'
                   % (y + 4, HALO, v))
        out.append('<text x="266" y="%.1f" font-size="10" fill="#374151"%s>z%s</text>' % (y + 4, HALO, '₁₂'[i]))
    out.append('<text x="368" y="44" font-size="10" fill="#6B7280" text-anchor="end"%s>초록 = 양수 가중치 · 빨강 = 음수</text>' % HALO)
    out.append('<text x="368" y="124" font-size="10.5" font-weight="800" fill="#111827" text-anchor="end"%s>'
               'z₁ = %g·%g + (%g)·%g + %g·%g + %g = %.2f</text>'
               % (HALO, W[0][0], x[0], W[0][1], x[1], W[0][2], x[2], Bv[0], z[0]))
    out.append('<text x="368" y="142" font-size="10" fill="#6B7280" text-anchor="end"%s>'
               '곧 z = Wx + b — 층 하나가 행렬 하나다</text>' % HALO)
    out.append(cap('신경망의 한 층에서 일어나는 일은 무엇일까'))
    return ''.join(out)


# ── 198 · 오차를 하나의 수로 ───────────────────────────────────────
def lc198():
    D = [(1, 2), (2, 4), (3, 6)]
    L = lambda a: sum((y - a * x) ** 2 for x, y in D) / len(D)
    best = sum(x * y for x, y in D) / sum(x * x for x, _ in D)
    assert abs(best - 2.0) < 1e-12 and abs(L(best)) < 1e-12
    assert L(1.5) > L(best) and L(2.5) > L(best)

    X = lambda a: 60 + 72.0 * a
    Y = lambda v: 138 - 11.0 * v
    out = ['<path d="M52 138 H364 M60 146 V30" stroke="#9CA3AF" stroke-width="1.2"/>']
    out.append('<path d="%s" stroke="#2563EB" stroke-width="2.6" fill="none"/>'
               % curve(L, 0, 4.0, X, Y, 22, 142))
    out.append('<circle cx="%.1f" cy="%.1f" r="5.4" fill="#BE123C"/>' % (X(best), Y(L(best))))
    out.append('<path d="M%.1f %.1f V138" stroke="#BE123C" stroke-width="1.2" stroke-dasharray="4 3"/>'
               % (X(best), Y(L(best))))
    out.append('<text x="%.1f" y="154" font-size="10.5" font-weight="800" fill="#BE123C" text-anchor="middle"%s>a = %g</text>'
               % (X(best), HALO, best))
    for a in (1.0, 3.0):
        out.append('<circle cx="%.1f" cy="%.1f" r="3.6" fill="#2563EB"/>' % (X(a), Y(L(a))))
        out.append('<text x="%.1f" y="%.1f" font-size="9.5" fill="#1D4ED8" text-anchor="middle"%s>L(%g) = %.1f</text>'
                   % (X(a), Y(L(a)) - 8, HALO, a, L(a)))
    out.append('<text x="368" y="44" font-size="10.5" font-weight="800" fill="#111827" text-anchor="end"%s>'
               'L(a) = 평균((y − ax)²)</text>' % HALO)
    out.append('<text x="368" y="62" font-size="10" fill="#6B7280" text-anchor="end"%s>'
               '골짜기 바닥이 가장 좋은 기울기</text>' % HALO)
    out.append('<text x="60" y="160" font-size="10" fill="#6B7280"%s>기울기 a →</text>' % HALO)
    out.append(cap('좋은 직선과 나쁜 직선을 수 하나로 견줄 수 있을까'))
    return ''.join(out)


# ── 199 · 무엇을 오차로 볼까 ───────────────────────────────────────
def ms199():
    D = [(1, 1.0), (2, 2.0), (3, 3.0), (4, 4.0), (5, 5.0)]
    out_y = 14.0                                     # 이상치 하나
    DO = D[:-1] + [(5, out_y)]
    n = len(DO)
    sx = sum(p[0] for p in DO); sy = sum(p[1] for p in DO)
    sxx = sum(p[0] ** 2 for p in DO); sxy = sum(p[0] * p[1] for p in DO)
    a_mse = (n * sxy - sx * sy) / (n * sxx - sx * sx)
    b_mse = (sy - a_mse * sx) / n
    # MAE 는 격자 탐색으로 — 중앙값에 가까운 직선을 찾는다
    best, a_mae, b_mae = None, 0, 0
    for ai in range(0, 301):
        aa = ai / 100.0
        for bi in range(-200, 201):
            bb = bi / 100.0
            s = sum(abs(y - aa * x - bb) for x, y in DO)
            if best is None or s < best:
                best, a_mae, b_mae = s, aa, bb
    assert a_mse > a_mae + 0.3, (a_mse, a_mae)       # MSE 가 이상치에 더 끌려간다

    X = lambda x: 56 + 56.0 * x
    Y = lambda y: 142 - 8.2 * y
    out = ['<path d="M48 142 H360 M56 150 V28" stroke="#9CA3AF" stroke-width="1.2"/>']
    for ln, col, nm in ((('mse', a_mse, b_mse), '#BE123C', 'MSE'), (('mae', a_mae, b_mae), '#0E9384', 'MAE')):
        _, aa, bb = ln
        out.append('<path d="M%.1f %.1f L%.1f %.1f" stroke="%s" stroke-width="2.2"/>'
                   % (X(0.4), Y(aa * 0.4 + bb), X(5.6), Y(aa * 5.6 + bb), col))
    for x, y in DO:
        hot = (y == out_y)
        out.append('<circle cx="%.1f" cy="%.1f" r="%s" fill="%s"/>'
                   % (X(x), Y(y), '5.4' if hot else '4', '#B45309' if hot else '#111827'))
    out.append('<text x="%.1f" y="%.1f" font-size="10" font-weight="800" fill="#B45309" text-anchor="end"%s>이상치</text>'
               % (X(5) - 8, Y(out_y) + 4, HALO))
    out.append('<text x="368" y="44" font-size="10.5" font-weight="800" fill="#BE123C" text-anchor="end"%s>'
               'MSE 기울기 %.3f</text>' % (HALO, a_mse))
    out.append('<text x="368" y="62" font-size="10.5" font-weight="800" fill="#0B6E63" text-anchor="end"%s>'
               'MAE 기울기 %.3f</text>' % (HALO, a_mae))
    out.append('<text x="368" y="80" font-size="10" fill="#6B7280" text-anchor="end"%s>'
               '차 %.3f — 제곱이 큰 오차를 크게 센다</text>' % (HALO, abs(a_mse - a_mae)))
    out.append(cap('이상치 하나가 직선을 끌고 간다 — 무엇을 오차로 볼까'))
    return ''.join(out)


# ── 200 · 보폭을 얼마로 ────────────────────────────────────────────
def lr200():
    x0 = 3.5
    runs = ((0.08, '너무 작다 — 더디다', '#9CA3AF'), (0.6, '알맞다 — 바닥에 닿는다', '#0E9384'),
            (2.1, '너무 크다 — 멀어진다', '#BE123C'))
    paths = []
    for e, nm, col in runs:
        xs, x = [x0], x0
        for _ in range(9):
            x = x - e * x
            xs.append(x)
        paths.append((e, nm, col, xs))
    assert abs(paths[0][3][-1]) > 1.5                    # 작은 보폭은 아직 멀다
    assert abs(paths[1][3][-1]) < 0.02                   # 알맞으면 바닥
    assert abs(paths[2][3][-1]) > abs(x0)                # 큰 보폭은 더 멀어진다

    Lf = lambda x: 0.5 * x * x
    X = lambda x: 200 + 36.0 * x
    Y = lambda v: 140 - 11.0 * min(v, 10)
    out = ['<path d="%s" stroke="#C7D2E4" stroke-width="2.2" fill="none"/>'
           % curve(Lf, -4.4, 4.4, X, Y, 24, 144)]
    out.append('<path d="M44 140 H364" stroke="#9CA3AF" stroke-width="1.1"/>')
    for i, (e, nm, col, xs) in enumerate(paths):
        for k, x in enumerate(xs):
            if abs(x) > 4.4:
                break
            out.append('<circle cx="%.1f" cy="%.1f" r="3" fill="%s" opacity="%.2f"/>'
                       % (X(x), Y(Lf(x)), col, 0.35 + 0.65 * k / len(xs)))
        out.append('<text x="368" y="%d" font-size="10" font-weight="800" fill="%s" text-anchor="end"%s>'
                   'ε = %.2f — %s</text>' % (40 + i * 17, col, HALO, e, nm))
    out.append('<circle cx="%.1f" cy="%.1f" r="4.4" fill="#111827"/>' % (X(0), Y(0)))
    out.append('<text x="%.1f" y="156" font-size="10" fill="#6B7280" text-anchor="middle"%s>골짜기 바닥</text>'
               % (X(0), HALO))
    out.append('<text x="56" y="160" font-size="10" fill="#6B7280"%s>수렴 조건 0 &lt; ε &lt; 2</text>' % HALO)
    out.append(cap('내리막을 따라 내려갈 때 한 걸음을 얼마로 할까'))
    return ''.join(out)


FNS = [('jc191', jc191), ('ix192', ix192), ('rg193', rg193), ('tr194', tr194), ('mm195', mm195),
       ('hm196', hm196), ('dl197', dl197), ('lc198', lc198), ('ms199', ms199), ('lr200', lr200)]

if __name__ == '__main__':
    import sys
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass
    for nm, f in FNS:
        sys.stdout.write('%-7s %5d자  ok\n' % (nm, len(f())))
