# ── 341 · 외운 것인가 배운 것인가 ──────────────────────────────────
# 난수 씨앗이 JS 의 32 비트 자르기에 기대고 있어 _numbers.mjs 로 뽑아 적었다.
HO = [(1, .3538, .4147), (2, .3536, .4142), (3, .2024, .2167), (4, .2020, .2174),
      (5, .1653, .1469), (6, .1103, .2277), (7, .0791, .2794), (8, .0233, .2225),
      (9, .0000, .3872)]


def ho341():
    tr = [r[1] for r in HO]
    va = [r[2] for r in HO]
    best = min(range(9), key=lambda i: va[i]) + 1
    assert all(tr[i] >= tr[i + 1] - 1e-9 for i in range(8)), tr      # 훈련 오차는 줄기만 한다
    assert best == 5 and tr[8] == 0 and va[8] > va[4] * 2, (best, va)
    ox, oy, w, h = 56.0, 146.0, 230.0, 96.0
    X = lambda d: ox + (d - 1) * w / 8
    Y = lambda v: oy - v / 0.42 * h
    out = [poly([(ox - 6, oy), (ox + w + 12, oy)], GREY, 1.0),
           poly([(ox, oy + 6), (ox, oy - h - 8)], GREY, 1.0)]
    for i in range(8):
        out.append(poly([(X(i + 1), Y(tr[i])), (X(i + 2), Y(tr[i + 1]))], '#2563EB', 2.2))
        out.append(poly([(X(i + 1), Y(va[i])), (X(i + 2), Y(va[i + 1]))], '#D97706', 2.2))
    for i in range(9):
        out.append(dot(X(i + 1), Y(tr[i]), 2.4, '#2563EB'))
        out.append(dot(X(i + 1), Y(va[i]), 2.4, '#D97706'))
    out.append(poly([(X(best), oy), (X(best), Y(va[best - 1]) - 8)], '#0E9384', 1.2, dash=1))
    out.append(dot(X(best), Y(va[best - 1]), 4.4, '#0E9384'))
    out.append(txt(X(best), Y(va[best - 1]) - 13, '가장 낮은 곳 %d차' % best, 9, '#0E9384',
                   anc='middle', w=800))
    out.append(txt(ox - 6, oy + 14, '1차', 9, '#6B7280'))
    out.append(txt(ox + w + 2, oy + 14, '9차', 9, '#6B7280', anc='middle'))
    out.append(txt(ox - 4, 44, '오차', 9, '#6B7280', anc='end'))
    out.append(txt(300, 46, '훈련 오차', 9.5, '#2563EB', w=800))
    out.append(txt(300, 62, '검증 오차', 9.5, '#D97706', w=800))
    for i, d in enumerate((1, 5, 9)):
        out.append(txt(300, 86 + i * 18, '%d차  %.3f / %.3f' % (d, tr[d - 1], va[d - 1]), 9,
                       '#111827'))
    out.append(txt(300, 148, '9차는 훈련 오차 0', 9, '#BE123C', w=800))
    out.append(txt(14, 176, '훈련 오차는 끝까지 줄어드는데 검증 오차는 5차를 지나 다시 커진다',
                   9.5, '#6B7280'))
    out.append(cap('외운 것일까 배운 것일까'))
    return ''.join(out)


# ── 342 · 줄이면서 무엇을 남기나 ───────────────────────────────────
def _pl_img(noise):
    g = []
    for r in range(8):
        row = []
        for c in range(8):
            v = 0.15 if c < 4 else 0.75
            if r == c:
                v = min(1.0, v + 0.25)
            row.append(v)
        g.append(row)
    g[1][1] = max(g[1][1], noise)
    return g


def _pl_pool(g, k):
    return [[(max(g[r][c], g[r][c + 1], g[r + 1][c], g[r + 1][c + 1]) if k == 'max'
              else (g[r][c] + g[r][c + 1] + g[r + 1][c] + g[r + 1][c + 1]) / 4)
             for c in range(0, 8, 2)] for r in range(0, 8, 2)]


