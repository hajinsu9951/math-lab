# -*- coding: utf-8 -*-
"""적용 문제가 «어떻게 답을 적을지» 를 말해 주는지 본다 — ② 교육과정과 평가의 눈.

적용은 기계가 채점한다. 답이 소수인데 문제가 자릿수를 말해 주지 않으면
학생은 3.1 이라 적고 틀렸다는 말을 듣는다 — 수학을 틀린 것이 아니라 «적는 법» 을 모른 것이다.
그래서 답이 정수가 아닌 문제에는 반드시 「소수 첫째 자리까지」 같은 안내가 있어야 한다.

무엇을 세는가
  **학생이 소수 둘째 자리까지 적어도 통과되지 않는데** 자릿수 안내가 없는 곳.
  즉 |답 − 답을 둘째 자리에서 반올림한 값| 이 허용오차보다 크면, 셋째 자리 이상을
  적어야 한다는 뜻이므로 문제가 그것을 말해 주어야 한다.
  0.5·0.25·37.5 처럼 끝이 딱 떨어지는 답은 학생이 그대로 적으면 되므로 세지 않는다.
  0.001 보다 작은 답도 세지 않는다 — 그런 수는 자릿수가 아니라 «앞의 두 자리» 로 적는다.

사용: python docs/교차검증/scan_apply_round.py src/40-demos.js
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

TAG = re.compile(r'</?[A-Za-z][^<>]*>')
SAYS = ('소수', '자리', '정수', '반올림', '분수', '꼴로', '까지')


def main(path):
    src = open(path, encoding='utf-8').read()
    LES = blocks(src, r'LESSON\[(\d+)\]=\{')
    bad = []
    frac = 0
    for no, b in sorted(LES.items()):
        i = b.find('apply:{')
        if i < 0:
            continue
        j = b.index('{', i)
        seg = b[j:_span(b, j) + 1]
        ma = re.search(r'a:\s*(-?[\d.eE+-]+)', seg)
        mt = re.search(r'tol:\s*(-?[\d.eE+-]+)', seg)
        mq = re.search(r"q:\s*(?:'((?:[^'\\]|\\.)*)'|`((?:[^`\\]|\\.)*)`)", seg)
        if not ma or not mq or not mt:
            continue
        try:
            a, t = float(ma.group(1)), abs(float(mt.group(1)))
        except ValueError:
            continue
        if a == int(a):
            continue
        frac += 1
        # 아주 작은 답은 자릿수로 재지 않는다 — 학생은 «앞의 두 자리» 로 적는다
        if abs(a) < 0.01:
            continue
        # 소수 둘째 자리까지 적어도 통과되면 안내가 없어도 괜찮다
        if abs(a - round(a, 2)) <= t:
            continue
        q = TAG.sub('', mq.group(1) if mq.group(1) is not None else mq.group(2))
        if not any(w in q for w in SAYS):
            bad.append((no, a, t, ' '.join(q.split())[-92:]))

    sys.stdout.write('적용 답이 소수인 문제 %d종 · 셋째 자리까지 적어야 하는데 안내가 없는 곳 %d곳\n'
                     % (frac, len(bad)))
    for no, a, t, q in bad:
        sys.stdout.write('  LAB %3d  답 %s (±%s) ‖ …%s\n' % (no, a, t, q))
    return 0


if __name__ == '__main__':
    main(sys.argv[1])
