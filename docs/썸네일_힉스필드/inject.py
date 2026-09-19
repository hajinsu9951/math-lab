# -*- coding: utf-8 -*-
"""webp/{i}.webp 356장을 base64 로 mlpush/index.html 의 THUMBS 배열 뒤에 덮어쓴다 (HF_THUMBS 블록)."""
import os, re, base64, json, sys
H = os.path.dirname(os.path.abspath(__file__))
IDX = sys.argv[1]
meta = json.load(open(sys.argv[2], encoding='utf-8'))
h = open(IDX, encoding='utf-8').read()
# 기존 블록 제거
h = re.sub(r'\n/\* HF_THUMBS start \*/.*?/\* HF_THUMBS end \*/\n', '\n', h, flags=re.S)
parts = []; missing = []
for i in range(356):
    p = os.path.join(H, 'webp', f'{i}.webp')
    if not os.path.exists(p): missing.append(i); continue
    b = base64.b64encode(open(p, 'rb').read()).decode()
    t = re.sub(r'[“”"<>]', '', meta[i]['t']).replace("'", "\'")
    parts.append(f"[{i},'{b}','{t}']")
blk = ("\n/* HF_THUMBS start */\n/* 힉스필드(gpt_image_2_5) 생성 썸네일 356장 — 2026-09-17. SVG 썸네일을 덮어쓴다. */\n"
       "(function(){const HFT=[" + ",".join(parts) + "];\n"
       "for(const [i,b,t] of HFT){THUMBS[i]='<img class=\"thumb hf\" src=\"data:image/webp;base64,'+b+'\" alt=\"'+t+'\" loading=\"lazy\">';}\n"
       "})();\n/* HF_THUMBS end */\n")
# THUMBS 배열 끝 다음에 삽입: 'THUMBS = [' 이후 첫 '\n];'
i0 = h.find('THUMBS = ['); assert i0 > 0
j = h.find('\n];', i0); assert j > 0
h = h[:j + 3] + blk + h[j + 3:]
if 'img.thumb.hf' not in h:
    h = h.replace('</style>', '\nimg.thumb.hf{display:block;width:100%;height:auto;aspect-ratio:15/8;object-fit:cover;background:#fff}\n</style>', 1)
open(IDX, 'w', encoding='utf-8').write(h)
print('injected', len(parts), 'missing', missing, 'size MB', round(len(h.encode('utf-8'))/1048576, 2))