def pl342():
    g = _pl_img(1.0)
    mx, av = _pl_pool(g, 'max'), _pl_pool(g, 'avg')
    assert abs(mx[0][0] - 1.0) < 1e-9 and abs(av[0][0] - 0.425) < 1e-9, (mx[0][0], av[0][0])
    edge = lambda m: sum(abs(m[r][c + 1] - m[r][c]) for r in range(len(m))
                         for c in range(len(m[0]) - 1)) / (len(m) * (len(m[0]) - 1))
    e0, em, ea = edge(g), edge(mx), edge(av)
    assert em > ea, (em, ea)
    out = []
    S = 11.0
    for r in range(8):
        for c in range(8):
            v = g[r][c]
            lv = int(round(255 * (0.1 + 0.85 * v)))
            out.append('<rect x="%.1f" y="%.1f" width="%.1f" height="%.1f" fill="rgb(%d,%d,%d)"/>'
                       % (24 + c * S, 44 + r * S, S - 0.8, S - 0.8, lv, lv, lv))
    out.append('<rect x="%.1f" y="%.1f" width="%.1f" height="%.1f" fill="none" stroke="#BE123C" '
               'stroke-width="1.6"/>' % (24 + S, 44 + S, S - 0.8, S - 0.8))
    out.append(txt(24, 40, '원본 8 × 8 — 붉은 칸이 잡음', 9, '#6B7280'))
    for k, (name, m, col) in enumerate([('최대 풀링', mx, '#BE123C'), ('평균 풀링', av, '#0E9384')]):
        bx = 158.0 + k * 118.0
        for r in range(4):
            for c in range(4):
                lv = int(round(255 * (0.1 + 0.85 * m[r][c])))
                out.append('<rect x="%.1f" y="%.1f" width="%.1f" height="%.1f" '
                           'fill="rgb(%d,%d,%d)"/>'
                           % (bx + c * 19, 52 + r * 19, 18.2, 18.2, lv, lv, lv))
        out.append(txt(bx, 40, name, 9.5, col, w=800))
        out.append(txt(bx, 146, '잡음 칸 → %.3f' % m[0][0], 9.5, col, w=800))
        out.append(txt(bx, 162, '경계 %.3f' % edge(m), 9.5, '#6B7280'))
    out.append(txt(24, 146, '칸 수 64 → 16', 9.5, '#111827', w=800))
    out.append(txt(24, 162, '원본 경계 %.3f' % e0, 9.5, '#6B7280'))
    out.append(cap('줄이면서 무엇을 남길까'))
    return ''.join(out)


# ── 343 · 점수를 확률로 ────────────────────────────────────────────
def sg343():
    w, b = 1.0, 0.0
    sig = lambda z: 1 / (1 + exp(-z))
    assert abs(sig(0) - 0.5) < 1e-12
    assert abs(sig(0) * (1 - sig(0)) - 0.25) < 1e-12          # 경계에서의 기울기 = w/4
    ox, oy, u, hh = 44.0, 150.0, 23.0, 96.0
    X = lambda t: ox + (t + 5) * u * 0.6
    Y = lambda v: oy - v * hh
    out = [poly([(X(-5), oy), (X(5), oy)], GREY, 1.1),
           poly([(ox, oy + 6), (ox, oy - hh - 10)], GREY, 1.1)]
    out.append(poly([(X(-5), Y(1)), (X(5), Y(1))], '#D1D5DB', 1.0, dash=1))
    out.append(poly([(X(-5), Y(0.5)), (X(5), Y(0.5))], '#BE123C', 1.2, dash=1))
    out.append(poly([(X(-5 + i * 10 / 80), Y(sig(w * (-5 + i * 10 / 80) + b))) for i in range(81)],
                    '#2563EB', 2.4))
    out.append(poly([(X(0), oy), (X(0), Y(1.05))], '#0E9384', 1.2, dash=1))
    out.append(dot(X(0), Y(0.5), 4.0, '#0E9384'))
    out.append(txt(X(0) + 6, Y(1.05) + 10, '판정 경계 x = −b/w', 9, '#0E9384', w=800))
    out.append(txt(ox - 4, Y(1) + 3, '1', 9, '#6B7280', anc='end'))
    out.append(txt(ox - 4, Y(0.5) + 3, '0.5', 9, '#BE123C', anc='end'))
    out.append(txt(ox - 4, oy + 3, '0', 9, '#6B7280', anc='end'))
    out.append(txt(248, 46, 'σ(z) = 1 ÷ (1 + e^(−z))', 10, '#2563EB', w=800))
    out.append(txt(248, 70, 'z = wx + b', 10, '#111827'))
    for i, z in enumerate((-2.0, 0.0, 2.0)):
        out.append(txt(248, 92 + i * 18, 'z = %+.0f → %.3f' % (z, sig(z)), 9.5, '#111827'))
    out.append(txt(248, 150, '경계에서의 기울기 = w ÷ 4', 9.5, '#B45309', w=800))
    out.append(txt(14, 168, '어떤 수를 넣어도 0 과 1 사이로 눌린다 — 0.5 가 되는 자리가 판정 경계',
                   9.5, '#6B7280'))
    out.append(cap('점수를 확률로 바꾸는 자'))
    return ''.join(out)


