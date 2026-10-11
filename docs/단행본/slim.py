# -*- coding: utf-8 -*-
"""인쇄용 책에서 «보기용» 사본을 만든다 — 원본은 손대지 않는다.

왜 필요한가
  인쇄용 PDF 는 사진을 높은 해상도로 품고 있어 50 MB 를 넘는다. 휴대전화로 받아 보거나
  메일로 보내기에는 무겁다.

어떻게 하는가 (PDF 를 주무르지 않는다)
  다 만들어진 PDF 의 그림을 바꿔 끼우는 길은 한 번 해 보고 접었다 — 크롬이 만든 PDF 에서
  pymupdf 의 rewrite_images 가 XObject 를 못 찾고, 되레 파일이 커졌다.
  그래서 **HTML 단계에서 사진만 줄여** 다시 찍는다. 계산 그림과 QR 은 인라인 SVG(벡터)라
  손댈 것이 없고, 줄어드는 것은 사진뿐이다.

사용: python docs/단행본/slim.py docs/단행본/손으로만지는중학수학_1권_중1.html
      → 같은 자리에 「…_보기용.html」 을 만든다. 그다음 render.mjs 로 찍으면 된다.
"""
import base64
import io
import os
import re
import sys

try:
    sys.stdout.reconfigure(encoding='utf-8')
except Exception:
    pass

LONG = 900           # 사진의 긴 변 (화면으로 볼 용도)
QUALITY = 58
URI = re.compile(r'data:image/(png|jpe?g|webp);base64,([A-Za-z0-9+/=]+)')


def shrink(kind, b64, long_side, quality):
    from PIL import Image
    raw = base64.b64decode(b64)
    im = Image.open(io.BytesIO(raw))
    w, h = im.size
    if max(w, h) > long_side:
        s = long_side / float(max(w, h))
        im = im.resize((max(1, round(w * s)), max(1, round(h * s))), Image.LANCZOS)
    buf = io.BytesIO()
    im.convert('RGB').save(buf, 'JPEG', quality=quality, optimize=True,
                           progressive=True)
    if buf.tell() >= len(raw):
        return None                       # 더 커지면 그대로 둔다
    return ('data:image/jpeg;base64,'
            + base64.b64encode(buf.getvalue()).decode('ascii')), len(raw), buf.tell()


def main(src, long_side=LONG, quality=QUALITY):
    out = src.replace('.html', '_보기용.html')
    h = io.open(src, encoding='utf-8').read()
    done = [0, 0, 0]                      # 바꾼 수 · 전 · 후

    def one(m):
        try:
            r = shrink(m.group(1), m.group(2), long_side, quality)
        except Exception:
            return m.group(0)
        if not r:
            return m.group(0)
        new, before, after = r
        done[0] += 1
        done[1] += before
        done[2] += after
        return new

    h2 = URI.sub(one, h)
    io.open(out, 'w', encoding='utf-8', newline='\n').write(h2)
    a, b = os.path.getsize(src) / 1048576.0, os.path.getsize(out) / 1048576.0
    sys.stdout.write('%s\n  사진 %d 장 · %.1f MB → %.1f MB (긴 변 %d px · 품질 %d)\n'
                     % (os.path.basename(out), done[0], a, b, long_side, quality))
    sys.stdout.write('  이제 찍으십시오 — node docs/단행본/render.mjs "%s"\n' % out)
    return out


if __name__ == '__main__':
    main(sys.argv[1])
