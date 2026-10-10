# -*- coding: utf-8 -*-
"""적용 해설이 얇은 곳만 모아 «고쳐 쓸 거리» 로 낸다.

뒤쪽 묶음의 관례는 «계산 → 그 계산이 말하는 것 → 흔한 오해» 세 걸음인데,
앞쪽은 계산만 적고 끝나는 것이 많다. 그 자리만 뽑아 한눈에 본다.

사용: python docs/교차검증/dump_why.py src/40-demos.js docs/교차검증/해설고치기 [글자수] [묶음]
"""
import os
import re
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
from audit_lessons import blocks, _span        # noqa: E402
from dump_lessons import plain, one, many      # noqa: E402

try:
    sys.stdout.reconfigure(encoding='utf-8')
except Exception:
    pass


def main(path, outdir, limit=80, size=20):
    src = open(path, encoding='utf-8').read()
    LES = blocks(src, r'LESSON\[(\d+)\]=\{')
    rows = []
    for no, b in sorted(LES.items()):
        ai = b.find('apply:{')
        if ai < 0:
            continue
        seg = b[ai:_span(b, b.index('{', ai)) + 1]
        w = one(seg, 'why:')
        if len(w) >= limit:
            continue
        a = re.search(r'a:\s*(-?[\d.]+)', seg)
        t = re.search(r'tol:\s*([\d.]+)', seg)
        rows.append((no, one(b, 'title:'), one(seg, 'q:'),
                     a.group(1) if a else '?', t.group(1) if t else '?',
                     one(seg, 'hint:'), w))
    os.makedirs(outdir, exist_ok=True)
    for s in range(0, len(rows), size):
        ch = rows[s:s + size]
        out = []
        for no, ti, q, a, t, h, w in ch:
            out.append('### %d · %s\n적용: %s\n답 %s (±%s) · 힌트: %s\n지금 해설(%d자): %s'
                       % (no, ti, q, a, t, h, len(w), w))
        fn = os.path.join(outdir, '%03d_%03d.md' % (ch[0][0], ch[-1][0]))
        open(fn, 'w', encoding='utf-8').write('\n\n'.join(out) + '\n')
    sys.stdout.write('해설이 %d자 미만인 %d종 → %d묶음\n'
                     % (limit, len(rows), -(-len(rows) // size)))


if __name__ == '__main__':
    main(sys.argv[1], sys.argv[2],
         int(sys.argv[3]) if len(sys.argv) > 3 else 80,
         int(sys.argv[4]) if len(sys.argv) > 4 else 20)