# ── 344 · 붙이고 옮기고 ────────────────────────────────────────────
KM2 = [(0, 0.0, 426.506), (1, 2.7173, 116.379), (2, 0.0, 116.379)]
KM3 = [(0, 0.0, 396.997), (1, 5.2119, 66.576), (2, 0.0, 66.576)]


def km344():
    assert KM2[1][2] < KM2[0][2] and KM2[2][1] == 0, KM2
    assert KM3[1][2] < KM2[1][2], (KM2[1][2], KM3[1][2])
    out = [txt(22, 46, '단계', 9.5, '#6B7280'), txt(96, 46, '중심이 움직인 거리', 9.5, '#6B7280'),
           txt(248, 46, '묶음 안 거리 제곱합', 9.5, '#6B7280')]
    out.append(poly([(18, 52), (382, 52)], GREY, 1.0))
    for k, (name, rows, col) in enumerate([('k = 2', KM2, '#2563EB'), ('k = 3', KM3, '#0E9384')]):
        y0 = 72.0 + k * 54.0
        out.append(txt(22, y0 + 16, name, 10, col, w=800))
        for i, (it, mv, sse) in enumerate(rows):
            y = y0 + i * 16.0
            out.append(txt(78, y, '%d' % it, 9.5, '#111827', anc='end'))
            out.append(txt(96, y, '%.4f' % mv, 9.5, '#BE123C' if mv == 0 and it else '#111827',
                           w=800 if mv == 0 and it else None))
            out.append(txt(248, y, '%.3f' % sse, 9.5, col))
            out.append(rect(320, y - 9, min(60, sse / 426.506 * 60), 9, col, '.40'))
    out.append(txt(14, 176, '거리 제곱합은 줄기만 하고 중심이 멈추면 끝난다 — k 는 우리가 고른다',
                   9.5, '#6B7280'))
    out.append(cap('붙이고 옮기기를 되풀이하면'))
    return ''.join(out)


# ── 345 · 놓침과 헛경보의 맞바꿈 ───────────────────────────────────
ROC = [(0.2, 100.0, 76.0), (0.4, 88.0, 34.0), (0.5, 74.0, 15.0),
       (0.6, 58.0, 7.0), (0.8, 19.0, 0.0)]
AUC = [(0.0, 0.435), (0.25, 0.568), (1.0, 0.882), (2.0, 0.996)]


