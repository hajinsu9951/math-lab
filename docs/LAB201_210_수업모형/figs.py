# -*- coding: utf-8 -*-
"""LAB 201~210 「오늘의 문제」 그림 — 좌표를 계산해서 그린다.

경제·금융 묶음이다. 그림에 적히는 수는 모두 실험 화면과 같은 식으로 구해
assert 로 묶었다 — 화면과 그림이 다른 수를 말하면 거기서 멈춘다.
축에는 커지는 쪽 화살촉을 직접 달고 글씨에는 흰 테두리를 둘러,
docs/그림_다듬기/polish_figs.py 를 따로 돌리지 않아도 되게 했다
(그 도구는 두 번 돌리면 화살촉을 겹쳐 붙인다).
"""
from math import sqrt, exp, log

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
    """원점 (x0, y0) 에서 오른쪽 x1 · 위쪽 y1 으로 뻗는 두 축 + 화살촉."""
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
    return ('<rect x="%.1f" y="%.1f" width="%.1f" height="%.1f" fill="%s" fill-opacity="%s"'
            '%s/>' % (x, y, w, h, col, op,
                      ' stroke="%s" stroke-width="%s"' % (stroke, sw) if stroke else ''))


# ── 201 · 절편까지 배운다 ───────────────────────────────────────────
def bl201():
    D = [(1, 7.1), (2, 9.0), (3, 10.8), (4, 13.2), (5, 14.9)]
    n = len(D)
    sx, sy = sum(p[0] for p in D), sum(p[1] for p in D)
    sxy, sxx = sum(p[0] * p[1] for p in D), sum(p[0] ** 2 for p in D)
    bestA = sxy / sxx
    abA = (n * sxy - sx * sy) / (n * sxx - sx * sx)
    abB = (sy - abA * sx) / n
    loss = lambda a, b: sum((y - (a * x + b)) ** 2 for x, y in D)
    l0, l1 = loss(bestA, 0), loss(abA, abB)
    assert abs(bestA - 3.36) < 1e-9 and abs(abA - 1.98) < 1e-9 and abs(abB - 5.06) < 1e-9
    assert abs(l0 - 23.372) < 1e-9 and abs(l1 - 0.096) < 1e-9 and l0 > 200 * l1
    assert abs(abB - (sy / n - abA * sx / n)) < 1e-12      # 최적 직선은 평균점을 지난다

    X = lambda x: 60 + 46.6667 * x
    Y = lambda y: 150 - 6.6667 * y
    xe = 18.0 / bestA                                      # 원점직선이 윗변에 닿는 x
    out = [axes(60, 352, 150, 28)]
    out.append(poly([(X(0), Y(0)), (X(xe), Y(bestA * xe))], GREY, 2.0, dash=1))
    out.append(poly([(X(0), Y(abB)), (X(5.6), Y(abA * 5.6 + abB))], '#0E9384', 2.6))
    for x, y in D:                                         # 자료점과 원점직선의 어긋남
        out.append(poly([(X(x), Y(y)), (X(x), Y(bestA * x))], '#BE123C', 1.4, dash=1))
        out.append(dot(X(x), Y(y), 4.4, '#1D4ED8'))
    out.append(dot(X(0), Y(abB), 4.0, '#0B6E63'))
    out.append(txt(68, 36, '회색 점선 — 원점을 지나야만 할 때 · 손실 23.372', 10, '#BE123C', w=800))
    out.append(txt(68, 52, '초록 실선 — 절편 b 까지 맞출 때 · 손실 0.096', 10, '#0B6E63', w=800))
    out.append(txt(66, 108, 'b = 5.06', 10, '#0B6E63', w=800))
    out.append(txt(348, 162, 'x', 10, '#6B7280', anc='middle'))
    out.append(cap('원점이라는 족쇄 하나가 손실을 243배로 남긴다'))
    return ''.join(out)


