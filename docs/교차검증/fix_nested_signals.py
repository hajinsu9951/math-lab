# -*- coding: utf-8 -*-
"""한 신호가 다른 신호를 품고 있어 두 단이 한꺼번에 열리던 곳을 고친다 — ① 교실 운영.

무엇이 잘못됐나
  LAB 74 는 미션 1 의 신호가 「k」, 미션 2 가 「kb」 였다. 「k」 는 「kb」 안에 들어 있으므로
  음수 k 를 먼저 만들면 미션 1 까지 함께 통과된다 — «양수로 먼저 해 본다» 가 건너뛰어진다.
  LAB 118 은 미션 1 이 「해」, 미션 2 가 「해가 없습니다」 로 같은 꼴이었다.

어떻게 고치나
  그 상태에서만 나오는 문장으로 갈라 적는다. 데모의 출력문에서 확인한 글이다.
    LAB 74  양수 배 → 「순서 유지」 · 음수 배 → 「순서가 뒤집혔습니다」
    LAB 118 해가 둘 → 「한 바퀴 안의 해」 · |k| > 1 → 「해가 없습니다」(그대로)

사용: python docs/교차검증/fix_nested_signals.py src/40-demos.js
"""
import io
import os
import re
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
from audit_lessons import _span                              # noqa: E402

try:
    sys.stdout.reconfigure(encoding='utf-8')
except Exception:
    pass

FIX = [
    (74, 1, 'k', '순서 유지'),
    (74, 2, 'kb', '순서가 뒤집혔습니다'),
    (118, 1, '해', '한 바퀴 안의 해'),
]

Q = r"re:'((?:[^'\\]|\\.)*)'"


def main(path):
    src = io.open(path, encoding='utf-8').read()
    done = 0
    for no, k, old, new in FIX:
        i = src.index('LESSON[%d]={' % no)
        j = src.index('missions:[', i)
        a = src.index('[', j)
        b = _span(src, a)
        seg = src[a:b + 1]
        ms = list(re.finditer(Q, seg))
        m = ms[k - 1]
        if m.group(1) == new:
            continue
        assert m.group(1) == old, (no, k, m.group(1))
        src = src[:a] + seg[:m.start(1)] + new + seg[m.end(1):] + src[b + 1:]
        done += 1
    io.open(path, 'w', encoding='utf-8').write(src)
    sys.stdout.write('서로를 품고 있던 신호 %d개를 갈라 적었습니다\n' % done)
    return 0


if __name__ == '__main__':
    main(sys.argv[1])
