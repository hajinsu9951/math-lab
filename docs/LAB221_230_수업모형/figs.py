# -*- coding: utf-8 -*-
"""LAB 221~230 「오늘의 문제」 그림 — 좌표를 계산해서 그린다.

현장의 셈 묶음이다. 그림에 적는 수는 실험 화면과 같은 식으로 구해 assert 로 묶었다.
축 화살촉과 글씨 흰 테두리는 여기서 직접 넣는다.
"""
from math import sqrt, exp, log, pi, tan, cos, sin, radians, erf

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


def area(pts, col, op='.12'):
    d = ' '.join('%s%.1f %.1f' % ('M' if i == 0 else 'L', p[0], p[1]) for i, p in enumerate(pts))
    return '<path d="%s Z" fill="%s" fill-opacity="%s" stroke="none"/>' % (d, col, op)


def dot(x, y, r=5.0, col='#111827'):
    return '<circle cx="%.1f" cy="%.1f" r="%.1f" fill="%s"/>' % (x, y, r, col)


def rect(x, y, w, h, col, op='.30', stroke=None, sw=1.2):
    return ('<rect x="%.1f" y="%.1f" width="%.1f" height="%.1f" fill="%s" fill-opacity="%s"%s/>'
            % (x, y, w, h, col, op,
               ' stroke="%s" stroke-width="%s"' % (stroke, sw) if stroke else ''))


# ── 221 · 어디까지가 아는 값일까 ────────────────────────────────────
def sf221():
    a, b = 12.34, 7.89
    exact = a * b
    rd = lambda v, st: round(v / st) * st
    r1 = rd(a, 1) * rd(b, 1)
    r2 = rd(a, 0.1) * rd(b, 0.1)
    assert abs(exact - 97.3626) < 1e-9
    assert abs(r1 - 96) < 1e-9 and abs(abs(r1 - exact) / exact * 100 - 1.3995) < 1e-3
    assert abs(r2 - 97.17) < 1e-9
    assert abs((1.005 * 1.005 - 1) * 100 - 1.0025) < 1e-4      # 길이 0.5% → 넓이 약 1%

    x0, y0, W = 80.0, 44.0, 138.0
    H = W * b / a                                               # 12.34 : 7.89 비를 그대로
    assert abs(W / H - a / b) < 1e-9
    d = 6.0                                                     # 모르는 자리의 폭
    out = [rect(x0, y0, W, H, '#2563EB', '.22', '#1D4ED8')]
    out.append(rect(x0 + W, y0, d, H, '#BE123C', '.34', '#BE123C', 1))
    out.append(rect(x0, y0 + H, W + d, d, '#BE123C', '.34', '#BE123C', 1))
    out.append(txt(x0 + W / 2, y0 + H / 2 + 4, '넓이', 11, '#1D4ED8', anc='middle', w=800))
    out.append(txt(x0 + W / 2, y0 - 6, '가로 12.3 ± 0.05', 10, '#6B7280', anc='middle'))
    out.append(txt(x0 - 6, y0 + H / 2 - 4, '세로 7.9', 10, '#6B7280', anc='end'))
    out.append(txt(x0 - 6, y0 + H / 2 + 10, '± 0.05', 10, '#6B7280', anc='end'))
    out.append(txt(240, 60, '붉은 띠 둘 = 넓이의 오차', 10, '#BE123C', w=800))
    out.append(txt(240, 78, '가로에서 한 번', 10, '#6B7280'))
    out.append(txt(240, 94, '세로에서 또 한 번', 10, '#6B7280'))
    out.append(txt(60, 152, '눈금 1 cm 로 읽으면 12 × 8 = 96.0000 — 오차 1.40%', 10, '#BE123C', w=800))
    out.append(txt(60, 166, '눈금 0.01 cm 로 읽으면 12.34 × 7.89 = 97.3626 — 오차 0.00%',
                   10, '#0B6E63', w=800))
    out.append(cap('길이를 0.5% 틀리면 넓이는 약 1% 틀린다'))
    return ''.join(out)


