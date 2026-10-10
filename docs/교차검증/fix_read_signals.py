# -*- coding: utf-8 -*-
"""판정 낱말이 read() 안에만 있어 영원히 안 열리던 미션 신호를 고친다 — ① 교실 운영.

무엇이 잘못됐나
  사다리는 «실험 화면(#lsLab)» 의 글에서 신호를 찾는다. 그런데 아홉 종의 신호가
  inquiry 의 read() 가 돌려주는 판정 낱말(「된다」·「맞다」·「없음」…) 이었다.
  수업 모형은 inquiry() 를 «기록·발견» 단계(#lsInq) 에 붙이므로 그 낱말은 실험 화면에
  나오지 않는다. 데모가 직접 화면에 쓰는 문구로 바꿔야 한다.

  (단독 실험실 모드에서는 inquiry 가 데모 옆에 붙어 있어 지금까지 작동했다.
   수업 모형으로 옮겨 오면서 생긴 자리 옮김을 신호가 따라오지 못한 것이다.)

어떻게 고치나
  데모가 그 상태에서 실제로 내놓는 문장을 신호로 쓴다 — 아래 표는 모두 소스에서 확인했다.
  고친 뒤 docs/교차검증/scan_signal_source.py 가 0종이어야 한다.

사용: python docs/교차검증/fix_read_signals.py src/40-demos.js
"""
import io
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

# (실험실, 미션 번호, 지금 신호, 새 신호) — 새 신호는 그 상태에서 데모가 화면에 쓰는 글이다
FIX = [
    (28, 1, '유지', '지금까지 한 일'),
    (31, 1, '맞다', '합동 조건입니다'),
    (31, 2, '아니다', '삼각형이 두 개 나왔습니다'),
    (36, 1, '된다', '삼각형이 됩니다'),
    (36, 2, '안 된다', '안 됩니다'),
    (37, 2, '안 된다', '못 채웁니다'),
    (68, 1, '된다', '오므라들 수 있습니다'),
    (80, 1, '맞다', '평행사변형입니다'),
    (80, 2, '아니다', '사다리꼴입니다'),
    (101, 1, '다르다', '곱의 순서가 결과를 바꿉니다'),
    (101, 2, '같다', '순서를 바꿔도 같습니다'),
    (118, 2, '없음', '해가 없습니다'),
    (127, 2, '있음', '극한이 있고'),
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
        if len(ms) < k:
            raise AssertionError('LAB %d — 신호가 %d개뿐' % (no, len(ms)))
        m = ms[k - 1]
        if m.group(1) == new:
            continue                                    # 이미 고쳐져 있다
        assert m.group(1) == old, (no, k, m.group(1))
        seg2 = seg[:m.start(1)] + new + seg[m.end(1):]
        src = src[:a] + seg2 + src[b + 1:]
        done += 1
    io.open(path, 'w', encoding='utf-8').write(src)
    sys.stdout.write('read() 안에만 있던 신호 %d개를 화면 문구로 바꿨습니다\n' % done)
    return 0


if __name__ == '__main__':
    main(sys.argv[1])