def rc345():
    assert all(ROC[i][1] > ROC[i + 1][1] and ROC[i][2] >= ROC[i + 1][2] for i in range(4)), ROC
    assert AUC[0][1] < 0.6 < AUC[2][1] < AUC[3][1], AUC
    ox, oy, s = 48.0, 150.0, 104.0
    out = [rect(ox, oy - s, s, s, '#F9FAFB', '1', stroke='#E5E7EB', sw=1.0),
           poly([(ox, oy), (ox + s, oy - s)], '#D1D5DB', 1.0, dash=1)]
    pts = [(ox, oy)] + [(ox + r[2] / 100 * s, oy - r[1] / 100 * s) for r in reversed(ROC)] \
          + [(ox + s, oy - s)]
    out.append(poly(sorted(pts), '#0E9384', 2.2))
    for t, tp, fp in ROC:
        out.append(dot(ox + fp / 100 * s, oy - tp / 100 * s, 3.0, '#BE123C'))
    out.append(txt(ox + s / 2, oy + 15, '헛경보 비율 →', 9, '#6B7280', anc='middle'))
    out.append(txt(ox - 6, oy - s - 6, '잡아낸 비율 ↑', 9, '#6B7280'))
    out.append(txt(176, 46, '기준값', 9.5, '#6B7280'))
    out.append(txt(240, 46, '잡아냄', 9.5, '#0E9384', w=800))
    out.append(txt(304, 46, '헛경보', 9.5, '#BE123C', w=800))
    out.append(poly([(172, 52), (360, 52)], GREY, 1.0))
    for i, (t, tp, fp) in enumerate(ROC):
        y = 70.0 + i * 17.0
        out.append(txt(176, y, '%.2f' % t, 9.5, '#111827'))
        out.append(txt(240, y, '%.0f %%' % tp, 9.5, '#0E9384'))
        out.append(txt(304, y, '%.0f %%' % fp, 9.5, '#BE123C'))
    out.append(txt(176, 160, '기준을 낮추면 둘 다 커지고, 올리면 둘 다 작아진다',
                   9.5, '#111827', w=800))
    out.append(txt(14, 176, '떨어진 정도 1 일 때 AUC = %.3f — 곡선 전체의 넓이' % AUC[2][1],
                   9.5, '#6B7280'))
    out.append(cap('놓침과 헛경보는 함께 좋아지지 않는다'))
    return ''.join(out)


# ── 346 · 곧게 가는 길과 길을 따라가는 길 ──────────────────────────
def dm346():
    dx, dy = 3, 3
    eu, mh = hypot(dx, dy), abs(dx) + abs(dy)
    assert abs(eu - 4.2426) < 1e-3 and mh == 6
    ox, oy, u = 52.0, 148.0, 24.0
    out = []
    for i in range(7):
        out.append(poly([(ox + i * u, oy), (ox + i * u, oy - 4 * u)], '#E5E7EB', 1.0))
    for j in range(5):
        out.append(poly([(ox, oy - j * u), (ox + 6 * u, oy - j * u)], '#E5E7EB', 1.0))
    step = [(ox, oy)]
    for i in range(3):
        step.append((ox + (i + 1) * u, oy - i * u))
        step.append((ox + (i + 1) * u, oy - (i + 1) * u))
    out.append(poly(step, '#B45309', 2.6))
    out.append(poly([(ox, oy), (ox + dx * u, oy - dy * u)], '#2563EB', 2.6))
    out.append(dot(ox, oy, 4.2, '#111827'))
    out.append(dot(ox + dx * u, oy - dy * u, 4.2, '#111827'))
    out.append(txt(ox - 4, oy + 14, '출발', 9, '#111827'))
    out.append(txt(ox + dx * u + 6, oy - dy * u - 6, '도착', 9, '#111827', w=800))
    out.append(txt(232, 50, '가로 %d칸 · 세로 %d칸' % (dx, dy), 10, '#111827', w=800))
    out.append(txt(232, 78, '곧게 가면 √(%d² + %d²)' % (dx, dy), 9.5, '#2563EB'))
    out.append(txt(232, 96, '= %.4f' % eu, 11, '#2563EB', w=800))
    out.append(txt(232, 124, '길을 따라가면 %d + %d' % (dx, dy), 9.5, '#B45309'))
    out.append(txt(232, 142, '= %d' % mh, 11, '#B45309', w=800))
    out.append(txt(232, 164, '차이 %.4f' % (mh - eu), 9.5, '#BE123C', w=800))
    out.append(txt(14, 176, '파랑 = 곧게 가는 길 · 주황 = 길을 따라가는 길', 9.5, '#6B7280'))
    out.append(cap('어느 길로 재야 할까'))
    return ''.join(out)