# ── 202 · 자주 붙여도 못 넘는 천장 ──────────────────────────────────
def ap202():
    r = 0.12
    eff = lambda k: (1 + r / k) ** k - 1
    ceil_ = exp(r) - 1
    assert abs(eff(1) - 0.12) < 1e-12
    assert abs(eff(4) - 0.1255088) < 1e-6 and abs(eff(52) - 0.1273410) < 1e-6
    assert abs(ceil_ - 0.1274969) < 1e-6
    assert eff(1) < eff(4) < eff(12) < eff(52) < eff(365) < ceil_

    X = lambda k: 60 + 280 * log(k) / log(365)
    lo, hi = 0.1195, 0.1285
    Y = lambda v: 140 - 96 * (v - lo) / (hi - lo)
    out = [axes(60, 352, 150, 30)]
    out.append(poly([(60, Y(ceil_)), (344, Y(ceil_))], '#BE123C', 1.8, dash=1))
    out.append(poly([(X(365 ** (i / 200.0)), Y(eff(365 ** (i / 200.0)))) for i in range(201)],
                    '#2563EB', 2.6))
    for k in (1, 4, 12, 52, 365):
        out.append('<path d="M%.1f 150 V146" stroke="%s" stroke-width="1"/>' % (X(k), GREY))
        out.append(txt(X(k), 162, str(k), 9.5, '#6B7280', anc='middle'))
    out.append(dot(X(1), Y(eff(1)), 4.6, '#1D4ED8'))
    out.append(dot(X(52), Y(eff(52)), 4.6, '#BE123C'))
    out.append(txt(392, 46, '천장 = 12.750%', 10, '#BE123C', anc='end', w=800))
    out.append(txt(X(1) + 8, 128, '1번 붙이면 12.000%', 10, '#1D4ED8', w=800))
    out.append(txt(X(52), Y(eff(52)) + 20, '52번 붙여도 12.734%', 10, '#BE123C', anc='middle', w=800))
    out.append(txt(60, 146, '가로 = 1년에 이자 붙는 횟수 (로그 눈금)', 10, '#6B7280'))
    out.append(cap('횟수를 늘리면 커지지만, 넘지 못하는 천장이 있다'))
    return ''.join(out)


# ── 203 · 넘은 부분에만 ─────────────────────────────────────────────
def tx203():
    BR = [(1400, 0.06), (5000, 0.15), (8800, 0.24), (15000, 0.35)]

    def calc(inc):
        lo, tax, parts = 0, 0.0, []
        for hi, rate in BR:
            amt = max(0, min(inc, hi) - lo)
            if amt > 0:
                parts.append((amt, rate))
                tax += amt * rate
            lo = hi
            if inc <= hi:
                break
        return tax, parts

    t5100, parts = calc(5100)
    t5000, _ = calc(5000)
    assert [p[0] for p in parts] == [1400, 3600, 100]
    assert abs(t5100 - 648) < 1e-9 and abs(t5000 - 624) < 1e-9 and abs(t5100 - t5000 - 24) < 1e-9
    assert abs(t5100 / 5100 - 0.1270588) < 1e-6          # 실효세율 12.71%

    X = lambda v: 60 + 300 * v / 5100
    COL = ['#2563EB', '#0E9384', '#F59E0B']
    cuts = [0, 1400, 5000, 5100]
    out = []
    for i, (a, b) in enumerate(zip(cuts, cuts[1:])):
        out.append(rect(X(a), 48, X(b) - X(a), 28, COL[i], '.30', COL[i]))
    out.append(txt((X(0) + X(1400)) / 2, 66, '6%', 10.5, '#1D4ED8', anc='middle', w=800))
    out.append(txt((X(1400) + X(5000)) / 2, 66, '15%', 10.5, '#0B6E63', anc='middle', w=800))
    out.append(poly([(X(5050), 44), (X(5050) + 12, 37)], '#B45309', 1.2))
    out.append(txt(392, 34, '넘은 100만원 → 24%', 10, '#B45309', anc='end', w=800))
    out.append(txt(60, 92, '위 = 소득을 구간으로 자른 모습', 10, '#6B7280'))
    xa = 60.0
    for i, (amt, rate) in enumerate(parts):
        wdt = 300 * (amt * rate) / t5100
        out.append(rect(xa, 104, wdt, 26, COL[i], '.55', '#fff', 1))
        if wdt > 22:
            out.append(txt(xa + wdt / 2, 121, '%.0f' % (amt * rate), 10.5, '#111827',
                           anc='middle', w=800))
        xa += wdt
    assert abs(xa - 360) < 1e-6
    out.append(poly([(X(5050), 134), (X(5050) - 14, 141)], '#B45309', 1.2))
    out.append(txt(338, 150, '+24만원', 10, '#B45309', anc='end', w=800))
    out.append(txt(60, 150, '아래 = 구간마다 낸 세금 (합 648만원)', 10, '#6B7280'))
    out.append(cap('경계를 넘어도 높은 세율은 넘은 부분에만 붙는다'))
    return ''.join(out)


