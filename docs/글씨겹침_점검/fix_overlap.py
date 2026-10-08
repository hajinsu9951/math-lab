# -*- coding: utf-8 -*-
"""「오늘의 문제」 그림에서 글씨가 겹치던 열두 곳을 고친다.

check_overlap.py 가 찾아낸 자리만 고친다. 그림의 수학(좌표·각·눈금)은 건드리지 않고
**글상자 자리만** 옮긴다. 다시 돌려도 안전하다.

사용: python docs/글씨겹침_점검/fix_overlap.py src/40-demos.js
"""
import sys, math

try:
    sys.stdout.reconfigure(encoding='utf-8')
except Exception:
    pass


# ── LAB 67 · 오른쪽 띠를 10px 올려 「l / 2」 와 아래 설명이 겹치지 않게 ────
def fan67(by):
    r, ang, n = 54.0, 120.0, 6
    cx, cy = 96.0, 104.0
    t0 = math.radians(-ang / 2 - 90)
    step = math.radians(ang) / n
    out = []
    for k in range(n):
        a, b = t0 + k * step, t0 + (k + 1) * step
        out.append('<path d="M%.1f %.1f L%.1f %.1f A%.1f %.1f 0 0 1 %.1f %.1f Z" fill="%s" opacity=".30" stroke="#2563EB" stroke-width="1"/>'
                   % (cx, cy, cx + r * math.cos(a), cy + r * math.sin(a), r, r,
                      cx + r * math.cos(b), cy + r * math.sin(b),
                      '#2563EB' if k % 2 == 0 else '#0E9384'))
    l = r * math.radians(ang)
    w = l / 2
    bx = 232.0
    sw = w / (n / 2)
    for k in range(n):
        up = k % 2 == 0
        x = bx + (k // 2) * sw + (0 if up else sw * 0.5)
        col = '#2563EB' if up else '#0E9384'
        if up:
            pts = [(x, by), (x + sw, by), (x + sw * 0.5, by - r)]
        else:
            pts = [(x, by - r), (x + sw, by - r), (x + sw * 0.5, by)]
        out.append('<polygon points="%s" fill="%s" opacity=".30" stroke="%s" stroke-width="1"/>'
                   % (' '.join('%.1f,%.1f' % p for p in pts), col, col))
    out.append('<path d="M%.1f %.1f V%.1f" stroke="#BE123C" stroke-width="1.6"/>' % (bx - 10, by, by - r))
    out.append('<text x="%.1f" y="%.1f" font-size="10" font-weight="800" fill="#BE123C" text-anchor="end">r</text>'
               % (bx - 14, by - r / 2 + 4))
    out.append('<path d="M%.1f %.1f H%.1f" stroke="#B45309" stroke-width="1.6"/>' % (bx, by + 12, bx + w))
    out.append('<text x="%.1f" y="%.1f" font-size="10" font-weight="800" fill="#92400E" text-anchor="middle">l / 2</text>'
               % (bx + w / 2, by + 26))
    return ''.join(out)


# ── LAB 70 · 두 줄을 12px 올려 칸 수와 아래 설명이 겹치지 않게 ────────────
IDS70 = [2026000 + 2 * k for k in range(20)]


def hash70(y10, y7):
    out = []
    for m, y, col in ((10, y10, '#BE123C'), (7, y7, '#0E9384')):
        cnt = {}
        for i in IDS70:
            cnt[i % m] = cnt.get(i % m, 0) + 1
        for s in range(m):
            x = 66 + s * 28
            c = cnt.get(s, 0)
            out.append('<rect x="%d" y="%d" width="24" height="30" rx="3" fill="#F3F4F6" stroke="#D1D5DB" stroke-width="1"/>' % (x, y))
            if c:
                h = min(26, 5 * c)
                out.append('<rect x="%d" y="%d" width="24" height="%d" rx="3" fill="%s" opacity=".55"/>' % (x, y + 30 - h, h, col))
                out.append('<text x="%d" y="%d" font-size="9.5" font-weight="800" fill="%s" text-anchor="middle">%d</text>' % (x + 12, y + 44, col, c))
        out.append('<text x="52" y="%d" font-size="10.5" font-weight="800" fill="%s" text-anchor="end">m=%d</text>' % (y + 20, col, m))
    return ''.join(out)


# ── 한 줄짜리 자리 옮김 ───────────────────────────────────────────────────
MOVES = [
    # LAB 04 — 설명이 세로축 눈금 «20,000» 과 같은 높이였다
    ('<text x="150" y="80" fill="#92400E" text-anchor="end">여기가 어디?</text>',
     '<text x="150" y="64" fill="#92400E" text-anchor="end">여기가 어디?</text>'),
    # LAB 10 — 곡선 이름이 «78점» 과 겹쳤다. 곡선 이름을 내리면 곡선을 덮으므로 «78점» 쪽을 옮긴다
    ('<text x="150" y="38" font-size="11" font-weight="800" fill="#1D4ED8">수학 (μ70, 촘촘)</text>',
     '<text x="150" y="22" font-size="11" font-weight="800" fill="#1D4ED8">수학 (μ70, 촘촘)</text>'),
    ('<text x="225" y="16" font-size="11.5" font-weight="800" fill="#BE123C" text-anchor="middle">78점</text>',
     '<text x="248" y="30" font-size="11.5" font-weight="800" fill="#BE123C">78점</text>'),
    # LAB 68 — «남는 틈» 이 맨 위 설명과 겹쳤다. 원 왼쪽 빈자리로 빼고 지시선을 단다
    ('<text x="174.7" y="22.0" font-size="10" font-weight="800" fill="#BE123C" text-anchor="middle">남는 틈</text>',
     '<path d="M128 38 L176 36" stroke="#BE123C" stroke-width="1.1"/>'
     '<text x="124" y="40" font-size="10" font-weight="800" fill="#BE123C" text-anchor="end">남는 틈</text>'),
    # LAB 73 — 달 표시가 맨 위 설명과 겹쳤다. 선 왼쪽 아래 빈자리로
    ('<text x="378" y="20.2" font-size="10" font-weight="800" fill="#BE123C" text-anchor="end">달까지 384,400 km</text>',
     '<text x="52" y="38" font-size="10" font-weight="800" fill="#BE123C">달까지 384,400 km</text>'),
    # LAB 78 — 점 이름이 «1» 눈금과 겹쳤다. 점의 왼쪽으로
    ('<text x="206" y="124" font-size="10.5" font-weight="800" fill="#BE123C">(0, b)</text>',
     '<text x="194" y="110" font-size="10.5" font-weight="800" fill="#BE123C" text-anchor="end">(0, b)</text>'),
]


def main(path):
    h = open(path, encoding='utf-8').read()
    done, skip = [], []

    old67, new67 = fan67(132.0), fan67(122.0)
    if old67 in h:
        h = h.replace(old67, new67, 1)
        done.append('LAB 67')
    else:
        skip.append('LAB 67')

    old70, new70 = hash70(52, 116), hash70(40, 104)
    if old70 in h:
        h = h.replace(old70, new70, 1)
        done.append('LAB 70')
    else:
        skip.append('LAB 70')

    for a, b in MOVES:
        if a in h:
            assert h.count(a) == 1, a[:40]
            h = h.replace(a, b, 1)
            done.append(a[:30])
        else:
            skip.append(a[:30])

    open(path, 'w', encoding='utf-8').write(h)
    sys.stdout.write('고침: %s\n' % ' · '.join(done) if done else '고칠 것 없음\n')
    if skip:
        sys.stdout.write('이미 반영됨: %s\n' % ' · '.join(skip))


if __name__ == '__main__':
    main(sys.argv[1])
