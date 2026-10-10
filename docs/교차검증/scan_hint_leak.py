# -*- coding: utf-8 -*-
"""힌트가 적용 문제의 답을 그대로 알려 주는 곳을 찾는다 — ② 교육과정과 평가의 눈.

적용은 학생이 «혼자 풀어 보는» 자리다. 힌트는 길을 가리켜야 하고, 답을 적어서는 안 된다.
답이 그대로 적혀 있으면 학생은 힌트를 열고 그 수를 옮겨 적는다 — 평가가 사라진다.

무엇을 세는가
  힌트 글에 답과 같은 수가 «독립된 수» 로 들어 있는 곳.
  답을 구하는 중간 계산(예: 314 ÷ 400 = 0.785)은 세지 않는다 — 답 자체와 다른 수다.
  단위나 자릿수 안내에 섞인 작은 수(0·1·2·10·100 처럼 흔한 수)는 오탐이 많아 빼고 센다.

사용: python docs/교차검증/scan_hint_leak.py src/40-demos.js
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
TAG = re.compile(r'</?[A-Za-z][^<>]*>')
# 흔해서 우연히 겹치는 수 — 세지 않는다
COMMON = {0, 1, 2, 3, 4, 5, 10, 100, 1000, 360, 180, 90}


def nums(t):
    out = set()
    for m in re.finditer(r'-?\d+(?:\.\d+)?', t.replace(',', '')):
        try:
            out.add(float(m.group(0)))
        except ValueError:
            pass
    return out


def main(path):
    src = open(path, encoding='utf-8').read()
    LES = blocks(src, r'LESSON\[(\d+)\]=\{')
    leak = []
    n = 0
    for no, b in sorted(LES.items()):
        i = b.find('apply:{')
        if i < 0:
            continue
        j = b.index('{', i)
        seg = b[j:_span(b, j) + 1]
        ma = re.search(r'a:\s*(-?[\d.eE+-]+)', seg)
        mh = re.search(r"hint:" + Q, seg)
        if not ma or not mh:
            continue
        n += 1
        try:
            a = float(ma.group(1))
        except ValueError:
            continue
        if a in COMMON:
            continue
        h = TAG.sub('', mh.group(1))
        if a in nums(h):
            leak.append((no, a, ' '.join(h.split())[:110]))

    sys.stdout.write('힌트가 답을 그대로 적은 곳 — %d곳 (힌트 있는 적용 %d종)\n'
                     % (len(leak), n))
    for no, a, h in leak:
        sys.stdout.write('  LAB %3d  답 %s ‖ %s\n' % (no, a, h))
    return 0


if __name__ == '__main__':
    main(sys.argv[1])
