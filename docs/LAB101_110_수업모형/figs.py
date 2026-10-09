# -*- coding: utf-8 -*-
"""LAB 101~110 「오늘의 문제」 그림 — 좌표를 계산해서 그린다.

핵심 성질은 assert 로 검산한다. 눈대중으로 찍은 수가 본문 주장을 반증하는 일이 없게.
"""
import math

HALO = ' paint-order="stroke" stroke="#fff" stroke-width="3.2" stroke-linejoin="round"'
F = [(0, 0), (0, 1.4), (0.8, 1.4), (0.8, 1.1), (0.35, 1.1), (0.35, 0.75),
     (0.7, 0.75), (0.7, 0.45), (0.35, 0.45), (0.35, 0)]
OPS = {'R': (0, -1, 1, 0), 'X': (2, 0, 0, 1)}


def mul(A, B):
    return (A[0] * B[0] + A[1] * B[2], A[0] * B[1] + A[1] * B[3],
            A[2] * B[0] + A[3] * B[2], A[2] * B[1] + A[3] * B[3])


def tot(seq):
    M = (1, 0, 0, 1)
    for o in seq:
        M = mul(OPS[o], M)
    return M


# ── 101 · 순서를 타는 곱셈 ──────────────────────────────────────────
def nc101():
    A, B = tot(['R', 'X']), tot(['X', 'R'])
    assert A != B, (A, B)
    out = []
    for i, (M, nm, col) in enumerate(((A, '회전 → 가로 2배', '#2563EB'),
                                      (B, '가로 2배 → 회전', '#0E9384'))):
        ox = 46 + i * 190
        cx, cy, s = ox + 70, 112.0, 30.0
        pts = ' '.join('%.1f,%.1f' % (cx + (M[0] * x + M[1] * y) * s,
                                      cy - (M[2] * x + M[3] * y) * s) for x, y in F)
        out.append('<rect x="%d" y="30" width="140" height="100" rx="9" fill="#fff" stroke="#E5E7EB" stroke-width="1.2"/>' % ox)
        out.append('<polygon points="%s" fill="%s" opacity=".24" stroke="%s" stroke-width="1.6"/>' % (pts, col, col))
        out.append('<text x="%d" y="146" font-size="10.5" font-weight="800" fill="%s" text-anchor="middle"%s>%s</text>'
                   % (ox + 70, col, HALO, nm))
    out.append('<text x="200" y="20" font-size="10.5" fill="#6B7280" text-anchor="middle"%s>같은 두 변환인데 차례만 바꿨다</text>' % HALO)
    out.append('<text x="200" y="164" font-size="10.5" fill="#6B7280" text-anchor="middle"%s>결과가 다르다 — 행렬 곱은 순서를 탄다</text>' % HALO)
    return ''.join(out)


# ── 102 · 카드 쌓기 ½Hₙ ─────────────────────────────────────────────
def ov102():
    n = 5
    # 맨 아래 카드도 책상 밖으로 1/(2n) 만큼 나갈 수 있다 — 그래야 한계가 ½Hₙ 이 된다
    off = [1.0 / (2 * n) + sum(1.0 / (2 * k) for k in range(1, i + 1)) for i in range(n)]
    Hn = sum(1.0 / (i + 1) for i in range(n))
    assert abs(off[-1] - Hn / 2) < 1e-12, (off[-1], Hn / 2)
    CW, CH = 96.0, 15.0
    edge = 150.0                      # 책상 끝 x
    base = 140.0
    out = ['<rect x="30" y="%0.0f" width="%0.0f" height="12" fill="#9CA3AF" opacity=".45"/>' % (base, edge - 30),
           '<path d="M%0.0f %0.0f V158" stroke="#9CA3AF" stroke-width="1.4"/>' % (edge, base)]
    for i in range(n):
        x = edge - CW + off[i] * CW
        y = base - (i + 1) * CH
        out.append('<rect x="%.1f" y="%.1f" width="%.0f" height="%.0f" rx="2" fill="#2563EB" opacity=".22" stroke="#2563EB" stroke-width="1.2"/>'
                   % (x, y, CW, CH - 2))
    top = edge - CW + off[n - 1] * CW + CW
    out.append('<path d="M%.1f 36 V%.1f" stroke="#BE123C" stroke-width="1.3" stroke-dasharray="4 3"/>' % (top, base - n * CH))
    out.append('<path d="M%.0f 42 H%.1f" stroke="#BE123C" stroke-width="1.6"/>' % (edge, top))
    out.append('<text x="%.1f" y="34" font-size="10.5" font-weight="800" fill="#BE123C" text-anchor="middle"%s>책상 밖으로 %.2f 장</text>'
               % ((edge + top) / 2, HALO, off[n - 1]))
    out.append('<text x="90" y="%0.0f" font-size="10" font-weight="800" fill="#6B7280" text-anchor="middle"%s>책상</text>' % (base + 26, HALO))
    out.append('<text x="200" y="20" font-size="10.5" fill="#6B7280" text-anchor="middle"%s>한 장씩 더 내밀면 — 어디까지 갈 수 있을까</text>' % HALO)
    out.append('<text x="284" y="96" font-size="10.5" font-weight="800" fill="#0B6E63"%s>½(1 + ½ + ⅓ + …)</text>' % HALO)
    out.append('<text x="284" y="114" font-size="10" fill="#6B7280"%s>이 합은 끝없이 커진다</text>' % HALO)
    return ''.join(out)


