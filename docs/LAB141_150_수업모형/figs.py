# -*- coding: utf-8 -*-
"""LAB 141~150 「오늘의 문제」 그림 — 좌표를 계산해서 그린다.

그림 속 숫자는 모두 이 파일에서 계산한 값이다. 손으로 적은 수는 없다.
각 함수는 끝에서 assert 로 「그림이 말하는 것이 참인지」를 확인한다.
"""
import math
from math import comb

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
    """맨 위 한 줄 안내문 — 늘 같은 자리, 같은 크기."""
    return '<text x="200" y="16" font-size="10.5" fill="#6B7280" text-anchor="middle"%s>%s</text>' % (HALO, t)


# ── 141 · 회전체를 원판으로 자른다 ──────────────────────────────────
def dv141():
    h, n = 2.0, 6
    r = lambda x: x                      # 원뿔 — r = x
    dx = h / n
    mids = [(i + 0.5) * dx for i in range(n)]
    approx = math.pi * sum(r(m) ** 2 for m in mids) * dx
    exact = math.pi * h ** 3 / 3
    assert abs(exact - 8 * math.pi / 3) < 1e-9
    assert 0.01 < exact - approx < 0.1, (approx, exact)

    X = lambda x: 56 + 142.0 * x
    AX = 92.0
    S = 25.0                             # 반지름 1 당 픽셀
    out = ['<path d="M44 %g H364" stroke="#9CA3AF" stroke-width="1.1" stroke-dasharray="5 4"/>' % AX]
    for i, m in enumerate(mids):
        x0, x1, rr = X(i * dx), X((i + 1) * dx), r(m)
        out.append('<rect x="%.1f" y="%.1f" width="%.1f" height="%.1f" fill="#2563EB" opacity=".20" stroke="#2563EB" stroke-width="0.9"/>'
                   % (x0, AX - S * rr, x1 - x0, 2 * S * rr))
    out.append('<path d="%s" stroke="#BE123C" stroke-width="2.4" fill="none" stroke-linecap="round"/>'
               % curve(lambda x: AX - S * r(x), 0, h, X, lambda v: v, 20, 160))
    out.append('<path d="%s" stroke="#BE123C" stroke-width="2.4" fill="none" stroke-linecap="round"/>'
               % curve(lambda x: AX + S * r(x), 0, h, X, lambda v: v, 20, 160))
    out.append('<text x="%.1f" y="%.1f" font-size="10" font-weight="800" fill="#BE123C"%s>벽 r = x</text>'
               % (X(h) + 6, AX - S * r(h) + 4, HALO))
    out.append('<text x="60" y="%.0f" font-size="10" fill="#6B7280"%s>회전축</text>' % (AX - 5, HALO))
    out.append('<text x="56" y="152" font-size="10" fill="#6B7280"%s>원판 %d장 · 두께 %.3f</text>' % (HALO, n, dx))
    out.append('<text x="364" y="152" font-size="10.5" font-weight="800" fill="#1D4ED8" text-anchor="end"%s>'
               '원판 합 %.3f · 참값 8π/3 = %.3f</text>' % (HALO, approx, exact))
    out.append(cap('그릇을 둥근 판으로 잘라 더한다 — 몇 장이면 될까'))
    return ''.join(out)


