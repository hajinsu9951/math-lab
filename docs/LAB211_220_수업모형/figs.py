# -*- coding: utf-8 -*-
"""LAB 211~220 「오늘의 문제」 그림 — 좌표를 계산해서 그린다.

생활 속 셈 묶음이다. 그림에 적는 수는 실험 화면과 같은 식으로 구해 assert 로 묶었다.
축 화살촉과 글씨 흰 테두리는 여기서 직접 넣는다
(docs/그림_다듬기/polish_figs.py 는 두 번 돌리면 화살촉을 겹쳐 붙인다).
"""
from math import sqrt, log

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


def area(pts, col, op='.10'):
    d = ' '.join('%s%.1f %.1f' % ('M' if i == 0 else 'L', p[0], p[1]) for i, p in enumerate(pts))
    return '<path d="%s Z" fill="%s" fill-opacity="%s" stroke="none"/>' % (d, col, op)


def dot(x, y, r=5.0, col='#111827'):
    return '<circle cx="%.1f" cy="%.1f" r="%.1f" fill="%s"/>' % (x, y, r, col)


def rect(x, y, w, h, col, op='.30', stroke=None, sw=1.2):
    return ('<rect x="%.1f" y="%.1f" width="%.1f" height="%.1f" fill="%s" fill-opacity="%s"%s/>'
            % (x, y, w, h, col, op,
               ' stroke="%s" stroke-width="%s"' % (stroke, sw) if stroke else ''))


# ── 211 · 몇 개를 팔아야 본전일까 ───────────────────────────────────
def be211():
    F, v, p = 600.0, 4.0, 7.0          # 고정비 60만원 = 600천원 · 변동비·가격은 천원
    cm = p - v
    be = F / cm
    assert abs(cm - 3) < 1e-12 and abs(be - 200) < 1e-12
    assert abs(F + v * be - p * be) < 1e-9        # 교점에서 총비용 = 매출

    X = lambda q: 60 + 290 * q / 300
    Y = lambda c: 146 - 110 * c / 2400
    cost = lambda q: F + v * q
    rev = lambda q: p * q
    out = [axes(60, 356, 146, 34)]
    out.append(area([(X(0), Y(0)), (X(be), Y(rev(be))), (X(be), Y(cost(be))), (X(0), Y(cost(0)))],
                    '#BE123C', '.10'))
    out.append(area([(X(be), Y(cost(be))), (X(300), Y(cost(300))), (X(300), Y(rev(300)))],
                    '#0E9384', '.14'))
    out.append(poly([(X(0), Y(cost(0))), (X(300), Y(cost(300)))], '#BE123C', 2.6))
    out.append(poly([(X(0), Y(rev(0))), (X(300), Y(rev(300)))], '#0E9384', 2.6))
    out.append(poly([(X(be), 146), (X(be), Y(rev(be)))], GREY, 1.4, dash=1))
    out.append(dot(X(be), Y(rev(be)), 5.2, '#111827'))
    out.append(txt(66, Y(cost(0)) - 7, '총비용 = 고정비 600 + 4 × 개수', 10, '#BE123C', w=800))
    out.append(txt(348, Y(rev(300)) - 8, '매출 = 7 × 개수', 10, '#0B6E63', anc='end', w=800))
    out.append(txt(X(be) + 8, Y(rev(be)) - 6, '손익분기 200개', 10.5, '#111827', w=800))
    out.append(txt(X(be) - 10, 160, '200', 9.5, '#6B7280', anc='middle'))
    out.append(txt(110, 128, '손해', 10.5, '#BE123C', anc='middle', w=800))
    out.append(txt(316, 92, '이익', 10.5, '#0B6E63', anc='middle', w=800))
    out.append(txt(356, 162, '개수', 10, '#6B7280', anc='middle'))
    out.append(cap('고정비는 문턱의 높이, 공헌이익은 올라가는 속도'))
    return ''.join(out)


