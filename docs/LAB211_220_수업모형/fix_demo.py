# -*- coding: utf-8 -*-
"""LAB 214 giniDemo — 완전 평등에서 「-0.0000」 이 뜨던 것을 고친다.

완전 평등이면 로렌츠 곡선 아래 넓이가 정확히 0.5 여야 하는데,
사다리꼴을 다섯 번 더하는 동안 0.5000000000000001 이 되어
지니계수가 -2.2e-16 → 화면에 「-0.0000」 으로 찍혔다.
지니계수는 정의상 0 이상이므로 0 으로 눌러 둔다 (그리는 값·판정은 그대로).

사용: python docs/LAB211_220_수업모형/fix_demo.py src/40-demos.js
"""
import sys

try:
    sys.stdout.reconfigure(encoding='utf-8')
except Exception:
    pass

E = [('    const gini=(0.5-area)/0.5;',
      '    const gini=Math.max(0,(0.5-area)/0.5);   /* 부동소수 탓에 -0.0000 이 찍히던 것을 막는다 */'),
     ('      const g=(0.5-area)/0.5;',
      '      const g=Math.max(0,(0.5-area)/0.5);')]


def main(path):
    h = open(path, encoding='utf-8').read()
    if 'Math.max(0,(0.5-area)/0.5)' in h:
        sys.stdout.write('이미 반영됨\n')
        return
    for a, b in E:
        assert h.count(a) == 1, '앵커가 %d곳 — 멈춘다' % h.count(a)
        h = h.replace(a, b, 1)
    open(path, 'w', encoding='utf-8').write(h)
    sys.stdout.write('giniDemo 교정 — 완전 평등에서 -0.0000 대신 0.0000\n')


if __name__ == '__main__':
    main(sys.argv[1])
