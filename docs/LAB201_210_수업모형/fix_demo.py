# -*- coding: utf-8 -*-
"""LAB 201~210 실험 화면의 틀린 안내 문구를 바로잡는다.

taxBracketDemo
  「경계를 100만원 넘겼는데 세금은 15만원만 늘었습니다」 — 틀렸다.
  5000만원 경계를 넘은 100만원에는 24% 가 붙으므로 24만원이 늘어난다.
  15만원은 15% 구간의 세율로 잘못 센 수다. 누진세의 핵심을 가르치는 문장이
  틀린 수를 말하고 있어, 화면 값에서 직접 빼서 말하도록 바꾼다.

사용: python docs/LAB201_210_수업모형/fix_demo.py src/40-demos.js
"""
import sys

try:
    sys.stdout.reconfigure(encoding='utf-8')
except Exception:
    pass

OLD = '경계를 100만원 넘겼는데 세금은 15만원만 늘었습니다'
NEW = ('경계를 100만원 넘겼는데 세금은 ${(r.tax - calc(5000).tax).toFixed(0)}만원만 '
       '늘었습니다')


def main(path):
    h = open(path, encoding='utf-8').read()
    if NEW in h:
        sys.stdout.write('이미 반영됨\n')
        return
    assert h.count(OLD) == 1, '앵커가 %d곳 — 멈춘다' % h.count(OLD)
    h = h.replace(OLD, NEW, 1)
    open(path, 'w', encoding='utf-8').write(h)
    sys.stdout.write('taxBracketDemo 경계 안내문 교정 — 15만원 → 화면에서 뺀 값(24만원)\n')


if __name__ == '__main__':
    main(sys.argv[1])
