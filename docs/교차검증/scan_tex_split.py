# -*- coding: utf-8 -*-
"""한 덩어리여야 할 식이 둘로 쪼개져 보이는 곳을 찾는다.

texify 가 식 토막을 $…$ 로 감쌀 때, 한 등식의 가운데에서 끊어지는 일이 있다.
  보기) $(√a + √b)^{2} = a + b$ + 2$\\sqrt{ab}$
읽히기는 해도 식 한 줄이 둘로 쪼개져 보인다. 두 수식 사이가 연산 기호뿐인 곳을 센다.
"""
import io, os, re, sys

sys.stdout.reconfigure(encoding='utf-8')
ROOT = (r'X:\이것저것\수학관련\2026_AI+수업 우수사례+데이터 리터러시'
        r'\2026_대전교육청_인공지능 연수 설계안 개발 연구회\math-lab')
os.chdir(ROOT)
sys.path.insert(0, os.path.join(ROOT, 'docs', '교차검증'))
from audit_lessons import blocks        # noqa: E402

STR = re.compile(r"'((?:[^'\\]|\\.)*)'")
# $…$  사이가 연산 기호·숫자·공백뿐이면 한 식이 쪼개진 것이다
GAP = re.compile(r'\$[^$]{1,120}\$([ ]*[-+×÷=−·/][ ]*[0-9]*[ ]*)\$[^$]{1,120}\$')

s = io.open('src/40-demos.js', encoding='utf-8').read()
LES = blocks(s, r'LESSON\[(\d+)\]=\{')
NOT = blocks(s, r'\n (\d+):\{ h:')
hits = []
for src, who in ((LES, '수업'), (NOT, '노트')):
    for no, b in sorted(src.items()):
        for m in STR.finditer(b):
            t = m.group(1)
            for g in GAP.finditer(t):
                hits.append((no, who, g.group(0)[:96]))

sys.stdout.write('식이 둘로 쪼개져 보이는 곳 %d곳\n' % len(hits))
seen = set()
for no, who, t in hits:
    if no in seen:
        continue
    seen.add(no)
    sys.stdout.write('  LAB %3d %s  %s\n' % (no, who, ' '.join(t.split())))
sys.stdout.write('— 실험실 %d종\n' % len(seen))