# ── 222 · 평균의 평균은 평균이 아니다 ──────────────────────────────
def wm222():
    n1, n2, v1, v2 = 10, 25, 90, 60
    wt = (v1 * n1 + v2 * n2) / (n1 + n2)
    sp = (v1 + v2) / 2
    assert abs(wt - 68.5714285714) < 1e-9 and abs(sp - 75) < 1e-12
    assert abs((wt - v2) * (n1 + n2) - (v1 - v2) * n1) < 1e-9   # 지렛대 — 거리 비가 인원 비의 반대

    X = lambda v: 60 + 290 * (v - 55) / 40
    base = 118.0
    out = [poly([(60, base), (350, base)], GREY, 1.4)]
    for v in (60, 70, 80, 90):
        out.append(poly([(X(v), base), (X(v), base + 5)], GREY, 1.0))
        out.append(txt(X(v), base + 17, str(v), 9.5, '#6B7280', anc='middle'))
    for v, n, col, lab in ((v2, n2, '#0E9384', 'B 25명 60점'), (v1, n1, '#2563EB', 'A 10명 90점')):
        w = 2.2 * n
        out.append(rect(X(v) - w / 2, base - 10 - 2.0 * n, w, 2.0 * n, col, '.34', col))
        out.append(txt(X(v), base - 16 - 2.0 * n, lab, 10, col, anc='middle', w=800))
    out.append(poly([(X(wt), base - 4), (X(wt) - 8, base + 14), (X(wt) + 8, base + 14)],
                    '#BE123C', 1.8, fill='#BE123C'))
    out.append(poly([(X(sp), base - 4), (X(sp), base + 14)], '#B45309', 1.8, dash=1))
    out.append(txt(X(wt) - 10, 150, '가중평균 68.571', 10.5, '#BE123C', anc='end', w=800))
    out.append(txt(X(sp) + 10, 150, '그냥 평균 75', 10.5, '#B45309', w=800))
    out.append(txt(60, 42, '받침은 인원이 많은 쪽으로 끌려간다 — 거리 비는 인원 비의 반대',
                   10, '#6B7280'))
    out.append(cap('인원이 다르면 평균의 평균은 평균이 아니다'))
    return ''.join(out)


# ── 223 · 사람을 두 배로 하면 절반일까 ─────────────────────────────
def md223():
    Wk, l = 60.0, 0.10
    ideal = lambda n: Wk / n
    real = lambda n: Wk / (n * (1 - l) ** (n - 1))
    best = min(range(1, 21), key=lambda n: real(n))
    assert best == 9 and abs(real(9) - 15.4870) < 1e-3 and abs(real(10) - real(9)) < 1e-3
    assert real(20) > real(best) and abs(ideal(20) - 3) < 1e-12
    assert abs(ideal(1) - real(1)) < 1e-12                      # 혼자면 손실이 없다

    X = lambda n: 60 + 290 * (n - 1) / 19
    Y = lambda t: 146 - 106 * t / 62
    out = [axes(60, 356, 146, 30)]
    out.append(poly([(X(n), Y(ideal(n))) for n in range(1, 21)], '#9CA3AF', 1.8, dash=1))
    out.append(poly([(X(n), Y(real(n))) for n in range(1, 21)], '#2563EB', 2.6))
    out.append(dot(X(best), Y(real(best)), 5.2, '#BE123C'))
    out.append(poly([(X(best), 146), (X(best), Y(real(best)))], '#BE123C', 1.4, dash=1))
    out.append(txt(X(best) + 9, Y(real(best)) - 6, '9~10명이 가장 빠르다 — 더 넣으면 느려진다',
                   10, '#BE123C', w=800))
    out.append(txt(348, Y(ideal(20)) - 10, '이상 — 인원에 반비례', 10, '#6B7280', anc='end'))
    out.append(txt(66, 44, '손실 10% — 사람이 늘수록 서로 맞추는 시간이 는다', 10, '#1D4ED8', w=800))
    out.append(txt(X(1), 162, '1명', 9.5, '#6B7280', anc='middle'))
    out.append(txt(X(20), 162, '20명', 9.5, '#6B7280', anc='middle'))
    out.append(txt(74, 30, '걸리는 시간', 10, '#6B7280'))
    out.append(cap('사람을 두 배로 넣어도 시간이 절반이 되지는 않는다'))
    return ''.join(out)