# ── 142 · 파스칼 삼각형과 조합 ──────────────────────────────────────
def pa142():
    rows = 6
    assert comb(6, 2) == comb(5, 1) + comb(5, 2) == 15
    assert sum(comb(6, r) for r in range(7)) == 64 == 2 ** 6

    Xp = lambda n, r: 200 + (r - n / 2.0) * 37.0
    Yp = lambda n: 32 + 19.0 * n
    out = []
    hot = {(5, 1), (5, 2)}
    for n in range(rows + 1):
        for r in range(n + 1):
            x, y = Xp(n, r), Yp(n)
            v = comb(n, r)
            if (n, r) in hot:
                out.append('<circle cx="%.1f" cy="%.1f" r="9.4" fill="#0E9384" opacity=".16"/>' % (x, y - 3.4))
            if (n, r) == (6, 2):
                out.append('<circle cx="%.1f" cy="%.1f" r="10.4" fill="#BE123C" opacity=".18"/>' % (x, y - 3.4))
            col = '#BE123C' if (n, r) == (6, 2) else ('#0B6E63' if (n, r) in hot else '#111827')
            out.append('<text x="%.1f" y="%.1f" font-size="10.5" font-weight="%s" fill="%s" text-anchor="middle"%s>%d</text>'
                       % (x, y, '800' if (n, r) in hot or (n, r) == (6, 2) else '400', col, HALO, v))
    for r in (1, 2):
        out.append('<path d="M%.1f %.1f L%.1f %.1f" stroke="#0E9384" stroke-width="1.3" stroke-dasharray="3 3"/>'
                   % (Xp(5, r), Yp(5) + 3, Xp(6, 2), Yp(6) - 11))
    out.append('<text x="36" y="58" font-size="10" font-weight="800" fill="#0B6E63"%s>위 두 수 %d + %d</text>'
               % (HALO, comb(5, 1), comb(5, 2)))
    out.append('<text x="36" y="74" font-size="10" font-weight="800" fill="#BE123C"%s>= %d = C(6, 2)</text>'
               % (HALO, comb(6, 2)))
    out.append('<path d="M118 70 L%.1f %.1f" stroke="#BE123C" stroke-width="1.1" stroke-dasharray="3 3"/>'
               % (Xp(6, 2) - 12, Yp(6) - 6))
    out.append('<text x="364" y="162" font-size="10" fill="#6B7280" text-anchor="end"%s>n = 6 줄의 합 = %d = 2⁶</text>'
               % (HALO, sum(comb(6, r) for r in range(7))))
    out.append(cap('바로 위의 두 수를 더하면 아래 수가 된다 — 왜 그럴까'))
    return ''.join(out)


# ── 143 · 중복조합 — ★ 와 칸막이 ───────────────────────────────────
def sb143():
    n, k = 5, 3
    share = (2, 1, 2)
    assert sum(share) == n
    cnt = comb(n + k - 1, k - 1)
    assert cnt == comb(7, 2) == 21

    slots = []
    for j, s in enumerate(share):
        slots += ['star'] * s
        if j < k - 1:
            slots.append('bar')
    assert len(slots) == n + k - 1 == 7

    BW, X0, TOP = 36.0, 62.0, 56.0
    out = []
    for i, kind in enumerate(slots):
        x = X0 + BW * i
        out.append('<rect x="%.1f" y="%.0f" width="%.0f" height="34" rx="6" fill="%s" opacity=".16" stroke="%s" stroke-width="1.1"/>'
                   % (x, TOP, BW - 5, '#BE123C' if kind == 'bar' else '#2563EB',
                      '#BE123C' if kind == 'bar' else '#2563EB'))
        out.append('<text x="%.1f" y="%.0f" font-size="15" font-weight="800" fill="%s" text-anchor="middle">%s</text>'
                   % (x + (BW - 5) / 2, TOP + 24, '#BE123C' if kind == 'bar' else '#1D4ED8',
                      '│' if kind == 'bar' else '★'))
    # 사람별 몫 — 칸막이로 끊긴 묶음 아래에 적는다
    pos, idx = 0, 0
    for j, s in enumerate(share):
        lo = X0 + BW * pos
        hi = X0 + BW * (pos + s) - 5
        out.append('<path d="M%.1f 98 V104 H%.1f V98" stroke="#6B7280" stroke-width="1.1" fill="none"/>' % (lo, hi))
        out.append('<text x="%.1f" y="118" font-size="10" fill="#374151" text-anchor="middle"%s>%d번 %d개</text>'
                   % ((lo + hi) / 2, HALO, j + 1, s))
        pos += s + 1
        idx += 1
    out.append('<text x="200" y="140" font-size="10.5" font-weight="800" fill="#BE123C" text-anchor="middle"%s>'
               '자리 %d칸에서 칸막이 %d칸을 고른다 → C(%d, %d) = %d</text>'
               % (HALO, n + k - 1, k - 1, n + k - 1, k - 1, cnt))
    out.append(cap('사탕은 똑같다 — 다른 것은 「누가 몇 개 받나」뿐이다'))
    return ''.join(out)