# ── 347 · 두 평균 사이의 부등식 ────────────────────────────────────
def ag347():
    a, b = 2.0, 8.0
    am, gm = (a + b) / 2, sqrt(a * b)
    assert abs(am - 5) < 1e-12 and abs(gm - 4) < 1e-12 and am > gm
    ox, oy, u = 48.0, 146.0, 23.0
    R = (a + b) / 2 * u
    cx = ox + R
    out = [poly([(ox - 8, oy), (ox + (a + b) * u + 10, oy)], GREY, 1.1)]
    arc = [(cx + R * cos(radians(t)), oy - R * sin(radians(t))) for t in range(0, 181, 3)]
    out.append(poly(arc, '#9CA3AF', 1.4))
    out.append(poly([(cx, oy), (cx, oy - R)], '#2563EB', 2.2))
    out.append(poly([(ox + a * u, oy), (ox + a * u, oy - gm * u)], '#0E9384', 2.4))
    out.append(dot(ox, oy, 3.4, '#111827'))
    out.append(dot(ox + a * u, oy, 3.4, '#111827'))
    out.append(dot(ox + (a + b) * u, oy, 3.4, '#111827'))
    out.append(txt(ox + a / 2 * u, oy + 15, 'a = %g' % a, 9.5, '#111827', anc='middle'))
    out.append(txt(ox + (a + b / 2) * u, oy + 15, 'b = %g' % b, 9.5, '#111827', anc='middle'))
    out.append(txt(cx + 5, oy - R / 2, '반지름 %g' % am, 9.5, '#2563EB', w=800))
    out.append(txt(ox + a * u - 5, oy - gm * u - 6, '수선 %g' % gm, 9.5, '#0E9384', anc='end',
                   w=800))
    out.append(txt(250, 48, '산술평균 (a + b) ÷ 2 = %g' % am, 10, '#2563EB', w=800))
    out.append(txt(250, 72, '기하평균 √(ab) = %g' % gm, 10, '#0E9384', w=800))
    out.append(txt(250, 100, '반지름은 수선보다 짧을 수 없다', 9.5, '#6B7280'))
    out.append(txt(250, 118, '→ 산술평균 ≥ 기하평균', 10, '#B45309', w=800))
    out.append(txt(250, 146, 'a = b 일 때만 등호', 9.5, '#BE123C', w=800))
    out.append(txt(14, 176, '반원의 반지름이 산술평균, 지름 위에서 세운 수선이 기하평균이다',
                   9.5, '#6B7280'))
    out.append(cap('두 평균 중 어느 쪽이 클까'))
    return ''.join(out)


# ── 348 · 따로 더하면 틀린다 ───────────────────────────────────────
def af348():
    al, be = 30.0, 45.0
    s1 = sin(radians(al + be))
    s2 = sin(radians(al)) + sin(radians(be))
    assert abs(s1 - 0.9659258) < 1e-6 and s2 > 1, (s1, s2)
    out = [txt(22, 48, 'α = %g° · β = %g°' % (al, be), 11, '#111827', w=800)]
    for i, (lab, v, col, note) in enumerate(
            [('sin(α + β)', s1, '#0E9384', 'sin 75° — 1 보다 작다'),
             ('sin α + sin β', s2, '#BE123C', '1 을 넘었다 — sin 값일 수 없다')]):
        y = 82.0 + i * 46.0
        out.append(txt(22, y, lab, 10.5, col, w=800))
        out.append(txt(130, y, '= %.6f' % v, 10.5, '#111827'))
        out.append(rect(130, y + 6, min(150, v * 150), 11, col, '.45'))
        out.append(txt(292, y, note, 9, col))
    out.append(poly([(130 + 150, 70), (130 + 150, 148)], '#BE123C', 1.2, dash=1))
    out.append(txt(284, 66, '1', 9, '#BE123C', w=800))
    out.append(txt(22, 160, 'sin(α + β) = sin α cos β + cos α sin β — 따로 더하는 것이 아니다',
                   10, '#B45309', w=800))
    out.append(txt(14, 174, 'α = β 로 두면 sin 2α = 2 sin α cos α 가 된다', 9.5, '#6B7280'))
    out.append(cap('따로 더해도 될까'))
    return ''.join(out)


