# -*- coding: utf-8 -*-
"""「오늘의 문제」 그림을 다듬는다 — 축 화살표 · 글씨 흰 테두리 · 선 마감.

왜
  · 좌표축이 그냥 선으로 끝나 있어서 «어느 쪽이 커지는 방향인지» 가 보이지 않았다
  · 글씨가 곡선이나 격자 위에 올라가면 읽히지 않았다
  · 선 끝이 각지게 잘려 그래프가 거칠어 보였다

무엇을 하나 (그림의 수학은 하나도 건드리지 않는다)
  1. 가로로 길게 뻗은 회색 선 → 오른쪽 끝에 화살촉, 세로로 길게 뻗은 선 → 위쪽 끝에 화살촉
     (뷰박스의 55% 를 넘는 선만 «축» 으로 본다. 눈금이나 밑줄에는 붙이지 않는다)
  2. 모든 <text> 에 흰 테두리를 두른다 — paint-order="stroke" 라서 글자 «뒤» 에만 깔린다
  3. 굵은 선(곡선·그래프)의 끝과 꺾임을 둥글게 한다

사용: python docs/그림_다듬기/polish_figs.py src/40-demos.js
"""
import sys, re

try:
    sys.stdout.reconfigure(encoding='utf-8')
except Exception:
    pass

AXIS_GREY = {'#9CA3AF', '#D1D5DB', '#C3C9D2', '#6B7280'}
HALO = ' paint-order="stroke" stroke="#fff" stroke-width="3.2" stroke-linejoin="round"'
LONG = 0.55                 # 뷰박스의 이만큼을 넘으면 «축» 으로 본다
HEAD_L, HEAD_W = 7.0, 3.4   # 화살촉 길이 · 반폭


def viewbox(svg):
    m = re.search(r'viewBox="([\d.\-\s]+)"', svg)
    if not m:
        return None
    p = [float(v) for v in m.group(1).split()]
    return (p[2], p[3]) if len(p) == 4 else None


def segments(d):
    """M/H/V 로만 된 경로를 선분 목록으로. 그 밖의 명령이 섞이면 None."""
    toks = re.findall(r'([MHVLmhvl])([^MHVLmhvl]*)', d)
    if not toks or len(re.sub(r'[\sMHVL\d.\-]', '', d)):
        return None
    cur = None
    segs = []
    for cmd, arg in toks:
        n = [float(v) for v in re.findall(r'-?\d+(?:\.\d+)?', arg)]
        if cmd == 'M':
            if len(n) < 2:
                return None
            cur = (n[0], n[1])
        elif cmd == 'H':
            if cur is None or not n:
                return None
            segs.append((cur, (n[0], cur[1])))
            cur = (n[0], cur[1])
        elif cmd == 'V':
            if cur is None or not n:
                return None
            segs.append((cur, (cur[0], n[0])))
            cur = (cur[0], n[0])
        elif cmd == 'L':
            if cur is None or len(n) < 2:
                return None
            segs.append((cur, (n[0], n[1])))
            cur = (n[0], n[1])
        else:
            return None
    return segs


def head(tip, dx, dy):
    """끝점 tip 에서 (dx,dy) 방향으로 향하는 화살촉."""
    bx, by = tip[0] - dx * HEAD_L, tip[1] - dy * HEAD_L
    px, py = -dy * HEAD_W, dx * HEAD_W
    return '<path d="M%.1f %.1f L%.1f %.1f L%.1f %.1f Z" fill="%%s"/>' % (
        tip[0], tip[1], bx + px, by + py, bx - px, by - py)


def arrows(svg, W, H):
    """긴 회색 가로·세로 선의 «커지는 쪽» 끝에 화살촉을 단다."""
    add = []
    for m in re.finditer(r'<path\b([^>]*)/>', svg):
        at = m.group(1)
        if 'fill=' in at and 'none' not in at:
            continue
        sm = re.search(r'stroke="(#[0-9A-Fa-f]{6})"', at)
        if not sm or sm.group(1) not in AXIS_GREY:
            continue
        if 'stroke-dasharray' in at:
            continue
        dm = re.search(r'\bd="([^"]*)"', at)
        if not dm:
            continue
        segs = segments(dm.group(1))
        if not segs:
            continue
        col = sm.group(1)
        for (a, b) in segs:
            if abs(a[1] - b[1]) < 0.6 and abs(b[0] - a[0]) > LONG * W:      # 가로축
                tip = b if b[0] > a[0] else a
                add.append(head((tip[0] + 4, tip[1]), 1, 0) % col)
            elif abs(a[0] - b[0]) < 0.6 and abs(b[1] - a[1]) > LONG * H:    # 세로축
                tip = b if b[1] < a[1] else a
                add.append(head((tip[0], tip[1] - 4), 0, -1) % col)
    return add


def polish(svg):
    vb = viewbox(svg)
    if not vb:
        return svg, 0, 0
    W, H = vb

    # ① 축 화살촉
    add = arrows(svg, W, H)
    na = len(add)
    if na and '</svg>' in svg:
        i = svg.rindex('</svg>')           # 사진(<img>)만 든 칸도 있어서 확인하고 넣는다
        svg = svg[:i] + ''.join(add) + svg[i:]
    else:
        na = 0

    # ② 글씨 흰 테두리
    nt = 0

    def halo(m):
        nonlocal nt
        at = m.group(1)
        if 'paint-order' in at or 'stroke=' in at:
            return m.group(0)
        nt += 1
        return '<text' + at + HALO + '>'

    svg = re.sub(r'<text\b([^>]*?)>', halo, svg)

    # ③ 굵은 선의 끝·꺾임을 둥글게
    def cap(m):
        at = m.group(1)
        if 'stroke-linecap' in at:
            return m.group(0)
        wm = re.search(r'stroke-width="([\d.]+)"', at)
        if not wm or float(wm.group(1)) < 1.9:
            return m.group(0)
        return '<path' + at + ' stroke-linecap="round" stroke-linejoin="round"/>'

    svg = re.sub(r'<path\b([^>]*?)/>', cap, svg)
    return svg, na, nt


def main(path):
    src = open(path, encoding='utf-8').read()
    out, n_lab, n_arr, n_txt = [], 0, 0, 0
    pos = 0
    for m in re.finditer(r'LESSON\[(\d+)\]=\{', src):
        i = src.find('svg:`', m.end())
        if i < 0:
            continue
        j = src.find('`', i + 5)
        svg = src[i + 5:j]
        new, na, nt = polish(svg)
        if new != svg:
            n_lab += 1
            n_arr += na
            n_txt += nt
        out.append(src[pos:i + 5])
        out.append(new)
        pos = j
    out.append(src[pos:])
    open(path, 'w', encoding='utf-8').write(''.join(out))
    sys.stdout.write('그림 %d장 다듬음 — 축 화살촉 %d개 · 글씨 테두리 %d곳\n' % (n_lab, n_arr, n_txt))


if __name__ == '__main__':
    main(sys.argv[1])
