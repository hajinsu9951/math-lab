# -*- coding: utf-8 -*-
"""LAB 270 그림의 음수 부호를 빼기표(−)로 고친다.

왜
  파이썬 %g 는 ASCII 하이픈(-)을 쓴다. 같은 그림 안의 「4ab − c²」 는 빼기표(−)이므로
  한 그림에 두 가지 부호가 섞여 보였다. 교과서 표기에 맞춘다.
사용: python docs/LAB261_270_수업모형/fix_fig_minus.py src/40-demos.js
"""
import io, sys
sys.stdout.reconfigure(encoding='utf-8')

P = sys.argv[1] if len(sys.argv) > 1 else 'src/40-demos.js'
s = io.open(P, encoding='utf-8').read()
E = [('a = 1 · b = -1 · c = 0', 'a = 1 · b = −1 · c = 0'),
     ('4ab − c² = -4 → 안장점', '4ab − c² = −4 → 안장점')]
n = 0
for old, new in E:
    if old in s:
        assert s.count(old) == 1, s.count(old)
        s = s.replace(old, new)
        n += 1
io.open(P, 'w', encoding='utf-8').write(s)
sys.stdout.write('빼기표로 고친 곳 %d\n' % n)
