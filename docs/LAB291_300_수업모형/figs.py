# -*- coding: utf-8 -*-
"""LAB 291~300 「오늘의 문제」 그림 — 좌표를 계산해서 그린다.

이산수학과 그래프 묶음이다. 그림에 적는 수는 실험 화면과 같은 식으로 구해
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


# ── 291 · 평행선이 여럿인 세계 ──────────────────────────────────────
def hb291():
    """푸앵카레 원판 — 경계원에 수직인 원호가 「직선」이다."""
    P = (-0.3, 0.0)
    base = (1.6, 0.0)                                    # 기준 직선이 될 원호의 중심
    rb = sqrt(base[0] ** 2 + base[1] ** 2 - 1)
    cxs = 1.09 / (2 * -P[0]) * -1                        # 2 C·P = 1 + |P|² 에서 Cx
    cxs = (1 + P[0] * P[0]) / (2 * P[0])
    assert abs(cxs + 1.81667) < 1e-4, cxs
    ys = [-2.0, -1.5, 0.0, 1.5, 2.0]
    arcs = []
    for cy in ys:
        rho = sqrt(cxs * cxs + cy * cy - 1)
        d = hypot(cxs - base[0], cy - base[1])
        assert d > rho + rb, (cy, d, rho + rb)           # 기준 직선과 만나지 않는다
        arcs.append((cxs, cy, rho))
    cx, cy0, u = 96.0, 96.0, 58.0
    out = ['<circle cx="%.1f" cy="%.1f" r="%.1f" fill="#F8FAFC" stroke="#9CA3AF" '
           'stroke-width="1.4"/>' % (cx, cy0, u)]

    def arc(c0, c1, rho, col, w):
        pts = []
        for i in range(241):
            a = i * 2 * pi / 240
            x, y = c0 + rho * cos(a), c1 + rho * sin(a)
            if x * x + y * y < 0.995:
                pts.append((cx + x * u, cy0 - y * u))
            elif pts:
                out.append(poly(pts, col, w))
                pts = []
        if pts:
            out.append(poly(pts, col, w))

    arc(base[0], base[1], rb, '#2563EB', 2.0)
    for (c0, c1, rho) in arcs:
        arc(c0, c1, rho, '#BE123C', 1.4)
    out.append(dot(cx + P[0] * u, cy0 - P[1] * u, 3.6, '#111827'))
    out.append(txt(cx + P[0] * u - 7, cy0 + 4, 'P', 9.5, '#111827', anc='end', w=800))
    out.append(txt(cx + 34, 44, '기준 직선', 9.5, '#2563EB', w=800))
    out.append(txt(14, 163, '원판의 경계에 수직인 원호가 이 세계의 「직선」이다', 9.5, '#6B7280'))
    out.append(txt(206, 48, 'P 를 지나면서', 10, '#111827', w=800))
    out.append(txt(206, 66, '기준 직선과 만나지 않는 직선', 10, '#BE123C', w=800))
    out.append(txt(206, 92, '유클리드에서는  1 개', 10.5, '#6B7280', w=800))
    out.append(txt(206, 114, '여기서는  %d 개 (얼마든지)' % len(arcs), 10.5, '#BE123C', w=800))
    out.append(txt(206, 136, '평행선 공준만 바꾸었을 뿐인데', 9.5, '#6B7280'))
    out.append(txt(206, 150, '다른 기하가 열린다', 9.5, '#6B7280'))
    out.append(cap('평행선이 하나뿐이어야 할까'))
    return ''.join(out)


# ── 292 · 스위치 두 개로 전등을 ─────────────────────────────────────
def tt292():
    rows = [(0, 0), (0, 1), (1, 0), (1, 1)]
    gates = [('AND', lambda a, b: a and b), ('OR', lambda a, b: a or b),
             ('XOR', lambda a, b: a != b), ('NAND', lambda a, b: not (a and b))]
    ons = [sum(1 for a, b in rows if f(bool(a), bool(b))) for _, f in gates]
    assert ons == [1, 3, 2, 3], ons
    out = [txt(26, 44, 'A', 10, '#111827', anc='middle', w=800),
           txt(52, 44, 'B', 10, '#111827', anc='middle', w=800)]
    for j, (nm, f) in enumerate(gates):
        x = 92.0 + j * 54.0
        out.append(txt(x, 44, nm, 10, '#2563EB', anc='middle', w=800))
    for i, (a, b) in enumerate(rows):
        y = 66.0 + i * 22.0
        out.append(txt(26, y, str(a), 9.5, '#6B7280', anc='middle'))
        out.append(txt(52, y, str(b), 9.5, '#6B7280', anc='middle'))
        for j, (nm, f) in enumerate(gates):
            x = 92.0 + j * 54.0
            on = f(bool(a), bool(b))
            out.append('<circle cx="%.1f" cy="%.1f" r="6" fill="%s" fill-opacity="%s" '
                       'stroke="%s" stroke-width="1.2"/>'
                       % (x, y - 3.5, '#FACC15' if on else '#FFFFFF',
                          '.95' if on else '1', '#B45309' if on else '#9CA3AF'))
    out.append(poly([(14, 52), (386, 52)], GREY, 1.0))
    out.append(poly([(70, 36), (70, 158)], GREY, 1.0))
    for j, n in enumerate(ons):
        out.append(txt(92.0 + j * 54.0, 170, '', 9, GREY))
    out.append(txt(14, 163, '켜지는 줄의 수  AND %d · OR %d · XOR %d · NAND %d' % tuple(ons),
                   9.5, '#111827', w=800))
    out.append(cap('스위치 둘로 전등을 어떻게 켤까'))
    return ''.join(out)


# ── 293 · 둘 다는 아니다 vs 둘 다 아니다 ────────────────────────────
def dg293():
    #                     없음  A만   B만   둘다
    reg = {'nAuB': (1, 0, 0, 0), 'nAnB': (1, 1, 1, 0),
           'nA_and_nB': (1, 0, 0, 0), 'nA_or_nB': (1, 1, 1, 0)}
    same = sum(1 for p, q in zip(reg['nAuB'], reg['nA_and_nB']) if p != q)
    diff = sum(1 for p, q in zip(reg['nAuB'], reg['nA_or_nB']) if p != q)
    assert same == 0 and diff == 2, (same, diff)
    out = []
    for k, (lab, key, col) in enumerate([("(A∪B)′ 와 A′∩B′", 'nA_and_nB', '#0E9384'),
                                         ("(A∪B)′ 와 A′∪B′", 'nA_or_nB', '#BE123C')]):
        ox, oy, r = 96.0 + k * 196.0, 104.0, 30.0
        on = reg[key]
        out.append(rect(ox - 70, oy - 44, 140, 88, '#111827', '.05', stroke='#9CA3AF', sw=1.0))
        if on[1]:                                        # A 만
            out.append('<circle cx="%.1f" cy="%.1f" r="%.1f" fill="#BE123C" fill-opacity=".22" '
                       'stroke="none"/>' % (ox - 16, oy, r))
        if on[2]:
            out.append('<circle cx="%.1f" cy="%.1f" r="%.1f" fill="#BE123C" fill-opacity=".22" '
                       'stroke="none"/>' % (ox + 16, oy, r))
        out.append('<circle cx="%.1f" cy="%.1f" r="%.1f" fill="none" stroke="#2563EB" '
                   'stroke-width="1.4"/>' % (ox - 16, oy, r))
        out.append('<circle cx="%.1f" cy="%.1f" r="%.1f" fill="none" stroke="#2563EB" '
                   'stroke-width="1.4"/>' % (ox + 16, oy, r))
        out.append(txt(ox - 36, oy - 22, 'A', 9.5, '#2563EB', w=800))
        out.append(txt(ox + 30, oy - 22, 'B', 9.5, '#2563EB', w=800))
        out.append(txt(ox, 44, lab, 10, col, anc='middle', w=800))
        n = same if k == 0 else diff
        out.append(txt(ox, 162, ('어긋난 구역 %d — 같다' % n) if n == 0 else
                       ('어긋난 구역 %d — 다르다' % n), 10, col, anc='middle', w=800))
    out.append(txt(200, 128, '바깥만', 9, '#6B7280', anc='middle'))
    out.append(cap('부정을 분배하면 기호는 어떻게 바뀔까'))
    return ''.join(out)


# ── 294 · 겹친 사람을 몇 번 셀까 ────────────────────────────────────
def ie294():
    NA, NB, NC = 40, 35, 30
    ab, bc, ca, abc = 8, 6, 5, 3
    naive = NA + NB + NC
    correct = naive - ab - bc - ca + abc
    assert naive == 105 and correct == 89, (naive, correct)
    cx, cy, r = 100.0, 96.0, 36.0
    cs = [(cx - 24, cy - 12), (cx + 24, cy - 12), (cx, cy + 26)]
    cols = ['#2563EB', '#0E9384', '#B45309']
    out = []
    for (px, py), col in zip(cs, cols):
        out.append('<circle cx="%.1f" cy="%.1f" r="%.1f" fill="%s" fill-opacity=".16" '
                   'stroke="%s" stroke-width="1.4"/>' % (px, py, r, col, col))
    out.append(txt(cs[0][0] - 26, cs[0][1] - 24, '가 %d' % NA, 9.5, '#2563EB', w=800))
    out.append(txt(cs[1][0] + 26, cs[1][1] - 24, '나 %d' % NB, 9.5, '#0E9384', anc='end', w=800))
    out.append(txt(cs[2][0] - 44, cs[2][1] + 12, '다 %d' % NC, 9.5, '#B45309', anc='end', w=800))
    out.append(txt(cx, cy - 16, str(ab), 9, '#111827', anc='middle', w=800))
    out.append(txt(cx + 16, cy + 12, str(bc), 9, '#111827', anc='middle', w=800))
    out.append(txt(cx - 16, cy + 12, str(ca), 9, '#111827', anc='middle', w=800))
    out.append(txt(cx, cy + 4, str(abc), 9.5, '#BE123C', anc='middle', w=800))
    out.append(txt(14, 163, '겹친 자리의 수 — 두 곳에 든 사람과 세 곳에 모두 든 사람', 9.5, '#6B7280'))
    out.append(txt(210, 48, '그냥 더하면  %d 명' % naive, 10.5, '#BE123C', w=800))
    out.append(txt(210, 70, '두 겹침을 빼고  −%d' % (ab + bc + ca), 10, '#6B7280'))
    out.append(txt(210, 88, '세 겹침을 다시 더해  +%d' % abc, 10, '#6B7280'))
    out.append(txt(210, 112, '정확한 값  %d 명' % correct, 11.5, '#0E9384', w=800))
    out.append(txt(210, 138, '%d − %d = %d 명을' % (naive, correct, naive - correct),
                   9.5, '#111827', w=800))
    out.append(txt(210, 154, '두 번 세고 있었다', 9.5, '#111827', w=800))
    out.append(cap('겹친 사람을 몇 번 세고 있을까'))
    return ''.join(out)


# ── 295 · 반드시 겹친다 ─────────────────────────────────────────────
def ph295():
    n, k = 7, 5
    g = -(-n // k)                                       # 천장 나눗셈
    assert g == 2
    out = []
    bw, bh = 46.0, 34.0
    for i in range(k):
        x = 24.0 + i * (bw + 10)
        out.append(rect(x, 98, bw, bh, '#2563EB', '.08', stroke='#2563EB', sw=1.3))
    put = [2, 1, 2, 1, 1]
    assert sum(put) == n and max(put) >= g
    for i, c in enumerate(put):
        x = 24.0 + i * (bw + 10)
        for j in range(c):
            out.append(dot(x + bw / 2 + (j - (c - 1) / 2) * 14, 115, 5.4,
                           '#BE123C' if c >= 2 else '#0E9384'))
    out.append(txt(24, 86, '물건 %d 개 · 상자 %d 칸' % (n, k), 10, '#111827', w=800))
    out.append(txt(24, 152, '어떻게 넣어도 붉은 칸처럼 두 개가 든 칸이 반드시 생긴다',
                   9.5, '#6B7280'))
    out.append(txt(292, 48, '보장값', 10, '#6B7280'))
    out.append(txt(292, 70, '⌈%d ÷ %d⌉ = %d' % (n, k, g), 12, '#BE123C', w=800))
    out.append(txt(292, 96, '물건이 12 개라면', 9.5, '#6B7280'))
    out.append(txt(292, 114, '⌈12 ÷ 5⌉ = %d' % (-(-12 // 5)), 10.5, '#BE123C', w=800))
    out.append(cap('반드시 겹치는 칸이 생길까'))
    return ''.join(out)


# ── 296 · 원반 하나에 두 배씩 ───────────────────────────────────────
def hn296():
    rows = [(3, 2 ** 3 - 1), (10, 2 ** 10 - 1), (20, 2 ** 20 - 1), (64, 2 ** 64 - 1)]
    assert rows[-1][1] == 18446744073709551615
    years = rows[-1][1] / 86400 / 365.25
    assert 5.8e11 < years < 5.9e11, years
    out = []
    for i, (x, h) in enumerate([(30, 3), (30, 2), (30, 1)]):
        pass
    bx, by = 86.0, 136.0                                 # 원반 셋이 쌓인 기둥
    for i, w in enumerate((44, 32, 20)):
        out.append(rect(bx - w / 2, by - 14 * (i + 1), w, 11, '#2563EB', '.45',
                        stroke='#2563EB', sw=1.0))
    out.append(poly([(bx, by + 2), (bx, by - 54)], '#9CA3AF', 2.0))
    for dx in (-56, 56):
        out.append(poly([(bx + dx, by + 2), (bx + dx, by - 54)], '#9CA3AF', 2.0))
    out.append(poly([(bx - 76, by + 3), (bx + 76, by + 3)], '#6B7280', 2.0))
    out.append(txt(bx, 44, '원반 3 개 → 최소 %d 번' % rows[0][1], 10, '#111827',
                   anc='middle', w=800))
    out.append(txt(14, 163, '원반이 하나 늘 때마다 횟수는 두 배 + 1 이 된다', 9.5, '#6B7280'))
    out.append(txt(206, 46, '원반 수', 9.5, '#6B7280'))
    out.append(txt(286, 46, '최소 횟수', 9.5, '#6B7280'))
    for i, (nn, h) in enumerate(rows):
        y = 68.0 + i * 20.0
        out.append(txt(206, y, '%d 개' % nn, 9.5, '#111827'))
        s = '{:,}'.format(h) if h < 10 ** 7 else '1.84 × 10¹⁹'
        out.append(txt(386, y, s, 9.5, '#BE123C' if nn == 64 else '#111827', anc='end',
                       w=800 if nn == 64 else None))
    out.append(txt(206, 150, '1 초에 하나씩 옮겨도 %.0f 억 년' % (years / 1e8), 9.5,
                   '#BE123C', w=800))
    out.append(cap('원반이 하나 늘면 얼마나 더 걸릴까'))
    return ''.join(out)


# ── 297 · 한 번에 그릴 수 있을까 ────────────────────────────────────
ENV_V = [(-1.2, -0.9), (1.2, -0.9), (1.2, 0.5), (-1.2, 0.5), (0.0, 1.3)]
ENV_E = [(0, 1), (1, 2), (2, 3), (3, 0), (0, 2), (1, 3), (3, 4), (4, 2)]
K4_V = [(0.0, 1.2), (-1.1, -0.6), (1.1, -0.6), (0.0, -0.1)]
K4_E = [(0, 1), (0, 2), (0, 3), (1, 2), (1, 3), (2, 3)]


def _deg(nv, E):
    d = [0] * nv
    for a, b in E:
        d[a] += 1
        d[b] += 1
    return d


def ep297():
    de = _deg(len(ENV_V), ENV_E)
    dk = _deg(len(K4_V), K4_E)
    odd_e = sum(1 for x in de if x % 2)
    odd_k = sum(1 for x in dk if x % 2)
    assert odd_e == 2 and odd_k == 4, (de, dk)
    out = []
    for k, (V, E, dg, odd, lab, col) in enumerate(
            [(ENV_V, ENV_E, de, odd_e, '홀수 점 2 개 — 한 번에 그릴 수 있다', '#0E9384'),
             (K4_V, K4_E, dk, odd_k, '홀수 점 4 개 — 그릴 수 없다', '#BE123C')]):
        ox, oy, u = 92.0 + k * 196.0, 100.0, 36.0
        for a, b in E:
            out.append(poly([(ox + V[a][0] * u, oy - V[a][1] * u),
                             (ox + V[b][0] * u, oy - V[b][1] * u)], '#2563EB', 1.4))
        for i, (vx, vy) in enumerate(V):
            out.append(dot(ox + vx * u, oy - vy * u, 4.0,
                           '#BE123C' if dg[i] % 2 else '#0E9384'))
        out.append(txt(ox, 44, lab, 9.5, col, anc='middle', w=800))
    out.append(txt(14, 163, '붉은 점 = 만나는 선이 홀수 개인 꼭짓점', 9.5, '#6B7280'))
    out.append(cap('한 번에 이어서 그릴 수 있을까'))
    return ''.join(out)


# ── 298 · 같은 것을 두 방법으로 세기 ────────────────────────────────
HS_V = [(0.0, 1.2), (-1.05, 0.55), (-1.05, -0.6), (0.0, -1.2), (1.05, -0.6), (1.05, 0.55)]
HS_E = [(0, 1), (0, 5), (1, 2), (2, 3), (3, 4), (4, 5), (0, 3)]


def hs298():
    dg = _deg(len(HS_V), HS_E)
    s = sum(dg)
    assert s == 2 * len(HS_E), (s, len(HS_E))
    odd = sum(1 for x in dg if x % 2)
    assert odd % 2 == 0
    ox, oy, u = 104.0, 98.0, 46.0
    out = []
    for a, b in HS_E:
        out.append(poly([(ox + HS_V[a][0] * u, oy - HS_V[a][1] * u),
                         (ox + HS_V[b][0] * u, oy - HS_V[b][1] * u)], '#0E9384', 1.6))
    for i, (vx, vy) in enumerate(HS_V):
        px, py = ox + vx * u, oy - vy * u
        out.append(dot(px, py, 4.6, '#2563EB'))
        out.append(txt(px + (10 if vx >= 0 else -10), py + (4 if vy > -1 else -9),
                       str(dg[i]), 9.5, '#111827', anc='start' if vx >= 0 else 'end', w=800))
    out.append(txt(14, 163, '점 옆의 수 = 그 사람이 악수한 횟수(차수)', 9.5, '#6B7280'))
    out.append(txt(210, 50, '악수 횟수 = %d 번' % len(HS_E), 10.5, '#0E9384', w=800))
    out.append(txt(210, 74, '차수를 모두 더하면 %d' % s, 10.5, '#2563EB', w=800))
    out.append(txt(210, 98, '%d = 2 × %d' % (s, len(HS_E)), 11.5, '#111827', w=800))
    out.append(txt(210, 126, '악수 한 번이 두 사람의', 9.5, '#6B7280'))
    out.append(txt(210, 142, '차수를 하나씩 올리기 때문', 9.5, '#6B7280'))
    out.append(txt(210, 160, '→ 홀수인 사람은 짝수 명 (%d 명)' % odd, 9.5, '#BE123C', w=800))
    out.append(cap('같은 것을 두 가지 방법으로 세면'))
    return ''.join(out)


# ── 299 · 모든 마을을 가장 싸게 ─────────────────────────────────────
MST_V = [(-1.4, 0.9), (0.0, 1.3), (1.4, 0.9), (-1.1, -0.7), (0.3, -1.2), (1.5, -0.4)]
MST_E = [(0, 1, 3), (1, 2, 4), (0, 2, 5), (3, 4, 6), (0, 3, 7), (4, 5, 8),
         (2, 5, 9), (1, 4, 11), (3, 5, 12)]


def mt299():
    parent = list(range(len(MST_V)))

    def find(x):
        while parent[x] != x:
            parent[x] = parent[parent[x]]
            x = parent[x]
        return x

    chosen, cost = [], 0
    for a, b, w in sorted(MST_E, key=lambda e: e[2]):
        ra, rb = find(a), find(b)
        if ra != rb:
            parent[ra] = rb
            chosen.append((a, b, w))
            cost += w
    assert len(chosen) == len(MST_V) - 1 and cost == 28, (chosen, cost)
    ox, oy, u = 104.0, 96.0, 44.0
    out = []
    pick = {(a, b) for a, b, _ in chosen}
    for a, b, w in MST_E:
        p, q = (ox + MST_V[a][0] * u, oy - MST_V[a][1] * u), (ox + MST_V[b][0] * u,
                                                              oy - MST_V[b][1] * u)
        on = (a, b) in pick
        out.append(poly([p, q], '#0E9384' if on else '#D1D5DB', 2.4 if on else 1.1,
                        dash=None if on else 1))
        out.append(txt((p[0] + q[0]) / 2, (p[1] + q[1]) / 2 - 2, str(w), 8.5,
                       '#0E9384' if on else '#9CA3AF', anc='middle', w=800 if on else None))
    for vx, vy in MST_V:
        out.append(dot(ox + vx * u, oy - vy * u, 4.4, '#2563EB'))
    out.append(txt(14, 163, '초록 = 고른 길 · 회색 점선 = 고르지 않은 길', 9.5, '#6B7280'))
    out.append(txt(216, 50, '마을 %d 개' % len(MST_V), 10, '#6B7280'))
    out.append(txt(216, 72, '고른 길 %d 개' % len(chosen), 10.5, '#0E9384', w=800))
    out.append(txt(216, 94, '모두 잇는 가장 싼 비용', 10, '#6B7280'))
    out.append(txt(216, 116, '%d' % cost, 13, '#0E9384', w=800))
    out.append(txt(216, 142, '싼 길부터 고르되', 9.5, '#111827', w=800))
    out.append(txt(216, 158, '고리가 생기면 건너뛴다', 9.5, '#111827', w=800))
    out.append(cap('모든 마을을 가장 싸게 이으려면'))
    return ''.join(out)


# ── 300 · 큐냐 스택이냐 ─────────────────────────────────────────────
def bd300():
    """작은 미로에서 너비 우선과 깊이 우선이 찾는 길의 길이를 직접 센다."""
    grid = ['.....',
            '.###.',
            '.....',
            '.###.',
            '.....']
    H, W = len(grid), len(grid[0])
    start, goal = (0, 0), (4, 4)

    def nbrs(p):
        for dr, dc in ((0, 1), (1, 0), (0, -1), (-1, 0)):
            r, c = p[0] + dr, p[1] + dc
            if 0 <= r < H and 0 <= c < W and grid[r][c] == '.':
                yield (r, c)

    def run(mode):
        seen, order, prev = {start}, [start], {}
        bag = [start]
        while bag:
            cur = bag.pop(0) if mode == 'bfs' else bag.pop()
            if cur == goal:
                break
            for nb in nbrs(cur):
                if nb not in seen:
                    seen.add(nb)
                    prev[nb] = cur
                    order.append(nb)
                    bag.append(nb)
        path, cur = [goal], goal
        while cur != start:
            cur = prev[cur]
            path.append(cur)
        return order, path[::-1]

    ob, pb = run('bfs')
    od, pd = run('dfs')
    assert len(pb) - 1 == 8, len(pb) - 1
    assert len(pd) - 1 >= len(pb) - 1
    out = []
    for k, (nm, order, path, col) in enumerate(
            [('너비 우선 (큐)', ob, pb, '#0E9384'), ('깊이 우선 (스택)', od, pd, '#B45309')]):
        ox, oy, s = 40.0 + k * 196.0, 56.0, 20.0
        for r in range(H):
            for c in range(W):
                x, y = ox + c * s, oy + r * s
                wall = grid[r][c] == '#'
                out.append(rect(x, y, s - 2, s - 2, '#111827' if wall else '#2563EB',
                                '.55' if wall else ('.16' if (r, c) in order else '.04'),
                                stroke='#E5E7EB', sw=0.6))
        for (r, c) in path:
            out.append(dot(ox + c * s + (s - 2) / 2, oy + r * s + (s - 2) / 2, 3.4, col))
        out.append(txt(ox + 2 * s, 46, nm, 9.5, col, anc='middle', w=800))
        out.append(txt(ox + 2 * s, 170, '', 9, GREY))
        out.append(txt(ox - 4, 166, '살펴본 칸 %d · 길이 %d' % (len(order), len(path) - 1),
                       9.5, col, w=800))
    out.append(cap('어느 쪽부터 살펴보느냐가 길을 바꾼다'))
    return ''.join(out)


FNS = [('hb291', hb291), ('tt292', tt292), ('dg293', dg293), ('ie294', ie294), ('ph295', ph295),
       ('hn296', hn296), ('ep297', ep297), ('hs298', hs298), ('mt299', mt299), ('bd300', bd300)]

if __name__ == '__main__':
    import sys
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass
    for nm, f in FNS:
        sys.stdout.write('%-7s %5d자  ok\n' % (nm, len(f())))
