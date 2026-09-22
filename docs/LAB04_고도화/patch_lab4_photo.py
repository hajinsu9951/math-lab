# -*- coding: utf-8 -*-
"""LAB 04 의 메인 이미지를 선화에서 **사진**으로 바꾼다.

도입부(오늘의 문제)는 실제 장면이 낫다 — 책상 위 폰과 두 요금제 안내문, 모눈 노트에 그은 두 직선.
개념을 설명하는 선화들(기본료와 기울기 · 교점=해=경계 · 차액의 부호)은 「생각 열기」에 그대로 둔다.

사용: python docs/LAB04_고도화/patch_lab4_photo.py src/40-demos.js
"""
import sys, os, base64, re

HERE = os.path.dirname(os.path.abspath(__file__))
IMGD = os.path.join(os.path.dirname(HERE), '썸네일_힉스필드', '상황삽화')
ALT = '책상 위에 놓인 휴대폰과 색이 다른 두 요금제 안내문, 그리고 두 직선이 그려진 모눈 노트'


def main(path):
    p = os.path.join(IMGD, 'p04_hero.webp')
    assert os.path.exists(p), 'p04_hero.webp 가 없습니다'
    b = base64.b64encode(open(p, 'rb').read()).decode()
    new = '<img class="lsimg" src="data:image/webp;base64,%s" alt="%s">' % (b, ALT)

    h = open(path, encoding='utf-8').read()
    i = h.find('LESSON[4]={')
    j = h.find('LESSON[5]={', i)
    assert i > 0 and j > i, 'LESSON[4] 자리를 못 찾음'
    seg = h[i:j]

    if ALT in seg:
        print('이미 사진으로 바뀌어 있음')
        return

    m = re.search(r'<img class="lsimg"[^>]*>', seg)
    assert m, 'LAB 04 의 메인 이미지를 못 찾음'
    seg = seg[:m.start()] + new + seg[m.end():]
    h = h[:i] + seg + h[j:]
    open(path, 'w', encoding='utf-8').write(h)
    print('LAB 04 메인 이미지를 사진으로 교체 · 파일', round(len(h.encode('utf-8')) / 1048576, 2), 'MB')


if __name__ == '__main__':
    main(sys.argv[1])