# ── 204 · 두 번 바꾸면 ──────────────────────────────────────────────
def fx204():
    kd, jd, fee = 1350.0, 150.0, 0.005
    usd = 1000000 / kd * (1 - fee)
    via = usd * jd * (1 - fee)
    cross = kd / jd
    direct = 1000000 / cross * (1 - fee)
    assert abs(cross - 9.0) < 1e-12
    assert round(via) == 110003 and round(direct) == 110556
    assert round(direct) - round(via) == 553
    assert abs(1000000 / kd * jd - 1000000 / cross) < 1e-6      # 수수료가 없으면 같은 값

    def node(x, y, lab, val, col):
        return (rect(x - 43, y - 17, 86, 34, col, '.85')
                + '<text x="%.1f" y="%.1f" font-size="11" font-weight="800" fill="#fff" '
                  'text-anchor="middle">%s</text>' % (x, y - 3, lab)
                + '<text x="%.1f" y="%.1f" font-size="10" fill="#fff" text-anchor="middle">%s</text>'
                  % (x, y + 11, val))

    def flow(x1, x2, y, t):
        return (poly([(x1, y), (x2 - 7, y)], GREY, 1.8) + head(x2, y, 1, 0)
                + txt((x1 + x2) / 2, y - 11, t, 10, '#6B7280', anc='middle'))

    out = [node(74, 58, '원', '100만원', '#2563EB'),
           node(200, 58, '달러', '%.2f$' % usd, '#0E9384'),
           node(326, 58, '엔', '%s¥' % format(round(via), ','), '#BE123C'),
           flow(119, 155, 58, '÷ 1350'), flow(245, 281, 58, '× 150'),
           node(74, 122, '원', '100만원', '#2563EB'),
           node(326, 122, '엔', '%s¥' % format(round(direct), ','), '#BE123C'),
           flow(119, 281, 122, '÷ 교차환율 9.0000')]
    out.append(txt(24, 92, '위 = 두 번 바꾸는 길 — 수수료를 두 번 낸다', 10, '#6B7280'))
    out.append(txt(24, 154, '아래 = 바로 바꾸는 길 — 한 번만 낸다', 10, '#6B7280'))
    out.append(txt(392, 154, '차이 553엔', 10.5, '#BE123C', anc='end', w=800))
    out.append(cap('손해의 정체는 환율이 아니라 수수료를 몇 번 내느냐'))
    return ''.join(out)


