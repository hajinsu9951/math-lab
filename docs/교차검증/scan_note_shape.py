# -*- coding: utf-8 -*-
"""탐구 노트의 짜임을 점검한다 — ② 교육과정과 평가의 눈.

이 자료의 노트는 **기록 → 생각 → 판단** 세 걸음으로 설계되어 있다.
  기록 — 화면에서 읽은 값을 그대로 옮긴다 (관찰)
  생각 — 그 값으로 손으로 계산한다 (적용)
  판단 — 조건을 바꿔 보고 보기 셋에서 고른다 (해석)
걸음이 어긋나면 «읽고 끝» 이나 «계산 없이 고르기» 가 되어 평가의 뜻이 달라진다.

무엇을 세는가
  · 칸 수가 셋이 아닌 곳
  · 칸의 머리말이 기록·생각·판단 차례가 아닌 곳
  · 마지막 칸에 보기(opts)가 없는 곳 — 판단할 거리가 없다
  · 보기가 셋이 아닌 곳
  · 정답이 첫 줄이 아닌 곳 (관례는 opts[0] 이 정답, chk 가 pick!==0)

사용: python docs/교차검증/scan_note_shape.py src/40-demos.js
"""
import os
import re
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
from audit_lessons import blocks, _span                      # noqa: E402

try:
    sys.stdout.reconfigure(encoding='utf-8')
except Exception:
    pass

Q = r"'((?:[^'\\]|\\.)*)'"
STEP = ['기록', '생각', '판단', '정리']


def main(path):
    src = open(path, encoding='utf-8').read()
    NOT = blocks(src, r'\n (\d+):\{ h:')
    ncard, order, noopt, nopt3, pick = [], [], [], [], []
    for no, b in sorted(NOT.items()):
        i = b.find('c:[')
        if i < 0:
            continue
        a = b.index('[', i)
        seg = b[a:_span(b, a) + 1]
        ts = [m.group(1) for m in re.finditer(r"\bt:" + Q, seg)]
        if len(ts) != 3:
            ncard.append((no, len(ts)))
        for k, t in enumerate(ts):
            want = STEP[k % 4]
            if not t.startswith(want):
                order.append((no, k + 1, want, ' '.join(t.split())[:40]))
        # 보기
        opts = list(re.finditer(r'opts:\[', seg))
        if not opts:
            noopt.append(no)
        else:
            last = opts[-1]
            j = seg.index('[', last.start())
            osg = seg[j:_span(seg, j) + 1]
            cnt = len(re.findall(Q, osg))
            if cnt != 3:
                nopt3.append((no, cnt))
        for m in re.finditer(r'pick\s*!==\s*(\d+)', seg):
            if m.group(1) != '0':
                pick.append((no, m.group(1)))

    sys.stdout.write('탐구 노트 짜임 점검 — 노트 %d종\n' % len(NOT))
    sys.stdout.write('  칸이 셋이 아닌 곳 %d곳 %s\n'
                     % (len(ncard), ' '.join('LAB%d(%d칸)' % x for x in ncard[:12])))
    sys.stdout.write('  기록·생각·판단 차례가 아닌 곳 %d곳\n' % len(order))
    for no, k, want, t in order[:14]:
        sys.stdout.write('    LAB %3d  %d번째 칸이 「%s」 로 시작하지 않음 — %s\n'
                         % (no, k, want, t))
    sys.stdout.write('  마지막 칸에 보기가 없는 곳 %d곳 %s\n'
                     % (len(noopt), ' '.join('LAB%d' % x for x in noopt[:12])))
    sys.stdout.write('  보기가 셋이 아닌 곳 %d곳 %s\n'
                     % (len(nopt3), ' '.join('LAB%d(%d개)' % x for x in nopt3[:12])))
    sys.stdout.write('  정답이 첫 줄이 아닌 곳 %d곳 %s\n'
                     % (len(pick), ' '.join('LAB%d(pick!==%s)' % x for x in pick[:12])))
    return 0


if __name__ == '__main__':
    main(sys.argv[1])
