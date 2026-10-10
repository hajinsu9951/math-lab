# -*- coding: utf-8 -*-
"""장 도입 삽화를 내려받아 책 크기로 줄인다 (curl 로 받아 온 파일을 쓴다).

photos.py 는 파이썬이 직접 내려받는데, 이 환경에서는 가끔 연결이 끊긴다.
그래서 받는 일은 curl 에 맡기고 이 스크립트는 **줄이고 캡션을 다는 일**만 한다.

사용: curl -sS -L -o _tmp.png "<URL>"
      python docs/단행본/fetch_photo.py ch05 _tmp.png "캡션 (재현 그림)"
"""
import io
import json
import os
import sys

try:
    sys.stdout.reconfigure(encoding='utf-8')
except Exception:
    pass

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(HERE, '삽화')
CAPS = os.path.join(OUT, '_캡션.json')
LONG, QUALITY = 1400, 82


def main(name, src, caption=''):
    os.makedirs(OUT, exist_ok=True)
    from PIL import Image
    im = Image.open(src).convert('RGB')
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
    sys.stdout.write('%s  %d×%d  %d KB\n' % (name, im.size[0], im.size[1],
                                             os.path.getsize(p) // 1024))


if __name__ == '__main__':
    main(sys.argv[1], sys.argv[2], sys.argv[3] if len(sys.argv) > 3 else '')
