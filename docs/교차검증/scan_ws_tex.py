# -*- coding: utf-8 -*-
"""인쇄용 활동지에 LaTeX 원문이 그대로 찍히는 곳을 센다 — ① 교실 운영의 눈.

화면에서는 글 속의 $…$ 가 texify() 로 수식이 되지만,
활동지는 wsText() 로 태그만 지우고 글자를 그대로 쓴다.
그래서 활동지에는 「$\\sqrt{a+b}$」 가 날것으로 찍힌다 — 학생이 받아 드는 종이다.

활동지가 읽어 가는 자리만 본다:
  제목 · 오늘의 문제 · 화면 안내 · 예상 셋 · 미션 문구와 손으로 · 탐구 질문 셋
  · 기록표 머리 · 힌트 · 적용 문제와 힌트
(적용 해설 why 는 활동지에 넣지 않으므로 세지 않는다)

사용: python docs/교차검증/scan_ws_tex.py src/40-demos.js
"""
import os
import re
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
from audit_lessons import blocks, _span                      # noqa: E402
from dump_lessons import plain                               # noqa: E402

try:
    sys.stdout.reconfigure(encoding='utf-8')
except Exception:
    pass

TEX = re.compile(r'\$[^$]+\$')
Q = r"'((?:[^'\\]|\\.)*)'"
STR = re.compile(Q)


def seg_of(b, key, open_ch='{'):
    i = b.find(key)
    if i < 0:
        return ''
    j = b.index(open_ch, i)
    return b[j:_span(b, j) + 1]


def main(path):
    src = open(path, encoding='utf-8').read()
    LES = blocks(src, r'LESSON\[(\d+)\]=\{')
    rows = []
    for no, b in sorted(LES.items()):
        hit = {}

        def add(where, text):
            for m in TEX.finditer(text or ''):
                hit.setdefault(where, []).append(m.group(0))

        m = re.search(r"title:" + Q, b)
        if m:
            add('제목', m.group(1))

        pb = seg_of(b, 'problem:{')
        for k, nm in (('q:', '오늘의 문제'), ('sit:', '화면 안내')):
            mm = re.search(k + Q, pb)
            if mm:
                add(nm, mm.group(1))

        for s in STR.finditer(seg_of(b, 'predict:{')):
            add('예상', s.group(1))
        for s in STR.finditer(seg_of(b, 'cols:', '[')):
            add('기록표 머리', s.group(1))

        ms = seg_of(b, 'missions:[', '[')
        for mm in re.finditer(r"\{t:" + Q, ms):
            add('미션 문구', mm.group(1))
        for mm in re.finditer(r"hand:" + Q, ms):
            add('손으로', mm.group(1))

        iq = seg_of(b, 'inquiry:{')
        mm = re.search(r"q:\[", iq)
        if mm:
            for s in STR.finditer(seg_of(iq, 'q:[', '[')):
                add('탐구 질문', s.group(1))
        mm = re.search(r"hint:" + Q, iq)
        if mm:
            add('탐구 힌트', mm.group(1))

        ap = seg_of(b, 'apply:{')
        for k, nm in (('q:', '적용 문제'), ('hint:', '적용 힌트')):
            mm = re.search(k + Q, ap)
            if mm:
                add(nm, mm.group(1))

        if hit:
            rows.append((no, hit))

    tot = sum(len(v) for _, h in rows for v in h.values())
    sys.stdout.write('활동지에 LaTeX 원문이 찍히는 곳 — 실험실 %d종 · 토막 %d개\n'
                     % (len(rows), tot))
    for no, h in rows:
        for where, lst in h.items():
            sys.stdout.write('  LAB %3d  %s  %s\n'
                             % (no, where, ' / '.join(plain(x) for x in lst[:4])))
    return 0


if __name__ == '__main__':
    main(sys.argv[1])
