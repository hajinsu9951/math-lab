# -*- coding: utf-8 -*-
"""한 원고를 «세 사람이 각자 볼 것» 으로 갈라 낸다 — 교차 검증의 분담표다.

세 사람이 같은 글을 세 번 읽으면 서로의 눈에 물든다. 그래서 각자 맡은 것만 본다.
  ① 교실 운영(중등 교사)  — 제목 · 화면 안내 · 미션 셋과 달성 신호 · 해볼 것 · 손으로 쓸 것
  ② 교육과정과 평가(고교 교사) — 제목 · 적용 문제와 답·허용오차·힌트 · 기록표 · 노트 세 칸의 지시
  ③ 수학적 엄밀성(교수)     — 제목 · 오늘의 문제 · 탐구 질문 셋 · 적용 해설 · 노트의 판단 보기 셋

사용: python docs/교차검증/dump_views.py src/40-demos.js docs/교차검증 [묶음크기]
"""
import os
import re
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
from audit_lessons import blocks, _span        # noqa: E402
from dump_lessons import plain, one, many, joined      # noqa: E402

try:
    sys.stdout.reconfigure(encoding='utf-8')
except Exception:
    pass


def mission_seg(b):
    i = b.find('missions:[')
    if i < 0:
        return ''
    j = b.index('[', i)
    return b[j:_span(b, j) + 1]


def view_a(no, b, nb):
    """① 교실에서 돌리는 사람의 눈."""
    L = ['### %d · %s' % (no, one(b, 'title:'))]
    L.append('화면: ' + one(b, 'sit:')[:220])
    seg = mission_seg(b)
    ts = [plain(m.group(1)) for m in re.finditer(r"\{t:'((?:[^'\\]|\\.)*)'", seg)]
    rs = [plain(m.group(1)) for m in re.finditer(r"re:'((?:[^'\\]|\\.)*)'", seg)]
    for i, t in enumerate(ts):
        L.append('M%d: %s' % (i + 1, t))
        if i < len(rs):
            L.append('   신호 「%s」' % rs[i])
    for k, nm in (('do:', '해볼 것'), ('hand:', '손으로')):
        v = one(seg, k)
        if v:
            L.append('%s: %s' % (nm, v))
    return '\n'.join(L)


def view_b(no, b, nb):
    """② 교육과정과 평가의 눈."""
    L = ['### %d · %s' % (no, one(b, 'title:'))]
    cols = many(b, 'cols:')
    if cols:
        L.append('기록표: ' + ' | '.join(cols))
    ai = b.find('apply:{')
    if ai >= 0:
        seg = b[ai:_span(b, b.index('{', ai)) + 1]
        a = re.search(r'a:\s*(-?[\d.]+)', seg)
        t = re.search(r'tol:\s*([\d.]+)', seg)
        L.append('적용: ' + one(seg, 'q:'))
        L.append('답 %s (±%s) / 힌트: %s' % (a.group(1) if a else '?',
                                              t.group(1) if t else '?', one(seg, 'hint:')))
    if nb:
        for i, m in enumerate(re.finditer(r"\{t:'((?:[^'\\]|\\.)*)'", nb)):
            L.append('노트%d: %s' % (i + 1, plain(m.group(1))))
        for m in re.finditer(r"f:'((?:[^'\\]|\\.)*)'", nb):
            L.append('   칸: ' + plain(m.group(1)))
    else:
        L.append('노트: 없음')
    return '\n'.join(L)


def view_c(no, b, nb):
    """③ 수학적 엄밀성의 눈."""
    L = ['### %d · %s' % (no, one(b, 'title:'))]
    L.append('문제: ' + one(b, 'q:'))
    iq = many(b, 'inquiry:{')
    for i, t in enumerate((iq[2:5] if len(iq) > 4 else iq)[:3]):
        L.append('탐구%d: %s' % (i + 1, t))
    ai = b.find('apply:{')
    if ai >= 0:
        seg = b[ai:_span(b, b.index('{', ai)) + 1]
        L.append('해설: ' + one(seg, 'why:'))
    if nb:
        op = many(nb, 'opts:')
        if op:
            k = re.search(r'pick!==(\d)', nb)          # 정답 보기의 자리는 chk 가 정한다
            k = int(k.group(1)) if k else 0
            for i, t in enumerate(op[:3]):
                L.append(('정답 보기: ' if i == k else '오답 보기: ') + t)
        m = re.search(r"msg:'판단했습니다 — ", nb)
        if m:
            seg = nb[m.end():m.end() + 700]
            e = seg.find(chr(39) + '}')
            L.append('마무리: ' + plain(joined(seg[:e] if e > 0 else seg)))
    return '\n'.join(L)


VIEWS = (('가_교실운영', view_a), ('나_교육과정평가', view_b), ('다_수학엄밀성', view_c))


def main(path, root, size=30):
    src = open(path, encoding='utf-8').read()
    LES = blocks(src, r'LESSON\[(\d+)\]=\{')
    NOT = blocks(src, r'\n (\d+):\{ h:')
    nos = sorted(LES)
    for name, fn in VIEWS:
        d = os.path.join(root, name)
        os.makedirs(d, exist_ok=True)
        for s in range(0, len(nos), size):
            ch = nos[s:s + size]
            body = '\n\n'.join(fn(n, LES[n], NOT.get(n)) for n in ch)
            open(os.path.join(d, '%03d_%03d.md' % (ch[0], ch[-1])), 'w',
                 encoding='utf-8').write(body + '\n')
        sys.stdout.write('%s · %d묶음\n' % (name, -(-len(nos) // size)))


if __name__ == '__main__':
    main(sys.argv[1], sys.argv[2], int(sys.argv[3]) if len(sys.argv) > 3 else 30)
