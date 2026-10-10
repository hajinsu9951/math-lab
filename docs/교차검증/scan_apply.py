# -*- coding: utf-8 -*-
"""적용 문제의 «채점» 을 점검한다 — ② 교육과정과 평가의 눈.

적용은 이 자료에서 유일하게 «맞다/틀리다» 를 기계가 판정하는 자리다.
그래서 답(a)과 허용오차(tol)가 교육적으로 말이 되어야 한다.

무엇을 세는가
  · 허용오차가 없거나 0 인 곳 — 소수 답이면 사실상 맞출 수 없다
  · 허용오차가 답에 비해 너무 넓은 곳 — 아무 수나 넣어도 통과된다 (|tol| ≥ |a| × 0.5)
  · 답이 0 인데 허용오차가 큰 곳 — 부호만 맞으면 통과된다
  · 적용 문제에 글이 없고 그림뿐인 곳 — 활동지·낭독·검색에서 문제가 사라진다
  · 「새 문제」 라고 밝히지 않은 곳 — 화면의 수와 다른 수를 쓰면 학생이 혼동한다

사용: python docs/교차검증/scan_apply.py src/40-demos.js
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
NUM = re.compile(r'-?\d+(?:\.\d+)?(?:[eE][-+]?\d+)?')


def main(path):
    src = open(path, encoding='utf-8').read()
    LES = blocks(src, r'LESSON\[(\d+)\]=\{')
    notol, wide, noq, nonew = [], [], [], []
    n = 0
    for no, b in sorted(LES.items()):
        i = b.find('apply:{')
        if i < 0:
            continue
        j = b.index('{', i)
        seg = b[j:_span(b, j) + 1]
        n += 1

        # 작은따옴표와 백틱을 모두 읽는다 — LAB 1·2·3·21 의 적용 문제는 백틱으로 적혀 있다
        mq = re.search(r"q:\s*(?:'((?:[^'\\]|\\.)*)'|`((?:[^`\\]|\\.)*)`)", seg)
        q = (mq.group(1) if mq and mq.group(1) is not None
             else (mq.group(2) if mq else ''))
        text = TAG.sub('', q).replace('&nbsp;', ' ').strip()
        if not text:
            noq.append(no)
        elif '새 문제' not in text:
            nonew.append(no)

        ma = re.search(r'a:\s*(-?[\d.eE+-]+)', seg)
        mt = re.search(r'tol:\s*(-?[\d.eE+-]+)', seg)
        if not ma:
            continue
        try:
            a = float(ma.group(1))
        except ValueError:
            continue
        if not mt:
            notol.append((no, a, None))
            continue
        try:
            t = float(mt.group(1))
        except ValueError:
            continue
        if t == 0 and a != int(a):
            notol.append((no, a, t))
        elif a != 0 and abs(t) >= abs(a) * 0.5:
            wide.append((no, a, t))
        elif a == 0 and abs(t) > 1:
            wide.append((no, a, t))

    sys.stdout.write('적용 채점 점검 — 적용 %d종\n' % n)
    sys.stdout.write('  허용오차가 없거나 0 인데 답이 소수: %d곳 %s\n'
                     % (len(notol), ' '.join('LAB%d(%s)' % (x[0], x[1]) for x in notol[:12])))
    sys.stdout.write('  허용오차가 답의 절반 이상: %d곳\n' % len(wide))
    for no, a, t in wide:
        sys.stdout.write('    LAB %3d  답 %s · 허용 ±%s\n' % (no, a, t))
    sys.stdout.write('  적용 문제에 글이 없고 그림뿐: %d곳 %s\n'
                     % (len(noq), ' '.join('LAB%d' % x for x in noq)))
    sys.stdout.write('  「새 문제」 라고 밝히지 않은 곳: %d곳 %s\n'
                     % (len(nonew), ' '.join('LAB%d' % x for x in nonew[:20])))
    return 0


if __name__ == '__main__':
    main(sys.argv[1])
