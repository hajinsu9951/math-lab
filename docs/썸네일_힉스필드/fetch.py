# -*- coding: utf-8 -*-
"""urls.txt (index url) 를 읽어 raw/{i}.png 내려받고 webp/{i}.webp (360x192, 15:8 중앙 자르기) 로 변환. 이미 있으면 건너뜀."""
import os, sys, io, urllib.request
from PIL import Image
H = os.path.dirname(os.path.abspath(__file__))
W, Hh = 360, 192
done = 0; miss = []
for line in open(os.path.join(H, 'urls.txt'), encoding='utf-8'):
    p = line.split()
    if len(p) < 2: continue
    i, url = int(p[0]), p[1]
    raw = os.path.join(H, 'raw', f'{i}.png'); out = os.path.join(H, 'webp', f'{i}.webp')
    if os.path.exists(out): continue
    try:
        if not os.path.exists(raw):
            urllib.request.urlretrieve(url, raw)
        im = Image.open(raw).convert('RGB')
        r = max(W / im.width, Hh / im.height); im = im.resize((round(im.width * r), round(im.height * r)), Image.LANCZOS)
        l = (im.width - W) // 2; t = (im.height - Hh) // 2; im = im.crop((l, t, l + W, t + Hh))
        im.save(out, 'WEBP', quality=62, method=6); done += 1
    except Exception as e:
        miss.append((i, str(e)[:80]))
n = len(os.listdir(os.path.join(H, 'webp'))); tot = sum(os.path.getsize(os.path.join(H, 'webp', f)) for f in os.listdir(os.path.join(H, 'webp')))
print(f'new {done}, total webp {n}, avg {tot/max(n,1)/1024:.1f} KB, sum {tot/1024:.0f} KB', 'MISS', miss)