# ── 212 · 한 바구니에 담지 말라 ─────────────────────────────────────
def dv212():
    muA, muB, sA, sB = 0.08, 0.05, 0.20, 0.12

    def stat(w, rho):
        v = w * w * sA * sA + (1 - w) ** 2 * sB * sB + 2 * w * (1 - w) * rho * sA * sB
        return w * muA + (1 - w) * muB, sqrt(max(0.0, v))

    def bestW(rho):
        return max(0.0, min(1.0, (sB * sB - rho * sA * sB) / (sA * sA + sB * sB - 2 * rho * sA * sB)))

    assert abs(bestW(-1) - 0.375) < 1e-12 and stat(bestW(-1), -1)[1] < 1e-12   # 완전 반대면 0
    assert abs(bestW(0) - sB * sB / (sA * sA + sB * sB)) < 1e-12
    assert stat(bestW(0), 0)[1] < stat(1, 0)[1]                                 # 섞으면 줄어든다

    X = lambda s: 60 + 290 * s / 0.22
    Y = lambda m: 146 - 106 * (m - 0.047) / 0.036
    out = [axes(60, 356, 146, 34)]
    for rho, col, w in ((1.0, GREY, 1.8), (0.0, '#2563EB', 2.6), (-1.0, '#0E9384', 2.6)):
        pts = [(X(stat(i / 100.0, rho)[1]), Y(stat(i / 100.0, rho)[0])) for i in range(101)]
        out.append(poly(pts, col, w, dash=(1 if rho == 1 else None)))
    for rho, col in ((0.0, '#1D4ED8'), (-1.0, '#0B6E63')):
        m, s = stat(bestW(rho), rho)
        out.append(dot(X(s), Y(m), 5.0, col))
    out.append(dot(X(stat(1, 0)[1]), Y(stat(1, 0)[0]), 5.0, '#BE123C'))
    out.append(txt(66, 44, 'A 에만 몰면 기대 8.00% · 흔들림 20.00%', 10, '#BE123C', w=800))
    out.append(txt(X(stat(bestW(0), 0)[1]) + 9, Y(stat(bestW(0), 0)[0]) + 4,
                   '따로 움직이면 10.30%', 10, '#1D4ED8', w=800))
    out.append(txt(70, Y(stat(bestW(-1), -1)[0]) - 8, '반대로 움직이면 0%', 10, '#0B6E63', w=800))
    out.append(txt(348, 56, '점선 = 똑같이 움직이는 둘', 9.5, '#6B7280', anc='end'))
    out.append(txt(356, 162, '흔들림', 10, '#6B7280', anc='middle'))
    out.append(txt(60, 28, '기대수익', 10, '#6B7280', anc='middle'))
    out.append(cap('함께 움직이지 않는 둘을 섞을수록 흔들림이 줄어든다'))
    return ''.join(out)


# ── 213 · 기댓값이 같은데 왜 다를까 ─────────────────────────────────
def ra213():
    k = 0.5
    u = lambda x: max(0.0, x) ** k
    lo, hi = 40.0, 160.0
    ug = (u(lo) + u(hi)) / 2
    ce = ug ** (1 / k)
    assert abs((lo + hi) / 2 - 100) < 1e-12               # 기댓값은 100 으로 같다
    assert abs(ce - 90) < 1e-9 and ug < u(100)            # 확실성등가는 90 — 정확히 3√10 의 제곱

    X = lambda x: 60 + 290 * x / 180
    Y = lambda y: 146 - 106 * y / 14
    out = [axes(60, 356, 146, 34)]
    out.append(poly([(X(180 * i / 180.0), Y(u(180 * i / 180.0))) for i in range(181)], '#2563EB', 2.6))
    out.append(poly([(X(lo), Y(u(lo))), (X(hi), Y(u(hi)))], '#BE123C', 2.0, dash=1))
    out.append(poly([(X(100), Y(ug)), (X(100), Y(u(100)))], '#B45309', 2.0))
    out.append(poly([(X(ce), 146), (X(ce), Y(ug))], GREY, 1.4, dash=1))
    out.append(poly([(X(ce), Y(ug)), (X(100), Y(ug))], GREY, 1.4, dash=1))
    for x, col in ((lo, '#BE123C'), (hi, '#BE123C')):
        out.append(dot(X(x), Y(u(x)), 4.4, col))
    out.append(dot(X(100), Y(u(100)), 5.0, '#0E9384'))
    out.append(dot(X(100), Y(ug), 5.0, '#B45309'))
    out.append(txt(X(100) + 9, Y(u(100)) - 5, '확실한 100 → 만족도 10.000', 10, '#0B6E63', w=800))
    out.append(txt(X(100) + 9, Y(ug) + 13, '도박의 평균 만족도 9.487', 10, '#B45309', w=800))
    out.append(txt(X(ce), 162, '90', 9.5, '#6B7280', anc='middle'))
    out.append(txt(X(100), 162, '100', 9.5, '#6B7280', anc='middle'))
    out.append(txt(66, 44, '확실성등가 90 — 10만원을 기꺼이 내놓는 셈', 10, '#6B7280'))
    out.append(txt(356, 162, '돈', 10, '#6B7280', anc='middle'))
    out.append(txt(60, 28, '만족도', 10, '#6B7280', anc='middle'))
    out.append(cap('위로 볼록하면 두 점을 이은 선분이 곡선 아래에 놓인다'))
    return ''.join(out)


