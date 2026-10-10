# -*- coding: utf-8 -*-
"""LAB 301~310 「오늘의 문제」 그림 — 좌표를 계산해서 그린다.

알고리즘과 논리, 무한 묶음이다. 그림에 적는 수는 실험 화면과 같은 식으로 구해
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


# ── 301 · 하나씩 확정해 나가기 ──────────────────────────────────────
DK_V = [(-1.4, 0.9), (0.0, 1.3), (1.4, 0.9), (-1.1, -0.8), (0.4, -1.2), (1.5, -0.3)]
DK_NM = ['가', '나', '다', '라', '마', '바']


def dk_edges(w):
    return [(0, 1, 2), (1, 2, 3), (0, 3, w), (3, 4, 2), (4, 5, 3), (2, 5, 2), (1, 4, 7)]


def dk_short(w):
    """가(0) 에서 바(5) 까지의 최단 거리와 그 경로."""
    E = dk_edges(w)
    INF = float('inf')
    dist = [0] + [INF] * 5
    prev = {}
    done = set()
    while len(done) < 6:
        u = min((i for i in range(6) if i not in done), key=lambda i: dist[i], default=None)
        if u is None or dist[u] == INF:
            break
        done.add(u)
        for a, b, ww in E:
            for p, q in ((a, b), (b, a)):
                if p == u and q not in done and dist[p] + ww < dist[q]:
                    dist[q] = dist[p] + ww
                    prev[q] = p
    path, cur = [5], 5
    while cur != 0:
        cur = prev[cur]
        path.append(cur)
    return dist[5], path[::-1]


def dk301():
    d5, path5 = dk_short(5)
    d1, path1 = dk_short(1)
    assert d5 == 7 and path5 == [0, 1, 2, 5], (d5, path5)
    assert d1 == 6 and path1 == [0, 3, 4, 5], (d1, path1)
    ox, oy, u = 104.0, 96.0, 46.0
    X = lambda p: (ox + p[0] * u, oy - p[1] * u)
    on = set(zip(path5, path5[1:])) | set(zip(path5[1:], path5))
    out = []
    for a, b, w in dk_edges(5):
        p, q = X(DK_V[a]), X(DK_V[b])
        sel = (a, b) in on
        out.append(poly([p, q], '#0E9384' if sel else '#D1D5DB', 2.4 if sel else 1.2,
                        dash=None if sel else 1))
        out.append(txt((p[0] + q[0]) / 2, (p[1] + q[1]) / 2 - 2, str(w), 9,
                       '#0E9384' if sel else '#9CA3AF', anc='middle', w=800 if sel else None))
    for i, v in enumerate(DK_V):
        p = X(v)
        out.append(dot(p[0], p[1], 4.6, '#2563EB' if i in (0, 5) else '#111827'))
        out.append(txt(p[0] + (9 if v[0] >= 0 else -9), p[1] + 4, DK_NM[i], 9.5,
                       '#2563EB' if i in (0, 5) else '#111827',
                       anc='start' if v[0] >= 0 else 'end', w=800))
    out.append(txt(14, 163, '초록 = 지금의 최단 경로 · 회색 점선 = 쓰이지 않은 길', 9.5, '#6B7280'))
    out.append(txt(214, 44, '가 → 바 최단 거리', 10, '#6B7280'))
    out.append(txt(214, 64, '%d  (%s)' % (d5, ' → '.join(DK_NM[i] for i in path5)),
                   11, '#0E9384', w=800))
    out.append(txt(214, 90, '가·라 를 1 로 줄이면', 10, '#111827', w=800))
    out.append(txt(214, 110, '%d  (%s)' % (d1, ' → '.join(DK_NM[i] for i in path1)),
                   11, '#BE123C', w=800))
    out.append(txt(214, 134, '가까운 곳부터 하나씩 확정하면', 9.5, '#6B7280'))
    out.append(txt(214, 150, '되돌아가 고칠 일이 없다', 9.5, '#6B7280'))
    out.append(cap('최단 거리를 어떻게 하나씩 확정할까'))
    return ''.join(out)


# ── 302 · 매번 최선인데 왜 손해일까 ─────────────────────────────────
def _greedy(coins, m):
    out = []
    for c in coins:
        while m >= c:
            m -= c
            out.append(c)
    return out


def _best(coins, m):
    INF = float('inf')
    dp = [0] + [INF] * m
    pick = [0] * (m + 1)
    for v in range(1, m + 1):
        for c in coins:
            if c <= v and dp[v - c] + 1 < dp[v]:
                dp[v] = dp[v - c] + 1
                pick[v] = c
    out, v = [], m
    while v > 0:
        out.append(pick[v])
        v -= pick[v]
    return out


def gf302():
    coins, m = [4, 3, 1], 18
    g, b = _greedy(coins, m), _best(coins, m)
    assert sum(g) == m and sum(b) == m
    assert len(g) == 6 and len(b) == 5, (g, b)
    out = []
    for k, (lab, lst, col) in enumerate([('큰 것부터 골랐을 때', g, '#BE123C'),
                                         ('가장 적게 골랐을 때', b, '#0E9384')]):
        y = 70.0 + k * 54.0
        out.append(txt(14, y - 18, lab, 10, col, w=800))
        for i, c in enumerate(lst):
            x = 20.0 + i * 34.0
            out.append('<circle cx="%.1f" cy="%.1f" r="14" fill="%s" fill-opacity=".18" '
                       'stroke="%s" stroke-width="1.4"/>' % (x + 14, y + 8, col, col))
            out.append(txt(x + 14, y + 12, str(c), 10, col, anc='middle', w=800))
        out.append(txt(20 + len(lst) * 34 + 6, y + 12, '= %d 개' % len(lst), 10.5, col, w=800))
    out.append(txt(14, 163, '동전 묶음 1 · 3 · 4 원으로 %d 원을 거슬러 줄 때' % m, 9.5, '#6B7280'))
    out.append(txt(268, 46, '매번 가장 큰 동전을', 10, '#111827', w=800))
    out.append(txt(268, 64, '고르는 방법이', 10, '#111827', w=800))
    out.append(txt(268, 86, '%d 개 vs %d 개' % (len(g), len(b)), 12.5, '#BE123C', w=800))
    out.append(txt(268, 110, '한 개를 더 쓰게 된다', 10, '#BE123C', w=800))
    out.append(txt(268, 136, '1 · 5 · 10 · 50 원 에서는', 9.5, '#6B7280'))
    out.append(txt(268, 152, '큰 것부터가 늘 최선이다', 9.5, '#6B7280'))
    out.append(cap('매번 최선을 골랐는데 왜 손해일까'))
    return ''.join(out)


# ── 303 · 자주 쓰면 짧게 ────────────────────────────────────────────
def _huff(freq):
    """노드 = (무게, 순번, 자식들) — 길이만 돌려준다."""
    import heapq
    h = [(f, i, [i]) for i, f in enumerate(freq)]
    heapq.heapify(h)
    length = [0] * len(freq)
    while len(h) > 1:
        f1, _, g1 = heapq.heappop(h)
        f2, _, g2 = heapq.heappop(h)
        for i in g1 + g2:
            length[i] += 1
        heapq.heappush(h, (f1 + f2, min(g1 + g2) + 100, g1 + g2))
    return length


def hf303():
    freq = [60, 10, 10, 10]
    ln = _huff(freq)
    bits = sum(f * l for f, l in zip(freq, ln))
    fixed = sum(freq) * 2
    assert ln == [1, 2, 3, 3] or sorted(ln) == [1, 2, 3, 3], ln
    assert bits == 140 and fixed == 180, (bits, fixed)
    names = ['가', '나', '다', '라']
    out = []
    xs = [60.0, 120.0, 168.0, 208.0]
    ys = [120.0, 120.0, 120.0, 120.0]
    # 나무 — 뿌리에서 잎으로
    root = (130.0, 44.0)
    n1 = (160.0, 72.0)
    n2 = (188.0, 100.0)
    for a, b in ((root, (xs[0], ys[0])), (root, n1), (n1, (xs[1], ys[1])), (n1, n2),
                 (n2, (xs[2], ys[2])), (n2, (xs[3], ys[3]))):
        out.append(poly([a, b], '#9CA3AF', 1.3))
    for p in (root, n1, n2):
        out.append(dot(p[0], p[1], 3.2, '#9CA3AF'))
    for i, (x, y) in enumerate(zip(xs, ys)):
        col = '#2563EB' if i == 0 else '#0E9384'
        out.append(rect(x - 15, y - 2, 30, 22, col, '.14', stroke=col, sw=1.2))
        out.append(txt(x, y + 13, names[i], 10, col, anc='middle', w=800))
        out.append(txt(x, y + 32, '%d 회' % freq[i], 9, '#6B7280', anc='middle'))
        out.append(txt(x, y - 8, '%d 비트' % ln[i], 9, col, anc='middle', w=800))
    out.append(txt(14, 163, '자주 나오는 글자일수록 짧은 부호를 받는다', 9.5, '#6B7280'))
    out.append(txt(248, 50, '고정 길이 2 비트', 10, '#6B7280'))
    out.append(txt(248, 68, '%d × 2 = %d 비트' % (sum(freq), fixed), 10, '#6B7280'))
    out.append(txt(248, 94, '허프만 부호', 10, '#0E9384', w=800))
    out.append(txt(248, 112, '%d 비트' % bits, 12, '#0E9384', w=800))
    out.append(txt(248, 138, '압축률 %.1f %%' % (bits / fixed * 100), 11, '#BE123C', w=800))
    out.append(cap('자주 쓰는 글자를 짧게 하면'))
    return ''.join(out)


# ── 304 · 어디가 뒤집혔는지까지 ─────────────────────────────────────
def hm304():
    d = [1, 0, 1, 1]                                     # d1 d2 d3 d4
    p1 = d[0] ^ d[1] ^ d[3]
    p2 = d[0] ^ d[2] ^ d[3]
    p4 = d[1] ^ d[2] ^ d[3]
    g = [p1, p2, d[0], p4, d[1], d[2], d[3]]             # 1 … 7 번 자리
    assert g == [0, 1, 1, 0, 0, 1, 1], g
    flip = 5
    h = list(g)
    h[flip - 1] ^= 1
    s1 = h[0] ^ h[2] ^ h[4] ^ h[6]
    s2 = h[1] ^ h[2] ^ h[5] ^ h[6]
    s3 = h[3] ^ h[4] ^ h[5] ^ h[6]
    assert s1 + 2 * s2 + 4 * s3 == flip, (s1, s2, s3)
    cx, cy, r = 96.0, 96.0, 36.0
    cs = [(cx - 20, cy - 12), (cx + 20, cy - 12), (cx, cy + 20)]
    cols = ['#2563EB', '#0E9384', '#B45309']
    out = []
    for (px, py), col in zip(cs, cols):
        out.append('<circle cx="%.1f" cy="%.1f" r="%.1f" fill="%s" fill-opacity=".10" '
                   'stroke="%s" stroke-width="1.3"/>' % (px, py, r, col, col))
    pos = {1: (cx - 40, cy - 22), 2: (cx + 40, cy - 22), 4: (cx, cy + 44),
           3: (cx, cy - 26), 5: (cx - 22, cy + 14), 6: (cx + 22, cy + 14), 7: (cx, cy + 4)}
    for k in range(1, 8):
        x, y = pos[k]
        bad = (k == flip)
        out.append('<circle cx="%.1f" cy="%.1f" r="9" fill="%s" fill-opacity="%s" '
                   'stroke="%s" stroke-width="1.3"/>'
                   % (x, y, '#BE123C' if bad else '#FFFFFF', '.80' if bad else '1',
                      '#BE123C' if bad else '#9CA3AF'))
        out.append(txt(x, y + 3.5, str(h[k - 1]), 9.5, '#FFFFFF' if bad else '#111827',
                       anc='middle', w=800))
    out.append(txt(14, 163, '동그라미 셋 = 세 가지 짝수 검사 · 붉은 칸이 뒤집힌 자리', 9.5, '#6B7280'))
    out.append(txt(214, 44, '보낸 것  %s' % ' '.join(map(str, g)), 10, '#6B7280'))
    out.append(txt(214, 62, '받은 것  %s' % ' '.join(map(str, h)), 10, '#BE123C', w=800))
    out.append(txt(214, 88, '세 검사 결과  %d %d %d' % (s1, s2, s3), 10.5, '#111827', w=800))
    out.append(txt(214, 110, '→ %d + %d + %d = %d 번 자리'
                   % (s1 * 1, s2 * 2, s3 * 4, flip), 11, '#BE123C', w=800))
    out.append(txt(214, 132, '검사 하나뿐이면', 9.5, '#6B7280'))
    out.append(txt(214, 148, '「틀렸다」까지만 안다', 9.5, '#6B7280'))
    out.append(cap('어디가 뒤집혔는지까지 알 수 있을까'))
    return ''.join(out)


# ── 305 · 열 배가 되면 몇 배일까 ────────────────────────────────────
def cp305():
    from math import log2
    ns = [10, 100, 1000, 10000, 100000]
    rows = [(n, n * log2(n), n * n, n / log2(n)) for n in ns]
    assert abs(rows[2][3] - 100.34) < 0.1, rows[2][3]
    out = []
    X = lambda i: 34.0 + i * 36.0
    Y = lambda v: 150.0 - v * 100.0                      # 0 … 1 로 정규화한 값
    mx = log2(rows[-1][2])
    out.append(poly([(28, 152), (28 + 5 * 36, 152)], GREY, 1.0))
    out.append(poly([(28, 154), (28, 46)], GREY, 1.0))
    out.append(head(28 + 5 * 36 + 4, 152, 1, 0))
    out.append(head(28, 42, 0, -1))
    out.append(poly([(X(i), Y(log2(r[1]) / mx)) for i, r in enumerate(rows)], '#0E9384', 2.2))
    out.append(poly([(X(i), Y(log2(r[2]) / mx)) for i, r in enumerate(rows)], '#BE123C', 2.2))
    for i, r in enumerate(rows):
        out.append(dot(X(i), Y(log2(r[1]) / mx), 2.6, '#0E9384'))
        out.append(dot(X(i), Y(log2(r[2]) / mx), 2.6, '#BE123C'))
    out.append(txt(X(4) + 6, Y(log2(rows[-1][1]) / mx) + 4, 'n log n', 9.5, '#0E9384', w=800))
    out.append(txt(X(3) - 4, Y(log2(rows[-1][2]) / mx) - 6, 'n²', 9.5, '#BE123C', w=800))
    out.append(txt(28, 163, '로그 눈금 — 곧은 선의 기울기가 곧 차수', 9.5, '#6B7280'))
    out.append(txt(222, 44, 'n', 9.5, '#6B7280'))
    out.append(txt(286, 44, 'n log n', 9.5, '#0E9384', w=800))
    out.append(txt(386, 44, 'n²', 9.5, '#BE123C', anc='end', w=800))
    for i, (n, a, b, _) in enumerate(rows[1:4]):
        y = 68.0 + i * 20.0
        out.append(txt(222, y, '{:,}'.format(n), 9.5, '#111827'))
        out.append(txt(286, y, '{:,}'.format(int(round(a))), 9.5, '#0E9384'))
        out.append(txt(386, y, '{:,}'.format(b), 9.5, '#BE123C', anc='end'))
    out.append(txt(222, 136, 'n 이 10 배가 되면', 9.5, '#111827', w=800))
    out.append(txt(222, 154, 'n² 은 100 배가 된다', 9.5, '#BE123C', w=800))
    out.append(cap('n 이 열 배가 되면 시간은 몇 배일까'))
    return ''.join(out)


# ── 306 · 어느 정렬이 빠른가 ────────────────────────────────────────
def sr306():
    from math import log2
    n = 20
    ins_sorted = n - 1
    ins_rev = n * (n - 1) // 2
    mer = n * log2(n)
    assert ins_sorted == 19 and ins_rev == 190
    out = []
    bars = [('삽입 · 정렬됨', ins_sorted, '#0E9384'), ('삽입 · 거꾸로', ins_rev, '#BE123C'),
            ('병합 · 모양과 무관', mer, '#2563EB')]
    mxv = max(v for _, v, _ in bars)
    for i, (lab, v, col) in enumerate(bars):
        y = 58.0 + i * 32.0
        w = v / mxv * 150.0
        out.append(rect(110, y, w, 20, col, '.55', stroke=col, sw=1.0))
        out.append(txt(104, y + 15, lab, 9.5, col, anc='end', w=800))
        out.append(txt(114 + w, y + 15, '%d 회' % round(v), 9.5, col, w=800))
    out.append(txt(14, 163, '자료 %d 개를 정렬할 때의 비교 횟수' % n, 9.5, '#6B7280'))
    out.append(txt(286, 54, '삽입 정렬', 10, '#111827', w=800))
    out.append(txt(286, 72, '정렬된 자료엔 가장 빠르고', 9.5, '#0E9384'))
    out.append(txt(286, 88, '거꾸로면 10 배로 느려진다', 9.5, '#BE123C'))
    out.append(txt(286, 114, '병합 정렬', 10, '#111827', w=800))
    out.append(txt(286, 132, '모양과 상관없이', 9.5, '#2563EB'))
    out.append(txt(286, 148, 'n log₂n 쯤으로 일정하다', 9.5, '#2563EB'))
    out.append(cap('어느 정렬이 빠른지는 무엇이 정할까'))
    return ''.join(out)


# ── 307 · 아니라고 하면 무엇이 무너지나 ────────────────────────────
def rd307():
    steps = [('가정', '√2 = p / q  (p, q 는 서로소)'),
             ('양변 제곱', '2 = p² / q²  →  p² = 2q²'),
             ('p 는 짝수', 'p² 이 짝수이므로 p = 2k'),
             ('대입', '4k² = 2q²  →  q² = 2k²'),
             ('q 도 짝수', 'q² 이 짝수이므로 q 도 짝수'),
             ('모순', 'p 와 q 가 둘 다 짝수 — 서로소라던 가정과 어긋난다')]
    assert len(steps) == 6
    out = []
    for i, (nm, body) in enumerate(steps):
        y = 46.0 + i * 20.0
        last = (i == len(steps) - 1)
        col = '#BE123C' if last else '#111827'
        out.append('<circle cx="24" cy="%.1f" r="7.5" fill="%s" fill-opacity="%s" '
                   'stroke="%s" stroke-width="1.2"/>'
                   % (y - 4, col, '.75' if last else '.12', col))
        out.append(txt(24, y, str(i + 1), 9, '#FFFFFF' if last else col, anc='middle', w=800))
        out.append(txt(40, y, nm, 9.5, col, w=800))
        out.append(txt(104, y, body, 9.5, col if last else '#6B7280'))
        if i:
            out.append(poly([(24, y - 15), (24, y - 12)], GREY, 1.0))
    out.append(txt(14, 163, '아니라고 가정했더니 가정 자신이 무너진다 — 그래서 √2 는 유리수가 아니다',
                   9.5, '#6B7280'))
    out.append(cap('아니라고 하면 무엇이 무너지나'))
    return ''.join(out)


# ── 308 · 「젖었으니 비가 왔다」는 왜 틀릴까 ────────────────────────
def fl308():
    rows = [('전건긍정', 'p → q,  p  ⊢ q', True, '—'),
            ('후건부정', 'p → q,  ¬q ⊢ ¬p', True, '—'),
            ('후건긍정', 'p → q,  q  ⊬ p', False, '물차가 지나갔다'),
            ('전건부정', 'p → q,  ¬p ⊬ ¬q', False, '눈이 녹았다')]
    assert sum(1 for r in rows if r[2]) == 2
    out = [txt(20, 46, '형태', 9.5, '#6B7280'), txt(104, 46, '기호', 9.5, '#6B7280'),
           txt(242, 46, '판정', 9.5, '#6B7280'), txt(300, 46, '반례', 9.5, '#6B7280')]
    out.append(poly([(14, 52), (386, 52)], GREY, 1.0))
    for i, (nm, sym, ok, cs) in enumerate(rows):
        y = 74.0 + i * 24.0
        col = '#0E9384' if ok else '#BE123C'
        out.append(txt(20, y, nm, 10, '#111827', w=800))
        out.append(txt(104, y, sym, 10, '#6B7280'))
        out.append(txt(242, y, '타당' if ok else '타당하지 않음', 9.5, col, w=800))
        out.append(txt(300, y, cs, 9.5, '#B45309' if not ok else '#D1D5DB'))
    out.append(txt(14, 163, '「비가 오면 땅이 젖는다」 가 참이어도 젖었다고 비가 온 것은 아니다',
                   9.5, '#6B7280'))
    out.append(cap('젖었으니 비가 왔다 — 왜 틀릴까'))
    return ''.join(out)


# ── 309 · 분수는 자연수만큼 있을까 ──────────────────────────────────
def ct309():
    """대각선으로 훑으면 모든 분수에 번호가 붙는다."""
    seq, seen = [], set()
    s = 2
    while len(seq) < 10:
        for p in range(1, s):
            q = s - p
            key = (p, q)
            if key not in seen:
                seen.add(key)
                seq.append((p, q))
            if len(seq) >= 10:
                break
        s += 1
    assert seq[0] == (1, 1) and seq[1] == (1, 2) and seq[2] == (2, 1), seq[:3]
    ox, oy, g = 40.0, 56.0, 26.0
    out = []
    idx = {pq: i + 1 for i, pq in enumerate(seq)}
    for p in range(1, 5):
        for q in range(1, 5):
            x, y = ox + (q - 1) * g, oy + (p - 1) * g
            n = idx.get((p, q))
            out.append(rect(x - 11, y - 11, 22, 22, '#2563EB',
                            '.16' if n else '.04', stroke='#E5E7EB', sw=0.8))
            out.append(txt(x, y + 3, '%d/%d' % (p, q), 8.5,
                           '#111827' if n else '#9CA3AF', anc='middle'))
            if n:
                out.append(txt(x + 9, y - 6, str(n), 7.5, '#BE123C', anc='middle', w=800))
    pts = [(ox + (q - 1) * g, oy + (p - 1) * g) for p, q in seq]
    out.append(poly(pts, '#BE123C', 1.4))
    out.append(txt(ox - 22, oy - 20, '분자 ↓  분모 →', 9, '#6B7280'))
    out.append(txt(14, 163, '붉은 선을 따라가면 모든 분수에 1, 2, 3 … 번호가 빠짐없이 붙는다',
                   9.5, '#6B7280'))
    out.append(txt(192, 50, '대각선으로 훑으면', 10, '#111827', w=800))
    out.append(txt(192, 70, '어떤 분수든 언젠가', 10, '#6B7280'))
    out.append(txt(192, 88, '제 번호를 받는다', 10, '#6B7280'))
    out.append(txt(192, 114, '분모 1 인 줄만 세면', 10, '#BE123C', w=800))
    out.append(txt(192, 132, '다음 줄로 영영', 10, '#BE123C'))
    out.append(txt(192, 150, '넘어가지 못한다', 10, '#BE123C'))
    out.append(cap('분수는 자연수만큼 있을까'))
    return ''.join(out)


# ── 310 · 목록에 없는 수 만들기 ─────────────────────────────────────
def dg310():
    rows = [[1, 4, 1, 5, 9], [2, 7, 1, 8, 2], [3, 3, 3, 3, 3], [5, 0, 0, 0, 1], [8, 7, 1, 2, 6]]
    made = [(r[i] + 1) % 10 for i, r in enumerate(rows)]
    for i, r in enumerate(rows):                         # 어느 줄과도 i 번째 자리가 다르다
        assert made[i] != r[i]
    ox, oy, g = 52.0, 60.0, 24.0
    out = []
    for i, r in enumerate(rows):
        y = oy + i * 22.0
        out.append(txt(ox - 14, y, '0.', 9.5, '#6B7280', anc='end'))
        for j, dgt in enumerate(r):
            x = ox + j * g
            if i == j:
                out.append(rect(x - 10, y - 12, 20, 18, '#BE123C', '.18',
                                stroke='#BE123C', sw=1.1))
            out.append(txt(x, y, str(dgt), 10,
                           '#BE123C' if i == j else '#111827', anc='middle',
                           w=800 if i == j else None))
        out.append(txt(ox + 5 * g + 4, y, '…', 9.5, '#9CA3AF'))
    y = oy + 5 * 22.0 + 10
    out.append(poly([(ox - 26, y - 14), (ox + 5 * g, y - 14)], GREY, 1.0))
    out.append(txt(ox - 14, y + 6, '0.', 9.5, '#0E9384', anc='end', w=800))
    for j, dgt in enumerate(made):
        out.append(txt(ox + j * g, y + 6, str(dgt), 10.5, '#0E9384', anc='middle', w=800))
    out.append(txt(ox + 5 * g + 4, y + 6, '…', 9.5, '#0E9384'))
    out.append(txt(14, 163, '대각선의 숫자를 모두 바꾸면 목록의 어느 줄과도 한 자리씩 다르다',
                   9.5, '#6B7280'))
    out.append(txt(222, 50, '만든 수는', 10, '#111827', w=800))
    out.append(txt(222, 70, '첫째 줄과 첫 자리가,', 9.5, '#6B7280'))
    out.append(txt(222, 86, '둘째 줄과 둘째 자리가 …', 9.5, '#6B7280'))
    out.append(txt(222, 104, '모두 다르다', 10, '#0E9384', w=800))
    out.append(txt(222, 130, '어떤 목록을 가져와도', 9.5, '#BE123C', w=800))
    out.append(txt(222, 148, '빠진 수가 또 생긴다', 9.5, '#BE123C', w=800))
    out.append(cap('목록에 없는 수를 만들 수 있을까'))
    return ''.join(out)


FNS = [('dk301', dk301), ('gf302', gf302), ('hf303', hf303), ('hm304', hm304), ('cp305', cp305),
       ('sr306', sr306), ('rd307', rd307), ('fl308', fl308), ('ct309', ct309), ('dg310', dg310)]

if __name__ == '__main__':
    import sys
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass
    for nm, f in FNS:
        sys.stdout.write('%-7s %5d자  ok\n' % (nm, len(f())))
