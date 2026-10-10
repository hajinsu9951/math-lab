# -*- coding: utf-8 -*-
"""화면에서 «삼켜지는» 부등호를 찾는다.

브라우저는 '<' 뒤에 글자·/·!·? 가 오면 태그로 읽는다. 'x<y' 처럼 붙여 쓰면
'<y …>' 까지가 통째로 사라진다. 'c < 5' 처럼 띄어 쓰면 글자 그대로 나온다.
수업 모형의 글 안에서 앞엣것을 모두 찾아낸다.
"""
import io, os, re, sys

sys.stdout.reconfigure(encoding='utf-8')
ROOT = (r'X:\이것저것\수학관련\2026_AI+수업 우수사례+데이터 리터러시'
        r'\2026_대전교육청_인공지능 연수 설계안 개발 연구회\math-lab')
os.chdir(ROOT)
sys.path.insert(0, os.path.join(ROOT, 'docs', '교차검증'))
from audit_lessons import blocks        # noqa: E402

OK = {'b', 'i', 'em', 'strong', 'br', 'span', 'sub', 'sup', 'div', 'p', 'img', 'figure',
      'figcaption', 'svg', 'path', 'text', 'circle', 'rect', 'g', 'line', 'polygon',
      'polyline', 'ul', 'li', 'ol', 'table', 'tr', 'td', 'th', 'small', 'code', 'a',
      'defs', 'marker', 'tspan', 'u', 'h3', 'h4', 'hr', 'input', 'label', 'button', 'select',
      'option', 'canvas', 'textarea', 'th', 'thead', 'tbody'}
PAT = re.compile(r'</?([A-Za-z][A-Za-z0-9]*)')   # 공백 없이 바로 글자일 때만 태그로 읽힌다

s = io.open('src/40-demos.js', encoding='utf-8').read()
LES = blocks(s, r'LESSON\[(\d+)\]=\{')
NOT = blocks(s, r'\n (\d+):\{ h:')
bad = []
for src, who in ((LES, '수업'), (NOT, '노트')):
    for no, b in sorted(src.items()):
        txt = ' '.join(re.findall(r"'((?:[^'\\]|\\.)*)'", b))
        for m in PAT.finditer(txt):
            if m.group(1).lower() not in OK:
                bad.append((no, who, txt[max(0, m.start() - 36):m.start() + 30].replace('\n', ' ')))

sys.stdout.write('태그로 삼켜질 위험이 있는 부등호 %d곳\n' % len(bad))
for no, who, t in bad[:40]:
    sys.stdout.write('  LAB %3d %s  …%s…\n' % (no, who, ' '.join(t.split())))