# ── 214 · 불평등을 하나의 수로 ──────────────────────────────────────
def gi214():
    top = 0.60
    e = (1 - top) / 4
    sh = [e] * 4 + [top]
    cum = [0.0]
    for v in sh:
        cum.append(cum[-1] + v)
    ar = sum((cum[i] + cum[i + 1]) / 2 * 0.2 for i in range(5))
    g = (0.5 - ar) / 0.5
    assert abs(cum[-1] - 1) < 1e-12 and abs(ar - 0.3) < 1e-12 and abs(g - 0.4) < 1e-12

    X = lambda p: 60 + 280 * p
    Y = lambda c: 146 - 110 * c
    lor = [(X(i * 0.2), Y(cum[i])) for i in range(6)]
    out = [axes(60, 356, 146, 30)]
    out.append(area([(X(0), Y(0))] + lor[::-1], '#BE123C', '.16'))
    out.append(poly([(X(0), Y(0)), (X(1), Y(1))], GREY, 1.8, dash=1))
    out.append(poly(lor, '#2563EB', 2.6))
    for x, y in lor:
        out.append(dot(x, y, 3.4, '#1D4ED8'))
    out.append(txt(X(1) - 6, Y(1) - 8, '완전 평등선', 10, '#6B7280', anc='end'))
    out.append(txt(170, 96, '지니계수 = 0.4', 11, '#BE123C', anc='middle', w=800))
    out.append(txt(66, 44, '상위 20% 가 60% 를 가져간 분배', 10, '#1D4ED8', w=800))
    out.append(txt(X(0.8), 162, '하위 80%', 9.5, '#6B7280', anc='middle'))
    out.append(txt(356, 162, '사람 누적', 10, '#6B7280', anc='middle'))
    out.append(txt(60, 24, '소득 누적', 10, '#6B7280', anc='middle'))
    out.append(cap('대각선과 곡선 사이 넓이를 삼각형 넓이로 나눈다'))
    return ''.join(out)


