# -*- coding: utf-8 -*-
"""수업 모형 356종의 «읽을 거리» 만 뽑아 한 묶음씩 파일로 낸다 — 세 사람이 읽을 원고다.

화면 코드와 그림의 좌표는 빼고, 사람이 판단해야 하는 것만 남긴다.
  제목 · 오늘의 문제 · 상황 안내 · 예상 질문 셋 · 미션 셋(달성 신호 포함)
  · 탐구 질문 셋과 기록표 머리 · 적용(문제·답·허용오차·해설·힌트)
  · 탐구 노트 세 칸의 지시문과 보기

사용: python docs/교차검증/dump_lessons.py src/40-demos.js docs/교차검증/원고 [묶음크기]
"""
import os
import re
import sys

try:
    sys.stdout.reconfigure(encoding='utf-8')
except Exception:
    pass

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
from audit_lessons import blocks, _span          # noqa: E402  같은 자르기를 쓴다

# 진짜 태그만 지운다 — 'c < 5' 같은 부등호를 태그로 오인하면 문장이 통째로 사라진다
TAG = re.compile(r'</?[A-Za-z][^<>]*>')


def plain(t):
    t = TAG.sub('', t)
    t = t.replace('\\n', ' ').replace("\\'", "'").replace('\\"', '"')
    return ' '.join(t.split())



def joined(t):
    """JS 가 이어 붙인 문자열을 사람이 읽을 한 줄로 만든다 — '…'+r[3]+'…' → …〈값〉…"""
    return re.sub(r"'\s*\+[^+]{1,60}\+\s*'", '〈값〉', t)

def one(b, key):
    # 작은따옴표와 백틱을 모두 읽는다 — LAB 1·2·3·21 의 적용 문제는 백틱으로 적혀 있어서
    # 작은따옴표만 찾던 때에는 「적용 문제가 그림뿐」 이라는 잘못된 소견이 나왔다 (2026-10-10).
    m = re.search(r"%s\s*(?:'((?:[^'\\]|\\.)*)'|`((?:[^`\\]|\\.)*)`)" % re.escape(key), b)
    if not m:
        return ''
    return plain(m.group(1) if m.group(1) is not None else m.group(2))


def many(b, key):
    """key 뒤의 대괄호 안에 든 작은따옴표 문자열을 차례로 돌려준다."""
    i = b.find(key)
    if i < 0:
        return []
    i = b.index('[', i)
    seg = b[i:_span(b, i) + 1]
    return [plain(m.group(1)) for m in re.finditer(r"'((?:[^'\\]|\\.)*)'", seg)]


def lesson_text(no, b, nb):
    L = ['### LAB %d — %s' % (no, one(b, 'title:'))]
    L.append('[오늘의 문제] ' + one(b, 'q:'))
    L.append('[화면 안내] ' + one(b, 'sit:'))
    pq = many(b, 'predict:{')
    for i, t in enumerate(pq):
        L.append('[예상 %d] %s' % (i + 1, t))
    mi = b.find('missions:[')
    if mi >= 0:
        seg = b[mi:_span(b, b.index('[', mi)) + mi - mi + b.index('[', mi) - mi + 1] \
            if False else b[b.index('[', mi):_span(b, b.index('[', mi)) + 1]
        for i, m in enumerate(re.finditer(r"\{t:'((?:[^'\\]|\\.)*)'", seg)):
            L.append('[미션 %d] %s' % (i + 1, plain(m.group(1))))
        for m in re.finditer(r"re:'((?:[^'\\]|\\.)*)'", seg):
            L.append('   └ 달성 신호: ' + plain(m.group(1)))
        for k, nm in (('do:', '해볼 것'), ('hand:', '손으로 쓸 것')):
            v = one(seg, k)
            if v:
                L.append('   └ %s: %s' % (nm, v))
    iq = many(b, 'inquiry:{')
    for i, t in enumerate(iq[2:5] if len(iq) > 4 else iq):
        if i < 3:
            L.append('[탐구 %d] %s' % (i + 1, t))
    cols = many(b, 'cols:')
    if cols:
        L.append('[기록표] ' + ' | '.join(cols))
    L.append('[힌트] ' + one(b, 'hint:'))
    ai = b.find('apply:{')
    if ai >= 0:
        seg = b[ai:_span(b, b.index('{', ai)) + 1]
        L.append('[적용] ' + one(seg, 'q:'))
        a = re.search(r'a:\s*(-?[\d.]+)', seg)
        t = re.search(r'tol:\s*([\d.]+)', seg)
        L.append('[적용 답] %s (허용오차 %s)' % (a.group(1) if a else '?',
                                                 t.group(1) if t else '?'))
        L.append('[적용 해설] ' + one(seg, 'why:'))
        L.append('[적용 힌트] ' + one(seg, 'hint:'))
    if nb:
        L.append('[탐구 노트] ' + one(nb, 'h:'))
        for i, m in enumerate(re.finditer(r"\{t:'((?:[^'\\]|\\.)*)'", nb)):
            L.append('  (%d) %s' % (i + 1, plain(m.group(1))))
        for m in re.finditer(r"f:'((?:[^'\\]|\\.)*)'", nb):
            L.append('      빈칸: ' + plain(m.group(1)))
        op = many(nb, 'opts:')
        for i, t in enumerate(op[:3]):
            L.append('      보기%s %s' % ('★' if i == 0 else ' ', t))
    else:
        L.append('[탐구 노트] 없음')
    return '\n'.join(L)


def main(path, outdir, size=20):
    src = open(path, encoding='utf-8').read()
    LES = blocks(src, r'LESSON\[(\d+)\]=\{')
    NOT = blocks(src, r'\n (\d+):\{ h:')
    os.makedirs(outdir, exist_ok=True)
    nos = sorted(LES)
    made = 0
    for s in range(0, len(nos), size):
        chunk = nos[s:s + size]
        body = '\n\n'.join(lesson_text(n, LES[n], NOT.get(n)) for n in chunk)
        fn = os.path.join(outdir, 'LAB%03d_%03d.md' % (chunk[0], chunk[-1]))
        open(fn, 'w', encoding='utf-8').write(body + '\n')
        made += 1
    sys.stdout.write('원고 %d묶음 · 수업 모형 %d종 → %s\n' % (made, len(nos), outdir))


if __name__ == '__main__':
    main(sys.argv[1], sys.argv[2], int(sys.argv[3]) if len(sys.argv) > 3 else 20)
