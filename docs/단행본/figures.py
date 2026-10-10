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
    cols = [('소수', 120), ('2', 240), ('3', 360), ('값', 520)]
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
            s.append(rect(96, y - 20, 560, 34, '#F3F6FC', LINE, 1, 5))
        s.append(txt(248 if i < 2 else 96, y + 3, lab, 11, col, 'end' if i < 2 else 'start', 700))
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

if __name__ == '__main__':
    write_all(sys.argv[1] if len(sys.argv) > 1 else None)