# ── 215 · 로그 눈금에서 직선이면 ────────────────────────────────────
def gr215():
    g, i, n = 0.08, 0.03, 20
    nom = lambda t: (1 + g) ** t
    rel = lambda t: ((1 + g) / (1 + i)) ** t
    rg = (1 + g) / (1 + i) - 1
    dbl = log(2) / log(1 + g)
    assert abs(nom(n) - 4.6610) < 1e-3 and abs(rel(n) - 2.5807) < 1e-3
    assert abs(rg * 100 - 4.8544) < 1e-3 and abs(dbl - 9.0065) < 1e-3
    assert abs(dbl - 72 / (g * 100)) < 0.05                 # 72 법칙이 거의 맞는다

    X = lambda t: 60 + 290 * t / n
    Y = lambda v: 146 - 106 * log(v) / log(5.0)
    out = [axes(60, 356, 146, 30)]
    for val in (1, 2, 5):
        out.append(poly([(60, Y(val)), (350, Y(val))], '#C7D2E4', 1.2, dash=1))
        out.append(txt(56, Y(val) + 3.6, '%d배' % val, 9.5, '#9CA3AF', anc='end'))
    out.append(poly([(X(0), Y(nom(0))), (X(n), Y(nom(n)))], '#2563EB', 2.6))
    out.append(poly([(X(0), Y(rel(0))), (X(n), Y(rel(n)))], '#0E9384', 2.6))
    out.append(poly([(X(dbl), 146), (X(dbl), Y(2))], '#B45309', 1.6, dash=1))
    out.append(dot(X(dbl), Y(2), 4.6, '#B45309'))
    out.append(txt(X(dbl) + 8, Y(2) - 7, '9.0년에 두 배 — 72 ÷ 8 = 9', 10, '#B45309', w=800))
    out.append(txt(348, Y(nom(n)) + 4, '명목 8% → 4.661배', 10, '#1D4ED8', anc='end', w=800))
    out.append(txt(348, Y(rel(n)) + 28, '실질 4.854% → 2.581배', 10, '#0B6E63', anc='end', w=800))
    out.append(txt(66, 134, '세로는 로그 눈금 — 직선이면 해마다 같은 비율', 10, '#6B7280'))
    out.append(txt(356, 162, '년', 10, '#6B7280', anc='middle'))
    out.append(cap('명목에서 물가를 빼는 것이 아니라 나눈다'))
    return ''.join(out)


# ── 216 · 중고차 값은 어떻게 떨어질까 ───────────────────────────────
def dp216():
    P, r, n = 3000.0, 0.30, 8
    lin = lambda t: P * (1 - t / n)
    geo = lambda t: P * (1 - r) ** t
    hg = log(0.5) / log(1 - r)
    hl = n / 2.0
    assert abs(hg - 1.9433) < 1e-3 and abs(hl - 4) < 1e-12 and hg < hl
    assert geo(n) > 0 and abs(lin(n)) < 1e-9                # 정률은 0 이 되지 않는다

    X = lambda t: 60 + 290 * t / n
    Y = lambda v: 146 - 106 * v / P
    out = [axes(60, 356, 146, 30)]
    out.append(poly([(60, Y(P / 2)), (350, Y(P / 2))], '#C7D2E4', 1.4, dash=1))
    out.append(poly([(X(0), Y(lin(0))), (X(n), Y(lin(n)))], '#2563EB', 2.6))
    out.append(poly([(X(n * i / 120.0), Y(geo(n * i / 120.0))) for i in range(121)], '#BE123C', 2.6))
    for t, col in ((hg, '#BE123C'), (hl, '#2563EB')):
        out.append(dot(X(t), Y(P / 2), 4.6, col))
    out.append(txt(56, Y(P / 2) + 3.6, '절반', 9.5, '#9CA3AF', anc='end'))
    out.append(txt(X(hg) + 7, Y(P / 2) - 8, '정률 1.94년', 10, '#BE123C', w=800))
    out.append(txt(X(hl) + 7, Y(P / 2) + 16, '정액 4년', 10, '#1D4ED8', w=800))
    out.append(txt(66, 44, '정액법 — 해마다 375만원씩 (등차)', 10, '#1D4ED8', w=800))
    out.append(txt(66, 60, '정률법 — 해마다 30%씩 (등비)', 10, '#BE123C', w=800))
    out.append(txt(348, Y(geo(n)) - 9, '8년 뒤에도 0 이 아니다', 10, '#BE123C', anc='end', w=800))
    out.append(txt(356, 162, '년', 10, '#6B7280', anc='middle'))
    out.append(txt(60, 24, '값', 10, '#6B7280', anc='middle'))
    out.append(cap('같은 금액씩 깎을까, 같은 비율씩 깎을까'))
    return ''.join(out)