# ── 224 · 언제 공정을 멈출까 ────────────────────────────────────────
def qc224():
    p, n = 0.05, 500
    mu = n * p
    sd = sqrt(n * p * (1 - p))
    ucl, lcl = mu + 3 * sd, max(0.0, mu - 3 * sd)
    assert abs(mu - 25) < 1e-12 and abs(sd - 4.8734) < 1e-3
    assert abs(ucl - 39.6202) < 1e-3 and abs(lcl - 10.3798) < 1e-3
    assert n * p * 2.2 > ucl                                    # 나빠지면 상한을 넘는다

    s = 20250410                                                # 그림이 늘 같도록 고정한 난수
    def rnd():
        nonlocal s
        s = (s * 1103515245 + 12345) % 2147483648
        return s / 2147483648.0

    data = []
    for d in range(30):
        m = mu * 2.2 if d >= 18 else mu
        v = m + (rnd() + rnd() + rnd() - 1.5) * sd * 1.6        # 대략 정규 모양
        data.append(max(0.0, v))
    assert sum(1 for d, v in enumerate(data) if d < 18 and v > ucl) == 0
    assert sum(1 for d, v in enumerate(data) if d >= 18 and v > ucl) >= 8

    X = lambda d: 60 + 290 * d / 29
    Y = lambda v: 146 - 106 * v / 70
    out = [axes(60, 356, 146, 30)]
    out.append(poly([(60, Y(ucl)), (350, Y(ucl))], '#BE123C', 1.6, dash=1))
    out.append(poly([(60, Y(lcl)), (350, Y(lcl))], '#BE123C', 1.6, dash=1))
    out.append(poly([(60, Y(mu)), (350, Y(mu))], '#0E9384', 1.6))
    out.append(poly([(X(d), Y(v)) for d, v in enumerate(data)], '#2563EB', 1.8))
    for d, v in enumerate(data):
        out.append(dot(X(d), Y(v), 3.2, '#BE123C' if v > ucl or v < lcl else '#1D4ED8'))
    out.append(poly([(X(18), 146), (X(18), 40)], '#B45309', 1.4, dash=1))
    out.append(txt(X(18) + 7, 50, '18일째부터 공정이 나빠졌다', 10, '#B45309', w=800))
    out.append(txt(66, Y(ucl) - 6, '관리 상한 np + 3σ = 39.6', 10, '#BE123C', w=800))
    out.append(txt(66, Y(mu) - 6, '중심선 np = 25.0', 10, '#0B6E63', w=800))
    out.append(txt(66, Y(lcl) + 14, '관리 하한 10.4', 10, '#BE123C', w=800))
    out.append(txt(356, 162, '일', 10, '#6B7280', anc='middle'))
    out.append(cap('3σ 안에 99.7% — 바깥은 원인을 찾을 신호다'))
    return ''.join(out)


# ── 225 · 두 용액을 섞으면 ──────────────────────────────────────────
def mx225():
    v1, c1, v2, c2 = 200.0, 0.20, 300.0, 0.05
    V = v1 + v2
    c = (c1 * v1 + c2 * v2) / V
    assert abs(c - 0.11) < 1e-12 and c2 < c < c1
    assert abs((c - c2) * v2 - (c1 - c) * v1) < 1e-9            # 지렛대 — 거리 × 양이 같다

    X = lambda t: 60 + 290 * (t - 3) / 19
    base = 104.0
    out = [poly([(60, base), (350, base)], '#111827', 2.0)]
    for t in (5, 10, 11, 15, 20):
        out.append(poly([(X(t), base), (X(t), base + 5)], GREY, 1.0))
        out.append(txt(X(t), base + 17, '%d%%' % t, 9.5, '#6B7280', anc='middle'))
    for t, g, col, lab in ((c2 * 100, v2, '#0E9384', 'B 300g · 5%'),
                           (c1 * 100, v1, '#2563EB', 'A 200g · 20%')):
        w = 0.14 * g
        out.append(rect(X(t) - w / 2, base - 12 - 0.10 * g, w, 0.10 * g, col, '.34', col))
        out.append(txt(X(t), base - 18 - 0.10 * g, lab, 10, col, anc='middle', w=800))
    out.append(poly([(X(c * 100), base - 4), (X(c * 100) - 8, base + 14), (X(c * 100) + 8, base + 14)],
                    '#BE123C', 1.8, fill='#BE123C'))
    out.append(txt(X(c * 100), 142, '섞은 농도 11%', 10.5, '#BE123C', anc='middle', w=800))
    out.append(txt(60, 158, '거리 6 : 9 는 양 300 : 200 의 반대 — 많은 쪽이 받침을 끌어당긴다',
                   10, '#6B7280'))
    out.append(txt(60, 42, '녹은 양 40 + 15 = 55 g · 전체 500 g → 55 ÷ 500 = 11%', 10, '#111827', w=800))
    out.append(cap('섞은 농도는 두 농도 사이를 결코 벗어나지 못한다'))
    return ''.join(out)