# ── 205 · 통장은 늘고 살 수 있는 양은 ───────────────────────────────
def cp205():
    inf, r, N = 0.03, 0.05, 10
    nom = lambda t: (1 + r) ** t
    real = lambda t: (1 + r) ** t / (1 + inf) ** t
    assert abs(nom(N) * 10000 - 16288.95) < 0.02
    assert abs(real(N) * 10000 - 12120.50) < 0.02
    assert 1 < real(N) < nom(N)

    X = lambda t: 60 + 290 * t / N
    lo, hi = 0.95, 1.70
    Y = lambda v: 146 - 110 * (v - lo) / (hi - lo)
    out = [axes(60, 352, 146, 32)]
    out.append(poly([(60, Y(1)), (344, Y(1))], '#C7D2E4', 1.4, dash=1))
    for f, col in ((nom, '#2563EB'), (real, '#0E9384')):
        out.append(poly([(X(N * i / 120.0), Y(f(N * i / 120.0))) for i in range(121)], col, 2.6))
    out.append(dot(X(N), Y(nom(N)), 4.6, '#1D4ED8'))
    out.append(dot(X(N), Y(real(N)), 4.6, '#0B6E63'))
    out.append(txt(392, 44, '통장 16,289원', 10, '#1D4ED8', anc='end', w=800))
    out.append(txt(392, 102, '살 수 있는 양 12,121원', 10, '#0B6E63', anc='end', w=800))
    out.append(txt(66, Y(1) - 6, '처음 1만원', 10, '#6B7280'))
    for t in (0, 5, 10):
        out.append(txt(X(t), 162, '%d년' % t, 9.5, '#6B7280', anc='middle'))
    out.append(cap('이자 5% · 물가 3% — 열 해가 지나면 두 선이 갈라진다'))
    return ''.join(out)


# ── 206 · 멀리 있는 돈은 깎인다 ─────────────────────────────────────
def pv206():
    F, r = 1000000.0, 0.05
    pv = lambda t: F / (1 + r) ** t
    assert round(pv(3)) == 863838 and round(pv(2)) == 907029
    assert pv(2) > 900000 > pv(3)                 # 90만원 선이 2년과 3년 사이를 지난다

    bw = 29.0
    Y = lambda v: 146 - 100 * v / F
    out = [axes(60, 356, 146, 40)]
    for t in range(1, 11):
        v = pv(t)
        x = 60 + bw * (t - 1)
        top = t == 3
        out.append(rect(x + 3, Y(v), bw - 6, Y(0) - Y(v),
                        '#BE123C' if top else '#2563EB', '.55' if top else '.28'))
        out.append(txt(x + bw / 2, 158, str(t), 9.5, '#6B7280', anc='middle'))
    out.append(poly([(60, Y(900000)), (350, Y(900000))], '#0E9384', 2.0, dash=1))
    out.append(txt(392, 52, '지금 받는 90만원', 10, '#0B6E63', anc='end', w=800))
    out.append(txt(60, 32, '3년 뒤 100만원 = 지금 863,838원', 10.5, '#BE123C', w=800))
    out.append(txt(60 + bw * 10 + 17, 158, '년 뒤', 9.5, '#6B7280', anc='middle'))
    out.append(cap('시점이 다른 돈은 같은 시점으로 옮겨야 견준다'))
    return ''.join(out)


# ── 207 · 가격은 두 선이 만나는 곳으로 ─────────────────────────────
def sd207():
    d = 3.0
    dem = lambda p: max(0.0, 60 - d * p)
    sup = lambda p: 4 * p
    eq = 60 / (d + 4)
    assert abs(eq - 60 / 7) < 1e-12 and abs(dem(eq) - sup(eq)) < 1e-9
    assert abs(dem(4) - 48) < 1e-9 and abs(sup(4) - 16) < 1e-9 and abs(dem(4) - sup(4) - 32) < 1e-9

    X = lambda q: 60 + 290 * q / 60
    Y = lambda p: 146 - 5 * p
    out = [axes(60, 356, 146, 40)]
    out.append(poly([(X(0), Y(20)), (X(60), Y(0))], '#2563EB', 2.6))
    out.append(poly([(X(0), Y(0)), (X(60), Y(15))], '#0E9384', 2.6))
    out.append(poly([(60, Y(4)), (350, Y(4))], '#BE123C', 1.8, dash=1))
    x1, x2 = X(sup(4)), X(dem(4))
    out.append(rect(x1, Y(4) - 9, x2 - x1, 18, '#F59E0B', '.30', '#F59E0B'))
    out.append(dot(X(eq), Y(eq), 5.2, '#111827'))
    out.append(txt(X(eq) + 9, Y(eq) - 5, '균형 8.571천원', 10, '#111827', w=800))
    out.append(txt(104, 56, '수요', 10.5, '#1D4ED8', w=800))
    out.append(txt(334, 72, '공급', 10.5, '#0B6E63', w=800))
    out.append(txt(66, 122, '가격 4', 10, '#BE123C', w=800))
    out.append(txt((x1 + x2) / 2, 130, '모자람 32', 10, '#B45309', anc='middle', w=800))
    out.append(txt(60, 34, '가격', 10, '#6B7280', anc='middle'))
    out.append(txt(356, 162, '수량', 10, '#6B7280', anc='middle'))
    out.append(cap('가격이 낮으면 사려는 양이 훨씬 많다 — 모자람이 생긴다'))
    return ''.join(out)


