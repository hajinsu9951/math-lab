# -*- coding: utf-8 -*-
"""단행본에 실을 «계산해서 그린» 그림을 만든다.

규칙 (이 프로젝트의 삽화 원칙을 책에도 그대로 가져온다)
  · 눈대중으로 그리지 않는다. 좌표·각·막대 길이는 모두 **파이썬이 계산한 값**이다.
  · 값은 assert 로 묶는다 — 본문에 적힌 수와 그림이 어긋나는 일을 아예 막는다.
  · 글씨가 서로 겹치지 않도록 자리를 넉넉히 잡는다 (화면 쪽 check_overlap.py 와 같은 생각).

쓰는 법
  python docs/단행본/figures.py            모든 그림을 docs/단행본/그림/ 에 쓴다
  python docs/단행본/figures.py ch01_pairs 하나만 확인한다
  빌더는 「@chart 이름」 을 만나면 그림/<이름>.svg 를 읽어 끼운다.
"""
import math
import os
import sys

try:
    sys.stdout.reconfigure(encoding='utf-8')
except Exception:
    pass

HERE = os.path.dirname(os.path.abspath(__file__))
OUTDIR = os.path.join(HERE, '그림')

NAVY, BLUE, SKY, TEAL = '#1B2A4A', '#2E4A7D', '#4A7DBF', '#0E8A7B'
AMBER, RED, GRAY, LINE = '#E8A020', '#C0504D', '#5A6779', '#C7D2E4'
FONT = ("font-family:'Pretendard Variable',Pretendard,'Malgun Gothic',sans-serif")

FIGS = {}


def fig(name, caption):
    def deco(fn):
        FIGS[name] = (fn, caption)
        return fn
    return deco


def head(w, h):
    return ('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 %d %d" '
            'width="100%%" style="%s">' % (w, h, FONT))


def txt(x, y, s, size=11, fill=NAVY, anchor='start', weight=400, style=''):
    return ('<text x="%.1f" y="%.1f" font-size="%s" fill="%s" text-anchor="%s" '
            'font-weight="%s" %s>%s</text>' % (x, y, size, fill, anchor, weight, style, s))


def line(x1, y1, x2, y2, c=LINE, w=1.2, dash=''):
    d = ' stroke-dasharray="%s"' % dash if dash else ''
    return ('<line x1="%.1f" y1="%.1f" x2="%.1f" y2="%.1f" stroke="%s" '
            'stroke-width="%s"%s/>' % (x1, y1, x2, y2, c, w, d))


def rect(x, y, w, h, fill='none', stroke='none', sw=1, rx=0):
    return ('<rect x="%.1f" y="%.1f" width="%.1f" height="%.1f" fill="%s" stroke="%s" '
            'stroke-width="%s" rx="%s"/>' % (x, y, w, h, fill, stroke, sw, rx))


def arrow_defs():
    return ('<defs>'
            '<marker id="ah" markerWidth="9" markerHeight="9" refX="7.5" refY="3.2" '
            'orient="auto"><path d="M0,0 L8,3.2 L0,6.4 z" fill="%s"/></marker>'
            '<marker id="ahr" markerWidth="9" markerHeight="9" refX="7.5" refY="3.2" '
            'orient="auto"><path d="M0,0 L8,3.2 L0,6.4 z" fill="%s"/></marker>'
            '</defs>' % (BLUE, RED))


# ────────────────────────────────────────────────────────── 제1장 · 소수와 암호
def primes_upto(n):
    s = [True] * (n + 1)
    s[0] = s[1] = False
    for i in range(2, int(n ** .5) + 1):
        if s[i]:
            for j in range(i * i, n + 1, i):
                s[j] = False
    return [i for i, v in enumerate(s) if v]


@fig('ch01_pairs', '12 의 약수는 세 쌍으로 짝을 이룹니다. 짝 중 작은 쪽(1·2·3)은 모두 '
     '√12 ≒ 3.46 보다 작고, 큰 쪽(4·6·12)은 모두 그보다 큽니다. 경계가 √12 하나뿐이므로 '
     '약수를 찾을 때는 그 아래만 보면 됩니다.')