# ── 144 · 이항정리의 계수 ──────────────────────────────────────────
def be144():
    n, c = 5, 2
    co = [comb(n, r) * c ** r for r in range(n + 1)]
    assert co == [1, 10, 40, 80, 80, 32], co
    assert sum(co) == (1 + c) ** n == 243
    want = 2                               # x² 항 → n − r = 2
    r_want = n - want
    assert co[r_want] == 80

    top, base = 46.0, 134.0
    S = (base - top) / max(co)
    X = lambda r: 54 + 56.0 * r
    out = ['<path d="M44 %g H364" stroke="#9CA3AF" stroke-width="1.2"/>' % base]
    for r, v in enumerate(co):
        hot = (r == r_want)
        out.append('<rect x="%.1f" y="%.1f" width="40" height="%.1f" rx="3" fill="%s" opacity="%s" stroke="%s" stroke-width="1.1"/>'
                   % (X(r), base - S * v, S * v, '#BE123C' if hot else '#2563EB',
                      '.26' if hot else '.18', '#BE123C' if hot else '#2563EB'))
        out.append('<text x="%.1f" y="%.1f" font-size="10.5" font-weight="800" fill="%s" text-anchor="middle"%s>%d</text>'
                   % (X(r) + 20, base - S * v - 5, '#BE123C' if hot else '#1D4ED8', HALO, v))
        out.append('<text x="%.1f" y="%.0f" font-size="10" fill="#374151" text-anchor="middle"%s>x%s</text>'
                   % (X(r) + 20, base + 13, HALO, '⁵⁴³²¹⁰'[n - r]))
    out.append('<text x="44" y="%.0f" font-size="10" font-weight="800" fill="#BE123C"%s>x² 의 계수 = C(5,%d)·2³</text>'
               % (base + 26, HALO, r_want))
    out.append('<text x="364" y="%.0f" font-size="10" fill="#6B7280" text-anchor="end"%s>계수를 모두 더하면 %d = 3⁵</text>'
               % (base + 26, HALO, sum(co)))
    out.append(cap('(x + 2)⁵ 를 전개하지 않고 x² 의 계수만 집어낼 수 있을까'))
    return ''.join(out)


