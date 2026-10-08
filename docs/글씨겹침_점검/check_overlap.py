# -*- coding: utf-8 -*-
"""「오늘의 문제」 그림(SVG) 안에서 글씨끼리 겹치는 곳을 찾아낸다.

왜
  수업 모형의 문제 그림은 좌표를 계산해서 그린다. 그런데 글상자 크기는 계산하지 않았다.
  그래서 설명 글과 좌표로 찍은 글이 같은 자리에 겹쳐 찍히는 곳이 생겼다.
  눈으로 356장을 다 볼 수는 없으니, 글자 폭을 재서 사각형끼리 겹치는지 기계로 센다.

어떻게
  · 한글·한자는 글자 크기만큼, 라틴 문자·숫자·공백은 그 0.55 배로 폭을 잡는다 (실측에 가깝다)
  · text-anchor 로 좌우 기준을 옮기고, 기준선(baseline) 위 0.78 · 아래 0.22 를 글상자 높이로 둔다
  · 두 글상자가 가로·세로 모두 겹치면 «겹침» 으로 센다. 살짝 스치는 것은 2px 여유를 준다

사용: python docs/글씨겹침_점검/check_overlap.py src/40-demos.js
"""
import sys, re, unicodedata

try:
    sys.stdout.reconfigure(encoding='utf-8')   # 콘솔이 cp949 라 한글이 깨지는 것을 막는다
except Exception:
    pass

PAD = 2.0          # 이만큼은 스쳐도 겹침으로 세지 않는다
UP, DOWN = 0.78, 0.22


def cw(ch, sz):
    """글자 하나의 폭."""
    if ch == ' ':
        return sz * 0.30
    o = ord(ch)
    if o < 0x300:                       # 라틴·숫자·문장부호
        return sz * (0.58 if ch.isalpha() or ch.isdigit() else 0.42)
    if unicodedata.east_asian_width(ch) in ('W', 'F'):
        return sz * 1.0
    return sz * 0.58


def width(txt, sz):
    return sum(cw(c, sz) for c in txt)


def boxes(svg):
    """<text ...>내용</text> 를 글상자로 바꾼다."""
    out = []
    for m in re.finditer(r'<text\b([^>]*)>(.*?)</text>', svg, re.S):
        at, raw = m.group(1), m.group(2)
        txt = re.sub(r'<[^>]*>', '', raw).strip()
        if not txt:
            continue

        def a(name, dflt=None):
            k = re.search(r'\b%s="([^"]*)"' % name, at)
            return k.group(1) if k else dflt

        try:
            x, y = float(a('x', 'nan')), float(a('y', 'nan'))
        except ValueError:
            continue
        if x != x or y != y:
            continue
        sz = float(a('font-size', '12'))
        w = width(txt, sz)
        an = a('text-anchor', 'start')
        x0 = x - w / 2 if an == 'middle' else (x - w if an == 'end' else x)
        out.append({'t': txt, 'x0': x0, 'x1': x0 + w,
                    'y0': y - sz * UP, 'y1': y + sz * DOWN, 'sz': sz})
    return out


def hit(a, b):
    return (a['x0'] < b['x1'] - PAD and b['x0'] < a['x1'] - PAD and
            a['y0'] < b['y1'] - PAD and b['y0'] < a['y1'] - PAD)


def area(a, b):
    w = min(a['x1'], b['x1']) - max(a['x0'], b['x0'])
    h = min(a['y1'], b['y1']) - max(a['y0'], b['y0'])
    return max(0.0, w) * max(0.0, h)


def svgs_of(src):
    """LESSON[n].problem.svg 를 꺼낸다. 백틱 문자열 하나가 통째로 그림이다."""
    out = {}
    for m in re.finditer(r'LESSON\[(\d+)\]=\{', src):
        no = int(m.group(1))
        i = src.find('svg:`', m.end())
        if i < 0:
            continue
        j = src.find('`', i + 5)
        out[no] = src[i + 5:j]
    return out


def main(path):
    src = open(path, encoding='utf-8').read()
    bad = []
    for no, svg in sorted(svgs_of(src).items()):
        bs = boxes(svg)
        for p in range(len(bs)):
            for q in range(p + 1, len(bs)):
                if hit(bs[p], bs[q]):
                    bad.append((no, round(area(bs[p], bs[q])), bs[p]['t'], bs[q]['t']))
    if not bad:
        sys.stdout.write('글씨 겹침 없음\n')
        return
    bad.sort(key=lambda r: -r[1])
    sys.stdout.write('글씨 겹침 %d곳\n' % len(bad))
    for no, ar, t1, t2 in bad:
        sys.stdout.write('LAB %3d  %5d px2  [%s] <> [%s]\n' % (no, ar, t1[:34], t2[:34]))


if __name__ == '__main__':
    main(sys.argv[1])
