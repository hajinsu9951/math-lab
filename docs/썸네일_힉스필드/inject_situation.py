# -*- coding: utf-8 -*-
"""상황삽화/{LAB번호}.webp 를 base64 로 index.html 에 넣는다 (SITU_BLOCK).

  사용: python inject_situation.py <index.html>

「오늘의 문제」 카드가 SITU[LAB번호] 를 찾아 쓴다. 없는 실험실은 예전처럼 글만 나온다.
inject.py(썸네일) 를 돌린 뒤에 돌려도 되고 먼저 돌려도 된다 — 서로 건드리는 곳이 다르다.
"""
import base64
import io
import os
import re
import sys

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8")

H = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.join(H, "상황삽화")
IDX = sys.argv[1]

h = open(IDX, encoding="utf-8").read()
h = re.sub(r"\n/\* SITU start \*/.*?/\* SITU end \*/\n", "\n", h, flags=re.S)

parts = []
if os.path.isdir(SRC):
    for name in sorted(os.listdir(SRC)):
        if not name.endswith(".webp"):
            continue
        lab = name[:-5]
        if not lab.isdigit():
            continue
        b = base64.b64encode(open(os.path.join(SRC, name), "rb").read()).decode()
        parts.append(f"{lab}:'data:image/webp;base64,{b}'")

blk = ("\n/* SITU start */\n"
       "/* 힉스필드 생성 상황 삽화 — 「오늘의 문제」 카드에 글과 나란히 실린다. */\n"
       "const SITU={" + ",".join(parts) + "};\n"
       "/* SITU end */\n")

# THUMBS 배열이 끝나는 자리 바로 뒤에 둔다 — 실험실을 그리는 코드보다 먼저 정의되어야 한다.
i0 = h.find("THUMBS = [")
assert i0 > 0, "THUMBS 배열을 찾지 못했습니다"
j = h.find("\n];", i0)
assert j > 0
h = h[:j + 3] + blk + h[j + 3:]

open(IDX, "w", encoding="utf-8").write(h)
print(f"삽화 {len(parts)}장 주입 — {os.path.basename(IDX)} "
      f"{round(len(h.encode('utf-8')) / 1048576, 2)} MB")
