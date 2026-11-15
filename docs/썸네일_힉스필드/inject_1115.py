# -*- coding: utf-8 -*-
"""카드 그림 덧붙이기 (2026-11-16). webp_1115/{i}.webp 를 HF_THUMBS 블록의 HFT 배열 끝에 덧붙인다.
쓰는 법:  py -3 -X utf8 inject_1115.py <처음 색인> <끝 색인> <파일1> [파일2 ...]
 - 파일은 src\\40-demos.js 와 dist\\index.html 처럼 HF_THUMBS 블록이 든 파일. 두 파일에 같은 글자를 넣는다.
 - 이미 그 색인이 들어 있으면 멈춘다(두 번 넣지 않는다). 다른 곳은 건드리지 않는다.
"""
import os, re, sys, json, base64, io

H = os.path.dirname(os.path.abspath(__file__))
lo, hi = int(sys.argv[1]), int(sys.argv[2])
files = sys.argv[3:]
meta = {o['i']: o for o in json.load(open(os.path.join(H, 'labs_meta_1115.json'), encoding='utf-8'))}
parts = []
for i in range(lo, hi + 1):
    p = os.path.join(H, 'webp_1115', f'{i}.webp')
    b = base64.b64encode(open(p, 'rb').read()).decode()
    t = re.sub(r'[“”"<>]', '', meta[i]['t']).replace("'", "\\'")
    parts.append(f"[{i},'{b}','{t}']")
add = ',' + ','.join(parts)
TAIL = "];\nfor(const [i,b,t] of HFT)"
OLDC = '생성 썸네일 356장 — 2026-09-17.'
NEWC = f'생성 썸네일 356장 — 2026-09-17. LAB {lo + 1}~{hi + 1} {hi - lo + 1}장 덧붙임 — 2026-11-16.'
for f in files:
    s = io.open(f, encoding='utf-8', newline='').read()
    tail = TAIL if s.count(TAIL) == 1 else TAIL.replace('\n', '\r\n')   # dist 는 줄끝이 CRLF
    assert s.count(tail) == 1, (f, 'HFT 끝 표시 개수', s.count(tail))
    k = s.index(tail)
    a = s.rfind('const HFT=[', 0, k)
    assert a > 0
    body = s[a:k]
    for i in range(lo, hi + 1):
        assert f"[{i},'" not in body, (f, '이미 있음', i)
    assert f"[{lo - 1},'" in body, (f, '앞 색인 없음', lo - 1)
    n0 = len(s)
    s = s[:k] + add + s[k:]
    if s.count(OLDC) == 1:
        s = s.replace(OLDC, NEWC)
    io.open(f, 'w', encoding='utf-8', newline='').write(s)
    print(f, n0, '->', len(s), '+', len(s) - n0)
print('덧붙인 장수', len(parts), '글자', len(add))