# ── 217 · 곱할까 나눌까 ─────────────────────────────────────────────
def uc217():
    v = 72.0
    for a, b in ((1000, 1), (1, 3600)):
        v = v * a / b
    bad = 72.0
    for a, b in ((1000, 1), (1, 3600)):
        bad = bad * b / a
    assert abs(v - 20) < 1e-9 and abs(bad - 259.2) < 1e-9
    assert abs(1000 / 1.0 - 1000) < 1e-12                  # 환산인자는 값이 1 인 분수다

    def frac(cx, num, den, strike=()):
        o = ['<path d="M%.1f 84 H%.1f" stroke="#111827" stroke-width="1.4"/>' % (cx - 38, cx + 38),
             txt(cx, 74, num, 11, '#111827', anc='middle', w=800),
             txt(cx, 102, den, 11, '#111827', anc='middle', w=800)]
        for y, w in strike:                                 # 약분되는 단위에 줄을 긋는다
            o.append('<path d="M%.1f %.1f H%.1f" stroke="#BE123C" stroke-width="1.8"/>'
                     % (cx + w[0], y, cx + w[1]))
        return ''.join(o)

    out = [frac(96, '72 km', '1 h', ((70.5, (6, 24)), (98.5, (2, 12)))),
           txt(152, 90, '×', 13, '#6B7280', anc='middle'),
           frac(208, '1000 m', '1 km', ((98.5, (6, 24)),)),
           txt(264, 90, '×', 13, '#6B7280', anc='middle'),
           frac(320, '1 h', '3600 s', ((70.5, (2, 12)),))]
    out.append(txt(200, 136, '= 20 m/s — km 와 h 가 약분되고 m 와 s 만 남는다',
                   11, '#0B6E63', anc='middle', w=800))
    out.append(txt(200, 158, '거꾸로 곱하면 259.2 — 값이 12,960배 어긋난다',
                   10, '#BE123C', anc='middle', w=800))
    out.append(txt(200, 40, '환산인자는 값이 1 인 분수 — 값이 아니라 단위만 바꾼다',
                   10, '#6B7280', anc='middle'))
    out.append(cap('없애고 싶은 단위가 분모에 오도록 놓는다'))
    return ''.join(out)


# ── 218 · 도면 1cm 는 실제로 몇 m ───────────────────────────────────
def sc218():
    N, L, Wd = 50, 6.0, 4.0
    assert abs(L * N / 100 - 3) < 1e-12 and abs(Wd * N / 100 - 2) < 1e-12
    assert N * N == 2500 and abs(L * Wd * N * N / 10000 - 6) < 1e-12
    k = 3                                                   # 그림으로 보이는 배율
    assert k * k == 9

    u = 30.0
    out = [rect(78, 62, u, u, '#2563EB', '.30', '#1D4ED8')]
    out.append(txt(93, 81, '1', 11, '#1D4ED8', anc='middle', w=800))
    out.append(txt(93, 108, '도면 1칸', 10, '#6B7280', anc='middle'))
    for i in range(k):
        for j in range(k):
            out.append(rect(206 + u * j, 46 + u * i, u, u, '#0E9384', '.22', '#fff', 1))
    out.append('<rect x="206" y="46" width="%.1f" height="%.1f" fill="none" stroke="#0B6E63" '
               'stroke-width="1.8"/>' % (u * k, u * k))
    out.append(txt(251, 150, '실제 9칸', 10, '#6B7280', anc='middle'))
    out.append('<path d="M126 84 L186 84" stroke="%s" stroke-width="1.8"/>' % GREY
               + head(192, 84, 1, 0))
    out.append(txt(156, 76, '길이 3배', 10, '#6B7280', anc='middle'))
    out.append(txt(348, 60, '길이 N 배 → 넓이 N² 배', 10.5, '#0B6E63', anc='end', w=800))
    out.append(txt(348, 78, '1 : 50 이면 넓이는 2,500배', 10, '#BE123C', anc='end', w=800))
    out.append(txt(348, 96, '도면 24cm² → 실제 6.00m²', 10, '#6B7280', anc='end'))
    out.append(cap('도면에서 1 mm 를 잘못 읽으면 실제로는 크게 벌어진다'))
    return ''.join(out)


