# ── 351 · 스칠까 뚫을까 ────────────────────────────────────────────
def tr351():
    R = 95.0
    d70, d90 = R * sin(radians(70)), R * sin(radians(90))
    assert abs(d90 - R) < 1e-9 and d70 < R - 0.5, (d70, d90)
    out = []
    for k, (th, col, lab) in enumerate([(70.0, '#BE123C', '70° — 뚫고 지난다'),
                                        (90.0, '#0E9384', '90° — 스치고 지난다')]):
        cx, cy, r = 96.0 + k * 196.0, 104.0, 46.0
        pa = radians(-50)
        px, py = cx + r * cos(pa), cy + r * sin(pa)
        nx, ny = cos(pa), sin(pa)
        dx = nx * cos(radians(th)) - ny * sin(radians(th))
        dy = nx * sin(radians(th)) + ny * cos(radians(th))
        out.append('<circle cx="%.1f" cy="%.1f" r="%.1f" fill="#2563EB" fill-opacity=".06" '
                   'stroke="#2563EB" stroke-width="1.8"/>' % (cx, cy, r))
        out.append(poly([(cx, cy), (px, py)], '#0E9384', 1.8))
        out.append(poly([(px - dx * 62, py - dy * 62), (px + dx * 62, py + dy * 62)], col, 2.0))
        # 중심에서 직선에 내린 수선
        t = (cx - px) * dx + (cy - py) * dy
        fx, fy = px + dx * t, py + dy * t
        out.append(poly([(cx, cy), (fx, fy)], '#B45309', 1.2, dash=1))
        out.append(dot(cx, cy, 3.4, '#111827'))
        out.append(dot(px, py, 4.0, col))
        if th < 89.5:
            out.append(dot(px + dx * 2 * t, py + dy * 2 * t, 4.0, col))
        out.append(txt(cx, 42, lab, 9.5, col, anc='middle', w=800))
        out.append(txt(cx, 168, '중심까지의 거리 %.2f' % (R * sin(radians(th))), 9.5, '#B45309',
                       anc='middle', w=800))
    out.append(txt(14, 182, '초록 = 반지름 · 주황 점선 = 중심에서 직선에 내린 수선 (반지름 95)',
                   9.5, '#6B7280'))
    out.append(cap('스칠까, 뚫고 지날까'))
    return ''.join(out)


# ── 352 · 칸을 줄이면 무엇이 먼저 사라지나 ─────────────────────────
def _rs_base(k, i, j, B=48):
    x, y = (i + 0.5) / B, (j + 0.5) / B
    if k == 'stripe':
        return 0.88 if int(x * 16) % 2 == 0 else 0.10
    dx, dy = x - 0.38, y - 0.40
    if dx * dx + dy * dy < 0.055:
        return 0.86
    if 0.62 < y < 0.94 and abs(x - 0.68) < (y - 0.62) * 0.9:
        return 0.55
    return 0.10


def _rs_down(k, N, B=48):
    s = B / N
    out = []
    for r in range(N):
        row = []
        for c in range(N):
            tot = cnt = 0
            for j in range(int(r * s), int((r + 1) * s)):
                for i in range(int(c * s), int((c + 1) * s)):
                    tot += _rs_base(k, i, j)
                    cnt += 1
            row.append(tot / cnt if cnt else 0)
        out.append(row)
    return out