# ── 226 · 몇 %가 규격 안에 드나 ─────────────────────────────────────
def sp226():
    tol, sd = 3.0, 1.5
    LO, HI = 100 - tol, 100 + tol
    cdf = lambda z: 0.5 * (1 + erf(z / sqrt(2)))
    bad = lambda mu: (1 - (cdf((HI - mu) / sd) - cdf((LO - mu) / sd))) * 100
    cp = tol / (3 * sd)
    cpk = lambda mu: min(HI - mu, mu - LO) / (3 * sd)
    assert abs(cp - 0.6667) < 1e-3
    assert abs(cpk(100) - cp) < 1e-9 and abs(cpk(103)) < 1e-9
    assert abs(bad(100) - 4.5500) < 1e-3 and abs(bad(103) - 50.003) < 1e-2

    X = lambda x: 60 + 290 * (x - 94) / 12
    pk = 1 / (sd * sqrt(2 * pi))
    Y = lambda d: 140 - 96 * d / pk
    nrm = lambda x, mu: exp(-((x - mu) ** 2) / (2 * sd * sd)) / (sd * sqrt(2 * pi))
    out = [axes(60, 356, 140, 30)]
    for mu, col in ((100.0, '#2563EB'), (103.0, '#BE123C')):
        pts = [(X(94 + 12 * i / 200.0), Y(nrm(94 + 12 * i / 200.0, mu))) for i in range(201)]
        out.append(poly(pts, col, 2.4))
    tail = [(X(x), Y(nrm(x, 103.0))) for x in [HI + 6 * i / 60.0 for i in range(61)]]
    out.append(area([(X(HI), Y(0))] + tail + [(X(106), Y(0))], '#BE123C', '.20'))
    for v in (LO, HI):
        out.append(poly([(X(v), 140), (X(v), 36)], '#B45309', 1.6, dash=1))
    out.append(txt(X(LO), 30, '규격 97', 10, '#B45309', anc='middle', w=800))
    out.append(txt(X(HI), 30, '규격 103', 10, '#B45309', anc='middle', w=800))
    out.append(txt(X(100), Y(pk) - 8, '중심 100', 10, '#1D4ED8', anc='middle', w=800))
    out.append(txt(66, 60, '중심이 맞으면 Cp = Cpk = 0.67 · 불량 4.55%', 10, '#1D4ED8', w=800))
    out.append(txt(348, 78, '중심이 밀리면 Cp 는 그대로 0.67', 10, '#BE123C', anc='end', w=800))
    out.append(txt(348, 96, 'Cpk 는 0.00 · 불량 50%', 10, '#BE123C', anc='end', w=800))
    out.append(txt(356, 156, 'mm', 10, '#6B7280', anc='middle'))
    out.append(cap('Cp 는 폭만, Cpk 는 폭과 치우침을 함께 본다'))
    return ''.join(out)


