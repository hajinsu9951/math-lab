# -*- coding: utf-8 -*-
"""LAB 211~220 — 7단계 수업 모형 + 탐구 노트.

그림은 figs.py, 본문은 lessons.py, 탐구 노트는 notes.py 에 나누어 두었다.
사용: python docs/LAB211_220_수업모형/patch_lab211_220.py src/40-demos.js
"""
import importlib.util, os, sys

try:
    sys.stdout.reconfigure(encoding='utf-8')
except Exception:
    pass

HERE = os.path.dirname(os.path.abspath(__file__))


def load(name):
    s = importlib.util.spec_from_file_location(name, os.path.join(HERE, name + '.py'))
    m = importlib.util.module_from_spec(s)
    s.loader.exec_module(m)
    return m


FG, LS, NT = load('figs'), load('lessons'), load('notes')


def main(path):
    h = open(path, encoding='utf-8').read()
    if 'LESSON[211]=' in h:
        sys.stdout.write('이미 반영됨\n')
        return
    L = LS.LESSONS
    for nm, fn in FG.FNS:
        tag = '__%s__' % nm.upper()
        assert L.count(tag) == 1, tag
        L = L.replace(tag, fn(), 1)
    a = 'LESSON[356]={'
    assert h.count(a) == 1
    h = h.replace(a, L + a, 1)
    b = '\n};\n\nfunction labNo(spec)'
    assert h.count(b) == 1
    h = h.replace(b, NT.NOTES + b, 1)
    open(path, 'w', encoding='utf-8').write(h)
    sys.stdout.write('LAB 211~220 ok %.2f MB\n' % (len(h.encode('utf-8')) / 1048576))


if __name__ == '__main__':
    main(sys.argv[1])