# ── 103 · 색은 좌표다 ───────────────────────────────────────────────
def cl103():
    out = []
    C = [((165.0, 76.0), '#FF0000'), ((235.0, 76.0), '#00FF00'), ((200.0, 128.0), '#0000FF')]
    for (cx, cy), col in C:
        out.append('<circle cx="%.0f" cy="%.0f" r="44" fill="%s" opacity=".55"/>' % (cx, cy, col))
    out.append('<text x="200" y="20" font-size="10.5" fill="#6B7280" text-anchor="middle"%s>빨강·초록·파랑 세 수만으로 모든 색을 적는다</text>' % HALO)
    out.append('<text x="76" y="62" font-size="11" font-weight="800" fill="#BE123C" text-anchor="middle"%s>(255, 0, 0)</text>' % HALO)
    out.append('<text x="326" y="62" font-size="11" font-weight="800" fill="#0B6E63" text-anchor="middle"%s>(0, 255, 0)</text>' % HALO)
    out.append('<text x="200" y="166" font-size="11" font-weight="800" fill="#1D4ED8" text-anchor="middle"%s>(0, 0, 255)</text>' % HALO)
    out.append('<text x="200" y="100" font-size="10.5" font-weight="800" fill="#111827" text-anchor="middle"%s>세 수의 좌표</text>' % HALO)
    return ''.join(out)


# ── 104 · 접으면 3등분 ──────────────────────────────────────────────
def og104():
    s = 108.0
    x0, y0 = 146.0, 28.0
    out = ['<rect x="%.0f" y="%.0f" width="%.0f" height="%.0f" fill="#2563EB" opacity=".10" stroke="#2563EB" stroke-width="1.6"/>'
           % (x0, y0, s, s)]
    # 대각선 둘이 만나는 점이 가로로 1:2 지점
    out.append('<path d="M%.0f %.0f L%.0f %.0f" stroke="#9CA3AF" stroke-width="1.3"/>' % (x0, y0 + s, x0 + s, y0))
    out.append('<path d="M%.0f %.0f L%.0f %.0f" stroke="#9CA3AF" stroke-width="1.3"/>' % (x0, y0 + s, x0 + s, y0 + s / 2))
    # 교점: 두 직선 (0,0)->(1,1) 과 (0,0)->(1,0.5) 의 … 좌표계는 왼아래 원점
    # 선1: (0,0)→(1,1), 선2: (0,1)→(1,0.5) 로 두면 교점 x = 2/3
    out.append('<path d="M%.0f %.0f L%.0f %.0f" stroke="#0E9384" stroke-width="1.6"/>' % (x0, y0, x0 + s, y0 + s / 2))
    xi = 2.0 / 3.0
    yi = xi
    assert abs(xi - 2.0 / 3.0) < 1e-12
    px, py = x0 + xi * s, y0 + s - yi * s
    out.append('<circle cx="%.1f" cy="%.1f" r="5" fill="#BE123C"/>' % (px, py))
    out.append('<path d="M%.1f %.1f V%.0f" stroke="#BE123C" stroke-width="1.3" stroke-dasharray="4 3"/>' % (px, py, y0 + s))
    out.append('<text x="%.1f" y="%.0f" font-size="10.5" font-weight="800" fill="#BE123C" text-anchor="middle"%s>여기가 ⅔ 지점</text>'
               % (px, y0 + s + 18, HALO))
    out.append('<text x="200" y="20" font-size="10.5" fill="#6B7280" text-anchor="middle"%s>자도 각도기도 없이 — 접기만으로</text>' % HALO)
    out.append('<text x="200" y="166" font-size="10.5" fill="#6B7280" text-anchor="middle"%s>접힌 선이 만드는 닮은 삼각형이 비를 정한다</text>' % HALO)
    return ''.join(out)