# ── 145 · 배반과 독립은 다른 말 ─────────────────────────────────────
def ei145():
    pa, pb = 0.4, 0.5
    assert pa + pb <= 1.0                  # 배반이 가능한 크기
    assert abs(pa * pb - 0.2) < 1e-12

    out = []
    for i, mode in enumerate(('excl', 'indep')):
        ox = 24 + i * 190
        L, T, SZ = ox + 16, 36.0, 92.0
        out.append('<rect x="%d" y="26" width="172" height="118" rx="9" fill="#fff" stroke="#E5E7EB" stroke-width="1.2"/>' % ox)
        out.append('<rect x="%.1f" y="%.1f" width="%.1f" height="%.1f" fill="none" stroke="#9CA3AF" stroke-width="1.2"/>'
                   % (L, T, SZ, SZ))
        if mode == 'excl':
            wa, wb = SZ * pa, SZ * pb
            out.append('<rect x="%.1f" y="%.1f" width="%.1f" height="%.1f" fill="#2563EB" opacity=".22"/>' % (L, T, wa, SZ))
            out.append('<rect x="%.1f" y="%.1f" width="%.1f" height="%.1f" fill="#0E9384" opacity=".22"/>'
                       % (L + SZ - wb, T, wb, SZ))
            out.append('<text x="%.1f" y="%.1f" font-size="10" font-weight="800" fill="#1D4ED8" text-anchor="middle"%s>A %.1f</text>'
                       % (L + wa / 2, T + 52, HALO, pa))
            out.append('<text x="%.1f" y="%.1f" font-size="10" font-weight="800" fill="#0B6E63" text-anchor="middle"%s>B %.1f</text>'
                       % (L + SZ - wb / 2, T + 52, HALO, pb))
            out.append('<text x="%.1f" y="%.0f" font-size="10.5" font-weight="800" fill="#BE123C" text-anchor="middle"%s>'
                       '겹침 0 — 배반</text>' % (ox + 86, T + SZ + 18, HALO))
        else:
            wa, hb = SZ * pa, SZ * pb
            out.append('<rect x="%.1f" y="%.1f" width="%.1f" height="%.1f" fill="#2563EB" opacity=".22"/>' % (L, T, wa, SZ))
            out.append('<rect x="%.1f" y="%.1f" width="%.1f" height="%.1f" fill="#0E9384" opacity=".22"/>'
                       % (L, T + SZ - hb, SZ, hb))
            out.append('<rect x="%.1f" y="%.1f" width="%.1f" height="%.1f" fill="#7C3AED" opacity=".34"/>'
                       % (L, T + SZ - hb, wa, hb))
            out.append('<text x="%.1f" y="%.1f" font-size="10" font-weight="800" fill="#1D4ED8"%s>A %.1f</text>'
                       % (L + 3, T + 13, HALO, pa))
            out.append('<text x="%.1f" y="%.1f" font-size="10" font-weight="800" fill="#0B6E63" text-anchor="end"%s>B %.1f</text>'
                       % (L + SZ - 3, T + SZ - hb - 5, HALO, pb))
            out.append('<text x="%.1f" y="%.1f" font-size="10.5" font-weight="800" fill="#6D28D9" text-anchor="middle"%s>'
                       '겹침 %.1f × %.1f = %.1f — 독립</text>' % (ox + 86, T + SZ + 18, HALO, pa, pb, pa * pb))
    out.append(cap('겹치지 않는 것과 서로 영향을 주지 않는 것은 같은 말일까'))
    return ''.join(out)


# ── 146 · 기하적 확률 — 만나는 띠의 넓이 ────────────────────────────
def mp146():
    T, t = 60.0, 10.0
    p = 1 - ((T - t) / T) ** 2
    assert abs(p - 11.0 / 36) < 1e-12, p

    SZ = 100.0
    X = lambda x: 150 + SZ * x / T
    Y = lambda y: 140 - SZ * y / T
    band = [(0, 0), (t, 0), (T, T - t), (T, T), (T - t, T), (0, t)]
    out = ['<rect x="%.1f" y="%.1f" width="%.1f" height="%.1f" fill="#F3F4F6" stroke="#9CA3AF" stroke-width="1.2"/>'
           % (X(0), Y(T), SZ, SZ),
           '<path d="%s Z" fill="#2563EB" opacity=".26" stroke="#2563EB" stroke-width="1.2"/>'
           % ' '.join('%s%.1f %.1f' % ('M' if i == 0 else 'L', X(a), Y(b)) for i, (a, b) in enumerate(band))]
    out.append('<text x="%.1f" y="%.1f" font-size="10" font-weight="800" fill="#1D4ED8" text-anchor="middle"%s>만난다</text>'
               % (X(T / 2), Y(T / 2) + 4, HALO))
    out.append('<text x="%.1f" y="%.1f" font-size="9.5" fill="#6B7280" text-anchor="middle"%s>못 만난다</text>'
               % (X(T * 0.76), Y(T * 0.24) + 4, HALO))
    out.append('<text x="%.1f" y="%.1f" font-size="9.5" fill="#6B7280" text-anchor="middle"%s>못 만난다</text>'
               % (X(T * 0.24), Y(T * 0.76) + 4, HALO))
    out.append('<text x="%.1f" y="%.0f" font-size="10" fill="#374151" text-anchor="middle"%s>내가 오는 시각 →</text>'
               % (X(T / 2), Y(0) + 15, HALO))
    out.append('<text x="%.1f" y="%.1f" font-size="10" fill="#374151" text-anchor="middle" transform="rotate(-90 %.1f %.1f)"%s>친구가 오는 시각 →</text>'
               % (X(0) - 12, Y(T / 2), X(0) - 12, Y(T / 2), HALO))
    out.append('<text x="376" y="%.1f" font-size="10.5" font-weight="800" fill="#1D4ED8" text-anchor="end"%s>'
               '띠의 넓이 비 = 1 − (%g/%g)² = %.4f</text>' % (Y(T) - 8, HALO, T - t, T, p))
    out.append('<text x="376" y="%.1f" font-size="10" fill="#6B7280" text-anchor="end"%s>곧 %.1f%%</text>'
               % (Y(T) + 8, HALO, p * 100))
    out.append(cap('%g분까지 기다려 준다면 — 만날 확률은 넓이로 잰다' % t))
    return ''.join(out)