# ── 208 · 값을 올리면 더 벌까 ───────────────────────────────────────
def el208():
    s = 3.0
    rev = lambda p: p * max(0.0, 60 - s * p)
    best = 30 / s
    assert abs(best - 10) < 1e-12 and abs(rev(best) - 300) < 1e-9
    assert rev(9) < rev(10) > rev(11)
    assert abs((s * best) / (60 - s * best) - 1.0) < 1e-12     # 꼭짓점의 탄력성은 꼭 1

    bw, mx = 22.0, 320.0
    Y = lambda v: 142 - 100 * v / mx
    out = [axes(60, 356, 142, 40)]
    for p in range(1, 14):
        v = rev(p)
        x = 60 + bw * (p - 1)
        top = p == 10
        out.append(rect(x, Y(v), 18, Y(0) - Y(v),
                        '#BE123C' if top else '#2563EB', '.55' if top else '.26'))
        out.append(txt(x + 9, 156, str(p), 9.5, '#6B7280', anc='middle'))
    xt = 60 + bw * 9 + 9
    out.append(poly([(xt, Y(300) - 17), (xt, Y(300) - 6)], '#BE123C', 2.0))
    out.append(head(xt, Y(300) - 4, 0, 1, '#BE123C'))
    out.append(txt(200, 32, '매출이 가장 큰 가격 10천원 — 그 자리의 탄력성이 꼭 1',
                   10.5, '#BE123C', anc='middle', w=800))
    out.append(txt(60, 167, '가로 = 가격(천원) · 세로 = 매출 = 가격 × 판매량', 9.5, '#6B7280'))
    out.append(cap('값을 올릴수록 매출이 늘지는 않는다 — 꼭짓점이 있다'))
    return ''.join(out)


# ── 209 · 가격을 눌러도 ─────────────────────────────────────────────
def pc209():
    dem = lambda p: max(0.0, 60 - 3 * p)
    sup = lambda p: 4 * p
    EQ = 60 / 7
    assert abs(dem(EQ) - sup(EQ)) < 1e-9
    assert abs(dem(4) - sup(4) - 32) < 1e-9
    assert dem(14) < sup(14)                      # 균형보다 높은 상한은 아무 일도 하지 않는다

    X = lambda q: 60 + 290 * q / 60
    Y = lambda p: 146 - 5 * p
    out = [axes(60, 356, 146, 40)]
    out.append(poly([(X(0), Y(20)), (X(60), Y(0))], '#2563EB', 2.6))
    out.append(poly([(X(0), Y(0)), (X(60), Y(15))], '#0E9384', 2.6))
    out.append(poly([(60, Y(4)), (350, Y(4))], '#BE123C', 2.0, dash=1))
    x1, x2 = X(sup(4)), X(dem(4))
    out.append(rect(x1, Y(4) - 10, x2 - x1, 20, '#F59E0B', '.32', '#F59E0B', 1.4))
    out.append(poly([(x1 + 6, Y(4)), (x1 + 1, Y(4))], '#B45309', 1.6)
               + head(x1 - 1, Y(4), -1, 0, '#B45309'))
    out.append(poly([(x2 - 6, Y(4)), (x2 - 1, Y(4))], '#B45309', 1.6)
               + head(x2 + 1, Y(4), 1, 0, '#B45309'))
    out.append(dot(X(EQ), Y(EQ), 5.2, '#111827'))
    out.append(txt(X(EQ) + 9, Y(EQ) - 5, '규제 없을 때 균형 8.571', 10, '#111827', w=800))
    out.append(txt(104, 56, '수요', 10.5, '#1D4ED8', w=800))
    out.append(txt(334, 72, '공급', 10.5, '#0B6E63', w=800))
    out.append(txt(66, 122, '상한 4천원', 10, '#BE123C', w=800))
    out.append(txt((x1 + x2) / 2, 133, '부족분 32', 10.5, '#B45309', anc='middle', w=800))
    out.append(txt(60, 34, '가격', 10, '#6B7280', anc='middle'))
    out.append(txt(356, 162, '수량', 10, '#6B7280', anc='middle'))
    out.append(cap('가격을 눌러도 두 선은 움직이지 않는다 — 줄이 생긴다'))
    return ''.join(out)