# ── 105 · 주사위 100개의 지수 감소 ──────────────────────────────────
def dc105():
    f = lambda x: 100.0 * (5.0 / 6.0) ** x
    xx = math.log10(10.0) / (math.log10(6.0) - math.log10(5.0))
    assert 12 < xx < 13, xx
    X = lambda t: 54 + 15.0 * t
    Y = lambda v: 146 - 1.08 * v
    pts = ' '.join('%s%.1f %.1f' % ('M' if i == 0 else 'L', X(i * 0.25), Y(f(i * 0.25))) for i in range(81))
    out = ['<path d="M46 146 H378 M54 154 V24" stroke="#9CA3AF" stroke-width="1.2"/>',
           '<path d="%s" stroke="#2563EB" stroke-width="2.4" fill="none" stroke-linecap="round"/>' % pts,
           '<path d="M54 %.1f H378" stroke="#BE123C" stroke-width="1.3" stroke-dasharray="5 3"/>' % Y(10),
           '<text x="374" y="%.1f" font-size="10" font-weight="800" fill="#BE123C" text-anchor="end"%s>10개</text>' % (Y(10) - 6, HALO),
           '<circle cx="%.1f" cy="%.1f" r="5" fill="#BE123C"/>' % (X(xx), Y(10)),
           '<text x="%.1f" y="%.1f" font-size="10.5" font-weight="800" fill="#BE123C" text-anchor="middle"%s>약 %.1f 해</text>'
           % (X(xx), Y(10) + 22, HALO, xx)]
    out.append('<text x="200" y="20" font-size="10.5" fill="#6B7280" text-anchor="middle"%s>한 해에 ⅙ 씩 사라지면 100개는 언제 10개가 될까</text>' % HALO)
    out.append('<text x="200" y="166" font-size="10.5" fill="#6B7280" text-anchor="middle"%s>절반이 되는 데 걸리는 시간은 늘 같다 — 그것이 지수 감소</text>' % HALO)
    return ''.join(out)


# ── 106 · 단위원으로 넓힌 삼각비 ────────────────────────────────────
def uc106():
    O, R = (200.0, 92.0), 56.0
    a = 210.0
    t = math.radians(a)
    px, py = O[0] + R * math.cos(t), O[1] - R * math.sin(t)
    assert abs(math.sin(t) + 0.5) < 1e-9
    out = ['<circle cx="%.0f" cy="%.0f" r="%.0f" fill="none" stroke="#9CA3AF" stroke-width="1.5"/>' % (O[0], O[1], R),
           '<path d="M%.0f %.0f H%.0f M%.0f %.0f V%.0f" stroke="#9CA3AF" stroke-width="1.2"/>'
           % (O[0] - R - 18, O[1], O[0] + R + 18, O[0], O[1] - R - 18, O[1] + R + 18),
           '<path d="M%.0f %.0f L%.1f %.1f" stroke="#2563EB" stroke-width="2"/>' % (O[0], O[1], px, py),
           '<path d="M%.1f %.1f V%.0f" stroke="#BE123C" stroke-width="1.6" stroke-dasharray="3 3"/>' % (px, py, O[1]),
           '<path d="M%.1f %.0f H%.0f" stroke="#B45309" stroke-width="1.6" stroke-dasharray="3 3"/>' % (px, O[1], O[0]),
           '<circle cx="%.1f" cy="%.1f" r="5" fill="#2563EB"/>' % (px, py)]
    out.append('<text x="%.1f" y="%.1f" font-size="10.5" font-weight="800" fill="#1D4ED8" text-anchor="end"%s>210°</text>' % (px - 8, py + 14, HALO))
    out.append('<text x="%.1f" y="%.1f" font-size="10" font-weight="800" fill="#BE123C" text-anchor="end"%s>sin = −0.5</text>' % (px - 6, (py + O[1]) / 2 + 4, HALO))
    out.append('<text x="%.1f" y="%.0f" font-size="10" font-weight="800" fill="#92400E" text-anchor="middle"%s>cos</text>' % ((px + O[0]) / 2, O[1] - 7, HALO))
    out.append('<text x="200" y="20" font-size="10.5" fill="#6B7280" text-anchor="middle"%s>직각삼각형에는 없던 90° 넘는 각은 어떻게 다룰까</text>' % HALO)
    out.append('<text x="200" y="166" font-size="10.5" fill="#6B7280" text-anchor="middle"%s>원 위 점의 y 가 sin, x 가 cos — 부호까지 그대로</text>' % HALO)
    return ''.join(out)