# ── 147 · 조건부확률 — 가짜 양성이 더 많다 ─────────────────────────
def fp147():
    N, sick = 10000, 100
    well = N - sick
    sens, spec = 0.99, 0.99
    tp, fn = sick * sens, sick * (1 - sens)
    fp, tn = well * (1 - spec), well * spec
    assert abs(tp - 99) < 1e-9 and abs(fp - 99) < 1e-9
    ppv = tp / (tp + fp)
    assert abs(ppv - 0.5) < 1e-12

    out = []
    # 갈라지는 두 줄기 — 수가 아주 다른 두 집단
    for i, (nm, cnt, col, y) in enumerate((('환자 %d명' % sick, sick, '#BE123C', 46.0),
                                           ('건강한 사람 %d명' % well, well, '#6B7280', 86.0))):
        out.append('<path d="M96 66 L132 %.0f" stroke="%s" stroke-width="1.6"/>' % (y, col))
        out.append('<text x="136" y="%.0f" font-size="10.5" font-weight="800" fill="%s"%s>%s</text>' % (y + 4, col, HALO, nm))
    out.append('<text x="92" y="70" font-size="10.5" font-weight="800" fill="#111827" text-anchor="end"%s>1만 명</text>' % HALO)
    out.append('<text x="250" y="50" font-size="10" fill="#BE123C"%s>양성 %.0f명 (놓침 %.0f)</text>' % (HALO, tp, fn))
    out.append('<text x="250" y="90" font-size="10" fill="#B45309"%s>양성 %.0f명 — 가짜 양성</text>' % (HALO, fp))
    # 양성 전체를 한 막대로 — 절반이 가짜다
    bx, bw, by = 108.0, 240.0, 112.0
    half = bw * tp / (tp + fp)
    out.append('<rect x="%.1f" y="%.0f" width="%.1f" height="22" fill="#BE123C" opacity=".30" stroke="#BE123C" stroke-width="1.1"/>'
               % (bx, by, half))
    out.append('<rect x="%.1f" y="%.0f" width="%.1f" height="22" fill="#B45309" opacity=".30" stroke="#B45309" stroke-width="1.1"/>'
               % (bx + half, by, bw - half))
    out.append('<text x="%.1f" y="%.0f" font-size="10" font-weight="800" fill="#BE123C" text-anchor="middle"%s>진짜 %.0f</text>'
               % (bx + half / 2, by + 15, HALO, tp))
    out.append('<text x="%.1f" y="%.0f" font-size="10" font-weight="800" fill="#B45309" text-anchor="middle"%s>가짜 %.0f</text>'
               % (bx + half + (bw - half) / 2, by + 15, HALO, fp))
    out.append('<text x="%.1f" y="%.0f" font-size="10.5" font-weight="800" fill="#111827" text-anchor="middle"%s>'
               '양성 %.0f명 중 진짜 환자는 %.0f%%</text>' % (bx + bw / 2, by + 36, HALO, tp + fp, ppv * 100))
    out.append(cap('민감도 %.0f%% · 특이도 %.0f%% — 그런데 양성이면 환자일까' % (sens * 100, spec * 100)))
    return ''.join(out)


