# -*- coding: utf-8 -*-
"""장 도입 삽화를 내려받아 책에 넣을 크기로 줄인다 (힉스필드에서 만든 사진).

왜 webp 인가
  책 한 권에 스무 장이 들어간다. png 그대로면 권당 40 MB 를 넘어 PDF 가 무거워진다.
  긴 변 1400 px · webp 품질 82 면 인쇄 72 mm 폭에서 300 dpi 를 넘고 파일은 150 KB 안팎이다.

사용: python docs/단행본/photos.py ch01 <URL> ["캡션"]
      python docs/단행본/photos.py --목록
"""
import io
import json
import os
import sys
import urllib.request

try:
    sys.stdout.reconfigure(encoding='utf-8')
except Exception:
    pass

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(HERE, '삽화')
CAPS = os.path.join(OUT, '_캡션.json')
LONG, QUALITY = 1400, 82


def save(name, url, caption=''):
    os.makedirs(OUT, exist_ok=True)
    req = urllib.request.Request(url, headers={'User-Agent': 'book-builder'})
    raw = urllib.request.urlopen(req, timeout=120).read()
    from PIL import Image
    im = Image.open(io.BytesIO(raw)).convert('RGB')
    w, h = im.size
    if max(w, h) > LONG:
        s = LONG / max(w, h)
        im = im.resize((round(w * s), round(h * s)), Image.LANCZOS)
    p = os.path.join(OUT, name + '.webp')
    im.save(p, 'WEBP', quality=QUALITY, method=6)
    caps = {}
    if os.path.exists(CAPS):
        caps = json.load(io.open(CAPS, encoding='utf-8'))
    if caption:
        caps[name] = caption
    io.open(CAPS, 'w', encoding='utf-8').write(json.dumps(caps, ensure_ascii=False, indent=1))
    sys.stdout.write('%s  %d×%d  %d KB\n'
                     % (name, im.size[0], im.size[1], os.path.getsize(p) // 1024))


def main(argv):
    if not argv or argv[0] == '--목록':
        if os.path.isdir(OUT):
            for fn in sorted(os.listdir(OUT)):
                if fn.endswith('.webp'):
                    sys.stdout.write('  %-10s %4d KB\n'
                                     % (fn[:-5], os.path.getsize(os.path.join(OUT, fn)) // 1024))
        return 0
    save(argv[0], argv[1], argv[2] if len(argv) > 2 else '')
    return 0


if __name__ == '__main__':
    main(sys.argv[1:])