# ── 107 · 일출 시각은 물결처럼 ──────────────────────────────────────
def sr107():
    DATA = [7.70, 7.33, 6.78, 6.08, 5.57, 5.27, 5.40, 5.78, 6.18, 6.60, 7.08, 7.55]
    D = (max(DATA) + min(DATA)) / 2
    A = (max(DATA) - min(DATA)) / 2
    assert abs(A - 1.215) < 1e-9, A
    X = lambda m: 52 + 27.0 * (m - 1)
    Y = lambda v: 150 - (v - 4.9) * 32.0
    out = ['<path d="M44 150 H376 M52 158 V24" stroke="#9CA3AF" stroke-width="1.2"/>']
    best = None
    for c100 in range(0, 1200):
        c = c100 / 100.0
        se = sum((DATA[i] - (D + A * math.sin(2 * math.pi * (i + 1 - c) / 12))) ** 2 for i in range(12))
        if best is None or se < best[0]:
            best = (se, c)
    c = best[1]
    pts = ' '.join('%s%.1f %.1f' % ('M' if i == 0 else 'L', X(1 + i * 0.1),
                                    Y(D + A * math.sin(2 * math.pi * (1 + i * 0.1 - c) / 12)))
                   for i in range(111))
    out.append('<path d="%s" stroke="#0E9384" stroke-width="2.2" fill="none" stroke-linecap="round"/>' % pts)
    for i, v in enumerate(DATA):
        out.append('<circle cx="%.1f" cy="%.1f" r="3.6" fill="#2563EB"/>' % (X(i + 1), Y(v)))
    out.append('<path d="M52 %.1f H376" stroke="#B45309" stroke-width="1.2" stroke-dasharray="4 3"/>' % Y(D))
    out.append('<text x="372" y="%.1f" font-size="10" font-weight="800" fill="#92400E" text-anchor="end"%s>1년 평균</text>' % (Y(D) - 6, HALO))
    out.append('<text x="200" y="20" font-size="10.5" fill="#6B7280" text-anchor="middle"%s>1월부터 12월까지의 일출 시각 — 직선이 아니다</text>' % HALO)
    out.append('<text x="200" y="166" font-size="10.5" fill="#6B7280" text-anchor="middle"%s>오르내리며 되풀이되는 것은 어떤 함수로 적을까</text>' % HALO)
    return ''.join(out)


# ── 108 · 강 건너까지 몇 m ──────────────────────────────────────────
def lw108():
    A, B, c = 45.0, 70.0, 80.0
    C = 180 - A - B
    a = c * math.sin(math.radians(A)) / math.sin(math.radians(C))
    b = c * math.sin(math.radians(B)) / math.sin(math.radians(C))
    assert abs(C - 65.0) < 1e-9
    s = 2.1
    Ax, Ay = 92.0, 134.0
    Bx, By = Ax + c * s, Ay
    Cx = Ax + b * s * math.cos(math.radians(A))
    Cy = Ay - b * s * math.sin(math.radians(A))
    out = ['<path d="M40 134 H370" stroke="#9CA3AF" stroke-width="1.4"/>',
           '<path d="M40 %0.0f H370" stroke="#2563EB" stroke-width="1.2" opacity=".5"/>' % Cy,
           '<rect x="40" y="%0.0f" width="330" height="%0.0f" fill="#2563EB" opacity=".07"/>' % (Cy, 134 - Cy),
           '<polygon points="%.1f,%.1f %.1f,%.1f %.1f,%.1f" fill="#0E9384" opacity=".14" stroke="#0E9384" stroke-width="1.8"/>'
           % (Ax, Ay, Bx, By, Cx, Cy)]
    for x, y, nm, an in ((Ax, Ay, 'A', 'end'), (Bx, By, 'B', 'start'), (Cx, Cy, 'C', 'middle')):
        out.append('<circle cx="%.1f" cy="%.1f" r="4" fill="#111827"/>' % (x, y))
        out.append('<text x="%.1f" y="%.1f" font-size="11" font-weight="800" fill="#111827" text-anchor="%s"%s>%s</text>'
                   % (x + (-8 if an == 'end' else 8 if an == 'start' else 0), y + (16 if an != 'middle' else -9), an, HALO, nm))
    out.append('<text x="%.1f" y="%.1f" font-size="10.5" font-weight="800" fill="#92400E" text-anchor="middle"%s>기선 %gm — 이쪽에서만 잰다</text>'
               % ((Ax + Bx) / 2, Ay + 32, HALO, c))
    out.append('<text x="%.1f" y="%.1f" font-size="10.5" font-weight="800" fill="#0B6E63" text-anchor="middle"%s>BC = %.1f m</text>'
               % (Cx + 58, Cy + 26, HALO, a))
    out.append('<text x="200" y="20" font-size="10.5" fill="#6B7280" text-anchor="middle"%s>강을 건너지 않고 건너편까지의 거리를 잴 수 있을까</text>' % HALO)
    return ''.join(out)