# ── 148 · 2×2 표로 독립을 판정한다 ─────────────────────────────────
def ci148():
    a, b, c, d = 40, 10, 35, 15           # 먹고·안지각 / 먹고·지각 / 안먹고·안지각 / 안먹고·지각
    n = a + b + c + d
    row = (a + c, b + d)                   # 지각 안 함 / 지각함
    colm = (a + b, c + d)                  # 아침 먹음 / 안 먹음
    assert n == 100 and row == (75, 25) and colm == (50, 50)
    Ea = colm[0] * row[0] / n
    assert abs(Ea - 37.5) < 1e-12

    CW, CH, X0, Y0 = 72.0, 26.0, 116.0, 48.0
    cells = [[a, c, row[0]], [b, d, row[1]], [colm[0], colm[1], n]]
    heads = ['아침 먹음', '안 먹음', '합']
    rowh = ['지각 안 함', '지각함', '합']
    out = []
    for j, t in enumerate(heads):
        out.append('<text x="%.1f" y="%.0f" font-size="10" font-weight="800" fill="#374151" text-anchor="middle"%s>%s</text>'
                   % (X0 + CW * j + CW / 2, Y0 - 6, HALO, t))
    for i in range(3):
        out.append('<text x="%.1f" y="%.1f" font-size="10" font-weight="800" fill="#374151" text-anchor="end"%s>%s</text>'
                   % (X0 - 8, Y0 + CH * i + 17, HALO, rowh[i]))
        for j in range(3):
            x, y = X0 + CW * j, Y0 + CH * i
            last = (i == 2 or j == 2)
            out.append('<rect x="%.1f" y="%.1f" width="%.0f" height="%.0f" fill="%s" stroke="#9CA3AF" stroke-width="1.1"/>'
                       % (x, y, CW, CH, '#F3F4F6' if last else '#fff'))
            out.append('<text x="%.1f" y="%.1f" font-size="11" font-weight="%s" fill="%s" text-anchor="middle"%s>%d</text>'
                       % (x + CW / 2, y + 17, '800' if (i, j) == (0, 0) else '400',
                          '#BE123C' if (i, j) == (0, 0) else '#111827', HALO, cells[i][j]))
    out.append('<text x="40" y="%.1f" font-size="10" font-weight="800" fill="#BE123C"%s>'
               '기대 %g = %d × %d ÷ %d</text>' % (Y0 + CH * 3 + 18, HALO, Ea, colm[0], row[0], n))
    out.append('<text x="364" y="%.1f" font-size="10" fill="#6B7280" text-anchor="end"%s>'
               '관측 %d — 기대보다 %.1f 많다</text>' % (Y0 + CH * 3 + 18, HALO, a, a - Ea))
    out.append(cap('아침을 먹는 것과 지각하는 것 — 정말 관계가 있을까'))
    return ''.join(out)


# ── 149 · 기댓값으로 보험료를 정한다 ───────────────────────────────
def ex149():
    pr, loss, fee = 0.02, 500.0, 20.0
    E = pr * loss
    assert abs(E - 10.0) < 1e-12
    margin = fee - E
    assert abs(margin - 10.0) < 1e-12

    base, S1, ZOOM = 136.0, 0.192, 20.0   # S1 = 손해액 축 (px/만원), 오른쪽은 20배
    S2 = S1 * ZOOM
    out = ['<path d="M44 %g H364" stroke="#9CA3AF" stroke-width="1.2"/>' % base]
    out.append('<rect x="70" y="%.1f" width="52" height="%.1f" rx="3" fill="#BE123C" opacity=".18" stroke="#BE123C" stroke-width="1.1"/>'
               % (base - S1 * loss, S1 * loss))
    out.append('<rect x="70" y="%.1f" width="52" height="%.1f" fill="#BE123C" opacity=".55"/>'
               % (base - S1 * loss * pr, S1 * loss * pr))
    out.append('<text x="96" y="%.1f" font-size="10.5" font-weight="800" fill="#BE123C" text-anchor="middle"%s>손해 %g만원</text>'
               % (base - S1 * loss - 6, HALO, loss))
    out.append('<text x="96" y="%.0f" font-size="10" fill="#6B7280" text-anchor="middle"%s>사고 확률 %g%%</text>'
               % (base + 14, HALO, pr * 100))
    for i, (nm, v, col) in enumerate((('기댓값 %g만원' % E, E, '#0E9384'), ('보험료 %g만원' % fee, fee, '#2563EB'))):
        x = 206.0 + i * 92
        out.append('<rect x="%.1f" y="%.1f" width="52" height="%.1f" rx="3" fill="%s" opacity=".22" stroke="%s" stroke-width="1.1"/>'
                   % (x, base - S2 * v, S2 * v, col, col))
        out.append('<text x="%.1f" y="%.1f" font-size="10.5" font-weight="800" fill="%s" text-anchor="middle"%s>%s</text>'
                   % (x + 26, base - S2 * v - 6, col, HALO, nm))
    out.append('<path d="M%.1f %.1f H%.1f" stroke="#0E9384" stroke-width="1.2" stroke-dasharray="4 3"/>'
               % (206.0, base - S2 * E, 350.0))
    out.append('<text x="352" y="%.1f" font-size="10" font-weight="800" fill="#0B6E63"%s>차액 %g만원</text>'
               % (base - S2 * (E + margin / 2), HALO, margin))
    out.append('<text x="%.1f" y="%.0f" font-size="9.5" fill="#6B7280" text-anchor="middle"%s>※ 오른쪽 두 막대는 %g배로 늘려 그렸다</text>'
               % (252, base + 14, HALO, ZOOM))
    out.append(cap('사고는 드물다 — 그런데 보험료는 무엇을 보고 정할까'))
    return ''.join(out)