# ── 227 · 건물 높이를 자 없이 ───────────────────────────────────────
def fh227():
    d, ang, e = 30.0, 45.0, 1.5
    t = tan(radians(ang))
    h = d * t + e
    assert abs(t - 1) < 1e-12 and abs(h - 31.5) < 1e-9
    assert abs(h - e - d * t) < 1e-12                           # 눈높이는 더하는 것이지 빼는 것이 아니다

    X = lambda x: 70 + 7.0 * x
    Y = lambda y: 146 - 3.2 * y
    ex, ey = X(0), Y(e)
    bx = X(d)
    out = [poly([(56, 146), (352, 146)], '#6B7280', 1.6)]
    out.append(rect(bx - 16, Y(h), 32, 146 - Y(h), '#2563EB', '.22', '#1D4ED8'))
    out.append(poly([(ex, ey), (bx, Y(h))], '#BE123C', 2.0))
    out.append(poly([(ex, ey), (bx, ey)], GREY, 1.4, dash=1))
    out.append(poly([(ex, 146), (ex, ey)], '#0E9384', 2.0))
    out.append('<path d="M%.1f %.1f A 26 26 0 0 0 %.1f %.1f" stroke="#BE123C" stroke-width="1.4" fill="none"/>'
               % (ex + 26, ey, ex + 26 * cos(radians(ang)), ey - 26 * sin(radians(ang))))
    out.append(txt(ex + 32, ey - 12, '45°', 10.5, '#BE123C', w=800))
    out.append(txt((ex + bx) / 2, ey - 6, '거리 30 m', 10, '#6B7280', anc='middle'))
    out.append(txt(ex - 4, 140, '눈높이', 10, '#0B6E63', anc='end', w=800))
    out.append(txt(ex - 4, 154, '1.5 m', 10, '#0B6E63', anc='end', w=800))
    out.append(txt(60, 36, '30 × tan 45° = 30.0 m', 10, '#BE123C', w=800))
    out.append(txt(60, 52, '+ 눈높이 1.5 → 전체 31.5 m', 10.5, '#1D4ED8', w=800))
    out.append(txt(bx + 20, Y(h) + 4, '31.5 m', 10.5, '#1D4ED8', w=800))
    out.append(poly([(bx, ey), (bx, Y(h))], '#BE123C', 1.2, dash=1))
    out.append(cap('각의 기준선은 땅이 아니라 눈이다'))
    return ''.join(out)


