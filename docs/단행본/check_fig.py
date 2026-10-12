# -*- coding: utf-8 -*-
"""그림 안 «글씨끼리 겹치는 곳» 을 기계로 센다.

figures.py 의 그림을 모두 그려 보고, <text> 하나하나의 자리를 글자 폭으로 재어
서로 포개지는 짝을 찾는다. 눈으로 보아 넘기던 겹침을 숫자로 잡으려는 것이다.
(화면 쪽 check_overlap.py 와 같은 생각이다.)

  python docs/단행본/check_fig.py            전부 본다
  python docs/단행본/check_fig.py ch02_expo  하나만 본다

글자 폭은 실제 글꼴이 아니라 어림이다 — 한글·한자는 글자 크기만큼,
숫자·영문은 0.56 배, 공백은 0.3 배로 친다. 그러니 1~2 px 스치는 것은 넘기고
**4 px 이상 포개질 때만** 겹침으로 센다. 어림이라도 「12」와 「2²」가 같은 자리에
찍히는 일은 반드시 걸린다.
"""
import io
import os
import re
import sys

try:
    sys.stdout.reconfigure(encoding='utf-8')
except Exception:
    pass

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
import figures as F  # noqa: E402

MIN_OVERLAP = 4.0          # 이만큼 넘게 포개져야 겹침으로 센다
TAG = re.compile(r'<[^>]+>')
TEXT = re.compile(
    r'<text x="(-?[\d.]+)" y="(-?[\d.]+)" font-size="([\d.]+)" fill="[^"]*" '
    r'text-anchor="(\w+)" font-weight="\d+"[^>]*>(.*?)</text>', re.S)


def char_w(ch, size):
    """글자 하나의 가로 폭 어림."""
    o = ord(ch)
    if ch == ' ':
        return size * 0.30
    if o > 0x1100:                      # 한글·한자·전각
        return size * 1.00
    if ch in '¹²³⁴⁰':
        return size * 0.42
    if ch in '.,:;·\'|!':
        return size * 0.28
    if ch in 'il1':
        return size * 0.30
    return size * 0.56                  # 그 밖의 숫자·영문·기호


def box(m):
    x, y, size, anchor, body = m.group(1, 2, 3, 4, 5)
    x, y, size = float(x), float(y), float(size)
    sgl = TAG.sub('', body)
    w = sum(char_w(c, size) for c in sgl)
    if anchor == 'middle':
        x0 = x - w / 2.0
    elif anchor == 'end':
        x0 = x - w
    else:
        x0 = x
    # 기준선(y) 위로 0.76, 아래로 0.22 가 글자가 차지하는 띠다
    return (x0, y - size * 0.76, x0 + w, y + size * 0.22, sgl)


def overlaps(svg):
    bs = [box(m) for m in TEXT.finditer(svg)]
    out = []
    for i in range(len(bs)):
        for j in range(i + 1, len(bs)):
            a, b = bs[i], bs[j]
            ox = min(a[2], b[2]) - max(a[0], b[0])
            oy = min(a[3], b[3]) - max(a[1], b[1])
            if ox > MIN_OVERLAP and oy > MIN_OVERLAP:
                out.append((a[4], b[4], round(ox, 1), round(oy, 1)))
    return out


def main(argv):
    names = argv or sorted(F.FIGS)
    bad = 0
    for name in names:
        fn, _cap = F.FIGS[name]
        svg = fn()
        hits = overlaps(svg)
        n = len(TEXT.findall(svg))
        if hits:
            bad += len(hits)
            sys.stdout.write('✗ %-14s 글씨 %3d 개 · 겹침 %d 곳\n' % (name, n, len(hits)))
            for a, b, ox, oy in hits[:6]:
                sys.stdout.write('    「%s」 ⟂ 「%s」  %sx%s px\n'
                                 % (a[:22], b[:22], ox, oy))
        else:
            sys.stdout.write('· %-14s 글씨 %3d 개 — 겹침 없음\n' % (name, n))
    sys.stdout.write('\n그림 %d 장 · 겹침 %d 곳\n' % (len(names), bad))
    return 1 if bad else 0


if __name__ == '__main__':
    sys.exit(main([a for a in sys.argv[1:]]))