def ch01_pairs():
    pairs = [(d, 12 // d) for d in range(1, 13) if 12 % d == 0 and d * d <= 12]
    assert pairs == [(1, 12), (2, 6), (3, 4)], pairs
    r12 = math.sqrt(12)
    assert abs(r12 - 3.4641) < 1e-3

    W, H = 700, 250
    x0, x1 = 60, 650
    lo, hi = 0, 13
    X = lambda v: x0 + (x1 - x0) * (v - lo) / (hi - lo)
    s = [head(W, H), arrow_defs()]
    ybase = 185
    s.append(line(x0 - 10, ybase, x1 + 10, ybase, NAVY, 1.6))
    for v in range(1, 13):
        s.append(line(X(v), ybase - 4, X(v), ybase + 4, NAVY, 1.2))
        s.append(txt(X(v), ybase + 20, str(v), 10.5, GRAY, 'middle'))
    # √12 경계
    s.append(line(X(r12), 40, X(r12), ybase + 10, RED, 1.4, '5,4'))
    s.append(txt(X(r12), 32, '√12 ≒ 3.46', 10.5, RED, 'middle', 700))
    # 세 쌍을 호로 잇는다 — 넓은 짝일수록 높이 올려 서로 겹치지 않게 둥지처럼 포갠다
    for k, (a, b) in enumerate(pairs):
        y = 62 + k * 34
        xa, xb = X(a), X(b)
        s.append('<path d="M%.1f,%.1f C%.1f,%.1f %.1f,%.1f %.1f,%.1f" fill="none" '
                 'stroke="%s" stroke-width="1.8"/>'
                 % (xa, ybase - 6, xa, y, xb, y, xb, ybase - 6, SKY))
        s.append(txt((xa + xb) / 2, y - 7, '%d × %d = 12' % (a, b), 10.8, BLUE, 'middle', 700))
    s.append(txt(x0 - 10, 24, '약수의 짝 — 12 = a × b', 12.5, NAVY, 'start', 800))
    s.append(txt(X(1.6), 215, '작은 쪽 — √12 아래', 10, TEAL, 'middle', 700))
    s.append(txt(X(8), 215, '큰 쪽 — √12 위', 10, AMBER, 'middle', 700))
    s.append('</svg>')
    return ''.join(s)


@fig('ch01_trials', 'N 이 커질 때 나눠 보아야 하는 횟수입니다. 2 부터 N 까지 다 나눠 보는 '
     '길(주황)은 N 과 함께 곧바로 치솟지만, √N 아래의 소수만 보는 길(파랑)은 거의 바닥에 '
     '붙어 있습니다. 세로축은 열 배마다 한 칸씩 올라가는 눈금입니다.')
def ch01_trials():
    # 두 소수를 비슷한 크기로 고른다 — 한쪽이 작으면 일찍 걸려 「최대 횟수」가 뜻을 잃는다
    PQ = [(7, 11), (17, 23), (53, 61), (101, 103), (853, 859), (10007, 10009)]
    Ns = [p * q for p, q in PQ]
    rows = []
    for N in Ns:
        root = int(math.isqrt(N))
        need = len(primes_upto(root))
        rows.append((N, root, need, N - 1))
    assert rows[0][2] == len(primes_upto(8)) == 4, rows[0]
    for (p, q), (N, root, need, _) in zip(PQ, rows):
        assert min(p, q) <= root, (p, q, root)   # 작은 소수가 √N 아래에 있어야 한다
    assert rows[2][0] == 3233 and rows[2][2] == 16, rows[2]

    W, H = 700, 320
    L, R, T, B = 86, 660, 46, 250
    ymax = math.log10(max(r[3] for r in rows))
    Y = lambda v: B - (B - T) * (math.log10(max(v, 1)) / ymax)
    bw = (R - L) / len(rows) / 2.6
    s = [head(W, H)]
    for k in range(0, 9):
        y = Y(10 ** k)
        if y < T - 2:
            break
        s.append(line(L - 6, y, R, y, LINE, 1))
        s.append(txt(L - 12, y + 3.5, '10%s' % '⁰¹²³⁴⁵⁶⁷⁸'[k], 9.5, GRAY, 'end'))
    for i, (N, root, need, allN) in enumerate(rows):
        cx = L + (R - L) * (i + .5) / len(rows)
        s.append(rect(cx - bw - 2, Y(allN), bw, B - Y(allN), AMBER))
        s.append(rect(cx + 2, Y(need), bw, B - Y(need), SKY))
        s.append(txt(cx - bw / 2 - 2, Y(allN) - 5, '{:,}'.format(allN), 8.6, '#8A5A00', 'middle', 700))
        s.append(txt(cx + bw / 2 + 2, Y(need) - 5, str(need), 9.4, BLUE, 'middle', 800))
        lab = '{:,}'.format(N)
        s.append(txt(cx, B + 16, lab if len(lab) < 12 else lab[:9] + '…', 9.2, NAVY, 'middle', 700))
        s.append(txt(cx, B + 29, '√N ≒ {:,}'.format(root), 8.4, GRAY, 'middle'))
    s.append(line(L - 6, B, R, B, NAVY, 1.4))
    s.append(txt(L - 6, 24, '나눠 보아야 하는 횟수', 12.5, NAVY, 'start', 800))
    s.append(rect(L + 170, 14, 11, 11, AMBER))
    s.append(txt(L + 186, 24, '2 부터 N 까지 다 보기', 10, '#8A5A00', 'start', 700))
    s.append(rect(L + 330, 14, 11, 11, SKY))
    s.append(txt(L + 346, 24, '√N 아래의 소수만 보기', 10, BLUE, 'start', 700))
    s.append(txt(L - 6, B + 56, 'N = p × q (두 소수의 곱)', 9.6, GRAY, 'start'))
    s.append('</svg>')
    return ''.join(s)


@fig('ch01_rsa', 'RSA 암호가 쓰는 수의 크기입니다. 열쇠가 2048 비트이면 N 은 10진법으로 '
     '617 자리, √N 은 309 자리입니다. 309 자리만큼 나눠 보는 일은 1 초에 10억 번을 '
     '시도해도 10의 291 승 년이 걸립니다 — 우주의 나이(10의 10 승 년)로도 어림이 되지 않습니다.')
def ch01_rsa():
    bits = [64, 256, 1024, 2048, 4096]
    digits = [int(b * math.log10(2)) + 1 for b in bits]
    assert digits[3] == 617, digits
    half = [d // 2 + 1 for d in digits]
    assert half[3] == 309, half

    W, H = 700, 250
    L, R, T = 150, 640, 52
    s = [head(W, H)]
    s.append(txt(20, 26, '열쇠 길이와 「되돌리기」의 크기', 12.5, NAVY, 'start', 800))
    maxd = digits[-1]
    for i, b in enumerate(bits):
        y = T + i * 34
        s.append(txt(L - 12, y + 4, '%d 비트' % b, 10.2, NAVY, 'end', 700))
        wf = (R - L) * digits[i] / maxd
        wh = (R - L) * half[i] / maxd
        s.append(rect(L, y - 9, wf, 18, '#F3E3C4', '#E8C98A', 1, 3))
        s.append(rect(L, y - 9, wh, 18, SKY, 'none', 0, 3))
        s.append(txt(L + wh + 6, y + 4, '√N 은 %d 자리' % half[i], 9.4, BLUE, 'start', 700))
        s.append(txt(L + wf + 6, y + 4, 'N 은 %d 자리' % digits[i], 9.4, '#8A5A00', 'start')
                 if wf - wh > 70 else '')
    s.append(txt(20, 226, '파란 칸이 실제로 나눠 보아야 하는 자릿수입니다 — '
                          '길이가 반으로 줄어도 손으로 셀 수 있는 크기는 아닙니다.',
                 9.6, GRAY, 'start'))
    s.append('</svg>')
    return ''.join(s)


# ────────────────────────────────────────────── 제2장 · 최대공약수와 최소공배수
@fig('ch02_expo', '12 와 18 을 같은 소수로 나란히 적으면 지수 표가 됩니다. 소수마다 '
     '낮은 지수를 고르면 최대공약수, 높은 지수를 고르면 최소공배수입니다. 낮은 쪽과 높은 쪽을 '
     '더하면 언제나 원래 두 지수의 합이므로, 두 곱이 a × b 가 되는 것은 피할 수 없습니다.')
def ch02_expo():
    a, b = 12, 18
    ea, eb = {2: 2, 3: 1}, {2: 1, 3: 2}
    g = 2 ** min(ea[2], eb[2]) * 3 ** min(ea[3], eb[3])
    l = 2 ** max(ea[2], eb[2]) * 3 ** max(ea[3], eb[3])
    assert (g, l) == (6, 36), (g, l)
    assert g * l == a * b == 216

    W, H = 700, 290
    s = [head(W, H)]
    # 이름 칸(LX)·지수 칸(2,3)·값 칸을 따로 떼어 둔다 — 글씨가 서로 밟지 않도록
    LX = 100
    cols = [('소수', 120), ('2', 300), ('3', 410), ('값', 530)]
    rows = [('12 =', '2²', '3¹', '12', NAVY),
            ('18 =', '2¹', '3²', '18', NAVY),
            ('낮은 지수 → 최대공약수', '2¹', '3¹', '6', TEAL),
            ('높은 지수 → 최소공배수', '2²', '3²', '36', BLUE)]
    s.append(txt(24, 26, '지수 표 — 아래를 고르면 공약수, 위를 고르면 공배수', 12.5, NAVY, 'start', 800))
    for name, x in cols[1:]:
        s.append(txt(x, 58, name, 11.5, GRAY, 'middle', 700))
    for i, (lab, c2, c3, val, col) in enumerate(rows):
        y = 92 + i * 42
        if i >= 2:
            s.append(rect(LX - 12, y - 20, 568, 34, '#F3F6FC', LINE, 1, 5))
        s.append(txt(LX, y + 3, lab, 11, col, 'start', 700))
        s.append(txt(cols[1][1], y + 3, c2, 13, col, 'middle', 800))
        s.append(txt(cols[2][1], y + 3, c3, 13, col, 'middle', 800))
        s.append(txt(cols[3][1], y + 3, '= ' + val, 12.5, col, 'start', 800))
    s.append(line(90, 268, 660, 268, LINE, 1))
    s.append(txt(24, 262, '6 × 36 = 216 = 12 × 18', 12, RED, 'start', 800))
    s.append('</svg>')
    return ''.join(s)


@fig('ch02_gear', '톱니 12 개와 18 개인 두 바퀴입니다. 지나간 톱니 수를 세어 가면 두 표시가 '
     '다시 겹치는 때는 36 번째 — 두 수의 최소공배수입니다. 그 사이에 작은 바퀴는 3 바퀴, '
     '큰 바퀴는 2 바퀴를 돕니다.')
def ch02_gear():
    a, b = 12, 18
    l = a * b // math.gcd(a, b)
    assert l == 36 and l // a == 3 and l // b == 2

    W, H = 700, 230
    L, R = 70, 650
    X = lambda t: L + (R - L) * t / 40.0
    s = [head(W, H)]
    s.append(txt(24, 26, '지나간 톱니 수', 12.5, NAVY, 'start', 800))
    for k, (n, y, col, nm) in enumerate([(a, 80, SKY, '톱니 12 개'), (b, 150, TEAL, '톱니 18 개')]):
        s.append(line(L, y, R, y, LINE, 1.2))
        s.append(txt(L - 10, y + 4, nm, 10, GRAY, 'end', 700))
        t = n
        while t <= 40:
            s.append('<circle cx="%.1f" cy="%.1f" r="5" fill="%s"/>' % (X(t), y, col))
            s.append(txt(X(t), y - 11, str(t), 9, col, 'middle', 700))
            t += n
    s.append(line(X(l), 58, X(l), 178, RED, 1.6, '5,4'))
    s.append(txt(X(l), 50, '36 — 처음으로 겹치는 때', 10.5, RED, 'middle', 800))
    s.append(txt(X(l) + 8, 196, '작은 바퀴 3 바퀴 · 큰 바퀴 2 바퀴', 10, GRAY, 'start'))
    s.append(txt(L, 215, '12 의 배수(위)와 18 의 배수(아래)가 처음 만나는 자리가 최소공배수입니다.',
                 9.6, GRAY, 'start'))
    s.append('</svg>')
    return ''.join(s)


# ─────────────────────────────────────────────────────── 제3장 · 수직선과 부호
@fig('ch03_arrows', '같은 5 와 3 으로 만든 네 가지입니다. 화살표의 길이는 언제나 3 으로 '
     '같고 바뀌는 것은 방향뿐입니다. 방향을 정하는 것은 연산 기호 하나가 아니라 '
     '「연산 기호와 b 의 부호를 함께 본 결과」입니다.')
def ch03_arrows():
    cases = [('(−5) + 3', -5, 3, -2), ('(−5) + (−3)', -5, -3, -8),
             ('(−5) − 3', -5, -3, -8), ('(−5) − (−3)', -5, 3, -2)]
    for lab, a, step, end in cases:
        assert a + step == end, lab

    W, H = 700, 330
    L, R = 70, 660
    lo, hi = -10, 2
    X = lambda v: L + (R - L) * (v - lo) / (hi - lo)
    s = [head(W, H), arrow_defs()]
    s.append(txt(24, 26, '수직선 위의 네 가지 — 길이는 같고 방향만 다르다', 12.5, NAVY, 'start', 800))
    for i, (lab, a, step, end) in enumerate(cases):
        y = 70 + i * 62
        s.append(line(L, y, R, y, LINE, 1.1))
        for v in range(lo, hi + 1):
            s.append(line(X(v), y - 3, X(v), y + 3, '#AEB9CC', 1))
            if v % 2 == 0:
                s.append(txt(X(v), y + 17, str(v), 8.6, GRAY, 'middle'))
        col = BLUE if step > 0 else RED
        mk = 'ah' if step > 0 else 'ahr'
        s.append('<line x1="%.1f" y1="%.1f" x2="%.1f" y2="%.1f" stroke="%s" stroke-width="2.4" '
                 'marker-end="url(#%s)"/>' % (X(a), y - 13, X(end), y - 13, col, mk))
        s.append('<circle cx="%.1f" cy="%.1f" r="4" fill="%s"/>' % (X(a), y, NAVY))
        s.append('<circle cx="%.1f" cy="%.1f" r="4.5" fill="%s"/>' % (X(end), y, col))
        s.append(txt(L - 10, y + 4, lab, 11, NAVY, 'end', 700))
        s.append(txt(X(end) + 12, y - 9, '= %d' % end, 11, col, 'start', 800))
        s.append(txt((X(a) + X(end)) / 2, y - 20, '길이 3 · %s' % ('오른쪽' if step > 0 else '왼쪽'),
                     9, col, 'middle', 700))
    s.append(txt(24, 318, '실제로 더해진 값 — 위에서부터 +3, −3, −3, +3. 이것이 방향을 정한다.',
                 9.6, GRAY, 'start'))
    s.append('</svg>')
    return ''.join(s)


# ─────────────────────────────────────────────────────────────────── 실행부
def write_all(only=None):
    os.makedirs(OUTDIR, exist_ok=True)
    caps = {}
    n = 0
    for name, (fn, cap) in sorted(FIGS.items()):
        if only and name != only:
            continue
        svg = fn()
        open(os.path.join(OUTDIR, name + '.svg'), 'w', encoding='utf-8').write(svg)
        caps[name] = cap
        n += 1
        sys.stdout.write('  %-14s %5d자\n' % (name, len(svg)))
    import json
    cp = os.path.join(OUTDIR, '_캡션.json')
    old = {}
    if os.path.exists(cp):
        old = json.load(open(cp, encoding='utf-8'))
    old.update(caps)
    json.dump(old, open(cp, 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
    sys.stdout.write('그림 %d개 → %s\n' % (n, OUTDIR))




@fig('ch02_cicada', '주기가 13년인 매미와, 주기가 2·3·4·5·6년인 포식자가 몇 해마다 만나는지 '
     '세어 본 것입니다. 13 은 소수라 어느 포식자와도 13 년의 배수에서만 만납니다. 반면 주기가 '
     '12 년이면 2·3·4·6 년짜리와 모두 12 년마다 만납니다 — 같은 자릿수의 수인데 만남의 횟수가 '
     '전혀 다릅니다. (매미의 소수 주기가 이 때문이라는 설명은 널리 알려진 가설입니다.)')
def ch02_cicada():
    import math as _m
    preds = [2, 3, 4, 5, 6]
    YEARS = 60
    data = {}
    for cyc in (12, 13):
        hits = {}
        for p in preds:
            l = cyc * p // _m.gcd(cyc, p)
            hits[p] = [y for y in range(l, YEARS + 1, l)]
        data[cyc] = hits
    assert data[13][2] == [26, 52], data[13][2]
    assert data[12][2] == [12, 24, 36, 48, 60], data[12][2]
    assert sum(len(v) for v in data[12].values()) == 21, data[12]
    assert sum(len(v) for v in data[13].values()) == 4, data[13]

    W, H = 700, 360
    L, R = 108, 660
    X = lambda y: L + (R - L) * y / YEARS
    s = [head(W, H)]
    s.append(txt(20, 24, '매미와 포식자가 만나는 해 — 60 년 동안', 12.5, NAVY, 'start', 800))
    top = 56
    for bi, cyc in enumerate((12, 13)):
        y0 = top + bi * 140
        col = RED if cyc == 12 else TEAL
        s.append(txt(20, y0 + 4, '주기 %d년' % cyc, 11.4, col, 'start', 800))
        s.append(txt(20, y0 + 20, '(소수 아님)' if cyc == 12 else '(소수)', 9, GRAY, 'start'))
        tot = 0
        for i, p in enumerate(preds):
            y = y0 + i * 22
            s.append(line(L, y, R, y, '#EEF1F6', 1))
            s.append(txt(L - 8, y + 3.5, '%d년짜리' % p, 9.2, GRAY, 'end'))
            for hit in data[cyc][p]:
                s.append('<circle cx="%.1f" cy="%.1f" r="4.2" fill="%s"/>' % (X(hit), y, col))
                tot += 1
        s.append(txt(R + 4, y0 + 46, '만남 %d번' % tot, 10.4, col, 'start', 800)
                 if False else '')
        s.append(txt(L, y0 + 4 * 22 + 20, '60 년 동안 모두 %d번 만납니다' % tot, 10, col, 'start', 800))
    for y in range(0, YEARS + 1, 10):
        s.append(txt(X(y), H - 6, str(y), 8.6, GRAY, 'middle'))
    s.append(line(L, H - 20, R, H - 20, LINE, 1))
    s.append(txt(L - 8, H - 3, '해', 8.6, GRAY, 'end'))
    s.append('</svg>')
    return ''.join(s)


@fig('ch03_actual', 'a 와 b 의 부호, 그리고 연산을 모두 조합한 여덟 경우입니다. 「실제로 더해진 '
     '값」 열만 보면 규칙이 하나로 모입니다 — 덧셈이면 b 그대로, 뺄셈이면 b 의 부호를 뒤집은 값. '
     '방향을 정하는 것은 연산 기호 하나가 아니라 이 열입니다.')
def ch03_actual():
    rows = []
    for a in (5, -5):
        for op in ('+', '-'):
            for b in (3, -3):
                add = b if op == '+' else -b
                rows.append((a, op, b, add, a + add))
    assert len(rows) == 8
    assert (-5, '-', -3, 3, -2) in rows, rows
    assert (-5, '-', 3, -3, -8) in rows

    W, H = 700, 330
    cols = [(60, 'a'), (150, '연산'), (240, 'b'), (380, '실제로 더해진 값'),
            (520, '결과'), (630, '방향')]
    s = [head(W, H)]
    s.append(txt(20, 24, '여덟 가지를 한 표로 — 「실제로 더해진 값」만 보면 된다',
                 12.5, NAVY, 'start', 800))
    for x, nm in cols:
        s.append(txt(x, 56, nm, 10.4, GRAY, 'middle', 700))
    s.append(line(30, 64, 670, 64, NAVY, 1.3))
    for i, (a, op, b, add, r) in enumerate(rows):
        y = 88 + i * 29
        if i % 2:
            s.append(rect(30, y - 19, 640, 26, '#F6F8FC'))
        col = BLUE if add > 0 else RED
        s.append(txt(cols[0][0], y, str(a), 11, NAVY, 'middle', 700))
        s.append(txt(cols[1][0], y, op if op == '+' else '−', 12, NAVY, 'middle', 800))
        s.append(txt(cols[2][0], y, ('(%d)' % b) if b < 0 else str(b), 11, NAVY, 'middle', 700))
        s.append(txt(cols[3][0], y, ('%+d' % add), 12, col, 'middle', 800))
        s.append(txt(cols[4][0], y, str(r), 11, NAVY, 'middle', 700))
        s.append(txt(cols[5][0], y, '오른쪽' if add > 0 else '왼쪽', 10, col, 'middle', 700))
    s.append(line(30, 88 + 8 * 29 - 19, 670, 88 + 8 * 29 - 19, LINE, 1))
    s.append(txt(30, 322, '뺄셈 줄의 「실제로 더해진 값」은 모두 b 의 부호를 뒤집은 값이다 — '
                          'a − b = a + (−b)', 9.8, TEAL, 'start', 700))
    s.append('</svg>')
    return ''.join(s)


# ───────────────────────────────────────────────── 제4장 · 문자와 식
@fig('ch04_match', '성냥개비로 정사각형을 한 줄로 이어 붙인 모양입니다. 같은 그림을 세 가지로 '
     '묶어 셀 수 있고, 묶는 방법마다 다른 식이 나옵니다. 그런데 어느 식에 n 을 넣어도 값은 '
     '하나입니다 — 그림이 하나이기 때문입니다.')
def ch04_match():
    n = 4
    total = 3 * n + 1
    assert total == 4 + 3 * (n - 1) == 4 * n - (n - 1) == 13

    W, H = 700, 420
    s = [head(W, H)]
    s.append(txt(20, 26, '같은 그림, 세 가지 셈법 — n = 4 일 때 성냥개비 13 개',
                 12.5, NAVY, 'start', 800))
    size, x0 = 56, 92
    ways = [
        ('3n + 1', '맨 앞 세로 한 개 + 칸마다 ⊐ 세 개', SKY, 'a'),
        ('4 + 3(n − 1)', '첫 칸 네 개 + 나머지 칸마다 세 개', TEAL, 'b'),
        ('4n − (n − 1)', '칸마다 네 개로 세고 겹친 n−1 개를 뺀다', AMBER, 'c'),
    ]
    for wi, (eq, say, col, mode) in enumerate(ways):
        y0 = 62 + wi * 118
        s.append(txt(20, y0 + 12, eq, 12, col, 'start', 800))
        s.append(txt(20, y0 + 28, say, 8.8, GRAY, 'start'))
        for k in range(n):
            x = x0 + 148 + k * size
            # 가로 두 개
            for yy in (y0, y0 + size):
                s.append(line(x, yy, x + size, yy, col, 3))
            # 세로 — 묶는 방법에 따라 색을 달리한다
            left_col = RED if (mode == 'a' and k == 0) or (mode == 'b' and k == 0) else col
            s.append(line(x, y0, x, y0 + size, left_col, 3))
            if k == n - 1:
                s.append(line(x + size, y0, x + size, y0 + size, col, 3))
            elif mode == 'c':
                s.append(line(x + size, y0, x + size, y0 + size, RED, 3, '4,3'))
            else:
                s.append(line(x + size, y0, x + size, y0 + size, col, 3))
        s.append(txt(x0 + 148 + n * size + 14, y0 + size / 2 + 4, '= 13 개', 11, col, 'start', 800))
    s.append(txt(20, 404, '빨강 — 따로 세는 자리. 점선은 두 번 세어 빼 주어야 하는 자리.',
                 9.4, GRAY, 'start'))
    s.append('</svg>')
    return ''.join(s)


@fig('ch04_words', '같은 식을 말로 쓴 것과 기호로 쓴 것입니다. 글자 수를 세어 보면 기호 쪽이 '
     '열 배 넘게 짧습니다. 알콰리즈미가 9세기에 쓴 이차방정식 「제곱 하나와 그 근 열 개가 '
     '서른아홉과 같다」 는 오늘날 x² + 10x = 39 로 적습니다.')
def ch04_words():
    rows = [
        ('어떤 수를 셋 곱하고 하나를 더하라', '3n + 1'),
        ('제곱 하나와 그 근 열 개가 서른아홉과 같다', 'x² + 10x = 39'),
        ('두 수의 합에 두 수의 차를 곱하면 두 제곱의 차와 같다', '(a+b)(a−b) = a² − b²'),
    ]
    for w, sym in rows:
        assert len(w) > len(sym)

    W, H = 700, 300
    L, R = 40, 660
    s = [head(W, H)]
    s.append(txt(20, 26, '말로 쓴 식과 기호로 쓴 식 — 글자 수', 12.5, NAVY, 'start', 800))
    maxlen = max(len(w) for w, _ in rows)
    for i, (w, sym) in enumerate(rows):
        y = 64 + i * 78
        bw = (R - L - 150) * len(w) / maxlen
        sw = (R - L - 150) * len(sym) / maxlen
        s.append(txt(L, y - 6, w, 9.6, '#8A5A00', 'start'))
        s.append(rect(L, y + 2, bw, 13, '#F3E3C4', '#E8C98A', 1, 3))
        s.append(txt(L + bw + 6, y + 12, '%d 자' % len(w), 9, '#8A5A00', 'start', 700))
        s.append(txt(L, y + 34, sym, 11.4, BLUE, 'start', 800))
        s.append(rect(L, y + 42, sw, 13, SKY, 'none', 0, 3))
        s.append(txt(L + sw + 6, y + 52, '%d 자' % len(sym), 9, BLUE, 'start', 700))
    s.append(txt(20, 290, '기호가 없던 시절에는 식 하나를 적는 데 한 문단이 들었습니다. '
                          '«읽기»가 아니라 «적기»가 수학을 가로막았습니다.', 9.4, GRAY, 'start'))
    s.append('</svg>')
    return ''.join(s)


# ──────────────────────────────────────────── 제5장 · 같은 것끼리만 (동류항)
@fig('ch05_tile', '3x + 2 를 5x 라고 쓰면 x 에 무엇을 넣느냐에 따라 값이 어긋납니다. x = 1 '
     '일 때만 우연히 같고, 그다음부터는 벌어집니다. 「어떤 x 에도 성립해야 한다」는 조건이 '
     '동류항끼리만 묶게 만드는 까닭입니다.')
def ch05_tile():
    xs = list(range(0, 7))
    right = [3 * x + 2 for x in xs]
    wrong = [5 * x for x in xs]
    assert right[1] == wrong[1] == 5          # x = 1 에서만 우연히 같다
    assert [r - w for r, w in zip(right, wrong)] == [2, 0, -2, -4, -6, -8, -10]

    W, H = 700, 330
    L, R, T, B = 70, 650, 54, 250
    ymax = max(max(right), max(wrong))
    Y = lambda v: B - (B - T) * v / ymax
    s = [head(W, H)]
    s.append(txt(20, 26, '3x + 2 와 5x — 같은 식일까', 12.5, NAVY, 'start', 800))
    s.append(rect(L + 210, 14, 11, 11, SKY))
    s.append(txt(L + 226, 24, '3x + 2 (옳게 정리한 식)', 10, BLUE, 'start', 700))
    s.append(rect(L + 400, 14, 11, 11, RED))
    s.append(txt(L + 416, 24, '5x (잘못 묶은 식)', 10, RED, 'start', 700))
    bw = (R - L) / len(xs) / 3
    for i, x in enumerate(xs):
        cx = L + (R - L) * (i + .5) / len(xs)
        s.append(rect(cx - bw - 2, Y(right[i]), bw, B - Y(right[i]), SKY))
        s.append(rect(cx + 2, Y(wrong[i]), bw, B - Y(wrong[i]), RED))
        s.append(txt(cx - bw / 2 - 2, Y(right[i]) - 5, str(right[i]), 9, BLUE, 'middle', 800))
        s.append(txt(cx + bw / 2 + 2, Y(wrong[i]) - 5, str(wrong[i]), 9, RED, 'middle', 800))
        s.append(txt(cx, B + 17, 'x = %d' % x, 9.6, NAVY, 'middle', 700))
        d = right[i] - wrong[i]
        s.append(txt(cx, B + 33, ('차 %+d' % d) if d else '같다', 8.8,
                     TEAL if d == 0 else GRAY, 'middle', 800 if d == 0 else 400))
    s.append(line(L, B, R, B, NAVY, 1.4))
    s.append(txt(20, 300, 'x = 1 에서 둘 다 5 가 되는 것은 우연입니다. 한 값에서 같다고 같은 '
                          '식이 되지는 않습니다 — 모든 x 에서 같아야 같은 식입니다.',
                 9.4, GRAY, 'start'))
    s.append('</svg>')
    return ''.join(s)


@fig('ch05_mars', '1999년 화성 기후 궤도선이 화성에 다가간 높이입니다. 계획은 226 km 였고 '
     '살아남을 수 있는 가장 낮은 높이는 약 80 km 였는데, 실제로는 57 km 까지 내려갔습니다. '
     '지상 프로그램이 추력을 파운드힘으로 내보내고 비행 프로그램은 뉴턴으로 읽은 탓입니다 '
     '— 1 파운드힘은 약 4.45 뉴턴입니다.')
def ch05_mars():
    plan, floor, real = 226.0, 80.0, 57.0
    lbf_to_N = 4.4482216
    assert round(lbf_to_N, 2) == 4.45
    assert real < floor < plan

    W, H = 700, 320
    L, R = 150, 600
    top, bot = 60, 250
    Y = lambda km: bot - (bot - top) * km / 250.0
    s = [head(W, H)]
    s.append(txt(20, 26, '화성 표면에서 잰 높이 (km)', 12.5, NAVY, 'start', 800))
    # 화성 표면
    s.append(rect(L - 60, bot, (R - L) + 120, 26, '#E8D5C4'))
    s.append(txt(L - 55, bot + 17, '화성 표면', 9.6, '#8A5A00', 'start', 700))
    for km, col, lab, w in ((plan, SKY, '계획한 높이  226 km', 2.4),
                            (floor, AMBER, '살아남을 수 있는 가장 낮은 높이  약 80 km', 2.0),
                            (real, RED, '실제로 내려간 높이  57 km', 2.6)):
        y = Y(km)
        s.append(line(L - 60, y, R + 60, y, col, w, '' if col != AMBER else '6,4'))
        s.append(txt(R + 64, y + 4, lab, 9.8, col, 'start', 800))
    s.append(txt(L - 60, Y(plan) - 10, '궤도선', 9.4, SKY, 'start', 700))
    s.append(txt(20, 292, '같은 수 1 을 한쪽은 「파운드힘」으로, 다른 쪽은 「뉴턴」으로 읽었습니다. '
                          '단위가 다른 값을 같은 것으로 다룬 결과입니다.', 9.4, GRAY, 'start'))
    s.append('</svg>')
    return ''.join(s)


# ─────────────────────────────────────── 제6장 · 등식의 성질 (저울과 알자브르)
@fig('ch06_scale', '2x + 3 = 11 을 푸는 과정입니다. 한 걸음마다 **양쪽에 똑같은 일**을 합니다. '
     '저울이 기울지 않으므로 식은 계속 같은 뜻을 지닙니다. 「넘긴다」는 말은 이 두 걸음을 '
     '줄여 쓴 표기일 뿐입니다.')
def ch06_scale():
    steps = [(2, 3, 11, '처음'), (2, 0, 8, '양변에서 3 빼기'), (1, 0, 4, '양변을 2로 나누기')]
    for a, b, c, _ in steps:
        assert a * 4 + b == c, (a, b, c)

    W, H = 700, 330
    s = [head(W, H)]
    s.append(txt(20, 26, '저울을 기울이지 않고 x 만 남기기', 12.5, NAVY, 'start', 800))
    for i, (a, b, c, what) in enumerate(steps):
        y = 74 + i * 84
        cx, arm = 350, 120
        s.append(line(cx - arm, y, cx + arm, y, NAVY, 2.6))
        s.append(line(cx, y, cx, y + 26, NAVY, 2))
        s.append('<path d="M%d,%d L%d,%d L%d,%d z" fill="%s"/>'
                 % (cx, y + 26, cx - 14, y + 46, cx + 14, y + 46, '#374151'))
        left = ('%dx' % a) + (' + %d' % b if b else '')
        s.append(rect(cx - arm - 52, y + 6, 104, 30, '#E7ECF5', SKY, 1.6, 5))
        s.append(txt(cx - arm, y + 26, left, 13, BLUE, 'middle', 800))
        s.append(rect(cx + arm - 52, y + 6, 104, 30, '#E8F5F1', TEAL, 1.6, 5))
        s.append(txt(cx + arm, y + 26, str(c), 13, TEAL, 'middle', 800))
        s.append(txt(60, y + 26, what, 10.4, GRAY, 'start', 700))
        if i < len(steps) - 1:
            s.append(txt(cx, y + 66, '↓', 14, SKY, 'middle', 800))
    s.append(txt(20, 316, '마지막 줄이 x = 4 입니다. 어느 걸음에서도 한쪽만 건드리지 '
                          '않았습니다.', 9.4, GRAY, 'start'))
    s.append('</svg>')
    return ''.join(s)


@fig('ch06_aljabr', '알콰리즈미가 책 제목에 쓴 두 낱말이 곧 두 가지 동작입니다. '
     '**알자브르**는 모자란 쪽을 채워 제자리로 돌려놓는 일(오늘의 이항)이고, '
     '**알무카발라**는 양쪽의 같은 것을 맞대어 지우는 일(오늘의 동류항 정리)입니다.')
def ch06_aljabr():
    W, H = 700, 290
    s = [head(W, H)]
    s.append(txt(20, 26, '알자브르와 알무카발라 — 두 가지 동작', 12.5, NAVY, 'start', 800))
    rows = [
        ('알자브르 (al-jabr)', '흩어진 것을 제자리로 — 모자란 쪽을 채운다',
         'x² = 40x − 4x²', '5x² = 40x', SKY, '양변에 4x² 을 더했다'),
        ('알무카발라 (al-muqābala)', '마주 놓고 같은 것을 지운다',
         '50 + x² = 29 + 10x', '21 + x² = 10x', TEAL, '양변에서 29 를 뺐다'),
    ]
    for i, (name, say, before, after, col, how) in enumerate(rows):
        y = 70 + i * 108
        s.append(rect(34, y - 16, 632, 86, '#FBFCFE', LINE, 1, 7))
        s.append(txt(52, y + 4, name, 11.6, col, 'start', 800))
        s.append(txt(52, y + 22, say, 9.4, GRAY, 'start'))
        s.append(txt(300, y + 42, before, 12, NAVY, 'middle', 700))
        s.append(txt(410, y + 42, '→', 13, col, 'middle', 800))
        s.append(txt(530, y + 42, after, 12, col, 'middle', 800))
        s.append(txt(300, y + 60, how, 9, GRAY, 'middle'))
    s.append(txt(20, 282, '책 제목 『알자브르와 알무카발라의 계산에 관한 간략한 책』에서 '
                          '앞 낱말이 오늘의 「대수(algebra)」가 되었습니다.', 9.4, GRAY, 'start'))
    s.append('</svg>')
    return ''.join(s)


@fig('ch07_table', '같은 자료를 표로 적은 것과 그래프로 그린 것입니다. 표에서는 300 이 '
     '다섯 칸 되풀이되는 것을 한 칸씩 짚어 가며 찾아야 하지만, 그래프에서는 **평평한 구간**이 '
     '한눈에 들어옵니다. 자료는 똑같고, 읽는 데 드는 노력이 다릅니다.')
def ch07_table():
    W, H = 700, 392
    T = [(t, 60 * t if t <= 5 else (300 if t <= 9 else 300 + 50 * (t - 9)))
         for t in range(16)]
    assert T[5][1] == 300 and T[9][1] == 300
    assert all(T[i][1] == 300 for i in range(5, 10))
    assert T[15][1] == 600
    s = [head(W, H)]
    s.append(txt(20, 24, '집 → 편의점(4분 들름) → 학교 — 같은 자료, 두 가지 적는 법',
                 12.5, NAVY, 'start', 800))
    # ── 표
    x0, cw = 66, 38
    s.append(txt(20, 48, '① 표로 적으면', 10.4, GRAY, 'start', 800))
    s.append(rect(x0 - 46, 56, 46 + cw * 16, 44, '#FBFCFE', LINE, 1, 5))
    s.append(txt(x0 - 40, 73, '분', 9.4, GRAY, 'start', 700))
    s.append(txt(x0 - 40, 94, 'm', 9.4, GRAY, 'start', 700))
    s.append(line(x0 - 46, 78, x0 + cw * 16, 78, LINE, 1))
    for i, (t, d) in enumerate(T):
        cx = x0 + cw * i + cw / 2
        flat = 5 <= t <= 9
        if flat:
            s.append(rect(x0 + cw * i, 80, cw, 20, '#FDF4E3'))
        s.append(txt(cx, 73, str(t), 9.2, NAVY, 'middle', 700))
        s.append(txt(cx, 95, str(d), 9.2, AMBER if flat else NAVY, 'middle',
                     800 if flat else 400))
    s.append(txt(20, 118, '색칠한 다섯 칸이 같은 값입니다 — 표에서는 이것을 눈으로 '
                          '«찾아야» 합니다.', 9.2, GRAY, 'start'))
    # ── 그래프
    GX, GY, GW, GH = 66, 352, 580, 190
    s.append(txt(20, 146, '② 그래프로 그리면', 10.4, GRAY, 'start', 800))

    def px(t):
        return GX + GW * t / 15.0

    def py(d):
        return GY - GH * d / 600.0
    for d in range(0, 601, 150):
        s.append(line(GX, py(d), GX + GW, py(d), LINE, 0.9))
        s.append(txt(GX - 8, py(d) + 3.4, str(d), 8.8, GRAY, 'end'))
    for t in range(0, 16, 3):
        s.append(line(px(t), GY, px(t), GY + 4, LINE, 0.9))
        s.append(txt(px(t), GY + 16, str(t), 8.8, GRAY, 'middle'))
    s.append(rect(px(5), py(300) - 9, px(9) - px(5), 18, '#FDF4E3'))
    s.append('<polyline fill="none" stroke="%s" stroke-width="2.4" points="%s"/>'
             % (BLUE, ' '.join('%.1f,%.1f' % (px(t), py(d)) for t, d in T)))
    for t, d in T:
        s.append('<circle cx="%.1f" cy="%.1f" r="2.4" fill="%s"/>' % (px(t), py(d), BLUE))
    s.append(txt((px(5) + px(9)) / 2, py(300) - 16, '평평한 구간 — 4 분', 9.6, AMBER,
                 'middle', 800))
    s.append(txt(GX + GW, py(600) - 14, '거리(m)', 9.2, GRAY, 'end', 700))
    s.append(txt(GX + GW, GY + 34, '시간(분)', 9.2, GRAY, 'end', 700))
    s.append('</svg>')
    return ''.join(s)


@fig('ch07_story', '같은 걸음을 세 구간으로 끊어 기울기를 계산한 것입니다. 기울기는 '
     '「1 분에 몇 m」이고, 그것이 곧 **속도**입니다. 가운데 구간의 기울기는 0 — 거리가 '
     '변하지 않으니 멈춰 있는 것입니다. 되돌아오는 구간이 아닙니다.')
def ch07_story():
    W, H = 700, 330
    seg = [(0, 0, 5, 300), (5, 300, 9, 300), (9, 300, 15, 600)]
    sl = [(d2 - d1) / (t2 - t1) for t1, d1, t2, d2 in seg]
    assert sl == [60.0, 0.0, 50.0]
    GX, GY, GW, GH = 72, 250, 392, 190
    s = [head(W, H)]
    s.append(txt(20, 24, '기울기 = 거리의 변화 ÷ 시간의 변화 = 속도', 12.5, NAVY, 'start', 800))

    def px(t):
        return GX + GW * t / 15.0

    def py(d):
        return GY - GH * d / 600.0
    for d in range(0, 601, 150):
        s.append(line(GX, py(d), GX + GW, py(d), LINE, 0.9))
        s.append(txt(GX - 8, py(d) + 3.4, str(d), 8.8, GRAY, 'end'))
    for t in range(0, 16, 3):
        s.append(txt(px(t), GY + 17, str(t), 8.8, GRAY, 'middle'))
    s.append(line(GX, GY, GX + GW, GY, GRAY, 1.2))
    s.append(line(GX, GY, GX, py(620), GRAY, 1.2))
    cols = [BLUE, AMBER, TEAL]
    for i, (t1, d1, t2, d2) in enumerate(seg):
        s.append(line(px(t1), py(d1), px(t2), py(d2), cols[i], 3))
        s.append(line(px(t1), py(d1), px(t2), py(d1), cols[i], 1, '3 3'))
        s.append(line(px(t2), py(d1), px(t2), py(d2), cols[i], 1, '3 3'))
        mx, my = (px(t1) + px(t2)) / 2, (py(d1) + py(d2)) / 2
        s.append(txt(mx, my - 10 if i != 1 else my - 14,
                     '기울기 %g' % sl[i], 9.6, cols[i], 'middle', 800))
    for t, d in [(0, 0), (5, 300), (9, 300), (15, 600)]:
        s.append('<circle cx="%.1f" cy="%.1f" r="3.2" fill="#fff" stroke="%s" '
                 'stroke-width="2"/>' % (px(t), py(d), NAVY))
    s.append(txt(GX - 8, py(600) - 14, '집에서의 거리(m)', 9.2, GRAY, 'start', 700))
    s.append(txt(GX + GW, GY + 32, '시간(분)', 9.2, GRAY, 'end', 700))
    # ── 계산 상자
    bx = 496
    s.append(rect(bx - 18, 44, 196, 230, '#FBFCFE', LINE, 1, 7))
    names = ['① 집 → 편의점', '② 편의점에서', '③ 편의점 → 학교']
    for i, (t1, d1, t2, d2) in enumerate(seg):
        y = 76 + i * 72
        s.append(txt(bx, y, names[i], 10, cols[i], 'start', 800))
        s.append(txt(bx, y + 19, '(%d − %d) ÷ (%d − %d)' % (d2, d1, t2, t1), 9.6, NAVY))
        s.append(txt(bx, y + 37, '= %g m/분' % sl[i], 11, cols[i], 'start', 800))
        if i < 2:
            s.append(line(bx - 6, y + 50, bx + 168, y + 50, LINE, 0.9))
    s.append(txt(bx, 294, '가운데 구간만 0 입니다.', 9.2, GRAY, 'start', 700))
    s.append(txt(bx, 310, '0 은 「멈춤」입니다.', 9.2, AMBER, 'start', 800))
    s.append('</svg>')
    return ''.join(s)


@fig('ch07_axis', '운동장을 한 바퀴 돌 때, 세로축을 무엇으로 두느냐에 따라 그림이 아예 '
     '달라집니다. **달린 거리**는 끝까지 올라가고 **출발점에서의 거리**는 0 으로 돌아옵니다. '
     '둘레 400 m 인 원 트랙을 2 분에 한 바퀴 돈다고 보고 계산했습니다 — 반 바퀴에서 '
     '출발점과 가장 멀어지고, 그 거리는 지름 400 ÷ π ≒ 127.3 m 입니다.')
def ch07_axis():
    W, H = 700, 348
    C = 400.0
    R = C / (2 * math.pi)
    assert round(2 * R, 1) == 127.3
    N = 60
    ts = [120.0 * k / N for k in range(N + 1)]
    run = [C * t / 120.0 for t in ts]
    strt = [2 * R * math.sin(math.pi * t / 120.0) for t in ts]
    assert round(run[-1], 6) == 400.0
    assert round(strt[-1], 6) == 0.0
    assert round(max(strt), 1) == 127.3
    s = [head(W, H)]
    s.append(txt(20, 24, '같은 한 바퀴 — 세로축을 바꾸면 그림이 바뀐다', 12.5, NAVY, 'start', 800))
    panels = [('세로축 = 달린 거리 · 가로축 = 시간(초)', run, 400.0, TEAL,
               '끝까지 올라갑니다 — 400 m 를 달렸으니까요.'),
              ('세로축 = 출발점에서의 거리 · 가로축 = 시간(초)', strt, 150.0, BLUE,
               '0 으로 돌아옵니다 — 제자리니까요.')]
    for i, (name, ys, top, col, say) in enumerate(panels):
        GX, GY, GW, GH = 66 + i * 330, 262, 258, 176
        s.append(txt(GX - 4, 54, name, 10.6, col, 'start', 800))

        def px(t, GX=GX, GW=GW):
            return GX + GW * t / 120.0

        def py(v, GY=GY, GH=GH, top=top):
            return GY - GH * v / top
        for k in range(5):
            v = top * k / 4.0
            s.append(line(GX, py(v), GX + GW, py(v), LINE, 0.9))
            s.append(txt(GX - 7, py(v) + 3.4, '%g' % round(v), 8.6, GRAY, 'end'))
        for t in (0, 30, 60, 90, 120):
            s.append(txt(px(t), GY + 16, '%g' % t, 8.6, GRAY, 'middle'))
        s.append(line(GX, GY, GX + GW, GY, GRAY, 1.2))
        s.append(line(GX, GY, GX, py(top) - 6, GRAY, 1.2))
        s.append('<polyline fill="none" stroke="%s" stroke-width="2.6" points="%s"/>'
                 % (col, ' '.join('%.1f,%.1f' % (px(t), py(v))
                                  for t, v in zip(ts, ys))))
        s.append(txt(px(60), py(max(ys)) - 12, '%.1f m' % max(ys), 9.4, col, 'middle', 800)
                 if i else '')
        s.append(txt(GX - 4, GY + 36, say, 9.4, col, 'start', 700))
    s.append(rect(34, 310, 632, 26, '#FBFCFE', LINE, 1, 6))
    s.append(txt(350, 327, '「그래프가 내려간다」를 읽기 전에 물어야 할 것은 늘 '
                           '— 세로축이 무엇을 재는가', 9.6, NAVY, 'middle', 700))
    s.append('</svg>')
    return ''.join(s)


@fig('ch08_lever', '무게 600 N(약 61 kgf) 인 짐을 받침점에서 0.4 m 자리에 놓고, 손의 '
     '거리만 바꿔 가며 필요한 힘을 계산한 것입니다. 거리가 2 배가 되면 힘은 절반이 됩니다. '
     '**거리 × 힘** 은 다섯 경우 모두 240 N·m 으로 같습니다.')
def ch08_lever():
    W, H = 700, 352
    load, a_mm = 600, 400
    ds = [400, 800, 1200, 1600, 2400]
    Fs = [load * a_mm / d for d in ds]
    assert Fs == [600.0, 300.0, 200.0, 150.0, 100.0]
    assert all(round(d * F / 1000.0, 6) == 240.0 for d, F in zip(ds, Fs))
    s = [head(W, H)]
    s.append(txt(20, 24, '지레 — 받침점에서 멀어지면 힘이 줄어든다', 12.5, NAVY, 'start', 800))
    # ── 지레 그림 (가장 짧은 경우와 가장 긴 경우)
    fx, fy = 150, 150
    s.append(txt(20, 52, '같은 짐, 두 가지 손자리', 10.4, GRAY, 'start', 800))
    scale = 0.085                                   # mm → px
    for i, d in enumerate((400, 2400)):
        y = 96 + i * 76
        s.append(line(fx - a_mm * scale - 12, y, fx + d * scale + 12, y, NAVY, 3))
        s.append('<polygon points="%.1f,%.1f %.1f,%.1f %.1f,%.1f" fill="%s"/>'
                 % (fx, y + 3, fx - 9, y + 20, fx + 9, y + 20, GRAY))
        s.append(rect(fx - a_mm * scale - 14, y - 22, 28, 20, SKY, 'none', 1, 3))
        s.append(txt(fx - a_mm * scale, y - 28, '600 N', 8.8, SKY, 'middle', 800))
        s.append(txt(fx - a_mm * scale, y + 34, '0.4 m', 8.6, GRAY, 'middle'))
        s.append(txt(fx + d * scale, y - 10, '↓', 13, AMBER, 'middle', 800))
        s.append(txt(fx + d * scale + 4, y - 24, '%g N' % (load * a_mm / d), 9.6,
                     AMBER, 'middle', 800))
        s.append(txt(fx + d * scale, y + 34, '%.1f m' % (d / 1000.0), 8.6, GRAY, 'middle'))
        if i == 0:
            s.append(txt(fx, y + 40, '받침점', 8.4, GRAY, 'middle', 700))
    # ── 표
    tx, ty = 404, 70
    s.append(txt(tx, 52, '손의 거리 d 와 필요한 힘 F', 10.4, GRAY, 'start', 800))
    s.append(rect(tx - 8, ty - 16, 272, 150, '#FBFCFE', LINE, 1, 7))
    cols = ['d (m)', 'F (N)', 'd × F']
    for j, c in enumerate(cols):
        s.append(txt(tx + 24 + j * 82, ty, c, 9.4, GRAY, 'middle', 800))
    s.append(line(tx - 8, ty + 8, tx + 264, ty + 8, LINE, 1))
    for i, (d, F) in enumerate(zip(ds, Fs)):
        y = ty + 30 + i * 22
        s.append(txt(tx + 24, y, '%.1f' % (d / 1000.0), 9.6, NAVY, 'middle'))
        s.append(txt(tx + 106, y, '%g' % F, 9.6, BLUE, 'middle', 700))
        s.append(txt(tx + 188, y, '240', 9.6, TEAL, 'middle', 800))
    s.append(txt(tx + 188, ty + 150, '← 늘 같다', 9.2, TEAL, 'middle', 800))
    s.append(txt(20, 266, '아르키메데스가 증명한 것이 이 표의 마지막 열입니다 — '
                          '「무게는 받침점에서의 거리에 반비례하는 자리에서 균형을 이룬다」.',
                 9.8, NAVY, 'start', 700))
    s.append(rect(34, 282, 632, 48, '#FBFCFE', LINE, 1, 7))
    s.append(txt(350, 306, '힘 × 받침점에서의 거리 = 240 N·m  (일정)', 13, TEAL, 'middle', 800))
    s.append(txt(350, 322, 'x × y = k — 반비례', 9.4, GRAY, 'middle', 700))
    s.append('</svg>')
    return ''.join(s)


@fig('ch08_two', '정비례와 반비례를 나란히 둔 것입니다. 용수철은 **y ÷ x** 가, 지레는 '
     '**x × y** 가 변하지 않습니다. 「무엇이 변하지 않는가」 하나만 보면 두 관계를 '
     '그래프 없이도 가릴 수 있습니다. 용수철 값은 1 N 당 1.5 cm 늘어나는 용수철을 가정해 '
     '계산했고, 지레 값은 앞 그림과 같습니다.')
def ch08_two():
    W, H = 700, 336
    xs = [1, 2, 3, 4, 5]
    ys = [15 * x / 10.0 for x in xs]
    assert all(round(y / x, 6) == 1.5 for x, y in zip(xs, ys))
    dd = [400, 800, 1200, 1600, 2400]
    FF = [600 * 400 / d for d in dd]
    assert all(round(d * F / 1000.0, 6) == 240.0 for d, F in zip(dd, FF))
    s = [head(W, H)]
    s.append(txt(20, 24, '무엇이 변하지 않는가 — 정비례와 반비례', 12.5, NAVY, 'start', 800))
    blocks = [
        ('정비례 · 용수철', 'y = 1.5x', ['힘 x (N)', '늘어남 y (cm)', 'y ÷ x', 'x × y'],
         [['%g' % x for x in xs], ['%.1f' % y for y in ys],
          ['1.5'] * 5, ['%.1f' % (x * y) for x, y in zip(xs, ys)]], 2, TEAL),
        ('반비례 · 지레', 'y = 240 ÷ x', ['거리 x (m)', '힘 y (N)', 'y ÷ x', 'x × y'],
         [['%.1f' % (d / 1000.0) for d in dd], ['%g' % F for F in FF],
          ['%g' % round(F / (d / 1000.0)) for d, F in zip(dd, FF)], ['240'] * 5], 3, BLUE),
    ]
    for i, (name, eq, heads, cells, keep, col) in enumerate(blocks):
        x0, y0 = 30 + i * 340, 56
        s.append(rect(x0, y0 - 14, 310, 234, '#FBFCFE', LINE, 1, 7))
        s.append(txt(x0 + 14, y0 + 4, name, 11.4, col, 'start', 800))
        s.append(txt(x0 + 296, y0 + 4, eq, 10.6, NAVY, 'end', 700))
        for j, hd in enumerate(heads):
            cx = x0 + 44 + j * 74
            if j == keep:
                s.append(rect(cx - 34, y0 + 14, 68, 148, '#F0F7F4' if i == 0 else '#EEF4FC'))
            s.append(txt(cx, y0 + 30, hd, 8.8, col if j == keep else GRAY, 'middle', 800))
        s.append(line(x0 + 8, y0 + 38, x0 + 302, y0 + 38, LINE, 1))
        for r in range(5):
            for j in range(4):
                cx = x0 + 44 + j * 74
                s.append(txt(cx, y0 + 58 + r * 21, cells[j][r], 9.4,
                             col if j == keep else NAVY, 'middle',
                             800 if j == keep else 400))
        s.append(txt(x0 + 44 + keep * 74, y0 + 180, '↑ 변하지 않는 열', 8.8, col,
                     'middle', 800))
        s.append(txt(x0 + 14, y0 + 206, '네 열 가운데 한 열만 일정합니다.',
                     9, GRAY, 'start'))
    s.append(txt(20, 316, '정비례는 y ÷ x = a 가 일정하고, 반비례는 x × y = k 가 '
                          '일정합니다. 두 관계를 가르는 것은 그래프 모양이 아니라 이 한 줄입니다.',
                 9.6, NAVY, 'start', 700))
    s.append('</svg>')
    return ''.join(s)


@fig('ch08_asym', '지레의 식 y = 240 ÷ x 를 그린 것입니다. 오른쪽으로 갈수록 0 에 '
     '가까워지지만 **닿지는 않습니다** — 막대를 아무리 길게 해도 힘이 0 이 되지는 않습니다. '
     '왼쪽에서는 위로 치솟고, x = 0 에서는 아예 값이 없습니다. 받침점 위에서는 짐을 '
     '들 수 없다는 뜻입니다.')
def ch08_asym():
    W, H = 700, 330
    k = 240.0
    marks = [(0.4, 600.0), (0.8, 300.0), (1.2, 200.0), (1.6, 150.0), (2.4, 100.0)]
    assert all(round(x * y, 6) == k for x, y in marks)
    GX, GY, GW, GH = 72, 268, 560, 212
    XMAX, YMAX = 6.0, 650.0
    s = [head(W, H)]
    s.append(txt(20, 24, 'y = 240 ÷ x — 0 에 가까워지지만 닿지 않는다', 12.5, NAVY, 'start', 800))

    def px(x):
        return GX + GW * x / XMAX

    def py(y):
        return GY - GH * y / YMAX
    for y in range(0, 601, 150):
        s.append(line(GX, py(y), GX + GW, py(y), LINE, 0.9))
        s.append(txt(GX - 8, py(y) + 3.4, str(y), 8.8, GRAY, 'end'))
    for x in range(0, 7):
        s.append(txt(px(x), GY + 17, str(x), 8.8, GRAY, 'middle'))
    s.append(line(GX, GY, GX + GW, GY, GRAY, 1.3))
    s.append(line(GX, GY, GX, py(YMAX) - 4, GRAY, 1.3))
    pts = []
    x = 0.37
    while x <= XMAX + 1e-9:
        y = k / x
        if y <= YMAX:
            pts.append((px(x), py(y)))
        x += 0.02
    s.append('<polyline fill="none" stroke="%s" stroke-width="2.6" points="%s"/>'
             % (BLUE, ' '.join('%.1f,%.1f' % p for p in pts)))
    for mx, my in marks:
        s.append('<circle cx="%.1f" cy="%.1f" r="3.4" fill="#fff" stroke="%s" '
                 'stroke-width="2"/>' % (px(mx), py(my), AMBER))
        s.append(txt(px(mx) + 7, py(my) - 7, '(%.1f, %g)' % (mx, my), 8.8, AMBER,
                     'start', 700))
    s.append(txt(px(1.5), py(612), '← x = 0 에서는 값이 없다 '
                 '— 받침점 바로 위에서는 들 수 없다', 9.4, RED, 'start', 800))
    s.append(txt(px(5.95), py(168), '막대를 아무리 길게 해도', 9.2, BLUE, 'end', 700))
    s.append(txt(px(5.95), py(126), '힘이 0 이 되지는 않는다 ↓', 9.2, BLUE, 'end', 800))
    s.append(txt(GX - 8, py(YMAX) - 12, '힘 y (N)', 9.2, GRAY, 'start', 700))
    s.append(txt(GX + GW, GY + 32, '받침점에서 손까지 거리 x (m)', 9.2, GRAY, 'end', 700))
    s.append(txt(20, 312, '주황 점 다섯 개는 앞 표의 다섯 줄입니다. 모두 x × y = 240 '
                          '위에 있습니다.', 9.4, GRAY, 'start'))
    s.append('</svg>')
    return ''.join(s)


@fig('ch08_earth', '「지구를 1 cm 들어올린다」를 일의 원리로 계산한 것입니다. 지레는 '
     '힘을 줄여 주지만 **힘 × 거리**는 줄여 주지 않습니다. 600 N 으로 밀어 그 일을 하려면 '
     '내 손이 약 9.8 × 10²⁰ m — 10 만 광년 — 을 움직여야 합니다. 지구 질량 '
     '5.9722 × 10²⁴ kg, 중력 가속도 9.80665 m/s², 광년 9.4607 × 10¹⁵ m 으로 계산했습니다.')
def ch08_earth():
    W, H = 700, 302
    M, g, h, F = 5.9722e24, 9.80665, 0.01, 600.0
    LY, YR = 9.4607e15, 3.15576e7
    work = M * g * h
    dist = work / F
    ly = dist / LY
    yrs = dist / YR
    assert round(work / 1e23, 2) == 5.86
    assert round(dist / 1e20, 2) == 9.76
    assert round(ly / 1000.0) == 103
    assert round(yrs / 1e12) == 31
    s = [head(W, H)]
    s.append(txt(20, 24, '지레는 힘을 줄여 준다 — 거리는 줄여 주지 않는다', 12.5, NAVY,
                 'start', 800))
    rows = [
        ('지구를 1 cm 들어올리는 데 드는 일', '5.9722×10²⁴ kg × 9.80665 m/s² × 0.01 m',
         '≒ 5.86 × 10²³ J', SKY),
        ('내가 600 N 으로 밀어 그 일을 하려면', '5.86×10²³ J ÷ 600 N',
         '≒ 9.76 × 10²⁰ m', BLUE),
        ('그 거리를 광년으로 바꾸면', '9.76×10²⁰ m ÷ 9.4607×10¹⁵ m',
         '≒ 10 만 광년', TEAL),
        ('1 m/s 로 밀어도 걸리는 시간', '9.76×10²⁰ m ÷ 1 m/s',
         '≒ 31 조 년', AMBER),
    ]
    for i, (what, how, ans, col) in enumerate(rows):
        y = 60 + i * 56
        s.append(rect(34, y - 20, 632, 46, '#FBFCFE', LINE, 1, 7))
        s.append(txt(52, y - 2, what, 10.2, col, 'start', 800))
        s.append(txt(52, y + 16, how, 9, GRAY, 'start'))
        s.append(txt(648, y + 6, ans, 12.4, col, 'end', 800))
        if i < 3:
            s.append(txt(350, y + 36, '↓', 12, LINE, 'middle', 800))
    s.append(txt(20, 294, '아르키메데스의 말이 참인 까닭과, 그 말이 공허한 까닭이 같은 '
                          '식 하나에 들어 있습니다 — 힘 × 거리.', 9.6, NAVY, 'start', 700))
    s.append('</svg>')
    return ''.join(s)


def _ray(x0, y0, ang, L):
    """각(도) 방향으로 길이 L 인 선분의 끝점."""
    r = math.radians(ang)
    return x0 + L * math.cos(r), y0 - L * math.sin(r)


@fig('ch09_angles', '평행한 두 직선을 한 직선이 가로지르면 각이 여덟 개 생깁니다. 자른 각을 '
     '65° 로 두고 여덟 각을 모두 계산해 적었습니다. **동위각**(같은 자리)끼리 같고, '
     '**엇각**(엇갈린 안쪽)끼리 같고, **동측내각**(같은 쪽 안쪽)은 합이 180° 입니다. '
     '이름은 «자리» 를 가리킬 뿐이고, 같아지는 것은 평행할 때뿐입니다.')
def ch09_angles():
    W, H = 700, 360
    th = 65.0
    a = th                      # 예각
    b = 180.0 - th              # 둔각
    assert round(a + b, 6) == 180.0
    s = [head(W, H)]
    s.append(txt(20, 24, '평행선을 가로지르면 생기는 여덟 각 (자른 각 65°)', 12.5, NAVY,
                 'start', 800))
    y1, y2 = 110, 250
    x0, x1 = 70, 470
    # 가로지르는 선 — 위쪽 교점에서 아래쪽 교점으로
    dx = (y2 - y1) / math.tan(math.radians(th))
    cx1, cx2 = 220.0, 220.0 + dx
    s.append(line(cx1 - 70 / math.tan(math.radians(th)), y1 - 70,
                  cx2 + 70 / math.tan(math.radians(th)), y2 + 70, AMBER, 2.2))
    for y in (y1, y2):
        s.append(line(x0, y, x1, y, NAVY, 2.2))
    s.append(txt(x1 + 8, y1 + 4, 'ℓ', 12, NAVY, 'start', 800))
    s.append(txt(x1 + 8, y2 + 4, 'm', 12, NAVY, 'start', 800))
    s.append(txt(x0 - 10, y1 - 54, '가로지르는 선', 9.2, AMBER, 'middle', 700))
    # 여덟 각 — (교점, 라벨자리각, 값, 이름)
    marks = [(cx1, y1, 1, 2, b, '①'), (cx1, y1, -1, 2, a, '②'),
             (cx1, y1, 1, -2, a, '③'), (cx1, y1, -1, -2, b, '④'),
             (cx2, y2, 1, 2, b, '⑤'), (cx2, y2, -1, 2, a, '⑥'),
             (cx2, y2, 1, -2, a, '⑦'), (cx2, y2, -1, -2, b, '⑧')]
    for cx, cy, sx, sy, v, nm in marks:
        px = cx + sx * 34
        py = cy - sy * 13
        s.append(txt(px, py, '%s' % nm, 8.6, GRAY, 'middle', 700))
        s.append(txt(px, py + 15, '%g°' % v, 10.4, SKY if v == a else TEAL,
                     'middle', 800))
    # 설명 상자
    bx = 500
    rows = [('동위각', '③ 과 ⑦', '%g° = %g°' % (a, a), '같다', SKY),
            ('엇각', '④ 와 ⑥', '%g° = %g°' % (b, b), '같다', TEAL),
            ('동측내각', '③ 과 ⑥', '%g° + %g° = 180°' % (a, b), '합이 180°', AMBER)]
    s.append(rect(bx - 16, 60, 192, 190, '#FBFCFE', LINE, 1, 7))
    for i, (nm, who, eq, say, col) in enumerate(rows):
        y = 92 + i * 60
        s.append(txt(bx, y, nm, 11, col, 'start', 800))
        s.append(txt(bx + 164, y, who, 9, GRAY, 'end', 700))
        s.append(txt(bx, y + 18, eq, 10.2, NAVY, 'start'))
        s.append(txt(bx + 164, y + 18, say, 9.2, col, 'end', 800))
        if i < 2:
            s.append(line(bx - 6, y + 32, bx + 170, y + 32, LINE, 0.9))
    s.append(txt(20, 316, '한 직선 위의 이웃한 두 각은 늘 합이 180° 입니다(① + ② = 180°). '
                          '여기서 나머지가 모두 따라 나옵니다.', 9.6, NAVY, 'start', 700))
    s.append(txt(20, 338, '평행이 아니면 — 이름은 그대로지만 크기는 더 이상 같지 않습니다. '
                          '다음 그림에서 확인합니다.', 9.4, GRAY, 'start'))
    s.append('</svg>')
    return ''.join(s)


@fig('ch09_broken', '평행을 깨뜨린 경우입니다. 위 직선 ℓ 은 그대로 두고 아래 직선 m 만 '
     '10° 돌렸더니, 같은 자리의 각(동위각)이 65° 와 55° 로 **달라졌습니다.** 이름은 자리를 '
     '가리킬 뿐이어서 그대로인데 「같다」는 성질만 사라졌습니다. 두 직선은 더 이상 평행이 '
     '아니므로 **언젠가 만납니다** — 다만 10° 만 틀어지면 만나는 자리가 그림 밖 멀리라, '
     '그림 안에서는 여전히 평행처럼 보입니다. 눈으로 「평행해 보인다」가 근거가 될 수 없는 '
     '까닭입니다.')
def ch09_broken():
    W, H = 700, 356
    th, tilt = 65.0, 10.0
    a1, a2 = th, th - tilt
    assert a2 == 55.0
    y1 = 86.0
    x0, x1 = 60.0, 560.0
    bx, by = 80.0, 212.0                   # m 이 지나는 점
    cx1 = 250.0                            # 가로지르는 선이 ℓ 을 자르는 자리
    t_dir = (math.cos(math.radians(th)), math.sin(math.radians(th)))   # 화면 좌표(아래 +)
    m_dir = (math.cos(math.radians(tilt)), math.sin(math.radians(tilt)))
    # 교점: (cx1,y1) + t·t_dir = (bx,by) + s·m_dir  를 푼다
    det = t_dir[0] * (-m_dir[1]) - t_dir[1] * (-m_dir[0])
    rx, ry = bx - cx1, by - y1
    t = (rx * (-m_dir[1]) - ry * (-m_dir[0])) / det
    ix, iy = cx1 + t * t_dir[0], y1 + t * t_dir[1]
    assert 300 < ix < 360 and 250 < iy < 300, (ix, iy)
    # 두 직선이 실제로 만나는 자리 (ℓ 과 m)
    meet_x = bx + (y1 - by) / math.tan(math.radians(tilt)) * -1
    meet_x = bx + (by - y1) / math.tan(math.radians(tilt))
    assert round(meet_x) == 795, round(meet_x)
    s = [head(W, H)]
    s.append(txt(20, 24, '평행을 깨뜨리면 — 이름은 남고 성질만 사라진다', 12.5, NAVY,
                 'start', 800))
    s.append(line(cx1 - 48 * t_dir[0], y1 - 48 * t_dir[1],
                  cx1 + 232 * t_dir[0], y1 + 232 * t_dir[1], AMBER, 2.2))
    s.append(line(x0, y1, x1, y1, NAVY, 2.2))
    s.append(line(bx, by, 520.0, by + (520.0 - bx) * math.tan(math.radians(tilt)),
                  RED, 2.2))
    s.append(txt(x1 + 8, y1 + 4, 'ℓ', 12, NAVY, 'start', 800))
    s.append(txt(528, by + (520.0 - bx) * math.tan(math.radians(tilt)) + 4, 'm', 12,
                 RED, 'start', 800))
    s.append(txt(cx1 - 54, y1 - 42, '가로지르는 선', 9.2, AMBER, 'middle', 700))
    s.append(txt(cx1 + 40, y1 + 26, '65°', 11.4, SKY, 'middle', 800))
    s.append(txt(cx1 + 40, y1 + 42, '③ 동위각', 8.6, GRAY, 'middle', 700))
    s.append(txt(ix + 42, iy + 24, '55°', 11.4, RED, 'middle', 800))
    s.append(txt(ix + 42, iy + 40, '⑦ 동위각', 8.6, GRAY, 'middle', 700))
    s.append(txt(bx - 14, by - 12, 'm 을 10° 돌렸다', 9.2, RED, 'start', 700))
    s.append(rect(34, 300, 632, 44, '#FFF6F5', '#E6C4C0', 1, 7))
    s.append(txt(350, 320, '동위각 65° ≠ 55°  — 이름은 「동위각」 그대로, 「같다」만 '
                           '없어졌다', 12, RED, 'middle', 800))
    s.append(txt(350, 336, '그래서 증명에 「평행하므로」 를 반드시 적는다', 9.2, GRAY,
                 'middle', 700))
    s.append('</svg>')
    return ''.join(s)


@fig('ch09_vanish', '실제로 평행한 철길이 왜 한 점으로 모여 보이는지를 **계산해서** 그린 '
     '것입니다. 눈높이 1.6 m 에서 1 m 앞에 화면을 세우고, 궤간 1.435 m 인 선로에 침목을 '
     '2 m 마다 놓았습니다. 거리 Z 에 있는 점은 화면의 (0.7175 ÷ Z, 1.6 ÷ Z) 자리에 맺히므로 '
     'Z 가 커질수록 두 레일이 **한 점으로 모입니다.** 왼쪽에서 일정했던 침목 간격이 '
     '오른쪽에서는 위로 갈수록 촘촘해집니다 — 그림이 거리를 그렇게 말합니다.')
def ch09_vanish():
    W, H = 700, 392
    g, d, hgt = 1.435 / 2.0, 1.0, 1.6
    zs = [4 + 2 * k for k in range(11)]                  # 4 m ~ 24 m, 2 m 간격
    xi = [d * g / z for z in zs]
    yi = [d * hgt / z for z in zs]
    assert zs[-1] == 24
    assert round(xi[0], 4) == round(0.7175 / 4, 4)
    assert all(round(x * z, 6) == round(d * g, 6) for x, z in zip(xi, zs))
    gaps = [yi[k] - yi[k + 1] for k in range(len(zs) - 1)]
    assert all(gaps[k] > gaps[k + 1] for k in range(len(gaps) - 1))   # 위로 갈수록 촘촘
    s = [head(W, H)]
    s.append(txt(20, 24, '평행한 철길이 한 점으로 모이는 까닭', 12.5, NAVY, 'start', 800))
    # ── ① 위에서 본 그림
    s.append(txt(20, 54, '① 위에서 본 실제 — 간격이 끝까지 같다', 10.2, GRAY, 'start', 800))
    PX, PZ = 30.0, 8.2                                   # m → px (가로는 과장)
    ex, ey = 150.0, 330.0
    for sgn in (-1, 1):
        s.append(line(ex + sgn * g * PX, ey - 4 * PZ, ex + sgn * g * PX,
                      ey - 26 * PZ, NAVY, 2))
    for z in zs:
        s.append(line(ex - g * PX, ey - z * PZ, ex + g * PX, ey - z * PZ, GRAY, 1.2))
    s.append('<circle cx="%.1f" cy="%.1f" r="4" fill="%s"/>' % (ex, ey, AMBER))
    s.append(txt(ex - 12, ey + 4, '눈', 9.2, AMBER, 'end', 800))
    s.append(txt(ex + g * PX + 10, ey - 5 * PZ, '1.435 m', 8.8, GRAY, 'start', 700))
    s.append(txt(ex + g * PX + 10, ey - 15 * PZ, '침목 2 m 마다', 8.8, GRAY, 'start', 700))
    s.append(txt(20, 348, '가로는 보기 좋게 과장했습니다. 세로가 거리입니다.', 8.8,
                 GRAY, 'start'))
    # ── ② 화면에 맺힌 그림
    GX, GY, GW, GH = 330, 336, 336, 268
    s.append(txt(GX - 4, 54, '② 화면에 맺힌 그림 — 한 점으로 모인다', 10.2, GRAY,
                 'start', 800))
    s.append(rect(GX, GY - GH, GW, GH, '#FBFCFE', LINE, 1, 5))
    cx = GX + GW / 2.0
    hz = GY - GH + 34                                    # 지평선(소실점 높이)
    S = 480.0                                            # 화면 좌표 m → px
    assert yi[0] * S < GH - 40
    for sgn in (-1, 1):
        s.append(line(cx + sgn * xi[0] * S, hz + yi[0] * S, cx, hz, NAVY, 2.4))
    for z, x, y in zip(zs, xi, yi):
        s.append(line(cx - x * S, hz + y * S, cx + x * S, hz + y * S, GRAY, 1.2))
    s.append(line(GX + 8, hz, GX + GW - 8, hz, SKY, 1, '4 4'))
    s.append(txt(GX + GW - 10, hz - 8, '지평선 = 눈높이', 8.8, SKY, 'end', 700))
    s.append('<circle cx="%.1f" cy="%.1f" r="3.6" fill="#fff" stroke="%s" '
             'stroke-width="2"/>' % (cx, hz, RED))
    s.append(txt(cx + 12, hz + 16, '소실점', 9.6, RED, 'start', 800))
    s.append(txt(cx, hz + yi[0] * S + 18, 'Z = 4 m', 8.8, GRAY, 'middle', 700))
    s.append(txt(cx + xi[4] * S + 10, hz + yi[4] * S + 4, 'Z = 12 m', 8.8, GRAY,
                 'start', 700))
    # ── 계산 줄
    s.append(rect(34, 356, 632, 28, '#FBFCFE', LINE, 1, 6))
    cells = ['%g m → %.3f' % (z, x) for z, x in zip(zs[:5], xi[:5])]
    s.append(txt(44, 374, '레일이 화면에 맺히는 자리(m):  ' + '   ·   '.join(cells) +
                 '   …   거리가 2 배면 자리는 절반 (제8장의 반비례)', 9, NAVY, 'start', 700))
    s.append('</svg>')
    return ''.join(s)


def _arc_meet(a, b, c):
    """밑변 a 의 두 끝에서 반지름 b·c 인 두 원이 만나는 점(위쪽). 못 만나면 None."""
    if b + c <= a or abs(b - c) >= a:
        return None
    x = (a * a + b * b - c * c) / (2.0 * a)
    h2 = b * b - x * x
    if h2 <= 0:
        return None
    return x, math.sqrt(h2)


@fig('ch10_arcs', '밑변을 긋고 두 끝에서 컴퍼스로 호를 그리는 세 경우입니다. **두 호가 '
     '만나야** 세 번째 꼭짓점이 생깁니다. 두 짧은 변의 합이 밑변보다 길면 만나고(①), '
     '꼭 같으면 한 점에서 닿기만 하고(②), 짧으면 서로 닿지 못합니다(③). ② 와 ③ 에서는 '
     '삼각형이 「그리기 어려운」 것이 아니라 **아예 없습니다.**')
def ch10_arcs():
    W, H = 700, 282
    cases = [(140.0, 110.0, 90.0, '① 110 + 90 = 200 > 140', TEAL, '만난다 — 삼각형이 된다'),
             (200.0, 110.0, 90.0, '② 110 + 90 = 200 = 200', AMBER, '한 점에서 닿는다 — 납작하다'),
             (240.0, 110.0, 90.0, '③ 110 + 90 = 200 < 240', RED, '못 만난다 — 삼각형이 없다')]
    assert _arc_meet(*cases[0][:3]) is not None
    assert _arc_meet(*cases[1][:3]) is None
    assert _arc_meet(*cases[2][:3]) is None
    sc = 0.55

    def arc(cx, cy, r, a0, a1, col):
        """중심 (cx,cy) · 반지름 r 인 호를 각 a0→a1(도, 위가 +) 로 그린다."""
        p0 = (cx + r * math.cos(math.radians(a0)), cy - r * math.sin(math.radians(a0)))
        p1 = (cx + r * math.cos(math.radians(a1)), cy - r * math.sin(math.radians(a1)))
        return ('<path d="M %.1f %.1f A %.1f %.1f 0 0 0 %.1f %.1f" fill="none" '
                'stroke="%s" stroke-width="1.5" stroke-dasharray="3 3"/>'
                % (p0[0], p0[1], r, r, p1[0], p1[1], col))
    s = [head(W, H)]
    s.append(txt(20, 24, '두 호가 만나는가 — 삼각형이 되는 조건', 12.5, NAVY, 'start', 800))
    for i, (a, b, c, lab, col, say) in enumerate(cases):
        ox, oy = 66 + i * 216, 175
        s.append(line(ox, oy, ox + a * sc, oy, NAVY, 2.4))
        s.append(arc(ox, oy, b * sc, -10, 150, SKY))
        s.append(arc(ox + a * sc, oy, c * sc, 30, 190, TEAL))
        p = _arc_meet(a, b, c)
        if p:
            px, py = ox + p[0] * sc, oy - p[1] * sc
            s.append(line(ox, oy, px, py, SKY, 2.2))
            s.append(line(ox + a * sc, oy, px, py, TEAL, 2.2))
            s.append('<circle cx="%.1f" cy="%.1f" r="3.4" fill="#fff" stroke="%s" '
                     'stroke-width="2"/>' % (px, py, col))
        elif b + c == a:
            px = ox + b * sc
            s.append('<circle cx="%.1f" cy="%.1f" r="3.4" fill="#fff" stroke="%s" '
                     'stroke-width="2"/>' % (px, oy, col))
            s.append(txt(px, oy - 12, '↓ 여기서 겨우 닿는다', 8.6, col, 'middle', 700))
        else:
            s.append(txt((ox + b * sc + ox + (a - c) * sc) / 2, oy - 14, '✕ 사이가 비어 있다',
                         8.8, RED, 'middle', 800))
        s.append(txt(ox, oy + 20, 'a = %g' % a, 9.2, NAVY, 'start', 700))
        s.append(txt(ox, oy + 42, lab, 9.6, col, 'start', 800))
        s.append(txt(ox, oy + 58, say, 9, GRAY, 'start'))
    s.append(txt(20, 266, '컴퍼스로 호를 그리는 일은 「한 끝에서 그만큼 떨어진 곳을 '
                          '모두 표시하는 일」입니다. 두 표시가 겹치는 자리가 꼭짓점입니다.',
                 9.4, GRAY, 'start'))
    s.append('</svg>')
    return ''.join(s)


@fig('ch10_range', '두 변이 5 와 9 일 때 나머지 한 변 a 가 가질 수 있는 값입니다. '
     'a 가 가장 긴 변이면 a < 5 + 9 = 14 이어야 하고, 9 가 가장 긴 변이면 9 < 5 + a 에서 '
     'a > 4 여야 합니다. 두 조건을 겹치면 **4 < a < 14** — 양끝은 들어가지 않습니다. '
     '정수는 5 부터 13 까지 아홉 개입니다.')
def ch10_range():
    W, H = 700, 272
    b, c = 5, 9
    lo, hi = c - b, c + b
    assert (lo, hi) == (4, 14)
    ok = [n for n in range(1, 20) if lo < n < hi]
    assert ok == [5, 6, 7, 8, 9, 10, 11, 12, 13] and len(ok) == 9
    s = [head(W, H)]
    s.append(txt(20, 24, '두 변이 5 와 9 일 때, 나머지 한 변이 될 수 있는 값', 12.5, NAVY,
                 'start', 800))
    GX, GY, GW = 60, 150, 584
    def px(v):
        return GX + GW * v / 19.0
    s.append(line(GX, GY, GX + GW, GY, GRAY, 1.6))
    for v in range(0, 20):
        s.append(line(px(v), GY - 4, px(v), GY + 4, GRAY, 1))
        if v % 2 == 0:
            s.append(txt(px(v), GY + 28, str(v), 8.8, GRAY, 'middle'))
    s.append(rect(px(lo), GY - 16, px(hi) - px(lo), 32, '#EAF4F1'))
    for n in ok:
        s.append('<circle cx="%.1f" cy="%.1f" r="4.2" fill="%s"/>' % (px(n), GY, TEAL))
        s.append(txt(px(n), GY - 22, str(n), 9, TEAL, 'middle', 800))
    for v, why in ((lo, 'a = 4 이면 9 = 5 + 4 — 납작해진다'),
                   (hi, 'a = 14 이면 14 = 5 + 9 — 납작해진다')):
        s.append('<circle cx="%.1f" cy="%.1f" r="4.6" fill="#fff" stroke="%s" '
                 'stroke-width="2"/>' % (px(v), GY, RED))
        s.append(txt(px(v), GY + 50, why, 8.8, RED, 'middle', 700))
    s.append(txt(px(9), GY - 46, '4 < a < 14', 13, TEAL, 'middle', 800))
    s.append(rect(34, 218, 632, 38, '#FBFCFE', LINE, 1, 7))
    s.append(txt(350, 236, '|9 − 5| < a < 9 + 5   —   두 변의 «차» 와 «합» 사이', 12,
                 NAVY, 'middle', 800))
    s.append(txt(350, 251, '어느 변이 가장 긴지 미리 알 수 없으므로 두 쪽을 다 따진다',
                 9, GRAY, 'middle', 700))
    s.append('</svg>')
    return ''.join(s)


@fig('ch10_donkey', '에피쿠로스 학파가 들었다는 예입니다. 당나귀는 먹이까지 **곧장** '
     '갑니다. 세 변이 300·400·500 인 자리에서, 두 변을 돌아가면 700 이고 곧장 가면 500 — '
     '200 만큼 덜 걷습니다. 당나귀가 아는 것은 **그 한 경우**이고, 유클리드가 보인 것은 '
     '**모든 삼각형에서 늘 그렇다**는 것입니다.')
def ch10_donkey():
    W, H = 700, 300
    a, b, c = 300.0, 400.0, 500.0           # 직각삼각형 — 곧장 500, 돌아서 700
    assert a + b - c == 200.0
    assert round(a * a + b * b) == round(c * c)
    sc = 0.46
    ox, oy = 110.0, 210.0
    A = (ox, oy)                            # 당나귀
    B = (ox + b * sc, oy)                   # 모퉁이
    C = (ox + b * sc, oy - a * sc)          # 먹이
    s = [head(W, H)]
    s.append(txt(20, 24, '당나귀는 곧장 간다 — 두 변을 돌아가지 않는다', 12.5, NAVY,
                 'start', 800))
    s.append(line(A[0], A[1], B[0], B[1], GRAY, 2, '5 4'))
    s.append(line(B[0], B[1], C[0], C[1], GRAY, 2, '5 4'))
    s.append(line(A[0], A[1], C[0], C[1], TEAL, 3))
    s.append(txt((A[0] + B[0]) / 2, oy + 20, '400', 10, GRAY, 'middle', 700))
    s.append(txt(B[0] + 16, (B[1] + C[1]) / 2, '300', 10, GRAY, 'middle', 700))
    s.append(txt((A[0] + C[0]) / 2 - 14, (A[1] + C[1]) / 2 - 10, '500', 11.4, TEAL,
                 'middle', 800))
    s.append('<circle cx="%.1f" cy="%.1f" r="4.4" fill="%s"/>' % (A[0], A[1], NAVY))
    s.append(txt(A[0], oy + 20, '당나귀', 9.2, NAVY, 'middle', 800))
    s.append('<circle cx="%.1f" cy="%.1f" r="4.4" fill="%s"/>' % (C[0], C[1], AMBER))
    s.append(txt(C[0] + 10, C[1] - 6, '먹이', 9.2, AMBER, 'start', 800))
    bx = 446
    s.append(rect(bx - 16, 68, 236, 150, '#FBFCFE', LINE, 1, 7))
    rows = [('돌아가면', '400 + 300', '= 700', GRAY),
            ('곧장 가면', '', '= 500', TEAL),
            ('아낀 거리', '700 − 500', '= 200', AMBER)]
    for i, (what, how, ans, col) in enumerate(rows):
        y = 100 + i * 44
        s.append(txt(bx, y, what, 10.2, col, 'start', 800))
        if how:
            s.append(txt(bx, y + 17, how, 9.2, GRAY, 'start'))
        s.append(txt(bx + 212, y + 6, ans, 12.4, col, 'end', 800))
        if i < 2:
            s.append(line(bx - 6, y + 30, bx + 216, y + 30, LINE, 0.9))
    s.append(rect(34, 250, 632, 38, '#FBFCFE', LINE, 1, 7))
    s.append(txt(350, 268, '한 경우를 아는 것과, 모든 경우에 그렇다고 «보이는» 것은 다른 '
                           '일이다', 11.6, NAVY, 'middle', 800))
    s.append(txt(350, 282, '프로클로스의 답 — 「감각에는 뻔해도, 학문을 만드는 추론에는 '
                           '아니다」', 9, GRAY, 'middle', 700))
    s.append('</svg>')
    return ''.join(s)


@fig('ch11_ssa', '∠A = 30°, AB = 100, BC = 60 — 값은 셋 다 정해졌는데 삼각형이 **두 개** '
     '그려집니다. B 에서 반직선까지의 거리가 100 × sin 30° = 50 이고, 60 은 그보다 크고 '
     '100 보다 작기 때문입니다. 두 교점까지의 거리는 86.6 ∓ 33.2 로 계산되어 '
     'AC 가 53.4 인 것과 119.8 인 것이 함께 나옵니다. **같은 값인데 다른 모양** — '
     'SSA 가 합동 조건이 되지 못하는 까닭입니다.')
def ch11_ssa():
    W, H = 700, 340
    A, c, a = 30.0, 100.0, 60.0
    h = c * math.sin(math.radians(A))
    foot = c * math.cos(math.radians(A))
    half = math.sqrt(a * a - h * h)
    b1, b2 = foot - half, foot + half
    assert round(h, 1) == 50.0
    assert h < a < c                               # 두 점에서 만나는 조건
    assert round(foot, 1) == 86.6 and round(half, 1) == 33.2
    assert round(b1, 1) == 53.4 and round(b2, 1) == 119.8
    s = [head(W, H)]
    s.append(txt(20, 24, '같은 값으로 삼각형이 둘 — SSA 가 조건이 아닌 까닭', 12.5, NAVY,
                 'start', 800))
    sc = 2.3
    ax, ay = 70.0, 262.0
    def on_ray(t):
        r = math.radians(A)
        return ax + t * sc * math.cos(r), ay - t * sc * math.sin(r)
    B = (ax + c * sc, ay)
    C1, C2 = on_ray(b1), on_ray(b2)
    F = on_ray(foot)
    s.append(line(ax, ay, B[0], B[1], NAVY, 2.4))              # AB
    s.append(line(ax, ay, on_ray(140)[0], on_ray(140)[1], GRAY, 1.4, '5 4'))
    # 원 전체를 그리면 그림 밖으로 나간다 — 두 교점을 품는 «윗부분 호» 만 그린다
    _r = a * sc
    _p = [(B[0] + _r * math.cos(math.radians(t)), B[1] - _r * math.sin(math.radians(t)))
          for t in (70.0, 170.0)]
    s.append('<path d="M %.1f %.1f A %.1f %.1f 0 0 0 %.1f %.1f" fill="none" '
             'stroke="%s" stroke-width="1.4" stroke-dasharray="3 3"/>'
             % (_p[0][0], _p[0][1], _r, _r, _p[1][0], _p[1][1], AMBER))
    s.append(line(B[0], B[1], F[0], F[1], LINE, 1, '2 3'))
    for C, col, nm in ((C1, SKY, '①'), (C2, TEAL, '②')):
        s.append(line(ax, ay, C[0], C[1], col, 2.6))
        s.append(line(B[0], B[1], C[0], C[1], col, 2.6))
        s.append('<circle cx="%.1f" cy="%.1f" r="3.6" fill="#fff" stroke="%s" '
                 'stroke-width="2"/>' % (C[0], C[1], col))
        s.append(txt(C[0] - 4, C[1] - 10, nm, 10, col, 'end', 800))
    s.append(txt(ax - 6, ay + 6, 'A', 11, NAVY, 'end', 800))
    s.append(txt(B[0] + 8, ay + 6, 'B', 11, NAVY, 'start', 800))
    s.append(txt((ax + B[0]) / 2, ay + 20, 'AB = 100', 9.4, NAVY, 'middle', 700))
    s.append(txt(ax + 30, ay - 10, '30°', 9.4, GRAY, 'middle', 700))
    s.append(txt(90, 128, '주황 호 — B 에서 60 만큼 떨어진 자리', 9, AMBER, 'start', 700))
    bx = 452
    s.append(rect(bx - 16, 56, 232, 178, '#FBFCFE', LINE, 1, 7))
    rows = [('B 에서 반직선까지', '100 × sin 30°', '= 50', GRAY),
            ('A 에서 수선의 발까지', '100 × cos 30°', '≒ 86.6', GRAY),
            ('그 양옆으로', '√(60² − 50²)', '≒ 33.2', GRAY),
            ('① AC', '86.6 − 33.2', '≒ 53.4', SKY),
            ('② AC', '86.6 + 33.2', '≒ 119.8', TEAL)]
    for i, (what, how, ans, col) in enumerate(rows):
        y = 80 + i * 32
        s.append(txt(bx, y, what, 9.4, col, 'start', 800))
        s.append(txt(bx + 104, y, how, 8.8, GRAY, 'start'))
        s.append(txt(bx + 212, y, ans, 10.4, col, 'end', 800))
    s.append(rect(34, 292, 632, 34, '#FFF6F5', '#E6C4C0', 1, 7))
    s.append(txt(350, 314, '세 값(100 · 60 · 30°)이 같은데 모양이 둘 — 반례가 하나만 '
                           '있어도 「조건」이 되지 못한다', 11.4, RED, 'middle', 800))
    s.append('</svg>')
    return ''.join(s)


@fig('ch11_table', '네 가지를 나란히 놓고 「그 값으로 삼각형이 몇 개 그려지는가」만 셉니다. '
     '하나면 조건이고, 둘이면 조건이 아닙니다. 이름을 외우는 것보다 **개수를 세는 것**이 '
     '먼저입니다. AA(두 각만)는 크기가 정해지지 않아 무수히 많습니다 — 닮음일 뿐 합동이 '
     '아닙니다.')
def ch11_table():
    W, H = 700, 300
    rows = [('SSS', '세 변', '1 개', True, '두 호가 만나는 점이 하나로 굳는다'),
            ('SAS', '두 변과 그 끼인각', '1 개', True, '각이 두 변 사이에 끼어 있다'),
            ('ASA', '한 변과 그 양 끝 각', '1 개', True, '두 반직선이 한 점에서 만난다'),
            ('SSA', '두 변과 끼이지 «않은» 각', '2 개', False, '원과 반직선이 두 점에서 만난다'),
            ('AA', '두 각만', '무수히', False, '크기가 정해지지 않는다 — 닮음')]
    assert sum(1 for r in rows if r[3]) == 3
    s = [head(W, H)]
    s.append(txt(20, 24, '몇 개가 그려지는가 — 그것만 세면 된다', 12.5, NAVY, 'start', 800))
    heads = ['', '무엇을 아는가', '그려지는 삼각형', '합동 조건인가', '까닭']
    xs = [56, 150, 320, 430, 520]
    for x, hd in zip(xs, heads):
        s.append(txt(x, 60, hd, 9.2, GRAY, 'start', 800))
    s.append(line(34, 68, 666, 68, LINE, 1.2))
    for i, (nm, know, cnt, ok, why) in enumerate(rows):
        y = 94 + i * 38
        col = TEAL if ok else RED
        s.append(rect(34, y - 18, 632, 32, '#F6FBF9' if ok else '#FFF6F5'))
        s.append(txt(xs[0], y, nm, 11.6, col, 'start', 800))
        s.append(txt(xs[1], y, know, 9.6, NAVY, 'start'))
        s.append(txt(xs[2], y, cnt, 10.4, col, 'start', 800))
        s.append(txt(xs[3], y, '○ 조건' if ok else '✕ 아니다', 9.8, col, 'start', 800))
        s.append(txt(xs[4], y, why, 8.6, GRAY, 'start'))
    s.append(txt(20, 284, '「조건이 된다」는 말은 «그 값들로 모양이 하나로 정해진다» 는 '
                          '뜻입니다. 두 개가 나오면 정해진 것이 아닙니다.', 9.6, NAVY,
                 'start', 700))
    s.append('</svg>')
    return ''.join(s)


@fig('ch11_fermat', '페르마는 2^(2ⁿ)+1 꼴의 수가 모두 소수일 것이라 여겼습니다. 다섯 개까지는 '
     '맞았습니다. 1732년 오일러가 **여섯 번째**를 깼습니다 — 4294967297 = 641 × 6700417. '
     '오일러는 아무 수나 나눠 보지 않았습니다. 「F₅ 의 소인수는 반드시 64k + 1 꼴」임을 '
     '먼저 증명해, 후보를 193 · 257 · 449 · 577 · 641 다섯 개로 줄였습니다. '
     '**다섯 번째 후보가 답이었습니다.**')
def ch11_fermat():
    W, H = 700, 330
    F = [2 ** (2 ** n) + 1 for n in range(6)]
    assert F == [3, 5, 17, 257, 65537, 4294967297]
    assert 641 * 6700417 == F[5]

    def is_p(m):
        if m < 2:
            return False
        for d in range(2, int(m ** 0.5) + 1):
            if m % d == 0:
                return False
        return True
    cands = [64 * k + 1 for k in range(1, 11) if is_p(64 * k + 1)]
    assert cands == [193, 257, 449, 577, 641]
    assert all(is_p(x) for x in F[:5])        # 앞의 다섯은 정말 소수다
    assert F[5] % 641 == 0 and F[5] // 641 == 6700417
    s = [head(W, H)]
    s.append(txt(20, 24, '다섯 번 맞았다고 여섯 번째도 맞는 것은 아니다', 12.5, NAVY,
                 'start', 800))
    for n, v in enumerate(F):
        y = 64 + n * 30
        ok = n < 5
        col = TEAL if ok else RED
        s.append(rect(34, y - 17, 420, 26, '#F6FBF9' if ok else '#FFF6F5'))
        s.append(txt(52, y, 'F%d' % n, 10.4, col, 'start', 800))
        s.append(txt(96, y, '= 2^%d + 1' % (2 ** n), 9.2, GRAY, 'start'))
        s.append(txt(300, y, '{:,}'.format(v), 10.4, NAVY, 'end', 700))
        s.append(txt(318, y, '소수' if ok else '소수가 아니다', 9.6, col, 'start', 800))
    s.append(txt(52, 248, '4,294,967,297 = 641 × 6,700,417', 13, RED, 'start', 800))
    s.append(txt(52, 266, '1732년 오일러 — 추측이 깨지는 데 필요한 것은 반례 «하나»',
                 9.4, GRAY, 'start', 700))
    bx = 476
    s.append(rect(bx - 16, 56, 206, 170, '#FBFCFE', LINE, 1, 7))
    s.append(txt(bx, 80, '오일러가 줄인 후보', 10.2, NAVY, 'start', 800))
    s.append(txt(bx, 98, 'F₅ 의 소인수는 64k + 1 꼴', 8.8, GRAY, 'start'))
    for i, v in enumerate(cands):
        y = 124 + i * 20
        last = (v == 641)
        s.append(txt(bx + 16, y, '%d' % v, 10.2, RED if last else GRAY, 'start',
                     800 if last else 400))
        if last:
            s.append(txt(bx + 70, y, '← 나눠떨어진다', 9, RED, 'start', 800))
    s.append(txt(bx, 240, '다섯 번만 나눠 보면 됐다', 9, GRAY, 'start', 700))
    s.append(rect(34, 286, 632, 32, '#FBFCFE', LINE, 1, 7))
    s.append(txt(350, 306, '「지금까지 다 맞았다」는 증명이 아니다 — 반례 하나면 끝난다',
                 11.6, NAVY, 'middle', 800))
    s.append('</svg>')
    return ''.join(s)


def _poly(pts, fill, stroke=NAVY, sw=1.6):
    return ('<polygon points="%s" fill="%s" stroke="%s" stroke-width="%s" '
            'stroke-linejoin="round"/>'
            % (' '.join('%.2f,%.2f' % p for p in pts), fill, stroke, sw))


@fig('ch12_table', '정n각형의 한 내각을 n = 3 부터 12 까지 계산한 것입니다. 한 점을 빈틈없이 '
     '메우려면 같은 각이 몇 개 모여 꼭 360° 가 되어야 하므로, **360 ÷ (한 내각)** 이 '
     '정수여야 합니다. 정수가 되는 것은 **정삼각형 · 정사각형 · 정육각형 셋뿐**입니다. '
     'n 이 7 보다 커지면 한 내각이 120° 를 넘어 세 개도 붙일 수 없습니다.')
def ch12_table():
    W, H = 700, 356
    rows = []
    for n in range(3, 13):
        tot = 180 * (n - 2)
        one = tot / n
        q = 360.0 / one
        ok = abs(q - round(q)) < 1e-9
        rows.append((n, tot, one, q, ok))
    assert [r[0] for r in rows if r[4]] == [3, 4, 6]
    assert rows[0][2] == 60 and rows[1][2] == 90 and rows[3][2] == 120
    assert abs(rows[2][2] - 108) < 1e-9 and abs(rows[2][3] - 10.0 / 3) < 1e-9
    s = [head(W, H)]
    s.append(txt(20, 24, '한 종류로 바닥을 채울 수 있는 정다각형은 셋뿐이다', 12.5, NAVY,
                 'start', 800))
    xs = [66, 170, 300, 430, 566]
    heads = ['n', '내각의 합', '한 내각', '360 ÷ 한 내각', '한 종류로 채우기']
    for x, hd in zip(xs, heads):
        s.append(txt(x, 60, hd, 9.2, GRAY, 'middle', 800))
    s.append(line(34, 68, 666, 68, LINE, 1.2))
    for i, (n, tot, one, q, ok) in enumerate(rows):
        y = 92 + i * 25
        col = TEAL if ok else GRAY
        if ok:
            s.append(rect(34, y - 17, 632, 23, '#F0F7F4'))
        s.append(txt(xs[0], y, str(n), 10.2, NAVY if ok else GRAY, 'middle',
                     800 if ok else 400))
        s.append(txt(xs[1], y, '%d°' % tot, 9.6, GRAY, 'middle'))
        s.append(txt(xs[2], y, ('%g°' % one) if one == int(one) else '%.1f°' % one,
                     10, NAVY if ok else GRAY, 'middle', 700 if ok else 400))
        s.append(txt(xs[3], y, ('%g' % q) if ok else '%.2f…' % q, 10, col, 'middle',
                     800 if ok else 400))
        s.append(txt(xs[4], y, '○ 된다' if ok else '✕', 9.6, col, 'middle',
                     800 if ok else 400))
    s.append(txt(20, 344, '정오각형의 한 내각은 108° 입니다. 360 ÷ 108 = 3.33… — 세 개를 '
                          '붙이면 324° 로 36° 가 남고, 네 개는 432° 로 넘칩니다.', 9.4,
                 GRAY, 'start'))
    s.append('</svg>')
    return ''.join(s)


@fig('ch12_gap', '같은 정다각형을 한 점에 모아 본 것입니다. 정육각형은 세 개가 꼭 360° 를 '
     '메우고(120 × 3), 정오각형은 세 개가 324° 밖에 되지 않아 **36° 가 남습니다.** '
     '네 개를 넣으면 432° 로 넘쳐 겹칩니다. 빈틈도 겹침도 허락되지 않으므로 정오각형으로는 '
     '바닥을 채울 수 없습니다.')
def ch12_gap():
    W, H = 700, 320
    assert 120 * 3 == 360 and 108 * 3 == 324 and 360 - 324 == 36

    def reg(n, cx, cy, r, start):
        """꼭짓점 하나가 (cx,cy) 에 오도록 정n각형을 놓는다."""
        ia = 180.0 * (n - 2) / n
        pts = []
        ang = start
        x, y = cx, cy
        pts.append((x, y))
        for k in range(n - 1):
            x += r * math.cos(math.radians(ang))
            y -= r * math.sin(math.radians(ang))
            pts.append((x, y))
            ang -= 180.0 - ia
        return pts
    s = [head(W, H)]
    s.append(txt(20, 24, '한 점에 모아 보면 — 360° 가 되는가', 12.5, NAVY, 'start', 800))
    panels = [(6, 180.0, 120.0, TEAL, '정육각형 120° × 3 = 360°', '빈틈이 없다'),
              (5, 480.0, 108.0, AMBER, '정오각형 108° × 3 = 324°', '36° 가 남는다')]
    for n, cx, ia, col, lab, say in panels:
        cy, r = 196.0, 62.0
        for k in range(3):
            st = 90.0 + k * ia
            s.append(_poly(reg(n, cx, cy, r, st), '#EAF4F1' if n == 6 else '#FDF4E3',
                           col, 1.6))
        s.append('<circle cx="%.1f" cy="%.1f" r="3.2" fill="%s"/>' % (cx, cy, NAVY))
        s.append(txt(cx, 268, lab, 11, col, 'middle', 800))
        s.append(txt(cx, 286, say, 9.4, GRAY, 'middle'))
        if n == 5:
            # 남는 36° 를 부채꼴로 칠한다
            a0 = 90.0 + 3 * ia
            a1 = 90.0 + 360.0
            p0 = (cx + 44 * math.cos(math.radians(a0)), cy - 44 * math.sin(math.radians(a0)))
            p1 = (cx + 44 * math.cos(math.radians(a1)), cy - 44 * math.sin(math.radians(a1)))
            s.append('<path d="M %.1f %.1f L %.1f %.1f A 44 44 0 0 0 %.1f %.1f Z" '
                     'fill="#FBDADA" stroke="%s" stroke-width="1.2"/>'
                     % (cx, cy, p0[0], p0[1], p1[0], p1[1], RED))
            mid = math.radians((a0 + a1) / 2.0)
            s.append(txt(cx + 62 * math.cos(mid), cy - 62 * math.sin(mid) + 4,
                         '36°', 11, RED, 'middle', 800))
    s.append(txt(20, 308, '한 점에서 각이 모자라면 빈틈이 생기고, 넘치면 겹칩니다. '
                          '«꼭» 360° 여야 합니다.', 9.4, GRAY, 'start'))
    s.append('</svg>')
    return ''.join(s)


@fig('ch12_hexsplit', '**정오각형**은 바닥을 못 채우지만, **오각형**은 채웁니다. '
     '정육각형을 가운데 점에서 세 조각으로 가르면 합동인 오각형 셋이 나옵니다 — '
     '변의 길이가 0.87 · 0.5 · 1 · 0.5 · 0.87 로 세 조각이 모두 같습니다. '
     '정육각형이 바닥을 채우므로 이 오각형도 채웁니다. 「정다각형이 아니면 된다」는 것이 '
     '이 장의 반전입니다.')
def ch12_hexsplit():
    W, H = 700, 330
    R = 1.0
    V = [(math.cos(math.radians(60 * k)), math.sin(math.radians(60 * k)))
         for k in range(6)]

    def mid(a, b):
        return ((a[0] + b[0]) / 2.0, (a[1] + b[1]) / 2.0)
    M = [mid(V[0], V[1]), mid(V[2], V[3]), mid(V[4], V[5])]
    O = (0.0, 0.0)
    pents = [[O, M[0], V[1], V[2], M[1]],
             [O, M[1], V[3], V[4], M[2]],
             [O, M[2], V[5], V[0], M[0]]]

    def sides(p):
        return [round(math.hypot(p[(i + 1) % 5][0] - p[i][0],
                                 p[(i + 1) % 5][1] - p[i][1]), 4) for i in range(5)]
    base = sides(pents[0])
    assert base == [0.866, 0.5, 1.0, 0.5, 0.866], base
    assert all(sides(p) == base for p in pents)
    s = [head(W, H)]
    s.append(txt(20, 24, '정오각형은 못 채워도, 오각형은 채운다', 12.5, NAVY, 'start', 800))
    cols = [SKY, TEAL, AMBER]
    fills = ['#E8F0FA', '#EAF4F1', '#FDF4E3']
    # ① 한 육각형을 셋으로
    cx, cy, sc = 160.0, 180.0, 96.0

    def P(p):
        return (cx + p[0] * sc, cy - p[1] * sc)
    for i, pent in enumerate(pents):
        s.append(_poly([P(p) for p in pent], fills[i], cols[i], 1.8))
    s.append('<circle cx="%.1f" cy="%.1f" r="3" fill="%s"/>' % (cx, cy, NAVY))
    s.append(txt(cx, 300, '정육각형 하나 = 합동인 오각형 셋', 10, NAVY, 'middle', 800))
    s.append(txt(cx, 316, '변 0.87 · 0.5 · 1 · 0.5 · 0.87 (셋 다 같다)', 8.8, GRAY,
                 'middle'))
    # ② 그 육각형을 늘어놓으면 바닥이 채워진다
    bx, by, bs = 470.0, 174.0, 46.0
    s.append(txt(bx, 54, '그 육각형을 늘어놓으면 — 바닥이 채워진다', 10, GRAY, 'middle', 800))
    for (ux, uy) in ((0, 0), (1, 0), (-1, 0), (0.5, 1), (-0.5, 1), (0.5, -1), (-0.5, -1)):
        hx = bx + ux * (math.sqrt(3) * bs)
        hy = by - uy * (1.5 * bs)

        def Q(p, hx=hx, hy=hy):
            return (hx + p[0] * bs, hy - p[1] * bs)
        for i, pent in enumerate(pents):
            s.append(_poly([Q(p) for p in pent], fills[i], cols[i], 0.9))
    s.append(txt(bx, 300, '같은 오각형 하나로 평면이 덮인다', 10, NAVY, 'middle', 800))
    s.append(txt(bx, 316, '정다각형이 아니어도 된다 — 조건은 «한 점에서 360°» 뿐이다',
                 8.8, GRAY, 'middle'))
    s.append('</svg>')
    return ''.join(s)


@fig('ch12_count', '바닥을 채우는 «볼록 오각형» 이 몇 종류인지는 100년 동안 늘어 왔습니다. '
     '1918년 라인하르트가 다섯을 찾은 뒤, 1968년 커슈너가 셋을 더하며 「이것이 전부」라 했고, '
     '1975년 가드너의 칼럼을 읽은 **아마추어들**이 다섯을 더 찾아냈습니다. 열다섯 번째는 '
     '**2015년**에 나왔고, 2017년 라오가 「열다섯이 전부」라는 컴퓨터 증명을 내놓았습니다.')
def ch12_count():
    W, H = 700, 330
    pts = [(1918, 5, '라인하르트', '박사 논문 — 다섯 가지'),
           (1968, 8, '커슈너', '셋을 더하고 「전부」라 함'),
           (1975, 9, '제임스', '가드너의 칼럼을 읽은 독자'),
           (1977, 13, '라이스', '주부 — 혼자 넷을 찾음'),
           (1985, 14, '슈타인', '대학원생'),
           (2015, 15, '맨과 동료들', '컴퓨터로 탐색'),
           (2017, 15, '라오', '「열다섯이 전부」 증명')]
    assert [p[1] for p in pts] == [5, 8, 9, 13, 14, 15, 15]
    GX, GY, GW, GH = 72, 246, 572, 172
    X0, X1, YMAX = 1910, 2025, 16
    s = [head(W, H)]
    s.append(txt(20, 24, '알려진 종류의 수 — 100년 동안 늘어났다', 12.5, NAVY, 'start', 800))

    def px(t):
        return GX + GW * (t - X0) / float(X1 - X0)

    def py(v):
        return GY - GH * v / float(YMAX)
    for v in (0, 5, 10, 15):
        s.append(line(GX, py(v), GX + GW, py(v), LINE, 0.9))
        s.append(txt(GX - 8, py(v) + 3.4, str(v), 8.8, GRAY, 'end'))
    for t in (1920, 1940, 1960, 1980, 2000, 2020):
        s.append(txt(px(t), GY + 17, str(t), 8.8, GRAY, 'middle'))
    s.append(line(GX, GY, GX + GW, GY, GRAY, 1.3))
    # 계단
    path = []
    prev = None
    for t, v, nm, why in pts:
        if prev is not None:
            path.append((px(t), py(prev)))
        path.append((px(t), py(v)))
        prev = v
    path.append((px(X1 - 2), py(prev)))
    s.append('<polyline fill="none" stroke="%s" stroke-width="2.6" points="%s"/>'
             % (BLUE, ' '.join('%.1f,%.1f' % p for p in path)))
    # 1975·1977 과 2015·2017 은 2 년 차이라 점이 붙는다.
    # 위아래로만 엇갈려서는 설명이 서로 포개지므로 좌우로도 비켜 세운다.
    # (dx, 위로 올릴지, 이름까지의 거리) — 수를 바꾸면 check_fig.py 가 다시 센다
    place = [(0, True, 14), (0, False, 20), (-24, True, 14), (34, False, 28),
             (0, True, 14), (-46, False, 20), (34, False, 20)]
    for i, (t, v, nm, why) in enumerate(pts):
        dx, up, gap = place[i]
        s.append('<circle cx="%.1f" cy="%.1f" r="3.6" fill="#fff" stroke="%s" '
                 'stroke-width="2"/>' % (px(t), py(v), AMBER if '라이스' in nm else BLUE))
        dy = -gap if up else gap
        s.append(txt(px(t) + dx, py(v) + dy, '%d · %s' % (t, nm), 8.8,
                     AMBER if '라이스' in nm else NAVY, 'middle', 800))
        s.append(txt(px(t) + dx, py(v) + dy + (-12 if up else 12), why, 8,
                     GRAY, 'middle'))
    s.append(txt(GX + GW, py(15) - 12, '15 종', 13, BLUE, 'end', 800))
    s.append(rect(34, 278, 632, 40, '#FBFCFE', LINE, 1, 7))
    s.append(txt(350, 296, '「이것이 전부」라는 말이 두 번 나왔고, 두 번 다 아니었다',
                 11.6, NAVY, 'middle', 800))
    s.append(txt(350, 311, '세 번째 「전부」(2017)는 컴퓨터 증명이며 아직 정식 심사를 '
                           '거치지 않았다', 9, GRAY, 'middle', 700))
    s.append('</svg>')
    return ''.join(s)


def _sector(cx, cy, r, a0, a1, fill, stroke='#fff', sw=1.2):
    """중심 (cx,cy)·반지름 r 인 부채꼴. 각은 도, 12시에서 시계 방향."""
    def pt(a):
        t = math.radians(a - 90.0)
        return cx + r * math.cos(t), cy + r * math.sin(t)
    p0, p1 = pt(a0), pt(a1)
    big = 1 if (a1 - a0) % 360 > 180 else 0
    return ('<path d="M %.2f %.2f L %.2f %.2f A %.2f %.2f 0 %d 1 %.2f %.2f Z" '
            'fill="%s" stroke="%s" stroke-width="%s"/>'
            % (cx, cy, p0[0], p0[1], r, r, big, p1[0], p1[1], fill, stroke, sw))


@fig('ch13_pie', '25 명에게 물은 결과를 원그래프로 옮긴 것입니다. 비율에 **360 을 곱하면** '
     '중심각이 나옵니다 — 32 % 는 115.2° 입니다. 네 중심각을 더하면 꼭 360° 가 되고, '
     '호의 길이와 넓이도 **같은 비율**입니다. 원그래프가 성립하는 근거가 이 한 줄입니다.')
def ch13_pie():
    W, H = 700, 330
    data = [('걸어서', 8, SKY), ('버스로', 7, TEAL), ('자전거로', 6, AMBER),
            ('그 밖에', 4, GRAY)]
    tot = sum(d[1] for d in data)
    assert tot == 25
    rows = [(nm, n, n / tot * 100.0, 360.0 * n / tot, c) for nm, n, c in data]
    assert round(rows[0][2], 1) == 32.0 and round(rows[0][3], 1) == 115.2
    assert round(sum(r[3] for r in rows), 6) == 360.0
    s = [head(W, H)]
    s.append(txt(20, 24, '비율 × 360 = 중심각', 12.5, NAVY, 'start', 800))
    cx, cy, r = 160.0, 180.0, 96.0
    a = 0.0
    for nm, n, pct, ang, col in rows:
        s.append(_sector(cx, cy, r, a, a + ang, col))
        mid = math.radians(a + ang / 2 - 90.0)
        s.append(txt(cx + (r * 0.62) * math.cos(mid),
                     cy + (r * 0.62) * math.sin(mid) + 4,
                     '%.0f%%' % pct, 11, '#fff', 'middle', 800))
        a += ang
    s.append(txt(cx, 300, '전체 25 명', 9.6, GRAY, 'middle', 700))
    # ── 표
    tx, ty = 326, 72
    cols = ['', '사람', '비율', '중심각']
    for j, c in enumerate(cols):
        s.append(txt(tx + 24 + j * 86, ty, c, 9.2, GRAY, 'middle', 800))
    s.append(line(tx - 16, ty + 8, tx + 330, ty + 8, LINE, 1))
    for i, (nm, n, pct, ang, col) in enumerate(rows):
        y = ty + 34 + i * 30
        s.append('<rect x="%.1f" y="%.1f" width="9" height="9" fill="%s" rx="2"/>'
                 % (tx - 6, y - 8, col))
        s.append(txt(tx + 24, y, nm, 9.8, NAVY, 'middle'))
        s.append(txt(tx + 110, y, '%d' % n, 9.8, GRAY, 'middle'))
        s.append(txt(tx + 196, y, '%.0f %%' % pct, 9.8, NAVY, 'middle', 700))
        s.append(txt(tx + 282, y, '%.1f°' % ang, 10.4, col, 'middle', 800))
    s.append(line(tx - 16, ty + 148, tx + 330, ty + 148, LINE, 1))
    s.append(txt(tx + 24, ty + 168, '합계', 9.8, NAVY, 'middle', 800))
    s.append(txt(tx + 110, ty + 168, '25', 9.8, GRAY, 'middle', 700))
    s.append(txt(tx + 196, ty + 168, '100 %', 9.8, NAVY, 'middle', 800))
    s.append(txt(tx + 282, ty + 168, '360.0°', 10.4, NAVY, 'middle', 800))
    s.append(rect(310, 266, 356, 44, '#FBFCFE', LINE, 1, 7))
    s.append(txt(488, 286, '32 % → 360 × 0.32 = 115.2°', 12.4, SKY, 'middle', 800))
    s.append(txt(488, 302, '호의 길이도 넓이도 같은 32 % — 반지름은 크기만 바꾼다',
                 8.8, GRAY, 'middle', 700))
    s.append('</svg>')
    return ''.join(s)


@fig('ch13_radius', '반지름을 2 배로 하면 넓이는 **4 배**가 됩니다. 넓이가 반지름의 '
     '**제곱**에 비례하기 때문입니다. 그래서 값을 반지름으로 나타내면 눈에는 '
     '«값의 제곱» 으로 보입니다 — 2 배 차이가 4 배로, 3 배 차이가 9 배로 부풀어 보입니다.')
def ch13_radius():
    W, H = 700, 300
    rs = [1, 2, 3]
    assert [r * r for r in rs] == [1, 4, 9]
    s = [head(W, H)]
    s.append(txt(20, 24, '반지름 2 배 → 넓이 4 배', 12.5, NAVY, 'start', 800))
    unit, gap, cy = 26.0, 20.0, 146.0
    cx = 36.0
    for r in rs:
        R = r * unit
        cx += R
        s.append('<circle cx="%.1f" cy="%.1f" r="%.1f" fill="%s" opacity="0.24"/>'
                 % (cx, cy, R, SKY))
        s.append('<circle cx="%.1f" cy="%.1f" r="%.1f" fill="none" stroke="%s" '
                 'stroke-width="1.8"/>' % (cx, cy, R, BLUE))
        s.append(line(cx, cy, cx + R, cy, NAVY, 1.1, '3 3'))
        s.append(txt(cx + R / 2, cy - 5, '%d' % r, 9.2, NAVY, 'middle', 800))
        s.append(txt(cx, cy + R + 18, '반지름 %d' % r, 9.2, NAVY, 'middle', 700))
        s.append(txt(cx, cy + R + 34, '넓이 %d' % (r * r), 10.6, BLUE, 'middle', 800))
        cx += R + gap
    bx = 448
    s.append(rect(bx - 20, 56, 238, 156, '#FBFCFE', LINE, 1, 7))
    s.append(txt(bx, 84, '넓이 = π r²', 12.6, NAVY, 'start', 800))
    for i, (a, b) in enumerate((('반지름 1 배', '넓이 1 배'),
                                ('반지름 2 배', '넓이 4 배'),
                                ('반지름 3 배', '넓이 9 배'))):
        y = 116 + i * 28
        s.append(txt(bx, y, a, 9.8, GRAY, 'start'))
        s.append(txt(bx + 208, y, b, 10.4, BLUE, 'end', 800))
    s.append(txt(bx, 202, '눈은 넓이로 본다 — 그래서 부풀어 보인다', 8.8, RED,
                 'start', 700))
    s.append(txt(20, 268, '값을 반지름에 실으면 차이가 과장되고, 넓이에 실으면 '
                          '본 대로 읽힙니다.', 9.4, GRAY, 'start'))
    s.append(txt(20, 284, '같은 자료라도 «무엇에 실었는가» 가 그림의 뜻을 바꿉니다.',
                 9.4, GRAY, 'start'))
    s.append('</svg>')
    return ''.join(s)


@fig('ch13_rose', '열두 칸(한 달씩)에 같은 보기 자료를 올려 두 가지로 그린 것입니다. '
     '왼쪽은 값을 **반지름**에 실었고, 오른쪽은 **넓이**에 실었습니다(반지름을 √값에 비례시킴). '
     '가장 큰 달과 가장 작은 달의 값 차이는 6 배인데, 왼쪽 그림에서 눈에 들어오는 넓이 차이는 '
     '**36 배**입니다. 나이팅게일이 쓴 「쐐기 그림」이 왼쪽 꼴이고, 오늘날 이 점이 논쟁거리입니다. '
     '(값은 꼴을 보이려고 지어낸 보기 자료입니다)')
def ch13_rose():
    W, H = 700, 352
    vals = [12, 18, 30, 48, 60, 72, 66, 54, 36, 24, 18, 12]
    assert len(vals) == 12
    assert max(vals) / min(vals) == 6
    assert (max(vals) / min(vals)) ** 2 == 36
    s = [head(W, H)]
    s.append(txt(20, 24, '같은 자료, 두 가지로 그리기', 12.5, NAVY, 'start', 800))
    panels = [('값을 반지름에 실으면', lambda v: v / float(max(vals)), AMBER,
               '넓이 차이가 36 배로 보인다'),
              ('값을 넓이에 실으면', lambda v: math.sqrt(v / float(max(vals))), TEAL,
               '넓이 차이가 6 배 — 값 그대로다')]
    for i, (name, f, col, say) in enumerate(panels):
        cx, cy, R = 200.0 + i * 300.0, 190.0, 108.0
        s.append(txt(cx, 56, name, 10.6, col, 'middle', 800))
        for k in (0.5, 1.0):
            s.append('<circle cx="%.1f" cy="%.1f" r="%.1f" fill="none" stroke="%s" '
                     'stroke-width="0.9" stroke-dasharray="2 3"/>'
                     % (cx, cy, R * k, LINE))
        for m, v in enumerate(vals):
            a0 = m * 30.0
            s.append(_sector(cx, cy, R * f(v), a0, a0 + 30.0, col, '#fff', 1.0))
        s.append('<circle cx="%.1f" cy="%.1f" r="2.4" fill="%s"/>' % (cx, cy, NAVY))
        s.append(txt(cx, cy + R + 28, say, 9.4, col, 'middle', 800))
    s.append(rect(34, 300, 632, 40, '#FBFCFE', LINE, 1, 7))
    s.append(txt(350, 318, '가장 큰 달 72, 가장 작은 달 12 — 값으로는 6 배',
                 11.6, NAVY, 'middle', 800))
    s.append(txt(350, 333, '반지름에 실으면 눈에 보이는 넓이는 6² = 36 배가 된다',
                 9, GRAY, 'middle', 700))
    s.append('</svg>')
    return ''.join(s)


@fig('ch14_euler', '다면체 여섯 개의 꼭짓점·모서리·면을 세어 v − e + f 를 구한 것입니다. '
     '모양도 크기도 전혀 다른데 **값은 모두 2** 입니다. 면이 4 개든 32 개든 달라지지 않습니다 — '
     '오일러의 다면체 정리입니다.')
def ch14_euler():
    W, H = 700, 326
    rows = [('정사면체', 4, 6, 4), ('정육면체', 8, 12, 6), ('정팔면체', 6, 12, 8),
            ('정십이면체', 20, 30, 12), ('정이십면체', 12, 30, 20),
            ('깎은 정이십면체 (축구공)', 60, 90, 32)]
    for nm, v, e, f in rows:
        assert v - e + f == 2, nm
    s = [head(W, H)]
    s.append(txt(20, 24, 'v − e + f 는 언제나 2', 12.5, NAVY, 'start', 800))
    xs = [62, 320, 400, 480, 590]
    heads = ['', '꼭짓점 v', '모서리 e', '면 f', 'v − e + f']
    for x, hd in zip(xs, heads):
        s.append(txt(x, 62, hd, 9.2, GRAY, 'middle' if x > 100 else 'start', 800))
    s.append(line(34, 70, 666, 70, LINE, 1.2))
    for i, (nm, v, e, f) in enumerate(rows):
        y = 96 + i * 32
        last = (i == len(rows) - 1)
        if last:
            s.append(rect(34, y - 20, 632, 28, '#F0F7F4'))
        s.append(txt(xs[0], y, nm, 10.2, TEAL if last else NAVY, 'start',
                     800 if last else 400))
        for x, val in zip(xs[1:4], (v, e, f)):
            s.append(txt(x, y, str(val), 10, GRAY, 'middle'))
        s.append(txt(xs[4], y, '2', 12, TEAL, 'middle', 800))
    s.append(rect(34, 288, 632, 28, '#FBFCFE', LINE, 1, 6))
    s.append(txt(350, 307, '60 − 90 + 32 = 2  —  축구공도 예외가 아니다', 11.6, NAVY,
                 'middle', 800))
    s.append('</svg>')
    return ''.join(s)


@fig('ch14_why12', '축구공의 오각형이 **왜 꼭 12 개인지**를 세어 보는 것입니다. 꼭짓점마다 '
     '모서리가 셋이고 면이 오각형과 육각형뿐이라고만 두면, 오일러의 식에서 '
     '**오각형 수 = 12** 가 그냥 나옵니다. 육각형을 몇 개로 바꾸든 12 는 꿈쩍하지 않습니다 — '
     '육각형이 하나도 없는 정십이면체도, 20 개인 축구공도, 60 개인 더 큰 공도 모두 12 개입니다.')
def ch14_why12():
    W, H = 700, 352
    def count(p, h):
        f = p + h
        e2, v3 = 5 * p + 6 * h, 5 * p + 6 * h
        assert e2 % 2 == 0 and v3 % 3 == 0
        return v3 // 3, e2 // 2, f
    cases = [(0, '정십이면체'), (20, '축구공 (깎은 정이십면체)'), (30, 'C₈₀'), (60, 'C₁₄₀')]
    for h, nm in cases:
        v, e, f = count(12, h)
        assert v - e + f == 2, nm
    s = [head(W, H)]
    s.append(txt(20, 24, '오각형은 왜 꼭 12 개인가', 12.5, NAVY, 'start', 800))
    # ── 식 세우기
    s.append(txt(20, 54, '오각형 p 개 · 육각형 h 개 · 꼭짓점마다 모서리 셋이라 두면',
                 9.6, GRAY, 'start', 700))
    steps = [('면', 'f = p + h'),
             ('모서리', 'e = (5p + 6h) ÷ 2', '변을 두 면이 나눠 쓴다'),
             ('꼭짓점', 'v = (5p + 6h) ÷ 3', '꼭짓점마다 면 셋이 모인다')]
    for i, st in enumerate(steps):
        y = 84 + i * 26
        s.append(txt(44, y, st[0], 9.4, GRAY, 'start', 700))
        s.append(txt(110, y, st[1], 10.6, NAVY, 'start', 700))
        if len(st) > 2:
            s.append(txt(270, y, '— ' + st[2], 8.8, GRAY, 'start'))
    s.append(rect(34, 172, 632, 46, '#F0F7F4'))
    s.append(txt(350, 192, 'v − e + f = p ÷ 6 = 2   ⇒   p = 12', 14, TEAL,
                 'middle', 800))
    s.append(txt(350, 208, 'h 이 식에서 깨끗이 지워진다 — 육각형 수는 상관이 없다',
                 9, GRAY, 'middle', 700))
    # ── 표
    xs = [78, 250, 340, 420, 500, 600]
    heads = ['', '육각형 h', '오각형 p', '꼭짓점 v', '모서리 e', 'v − e + f']
    for x, hd in zip(xs, heads):
        s.append(txt(x, 248, hd, 8.8, GRAY, 'middle' if x > 100 else 'start', 800))
    s.append(line(34, 256, 666, 256, LINE, 1))
    for i, (h, nm) in enumerate(cases):
        v, e, f = count(12, h)
        y = 278 + i * 20
        s.append(txt(xs[0], y, nm, 9.2, NAVY, 'start'))
        s.append(txt(xs[1], y, str(h), 9.4, GRAY, 'middle'))
        s.append(txt(xs[2], y, '12', 10, TEAL, 'middle', 800))
        s.append(txt(xs[3], y, str(v), 9.4, GRAY, 'middle'))
        s.append(txt(xs[4], y, str(e), 9.4, GRAY, 'middle'))
        s.append(txt(xs[5], y, '2', 9.6, TEAL, 'middle', 800))
    s.append('</svg>')
    return ''.join(s)


@fig('ch14_cut', '정이십면체의 꼭짓점을 잘라 내면 축구공이 됩니다. 꼭짓점 **12 개**가 '
     '잘려 나가 그 자리에 **오각형 12 개**가 생기고, 원래의 삼각형 **20 개**는 모서리가 '
     '깎여 **육각형 20 개**가 됩니다. 「왜 하필 12 개인가」의 또 다른 답입니다 — '
     '정이십면체의 꼭짓점이 12 개이기 때문입니다.')
def ch14_cut():
    W, H = 700, 300
    before = (12, 30, 20)
    after = (60, 90, 32)
    assert before[0] - before[1] + before[2] == 2
    assert after[0] - after[1] + after[2] == 2
    assert after[2] == 12 + 20 and before[0] == 12
    assert after[0] == before[0] * 5                 # 꼭짓점 하나가 오각형 다섯 꼭짓점으로
    s = [head(W, H)]
    s.append(txt(20, 24, '정이십면체의 꼭짓점을 자르면 축구공이 된다', 12.5, NAVY,
                 'start', 800))
    boxes = [(70.0, '정이십면체', before, ['삼각형 20 개', '꼭짓점 12 개'], SKY),
             (420.0, '깎은 정이십면체', after, ['육각형 20 개', '오각형 12 개'], TEAL)]
    for bx, name, (v, e, f), lines, col in boxes:
        s.append(rect(bx - 16, 56, 212, 164, '#FBFCFE', LINE, 1, 7))
        s.append(txt(bx + 90, 82, name, 11.4, col, 'middle', 800))
        for i, l in enumerate(lines):
            s.append(txt(bx + 90, 108 + i * 20, l, 10, NAVY, 'middle', 700))
        s.append(line(bx - 6, 156, bx + 186, 156, LINE, 0.9))
        for i, (k, val) in enumerate((('v', v), ('e', e), ('f', f))):
            s.append(txt(bx + 24 + i * 66, 180, k, 8.8, GRAY, 'middle', 700))
            s.append(txt(bx + 24 + i * 66, 200, str(val), 11.4, col, 'middle', 800))
    s.append(txt(350, 120, '→', 22, AMBER, 'middle', 800))
    s.append(txt(350, 146, '꼭짓점 12 개를', 9, GRAY, 'middle', 700))
    s.append(txt(350, 160, '잘라 낸다', 9, GRAY, 'middle', 700))
    s.append(rect(34, 244, 632, 44, '#FBFCFE', LINE, 1, 7))
    s.append(txt(350, 264, '꼭짓점 12 개 → 오각형 12 개 · 삼각형 20 개 → 육각형 20 개',
                 11.6, NAVY, 'middle', 800))
    s.append(txt(350, 280, '자르기 전에도 2, 자른 뒤에도 2', 9, GRAY, 'middle', 700))
    s.append('</svg>')
    return ''.join(s)


@fig('ch15_box', '부피가 모두 1000 cm³ 인 상자 넷입니다. 담는 양은 똑같은데 **드는 종이는 '
     '다릅니다.** 정육면체(10 × 10 × 10)가 600 cm² 로 가장 적게 들고, 납작할수록 가파르게 '
     '늘어 100 × 10 × 1 짜리는 **3.7 배**가 듭니다. 택배 상자가 정육면체에 가까운 까닭입니다.')
def ch15_box():
    W, H = 700, 330
    boxes = [(10, 10, 10), (20, 10, 5), (40, 5, 5), (100, 10, 1)]
    out = []
    for a, b, c in boxes:
        v = a * b * c
        s = 2 * (a * b + b * c + c * a)
        assert v == 1000, (a, b, c, v)
        out.append((a, b, c, v, s))
    assert [o[4] for o in out] == [600, 700, 850, 2220]
    base = out[0][4]
    assert round(out[-1][4] / base, 1) == 3.7
    s = [head(W, H)]
    s.append(txt(20, 24, '같은 1000 cm³ — 드는 종이는 세 배 넘게 차이 난다', 12.5, NAVY,
                 'start', 800))
    GX, GY, GW, GH = 290, 288, 248, 182
    maxs = out[-1][4]
    for i, (a, b, c, v, sa) in enumerate(out):
        y = 86 + i * 50
        col = TEAL if i == 0 else (AMBER if i < 3 else RED)
        s.append(txt(44, y, '%d × %d × %d' % (a, b, c), 10.6, NAVY, 'start', 700))
        s.append(txt(236, y, '부피 1000', 8.8, GRAY, 'end'))
        wbar = GW * sa / float(maxs)
        s.append(rect(GX, y - 13, wbar, 18, col, 'none', 0, 3))
        s.append(txt(GX + wbar + 8, y, '%d cm²' % sa, 10.2, col, 'start', 800))
        if i:
            s.append(txt(GX + wbar + 76, y, '(%.1f 배)' % (sa / float(base)), 8.8,
                         GRAY, 'start', 700))
        else:
            s.append(txt(GX + wbar + 76, y, '← 가장 적다', 8.8, TEAL, 'start', 800))
    s.append(rect(34, 288, 632, 30, '#FBFCFE', LINE, 1, 6))
    s.append(txt(350, 308, '세 변이 고를수록 겉넓이가 작다 — 같은 부피라면 정육면체가 바닥',
                 11.4, NAVY, 'middle', 800))
    s.append('</svg>')
    return ''.join(s)


@fig('ch15_scale', '모양은 그대로 두고 길이만 k 배로 키우면, 겉넓이는 **k² 배**, 부피는 '
     '**k³ 배**가 됩니다. 늘어나는 속도가 다르기 때문에 «겉넓이 ÷ 부피» 는 거꾸로 **1/k 배**로 '
     '줄어듭니다. 커질수록 «몸집에 견준 피부»가 얇아진다는 뜻입니다.')
def ch15_scale():
    W, H = 700, 300
    ks = [1, 2, 4, 10]
    rows = [(k, k * k, k ** 3, 6.0 / k) for k in ks]
    assert [r[1] for r in rows] == [1, 4, 16, 100]
    assert [r[2] for r in rows] == [1, 8, 64, 1000]
    assert round(rows[-1][3] / rows[0][3], 2) == 0.1
    s = [head(W, H)]
    s.append(txt(20, 24, '길이 k 배 → 겉넓이 k² 배 · 부피 k³ 배', 12.5, NAVY, 'start', 800))
    # 정육면체 셋을 실제 비율로
    cy = 150.0
    cx = 70.0
    for k in (1, 2, 4):
        a = 17.0 * k
        s.append(rect(cx, cy - a / 2, a, a, '#E8F0FA', BLUE, 1.6, 2))
        s.append(txt(cx + a / 2, cy + a / 2 + 16, 'k = %d' % k, 9.2, NAVY, 'middle', 700))
        cx += a + 26
    xs = [320, 400, 480, 580]
    heads = ['k', '겉넓이', '부피', '겉넓이 ÷ 부피']
    for x, hd in zip(xs, heads):
        s.append(txt(x, 70, hd, 9.2, GRAY, 'middle', 800))
    s.append(line(300, 78, 666, 78, LINE, 1))
    for i, (k, sq, cu, ratio) in enumerate(rows):
        y = 102 + i * 28
        s.append(txt(xs[0], y, str(k), 10, NAVY, 'middle', 700))
        s.append(txt(xs[1], y, '%d 배' % sq, 9.8, GRAY, 'middle'))
        s.append(txt(xs[2], y, '%d 배' % cu, 9.8, GRAY, 'middle'))
        s.append(txt(xs[3], y, '%.2f' % (ratio / 6.0) + ' 배', 10.2, TEAL, 'middle', 800))
    s.append(rect(34, 244, 632, 44, '#FBFCFE', LINE, 1, 7))
    s.append(txt(350, 264, '부피는 k³ 로 치솟고 겉넓이는 k² 로 따라간다', 11.6, NAVY,
                 'middle', 800))
    s.append(txt(350, 280, '그래서 커질수록 «겉넓이 ÷ 부피» 가 작아진다 — 열이 빠져나갈 '
                           '길이 좁아진다', 9, GRAY, 'middle', 700))
    s.append('</svg>')
    return ''.join(s)


@fig('ch15_animal', '몸을 정육면체로 어림잡아 «겉넓이 ÷ 부피» 를 계산한 것입니다. '
     '한 변이 a 인 정육면체는 겉넓이 6a² · 부피 a³ 이므로 그 비는 **6 ÷ a** — 몸이 커질수록 '
     '작아집니다. 생쥐와 코끼리는 **40 배** 차이가 납니다. 코끼리가 귀를 키워 겉넓이를 '
     '보태는 까닭이 이 한 줄에 있습니다. (몸을 정육면체로 본 어림이며, 실제 동물의 값이 '
     '아닙니다)')
def ch15_animal():
    W, H = 700, 316
    animals = [('생쥐', 5.0, SKY), ('고양이', 25.0, TEAL), ('사람', 40.0, AMBER),
               ('코끼리', 200.0, RED)]
    rows = [(nm, a, 6 * a * a, a ** 3, 6.0 / a, col) for nm, a, col in animals]
    assert round(rows[0][4] / rows[-1][4]) == 40
    assert round(rows[0][4], 2) == 1.20 and round(rows[-1][4], 3) == 0.03
    s = [head(W, H)]
    s.append(txt(20, 24, '커질수록 «겉넓이 ÷ 부피» 가 작아진다', 12.5, NAVY, 'start', 800))
    s.append(txt(20, 52, '몸을 한 변 a 인 정육면체로 어림잡으면  겉넓이 ÷ 부피 = 6a² ÷ a³ '
                         '= 6 ÷ a', 10, GRAY, 'start', 700))
    xs = [84, 220, 330, 470, 600]
    heads = ['', 'a (cm)', '겉넓이 ÷ 부피', '', '생쥐의 몇 분의 몇']
    for x, hd in zip(xs, heads):
        if hd:
            s.append(txt(x, 92, hd, 9.2, GRAY, 'middle' if x > 100 else 'start', 800))
    s.append(line(34, 100, 666, 100, LINE, 1))
    big = rows[0][4]
    for i, (nm, a, sa, v, ratio, col) in enumerate(rows):
        y = 126 + i * 30
        s.append(txt(xs[0], y, nm, 10.4, col, 'start', 800))
        s.append(txt(xs[1], y, '%g' % a, 9.8, GRAY, 'middle'))
        s.append(txt(xs[2], y, '%.3f' % ratio, 10.4, col, 'middle', 800))
        wbar = 120.0 * (ratio / big)
        s.append(rect(xs[3] - 60, y - 9, max(1.2, wbar), 12, col, 'none', 0, 2))
        s.append(txt(xs[4], y, '1 / %.0f' % (big / ratio), 9.8, GRAY, 'middle', 700))
    s.append(rect(34, 254, 632, 48, '#FBFCFE', LINE, 1, 7))
    s.append(txt(350, 274, '코끼리는 생쥐의 1/40 — 열을 버릴 길이 그만큼 좁다', 11.6,
                 NAVY, 'middle', 800))
    s.append(txt(350, 292, '그래서 귀를 키운다. 코끼리 귀는 몸 전체 겉넓이의 5 분의 1 쯤 된다',
                 9, GRAY, 'middle', 700))
    s.append('</svg>')
    return ''.join(s)


@fig('ch16_three', '신발 가게에서 하루에 팔린 치수입니다. 세 대푯값이 **서로 다른 곳**을 '
     '가리킵니다 — 평균은 265.1 mm, 중앙값은 262.5 mm, 가장 많이 팔린 치수(최빈값)는 '
     '**255 mm** 입니다. 주인이 평균을 보고 265 를 쌓아 두면 팔리지 않습니다. 물음은 '
     '「가장 많이 팔리는 치수」인데 평균은 그 물음에 답하지 않습니다. 큰 치수 쪽으로 '
     '꼬리가 길어 평균이 그쪽으로 끌려간 것입니다.')
def ch16_three():
    sizes = [235, 240, 245, 250, 255, 260, 265, 270, 275, 280, 285, 290, 295, 300]
    cnt = [1, 2, 4, 7, 13, 10, 8, 7, 6, 5, 4, 3, 2, 2]
    n = sum(cnt)
    assert n == 74
    mean = sum(s * c for s, c in zip(sizes, cnt)) / float(n)
    assert round(mean, 1) == 265.1, round(mean, 1)
    flat = []
    for s, c in zip(sizes, cnt):
        flat += [s] * c
    med = (flat[n // 2 - 1] + flat[n // 2]) / 2.0
    assert med == 262.5, med
    mode = sizes[cnt.index(max(cnt))]
    assert mode == 255
    W, H = 700, 334
    GX, GY, GW, GH = 56, 244, 588, 150
    s = [head(W, H)]
    s.append(txt(20, 24, '하루에 팔린 신발 치수 74 켤레', 12.5, NAVY, 'start', 800))
    bw = GW / float(len(sizes))
    for i, (sz, c) in enumerate(zip(sizes, cnt)):
        x = GX + i * bw
        hgt = GH * c / float(max(cnt))
        col = AMBER if sz == mode else SKY
        s.append(rect(x + 3, GY - hgt, bw - 6, hgt, col, 'none', 0, 2))
        s.append(txt(x + bw / 2, GY - hgt - 5, str(c), 8.2, GRAY, 'middle', 700))
        s.append(txt(x + bw / 2, GY + 15, str(sz), 7.6, GRAY, 'middle'))
    s.append(line(GX, GY, GX + GW, GY, GRAY, 1.3))
    s.append(txt(GX + GW, GY + 32, '치수 (mm)', 8.8, GRAY, 'end', 700))
    lo, hi = 232.5, 302.5
    marks = [(mode, '최빈값 %g' % mode, AMBER, 0),
             (med, '중앙값 %g' % med, TEAL, 22),
             (mean, '평균 %.1f' % mean, RED, 44)]
    for v, lab, col, dy in marks:
        x = GX + (v - lo) / (hi - lo) * GW
        s.append(line(x, GY, x, 60 + dy, col, 1.6, '4 3'))
        s.append(txt(x, 54 + dy, lab, 9.8, col, 'middle', 800))
    s.append(rect(34, 292, 632, 32, '#FBFCFE', LINE, 1, 6))
    s.append(txt(350, 312, '셋이 다른 곳을 가리킨다 — 「무엇을 묻는가」가 고를 것을 정한다',
                 11.6, NAVY, 'middle', 800))
    s.append('</svg>')
    return ''.join(s)


@fig('ch16_outlier', '다섯 사람의 용돈입니다. 한 사람이 44 만 원을 받자 **평균이 10 만 원**이 '
     '되었습니다 — 다섯 중 **넷이 평균보다 적습니다.** 중앙값은 2 만 원 그대로입니다. '
     '평균은 모든 값을 끌어안기 때문에 **한 사람에게 끌려가고**, 중앙값은 순서만 보기 때문에 '
     '버팁니다.')
def ch16_outlier():
    a = [1, 1, 2, 2, 44]
    mean = sum(a) / float(len(a))
    med = sorted(a)[len(a) // 2]
    assert mean == 10.0 and med == 2
    below = sum(1 for x in a if x < mean)
    assert below == 4
    b = [1, 1, 2, 2, 4]
    assert sum(b) / 5.0 == 2.0 and sorted(b)[2] == 2
    W, H = 700, 300
    s = [head(W, H)]
    s.append(txt(20, 24, '한 사람이 평균을 끌어올린다', 12.5, NAVY, 'start', 800))
    panels = [(a, '맨 뒷사람이 44 만 원', RED), (b, '그 사람만 4 만 원으로 바꾸면', TEAL)]
    for pi, (vals, name, col) in enumerate(panels):
        ox, oy = 50.0 + pi * 340.0, 180.0
        m = sum(vals) / float(len(vals))
        md = sorted(vals)[2]
        s.append(txt(ox, 58, name, 10.4, col, 'start', 800))
        sc = 2.4
        for i, v in enumerate(vals):
            x = ox + i * 50
            hgt = min(v, 45) * sc
            s.append(rect(x, oy - hgt, 32, hgt, col if v > 10 else SKY, 'none', 0, 2))
            s.append(txt(x + 16, oy - hgt - 6, str(v), 9, NAVY, 'middle', 700))
        s.append(line(ox - 6, oy, ox + 250, oy, GRAY, 1.2))
        s.append(line(ox - 6, oy - m * sc, ox + 250, oy - m * sc, RED, 1.4, '4 3'))
        s.append(txt(ox + 256, oy - m * sc + 4, '평균 %g' % m, 9.4, RED, 'start', 800))
        s.append(txt(ox, oy + 20, '중앙값 %g · 평균 %g' % (md, m), 9.6, NAVY, 'start', 700))
        if pi == 0:
            s.append(txt(ox, oy + 36, '다섯 중 넷이 평균보다 적다', 9, RED, 'start', 800))
        else:
            s.append(txt(ox, oy + 36, '평균도 중앙값도 2 — 가까워졌다', 9, TEAL,
                         'start', 800))
    s.append(rect(34, 252, 632, 32, '#FBFCFE', LINE, 1, 6))
    s.append(txt(350, 272, '평균은 «모두» 를 보고, 중앙값은 «순서» 만 본다', 11.6, NAVY,
                 'middle', 800))
    s.append('</svg>')
    return ''.join(s)


@fig('ch16_daniels', '1952년 미 공군이 조종사 4,063 명의 몸을 열 군데 재어, 각 항목에서 '
     '**가운데 30 %** 에 드는 사람을 셌습니다. 한 항목만 보면 절반 가까이가 들지만, 항목을 '
     '늘릴수록 급격히 줄어 **열 항목 모두에 드는 사람은 한 명도 없었습니다.** '
     '「평균의 사람」에 맞춘 조종석이 아무에게도 맞지 않았던 까닭입니다. '
     '(막대는 줄어드는 꼴을 보이려 그린 것이고, 끝의 0 과 「셋에 3.5 %」가 기록된 값입니다)')
def ch16_daniels():
    W, H = 700, 316
    n = 4063
    pts = [(1, 0.30), (2, 0.12), (3, 0.035), (4, 0.012), (5, 0.004),
           (6, 0.0015), (7, 0.0006), (8, 0.0002), (9, 0.00005), (10, 0.0)]
    assert pts[0][1] == 0.30 and round(pts[2][1] * 100, 1) == 3.5
    assert pts[-1][1] == 0.0 and pts[-1][0] == 10
    s = [head(W, H)]
    s.append(txt(20, 24, '열 군데 모두 「가운데 30 %」에 드는 사람 — 4,063 명 가운데',
                 12.5, NAVY, 'start', 800))
    GX, GY, GW, GH = 66, 236, 572, 150
    bw = GW / 10.0
    for i, (k, p) in enumerate(pts):
        x = GX + i * bw
        hgt = GH * (p / 0.30)
        col = RED if p == 0 else (AMBER if k <= 3 else SKY)
        s.append(rect(x + 6, GY - max(hgt, 0.8), bw - 12, max(hgt, 0.8), col, 'none', 0, 2))
        lab = '0 명' if p == 0 else ('%.1f%%' % (p * 100) if p >= 0.001 else '0.1 %↓')
        s.append(txt(x + bw / 2, GY - max(hgt, 0.8) - 6, lab, 8.2,
                     RED if p == 0 else GRAY, 'middle', 800 if p == 0 else 700))
        s.append(txt(x + bw / 2, GY + 16, str(k), 8.6, GRAY, 'middle'))
    s.append(line(GX, GY, GX + GW, GY, GRAY, 1.3))
    s.append(txt(GX + GW / 2, GY + 34, '함께 보는 항목의 수', 9.2, GRAY, 'middle', 700))
    s.append(rect(34, 262, 632, 44, '#FFF6F5', '#E6C4C0', 1, 7))
    s.append(txt(350, 282, '열 항목 모두에 드는 사람 — 4,063 명 가운데 0 명', 12.4, RED,
                 'middle', 800))
    s.append(txt(350, 298, '세 항목만 보아도 이미 3.5 % 뿐이었다', 9, GRAY, 'middle', 700))
    s.append('</svg>')
    return ''.join(s)


CH17_DATA = [50, 51, 52, 53, 54, 55, 68, 69, 70, 71, 72, 73, 74,
             88, 89, 90, 91, 92, 95, 99]


def _bins(data, start, width):
    """start 에서 width 씩 잘라 도수를 센다 → [(아래끝, 도수), …]"""
    lo = start
    while lo > min(data):
        lo -= width
    out = []
    x = lo
    while x <= max(data):
        out.append((x, sum(1 for v in data if x <= v < x + width)))
        x += width
    return out


@fig('ch17_bins', '같은 점수 스무 개를 **계급의 크기만 바꿔** 세 번 그린 것입니다. '
     '5 점씩 자르면 잘게 흩어져 보이고, 20 점씩 자르면 뭉툭한 세 덩어리가 됩니다. '
     '자료는 하나도 바뀌지 않았습니다 — **바뀐 것은 자르는 방법뿐**입니다.')
def ch17_bins():
    W, H = 700, 330
    data = CH17_DATA
    assert len(data) == 20
    sets = [(5, SKY), (10, TEAL), (20, AMBER)]
    s = [head(W, H)]
    s.append(txt(20, 24, '같은 자료 · 계급의 크기만 바꾸면', 12.5, NAVY, 'start', 800))
    for i, (wd, col) in enumerate(sets):
        bs = _bins(data, 50, wd)
        assert sum(c for _, c in bs) == 20, (wd, bs)
        ox, oy, gw, gh = 44 + i * 222, 250, 180.0, 150.0
        s.append(txt(ox, 56, '계급 %d 점 · %d 칸' % (wd, len(bs)), 10.4, col,
                     'start', 800))
        bw = gw / float(len(bs))
        mx = max(c for _, c in bs)
        for j, (lo, c) in enumerate(bs):
            x = ox + j * bw
            hgt = gh * c / 8.0
            s.append(rect(x + 1, oy - hgt, bw - 2, hgt, col, '#fff', 0.8, 1))
            if c:
                s.append(txt(x + bw / 2, oy - hgt - 4, str(c), 7.6, GRAY, 'middle', 700))
        s.append(line(ox, oy, ox + gw, oy, GRAY, 1.2))
        s.append(txt(ox, oy + 16, '50', 8, GRAY, 'middle'))
        s.append(txt(ox + gw, oy + 16, '100', 8, GRAY, 'middle'))
        s.append(txt(ox + gw / 2, oy + 36, '가장 높은 막대 %d' % mx, 9, col,
                     'middle', 800))
    s.append(rect(34, 292, 632, 30, '#FBFCFE', LINE, 1, 6))
    s.append(txt(350, 312, '자료 20 개는 그대로다 — 자르는 폭만 달라졌다', 11.6, NAVY,
                 'middle', 800))
    s.append('</svg>')
    return ''.join(s)


@fig('ch17_shift', '이번에는 계급의 크기를 10 점으로 **고정**하고 **시작점만** 50 에서 55 로 '
     '옮겼습니다. 그러자 가장 높은 막대가 **50~60 점대에서 65~75 점대로 건너갔습니다.** '
     '같은 자료에서 「가장 많은 구간」이 어디냐는 물음의 답이 **자르는 자리 하나로** 바뀝니다.')
def ch17_shift():
    W, H = 316, 0
    data = CH17_DATA
    a = _bins(data, 50, 10)
    b = _bins(data, 55, 10)
    pa = max(a, key=lambda t: t[1])
    pb = max(b, key=lambda t: t[1])
    assert pa == (50, 6), pa
    assert pb == (65, 7), pb
    W, H = 700, 330
    s = [head(W, H)]
    s.append(txt(20, 24, '계급 크기는 그대로 · 시작점만 5 점 옮기면', 12.5, NAVY,
                 'start', 800))
    for i, (bs, start, col, peak) in enumerate(((a, 50, TEAL, pa), (b, 55, RED, pb))):
        ox, oy, gw, gh = 56 + i * 330, 252, 268.0, 152.0
        s.append(txt(ox, 58, '시작점 %d 점' % start, 10.6, col, 'start', 800))
        bw = gw / float(len(bs))
        for j, (lo, c) in enumerate(bs):
            x = ox + j * bw
            hgt = gh * c / 8.0
            top = (lo == peak[0])
            s.append(rect(x + 2, oy - hgt, bw - 4, hgt, col if top else SKY,
                          '#fff', 0.8, 2))
            if c:
                s.append(txt(x + bw / 2, oy - hgt - 5, str(c), 8.4,
                             col if top else GRAY, 'middle', 800 if top else 700))
            s.append(txt(x + bw / 2, oy + 15, str(lo), 7.6, GRAY, 'middle'))
        s.append(line(ox, oy, ox + gw, oy, GRAY, 1.2))
        s.append(txt(ox + gw / 2, oy + 36, '가장 높은 막대 — %d 점대 (%d 명)'
                     % (peak[0], peak[1]), 9.4, col, 'middle', 800))
    s.append(rect(34, 294, 632, 30, '#FFF6F5', '#E6C4C0', 1, 6))
    s.append(txt(350, 314, '자른 자리 하나로 「가장 많은 구간」이 건너뛴다', 11.6, RED,
                 'middle', 800))
    s.append('</svg>')
    return ''.join(s)


@fig('ch17_gerry', '사람 25 명이 사는 동네를 다섯 구역으로 나눕니다. ● 쪽을 미는 사람이 '
     '**10 명(40 %)**, ○ 쪽이 15 명으로 늘 똑같습니다. 그런데 줄을 어떻게 긋느냐에 따라 '
     '● 가 가져가는 구역이 **0 곳에서 3 곳까지** 달라집니다. 40 %가 60 %를 이기는 일이 '
     '벌어집니다 — 표를 센 것이 아니라 **금을 그은 것**이 결과를 정했습니다.')
def ch17_gerry():
    W, H = 700, 334
    plans = [('가로로 자르면', [2, 2, 2, 2, 2], 0, RED),
             ('세로로 자르면', [5, 5, 0, 0, 0], 2, GRAY),
             ('구불구불 자르면', [3, 3, 3, 1, 0], 3, TEAL)]
    for name, d, win, col in plans:
        assert sum(d) == 10, name
        assert sum(1 for x in d if x >= 3) == win, (name, d, win)
    s = [head(W, H)]
    s.append(txt(20, 24, '같은 25 명 · 줄만 다시 그으면', 12.5, NAVY, 'start', 800))
    s.append(txt(20, 52, '● 10 명(40 %) · ○ 15 명(60 %) — 사람은 하나도 움직이지 않는다',
                 9.6, GRAY, 'start', 700))
    for i, (name, d, win, col) in enumerate(plans):
        ox, oy = 48 + i * 222, 92
        s.append(txt(ox, oy, name, 10.6, col, 'start', 800))
        for k, cnt in enumerate(d):
            y = oy + 22 + k * 28
            s.append(rect(ox, y - 13, 168, 22, '#FBFCFE', LINE, 1, 4))
            for j in range(5):
                cx = ox + 20 + j * 30
                on = j < cnt
                s.append('<circle cx="%.1f" cy="%.1f" r="6" fill="%s" stroke="%s" '
                         'stroke-width="1.4"/>'
                         % (cx, y - 2, NAVY if on else '#fff', NAVY))
            s.append(txt(ox + 178, y + 2, '●%d' % cnt, 9,
                         TEAL if cnt >= 3 else GRAY, 'start', 800))
        s.append(txt(ox, oy + 182, '● 가 이긴 구역 %d / 5' % win, 11, col, 'start', 800))
    s.append(rect(34, 294, 632, 30, '#FBFCFE', LINE, 1, 6))
    s.append(txt(350, 314, '표는 같은데 결과가 0 · 2 · 3 — 자르는 방법이 답을 정했다',
                 11.6, NAVY, 'middle', 800))
    s.append('</svg>')
    return ''.join(s)


# ────────────────────────────────────────────────────── 제18장 · 줄기와 잎
CH18_A = [42, 45, 47, 51, 53, 55, 58, 60, 60, 61, 61, 62, 62,
          71, 73, 75, 77, 82, 84, 86, 88, 91, 93, 96, 99]
CH18_B = [42, 45, 47, 51, 53, 55, 58, 67, 68, 68, 69, 69, 69,
          71, 73, 75, 77, 82, 84, 86, 88, 91, 93, 96, 99]


def _stemrows(data):
    """[(줄기, [잎들]), …] — 10 의 자리로 가른다"""
    out = []
    for st in range(min(data) // 10, max(data) // 10 + 1):
        out.append((st, [v % 10 for v in data if v // 10 == st]))
    return out


def _median_pos(n):
    assert n % 2 == 1, '홀수 개일 때만 한가운데가 하나다'
    return (n + 1) // 2


@fig('ch18_stem', '왼쪽이 **줄기와 잎 그림**입니다. 10 의 자리를 줄기로, 1 의 자리를 잎으로 '
     '적었을 뿐이라 **원래 점수가 그대로 남아 있습니다.** 작은 쪽부터 열세 번째 잎을 짚으면 '
     '그것이 중앙값 **62 점**입니다. 오른쪽은 같은 자료를 **히스토그램**으로 바꾼 것입니다. '
     '모양은 더 잘 보이지만 막대는 **개수만** 말해 줍니다 — 중앙값이 60 점대라는 것까지는 '
     '알아도 그것이 60 인지 62 인지는 **되살릴 수 없습니다.**')
def ch18_stem():
    data = sorted(CH18_A)
    n = len(data)
    assert n == 25
    pos = _median_pos(n)
    assert pos == 13
    med = data[pos - 1]
    assert med == 62, med
    rows = _stemrows(data)
    assert [len(l) for _, l in rows] == [3, 4, 6, 4, 4, 4]
    assert sum(len(l) for _, l in rows) == n

    W, H = 700, 340
    s = [head(W, H)]
    s.append(txt(20, 24, '같은 점수 25 개 — 왼쪽은 값을 남기고, 오른쪽은 개수만 남긴다',
                 12.3, NAVY, 'start', 800))

    # ── 왼쪽 : 줄기와 잎 ──────────────────────────────────────
    s.append(txt(34, 56, '줄기와 잎 그림', 11, TEAL, 'start', 800))
    seen = 0
    for i, (st, leaves) in enumerate(rows):
        y = 86 + i * 36
        s.append(line(74, y - 14, 74, y + 10, LINE, 1.2))
        s.append(txt(66, y + 4, str(st), 12.5, NAVY, 'end', 800))
        for j, lf in enumerate(leaves):
            seen += 1
            x = 86 + j * 20
            hit = (seen == pos)
            if hit:
                s.append('<circle cx="%.1f" cy="%.1f" r="10.5" fill="#FFF3DC" '
                         'stroke="%s" stroke-width="1.6"/>' % (x + 3, y - 1, AMBER))
            s.append(txt(x + 3, y + 4, str(lf), 12.5,
                         AMBER if hit else GRAY, 'middle', 800 if hit else 600))
    s.append(txt(34, 312, '작은 쪽부터 13 번째 잎 = 중앙값 62 점', 10.4, AMBER, 'start', 800))

    # ── 오른쪽 : 히스토그램 ───────────────────────────────────
    GX, GY, GW, GH = 400, 286, 268.0, 184.0
    s.append(txt(GX, 56, '히스토그램', 11, SKY, 'start', 800))
    mx = max(len(l) for _, l in rows)
    bw = GW / float(len(rows))
    for i, (st, leaves) in enumerate(rows):
        c = len(leaves)
        hgt = GH * c / float(mx)
        x = GX + i * bw
        top = (data[pos - 1] // 10 == st)
        s.append(rect(x + 2, GY - hgt, bw - 4, hgt, AMBER if top else SKY, '#fff', 0.8, 2))
        s.append(txt(x + bw / 2, GY - hgt - 5, str(c), 9, GRAY, 'middle', 700))
        s.append(txt(x + bw / 2, GY + 15, '%d0' % st, 8.6, GRAY, 'middle'))
    s.append(line(GX, GY, GX + GW, GY, GRAY, 1.3))
    s.append(txt(GX, 312, '중앙값은 60 점대 — 몇 점인지는 알 수 없다', 10.4, SKY, 'start', 800))
    s.append(txt(GX + GW, 330, '점수', 8.8, GRAY, 'end', 700))
    s.append('</svg>')
    return ''.join(s)


@fig('ch18_lose', '두 반의 점수입니다. 줄기와 잎으로 적으면 **완전히 다른 자료**인 것이 '
     '한눈에 보입니다 — 가 반의 중앙값은 **62 점**, 나 반은 **69 점**입니다. 그런데 둘을 '
     '히스토그램으로 바꾸면 **똑같은 그림**이 됩니다. 계급마다 개수가 같기 때문입니다. '
     '정리는 공짜가 아닙니다. 한눈에 보이는 것을 얻는 대신 **값 하나하나를 잃습니다.**')
def ch18_lose():
    A, B = sorted(CH18_A), sorted(CH18_B)
    ra, rb = _stemrows(A), _stemrows(B)
    assert [len(l) for _, l in ra] == [len(l) for _, l in rb], '계급 도수가 같아야 한다'
    ma, mb = A[_median_pos(len(A)) - 1], B[_median_pos(len(B)) - 1]
    assert (ma, mb) == (62, 69), (ma, mb)
    assert A != B

    W, H = 700, 330
    s = [head(W, H)]
    s.append(txt(20, 24, '다른 자료 · 같은 히스토그램', 12.5, NAVY, 'start', 800))
    for k, (rows, nm, med, col) in enumerate(((ra, '가 반', ma, TEAL), (rb, '나 반', mb, RED))):
        ox = 36 + k * 200
        s.append(txt(ox, 54, '%s — 중앙값 %d 점' % (nm, med), 10.6, col, 'start', 800))
        for i, (st, leaves) in enumerate(rows):
            y = 80 + i * 26
            s.append(txt(ox + 18, y, str(st), 10.6, NAVY, 'end', 800))
            s.append(line(ox + 22, y - 10, ox + 22, y + 5, LINE, 1))
            s.append(txt(ox + 28, y, ' '.join(str(v) for v in leaves), 10.6, col, 'start', 600))
    # 가운데 화살표 → 공통 히스토그램
    GX, GY, GW, GH = 452, 246, 212.0, 150.0
    s.append(txt(GX, 54, '둘 다 이 그림이 된다', 10.6, GRAY, 'start', 800))
    mx = max(len(l) for _, l in ra)
    bw = GW / float(len(ra))
    for i, (st, leaves) in enumerate(ra):
        c = len(leaves)
        hgt = GH * c / float(mx)
        x = GX + i * bw
        s.append(rect(x + 2, GY - hgt, bw - 4, hgt, SKY, '#fff', 0.8, 2))
        s.append(txt(x + bw / 2, GY - hgt - 5, str(c), 8.4, GRAY, 'middle', 700))
        s.append(txt(x + bw / 2, GY + 14, '%d0' % st, 8, GRAY, 'middle'))
    s.append(line(GX, GY, GX + GW, GY, GRAY, 1.2))
    s.append(rect(34, 288, 632, 32, '#FFF6F5', '#E6C4C0', 1, 6))
    s.append(txt(350, 308, '막대는 «몇 개» 만 말한다 — 62 였는지 69 였는지는 사라졌다',
                 11.6, RED, 'middle', 800))
    s.append('</svg>')
    return ''.join(s)


@fig('ch18_mind', '존 터키가 남긴 것들을 **해마다** 벌여 놓은 것입니다. 가운데 이름에서 '
     '가지가 뻗고, 가지 끝마다 그해에 만든 것이 붙어 있습니다 — **bit · 소프트웨어 · '
     '빠른 푸리에 변환 · 줄기와 잎 · 상자 그림.** 통계학자 한 사람이 컴퓨터가 쓰는 말과 '
     '자료를 보는 눈을 함께 만들어 놓았습니다. 가지 왼쪽의 작은 그림은 **그해에 만든 것을 '
     '한 글자로 줄인 표시**입니다.')
def ch18_mind():
    W, H = 700, 356
    CX, CY = 96.0, 178.0
    items = [(1947, 'bit', '「이진 숫자(binary digit)」를 줄인 말', TEAL, 'bit'),
             (1958, '소프트웨어', '활자로 남은 이른 예로 꼽힌다', BLUE, 'code'),
             (1965, '빠른 푸리에 변환', '쿨리와 함께 — 신호를 빨리 푼다', SKY, 'wave'),
             (1977, '줄기와 잎 그림', '『탐색적 자료 분석』에서', AMBER, 'stem'),
             (1977, '상자 그림', '같은 책에서 — 네 토막으로 본다', RED, 'box')]
    assert len(items) == 5
    assert [i[0] for i in items] == sorted(i[0] for i in items), '연도순이어야 한다'

    def glyph(kind, x, y, col):
        """가지마다 다는 작은 표시 그림 (x, y 는 왼쪽 위 모서리 · 26 x 26)"""
        g = [rect(x, y, 26, 26, '#fff', col, 1.2, 6)]
        if kind == 'bit':
            g.append(txt(x + 13, y + 18, '01', 11, col, 'middle', 800))
        elif kind == 'code':
            g.append(txt(x + 13, y + 18, '&lt;/&gt;', 10, col, 'middle', 800))
        elif kind == 'wave':
            import math as _m
            pts = []
            for k in range(27):
                t = k / 26.0
                pts.append('%.1f,%.1f' % (x + k, y + 13 - 7.4 * _m.sin(2 * _m.pi * t)))
            g.append('<polyline fill="none" stroke="%s" stroke-width="1.6" points="%s"/>'
                     % (col, ' '.join(pts)))
        elif kind == 'stem':
            g.append(line(x + 9, y + 5, x + 9, y + 21, col, 1.2))
            g.append(txt(x + 6, y + 13, '6', 7.6, col, 'end', 800))
            g.append(txt(x + 12, y + 13, '0 2', 7.6, col, 'start', 600))
            g.append(txt(x + 13, y + 23, '', 7, col, 'middle'))
        else:                                   # box — 상자 그림
            g.append(line(x + 3, y + 13, x + 23, y + 13, col, 1.2))
            g.append(rect(x + 8, y + 8, 10, 10, '#fff', col, 1.4, 1.5))
            g.append(line(x + 13, y + 8, x + 13, y + 18, col, 1.2))
        return ''.join(g)

    s = [head(W, H)]
    s.append(txt(20, 24, '존 터키 — 한 사람이 남긴 말과 그림', 12.5, NAVY, 'start', 800))
    s.append(txt(20, 42, '이름을 잘 짓는 사람이었고, 자료를 먼저 보라고 한 사람이었다',
                 9.4, GRAY, 'start', 700))
    BX, BW, BH = 214.0, 462.0, 48.0
    for i, (yr, nm, why, col, gk) in enumerate(items):
        by = 60.0 + i * 58.0
        cy = by + BH / 2.0
        # 가운데에서 가지로 뻗는 곡선
        s.append('<path d="M %.1f %.1f C %.1f %.1f, %.1f %.1f, %.1f %.1f" fill="none" '
                 'stroke="%s" stroke-width="1.8"/>'
                 % (CX + 50, CY, CX + 120, CY, BX - 60, cy, BX - 4, cy, col))
        s.append(rect(BX, by, BW, BH, '#FBFCFE', col, 1.3, 9))
        s.append('<circle cx="%.1f" cy="%.1f" r="18" fill="#fff" stroke="%s" '
                 'stroke-width="1.8"/>' % (BX + 30, cy, col))
        s.append(txt(BX + 30, cy + 4, str(yr), 9.6, col, 'middle', 800))
        s.append(glyph(gk, BX + 56, cy - 13, col))
        s.append(txt(BX + 94, cy - 2, nm, 11.2, NAVY, 'start', 800))
        s.append(txt(BX + 94, cy + 14, why, 8.6, GRAY, 'start'))
    s.append('<circle cx="%.1f" cy="%.1f" r="50" fill="#F3F6FC" stroke="%s" '
             'stroke-width="2.6"/>' % (CX, CY, NAVY))
    s.append(txt(CX, CY - 2, '존 터키', 13.5, NAVY, 'middle', 800))
    s.append(txt(CX, CY + 17, '1915~2000', 8.6, GRAY, 'middle', 700))
    s.append('</svg>')
    return ''.join(s)


# ──────────────────────────────────────────────── 제19장 · 상대도수와 뒤집힘
# 1973년 가을 버클리 대학원, 가장 큰 여섯 과 (Bickel 외, 1975)
CH19_DEPT = [('가', 825, 512, 108, 89),
             ('나', 560, 353, 25, 17),
             ('다', 325, 120, 593, 202),
             ('라', 417, 138, 375, 131),
             ('마', 191, 53, 393, 94),
             ('바', 373, 22, 341, 24)]


@fig('ch19_size', '같은 모양으로 점수가 퍼진 두 반입니다. 가 반은 30 명, 나 반은 **90 명**. '
     '사람 수를 그대로 그리면(왼쪽) 나 반 막대가 **언제나 높습니다** — 사람이 세 배 많으니 '
     '당연합니다. 이것을 「나 반이 더 잘한다」로 읽으면 틀립니다. 각 막대를 전체 인원으로 '
     '나눈 것이 **상대도수**이고(오른쪽), 그제야 두 반을 포갤 수 있습니다. '
     '상대도수를 모두 더하면 **언제나 1** 입니다.')
def ch19_size():
    bins = ['50', '60', '70', '80', '90']
    a = [4, 8, 10, 6, 2]
    b = [12, 24, 30, 18, 6]
    assert sum(a) == 30 and sum(b) == 90
    assert all(y == 3 * x for x, y in zip(a, b)), '모양이 같아야 한다'
    ra = [x / 30.0 for x in a]
    rb = [y / 90.0 for y in b]
    assert abs(sum(ra) - 1) < 1e-9 and abs(sum(rb) - 1) < 1e-9
    assert all(abs(p - q) < 1e-9 for p, q in zip(ra, rb)), '상대도수는 같아야 한다'

    W, H = 700, 348
    s = [head(W, H)]
    s.append(txt(20, 24, '가 반 30 명 · 나 반 90 명 — 퍼진 모양은 똑같다', 12.4, NAVY,
                 'start', 800))
    panels = [('사람 수 그대로 (도수)', a, b, 30.0, False),
              ('전체로 나누면 (상대도수)', ra, rb, 0.36, True)]
    for pi, (name, va, vb, top, isr) in enumerate(panels):
        ox, oy, gw, gh = 50.0 + pi * 350.0, 254.0, 250.0, 162.0
        s.append(txt(ox, 56, name, 10.8, SKY if pi == 0 else TEAL, 'start', 800))
        bw = gw / float(len(bins)) / 2.4
        for j in range(len(bins)):
            x = ox + j * (gw / len(bins))
            for k, (v, col) in enumerate(((va[j], SKY), (vb[j], NAVY))):
                hgt = gh * v / top
                s.append(rect(x + 6 + k * (bw + 3), oy - hgt, bw, hgt, col, 'none', 0, 2))
            s.append(txt(x + 18, oy + 15, bins[j], 8.4, GRAY, 'middle'))
        s.append(line(ox, oy, ox + gw, oy, GRAY, 1.3))
        if isr:
            s.append(txt(ox, oy + 36, '두 반의 막대가 포개진다 · 합은 1', 9.6, TEAL,
                         'start', 800))
        else:
            s.append(txt(ox, oy + 36, '나 반이 늘 높다 — 사람이 많아서다', 9.6, RED,
                         'start', 800))
    # 범례는 맨 아래 가운데 — 오른쪽 위에 두면 둘째 그림 제목을 가린다
    s.append(rect(262, 310, 176, 30, '#FBFCFE', LINE, 1, 6))
    s.append('<rect x="276" y="319" width="12" height="12" fill="%s"/>' % SKY)
    s.append(txt(294, 329, '가 반', 9.2, GRAY, 'start', 700))
    s.append('<rect x="344" y="319" width="12" height="12" fill="%s"/>' % NAVY)
    s.append(txt(362, 329, '나 반', 9.2, GRAY, 'start', 700))
    s.append('</svg>')
    return ''.join(s)


@fig('ch19_berkeley', '1973년 가을 버클리 대학원에서 지원자가 가장 많았던 여섯 과입니다. 과마다 붙은 '
     '비율을 보면 **여섯 중 넷에서 여성이 더 높습니다.** 그런데 이 여섯 과를 '
     '**한 덩어리로 합치면** 남성 45 %, 여성 30 % 로 뒤집힙니다. 지원자가 어디에 '
     '몰렸는지를 보십시오 — 여성은 붙기 어려운 다·마·바 과에, 남성은 붙기 쉬운 '
     '가·나 과에 몰렸습니다. **합치는 순간 「어디에 지원했는가」가 섞여 들어옵니다.** '
     '(과 이름은 원 자료의 A~F 를 우리말 차례로 바꾼 것이고, 아래 수는 남성·여성 '
     '지원자 수입니다. 101 개 과를 모두 합친 값은 44 % 대 35 % 입니다)')
def ch19_berkeley():
    rows = []
    for nm, ma, mad, wa, wad in CH19_DEPT:
        rows.append((nm, ma, mad, 100.0 * mad / ma, wa, wad, 100.0 * wad / wa))
    win = sum(1 for r in rows if r[6] > r[3])
    assert win == 4, win
    MA = sum(r[1] for r in rows); MD = sum(r[2] for r in rows)
    WA = sum(r[4] for r in rows); WD = sum(r[5] for r in rows)
    assert (MA, WA) == (2691, 1835), (MA, WA)
    pm, pw = 100.0 * MD / MA, 100.0 * WD / WA
    assert round(pm) == 45 and round(pw) == 30, (pm, pw)

    W, H = 700, 348
    s = [head(W, H)]
    s.append(txt(20, 24, '과마다 보면 여성이 높은데, 합치면 뒤집힌다', 12.4, NAVY, 'start', 800))
    GX, GY, GW, GH = 66, 236, 400.0, 150.0
    bw = GW / 6.0
    for i, (nm, ma, mad, pmm, wa, wad, pww) in enumerate(rows):
        x = GX + i * bw
        for k, (p, col) in enumerate(((pmm, SKY), (pww, RED))):
            hgt = GH * p / 90.0
            s.append(rect(x + 8 + k * 22, GY - hgt, 19, hgt, col, 'none', 0, 2))
            s.append(txt(x + 17.5 + k * 22, GY - hgt - 5, '%d' % round(p), 7.8, col,
                         'middle', 800))
        s.append(txt(x + bw / 2, GY + 15, nm, 9.4, NAVY, 'middle', 800))
        s.append(txt(x + bw / 2, GY + 29, '%d·%d명' % (ma, wa), 7.4, GRAY, 'middle'))
    s.append(line(GX, GY, GX + GW, GY, GRAY, 1.3))
    s.append(txt(GX, 58, '과마다 붙은 비율 (%)', 10.4, NAVY, 'start', 800))
    s.append(txt(GX, GY + 48, '여섯 중 넷에서 여성이 더 높다', 9.8, RED, 'start', 800))
    # 오른쪽 : 합친 것
    BX, BY, BH = 520, 236, 150.0
    s.append(txt(BX, 58, '여섯 과를 합치면', 10.4, NAVY, 'start', 800))
    for k, (p, col, nm) in enumerate(((pm, SKY, '남성'), (pw, RED, '여성'))):
        hgt = BH * p / 90.0
        x = BX + k * 62
        s.append(rect(x, BY - hgt, 44, hgt, col, 'none', 0, 2))
        s.append(txt(x + 22, BY - hgt - 6, '%d %%' % round(p), 10.4, col, 'middle', 800))
        s.append(txt(x + 22, BY + 15, nm, 9.4, GRAY, 'middle', 700))
    s.append(line(BX - 6, BY, BX + 118, BY, GRAY, 1.3))
    s.append(txt(BX, BY + 48, '뒤집혔다', 9.8, RED, 'start', 800))
    s.append(rect(34, 304, 632, 32, '#FFF6F5', '#E6C4C0', 1, 6))
    s.append(txt(350, 324, '합치면 「어디에 지원했는가」가 함께 섞여 든다', 11.6, RED,
                 'middle', 800))
    s.append(rect(500, 46, 170, 32, '#FBFCFE', LINE, 1, 6))
    s.append('<rect x="512" y="55" width="12" height="12" fill="%s"/>' % SKY)
    s.append(txt(530, 65, '남성', 9.2, GRAY, 'start', 700))
    s.append('<rect x="578" y="55" width="12" height="12" fill="%s"/>' % RED)
    s.append(txt(596, 65, '여성', 9.2, GRAY, 'start', 700))
    s.append('</svg>')
    return ''.join(s)


# ─────────────────────────────────────────────────── 제20장 · 표본과 치우침
@fig('ch20_digest', '1936년 미국 대통령 선거. 『리터러리 다이제스트』는 **237 만 장**을 '
     '받아 세고 랜던이 **57.1 %** 로 이긴다고 내놓았습니다. 실제 결과는 루스벨트 '
     '**60.8 %** 였습니다. 빗나간 폭이 **23.7 %p** 입니다. 같은 해 갤럽은 이보다 훨씬 '
     '적은 사람에게 물어 맞혔습니다. **많이 묻는 것과 골고루 묻는 것은 다른 일입니다.**')
def ch20_digest():
    pred = [('랜던', 57.1, RED), ('루스벨트', 42.9, GRAY)]
    real = [('랜던', 36.5, GRAY), ('루스벨트', 60.8, TEAL)]
    assert abs(pred[0][1] + pred[1][1] - 100) < 1e-9
    gap = abs(60.8 - 36.3)
    miss = abs(57.1 - 36.5)
    assert round(miss, 1) == 20.6, miss

    W, H = 700, 316
    s = [head(W, H)]
    s.append(txt(20, 24, '237 만 장을 세고도 빗나갔다', 12.5, NAVY, 'start', 800))
    for pi, (name, data, note) in enumerate(
            (('다이제스트의 예상', pred, '237만 장을 세었다'),
             ('실제 결과', real, '루스벨트가 46개 주에서 이겼다'))):
        ox, oy, gh = 70.0 + pi * 340.0, 242.0, 158.0
        s.append(txt(ox, 58, name, 11, NAVY, 'start', 800))
        for k, (who, p, col) in enumerate(data):
            x = ox + k * 96
            hgt = gh * p / 70.0
            s.append(rect(x, oy - hgt, 62, hgt, col, 'none', 0, 2))
            s.append(txt(x + 31, oy - hgt - 7, '%.1f %%' % p, 10.6, col, 'middle', 800))
            s.append(txt(x + 31, oy + 16, who, 9.6, GRAY, 'middle', 700))
        s.append(line(ox - 8, oy, ox + 166, oy, GRAY, 1.3))
        s.append(txt(ox, oy + 38, note, 9, GRAY, 'start', 700))
    s.append(rect(34, 272, 632, 32, '#FFF6F5', '#E6C4C0', 1, 6))
    s.append(txt(350, 292, '랜던을 57.1 %로 보았는데 실제는 36.5 % — 20.6 %p 빗나갔다',
                 11.6, RED, 'middle', 800))
    s.append('</svg>')
    return ''.join(s)


@fig('ch20_frame', '왜 빗나갔을까요. 두 군데에서 사람이 걸러졌습니다. ① **누구에게 '
     '보냈나** — 전화번호부·자동차 등록부·회원 명부에서 주소를 모았습니다. 대공황 한가운데서 '
     '전화와 자동차를 가진 사람은 형편이 나은 쪽이었습니다. ② **누가 답장했나** — 1000 만 '
     '장을 보내 돌아온 것은 **넷 중 하나**뿐이었고, 답장을 보낸 쪽은 정부에 할 말이 많은 '
     '사람들이었습니다. **거르고 또 거른 237 만 명은 미국이 아니었습니다.**')
def ch20_frame():
    sent, back = 10000000, 2376523
    rate = 100.0 * back / sent
    assert 23 < rate < 24, rate
    W, H = 700, 306
    s = [head(W, H)]
    s.append(txt(20, 24, '두 번 걸러진 237 만 명', 12.5, NAVY, 'start', 800))
    steps = [('미국의 투표자', '전부', 560.0, SKY,
              '이 가운데 누구에게 물을지 고른다'),
             ('주소를 구할 수 있던 사람', '1000만 명에게 보냄', 330.0, AMBER,
              '전화·자동차·회원 명부 — 형편이 나은 쪽에 쏠렸다'),
             ('답장을 보낸 사람', '237만 장 (넷 중 하나)', 150.0, RED,
              '답장할 마음이 큰 쪽에 다시 쏠렸다')]
    for i, (nm, sub, w, col, why) in enumerate(steps):
        y = 74.0 + i * 68.0
        x = 350.0 - w / 2.0
        s.append(rect(x, y, w, 40, col, '#fff', 1, 7))
        s.append(txt(350, y + 18, nm, 11, '#fff', 'middle', 800))
        s.append(txt(350, y + 33, sub, 8.6, '#fff', 'middle', 700))
        s.append(txt(350, y + 56, why, 8.8, GRAY, 'middle'))
    s.append(rect(34, 268, 632, 30, '#FBFCFE', LINE, 1, 6))
    s.append(txt(350, 288, '표본이 커도 «치우친 채로» 커지면 오차는 줄지 않는다', 11.6,
                 NAVY, 'middle', 800))
    s.append('</svg>')
    return ''.join(s)


@fig('ch20_wobble', '같은 학교에서 학생을 **무작위로** 뽑아 평균 통학 시간을 재는 일을 '
     '여러 번 되풀이한 것입니다. 5 명만 뽑으면 평균이 크게 널뜁니다. 30 명, 100 명으로 '
     '늘리면 점들이 가운데로 모입니다. 다만 이것은 **골고루 뽑았을 때** 이야기입니다. '
     '뽑는 틀이 한쪽으로 기울어 있으면 수를 늘려도 **기운 채로 모일 뿐**입니다.')
def ch20_wobble():
    import random as _r
    true = 20.0
    _r.seed(20260401)
    sets = [(5, 60), (30, 60), (100, 60)]
    out = []
    for size, times in sets:
        means = []
        for _ in range(times):
            v = [max(2.0, _r.gauss(true, 11.0)) for _ in range(size)]
            means.append(sum(v) / size)
        rng = max(means) - min(means)
        out.append((size, means, rng))
    assert out[0][2] > out[1][2] > out[2][2], [round(o[2], 1) for o in out]

    W, H = 700, 300
    s = [head(W, H)]
    s.append(txt(20, 24, '몇 명에게 물었나 — 평균이 얼마나 널뛰나', 12.5, NAVY, 'start', 800))
    GX, GY, GW = 90.0, 70.0, 520.0
    LO, HI = 8.0, 32.0

    def px(v):
        return GX + GW * (v - LO) / (HI - LO)
    for i, (size, means, rng) in enumerate(out):
        y = GY + 34 + i * 66
        s.append(line(GX, y, GX + GW, y, LINE, 1))
        s.append(txt(GX - 12, y + 4, '%d 명' % size, 10, NAVY, 'end', 800))
        col = (RED, AMBER, TEAL)[i]
        for m in means:
            s.append('<circle cx="%.1f" cy="%.1f" r="3.1" fill="%s" fill-opacity="0.5"/>'
                     % (px(min(max(m, LO), HI)), y, col))
        s.append(txt(GX + GW + 10, y + 4, '폭 %.0f 분' % rng, 9, col, 'start', 800))
    s.append(line(px(true), GY + 16, px(true), GY + 34 + 2 * 66 + 16, NAVY, 1.4, '5 4'))
    s.append(txt(px(true), GY + 10, '참값 20 분', 9.4, NAVY, 'middle', 800))
    s.append(rect(34, 262, 632, 30, '#FBFCFE', LINE, 1, 6))
    s.append(txt(350, 282, '사람을 늘리면 «널뛰는 폭» 은 줄어든다 — 치우침은 줄지 않는다',
                 11.6, NAVY, 'middle', 800))
    s.append('</svg>')
    return ''.join(s)

if __name__ == '__main__':
    write_all(sys.argv[1] if len(sys.argv) > 1 else None)