# ── 228 · 남는 토막을 줄이려면 ──────────────────────────────────────
def ct228():
    L, A, B = 400, 150, 90
    na = L // A
    naive = L - na * A
    best = min(L - a * A - ((L - a * A) // B) * B for a in range(L // A + 1))
    assert na == 2 and naive == 100 and best == 10
    assert 2 * A + 1 * B + best == L                            # 섞어 넣은 배치가 실제로 맞는다

    X = lambda v: 60 + 290 * v / L
    out = []
    rows = [(56, [(A, '#2563EB', 'A 150'), (A, '#2563EB', 'A 150'), (naive, '#9CA3AF', '버림 100')],
             'A 만 넣기 — 버림 100 cm'),
            (108, [(A, '#2563EB', 'A 150'), (A, '#2563EB', 'A 150'), (B, '#0E9384', 'B 90'),
                   (best, '#9CA3AF', '10')],
             'A·B 섞어 넣기 — 버림 10 cm')]
    for y, segs, lab in rows:
        x = 0
        for w, col, t in segs:
            out.append(rect(X(x), y, X(x + w) - X(x), 28, col, '.34', col))
            if X(x + w) - X(x) > 26:
                out.append(txt((X(x) + X(x + w)) / 2, y + 18, t, 10, '#111827', anc='middle', w=800))
            x += w
        assert x == L
        out.append(txt(60, y - 7, lab, 10, '#111827', w=800))
    out.append(txt(60, 158, '같은 자재 400 cm 인데 조합을 바꾸자 버리는 양이 90 cm 줄었다',
                   10, '#BE123C', w=800))
    out.append(cap('L − (aA + bB) 를 가장 작게 하는 자연수 조합을 찾는 문제'))
    return ''.join(out)


# ── 229 · 10kWh 더 썼을 뿐인데 ──────────────────────────────────────
def pb229():
    BASE, EDGE, RATE = [910, 1600, 7300], [200, 400, 10000], [120, 214, 307]

    def bill(u):
        lo, cost, tier = 0, 0, 0
        for i, e in enumerate(EDGE):
            amt = max(0, min(u, e) - lo)
            if amt > 0:
                cost += amt * RATE[i]
                tier = i
            lo = e
            if u <= e:
                break
        return cost + BASE[tier]

    assert bill(390) == 66260 and bill(410) == 77170 and bill(410) - bill(390) == 10910
    assert bill(400) == 68400 and bill(401) - bill(400) == 307 + (7300 - 1600)

    X = lambda u: 60 + 290 * u / 700
    Y = lambda c: 146 - 106 * c / bill(700)
    out = [axes(60, 356, 146, 30)]
    # 경계에서 기본요금이 뛰므로 선을 끊어 그린다 (구간 안에서는 직선이라 성글게 떠도 된다)
    for lo, hi in ((0, 200), (201, 400), (401, 700)):
        us = list(range(lo, hi + 1, 10))
        if us[-1] != hi:
            us.append(hi)
        out.append(poly([(X(u), Y(bill(u))) for u in us], '#2563EB', 2.4))
    for e in (200, 400):
        out.append(poly([(X(e), 146), (X(e), 40)], '#C7D2E4', 1.2, dash=1))
        out.append(txt(X(e), 162, str(e), 9.5, '#6B7280', anc='middle'))
    out.append(poly([(X(390), Y(bill(390))), (X(410), Y(bill(410)))], '#BE123C', 2.0))
    out.append(dot(X(390), Y(bill(390)), 4.4, '#0E9384'))
    out.append(dot(X(410), Y(bill(410)), 4.4, '#BE123C'))
    out.append(txt(X(410) + 9, Y(bill(410)) + 4, '410kWh → 77,170원', 10, '#BE123C', w=800))
    out.append(txt(X(390) - 9, Y(bill(390)) + 16, '390kWh → 66,260원', 10, '#0B6E63',
                   anc='end', w=800))
    out.append(txt(66, 44, '10kWh 더 썼을 뿐인데 10,910원 — 기본요금까지 뛴다', 10, '#BE123C', w=800))
    out.append(txt(66, 128, '구간마다 단가가 다르고 기본요금도 다르다', 10, '#6B7280'))
    out.append(txt(356, 162, 'kWh', 10, '#6B7280', anc='middle'))
    out.append(cap('구간을 넘으면 그래프가 두 번 꺾인다'))
    return ''.join(out)


# ── 230 · 위도 1도는 몇 km ──────────────────────────────────────────
def gd230():
    kl = pi * 6371 / 180
    ko = lambda lat: kl * cos(radians(lat))
    assert abs(kl - 111.1949) < 1e-3
    assert abs(ko(0) - kl) < 1e-9 and abs(ko(60) - 55.5975) < 1e-3
    assert abs(ko(36) - 89.9586) < 1e-3

    cx, cy, R = 116.0, 96.0, 50.0
    lat = 36.0
    ly = cy - R * sin(radians(lat))
    lw = R * cos(radians(lat))
    out = ['<circle cx="%.1f" cy="%.1f" r="%.1f" fill="#2563EB" fill-opacity=".08" '
           'stroke="#9CA3AF" stroke-width="1.4"/>' % (cx, cy, R)]
    out.append(poly([(cx - R, cy), (cx + R, cy)], '#0E9384', 2.0))
    out.append(poly([(cx - lw, ly), (cx + lw, ly)], '#BE123C', 2.0))
    out.append(poly([(cx, cy), (cx + lw, ly)], GREY, 1.2, dash=1))
    out.append(txt(cx + R + 6, cy + 4, '적도', 10, '#0B6E63', w=800))
    out.append(txt(cx + lw + 6, ly - 4, '위도 36°', 10, '#BE123C', w=800))
    out.append(txt(cx, cy + R + 16, '위도가 높아질수록 둘레가 줄어든다', 10, '#6B7280', anc='middle'))
    bx, bw = 228.0, 124.0
    for i, (lab, km, col) in enumerate((('위도 1°', kl, '#0E9384'), ('경도 1° (적도)', kl, '#9CA3AF'),
                                        ('경도 1° (위도 36°)', ko(36), '#BE123C'),
                                        ('경도 1° (위도 60°)', ko(60), '#B45309'))):
        y = 54 + i * 28
        out.append(rect(bx, y, bw * km / kl, 14, col, '.40', col))
        out.append(txt(bx, y - 4, '%s — %.1f km' % (lab, km), 10, col, w=800))
    out.append(txt(bx, 170, '', 9))
    out.append(cap('위도 1° 는 어디서나 111 km, 경도 1° 는 111 × cos(위도)'))
    return ''.join(out)


FNS = [('sf221', sf221), ('wm222', wm222), ('md223', md223), ('qc224', qc224), ('mx225', mx225),
       ('sp226', sp226), ('fh227', fh227), ('ct228', ct228), ('pb229', pb229), ('gd230', gd230)]

if __name__ == '__main__':
    import sys
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass
    for nm, f in FNS:
        sys.stdout.write('%-7s %5d자  ok\n' % (nm, len(f())))