def _rs_bands(row):
    n = sum(1 for i in range(1, len(row)) if (row[i] > 0.5) != (row[i - 1] > 0.5))
    return -(-n // 2)


def rs352():
    g48 = _rs_down('stripe', 48)
    g12 = _rs_down('stripe', 12)
    b48, b12 = _rs_bands(g48[24]), _rs_bands(g12[6])
    assert b48 == 8 and b12 == 4, (b48, b12)
    out = []
    for k, (N, g, b, lab, col) in enumerate(
            [(48, g48, b48, '원본 48칸 — 줄 %d' % b48, '#0E9384'),
             (12, g12, b12, '12칸으로 줄임 — 줄 %d' % b12, '#BE123C')]):
        bx, by, S = 24.0 + k * 196.0, 50.0, 112.0
        u = S / N
        row = g[N // 2]
        for c in range(N):
            v = row[c]
            lv = int(round(255 * (0.08 + 0.88 * (1 - v))))
            out.append('<rect x="%.2f" y="%.1f" width="%.2f" height="%.1f" fill="rgb(%d,%d,%d)"/>'
                       % (bx + c * u, by, u + 0.3, S, lv, lv, lv))
        out.append('<rect x="%.1f" y="%.1f" width="%.1f" height="%.1f" fill="none" '
                   'stroke="#D1D5DB" stroke-width="1.1"/>' % (bx, by, S, S))
        out.append(txt(bx, 44, lab, 9.5, col, w=800))
        out.append(txt(bx, 178, '칸 수 %d × %d = %d' % (N, N, N * N), 9.5, '#6B7280'))
    out.append(txt(154, 86, '→', 14, '#9CA3AF', anc='middle'))
    out.append(txt(154, 112, '성기게', 9, '#9CA3AF', anc='middle'))
    out.append(txt(154, 126, '재면', 9, '#9CA3AF', anc='middle'))
    out.append(txt(24, 160, '같은 자리를 잘라 본 한 줄 — 줄무늬 여덟 개가 네 개로 보인다',
                   10, '#BE123C', w=800))
    out.append(cap('없던 무늬가 생기기도 한다'))
    return ''.join(out)


# ── 353 · 걸어서 가는 길과 풀어서 가는 길 ──────────────────────────
NE_D = [(1, 2.1), (2, 2.6), (3, 3.6), (4, 4.2), (5, 5.3), (6, 5.6), (7, 6.9), (8, 7.2)]


def _ne_exact():
    n = len(NE_D)
    mx = sum(p[0] for p in NE_D) / n
    my = sum(p[1] for p in NE_D) / n
    sxx = sum((p[0] - mx) ** 2 for p in NE_D)
    sxy = sum((p[0] - mx) * (p[1] - my) for p in NE_D)
    a = sxy / sxx
    return a, my - a * mx


def _ne_walk(al, steps):
    n = len(NE_D)
    a, b = 0.2, 0.5
    for _ in range(steps):
        ga = sum(2 * (a * x + b - y) * x for x, y in NE_D)
        gb = sum(2 * (a * x + b - y) for x, y in NE_D)
        a -= al * ga / n
        b -= al * gb / n
    return a, b


def ne353():
    A, B = _ne_exact()
    rows = [(s,) + _ne_walk(0.02, s) for s in (100, 200, 300, 400)]
    gaps = [abs(a - A) + abs(b - B) for _, a, b in rows]
    assert abs(A - 0.7655) < 1e-4 and abs(B - 1.2429) < 1e-4, (A, B)
    assert gaps[-1] < 0.05 < gaps[0], gaps
    out = [txt(22, 46, '걸음', 9.5, '#6B7280'), txt(96, 46, 'a', 9.5, '#6B7280'),
           txt(176, 46, 'b', 9.5, '#6B7280'), txt(262, 46, '정답까지의 차이', 9.5, '#6B7280')]
    out.append(poly([(18, 52), (382, 52)], GREY, 1.0))
    for i, ((s, a, b), gp) in enumerate(zip(rows, gaps)):
        y = 72.0 + i * 19.0
        col = '#0E9384' if gp < 0.05 else '#111827'
        out.append(txt(22, y, '%d' % s, 9.5, col))
        out.append(txt(96, y, '%.4f' % a, 9.5, col))
        out.append(txt(176, y, '%.4f' % b, 9.5, col))
        out.append(txt(262, y, '%.4f' % gp, 9.5, col, w=800 if gp < 0.05 else None))
        out.append(rect(330, y - 9, min(52, gp * 150), 9, col, '.40'))
    out.append(poly([(18, 154), (382, 154)], GREY, 1.0))
    out.append(txt(22, 172, '정규방정식', 10, '#0E9384', w=800))
    out.append(txt(96, 172, '%.4f' % A, 10, '#0E9384', w=800))
    out.append(txt(176, 172, '%.4f' % B, 10, '#0E9384', w=800))
    out.append(txt(262, 172, '한 번에 — 되풀이 없음', 9.5, '#0E9384'))
    out.append(txt(22, 148, '걸어서 가면 400 걸음에 겨우 닿는 자리다', 9.5, '#6B7280'))
    out.append(cap('걸어서 갈까, 풀어서 갈까'))
    return ''.join(out)


# ── 354 · 관성을 주면 멀리 간다 ────────────────────────────────────
def _mo_run(al, be, k=20):
    path = [(-9.0, 2.6)]
    vx = vy = 0.0
    for _ in range(k):
        x, y = path[-1]
        vx = be * vx - al * 0.12 * x
        vy = be * vy - al * 3.2 * y
        path.append((x + vx, y + vy))
    return path


def mo354():
    runs = [(0.0, '#BE123C'), (0.5, '#B45309'), (0.8, '#0E9384')]
    data = [(be, _mo_run(0.14, be)) for be, _ in runs]
    dists = [hypot(p[-1][0], p[-1][1]) for _, p in data]
    assert dists[0] > 6 and dists[2] < 1.5 and dists[0] > dists[1] > dists[2], dists
    cx, cy, ux, uy = 196.0, 108.0, 9.0, 17.0
    X = lambda v: cx + v * ux
    Y = lambda v: cy - v * uy
    out = []
    for k in range(1, 5):                                 # 등고선
        L = k * 1.6
        pts = [(X(sqrt(L / 0.06) * cos(radians(t))), Y(sqrt(L / 1.6) * sin(radians(t))))
               for t in range(0, 361, 6)]
        out.append(poly(pts, '#2563EB', 1.0))
    out.append(dot(X(0), Y(0), 3.4, '#111827'))
    out.append(txt(X(0) + 5, Y(0) + 13, '바닥', 9, '#111827'))
    for (be, col), (_, path) in zip(runs, data):
        out.append(poly([(X(x), Y(y)) for x, y in path], col, 1.8))
        out.append(dot(X(path[-1][0]), Y(path[-1][1]), 3.6, col))
    out.append(dot(X(-9), Y(2.6), 3.6, '#6B7280'))
    out.append(txt(X(-9) - 2, Y(2.6) - 7, '출발', 9, '#6B7280', anc='middle'))
    out.append(txt(22, 46, '관성 β', 9.5, '#6B7280'))
    out.append(txt(96, 46, '20걸음 뒤 남은 거리', 9.5, '#6B7280'))
    for i, ((be, col), d) in enumerate(zip(runs, dists)):
        y = 158.0 + (i - 2) * 17.0
        out.append(txt(22, y, '%.1f' % be, 9.5, col, w=800))
        out.append(txt(96, y, '%.4f' % d, 9.5, col, w=800))
        out.append(rect(170, y - 9, d * 9, 9, col, '.40'))
    out.append(txt(22, 178, '세로는 금세 바닥에 닿지만 가로로 나아가는 것이 느리다 — 관성이 그것을 메운다',
                   9.5, '#6B7280'))
    out.append(cap('같은 걸음 수로 얼마나 멀리 갈까'))
    return ''.join(out)


# ── 355 · 네 칸으로 갈라 보기 ──────────────────────────────────────
def _cf(pr, sn, lazy, tot=1000, fpr=0.08):
    pos = round(tot * pr)
    neg = tot - pos
    tp = 0 if lazy else round(pos * sn)
    fn = pos - tp
    fp = 0 if lazy else round(neg * fpr)
    tn = neg - fp
    return dict(tp=tp, fn=fn, fp=fp, tn=tn,
                acc=(tp + tn) / tot,
                rec=tp / pos if pos else 0.0,
                prec=tp / (tp + fp) if tp + fp else 0.0)


def cf355():
    lazy = _cf(0.01, 0.70, True)
    real = _cf(0.01, 0.70, False)
    assert abs(lazy['acc'] - 0.99) < 1e-9 and lazy['rec'] == 0
    assert real['acc'] < lazy['acc'] and real['rec'] == 0.7, (real['acc'], real['rec'])
    out = []
    for k, (m, lab, col) in enumerate([(lazy, '모두 「음성」이라고만 답하기', '#BE123C'),
                                       (real, '제대로 검사하기', '#0E9384')]):
        bx, by, w, h = 24.0 + k * 196.0, 56.0, 76.0, 30.0
        out.append(txt(bx, 46, lab, 9.5, col, w=800))
        for (r, c, v, nm, cc) in [(0, 0, m['tp'], '제대로 찾음', '#0E9384'),
                                  (0, 1, m['fn'], '놓침', '#BE123C'),
                                  (1, 0, m['fp'], '헛경보', '#B45309'),
                                  (1, 1, m['tn'], '제대로 넘김', '#2563EB')]:
            x, y = bx + c * (w + 4), by + r * (h + 4)
            out.append(rect(x, y, w, h, cc, '.18', stroke=cc, sw=1.0))
            out.append(txt(x + w / 2, y + 14, '%d' % v, 11, '#111827', anc='middle', w=800))
            out.append(txt(x + w / 2, y + 26, nm, 8.5, '#6B7280', anc='middle'))
        out.append(txt(bx, 136, '정확도 %.1f %%' % (m['acc'] * 100), 10.5,
                       '#BE123C' if k == 0 else '#111827', w=800))
        out.append(txt(bx, 154, '재현율 %.1f %%' % (m['rec'] * 100), 10.5,
                       '#BE123C' if k == 0 else '#0E9384', w=800))
    out.append(txt(24, 178, '천 명 중 양성은 열 명 — 정확도만 보면 아무것도 못 찾은 쪽이 더 높다',
                   10, '#BE123C', w=800))
    out.append(cap('많이 맞혔다는 말은 잘했다는 뜻일까'))
    return ''.join(out)


FNS = [('tr351', tr351), ('rs352', rs352), ('ne353', ne353), ('mo354', mo354), ('cf355', cf355)]

if __name__ == '__main__':
    import sys
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass
    for nm, f in FNS:
        sys.stdout.write('%-7s %5d자  ok\n' % (nm, len(f())))
