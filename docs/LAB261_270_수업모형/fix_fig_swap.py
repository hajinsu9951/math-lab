# -*- coding: utf-8 -*-
"""figs.py 를 고친 뒤, 이미 들어간 「오늘의 문제」 그림만 새로 그려 바꿔 끼운다.

왜
  patch_lab261_270.py 는 한 번만 넣는다. 그림을 고쳤을 때 전체를 다시 넣을 수는 없으므로
  LESSON[n].problem.svg 안쪽만 새로 계산한 그림으로 갈아 끼운다. 여러 번 돌려도 같다.
사용: python docs/LAB261_270_수업모형/fix_fig_swap.py src/40-demos.js 267 [268 …]
"""
import importlib.util, io, os, sys
sys.stdout.reconfigure(encoding='utf-8')

HERE = os.path.dirname(os.path.abspath(__file__))
spec = importlib.util.spec_from_file_location('figs', os.path.join(HERE, 'figs.py'))
FG = importlib.util.module_from_spec(spec)
spec.loader.exec_module(FG)
BY_LAB = {261 + i: fn for i, (nm, fn) in enumerate(FG.FNS)}

path, labs = sys.argv[1], [int(x) for x in sys.argv[2:]]
s = io.open(path, encoding='utf-8').read()
for no in labs:
    i = s.index('LESSON[%d]={' % no)
    j = s.index('svg:`', i)
    k = s.index('`', j + 5)
    body = s[j:k]
    a = body.index('>') + 1                      # <svg …> 여는 꼬리표 뒤
    b = body.rindex('</svg>')
    s = s[:j] + body[:a] + '\n    ' + BY_LAB[no]() + '\n  ' + body[b:] + s[k:]
    sys.stdout.write('LAB %d 그림 새로 그림\n' % no)
io.open(path, 'w', encoding='utf-8').write(s)
