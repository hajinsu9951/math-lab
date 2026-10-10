# -*- coding: utf-8 -*-
"""학생이 읽는 글에서 분명한 오타·표기 오류를 찾는다 — ② 교육과정과 평가의 눈.

자료는 학생이 그대로 읽고 활동지로 인쇄해 나간다. 맞춤법이 틀린 지시문은
읽다가 걸리고, 교사가 수업 중에 고쳐 읽어야 한다.

«분명히 틀린 것» 만 센다 — 문체나 띄어쓰기 취향은 보지 않는다.
찾는 자리: LESSON 356종과 탐구 노트 350종의 모든 글.

사용: python docs/교차검증/scan_typos.py src/40-demos.js
"""
import os
import re
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
from audit_lessons import blocks                             # noqa: E402

try:
    sys.stdout.reconfigure(encoding='utf-8')
except Exception:
    pass

# (틀린 꼴, 바른 꼴, 설명) — 뜻이 분명히 어긋나는 것만 모았다
BAD = [
    (r'며 배', '몇 배', '「며」는 「몇」의 오타'),
    (r'며 개', '몇 개', '「며」는 「몇」의 오타'),
    (r'며 번', '몇 번', '「며」는 「몇」의 오타'),
    (r'갯수', '개수', '한글 맞춤법'),
    (r'몇분의', '몇 분의', '띄어쓰기'),
    (r'되요', '돼요', '한글 맞춤법'),
    (r'됬', '됐', '한글 맞춤법'),
    (r'틀리다면', '다르다면', '「틀리다」와 「다르다」 혼동'),
    (r'틀린 값이 아니라 다른', '다른 값', '「틀리다」와 「다르다」 혼동'),
    (r'로써', '로서', '자격을 뜻할 때'),
    (r'있읍', '있습', '옛 표기'),
    (r'(?<![가-힣])율(?=[을를이가])', '률', '받침 뒤에서는 「률」'),
]
# 띄어쓰기·공백은 보지 않는다 — 태그를 지우면 저절로 생기고, 화면에서는 보이지 않는다.

Q = re.compile(r"'((?:[^'\\]|\\.)*)'|`((?:[^`\\]|\\.)*)`")
TAG = re.compile(r'</?[A-Za-z][^<>]*>')
KO = re.compile(r'[가-힣]')


def main(path):
    src = open(path, encoding='utf-8').read()
    LES = blocks(src, r'LESSON\[(\d+)\]=\{')
    NOT = blocks(src, r'\n (\d+):\{ h:')
    hits = []
    for who, book in (('수업', LES), ('노트', NOT)):
        for no, b in sorted(book.items()):
            for m in Q.finditer(b):
                t = m.group(1) if m.group(1) is not None else m.group(2)
                if not t or not KO.search(t):
                    continue
                t = TAG.sub('', t)
                if 'base64' in t:
                    continue
                for pat, good, why in BAD:
                    for mm in re.finditer(pat, t):
                        a = max(0, mm.start() - 28)
                        hits.append((no, who, good, why,
                                     ' '.join(t[a:mm.end() + 24].split())))
    sys.stdout.write('분명한 오타·표기 오류 — %d곳\n' % len(hits))
    for no, who, good, why, ctx in hits:
        sys.stdout.write('  LAB %3d %s  → %s (%s)  ‖ …%s…\n'
                         % (no, who, good, why, ctx))
    return 0


if __name__ == '__main__':
    main(sys.argv[1])
