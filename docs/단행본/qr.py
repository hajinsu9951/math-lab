# -*- coding: utf-8 -*-
"""장마다 실을 QR 코드를 만든다 — 찍으면 그 실험실이 바로 열린다.

가리키는 곳
  https://hajinsu9951.github.io/math-lab/#lab<번호>
  주소 끝의 #lab25 를 페이지가 읽어 그 실험실을 바로 연다
  (docs/단행본/patch_qr_route.py 가 그 길을 붙였다).

왜 SVG 인가
  인쇄에서 QR 은 선이 뭉개지면 못 읽는다. 그림 파일로 넣으면 확대·축소에서 흐려지므로
  **벡터(SVG)** 로 넣어 어느 크기로 찍어도 모서리가 살아 있게 한다.

오류 정정은 M 단계(약 15 %)로 둔다 — 책이 접히거나 그림자가 져도 읽히도록.

사용: python docs/단행본/qr.py 25        (확인용으로 하나 찍어 본다)
"""
import io
import re
import sys

import qrcode
import qrcode.image.svg as qsvg

try:
    sys.stdout.reconfigure(encoding='utf-8')
except Exception:
    pass

BASE = 'https://hajinsu9951.github.io/math-lab/'
TAG = re.compile(r'</?[A-Za-z][^<>]*>')


def slug(title):
    """실험실 이름을 주소에 쓸 꼴로 — 띄어쓰기와 기호를 지운다.

    「소인수분해와 암호」 → 소인수분해와암호
    「수직선 위의 정수 — 빼기는 왜 반대로 가는가」 → 수직선위의정수
    (줄표 뒤의 부제는 뗀다. 주소가 길어지면 QR 이 촘촘해져 읽기 어렵다.)
    """
    t = TAG.sub('', str(title or ''))
    t = re.split(r'[—–]', t)[0]
    return re.sub(r'[^0-9A-Za-z가-힣]', '', t)


def url(title):
    """주소. 한글은 퍼센트 인코딩하지 않고 그대로 둔다 —
    QR 은 UTF-8 바이트를 그대로 담을 수 있고, 책에 실리는 주소 줄도 읽히는 글이어야 한다."""
    return BASE + '#' + slug(title)


def svg(title, mm=26):
    """실험실 번호 하나에 대한 QR 을 SVG 조각으로 돌려준다 (책에 그대로 끼운다)."""
    q = qrcode.QRCode(error_correction=qrcode.constants.ERROR_CORRECT_M, border=2)
    q.add_data(url(title))
    q.make(fit=True)
    img = q.make_image(image_factory=qsvg.SvgPathFillImage)
    buf = io.BytesIO()
    img.save(buf)
    s = buf.getvalue().decode('utf-8')
    s = re.sub(r'<\?xml[^>]*\?>\s*', '', s)                 # 선언문은 뺀다 — 조각으로 넣는다
    s = re.sub(r'width="[^"]*"\s*height="[^"]*"',
               'width="%dmm" height="%dmm"' % (mm, mm), s, count=1)
    s = s.replace('<svg ', '<svg shape-rendering="crispEdges" ', 1)
    return s


if __name__ == '__main__':
    t = sys.argv[1] if len(sys.argv) > 1 else '소인수분해와 암호'
    out = svg(t)
    sys.stdout.write(url(t) + '\n조각 ' + str(len(out)) + '자\n')
