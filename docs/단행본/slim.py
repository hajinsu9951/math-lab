# -*- coding: utf-8 -*-
"""인쇄용 PDF 를 «보기용» 으로 가볍게 만든다 — 원본은 손대지 않는다.

왜 필요한가
  인쇄용 PDF 는 사진을 높은 해상도로 품고 있어 40 MB 를 넘는다. 휴대전화로 받아 보거나
  메일로 보내기에는 무겁다. 그래서 **글과 그림(벡터)은 그대로 두고 사진만 줄인** 사본을 만든다.
  벡터로 그린 계산 그림과 QR 은 해상도가 없으므로 전혀 손상되지 않는다.

사용: python docs/단행본/slim.py docs/단행본/손으로만지는중학수학_1권_중1.pdf
      → 같은 자리에 「…_보기용.pdf」 를 만든다
"""
import io
import os
import sys

try:
    sys.stdout.reconfigure(encoding='utf-8')
except Exception:
    pass

LONG = 1100          # 사진의 긴 변을 이 픽셀로 줄인다 (A4 인쇄는 아니고 화면 보기용)
QUALITY = 62


def main(src, dpi=120, quality=62):
    import pymupdf
    out = src.replace('.pdf', '_보기용.pdf')
    doc = pymupdf.open(src)
    # 사진만 다시 압축한다 — 벡터로 그린 계산 그림과 QR 은 해상도가 없어 손대지 않는다.
    doc.rewrite_images(dpi_threshold=dpi + 20, dpi_target=dpi, quality=quality)
    doc.save(out, garbage=4, deflate=True, clean=True)
    a, b = os.path.getsize(src) / 1048576.0, os.path.getsize(out) / 1048576.0
    sys.stdout.write('%s%s  %.1f MB → %.1f MB (사진을 %d dpi · 품질 %d 로)%s'
                     % (os.path.basename(out), chr(10), a, b, dpi, quality, chr(10)))
    return out


if __name__ == '__main__':
    main(sys.argv[1])