# ── 349 · 나눗셈만으로 최대공약수 ──────────────────────────────────
def eu349():
    a, b = 48, 18
    steps = []
    x, y = a, b
    while y:
        steps.append((x, y, x // y, x % y))
        x, y = y, x % y
    assert x == 6 and len(steps) == 3, (x, steps)
    out = []
    ox, oy, u = 24.0, 46.0, 2.2
    x0, y0, w, h = ox, oy, a * u, b * u                      # 48 × 18 직사각형
    out.append(rect(x0, y0, w, h, '#E5E7EB', '.5', stroke='#9CA3AF', sw=1.0))
    PAL = ['#2563EB', '#0E9384', '#B45309']
    cx, cy, cw, ch = x0, y0, w, h
    horiz = True
    for i, (p, q, k, r) in enumerate(steps):
        for j in range(k):
            if horiz:
                out.append(rect(cx + j * q * u, cy, q * u - 0.6, q * u - 0.6, PAL[i], '.30',
                                stroke=PAL[i], sw=1.0))
            else:
                out.append(rect(cx, cy + j * q * u, q * u - 0.6, q * u - 0.6, PAL[i], '.30',
                                stroke=PAL[i], sw=1.0))
        if horiz:
            cx += k * q * u
            cw -= k * q * u
        else:
            cy += k * q * u
            ch -= k * q * u
        horiz = not horiz
    out.append(txt(ox, 42, '%d × %d 직사각형을 정사각형으로 남김없이 덮는다' % (a, b), 9,
                   '#6B7280'))
    for i, (p, q, k, r) in enumerate(steps):
        out.append(txt(192, 60 + i * 20, '%2d = %2d × %d + %d' % (p, q, k, r), 10.5, PAL[i],
                       w=800))
    out.append(txt(192, 128, '나머지가 0 이 되는 순간의 나누는 수', 9.5, '#6B7280'))
    out.append(txt(192, 148, '최대공약수 = %d · 나눗셈 %d 번' % (x, len(steps)), 11, '#BE123C',
                   w=800))
    out.append(txt(14, 170, '가장 작은 정사각형의 한 변이 곧 최대공약수다', 9.5, '#6B7280'))
    out.append(cap('나눗셈만으로 최대공약수를'))
    return ''.join(out)


# ── 350 · 겹치는 곳만 ──────────────────────────────────────────────
def si350():
    cases = [(-2, 3), (2, 2), (3, -1)]
    ans = [(a, b, 'x 가 %d 부터 %d 까지' % (a, b) if a < b else ('x = %d' % a if a == b else '없음'),
            max(0, b - a)) for a, b in cases]
    assert ans[0][3] == 5 and ans[1][3] == 0 and ans[2][2] == '없음', ans
    out = []
    ox, u = 46.0, 28.0
    X = lambda v: ox + (v + 5) * u * 0.6
    for k, (a, b, lab, ln) in enumerate(ans):
        y = 58.0 + k * 38.0
        out.append(poly([(X(-5), y), (X(5), y)], '#D1D5DB', 1.2))
        for t in range(-5, 6):
            out.append(poly([(X(t), y - 3), (X(t), y + 3)], '#E5E7EB', 1.0))
        out.append(poly([(X(a), y - 9), (X(5), y - 9)], '#2563EB', 2.4))
        out.append(poly([(X(-5), y + 9), (X(b), y + 9)], '#0E9384', 2.4))
        if a <= b:
            out.append(rect(X(a), y - 6, max(1.4, X(b) - X(a)), 12, '#B45309', '.35',
                            stroke='#B45309', sw=1.2))
        out.append(txt(14, y + 3, 'x ≥ %d' % a, 9, '#2563EB', w=800))
        out.append(txt(286, y - 6, 'x ≤ %d' % b, 9, '#0E9384', w=800))
        out.append(txt(286, y + 9, lab, 9.5,
                       '#BE123C' if lab == '없음' else '#B45309', w=800))
    out.append(txt(14, 174, '파랑과 초록이 함께 덮는 곳만 해가 된다 — 어긋나면 해가 없다',
                   9.5, '#6B7280'))
    out.append(cap('두 조건이 함께 맞는 곳'))
    return ''.join(out)


FNS = [('ho341', ho341), ('pl342', pl342), ('sg343', sg343), ('km344', km344), ('rc345', rc345),
       ('dm346', dm346), ('ag347', ag347), ('af348', af348), ('eu349', eu349), ('si350', si350)]

if __name__ == '__main__':
    import sys
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass
    for nm, f in FNS:
        sys.stdout.write('%-7s %5d자  ok\n' % (nm, len(f())))