# ── 219 · 30% 두 번은 60%일까 ───────────────────────────────────────
def di219():
    P, a, b = 100000.0, 0.30, 0.30
    p1, p2 = P * (1 - a), P * (1 - a) * (1 - b)
    eff = 1 - (1 - a) * (1 - b)
    wrong = P * (1 - (a + b))
    assert abs(p1 - 70000) < 1e-9 and abs(p2 - 49000) < 1e-9
    assert abs(eff - 0.51) < 1e-12 and abs(wrong - 40000) < 1e-9
    assert abs(p2 - wrong - 9000) < 1e-9                    # 더하기로 보면 9,000원을 더 깎는 셈

    X = lambda v: 60 + 280 * v / P
    out = []
    for i, (v, col, lab) in enumerate(((P, '#2563EB', '처음 100,000원'),
                                       (p1, '#0E9384', '30% 깎고 70,000원'),
                                       (p2, '#BE123C', '다시 30% 깎고 49,000원'))):
        y = 48 + i * 32
        out.append(rect(60, y, X(v) - 60, 22, col, '.34', col))
        out.append(txt(64, y + 16, lab, 10, col.replace('#0E9384', '#0B6E63'), w=800))
    out.append(poly([(X(wrong), 40), (X(wrong), 132)], '#B45309', 1.8, dash=1))
    out.append(txt(X(wrong), 142, '단순히 60% 라면 40,000원', 10, '#B45309', anc='middle', w=800))
    out.append(txt(60, 162, '실제 할인율 51% — 두 할인율을 더한 60% 보다 9%p 적게 깎인다',
                   10, '#111827', w=800))
    out.append(cap('남는 비율끼리 곱한다 — 0.7 × 0.7 = 0.49'))
    return ''.join(out)


# ── 220 · 몇 개를 넣어야 100개가 나올까 ─────────────────────────────
def mt220():
    import math as _m
    need, loss = 100, 0.20
    right = _m.ceil(need / (1 - loss))
    wrong = _m.ceil(need * (1 + loss))
    assert right == 125 and wrong == 120
    assert _m.floor(right * (1 - loss)) == 100 and _m.floor(wrong * (1 - loss)) == 96
    assert need - _m.floor(wrong * (1 - loss)) == 4

    X = lambda q: 60 + 2.0 * q
    out = []
    for i, (inp, col, lab) in enumerate(((right, '#2563EB', '올바름 — 100 ÷ 0.8 = 125개 투입'),
                                         (wrong, '#BE123C', '잘못 — 100 × 1.2 = 120개 투입'))):
        y = 54 + i * 46
        ok = _m.floor(inp * (1 - loss))
        out.append(rect(60, y, X(ok) - 60, 26, col, '.34', col))
        out.append(rect(X(ok), y, X(inp) - X(ok), 26, '#9CA3AF', '.30', '#9CA3AF'))
        out.append(txt(64, y + 18, '완성 %d개' % ok, 10, '#111827', w=800))
        out.append(txt(X(inp) + 6, y + 18, '손실 %d개' % (inp - ok), 10, '#6B7280'))
        out.append(txt(60, y - 7, lab, 10, col, w=800))
    out.append(poly([(X(need), 40), (X(need), 140)], '#B45309', 1.8, dash=1))
    out.append(txt(X(need) + 7, 150, '필요한 완성품 100개', 10, '#B45309', w=800))
    out.append(txt(60, 164, '곱해서 계산하면 4개가 모자란다 — 손실은 남는 비율로 나눈다',
                   10, '#111827', w=800))
    out.append(cap('투입 x 에서 x × (1 − 손실률) 이 완성된다'))
    return ''.join(out)


FNS = [('be211', be211), ('dv212', dv212), ('ra213', ra213), ('gi214', gi214), ('gr215', gr215),
       ('dp216', dp216), ('uc217', uc217), ('sc218', sc218), ('di219', di219), ('mt220', mt220)]

if __name__ == '__main__':
    import sys
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass
    for nm, f in FNS:
        sys.stdout.write('%-7s %5d자  ok\n' % (nm, len(f())))
