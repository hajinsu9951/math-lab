# -*- coding: utf-8 -*-
"""카드 그림 한 장 받기 · 변환 (2026-11-15, LAB 357~386 = 색인 356~385).
쓰는 법:  py -3 -X utf8 fetch_1115.py <색인 i> <그림 주소> [시도 번호]
- raw_1115/{i}.png 로 내려받고(이미 있으면 raw_1115/{i}_try{n}.png 로 옛 것을 옮긴 뒤 새로 받음)
- webp_1115/{i}.webp (360x192, 15:8 가운데 자르기, 품질 62) 로 변환한다. 기존 fetch.py 와 같은 변환이다.
"""
import os, sys, shutil, urllib.request
from PIL import Image

H = os.path.dirname(os.path.abspath(__file__))
RAW = os.path.join(H, 'raw_1115')
OUT = os.path.join(H, 'webp_1115')
W, Hh = 360, 192


def main():
    i = int(sys.argv[1])
    url = sys.argv[2]
    if not url.startswith('https://'):
        raise SystemExit('주소가 https 가 아님')
    os.makedirs(RAW, exist_ok=True)
    os.makedirs(OUT, exist_ok=True)
    raw = os.path.join(RAW, f'{i}.png')
    if os.path.exists(raw):
        n = 1
        while os.path.exists(os.path.join(RAW, f'{i}_try{n}.png')):
            n += 1
        shutil.move(raw, os.path.join(RAW, f'{i}_try{n}.png'))
    urllib.request.urlretrieve(url, raw)
    im = Image.open(raw).convert('RGB')
    src = im.size
    r = max(W / im.width, Hh / im.height)
    im = im.resize((round(im.width * r), round(im.height * r)), Image.LANCZOS)
    l = (im.width - W) // 2
    t = (im.height - Hh) // 2
    im = im.crop((l, t, l + W, t + Hh))
    out = os.path.join(OUT, f'{i}.webp')
    im.save(out, 'WEBP', quality=62, method=6)
    print(f'i={i} raw={src} -> {out} {os.path.getsize(out)} bytes')


if __name__ == '__main__':
    main()