# ── 210 · 하나를 고르면 하나를 잃는다 ───────────────────────────────
def oc210():
    fc = lambda u: (40 * sqrt(u), 30 * sqrt(1 - u))
    fl = lambda u: (40 * u, 30 * (1 - u))

    def step(f, t):
        c, n = f(t), f(min(1.0, t + 0.1))
        dx, dy = n[0] - c[0], c[1] - n[1]
        return c, n, dy / dx

    c1, n1, o1 = step(fc, 0.3)
    c2, n2, o2 = step(fc, 0.8)
    assert abs(o1 - 0.5494) < 1e-3 and abs(o2 - 1.8109) < 1e-3 and o2 > 3 * o1
    assert abs(step(fl, 0.3)[2] - 0.75) < 1e-12 and abs(step(fl, 0.7)[2] - 0.75) < 1e-12
    for u in (0.0, 0.25, 0.5, 0.75, 1.0):          # 곡선은 사분타원이다
        x, y = fc(u)
        assert abs((x / 40) ** 2 + (y / 30) ** 2 - 1) < 1e-12

    X = lambda x: 60 + 6.3636 * x
    Y = lambda y: 146 - 3.2353 * y
    curve = [(X(fc(i / 100.0)[0]), Y(fc(i / 100.0)[1])) for i in range(101)]
    out = [axes(60, 356, 146, 40)]
    out.append('<path d="%s L%.1f %.1f Z" fill="#2563EB" fill-opacity=".08" stroke="none"/>'
               % (' '.join('%s%.1f %.1f' % ('M' if i == 0 else 'L', p[0], p[1])
                           for i, p in enumerate(curve)), X(0), Y(0)))
    out.append(poly([(X(fl(i / 40.0)[0]), Y(fl(i / 40.0)[1])) for i in range(41)], GREY, 1.8, dash=1))
    out.append(poly(curve, '#2563EB', 2.6))
    for c, n, col in ((c1, n1, '#0E9384'), (c2, n2, '#BE123C')):
        out.append(poly([(X(c[0]), Y(c[1])), (X(n[0]), Y(c[1])), (X(n[0]), Y(n[1]))], col, 1.6, dash=1))
        out.append(dot(X(c[0]), Y(c[1]), 5.0, col))
    out.append(txt(X(n1[0]) + 9, Y(c1[1]) - 5, '기회비용 0.55', 10, '#0B6E63', w=800))
    out.append(txt(392, 116, '기회비용 1.81', 10, '#BE123C', anc='end', w=800))
    out.append(txt(392, 144, '직선이면 어디서나 0.75', 10, '#6B7280', anc='end'))
    out.append(txt(60, 34, '우유', 10, '#6B7280', anc='middle'))
    out.append(txt(356, 162, '빵', 10, '#6B7280', anc='middle'))
    out.append(cap('한쪽으로 몰수록 포기해야 할 양이 커진다'))
    return ''.join(out)


FNS = [('bl201', bl201), ('ap202', ap202), ('tx203', tx203), ('fx204', fx204), ('cp205', cp205),
       ('pv206', pv206), ('sd207', sd207), ('el208', el208), ('pc209', pc209), ('oc210', oc210)]

if __name__ == '__main__':
    import sys
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass
    for nm, f in FNS:
        sys.stdout.write('%-7s %5d자  ok\n' % (nm, len(f())))
