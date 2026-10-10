# -*- coding: utf-8 -*-
"""미션 달성 신호가 너무 짧거나 서로 겹치지 않는지 센다 — ① 교실 운영의 눈.

왜
  미션은 화면에 그 신호 글이 나타나면 달성으로 친다. 신호가 「나눠」 처럼 짧으면
  다른 안내문에 우연히 섞여 들어 **하지도 않은 미션이 저절로 열릴** 수 있다.
  또 한 신호가 다른 신호를 품고 있으면 미션 1 을 하자마자 미션 2 까지 켜진다.

무엇을 세는가
  · 신호가 너무 짧은 곳 (한글 네 글자 미만)
  · 같은 실험실 안에서 한 신호가 다른 신호의 부분이 되는 곳
  · 그 신호가 같은 실험실의 «다른 미션 지시문» 안에 들어 있는 곳

사용: python docs/교차검증/scan_signal_len.py src/40-demos.js
"""
import os
import re
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
from audit_lessons import blocks, _span        # noqa: E402

try:
    sys.stdout.reconfigure(encoding='utf-8')
except Exception:
    pass

MIN = 4


def main(path):
    src = open(path, encoding='utf-8').read()
    LES = blocks(src, r'LESSON\[(\d+)\]=\{')
    short, nest = [], []
    for no, b in sorted(LES.items()):
        i = b.find('missions:[')
        if i < 0:
            continue
        j = b.index('[', i)
        seg = b[j:_span(b, j) + 1]
        sig = [m.group(1) for m in re.finditer(r"re:'((?:[^'\\]|\\.)*)'", seg)]
        sig = [s for s in sig if s != '탐구 노트 통과']
        for s in sig:
            if len(s.replace(' ', '')) < MIN:
                short.append((no, s))
        for a in sig:
            for c in sig:
                if a is not c and a in c:
                    nest.append((no, a, c))
    sys.stdout.write('미션 달성 신호 점검 — 짧은 신호 %d곳 · 겹치는 신호 %d곳\n'
                     % (len(short), len(nest)))
    for no, s in short:
        sys.stdout.write('  LAB %3d  짧음 「%s」 (%d자)\n' % (no, s, len(s.replace(' ', ''))))
    for no, a, c in nest:
        sys.stdout.write('  LAB %3d  겹침 「%s」 ⊂ 「%s」\n' % (no, a, c))
    return 0


if __name__ == '__main__':
    main(sys.argv[1])
