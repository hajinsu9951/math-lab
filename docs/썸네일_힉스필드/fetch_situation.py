# -*- coding: utf-8 -*-
"""오늘의 문제 옆에 넣을 상황 삽화를 받아 webp 로 줄인다.

  사용: python fetch_situation.py <LAB번호> <URL>
  결과: 상황삽화/{LAB번호}.webp  (원본 png 도 상황삽화/png 에 남긴다)
"""
import io
import os
import sys
import urllib.request

from PIL import Image

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8")

H = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(H, "상황삽화")
PNG = os.path.join(OUT, "png")
os.makedirs(PNG, exist_ok=True)

lab, url = sys.argv[1], sys.argv[2]
raw = urllib.request.urlopen(
    urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"}), timeout=120
).read()

png_path = os.path.join(PNG, f"{lab}.png")
with open(png_path, "wb") as f:
    f.write(raw)

im = Image.open(io.BytesIO(raw)).convert("RGB")
# 카드 안에서 쓰는 크기라 긴 변 900px 이면 넉넉하다
im.thumbnail((900, 900), Image.LANCZOS)
webp_path = os.path.join(OUT, f"{lab}.webp")
im.save(webp_path, "WEBP", quality=86, method=6)

print(f"원본 {len(raw):,} 바이트  {Image.open(io.BytesIO(raw)).size}")
print(f"webp {os.path.getsize(webp_path):,} 바이트  {im.size}")
print(webp_path)