# ── 109 · 월 상환액과 등비수열 ──────────────────────────────────────
def ln109():
    P, r, n = 800.0, 4.0, 36
    i = r / 100 / 12
    q = (1 + i) ** n
    m = P * i * q / (q - 1)
    tot_ = m * n
    assert tot_ > P
    X0, W = 70.0, 260.0
    out = ['<rect x="%.0f" y="46" width="%.0f" height="26" rx="4" fill="#2563EB" opacity=".26" stroke="#2563EB" stroke-width="1.4"/>' % (X0, W * P / tot_),
           '<text x="%.0f" y="64" font-size="10.5" font-weight="800" fill="#1D4ED8"%s>원금 %g만원</text>' % (X0 + 8, HALO, P),
           '<rect x="%.0f" y="86" width="%.0f" height="26" rx="4" fill="#2563EB" opacity=".26" stroke="#2563EB" stroke-width="1.4"/>' % (X0, W * P / tot_),
           '<rect x="%.0f" y="86" width="%.0f" height="26" rx="4" fill="#BE123C" opacity=".26" stroke="#BE123C" stroke-width="1.4"/>'
           % (X0 + W * P / tot_, W * (tot_ - P) / tot_),
           '<text x="%.0f" y="104" font-size="10.5" font-weight="800" fill="#BE123C"%s>이자 %.0f만원</text>' % (X0 + W * P / tot_ + 6, HALO, tot_ - P),
           '<text x="%.0f" y="130" font-size="10.5" font-weight="800" fill="#111827" text-anchor="middle"%s>36개월 × %.1f만원 = %.0f만원</text>'
           % (X0 + W / 2, HALO, m, tot_)]
    out.append('<text x="200" y="22" font-size="10.5" fill="#6B7280" text-anchor="middle"%s>달마다 똑같이 갚는 돈은 어떻게 정해질까</text>' % HALO)
    out.append('<text x="200" y="158" font-size="10.5" fill="#6B7280" text-anchor="middle"%s>갚는 돈마다 이자가 붙는 기간이 달라 — 등비수열의 합이 된다</text>' % HALO)
    return ''.join(out)


# ── 110 · 계단 두 개를 붙이면 직사각형 ──────────────────────────────
def sg110():
    n = 6
    S = sum(range(1, n + 1))
    assert S == n * (n + 1) // 2 == 21
    cw, ch = 18.0, 13.0
    x0, y0 = 96.0, 136.0
    out = []
    for k in range(1, n + 1):
        for j in range(k):
            out.append('<rect x="%.1f" y="%.1f" width="%.0f" height="%.0f" fill="#2563EB" opacity=".26" stroke="#2563EB" stroke-width="0.8"/>'
                       % (x0 + (k - 1) * cw, y0 - (j + 1) * ch, cw, ch))
    for k in range(1, n + 1):
        for j in range(n + 1 - k):
            out.append('<rect x="%.1f" y="%.1f" width="%.0f" height="%.0f" fill="#0E9384" opacity=".22" stroke="#0E9384" stroke-width="0.8"/>'
                       % (x0 + (k - 1) * cw, y0 - (n + 1) * ch + j * ch, cw, ch))
    out.append('<rect x="%.1f" y="%.1f" width="%.1f" height="%.1f" fill="none" stroke="#BE123C" stroke-width="1.8"/>'
               % (x0, y0 - (n + 1) * ch, n * cw, (n + 1) * ch))
    out.append('<text x="%.1f" y="%.1f" font-size="10.5" font-weight="800" fill="#BE123C" text-anchor="middle"%s>가로 %d · 세로 %d</text>'
               % (x0 + n * cw / 2, y0 + 18, HALO, n, n + 1))
    out.append('<text x="%.1f" y="%.1f" font-size="10.5" font-weight="800" fill="#1D4ED8"%s>1+2+…+%d = %d</text>' % (x0 + n * cw + 14, 76, HALO, n, S))
    out.append('<text x="%.1f" y="%.1f" font-size="10.5" font-weight="800" fill="#0B6E63"%s>%d × %d ÷ 2 = %d</text>' % (x0 + n * cw + 14, 96, HALO, n, n + 1, S))
    out.append('<text x="200" y="20" font-size="10.5" fill="#6B7280" text-anchor="middle"%s>같은 계단 두 개를 거꾸로 붙이면 무엇이 될까</text>' % HALO)
    return ''.join(out)