# ── 150 · 평균이 같아도 흩어짐이 다르다 ────────────────────────────
def vs150():
    base = [-1.6, -1.1, -0.7, -0.3, 0, 0.3, 0.7, 1.1, 1.6, 0.2, -0.2, 0]
    assert abs(sum(base)) < 1e-12
    mk = lambda s: [70 + z * s for z in base]
    mean = lambda v: sum(v) / len(v)
    var = lambda v: sum((x - mean(v)) ** 2 for x in v) / len(v)
    A, B = mk(5), mk(12)
    assert abs(mean(A) - 70) < 1e-9 and abs(mean(B) - 70) < 1e-9
    assert var(B) > var(A) * 5, (var(A), var(B))

    X = lambda v: 200 + 4.4 * (v - 70)
    out = ['<path d="M%.1f 30 V140" stroke="#BE123C" stroke-width="1.3" stroke-dasharray="4 3"/>' % X(70)]
    out.append('<text x="%.1f" y="26" font-size="10" font-weight="800" fill="#BE123C" text-anchor="middle"%s>평균 70 — 둘이 같다</text>'
               % (X(70), HALO))
    for i, (nm, v, col, y) in enumerate((('A반', A, '#2563EB', 62.0), ('B반', B, '#0E9384', 112.0))):
        out.append('<path d="M%.1f %.0f H%.1f" stroke="#9CA3AF" stroke-width="1.1"/>' % (X(70) - 92, y, X(70) + 92))
        for x0 in v:
            out.append('<circle cx="%.1f" cy="%.0f" r="4.2" fill="%s" opacity=".55"/>' % (X(x0), y, col))
        out.append('<text x="%.1f" y="%.1f" font-size="10.5" font-weight="800" fill="%s"%s>%s 분산 %.2f · 표준편차 %.2f</text>'
                   % (X(70) - 92, y - 10, col, HALO, nm, var(v), math.sqrt(var(v))))
    out.append('<text x="200" y="152" font-size="10" fill="#6B7280" text-anchor="middle"%s>'
               '같은 평균, 다른 흩어짐 — 평균만으로는 두 반을 가를 수 없다</text>' % HALO)
    out.append(cap('두 반의 평균이 똑같다 — 그러면 두 반은 같은 반일까'))
    return ''.join(out)


FNS = [('dv141', dv141), ('pa142', pa142), ('sb143', sb143), ('be144', be144), ('ei145', ei145),
       ('mp146', mp146), ('fp147', fp147), ('ci148', ci148), ('ex149', ex149), ('vs150', vs150)]

if __name__ == '__main__':
    import sys
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass
    for nm, f in FNS:
        s = f()
        sys.stdout.write('%-7s %5d자  ok\n' % (nm, len(s)))
